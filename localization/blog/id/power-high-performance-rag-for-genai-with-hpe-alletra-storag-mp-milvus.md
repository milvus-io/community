---
id: power-high-performance-rag-for-genai-with-hpe-alletra-storag-mp-milvus.md
title: Daya RAG berkinerja tinggi untuk GenAI dengan HPE Alletra Storage MP + Milvus
author: Denise Ochoa-Mendoza
date: 2025-11-10T00:00:00.000Z
cover: assets.zilliz.com/hpe_cover_ead19ff709.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus, HPE, Alletra Storage MP X10000, vector database, RAG'
meta_title: Optimized RAG with HPE Alletra Storage MP X10000 + Milvus
desc: >-
  Tingkatkan GenAI dengan HPE Alletra Storage MP X10000 dan Milvus. Dapatkan
  pencarian vektor yang dapat diskalakan, latensi rendah, dan penyimpanan kelas
  perusahaan untuk RAG yang cepat dan aman.
origin: >-
  https://community.hpe.com/t5/around-the-storage-block/power-high-performance-rag-for-genai-with-hpe-alletra-storage-mp/ba-p/7257369
---
<p><em>Artikel ini awalnya dipublikasikan di <a href="https://community.hpe.com/t5/around-the-storage-block/power-high-performance-rag-for-genai-with-hpe-alletra-storage-mp/ba-p/7257369">HPE Community</a> dan diposting ulang di sini dengan izin.</em></p>
<p>HPE Alletra Storage MP X10000 dan Milvus memiliki daya yang dapat diskalakan, RAG dengan latensi rendah, yang memungkinkan LLM memberikan respons yang akurat dan kaya akan konteks dengan pencarian vektor berkinerja tinggi untuk beban kerja GenAI.</p>
<h2 id="In-generative-AI-RAG-needs-more-than-just-an-LLM" class="common-anchor-header">Dalam AI generatif, RAG membutuhkan lebih dari sekadar LLM<button data-href="#In-generative-AI-RAG-needs-more-than-just-an-LLM" class="anchor-icon" translate="no">
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
    </button></h2><p>Konteks melepaskan kekuatan sebenarnya dari AI generatif (GenAI) dan model bahasa besar (LLM). Ketika LLM memiliki sinyal yang tepat untuk mengarahkan responsnya, LLM dapat memberikan jawaban yang akurat, relevan, dan dapat dipercaya.</p>
<p>Bayangkan seperti ini: jika Anda dijatuhkan ke dalam hutan lebat dengan perangkat GPS tetapi tidak ada sinyal satelit. Layar menunjukkan peta, tetapi tanpa posisi Anda saat ini, tidak ada gunanya untuk navigasi. Sebaliknya, GPS dengan sinyal satelit yang kuat tidak hanya menampilkan peta, tetapi juga memberikan panduan belokan demi belokan.</p>
<p>Itulah yang dilakukan oleh retrieval-augmented generation (RAG) untuk LLM. Model ini sudah memiliki peta (pengetahuan yang telah dilatih), tetapi tidak memiliki arah (data spesifik domain Anda). LLM tanpa RAG seperti perangkat GPS yang penuh dengan pengetahuan tetapi tidak memiliki orientasi waktu nyata. RAG memberikan sinyal yang memberi tahu model di mana ia berada dan ke mana harus pergi.</p>
<p>RAG mendasarkan respons model pada pengetahuan tepercaya dan terkini yang diambil dari konten khusus domain Anda sendiri dari kebijakan, dokumen produk, tiket, PDF, kode, transkrip audio, gambar, dan banyak lagi. Membuat RAG bekerja dalam skala besar merupakan hal yang menantang. Proses pengambilan harus cukup cepat untuk menjaga pengalaman pengguna tetap lancar, cukup akurat untuk mengembalikan informasi yang paling relevan, dan dapat diprediksi bahkan ketika sistem sedang mengalami beban berat. Hal ini berarti menangani volume kueri yang tinggi, konsumsi data yang sedang berlangsung, dan tugas-tugas latar belakang seperti pembuatan indeks tanpa penurunan kinerja. Memutar pipeline RAG dengan beberapa PDF relatif mudah. Namun, ketika menskalakan ke ratusan PDF, hal ini menjadi jauh lebih menantang. Anda tidak dapat menyimpan semuanya di memori, sehingga strategi penyimpanan yang kuat dan efisien menjadi penting untuk mengelola penyematan, indeks, dan kinerja pengambilan. RAG memerlukan database vektor dan lapisan penyimpanan yang dapat mengimbangi pertumbuhan konkurensi dan volume data.</p>
<h2 id="Vector-databases-power-RAG" class="common-anchor-header">Basis data vektor menjadi kekuatan RAG<button data-href="#Vector-databases-power-RAG" class="anchor-icon" translate="no">
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
    </button></h2><p>Inti dari RAG adalah pencarian semantik, menemukan informasi berdasarkan makna, bukan kata kunci yang tepat. Di sinilah database vektor berperan. Database ini menyimpan penyematan teks, gambar, dan data tak terstruktur lainnya dalam dimensi tinggi, sehingga memungkinkan pencarian kemiripan yang mengambil konteks yang paling relevan untuk pertanyaan Anda. Milvus adalah contoh utama: basis data vektor open-source yang berasal dari cloud dan dibuat untuk pencarian kemiripan berskala miliaran. Milvus mendukung pencarian hibrida, menggabungkan kemiripan vektor dengan kata kunci dan filter skalar untuk ketepatan, dan menawarkan penskalaan komputasi dan penyimpanan yang independen dengan opsi pengoptimalan yang sadar akan GPU untuk akselerasi. Milvus juga mengelola data melalui siklus hidup segmen cerdas, bergerak dari segmen yang terus bertambah menjadi segmen tertutup dengan pemadatan dan beberapa opsi pengindeksan perkiraan tetangga terdekat (ANN) seperti HNSW dan DiskANN, memastikan kinerja dan skalabilitas untuk beban kerja AI real-time seperti RAG.</p>
<h2 id="The-hidden-challenge-Storage-throughput--latency" class="common-anchor-header">Tantangan tersembunyi: Throughput &amp; latensi penyimpanan<button data-href="#The-hidden-challenge-Storage-throughput--latency" class="anchor-icon" translate="no">
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
    </button></h2><p>Beban kerja pencarian vektor memberikan tekanan pada setiap bagian sistem. Beban ini menuntut konsumsi dengan konkurensi tinggi sambil mempertahankan pengambilan dengan latensi rendah untuk kueri interaktif. Pada saat yang sama, operasi latar belakang seperti pembuatan indeks, pemadatan, dan pemuatan ulang data harus berjalan tanpa mengganggu kinerja langsung. Banyak hambatan kinerja dalam arsitektur tradisional berawal dari penyimpanan. Entah itu keterbatasan input/output (I/O), penundaan pencarian metadata, atau kendala konkurensi. Untuk memberikan performa real-time yang dapat diprediksi dalam skala besar, lapisan penyimpanan harus mengimbangi tuntutan database vektor.</p>
<h2 id="The-storage-foundation-for-high-performance-vector-search" class="common-anchor-header">Fondasi penyimpanan untuk pencarian vektor berkinerja tinggi<button data-href="#The-storage-foundation-for-high-performance-vector-search" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://www.hpe.com/in/en/alletra-storage-mp-x10000.html">HPE Alletra Storage MP X10000</a> adalah platform penyimpanan objek yang dioptimalkan untuk flash, semua NVMe, dan kompatibel dengan S3 yang dirancang untuk kinerja waktu nyata dalam skala besar. Tidak seperti penyimpanan objek tradisional yang berfokus pada kapasitas, HPE Alletra Storage MP X10000 dirancang untuk beban kerja dengan latensi rendah dan throughput tinggi seperti pencarian vektor. Mesin key-value yang terstruktur dengan log dan metadata berbasis luas memungkinkan pembacaan dan penulisan yang sangat paralel, sementara GPUDirect RDMA menyediakan jalur data tanpa penyalinan yang mengurangi overhead CPU dan mempercepat pergerakan data ke GPU. Arsitektur ini mendukung penskalaan terpilah, memungkinkan kapasitas dan kinerja tumbuh secara independen, dan menyertakan fitur-fitur kelas perusahaan seperti enkripsi, kontrol akses berbasis peran (RBAC), keabadian, dan daya tahan data. Dikombinasikan dengan desain cloud-native, HPE Alletra Storage MP X10000 terintegrasi secara mulus dengan lingkungan Kubernetes, menjadikannya fondasi penyimpanan yang ideal untuk penerapan Milvus.</p>
<h2 id="HPE-Alletra-Storage-MP-X10000-and-Milvus-A-scalable-foundation-for-RAG" class="common-anchor-header">HPE Alletra Storage MP X10000 dan Milvus: Fondasi yang dapat diskalakan untuk RAG<button data-href="#HPE-Alletra-Storage-MP-X10000-and-Milvus-A-scalable-foundation-for-RAG" class="anchor-icon" translate="no">
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
    </button></h2><p>HPE Alletra Storage MP X10000 dan Milvus saling melengkapi untuk menghadirkan RAG yang cepat, dapat diprediksi, dan mudah diskalakan. Gambar 1 mengilustrasikan arsitektur kasus penggunaan AI yang dapat diskalakan dan pipeline RAG, yang menunjukkan bagaimana komponen Milvus yang digunakan di lingkungan terkontainerisasi berinteraksi dengan penyimpanan objek berkinerja tinggi dari HPE Alletra Storage MP X10000.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_1_Architecture_of_scalable_AI_use_cases_and_RAG_pipeline_using_HPE_Alletra_Storage_MP_X10000_and_Milvus_ed3a87a5ee.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Milvus memisahkan komputasi dari penyimpanan dengan jelas, sementara HPE Alletra Storage MP X10000 menyediakan akses objek berkinerja tinggi dan latensi rendah yang mengimbangi beban kerja vektor. Bersama-sama, keduanya memungkinkan kinerja scale-out yang dapat diprediksi: Milvus mendistribusikan kueri di seluruh pecahan, dan penskalaan fraksional dan multidimensi HPE Alletra Storage MP X10000 menjaga latensi tetap konsisten saat data dan QPS bertambah. Sederhananya, Anda dapat menambahkan kapasitas atau kinerja yang Anda butuhkan, saat Anda membutuhkannya. Kesederhanaan operasional adalah keuntungan lainnya: HPE Alletra Storage MP X10000 menopang kinerja maksimum dari satu bucket, menghilangkan tiering yang rumit, sementara fitur-fitur perusahaan (enkripsi, RBAC, keabadian, daya tahan yang kuat) mendukung penerapan on-prem atau hibrida dengan kedaulatan data yang kuat dan tujuan tingkat layanan yang konsisten (SLO).</p>
<p>Ketika skala pencarian vektor meningkat, penyimpanan sering kali disalahkan atas lambatnya konsumsi, pemadatan, atau pengambilan. Dengan Milvus pada HPE Alletra Storage MP X10000, narasi tersebut berubah. Platform yang menggunakan NVMe, arsitektur terstruktur log, dan opsi GPUDirect RDMA menghadirkan akses objek dengan latensi sangat rendah yang konsisten-bahkan di bawah konkurensi yang tinggi dan selama operasi siklus hidup seperti pembuatan dan pemuatan ulang indeks. Dalam praktiknya, pipeline RAG Anda tetap terikat pada komputasi, bukan pada penyimpanan. Seiring bertambahnya koleksi dan lonjakan volume kueri, Milvus tetap responsif sementara HPE Alletra Storage MP X10000 mempertahankan ruang kepala I/O, memungkinkan skalabilitas linier yang dapat diprediksi tanpa perlu merancang ulang penyimpanan. Hal ini menjadi sangat penting ketika penerapan RAG berkembang melampaui tahap proof-of-concept awal dan beralih ke produksi penuh.</p>
<h2 id="Enterprise-ready-RAG-Scalable-predictable-and-built-for-GenAI" class="common-anchor-header">RAG yang siap untuk perusahaan: Dapat diskalakan, dapat diprediksi, dan dibangun untuk GenAI<button data-href="#Enterprise-ready-RAG-Scalable-predictable-and-built-for-GenAI" class="anchor-icon" translate="no">
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
    </button></h2><p>Untuk RAG dan beban kerja GenAI real-time, kombinasi HPE Alletra Storage MP X10000 dan Milvus menghadirkan fondasi yang siap untuk masa depan yang dapat diskalakan dengan percaya diri. Solusi terintegrasi ini memberdayakan organisasi untuk membangun sistem cerdas yang cepat, elastis, dan aman-tanpa mengorbankan kinerja atau pengelolaan. Milvus menyediakan pencarian vektor terdistribusi yang dipercepat oleh GPU dengan penskalaan modular, sementara HPE Alletra Storage MP X10000 memastikan akses objek yang sangat cepat dan latensi rendah dengan daya tahan dan manajemen siklus hidup tingkat perusahaan. Bersama-sama, keduanya memisahkan komputasi dari penyimpanan, sehingga memungkinkan kinerja yang dapat diprediksi bahkan ketika volume data dan kompleksitas kueri meningkat. Baik saat Anda menyajikan rekomendasi waktu nyata, memberdayakan pencarian semantik, atau melakukan penskalaan pada miliaran vektor, arsitektur ini membuat pipeline RAG Anda tetap responsif, hemat biaya, dan dioptimalkan untuk cloud. Dengan integrasi tanpa batas ke dalam Kubernetes dan cloud HPE GreenLake, Anda mendapatkan manajemen terpadu, penetapan harga berbasis konsumsi, dan fleksibilitas untuk diterapkan di seluruh lingkungan cloud hybrid atau pribadi. HPE Alletra Storage MP X10000 dan Milvus: solusi RAG berkinerja tinggi yang dapat diskalakan yang dibuat untuk memenuhi kebutuhan GenAI modern.</p>
