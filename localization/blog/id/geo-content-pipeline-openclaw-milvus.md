---
id: geo-content-pipeline-openclaw-milvus.md
title: >-
  Konten GEO dalam Skala Besar: Cara Mendapatkan Peringkat di Pencarian AI Tanpa
  Meracuni Merek Anda
author: 'Dean Luo, Lumina Wang'
date: 2026-3-24
cover: assets.zilliz.com/1774360780756_980bb85342.jpg
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, RAG, GEO'
meta_keywords: >-
  generative engine optimization, AI search ranking, GEO content strategy, AI
  content at scale, SEO to GEO
meta_title: |
  GEO at Scale: Rank in AI Search Without AI Content Spam
desc: >-
  Lalu lintas organik Anda menurun karena jawaban AI menggantikan klik. Pelajari
  cara menghasilkan konten GEO dalam skala besar tanpa halusinasi dan kerusakan
  merek.
origin: 'https://milvus.io/blog/geo-content-pipeline-openclaw-milvus.md'
---
<p>Lalu lintas penelusuran organik Anda menurun, dan ini bukan karena SEO Anda memburuk. Sekitar 60% dari kueri Google sekarang berakhir dengan nol klik <a href="https://sparktoro.com/blog/in-2024-half-of-google-searches-end-without-a-click-to-another-web-property/">menurut SparkToro</a> - pengguna mendapatkan jawaban mereka dari rangkuman yang dihasilkan AI alih-alih mengklik halaman Anda. Kebingungan, Pencarian ChatGPT, Ikhtisar AI Google - ini bukan ancaman di masa depan. Mereka sudah memakan lalu lintas Anda.</p>
<p><strong>Generative Engine Optimization (GEO</strong> ) adalah cara Anda melawannya. Di mana SEO tradisional mengoptimalkan algoritme peringkat (kata kunci, tautan balik, kecepatan halaman), GEO mengoptimalkan model AI yang menyusun jawaban dengan mengambil dari berbagai sumber. Tujuannya: menyusun konten Anda sehingga mesin pencari AI mengutip <em>merek Anda</em> dalam tanggapan mereka.</p>
<p>Masalahnya, GEO membutuhkan konten dalam skala yang tidak dapat diproduksi oleh sebagian besar tim pemasaran secara manual. Model AI tidak bergantung pada satu sumber - model ini mensintesis lusinan sumber. Agar muncul secara konsisten, Anda memerlukan cakupan di ratusan kueri berekor panjang, masing-masing menargetkan pertanyaan spesifik yang mungkin ditanyakan pengguna kepada asisten AI.</p>
<p>Jalan pintas yang jelas - memiliki artikel yang dihasilkan oleh LLM - menciptakan masalah yang lebih buruk. Mintalah GPT-4 untuk menghasilkan 50 artikel dan Anda akan mendapatkan 50 artikel yang penuh dengan statistik yang dibuat-buat, frasa yang didaur ulang, dan klaim yang tidak pernah dibuat oleh merek Anda. Itu bukan GEO. Itu adalah <strong>spam konten AI dengan nama merek Anda di atasnya</strong>.</p>
<p>Perbaikannya adalah dengan mendasarkan setiap panggilan generasi pada dokumen sumber yang terverifikasi - spesifikasi produk nyata, pesan merek yang disetujui, dan data aktual yang digunakan LLM alih-alih menciptakan. Tutorial ini akan membahas pipeline produksi yang melakukan hal tersebut, yang dibangun di atas tiga komponen:</p>
<ul>
<li><strong><a href="https://github.com/nicepkg/openclaw">OpenClaw</a></strong> - kerangka kerja agen AI sumber terbuka yang mengatur alur kerja dan terhubung ke platform perpesanan seperti Telegram, WhatsApp, dan Slack</li>
<li><strong><a href="https://milvus.io/intro">Milvus</a></strong> - <a href="https://zilliz.com/learn/what-is-vector-database">basis data vektor</a> yang menangani penyimpanan pengetahuan, deduplikasi semantik, dan pengambilan RAG</li>
<li><strong>LLM (GPT-4o, Claude, Gemini)</strong> - mesin pembuat dan pengevaluasi</li>
</ul>
<p>Pada akhirnya, Anda akan memiliki sistem kerja yang memasukkan dokumen merek ke dalam basis pengetahuan yang didukung Milvus, memperluas topik unggulan menjadi kueri berekor panjang, menduplikasi secara semantik, dan menghasilkan artikel secara batch dengan penilaian kualitas bawaan.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/geo_content_pipeline_openclaw_milvus_4_8ef2bfd688.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<blockquote>
<p><strong>Catatan:</strong> Ini adalah sistem kerja yang dibuat untuk alur kerja pemasaran yang sebenarnya, tetapi kode ini adalah titik awal. Anda harus menyesuaikan petunjuk, ambang batas penilaian, dan struktur basis pengetahuan dengan kasus penggunaan Anda sendiri.</p>
</blockquote>
<h2 id="How-the-Pipeline-Solves-Volume-×-Quality" class="common-anchor-header">Bagaimana Pipeline Memecahkan Volume × Kualitas<button data-href="#How-the-Pipeline-Solves-Volume-×-Quality" class="anchor-icon" translate="no">
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
<tr><th>Komponen</th><th>Peran</th></tr>
</thead>
<tbody>
<tr><td>Cakar Terbuka</td><td>Orkestrasi agen, integrasi perpesanan (Lark, Telegram, WhatsApp)</td></tr>
<tr><td>Milvus</td><td>Penyimpanan pengetahuan, deduplikasi semantik, pengambilan RAG</td></tr>
<tr><td>LLM (GPT-4o, Claude, Gemini)</td><td>Perluasan kueri, pembuatan artikel, penilaian kualitas</td></tr>
<tr><td>Model penyematan</td><td>Teks ke vektor untuk Milvus (OpenAI, 1536 dimensi secara default)</td></tr>
</tbody>
</table>
<p>Pipeline berjalan dalam dua fase. <strong>Fase 0</strong> memasukkan materi sumber ke dalam basis pengetahuan. <strong>Fase 1</strong> menghasilkan artikel darinya.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/geo_content_pipeline_openclaw_milvus_6_e03b129785.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Inilah yang terjadi di dalam Fase 1:</p>
<ol>
<li>Seorang pengguna mengirimkan pesan melalui Lark, Telegram, atau WhatsApp. OpenClaw menerimanya dan merutekannya ke keterampilan pembuatan GEO.</li>
<li>Keterampilan ini memperluas topik pengguna menjadi kueri penelusuran ekor panjang menggunakan LLM - pertanyaan spesifik yang diajukan pengguna nyata kepada mesin pencari AI.</li>
<li>Setiap kueri disematkan dan diperiksa terhadap Milvus untuk mencari duplikat semantik. Kueri yang terlalu mirip dengan konten yang sudah ada (kemiripan kosinus &gt; 0,85) akan dibuang.</li>
<li>Kueri yang masih ada memicu pengambilan RAG dari <strong>dua koleksi Milvus sekaligus</strong>: basis pengetahuan (dokumen merek) dan arsip artikel (konten yang dibuat sebelumnya). Pengambilan ganda ini membuat output tetap didasarkan pada materi sumber yang sebenarnya.</li>
<li>LLM menghasilkan setiap artikel dengan menggunakan konteks yang diambil, lalu menilainya berdasarkan rubrik kualitas GEO.</li>
<li>Artikel yang telah selesai ditulis kembali ke Milvus, memperkaya kumpulan dedup dan RAG untuk kumpulan berikutnya.</li>
</ol>
<p>Definisi keterampilan GEO juga membuat aturan pengoptimalan: memimpin dengan jawaban langsung, menggunakan format terstruktur, mengutip sumber secara eksplisit, dan menyertakan analisis asli. Mesin pencari AI mengurai konten berdasarkan struktur dan mendeprioritaskan klaim yang tidak bersumber, sehingga setiap aturan memetakan perilaku pengambilan tertentu.</p>
<p>Generasi berjalan dalam beberapa batch. Putaran pertama diberikan kepada klien untuk ditinjau. Setelah arahnya dikonfirmasi, pipeline ditingkatkan ke produksi penuh.</p>
<h2 id="Why-a-Knowledge-Layer-Is-the-Difference-Between-GEO-and-AI-Spam" class="common-anchor-header">Mengapa Lapisan Pengetahuan Adalah Perbedaan Antara Spam GEO dan AI<button data-href="#Why-a-Knowledge-Layer-Is-the-Difference-Between-GEO-and-AI-Spam" class="anchor-icon" translate="no">
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
    </button></h2><p>Yang membedakan pipeline ini dari "hanya meminta ChatGPT" adalah lapisan pengetahuan. Tanpanya, keluaran LLM terlihat halus tetapi tidak ada yang bisa diverifikasi - dan mesin pencari AI semakin baik dalam mendeteksi hal itu. <a href="https://zilliz.com/what-is-milvus">Milvus</a>, basis data vektor yang mendukung pipeline ini, membawa beberapa kemampuan yang penting di sini:</p>
<p><strong>Deduplikasi semantik menangkap apa yang terlewatkan oleh kata kunci.</strong> Pencocokan kata kunci memperlakukan "tolok ukur kinerja Milvus" dan "Bagaimana Milvus dibandingkan dengan database vektor lainnya?" sebagai kueri yang tidak terkait. <a href="https://zilliz.com/learn/vector-similarity-search">Kesamaan vektor</a> mengenali bahwa mereka menanyakan pertanyaan yang sama, sehingga pipeline melewatkan duplikat alih-alih membuang-buang panggilan pembuatan.</p>
<p><strong>RAG koleksi ganda memisahkan sumber dan keluaran.</strong> <code translate="no">geo_knowledge</code> menyimpan dokumen merek yang dicerna. <code translate="no">geo_articles</code> menyimpan konten yang dihasilkan. Setiap kueri generasi menyentuh keduanya - basis pengetahuan menjaga fakta tetap akurat, dan arsip artikel menjaga konsistensi nada di seluruh batch. Kedua koleksi tersebut dikelola secara independen, sehingga pembaruan materi sumber tidak pernah mengganggu artikel yang sudah ada.</p>
<p><strong>Lingkaran umpan balik yang semakin baik seiring dengan bertambahnya skala.</strong> Setiap artikel yang dihasilkan segera dikirim ke Milvus. Kumpulan berikutnya memiliki kumpulan dedup yang lebih besar dan konteks RAG yang lebih kaya. Senyawa berkualitas dari waktu ke waktu.</p>
<p><strong>Beberapa opsi penerapan untuk kebutuhan yang berbeda.</strong></p>
<ul>
<li><p><a href="https://milvus.io/docs/milvus_lite.md"><strong>Milvus Lite</strong></a>: Versi ringan dari Milvus yang berjalan di laptop Anda dengan satu baris kode, tanpa perlu Docker. Sangat bagus untuk membuat prototipe, dan hanya itu yang dibutuhkan dalam tutorial ini.</p></li>
<li><p><a href="https://milvus.io/docs/install_standalone-docker.md"><strong>Milvus</strong></a> Standalone dan Milvus Distributed: versi yang lebih terukur untuk penggunaan produksi.</p></li>
<li><p><a href="https://cloud.zilliz.com/signup"><strong>Zilliz Cloud</strong></a> adalah Milvus terkelola tanpa kerumitan. Anda tidak perlu khawatir tentang pengaturan teknis dan pemeliharaan sama sekali. Tersedia tier gratis.</p></li>
</ul>
<p>Tutorial ini menggunakan Milvus Lite - tidak ada akun yang harus dibuat, tidak ada instalasi di luar <code translate="no">pip install pymilvus</code>, dan semuanya berjalan secara lokal sehingga Anda dapat mencoba pipeline lengkap sebelum melakukan apa pun.</p>
<p>Perbedaan dalam penerapannya ada pada URI:</p>
<pre><code translate="no" class="language-python">MILVUS_URI = <span class="hljs-string">&quot;./geo_milvus.db&quot;</span>           <span class="hljs-comment"># Local dev (Milvus Lite, no Docker needed)</span>
MILVUS_URI = <span class="hljs-string">&quot;https://xxx.zillizcloud.com&quot;</span>  <span class="hljs-comment"># Production (Zilliz Cloud)</span>
client = MilvusClient(uri=MILVUS_URI)
<button class="copy-code-btn"></button></code></pre>
<h2 id="Step-by-Step-Tutorial" class="common-anchor-header">Tutorial Langkah-demi-Langkah<button data-href="#Step-by-Step-Tutorial" class="anchor-icon" translate="no">
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
    </button></h2><p>Seluruh pipeline dikemas sebagai OpenClaw Skill - direktori yang berisi file instruksi <code translate="no">SKILL.MD</code> dan implementasi kode.</p>
<pre><code translate="no">skills/geo-generator/
├── SKILL.md                    <span class="hljs-comment"># Skill definition (instructions + metadata)</span>
├── index.js                    <span class="hljs-comment"># OpenClaw tool registration, bridges to Python</span>
├── requirements.txt
└── src/
    ├── config.py               <span class="hljs-comment"># Configuration (Milvus/LLM connection)</span>
    ├── llm_client.py           <span class="hljs-comment"># LLM wrapper (embedding + chat)</span>
    ├── milvus_store.py         <span class="hljs-comment"># Milvus operations (article + knowledge collections)</span>
    ├── ingest.py               <span class="hljs-comment"># Knowledge ingestion (documents + web pages)</span>
    ├── expander.py             <span class="hljs-comment"># Step 1: LLM expands long-tail queries</span>
    ├── dedup.py                <span class="hljs-comment"># Step 2: Milvus semantic deduplication</span>
    ├── generator.py            <span class="hljs-comment"># Step 3: Article generation + GEO scoring</span>
    ├── main.py                 <span class="hljs-comment"># Main pipeline entry point</span>
    └── templates/
        └── geo_template.md     <span class="hljs-comment"># GEO article prompt template</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-1-Define-the-OpenClaw-Skill" class="common-anchor-header">Langkah 1: Tentukan Keterampilan OpenClaw</h3><p><code translate="no">SKILL.md</code> memberi tahu OpenClaw apa yang dapat dilakukan oleh skill ini dan bagaimana cara memakainya. Ini memaparkan dua alat: <code translate="no">geo_ingest</code> untuk memberi makan basis pengetahuan dan <code translate="no">geo_generate</code> untuk pembuatan artikel batch. Ini juga berisi aturan pengoptimalan GEO yang membentuk apa yang dihasilkan oleh LLM.</p>
<pre><code translate="no" class="language-markdown">---
name: geo-generator
description: Batch generate GEO-optimized articles <span class="hljs-keyword">using</span> Milvus vector database <span class="hljs-keyword">and</span> LLM, <span class="hljs-keyword">with</span> knowledge <span class="hljs-keyword">base</span> ingestion
version: <span class="hljs-number">1.1</span><span class="hljs-number">.0</span>
user-invocable: <span class="hljs-literal">true</span>
disable-model-invocation: <span class="hljs-literal">false</span>
command-dispatch: tool
command-tool: geo_generate
command-arg-mode: raw
metadata: {<span class="hljs-string">&quot;openclaw&quot;</span>:{<span class="hljs-string">&quot;emoji&quot;</span>:<span class="hljs-string">&quot;📝&quot;</span>,<span class="hljs-string">&quot;primaryEnv&quot;</span>:<span class="hljs-string">&quot;OPENAI_API_KEY&quot;</span>,<span class="hljs-string">&quot;requires&quot;</span>:{<span class="hljs-string">&quot;bins&quot;</span>:[<span class="hljs-string">&quot;python3&quot;</span>],<span class="hljs-string">&quot;env&quot;</span>:[<span class="hljs-string">&quot;OPENAI_API_KEY&quot;</span>],<span class="hljs-string">&quot;os&quot;</span>:[<span class="hljs-string">&quot;darwin&quot;</span>,<span class="hljs-string">&quot;linux&quot;</span>]}}}
---
<span class="hljs-meta"># GEO Article Batch Generator</span>

<span class="hljs-meta">## What it does</span>

<span class="hljs-function">Batch generates <span class="hljs-title">GEO</span> (<span class="hljs-params">Generative Engine Optimization</span>) articles optimized <span class="hljs-keyword">for</span> AI search <span class="hljs-title">engines</span> (<span class="hljs-params">Perplexity, ChatGPT Search, Google AI Overview</span>). Uses Milvus <span class="hljs-keyword">for</span> semantic deduplication, knowledge retrieval, <span class="hljs-keyword">and</span> knowledge <span class="hljs-keyword">base</span> storage. LLM <span class="hljs-keyword">for</span> content generation.

## Tools

### geo_ingest — Feed the knowledge <span class="hljs-keyword">base</span>

Before generating articles, users can ingest authoritative source materials to improve accuracy:
- **Local files**: Markdown, TXT, PDF documents
- **Web URLs**: Fetches page content automatically

Examples:
- &quot;Ingest these Milvus docs <span class="hljs-keyword">into</span> the knowledge <span class="hljs-keyword">base</span>: https:<span class="hljs-comment">//milvus.io/docs/overview.md&quot;</span>
- &quot;Add these files to the GEO knowledge <span class="hljs-keyword">base</span>: /path/to/doc1.md /path/to/doc2.pdf&quot;

### geo_generate — Batch generate articles

When the user sends a message like &quot;Generate 20 GEO articles about Milvus vector database&quot;:
1. **Parse intent** — Extract: topic keyword, target count, optional language/tone
2. **Expand <span class="hljs-built_in">long</span>-tail questions** — Call LLM to generate N <span class="hljs-built_in">long</span>-tail search queries around the topic
3. **Deduplicate via Milvus** — Embed each query, search Milvus <span class="hljs-keyword">for</span> similar existing content, drop <span class="hljs-title">duplicates</span> (<span class="hljs-params">similarity &gt; <span class="hljs-number">0.85</span></span>)
4. **Batch generate** — For each surviving query, retrieve context <span class="hljs-keyword">from</span> BOTH knowledge <span class="hljs-keyword">base</span> <span class="hljs-keyword">and</span> previously generated articles, then call LLM <span class="hljs-keyword">with</span> GEO template
5. **Store &amp; export** — Write each article back <span class="hljs-keyword">into</span> <span class="hljs-title">Milvus</span> (<span class="hljs-params"><span class="hljs-keyword">for</span> future dedup</span>) <span class="hljs-keyword">and</span> save to output files
6. **Report progress** — Send progress updates <span class="hljs-keyword">and</span> final summary back to the chat

## Recommended workflow

1. First ingest authoritative documents/URLs about the topic
2. Then generate articles — the knowledge <span class="hljs-keyword">base</span> ensures factual accuracy

## GEO Optimization Rules

Every generated article MUST include:
- A direct, concise answer <span class="hljs-keyword">in</span> the first <span class="hljs-title">paragraph</span> (<span class="hljs-params">AI engines extract <span class="hljs-keyword">this</span></span>)
- At least 2 citations <span class="hljs-keyword">or</span> data points <span class="hljs-keyword">with</span> sources
- Structured <span class="hljs-title">headings</span> (<span class="hljs-params">H2/H3</span>), bullet lists, <span class="hljs-keyword">or</span> tables
- A unique perspective <span class="hljs-keyword">or</span> original analysis
- Schema-friendly <span class="hljs-title">metadata</span> (<span class="hljs-params">title, description, keywords</span>)

## Output format

For each article, <span class="hljs-keyword">return</span>:
- Title
- Meta description
- Full article <span class="hljs-title">body</span> (<span class="hljs-params">Markdown</span>)
- Target <span class="hljs-built_in">long</span>-tail query
- GEO <span class="hljs-title">score</span> (<span class="hljs-params"><span class="hljs-number">0</span><span class="hljs-number">-100</span>, self-evaluated</span>)

## Guardrails

- Never fabricate citations <span class="hljs-keyword">or</span> statistics — use data <span class="hljs-keyword">from</span> the knowledge <span class="hljs-keyword">base</span>
- If Milvus <span class="hljs-keyword">is</span> unreachable, report the error honestly
- Respect the user&#x27;s specified count — <span class="hljs-keyword">do</span> <span class="hljs-keyword">not</span> over-generate
- All progress updates should include current/total count
</span><button class="copy-code-btn"></button></code></pre>
<h3 id="Step-2-Register-Tools-and-Bridge-to-Python" class="common-anchor-header">Langkah 2: Daftarkan Alat dan Jembatan ke Python</h3><p>OpenClaw berjalan di Node.js, tetapi pipeline GEO ada di Python. <code translate="no">index.js</code> menjembatani keduanya - ini mendaftarkan setiap alat dengan OpenClaw dan mendelegasikan eksekusi ke skrip Python yang sesuai.</p>
<pre><code translate="no" class="language-javascript">function _runPython(script, <span class="hljs-keyword">args</span>, config) {
  <span class="hljs-keyword">return</span> <span class="hljs-keyword">new</span> Promise((resolve) =&gt; {
    <span class="hljs-keyword">const</span> child = execFile(<span class="hljs-string">&quot;python3&quot;</span>, [script, ...<span class="hljs-keyword">args</span>], {
      maxBuffer: <span class="hljs-number">10</span> * <span class="hljs-number">1024</span> * <span class="hljs-number">1024</span>,
      env: { ...process.env, ...config?.env },
    }, (error, stdout) =&gt; {
      <span class="hljs-comment">// Parse JSON result and return to chat</span>
    });
    child.stdout?.<span class="hljs-keyword">on</span>(<span class="hljs-string">&quot;data&quot;</span>, (chunk) =&gt; process.stdout.write(chunk));
  });
}

<span class="hljs-comment">// Tool 1: Ingest documents/URLs into knowledge base</span>
<span class="hljs-function"><span class="hljs-keyword">async</span> function <span class="hljs-title">geo_ingest</span>(<span class="hljs-params"><span class="hljs-keyword">params</span>, config</span>)</span> {
  <span class="hljs-keyword">const</span> <span class="hljs-keyword">args</span> = [];
  <span class="hljs-keyword">if</span> (<span class="hljs-keyword">params</span>.files?.length) <span class="hljs-keyword">args</span>.push(<span class="hljs-string">&quot;--files&quot;</span>, ...<span class="hljs-keyword">params</span>.files);
  <span class="hljs-keyword">if</span> (<span class="hljs-keyword">params</span>.urls?.length)  <span class="hljs-keyword">args</span>.push(<span class="hljs-string">&quot;--urls&quot;</span>, ...<span class="hljs-keyword">params</span>.urls);
  <span class="hljs-keyword">return</span> _runPython(INGEST_SCRIPT, <span class="hljs-keyword">args</span>, config);
}

<span class="hljs-comment">// Tool 2: Batch generate GEO articles</span>
<span class="hljs-function"><span class="hljs-keyword">async</span> function <span class="hljs-title">geo_generate</span>(<span class="hljs-params"><span class="hljs-keyword">params</span>, config</span>)</span> {
  <span class="hljs-keyword">return</span> _runPython(MAIN_SCRIPT, [
    <span class="hljs-string">&quot;--topic&quot;</span>, <span class="hljs-keyword">params</span>.topic,
    <span class="hljs-string">&quot;--count&quot;</span>, String(<span class="hljs-keyword">params</span>.count || <span class="hljs-number">20</span>),
    <span class="hljs-string">&quot;--output&quot;</span>, <span class="hljs-keyword">params</span>.output || DEFAULT_OUTPUT,
  ], config);
}
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-3-Ingest-Source-Material" class="common-anchor-header">Langkah 3: Mencerna Materi Sumber</h3><p>Sebelum menghasilkan apa pun, Anda memerlukan basis pengetahuan. <code translate="no">ingest.py</code> mengambil halaman web atau membaca dokumen lokal, memotong teks, menyematkannya, dan menuliskannya ke koleksi <code translate="no">geo_knowledge</code> di Milvus. Inilah yang membuat konten yang dihasilkan tetap berlandaskan pada informasi yang nyata dan bukan halusinasi LLM.</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">def</span> <span class="hljs-title function_">ingest_sources</span>(<span class="hljs-params">files=<span class="hljs-literal">None</span>, urls=<span class="hljs-literal">None</span></span>):
    llm = get_llm_client()
    milvus = get_milvus_client()
    ensure_knowledge_collection(milvus)

    <span class="hljs-keyword">for</span> url <span class="hljs-keyword">in</span> urls:
        text = extract_from_url(url)       <span class="hljs-comment"># Fetch and extract text</span>
        chunks = chunk_text(text)           <span class="hljs-comment"># Split into 800-char chunks with overlap</span>
        embeddings = get_embeddings_batch(llm, chunks)
        records = [
            {<span class="hljs-string">&quot;embedding&quot;</span>: emb, <span class="hljs-string">&quot;content&quot;</span>: chunk,
             <span class="hljs-string">&quot;source&quot;</span>: url, <span class="hljs-string">&quot;source_type&quot;</span>: <span class="hljs-string">&quot;url&quot;</span>, <span class="hljs-string">&quot;chunk_index&quot;</span>: i}
            <span class="hljs-keyword">for</span> i, (chunk, emb) <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(<span class="hljs-built_in">zip</span>(chunks, embeddings))
        ]
        insert_knowledge(milvus, records)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-4-Expand-Long-Tail-Queries" class="common-anchor-header">Langkah 4: Perluas Kueri Ekor Panjang</h3><p>Diberikan topik seperti "database vektor Milvus," LLM menghasilkan satu set kueri penelusuran yang spesifik dan realistis - jenis pertanyaan yang diketikkan oleh pengguna nyata ke dalam mesin telusur AI. Permintaan ini mencakup berbagai jenis maksud: informasi, perbandingan, cara, pemecahan masalah, dan FAQ.</p>
<pre><code translate="no" class="language-python">SYSTEM_PROMPT = <span class="hljs-string">&quot;&quot;&quot;\
You are an SEO/GEO keyword research expert. Generate long-tail search queries.
Requirements:
1. Each query = a specific question a real user might ask
2. Cover different intents: informational, comparison, how-to, problem-solving, FAQ
3. One query per line, no numbering
&quot;&quot;&quot;</span>

<span class="hljs-keyword">def</span> <span class="hljs-title function_">expand_queries</span>(<span class="hljs-params">client, topic, count</span>):
    user_prompt = <span class="hljs-string">f&quot;Topic: <span class="hljs-subst">{topic}</span>\nPlease generate <span class="hljs-subst">{count}</span> long-tail search queries.&quot;</span>
    result = chat(client, SYSTEM_PROMPT, user_prompt)
    queries = [q.strip() <span class="hljs-keyword">for</span> q <span class="hljs-keyword">in</span> result.strip().splitlines() <span class="hljs-keyword">if</span> q.strip()]
    <span class="hljs-keyword">return</span> queries[:count]
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-5-Deduplicate-via-Milvus" class="common-anchor-header">Langkah 5: Deduplikasi melalui Milvus</h3><p>Di sinilah <a href="https://zilliz.com/learn/vector-similarity-search">pencarian vektor</a> mendapatkan tempatnya. Setiap kueri yang diperluas disematkan dan dibandingkan dengan koleksi <code translate="no">geo_knowledge</code> dan <code translate="no">geo_articles</code>. Jika kemiripan kosinus melebihi 0,85, kueri tersebut merupakan duplikat semantik dari sesuatu yang sudah ada di sistem dan akan dibuang - mencegah pipeline menghasilkan lima artikel yang sedikit berbeda yang semuanya menjawab pertanyaan yang sama.</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">def</span> <span class="hljs-title function_">deduplicate_queries</span>(<span class="hljs-params">llm_client, milvus_client, queries</span>):
    embeddings = get_embeddings_batch(llm_client, queries)
    unique = []
    <span class="hljs-keyword">for</span> query, emb <span class="hljs-keyword">in</span> <span class="hljs-built_in">zip</span>(queries, embeddings):
        <span class="hljs-keyword">if</span> is_duplicate(milvus_client, emb, threshold=<span class="hljs-number">0.85</span>):
            <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;  [Dedup] Skipping duplicate: <span class="hljs-subst">{query}</span>&quot;</span>)
            <span class="hljs-keyword">continue</span>
        unique.append((query, emb))
    <span class="hljs-keyword">return</span> unique
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-6-Generate-Articles-with-Dual-Source-RAG" class="common-anchor-header">Langkah 6: Hasilkan Artikel dengan RAG Sumber Ganda</h3><p>Untuk setiap pertanyaan yang masih ada, generator mengambil konteks dari kedua koleksi Milvus: materi sumber otoritatif dari <code translate="no">geo_knowledge</code> dan artikel yang dibuat sebelumnya dari <code translate="no">geo_articles</code>. Pengambilan ganda ini membuat konten tetap berdasarkan fakta (basis pengetahuan) dan konsisten secara internal (riwayat artikel).</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">def</span> <span class="hljs-title function_">get_context</span>(<span class="hljs-params">client, embedding, top_k=<span class="hljs-number">3</span></span>):
    context_parts = []

    <span class="hljs-comment"># 1. Knowledge base (authoritative sources)</span>
    <span class="hljs-keyword">for</span> hit <span class="hljs-keyword">in</span> search_knowledge(client, embedding, top_k):
        source = hit[<span class="hljs-string">&quot;entity&quot;</span>][<span class="hljs-string">&quot;source&quot;</span>]
        context_parts.append(<span class="hljs-string">f&quot;### Source Material (from: <span class="hljs-subst">{source}</span>):\n<span class="hljs-subst">{hit[<span class="hljs-string">&#x27;entity&#x27;</span>][<span class="hljs-string">&#x27;content&#x27;</span>][:<span class="hljs-number">800</span>]}</span>&quot;</span>)

    <span class="hljs-comment"># 2. Previously generated articles</span>
    <span class="hljs-keyword">for</span> hit <span class="hljs-keyword">in</span> search_similar(client, embedding, top_k):
        context_parts.append(<span class="hljs-string">f&quot;### Related Article: <span class="hljs-subst">{hit[<span class="hljs-string">&#x27;entity&#x27;</span>][<span class="hljs-string">&#x27;title&#x27;</span>]}</span>\n<span class="hljs-subst">{hit[<span class="hljs-string">&#x27;entity&#x27;</span>][<span class="hljs-string">&#x27;content&#x27;</span>][:<span class="hljs-number">500</span>]}</span>&quot;</span>)

    <span class="hljs-keyword">return</span> <span class="hljs-string">&quot;\n\n&quot;</span>.join(context_parts)
<button class="copy-code-btn"></button></code></pre>
<p>Kedua koleksi ini menggunakan dimensi penyematan yang sama (1536) namun menyimpan metadata yang berbeda karena memiliki peran yang berbeda: <code translate="no">geo_knowledge</code> melacak dari mana setiap bagian berasal (untuk atribusi sumber), sementara <code translate="no">geo_articles</code> menyimpan kueri asli dan skor GEO (untuk pencocokan dedup dan pemfilteran kualitas).</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">def</span> <span class="hljs-title function_">generate_one</span>(<span class="hljs-params">llm_client, milvus_client, query, embedding</span>):
    context = get_context(milvus_client, embedding)  <span class="hljs-comment"># Dual-source RAG</span>
    template = _load_template()                       <span class="hljs-comment"># GEO template</span>
    user_prompt = template.replace(<span class="hljs-string">&quot;{query}&quot;</span>, query).replace(<span class="hljs-string">&quot;{context}&quot;</span>, context)

    raw = chat(llm_client, <span class="hljs-string">&quot;You are a senior GEO content writer...&quot;</span>, user_prompt)
    article = _parse_article(raw)
    article[<span class="hljs-string">&quot;geo_score&quot;</span>] = _score_article(llm_client, article[<span class="hljs-string">&quot;content&quot;</span>])  <span class="hljs-comment"># Self-evaluate</span>
    insert_article(milvus_client, article)  <span class="hljs-comment"># Write back for future dedup &amp; RAG</span>
    <span class="hljs-keyword">return</span> article
<button class="copy-code-btn"></button></code></pre>
<h3 id="The-Milvus-Data-Model" class="common-anchor-header">Model Data Milvus</h3><p>Berikut ini adalah tampilan setiap koleksi jika Anda membuatnya dari awal:</p>
<pre><code translate="no" class="language-python"><span class="hljs-comment"># geo_knowledge — Source material for RAG retrieval</span>
schema.add_field(<span class="hljs-string">&quot;embedding&quot;</span>, DataType.FLOAT_VECTOR, dim=<span class="hljs-number">1536</span>)
schema.add_field(<span class="hljs-string">&quot;content&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">65535</span>)
schema.add_field(<span class="hljs-string">&quot;source&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">1024</span>)     <span class="hljs-comment"># URL or file path</span>
schema.add_field(<span class="hljs-string">&quot;source_type&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">32</span>)  <span class="hljs-comment"># &quot;file&quot; or &quot;url&quot;</span>

<span class="hljs-comment"># geo_articles — Generated articles for dedup + RAG</span>
schema.add_field(<span class="hljs-string">&quot;embedding&quot;</span>, DataType.FLOAT_VECTOR, dim=<span class="hljs-number">1536</span>)
schema.add_field(<span class="hljs-string">&quot;query&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">512</span>)
schema.add_field(<span class="hljs-string">&quot;title&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">512</span>)
schema.add_field(<span class="hljs-string">&quot;content&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">65535</span>)
schema.add_field(<span class="hljs-string">&quot;geo_score&quot;</span>, DataType.INT64)
<button class="copy-code-btn"></button></code></pre>
<h2 id="Running-the-Pipeline" class="common-anchor-header">Menjalankan Pipeline<button data-href="#Running-the-Pipeline" class="anchor-icon" translate="no">
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
    </button></h2><p>Masukkan direktori <code translate="no">skills/geo-generator/</code> ke dalam folder keahlian OpenClaw Anda, atau kirimkan file zip ke Lark dan biarkan OpenClaw menginstalnya. Anda harus mengkonfigurasi <code translate="no">OPENAI_API_KEY</code>.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/geo_content_pipeline_openclaw_milvus_3_da7d249862.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Dari sana, berinteraksi dengan pipeline melalui pesan obrolan:</p>
<p><strong>Contoh 1:</strong> Memasukkan URL sumber ke dalam basis pengetahuan, lalu membuat artikel.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/geo_content_pipeline_openclaw_milvus_2_db83ddb4bd.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Contoh 2:</strong> Unggah sebuah buku (Wuthering Heights), lalu hasilkan 3 artikel GEO dan ekspor ke dokumen Lark.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/geo_content_pipeline_openclaw_milvus_1_33657096fc.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Taking-This-Pipeline-to-Production" class="common-anchor-header">Membawa Pipeline Ini ke Produksi<button data-href="#Taking-This-Pipeline-to-Production" class="anchor-icon" translate="no">
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
    </button></h2><p>Semua yang ada di tutorial ini berjalan di Milvus Lite, yang berarti berjalan di laptop Anda dan berhenti ketika laptop Anda mati. Untuk pipeline GEO yang sebenarnya, itu tidak cukup. Anda ingin artikel yang dihasilkan ketika Anda sedang rapat. Anda ingin basis pengetahuan tersedia saat seorang kolega menjalankan batch pada hari Selasa depan.</p>
<p>Pada titik ini, ada dua solusi.</p>
<p><strong>Menginstal Milvus secara mandiri menggunakan mode Mandiri atau Terdistribusi.</strong> Tim teknisi Anda menginstal versi lengkap di server - sebuah komputer khusus, baik secara fisik maupun yang disewa dari penyedia cloud seperti AWS. Ini sangat mumpuni dan memberi Anda kontrol penuh atas penerapan Anda, tetapi memang membutuhkan tim teknik khusus untuk menyiapkan, memelihara, dan menskalakan.</p>
<p><strong>Gunakan</strong> <a href="https://cloud.zilliz.com/signup"><strong>Zilliz Cloud</strong></a><strong>.</strong> Zilliz Cloud adalah Milvus yang dikelola sepenuhnya dengan fitur-fitur tingkat perusahaan yang lebih canggih di atasnya, dibangun oleh tim yang sama.</p>
<ul>
<li><p><strong>Tidak ada kerumitan dalam pengoperasian dan pemeliharaan.</strong></p></li>
<li><p><strong>Tersedia tingkat gratis.</strong> <a href="https://cloud.zilliz.com/signup">Tingkat gratis</a> mencakup penyimpanan 5GB - cukup untuk membaca seluruh <em>Wuthering Heights</em> sebanyak 360 kali, atau 360 buku. Tersedia juga uji coba gratis selama 30 hari untuk beban kerja yang lebih besar.</p></li>
<li><p><strong>Selalu menjadi yang pertama dalam antrean untuk fitur-fitur baru.</strong> Ketika Milvus merilis peningkatan, Zilliz Cloud mendapatkannya secara otomatis - tidak perlu menunggu tim Anda menjadwalkan peningkatan.</p></li>
</ul>
<pre><code translate="no">
MILVUS_URI = <span class="hljs-string">&quot;https://xxx.zillizcloud.com&quot;</span>  <span class="hljs-comment"># That&#x27;s the only change.</span>

client = MilvusClient(uri=MILVUS_URI)

<button class="copy-code-btn"></button></code></pre>
<p><a href="https://cloud.zilliz.com/signup">Daftar ke Zilliz Cloud</a>, dan cobalah.</p>
<h2 id="When-GEO-Content-Generation-Backfires" class="common-anchor-header">Ketika Pembuatan Konten GEO Menjadi Bumerang<button data-href="#When-GEO-Content-Generation-Backfires" class="anchor-icon" translate="no">
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
    </button></h2><p>Pembuatan konten GEO hanya berfungsi sebaik basis pengetahuan di belakangnya. Beberapa kasus di mana pendekatan ini lebih banyak merugikan daripada menguntungkan:</p>
<p><strong>Tidak ada sumber materi yang otoritatif.</strong> Tanpa basis pengetahuan yang kuat, LLM akan kembali ke data pelatihan. Hasilnya akan menjadi generik dan paling buruk adalah halusinasi. Inti dari langkah RAG adalah untuk membumikan pembangkitan dalam informasi yang terverifikasi - lewati saja, dan Anda hanya melakukan rekayasa cepat dengan langkah-langkah tambahan.</p>
<p><strong>Mempromosikan sesuatu yang tidak ada.</strong> Jika produk tidak berfungsi seperti yang dijelaskan, itu bukan GEO - itu adalah informasi yang salah. Langkah penilaian mandiri menangkap beberapa masalah kualitas, tetapi tidak dapat memverifikasi klaim yang tidak bertentangan dengan basis pengetahuan.</p>
<p><strong>Audiens Anda adalah murni manusia.</strong> Pengoptimalan GEO (judul terstruktur, jawaban langsung di paragraf pertama, kepadatan kutipan) dirancang untuk dapat ditemukan oleh AI. Hal ini dapat terasa seperti rumus jika Anda menulis murni untuk pembaca manusia. Ketahui audiens mana yang Anda targetkan.</p>
<p><strong>Catatan tentang ambang batas dedup.</strong> Pipeline membuang kueri dengan kemiripan kosinus di atas 0,85. Jika terlalu banyak duplikat yang hampir sama, turunkan ambang batasnya. Jika pipeline membuang kueri yang tampaknya benar-benar berbeda, naikkan. 0,85 adalah titik awal yang masuk akal, tetapi nilai yang tepat tergantung pada seberapa sempit topik Anda.</p>
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
    </button></h2><p>GEO adalah tempat SEO berada sepuluh tahun yang lalu - cukup awal sehingga infrastruktur yang tepat memberi Anda keunggulan yang nyata. Tutorial ini membangun pipeline yang menghasilkan artikel yang benar-benar dikutip oleh mesin pencari AI, yang didasarkan pada materi sumber merek Anda sendiri, bukan halusinasi LLM. Tumpukannya adalah <a href="https://github.com/nicepkg/openclaw">OpenClaw</a> untuk orkestrasi, <a href="https://milvus.io/intro">Milvus</a> untuk penyimpanan pengetahuan dan pengambilan <a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">RAG</a>, dan LLM untuk pembuatan dan penilaian.</p>
<p>Kode sumber lengkap tersedia di <a href="https://github.com/nicepkg/openclaw">github.com/nicepkg/openclaw</a>.</p>
<p>Jika Anda sedang membangun strategi GEO dan membutuhkan infrastruktur untuk mendukungnya:</p>
<ul>
<li>Bergabunglah dengan <a href="https://slack.milvus.io/">komunitas Milvus Slack</a> untuk melihat bagaimana tim lain menggunakan pencarian vektor untuk konten, dedup, dan RAG.</li>
<li><a href="https://milvus.io/office-hours">Pesan sesi Jam Kantor Milvus gratis selama 20 menit</a> untuk membahas kasus penggunaan Anda dengan tim.</li>
<li>Jika Anda lebih suka melewatkan penyiapan infrastruktur, <a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a> (Milvus yang dikelola) memiliki tingkat gratis - satu perubahan URI dan Anda sudah bisa berproduksi.</li>
</ul>
<hr>
<p>Beberapa pertanyaan yang muncul ketika tim pemasaran mulai menjelajahi GEO:</p>
<p><strong>Lalu lintas SEO saya menurun. Apakah GEO adalah penggantinya?</strong>GEO tidak menggantikan SEO - GEO memperluasnya ke saluran baru. SEO tradisional masih mendorong lalu lintas dari pengguna yang mengklik halaman. GEO menargetkan pangsa kueri yang terus meningkat di mana pengguna mendapatkan jawaban langsung dari AI (Perplexity, ChatGPT Search, Google AI Overview) tanpa harus mengunjungi situs web. Jika Anda melihat rasio klik-nol meningkat di analitik Anda, itulah lalu lintas yang dirancang untuk ditangkap kembali oleh GEO - bukan melalui klik, tetapi melalui kutipan merek dalam jawaban yang dihasilkan oleh AI.</p>
<p>Apa<strong>perbedaan konten GEO dengan konten yang dihasilkan AI biasa?</strong>Sebagian besar konten yang dihasilkan AI bersifat umum - LLM diambil dari data pelatihan dan menghasilkan sesuatu yang terdengar masuk akal, tetapi tidak didasarkan pada fakta, klaim, atau data aktual merek Anda. Konten GEO didasarkan pada basis pengetahuan dari materi sumber yang telah diverifikasi menggunakan RAG (retrieval-augmented generation). Perbedaannya terlihat pada output: detail produk yang spesifik alih-alih generalisasi yang tidak jelas, angka yang nyata alih-alih statistik yang dibuat-buat, dan suara merek yang konsisten di lusinan artikel.</p>
<p><strong>Berapa banyak artikel yang saya perlukan agar GEO dapat bekerja?</strong>Tidak ada angka ajaib, tetapi logikanya mudah: Model AI melakukan sintesis dari berbagai sumber untuk setiap jawaban. Semakin banyak kueri panjang yang Anda bahas dengan konten berkualitas, semakin sering merek Anda muncul. Mulailah dengan 20-30 artikel seputar topik inti Anda, ukur artikel mana yang dikutip (periksa tingkat penyebutan AI dan lalu lintas rujukan Anda), dan tingkatkan dari sana.</p>
<p><strong>Apakah mesin pencari AI tidak akan menghukum konten yang dibuat secara massal? Ya</strong>, jika<strong>konten</strong>tersebut berkualitas rendah. Mesin pencari AI semakin baik dalam mendeteksi klaim yang tidak bersumber, frasa daur ulang, dan konten yang tidak menambah nilai orisinal. Itulah sebabnya mengapa pipeline ini menyertakan basis pengetahuan untuk landasan dan langkah penilaian mandiri untuk kontrol kualitas. Tujuannya bukan untuk menghasilkan lebih banyak konten - tetapi untuk menghasilkan konten yang benar-benar berguna bagi model AI untuk dikutip.</p>
