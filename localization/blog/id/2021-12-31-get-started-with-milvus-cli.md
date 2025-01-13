---
id: 2021-12-31-get-started-with-milvus-cli.md
title: Mulailah dengan Milvus_CLI
author: Zhuanghong Chen and Zhen Chen
date: 2021-12-31T00:00:00.000Z
desc: >-
  Artikel ini memperkenalkan Milvus_CLI dan membantu Anda menyelesaikan
  tugas-tugas umum.
cover: assets.zilliz.com/CLI_9a10de4fcc.png
tag: Engineering
recommend: true
canonicalUrl: 'https://zilliz.com/blog/get-started-with-milvus-cli'
---
<p>Di era ledakan informasi, kita memproduksi suara, gambar, video, dan data tak terstruktur lainnya setiap saat. Bagaimana cara kita menganalisis data yang sangat banyak ini secara efisien? Munculnya jaringan neural memungkinkan data yang tidak terstruktur untuk disematkan sebagai vektor, dan basis data Milvus adalah perangkat lunak layanan data dasar, yang membantu menyelesaikan penyimpanan, pencarian, dan analisis data vektor.</p>
<p>Tetapi bagaimana kita dapat menggunakan database vektor Milvus dengan cepat?</p>
<p>Beberapa pengguna mengeluhkan bahwa API sulit untuk dihafalkan dan berharap ada baris perintah yang sederhana untuk mengoperasikan basis data Milvus.</p>
<p>Kami dengan senang hati memperkenalkan Milvus_CLI, sebuah alat bantu baris perintah yang didedikasikan untuk basis data vektor Milvus.</p>
<p>Milvus_CLI adalah CLI basis data yang mudah digunakan untuk Milvus, yang mendukung koneksi basis data, impor data, ekspor data, dan kalkulasi vektor dengan menggunakan perintah-perintah interaktif dalam shell. Versi terbaru dari Milvus_CLI memiliki fitur-fitur berikut.</p>
<ul>
<li><p>Mendukung semua platform, termasuk Windows, Mac, dan Linux</p></li>
<li><p>Instalasi online dan offline dengan dukungan pip</p></li>
<li><p>Portabel, dapat digunakan di mana saja</p></li>
<li><p>Dibangun di atas Milvus SDK untuk Python</p></li>
<li><p>Dokumen bantuan disertakan</p></li>
<li><p>Mendukung pelengkapan otomatis</p></li>
</ul>
<h2 id="Installation" class="common-anchor-header">Instalasi<button data-href="#Installation" class="anchor-icon" translate="no">
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
    </button></h2><p>Anda dapat menginstal Milvus_CLI secara online atau offline.</p>
<h3 id="Install-MilvusCLI-online" class="common-anchor-header">Menginstal Milvus_CLI secara online</h3><p>Jalankan perintah berikut untuk menginstal Milvus_CLI secara online dengan pip. Python 3.8 atau yang lebih baru diperlukan.</p>
<pre><code translate="no">pip install milvus-cli
<button class="copy-code-btn"></button></code></pre>
<h3 id="Install-MilvusCLI-offline" class="common-anchor-header">Menginstal Milvus_CLI secara offline</h3><p>Untuk menginstal Milvus_CLI secara offline, <a href="https://github.com/milvus-io/milvus_cli/releases">unduh</a> tarball terbaru dari halaman rilis terlebih dahulu.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_af0e832119.png" alt="1.png" class="doc-image" id="1.png" />
   </span> <span class="img-wrapper"> <span>1.png</span> </span></p>
<p>Setelah tarball diunduh, jalankan perintah berikut untuk menginstal Milvus_CLI.</p>
<pre><code translate="no">pip install milvus_cli-&lt;version&gt;.tar.gz
<button class="copy-code-btn"></button></code></pre>
<p>Setelah Milvus_CLI terinstal, jalankan <code translate="no">milvus_cli</code>. Perintah <code translate="no">milvus_cli &gt;</code> yang muncul menandakan bahwa baris perintah sudah siap.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_b50f5d2a5a.png" alt="2.png" class="doc-image" id="2.png" />
   </span> <span class="img-wrapper"> <span>2.png</span> </span></p>
<p>Jika Anda menggunakan Mac dengan chip M1 atau PC tanpa lingkungan Python, Anda bisa memilih untuk menggunakan aplikasi portabel. Untuk melakukannya, <a href="https://github.com/milvus-io/milvus_cli/releases">unduh</a> file pada halaman rilis yang sesuai dengan OS Anda, jalankan <code translate="no">chmod +x</code> pada file tersebut agar dapat dieksekusi, dan jalankan <code translate="no">./</code> pada file tersebut untuk menjalankannya.</p>
<h4 id="Example" class="common-anchor-header"><strong>Contoh</strong></h4><p>Contoh berikut ini membuat <code translate="no">milvus_cli-v0.1.8-fix2-macOS</code> dapat dieksekusi dan menjalankannya.</p>
<pre><code translate="no"><span class="hljs-built_in">sudo</span> <span class="hljs-built_in">chmod</span> +x milvus_cli-v0.1.8-fix2-macOS
./milvus_cli-v0.1.8-fix2-macOS
<button class="copy-code-btn"></button></code></pre>
<h2 id="Usage" class="common-anchor-header">Penggunaan<button data-href="#Usage" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Connect-to-Milvus" class="common-anchor-header">Menghubungkan ke Milvus</h3><p>Sebelum menyambungkan ke Milvus, pastikan Milvus telah terinstal pada server Anda. Lihat <a href="https://milvus.io/docs/v2.0.x/install_standalone-docker.md">Instal Milvus Standalone</a> atau <a href="https://milvus.io/docs/v2.0.x/install_cluster-docker.md">Instal Milvus Cluster</a> untuk informasi lebih lanjut.</p>
<p>Jika Milvus terinstal pada hos lokal Anda dengan port default, jalankan <code translate="no">connect</code>.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_f950d3739a.png" alt="3.png" class="doc-image" id="3.png" />
   </span> <span class="img-wrapper"> <span>3.png</span> </span></p>
<p>Jika tidak, jalankan perintah berikut dengan alamat IP server Milvus Anda. Contoh berikut ini menggunakan <code translate="no">172.16.20.3</code> sebagai alamat IP dan <code translate="no">19530</code> sebagai nomor port.</p>
<pre><code translate="no">connect -h 172.16.20.3
<button class="copy-code-btn"></button></code></pre>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/4_9ff2db9855.png" alt="4.png" class="doc-image" id="4.png" />
   </span> <span class="img-wrapper"> <span>4.png</span> </span></p>
<h3 id="Create-a-collection" class="common-anchor-header">Membuat koleksi</h3><p>Bagian ini memperkenalkan cara membuat koleksi.</p>
<p>Sebuah koleksi terdiri dari entitas dan mirip dengan tabel dalam RDBMS. Lihat <a href="https://milvus.io/docs/v2.0.x/glossary.md">Glosarium</a> untuk informasi lebih lanjut.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/5_95a88c1cbf.png" alt="5.png" class="doc-image" id="5.png" />
   </span> <span class="img-wrapper"> <span>5.png</span> </span></p>
<h4 id="Example" class="common-anchor-header">Contoh</h4><p>Contoh berikut ini membuat koleksi bernama <code translate="no">car</code>. Koleksi <code translate="no">car</code> memiliki empat field yaitu <code translate="no">id</code>, <code translate="no">vector</code>, <code translate="no">color</code>, dan <code translate="no">brand</code>. Bidang kunci utama adalah <code translate="no">id</code>. Lihat <a href="https://milvus.io/docs/v2.0.x/cli_commands.md#create-collection">membuat koleksi</a> untuk informasi lebih lanjut.</p>
<pre><code translate="no">create collection -c car -f <span class="hljs-built_in">id</span>:INT64:primary_field -f vector:FLOAT_VECTOR:<span class="hljs-number">128</span> -f color:INT64:color -f brand:INT64:brand -p <span class="hljs-built_in">id</span> -a -d <span class="hljs-string">&#x27;car_collection&#x27;</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="List-collections" class="common-anchor-header">Membuat daftar koleksi</h3><p>Jalankan perintah berikut untuk membuat daftar semua koleksi dalam contoh Milvus ini.</p>
<pre><code translate="no">list collections
<button class="copy-code-btn"></button></code></pre>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/6_1331f4c8bc.png" alt="6.png" class="doc-image" id="6.png" />
   </span> <span class="img-wrapper"> <span>6.png</span> </span></p>
<p>Jalankan perintah berikut untuk memeriksa detail koleksi <code translate="no">car</code>.</p>
<pre><code translate="no">describe collection -c car 
<button class="copy-code-btn"></button></code></pre>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/7_1d70beee54.png" alt="7.png" class="doc-image" id="7.png" />
   </span> <span class="img-wrapper"> <span>7.png</span> </span></p>
<h3 id="Calculate-the-distance-between-two-vectors" class="common-anchor-header">Menghitung jarak antara dua vektor</h3><p>Jalankan perintah berikut untuk mengimpor data ke dalam koleksi <code translate="no">car</code>.</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> -c car <span class="hljs-string">&#x27;https://raw.githubusercontent.com/zilliztech/milvus_cli/main/examples/import_csv/vectors.csv&#x27;</span>
<button class="copy-code-btn"></button></code></pre>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/8_7609a4359a.png" alt="8.png" class="doc-image" id="8.png" />
   </span> <span class="img-wrapper"> <span>8.png</span> </span></p>
<p>Jalankan <code translate="no">query</code> dan masukkan <code translate="no">car</code> sebagai nama koleksi dan <code translate="no">id&gt;0</code> sebagai ekspresi kueri saat diminta. ID entitas yang memenuhi kriteria akan dikembalikan seperti yang ditunjukkan pada gambar berikut.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/9_f0755589f6.png" alt="9.png" class="doc-image" id="9.png" />
   </span> <span class="img-wrapper"> <span>9.png</span> </span></p>
<p>Jalankan <code translate="no">calc</code> dan masukkan nilai yang sesuai ketika diminta untuk menghitung jarak antara array vektor.</p>
<h3 id="Delete-a-collection" class="common-anchor-header">Menghapus koleksi</h3><p>Jalankan perintah berikut untuk menghapus koleksi <code translate="no">car</code>.</p>
<pre><code translate="no"><span class="hljs-keyword">delete</span> collection -c car
<button class="copy-code-btn"></button></code></pre>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/10_16b2b01935.png" alt="10.png" class="doc-image" id="10.png" />
   </span> <span class="img-wrapper"> <span>10.png</span> </span></p>
<h2 id="More" class="common-anchor-header">Lainnya<button data-href="#More" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus_CLI tidak terbatas pada fungsi-fungsi sebelumnya. Jalankan <code translate="no">help</code> untuk melihat semua perintah yang disertakan Milvus_CLI dan deskripsinya. Jalankan <code translate="no">&lt;command&gt; --help</code> untuk melihat detail perintah tertentu.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/11_5f31ccb1e8.png" alt="11.png" class="doc-image" id="11.png" />
   </span> <span class="img-wrapper"> <span>11.png</span> </span></p>
<p><strong>Lihat juga:</strong></p>
<p><a href="https://milvus.io/docs/v2.0.x/cli_commands.md">Referensi Perintah Milvus_CLI</a> di bawah Dokumen Milvus</p>
<p>Kami berharap Milvus_CLI dapat membantu Anda menggunakan basis data vektor Milvus dengan mudah. Kami akan terus mengoptimalkan Milvus_CLI dan kontribusi Anda sangat kami harapkan.</p>
<p>Jika Anda memiliki pertanyaan, jangan ragu untuk <a href="https://github.com/zilliztech/milvus_cli/issues">mengajukan</a> pertanyaan di GitHub.</p>
