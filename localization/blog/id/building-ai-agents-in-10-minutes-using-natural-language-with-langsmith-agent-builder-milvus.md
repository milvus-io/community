---
id: >-
  building-ai-agents-in-10-minutes-using-natural-language-with-langsmith-agent-builder-milvus.md
title: >
  Building AI Agents in 10 Minutes Using Natural Language with LangSmith Agent
  Builder + Milvus
author: Min Yin
date: 2026-01-22T00:00:00.000Z
desc: >-
  Learn how to build memory-enabled AI agents in minutes using LangSmith Agent
  Builder and Milvus—no code, natural language, production-ready.
cover: assets.zilliz.com/cover_LS_MVS_ab8af19bfa.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search'
meta_keywords: >-
  LangSmith Agent Builder, Milvus vector database, AI agent memory, no-code AI
  agents, building AI assistants
meta_title: |
  Build AI Agents in 10 Minutes with LangSmith Agent Builder & Milvus
origin: >-
  https://milvus.io/blog/building-ai-agents-in-10-minutes-using-natural-language-with-langsmith-agent-builder-milvus.md
---
<p>Seiring dengan perkembangan AI yang semakin pesat, semakin banyak tim yang menemukan bahwa membangun asisten AI tidak selalu membutuhkan latar belakang rekayasa perangkat lunak. Orang-orang yang paling membutuhkan asisten - tim produk, operasi, dukungan, peneliti - sering kali tahu persis apa yang harus dilakukan oleh agen, tetapi tidak tahu cara mengimplementasikannya dalam kode. Alat tradisional "tanpa kode" mencoba menjembatani kesenjangan itu dengan kanvas seret dan lepas, namun alat ini runtuh saat Anda membutuhkan perilaku agen yang sebenarnya: penalaran multi-langkah, penggunaan alat, atau memori yang terus-menerus.</p>
<p><a href="https://www.langchain.com/langsmith/agent-builder"><strong>LangSmith Agent Builder</strong></a> yang baru saja dirilis mengambil pendekatan yang berbeda. Alih-alih mendesain alur kerja, Anda mendeskripsikan tujuan agen dan alat yang tersedia dalam bahasa yang sederhana, dan runtime menangani pengambilan keputusan. Tidak ada diagram alur, tidak ada skrip-hanya ada maksud yang jelas.</p>
<p>Namun, niat saja tidak akan menghasilkan asisten yang cerdas. <strong>Memori</strong> yang menghasilkannya. Di sinilah <a href="https://milvus.io/"><strong>Milvus</strong></a>, basis data vektor sumber terbuka yang diadopsi secara luas, menyediakan fondasinya. Dengan menyimpan dokumen dan riwayat percakapan sebagai penyematan, Milvus memungkinkan agen Anda mengingat konteks, mengambil informasi yang relevan, dan merespons secara akurat dalam skala besar.</p>
<p>Panduan ini menjelaskan cara membuat asisten AI yang siap produksi dan berkemampuan memori menggunakan <strong>LangSmith Agent Builder + Milvus</strong>, semuanya tanpa menulis satu baris kode pun.</p>
<h2 id="What-is-LangSmith-Agent-Builder-and-How-It-Works" class="common-anchor-header">Apa itu LangSmith Agent Builder dan Bagaimana Cara Kerjanya?<button data-href="#What-is-LangSmith-Agent-Builder-and-How-It-Works" class="anchor-icon" translate="no">
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
    </button></h2><p>Seperti namanya, <a href="https://www.google.com/search?q=LangSmith+Agent+Builder&amp;oq=what+is+LangSmith+Agent+Builder&amp;gs_lcrp=EgZjaHJvbWUyBggAEEUYOTIHCAEQABiABDIHCAIQABiABDIHCAMQABiABDIHCAQQABiABDIHCAUQABiABDIHCAYQABiABDIHCAcQABiABDIGCAgQABgDMggICRAAGBYYHtIBCTI1OTJqMGoxNagCCLACAfEF2Mylr_IuXLk&amp;sourceid=chrome&amp;ie=UTF-8&amp;ved=2ahUKEwjV1LfvxZ6SAxVFsFYBHYzTJAsQgK4QegQIARAB">LangSmith Agent Builder</a> adalah alat tanpa kode dari LangChain yang memungkinkan Anda membangun, menerapkan, dan mengelola agen AI menggunakan bahasa sederhana. Alih-alih menulis logika atau mendesain alur visual, Anda menjelaskan apa yang harus dilakukan agen, alat apa yang dapat digunakan, dan bagaimana perilakunya. Sistem kemudian menangani bagian yang sulit-menghasilkan perintah, memilih alat, menyambungkan komponen, dan mengaktifkan memori.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/_57c5cee35b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Tidak seperti alat bantu tanpa kode atau alur kerja tradisional, Agent Builder tidak memiliki kanvas seret dan lepas dan tidak ada pustaka node. Anda berinteraksi dengannya dengan cara yang sama seperti yang Anda lakukan dengan ChatGPT. Jelaskan apa yang ingin Anda bangun, jawab beberapa pertanyaan klarifikasi, dan Builder menghasilkan agen yang berfungsi penuh berdasarkan maksud Anda.</p>
<p>Di balik layar, agen itu dibangun dari empat blok bangunan inti.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_05b90b1f3d.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<ul>
<li><strong>Prompt:</strong> Prompt adalah otak agen, yang menentukan tujuan, batasan, dan logika keputusan. LangSmith Agent Builder menggunakan meta-prompting untuk membangunnya secara otomatis: Anda mendeskripsikan apa yang Anda inginkan, kemudian mengajukan pertanyaan klarifikasi, dan jawaban Anda disintesis menjadi prompt sistem yang terperinci dan siap produksi. Alih-alih menulis logika dengan tangan, Anda cukup mengungkapkan maksud.</li>
<li><strong>Alat:</strong> Alat memungkinkan agen mengambil tindakan-mengirim email, memposting ke Slack, membuat acara kalender, mencari data, atau memanggil API. Agent Builder mengintegrasikan alat-alat ini melalui Model Context Protocol (MCP), yang menyediakan cara yang aman dan dapat diperluas untuk mengekspos kemampuan. Pengguna dapat mengandalkan integrasi bawaan atau menambahkan server MCP khusus, termasuk <a href="https://milvus.io/blog/why-vibe-coding-generate-outdated-code-and-how-to-fix-it-with-milvus-mcp.md">server MCP</a>Milvus untuk pencarian vektor dan memori jangka panjang.</li>
<li><strong>Pemicu:</strong> Pemicu menentukan kapan agen berjalan. Selain eksekusi manual, Anda dapat melampirkan agen ke jadwal atau acara eksternal sehingga mereka secara otomatis merespons pesan, email, atau aktivitas webhook. Ketika pemicu ditembakkan, Pembangun Agen memulai utas eksekusi baru dan menjalankan logika agen, sehingga memungkinkan perilaku yang terus menerus dan digerakkan oleh peristiwa.</li>
<li><strong>Subagen:</strong> Subagen memecah tugas-tugas kompleks menjadi unit-unit yang lebih kecil dan terspesialisasi. Agen utama dapat mendelegasikan pekerjaan ke subagen - masing-masing dengan prompt dan perangkatnya sendiri - sehingga tugas-tugas seperti pengambilan data, peringkasan, atau pemformatan ditangani oleh pembantu khusus. Hal ini untuk menghindari satu prompt yang kelebihan beban dan menciptakan arsitektur agen yang lebih modular dan dapat diskalakan.</li>
</ul>
<h2 id="How-Does-an-Agent-Remember-Your-Preferences" class="common-anchor-header">Bagaimana Agen Mengingat Preferensi Anda?<button data-href="#How-Does-an-Agent-Remember-Your-Preferences" class="anchor-icon" translate="no">
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
    </button></h2><p>Apa yang membuat Agent Builder unik adalah bagaimana ia memperlakukan <em>memori</em>. Alih-alih memasukkan preferensi ke dalam riwayat obrolan, agen dapat memperbarui aturan perilakunya sendiri saat berjalan. Jika Anda mengatakan, "Mulai sekarang, akhiri setiap pesan Slack dengan puisi," agen tidak memperlakukannya sebagai permintaan sekali pakai-agen menyimpannya sebagai preferensi persisten yang berlaku di masa mendatang.</p>
<p>Di balik tenda, agen menyimpan file memori internal-pada dasarnya adalah perintah sistem yang terus berkembang. Setiap kali memulai, agen membaca file ini untuk memutuskan bagaimana berperilaku. Ketika Anda memberikan koreksi atau batasan, agen mengedit file tersebut dengan menambahkan aturan terstruktur seperti "Selalu tutup pengarahan dengan puisi pendek yang membangkitkan semangat." Pendekatan ini jauh lebih stabil daripada mengandalkan riwayat percakapan karena agen secara aktif menulis ulang instruksi pengoperasiannya daripada mengubur preferensi Anda di dalam transkrip.</p>
<p>Desain ini berasal dari FilesystemMiddleware DeepAgents tetapi sepenuhnya diabstraksikan dalam Agent Builder. Anda tidak pernah menyentuh file secara langsung: Anda mengekspresikan pembaruan dalam bahasa alami, dan sistem menangani pengeditan di belakang layar. Jika Anda membutuhkan kontrol lebih, Anda bisa menyambungkan server MCP khusus atau masuk ke lapisan DeepAgents untuk kustomisasi memori tingkat lanjut.</p>
<h2 id="Hands-on-Demo-Building-a-Milvus-Assistant-in-10-Minutes-using-Agent-Builder" class="common-anchor-header">Demo Langsung: Membangun Asisten Milvus dalam 10 Menit menggunakan Pembangun Agen<button data-href="#Hands-on-Demo-Building-a-Milvus-Assistant-in-10-Minutes-using-Agent-Builder" class="anchor-icon" translate="no">
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
    </button></h2><p>Sekarang setelah kita membahas filosofi desain di balik Agent Builder, mari kita bahas proses pembuatannya secara lengkap dengan contoh langsung. Tujuan kami adalah membuat asisten cerdas yang dapat menjawab pertanyaan teknis terkait Milvus, mencari dokumentasi resmi, dan mengingat preferensi pengguna dari waktu ke waktu.</p>
<h3 id="Step-1-Sign-In-to-the-LangChain-Website" class="common-anchor-header">Langkah 1. Masuk ke Situs Web LangChain</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_1_b3c461d39b.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-2-Set-Up-Your-Anthropic-API-Key" class="common-anchor-header">Langkah 2. Siapkan Kunci API Anthropic Anda</h3><p><strong>Catatan:</strong> Anthropic didukung secara default. Anda juga dapat menggunakan model khusus, selama jenisnya termasuk dalam daftar yang secara resmi didukung oleh LangChain.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_2_c04400695e.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>1. Tambahkan Kunci API</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_3_11db4b3824.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>2. Masukkan dan Simpan Kunci API</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_4_abfc27d796.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-3-Create-a-New-Agent" class="common-anchor-header">Langkah 3. Membuat Agen Baru</h3><p><strong>Catatan:</strong> Klik <strong>Pelajari Lebih Lanjut</strong> untuk melihat dokumentasi penggunaan.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_5_e90bf254f2.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_6_7c839d96f3.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<ol>
<li><strong>Mengonfigurasi Model Khusus (Opsional)</strong></li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_7_0dfd5ff561.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>(1) Masukkan Parameter dan Simpan</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_8_85f9e3008f.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_9_0d5d0c062c.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-4-Describe-Your-Requirements-to-Create-the-Agent" class="common-anchor-header">Langkah 4. Jelaskan Persyaratan Anda untuk Membuat Agen</h3><p><strong>Catatan:</strong> Buat agen menggunakan deskripsi bahasa alami.</p>
<pre><code translate="no">
I need a Milvus technical consultant to <span class="hljs-built_in">help</span> me answer technical questions about vector databases. 

Search the official documentation <span class="hljs-keyword">and</span> remember my preference <span class="hljs-keyword">for</span> the index <span class="hljs-built_in">type</span> I use. 

<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_10_0e033a5200.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<ol>
<li><strong>Sistem akan mengajukan pertanyaan lanjutan untuk menyempurnakan persyaratan</strong></li>
</ol>
<p>Pertanyaan 1: Pilih jenis indeks Milvus yang Anda inginkan untuk diingat oleh agen</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_11_050ac891f0.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Pertanyaan 2: Pilih bagaimana agen harus menangani pertanyaan teknis  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_12_d1d6d4f2ed.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Pertanyaan 3: Tentukan apakah agen harus fokus pada panduan untuk versi Milvus tertentu  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_13_5d60df75e9.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-5-Review-and-Confirm-the-Generated-Agent" class="common-anchor-header">Langkah 5. Tinjau dan Konfirmasikan Agen yang Dihasilkan</h3><p><strong>Catatan:</strong> Sistem secara otomatis membuat konfigurasi agen.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_14_8a596ae853.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Sebelum membuat agen, Anda dapat meninjau metadata, alat bantu, dan petunjuknya. Setelah semuanya terlihat benar, klik <strong>Buat</strong> untuk melanjutkan.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_15_5c0b27aca7.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_16_998921b071.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-6-Explore-the-Interface-and-Feature-Areas" class="common-anchor-header">Langkah 6. Jelajahi Area Antarmuka dan Fitur</h3><p>Setelah agen dibuat, Anda akan melihat tiga area fungsional di sudut kiri bawah antarmuka:</p>
<p><strong>(1) Pemicu</strong></p>
<p>Pemicu menentukan kapan agen harus dijalankan, baik sebagai respons terhadap peristiwa eksternal atau sesuai jadwal:</p>
<ul>
<li><strong>Slack:</strong> Mengaktifkan agen ketika ada pesan yang masuk ke saluran tertentu</li>
<li><strong>Gmail:</strong> Memicu agen ketika email baru diterima</li>
<li><strong>Cron:</strong> Menjalankan agen pada interval terjadwal</li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_17_b77c603413.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>(2) Kotak alat</strong></p>
<p>Ini adalah seperangkat alat yang dapat dipanggil oleh agen. Pada contoh yang ditunjukkan, tiga alat dibuat secara otomatis selama pembuatan, dan Anda dapat menambahkan lebih banyak lagi dengan mengeklik <strong>Tambah alat</strong>.  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_18_94637d4548.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Jika agen Anda membutuhkan kemampuan pencarian vektor-seperti pencarian semantik pada dokumentasi teknis dalam jumlah besar-Anda dapat menggunakan Server MCP Milvus</strong> dan menambahkannya di sini dengan menggunakan tombol <strong>MCP</strong>. Pastikan server MCP berjalan <strong>di titik akhir jaringan yang dapat dijangkau</strong>; jika tidak, Pembangun Agen tidak akan dapat memanggilnya.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_19_94fe99a3b8.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>


  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_20_f887a8fbda.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>(3) Sub-agen</strong></p>
<p>Buat modul agen independen yang didedikasikan untuk sub-tugas tertentu, sehingga memungkinkan desain sistem yang modular.</p>
<h3 id="Step-7-Test-the-Agent" class="common-anchor-header">Langkah 7. Menguji Agen</h3><p>Klik <strong>Uji</strong> di sudut kanan atas untuk masuk ke mode pengujian. Di bawah ini adalah contoh hasil pengujian.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_22_527619519b.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_23_639d40c40d.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_24_42a71d2592.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_25_8ab35e15f8.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Agent-Builder-vs-DeepAgents-Which-One-Should-You-Choose" class="common-anchor-header">Pembangun Agen vs DeepAgents: Mana yang Harus Anda Pilih?<button data-href="#Agent-Builder-vs-DeepAgents-Which-One-Should-You-Choose" class="anchor-icon" translate="no">
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
    </button></h2><p>LangChain menawarkan beberapa kerangka kerja agen, dan pilihan yang tepat tergantung pada seberapa banyak kontrol yang Anda butuhkan. <a href="https://www.google.com/search?q=DeepAgents&amp;newwindow=1&amp;sca_esv=0e7ec9ce2aa7d5b4&amp;sxsrf=ANbL-n5pe1KqjmJVjQCqmc3jneYhmGGOUg%3A1769066335766&amp;ei=X89xab21Lp3a1e8Ppam06Ag&amp;ved=2ahUKEwio15nYzZ6SAxU_mq8BHcf3BqUQgK4QegQIARAB&amp;uact=5&amp;oq=what+is+DeepAgents&amp;gs_lp=Egxnd3Mtd2l6LXNlcnAiEndoYXQgaXMgRGVlcEFnZW50czIKEAAYsAMY1gQYRzIKEAAYsAMY1gQYRzIKEAAYsAMY1gQYRzIKEAAYsAMY1gQYRzIKEAAYsAMY1gQYRzIKEAAYsAMY1gQYRzIKEAAYsAMY1gQYRzIKEAAYsAMY1gQYRzINEAAYgAQYsAMYQxiKBTINEAAYgAQYsAMYQxiKBUi8BlAYWL8FcAF4AZABAJgBqgKgAbAKqgEFMC4yLjS4AQPIAQD4AQGYAgGgAgyYAwCIBgGQBgqSBwExoAehHrIHALgHAMIHAzMtMcgHCYAIAA&amp;sclient=gws-wiz-serp">DeepAgents</a> adalah alat pembuat agen. Ini digunakan untuk membangun agen AI yang otonom dan berjalan lama yang menangani tugas-tugas kompleks dan multi-langkah. Dibangun di atas LangGraph, alat ini mendukung perencanaan tingkat lanjut, manajemen konteks berbasis file, dan orkestrasi subagen-menjadikannya ideal untuk proyek-proyek jangka panjang atau proyek tingkat produksi.</p>
<p>Jadi, bagaimana perbandingannya dengan <strong>Agent Builder</strong>, dan kapan Anda harus menggunakan masing-masing?</p>
<p><strong>Agent Builder</strong> berfokus pada kesederhanaan dan kecepatan. Ini mengabstraksikan sebagian besar detail implementasi, memungkinkan Anda mendeskripsikan agen Anda dalam bahasa alami, mengonfigurasi alat, dan segera menjalankannya. Memori, penggunaan alat, dan alur kerja human-in-the-loop ditangani untuk Anda. Hal ini membuat Agent Builder sempurna untuk pembuatan prototipe cepat, alat internal, dan validasi tahap awal di mana kemudahan penggunaan lebih penting daripada kontrol terperinci.</p>
<p>Sebaliknya,<strong>DeepAgents</strong> dirancang untuk skenario di mana Anda membutuhkan kontrol penuh atas memori, eksekusi, dan infrastruktur. Anda dapat menyesuaikan middleware, mengintegrasikan alat Python apa pun, memodifikasi backend penyimpanan (termasuk memori yang bertahan di <a href="https://milvus.io/blog">Milvus</a>), dan secara eksplisit mengelola grafik status agen. Pengorbanannya adalah upaya rekayasa - Anda menulis kode, mengelola dependensi, dan menangani mode kegagalan sendiri - tetapi Anda mendapatkan tumpukan agen yang dapat disesuaikan sepenuhnya.</p>
<p>Yang penting, <strong>Agent Builder dan DeepAgents bukanlah ekosistem yang terpisah-mereka membentuk satu kontinum</strong>. Pembangun Agen dibangun di atas DeepAgents. Artinya, Anda dapat memulai dengan prototipe cepat di Agent Builder, lalu masuk ke DeepAgents ketika Anda membutuhkan lebih banyak fleksibilitas, tanpa menulis ulang semuanya dari awal. Kebalikannya juga berlaku: pola yang dibuat di DeepAgents bisa dikemas sebagai templat Agent Builder sehingga pengguna non-teknis bisa menggunakannya kembali.</p>
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
    </button></h2><p>Berkat perkembangan AI, membangun agen AI tidak lagi membutuhkan alur kerja yang rumit atau rekayasa yang berat. Dengan LangSmith Agent Builder, Anda dapat membuat asisten yang berjalan dengan baik dan berjalan lama hanya dengan menggunakan bahasa alami. Anda fokus untuk mendeskripsikan apa yang harus dilakukan oleh agen, sementara sistem menangani perencanaan, eksekusi alat, dan pembaruan memori yang sedang berlangsung.</p>
<p>Dipasangkan dengan <a href="https://milvus.io/blog">Milvus</a>, agen-agen ini mendapatkan memori yang andal dan persisten untuk pencarian semantik, pelacakan preferensi, dan konteks jangka panjang di seluruh sesi. Baik saat Anda memvalidasi ide atau menerapkan sistem yang dapat diskalakan, LangSmith Agent Builder dan Milvus menyediakan fondasi yang sederhana dan fleksibel untuk agen yang tidak hanya merespons, tetapi juga mengingat dan meningkatkannya dari waktu ke waktu.</p>
<p>Ada pertanyaan atau ingin panduan yang lebih mendalam? Bergabunglah dengan <a href="https://milvusio.slack.com/join/shared_invite/zt-3nntzngkz-gYwhrdSE4~76k0VMyBfD1Q#/shared-invite/email">saluran Slack</a> kami atau pesan sesi <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">Jam Kerja Milvus</a> selama 20 menit untuk mendapatkan panduan yang disesuaikan.</p>
