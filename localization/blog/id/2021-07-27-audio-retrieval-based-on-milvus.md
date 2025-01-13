---
id: audio-retrieval-based-on-milvus.md
title: Teknologi Pemrosesan
author: Shiyu Chen
date: 2021-07-27T03:05:57.524Z
desc: >-
  Pengambilan audio dengan Milvus memungkinkan untuk mengklasifikasikan dan
  menganalisis data suara dalam waktu nyata.
cover: assets.zilliz.com/blog_audio_search_56b990cee5.jpg
tag: Scenarios
canonicalUrl: 'https://zilliz.com/blog/audio-retrieval-based-on-milvus'
---
<custom-h1>Pengambilan Audio Berdasarkan Milvus</custom-h1><p>Suara adalah tipe data yang padat informasi. Meskipun mungkin terasa kuno di era konten video, audio tetap menjadi sumber informasi utama bagi banyak orang. Meskipun terjadi penurunan jumlah pendengar dalam jangka panjang, 83% orang Amerika berusia 12 tahun ke atas mendengarkan radio terestrial (AM/FM) pada minggu tertentu di tahun 2020 (turun dari 89% di tahun 2019). Sebaliknya, audio online telah mengalami peningkatan pendengar yang stabil selama dua dekade terakhir, dengan 62% orang Amerika dilaporkan mendengarkan beberapa bentuk audio online setiap minggunya menurut <a href="https://www.journalism.org/fact-sheet/audio-and-podcasting/">studi Pew Research Center</a> yang sama.</p>
<p>Sebagai sebuah gelombang, suara memiliki empat sifat: frekuensi, amplitudo, bentuk gelombang, dan durasi. Dalam terminologi musik, ini disebut pitch, dinamika, nada, dan durasi. Suara juga membantu manusia dan hewan lain untuk melihat dan memahami lingkungan kita, memberikan petunjuk konteks untuk lokasi dan pergerakan objek di sekitar kita.</p>
<p>Sebagai pembawa informasi, audio dapat diklasifikasikan ke dalam tiga kategori:</p>
<ol>
<li><strong>Ucapan:</strong> Media komunikasi yang terdiri dari kata-kata dan tata bahasa. Dengan algoritme pengenalan suara, ucapan dapat diubah menjadi teks.</li>
<li><strong>Musik:</strong> Suara vokal dan/atau instrumental yang digabungkan untuk menghasilkan komposisi yang terdiri dari melodi, harmoni, ritme, dan warna suara. Musik dapat diwakili oleh sebuah notasi.</li>
<li><strong>Bentuk gelombang:</strong> Sinyal audio digital yang diperoleh dengan mendigitalkan suara analog. Bentuk gelombang dapat merepresentasikan ucapan, musik, dan suara alami atau suara yang disintesis.</li>
</ol>
<p>Pengambilan audio dapat digunakan untuk mencari dan memantau media online secara real-time untuk menindak pelanggaran hak kekayaan intelektual. Hal ini juga mengasumsikan peran penting dalam klasifikasi dan analisis statistik data audio.</p>
<h2 id="Processing-Technologies" class="common-anchor-header">Teknologi Pemrosesan<button data-href="#Processing-Technologies" class="anchor-icon" translate="no">
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
    </button></h2><p>Pidato, musik, dan suara umum lainnya masing-masing memiliki karakteristik yang unik dan membutuhkan metode pemrosesan yang berbeda. Biasanya, audio dipisahkan menjadi kelompok yang berisi ucapan dan kelompok yang tidak:</p>
<ul>
<li>Audio ucapan diproses dengan pengenalan ucapan otomatis.</li>
<li>Audio non-ucapan, termasuk audio musik, efek suara, dan sinyal ucapan yang didigitalkan, diproses dengan menggunakan sistem pengambilan audio.</li>
</ul>
<p>Artikel ini berfokus pada cara menggunakan sistem pengambilan audio untuk memproses data audio non-ucapan. Pengenalan ucapan tidak tercakup dalam artikel ini</p>
<h3 id="Audio-feature-extraction" class="common-anchor-header">Ekstraksi fitur audio</h3><p>Ekstraksi fitur adalah teknologi yang paling penting dalam sistem pengambilan audio karena memungkinkan pencarian kemiripan audio. Metode untuk mengekstraksi fitur audio dibagi menjadi dua kategori:</p>
<ul>
<li>Model ekstraksi fitur audio tradisional seperti model campuran Gaussian (GMM) dan model Markov tersembunyi (HMM);</li>
<li>Model ekstraksi fitur audio berbasis pembelajaran mendalam seperti jaringan saraf berulang (RNN), jaringan memori jangka pendek (LSTM), kerangka kerja penyandian-pengodean, mekanisme perhatian, dll.</li>
</ul>
<p>Model berbasis deep learning memiliki tingkat kesalahan yang jauh lebih rendah daripada model tradisional, dan oleh karena itu, model ini mendapatkan momentum sebagai teknologi inti dalam bidang pemrosesan sinyal audio.</p>
<p>Data audio biasanya diwakili oleh fitur audio yang diekstraksi. Proses pencarian kembali mencari dan membandingkan fitur dan atribut ini, bukan data audio itu sendiri. Oleh karena itu, efektivitas pencarian kemiripan audio sangat bergantung pada kualitas ekstraksi fitur.</p>
<p>Dalam artikel ini, <a href="https://github.com/qiuqiangkong/audioset_tagging_cnn">jaringan saraf tiruan audio yang telah dilatih sebelumnya dalam skala besar untuk pengenalan pola audio (PANN</a> ) digunakan untuk mengekstrak vektor fitur untuk akurasi rata-rata rata-rata (mAP) sebesar 0,439 (Hershey et al., 2017).</p>
<p>Setelah mengekstraksi vektor fitur dari data audio, kita dapat mengimplementasikan analisis vektor fitur berkinerja tinggi menggunakan Milvus.</p>
<h3 id="Vector-similarity-search" class="common-anchor-header">Pencarian kesamaan vektor</h3><p><a href="https://milvus.io/">Milvus</a> adalah basis data vektor open-source yang berasal dari cloud yang dibangun untuk mengelola vektor penyisipan yang dihasilkan oleh model pembelajaran mesin dan jaringan saraf. Milvus banyak digunakan dalam skenario seperti visi komputer, pemrosesan bahasa alami, kimia komputasi, sistem pemberi rekomendasi yang dipersonalisasi, dan banyak lagi.</p>
<p>Diagram berikut ini menggambarkan proses pencarian kemiripan secara umum menggunakan Milvus: <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/how_does_milvus_work_6926180543.png" alt="how-does-milvus-work.png" class="doc-image" id="how-does-milvus-work.png" /><span>how-does-milvus-work.png</span> </span></p>
<ol>
<li>Data yang tidak terstruktur diubah menjadi vektor fitur dengan model pembelajaran mendalam dan dimasukkan ke dalam Milvus.</li>
<li>Milvus menyimpan dan mengindeks vektor fitur ini.</li>
<li>Berdasarkan permintaan, Milvus mencari dan mengembalikan vektor yang paling mirip dengan vektor kueri.</li>
</ol>
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
    </button></h2><p>Sistem temu kembali audio pada dasarnya terdiri dari dua bagian: memasukkan (garis hitam) dan mencari (garis merah).</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/audio_retrieval_system_663a911c95.png" alt="audio-retrieval-system.png" class="doc-image" id="audio-retrieval-system.png" />
   </span> <span class="img-wrapper"> <span>sistem-pengambilan audio.png</span> </span></p>
<p>Contoh dataset yang digunakan dalam proyek ini berisi suara game sumber terbuka, dan kodenya dirinci dalam <a href="https://github.com/milvus-io/bootcamp/tree/master/solutions/audio_similarity_search">bootcamp Milvus</a>.</p>
<h3 id="Step-1-Insert-data" class="common-anchor-header">Langkah 1: Memasukkan data</h3><p>Di bawah ini adalah contoh kode untuk menghasilkan penyematan audio dengan model inferensi PANN yang telah dilatih sebelumnya dan memasukkannya ke dalam Milvus, yang memberikan ID unik untuk setiap penyematan vektor.</p>
<pre><code translate="no"><span class="hljs-number">1</span> wav_name, vectors_audio = get_audio_embedding(audio_path)  
<span class="hljs-number">2</span> <span class="hljs-keyword">if</span> vectors_audio:    
<span class="hljs-number">3</span>     embeddings.<span class="hljs-built_in">append</span>(vectors_audio)  
<span class="hljs-number">4</span>     wav_names.<span class="hljs-built_in">append</span>(wav_name)  
<span class="hljs-number">5</span> ids_milvus = insert_vectors(milvus_client, table_name, embeddings)  
<span class="hljs-number">6</span> 
<button class="copy-code-btn"></button></code></pre>
<p>Kemudian <strong>ids_milvus</strong> yang dikembalikan disimpan bersama dengan informasi lain yang relevan (misalnya <strong>nama_wav</strong>) untuk data audio yang disimpan di database MySQL untuk pemrosesan selanjutnya.</p>
<pre><code translate="no">1 get_ids_correlation(ids_milvus, wav_name)  
2 load_data_to_mysql(conn, cursor, table_name)    
3  
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-2-Audio-search" class="common-anchor-header">Langkah 2: Pencarian audio</h3><p>Milvus menghitung jarak inner product antara vektor fitur yang telah disimpan sebelumnya dan vektor fitur input, diekstraksi dari data audio kueri menggunakan model inferensi PANN, dan mengembalikan <strong>ids_milvus</strong> dari vektor fitur yang serupa, yang sesuai dengan data audio yang dicari.</p>
<pre><code translate="no"><span class="hljs-number">1</span> _, vectors_audio = get_audio_embedding(audio_filename)    
<span class="hljs-number">2</span> results = search_vectors(milvus_client, table_name, [vectors_audio], METRIC_TYPE, TOP_K)  
<span class="hljs-number">3</span> ids_milvus = [x.<span class="hljs-built_in">id</span> <span class="hljs-keyword">for</span> x <span class="hljs-keyword">in</span> results[<span class="hljs-number">0</span>]]  
<span class="hljs-number">4</span> audio_name = search_by_milvus_ids(conn, cursor, ids_milvus, table_name)    
<span class="hljs-number">5</span>
<button class="copy-code-btn"></button></code></pre>
<h2 id="API-reference-and-demo" class="common-anchor-header">Referensi dan demo API<button data-href="#API-reference-and-demo" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="API" class="common-anchor-header">API</h3><p>Sistem pengambilan audio ini dibangun dengan kode sumber terbuka. Fitur utamanya adalah penyisipan dan penghapusan data audio. Semua API dapat dilihat dengan mengetik <strong>127.0.0.1:<port></strong> /docs di browser.</p>
<h3 id="Demo" class="common-anchor-header">Demo</h3><p>Kami menyelenggarakan <a href="https://zilliz.com/solutions">demo langsung</a> dari sistem pencarian audio berbasis Milvus secara online yang dapat Anda coba dengan data audio Anda sendiri.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/audio_search_demo_cae60625db.png" alt="audio-search-demo.png" class="doc-image" id="audio-search-demo.png" />
   </span> <span class="img-wrapper"> <span>audio-search-demo.png</span> </span></p>
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
    </button></h2><p>Hidup di era data besar, orang-orang menemukan hidup mereka dipenuhi dengan segala macam informasi. Untuk memahaminya dengan lebih baik, pencarian teks tradisional tidak lagi memadai. Teknologi pencarian informasi saat ini sangat membutuhkan pengambilan berbagai jenis data yang tidak terstruktur, seperti video, gambar, dan audio.</p>
<p>Data yang tidak terstruktur, yang sulit diproses oleh komputer, dapat diubah menjadi vektor fitur menggunakan model pembelajaran mendalam. Data yang dikonversi ini dapat dengan mudah diproses oleh mesin, sehingga memungkinkan kita untuk menganalisis data yang tidak terstruktur dengan cara yang tidak dapat dilakukan oleh para pendahulu kita. Milvus, sebuah basis data vektor sumber terbuka, dapat secara efisien memproses vektor fitur yang diekstraksi oleh model AI dan menyediakan berbagai perhitungan kesamaan vektor yang umum.</p>
<h2 id="References" class="common-anchor-header">Referensi<button data-href="#References" class="anchor-icon" translate="no">
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
    </button></h2><p>Hershey, S., Chaudhuri, S., Ellis, D.P., Gemmeke, J.F., Jansen, A., Moore, R.C., Plakal, M., Platt, D., Saurous, R.A., Seybold, B. dan Slaney, M., 2017, March. Arsitektur CNN untuk klasifikasi audio skala besar. Dalam Konferensi Internasional IEEE 2017 tentang Akustik, Pidato dan Pemrosesan Sinyal (ICASSP), hal. 131-135, 2017</p>
<h2 id="Dont-be-a-stranger" class="common-anchor-header">Jangan menjadi orang asing<button data-href="#Dont-be-a-stranger" class="anchor-icon" translate="no">
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
<li><p>Temukan atau kontribusikan Milvus di <a href="https://github.com/milvus-io/milvus/">GitHub</a>.</p></li>
<li><p>Berinteraksi dengan komunitas melalui <a href="https://join.slack.com/t/milvusio/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ">Slack</a>.</p></li>
<li><p>Terhubung dengan kami di <a href="https://twitter.com/milvusio">Twitter</a>.</p></li>
</ul>
