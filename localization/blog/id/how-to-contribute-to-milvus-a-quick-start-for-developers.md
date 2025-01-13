---
id: how-to-contribute-to-milvus-a-quick-start-for-developers.md
title: 'Cara Berkontribusi ke Milvus: Awal yang Cepat untuk Pengembang'
author: Shaoting Huang
date: 2024-12-01T00:00:00.000Z
cover: assets.zilliz.com/How_to_Contribute_to_Milvus_91e1432163.png
tag: Engineering
tags: >-
  Milvus, contribute to open-source projects, vector databases, Contribute to
  Milvus
recommend: true
canonicalUrl: >-
  https://milvus.io/blog/how-to-contribute-to-milvus-a-quick-start-for-developers.md
---
<p><a href="https://github.com/milvus-io/milvus"><strong>Milvus</strong></a> adalah <a href="https://zilliz.com/learn/what-is-vector-database">basis data vektor</a> sumber terbuka yang dirancang untuk mengelola data vektor berdimensi tinggi. Baik Anda membangun mesin pencari cerdas, sistem rekomendasi, atau solusi AI generasi berikutnya seperti retrieval augmented generation<a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">(RAG</a>), Milvus adalah alat yang kuat di ujung jari Anda.</p>
<p>Namun, yang benar-benar mendorong Milvus maju bukan hanya teknologinya yang canggih, tetapi juga <a href="https://zilliz.com/community">komunitas pengembang</a> yang bersemangat dan bergairah di belakangnya. Sebagai proyek sumber terbuka, Milvus tumbuh dan berkembang berkat kontribusi pengembang seperti Anda. Setiap perbaikan bug, penambahan fitur, dan peningkatan kinerja dari komunitas membuat Milvus lebih cepat, lebih terukur, dan lebih dapat diandalkan.</p>
<p>Jika Anda menyukai open-source, ingin belajar, atau ingin membuat dampak yang berkelanjutan di bidang AI, Milvus adalah tempat yang tepat untuk berkontribusi. Panduan ini akan memandu Anda melalui prosesnya-mulai dari menyiapkan lingkungan pengembangan hingga mengirimkan pull request pertama Anda. Kami juga akan menyoroti tantangan umum yang mungkin Anda hadapi dan memberikan solusi untuk mengatasinya.</p>
<p>Siap untuk terjun? Mari kita buat Milvus menjadi lebih baik bersama-sama!</p>
<h2 id="Setting-Up-Your-Milvus-Development-Environment" class="common-anchor-header">Menyiapkan Lingkungan Pengembangan Milvus Anda<button data-href="#Setting-Up-Your-Milvus-Development-Environment" class="anchor-icon" translate="no">
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
    </button></h2><p>Hal pertama yang harus Anda lakukan adalah menyiapkan lingkungan pengembangan Anda. Anda dapat menginstal Milvus di mesin lokal Anda atau menggunakan Docker-kedua metode ini sangat mudah, tetapi Anda juga harus menginstal beberapa dependensi pihak ketiga untuk menjalankan semuanya.</p>
<h3 id="Building-Milvus-Locally" class="common-anchor-header">Membangun Milvus Secara Lokal</h3><p>Jika Anda suka membangun sesuatu dari awal, membangun Milvus di mesin lokal Anda sangatlah mudah. Milvus membuatnya mudah dengan membundel semua dependensi dalam skrip <code translate="no">install_deps.sh</code>. Berikut ini adalah penyiapan cepatnya:</p>
<pre><code translate="no"><span class="hljs-comment"># Install third-party dependencies.</span>
$ <span class="hljs-built_in">cd</span> milvus/
$ ./scripts/install_deps.sh

<span class="hljs-comment"># Compile Milvus.</span>
$ make
<button class="copy-code-btn"></button></code></pre>
<h3 id="Building-Milvus-with-Docker" class="common-anchor-header">Membangun Milvus dengan Docker</h3><p>Jika Anda lebih memilih Docker, ada dua cara untuk melakukannya: Anda dapat menjalankan perintah dalam kontainer yang sudah dibuat sebelumnya atau menjalankan kontainer dev untuk pendekatan yang lebih praktis.</p>
<pre><code translate="no"><span class="hljs-comment"># Option 1: Run commands in a pre-built Docker container  </span>
build/builder.sh make  

<span class="hljs-comment"># Option 2: Spin up a dev container  </span>
./scripts/devcontainer.sh up  
docker-compose -f docker-compose-devcontainer.yml ps  
docker <span class="hljs-built_in">exec</span> -ti milvus-builder-<span class="hljs-number">1</span> bash  
make milvus  
<button class="copy-code-btn"></button></code></pre>
<p><strong>Catatan Platform:</strong> Jika Anda menggunakan Linux, Anda siap untuk melanjutkan - masalah kompilasi cukup jarang terjadi. Namun, pengguna Mac, terutama dengan chip M1, mungkin akan mengalami beberapa kendala di sepanjang jalan. Namun, jangan khawatir-kami memiliki panduan untuk membantu Anda mengatasi masalah yang paling umum.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_OS_configuration_52092fb1b7.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Gambar: Konfigurasi OS</em></p>
<p>Untuk panduan penyiapan lengkap, lihat <a href="https://github.com/milvus-io/milvus/blob/master/DEVELOPMENT.md">Panduan Pengembangan Milvus</a> resmi.</p>
<h3 id="Common-Issues-and-How-to-Fix-Them" class="common-anchor-header">Masalah Umum dan Cara Mengatasinya</h3><p>Terkadang, menyiapkan lingkungan pengembangan Milvus Anda tidak berjalan mulus seperti yang direncanakan. Jangan khawatir - berikut ini adalah ikhtisar singkat tentang masalah umum yang mungkin Anda temui dan cara memperbaikinya dengan cepat.</p>
<h4 id="Homebrew-Unexpected-Disconnect-While-Reading-Sideband-Packet" class="common-anchor-header">Homebrew: Pemutusan Tak Terduga Saat Membaca Paket Sideband</h4><p>Jika Anda menggunakan Homebrew dan melihat kesalahan seperti ini:</p>
<pre><code translate="no">==&gt; Tapping homebrew/core
remote: Enumerating objects: 1107077, <span class="hljs-keyword">done</span>.
remote: Counting objects: 100% (228/228), <span class="hljs-keyword">done</span>.
remote: Compressing objects: 100% (157/157), <span class="hljs-keyword">done</span>.
error: 545 bytes of body are still expected.44 MiB | 341.00 KiB/s
fetch-pack: unexpected disconnect <span class="hljs-keyword">while</span> reading sideband packet
fatal: early EOF
fatal: index-pack failed
Failed during: git fetch --force origin refs/heads/master:refs/remotes/origin/master
myuser~ %
<button class="copy-code-btn"></button></code></pre>
<p><strong>Perbaiki:</strong> Tingkatkan ukuran <code translate="no">http.postBuffer</code>:</p>
<pre><code translate="no">git config --<span class="hljs-variable language_">global</span> http.<span class="hljs-property">postBuffer</span> 1M
<button class="copy-code-btn"></button></code></pre>
<p>Jika Anda juga mengalami <code translate="no">Brew: command not found</code> setelah menginstal Homebrew, Anda mungkin perlu mengatur konfigurasi pengguna Git:</p>
<pre><code translate="no">git config --<span class="hljs-variable language_">global</span> user.<span class="hljs-property">email</span> xxxgit config --<span class="hljs-variable language_">global</span> user.<span class="hljs-property">name</span> xxx
<button class="copy-code-btn"></button></code></pre>
<h4 id="Docker-Error-Getting-Credentials" class="common-anchor-header">Docker: Kesalahan Mendapatkan Kredensial</h4><p>Saat bekerja dengan Docker, Anda mungkin melihat ini:</p>
<pre><code translate="no"><span class="hljs-type">error</span> getting credentials - err: exit status <span class="hljs-number">1</span>, out: <span class="hljs-string">``</span>  
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Docker_Error_Getting_Credentials_797f3043fb.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Perbaiki:</strong> Buka<code translate="no">~/.docker/config.json</code> dan hapus bidang <code translate="no">credsStore</code>.</p>
<h4 id="Python-No-Module-Named-imp" class="common-anchor-header">Python: Tidak Ada Modul Bernama 'imp'</h4><p>Jika Python melemparkan kesalahan ini, itu karena Python 3.12 menghapus modul <code translate="no">imp</code>, yang masih digunakan oleh beberapa dependensi lama.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Python_No_Module_Named_imp_65eb2c5c66.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Memperbaiki:</strong> Turunkan versi ke Python 3.11:</p>
<pre><code translate="no">brew install python@3.11  
<button class="copy-code-btn"></button></code></pre>
<h4 id="Conan-Unrecognized-Arguments-or-Command-Not-Found" class="common-anchor-header">Conan: Argumen yang Tidak Dikenali atau Perintah Tidak Ditemukan</h4><p><strong>Masalah:</strong> Jika Anda melihat <code translate="no">Unrecognized arguments: --install-folder conan</code>, kemungkinan besar Anda menggunakan versi Conan yang tidak kompatibel.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Conan_Unrecognized_Arguments_or_Command_Not_Found_8f2029db72.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Perbaikan:</strong> Turunkan versi ke Conan 1.61:</p>
<pre><code translate="no">pip install conan==1.61  
<button class="copy-code-btn"></button></code></pre>
<p><strong>Masalah:</strong> Jika Anda melihat <code translate="no">Conan command not found</code>, itu berarti lingkungan Python Anda tidak diatur dengan benar.</p>
<p><strong>Perbaikan:</strong> Tambahkan direktori bin Python ke <code translate="no">PATH</code>:</p>
<pre><code translate="no"><span class="hljs-built_in">export</span> PATH=<span class="hljs-string">&quot;/path/to/python/bin:<span class="hljs-variable">$PATH</span>&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<h4 id="LLVM-Use-of-Undeclared-Identifier-kSecFormatOpenSSL" class="common-anchor-header">LLVM: Penggunaan Pengenal yang Tidak Dideklarasikan 'kSecFormatOpenSSL'</h4><p>Kesalahan ini biasanya berarti dependensi LLVM Anda sudah kedaluwarsa.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/LLVM_Use_of_Undeclared_Identifier_k_Sec_Format_Open_SSL_f0ca6f0166.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Memperbaiki:</strong> Instal ulang LLVM 15 dan perbarui variabel lingkungan Anda:</p>
<pre><code translate="no">brew reinstall llvm@<span class="hljs-number">15</span>
<span class="hljs-keyword">export</span> <span class="hljs-variable constant_">LDFLAGS</span>=<span class="hljs-string">&quot;-L/opt/homebrew/opt/llvm@15/lib&quot;</span>
<span class="hljs-keyword">export</span> <span class="hljs-variable constant_">CPPFLAGS</span>=<span class="hljs-string">&quot;-I/opt/homebrew/opt/llvm@15/include&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>Tips Pro</strong></p>
<ul>
<li><p>Selalu periksa ulang versi dan dependensi alat Anda.</p></li>
<li><p>Jika masih ada yang tidak berfungsi,<a href="https://github.com/milvus-io/milvus/issues"> halaman Permasalahan Milvus GitHub</a> adalah tempat yang tepat untuk menemukan jawaban atau meminta bantuan.</p></li>
</ul>
<h3 id="Configuring-VS-Code-for-C++-and-Go-Integration" class="common-anchor-header">Mengonfigurasi Kode VS untuk Integrasi C++ dan Go</h3><p>Membuat C++ dan Go bekerja bersama di VS Code lebih mudah daripada kedengarannya. Dengan pengaturan yang tepat, Anda dapat menyederhanakan proses pengembangan Anda untuk Milvus. Cukup ubah file <code translate="no">user.settings</code> Anda dengan konfigurasi di bawah ini:</p>
<pre><code translate="no">{
   <span class="hljs-string">&quot;go.toolsEnvVars&quot;</span>: {
       <span class="hljs-string">&quot;PKG_CONFIG_PATH&quot;</span>: <span class="hljs-string">&quot;/Users/zilliz/milvus/internal/core/output/lib/pkgconfig:/Users/zilliz/workspace/milvus/internal/core/output/lib64/pkgconfig&quot;</span>,
       <span class="hljs-string">&quot;LD_LIBRARY_PATH&quot;</span>: <span class="hljs-string">&quot;/Users/zilliz/workspace/milvus/internal/core/output/lib:/Users/zilliz/workspace/milvus/internal/core/output/lib64&quot;</span>,
       <span class="hljs-string">&quot;RPATH&quot;</span>: <span class="hljs-string">&quot;/Users/zilliz/workspace/milvus/internal/core/output/lib:/Users/zilliz/workspace/milvus/internal/core/output/lib64&quot;</span>
   },
   <span class="hljs-string">&quot;go.testEnvVars&quot;</span>: {
       <span class="hljs-string">&quot;PKG_CONFIG_PATH&quot;</span>: <span class="hljs-string">&quot;/Users/zilliz/workspace/milvus/internal/core/output/lib/pkgconfig:/Users/zilliz/workspace/milvus/internal/core/output/lib64/pkgconfig&quot;</span>,
       <span class="hljs-string">&quot;LD_LIBRARY_PATH&quot;</span>: <span class="hljs-string">&quot;/Users/zilliz/workspace/milvus/internal/core/output/lib:/Users/zilliz/workspace/milvus/internal/core/output/lib64&quot;</span>,
       <span class="hljs-string">&quot;RPATH&quot;</span>: <span class="hljs-string">&quot;/Users/zilliz/workspace/milvus/internal/core/output/lib:/Users/zilliz/workspace/milvus/internal/core/output/lib64&quot;</span>
   },
   <span class="hljs-string">&quot;go.buildFlags&quot;</span>: [
       <span class="hljs-string">&quot;-ldflags=-r /Users/zilliz/workspace/milvus/internal/core/output/lib&quot;</span>
   ],
   <span class="hljs-string">&quot;terminal.integrated.env.linux&quot;</span>: {
       <span class="hljs-string">&quot;PKG_CONFIG_PATH&quot;</span>: <span class="hljs-string">&quot;/Users/zilliz/workspace/milvus/internal/core/output/lib/pkgconfig:/Users/zilliz/workspace/milvus/internal/core/output/lib64/pkgconfig&quot;</span>,
       <span class="hljs-string">&quot;LD_LIBRARY_PATH&quot;</span>: <span class="hljs-string">&quot;/Users/zilliz/workspace/milvus/internal/core/output/lib:/Users/zilliz/workspace/milvus/internal/core/output/lib64&quot;</span>,
       <span class="hljs-string">&quot;RPATH&quot;</span>: <span class="hljs-string">&quot;/Users/zilliz/workspace/milvus/internal/core/output/lib:/Users/zilliz/workspace/milvus/internal/core/output/lib64&quot;</span>
   },
   <span class="hljs-string">&quot;go.useLanguageServer&quot;</span>: <span class="hljs-literal">true</span>,
   <span class="hljs-string">&quot;gopls&quot;</span>: {
       <span class="hljs-string">&quot;formatting.gofumpt&quot;</span>: <span class="hljs-literal">true</span>
   },
   <span class="hljs-string">&quot;go.formatTool&quot;</span>: <span class="hljs-string">&quot;gofumpt&quot;</span>,
   <span class="hljs-string">&quot;go.lintTool&quot;</span>: <span class="hljs-string">&quot;golangci-lint&quot;</span>,
   <span class="hljs-string">&quot;go.testTags&quot;</span>: <span class="hljs-string">&quot;dynamic&quot;</span>,
   <span class="hljs-string">&quot;go.testTimeout&quot;</span>: <span class="hljs-string">&quot;10m&quot;</span>
}
<button class="copy-code-btn"></button></code></pre>
<p>Inilah yang dilakukan oleh konfigurasi ini:</p>
<ul>
<li><p><strong>Variabel Lingkungan:</strong> Mengatur jalur untuk <code translate="no">PKG_CONFIG_PATH</code>, <code translate="no">LD_LIBRARY_PATH</code>, dan <code translate="no">RPATH</code>, yang sangat penting untuk menemukan pustaka selama pembangunan dan pengujian.</p></li>
<li><p><strong>Integrasi Alat Bantu Go:</strong> Mengaktifkan server bahasa Go (<code translate="no">gopls</code>) dan mengonfigurasi alat seperti <code translate="no">gofumpt</code> untuk pemformatan dan <code translate="no">golangci-lint</code> untuk linting.</p></li>
<li><p><strong>Pengaturan Pengujian:</strong> Menambahkan <code translate="no">testTags</code> dan meningkatkan batas waktu untuk menjalankan pengujian menjadi 10 menit.</p></li>
</ul>
<p>Setelah ditambahkan, pengaturan ini memastikan integrasi yang mulus antara alur kerja C++ dan Go. Ini sempurna untuk membangun dan menguji Milvus tanpa perlu mengubah lingkungan secara konstan.</p>
<p><strong>Kiat Pro</strong></p>
<p>Setelah menyiapkannya, jalankan uji coba cepat untuk memastikan semuanya berfungsi. Jika ada sesuatu yang terasa aneh, periksa kembali jalur dan versi ekstensi Go VS Code.</p>
<h2 id="Deploying-Milvus" class="common-anchor-header">Menerapkan Milvus<button data-href="#Deploying-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus mendukung <a href="https://milvus.io/docs/install-overview.md">tiga mode penerapan-Lite</a><strong>, Standalone</strong>, dan <strong>Distributed</strong>.</p>
<ul>
<li><p><a href="https://milvus.io/blog/introducing-milvus-lite.md"><strong>Milvus Lite</strong></a> adalah pustaka Python dan versi Milvus yang sangat ringan. Sangat cocok untuk pembuatan prototipe cepat di lingkungan Python atau notebook dan untuk eksperimen lokal berskala kecil.</p></li>
<li><p><strong>Milvus Standalone</strong> adalah opsi penerapan node tunggal untuk Milvus, menggunakan model client-server. Milvus setara dengan MySQL, sedangkan Milvus Lite seperti SQLite.</p></li>
<li><p><strong>Milvus Distributed</strong> adalah mode terdistribusi dari Milvus, yang ideal untuk pengguna perusahaan yang membangun sistem basis data vektor berskala besar atau platform data vektor.</p></li>
</ul>
<p>Semua penerapan ini bergantung pada tiga komponen inti:</p>
<ul>
<li><p><strong>Milvus:</strong> Mesin basis data vektor yang menggerakkan semua operasi.</p></li>
<li><p><strong>Etcd:</strong> Mesin metadata yang mengelola metadata internal Milvus.</p></li>
<li><p><strong>MinIO:</strong> Mesin penyimpanan yang memastikan persistensi data.</p></li>
</ul>
<p>Ketika berjalan dalam mode <strong>Terdistribusi</strong>, Milvus juga menggabungkan <strong>Pulsar</strong> untuk pemrosesan pesan terdistribusi menggunakan mekanisme Pub/Sub, sehingga dapat diskalakan untuk lingkungan dengan throughput tinggi.</p>
<h3 id="Milvus-Standalone" class="common-anchor-header">Milvus Standalone</h3><p>Mode Standalone dirancang untuk pengaturan instance tunggal, membuatnya sempurna untuk pengujian dan aplikasi skala kecil. Berikut cara untuk memulai:</p>
<pre><code translate="no"><span class="hljs-comment"># Deploy Milvus Standalone  </span>
<span class="hljs-built_in">sudo</span> docker-compose -f deployments/docker/dev/docker-compose.yml up -d
<span class="hljs-comment"># Start the standalone service  </span>
bash ./scripts/start_standalone.sh
<button class="copy-code-btn"></button></code></pre>
<h3 id="Milvus-Distributed-previously-known-as-Milvus-Cluster" class="common-anchor-header">Milvus Terdistribusi (sebelumnya dikenal sebagai Milvus Cluster)</h3><p>Untuk dataset yang lebih besar dan lalu lintas yang lebih tinggi, mode Distributed menawarkan skalabilitas horizontal. Mode ini menggabungkan beberapa instance Milvus ke dalam satu sistem yang kohesif. Penerapan menjadi mudah dengan <strong>Milvus Operator</strong>, yang berjalan di Kubernetes dan mengelola seluruh tumpukan Milvus untuk Anda.</p>
<p>Ingin panduan langkah demi langkah? Lihat <a href="https://milvus.io/docs/install_cluster-milvusoperator.md">Panduan Instalasi Milvus</a>.</p>
<h2 id="Running-End-to-End-E2E-Tests" class="common-anchor-header">Menjalankan Pengujian End-to-End (E2E)<button data-href="#Running-End-to-End-E2E-Tests" class="anchor-icon" translate="no">
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
    </button></h2><p>Setelah penerapan Milvus Anda aktif dan berjalan, menguji fungsionalitasnya sangat mudah dengan pengujian E2E. Pengujian ini mencakup setiap bagian dari penyiapan Anda untuk memastikan semuanya bekerja seperti yang diharapkan. Berikut cara menjalankannya:</p>
<pre><code translate="no"><span class="hljs-comment"># Navigate to the test directory  </span>
<span class="hljs-built_in">cd</span> tests/python_client  

<span class="hljs-comment"># Install dependencies  </span>
pip install -r requirements.txt  

<span class="hljs-comment"># Run E2E tests  </span>
pytest --tags=L0 -n auto  
<button class="copy-code-btn"></button></code></pre>
<p>Untuk instruksi mendalam dan tips pemecahan masalah, lihat <a href="https://github.com/milvus-io/milvus/blob/master/DEVELOPMENT.md#e2e-tests">Panduan Pengembangan Milvus</a>.</p>
<p><strong>Kiat Pro</strong></p>
<p>Jika Anda baru mengenal Milvus, mulailah dengan mode Milvus Lite atau Standalone untuk merasakan kemampuannya sebelum meningkatkan ke mode Distributed untuk beban kerja tingkat produksi.</p>
<h2 id="Submitting-Your-Code" class="common-anchor-header">Mengirimkan Kode Anda<button data-href="#Submitting-Your-Code" class="anchor-icon" translate="no">
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
    </button></h2><p>Selamat! Anda telah menyelesaikan semua pengujian unit dan E2E (atau melakukan debug dan kompilasi ulang sesuai kebutuhan). Meskipun pembangunan pertama dapat memakan waktu, pembangunan selanjutnya akan jauh lebih cepat-jadi tidak perlu khawatir. Setelah semuanya selesai, Anda siap untuk mengirimkan perubahan Anda dan berkontribusi ke Milvus!</p>
<h3 id="Link-Your-Pull-Request-PR-to-an-Issue" class="common-anchor-header">Tautkan Pull Request (PR) Anda ke sebuah isu</h3><p>Setiap PR ke Milvus harus dikaitkan dengan isu yang relevan. Berikut cara untuk menanganinya:</p>
<ul>
<li><p><strong>Periksa Isu yang Sudah Ada:</strong> Lihatlah melalui<a href="https://github.com/milvus-io/milvus/issues"> pelacak isu Milvus</a> untuk melihat apakah sudah ada isu yang terkait dengan perubahan Anda.</p></li>
<li><p><strong>Buat Masalah Baru:</strong> Jika tidak ada isu yang relevan, buka isu baru dan jelaskan masalah yang Anda selesaikan atau fitur yang Anda tambahkan.</p></li>
</ul>
<h3 id="Submitting-Your-Code" class="common-anchor-header">Mengirimkan Kode Anda</h3><ol>
<li><p><strong>Garpu (Fork) Repositori:</strong> Mulailah dengan melakukan fork<a href="https://github.com/milvus-io/milvus"> repo Milvus</a> ke akun GitHub Anda.</p></li>
<li><p><strong>Membuat Cabang:</strong> Kloning fork Anda secara lokal dan buat cabang baru untuk perubahan Anda.</p></li>
<li><p><strong>Lakukan komit dengan Tanda Tangan yang ditandatangani:</strong> Pastikan komit Anda menyertakan tanda tangan <code translate="no">Signed-off-by</code> untuk mematuhi lisensi sumber terbuka:</p></li>
</ol>
<pre><code translate="no">git commit -m <span class="hljs-string">&quot;Commit of your change&quot;</span> -s
<button class="copy-code-btn"></button></code></pre>
<p>Langkah ini mengesahkan kontribusi Anda sesuai dengan Developer Certificate of Origin (DCO).</p>
<h4 id="Helpful-Resources" class="common-anchor-header"><strong>Sumber Daya Bermanfaat</strong></h4><p>Untuk langkah-langkah terperinci dan praktik terbaik, lihat<a href="https://github.com/milvus-io/milvus/blob/master/CONTRIBUTING.md"> Panduan Kontribusi Milvus</a>.</p>
<h2 id="Opportunities-to-Contribute" class="common-anchor-header">Peluang untuk Berkontribusi<button data-href="#Opportunities-to-Contribute" class="anchor-icon" translate="no">
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
    </button></h2><p>Selamat-Anda telah membuat Milvus aktif dan berjalan! Anda telah menjelajahi mode penerapannya, menjalankan pengujian, dan bahkan mungkin menggali kodenya. Sekarang saatnya untuk naik level: berkontribusi pada <a href="https://github.com/milvus-io/milvus">Milvus</a> dan membantu membentuk masa depan AI dan <a href="https://zilliz.com/learn/introduction-to-unstructured-data">data tak terstruktur</a>.</p>
<p>Apa pun keahlian Anda, selalu ada tempat untuk Anda di komunitas Milvus! Apakah Anda seorang pengembang yang suka memecahkan tantangan yang rumit, penulis teknologi yang suka menulis dokumentasi yang jelas atau blog teknik, atau penggemar Kubernetes yang ingin meningkatkan penerapan, ada cara bagi Anda untuk memberikan dampak.</p>
<p>Lihatlah peluang di bawah ini dan temukan yang cocok untuk Anda. Setiap kontribusi membantu memajukan Milvus-dan siapa tahu? Permintaan bantuan Anda berikutnya mungkin akan mendorong gelombang inovasi berikutnya. Jadi, tunggu apa lagi? Mari kita mulai! 🚀</p>
<table>
<thead>
<tr><th>Proyek</th><th>Cocok untuk</th><th>Pedoman</th></tr>
</thead>
<tbody>
<tr><td><a href="https://github.com/milvus-io/milvus">milvus</a>, <a href="https://github.com/milvus-io/milvus-sdk-go">milvus-sdk-go</a></td><td>Pengembang Go</td><td>/</td></tr>
<tr><td><a href="https://github.com/milvus-io/milvus">milvus</a>, <a href="https://github.com/milvus-io/knowhere">knowhere</a></td><td>Pengembang CPP</td><td>/</td></tr>
<tr><td><a href="https://github.com/milvus-io/pymilvus">pymilvus</a>, <a href="https://github.com/milvus-io/milvus-sdk-node">milvus-sdk-node</a>, <a href="https://github.com/milvus-io/milvus-sdk-java">milvus-sdk-java</a></td><td>Pengembang yang tertarik dengan bahasa lain</td><td><a href="https://github.com/milvus-io/pymilvus/blob/master/CONTRIBUTING.md">Berkontribusi untuk PyMilvus</a></td></tr>
<tr><td><a href="https://github.com/milvus-io/milvus-helm">milvus-helm</a></td><td>Penggemar Kubernetes</td><td>/</td></tr>
<tr><td><a href="https://github.com/milvus-io/milvus-docs">Milvus-docs</a>, <a href="https://github.com/milvus-io/community">milvus-io/komunitas/blog</a></td><td>Penulis teknologi</td><td><a href="https://github.com/milvus-io/milvus-docs/blob/v2.0.0/CONTRIBUTING.md">Berkontribusi di milvus docs</a></td></tr>
<tr><td><a href="https://github.com/zilliztech/milvus-insight">milvus-insight</a></td><td>Pengembang web</td><td>/</td></tr>
</tbody>
</table>
<h2 id="A-Final-Word" class="common-anchor-header">Kata Penutup<button data-href="#A-Final-Word" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus menawarkan berbagai <a href="https://milvus.io/docs/install-pymilvus.md">SDK-Python</a> (PyMilvus), <a href="https://milvus.io/docs/install-java.md">Java</a>, <a href="https://milvus.io/docs/install-go.md">Go</a>, dan <a href="https://milvus.io/docs/install-node.md">Node.js-yang</a>memudahkan untuk mulai membangun. Berkontribusi di Milvus bukan hanya tentang kode, tetapi juga tentang bergabung dengan komunitas yang dinamis dan inovatif.</p>
<p>Selamat datang di komunitas pengembang Milvus, dan selamat berkoding! Kami tidak sabar untuk melihat apa yang akan Anda buat.</p>
<h2 id="Further-Reading" class="common-anchor-header">Bacaan Lebih Lanjut<button data-href="#Further-Reading" class="anchor-icon" translate="no">
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
<li><p><a href="https://zilliz.com/community">Bergabunglah dengan Komunitas Pengembang AI Milvus</a></p></li>
<li><p><a href="https://zilliz.com/learn/what-is-vector-database">Apa itu Basis Data Vektor dan Bagaimana Cara Kerjanya?</a></p></li>
<li><p><a href="https://zilliz.com/blog/choose-the-right-milvus-deployment-mode-ai-applications">Milvus Lite vs. Standalone vs. Terdistribusi: Mode Mana yang Tepat untuk Anda? </a></p></li>
<li><p><a href="https://zilliz.com/learn/milvus-notebooks">Membangun Aplikasi AI dengan Milvus: Tutorial &amp; Buku Catatan</a></p></li>
<li><p><a href="https://zilliz.com/ai-models">Model AI Berkinerja Terbaik untuk Aplikasi GenAI Anda | Zilliz</a></p></li>
<li><p><a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">Apa itu RAG?</a></p></li>
<li><p><a href="https://zilliz.com/learn/generative-ai">Pusat Sumber Daya AI Generatif | Zilliz</a></p></li>
</ul>
