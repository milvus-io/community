---
id: ai-agents-vs-workflows-why-80-need-simple-automation.md
title: >-
  Agen AI atau Alur Kerja? Mengapa Anda Harus Melewatkan Agen untuk 80% Tugas
  Otomatisasi
author: Min Yin
date: 2025-08-11T00:00:00.000Z
desc: >-
  Integrasi Refly dan Milvus menawarkan pendekatan pragmatis terhadap
  otomatisasi-yang menghargai keandalan dan kemudahan penggunaan daripada
  kerumitan yang tidak perlu.
cover: >-
  assets.zilliz.com/AI_Agents_or_Workflows_Why_You_Should_Skip_Agents_for_80_of_Automation_Tasks_9f54386e8a.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search'
meta_keywords: 'Milvus, AI Agent, workflow, Refly, vector database'
meta_title: |
  AI Agents or Workflows? Why Skip Agents for 80% of Automation
origin: 'https://milvus.io/blog/ai-agents-vs-workflows-why-80-need-simple-automation.md'
---
<p>Agen AI ada di mana-mana saat ini-mulai dari kopilot pengkodean hingga bot layanan pelanggan-dan mereka bisa sangat bagus dalam penalaran yang rumit. Seperti kebanyakan dari Anda, saya menyukai mereka. Namun, setelah membangun agen dan alur kerja otomatisasi, saya belajar sebuah kebenaran sederhana: <strong>agen bukanlah solusi terbaik untuk setiap masalah</strong>.</p>
<p>Sebagai contoh, ketika saya membangun sistem multi-agen dengan CrewAI untuk memecahkan kode ML, semuanya menjadi berantakan dengan cepat. Agen riset mengabaikan perayap web 70% dari waktu. Agen ringkasan menjatuhkan kutipan. Koordinasi menjadi berantakan setiap kali tugas tidak jelas.</p>
<p>Dan ini tidak hanya terjadi dalam eksperimen. Banyak dari kita yang sudah beralih dari ChatGPT untuk bertukar pikiran, Claude untuk pengkodean, dan setengah lusin API untuk pemrosesan data-dengan diam-diam berpikir: <em>pasti ada cara yang lebih baik untuk membuat semua ini berjalan bersama</em>.</p>
<p>Terkadang, jawabannya adalah agen. Lebih seringnya, ini adalah <strong>alur kerja AI yang dirancang dengan baik</strong> yang menyatukan alat bantu yang sudah ada menjadi sesuatu yang kuat, tanpa kerumitan yang tak terduga.</p>
<h2 id="Building-Smarter-AI-Workflows-with-Refly-and-Milvus" class="common-anchor-header">Membangun Alur Kerja AI yang Lebih Cerdas dengan Refly dan Milvus<button data-href="#Building-Smarter-AI-Workflows-with-Refly-and-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Saya tahu beberapa dari Anda sudah menggelengkan kepala: "Alur kerja? Itu kaku. Mereka tidak cukup pintar untuk otomatisasi AI yang sesungguhnya." Sebenarnya, sebagian besar alur kerja itu kaku, karena dimodelkan setelah jalur perakitan jadul: langkah A → langkah B → langkah C, tidak ada deviasi yang diizinkan.</p>
<p>Namun, masalah sebenarnya bukanlah <em>ide</em> alur kerja, melainkan <em>pelaksanaannya</em>. Kita tidak harus puas dengan jalur pipa linier yang rapuh. Kita dapat merancang alur kerja yang lebih cerdas yang beradaptasi dengan konteks, fleksibel dengan kreativitas, dan tetap memberikan hasil yang dapat diprediksi.</p>
<p>Dalam panduan ini, kita akan membangun sistem pembuatan konten lengkap menggunakan Refly dan Milvus untuk menunjukkan mengapa alur kerja AI dapat mengungguli arsitektur multi-agen yang kompleks, terutama jika Anda peduli dengan kecepatan, keandalan, dan pemeliharaan.</p>
<h3 id="The-Tools-We’re-Using" class="common-anchor-header">Alat yang Kami Gunakan</h3><p><a href="https://refly.ai/"><strong>Refly</strong></a>: Platform pembuatan konten asli AI bersumber terbuka yang dibangun dengan konsep "kanvas bebas".</p>
<ul>
<li><p><strong>Kemampuan inti:</strong> kanvas cerdas, manajemen pengetahuan, dialog multi-berulir, dan alat kreasi profesional.</p></li>
<li><p><strong>Mengapa ini berguna:</strong> Pembuatan alur kerja seret dan lepas memungkinkan Anda merangkai alat bantu menjadi rangkaian otomatisasi yang kohesif, tanpa membuat Anda terkunci dalam eksekusi jalur tunggal yang kaku.</p></li>
</ul>
<p><a href="https://milvus.io/"><strong>Milvus</strong></a>: Basis data vektor sumber terbuka yang menangani lapisan data.</p>
<ul>
<li><p><strong>Mengapa ini penting:</strong> Pembuatan konten sebagian besar adalah tentang menemukan dan menggabungkan kembali informasi yang ada. Basis data tradisional menangani data terstruktur dengan baik, tetapi sebagian besar pekerjaan kreatif melibatkan format yang tidak terstruktur-dokumen, gambar, video.</p></li>
<li><p><strong>Apa yang ditambahkan:</strong> Milvus memanfaatkan model penyematan terintegrasi untuk menyandikan data tidak terstruktur sebagai vektor, memungkinkan pencarian semantik sehingga alur kerja Anda dapat mengambil konteks yang relevan dengan latensi milidetik. Melalui protokol seperti MCP, Milvus terintegrasi secara mulus dengan kerangka kerja AI Anda, sehingga Anda dapat menanyakan data dalam bahasa alami alih-alih berkutat dengan sintaks database.</p></li>
</ul>
<h3 id="Setting-Up-Your-Environment" class="common-anchor-header">Menyiapkan Lingkungan Anda</h3><p>Saya akan memandu Anda dalam menyiapkan alur kerja ini secara lokal.</p>
<p><strong>Daftar periksa penyiapan cepat:</strong></p>
<ul>
<li><p>Ubuntu 20.04+ (atau Linux yang serupa)</p></li>
<li><p>Docker + Docker Compose</p></li>
<li><p>Kunci API dari LLM mana pun yang mendukung pemanggilan fungsi. Di sini, dalam panduan ini, saya akan menggunakan LLM <a href="https://platform.moonshot.ai/docs/introduction#text-generation-model">Moonshot</a>.</p></li>
</ul>
<p><strong>Persyaratan Sistem</strong></p>
<ul>
<li><p>CPU: Minimum 8 inti (disarankan 16 inti)</p></li>
<li><p>Memori: Minimum 16GB (disarankan 32GB)</p></li>
<li><p>Penyimpanan: Minimum 100GB SSD (disarankan 500GB)</p></li>
<li><p>Jaringan: Diperlukan koneksi internet yang stabil</p></li>
</ul>
<p><strong>Ketergantungan Perangkat Lunak</strong></p>
<ul>
<li><p>Sistem Operasi: Linux (disarankan Ubuntu 20.04+)</p></li>
<li><p>Kontainerisasi: Docker + Docker Compose</p></li>
<li><p>Python: Versi 3.11 atau lebih tinggi</p></li>
<li><p>Model Bahasa: Model apa pun yang mendukung pemanggilan fungsi (layanan online atau penerapan offline Ollama, keduanya dapat digunakan)</p></li>
</ul>
<h3 id="Step-1-Deploy-the-Milvus-Vector-Database" class="common-anchor-header">Langkah 1: Menyebarkan Basis Data Vektor Milvus</h3><p><strong>1.1 Unduh Milvus</strong></p>
<pre><code translate="no">wget https://github.com/milvus-io/milvus/releases/download/v2.5.12/milvus-standalone-docker-compose.yml -O docker-compose.yml
<button class="copy-code-btn"></button></code></pre>
<p><strong>1.2 Luncurkan layanan Milvus</strong></p>
<pre><code translate="no">docker-compose up -d
docker-compose ps -a
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/1_b93ce78614.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-2-Deploy-the-Refly-Platform" class="common-anchor-header">Langkah 2: Menerapkan Platform Refly</h3><p><strong>2.1 Kloning repositori</strong></p>
<p>Anda dapat menggunakan nilai default untuk semua variabel lingkungan kecuali jika Anda memiliki persyaratan khusus:</p>
<pre><code translate="no">git <span class="hljs-built_in">clone</span> https://github.com/refly-ai/refly.git
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no"><span class="hljs-built_in">cd</span> deploy/docker
<span class="hljs-built_in">cp</span> ../../apps/api/.env.example .<span class="hljs-built_in">env</span> <span class="hljs-comment"># copy the example api env file</span>
docker compose up -d
<button class="copy-code-btn"></button></code></pre>
<p><strong>2.2 Verifikasi status layanan</strong></p>
<pre><code translate="no">docker ps -a
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2_cfcde2c570.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-3-Set-Up-MCP-Services" class="common-anchor-header">Langkah 3: Menyiapkan Layanan MCP</h3><p><strong>3.1 Unduh server MCP Milvus</strong></p>
<pre><code translate="no">git <span class="hljs-built_in">clone</span> https://github.com/zilliztech/mcp-server-milvus.git
<span class="hljs-built_in">cd</span> mcp-server-milvus
<button class="copy-code-btn"></button></code></pre>
<p><strong>3.2 Mulai layanan MCP</strong></p>
<p>Contoh ini menggunakan mode SSE. Ganti URI dengan titik akhir layanan Milvus yang tersedia:</p>
<pre><code translate="no">uv run src/mcp_server_milvus/server.py --sse --milvus-uri http://localhost:19530 --port 8000
<button class="copy-code-btn"></button></code></pre>
<p><strong>3.3 Konfirmasikan bahwa layanan MCP telah berjalan</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/3_b755922c41.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-4-Configuration-and-Setup" class="common-anchor-header">Langkah 4: Konfigurasi dan Penyiapan</h3><p>Sekarang setelah infrastruktur Anda berjalan, mari konfigurasikan semuanya agar dapat bekerja sama dengan mulus.</p>
<p><strong>4.1 Mengakses platform Refly</strong></p>
<p>Arahkan ke instans Refly lokal Anda:</p>
<pre><code translate="no"><span class="hljs-attr">http</span>:<span class="hljs-comment">//192.168.7.148:5700</span>
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/4_c1e421fece.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>4.2 Buat akun Anda</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/42_4b8af22fe3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/422_e8cd8439f0.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>4.3 Konfigurasikan model bahasa Anda</strong></p>
<p>Untuk panduan ini, kita akan menggunakan <a href="https://platform.moonshot.ai/docs/introduction#text-generation-model">Moonshot</a>. Pertama, daftar dan dapatkan kunci API Anda.</p>
<p><strong>4.4 Tambahkan penyedia model Anda</strong></p>
<p>Masukkan kunci API yang Anda peroleh di langkah sebelumnya:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/44_b085f9a263.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>4.5 Konfigurasikan model LLM</strong></p>
<p>Pastikan untuk memilih model yang mendukung kemampuan pemanggilan fungsi, karena ini penting untuk integrasi alur kerja yang akan kita buat:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/45_a05213d0fa.pngQ" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>4.6 Mengintegrasikan layanan Milvus-MCP</strong></p>
<p>Perhatikan bahwa versi web tidak mendukung koneksi tipe stdio, jadi kita akan menggunakan titik akhir HTTP yang telah kita siapkan sebelumnya:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/46_027e21e479.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/462_959ee44a78.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Luar biasa! Dengan semua yang telah dikonfigurasi, mari kita lihat sistem ini bekerja melalui beberapa contoh praktis.</p>
<p><strong>4.7 Contoh: Pengambilan Vektor yang Efisien dengan MCP-Milvus-Server</strong></p>
<p>Contoh ini menunjukkan bagaimana <strong>MCP-Milvus-Server</strong> bekerja sebagai middleware antara model AI Anda dan instance database vektor Milvus. Ia bertindak seperti penerjemah-menerima permintaan bahasa alami dari model AI Anda, mengubahnya menjadi kueri basis data yang tepat, dan mengembalikan hasilnya-sehingga model Anda dapat bekerja dengan data vektor tanpa mengetahui sintaksis basis data apa pun.</p>
<p><strong>4.7.1 Membuat kanvas baru</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/471_a684e275ed.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>4.7.2 Memulai percakapan</strong></p>
<p>Buka antarmuka dialog, pilih model Anda, masukkan pertanyaan Anda, dan kirim.</p>
<p><strong>4.7.3 Tinjau hasilnya</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/473_7c24a28999.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Apa yang terjadi di sini cukup luar biasa: kami baru saja menunjukkan kontrol bahasa alami dari basis data vektor Milvus menggunakan <a href="https://milvus.io/blog/talk-to-vector-db-manage-milvus-via-natural-language.md">MCP-Milvus-Server</a> sebagai lapisan integrasi. Tidak ada sintaks kueri yang rumit-cukup beritahukan kepada sistem apa yang Anda butuhkan dalam bahasa Inggris, dan sistem akan menangani operasi basis data untuk Anda.</p>
<p><strong>4.8 Contoh 2: Membangun Panduan Penerapan Refly dengan Alur Kerja</strong></p>
<p>Contoh kedua ini menunjukkan kekuatan nyata dari orkestrasi alur kerja. Kita akan membuat panduan penerapan yang lengkap dengan menggabungkan beberapa alat AI dan sumber data ke dalam satu proses yang koheren.</p>
<p><strong>4.8.1 Kumpulkan materi sumber Anda</strong></p>
<p>Kekuatan Refly adalah fleksibilitasnya dalam menangani berbagai format input. Anda dapat mengimpor sumber daya dalam berbagai format, baik itu dokumen, gambar, atau data terstruktur.</p>
<p><strong>4.8.2 Membuat tugas dan menautkan kartu sumber daya</strong></p>
<p>Sekarang kita akan membuat alur kerja kita dengan menentukan tugas dan menghubungkannya ke materi sumber.</p>
<p><strong>4.8.3 Siapkan tiga tugas pemrosesan</strong></p>
<p>Di sinilah pendekatan alur kerja benar-benar bersinar. Alih-alih mencoba menangani semuanya dalam satu proses yang rumit, kami membagi pekerjaan menjadi tiga tugas terfokus yang mengintegrasikan materi yang diunggah dan menyempurnakannya secara sistematis.</p>
<ul>
<li><p><strong>Tugas integrasi konten</strong>: Menggabungkan dan menyusun materi sumber</p></li>
<li><p><strong>Tugas penyempurnaan konten</strong>: Meningkatkan kejelasan dan alur</p></li>
<li><p><strong>Kompilasi draf akhir</strong>: Menciptakan hasil yang siap dipublikasikan</p></li>
</ul>
<p>Hasilnya berbicara dengan sendirinya. Apa yang tadinya memerlukan waktu berjam-jam untuk melakukan koordinasi manual di berbagai alat bantu, sekarang ditangani secara otomatis, dan setiap langkah dibangun secara logis berdasarkan langkah sebelumnya.</p>
<p><strong>Kemampuan alur kerja multi-modal:</strong></p>
<ul>
<li><p><strong>Pembuatan dan pemrosesan gambar</strong>: Integrasi dengan model berkualitas tinggi, termasuk flux-schnell, flux-pro, dan SDXL</p></li>
<li><p><strong>Pembuatan dan pemahaman video</strong>: Dukungan untuk berbagai model video bergaya, termasuk Seedance, Kling, dan Veo</p></li>
<li><p><strong>Alat pembuatan audio</strong>: Pembuatan musik melalui model seperti Lyria-2 dan sintesis suara melalui model seperti Chatterbox</p></li>
<li><p><strong>Pemrosesan terintegrasi</strong>: Semua output multi-modal dapat direferensikan, dianalisis, dan diproses ulang di dalam sistem</p></li>
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
    </button></h2><p>Integrasi <strong>Refly</strong> dan <strong>Milvus</strong> menawarkan pendekatan pragmatis terhadap otomatisasi - yang menghargai keandalan dan kemudahan penggunaan daripada kerumitan yang tidak perlu. Dengan menggabungkan orkestrasi alur kerja dengan pemrosesan multi-modal, tim dapat beralih dari konsep ke publikasi dengan lebih cepat sambil tetap memegang kendali penuh di setiap tahap.</p>
<p>Ini bukan tentang mengabaikan agen AI. Mereka sangat berharga untuk mengatasi masalah yang benar-benar kompleks dan tidak dapat diprediksi. Namun, untuk banyak kebutuhan otomatisasi-terutama dalam pembuatan konten dan pemrosesan data-alur kerja yang dirancang dengan baik dapat memberikan hasil yang lebih baik dengan biaya yang lebih rendah.</p>
<p>Seiring dengan perkembangan teknologi AI, sistem yang paling efektif kemungkinan besar akan memadukan kedua strategi tersebut:</p>
<ul>
<li><p><strong>Alur kerja</strong> yang dapat diprediksi, mudah dipelihara, dan dapat direproduksi.</p></li>
<li><p><strong>Agen</strong> yang membutuhkan penalaran, kemampuan beradaptasi, dan pemecahan masalah terbuka.</p></li>
</ul>
<p>Tujuannya bukan untuk membangun AI yang paling canggih, melainkan untuk membangun AI yang paling <em>berguna</em>. Dan sering kali, solusi yang paling membantu juga merupakan solusi yang paling mudah.</p>
