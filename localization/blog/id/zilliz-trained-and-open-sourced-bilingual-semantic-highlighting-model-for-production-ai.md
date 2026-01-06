---
id: >-
  zilliz-trained-and-open-sourced-bilingual-semantic-highlighting-model-for-production-ai.md
title: >-
  Kami Melatih dan Membuka Sumber Model Penyorotan Semantik Bilingual untuk RAG
  Produksi dan Pencarian AI
author: Cheney Zhang
date: 2026-01-06T00:00:00.000Z
cover: assets.zilliz.com/semantic_highlight_cover_f35a98fc58.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Semantic Highlighting, RAG, semantic search, Milvus, bilingual model'
meta_title: |
  Open-sourcing a Bilingual Semantic Highlighting Model for Production AI
desc: >-
  Selami lebih dalam tentang penyorotan semantik, pelajari bagaimana model
  dwibahasa Zilliz dibuat, dan bagaimana kinerjanya di seluruh tolok ukur bahasa
  Inggris dan bahasa Mandarin untuk sistem RAG.
origin: >-
  https://milvus.io/blog/zilliz-trained-and-open-sourced-bilingual-semantic-highlighting-model-for-production-ai.md
---
<p>Baik Anda membangun pencarian produk, pipeline RAG, atau agen AI, pengguna pada akhirnya membutuhkan hal yang sama: cara cepat untuk mengetahui mengapa suatu hasil relevan. <strong>Penyorotan</strong> membantu dengan menandai teks yang tepat yang mendukung kecocokan, sehingga pengguna tidak perlu memindai seluruh dokumen.</p>
<p>Sebagian besar sistem masih mengandalkan penyorotan berbasis kata kunci. Jika pengguna mencari "kinerja iPhone," sistem akan menyoroti token yang tepat "iPhone" dan "kinerja." Namun hal ini akan rusak segera setelah teks mengekspresikan ide yang sama dengan menggunakan kata-kata yang berbeda. Deskripsi seperti "Chip A15 Bionic, lebih dari satu juta dalam benchmark, lancar tanpa lag" dengan jelas membahas kinerja, namun tidak ada yang disorot karena kata kuncinya tidak pernah muncul.</p>
<p><strong>Penyorotan semantik</strong> memecahkan masalah ini. Alih-alih mencocokkan string yang sama persis, fitur ini mengidentifikasi rentang teks yang secara semantik selaras dengan kueri. Untuk sistem RAG, pencarian AI, dan agen-di mana relevansi bergantung pada makna, bukan pada bentuk permukaan-ini menghasilkan penjelasan yang lebih tepat dan lebih dapat diandalkan tentang mengapa sebuah dokumen diambil.</p>
<p>Namun, metode penyorotan semantik yang ada saat ini tidak dirancang untuk beban kerja AI produksi. Setelah mengevaluasi semua solusi yang tersedia, kami menemukan bahwa tidak ada yang memberikan ketepatan, latensi, cakupan multibahasa, atau ketangguhan yang diperlukan untuk pipeline RAG, sistem agen, atau pencarian web berskala besar. <strong>Jadi kami melatih model penyorotan semantik bilingual kami sendiri-dan menyediakannya secara terbuka.</strong></p>
<ul>
<li><p>Model penyorotan semantik kami: <a href="https://huggingface.co/zilliz/semantic-highlight-bilingual-v1">zilliz/semantic-highlight-bilingual-v1</a></p></li>
<li><p>Beritahu kami pendapat Anda-bergabunglah dengan <a href="https://discord.com/invite/8uyFbECzPX">Discord</a> kami, ikuti kami di <a href="https://www.linkedin.com/company/the-milvus-project/">LinkedIn</a>, atau pesan sesi <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">Milvus Office Hours selama 20 menit</a> bersama kami.</p></li>
</ul>
<h2 id="How-Keyword-Based-Highlighting-Works--and-Why-It-Fails-in-Modern-AI-Systems" class="common-anchor-header">Cara Kerja Penyorotan Berbasis Kata Kunci - dan Mengapa Gagal dalam Sistem AI Modern<button data-href="#How-Keyword-Based-Highlighting-Works--and-Why-It-Fails-in-Modern-AI-Systems" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Sistem pencarian tradisional menerapkan penyorotan melalui pencocokan kata kunci sederhana</strong>. Ketika hasil dikembalikan, mesin akan menemukan posisi token yang tepat yang sesuai dengan kueri dan membungkusnya dengan markup (biasanya tag <code translate="no">&lt;em&gt;</code> ), sehingga frontend dapat menampilkan sorotan. Ini bekerja dengan baik ketika istilah kueri muncul kata demi kata dalam teks.</p>
<p>Masalahnya adalah model ini mengasumsikan relevansi terkait dengan tumpang tindih kata kunci yang tepat. Begitu asumsi itu rusak, keandalannya akan menurun dengan cepat. Hasil apa pun yang mengekspresikan ide yang tepat dengan kata-kata yang berbeda akan berakhir tanpa sorotan sama sekali, meskipun langkah pengambilannya benar.</p>
<p>Kelemahan ini menjadi jelas dalam aplikasi AI modern. Dalam pipeline RAG dan alur kerja agen AI, kueri lebih abstrak, dokumen lebih panjang, dan informasi yang relevan mungkin tidak menggunakan kata-kata yang sama. Penyorotan berbasis kata kunci tidak lagi dapat menunjukkan kepada pengembang-atau pengguna akhir-di mana<em>jawaban sebenarnya</em>, yang membuat keseluruhan sistem terasa kurang akurat bahkan ketika pencarian kembali berfungsi sebagaimana mestinya.</p>
<p>Misalkan seorang pengguna bertanya: <em>"Bagaimana cara meningkatkan efisiensi eksekusi kode Python?"</em> Sistem mengambil dokumen teknis dari database vektor. Penyorotan tradisional hanya dapat menandai kecocokan literal seperti <em>"Python",</em> <em>"kode",</em> <em>"eksekusi"</em>, dan <em>"efisiensi"</em>.</p>
<p>Namun, bagian yang paling berguna dari dokumen tersebut mungkin saja:</p>
<ul>
<li><p>Gunakan operasi vektor NumPy alih-alih perulangan eksplisit</p></li>
<li><p>Hindari membuat objek di dalam perulangan secara berulang-ulang</p></li>
</ul>
<p>Kalimat-kalimat ini secara langsung menjawab pertanyaan, tetapi tidak mengandung istilah kueri. Akibatnya, penyorotan tradisional gagal total. Dokumen tersebut mungkin relevan, tetapi pengguna masih harus memindai baris demi baris untuk menemukan jawaban yang sebenarnya.</p>
<p>Masalahnya menjadi lebih parah dengan agen AI. Permintaan pencarian agen sering kali bukan merupakan pertanyaan asli dari pengguna, tetapi merupakan instruksi turunan yang dihasilkan melalui penalaran dan penguraian tugas. Misalnya, jika pengguna bertanya, <em>"Dapatkah Anda menganalisis tren pasar saat ini?",</em> agen dapat menghasilkan kueri seperti "Ambil data penjualan elektronik konsumen Q4 2024, tingkat pertumbuhan dari tahun ke tahun, perubahan pangsa pasar pesaing utama, dan fluktuasi biaya rantai pasokan".</p>
<p>Kueri ini menjangkau berbagai dimensi dan mengkodekan maksud yang kompleks. Akan tetapi, penyorotan berbasis kata kunci tradisional hanya dapat menandai kecocokan secara harfiah seperti <em>"2024",</em> <em>"data penjualan"</em>, atau <em>"tingkat pertumbuhan"</em>.</p>
<p>Sementara itu, wawasan yang paling berharga mungkin terlihat seperti:</p>
<ul>
<li><p>Seri iPhone 15 mendorong pemulihan pasar yang lebih luas</p></li>
<li><p>Kendala pasokan chip mendorong kenaikan biaya sebesar 15%</p></li>
</ul>
<p>Kesimpulan ini mungkin tidak memiliki kata kunci yang sama dengan kueri, meskipun kata kunci tersebut adalah yang ingin diekstrak oleh agen. Agen harus dengan cepat mengidentifikasi informasi yang benar-benar berguna dari konten yang diambil dalam jumlah besar - dan penyorotan berbasis kata kunci tidak memberikan bantuan yang nyata.</p>
<h2 id="What-Is-Semantic-Highlighting-and-Pain-Points-in-Today’s-Solutions" class="common-anchor-header">Apa Itu Penyorotan Semantik, dan Poin Utama dalam Solusi Saat Ini<button data-href="#What-Is-Semantic-Highlighting-and-Pain-Points-in-Today’s-Solutions" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Penyorotan semantik dibangun di atas ide yang sama di balik pencarian semantik: pencocokan berdasarkan makna, bukan kata-kata yang tepat</strong>. Dalam pencarian semantik, model penyematan memetakan teks ke dalam vektor sehingga sistem pencarian-biasanya didukung oleh basis data vektor seperti <a href="https://milvus.io/">Milvus-dapat</a>mengambil bagian yang menyampaikan ide yang sama dengan kueri, meskipun kata-katanya berbeda. Penyorotan semantik menerapkan prinsip ini pada granularitas yang lebih halus. Alih-alih menandai kata kunci secara harfiah, Milvus menyoroti rentang tertentu di dalam dokumen yang secara semantik relevan dengan maksud pengguna.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/vs_20ec73c4a7.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Pendekatan ini memecahkan masalah inti dengan penyorotan tradisional, yang hanya berfungsi jika istilah kueri muncul secara kata demi kata. Jika pengguna mencari "kinerja iPhone," penyorotan berbasis kata kunci mengabaikan frasa seperti "chip A15 Bionic," "lebih dari satu juta dalam tolok ukur," atau "lancar tanpa jeda," meskipun kalimat-kalimat tersebut dengan jelas menjawab pertanyaan. Penyorotan semantik menangkap hubungan yang digerakkan oleh makna ini dan menampilkan bagian teks yang benar-benar penting bagi pengguna.</p>
<p>Secara teori, ini adalah masalah pencocokan semantik yang mudah. Model penyematan modern sudah mengkodekan kemiripan dengan baik, sehingga bagian konseptualnya sudah ada. Tantangannya berasal dari kendala dunia nyata: penyorotan terjadi pada setiap kueri, sering kali pada banyak dokumen yang diambil, membuat latensi, throughput, dan ketahanan lintas domain menjadi persyaratan yang tidak dapat dinegosiasikan. Model bahasa yang besar terlalu lambat dan terlalu mahal untuk dijalankan di jalur frekuensi tinggi ini.</p>
<p>Itulah sebabnya mengapa penyorotan semantik praktis membutuhkan model yang ringan dan khusus - cukup kecil untuk ditempatkan di samping infrastruktur pencarian dan cukup cepat untuk mengembalikan hasil dalam beberapa milidetik. Di sinilah sebagian besar solusi yang ada saat ini rusak. Model yang berat memberikan akurasi tetapi tidak dapat berjalan dalam skala besar; model yang lebih ringan cepat tetapi kehilangan presisi atau gagal pada data multibahasa atau data khusus domain.</p>
<h3 id="opensearch-semantic-highlighter" class="common-anchor-header">penyorot-semantik-pencari terbuka</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/opensearch_en_aea06a2114.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Awal tahun ini, OpenSearch merilis model khusus untuk penyorotan semantik: <a href="https://huggingface.co/opensearch-project/opensearch-semantic-highlighter-v1"><strong>opensearch-semantic-highlighter-v1</strong></a>. Meskipun ini adalah upaya yang berarti untuk mengatasi masalah ini, model ini memiliki dua batasan penting.</p>
<ul>
<li><p><strong>Jendela konteks yang kecil:</strong> Model ini didasarkan pada arsitektur BERT dan mendukung maksimum 512 token - sekitar 300-400 karakter bahasa Mandarin atau 400-500 kata dalam bahasa Inggris. Dalam skenario dunia nyata, deskripsi produk dan dokumen teknis sering kali terdiri dari ribuan kata. Konten di luar jendela pertama akan terpotong begitu saja, memaksa model untuk mengidentifikasi sorotan berdasarkan hanya sebagian kecil dari dokumen.</p></li>
<li><p><strong>Generalisasi di luar domain yang buruk:</strong> Model ini bekerja dengan baik hanya pada distribusi data yang mirip dengan set pelatihannya. Ketika diterapkan pada data di luar domain-seperti menggunakan model yang dilatih pada artikel berita untuk menyoroti konten e-commerce atau dokumentasi teknis-kinerja menurun tajam. Dalam percobaan kami, model ini mencapai skor F1 sekitar 0,72 pada data dalam domain, tetapi turun menjadi sekitar 0,46 pada set data di luar domain. Tingkat ketidakstabilan ini merupakan masalah dalam produksi. Selain itu, model ini tidak mendukung bahasa Mandarin.</p></li>
</ul>
<h3 id="Provence--XProvence" class="common-anchor-header">Provence / XProvence</h3><p><a href="https://huggingface.co/naver/provence-reranker-debertav3-v1"><strong>Provence</strong></a> adalah model yang dikembangkan oleh <a href="https://zilliz.com/customers/naver">Naver</a> dan pada awalnya dilatih untuk <strong>pemangkasan konteks-tugas</strong>yang terkait erat dengan penyorotan semantik.</p>
<p>Kedua tugas tersebut dibangun di atas ide dasar yang sama: menggunakan pencocokan semantik untuk mengidentifikasi konten yang relevan dan menyaring bagian yang tidak relevan. Karena alasan ini, Provence dapat digunakan kembali untuk penyorotan semantik dengan adaptasi yang relatif sedikit.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/provence_053cd3bccc.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Provence adalah model khusus bahasa Inggris dan berkinerja cukup baik dalam pengaturan tersebut. <a href="https://huggingface.co/naver/xprovence-reranker-bgem3-v1"><strong>XProvence</strong></a> adalah varian multibahasa, mendukung lebih dari selusin bahasa, termasuk bahasa Mandarin, Jepang, dan Korea. Sekilas, ini membuat XProvence tampak sebagai kandidat yang baik untuk skenario penyorotan semantik bilingual atau multibahasa.</p>
<p>Namun dalam praktiknya, baik Provence maupun XProvence memiliki beberapa keterbatasan penting:</p>
<ul>
<li><p><strong>Performa bahasa Inggris yang lebih lemah dalam model multibahasa:</strong> XProvence tidak menyamai kinerja Provence pada tolok ukur bahasa Inggris. Ini adalah pertukaran yang umum terjadi pada model multibahasa: kapasitas dibagi di berbagai bahasa, yang sering kali menyebabkan kinerja yang lebih lemah pada bahasa dengan sumber daya tinggi seperti bahasa Inggris. Keterbatasan ini penting dalam sistem dunia nyata di mana bahasa Inggris tetap menjadi beban kerja utama atau dominan.</p></li>
<li><p><strong>Performa bahasa Mandarin yang terbatas:</strong> XProvence mendukung banyak bahasa. Selama pelatihan multibahasa, data dan kapasitas model tersebar di berbagai bahasa, yang membatasi seberapa baik model dapat mengkhususkan diri pada satu bahasa. Akibatnya, kinerja bahasa Mandarinnya hanya dapat diterima secara marginal dan sering kali tidak cukup untuk kasus penggunaan penyorotan presisi tinggi.</p></li>
<li><p><strong>Ketidaksesuaian antara pemangkasan dan tujuan penyorotan:</strong> Provence dioptimalkan untuk pemangkasan konteks, di mana prioritasnya adalah mengingat kembali sebanyak mungkin konten yang berpotensi berguna untuk menghindari kehilangan informasi penting. Sebaliknya, penyorotan semantik menekankan pada ketepatan: hanya menyoroti kalimat yang paling relevan, bukan sebagian besar dokumen. Ketika model gaya Provence diterapkan pada penyorotan, ketidaksesuaian ini sering kali menyebabkan penyorotan yang terlalu luas atau berisik.</p></li>
<li><p><strong>Lisensi yang membatasi:</strong> Baik Provence maupun XProvence dirilis di bawah lisensi CC BY-NC 4.0, yang tidak mengizinkan penggunaan komersial. Pembatasan ini saja sudah membuat mereka tidak cocok untuk banyak penerapan produksi.</p></li>
</ul>
<h3 id="Open-Provence" class="common-anchor-header">Open Provence</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/openprovence_en_c4f0aa8b65.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><a href="https://github.com/hotchpotch/open_provence"><strong>Open Provence</strong></a> adalah proyek berbasis komunitas yang mengimplementasikan ulang jalur pelatihan Provence secara terbuka dan transparan. Open Provence tidak hanya menyediakan skrip pelatihan, tetapi juga alur kerja pemrosesan data, alat evaluasi, dan model yang telah dilatih sebelumnya dalam berbagai skala.</p>
<p>Keuntungan utama dari Open Provence adalah <strong>lisensi MIT-nya yang permisif</strong>. Tidak seperti Provence dan XProvence, Open Provence dapat digunakan dengan aman di lingkungan komersial tanpa batasan hukum, yang membuatnya menarik bagi tim yang berorientasi pada produksi.</p>
<p>Meskipun demikian, Open Provence saat ini hanya mendukung <strong>bahasa Inggris dan Jepang</strong>, yang membuatnya tidak cocok untuk kasus penggunaan dwibahasa.</p>
<h2 id="We-Trained-and-Open-Sourced-a-Bilingual-Semantic-Highlighting-Model" class="common-anchor-header">Kami Melatih dan Membuka Sumber Model Penyorotan Semantik Bilingual<button data-href="#We-Trained-and-Open-Sourced-a-Bilingual-Semantic-Highlighting-Model" class="anchor-icon" translate="no">
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
    </button></h2><p>Model penyorotan semantik yang dirancang untuk beban kerja di dunia nyata harus memberikan beberapa kemampuan penting:</p>
<ul>
<li><p>Performa multibahasa yang kuat</p></li>
<li><p>Jendela konteks yang cukup besar untuk mendukung dokumen yang panjang</p></li>
<li><p>Generalisasi di luar domain yang kuat</p></li>
<li><p>Presisi tinggi dalam tugas penyorotan semantik</p></li>
<li><p>Lisensi yang permisif dan ramah produksi (MIT atau Apache 2.0)</p></li>
</ul>
<p>Setelah mengevaluasi solusi yang ada, kami menemukan bahwa tidak ada satu pun model yang tersedia yang memenuhi persyaratan yang diperlukan untuk penggunaan produksi. Jadi kami memutuskan untuk melatih model sorotan semantik kami sendiri: <a href="https://huggingface.co/zilliz/semantic-highlight-bilingual-v1">zilliz/semantic-highlight-bilingual-v1</a>.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/hugging_face_56eca8f423.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Untuk mencapai semua ini, kami mengadopsi pendekatan langsung: menggunakan model bahasa yang besar untuk menghasilkan data berlabel berkualitas tinggi, kemudian melatih model penyorotan semantik ringan di atasnya dengan menggunakan perangkat sumber terbuka. Hal ini memungkinkan kami menggabungkan kekuatan penalaran LLM dengan efisiensi dan latensi rendah yang diperlukan dalam sistem produksi.</p>
<p><strong>Bagian yang paling menantang dari proses ini adalah konstruksi data</strong>. Selama anotasi, kami meminta LLM (Qwen3 8B) untuk mengeluarkan tidak hanya rentang sorotan tetapi juga seluruh penalaran di baliknya. Sinyal penalaran tambahan ini menghasilkan pengawasan yang lebih akurat dan konsisten dan secara signifikan meningkatkan kualitas model yang dihasilkan.</p>
<p>Pada tingkat tinggi, pipeline anotasi bekerja sebagai berikut: <strong>Penalaran LLM → label sorotan → penyaringan → sampel pelatihan akhir.</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/pipeline_en_2e917fe1ce.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Desain ini memberikan tiga manfaat konkret dalam praktiknya:</p>
<ul>
<li><p><strong>Kualitas pelabelan yang lebih tinggi</strong>: Model diminta untuk <em>berpikir terlebih dahulu, baru kemudian menjawab</em>. Langkah penalaran menengah ini berfungsi sebagai pemeriksaan mandiri bawaan, mengurangi kemungkinan label yang dangkal atau tidak konsisten.</p></li>
<li><p><strong>Peningkatan kemampuan observasi dan debug</strong>: Karena setiap label disertai dengan jejak penalaran, kesalahan menjadi terlihat. Hal ini memudahkan untuk mendiagnosis kasus kegagalan dan dengan cepat menyesuaikan petunjuk, aturan, atau filter data dalam pipeline.</p></li>
<li><p><strong>Data yang dapat digunakan kembali</strong>: Jejak penalaran memberikan konteks yang berharga untuk pelabelan ulang di masa mendatang. Ketika persyaratan berubah, data yang sama dapat ditinjau kembali dan disempurnakan tanpa memulai dari awal.</p></li>
</ul>
<p>Dengan menggunakan pipeline ini, kami menghasilkan lebih dari satu juta sampel pelatihan dwibahasa, yang dibagi secara merata antara bahasa Inggris dan Mandarin.</p>
<p>Untuk pelatihan model, kami mulai dari BGE-M3 Reranker v2 (0,6B parameter, 8.192 jendela konteks token), mengadopsi kerangka kerja pelatihan Open Provence, dan melatih selama tiga epoch pada GPU 8× A100, menyelesaikan pelatihan dalam waktu kurang lebih lima jam.</p>
<p>Kami akan membahas lebih dalam mengenai pilihan teknis ini-termasuk mengapa kami mengandalkan jejak penalaran, bagaimana kami memilih model dasar, dan bagaimana dataset dibangun-dalam artikel lanjutan.</p>
<h2 id="Benchmarking-Zilliz’s-Bilingual-Semantic-Highlighting-Model" class="common-anchor-header">Membandingkan Model Penyorotan Semantik Bilingual Zilliz<button data-href="#Benchmarking-Zilliz’s-Bilingual-Semantic-Highlighting-Model" class="anchor-icon" translate="no">
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
    </button></h2><p>Untuk menilai kinerja dunia nyata, kami mengevaluasi beberapa model penyorotan semantik di berbagai set data. Tolok ukur ini mencakup skenario dalam domain dan di luar domain, dalam bahasa Inggris dan Mandarin, untuk mencerminkan keragaman konten yang ditemukan dalam sistem produksi.</p>
<h3 id="Datasets" class="common-anchor-header">Dataset</h3><p>Kami menggunakan dataset berikut ini dalam evaluasi kami:</p>
<ul>
<li><p><strong>MultiSpanQA (Bahasa Inggris)</strong> - dataset penjawab pertanyaan multi-rentang dalam domain</p></li>
<li><p><strong>WikiText-2 (Bahasa Inggris)</strong> - korpus Wikipedia di luar domain</p></li>
<li><p><strong>MultiSpanQA-ZH (Bahasa</strong> Mandarin) - dataset penjawab pertanyaan multi-bentang dalam bahasa Mandarin</p></li>
<li><p><strong>WikiText-2-ZH (bahasa</strong> Mandarin) - korpus Wikipedia bahasa Mandarin di luar domain</p></li>
</ul>
<h3 id="Models-Compared" class="common-anchor-header">Model-model yang Dibandingkan</h3><p>Model-model yang termasuk dalam perbandingan adalah:</p>
<ul>
<li><p><strong>Model Open Provence</strong></p></li>
<li><p><strong>Provence / XProvence</strong> (dirilis oleh Naver)</p></li>
<li><p><strong>Penyorot Semantik OpenSearch</strong></p></li>
<li><p><strong>Model penyorotan semantik dwibahasa dari Zilliz</strong></p></li>
</ul>
<h3 id="Results-and-Analysis" class="common-anchor-header">Hasil dan Analisis</h3><p><strong>Kumpulan Data Bahasa Inggris:</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/en_dataset_fce4cbc747.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Dataset Bahasa Mandarin:</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/zh_dataset_ac7760e0b5.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Di seluruh tolok ukur dwibahasa, model kami mencapai <strong>skor F1 rata-rata</strong> yang <strong>canggih</strong>, mengungguli semua model dan pendekatan yang telah dievaluasi sebelumnya. Peningkatan ini terutama terlihat pada <strong>dataset</strong> berbahasa Mandarin, di mana model kami secara signifikan mengungguli XProvence-satu-satunya model yang dievaluasi dengan dukungan bahasa Mandarin.</p>
<p>Lebih penting lagi, model kami memberikan kinerja yang seimbang di bahasa Inggris dan Mandarin, suatu hal yang sulit dicapai oleh solusi yang sudah ada:</p>
<ul>
<li><p><strong>Open Provence</strong> hanya mendukung bahasa Inggris</p></li>
<li><p><strong>XProvence</strong> mengorbankan kinerja bahasa Inggris dibandingkan dengan Provence</p></li>
<li><p><strong>OpenSearch Semantic Highlighter</strong> tidak memiliki dukungan bahasa Mandarin dan menunjukkan generalisasi yang lemah</p></li>
</ul>
<p>Hasilnya, model kami menghindari pertukaran yang umum terjadi antara cakupan bahasa dan kinerja, sehingga lebih cocok untuk penerapan dwibahasa di dunia nyata.</p>
<h3 id="A-Concrete-Example-in-Practice" class="common-anchor-header">Contoh Konkret dalam Praktik</h3><p>Di luar nilai tolok ukur, sering kali lebih baik untuk memeriksa contoh konkret. Kasus berikut ini menunjukkan bagaimana model kami berperilaku dalam skenario penyorotan semantik yang nyata dan mengapa ketepatan itu penting.</p>
<p><strong>Pertanyaan:</strong> Siapa yang menulis film <em>The Killing of a Sacred Deer</em>?</p>
<p><strong>Konteks (5 kalimat):</strong></p>
<ol>
<li><p><em>The Killing of a Sacred Deer</em> adalah sebuah film thriller psikologis tahun 2017 yang disutradarai oleh Yorgos Lanthimos, dengan skenario yang ditulis oleh Lanthimos dan Efthymis Filippou.</p></li>
<li><p>Film ini dibintangi oleh Colin Farrell, Nicole Kidman, Barry Keoghan, Raffey Cassidy, Sunny Suljic, Alicia Silverstone, dan Bill Camp.</p></li>
<li><p>Kisah ini didasarkan pada drama Yunani kuno <em>Iphigenia in Aulis</em> karya Euripides.</p></li>
<li><p>Film ini mengisahkan seorang ahli bedah jantung yang menjalin persahabatan rahasia dengan seorang remaja laki-laki yang terhubung dengan masa lalunya.</p></li>
<li><p>Dia memperkenalkan anak laki-laki itu kepada keluarganya, setelah itu penyakit misterius mulai terjadi.</p></li>
</ol>
<p><strong>Sorotan yang benar: Kalimat 1</strong> adalah jawaban yang benar, karena secara eksplisit menyatakan bahwa skenario film ini ditulis oleh Yorgos Lanthimos dan Efthymis Filippou.</p>
<p>Contoh ini mengandung jebakan halus. <strong>Kalimat 3</strong> menyebutkan Euripides, penulis drama Yunani asli yang menjadi dasar cerita. Namun, pertanyaannya menanyakan siapa yang menulis <em>filmnya</em>, bukan materi sumbernya. Oleh karena itu, jawaban yang benar adalah penulis skenario film tersebut, bukan penulis naskah dari ribuan tahun yang lalu.</p>
<p><strong>Hasil:</strong></p>
<p>Tabel di bawah ini merangkum bagaimana kinerja model yang berbeda pada contoh ini.</p>
<table>
<thead>
<tr><th style="text-align:center"><strong>Model</strong></th><th style="text-align:center"><strong>Jawaban yang Benar Diidentifikasi</strong></th><th style="text-align:center"><strong>Hasil</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center"><strong>Kami (Bilingual M3)</strong></td><td style="text-align:center">✓</td><td style="text-align:center">Kalimat yang dipilih adalah kalimat 1 (benar) dan kalimat 3</td></tr>
<tr><td style="text-align:center"><strong>XProvence v1</strong></td><td style="text-align:center">✗</td><td style="text-align:center">Hanya memilih kalimat 3, tidak memilih jawaban yang benar</td></tr>
<tr><td style="text-align:center"><strong>XProvence v2</strong></td><td style="text-align:center">✗</td><td style="text-align:center">Hanya memilih kalimat 3, melewatkan jawaban yang benar</td></tr>
</tbody>
</table>
<p><strong>Perbandingan Skor Tingkat Kalimat</strong></p>
<table>
<thead>
<tr><th style="text-align:center"><strong>Kalimat</strong></th><th><strong>Kami (Bilingual M3)</strong></th><th style="text-align:center"><strong>XProvence v1</strong></th><th style="text-align:center"><strong>XProvence v2</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center">Kalimat 1 (skenario film, <strong>benar</strong>)</td><td><strong>0.915</strong></td><td style="text-align:center">0.133</td><td style="text-align:center">0.081</td></tr>
<tr><td style="text-align:center">Kalimat 3 (naskah asli, pengalih perhatian)</td><td>0.719</td><td style="text-align:center"><strong>0.947</strong></td><td style="text-align:center"><strong>0.802</strong></td></tr>
</tbody>
</table>
<p><strong>Di mana XProvence gagal</strong></p>
<ul>
<li><p>XProvence sangat tertarik pada kata kunci <em>"Euripides"</em> dan <em>"menulis",</em> memberikan skor yang hampir sempurna untuk kalimat 3 (0,947 dan 0,802).</p></li>
<li><p>Pada saat yang sama, sebagian besar mengabaikan jawaban yang benar pada kalimat 1, memberikan skor yang sangat rendah (0,133 dan 0,081).</p></li>
<li><p>Bahkan setelah menurunkan ambang batas keputusan dari 0.5 menjadi 0.2, model masih gagal memunculkan jawaban yang benar.</p></li>
</ul>
<p>Dengan kata lain, model ini lebih didorong oleh asosiasi kata kunci di tingkat permukaan daripada maksud pertanyaan yang sebenarnya.</p>
<p><strong>Bagaimana model kami berperilaku berbeda</strong></p>
<ul>
<li><p>Model kami memberikan skor tinggi (0.915) untuk jawaban yang benar pada kalimat 1, dengan mengidentifikasi <em>penulis skenario film dengan</em> benar <em>.</em></p></li>
<li><p>Model ini juga memberikan skor moderat (0,719) untuk kalimat 3, karena kalimat tersebut menyebutkan konsep yang berhubungan dengan skenario.</p></li>
<li><p>Yang terpenting, pemisahannya jelas dan bermakna: <strong>0.915 vs 0.719</strong>, selisih hampir 0.2.</p></li>
</ul>
<p>Contoh ini menyoroti kekuatan inti dari pendekatan kami: bergerak di luar asosiasi yang digerakkan oleh kata kunci untuk menafsirkan maksud pengguna dengan benar. Bahkan ketika beberapa konsep "penulis" muncul, model ini secara konsisten menyoroti konsep yang sebenarnya dimaksud oleh pertanyaan.</p>
<p>Kami akan membagikan laporan evaluasi yang lebih rinci dan studi kasus tambahan dalam postingan berikutnya.</p>
<h2 id="Try-It-Out-and-Tell-Us-What-You-Think" class="common-anchor-header">Cobalah dan Beritahu Kami Apa yang Anda Pikirkan<button data-href="#Try-It-Out-and-Tell-Us-What-You-Think" class="anchor-icon" translate="no">
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
    </button></h2><p>Kami telah membuka sumber model penyorotan semantik dwibahasa kami di <a href="https://huggingface.co/zilliz/semantic-highlight-bilingual-v1">Hugging Face</a>, dengan semua bobot model yang tersedia untuk umum sehingga Anda dapat segera mulai bereksperimen. Kami ingin mendengar bagaimana cara kerjanya untuk Anda-silakan bagikan umpan balik, masalah, atau ide perbaikan saat Anda mencobanya.</p>
<p>Secara paralel, kami sedang mengerjakan layanan inferensi yang siap untuk produksi dan mengintegrasikan model secara langsung ke dalam <a href="https://milvus.io/">Milvus</a> sebagai API Semantic Highlighting. Integrasi ini sudah berjalan dan akan segera tersedia.</p>
<p>Penyorotan semantik membuka pintu menuju pengalaman RAG dan AI agentic yang lebih intuitif. Ketika Milvus mengambil beberapa dokumen yang panjang, sistem dapat segera menampilkan kalimat yang paling relevan, sehingga jelas di mana jawabannya. Hal ini tidak hanya meningkatkan pengalaman pengguna akhir, tetapi juga membantu pengembang men-debug pipeline pencarian dengan menunjukkan dengan tepat bagian mana dari konteks yang diandalkan oleh sistem.</p>
<p>Kami yakin penyorotan semantik akan menjadi kemampuan standar dalam sistem pencarian dan RAG generasi berikutnya. Jika Anda memiliki ide, saran, atau kasus penggunaan untuk penyorotan semantik dwibahasa, bergabunglah dengan <a href="https://discord.com/invite/8uyFbECzPX">saluran Discord</a> kami dan bagikan pemikiran Anda. Anda juga dapat memesan sesi tatap muka selama 20 menit untuk mendapatkan wawasan, panduan, dan jawaban atas pertanyaan Anda melalui <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">Milvus Office Hours</a>.</p>
