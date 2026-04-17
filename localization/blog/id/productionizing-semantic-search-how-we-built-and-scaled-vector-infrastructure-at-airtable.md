---
id: >-
  productionizing-semantic-search-how-we-built-and-scaled-vector-infrastructure-at-airtable.md
title: >-
  Memproduksi Pencarian Semantik: Cara Kami Membangun dan Meningkatkan
  Infrastruktur Vektor di Airtable
author: Aria Malkani and Cole Dearmon-Moore
date: 2026-3-18
cover: assets.zilliz.com/cover_airtable_milvus_3c77b22ee2.jpg
tag: Use Cases
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  Airtable semantic search, Milvus vector database, vector infrastructure,
  multi-tenant vector search, scalable AI retrieval
meta_title: |
  How Airtable Built and Scaled Vector Infrastructure with Milvus
desc: >-
  Pelajari bagaimana Airtable membangun infrastruktur vektor berbasis Milvus
  yang dapat diskalakan untuk pencarian semantik, pengambilan multi-tenant, dan
  pengalaman AI dengan latensi rendah.
origin: >-
  https://milvus.io/blog/productionizing-semantic-search-how-we-built-and-scaled-vector-infrastructure-at-airtable.md
---
<p><em>Artikel ini awalnya diterbitkan di</em> <em>saluran</em> <em><a href="https://medium.com/airtable-eng/productionizing-semantic-search-how-we-built-and-scaled-vector-infrastructure-at-airtable-180fff11a136">Airtable Medium</a></em> <em>dan diposting ulang di sini dengan izin</em>.</p>
<p>Ketika pencarian semantik di Airtable berevolusi dari sebuah konsep menjadi fitur produk inti, tim Infrastruktur Data menghadapi tantangan untuk menskalakannya. Seperti yang dijelaskan dalam <a href="https://medium.com/airtable-eng/building-a-resilient-embedding-system-for-semantic-search-at-airtable-d5fdf27807e2">tulisan</a> kami <a href="https://medium.com/airtable-eng/building-a-resilient-embedding-system-for-semantic-search-at-airtable-d5fdf27807e2">sebelumnya tentang Membangun Sistem Penyematan</a>, kami telah merancang lapisan aplikasi yang kuat dan akhirnya konsisten untuk menangani siklus hidup penyematan. Tetapi satu bagian penting masih belum ada dalam diagram arsitektur kami: basis data vektor itu sendiri.</p>
<p>Kami membutuhkan mesin penyimpanan yang mampu mengindeks dan melayani miliaran penyematan, mendukung multi-tenancy yang masif, serta mempertahankan target kinerja dan ketersediaan dalam lingkungan cloud terdistribusi. Ini adalah kisah tentang bagaimana kami merancang, mengeraskan, dan mengembangkan platform pencarian vektor kami untuk menjadi pilar inti dari tumpukan infrastruktur Airtable.</p>
<h2 id="Background" class="common-anchor-header">Latar Belakang<button data-href="#Background" class="anchor-icon" translate="no">
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
    </button></h2><p>Di Airtable, tujuan kami adalah membantu pelanggan bekerja dengan data mereka dengan cara yang kuat dan intuitif. Dengan munculnya LLM yang semakin kuat dan akurat, fitur-fitur yang memanfaatkan makna semantik dari data Anda telah menjadi inti dari produk kami.</p>
<h2 id="How-We-Use-Semantic-Search" class="common-anchor-header">Bagaimana Kami Menggunakan Pencarian Semantik<button data-href="#How-We-Use-Semantic-Search" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Omni-Airtable’s-AI-Chat-answering-real-questions-from-large-datasets" class="common-anchor-header">Omni (AI Chat Airtable) menjawab pertanyaan nyata dari kumpulan data yang besar</h3><p>Bayangkan mengajukan pertanyaan bahasa alami dari basis data (database) Anda yang memiliki setengah juta baris, dan mendapatkan jawaban yang benar dan kaya konteks. Sebagai contoh:</p>
<p>"Apa yang dikatakan pelanggan tentang daya tahan baterai akhir-akhir ini?"</p>
<p>Pada kumpulan data yang kecil, Anda dapat mengirim semua baris secara langsung ke LLM. Pada skala besar, hal tersebut menjadi tidak mungkin dilakukan. Sebaliknya, kami membutuhkan sistem yang mampu melakukannya:</p>
<ul>
<li>Memahami maksud semantik dari sebuah kueri</li>
<li>Mengambil baris yang paling relevan melalui pencarian kemiripan vektor</li>
<li>Menyediakan baris-baris tersebut sebagai konteks untuk LLM</li>
</ul>
<p>Persyaratan ini membentuk hampir setiap keputusan desain yang mengikuti: Omni harus terasa instan dan cerdas, bahkan pada basis data yang sangat besar.</p>
<h3 id="Linked-record-recommendations-Meaning-over-exact-matches" class="common-anchor-header">Rekomendasi catatan terkait: Makna di atas kecocokan yang sama persis</h3><p>Pencarian semantik juga meningkatkan fitur inti Airtable: catatan yang ditautkan. Pengguna membutuhkan saran hubungan berdasarkan konteks, bukan pencocokan teks yang sama persis. Misalnya, deskripsi proyek dapat menyiratkan hubungan dengan "Infrastruktur Tim" tanpa menggunakan frasa tertentu.</p>
<p>Memberikan saran sesuai permintaan ini membutuhkan pengambilan semantik berkualitas tinggi dengan latensi yang konsisten dan dapat diprediksi.</p>
<h2 id="Our-Design-Priorities" class="common-anchor-header">Prioritas Desain Kami<button data-href="#Our-Design-Priorities" class="anchor-icon" translate="no">
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
    </button></h2><p>Untuk mendukung fitur-fitur ini dan lebih banyak lagi, kami menambatkan sistem pada 4 tujuan:</p>
<ul>
<li><strong>Kueri latensi rendah (500ms p99):</strong> kinerja yang dapat diprediksi sangat penting untuk kepercayaan pengguna</li>
<li><strong>Penulisan dengan throughput tinggi:</strong> basis berubah secara konstan, dan penyematan harus tetap sinkron</li>
<li><strong>Skalabilitas horizontal:</strong> sistem harus mendukung jutaan basis independen</li>
<li><strong>Self-hosting:</strong> semua data pelanggan harus tetap berada di dalam infrastruktur yang dikontrol Airtable</li>
</ul>
<p>Tujuan-tujuan ini membentuk setiap keputusan arsitektur yang mengikutinya.</p>
<h2 id="Vector-Database-Vendor-Evaluation" class="common-anchor-header">Evaluasi Vendor Basis Data Vektor<button data-href="#Vector-Database-Vendor-Evaluation" class="anchor-icon" translate="no">
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
    </button></h2><p>Pada akhir tahun 2024, kami mengevaluasi beberapa opsi basis data vektor dan pada akhirnya memilih <a href="https://milvus.io/">Milvus</a> berdasarkan tiga persyaratan utama.</p>
<ul>
<li>Pertama, kami memprioritaskan solusi yang dihosting sendiri untuk memastikan privasi data dan mempertahankan kontrol yang baik atas infrastruktur kami.</li>
<li>Kedua, beban kerja kami yang sangat banyak menulis dan pola kueri yang meledak-ledak membutuhkan sistem yang dapat menskalakan secara elastis dengan tetap mempertahankan latensi yang rendah dan dapat diprediksi.</li>
<li>Terakhir, arsitektur kami membutuhkan isolasi yang kuat di jutaan penyewa pelanggan.</li>
</ul>
<p><strong>Milvus</strong> muncul sebagai solusi yang paling sesuai: sifatnya yang terdistribusi mendukung multi-tenancy yang masif dan memungkinkan kami untuk menskalakan konsumsi, pengindeksan, dan eksekusi kueri secara mandiri, memberikan performa yang tinggi sekaligus menjaga biaya tetap dapat diprediksi.</p>
<h2 id="Architecture-Design" class="common-anchor-header">Desain Arsitektur<button data-href="#Architecture-Design" class="anchor-icon" translate="no">
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
    </button></h2><p>Setelah memilih teknologi, kami kemudian harus menentukan arsitektur untuk mewakili bentuk data Airtable yang unik: jutaan "basis" berbeda yang dimiliki oleh pelanggan yang berbeda.</p>
<h2 id="The-Partitioning-Challenge" class="common-anchor-header">Tantangan Partisi<button data-href="#The-Partitioning-Challenge" class="anchor-icon" translate="no">
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
    </button></h2><p>Kami mengevaluasi dua strategi partisi data utama:</p>
<h3 id="Option-1-Shared-Partitions" class="common-anchor-header">Opsi 1: Partisi Bersama</h3><p>Beberapa basis berbagi partisi, dan kueri dicakup dengan memfilter pada id basis. Hal ini meningkatkan pemanfaatan sumber daya, tetapi memperkenalkan overhead pemfilteran tambahan dan membuat penghapusan basis menjadi lebih kompleks.</p>
<h3 id="Option-2-One-Base-per-Partition" class="common-anchor-header">Opsi 2: Satu Basis per Partisi</h3><p>Setiap basis Airtable dipetakan ke partisi fisiknya sendiri di Milvus. Ini memberikan isolasi yang kuat, memungkinkan penghapusan basis yang cepat dan sederhana, dan menghindari dampak kinerja dari pemfilteran pasca-kueri.</p>
<h3 id="Final-Strategy" class="common-anchor-header">Strategi Akhir</h3><p>Kami memilih opsi 2 karena kesederhanaan dan isolasi yang kuat. Namun, pengujian awal menunjukkan bahwa membuat 100 ribu partisi dalam satu koleksi Milvus menyebabkan penurunan kinerja yang signifikan:</p>
<ul>
<li>Latensi pembuatan partisi meningkat dari ~20 ms menjadi ~250 ms</li>
<li>Waktu pemuatan partisi melebihi 30 detik</li>
</ul>
<p>Untuk mengatasi hal ini, kami membatasi jumlah partisi per koleksi. Untuk setiap cluster Milvus, kami membuat 400 koleksi, masing-masing dengan paling banyak 1.000 partisi. Hal ini membatasi jumlah total basis per klaster hingga 400 ribu, dan klaster baru disediakan saat pelanggan tambahan bergabung.</p>
<h2 id="Indexing--Recall" class="common-anchor-header">Pengindeksan &amp; Pemanggilan Kembali<button data-href="#Indexing--Recall" class="anchor-icon" translate="no">
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
    </button></h2><p>Pilihan indeks ternyata menjadi salah satu trade-off yang paling penting dalam sistem kami. Ketika sebuah partisi di-load, indeksnya di-cache di memori atau di disk. Untuk mencapai keseimbangan antara tingkat pemanggilan, ukuran indeks, dan kinerja, kami membuat tolok ukur beberapa jenis indeks.</p>
<ul>
<li><strong>IVF-SQ8:</strong> Menawarkan jejak memori yang kecil tetapi daya ingat yang lebih rendah.</li>
<li><strong>HNSW:</strong> Memberikan pemanggilan kembali terbaik (99%-100%) tetapi haus memori.</li>
<li><strong>DiskANN:</strong> Menawarkan pemanggilan yang mirip dengan HNSW tetapi dengan latensi kueri yang lebih tinggi</li>
</ul>
<p>Pada akhirnya, kami memilih HNSW karena karakteristik pemanggilan dan kinerjanya yang unggul.</p>
<h2 id="The-Application-layer" class="common-anchor-header">Lapisan Aplikasi<button data-href="#The-Application-layer" class="anchor-icon" translate="no">
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
    </button></h2><p>Pada tingkat tinggi, pipeline pencarian semantik Airtable melibatkan dua aliran inti:</p>
<ol>
<li><strong>Aliran konsumsi:</strong> Mengonversi baris Airtable menjadi sematan dan menyimpannya di Milvus</li>
<li><strong>Aliran kueri:</strong> Sematkan kueri pengguna, ambil ID baris yang relevan, dan berikan konteks ke LLM</li>
</ol>
<p>Kedua aliran tersebut harus beroperasi secara terus menerus dan andal dalam skala besar, dan kita akan membahasnya di bawah ini. Kita akan membahasnya satu per satu di bawah ini.</p>
<h2 id="Ingestion-Flow-Keeping-Milvus-in-Sync-with-Airtable" class="common-anchor-header">Alur Penelanan: Menjaga Milvus Tetap Sinkron dengan Airtable<button data-href="#Ingestion-Flow-Keeping-Milvus-in-Sync-with-Airtable" class="anchor-icon" translate="no">
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
    </button></h2><p>Ketika pengguna membuka Omni, Airtable mulai menyinkronkan basis mereka ke Milvus. Kami membuat partisi, lalu memproses baris dalam potongan-potongan, menghasilkan penyisipan dan memasukkannya ke dalam Milvus. Sejak saat itu, kami menangkap setiap perubahan yang dibuat pada basis, dan melakukan embedding dan upsert pada baris-baris tersebut untuk menjaga konsistensi data.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Airtable_Milvusblog_1_aac199ae50.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Query-Flow-How-we-use-the-Data" class="common-anchor-header">Alur Kueri: Bagaimana kami menggunakan Data<button data-href="#Query-Flow-How-we-use-the-Data" class="anchor-icon" translate="no">
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
    </button></h2><p>Di sisi kueri, kami menyematkan permintaan pengguna dan mengirimkannya ke Milvus untuk mengambil ID baris yang paling relevan. Kami kemudian mengambil versi terbaru dari baris-baris tersebut dan memasukkannya sebagai konteks dalam permintaan ke LLM.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Airtable_Milvusblog_2_6e9067b16d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Operational-Challenges--How-We-Solved-Them" class="common-anchor-header">Tantangan Operasional &amp; Bagaimana Kami Mengatasinya<button data-href="#Operational-Challenges--How-We-Solved-Them" class="anchor-icon" translate="no">
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
    </button></h2><p>Membangun arsitektur pencarian semantik adalah satu tantangan; menjalankannya dengan andal untuk ratusan ribu basis data adalah tantangan lainnya. Di bawah ini adalah beberapa pelajaran operasional utama yang kami pelajari selama ini.</p>
<h3 id="Deployment" class="common-anchor-header">Penerapan</h3><p>Kami menggunakan Milvus melalui Kubernetes CRD dengan <a href="https://github.com/zilliztech/milvus-operator">operator Milvus</a>, yang memungkinkan kami untuk mendefinisikan dan mengelola cluster secara deklaratif. Setiap perubahan, baik itu pembaruan konfigurasi, peningkatan klien, atau peningkatan Milvus, berjalan melalui uji unit dan uji beban sesuai permintaan yang mensimulasikan lalu lintas produksi sebelum diluncurkan ke pengguna.</p>
<p>Pada versi 2.5, cluster Milvus terdiri dari komponen-komponen inti ini:</p>
<ul>
<li>Query Node menyimpan indeks vektor dalam memori dan menjalankan pencarian vektor</li>
<li>Data Node menangani konsumsi dan pemadatan, dan menyimpan data baru ke dalam penyimpanan</li>
<li>Index Node membangun dan memelihara indeks vektor untuk menjaga pencarian tetap cepat seiring bertambahnya data</li>
<li>Node Koordinator mengatur semua aktivitas klaster dan pembagian pecahan</li>
<li>Node proxy merutekan lalu lintas API dan menyeimbangkan beban di seluruh node</li>
<li>Kafka menyediakan tulang punggung log/streaming untuk pengiriman pesan internal dan aliran data</li>
<li>Etcd menyimpan metadata cluster dan status koordinasi</li>
</ul>
<p>Dengan otomatisasi berbasis CRD dan jalur pengujian yang ketat, kami dapat meluncurkan pembaruan dengan cepat dan aman.</p>
<h2 id="Observability-Understanding-System-Health-End-to-End" class="common-anchor-header">Pengamatan: Memahami Kesehatan Sistem dari Ujung ke Ujung<button data-href="#Observability-Understanding-System-Health-End-to-End" class="anchor-icon" translate="no">
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
    </button></h2><p>Kami memantau sistem pada dua tingkat untuk memastikan pencarian semantik tetap cepat dan dapat diprediksi.</p>
<p>Di tingkat infrastruktur, kami melacak CPU, penggunaan memori, dan kesehatan pod di semua komponen Milvus. Sinyal-sinyal ini memberi tahu kami apakah cluster beroperasi dalam batas aman dan membantu kami menangkap masalah seperti kejenuhan sumber daya atau node yang tidak sehat sebelum mempengaruhi pengguna.</p>
<p>Pada lapisan layanan, kami fokus pada seberapa baik setiap basis mengimbangi beban kerja konsumsi dan kueri. Metrik seperti pemadatan dan throughput pengindeksan memberi kita visibilitas ke dalam seberapa efisien data dicerna. Tingkat keberhasilan kueri dan latensi memberi kita pemahaman tentang pengalaman pengguna yang melakukan kueri data, dan pertumbuhan partisi memberi tahu kita bagaimana data kita berkembang, sehingga kita dapat mengetahui jika kita perlu melakukan penskalaan.</p>
<h2 id="Node-Rotation" class="common-anchor-header">Rotasi Node<button data-href="#Node-Rotation" class="anchor-icon" translate="no">
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
    </button></h2><p>Untuk alasan keamanan dan kepatuhan, kami secara teratur merotasi node Kubernetes. Dalam klaster pencarian vektor, hal ini bukanlah hal yang sepele:</p>
<ul>
<li>Saat node kueri dirotasi, koordinator akan menyeimbangkan kembali data dalam memori di antara node kueri</li>
<li>Kafka dan Etcd menyimpan informasi yang bersifat stateful dan membutuhkan kuorum dan ketersediaan yang berkelanjutan</li>
</ul>
<p>Kami mengatasi hal ini dengan anggaran gangguan yang ketat dan kebijakan rotasi satu node per satu waktu. Koordinator Milvus diberi waktu untuk menyeimbangkan kembali sebelum node berikutnya dirotasi. Pengaturan yang cermat ini menjaga keandalan tanpa memperlambat kecepatan kami.</p>
<h2 id="Cold-Partition-Offloading" class="common-anchor-header">Pembongkaran Partisi Dingin<button data-href="#Cold-Partition-Offloading" class="anchor-icon" translate="no">
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
    </button></h2><p>Salah satu kemenangan operasional terbesar kami adalah menyadari bahwa data kami memiliki pola akses panas/dingin yang jelas. Dengan menganalisis penggunaan, kami menemukan bahwa hanya ~25% dari data di Milvus yang ditulis ke atau dibaca dari dalam satu minggu. Milvus memungkinkan kami mengosongkan seluruh partisi, membebaskan memori pada Query Node. Jika data tersebut dibutuhkan di kemudian hari, kita dapat memuatnya kembali dalam hitungan detik. Hal ini memungkinkan kita untuk menyimpan data yang penting dalam memori dan melepaskan sisanya, sehingga mengurangi biaya dan memungkinkan kita untuk menskalakan secara lebih efisien dari waktu ke waktu.</p>
<h2 id="Data-Recovery" class="common-anchor-header">Pemulihan Data<button data-href="#Data-Recovery" class="anchor-icon" translate="no">
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
    </button></h2><p>Sebelum meluncurkan Milvus secara luas, kami membutuhkan keyakinan bahwa kami dapat pulih dengan cepat dari skenario kegagalan apa pun. Meskipun sebagian besar masalah dapat diatasi dengan toleransi kesalahan yang ada di dalam cluster, kami juga merencanakan untuk kasus-kasus yang jarang terjadi, di mana data bisa saja rusak atau sistem memasuki kondisi yang tidak dapat dipulihkan.</p>
<p>Dalam situasi tersebut, jalur pemulihan kami sangat mudah. Pertama-tama, kami menyiapkan cluster Milvus yang baru sehingga kami dapat segera melanjutkan melayani lalu lintas. Setelah cluster baru aktif, kami secara proaktif menanamkan kembali basis yang paling sering digunakan, lalu memproses sisanya saat diakses. Hal ini meminimalkan waktu henti untuk data yang paling sering diakses sementara sistem secara bertahap membangun kembali indeks semantik yang konsisten.</p>
<h2 id="What’s-Next" class="common-anchor-header">Selanjutnya<button data-href="#What’s-Next" class="anchor-icon" translate="no">
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
    </button></h2><p>Pekerjaan kami dengan <a href="https://milvus.io/">Milvus</a> telah meletakkan fondasi yang kuat untuk pencarian semantik di Airtable: mendukung pengalaman AI yang cepat dan bermakna dalam skala besar. Dengan adanya sistem ini, kami sekarang mengeksplorasi jalur pencarian yang lebih kaya dan integrasi AI yang lebih dalam di seluruh produk. Ada banyak pekerjaan menarik di depan, dan kami baru saja memulainya.</p>
<p><em>Terima kasih kepada semua Airtablets di Infrastruktur Data dan seluruh organisasi yang telah berkontribusi dalam proyek ini: Alex Sorokin, Andrew Wang, Aria Malkani, Cole Dearmon-Moore, Nabeel Farooqui, Will Powelson, Xiaobing Xia.</em></p>
<h2 id="About-Airtable" class="common-anchor-header">Tentang Airtable<button data-href="#About-Airtable" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://www.airtable.com/">Airtable</a> adalah platform operasi digital terkemuka yang memungkinkan organisasi membangun aplikasi khusus, mengotomatiskan alur kerja, dan mengelola data bersama pada skala perusahaan. Dirancang untuk mendukung proses lintas fungsi yang kompleks, Airtable membantu tim membangun sistem yang fleksibel untuk perencanaan, koordinasi, dan eksekusi dengan sumber kebenaran yang sama. Saat Airtable memperluas platform bertenaga AI-nya, teknologi seperti Milvus memainkan peran penting dalam memperkuat infrastruktur pencarian yang diperlukan untuk memberikan pengalaman produk yang lebih cepat dan lebih cerdas.</p>
