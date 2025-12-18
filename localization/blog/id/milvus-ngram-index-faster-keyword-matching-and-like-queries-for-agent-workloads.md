---
id: >-
  milvus-ngram-index-faster-keyword-matching-and-like-queries-for-agent-workloads.md
title: >-
  Memperkenalkan Milvus Ngram Index: Pencocokan Kata Kunci dan Kueri Suka yang
  Lebih Cepat untuk Beban Kerja Agen
author: Chenjie Tang
date: 2025-12-16T00:00:00.000Z
cover: assets.zilliz.com/Ngram_Index_cover_9e6063c638.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus, Ngram Index, n-gram search, LIKE queries, full-text search'
meta_title: >
  Milvus Ngram Index: Faster Keyword Matching and LIKE Queries for Agent
  Workloads
desc: >-
  Pelajari bagaimana Indeks Ngram di Milvus mempercepat kueri LIKE dengan
  mengubah pencocokan substring menjadi pencarian n-gram yang efisien, sehingga
  memberikan kinerja 100× lebih cepat.
origin: >-
  https://milvus.io/blog/milvus-ngram-index-faster-keyword-matching-and-like-queries-for-agent-workloads.md
---
<p>Dalam sistem agen, <strong>pengambilan konteks</strong> adalah blok bangunan dasar di seluruh pipeline, yang menyediakan dasar untuk penalaran, perencanaan, dan tindakan hilir. Pencarian vektor membantu agen mengambil konteks yang relevan secara semantik yang menangkap maksud dan makna di seluruh kumpulan data yang besar dan tidak terstruktur. Namun, relevansi semantik saja sering kali tidak cukup. Pipeline agen juga mengandalkan pencarian teks lengkap untuk menerapkan batasan kata kunci yang tepat-seperti nama produk, panggilan fungsi, kode kesalahan, atau istilah yang signifikan secara hukum. Lapisan pendukung ini memastikan bahwa konteks yang diambil tidak hanya relevan, tetapi juga secara eksplisit memenuhi persyaratan tekstual yang sulit.</p>
<p>Beban kerja nyata secara konsisten mencerminkan kebutuhan ini:</p>
<ul>
<li><p>Asisten dukungan pelanggan harus menemukan percakapan yang menyebutkan produk atau bahan tertentu.</p></li>
<li><p>Kopilot pengkodean mencari cuplikan yang berisi nama fungsi, panggilan API, atau string kesalahan yang tepat.</p></li>
<li><p>Agen hukum, medis, dan akademis menyaring dokumen untuk mencari klausa atau kutipan yang harus muncul kata demi kata.</p></li>
</ul>
<p>Secara tradisional, sistem telah menangani hal ini dengan operator SQL <code translate="no">LIKE</code>. Kueri seperti <code translate="no">name LIKE '%rod%'</code> sederhana dan didukung secara luas, tetapi di bawah konkurensi yang tinggi dan volume data yang besar, kesederhanaan ini membawa biaya kinerja yang besar.</p>
<ul>
<li><p><strong>Tanpa indeks</strong>, kueri <code translate="no">LIKE</code> memindai seluruh penyimpanan konteks dan menerapkan pencocokan pola baris demi baris. Dengan jutaan record, bahkan satu kueri saja bisa memakan waktu beberapa detik - terlalu lambat untuk interaksi agen secara real-time.</p></li>
<li><p><strong>Bahkan dengan indeks terbalik konvensional</strong>, pola wildcard seperti <code translate="no">%rod%</code> tetap sulit untuk dioptimalkan karena mesin masih harus menelusuri seluruh kamus dan menjalankan pencocokan pola pada setiap entri. Operasi ini menghindari pemindaian baris tetapi tetap linear secara fundamental, sehingga hanya menghasilkan peningkatan yang marginal.</p></li>
</ul>
<p>Hal ini menciptakan kesenjangan yang jelas dalam sistem pencarian hibrida: pencarian vektor menangani relevansi semantik secara efisien, tetapi pemfilteran kata kunci yang tepat seringkali menjadi langkah paling lambat dalam proses.</p>
<p>Milvus secara native mendukung pencarian vektor hibrida dan pencarian teks lengkap dengan pemfilteran metadata. Untuk mengatasi keterbatasan pencocokan kata kunci, Milvus memperkenalkan <a href="https://milvus.io/docs/ngram.md"><strong>Indeks Ngram</strong></a>, yang meningkatkan kinerja <code translate="no">LIKE</code> dengan memecah teks menjadi beberapa substring kecil dan mengindeksnya untuk pencarian yang efisien. Hal ini secara dramatis mengurangi jumlah data yang diperiksa selama eksekusi kueri, memberikan <strong>puluhan hingga ratusan kali lebih cepat</strong> <code translate="no">LIKE</code> kueri dalam beban kerja agen yang nyata.</p>
<p>Bagian selanjutnya dari artikel ini akan menjelaskan cara kerja Ngram Index di Milvus dan mengevaluasi kinerjanya dalam skenario dunia nyata.</p>
<h2 id="What-Is-the-Ngram-Index" class="common-anchor-header">Apa itu Indeks Ngram?<button data-href="#What-Is-the-Ngram-Index" class="anchor-icon" translate="no">
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
    </button></h2><p>Dalam database, pemfilteran teks biasanya diekspresikan menggunakan <strong>SQL</strong>, bahasa kueri standar yang digunakan untuk mengambil dan mengelola data. Salah satu operator teks yang paling banyak digunakan adalah <code translate="no">LIKE</code>, yang mendukung pencocokan string berbasis pola.</p>
<p>Ekspresi LIKE dapat dikelompokkan secara luas ke dalam empat jenis pola umum, tergantung pada bagaimana karakter pengganti (wildcard) digunakan:</p>
<ul>
<li><p><strong>Pencocokan infiks</strong> (<code translate="no">name LIKE '%rod%'</code>): Mencocokkan catatan di mana batang substring muncul di mana saja dalam teks.</p></li>
<li><p><strong>Pencocokan awalan</strong> (<code translate="no">name LIKE 'rod%'</code>): Mencocokkan catatan yang teksnya dimulai dengan batang.</p></li>
<li><p><strong>Pencocokan akhiran</strong> (<code translate="no">name LIKE '%rod'</code>): Mencocokkan catatan yang teksnya diakhiri dengan batang.</p></li>
<li><p><strong>Pencocokan karakter</strong> pengganti (<code translate="no">name LIKE '%rod%aab%bc_de'</code>): Menggabungkan beberapa kondisi substring (<code translate="no">%</code>) dengan wildcard karakter tunggal (<code translate="no">_</code>) dalam satu pola.</p></li>
</ul>
<p>Meskipun pola-pola ini berbeda dalam penampilan dan ekspresifitasnya, <strong>Indeks Ngram</strong> di Milvus mempercepat semuanya dengan menggunakan pendekatan yang sama.</p>
<p>Sebelum membangun indeks, Milvus membagi setiap nilai teks menjadi substring-substring pendek yang saling tumpang tindih dengan panjang yang tetap, yang dikenal sebagai <em>n-gram</em>. Sebagai contoh, ketika n = 3, kata <strong>"Milvus"</strong> diuraikan menjadi 3-gram berikut: <strong>"Mil",</strong> <strong>"ilv",</strong> <strong>"lvu"</strong>, dan <strong>"vus"</strong>. Setiap n-gram kemudian disimpan dalam indeks terbalik yang memetakan substring ke kumpulan ID dokumen tempat substring tersebut muncul. Pada waktu kueri, kondisi <code translate="no">LIKE</code> diterjemahkan ke dalam kombinasi pencarian n-gram, yang memungkinkan Milvus untuk dengan cepat menyaring sebagian besar catatan yang tidak cocok dan mengevaluasi pola terhadap kumpulan kandidat yang jauh lebih kecil. Inilah yang mengubah pemindaian string yang mahal menjadi kueri berbasis indeks yang efisien.</p>
<p>Dua parameter mengontrol bagaimana Indeks Ngram dibangun: <code translate="no">min_gram</code> dan <code translate="no">max_gram</code>. Bersama-sama, keduanya mendefinisikan rentang panjang substring yang dihasilkan dan diindeks oleh Milvus.</p>
<ul>
<li><p><strong><code translate="no">min_gram</code></strong>: Panjang substring terpendek untuk diindeks. Dalam praktiknya, ini juga menentukan panjang substring kueri minimum yang dapat memanfaatkan Indeks Ngram</p></li>
<li><p><strong><code translate="no">max_gram</code></strong>: Panjang substring terpanjang untuk diindeks. Pada waktu kueri, ini juga menentukan ukuran jendela maksimum yang digunakan ketika membagi string kueri yang lebih panjang menjadi n-gram.</p></li>
</ul>
<p>Dengan mengindeks semua substring yang bersebelahan yang panjangnya berada di antara <code translate="no">min_gram</code> dan <code translate="no">max_gram</code>, Milvus membangun fondasi yang konsisten dan efisien untuk mempercepat semua jenis pola <code translate="no">LIKE</code> yang didukung.</p>
<h2 id="How-Does-the-Ngram-Index-Work" class="common-anchor-header">Bagaimana Cara Kerja Indeks Ngram?<button data-href="#How-Does-the-Ngram-Index-Work" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus mengimplementasikan Indeks Ngram dalam proses dua tahap:</p>
<ul>
<li><p><strong>Membangun indeks:</strong> Menghasilkan n-gram untuk setiap dokumen dan membangun indeks terbalik selama proses pemasukan data.</p></li>
<li><p><strong>Mempercepat kueri:</strong> Gunakan indeks untuk mempersempit pencarian ke sekumpulan kandidat kecil, lalu verifikasi kecocokan <code translate="no">LIKE</code> yang tepat pada kandidat tersebut.</p></li>
</ul>
<p>Contoh konkret membuat proses ini lebih mudah dipahami.</p>
<h3 id="Phase-1-Build-the-index" class="common-anchor-header">Tahap 1: Membangun indeks</h3><p><strong>Menguraikan teks menjadi n-gram:</strong></p>
<p>Asumsikan kita mengindeks teks <strong>"Apple"</strong> dengan pengaturan berikut:</p>
<ul>
<li><p><code translate="no">min_gram = 2</code></p></li>
<li><p><code translate="no">max_gram = 3</code></p></li>
</ul>
<p>Di bawah pengaturan ini, Milvus menghasilkan semua substring yang bersebelahan dengan panjang 2 dan 3:</p>
<ul>
<li><p>2-gram: <code translate="no">Ap</code>, <code translate="no">pp</code>, <code translate="no">pl</code>, <code translate="no">le</code></p></li>
<li><p>3-gram: <code translate="no">App</code>, <code translate="no">ppl</code>, <code translate="no">ple</code></p></li>
</ul>
<p><strong>Membangun indeks terbalik:</strong></p>
<p>Sekarang perhatikan sebuah set data kecil yang terdiri dari lima catatan:</p>
<ul>
<li><p><strong>Dokumen 0</strong>: <code translate="no">Apple</code></p></li>
<li><p><strong>Dokumen 1</strong> <code translate="no">Pineapple</code></p></li>
<li><p><strong>Dokumen 2</strong> <code translate="no">Maple</code></p></li>
<li><p><strong>Dokumen 3</strong> <code translate="no">Apply</code></p></li>
<li><p><strong>Dokumen 4</strong>: <code translate="no">Snapple</code></p></li>
</ul>
<p>Selama proses ingestion, Milvus menghasilkan n-gram untuk setiap catatan dan memasukkannya ke dalam indeks terbalik. Dalam indeks ini:</p>
<ul>
<li><p><strong>Kunci</strong> adalah n-gram (substring)</p></li>
<li><p><strong>Nilai</strong> adalah daftar ID dokumen di mana n-gram muncul</p></li>
</ul>
<pre><code translate="no"><span class="hljs-string">&quot;Ap&quot;</span>  -&gt; [<span class="hljs-number">0</span>, <span class="hljs-number">3</span>]
<span class="hljs-string">&quot;App&quot;</span> -&gt; [<span class="hljs-number">0</span>, <span class="hljs-number">3</span>]
<span class="hljs-string">&quot;Ma&quot;</span>  -&gt; [<span class="hljs-number">2</span>]
<span class="hljs-string">&quot;Map&quot;</span> -&gt; [<span class="hljs-number">2</span>]
<span class="hljs-string">&quot;Pi&quot;</span>  -&gt; [<span class="hljs-number">1</span>]
<span class="hljs-string">&quot;Pin&quot;</span> -&gt; [<span class="hljs-number">1</span>]
<span class="hljs-string">&quot;Sn&quot;</span>  -&gt; [<span class="hljs-number">4</span>]
<span class="hljs-string">&quot;Sna&quot;</span> -&gt; [<span class="hljs-number">4</span>]
<span class="hljs-string">&quot;ap&quot;</span>  -&gt; [<span class="hljs-number">1</span>, <span class="hljs-number">2</span>, <span class="hljs-number">4</span>]
<span class="hljs-string">&quot;apl&quot;</span> -&gt; [<span class="hljs-number">2</span>]
<span class="hljs-string">&quot;app&quot;</span> -&gt; [<span class="hljs-number">1</span>, <span class="hljs-number">4</span>]
<span class="hljs-string">&quot;ea&quot;</span>  -&gt; [<span class="hljs-number">1</span>]
<span class="hljs-string">&quot;eap&quot;</span> -&gt; [<span class="hljs-number">1</span>]
<span class="hljs-string">&quot;in&quot;</span>  -&gt; [<span class="hljs-number">1</span>]
<span class="hljs-string">&quot;ine&quot;</span> -&gt; [<span class="hljs-number">1</span>]
<span class="hljs-string">&quot;le&quot;</span>  -&gt; [<span class="hljs-number">0</span>, <span class="hljs-number">1</span>, <span class="hljs-number">2</span>, <span class="hljs-number">4</span>]
<span class="hljs-string">&quot;ly&quot;</span>  -&gt; [<span class="hljs-number">3</span>]
<span class="hljs-string">&quot;na&quot;</span>  -&gt; [<span class="hljs-number">4</span>]
<span class="hljs-string">&quot;nap&quot;</span> -&gt; [<span class="hljs-number">4</span>]
<span class="hljs-string">&quot;ne&quot;</span>  -&gt; [<span class="hljs-number">1</span>]
<span class="hljs-string">&quot;nea&quot;</span> -&gt; [<span class="hljs-number">1</span>]
<span class="hljs-string">&quot;pl&quot;</span>  -&gt; [<span class="hljs-number">0</span>, <span class="hljs-number">1</span>, <span class="hljs-number">2</span>, <span class="hljs-number">3</span>, <span class="hljs-number">4</span>]
<span class="hljs-string">&quot;ple&quot;</span> -&gt; [<span class="hljs-number">0</span>, <span class="hljs-number">1</span>, <span class="hljs-number">2</span>, <span class="hljs-number">4</span>]
<span class="hljs-string">&quot;ply&quot;</span> -&gt; [<span class="hljs-number">3</span>]
<span class="hljs-string">&quot;pp&quot;</span>  -&gt; [<span class="hljs-number">0</span>, <span class="hljs-number">1</span>, <span class="hljs-number">3</span>, <span class="hljs-number">4</span>]
<span class="hljs-string">&quot;ppl&quot;</span> -&gt; [<span class="hljs-number">0</span>, <span class="hljs-number">1</span>, <span class="hljs-number">3</span>, <span class="hljs-number">4</span>]
<button class="copy-code-btn"></button></code></pre>
<p>Sekarang indeks sudah selesai dibangun.</p>
<h3 id="Phase-2-Accelerate-queries" class="common-anchor-header">Tahap 2: Mempercepat kueri</h3><p>Ketika filter <code translate="no">LIKE</code> dijalankan, Milvus menggunakan Indeks Ngram untuk mempercepat evaluasi kueri melalui langkah-langkah berikut:</p>
<p><strong>1. Ekstrak istilah kueri:</strong> Substring yang bersebelahan tanpa karakter pengganti diekstrak dari ekspresi <code translate="no">LIKE</code> (misalnya, <code translate="no">'%apple%'</code> menjadi <code translate="no">apple</code>).</p>
<p><strong>2. Menguraikan istilah kueri:</strong> Istilah kueri diuraikan menjadi n-gram berdasarkan panjangnya (<code translate="no">L</code>) dan <code translate="no">min_gram</code> dan <code translate="no">max_gram</code> yang telah dikonfigurasi.</p>
<p><strong>3. Cari setiap gram &amp; potong:</strong> Milvus mencari n-gram kueri dalam indeks terbalik dan memotong daftar ID dokumen mereka untuk menghasilkan set kandidat kecil.</p>
<p><strong>4. Verifikasi dan kembalikan hasilnya:</strong> Kondisi asli <code translate="no">LIKE</code> diterapkan hanya pada kumpulan kandidat ini untuk menentukan hasil akhir.</p>
<p>Dalam praktiknya, cara kueri dipecah menjadi n-gram tergantung pada bentuk pola itu sendiri. Untuk melihat cara kerjanya, kita akan fokus pada dua kasus umum: pencocokan infiks dan pencocokan wildcard. Pencocokan awalan dan akhiran berperilaku sama dengan pencocokan infiks, jadi kita tidak akan membahasnya secara terpisah.</p>
<p><strong>Pencocokan infiks</strong></p>
<p>Untuk pencocokan infix, eksekusi bergantung pada panjang substring literal (<code translate="no">L</code>) relatif terhadap <code translate="no">min_gram</code> dan <code translate="no">max_gram</code>.</p>
<p><strong>1. <code translate="no">min_gram ≤ L ≤ max_gram</code></strong> (misalnya, <code translate="no">strField LIKE '%ppl%'</code>)</p>
<p>Substring literal <code translate="no">ppl</code> sepenuhnya berada dalam rentang n-gram yang dikonfigurasi. Milvus secara langsung mencari n-gram <code translate="no">&quot;ppl&quot;</code> dalam indeks terbalik, menghasilkan ID dokumen kandidat <code translate="no">[0, 1, 3, 4]</code>.</p>
<p>Karena literal itu sendiri adalah n-gram yang diindeks, semua kandidat sudah memenuhi kondisi infiks. Langkah verifikasi terakhir tidak menghilangkan catatan apa pun, dan hasilnya tetap <code translate="no">[0, 1, 3, 4]</code>.</p>
<p><strong>2. <code translate="no">L &gt; max_gram</code></strong> (misalnya, <code translate="no">strField LIKE '%pple%'</code>)</p>
<p>Substring literal <code translate="no">pple</code> lebih panjang daripada <code translate="no">max_gram</code>, sehingga diuraikan menjadi n-gram yang tumpang tindih dengan menggunakan ukuran jendela <code translate="no">max_gram</code>. Dengan <code translate="no">max_gram = 3</code>, hal ini menghasilkan n-gram <code translate="no">&quot;ppl&quot;</code> dan <code translate="no">&quot;ple&quot;</code>.</p>
<p>Milvus mencari setiap n-gram dalam indeks terbalik:</p>
<ul>
<li><p><code translate="no">&quot;ppl&quot;</code> → <code translate="no">[0, 1, 3, 4]</code></p></li>
<li><p><code translate="no">&quot;ple&quot;</code> → <code translate="no">[0, 1, 2, 4]</code></p></li>
</ul>
<p>Perpotongan daftar-daftar ini menghasilkan himpunan kandidat <code translate="no">[0, 1, 4]</code>. Filter <code translate="no">LIKE '%pple%'</code> yang asli kemudian diterapkan pada kandidat-kandidat ini. Ketiganya memenuhi syarat, sehingga hasil akhirnya tetap <code translate="no">[0, 1, 4]</code>.</p>
<p><strong>3. <code translate="no">L &lt; min_gram</code></strong> (misalnya, <code translate="no">strField LIKE '%pp%'</code>)</p>
<p>Substring literal lebih pendek daripada <code translate="no">min_gram</code> dan oleh karena itu tidak dapat diuraikan menjadi n-gram yang diindeks. Dalam kasus ini, Indeks Ngram tidak dapat digunakan, dan Milvus kembali ke jalur eksekusi default, mengevaluasi kondisi <code translate="no">LIKE</code> melalui pemindaian penuh dengan pencocokan pola.</p>
<p><strong>Pencocokan wildcard</strong> (misalnya, <code translate="no">strField LIKE '%Ap%pple%'</code>)</p>
<p>Pola ini mengandung beberapa karakter pengganti, sehingga Milvus pertama-tama memecahnya menjadi beberapa literal yang bersebelahan: <code translate="no">&quot;Ap&quot;</code> dan <code translate="no">&quot;pple&quot;</code>.</p>
<p>Milvus kemudian memproses setiap literal secara terpisah:</p>
<ul>
<li><p><code translate="no">&quot;Ap&quot;</code> memiliki panjang 2 dan berada dalam rentang n-gram.</p></li>
<li><p><code translate="no">&quot;pple&quot;</code> lebih panjang dari <code translate="no">max_gram</code> dan diuraikan menjadi <code translate="no">&quot;ppl&quot;</code> dan <code translate="no">&quot;ple&quot;</code>.</p></li>
</ul>
<p>Hal ini mengurangi kueri menjadi n-gram berikut ini:</p>
<ul>
<li><p><code translate="no">&quot;Ap&quot;</code> → <code translate="no">[0, 3]</code></p></li>
<li><p><code translate="no">&quot;ppl&quot;</code> → <code translate="no">[0, 1, 3, 4]</code></p></li>
<li><p><code translate="no">&quot;ple&quot;</code> → <code translate="no">[0, 1, 2, 4]</code></p></li>
</ul>
<p>Perpotongan daftar ini menghasilkan satu kandidat: <code translate="no">[0]</code>.</p>
<p>Akhirnya, filter <code translate="no">LIKE '%Ap%pple%'</code> asli diterapkan pada dokumen 0 (<code translate="no">&quot;Apple&quot;</code>). Karena tidak memenuhi pola penuh, kumpulan hasil akhirnya kosong.</p>
<h2 id="Limitations-and-Trade-offs-of-the-Ngram-Index" class="common-anchor-header">Keterbatasan dan Trade-off dari Indeks Ngram<button data-href="#Limitations-and-Trade-offs-of-the-Ngram-Index" class="anchor-icon" translate="no">
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
    </button></h2><p>Meskipun Indeks Ngram dapat secara signifikan meningkatkan kinerja kueri <code translate="no">LIKE</code>, indeks ini memperkenalkan trade-off yang harus dipertimbangkan dalam penerapan di dunia nyata.</p>
<ul>
<li><strong>Peningkatan ukuran indeks</strong></li>
</ul>
<p>Biaya utama dari Indeks Ngram adalah biaya penyimpanan yang lebih tinggi. Karena indeks menyimpan semua substring yang bersebelahan yang panjangnya berada di antara <code translate="no">min_gram</code> dan <code translate="no">max_gram</code>, jumlah n-gram yang dihasilkan tumbuh dengan cepat seiring dengan meluasnya rentang ini. Setiap penambahan panjang n-gram secara efektif menambahkan satu set lengkap substring yang tumpang tindih untuk setiap nilai teks, sehingga meningkatkan jumlah kunci indeks dan daftar postingnya. Dalam praktiknya, memperluas jangkauan hanya dengan satu karakter dapat menggandakan ukuran indeks secara kasar dibandingkan dengan indeks terbalik standar.</p>
<ul>
<li><strong>Tidak efektif untuk semua beban kerja</strong></li>
</ul>
<p>Indeks Ngram tidak mempercepat setiap beban kerja. Jika pola kueri sangat tidak teratur, mengandung literal yang sangat pendek, atau gagal mengurangi dataset menjadi kumpulan kandidat yang kecil pada fase pemfilteran, manfaat kinerjanya mungkin terbatas. Dalam kasus seperti itu, eksekusi kueri masih dapat mendekati biaya pemindaian penuh, meskipun indeksnya ada.</p>
<h2 id="Evaluating-Ngram-Index-Performance-on-LIKE-Queries" class="common-anchor-header">Mengevaluasi Kinerja Indeks Ngram pada Kueri LIKE<button data-href="#Evaluating-Ngram-Index-Performance-on-LIKE-Queries" class="anchor-icon" translate="no">
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
    </button></h2><p>Tujuan dari tolok ukur ini adalah untuk mengevaluasi seberapa efektif Indeks Ngram mempercepat kueri <code translate="no">LIKE</code> dalam praktiknya.</p>
<h3 id="Test-Methodology" class="common-anchor-header">Metodologi Pengujian</h3><p>Untuk menempatkan kinerjanya dalam konteks, kami membandingkannya dengan dua mode eksekusi dasar:</p>
<ul>
<li><p><strong>Master</strong>: Eksekusi secara brute-force tanpa indeks apa pun.</p></li>
<li><p><strong>Master-terbalik</strong>: Eksekusi menggunakan indeks terbalik konvensional.</p></li>
</ul>
<p>Kami merancang dua skenario pengujian untuk mencakup karakteristik data yang berbeda:</p>
<ul>
<li><p><strong>Kumpulan data teks wiki</strong>: 100.000 baris, dengan setiap bidang teks dipotong menjadi 1 KB.</p></li>
<li><p><strong>Dataset kata tunggal</strong>: 1.000.000 baris, di mana setiap baris berisi satu kata.</p></li>
</ul>
<p>Di kedua skenario, pengaturan berikut diterapkan secara konsisten:</p>
<ul>
<li><p>Kueri menggunakan <strong>pola pencocokan infiks</strong> (<code translate="no">%xxx%</code>)</p></li>
<li><p>Indeks Ngram dikonfigurasikan dengan <code translate="no">min_gram = 2</code> dan <code translate="no">max_gram = 4</code></p></li>
<li><p>Untuk mengisolasi biaya eksekusi kueri dan menghindari overhead perwujudan hasil, semua kueri mengembalikan <code translate="no">count(*)</code>, bukan set hasil lengkap.</p></li>
</ul>
<h3 id="Results" class="common-anchor-header">Hasil</h3><p><strong>Tes untuk wiki, setiap baris adalah teks wiki dengan panjang konten terpotong 1000, 100K baris</strong></p>
<table>
<thead>
<tr><th></th><th>Literal</th><th>Waktu (ms)</th><th>Kecepatan</th><th>Hitung</th></tr>
</thead>
<tbody>
<tr><td>Master</td><td>stadion</td><td>207.8</td><td></td><td>335</td></tr>
<tr><td>Master-terbalik</td><td></td><td>2095</td><td></td><td>335</td></tr>
<tr><td>Ngram</td><td></td><td>1.09</td><td>190 / 1922</td><td>335</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>Guru</td><td>sekolah menengah</td><td>204.8</td><td></td><td>340</td></tr>
<tr><td>Master-terbalik</td><td></td><td>2000</td><td></td><td>340</td></tr>
<tr><td>Ngram</td><td></td><td>1.26</td><td>162.5 / 1587</td><td>340</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>Guru</td><td>adalah sponsor sekolah menengah yang bersifat koedukasi</td><td>223.9</td><td></td><td>1</td></tr>
<tr><td>Guru terbalik</td><td></td><td>2100</td><td></td><td>1</td></tr>
<tr><td>Ngram</td><td></td><td>1.69</td><td>132.5 / 1242.6</td><td>1</td></tr>
</tbody>
</table>
<p><strong>Tes untuk kata tunggal, 1 juta baris</strong></p>
<table>
<thead>
<tr><th></th><th>Literal</th><th>Waktu (ms)</th><th>Percepatan</th><th>Hitung</th></tr>
</thead>
<tbody>
<tr><td>Menguasai</td><td>na</td><td>128.6</td><td></td><td>40430</td></tr>
<tr><td>Master-terbalik</td><td></td><td>66.5</td><td></td><td>40430</td></tr>
<tr><td>Ngram</td><td></td><td>1.38</td><td>93.2 / 48.2</td><td>40430</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>Guru</td><td>nat</td><td>122</td><td></td><td>5200</td></tr>
<tr><td>Master-terbalik</td><td></td><td>65.1</td><td></td><td>5200</td></tr>
<tr><td>Ngram</td><td></td><td>1.27</td><td>96 / 51.3</td><td>5200</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>Guru</td><td>nati</td><td>118.8</td><td></td><td>1630</td></tr>
<tr><td>Master-terbalik</td><td></td><td>66.9</td><td></td><td>1630</td></tr>
<tr><td>Ngram</td><td></td><td>1.21</td><td>98.2 / 55.3</td><td>1630</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>Master</td><td>natio</td><td>118.4</td><td></td><td>1100</td></tr>
<tr><td>Master terbalik</td><td></td><td>65.1</td><td></td><td>1100</td></tr>
<tr><td>Ngram</td><td></td><td>1.33</td><td>89 / 48.9</td><td>1100</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>Guru</td><td>bangsa</td><td>118</td><td></td><td>1100</td></tr>
<tr><td>Master-terbalik</td><td></td><td>63.3</td><td></td><td>1100</td></tr>
<tr><td>Ngram</td><td></td><td>1.4</td><td>84.3 / 45.2</td><td>1100</td></tr>
</tbody>
</table>
<p><strong>Catatan:</strong> Hasil ini didasarkan pada tolok ukur yang dilakukan pada bulan Mei. Sejak saat itu, cabang Master telah mengalami pengoptimalan kinerja tambahan, sehingga kesenjangan kinerja yang diamati di sini diharapkan lebih kecil pada versi saat ini.</p>
<p>Hasil tolok ukur menyoroti sebuah pola yang jelas: Indeks Ngram secara signifikan mempercepat kueri LIKE di semua kasus, dan seberapa cepat kueri berjalan sangat bergantung pada struktur dan panjang data teks yang mendasarinya.</p>
<ul>
<li><p>Untuk <strong>bidang teks yang panjang</strong>, seperti dokumen gaya Wikipedia yang terpotong hingga 1.000 byte, peningkatan kinerja sangat terasa. Dibandingkan dengan eksekusi brute-force tanpa indeks, Indeks Ngram mencapai kecepatan sekitar <strong>100-200×</strong>. Jika dibandingkan dengan inverted index konvensional, peningkatannya bahkan lebih dramatis, mencapai <strong>1.200-1.900×</strong>. Hal ini dikarenakan kueri LIKE pada teks yang panjang sangat mahal untuk pendekatan pengindeksan tradisional, sementara pencarian n-gram dapat dengan cepat mempersempit ruang pencarian ke sekumpulan kandidat yang sangat kecil.</p></li>
<li><p>Pada kumpulan data yang terdiri dari <strong>entri kata tunggal</strong>, keuntungannya lebih kecil tetapi masih substansial. Dalam skenario ini, Indeks Ngram berjalan sekitar <strong>80-100×</strong> lebih cepat daripada eksekusi brute-force dan <strong>45-55×</strong> lebih cepat daripada indeks terbalik konvensional. Meskipun teks yang lebih pendek pada dasarnya lebih murah untuk dipindai, pendekatan berbasis n-gram masih menghindari perbandingan yang tidak perlu dan secara konsisten mengurangi biaya kueri.</p></li>
</ul>
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
    </button></h2><p>Indeks Ngram mempercepat kueri <code translate="no">LIKE</code> dengan memecah teks menjadi n-gram dengan panjang tetap dan mengindeksnya menggunakan struktur terbalik. Desain ini mengubah pencocokan substring yang mahal menjadi pencarian n-gram yang efisien diikuti dengan verifikasi minimal. Hasilnya, pemindaian teks lengkap dapat dihindari sementara semantik yang tepat dari <code translate="no">LIKE</code> tetap terjaga.</p>
<p>Dalam praktiknya, pendekatan ini efektif untuk berbagai macam beban kerja, dengan hasil yang sangat baik untuk pencocokan fuzzy pada bidang teks yang panjang. Oleh karena itu, Ngram Index sangat cocok untuk skenario real-time seperti pencarian kode, agen dukungan pelanggan, pengambilan dokumen hukum dan medis, basis pengetahuan perusahaan, dan pencarian akademis, di mana pencocokan kata kunci yang tepat tetap penting.</p>
<p>Pada saat yang sama, Indeks Ngram mendapatkan manfaat dari konfigurasi yang cermat. Memilih nilai <code translate="no">min_gram</code> dan <code translate="no">max_gram</code> yang tepat sangat penting untuk menyeimbangkan ukuran indeks dan kinerja kueri. Ketika disetel untuk mencerminkan pola kueri yang sebenarnya, Indeks Ngram memberikan solusi praktis dan terukur untuk kueri <code translate="no">LIKE</code> berkinerja tinggi dalam sistem produksi.</p>
<p>Untuk informasi lebih lanjut tentang Indeks Ngram, lihat dokumentasi di bawah ini:</p>
<ul>
<li><a href="https://milvus.io/docs/ngram.md">Indeks Ngram | Dokumentasi Milvus</a></li>
</ul>
<p>Ada pertanyaan atau ingin mendalami fitur Milvus terbaru? Bergabunglah dengan<a href="https://discord.com/invite/8uyFbECzPX"> saluran Discord</a> kami atau ajukan pertanyaan di<a href="https://github.com/milvus-io/milvus"> GitHub</a>. Anda juga dapat memesan sesi tatap muka selama 20 menit untuk mendapatkan wawasan, panduan, dan jawaban atas pertanyaan Anda melalui<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Jam Kerja Milvus</a>.</p>
<h2 id="Learn-More-about-Milvus-26-Features" class="common-anchor-header">Pelajari Lebih Lanjut tentang Fitur Milvus 2.6<button data-href="#Learn-More-about-Milvus-26-Features" class="anchor-icon" translate="no">
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
<li><p><a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md">Memperkenalkan Milvus 2.6: Pencarian Vektor yang Terjangkau dalam Skala Miliaran</a></p></li>
<li><p><a href="https://milvus.io/blog/data-in-and-data-out-in-milvus-2-6.md">Memperkenalkan Fungsi Penyematan: Bagaimana Milvus 2.6 Menyederhanakan Vektorisasi dan Pencarian Semantik</a></p></li>
<li><p><a href="https://milvus.io/blog/json-shredding-in-milvus-faster-json-filtering-with-flexibility.md">Penghancuran JSON di Milvus: Pemfilteran JSON 88,9x Lebih Cepat dengan Fleksibilitas</a></p></li>
<li><p><a href="https://milvus.io/blog/unlocking-true-entity-level-retrieval-new-array-of-structs-and-max-sim-capabilities-in-milvus.md">Membuka Pengambilan Tingkat Entitas yang Sebenarnya: Kemampuan Array-of-Structs dan MAX_SIM Baru di Milvus</a></p></li>
<li><p><a href="https://milvus.io/blog/unlock-geo-vector-search-with-geometry-fields-and-rtree-index-in-milvus.md">Menyatukan Pemfilteran Geospasial dan Pencarian Vektor dengan Bidang Geometri dan RTREE di Milvus 2.6</a></p></li>
<li><p><a href="https://milvus.io/blog/introducing-aisaq-in-milvus-billion-scale-vector-search-got-3200-cheaper-on-memory.md">Memperkenalkan AISAQ di Milvus: Pencarian Vektor Berskala Miliaran Baru Saja Menjadi 3.200× Lebih Murah dalam Memori</a></p></li>
<li><p><a href="https://milvus.io/blog/faster-index-builds-and-scalable-queries-with-gpu-cagra-in-milvus.md">Mengoptimalkan NVIDIA CAGRA di Milvus: Pendekatan Hibrida GPU-CPU untuk Pengindeksan yang Lebih Cepat dan Kueri yang Lebih Murah</a></p></li>
<li><p><a href="https://milvus.io/blog/minhash-lsh-in-milvus-the-secret-weapon-for-fighting-duplicates-in-llm-training-data.md">MinHash LSH di Milvus: Senjata Rahasia untuk Memerangi Duplikasi dalam Data Pelatihan LLM </a></p></li>
<li><p><a href="https://milvus.io/blog/bring-vector-compression-to-the-extreme-how-milvus-serves-3%C3%97-more-queries-with-rabitq.md">Membawa Kompresi Vektor ke Tingkat Ekstrim: Bagaimana Milvus Melayani Kueri 3× Lebih Banyak dengan RaBitQ</a></p></li>
<li><p><a href="https://milvus.io/blog/benchmarks-lie-vector-dbs-deserve-a-real-test.md">Benchmark Bohong - DB Vektor Layak Mendapat Ujian Nyata </a></p></li>
<li><p><a href="https://milvus.io/blog/we-replaced-kafka-pulsar-with-a-woodpecker-for-milvus.md">Kami Mengganti Kafka/Pulsar dengan Burung Pelatuk untuk Milvus </a></p></li>
</ul>
