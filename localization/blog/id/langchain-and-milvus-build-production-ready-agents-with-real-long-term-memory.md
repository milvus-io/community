---
id: >-
  langchain-and-milvus-build-production-ready-agents-with-real-long-term-memory.md
title: >-
  LangChain 1.0 dan Milvus: Cara Membangun Agen Siap Produksi dengan Memori
  Jangka Panjang yang Nyata
author: Min Yin
date: 2025-12-19T00:00:00.000Z
cover: assets.zilliz.com/langchain1_0_cover_8c4bc608af.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus, LangChain 1.0, AI Agent, vector database, LangGraph'
meta_title: >
  LangChain 1.0 and Milvus: Build Production-Ready AI Agents with Long-Term
  Memory
desc: >-
  Temukan bagaimana LangChain 1.0 menyederhanakan arsitektur agen dan bagaimana
  Milvus menambahkan memori jangka panjang untuk aplikasi AI yang dapat
  diskalakan dan siap produksi.
origin: >-
  https://milvus.io/blog/langchain-and-milvus-build-production-ready-agents-with-real-long-term-memory.md
---
<p>LangChain adalah kerangka kerja sumber terbuka yang populer untuk mengembangkan aplikasi yang didukung oleh model bahasa besar (LLM). Framework ini menyediakan toolkit modular untuk membangun penalaran dan agen yang menggunakan alat, menghubungkan model ke data eksternal, dan mengelola alur interaksi.</p>
<p>Dengan dirilisnya <strong>LangChain 1.0</strong>, kerangka kerja ini mengambil langkah menuju arsitektur yang lebih ramah produksi. Versi baru ini menggantikan desain berbasis Chain sebelumnya dengan loop ReAct yang terstandardisasi (Reason → Tool Call → Observe → Decide) dan memperkenalkan Middleware untuk mengelola eksekusi, kontrol, dan keamanan.</p>
<p>Namun, penalaran saja tidak cukup. Agen juga membutuhkan kemampuan untuk menyimpan, mengingat, dan menggunakan kembali informasi. Di sinilah <a href="https://milvus.io/"><strong>Milvus</strong></a>, sebuah database vektor sumber terbuka, dapat memainkan peran penting. Milvus menyediakan lapisan memori berkinerja tinggi yang dapat diskalakan yang memungkinkan agen untuk menyimpan, mencari, dan mengambil informasi secara efisien melalui kemiripan semantik.</p>
<p>Dalam tulisan ini, kita akan mengeksplorasi bagaimana LangChain 1.0 memperbarui arsitektur agen, dan bagaimana mengintegrasikan Milvus membantu agen melampaui penalaran - memungkinkan memori yang gigih dan cerdas untuk kasus penggunaan di dunia nyata.</p>
<h2 id="Why-the-Chain-based-Design-Falls-Short" class="common-anchor-header">Mengapa Desain Berbasis Rantai Gagal<button data-href="#Why-the-Chain-based-Design-Falls-Short" class="anchor-icon" translate="no">
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
    </button></h2><p>Pada masa-masa awalnya (versi 0.x), arsitektur LangChain berpusat pada Rantai. Setiap Chain mendefinisikan urutan tetap dan dilengkapi dengan templat yang sudah dibuat sebelumnya yang membuat orkestrasi LLM menjadi sederhana dan cepat. Desain ini sangat bagus untuk membangun prototipe dengan cepat. Tetapi ketika ekosistem LLM berevolusi dan kasus penggunaan di dunia nyata menjadi lebih kompleks, celah-celah dalam arsitektur ini mulai terlihat.</p>
<p><strong>1. Kurangnya Fleksibilitas</strong></p>
<p>Versi awal LangChain menyediakan jalur pipa modular seperti SimpleSequentialChain atau LLMChain, masing-masing mengikuti alur tetap dan linier - pembuatan → pemanggilan model → pemrosesan keluaran. Desain ini bekerja dengan baik untuk tugas-tugas yang sederhana dan dapat diprediksi serta memudahkan pembuatan prototipe dengan cepat.</p>
<p>Namun, ketika aplikasi menjadi lebih dinamis, template yang kaku ini mulai terasa membatasi. Ketika logika bisnis tidak lagi sesuai dengan urutan yang telah ditentukan, Anda memiliki dua pilihan yang tidak memuaskan: memaksa logika Anda untuk menyesuaikan diri dengan kerangka kerja atau melewatinya sepenuhnya dengan memanggil API LLM secara langsung.</p>
<p><strong>2. Kurangnya Kontrol Tingkat Produksi</strong></p>
<p>Apa yang bekerja dengan baik dalam demo sering kali rusak dalam produksi. Rantai tidak menyertakan perlindungan yang diperlukan untuk aplikasi berskala besar, persisten, atau sensitif. Masalah umum yang termasuk:</p>
<ul>
<li><p><strong>Konteks meluap:</strong> Percakapan yang panjang dapat melebihi batas token, menyebabkan crash atau pemotongan diam.</p></li>
<li><p><strong>Kebocoran data sensitif:</strong> Informasi yang dapat diidentifikasi secara pribadi (seperti email atau ID) dapat secara tidak sengaja dikirim ke model pihak ketiga.</p></li>
<li><p><strong>Operasi tanpa pengawasan:</strong> Agen dapat menghapus data atau mengirim email tanpa persetujuan manusia.</p></li>
</ul>
<p><strong>3. Kurangnya Kompatibilitas Lintas Model</strong></p>
<p>Setiap penyedia LLM-OpenAI, Anthropic, dan banyak model Cina-menerapkan protokolnya sendiri untuk penalaran dan pemanggilan alat. Setiap kali Anda berganti penyedia, Anda harus menulis ulang lapisan integrasi: templat prompt, adaptor, dan pengurai respons. Pekerjaan yang berulang-ulang ini memperlambat pengembangan dan membuat eksperimen menjadi menyakitkan.</p>
<h2 id="LangChain-10-All-in-ReAct-Agent" class="common-anchor-header">LangChain 1.0: Agen ReAct yang lengkap<button data-href="#LangChain-10-All-in-ReAct-Agent" class="anchor-icon" translate="no">
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
    </button></h2><p>Ketika tim LangChain menganalisis ratusan implementasi agen tingkat produksi, satu wawasan menonjol: hampir semua agen yang sukses secara alami menyatu pada <strong>pola ReAct ("Penalaran + Tindakan")</strong>.</p>
<p>Baik dalam sistem multi-agen atau agen tunggal yang melakukan penalaran mendalam, loop kontrol yang sama muncul: bergantian antara langkah-langkah penalaran singkat dengan pemanggilan alat yang ditargetkan, kemudian memasukkan pengamatan yang dihasilkan ke dalam keputusan berikutnya sampai agen dapat memberikan jawaban akhir.</p>
<p>Untuk membangun struktur yang telah terbukti ini, LangChain 1.0 menempatkan loop ReAct sebagai inti dari arsitekturnya, menjadikannya struktur default untuk membangun agen yang dapat diandalkan, dapat ditafsirkan, dan siap produksi.</p>
<p>Untuk mendukung segala sesuatu mulai dari agen sederhana hingga orkestrasi yang rumit, LangChain 1.0 mengadopsi desain berlapis yang menggabungkan kemudahan penggunaan dengan kontrol yang tepat:</p>
<ul>
<li><p><strong>Skenario standar:</strong> Mulailah dengan fungsi create_agent () - perulangan ReAct yang bersih dan terstandardisasi yang menangani penalaran dan pemanggilan alat secara langsung.</p></li>
<li><p><strong>Skenario yang diperluas:</strong> Tambahkan Middleware untuk mendapatkan kontrol yang lebih baik. Middleware memungkinkan Anda memeriksa atau memodifikasi apa yang terjadi di dalam agen - misalnya, menambahkan deteksi PII, pos pemeriksaan persetujuan manusia, percobaan ulang otomatis, atau kait pemantauan.</p></li>
<li><p><strong>Skenario yang kompleks:</strong> Untuk alur kerja stateful atau orkestrasi multi-agen, gunakan LangGraph, mesin eksekusi berbasis grafik yang menyediakan kontrol yang tepat atas aliran logika, ketergantungan, dan status eksekusi.</p></li>
</ul>
<p>Sekarang mari kita uraikan tiga komponen utama yang membuat pengembangan agen menjadi lebih sederhana, lebih aman, dan lebih konsisten di seluruh model.</p>
<h3 id="1-The-createagent-A-Simpler-Way-to-Build-Agents" class="common-anchor-header">1. Fungsi create_agent(): Cara yang Lebih Sederhana untuk Membangun Agen</h3><p>Terobosan utama dalam LangChain 1.0 adalah bagaimana ia mengurangi kerumitan dalam membangun agen menjadi satu fungsi - create_agent(). Anda tidak perlu lagi menangani manajemen state, penanganan kesalahan, atau streaming output secara manual. Fitur-fitur tingkat produksi ini sekarang secara otomatis dikelola oleh runtime LangGraph di bawahnya.</p>
<p>Hanya dengan tiga parameter, Anda dapat meluncurkan agen yang berfungsi penuh:</p>
<ul>
<li><p><strong>model</strong> - pengenal model (string) atau objek model yang di-instansiasi.</p></li>
<li><p><strong>tools</strong> - daftar fungsi yang memberikan agen kemampuannya.</p></li>
<li><p><strong>system_prompt</strong> - instruksi yang mendefinisikan peran, nada, dan perilaku agen.</p></li>
</ul>
<p>Di bawah tenda, create_agent() berjalan pada perulangan agen standar - memanggil model, membiarkannya memilih alat untuk dieksekusi, dan menyelesaikannya ketika tidak ada lagi alat yang dibutuhkan:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/langchain_chain_1_1192c31ce3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Ia juga mewarisi kemampuan bawaan LangGraph untuk state persistence, pemulihan gangguan, dan streaming. Tugas-tugas yang dulunya membutuhkan ratusan baris kode orkestrasi sekarang ditangani melalui satu API deklaratif.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> langchain.<span class="hljs-property">agents</span> <span class="hljs-keyword">import</span> create_agent
agent = <span class="hljs-title function_">create_agent</span>(
    model=<span class="hljs-string">&quot;openai:gpt-4o&quot;</span>,
    tools=[get_weather, query_database],
    system_prompt=<span class="hljs-string">&quot;You are a customer service assistant who helps users check the weather and order information.&quot;</span>
)
result = agent.<span class="hljs-title function_">invoke</span>({
    <span class="hljs-string">&quot;messages&quot;</span>: [{<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: <span class="hljs-string">&quot;What’s the weather like in Shanghai today?&quot;</span>}]
})
<button class="copy-code-btn"></button></code></pre>
<h3 id="2-The-Middleware-A-Composable-Layer-for-Production-Ready-Control" class="common-anchor-header">2. Middleware: Lapisan yang Dapat Disusun untuk Kontrol yang Siap Produksi</h3><p>Middleware adalah jembatan utama yang membawa LangChain dari prototipe ke produksi. Middleware mengekspos hook pada titik-titik strategis dalam loop eksekusi agen, memungkinkan Anda untuk menambahkan logika khusus tanpa menulis ulang proses inti ReAct.</p>
<p>Putaran utama agen mengikuti proses keputusan tiga langkah - Model → Alat → Penghentian:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/langchain_1_0_chain_902054bde2.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>LangChain 1.0 menyediakan beberapa <a href="https://docs.langchain.com/oss/python/langchain/middleware#built-in-middleware">middleware</a> yang <a href="https://docs.langchain.com/oss/python/langchain/middleware#built-in-middleware">sudah</a> jadi untuk pola-pola umum. Berikut adalah empat contohnya.</p>
<ul>
<li><strong>Deteksi PII: Aplikasi apa pun yang menangani data pengguna yang sensitif</strong></li>
</ul>
<pre><code translate="no"><span class="hljs-keyword">from</span> langchain.agents <span class="hljs-keyword">import</span> create_agent
<span class="hljs-keyword">from</span> langchain.agents.middleware <span class="hljs-keyword">import</span> PIIMiddleware


agent = create_agent(
    model=<span class="hljs-string">&quot;gpt-4o&quot;</span>,
    tools=[],  <span class="hljs-comment"># Add tools as needed</span>
    middleware=[
        <span class="hljs-comment"># Redact emails in user input</span>
        PIIMiddleware(<span class="hljs-string">&quot;email&quot;</span>, strategy=<span class="hljs-string">&quot;redact&quot;</span>, apply_to_input=<span class="hljs-literal">True</span>),
        <span class="hljs-comment"># Mask credit cards (show last 4 digits)</span>
        PIIMiddleware(<span class="hljs-string">&quot;credit_card&quot;</span>, strategy=<span class="hljs-string">&quot;mask&quot;</span>, apply_to_input=<span class="hljs-literal">True</span>),
        <span class="hljs-comment"># Custom PII type with regex</span>
        PIIMiddleware(
            <span class="hljs-string">&quot;api_key&quot;</span>,
            detector=<span class="hljs-string">r&quot;sk-[a-zA-Z0-9]{32}&quot;</span>,
            strategy=<span class="hljs-string">&quot;block&quot;</span>,  <span class="hljs-comment"># Raise error if detected</span>
        ),
    ],
)
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><strong>Peringkasan: Secara otomatis meringkas riwayat percakapan ketika mendekati batas token.</strong></li>
</ul>
<pre><code translate="no"><span class="hljs-keyword">from</span> langchain.agents <span class="hljs-keyword">import</span> create_agent
<span class="hljs-keyword">from</span> langchain.agents.middleware <span class="hljs-keyword">import</span> SummarizationMiddleware


agent = create_agent(
    model=<span class="hljs-string">&quot;gpt-4o&quot;</span>,
    tools=[weather_tool, calculator_tool],
    middleware=[
        SummarizationMiddleware(
            model=<span class="hljs-string">&quot;gpt-4o-mini&quot;</span>,  <span class="hljs-comment">#Summarize using a cheaper model  </span>
            max_tokens_before_summary=<span class="hljs-number">4000</span>,  <span class="hljs-comment"># Trigger summarization at 4000 tokens</span>
            messages_to_keep=<span class="hljs-number">20</span>,  <span class="hljs-comment"># Keep last 20 messages after summary</span>
        ),
    ],
)
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><strong>Uji coba alat: Secara otomatis mencoba kembali panggilan alat yang gagal dengan backoff eksponensial yang dapat dikonfigurasi.</strong></li>
</ul>
<pre><code translate="no"><span class="hljs-keyword">from</span> langchain.agents <span class="hljs-keyword">import</span> create_agent
<span class="hljs-keyword">from</span> langchain.agents.middleware <span class="hljs-keyword">import</span> ToolRetryMiddleware
agent = create_agent(
    model=<span class="hljs-string">&quot;gpt-4o&quot;</span>,
    tools=[search_tool, database_tool],
    middleware=[
        ToolRetryMiddleware(
            max_retries=<span class="hljs-number">3</span>,  <span class="hljs-comment"># Retry up to 3 times</span>
            backoff_factor=<span class="hljs-number">2.0</span>,  <span class="hljs-comment"># Exponential backoff multiplier</span>
            initial_delay=<span class="hljs-number">1.0</span>,  <span class="hljs-comment"># Start with 1 second delay</span>
            max_delay=<span class="hljs-number">60.0</span>,  <span class="hljs-comment"># Cap delays at 60 seconds</span>
            jitter=<span class="hljs-literal">True</span>,  <span class="hljs-comment"># Add random jitter to avoid thundering herd (±25%)</span>

        ),
    ],
)
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><strong>Middleware Khusus</strong></li>
</ul>
<p>Selain opsi middleware resmi yang sudah ada sebelumnya, Anda juga dapat membuat middleware khusus menggunakan cara berbasis dekorator atau berbasis kelas.</p>
<p>Sebagai contoh, cuplikan di bawah ini menunjukkan cara mencatat pemanggilan model sebelum dieksekusi:</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> langchain.agents.middleware <span class="hljs-keyword">import</span> before_model
<span class="hljs-keyword">from</span> langchain.agents.middleware <span class="hljs-keyword">import</span> AgentState
<span class="hljs-keyword">from</span> langgraph.runtime <span class="hljs-keyword">import</span> Runtime
<span class="hljs-meta">@before_model</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">log_before_model</span>(<span class="hljs-params">state: AgentState, runtime: Runtime</span>) -&gt; <span class="hljs-built_in">dict</span> | <span class="hljs-literal">None</span>:
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;About to call model with <span class="hljs-subst">{<span class="hljs-built_in">len</span>(state[<span class="hljs-string">&#x27;messages&#x27;</span>])}</span> messages&quot;</span>)
    <span class="hljs-keyword">return</span> <span class="hljs-literal">None</span>  <span class="hljs-comment"># Returning None means the normal flow continues</span>
agent = create_agent(
    model=<span class="hljs-string">&quot;openai:gpt-4o&quot;</span>,
    tools=[...],
    middleware=[log_before_model],
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="3-Structured-Output-A-Standardized-Way-to-Handle-Data" class="common-anchor-header">3. Keluaran Terstruktur: Cara Terstandar untuk Menangani Data</h3><p>Dalam pengembangan agen tradisional, output terstruktur selalu sulit untuk dikelola. Setiap penyedia model menanganinya secara berbeda - misalnya, OpenAI menawarkan API Output Terstruktur asli, sementara yang lain hanya mendukung respons terstruktur secara tidak langsung melalui pemanggilan alat. Hal ini sering kali berarti menulis adaptor khusus untuk setiap penyedia, menambah pekerjaan ekstra dan membuat pemeliharaan lebih menyakitkan daripada yang seharusnya.</p>
<p>Di LangChain 1.0, output terstruktur ditangani secara langsung melalui parameter response_format di create_agent().  Anda hanya perlu mendefinisikan skema data Anda sekali saja. LangChain secara otomatis memilih strategi penegakan terbaik berdasarkan model yang Anda gunakan - tidak perlu pengaturan tambahan atau kode khusus vendor.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> langchain.agents <span class="hljs-keyword">import</span> create_agent
<span class="hljs-keyword">from</span> pydantic <span class="hljs-keyword">import</span> BaseModel, Field
<span class="hljs-keyword">class</span> <span class="hljs-title class_">WeatherReport</span>(<span class="hljs-title class_ inherited__">BaseModel</span>):
    location: <span class="hljs-built_in">str</span> = Field(description=<span class="hljs-string">&quot;City name&quot;</span>)
    temperature: <span class="hljs-built_in">float</span> = Field(description=<span class="hljs-string">&quot;Temperature (°C)&quot;</span>)
    condition: <span class="hljs-built_in">str</span> = Field(description=<span class="hljs-string">&quot;Weather condition&quot;</span>)
agent = create_agent(
    model=<span class="hljs-string">&quot;openai:gpt-4o&quot;</span>,
    tools=[get_weather],
    response_format=WeatherReport  <span class="hljs-comment"># Use the Pydantic model as the response schema</span>
)
result = agent.invoke({<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: <span class="hljs-string">&quot;What’s the weather like in Shanghai today??&quot;</span>})
weather_data = result[<span class="hljs-string">&#x27;structured_response&#x27;</span>]  <span class="hljs-comment"># Retrieve the structured response</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;<span class="hljs-subst">{weather_data.location}</span>: <span class="hljs-subst">{weather_data.temperature}</span>°C, <span class="hljs-subst">{weather_data.condition}</span>&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>LangChain mendukung dua strategi untuk output terstruktur:</p>
<p><strong>1. Strategi Penyedia:</strong> Beberapa penyedia model secara native mendukung output terstruktur melalui API mereka (misalnya OpenAI dan Grok). Ketika dukungan tersebut tersedia, LangChain menggunakan penegakan skema bawaan penyedia secara langsung. Pendekatan ini menawarkan tingkat keandalan dan konsistensi tertinggi, karena model itu sendiri menjamin format output.</p>
<p><strong>2. Strategi Pemanggilan Alat:</strong> Untuk model yang tidak mendukung output terstruktur asli, LangChain menggunakan pemanggilan alat untuk mencapai hasil yang sama.</p>
<p>Anda tidak perlu khawatir tentang strategi mana yang digunakan - kerangka kerja mendeteksi kemampuan model dan beradaptasi secara otomatis. Abstraksi ini memungkinkan Anda beralih di antara penyedia model yang berbeda secara bebas tanpa mengubah logika bisnis Anda.</p>
<h2 id="How-Milvus-Enhances-Agent-Memory" class="common-anchor-header">Bagaimana Milvus Meningkatkan Memori Agen<button data-href="#How-Milvus-Enhances-Agent-Memory" class="anchor-icon" translate="no">
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
    </button></h2><p>Untuk agen tingkat produksi, hambatan kinerja yang sebenarnya sering kali bukan pada mesin penalaran - tetapi pada sistem memori. Dalam LangChain 1.0, basis data vektor bertindak sebagai memori eksternal agen, memberikan daya ingat jangka panjang melalui pengambilan semantik.</p>
<p><a href="https://milvus.io/">Milvus</a> adalah salah satu basis data vektor sumber terbuka paling matang yang tersedia saat ini, yang dibuat khusus untuk pencarian vektor berskala besar dalam aplikasi AI. Milvus terintegrasi secara native dengan LangChain, sehingga Anda tidak perlu menangani vektorisasi, manajemen indeks, atau pencarian kemiripan secara manual. Paket langchain_milvus membungkus Milvus sebagai antarmuka VectorStore standar, memungkinkan Anda untuk menghubungkannya ke agen Anda hanya dengan beberapa baris kode.</p>
<p>Dengan demikian, Milvus menjawab tiga tantangan utama dalam membangun sistem memori agen yang dapat diskalakan dan dapat diandalkan:</p>
<h4 id="1-Fast-Retrieval-from-Massive-Knowledge-Bases" class="common-anchor-header"><strong>1. Pengambilan Cepat dari Basis Pengetahuan yang Masif</strong></h4><p>Ketika seorang agen perlu memproses ribuan dokumen, percakapan sebelumnya, atau manual produk, pencarian kata kunci yang sederhana tidaklah cukup. Milvus menggunakan pencarian kemiripan vektor untuk menemukan informasi yang relevan secara semantik dalam hitungan milidetik - bahkan jika kueri menggunakan kata-kata yang berbeda. Hal ini memungkinkan agen Anda untuk mengingat pengetahuan berdasarkan makna, bukan hanya pencocokan teks yang sama persis.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> langchain.agents <span class="hljs-keyword">import</span> create_agent
<span class="hljs-keyword">from</span> langchain_milvus <span class="hljs-keyword">import</span> Milvus
<span class="hljs-keyword">from</span> langchain_openai <span class="hljs-keyword">import</span> OpenAIEmbeddings
<span class="hljs-comment"># Initialize the vector database as a knowledge base</span>
vectorstore = Milvus(
    embedding=OpenAIEmbeddings(),  
    collection_name=<span class="hljs-string">&quot;company_knowledge&quot;</span>,
    connection_args={<span class="hljs-string">&quot;uri&quot;</span>: <span class="hljs-string">&quot;http://localhost:19530&quot;</span>}  <span class="hljs-comment">#</span>
)
<span class="hljs-comment"># Convert the retriever into a Tool for the Agent</span>
agent = create_agent(
    model=<span class="hljs-string">&quot;openai:gpt-4o&quot;</span>,
    tools=[vectorstore.as_retriever().as_tool(
        name=<span class="hljs-string">&quot;knowledge_search&quot;</span>,
        description=<span class="hljs-string">&quot;Search the company knowledge base to answer professional questions&quot;</span>
    )],
    system_prompt=<span class="hljs-string">&quot;You can retrieve information from the knowledge base to answer questions.&quot;</span>
)
<button class="copy-code-btn"></button></code></pre>
<h4 id="2-Persistent-Long-Term-Memory" class="common-anchor-header"><strong>2. Memori Jangka Panjang yang Persisten</strong></h4><p>SummarizationMiddleware LangChain dapat memadatkan riwayat percakapan jika terlalu panjang, tetapi apa yang terjadi dengan semua detail yang diringkas? Milvus menyimpannya. Setiap percakapan, pemanggilan alat, dan langkah penalaran dapat divisualisasikan dan disimpan untuk referensi jangka panjang. Saat dibutuhkan, agen dapat dengan cepat mengambil memori yang relevan melalui pencarian semantik, sehingga memungkinkan kesinambungan yang sebenarnya di seluruh sesi.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> langchain_milvus <span class="hljs-keyword">import</span> Milvus
<span class="hljs-keyword">from</span> langchain.agents <span class="hljs-keyword">import</span> create_agent
<span class="hljs-keyword">from</span> langchain.agents.middleware <span class="hljs-keyword">import</span> SummarizationMiddleware
<span class="hljs-keyword">from</span> langgraph.checkpoint.memory <span class="hljs-keyword">import</span> InMemorySaver
<span class="hljs-comment"># Long-term memory storage(Milvus)</span>
long_term_memory = Milvus.from_documents(
    documents=[],  <span class="hljs-comment"># Initially empty; dynamically updated at runtime</span>
    embedding=OpenAIEmbeddings(),
    connection_args={<span class="hljs-string">&quot;uri&quot;</span>: <span class="hljs-string">&quot;./agent_memory.db&quot;</span>}
)
<span class="hljs-comment"># Short-term memory management(LangGraph Checkpointer + Summarization)</span>
agent = create_agent(
    model=<span class="hljs-string">&quot;openai:gpt-4o&quot;</span>,
    tools=[long_term_memory.as_retriever().as_tool(
        name=<span class="hljs-string">&quot;recall_memory&quot;</span>,
        description=<span class="hljs-string">&quot;Retrieve the agent’s historical memories and past experiences&quot;</span>
    )],
    checkpointer=InMemorySaver(),  <span class="hljs-comment"># Short-term memory</span>
    middleware=[
        SummarizationMiddleware(
            model=<span class="hljs-string">&quot;openai:gpt-4o-mini&quot;</span>,
            max_tokens_before_summary=<span class="hljs-number">4000</span>  <span class="hljs-comment"># When the threshold is exceeded, summarize and store it in Milvus</span>
        )
    ]
)
<button class="copy-code-btn"></button></code></pre>
<h4 id="3-Unified-Management-of-Multimodal-Content" class="common-anchor-header"><strong>3. Manajemen Terpadu Konten Multimodal</strong></h4><p>Agen modern menangani lebih dari sekadar teks - mereka berinteraksi dengan gambar, audio, dan video. Milvus mendukung penyimpanan multi-vektor dan skema dinamis, sehingga Anda dapat mengelola penyematan dari berbagai modalitas dalam satu sistem. Hal ini memberikan fondasi memori terpadu untuk agen multimodal, memungkinkan pengambilan yang konsisten di berbagai jenis data.</p>
<pre><code translate="no"><span class="hljs-comment"># Filter retrievals by source (e.g., search only medical reports)</span>
vectorstore.similarity_search(
    query=<span class="hljs-string">&quot;What is the patient&#x27;s blood pressure reading?&quot;</span>,
    k=<span class="hljs-number">3</span>,
    expr=<span class="hljs-string">&quot;source == &#x27;medical_reports&#x27; AND modality == &#x27;text&#x27;&quot;</span>  <span class="hljs-comment"># Milvus scalar filtering</span>
)
<button class="copy-code-btn"></button></code></pre>
<h2 id="LangChain-vs-LangGraph-How-to-Choose-the-One-That-Fits-for-Your-Agents" class="common-anchor-header">LangChain vs LangGraph: Cara Memilih yang Cocok untuk Agen Anda<button data-href="#LangChain-vs-LangGraph-How-to-Choose-the-One-That-Fits-for-Your-Agents" class="anchor-icon" translate="no">
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
    </button></h2><p>Meningkatkan ke LangChain 1.0 adalah langkah penting untuk membangun agen kelas produksi - tetapi itu tidak berarti itu selalu menjadi satu-satunya pilihan terbaik untuk setiap kasus penggunaan. Memilih kerangka kerja yang tepat menentukan seberapa cepat Anda dapat menggabungkan kemampuan ini ke dalam sistem yang berfungsi dan dapat dipelihara.</p>
<p>Sebenarnya, LangChain 1.0 dan LangGraph 1.0 dapat dilihat sebagai bagian dari tumpukan berlapis yang sama, yang dirancang untuk bekerja bersama daripada saling menggantikan: LangChain membantu Anda membangun agen standar dengan cepat, sementara LangGraph memberikan Anda kontrol yang lebih baik untuk alur kerja yang kompleks. Dengan kata lain, LangChain membantu Anda bergerak cepat, sementara LangGraph membantu Anda masuk lebih dalam.</p>
<p>Di bawah ini adalah perbandingan singkat tentang bagaimana mereka berbeda dalam pemosisian teknis:</p>
<table>
<thead>
<tr><th><strong>Dimensi</strong></th><th><strong>LangChain 1.0</strong></th><th><strong>LangChain 1.0</strong></th></tr>
</thead>
<tbody>
<tr><td><strong>Tingkat Abstraksi</strong></td><td>Abstraksi tingkat tinggi, dirancang untuk skenario agen standar</td><td>Kerangka kerja orkestrasi tingkat rendah, dirancang untuk alur kerja yang kompleks</td></tr>
<tr><td><strong>Kemampuan Inti</strong></td><td>Perulangan ReAct standar (Alasan → Panggilan Alat → Pengamatan → Tanggapan)</td><td>Mesin status khusus dan logika percabangan yang kompleks (StateGraph + Perutean Bersyarat)</td></tr>
<tr><td><strong>Mekanisme Ekstensi</strong></td><td>Middleware untuk kemampuan tingkat produksi</td><td>Manajemen manual untuk node, edge, dan transisi state</td></tr>
<tr><td><strong>Implementasi yang Mendasari</strong></td><td>Manajemen manual dari node, edge, dan transisi state</td><td>Runtime asli dengan persistensi dan pemulihan bawaan</td></tr>
<tr><td><strong>Kasus Penggunaan Umum</strong></td><td>80% dari skenario agen standar</td><td>Kolaborasi multi-agen dan orkestrasi alur kerja jangka panjang</td></tr>
<tr><td><strong>Kurva Pembelajaran</strong></td><td>Membangun agen dalam ~10 baris kode</td><td>Membutuhkan pemahaman tentang state graph dan orkestrasi node</td></tr>
</tbody>
</table>
<p>Jika Anda baru dalam membangun agen atau ingin membuat proyek berjalan dengan cepat, mulailah dengan LangChain. Jika Anda sudah mengetahui kasus penggunaan Anda membutuhkan orkestrasi yang kompleks, kolaborasi multi-agen, atau alur kerja yang sudah berjalan lama, langsung saja ke LangGraph.</p>
<p>Kedua kerangka kerja ini dapat hidup berdampingan dalam proyek yang sama - Anda dapat memulai dari yang sederhana dengan LangChain dan menggunakan LangGraph ketika sistem Anda membutuhkan lebih banyak kontrol dan fleksibilitas. Kuncinya adalah memilih alat yang tepat untuk setiap bagian dari alur kerja Anda.</p>
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
    </button></h2><p>Tiga tahun yang lalu, LangChain dimulai sebagai pembungkus yang ringan untuk memanggil LLM. Saat ini, ia telah berkembang menjadi kerangka kerja tingkat produksi yang lengkap.</p>
<p>Pada intinya, lapisan middleware memberikan keamanan, kepatuhan, dan kemampuan pengamatan. LangGraph menambahkan eksekusi yang terus-menerus, aliran kontrol, dan manajemen state. Dan pada lapisan memori, <a href="https://milvus.io/">Milvus</a> mengisi celah kritis - menyediakan memori jangka panjang yang dapat diskalakan dan dapat diandalkan yang memungkinkan agen untuk mengambil konteks, menalar sejarah, dan meningkatkannya dari waktu ke waktu.</p>
<p>Bersama-sama, LangChain, LangGraph, dan Milvus membentuk sebuah rantai alat praktis untuk era agen modern - menjembatani pembuatan prototipe yang cepat dengan penerapan skala perusahaan, tanpa mengorbankan keandalan atau kinerja.</p>
<p>🚀 Siap memberi agen Anda memori jangka panjang yang andal? Jelajahi <a href="https://milvus.io">Milvus</a> dan lihat bagaimana <a href="https://milvus.io">Milvus</a> mendukung memori jangka panjang yang cerdas untuk agen LangChain dalam produksi.</p>
<p>Ada pertanyaan atau ingin mendalami fitur apa pun? Bergabunglah dengan <a href="https://discord.com/invite/8uyFbECzPX">saluran Discord</a> kami atau ajukan pertanyaan di <a href="https://github.com/milvus-io/milvus">GitHub</a>. Anda juga dapat memesan sesi tatap muka selama 20 menit untuk mendapatkan wawasan, panduan, dan jawaban atas pertanyaan Anda melalui <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">Jam Kerja Milvus</a>.</p>
