---
id: i-built-a-stock-monitoring-agent-with-openclaw-exa-and-milvus-for-20month.md
title: 我用 OpenClaw、Exa 和 Milvus 建立了一個股票監控代理，每月只需 $20。
author: Cheney Zhang
date: 2026-3-13
cover: assets.zilliz.com/blog_Open_Claw_3_510bc283aa.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'AI agent, stock monitoring agent, Milvus, vector database, OpenClaw'
meta_keywords: 'AI agent, stock monitoring agent, Milvus, vector database, OpenClaw'
meta_title: |
  OpenClaw Tutorial: AI Stock Agent with Exa and Milvus
desc: 使用 OpenClaw、Exa 和 Milvus 建立 AI 股票監控代理的逐步指南。晨間簡報、交易記憶和警示，每月 20 美元。
origin: >-
  https://milvus.io/blog/i-built-a-stock-monitoring-agent-with-openclaw-exa-and-milvus-for-20month.md
---
<p>我從事美股交易，這是一種客氣的說法，表示我把虧錢當成一種嗜好。我的同事開玩笑說我的策略是「興奮時高買，恐懼時低賣，每週重覆」。</p>
<p>重複的部分是我的死穴。每次我盯著市場，最後都會做一筆我沒有計劃的交易。石油飆升，我恐慌性賣出。某隻科技股漲了 4%，我追逐它。一個星期之後，我看著我的交易歷史，<em>上個季度我不是也做了這件事嗎？</em></p>
<p>所以我用 OpenClaw 建立了一個代理程式，它可以代替我觀察市場，阻止我犯同樣的錯誤。它不會交易或碰觸我的錢，因為那會有太大的安全風險。相反，它可以節省我花在觀察市場的時間，並讓我不犯同樣的錯誤。</p>
<p>這個代理程式包含三個部分，每月約需 20 美元：</p>
<ul>
<li><strong><a href="https://milvus.io/blog/openclaw-formerly-clawdbot-moltbot-explained-a-complete-guide-to-the-autonomous-ai-agent.md">OpenClaw</a></strong> <strong>用於自動執行。</strong>OpenClaw 以每 30 分鐘心跳一次的方式運行代理程式，只有在真正重要的事情發生時才會呼叫我，這樣就能緩解以往讓我目不转睛盯著螢幕的 FOMO。之前，我越是觀察價格，就越是會做出衝動的反應。</li>
<li><strong><a href="https://exa.ai/">Exa</a></strong> <strong>提供精確、即時的搜尋。</strong>Exa 會依據排程瀏覽並總結精心挑選的資訊來源，因此我每天早上都會收到一份簡潔的簡報。在此之前，我每天都要花一小時的時間，從 SEO 垃圾郵件和臆測中篩選可靠的新聞，而且無法自動化，因為金融網站每天都會更新，以對抗刮擦程式。</li>
<li><strong><a href="https://milvus.io/">Milvus</a></strong> <strong>用於個人歷史和偏好。</strong>Milvus 儲存了我的交易歷史，代理會在我做決定之前搜尋它 - 如果我即將重蹈覆轍，它會告訴我。以前，檢視過去的交易非常乏味，我就沒有這樣做，所以同樣的錯誤不斷在不同的股票上發生。<a href="https://zilliz.com/cloud">Zilliz Cloud</a>是 Milvus 的完全管理版本。如果您想要一個無憂無慮的體驗，Zilliz Cloud 是一個很好的選擇<a href="https://cloud.zilliz.com/signup">（有免費層級</a>）。</li>
</ul>
<p>以下是我如何一步一步設定的。</p>
<h2 id="Step-1-Get-Real-Time-Market-Intelligence-with-Exa" class="common-anchor-header">步驟 1：使用 Exa 獲得即時市場情報<button data-href="#Step-1-Get-Real-Time-Market-Intelligence-with-Exa" class="anchor-icon" translate="no">
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
    </button></h2><p>之前，我曾嘗試瀏覽金融應用程式、撰寫搜刮程式，以及研究專業的資料終端。我的經驗？應用程式將信號埋藏在雜訊之下，刮擦程式經常損壞，而專業 API 的價格又高得令人望而卻步。Exa 是專為 AI 代理打造的搜尋 API，可解決上述問題。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog_Open_Claw_1_d15ac4d2e3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong><a href="https://exa.ai/">Exa</a></strong>是一個網頁搜尋 API，可為 AI 代理傳回結構化、AI 就緒的資料。它由<a href="https://zilliz.com/cloud">Zilliz Cloud</a>（Milvus 的全面管理服務）提供支援。如果 Perplexity 是人類使用的搜尋引擎，Exa 則是 AI 使用的搜尋引擎。代理程式傳送查詢，Exa 會以 JSON 格式傳回文章文字、關鍵句子和摘要 - 結構化的輸出，代理程式可以直接解析並採取行動，無需刮擦。</p>
<p>Exa 也在引擎蓋下使用語意搜尋，因此代理可以使用自然語言進行查詢。類似「儘管 2026 年第四季獲利強勁，為何 NVIDIA 股價仍下跌」的查詢會返回路透社和彭博社的分析師分析，而不是 SEO clickbait 頁面。</p>
<p>Exa 有免費的層級 - 每月 1,000 次搜尋，足以讓您開始使用。若要跟隨，請安裝 SDK 並換入您自己的 API 金鑰：</p>
<pre><code translate="no">pip install exa-py
<button class="copy-code-btn"></button></code></pre>
<p>以下是核心呼叫：</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> exa_py <span class="hljs-keyword">import</span> Exa

exa = Exa(api_key=<span class="hljs-string">&quot;your-api-key&quot;</span>)

<span class="hljs-comment"># Semantic search — describe what you want in plain language</span>
result = exa.search(
    <span class="hljs-string">&quot;Why did NVIDIA stock drop despite strong Q4 2026 earnings&quot;</span>,
    <span class="hljs-built_in">type</span>=<span class="hljs-string">&quot;neural&quot;</span>,          <span class="hljs-comment"># semantic search, not keyword</span>
    num_results=<span class="hljs-number">10</span>,
    start_published_date=<span class="hljs-string">&quot;2026-02-25&quot;</span>,   <span class="hljs-comment"># only search for latest information</span>
    contents={
        <span class="hljs-string">&quot;text&quot;</span>: {<span class="hljs-string">&quot;max_characters&quot;</span>: <span class="hljs-number">3000</span>},       <span class="hljs-comment"># get full article text</span>
        <span class="hljs-string">&quot;highlights&quot;</span>: {<span class="hljs-string">&quot;num_sentences&quot;</span>: <span class="hljs-number">3</span>},     <span class="hljs-comment"># key sentences</span>
        <span class="hljs-string">&quot;summary&quot;</span>: {<span class="hljs-string">&quot;query&quot;</span>: <span class="hljs-string">&quot;What caused the stock drop?&quot;</span>}  <span class="hljs-comment"># AI summary</span>
    }
)

<span class="hljs-keyword">for</span> r <span class="hljs-keyword">in</span> result.results:
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[<span class="hljs-subst">{r.published_date}</span>] <span class="hljs-subst">{r.title}</span>&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;  Summary: <span class="hljs-subst">{r.summary}</span>&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;  URL: <span class="hljs-subst">{r.url}</span>\n&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>內容參數在這裡做了大部分的工作 - 文字會拉出完整的文章，重點會擷取關鍵句子，而摘要則會根據您提供的問題產生重點摘要。一個 API 呼叫就能取代二十分鐘的跳頁。</p>
<p>這個基本模式涵蓋了很多內容，但我最後建立了四種變體，以處理我經常遇到的不同情況：</p>
<ul>
<li><strong>依來源可信度過濾。</strong>對於盈利分析，我只想要路透社、彭博社或《華爾街日報》，而不是十二小時後重新撰寫報告的內容農場。</li>
</ul>
<pre><code translate="no"><span class="hljs-comment"># Only financial reports from trusted sources</span>
earnings = exa.search(
    <span class="hljs-string">&quot;NVIDIA Q4 2026 earnings analysis&quot;</span>,
    category=<span class="hljs-string">&quot;financial report&quot;</span>,
    num_results=<span class="hljs-number">5</span>,
    include_domains=[<span class="hljs-string">&quot;reuters.com&quot;</span>, <span class="hljs-string">&quot;bloomberg.com&quot;</span>, <span class="hljs-string">&quot;wsj.com&quot;</span>],
    contents={<span class="hljs-string">&quot;highlights&quot;</span>: <span class="hljs-literal">True</span>}
)
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><strong>尋找類似分析。</strong>當我讀到一篇好文章時，我想要更多相同主題的觀點，而不需要手動搜尋。</li>
</ul>
<pre><code translate="no"><span class="hljs-comment"># &quot;Show me more analysis like this one&quot;</span>
similar = exa.find_similar(
    url=<span class="hljs-string">&quot;https://fortune.com/2026/02/25/nvidia-nvda-earnings-q4-results&quot;</span>,
    num_results=<span class="hljs-number">10</span>,
    start_published_date=<span class="hljs-string">&quot;2026-02-20&quot;</span>,
    contents={<span class="hljs-string">&quot;text&quot;</span>: {<span class="hljs-string">&quot;max_characters&quot;</span>: <span class="hljs-number">2000</span>}}
)
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><strong>深入搜尋複雜的問題。</strong>有些問題不是一篇文章就能回答的，例如中東的緊張局勢如何影響半導體供應鏈。深度搜尋可綜合多種來源，並傳回有結構的摘要。</li>
</ul>
<pre><code translate="no"><span class="hljs-comment"># Complex question — needs multi-source synthesis</span>
deep_result = exa.search(
    <span class="hljs-string">&quot;How will Middle East tensions affect global tech supply chain and semiconductor stocks&quot;</span>,
    <span class="hljs-built_in">type</span>=<span class="hljs-string">&quot;deep&quot;</span>,
    num_results=<span class="hljs-number">8</span>,
    contents={
        <span class="hljs-string">&quot;summary&quot;</span>: {
            <span class="hljs-string">&quot;query&quot;</span>: <span class="hljs-string">&quot;Extract: 1) supply chain risk 2) stock impact 3) timeline&quot;</span>
        }
    }
)
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><strong>即時新聞監控。</strong>在市場交易時段，我需要篩選出當天的即時新聞。</li>
</ul>
<pre><code translate="no"><span class="hljs-comment"># Breaking news only — today&#x27; iss date 2026-03-05</span>
breaking = exa.search(
    <span class="hljs-string">&quot;US stock market breaking news today&quot;</span>,
    category=<span class="hljs-string">&quot;news&quot;</span>,
    num_results=<span class="hljs-number">20</span>,
    start_published_date=<span class="hljs-string">&quot;2026-03-05&quot;</span>,
    contents={<span class="hljs-string">&quot;highlights&quot;</span>: {<span class="hljs-string">&quot;num_sentences&quot;</span>: <span class="hljs-number">2</span>}}
)
<button class="copy-code-btn"></button></code></pre>
<p>我使用這些模式寫了大約一打範本，涵蓋聯儲局政策、科技業收益、油價和宏觀指標。它們每天早上自動執行，並將結果推送到我的手機上。以前需要花一個小時瀏覽，現在只需要在喝咖啡時花五分鐘閱讀摘要。</p>
<h2 id="Step-2-Store-Trading-History-in-Milvus-for-Smarter-Decisions" class="common-anchor-header">步驟二：在 Milvus 中儲存交易歷史，以做出更聰明的決策<button data-href="#Step-2-Store-Trading-History-in-Milvus-for-Smarter-Decisions" class="anchor-icon" translate="no">
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
    </button></h2><p>Exa 解決了我的資訊問題。但我仍在重複相同的交易 - 在跌勢中恐慌性拋售，但沒幾天就回升，而且追逐動能買入價格已經過高的股票。我憑著情緒行事，一旦遇到類似情況就後悔不已，忘記了教訓。</p>
<p>我需要一個個人知識庫：可以儲存我過去的交易、我的推理和我的失誤。這不是我必須手動檢視的東西（我曾試過，但從來沒有保持過），而是每當類似情況出現時，代理可以自行搜尋的東西。如果我即將重蹈覆轍，我希望代理能在我按下按鈕前告訴我。將「目前情況」與「過去經驗」配對是向量資料庫可以解決的相似性搜尋問題，所以我挑了一個資料庫來儲存我的資料。</p>
<p>我使用的是<a href="https://github.com/milvus-io/milvus-lite">Milvus Lite</a>，它是 Milvus 的輕量級版本，可在本機執行。它沒有伺服器設定，非常適合做原型和實驗。我將資料分成三個集合。嵌入維度為 1536，以符合 OpenAI 的 text-embedding-3-small 模型，可以直接使用：</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient, DataType
<span class="hljs-keyword">from</span> openai <span class="hljs-keyword">import</span> OpenAI

milvus = MilvusClient(<span class="hljs-string">&quot;./my_investment_brain.db&quot;</span>)
llm = OpenAI()

<span class="hljs-keyword">def</span> <span class="hljs-title function_">embed</span>(<span class="hljs-params">text: <span class="hljs-built_in">str</span></span>) -&gt; <span class="hljs-built_in">list</span>[<span class="hljs-built_in">float</span>]:
    <span class="hljs-keyword">return</span> llm.embeddings.create(
        <span class="hljs-built_in">input</span>=text, model=<span class="hljs-string">&quot;text-embedding-3-small&quot;</span>
    ).data[<span class="hljs-number">0</span>].embedding

<span class="hljs-comment"># Collection 1: past decisions and lessons</span>
<span class="hljs-comment"># Every trade I make, I write a short review afterward</span>
milvus.create_collection(
    <span class="hljs-string">&quot;decisions&quot;</span>,
    dimension=<span class="hljs-number">1536</span>,
    auto_id=<span class="hljs-literal">True</span>
)

<span class="hljs-comment"># Collection 2: my preferences and biases</span>
<span class="hljs-comment"># Things like &quot;I tend to hold tech stocks too long&quot;</span>
milvus.create_collection(
    <span class="hljs-string">&quot;preferences&quot;</span>,
    dimension=<span class="hljs-number">1536</span>,
    auto_id=<span class="hljs-literal">True</span>
)

<span class="hljs-comment"># Collection 3: market patterns I&#x27;ve observed</span>
<span class="hljs-comment"># &quot;When VIX &gt; 30 and Fed is dovish, buy the dip usually works&quot;</span>
milvus.create_collection(
    <span class="hljs-string">&quot;patterns&quot;</span>,
    dimension=<span class="hljs-number">1536</span>,
    auto_id=<span class="hljs-literal">True</span>
)
<button class="copy-code-btn"></button></code></pre>
<p>這三個集合對應了三種類型的個人資料，每種資料都有不同的檢索策略：</p>
<table>
<thead>
<tr><th><strong>類型</strong></th><th><strong>儲存內容</strong></th><th><strong>代理如何使用</strong></th></tr>
</thead>
<tbody>
<tr><td><strong>偏好</strong></td><td>偏好、風險承受度、投資理念 (「我傾向持有科技股太久」)</td><td>每次執行時都載入到代理的上下文中</td></tr>
<tr><td><strong>決策與模式</strong></td><td>過去的特定交易、經驗教訓、市場觀察</td><td>只有在相關情況出現時，才會透過相似性搜尋擷取</td></tr>
<tr><td><strong>外部知識</strong></td><td>研究報告、SEC 檔案、公共資料</td><td>未儲存於 Milvus - 可透過 Exa 搜尋</td></tr>
</tbody>
</table>
<p>我建立了三個不同的資料庫，因為將這些資料庫混合到一個資料庫中，會導致每個提示都充斥著不相干的交易歷史，或是當核心偏見與目前的查詢不夠吻合時，就會失去核心偏見。</p>
<p>一旦集合存在，我需要一種方法來自動填充它們。我不想在每次與經紀人交談後複製貼上資訊，因此我建立了一個記憶體擷取器，在每次聊天會話結束時執行。</p>
<p>提取器會做兩件事：提取和重複。擷取器會要求 LLM 從對話中擷取結構化的洞察 - 決策、偏好、模式、教訓 - 並將每個洞察路由到正確的集合。在儲存任何內容之前，它會檢查與已有內容的相似度。如果新的洞察與現有項目相似度超過 92%，就會被跳過。</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> json

<span class="hljs-keyword">def</span> <span class="hljs-title function_">extract_and_store_memories</span>(<span class="hljs-params">conversation: <span class="hljs-built_in">list</span>[<span class="hljs-built_in">dict</span>]</span>) -&gt; <span class="hljs-built_in">int</span>:
    <span class="hljs-string">&quot;&quot;&quot;
    After each chat session, extract personal insights
    and store them in Milvus automatically.
    &quot;&quot;&quot;</span>
    <span class="hljs-comment"># Ask LLM to extract structured memories from conversation</span>
    extraction_prompt = <span class="hljs-string">&quot;&quot;&quot;
    Analyze this conversation and extract any personal investment insights.
    Look for:
    1. DECISIONS: specific buy/sell actions and reasoning
    2. PREFERENCES: risk tolerance, sector biases, holding patterns
    3. PATTERNS: market observations, correlations the user noticed
    4. LESSONS: things the user learned or mistakes they reflected on

    Return a JSON array. Each item has:
    - &quot;type&quot;: one of &quot;decision&quot;, &quot;preference&quot;, &quot;pattern&quot;, &quot;lesson&quot;
    - &quot;content&quot;: the insight in 2-3 sentences
    - &quot;confidence&quot;: how explicitly the user stated this (high/medium/low)

    Only extract what the user clearly expressed. Do not infer or guess.
    If nothing relevant, return an empty array.
    &quot;&quot;&quot;</span>

    response = llm.chat.completions.create(
        model=<span class="hljs-string">&quot;gpt-4o&quot;</span>,
        messages=[
            {<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;system&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: extraction_prompt},
            *conversation
        ],
        response_format={<span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;json_object&quot;</span>}
    )

    memories = json.loads(response.choices[<span class="hljs-number">0</span>].message.content)
    stored = <span class="hljs-number">0</span>

    <span class="hljs-keyword">for</span> mem <span class="hljs-keyword">in</span> memories.get(<span class="hljs-string">&quot;items&quot;</span>, []):
        <span class="hljs-keyword">if</span> mem[<span class="hljs-string">&quot;confidence&quot;</span>] == <span class="hljs-string">&quot;low&quot;</span>:
            <span class="hljs-keyword">continue</span>    <span class="hljs-comment"># skip uncertain inferences</span>

        collection = {
            <span class="hljs-string">&quot;decision&quot;</span>: <span class="hljs-string">&quot;decisions&quot;</span>,
            <span class="hljs-string">&quot;lesson&quot;</span>: <span class="hljs-string">&quot;decisions&quot;</span>,
            <span class="hljs-string">&quot;preference&quot;</span>: <span class="hljs-string">&quot;preferences&quot;</span>,
            <span class="hljs-string">&quot;pattern&quot;</span>: <span class="hljs-string">&quot;patterns&quot;</span>
        }.get(mem[<span class="hljs-string">&quot;type&quot;</span>], <span class="hljs-string">&quot;decisions&quot;</span>)

        <span class="hljs-comment"># Check for duplicates — don&#x27;t store the same insight twice</span>
        existing = milvus.search(
            collection,
            data=[embed(mem[<span class="hljs-string">&quot;content&quot;</span>])],
            limit=<span class="hljs-number">1</span>,
            output_fields=[<span class="hljs-string">&quot;text&quot;</span>]
        )

        <span class="hljs-keyword">if</span> existing[<span class="hljs-number">0</span>] <span class="hljs-keyword">and</span> existing[<span class="hljs-number">0</span>][<span class="hljs-number">0</span>][<span class="hljs-string">&quot;distance&quot;</span>] &gt; <span class="hljs-number">0.92</span>:
            <span class="hljs-keyword">continue</span>    <span class="hljs-comment"># too similar to existing memory, skip</span>

        milvus.insert(collection, [{
            <span class="hljs-string">&quot;vector&quot;</span>: embed(mem[<span class="hljs-string">&quot;content&quot;</span>]),
            <span class="hljs-string">&quot;text&quot;</span>: mem[<span class="hljs-string">&quot;content&quot;</span>],
            <span class="hljs-string">&quot;type&quot;</span>: mem[<span class="hljs-string">&quot;type&quot;</span>],
            <span class="hljs-string">&quot;source&quot;</span>: <span class="hljs-string">&quot;chat_extraction&quot;</span>,
            <span class="hljs-string">&quot;date&quot;</span>: <span class="hljs-string">&quot;2026-03-05&quot;</span>
        }])
        stored += <span class="hljs-number">1</span>

    <span class="hljs-keyword">return</span> stored
<button class="copy-code-btn"></button></code></pre>
<p>當我面對新的市場狀況，有交易的衝動時，代理程式會執行回想功能。我描述發生了什麼事，它就會搜尋所有三個收藏集的相關歷史：</p>
<pre><code translate="no"><span class="hljs-keyword">def</span> <span class="hljs-title function_">recall_my_experience</span>(<span class="hljs-params">situation: <span class="hljs-built_in">str</span></span>) -&gt; <span class="hljs-built_in">dict</span>:
    <span class="hljs-string">&quot;&quot;&quot;
    Given a current market situation, retrieve my relevant
    past experiences, preferences, and observed patterns.
    &quot;&quot;&quot;</span>
    query_vec = embed(situation)

    <span class="hljs-comment"># Search all three collections in parallel</span>
    past_decisions = milvus.search(
        <span class="hljs-string">&quot;decisions&quot;</span>, data=[query_vec], limit=<span class="hljs-number">3</span>,
        output_fields=[<span class="hljs-string">&quot;text&quot;</span>, <span class="hljs-string">&quot;date&quot;</span>, <span class="hljs-string">&quot;tag&quot;</span>]
    )
    my_preferences = milvus.search(
        <span class="hljs-string">&quot;preferences&quot;</span>, data=[query_vec], limit=<span class="hljs-number">2</span>,
        output_fields=[<span class="hljs-string">&quot;text&quot;</span>, <span class="hljs-string">&quot;type&quot;</span>]
    )
    my_patterns = milvus.search(
        <span class="hljs-string">&quot;patterns&quot;</span>, data=[query_vec], limit=<span class="hljs-number">2</span>,
        output_fields=[<span class="hljs-string">&quot;text&quot;</span>]
    )

    <span class="hljs-keyword">return</span> {
        <span class="hljs-string">&quot;past_decisions&quot;</span>: [h[<span class="hljs-string">&quot;entity&quot;</span>] <span class="hljs-keyword">for</span> h <span class="hljs-keyword">in</span> past_decisions[<span class="hljs-number">0</span>]],
        <span class="hljs-string">&quot;preferences&quot;</span>: [h[<span class="hljs-string">&quot;entity&quot;</span>] <span class="hljs-keyword">for</span> h <span class="hljs-keyword">in</span> my_preferences[<span class="hljs-number">0</span>]],
        <span class="hljs-string">&quot;patterns&quot;</span>: [h[<span class="hljs-string">&quot;entity&quot;</span>] <span class="hljs-keyword">for</span> h <span class="hljs-keyword">in</span> my_patterns[<span class="hljs-number">0</span>]]
    }

<span class="hljs-comment"># When Agent analyzes current tech selloff:</span>
context = recall_my_experience(
    <span class="hljs-string">&quot;tech stocks dropping 3-4% due to Middle East tensions, March 2026&quot;</span>
)

<span class="hljs-comment"># context now contains:</span>
<span class="hljs-comment"># - My 2024-10 lesson about not panic-selling during ME crisis</span>
<span class="hljs-comment"># - My preference: &quot;I tend to overweight geopolitical risk&quot;</span>
<span class="hljs-comment"># - My pattern: &quot;tech selloffs from geopolitics recover in 1-3 weeks&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>舉例來說，三月初科技股因中東緊張局勢而下跌 3-4%，這個代理程式就會調出三樣東西：2024 年 10 月的教訓：不要在地緣政治低迷時恐慌性拋售；偏好說明：我傾向於超配地緣政治風險；以及我記錄下來的模式（地緣政治導致的科技股大跌通常會在一到三週內復甦）。</p>
<p>我同事的看法是：如果您的訓練資料是失敗記錄，那麼 AI 究竟在學習什麼？但這才是重點 - 代理不是在複製我的交易，而是在記住它們，這樣它就能勸我不要再做下一次交易了。</p>
<h2 id="Step-3-Teach-Your-Agent-to-Analyze-with-OpenClaw-Skills" class="common-anchor-header">步驟 3：教您的代理使用 OpenClaw Skills 進行分析<button data-href="#Step-3-Teach-Your-Agent-to-Analyze-with-OpenClaw-Skills" class="anchor-icon" translate="no">
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
    </button></h2><p>在這一點上，代理擁有可靠的資訊<a href="https://exa.ai/">(Exa</a>) 和個人記憶<a href="https://github.com/milvus-io/milvus-lite">(Milvus</a>)。但是，如果您將兩者交給 LLM 並說「分析這個」，您會得到一個通用的、對沖一切的回應。它會提到所有可能的角度，並以「投資人應衡量風險」作結。這還不如什麼都不說。</p>
<p>解決方法是撰寫您自己的分析框架，並將其作為明確的指示交給經紀人。您必須告訴它您關心哪些指標，您認為哪些情況是危險的，以及何時應該保守，何時應該進取。這些規則對每個投資者而言都是不同的，因此您必須自行定義。</p>
<p>OpenClaw 透過 Skills 來做到這一點 - Skills/ 目錄中的 markdown 檔案。當代理遇到相關情況時，它會載入相匹配的 Skill，並遵循您的框架，而不是自由發揮。</p>
<p>以下是我為了在收益報告之後評估股票而寫的：</p>
<pre><code translate="no">---
name: post-earnings-eval
description: &gt;
  Evaluate whether to buy, hold, or sell after an earnings report.
  Trigger when discussing any stock&#x27;s post-earnings price action,
  or when a watchlist stock reports earnings.
---

## Post-Earnings Evaluation Framework

When analyzing a stock after earnings release:

### Step 1: Get the facts
Use Exa to search for:
- Actual vs expected: revenue, EPS, forward guidance
- Analyst reactions from top-tier sources
- Options market implied move vs actual move

### Step 2: Check my history
Use Milvus recall to find:
- Have I traded this stock after earnings before?
- What did I get right or wrong last time?
- Do I have a known bias about this sector?

### Step 3: Apply my rules
- If revenue beat &gt; 5% AND guidance raised → lean BUY
- If stock drops &gt; 5% on a beat → likely sentiment/macro driven
  - Check: is the drop about THIS company or the whole market?
  - Check my history: did I overreact to similar drops before?
- If P/E &gt; 2x sector average after beat → caution, priced for perfection

### Step 4: Output format
Signal: BUY / HOLD / SELL / WAIT
Confidence: High / Medium / Low
Reasoning: 3 bullets max
Past mistake reminder: what I got wrong in similar situations

IMPORTANT: Always surface my past mistakes. I have a tendency to
let fear override data. If my Milvus history shows I regretted
selling after a dip, say so explicitly.
<button class="copy-code-btn"></button></code></pre>
<p>最後一行是最重要的：「永遠浮現我過去的錯誤。我有讓恐懼凌駕於數據之上的傾向。如果我的 Milvus 歷史顯示我後悔在下跌後賣出，那就明確地說出來"。這就是我告訴經紀人我到底哪裡做錯了，所以它知道什麼時候應該反擊。如果您建立自己的系統，這部分就是您要根據自己的偏見自訂的部分。</p>
<p>我為情緒分析、宏觀指標和行業輪動信號寫了類似的 Skills。我還寫了一些 Skills，模擬我所推崇的投資人如何評估相同的情況 - 巴菲特的價值框架、Bridgewater 的宏觀方法。這些不是決策者；而是額外的觀點。</p>
<p>警告：不要讓法學碩士計算 RSI 或 MACD 等技術指標。他們會自信地幻化出數字。請自行計算這些指標或呼叫專用 API，並將結果作為輸入饋送至 Skill。</p>
<h2 id="Step-4-Start-Your-Agent-with-OpenClaw-Heartbeat" class="common-anchor-header">步驟 4：使用 OpenClaw Heartbeat 啟動您的代理程式<button data-href="#Step-4-Start-Your-Agent-with-OpenClaw-Heartbeat" class="anchor-icon" translate="no">
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
    </button></h2><p>上面的一切仍然需要您手動觸發。如果您每次想要更新時都得開啟終端機，那您幾乎又得在開會時滾動您的經紀人應用程式了。</p>
<p>OpenClaw 的 Heartbeat 機制解決了這個問題。閘道每 30 分鐘 (可設定) 會 pings 經紀人一次，而經紀人會檢查 HEARTBEAT.md 檔案，以決定當時該做什麼。這是一個標記檔，包含以時間為基礎的規則：</p>
<pre><code translate="no"><span class="hljs-meta"># HEARTBEAT.md — runs every 30 minutes automatically</span>

<span class="hljs-meta">## Morning brief (6:30-7:30 AM only)</span>
- Use Exa to search overnight US market news, Asian markets, oil prices
- Search Milvus <span class="hljs-keyword">for</span> my current positions <span class="hljs-keyword">and</span> relevant past experiences
- <span class="hljs-function">Generate a personalized morning <span class="hljs-title">brief</span> (<span class="hljs-params">under <span class="hljs-number">500</span> words</span>)
- Flag anything related to my past mistakes <span class="hljs-keyword">or</span> current holdings
- End <span class="hljs-keyword">with</span> 1-3 action items
- Send the brief to my phone

## Price <span class="hljs-title">alerts</span> (<span class="hljs-params">during US market hours <span class="hljs-number">9</span>:<span class="hljs-number">30</span> AM - <span class="hljs-number">4</span>:<span class="hljs-number">00</span> PM ET</span>)
- Check price changes <span class="hljs-keyword">for</span>: NVDA, TSM, MSFT, AAPL, GOOGL
- If any stock moved more than 3% since last check:
  - Search Milvus <span class="hljs-keyword">for</span>: why I hold <span class="hljs-keyword">this</span> stock, my exit criteria
  - Generate alert <span class="hljs-keyword">with</span> context <span class="hljs-keyword">and</span> recommendation
  - Send alert to my phone

## End of day <span class="hljs-title">summary</span> (<span class="hljs-params">after <span class="hljs-number">4</span>:<span class="hljs-number">30</span> PM ET <span class="hljs-keyword">on</span> weekdays</span>)
- Summarize today&#x27;s market action <span class="hljs-keyword">for</span> my watchlist
- Compare actual moves <span class="hljs-keyword">with</span> my morning expectations
- Note any <span class="hljs-keyword">new</span> patterns worth remembering
</span><button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog_Open_Claw_2_b2c5262371.jpg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Results-Less-Screen-Time-Fewer-Impulsive-Trades" class="common-anchor-header">結果：減少螢幕時間，減少衝動交易<button data-href="#Results-Less-Screen-Time-Fewer-Impulsive-Trades" class="anchor-icon" translate="no">
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
    </button></h2><p>以下是系統每天實際產生的結果：</p>
<ul>
<li><strong>早上簡報 (早上 7:00)。</strong>代理整夜執行 Exa，從 Milvus 擷取我的倉位和相關歷史記錄，然後將個人化摘要推送到我的手機 - 不超過 500 個字。隔夜發生了什麼，與我的持倉有何關聯，以及一到三個行動項目。我一邊刷牙一邊閱讀。</li>
<li><strong>日內警示（美東時間上午 9:30-下午 4:00）。</strong>每 30 分鐘，經紀人會檢查我的觀察名單。如果任何股票移動超過 3%，我就會收到通知，說明相關情況：我為什麼買進它、我的止蝕點在哪裡，以及我之前是否遇到過類似情況。</li>
<li><strong>每週回顧（週末）。</strong>經紀人會彙整整一週的情況 - 市場走勢、與我早上的預期相比如何，以及值得記住的模式。我在星期六花 30 分鐘閱讀。本週其餘時間，我刻意遠離螢幕。</li>
</ul>
<p>最後一點是最大的改變。經紀人不只節省時間，也讓我不用再觀察市場。不看價格就無法恐慌性銷售。</p>
<p>在使用這套系統之前，我每週要花 10-15 個小時來收集資訊、監察市場和審閱交易，分散在會議、通勤時間和深夜滾動頁面上。現在大約是兩個小時：每天早上 5 分鐘的簡報，加上週末 30 分鐘的回顧。</p>
<p>資訊品質也更好。我閱讀的是路透社和彭博社的摘要，而不是 Twitter 上的任何病毒。每當我想行動時，經紀人就會提醒我過去的錯誤，我已經大幅減少了衝動的交易。我還不能證明這讓我成為更好的投資者，但它讓我不再那麼魯莽。</p>
<p>總成本：OpenClaw 每月 10 美元，Exa 每月 10 美元，以及 Milvus Lite 運行所需的一點電費。</p>
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
    </button></h2><p>我不斷做出同樣衝動的交易，因為我的資訊很糟糕，我很少回顧自己的歷史，整天盯著市場讓情況更糟。因此我建立了一個 AI 代理，透過三件事來解決這些問題：</p>
<ul>
<li>使用<strong><a href="https://exa.ai/">Exa</a></strong><strong>收集可靠的市場新聞</strong>，取代一小時捲動 SEO 垃圾郵件和收費網站的時間。</li>
<li>使用<a href="http://milvus.io">Milvus</a><strong>記憶我過去的交易</strong>，並在我即將重蹈覆轍時發出警告。</li>
<li>使用<a href="https://milvus.io/blog/openclaw-formerly-clawdbot-moltbot-explained-a-complete-guide-to-the-autonomous-ai-agent.md">OpenClaw</a><strong>執行自動駕駛</strong>，只有在真正重要的事情發生時才會呼叫我。</li>
</ul>
<p>總成本：20 美元/月。經紀人不做交易，也不碰我的錢。</p>
<p>最大的改變不是資料或警示。而是我不再看市場了。上周三我完全忘記了，這在我多年的交易生涯中從未發生過。有時候我還是會虧錢，但是虧錢的頻率少了很多，而且我又開始享受週末了。我的同事還沒有更新這個笑話，但是給他們時間吧。</p>
<p>代理也只花了兩個週末就建立好了。一年前，同樣的設定意味著要從頭寫調度程式、通知管道和記憶體管理。有了 OpenClaw，大部分時間都用在釐清我自己的交易規則，而不是撰寫基礎架構。</p>
<p>一旦您為一個使用個案建立了它，這個架構就是可移植的。將 Exa 搜尋範本與 OpenClaw Skills 對調，您就能擁有一個可以監控研究論文、追蹤競爭對手、觀察法規變動或跟蹤供應鏈中斷的代理程式。</p>
<p>如果您想試試看</p>
<ul>
<li><strong><a href="https://milvus.io/docs/quickstart.md">Milvus 快速入門</a></strong>- 五分鐘內在本機執行向量資料庫</li>
<li><strong><a href="https://docs.openclaw.ai/">OpenClaw</a></strong> <strong>docs</strong>- 使用 Skills 和 Heartbeat 設定您的第一個代理程式</li>
<li><strong><a href="https://exa.ai/">Exa</a></strong> <strong>API</strong>- 從每月 1,000 次免費搜尋開始</li>
</ul>
<p>有問題、需要協助除錯，或只是想炫耀您的成果？加入<a href="https://milvusio.slack.com/join/shared_invite/zt-3nntzngkz-gYwhrdSE4~76k0VMyBfD1Q#/shared-invite/email">Milvus Slack 頻道</a>- 這是從社群和團隊獲得協助的最快方式。如果您想一對一討論您的設定，請預約 20 分鐘的<a href="https://meetings.hubspot.com/chloe-williams1/milvus-office-hour?__hstc=175614333.156cb1e50b398e3753dedcd15f8758f6.1769685782884.1773222362027.1773227913204.54&amp;__hssc=175614333.2.1773227913204&amp;__hsfp=1c9f7a3cc56fa6c486704004556598ad&amp;uuid=be611eac-2f37-4c1d-9494-71ae4e097f89">Milvus 辦公時間。</a></p>
<h2 id="Keep-Reading" class="common-anchor-header">繼續閱讀<button data-href="#Keep-Reading" class="anchor-icon" translate="no">
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
<li><a href="https://milvus.io/blog/openclaw-formerly-clawdbot-moltbot-explained-a-complete-guide-to-the-autonomous-ai-agent.md">OpenClaw (Formerly Clawdbot &amp; Moltbot) 解讀：自主式 AI 代理完全指南</a></li>
<li><a href="https://milvus.io/blog/stepbystep-guide-to-setting-up-openclaw-previously-clawdbotmoltbot-with-slack.md">使用 Slack 設定 OpenClaw（前身為 Clawdbot/Moltbot）的逐步指南</a></li>
<li><a href="https://milvus.io/blog/why-ai-agents-like-openclaw-burn-through-tokens-and-how-to-cut-costs.md">為何 OpenClaw 等 AI 代理會燒完代用幣，以及如何降低成本</a></li>
<li><a href="https://milvus.io/blog/we-extracted-openclaws-memory-system-and-opensourced-it-memsearch.md">我們擷取 OpenClaw 的記憶體系統並將其開放原始碼 (memsearch)</a></li>
</ul>
