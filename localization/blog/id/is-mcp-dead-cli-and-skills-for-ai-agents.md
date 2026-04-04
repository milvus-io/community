---
id: is-mcp-dead-cli-and-skills-for-ai-agents.md
title: >-
  Apakah MCP Sudah Mati? Apa yang Kami Pelajari dalam Membangun dengan MCP, CLI,
  dan Keterampilan Agen
author: Cheney Zhang
date: 2026-4-1
cover: assets.zilliz.com/mcp_dead_a23ff23c27.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  MCP protocol, AI agent tooling, agent skills, model context protocol, CLI
  tools
meta_title: |
  Is MCP Dead? MCP vs CLI vs Agent Skills Compared
desc: >-
  MCP memakan konteks, menghentikan produksi, dan tidak dapat menggunakan
  kembali LLM agen Anda. Kami membangun dengan ketiganya - inilah saat yang
  tepat untuk masing-masingnya.
origin: 'https://milvus.io/blog/is-mcp-dead-cli-and-skills-for-ai-agents.md'
---
<p>Ketika CTO Perplexity, Denis Yarats, mengatakan di ASK 2026 bahwa perusahaannya tidak memprioritaskan MCP secara internal, hal itu memicu siklus yang biasa terjadi. CEO YC Garry Tan menumpuk - MCP memakan terlalu banyak jendela konteks, auth rusak, dia membangun pengganti CLI dalam 30 menit. Hacker News sangat anti terhadap MCP.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/is_mcp_dead_cli_and_skills_for_ai_agents_md_1_4e49d13991.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/is_mcp_dead_cli_and_skills_for_ai_agents_md_2_7dc46108c1.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Setahun yang lalu, tingkat skeptisisme publik seperti ini tidak biasa. Model Context Protocol (MCP) diposisikan sebagai standar definitif untuk integrasi alat <a href="https://zilliz.com/glossary/ai-agents">agen AI</a>. Jumlah server meningkat dua kali lipat setiap minggu. Pola yang terjadi sejak saat itu mengikuti pola yang sudah dikenal: hype yang cepat, adopsi yang luas, kemudian kekecewaan produksi.</p>
<p>Industri ini merespons dengan cepat. Lark/Feishu dari Bytedance membuka sumber CLI resmi mereka - 200+ perintah di 11 domain bisnis dengan 19 Keterampilan Agen bawaan. Google mengirimkan gws untuk Google Workspace. Pola CLI + Keterampilan dengan cepat menjadi standar untuk perkakas agen perusahaan, bukan alternatif khusus.</p>
<p>Di Zilliz, kami telah merilis <a href="https://docs.zilliz.com/reference/cli/overview">Zilliz CLI</a>, yang memungkinkan Anda mengoperasikan dan mengelola <a href="https://milvus.io/intro">Milvus</a> dan <a href="https://zilliz.com/cloud">Zilliz Cloud</a> (Milvus yang dikelola sepenuhnya) langsung dari terminal Anda tanpa meninggalkan lingkungan pengkodean. Selain itu, kami membangun <a href="https://milvus.io/docs/milvus_for_agents.md">Milvus Skills</a> dan <a href="https://docs.zilliz.com/docs/agents/zilliz-skill">Zilliz Skills</a>sehingga agen pengkodean AI seperti Claude Code dan Codex dapat mengelola <a href="https://zilliz.com/learn/what-is-vector-database">basis data vektor</a> Anda melalui bahasa alami.</p>
<p>Kami juga membangun server MCP untuk Milvus dan Zilliz Cloud satu tahun yang lalu. Pengalaman tersebut mengajarkan kami dengan tepat di mana MCP rusak - dan di mana ia masih cocok. Tiga batasan arsitektur mendorong kami ke arah CLI dan Skills: jendela konteks yang membengkak, desain alat pasif, dan ketidakmampuan untuk menggunakan kembali LLM milik agen.</p>
<p>Dalam tulisan ini, kita akan membahas setiap masalah, menunjukkan apa yang kita bangun, dan menyusun kerangka kerja praktis untuk memilih antara MCP, CLI, dan Agent Skills.</p>
<h2 id="MCP-Eats-72-of-Your-Context-Window-at-Startup" class="common-anchor-header">MCP Memakan 72% Jendela Konteks Anda saat Startup<button data-href="#MCP-Eats-72-of-Your-Context-Window-at-Startup" class="anchor-icon" translate="no">
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
    </button></h2><p>Penyiapan MCP standar dapat menghabiskan sekitar 72% dari jendela konteks yang tersedia sebelum agen melakukan satu tindakan pun. Hubungkan tiga server - GitHub, Playwright, dan integrasi IDE - pada model 200K-token, dan definisi alat saja menghabiskan sekitar 143K token. Agen belum melakukan apa pun. Sudah tiga perempat penuh.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/is_mcp_dead_cli_and_skills_for_ai_agents_md_3_767d46c583.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Biayanya bukan hanya token. Semakin banyak konten yang tidak terkait yang dikemas ke dalam konteks, semakin lemah fokus model pada apa yang sebenarnya penting. Seratus skema alat yang berada dalam konteks berarti agen mengarungi semuanya dalam setiap keputusan. Para peneliti telah mendokumentasikan apa yang mereka sebut sebagai pembusukan <em>konteks</em> - penurunan kualitas penalaran akibat kelebihan konteks. Dalam pengujian yang terukur, akurasi pemilihan alat turun dari 43% menjadi di bawah 14% seiring dengan bertambahnya jumlah alat. Lebih banyak alat, secara paradoks, berarti penggunaan alat yang lebih buruk.</p>
<p>Akar penyebabnya adalah arsitektural. MCP memuat semua deskripsi alat secara penuh pada awal sesi, terlepas dari apakah percakapan saat ini akan menggunakannya. Itu adalah pilihan desain tingkat protokol, bukan bug - tetapi biayanya meningkat dengan setiap alat yang Anda tambahkan.</p>
<p>Keterampilan agen mengambil pendekatan yang berbeda: <strong>pengungkapan progresif</strong>. Pada awal sesi, agen hanya membaca metadata setiap Skill - nama, deskripsi satu baris, kondisi pemicu. Total beberapa lusin token. Konten Skill secara lengkap dimuat hanya ketika agen menentukan bahwa itu relevan. Pikirkan seperti ini: MCP membariskan setiap alat di depan pintu dan membuat Anda memilih; Keterampilan memberi Anda indeks terlebih dahulu, konten lengkap sesuai permintaan.</p>
<p>Alat bantu CLI menawarkan keuntungan yang serupa. Seorang agen menjalankan git --help atau docker --help untuk menemukan kemampuan sesuai permintaan, tanpa melakukan pramuat pada setiap definisi parameter. Biaya konteks adalah bayar sesuai penggunaan, bukan di muka.</p>
<p>Pada skala kecil, perbedaannya dapat diabaikan. Pada skala produksi, ini adalah perbedaan antara agen yang bekerja dan agen yang tenggelam dalam definisi alatnya sendiri.</p>
<h2 id="MCPs-Passive-Architecture-Limits-Agent-Workflows" class="common-anchor-header">Arsitektur Pasif MCP Membatasi Alur Kerja Agen<button data-href="#MCPs-Passive-Architecture-Limits-Agent-Workflows" class="anchor-icon" translate="no">
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
    </button></h2><p>MCP adalah protokol pemanggilan alat: cara menemukan alat, memanggilnya, dan menerima hasil. Desain yang bersih untuk kasus penggunaan yang sederhana. Namun, kebersihan itu juga merupakan kendala.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/is_mcp_dead_cli_and_skills_for_ai_agents_md_4_f80de07814.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Flat-Tool-Space-with-No-Hierarchy" class="common-anchor-header">Ruang Alat Datar Tanpa Hirarki</h3><p>Alat MCP adalah tanda tangan fungsi yang datar. Tidak ada subperintah, tidak ada kesadaran akan siklus hidup sesi, tidak ada rasa di mana agen berada dalam alur kerja multi-langkah. Alat ini menunggu untuk dipanggil. Hanya itu yang dilakukannya.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/is_mcp_dead_cli_and_skills_for_ai_agents_md_5_e7f3630e1f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>CLI bekerja dengan cara yang berbeda. git commit, git push, dan git log adalah jalur eksekusi yang sama sekali berbeda yang berbagi satu antarmuka. Seorang agen menjalankan --help, menjelajahi permukaan yang tersedia secara bertahap, dan hanya memperluas apa yang dibutuhkannya - tanpa memuat semua dokumentasi parameter ke dalam konteks.</p>
<h3 id="Skills-Encode-Workflow-Logic--MCP-Cant" class="common-anchor-header">Keterampilan Menyandikan Logika Alur Kerja - MCP Tidak Bisa</h3><p>Keterampilan Agen adalah file Markdown yang berisi prosedur operasi standar: apa yang harus dilakukan pertama kali, apa yang harus dilakukan selanjutnya, bagaimana menangani kegagalan, dan kapan harus menampilkan sesuatu kepada pengguna. Agen tidak hanya menerima sebuah alat tetapi juga seluruh alur kerja. Keterampilan secara aktif membentuk bagaimana seorang agen berperilaku selama percakapan - apa yang memicu mereka, apa yang mereka persiapkan sebelumnya, dan bagaimana mereka pulih dari kesalahan. Alat MCP hanya bisa menunggu.</p>
<h3 id="MCP-Cant-Access-the-Agents-LLM" class="common-anchor-header">MCP Tidak Dapat Mengakses LLM Agen</h3><p>Ini adalah batasan yang benar-benar menghentikan kami.</p>
<p>Ketika kami membuat <a href="https://github.com/zilliztech/claude-context">claude-context</a> - sebuah plugin MCP yang menambahkan <a href="https://zilliz.com/glossary/semantic-search">pencarian semantik</a> ke Claude Code dan agen pengkodean AI lainnya, memberikan mereka konteks yang mendalam dari seluruh basis kode - kami ingin mengambil cuplikan percakapan historis yang relevan dari Milvus dan memunculkannya sebagai konteks. Pengambilan <a href="https://zilliz.com/learn/vector-similarity-search">pencarian vektor</a> berhasil. Masalahnya adalah apa yang harus dilakukan dengan hasilnya.</p>
<p>Ambil 10 hasil teratas, dan mungkin 3 di antaranya berguna. Tujuh lainnya adalah noise. Berikan ke-10 hasil tersebut kepada agen luar, dan noise akan mengganggu jawaban. Dalam pengujian, kami melihat jawaban terganggu oleh catatan historis yang tidak relevan. Kami perlu menyaring sebelum meneruskan hasilnya.</p>
<p>Kami mencoba beberapa pendekatan. Menambahkan langkah pemeringkatan ulang di dalam server MCP menggunakan model kecil: tidak cukup akurat, dan ambang batas relevansi membutuhkan penyetelan per kasus penggunaan. Menggunakan model besar untuk perankingan ulang: secara teknis bagus, tetapi server MCP berjalan sebagai proses terpisah tanpa akses ke LLM agen luar. Kami harus mengonfigurasi klien LLM yang terpisah, mengelola kunci API yang terpisah, dan menangani jalur panggilan yang terpisah.</p>
<p>Yang kami inginkan adalah sederhana: biarkan LLM agen luar berpartisipasi secara langsung dalam keputusan pemfilteran. Ambil 10 teratas, biarkan agen itu sendiri yang menilai apa yang layak disimpan, dan kembalikan hanya hasil yang relevan. Tidak ada model kedua. Tidak ada kunci API tambahan.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/is_mcp_dead_cli_and_skills_for_ai_agents_md_6_aca200f359.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>MCP tidak bisa melakukan ini. Batas proses antara server dan agen juga merupakan batas intelijen. Server tidak dapat menggunakan LLM agen; agen tidak dapat mengatur apa yang terjadi di dalam server. Baik untuk alat CRUD sederhana. Pada saat sebuah alat perlu membuat keputusan, isolasi tersebut menjadi kendala yang nyata.</p>
<p>Keterampilan Agen menyelesaikan hal ini secara langsung. Keterampilan pengambilan dapat memanggil pencarian vektor untuk 10 besar, meminta LLM agen menilai relevansi, dan mengembalikan hanya yang lolos. Tidak ada model tambahan. Agen melakukan pemfilteran itu sendiri.</p>
<h2 id="What-We-Built-Instead-with-CLI-and-Skills" class="common-anchor-header">Apa yang Kami Bangun dengan CLI dan Keterampilan<button data-href="#What-We-Built-Instead-with-CLI-and-Skills" class="anchor-icon" translate="no">
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
    </button></h2><p>Kami melihat CLI + Skills sebagai arahan untuk interaksi agen-perangkat - tidak hanya untuk pengambilan memori, tetapi juga di seluruh stack. Keyakinan ini mendorong semua yang kami bangun.</p>
<h3 id="memsearch-A-Skills-Based-Memory-Layer-for-AI-Agents" class="common-anchor-header">memsearch: Lapisan Memori Berbasis Keterampilan untuk Agen AI</h3><p>Kami membangun <a href="https://github.com/zilliztech/memsearch">memsearch</a>, sebuah lapisan memori sumber terbuka untuk Claude Code dan agen AI lainnya. Skill berjalan di dalam subagent dengan tiga tahap: Milvus menangani pencarian vektor awal untuk penemuan yang luas, LLM agen itu sendiri mengevaluasi relevansi dan memperluas konteks untuk mendapatkan hasil yang menjanjikan, dan penelusuran akhir mengakses percakapan asli hanya jika diperlukan. Noise akan dibuang pada setiap tahap - sampah pencarian menengah tidak pernah mencapai jendela konteks utama.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/is_mcp_dead_cli_and_skills_for_ai_agents_md_7_7c85103513.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Wawasan utama: kecerdasan agen adalah bagian dari eksekusi alat ini. LLM yang sudah ada di dalam loop melakukan pemfilteran - tidak ada model kedua, tidak ada kunci API tambahan, tidak ada penyetelan ambang batas yang rapuh. Ini adalah kasus penggunaan khusus - pengambilan konteks percakapan untuk agen pengkodean - tetapi arsitekturnya menggeneralisasi skenario apa pun di mana alat membutuhkan penilaian, bukan hanya eksekusi.</p>
<h3 id="Zilliz-CLI-Skills-and-Plugin-for-Vector-Database-Operations" class="common-anchor-header">Zilliz CLI, Keterampilan, dan Plugin untuk Operasi Basis Data Vektor</h3><p>Milvus adalah basis data vektor sumber terbuka yang paling banyak diadopsi di dunia dengan <a href="https://github.com/milvus-io/milvus">43 ribu lebih bintang di GitHub</a>. <a href="https://zilliz.com/cloud">Zilliz Cloud</a> adalah layanan yang dikelola sepenuhnya oleh Milvus dengan fitur-fitur perusahaan tingkat lanjut dan jauh lebih cepat daripada Milvus.</p>
<p>Arsitektur berlapis yang sama yang disebutkan di atas menggerakkan alat pengembang kami:</p>
<ul>
<li><a href="https://docs.zilliz.com/reference/cli/overview">Zilliz CLI</a> adalah lapisan infrastruktur. Manajemen cluster, <a href="https://milvus.io/docs/manage-collections.md">operasi pengumpulan</a>, pencarian vektor, <a href="https://milvus.io/docs/rbac.md">RBAC</a>, pencadangan, penagihan - semua yang Anda lakukan di konsol Zilliz Cloud, tersedia dari terminal. Manusia dan agen menggunakan perintah yang sama. Zilliz CLI juga berfungsi sebagai fondasi untuk Milvus Skills dan Zilliz Skills.</li>
<li><a href="https://milvus.io/docs/milvus_for_agents.md">Milvus Skill</a> adalah lapisan pengetahuan untuk Milvus sumber terbuka. Ini mengajarkan agen pengkodean AI (Claude Code, Cursor, Codex, GitHub Copilot) untuk mengoperasikan penerapan Milvus apa pun - <a href="https://milvus.io/docs/milvus_lite.md">Milvus Lite</a>, Mandiri, atau Terdistribusi - melalui kode Python <a href="https://milvus.io/docs/install-pymilvus.md">pymilvus</a>: koneksi, <a href="https://milvus.io/docs/schema-hands-on.md">desain skema</a>, CRUD, <a href="https://zilliz.com/learn/hybrid-search-with-milvus">pencarian hibrida</a>, <a href="https://milvus.io/docs/full-text-search.md">pencarian teks lengkap</a>, <a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">pipa RAG</a>.</li>
<li><a href="https://docs.zilliz.com/docs/agents/zilliz-skill">Zilliz Skill</a> melakukan hal yang sama untuk Zilliz Cloud, mengajarkan agen untuk mengelola infrastruktur cloud melalui Zilliz CLI.</li>
<li><a href="https://github.com/zilliztech/zilliz-plugin">Plugin Zilliz</a> adalah lapisan pengalaman pengembang untuk Claude Code - membungkus CLI + Skill menjadi pengalaman yang dipandu dengan perintah garis miring seperti /zilliz: quickstart dan /zilliz: status.</li>
</ul>
<p>CLI menangani eksekusi, Keterampilan menyandikan pengetahuan dan logika alur kerja, Plugin memberikan UX. Tidak ada server MCP di dalam loop.</p>
<p>Untuk lebih jelasnya, lihat sumber-sumber ini:</p>
<ul>
<li><a href="https://zilliz.com/blog/introducing-zilliz-cli-and-agent-skills-for-zilliz-cloud">Memperkenalkan Zilliz CLI dan Keterampilan Agen untuk Zilliz Cloud</a></li>
<li><a href="https://zilliz.com/blog/zilliz-cloud-just-landed-in-claude-code">Zilliz Cloud Baru Saja Mendarat di Kode Claude</a></li>
<li><a href="https://docs.zilliz.com/docs/agents/zilliz-ai-prompts">Petunjuk AI - Pusat Pengembang Zilliz Cloud</a></li>
<li><a href="https://docs.zilliz.com/reference/cli/overview">Referensi CLI Zilliz - Pusat Pengembang Zilliz Cloud</a></li>
<li><a href="https://docs.zilliz.com/docs/agents/zilliz-skill">Zilliz Skill - Zilliz Cloud Developer Hub</a></li>
<li><a href="https://milvus.io/docs/milvus_for_agents.md">Milvus untuk Agen AI - Dokumentasi Milvus</a></li>
</ul>
<h2 id="Is-MCP-Actually-Dying" class="common-anchor-header">Apakah MCP Benar-Benar Sekarat?<button data-href="#Is-MCP-Actually-Dying" class="anchor-icon" translate="no">
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
    </button></h2><p>Banyak pengembang dan perusahaan termasuk kami di Zilliz beralih ke CLI dan Skill. Tetapi apakah MCP benar-benar sekarat?</p>
<p>Jawaban singkatnya: tidak - tetapi cakupannya menyempit ke tempat yang sebenarnya.</p>
<p>MCP telah disumbangkan ke Linux Foundation. Server aktif berjumlah lebih dari 10.000. Pengunduhan bulanan SDK mencapai 97 juta. Ekosistem sebesar itu tidak akan hilang hanya karena sebuah komentar di konferensi.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/is_mcp_dead_cli_and_skills_for_ai_agents_md_8_b2246e6825.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Sebuah thread Hacker News - <em>"Kapan MCP masuk akal vs CLI?"</em> - mendapatkan tanggapan yang sebagian besar mendukung CLI: "Alat CLI seperti instrumen presisi," "CLI juga terasa lebih tajam daripada MCP." Beberapa pengembang memiliki pandangan yang lebih seimbang: Keterampilan adalah resep terperinci yang membantu Anda memecahkan masalah dengan lebih baik; MCP adalah alat yang membantu Anda memecahkan masalah. Keduanya memiliki tempatnya masing-masing.</p>
<p>Itu adil - tetapi menimbulkan pertanyaan praktis. Jika resep itu sendiri dapat mengarahkan agen tentang alat mana yang akan digunakan dan bagaimana caranya, apakah protokol distribusi alat yang terpisah masih diperlukan?</p>
<p>Itu tergantung pada kasus penggunaannya.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/is_mcp_dead_cli_and_skills_for_ai_agents_md_9_e2cb28812b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>MCP di atas stdio</strong> - versi yang dijalankan oleh sebagian besar pengembang secara lokal - adalah tempat menumpuknya masalah: komunikasi antar proses yang tidak stabil, isolasi lingkungan yang berantakan, biaya token yang tinggi. Dalam konteks tersebut, alternatif yang lebih baik ada untuk hampir setiap kasus penggunaan.</p>
<p><strong>MCP melalui HTTP</strong> adalah cerita yang berbeda. Platform perkakas internal perusahaan membutuhkan manajemen izin terpusat, OAuth terpadu, telemetri dan pencatatan standar. Alat CLI yang terfragmentasi benar-benar berjuang untuk menyediakan ini. Arsitektur terpusat MCP memiliki nilai nyata dalam konteks tersebut.</p>
<p>Apa yang sebenarnya dijatuhkan oleh Perplexity adalah kasus penggunaan stdio. Denis Yarats menetapkan "secara internal" dan tidak menyerukan adopsi pilihan tersebut secara luas di seluruh industri. Nuansa itu hilang dalam transmisi - "Perplexity meninggalkan MCP" menyebar jauh lebih cepat daripada "Perplexity mendahulukan MCP daripada stdio untuk integrasi alat internal."</p>
<p>MCP muncul karena memecahkan masalah nyata: sebelumnya, setiap aplikasi AI menulis logika pemanggilan alatnya sendiri-sendiri, tanpa standar bersama. MCP menyediakan antarmuka terpadu pada saat yang tepat, dan ekosistem dibangun dengan cepat. Pengalaman produksi kemudian memunculkan keterbatasan. Itu adalah hal yang normal untuk perkakas infrastruktur - bukan hukuman mati.</p>
<h2 id="When-to-Use-MCP-CLI-or-Skills" class="common-anchor-header">Kapan Menggunakan MCP, CLI, atau Keterampilan<button data-href="#When-to-Use-MCP-CLI-or-Skills" class="anchor-icon" translate="no">
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
    </button></h2><table>
<thead>
<tr><th></th><th>MCP melalui stdio (Lokal)</th><th>MCP melalui HTTP (Perusahaan)</th></tr>
</thead>
<tbody>
<tr><td><strong>Otentikasi</strong></td><td>Tidak ada</td><td>OAuth, terpusat</td></tr>
<tr><td><strong>Stabilitas koneksi</strong></td><td>Masalah isolasi proses</td><td>HTTPS yang stabil</td></tr>
<tr><td><strong>Penebangan</strong></td><td>Tidak ada mekanisme standar</td><td>Telemetri terpusat</td></tr>
<tr><td><strong>Kontrol akses</strong></td><td>Tidak ada</td><td>Izin berbasis peran</td></tr>
<tr><td><strong>Pendapat kami</strong></td><td>Ganti dengan CLI + Keterampilan</td><td>Pertahankan untuk perkakas perusahaan</td></tr>
</tbody>
</table>
<p>Untuk tim yang memilih tumpukan peralatan <a href="https://zilliz.com/glossary/ai-agents">AI agentic</a> mereka, berikut ini susunan lapisannya:</p>
<table>
<thead>
<tr><th>Lapisan</th><th>Apa yang dilakukannya</th><th>Paling cocok untuk</th><th>Contoh</th></tr>
</thead>
<tbody>
<tr><td><strong>CLI</strong></td><td>Tugas operasional, manajemen infra</td><td>Perintah yang dijalankan oleh agen dan manusia</td><td>git, docker, zilliz-cli</td></tr>
<tr><td><strong>Keterampilan</strong></td><td>Logika alur kerja agen, pengetahuan yang dikodekan</td><td>Tugas yang membutuhkan penilaian LLM, SOP multi-langkah</td><td>milvus-skill, zilliz-skill, memsearch</td></tr>
<tr><td><strong>API REST</strong></td><td>Integrasi eksternal</td><td>Menghubungkan ke layanan pihak ketiga</td><td>API GitHub, API Slack</td></tr>
<tr><td><strong>MCP HTTP</strong></td><td>Platform alat perusahaan</td><td>Penulisan terpusat, pencatatan audit</td><td>Gerbang alat internal</td></tr>
</tbody>
</table>
<h2 id="Get-Started" class="common-anchor-header">Memulai<button data-href="#Get-Started" class="anchor-icon" translate="no">
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
    </button></h2><p>Semua yang telah kita bahas dalam artikel ini tersedia saat ini:</p>
<ul>
<li><a href="https://github.com/zilliztech/memsearch"><strong>memsearch</strong></a> - lapisan memori berbasis Skills untuk agen AI. Masukkan ke dalam Claude Code atau agen apa pun yang mendukung Skills.</li>
<li><a href="https://docs.zilliz.com/reference/cli/overview"><strong>Zilliz CLI</strong></a> - mengelola Milvus dan Zilliz Cloud dari terminal Anda. Instal dan jelajahi subperintah yang dapat digunakan oleh agen Anda.</li>
<li><a href="https://milvus.io/docs/milvus_for_agents.md"><strong>Milvus Skill</strong></a> dan <a href="https://docs.zilliz.com/docs/agents/zilliz-skill"><strong>Zilliz Skill</strong></a> - berikan agen pengkodean AI Anda pengetahuan asli Milvus dan Zilliz Cloud.</li>
</ul>
<p>Ada pertanyaan tentang pencarian vektor, arsitektur agen, atau membangun dengan CLI dan Skill? Bergabunglah dengan <a href="https://discord.com/invite/8uyFbECzPX">komunitas Milvus Discord</a> atau <a href="https://milvus.io/office-hours">pesan sesi Office Hours gratis</a> untuk membahas kasus penggunaan Anda.</p>
<p>Siap membangun? <a href="https://cloud.zilliz.com/signup">Daftar ke Zilliz Cloud</a> - akun baru dengan email kantor mendapatkan kredit gratis sebesar $100. Sudah punya akun? <a href="https://cloud.zilliz.com/login">Masuk di sini</a>.</p>
<h2 id="Frequently-Asked-Questions" class="common-anchor-header">Pertanyaan yang Sering Diajukan<button data-href="#Frequently-Asked-Questions" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="What-is-wrong-with-MCP-for-AI-agents" class="common-anchor-header">Apa yang salah dengan MCP untuk agen AI?</h3><p>MCP memiliki tiga batasan arsitektur utama dalam produksi. Pertama, MCP memuat semua skema alat ke dalam jendela konteks pada awal sesi - menghubungkan hanya tiga server MCP pada model 200K-token dapat menghabiskan lebih dari 70% konteks yang tersedia sebelum agen melakukan apa pun. Kedua, alat MCP bersifat pasif: alat ini menunggu untuk dipanggil dan tidak dapat mengkodekan alur kerja multi-langkah, logika penanganan kesalahan, atau prosedur operasi standar. Ketiga, server MCP berjalan sebagai proses terpisah tanpa akses ke LLM agen, sehingga alat apa pun yang membutuhkan penilaian (seperti memfilter hasil pencarian untuk relevansi) memerlukan konfigurasi model terpisah dengan kunci API-nya sendiri. Masalah-masalah ini paling parah terjadi pada MCP di atas stdio; MCP di atas HTTP mengurangi beberapa di antaranya.</p>
<h3 id="What-is-the-difference-between-MCP-and-Agent-Skills" class="common-anchor-header">Apa perbedaan antara MCP dan Keterampilan Agen?</h3><p>MCP adalah protokol pemanggilan alat yang mendefinisikan bagaimana agen menemukan dan memanggil alat eksternal. Keterampilan Agen adalah file Markdown yang berisi prosedur operasi standar lengkap - pemicu, petunjuk langkah demi langkah, penanganan kesalahan, dan aturan eskalasi. Perbedaan arsitektur yang utama: Keterampilan berjalan di dalam proses agen, sehingga mereka dapat memanfaatkan LLM agen itu sendiri untuk panggilan penilaian seperti pemfilteran relevansi atau pemeringkatan ulang hasil. Alat MCP berjalan dalam proses yang terpisah dan tidak dapat mengakses kecerdasan agen. Skills juga menggunakan pengungkapan progresif - hanya memuat metadata yang ringan saat startup, dengan pemuatan konten penuh sesuai permintaan - menjaga penggunaan jendela konteks minimal dibandingkan dengan pemuatan skema MCP di muka.</p>
<h3 id="When-should-I-still-use-MCP-instead-of-CLI-or-Skills" class="common-anchor-header">Kapan saya masih harus menggunakan MCP alih-alih CLI atau Skills?</h3><p>MCP melalui HTTP masih masuk akal untuk platform perkakas perusahaan di mana Anda memerlukan OAuth terpusat, kontrol akses berbasis peran, telemetri terstandardisasi, dan pencatatan audit di banyak perkakas internal. Alat CLI yang terfragmentasi kesulitan untuk menyediakan kebutuhan perusahaan ini secara konsisten. Untuk alur kerja pengembangan lokal - di mana agen berinteraksi dengan alat di mesin Anda - CLI + Skills biasanya menawarkan kinerja yang lebih baik, overhead konteks yang lebih rendah, dan logika alur kerja yang lebih fleksibel daripada MCP melalui stdio.</p>
<h3 id="How-do-CLI-tools-and-Agent-Skills-work-together" class="common-anchor-header">Bagaimana cara kerja alat CLI dan Keterampilan Agen?</h3><p>CLI menyediakan lapisan eksekusi (perintah yang sebenarnya), sementara Skills menyediakan lapisan pengetahuan (kapan harus menjalankan perintah yang mana, dalam urutan apa, dan bagaimana menangani kegagalan). Sebagai contoh, Zilliz CLI menangani operasi infrastruktur seperti manajemen cluster, koleksi CRUD, dan pencarian vektor. Milvus Skill mengajarkan agen pola pymilvus yang tepat untuk desain skema, pencarian hibrida, dan jalur pipa RAG. CLI melakukan pekerjaan; Skill mengetahui alur kerjanya. Pola berlapis ini - CLI untuk eksekusi, Skill untuk pengetahuan, plugin untuk UX - adalah cara kami menyusun semua perkakas pengembang di Zilliz.</p>
<h3 id="MCP-vs-Skills-vs-CLI-when-should-I-use-each" class="common-anchor-header">MCP vs Skills vs CLI: kapan saya harus menggunakan masing-masing?</h3><p>Alat CLI seperti git, docker, atau zilliz-cli adalah yang terbaik untuk tugas-tugas operasional - alat ini mengekspos subperintah hirarkis dan memuat sesuai permintaan. Keterampilan seperti milvus-skill adalah yang terbaik untuk logika alur kerja agen - keterampilan ini membawa prosedur operasi, pemulihan kesalahan, dan dapat mengakses LLM agen. MCP melalui HTTP masih sesuai dengan platform alat perusahaan yang membutuhkan OAuth terpusat, izin, dan pencatatan audit. MCP melalui stdio - versi lokal - digantikan oleh CLI + Skills di sebagian besar pengaturan produksi.</p>
