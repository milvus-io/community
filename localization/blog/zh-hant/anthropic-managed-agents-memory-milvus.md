---
id: anthropic-managed-agents-memory-milvus.md
title: 如何使用 Milvus 為 Anthropic 的受管代理添加長期記憶體
author: Min Yin
date: 2026-4-21
cover: assets.zilliz.com/anthropic_managed_agents_memory_milvus_md_1_d3e5055603.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  anthropic managed agents, long-term memory, agent memory, milvus, vector
  database
meta_title: |
  Add Long-Term Memory to Anthropic's Managed Agents with Milvus
desc: >-
  Anthropic 的 Managed Agents 使代理變得可靠，但每個 session 都是從空白開始。以下是如何搭配 Milvus
  在會話內進行語意召回，以及跨代理的共享記憶體。
origin: 'https://milvus.io/blog/anthropic-managed-agents-memory-milvus.md'
---
<p>Anthropic 的<a href="https://www.anthropic.com/engineering/managed-agents">Managed Agents</a>讓代理基礎架構更具彈性。一個 200 步的任務現在無需人為干預，就能在線束崩潰、沙盒超時或飛行中途的基礎架構變更中存活下來，Anthropic 報告在解耦之後，p50 time-to-first-token 下降了大約 60%，p95 下降了超過 90%。</p>
<p>可靠性無法解決的是記憶體問題。200 步的程式碼遷移如果在 201 步遇到新的依賴衝突，就無法有效率地回看上一步是如何處理的。為某位客戶執行弱點掃描的代理不知道另一位代理在一小時前已經解決了相同的問題。每個工作階段都是從白紙開始，平行的大腦無法存取其他人已經解決的問題。</p>
<p>解決方案是將<a href="https://milvus.io/">Milvus 向量資料庫</a>與 Anthropic 的管理式代理搭配使用：在會話中進行語意召回，並在各個會話之間共享<a href="https://milvus.io/docs/milvus_for_agents.md">向量記憶層</a>。會話契約保持不變，線束得到一個新的層次，而長距離的代理任務則得到質的不同的能力。</p>
<h2 id="What-Managed-Agents-Solved-and-What-They-Didnt" class="common-anchor-header">管理式代理解決了什麼問題（以及沒有解決什麼問題）<button data-href="#What-Managed-Agents-Solved-and-What-They-Didnt" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Managed Agents 透過將代理程式解耦為三個獨立模組，解決了可靠性問題。它沒有解決的是記憶，無論是單一會話內的語意回憶，或是跨平行會話的共享經驗。</strong>以下是被解耦的部分，以及記憶體缺口在解耦設計中的位置。</p>
<table>
<thead>
<tr><th>模組</th><th>作用</th></tr>
</thead>
<tbody>
<tr><td><strong>會話</strong></td><td>發生的所有事件的附加事件日誌。儲存於線束之外。</td></tr>
<tr><td><strong>線束</strong></td><td>呼叫 Claude 並將 Claude 的工具呼叫路由至相關基礎架構的迴路。</td></tr>
<tr><td><strong>沙箱</strong></td><td>Claude 執行程式碼和編輯檔案的隔離執行環境。</td></tr>
</tbody>
</table>
<p>Anthropic 的文章中明確說明了讓此設計運作的重構：</p>
<p><em>"會話不是 Claude 的上下文視窗。</em></p>
<p>上下文視窗是短暫的：以代幣為界，每次模型呼叫都會重新建構，並在呼叫返回時丟棄。會話是持久的，儲存在線束之外，代表整個任務的記錄系統。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/anthropic_managed_agents_memory_milvus_md_3_edae1b022d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>當線束崩潰時，平台會以<code translate="no">wake(sessionId)</code> 啟動新的線束。新的線束會透過<code translate="no">getSession(id)</code> 讀取事件日誌，任務會從最後記錄的步驟開始，不需要撰寫自訂的恢復邏輯，也不需要執行會話層級的看管作業。</p>
<p>Managed Agents 的文章沒有提到，也沒有宣稱會提到的是，當代理需要記住任何東西時，它會怎麼做。當您將真正的工作負載推到架構上時，就會發現兩個缺口。其中一個存在於單一會話中；另一個則存在於跨會話中。</p>
<h2 id="Problem-1-Why-Linear-Session-Logs-Fail-Past-a-Few-Hundred-Steps" class="common-anchor-header">問題 1：為什麼線性會話日誌在過了幾百個步驟後就失效了？<button data-href="#Problem-1-Why-Linear-Session-Logs-Fail-Past-a-Few-Hundred-Steps" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>線性會話日誌在超過幾百個步驟後就會失敗，因為連續讀取和語意搜尋基本上是不同的工作負載，而</strong> <code translate="no">**getEvents()**</code> <strong>API 只為第一種工作負載提供服務。</strong>根據位置切片或尋找時間戳就足以回答「這個會話在哪裡離開」的問題。這不足以回答代理程式在任何長時間任務中可能需要回答的問題：我們以前有沒有見過這種問題，我們是怎麼處理的？</p>
<p>請考慮在步驟 200 的程式碼遷移中遇到的新依賴衝突。自然的做法是回顧過去。代理之前在相同的任務中遇到過類似的問題嗎？試過什麼方法？它成立嗎？還是有其他下游的問題？</p>
<p><code translate="no">getEvents()</code> 有兩種方法可以回答這個問題，但兩種方法都不好：</p>
<table>
<thead>
<tr><th>選項</th><th>問題</th></tr>
</thead>
<tbody>
<tr><td>順序掃描每個事件</td><td>200 步時較慢。2,000 步時無法執行。</td></tr>
<tr><td>在上下文視窗中傾倒大量的串流片段</td><td>對於代幣來說很昂貴，在規模上也不可靠，而且會佔用代理程式目前步驟的實際工作記憶體。</td></tr>
</tbody>
</table>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/anthropic_managed_agents_memory_milvus_md_4_2ac29b32af.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>會話有助於復原和稽核，但它並不是以支援「我以前有沒有看過這個」的索引來建立的。長距離任務就是這個問題不再是可選的地方。</p>
<h2 id="Solution-1-How-to-Add-Semantic-Memory-to-a-Managed-Agents-Session" class="common-anchor-header">解決方案 1：如何將語義記憶添加到受管代理的會話中<button data-href="#Solution-1-How-to-Add-Semantic-Memory-to-a-Managed-Agents-Session" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>在會話日誌旁邊新增一個 Milvus 集合，並從</strong> <code translate="no">**emitEvent**</code> 進行<strong>雙重寫入</strong>。會話合約保持不變，而線束可獲得對其自身過去的語義查詢。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/anthropic_managed_agents_memory_milvus_md_5_404a1048aa.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Anthropic 的設計正好為此留出了空間。他們的文章指出：「任何取得的事件在傳送到 Claude 的上下文視窗之前，也可以在線束中進行轉換。這些轉換可以是任何線束編碼的方式，包括上下文組織...和上下文工程。上下文工程存在於線束中，會話只需保證耐久性與可查詢性罷了。</p>
<p>模式：每次<code translate="no">emitEvent</code> 火災發生時，線束也會計算值得索引的事件<a href="https://zilliz.com/learn/everything-you-need-to-know-about-vector-embeddings">向量嵌入</a>，並將它們插入 Milvus 集合中。</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient

milvus_client = MilvusClient(uri=<span class="hljs-string">&quot;http://localhost:19530&quot;</span>)

<span class="hljs-comment"># Only index high-signal events. Tool retries and intermediate states are noise.</span>
INDEXABLE_EVENT_TYPES = {<span class="hljs-string">&quot;decision&quot;</span>, <span class="hljs-string">&quot;strategy&quot;</span>, <span class="hljs-string">&quot;resolution&quot;</span>, <span class="hljs-string">&quot;error_handling&quot;</span>}

<span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">emit_event</span>(<span class="hljs-params">session_id: <span class="hljs-built_in">str</span>, event: <span class="hljs-built_in">dict</span></span>):
    <span class="hljs-comment"># Original path: append to the session event stream.</span>
    <span class="hljs-keyword">await</span> session_store.append(session_id, event)

    <span class="hljs-comment"># Extended path: embed the event content and insert into Milvus.</span>
    <span class="hljs-keyword">if</span> event[<span class="hljs-string">&quot;type&quot;</span>] <span class="hljs-keyword">in</span> INDEXABLE_EVENT_TYPES:
        embedding = <span class="hljs-keyword">await</span> embed(event[<span class="hljs-string">&quot;content&quot;</span>])
        milvus_client.insert(
            collection_name=<span class="hljs-string">&quot;agent_memory&quot;</span>,
            data=[{
                <span class="hljs-string">&quot;vector&quot;</span>:     embedding,
                <span class="hljs-string">&quot;session_id&quot;</span>: session_id,
                <span class="hljs-string">&quot;step&quot;</span>:       event[<span class="hljs-string">&quot;step&quot;</span>],
                <span class="hljs-string">&quot;event_type&quot;</span>: event[<span class="hljs-string">&quot;type&quot;</span>],
                <span class="hljs-string">&quot;content&quot;</span>:    event[<span class="hljs-string">&quot;content&quot;</span>],
            }]
        )
<button class="copy-code-btn"></button></code></pre>
<p>當代理觸及步驟 200 並需要回想先前的決策時，查詢就是針對該會話的<a href="https://zilliz.com/glossary/vector-similarity-search">向量搜尋</a>：</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">recall_similar</span>(<span class="hljs-params">query: <span class="hljs-built_in">str</span>, session_id: <span class="hljs-built_in">str</span>, top_k: <span class="hljs-built_in">int</span> = <span class="hljs-number">5</span></span>):
    query_vector = <span class="hljs-keyword">await</span> embed(query)
    results = milvus_client.search(
        collection_name=<span class="hljs-string">&quot;agent_memory&quot;</span>,
        data=[query_vector],
        <span class="hljs-built_in">filter</span>=<span class="hljs-string">f&#x27;session_id == &quot;<span class="hljs-subst">{session_id}</span>&quot;&#x27;</span>,
        limit=top_k,
        output_fields=[<span class="hljs-string">&quot;step&quot;</span>, <span class="hljs-string">&quot;event_type&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>]
    )
    <span class="hljs-keyword">return</span> results[<span class="hljs-number">0</span>]  <span class="hljs-comment"># top_k most relevant past events</span>
<button class="copy-code-btn"></button></code></pre>
<p>在執行之前，有三個生產細節很重要：</p>
<ul>
<li><strong>選擇要索引的項目。</strong>並非每個事件都值得嵌入。工具呼叫的中間狀態、重試記錄和重複狀態事件對檢索品質的汙染比改善更快。<code translate="no">INDEXABLE_EVENT_TYPES</code> 策略取決於任務，而非全局。</li>
<li><strong>定義一致性邊界。</strong>如果線束在 session 附加與 Milvus 插入之間發生崩潰，則其中一層會暫時領先另一層。視窗很小，但很真實。選擇調和路徑（重新啟動時重試、先寫日誌或最終調和），而不是寄予希望。</li>
<li><strong>控制嵌入花費。</strong>在每個步驟中同步呼叫外部嵌入式 API 的 200 步會話，會產生沒有人計劃的發票。將嵌入式排成隊列，並以非同步方式分批傳送。</li>
</ul>
<p>有了這些功能，向量搜尋只需幾毫秒，而嵌入呼叫則只需不到 100 毫秒。在代理注意到摩擦之前，前五個最相關的過去事件就會出現在上下文中。會話保留其原本的工作，成為持久的日誌；線束則獲得以語義而非順序查詢其過去事件的能力。這只是 API 表面上的輕微改變，但卻是代理程式在長期任務上的結構性改變。</p>
<h2 id="Problem-2-Why-Parallel-Claude-Agents-Cant-Share-Experience" class="common-anchor-header">問題 2：為什麼平行 Claude 代理無法分享經驗？<button data-href="#Problem-2-Why-Parallel-Claude-Agents-Cant-Share-Experience" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>平行 Claude 代理無法分享經驗，是因為 Managed Agents 會話在設計上是隔離的。同樣的隔離讓水平擴充變得乾淨，也讓每個大腦無法向其他大腦學習。</strong></p>
<p>在解耦的驅動程式中，大腦是無狀態和獨立的。這種隔離會釋放出 Anthropic 報告的延遲勝利，同時也讓每個會話在執行時不知道其他會話的情況。</p>
<p>代理 A 花了 40 分鐘為一位客戶診斷棘手的 SQL 注入向量。一小時之後，Agent B 替另一位客戶處理相同的個案，並花費 40 分鐘走相同的死胡同、執行相同的工具呼叫，並得出相同的答案。</p>
<p>對於執行偶爾代理的單一使用者來說，這是浪費的運算時間。對於每天為不同客戶執行數十個並發<a href="https://zilliz.com/glossary/ai-agents">AI 代理</a>，包括程式碼檢閱、弱點掃描和文件產生的平台來說，成本會在結構上複雜化。</p>
<p>如果每個階段所產生的經驗會在階段結束時消失，那麼智慧也就變成一次性的了。以這種方式建立的平台雖然可以線性擴充，但卻無法像人類工程師一樣，隨著時間的推移而精益求精。</p>
<h2 id="Solution-2-How-to-Build-a-Shared-Agent-Memory-Pool-with-Milvus" class="common-anchor-header">解決方案 2：如何使用 Milvus 建立一個共用的代理程式記憶體池<button data-href="#Solution-2-How-to-Build-a-Shared-Agent-Memory-Pool-with-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>建立一個向量集合，讓每個線束在啟動時讀取，並在關閉時寫入。</strong></p>
<p>當會話結束時，關鍵決策、遇到的問題和有效的方法都會被推送到共用的 Milvus 集合中。當一個新的大腦初始化時，線束會執行語意查詢作為設定的一部分，並將最匹配的過往經驗注入上下文視窗。新代理程式的第一步會繼承之前每個代理程式的經驗。</p>
<p>從原型到生產，有兩個工程上的決定。</p>
<h3 id="Isolating-Tenants-with-the-Milvus-Partition-Key" class="common-anchor-header">使用 Milvus 分區鑰匙隔離租戶</h3><p><strong>透過</strong> <code translate="no">**tenant_id**</code><strong>進行分區</strong>，<strong>客戶 A 的代理體驗與客戶 B 的代理體驗不會在同一個分區中。這是資料層上的隔離，而不是查詢慣例。</strong></p>
<p>B 公司的代理永遠無法檢索到 A 公司程式碼庫中的 A 腦的工作。Milvus 的<a href="https://milvus.io/docs/use-partition-key.md">分割鑰匙</a>可在單一集合上處理這一問題，每個租戶沒有第二個集合，應用程式碼中也沒有分片邏輯。</p>
<pre><code translate="no" class="language-python"><span class="hljs-comment"># Declare partition key at schema creation.</span>
schema.add_field(
    field_name=<span class="hljs-string">&quot;tenant_id&quot;</span>,
    datatype=DataType.VARCHAR,
    max_length=<span class="hljs-number">64</span>,
    is_partition_key=<span class="hljs-literal">True</span>   <span class="hljs-comment"># Automatic per-tenant partitioning.</span>
)

<span class="hljs-comment"># Every query filters by tenant. Isolation is automatic.</span>
results = milvus_client.search(
    collection_name=<span class="hljs-string">&quot;shared_agent_memory&quot;</span>,
    data=[query_vector],
    <span class="hljs-built_in">filter</span>=<span class="hljs-string">f&#x27;tenant_id == &quot;<span class="hljs-subst">{current_tenant}</span>&quot;&#x27;</span>,
    limit=<span class="hljs-number">5</span>,
    output_fields=[<span class="hljs-string">&quot;content&quot;</span>, <span class="hljs-string">&quot;step&quot;</span>, <span class="hljs-string">&quot;session_id&quot;</span>]
)
<button class="copy-code-btn"></button></code></pre>
<p>客戶 A 的代理體驗從未出現在客戶 B 的查詢中，不是因為查詢過濾器寫得正確（雖然它必須正確），而是因為資料實際上與客戶 B 的資料不在同一個分區中。在查詢層執行邏輯隔離，在分割層執行實體隔離。</p>
<p>請參閱<a href="https://milvus.io/docs/multi_tenancy.md">多租用策略說明文件</a>，以瞭解何時適合使用磁碟分割關鍵，何時適合使用獨立的集合或資料庫；並參閱<a href="https://milvus.io/blog/build-multi-tenancy-rag-with-milvus-best-practices-part-one.md">多租用 RAG 模式指南</a>，以瞭解生產部署注意事項。</p>
<h3 id="Why-Agent-Memory-Quality-Needs-Ongoing-Work" class="common-anchor-header">為何代理程式記憶體品質需要持續努力</h3><p><strong>記憶體品質會隨著時間侵蝕：曾經成功的有瑕疵的解決方案會被重播和強化，而與已廢棄的相依性相連的陳舊項目，會持續誤導繼承這些相依性的代理程式。防禦措施是作業程式，而非資料庫功能。</strong></p>
<p>一個代理程式偶然發現了一個有缺陷的解決方案，而這個方案碰巧成功了一次。它被寫入共用池。下一個代理程式擷取它，重複它，並透過第二次「成功」的使用記錄來強化不良模式。</p>
<p>陳舊的項目遵循相同路徑的較慢版本。固定在六個月前已廢棄的依賴版本上的修復項目，會一直被擷取，並一直誤導繼承它的代理程式。池越舊，使用量越大，這種情況就會累積得越多。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/anthropic_managed_agents_memory_milvus_md_6_24f71b1c21.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>有三個作業程式可以防範這種情況：</p>
<ul>
<li><strong>信心分數。</strong>追蹤記憶體在下游階段成功套用的頻率。衰減重播失敗的項目。提升重複成功的項目。</li>
<li><strong>時間加權。</strong>偏好最近的經驗。廢除超過已知陳舊臨界值的項目，該臨界值通常與主要相依性版本的提升有關。</li>
<li><strong>人工抽查。</strong>高檢索頻率的詞條具有高利用率。當其中一個出錯時，它就會出錯很多次，這就是人工檢閱回報最快的地方。</li>
</ul>
<p>單靠 Milvus 並不能解決這個問題，Mem0、Zep 或任何其他記憶體產品也是如此。強制執行一個有許多租戶的記憶體池且零跨租戶洩漏，是您只需要設計一次的事情。保持記憶體池準確性、新鮮度和實用性是持續性的作業工作，沒有任何資料庫可以預先配置。</p>
<h2 id="Takeaways-What-Milvus-Adds-to-Anthropics-Managed-Agents" class="common-anchor-header">心得：Milvus 為 Anthropic 的 Managed Agents 所增添的功能<button data-href="#Takeaways-What-Milvus-Adds-to-Anthropics-Managed-Agents" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Milvus 將 Managed Agents 從一個可靠但容易遺忘的平台，轉變為一個能隨著時間累積經驗的平台，方法是在會話中加入語意回憶，以及在代理之間共享記憶體。</strong></p>
<p>Managed Agents 清楚地回答了可靠性的問題：大腦和手都是牛，任何一隻都可以死掉，而不會把任務一起帶走。這就是基礎架構的問題，而 Anthropic 很好地解决了這個問題。</p>
<p>保持開放的是成長。人類工程師會隨著時間複雜化；多年的工作會轉化為模式認知，他們不會在每項任務上都從第一原理推理。今天的管理代理也不會，因為每個階段都是從空白頁開始的。</p>
<p>將會話連接到 Milvus，以便在任務中進行語義回憶，並將各個大腦的經驗匯集到共享向量集合中，才能讓代理真正使用過去的經驗。插入 Milvus 是基礎建設的一環；修剪錯誤的記憶、刪除陳舊的記憶，以及強制執行租戶邊界是運作的一環。一旦兩者都就位，記憶體的形狀就不再是負擔，而開始成為複合資本。</p>
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
    </button></h2><ul>
<li><strong>本機試用：</strong>使用<a href="https://milvus.io/docs/milvus_lite.md">Milvus Lite</a> 開發一個嵌入式<a href="https://milvus.io/docs/milvus_lite.md">Milvus</a> 實例。不需要 Docker、不需要群集，只要<code translate="no">pip install pymilvus</code> 。當您需要時，生產工作負載可升級至<a href="https://milvus.io/docs/install_standalone-docker.md">Milvus Standalone 或 Distributed</a>。</li>
<li><strong>閱讀設計原理：</strong>Anthropic 的<a href="https://www.anthropic.com/engineering/managed-agents">Managed Agents 工程文章</a>深入淺出地介紹了會話、線束和沙箱解耦。</li>
<li><strong>有問題嗎？</strong>加入<a href="https://discord.com/invite/8uyFbECzPX">Milvus Discord</a>社群進行代理程式記憶體設計討論，或預約<a href="https://milvus.io/office-hours">Milvus Office Hours</a>課程以了解您的工作量。</li>
<li><strong>喜歡管理式嗎？</strong> <a href="https://cloud.zilliz.com/signup">註冊 Zilliz Cloud</a>(或<a href="https://cloud.zilliz.com/login">登入</a>) 以取得內建分割區金鑰、擴充和多租戶功能的託管式 Milvus。新帳戶可透過工作電子郵件獲得免費點數。</li>
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
    </button></h2><p><strong>問：在 Anthropic 的 Managed Agents 中，session 與 context window 有何不同？</strong></p>
<p>上下文視窗是單一 Claude 呼叫看到的短暫代號集。它是有邊界的，並會在每次模型呼叫時重新設定。會話是整個任務中發生的所有事情的持久事件日誌，只可追加，儲存在線束之外。当线束崩溃时，<code translate="no">wake(sessionId)</code> 会生成一个新的线束，读取会话日志并恢复。會話是記錄系統；上下文視窗是工作記憶體。會話不是上下文視窗。</p>
<p><strong>問：如何在 Claude 會話中持久化代理記憶體？</strong></p>
<p>會話本身已經是持久化的；這就是<code translate="no">getSession(id)</code> 所擷取的。通常缺少的是可查詢的長期記憶體。這種模式是在<code translate="no">emitEvent</code> 期間，將高信號事件（決策、決議、策略）嵌入到像 Milvus 之類的向量資料庫中，然後在檢索時透過語意相似性進行查詢。這樣一來，您就可以同時擁有 Anthropic 所提供的耐久會話記錄，以及可回顧數百個步驟的語意回憶層。</p>
<p><strong>問：多個 Claude 代理可以共用記憶體嗎？</strong></p>
<p>不可以。每個 Managed Agents 會話在設計上都是獨立的，這也是讓它們可以水平擴充的原因。若要在代理之間共用記憶體，請新增一個共用向量集合 (例如在 Milvus 中)，讓每個線束在啟動時讀取，並在關閉時寫入。使用 Milvus 的分割鍵功能隔離租戶，這樣 A 客戶的代理記憶體就不會洩漏到 B 客戶的會話中。</p>
<p><strong>問：什麼是 AI 代理記憶體的最佳向量資料庫？</strong></p>
<p>誠實的答案取決於規模和部署形態。對於原型與小型工作負載，Milvus Lite 等本機嵌入式選項可在流程中執行，不需要基礎架構。對於橫跨許多租戶的生產型代理程式，您需要的是具備成熟多租戶 (分割鍵、過濾式搜尋)、混合式搜尋 (向量 + 標量 + 關鍵字) 與數百萬向量毫秒延遲的資料庫。Milvus 專為這種規模的向量工作負載而打造，這就是為什麼它會出現在以 LangChain、Google ADK、Deep Agents 和 OpenAgents 為基礎的生產代理程式記憶體系統中。</p>
