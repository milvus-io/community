---
id: get-started-with-langgraph-up-react-a-practical-langgraph-template.md
title: 'Memulai dengan langgraph-up-react: Templat LangGraph yang Praktis'
author: Min Yin
date: 2025-09-11T00:00:00.000Z
desc: >-
  memperkenalkan langgraph-up-react, sebuah templat LangGraph + ReAct yang siap
  digunakan untuk agen ReAct.
cover: assets.zilliz.com/Chat_GPT_Image_Sep_12_2025_12_09_04_PM_804305620a.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search, AI Agents, LangGraph, ReAct'
meta_keywords: 'Milvus, AI Agents, LangGraph, ReAct, langchain'
meta_title: |
  Getting Started with langgraph-up-react: A LangGraph Template
origin: >-
  https://milvus.io/blog/get-started-with-langgraph-up-react-a-practical-langgraph-template.md
---
<p>Agen AI menjadi pola inti dalam AI terapan. Semakin banyak proyek yang bergerak melewati permintaan tunggal dan model pengkabelan ke dalam loop pengambilan keputusan. Hal ini menarik, tetapi juga berarti mengelola status, mengoordinasikan alat, menangani cabang, dan menambahkan handoff manusia-hal-hal yang tidak langsung terlihat jelas.</p>
<p><a href="https://github.com/langchain-ai/langgraph"><strong>LangGraph</strong></a> adalah pilihan yang kuat untuk lapisan ini. Ini adalah kerangka kerja AI yang menyediakan loop, kondisional, ketekunan, kontrol human-in-the-loop, dan struktur streaming yang cukup untuk mengubah ide menjadi aplikasi multi-agen yang nyata. Namun, LangGraph memiliki kurva pembelajaran yang curam. Dokumentasinya bergerak dengan cepat, abstraksinya membutuhkan waktu untuk membiasakan diri, dan beralih dari demo sederhana ke sesuatu yang terasa seperti produk bisa membuat frustrasi.</p>
<p>Baru-baru ini, saya mulai menggunakan <a href="https://github.com/webup/langgraph-up-react"><strong>langgraph-up-react-template</strong></a>LangGraph + ReAct yang siap pakai untuk agen ReAct. Templat ini memangkas penyiapan, memberikan default yang masuk akal, dan memungkinkan Anda untuk fokus pada perilaku alih-alih boilerplate. Dalam tulisan ini, saya akan menjelaskan cara memulai dengan LangGraph menggunakan templat ini.</p>
<h2 id="Understanding-ReAct-Agents" class="common-anchor-header">Memahami Agen ReAct<button data-href="#Understanding-ReAct-Agents" class="anchor-icon" translate="no">
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
    </button></h2><p>Sebelum masuk ke dalam templat itu sendiri, ada baiknya kita melihat jenis agen yang akan kita buat. Salah satu pola yang paling umum saat ini adalah kerangka kerja <strong>ReAct (Reason + Act)</strong>, yang pertama kali diperkenalkan dalam makalah Google tahun 2022 <em>"</em><a href="https://arxiv.org/abs/2210.03629"><em>ReAct: Mensinergikan Penalaran dan Tindakan dalam Model Bahasa.</em></a><em>"</em></p>
<p>Idenya sederhana: alih-alih memperlakukan penalaran dan tindakan sebagai sesuatu yang terpisah, ReAct menggabungkan keduanya ke dalam sebuah lingkaran umpan balik yang sangat mirip dengan pemecahan masalah yang dilakukan oleh manusia. Agen <strong>bernalar</strong> tentang masalah, <strong>bertindak</strong> dengan memanggil alat atau API, dan kemudian <strong>mengamati</strong> hasilnya sebelum memutuskan apa yang harus dilakukan selanjutnya. Siklus sederhana ini - alasan → tindakan → observasi - memungkinkan agen beradaptasi secara dinamis alih-alih mengikuti skrip yang tetap.</p>
<p>Berikut adalah bagaimana bagian-bagiannya saling melengkapi:</p>
<ul>
<li><p><strong>Alasan</strong>: Model ini memecah masalah menjadi beberapa langkah, merencanakan strategi, dan bahkan dapat memperbaiki kesalahan di tengah jalan.</p></li>
<li><p><strong>Bertindak</strong>: Berdasarkan penalarannya, agen memanggil alat bantu-apakah itu mesin pencari, kalkulator, atau API kustom Anda sendiri.</p></li>
<li><p><strong>Mengamati</strong>: Agen melihat keluaran alat, menyaring hasilnya, dan memasukkannya kembali ke putaran penalaran berikutnya.</p></li>
</ul>
<p>Putaran ini dengan cepat menjadi tulang punggung agen AI modern. Anda akan melihat jejaknya di plugin ChatGPT, pipeline RAG, asisten cerdas, dan bahkan robot. Dalam kasus kami, ini adalah fondasi yang dibangun oleh templat <code translate="no">langgraph-up-react</code>.</p>
<h2 id="Understanding-LangGraph" class="common-anchor-header">Memahami LangGraph<button data-href="#Understanding-LangGraph" class="anchor-icon" translate="no">
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
    </button></h2><p>Sekarang kita telah melihat pola ReAct, pertanyaan selanjutnya adalah: bagaimana Anda benar-benar menerapkan sesuatu seperti itu dalam praktiknya? Di luar kotak, sebagian besar model bahasa tidak menangani penalaran multi-langkah dengan baik. Setiap panggilan tidak memiliki status: model menghasilkan jawaban dan melupakan semuanya segera setelah selesai. Hal ini menyulitkan untuk meneruskan hasil antara atau menyesuaikan langkah selanjutnya berdasarkan langkah sebelumnya.</p>
<p><a href="https://github.com/langchain-ai/langgraph"><strong>LangGraph</strong></a> menutup celah ini. Alih-alih memperlakukan setiap perintah sebagai satu kali, LangGraph memberi Anda cara untuk memecah tugas-tugas kompleks menjadi beberapa langkah, mengingat apa yang terjadi di setiap titik, dan memutuskan apa yang harus dilakukan selanjutnya berdasarkan kondisi saat ini. Dengan kata lain, ini mengubah proses penalaran agen menjadi sesuatu yang terstruktur dan dapat diulang, bukan rantai permintaan yang bersifat ad-hoc.</p>
<p>Anda dapat menganggapnya seperti <strong>diagram alir untuk penalaran AI</strong>:</p>
<ul>
<li><p><strong>Menganalisis</strong> permintaan pengguna</p></li>
<li><p><strong>Pilih</strong> alat yang tepat untuk pekerjaan tersebut</p></li>
<li><p><strong>Jalankan</strong> tugas dengan memanggil alat tersebut</p></li>
<li><p><strong>Memproses</strong> hasilnya</p></li>
<li><p><strong>Periksa</strong> apakah tugas sudah selesai; jika belum, ulangi kembali dan lanjutkan penalaran</p></li>
<li><p><strong>Keluarkan</strong> jawaban akhir</p></li>
</ul>
<p>Di sepanjang prosesnya, LangGraph menangani <strong>penyimpanan memori</strong> sehingga hasil dari langkah-langkah sebelumnya tidak hilang, dan terintegrasi dengan <strong>pustaka alat eksternal</strong> (API, basis data, pencarian, kalkulator, sistem file, dll.).</p>
<p>Itulah mengapa disebut <em>LangGraph</em>: <strong>Lang (Bahasa) + Graph-sebuah</strong>kerangka kerja untuk mengatur bagaimana model bahasa berpikir dan bertindak dari waktu ke waktu.</p>
<h2 id="Understanding-langgraph-up-react" class="common-anchor-header">Memahami langgraph-up-react<button data-href="#Understanding-langgraph-up-react" class="anchor-icon" translate="no">
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
    </button></h2><p>LangGraph sangat kuat, tetapi ada biaya tambahan. Menyiapkan manajemen state, mendesain node dan edge, menangani kesalahan, dan memasang kabel pada model dan alat membutuhkan waktu. Debugging alur multi-langkah juga bisa menyakitkan-ketika ada sesuatu yang rusak, masalahnya mungkin ada di node atau transisi mana pun. Ketika proyek berkembang, bahkan perubahan kecil pun dapat merembet ke seluruh basis kode dan memperlambat semuanya.</p>
<p>Di sinilah template yang matang membuat perbedaan besar. Alih-alih memulai dari awal, templat memberi Anda struktur yang sudah terbukti, alat yang sudah dibuat sebelumnya, dan skrip yang langsung bekerja. Anda melewatkan boilerplate dan fokus langsung pada logika agen.</p>
<p><a href="https://github.com/webup/langgraph-up-react"><strong>langgraph-up-react</strong></a> adalah salah satu template tersebut. Template ini dirancang untuk membantu Anda menjalankan agen LangGraph ReAct dengan cepat, dengan:</p>
<ul>
<li><p>🔧 <strong>Ekosistem alat bawaan</strong>: adaptor dan utilitas yang siap digunakan di luar kotak</p></li>
<li><p>🉡 <strong>Mulai cepat</strong>: konfigurasi sederhana dan agen yang berfungsi dalam hitungan menit</p></li>
<li><p>🧪 <strong>Pengujian disertakan</strong>: tes unit dan tes integrasi untuk meningkatkan kepercayaan diri saat Anda memperluas</p></li>
<li><p>📦 <strong>Penyiapan siap produksi</strong>: pola arsitektur dan skrip yang menghemat waktu saat penerapan</p></li>
</ul>
<p>Singkatnya, langgrafix menangani boilerplate sehingga Anda dapat fokus membangun agen yang benar-benar menyelesaikan masalah bisnis Anda.</p>
<h2 id="Getting-Started-with-the-langgraph-up-react-Template" class="common-anchor-header">Memulai dengan Templat langgraph-up-react<button data-href="#Getting-Started-with-the-langgraph-up-react-Template" class="anchor-icon" translate="no">
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
    </button></h2><p>Menjalankan templat sangat mudah. Berikut adalah proses penyiapan langkah demi langkah:</p>
<ol>
<li>Instal dependensi lingkungan</li>
</ol>
<pre><code translate="no">curl -<span class="hljs-title class_">LsSf</span> <span class="hljs-attr">https</span>:<span class="hljs-comment">//astral.sh/uv/install.sh | sh</span>
<button class="copy-code-btn"></button></code></pre>
<ol start="2">
<li>Kloning proyek</li>
</ol>
<pre><code translate="no">git <span class="hljs-built_in">clone</span> https://github.com/webup/langgraph-up-react.git
<span class="hljs-built_in">cd</span> langgraph-up-react
<button class="copy-code-btn"></button></code></pre>
<ol start="3">
<li>Menginstal dependensi</li>
</ol>
<pre><code translate="no">uv <span class="hljs-built_in">sync</span> --dev
<button class="copy-code-btn"></button></code></pre>
<ol start="4">
<li>Konfigurasi lingkungan</li>
</ol>
<p>Salin contoh konfigurasi dan tambahkan kunci Anda:</p>
<pre><code translate="no"><span class="hljs-built_in">cp</span> .env.example .<span class="hljs-built_in">env</span>
<button class="copy-code-btn"></button></code></pre>
<p>Edit .env dan tetapkan setidaknya satu penyedia model plus kunci API Tavily Anda:</p>
<pre><code translate="no">TAVILY_API_KEY=your-tavily-api-key      <span class="hljs-comment"># Required for web search  </span>
DASHSCOPE_API_KEY=your-dashscope-api-key  <span class="hljs-comment"># Qwen (default recommended)  </span>
OPENAI_API_KEY=your-openai-api-key        <span class="hljs-comment"># OpenAI or compatible platforms  </span>
<span class="hljs-comment"># OPENAI_API_BASE=https://your-api-endpoint  # If using OpenAI-compatible API  </span>
REGION=us                <span class="hljs-comment"># Optional: region flag  </span>
ENABLE_DEEPWIKI=true      <span class="hljs-comment"># Optional: enable document tools  </span>
<button class="copy-code-btn"></button></code></pre>
<ol start="5">
<li>Mulai proyek</li>
</ol>
<pre><code translate="no"><span class="hljs-comment"># Start development server (without UI)</span>
make dev

<span class="hljs-comment"># Start development server with LangGraph Studio UI</span>
make dev_ui
<button class="copy-code-btn"></button></code></pre>
<p>Server pengembangan Anda sekarang akan aktif dan siap untuk diuji.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/template_set_up_a42d1819ed.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="What-Can-You-Build-with-langgraph-up-react" class="common-anchor-header">Apa yang Dapat Anda Bangun dengan langgraph-up-react?<button data-href="#What-Can-You-Build-with-langgraph-up-react" class="anchor-icon" translate="no">
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
    </button></h2><p>Jadi, apa yang sebenarnya dapat Anda lakukan setelah templat sudah aktif dan berjalan? Berikut adalah dua contoh konkret yang menunjukkan bagaimana template ini dapat diterapkan dalam proyek nyata.</p>
<h3 id="Enterprise-Knowledge-Base-QA-Agentic-RAG" class="common-anchor-header">Tanya Jawab Basis Pengetahuan Perusahaan (Agentic RAG)</h3><p>Kasus penggunaan yang umum adalah asisten tanya jawab internal untuk pengetahuan perusahaan. Pikirkan tentang manual produk, dokumen teknis, FAQ-informasi yang berguna namun tersebar. Dengan <code translate="no">langgraph-up-react</code>, Anda dapat membuat agen yang mengindeks dokumen-dokumen ini dalam basis data vektor <a href="https://milvus.io/"><strong>Milvus</strong></a>, mengambil bagian yang paling relevan, dan menghasilkan jawaban yang akurat berdasarkan konteks.</p>
<p>Untuk penerapan, Milvus menawarkan opsi yang fleksibel: <strong>Lite</strong> untuk pembuatan prototipe cepat, <strong>Standalone</strong> untuk beban kerja produksi menengah, dan <strong>Distributed</strong> untuk sistem skala perusahaan. Anda juga perlu menyetel parameter indeks (misalnya, HNSW) untuk menyeimbangkan kecepatan dan akurasi, serta mengatur pemantauan latensi dan recall untuk memastikan sistem tetap andal di bawah beban.</p>
<h3 id="Multi-Agent-Collaboration" class="common-anchor-header">Kolaborasi Multi-Agen</h3><p>Kasus penggunaan lain yang kuat adalah kolaborasi multi-agen. Alih-alih satu agen mencoba melakukan semuanya, Anda mendefinisikan beberapa agen khusus yang bekerja bersama. Dalam alur kerja pengembangan perangkat lunak, misalnya, Agen Manajer Produk menguraikan persyaratan, Agen Arsitek menyusun rancangan, Agen Pengembang menulis kode, dan Agen Penguji memvalidasi hasilnya.</p>
<p>Orkestrasi ini menyoroti kekuatan LangGraph - manajemen status, percabangan, dan koordinasi antar agen. Kami akan membahas pengaturan ini secara lebih rinci di artikel selanjutnya, tetapi poin utamanya adalah bahwa <code translate="no">langgraph-up-react</code> membuatnya praktis untuk mencoba pola-pola ini tanpa menghabiskan waktu berminggu-minggu untuk perancah.</p>
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
    </button></h2><p>Membangun agen yang handal bukan hanya tentang permintaan yang cerdas - ini tentang penataan penalaran, mengelola state, dan menghubungkan semuanya ke dalam sistem yang dapat Anda pelihara. LangGraph memberi Anda kerangka kerja untuk melakukan itu, dan <code translate="no">langgraph-up-react</code> menurunkan penghalang dengan menangani boilerplate sehingga Anda dapat fokus pada perilaku agen.</p>
<p>Dengan templat ini, Anda dapat menjalankan proyek seperti sistem tanya jawab basis pengetahuan atau alur kerja multi-agen tanpa tersesat dalam pengaturan. Ini adalah titik awal yang menghemat waktu, menghindari jebakan umum, dan membuat eksperimen dengan LangGraph jauh lebih lancar.</p>
<p>Dalam posting berikutnya, saya akan membahas lebih dalam tutorial praktis yang menunjukkan langkah demi langkah cara memperluas templat dan membangun agen yang berfungsi untuk kasus penggunaan nyata menggunakan LangGraph, <code translate="no">langgraph-up-react</code>, dan basis data vektor Milvus. Tetap disini.</p>
