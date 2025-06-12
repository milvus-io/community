---
id: >-
  bring-vector-compression-to-the-extreme-how-milvus-serves-3×-more-queries-with-rabitq.md
title: >-
  Membawa Kompresi Vektor ke Tingkat Ekstrim: Bagaimana Milvus Melayani Kueri 3×
  Lebih Banyak dengan RaBitQ
author: 'Alexandr Guzhva, Li Liu, Jiang Chen'
date: 2025-05-13T00:00:00.000Z
desc: >-
  Temukan bagaimana Milvus memanfaatkan RaBitQ untuk meningkatkan efisiensi
  pencarian vektor, mengurangi biaya memori sambil mempertahankan akurasi.
  Pelajari cara mengoptimalkan solusi AI Anda hari ini!
cover: >-
  assets.zilliz.com/Bring_Vector_Compression_to_the_Extreme_How_Milvus_Serves_3_More_Queries_with_Ra_Bit_Q_12f5b4d932.jpg
tag: Engineering
recommend: true
publishToMedium: true
tags: 'Milvus, vector database, vector search, AI Agents, LLM'
meta_keywords: >-
  Vector Quantization, binary quantization, RaBitQ, vector compression, Milvus
  vector database
meta_title: >
  Bring Vector Compression to the Extreme: How Milvus Serves 3× More Queries
  with RaBitQ
origin: >-
  https://milvus.io/blog/bring-vector-compression-to-the-extreme-how-milvus-serves-3×-more-queries-with-rabitq.md
---
<p><a href="https://milvus.io/docs/overview.md">Milvus</a> adalah basis data vektor sumber terbuka dan sangat skalabel yang mendukung pencarian semantik dalam skala miliaran vektor. Ketika pengguna menggunakan chatbot RAG, layanan pelanggan AI, dan pencarian visual dalam skala ini, tantangan umum muncul: <strong>biaya infrastruktur</strong>. Sebaliknya, pertumbuhan bisnis yang eksponensial sangat menarik; tagihan cloud yang meroket tidak. Pencarian vektor yang cepat biasanya membutuhkan penyimpanan vektor dalam memori, yang mahal. Secara alami, Anda mungkin bertanya: <em>Dapatkah kita memampatkan vektor untuk menghemat ruang tanpa mengorbankan kualitas pencarian?</em></p>
<p>Jawabannya adalah <strong>YA</strong>, dan dalam blog ini, kami akan menunjukkan kepada Anda bagaimana mengimplementasikan teknik baru yang disebut <a href="https://dl.acm.org/doi/pdf/10.1145/3654970"><strong>RaBitQ</strong></a> memungkinkan Milvus untuk melayani trafik 3 kali lebih banyak dengan biaya memori yang lebih rendah dengan tetap mempertahankan akurasi yang sebanding. Kami juga akan membagikan pelajaran praktis yang didapat dari mengintegrasikan RaBitQ ke dalam Milvus open-source dan layanan Milvus yang dikelola secara penuh di <a href="https://zilliz.com/cloud">Zilliz Cloud</a>.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Bring_Vector_Compression_to_the_Extreme_How_Milvus_Serves_3_More_Queries_with_Ra_Bit_Q_12f5b4d932.jpg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Understanding-Vector-Search-and-Compression" class="common-anchor-header">Memahami Pencarian dan Kompresi Vektor<button data-href="#Understanding-Vector-Search-and-Compression" class="anchor-icon" translate="no">
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
    </button></h2><p>Sebelum membahas RaBitQ, mari kita pahami tantangannya.</p>
<p>Algoritma pencarian<a href="https://zilliz.com/glossary/anns"><strong>Approximate Nearest Neighbor (ANN)</strong></a> merupakan inti dari database vektor, menemukan k vektor teratas yang paling dekat dengan kueri yang diberikan. Vektor adalah koordinat dalam ruang dimensi tinggi, yang sering kali terdiri dari ratusan angka floating-point. Seiring dengan meningkatnya skala data vektor, begitu pula dengan kebutuhan penyimpanan dan komputasi. Sebagai contoh, menjalankan <a href="https://zilliz.com/learn/hierarchical-navigable-small-worlds-HNSW">HNSW</a> (algoritme pencarian ANN) dengan satu miliar vektor 768 dimensi dalam FP32 membutuhkan lebih dari 3TB memori!</p>
<p>Seperti MP3 yang memampatkan audio dengan membuang frekuensi yang tidak terlihat oleh telinga manusia, data vektor dapat dimampatkan dengan dampak minimal pada akurasi pencarian. Penelitian menunjukkan bahwa FP32 dengan presisi penuh sering kali tidak diperlukan untuk JST.<a href="https://zilliz.com/learn/scalar-quantization-and-product-quantization"> Kuantisasi Skalar</a> (SQ), teknik kompresi yang populer, memetakan nilai floating-point ke dalam tempat sampah diskrit dan hanya menyimpan indeks tempat sampah menggunakan bilangan bulat rendah. Metode kuantisasi secara signifikan mengurangi penggunaan memori dengan merepresentasikan informasi yang sama dengan bit yang lebih sedikit. Penelitian dalam domain ini berusaha untuk mencapai penghematan yang paling banyak dengan kehilangan akurasi yang paling sedikit.</p>
<p>Teknik kompresi yang paling ekstrem-Kuantisasi Skalar 1-bit, juga dikenal sebagai <a href="https://zilliz.com/learn/scalar-quantization-and-product-quantization">Kuantisasi Biner-merepresentasikan</a>setiap float dengan satu bit. Dibandingkan dengan FP32 (pengkodean 32-bit), ini mengurangi penggunaan memori sebesar 32×. Karena memori sering kali menjadi hambatan utama dalam pencarian vektor, kompresi semacam itu dapat meningkatkan kinerja secara signifikan. <strong>Namun, tantangannya terletak pada menjaga akurasi pencarian.</strong> Biasanya, SQ 1-bit mengurangi recall hingga di bawah 70%, sehingga praktis tidak dapat digunakan.</p>
<p>Di sinilah <strong>RaBitQ</strong> menonjol-teknik kompresi luar biasa yang mencapai kuantisasi 1-bit sambil mempertahankan recall yang tinggi. Milvus sekarang mendukung RaBitQ mulai dari versi 2.6, memungkinkan basis data vektor untuk melayani 3× QPS dengan tetap mempertahankan tingkat akurasi yang sebanding.</p>
<h2 id="A-Brief-Intro-to-RaBitQ" class="common-anchor-header">Pengenalan Singkat tentang RaBitQ<button data-href="#A-Brief-Intro-to-RaBitQ" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://dl.acm.org/doi/pdf/10.1145/3654970">RaBitQ</a> adalah metode kuantisasi biner yang dirancang dengan cerdas yang memanfaatkan properti geometri ruang dimensi tinggi untuk mencapai kompresi vektor yang efisien dan akurat.</p>
<p>Sekilas, mengurangi setiap dimensi vektor menjadi satu bit mungkin terlihat terlalu agresif, tetapi dalam ruang dimensi tinggi, intuisi kita sering kali mengecewakan kita. Seperti yang<a href="https://dev.to/gaoj0017/quantization-in-the-counterintuitive-high-dimensional-space-4feg"> diilustrasikan</a> oleh Jianyang Gao, seorang penulis RaBitQ, vektor berdimensi tinggi menunjukkan sifat bahwa koordinat individu cenderung terkonsentrasi di sekitar nol, sebuah hasil dari fenomena yang berlawanan dengan naluri yang dijelaskan dalam<a href="https://en.wikipedia.org/wiki/Concentration_of_measure"> Konsentrasi Ukuran</a>. Hal ini memungkinkan untuk membuang sebagian besar ketepatan asli sambil tetap mempertahankan struktur relatif yang diperlukan untuk pencarian tetangga terdekat yang akurat.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_The_counterintuitive_value_distribution_in_high_dimensional_geometry_fad6143bfd.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Gambar: Distribusi nilai yang berlawanan dengan intuisi dalam geometri dimensi tinggi. <em>Pertimbangkan nilai dimensi pertama untuk vektor satuan acak yang diambil secara seragam dari bola satuan; nilainya tersebar secara seragam dalam ruang 3D. Namun, untuk ruang dimensi tinggi (misalnya, 1000D), nilainya terkonsentrasi di sekitar nol, sebuah sifat yang tidak intuitif dari geometri dimensi tinggi. (Sumber gambar: <a href="https://dev.to/gaoj0017/quantization-in-the-counterintuitive-high-dimensional-space-4feg">Kuantisasi dalam Ruang Dimensi Tinggi yang Berlawanan dengan Naluri</a>)</em></p>
<p>Terinspirasi oleh sifat ruang dimensi tinggi ini, <strong>RaBitQ berfokus pada pengkodean informasi sudut daripada koordinat spasial yang tepat.</strong> Hal ini dilakukan dengan menormalkan setiap vektor data relatif terhadap titik referensi seperti titik tengah dataset. Setiap vektor kemudian dipetakan ke titik terdekat pada hypercube, memungkinkan representasi hanya dengan 1 bit per dimensi. Pendekatan ini secara alami meluas ke <code translate="no">IVF_RABITQ</code>, di mana normalisasi dilakukan relatif terhadap centroid cluster terdekat, sehingga meningkatkan akurasi penyandian lokal.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_Compressing_a_vector_by_finding_its_closest_approximation_on_the_hypercube_so_that_each_dimension_can_be_represented_with_just_1_bit_cd0d50bb30.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Gambar: Mengompresi vektor dengan menemukan perkiraan terdekat pada hypercube, sehingga setiap dimensi dapat direpresentasikan hanya dengan 1 bit. (Sumber gambar:</em> <a href="https://dev.to/gaoj0017/quantization-in-the-counterintuitive-high-dimensional-space-4feg"><em>Kuantisasi dalam Ruang Dimensi Tinggi yang berlawanan dengan intuisi</em></a><em>)</em></p>
<p>Untuk memastikan pencarian tetap dapat diandalkan bahkan dengan representasi yang dikompresi, RaBitQ memperkenalkan <strong>estimator yang secara teoritis tidak bias</strong> untuk jarak antara vektor kueri dan vektor dokumen yang dikuantisasi biner. Hal ini membantu meminimalkan kesalahan rekonstruksi dan mempertahankan daya ingat yang tinggi.</p>
<p>RaBitQ juga sangat kompatibel dengan teknik pengoptimalan lainnya, seperti<a href="https://www.vldb.org/pvldb/vol9/p288-andre.pdf"> FastScan</a> dan<a href="https://github.com/facebookresearch/faiss/wiki/Pre--and-post-processing"> preprocessing rotasi acak</a>. Selain itu, RaBitQ <strong>ringan untuk dilatih dan cepat untuk dieksekusi</strong>. Pelatihan hanya melibatkan penentuan tanda setiap komponen vektor, dan pencarian dipercepat melalui operasi bitwise cepat yang didukung oleh CPU modern. Bersama-sama, pengoptimalan ini memungkinkan RaBitQ untuk melakukan pencarian berkecepatan tinggi dengan akurasi yang minimal.</p>
<h2 id="Engineering-RaBitQ-in-Milvus-From-Academic-Research-to-Production" class="common-anchor-header">Rekayasa RaBitQ di Milvus: Dari Penelitian Akademik hingga Produksi<button data-href="#Engineering-RaBitQ-in-Milvus-From-Academic-Research-to-Production" class="anchor-icon" translate="no">
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
    </button></h2><p>Meskipun RaBitQ secara konseptual sangat mudah dan disertai dengan<a href="https://github.com/gaoj0017/RaBitQ"> implementasi referensi</a>, mengadaptasinya dalam basis data vektor tingkat produksi yang terdistribusi seperti Milvus memberikan beberapa tantangan rekayasa. Kami telah mengimplementasikan RaBitQ di Knowhere, mesin pencari vektor inti di balik Milvus, dan juga menyumbangkan versi yang dioptimalkan ke perpustakaan pencarian ANN sumber terbuka<a href="https://github.com/facebookresearch/faiss"> FAISS</a>.</p>
<p>Mari kita lihat bagaimana kami menghidupkan algoritme ini di Milvus.</p>
<h3 id="Implementation-Tradeoffs" class="common-anchor-header">Pengorbanan Implementasi</h3><p>Salah satu keputusan desain yang penting adalah menangani data tambahan per-vektor. RaBitQ membutuhkan dua nilai floating-point per vektor yang telah dihitung sebelumnya selama waktu pengindeksan, dan nilai ketiga yang dapat dihitung secara langsung atau dihitung sebelumnya. Di Knowhere, kami melakukan pra-komputasi nilai ini pada saat pengindeksan dan menyimpannya untuk meningkatkan efisiensi selama pencarian. Sebaliknya, implementasi FAISS menghemat memori dengan menghitungnya pada waktu kueri, mengambil tradeoff yang berbeda antara penggunaan memori dan kecepatan kueri.</p>
<h3 id="Hardware-Acceleration" class="common-anchor-header">Akselerasi Perangkat Keras</h3><p>CPU modern menawarkan instruksi khusus yang dapat mempercepat operasi biner secara signifikan. Kami menyesuaikan kernel komputasi jarak untuk memanfaatkan instruksi CPU modern. Karena RaBitQ bergantung pada operasi popcount, kami membuat jalur khusus di Knowhere yang menggunakan instruksi <code translate="no">VPOPCNTDQ</code> untuk AVX512 jika tersedia. Pada perangkat keras yang didukung (misalnya, Intel IceLake atau AMD Zen 4), hal ini dapat mempercepat komputasi jarak biner dengan beberapa faktor dibandingkan dengan implementasi default.</p>
<h3 id="Query-Optimization" class="common-anchor-header">Pengoptimalan Kueri</h3><p>Baik Knowhere (mesin pencari Milvus) maupun versi FAISS kami yang dioptimalkan mendukung kuantisasi skalar (SQ1-SQ8) pada vektor kueri. Hal ini memberikan fleksibilitas tambahan: bahkan dengan kuantisasi kueri 4-bit, daya ingat tetap tinggi sementara permintaan komputasi menurun secara signifikan, yang sangat berguna ketika kueri harus diproses pada throughput tinggi.</p>
<p>Kami melangkah lebih jauh dalam mengoptimalkan mesin Cardinal milik kami, yang memberi daya pada Milvus yang dikelola sepenuhnya di Zilliz Cloud. Di luar kemampuan Milvus open-source, kami memperkenalkan peningkatan lanjutan, termasuk integrasi dengan indeks vektor berbasis grafik, lapisan pengoptimalan tambahan, dan dukungan untuk instruksi Arm SVE.</p>
<h2 id="The-Performance-Gain-3×-More-QPS-with-Comparable-Accuracy" class="common-anchor-header">Peningkatan Performa: 3× Lebih Banyak QPS dengan Akurasi yang Sebanding<button data-href="#The-Performance-Gain-3×-More-QPS-with-Comparable-Accuracy" class="anchor-icon" translate="no">
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
    </button></h2><p>Dimulai dengan versi 2.6, Milvus memperkenalkan tipe indeks <code translate="no">IVF_RABITQ</code> yang baru. Indeks baru ini menggabungkan RaBitQ dengan pengelompokan IVF, transformasi rotasi acak, dan penyempurnaan opsional untuk memberikan keseimbangan optimal antara kinerja, efisiensi memori, dan akurasi.</p>
<h3 id="Using-IVFRABITQ-in-Your-Application" class="common-anchor-header">Menggunakan IVF_RABITQ dalam Aplikasi Anda</h3><p>Berikut adalah cara mengimplementasikan <code translate="no">IVF_RABITQ</code> dalam aplikasi Milvus Anda:</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient

index_params = MilvusClient.prepare_index_params()

index_params.add_index(
    field_name=<span class="hljs-string">&quot;your_vector_field_name&quot;</span>, <span class="hljs-comment"># Name of the vector field to be indexed</span>
    index_type=<span class="hljs-string">&quot;IVF_RABITQ&quot;</span>, <span class="hljs-comment"># Will be introduced in Milvus 2.6</span>
    index_name=<span class="hljs-string">&quot;vector_index&quot;</span>, <span class="hljs-comment"># Name of the index to create</span>
    metric_type=<span class="hljs-string">&quot;IP&quot;</span>, <span class="hljs-comment"># IVF_RABITQ supports IP and COSINE</span>
    params={
        <span class="hljs-string">&quot;nlist&quot;</span>: <span class="hljs-number">1024</span>, <span class="hljs-comment"># IVF param, specifies the number of clusters</span>
    } <span class="hljs-comment"># Index building params</span>
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Benchmarking-Numbers-Tell-the-Story" class="common-anchor-header">Pembandingan: Angka-angka Menceritakan Kisah</h3><p>Kami melakukan benchmarking dengan konfigurasi yang berbeda menggunakan<a href="https://github.com/zilliztech/vectordbbench"> vdb-bench</a>, sebuah alat benchmarking sumber terbuka untuk mengevaluasi database vektor. Baik lingkungan pengujian maupun lingkungan kontrol menggunakan Milvus Standalone yang diterapkan pada instance AWS EC2 <code translate="no">m6id.2xlarge</code>. Mesin-mesin ini memiliki 8 vCPU, 32 GB RAM, dan CPU Intel Xeon 8375C berdasarkan arsitektur Ice Lake, yang mendukung set instruksi VPOPCNTDQ AVX-512.</p>
<p>Kami menggunakan Uji Performa Pencarian dari vdb-bench, dengan dataset 1 juta vektor, masing-masing dengan 768 dimensi. Karena ukuran segmen default di Milvus adalah 1 GB, dan dataset mentah (768 dimensi × 1 juta vektor × 4 byte per float) berjumlah sekitar 3 GB, maka pembandingan ini melibatkan beberapa segmen per basis data.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_Example_test_configuration_in_vdb_bench_000142f634.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Gambar: Contoh konfigurasi pengujian di vdb-bench.</p>
<p>Berikut ini adalah beberapa detail tingkat rendah tentang tombol-tombol konfigurasi untuk IVF, RaBitQ, dan proses penyempurnaan:</p>
<ul>
<li><p><code translate="no">nlist</code> dan <code translate="no">nprobe</code> adalah parameter standar untuk semua metode berbasis <code translate="no">IVF</code></p></li>
<li><p><code translate="no">nlist</code> adalah bilangan bulat non-negatif yang menentukan jumlah total bucket IVF untuk dataset.</p></li>
<li><p><code translate="no">nprobe</code> adalah bilangan bulat non-negatif yang menentukan jumlah IVF bucket yang dikunjungi untuk satu vektor data selama proses pencarian. Ini adalah parameter yang berhubungan dengan pencarian.</p></li>
<li><p><code translate="no">rbq_bits_query</code> menentukan tingkat kuantisasi vektor kueri. Gunakan nilai 1 ... 8 untuk tingkat kuantisasi <code translate="no">SQ1</code>...<code translate="no">SQ8</code>. Gunakan nilai 0 untuk menonaktifkan kuantisasi. Ini adalah parameter yang berhubungan dengan pencarian.</p></li>
<li><p><code translate="no">refine</code>Parameter <code translate="no">refine_type</code> dan <code translate="no">refine_k</code> adalah parameter standar untuk proses pemurnian</p></li>
<li><p><code translate="no">refine</code> adalah boolean yang mengaktifkan strategi penghalusan.</p></li>
<li><p><code translate="no">refine_k</code> adalah nilai fp non-negatif. Proses refine menggunakan metode kuantisasi dengan kualitas yang lebih tinggi untuk memilih jumlah tetangga terdekat yang dibutuhkan dari kumpulan kandidat <code translate="no">refine_k</code> kali lebih besar, yang dipilih dengan menggunakan <code translate="no">IVFRaBitQ</code>. Ini adalah parameter yang berhubungan dengan pencarian.</p></li>
<li><p><code translate="no">refine_type</code> adalah sebuah string yang menentukan jenis kuantisasi untuk indeks pemurnian. Pilihan yang tersedia adalah <code translate="no">SQ6</code>, <code translate="no">SQ8</code>, <code translate="no">FP16</code>, <code translate="no">BF16</code> dan <code translate="no">FP32</code> / <code translate="no">FLAT</code>.</p></li>
</ul>
<p>Hasilnya mengungkapkan wawasan penting:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_Cost_and_performance_comparison_of_baseline_IVF_FLAT_IVF_SQ_8_and_IVF_RABITQ_with_different_refinement_strategies_9f69fa449f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Gambar: Perbandingan biaya dan kinerja baseline (IVF_FLAT), IVF_SQ8 dan IVF_RABITQ dengan berbagai strategi penyempurnaan</p>
<p>Dibandingkan dengan indeks baseline <code translate="no">IVF_FLAT</code>, yang mencapai 236 QPS dengan recall 95,2%, <code translate="no">IVF_RABITQ</code> mencapai throughput yang jauh lebih tinggi - 648 QPS dengan kueri FP32 dan 898 QPS saat dipasangkan dengan kueri terkuantisasi SQ8. Angka-angka ini menunjukkan keunggulan kinerja RaBitQ, terutama ketika penyempurnaan diterapkan.</p>
<p>Namun, performa ini disertai dengan trade-off yang nyata dalam hal recall. Ketika <code translate="no">IVF_RABITQ</code> digunakan tanpa perbaikan, tingkat recall turun sekitar 76%, yang mungkin tidak cukup untuk aplikasi yang membutuhkan akurasi tinggi. Meskipun demikian, mencapai tingkat recall ini dengan menggunakan kompresi vektor 1-bit masih mengesankan.</p>
<p>Refinement sangat penting untuk memulihkan akurasi. Ketika dikonfigurasi dengan kueri SQ8 dan penyempurnaan SQ8, <code translate="no">IVF_RABITQ</code> memberikan kinerja dan daya ingat yang luar biasa. Ini mempertahankan recall yang tinggi sebesar 94,7%, hampir menyamai IVF_FLAT, sementara mencapai 864 QPS, lebih dari 3 kali lipat lebih tinggi dari IVF_FLAT. Bahkan dibandingkan dengan indeks kuantisasi populer lainnya <code translate="no">IVF_SQ8</code>, <code translate="no">IVF_RABITQ</code> dengan penyempurnaan SQ8 mencapai lebih dari setengah throughput pada recall yang sama, hanya dengan biaya yang lebih sedikit. Hal ini menjadikannya pilihan yang sangat baik untuk skenario yang menuntut kecepatan dan akurasi.</p>
<p>Singkatnya, <code translate="no">IVF_RABITQ</code> sendiri sangat bagus untuk memaksimalkan throughput dengan recall yang dapat diterima, dan menjadi lebih kuat ketika dipasangkan dengan penyempurnaan untuk menutup kesenjangan kualitas, hanya menggunakan sebagian kecil dari ruang memori dibandingkan dengan <code translate="no">IVF_FLAT</code>.</p>
<h2 id="Conclusion" class="common-anchor-header">Kesimpulan<button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p>RaBitQ menandai kemajuan yang signifikan dalam teknologi kuantisasi vektor. Menggabungkan kuantisasi biner dengan strategi pengkodean yang cerdas, teknologi ini mencapai apa yang tampaknya mustahil: kompresi ekstrem dengan kehilangan akurasi minimal.</p>
<p>Dimulai dengan versi 2.6, Milvus akan memperkenalkan IVF_RABITQ, mengintegrasikan teknik kompresi yang kuat ini dengan pengelompokan IVF dan strategi penyempurnaan untuk menghadirkan kuantisasi biner ke dalam produksi. Kombinasi ini menciptakan keseimbangan praktis antara akurasi, kecepatan, dan efisiensi memori yang dapat mengubah beban kerja pencarian vektor Anda.</p>
<p>Kami berkomitmen untuk menghadirkan lebih banyak inovasi seperti ini ke Milvus open-source dan layanan terkelola penuh di Zilliz Cloud, membuat pencarian vektor menjadi lebih efisien dan dapat diakses oleh semua orang.</p>
<h2 id="Getting-Started-with-Milvus-26" class="common-anchor-header">Memulai dengan Milvus 2.6<button data-href="#Getting-Started-with-Milvus-26" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.6 sudah tersedia sekarang. Selain RabitQ, Milvus 2.6 memperkenalkan lusinan fitur baru dan pengoptimalan kinerja seperti penyimpanan berjenjang, Meanhash LSH, dan pencarian teks lengkap yang disempurnakan serta multitenancy, yang secara langsung menjawab tantangan paling mendesak dalam pencarian vektor saat ini: penskalaan secara efisien sambil menjaga biaya tetap terkendali.</p>
<p>Siap menjelajahi semua yang ditawarkan Milvus 2.6? Selami<a href="https://milvus.io/docs/release_notes.md"> catatan rilis</a> kami, telusuri<a href="https://milvus.io/docs"> dokumentasi lengkapnya</a>, atau lihat<a href="https://milvus.io/blog"> blog fitur</a> kami.</p>
<p>Jika Anda memiliki pertanyaan atau memiliki kasus penggunaan yang serupa, jangan ragu untuk menghubungi kami melalui <a href="https://discord.com/invite/8uyFbECzPX">komunitas Discord</a> kami atau mengajukan masalah di<a href="https://github.com/milvus-io/milvus"> GitHub</a> - kami di sini untuk membantu Anda memaksimalkan Milvus 2.6.</p>
