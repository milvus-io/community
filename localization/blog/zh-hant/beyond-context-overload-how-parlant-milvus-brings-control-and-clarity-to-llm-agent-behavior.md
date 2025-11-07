---
id: >-
  beyond-context-overload-how-parlant-milvus-brings-control-and-clarity-to-llm-agent-behavior.md
title: 超越情境超載：Parlant × Milvus 如何為 LLM 代理行為帶來控制與清晰度
author: Min Yin
date: 2025-11-05T00:00:00.000Z
cover: assets.zilliz.com/parlant_cover1_d39ad6c8b0.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Parlant, Milvus, AI agents, vector database, LLM'
meta_title: How Parlant × Milvus Brings Control to LLM Agent Behavior
desc: 探索 Parlant × Milvus 如何使用排列建模與向量智慧，讓 LLM 代理行為可控制、可解釋，並為生產做好準備。
origin: >-
  https://milvus.io/blog/beyond-context-overload-how-parlant-milvus-brings-control-and-clarity-to-llm-agent-behavior.md
---
<p>想像一下，您被要求完成一項涉及 200 個業務規則、50 個工具和 30 個示範的任務，而您只有一小時的時間來完成。這根本就是不可能的事。然而，當我們將大型語言模型轉變為「代理」，並為它們加載過多指令時，我們往往期望它們能夠做到這一點。</p>
<p>實際上，這種方法很快就會瓦解。傳統的代理框架，例如 LangChain 或 LlamaIndex，會一次將所有規則和工具注入模型的上下文，這會導致規則衝突、上下文過載，以及在生產中不可預測的行為。</p>
<p>為了解決這個問題，一個名為<a href="https://github.com/emcie-co/parlant?utm_source=chatgpt.com"> <strong>Parlant</strong></a>的開放原始碼代理框架最近在 GitHub 上逐漸受到矚目。它引進了稱為 Alignment Modeling 的新方法，以及監督機制和條件轉換，讓代理程式的行為更容易控制和解釋。</p>
<p>若搭配開放原始碼向量資料庫<a href="https://milvus.io/"><strong>Milvus</strong></a>，Parlant 的功能將更加強大。Milvus 增加了語意智慧，讓代理能即時動態擷取最相關的規則與情境，保持準確、有效率，並為生產做好準備。</p>
<p>在這篇文章中，我們將探討 Parlant 如何在遮罩下運作，以及如何將其與 Milvus 整合以達到生產級的效果。</p>
<h2 id="Why-Traditional-Agent-Frameworks-Fall-Apart" class="common-anchor-header">為何傳統的代理程式框架會分崩離析<button data-href="#Why-Traditional-Agent-Frameworks-Fall-Apart" class="anchor-icon" translate="no">
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
    </button></h2><p>傳統的代理程式框架喜歡大而全：數百個規則、數十個工具、數個示範，全都塞進一個過度膨脹的單一提示中。這在示範或小型沙箱測試中可能看起來很棒，但一旦將其推入生產，裂縫就會迅速顯現。</p>
<ul>
<li><p><strong>衝突的規則帶來混亂：</strong>當兩個或更多的規則同時適用時，這些框架沒有內建的方法來決定哪一個獲勝。有時它會選擇其中一個。有時它會混合兩者。有時它會做一些完全無法預測的事情。</p></li>
<li><p><strong>邊緣案例暴露缺口：</strong>您不可能預測使用者可能說的每一句話。當您的模型遇到訓練資料以外的情況時，它就會預設為一般、不具承諾性的答案。</p></li>
<li><p><strong>調試既痛苦又昂貴：</strong>當代理程式發生不當行為時，幾乎不可能找出是哪個規則造成了問題。由於所有東西都在一個巨大的系統提示中，唯一的修復方法就是重寫提示，然後從頭重新測試所有東西。</p></li>
</ul>
<h2 id="What-is-Parlant-and-How-It-Works" class="common-anchor-header">Parlant 是什麼？<button data-href="#What-is-Parlant-and-How-It-Works" class="anchor-icon" translate="no">
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
    </button></h2><p>Parlant 是 LLM 代理程式的開放原始碼 Alignment Engine。透過以結構化、基於規則的方式建模代理程式的決策過程，您可以精確控制代理程式在不同情境下的行為。</p>
<p>為了解決傳統代理程式框架中發現的問題，Parlant 引進了一種新的強大方法：<strong>對齊建模 (Alignment Modeling</strong>)。其核心思想是將規則定義與規則執行分開，確保在任何特定時間，只有最相關的規則才會注入 LLM 的上下文。</p>
<h3 id="Granular-Guidelines-The-Core-of-Alignment-Modeling" class="common-anchor-header">詳細指引：對齊建模的核心</h3><p>Parlant 對齊模型的核心是「<strong>細粒指引」（Granular Guidelines</strong>）的概念。您可以定義小的、模組化的指導方針，而不是撰寫一個充滿規則的巨型系統提示，每個指導方針都會說明代理程式應該如何處理特定類型的情況。</p>
<p>每個指引都由三個部分組成：</p>
<ul>
<li><p><strong>條件</strong>- 自然語言描述，說明規則在何時適用。Parlant 將此條件轉換為語意向量，並將其與使用者的輸入進行比對，以判斷是否相關。</p></li>
<li><p><strong>動作 (Action</strong>) - 定義代理程式在符合條件時應如何回應的明確指令。這個動作只有在觸發時才會注入 LLM 的上下文。</p></li>
<li><p><strong>工具</strong>- 與特定規則相關的任何外部功能或 API。只有當指導方針啟動時，代理程式才會接觸到這些工具，以保持工具使用的可控性和情境感知。</p></li>
</ul>
<pre><code translate="no"><span class="hljs-keyword">await</span> agent.<span class="hljs-title function_">create_guideline</span>(
    condition=<span class="hljs-string">&quot;The user asks about a refund and the order amount exceeds 500 RMB&quot;</span>,
    action=<span class="hljs-string">&quot;First call the order status check tool to confirm whether the refund conditions are met, then provide a detailed explanation of the refund process&quot;</span>,
    tools=[check_order_status, calculate_refund_amount]
)
<button class="copy-code-btn"></button></code></pre>
<p>每次使用者與代理程式互動時，Parlant 都會執行一個輕量級的匹配步驟，找出三到五個最相關的準則。只有這些規則會被注入模型的上下文中，以保持提示的簡潔與重點，同時確保代理程式持續遵循正確的規則。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/guideline_system_652fb287ce.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Supervising-Mechanism-for-Accuracy-and-Consistency" class="common-anchor-header">準確性與一致性的監督機制</h3><p>為了進一步保持準確性和一致性，Parlant 引入了<strong>監督機制</strong>，作為第二層品質控制。該流程分三個步驟進行：</p>
<p><strong>1.生成候選回應</strong>- 代理程式會根據匹配的指引和當前的對話內容創建初始回覆。</p>
<p><strong>2.檢查是否符合規定</strong>- 回覆會與作用中的指引進行比較，以驗證是否正確遵循了每項指示。</p>
<p><strong>3.修改或確認</strong>- 如果發現任何問題，系統會修正輸出；如果一切都沒問題，回覆就會被核准並傳送給使用者。</p>
<p>這種監督機制可確保代理不僅瞭解規則，而且在回覆之前實際遵守規則，從而提高可靠性和控制力。</p>
<h3 id="Conditional-Transitions-for-Control-and-Safety" class="common-anchor-header">控制與安全的條件轉換</h3><p>在傳統的代理程式架構中，每個可用的工具都會隨時暴露給 LLM。這種「一切盡在掌握」的方式經常會導致超載提示和非預期的工具呼叫。Parlant 透過<strong>條件轉換來</strong>解決這個問題。類似於狀態機運作的方式，動作或工具只有在符合特定條件時才會被觸發。每個工具都與相對應的準則緊密結合，只有當該準則的條件被啟動時，它才會變得可用。</p>
<pre><code translate="no"><span class="hljs-comment"># The balance inquiry tool is exposed only when the condition &quot;the user wants to make a transfer&quot; is met</span>
<span class="hljs-keyword">await</span> agent.create_guideline(
    condition=<span class="hljs-string">&quot;The user wants to make a transfer&quot;</span>,
    action=<span class="hljs-string">&quot;First check the account balance. If the balance is below 500 RMB, remind the user that an overdraft fee may apply.&quot;</span>,
    tools=[get_user_account_balance]
)
<button class="copy-code-btn"></button></code></pre>
<p>此機制將工具調用轉換為條件轉換-工具只有在滿足其觸發條件時，才會從 「非作用中 」轉換為 「作用中」。透過這樣的執行結構，Parlant 可確保每個動作都是經過深思熟慮且符合情境的，在提高效率與系統安全性的同時，也能防止誤用。</p>
<h2 id="How-Milvus-Powers-Parlant" class="common-anchor-header">Milvus 如何為 Parlant 提供動力<button data-href="#How-Milvus-Powers-Parlant" class="anchor-icon" translate="no">
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
    </button></h2><p>當我們深入瞭解 Parlant 的指引匹配流程時，一個核心技術挑戰變得明確：系統如何在短短幾毫秒的時間內，從數百個甚至上千個選項中找出三到五個最相關的規則？這正是向量資料庫的用武之地。語意檢索讓這一切成為可能。</p>
<h3 id="How-Milvus-Supports-Parlant’s-Guideline-Matching-Process" class="common-anchor-header">Milvus如何支持Parlant的指南匹配流程</h3><p>指南匹配是通過語義相似性進行的。每個指南的 Condition 欄位都會轉換成向量嵌入，以捕捉其意義，而不僅僅是其文字。當使用者傳送訊息時，Parlant 會將該訊息的語義與所有儲存的指引嵌入進行比較，以找出最相關的指引。</p>
<p>以下是整個過程的步驟：</p>
<p><strong>1.編碼查詢</strong>- 將使用者的訊息和最近的對話記錄轉換成查詢向量。</p>
<p><strong>2.搜尋相似性</strong>- 系統在指引向量儲存庫中執行相似性搜尋，找出最接近的匹配項目。</p>
<p><strong>3.擷取 Top-K 結果</strong>- 會傳回語意最相關的前三到五個指引。</p>
<p><strong>4.插入上下文</strong>- 這些匹配的指引會動態插入 LLM 的上下文，以便模型可以根據正確的規則行事。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/guideline_matching_process_ffd874c77e.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>為了讓這個工作流程成為可能，向量資料庫必須提供三項關鍵功能：高效能的近似近鄰 (ANN) 搜尋、彈性的元資料篩選，以及即時向量更新。<a href="https://milvus.io/"><strong>Milvus</strong></a> 是開放原始碼、雲端原生向量資料庫，可在這三個領域提供生產級的效能。</p>
<p>要瞭解 Milvus 在實際情境中的運作方式，讓我們以金融服務代理商為例。</p>
<p>假設系統定義了 800 個業務指引，涵蓋帳戶查詢、資金轉帳和財富管理產品諮詢等任務。在此設定中，Milvus 充當所有指引資料的儲存和檢索層。</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> connections, Collection, FieldSchema, CollectionSchema, DataType
<span class="hljs-keyword">import</span> parlant.sdk <span class="hljs-keyword">as</span> p

<span class="hljs-comment"># Connect to Milvus</span>
connections.connect(host=<span class="hljs-string">&quot;localhost&quot;</span>, port=<span class="hljs-string">&quot;19530&quot;</span>)

<span class="hljs-comment"># Define the schema for the guideline collection</span>
fields = [
    FieldSchema(name=<span class="hljs-string">&quot;guideline_id&quot;</span>, dtype=DataType.VARCHAR, max_length=<span class="hljs-number">100</span>, is_primary=<span class="hljs-literal">True</span>),
    FieldSchema(name=<span class="hljs-string">&quot;condition_vector&quot;</span>, dtype=DataType.FLOAT_VECTOR, dim=<span class="hljs-number">768</span>),
    FieldSchema(name=<span class="hljs-string">&quot;condition_text&quot;</span>, dtype=DataType.VARCHAR, max_length=<span class="hljs-number">1000</span>),
    FieldSchema(name=<span class="hljs-string">&quot;action_text&quot;</span>, dtype=DataType.VARCHAR, max_length=<span class="hljs-number">2000</span>),
    FieldSchema(name=<span class="hljs-string">&quot;priority&quot;</span>, dtype=DataType.INT64),
    FieldSchema(name=<span class="hljs-string">&quot;business_domain&quot;</span>, dtype=DataType.VARCHAR, max_length=<span class="hljs-number">50</span>)
]
schema = CollectionSchema(fields=fields, description=<span class="hljs-string">&quot;Agent Guidelines&quot;</span>)
guideline_collection = Collection(name=<span class="hljs-string">&quot;agent_guidelines&quot;</span>, schema=schema)

<span class="hljs-comment"># Create an HNSW index for high-performance retrieval</span>
index_params = {
    <span class="hljs-string">&quot;index_type&quot;</span>: <span class="hljs-string">&quot;HNSW&quot;</span>,
    <span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;COSINE&quot;</span>,
    <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;M&quot;</span>: <span class="hljs-number">16</span>, <span class="hljs-string">&quot;efConstruction&quot;</span>: <span class="hljs-number">200</span>}
}
guideline_collection.create_index(field_name=<span class="hljs-string">&quot;condition_vector&quot;</span>, index_params=index_params)
<button class="copy-code-btn"></button></code></pre>
<p>現在，當用戶說 「我想向我母親的帳戶轉帳 100,000 元人民幣 」時，運行流程為</p>
<p><strong>1.Rectorize the query</strong>- 將使用者輸入轉換成 768 維向量。</p>
<p><strong>2.混合檢索</strong>- 在 Milvus 中執行向量相似性搜尋，並進行元資料篩選 (例如：<code translate="no">business_domain=&quot;transfer&quot;</code>)。</p>
<p><strong>3.結果排序</strong>- 依據相似性分數結合<strong>優先</strong>順序值，對候選指南進行排序。</p>
<p><strong>4.情境注入</strong>- 將前三個符合的指南<code translate="no">action_text</code> 注入 Parlant 代理的情境中。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/bank_transfer_use_case_481d09a407.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>在此設定中，即使指引庫擴充至 100,000 個項目，Milvus 的 P99 延遲仍低於 15 毫秒。相較之下，使用傳統關聯式資料庫與關鍵字比對，通常會導致超過 200 毫秒的延遲，以及明顯較低的比對準確度。</p>
<h3 id="How-Milvus-Enables-Long-Term-Memory-and-Personalization" class="common-anchor-header">Milvus 如何實現長期記憶與個人化</h3><p>Milvus 的功能不僅限於指引匹配。在代理需要長期記憶和個人化回應的場景中，Milvus 可作為記憶層，以向量嵌入的方式儲存和檢索使用者過去的互動，協助代理記住之前討論的內容。</p>
<pre><code translate="no"><span class="hljs-comment"># store user’s past interactions</span>
user_memory_fields = [
    FieldSchema(name=<span class="hljs-string">&quot;interaction_id&quot;</span>, dtype=DataType.VARCHAR, max_length=<span class="hljs-number">100</span>, is_primary=<span class="hljs-literal">True</span>),
    FieldSchema(name=<span class="hljs-string">&quot;user_id&quot;</span>, dtype=DataType.VARCHAR, max_length=<span class="hljs-number">50</span>),
    FieldSchema(name=<span class="hljs-string">&quot;interaction_vector&quot;</span>, dtype=DataType.FLOAT_VECTOR, dim=<span class="hljs-number">768</span>),
    FieldSchema(name=<span class="hljs-string">&quot;interaction_summary&quot;</span>, dtype=DataType.VARCHAR, max_length=<span class="hljs-number">500</span>),
    FieldSchema(name=<span class="hljs-string">&quot;timestamp&quot;</span>, dtype=DataType.INT64)
]
memory_collection = Collection(name=<span class="hljs-string">&quot;user_memory&quot;</span>, schema=CollectionSchema(user_memory_fields))
<button class="copy-code-btn"></button></code></pre>
<p>當同一位使用者回來時，代理程式可以從 Milvus 擷取最相關的歷史互動，並利用這些互動來產生更連結的、類似人類的體驗。舉例來說，如果使用者上週詢問投資基金的相關資訊，代理程式就能回想當時的情境並主動回應："歡迎回來！您對我們上次討論的基金還有問題嗎？</p>
<h3 id="How-to-Optimize-Performance-for-Milvus-Powered-Agent-Systems" class="common-anchor-header">如何優化由 Milvus 驅動的代理系統的性能</h3><p>在生產環境中部署由 Milvus 驅動的代理系統時，性能調整變得非常重要。要實現低延遲和高吞吐量，需要注意幾個關鍵參數：</p>
<p><strong>1.選擇正確的索引類型</strong></p>
<p>選擇適當的索引結構非常重要。舉例來說，HNSW (Hierarchical Navigable Small World) 適合金融或醫療保健等高召回率的情境，因為在這些情境中，精確度是至關重要的。IVF_FLAT 更適合電子商務推薦等大型應用程式，在這些應用程式中，可以接受稍低的召回率，以換取更快的效能和更少的記憶體使用。</p>
<p><strong>2.分片策略</strong></p>
<p>當儲存的指引數量超過一百萬個項目時，建議使用<strong>Partition</strong>來依業務領域或用例分割資料。分區可減少每次查詢的搜尋空間，提高擷取速度，即使資料集成長，也能保持延遲穩定。</p>
<p><strong>3.快取設定</strong></p>
<p>對於頻繁存取的指引，例如標準客戶查詢或高流量工作流程，您可以使用 Milvus 查詢結果快取。這可讓系統重用先前的結果，將重複搜尋的延遲時間縮短至 5 毫秒以下。</p>
<h2 id="Hands-on-Demo-How-to-Build-a-Smart-QA-System-with-Parlant-and-Milvus-Lite" class="common-anchor-header">實際操作示範：如何使用 Parlant 和 Milvus Lite 建立智慧型問答系統<button data-href="#Hands-on-Demo-How-to-Build-a-Smart-QA-System-with-Parlant-and-Milvus-Lite" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://milvus.io/docs/install-overview.md">Milvus Lite</a>是 Milvus 的輕量級版本 - 可輕鬆嵌入應用程式的 Python 函式庫。它非常適合在 Jupyter Notebooks 等環境中快速建立原型，或在運算資源有限的邊緣與智慧型裝置上執行。儘管 Milvus Lite 的佔用空間較小，但它支援與其他 Milvus 部署相同的 API。這表示您為 Milvus Lite 寫的用戶端程式碼，日後可無縫連接至完整的 Milvus 或 Zilliz Cloud 實例 - 無須重構。</p>
<p>在這個示範中，我們將結合 Parlant 使用 Milvus Lite 來展示如何建立一個智慧型問答系統，以最少的設定提供快速、上下文感知的答案。</p>
<h3 id="Prerequisites" class="common-anchor-header">先決條件： 1.Parlant GitHub</h3><p>1.Parlant GitHub: https://github.com/emcie-co/parlant</p>
<p>2.Parlant 文件： https://parlant.io/docs</p>
<p>3.python3.10以上</p>
<p>4.OpenAI_key</p>
<p>5.MlivusLite</p>
<h3 id="Step-1-Install-Dependencies" class="common-anchor-header">步驟 1: 安裝相依性</h3><pre><code translate="no"><span class="hljs-comment"># Install required Python packages</span>
pip install pymilvus parlant openai
<span class="hljs-comment"># Or, if you’re using a Conda environment:</span>
conda activate your_env_name
pip install pymilvus parlant openai
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-2-Configure-Environment-Variables" class="common-anchor-header">步驟 2：配置環境變數</h3><pre><code translate="no"><span class="hljs-comment"># Set your OpenAI API key</span>
<span class="hljs-built_in">export</span> OPENAI_API_KEY=<span class="hljs-string">&quot;your_openai_api_key_here&quot;</span>
<span class="hljs-comment"># Verify that the variable is set correctly</span>
<span class="hljs-built_in">echo</span> <span class="hljs-variable">$OPENAI_API_KEY</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-3-Implement-the-Core-Code" class="common-anchor-header">步驟 3: 執行核心程式碼</h3><ul>
<li>建立自訂的 OpenAI Embedder</li>
</ul>
<pre><code translate="no"><span class="hljs-keyword">class</span> <span class="hljs-title class_">OpenAIEmbedder</span>(p.Embedder):
    <span class="hljs-comment"># Converts text into vector embeddings with built-in timeout and retry</span>
    <span class="hljs-comment"># Dimension: 1536 (text-embedding-3-small)</span>
    <span class="hljs-comment"># Timeout: 60 seconds; Retries: up to 2 times</span>
<button class="copy-code-btn"></button></code></pre>
<ul>
<li>初始化知識庫</li>
</ul>
<p>1.建立一個名為 kb_articles 的 Milvus 套件。</p>
<p>2.插入範例資料 (例如退款政策、換貨政策、出貨時間)。</p>
<p>3.建立 HNSW 索引以加速檢索。</p>
<ul>
<li>建立向量搜尋工具</li>
</ul>
<pre><code translate="no"><span class="hljs-meta">@p.tool</span>
<span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">vector_search</span>(<span class="hljs-params">query: <span class="hljs-built_in">str</span>, top_k: <span class="hljs-built_in">int</span> = <span class="hljs-number">5</span>, min_score: <span class="hljs-built_in">float</span> = <span class="hljs-number">0.35</span></span>):
    <span class="hljs-comment"># 1. Convert user query into a vector</span>
    <span class="hljs-comment"># 2. Perform similarity search in Milvus</span>
    <span class="hljs-comment"># 3. Return results with relevance above threshold</span>
<button class="copy-code-btn"></button></code></pre>
<ul>
<li>設定 Parlant Agent</li>
</ul>
<p><strong>準則 1：</strong>對於事實或政策相關的問題，代理必須先執行向量搜尋。</p>
<p><strong>準則 2：</strong>當找到證據時，代理必須使用結構化的範本 (摘要 + 重點 + 來源) 來回覆。</p>
<pre><code translate="no"><span class="hljs-comment"># Guideline 1: Run vector search for factual or policy-related questions</span>
<span class="hljs-keyword">await</span> agent.create_guideline(
            condition=<span class="hljs-string">&quot;User asks a factual question about policy, refund, exchange, or shipping&quot;</span>,
            action=(
                <span class="hljs-string">&quot;Call vector_search with the user&#x27;s query. &quot;</span>
                <span class="hljs-string">&quot;If evidence is found, synthesize an answer by quoting key sentences and cite doc_id/title. &quot;</span>
                <span class="hljs-string">&quot;If evidence is insufficient, ask a clarifying question before answering.&quot;</span>
            ),
            tools=[vector_search],

<span class="hljs-comment"># Guideline 2: Use a standardized, structured response when evidence is available</span>
<span class="hljs-keyword">await</span> agent.create_guideline(
            condition=<span class="hljs-string">&quot;Evidence is available&quot;</span>,
            action=(
                <span class="hljs-string">&quot;Answer with the following template:\\n&quot;</span>
                <span class="hljs-string">&quot;Summary: provide a concise conclusion.\\n&quot;</span>
                <span class="hljs-string">&quot;Key points: 2-3 bullets distilled from evidence.\\n&quot;</span>
                <span class="hljs-string">&quot;Sources: list doc_id and title.\\n&quot;</span>
                <span class="hljs-string">&quot;Note: if confidence is low, state limitations and ask for clarification.&quot;</span>
            ),
            tools=[],
        )

    tools=[],
)
<button class="copy-code-btn"></button></code></pre>
<ul>
<li>撰寫完整程式碼</li>
</ul>
<pre><code translate="no"><span class="hljs-keyword">import</span> os
<span class="hljs-keyword">import</span> asyncio
<span class="hljs-keyword">import</span> json
<span class="hljs-keyword">from</span> typing <span class="hljs-keyword">import</span> <span class="hljs-type">List</span>, <span class="hljs-type">Dict</span>, <span class="hljs-type">Any</span>
<span class="hljs-keyword">import</span> parlant.sdk <span class="hljs-keyword">as</span> p
<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient, DataType
<span class="hljs-comment"># 1) Environment variables: using OpenAI (as both the default generation model and embedding service)</span>
<span class="hljs-comment"># Make sure the OPENAI_API_KEY is set</span>
OPENAI_API_KEY = os.environ.get(<span class="hljs-string">&quot;OPENAI_API_KEY&quot;</span>)
<span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> OPENAI_API_KEY:
    <span class="hljs-keyword">raise</span> RuntimeError(<span class="hljs-string">&quot;Please set OPENAI_API_KEY environment variable&quot;</span>)
<span class="hljs-comment"># 2) Initialize Milvus Lite (runs locally, no standalone service required)</span>
<span class="hljs-comment"># MilvusClient runs in Lite mode using a local file path (requires pymilvus &gt;= 2.x)</span>
client = MilvusClient(<span class="hljs-string">&quot;./milvus_demo.db&quot;</span>)  <span class="hljs-comment"># Lite mode uses a local file path</span>
COLLECTION = <span class="hljs-string">&quot;kb_articles&quot;</span>
<span class="hljs-comment"># 3) Example data: three policy or FAQ entries (in practice, you can load and chunk data from files)</span>
DOCS = [
    {<span class="hljs-string">&quot;doc_id&quot;</span>: <span class="hljs-string">&quot;POLICY-001&quot;</span>, <span class="hljs-string">&quot;title&quot;</span>: <span class="hljs-string">&quot;Refund Policy&quot;</span>, <span class="hljs-string">&quot;chunk&quot;</span>: <span class="hljs-string">&quot;Refunds are available within 30 days of purchase if the product is unused.&quot;</span>},
    {<span class="hljs-string">&quot;doc_id&quot;</span>: <span class="hljs-string">&quot;POLICY-002&quot;</span>, <span class="hljs-string">&quot;title&quot;</span>: <span class="hljs-string">&quot;Exchange Policy&quot;</span>, <span class="hljs-string">&quot;chunk&quot;</span>: <span class="hljs-string">&quot;Exchanges are permitted within 15 days; original packaging required.&quot;</span>},
    {<span class="hljs-string">&quot;doc_id&quot;</span>: <span class="hljs-string">&quot;FAQ-101&quot;</span>, <span class="hljs-string">&quot;title&quot;</span>: <span class="hljs-string">&quot;Shipping Time&quot;</span>, <span class="hljs-string">&quot;chunk&quot;</span>: <span class="hljs-string">&quot;Standard shipping usually takes 3–5 business days within the country.&quot;</span>},
]
<span class="hljs-comment"># 4) Generate embeddings using OpenAI (you can replace this with another embedding service)</span>
<span class="hljs-comment"># Here we use Parlant’s built-in OpenAI embedder for simplicity, but you could also call the OpenAI SDK directly.</span>
<span class="hljs-keyword">class</span> <span class="hljs-title class_">OpenAIEmbedder</span>(p.Embedder):
    <span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">embed</span>(<span class="hljs-params">self, texts: <span class="hljs-type">List</span>[<span class="hljs-built_in">str</span>], hints: <span class="hljs-type">Dict</span>[<span class="hljs-built_in">str</span>, <span class="hljs-type">Any</span>] = {}</span>) -&gt; p.EmbeddingResult:
        <span class="hljs-comment"># Generate text embeddings using the OpenAI API, with timeout and retry handling</span>
        <span class="hljs-keyword">import</span> openai
        <span class="hljs-keyword">try</span>:
            client = openai.AsyncOpenAI(
                api_key=OPENAI_API_KEY,
                timeout=<span class="hljs-number">60.0</span>,  <span class="hljs-comment"># 60-second timeout</span>
                max_retries=<span class="hljs-number">2</span>  <span class="hljs-comment"># Retry up to 2 times</span>
            )
            <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Generating embeddings for <span class="hljs-subst">{<span class="hljs-built_in">len</span>(texts)}</span> texts...&quot;</span>)
            response = <span class="hljs-keyword">await</span> client.embeddings.create(
                model=<span class="hljs-string">&quot;text-embedding-3-small&quot;</span>,
                <span class="hljs-built_in">input</span>=texts
            )
            vectors = [data.embedding <span class="hljs-keyword">for</span> data <span class="hljs-keyword">in</span> response.data]
            <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Successfully generated <span class="hljs-subst">{<span class="hljs-built_in">len</span>(vectors)}</span> embeddings.&quot;</span>)
            <span class="hljs-keyword">return</span> p.EmbeddingResult(vectors=vectors)
        <span class="hljs-keyword">except</span> Exception <span class="hljs-keyword">as</span> e:
            <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;OpenAI API call failed: <span class="hljs-subst">{e}</span>&quot;</span>)
            <span class="hljs-comment"># Return mock vectors for testing Milvus connectivity</span>
            <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Using mock vectors for testing...&quot;</span>)
            <span class="hljs-keyword">import</span> random
            vectors = [[random.random() <span class="hljs-keyword">for</span> _ <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-number">1536</span>)] <span class="hljs-keyword">for</span> _ <span class="hljs-keyword">in</span> texts]
            <span class="hljs-keyword">return</span> p.EmbeddingResult(vectors=vectors)
<span class="hljs-meta">    @property</span>
    <span class="hljs-keyword">def</span> <span class="hljs-title function_">id</span>(<span class="hljs-params">self</span>) -&gt; <span class="hljs-built_in">str</span>:
        <span class="hljs-keyword">return</span> <span class="hljs-string">&quot;text-embedding-3-small&quot;</span>
<span class="hljs-meta">    @property</span>
    <span class="hljs-keyword">def</span> <span class="hljs-title function_">max_tokens</span>(<span class="hljs-params">self</span>) -&gt; <span class="hljs-built_in">int</span>:
        <span class="hljs-keyword">return</span> <span class="hljs-number">8192</span>
<span class="hljs-meta">    @property</span>
    <span class="hljs-keyword">def</span> <span class="hljs-title function_">tokenizer</span>(<span class="hljs-params">self</span>) -&gt; p.EstimatingTokenizer:
        <span class="hljs-keyword">from</span> parlant.core.nlp.tokenization <span class="hljs-keyword">import</span> ZeroEstimatingTokenizer
        <span class="hljs-keyword">return</span> ZeroEstimatingTokenizer()
<span class="hljs-meta">    @property</span>
    <span class="hljs-keyword">def</span> <span class="hljs-title function_">dimensions</span>(<span class="hljs-params">self</span>) -&gt; <span class="hljs-built_in">int</span>:
        <span class="hljs-keyword">return</span> <span class="hljs-number">1536</span>
embedder = OpenAIEmbedder()
<span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">ensure_collection_and_load</span>():
    <span class="hljs-comment"># Create the collection (schema: primary key, vector field, additional fields)</span>
    <span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> client.has_collection(COLLECTION):
        client.create_collection(
            collection_name=COLLECTION,
            dimension=<span class="hljs-built_in">len</span>((<span class="hljs-keyword">await</span> embedder.embed([<span class="hljs-string">&quot;dimension_probe&quot;</span>])).vectors[<span class="hljs-number">0</span>]),
            <span class="hljs-comment"># Default metric: COSINE (can be changed with metric_type=&quot;COSINE&quot;)</span>
            auto_id=<span class="hljs-literal">True</span>,
        )
        <span class="hljs-comment"># Create an index to speed up retrieval (HNSW used here as an example)</span>
        client.create_index(
            collection_name=COLLECTION,
            field_name=<span class="hljs-string">&quot;vector&quot;</span>,
            index_type=<span class="hljs-string">&quot;HNSW&quot;</span>,
            metric_type=<span class="hljs-string">&quot;COSINE&quot;</span>,
            params={<span class="hljs-string">&quot;M&quot;</span>: <span class="hljs-number">32</span>, <span class="hljs-string">&quot;efConstruction&quot;</span>: <span class="hljs-number">200</span>}
        )
    <span class="hljs-comment"># Insert data (skip if already exists; simple idempotent logic for the demo)</span>
    <span class="hljs-comment"># Generate embeddings</span>
    chunks = [d[<span class="hljs-string">&quot;chunk&quot;</span>] <span class="hljs-keyword">for</span> d <span class="hljs-keyword">in</span> DOCS]
    embedding_result = <span class="hljs-keyword">await</span> embedder.embed(chunks)
    vectors = embedding_result.vectors
    <span class="hljs-comment"># Check if the same doc_id already exists; this is for demo purposes only — real applications should use stricter deduplication</span>
    <span class="hljs-comment"># Here we insert directly. In production, use an upsert operation or an explicit primary key</span>
    client.insert(
        COLLECTION,
        data=[
            {<span class="hljs-string">&quot;vector&quot;</span>: vectors[i], <span class="hljs-string">&quot;doc_id&quot;</span>: DOCS[i][<span class="hljs-string">&quot;doc_id&quot;</span>], <span class="hljs-string">&quot;title&quot;</span>: DOCS[i][<span class="hljs-string">&quot;title&quot;</span>], <span class="hljs-string">&quot;chunk&quot;</span>: DOCS[i][<span class="hljs-string">&quot;chunk&quot;</span>]}
            <span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-built_in">len</span>(DOCS))
        ],
    )
    <span class="hljs-comment"># Load into memory</span>
    client.load_collection(COLLECTION)
<span class="hljs-comment"># 5) Define the vector search tool (Parlant Tool)</span>
<span class="hljs-meta">@p.tool</span>
<span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">vector_search</span>(<span class="hljs-params">context: p.ToolContext, query: <span class="hljs-built_in">str</span>, top_k: <span class="hljs-built_in">int</span> = <span class="hljs-number">5</span>, min_score: <span class="hljs-built_in">float</span> = <span class="hljs-number">0.35</span></span>) -&gt; p.ToolResult:
    <span class="hljs-comment"># 5.1 Generate the query vector</span>
    embed_res = <span class="hljs-keyword">await</span> embedder.embed([query])
    qvec = embed_res.vectors[<span class="hljs-number">0</span>]
    <span class="hljs-comment"># 5.2 Search Milvus</span>
    results = client.search(
        collection_name=COLLECTION,
        data=[qvec],
        limit=top_k,
        output_fields=[<span class="hljs-string">&quot;doc_id&quot;</span>, <span class="hljs-string">&quot;title&quot;</span>, <span class="hljs-string">&quot;chunk&quot;</span>],
        search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;COSINE&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;ef&quot;</span>: <span class="hljs-number">128</span>}},
    )
    <span class="hljs-comment"># 5.3 Assemble structured evidence and filter by score threshold</span>
    hits = []
    <span class="hljs-keyword">for</span> hit <span class="hljs-keyword">in</span> results[<span class="hljs-number">0</span>]:
        score = hit[<span class="hljs-string">&quot;distance&quot;</span>] <span class="hljs-keyword">if</span> <span class="hljs-string">&quot;distance&quot;</span> <span class="hljs-keyword">in</span> hit <span class="hljs-keyword">else</span> hit.get(<span class="hljs-string">&quot;score&quot;</span>, <span class="hljs-number">0.0</span>)
        <span class="hljs-keyword">if</span> score &gt;= min_score:
            hits.append({
                <span class="hljs-string">&quot;doc_id&quot;</span>: hit[<span class="hljs-string">&quot;entity&quot;</span>][<span class="hljs-string">&quot;doc_id&quot;</span>],
                <span class="hljs-string">&quot;title&quot;</span>: hit[<span class="hljs-string">&quot;entity&quot;</span>][<span class="hljs-string">&quot;title&quot;</span>],
                <span class="hljs-string">&quot;chunk&quot;</span>: hit[<span class="hljs-string">&quot;entity&quot;</span>][<span class="hljs-string">&quot;chunk&quot;</span>],
                <span class="hljs-string">&quot;score&quot;</span>: <span class="hljs-built_in">float</span>(score),
            })
    <span class="hljs-keyword">return</span> p.ToolResult({<span class="hljs-string">&quot;evidence&quot;</span>: hits})
<span class="hljs-comment"># 6) Run Parlant Server and create the Agent + Guidelines</span>
<span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">main</span>():
    <span class="hljs-keyword">await</span> ensure_collection_and_load()
    <span class="hljs-keyword">async</span> <span class="hljs-keyword">with</span> p.Server() <span class="hljs-keyword">as</span> server:
        agent = <span class="hljs-keyword">await</span> server.create_agent(
            name=<span class="hljs-string">&quot;Policy Assistant&quot;</span>,
            description=<span class="hljs-string">&quot;Rule-controlled RAG assistant with Milvus Lite&quot;</span>,
        )
        <span class="hljs-comment"># Example variable: current time (can be used in templates or logs)</span>
<span class="hljs-meta">        @p.tool</span>
        <span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">get_datetime</span>(<span class="hljs-params">context: p.ToolContext</span>) -&gt; p.ToolResult:
            <span class="hljs-keyword">from</span> datetime <span class="hljs-keyword">import</span> datetime
            <span class="hljs-keyword">return</span> p.ToolResult({<span class="hljs-string">&quot;now&quot;</span>: datetime.now().isoformat()})
        <span class="hljs-keyword">await</span> agent.create_variable(name=<span class="hljs-string">&quot;current-datetime&quot;</span>, tool=get_datetime)
        <span class="hljs-comment"># Core Guideline 1: Run vector search for factual or policy-related questions</span>
        <span class="hljs-keyword">await</span> agent.create_guideline(
            condition=<span class="hljs-string">&quot;User asks a factual question about policy, refund, exchange, or shipping&quot;</span>,
            action=(
                <span class="hljs-string">&quot;Call vector_search with the user&#x27;s query. &quot;</span>
                <span class="hljs-string">&quot;If evidence is found, synthesize an answer by quoting key sentences and cite doc_id/title. &quot;</span>
                <span class="hljs-string">&quot;If evidence is insufficient, ask a clarifying question before answering.&quot;</span>
            ),
            tools=[vector_search],
        )
        <span class="hljs-comment"># Core Guideline 2: Use a standardized, structured response when evidence is available</span>
        <span class="hljs-keyword">await</span> agent.create_guideline(
            condition=<span class="hljs-string">&quot;Evidence is available&quot;</span>,
            action=(
                <span class="hljs-string">&quot;Answer with the following template:\\n&quot;</span>
                <span class="hljs-string">&quot;Summary: provide a concise conclusion.\\n&quot;</span>
                <span class="hljs-string">&quot;Key points: 2-3 bullets distilled from evidence.\\n&quot;</span>
                <span class="hljs-string">&quot;Sources: list doc_id and title.\\n&quot;</span>
                <span class="hljs-string">&quot;Note: if confidence is low, state limitations and ask for clarification.&quot;</span>
            ),
            tools=[],
        )
        <span class="hljs-comment"># Hint: Local Playground URL</span>
        <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Playground: &lt;http://localhost:8800&gt;&quot;</span>)
<span class="hljs-keyword">if</span> __name__ == <span class="hljs-string">&quot;__main__&quot;</span>:
    asyncio.run(main())
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-4-Run-the-Code" class="common-anchor-header">步驟 4：執行程式碼</h3><pre><code translate="no"><span class="hljs-comment"># Run the main program</span>
python main.py
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/python_main_eb7d7c6d73.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<ul>
<li>造訪 Playground：</li>
</ul>
<pre><code translate="no">&lt;<span class="hljs-attr">http</span>:<span class="hljs-comment">//localhost:8800&gt;</span>
<button class="copy-code-btn"></button></code></pre>
<p>現在您已經成功地使用 Parlant 和 Milvus 建立了一個智慧型問答系統。</p>
<h2 id="Parlant-vs-LangChainLlamaIndex-How-They-Differ-and-How-They-Work-Together" class="common-anchor-header">Parlant vs. LangChain/LlamaIndex：它們的差異與合作方式<button data-href="#Parlant-vs-LangChainLlamaIndex-How-They-Differ-and-How-They-Work-Together" class="anchor-icon" translate="no">
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
    </button></h2><p>與現有的代理框架如<strong>LangChain</strong>或<strong>LlamaIndex</strong> 相比，Parlant 有何不同？</p>
<p>LangChain 和 LlamaIndex 是通用框架。它們提供廣泛的元件與整合，非常適合快速原型設計與研究實驗。然而，當需要在生產中部署時，開發人員往往需要自行建立額外的層級，例如規則管理、合規性檢查和可靠性機制，以保持代理的一致性和可信度。</p>
<p>Parlant 提供內建的準則管理 (Guideline Management)、自我批評機制以及可解釋工具，協助開發人員管理代理程式的行為、回應與理由。這使得 Parlant 特別適用於高風險、面對客戶的使用個案，在這些使用個案中，準確性和責任非常重要，例如金融、醫療保健和法律服務。</p>
<p>事實上，這些框架可以一起運作：</p>
<ul>
<li><p>使用 LangChain 建立複雜的資料處理管道或檢索工作流程。</p></li>
<li><p>使用 Parlant 管理最後的互動層，確保輸出遵循業務規則，並保持可解釋。</p></li>
<li><p>使用 Milvus 作為向量資料庫的基礎，在整個系統中提供即時語意搜尋、記憶和知識檢索。</p></li>
</ul>
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
    </button></h2><p>當 LLM 代理從實驗走向生產時，關鍵問題不再是它們能做什麼，而是它們如何能可靠、安全地做到這一點。Parlant 提供結構與控制以達到可靠性，而 Milvus 則提供可擴充的向量基礎架構，以保持一切快速且具情境感知能力。</p>
<p>兩者相輔相成，讓開發人員可以建立不僅有能力，而且值得信賴、可解釋且可生產的 AI 代理。</p>
<p><a href="https://github.com/emcie-co/parlant?utm_source=chatgpt.com"> 在 GitHub 上</a>查看<a href="https://github.com/emcie-co/parlant?utm_source=chatgpt.com"> Parlant</a>，並將其與<a href="https://milvus.io"> Milvus</a>整合，建立您自己的智慧型規則驅動代理系統。</p>
<p>對任何功能有問題或想要深入瞭解？加入我們的<a href="https://discord.com/invite/8uyFbECzPX"> Discord 頻道</a>或在<a href="https://github.com/milvus-io/milvus"> GitHub</a> 上提出問題。您也可以透過<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus Office Hours</a> 預約 20 分鐘的一對一會議，以獲得深入的瞭解、指導和問題解答。</p>
