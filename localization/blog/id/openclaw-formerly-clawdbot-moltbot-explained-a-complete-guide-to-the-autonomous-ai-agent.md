---
id: >-
  openclaw-formerly-clawdbot-moltbot-explained-a-complete-guide-to-the-autonomous-ai-agent.md
title: >-
  Penjelasan OpenClaw (Sebelumnya Clawdbot &amp; Moltbot): Panduan Lengkap untuk
  Agen AI Otonom
author: 'Julie Xia, Fendy Feng'
date: 2026-02-10T00:00:00.000Z
cover: assets.zilliz.com/Open_Claw_Autonomous_Agent_Cover_11zon_1_8124f1b98b.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'OpenClaw, Clawdbot, Moltbot, Moltbook, Tutorial'
meta_keywords: 'OpenClaw, Clawdbot, Moltbot, AI agent, autonomous AI agent'
meta_title: |
  What Is OpenClaw? Complete Guide to the Open-Source AI Agent
desc: >-
  Panduan lengkap untuk OpenClaw (Clawdbot/Moltbot) - cara kerjanya, panduan
  penyiapan, kasus penggunaan, Moltbook, dan peringatan keamanan.
origin: 'https://milvus.io/blog/openclaw-clawdbot-ai-agent-explained.md'
---
<p><a href="https://openclaw.ai/">OpenClaw</a> (sebelumnya dikenal sebagai Moltbot dan Clawdbot) adalah agen AI sumber terbuka yang berjalan di mesin Anda, terhubung melalui aplikasi perpesanan yang sudah Anda gunakan (WhatsApp, Telegram, Slack, Signal, dan lainnya), dan mengambil tindakan atas nama Anda - perintah shell, otomatisasi peramban, email, kalender, dan operasi file. Penjadwal detak jantung membangunkannya pada interval yang dapat dikonfigurasi sehingga dapat berjalan tanpa diminta. OpenClaw mendapatkan lebih dari <a href="https://github.com/openclaw/openclaw">100.000</a> bintang GitHub dalam waktu kurang dari seminggu setelah peluncurannya pada akhir Januari 2026, menjadikannya salah satu repositori sumber terbuka dengan pertumbuhan tercepat dalam sejarah GitHub.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/OC_1_e9bc8881bc.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Apa yang membuat OpenClaw berbeda adalah kombinasinya: Berlisensi MIT, sumber terbuka, mengutamakan lokal (memori dan data disimpan sebagai berkas Markdown di disk Anda), dan dapat dikembangkan oleh komunitas melalui format keterampilan portabel. Ini juga merupakan tempat terjadinya beberapa eksperimen yang lebih menarik dalam AI agenik - seorang agen pengembang menegosiasikan harga $4.200 untuk pembelian mobil melalui email ketika dia tidur; yang lain mengajukan bantahan hukum atas penolakan asuransi tanpa diminta; dan pengguna lain membangun <a href="https://moltbook.com/">Moltbook</a>, sebuah jejaring sosial di mana lebih dari satu juta agen AI berinteraksi secara otonom sementara manusia menonton.</p>
<p>Panduan ini menguraikan semua yang perlu Anda ketahui: apa itu OpenClaw, bagaimana cara kerjanya, apa yang bisa dilakukannya dalam kehidupan nyata, bagaimana hubungannya dengan Moltbook, dan risiko keamanan yang terkait dengannya.</p>
<h2 id="What-is-OpenClaw" class="common-anchor-header">Apa itu OpenClaw?<button data-href="#What-is-OpenClaw" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://openclawd.ai/">OpenClaw</a> (sebelumnya bernama Clawdbot dan Moltbot) adalah asisten AI otonom dan bersumber terbuka yang berjalan di komputer Anda dan tinggal di aplikasi obrolan Anda. Anda berbicara dengannya melalui WhatsApp, Telegram, <a href="https://milvus.io/blog/stepbystep-guide-to-setting-up-openclaw-previously-clawdbotmoltbot-with-slack.md">Slack</a>, Discord, iMessage, atau Signal-apa pun yang sudah Anda gunakan-dan ia akan berbicara kembali. Tetapi tidak seperti ChatGPT atau antarmuka web Claude, OpenClaw tidak hanya menjawab pertanyaan. Ia bisa menjalankan perintah shell, mengendalikan peramban, membaca dan menulis berkas, mengelola kalender, dan mengirim email, semuanya dipicu oleh pesan teks.</p>
<p>Aplikasi ini dibuat untuk para pengembang dan pengguna yang menginginkan asisten AI pribadi yang dapat mereka kirimkan pesan dari mana saja - tanpa mengorbankan kontrol atas data mereka atau bergantung pada layanan yang di-host.</p>
<h3 id="Key-Capabilities-of-OpenClaw" class="common-anchor-header">Kemampuan Utama OpenClaw</h3><ul>
<li><p><strong>Gerbang multi-saluran</strong> - WhatsApp, Telegram, Discord, dan iMessage dengan satu proses gerbang. Tambahkan Mattermost dan lebih banyak lagi dengan paket ekstensi.</p></li>
<li><p>Perutean<strong>multi-agen</strong> - sesi terisolasi per agen, ruang kerja, atau pengirim.</p></li>
<li><p><strong>Dukungan media</strong> - mengirim dan menerima gambar, audio, dan dokumen.</p></li>
<li><p><strong>UI Kontrol Web</strong> - dasbor peramban untuk obrolan, konfigurasi, sesi, dan node.</p></li>
<li><p><strong>Node seluler</strong> - memasangkan node iOS dan Android dengan dukungan Canvas.</p></li>
</ul>
<h3 id="What-Makes-OpenClaw-Different" class="common-anchor-header">Apa yang Membuat OpenClaw Berbeda?</h3><p><strong>OpenClaw dihosting sendiri.</strong></p>
<p>Gateway, alat, dan memori OpenClaw berada di mesin Anda, bukan di SaaS yang dihosting oleh vendor. OpenClaw menyimpan percakapan, memori jangka panjang, dan keterampilan sebagai file Markdown dan YAML biasa di bawah ruang kerja Anda dan <code translate="no">~/.openclaw</code>. Anda dapat memeriksanya di editor teks apa pun, mencadangkannya dengan Git, memeriksanya, atau menghapusnya. Model AI dapat di-host di cloud (Anthropic, OpenAI, Google) atau lokal (melalui Ollama, LM Studio, atau server yang kompatibel dengan OpenAI lainnya), tergantung bagaimana Anda mengonfigurasi blok model. Jika Anda ingin semua kesimpulan tetap berada di perangkat keras Anda, Anda mengarahkan OpenClaw ke model lokal saja.</p>
<p><strong>OpenClaw sepenuhnya otonom</strong></p>
<p>Gateway berjalan sebagai daemon latar belakang (<code translate="no">systemd</code> di Linux, <code translate="no">LaunchAgent</code> di macOS) dengan detak jantung yang dapat dikonfigurasi - setiap 30 menit secara default, setiap jam dengan Anthropic OAuth. Pada setiap detak jantung, agen membaca daftar periksa dari <code translate="no">HEARTBEAT.md</code> di ruang kerja, memutuskan apakah ada item yang memerlukan tindakan, dan mengirimi Anda pesan atau merespons <code translate="no">HEARTBEAT_OK</code> (yang secara diam-diam dijatuhkan oleh Gateway). Peristiwa eksternal - webhook, pekerjaan cron, pesan rekan satu tim - juga memicu perulangan agen.</p>
<p>Seberapa besar otonomi yang dimiliki agen adalah pilihan konfigurasi. Kebijakan alat dan persetujuan pelaksana mengatur tindakan berisiko tinggi: Anda mungkin mengizinkan pembacaan email tetapi memerlukan persetujuan sebelum mengirim, mengizinkan pembacaan file tetapi memblokir penghapusan. Nonaktifkan pagar pembatas tersebut dan alat ini akan mengeksekusi tanpa bertanya.</p>
<p><strong>OpenClaw adalah sumber terbuka.</strong></p>
<p>Gateway intinya berlisensi MIT. Gateway ini sepenuhnya dapat dibaca, dapat bercabang, dan dapat diaudit. Ini penting dalam konteks: Anthropic mengajukan penghapusan DMCA terhadap pengembang yang mengaburkan klien Claude Code; Codex CLI OpenAI adalah Apache 2.0 tetapi UI web dan modelnya tertutup; Manus sepenuhnya tertutup.</p>
<p>Ekosistemnya mencerminkan keterbukaan. <a href="https://github.com/openclaw/openclaw">Ratusan kontributor</a> telah membangun keterampilan - file <code translate="no">SKILL.md</code> modular dengan frontmatter YAML dan instruksi bahasa alami - yang dibagikan melalui ClawHub (registri keterampilan yang dapat dicari oleh agen secara otomatis), repositori komunitas, atau URL langsung. Formatnya portabel, kompatibel dengan konvensi Claude Code dan Cursor. Jika sebuah keterampilan tidak ada, Anda dapat mendeskripsikan tugas kepada agen Anda dan memintanya untuk membuat drafnya.</p>
<p>Kombinasi kepemilikan lokal, evolusi yang digerakkan oleh komunitas, dan operasi otonom inilah yang membuat para pengembang bersemangat. Bagi para pengembang yang menginginkan kontrol penuh atas peralatan AI mereka, hal ini sangat penting.</p>
<h2 id="How-OpenClaw-Works-Under-the-Hood" class="common-anchor-header">Cara Kerja OpenClaw di Balik Layar<button data-href="#How-OpenClaw-Works-Under-the-Hood" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Satu Proses, Semua Ada di Dalam</strong></p>
<p>Ketika Anda menjalankan <code translate="no">openclaw gateway</code>, Anda memulai satu proses Node.js yang berumur panjang yang disebut Gateway. Proses tersebut adalah keseluruhan sistem - koneksi saluran, status sesi, perulangan agen, pemanggilan model, eksekusi alat, persistensi memori. Tidak ada layanan terpisah yang harus dikelola.</p>
<p>Lima subsistem di dalam satu proses:</p>
<ol>
<li><p><strong>Adapter saluran</strong> - satu per platform (Baileys untuk WhatsApp, grammY untuk Telegram, dll.). Menormalkan pesan masuk ke dalam format yang umum; men-serialisasi balasan kembali.</p></li>
<li><p><strong>Manajer sesi</strong> - menyelesaikan identitas pengirim dan konteks percakapan. DM digabungkan ke dalam sesi utama; obrolan grup mendapatkan sesi mereka sendiri.</p></li>
<li><p><strong>Antrian</strong> - serialisasi berjalan per sesi. Jika sebuah pesan tiba di tengah-tengah proses, maka akan ditahan, disuntikkan, atau dikumpulkan untuk giliran berikutnya.</p></li>
<li><p><strong>Agent runtime</strong> - mengumpulkan konteks (AGENTS.md, SOUL.md, TOOLS.md, MEMORY.md, log harian, riwayat percakapan), kemudian menjalankan perulangan agen: panggil model → jalankan panggilan alat → berikan hasil kembali → ulangi hingga selesai.</p></li>
<li><p><strong>Pesawat kontrol</strong> - API WebSocket di <code translate="no">:18789</code>. CLI, aplikasi macOS, UI web, dan node iOS/Android semuanya terhubung di sini.</p></li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/OC_2_07a24c0492.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Model ini adalah panggilan API eksternal yang mungkin berjalan atau tidak berjalan secara lokal. Segala sesuatu yang lain - perutean, alat, memori, status - berada di dalam satu proses di mesin Anda.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/OC_3_0206219c02.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Untuk permintaan sederhana, perulangan itu selesai dalam hitungan detik. Rantai alat multi-langkah membutuhkan waktu lebih lama. Model ini adalah panggilan API eksternal yang mungkin berjalan secara lokal atau tidak, tetapi segala sesuatu yang lain - perutean, alat, memori, status - berada di dalam satu proses di mesin Anda.</p>
<p><strong>Perulangan yang sama dengan Kode Claude, Cangkang yang berbeda</strong></p>
<p>Perulangan agen - input → konteks → model → alat → ulangi → balas - adalah pola yang sama dengan yang digunakan oleh Claude Code. Setiap kerangka kerja agen yang serius menjalankan beberapa versi dari pola ini. Yang berbeda adalah apa yang membungkusnya.</p>
<p>Claude Code membungkusnya dengan <strong>CLI</strong>: Anda mengetik, dijalankan, dan keluar. OpenClaw membungkusnya dalam sebuah <strong>daemon persisten</strong> yang terhubung ke 12+ platform perpesanan, dengan penjadwal detak jantung, manajemen sesi di seluruh saluran, dan memori yang tetap ada di antara proses yang sedang berjalan - bahkan ketika Anda tidak berada di meja kerja Anda.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/OC_4_9c481b1ce7.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Perutean Model dan Failover</strong></p>
<p>OpenClaw bersifat model-agnostik. Anda mengonfigurasi penyedia di <code translate="no">openclaw.json</code>, dan Gateway merutekan sesuai dengan itu - dengan rotasi profil autentikasi dan rantai fallback yang menggunakan backoff eksponensial ketika penyedia mati. Tetapi pilihan model itu penting, karena OpenClaw mengumpulkan permintaan yang besar: instruksi sistem, riwayat percakapan, skema alat, keterampilan, dan memori. Beban konteks itulah yang menyebabkan sebagian besar penerapan menggunakan model frontier sebagai orkestrator utama, dengan model yang lebih murah menangani detak jantung dan tugas-tugas sub-agen.</p>
<p><strong>Kompromi Cloud vs. Kompromi Lokal</strong></p>
<p>Dari sudut pandang Gateway, model cloud dan lokal terlihat identik - keduanya merupakan titik akhir yang kompatibel dengan OpenAI. Yang berbeda adalah trade-off-nya.</p>
<p>Model cloud (Anthropic, OpenAI, Google) menawarkan penalaran yang kuat, jendela konteks yang besar, dan penggunaan alat yang andal. Mereka adalah pilihan default untuk orkestrator utama. Skala biaya dengan penggunaan: pengguna ringan menghabiskan $5-20/bulan, agen aktif dengan detak jantung yang sering dan permintaan yang besar biasanya menjalankan $50-150/bulan, dan pengguna yang tidak dioptimalkan telah melaporkan tagihan dalam jumlah ribuan.</p>
<p>Model lokal melalui Ollama atau server yang kompatibel dengan OpenAI lainnya menghilangkan biaya per token tetapi membutuhkan perangkat keras - dan OpenClaw membutuhkan setidaknya 64 ribu token konteks, yang mempersempit opsi yang layak. Pada parameter 14B, model dapat menangani otomatisasi sederhana tetapi marjinal untuk tugas agen multi-langkah; pengalaman komunitas menempatkan ambang batas yang dapat diandalkan pada 32B+, membutuhkan setidaknya 24GB VRAM. Anda tidak akan menyamai model cloud frontier dalam hal penalaran atau konteks yang diperluas, tetapi Anda mendapatkan lokalitas data penuh dan biaya yang dapat diprediksi.</p>
<p><strong>Apa yang Diberikan Arsitektur Ini kepada Anda</strong></p>
<p>Karena semuanya berjalan melalui satu proses, Gateway adalah permukaan kontrol tunggal. Model mana yang akan dipanggil, alat mana yang diizinkan, berapa banyak konteks yang harus disertakan, berapa banyak otonomi yang diberikan - semuanya dikonfigurasi di satu tempat. Saluran dipisahkan dari model: menukar Telegram dengan Slack atau Claude dengan Gemini dan tidak ada lagi yang berubah. Kabel saluran, peralatan, dan memori tetap berada di dalam infra Anda; model adalah satu-satunya ketergantungan yang Anda tunjukkan ke luar.</p>
<h3 id="What-Hardware-Do-You-Actually-Need-to-Run-OpenClaw" class="common-anchor-header">Perangkat Keras Apa yang Sebenarnya Anda Butuhkan untuk Menjalankan OpenClaw?</h3><p>Pada akhir Januari, beredar postingan yang menunjukkan para pengembang melakukan unboxing beberapa Mac Mini - seorang pengguna mengunggah 40 unit di atas meja. Bahkan Logan Kilpatrick di Google DeepMind memposting tentang pemesanan satu unit, meskipun persyaratan perangkat keras yang sebenarnya jauh lebih sederhana.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/OC_5_896f6a05f6.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Dokumentasi resminya mencantumkan persyaratan minimum sebagai RAM 2GB dan 2 inti CPU untuk obrolan dasar, atau 4GB jika Anda menginginkan otomatisasi peramban. VPS $5/bulan sudah cukup untuk memenuhi kebutuhan ini. Anda juga bisa menggunakan AWS atau Hetzner dengan Pulumi, menjalankannya di Docker pada VPS kecil, atau menggunakan laptop lama yang berdebu. Tren Mac Mini didorong oleh bukti sosial, bukan persyaratan teknis.</p>
<p><strong>Jadi mengapa orang membeli perangkat keras khusus? Ada dua alasan: isolasi dan ketekunan.</strong> Ketika Anda memberikan akses shell agen otonom, Anda menginginkan mesin yang bisa Anda cabut secara fisik jika terjadi kesalahan. Dan karena OpenClaw berjalan dalam sekejap - bangun dengan jadwal yang dapat dikonfigurasi untuk bertindak atas nama Anda - perangkat khusus berarti selalu aktif, selalu siap. Daya tariknya adalah isolasi fisik pada komputer yang bisa Anda cabut dan hidupkan tanpa bergantung pada ketersediaan layanan cloud.</p>
<h2 id="How-to-Install-OpenClaw-and-Quickly-Get-Started" class="common-anchor-header">Cara Menginstal OpenClaw dan Memulai dengan Cepat<button data-href="#How-to-Install-OpenClaw-and-Quickly-Get-Started" class="anchor-icon" translate="no">
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
    </button></h2><p>Anda membutuhkan <strong>Node 22+</strong>. Periksa dengan <code translate="no">node --version</code> jika Anda tidak yakin.</p>
<p><strong>Instal CLI:</strong></p>
<p>Pada macOS/Linux:</p>
<pre><code translate="no">curl -fsSL <span class="hljs-attr">https</span>:<span class="hljs-comment">//openclaw.ai/install.sh | bash</span>
<button class="copy-code-btn"></button></code></pre>
<p>Pada Windows (PowerShell):</p>
<pre><code translate="no">iwr -useb <span class="hljs-attr">https</span>:<span class="hljs-comment">//openclaw.ai/install.ps1 | iex</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>Jalankan wizard orientasi:</strong></p>
<pre><code translate="no">openclaw onboard --install-daemon
<button class="copy-code-btn"></button></code></pre>
<p>Ini akan memandu Anda melalui autentikasi, konfigurasi gateway, dan secara opsional menyambungkan saluran perpesanan (WhatsApp, Telegram, dll.). Bendera <code translate="no">--install-daemon</code> mendaftarkan gateway sebagai layanan latar belakang sehingga gateway akan dimulai secara otomatis.</p>
<p><strong>Verifikasi gateway telah berjalan:</strong></p>
<pre><code translate="no">openclaw gateway status
<button class="copy-code-btn"></button></code></pre>
<p><strong>Buka dasbor:</strong></p>
<pre><code translate="no">openclaw dashboard
<button class="copy-code-btn"></button></code></pre>
<p>Ini akan membuka Control UI di <code translate="no">http://127.0.0.1:18789/</code>. Anda bisa mulai mengobrol dengan agen Anda di sini - tidak perlu pengaturan saluran jika Anda hanya ingin mengujinya.</p>
<p><strong>Beberapa hal yang perlu diketahui sejak awal.</strong> Jika Anda ingin menjalankan gateway di latar depan dan bukan sebagai daemon (berguna untuk debugging), Anda bisa melakukannya:</p>
<pre><code translate="no">openclaw gateway --port 18789
<button class="copy-code-btn"></button></code></pre>
<p>Dan jika Anda perlu menyesuaikan di mana OpenClaw menyimpan konfigurasi dan statusnya - katakanlah Anda menjalankannya sebagai akun layanan atau di dalam kontainer - ada tiga env var yang penting:</p>
<ul>
<li><p><code translate="no">OPENCLAW_HOME</code> - direktori dasar untuk resolusi jalur internal</p></li>
<li><p><code translate="no">OPENCLAW_STATE_DIR</code> - menimpa tempat penyimpanan berkas state</p></li>
<li><p><code translate="no">OPENCLAW_CONFIG_PATH</code> - menunjuk ke berkas konfigurasi tertentu</p></li>
</ul>
<p>Setelah gateway berjalan dan dasbor dimuat, Anda sudah siap. Dari sana, Anda mungkin ingin menghubungkan saluran pesan dan mengatur persetujuan keahlian - kita akan membahas keduanya di bagian selanjutnya.</p>
<h2 id="How-Does-OpenClaw-Compare-to-Other-AI-Agents" class="common-anchor-header">Bagaimana OpenClaw Dibandingkan dengan Agen AI Lainnya?<button data-href="#How-Does-OpenClaw-Compare-to-Other-AI-Agents" class="anchor-icon" translate="no">
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
    </button></h2><p>Komunitas teknologi menyebut OpenClaw sebagai "Claude, tetapi dengan tangan." Ini adalah penggambaran yang jelas, tetapi melewatkan perbedaan arsitekturnya. Beberapa produk AI memiliki "tangan" sekarang - Anthropic memiliki <a href="https://claude.com/blog/claude-code">Claude Code</a> dan <a href="https://claude.com/blog/cowork-research-preview">Cowork</a>, OpenAI memiliki <a href="https://openai.com/index/introducing-chatgpt-agent/">agen</a> <a href="https://openai.com/codex/">Codex</a> dan <a href="https://openai.com/index/introducing-chatgpt-agent/">ChatGPT</a>, dan ada <a href="https://manus.im/">Manus</a>. Perbedaan yang penting dalam praktiknya adalah:</p>
<ul>
<li><p><strong>Di mana agen berjalan</strong> (mesin Anda vs cloud penyedia)</p></li>
<li><p><strong>Bagaimana Anda berinteraksi dengannya</strong> (aplikasi perpesanan, terminal, IDE, UI web)</p></li>
<li><p><strong>Siapa yang memiliki status dan memori jangka panjang</strong> (berkas lokal vs akun penyedia)</p></li>
</ul>
<p>Pada tingkat tinggi, OpenClaw adalah gateway lokal-pertama yang berada di perangkat keras Anda dan berbicara melalui aplikasi obrolan, sementara yang lainnya sebagian besar merupakan agen yang di-host yang Anda kendarai dari terminal, IDE, atau aplikasi web/desktop.</p>
<table>
<thead>
<tr><th></th><th>OpenClaw</th><th>Kode Claude</th><th>OpenAI Codex</th><th>Agen ChatGPT</th><th>Manus</th></tr>
</thead>
<tbody>
<tr><td>Sumber terbuka</td><td>Ya. Gerbang inti di bawah lisensi MIT;</td><td>Tidak.</td><td>Tidak.</td><td>Tidak.</td><td>Tidak. SaaS sumber tertutup</td></tr>
<tr><td>Antarmuka</td><td>Aplikasi perpesanan (WhatsApp, Telegram, Slack, Discord, Signal, iMessage, dll.)</td><td>Terminal, integrasi IDE, aplikasi web dan seluler</td><td>Terminal CLI, integrasi IDE, Codex Web UI</td><td>Aplikasi web dan desktop ChatGPT (termasuk mode Agen macOS)</td><td>Dasbor web, operator peramban, Slack, dan integrasi aplikasi</td></tr>
<tr><td>Fokus utama</td><td>Otomatisasi pribadi + pengembang di seluruh alat dan layanan</td><td>Pengembangan perangkat lunak dan alur kerja DevOps</td><td>Pengembangan perangkat lunak dan pengeditan kode</td><td>Tugas web untuk keperluan umum, penelitian, dan alur kerja produktivitas</td><td>Penelitian, konten, dan otomatisasi web untuk pengguna bisnis</td></tr>
<tr><td>Memori sesi</td><td>Memori berbasis file (Penurunan harga + log) pada disk; plugin opsional menambahkan memori semantik / jangka panjang</td><td>Sesi per proyek dengan riwayat, ditambah Memori Claude opsional di akun</td><td>Status per sesi di CLI / editor; tidak ada memori pengguna jangka panjang bawaan</td><td>"Agen run" per-tugas yang didukung oleh fitur memori tingkat akun ChatGPT (jika diaktifkan)</td><td>Memori sisi cloud, cakupan akun di seluruh proses, disetel untuk alur kerja yang berulang</td></tr>
<tr><td>Penerapan</td><td>Gateway/daemon yang selalu berjalan di mesin atau VPS Anda; memanggil penyedia LLM</td><td>Berjalan di mesin pengembang sebagai plugin CLI / IDE; semua panggilan model masuk ke API Anthropic</td><td>CLI berjalan secara lokal; model dijalankan melalui API OpenAI atau Codex Web</td><td>Sepenuhnya di-host oleh OpenAI; Mode agen menjalankan ruang kerja virtual dari klien ChatGPT</td><td>Di-host sepenuhnya oleh Manus; agen dijalankan di lingkungan cloud Manus</td></tr>
<tr><td>Target audiens</td><td>Pengembang dan pengguna yang nyaman menjalankan infrastruktur mereka sendiri</td><td>Pengembang dan insinyur DevOps yang bekerja di terminal dan IDE</td><td>Pengembang yang menginginkan agen pengkodean di terminal / IDE</td><td>Pekerja pengetahuan dan tim yang menggunakan ChatGPT untuk tugas-tugas pengguna akhir</td><td>Pengguna bisnis dan tim yang mengotomatiskan alur kerja yang berpusat pada web</td></tr>
<tr><td>Biaya</td><td>Gratis + pemanggilan API berdasarkan penggunaan Anda</td><td>$20-200/bulan</td><td>$20-200/bulan</td><td>$20-200/bulan</td><td>$39-199/bulan (kredit)</td></tr>
</tbody>
</table>
<h2 id="Real-World-Applications-of-OpenClaw" class="common-anchor-header">Aplikasi Dunia Nyata dari OpenClaw<button data-href="#Real-World-Applications-of-OpenClaw" class="anchor-icon" translate="no">
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
    </button></h2><p>Nilai praktis OpenClaw berasal dari cakupannya. Berikut ini adalah beberapa hal menarik yang telah dibuat oleh orang-orang dengan OpenClaw, dimulai dengan bot dukungan yang kami gunakan untuk komunitas Milvus.</p>
<p><strong>Tim Dukungan Zilliz Membangun Bot Dukungan AI untuk Komunitas Milvus di Slack</strong></p>
<p>Tim Zilliz menghubungkan OpenClaw ke ruang kerja Slack sebagai <a href="https://milvus.io/blog/stepbystep-guide-to-setting-up-openclaw-previously-clawdbotmoltbot-with-slack.md">asisten komunitas Milvus</a>. Penyiapannya membutuhkan waktu 20 menit. Bot ini sekarang menjawab pertanyaan umum tentang Milvus, membantu memecahkan masalah, dan mengarahkan pengguna ke dokumentasi yang relevan. Jika Anda ingin mencoba sesuatu yang serupa, kami menulis <a href="https://milvus.io/blog/stepbystep-guide-to-setting-up-openclaw-previously-clawdbotmoltbot-with-slack.md">tutorial langkah demi langkah</a> lengkap tentang cara menghubungkan OpenClaw ke Slack.</p>
<ul>
<li><strong>Tutorial OpenClaw:</strong> <a href="https://milvus.io/blog/stepbystep-guide-to-setting-up-openclaw-previously-clawdbotmoltbot-with-slack.md">Panduan Langkah-demi-Langkah untuk Menyiapkan OpenClaw dengan Slack</a></li>
</ul>
<p><strong>AJ Stuyvenberg Membangun Agen yang Membantunya Menegosiasikan Diskon $ 4.200 untuk Pembelian Mobil Saat Dia Tidur</strong></p>
<p>Insinyur perangkat lunak AJ Stuyvenberg menugaskan OpenClaw-nya untuk membeli Hyundai Palisade tahun 2026. Agen ini mencari tahu inventaris dealer lokal, mengisi formulir kontak menggunakan nomor telepon dan emailnya, kemudian menghabiskan beberapa hari untuk bermain melawan dealer lain-mengirimkan penawaran PDF yang saling bersaing dan meminta setiap dealer untuk mengalahkan harga satu sama lain. Hasil akhirnya: <a href="https://aaronstuyvenberg.com/posts/clawd-bought-a-car">$ 4.200</a> di bawah <a href="https://aaronstuyvenberg.com/posts/clawd-bought-a-car"> harga</a> stiker, dengan Stuyvenberg muncul hanya untuk menandatangani dokumen. "Mengalihdayakan aspek-aspek yang menyakitkan dari pembelian mobil ke AI sangat menyegarkan," tulisnya.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/OC_6_b147a5e824.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Agen Hormold Memenangkan Sengketa Asuransi yang Sebelumnya Ditutup Tanpa Permintaan</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/OC_6_5_b1a9f37495.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Seorang pengguna bernama Hormold memiliki klaim yang ditolak oleh Lemonade Insurance. OpenClaw miliknya menemukan email penolakan tersebut, menyusun sanggahan yang mengutip bahasa kebijakan, dan mengirimkannya-tanpa izin eksplisit. Lemonade membuka kembali penyelidikan. &quot;@openclaw saya secara tidak sengaja memulai pertengkaran dengan Lemonade Insurance,&quot; cuitnya. &quot;Terima kasih, AI.</p>
<h2 id="Moltbook-A-Social-Network-Built-with-OpenClaw-for-AI-Agents" class="common-anchor-header">Moltbook: Jejaring Sosial yang Dibangun dengan OpenClaw untuk Agen AI<button data-href="#Moltbook-A-Social-Network-Built-with-OpenClaw-for-AI-Agents" class="anchor-icon" translate="no">
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
    </button></h2><p>Contoh di atas menunjukkan OpenClaw mengotomatiskan tugas untuk pengguna individu. Namun, apa yang terjadi jika ribuan agen ini berinteraksi satu sama lain?</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/OC_7_2dd1b06c04.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Pada tanggal 28 Januari 2026, terinspirasi oleh dan dibangun dengan OpenClaw, pengusaha Matt Schlicht meluncurkan <a href="https://moltbook.com/">Moltbook</a> - platform bergaya Reddit di mana hanya agen AI yang dapat memposting. Pertumbuhannya sangat cepat. Dalam waktu 72 jam, 32.000 agen telah mendaftar. Dalam waktu seminggu, jumlahnya mencapai 1,5 juta. Lebih dari satu juta manusia berkunjung pada minggu pertama untuk menonton.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/OC_8_ce2b911259.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Masalah keamanan datang dengan cepat. Pada tanggal 31 Januari - empat hari setelah peluncuran - <a href="https://www.404media.co/exposed-moltbook-database-let-anyone-take-control-of-any-ai-agent-on-the-site/">404 Media melaporkan</a> bahwa kesalahan konfigurasi basis data Supabase telah membuat seluruh backend platform terbuka ke internet publik. Peneliti keamanan Jameson O'Reilly menemukan kekurangan tersebut; <a href="https://www.wiz.io/blog/exposed-moltbook-database-reveals-millions-of-api-keys">Wiz secara independen mengonfirmasikannya</a> dan mendokumentasikan cakupan lengkapnya: akses baca dan tulis yang tidak terautentikasi ke semua tabel, termasuk 1,5 juta kunci API agen, lebih dari 35.000 alamat email, dan ribuan pesan pribadi.</p>
<p>Apakah Moltbook merepresentasikan perilaku mesin yang muncul atau agen yang mereproduksi kiasan fiksi ilmiah dari data pelatihan masih menjadi pertanyaan. Yang tidak terlalu ambigu adalah demonstrasi teknisnya: agen otonom yang mempertahankan konteks yang terus-menerus, berkoordinasi pada platform bersama, dan menghasilkan output terstruktur tanpa instruksi eksplisit. Bagi para insinyur yang membangun dengan OpenClaw atau kerangka kerja serupa, ini adalah pratinjau langsung dari kemampuan dan tantangan keamanan yang muncul dengan AI agenik dalam skala besar.</p>
<h2 id="Technical-Risks-and-Production-Considerations-for-OpenClaw" class="common-anchor-header">Risiko Teknis dan Pertimbangan Produksi untuk OpenClaw<button data-href="#Technical-Risks-and-Production-Considerations-for-OpenClaw" class="anchor-icon" translate="no">
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
    </button></h2><p>Sebelum Anda menerapkan OpenClaw di mana pun yang penting, Anda perlu memahami apa yang sebenarnya Anda jalankan. Ini adalah agen dengan akses shell, kontrol peramban, dan kemampuan untuk mengirim email atas nama Anda - secara berulang-ulang, tanpa diminta. Itu sangat kuat, tetapi permukaan serangannya sangat besar dan proyeknya masih muda.</p>
<p><strong>Model auth memiliki lubang yang serius.</strong> Pada tanggal 30 Januari 2026, Mav Levin dari depthfirst mengungkapkan <a href="https://thehackernews.com/2026/02/openclaw-bug-enables-one-click-remote.html">CVE-2026-25253</a> (CVSS 8.8) - bug pembajakan WebSocket lintas situs di mana situs web mana pun dapat mencuri token auth Anda dan mendapatkan RCE di mesin Anda melalui satu tautan berbahaya. Satu klik, akses penuh. Hal ini telah ditambal di <code translate="no">2026.1.29</code>, tetapi Censys menemukan lebih dari 21.000 contoh OpenClaw yang terekspos ke internet publik pada saat itu, banyak di antaranya melalui HTTP biasa. <strong>Jika Anda menjalankan versi yang lebih lama atau belum mengunci konfigurasi jaringan Anda, periksa terlebih dahulu.</strong></p>
<p><strong>Keterampilan hanyalah kode dari orang asing, dan tidak ada kotak pasir.</strong> <a href="https://blogs.cisco.com/ai/personal-ai-agents-like-openclaw-are-a-security-nightmare">Tim keamanan Cisco</a> membongkar sebuah keterampilan yang disebut "What Would Elon Do?" yang telah dimainkan menjadi nomor satu di repositori. Itu adalah malware langsung - menggunakan injeksi cepat untuk mem-bypass pemeriksaan keamanan dan mengeksfiltrasi data pengguna ke server yang dikendalikan penyerang. Mereka menemukan sembilan kerentanan dalam satu keterampilan itu, dua di antaranya sangat penting. Ketika mereka mengaudit 31.000 keterampilan agen di berbagai platform (Claude, Copilot, repositori AgentSkills generik), 26% memiliki setidaknya satu kerentanan. Lebih dari 230 keterampilan berbahaya diunggah ke ClawHub pada minggu pertama bulan Februari saja. <strong>Perlakukan setiap keterampilan yang tidak Anda tulis sendiri seperti ketergantungan yang tidak tepercaya - garpu, baca, lalu pasang.</strong></p>
<p><strong>Perulangan detak jantung akan melakukan hal-hal yang tidak Anda minta.</strong> Kisah Hormold dari pengantar - di mana agen menemukan penolakan asuransi, meneliti preseden, dan mengirim sanggahan hukum secara mandiri - bukanlah demo fitur; ini adalah risiko tanggung jawab. Agen berkomitmen untuk melakukan korespondensi hukum tanpa persetujuan manusia. Itu berhasil saat itu. Tidak akan selalu berhasil. <strong>Apa pun yang melibatkan pembayaran, penghapusan, atau komunikasi eksternal membutuhkan gerbang human-in-the-loop, titik.</strong></p>
<p><strong>Biaya API bertambah dengan cepat jika Anda tidak mengawasi.</strong> Angka kasarnya: pengaturan ringan dengan beberapa detak jantung per hari membutuhkan biaya $18-36/bulan pada Sonnet 4.5. Tingkatkan menjadi 12+ pemeriksaan setiap hari pada Opus dan Anda akan melihat $ 270-540/bulan. Satu orang di HN menemukan bahwa mereka menghabiskan $70/bulan untuk panggilan API yang berlebihan dan pencatatan yang bertele-tele - memotongnya menjadi hampir tidak ada setelah membersihkan konfigurasi. <strong>Mengatur peringatan pengeluaran di tingkat penyedia.</strong> Interval detak jantung yang salah konfigurasi dapat menguras anggaran API Anda dalam semalam.</p>
<p>Sebelum Anda menerapkan, kami sangat menyarankan agar Anda melakukan hal ini:</p>
<ul>
<li><p>Jalankan di lingkungan yang terisolasi - VM atau kontainer khusus, bukan driver harian Anda</p></li>
<li><p>Garpu dan audit setiap keterampilan sebelum menginstal. Baca sumbernya. Semuanya.</p></li>
<li><p>Tetapkan batas pengeluaran API yang keras di tingkat penyedia, bukan hanya di konfigurasi agen</p></li>
<li><p>Gerbang semua tindakan yang tidak dapat diubah di balik persetujuan manusia - pembayaran, penghapusan, pengiriman email, apa pun yang bersifat eksternal</p></li>
<li><p>Sematkan ke versi 2026.1.29 atau yang lebih baru dan ikuti perkembangan patch keamanan</p></li>
</ul>
<p>Jangan mengeksposnya ke internet publik kecuali Anda tahu persis apa yang Anda lakukan dengan konfigurasi jaringan.</p>
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
    </button></h2><p>OpenClaw melewati 175.000 bintang GitHub dalam waktu kurang dari dua minggu, menjadikannya salah satu repositori sumber terbuka dengan pertumbuhan tercepat dalam sejarah GitHub. Adopsi ini nyata, dan arsitektur di bawahnya perlu mendapat perhatian.</p>
<p>Dari sudut pandang teknis, OpenClaw memiliki tiga hal yang tidak dimiliki oleh kebanyakan agen AI: sepenuhnya open-source (MIT), mengutamakan lokal (memori yang disimpan sebagai file Markdown di komputer Anda), dan dijadwalkan secara otonom (daemon detak jantung yang bekerja tanpa diminta). Aplikasi ini terintegrasi dengan platform perpesanan seperti Slack, Telegram, dan WhatsApp secara langsung, dan mendukung keterampilan yang dibangun oleh komunitas melalui sistem SKILL.md yang sederhana. Kombinasi tersebut membuatnya sangat cocok untuk membangun asisten yang selalu aktif: Slack bot yang menjawab pertanyaan 24/7, monitor kotak masuk yang melakukan triase email saat Anda tidur, atau alur kerja otomatisasi yang berjalan di perangkat keras Anda sendiri tanpa terkunci oleh vendor.</p>
<p>Meskipun demikian, arsitektur yang membuat OpenClaw sangat kuat juga membuatnya berisiko jika digunakan secara sembarangan. Beberapa hal yang perlu diingat:</p>
<ul>
<li><p><strong>Jalankan secara terpisah.</strong> Gunakan perangkat atau VM khusus, bukan mesin utama Anda. Jika terjadi kesalahan, Anda menginginkan tombol pemutus yang dapat Anda jangkau secara fisik.</p></li>
<li><p><strong>Audit keterampilan sebelum menginstal.</strong> 26% keterampilan komunitas yang dianalisis oleh Cisco mengandung setidaknya satu kerentanan. Pisahkan dan tinjau apa pun yang tidak Anda percayai.</p></li>
<li><p><strong>Tetapkan batas pengeluaran API di tingkat penyedia.</strong> Detak jantung yang salah konfigurasi dapat menghabiskan ratusan dolar dalam semalam. Konfigurasikan peringatan sebelum Anda menerapkan.</p></li>
<li><p><strong>Gerbang tindakan yang tidak dapat diubah.</strong> Pembayaran, penghapusan, komunikasi eksternal: semua ini harus memerlukan persetujuan manusia, bukan eksekusi otonom.</p></li>
</ul>
<h2 id="Keep-Reading" class="common-anchor-header">Teruslah Membaca<button data-href="#Keep-Reading" class="anchor-icon" translate="no">
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
<li><p><a href="https://milvus.io/blog/stepbystep-guide-to-setting-up-openclaw-previously-clawdbotmoltbot-with-slack.md">Panduan Langkah-demi-Langkah untuk Menyiapkan OpenClaw dengan Slack</a> - Bangun bot dukungan AI yang didukung Milvus di ruang kerja Slack Anda menggunakan OpenClaw</p></li>
<li><p><a href="https://milvus.io/blog/langchain-and-milvus-build-production-ready-agents-with-real-long-term-memory.md">LangChain 1.0 dan Milvus: Membangun Agen AI yang Siap Produksi dengan Memori Jangka Panjang</a> - Cara memberi agen Anda memori semantik yang persisten dengan Milvus</p></li>
<li><p><a href="https://milvus.io/blog/stop-use-outdated-rag-deepsearcher-agentic-rag-approaches-changes-everything.md">Berhenti Membangun Vanilla RAG: Rangkullah Agentic RAG dengan DeepSearcher</a> - Mengapa agentic RAG mengungguli pengambilan tradisional, dengan implementasi sumber terbuka langsung</p></li>
<li><p><a href="https://milvus.io/docs/agentic_rag_with_milvus_and_langgraph.md">Agentic RAG dengan Milvus dan LangGraph</a> - Tutorial: membuat agen yang memutuskan kapan harus mengambil, menilai relevansi dokumen, dan menulis ulang kueri</p></li>
<li><p><a href="https://milvus.io/blog/building-a-production-ready-ai-assistant-with-spring-boot-and-milvus.md">Membangun Asisten AI yang Siap Produksi dengan Spring Boot dan Milvus</a> - Panduan lengkap untuk membangun asisten AI perusahaan dengan pencarian semantik dan memori percakapan</p></li>
</ul>
