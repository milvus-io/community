---
id: >-
  keeping-ai-agents-grounded-context-engineering-strategies-that-prevent-context-rot-using-milvus.md
title: 保持人工智能代理的基礎：使用 Milvus 防止情境腐蝕的情境工程策略
author: Min Yin
date: 2025-12-23T00:00:00.000Z
cover: assets.zilliz.com/context_rot_cover_804387e7c9.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'context engineering, context rot, vector database, Milvus, vector search'
meta_title: |
  Context Engineering Strategies to Prevent LLM Context Rot with Milvus
desc: >-
  瞭解為何在長時間運行的 LLM 工作流程中會發生上下文腐蝕，以及上下文工程、檢索策略和 Milvus 向量搜尋如何在複雜的多步驟任務中幫助保持 AI
  代理的準確性、專注性和可靠性。
origin: >-
  https://milvus.io/blog/keeping-ai-agents-grounded-context-engineering-strategies-that-prevent-context-rot-using-milvus.md
---
<p>如果您曾經參與長時間的 LLM 對話，您可能會經歷過這種令人沮喪的時刻：一條長線談到一半時，模型開始偏移。答案變得含糊不清、推理變得薄弱、關鍵細節神秘消失。但是如果您在新的聊天中加入完全相同的提示，模型就會突然表現得專注、準確、有根有據。</p>
<p>這不是模型「累了」，而是<strong>情境腐蝕</strong>。隨著對話的增加，模型必須同時處理更多的資訊，其優先排序的能力也會慢慢下降。<a href="https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents">Antropic 的研究</a>顯示，當上下文視窗從 8K 到 128K 左右時，擷取準確率會下降 15-30%。模型仍有足夠的空間，但卻無法追蹤重要的資訊。更大的上下文視窗有助於延緩問題的發生，但卻無法消除問題。</p>
<p>這就是<strong>情境工程的</strong>用武之地。我們不再一次過把所有東西都交給模型，而是塑造它所看到的東西：只擷取重要的部分、壓縮不再需要冗長的內容，並讓提示和工具保持乾淨，讓模型可以推理。目標很簡單：在適當的時候提供重要的資訊，而忽略其他資訊。</p>
<p>擷取在此扮演核心角色，尤其是對於長時間運作的代理程式而言。<a href="https://milvus.io/"><strong>Milvus</strong></a>之類的向量資料庫為有效地將相關知識拉回上下文提供了基礎，即使任務的深度和複雜度不斷增加，也能讓系統保持穩定。</p>
<p>在這篇部落格中，我們將探討上下文轉換是如何發生的、團隊用來管理上下文轉換的策略，以及從檢索到提示設計的架構模式，讓 AI 代理在長時間、多步驟的工作流程中保持敏銳。</p>
<h2 id="Why-Context-Rot-Happens" class="common-anchor-header">為什麼會發生情境腐蝕<button data-href="#Why-Context-Rot-Happens" class="anchor-icon" translate="no">
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
    </button></h2><p>人們通常認為，給予 AI 模型更多的情境，自然會得到更好的答案。但事實上並非如此。人類在處理長時間的輸入時也很吃力：認知科學顯示我們的工作記憶體大概可以容納<strong>7±2 個資訊塊</strong>。如果超出這個範圍，我們就會開始遺忘、模糊或曲解細節。</p>
<p>LLM 也有類似的行為，只是規模大得多，失效模式也更誇張。</p>
<p>根本問題來自於<a href="https://zilliz.com/learn/decoding-transformer-models-a-study-of-their-architecture-and-underlying-principles">Transformer 架構</a>本身。每個符號都必須與其他符號進行比較，在整個序列中形成成對關注。這意味著計算會隨著上下文長度增加<strong>O(n²)</strong>。將您的提示從 1K 記憶體擴大到 100K，並不會讓模型「更努力工作」，反而會讓記憶體互動的數量增加<strong>10,000倍</strong>。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/contextual_dilution_622033db72.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>然後是訓練資料的問題。</strong>模型看到的短序列遠比長序列多。因此，當您要求 LLM 在極大的上下文中運作時，您會將它推入一個它並未接受過大量訓練的環境中。實際上，對大多數模型來說，非常長的上下文推理往往是<strong>不</strong>適合的。</p>
<p>儘管有這些限制，長上下文現在仍是無法避免的。早期的 LLM 應用多半是單次轉換的任務-分類、總結或簡單的產生。如今，超過 70% 的企業級 AI 系統都仰賴代理程式，這些代理程式會在多輪互動中保持活躍，通常會持續數小時，管理分支、多步驟的工作流程。長效會話已經從例外變成預設。</p>
<p>接下來的問題是：<strong>我們該如何保持模型的注意力，而不會讓它應接不暇？</strong></p>
<h2 id="Context-Retrieval-Approaches-to-Solving-Context-Rot" class="common-anchor-header">解決情境腐蝕的情境擷取方法<button data-href="#Context-Retrieval-Approaches-to-Solving-Context-Rot" class="anchor-icon" translate="no">
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
    </button></h2><p>擷取是我們對抗情境腐敗最有效的槓桿之一，在實務上，它往往會以互補的模式出現，從不同的角度解決情境腐敗的問題。</p>
<h3 id="1-Just-in-Time-Retrieval-Reducing-Unnecessary-Context" class="common-anchor-header">1.及時擷取 (Just-in-Time Retrieval)：減少不必要的上下文</h3><p>上下文腐蝕的一個主要原因，是讓模型<em>過度負載</em>它還不需要的資訊。Claude Code-Anthropic 的編碼輔助工具使用「及<strong>時擷取」（JIT）</strong>來解決這個問題。</p>
<p>Claude Code 不會把整個程式碼庫或資料集塞入上下文（這會大大增加漂移和遺忘的機會），而是維護一個微小的索引：檔案路徑、指令和文件連結。當模型需要某項資訊時，它會擷取該特定項目，<strong>並在重要時刻</strong>將其插入上下文，<strong>而非</strong>之前。</p>
<p>舉例來說，如果您要求 Claude Code 分析 10GB 的資料庫，它永遠不會嘗試載入整個資料庫。它的工作方式更像是工程師：</p>
<ol>
<li><p>執行 SQL 查詢，取得資料集的高階摘要。</p></li>
<li><p>使用<code translate="no">head</code> 和<code translate="no">tail</code> 等指令檢視樣本資料，並瞭解其結構。</p></li>
<li><p>只保留上下文中最重要的資訊，例如關鍵統計資料或樣本行。</p></li>
</ol>
<p>將保留在上下文中的資訊減到最少，JIT 檢索就能防止不相關的標記累積而造成腐敗。模型會保持專注，因為它只會看到目前推理步驟所需的資訊。</p>
<h3 id="2-Pre-retrieval-Vector-Search-Preventing-Context-Drift-Before-It-Starts" class="common-anchor-header">2.預先檢索 (向量搜尋)：預先防止上下文漂移</h3><p>有時候，模型無法動態「詢問」資訊 - 客戶支援、問答系統和代理工作流程通常需要<em>在</em>開始產生<em>之前就</em>有正確的知識。這就是<strong>預先擷取</strong>變得非常重要的原因。</p>
<p>情境腐蝕的發生往往是因為模型被交給一大堆原始文字，並期望它能整理出哪些是重要的。而預先擷取功能則能顛覆這種情況：向量資料庫（例如<a href="https://milvus.io/">Milvus</a>和<a href="https://zilliz.com/cloud">Zilliz Cloud</a>）能夠<em>在</em>推理<em>之前</em>識別出最相關的片段，確保只有高價值的上下文才能傳達給模型。</p>
<p>在典型的 RAG 設定中：</p>
<ul>
<li><p>文件被嵌入並儲存在向量資料庫中，例如 Milvus。</p></li>
<li><p>在查詢時，系統會透過相似性搜尋擷取一小組高度相關的片段。</p></li>
<li><p>只有這些區塊會進入模型的上下文。</p></li>
</ul>
<p>這可以從兩方面防止腐爛：</p>
<ul>
<li><p><strong>減少雜訊：</strong>無關或關聯性弱的文字從一開始就不會進入上下文。</p></li>
<li><p><strong>效率：</strong>模型處理的標記數量更少，減少遺失重要細節的機會。</p></li>
</ul>
<p>Milvus 可以在幾毫秒內搜尋數百萬個文件，因此此方法非常適合於延遲很重要的即時系統。</p>
<h3 id="3-Hybrid-JIT-and-Vector-Retrieval" class="common-anchor-header">3.混合 JIT 與向量檢索</h3><p>以向量搜尋為基礎的預先擷取可以確保模型從高信號資訊開始，而不是原始的過大文字，從而解決上下文腐蝕的重要部分。但 Anthropic 強調了團隊經常忽略的兩個真正挑戰：</p>
<ul>
<li><p><strong>及時性：</strong>如果知識庫更新的速度比向量索引重建的速度還快，模型可能會依賴於陳舊的資訊。</p></li>
<li><p><strong>準確性：</strong>在任務開始之前，我們很難精確預測模型會需要什麼，尤其是多步驟或探索性的工作流程。</p></li>
</ul>
<p>因此在現實工作負載中，混合應用程式是最佳解決方案。</p>
<ul>
<li><p>向量搜尋穩定、高確信度的知識</p></li>
<li><p>代理驅動的 JIT 探索，用於不斷演進或僅在任務中變得相關的資訊</p></li>
</ul>
<p>透過混合這兩種方法，您可以獲得向量擷取已知資訊的速度與效率，以及模型在新資料變得相關時發現與載入新資料的彈性。</p>
<p>讓我們來看看這在真實的系統中是如何運作的。以生產文件助理為例。大多數團隊最終會採用兩個階段的管道：Milvus 驅動的向量搜尋 + 以代理為基礎的 JIT 檢索。</p>
<p><strong>1.Milvus 驅動的向量搜尋 (預檢索)</strong></p>
<ul>
<li><p>將您的文件、API 參考資料、更新記錄和已知問題轉換為嵌入。</p></li>
<li><p>將它們儲存在 Milvus 向量資料庫中，並附上產品區域、版本和更新時間等元資料。</p></li>
<li><p>當使用者提出問題時，執行語意搜尋以擷取前 K 個相關片段。</p></li>
</ul>
<p>這可以在 500 毫秒以內解決約 80% 的例行查詢，讓模型有一個強大、抗情境腐蝕的起點。</p>
<p><strong>2.基於代理的探索</strong></p>
<p>當初始檢索不夠時 (例如，當使用者要求高度特定或時間敏感的東西時)，代理可以呼叫工具來取得新資訊：</p>
<ul>
<li><p>使用<code translate="no">search_code</code> 在程式碼庫中找出特定的函式或檔案</p></li>
<li><p>使用<code translate="no">run_query</code> 從資料庫取得即時資料</p></li>
<li><p>使用<code translate="no">fetch_api</code> 獲取最新的系統狀態</p></li>
</ul>
<p>這些呼叫通常需要<strong>3-5 秒</strong>的時間，但它們可以確保模型始終使用新鮮、準確和相關的資料工作 - 即使是系統無法事先預測的問題。</p>
<p>這種混合結構可確保上下文保持及時、正確和特定任務，大幅降低長時間執行的代理工作流程中上下文腐蝕的風險。</p>
<p>Milvus 在這些混合情境中特別有效，因為它支援</p>
<ul>
<li><p><strong>向量搜尋 + 標量篩選</strong>，結合語意相關性與結構化限制</p></li>
<li><p><strong>增量式更新</strong>，允許在不停機的情況下刷新嵌入式資料。</p></li>
</ul>
<p>這使得 Milvus 成為既需要瞭解語意，又需要精確控制擷取內容的系統的理想骨幹。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/milvus_in_hybrid_architecture_7d4e391aa4.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>舉例來說，您可能會執行類似的查詢：</p>
<pre><code translate="no"><span class="hljs-comment"># You can combine queries like this in Milvus</span>
collection.search(
    data=[query_embedding],  <span class="hljs-comment"># Semantic similarity</span>
    anns_field=<span class="hljs-string">&quot;embedding&quot;</span>,
    param={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;COSINE&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;nprobe&quot;</span>: <span class="hljs-number">10</span>}},
    expr=<span class="hljs-string">&quot;doc_type == &#x27;API&#x27; and update_time &gt; &#x27;2025-01-01&#x27;&quot;</span>,  <span class="hljs-comment"># Structured filtering</span>
    limit=<span class="hljs-number">5</span>
)
<button class="copy-code-btn"></button></code></pre>
<h2 id="How-to-Choose-the-Right-Approach-for-Dealing-With-Context-Rot" class="common-anchor-header">如何選擇正確的方法來處理情境腐蝕<button data-href="#How-to-Choose-the-Right-Approach-for-Dealing-With-Context-Rot" class="anchor-icon" translate="no">
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
    </button></h2><p>矢量檢索預檢索、即時檢索和混合檢索都可以<strong>使用</strong>，自然而然的問題是：<strong>您應該使用哪一種方法？</strong></p>
<p>這裡有一個簡單但實用的選擇方法，它是基於您的知識有多<em>穩定</em>，以及模型的資訊需求有多<em>可預測</em>。</p>
<h3 id="1-Vector-Search-→-Best-for-Stable-Domains" class="common-anchor-header">1.向量搜尋 → 最適合穩定的領域</h3><p>如果領域變化緩慢，但要求精確--金融、法律工作、合規性、醫療文件--那麼具有<strong>預檢索</strong>功能的 Milvus 驅動知識庫通常是最合適的。</p>
<p>資訊定義明確、更新頻率低，而且大多數問題都可以透過事先擷取語意相關的文件來解答。</p>
<p><strong>可預測的任務 + 穩定的知識 → 預先擷取。</strong></p>
<h3 id="2-Just-in-Time-Retrieval-→-Best-for-Dynamic-Exploratory-Workflows" class="common-anchor-header">2.即時擷取 → 最適合動態、探索性的工作流程</h3><p>軟體工程、除錯、分析和資料科學等領域涉及快速變化的環境：新檔案、新資料、新部署狀態。在任務開始之前，模型無法預測會需要什麼。</p>
<p><strong>無法預測的任務 + 快速變化的知識 → 即時檢索。</strong></p>
<h3 id="3-Hybrid-Approach-→-When-Both-Conditions-Are-True" class="common-anchor-header">3.混合方法 → 當兩個條件都成立時</h3><p>許多真實的系統並非純粹穩定或純粹動態。例如，開發人員的文件變更緩慢，而生產環境的狀態則每分鐘變更一次。混合方法可讓您</p>
<ul>
<li><p>使用向量搜尋（快速、低延遲）載入已知、穩定的知識</p></li>
<li><p>使用代理工具依需求擷取動態資訊 (精確、最新)</p></li>
</ul>
<p><strong>混合知識 + 混合任務結構 → 混合檢索方法。</strong></p>
<h2 id="What-if-the-Context-Window-Still-Isn’t-Enough" class="common-anchor-header">如果情境視窗還是不夠怎麼辦<button data-href="#What-if-the-Context-Window-Still-Isn’t-Enough" class="anchor-icon" translate="no">
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
    </button></h2><p>情境工程有助於減少超載，但有時問題更為根本：即使經過仔細的修剪，<strong>任務還是根本</strong>放不下。</p>
<p>某些工作流程，例如遷移大型程式碼庫、檢閱多重儲存庫架構，或是產生深入的研究報告，在模型達到任務結束之前，可能會超過 200K 以上的上下文視窗。即使有向量搜尋做繁重的工作，有些任務還是需要更持久、更結構化的記憶體。</p>
<p>最近，Anthropic 提供了三種實用的策略。</p>
<h3 id="1-Compression-Preserve-Signal-Drop-Noise" class="common-anchor-header">1.壓縮：保留訊號，去除雜訊</h3><p>當上下文視窗接近極限時，模型可以將<strong>早期的互動壓縮</strong>為簡潔的摘要。良好的壓縮可以保持</p>
<ul>
<li><p>關鍵決策</p></li>
<li><p>限制與需求</p></li>
<li><p>尚未解決的問題</p></li>
<li><p>相關樣本或範例</p></li>
</ul>
<p>並移除</p>
<ul>
<li><p>繁複的工具輸出</p></li>
<li><p>不相關的日誌</p></li>
<li><p>多餘的步驟</p></li>
</ul>
<p>挑戰在於平衡。壓縮得太強烈，模型就會失去重要資訊；壓縮得太輕鬆，就只會獲得很少的空間。有效的壓縮可以保留「為什麼」和「做什麼」，而捨棄「我們怎麼會到這裡」。</p>
<h3 id="2-Structured-Note-Taking-Move-Stable-Information-Outside-Context" class="common-anchor-header">2.結構化筆記：將穩定的資訊移出上下文之外</h3><p>系統可以將重要的事實儲存於<strong>外部記憶體</strong>中，而不是將所有東西都放在模型的視窗中，這是一個獨立的資料庫或結構化儲存庫，代理程式可以在需要時查詢。</p>
<p>舉例來說，Claude 的 Pokémon-agent 原型會儲存一些持久性的事實，例如...、...等：</p>
<ul>
<li><p><code translate="no">Pikachu leveled up to 8</code></p></li>
<li><p><code translate="no">Trained 1234 steps on Route 1</code></p></li>
<li><p><code translate="no">Goal: reach level 10</code></p></li>
</ul>
<p>與此同時，瞬間的詳細資訊 - 戰鬥記錄、長時間的工具輸出 - 則儲存在活動情境之外。這反映了人類使用筆記本的方式：我們不會將每個細節都儲存在工作記憶體中，我們會將參考點儲存在外部，並在需要時查閱。</p>
<p>結構化的筆記可以防止因重複不必要的細節而造成的上下文腐蝕，同時為模型提供可靠的真相來源。</p>
<h3 id="3-Sub-Agent-Architecture-Divide-and-Conquer-Large-Tasks" class="common-anchor-header">3.子代理架構：分割並征服大型任務</h3><p>對於複雜的任務，可以設計一個多重代理體架構，由一個領導代理體監督整體工作，同時由幾個專門的子代理體處理任務的特定方面。這些子代理深入挖掘與其子任務相關的大量資料，但只傳回簡明、重要的結果。這種方法常用於研究報告或資料分析等情境。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/longduration_task_cbbc07b9ca.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>實際上，一開始最好是使用單一代理結合壓縮來處理任務。只有在需要跨會話保留記憶體時，才應該引入外部儲存。多代理體架構應該保留給真正需要平行處理複雜、專門子任務的任務。</p>
<p>每種方法都能擴充系統的有效「工作記憶體」，而不會打開情境視窗，也不會觸發情境腐蝕。</p>
<h2 id="Best-Practices-for-Designing-Context-That-Actually-Works" class="common-anchor-header">設計實際運作上下文的最佳做法<button data-href="#Best-Practices-for-Designing-Context-That-Actually-Works" class="anchor-icon" translate="no">
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
    </button></h2><p>在處理上下文溢出之後，還有另一個同樣重要的部分：上下文首先是如何建立的。即使有壓縮、外部筆記和次代理，如果提示和工具本身不是為了支援長時間、複雜的推理而設計，系統還是會很吃力。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/System_Prompts_cf655dcd0d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Anthropic 提供了一個有用的方式來思考這個問題 - 不再是單一的撰寫提示練習，而是跨越三個層次來建構情境。</p>
<h3 id="System-Prompts-Find-the-Goldilocks-Zone" class="common-anchor-header"><strong>系統提示：尋找黃金地帶</strong></h3><p>大多數系統提示都會在兩個極端失敗。過多的細節--規則清單、嵌套條件、硬性編碼的例外--使得提示變得脆弱且難以維護。結構太少則會讓模型猜測要做什麼。</p>
<p>最好的提示介於兩者之間：結構性足以引導行為，靈活性足以讓模型推理。在實踐中，這意味著給予模型明確的角色、一般的工作流程，以及輕微的工具指導，不多也不少。</p>
<p>舉例來說：</p>
<pre><code translate="no">You are a technical documentation assistant serving developers.
<span class="hljs-number">1.</span> Start <span class="hljs-keyword">by</span> retrieving relevant documents <span class="hljs-keyword">from</span> the Milvus knowledge <span class="hljs-keyword">base</span>.  
<span class="hljs-number">2.</span> If the retrieval results are insufficient, use the `search_code` tool to perform a deeper search <span class="hljs-keyword">in</span> the codebase.  
<span class="hljs-number">3.</span> When answering, cite specific documentation sections <span class="hljs-keyword">or</span> code line numbers.

<span class="hljs-meta">## Tool guidance</span>
- search_docs: Used <span class="hljs-keyword">for</span> semantic retrieval, best <span class="hljs-keyword">for</span> conceptual questions.  
- search_code: Used <span class="hljs-keyword">for</span> precise lookup <span class="hljs-keyword">in</span> the codebase, best <span class="hljs-keyword">for</span> implementation-detail questions.  
…
<button class="copy-code-btn"></button></code></pre>
<p>這個提示設定了方向，但不會壓倒模型或強迫它處理不屬於這裡的動態資訊。</p>
<h3 id="Tool-Design-Less-Is-More" class="common-anchor-header">工具設計：少即是多</h3><p>一旦系統提示設定了高階行為，工具就會執行實際的操作邏輯。在工具增強的系統中，一個令人驚訝的常見失敗模式就是工具太多，或是工具的用途重疊。</p>
<p>一個好的經驗法則：</p>
<ul>
<li><p><strong>一個工具，一個目的</strong></p></li>
<li><p><strong>明確無誤的參數</strong></p></li>
<li><p><strong>沒有重疊的責任</strong></p></li>
</ul>
<p>如果人類工程師會猶豫該使用哪個工具，那麼模型也會。乾淨的工具設計可減少模糊性、降低認知負荷，並防止上下文被不必要的工具嘗試所擾亂。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/tooling_complexity_7d2bb60c54.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Dynamic-Information-Should-Be-Retrieved-Not-Hardcoded" class="common-anchor-header">動態資訊應該被擷取，而非硬性編碼</h3><p>最後一層是最容易被忽略的。動態或時間敏感的資訊，例如狀態值、最近更新或使用者特定的狀態，根本不應該出現在系統提示中。將這些資訊寫入提示中，保證在長時間的任務中，這些資訊會變得陳舊、臃腫或互相矛盾。</p>
<p>相反，只有在需要時，才能透過擷取或代理工具取得這些資訊。將動態內容保留在系統提示之外，可以防止情境腐蝕，並保持模型的推理空間乾淨。</p>
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
    </button></h2><p>隨著人工智能代理程式進入不同產業的生產環境，它們所承擔的工作流程比以往更長、任務也更複雜。在這些環境中，管理上下文成為實際的必要條件。</p>
<p><strong>然而，更大的上下文視窗並不會自動產生更好的結果</strong>；在許多情況下，它的作用剛好相反。當模型負荷過重、獲取陳舊資訊或被迫接受大量提示時，準確度就會悄悄地下降。這種緩慢、微妙的下降就是我們現在所說的<strong>上下文腐蝕</strong>。</p>
<p>JIT 檢索、預檢索、混合管道和向量資料庫驅動的語意搜尋等技術都是為了同一個目標：<strong>確保模型在正確的時間看到正確的資訊 - 不多也不少 - 這樣它就能腳踏實地，產生可靠的答案。</strong></p>
<p><a href="https://milvus.io/"><strong>Milvus</strong></a>作為一個開放原始碼的高效能向量資料庫，是這個工作流程的核心。它提供了有效儲存知識的基礎架構，並能以低延遲擷取最相關的片段。搭配 JIT 檢索和其他輔助策略，Milvus 可協助 AI 代理在任務變得更深入、更動態時，仍能保持精確度。</p>
<p>但檢索只是謎題的其中一環。良好的提示設計、乾淨簡約的工具集，以及合理的溢出策略 (無論是壓縮、結構化筆記，或是子代理)，都能讓模型在長時間運作的階段中保持專注。這才是真正的情境工程：不是聰明的黑客，而是深思熟慮的架構。</p>
<p>如果您希望 AI 代理在數小時、數天或整個工作流程中都能保持精確度，那麼上下文就值得您對堆疊的其他核心部分給予同樣的關注。</p>
<p>對任何功能有問題或想要深入瞭解？加入我們的<a href="https://discord.com/invite/8uyFbECzPX"> Discord 頻道</a>或在<a href="https://github.com/milvus-io/milvus"> GitHub</a> 上提出問題。您也可以透過<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus Office Hours</a> 預約 20 分鐘的一對一課程，以獲得深入的瞭解、指導和問題解答。</p>
