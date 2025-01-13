---
id: data-security.md
title: Bagaimana Basis Data Vektor Milvus Memastikan Keamanan Data?
author: Angela Ni
date: 2022-09-05T00:00:00.000Z
desc: Pelajari tentang autentikasi dan enkripsi pengguna saat transit di Milvus.
cover: assets.zilliz.com/Security_192e35a790.png
tag: Engineering
tags: 'Vector Database for AI, Artificial Intelligence, Machine Learning'
canonicalUrl: 'https://milvus.io/blog/data-security.md'
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Security_192e35a790.png" alt="Cover image" class="doc-image" id="cover-image" />
   </span> <span class="img-wrapper"> <span>Gambar sampul depan</span> </span></p>
<p>Dengan mempertimbangkan keamanan data Anda sepenuhnya, otentikasi pengguna dan koneksi keamanan lapisan transport (TLS) sekarang secara resmi tersedia di Milvus 2.1. Tanpa otentikasi pengguna, siapa pun dapat mengakses semua data dalam basis data vektor Anda dengan SDK. Namun, mulai dari Milvus 2.1, hanya mereka yang memiliki nama pengguna dan kata sandi yang valid yang dapat mengakses basis data vektor Milvus. Selain itu, di Milvus 2.1 keamanan data lebih terlindungi oleh TLS, yang memastikan komunikasi yang aman dalam jaringan komputer.</p>
<p>Artikel ini bertujuan untuk menganalisis bagaimana Milvus database vektor memastikan keamanan data dengan otentikasi pengguna dan koneksi TLS dan menjelaskan bagaimana Anda dapat memanfaatkan kedua fitur ini sebagai pengguna yang ingin memastikan keamanan data saat menggunakan database vektor.</p>
<p><strong>Langsung ke:</strong></p>
<ul>
<li><a href="#What-is-database-security-and-why-is-it-important">Apa yang dimaksud dengan keamanan basis data dan mengapa hal ini penting?</a></li>
<li><a href="#How-does-the-Milvus-vector-database-ensure-data-security">Bagaimana database vektor Milvus memastikan keamanan data?</a><ul>
<li><a href="#User-authentication">Otentikasi pengguna</a></li>
<li><a href="#TLS-connection">Koneksi TLS</a></li>
</ul></li>
</ul>
<h2 id="What-is-database-security-and-why-is-it-important" class="common-anchor-header">Apa yang dimaksud dengan keamanan basis data dan mengapa hal ini penting?<button data-href="#What-is-database-security-and-why-is-it-important" class="anchor-icon" translate="no">
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
    </button></h2><p>Keamanan basis data mengacu pada langkah-langkah yang diambil untuk memastikan bahwa semua data dalam basis data aman dan dijaga kerahasiaannya. Kasus pembobolan data dan kebocoran data baru-baru ini di <a href="https://firewalltimes.com/recent-data-breaches/">Twitter, Marriott, dan Departemen Asuransi Texas, dan lain-lain</a> membuat kita semakin waspada terhadap masalah keamanan data. Semua kasus ini terus-menerus mengingatkan kita bahwa perusahaan dan bisnis dapat mengalami kerugian besar jika data tidak terlindungi dengan baik dan database yang mereka gunakan aman.</p>
<h2 id="How-does-the-Milvus-vector-database-ensure-data-security" class="common-anchor-header">Bagaimana database vektor Milvus memastikan keamanan data?<button data-href="#How-does-the-Milvus-vector-database-ensure-data-security" class="anchor-icon" translate="no">
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
    </button></h2><p>Dalam rilis 2.1 saat ini, basis data vektor Milvus berusaha memastikan keamanan basis data melalui otentikasi dan enkripsi. Lebih khusus lagi, pada tingkat akses, Milvus mendukung otentikasi pengguna dasar untuk mengontrol siapa yang dapat mengakses basis data. Sementara itu, pada tingkat basis data, Milvus mengadopsi protokol enkripsi transport layer security (TLS) untuk melindungi komunikasi data.</p>
<h3 id="User-authentication" class="common-anchor-header">Otentikasi pengguna</h3><p>Fitur otentikasi pengguna dasar di Milvus mendukung pengaksesan basis data vektor menggunakan nama pengguna dan kata sandi demi keamanan data. Ini berarti klien hanya dapat mengakses instance Milvus dengan memberikan nama pengguna dan kata sandi yang telah diautentikasi.</p>
<h4 id="The-authentication-workflow-in-the-Milvus-vector-database" class="common-anchor-header">Alur kerja otentikasi dalam basis data vektor Milvus</h4><p>Semua permintaan gRPC ditangani oleh proksi Milvus, sehingga otentikasi diselesaikan oleh proksi. Alur kerja untuk masuk dengan kredensial untuk menyambung ke instance Milvus adalah sebagai berikut.</p>
<ol>
<li>Buat kredensial untuk setiap instans Milvus dan kata sandi terenkripsi disimpan dalam etcd. Milvus menggunakan <a href="https://golang.org/x/crypto/bcrypt">bcrypt</a> untuk enkripsi karena mengimplementasikan <a href="http://www.usenix.org/event/usenix99/provos/provos.pdf">algoritma hashing adaptif</a> Provos dan Mazières.</li>
<li>Di sisi klien, SDK mengirimkan ciphertext ketika terhubung ke layanan Milvus. Ciphertext base64 (<username>:<password>) dilampirkan ke metadata dengan kunci <code translate="no">authorization</code>.</li>
<li>Proksi Milvus mencegat permintaan dan memverifikasi kredensial.</li>
<li>Kredensial disimpan secara lokal di dalam proksi.</li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1280_X1280_021e90e3c8.jpeg" alt="authetication_workflow" class="doc-image" id="authetication_workflow" />
   </span> <span class="img-wrapper"> <span>alur_kerja_otentikasi</span> </span></p>
<p>Ketika kredensial diperbarui, alur kerja sistem di Milvus adalah sebagai berikut</p>
<ol>
<li>Root coord bertanggung jawab atas kredensial ketika API insert, query, delete dipanggil.</li>
<li>Ketika Anda memperbarui kredensial karena Anda lupa kata sandi misalnya, kata sandi baru akan disimpan di etcd. Kemudian semua kredensial lama dalam cache lokal proxy akan dibatalkan.</li>
<li>Pencegat autentikasi mencari catatan dari cache lokal terlebih dahulu. Jika kredensial dalam cache tidak benar, panggilan RPC untuk mengambil catatan yang paling baru dari root coord akan dipicu. Dan kredensial di cache lokal akan diperbarui.</li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/update_5af81a4173.jpeg" alt="credential_update_workflow" class="doc-image" id="credential_update_workflow" />
   </span> <span class="img-wrapper"> <span>alur_kerja_pembaruan_kredensial</span> </span></p>
<h4 id="How-to-manage-user-authentication-in-the-Milvus-vector-database" class="common-anchor-header">Cara mengelola autentikasi pengguna dalam basis data vektor Milvus</h4><p>Untuk mengaktifkan autentikasi, Anda harus terlebih dahulu mengatur <code translate="no">common.security.authorizationEnabled</code> ke <code translate="no">true</code> saat mengonfigurasi Milvus di file <code translate="no">milvus.yaml</code>.</p>
<p>Setelah diaktifkan, pengguna root akan dibuat untuk instans Milvus. Pengguna root ini dapat menggunakan kata sandi awal <code translate="no">Milvus</code> untuk terhubung ke basis data vektor Milvus.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> connections
connections.<span class="hljs-title function_">connect</span>(
    alias=<span class="hljs-string">&#x27;default&#x27;</span>,
    host=<span class="hljs-string">&#x27;localhost&#x27;</span>,
    port=<span class="hljs-string">&#x27;19530&#x27;</span>,
    user=<span class="hljs-string">&#x27;root_user&#x27;</span>,
    password=<span class="hljs-string">&#x27;Milvus&#x27;</span>,
)
<button class="copy-code-btn"></button></code></pre>
<p>Kami sangat menyarankan untuk mengganti kata sandi pengguna root ketika memulai Milvus untuk pertama kalinya.</p>
<p>Kemudian pengguna root dapat membuat lebih banyak pengguna baru untuk akses yang terautentikasi dengan menjalankan perintah berikut untuk membuat pengguna baru.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> utility
utility.<span class="hljs-title function_">create_credential</span>(<span class="hljs-string">&#x27;user&#x27;</span>, <span class="hljs-string">&#x27;password&#x27;</span>, <span class="hljs-keyword">using</span>=<span class="hljs-string">&#x27;default&#x27;</span>) 
<button class="copy-code-btn"></button></code></pre>
<p>Ada dua hal yang perlu diingat saat membuat pengguna baru:</p>
<ol>
<li><p>Untuk nama pengguna baru, panjangnya tidak boleh lebih dari 32 karakter dan harus diawali dengan huruf. Hanya garis bawah, huruf, atau angka yang diperbolehkan dalam nama pengguna. Sebagai contoh, nama pengguna "2abc!" tidak dapat diterima.</p></li>
<li><p>Sedangkan untuk kata sandi, panjangnya harus 6-256 karakter.</p></li>
</ol>
<p>Setelah kredensial baru disiapkan, pengguna baru dapat terhubung ke instans Milvus dengan nama pengguna dan kata sandi tersebut.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> connections
connections.<span class="hljs-title function_">connect</span>(
    alias=<span class="hljs-string">&#x27;default&#x27;</span>,
    host=<span class="hljs-string">&#x27;localhost&#x27;</span>,
    port=<span class="hljs-string">&#x27;19530&#x27;</span>,
    user=<span class="hljs-string">&#x27;user&#x27;</span>,
    password=<span class="hljs-string">&#x27;password&#x27;</span>,
)
<button class="copy-code-btn"></button></code></pre>
<p>Seperti semua proses autentikasi, Anda tidak perlu khawatir jika Anda lupa kata sandi. Kata sandi untuk pengguna yang sudah ada dapat diatur ulang dengan perintah berikut.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> utility
utility.<span class="hljs-title function_">reset_password</span>(<span class="hljs-string">&#x27;user&#x27;</span>, <span class="hljs-string">&#x27;new_password&#x27;</span>, <span class="hljs-keyword">using</span>=<span class="hljs-string">&#x27;default&#x27;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Baca <a href="https://milvus.io/docs/v2.1.x/authenticate.md">dokumentasi Milvus</a> untuk mempelajari lebih lanjut tentang autentikasi pengguna.</p>
<h3 id="TLS-connection" class="common-anchor-header">Koneksi TLS</h3><p>Transport layer security (TLS) adalah jenis protokol autentikasi untuk menyediakan keamanan komunikasi dalam jaringan komputer. TLS menggunakan sertifikat untuk menyediakan layanan autentikasi antara dua atau lebih pihak yang berkomunikasi.</p>
<h4 id="How-to-enable-TLS-in-the-Milvus-vector-database" class="common-anchor-header">Cara mengaktifkan TLS di basis data vektor Milvus</h4><p>Untuk mengaktifkan TLS di Milvus, pertama-tama Anda harus menjalankan perintah berikut untuk membagi dua file untuk menghasilkan sertifikat: file konfigurasi OpenSSL default bernama <code translate="no">openssl.cnf</code> dan file bernama <code translate="no">gen.sh</code> yang digunakan untuk menghasilkan sertifikat yang relevan.</p>
<pre><code translate="no"><span class="hljs-built_in">mkdir</span> cert &amp;&amp; <span class="hljs-built_in">cd</span> cert
<span class="hljs-built_in">touch</span> openssl.cnf gen.sh
<button class="copy-code-btn"></button></code></pre>
<p>Kemudian Anda cukup menyalin dan menempelkan konfigurasi yang kami sediakan <a href="https://milvus.io/docs/v2.1.x/tls.md#Create-files">di sini</a> ke dua berkas tersebut. Atau Anda juga dapat melakukan modifikasi berdasarkan konfigurasi kami agar lebih sesuai dengan aplikasi Anda.</p>
<p>Ketika kedua berkas tersebut sudah siap, Anda dapat menjalankan berkas <code translate="no">gen.sh</code> untuk membuat sembilan berkas sertifikat. Demikian juga, Anda juga dapat memodifikasi konfigurasi dalam sembilan file sertifikat sesuai dengan kebutuhan Anda.</p>
<pre><code translate="no"><span class="hljs-built_in">chmod</span> +x gen.sh
./gen.sh
<button class="copy-code-btn"></button></code></pre>
<p>Ada satu langkah terakhir sebelum Anda dapat terhubung ke layanan Milvus dengan TLS. Anda harus mengatur <code translate="no">tlsEnabled</code> ke <code translate="no">true</code> dan mengonfigurasi jalur berkas <code translate="no">server.pem</code>, <code translate="no">server.key</code>, dan <code translate="no">ca.pem</code> untuk server di <code translate="no">config/milvus.yaml</code>. Kode di bawah ini adalah sebuah contoh.</p>
<pre><code translate="no">tls:
  serverPemPath: configs/cert/server.pem
  serverKeyPath: configs/cert/server.key
  caPemPath: configs/cert/ca.pem

common:
  security:
    tlsEnabled: <span class="hljs-literal">true</span>
<button class="copy-code-btn"></button></code></pre>
<p>Kemudian Anda sudah siap dan dapat terhubung ke layanan Milvus dengan TLS selama Anda menentukan jalur file <code translate="no">client.pem</code>, <code translate="no">client.key</code>, dan <code translate="no">ca.pem</code> untuk klien saat menggunakan SDK koneksi Milvus. Kode di bawah ini juga merupakan contoh.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> connections

_HOST = <span class="hljs-string">&#x27;127.0.0.1&#x27;</span>
_PORT = <span class="hljs-string">&#x27;19530&#x27;</span>

<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;\nCreate connection...&quot;</span>)
connections.connect(host=_HOST, port=_PORT, secure=<span class="hljs-literal">True</span>, client_pem_path=<span class="hljs-string">&quot;cert/client.pem&quot;</span>,
                        client_key_path=<span class="hljs-string">&quot;cert/client.key&quot;</span>,
                        ca_pem_path=<span class="hljs-string">&quot;cert/ca.pem&quot;</span>, server_name=<span class="hljs-string">&quot;localhost&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;\nList connections:&quot;</span>)
<span class="hljs-built_in">print</span>(connections.list_connections())
<button class="copy-code-btn"></button></code></pre>
<h2 id="Whats-next" class="common-anchor-header">Apa selanjutnya<button data-href="#Whats-next" class="anchor-icon" translate="no">
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
    </button></h2><p>Dengan dirilisnya Milvus 2.1 secara resmi, kami telah menyiapkan serangkaian blog yang memperkenalkan fitur-fitur baru. Baca lebih lanjut dalam seri blog ini:</p>
<ul>
<li><a href="https://milvus.io/blog/2022-08-08-How-to-use-string-data-to-empower-your-similarity-search-applications.md">Cara Menggunakan Data String untuk Memberdayakan Aplikasi Pencarian Kemiripan Anda</a></li>
<li><a href="https://milvus.io/blog/embedded-milvus.md">Menggunakan Milvus yang Disematkan untuk Menginstal dan Menjalankan Milvus secara Instan dengan Python</a></li>
<li><a href="https://milvus.io/blog/in-memory-replicas.md">Tingkatkan Throughput Pembacaan Basis Data Vektor Anda dengan Replika Dalam Memori</a></li>
<li><a href="https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database.md">Memahami Tingkat Konsistensi dalam Basis Data Vektor Milvus</a></li>
<li><a href="https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database-2.md">Memahami Tingkat Konsistensi dalam Basis Data Vektor Milvus (Bagian II)</a></li>
<li><a href="https://milvus.io/blog/data-security.md">Bagaimana Basis Data Vektor Milvus Memastikan Keamanan Data?</a></li>
</ul>
