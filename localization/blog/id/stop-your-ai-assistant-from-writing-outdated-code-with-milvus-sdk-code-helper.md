---
id: >-
  stop-your-ai-assistant-from-writing-outdated-code-with-milvus-sdk-code-helper.md
title: >-
  Hentikan Asisten AI Anda dari Menulis Kode yang Sudah Usang dengan Milvus SDK
  Code Helper
author: 'Cheney Zhang, Stacy Li'
date: 2025-08-22T00:00:00.000Z
desc: >-
  Tutorial langkah demi langkah dalam menyiapkan Milvus SDK Code Helper untuk
  menghentikan asisten AI menghasilkan kode yang sudah usang dan memastikan
  praktik terbaik.
cover: >-
  assets.zilliz.com/stop_your_ai_assistant_from_writing_outdated_code_with_milvus_sdk_code_helper_min_64fa8d3396.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search'
meta_keywords: 'Milvus SDK Code Helper, AI coding assistant, MCP server, vibe coding, pymilvus'
meta_title: |
  Milvus SDK Code Helper Tutorial: Fix AI Outdated Code
origin: >-
  https://milvus.io/blog/stop-your-ai-assistant-from-writing-outdated-code-with-milvus-sdk-code-helper.md
---
<h2 id="Introduction" class="common-anchor-header">Pendahuluan<button data-href="#Introduction" class="anchor-icon" translate="no">
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
    </button></h2><p>Vibe Coding mengubah cara kita menulis perangkat lunak. Alat-alat seperti Cursor dan Windsurf membuat pengembangan terasa mudah dan intuitif-tanyakan sebuah fungsi dan dapatkan cuplikannya, perlu panggilan API yang cepat, dan dibuat sebelum Anda selesai mengetik. Janjinya adalah pengembangan yang mulus dan lancar di mana asisten AI Anda mengantisipasi kebutuhan Anda dan memberikan apa yang Anda inginkan.</p>
<p>Namun ada kekurangan kritis yang merusak alur yang indah ini: Asisten AI sering kali menghasilkan kode usang yang rusak dalam produksi.</p>
<p>Pertimbangkan contoh ini: Saya meminta Cursor untuk membuat kode koneksi Milvus, dan menghasilkan ini:</p>
<pre><code translate="no">connections.<span class="hljs-title function_">connect</span>(<span class="hljs-string">&quot;default&quot;</span>, host=<span class="hljs-string">&quot;localhost&quot;</span>, port=<span class="hljs-string">&quot;19530&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Ini dulunya bekerja dengan sempurna, tetapi SDK pymilvus saat ini merekomendasikan untuk menggunakan <code translate="no">MilvusClient</code> untuk semua koneksi dan operasi. Metode lama tidak lagi dianggap sebagai praktik terbaik, namun asisten AI terus menyarankannya karena data pelatihan mereka sering kali sudah ketinggalan zaman.</p>
<p>Terlepas dari semua kemajuan dalam alat Vibe Coding, para pengembang masih menghabiskan banyak waktu untuk menjembatani "jarak terakhir" antara kode yang dibuat dan solusi yang siap produksi. Getarannya ada, tetapi akurasinya tidak.</p>
<h3 id="What-is-the-Milvus-SDK-Code-Helper" class="common-anchor-header">Apa yang dimaksud dengan Milvus SDK Code Helper?</h3><p><strong>Milvus SDK Code Helper</strong> adalah solusi yang berfokus pada pengembang yang memecahkan masalah <em>"mil terakhir"</em> dalam Vibe Coding - menjembatani kesenjangan antara pengkodean dengan bantuan AI dan aplikasi Milvus yang siap produksi.</p>
<p>Pada intinya, ini adalah <strong>server Model Context Protocol (MCP</strong> ) yang menghubungkan IDE bertenaga AI Anda secara langsung ke dokumentasi resmi Milvus terbaru. Dikombinasikan dengan Retrieval-Augmented Generation (RAG), server ini memastikan kode yang dibuat oleh asisten Anda selalu akurat, terbaru, dan selaras dengan praktik terbaik Milvus.</p>
<p>Alih-alih cuplikan usang atau tebakan, Anda mendapatkan saran kode yang sesuai dengan konteks dan sesuai dengan standar-tepat di dalam alur kerja pengembangan Anda.</p>
<p><strong>Manfaat Utama:</strong></p>
<ul>
<li><p>⚡ <strong>Konfigurasi sekali, tingkatkan efisiensi selamanya</strong>: Siapkan sekali dan nikmati pembuatan kode yang diperbarui secara konsisten</p></li>
<li><p>🎯 <strong>Selalu terkini</strong>: Akses ke dokumentasi resmi Milvus SDK terbaru</p></li>
<li><p>📈 <strong>Kualitas kode yang lebih baik</strong>: Hasilkan kode yang mengikuti praktik terbaik saat ini</p></li>
<li><p>🌊 A <strong>liran yang dipulihkan</strong>: Jaga agar pengalaman Vibe Coding Anda tetap lancar dan tidak terganggu</p></li>
</ul>
<p><strong>Tiga Alat dalam Satu</strong></p>
<ol>
<li><p><code translate="no">pymilvus-code-generator</code> → Menulis kode Python dengan cepat untuk tugas-tugas umum Milvus (misalnya, membuat koleksi, memasukkan data, menjalankan pencarian vektor).</p></li>
<li><p><code translate="no">orm-client-code-converter</code> → Memodernisasi kode Python lama dengan mengganti pola ORM yang sudah ketinggalan zaman dengan sintaks <code translate="no">MilvusClient</code> terbaru.</p></li>
<li><p><code translate="no">language-translator</code> → Konversi kode Milvus SDK antar bahasa dengan lancar (misalnya, Python ↔ TypeScript).</p></li>
</ol>
<p>Periksa sumber daya di bawah ini untuk lebih jelasnya:</p>
<ul>
<li><p>Blog: <a href="https://milvus.io/blog/why-vibe-coding-generate-outdated-code-and-how-to-fix-it-with-milvus-mcp.md">Mengapa Pengkodean Vibe Anda Menghasilkan Kode yang Sudah Usang dan Cara Memperbaikinya dengan Milvus MCP </a></p></li>
<li><p>Dokumen: <a href="https://milvus.io/docs/milvus-sdk-helper-mcp.md#Quickstart">Panduan Pembantu Kode SDK Milvus | Dokumentasi Milvus</a></p></li>
</ul>
<h3 id="Before-You-Begin" class="common-anchor-header">Sebelum Anda Mulai</h3><p>Sebelum masuk ke dalam proses penyiapan, mari kita lihat perbedaan dramatis yang dibuat oleh Code Helper dalam praktiknya. Perbandingan di bawah ini menunjukkan bagaimana permintaan yang sama untuk membuat koleksi Milvus menghasilkan hasil yang sangat berbeda:</p>
<table>
<thead>
<tr><th><strong>MCP Code Helper Diaktifkan:</strong></th><th><strong>Pembantu Kode MCP Dinonaktifkan:</strong></th></tr>
</thead>
<tbody>
<tr><td>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/mcp_enabled_fcb94737fb.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</td><td>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/mcp_disabled_769db4faee.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</td></tr>
</tbody>
</table>
<p>Ini dengan sempurna menggambarkan masalah inti: tanpa Code Helper, bahkan asisten AI yang paling canggih pun menghasilkan kode menggunakan pola ORM SDK yang sudah ketinggalan zaman yang tidak lagi direkomendasikan. Code Helper memastikan Anda mendapatkan implementasi terbaru, efisien, dan didukung secara resmi setiap saat.</p>
<p><strong>Perbedaan dalam Praktik:</strong></p>
<ul>
<li><p><strong>Pendekatan modern</strong>: Kode yang bersih dan dapat dipelihara menggunakan praktik terbaik saat ini</p></li>
<li><p><strong>Pendekatan usang</strong>: Kode yang berfungsi tetapi mengikuti pola yang sudah ketinggalan zaman</p></li>
<li><p><strong>Dampak produksi</strong>: Kode saat ini lebih efisien, lebih mudah dipelihara, dan tahan untuk masa depan</p></li>
</ul>
<p>Panduan ini akan memandu Anda dalam menyiapkan Milvus SDK Code Helper di berbagai IDE AI dan lingkungan pengembangan. Proses penyiapannya sangat mudah dan biasanya hanya membutuhkan waktu beberapa menit per IDE.</p>
<h2 id="Setting-Up-the-Milvus-SDK-Code-Helper" class="common-anchor-header">Menyiapkan Pembantu Kode SDK Milvus<button data-href="#Setting-Up-the-Milvus-SDK-Code-Helper" class="anchor-icon" translate="no">
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
    </button></h2><p>Bagian berikut ini memberikan instruksi penyiapan terperinci untuk setiap IDE dan lingkungan pengembangan yang didukung. Pilih bagian yang sesuai dengan pengaturan pengembangan yang Anda inginkan.</p>
<h3 id="Cursor-IDE-Setup" class="common-anchor-header">Pengaturan IDE Kursor</h3><p>Cursor menawarkan integrasi tanpa batas dengan server MCP melalui sistem konfigurasi bawaannya.</p>
<p><strong>Langkah 1: Mengakses Pengaturan MCP</strong></p>
<p>Navigasikan ke: Pengaturan → Pengaturan Kursor → Alat &amp; Integrasi → Tambahkan server MCP global baru</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/cursor_mcp_configuration_interface_9ff0b7dcb7.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
 <em>Antarmuka konfigurasi MCP kursor</em></p>
<p><strong>Langkah 2: Konfigurasikan Server MCP</strong></p>
<p>Anda memiliki dua opsi untuk konfigurasi:</p>
<p><strong>Opsi A: Konfigurasi Global (Direkomendasikan)</strong></p>
<p>Tambahkan konfigurasi berikut ini ke file Cursor <code translate="no">~/.cursor/mcp.json</code>:</p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;mcpServers&quot;</span>: {
    <span class="hljs-string">&quot;sdk-code-helper&quot;</span>: {
      <span class="hljs-string">&quot;url&quot;</span>: <span class="hljs-string">&quot;https://sdk.milvus.io/mcp/&quot;</span>,
      <span class="hljs-string">&quot;headers&quot;</span>: {
        <span class="hljs-string">&quot;Accept&quot;</span>: <span class="hljs-string">&quot;text/event-stream&quot;</span>
      }
    }
  }
}
<button class="copy-code-btn"></button></code></pre>
<p><strong>Opsi B: Konfigurasi Khusus Proyek</strong></p>
<p>Buat file <code translate="no">.cursor/mcp.json</code> di folder proyek Anda dengan konfigurasi yang sama di atas.</p>
<p>Untuk opsi konfigurasi tambahan dan pemecahan masalah, lihat<a href="https://docs.cursor.com/context/model-context-protocol"> dokumentasi Cursor MCP</a>.</p>
<h3 id="Claude-Desktop-Setup" class="common-anchor-header">Penyiapan Claude Desktop</h3><p>Claude Desktop menyediakan integrasi MCP secara langsung melalui sistem konfigurasinya.</p>
<p><strong>Langkah 1: Temukan File Konfigurasi</strong></p>
<p>Tambahkan konfigurasi berikut ini ke file konfigurasi Claude Desktop Anda:</p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;mcpServers&quot;</span>: {
    <span class="hljs-string">&quot;sdk-code-helper&quot;</span>: {
      <span class="hljs-string">&quot;url&quot;</span>: <span class="hljs-string">&quot;https://sdk.milvus.io/mcp/&quot;</span>,
      <span class="hljs-string">&quot;headers&quot;</span>: {
        <span class="hljs-string">&quot;Accept&quot;</span>: <span class="hljs-string">&quot;text/event-stream&quot;</span>
      }
    }
  }
}
<button class="copy-code-btn"></button></code></pre>
<p><strong>Langkah 2: Mulai ulang Claude Desktop</strong></p>
<p>Setelah menyimpan konfigurasi, mulai ulang Claude Desktop untuk mengaktifkan server MCP yang baru.</p>
<h3 id="Claude-Code-Setup" class="common-anchor-header">Pengaturan Claude Code</h3><p>Claude Code menawarkan konfigurasi baris perintah untuk server MCP, sehingga ideal bagi pengembang yang lebih menyukai pengaturan berbasis terminal.</p>
<p><strong>Langkah 1: Tambahkan Server MCP melalui Baris Perintah</strong></p>
<p>Jalankan perintah berikut di terminal Anda:</p>
<pre><code translate="no">claude mcp add-json sdk-code-helper --json &#x27;{
  &quot;url&quot;: &quot;https://sdk.milvus.io/mcp/&quot;,
  &quot;headers&quot;: {
    &quot;Accept&quot;: &quot;text/event-stream&quot;
  }
}
<button class="copy-code-btn"></button></code></pre>
<p><strong>Langkah 2: Verifikasi Instalasi</strong></p>
<p>Server MCP akan secara otomatis dikonfigurasi dan siap digunakan segera setelah menjalankan perintah.</p>
<h3 id="Windsurf-IDE-Setup" class="common-anchor-header">Pengaturan IDE Windsurf</h3><p>Windsurf mendukung konfigurasi MCP melalui sistem pengaturan berbasis JSON.</p>
<p><strong>Langkah 1: Mengakses Pengaturan MCP</strong></p>
<p>Tambahkan konfigurasi berikut ini ke file pengaturan MCP Windsurf Anda:</p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;mcpServers&quot;</span>: {
    <span class="hljs-string">&quot;sdk-code-helper&quot;</span>: {
      <span class="hljs-string">&quot;url&quot;</span>: <span class="hljs-string">&quot;https://sdk.milvus.io/mcp/&quot;</span>,
      <span class="hljs-string">&quot;headers&quot;</span>: {
        <span class="hljs-string">&quot;Accept&quot;</span>: <span class="hljs-string">&quot;text/event-stream&quot;</span>
      }
    }
  }
}
<button class="copy-code-btn"></button></code></pre>
<p><strong>Langkah 2: Terapkan Konfigurasi</strong></p>
<p>Simpan file pengaturan dan mulai ulang Windsurf untuk mengaktifkan server MCP.</p>
<h3 id="VS-Code-Setup" class="common-anchor-header">Pengaturan Kode VS</h3><p>Integrasi VS Code memerlukan ekstensi yang kompatibel dengan MCP agar dapat berfungsi dengan baik.</p>
<p><strong>Langkah 1: Instal Ekstensi MCP</strong></p>
<p>Pastikan Anda memiliki ekstensi yang kompatibel dengan MCP yang diinstal di VS Code.</p>
<p><strong>Langkah 2: Konfigurasi Server MCP</strong></p>
<p>Tambahkan konfigurasi berikut ini ke pengaturan MCP VS Code Anda:</p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;mcpServers&quot;</span>: {
    <span class="hljs-string">&quot;sdk-code-helper&quot;</span>: {
      <span class="hljs-string">&quot;url&quot;</span>: <span class="hljs-string">&quot;https://sdk.milvus.io/mcp/&quot;</span>,
      <span class="hljs-string">&quot;headers&quot;</span>: {
        <span class="hljs-string">&quot;Accept&quot;</span>: <span class="hljs-string">&quot;text/event-stream&quot;</span>
      }
    }
  }
}
<button class="copy-code-btn"></button></code></pre>
<h3 id="Cherry-Studio-Setup" class="common-anchor-header">Pengaturan Cherry Studio</h3><p>Cherry Studio menyediakan antarmuka grafis yang mudah digunakan untuk konfigurasi server MCP, sehingga dapat diakses oleh pengembang yang lebih menyukai proses pengaturan visual.</p>
<p><strong>Langkah 1: Akses Pengaturan Server MCP</strong></p>
<p>Navigasikan ke Pengaturan → Server MCP → Tambahkan Server melalui antarmuka Cherry Studio.</p>
<p><strong>Langkah 2: Konfigurasikan Detail Server</strong></p>
<p>Isi formulir konfigurasi server dengan informasi berikut:</p>
<ul>
<li><p><strong>Nama</strong>: <code translate="no">sdk code helper</code></p></li>
<li><p><strong>Jenis</strong>: <code translate="no">Streamable HTTP</code></p></li>
<li><p><strong>URL</strong>: <code translate="no">https://sdk.milvus.io/mcp/</code></p></li>
<li><p><strong>Header</strong>: <code translate="no">&quot;Accept&quot;: &quot;text/event-stream&quot;</code></p></li>
</ul>
<p><strong>Langkah 3: Simpan dan Aktifkan</strong></p>
<p>Klik Simpan untuk mengaktifkan konfigurasi server.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/cherry_studio_mcp_configuration_interface_b7dce8b26d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Antarmuka konfigurasi MCP Cherry Studio</em></p>
<h3 id="Cline-Setup" class="common-anchor-header">Pengaturan Cline</h3><p>Cline menggunakan sistem konfigurasi berbasis JSON yang dapat diakses melalui antarmukanya.</p>
<p><strong>Langkah 1: Akses Pengaturan MCP</strong></p>
<ol>
<li><p>Buka Cline dan klik ikon MCP Servers di bilah navigasi atas</p></li>
<li><p>Pilih tab Terpasang</p></li>
<li><p>Klik Pengaturan MCP Lanjutan</p></li>
</ol>
<p><strong>Langkah 2: Edit File Konfigurasi</strong> Pada file <code translate="no">cline_mcp_settings.json</code>, tambahkan konfigurasi berikut:</p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;mcpServers&quot;</span>: {
    <span class="hljs-string">&quot;sdk-code-helper&quot;</span>: {
      <span class="hljs-string">&quot;url&quot;</span>: <span class="hljs-string">&quot;https://sdk.milvus.io/mcp/&quot;</span>,
      <span class="hljs-string">&quot;headers&quot;</span>: {
        <span class="hljs-string">&quot;Accept&quot;</span>: <span class="hljs-string">&quot;text/event-stream&quot;</span>
      }
    }
  }
}
<button class="copy-code-btn"></button></code></pre>
<p><strong>Langkah 3: Simpan dan Mulai Ulang</strong></p>
<p>Simpan file konfigurasi dan mulai ulang Cline untuk menerapkan perubahan.</p>
<h3 id="Augment-Setup" class="common-anchor-header">Pengaturan Augment</h3><p>Augment menyediakan akses ke konfigurasi MCP melalui panel pengaturan lanjutan.</p>
<p><strong>Langkah 1: Akses Pengaturan</strong></p>
<ol>
<li><p>Tekan Cmd/Ctrl + Shift + P atau arahkan ke menu hamburger di panel Augment</p></li>
<li><p>Pilih Edit Pengaturan</p></li>
<li><p>Di bawah Lanjutan, klik Edit di pengaturan.json</p></li>
</ol>
<p><strong>Langkah 2: Tambahkan Konfigurasi Server</strong></p>
<p>Tambahkan konfigurasi server ke larik <code translate="no">mcpServers</code> dalam objek <code translate="no">augment.advanced</code>:</p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;mcpServers&quot;</span>: {
    <span class="hljs-string">&quot;sdk-code-helper&quot;</span>: {
      <span class="hljs-string">&quot;url&quot;</span>: <span class="hljs-string">&quot;https://sdk.milvus.io/mcp/&quot;</span>,
      <span class="hljs-string">&quot;headers&quot;</span>: {
        <span class="hljs-string">&quot;Accept&quot;</span>: <span class="hljs-string">&quot;text/event-stream&quot;</span>
      }
    }
  }
}
<button class="copy-code-btn"></button></code></pre>
<h3 id="Gemini-CLI-Setup" class="common-anchor-header">Penyiapan Gemini CLI</h3><p>Gemini CLI memerlukan konfigurasi manual melalui file pengaturan JSON.</p>
<p><strong>Langkah 1: Buat atau Edit File Pengaturan</strong></p>
<p>Buat atau edit berkas <code translate="no">~/.gemini/settings.json</code> pada sistem Anda.</p>
<p><strong>Langkah 2: Tambahkan Konfigurasi</strong></p>
<p>Masukkan konfigurasi berikut ini ke dalam berkas pengaturan:</p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;mcpServers&quot;</span>: {
    <span class="hljs-string">&quot;sdk-code-helper&quot;</span>: {
      <span class="hljs-string">&quot;url&quot;</span>: <span class="hljs-string">&quot;https://sdk.milvus.io/mcp/&quot;</span>,
      <span class="hljs-string">&quot;headers&quot;</span>: {
        <span class="hljs-string">&quot;Accept&quot;</span>: <span class="hljs-string">&quot;text/event-stream&quot;</span>
      }
    }
  }
}
<button class="copy-code-btn"></button></code></pre>
<p><strong>Langkah 3: Terapkan Perubahan</strong></p>
<p>Simpan file dan mulai ulang Gemini CLI untuk menerapkan perubahan konfigurasi.</p>
<h3 id="Roo-Code-Setup" class="common-anchor-header">Pengaturan Kode Roo</h3><p>Roo Code menggunakan file konfigurasi JSON terpusat untuk mengelola server MCP.</p>
<p><strong>Langkah 1: Akses Konfigurasi Global</strong></p>
<ol>
<li><p>Buka Kode Roo</p></li>
<li><p>Navigasikan ke Pengaturan → Server MCP → Edit Konfigurasi Global</p></li>
</ol>
<p><strong>Langkah 2: Edit File Konfigurasi</strong></p>
<p>Pada file <code translate="no">mcp_settings.json</code>, tambahkan konfigurasi berikut ini:</p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;mcpServers&quot;</span>: {
    <span class="hljs-string">&quot;sdk-code-helper&quot;</span>: {
      <span class="hljs-string">&quot;url&quot;</span>: <span class="hljs-string">&quot;https://sdk.milvus.io/mcp/&quot;</span>,
      <span class="hljs-string">&quot;headers&quot;</span>: {
        <span class="hljs-string">&quot;Accept&quot;</span>: <span class="hljs-string">&quot;text/event-stream&quot;</span>
      }
    }
  }
}
<button class="copy-code-btn"></button></code></pre>
<p><strong>Langkah 3: Aktifkan Server</strong></p>
<p>Simpan file untuk mengaktifkan server MCP secara otomatis.</p>
<h3 id="Verification-and-Testing" class="common-anchor-header">Verifikasi dan Pengujian</h3><p>Setelah menyelesaikan penyiapan untuk IDE yang Anda pilih, Anda dapat memverifikasi bahwa Milvus SDK Code Helper bekerja dengan benar dengan:</p>
<ol>
<li><p><strong>Menguji Pembuatan Kode</strong>: Minta asisten AI Anda untuk membuat kode terkait Milvus dan amati apakah kode tersebut menggunakan praktik terbaik saat ini</p></li>
<li><p><strong>Memeriksa Akses Dokumentasi</strong>: Meminta informasi tentang fitur Milvus tertentu untuk memastikan helper memberikan respons terbaru</p></li>
<li><p><strong>Membandingkan Hasil</strong>: Buatlah permintaan kode yang sama dengan dan tanpa helper untuk melihat perbedaan kualitas dan kemutakhiran</p></li>
</ol>
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
    </button></h2><p>Dengan menyiapkan Milvus SDK Code Helper, Anda telah mengambil langkah penting menuju masa depan pengembangan-di mana asisten AI tidak hanya menghasilkan kode yang cepat, tetapi juga <strong>kode yang akurat dan terkini</strong>. Alih-alih mengandalkan data pelatihan statis yang akan menjadi usang, kami bergerak menuju sistem pengetahuan dinamis dan real-time yang berkembang dengan teknologi yang mereka dukung.</p>
<p>Seiring dengan semakin canggihnya asisten pengkodean AI, kesenjangan antara alat yang memiliki pengetahuan terkini dan yang tidak akan semakin melebar. Milvus SDK Code Helper hanyalah permulaan - berharap untuk melihat server pengetahuan khusus yang serupa untuk teknologi dan kerangka kerja utama lainnya. Masa depan adalah milik para pengembang yang dapat memanfaatkan kecepatan AI sambil memastikan akurasi dan kekinian. Anda sekarang dilengkapi dengan keduanya.</p>
