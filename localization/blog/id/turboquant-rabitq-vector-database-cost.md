---
id: turboquant-rabitq-vector-database-cost.md
title: >-
  Di Balik Perdebatan TurboQuant-RaBitQ: Mengapa Kuantisasi Vektor Penting untuk
  Biaya Infrastruktur AI
author: Li Liu
date: 2026-4-2
cover: assets.zilliz.com/vectorquantization_0bea9e6bec.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  TurboQuant, RaBitQ, vector quantization, TurboQuant vs RaBitQ, vector database
  memory optimization
meta_title: |
  Vector Quantization: Beyond the TurboQuant-RaBitQ Debate
desc: >-
  Perdebatan TurboQuant-RaBitQ menjadi berita utama kuantisasi vektor. Cara
  kerja kompresi 1-bit RaBitQ dan bagaimana Milvus mengirimkan IVF_RABITQ untuk
  penghematan memori sebesar 97%.
origin: 'https://milvus.io/blog/turboquant-rabitq-vector-database-cost.md'
---
<p>Makalah TurboQuant Google (ICLR 2026) melaporkan kompresi cache 6x KV dengan kehilangan akurasi yang mendekati nol - hasil yang cukup mencolok untuk menghapus <a href="https://www.cnbc.com/2026/03/26/google-ai-turboquant-memory-chip-stocks-samsung-micron.html">$90 miliar dari stok chip memori</a> dalam satu hari. SK Hynix turun 12%. Samsung turun 7%.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Beyond_the_Turbo_Quant_Ra_Bit_Q_Debate_How_Vector_Quantization_Is_Reshaping_AI_Infrastructure_from_Paper_to_Production_1_825845eccb.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Makalah tersebut dengan cepat menarik perhatian. <a href="https://gaoj0017.github.io/">Jianyang Gao</a>, penulis pertama <a href="https://dl.acm.org/doi/10.1145/3654970">RaBitQ</a> (SIGMOD 2024), <a href="https://medium.com/@gaojianyang0017/turboquant-and-rabitq-what-the-public-story-gets-wrong-23df83209c22">mengajukan pertanyaan</a> tentang hubungan antara metodologi TurboQuant dan karya sebelumnya tentang kuantisasi vektor. (Kami akan segera mempublikasikan percakapan dengan Dr. Gao - ikuti kami jika Anda tertarik).</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Beyond_the_Turbo_Quant_Ra_Bit_Q_Debate_How_Vector_Quantization_Is_Reshaping_AI_Infrastructure_from_Paper_to_Production_2_0860406cae.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Artikel ini bukan untuk memihak dalam diskusi tersebut. Yang mengejutkan kami adalah sesuatu yang lebih besar: fakta bahwa satu makalah <a href="https://milvus.io/docs/index-explained.md">kuantisasi vektor</a> dapat menggerakkan nilai pasar sebesar $90 miliar menunjukkan betapa pentingnya teknologi ini untuk infrastruktur AI. Baik itu mengompresi cache KV di mesin inferensi atau mengompresi indeks di <a href="https://zilliz.com/learn/what-is-vector-database">database vektor</a>, kemampuan untuk mengecilkan data berdimensi tinggi sambil mempertahankan kualitas memiliki implikasi biaya yang sangat besar - dan ini adalah masalah yang sedang kami tangani, dengan mengintegrasikan RaBitQ ke dalam database vektor <a href="https://milvus.io/">Milvus</a> dan mengubahnya menjadi infrastruktur produksi.</p>
<p>Inilah yang akan kami bahas: mengapa kuantisasi vektor sangat penting saat ini, bagaimana TurboQuant dan RaBitQ dibandingkan, apa itu RaBitQ dan bagaimana cara kerjanya, pekerjaan teknik di balik pengirimannya di dalam Milvus, dan seperti apa lanskap pengoptimalan memori yang lebih luas untuk infrastruktur AI.</p>
<h2 id="Why-Does-Vector-Quantization-Matter-for-Infrastructure-Costs" class="common-anchor-header">Mengapa Kuantisasi Vektor Penting untuk Biaya Infrastruktur?<button data-href="#Why-Does-Vector-Quantization-Matter-for-Infrastructure-Costs" class="anchor-icon" translate="no">
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
    </button></h2><p>Kuantisasi vektor bukanlah hal baru. Yang baru adalah seberapa mendesak industri membutuhkannya. Selama dua tahun terakhir, parameter LLM telah membengkak, jendela konteks telah membentang dari 4K hingga 128K+ token, dan data yang tidak terstruktur - teks, gambar, audio, video - telah menjadi input kelas satu untuk sistem AI. Setiap tren ini menciptakan lebih banyak vektor dimensi tinggi yang perlu disimpan, diindeks, dan dicari. Lebih banyak vektor, lebih banyak memori, lebih banyak biaya.</p>
<p>Jika Anda menjalankan pencarian vektor dalam skala besar - <a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">pipeline RAG</a>, mesin rekomendasi, pencarian multimodal - biaya memori kemungkinan merupakan salah satu masalah infrastruktur terbesar Anda.</p>
<p>Selama penerapan model, setiap tumpukan inferensi LLM utama bergantung pada <a href="https://zilliz.com/glossary/kv-cache">cache KV</a> - menyimpan pasangan nilai-kunci yang telah dihitung sebelumnya sehingga mekanisme perhatian tidak menghitung ulang untuk setiap token baru. Hal inilah yang membuat inferensi O(n) menjadi mungkin, bukan O(n²). Setiap kerangka kerja dari <a href="https://github.com/vllm-project/vllm">vLLM</a> hingga <a href="https://github.com/NVIDIA/TensorRT-LLM">TensorRT-LLM</a> bergantung pada ini. Tetapi cache KV dapat menghabiskan lebih banyak memori GPU daripada bobot model itu sendiri. Konteks yang lebih panjang, lebih banyak pengguna yang bersamaan, dan itu berputar dengan cepat.</p>
<p>Tekanan yang sama juga terjadi pada basis data vektor - miliaran vektor berdimensi tinggi yang tersimpan di memori, masing-masing berukuran 32-bit per dimensi. Kuantisasi vektor memampatkan vektor-vektor ini dari 32-bit float menjadi representasi 4-bit, 2-bit, atau bahkan 1-bit - mengecilkan memori hingga 90% atau lebih. Baik itu cache KV di mesin inferensi atau indeks di database vektor Anda, matematika yang mendasarinya sama, dan penghematan biayanya nyata. Itulah mengapa satu makalah yang melaporkan terobosan dalam bidang ini telah menggerakkan nilai pasar saham sebesar $90 miliar.</p>
<h2 id="TurboQuant-vs-RaBitQ-Whats-the-Difference" class="common-anchor-header">TurboQuant vs RaBitQ: Apa Bedanya?<button data-href="#TurboQuant-vs-RaBitQ-Whats-the-Difference" class="anchor-icon" translate="no">
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
    </button></h2><p>Baik TurboQuant maupun RaBitQ dibangun di atas teknik dasar yang sama: menerapkan rotasi acak<a href="https://arxiv.org/abs/2406.03482">(transformasi Johnson-Lindenstrauss</a>) pada vektor input sebelum kuantisasi. Rotasi ini mengubah data yang terdistribusi tidak teratur menjadi distribusi seragam yang dapat diprediksi, membuatnya lebih mudah untuk dikuantisasi dengan kesalahan yang rendah.</p>
<p>Di luar fondasi bersama itu, keduanya menargetkan masalah yang berbeda dan mengambil pendekatan yang berbeda:</p>
<table>
<thead>
<tr><th></th><th>TurboQuant</th><th>RaBitQ</th></tr>
</thead>
<tbody>
<tr><td><strong>Target</strong></td><td>Cache KV dalam inferensi LLM (data sesaat, per permintaan)</td><td>Indeks vektor yang persisten dalam basis data (data tersimpan)</td></tr>
<tr><td><strong>Pendekatan</strong></td><td>Dua tahap: PolarQuant (kuantizer skalar Lloyd-Max per koordinat) + <a href="https://arxiv.org/abs/2406.03482">QJL</a> (koreksi sisa 1-bit)</td><td>Satu tahap: proyeksi hypercube + estimator jarak yang tidak bias</td></tr>
<tr><td><strong>Lebar bit</strong></td><td>Kunci 3-bit, nilai 2-bit (presisi campuran)</td><td>1-bit per dimensi (dengan varian multi-bit yang tersedia)</td></tr>
<tr><td><strong>Klaim teoretis</strong></td><td>Tingkat distorsi MSE yang hampir optimal</td><td>Kesalahan estimasi produk dalam yang optimal secara asimtotik (sesuai dengan batas bawah Alon-Klartag)</td></tr>
<tr><td><strong>Status produksi</strong></td><td>Implementasi komunitas; tidak ada rilis resmi dari Google</td><td>Dikirim dalam <a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md">Milvus 2.6</a>, diadopsi oleh Faiss, VSAG, Elasticsearch</td></tr>
</tbody>
</table>
<p>Perbedaan utama bagi para praktisi: TurboQuant mengoptimalkan cache KV sementara di dalam mesin inferensi, sementara RaBitQ menargetkan indeks persisten yang dibangun, dipecah, dan ditanyakan oleh basis data vektor di miliaran vektor. Untuk sisa artikel ini, kita akan fokus pada RaBitQ - algoritme yang telah kami integrasikan dan kirimkan dalam produksi di dalam Milvus.</p>
<h2 id="What-Is-RaBitQ-and-What-Does-It-Deliver" class="common-anchor-header">Apa itu RaBitQ dan Apa yang Diberikannya?<button data-href="#What-Is-RaBitQ-and-What-Does-It-Deliver" class="anchor-icon" translate="no">
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
    </button></h2><p>Pertama-tama, inilah intinya: pada set data 10 juta vektor dengan 768 dimensi, RaBitQ memampatkan setiap vektor menjadi 1/32 dari ukuran aslinya dengan tetap menjaga tingkat pengingatan di atas 94%. Dalam Milvus, ini berarti 3,6x lipat throughput kueri yang lebih tinggi daripada indeks presisi penuh. Ini bukan proyeksi teoretis - ini adalah hasil benchmark dari Milvus 2.6.</p>
<p>Sekarang, bagaimana cara mencapainya.</p>
<p>Kuantisasi biner tradisional memampatkan vektor FP32 menjadi 1 bit per dimensi - kompresi 32x. Pengorbanannya: recall runtuh karena Anda telah membuang terlalu banyak informasi. <a href="https://arxiv.org/abs/2405.12497">RaBitQ</a> (Gao &amp; Long, SIGMOD 2024) mempertahankan kompresi 32x yang sama tetapi mempertahankan informasi yang benar-benar penting untuk pencarian. <a href="https://arxiv.org/abs/2409.09913">Versi yang diperluas</a> (Gao &amp; Long, SIGMOD 2025) membuktikan bahwa ini optimal secara asimtotik, sesuai dengan batas bawah teoretis yang ditetapkan oleh Alon &amp; Klartag (FOCS 2017).</p>
<h3 id="Why-Do-Angles-Matter-More-Than-Coordinates-in-High-Dimensions" class="common-anchor-header">Mengapa Sudut Lebih Penting Daripada Koordinat dalam Dimensi Tinggi?</h3><p>Wawasan utama: <strong>dalam dimensi tinggi, sudut antara vektor lebih stabil dan informatif daripada nilai koordinat individual.</strong> Ini adalah konsekuensi dari konsentrasi ukuran - fenomena yang sama yang membuat proyeksi acak Johnson-Lindenstrauss bekerja.</p>
<p>Artinya dalam praktiknya: Anda dapat membuang nilai koordinat yang tepat dari vektor berdimensi tinggi dan hanya menyimpan arahnya relatif terhadap kumpulan data. Hubungan sudut - yang merupakan dasar dari <a href="https://zilliz.com/glossary/anns">pencarian tetangga terdekat</a> - tetap bertahan dari kompresi.</p>
<h3 id="How-Does-RaBitQ-Work" class="common-anchor-header">Bagaimana Cara Kerja RaBitQ?</h3><p>RaBitQ mengubah wawasan geometris ini menjadi tiga langkah:</p>
<p><strong>Langkah 1: Normalisasi.</strong> Pusatkan setiap vektor relatif terhadap pusat dataset dan skala ke satuan panjang. Hal ini mengubah masalah menjadi estimasi inner-product antara vektor satuan - lebih mudah untuk dianalisis dan diikat.</p>
<p><strong>Langkah 2: Rotasi acak + proyeksi hypercube.</strong> Terapkan matriks ortogonal acak (rotasi tipe Johnson-Lindenstrauss) untuk menghilangkan bias ke arah sumbu manapun. Proyeksikan setiap vektor yang dirotasi ke titik terdekat dari hypercube {±1/√D}^D. Setiap dimensi runtuh menjadi satu bit. Hasilnya: kode biner D-bit per vektor.</p>
<p><strong>Langkah 3: Estimasi jarak yang tidak bias.</strong> Buatlah sebuah estimator untuk hasil kali dalam (inner product) antara kueri dan vektor asli (yang tidak dikuantisasi). Estimator ini terbukti tidak bias dengan kesalahan yang dibatasi oleh O(1/√D). Untuk vektor 768 dimensi, hal ini menjaga recall di atas 94%.</p>
<p>Komputasi jarak antara vektor biner direduksi menjadi bitwise AND + popcount - operasi yang dilakukan oleh CPU modern dalam satu siklus. Inilah yang membuat RaBitQ cepat, bukan hanya kecil.</p>
<h3 id="Why-Is-RaBitQ-Practical-Not-Just-Theoretical" class="common-anchor-header">Mengapa RaBitQ Praktis, Bukan Hanya Teoritis?</h3><ul>
<li><strong>Tidak perlu pelatihan.</strong> Terapkan rotasi, periksa tanda-tanda. Tidak ada pengoptimalan berulang, tidak ada pembelajaran buku kode. Waktu pengindeksan sebanding dengan <a href="https://milvus.io/docs/ivf-pq.md">kuantisasi produk</a>.</li>
<li><strong>Ramah perangkat keras.</strong> Komputasi jarak adalah bitwise AND + popcount. CPU modern (Intel IceLake+, AMD Zen 4+) memiliki instruksi AVX512VPOPCNTDQ khusus. Estimasi vektor tunggal berjalan 3x lebih cepat daripada tabel pencarian PQ.</li>
<li><strong>Fleksibilitas multi-bit.</strong> <a href="https://vectordb-ntu.github.io/RaBitQ-Library/">Perpustakaan RaBitQ</a> mendukung varian di luar 1-bit: 4-bit mencapai ~ 90% recall, 5-bit ~ 95%, 7-bit ~ 99% - semua tanpa perangkingan ulang.</li>
<li><strong>Dapat dikomposisikan.</strong> Menyatu dengan struktur indeks yang sudah ada seperti <a href="https://milvus.io/docs/ivf-flat.md">indeks IVF</a> dan <a href="https://milvus.io/docs/hnsw.md">grafik HNSW</a>, dan bekerja dengan FastScan untuk penghitungan jarak batch.</li>
</ul>
<h2 id="From-Paper-to-Production-What-We-Built-to-Ship-RaBitQ-in-Milvus" class="common-anchor-header">Dari Kertas ke Produksi: Apa yang Kami Bangun untuk Mengirimkan RaBitQ di Milvus<button data-href="#From-Paper-to-Production-What-We-Built-to-Ship-RaBitQ-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Kode RaBitQ yang asli adalah prototipe penelitian mesin tunggal. Untuk membuatnya bekerja di seluruh <a href="https://milvus.io/docs/architecture_overview.md">cluster terdistribusi</a> dengan sharding, failover, dan konsumsi waktu nyata, diperlukan pemecahan empat masalah teknik. Di <a href="https://zilliz.com/">Zilliz</a>, kami melakukan lebih dari sekadar mengimplementasikan algoritme - pekerjaan ini mencakup integrasi mesin, akselerasi perangkat keras, pengoptimalan indeks, dan penyetelan waktu proses untuk mengubah RaBitQ menjadi kemampuan tingkat industri di dalam Milvus. Anda dapat menemukan detail lebih lanjut di blog ini juga: <a href="https://milvus.io/blog/bring-vector-compression-to-the-extreme-how-milvus-serves-3%C3%97-more-queries-with-rabitq.md">Membawa Kompresi Vektor ke Tingkat Ekstrim: Bagaimana Milvus Melayani Kueri 3× Lebih Banyak dengan RaBitQ</a></p>
<h3 id="Making-RaBitQ-Distributed-Ready" class="common-anchor-header">Membuat RaBitQ Siap Didistribusikan</h3><p>Kami mengintegrasikan RaBitQ secara langsung ke dalam <a href="https://github.com/milvus-io/knowhere">Knowhere</a>, mesin pencari inti Milvus - bukan sebagai plugin, tetapi sebagai jenis indeks asli dengan antarmuka terpadu. Ia bekerja dengan arsitektur terdistribusi penuh Milvus: sharding, partisi, penskalaan dinamis, dan <a href="https://milvus.io/docs/manage-collections.md">manajemen koleksi</a>.</p>
<p>Tantangan utamanya: membuat buku kode kuantisasi (matriks rotasi, vektor centroid, parameter penskalaan) yang sadar-segmen, sehingga setiap pecahan membangun dan menyimpan status kuantisasi sendiri. Pembuatan indeks, pemadatan, dan penyeimbangan beban semuanya memahami tipe indeks baru secara native.</p>
<h3 id="Squeezing-Every-Cycle-Out-of-Popcount" class="common-anchor-header">Memeras Setiap Siklus dari Popcount</h3><p>Kecepatan RaBitQ berasal dari popcount - menghitung set bit dalam vektor biner. Algoritmanya pada dasarnya cepat, tetapi seberapa besar throughput yang Anda dapatkan tergantung pada seberapa baik Anda menggunakan perangkat kerasnya. Kami membuat jalur kode SIMD khusus untuk kedua arsitektur server yang dominan:</p>
<ul>
<li><strong>x86 (Intel IceLake+ / AMD Zen 4+):</strong> Instruksi VPOPCNTDQ AVX-512 menghitung jumlah popcount di beberapa register 512-bit secara paralel. Loop bagian dalam Knowhere direstrukturisasi untuk menghitung jarak biner secara batch ke dalam potongan-potongan selebar SIMD, sehingga memaksimalkan hasil.</li>
<li><strong>ARM (Graviton, Ampere):</strong> Instruksi SVE (Scalable Vector Extension) untuk pola popcount paralel yang sama - sangat penting karena contoh ARM semakin umum dalam penerapan cloud yang dioptimalkan dengan biaya.</li>
</ul>
<h3 id="Eliminating-Runtime-Overhead" class="common-anchor-header">Menghilangkan Overhead Runtime</h3><p>RaBitQ membutuhkan parameter floating-point tambahan pada waktu kueri: centroid dataset, norma per-vektor, dan inner product antara setiap vektor yang dikuantisasi dengan vektor aslinya (yang digunakan oleh penaksir jarak). Menghitung semua ini per kueri akan menambah latensi. Menyimpan seluruh vektor asli mengalahkan tujuan kompresi.</p>
<p>Solusi kami: melakukan pra-komputasi dan menyimpan parameter-parameter ini selama pembuatan indeks, menyimpan parameter-parameter ini di dalam cache di samping kode-kode biner. Overhead memori kecil (beberapa float per vektor), tetapi ini menghilangkan komputasi per kueri dan menjaga latensi tetap stabil dalam konkurensi tinggi.</p>
<h3 id="IVFRABITQ-The-Index-You-Actually-Deploy" class="common-anchor-header">IVF_RABITQ: Indeks yang Sebenarnya Anda Gunakan</h3><p>Dimulai dengan <a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md">Milvus 2.6</a>, kami mengirimkan <a href="https://milvus.io/docs/ivf-rabitq.md">IVF_RABITQ</a> - <a href="https://milvus.io/docs/ivf-flat.md">Indeks File Terbalik</a> + kuantisasi RaBitQ. Pencarian bekerja dalam dua tahap:</p>
<ol>
<li><strong>Pencarian kasar (IVF).</strong> K-means mempartisi ruang vektor ke dalam kelompok-kelompok. Pada waktu pencarian, hanya nprobe cluster terdekat yang dipindai.</li>
<li><strong>Penilaian halus (RaBitQ).</strong> Di dalam setiap klaster, jarak diestimasi menggunakan kode 1-bit dan penaksir yang tidak bias. Popcount melakukan pekerjaan berat.</li>
</ol>
<p>Hasil pada set data 768 dimensi, 10 juta vektor:</p>
<table>
<thead>
<tr><th>Metrik</th><th>IVF_FLAT (garis dasar)</th><th>IVF_RABITQ</th><th>IVF_RABITQ + SQ8 memperbaiki</th></tr>
</thead>
<tbody>
<tr><td>Mengingat kembali</td><td>95.2%</td><td>94.7%</td><td>~95%</td></tr>
<tr><td>QPS</td><td>236</td><td>864</td><td>-</td></tr>
<tr><td>Jejak memori</td><td>32 bit/dim</td><td>1 bit/dim (~3% dari aslinya)</td><td>~25% dari aslinya</td></tr>
</tbody>
</table>
<p>Untuk beban kerja yang tidak dapat mentoleransi bahkan celah pemanggilan sebesar 0,5%, parameter refine_type menambahkan scoring pass kedua: SQ6, SQ8, FP16, BF16, atau FP32. SQ8 adalah pilihan yang umum digunakan - ini mengembalikan pemanggilan ke tingkat IVF_FLAT pada sekitar 1/4 memori asli. Anda juga dapat menerapkan <a href="https://milvus.io/docs/ivf-sq8.md">kuantisasi skalar</a> ke sisi kueri (SQ1-SQ8) secara independen, memberi Anda dua kenop untuk menyesuaikan tradeoff latency-recall-biaya per beban kerja.</p>
<h2 id="How-Milvus-Optimizes-Memory-Beyond-Quantization" class="common-anchor-header">Bagaimana Milvus Mengoptimalkan Memori di Luar Kuantisasi<button data-href="#How-Milvus-Optimizes-Memory-Beyond-Quantization" class="anchor-icon" translate="no">
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
    </button></h2><p>RaBitQ adalah tuas kompresi yang paling dramatis, tetapi ini adalah satu lapisan dalam tumpukan <a href="https://milvus.io/blog/milvus-26-preview-72-memory-reduction-without-compromising-recall-and-4x-faster-than-elasticsearch.md">pengoptimalan memori</a> yang lebih luas:</p>
<table>
<thead>
<tr><th>Strategi</th><th>Apa yang dilakukannya</th><th>Dampak</th></tr>
</thead>
<tbody>
<tr><td><strong>Kuantisasi tumpukan penuh</strong></td><td>SQ8, PQ, RaBitQ dengan pengorbanan biaya-presisi yang berbeda</td><td>Pengurangan memori 4x hingga 32x</td></tr>
<tr><td><strong>Pengoptimalan struktur indeks</strong></td><td>Pemadatan grafik HNSW, pembongkaran SSD DiskANN, pembuatan indeks yang aman untuk OOM</td><td>Lebih sedikit DRAM per indeks, set data yang lebih besar per node</td></tr>
<tr><td><strong>I/O yang dipetakan dengan memori (mmap)</strong></td><td>Memetakan file vektor ke disk, memuat halaman sesuai permintaan melalui cache halaman OS</td><td>Dataset berskala TB tanpa memuat semuanya ke dalam RAM</td></tr>
<tr><td><strong>Penyimpanan berjenjang</strong></td><td>Pemisahan data panas/hangat/dingin dengan penjadwalan otomatis</td><td>Bayar harga memori hanya untuk data yang sering diakses</td></tr>
<tr><td><strong>Penskalaan cloud-native</strong><a href="https://zilliz.com/cloud">(Zilliz Cloud</a>, Milvus yang dikelola)</td><td>Alokasi memori yang elastis, pelepasan sumber daya yang menganggur secara otomatis</td><td>Bayar hanya untuk apa yang Anda gunakan</td></tr>
</tbody>
</table>
<h3 id="Full-Stack-Quantization" class="common-anchor-header">Kuantisasi Tumpukan Penuh</h3><p>Kompresi ekstrem 1-bit RaBitQ tidak cocok untuk setiap beban kerja. Milvus menawarkan matriks kuantisasi yang lengkap: <a href="https://milvus.io/docs/ivf-sq8.md">SQ8</a> dan <a href="https://milvus.io/docs/ivf-pq.md">kuantisasi produk (PQ)</a> untuk beban kerja yang membutuhkan tradeoff presisi-biaya yang seimbang, RaBitQ untuk kompresi maksimum pada dataset yang sangat besar, dan konfigurasi hibrida yang menggabungkan beberapa metode untuk kontrol berbutir halus.</p>
<h3 id="Index-Structure-Optimization" class="common-anchor-header">Pengoptimalan Struktur Indeks</h3><p>Di luar kuantisasi, Milvus terus mengoptimalkan overhead memori dalam struktur indeks intinya. Untuk <a href="https://milvus.io/docs/hnsw.md">HNSW</a>, kami mengurangi redundansi daftar kedekatan untuk mengurangi penggunaan memori per-grafik. <a href="https://milvus.io/docs/diskann.md">DiskANN</a> mendorong data vektor dan struktur indeks ke SSD, sehingga mengurangi ketergantungan DRAM secara dramatis untuk kumpulan data yang besar. Kami juga mengoptimalkan alokasi memori perantara selama pembuatan indeks untuk mencegah kegagalan OOM saat membuat indeks pada set data yang mendekati batas memori node.</p>
<h3 id="Smart-Memory-Loading" class="common-anchor-header">Pemuatan Memori Cerdas</h3><p>Milvus's <a href="https://milvus.io/docs/mmap.md">mmap</a> (memory-mapped I/O) mendukung pemetaan data vektor ke file disk, dengan mengandalkan cache halaman OS untuk pemuatan sesuai permintaan - tidak perlu memuat semua data ke dalam memori pada saat startup. Dikombinasikan dengan strategi pemuatan malas dan pemuatan tersegmentasi yang mencegah lonjakan memori secara tiba-tiba, hal ini memungkinkan pengoperasian yang lancar dengan set data vektor skala TB dengan biaya memori yang lebih rendah.</p>
<h3 id="Tiered-Storage" class="common-anchor-header">Penyimpanan Berjenjang</h3><p><a href="https://milvus.io/docs/tiered-storage-overview.md">Arsitektur penyimpanan tiga tingkat</a> Milvus mencakup memori, SSD, dan penyimpanan objek: data panas tetap berada di memori untuk latensi rendah, data hangat di-cache di SSD untuk keseimbangan kinerja dan biaya, dan data dingin tenggelam ke penyimpanan objek untuk meminimalkan biaya. Sistem menangani penjadwalan data secara otomatis - tidak diperlukan perubahan lapisan aplikasi.</p>
<h3 id="Cloud-Native-Scaling" class="common-anchor-header">Penskalaan Cloud-Native</h3><p>Di bawah <a href="https://milvus.io/docs/architecture_overview.md">arsitektur terdistribusi</a> Milvus, data sharding dan load balancing mencegah memori node tunggal kelebihan beban. Penyatuan memori mengurangi fragmentasi dan meningkatkan pemanfaatan. <a href="https://zilliz.com/cloud">Zilliz Cloud</a> (Milvus yang dikelola sepenuhnya) mengambil langkah lebih jauh dengan penjadwalan elastis untuk penskalaan memori sesuai permintaan - dalam mode Tanpa Server, sumber daya yang menganggur secara otomatis dilepaskan, sehingga mengurangi total biaya kepemilikan.</p>
<h3 id="How-These-Layers-Compound" class="common-anchor-header">Bagaimana Lapisan-Lapisan Ini Bersatu</h3><p>Pengoptimalan ini bukanlah alternatif - mereka bertumpuk. RaBitQ mengecilkan vektor. DiskANN menyimpan indeks pada SSD. Mmap menghindari pemuatan data dingin ke dalam memori. <a href="https://milvus.io/blog/milvus-tiered-storage-80-less-vector-search-cost-with-on-demand-hot–cold-data-loading.md">Penyimpanan berjenjang</a> mendorong data arsip ke penyimpanan objek. Hasilnya: penerapan yang melayani miliaran vektor tidak membutuhkan RAM sebesar miliaran vektor.</p>
<h2 id="Get-Started" class="common-anchor-header">Memulai<button data-href="#Get-Started" class="anchor-icon" translate="no">
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
    </button></h2><p>Karena volume data AI terus bertambah, efisiensi dan biaya basis data vektor akan secara langsung menentukan seberapa jauh aplikasi AI dapat berkembang. Kami akan terus berinvestasi dalam infrastruktur vektor berkinerja tinggi dan berbiaya rendah - sehingga lebih banyak aplikasi AI yang dapat beralih dari prototipe ke produksi.</p>
<p><a href="https://github.com/milvus-io/milvus">Milvus</a> adalah sumber terbuka. Untuk mencoba IVF_RABITQ:</p>
<ul>
<li>Lihat <a href="https://milvus.io/docs/ivf-rabitq.md">dokumentasi IVF_RABITQ</a> untuk panduan konfigurasi dan penyetelan.</li>
<li>Baca <a href="https://milvus.io/blog/bring-vector-compression-to-the-extreme-how-milvus-serves-3×-more-queries-with-rabitq.md">posting blog integrasi RaBitQ</a> lengkap untuk tolok ukur yang lebih dalam dan detail implementasi.</li>
<li>Bergabunglah dengan <a href="https://slack.milvus.io/">komunitas Milvus Slack</a> untuk mengajukan pertanyaan dan belajar dari pengembang lain.</li>
<li><a href="https://milvus.io/office-hours">Pesan sesi Jam Kerja Milvus gratis</a> untuk membahas kasus penggunaan Anda.</li>
</ul>
<p>Jika Anda lebih suka melewatkan penyiapan infrastruktur, <a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a> (dikelola sepenuhnya oleh Milvus) menawarkan tier gratis dengan dukungan IVF_RABITQ.</p>
<p>Kami akan mengadakan wawancara mendatang dengan Profesor <a href="https://personal.ntu.edu.sg/c.long/">Cheng Long</a> (NTU, VectorDB@NTU) dan <a href="https://gaoj0017.github.io/">Dr. Jianyang Gao</a> (ETH Zurich), penulis pertama RaBitQ, di mana kami akan membahas lebih dalam tentang teori kuantisasi vektor dan apa yang akan terjadi selanjutnya. Tuliskan pertanyaan Anda di kolom komentar.</p>
<h2 id="Frequently-Asked-Questions" class="common-anchor-header">Pertanyaan yang Sering Diajukan<button data-href="#Frequently-Asked-Questions" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="What-are-TurboQuant-and-RaBitQ" class="common-anchor-header">Apa itu TurboQuant dan RaBitQ?</h3><p>TurboQuant (Google, ICLR 2026) dan RaBitQ (Gao &amp; Long, SIGMOD 2024) adalah metode kuantisasi vektor yang menggunakan rotasi acak untuk memampatkan vektor berdimensi tinggi. TurboQuant menargetkan kompresi cache KV dalam inferensi LLM, sementara RaBitQ menargetkan indeks vektor persisten dalam database. Keduanya telah berkontribusi pada gelombang ketertarikan saat ini dalam kuantisasi vektor, meskipun keduanya memecahkan masalah yang berbeda untuk sistem yang berbeda.</p>
<h3 id="How-does-RaBitQ-achieve-1-bit-quantization-without-destroying-recall" class="common-anchor-header">Bagaimana RaBitQ mencapai kuantisasi 1-bit tanpa merusak daya ingat?</h3><p>RaBitQ mengeksploitasi konsentrasi pengukuran dalam ruang dimensi tinggi: sudut antara vektor lebih stabil daripada nilai koordinat individu seiring dengan meningkatnya dimensi. Ini menormalkan vektor relatif terhadap centroid dataset, kemudian memproyeksikan masing-masing vektor ke simpul terdekat dari sebuah hypercube (mengurangi setiap dimensi menjadi satu bit). Estimator jarak yang tidak bias dengan batas kesalahan yang dapat dibuktikan membuat pencarian tetap akurat meskipun terjadi kompresi.</p>
<h3 id="What-is-IVFRABITQ-and-when-should-I-use-it" class="common-anchor-header">Apa itu IVF_RABITQ dan kapan saya harus menggunakannya?</h3><p>IVF_RABITQ adalah jenis indeks vektor di Milvus (tersedia sejak versi 2.6) yang menggabungkan pengelompokan file terbalik dengan kuantisasi RaBitQ 1-bit. Tipe ini mencapai 94,7% pemanggilan kembali pada 3,6x throughput IVF_FLAT, dengan penggunaan memori sekitar 1/32 dari vektor asli. Gunakan ketika Anda perlu melayani pencarian vektor berskala besar (jutaan hingga miliaran vektor) dan biaya memori menjadi perhatian utama - umum terjadi pada RAG, rekomendasi, dan beban kerja pencarian multimodal.</p>
<h3 id="How-does-vector-quantization-relate-to-KV-cache-compression-in-LLMs" class="common-anchor-header">Bagaimana kuantisasi vektor berhubungan dengan kompresi cache KV di LLM?</h3><p>Kedua masalah tersebut melibatkan kompresi vektor floating-point berdimensi tinggi. Cache KV menyimpan pasangan kunci-nilai dari mekanisme perhatian Transformer; pada konteks yang panjang, cache ini dapat melebihi bobot model dalam penggunaan memori. Teknik kuantisasi vektor seperti RaBitQ mengurangi vektor ini menjadi representasi bit yang lebih rendah. Prinsip-prinsip matematika yang sama - mengukur konsentrasi, rotasi acak, estimasi jarak yang tidak bias - berlaku baik saat Anda mengompresi vektor dalam indeks basis data atau dalam cache KV mesin inferensi.</p>
