---
id: 2021-12-03-why-to-choose-fastapi-over-flask.md
title: Mengapa Memilih FastAPI daripada Flask?
author: Yunmei
date: 2021-12-03T00:00:00.000Z
desc: pilih kerangka kerja yang sesuai dengan skenario aplikasi Anda
cover: assets.zilliz.com/1_d5de035def.png
tag: Engineering
isPublish: false
---
<p>Untuk membantu Anda memulai dengan cepat menggunakan Milvus, basis data vektor sumber terbuka, kami merilis proyek sumber terbuka terafiliasi lainnya, <a href="https://github.com/milvus-io/bootcamp">Milvus Bootcamp</a> di GitHub. Milvus Bootcamp tidak hanya menyediakan skrip dan data untuk tes benchmark, tetapi juga mencakup proyek yang menggunakan Milvus untuk membangun beberapa MVP (produk yang layak), seperti sistem pencarian gambar terbalik, sistem analisis video, chatbot QA, atau sistem pemberi rekomendasi. Anda dapat mempelajari cara menerapkan pencarian kemiripan vektor di dunia yang penuh dengan data yang tidak terstruktur dan mendapatkan pengalaman langsung di Milvus Bootcamp.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_5b60157b4d.png" alt="2.png" class="doc-image" id="2.png" />
   </span> <span class="img-wrapper"> <span>2.png</span> </span></p>
<p>Kami menyediakan layanan front-end dan back-end untuk proyek-proyek di Milvus Bootcamp. Namun, baru-baru ini kami telah membuat keputusan untuk mengubah kerangka kerja web yang diadopsi dari Flask ke FastAPI.</p>
<p>Artikel ini bertujuan untuk menjelaskan motivasi kami di balik perubahan kerangka kerja web yang diadopsi untuk Milvus Bootcamp dengan mengklarifikasi mengapa kami memilih FastAPI daripada Flask.</p>
<h2 id="Web-frameworks-for-Python" class="common-anchor-header">Kerangka kerja web untuk Python<button data-href="#Web-frameworks-for-Python" class="anchor-icon" translate="no">
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
    </button></h2><p>Kerangka kerja web mengacu pada kumpulan paket atau modul. Ini adalah seperangkat arsitektur perangkat lunak untuk pengembangan web yang memungkinkan Anda untuk menulis aplikasi atau layanan web dan menyelamatkan Anda dari kesulitan menangani detail tingkat rendah seperti protokol, soket, atau manajemen proses / thread. Menggunakan web framework dapat secara signifikan mengurangi beban kerja dalam mengembangkan aplikasi web karena Anda cukup "menyambungkan" kode Anda ke dalam framework, tanpa perlu perhatian ekstra saat berurusan dengan cache data, akses database, dan verifikasi keamanan data. Untuk informasi lebih lanjut tentang apa itu kerangka kerja web untuk Python, lihat <a href="https://wiki.python.org/moin/WebFrameworks">Kerangka Kerja Web</a>.</p>
<p>Ada berbagai jenis kerangka kerja web Python. Yang paling umum adalah Django, Flask, Tornado, dan FastAPI.</p>
<h3 id="Flask" class="common-anchor-header">Flask</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_1abd170939.png" alt="3.png" class="doc-image" id="3.png" />
   </span> <span class="img-wrapper"> <span>3.png</span> </span></p>
<p><a href="https://flask.palletsprojects.com/en/2.0.x/">Flask</a> adalah kerangka kerja mikro ringan yang dirancang untuk Python, dengan inti yang sederhana dan mudah digunakan yang memungkinkan Anda untuk mengembangkan aplikasi web Anda sendiri. Selain itu, inti Flask juga dapat dikembangkan. Oleh karena itu, Flask mendukung ekstensi sesuai permintaan dari berbagai fungsi yang berbeda untuk memenuhi kebutuhan pribadi Anda selama pengembangan aplikasi web. Dengan kata lain, dengan pustaka berbagai plug-in di Flask, Anda dapat mengembangkan situs web yang kuat.</p>
<p>Flask memiliki karakteristik sebagai berikut:</p>
<ol>
<li>Flask adalah sebuah kerangka kerja mikro yang tidak bergantung pada alat atau komponen spesifik lainnya dari pustaka pihak ketiga untuk menyediakan fungsionalitas bersama. Flask tidak memiliki lapisan abstraksi basis data, dan tidak memerlukan validasi formulir. Namun, Flask sangat mudah dikembangkan dan mendukung penambahan fungsionalitas aplikasi dengan cara yang mirip dengan implementasi di dalam Flask itu sendiri. Ekstensi yang relevan termasuk pemetaan objek-relasional, validasi formulir, pemrosesan unggahan, teknologi otentikasi terbuka, dan beberapa alat umum yang dirancang untuk kerangka kerja web.</li>
<li>Flask adalah sebuah kerangka kerja aplikasi web yang berbasis <a href="https://wsgi.readthedocs.io/">WSGI</a> (Web Server Gateway Interface). WSGI adalah antarmuka sederhana yang menghubungkan server web dengan aplikasi web atau kerangka kerja yang didefinisikan untuk bahasa Python.</li>
<li>Flask memiliki dua pustaka fungsi inti, yaitu <a href="https://www.palletsprojects.com/p/werkzeug">Werkzeug</a> dan <a href="https://www.palletsprojects.com/p/jinja">Jinja2</a>. Werkzeug adalah toolkit WSGI yang mengimplementasikan permintaan, objek respons, dan fungsi praktis, yang memungkinkan Anda untuk membangun kerangka kerja web di atasnya. Jinja2 adalah mesin templating berfitur lengkap yang populer untuk Python. Jinja2 memiliki dukungan penuh untuk Unicode, dengan lingkungan eksekusi sandbox terintegrasi yang opsional tetapi diadopsi secara luas.</li>
</ol>
<h3 id="FastAPI" class="common-anchor-header">FastAPI</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/4_05cb0dac4e.png" alt="4.png" class="doc-image" id="4.png" />
   </span> <span class="img-wrapper"> <span>4.png</span> </span></p>
<p><a href="https://fastapi.tiangolo.com/">FastAPI</a> adalah kerangka kerja aplikasi web Python modern yang memiliki tingkat kinerja tinggi yang sama dengan Go dan NodeJS. Inti dari FastAPI didasarkan pada <a href="https://www.starlette.io/">Starlette</a> dan <a href="https://pydantic-docs.helpmanual.io/">Pydantic</a>. Starlette adalah toolkit kerangka kerja <a href="https://asgi.readthedocs.io/">ASGI</a>(Asynchronous Server Gateway Interface) yang ringan untuk membangun layanan <a href="https://docs.python.org/3/library/asyncio.html">Asyncio</a> berkinerja tinggi. Pydantic adalah sebuah pustaka yang mendefinisikan validasi data, serialisasi, dan dokumentasi berdasarkan petunjuk tipe Python.</p>
<p>FastAPI memiliki karakteristik sebagai berikut:</p>
<ol>
<li>FastAPI adalah kerangka kerja aplikasi web berdasarkan ASGI, antarmuka protokol gateway asinkron yang menghubungkan layanan protokol jaringan dan aplikasi Python. FastAPI dapat menangani berbagai jenis protokol umum, termasuk HTTP, HTTP2, dan WebSocket.</li>
<li>FastAPI didasarkan pada Pydantic, yang menyediakan fungsi untuk memeriksa tipe data antarmuka. Anda tidak perlu memverifikasi parameter antarmuka Anda, atau menulis kode tambahan untuk memverifikasi apakah parameternya kosong atau apakah tipe datanya benar. Menggunakan FastAPI secara efektif dapat menghindari kesalahan manusia dalam kode dan meningkatkan efisiensi pengembangan.</li>
<li>FastAPI mendukung dokumen dalam dua format - <a href="https://swagger.io/specification/">OpenAPI</a> (sebelumnya Swagger) dan <a href="https://www.redoc.com/">Redoc</a>. Oleh karena itu, sebagai pengguna Anda tidak perlu menghabiskan waktu ekstra untuk menulis dokumen antarmuka tambahan. Dokumen OpenAPI yang disediakan oleh FastAPI ditunjukkan pada gambar di bawah ini.</li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/5_d91d34cb0f.png" alt="5.png" class="doc-image" id="5.png" />
   </span> <span class="img-wrapper"> <span>5.png</span> </span></p>
<h3 id="Flask-Vs-FastAPI" class="common-anchor-header">Flask Vs. FastAPI</h3><p>Tabel di bawah ini menunjukkan perbedaan antara Flask dan FastAPI dalam beberapa aspek.</p>
<table>
<thead>
<tr><th></th><th><strong>FastAPI</strong></th><th><strong>Flask</strong></th></tr>
</thead>
<tbody>
<tr><td><strong>Gerbang antarmuka</strong></td><td>ASGI</td><td>WSGI</td></tr>
<tr><td><strong>Kerangka kerja asinkron</strong></td><td>✅</td><td>❌</td></tr>
<tr><td><strong>Kinerja</strong></td><td>Lebih cepat</td><td>Lebih lambat</td></tr>
<tr><td><strong>Dokumen interaktif</strong></td><td>OpenAPI, Redoc</td><td>Tidak ada</td></tr>
<tr><td><strong>Verifikasi data</strong></td><td>✅</td><td>❌</td></tr>
<tr><td><strong>Biaya pengembangan</strong></td><td>Lebih rendah</td><td>Lebih tinggi</td></tr>
<tr><td><strong>Kemudahan penggunaan</strong></td><td>Lebih rendah</td><td>Lebih tinggi</td></tr>
<tr><td><strong>Fleksibilitas</strong></td><td>Kurang fleksibel</td><td>Lebih fleksibel</td></tr>
<tr><td><strong>Komunitas</strong></td><td>Lebih kecil</td><td>Lebih aktif</td></tr>
</tbody>
</table>
<h2 id="Why-FastAPI" class="common-anchor-header">Mengapa FastAPI?<button data-href="#Why-FastAPI" class="anchor-icon" translate="no">
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
    </button></h2><p>Sebelum memutuskan kerangka kerja aplikasi web Python mana yang akan dipilih untuk proyek-proyek di Milvus Bootcamp, kami melakukan penelitian terhadap beberapa kerangka kerja utama termasuk Django, Flask, FastAPI, Tornado, dan banyak lagi. Karena proyek-proyek di Milvus Bootcamp berfungsi sebagai referensi untuk Anda, prioritas kami adalah mengadopsi kerangka kerja eksternal yang paling ringan dan cekatan. Berdasarkan aturan ini, kami mempersempit pilihan kami ke Flask dan FastAPI.</p>
<p>Anda dapat melihat perbandingan antara kedua kerangka kerja web tersebut di bagian sebelumnya. Berikut ini adalah penjelasan rinci tentang motivasi kami untuk memilih FastAPI daripada Flask untuk proyek-proyek di Milvus Bootcamp. Ada beberapa alasan:</p>
<h3 id="1-Performance" class="common-anchor-header">1. Kinerja</h3><p>Sebagian besar proyek di Milvus Bootcamp dibangun di sekitar sistem pencarian gambar terbalik, chatbot QA, mesin pencari teks, yang semuanya memiliki tuntutan tinggi untuk pemrosesan data real-time. Oleh karena itu, kami membutuhkan kerangka kerja dengan kinerja yang luar biasa, yang merupakan sorotan utama FastAPI. Oleh karena itu, dari perspektif kinerja sistem, kami memutuskan untuk memilih FastAPI.</p>
<h3 id="2-Efficiency" class="common-anchor-header">2. Efisiensi</h3><p>Saat menggunakan Flask, Anda perlu menulis kode untuk verifikasi tipe data di setiap antarmuka sehingga sistem dapat menentukan apakah data input kosong atau tidak. Namun, dengan mendukung verifikasi tipe data otomatis, FastAPI membantu menghindari kesalahan manusia dalam pengkodean selama pengembangan sistem dan dapat sangat meningkatkan efisiensi pengembangan. Bootcamp diposisikan sebagai jenis sumber daya pelatihan. Ini berarti kode dan komponen yang kami gunakan harus intuitif dan sangat efisien. Dalam hal ini, kami memilih FastAPI untuk meningkatkan efisiensi sistem dan meningkatkan pengalaman pengguna.</p>
<h3 id="3-Asynchronous-framework" class="common-anchor-header">3. Kerangka kerja asinkron</h3><p>FastAPI pada dasarnya adalah kerangka kerja asinkron. Awalnya, kami merilis empat <a href="https://zilliz.com/milvus-demos?isZilliz=true">demo</a>, pencarian gambar terbalik, analisis video, chatbot QA, dan pencarian kemiripan molekuler. Dalam demo-demo ini, Anda dapat mengunggah dataset dan akan segera diberi tahu &quot;permintaan diterima&quot;. Dan ketika data diunggah ke sistem demo, Anda akan menerima pemberitahuan &quot;unggahan data berhasil&quot;. Ini adalah proses asinkron yang membutuhkan kerangka kerja yang mendukung fitur ini. FastAPI sendiri merupakan kerangka kerja asinkron. Untuk menyelaraskan semua sumber daya Milvus, kami memutuskan untuk mengadopsi satu set alat pengembangan dan perangkat lunak untuk Milvus Bootcamp dan demo Milvus. Sebagai hasilnya, kami mengubah kerangka kerja dari Flask ke FastAPI.</p>
<h3 id="4-Automatic-interactive-documents" class="common-anchor-header">4. Dokumen interaktif otomatis</h3><p>Dengan cara tradisional, ketika Anda selesai menulis kode untuk sisi server, Anda perlu menulis dokumen tambahan untuk membuat antarmuka, dan kemudian menggunakan alat seperti <a href="https://www.postman.com/">Postman</a> untuk pengujian dan debugging API. Jadi, bagaimana jika Anda hanya ingin segera memulai dengan bagian pengembangan sisi server web dari proyek-proyek di Milvus Bootcamp tanpa menulis kode tambahan untuk membuat antarmuka? FastAPI adalah solusinya. Dengan menyediakan dokumen OpenAPI, FastAPI dapat menyelamatkan Anda dari kesulitan menguji atau men-debug API dan berkolaborasi dengan tim front-end untuk mengembangkan antarmuka pengguna. Dengan FastAPI, Anda masih dapat dengan cepat mencoba aplikasi yang dibangun dengan antarmuka yang otomatis namun intuitif tanpa upaya ekstra untuk pengkodean.</p>
<h3 id="5-User-friendliness" class="common-anchor-header">5. Keramahan pengguna</h3><p>FastAPI lebih mudah digunakan dan dikembangkan, sehingga memungkinkan Anda untuk lebih memperhatikan implementasi spesifik dari proyek itu sendiri. Tanpa menghabiskan terlalu banyak waktu untuk mengembangkan kerangka kerja web, Anda dapat lebih fokus untuk memahami proyek-proyek di Milvus Bootcamp.</p>
<h2 id="Recap" class="common-anchor-header">Rekap<button data-href="#Recap" class="anchor-icon" translate="no">
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
    </button></h2><p>Flask dan FlastAPI memiliki kelebihan dan kekurangan masing-masing. Sebagai kerangka kerja aplikasi web yang sedang berkembang, FlastAPI, pada intinya, dibangun di atas toolkit dan perpustakaan yang sudah matang, Starlette dan Pydantic. FastAPI adalah kerangka kerja asinkron dengan kinerja tinggi. Ketangkasan, ekstensibilitas, dan dukungannya untuk verifikasi tipe data otomatis, bersama dengan banyak fitur canggih lainnya, mendorong kami untuk mengadopsi FastAPI sebagai kerangka kerja untuk proyek-proyek Milvus Bootcamp.</p>
<p>Harap dicatat bahwa Anda harus memilih kerangka kerja yang sesuai dengan skenario aplikasi Anda jika Anda ingin membangun sistem pencarian kemiripan vektor dalam produksi.</p>
<h2 id="About-the-author" class="common-anchor-header">Tentang penulis<button data-href="#About-the-author" class="anchor-icon" translate="no">
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
    </button></h2><p>Yunmei Li, Zilliz Data Engineer, lulus dari Universitas Sains dan Teknologi Huazhong dengan gelar di bidang ilmu komputer. Sejak bergabung dengan Zilliz, ia telah bekerja mengeksplorasi solusi untuk proyek open source Milvus dan membantu pengguna untuk menerapkan Milvus dalam skenario dunia nyata. Fokus utamanya adalah pada NLP dan sistem rekomendasi, dan ia ingin lebih memperdalam fokusnya di dua bidang ini. Dia suka menghabiskan waktu sendirian dan membaca.</p>
<h2 id="Looking-for-more-resources" class="common-anchor-header">Mencari lebih banyak sumber daya?<button data-href="#Looking-for-more-resources" class="anchor-icon" translate="no">
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
    </button></h2><ul>
<li><p>Mulailah membangun sistem AI dengan Milvus dan dapatkan lebih banyak pengalaman langsung dengan membaca tutorial kami!</p>
<ul>
<li><a href="https://milvus.io/blog/2021-10-10-milvus-helps-analys-vedios.md">Apa itu? Siapa Dia? Milvus Membantu Menganalisis Video dengan Cerdas</a></li>
<li><a href="https://milvus.io/blog/2021-09-26-onnx.md">Menggabungkan Model AI untuk Pencarian Gambar menggunakan ONNX dan Milvus</a></li>
<li><a href="https://milvus.io/blog/dna-sequence-classification-based-on-milvus.md">Klasifikasi Urutan DNA berdasarkan Milvus</a></li>
<li><a href="https://milvus.io/blog/audio-retrieval-based-on-milvus.md">Pengambilan Audio Berdasarkan Milvus</a></li>
<li><a href="https://milvus.io/blog/building-video-search-system-with-milvus.md">4 Langkah untuk Membangun Sistem Pencarian Video</a></li>
<li><a href="https://milvus.io/blog/building-intelligent-chatbot-with-nlp-and-milvus.md">Membangun Sistem QA Cerdas dengan NLP dan Milvus</a></li>
<li><a href="https://milvus.io/blog/molecular-structure-similarity-with-milvus.md">Mempercepat Penemuan Obat Baru</a></li>
</ul></li>
<li><p>Bergabunglah dengan komunitas sumber terbuka kami:</p>
<ul>
<li>Temukan atau kontribusikan Milvus di <a href="https://bit.ly/307b7jC">GitHub</a>.</li>
<li>Berinteraksi dengan komunitas melalui <a href="https://bit.ly/3qiyTEk">Forum</a>.</li>
<li>Terhubung dengan kami di <a href="https://bit.ly/3ob7kd8">Twitter</a>.</li>
</ul></li>
</ul>
