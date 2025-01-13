---
id: >-
  efficient-vector-similarity-search-recommender-workflows-using-milvus-nvidia-merlin.md
title: >-
  Pencarian Kemiripan Vektor yang Efisien dalam Alur Kerja Rekomendasi
  Menggunakan Milvus dengan NVIDIA Merlin
author: Burcin Bozkaya
date: 2023-12-15T00:00:00.000Z
desc: >-
  Pengenalan integrasi NVIDIA Merlin dan Milvus dalam membangun sistem
  rekomendasi dan membandingkan kinerjanya dalam berbagai skenario.
cover: assets.zilliz.com/nvidia_4921837ca6.png
tag: Engineering
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Vector Management, NVIDIA, Merlin
recommend: true
canonicalUrl: >-
  https://zilliz.com/blog/efficient-vector-similarity-search-recommender-workflows-using-milvus-nvidia-merlin
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/nvidia_4921837ca6.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Artikel ini pertama kali dipublikasikan di <a href="https://medium.com/nvidia-merlin/efficient-vector-similarity-search-in-recommender-workflows-using-milvus-with-nvidia-merlin-84d568290ee4">kanal Medium NVIDIA Merlin</a> dan disunting serta dimuat ulang di sini dengan izin. Artikel ini ditulis bersama oleh <a href="https://medium.com/u/743df9db1666?source=post_page-----84d568290ee4--------------------------------">Burcin Bozkaya</a> dan <a href="https://medium.com/u/279d4c25a145?source=post_page-----84d568290ee4--------------------------------">William Hicks</a> dari NVIDIA serta <a href="https://medium.com/u/3e8a3c67a8a5?source=post_page-----84d568290ee4--------------------------------">Filip Haltmayer</a> dan <a href="https://github.com/liliu-z">Li Liu</a> dari Zilliz.</em></p>
<h2 id="Introduction" class="common-anchor-header">Pendahuluan<button data-href="#Introduction" class="anchor-icon" translate="no">
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
    </button></h2><p>Sistem pemberi rekomendasi modern (Recsys) terdiri dari jalur pelatihan/inferensi yang melibatkan beberapa tahap konsumsi data, prapemrosesan data, pelatihan model, dan penyetelan hiperparameter untuk pengambilan, penyaringan, pemeringkatan, dan pemberian skor pada item yang relevan. Komponen penting dari pipeline sistem pemberi rekomendasi adalah pengambilan atau penemuan hal-hal yang paling relevan bagi pengguna, terutama dengan adanya katalog barang yang besar. Langkah ini biasanya melibatkan pencarian <a href="https://zilliz.com/glossary/anns">perkiraan tetangga terdekat (ANN</a> ) melalui basis data yang diindeks dari representasi vektor berdimensi rendah (yaitu, penyematan) dari atribut produk dan pengguna yang dibuat dari model pembelajaran mendalam yang dilatih berdasarkan interaksi antara pengguna dan produk/layanan.</p>
<p><a href="https://github.com/NVIDIA-Merlin">NVIDIA Merlin</a>, sebuah kerangka kerja sumber terbuka yang dikembangkan untuk melatih model end-to-end untuk membuat rekomendasi dalam skala apa pun, terintegrasi dengan indeks <a href="https://zilliz.com/learn/what-is-vector-database">basis data vektor</a> yang efisien dan kerangka kerja pencarian. Salah satu kerangka kerja yang mendapatkan banyak perhatian baru-baru ini adalah <a href="https://zilliz.com/what-is-milvus">Milvus</a>, sebuah basis data vektor sumber terbuka yang dibuat oleh <a href="https://zilliz.com/">Zilliz</a>. Ini menawarkan kemampuan indeks dan kueri yang cepat. Milvus baru-baru ini menambahkan <a href="https://zilliz.com/blog/getting-started-with-gpu-powered-milvus-unlocking-10x-higher-performance">dukungan akselerasi GPU</a> yang menggunakan GPU NVIDIA untuk menopang alur kerja AI. Dukungan akselerasi GPU adalah berita bagus karena pustaka pencarian vektor yang dipercepat memungkinkan kueri konkuren yang cepat, yang berdampak positif pada persyaratan latensi dalam sistem pemberi rekomendasi saat ini, di mana pengembang mengharapkan banyak permintaan konkuren. Milvus memiliki lebih dari 5 juta tarikan docker, ~23 ribu bintang di GitHub (per September 2023), lebih dari 5.000 pelanggan Enterprise, dan merupakan komponen inti dari banyak aplikasi (lihat contoh <a href="https://medium.com/vector-database/tagged/use-cases-of-milvus">kasus</a>).</p>
<p>Blog ini mendemonstrasikan bagaimana Milvus bekerja dengan kerangka kerja Merlin Recsys pada saat pelatihan dan penarikan kesimpulan. Kami menunjukkan bagaimana Milvus melengkapi Merlin pada tahap pengambilan item dengan pencarian penyematan vektor top-k yang sangat efisien dan bagaimana Milvus dapat digunakan dengan NVIDIA Triton Inference Server (TIS) pada waktu inferensi (lihat Gambar 1). <strong>Hasil benchmark kami menunjukkan peningkatan kecepatan 37x hingga 91x dengan Milvus yang diakselerasi GPU yang menggunakan NVIDIA RAFT dengan penyematan vektor yang dihasilkan oleh Merlin Models.</strong> Kode yang kami gunakan untuk menunjukkan integrasi Merlin-Milvus dan hasil benchmark yang terperinci, bersama dengan <a href="https://github.com/zilliztech/VectorDBBench">library</a> yang memfasilitasi studi benchmark kami, tersedia di sini.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Multistage_recommender_system_with_Milvus_ee891c4ad5.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Gambar 1. Sistem rekomendasi multistage dengan kerangka kerja Milvus yang berkontribusi pada tahap pengambilan. Sumber untuk gambar multistage asli: <a href="https://medium.com/nvidia-merlin/recommender-systems-not-just-recommender-models-485c161c755e">posting blog</a> ini.</em></p>
<h2 id="The-challenges-facing-recommenders" class="common-anchor-header">Tantangan yang dihadapi pemberi rekomendasi<button data-href="#The-challenges-facing-recommenders" class="anchor-icon" translate="no">
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
    </button></h2><p>Mengingat sifat multistage dari recomendator dan ketersediaan berbagai komponen dan library yang mereka integrasikan, tantangan yang signifikan adalah mengintegrasikan semua komponen dengan mulus dalam sebuah pipeline end-to-end. Kami bertujuan untuk menunjukkan bahwa integrasi dapat dilakukan dengan sedikit usaha dalam buku catatan contoh kami.</p>
<p>Tantangan lain dari alur kerja rekomendasi adalah mempercepat bagian pipeline tertentu. Meskipun diketahui memainkan peran besar dalam melatih jaringan saraf yang besar, GPU hanya merupakan tambahan terbaru untuk database vektor dan pencarian ANN. Dengan meningkatnya ukuran inventaris produk e-commerce atau basis data media streaming dan jumlah pengguna yang menggunakan layanan ini, CPU harus memberikan kinerja yang diperlukan untuk melayani jutaan pengguna dalam alur kerja Recsys yang berkinerja tinggi. Akselerasi GPU di bagian pipeline lainnya menjadi penting untuk mengatasi tantangan ini. Solusi dalam blog ini menjawab tantangan ini dengan menunjukkan bahwa pencarian ANN efisien ketika menggunakan GPU.</p>
<h2 id="Tech-stacks-for-the-solution" class="common-anchor-header">Tumpukan teknologi untuk solusi<button data-href="#Tech-stacks-for-the-solution" class="anchor-icon" translate="no">
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
    </button></h2><p>Mari kita mulai dengan meninjau beberapa hal mendasar yang diperlukan untuk melakukan pekerjaan kita.</p>
<ul>
<li><p>NVIDIA <a href="https://github.com/NVIDIA-Merlin/Merlin">Merlin</a>: pustaka sumber terbuka dengan API tingkat tinggi yang mempercepat rekomendasi pada GPU NVIDIA.</p></li>
<li><p><a href="https://github.com/NVIDIA-Merlin/NVTabular">NVTabular</a>: untuk pra-pemrosesan data tabular input dan rekayasa fitur.</p></li>
<li><p><a href="https://github.com/NVIDIA-Merlin/models">Merlin Models</a>: untuk melatih model pembelajaran mendalam, dan untuk mempelajari, dalam hal ini, vektor penyematan pengguna dan item dari data interaksi pengguna.</p></li>
<li><p><a href="https://github.com/NVIDIA-Merlin/systems">Sistem Merlin</a>: untuk menggabungkan model rekomendasi berbasis TensorFlow dengan elemen-elemen lain (mis. penyimpanan fitur, pencarian ANN dengan Milvus) untuk disajikan dengan TIS.</p></li>
<li><p><a href="https://github.com/triton-inference-server/server">Triton Inference Server</a>: untuk tahap inferensi di mana vektor fitur pengguna dilewatkan, dan rekomendasi produk dihasilkan.</p></li>
<li><p>Kontainerisasi: semua hal di atas tersedia melalui kontainer yang disediakan NVIDIA di <a href="https://catalog.ngc.nvidia.com/">katalog NGC</a>. Kami menggunakan kontainer Merlin TensorFlow 23.06 yang tersedia <a href="https://catalog.ngc.nvidia.com/orgs/nvidia/teams/merlin/containers/merlin-tensorflow">di sini</a>.</p></li>
<li><p><a href="https://github.com/milvus-io/milvus/releases/tag/v2.3.0">Milvus 2.3</a>: untuk melakukan pengindeksan dan query vektor yang diakselerasi oleh GPU.</p></li>
<li><p><a href="https://github.com/milvus-io/milvus/releases">Milvus 2.2.11</a>: sama seperti di atas, tetapi untuk melakukannya di CPU.</p></li>
<li><p><a href="https://zilliz.com/product/integrations/python">Pymilvus SDK</a>: untuk menghubungkan ke server Milvus, membuat indeks basis data vektor, dan menjalankan kueri melalui antarmuka Python.</p></li>
<li><p><a href="https://github.com/feast-dev/feast">Feast</a>: untuk menyimpan dan mengambil atribut pengguna dan item dalam penyimpanan fitur (open source) sebagai bagian dari pipeline RecSys end-to-end.</p></li>
</ul>
<p>Beberapa pustaka dan kerangka kerja yang mendasari juga digunakan di bawah kap mesin. Sebagai contoh, Merlin bergantung pada pustaka NVIDIA lainnya, seperti cuDF dan Dask, keduanya tersedia di bawah <a href="https://github.com/rapidsai/cudf">RAPIDS cuDF</a>. Demikian juga, Milvus bergantung pada <a href="https://github.com/rapidsai/raft">NVIDIA RAFT</a> untuk primitif pada akselerasi GPU dan pustaka yang dimodifikasi seperti <a href="https://zilliz.com/learn/hierarchical-navigable-small-worlds-HNSW">HNSW</a> dan <a href="https://zilliz.com/blog/set-up-with-facebook-ai-similarity-search-faiss">FAISS</a> untuk pencarian.</p>
<h2 id="Understanding-vector-databases-and-Milvus" class="common-anchor-header">Memahami basis data vektor dan Milvus<button data-href="#Understanding-vector-databases-and-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://zilliz.com/glossary/anns">Perkiraan tetangga terdekat (ANN</a> ) adalah fungsionalitas yang tidak dapat ditangani oleh basis data relasional. Database relasional dirancang untuk menangani data tabular dengan struktur yang telah ditentukan dan nilai yang dapat dibandingkan secara langsung. Indeks basis data relasional mengandalkan hal ini untuk membandingkan data dan membuat struktur yang memanfaatkan pengetahuan tentang apakah setiap nilai kurang dari atau lebih besar dari nilai lainnya. Vektor yang disematkan tidak dapat secara langsung dibandingkan satu sama lain dengan cara ini, karena kita perlu mengetahui apa yang diwakili oleh setiap nilai dalam vektor. Mereka tidak dapat mengatakan apakah satu vektor harus lebih kecil dari vektor lainnya. Satu-satunya hal yang dapat kita lakukan adalah menghitung jarak antara dua vektor. Jika jarak antara dua vektor kecil, kita dapat mengasumsikan bahwa fitur yang mereka wakili serupa, dan jika besar, kita dapat mengasumsikan bahwa data yang mereka wakili lebih berbeda. Namun, indeks yang efisien ini memiliki kekurangan; menghitung jarak antara dua vektor secara komputasi sangat mahal, dan indeks vektor tidak mudah beradaptasi dan terkadang tidak dapat dimodifikasi. Karena dua keterbatasan ini, mengintegrasikan indeks-indeks ini menjadi lebih kompleks dalam basis data relasional, dan karena itulah diperlukan <a href="https://zilliz.com/blog/what-is-a-real-vector-database">basis data vektor yang dibangun khusus</a>.</p>
<p><a href="https://zilliz.com/what-is-milvus">Milvus</a> diciptakan untuk memecahkan masalah yang dihadapi database relasional dengan vektor dan dirancang dari awal untuk menangani vektor penyematan dan indeksnya dalam skala besar. Untuk memenuhi lencana cloud-native, Milvus memisahkan komputasi dan penyimpanan serta tugas-tugas komputasi yang berbeda - kueri, penguraian data, dan pengindeksan. Pengguna dapat menskalakan setiap bagian basis data untuk menangani kasus penggunaan lain, baik yang berat untuk memasukkan data atau berat untuk pencarian. Jika ada banyak permintaan penyisipan, pengguna dapat menskalakan node indeks secara horizontal dan vertikal untuk menangani pemasukan data. Demikian juga, jika tidak ada data yang dimasukkan, tetapi ada banyak pencarian, pengguna dapat mengurangi node indeks dan sebagai gantinya meningkatkan node kueri untuk mendapatkan hasil yang lebih banyak. Desain sistem ini (lihat Gambar 2) mengharuskan kami untuk berpikir dengan pola pikir komputasi paralel, sehingga menghasilkan sistem yang dioptimalkan untuk komputasi dengan banyak pintu yang terbuka untuk pengoptimalan lebih lanjut.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Milvus_system_design_bb3a44c9cc.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Gambar 2. Desain sistem Milvus</em></p>
<p>Milvus juga menggunakan banyak pustaka pengindeksan yang canggih untuk memberi pengguna sebanyak mungkin penyesuaian untuk sistem mereka. Ini meningkatkannya dengan menambahkan kemampuan untuk menangani operasi CRUD, streaming data, dan pemfilteran. Selanjutnya, kita akan membahas bagaimana indeks ini berbeda dan apa pro dan kontra dari masing-masing indeks tersebut.</p>
<h2 id="Example-solution-integration-of-Milvus-and-Merlin" class="common-anchor-header">Contoh solusi: integrasi Milvus dan Merlin<button data-href="#Example-solution-integration-of-Milvus-and-Merlin" class="anchor-icon" translate="no">
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
    </button></h2><p>Contoh solusi yang kami sajikan di sini menunjukkan integrasi Milvus dengan Merlin pada tahap pengambilan item (ketika k item yang paling relevan diambil melalui pencarian ANN). Kami menggunakan dataset kehidupan nyata dari <a href="https://www.kaggle.com/datasets/chadgostopp/recsys-challenge-2015">tantangan RecSys</a>, yang dijelaskan di bawah ini. Kami melatih model pembelajaran mendalam Two-Tower yang mempelajari penyematan vektor untuk pengguna dan item. Bagian ini juga menyediakan cetak biru dari pekerjaan pembandingan kami, termasuk metrik yang kami kumpulkan dan rentang parameter yang kami gunakan.</p>
<p>Pendekatan kami meliputi:</p>
<ul>
<li><p>Konsumsi dan prapemrosesan data</p></li>
<li><p>Pelatihan model pembelajaran mendalam Dua Menara</p></li>
<li><p>Pembuatan indeks Milvus</p></li>
<li><p>Pencarian kesamaan Milvus</p></li>
</ul>
<p>Kami menjelaskan secara singkat setiap langkah dan merujuk pembaca ke <a href="https://github.com/bbozkaya/merlin-milvus/tree/main/notebooks">buku catatan</a> kami untuk detailnya.</p>
<h3 id="Dataset" class="common-anchor-header">Dataset</h3><p>YOOCHOOSE GmbH menyediakan dataset yang kami gunakan dalam studi integrasi dan tolok ukur ini untuk <a href="https://www.kaggle.com/datasets/chadgostopp/recsys-challenge-2015">tantangan RecSys 2015</a> dan tersedia di Kaggle. Dataset ini berisi peristiwa klik/pembelian pengguna dari peritel online Eropa dengan atribut seperti ID sesi, stempel waktu, ID item yang terkait dengan klik/pembelian, dan kategori item, yang tersedia di file yoochoose-clicks.dat. Sesi-sesi tersebut bersifat independen, dan tidak ada petunjuk tentang pengguna yang kembali, jadi kami memperlakukan setiap sesi sebagai milik pengguna yang berbeda. Dataset ini memiliki 9.249.729 sesi (pengguna) unik dan 52.739 item unik.</p>
<h3 id="Data-ingestion-and-preprocessing" class="common-anchor-header">Pemasukan dan prapemrosesan data</h3><p>Alat yang kami gunakan untuk prapemrosesan data adalah <a href="https://github.com/NVIDIA-Merlin/NVTabular">NVTabular</a>, sebuah komponen rekayasa fitur dan prapemrosesan yang dipercepat dengan GPU dan sangat skalabel dari Merlin. Kami menggunakan NVTabular untuk membaca data ke dalam memori GPU, mengatur ulang fitur seperlunya, mengekspor ke file parket, dan membuat pembagian validasi pelatihan untuk pelatihan. Hal ini menghasilkan 7.305.761 pengguna unik dan 49.008 item unik untuk dilatih. Kami juga mengkategorikan setiap kolom dan nilainya ke dalam nilai bilangan bulat. Dataset sekarang siap untuk dilatih dengan model Dua Menara.</p>
<h3 id="Model-training" class="common-anchor-header">Pelatihan model</h3><p>Kami menggunakan model pembelajaran mendalam <a href="https://github.com/NVIDIA-Merlin/models/blob/main/examples/05-Retrieval-Model.ipynb">Two-Tower</a> untuk melatih dan menghasilkan penyematan pengguna dan item, yang kemudian digunakan dalam pengindeksan vektor dan kueri. Setelah melatih model, kita dapat mengekstrak sematan pengguna dan item yang telah dipelajari.</p>
<p>Dua langkah berikut ini bersifat opsional: model <a href="https://arxiv.org/abs/1906.00091">DLRM</a> yang dilatih untuk memberi peringkat pada item yang diambil untuk rekomendasi dan penyimpanan fitur yang digunakan (dalam kasus ini, <a href="https://github.com/feast-dev/feast">Feast</a>) untuk menyimpan dan mengambil fitur pengguna dan item. Kami menyertakannya untuk kelengkapan alur kerja multi-tahap.</p>
<p>Terakhir, kami mengekspor penyematan pengguna dan item ke file parket, yang nantinya dapat dimuat ulang untuk membuat indeks vektor Milvus.</p>
<h3 id="Building-and-querying-the-Milvus-index" class="common-anchor-header">Membangun dan menanyakan indeks Milvus</h3><p>Milvus memfasilitasi pengindeksan vektor dan pencarian kemiripan melalui sebuah "server" yang dijalankan pada mesin inferensi. Pada buku catatan #2, kami menyiapkannya dengan melakukan pip-instalasi server Milvus dan Pymilvus, lalu memulai server dengan port pendengar default. Selanjutnya, kami mendemonstrasikan pembuatan indeks sederhana (IVF_FLAT) dan melakukan kueri terhadap indeks tersebut dengan menggunakan fungsi <code translate="no">setup_milvus</code> dan <code translate="no">query_milvus</code>.</p>
<h2 id="Benchmarking" class="common-anchor-header">Pembandingan<button data-href="#Benchmarking" class="anchor-icon" translate="no">
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
    </button></h2><p>Kami telah merancang dua benchmark untuk mendemonstrasikan kasus penggunaan pustaka pengindeksan/pencarian vektor yang cepat dan efisien seperti Milvus.</p>
<ol>
<li><p>Menggunakan Milvus untuk membangun indeks vektor dengan dua set sematan yang kami hasilkan: 1) penyematan pengguna untuk 7,3 juta pengguna unik, dibagi menjadi 85% set latihan (untuk pengindeksan) dan 15% set uji (untuk penelusuran), dan 2) penyematan item untuk 49 ribu produk (dengan pembagian 50-50 latihan-pengujian). Tolok ukur ini dilakukan secara independen untuk setiap set data vektor, dan hasilnya dilaporkan secara terpisah.</p></li>
<li><p>Menggunakan Milvus untuk membangun indeks vektor untuk 49 ribu dataset penyematan item dan menanyakan 7,3 juta pengguna unik terhadap indeks ini untuk pencarian kemiripan.</p></li>
</ol>
<p>Dalam benchmark ini, kami menggunakan algoritme pengindeksan IVFPQ dan HNSW yang dijalankan di GPU dan CPU, serta berbagai kombinasi parameter. Detailnya tersedia <a href="https://github.com/bbozkaya/merlin-milvus/tree/main/results">di sini</a>.</p>
<p>Pertukaran kualitas pencarian dan throughput merupakan pertimbangan kinerja yang penting, terutama dalam lingkungan produksi. Milvus memungkinkan kontrol penuh atas parameter pengindeksan untuk mengeksplorasi tradeoff ini untuk kasus penggunaan tertentu untuk mencapai hasil pencarian yang lebih baik dengan ground truth. Hal ini dapat berarti peningkatan biaya komputasi dalam bentuk penurunan tingkat throughput atau kueri per detik (QPS). Kami mengukur kualitas pencarian ANN dengan metrik recall dan memberikan kurva QPS-recall yang menunjukkan tradeoff. Seseorang kemudian dapat memutuskan tingkat kualitas pencarian yang dapat diterima mengingat sumber daya komputasi atau persyaratan latensi/throughput dari kasus bisnis.</p>
<p>Selain itu, perhatikan juga ukuran batch kueri (nq) yang digunakan dalam tolok ukur kami. Ini berguna dalam alur kerja di mana beberapa permintaan simultan dikirim ke inferensi (misalnya, rekomendasi offline yang diminta dan dikirim ke daftar penerima email atau rekomendasi online yang dibuat dengan menggabungkan permintaan bersamaan yang masuk dan memprosesnya sekaligus). Tergantung dari kasus penggunaannya, TIS juga bisa membantu memproses permintaan-permintaan ini secara berkelompok.</p>
<h3 id="Results" class="common-anchor-header">Hasil</h3><p>Kami sekarang melaporkan hasil untuk tiga set tolok ukur di CPU dan GPU, dengan menggunakan tipe indeks HNSW (hanya CPU) dan IVF_PQ (CPU dan GPU) yang diimplementasikan oleh Milvus.</p>
<h4 id="Items-vs-Items-vector-similarity-search" class="common-anchor-header">Pencarian kemiripan vektor item vs item</h4><p>Dengan dataset terkecil ini, setiap proses untuk kombinasi parameter tertentu mengambil 50% vektor item sebagai vektor kueri dan mencari 100 vektor yang paling mirip dari yang lainnya. HNSW dan IVF_PQ menghasilkan recall yang tinggi dengan pengaturan parameter yang diuji, masing-masing dalam kisaran 0.958-1.0 dan 0.665-0.997. Hasil ini menunjukkan bahwa HNSW memiliki kinerja yang lebih baik dalam hal recall, tetapi IVF_PQ dengan pengaturan nlist yang kecil menghasilkan recall yang sangat sebanding. Kami juga harus mencatat bahwa nilai recall dapat sangat bervariasi tergantung pada parameter pengindeksan dan kueri. Nilai-nilai yang kami laporkan telah diperoleh setelah percobaan awal dengan rentang parameter umum dan memperbesar lebih jauh ke dalam subset tertentu.</p>
<p>Total waktu untuk mengeksekusi semua kueri pada CPU dengan HNSW untuk kombinasi parameter yang diberikan berkisar antara 5,22 dan 5,33 detik (lebih cepat dengan semakin besarnya m, relatif tidak berubah dengan ef) dan dengan IVF_PQ antara 13,67 dan 14,67 detik (lebih lambat dengan semakin besarnya nlist dan nprobe). Akselerasi GPU memang memiliki efek yang nyata, seperti yang terlihat pada Gambar 3.</p>
<p>Gambar 3 menunjukkan trade-off recall-throughput pada semua proses yang diselesaikan pada CPU dan GPU dengan dataset kecil menggunakan IVF_PQ. Kami menemukan bahwa GPU memberikan peningkatan kecepatan sebesar 4x hingga 15x pada semua kombinasi parameter yang diuji (peningkatan kecepatan yang lebih besar seiring dengan bertambahnya nprobe). Hal ini dihitung dengan mengambil rasio QPS dari GPU dibandingkan QPS dari CPU yang dijalankan untuk setiap kombinasi parameter. Secara keseluruhan, set ini memberikan sedikit tantangan bagi CPU atau GPU dan menunjukkan prospek untuk peningkatan kecepatan lebih lanjut dengan set data yang lebih besar, seperti yang akan dibahas di bawah ini.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/GPU_speedup_with_Milvus_IVF_PQ_item_item_d32de8443d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Gambar 3. Kecepatan GPU dengan algoritma Milvus IVF_PQ yang berjalan pada GPU NVIDIA A100 (pencarian kemiripan item-item)</em></p>
<h4 id="Users-vs-Users-vector-similarity-search" class="common-anchor-header">Pencarian kemiripan vektor pengguna vs pengguna</h4><p>Dengan dataset kedua yang jauh lebih besar (7,3 juta pengguna), kami menyisihkan 85% (~6,2 juta) vektor sebagai "latih" (kumpulan vektor yang akan diindeks), dan sisanya 15% (~1,1 juta) sebagai "uji" atau kumpulan vektor kueri. HNSW dan IVF_PQ berkinerja sangat baik dalam hal ini, dengan nilai recall masing-masing 0.884-1.0 dan 0.922-0.999. Akan tetapi, kedua metode ini secara komputasi jauh lebih berat, terutama dengan IVF_PQ pada CPU. Total waktu untuk mengeksekusi semua kueri pada CPU dengan HNSW berkisar antara 279,89 hingga 295,56 detik dan dengan IVF_PQ dari 3082,67 hingga 10932,33 detik. Perhatikan bahwa waktu kueri ini bersifat kumulatif untuk 1,1 juta vektor yang di-query, sehingga dapat dikatakan bahwa kueri tunggal terhadap indeks masih sangat cepat.</p>
<p>Namun, kueri berbasis CPU mungkin tidak dapat digunakan jika server inferensi mengharapkan ribuan permintaan bersamaan untuk menjalankan kueri terhadap inventaris jutaan item.</p>
<p>GPU A100 memberikan kecepatan yang luar biasa sebesar 37x hingga 91x (rata-rata 76,1x) di semua kombinasi parameter dengan IVF_PQ dalam hal throughput (QPS), seperti yang ditunjukkan pada Gambar 4. Hal ini konsisten dengan apa yang kami amati dengan dataset kecil, yang menunjukkan bahwa performa GPU berskala cukup baik dengan menggunakan Milvus dengan jutaan vektor penyisipan.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/GPU_speedup_with_Milvus_IVF_PQ_algorithm_user_user_c91f4e4164.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Gambar 4. Kecepatan GPU dengan algoritma Milvus IVF_PQ yang berjalan pada GPU NVIDIA A100 (pencarian kemiripan antar-pengguna)</em></p>
<p>Gambar 5 berikut ini menunjukkan tradeoff recall-QPS untuk semua kombinasi parameter yang diuji pada CPU dan GPU dengan IVF_PQ. Setiap titik yang ditetapkan (atas untuk GPU, bawah untuk CPU) pada grafik ini menggambarkan pengorbanan yang dihadapi ketika mengubah parameter pengindeksan vektor/query untuk mencapai recall yang lebih tinggi dengan mengorbankan throughput yang lebih rendah. Perhatikan hilangnya QPS yang cukup besar dalam kasus GPU saat seseorang mencoba mencapai tingkat recall yang lebih tinggi.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Recall_Throughput_tradeoff_519b2289e5.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Gambar 5. Tradeoff Recall-Throughput untuk semua kombinasi parameter yang diuji pada CPU dan GPU dengan IVF_PQ (pengguna vs. pengguna)</em></p>
<h4 id="Users-vs-Items-vector-similarity-search" class="common-anchor-header">Pencarian kesamaan vektor pengguna vs. item</h4><p>Terakhir, kami mempertimbangkan kasus penggunaan realistis lainnya di mana vektor pengguna ditanyakan terhadap vektor item (seperti yang ditunjukkan pada Notebook 01 di atas). Dalam kasus ini, 49 ribu vektor item diindeks, dan 7,3 juta vektor pengguna masing-masing ditanyakan untuk 100 item yang paling mirip.</p>
<p>Di sinilah hal yang menarik karena melakukan query 7,3 juta dalam kelompok 1000 terhadap indeks 49 ribu item akan memakan waktu CPU baik untuk HNSW maupun IVF_PQ. GPU tampaknya menangani kasus ini dengan lebih baik (lihat Gambar 6). Tingkat akurasi tertinggi oleh IVF_PQ pada CPU saat nlist = 100 dihitung dalam waktu rata-rata sekitar 86 menit, tetapi bervariasi secara signifikan seiring dengan meningkatnya nilai nprobe (51 menit saat nprobe = 5 vs 128 menit saat nprobe = 20). GPU NVIDIA A100 mempercepat kinerja secara signifikan dengan faktor 4x hingga 17x (peningkatan yang lebih tinggi saat nprobe semakin besar). Ingatlah bahwa algoritma IVF_PQ, melalui teknik kuantisasi, juga mengurangi jejak memori dan memberikan solusi pencarian ANN yang layak secara komputasi yang dikombinasikan dengan akselerasi GPU.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/GPU_speedup_with_Milvus_IVF_PQ_algorithm_user_item_504462fcc0.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Gambar 6. Percepatan GPU dengan algoritma Milvus IVF_PQ yang berjalan pada GPU NVIDIA A100 (pencarian kemiripan item pengguna)</em></p>
<p>Serupa dengan Gambar 5, trade-off recall-throughput ditunjukkan pada Gambar 7 untuk semua kombinasi parameter yang diuji dengan IVF_PQ. Di sini, kita masih dapat melihat bagaimana kita mungkin perlu sedikit mengorbankan beberapa akurasi pada pencarian ANN demi meningkatkan throughput, meskipun perbedaannya tidak terlalu mencolok, terutama dalam kasus GPU. Hal ini menunjukkan bahwa kita dapat mengharapkan tingkat kinerja komputasi yang relatif tinggi secara konsisten dengan GPU sambil tetap mencapai recall yang tinggi.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Recall_Throughput_tradeoff_user_items_0abce91c5e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Gambar 7. Tradeoff Recall-Throughput untuk semua kombinasi parameter yang diuji pada CPU dan GPU dengan IVF_PQ (pengguna vs item)</em></p>
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
    </button></h2><p>Kami dengan senang hati akan membagikan beberapa kesimpulan jika Anda sudah sampai sejauh ini. Kami ingin mengingatkan Anda bahwa kompleksitas dan sifat multi-tahap Recsys modern membutuhkan kinerja dan efisiensi di setiap langkah. Semoga blog ini telah memberikan Anda alasan kuat untuk mempertimbangkan penggunaan dua fitur penting dalam pipeline RecSys Anda:</p>
<ul>
<li><p>Perpustakaan Sistem Merlin NVIDIA Merlin memungkinkan Anda untuk dengan mudah menyambungkan <a href="https://github.com/milvus-io/milvus/tree/2.3.0">Milvus</a>, mesin pencari vektor yang diakselerasi oleh GPU yang efisien.</p></li>
<li><p>Gunakan GPU untuk mempercepat komputasi pengindeksan basis data vektor, dan pencarian ANN dengan teknologi seperti <a href="https://github.com/rapidsai/raft">RAPIDS RAFT</a>.</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/summary_benchmark_results_ae33fbe514.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Temuan ini menunjukkan bahwa integrasi Merlin-Milvus yang disajikan memiliki kinerja yang tinggi dan jauh lebih tidak rumit daripada opsi lain untuk pelatihan dan inferensi. Selain itu, kedua kerangka kerja ini secara aktif dikembangkan, dan banyak fitur baru (misalnya, indeks basis data vektor yang diakselerasi dengan GPU oleh Milvus) ditambahkan dalam setiap rilis. Fakta bahwa pencarian kemiripan vektor adalah komponen penting dalam berbagai alur kerja, seperti visi komputer, pemodelan bahasa yang besar, dan sistem pemberi rekomendasi, membuat upaya ini menjadi semakin berharga.</p>
<p>Sebagai penutup, kami ingin mengucapkan terima kasih kepada semua pihak dari Zilliz/Milvus dan Merlin serta tim RAFT yang telah berkontribusi dalam upaya menghasilkan karya ini dan posting blog. Kami menantikan masukan dari Anda, jika Anda memiliki kesempatan untuk mengimplementasikan Merlin dan Milvus di recsys Anda atau alur kerja lainnya.</p>
