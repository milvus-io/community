---
id: how-to-build-productionready-ai-agents-with-deep-agents-and-milvus.md
title: Cara Membangun Agen AI yang Siap Produksi dengan Deep Agents dan Milvus
author: Min Yin
date: 2026-03-02T00:00:00.000Z
cover: assets.zilliz.com/cover_deepagents_b45edd5f94.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  Deep Agents, AI agents, Milvus vector database, LangChain agents, persistent
  agent memory
meta_title: |
  How to Build Production-Ready AI Agents with Deep Agents
desc: >-
  Pelajari cara membuat agen AI yang dapat diskalakan menggunakan Deep Agents
  dan Milvus untuk tugas-tugas yang berjalan lama, biaya token yang lebih
  rendah, dan memori yang tahan lama.
origin: >-
  https://milvus.io/blog/how-to-build-productionready-ai-agents-with-deep-agents-and-milvus.md
---
<p>Semakin banyak tim yang membangun agen AI, dan tugas yang mereka berikan kepada agen tersebut menjadi lebih kompleks. Banyak alur kerja di dunia nyata yang melibatkan pekerjaan yang berjalan lama dengan banyak langkah dan banyak pemanggilan alat. Ketika tugas-tugas ini berkembang, dua masalah muncul dengan cepat: biaya token yang lebih tinggi dan batas jendela konteks model. Agen juga sering kali perlu mengingat informasi di seluruh sesi, seperti hasil penelitian sebelumnya, preferensi pengguna, atau percakapan sebelumnya.</p>
<p>Kerangka kerja seperti <a href="https://docs.langchain.com/oss/python/deepagents/overview"><strong>Deep Agents</strong></a>, yang dirilis oleh LangChain, membantu mengatur alur kerja ini. Ini menyediakan cara terstruktur untuk menjalankan agen, dengan dukungan untuk perencanaan tugas, akses file, dan pendelegasian sub-agen. Hal ini memudahkan untuk membangun agen yang dapat menangani tugas-tugas yang panjang dan multi-langkah dengan lebih andal.</p>
<p>Namun, alur kerja saja tidak cukup. Agen juga membutuhkan <strong>memori jangka panjang</strong> agar dapat mengambil informasi yang berguna dari sesi sebelumnya. Di sinilah <a href="https://milvus.io/"><strong>Milvus</strong></a>, sebuah basis data vektor sumber terbuka, berperan. Dengan menyimpan embeddings dari percakapan, dokumen, dan hasil alat, Milvus memungkinkan agen untuk mencari dan mengingat kembali pengetahuan sebelumnya.</p>
<p>Dalam artikel ini, kami akan menjelaskan cara kerja Deep Agents dan menunjukkan cara menggabungkannya dengan Milvus untuk membangun agen AI dengan alur kerja yang terstruktur dan memori jangka panjang.</p>
<h2 id="What-Is-Deep-Agents" class="common-anchor-header">Apa itu Deep Agents?<button data-href="#What-Is-Deep-Agents" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Deep Agents</strong> adalah kerangka kerja agen sumber terbuka yang dibangun oleh tim LangChain. Ini dirancang untuk membantu agen menangani tugas-tugas jangka panjang dan multi-langkah dengan lebih andal. Ini berfokus pada tiga kemampuan utama:</p>
<p><strong>1. Perencanaan Tugas</strong></p>
<p>Deep Agents mencakup alat bawaan seperti <code translate="no">write_todos</code> dan <code translate="no">read_todos</code>. Agen memecah tugas yang kompleks menjadi daftar tugas yang jelas, kemudian mengerjakan setiap item langkah demi langkah, menandai tugas yang sudah selesai.</p>
<p><strong>2. Akses Sistem File</strong></p>
<p>Ini menyediakan alat seperti <code translate="no">ls</code>, <code translate="no">read_file</code>, dan <code translate="no">write_file</code>, sehingga agen dapat melihat, membaca, dan menulis file. Jika sebuah alat menghasilkan output yang besar, hasilnya secara otomatis disimpan ke sebuah file dan bukannya tetap berada di jendela konteks model. Hal ini membantu mencegah jendela konteks menjadi penuh.</p>
<p><strong>3. Pendelegasian Sub-agen</strong></p>
<p>Dengan menggunakan alat <code translate="no">task</code>, agen utama dapat menyerahkan sub-tugas kepada sub-agen khusus. Setiap sub-agen memiliki jendela konteks dan alatnya sendiri, yang membantu menjaga pekerjaan tetap teratur.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/1_59401bc198.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Secara teknis, agen yang dibuat dengan <code translate="no">create_deep_agent</code> adalah <strong>StateGraph LangGraph</strong> yang dikompilasi. (LangGraph adalah pustaka alur kerja yang dikembangkan oleh tim LangChain, dan StateGraph adalah struktur state intinya). Karena itu, Deep Agents dapat secara langsung menggunakan fitur-fitur LangGraph seperti streaming output, checkpointing, dan interaksi human-in-the-loop.</p>
<p><strong>Jadi, apa yang membuat Deep Agents berguna dalam praktiknya?</strong></p>
<p>Tugas agen yang sudah berjalan lama sering kali menghadapi masalah seperti batasan konteks, biaya token yang tinggi, dan eksekusi yang tidak dapat diandalkan. Deep Agents membantu menyelesaikan masalah ini dengan membuat alur kerja agen lebih terstruktur dan lebih mudah dikelola. Dengan mengurangi pertumbuhan konteks yang tidak perlu, hal ini menurunkan penggunaan token dan membuat tugas-tugas yang sudah berjalan lama menjadi lebih hemat biaya.</p>
<p>Hal ini juga membuat tugas-tugas yang kompleks dan multi-langkah menjadi lebih mudah diatur. Subtugas dapat berjalan secara independen tanpa mengganggu satu sama lain, yang meningkatkan keandalan. Pada saat yang sama, sistem ini fleksibel, memungkinkan pengembang untuk menyesuaikan dan mengembangkannya seiring pertumbuhan agen mereka dari eksperimen sederhana hingga aplikasi produksi.</p>
<h2 id="Customization-in-Deep-Agents" class="common-anchor-header">Kustomisasi di Agen Dalam<button data-href="#Customization-in-Deep-Agents" class="anchor-icon" translate="no">
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
    </button></h2><p>Kerangka kerja umum tidak dapat mencakup semua industri atau kebutuhan bisnis. Deep Agents dirancang agar fleksibel, sehingga pengembang dapat menyesuaikannya agar sesuai dengan kasus penggunaan mereka sendiri.</p>
<p>Dengan kustomisasi, Anda bisa:</p>
<ul>
<li><p>Menghubungkan alat bantu dan API internal Anda sendiri</p></li>
<li><p>Menetapkan alur kerja khusus domain</p></li>
<li><p>Memastikan agen mengikuti aturan bisnis</p></li>
<li><p>Mendukung memori dan berbagi pengetahuan di seluruh sesi</p></li>
</ul>
<p>Berikut ini adalah cara utama untuk menyesuaikan Deep Agents:</p>
<h3 id="System-Prompt-Customization" class="common-anchor-header">Kustomisasi Prompt Sistem</h3><p>Anda dapat menambahkan prompt sistem Anda sendiri di atas instruksi default yang disediakan oleh middleware. Ini berguna untuk mendefinisikan aturan domain dan alur kerja.</p>
<p>Prompt kustom yang baik dapat mencakup:</p>
<ul>
<li><strong>Aturan alur kerja domain</strong></li>
</ul>
<p>Contoh: "Untuk tugas analisis data, selalu jalankan analisis eksplorasi sebelum membangun model."</p>
<ul>
<li><strong>Contoh spesifik</strong></li>
</ul>
<p>Contoh: "Gabungkan permintaan pencarian literatur yang serupa ke dalam satu item tugas."</p>
<ul>
<li><strong>Aturan penghentian</strong></li>
</ul>
<p>Contoh: "Hentikan jika lebih dari 100 panggilan alat digunakan."</p>
<ul>
<li><strong>Panduan koordinasi alat</strong></li>
</ul>
<p>Contoh: "Gunakan <code translate="no">grep</code> untuk menemukan lokasi kode, lalu gunakan <code translate="no">read_file</code> untuk melihat detailnya."</p>
<p>Hindari mengulang instruksi yang sudah ditangani oleh middleware, dan hindari menambahkan aturan yang bertentangan dengan perilaku default.</p>
<h3 id="Tools" class="common-anchor-header">Alat</h3><p>Anda dapat menambahkan alat Anda sendiri ke toolset bawaan. Tools didefinisikan sebagai fungsi Python biasa, dan docstrings-nya menjelaskan apa yang mereka lakukan.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> deepagents <span class="hljs-keyword">import</span> create_deep_agent
<span class="hljs-keyword">def</span> <span class="hljs-title function_">internet_search</span>(<span class="hljs-params">query: <span class="hljs-built_in">str</span></span>) -&gt; <span class="hljs-built_in">str</span>:
    <span class="hljs-string">&quot;&quot;&quot;Run a web search&quot;&quot;&quot;</span>
    <span class="hljs-keyword">return</span> tavily_client.search(query)
agent = create_deep_agent(tools=[internet_search])
<button class="copy-code-btn"></button></code></pre>
<p>Deep Agents juga mendukung tools yang mengikuti standar Model Context Protocol (MCP) melalui <code translate="no">langchain-mcp-adapters</code>.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> langchain_mcp_adapters.client <span class="hljs-keyword">import</span> MultiServerMCPClient
<span class="hljs-keyword">from</span> deepagents <span class="hljs-keyword">import</span> create_deep_agent
<span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">main</span>():
    mcp_client = MultiServerMCPClient(...)
    mcp_tools = <span class="hljs-keyword">await</span> mcp_client.get_tools()
    agent = create_deep_agent(tools=mcp_tools)
    <span class="hljs-keyword">async</span> <span class="hljs-keyword">for</span> chunk <span class="hljs-keyword">in</span> agent.astream({<span class="hljs-string">&quot;messages&quot;</span>: [{<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: <span class="hljs-string">&quot;...&quot;</span>}]}):
        chunk[<span class="hljs-string">&quot;messages&quot;</span>][-<span class="hljs-number">1</span>].pretty_print()
<button class="copy-code-btn"></button></code></pre>
<h3 id="Middleware" class="common-anchor-header">Middleware</h3><p>Anda dapat menulis middleware khusus untuk:</p>
<ul>
<li><p>Menambah atau memodifikasi alat</p></li>
<li><p>Menyesuaikan petunjuk</p></li>
<li><p>Menghubungkan ke berbagai tahap eksekusi agen</p></li>
</ul>
<pre><code translate="no"><span class="hljs-keyword">from</span> langchain_core.tools <span class="hljs-keyword">import</span> tool
<span class="hljs-keyword">from</span> deepagents <span class="hljs-keyword">import</span> create_deep_agent
<span class="hljs-keyword">from</span> deepagents.middleware <span class="hljs-keyword">import</span> AgentMiddleware
<span class="hljs-meta">@tool</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">get_weather</span>(<span class="hljs-params">city: <span class="hljs-built_in">str</span></span>) -&gt; <span class="hljs-built_in">str</span>:
    <span class="hljs-string">&quot;&quot;&quot;Get the weather in a city.&quot;&quot;&quot;</span>
    <span class="hljs-keyword">return</span> <span class="hljs-string">f&quot;The weather in <span class="hljs-subst">{city}</span> is sunny.&quot;</span>
<span class="hljs-keyword">class</span> <span class="hljs-title class_">WeatherMiddleware</span>(<span class="hljs-title class_ inherited__">AgentMiddleware</span>):
    tools = [get_weather]
agent = create_deep_agent(middleware=[WeatherMiddleware()])
<button class="copy-code-btn"></button></code></pre>
<p>Deep Agents juga menyertakan middleware bawaan untuk perencanaan, manajemen sub-agen, dan kontrol eksekusi.</p>
<table>
<thead>
<tr><th>Middleware</th><th>Fungsi</th></tr>
</thead>
<tbody>
<tr><td>TodoListMiddleware</td><td>Menyediakan alat tulis_todos dan baca_todos untuk mengelola daftar tugas</td></tr>
<tr><td>FilesystemMiddleware</td><td>Menyediakan alat operasi file dan secara otomatis menyimpan output alat yang besar</td></tr>
<tr><td>SubAgentMiddleware</td><td>Menyediakan alat tugas untuk mendelegasikan pekerjaan ke sub-agen</td></tr>
<tr><td>SummarizationMiddleware</td><td>Meringkas secara otomatis ketika konteks melebihi 170 ribu token</td></tr>
<tr><td>AnthropicPromptCachingMiddleware</td><td>Mengaktifkan cache cepat untuk model Anthropic</td></tr>
<tr><td>PatchToolCallsMiddleware</td><td>Memperbaiki pemanggilan alat yang tidak lengkap yang disebabkan oleh interupsi</td></tr>
<tr><td>HumanInTheLoopMiddleware</td><td>Mengonfigurasi alat yang memerlukan persetujuan manusia</td></tr>
</tbody>
</table>
<h3 id="Sub-agents" class="common-anchor-header">Sub-agen</h3><p>Agen utama dapat mendelegasikan subtugas ke sub-agen menggunakan alat <code translate="no">task</code>. Setiap sub-agen berjalan di jendela konteksnya sendiri dan memiliki alat bantu dan prompt sistemnya sendiri.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> deepagents <span class="hljs-keyword">import</span> create_deep_agent
research_subagent = {
    <span class="hljs-string">&quot;name&quot;</span>: <span class="hljs-string">&quot;research-agent&quot;</span>,
    <span class="hljs-string">&quot;description&quot;</span>: <span class="hljs-string">&quot;Used to research in-depth questions&quot;</span>,
    <span class="hljs-string">&quot;prompt&quot;</span>: <span class="hljs-string">&quot;You are an expert researcher&quot;</span>,
    <span class="hljs-string">&quot;tools&quot;</span>: [internet_search],
    <span class="hljs-string">&quot;model&quot;</span>: <span class="hljs-string">&quot;openai:gpt-4o&quot;</span>,  <span class="hljs-comment"># Optional, defaults to main agent model</span>
}
agent = create_deep_agent(subagents=[research_subagent])
<button class="copy-code-btn"></button></code></pre>
<p>Untuk kasus penggunaan tingkat lanjut, Anda bahkan dapat meneruskan alur kerja LangGraph yang telah dibuat sebelumnya sebagai sub-agen.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> deepagents <span class="hljs-keyword">import</span> <span class="hljs-title class_">CompiledSubAgent</span>, create_deep_agent
custom_graph = <span class="hljs-title function_">create_agent</span>(model=..., tools=..., prompt=...)
agent = <span class="hljs-title function_">create_deep_agent</span>(
    subagents=[<span class="hljs-title class_">CompiledSubAgent</span>(
        name=<span class="hljs-string">&quot;data-analyzer&quot;</span>,
        description=<span class="hljs-string">&quot;Specialized agent for data analysis&quot;</span>,
        runnable=custom_graph
    )]
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="interrupton-Human-Approval-Control" class="common-anchor-header"><code translate="no">interrupt_on</code> (Kontrol Persetujuan Manusia)</h3><p>Anda dapat menentukan alat tertentu yang memerlukan persetujuan manusia menggunakan parameter <code translate="no">interrupt_on</code>. Ketika agen memanggil salah satu alat ini, eksekusi akan berhenti sejenak sampai seseorang meninjau dan menyetujuinya.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> langchain_core.tools <span class="hljs-keyword">import</span> tool
<span class="hljs-keyword">from</span> deepagents <span class="hljs-keyword">import</span> create_deep_agent
<span class="hljs-keyword">from</span> langgraph.checkpoint.memory <span class="hljs-keyword">import</span> MemorySaver
<span class="hljs-meta">@tool</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">delete_file</span>(<span class="hljs-params">path: <span class="hljs-built_in">str</span></span>) -&gt; <span class="hljs-built_in">str</span>:
    <span class="hljs-string">&quot;&quot;&quot;Delete a file from the filesystem.&quot;&quot;&quot;</span>
    <span class="hljs-keyword">return</span> <span class="hljs-string">f&quot;Deleted <span class="hljs-subst">{path}</span>&quot;</span>
agent = create_deep_agent(
    tools=[delete_file],
    interrupt_on={
        <span class="hljs-string">&quot;delete_file&quot;</span>: {
            <span class="hljs-string">&quot;allowed_decisions&quot;</span>: [<span class="hljs-string">&quot;approve&quot;</span>, <span class="hljs-string">&quot;edit&quot;</span>, <span class="hljs-string">&quot;reject&quot;</span>]
        }
    },
    checkpointer=MemorySaver()
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Backend-Customization-Storage" class="common-anchor-header">Kustomisasi Backend (Penyimpanan)</h3><p>Anda dapat memilih backend penyimpanan yang berbeda untuk mengontrol bagaimana file ditangani. Opsi yang tersedia saat ini meliputi:</p>
<ul>
<li><p><strong>StateBackend</strong> (penyimpanan sementara)</p></li>
<li><p><strong>FilesystemBackend</strong> (penyimpanan disk lokal)</p></li>
</ul>
<pre><code translate="no"><span class="hljs-title class_">StoreBackend</span>(persistent storage)、<span class="hljs-title class_">CompositeBackend</span>(hybrid routing)。
<span class="hljs-keyword">from</span> deepagents <span class="hljs-keyword">import</span> create_deep_agent
<span class="hljs-keyword">from</span> deepagents.<span class="hljs-property">backends</span> <span class="hljs-keyword">import</span> <span class="hljs-title class_">FilesystemBackend</span>
agent = <span class="hljs-title function_">create_deep_agent</span>(
    backend=<span class="hljs-title class_">FilesystemBackend</span>(root_dir=<span class="hljs-string">&quot;/path/to/project&quot;</span>)
)
<button class="copy-code-btn"></button></code></pre>
<p>Dengan mengubah backend, Anda dapat menyesuaikan perilaku penyimpanan file tanpa mengubah desain sistem secara keseluruhan.</p>
<h2 id="Why-Use-Deep-Agents-with-Milvus-for-AI-Agents" class="common-anchor-header">Mengapa Menggunakan Deep Agents dengan Milvus untuk Agen AI?<button data-href="#Why-Use-Deep-Agents-with-Milvus-for-AI-Agents" class="anchor-icon" translate="no">
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
    </button></h2><p>Dalam aplikasi nyata, agen sering kali membutuhkan memori yang bertahan di seluruh sesi. Misalnya, mereka mungkin perlu mengingat preferensi pengguna, membangun pengetahuan domain dari waktu ke waktu, merekam umpan balik untuk menyesuaikan perilaku, atau melacak tugas penelitian jangka panjang.</p>
<p>Secara default, Deep Agents menggunakan <code translate="no">StateBackend</code>, yang hanya menyimpan data selama satu sesi. Ketika sesi berakhir, semuanya akan dihapus. Ini berarti tidak dapat mendukung memori jangka panjang, memori lintas sesi.</p>
<p>Untuk mengaktifkan memori persisten, kami menggunakan <a href="https://milvus.io/"><strong>Milvus</strong></a> sebagai basis data vektor bersama dengan <code translate="no">StoreBackend</code>. Begini cara kerjanya: konten percakapan penting dan hasil alat dikonversi menjadi embedding (vektor numerik yang mewakili makna) dan disimpan di Milvus. Ketika tugas baru dimulai, agen melakukan pencarian semantik untuk mengambil memori masa lalu yang terkait. Hal ini memungkinkan agen untuk "mengingat" informasi yang relevan dari sesi sebelumnya.</p>
<p>Milvus sangat cocok untuk kasus penggunaan ini karena arsitektur pemisahan komputasi-penyimpanannya. Ini mendukung:</p>
<ul>
<li><p>Penskalaan horizontal hingga puluhan miliar vektor</p></li>
<li><p>Kueri dengan jumlah besar</p></li>
<li><p>Pembaruan data secara real-time</p></li>
<li><p>Penerapan siap produksi untuk sistem berskala besar</p></li>
</ul>
<p>Secara teknis, Deep Agents menggunakan <code translate="no">CompositeBackend</code> untuk merutekan jalur yang berbeda ke backend penyimpanan yang berbeda:</p>
<table>
<thead>
<tr><th>Jalur</th><th>Backend</th><th>Tujuan</th></tr>
</thead>
<tbody>
<tr><td>/ruang kerja/, /temp/</td><td>StateBackend</td><td>Data sementara, dihapus setelah sesi</td></tr>
<tr><td>/memories/, /pengetahuan/</td><td>StoreBackend + Milvus</td><td>Data persisten, dapat dicari di seluruh sesi</td></tr>
</tbody>
</table>
<p>Dengan pengaturan ini, pengembang hanya perlu menyimpan data jangka panjang di bawah jalur seperti <code translate="no">/memories/</code>. Sistem secara otomatis menangani memori lintas sesi. Langkah-langkah konfigurasi terperinci disediakan di bagian di bawah ini.</p>
<h2 id="Hands-on-Build-an-AI-Agent-with-Long-Term-Memory-Using-Milvus-and-Deep-Agents" class="common-anchor-header">Praktik langsung: Membangun Agen AI dengan Memori Jangka Panjang Menggunakan Milvus dan Agen Deep<button data-href="#Hands-on-Build-an-AI-Agent-with-Long-Term-Memory-Using-Milvus-and-Deep-Agents" class="anchor-icon" translate="no">
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
    </button></h2><p>Contoh ini menunjukkan cara memberikan memori persisten kepada agen berbasis DeepAgents menggunakan Milvus.</p>
<h3 id="Step-1-Install-dependencies" class="common-anchor-header">Langkah 1: Instal dependensi</h3><pre><code translate="no">pip install deepagents tavily-python langchain-milvus
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-2-Set-up-the-memory-backend" class="common-anchor-header">Langkah 2: Siapkan backend memori</h3><pre><code translate="no"><span class="hljs-keyword">from</span> deepagents.backends <span class="hljs-keyword">import</span> CompositeBackend, StateBackend, StoreBackend
<span class="hljs-keyword">from</span> langchain_milvus.storage <span class="hljs-keyword">import</span> MilvusStore
<span class="hljs-comment"># from langgraph.store.memory import InMemoryStore # for testing only</span>
<span class="hljs-comment"># Configure Milvus storage</span>
milvus_store = MilvusStore(
    collection_name=<span class="hljs-string">&quot;agent_memories&quot;</span>,
    embedding_service=... <span class="hljs-comment"># embedding is required here, or use MilvusStore default configuration</span>
)
backend = CompositeBackend(
    default=StateBackend(),
    routes={<span class="hljs-string">&quot;/memories/&quot;</span>: StoreBackend(store=InMemoryStore())} 
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-3-Create-the-agent" class="common-anchor-header">Langkah 3: Membuat agen</h3><pre><code translate="no"><span class="hljs-keyword">from</span> tavily <span class="hljs-keyword">import</span> TavilyClient
<span class="hljs-keyword">import</span> os
tavily_client = TavilyClient(api_key=os.environ[<span class="hljs-string">&quot;TAVILY_API_KEY&quot;</span>])
<span class="hljs-keyword">def</span> <span class="hljs-title function_">internet_search</span>(<span class="hljs-params">query: <span class="hljs-built_in">str</span>, max_results: <span class="hljs-built_in">int</span> = <span class="hljs-number">5</span></span>) -&gt; <span class="hljs-built_in">str</span>:
    <span class="hljs-string">&quot;&quot;&quot;Perform an internet search&quot;&quot;&quot;</span>
    results = tavily_client.search(query, max_results=max_results)
    <span class="hljs-keyword">return</span> <span class="hljs-string">&quot;\n&quot;</span>.join([<span class="hljs-string">f&quot;<span class="hljs-subst">{r[<span class="hljs-string">&#x27;title&#x27;</span>]}</span>: <span class="hljs-subst">{r[<span class="hljs-string">&#x27;content&#x27;</span>]}</span>&quot;</span> <span class="hljs-keyword">for</span> r <span class="hljs-keyword">in</span> results[<span class="hljs-string">&quot;results&quot;</span>]])
agent = create_deep_agent(
    tools=[internet_search],
    system_prompt=<span class="hljs-string">&quot;You are a research expert. Write important findings to the /memories/ directory for cross-session reuse.&quot;</span>,
    backend=backend
)
<span class="hljs-comment"># Run the agent</span>
result = agent.invoke({
    <span class="hljs-string">&quot;messages&quot;</span>: [{<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: <span class="hljs-string">&quot;Research the technical features of the Milvus vector database&quot;</span>}]
})
<button class="copy-code-btn"></button></code></pre>
<p><strong>Poin-poin penting</strong></p>
<ul>
<li><strong>Jalur persisten</strong></li>
</ul>
<p>Semua berkas yang disimpan di bawah <code translate="no">/memories/</code> akan disimpan secara permanen dan dapat diakses di berbagai sesi.</p>
<ul>
<li><strong>Penyiapan produksi</strong></li>
</ul>
<p>Contoh ini menggunakan <code translate="no">InMemoryStore()</code> untuk pengujian. Dalam produksi, gantilah dengan adaptor Milvus untuk mengaktifkan pencarian semantik yang dapat diskalakan.</p>
<ul>
<li><strong>Memori otomatis</strong></li>
</ul>
<p>Agen secara otomatis menyimpan hasil penelitian dan keluaran penting ke folder <code translate="no">/memories/</code>. Pada tugas-tugas selanjutnya, agen ini dapat mencari dan mengambil informasi masa lalu yang relevan.</p>
<h2 id="Built-in-Tools-Overview" class="common-anchor-header">Ikhtisar Alat Bawaan<button data-href="#Built-in-Tools-Overview" class="anchor-icon" translate="no">
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
    </button></h2><p>Deep Agents mencakup beberapa alat bawaan, yang disediakan melalui middleware. Alat-alat tersebut terbagi dalam tiga kelompok utama:</p>
<h3 id="Task-Management-TodoListMiddleware" class="common-anchor-header">Manajemen Tugas (<code translate="no">TodoListMiddleware</code>)</h3><ul>
<li><code translate="no">write_todos</code></li>
</ul>
<p>Membuat daftar tugas yang terstruktur. Setiap tugas dapat menyertakan deskripsi, prioritas, dan ketergantungan.</p>
<ul>
<li><code translate="no">read_todos</code></li>
</ul>
<p>Menampilkan daftar tugas saat ini, termasuk tugas yang sudah selesai dan yang tertunda.</p>
<h3 id="File-System-Tools-FilesystemMiddleware" class="common-anchor-header">Alat Sistem File (<code translate="no">FilesystemMiddleware</code>)</h3><ul>
<li><code translate="no">ls</code></li>
</ul>
<p>Membuat daftar file dalam direktori. Harus menggunakan jalur absolut (dimulai dengan <code translate="no">/</code>).</p>
<ul>
<li><code translate="no">read_file</code></li>
</ul>
<p>Membaca konten file. Mendukung <code translate="no">offset</code> dan <code translate="no">limit</code> untuk file berukuran besar.</p>
<ul>
<li><code translate="no">write_file</code></li>
</ul>
<p>Membuat atau menimpa file.</p>
<ul>
<li><code translate="no">edit_file</code></li>
</ul>
<p>Mengganti teks tertentu di dalam file.</p>
<ul>
<li><code translate="no">glob</code></li>
</ul>
<p>Menemukan file menggunakan pola, seperti <code translate="no">**/*.py</code> untuk mencari semua file Python.</p>
<ul>
<li><code translate="no">grep</code></li>
</ul>
<p>Mencari teks di dalam file.</p>
<ul>
<li><code translate="no">execute</code></li>
</ul>
<p>Menjalankan perintah shell di lingkungan kotak pasir. Membutuhkan backend untuk mendukung <code translate="no">SandboxBackendProtocol</code>.</p>
<h3 id="Sub-agent-Delegation-SubAgentMiddleware" class="common-anchor-header">Delegasi Sub-agen (<code translate="no">SubAgentMiddleware</code>)</h3><ul>
<li><code translate="no">task</code></li>
</ul>
<p>Mengirimkan subtugas ke sub-agen tertentu. Anda memberikan nama sub-agen dan deskripsi tugas.</p>
<h3 id="How-Tool-Outputs-Are-Handled" class="common-anchor-header">Bagaimana Output Alat Ditangani</h3><p>Jika alat menghasilkan hasil yang besar, Deep Agents secara otomatis menyimpannya ke sebuah file.</p>
<p>Sebagai contoh, jika <code translate="no">internet_search</code> mengembalikan konten sebesar 100KB, sistem akan menyimpannya di file seperti <code translate="no">/tool_results/internet_search_1.txt</code>. Agen hanya menyimpan jalur file dalam konteksnya. Hal ini mengurangi penggunaan Token dan menjaga jendela konteks tetap kecil.</p>
<h2 id="DeepAgents-vs-Agent-Builder-When-Should-You-Use-Each" class="common-anchor-header">DeepAgents vs Pembangun Agen: Kapan Anda Harus Menggunakan Masing-masing?<button data-href="#DeepAgents-vs-Agent-Builder-When-Should-You-Use-Each" class="anchor-icon" translate="no">
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
    </button></h2><p><em>Karena artikel ini berfokus pada DeepAgents, akan sangat membantu jika kita memahami bagaimana perbandingannya dengan</em> <a href="https://www.langchain.com/langsmith/agent-builder"><em>Agent Builder</em></a><em>, opsi pembuatan agen lain dalam ekosistem LangChain</em>.</p>
<p>LangChain menawarkan beberapa cara untuk membangun agen AI, dan pilihan terbaik biasanya tergantung pada seberapa besar kontrol yang Anda inginkan atas sistem.</p>
<p><strong>DeepAgents</strong> dirancang untuk membangun agen otonom yang menangani tugas-tugas multi-langkah yang berjalan lama. Ini memberi pengembang kontrol penuh atas bagaimana agen merencanakan tugas, menggunakan alat, dan mengelola memori. Karena dibangun di atas LangGraph, Anda bisa menyesuaikan komponen, mengintegrasikan alat Python, dan memodifikasi backend penyimpanan. Hal ini membuat DeepAgents cocok untuk alur kerja yang kompleks dan sistem produksi yang mengutamakan keandalan dan fleksibilitas.</p>
<p>Sebaliknya,<strong>Agent Builder</strong> berfokus pada kemudahan penggunaan. Ini menyembunyikan sebagian besar detail teknis, sehingga Anda dapat mendeskripsikan agen, menambahkan alat, dan menjalankannya dengan cepat. Memori, penggunaan alat, dan langkah-langkah persetujuan manusia ditangani secara otomatis. Hal ini membuat Agent Builder berguna untuk prototipe cepat, alat bantu internal, atau eksperimen awal.</p>
<p><strong>Agent Builder dan DeepAgents bukanlah sistem yang terpisah-mereka adalah bagian dari stack yang sama.</strong> Agent Builder dibangun di atas DeepAgents. Banyak tim yang memulai dengan Agent Builder untuk menguji ide, kemudian beralih ke DeepAgents ketika mereka membutuhkan lebih banyak kontrol. Alur kerja yang dibuat dengan DeepAgents juga dapat diubah menjadi templat Agent Builder sehingga orang lain dapat menggunakannya kembali dengan mudah.</p>
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
    </button></h2><p>Deep Agents membuat alur kerja agen yang kompleks menjadi lebih mudah dikelola dengan menggunakan tiga ide utama: perencanaan tugas, penyimpanan file, dan pendelegasian sub-agen. Mekanisme ini mengubah proses yang berantakan dan multi-langkah menjadi alur kerja yang terstruktur. Ketika dikombinasikan dengan Milvus untuk pencarian vektor, agen juga dapat menyimpan memori jangka panjang di seluruh sesi.</p>
<p>Bagi pengembang, ini berarti biaya Token yang lebih rendah dan sistem yang lebih andal yang dapat ditingkatkan dari demo sederhana ke lingkungan produksi.</p>
<p>Jika Anda sedang membangun agen AI yang membutuhkan alur kerja terstruktur dan memori jangka panjang yang nyata, kami ingin sekali terhubung dengan Anda.</p>
<p>Ada pertanyaan tentang Deep Agents atau menggunakan Milvus sebagai backend memori persisten? Bergabunglah dengan <a href="https://milvusio.slack.com/join/shared_invite/zt-3nntzngkz-gYwhrdSE4~76k0VMyBfD1Q#/shared-invite/email">saluran Slack</a> kami atau pesan sesi <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">Jam Kantor Milvus</a> selama 20 menit untuk mendiskusikan kasus penggunaan Anda.</p>
