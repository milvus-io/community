---
id: embedded-milvus.md
title: >-
  Menggunakan Milvus Tertanam untuk Menginstal dan Menjalankan Milvus dengan
  Python Secara Instan
author: Alex Gao
date: 2022-08-15T00:00:00.000Z
desc: >-
  Versi Milvus yang ramah pengguna Python yang membuat instalasi lebih
  fleksibel.
cover: assets.zilliz.com/embeddded_milvus_1_8132468cac.png
tag: Engineering
tags: 'Vector Database for AI, Artificial Intelligence, Machine Learning'
canonicalUrl: 'https://milvus.io/blog/embedded-milvus.md'
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/embeddded_milvus_1_8132468cac.png" alt="Cover" class="doc-image" id="cover" />
   </span> <span class="img-wrapper"> <span>Sampul</span> </span></p>
<blockquote>
<p>Artikel ini ditulis oleh <a href="https://github.com/soothing-rain/">Alex Gao</a> dan <a href="https://www.linkedin.com/in/yiyun-n-2aa713163/">Angela Ni</a>.</p>
</blockquote>
<p>Milvus adalah basis data vektor sumber terbuka untuk aplikasi AI. Milvus menyediakan berbagai metode instalasi termasuk membangun dari kode sumber, dan menginstal Milvus dengan Docker Compose/Helm/APT/YUM/Ansible. Pengguna dapat memilih salah satu metode instalasi tergantung pada sistem operasi dan preferensi mereka. Namun, ada banyak ilmuwan data dan insinyur AI di komunitas Milvus yang bekerja dengan Python dan mendambakan metode instalasi yang jauh lebih sederhana daripada yang saat ini tersedia.</p>
<p>Oleh karena itu, kami merilis Milvus yang disematkan, versi Python yang mudah digunakan, bersama dengan Milvus 2.1 untuk memberdayakan lebih banyak pengembang Python di komunitas kami. Artikel ini memperkenalkan apa itu embedded Milvus dan memberikan instruksi tentang cara menginstal dan menggunakannya.</p>
<p><strong>Langsung ke:</strong></p>
<ul>
<li><a href="#An-overview-of-embedded-Milvus">Gambaran umum tentang Milvus tertanam</a><ul>
<li><a href="#When-to-use-embedded-Milvus">Kapan menggunakan Milvus yang disematkan?</a></li>
<li><a href="#A-comparison-of-different-modes-of-Milvus">Perbandingan berbagai mode Milvus yang berbeda</a></li>
</ul></li>
<li><a href="#How-to-install-embedded-Milvus">Cara memasang Milvus tertanam</a></li>
<li><a href="#Start-and-stop-embedded-Milvus">Memulai dan menghentikan Milvus tertanam</a></li>
</ul>
<h2 id="An-overview-of-embedded-Milvus" class="common-anchor-header">Gambaran umum tentang Milvus tertanam<button data-href="#An-overview-of-embedded-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://github.com/milvus-io/embd-milvus">Embedded Milvus</a> memungkinkan Anda untuk memasang dan menggunakan Milvus dengan Python dengan cepat. Ini dapat dengan cepat memunculkan instance Milvus dan memungkinkan Anda untuk memulai dan menghentikan layanan Milvus kapan pun Anda mau. Semua data dan log tetap tersimpan meskipun Anda menghentikan Milvus yang disematkan.</p>
<p>Embedded Milvus sendiri tidak memiliki ketergantungan internal dan tidak memerlukan pra-instalasi dan menjalankan ketergantungan pihak ketiga seperti etcd, MinIO, Pulsar, dll.</p>
<p>Semua yang Anda lakukan dengan Milvus tertanam, dan setiap bagian dari kode yang Anda tulis untuknya dapat dengan aman dimigrasikan ke mode Milvus lainnya - mandiri, cluster, versi cloud, dll. Hal ini mencerminkan salah satu fitur yang paling khas dari embedded Milvus - <strong>"Tulis sekali, jalankan di mana saja"</strong>.</p>
<h3 id="When-to-use-embedded-Milvus" class="common-anchor-header">Kapan menggunakan Milvus yang disematkan?</h3><p>Embedded Milvus dan <a href="https://milvus.io/docs/v2.1.x/install-pymilvus.md">PyMilvus</a> dibangun untuk tujuan yang berbeda. Anda dapat mempertimbangkan untuk memilih Milvus tertanam dalam skenario berikut:</p>
<ul>
<li><p>Anda ingin menggunakan Milvus tanpa menginstal Milvus dengan cara apa pun yang disediakan <a href="https://milvus.io/docs/v2.1.x/install_standalone-docker.md">di sini</a>.</p></li>
<li><p>Anda ingin menggunakan Milvus tanpa menyimpan proses Milvus yang sudah berjalan lama di mesin Anda.</p></li>
<li><p>Anda ingin menggunakan Milvus dengan cepat tanpa memulai proses Milvus yang terpisah dan komponen-komponen lain yang dibutuhkan seperti etcd, MinIO, Pulsar, dll.</p></li>
</ul>
<p>Disarankan agar Anda <strong>TIDAK</strong> menggunakan Milvus tertanam:</p>
<ul>
<li><p>Dalam lingkungan produksi.<em>(Untuk menggunakan Milvus untuk produksi, pertimbangkan Milvus cluster atau <a href="https://zilliz.com/cloud">Zilliz cloud</a>, layanan Milvus yang dikelola secara penuh</em>)<em>.</em></p></li>
<li><p>Jika Anda memiliki permintaan yang tinggi untuk kinerja.<em>(Secara komparatif, Milvus yang tertanam mungkin tidak memberikan kinerja terbaik</em>)<em>.</em></p></li>
</ul>
<h3 id="A-comparison-of-different-modes-of-Milvus" class="common-anchor-header">Perbandingan berbagai mode Milvus yang berbeda</h3><p>Tabel di bawah ini membandingkan beberapa mode Milvus: mandiri, cluster, Milvus tertanam, dan Zilliz Cloud, layanan Milvus yang dikelola sepenuhnya.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/comparison_ebcd7c5b07.jpeg" alt="comparison" class="doc-image" id="comparison" />
   </span> <span class="img-wrapper"> <span>perbandingan</span> </span></p>
<h2 id="How-to-install-embedded-Milvus" class="common-anchor-header">Bagaimana cara menginstal Milvus tertanam?<button data-href="#How-to-install-embedded-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Sebelum menginstal Milvus tertanam, Anda harus terlebih dahulu memastikan bahwa Anda telah menginstal Python 3.6 atau yang lebih baru. Embedded Milvus mendukung sistem operasi berikut ini:</p>
<ul>
<li><p>Ubuntu 18.04</p></li>
<li><p>Mac x86_64 &gt;= 10.4</p></li>
<li><p>Mac M1 &gt;= 11.0</p></li>
</ul>
<p>Jika persyaratan terpenuhi, Anda dapat menjalankan <code translate="no">$ python3 -m pip install milvus</code> untuk menginstal Milvus tertanam. Anda juga dapat menambahkan versi pada perintah untuk menginstal versi tertentu dari embedded Milvus. Sebagai contoh, jika Anda ingin menginstal versi 2.1.0, jalankan <code translate="no">$ python3 -m pip install milvus==2.1.0</code>. Dan nanti ketika versi baru Milvus tertanam dirilis, Anda juga dapat menjalankan <code translate="no">$ python3 -m pip install --upgrade milvus</code> untuk mengupgrade Milvus tertanam ke versi terbaru.</p>
<p>Jika Anda adalah pengguna lama Milvus yang telah menginstal PyMilvus sebelumnya dan ingin menginstal embedded Milvus, Anda dapat menjalankan <code translate="no">$ python3 -m pip install --no-deps milvus</code>.</p>
<p>Setelah menjalankan perintah instalasi, Anda perlu membuat folder data untuk embedded Milvus di bawah <code translate="no">/var/bin/e-milvus</code> dengan menjalankan perintah berikut:</p>
<pre><code translate="no"><span class="hljs-built_in">sudo</span> <span class="hljs-built_in">mkdir</span> -p /var/bin/e-milvus
<span class="hljs-built_in">sudo</span> <span class="hljs-built_in">chmod</span> -R 777 /var/bin/e-milvus
<button class="copy-code-btn"></button></code></pre>
<h2 id="Start-and-stop-embedded-Milvus" class="common-anchor-header">Memulai dan menghentikan Milvus tertanam<button data-href="#Start-and-stop-embedded-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Ketika instalasi berhasil, Anda dapat memulai layanan.</p>
<p>Jika Anda menjalankan Milvus tertanam untuk pertama kalinya, Anda perlu mengimpor Milvus dan mengatur Milvus tertanam terlebih dahulu.</p>
<pre><code translate="no">$ python3
Python 3.9.10 (main, Jan 15 2022, 11:40:53)
[Clang 13.0.0 (clang-1300.0.29.3)] on darwin
Type <span class="hljs-string">&quot;help&quot;</span>, <span class="hljs-string">&quot;copyright&quot;</span>, <span class="hljs-string">&quot;credits&quot;</span> or <span class="hljs-string">&quot;license&quot;</span> <span class="hljs-keyword">for</span> more information.
&gt;&gt;&gt; import milvus
&gt;&gt;&gt; milvus.before()
please <span class="hljs-keyword">do</span> the following <span class="hljs-keyword">if</span> you have not already <span class="hljs-keyword">done</span> so:
1. install required dependencies: bash /var/bin/e-milvus/lib/install_deps.sh
2. <span class="hljs-built_in">export</span> LD_PRELOAD=/SOME_PATH/embd-milvus.so
3. <span class="hljs-built_in">export</span> LD_LIBRARY_PATH=<span class="hljs-variable">$LD_LIBRARY_PATH</span>:/usr/lib:/usr/local/lib:/var/bin/e-milvus/lib/
&gt;&gt;&gt;
<button class="copy-code-btn"></button></code></pre>
<p>Jika Anda telah berhasil menjalankan embedded Milvus sebelumnya dan kembali untuk menjalankannya kembali, Anda dapat langsung menjalankan <code translate="no">milvus.start()</code> setelah mengimpor Milvus.</p>
<pre><code translate="no">$ python3
Python <span class="hljs-number">3.9</span><span class="hljs-number">.10</span> (main, Jan <span class="hljs-number">15</span> <span class="hljs-number">2022</span>, <span class="hljs-number">11</span>:<span class="hljs-number">40</span>:<span class="hljs-number">53</span>)
[Clang <span class="hljs-number">13.0</span><span class="hljs-number">.0</span> (clang-<span class="hljs-number">1300.0</span><span class="hljs-number">.29</span><span class="hljs-number">.3</span>)] on darwinType <span class="hljs-string">&quot;help&quot;</span>, <span class="hljs-string">&quot;copyright&quot;</span>, <span class="hljs-string">&quot;credits&quot;</span> <span class="hljs-keyword">or</span> <span class="hljs-string">&quot;license&quot;</span> <span class="hljs-keyword">for</span> more information.
<span class="hljs-meta">&gt;&gt;&gt; </span><span class="hljs-keyword">import</span> milvus
<span class="hljs-meta">&gt;&gt;&gt; </span>milvus.start()
&gt;&gt;&gt;
<button class="copy-code-btn"></button></code></pre>
<p>Anda akan melihat output berikut jika Anda telah berhasil memulai layanan Milvus tertanam.</p>
<pre><code translate="no">---<span class="hljs-title class_">Milvus</span> <span class="hljs-title class_">Proxy</span> successfully initialized and ready to serve!---
<button class="copy-code-btn"></button></code></pre>
<p>Setelah layanan dimulai, Anda dapat membuka jendela terminal lain dan menjalankan contoh kode &quot;<a href="https://github.com/milvus-io/embd-milvus/blob/main/milvus/examples/hello_milvus.py">Hello Milvus</a>&quot; untuk bermain-main dengan embedded Milvus!</p>
<pre><code translate="no"><span class="hljs-comment"># Download hello_milvus script</span>
$ wget https://raw.githubusercontent.com/milvus-io/pymilvus/v2.1.0/examples/hello_milvus.py
<span class="hljs-comment"># Run Hello Milvus </span>
$ python3 hello_milvus.py
<button class="copy-code-btn"></button></code></pre>
<p>Setelah Anda selesai menggunakan embedded Milvus, kami sarankan untuk menghentikannya secara halus dan membersihkan variabel lingkungan dengan menjalankan perintah berikut atau tekan Ctrl-D.</p>
<pre><code translate="no">&gt;&gt;&gt; milvus.stop()
<span class="hljs-keyword">if</span> you need to clean up the environment variables, run:
<span class="hljs-built_in">export</span> LD_PRELOAD=
<span class="hljs-built_in">export</span> LD_LIBRARY_PATH=
&gt;&gt;&gt;
&gt;&gt;&gt; <span class="hljs-built_in">exit</span>()
<button class="copy-code-btn"></button></code></pre>
<h2 id="Whats-next" class="common-anchor-header">Apa yang selanjutnya<button data-href="#Whats-next" class="anchor-icon" translate="no">
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
    </button></h2><p>Dengan dirilisnya Milvus 2.1 secara resmi, kami telah menyiapkan serangkaian blog yang memperkenalkan fitur-fitur baru. Baca lebih lanjut di seri blog ini:</p>
<ul>
<li><a href="https://milvus.io/blog/2022-08-08-How-to-use-string-data-to-empower-your-similarity-search-applications.md">Cara Menggunakan Data String untuk Memberdayakan Aplikasi Pencarian Kemiripan Anda</a></li>
<li><a href="https://milvus.io/blog/embedded-milvus.md">Menggunakan Milvus yang Disematkan untuk Menginstal dan Menjalankan Milvus secara Instan dengan Python</a></li>
<li><a href="https://milvus.io/blog/in-memory-replicas.md">Tingkatkan Throughput Pembacaan Basis Data Vektor Anda dengan Replika Dalam Memori</a></li>
<li><a href="https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database.md">Memahami Tingkat Konsistensi dalam Basis Data Vektor Milvus</a></li>
<li><a href="https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database-2.md">Memahami Tingkat Konsistensi dalam Basis Data Vektor Milvus (Bagian II)</a></li>
<li><a href="https://milvus.io/blog/data-security.md">Bagaimana Basis Data Vektor Milvus Memastikan Keamanan Data?</a></li>
</ul>
