---
id: building-personalized-recommender-systems-milvus-paddlepaddle.md
title: Latar Belakang Pendahuluan
author: Shiyu Chen
date: 2021-02-24T23:12:34.209Z
desc: Cara membangun sistem rekomendasi yang didukung oleh deep learning
cover: assets.zilliz.com/header_e6c4a8aee6.jpg
tag: Scenarios
canonicalUrl: >-
  https://zilliz.com/blog/building-personalized-recommender-systems-milvus-paddlepaddle
---
<custom-h1>Membangun Sistem Rekomendasi yang Dipersonalisasi dengan Milvus dan PaddlePaddle</custom-h1><h2 id="Background-Introduction" class="common-anchor-header">Latar Belakang Pendahuluan<button data-href="#Background-Introduction" class="anchor-icon" translate="no">
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
    </button></h2><p>Dengan terus berkembangnya teknologi jaringan dan skala e-commerce yang terus berkembang, jumlah dan variasi barang tumbuh dengan cepat dan pengguna harus menghabiskan banyak waktu untuk menemukan barang yang ingin mereka beli. Ini adalah kelebihan informasi. Untuk mengatasi masalah ini, sistem rekomendasi muncul.</p>
<p>Sistem rekomendasi adalah bagian dari Sistem Penyaringan Informasi, yang dapat digunakan di berbagai bidang seperti film, musik, e-commerce, dan rekomendasi aliran Feed. Sistem rekomendasi menemukan kebutuhan dan minat pengguna yang dipersonalisasi dengan menganalisis dan menambang perilaku pengguna, dan merekomendasikan informasi atau produk yang mungkin menarik bagi pengguna. Tidak seperti mesin pencari, sistem rekomendasi tidak mengharuskan pengguna untuk mendeskripsikan kebutuhan mereka secara akurat, tetapi memodelkan perilaku historis mereka untuk secara proaktif memberikan informasi yang sesuai dengan minat dan kebutuhan pengguna.</p>
<p>Pada artikel ini kami menggunakan PaddlePaddle, sebuah platform deep learning dari Baidu, untuk membangun sebuah model dan menggabungkan Milvus, sebuah mesin pencari dengan kemiripan vektor, untuk membangun sebuah sistem rekomendasi yang dipersonalisasi yang dapat dengan cepat dan akurat memberikan informasi yang menarik kepada pengguna.</p>
<h2 id="Data-Preparation" class="common-anchor-header">Persiapan Data<button data-href="#Data-Preparation" class="anchor-icon" translate="no">
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
    </button></h2><p>Kami menggunakan MovieLens Million Dataset (ml-1m) [1] sebagai contoh. Dataset ml-1m berisi 1.000.000 ulasan dari 4.000 film oleh 6.000 pengguna, yang dikumpulkan oleh laboratorium GroupLens Research. Data asli termasuk data fitur film, fitur pengguna, dan peringkat pengguna film, Anda dapat merujuk ke ml-1m-README [2] .</p>
<p>Dataset ml-1m mencakup 3 artikel .dat: movies.dat、users.dat dan ratings.dat.movies.dat termasuk fitur film, lihat contoh di bawah ini:</p>
<pre><code translate="no">MovieID::Title::Genres
1::ToyStory(1995)::Animation|Children's|Comedy
</code></pre>
<p>Ini berarti id filmnya adalah 1, dan judulnya adalah 《Toy Story》, yang dibagi menjadi tiga kategori. Ketiga kategori ini adalah animasi, anak-anak, dan komedi.</p>
<p>users.dat berisi fitur-fitur pengguna, lihat contoh di bawah ini:</p>
<pre><code translate="no">UserID::Gender::Age::Occupation::Zip-code
1::F::1::10::48067
</code></pre>
<p>Ini berarti ID pengguna adalah 1, perempuan, dan berusia kurang dari 18 tahun. ID pekerjaannya adalah 10.</p>
<p>ratings.dat berisi fitur rating film, lihat contoh di bawah ini:</p>
<p>UserID::MovieID::Rating::Timestamp 1::1193::5::978300760</p>
<p>Artinya, pengguna 1 mengevaluasi film 1193 sebagai 5 poin.</p>
<h2 id="Fusion-Recommendation-Model" class="common-anchor-header">Model Rekomendasi Fusion<button data-href="#Fusion-Recommendation-Model" class="anchor-icon" translate="no">
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
    </button></h2><p>Dalam sistem rekomendasi film yang dipersonalisasi, kami menggunakan Fusion Recommendation Model [3] yang telah diimplementasikan oleh PaddlePaddle. Model ini dibuat dari praktik industrinya.</p>
<p>Pertama, ambil fitur pengguna dan fitur film sebagai input ke jaringan saraf, di mana:</p>
<ul>
<li>Fitur pengguna menggabungkan empat informasi atribut: ID pengguna, jenis kelamin, pekerjaan, dan usia.</li>
<li>Fitur film memasukkan tiga informasi atribut: ID film, ID jenis film, dan nama film.</li>
</ul>
<p>Untuk fitur pengguna, petakan ID pengguna ke representasi vektor dengan ukuran dimensi 256, masukkan lapisan yang terhubung penuh, dan lakukan pemrosesan serupa untuk tiga atribut lainnya. Kemudian representasi fitur dari keempat atribut tersebut terhubung sepenuhnya dan ditambahkan secara terpisah.</p>
<p>Untuk fitur film, ID film diproses dengan cara yang mirip dengan ID pengguna. ID jenis film secara langsung dimasukkan ke dalam lapisan yang terhubung penuh dalam bentuk vektor, dan nama film diwakili oleh vektor dengan panjang tetap menggunakan jaringan syaraf tiruan. Representasi fitur dari ketiga atribut tersebut kemudian dihubungkan sepenuhnya dan ditambahkan secara terpisah.</p>
<p>Setelah mendapatkan representasi vektor dari pengguna dan film, hitung kemiripan kosinus dari keduanya sebagai skor dari sistem rekomendasi yang dipersonalisasi. Terakhir, kuadrat dari perbedaan antara skor kemiripan dan skor sebenarnya dari pengguna digunakan sebagai fungsi kerugian dari model regresi.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_user_film_personalized_recommender_Milvus_9ec39f501d.jpg" alt="1-user-film-personalized-recommender-Milvus.jpg" class="doc-image" id="1-user-film-personalized-recommender-milvus.jpg" />
   </span> <span class="img-wrapper"> <span>1-pengguna-film-personalisasi-pemberi-rekomendasi-Milvus.jpg</span> </span></p>
<h2 id="System-Overview" class="common-anchor-header">Gambaran Umum Sistem<button data-href="#System-Overview" class="anchor-icon" translate="no">
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
    </button></h2><p>Dikombinasikan dengan model rekomendasi fusi PaddlePaddle, vektor fitur film yang dihasilkan oleh model disimpan di mesin pencari kesamaan vektor Milvus, dan fitur pengguna digunakan sebagai vektor target untuk dicari. Pencarian kemiripan dilakukan di Milvus untuk mendapatkan hasil pencarian sebagai film yang direkomendasikan untuk pengguna.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_system_overview_5652afdca7.jpg" alt="2-system-overview.jpg" class="doc-image" id="2-system-overview.jpg" />
   </span> <span class="img-wrapper"> <span>2-sistem-overview.jpg</span> </span></p>
<blockquote>
<p>Metode inner product (IP) disediakan dalam Milvus untuk menghitung jarak vektor. Setelah menormalkan data, inner product similarity konsisten dengan hasil cosine similarity pada model rekomendasi fusion.</p>
</blockquote>
<h2 id="Application-of-Personal-Recommender-System" class="common-anchor-header">Penerapan Sistem Rekomendasi Pribadi<button data-href="#Application-of-Personal-Recommender-System" class="anchor-icon" translate="no">
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
    </button></h2><p>Ada tiga langkah dalam membangun sistem rekomendasi personal dengan Milvus, detail cara pengoperasiannya dapat dilihat di Mivus Bootcamp [4].</p>
<h3 id="Step-1Model-Training" class="common-anchor-header">Langkah 1: Pelatihan Model</h3><pre><code translate="no"># run train.py
    $ python train.py
</code></pre>
<p>Menjalankan perintah ini akan menghasilkan model recommender_system.inference.model dalam direktori, yang dapat mengubah data film dan data pengguna menjadi vektor fitur, dan menghasilkan data aplikasi untuk disimpan dan diambil oleh Milvus.</p>
<h3 id="Step-2Data-Preprocessing" class="common-anchor-header">Langkah 2: Pemrosesan Data</h3><pre><code translate="no"># Data preprocessing, -f followed by the parameter raw movie data file name
    $ python get_movies_data.py -f movies_origin.txt
</code></pre>
<p>Menjalankan perintah ini akan menghasilkan data uji movies_data.txt dalam direktori untuk mencapai pra-pemrosesan data film.</p>
<h3 id="Step-3Implementing-Personal-Recommender-System-with-Milvus" class="common-anchor-header">Langkah 3：Menerapkan Sistem Rekomendasi Pribadi dengan Milvus</h3><pre><code translate="no"># Implementing personal recommender system based on user conditions
    $ python infer_milvus.py -a &lt;age&gt;-g &lt;gender&gt;-j &lt;job&gt;[-i]
</code></pre>
<p>Menjalankan perintah ini akan mengimplementasikan rekomendasi yang dipersonalisasi untuk pengguna tertentu.</p>
<p>Proses utamanya adalah:</p>
<ul>
<li>Melalui load_inference_model, data film diproses oleh model untuk menghasilkan vektor fitur film.</li>
<li>Muat vektor fitur film ke dalam Milvus melalui milvus.insert.</li>
<li>Menurut usia / jenis kelamin / pekerjaan pengguna yang ditentukan oleh parameter, diubah menjadi vektor fitur pengguna, milvus.search_vectors digunakan untuk pencarian kemiripan, dan hasil dengan kemiripan tertinggi antara pengguna dan film dikembalikan.</li>
</ul>
<p>Prediksi lima film teratas yang diminati pengguna:</p>
<pre><code translate="no">TopIdsTitleScore
03030Yojimbo2.9444923996925354
13871Shane2.8583481907844543
23467Hud2.849525213241577
31809Hana-bi2.826111316680908
43184Montana2.8119677305221558 
</code></pre>
<h2 id="Summary" class="common-anchor-header">Ringkasan<button data-href="#Summary" class="anchor-icon" translate="no">
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
    </button></h2><p>Dengan memasukkan informasi pengguna dan informasi film ke dalam model rekomendasi fusi, kita bisa mendapatkan skor yang cocok, lalu mengurutkan skor semua film berdasarkan pengguna untuk merekomendasikan film yang mungkin menarik bagi pengguna. <strong>Artikel ini menggabungkan Milvus dan PaddlePaddle untuk membangun sistem rekomendasi yang dipersonalisasi. Milvus, sebuah mesin pencari vektor, digunakan untuk menyimpan semua data fitur film, dan kemudian pencarian kemiripan dilakukan pada fitur-fitur pengguna di Milvus.</strong> Hasil pencarian adalah peringkat film yang direkomendasikan oleh sistem kepada pengguna.</p>
<p>Mesin pencari kemiripan vektor Milvus [5] kompatibel dengan berbagai platform deep learning, yang dapat mencari miliaran vektor hanya dengan respon milidetik. Anda dapat menjelajahi lebih banyak kemungkinan aplikasi AI dengan Milvus dengan mudah!</p>
<h2 id="Reference" class="common-anchor-header">Referensi<button data-href="#Reference" class="anchor-icon" translate="no">
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
    </button></h2><ol>
<li>MovieLens Million Dataset (ml-1m): http://files.grouplens.org/datasets/movielens/ml-1m.zip</li>
<li>ml-1m-README: http://files.grouplens.org/datasets/movielens/ml-1m-README.txt</li>
<li>Model Rekomendasi Fusion oleh PaddlePaddle: https://www.paddlepaddle.org.cn/documentation/docs/zh/beginners_guide/basics/recommender_system/index.html#id7</li>
<li>Bootcamp: https://github.com/milvus-io/bootcamp/tree/master/solutions/recommendation_system</li>
<li>Milvus: https://milvus.io/</li>
</ol>
