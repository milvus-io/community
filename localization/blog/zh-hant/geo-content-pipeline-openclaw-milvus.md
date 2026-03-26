---
id: geo-content-pipeline-openclaw-milvus.md
title: 規模化的 GEO 內容：如何在不損害品牌的情況下在 AI 搜尋中獲得排名
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
desc: 隨著 AI 答案取代點擊，您的有機流量正在下降。了解如何大規模產生 GEO 內容，而不會造成幻覺和品牌損害。
origin: 'https://milvus.io/blog/geo-content-pipeline-openclaw-milvus.md'
---
<p>您的有機搜尋流量正在下降，這並不是因為您的 SEO 變差了。<a href="https://sparktoro.com/blog/in-2024-half-of-google-searches-end-without-a-click-to-another-web-property/">根據 SparkToro 的資料顯示，</a>目前約有 60% 的 Google 查詢是以零點擊結束 - 使用者從 AI 產生的摘要中得到答案，而不是點擊進入您的頁面。Perplexity、ChatGPT Search、Google AI 總覽 - 這些都不是未來的威脅。它們已經在蠶食您的流量。</p>
<p><strong>生成式引擎優化 (GEO)</strong>是您反擊的方式。傳統的 SEO 是針對排名演算法 (關鍵字、反向連結、頁面速度) 進行最佳化，而 GEO 則是針對 AI 模型進行最佳化，這些模型會從多種來源中擷取資訊來撰寫答案。目標是：建構您的內容，讓 AI 搜尋引擎在回應中引用<em>您的品牌</em>。</p>
<p>問題是 GEO 所需的內容規模，大多數行銷團隊都無法以人工方式製作。AI 模型不會依賴單一來源，而是會綜合數十個來源。若要持續顯示，您需要涵蓋數百個長尾查詢，每個查詢都針對使用者可能會詢問 AI 助理的特定問題。</p>
<p>顯而易見的捷徑 - 讓 LLM 批量產生文章 - 會造成更嚴重的問題。如果要求 GPT-4 製作 50 篇文章，您將得到 50 篇充滿虛構統計資料、重複用語，以及您的品牌從未發表過聲明的文章。這不是 GEO。那是<strong>帶有您品牌名稱的 AI 垃圾內容</strong>。</p>
<p>解決的方法是讓每一個代碼都建立在經過驗證的來源文件上 - 真實的產品規格、認可的品牌訊息，以及 LLM 擷取而非捏造的實際資料。本教學將介紹一個以三個元件為基礎的生產管道：</p>
<ul>
<li><strong><a href="https://github.com/nicepkg/openclaw">OpenClaw</a></strong>- 一個開放原始碼的 AI 代理框架，可協調工作流程並連結至 Telegram、WhatsApp 和 Slack 等訊息平台。</li>
<li><strong><a href="https://milvus.io/intro">Milvus</a></strong>- 一個<a href="https://zilliz.com/learn/what-is-vector-database">向量資料庫</a>，可處理知識儲存、語義重複刪除和 RAG 檢索</li>
<li><strong>LLMs (GPT-4o、Claude、Gemini)</strong>- 生成和評估引擎</li>
</ul>
<p>到最後，您將擁有一個可運作的系統，可將品牌文件擷取至 Milvus 支援的知識庫、將種子主題擴展為長尾查詢、進行語義重複，並利用內建的品質評分批量產生文章。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/geo_content_pipeline_openclaw_milvus_4_8ef2bfd688.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<blockquote>
<p><strong>注意：</strong>這是一個為真實行銷工作流程而建立的工作系統，但程式碼只是一個起點。您需要根據自己的使用情況調整提示、評分臨界值和知識庫結構。</p>
</blockquote>
<h2 id="How-the-Pipeline-Solves-Volume-×-Quality" class="common-anchor-header">管道如何解決數量 × 品質的問題<button data-href="#How-the-Pipeline-Solves-Volume-×-Quality" class="anchor-icon" translate="no">
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
<tr><th>元件</th><th>角色</th></tr>
</thead>
<tbody>
<tr><td>OpenClaw</td><td>代理協調、訊息整合 (Lark、Telegram、WhatsApp)</td></tr>
<tr><td>Milvus</td><td>知識儲存、語義重複刪除、RAG 檢索</td></tr>
<tr><td>LLMs (GPT-4o、Claude、Gemini)</td><td>查詢擴充、文章產生、品質評分</td></tr>
<tr><td>嵌入模型</td><td>將文字轉換為 Milvus 的向量 (OpenAI, 預設為 1536 維)</td></tr>
</tbody>
</table>
<p>管道分兩個階段執行。<strong>第 0 階段將</strong>原始資料擷取至知識庫。<strong>第 1 階段</strong>從中產生文章。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/geo_content_pipeline_openclaw_milvus_6_e03b129785.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>以下是第 1 階段中發生的事情：</p>
<ol>
<li>使用者透過 Lark、Telegram 或 WhatsApp 傳送訊息。OpenClaw 收到訊息後，會將其傳送至 GEO 生成技能。</li>
<li>該技能使用 LLM 將使用者的主題擴展為長尾搜尋查詢 - 真實使用者向 AI 搜尋引擎提出的特定問題。</li>
<li>每個查詢都會嵌入 Milvus，並檢查是否有語義重複。與現有內容過於相似的查詢（余弦相似度 &gt; 0.85）會被刪除。</li>
<li>存活的查詢會<strong>同時</strong>從<strong>兩個 Milvus 套件</strong>啟動 RAG 檢索：知識庫 (品牌文件) 和文章檔案 (先前產生的內容)。這種雙重擷取方式可讓輸出內容以真實的原始資料為基礎。</li>
<li>LLM 利用擷取的內容產生每篇文章，然後根據 GEO 品質評量標準進行評分。</li>
<li>完成的文章會寫回 Milvus，為下一批內容充實 dedup 與 RAG 池。</li>
</ol>
<p>GEO 的技能定義也包含優化規則：以直接答案為引導、使用結構化格式、明確引用來源，以及包含原始分析。AI 搜尋引擎會依據結構來解析內容，並降低無來源聲明的優先順序，因此每項規則都會對應到特定的檢索行為。</p>
<p>生成分批執行。第一輪會交給客戶審核。一旦方向得到確認，管道就會擴大到全面生產。</p>
<h2 id="Why-a-Knowledge-Layer-Is-the-Difference-Between-GEO-and-AI-Spam" class="common-anchor-header">為什麼知識層是 GEO 與 AI 垃圾郵件的差異？<button data-href="#Why-a-Knowledge-Layer-Is-the-Difference-Between-GEO-and-AI-Spam" class="anchor-icon" translate="no">
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
    </button></h2><p>這個管道與「只是提示 ChatGPT」的區別在於知識層。沒有知識層，LLM 的輸出看起來很精緻，但卻沒有任何可驗證的內容 - 而 AI 搜尋引擎越來越擅長偵測這一點。<a href="https://zilliz.com/what-is-milvus">Milvus</a> 是為此管道提供動力的向量資料庫，它在這方面有幾項重要的功能：</p>
<p><strong>語意重複資料刪除可以捕捉關鍵字所遺漏的內容。</strong>關鍵字比對將「Milvus 效能基準」和「Milvus 與其他向量資料庫比較如何？<a href="https://zilliz.com/learn/vector-similarity-search">向量相似性</a>會辨識出它們詢問的是相同的問題，因此管道會跳過重覆的問題，而不會浪費一次生成呼叫。</p>
<p><code translate="no">geo_knowledge</code> 儲存擷取的品牌文件<strong>。</strong> <code translate="no">geo_articles</code> 儲存生成的內容。每個生成查詢都會同時使用這兩個資料庫 - 知識庫可保持事實的準確性，而文章存檔則可在批次中保持一致的語調。這兩個資料庫獨立維護，因此更新原始資料不會影響現有文章。</p>
<p><strong>隨規模擴大而改善的回饋迴圈。</strong>每一篇產生的文章都會立即寫回 Milvus。下一批文章會有更大的代碼池和更豐富的 RAG 上下文。品質隨時間逐漸提升。</p>
<p><strong>多種部署選項滿足不同需求。</strong></p>
<ul>
<li><p><a href="https://milvus.io/docs/milvus_lite.md"><strong>Milvus Lite</strong></a>：Milvus 的輕量版，只需一行程式碼即可在筆記型電腦上執行，無需 Docker。非常適合原型設計，本教學只需要它。</p></li>
<li><p><a href="https://milvus.io/docs/install_standalone-docker.md"><strong>Milvus</strong></a>Standalone 和 Milvus Distributed：更適合生產使用的擴充版本。</p></li>
<li><p><a href="https://cloud.zilliz.com/signup"><strong>Zilliz Cloud</strong></a>是零麻煩的管理式 Milvus。您完全不需要擔心技術設定和維護。提供免費的層級。</p></li>
</ul>
<p>本教學使用 Milvus Lite - 不需要建立帳號，除了<code translate="no">pip install pymilvus</code> 之外不需要安裝，一切都在本機執行，因此您可以在承諾任何事情之前先試用完整的管道。</p>
<p>部署的差異在於 URI：</p>
<pre><code translate="no" class="language-python">MILVUS_URI = <span class="hljs-string">&quot;./geo_milvus.db&quot;</span>           <span class="hljs-comment"># Local dev (Milvus Lite, no Docker needed)</span>
MILVUS_URI = <span class="hljs-string">&quot;https://xxx.zillizcloud.com&quot;</span>  <span class="hljs-comment"># Production (Zilliz Cloud)</span>
client = MilvusClient(uri=MILVUS_URI)
<button class="copy-code-btn"></button></code></pre>
<h2 id="Step-by-Step-Tutorial" class="common-anchor-header">逐步教學<button data-href="#Step-by-Step-Tutorial" class="anchor-icon" translate="no">
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
    </button></h2><p>整個管道包裝為 OpenClaw Skill - 一個包含<code translate="no">SKILL.MD</code> 指令檔與程式碼實作的目錄。</p>
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
<h3 id="Step-1-Define-the-OpenClaw-Skill" class="common-anchor-header">步驟 1：定義 OpenClaw Skill</h3><p><code translate="no">SKILL.md</code> 定義 OpenClaw Skill，告訴 OpenClaw 這個 Skill 可以做什麼，以及如何呼叫它。它暴露了兩個工具：<code translate="no">geo_ingest</code> ，用於饋送知識庫；<code translate="no">geo_generate</code> ，用於批量文章生成。它也包含 GEO 最佳化規則，可塑造 LLM 所產生的結果。</p>
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
<h3 id="Step-2-Register-Tools-and-Bridge-to-Python" class="common-anchor-header">步驟 2：註冊工具並橋接到 Python</h3><p>OpenClaw 在 Node.js 上執行，但 GEO 輸送管道則使用 Python。<code translate="no">index.js</code> 橋接兩者 - 它將每個工具註冊到 OpenClaw，並將執行委託給相對應的 Python 腳本。</p>
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
<h3 id="Step-3-Ingest-Source-Material" class="common-anchor-header">步驟 3：擷取原始資料</h3><p>在產生任何內容之前，您需要一個知識庫。<code translate="no">ingest.py</code> 抓取網頁或讀取本機文件，將文字分塊、嵌入並寫入 Milvus 中的<code translate="no">geo_knowledge</code> 套件。這樣才能讓產生的內容建立在真實資訊的基礎上，而不是 LLM 的幻覺。</p>
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
<h3 id="Step-4-Expand-Long-Tail-Queries" class="common-anchor-header">步驟 4：擴展長尾查詢</h3><p>給出「Milvus 向量資料庫」這樣的主題，LLM 會產生一組特定、真實的搜尋查詢 - 真實使用者在 AI 搜尋引擎中輸入的那種問題。提示涵蓋不同的意圖類型：資訊、比較、如何操作、解決問題和常見問題。</p>
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
<h3 id="Step-5-Deduplicate-via-Milvus" class="common-anchor-header">步驟 5：透過 Milvus 進行重複</h3><p>這就是<a href="https://zilliz.com/learn/vector-similarity-search">向量搜尋的</a>用武之地。每個擴充的查詢都會嵌入<code translate="no">geo_knowledge</code> 和<code translate="no">geo_articles</code> 資料庫，並與之比較。如果余弦相似度超過 0.85，則表示該查詢與系統中已有的內容在語義上重複，因此會被刪除 - 防止管道產生五篇略有不同的文章，但都回答了相同的問題。</p>
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
<h3 id="Step-6-Generate-Articles-with-Dual-Source-RAG" class="common-anchor-header">步驟 6：使用雙源 RAG 產生文章</h3><p>對於每個存活的查詢，產生器會從 Milvus 的兩個資料庫中擷取上下文：從<code translate="no">geo_knowledge</code> 擷取權威的原始資料，並從<code translate="no">geo_articles</code> 擷取先前產生的文章。這種雙重擷取的方式可讓內容維持事實基礎（知識庫）與內部一致性（文章歷史）。</p>
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
<p>這兩個資料庫使用相同的嵌入維度 (1536)，但儲存不同的元資料，因為它們扮演不同的角色：<code translate="no">geo_knowledge</code> 追蹤每個片段的來源 (用於來源歸屬)，而<code translate="no">geo_articles</code> 則儲存原始查詢和 GEO 得分 (用於遞補比對和品質過濾)。</p>
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
<h3 id="The-Milvus-Data-Model" class="common-anchor-header">Milvus 資料模型</h3><p>如果您從頭開始建立資料集，以下是每個資料集的外觀：</p>
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
<h2 id="Running-the-Pipeline" class="common-anchor-header">執行管道<button data-href="#Running-the-Pipeline" class="anchor-icon" translate="no">
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
    </button></h2><p>將<code translate="no">skills/geo-generator/</code> 目錄放入您的 OpenClaw 技能資料夾，或將壓縮檔傳送至 Lark 並讓 OpenClaw 安裝。您需要設定您的<code translate="no">OPENAI_API_KEY</code> 。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/geo_content_pipeline_openclaw_milvus_3_da7d249862.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>從那裡，透過聊天訊息與管道互動：</p>
<p><strong>範例 1:</strong>將原始 URL 擷取至知識庫，然後產生文章。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/geo_content_pipeline_openclaw_milvus_2_db83ddb4bd.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>範例 2：</strong>上傳一本书 (Wuthering Heights)，然後產生 3 篇 GEO 文章並匯出至 Lark doc。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/geo_content_pipeline_openclaw_milvus_1_33657096fc.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Taking-This-Pipeline-to-Production" class="common-anchor-header">將此管道導入生產<button data-href="#Taking-This-Pipeline-to-Production" class="anchor-icon" translate="no">
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
    </button></h2><p>本教學的所有內容都是在 Milvus Lite 上執行的，也就是說，它是在你的筆記型電腦上執行，當你的筆記型電腦停止時，它也會停止。對於真正的 GEO 管道來說，這是不夠的。你希望在開會的時候，文章還在生成。您希望在下週二同事執行批次作業時，知識庫仍然可用。</p>
<p>目前有兩種解決方案。</p>
<p><strong>使用 Standalone 或 Distributed 模式自行託管 Milvus。</strong>您的工程團隊會在伺服器上安裝完整版本 - 一台專用電腦，可以是實體電腦，也可以從 AWS 等雲端供應商租用。此模式功能強大，可讓您完全控制部署，但需要專門的工程團隊來設定、維護和擴充。</p>
<p><strong>使用</strong> <a href="https://cloud.zilliz.com/signup"><strong>Zilliz Cloud</strong></a><strong>。</strong>Zilliz Cloud 是完全受管理的 Milvus，上面有更先進的企業級功能，由相同的團隊打造。</p>
<ul>
<li><p><strong>操作和維護零麻煩。</strong></p></li>
<li><p><strong>提供免費等級。</strong> <a href="https://cloud.zilliz.com/signup">免費等級</a>包含 5GB 儲存空間 - 足夠擷取《<em>呼啸山莊</em>》全部內容 360 次，或 360 本書。對於較大的工作負載，還有 30 天的免費試用。</p></li>
<li><p><strong>總是第一時間獲得新功能。</strong>當 Milvus 發佈改進功能時，Zilliz Cloud 會自動取得這些功能 - 無需等待您的團隊排程升級。</p></li>
</ul>
<pre><code translate="no">
MILVUS_URI = <span class="hljs-string">&quot;https://xxx.zillizcloud.com&quot;</span>  <span class="hljs-comment"># That&#x27;s the only change.</span>

client = MilvusClient(uri=MILVUS_URI)

<button class="copy-code-btn"></button></code></pre>
<p><a href="https://cloud.zilliz.com/signup">註冊 Zilliz Cloud</a> 並試用一下。</p>
<h2 id="When-GEO-Content-Generation-Backfires" class="common-anchor-header">當 GEO 內容產生反效果時<button data-href="#When-GEO-Content-Generation-Backfires" class="anchor-icon" translate="no">
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
    </button></h2><p>GEO 內容產生僅與其背後的知識庫一樣有效。以下是幾個弊大於利的案例：</p>
<p><strong>沒有權威的原始資料。</strong>若沒有堅實的知識基礎，LLM 就只能依靠訓練資料。結果充其量只是一般的輸出，最糟的情況是產生幻覺。RAG 步驟的整個重點就是將生成建立在經過驗證的資訊之上 - 跳過這一步，你就只是在做有額外步驟的提示工程。</p>
<p><strong>宣傳不存在的東西。</strong>如果產品無法如描述般運作，那就不是 GEO - 那是錯誤的資訊。自我評分步驟會發現一些品質問題，但它無法驗證知識庫中沒有矛盾的聲稱。</p>
<p><strong>您的受眾純粹是人類。</strong>GEO 最佳化 (結構化的標題、直接的第一段答案、引用密度) 是針對 AI 的可發現性所設計的。如果您純粹是為人類讀者撰寫，可能會感覺公式化。了解您的目標受眾。</p>
<p><strong>關於扣分臨界值的說明。</strong>管道會丟棄余弦相似度高於 0.85 的查詢。如果有太多近似複製的查詢獲得通過，請降低閾值。如果管道捨棄看起來真的不一樣的查詢，則提高它。0.85 是一個合理的起點，但正確的值取決於您的主題有多狹窄。</p>
<h2 id="Conclusion" class="common-anchor-header">總結<button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p>GEO 就像十年前的 SEO - 早到足以讓您擁有真正的優勢。本教學建立了一個管道，可以產生 AI 搜尋引擎實際引用的文章，以您品牌自己的原始資料為基礎，而不是 LLM 的幻覺。這個堆疊是用<a href="https://github.com/nicepkg/openclaw">OpenClaw</a>來協調，<a href="https://milvus.io/intro">Milvus</a>用來儲存知識和<a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">RAG</a>檢索，而 LLM 則用來產生和評分。</p>
<p>完整的原始碼位於<a href="https://github.com/nicepkg/openclaw">github.com/nicepkg/openclaw</a>。</p>
<p>如果您正在建立 GEO 策略，並且需要基礎架構的支援：</p>
<ul>
<li>加入<a href="https://slack.milvus.io/">Milvus Slack 社群</a>，看看其他團隊如何使用向量搜尋內容、dedup 和 RAG。</li>
<li><a href="https://milvus.io/office-hours">預約 20 分鐘的 Milvus Office Hours 免費課程</a>，與團隊討論您的使用個案。</li>
<li>如果您想跳過基礎架構的設定，<a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a>(Milvus管理) 有免費的層級 - 只要變更一個URI，您就可以投入生產。</li>
</ul>
<hr>
<p>行銷團隊開始探索 GEO 時會遇到的幾個問題：</p>
<p><strong>我的 SEO 流量正在下降。</strong>GEO 並沒有<strong>取代</strong>SEO - 它只是將 SEO 延伸到一個新的管道。傳統的 SEO 仍然是透過使用者點選網頁來驅動流量。GEO 針對的是越來越多的查詢，使用者可以直接從 AI (Perplexity、ChatGPT Search、Google AI Overview) 獲得答案，而不需要造訪網站。如果您在分析中看到零點擊率攀升，這就是 GEO 旨在奪回的流量 - 不是透過點擊，而是透過 AI 生成的答案中的品牌引用。</p>
<p><strong>GEO 內容與一般人工智慧產生的內容有何不同？</strong>大部分人工智慧產生的內容都是泛泛而論 - LLM 從訓練資料中擷取並產生一些聽起來合理的內容，但這些內容並不是以您品牌的實際事實、主張或資料為基礎。GEO 內容是以使用 RAG（檢索增強生成）的經驗證原始資料知識庫為基礎。其差異在於內容的輸出：具體的產品細節而非含糊的概括，真實的數字而非捏造的統計，以及在數十篇文章中一致的品牌聲音。</p>
<p><strong>我需要多少篇文章才能讓 GEO 有效運作？</strong>沒有神奇的數字，但邏輯很簡單：AI 模型會從多個來源合成每個答案。您的優質內容所涵蓋的長尾查詢越多，您的品牌出現的頻率就越高。從 20 到 30 篇圍繞核心主題的文章開始，評估哪些文章會被引用（檢查您的 AI 提及率和轉介流量），然後再擴大規模。</p>
<p><strong>AI 搜尋引擎不會懲罰大量產生的內容嗎？</strong>如果是低品質的<strong>內容</strong>，它們會。AI 搜尋引擎越來越擅長偵測無來源的聲明、重複使用的措辭，以及無法增加原始價值的內容。這正是此管道包含知識庫作為基礎，以及自我評分步驟作為品質控制的原因。我們的目標不是產生更多內容，而是產生真正有用的內容，讓人工智能模型能夠引用。</p>
