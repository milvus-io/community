---
id: >-
  stop-use-outdated-rag-deepsearcher-agentic-rag-approaches-changes-everything.md
title: 'Berhenti Membangun Vanilla RAG: Rangkullah Agentic RAG dengan DeepSearcher'
author: Cheney Zhang
date: 2025-03-23T00:00:00.000Z
cover: >-
  assets.zilliz.com/Stop_Using_Outdated_RAG_Deep_Searcher_s_Agentic_RAG_Approach_Changes_Everything_b2eaa644cf.png
tag: Engineering
recommend: true
canonicalUrl: >-
  https://milvus.io/blog/stop-use-outdated-rag-deepsearcher-agentic-rag-approaches-changes-everything.md
---
<h2 id="The-Shift-to-AI-Powered-Search-with-LLMs-and-Deep-Research" class="common-anchor-header">Pergeseran ke Pencarian Bertenaga AI dengan LLM dan Riset Mendalam<button data-href="#The-Shift-to-AI-Powered-Search-with-LLMs-and-Deep-Research" class="anchor-icon" translate="no">
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
    </button></h2><p>Evolusi teknologi penelusuran telah berkembang secara dramatis selama beberapa dekade-dari pencarian berbasis kata kunci di era sebelum tahun 2000 hingga pengalaman penelusuran yang dipersonalisasi di tahun 2010. Kita menyaksikan munculnya solusi bertenaga AI yang mampu menangani kueri kompleks yang membutuhkan analisis mendalam dan profesional.</p>
<p>Deep Research dari OpenAI mencontohkan pergeseran ini, menggunakan kemampuan penalaran untuk mensintesis informasi dalam jumlah besar dan menghasilkan laporan penelitian multi-langkah. Misalnya, ketika ditanya tentang "Berapa kapitalisasi pasar Tesla yang wajar?" Deep Research dapat menganalisis keuangan perusahaan, lintasan pertumbuhan bisnis, dan estimasi nilai pasar secara komprehensif.</p>
<p>Deep Research mengimplementasikan bentuk lanjutan dari kerangka kerja RAG (Retrieval-Augmented Generation) pada intinya. RAG tradisional meningkatkan keluaran model bahasa dengan mengambil dan menggabungkan informasi eksternal yang relevan. Pendekatan OpenAI mengambil langkah lebih jauh dengan menerapkan siklus pengambilan dan penalaran berulang. Alih-alih satu langkah pengambilan, Deep Research secara dinamis menghasilkan beberapa kueri, mengevaluasi hasil antara, dan menyempurnakan strategi pencariannya - menunjukkan bagaimana teknik RAG yang canggih atau agenik dapat memberikan konten berkualitas tinggi, tingkat perusahaan yang terasa lebih seperti penelitian profesional daripada menjawab pertanyaan sederhana.</p>
<h2 id="DeepSearcher-A-Local-Deep-Research-Bringing-Agentic-RAG-to-Everyone" class="common-anchor-header">DeepSearcher: Riset Mendalam Lokal yang Menghadirkan Agentic RAG untuk Semua Orang<button data-href="#DeepSearcher-A-Local-Deep-Research-Bringing-Agentic-RAG-to-Everyone" class="anchor-icon" translate="no">
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
    </button></h2><p>Terinspirasi oleh kemajuan ini, para pengembang di seluruh dunia telah menciptakan implementasi mereka sendiri. Para insinyur Zilliz membangun dan membuat proyek <a href="https://github.com/zilliztech/deep-searcher">DeepSearcher</a>, yang dapat dianggap sebagai Deep Research lokal dan sumber terbuka. Proyek ini telah mengumpulkan lebih dari 4.900 bintang GitHub dalam waktu kurang dari sebulan.</p>
<p>DeepSearcher mendefinisikan ulang pencarian perusahaan bertenaga AI dengan menggabungkan kekuatan model penalaran tingkat lanjut, fitur pencarian yang canggih, dan asisten penelitian terintegrasi. Dengan mengintegrasikan data lokal melalui <a href="https://milvus.io/docs/overview.md">Milvus</a> (basis data vektor berkinerja tinggi dan bersumber terbuka), DeepSearcher memberikan hasil yang lebih cepat dan lebih relevan, serta memungkinkan pengguna untuk menukar model inti untuk pengalaman yang disesuaikan dengan mudah.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_1_Deep_Searcher_s_star_history_9c1a064ed8.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Gambar 1:</em> <em>Sejarah bintang DeepSearcher (</em><a href="https://www.star-history.com/#zilliztech/deep-searcher&amp;Date"><em>Sumber</em></a><em>)</em></p>
<p>Dalam artikel ini, kita akan menjelajahi evolusi dari RAG tradisional ke Agentic RAG, mengeksplorasi apa yang secara khusus membuat pendekatan ini berbeda pada tingkat teknis. Kemudian kita akan membahas implementasi DeepSearcher, menunjukkan bagaimana DeepSearcher memanfaatkan kemampuan agen cerdas untuk memungkinkan penalaran multi-turn yang dinamis - dan mengapa hal ini penting bagi para pengembang yang membangun solusi pencarian tingkat perusahaan.</p>
<h2 id="From-Traditional-RAG-to-Agentic-RAG-The-Power-of-Iterative-Reasoning" class="common-anchor-header">Dari RAG Tradisional ke Agentic RAG: Kekuatan Penalaran Iteratif<button data-href="#From-Traditional-RAG-to-Agentic-RAG-The-Power-of-Iterative-Reasoning" class="anchor-icon" translate="no">
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
    </button></h2><p>Agentic RAG meningkatkan kerangka kerja RAG tradisional dengan menggabungkan kemampuan agen cerdas. DeepSearcher adalah contoh utama kerangka kerja agentic RAG. Melalui perencanaan dinamis, penalaran multi-langkah, dan pengambilan keputusan otonom, ini membentuk proses loop tertutup yang mengambil, memproses, memvalidasi, dan mengoptimalkan data untuk memecahkan masalah yang kompleks.</p>
<p>Popularitas Agentic RAG yang semakin meningkat didorong oleh kemajuan yang signifikan dalam kemampuan penalaran model bahasa besar (LLM), terutama kemampuannya yang lebih baik dalam mengurai masalah yang kompleks dan mempertahankan rantai pemikiran yang koheren di berbagai langkah.</p>
<table>
<thead>
<tr><th></th><th></th><th></th></tr>
</thead>
<tbody>
<tr><td><strong>Dimensi Perbandingan</strong></td><td><strong>RAG tradisional</strong></td><td><strong>RAG Agenik</strong></td></tr>
<tr><td>Pendekatan Inti</td><td>Pasif dan reaktif</td><td>Proaktif dan digerakkan oleh agen</td></tr>
<tr><td>Alur Proses</td><td>Pengambilan dan pembuatan satu langkah (proses satu kali)</td><td>Pengambilan dan pembuatan multi-langkah yang dinamis (penyempurnaan berulang)</td></tr>
<tr><td>Strategi Pengambilan</td><td>Pencarian kata kunci tetap, bergantung pada kueri awal</td><td>Pencarian adaptif (misalnya, penyempurnaan kata kunci, pengalihan sumber data)</td></tr>
<tr><td>Penanganan Kueri Kompleks</td><td>Pembuatan langsung; rentan terhadap kesalahan dengan data yang saling bertentangan</td><td>Dekomposisi tugas → pengambilan yang ditargetkan → sintesis jawaban</td></tr>
<tr><td>Kemampuan Interaksi</td><td>Bergantung sepenuhnya pada masukan pengguna; tidak ada otonomi</td><td>Keterlibatan proaktif (misalnya, mengklarifikasi ambiguitas, meminta detail)</td></tr>
<tr><td>Koreksi Kesalahan &amp; Umpan Balik</td><td>Tidak ada koreksi mandiri; dibatasi oleh hasil awal</td><td>Validasi berulang → pengambilan ulang yang dipicu sendiri untuk akurasi</td></tr>
<tr><td>Kasus Penggunaan Ideal</td><td>Tanya Jawab sederhana, pencarian faktual</td><td>Penalaran yang kompleks, pemecahan masalah multi-tahap, tugas-tugas terbuka</td></tr>
<tr><td>Contoh</td><td>Pengguna bertanya: "Apa yang dimaksud dengan komputasi kuantum?" → Sistem mengembalikan definisi buku teks</td><td>Pengguna bertanya: "Bagaimana komputasi kuantum dapat mengoptimalkan logistik?" → Sistem mengambil prinsip-prinsip kuantum dan algoritme logistik, lalu mensintesis wawasan yang dapat ditindaklanjuti</td></tr>
</tbody>
</table>
<p>Tidak seperti RAG tradisional, yang bergantung pada pengambilan berbasis kueri tunggal, Agentic RAG memecah kueri menjadi beberapa sub-pertanyaan dan secara berulang menyempurnakan pencarian hingga mencapai jawaban yang memuaskan. Evolusi ini menawarkan tiga manfaat utama:</p>
<ul>
<li><p><strong>Pemecahan Masalah Proaktif:</strong> Sistem bertransisi dari bereaksi secara pasif menjadi aktif memecahkan masalah.</p></li>
<li><p><strong>Pencarian Dinamis dan Multi-Belokan:</strong> Alih-alih melakukan pencarian satu kali, sistem secara terus-menerus menyesuaikan kueri dan mengoreksi sendiri berdasarkan umpan balik yang sedang berlangsung.</p></li>
<li><p><strong>Penerapan yang Lebih Luas:</strong> Sistem ini lebih dari sekadar pengecekan fakta dasar untuk menangani tugas-tugas penalaran yang kompleks dan menghasilkan laporan yang komprehensif.</p></li>
</ul>
<p>Dengan memanfaatkan kemampuan ini, aplikasi Agentic RAG seperti DeepSearcher beroperasi seperti seorang ahli manusia - tidak hanya memberikan jawaban akhir tetapi juga perincian proses penalaran dan detail eksekusi yang lengkap dan transparan.</p>
<p>Dalam jangka panjang, Agentic RAG akan mengambil alih sistem RAG dasar. Pendekatan konvensional sering kali kesulitan untuk menangani logika yang mendasari pertanyaan pengguna, yang membutuhkan penalaran berulang, refleksi, dan pengoptimalan berkelanjutan.</p>
<h2 id="What-Does-an-Agentic-RAG-Architecture-Look-Like-DeepSearcher-as-an-Example" class="common-anchor-header">Seperti Apa Arsitektur RAG Agentic Itu? DeepSearcher sebagai Contoh<button data-href="#What-Does-an-Agentic-RAG-Architecture-Look-Like-DeepSearcher-as-an-Example" class="anchor-icon" translate="no">
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
    </button></h2><p>Sekarang setelah kita memahami kekuatan sistem RAG agentic, seperti apa arsitekturnya? Mari kita ambil DeepSearcher sebagai contoh.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_2_Two_Modules_Within_Deep_Searcher_baf5ca5952.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Gambar 2: Dua Modul dalam DeepSearcher</em></p>
<p>Arsitektur DeepSearcher terdiri dari dua modul utama:</p>
<h3 id="1-Data-Ingestion-Module" class="common-anchor-header">1. Modul Konsumsi Data</h3><p>Modul ini menghubungkan berbagai sumber data milik pihak ketiga melalui basis data vektor Milvus. Modul ini sangat berharga untuk lingkungan perusahaan yang mengandalkan kumpulan data berpemilik. Modul ini menangani:</p>
<ul>
<li><p>Penguraian dan pemotongan dokumen</p></li>
<li><p>Pembuatan penyematan</p></li>
<li><p>Penyimpanan dan pengindeksan vektor</p></li>
<li><p>Manajemen metadata untuk pengambilan yang efisien</p></li>
</ul>
<h3 id="2-Online-Reasoning-and-Query-Module" class="common-anchor-header">2. Modul Penalaran dan Kueri Online</h3><p>Komponen ini mengimplementasikan beragam strategi agen dalam kerangka kerja RAG untuk memberikan respons yang tepat dan berwawasan luas. Komponen ini beroperasi pada loop dinamis dan berulang-setelah setiap pengambilan data, sistem merefleksikan apakah informasi yang terkumpul cukup menjawab pertanyaan asli. Jika tidak, iterasi berikutnya akan dilakukan; jika ya, laporan akhir akan dihasilkan.</p>
<p>Siklus "tindak lanjut" dan "refleksi" yang berkelanjutan ini merupakan peningkatan mendasar dari pendekatan RAG dasar lainnya. Sementara RAG tradisional melakukan proses pengambilan dan pembuatan satu kali pengambilan, pendekatan iteratif DeepSearcher mencerminkan cara kerja peneliti manusia-mengajukan pertanyaan awal, mengevaluasi informasi yang diterima, mengidentifikasi kesenjangan, dan mengejar jalur penyelidikan baru.</p>
<h2 id="How-Effective-is-DeepSearcher-and-What-Use-Cases-is-It-Best-Suited-For" class="common-anchor-header">Seberapa Efektifkah DeepSearcher, dan Kasus Penggunaan Apa yang Paling Cocok Untuknya?<button data-href="#How-Effective-is-DeepSearcher-and-What-Use-Cases-is-It-Best-Suited-For" class="anchor-icon" translate="no">
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
    </button></h2><p>Setelah diinstal dan dikonfigurasi, DeepSearcher mengindeks file lokal Anda melalui basis data vektor Milvus. Ketika Anda mengirimkan kueri, DeepSearcher melakukan pencarian yang komprehensif dan mendalam terhadap konten yang diindeks ini. Keuntungan utama bagi para pengembang adalah bahwa sistem ini mencatat setiap langkah proses pencarian dan penalarannya, memberikan transparansi tentang bagaimana sistem ini sampai pada kesimpulannya-fitur penting untuk melakukan debug dan mengoptimalkan sistem RAG.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_3_Accelerated_Playback_of_Deep_Searcher_Iteration_0c36baea2f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Gambar 3: Pemutaran Iterasi DeepSearcher yang Dipercepat</em></p>
<p>Pendekatan ini menggunakan lebih banyak sumber daya komputasi daripada RAG tradisional, tetapi memberikan hasil yang lebih baik untuk kueri yang kompleks. Mari kita bahas dua kasus penggunaan spesifik yang paling cocok untuk DeepSearcher.</p>
<h3 id="1-Overview-Type-Queries" class="common-anchor-header">1. Kueri Jenis Ikhtisar</h3><p>Kueri tipe ikhtisar-seperti membuat laporan, menyusun dokumen, atau meringkas tren-menyediakan topik singkat tetapi membutuhkan keluaran yang lengkap dan terperinci.</p>
<p>Misalnya, saat menanyakan &quot;Bagaimana The Simpsons berubah dari waktu ke waktu?&quot;, DeepSearcher pertama-tama membuat satu set sub-kueri awal:</p>
<pre><code translate="no">_Break down the original query <span class="hljs-keyword">into</span> <span class="hljs-keyword">new</span> sub queries: [_

_<span class="hljs-string">&#x27;How has the cultural impact and societal relevance of The Simpsons evolved from its debut to the present?&#x27;</span>,_

_<span class="hljs-string">&#x27;What changes in character development, humor, and storytelling styles have occurred across different seasons of The Simpsons?&#x27;</span>,_

_<span class="hljs-string">&#x27;How has the animation style and production technology of The Simpsons changed over time?&#x27;</span>,_

_<span class="hljs-string">&#x27;How have audience demographics, reception, and ratings of The Simpsons shifted throughout its run?&#x27;</span>]_
<button class="copy-code-btn"></button></code></pre>
<p>Mengambil informasi yang relevan, dan kemudian melakukan iterasi dengan umpan balik untuk menyempurnakan pencarian, menghasilkan sub-kueri berikutnya:</p>
<pre><code translate="no">_New search queries <span class="hljs-keyword">for</span> <span class="hljs-built_in">next</span> iteration: [_

_<span class="hljs-string">&quot;How have changes in The Simpsons&#x27; voice cast and production team influenced the show&#x27;s evolution over different seasons?&quot;</span>,_

_<span class="hljs-string">&quot;What role has The Simpsons&#x27; satire and social commentary played in its adaptation to contemporary issues across decades?&quot;</span>,_

_<span class="hljs-string">&#x27;How has The Simpsons addressed and incorporated shifts in media consumption, such as streaming services, into its distribution and content strategies?&#x27;</span>]_
<button class="copy-code-btn"></button></code></pre>
<p>Setiap iterasi dibangun berdasarkan iterasi sebelumnya, yang berujung pada laporan komprehensif yang mencakup berbagai aspek subjek, terstruktur dengan bagian-bagian seperti:</p>
<pre><code translate="no">**<span class="hljs-title class_">Report</span>: <span class="hljs-title class_">The</span> <span class="hljs-title class_">Evolution</span> <span class="hljs-keyword">of</span> _The <span class="hljs-title class_">Simpsons</span>_ (<span class="hljs-number">1989</span>–<span class="hljs-title class_">Present</span>)**
**<span class="hljs-number">1.</span> <span class="hljs-title class_">Cultural</span> <span class="hljs-title class_">Impact</span> and <span class="hljs-title class_">Societal</span> <span class="hljs-title class_">Relevance</span>** 
_The <span class="hljs-title class_">Simpsons</span>_ debuted <span class="hljs-keyword">as</span> a subversive critique <span class="hljs-keyword">of</span> <span class="hljs-title class_">American</span> middle-<span class="hljs-keyword">class</span> <span class="hljs-title class_">life</span>, gaining notoriety <span class="hljs-keyword">for</span> its bold satire <span class="hljs-keyword">in</span> the 1990s. <span class="hljs-title class_">Initially</span> a countercultural phenomenon, it challenged norms <span class="hljs-keyword">with</span> episodes tackling religion, politics, and consumerism. <span class="hljs-title class_">Over</span> time, its cultural dominance waned <span class="hljs-keyword">as</span> competitors like _South <span class="hljs-title class_">Park</span>_ and _Family <span class="hljs-title class_">Guy</span>_ pushed boundaries further. <span class="hljs-title class_">By</span> the 2010s, the show transitioned <span class="hljs-keyword">from</span> trendsetter to nostalgic institution, balancing legacy appeal <span class="hljs-keyword">with</span> attempts to address modern issues like climate change and <span class="hljs-variable constant_">LGBTQ</span>+ rights, albeit <span class="hljs-keyword">with</span> less societal resonance.
**<span class="hljs-number">2.</span> <span class="hljs-title class_">Character</span> <span class="hljs-title class_">Development</span> and <span class="hljs-title class_">Storytelling</span> <span class="hljs-title class_">Shifts</span>** 
<span class="hljs-title class_">Early</span> seasons featured nuanced character <span class="hljs-title function_">arcs</span> (e.<span class="hljs-property">g</span>., <span class="hljs-title class_">Lisa</span>’s activism, <span class="hljs-title class_">Marge</span>’s resilience), but later seasons saw <span class="hljs-string">&quot;Flanderization&quot;</span> (exaggerating traits, e.<span class="hljs-property">g</span>., <span class="hljs-title class_">Homer</span>’s stupidity, <span class="hljs-title class_">Ned</span> <span class="hljs-title class_">Flanders</span>’ piety). <span class="hljs-title class_">Humor</span> evolved <span class="hljs-keyword">from</span> witty, character-driven satire to reliance on pop culture references and meta-humor. <span class="hljs-title class_">Serialized</span> storytelling <span class="hljs-keyword">in</span> early episodes gave way to episodic, gag-focused plots, often sacrificing emotional depth <span class="hljs-keyword">for</span> absurdity.
[...]
**<span class="hljs-number">12.</span> <span class="hljs-title class_">Merchandising</span> and <span class="hljs-title class_">Global</span> <span class="hljs-title class_">Reach</span>** 
<span class="hljs-title class_">The</span> 1990s merchandise <span class="hljs-title function_">boom</span> (action figures, _Simpsons_-themed cereals) faded, but the franchise persists via <span class="hljs-title function_">collaborations</span> (e.<span class="hljs-property">g</span>., _Fortnite_ skins, <span class="hljs-title class_">Lego</span> sets). <span class="hljs-title class_">International</span> adaptations include localized dubbing and culturally tailored <span class="hljs-title function_">episodes</span> (e.<span class="hljs-property">g</span>., <span class="hljs-title class_">Japanese</span> _Itchy &amp; <span class="hljs-title class_">Scratchy</span>_ variants).
**<span class="hljs-title class_">Conclusion</span>** 
_The <span class="hljs-title class_">Simpsons</span>_ evolved <span class="hljs-keyword">from</span> a radical satire to a television institution, navigating shifts <span class="hljs-keyword">in</span> technology, politics, and audience expectations. <span class="hljs-title class_">While</span> its golden-age brilliance remains unmatched, its adaptability—through streaming, updated humor, and <span class="hljs-variable language_">global</span> outreach—secures its place <span class="hljs-keyword">as</span> a cultural touchstone. <span class="hljs-title class_">The</span> show’s longevity reflects both nostalgia and a pragmatic embrace <span class="hljs-keyword">of</span> change, even <span class="hljs-keyword">as</span> it grapples <span class="hljs-keyword">with</span> the challenges <span class="hljs-keyword">of</span> relevance <span class="hljs-keyword">in</span> a fragmented media landscape.
<button class="copy-code-btn"></button></code></pre>
<p><em>(Untuk mempersingkat, hanya cuplikan proses dan laporan akhir yang ditampilkan)</em></p>
<p>Laporan akhir memberikan analisis menyeluruh dengan kutipan yang tepat dan organisasi yang terstruktur.</p>
<h3 id="2-Complex-Reasoning-Queries" class="common-anchor-header">2. Pertanyaan Penalaran yang Kompleks</h3><p>Pertanyaan yang kompleks melibatkan beberapa lapisan logika dan entitas yang saling berhubungan.</p>
<p>Pertimbangkan pertanyaan ini: "Film mana yang sutradaranya lebih tua, God's Gift To Women atau Aldri annet enn bråk?"</p>
<p>Meskipun hal ini mungkin terlihat sederhana bagi manusia, sistem RAG sederhana kesulitan untuk menjawabnya karena jawabannya tidak disimpan secara langsung di dalam basis pengetahuan. DeepSearcher mengatasi tantangan ini dengan menguraikan kueri menjadi sub-pertanyaan yang lebih kecil:</p>
<pre><code translate="no">[<span class="hljs-string">&quot;Who is the director of God&#x27;S Gift To Women?&quot;</span>, <span class="hljs-string">&#x27;Who is the director of Aldri annet enn bråk?&#x27;</span>, <span class="hljs-string">&#x27;What are the ages of the respective directors?&#x27;</span>, <span class="hljs-string">&#x27;Which director is older?&#x27;</span>]
<button class="copy-code-btn"></button></code></pre>
<p>Pertama-tama mengambil informasi tentang sutradara dari kedua film,</p>
<pre><code translate="no">The director of <span class="hljs-string">&quot;God&#x27;s Gift To Women&quot;</span> <span class="hljs-keyword">is</span> Michael Curtiz, the director of <span class="hljs-string">&quot;Aldri annet enn bråk&quot;</span> <span class="hljs-keyword">is</span> Edith Carlmar
<button class="copy-code-btn"></button></code></pre>
<p>kemudian menghasilkan sub-kueri:</p>
<pre><code translate="no">[<span class="hljs-string">&quot;Find the birthdate of Michael Curtiz, the director of God&#x27;s Gift To Women&quot;</span>, <span class="hljs-string">&#x27;Find the birthdate of Edith Carlmar, the director of Aldri annet enn bråk&#x27;</span>]
<button class="copy-code-btn"></button></code></pre>
<p>lalu mengekstrak tanggal lahir mereka, dan akhirnya membandingkannya untuk menentukan jawaban yang benar:</p>
<pre><code translate="no">The director of <span class="hljs-string">&quot;God&#x27;s Gift To Women&quot;</span> <span class="hljs-keyword">is</span> Michael Curtiz, who was born <span class="hljs-keyword">on</span> December <span class="hljs-number">24</span>, <span class="hljs-number">1886</span> <span class="hljs-keyword">and</span> passed away <span class="hljs-keyword">on</span> April <span class="hljs-number">11</span>, <span class="hljs-number">1962.</span> He was a Hungarian-born American film director known <span class="hljs-keyword">for</span> his prolific career <span class="hljs-keyword">in</span> Hollywood.
On the other hand, the director of <span class="hljs-string">&quot;Aldri annet enn bråk&quot;</span> <span class="hljs-keyword">is</span> Edith Carlmar, who was born <span class="hljs-keyword">on</span> November <span class="hljs-number">15</span>, <span class="hljs-number">1911</span> <span class="hljs-keyword">and</span> passed away <span class="hljs-keyword">on</span> May <span class="hljs-number">17</span>, <span class="hljs-number">2003.</span>
Therefore, Michael Curtiz <span class="hljs-keyword">is</span> older than Edith Carlmar.
<button class="copy-code-btn"></button></code></pre>
<p>Sebaliknya, sistem RAG konvensional mungkin melewatkan detail-detail penting karena pengambilan yang terbatas dalam satu kali proses, yang berpotensi menghasilkan jawaban yang <a href="https://zilliz.com/blog/decoding-llm-hallucinations-deep-dive-into-llm-errors">halusinasi</a> atau tidak akurat:</p>
<pre><code translate="no"><span class="hljs-number">1.</span> **Aldri annet enn bråk** (<span class="hljs-number">1954</span>) <span class="hljs-keyword">is</span> directed <span class="hljs-keyword">by</span> **Edith Carlmar**, who was born <span class="hljs-keyword">on</span> November <span class="hljs-number">15</span>, <span class="hljs-number">1911.</span>
<span class="hljs-number">2.</span> The related chunks did <span class="hljs-keyword">not</span> provide specific details about the director of <span class="hljs-string">&quot;God&#x27;s Gift to Women.&quot;</span> However, <span class="hljs-keyword">if</span> we look at external sources <span class="hljs-keyword">for</span> <span class="hljs-string">&quot;God&#x27;s Gift to Women,&quot;</span> the film was directed <span class="hljs-keyword">by</span> **L. M. (Lyman) Steinberg**, who was born <span class="hljs-keyword">on</span> December <span class="hljs-number">19</span>, <span class="hljs-number">1905.</span>
By comparing their birth dates:
- Edith Carlmar: November <span class="hljs-number">15</span>, <span class="hljs-number">1911</span>
- L. M. Steinberg: December <span class="hljs-number">19</span>, <span class="hljs-number">1905</span>
**Conclusion**: L. M. Steinberg, the director of <span class="hljs-string">&quot;God&#x27;s Gift to Women,&quot;</span> <span class="hljs-keyword">is</span> older than Edith Carlmar, the director of <span class="hljs-string">&quot;Aldri annet enn bråk.&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>DeepSearcher menonjol dengan melakukan pencarian yang mendalam dan berulang-ulang pada data lokal yang diimpor. Alat ini mencatat setiap langkah dari proses penalarannya dan pada akhirnya memberikan laporan yang komprehensif dan terpadu. Hal ini membuatnya sangat efektif untuk kueri tipe ikhtisar-seperti menghasilkan laporan terperinci atau meringkas tren-dan untuk kueri penalaran kompleks yang membutuhkan pemecahan pertanyaan menjadi sub-pertanyaan yang lebih kecil dan menggabungkan data melalui beberapa loop umpan balik.</p>
<p>Pada bagian selanjutnya, kami akan membandingkan DeepSearcher dengan sistem RAG lainnya, mengeksplorasi bagaimana pendekatan berulang dan integrasi model yang fleksibel dibandingkan dengan metode tradisional.</p>
<h2 id="Quantitative-Comparison-DeepSearcher-vs-Traditional-RAG" class="common-anchor-header">Perbandingan Kuantitatif: DeepSearcher vs RAG Tradisional<button data-href="#Quantitative-Comparison-DeepSearcher-vs-Traditional-RAG" class="anchor-icon" translate="no">
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
    </button></h2><p>Di repositori GitHub DeepSearcher, kami telah menyediakan kode untuk pengujian kuantitatif. Untuk analisis ini, kami menggunakan kumpulan data 2WikiMultiHopQA yang populer. (Catatan: Kami hanya mengevaluasi 50 entri pertama untuk mengelola konsumsi token API, tetapi tren keseluruhannya tetap jelas).</p>
<h3 id="Recall-Rate-Comparison" class="common-anchor-header">Perbandingan Tingkat Penarikan Kembali</h3><p>Seperti yang ditunjukkan pada Gambar 4, tingkat penarikan meningkat secara signifikan seiring dengan meningkatnya jumlah iterasi maksimum:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_4_Max_Iterations_vs_Recall_18a8d6e9bf.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Gambar 4: Iterasi Maksimum vs. Penarikan</em></p>
<p>Setelah titik tertentu, peningkatan marjinal meruncing - oleh karena itu, kami biasanya menetapkan default ke 3 iterasi, meskipun ini dapat disesuaikan berdasarkan kebutuhan spesifik.</p>
<h3 id="Token-Consumption-Analysis" class="common-anchor-header">Analisis Konsumsi Token</h3><p>Kami juga mengukur total penggunaan token untuk 50 kueri pada jumlah iterasi yang berbeda:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_5_Max_Iterations_vs_Token_Usage_6d1d44b114.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Gambar 5: Iterasi Maks vs Penggunaan Token</em></p>
<p>Hasilnya menunjukkan bahwa konsumsi token meningkat secara linear dengan semakin banyak iterasi. Sebagai contoh, dengan 4 iterasi, DeepSearcher mengkonsumsi sekitar 0,3 juta token. Dengan menggunakan perkiraan kasar berdasarkan harga gpt-4o-mini OpenAI sebesar <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mn>0,</mn><mi>60/1Moutputtokens</mi><mo separator="true">,</mo><mi>thisequatestoanaveragecostofabout0</mi></mrow></semantics></math></span></span>, <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><annotation encoding="application/x-tex">60/1M output token, ini setara dengan biaya rata-rata sekitar</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span></span></span></span>0, <span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord mathnormal">60/1Moutputtokens</span><span class="mpunct">,</span><span class="mspace" style="margin-right:0.1667em;"></span><span class="mord mathnormal">thisequatestoanaveragecostofabout0</span></span></span></span>,0036 per kueri (atau sekitar $ 0,18 untuk 50 kueri).</p>
<p>Untuk model inferensi yang lebih intensif sumber daya, biayanya akan beberapa kali lebih tinggi karena harga per token yang lebih tinggi dan output token yang lebih besar.</p>
<h3 id="Model-Performance-Comparison" class="common-anchor-header">Perbandingan Kinerja Model</h3><p>Keuntungan yang signifikan dari DeepSearcher adalah fleksibilitasnya dalam beralih di antara model yang berbeda. Kami menguji berbagai model inferensi dan model non-inferensi (seperti gpt-4o-mini). Secara keseluruhan, model inferensi - terutama Claude 3.7 Soneta - cenderung memiliki kinerja terbaik, meskipun perbedaannya tidak terlalu dramatis.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_6_Average_Recall_by_Model_153c93f616.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Gambar 6: Rata-rata Recall berdasarkan Model</em></p>
<p>Khususnya, beberapa model non-inferensi yang lebih kecil terkadang tidak dapat menyelesaikan proses kueri agen secara penuh karena kemampuan mereka yang terbatas untuk mengikuti instruksi - tantangan umum bagi banyak pengembang yang bekerja dengan sistem yang serupa.</p>
<h2 id="DeepSearcher-Agentic-RAG-vs-Graph-RAG" class="common-anchor-header">DeepSearcher (Agentic RAG) vs Graph RAG<button data-href="#DeepSearcher-Agentic-RAG-vs-Graph-RAG" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://zilliz.com/blog/graphrag-explained-enhance-rag-with-knowledge-graphs">Graph RAG</a> juga mampu menangani kueri yang kompleks, khususnya kueri multi-hop. Lalu, apa perbedaan antara DeepSearcher (Agentic RAG) dan Graph RAG?</p>
<p>Graph RAG dirancang untuk meng-query dokumen berdasarkan tautan relasional eksplisit, sehingga sangat kuat dalam query multi-hop. Misalnya, ketika memproses novel yang panjang, Graph RAG dapat mengekstrak hubungan yang rumit di antara karakter dengan tepat. Namun, metode ini membutuhkan penggunaan token yang substansial selama impor data untuk memetakan hubungan-hubungan ini, dan mode kueri cenderung kaku-biasanya hanya efektif untuk kueri hubungan tunggal.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_7_Graph_RAG_vs_Deep_Searcher_a5c7130374.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Gambar 7: Graph RAG vs DeepSearcher</em></p>
<p>Sebaliknya, Agentic RAG - seperti yang dicontohkan oleh DeepSearcher - mengambil pendekatan yang berbeda secara fundamental. RAG meminimalkan konsumsi token selama impor data dan sebagai gantinya menginvestasikan sumber daya komputasi selama pemrosesan kueri. Pilihan desain ini menciptakan pengorbanan teknis yang penting:</p>
<ol>
<li><p>Biaya di muka lebih rendah: DeepSearcher membutuhkan lebih sedikit preprocessing dokumen, sehingga penyiapan awal menjadi lebih cepat dan lebih murah</p></li>
<li><p>Penanganan kueri dinamis: Sistem dapat menyesuaikan strategi pencarian dengan cepat berdasarkan temuan-temuan perantara</p></li>
<li><p>Biaya per kueri yang lebih tinggi: Setiap kueri membutuhkan lebih banyak komputasi daripada Graph RAG, tetapi memberikan hasil yang lebih fleksibel</p></li>
</ol>
<p>Bagi pengembang, perbedaan ini sangat penting ketika merancang sistem dengan pola penggunaan yang berbeda. Graph RAG mungkin lebih efisien untuk aplikasi dengan pola kueri yang dapat diprediksi dan volume kueri yang tinggi, sementara pendekatan DeepSearcher unggul dalam skenario yang membutuhkan fleksibilitas dan penanganan kueri yang tidak dapat diprediksi dan kompleks.</p>
<p>Ke depannya, seiring dengan turunnya biaya LLM dan kinerja inferensi yang terus meningkat, sistem Agentic RAG seperti DeepSearcher akan semakin umum digunakan. Kerugian biaya komputasi akan berkurang, sementara keuntungan fleksibilitas akan tetap ada.</p>
<h2 id="DeepSearcher-vs-Deep-Research" class="common-anchor-header">DeepSearcher vs Deep Research<button data-href="#DeepSearcher-vs-Deep-Research" class="anchor-icon" translate="no">
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
    </button></h2><p>Tidak seperti Deep Research milik OpenAI, DeepSearcher secara khusus dirancang untuk pengambilan dan analisis data pribadi yang mendalam. Dengan memanfaatkan basis data vektor, DeepSearcher dapat menelan sumber data yang beragam, mengintegrasikan berbagai jenis data, dan menyimpannya secara seragam dalam repositori pengetahuan berbasis vektor. Kemampuan pencarian semantiknya yang kuat memungkinkannya untuk secara efisien mencari data offline dalam jumlah besar.</p>
<p>Selain itu, DeepSearcher sepenuhnya bersifat open source. Meskipun Deep Research tetap menjadi pemimpin dalam kualitas pembuatan konten, DeepSearcher hadir dengan biaya bulanan dan beroperasi sebagai produk sumber tertutup, yang berarti proses internalnya disembunyikan dari pengguna. Sebaliknya, DeepSearcher memberikan transparansi penuh-pengguna dapat memeriksa kode, menyesuaikannya agar sesuai dengan kebutuhan mereka, atau bahkan menerapkannya di lingkungan produksi mereka sendiri.</p>
<h2 id="Technical-Insights" class="common-anchor-header">Wawasan Teknis<button data-href="#Technical-Insights" class="anchor-icon" translate="no">
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
    </button></h2><p>Selama pengembangan dan iterasi selanjutnya dari DeepSearcher, kami telah mengumpulkan beberapa wawasan teknis yang penting:</p>
<h3 id="Inference-Models-Effective-but-Not-Infallible" class="common-anchor-header">Model Inferensi: Efektif tetapi Tidak Sempurna</h3><p>Eksperimen kami mengungkapkan bahwa meskipun model inferensi berkinerja baik sebagai agen, model inferensi terkadang menganalisis instruksi langsung secara berlebihan, yang mengarah pada konsumsi token yang berlebihan dan waktu respons yang lebih lambat. Pengamatan ini sejalan dengan pendekatan penyedia AI utama seperti OpenAI, yang tidak lagi membedakan antara model inferensi dan non-inferensi. Sebaliknya, layanan model harus secara otomatis menentukan kebutuhan inferensi berdasarkan persyaratan khusus untuk menghemat token.</p>
<h3 id="The-Imminent-Rise-of-Agentic-RAG" class="common-anchor-header">Bangkitnya RAG Agenik yang Akan Segera Terjadi</h3><p>Dari perspektif permintaan, pembuatan konten yang mendalam sangat penting; secara teknis, meningkatkan efektivitas RAG juga sangat penting. Dalam jangka panjang, biaya adalah penghalang utama untuk adopsi Agentic RAG secara luas. Namun, dengan munculnya LLM berkualitas tinggi yang hemat biaya seperti DeepSeek-R1 dan pengurangan biaya yang didorong oleh Hukum Moore, biaya yang terkait dengan layanan inferensi diperkirakan akan berkurang.</p>
<h3 id="The-Hidden-Scaling-Limit-of-Agentic-RAG" class="common-anchor-header">Batas Penskalaan Tersembunyi dari Agentic RAG</h3><p>Temuan penting dari penelitian kami adalah mengenai hubungan antara kinerja dan sumber daya komputasi. Awalnya, kami berhipotesis bahwa dengan meningkatkan jumlah iterasi dan alokasi token secara proporsional akan meningkatkan hasil untuk kueri yang kompleks.</p>
<p>Eksperimen kami menunjukkan kenyataan yang lebih berbeda: meskipun kinerja memang meningkat dengan iterasi tambahan, kami mengamati hasil yang semakin lama semakin berkurang. Secara khusus:</p>
<ul>
<li><p>Performa meningkat tajam dari 1 hingga 3 kali pengulangan</p></li>
<li><p>Peningkatan dari 3 hingga 5 iterasi tidak terlalu signifikan</p></li>
<li><p>Di luar 5 iterasi, keuntungannya dapat diabaikan meskipun ada peningkatan konsumsi token yang signifikan</p></li>
</ul>
<p>Temuan ini memiliki implikasi penting bagi para pengembang: hanya dengan membuang lebih banyak sumber daya komputasi pada sistem RAG bukanlah pendekatan yang paling efisien. Kualitas strategi pengambilan, logika dekomposisi, dan proses sintesis sering kali lebih penting daripada jumlah iterasi mentah. Hal ini menunjukkan bahwa pengembang harus fokus untuk mengoptimalkan komponen-komponen ini daripada hanya meningkatkan anggaran token.</p>
<h3 id="The-Evolution-Beyond-Traditional-RAG" class="common-anchor-header">Evolusi di Luar RAG Tradisional</h3><p>RAG tradisional menawarkan efisiensi yang berharga dengan pendekatan pengambilan tunggal berbiaya rendah, sehingga cocok untuk skenario menjawab pertanyaan secara langsung. Namun, keterbatasannya menjadi jelas ketika menangani pertanyaan dengan logika implisit yang kompleks.</p>
<p>Pertimbangkan pertanyaan pengguna seperti "Bagaimana cara mendapatkan 100 juta dalam setahun." Sistem RAG tradisional mungkin dapat mengambil konten tentang karier berpenghasilan tinggi atau strategi investasi, tetapi akan kesulitan:</p>
<ol>
<li><p>Mengidentifikasi ekspektasi yang tidak realistis dalam kueri</p></li>
<li><p>Memecah masalah menjadi sub-sub tujuan yang layak</p></li>
<li><p>Mensintesis informasi dari berbagai domain (bisnis, keuangan, kewirausahaan)</p></li>
<li><p>Menyajikan pendekatan terstruktur dan multi jalur dengan jadwal yang realistis</p></li>
</ol>
<p>Di sinilah sistem Agentic RAG seperti DeepSearcher menunjukkan kekuatannya. Dengan menguraikan kueri yang rumit dan menerapkan penalaran multi-langkah, sistem ini dapat memberikan respons yang bernuansa dan komprehensif yang lebih baik untuk memenuhi kebutuhan informasi yang mendasari pengguna. Seiring dengan semakin efisiennya sistem ini, kami berharap dapat melihat adopsi mereka semakin cepat di seluruh aplikasi perusahaan.</p>
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
    </button></h2><p>DeepSearcher mewakili evolusi yang signifikan dalam desain sistem RAG, menawarkan kepada para pengembang sebuah kerangka kerja yang kuat untuk membangun kemampuan pencarian dan penelitian yang lebih canggih. Keunggulan teknis utamanya meliputi:</p>
<ol>
<li><p>Penalaran berulang: Kemampuan untuk memecah kueri yang rumit menjadi sub-langkah logis dan secara progresif membangun jawaban yang komprehensif</p></li>
<li><p>Arsitektur yang fleksibel: Dukungan untuk menukar model yang mendasari dan menyesuaikan proses penalaran agar sesuai dengan kebutuhan aplikasi tertentu</p></li>
<li><p>Integrasi basis data vektor: Koneksi tanpa hambatan ke Milvus untuk penyimpanan dan pengambilan vektor yang efisien dari sumber data pribadi</p></li>
<li><p>Eksekusi yang transparan: Pencatatan terperinci dari setiap langkah penalaran, memungkinkan pengembang untuk men-debug dan mengoptimalkan perilaku sistem</p></li>
</ol>
<p>Pengujian kinerja kami mengonfirmasi bahwa DeepSearcher memberikan hasil yang unggul untuk kueri yang kompleks dibandingkan dengan pendekatan RAG tradisional, meskipun dengan pengorbanan yang jelas dalam hal efisiensi komputasi. Konfigurasi optimal (biasanya sekitar 3 iterasi) menyeimbangkan akurasi dengan konsumsi sumber daya.</p>
<p>Karena biaya LLM terus menurun dan kemampuan penalaran meningkat, pendekatan Agentic RAG yang diimplementasikan di DeepSearcher akan menjadi semakin praktis untuk aplikasi produksi. Untuk pengembang yang bekerja pada pencarian perusahaan, asisten penelitian, atau sistem manajemen pengetahuan, DeepSearcher menawarkan fondasi sumber terbuka yang kuat yang dapat disesuaikan dengan kebutuhan domain tertentu.</p>
<p>Kami menyambut baik kontribusi dari komunitas pengembang dan mengundang Anda untuk menjelajahi paradigma baru dalam implementasi RAG ini dengan melihat <a href="https://github.com/zilliztech/deep-searcher">repositori GitHub</a> kami.</p>
