---
id: we-extracted-openclaws-memory-system-and-opensourced-it-memsearch.md
title: Kami Mengekstrak Sistem Memori OpenClaw dan Sumber Terbuka (memsearch)
author: Cheney Zhang
date: 2026-02-13T00:00:00.000Z
cover: assets.zilliz.com/memsearch_openclaw_memory_11zon_b2a6b4cbb9.jpg
tag: Engineering
recommend: true
publishToMedium: true
tags: 'OpenClaw, AI agent memory, vector search, Milvus'
meta_keywords: >-
  OpenClaw, AI agent memory, persistent memory, Python, vector search, Milvus,
  memsearch
meta_title: |
  We Extracted OpenClaw’s Memory System and Open-Sourced It (memsearch)
desc: >-
  Kami mengekstrak arsitektur memori AI OpenClaw ke dalam memsearch - sebuah
  pustaka Python mandiri dengan log Markdown, pencarian vektor hibrida, dan
  dukungan Git.
origin: >-
  https://milvus.io/blog/we-extracted-openclaws-memory-system-and-opensourced-it-memsearch.md
---
<p><a href="https://milvus.io/blog/openclaw-formerly-clawdbot-moltbot-explained-a-complete-guide-to-the-autonomous-ai-agent.md">OpenClaw</a> (sebelumnya clawdbot dan moltbot) menjadi viral - <a href="https://github.com/openclaw/openclaw">189 ribu+ bintang GitHub</a> dalam waktu kurang dari dua minggu. Ini sangat gila. Sebagian besar dari buzz yang ada adalah seputar kemampuannya yang otonom dan agen di seluruh saluran obrolan sehari-hari, termasuk iMessages, WhatsApp, Slack, Telegram, dan banyak lagi.</p>
<p>Namun sebagai insinyur yang bekerja pada sistem basis data vektor, yang benar-benar menarik perhatian kami adalah <strong>pendekatan OpenClaw terhadap memori jangka panjang.</strong> Tidak seperti kebanyakan sistem memori di luar sana, OpenClaw memiliki AI yang secara otomatis menulis log harian sebagai file Markdown. File-file tersebut adalah sumber kebenaran, dan model hanya "mengingat" apa yang dituliskan ke disk. Pengembang manusia dapat membuka file-file penurunan harga tersebut, mengeditnya secara langsung, menyaring prinsip-prinsip jangka panjang, dan melihat dengan tepat apa yang diingat oleh AI pada titik mana pun. Tidak ada kotak hitam. Sejujurnya, ini adalah salah satu arsitektur memori yang paling bersih dan paling ramah pengembang yang pernah kami lihat.</p>
<p>Jadi tentu saja, kami memiliki pertanyaan: <strong><em>mengapa ini hanya bekerja di dalam OpenClaw? Bagaimana jika ada agen yang bisa memiliki memori seperti ini?</em></strong> Kami mengambil arsitektur memori yang tepat dari OpenClaw dan membangun <a href="https://github.com/zilliztech/memsearch">memsearch</a> - perpustakaan memori jangka panjang yang berdiri sendiri, plug-and-play yang memberikan agen mana pun memori yang persisten, transparan, dan dapat diedit oleh manusia. Tidak ada ketergantungan pada bagian lain dari OpenClaw. Cukup masukkan saja, dan agen Anda akan mendapatkan memori yang tahan lama dengan pencarian yang didukung oleh Milvus/Zilliz Cloud, ditambah log penurunan harga sebagai sumber kebenaran kanonik.</p>
<iframe width="997" height="561" src="https://www.youtube.com/embed/VRzqRVFm39s" title="MemSearch: OpenClaw's long-term memory" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
<ul>
<li><p><strong>GitHub Repo:</strong> <a href="https://github.com/zilliztech/memsearch">github.com/zilliztech/memsearch</a> (sumber terbuka, lisensi MIT)</p></li>
<li><p><strong>Dokumentasi:</strong> <a href="https://zilliztech.github.io/memsearch/">https://zilliztech.github.io/memsearch/</a></p></li>
<li><p><strong>Plugin kode Claude:</strong> <a href="https://zilliztech.github.io/memsearch/claude-plugin/">https://zilliztech.github.io/memsearch/claude-plugin/</a></p></li>
</ul>
<h2 id="What-Makes-OpenClaws-Memory-Different" class="common-anchor-header">Apa yang Membuat Memori OpenClaw Berbeda<button data-href="#What-Makes-OpenClaws-Memory-Different" class="anchor-icon" translate="no">
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
    </button></h2><p>Sebelum masuk ke dalam arsitektur memori OpenClaw, mari kita luruskan dua konsep: <strong>konteks</strong> dan <strong>memori</strong>. Keduanya terdengar mirip tetapi dalam praktiknya sangat berbeda.</p>
<ul>
<li><p><strong>Konteks</strong> adalah segala sesuatu yang dilihat oleh agen dalam satu permintaan - perintah sistem, file panduan tingkat proyek seperti <code translate="no">AGENTS.md</code> dan <code translate="no">SOUL.md</code>, riwayat percakapan (pesan, panggilan alat, ringkasan yang dikompresi), dan pesan pengguna saat ini. Ini terbatas pada satu sesi dan relatif ringkas.</p></li>
<li><p><strong>Memori</strong> adalah apa yang bertahan di seluruh sesi. Memori ini berada di disk lokal Anda - riwayat lengkap percakapan sebelumnya, file yang pernah digunakan agen, dan preferensi pengguna. Tidak diringkas. Tidak dikompresi. Hal-hal yang masih mentah.</p></li>
</ul>
<p>Sekarang, inilah keputusan desain yang membuat pendekatan OpenClaw menjadi istimewa: <strong>semua memori disimpan sebagai file Markdown biasa di sistem berkas lokal</strong>. Setelah setiap sesi, AI menulis pembaruan ke log Markdown tersebut secara otomatis. Anda-dan pengembang mana pun-dapat membukanya, mengeditnya, mengatur ulang, menghapusnya, atau menyempurnakannya. Sementara itu, basis data vektor berada di samping sistem ini, membuat dan memelihara indeks untuk pencarian. Setiap kali file Markdown berubah, sistem akan mendeteksi perubahan tersebut dan mengindeks ulang secara otomatis.</p>
<p>Jika Anda pernah menggunakan alat seperti Mem0 atau Zep, Anda akan segera melihat perbedaannya. Sistem-sistem tersebut menyimpan memori sebagai penyematan - itulah satu-satunya salinan. Anda tidak dapat membaca apa yang diingat oleh agen Anda. Anda tidak dapat memperbaiki memori yang buruk dengan mengedit sebuah baris. Pendekatan OpenClaw memberikan Anda keduanya: transparansi file biasa <strong>dan</strong> kekuatan pencarian vektor menggunakan basis data vektor. Anda bisa membacanya, <code translate="no">git diff</code> itu, grep itu - itu hanya file.</p>
<p>Satu-satunya kekurangannya? Saat ini sistem memori yang mengutamakan penurunan harga ini sangat terkait erat dengan ekosistem OpenClaw secara keseluruhan - proses Gateway, konektor platform, konfigurasi ruang kerja, dan infrastruktur pesan. Jika Anda hanya menginginkan model memori, maka akan ada banyak mesin yang harus diikutsertakan.</p>
<p>Itulah mengapa kami membangun <a href="http://github.com/zilliztech/memsearch"><strong>memsearch</strong></a>: filosofi yang sama - Markdown sebagai sumber kebenaran, pengindeksan vektor otomatis, dapat diedit oleh manusia sepenuhnya - tetapi disampaikan sebagai pustaka mandiri yang ringan yang dapat Anda masukkan ke dalam arsitektur agen apa pun.</p>
<h2 id="How-Memsearch-Works" class="common-anchor-header">Bagaimana Memsearch Bekerja<button data-href="#How-Memsearch-Works" class="anchor-icon" translate="no">
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
    </button></h2><p>Seperti yang telah disebutkan sebelumnya, <a href="https://github.com/zilliztech/memsearch">memsearch</a> adalah pustaka memori jangka panjang yang sepenuhnya independen yang mengimplementasikan arsitektur memori yang sama dengan yang digunakan di OpenClaw-tanpa membawa serta tumpukan OpenClaw lainnya. Anda dapat menyambungkannya ke dalam kerangka kerja agen apa pun (Claude, GPT, Llama, agen khusus, mesin alur kerja) dan secara instan memberikan memori yang persisten, transparan, dan dapat diedit oleh manusia kepada sistem Anda.</p>
<p>Semua memori agen dalam memsearch disimpan sebagai Markdown teks biasa dalam direktori lokal. Strukturnya sengaja dibuat sederhana agar para pengembang dapat memahaminya dengan cepat:</p>
<pre><code translate="no">~/your-project/
└── memory/
    ├── MEMORY.md              <span class="hljs-comment"># Hand-written long-term memory</span>
    ├── 2026-02-09.md          <span class="hljs-comment"># Today&#x27;s work log</span>
    ├── 2026-02-08.md
    └── 2026-02-07.md
<button class="copy-code-btn"></button></code></pre>
<p>Memsearch menggunakan <a href="https://milvus.io/"><strong>Milvus</strong></a> sebagai basis data vektor untuk mengindeks berkas-berkas Markdown ini untuk pengambilan semantik yang cepat. Tetapi yang terpenting, indeks vektor <em>bukanlah</em> sumber kebenaran - berkas-berkasnya yang benar. Jika Anda menghapus indeks Milvus sepenuhnya, <strong>Anda tidak akan kehilangan apa pun</strong>. Memsearch hanya menyematkan kembali dan mengindeks ulang file Markdown, membangun kembali lapisan pengambilan penuh dalam beberapa menit. Ini berarti memori agen Anda transparan, tahan lama, dan dapat direkonstruksi sepenuhnya.</p>
<p>Berikut ini adalah kemampuan inti dari memsearch:</p>
<h3 id="Readable-Markdown-Makes-Debugging-as-Simple-as-Editing-a-File" class="common-anchor-header">Markdown yang Dapat Dibaca Membuat Debugging Semudah Mengedit File</h3><p>Debugging memori AI biasanya menyakitkan. Ketika sebuah agen menghasilkan jawaban yang salah, sebagian besar sistem memori tidak memberi Anda cara yang jelas untuk melihat <em>apa</em> yang sebenarnya disimpan. Alur kerja yang umum dilakukan adalah menulis kode khusus untuk meminta API memori, kemudian memilah-milah embedding yang tidak jelas atau gumpalan JSON yang bertele-tele-tidak ada yang memberi tahu Anda banyak tentang keadaan internal AI yang sebenarnya.</p>
<p><strong>memsearch menghilangkan seluruh kelas masalah tersebut.</strong> Semua memori berada di dalam memori/folder sebagai Markdown biasa:</p>
<pre><code translate="no" class="language-markdown"><span class="hljs-meta">## Morning</span>
- Fixed N+<span class="hljs-number">1</span> query issue — <span class="hljs-function">switched to <span class="hljs-title">selectinload</span>()
- Query count dropped <span class="hljs-keyword">from</span> 152 to 3
</span><button class="copy-code-btn"></button></code></pre>
<p>Jika AI melakukan kesalahan, memperbaikinya semudah mengedit file. Perbarui entri, simpan, dan memsearch secara otomatis mengindeks ulang perubahan. Lima detik. Tidak ada panggilan API. Tidak ada perkakas. Tidak ada misteri. Anda men-debug memori AI dengan cara yang sama seperti men-debug dokumentasi-dengan mengedit file.</p>
<h3 id="Git-Backed-Memory-Means-Teams-Can-Track-Review-and-Roll-Back-Changes" class="common-anchor-header">Memori yang Didukung Git Berarti Tim Dapat Melacak, Meninjau, dan Mengembalikan Perubahan</h3><p>Memori AI yang berada di dalam basis data sulit untuk dikolaborasikan. Mencari tahu siapa yang mengubah apa dan kapan berarti menggali log audit, dan banyak solusi yang tidak menyediakannya. Perubahan terjadi secara diam-diam, dan ketidaksepakatan tentang apa yang harus diingat oleh AI tidak memiliki jalur penyelesaian yang jelas. Tim akhirnya mengandalkan pesan dan asumsi Slack.</p>
<p>Memsearch memperbaiki masalah ini dengan menjadikan memori hanya sebagai berkas penurunan versi-yang berarti <strong>Git menangani pembuatan versi secara otomatis</strong>. Satu perintah menunjukkan seluruh riwayat:</p>
<pre><code translate="no" class="language-bash">git <span class="hljs-built_in">log</span> memory/MEMORY.md
git diff HEAD~1 memory/2026-02-09.md
<button class="copy-code-btn"></button></code></pre>
<p>Sekarang memori AI berpartisipasi dalam alur kerja yang sama dengan kode. Keputusan arsitektur, pembaruan konfigurasi, dan perubahan preferensi semuanya muncul dalam diff yang dapat dikomentari, disetujui, atau dikembalikan oleh siapa pun:</p>
<pre><code translate="no" class="language-diff">+ <span class="hljs-meta">## Architecture Decision</span>
+ - Use Kafka <span class="hljs-keyword">for</span> <span class="hljs-keyword">event</span> bus instead of RabbitMQ
+ - Reason: better horizontal scaling
<button class="copy-code-btn"></button></code></pre>
<h3 id="Plaintext-Memory-Makes-Migration-Nearly-Effortless" class="common-anchor-header">Memori Plaintext Membuat Migrasi Menjadi Hampir Mudah</h3><p>Migrasi adalah salah satu biaya tersembunyi terbesar dari kerangka kerja memori. Berpindah dari satu alat ke alat lain biasanya berarti mengekspor data, mengonversi format, mengimpor ulang, dan berharap bidang-bidang tersebut kompatibel. Pekerjaan semacam itu dapat dengan mudah menghabiskan setengah hari, dan hasilnya tidak pernah terjamin.</p>
<p>memsearch menghindari masalah ini sepenuhnya karena memori adalah plaintext Penurunan harga. Tidak ada format kepemilikan, tidak ada skema yang perlu diterjemahkan, tidak ada yang perlu dimigrasi:</p>
<ul>
<li><p><strong>Pindah mesin:</strong> <code translate="no">rsync</code> folder memori. Selesai.</p></li>
<li><p><strong>Ganti model penyematan:</strong> Jalankan kembali perintah indeks. Ini akan memakan waktu lima menit, dan file penurunan harga tidak akan tersentuh.</p></li>
<li><p><strong>Ganti penyebaran basis data vektor:</strong> Mengubah satu nilai konfigurasi. Misalnya, beralih dari Milvus Lite dalam pengembangan ke Zilliz Cloud dalam produksi:</p></li>
</ul>
<pre><code translate="no" class="language-python"><span class="hljs-meta"># Development</span>
ms = MemSearch(milvus_uri=<span class="hljs-string">&quot;~/.memsearch/milvus.db&quot;</span>)

<span class="hljs-meta"># Production (change only this <span class="hljs-keyword">line</span>)</span>
ms = MemSearch(milvus_uri=<span class="hljs-string">&quot;https://xxx.zillizcloud.com&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>File memori Anda tetap sama persis. Infrastruktur di sekitarnya dapat berkembang dengan bebas. Hasilnya adalah portabilitas jangka panjang - sifat yang langka dalam sistem AI.</p>
<h3 id="Shared-Markdown-Files-Let-Humans-and-Agents-Co-Author-Memory" class="common-anchor-header">File Penurunan Harga Bersama Memungkinkan Manusia dan Agen Menulis Memori Bersama</h3><p>Pada sebagian besar solusi memori, mengedit apa yang diingat oleh AI memerlukan penulisan kode terhadap API. Itu berarti hanya pengembang yang dapat mengelola memori AI, dan bahkan bagi mereka, hal ini merepotkan.</p>
<p>Memsearch memungkinkan pembagian tanggung jawab yang lebih alami:</p>
<ul>
<li><p><strong>AI menangani:</strong> Catatan harian otomatis (<code translate="no">YYYY-MM-DD.md</code>) dengan detail eksekusi seperti "diterapkan v2.3.1, peningkatan kinerja 12%."</p></li>
<li><p><strong>Manusia menangani:</strong> Prinsip-prinsip jangka panjang di <code translate="no">MEMORY.md</code>, seperti "Tumpukan tim: Python + FastAPI + PostgreSQL."</p></li>
</ul>
<p>Kedua belah pihak mengedit file Markdown yang sama dengan alat apa pun yang sudah mereka gunakan. Tidak ada pemanggilan API, tidak ada perkakas khusus, tidak ada penjaga gerbang. Ketika memori terkunci di dalam basis data, kepenulisan bersama seperti ini tidak mungkin dilakukan. memsearch menjadikannya sebagai default.</p>
<h2 id="Under-the-Hood-memsearch-Runs-on-Four-Workflows-That-Keep-Memory-Fast-Fresh-and-Lean" class="common-anchor-header">Di Balik Tudung: memsearch Berjalan pada Empat Alur Kerja yang Menjaga Memori Tetap Cepat, Segar, dan Ramping<button data-href="#Under-the-Hood-memsearch-Runs-on-Four-Workflows-That-Keep-Memory-Fast-Fresh-and-Lean" class="anchor-icon" translate="no">
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
    <img translate="no" src="https://assets.zilliz.com/ms1_c855cb19a5.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>memsearch memiliki empat alur kerja inti: <strong>Menonton</strong> (memantau) → <strong>Indeks</strong> (memotong dan menyematkan) → <strong>Cari</strong> (mengambil) → <strong>Ringkas</strong> (meringkas). Inilah yang dilakukan oleh masing-masing alur tersebut.</p>
<h3 id="1-Watch-Automatically-Re-Index-on-Every-File-Save" class="common-anchor-header">1. Menonton: Mengindeks Ulang Secara Otomatis pada Setiap Penyimpanan File</h3><p>Alur kerja <strong>Watch</strong> memonitor semua file Markdown dalam memori/direktori dan memicu indeks ulang setiap kali sebuah file dimodifikasi dan disimpan. <strong>Debounce 1500ms</strong> memastikan pembaruan terdeteksi tanpa membuang-buang komputasi: jika beberapa penyimpanan terjadi secara berurutan, pengatur waktu akan diatur ulang dan menyala hanya ketika pengeditan telah stabil.</p>
<p>Penundaan itu disetel secara empiris:</p>
<ul>
<li><p><strong>100ms</strong> → terlalu sensitif; menyala pada setiap penekanan tombol, membakar panggilan penyematan</p></li>
<li><p><strong>10 detik</strong> → terlalu lambat; pengembang menyadari adanya kelambatan</p></li>
<li><p><strong>1500ms</strong> → keseimbangan ideal antara daya tanggap dan efisiensi sumber daya</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ms2_92fdb7f1f8.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Dalam praktiknya, ini berarti pengembang dapat menulis kode di satu jendela dan mengedit <code translate="no">MEMORY.md</code> di jendela lain, menambahkan URL dokumen API atau mengoreksi entri yang sudah ketinggalan zaman. Simpan file, dan kueri AI berikutnya akan mengambil memori yang baru. Tidak perlu memulai ulang, tidak perlu mengindeks ulang secara manual.</p>
<h3 id="2-Index-Smart-Chunking-Deduplication-and-Version-Aware-Embeddings" class="common-anchor-header">2. Indeks: Pemotongan Cerdas, Deduplikasi, dan Penyematan Sadar Versi</h3><p>Index adalah alur kerja yang sangat penting bagi kinerja. Ini menangani tiga hal: <strong>chunking, deduplikasi, dan ID chunk berversi</strong>.</p>
<p><strong>Pemenggalan</strong> membagi teks di sepanjang batas semantik-judul dan badan teks-sehingga konten yang terkait tetap bersama. Hal ini untuk menghindari kasus di mana frasa seperti "Konfigurasi Redis" terpecah menjadi beberapa bagian.</p>
<p>Misalnya, Penurunan harga ini:</p>
<pre><code translate="no" class="language-markdown"><span class="hljs-comment">## Redis Caching</span>
We use Redis <span class="hljs-keyword">for</span> L1 cache <span class="hljs-keyword">with</span> 5<span class="hljs-built_in">min</span> TTL.
The connection pool <span class="hljs-keyword">is</span> configured <span class="hljs-keyword">with</span> <span class="hljs-built_in">max</span> <span class="hljs-number">100</span> connections.

<span class="hljs-comment">## Database</span>
PostgreSQL <span class="hljs-number">16</span> <span class="hljs-keyword">is</span> the primary database.
<button class="copy-code-btn"></button></code></pre>
<p>Menjadi dua potongan:</p>
<ul>
<li><p>Potongan 1: <code translate="no">## Redis Caching\nWe use Redis for L1 cache...</code></p></li>
<li><p>Potongan 2: Potongan 2: <code translate="no">## Database\nPostgreSQL 16 is the primary database.</code></p></li>
</ul>
<p><strong>Deduplikasi</strong> menggunakan hash SHA-256 untuk setiap potongan untuk menghindari penyematan teks yang sama dua kali. Jika beberapa file menyebutkan "PostgreSQL 16," API penyematan dipanggil sekali, bukan sekali per file. Untuk ~500KB teks, ini menghemat sekitar <strong>$0,15/bulan</strong>. Dalam skala besar, penghematan ini bisa mencapai ratusan dolar.</p>
<p><strong>Desain ID Chunk</strong> mengkodekan semua yang diperlukan untuk mengetahui apakah sebuah chunk sudah basi. Formatnya adalah <code translate="no">hash(source_path:start_line:end_line:content_hash:model_version)</code>. Bidang <code translate="no">model_version</code> adalah bagian yang penting: ketika sebuah model penyematan ditingkatkan dari <code translate="no">text-embedding-3-small</code> ke <code translate="no">text-embedding-3-large</code>, penyematan yang lama menjadi tidak valid. Karena versi model dimasukkan ke dalam ID, sistem secara otomatis mengidentifikasi potongan mana yang perlu disematkan ulang. Tidak diperlukan pembersihan manual.</p>
<h3 id="3-Search-Hybrid-Vector-+-BM25-Retrieval-for-Maximum-Accuracy" class="common-anchor-header">3. Pencarian: Pencarian Vektor Hibrida + BM25 untuk Akurasi Maksimum</h3><p>Pencarian menggunakan pendekatan pencarian hibrida: pencarian vektor berbobot 70% dan pencarian kata kunci BM25 berbobot 30%. Hal ini menyeimbangkan dua kebutuhan berbeda yang sering muncul dalam praktiknya.</p>
<ul>
<li><p><strong>Pencarian vektor</strong> menangani pencocokan semantik. Kueri untuk "Redis cache config" mengembalikan potongan yang berisi "Redis L1 cache dengan TTL 5 menit" meskipun kata-katanya berbeda. Ini berguna ketika pengembang mengingat konsepnya tetapi tidak mengingat frasa yang tepat.</p></li>
<li><p><strong>BM25</strong> menangani pencocokan yang tepat. Kueri untuk "PostgreSQL 16" tidak mengembalikan hasil tentang "PostgreSQL 15." Hal ini penting untuk kode kesalahan, nama fungsi, dan perilaku spesifik versi, di mana close tidak cukup baik.</p></li>
</ul>
<p>Pembagian default 70/30 bekerja dengan baik untuk sebagian besar kasus penggunaan. Untuk alur kerja yang sangat condong ke arah pencocokan yang sama persis, menaikkan bobot BM25 menjadi 50% adalah perubahan konfigurasi satu baris.</p>
<p>Hasil dikembalikan sebagai potongan top-K (default 3), masing-masing terpotong menjadi 200 karakter. Ketika konten lengkap diperlukan, <code translate="no">memsearch expand &lt;chunk_hash&gt;</code> akan memuatnya. Pengungkapan progresif ini membuat penggunaan jendela konteks LLM tetap ramping tanpa mengorbankan akses ke detail.</p>
<h3 id="4-Compact-Summarize-Historical-Memory-to-Keep-Context-Clean" class="common-anchor-header">4. Ringkas: Meringkas Memori Historis untuk Menjaga Konteks Tetap Bersih</h3><p>Memori yang menumpuk pada akhirnya menjadi masalah. Entri lama memenuhi jendela konteks, meningkatkan biaya token, dan menambahkan noise yang menurunkan kualitas jawaban. Compact mengatasi hal ini dengan memanggil LLM untuk meringkas memori historis ke dalam bentuk yang ringkas, kemudian menghapus atau mengarsipkan yang asli. Ini dapat dipicu secara manual atau dijadwalkan untuk berjalan pada interval yang teratur.</p>
<h2 id="How-to-get-started-with-memsearch" class="common-anchor-header">Cara memulai dengan memsearch<button data-href="#How-to-get-started-with-memsearch" class="anchor-icon" translate="no">
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
    </button></h2><p>Memsearch menyediakan <strong>API Python</strong> dan <strong>CLI</strong>, sehingga Anda bisa menggunakannya di dalam kerangka kerja agen atau sebagai alat debugging mandiri. Penyiapannya minimal, dan sistem ini dirancang agar lingkungan pengembangan lokal dan penerapan produksi Anda terlihat hampir sama.</p>
<p>Memsearch mendukung tiga backend yang kompatibel dengan Milvus, semuanya diekspos melalui <strong>API yang sama</strong>:</p>
<ul>
<li><p><a href="https://milvus.io/docs/milvus_lite.md"><strong>Milvus Lite (default)</strong></a><strong>:</strong> File <code translate="no">.db</code> lokal, tanpa konfigurasi, cocok untuk penggunaan individu.</p></li>
<li><p><strong>Milvus Standalone / Cluster:</strong> Di-host sendiri, mendukung beberapa agen berbagi data, cocok untuk lingkungan tim.</p></li>
<li><p><a href="https://zilliz.com/cloud"><strong>Zilliz Cloud</strong></a><strong>:</strong> Dikelola sepenuhnya, dengan penskalaan otomatis, pencadangan, ketersediaan tinggi, dan isolasi. Ideal untuk beban kerja produksi.</p></li>
</ul>
<p>Beralih dari pengembangan lokal ke produksi biasanya merupakan <strong>perubahan konfigurasi satu baris</strong>. Kode Anda tetap sama.</p>
<h3 id="Install" class="common-anchor-header">Instal</h3><pre><code translate="no" class="language-bash">pip install memsearch
<button class="copy-code-btn"></button></code></pre>
<p>memsearch juga mendukung beberapa penyedia penyematan, termasuk OpenAI, Google, Voyage, Ollama, dan model lokal. Ini memastikan arsitektur memori Anda tetap portabel dan vendor-agnostik.</p>
<h3 id="Option-1-Python-API-integrated-into-your-agent-framework" class="common-anchor-header">Opsi 1: API Python (terintegrasi ke dalam kerangka kerja agen Anda)</h3><p>Berikut ini adalah contoh minimal dari perulangan agen lengkap menggunakan memsearch. Anda dapat menyalin/menempel dan memodifikasi sesuai kebutuhan:</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> openai <span class="hljs-keyword">import</span> OpenAI
<span class="hljs-keyword">from</span> memsearch <span class="hljs-keyword">import</span> MemSearch

llm = OpenAI()
ms = MemSearch(paths=[<span class="hljs-string">&quot;./memory/&quot;</span>])

<span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">agent_chat</span>(<span class="hljs-params">user_input: <span class="hljs-built_in">str</span></span>) -&gt; <span class="hljs-built_in">str</span>:
    <span class="hljs-comment"># 1. Recall — search relevant memories</span>
    memories = <span class="hljs-keyword">await</span> ms.search(user_input, top_k=<span class="hljs-number">3</span>)
    context = <span class="hljs-string">&quot;\n&quot;</span>.join(<span class="hljs-string">f&quot;- <span class="hljs-subst">{m[<span class="hljs-string">&#x27;content&#x27;</span>][:<span class="hljs-number">200</span>]}</span>&quot;</span> <span class="hljs-keyword">for</span> m <span class="hljs-keyword">in</span> memories)

    <span class="hljs-comment"># 2. Think — call LLM</span>
    resp = llm.chat.completions.create(
        model=<span class="hljs-string">&quot;gpt-4o-mini&quot;</span>,
        messages=[
            {<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;system&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: <span class="hljs-string">f&quot;Memories:\n<span class="hljs-subst">{context}</span>&quot;</span>},
            {<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: user_input},
        ],
    )

    <span class="hljs-comment"># 3. Remember — write to markdown, update index</span>
    save_memory(<span class="hljs-string">f&quot;## <span class="hljs-subst">{user_input}</span>\n<span class="hljs-subst">{resp.choices[<span class="hljs-number">0</span>].message.content}</span>&quot;</span>)
    <span class="hljs-keyword">await</span> ms.index()
    <span class="hljs-keyword">return</span> resp.choices[<span class="hljs-number">0</span>].message.content
<button class="copy-code-btn"></button></code></pre>
<p>Ini menunjukkan perulangan inti:</p>
<ul>
<li><p><strong>Ingat</strong>: memsearch melakukan pengambilan vektor hibrida + BM25</p></li>
<li><p><strong>Pikirkan</strong>: LLM Anda memproses input pengguna + memori yang diambil</p></li>
<li><p><strong>Ingat</strong>: agen menulis memori baru ke Markdown, dan memsearch memperbarui indeksnya</p></li>
</ul>
<p>Pola ini cocok secara alami ke dalam sistem agen apa pun - LangChain, AutoGPT, router semantik, LangGraph, atau loop agen khusus. Ini adalah kerangka kerja yang bersifat agnostik secara desain.</p>
<h3 id="Option-2-CLI-quick-operations-good-for-debugging" class="common-anchor-header">Opsi 2: CLI (operasi cepat, bagus untuk debugging)</h3><p>CLI sangat ideal untuk alur kerja mandiri, pemeriksaan cepat, atau memeriksa memori selama pengembangan:</p>
<pre><code translate="no" class="language-bash">memsearch index ./docs/              <span class="hljs-comment"># Index files</span>
memsearch search <span class="hljs-string">&quot;Redis caching&quot;</span>     <span class="hljs-comment"># Search</span>
memsearch watch ./docs/              <span class="hljs-comment"># Watch for file changes</span>
memsearch compact                    <span class="hljs-comment"># Compact old memory</span>
<button class="copy-code-btn"></button></code></pre>
<p>CLI mencerminkan kemampuan API Python tetapi bekerja tanpa menulis kode apa pun-bagus untuk debugging, inspeksi, migrasi, atau memvalidasi struktur folder memori Anda.</p>
<h2 id="How-memsearch-Compares-to-Other-Memory-Solutions" class="common-anchor-header">Bagaimana memsearch Dibandingkan dengan Solusi Memori Lainnya<button data-href="#How-memsearch-Compares-to-Other-Memory-Solutions" class="anchor-icon" translate="no">
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
    </button></h2><p>Pertanyaan paling umum yang ditanyakan oleh para pengembang adalah mengapa mereka menggunakan memsearch ketika sudah ada opsi yang sudah ada. Jawaban singkatnya: memsearch menukar fitur-fitur canggih seperti grafik pengetahuan temporal dengan transparansi, portabilitas, dan kesederhanaan. Untuk sebagian besar kasus penggunaan memori agen, itu adalah pertukaran yang tepat.</p>
<table>
<thead>
<tr><th>Solusi</th><th>Kekuatan</th><th>Keterbatasan</th><th>Paling cocok untuk</th></tr>
</thead>
<tbody>
<tr><td>memsearch</td><td>Memori plaintext transparan, penulisan bersama manusia-AI, gesekan migrasi nol, debugging yang mudah, Git-native</td><td>Tidak ada grafik temporal bawaan atau struktur memori multi-agen yang kompleks</td><td>Tim yang menghargai kontrol, kesederhanaan, dan portabilitas dalam memori jangka panjang</td></tr>
<tr><td>Mem0</td><td>Dikelola sepenuhnya, tidak ada infrastruktur yang harus dijalankan atau dipelihara</td><td>Buram-tidak dapat memeriksa atau mengedit memori secara manual; penyematan adalah satu-satunya representasi</td><td>Tim yang menginginkan layanan terkelola lepas tangan dan tidak masalah dengan visibilitas yang lebih rendah</td></tr>
<tr><td>Zep</td><td>Rangkaian fitur yang kaya: memori temporal, pemodelan multi-persona, grafik pengetahuan yang kompleks</td><td>Arsitektur yang berat; lebih banyak bagian yang bergerak; lebih sulit untuk dipelajari dan dioperasikan</td><td>Agen yang benar-benar membutuhkan struktur memori tingkat lanjut atau penalaran yang sadar waktu</td></tr>
<tr><td>LangMem / Letta</td><td>Integrasi yang dalam dan mulus di dalam ekosistem mereka sendiri</td><td>Kerangka kerja terkunci; sulit untuk di-porting ke tumpukan agen lain</td><td>Tim yang sudah berkomitmen pada kerangka kerja spesifik tersebut</td></tr>
</tbody>
</table>
<h2 id="Start-Using-memsearch-and-Join-the-Project" class="common-anchor-header">Mulai Menggunakan memsearch dan Bergabunglah dengan Proyek<button data-href="#Start-Using-memsearch-and-Join-the-Project" class="anchor-icon" translate="no">
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
    </button></h2><p>Memsearch sepenuhnya bersifat open source di bawah lisensi MIT, dan repositori siap untuk percobaan produksi hari ini.</p>
<ul>
<li><p><strong>Repo:</strong> <a href="https://github.com/zilliztech/memsearch">github.com/zilliztech/memsearch</a></p></li>
<li><p><strong>Dokumen:</strong> <a href="https://zilliztech.github.io/memsearch">zilliztech.github.io/memsearch</a></p></li>
</ul>
<p>Jika Anda sedang membangun sebuah agen yang perlu mengingat berbagai hal di seluruh sesi dan menginginkan kontrol penuh atas apa yang diingatnya, memsearch patut dicoba. Pustaka ini dipasang dengan satu <code translate="no">pip install</code>, bekerja dengan kerangka kerja agen apa pun, dan menyimpan semuanya sebagai Markdown yang dapat Anda baca, edit, dan versi dengan Git.</p>
<p>Kami secara aktif mengembangkan memsearch dan sangat mengharapkan masukan dari komunitas.</p>
<ul>
<li><p>Buka masalah jika ada sesuatu yang rusak.</p></li>
<li><p>Kirimkan PR jika Anda ingin memperluas perpustakaan.</p></li>
<li><p>Bintangi repo jika filosofi Markdown-sebagai-sumber-kebenaran sesuai dengan Anda.</p></li>
</ul>
<p>Sistem memori OpenClaw tidak lagi terkunci di dalam OpenClaw. Sekarang, siapa pun dapat menggunakannya.</p>
<h2 id="Keep-Reading" class="common-anchor-header">Teruslah membaca<button data-href="#Keep-Reading" class="anchor-icon" translate="no">
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
<li><p><a href="https://milvus.io/blog/openclaw-formerly-clawdbot-moltbot-explained-a-complete-guide-to-the-autonomous-ai-agent.md">Apa itu OpenClaw? Panduan Lengkap untuk Agen AI Sumber Terbuka</a></p></li>
<li><p><a href="https://milvus.io/blog/stepbystep-guide-to-setting-up-openclaw-previously-clawdbotmoltbot-with-slack.md">Tutorial OpenClaw: Menghubungkan ke Slack untuk Asisten AI Lokal</a></p></li>
<li><p><a href="https://milvus.io/blog/clawdbot-long-running-ai-agents-langgraph-milvus.md">Membuat Agen AI Bergaya Clawdbot dengan LangGraph &amp; Milvus</a></p></li>
<li><p><a href="https://milvus.io/blog/is-rag-become-outdated-now-long-running-agents-like-claude-cowork-are-emerging.md">Agen RAG vs Agen yang Sudah Berjalan Lama: Apakah RAG Sudah Usang?</a></p></li>
<li><p><a href="https://milvus.io/blog/create-a-custom-anthropic-skill-for-milvus-to-quickly-spin-up-rag.md">Membuat Keterampilan Antropik Khusus untuk Milvus untuk Memutar RAG dengan Cepat</a></p></li>
</ul>
