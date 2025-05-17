---
id: >-
  milvus-26-preview-72-memory-reduction-without-compromising-recall-and-4x-faster-than-elasticsearch.md
title: >-
  Pratinjau Milvus 2.6: Pengurangan Memori 72% Tanpa Mengorbankan Pemanggilan
  Kembali dan 4x Lebih Cepat Dari Elasticsearch
author: Ken Zhang
date: 2025-05-17T00:00:00.000Z
cover: >-
  assets.zilliz.com/Milvus_2_6_Preview_72_Memory_Reduction_Without_Compromising_Recall_and_4x_Faster_Than_Elasticsearch_c607b644f1.png
tag: Engineering
recommend: true
publishToMedium: true
tags: 'Milvus, vector database, vector search, AI Agents, LLM'
meta_keywords: 'Milvus 2.6, vector database, vector search, full text search, AI search'
meta_title: >
  Milvus 2.6 Preview: 72% Memory Reduction Without Compromising Recall and 4x
  Faster Than Elasticsearch
desc: >-
  Dapatkan pandangan pertama secara eksklusif pada inovasi dalam Milvus 2.6
  mendatang yang akan mendefinisikan ulang kinerja dan efisiensi basis data
  vektor.
origin: >-
  https://milvus.io/blog/milvus-26-preview-72-memory-reduction-without-compromising-recall-and-4x-faster-than-elasticsearch.md
---
<p>Sepanjang minggu ini, kami telah berbagi berbagai inovasi menarik di Milvus yang mendorong batas-batas teknologi basis data vektor:</p>
<ul>
<li><p><a href="https://milvus.io/blog/how-to-filter-efficiently-without-killing-recall.md">Pencarian Vektor di Dunia Nyata: Cara Memfilter Secara Efisien Tanpa Mematikan Pemanggilan </a></p></li>
<li><p><a href="https://milvus.io/blog/bring-vector-compression-to-the-extreme-how-milvus-serves-3%C3%97-more-queries-with-rabitq.md">Membawa Kompresi Vektor ke Tingkat Ekstrim: Bagaimana Milvus Melayani Kueri 3× Lebih Banyak dengan RaBitQ</a></p></li>
<li><p><a href="https://milvus.io/blog/benchmarks-lie-vector-dbs-deserve-a-real-test.md">Benchmark Bohong - DB Vektor Layak Mendapat Ujian Nyata </a></p></li>
<li><p><a href="https://milvus.io/blog/we-replaced-kafka-pulsar-with-a-woodpecker-for-milvus.md">Kami Mengganti Kafka/Pulsar dengan Burung Pelatuk untuk Milvus </a></p></li>
<li><p><a href="https://milvus.io/blog/minhash-lsh-in-milvus-the-secret-weapon-for-fighting-duplicates-in-llm-training-data.md">MinHash LSH di Milvus: Senjata Rahasia untuk Memerangi Duplikat dalam Data Pelatihan LLM </a></p></li>
</ul>
<p>Sekarang, setelah kita mengakhiri seri Milvus Week, saya sangat senang memberi Anda sekilas tentang apa yang akan hadir di Milvus 2.6-sebuah tonggak penting dalam peta jalan produk 2025 yang saat ini sedang dikembangkan, dan bagaimana peningkatan ini akan mengubah pencarian yang didukung oleh AI. Rilis yang akan datang ini menyatukan semua inovasi ini dan lebih banyak lagi di tiga bidang penting: <strong>pengoptimalan efisiensi biaya</strong>, <strong>kemampuan pencarian tingkat lanjut</strong>, dan <strong>arsitektur baru</strong> yang mendorong pencarian vektor melampaui skala 10 miliar vektor.</p>
<p>Mari kita bahas beberapa peningkatan utama yang dapat Anda harapkan saat Milvus 2.6 hadir pada bulan Juni ini, dimulai dari apa yang mungkin akan berdampak paling besar: pengurangan dramatis dalam penggunaan memori dan biaya, serta kinerja yang sangat cepat.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Milvus_2_6_Preview_72_Memory_Reduction_Without_Compromising_Recall_and_4x_Faster_Than_Elasticsearch_c607b644f1.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Cost-Reduction-Slash-Memory-Usage-While-Boosting-Performance" class="common-anchor-header">Pengurangan Biaya: Memangkas Penggunaan Memori Sekaligus Meningkatkan Performa<button data-href="#Cost-Reduction-Slash-Memory-Usage-While-Boosting-Performance" class="anchor-icon" translate="no">
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
    </button></h2><p>Mengandalkan memori yang mahal menjadi salah satu hambatan terbesar untuk meningkatkan skala pencarian vektor hingga miliaran record. Milvus 2.6 akan memperkenalkan beberapa optimasi utama yang secara dramatis menurunkan biaya infrastruktur Anda sekaligus meningkatkan kinerja.</p>
<h3 id="RaBitQ-1-bit-Quantization-72-Memory-Reduction-with-4×-QPS-and-No-Recall-Loss" class="common-anchor-header">Kuantisasi 1-bit RaBitQ: Pengurangan Memori 72% dengan 4× QPS dan Tidak Ada Recall Loss</h3><p>Konsumsi memori telah lama menjadi kelemahan utama database vektor berskala besar. Meskipun kuantisasi vektor bukanlah hal yang baru, sebagian besar pendekatan yang ada mengorbankan terlalu banyak kualitas pencarian untuk penghematan memori. Milvus 2.6 akan mengatasi tantangan ini secara langsung dengan memperkenalkan<a href="https://milvus.io/blog/bring-vector-compression-to-the-extreme-how-milvus-serves-3%C3%97-more-queries-with-rabitq.md"> kuantisasi RaBitQ 1-bit</a> dalam lingkungan produksi.</p>
<p>Apa yang membuat implementasi kami istimewa adalah kemampuan optimisasi Refine yang dapat disesuaikan yang kami bangun. Dengan mengimplementasikan indeks utama dengan kuantisasi RaBitQ ditambah opsi Refine SQ4/SQ6/SQ8, kami telah mencapai keseimbangan optimal antara penggunaan memori dan kualitas pencarian (~95% recall).</p>
<p>Tolok ukur awal kami menunjukkan hasil yang menjanjikan:</p>
<table>
<thead>
<tr><th><strong>Metrik</strong><strong>Kinerja</strong> </th><th><strong>IVF_FLAT tradisional</strong></th><th><strong>Hanya RaBitQ (1-bit)</strong></th><th><strong>RaBitQ (1-bit) + SQ8 Refine</strong></th></tr>
</thead>
<tbody>
<tr><td>Jejak Memori</td><td>100% (garis dasar)</td><td>3% (pengurangan 97%)</td><td>28% (pengurangan 72%)</td></tr>
<tr><td>Kualitas Pemanggilan Kembali</td><td>95.2%</td><td>76.3%</td><td>94.9%</td></tr>
<tr><td>Throughput Kueri (QPS)</td><td>236</td><td>648 (2,7 kali lebih cepat)</td><td>946 (4 kali lebih cepat)</td></tr>
</tbody>
</table>
<p><em>Tabel: Evaluasi VectorDBBench dengan 1M vektor 768 dimensi, diuji pada AWS m6id.2xlarge</em></p>
<p>Terobosan nyata di sini bukan hanya pengurangan memori, tetapi mencapai hal ini sekaligus memberikan peningkatan throughput 4× lipat tanpa mengorbankan akurasi. Ini berarti Anda akan dapat melayani beban kerja yang sama dengan 75% lebih sedikit server atau menangani lalu lintas 4 kali lipat lebih banyak pada infrastruktur yang ada.</p>
<p>Untuk pengguna perusahaan yang menggunakan Milvus yang dikelola sepenuhnya di<a href="https://zilliz.com/cloud"> Zilliz Cloud</a>, kami mengembangkan profil konfigurasi otomatis yang akan menyesuaikan parameter RaBitQ secara dinamis berdasarkan karakteristik beban kerja dan persyaratan presisi Anda.</p>
<h3 id="400-Faster-Full-text-Search-Than-Elasticsearch" class="common-anchor-header">Pencarian Teks Lengkap 400% Lebih Cepat Dibandingkan Elasticsearch</h3><p>Kemampuan<a href="https://milvus.io/blog/full-text-search-in-milvus-what-is-under-the-hood.md">pencarian teks lengkap</a> dalam basis data vektor telah menjadi sangat penting untuk membangun sistem pencarian hibrida. Sejak memperkenalkan BM25 di <a href="https://milvus.io/blog/introduce-milvus-2-5-full-text-search-powerful-metadata-filtering-and-more.md">Milvus 2.5</a>, kami telah menerima umpan balik yang antusias-bersamaan dengan permintaan untuk kinerja yang lebih baik dalam skala besar.</p>
<p>Milvus 2.6 akan memberikan peningkatan kinerja yang substansial pada BM25. Pengujian kami pada dataset BEIR menunjukkan throughput 3-4× lebih tinggi daripada Elasticsearch dengan tingkat recall yang setara. Untuk beberapa beban kerja, peningkatannya mencapai hingga 7× QPS lebih tinggi.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_Milvus_vs_Elasticsearch_on_throughput_140b7c1b06.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Gambar: Milvus vs Elasticsearch pada throughput JSON Path Index: 99% Latensi Lebih Rendah untuk Pemfilteran Kompleks</p>
<p>Aplikasi AI modern jarang mengandalkan kesamaan vektor saja - mereka hampir selalu menggabungkan pencarian vektor dengan pemfilteran metadata. Ketika kondisi pemfilteran ini menjadi lebih kompleks (terutama dengan objek JSON bersarang), kinerja kueri dapat memburuk dengan cepat.</p>
<p>Milvus 2.6 akan memperkenalkan mekanisme pengindeksan yang ditargetkan untuk jalur JSON bersarang yang memungkinkan Anda untuk membuat indeks pada jalur tertentu (mis., $meta. <code translate="no">user_info.location</code>) di dalam bidang JSON. Alih-alih memindai seluruh objek, Milvus akan secara langsung mencari nilai dari indeks yang telah dibuat sebelumnya.</p>
<p>Dalam evaluasi kami dengan 100 M+ record, JSON Path Index mengurangi latensi filter dari <strong>140ms</strong> (P99: 480ms) menjadi hanya <strong>1,5ms</strong> (P99: 10ms) - pengurangan 99% yang akan mengubah kueri yang sebelumnya tidak praktis menjadi respons instan.</p>
<p>Fitur ini akan sangat berharga untuk:</p>
<ul>
<li><p>Sistem rekomendasi dengan pemfilteran atribut pengguna yang kompleks</p></li>
<li><p>Aplikasi RAG yang memfilter dokumen berdasarkan berbagai label</p></li>
</ul>
<h2 id="Next-Generation-Search-From-Basic-Vector-Similarity-to-Production-Grade-Retrieval" class="common-anchor-header">Pencarian Generasi Berikutnya: Dari Kemiripan Vektor Dasar hingga Pencarian Tingkat Produksi<button data-href="#Next-Generation-Search-From-Basic-Vector-Similarity-to-Production-Grade-Retrieval" class="anchor-icon" translate="no">
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
    </button></h2><p>Pencarian vektor saja tidak cukup untuk aplikasi AI modern. Pengguna menuntut ketepatan pencarian informasi tradisional yang dikombinasikan dengan pemahaman semantik dari penyematan vektor. Milvus 2.6 akan memperkenalkan beberapa fitur pencarian tingkat lanjut yang menjembatani kesenjangan ini.</p>
<h3 id="Better-Full-text-Search-with-Multi-language-Analyzer" class="common-anchor-header">Pencarian Teks Lengkap yang Lebih Baik dengan Penganalisis Multi-bahasa</h3><p>Pencarian teks lengkap sangat bergantung pada bahasa... Milvus 2.6 akan memperkenalkan pipeline analisis teks yang telah dirubah sepenuhnya dengan dukungan multi-bahasa:</p>
<ul>
<li><p><code translate="no">RUN_ANALYZER</code> dukungan sintaks untuk pengamatan konfigurasi penganalisis/tokenisasi</p></li>
<li><p>Lindera tokenizer untuk bahasa-bahasa Asia seperti Jepang dan Korea</p></li>
<li><p>ICU tokenizer untuk dukungan multibahasa yang komprehensif</p></li>
<li><p>Konfigurasi bahasa granular untuk menentukan aturan tokenisasi khusus bahasa</p></li>
<li><p>Jieba yang disempurnakan dengan dukungan untuk integrasi kamus khusus</p></li>
<li><p>Opsi filter yang diperluas untuk pemrosesan teks yang lebih tepat</p></li>
</ul>
<p>Untuk aplikasi global, ini berarti pencarian multibahasa yang lebih baik tanpa pengindeksan khusus per bahasa atau solusi yang rumit.</p>
<h3 id="Phrase-Match-Capturing-Semantic-Nuance-in-Word-Order" class="common-anchor-header">Pencocokan Frasa: Menangkap Nuansa Semantik dalam Urutan Kata</h3><p>Urutan kata menyampaikan perbedaan makna penting yang sering terlewatkan oleh pencarian kata kunci. Coba bandingkan &quot;teknik pembelajaran mesin&quot; dengan &quot;teknik mesin pembelajaran&quot; - kata yang sama, namun memiliki arti yang sangat berbeda.</p>
<p>Milvus 2.6 akan menambahkan Pencocokan <strong>Frasa</strong>, yang memberikan pengguna lebih banyak kontrol atas urutan kata dan kedekatan daripada pencarian teks lengkap atau pencocokan string yang tepat:</p>
<pre><code translate="no">PHRASE_MATCH(field_name, phrase, slop)
<button class="copy-code-btn"></button></code></pre>
<p>Parameter <code translate="no">slop</code> akan memberikan kontrol yang fleksibel terhadap kedekatan kata-0 membutuhkan kecocokan berurutan yang tepat, sementara nilai yang lebih tinggi memungkinkan variasi kecil dalam frasa.</p>
<p>Fitur ini akan sangat berharga untuk:</p>
<ul>
<li><p>Pencarian dokumen hukum di mana frasa yang tepat memiliki makna hukum</p></li>
<li><p>Pengambilan konten teknis di mana urutan istilah membedakan konsep yang berbeda</p></li>
<li><p>Basis data paten di mana frasa teknis tertentu harus dicocokkan dengan tepat</p></li>
</ul>
<h3 id="Time-Aware-Decay-Functions-Automatically-Prioritize-Fresh-Content" class="common-anchor-header">Fungsi Peluruhan yang Sadar Waktu: Secara Otomatis Memprioritaskan Konten Baru</h3><p>Nilai informasi sering kali berkurang seiring berjalannya waktu. Artikel berita, rilis produk, dan postingan sosial menjadi kurang relevan seiring bertambahnya usia, namun algoritme pencarian tradisional memperlakukan semua konten dengan setara, terlepas dari stempel waktu.</p>
<p>Milvus 2.6 akan memperkenalkan <strong>Fungsi Peluruhan</strong> untuk peringkat yang sadar waktu yang secara otomatis menyesuaikan skor relevansi berdasarkan usia dokumen.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/decay_function_210e65f9a0.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Anda akan dapat mengonfigurasinya:</p>
<ul>
<li><p><strong>Jenis fungsi</strong>: Eksponensial (peluruhan cepat), Gaussian (peluruhan bertahap), atau Linier (peluruhan konstan)</p></li>
<li><p><strong>Tingkat peluruhan</strong>: Seberapa cepat relevansi berkurang dari waktu ke waktu</p></li>
<li><p><strong>Titik asal</strong>: Stempel waktu referensi untuk mengukur perbedaan waktu</p></li>
</ul>
<p>Pemeringkatan ulang yang peka terhadap waktu ini akan memastikan bahwa hasil yang paling baru dan relevan secara kontekstual akan muncul lebih dulu, yang sangat penting untuk sistem rekomendasi berita, platform e-niaga, dan umpan media sosial.</p>
<h3 id="Data-in-Data-Out-From-Raw-Text-to-Vector-Search-in-One-Step" class="common-anchor-header">Data masuk, Data keluar: Dari Teks Mentah ke Pencarian Vektor dalam Satu Langkah</h3><p>Salah satu masalah terbesar yang dihadapi para pengembang dengan basis data vektor adalah keterputusan antara data mentah dan penyematan vektor. Milvus 2.6 akan secara dramatis menyederhanakan alur kerja ini dengan antarmuka <strong>Fungsi</strong> baru yang mengintegrasikan model penyematan pihak ketiga secara langsung ke dalam pipeline data Anda. Hal ini menyederhanakan pipeline pencarian vektor Anda dengan satu kali panggilan.</p>
<p>Alih-alih melakukan penyematan pra-komputasi, Anda akan dapat:</p>
<ol>
<li><p><strong>Menyisipkan data mentah secara langsung</strong>: Mengirimkan teks, gambar, atau konten lain ke Milvus</p></li>
<li><p><strong>Mengonfigurasi penyedia penyematan untuk vektorisasi</strong>: Milvus dapat terhubung ke layanan model penyematan seperti OpenAI, AWS Bedrock, Google Vertex AI, dan Hugging Face.</p></li>
<li><p><strong>Kueri menggunakan bahasa alami</strong>: Pencarian menggunakan kueri teks, bukan penyematan vektor</p></li>
</ol>
<p>Hal ini akan menciptakan pengalaman "Data-In, Data-Out" yang efisien di mana Milvus menangani pembuatan vektor secara internal, sehingga membuat kode aplikasi Anda menjadi lebih mudah.</p>
<h2 id="Architectural-Evolution-Scaling-to-Hundreds-of-Billions-of-Vectors" class="common-anchor-header">Evolusi Arsitektur: Penskalaan ke Ratusan Miliar Vektor<button data-href="#Architectural-Evolution-Scaling-to-Hundreds-of-Billions-of-Vectors" class="anchor-icon" translate="no">
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
    </button></h2><p>Basis data yang baik tidak hanya memiliki fitur-fitur hebat, tetapi juga harus menghadirkan fitur-fitur tersebut dalam skala besar, teruji dalam produksi.</p>
<p>Milvus 2.6 akan memperkenalkan perubahan arsitektur mendasar yang memungkinkan penskalaan hemat biaya hingga ratusan miliar vektor. Hal yang paling utama adalah arsitektur penyimpanan berjenjang panas-dingin baru yang secara cerdas mengelola penempatan data berdasarkan pola akses, secara otomatis memindahkan data panas ke memori/SSD berkinerja tinggi sambil menempatkan data dingin di penyimpanan objek yang lebih ekonomis. Pendekatan ini dapat secara dramatis mengurangi biaya sekaligus mempertahankan kinerja kueri yang paling penting.</p>
<p>Selain itu, <a href="https://milvus.io/blog/we-replaced-kafka-pulsar-with-a-woodpecker-for-milvus.md#StreamingService-Built-for-Real-Time-Data-Flow">Streaming Node</a> baru akan memungkinkan pemrosesan vektor secara real-time dengan integrasi langsung ke platform streaming seperti Kafka dan Pulsar serta <a href="https://milvus.io/blog/we-replaced-kafka-pulsar-with-a-woodpecker-for-milvus.md">Woodpecker</a> yang baru dibuat, membuat data baru dapat dicari dengan segera tanpa penundaan batch.</p>
<h2 id="Stay-tuned-for-Milvus-26" class="common-anchor-header">Nantikan Milvus 2.6<button data-href="#Stay-tuned-for-Milvus-26" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.6 saat ini sedang dalam pengembangan aktif dan akan tersedia pada bulan Juni ini. Kami sangat senang dapat menghadirkan terobosan pengoptimalan kinerja, kemampuan pencarian yang lebih canggih, dan arsitektur baru untuk membantu Anda membangun aplikasi AI yang dapat diskalakan dengan biaya yang lebih rendah.</p>
<p>Sementara itu, kami menerima umpan balik Anda tentang fitur-fitur yang akan datang ini. Apa yang paling menarik bagi Anda? Kemampuan mana yang akan memberikan dampak paling besar pada aplikasi Anda? Bergabunglah dengan percakapan di<a href="https://discord.com/invite/8uyFbECzPX"> saluran Discord</a> kami atau ikuti perkembangan kami di<a href="https://github.com/milvus-io/milvus"> GitHub</a>.</p>
<p>Ingin menjadi yang pertama tahu ketika Milvus 2.6 dirilis? Ikuti kami di<a href="https://www.linkedin.com/company/zilliz/"> LinkedIn</a> atau<a href="https://twitter.com/milvusio"> X</a> untuk mendapatkan informasi terbaru.</p>
