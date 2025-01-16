---
id: deep-dive-7-query-expression.md
title: Bagaimana Basis Data Memahami dan Menjalankan Kueri Anda?
author: Milvus
date: 2022-05-05T00:00:00.000Z
desc: Kueri vektor adalah proses pengambilan vektor melalui penyaringan skalar.
cover: assets.zilliz.com/Deep_Dive_7_baae830823.png
tag: Engineering
tags: 'Data science, Database, Tech, Artificial Intelligence, Vector Management'
canonicalUrl: 'https://milvus.io/blog/deep-dive-7-query-expression.md'
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Deep_Dive_7_baae830823.png" alt="Cover image" class="doc-image" id="cover-image" />
   </span> <span class="img-wrapper"> <span>Gambar sampul depan</span> </span></p>
<blockquote>
<p>Artikel ini diterjemahkan oleh <a href="https://www.linkedin.com/in/yiyun-n-2aa713163/">Angela Ni</a>.</p>
</blockquote>
<p><a href="https://milvus.io/docs/v2.0.x/query.md">Kueri vektor</a> di Milvus adalah proses pengambilan vektor melalui pemfilteran skalar berdasarkan ekspresi boolean. Dengan pemfilteran skalar, pengguna dapat membatasi hasil kueri mereka dengan kondisi tertentu yang diterapkan pada atribut data. Sebagai contoh, jika pengguna mencari film yang dirilis pada tahun 1990-2010 dan memiliki skor lebih tinggi dari 8.5, maka hanya film yang memiliki atribut (tahun rilis dan skor) yang memenuhi syarat.</p>
<p>Tulisan ini bertujuan untuk melihat bagaimana sebuah kueri diselesaikan di Milvus mulai dari input ekspresi kueri hingga pembuatan rencana kueri dan eksekusi kueri.</p>
<p><strong>Langsung ke:</strong></p>
<ul>
<li><a href="#Query-expression">Ekspresi kueri</a></li>
<li><a href="#Plan-AST-generation">Rencana pembuatan AST</a></li>
<li><a href="#Query-execution">Eksekusi kueri</a></li>
</ul>
<h2 id="Query-expression" class="common-anchor-header">Ekspresi kueri<button data-href="#Query-expression" class="anchor-icon" translate="no">
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
    </button></h2><p>Ekspresi kueri dengan pemfilteran atribut di Milvus mengadopsi sintaks EBNF (Extended Backus-Naur form). Gambar di bawah ini adalah aturan ekspresi di Milvus.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Expression_Syntax_966493a5be.png" alt="Expression Syntax" class="doc-image" id="expression-syntax" />
   </span> <span class="img-wrapper"> <span>Sintaks Ekspresi</span> </span></p>
<p>Ekspresi logika dapat dibuat dengan menggunakan kombinasi operator logika biner, operator logika unary, ekspresi logika, dan ekspresi tunggal. Karena sintaks EBNF itu sendiri bersifat rekursif, sebuah ekspresi logis dapat merupakan hasil kombinasi atau bagian dari ekspresi logis yang lebih besar. Ekspresi logika dapat berisi banyak ekspresi sub-logika. Aturan yang sama berlaku di Milvus. Jika pengguna perlu memfilter atribut dari hasil dengan banyak kondisi, pengguna dapat membuat set kondisi pemfilteran sendiri dengan mengkombinasikan operator dan ekspresi logika yang berbeda.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Boolean_expression_1_dce12f8483.png" alt="Boolean expression" class="doc-image" id="boolean-expression" />
   </span> <span class="img-wrapper"> <span>Ekspresi Boolean</span> </span></p>
<p>Gambar di atas menunjukkan bagian dari <a href="https://milvus.io/docs/v2.0.x/boolean.md">aturan ekspresi Boolean</a> di Milvus. Operator logika unary dapat ditambahkan ke sebuah ekspresi. Saat ini Milvus hanya mendukung operator logika unary &quot;not&quot;, yang mengindikasikan bahwa sistem perlu mengambil vektor-vektor yang nilai medan skalarnya tidak memenuhi hasil perhitungan. Operator logika biner termasuk &quot;dan&quot; dan &quot;atau&quot;. Ekspresi tunggal termasuk ekspresi istilah dan ekspresi perbandingan.</p>
<p>Perhitungan aritmatika dasar seperti penjumlahan, pengurangan, perkalian, dan pembagian juga didukung selama kueri di Milvus. Gambar berikut ini menunjukkan urutan operasi. Operator didaftar dari atas ke bawah dalam urutan prioritas.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Precedence_b8cfbdf17b.png" alt="Precedence" class="doc-image" id="precedence" />
   </span> <span class="img-wrapper"> <span>Prioritas</span> </span></p>
<h3 id="How-a-query-expression-on-certain-films-is-processed-in-Milvus" class="common-anchor-header">Bagaimana ekspresi kueri pada film tertentu diproses di Milvus?</h3><p>Misalkan ada banyak sekali data film yang tersimpan di Milvus dan pengguna ingin menanyakan film tertentu. Sebagai contoh, setiap data film yang disimpan di Milvus memiliki lima bidang berikut: ID film, tahun rilis, jenis film, skor, dan poster. Dalam contoh ini, tipe data dari ID film dan tahun rilis adalah int64, sedangkan skor film adalah data float point. Selain itu, poster film disimpan dalam format vektor float-point, dan tipe film dalam format data string. Khususnya, dukungan untuk tipe data string adalah fitur baru dalam Milvus 2.1.</p>
<p>Sebagai contoh, jika pengguna ingin meminta film dengan skor lebih tinggi dari 8,5. Film-film tersebut juga harus dirilis selama satu dekade sebelum tahun 2000 hingga satu dekade setelah tahun 2000 atau jenis filmnya adalah film komedi atau film aksi, pengguna harus memasukkan ekspresi predikat berikut ini: <code translate="no">score &gt; 8.5 &amp;&amp; (2000 - 10 &lt; release_year &lt; 2000 + 10 || type in [comedy,action])</code>.</p>
<p>Setelah menerima ekspresi kueri, sistem akan menjalankannya dengan urutan sebagai berikut:</p>
<ol>
<li>Kueri untuk film dengan skor lebih tinggi dari 8,5. Hasil kueri disebut &quot;hasil1&quot;.</li>
<li>Hitung 2000 - 10 untuk mendapatkan "result2" (1990).</li>
<li>Hitung 2000 + 10 untuk mendapatkan "result3" (2010).</li>
<li>Kueri untuk film dengan nilai <code translate="no">release_year</code> lebih besar dari &quot;result2&quot; dan lebih kecil dari &quot;result3&quot;. Dengan kata lain, sistem perlu melakukan kueri untuk film yang dirilis antara tahun 1990 dan 2010. Hasil kueri disebut &quot;result4&quot;.</li>
<li>Kueri untuk film yang merupakan film komedi atau film aksi. Hasil kueri disebut &quot;result5&quot;.</li>
<li>Kombinasikan "result4" dan "result5" untuk mendapatkan film yang dirilis antara tahun 1990 dan 2010 atau termasuk dalam kategori film komedi atau aksi. Hasilnya disebut &quot;result6&quot;.</li>
<li>Ambil bagian yang sama dari "result1" dan "result6" untuk mendapatkan hasil akhir yang memenuhi semua persyaratan.</li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Frame_1_16_00972a6e5d.png" alt="Film example" class="doc-image" id="film-example" />
   </span> <span class="img-wrapper"> <span>Contoh film</span> </span></p>
<h2 id="Plan-AST-generation" class="common-anchor-header">Rencanakan pembuatan AST<button data-href="#Plan-AST-generation" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus memanfaatkan alat sumber terbuka <a href="https://www.antlr.org/">ANTLR</a> (ANother Tool for Language Recognition) untuk membuat rencana AST (pohon sintaksis abstrak). ANTLR adalah generator pengurai yang kuat untuk membaca, memproses, mengeksekusi, atau menerjemahkan struktur teks atau file biner. Lebih khusus lagi, ANTLR dapat menghasilkan parser untuk membangun dan menjalankan pohon parsing berdasarkan sintaks atau aturan yang telah ditentukan sebelumnya. Gambar berikut ini adalah contoh di mana ekspresi masukannya adalah &quot;SP=100;&quot;. LEXER, fungsionalitas pengenalan bahasa bawaan dalam ANTLR, menghasilkan empat token untuk ekspresi input - &quot;SP&quot;, &quot;=&quot;, &quot;100&quot;, dan &quot;;&quot;. Kemudian alat ini akan mem-parsing keempat token tersebut untuk menghasilkan pohon parsing yang sesuai.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/parse_tree_b2c3fb0b36.png" alt="parse tree" class="doc-image" id="parse-tree" />
   </span> <span class="img-wrapper"> <span>pohon penguraian</span> </span></p>
<p>Mekanisme walker adalah bagian yang sangat penting dalam alat ANTLR. Ini dirancang untuk berjalan melalui semua pohon parsing untuk memeriksa apakah setiap node mematuhi aturan sintaks, atau untuk mendeteksi kata-kata sensitif tertentu. Beberapa API yang relevan tercantum dalam gambar di bawah ini. Karena ANTLR dimulai dari simpul akar dan turun melalui setiap sub-simpul hingga ke bawah, maka tidak perlu membedakan urutan cara menelusuri pohon parsing.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/parse_tree_walker_9a27942502.png" alt="parse tree walker" class="doc-image" id="parse-tree-walker" />
   </span> <span class="img-wrapper"> <span>pejalan pohon parsing</span> </span></p>
<p>Milvus menghasilkan PlanAST untuk kueri dengan cara yang mirip dengan ANTLR. Namun, menggunakan ANTLR membutuhkan pendefinisian ulang aturan sintaks yang agak rumit. Oleh karena itu, Milvus mengadopsi salah satu aturan yang paling umum - aturan ekspresi Boolean, dan bergantung pada paket <a href="https://github.com/antonmedv/expr">Expr</a> yang bersumber terbuka di GitHub untuk melakukan kueri dan mengurai sintaks ekspresi kueri.</p>
<p>Selama kueri dengan pemfilteran atribut, Milvus akan menghasilkan pohon rencana primitif yang belum terpecahkan menggunakan pengurai semut, metode penguraian yang disediakan oleh Expr, setelah menerima ekspresi kueri. Pohon rencana primitif yang akan kita dapatkan adalah pohon biner sederhana. Kemudian pohon rencana tersebut akan di-tuning oleh Expr dan pengoptimal bawaan di Milvus. Pengoptimal di Milvus sangat mirip dengan mekanisme walker yang telah disebutkan sebelumnya. Karena fungsionalitas pengoptimalan pohon rencana yang disediakan oleh Expr cukup canggih, beban pengoptimal bawaan Milvus sangat diringankan. Pada akhirnya, penganalisis menganalisis pohon rencana yang dioptimalkan dengan cara rekursif untuk menghasilkan AST rencana dalam struktur <a href="https://developers.google.com/protocol-buffers">penyangga protokol</a> (protobuf).</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/plan_AST_workflow_3e50b7a0d4.png" alt="plan AST workflow" class="doc-image" id="plan-ast-workflow" />
   </span> <span class="img-wrapper"> <span>merencanakan alur kerja AST</span> </span></p>
<h2 id="Query-execution" class="common-anchor-header">Eksekusi kueri<button data-href="#Query-execution" class="anchor-icon" translate="no">
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
    </button></h2><p>Eksekusi kueri pada dasarnya adalah eksekusi plan AST yang dihasilkan pada langkah sebelumnya.</p>
<p>Dalam Milvus, plan AST didefinisikan dalam sebuah struktur protobuf. Gambar di bawah ini adalah pesan dengan struktur protobuf. Ada enam jenis ekspresi, di antaranya ekspresi biner dan ekspresi unary yang selanjutnya dapat memiliki ekspresi logika biner dan ekspresi logika unary.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Protobuf1_232132dcf2.png" alt="protobuf1" class="doc-image" id="protobuf1" />
   </span> <span class="img-wrapper"> <span>protobuf1</span> </span></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/protobuf2_193f92f033.png" alt="protobuf2" class="doc-image" id="protobuf2" />
   </span> <span class="img-wrapper"> <span>protobuf2</span> </span></p>
<p>Gambar di bawah ini adalah gambar UML dari ekspresi kueri. Gambar ini menunjukkan kelas dasar dan kelas turunan dari setiap ekspresi. Setiap kelas dilengkapi dengan metode untuk menerima parameter pengunjung. Ini adalah pola desain pengunjung yang khas. Milvus menggunakan pola ini untuk mengeksekusi rancangan AST karena keuntungan terbesarnya adalah pengguna tidak perlu melakukan apa pun pada ekspresi primitif tetapi dapat secara langsung mengakses salah satu metode dalam pola untuk memodifikasi kelas ekspresi kueri tertentu dan elemen-elemen yang relevan.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/UML_1238bc30e1.png" alt="UML" class="doc-image" id="uml" />
   </span> <span class="img-wrapper"> <span>UML</span> </span></p>
<p>Ketika mengeksekusi sebuah plan AST, Milvus pertama-tama menerima sebuah node plan tipe proto. Kemudian node rencana tipe segcore diperoleh melalui proto parser C++ internal. Setelah mendapatkan dua jenis node rencana, Milvus menerima serangkaian akses kelas dan kemudian memodifikasi dan mengeksekusi dalam struktur internal node rencana. Terakhir, Milvus mencari semua node rencana eksekusi untuk mendapatkan hasil yang disaring. Hasil akhirnya adalah keluaran dalam format bitmask. Bitmask adalah sebuah larik angka bit ("0" dan "1"). Data yang memenuhi persyaratan filter ditandai sebagai "1" dalam bitmask, sedangkan yang tidak memenuhi persyaratan ditandai sebagai "0" dalam bitmask.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/execute_workflow_d89f1ee925.png" alt="execute workflow" class="doc-image" id="execute-workflow" />
   </span> <span class="img-wrapper"> <span>jalankan alur kerja</span> </span></p>
<h2 id="About-the-Deep-Dive-Series" class="common-anchor-header">Tentang Seri Deep Dive<button data-href="#About-the-Deep-Dive-Series" class="anchor-icon" translate="no">
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
    </button></h2><p>Dengan <a href="https://milvus.io/blog/2022-1-25-annoucing-general-availability-of-milvus-2-0.md">pengumuman resmi ketersediaan umum</a> Milvus 2.0, kami menyusun seri blog Milvus Deep Dive ini untuk memberikan interpretasi mendalam tentang arsitektur dan kode sumber Milvus. Topik-topik yang dibahas dalam seri blog ini meliputi:</p>
<ul>
<li><a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md">Gambaran umum arsitektur Milvus</a></li>
<li><a href="https://milvus.io/blog/deep-dive-2-milvus-sdk-and-api.md">API dan SDK Python</a></li>
<li><a href="https://milvus.io/blog/deep-dive-3-data-processing.md">Pemrosesan data</a></li>
<li><a href="https://milvus.io/blog/deep-dive-4-data-insertion-and-data-persistence.md">Manajemen data</a></li>
<li><a href="https://milvus.io/blog/deep-dive-5-real-time-query.md">Kueri waktu nyata</a></li>
<li><a href="https://milvus.io/blog/deep-dive-7-query-expression.md">Mesin eksekusi skalar</a></li>
<li><a href="https://milvus.io/blog/deep-dive-6-oss-qa.md">Sistem QA</a></li>
<li><a href="https://milvus.io/blog/deep-dive-8-knowhere.md">Mesin eksekusi vektor</a></li>
</ul>
