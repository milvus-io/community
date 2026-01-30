---
id: >-
  why-claude-code-feels-so-stable-a-developers-deep-dive-into-its-local-storage-design.md
title: >-
  Mengapa Claude Code Terasa Sangat Stabil: Pendalaman Seorang Pengembang ke
  dalam Desain Penyimpanan Lokalnya
author: Bill Chen
date: 2026-01-30T00:00:00.000Z
cover: assets.zilliz.com/cover_Claudecode_storage_81155960ef.jpeg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Claude, Claude Code, Vector Database, Retreival Augmented Generation, Milvus'
meta_keywords: 'Claude Code, AI agent, AI coding assistant, Agent memory'
meta_title: |
  How Claude Code Manages Local Storage for AI Agents
desc: >-
  Mendalami penyimpanan Claude Code: Log sesi JSONL, isolasi proyek, konfigurasi
  berlapis, dan snapshot file yang membuat pengkodean dengan bantuan AI menjadi
  stabil dan dapat dipulihkan.
origin: >-
  https://milvus.io/blog/why-claude-code-feels-so-stable-a-developers-deep-dive-into-its-local-storage-design.md
---
<p>Claude Code telah ada di mana-mana akhir-akhir ini. Para pengembang menggunakannya untuk mengirimkan fitur lebih cepat, mengotomatiskan alur kerja, dan membuat prototipe agen yang benar-benar bekerja dalam proyek nyata. Yang lebih mengejutkan lagi adalah berapa banyak orang yang bukan pembuat kode yang ikut serta - membangun alat, memasang kabel, dan mendapatkan hasil yang berguna dengan hampir tanpa pengaturan. Jarang sekali ada alat pengkodean AI yang menyebar dengan cepat di berbagai tingkat keahlian yang berbeda.</p>
<p>Namun, yang benar-benar menonjol adalah betapa <em>stabilnya</em> alat ini. Claude Code mengingat apa yang terjadi di seluruh sesi, bertahan dari kerusakan tanpa kehilangan kemajuan, dan berperilaku lebih seperti alat pengembangan lokal daripada antarmuka obrolan. Keandalan tersebut berasal dari bagaimana ia menangani penyimpanan lokal.</p>
<p>Alih-alih memperlakukan sesi pengkodean Anda sebagai obrolan sementara, Claude Code membaca dan menulis file nyata, menyimpan status proyek di disk, dan mencatat setiap langkah kerja agen. Sesi dapat dilanjutkan, diperiksa, atau diputar kembali tanpa menebak-nebak, dan setiap proyek tetap terisolasi dengan baik - menghindari masalah kontaminasi silang yang dialami oleh banyak alat agen.</p>
<p>Dalam artikel ini, kita akan melihat lebih dekat pada arsitektur penyimpanan di balik stabilitas tersebut, dan mengapa arsitektur ini memainkan peran besar dalam membuat Claude Code terasa praktis untuk pengembangan sehari-hari.</p>
<h2 id="Challenges-Every-Local-AI-Coding-Assistant-Faces" class="common-anchor-header">Tantangan yang Dihadapi Setiap Asisten Pengkodean AI Lokal<button data-href="#Challenges-Every-Local-AI-Coding-Assistant-Faces" class="anchor-icon" translate="no">
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
    </button></h2><p>Sebelum menjelaskan bagaimana Claude Code melakukan pendekatan terhadap penyimpanan, mari kita lihat masalah umum yang sering dihadapi oleh alat pengkodean AI lokal. Hal ini muncul secara alami ketika asisten bekerja secara langsung pada sistem file Anda dan menyimpan status dari waktu ke waktu.</p>
<p><strong>1. Data proyek tercampur di seluruh ruang kerja.</strong></p>
<p>Sebagian besar pengembang beralih di antara beberapa repo sepanjang hari. Jika asisten membawa status dari satu proyek ke proyek lain, akan lebih sulit untuk memahami perilakunya dan lebih mudah baginya untuk membuat asumsi yang salah. Setiap proyek membutuhkan ruang yang bersih dan terisolasi untuk state dan riwayat.</p>
<p><strong>2. Kerusakan dapat menyebabkan kehilangan data.</strong></p>
<p>Selama sesi pengkodean, asisten menghasilkan aliran data yang berguna - pengeditan file, pemanggilan alat, langkah-langkah peralihan. Jika data ini tidak segera disimpan, crash atau restart paksa dapat menghapusnya. Sistem yang andal akan menulis status penting ke disk segera setelah dibuat, sehingga pekerjaan tidak akan hilang secara tiba-tiba.</p>
<p><strong>3. Tidak selalu jelas apa yang sebenarnya dilakukan oleh agen.</strong></p>
<p>Sesi yang biasa melibatkan banyak tindakan kecil. Tanpa catatan yang jelas dan teratur tentang tindakan-tindakan tersebut, sulit untuk menelusuri kembali bagaimana asisten sampai pada hasil tertentu atau menemukan langkah di mana terjadi kesalahan. Riwayat lengkap membuat debugging dan peninjauan menjadi lebih mudah dikelola.</p>
<p><strong>4. Membatalkan kesalahan membutuhkan banyak usaha.</strong></p>
<p>Terkadang asisten membuat perubahan yang tidak sesuai. Jika Anda tidak memiliki cara bawaan untuk mengembalikan perubahan tersebut, Anda akhirnya harus mencari pengeditan secara manual di seluruh repo. Sistem seharusnya secara otomatis melacak apa yang berubah sehingga Anda dapat membatalkannya dengan bersih tanpa kerja ekstra.</p>
<p><strong>5. Proyek yang berbeda membutuhkan pengaturan yang berbeda.</strong></p>
<p>Lingkungan lokal berbeda-beda. Beberapa proyek memerlukan izin, alat, atau aturan direktori tertentu; proyek lainnya memiliki skrip atau alur kerja khusus. Seorang asisten perlu menghormati perbedaan ini dan mengizinkan pengaturan per proyek sambil tetap menjaga perilaku intinya tetap konsisten.</p>
<h2 id="The-Storage-Design-Principles-Behind-Claude-Code" class="common-anchor-header">Prinsip-prinsip Desain Penyimpanan di Balik Claude Code<button data-href="#The-Storage-Design-Principles-Behind-Claude-Code" class="anchor-icon" translate="no">
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
    </button></h2><p>Desain penyimpanan Claude Code dibangun berdasarkan empat ide sederhana. Keempat ide tersebut mungkin terlihat sederhana, tetapi bersama-sama mengatasi masalah praktis yang muncul ketika asisten AI bekerja secara langsung di mesin Anda dan di beberapa proyek.</p>
<h3 id="1-Each-project-gets-its-own-storage" class="common-anchor-header">1. Setiap proyek mendapatkan penyimpanannya sendiri.</h3><p>Claude Code mengikat semua data sesi ke direktori proyek yang dimilikinya. Itu berarti percakapan, pengeditan, dan log tetap berada di proyek asalnya dan tidak bocor ke proyek lain. Menjaga penyimpanan tetap terpisah membuat perilaku asisten lebih mudah dipahami dan memudahkan untuk memeriksa atau menghapus data untuk repo tertentu.</p>
<h3 id="2-Data-is-saved-to-disk-right-away" class="common-anchor-header">2. Data langsung disimpan ke disk.</h3><p>Alih-alih menyimpan data interaksi di memori, Claude Code menulisnya ke disk segera setelah dibuat. Setiap peristiwa-pesan, panggilan alat, atau pembaruan status-ditambahkan sebagai entri baru. Jika program macet atau ditutup secara tidak terduga, hampir semuanya masih ada di sana. Pendekatan ini membuat sesi tetap awet tanpa menambah banyak kerumitan.</p>
<h3 id="3-Every-action-has-a-clear-place-in-history" class="common-anchor-header">3. Setiap tindakan memiliki tempat yang jelas dalam sejarah.</h3><p>Claude Code menautkan setiap pesan dan tindakan alat ke pesan dan tindakan sebelumnya, membentuk urutan yang lengkap. Riwayat yang teratur ini memungkinkan untuk meninjau bagaimana sebuah sesi berlangsung dan melacak langkah-langkah yang mengarah ke hasil tertentu. Bagi pengembang, memiliki jejak semacam ini membuat debugging dan memahami perilaku agen menjadi lebih mudah.</p>
<h3 id="4-Code-edits-are-easy-to-roll-back" class="common-anchor-header">4. Pengeditan kode mudah dikembalikan.</h3><p>Sebelum asisten memperbarui file, Claude Code menyimpan cuplikan status sebelumnya. Jika perubahannya ternyata salah, Anda dapat mengembalikan versi sebelumnya tanpa menggali repo atau menebak-nebak apa yang berubah. Jaring pengaman sederhana ini membuat pengeditan yang digerakkan oleh AI jauh lebih tidak berisiko.</p>
<h2 id="Claude-Code-Local-Storage-Layout" class="common-anchor-header">Tata Letak Penyimpanan Lokal Claude Code<button data-href="#Claude-Code-Local-Storage-Layout" class="anchor-icon" translate="no">
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
    </button></h2><p>Claude Code menyimpan semua data lokalnya di satu tempat: direktori rumah Anda. Hal ini membuat sistem dapat diprediksi dan membuatnya lebih mudah untuk diperiksa, di-debug, atau dibersihkan bila diperlukan. Tata letak penyimpanan dibangun di sekitar dua komponen utama: file konfigurasi global kecil dan direktori data yang lebih besar di mana semua status tingkat proyek berada.</p>
<p><strong>Dua komponen inti:</strong></p>
<ul>
<li><p><code translate="no">~/.claude.json</code>Menyimpan konfigurasi global dan pintasan, termasuk pemetaan proyek, pengaturan server MCP, dan prompt yang baru saja digunakan.</p></li>
<li><p><code translate="no">~/.claude/</code>Direktori data utama, tempat Claude Code menyimpan percakapan, sesi proyek, izin, plugin, keterampilan, riwayat, dan data runtime terkait.</p></li>
</ul>
<p>Selanjutnya, mari kita lihat lebih dekat dua komponen inti ini.</p>
<p><strong>(1) Konfigurasi global</strong>: <code translate="no">~/.claude.json</code></p>
<p>File ini bertindak sebagai indeks dan bukan penyimpan data. File ini mencatat proyek mana saja yang pernah Anda kerjakan, alat apa saja yang dilampirkan pada setiap proyek, dan perintah apa saja yang baru saja Anda gunakan. Data percakapan itu sendiri tidak disimpan di sini.</p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;projects&quot;</span>: {
    <span class="hljs-string">&quot;/Users/xxx/my-project&quot;</span>: {
      <span class="hljs-string">&quot;mcpServers&quot;</span>: {
        <span class="hljs-string">&quot;jarvis-tasks&quot;</span>: {
          <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;stdio&quot;</span>,
          <span class="hljs-string">&quot;command&quot;</span>: <span class="hljs-string">&quot;python&quot;</span>,
          <span class="hljs-string">&quot;args&quot;</span>: [<span class="hljs-string">&quot;/path/to/run_mcp.py&quot;</span>]
        }
      }
    }
  },
  <span class="hljs-string">&quot;recentPrompts&quot;</span>: [
    <span class="hljs-string">&quot;Fix the bug in auth module&quot;</span>,
    <span class="hljs-string">&quot;Add unit tests&quot;</span>
  ]
}
<button class="copy-code-btn"></button></code></pre>
<p><strong>(2) Direktori data utama</strong>: <code translate="no">~/.claude/</code></p>
<p>Direktori <code translate="no">~/.claude/</code> adalah tempat sebagian besar status lokal Claude Code berada. Strukturnya mencerminkan beberapa ide desain inti: isolasi proyek, ketekunan langsung, dan pemulihan yang aman dari kesalahan.</p>
<pre><code translate="no">~/.claude/
├── settings.json                    <span class="hljs-comment"># Global settings (permissions, plugins, cleanup intervals)</span>
├── settings.local.json              <span class="hljs-comment"># Local settings (machine-specific, not committed to Git)</span>
├── history.jsonl                    <span class="hljs-comment"># Command history</span>
│
├── projects/                        <span class="hljs-comment"># 📁 Session data (organized by project, core directory)</span>
│   └── -Users-xxx-project/          <span class="hljs-comment"># Path-encoded project directory</span>
│       ├── {session-<span class="hljs-built_in">id</span>}.jsonl       <span class="hljs-comment"># Primary session data (JSONL format)</span>
│       └── agent-{agentId}.jsonl    <span class="hljs-comment"># Sub-agent session data</span>
│
├── session-env/                     <span class="hljs-comment"># Session environment variables</span>
│   └── {session-<span class="hljs-built_in">id</span>}/                <span class="hljs-comment"># Isolated by session ID</span>
│
├── skills/                          <span class="hljs-comment"># 📁 User-level skills (globally available)</span>
│   └── mac-mail/
│       └── SKILL.md
│
├── plugins/                         <span class="hljs-comment"># 📁 Plugin management</span>
│   ├── config.json                  <span class="hljs-comment"># Global plugin configuration</span>
│   ├── installed_plugins.json       <span class="hljs-comment"># List of installed plugins</span>
│   ├── known_marketplaces.json      <span class="hljs-comment"># Marketplace source configuration</span>
│   ├── cache/                       <span class="hljs-comment"># Plugin cache</span>
│   └── marketplaces/
│       └── anthropic-agent-skills/
│           ├── .claude-plugin/
│           │   └── marketplace.json
│           └── skills/
│               ├── pdf/
│               ├── docx/
│               └── frontend-design/
│
├── todos/                           <span class="hljs-comment"># Task list storage</span>
│   └── {session-<span class="hljs-built_in">id</span>}-*.json          <span class="hljs-comment"># Session-linked task files</span>
│
├── file-history/                    <span class="hljs-comment"># File edit history (stored by content hash)</span>
│   └── {content-<span class="hljs-built_in">hash</span>}/              <span class="hljs-comment"># Hash-named backup directory</span>
│
├── shell-snapshots/                 <span class="hljs-comment"># Shell state snapshots</span>
├── plans/                           <span class="hljs-comment"># Plan Mode storage</span>
├── local/                           <span class="hljs-comment"># Local tools / node_modules</span>
│   └── claude                       <span class="hljs-comment"># Claude CLI executable</span>
│   └── node_modules/                <span class="hljs-comment"># Local dependencies</span>
│
├── statsig/                         <span class="hljs-comment"># Feature flag cache</span>
├── telemetry/                       <span class="hljs-comment"># Telemetry data</span>
└── debug/                           <span class="hljs-comment"># Debug logs</span>
<button class="copy-code-btn"></button></code></pre>
<p>Tata letak ini sengaja dibuat sederhana: semua yang dihasilkan oleh Claude Code berada di bawah satu direktori, diorganisir berdasarkan proyek dan sesi. Tidak ada status tersembunyi yang tersebar di sekitar sistem Anda, dan mudah untuk memeriksa atau membersihkannya bila perlu.</p>
<h2 id="How-Claude-Code-Manages-Configuration" class="common-anchor-header">Bagaimana Claude Code Mengelola Konfigurasi<button data-href="#How-Claude-Code-Manages-Configuration" class="anchor-icon" translate="no">
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
    </button></h2><p>Sistem konfigurasi Claude Code dirancang berdasarkan ide sederhana: menjaga perilaku default tetap konsisten di seluruh mesin, tetapi tetap membiarkan lingkungan dan proyek individu menyesuaikan apa yang mereka butuhkan. Untuk mewujudkan hal ini, Claude Code menggunakan model konfigurasi tiga lapis. Ketika pengaturan yang sama muncul di lebih dari satu tempat, lapisan yang lebih spesifik selalu menang.</p>
<h3 id="The-three-configuration-levels" class="common-anchor-header">Tiga tingkat konfigurasi</h3><p>Claude Code memuat konfigurasi dengan urutan sebagai berikut, dari prioritas terendah hingga tertinggi:</p>
<pre><code translate="no">┌─────────────────────────────────────────┐
│    <span class="hljs-title class_">Project</span>-level configuration          │  <span class="hljs-title class_">Highest</span> priority
│    project/.<span class="hljs-property">claude</span>/settings.<span class="hljs-property">json</span>        │  <span class="hljs-title class_">Project</span>-specific, overrides other configs
├─────────────────────────────────────────┤
│    <span class="hljs-title class_">Local</span> configuration                  │  <span class="hljs-title class_">Machine</span>-specific, not version-controlled
│    ~<span class="hljs-regexp">/.claude/</span>settings.<span class="hljs-property">local</span>.<span class="hljs-property">json</span>        │  <span class="hljs-title class_">Overrides</span> <span class="hljs-variable language_">global</span> configuration
├─────────────────────────────────────────┤
│    <span class="hljs-title class_">Global</span> configuration                 │  <span class="hljs-title class_">Lowest</span> priority
│    ~<span class="hljs-regexp">/.claude/</span>settings.<span class="hljs-property">json</span>              │  <span class="hljs-title class_">Base</span> <span class="hljs-keyword">default</span> configuration
└─────────────────────────────────────────┘
<button class="copy-code-btn"></button></code></pre>
<p>Anda dapat menganggapnya sebagai memulai dengan default global, kemudian menerapkan penyesuaian khusus mesin, dan akhirnya menerapkan aturan khusus proyek.</p>
<p>Selanjutnya, kita akan membahas setiap tingkat konfigurasi secara mendetail.</p>
<p><strong>(1) Konfigurasi global</strong>: <code translate="no">~/.claude/settings.json</code></p>
<p>Konfigurasi global mendefinisikan perilaku default untuk Claude Code di semua proyek. Di sinilah Anda mengatur izin dasar, mengaktifkan plugin, dan mengonfigurasi perilaku pembersihan.</p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;<span class="hljs-variable">$schema</span>&quot;</span>: <span class="hljs-string">&quot;https://json.schemastore.org/claude-code-settings.json&quot;</span>,
  <span class="hljs-string">&quot;permissions&quot;</span>: {
    <span class="hljs-string">&quot;allow&quot;</span>: [<span class="hljs-string">&quot;Read(**)&quot;</span>, <span class="hljs-string">&quot;Bash(npm:*)&quot;</span>],
    <span class="hljs-string">&quot;deny&quot;</span>: [<span class="hljs-string">&quot;Bash(rm -rf:*)&quot;</span>],
    <span class="hljs-string">&quot;ask&quot;</span>: [<span class="hljs-string">&quot;Edit&quot;</span>, <span class="hljs-string">&quot;Write&quot;</span>]
  },
  <span class="hljs-string">&quot;enabledPlugins&quot;</span>: {
    <span class="hljs-string">&quot;document-skills@anthropic-agent-skills&quot;</span>: <span class="hljs-literal">true</span>
  },
  <span class="hljs-string">&quot;cleanupPeriodDays&quot;</span>: 30
}
<button class="copy-code-btn"></button></code></pre>
<p><strong>(2) Konfigurasi lokal</strong>: <code translate="no">~/.claude/settings.local.json</code></p>
<p>Konfigurasi lokal dikhususkan untuk satu mesin. Konfigurasi ini tidak dimaksudkan untuk dibagikan atau diperiksa ke dalam kontrol versi. Ini merupakan tempat yang baik untuk kunci API, alat lokal, atau izin khusus lingkungan.</p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;permissions&quot;</span>: {
    <span class="hljs-string">&quot;allow&quot;</span>: [<span class="hljs-string">&quot;Bash(git:*)&quot;</span>, <span class="hljs-string">&quot;Bash(docker:*)&quot;</span>]
  },
  <span class="hljs-string">&quot;env&quot;</span>: {
    <span class="hljs-string">&quot;ANTHROPIC_API_KEY&quot;</span>: <span class="hljs-string">&quot;sk-ant-xxx&quot;</span>
  }
}
<button class="copy-code-btn"></button></code></pre>
<p><strong>(3) Konfigurasi tingkat proyek</strong>: <code translate="no">project/.claude/settings.json</code></p>
<p>Konfigurasi tingkat proyek hanya berlaku untuk satu proyek dan memiliki prioritas tertinggi. Di sinilah Anda mendefinisikan aturan yang harus selalu berlaku ketika bekerja di repositori tersebut.</p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;permissions&quot;</span>: {
    <span class="hljs-string">&quot;allow&quot;</span>: [<span class="hljs-string">&quot;Bash(pytest:*)&quot;</span>]
  }
}
<button class="copy-code-btn"></button></code></pre>
<p>Dengan lapisan konfigurasi yang telah ditentukan, pertanyaan selanjutnya adalah <strong>bagaimana Claude Code menyelesaikan konfigurasi dan izin pada saat runtime</strong>.</p>
<p><strong>Claude Code</strong> menerapkan konfigurasi dalam tiga lapisan: dimulai dengan default global, kemudian menerapkan penggantian khusus mesin, dan akhirnya menerapkan aturan khusus proyek. Ketika pengaturan yang sama muncul di beberapa tempat, konfigurasi yang paling spesifik akan diprioritaskan.</p>
<p>Izin mengikuti urutan evaluasi yang tetap:</p>
<ol>
<li><p><strong>tolak</strong> - selalu memblokir</p></li>
<li><p><strong>tanyakan</strong> - memerlukan konfirmasi</p></li>
<li><p><strong>mengizinkan</strong> - berjalan secara otomatis</p></li>
<li><p><strong>default</strong> - hanya berlaku jika tidak ada aturan yang cocok</p></li>
</ol>
<p>Hal ini membuat sistem tetap aman secara default, namun tetap memberikan fleksibilitas yang dibutuhkan oleh proyek dan mesin individu.</p>
<h2 id="Session-Storage-How-Claude-Code-Persists-Core-Interaction-Data" class="common-anchor-header">Penyimpanan Sesi: Bagaimana Claude Code Menyimpan Data Interaksi Inti<button data-href="#Session-Storage-How-Claude-Code-Persists-Core-Interaction-Data" class="anchor-icon" translate="no">
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
    </button></h2><p>Dalam <strong>Claude Code</strong>, sesi adalah unit inti data. Sesi menangkap seluruh interaksi antara pengguna dan AI, termasuk percakapan itu sendiri, panggilan alat, perubahan file, dan konteks terkait. Bagaimana sesi disimpan memiliki dampak langsung pada keandalan sistem, kemampuan debug, dan keamanan secara keseluruhan.</p>
<h3 id="Keep-session-data-separate-for-each-project" class="common-anchor-header">Pisahkan data sesi untuk setiap proyek</h3><p>Setelah sesi didefinisikan, pertanyaan selanjutnya adalah bagaimana <strong>Claude Code</strong> menyimpannya dengan cara yang membuat data tetap terorganisir dan terpisah.</p>
<p><strong>Claude Code</strong> mengisolasi data sesi berdasarkan proyek. Sesi setiap proyek disimpan di bawah direktori yang berasal dari jalur file proyek.</p>
<p>Jalur penyimpanan mengikuti pola ini:</p>
<p><code translate="no">~/.claude/projects/ + path-encoded project directory</code></p>
<p>Untuk membuat nama direktori yang valid, karakter khusus seperti <code translate="no">/</code>, spasi, dan <code translate="no">~</code> diganti dengan <code translate="no">-</code>.</p>
<p>Sebagai contoh:</p>
<p><code translate="no">/Users/bill/My Project → -Users-bill-My-Project</code></p>
<p>Pendekatan ini memastikan bahwa data sesi dari proyek yang berbeda tidak pernah bercampur dan dapat dikelola atau dihapus per proyek.</p>
<h3 id="Why-sessions-are-stored-in-JSONL-format" class="common-anchor-header">Mengapa sesi disimpan dalam format JSONL</h3><p><strong>Claude Code</strong> menyimpan data sesi menggunakan JSONL (JSON Lines), bukan JSON standar.</p>
<p>Dalam file JSON tradisional, semua pesan digabungkan bersama di dalam satu struktur besar, yang berarti seluruh file harus dibaca dan ditulis ulang setiap kali ada perubahan. Sebaliknya, JSONL menyimpan setiap pesan sebagai baris tersendiri di dalam file. Satu baris sama dengan satu pesan, tanpa pembungkus luar.</p>
<table>
<thead>
<tr><th>Aspek</th><th>JSON Standar</th><th>JSONL (Baris JSON)</th></tr>
</thead>
<tbody>
<tr><td>Bagaimana data disimpan</td><td>Satu struktur besar</td><td>Satu pesan per baris</td></tr>
<tr><td>Kapan data disimpan</td><td>Biasanya di bagian akhir</td><td>Segera, per pesan</td></tr>
<tr><td>Dampak kerusakan</td><td>Seluruh file dapat rusak</td><td>Hanya baris terakhir yang terpengaruh</td></tr>
<tr><td>Menulis data baru</td><td>Menulis ulang seluruh file</td><td>Menambahkan satu baris</td></tr>
<tr><td>Penggunaan memori</td><td>Memuat semuanya</td><td>Membaca baris demi baris</td></tr>
</tbody>
</table>
<p>JSONL bekerja lebih baik dalam beberapa cara utama:</p>
<ul>
<li><p><strong>Penyimpanan segera:</strong> Setiap pesan langsung ditulis ke disk segera setelah dibuat, alih-alih menunggu sesi selesai.</p></li>
<li><p><strong>Tahan terhadap kerusakan:</strong> Jika program mengalami kerusakan, hanya pesan terakhir yang belum selesai yang akan hilang. Semua yang ditulis sebelum itu akan tetap utuh.</p></li>
<li><p><strong>Penambahan cepat:</strong> Pesan baru ditambahkan ke akhir file tanpa membaca atau menulis ulang data yang ada.</p></li>
<li><p><strong>Penggunaan memori yang rendah:</strong> File sesi dapat dibaca satu baris dalam satu waktu, sehingga seluruh file tidak perlu dimuat ke dalam memori.</p></li>
</ul>
<p>File sesi JSONL yang disederhanakan terlihat seperti ini:</p>
<pre><code translate="no">{<span class="hljs-string">&quot;type&quot;</span>:<span class="hljs-string">&quot;user&quot;</span>,<span class="hljs-string">&quot;message&quot;</span>:{<span class="hljs-string">&quot;role&quot;</span>:<span class="hljs-string">&quot;user&quot;</span>,<span class="hljs-string">&quot;content&quot;</span>:<span class="hljs-string">&quot;Hello&quot;</span>},<span class="hljs-string">&quot;timestamp&quot;</span>:<span class="hljs-string">&quot;2026-01-05T10:00:00Z&quot;</span>}
{<span class="hljs-string">&quot;type&quot;</span>:<span class="hljs-string">&quot;assistant&quot;</span>,<span class="hljs-string">&quot;message&quot;</span>:{<span class="hljs-string">&quot;role&quot;</span>:<span class="hljs-string">&quot;assistant&quot;</span>,<span class="hljs-string">&quot;content&quot;</span>:[{<span class="hljs-string">&quot;type&quot;</span>:<span class="hljs-string">&quot;text&quot;</span>,<span class="hljs-string">&quot;text&quot;</span>:<span class="hljs-string">&quot;Hi!&quot;</span>}]}}
{<span class="hljs-string">&quot;type&quot;</span>:<span class="hljs-string">&quot;user&quot;</span>,<span class="hljs-string">&quot;message&quot;</span>:{<span class="hljs-string">&quot;role&quot;</span>:<span class="hljs-string">&quot;user&quot;</span>,<span class="hljs-string">&quot;content&quot;</span>:<span class="hljs-string">&quot;Help me fix this bug&quot;</span>}}
<button class="copy-code-btn"></button></code></pre>
<h3 id="Session-message-types" class="common-anchor-header">Jenis pesan sesi</h3><p>File sesi mencatat semua yang terjadi selama interaksi dengan Claude Code. Untuk melakukan hal ini dengan jelas, ia menggunakan tipe pesan yang berbeda untuk berbagai jenis peristiwa.</p>
<ul>
<li><p><strong>Pesan pengguna</strong> mewakili input baru yang masuk ke dalam sistem. Ini tidak hanya mencakup apa yang diketikkan pengguna, tetapi juga hasil yang dikembalikan oleh alat, seperti output dari perintah shell. Dari sudut pandang AI, keduanya merupakan masukan yang perlu ditanggapi.</p></li>
<li><p><strong>Pesan asisten</strong> menangkap apa yang dilakukan Claude sebagai tanggapan. Pesan-pesan ini termasuk alasan AI, teks yang dihasilkannya, dan alat apa pun yang diputuskan untuk digunakan. Mereka juga mencatat detail penggunaan, seperti jumlah token, untuk memberikan gambaran lengkap tentang interaksi.</p></li>
<li><p><strong>Snapshot riwayat file</strong> adalah pos pemeriksaan keamanan yang dibuat sebelum Claude memodifikasi file apa pun. Dengan menyimpan status file asli terlebih dahulu, Claude Code memungkinkan untuk membatalkan perubahan jika terjadi kesalahan.</p></li>
<li><p><strong>Ringkasan</strong> memberikan gambaran ringkas tentang sesi dan terkait dengan hasil akhir. Ringkasan ini memudahkan untuk memahami tentang apa yang terjadi dalam sesi tanpa harus mengulang setiap langkah.</p></li>
</ul>
<p>Bersama-sama, jenis pesan ini tidak hanya merekam percakapan, tetapi juga seluruh rangkaian tindakan dan efek yang terjadi selama sesi berlangsung.</p>
<p>Untuk membuatnya lebih konkret, mari kita lihat contoh spesifik pesan pengguna dan pesan asisten.</p>
<p><strong>(1) Contoh pesan pengguna:</strong></p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>,
  <span class="hljs-string">&quot;uuid&quot;</span>: <span class="hljs-string">&quot;7d90e1c9-e727-4291-8eb9-0e7b844c4348&quot;</span>,
  <span class="hljs-string">&quot;parentUuid&quot;</span>: <span class="hljs-literal">null</span>,
  <span class="hljs-string">&quot;sessionId&quot;</span>: <span class="hljs-string">&quot;e5d52290-e2c1-41d6-8e97-371401502fdf&quot;</span>,
  <span class="hljs-string">&quot;timestamp&quot;</span>: <span class="hljs-string">&quot;2026-01-05T10:00:00.000Z&quot;</span>,
  <span class="hljs-string">&quot;message&quot;</span>: {
    <span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>,
    <span class="hljs-string">&quot;content&quot;</span>: <span class="hljs-string">&quot;Analyze the architecture of this project&quot;</span>
  },
  <span class="hljs-string">&quot;cwd&quot;</span>: <span class="hljs-string">&quot;/Users/xxx/project&quot;</span>,
  <span class="hljs-string">&quot;gitBranch&quot;</span>: <span class="hljs-string">&quot;main&quot;</span>,
  <span class="hljs-string">&quot;version&quot;</span>: <span class="hljs-string">&quot;2.0.76&quot;</span>
}
<button class="copy-code-btn"></button></code></pre>
<p><strong>(2) Contoh pesan asisten:</strong></p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;assistant&quot;</span>,
  <span class="hljs-string">&quot;uuid&quot;</span>: <span class="hljs-string">&quot;e684816e-f476-424d-92e3-1fe404f13212&quot;</span>,
  <span class="hljs-string">&quot;parentUuid&quot;</span>: <span class="hljs-string">&quot;7d90e1c9-e727-4291-8eb9-0e7b844c4348&quot;</span>,
  <span class="hljs-string">&quot;message&quot;</span>: {
    <span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;assistant&quot;</span>,
    <span class="hljs-string">&quot;model&quot;</span>: <span class="hljs-string">&quot;claude-opus-4-5-20251101&quot;</span>,
    <span class="hljs-string">&quot;content&quot;</span>: [
      {
        <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;thinking&quot;</span>,
        <span class="hljs-string">&quot;thinking&quot;</span>: <span class="hljs-string">&quot;The user wants to understand the project architecture, so I need to check the directory structure first...&quot;</span>
      },
      {
        <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;text&quot;</span>,
        <span class="hljs-string">&quot;text&quot;</span>: <span class="hljs-string">&quot;Let me take a look at the project structure first.&quot;</span>
      },
      {
        <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;tool_use&quot;</span>,
        <span class="hljs-string">&quot;id&quot;</span>: <span class="hljs-string">&quot;toolu_01ABC&quot;</span>,
        <span class="hljs-string">&quot;name&quot;</span>: <span class="hljs-string">&quot;Bash&quot;</span>,
        <span class="hljs-string">&quot;input&quot;</span>: {<span class="hljs-string">&quot;command&quot;</span>: <span class="hljs-string">&quot;ls -la&quot;</span>}
      }
    ],
    <span class="hljs-string">&quot;usage&quot;</span>: {
      <span class="hljs-string">&quot;input_tokens&quot;</span>: <span class="hljs-number">1500</span>,
      <span class="hljs-string">&quot;output_tokens&quot;</span>: <span class="hljs-number">200</span>,
      <span class="hljs-string">&quot;cache_read_input_tokens&quot;</span>: <span class="hljs-number">50000</span>
    }
  }
}
<button class="copy-code-btn"></button></code></pre>
<h3 id="How-Session-Messages-Are-Linked" class="common-anchor-header">Bagaimana Pesan Sesi Dikaitkan</h3><p>Claude Code tidak menyimpan pesan sesi sebagai entri yang terpisah. Sebaliknya, ia menghubungkan mereka bersama untuk membentuk rantai peristiwa yang jelas. Setiap pesan menyertakan pengenal unik (<code translate="no">uuid</code>) dan referensi ke pesan yang datang sebelumnya (<code translate="no">parentUuid</code>). Hal ini memungkinkan untuk melihat tidak hanya apa yang terjadi, tetapi juga mengapa hal itu terjadi.</p>
<p>Sesi dimulai dengan pesan pengguna, yang memulai rantai. Setiap balasan dari Claude menunjuk kembali ke pesan yang menyebabkannya. Pemanggilan alat dan keluarannya ditambahkan dengan cara yang sama, dengan setiap langkah yang terkait dengan langkah sebelumnya. Ketika sesi berakhir, ringkasan dilampirkan pada pesan terakhir.</p>
<p>Karena setiap langkah terhubung, Claude Code dapat memutar ulang seluruh urutan tindakan dan memahami bagaimana sebuah hasil dihasilkan, sehingga debugging dan analisis menjadi lebih mudah.</p>
<h2 id="Making-Code-Changes-Easy-to-Undo-with-File-Snapshots" class="common-anchor-header">Membuat Perubahan Kode Mudah Dibatalkan dengan Snapshot File<button data-href="#Making-Code-Changes-Easy-to-Undo-with-File-Snapshots" class="anchor-icon" translate="no">
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
    </button></h2><p>Pengeditan yang dihasilkan AI tidak selalu benar, dan terkadang pengeditan tersebut mengarah ke arah yang salah. Untuk membuat perubahan ini aman untuk bereksperimen, Claude Code menggunakan sistem snapshot sederhana yang memungkinkan Anda membatalkan pengeditan tanpa harus menggali perbedaan atau membersihkan file secara manual.</p>
<p>Idenya sangat mudah: <strong>sebelum Claude Code memodifikasi sebuah berkas, ia menyimpan salinan konten aslinya.</strong> Jika pengeditan ternyata salah, sistem dapat mengembalikan versi sebelumnya secara instan.</p>
<h3 id="What-is-a-file-history-snapshot" class="common-anchor-header">Apa yang dimaksud dengan <em>cuplikan riwayat file</em>?</h3><p>Cuplikan <em>riwayat file</em> adalah pos pemeriksaan yang dibuat sebelum file dimodifikasi. Snapshot ini merekam konten asli dari setiap file yang akan diedit oleh <strong>Claude</strong>. Snapshot ini berfungsi sebagai sumber data untuk operasi pembatalan dan pengembalian.</p>
<p>Ketika pengguna mengirim pesan yang mungkin mengubah file, <strong>Claude Code</strong> membuat snapshot kosong untuk pesan tersebut. Sebelum mengedit, sistem mencadangkan konten asli setiap file target ke dalam snapshot, lalu menerapkan hasil edit langsung ke disk. Jika pengguna memicu <em>pembatalan</em>, <strong>Claude Code</strong> mengembalikan konten yang tersimpan dan menimpa file yang dimodifikasi.</p>
<p>Dalam praktiknya, siklus hidup pengeditan yang dapat dibatalkan terlihat seperti ini:</p>
<ol>
<li><p><strong>Pengguna mengirimkan pesanClaude</strong>Code membuat catatan <code translate="no">file-history-snapshot</code> yang baru dan kosong.</p></li>
<li><p><strong>Claude bersiap untuk memodifikasi fileSistem</strong>mengidentifikasi file mana yang akan diedit dan mencadangkan konten aslinya ke dalam <code translate="no">trackedFileBackups</code>.</p></li>
<li><p><strong>Claude mengeksekusi</strong>operasi<strong>editEdit</strong>dan tulis dilakukan, dan konten yang dimodifikasi ditulis ke disk.</p></li>
<li><p><strong>Pengguna memicu</strong>pembatalanPengguna menekan <strong>Esc + Esc</strong>, menandakan bahwa perubahan harus dikembalikan.</p></li>
<li><p><strong>Konten asli dikembalikanClaude</strong>Code membaca konten yang disimpan dari <code translate="no">trackedFileBackups</code> dan menimpa file saat ini, menyelesaikan undo.</p></li>
</ol>
<h3 id="Why-Undo-Works-Snapshots-Save-the-Old-Version" class="common-anchor-header">Mengapa Urungkan Bekerja: Jepretan Menyimpan Versi Lama</h3><p>Undo di Claude Code berfungsi karena sistem menyimpan konten file <em>asli</em> sebelum pengeditan terjadi.</p>
<p>Alih-alih mencoba membalikkan perubahan setelah fakta, Claude Code mengambil pendekatan yang lebih sederhana: menyalin file seperti yang ada <em>sebelum</em> modifikasi dan menyimpan salinan itu di <code translate="no">trackedFileBackups</code>. Ketika pengguna memicu pembatalan, sistem akan mengembalikan versi yang tersimpan ini dan menimpa file yang diedit.</p>
<p>Diagram di bawah ini menunjukkan alur ini langkah demi langkah:</p>
<pre><code translate="no">┌─────────────────────────┐
│    before edit,  app.py │
│    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;old&quot;</span>)         │───────→  Backed up into snapshot trackedFileBackups
└─────────────────────────┘

↓

┌──────────────────────────┐
│   After Claude edits     │
│    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;new&quot;</span>)          │───────→  Written to disk (overwrites the original file)
└──────────────────────────┘

↓

┌──────────────────────────┐
│    User triggers undo    │
│    Press   Esc + Esc     │───────→ Restore <span class="hljs-string">&quot;old&quot;</span> content to disk <span class="hljs-keyword">from</span> snapshot
└──────────────────────────┘
<button class="copy-code-btn"></button></code></pre>
<h3 id="What-a-file-History-snapshot-Looks-Like-Internally" class="common-anchor-header">Seperti Apa <em>Snapshot Riwayat File</em> Secara Internal</h3><p>Snapshot itu sendiri disimpan sebagai catatan terstruktur. Snapshot ini menangkap metadata tentang pesan pengguna, waktu pengambilan snapshot, dan-yang paling penting-peta file ke konten aslinya.</p>
<p>Contoh di bawah ini menunjukkan satu catatan <code translate="no">file-history-snapshot</code> yang dibuat sebelum Claude mengedit file apa pun. Setiap entri di <code translate="no">trackedFileBackups</code> menyimpan konten <em>pra-edit</em> dari sebuah file, yang kemudian digunakan untuk mengembalikan file tersebut selama pembatalan.</p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;file-history-snapshot&quot;</span>,
  <span class="hljs-string">&quot;messageId&quot;</span>: <span class="hljs-string">&quot;7d90e1c9-e727-4291-8eb9-0e7b844c4348&quot;</span>,
  <span class="hljs-string">&quot;snapshot&quot;</span>: {
    <span class="hljs-string">&quot;messageId&quot;</span>: <span class="hljs-string">&quot;7d90e1c9-e727-4291-8eb9-0e7b844c4348&quot;</span>,
    <span class="hljs-string">&quot;trackedFileBackups&quot;</span>: {
      <span class="hljs-string">&quot;/path/to/file1.py&quot;</span>: <span class="hljs-string">&quot;Original file content\ndef hello():\n    print(&#x27;old&#x27;)&quot;</span>,
      <span class="hljs-string">&quot;/path/to/file2.js&quot;</span>: <span class="hljs-string">&quot;// Original content...&quot;</span>
    },
    <span class="hljs-string">&quot;timestamp&quot;</span>: <span class="hljs-string">&quot;2026-01-05T10:00:00.000Z&quot;</span>
  },
  <span class="hljs-string">&quot;isSnapshotUpdate&quot;</span>: <span class="hljs-literal">false</span>
}
<button class="copy-code-btn"></button></code></pre>
<h3 id="Where-Snapshots-Are-Stored-and-How-Long-They-Are-Kept" class="common-anchor-header">Di mana Snapshot Disimpan dan Berapa Lama Disimpan</h3><ul>
<li><p><strong>Tempat penyimpanan metadata snapshot</strong>: Catatan snapshot terikat pada sesi tertentu dan disimpan sebagai file JSONL di bawah<code translate="no">~/.claude/projects/-path-to-project/{session-id}.jsonl</code>.</p></li>
<li><p><strong>Di mana konten file asli dicadangkan</strong>: Konten pra-edit dari setiap file disimpan secara terpisah dengan hash konten di bawah<code translate="no">~/.claude/file-history/{content-hash}/</code>.</p></li>
<li><p><strong>Berapa lama snapshot disimpan secara default</strong>: Data snapshot disimpan selama 30 hari, konsisten dengan pengaturan global <code translate="no">cleanupPeriodDays</code>.</p></li>
<li><p><strong>Cara mengubah periode penyimpanan</strong>: Jumlah hari penyimpanan dapat disesuaikan melalui bidang <code translate="no">cleanupPeriodDays</code> di <code translate="no">~/.claude/settings.json</code>.</p></li>
</ul>
<h3 id="Related-Commands" class="common-anchor-header">Perintah Terkait</h3><table>
<thead>
<tr><th>Perintah / Tindakan</th><th>Deskripsi</th></tr>
</thead>
<tbody>
<tr><td>Esc + Esc</td><td>Membatalkan pengeditan berkas yang terakhir dilakukan (paling sering digunakan)</td></tr>
<tr><td>/rewind</td><td>Kembali ke titik pemeriksaan yang telah ditentukan sebelumnya (snapshot)</td></tr>
<tr><td>/diff</td><td>Melihat perbedaan antara file saat ini dan cadangan snapshot</td></tr>
</tbody>
</table>
<h2 id="Other-Important-Directories" class="common-anchor-header">Direktori Penting Lainnya<button data-href="#Other-Important-Directories" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>(1) plugins/ - Manajemen Pengaya</strong></p>
<p>Direktori <code translate="no">plugins/</code> menyimpan pengaya yang memberikan kemampuan tambahan pada Claude Code.</p>
<p>Direktori ini menyimpan <em>pengaya</em> mana yang diinstal, dari mana asalnya, dan kemampuan ekstra yang diberikan pengaya tersebut. Direktori ini juga menyimpan salinan lokal dari pengaya yang telah diunduh sehingga tidak perlu diambil lagi.</p>
<pre><code translate="no">~/.claude/plugins/
├── config.json
│   Global plugin configuration (e.g., <span class="hljs-built_in">enable</span>/disable rules)
├── installed_plugins.json
│   List of installed plugins (including version and status)
├── known_marketplaces.json
│   Plugin marketplace <span class="hljs-built_in">source</span> configuration (e.g., Anthropic official marketplace)
├── cache/
│   Plugin download cache (avoids repeated downloads)
└── marketplaces/
    Marketplace <span class="hljs-built_in">source</span> storage
    └── anthropic-agent-skills/
        Official plugin marketplace
        ├── .claude-plugin/
        │   └── marketplace.json
        │       Marketplace metadata
        └── skills/
            Skills provided by the marketplace
            ├── pdf/
            │   PDF-related skills
            ├── docx/
            │   Word document processing skills
            └── frontend-design/
                Frontend design skills
<button class="copy-code-btn"></button></code></pre>
<p><strong>(2) keterampilan/ - Tempat Keterampilan Disimpan dan Diterapkan</strong></p>
<p>Dalam Claude Code, keterampilan adalah kemampuan kecil yang dapat digunakan kembali yang membantu Claude melakukan tugas tertentu, seperti bekerja dengan PDF, mengedit dokumen, atau mengikuti alur kerja pengkodean.</p>
<p>Tidak semua keterampilan tersedia di semua tempat. Beberapa berlaku secara global, sementara yang lain terbatas pada satu proyek atau disediakan oleh plugin. Claude Code menyimpan keterampilan di lokasi yang berbeda untuk mengontrol di mana setiap keterampilan dapat digunakan.</p>
<p>Hirarki di bawah ini menunjukkan bagaimana keterampilan berlapis berdasarkan ruang lingkup, dari keterampilan yang tersedia secara global hingga keterampilan khusus proyek dan yang disediakan oleh plugin.</p>
<table>
<thead>
<tr><th>Tingkat</th><th>Lokasi Penyimpanan</th><th>Deskripsi</th></tr>
</thead>
<tbody>
<tr><td>Pengguna</td><td>~/.claude/skills/</td><td>Tersedia secara global, dapat diakses oleh semua proyek</td></tr>
<tr><td>Proyek</td><td>project/.claude/skills/</td><td>Hanya tersedia untuk proyek saat ini, kustomisasi khusus untuk proyek</td></tr>
<tr><td>Plugin</td><td>~/.claude/plugins/marketplaces/*/skills/</td><td>Diinstal dengan plugin, tergantung pada status pengaktifan plugin</td></tr>
</tbody>
</table>
<p><strong>(3) todos/ - Penyimpanan Daftar Tugas</strong></p>
<p>Direktori <code translate="no">todos/</code> menyimpan daftar tugas yang dibuat Claude untuk melacak pekerjaan selama percakapan, seperti langkah-langkah yang harus diselesaikan, item yang sedang dikerjakan, dan tugas yang sudah selesai.</p>
<p>Daftar tugas disimpan sebagai file JSON di bawah<code translate="no">~/.claude/todos/{session-id}-*.json</code>. Setiap nama file menyertakan ID sesi, yang menghubungkan daftar tugas ke percakapan tertentu.</p>
<p>Isi dari file-file ini berasal dari alat <code translate="no">TodoWrite</code> dan mencakup informasi tugas dasar seperti deskripsi tugas, status saat ini, prioritas, dan metadata terkait.</p>
<p><strong>(4) local/ - Runtime dan Alat Lokal</strong></p>
<p>Direktori <code translate="no">local/</code> menyimpan berkas-berkas inti yang dibutuhkan oleh Claude Code untuk dijalankan pada mesin Anda.</p>
<p>Ini termasuk file yang dapat dieksekusi pada baris perintah <code translate="no">claude</code> dan direktori <code translate="no">node_modules/</code> yang berisi ketergantungan runtime. Dengan menjaga komponen-komponen ini tetap lokal, Claude Code dapat berjalan secara independen, tanpa bergantung pada layanan eksternal atau instalasi di seluruh sistem.</p>
<p><strong>(5) Direktori Pendukung Tambahan</strong></p>
<ul>
<li><p><strong>shell-snapshots/:</strong> Menyimpan snapshot status sesi shell (seperti direktori saat ini dan variabel lingkungan), yang memungkinkan rollback operasi shell.</p></li>
<li><p><strong>plans/:</strong> Menyimpan rencana eksekusi yang dihasilkan oleh Mode Rencana (misalnya, rincian langkah demi langkah dari tugas pemrograman multi-langkah).</p></li>
<li><p><strong>statsig/:</strong> Tembolok menampilkan konfigurasi flag (seperti apakah fitur baru diaktifkan) untuk mengurangi permintaan yang berulang-ulang.</p></li>
<li><p><strong>telemetry/:</strong> Menyimpan data telemetri anonim (seperti frekuensi penggunaan fitur) untuk pengoptimalan produk.</p></li>
<li><p><strong>debug/:</strong> Menyimpan log debug (termasuk tumpukan kesalahan dan jejak eksekusi) untuk membantu pemecahan masalah.</p></li>
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
    </button></h2><p>Setelah menggali bagaimana Claude Code menyimpan dan mengelola semuanya secara lokal, gambarannya menjadi cukup jelas: alat ini terasa stabil karena fondasinya kokoh. Tidak ada yang mewah - hanya rekayasa yang bijaksana. Setiap proyek memiliki ruangnya sendiri, setiap tindakan dituliskan, dan suntingan file dicadangkan sebelum ada perubahan. Ini adalah jenis desain yang diam-diam melakukan tugasnya dan memungkinkan Anda untuk fokus pada pekerjaan Anda.</p>
<p>Yang paling saya sukai adalah tidak ada hal mistis yang terjadi di sini. Claude Code bekerja dengan baik karena dasar-dasarnya dilakukan dengan benar. Jika Anda pernah mencoba membuat agen yang menyentuh berkas nyata, Anda tahu betapa mudahnya segala sesuatunya berantakan - status bercampur aduk, crash menghapus progres, dan membatalkannya hanya bisa ditebak. Claude Code menghindari semua itu dengan model penyimpanan yang sederhana, konsisten, dan sulit dipecahkan.</p>
<p>Untuk tim yang membangun agen AI lokal atau on-prem, terutama di lingkungan yang aman, pendekatan ini menunjukkan bagaimana penyimpanan yang kuat dan ketekunan membuat alat AI dapat diandalkan dan praktis untuk pengembangan sehari-hari.</p>
<p>Jika Anda sedang merancang agen AI lokal atau on-prem dan ingin mendiskusikan arsitektur penyimpanan, desain sesi, atau rollback yang aman secara lebih mendetail, jangan ragu untuk bergabung dengan <a href="https://milvusio.slack.com/join/shared_invite/zt-3nntzngkz-gYwhrdSE4~76k0VMyBfD1Q#/shared-invite/email">saluran Slack</a> kami, Anda juga dapat memesan sesi one-on-one selama 20 menit melalui <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">Milvus Office Hours</a> untuk mendapatkan panduan yang disesuaikan.</p>
