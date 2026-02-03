---
id: clawdbot-long-running-ai-agents-langgraph-milvus.md
title: >-
  Mengapa Clawdbot Menjadi Viral - Dan Cara Membangun Agen Jangka Panjang yang
  Siap Produksi dengan LangGraph dan Milvus
author: Min Yin
date: 2026-02-03T00:00:00.000Z
cover: >-
  assets.zilliz.com/Clawdbot_Long_Running_Agents_with_Lang_Graph_and_Milvus_62dab00205.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'AI Agent, Langgraph, Milvus, vector database, Clawdbot'
meta_keywords: 'Clawdbot, LangGraph, Milvus, AI Agents, Openclaw'
meta_title: |
  Build Clawdbot-Style AI Agents with LangGraph & Milvus
desc: >-
  Clawdbot membuktikan bahwa orang-orang menginginkan AI yang bertindak.
  Pelajari cara membuat agen yang siap produksi dan berjalan lama dengan
  arsitektur dua agen, Milvus, dan LangGraph.
origin: 'https://milvus.io/blog/clawdbot-long-running-ai-agents-langgraph-milvus.md'
---
<h2 id="Clawdbot-now-OpenClaw-went-viral" class="common-anchor-header">Clawdbot (sekarang menjadi OpenClaw) menjadi viral<button data-href="#Clawdbot-now-OpenClaw-went-viral" class="anchor-icon" translate="no">
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
    </button></h2><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/openclaw_screenshot_two_agents_p1_9bf856b499.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><a href="https://openclaw.ai/">Clawdbot</a>, yang kini berganti nama menjadi OpenClaw, menggemparkan dunia maya minggu lalu. Asisten AI sumber terbuka yang dibangun oleh Peter Steinberger ini meraih <a href="https://github.com/openclaw/openclaw">110.000+ bintang GitHub</a> hanya dalam beberapa hari. Para pengguna mengunggah video-video yang menunjukkan asisten ini secara otonom memeriksa penerbangan, mengelola email, dan mengendalikan perangkat rumah pintar. Andrej Karpathy, insinyur pendiri OpenAI, memujinya. David Sacks, seorang pendiri dan investor teknologi, men-tweet tentang hal ini. Orang-orang menyebutnya "Jarvis, tetapi nyata."</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/David_Stacks_replace_NYC_with_Mac_and_clawdbot_two_agent_p2_2f62f6ad49.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Kemudian muncul peringatan keamanan.</p>
<p>Para peneliti menemukan ratusan panel admin yang terbuka. Bot berjalan dengan akses root secara default. Tidak ada kotak pasir. Kerentanan injeksi yang cepat dapat memungkinkan penyerang membajak agen. Mimpi buruk keamanan.</p>
<h2 id="Clawdbot-went-viral-for-a-reason" class="common-anchor-header">Clawdbot menjadi viral karena suatu alasan<button data-href="#Clawdbot-went-viral-for-a-reason" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Clawdbot menjadi viral karena suatu alasan.</strong> Ia berjalan secara lokal atau di server Anda sendiri. Terhubung ke aplikasi perpesanan yang sudah digunakan orang - WhatsApp, Slack, Telegram, iMessage. Aplikasi ini mengingat konteks dari waktu ke waktu alih-alih melupakan semuanya setelah setiap balasan. Mengelola kalender, meringkas email, dan mengotomatiskan tugas-tugas di seluruh aplikasi.</p>
<p>Pengguna mendapatkan rasa AI pribadi yang lepas tangan dan selalu aktif-bukan hanya alat yang cepat dan responsif. Modelnya yang open-source dan self-hosted menarik bagi para pengembang yang menginginkan kontrol dan penyesuaian. Dan kemudahan mengintegrasikan dengan alur kerja yang ada membuatnya mudah untuk dibagikan dan direkomendasikan.</p>
<h2 id="Two-challenges-for-building-long-running-agents" class="common-anchor-header">Dua tantangan untuk membangun agen yang berjalan lama<button data-href="#Two-challenges-for-building-long-running-agents" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Popularitas Clawdbot membuktikan bahwa orang menginginkan AI yang</strong> <em>bertindak</em><strong>, bukan hanya menjawab</strong>. Namun, agen apa pun yang berjalan dalam jangka waktu yang lama dan menyelesaikan tugas-tugas nyata-apakah itu Clawdbot atau sesuatu yang Anda buat sendiri-harus menyelesaikan dua tantangan teknis: <strong>memori</strong> dan <strong>verifikasi</strong>.</p>
<p><strong>Masalah memori</strong> muncul dalam berbagai cara:</p>
<ul>
<li><p>Agen menghabiskan jendela konteks mereka di tengah-tengah tugas dan meninggalkan pekerjaan yang setengah jadi</p></li>
<li><p>Mereka melupakan daftar tugas lengkap dan menyatakan "selesai" terlalu dini</p></li>
<li><p>Mereka tidak dapat menyerahkan konteks di antara sesi, sehingga setiap sesi baru dimulai dari awal</p></li>
</ul>
<p>Semua ini berasal dari akar yang sama: agen tidak memiliki memori yang persisten. Jendela konteks terbatas, pengambilan lintas sesi terbatas, dan kemajuan tidak dilacak dengan cara yang dapat diakses oleh agen.</p>
<p><strong>Masalah verifikasi</strong> berbeda. Bahkan ketika memori bekerja, agen masih menandai tugas sebagai selesai setelah pengujian unit cepat-tanpa memeriksa apakah fitur tersebut benar-benar bekerja secara menyeluruh.</p>
<p>Clawdbot mengatasi keduanya. Ia menyimpan memori secara lokal di seluruh sesi dan menggunakan "keterampilan" modular untuk mengotomatiskan peramban, berkas, dan layanan eksternal. Pendekatan ini berhasil. Tetapi belum siap untuk produksi. Untuk penggunaan perusahaan, Anda membutuhkan struktur, kemampuan audit, dan keamanan yang tidak disediakan oleh Clawdbot.</p>
<p>Artikel ini membahas masalah yang sama dengan solusi siap-produksi.</p>
<p>Untuk memori, kami menggunakan <strong>arsitektur dua agen</strong> berdasarkan <a href="https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents">penelitian Anthropic</a>: agen inisialisasi yang memecah proyek menjadi fitur-fitur yang dapat diverifikasi, dan agen pengkodean yang mengerjakannya satu per satu dengan handoff yang bersih. Untuk mengingat semantik di seluruh sesi, kami menggunakan <a href="https://milvus.io/">Milvus</a>, basis data vektor yang memungkinkan agen mencari berdasarkan makna, bukan kata kunci.</p>
<p>Untuk verifikasi, kami menggunakan <strong>otomatisasi peramban</strong>. Alih-alih mempercayai tes unit, agen menguji fitur-fitur seperti yang dilakukan oleh pengguna sebenarnya.</p>
<p>Kami akan membahas konsep-konsepnya, kemudian menunjukkan implementasi yang bekerja menggunakan <a href="https://github.com/langchain-ai/langgraph">LangGraph</a> dan Milvus.</p>
<h2 id="How-the-Two-Agent-Architecture-Prevents-Context-Exhaustion" class="common-anchor-header">Bagaimana Arsitektur Dua-Agen Mencegah Kehabisan Konteks<button data-href="#How-the-Two-Agent-Architecture-Prevents-Context-Exhaustion" class="anchor-icon" translate="no">
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
    </button></h2><p>Setiap LLM memiliki jendela konteks: sebuah batasan berapa banyak teks yang dapat diproses sekaligus. Ketika sebuah agen mengerjakan tugas yang kompleks, jendela ini akan terisi dengan kode, pesan kesalahan, riwayat percakapan, dan dokumentasi. Setelah jendela penuh, agen akan berhenti atau mulai melupakan konteks sebelumnya. Untuk tugas yang berjalan lama, hal ini tidak dapat dihindari.</p>
<p>Pertimbangkan agen yang diberi perintah sederhana: "Buatlah tiruan dari claude.ai." Proyek ini membutuhkan autentikasi, antarmuka obrolan, riwayat percakapan, respons streaming, dan lusinan fitur lainnya. Satu agen akan mencoba menangani semuanya sekaligus. Di tengah-tengah implementasi antarmuka obrolan, jendela konteks terisi penuh. Sesi ini berakhir dengan kode setengah tertulis, tidak ada dokumentasi tentang apa yang telah dicoba, dan tidak ada indikasi tentang apa yang berhasil dan apa yang tidak. Sesi berikutnya mewarisi kekacauan. Bahkan dengan pemadatan konteks, agen baru harus menebak apa yang dilakukan sesi sebelumnya, men-debug kode yang tidak ditulisnya, dan mencari tahu di mana harus melanjutkan. Berjam-jam terbuang sebelum ada kemajuan baru yang dibuat.</p>
<h3 id="The-Two-Fold-Agent-Solution" class="common-anchor-header">Solusi Agen Dua Kali Lipat</h3><p>Solusi Anthropic, yang dijelaskan dalam posting teknik mereka <a href="https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents">"Pemanfaatan yang efektif untuk agen yang sudah berjalan lama",</a> adalah dengan menggunakan dua mode permintaan yang berbeda: <strong>permintaan inisialisasi</strong> untuk sesi pertama dan <strong>permintaan pengkodean</strong> untuk sesi berikutnya.</p>
<p>Secara teknis, kedua mode tersebut menggunakan agen, prompt sistem, alat, dan harness yang sama. Satu-satunya perbedaan adalah prompt pengguna awal. Tetapi karena keduanya memiliki peran yang berbeda, menganggapnya sebagai dua agen yang terpisah adalah model mental yang berguna. Kami menyebutnya sebagai arsitektur dua agen.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/two_agent_p3_f9dd23fed9.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Inisialisasi mengatur lingkungan untuk kemajuan bertahap.</strong> Inisialisasi menerima permintaan yang tidak jelas dan melakukan tiga hal:</p>
<ul>
<li><p><strong>Memecah proyek menjadi fitur-fitur yang spesifik dan dapat diverifikasi.</strong> Bukan persyaratan yang tidak jelas seperti "membuat antarmuka obrolan," tetapi langkah-langkah konkret yang dapat diuji: "pengguna mengklik tombol Obrolan Baru → percakapan baru muncul di bilah sisi → area obrolan menunjukkan status selamat datang." Contoh klon claude.ai milik Anthropic memiliki lebih dari 200 fitur seperti itu.</p></li>
<li><p><strong>Membuat file pelacakan kemajuan.</strong> File ini mencatat status penyelesaian setiap fitur, sehingga setiap sesi dapat melihat apa yang sudah selesai dan apa yang tersisa.</p></li>
<li><p><strong>Menulis skrip penyiapan dan melakukan komit git awal.</strong> Skrip seperti <code translate="no">init.sh</code> memungkinkan sesi berikutnya menjalankan lingkungan pengembangan dengan cepat. Komit git menetapkan garis dasar yang bersih.</p></li>
</ul>
<p>Inisialisasi tidak hanya merencanakan. Inisialisasi menciptakan infrastruktur yang memungkinkan sesi mendatang dapat segera bekerja.</p>
<p><strong>Agen pengkodean</strong> menangani setiap sesi berikutnya. Ia</p>
<ul>
<li><p>Membaca berkas kemajuan dan log git untuk memahami keadaan saat ini</p></li>
<li><p>Menjalankan pengujian dasar dari ujung ke ujung untuk mengonfirmasi bahwa aplikasi masih berfungsi</p></li>
<li><p>Memilih satu fitur untuk dikerjakan</p></li>
<li><p>Mengimplementasikan fitur tersebut, mengujinya secara menyeluruh, berkomitmen ke git dengan pesan deskriptif, dan memperbarui file kemajuan</p></li>
</ul>
<p>Saat sesi berakhir, basis kode berada dalam kondisi yang dapat digabungkan: tidak ada bug besar, kode yang teratur, dokumentasi yang jelas. Tidak ada pekerjaan yang setengah jadi dan tidak ada misteri tentang apa yang telah dilakukan. Sesi berikutnya akan melanjutkan apa yang telah dilakukan pada sesi ini.</p>
<h3 id="Use-JSON-for-Feature-Tracking-Not-Markdown" class="common-anchor-header">Gunakan JSON untuk Pelacakan Fitur, Bukan Penurunan Harga</h3><p><strong>Satu detail implementasi yang perlu diperhatikan: daftar fitur harus berupa JSON, bukan Markdown.</strong></p>
<p>Ketika mengedit JSON, model AI cenderung memodifikasi bidang tertentu. Ketika mengedit Markdown, mereka sering menulis ulang seluruh bagian. Dengan daftar 200+ fitur, pengeditan Markdown dapat merusak pelacakan kemajuan Anda secara tidak sengaja.</p>
<p>Entri JSON terlihat seperti ini:</p>
<pre><code translate="no">json
{
  <span class="hljs-string">&quot;category&quot;</span>: <span class="hljs-string">&quot;functional&quot;</span>,
  <span class="hljs-string">&quot;description&quot;</span>: <span class="hljs-string">&quot;New chat button creates a fresh conversation&quot;</span>,
  <span class="hljs-string">&quot;steps&quot;</span>: [
    <span class="hljs-string">&quot;Navigate to main interface&quot;</span>,
    <span class="hljs-string">&quot;Click the &#x27;New Chat&#x27; button&quot;</span>,
    <span class="hljs-string">&quot;Verify a new conversation is created&quot;</span>,
    <span class="hljs-string">&quot;Check that chat area shows welcome state&quot;</span>,
    <span class="hljs-string">&quot;Verify conversation appears in sidebar&quot;</span>
  ],
  <span class="hljs-string">&quot;passes&quot;</span>: <span class="hljs-literal">false</span>
}
<button class="copy-code-btn"></button></code></pre>
<p>Setiap fitur memiliki langkah-langkah verifikasi yang jelas. Bidang <code translate="no">passes</code> melacak penyelesaian. Instruksi dengan kata-kata yang tegas seperti "Tidak dapat diterima untuk menghapus atau mengedit tes karena hal ini dapat menyebabkan fungsionalitas yang hilang atau bermasalah" juga disarankan untuk mencegah agen mempermainkan sistem dengan menghapus fitur-fitur yang sulit.</p>
<h2 id="How-Milvus-Gives-Agents-Semantic-Memory-Across-Sessions" class="common-anchor-header">Bagaimana Milvus Memberikan Memori Semantik kepada Agen di Seluruh Sesi<button data-href="#How-Milvus-Gives-Agents-Semantic-Memory-Across-Sessions" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Arsitektur dua agen menyelesaikan kelelahan konteks, tetapi tidak menyelesaikan masalah lupa.</strong> Bahkan dengan handoff yang bersih di antara sesi, agen kehilangan jejak apa yang telah dipelajarinya. Agen tidak dapat mengingat bahwa "token penyegaran JWT" berhubungan dengan "autentikasi pengguna" kecuali kata-kata tersebut muncul di dalam berkas kemajuan. Seiring dengan pertumbuhan proyek, pencarian melalui ratusan komit git menjadi lambat. Pencocokan kata kunci melewatkan koneksi yang akan terlihat jelas oleh manusia.</p>
<p><strong>Di sinilah basis data vektor berperan.</strong> Alih-alih menyimpan teks dan mencari kata kunci, basis data vektor mengubah teks menjadi representasi numerik dari makna. Ketika Anda mencari "otentikasi pengguna", database ini akan menemukan entri tentang "token penyegaran JWT" dan "penanganan sesi login". Bukan karena kata-katanya cocok, tetapi karena konsepnya secara semantik dekat. Agen dapat bertanya "apakah saya pernah melihat hal seperti ini sebelumnya?" dan mendapatkan jawaban yang berguna.</p>
<p><strong>Dalam praktiknya, ini bekerja dengan menyematkan catatan kemajuan dan komit git ke dalam basis data sebagai vektor.</strong> Ketika sesi pengkodean dimulai, agen menanyakan basis data dengan tugas saat ini. Basis data mengembalikan riwayat yang relevan dalam hitungan milidetik: apa yang telah dicoba sebelumnya, apa yang berhasil, apa yang gagal. Agen tidak memulai dari awal. Ini dimulai dengan konteks.</p>
<p><a href="https://milvus.io/"><strong>Milvus</strong></a> <strong>sangat cocok untuk kasus penggunaan ini</strong>. Milvus bersifat open source dan dirancang untuk pencarian vektor skala produksi, menangani miliaran vektor tanpa harus berkeringat. Untuk proyek-proyek yang lebih kecil atau pengembangan lokal, <a href="https://milvus.io/docs/milvus_lite.md">Milvus Lite</a> dapat disematkan langsung ke dalam aplikasi seperti SQLite. Tidak perlu pengaturan cluster. Ketika proyek berkembang, Anda dapat bermigrasi ke Milvus terdistribusi tanpa mengubah kode Anda. Untuk menghasilkan penyematan, Anda dapat menggunakan model eksternal seperti <a href="https://www.sbert.net/">SentenceTransformer</a> untuk kontrol yang lebih halus, atau mereferensikan <a href="https://milvus.io/docs/embeddings.md">fungsi penyematan bawaan</a> untuk pengaturan yang lebih sederhana. Milvus juga mendukung <a href="https://milvus.io/docs/hybridsearch.md">pencarian hibrida</a>, menggabungkan kemiripan vektor dengan pemfilteran tradisional, sehingga Anda bisa melakukan kueri "temukan masalah autentikasi serupa dari minggu lalu" dalam satu panggilan.</p>
<p><strong>Hal ini juga memecahkan masalah transfer.</strong> Basis data vektor tetap ada di luar satu sesi, sehingga pengetahuan terakumulasi dari waktu ke waktu. Sesi 50 memiliki akses ke semua yang dipelajari di sesi 1 sampai 49. Proyek ini mengembangkan memori institusional.</p>
<h2 id="Verifying-Completion-with-Automated-Testing" class="common-anchor-header">Memverifikasi Penyelesaian dengan Pengujian Otomatis<button data-href="#Verifying-Completion-with-Automated-Testing" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Bahkan dengan arsitektur dua agen dan memori jangka panjang, agen masih dapat menyatakan kemenangan terlalu dini. Ini adalah masalah verifikasi.</strong></p>
<p>Berikut adalah mode kegagalan yang umum terjadi: Sesi pengkodean menyelesaikan sebuah fitur, menjalankan uji unit cepat, melihatnya lulus, dan membalik <code translate="no">&quot;passes&quot;: false</code> ke <code translate="no">&quot;passes&quot;: true</code>. Tetapi uji unit yang lulus tidak berarti fitur tersebut benar-benar berfungsi. API mungkin mengembalikan data yang benar sementara UI tidak menampilkan apa pun karena adanya bug CSS. File progres mengatakan "selesai" sementara pengguna tidak melihat apa-apa.</p>
<p><strong>Solusinya adalah membuat agen menguji seperti pengguna sebenarnya.</strong> Setiap fitur dalam daftar fitur memiliki langkah-langkah verifikasi yang konkret: "pengguna mengklik tombol Obrolan Baru → percakapan baru muncul di bilah sisi → area obrolan menunjukkan status selamat datang." Agen harus memverifikasi langkah-langkah ini secara harfiah. Alih-alih hanya menjalankan pengujian tingkat kode, agen menggunakan alat otomatisasi peramban seperti Puppeteer untuk mensimulasikan penggunaan yang sebenarnya. Alat ini membuka halaman, mengklik tombol, mengisi formulir, dan memeriksa apakah elemen yang tepat muncul di layar. Hanya ketika aliran penuh berlalu, agen menandai fitur tersebut selesai.</p>
<p><strong>Hal ini menangkap masalah yang terlewatkan oleh unit test</strong>. Sebuah fitur obrolan mungkin memiliki logika backend yang sempurna dan respons API yang benar. Tetapi jika frontend tidak merender balasan, pengguna tidak melihat apa-apa. Otomatisasi browser dapat mengambil screenshot dan memverifikasi bahwa apa yang muncul di layar sesuai dengan apa yang seharusnya muncul. Bidang <code translate="no">passes</code> hanya akan menjadi <code translate="no">true</code> ketika fitur tersebut benar-benar bekerja secara end-to-end.</p>
<p><strong>Akan tetapi, ada beberapa keterbatasan.</strong> Beberapa fitur bawaan peramban tidak bisa diotomatisasi oleh alat seperti Puppeteer. Pemilih file dan dialog konfirmasi sistem adalah contoh yang umum. <a href="https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents">Anthropic mencatat</a> bahwa fitur-fitur yang mengandalkan modal peringatan bawaan peramban cenderung bermasalah karena agen tidak dapat melihatnya melalui Puppeteer. Solusi praktisnya adalah mendesain di sekitar keterbatasan ini. Gunakan komponen UI khusus alih-alih dialog asli jika memungkinkan, sehingga agen dapat menguji setiap langkah verifikasi dalam daftar fitur.</p>
<h2 id="Putting-It-Together-LangGraph-for-Session-State-Milvus-for-Long-Term-Memory" class="common-anchor-header">Menyatukannya: LangGraph untuk Status Sesi, Milvus untuk Memori Jangka Panjang<button data-href="#Putting-It-Together-LangGraph-for-Session-State-Milvus-for-Long-Term-Memory" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Konsep-konsep di atas disatukan dalam sebuah sistem kerja dengan menggunakan dua alat: LangGraph untuk status sesi dan Milvus untuk memori jangka panjang.</strong> LangGraph mengelola apa yang terjadi dalam satu sesi: fitur mana yang sedang dikerjakan, apa yang sudah selesai, apa yang berikutnya. Milvus menyimpan riwayat yang dapat dicari di seluruh sesi: apa yang telah dilakukan sebelumnya, masalah apa yang dihadapi, dan solusi apa yang berhasil. Bersama-sama, keduanya memberikan memori jangka pendek dan jangka panjang kepada agen.</p>
<p><strong>Sebuah catatan tentang implementasi ini:</strong> Kode di bawah ini adalah demonstrasi yang disederhanakan. Kode ini menunjukkan pola inti dalam satu skrip, tetapi tidak sepenuhnya meniru pemisahan sesi yang dijelaskan sebelumnya. Dalam pengaturan produksi, setiap sesi pengkodean akan menjadi pemanggilan yang terpisah, mungkin pada mesin yang berbeda atau pada waktu yang berbeda. <code translate="no">MemorySaver</code> dan <code translate="no">thread_id</code> di LangGraph memungkinkan hal ini dengan mempertahankan state di antara pemanggilan. Untuk melihat perilaku resume dengan jelas, Anda menjalankan skrip sekali, hentikan, lalu jalankan lagi dengan <code translate="no">thread_id</code> yang sama. Proses kedua akan melanjutkan apa yang ditinggalkan oleh proses pertama.</p>
<p>Python</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> sentence_transformers <span class="hljs-keyword">import</span> SentenceTransformer
<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient
<span class="hljs-keyword">from</span> langgraph.checkpoint.memory <span class="hljs-keyword">import</span> MemorySaver
<span class="hljs-keyword">from</span> langgraph.graph <span class="hljs-keyword">import</span> StateGraph, START, END
<span class="hljs-keyword">from</span> typing <span class="hljs-keyword">import</span> TypedDict, Annotated
<span class="hljs-keyword">import</span> operator
<span class="hljs-keyword">import</span> subprocess
<span class="hljs-keyword">import</span> json

<span class="hljs-comment"># ==================== Initialization ====================</span>
embedding_model = SentenceTransformer(<span class="hljs-string">&#x27;all-MiniLM-L6-v2&#x27;</span>)
milvus_client = MilvusClient(<span class="hljs-string">&quot;./milvus_agent_memory.db&quot;</span>)

<span class="hljs-comment"># Create collection</span>
<span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> milvus_client.has_collection(<span class="hljs-string">&quot;agent_history&quot;</span>):
    milvus_client.create_collection(
        collection_name=<span class="hljs-string">&quot;agent_history&quot;</span>,
        dimension=<span class="hljs-number">384</span>,
        auto_id=<span class="hljs-literal">True</span>
    )

<span class="hljs-comment"># ==================== Milvus Operations ====================</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">retrieve_context</span>(<span class="hljs-params">query: <span class="hljs-built_in">str</span>, top_k: <span class="hljs-built_in">int</span> = <span class="hljs-number">3</span></span>):
    <span class="hljs-string">&quot;&quot;&quot;Retrieve relevant history from Milvus (core element: semantic retrieval)&quot;&quot;&quot;</span>
    query_vec = embedding_model.encode(query).tolist()
    results = milvus_client.search(
        collection_name=<span class="hljs-string">&quot;agent_history&quot;</span>,
        data=[query_vec],
        limit=top_k,
        output_fields=[<span class="hljs-string">&quot;content&quot;</span>]
    )
    <span class="hljs-keyword">if</span> results <span class="hljs-keyword">and</span> results[<span class="hljs-number">0</span>]:
        <span class="hljs-keyword">return</span> [hit[<span class="hljs-string">&quot;entity&quot;</span>][<span class="hljs-string">&quot;content&quot;</span>] <span class="hljs-keyword">for</span> hit <span class="hljs-keyword">in</span> results[<span class="hljs-number">0</span>]]
    <span class="hljs-keyword">return</span> []

<span class="hljs-keyword">def</span> <span class="hljs-title function_">save_progress</span>(<span class="hljs-params">content: <span class="hljs-built_in">str</span></span>):
    <span class="hljs-string">&quot;&quot;&quot;Save progress to Milvus (long-term memory)&quot;&quot;&quot;</span>
    embedding = embedding_model.encode(content).tolist()
    milvus_client.insert(
        collection_name=<span class="hljs-string">&quot;agent_history&quot;</span>,
        data=[{<span class="hljs-string">&quot;vector&quot;</span>: embedding, <span class="hljs-string">&quot;content&quot;</span>: content}]
    )

<span class="hljs-comment"># ==================== Core Element 1: Git Commit ====================</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">git_commit</span>(<span class="hljs-params">message: <span class="hljs-built_in">str</span></span>):
    <span class="hljs-string">&quot;&quot;&quot;Git commit (core element from the article)&quot;&quot;&quot;</span>
    <span class="hljs-keyword">try</span>:
        <span class="hljs-comment"># In a real project, actual Git commands would be executed</span>
        <span class="hljs-comment"># subprocess.run([&quot;git&quot;, &quot;add&quot;, &quot;.&quot;], check=True)</span>
        <span class="hljs-comment"># subprocess.run([&quot;git&quot;, &quot;commit&quot;, &quot;-m&quot;, message], check=True)</span>
        <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Git Commit] <span class="hljs-subst">{message}</span>&quot;</span>)
        <span class="hljs-keyword">return</span> <span class="hljs-literal">True</span>
    <span class="hljs-keyword">except</span> Exception <span class="hljs-keyword">as</span> e:
        <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Git Commit Failed] <span class="hljs-subst">{e}</span>&quot;</span>)
        <span class="hljs-keyword">return</span> <span class="hljs-literal">False</span>

<span class="hljs-comment"># ==================== Core Element 2: Test Verification ====================</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">run_tests</span>(<span class="hljs-params">feature: <span class="hljs-built_in">str</span></span>):
    <span class="hljs-string">&quot;&quot;&quot;Run tests (end-to-end testing emphasized in the article)&quot;&quot;&quot;</span>
    <span class="hljs-keyword">try</span>:
        <span class="hljs-comment"># In a real project, testing tools like Puppeteer would be called</span>
        <span class="hljs-comment"># Simplified to simulated testing here</span>
        <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Test Verification] Testing feature: <span class="hljs-subst">{feature}</span>&quot;</span>)
        <span class="hljs-comment"># Simulated test result</span>
        test_passed = <span class="hljs-literal">True</span>  <span class="hljs-comment"># In practice, this would return actual test results</span>
        <span class="hljs-keyword">if</span> test_passed:
            <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Test Passed] <span class="hljs-subst">{feature}</span>&quot;</span>)
        <span class="hljs-keyword">return</span> test_passed
    <span class="hljs-keyword">except</span> Exception <span class="hljs-keyword">as</span> e:
        <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Test Failed] <span class="hljs-subst">{e}</span>&quot;</span>)
        <span class="hljs-keyword">return</span> <span class="hljs-literal">False</span>

<span class="hljs-comment"># ==================== State Definition ====================</span>
<span class="hljs-keyword">class</span> <span class="hljs-title class_">AgentState</span>(<span class="hljs-title class_ inherited__">TypedDict</span>):
    messages: Annotated[<span class="hljs-built_in">list</span>, operator.add]
    features: <span class="hljs-built_in">list</span>  <span class="hljs-comment"># All features list</span>
    completed_features: <span class="hljs-built_in">list</span>  <span class="hljs-comment"># Completed features</span>
    current_feature: <span class="hljs-built_in">str</span>  <span class="hljs-comment"># Currently processing feature</span>
    session_count: <span class="hljs-built_in">int</span>  <span class="hljs-comment"># Session counter</span>

<span class="hljs-comment"># ==================== Two-Agent Nodes ====================</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">initialize_node</span>(<span class="hljs-params">state: AgentState</span>):
    <span class="hljs-string">&quot;&quot;&quot;Initializer Agent: Generate feature list and set up work environment&quot;&quot;&quot;</span>
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n========== Initializer Agent Started ==========&quot;</span>)
    
    <span class="hljs-comment"># Generate feature list (in practice, a detailed feature list would be generated based on requirements)</span>
    features = [
        <span class="hljs-string">&quot;Implement user registration&quot;</span>,
        <span class="hljs-string">&quot;Implement user login&quot;</span>,
        <span class="hljs-string">&quot;Implement password reset&quot;</span>,
        <span class="hljs-string">&quot;Implement user profile editing&quot;</span>,
        <span class="hljs-string">&quot;Implement session management&quot;</span>
    ]
    
    <span class="hljs-comment"># Save initialization info to Milvus</span>
    init_summary = <span class="hljs-string">f&quot;Project initialized with <span class="hljs-subst">{<span class="hljs-built_in">len</span>(features)}</span> features&quot;</span>
    save_progress(init_summary)
    
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Initialization Complete] Feature list: <span class="hljs-subst">{features}</span>&quot;</span>)
    
    <span class="hljs-keyword">return</span> {
        **state,
        <span class="hljs-string">&quot;features&quot;</span>: features,
        <span class="hljs-string">&quot;completed_features&quot;</span>: [],
        <span class="hljs-string">&quot;current_feature&quot;</span>: features[<span class="hljs-number">0</span>] <span class="hljs-keyword">if</span> features <span class="hljs-keyword">else</span> <span class="hljs-string">&quot;&quot;</span>,
        <span class="hljs-string">&quot;session_count&quot;</span>: <span class="hljs-number">0</span>,
        <span class="hljs-string">&quot;messages&quot;</span>: [init_summary]
    }

<span class="hljs-keyword">def</span> <span class="hljs-title function_">code_node</span>(<span class="hljs-params">state: AgentState</span>):
    <span class="hljs-string">&quot;&quot;&quot;Coding Agent: Implement, test, commit (core loop node)&quot;&quot;&quot;</span>
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;\n========== Coding Agent Session #<span class="hljs-subst">{state[<span class="hljs-string">&#x27;session_count&#x27;</span>] + <span class="hljs-number">1</span>}</span> ==========&quot;</span>)
    
    current_feature = state[<span class="hljs-string">&quot;current_feature&quot;</span>]
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Current Task] <span class="hljs-subst">{current_feature}</span>&quot;</span>)
    
    <span class="hljs-comment"># ===== Core Element 3: Retrieve history from Milvus (cross-session memory) =====</span>
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Retrieving History] Querying experiences related to &#x27;<span class="hljs-subst">{current_feature}</span>&#x27;...&quot;</span>)
    context = retrieve_context(current_feature)
    <span class="hljs-keyword">if</span> context:
        <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Retrieval Results] Found <span class="hljs-subst">{<span class="hljs-built_in">len</span>(context)}</span> relevant records:&quot;</span>)
        <span class="hljs-keyword">for</span> i, ctx <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(context, <span class="hljs-number">1</span>):
            <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;  <span class="hljs-subst">{i}</span>. <span class="hljs-subst">{ctx[:<span class="hljs-number">60</span>]}</span>...&quot;</span>)
    <span class="hljs-keyword">else</span>:
        <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;[Retrieval Results] No relevant history (first time implementing this type of feature)&quot;</span>)
    
    <span class="hljs-comment"># ===== Step 1: Implement feature =====</span>
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Starting Implementation] <span class="hljs-subst">{current_feature}</span>&quot;</span>)
    <span class="hljs-comment"># In practice, an LLM would be called to generate code</span>
    implementation_result = <span class="hljs-string">f&quot;Implemented feature: <span class="hljs-subst">{current_feature}</span>&quot;</span>
    
    <span class="hljs-comment"># ===== Step 2: Test verification (core element) =====</span>
    test_passed = run_tests(current_feature)
    <span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> test_passed:
        <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Session End] Tests did not pass, fixes needed&quot;</span>)
        <span class="hljs-keyword">return</span> state  <span class="hljs-comment"># Don&#x27;t proceed if tests fail</span>
    
    <span class="hljs-comment"># ===== Step 3: Git commit (core element) =====</span>
    commit_message = <span class="hljs-string">f&quot;feat: <span class="hljs-subst">{current_feature}</span>&quot;</span>
    git_commit(commit_message)
    
    <span class="hljs-comment"># ===== Step 4: Update progress file =====</span>
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Updating Progress] Marking feature as complete&quot;</span>)
    
    <span class="hljs-comment"># ===== Step 5: Save to Milvus long-term memory =====</span>
    progress_record = <span class="hljs-string">f&quot;Completed feature: <span class="hljs-subst">{current_feature}</span> | Commit message: <span class="hljs-subst">{commit_message}</span> | Test status: passed&quot;</span>
    save_progress(progress_record)
    
    <span class="hljs-comment"># ===== Step 6: Update state and prepare for next feature =====</span>
    new_completed = state[<span class="hljs-string">&quot;completed_features&quot;</span>] + [current_feature]
    remaining_features = [f <span class="hljs-keyword">for</span> f <span class="hljs-keyword">in</span> state[<span class="hljs-string">&quot;features&quot;</span>] <span class="hljs-keyword">if</span> f <span class="hljs-keyword">not</span> <span class="hljs-keyword">in</span> new_completed]
    
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Progress] Completed: <span class="hljs-subst">{<span class="hljs-built_in">len</span>(new_completed)}</span>/<span class="hljs-subst">{<span class="hljs-built_in">len</span>(state[<span class="hljs-string">&#x27;features&#x27;</span>])}</span>&quot;</span>)
    <span class="hljs-comment"># ===== Core Element 4: Session end (clear session boundary) =====</span>
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Session End] Codebase is in clean state, safe to interrupt\n&quot;</span>)
    
    <span class="hljs-keyword">return</span> {
        **state,
        <span class="hljs-string">&quot;completed_features&quot;</span>: new_completed,
        <span class="hljs-string">&quot;current_feature&quot;</span>: remaining_features[<span class="hljs-number">0</span>] <span class="hljs-keyword">if</span> remaining_features <span class="hljs-keyword">else</span> <span class="hljs-string">&quot;&quot;</span>,
        <span class="hljs-string">&quot;session_count&quot;</span>: state[<span class="hljs-string">&quot;session_count&quot;</span>] + <span class="hljs-number">1</span>,
        <span class="hljs-string">&quot;messages&quot;</span>: [implementation_result]
    }

<span class="hljs-comment"># ==================== Core Element 3: Loop Control ====================</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">should_continue</span>(<span class="hljs-params">state: AgentState</span>):
    <span class="hljs-string">&quot;&quot;&quot;Determine whether to continue to next feature (incremental loop development)&quot;&quot;&quot;</span>
    <span class="hljs-keyword">if</span> state[<span class="hljs-string">&quot;current_feature&quot;</span>] <span class="hljs-keyword">and</span> state[<span class="hljs-string">&quot;current_feature&quot;</span>] != <span class="hljs-string">&quot;&quot;</span>:
        <span class="hljs-keyword">return</span> <span class="hljs-string">&quot;code&quot;</span>  <span class="hljs-comment"># Continue to next feature</span>
    <span class="hljs-keyword">else</span>:
        <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n========== All Features Complete ==========&quot;</span>)
        <span class="hljs-keyword">return</span> END

<span class="hljs-comment"># ==================== Build Workflow ====================</span>
workflow = StateGraph(AgentState)

<span class="hljs-comment"># Add nodes</span>
workflow.add_node(<span class="hljs-string">&quot;initialize&quot;</span>, initialize_node)
workflow.add_node(<span class="hljs-string">&quot;code&quot;</span>, code_node)

<span class="hljs-comment"># Add edges</span>
workflow.add_edge(START, <span class="hljs-string">&quot;initialize&quot;</span>)
workflow.add_edge(<span class="hljs-string">&quot;initialize&quot;</span>, <span class="hljs-string">&quot;code&quot;</span>)

<span class="hljs-comment"># Add conditional edges (implement loop)</span>
workflow.add_conditional_edges(
    <span class="hljs-string">&quot;code&quot;</span>,
    should_continue,
    {
        <span class="hljs-string">&quot;code&quot;</span>: <span class="hljs-string">&quot;code&quot;</span>,  <span class="hljs-comment"># Continue loop</span>
        END: END  <span class="hljs-comment"># End</span>
    }
)

<span class="hljs-comment"># Compile workflow (using MemorySaver as checkpointer)</span>
app = workflow.<span class="hljs-built_in">compile</span>(checkpointer=MemorySaver())

<span class="hljs-comment"># ==================== Usage Example: Demonstrating Cross-Session Recovery ====================</span>
<span class="hljs-keyword">if</span> __name__ == <span class="hljs-string">&quot;__main__&quot;</span>:
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;=&quot;</span> * <span class="hljs-number">60</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Demo Scenario: Multi-Session Development for Long-Running Agents&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;=&quot;</span> * <span class="hljs-number">60</span>)
    
    <span class="hljs-comment"># ===== Session 1: Initialize + complete first 2 features =====</span>
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n[Scenario 1] First launch: Complete first 2 features&quot;</span>)
    config = {<span class="hljs-string">&quot;configurable&quot;</span>: {<span class="hljs-string">&quot;thread_id&quot;</span>: <span class="hljs-string">&quot;project_001&quot;</span>}}
    
    result = app.invoke({
        <span class="hljs-string">&quot;messages&quot;</span>: [],
        <span class="hljs-string">&quot;features&quot;</span>: [],
        <span class="hljs-string">&quot;completed_features&quot;</span>: [],
        <span class="hljs-string">&quot;current_feature&quot;</span>: <span class="hljs-string">&quot;&quot;</span>,
        <span class="hljs-string">&quot;session_count&quot;</span>: <span class="hljs-number">0</span>
    }, config)
    
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n&quot;</span> + <span class="hljs-string">&quot;=&quot;</span> * <span class="hljs-number">60</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;[Simulated Scenario] Developer manually interrupts (Ctrl+C) or context window exhausted&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;=&quot;</span> * <span class="hljs-number">60</span>)
    
    <span class="hljs-comment"># ===== Session 2: Restore state from checkpoint =====</span>
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n[Scenario 2] New session starts: Continue from last interruption&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Using the same thread_id, LangGraph automatically restores from checkpoint...&quot;</span>)
    
    <span class="hljs-comment"># Using the same thread_id, LangGraph will automatically restore state from checkpoint</span>
    result = app.invoke({
        <span class="hljs-string">&quot;messages&quot;</span>: [],
        <span class="hljs-string">&quot;features&quot;</span>: [],
        <span class="hljs-string">&quot;completed_features&quot;</span>: [],
        <span class="hljs-string">&quot;current_feature&quot;</span>: <span class="hljs-string">&quot;&quot;</span>,
        <span class="hljs-string">&quot;session_count&quot;</span>: <span class="hljs-number">0</span>
    }, config)
    
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n&quot;</span> + <span class="hljs-string">&quot;=&quot;</span> * <span class="hljs-number">60</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Demo Complete!&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;=&quot;</span> * <span class="hljs-number">60</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\nKey Takeaways:&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;1. ✅ Two-Agent Architecture (initialize + code)&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;2. ✅ Incremental Loop Development (conditional edges control loop)&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;3. ✅ Git Commits (commit after each feature)&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;4. ✅ Test Verification (end-to-end testing)&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;5. ✅ Session Management (clear session boundaries)&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;6. ✅ Cross-Session Recovery (thread_id + checkpoint)&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;7. ✅ Semantic Retrieval (Milvus long-term memory)&quot;</span>)
  

**The key insight <span class="hljs-keyword">is</span> <span class="hljs-keyword">in</span> the last part.** By using the same `thread_id`, LangGraph automatically restores the checkpoint <span class="hljs-keyword">from</span> the previous session. Session <span class="hljs-number">2</span> picks up exactly where session <span class="hljs-number">1</span> stopped — no manual state transfer, no lost progress.

<button class="copy-code-btn"></button></code></pre>
<h3 id="Conclusion" class="common-anchor-header">Kesimpulan</h3><p>Agen AI gagal dalam tugas-tugas jangka panjang karena mereka tidak memiliki memori yang tahan lama dan verifikasi yang tepat. Clawdbot menjadi viral dengan memecahkan masalah ini, tetapi pendekatannya belum siap untuk produksi.</p>
<p>Artikel ini membahas tiga solusi yaitu:</p>
<ul>
<li><p><strong>Arsitektur dua agen:</strong> Inisialisasi memecah proyek menjadi fitur-fitur yang dapat diverifikasi; agen pengkodean mengerjakannya satu per satu dengan handoff yang bersih. Hal ini mencegah kelelahan konteks dan membuat kemajuan dapat dilacak.</p></li>
<li><p><strong>Basis data vektor untuk memori semantik:</strong> <a href="https://milvus.io/">Milvus</a> menyimpan catatan kemajuan dan komit git sebagai embeddings, sehingga agen dapat mencari berdasarkan makna, bukan kata kunci. Sesi 50 mengingat apa yang dipelajari di sesi 1.</p></li>
<li><p><strong>Otomatisasi peramban untuk verifikasi nyata:</strong> Tes unit memverifikasi bahwa kode berjalan. Dalang memeriksa apakah fitur benar-benar berfungsi dengan menguji apa yang dilihat pengguna di layar.</p></li>
</ul>
<p>Pola-pola ini tidak terbatas pada pengembangan perangkat lunak. Penelitian ilmiah, pemodelan keuangan, tinjauan dokumen hukum-tugas apa pun yang mencakup beberapa sesi dan membutuhkan handoff yang andal dapat memperoleh manfaat.</p>
<p>Prinsip-prinsip inti:</p>
<ul>
<li><p>Gunakan inisialisasi untuk memecah pekerjaan menjadi bagian-bagian yang dapat diverifikasi</p></li>
<li><p>Melacak kemajuan dalam format yang terstruktur dan dapat dibaca oleh mesin</p></li>
<li><p>Menyimpan pengalaman dalam basis data vektor untuk pengambilan semantik</p></li>
<li><p>Verifikasi penyelesaian dengan pengujian dunia nyata, bukan hanya pengujian unit</p></li>
<li><p>Desain untuk batas sesi yang bersih sehingga pekerjaan dapat dijeda dan dilanjutkan dengan aman</p></li>
</ul>
<p>Alat-alatnya ada. Pola-polanya sudah terbukti. Yang tersisa adalah menerapkannya.</p>
<p><strong>Siap untuk memulai?</strong></p>
<ul>
<li><p>Jelajahi <a href="https://milvus.io/">Milvus</a> dan <a href="https://milvus.io/docs/milvus_lite.md">Milvus Lite</a> untuk menambahkan memori semantik ke agen Anda</p></li>
<li><p>Lihat LangGraph untuk mengelola status sesi</p></li>
<li><p>Baca <a href="https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents">penelitian lengkap Anthropic</a> tentang pemanfaatan agen yang sudah berjalan lama</p></li>
</ul>
<p><strong>Ada pertanyaan atau ingin berbagi tentang apa yang sedang Anda bangun?</strong></p>
<ul>
<li><p>Bergabunglah dengan <a href="https://milvus.io/slack">komunitas Milvus Slack</a> untuk terhubung dengan pengembang lain</p></li>
<li><p>Hadiri <a href="https://milvus.io/office-hours">Jam Kantor Milvus</a> untuk tanya jawab langsung dengan tim</p></li>
</ul>
