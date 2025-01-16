---
id: introducing-milvus-lite-lightweight-version-of-milvus.md
title: 'Memperkenalkan Milvus Lite: Versi Ringan dari Milvus'
author: Fendy Feng
date: 2023-05-23T00:00:00.000Z
desc: >-
  Rasakan kecepatan dan efisiensi Milvus Lite, varian ringan dari basis data
  vektor Milvus yang terkenal untuk pencarian kemiripan secepat kilat.
cover: assets.zilliz.com/introducing_Milvus_Lite_7c0d0a1174.jpeg
tag: News
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Vector Management
recommend: true
canonicalUrl: >-
  https://milvus.io/blog/introducing-milvus-lite-lightweight-version-of-milvus.md
---
<p><strong><em>Catatan Penting</em></strong></p>
<p><em>Kami meningkatkan Milvus Lite pada bulan Juni 2024, memungkinkan pengembang AI untuk membangun aplikasi lebih cepat sekaligus memastikan pengalaman yang konsisten di berbagai opsi penerapan, termasuk Milvus di Kurbernetes, Docker, dan layanan cloud terkelola. Milvus Lite juga terintegrasi dengan berbagai kerangka kerja dan teknologi AI, menyederhanakan pengembangan aplikasi AI dengan kemampuan pencarian vektor. Untuk informasi lebih lanjut, lihat referensi berikut:</em></p>
<ul>
<li><p><em>Blog peluncuran Milvus Lite: h<a href="https://milvus.io/blog/introducing-milvus-lite.md">ttps://</a>milvus.io/blog/introducing-milvus-lite.md</em></p></li>
<li><p><em>Dokumentasi Milvus Lite: <a href="https://milvus.io/docs/quickstart.md">https://milvus.io/docs/quickstart.md</a></em></p></li>
<li><p><em>Repositori GitHub Milvus Lite: <a href="https://github.com/milvus-io/milvus-lite">https://github.com/milvus-io/milvus-lite</a></em></p></li>
</ul>
<p><br></p>
<p><a href="https://github.com/milvus-io/milvus">Milvus</a> adalah basis data vektor sumber terbuka yang dibuat khusus untuk mengindeks, menyimpan, dan meminta vektor penyematan yang dihasilkan oleh jaringan syaraf tiruan dan model pembelajaran mesin (ML) lainnya pada skala miliaran. Ini telah menjadi pilihan populer bagi banyak perusahaan, peneliti, dan pengembang yang harus melakukan pencarian kemiripan pada set data berskala besar.</p>
<p>Namun, beberapa pengguna mungkin menganggap versi lengkap Milvus terlalu berat atau rumit. Untuk mengatasi masalah ini, <a href="https://github.com/matrixji">Bin Ji</a>, salah satu kontributor paling aktif dalam komunitas Milvus, membangun Milvus <a href="https://github.com/milvus-io/milvus-lite">Lite</a>, versi ringan dari Milvus.</p>
<h2 id="What-is-Milvus-Lite" class="common-anchor-header">Apa itu Milvus Lite?<button data-href="#What-is-Milvus-Lite" class="anchor-icon" translate="no">
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
    </button></h2><p>Seperti yang telah disebutkan sebelumnya, <a href="https://github.com/milvus-io/milvus-lite">Milvus Lite</a> adalah alternatif yang disederhanakan dari Milvus yang menawarkan banyak keuntungan dan manfaat.</p>
<ul>
<li>Anda dapat mengintegrasikannya ke dalam aplikasi Python Anda tanpa menambah beban tambahan.</li>
<li>Milvus Lite bersifat mandiri dan tidak memerlukan ketergantungan lain, berkat kemampuan Milvus yang mandiri untuk bekerja dengan Etcd tertanam dan penyimpanan lokal.</li>
<li>Anda bisa mengimpornya sebagai pustaka Python dan menggunakannya sebagai server mandiri berbasis antarmuka baris perintah (CLI).</li>
<li>Ia bekerja dengan lancar dengan Google Colab dan Jupyter Notebook.</li>
<li>Anda dapat dengan aman memigrasikan pekerjaan Anda dan menulis kode ke instance Milvus lainnya (versi mandiri, terkluster, dan terkelola penuh) tanpa risiko kehilangan data.</li>
</ul>
<h2 id="When-should-you-use-Milvus-Lite" class="common-anchor-header">Kapan Anda harus menggunakan Milvus Lite?<button data-href="#When-should-you-use-Milvus-Lite" class="anchor-icon" translate="no">
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
    </button></h2><p>Secara khusus, Milvus Lite sangat membantu dalam situasi berikut:</p>
<ul>
<li>Ketika Anda lebih suka menggunakan Milvus tanpa teknik dan alat kontainer seperti <a href="https://milvus.io/docs/install_standalone-operator.md">Milvus Operator</a>, <a href="https://milvus.io/docs/install_standalone-helm.md">Helm</a>, atau <a href="https://milvus.io/docs/install_standalone-docker.md">Docker Compose</a>.</li>
<li>Ketika Anda tidak membutuhkan mesin virtual atau kontainer untuk menggunakan Milvus.</li>
<li>Ketika Anda ingin memasukkan fitur-fitur Milvus ke dalam aplikasi Python Anda.</li>
<li>Ketika Anda ingin menjalankan instans Milvus di Colab atau Notebook untuk eksperimen cepat.</li>
</ul>
<p><strong>Catatan</strong>: Kami tidak menyarankan penggunaan Milvus Lite di lingkungan produksi atau jika Anda membutuhkan performa tinggi, ketersediaan yang kuat, atau skalabilitas yang tinggi. Sebagai gantinya, pertimbangkan untuk menggunakan <a href="https://github.com/milvus-io/milvus">cluster Milvus</a> atau <a href="https://zilliz.com/cloud">Milvus yang dikelola sepenuhnya di Zilliz Cloud</a> untuk produksi.</p>
<h2 id="How-to-get-started-with-Milvus-Lite" class="common-anchor-header">Bagaimana cara memulai dengan Milvus Lite?<button data-href="#How-to-get-started-with-Milvus-Lite" class="anchor-icon" translate="no">
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
    </button></h2><p>Sekarang, mari kita lihat cara menginstal, mengonfigurasi, dan menggunakan Milvus Lite.</p>
<h3 id="Prerequisites" class="common-anchor-header">Prasyarat</h3><p>Untuk menggunakan Milvus Lite, pastikan Anda telah menyelesaikan persyaratan berikut ini:</p>
<ul>
<li>Menginstal Python 3.7 atau versi yang lebih baru.</li>
<li>Menggunakan salah satu sistem operasi terverifikasi yang tercantum di bawah ini:<ul>
<li>Ubuntu &gt;= 18.04 (x86_64)</li>
<li>CentOS &gt;= 7.0 (x86_64)</li>
<li>MacOS &gt;= 11.0 (Apple Silicon)</li>
</ul></li>
</ul>
<p><strong>Catatan</strong>:</p>
<ol>
<li>Milvus Lite menggunakan <code translate="no">manylinux2014</code> sebagai citra dasar, membuatnya kompatibel dengan sebagian besar distribusi Linux untuk pengguna Linux.</li>
<li>Menjalankan Milvus Lite di Windows juga dimungkinkan, meskipun hal ini belum sepenuhnya diverifikasi.</li>
</ol>
<h3 id="Install-Milvus-Lite" class="common-anchor-header">Menginstal Milvus Lite</h3><p>Milvus Lite tersedia di PyPI sehingga Anda dapat menginstalnya melalui <code translate="no">pip</code>.</p>
<pre><code translate="no">$ python3 -m pip install milvus
<button class="copy-code-btn"></button></code></pre>
<p>Anda juga dapat menginstalnya dengan PyMilvus sebagai berikut:</p>
<pre><code translate="no">$ python3 -m pip install milvus[client]
<button class="copy-code-btn"></button></code></pre>
<h3 id="Use-and-start-Milvus-Lite" class="common-anchor-header">Gunakan dan jalankan Milvus Lite</h3><p>Unduh <a href="https://github.com/milvus-io/milvus-lite/tree/main/examples">buku catatan contoh</a> dari folder contoh repositori proyek kami. Anda memiliki dua pilihan untuk menggunakan Milvus Lite: mengimpornya sebagai pustaka Python atau menjalankannya sebagai server mandiri pada mesin Anda menggunakan CLI.</p>
<ul>
<li>Untuk menjalankan Milvus Lite sebagai modul Python, jalankan perintah berikut:</li>
</ul>
<pre><code translate="no"><span class="hljs-keyword">from</span> milvus <span class="hljs-keyword">import</span> default_server
<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> connections, utility

<span class="hljs-comment"># Start your milvus server</span>
default_server.start()

<span class="hljs-comment"># Now you can connect with localhost and the given port</span>
<span class="hljs-comment"># Port is defined by default_server.listen_port</span>
connections.connect(host=<span class="hljs-string">&#x27;127.0.0.1&#x27;</span>, port=default_server.listen_port)

<span class="hljs-comment"># Check if the server is ready.</span>
<span class="hljs-built_in">print</span>(utility.get_server_version())

<span class="hljs-comment"># Stop your milvus server</span>
default_server.stop()
<button class="copy-code-btn"></button></code></pre>
<ul>
<li>Untuk menangguhkan atau menghentikan Milvus Lite, gunakan pernyataan <code translate="no">with</code>.</li>
</ul>
<pre><code translate="no"><span class="hljs-keyword">from</span> milvus <span class="hljs-keyword">import</span> default_server

<span class="hljs-keyword">with</span> default_server:
  <span class="hljs-comment"># Milvus Lite has already started, use default_server here.</span>
  connections.connect(host=<span class="hljs-string">&#x27;127.0.0.1&#x27;</span>, port=default_server.listen_port)
<button class="copy-code-btn"></button></code></pre>
<ul>
<li>Untuk memulai Milvus Lite sebagai server mandiri berbasis CLI, jalankan perintah berikut:</li>
</ul>
<pre><code translate="no">milvus-server
<button class="copy-code-btn"></button></code></pre>
<p>Setelah Anda menjalankan Milvus Lite, Anda dapat menggunakan PyMilvus atau alat lain yang Anda sukai untuk terhubung ke server mandiri.</p>
<h3 id="Start-Milvus-Lite-in-a-debug-mode" class="common-anchor-header">Memulai Milvus Lite dalam mode debug</h3><ul>
<li>Untuk menjalankan Milvus Lite dalam mode debug sebagai Modul Python, jalankan perintah berikut:</li>
</ul>
<pre><code translate="no"><span class="hljs-keyword">from</span> milvus <span class="hljs-keyword">import</span> debug_server, MilvusServer

debug_server.run()

<span class="hljs-comment"># Or you can create a MilvusServer by yourself</span>
<span class="hljs-comment"># server = MilvusServer(debug=True)</span>
<button class="copy-code-btn"></button></code></pre>
<ul>
<li>Untuk menjalankan server mandiri dalam mode debug, jalankan perintah berikut:</li>
</ul>
<pre><code translate="no">milvus-server --debug
<button class="copy-code-btn"></button></code></pre>
<h3 id="Persist-data-and-logs" class="common-anchor-header">Menyimpan data dan log</h3><ul>
<li>Untuk membuat direktori lokal untuk Milvus Lite yang akan berisi semua data dan log yang relevan, jalankan perintah berikut:</li>
</ul>
<pre><code translate="no"><span class="hljs-keyword">from</span> milvus <span class="hljs-keyword">import</span> default_server

<span class="hljs-keyword">with</span> <span class="hljs-attr">default_server</span>:
  default_server.<span class="hljs-title function_">set_base_dir</span>(<span class="hljs-string">&#x27;milvus_data&#x27;</span>)
<button class="copy-code-btn"></button></code></pre>
<ul>
<li>Untuk menyimpan semua data dan log yang dihasilkan oleh server mandiri pada drive lokal Anda, jalankan perintah berikut:</li>
</ul>
<pre><code translate="no">$ milvus-server --data milvus_data
<button class="copy-code-btn"></button></code></pre>
<h3 id="Configure-Milvus-Lite" class="common-anchor-header">Mengkonfigurasi Milvus Lite</h3><p>Mengkonfigurasi Milvus Lite mirip dengan menyiapkan instans Milvus menggunakan API Python atau CLI.</p>
<ul>
<li>Untuk mengonfigurasi Milvus Lite menggunakan API Python, gunakan API <code translate="no">config.set</code> dari instans <code translate="no">MilvusServer</code> untuk pengaturan dasar dan ekstra:</li>
</ul>
<pre><code translate="no"><span class="hljs-keyword">from</span> milvus <span class="hljs-keyword">import</span> default_server

<span class="hljs-keyword">with</span> default_server:
  default_server.config.<span class="hljs-built_in">set</span>(<span class="hljs-string">&#x27;system_Log_level&#x27;</span>, <span class="hljs-string">&#x27;info&#x27;</span>)
  default_server.config.<span class="hljs-built_in">set</span>(<span class="hljs-string">&#x27;proxy_port&#x27;</span>, <span class="hljs-number">19531</span>)
  default_server.config.<span class="hljs-built_in">set</span>(<span class="hljs-string">&#x27;dataCoord.segment.maxSize&#x27;</span>, <span class="hljs-number">1024</span>)
<button class="copy-code-btn"></button></code></pre>
<ul>
<li>Untuk mengkonfigurasi Milvus Lite menggunakan CLI, jalankan perintah berikut untuk pengaturan dasar:</li>
</ul>
<pre><code translate="no">$ milvus-server --system-log-level info
$ milvus-server --proxy-port 19531
<button class="copy-code-btn"></button></code></pre>
<ul>
<li>Atau, jalankan perintah berikut untuk konfigurasi tambahan.</li>
</ul>
<pre><code translate="no">$ milvus-server --extra-config dataCoord.segment.maxSize=1024
<button class="copy-code-btn"></button></code></pre>
<p>Semua item yang dapat dikonfigurasi ada di template <code translate="no">config.yaml</code> yang disertakan dengan paket Milvus.</p>
<p>Untuk detail teknis lebih lanjut mengenai cara menginstal dan mengkonfigurasi Milvus Lite, lihat <a href="https://milvus.io/docs/milvus_lite.md#Prerequisites">dokumentasi</a> kami.</p>
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
    </button></h2><p>Milvus Lite adalah pilihan yang sangat baik bagi mereka yang mencari kemampuan Milvus dalam format yang ringkas. Apakah Anda seorang peneliti, pengembang, atau ilmuwan data, ada baiknya Anda menjelajahi opsi ini.</p>
<p>Milvus Lite juga merupakan tambahan yang indah untuk komunitas sumber terbuka, menampilkan karya luar biasa dari para kontributornya. Berkat upaya Bin Ji, Milvus sekarang tersedia untuk lebih banyak pengguna. Kami tidak sabar untuk melihat ide-ide inovatif yang akan dihasilkan oleh Bin Ji dan anggota komunitas Milvus lainnya di masa depan.</p>
<h2 id="Let’s-keep-in-touch" class="common-anchor-header">Mari kita tetap berhubungan!<button data-href="#Let’s-keep-in-touch" class="anchor-icon" translate="no">
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
    </button></h2><p>Jika Anda mengalami masalah dalam menginstal atau menggunakan Milvus Lite, Anda dapat <a href="https://github.com/milvus-io/milvus-lite/issues/new">mengajukan masalah di sini</a> atau menghubungi kami melalui <a href="https://twitter.com/milvusio">Twitter</a> atau <a href="https://www.linkedin.com/company/the-milvus-project">LinkedIn</a>. Anda juga dapat bergabung dengan <a href="https://milvus.io/slack/">saluran Slack</a> untuk mengobrol dengan para teknisi kami dan seluruh komunitas, atau lihat <a href="https://us02web.zoom.us/meeting/register/tZ0pcO6vrzsuEtVAuGTpNdb6lGnsPBzGfQ1T#/registration">jam kerja kami di hari Selasa</a>!</p>
