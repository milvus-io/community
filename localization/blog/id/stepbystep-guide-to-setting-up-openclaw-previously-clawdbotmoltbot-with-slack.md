---
id: >-
  stepbystep-guide-to-setting-up-openclaw-previously-clawdbotmoltbot-with-slack.md
title: >-
  Panduan Langkah-demi-Langkah untuk Menyiapkan OpenClaw (Sebelumnya
  Clawdbot/Moltbot) dengan Slack
author: 'Min Yin, Lumina Wang'
date: 2026-02-04T00:00:00.000Z
cover: assets.zilliz.com/Open_Claw_Slack_Setup_Guide_Cover_1_11zon_3a995858a8.png
tag: Tutorial
recommend: true
publishToMedium: true
tags: 'OpenClaw, Clawdbot, Moltbot, Slack, Tutorial'
meta_keywords: 'OpenClaw, Clawdbot, Moltbot, Milvus, AI Agent'
meta_title: |
  OpenClaw Tutorial: Connect to Slack for Local AI Assistant
desc: >-
  Panduan langkah demi langkah untuk menyiapkan OpenClaw dengan Slack. Jalankan
  asisten AI yang dihosting sendiri di mesin Mac atau Linux Anda-tidak perlu
  cloud.
origin: 'https://milvus.io/blog/openclaw-slack-setup-guide.md'
---
<p>Jika Anda sudah membuka Twitter teknologi, Hacker News, atau Discord minggu ini, Anda pasti sudah melihatnya. Emoji lobster 🦞, tangkapan layar tugas yang sedang diselesaikan, dan satu klaim yang berani: AI yang tidak hanya bisa <em>bicara, tetapi</em>juga <em>bisa melakukan sesuatu.</em></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_1_567975a33f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Hal ini menjadi semakin aneh selama akhir pekan. Pengusaha Matt Schlicht meluncurkan <a href="https://moltbook.com">Moltbook-sebuah</a>jejaring sosial bergaya Reddit di mana hanya agen AI yang bisa memposting, dan manusia hanya bisa menonton. Dalam beberapa hari, lebih dari 1,5 juta agen mendaftar. Mereka membentuk komunitas, berdebat tentang filosofi, mengeluh tentang operator manusia, dan bahkan mendirikan agama mereka sendiri yang disebut "Crustafarianisme." Ya, benar.  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_2_b570b3e59b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Selamat datang di kegilaan OpenClaw.</p>
<p>Hype ini begitu nyata sehingga saham Cloudflare melonjak 14% hanya karena para pengembang menggunakan infrastrukturnya untuk menjalankan aplikasi. Penjualan Mac Mini dilaporkan melonjak karena orang-orang membeli perangkat keras khusus untuk karyawan AI mereka yang baru. Dan repo GitHub? Lebih dari <a href="https://github.com/openclaw/openclaw">150.000 bintang</a> hanya dalam beberapa minggu.</p>
<p>Jadi tentu saja, kami harus menunjukkan kepada Anda cara menyiapkan instance OpenClaw Anda sendiri-dan menghubungkannya ke Slack sehingga Anda bisa memerintah asisten AI Anda dari aplikasi perpesanan favorit Anda.</p>
<h2 id="What-Is-OpenClaw" class="common-anchor-header">Apa itu OpenClaw?<button data-href="#What-Is-OpenClaw" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://openclaw.ai/">OpenClaw</a> (sebelumnya dikenal sebagai Clawdbot/Moltbot) adalah agen AI otonom bersumber terbuka yang berjalan secara lokal di mesin pengguna dan menjalankan tugas-tugas dunia nyata melalui aplikasi perpesanan seperti WhatsApp, Telegram, dan Discord. Ini mengotomatiskan alur kerja digital-seperti mengelola email, menjelajahi web, atau menjadwalkan rapat-dengan menghubungkan ke LLM seperti Claude atau ChatGPT.</p>
<p>Singkatnya, ini seperti memiliki asisten digital 24/7 yang bisa berpikir, merespons, dan benar-benar menyelesaikan pekerjaan.</p>
<h2 id="Setting-Up-OpenClaw-as-a-Slack-Based-AI-Assistant" class="common-anchor-header">Menyiapkan OpenClaw sebagai Asisten AI Berbasis Slack<button data-href="#Setting-Up-OpenClaw-as-a-Slack-Based-AI-Assistant" class="anchor-icon" translate="no">
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
    </button></h2><p>Bayangkan memiliki bot di ruang kerja Slack Anda yang bisa langsung menjawab pertanyaan tentang produk Anda, membantu men-debug masalah pengguna, atau mengarahkan rekan tim ke dokumentasi yang tepat-tanpa ada yang harus menghentikan pekerjaan mereka. Bagi kami, ini berarti dukungan yang lebih cepat untuk komunitas Milvus: bot yang menjawab pertanyaan umum ("Bagaimana cara membuat koleksi?"), membantu mengatasi kesalahan, atau meringkas catatan rilis sesuai permintaan. Untuk tim Anda, ini mungkin untuk membantu teknisi baru, menangani FAQ internal, atau mengotomatiskan tugas-tugas DevOps yang berulang. Kasus penggunaannya terbuka lebar.</p>
<p>Dalam tutorial ini, kita akan membahas dasar-dasarnya: menginstal OpenClaw di komputer Anda dan menghubungkannya ke Slack. Setelah selesai, Anda akan memiliki asisten AI yang siap bekerja dan siap untuk disesuaikan dengan apa pun yang Anda butuhkan.</p>
<h3 id="Prerequisites" class="common-anchor-header">Prasyarat</h3><ul>
<li><p>Sebuah mesin Mac atau Linux</p></li>
<li><p><a href="https://console.anthropic.com/">Kunci API Anthropic</a> (atau akses CLI Claude Code)</p></li>
<li><p>Ruang kerja Slack tempat Anda bisa menginstal aplikasi</p></li>
</ul>
<p>Itu saja. Mari kita mulai.</p>
<h3 id="Step-1-Install-OpenClaw" class="common-anchor-header">Langkah 1: Instal OpenClaw</h3><p>Jalankan penginstal:</p>
<p>curl -fsSL https://molt.bot/install.sh | bash  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_3_fc80684811.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Saat diminta, pilih <strong>Ya</strong> untuk melanjutkan.  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_4_8004e87516.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Kemudian, pilih mode <strong>Mulai Cepat</strong>.  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_5_b5803c1d89.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-2-Choose-Your-LLM" class="common-anchor-header">Langkah 2: Pilih LLM Anda</h3><p>Penginstal akan meminta Anda memilih penyedia model. Kami menggunakan Anthropic dengan Claude Code CLI untuk autentikasi.</p>
<ol>
<li>Pilih <strong>Anthropic</strong> sebagai penyedia  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_6_a593124f6c.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</li>
</ol>
<ol start="2">
<li>Selesaikan verifikasi di peramban Anda saat diminta.  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_7_410c1a39d3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</li>
</ol>
<ol start="3">
<li>Pilih <strong>anthropic/claude-opus-4-5-20251101</strong> sebagai model default Anda  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_8_0c22bf5a16.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</li>
</ol>
<h3 id="Step-3-Set-Up-Slack" class="common-anchor-header">Langkah 3: Siapkan Slack</h3><p>Ketika diminta untuk memilih saluran, pilih <strong>Slack.</strong><span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_9_cd4dfa5053.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Lanjutkan dengan memberi nama bot Anda. Kami menamai bot kami "Clawdbot_Milvus."  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_10_89c79ccd0d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Sekarang Anda harus membuat aplikasi Slack dan mengambil dua token. Begini caranya:  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_11_50df3aec5d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>3.1 Membuat Aplikasi Slack</strong></p>
<p>Buka <a href="https://api.slack.com/apps?new_app=1">situs web API Slack</a> dan buat aplikasi baru dari awal.  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_12_21987505d5.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Beri nama dan pilih ruang kerja yang ingin Anda gunakan.  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_13_7fce24b5c7.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>3.2 Mengatur Izin Bot</strong></p>
<p>Di bilah sisi, klik <strong>OAuth &amp; Izin</strong>. Gulir ke bawah ke <strong>Cakupan Token Bot</strong> dan tambahkan izin yang dibutuhkan bot Anda.  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_14_b08d66b55a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>3.3 Aktifkan Mode Soket</strong></p>
<p>Klik <strong>Mode Soket</strong> di bilah sisi dan aktifkan.  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_15_11545f95f8.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Ini akan menghasilkan <strong>Token Tingkat Aplikasi</strong> (dimulai dengan <code translate="no">xapp-</code>). Salin di tempat yang aman.  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_16_c446eefd7d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>3.4 Mengaktifkan Langganan Acara</strong></p>
<p>Buka <strong>Langganan Acara</strong> dan aktifkan.  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_17_98387d6226.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Kemudian pilih acara mana yang harus dilanggan oleh bot Anda.  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_18_b2a16d7786.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>3.5 Menginstal Aplikasi</strong></p>
<p>Klik <strong>Instal Aplikasi</strong> di bilah sisi, lalu <strong>Minta untuk Menginstal</strong> (atau instal secara langsung jika Anda adalah admin ruang kerja).  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_19_a5e76d0d33.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Setelah disetujui, Anda akan melihat <strong>Token OAuth Pengguna Bot</strong> Anda (dimulai dengan <code translate="no">xoxb-</code>). Salin ini juga.  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/oauth_tokens_2e75e66f89.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-4-Configure-OpenClaw" class="common-anchor-header">Langkah 4: Konfigurasi OpenClaw</h3><p>Kembali ke CLI OpenClaw:</p>
<ol>
<li><p>Masukkan <strong>Token OAuth Pengguna Bot</strong> Anda (<code translate="no">xoxb-...</code>)</p></li>
<li><p>Masukkan <strong>Token Tingkat Aplikasi</strong> Anda (<code translate="no">xapp-...</code>) <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_21_bd1629fb6a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p></li>
</ol>
<ol start="3">
<li>Pilih saluran Slack mana yang dapat diakses oleh bot  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_22_a1b682fa84.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</li>
</ol>
<ol start="4">
<li>Lewati konfigurasi keterampilan untuk saat ini-Anda selalu dapat menambahkannya nanti  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_23_cc4855ecfd.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</li>
</ol>
<ol start="5">
<li>Pilih <strong>Mulai Ulang</strong> untuk menerapkan perubahan Anda</li>
</ol>
<h3 id="Step-5-Try-It-Out" class="common-anchor-header">Langkah 5: Cobalah</h3><p>Buka Slack dan kirimkan pesan ke bot Anda. Jika semuanya sudah diatur dengan benar, OpenClaw akan merespons dan siap menjalankan tugas di mesin Anda.  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_24_2864a88ce9.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Tips" class="common-anchor-header">Tips</h3><ol>
<li>Jalankan <code translate="no">clawdbot dashboard</code> untuk mengelola pengaturan melalui antarmuka web  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_25_67b337b1d9.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</li>
</ol>
<ol start="2">
<li>Jika terjadi kesalahan, periksa log untuk mengetahui detail kesalahan  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_26_a62b5669ee.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</li>
</ol>
<h2 id="A-Word-of-Caution" class="common-anchor-header">Sebuah Kata Peringatan<button data-href="#A-Word-of-Caution" class="anchor-icon" translate="no">
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
    </button></h2><p>OpenClaw sangat kuat - dan itulah mengapa Anda harus berhati-hati. "Benar-benar melakukan sesuatu" berarti ia dapat menjalankan perintah nyata pada mesin Anda. Itulah intinya, tetapi ada risikonya.</p>
<p><strong>Kabar baiknya:</strong></p>
<ul>
<li><p>Ini adalah sumber terbuka, jadi kodenya dapat diaudit</p></li>
<li><p>Berjalan secara lokal, jadi data Anda tidak berada di server orang lain</p></li>
<li><p>Anda mengontrol izin apa yang dimilikinya</p></li>
</ul>
<p><strong>Berita yang tidak terlalu bagus:</strong></p>
<ul>
<li><p>Injeksi yang cepat adalah risiko yang nyata-pesan berbahaya berpotensi mengelabui bot untuk menjalankan perintah yang tidak diinginkan</p></li>
<li><p>Para penipu telah membuat repositori dan token OpenClaw palsu, jadi berhati-hatilah dengan apa yang Anda unduh</p></li>
</ul>
<p><strong>Saran kami:</strong></p>
<ul>
<li><p>Jangan jalankan ini di mesin utama Anda. Gunakan VM, laptop cadangan, atau server khusus.</p></li>
<li><p>Jangan memberikan izin lebih dari yang Anda butuhkan.</p></li>
<li><p>Jangan gunakan ini dalam produksi. Ini masih baru. Perlakukan ini seperti eksperimen.</p></li>
<li><p>Tetaplah berpegang pada sumber-sumber resmi: <a href="https://x.com/openclaw">@openclaw</a> di X dan <a href="https://github.com/openclaw">OpenClaw</a>.</p></li>
</ul>
<p>Setelah Anda memberikan LLM kemampuan untuk menjalankan perintah, tidak ada yang namanya 100% aman. Itu bukan masalah OpenClaw-itu adalah sifat alami dari AI agen. Jadilah cerdas tentang hal itu.</p>
<h2 id="Whats-Next" class="common-anchor-header">Apa Selanjutnya?<button data-href="#Whats-Next" class="anchor-icon" translate="no">
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
    </button></h2><p>Selamat! Anda sekarang memiliki asisten AI lokal yang berjalan di infrastruktur Anda sendiri, yang dapat diakses melalui Slack. Data Anda tetap menjadi milik Anda, dan Anda memiliki asisten yang siap mengotomatiskan hal-hal yang berulang.</p>
<p>Dari sini, Anda bisa:</p>
<ul>
<li><p>Menginstal lebih banyak <a href="https://docs.molt.bot/skills">Keterampilan</a> untuk memperluas apa yang bisa dilakukan OpenClaw</p></li>
<li><p>Mengatur tugas terjadwal sehingga bekerja secara proaktif</p></li>
<li><p>Menghubungkan platform perpesanan lain seperti Telegram atau Discord</p></li>
<li><p>Menjelajahi ekosistem <a href="https://milvus.io/">Milvus</a> untuk kemampuan pencarian AI</p></li>
</ul>
<p><strong>Ada pertanyaan atau ingin berbagi tentang apa yang sedang Anda buat?</strong></p>
<ul>
<li><p>Bergabunglah dengan <a href="https://milvus.io/slack">komunitas Milvus Slack</a> untuk terhubung dengan pengembang lain</p></li>
<li><p>Pesan <a href="https://milvus.io/office-hours">Jam Kantor Milvus</a> kami untuk tanya jawab langsung dengan tim</p></li>
</ul>
<p>Selamat meretas! 🦞</p>
