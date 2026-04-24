---
id: hermes-agent-learning-loop-milvus-hybrid-search.md
title: 如何使用 Milvus 2.6 混合搜尋修復 Hermes Agent 的學習循環
author: Min Yin
date: 2026-4-24
cover: >-
  assets.zilliz.com/hermes_agent_learning_loop_milvus_hybrid_search_md_2_e0b44ee562.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Hermes Agent, Milvus 2.6, hybrid search, agent memory, skill learning loop'
meta_title: |
  How to Fix Hermes Agent's Learning Loop with Milvus 2.6 Hybrid Search
desc: >-
  Hermes Agent 的學習循環 (Learning Loop) 會從使用中寫入 Skills，但其 FTS5 retriever
  會遺漏重新措辭的查詢。Milvus 2.6 混合搜尋修復了跨會話召回。
origin: 'https://milvus.io/blog/hermes-agent-learning-loop-milvus-hybrid-search.md'
---
<p><a href="https://github.com/NousResearch/hermes-agent"><strong>Hermes Agent</strong></a> <strong>最近無處不在。</strong>Hermes 由 Nous Research 打造，是一個可自行託管的個人 AI 代理，可在您自己的硬體上執行 (5 美元的 VPS 也可以)，並透過 Telegram 等現有的聊天管道與您對話。</p>
<p><strong>它最大的亮點在於內建的學習迴圈：</strong>迴圈會根據經驗創建 Skills，在使用過程中加以改進，並搜尋過去的對話以找到可重複使用的模式。其他的代理框架都是在部署之前手工編碼 Skills。Hermes 的 Skills 會從使用中成長，重複的工作流程只需零程式碼變更即可重複使用。</p>
<p><strong>問題是 Hermes 的擷取僅限於關鍵字。</strong>它匹配的是準確的字詞，而不是使用者想要的意思。當使用者在不同的階段使用不同的字詞時，迴圈無法將它們連結起來，也就無法寫出新的 Skill。當只有幾百個文件時，這個差距是可以忍受的。<strong>過了這一點，迴圈就會停止學習，因為它找不到自己的歷史。</strong></p>
<p><strong>Milvus 2.6 可以解決這個問題。</strong>它的<a href="https://milvus.io/docs/multi-vector-search.md">混合搜尋</a>功能在單一查詢中涵蓋了意思和精確關鍵字，因此語音迴圈終於可以在各個階段中連結重新措辭的資訊。它非常輕巧，可以放在小型雲端伺服器上 (每個月 5 美元的 VPS 就可以運作)。換上 Milvus 並不需要改變 Hermes - Milvus 會插在檢索層之後，因此學習迴圈會保持不變。Hermes 仍會挑選要執行的 Skill，而 Milvus 則會處理要擷取的內容。</p>
<p>但更深層的回報不只是更好的回憶：一旦擷取成功，學習迴圈就能將擷取策略本身儲存為技能，而不只是擷取的內容。這就是代理程式的知識工作如何在各個階段中複合的方式。</p>
<h2 id="Hermes-Agent-Architecture-How-Four-Layer-Memory-Powers-the-Skill-Learning-Loop" class="common-anchor-header">Hermes Agent 架構：四層記憶體如何為技能學習循環提供動力<button data-href="#Hermes-Agent-Architecture-How-Four-Layer-Memory-Powers-the-Skill-Learning-Loop" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://github.com/NousResearch/hermes-agent"><strong>Hermes</strong></a> <strong>有四層記憶體，而 L4 Skills 是其與眾不同之處。</strong></p>
<ul>
<li><strong>L1</strong>- 會話上下文，在會話關閉時清除</li>
<li><strong>L2</strong>- 持久化的事實：專案堆疊、團隊慣例、已解決的決定</li>
<li><strong>L3</strong>- 在本機檔案上進行 SQLite FTS5 關鍵字搜尋</li>
<li><strong>L4</strong>- 將工作流程儲存為 Markdown 檔案。與開發人員在部署前編寫程式碼的 LangChain 工具或 AutoGPT 外掛不同，L4 Skills 是自行編寫的：它們從代理實際執行的內容中成長，開發人員的編寫工作為零。</li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/hermes_agent_learning_loop_milvus_hybrid_search_md_3_3653368e99.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Why-Hermess-FTS5-Keyword-Retrieval-Breaks-the-Learning-Loop" class="common-anchor-header">為什麼 Hermes 的 FTS5 關鍵字擷取功能會打破學習循環？<button data-href="#Why-Hermess-FTS5-Keyword-Retrieval-Breaks-the-Learning-Loop" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Hermes 首先需要檢索來觸發跨會話工作流程。</strong>但其內建的 L3 層使用 SQLite FTS5，只能匹配字面意義，而非意義。</p>
<p><strong>當使用者在不同的階段以不同的方式表達相同的意圖時，FTS5 就會錯過匹配。</strong>學習循環就不會啟動。沒有新的 Skill 會被寫入，下一次當該意向出現時，使用者又得回到手動路由。</p>
<p>範例：知識庫儲存了「asyncio 事件循環、async 任務排程、非阻塞 I/O」。使用者搜尋「Python 並發」。FTS5 返回零命中率 - 沒有字面上的字詞重疊，而且 FTS5 無法看出它們是同一個問題。</p>
<p>在幾百個文件以下，這個差距是可以忍受的。過了這段時間，文件使用一種詞彙，而使用者問的是另一種詞彙，FTS5 無法在兩者之間架起橋樑。<strong>無法擷取的內容也可能不在知識庫中，而學習迴圈也沒有東西可以學習。</strong></p>
<h2 id="How-Milvus-26-Fixes-the-Retrieval-Gap-with-Hybrid-Search-and-Tiered-Storage" class="common-anchor-header">Milvus 2.6 如何透過混合搜尋與分層儲存修補檢索差距<button data-href="#How-Milvus-26-Fixes-the-Retrieval-Gap-with-Hybrid-Search-and-Tiered-Storage" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Milvus 2.6 帶來了兩項符合 Hermes 故障點的升級。</strong> <strong>混合搜尋透過</strong>一次呼叫涵蓋語意和關鍵字檢索，解除學習循環的障礙。<strong>分層儲存</strong>可讓整個檢索後端保持足夠小的規模，以運行在與 Hermes 相同的 5 美元/月 VPS 上。</p>
<h3 id="What-Hybrid-Search-Solves-Finding-Relevant-Information" class="common-anchor-header">混合搜尋能解決什麼問題？尋找相關資訊</h3><p>Milvus 2.6 支援在單一查詢中同時執行向量檢索 (語意) 和<a href="https://milvus.io/docs/full-text-search.md">BM25 全文</a>檢索 (關鍵字)，然後以<a href="https://milvus.io/docs/multi-vector-search.md">互惠排名融合 (RRF)</a> 合併兩個排名清單。</p>
<p>例如：問「asyncio 的原理是什麼」，向量檢索會命中語意相關的內容。詢問「<code translate="no">find_similar_task</code> 函式定義在哪裡」，BM25 會精確匹配程式碼中的函式名稱。對於涉及特定任務類型內函式的問題，混合式搜尋一次就能傳回正確的結果，不需要手寫路由邏輯。</p>
<p>對 Hermes 來說，這就是解除學習循環 (Learning Loop) 的原因。當第二個會話重新表達意圖時，向量檢索會捕捉到 FTS5 遺漏的語意匹配。迴圈啟動後，新的 Skill 就會被寫入。</p>
<h3 id="What-Tiered-Storage-Solves-Cost" class="common-anchor-header">分層儲存解決的問題：成本</h3><p>傳統的向量資料庫希望在 RAM 中儲存完整的嵌入索引，這會將個人部署推向更大、更昂貴的基礎設施。Milvus 2.6 使用三層式儲存避免了這個問題，根據存取頻率在層級之間移動項目：</p>
<ul>
<li><strong>熱</strong>- 存於記憶體</li>
<li><strong>溫</strong>- 在 SSD 上</li>
<li><strong>冷</strong>- 在物件儲存</li>
</ul>
<p>只有熱資料才會保持駐留。500 個文件的知識庫可容納在 2 GB 記憶體內。整個檢索堆疊運行在相同的 5 美元/月 VPS Hermes 目標上，不需要升級基礎架構。</p>
<h2 id="Hermes-+-Milvus-System-Architecture" class="common-anchor-header">Hermes + Milvus：系統架構<button data-href="#Hermes-+-Milvus-System-Architecture" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Hermes 挑選要執行的 Skill。Milvus 負責擷取的內容。</strong>兩個系統保持分離，Hermes 的介面不會改變。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/hermes_agent_learning_loop_milvus_hybrid_search_md_4_1794304940.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>流程：</strong></p>
<ol>
<li>Hermes 識別使用者的意圖，並傳送到 Skill。</li>
<li>Skill 透過終端工具呼叫擷取腳本。</li>
<li>腳本打到 Milvus，執行混合搜尋，並傳回有源元資料的排序塊。</li>
<li>Hermes 構成答案。記憶體記錄工作流程。</li>
<li>當相同的模式在不同的階段重複出現時，學習循環會寫入新的 Skill。</li>
</ol>
<h2 id="How-to-Install-Hermes-and-Milvus-26" class="common-anchor-header">如何安裝 Hermes 和 Milvus 2.6<button data-href="#How-to-Install-Hermes-and-Milvus-26" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>安裝</strong> <a href="https://milvus.io/docs/install_standalone-docker.md"><strong>單機版的</strong></a><strong>Hermes 和</strong> <a href="https://milvus.io/docs/install_standalone-docker.md"><strong>Milvus 2.6</strong></a><strong>，然後建立一個有 dense 和 BM25 欄位的集合。</strong>這是學習循環啟動前的完整設定。</p>
<h3 id="Install-Hermes" class="common-anchor-header">安裝 Hermes</h3><pre><code translate="no" class="language-bash">curl -fsSL https://raw.githubusercontent.com/NousResearch/hermes-agent/main/scripts/install.sh | bash
<button class="copy-code-btn"></button></code></pre>
<p>執行<code translate="no">hermes</code> ，進入互動式 init 精靈：</p>
<ul>
<li><strong>LLM 提供者</strong>- OpenAI、Anthropic、OpenRouter (OpenRouter 有免費模型)</li>
<li><strong>頻道</strong>- 本演練使用 FLark 機器人</li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/hermes_agent_learning_loop_milvus_hybrid_search_md_5_dceeae1519.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Run-Milvus-26-Standalone" class="common-anchor-header">單機執行 Milvus 2.6</h3><p>對於個人代理來說，單結點獨立運作就足夠了：</p>
<pre><code translate="no" class="language-bash">curl -sfL https://raw.githubusercontent.com/milvus-io/milvus/master/scripts/standalone_embed.sh \
-o standalone_embed.sh
bash standalone_embed.sh start
<span class="hljs-comment"># Verify service status</span>
docker ps | grep milvus
<button class="copy-code-btn"></button></code></pre>
<h3 id="Create-the-Collection" class="common-anchor-header">建立集合</h3><p>模式設計上限檢索可以做什麼。此模式並列執行密集向量與 BM25 稀疏向量：</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient, DataType, Function, FunctionType
client = MilvusClient(
    uri=<span class="hljs-string">&quot;http://192.168.x.x:19530&quot;</span>,
)
schema = client.create_schema(auto_id=<span class="hljs-literal">True</span>, enable_dynamic_field=<span class="hljs-literal">True</span>)
schema.add_field(<span class="hljs-string">&quot;id&quot;</span>, DataType.INT64, is_primary=<span class="hljs-literal">True</span>)
<span class="hljs-comment"># Raw text (for BM25 full-text search)</span>
schema.add_field(
    <span class="hljs-string">&quot;text&quot;</span>,
    DataType.VARCHAR,
    max_length=<span class="hljs-number">8192</span>,
    enable_analyzer=<span class="hljs-literal">True</span>,
    enable_match=<span class="hljs-literal">True</span>
)
<span class="hljs-comment"># Dense vector (semantic search)</span>
schema.add_field(<span class="hljs-string">&quot;dense_vector&quot;</span>, DataType.FLOAT_VECTOR, dim=<span class="hljs-number">1536</span>)
<span class="hljs-comment"># Sparse vector (BM25 auto-generated, Milvus 2.6 feature)</span>
schema.add_field(<span class="hljs-string">&quot;sparse_vector&quot;</span>, DataType.SPARSE_FLOAT_VECTOR)
schema.add_field(<span class="hljs-string">&quot;source&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">512</span>)
schema.add_field(<span class="hljs-string">&quot;chunk_index&quot;</span>, DataType.INT32)
<span class="hljs-comment"># Tell Milvus to auto-convert text to sparse_vector via BM25</span>
bm25_function = Function(
    name=<span class="hljs-string">&quot;text_bm25&quot;</span>,
    function_type=FunctionType.BM25,
    input_field_names=[<span class="hljs-string">&quot;text&quot;</span>],
    output_field_names=[<span class="hljs-string">&quot;sparse_vector&quot;</span>],
)
schema.add_function(bm25_function)
index_params = client.prepare_index_params()
<span class="hljs-comment"># HNSW graph index (dense vector)</span>
index_params.add_index(
    field_name=<span class="hljs-string">&quot;dense_vector&quot;</span>,
    index_type=<span class="hljs-string">&quot;HNSW&quot;</span>,
    metric_type=<span class="hljs-string">&quot;COSINE&quot;</span>,
    params={<span class="hljs-string">&quot;M&quot;</span>: <span class="hljs-number">16</span>, <span class="hljs-string">&quot;efConstruction&quot;</span>: <span class="hljs-number">256</span>}
)
<span class="hljs-comment"># BM25 inverted index (sparse vector)</span>
index_params.add_index(
    field_name=<span class="hljs-string">&quot;sparse_vector&quot;</span>,
    index_type=<span class="hljs-string">&quot;SPARSE_INVERTED_INDEX&quot;</span>,
    metric_type=<span class="hljs-string">&quot;BM25&quot;</span>
)
client.create_collection(
    collection_name=<span class="hljs-string">&quot;hermes_milvus&quot;</span>,
    schema=schema,
    index_params=index_params
)
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/hermes_agent_learning_loop_milvus_hybrid_search_md_6_0646f46d36.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Hybrid-Search-Script" class="common-anchor-header">混合搜尋腳本</h3><pre><code translate="no" class="language-python"><span class="hljs-keyword">import</span> sys, json
<span class="hljs-keyword">from</span> openai <span class="hljs-keyword">import</span> OpenAI
<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient, AnnSearchRequest, RRFRanker

client = MilvusClient(<span class="hljs-string">&quot;http://192.168.x.x:19530&quot;</span>)
oai    = OpenAI()
COLLECTION = <span class="hljs-string">&quot;hermes_milvus&quot;</span>

<span class="hljs-keyword">def</span> <span class="hljs-title function_">hybrid_search</span>(<span class="hljs-params">query: <span class="hljs-built_in">str</span>, top_k: <span class="hljs-built_in">int</span> = <span class="hljs-number">5</span></span>) -&gt; <span class="hljs-built_in">list</span>[<span class="hljs-built_in">dict</span>]:
    <span class="hljs-comment"># 1. Vectorize query</span>
    dense_vec = oai.embeddings.create(
        model=<span class="hljs-string">&quot;text-embedding-3-small&quot;</span>,
        <span class="hljs-built_in">input</span>=query
    ).data[<span class="hljs-number">0</span>].embedding

    <span class="hljs-comment"># 2. Dense vector retrieval (semantic relevance)</span>
    dense_req = AnnSearchRequest(
        data=[dense_vec],
        anns_field=<span class="hljs-string">&quot;dense_vector&quot;</span>,
        param={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;COSINE&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;ef&quot;</span>: <span class="hljs-number">128</span>}},
        limit=top_k * <span class="hljs-number">2</span>       <span class="hljs-comment"># Widen candidate set, let RRF do final ranking</span>
    )

    <span class="hljs-comment"># 3. BM25 sparse vector retrieval (exact term matching)</span>
    bm25_req = AnnSearchRequest(
        data=[query],
        anns_field=<span class="hljs-string">&quot;sparse_vector&quot;</span>,
        param={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;BM25&quot;</span>},
        limit=top_k * <span class="hljs-number">2</span>
    )

    <span class="hljs-comment"># 4. RRF fusion ranking</span>
    results = client.hybrid_search(
        collection_name=COLLECTION,
        reqs=[dense_req, bm25_req],
        ranker=RRFRanker(k=<span class="hljs-number">60</span>),
        limit=top_k,
        output_fields=[<span class="hljs-string">&quot;text&quot;</span>, <span class="hljs-string">&quot;source&quot;</span>, <span class="hljs-string">&quot;doc_type&quot;</span>]
    )

    <span class="hljs-keyword">return</span> [
        {
            <span class="hljs-string">&quot;text&quot;</span>:     r.entity.get(<span class="hljs-string">&quot;text&quot;</span>),
            <span class="hljs-string">&quot;source&quot;</span>:   r.entity.get(<span class="hljs-string">&quot;source&quot;</span>),
            <span class="hljs-string">&quot;doc_type&quot;</span>: r.entity.get(<span class="hljs-string">&quot;doc_type&quot;</span>),
            <span class="hljs-string">&quot;score&quot;</span>:    <span class="hljs-built_in">round</span>(r.distance, <span class="hljs-number">4</span>)
        }
        <span class="hljs-keyword">for</span> r <span class="hljs-keyword">in</span> results[<span class="hljs-number">0</span>]
    ]

<span class="hljs-keyword">if</span> __name__ == <span class="hljs-string">&quot;__main__&quot;</span>:
    query= sys.argv[<span class="hljs-number">1</span>] <span class="hljs-keyword">if</span> <span class="hljs-built_in">len</span>(sys.argv) &gt; <span class="hljs-number">1</span> <span class="hljs-keyword">else</span> <span class="hljs-string">&quot;&quot;</span>
    top_k  = <span class="hljs-built_in">int</span>(sys.argv[<span class="hljs-number">2</span>]) <span class="hljs-keyword">if</span> <span class="hljs-built_in">len</span>(sys.argv) &gt; <span class="hljs-number">2</span> <span class="hljs-keyword">else</span> <span class="hljs-number">5</span>
    output = hybrid_search(query, top_k)
    <span class="hljs-built_in">print</span>(json.dumps(output, ensure_ascii=<span class="hljs-literal">False</span>, indent=<span class="hljs-number">2</span>))
<button class="copy-code-btn"></button></code></pre>
<p><code translate="no">text-embedding-3-small</code> 是最便宜的 OpenAI 嵌入式，仍然保持檢索品質；如果預算允許，可以換成<code translate="no">text-embedding-3-large</code> <strong>。</strong></p>
<p>環境和知識庫準備就緒後，下一部分將測試學習循環。</p>
<h2 id="Hermes-Skill-Auto-Generation-in-Practice" class="common-anchor-header">愛馬仕技能自動產生的實踐<button data-href="#Hermes-Skill-Auto-Generation-in-Practice" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>兩個階段顯示了學習循環的運作。</strong>在第一個環節中，使用者以手動方式為腳本命名。在第二個會話中，一個新的會話問了相同的問題，但沒有命名腳本。Hermes 掌握了這個模式，並寫出了三個 Skills。</p>
<h3 id="Session-1-Call-the-Script-by-Hand" class="common-anchor-header">環節 1：手動呼叫腳本</h3><p>在 Lark 中開啟 Hermes。給它腳本路徑和擷取目標。Hermes 會呼叫終端工具、執行腳本，並傳回有來源歸屬的答案。<strong>目前還沒有 Skill 存在。這是一個簡單的工具呼叫。</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/hermes_agent_learning_loop_milvus_hybrid_search_md_7_1c2d9261f4.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Session-2-Ask-Without-Naming-the-Script" class="common-anchor-header">環節 2：在不命名腳本的情況下詢問</h3><p>清除對話。重新開始。詢問相同類別的問題，但不提及腳本或路徑。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/hermes_agent_learning_loop_milvus_hybrid_search_md_8_27253eda82.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Memory-Writes-First-Skill-Follows" class="common-anchor-header">記憶先行，技能跟上</h3><p><strong>學習循環記錄工作流程（腳本、參數、返回形狀）並返回答案。</strong>記憶體保留軌跡；技能尚未存在。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/hermes_agent_learning_loop_milvus_hybrid_search_md_9_a0768f84bd.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>第二階段的匹配會告訴循環該模式值得保留。</strong>當它啟動時，會寫入三個 Skill：</p>
<table>
<thead>
<tr><th>技能</th><th>作用</th></tr>
</thead>
<tbody>
<tr><td><code translate="no">hybrid-search-doc-qa</code></td><td>在記憶體上執行混合語意 + 關鍵字搜尋，並編寫答案</td></tr>
<tr><td><code translate="no">milvus-docs-ingest-verification</code></td><td>驗證已將文件納入知識庫</td></tr>
<tr><td><code translate="no">terminal</code></td><td>執行 shell 指令：腳本、環境設定、檢查</td></tr>
</tbody>
</table>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/hermes_agent_learning_loop_milvus_hybrid_search_md_10_b68e35bc46.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>從這一點開始，<strong>使用者不再命名 Skills。</strong>Hermes 會推斷使用者的意圖、路由到 Skill、從記憶體中抽取相關的片段，然後寫出答案。提示中沒有技能選擇器。</p>
<p>大多數的 RAG（retrieval-augmented generation）系統解決了儲存與擷取的問題，但擷取邏輯本身卻是硬性編碼在應用程式碼中。如果以不同的方式或在新的情境中提出問題，擷取就會中斷。Hermes 將擷取策略儲存為 Skill，這表示擷取<strong>路徑成為您可以閱讀、編輯和版本的文件。</strong> <code translate="no">💾 Memory updated · Skill 'hybrid-search-doc-qa' created</code> 這一行不是設定完成的標記。它是<strong>Agent 將行為模式存入長期記憶中。</strong></p>
<h2 id="Hermes-vs-OpenClaw-Accumulation-vs-Orchestration" class="common-anchor-header">Hermes vs. OpenClaw：累積與協調<button data-href="#Hermes-vs-OpenClaw-Accumulation-vs-Orchestration" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Hermes 與 OpenClaw 所回答的是不同的問題。</strong>Hermes 是專為單一代理建立的，它會在不同的階段累積記憶和技能。OpenClaw 則是將複雜的任務分割成不同的部分，並將每個部分交給專門的代理程式。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/hermes_agent_learning_loop_milvus_hybrid_search_md_11_afcb575d50.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>OpenClaw 的強項在於協調。它可以優化自動完成任務的程度。Hermes 的優勢在於累積：單一代理程式可在不同階段記憶，其技能可從使用中成長。Hermes 優化了長期的情境和領域經驗。</p>
<p><strong>這兩個框架可以堆疊。</strong>Hermes 提供一步到位的遷移路徑，可將<code translate="no">~/.openclaw</code> 記憶體和技能導入 Hermes 的記憶體層。協調堆疊可以位於頂層，底下則是累積代理。</p>
<p>關於 OpenClaw 的分割，請參閱<a href="https://milvus.io/blog/openclaw-formerly-clawdbot-moltbot-explained-a-complete-guide-to-the-autonomous-ai-agent.md">What Is OpenClaw?</a>的<a href="https://milvus.io/blog/openclaw-formerly-clawdbot-moltbot-explained-a-complete-guide-to-the-autonomous-ai-agent.md">完整指南</a>。</p>
<h2 id="Conclusion" class="common-anchor-header">結論<button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p>Hermes 的學習迴圈 (Learning Loop) 將重複的工作流程轉換成可重複使用的 Skills，但前提是檢索必須能夠跨會話連結這些工作流程。FTS5 關鍵字搜尋則無法做到。<a href="https://milvus.io/docs/multi-vector-search.md"><strong>Milvus 2.6 混合式搜尋則</strong></a>可以：密集向量處理意義，BM25 處理精確關鍵字，RRF 將兩者合併，而<a href="https://milvus.io/docs/tiered-storage-overview.md">分層儲存</a>可讓整個堆疊維持在每月 5 美元的 VPS 上。</p>
<p>更重要的是：一旦檢索成功，代理程式不僅會儲存更好的答案：它還會儲存更好的檢索策略作為技能。擷取路徑成為一個可版本化的文件，隨著使用而改進。這就是累積領域專業知識的代理程式與每次都從新開始的代理程式的區別。如需比較其他代理如何處理（或未能處理）這個問題，請參閱<a href="https://milvus.io/blog/claude-code-memory-memsearch.md">Claude Code 的記憶體系統說明。</a></p>
<h2 id="Get-Started" class="common-anchor-header">開始使用<button data-href="#Get-Started" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>請嘗試本文中的工具：</strong></p>
<ul>
<li><a href="https://github.com/NousResearch/hermes-agent">GitHub 上的 Hermes Agent</a>- 安裝腳本、提供者設定，以及上述使用的通道設定。</li>
<li><a href="https://milvus.io/docs/install_standalone-docker.md">Milvus 2.6 Standalone Quickstart</a>- 知識庫後端的單結點 Docker 部署。</li>
<li><a href="https://milvus.io/docs/multi-vector-search.md">Milvus 混合式搜尋教學</a>- 完整的密集式 + BM25 + RRF 範例與本文章中的腳本相匹配。</li>
</ul>
<p><strong>有關於 Hermes + Milvus 混合搜尋的問題嗎？</strong></p>
<ul>
<li>加入<a href="https://discord.gg/milvus">Milvus Discord</a>詢問關於混合搜尋、分層儲存或 Skill-routing 模式 - 其他開發人員也在建立類似的堆疊。</li>
<li><a href="https://milvus.io/community#office-hours">預約 Milvus Office Hours 課程</a>，與 Milvus 團隊一起完成您自己的代理 + 知識庫設定。</li>
</ul>
<p><strong>想要跳過自我託管嗎？</strong></p>
<ul>
<li><a href="https://cloud.zilliz.com/signup">註冊</a>或<a href="https://cloud.zilliz.com/login">登入</a>Zilliz Cloud - 開箱即用的混合搜尋與分層儲存的管理式 Milvus。新的工作郵件帳戶可獲得<strong> 100 美元的免費點數</strong>。</li>
</ul>
<h2 id="Further-Reading" class="common-anchor-header">進一步閱讀<button data-href="#Further-Reading" class="anchor-icon" translate="no">
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
<li><a href="https://milvus.io/docs/release_notes.md">Milvus 2.6 發行紀錄</a>- 分層儲存、混合搜尋、模式變更</li>
<li><a href="https://zilliz.com/blog">Zilliz Cloud &amp; Milvus CLI + Official Skills</a>- Milvus 原生代理的作業工具</li>
<li><a href="https://zilliz.com/blog">為什麼 RAG 式的知識管理會破壞代理</a>- 代理特定記憶體設計的理由</li>
<li><a href="https://zilliz.com/blog">Claude Code 的記憶體系統比你預期的更原始</a>- 另一個代理的記憶體堆疊的比較文章</li>
</ul>
<h2 id="Frequently-Asked-Questions" class="common-anchor-header">常見問題<button data-href="#Frequently-Asked-Questions" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="How-does-Hermes-Agents-Skill-Learning-Loop-actually-work" class="common-anchor-header">Hermes Agent 的技能學習循環實際上是如何運作的？</h3><p>Hermes 會記錄它執行的每個工作流程 - 所呼叫的腳本、傳送的參數以及回傳形狀 - 作為記憶追蹤。當相同的模式出現在兩個或兩個以上的會話中時，學習循環就會啟動並寫入一個可重複使用的 Skill：一個 Markdown 檔案，將工作流程擷取為一個可重複的程序。從這一點開始，Hermes 只會依據意圖路由到 Skill，而不需要使用者命名。關鍵的依賴關係是擷取 - 環路只有在找到較早階段的追蹤時才會啟動，這也是為什麼僅限關鍵字的搜尋在大規模時會變成瓶頸的原因。</p>
<h3 id="Whats-the-difference-between-hybrid-search-and-vector-only-search-for-agent-memory" class="common-anchor-header">對於代理程式記憶體，混合搜尋與唯向量搜尋有何不同？</h3><p>唯向量搜尋能很好地處理意義，但會錯過精確的匹配。如果開發人員貼上 ConnectionResetError 之類的錯誤字串，或是 find_similar_task 之類的函式名稱，純向量搜尋可能會傳回語意相關但錯誤的結果。混合搜尋結合了密集向量 (語意) 與 BM25 (關鍵字)，並透過 Reciprocal Rank Fusion 將兩個結果集合併。對於代理程式記憶體 (查詢範圍從模糊的意圖 (「Python並發」) 到精確的符號) 而言，混合搜尋可在一次呼叫中涵蓋兩端，而無需在您的應用程式層中進行路由邏輯。</p>
<h3 id="Can-I-use-Milvus-hybrid-search-with-AI-agents-other-than-Hermes" class="common-anchor-header">我可以將 Milvus 混合搜尋與 Hermes 以外的 AI 代理一起使用嗎？</h3><p>可以。整合模式是通用的：代理呼叫檢索腳本，腳本查詢 Milvus，結果以包含來源元資料的排序塊返回。任何支援工具呼叫或 shell 執行的代理框架都可以使用相同的方法。Hermes 恰好是一個很好的選擇，因為它的學習循環 (Learning Loop) 特別依賴跨會話檢索來啟動，但 Milvus 方面是與代理無關的 - 它不知道或不關心是哪個代理在呼叫它。</p>
<h3 id="How-much-does-a-self-hosted-Milvus-+-Hermes-setup-cost-per-month" class="common-anchor-header">自託管的 Milvus + Hermes 設定每月費用是多少？</h3><p>單一節點Milvus 2.6 Standalone在2核心/4 GB VPS與分層存儲運行約<span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mn>5</mn><mi>/</mi><mi>月</mi></mrow><annotation encoding="application/x-tex">。OpenAI text-embedding-3-small 的成本為</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mord mathnormal">5</span></span></span></span>/月<span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord">。</span><span class="mord mathnormal">OpenAItext</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">-</span></span></span></span><span class="mspace" style="margin-right:0.2222em;"></span> <span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.8889em;vertical-align:-0.1944em;"></span><span class="mord mathnormal" style="margin-right:0.03588em;">embedding</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">-</span></span></span></span><span class="mspace" style="margin-right:0.2222em;"></span> <span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.7278em;vertical-align:-0.0833em;"></span> 3</span></span></span> <span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">-</span><span class="mspace" style="margin-right:0.2222em;"></span></span><span class="base"><span class="strut" style="height:0.6944em;"></span> <span class="mord mathnormal">smallcosts0</span></span></span></span>.02 per 1M tokens - 對於個人知識庫而言，每月只需幾美分。LLM 推理主宰總成本，並隨使用量而擴展，而非隨檢索堆疊而擴展。</p>
