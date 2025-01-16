---
id: understanding-consistency-levels-in-the-milvus-vector-database-2.md
title: Memahami Tingkat Konsistensi dalam Basis Data Vektor Milvus - Bagian II
author: Jiquan Long
date: 2022-09-13T00:00:00.000Z
desc: >-
  Anatomi mekanisme di balik tingkat konsistensi yang dapat disetel dalam basis
  data vektor Milvus.
cover: assets.zilliz.com/1280_X1280_0e0d4bc107.png
tag: Engineering
tags: 'Vector Database for AI, Artificial Intelligence, Machine Learning'
canonicalUrl: >-
  https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database-2.md
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1280_X1280_0e0d4bc107.png" alt="Cover_image" class="doc-image" id="cover_image" />
   </span> <span class="img-wrapper"> <span>Gambar sampul</span> </span></p>
<blockquote>
<p>Artikel ini ditulis oleh <a href="https://github.com/longjiquan">Jiquan Long</a> dan diterjemahkan oleh <a href="https://www.linkedin.com/in/yiyun-n-2aa713163/">Angela Ni</a>.</p>
</blockquote>
<p>Dalam <a href="https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database.md">blog sebelumnya</a> tentang konsistensi, kami telah menjelaskan apa yang dimaksud dengan konsistensi dalam basis data vektor terdistribusi, membahas empat tingkat konsistensi - kuat, basi, sesi, dan akhirnya didukung dalam basis data vektor Milvus, dan menjelaskan skenario aplikasi yang paling cocok untuk setiap tingkat konsistensi.</p>
<p>Dalam tulisan ini, kami akan terus memeriksa mekanisme di balik yang memungkinkan pengguna database vektor Milvus untuk secara fleksibel memilih tingkat konsistensi yang ideal untuk berbagai skenario aplikasi. Kami juga akan memberikan tutorial dasar tentang cara menyetel tingkat konsistensi dalam database vektor Milvus.</p>
<p><strong>Langsung ke:</strong></p>
<ul>
<li><a href="#The-underlying-time-tick-mechanism">Mekanisme centang waktu yang mendasari</a></li>
<li><a href="#Guarantee-timestamp">Stempel waktu jaminan</a></li>
<li><a href="#Consistency-levels">Tingkat konsistensi</a></li>
<li><a href="#How-to-tune-consistency-level-in-Milvus">Bagaimana cara menyetel tingkat konsistensi di Milvus?</a></li>
</ul>
<h2 id="The-underlying-time-tick-mechanism" class="common-anchor-header">Mekanisme time tick yang mendasari<button data-href="#The-underlying-time-tick-mechanism" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus menggunakan mekanisme time tick untuk memastikan tingkat konsistensi yang berbeda ketika pencarian atau kueri vektor dilakukan. Time Tick adalah tanda air Milvus yang bertindak seperti jam di Milvus dan menandakan pada titik waktu mana sistem Milvus berada. Setiap kali ada permintaan bahasa manipulasi data (DML) yang dikirim ke basis data vektor Milvus, Milvus akan memberikan cap waktu pada permintaan tersebut. Seperti yang ditunjukkan pada gambar di bawah ini, ketika data baru dimasukkan ke dalam antrean pesan misalnya, Milvus tidak hanya menandai stempel waktu pada data yang dimasukkan ini, tetapi juga menyisipkan tanda waktu pada interval yang teratur.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/timetick_b395df9804.png" alt="timetick" class="doc-image" id="timetick" />
    tanda </span> <span class="img-wrapper"> <span>waktu</span> </span></p>
<p>Mari kita ambil <code translate="no">syncTs1</code> pada gambar di atas sebagai contoh. Ketika konsumen hilir seperti node kueri melihat <code translate="no">syncTs1</code>, komponen konsumen memahami bahwa semua data yang disisipkan lebih awal dari <code translate="no">syncTs1</code> telah dikonsumsi. Dengan kata lain, permintaan penyisipan data yang nilai timestamp-nya lebih kecil dari <code translate="no">syncTs1</code> tidak akan muncul lagi dalam antrean pesan.</p>
<h2 id="Guarantee-Timestamp" class="common-anchor-header">Menjamin Stempel Waktu<button data-href="#Guarantee-Timestamp" class="anchor-icon" translate="no">
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
    </button></h2><p>Seperti yang telah disebutkan pada bagian sebelumnya, komponen konsumen hilir seperti node kueri secara terus menerus mendapatkan pesan permintaan penyisipan data dan time tick dari antrean pesan. Setiap kali sebuah time tick dikonsumsi, node kueri akan menandai time tick yang dikonsumsi ini sebagai waktu yang dapat digunakan - <code translate="no">ServiceTime</code> dan semua data yang disisipkan sebelum <code translate="no">ServiceTime</code> dapat dilihat oleh node kueri.</p>
<p>Selain <code translate="no">ServiceTime</code>, Milvus juga mengadopsi jenis stempel waktu - stempel waktu jaminan (<code translate="no">GuaranteeTS</code>) untuk memenuhi kebutuhan akan berbagai tingkat konsistensi dan ketersediaan oleh pengguna yang berbeda. Ini berarti bahwa pengguna basis data vektor Milvus dapat menentukan <code translate="no">GuaranteeTs</code> untuk menginformasikan kepada simpul kueri bahwa semua data sebelum <code translate="no">GuaranteeTs</code> harus terlihat dan dilibatkan ketika pencarian atau kueri dilakukan.</p>
<p>Biasanya ada dua skenario ketika simpul kueri mengeksekusi permintaan pencarian di basis data vektor Milvus.</p>
<h3 id="Scenario-1-Execute-search-request-immediately" class="common-anchor-header">Skenario 1: Jalankan permintaan pencarian dengan segera</h3><p>Seperti yang ditunjukkan pada gambar di bawah ini, jika <code translate="no">GuaranteeTs</code> lebih kecil dari <code translate="no">ServiceTime</code>, simpul kueri dapat mengeksekusi permintaan pencarian dengan segera.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/execute_immediately_dd1913775d.png" alt="execute_immediately" class="doc-image" id="execute_immediately" />
   </span> <span class="img-wrapper"> <span>mengeksekusi_dengan_segera</span> </span></p>
<h3 id="Scenario-2-Wait-till-ServiceTime--GuaranteeTs" class="common-anchor-header">Skenario 2: Tunggu hingga "ServiceTime &gt; GuaranteeTs"</h3><p>Jika <code translate="no">GuaranteeTs</code> lebih besar dari <code translate="no">ServiceTime</code>, node kueri harus terus mengkonsumsi centang waktu dari antrean pesan. Permintaan pencarian tidak dapat dieksekusi sampai <code translate="no">ServiceTime</code> lebih besar dari <code translate="no">GuaranteeTs</code>.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/wait_search_f09a2f6cf9.png" alt="wait_search" class="doc-image" id="wait_search" />
   </span> <span class="img-wrapper"> <span>tunggu_pencarian</span> </span></p>
<h2 id="Consistency-Levels" class="common-anchor-header">Tingkat Konsistensi<button data-href="#Consistency-Levels" class="anchor-icon" translate="no">
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
    </button></h2><p>Oleh karena itu, <code translate="no">GuaranteeTs</code> dapat dikonfigurasi dalam permintaan pencarian untuk mencapai tingkat konsistensi yang Anda tentukan. <code translate="no">GuaranteeTs</code> dengan nilai besar memastikan <a href="https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database.md#Strong">konsistensi yang kuat</a> dengan mengorbankan latensi pencarian yang tinggi. Dan <code translate="no">GuaranteeTs</code> dengan nilai kecil mengurangi latensi pencarian tetapi visibilitas data terganggu.</p>
<p><code translate="no">GuaranteeTs</code> di Milvus adalah format stempel waktu hibrida. Dan pengguna tidak mengetahui <a href="https://github.com/milvus-io/milvus/blob/master/docs/design_docs/20211214-milvus_hybrid_ts.md">TSO</a> di dalam Milvus. Oleh karena itu, menentukan nilai<code translate="no">GuaranteeTs</code> adalah tugas yang terlalu rumit bagi pengguna. Untuk menghemat masalah bagi pengguna dan memberikan pengalaman pengguna yang optimal, Milvus hanya mengharuskan pengguna untuk memilih tingkat konsistensi tertentu, dan basis data vektor Milvus akan secara otomatis menangani nilai <code translate="no">GuaranteeTs</code> untuk pengguna. Dengan kata lain, pengguna Milvus hanya perlu memilih dari empat tingkat konsistensi: <code translate="no">Strong</code>, <code translate="no">Bounded</code>, <code translate="no">Session</code>, dan <code translate="no">Eventually</code>. Dan masing-masing tingkat konsistensi sesuai dengan nilai <code translate="no">GuaranteeTs</code> tertentu.</p>
<p>Gambar di bawah ini mengilustrasikan <code translate="no">GuaranteeTs</code> untuk masing-masing dari empat tingkat konsistensi dalam basis data vektor Milvus.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/guarantee_ts_f4b3e119d3.png" alt="guarantee_ts" class="doc-image" id="guarantee_ts" />
   </span> <span class="img-wrapper"> <span>jaminan_ts</span> </span></p>
<p>Basis data vektor Milvus mendukung empat tingkat konsistensi:</p>
<ul>
<li><p><code translate="no">CONSISTENCY_STRONG</code>: <code translate="no">GuaranteeTs</code> disetel ke nilai yang sama dengan stempel waktu sistem terbaru, dan simpul kueri menunggu hingga waktu layanan berlanjut ke stempel waktu sistem terbaru untuk memproses permintaan pencarian atau kueri.</p></li>
<li><p><code translate="no">CONSISTENCY_EVENTUALLY</code> <code translate="no">GuaranteeTs</code> disetel ke nilai yang jauh lebih kecil daripada stempel waktu sistem terbaru untuk melewatkan pemeriksaan konsistensi. Node kueri langsung mencari pada tampilan data yang ada.</p></li>
<li><p><code translate="no">CONSISTENCY_BOUNDED</code>: <code translate="no">GuaranteeTs</code> diatur ke nilai yang relatif lebih kecil dari stempel waktu sistem terbaru, dan simpul kueri mencari pada tampilan data yang kurang diperbarui.</p></li>
<li><p><code translate="no">CONSISTENCY_SESSION</code>: Klien menggunakan stempel waktu dari operasi penulisan terakhir sebagai <code translate="no">GuaranteeTs</code> sehingga setiap klien setidaknya dapat mengambil data yang dimasukkan dengan sendirinya.</p></li>
</ul>
<h2 id="How-to-tune-consistency-level-in-Milvus" class="common-anchor-header">Bagaimana cara menyetel tingkat konsistensi di Milvus?<button data-href="#How-to-tune-consistency-level-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus mendukung penyetelan tingkat konsistensi ketika <a href="https://milvus.io/docs/v2.1.x/create_collection.md">membuat koleksi</a> atau melakukan <a href="https://milvus.io/docs/v2.1.x/search.md">pencarian</a> atau <a href="https://milvus.io/docs/v2.1.x/query.md">kueri</a>.</p>
<h3 id="Conduct-a-vector-similarity-search" class="common-anchor-header">Melakukan pencarian kemiripan vektor</h3><p>Untuk melakukan pencarian kemiripan vektor dengan tingkat konsistensi yang Anda inginkan, cukup atur nilai untuk parameter <code translate="no">consistency_level</code> sebagai <code translate="no">Strong</code>, <code translate="no">Bounded</code>, <code translate="no">Session</code>, atau <code translate="no">Eventually</code>. Jika Anda tidak mengatur nilai untuk parameter <code translate="no">consistency_level</code>, tingkat konsistensi akan menjadi <code translate="no">Bounded</code> secara default. Contoh ini melakukan pencarian kemiripan vektor dengan konsistensi <code translate="no">Strong</code>.</p>
<pre><code translate="no">results = collection.search(
        data=[[0.1, 0.2]], 
        anns_field=<span class="hljs-string">&quot;book_intro&quot;</span>, 
        param=search_params, 
        <span class="hljs-built_in">limit</span>=10, 
        <span class="hljs-built_in">expr</span>=None,
        consistency_level=<span class="hljs-string">&quot;Strong&quot;</span>
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Conduct-a-vector-query" class="common-anchor-header">Melakukan kueri vektor</h3><p>Mirip dengan melakukan pencarian kemiripan vektor, Anda dapat menentukan nilai untuk parameter <code translate="no">consistency_level</code> saat melakukan kueri vektor. Contoh melakukan kueri vektor dengan konsistensi <code translate="no">Strong</code>.</p>
<pre><code translate="no">res = collection.query(
  <span class="hljs-built_in">expr</span> = <span class="hljs-string">&quot;book_id in [2,4,6,8]&quot;</span>, 
  output_fields = [<span class="hljs-string">&quot;book_id&quot;</span>, <span class="hljs-string">&quot;book_intro&quot;</span>],
  consistency_level=<span class="hljs-string">&quot;Strong&quot;</span>
)
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
    </button></h2><p>Dengan rilis resmi Milvus 2.1, kami telah menyiapkan serangkaian blog yang memperkenalkan fitur-fitur baru. Baca lebih lanjut dalam seri blog ini:</p>
<ul>
<li><a href="https://milvus.io/blog/2022-08-08-How-to-use-string-data-to-empower-your-similarity-search-applications.md">Cara Menggunakan Data String untuk Memberdayakan Aplikasi Pencarian Kemiripan Anda</a></li>
<li><a href="https://milvus.io/blog/embedded-milvus.md">Menggunakan Milvus yang Disematkan untuk Menginstal dan Menjalankan Milvus secara Instan dengan Python</a></li>
<li><a href="https://milvus.io/blog/in-memory-replicas.md">Tingkatkan Throughput Pembacaan Basis Data Vektor Anda dengan Replika Dalam Memori</a></li>
<li><a href="https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database.md">Memahami Tingkat Konsistensi dalam Basis Data Vektor Milvus</a></li>
<li><a href="https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database-2.md">Memahami Tingkat Konsistensi dalam Basis Data Vektor Milvus (Bagian II)</a></li>
<li><a href="https://milvus.io/blog/data-security.md">Bagaimana Basis Data Vektor Milvus Memastikan Keamanan Data?</a></li>
</ul>
