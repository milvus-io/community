---
id: building-video-search-system-with-milvus.md
title: Gambaran umum sistem
author: milvus
date: 2020-08-29T00:18:19.703Z
desc: Mencari video berdasarkan gambar dengan Milvus
cover: assets.zilliz.com/header_3a822736b3.gif
tag: Scenarios
canonicalUrl: 'https://zilliz.com/blog/building-video-search-system-with-milvus'
---
<custom-h1>4 Langkah untuk Membangun Sistem Pencarian Video</custom-h1><p>Seperti namanya, mencari video berdasarkan gambar adalah proses mengambil video dari repositori yang berisi bingkai yang mirip dengan gambar input. Salah satu langkah kuncinya adalah mengubah video menjadi embeddings, dengan kata lain, mengekstrak frame-frame kunci dan mengubah fitur-fiturnya menjadi vektor. Sekarang, sebagian pembaca yang penasaran, mungkin bertanya-tanya, apa perbedaan antara mencari video berdasarkan gambar dan mencari gambar berdasarkan gambar? Sebenarnya, mencari frame kunci dalam video sama saja dengan mencari gambar per gambar.</p>
<p>Anda dapat merujuk ke artikel kami sebelumnya <a href="https://medium.com/unstructured-data-service/milvus-application-1-building-a-reverse-image-search-system-based-on-milvus-and-vgg-aed4788dd1ea">Milvus x VGG: Membangun Sistem Pencarian Gambar Berbasis Konten</a> jika Anda tertarik.</p>
<h2 id="System-overview" class="common-anchor-header">Gambaran umum sistem<button data-href="#System-overview" class="anchor-icon" translate="no">
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
    </button></h2><p>Diagram berikut ini mengilustrasikan alur kerja umum dari sistem pencarian video.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_video_search_system_workflow_c68d658b93.png" alt="1-video-search-system-workflow.png" class="doc-image" id="1-video-search-system-workflow.png" />
   </span> <span class="img-wrapper"> <span>1-aliran-kerja-sistem-pencarian-video.png</span> </span></p>
<p>Ketika mengimpor video, kami menggunakan pustaka OpenCV untuk memotong setiap video menjadi beberapa frame, mengekstrak vektor dari frame-frame kunci menggunakan model ekstraksi fitur gambar VGG, dan kemudian menyisipkan vektor yang telah diekstrak (embedding) ke dalam Milvus. Kami menggunakan Minio untuk menyimpan video asli dan Redis untuk menyimpan korelasi antara video dan vektor.</p>
<p>Ketika mencari video, kami menggunakan model VGG yang sama untuk mengubah gambar input menjadi vektor fitur dan memasukkannya ke dalam Milvus untuk menemukan vektor dengan kemiripan tertinggi. Kemudian, sistem mengambil video yang sesuai dari Minio pada antarmukanya sesuai dengan korelasi di Redis.</p>
<h2 id="Data-preparation" class="common-anchor-header">Persiapan data<button data-href="#Data-preparation" class="anchor-icon" translate="no">
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
    </button></h2><p>Pada artikel ini, kami menggunakan sekitar 100.000 berkas GIF dari Tumblr sebagai contoh dataset dalam membangun solusi end-to-end untuk mencari video. Anda dapat menggunakan repositori video Anda sendiri.</p>
<h2 id="Deployment" class="common-anchor-header">Penerapan<button data-href="#Deployment" class="anchor-icon" translate="no">
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
    </button></h2><p>Kode untuk membangun sistem pencarian video dalam artikel ini ada di GitHub.</p>
<h3 id="Step-1-Build-Docker-images" class="common-anchor-header">Langkah 1: Membangun citra Docker.</h3><p>Sistem pengambilan video memerlukan docker Milvus v0.7.1, docker Redis, docker Minio, docker antarmuka ujung depan, dan docker API ujung belakang. Anda perlu membangun docker antarmuka ujung depan dan docker API ujung belakang secara mandiri, sementara Anda dapat menarik tiga docker lainnya secara langsung dari Docker Hub.</p>
<pre><code translate="no"># Get the video search code
$ git clone -b 0.10.0 https://github.com/JackLCL/search-video-demo.git

# Build front-end interface docker and api docker images
$ cd search-video-demo &amp; make all
</code></pre>
<h2 id="Step-2-Configure-the-environment" class="common-anchor-header">Langkah 2: Konfigurasi lingkungan.<button data-href="#Step-2-Configure-the-environment" class="anchor-icon" translate="no">
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
    </button></h2><p>Di sini kita menggunakan docker-compose.yml untuk mengelola lima kontainer yang disebutkan di atas. Lihat tabel berikut untuk konfigurasi docker-compose.yml:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_configure_docker_compose_yml_a33329e5e9.png" alt="2-configure-docker-compose-yml.png" class="doc-image" id="2-configure-docker-compose-yml.png" />
   </span> <span class="img-wrapper"> <span>2-konfigurasi-docker-compose-yml.png</span> </span></p>
<p>Alamat IP 192.168.1.38 pada tabel di atas adalah alamat server yang digunakan untuk membangun sistem pengambilan video dalam artikel ini. Anda perlu memperbaruinya ke alamat server Anda.</p>
<p>Anda perlu membuat direktori penyimpanan secara manual untuk Milvus, Redis, dan Minio, lalu menambahkan jalur yang sesuai di docker-compose.yml. Dalam contoh ini, kita membuat direktori berikut:</p>
<pre><code translate="no">/mnt/redis/data /mnt/minio/data /mnt/milvus/db
</code></pre>
<p>Anda dapat mengonfigurasi Milvus, Redis, dan Minio di docker-compose.yml sebagai berikut:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_configure_milvus_redis_minio_docker_compose_yml_4a8104d53e.png" alt="3-configure-milvus-redis-minio-docker-compose-yml.png" class="doc-image" id="3-configure-milvus-redis-minio-docker-compose-yml.png" />
   </span> <span class="img-wrapper"> <span>3-konfigurasi-milvus-redis-minio-docker-compose-yml.png</span> </span></p>
<h2 id="Step-3-Start-the-system" class="common-anchor-header">Langkah 3: Mulai sistem.<button data-href="#Step-3-Start-the-system" class="anchor-icon" translate="no">
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
    </button></h2><p>Gunakan docker-compose.yml yang telah dimodifikasi untuk memulai lima kontainer docker yang akan digunakan dalam sistem pengambilan video:</p>
<pre><code translate="no">$ docker-compose up -d
</code></pre>
<p>Kemudian, Anda dapat menjalankan docker-compose ps untuk memeriksa apakah lima kontainer docker telah dimulai dengan benar. Tangkapan layar berikut ini menunjukkan antarmuka tipikal setelah pengaktifan berhasil.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/4_sucessful_setup_f2b3006487.png" alt="4-sucessful-setup.png" class="doc-image" id="4-sucessful-setup.png" />
   </span> <span class="img-wrapper"> <span>4-penyiapan-berhasil.png</span> </span></p>
<p>Sekarang, Anda telah berhasil membangun sistem pencarian video, meskipun basis data tidak memiliki video.</p>
<h2 id="Step-4-Import-videos" class="common-anchor-header">Langkah 4: Impor video.<button data-href="#Step-4-Import-videos" class="anchor-icon" translate="no">
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
    </button></h2><p>Di direktori deploy pada repositori sistem, terdapat import_data.py, skrip untuk mengimpor video. Anda hanya perlu memperbarui jalur ke berkas video dan interval pengimporan untuk menjalankan skrip.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/5_update_path_video_5065928961.png" alt="5-update-path-video.png" class="doc-image" id="5-update-path-video.png" />
   </span> <span class="img-wrapper"> <span>5-pembaruan-path-video.png</span> </span></p>
<p>data_path: Jalur ke video yang akan diimpor.</p>
<p>time.sleep(0.5): Interval waktu di mana sistem mengimpor video. Server yang kami gunakan untuk membangun sistem pencarian video memiliki 96 inti CPU. Oleh karena itu, disarankan untuk mengatur interval ke 0,5 detik. Atur interval ke nilai yang lebih besar jika server Anda memiliki lebih sedikit inti CPU. Jika tidak, proses pengimporan akan membebani CPU, dan menciptakan proses zombie.</p>
<p>Jalankan import_data.py untuk mengimpor video.</p>
<pre><code translate="no">$ cd deploy
$ python3 import_data.py
</code></pre>
<p>Setelah video diimpor, Anda sudah siap dengan sistem pencarian video Anda sendiri!</p>
<h2 id="Interface-display" class="common-anchor-header">Tampilan antarmuka<button data-href="#Interface-display" class="anchor-icon" translate="no">
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
    </button></h2><p>Buka peramban Anda dan masukkan 192.168.1.38.8001 untuk melihat antarmuka sistem pencarian video seperti yang ditunjukkan di bawah ini.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/6_video_search_interface_4c26d93e02.png" alt="6-video-search-interface.png" class="doc-image" id="6-video-search-interface.png" />
   </span> <span class="img-wrapper"> <span>6-muka-pencarian-video.png</span> </span></p>
<p>Geser tombol roda gigi di kanan atas untuk melihat semua video dalam repositori.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/7_view_all_videos_repository_26ff37cad5.png" alt="7-view-all-videos-repository.png" class="doc-image" id="7-view-all-videos-repository.png" />
   </span> <span class="img-wrapper"> <span>7-lihat-semua-video-repositori.png</span> </span></p>
<p>Klik pada kotak unggah di kiri atas untuk memasukkan gambar target. Seperti yang ditunjukkan di bawah ini, sistem akan mengembalikan video yang berisi bingkai yang paling mirip.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/8_enjoy_recommender_system_cats_bda1bf9db3.png" alt="8-enjoy-recommender-system-cats.png" class="doc-image" id="8-enjoy-recommender-system-cats.png" />
   </span> <span class="img-wrapper"> <span>8-nikmati-sistem-pemberi-rekomendasi-kucing.png</span> </span></p>
<p>Selanjutnya, bersenang-senanglah dengan sistem pencarian video kami!</p>
<h2 id="Build-your-own" class="common-anchor-header">Buat sistem Anda sendiri<button data-href="#Build-your-own" class="anchor-icon" translate="no">
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
    </button></h2><p>Dalam artikel ini, kami menggunakan Milvus untuk membangun sebuah sistem untuk mencari video berdasarkan gambar. Ini merupakan contoh penerapan Milvus dalam pemrosesan data yang tidak terstruktur.</p>
<p>Milvus kompatibel dengan berbagai kerangka kerja deep learning, dan memungkinkan pencarian dalam milidetik untuk vektor dalam skala miliaran. Jangan ragu untuk membawa Milvus bersama Anda ke lebih banyak skenario AI: https://github.com/milvus-io/milvus.</p>
<p>Jangan jadi orang asing, ikuti kami di <a href="https://twitter.com/milvusio/">Twitter</a> atau bergabunglah dengan kami di <a href="https://milvusio.slack.com/join/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ#/">Slack</a>! 👇🏻</p>
