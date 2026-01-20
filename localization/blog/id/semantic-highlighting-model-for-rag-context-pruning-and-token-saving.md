---
id: semantic-highlighting-model-for-rag-context-pruning-and-token-saving.md
title: >-
  Bagaimana Kami Membangun Model Penyorotan Semantik untuk Pemangkasan Konteks
  RAG dan Penyimpanan Token
author: 'Cheney Zhang, Jiang Chen'
date: 2026-1-19
cover: assets.zilliz.com/semantic_highlight2_cover_1406d8b11e.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  semantic highlighting, RAG, context pruning, RAG noise filtering, context
  engineering
meta_title: |
  Semantic Highlighting for RAG Context Pruning and Token Saving
desc: >-
  Pelajari bagaimana Zilliz membangun model penyorotan semantik untuk
  pemfilteran noise RAG, pemangkasan konteks, dan penyimpanan token menggunakan
  arsitektur khusus penyandi, penalaran LLM, dan data pelatihan dwibahasa
  berskala besar.
origin: >-
  https://milvus.io/blog/semantic-highlighting-model-for-rag-context-pruning-and-token-saving.md
---
<h2 id="The-Problem-RAG-Noise-and-Token-Waste" class="common-anchor-header">Masalahnya: Kebisingan RAG dan Pemborosan Token<button data-href="#The-Problem-RAG-Noise-and-Token-Waste" class="anchor-icon" translate="no">
      <svg translate="no"
        aria-hidden="true"
        focusable="false"
        height="20"
        version="1.1"
        viewBox="0 0 16 16"
        width="16"
      >
        <path
          fill="#0092E4"
          fill-rule="evenodd"
          d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"
        ></path>
      </svg>
    </button></h2><p><strong>Pencarian vektor</strong> merupakan fondasi yang kuat untuk sistem RAG - asisten perusahaan, agen AI, bot dukungan pelanggan, dan banyak lagi. Sistem ini dapat diandalkan untuk menemukan dokumen yang penting. Namun, pencarian saja tidak menyelesaikan masalah konteks. Bahkan indeks yang disetel dengan baik pun hanya mengembalikan potongan-potongan yang relevan secara luas, sementara hanya sebagian kecil kalimat di dalam potongan-potongan tersebut yang benar-benar menjawab pertanyaan.</p>
<p>Dalam sistem produksi, kesenjangan ini segera muncul. Satu kueri dapat menarik lusinan dokumen, yang masing-masing terdiri dari ribuan token. Hanya beberapa kalimat yang berisi sinyal yang sebenarnya; sisanya adalah konteks yang membengkakkan penggunaan token, memperlambat inferensi, dan sering kali mengalihkan perhatian LLM. Masalahnya menjadi semakin jelas dalam alur kerja agen, di mana kueri itu sendiri merupakan hasil dari penalaran multi-langkah dan hanya mencocokkan sebagian kecil dari teks yang diambil.</p>
<p>Hal ini menciptakan kebutuhan yang jelas akan model yang dapat <em><strong>mengidentifikasi dan menyoroti</strong></em> <em>kalimat-kalimat yang berguna dan mengabaikan sisanya-pada dasarnya</em>, pemfilteran relevansi tingkat kalimat, atau yang disebut oleh banyak tim sebagai pemangkasan <a href="https://milvus.io/blog/llm-context-pruning-a-developers-guide-to-better-rag-and-agentic-ai-results.md"><strong>konteks</strong></a>. Tujuannya sederhana: mempertahankan bagian yang penting dan membuang noise sebelum mencapai LLM.</p>
<p>Penyorotan berbasis kata kunci tradisional tidak dapat menyelesaikan masalah ini. Sebagai contoh, jika pengguna bertanya, "Bagaimana cara meningkatkan efisiensi eksekusi kode Python?", penyorot kata kunci akan memilih "Python" dan "efisiensi", tetapi melewatkan kalimat yang sebenarnya menjawab pertanyaan - "Gunakan operasi vektor NumPy alih-alih perulangan" - karena tidak ada kata kunci yang sama dengan kueri. Yang kita butuhkan adalah pemahaman semantik, bukan pencocokan string.</p>
<h2 id="A-Semantic-Highlighting-Model-for-RAG-Noise-Filtering-and-Context-Pruning" class="common-anchor-header">Model Penyorotan Semantik untuk Penyaringan Derau RAG dan Pemangkasan Konteks<button data-href="#A-Semantic-Highlighting-Model-for-RAG-Noise-Filtering-and-Context-Pruning" class="anchor-icon" translate="no">
      <svg translate="no"
        aria-hidden="true"
        focusable="false"
        height="20"
        version="1.1"
        viewBox="0 0 16 16"
        width="16"
      >
        <path
          fill="#0092E4"
          fill-rule="evenodd"
          d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"
        ></path>
      </svg>
    </button></h2><p>Untuk mempermudah pembangun RAG, kami melatih dan membuat sumber terbuka <a href="https://huggingface.co/zilliz/semantic-highlight-bilingual-v1"><strong>model Penyorotan Semantik</strong></a> yang mengidentifikasi dan menyoroti kalimat-kalimat dalam dokumen yang diambil yang secara semantik lebih selaras dengan kueri. Model ini saat ini memberikan kinerja canggih pada bahasa Inggris dan Mandarin dan dirancang untuk dimasukkan langsung ke dalam pipa RAG yang sudah ada.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/context_pruning_80f7b16280.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Detail Model</strong></p>
<ul>
<li><p><strong>HuggingFace:</strong> <a href="https://huggingface.co/zilliz/semantic-highlight-bilingual-v1">zilliz/semantic-highlight-bilingual-v1</a></p></li>
<li><p><strong>Lisensi</strong> MIT (ramah komersial)</p></li>
<li><p><strong>Arsitektur:</strong> Model khusus penyandi 0.6B berdasarkan BGE-M3 Reranker v2</p></li>
<li><p><strong>Jendela Konteks:</strong> 8192 token</p></li>
<li><p><strong>Bahasa yang didukung:</strong> Bahasa Inggris dan Mandarin</p></li>
</ul>
<p>Penyorotan Semantik memberikan sinyal relevansi yang diperlukan untuk memilih hanya bagian yang berguna dari dokumen yang telah lama diambil. Dalam praktiknya, model ini memungkinkan:</p>
<ul>
<li><p><strong>Peningkatan kemampuan interpretasi</strong>, menunjukkan bagian mana dari dokumen yang benar-benar penting</p></li>
<li><p><strong>Pengurangan 70-80% dalam biaya token</strong> dengan mengirimkan hanya kalimat yang disorot ke LLM</p></li>
<li><p><strong>Kualitas jawaban yang lebih baik</strong>, karena model ini mengurangi konteks yang tidak relevan</p></li>
<li><p><strong>Debugging yang lebih mudah</strong>, karena teknisi dapat memeriksa kecocokan tingkat kalimat secara langsung</p></li>
</ul>
<h3 id="Evaluation-Results-Achieving-SOTA-Performance" class="common-anchor-header">Hasil Evaluasi: Mencapai Kinerja SOTA</h3><p>Kami mengevaluasi model Penyorotan Semantik kami di berbagai set data yang mencakup bahasa Inggris dan Cina, baik dalam kondisi di dalam maupun di luar domain.</p>
<p>Rangkaian tolok ukur meliputi:</p>
<ul>
<li><p><strong>QA multi-bentang bahasa Inggris:</strong> multispanqa</p></li>
<li><p><strong>Wikipedia bahasa Inggris di luar domain:</strong> wikitext2</p></li>
<li><p><strong>QA multi-bentang bahasa Mandarin:</strong> multispanqa_zh</p></li>
<li><p><strong>Wikipedia di luar domain bahasa Mandarin:</strong> wikitext2_zh</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/benchmarking_results_25545c952f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Model yang dievaluasi meliputi:</p>
<ul>
<li><p>Seri Open Provence</p></li>
<li><p>Seri Provence/XProvence dari Naver</p></li>
<li><p>Penyorot semantik OpenSearch</p></li>
<li><p>Model dwibahasa terlatih kami: <a href="https://huggingface.co/zilliz/semantic-highlight-bilingual-v1">zilliz/semantic-highlight-bilingual-v1</a></p></li>
</ul>
<p>Di keempat dataset, model kami mencapai peringkat teratas. Lebih penting lagi, ini adalah <em>satu-satunya</em> model yang berkinerja baik secara konsisten pada bahasa Inggris dan Mandarin. Model yang bersaing hanya berfokus pada bahasa Inggris atau menunjukkan penurunan kinerja yang jelas pada teks bahasa Mandarin.</p>
<h2 id="How-We-Built-This-Semantic-Highlighting-Model" class="common-anchor-header">Bagaimana Kami Membangun Model Penyorotan Semantik Ini<button data-href="#How-We-Built-This-Semantic-Highlighting-Model" class="anchor-icon" translate="no">
      <svg translate="no"
        aria-hidden="true"
        focusable="false"
        height="20"
        version="1.1"
        viewBox="0 0 16 16"
        width="16"
      >
        <path
          fill="#0092E4"
          fill-rule="evenodd"
          d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"
        ></path>
      </svg>
    </button></h2><p>Melatih model untuk tugas ini bukanlah bagian yang sulit; melatih model yang <em>baik</em> yang menangani masalah sebelumnya dan memberikan kinerja yang mendekati SOTA adalah pekerjaan yang sesungguhnya. Pendekatan kami berfokus pada dua hal:</p>
<ul>
<li><p><strong>Arsitektur model:</strong> menggunakan desain khusus penyandi untuk inferensi yang cepat.</p></li>
<li><p><strong>Data pelatihan:</strong> menghasilkan label relevansi berkualitas tinggi menggunakan LLM yang mampu bernalar dan membuat data skala dengan kerangka kerja inferensi lokal.</p></li>
</ul>
<h3 id="Model-Architecture" class="common-anchor-header">Arsitektur Model</h3><p>Kami membangun model sebagai jaringan <strong>khusus penyandi</strong> ringan yang memperlakukan pemangkasan konteks sebagai <strong>tugas penilaian relevansi tingkat token</strong>. Desain ini terinspirasi oleh <a href="https://arxiv.org/html/2501.16214v1">Provence</a>, pendekatan pemangkasan konteks yang diperkenalkan oleh Naver di ICLR 2025, yang membingkai ulang pemangkasan dari "memilih potongan yang tepat" menjadi "menilai setiap token." Pembingkaian tersebut selaras secara alami dengan penyorotan semantik, di mana sinyal berbutir halus sangat penting.</p>
<p>Model encoder-only bukanlah arsitektur terbaru, tetapi tetap sangat praktis di sini: model ini cepat, mudah diskalakan, dan dapat menghasilkan nilai relevansi untuk semua posisi token secara paralel. Untuk sistem RAG produksi, keunggulan kecepatan tersebut jauh lebih penting daripada menggunakan model decoder yang lebih besar.</p>
<p>Setelah kami menghitung skor relevansi tingkat token, kami menggabungkannya ke dalam skor <strong>tingkat kalimat</strong>. Langkah ini mengubah sinyal token yang berisik menjadi metrik relevansi yang stabil dan dapat ditafsirkan. Kalimat di atas ambang batas yang dapat dikonfigurasi akan disorot; yang lainnya akan disaring. Hal ini menghasilkan mekanisme yang sederhana dan dapat diandalkan untuk memilih kalimat yang benar-benar penting bagi kueri.</p>
<h3 id="Inference-Process" class="common-anchor-header">Proses Inferensi</h3><p>Pada saat proses, model penyorotan semantik kami mengikuti alur sederhana:</p>
<ol>
<li><p><strong>Masukan-</strong> Proses dimulai dengan kueri pengguna. Dokumen yang diambil diperlakukan sebagai konteks kandidat untuk evaluasi relevansi.</p></li>
<li><p><strong>Pemrosesan Model-</strong> Kueri dan konteks digabungkan menjadi satu urutan: [BOS] + Kueri + Konteks</p></li>
<li><p><strong>Penilaian Token-</strong> Setiap token dalam konteks diberi skor relevansi antara 0 dan 1, yang mencerminkan seberapa kuat kaitannya dengan kueri.</p></li>
<li><p><strong>Agregasi Kalimat-</strong> Skor token diagregasi pada tingkat kalimat, biasanya dengan rata-rata, untuk menghasilkan skor relevansi untuk setiap kalimat.</p></li>
<li><p><strong>Penyaringan Ambang Batas-</strong> Kalimat dengan skor di atas ambang batas yang dapat dikonfigurasi disorot dan dipertahankan, sementara kalimat dengan skor rendah disaring sebelum diteruskan ke LLM hilir.</p></li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/semantic_highlighting_workflows_db3d12a666.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Base-Model-BGE-M3-Reranker-v2" class="common-anchor-header">Model Dasar: BGE-M3 Reranker v2</h3><p>Kami memilih BGE-M3 Reranker v2 sebagai model dasar karena beberapa alasan:</p>
<ol>
<li><p>Menggunakan arsitektur Encoder yang cocok untuk penilaian token dan kalimat</p></li>
<li><p>Mendukung berbagai bahasa dengan pengoptimalan untuk bahasa Inggris dan Mandarin</p></li>
<li><p>Menyediakan jendela konteks 8192 token yang sesuai untuk dokumen RAG yang lebih panjang</p></li>
<li><p>Mempertahankan 0,6B parameter - cukup kuat tanpa menjadi berat secara komputasi</p></li>
<li><p>Memastikan pengetahuan dunia yang cukup dalam model dasar</p></li>
<li><p>Dilatih untuk pemeringkatan ulang, yang sangat sesuai dengan tugas penilaian relevansi</p></li>
</ol>
<h2 id="Training-Data-LLM-Annotation-with-Reasoning" class="common-anchor-header">Data Pelatihan: Anotasi LLM dengan Penalaran<button data-href="#Training-Data-LLM-Annotation-with-Reasoning" class="anchor-icon" translate="no">
      <svg translate="no"
        aria-hidden="true"
        focusable="false"
        height="20"
        version="1.1"
        viewBox="0 0 16 16"
        width="16"
      >
        <path
          fill="#0092E4"
          fill-rule="evenodd"
          d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"
        ></path>
      </svg>
    </button></h2><p>Setelah kami menyelesaikan arsitektur model, tantangan berikutnya adalah membangun dataset yang benar-benar dapat melatih model yang andal. Kami mulai dengan melihat bagaimana Open Provence menangani hal ini. Pendekatan mereka menggunakan dataset QA publik dan LLM kecil untuk melabeli kalimat mana yang relevan. Pendekatan ini berskala besar dan mudah diotomatisasi, sehingga menjadi dasar yang baik bagi kami.</p>
<p>Namun kami segera mengalami masalah yang sama seperti yang mereka jelaskan: jika Anda meminta LLM untuk mengeluarkan label tingkat kalimat secara langsung, hasilnya tidak selalu stabil. Beberapa label sudah benar, yang lain dipertanyakan, dan sulit untuk membersihkannya setelah itu. Anotasi manual sepenuhnya juga bukan pilihan-kami membutuhkan lebih banyak data daripada yang bisa kami beri label secara manual.</p>
<p>Untuk meningkatkan stabilitas tanpa mengorbankan skalabilitas, kami membuat satu perubahan: LLM harus menyediakan cuplikan penalaran singkat untuk setiap label yang dihasilkannya. Setiap contoh pelatihan mencakup kueri, dokumen, rentang kalimat, dan penjelasan singkat mengapa sebuah kalimat relevan atau tidak relevan. Penyesuaian kecil ini membuat anotasi menjadi jauh lebih konsisten dan memberikan kami sesuatu yang konkret untuk dijadikan referensi ketika memvalidasi atau men-debug dataset.</p>
<p>Menyertakan alasan ternyata sangat berharga:</p>
<ul>
<li><p><strong>Kualitas anotasi yang lebih tinggi:</strong> Menuliskan alasan berfungsi sebagai pemeriksaan mandiri, yang mengurangi label yang acak atau tidak konsisten.</p></li>
<li><p><strong>Pengamatan yang lebih baik:</strong> Kita dapat melihat <em>mengapa</em> sebuah kalimat dipilih daripada memperlakukan label sebagai kotak hitam.</p></li>
<li><p><strong>Debugging yang lebih mudah:</strong> Ketika ada sesuatu yang terlihat salah, penalaran membuatnya mudah untuk mengetahui apakah masalahnya adalah perintah, domain, atau logika anotasi.</p></li>
<li><p><strong>Data yang dapat digunakan kembali:</strong> Bahkan jika kita beralih ke model pelabelan yang berbeda di masa mendatang, jejak penalaran tetap berguna untuk pelabelan ulang atau audit.</p></li>
</ul>
<p>Alur kerja anotasi terlihat seperti ini:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/annotation_data_generation_ff93eb18f4.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Qwen3-8B-for-Annotation" class="common-anchor-header">Qwen3 8B untuk Anotasi</h3><p>Untuk anotasi, kami memilih Qwen3 8B karena secara native mendukung "mode berpikir" melalui output, membuatnya lebih mudah untuk mengekstrak jejak penalaran yang konsisten. Model yang lebih kecil tidak memberikan label yang stabil, dan model yang lebih besar lebih lambat dan tidak perlu mahal untuk jenis pipeline ini. Qwen3 8B mencapai keseimbangan yang tepat antara kualitas, kecepatan, dan biaya.</p>
<p>Kami menjalankan semua anotasi menggunakan <strong>layanan vLLM lokal</strong>, bukan API cloud. Hal ini memberi kami throughput yang tinggi, kinerja yang dapat diprediksi, dan biaya yang jauh lebih rendah-pada dasarnya menukar waktu GPU dengan biaya token API, yang merupakan kesepakatan yang lebih baik ketika menghasilkan jutaan sampel.</p>
<h3 id="Dataset-Scale" class="common-anchor-header">Skala Dataset</h3><p>Secara keseluruhan, kami membuat <strong>lebih dari 5 juta sampel pelatihan dwibahasa</strong>, dibagi secara merata antara bahasa Inggris dan Mandarin.</p>
<ul>
<li><p><strong>Sumber bahasa Inggris:</strong> MS MARCO, Natural Questions, GooAQ</p></li>
<li><p><strong>Sumber bahasa Mandarin:</strong> DuReader, Wikipedia bahasa Mandarin, mmarco_chinese</p></li>
</ul>
<p>Sebagian dari dataset ini berasal dari anotasi ulang data yang sudah ada yang digunakan oleh proyek-proyek seperti Open Provence. Sisanya dihasilkan dari korpora mentah dengan terlebih dahulu membuat pasangan kueri-konteks dan kemudian melabelinya dengan pipeline berbasis penalaran kami.</p>
<p>Semua data pelatihan beranotasi juga tersedia di HuggingFace untuk pengembangan komunitas dan referensi pelatihan: <a href="https://huggingface.co/zilliz/datasets">Kumpulan Data Zilliz</a></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/zilliz_datasets_dd91330d4d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Training-Method" class="common-anchor-header">Metode Pelatihan</h3><p>Setelah arsitektur model dan dataset siap, kami melatih model pada <strong>GPU 8× A100</strong> selama tiga epoch, yang memakan waktu sekitar <strong>9 jam dari</strong> awal hingga akhir.</p>
<p><strong>Catatan:</strong> Pelatihan ini hanya menargetkan <strong>Pruning Head</strong>, yang bertanggung jawab atas tugas penyorotan semantik. Kami tidak melatih <strong>Rerank Head</strong>, karena hanya berfokus pada tujuan pemangkasan akan memberikan hasil yang lebih baik untuk penilaian relevansi tingkat kalimat.</p>
<h2 id="Real-World-Case-Study" class="common-anchor-header">Studi Kasus Dunia Nyata<button data-href="#Real-World-Case-Study" class="anchor-icon" translate="no">
      <svg translate="no"
        aria-hidden="true"
        focusable="false"
        height="20"
        version="1.1"
        viewBox="0 0 16 16"
        width="16"
      >
        <path
          fill="#0092E4"
          fill-rule="evenodd"
          d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"
        ></path>
      </svg>
    </button></h2><p>Tolok ukur hanya menceritakan sebagian dari cerita, jadi inilah contoh nyata yang menunjukkan bagaimana model berperilaku pada kasus tepi yang umum: ketika teks yang diambil berisi jawaban yang benar dan distraktor yang sangat menggoda.</p>
<p><strong>Pertanyaan:</strong> <em>Siapa yang menulis "Pembunuhan Rusa Suci"?</em></p>
<p><strong>Konteks (5 kalimat):</strong></p>
<pre><code translate="no">1\. The Killing of a Sacred Deer is a 2017 psychological horror film directed by Yorgos Lanthimos,

   with a screenplay by Lanthimos and Efthymis Filippou.

2\. The film stars Colin Farrell, Nicole Kidman, Barry Keoghan, Raffey Cassidy,

   Sunny Suljic, Alicia Silverstone, and Bill Camp.

3\. The story is based on the ancient Greek playwright Euripides&#x27; play Iphigenia in Aulis.

4\. The film tells the story of a cardiac surgeon (Farrell) who secretly

   befriends a teenager (Keoghan) connected to his past.

5\. He introduces the boy to his family, who then mysteriously fall ill.
<button class="copy-code-btn"></button></code></pre>
<p>Jawaban yang benar: Kalimat 1 (secara eksplisit menyatakan "skenario oleh Lanthimos dan Efthymis Filippou")</p>
<p>Contoh ini memiliki jebakan: Kalimat 3 menyebutkan bahwa "Euripides" yang menulis naskah aslinya. Namun pertanyaannya menanyakan "siapa yang menulis film The Killing of a Sacred Deer," dan jawabannya seharusnya adalah penulis skenario film tersebut, bukan penulis naskah Yunani dari ribuan tahun yang lalu.</p>
<h3 id="Model-results" class="common-anchor-header">Hasil model</h3><table>
<thead>
<tr><th>Model</th><th>Menemukan jawaban yang benar?</th><th>Prediksi</th></tr>
</thead>
<tbody>
<tr><td>Model kami</td><td>✓</td><td>Kalimat yang dipilih 1 (benar) dan 3</td></tr>
<tr><td>XProvence v1</td><td>✗</td><td>Hanya memilih kalimat 3, tidak ada jawaban yang benar</td></tr>
<tr><td>XProvence v2</td><td>✗</td><td>Hanya memilih kalimat 3, jawaban yang benar terlewat</td></tr>
</tbody>
</table>
<p><strong>Perbandingan Skor Kalimat Kunci:</strong></p>
<table>
<thead>
<tr><th>Kalimat</th><th>Model Kami</th><th>XProvence v1</th><th>XProvence v2</th></tr>
</thead>
<tbody>
<tr><td>Kalimat 1 (skenario film, jawaban yang benar)</td><td>0.915</td><td>0.133</td><td>0.081</td></tr>
<tr><td>Kalimat 3 (naskah asli, distraktor)</td><td>0.719</td><td>0.947</td><td>0.802</td></tr>
</tbody>
</table>
<p>Model XProvence:</p>
<ul>
<li><p>Sangat tertarik pada "Euripides" dan "permainan", memberikan nilai yang nyaris sempurna pada kalimat 3 (0,947 dan 0,802)</p></li>
<li><p>Sama sekali mengabaikan jawaban yang sebenarnya (kalimat 1), memberikan nilai yang sangat rendah (0,133 dan 0,081)</p></li>
<li><p>Bahkan ketika menurunkan ambang batas dari 0,5 ke 0,2, tetap saja tidak dapat menemukan jawaban yang benar</p></li>
</ul>
<p>Model kami:</p>
<ul>
<li><p>Dengan tepat memberikan nilai tertinggi pada kalimat 1 (0,915)</p></li>
<li><p>Masih memberikan kalimat 3 beberapa relevansi (0,719) karena terkait dengan latar belakang</p></li>
<li><p>Memisahkan keduanya dengan jelas dengan selisih ~0,2</p></li>
</ul>
<p>Contoh ini menunjukkan kekuatan utama model: memahami <strong>maksud kueri</strong> dan bukan hanya mencocokkan kata kunci di permukaan. Dalam konteks ini, "Siapa yang menulis " <em>The Killing of a Sacred Deer</em>" mengacu pada film, bukan drama Yunani kuno. Model kami memahami hal tersebut, sementara model lainnya terganggu oleh isyarat leksikal yang kuat.</p>
<h2 id="Try-It-Out-and-Tell-Us-What-You-Think" class="common-anchor-header">Cobalah dan Beri Tahu Kami Pendapat Anda<button data-href="#Try-It-Out-and-Tell-Us-What-You-Think" class="anchor-icon" translate="no">
      <svg translate="no"
        aria-hidden="true"
        focusable="false"
        height="20"
        version="1.1"
        viewBox="0 0 16 16"
        width="16"
      >
        <path
          fill="#0092E4"
          fill-rule="evenodd"
          d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"
        ></path>
      </svg>
    </button></h2><p>Model <a href="https://huggingface.co/zilliz/semantic-highlight-bilingual-v1">zilliz/semantic-highlight-bilingual-v1</a> kami sekarang sepenuhnya bersumber terbuka di bawah lisensi MIT dan siap untuk digunakan dalam produksi. Anda dapat menyambungkannya ke dalam pipeline RAG Anda, menyempurnakannya untuk domain Anda sendiri, atau membangun alat baru di atasnya. Kami juga menerima kontribusi dan umpan balik dari komunitas.</p>
<ul>
<li><p><strong>Unduh dari HuggingFace</strong>: <a href="https://huggingface.co/zilliz/semantic-highlight-bilingual-v1">zilliz/semantic-highlight-bilingual-v1</a></p></li>
<li><p><strong>Semua data pelatihan beranotasi:</strong> <a href="https://huggingface.co/zilliz/datasets">https://huggingface.co/zilliz/datasets</a></p></li>
</ul>
<h3 id="Semantic-Highlighting-Available-in-Milvus-and-Zilliz-Cloud" class="common-anchor-header">Penyorotan Semantik Tersedia di Milvus dan Zilliz Cloud</h3><p>Penyorotan semantik juga dibangun langsung ke dalam <a href="https://milvus.io/">Milvus</a> dan <a href="https://zilliz.com/cloud">Zilliz Cloud</a> (Milvus yang dikelola secara penuh), sehingga pengguna dapat melihat dengan jelas <em>mengapa</em> setiap dokumen diambil. Alih-alih memindai seluruh bagian, Anda dapat langsung melihat kalimat spesifik yang berhubungan dengan kueri Anda - bahkan ketika kata-katanya tidak sama persis. Hal ini membuat pengambilan lebih mudah dipahami dan lebih cepat untuk di-debug. Untuk pipeline RAG, hal ini juga memperjelas apa yang diharapkan menjadi fokus LLM hilir, yang membantu dalam desain dan pemeriksaan kualitas yang cepat.</p>
<p><a href="https://cloud.zilliz.com/signup?utm_source=milvusio&amp;utm_page=semantic-highlighting-blog"><strong>Coba Penyorotan Semantik di Zilliz Cloud yang dikelola sepenuhnya secara gratis</strong></a></p>
<p>Kami ingin mendengar bagaimana fitur ini bekerja untuk Anda-laporan bug, ide perbaikan, atau apa pun yang Anda temukan saat mengintegrasikannya ke dalam alur kerja Anda.</p>
<p>Jika Anda ingin membicarakan sesuatu dengan lebih detail, jangan ragu untuk bergabung dengan <a href="https://discord.com/invite/8uyFbECzPX">saluran Discord</a> kami atau memesan sesi <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">Milvus Office Hours</a> selama 20 menit. Kami selalu senang mengobrol dengan pembuat lain dan bertukar catatan.</p>
<h2 id="Acknowledgements" class="common-anchor-header">Ucapan terima kasih<button data-href="#Acknowledgements" class="anchor-icon" translate="no">
      <svg translate="no"
        aria-hidden="true"
        focusable="false"
        height="20"
        version="1.1"
        viewBox="0 0 16 16"
        width="16"
      >
        <path
          fill="#0092E4"
          fill-rule="evenodd"
          d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"
        ></path>
      </svg>
    </button></h2><p>Karya ini dibangun di atas banyak ide hebat dan kontribusi sumber terbuka, dan kami ingin menyoroti proyek-proyek yang membuat model ini menjadi mungkin.</p>
<ul>
<li><p><strong>Provence</strong> memperkenalkan pembingkaian yang bersih dan praktis untuk pemangkasan konteks menggunakan model encoder yang ringan.</p></li>
<li><p><strong>Open Provence</strong> menyediakan basis kode yang solid dan direkayasa dengan baik - jalur pelatihan, pemrosesan data, dan kepala model - di bawah lisensi permisif. Ini memberi kami titik awal yang kuat untuk bereksperimen.</p></li>
</ul>
<p>Di atas fondasi tersebut, kami menambahkan beberapa kontribusi kami sendiri:</p>
<ul>
<li><p>Menggunakan <strong>penalaran LLM</strong> untuk menghasilkan label relevansi yang lebih berkualitas</p></li>
<li><p>Membuat <strong>hampir 5 juta</strong> sampel pelatihan dwibahasa yang diselaraskan dengan beban kerja RAG yang sebenarnya</p></li>
<li><p>Memilih model dasar yang lebih cocok untuk penilaian relevansi konteks panjang<strong>(BGE-M3 Reranker v2</strong>)</p></li>
<li><p>Melatih hanya <strong>Kepala Pemangkasan</strong> untuk mengkhususkan model untuk penyorotan semantik</p></li>
</ul>
<p>Kami berterima kasih kepada tim Provence dan Open Provence yang telah mempublikasikan hasil kerja mereka secara terbuka. Kontribusi mereka secara signifikan mempercepat pengembangan kami dan membuat proyek ini menjadi mungkin.</p>
