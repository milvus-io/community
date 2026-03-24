---
id: fix-rag-retrieval-errors-crag-langgraph-milvus.md
title: 使用 CRAG、LangGraph 和 Milvus 修正 RAG 檢索錯誤
author: Min Yin
date: 2026-3-23
cover: assets.zilliz.com/cover_CRAG_a05dddbaa2_aafaad6bc0.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'CRAG, RAG retrieval, LangGraph, Milvus, hybrid retrieval'
meta_title: |
  Fix RAG Retrieval Errors with CRAG, LangGraph, and Milvus
desc: 相似度高但答案錯誤？瞭解 CRAG 如何在 RAG 管道中加入評估與修正功能。使用 LangGraph + Milvus 建立生產就緒的系統。
origin: 'https://milvus.io/blog/fix-rag-retrieval-errors-crag-langgraph-milvus.md'
---
<p>隨著 LLM 應用程式投入生產，團隊越來越需要他們的模型來回答以私人資料或即時資訊為基礎的問題。<a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">檢索增量生成 (Retrieval-augmented generation</a>, RAG) - 即模型在查詢時從外部知識庫中提取 - 是標準的方法。它可以減少幻覺，並保持答案的即時性。</p>
<p>但在實際應用中，有個問題很快就浮現出來：<strong>文件的相似度可能很高，但對於問題來說仍然是完全錯誤的。</strong>傳統的 RAG 管道將相似度等同於相關性。在生產中，這個假設就會被打破。排名最前的結果可能已經過時、只與問題有切身關係，或是完全遺漏了使用者所需的細節。</p>
<p>CRAG (Corrective Retrieval-Augmented Generation) 透過在擷取與產生之間加入評估與修正來解決這個問題。系統不會盲目相信相似性分數，而是會檢查擷取的內容是否真的回答了問題，如果沒有回答問題，系統就會修正。</p>
<p>這篇文章將介紹如何使用 LangChain、LangGraph 和<a href="https://milvus.io/intro">Milvus</a> 來建立一個生產就緒的 CRAG 系統。</p>
<h2 id="Three-Retrieval-Problems-Traditional-RAG-Doesnt-Solve" class="common-anchor-header">傳統 RAG 無法解決的三個檢索問題<button data-href="#Three-Retrieval-Problems-Traditional-RAG-Doesnt-Solve" class="anchor-icon" translate="no">
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
    </button></h2><p>大多數 RAG 在生產上的失敗都可追溯至三個問題之一：</p>
<p><strong>檢索不匹配。</strong>該文件在主題上類似，但實際上沒有回答問題。如果詢問如何在 Nginx 中設定 HTTPS 證書，系統可能會回傳 Apache 設定指南、2019 解說或 TLS 工作原理的一般說明。語義上接近，實際上無用。</p>
<p><strong>陳舊的內容。</strong> <a href="https://zilliz.com/learn/vector-similarity-search">矢量搜尋沒有</a>陳舊的概念。查詢「Python async 最佳實務」，你會得到 2018 年模式和 2024 年模式的混合，純粹以嵌入距離排序。系統無法區分使用者真正需要的是哪一個。</p>
<p><strong>記憶體污染。</strong>這個問題會隨著時間複雜化，通常也是最難解決的問題。假設系統擷取過期的 API 參考資料，並產生不正確的程式碼。該錯誤的輸出會儲存在記憶體中。在下一次類似的查詢中，系統會再次擷取它，強化錯誤。陳舊的資訊和新鮮的資訊逐漸混合，系統的可靠性隨著每個週期而降低。</p>
<p>這些都不是小問題。一旦 RAG 系統處理真正的流量，它們就會經常出現。這就是為什麼檢索品質檢查是一種需求，而不是一種可有可无的東西。</p>
<h2 id="What-Is-CRAG-Evaluate-First-Then-Generate" class="common-anchor-header">什麼是 CRAG？先評估後產生<button data-href="#What-Is-CRAG-Evaluate-First-Then-Generate" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>糾正檢索-增強生成 (CRAG)</strong>是一種在 RAG 管道中的檢索和生成之間增加評估和糾正步驟的方法。它是在論文<a href="https://openreview.net/forum?id=JnWJbrnaUE"><em>Corrective Retrieval Augmented Generation</em></a>（Yan 等人，2024 年）中提出的。傳統的 RAG 會做出二元判斷 - 使用該文件或捨棄該文件 - 與此不同的是，RAG 會對每個檢索結果的相關性進行評分，並在它到達語言模型之前，將它通過三個修正路徑中的其中一個。</p>
<p>當檢索結果處於灰色地帶時，傳統的 RAG 就會陷入困境：部分相關、有些過時或缺少關鍵部分。簡單的 yes/no 閘門不是捨棄有用的部分資訊，就是讓嘈雜的內容通過。CRAG<strong>將檢索 → 產生的</strong>流程重組為<strong>檢索 → 評估 → 修正 → 產生</strong>，讓系統有機會在開始產生之前修正檢索品質。</p>
<p>
 <span class="img-wrapper">
   <img translate="no" src="https://assets.zilliz.com/fix_rag_retrieval_errors_crag_langgraph_milvus_1_11a820f454.png" alt="CRAG four-step workflow: Retrieval → Evaluation → Correction → Generation, showing how documents are scored and routed" class="doc-image" id="crag-four-step-workflow:-retrieval-→-evaluation-→-correction-→-generation,-showing-how-documents-are-scored-and-routed" />
   <span>CRAG 四步工作流程：檢索 → 評估 → 修正 → 產生，顯示文件如何被評分和路由</span> </span></p>
<p>擷取的結果可分為三類：</p>
<ul>
<li><strong>正確：</strong>直接回答查詢；輕微精煉後可用</li>
<li><strong>模糊：</strong>部分相關；需要補充資訊</li>
<li><strong>不正確：</strong>不相關；捨棄並回到其他來源</li>
</ul>
<table>
<thead>
<tr><th>決定</th><th>信心</th><th>行動</th></tr>
</thead>
<tbody>
<tr><td>正確</td><td>&gt; 0.9</td><td>完善文件內容</td></tr>
<tr><td>含糊不清</td><td>0.5-0.9</td><td>完善文件內容 + 網路搜尋補充</td></tr>
<tr><td>不正確</td><td>&lt; 0.5</td><td>捨棄檢索結果；完全使用網路搜尋</td></tr>
</tbody>
</table>
<h3 id="Content-Refinement" class="common-anchor-header">內容精煉</h3><p>CRAG 也解決了標準 RAG 的一個更微妙的問題：大多數系統都會將擷取到的完整文件餵給模型。這會浪費字元並稀釋信號 - 模型必須繞過不相干的段落，才能找到真正重要的一句話。CRAG 會先精煉擷取的內容，擷取相關的部分並刪除其他部分。</p>
<p>原論文使用知識帶和啟發式規則來達到此目的。實際上，關鍵字比對對許多使用個案都有效，而生產系統可以分層進行以 LLM 為基礎的摘要或結構化抽取，以獲得更高的品質。</p>
<p>精煉過程包含三個部分：</p>
<ul>
<li><strong>文件分解：</strong>從較長的文件中抽取關鍵段落</li>
<li><strong>查詢重寫：</strong>將模糊或含糊的查詢轉換為更有針對性的查詢</li>
<li><strong>知識選擇：</strong>重複、排序並只保留最有用的內容</li>
</ul>
<p>
 <span class="img-wrapper">
   <img translate="no" src="https://assets.zilliz.com/fix_rag_retrieval_errors_crag_langgraph_milvus_2_9ec4b6aa81.png" alt="The three-step document refinement process: Document Decomposition (2000 → 500 tokens), Query Rewriting (improved search precision), and Knowledge Selection (filter, rank, and trim)" class="doc-image" id="the-three-step-document-refinement-process:-document-decomposition-(2000-→-500-tokens),-query-rewriting-(improved-search-precision),-and-knowledge-selection-(filter,-rank,-and-trim)" />
   <span>三步式文件精煉流程：文件分解（2000 → 500 個字元）、查詢重寫（提高搜尋精確度）和知識選擇（過濾、排序和修剪）</span> </span></p>
<h3 id="The-Evaluator" class="common-anchor-header">評估器</h3><p>評估器是 CRAG 的核心。它不是用來進行深入推理的，而是一個快速的分流閘門。給定一個查詢和一組擷取的文件，它會決定這些內容是否足以使用。</p>
<p>原始論文選擇了微調的 T5-Large 模型，而非一般用途的 LLM。理由是：對於這項特殊任務而言，速度與精確度比靈活性更重要。</p>
<table>
<thead>
<tr><th>屬性</th><th>微調 T5-Large</th><th>GPT-4</th></tr>
</thead>
<tbody>
<tr><td>延遲</td><td>10-20 毫秒</td><td>200 毫秒以上</td></tr>
<tr><td>精確度</td><td>92% (紙本實驗)</td><td>待定</td></tr>
<tr><td>任務契合度</td><td>高 - 單一任務微調，精確度較高</td><td>中 - 通用、更靈活但專業性較低</td></tr>
</tbody>
</table>
<h3 id="Web-Search-Fallback" class="common-anchor-header">網路搜尋後備</h3><p>當內部檢索被標記為不正確或含糊不清時，CRAG 可以觸發網路搜尋，以取得較新或補充的資訊。對於時間敏感的查詢和內部知識庫存在缺口的主題，這可發揮安全網的作用。</p>
<h2 id="Why-Milvus-Is-a-Good-Fit-for-CRAG-in-Production" class="common-anchor-header">為什麼 Milvus 非常適合 CRAG 的生產？<button data-href="#Why-Milvus-Is-a-Good-Fit-for-CRAG-in-Production" class="anchor-icon" translate="no">
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
    </button></h2><p>CRAG 的有效性取決於它下面的東西。<a href="https://zilliz.com/learn/what-is-vector-database">向量資料庫</a>需要做的不僅僅是基本的相似性搜尋，還需要支援生產 CRAG 系統所要求的多租戶隔離、混合檢索和模式彈性。</p>
<p>在評估了多個選項之後，我們選擇了<a href="https://zilliz.com/what-is-milvus">Milvus</a>，原因有三。</p>
<h3 id="Multi-Tenant-Isolation" class="common-anchor-header">多租客隔離</h3><p>在以代理為基礎的系統中，每個使用者或會話都需要自己的記憶體空間。天真的方法--每個租戶一個集合--很快就會成為一個令人頭痛的作業問題，特別是在規模較大的情況下。</p>
<p>Milvus 使用<a href="https://milvus.io/docs/use-partition-key.md">Partition Key</a> 來處理這個問題。在<code translate="no">agent_id</code> 欄位上設定<code translate="no">is_partition_key=True</code> ，Milvus 就會自動將查詢路由到正確的分割區。沒有收集擴張，也沒有手動路由程式碼。</p>
<p>在我們跨 100 個租戶、擁有 1 千萬向量的基準測試中，Milvus 搭配 Clustering Compaction 的<strong>QPS</strong>較未最佳化的基準<strong>高出 3 至 5 倍</strong>。</p>
<h3 id="Hybrid-Retrieval" class="common-anchor-header">混合式擷取</h3><p>純向量搜尋在精確匹配的內容-產品 SKU（如<code translate="no">SKU-2024-X5</code> 、版本字串或特定術語）方面有不足之處。</p>
<p>Milvus 2.5 原生支援<a href="https://milvus.io/docs/multi-vector-search.md">混合式擷取</a>：稠密向量用於語意相似性、稀疏向量用於 BM25 類型的關鍵字比對，以及標量元資料篩選 - 全部都在一次查詢中完成。結果使用 Reciprocal Rank Fusion (RRF) 融合，因此您不需要建立和合併獨立的檢索管道。</p>
<p>在 100 萬向量的資料集上，Milvus Sparse-BM25 的擷取延遲時間為<strong>6 毫秒</strong>，對端對端 CRAG 效能的影響微乎其微。</p>
<h3 id="Flexible-Schema-for-Evolving-Memory" class="common-anchor-header">適用於不斷演進記憶體的彈性模式</h3><p>隨著 CRAG 管道的成熟，資料模型也隨之演化。我們需要在迭代評估邏輯的同時，新增<code translate="no">confidence</code> 、<code translate="no">verified</code> 和<code translate="no">source</code> 等欄位。在大多數資料庫中，這意味著遷移腳本和停機時間。</p>
<p>Milvus 支援動態 JSON 欄位，因此可以在不中斷服務的情況下隨時擴充元資料。</p>
<p>以下是一個典型的模式：</p>
<pre><code translate="no" class="language-python">fields = [
    FieldSchema(name=<span class="hljs-string">&quot;agent_id&quot;</span>, dtype=DataType.VARCHAR, is_partition_key=<span class="hljs-literal">True</span>),  <span class="hljs-comment"># multi-tenancy</span>
    FieldSchema(name=<span class="hljs-string">&quot;dense_embedding&quot;</span>, dtype=DataType.FLOAT_VECTOR, dim=<span class="hljs-number">1536</span>),   <span class="hljs-comment"># semantic retrieval</span>
    FieldSchema(name=<span class="hljs-string">&quot;sparse_embedding&quot;</span>, dtype=DataType.SPARSE_FLOAT_VECTOR),<span class="hljs-comment"># BM25</span>
    FieldSchema(name=<span class="hljs-string">&quot;metadata&quot;</span>, dtype=DataType.JSON),<span class="hljs-comment"># dynamic schema</span>
]

<span class="hljs-comment"># hybrid retrieval + metadata filtering</span>
results = collection.hybrid_search(
    reqs=[
        AnnSearchRequest(data=[dense_vec], anns_field=<span class="hljs-string">&quot;dense_embedding&quot;</span>, limit=<span class="hljs-number">20</span>),
        AnnSearchRequest(data=[sparse_vec], anns_field=<span class="hljs-string">&quot;sparse_embedding&quot;</span>, limit=<span class="hljs-number">20</span>)
    ],
    rerank=RRFRanker(),
    output_fields=[<span class="hljs-string">&quot;metadata&quot;</span>],
    expr=<span class="hljs-string">&#x27;metadata[&quot;confidence&quot;] &gt; 0.9&#x27;</span>,<span class="hljs-comment"># CRAG confidence filtering</span>
    limit=<span class="hljs-number">5</span>
)
<button class="copy-code-btn"></button></code></pre>
<p>Milvus 也簡化了部署擴充。它提供<a href="https://milvus.io/docs/install-overview.md">Lite、Standalone 和 Distributed 模式</a>，這些<a href="https://milvus.io/docs/install-overview.md">模式</a>與程式碼相容，從本機開發轉換到生產叢集只需變更連線字串。</p>
<h2 id="Hands-On-Build-a-CRAG-System-with-LangGraph-Middleware-and-Milvus" class="common-anchor-header">上手操作：使用 LangGraph 中介軟體和 Milvus 建立 CRAG 系統<button data-href="#Hands-On-Build-a-CRAG-System-with-LangGraph-Middleware-and-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Why-the-Middleware-Approach" class="common-anchor-header">為什麼使用中間件？</h3><p>使用 LangGraph 建構 CRAG 的常見方式，是將控制每一步驟的節點和邊緣連接成一個狀態圖。這種方法可行，但隨著複雜度的增加，圖形會變得糾結，調試也變得很頭痛。</p>
<p>我們決定採用 LangGraph 1.0 中的<strong>Middleware 模式</strong>。它在模型呼叫之前攔截請求，因此擷取、評估和修正都在同一個地方處理。與狀態圖方式相比</p>
<ul>
<li><strong>程式碼更少：</strong>邏輯是集中的，而不是分散在圖表節點上</li>
<li><strong>更容易遵循：</strong>控制流程以線性方式讀取</li>
<li><strong>更容易除錯：</strong>故障指向單一位置，而非圖形遍歷</li>
</ul>
<h3 id="Core-Workflow" class="common-anchor-header">核心工作流程</h3><p>管道分四個步驟執行</p>
<ol>
<li><strong>擷取：</strong>從 Milvus<strong>擷取</strong>前 3 個相關的文件，範圍涵蓋目前的租戶</li>
<li><strong>評估：</strong>使用輕量級模型評估文件品質</li>
<li><strong>修正：</strong>根據判定結果進行改進、使用網路搜尋補充或完全回退</li>
<li><strong>注入：</strong>透過動態系統提示，將完成的上下文傳送至模型</li>
</ol>
<h3 id="Environment-Setup-and-Data-Preparation" class="common-anchor-header">環境設定與資料準備</h3><p><strong>環境變數</strong></p>
<pre><code translate="no" class="language-bash"><span class="hljs-keyword">export</span> <span class="hljs-variable constant_">OPENAI_API_KEY</span>=<span class="hljs-string">&quot;your-api-key&quot;</span>
<span class="hljs-keyword">export</span> <span class="hljs-variable constant_">TAVILY_API_KEY</span>=<span class="hljs-string">&quot;your-tavily-key&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>建立 Milvus 套件</strong></p>
<p>在執行程式碼之前，請在 Milvus 中建立一個具有符合擷取邏輯的模式的集合。</p>
<pre><code translate="no" class="language-python"><span class="hljs-comment"># filename: crag_agent.py</span>

<span class="hljs-comment"># ============ Import dependencies ============</span>
<span class="hljs-keyword">from</span> typing <span class="hljs-keyword">import</span> <span class="hljs-type">Literal</span>, <span class="hljs-type">List</span>
<span class="hljs-keyword">from</span> langchain.agents <span class="hljs-keyword">import</span> create_agent
<span class="hljs-keyword">from</span> langchain.agents.middleware <span class="hljs-keyword">import</span> AgentMiddleware, before_model, dynamic_prompt
<span class="hljs-keyword">from</span> langchain.chat_models <span class="hljs-keyword">import</span> init_chat_model
<span class="hljs-keyword">from</span> langchain_milvus <span class="hljs-keyword">import</span> Milvus
<span class="hljs-keyword">from</span> langchain_openai <span class="hljs-keyword">import</span> OpenAIEmbeddings
<span class="hljs-keyword">from</span> langchain_core.documents <span class="hljs-keyword">import</span> Document
<span class="hljs-keyword">from</span> langchain_core.messages <span class="hljs-keyword">import</span> SystemMessage, HumanMessage
<span class="hljs-keyword">from</span> langchain_community.tools.tavily_search <span class="hljs-keyword">import</span> TavilySearchResults


<span class="hljs-comment"># ============ CRAG Middleware (minimal-change version) ============</span>
<span class="hljs-keyword">class</span> <span class="hljs-title class_">CRAGMiddleware</span>(<span class="hljs-title class_ inherited__">AgentMiddleware</span>):
    <span class="hljs-string">&quot;&quot;&quot;CRAG evaluation and correction middleware (uses official decorator-based hooks to avoid permanently polluting the message stack)&quot;&quot;&quot;</span>

    <span class="hljs-keyword">def</span> <span class="hljs-title function_">__init__</span>(<span class="hljs-params">self, vector_store: Milvus, agent_id: <span class="hljs-built_in">str</span></span>):
        <span class="hljs-built_in">super</span>().__init__()
        <span class="hljs-variable language_">self</span>.vector_store = vector_store
        <span class="hljs-variable language_">self</span>.agent_id = agent_id  <span class="hljs-comment"># multi-tenant isolation</span>
        <span class="hljs-comment"># Lightweight evaluator: used for relevance judgment (can be replaced with the structured version introduced later)</span>
        <span class="hljs-variable language_">self</span>.evaluator = init_chat_model(<span class="hljs-string">&quot;openai:gpt-4o-mini&quot;</span>, temperature=<span class="hljs-number">0</span>)
        <span class="hljs-comment"># Web search fallback</span>
        <span class="hljs-variable language_">self</span>.web_search = TavilySearchResults(max_results=<span class="hljs-number">3</span>)

<span class="hljs-meta">    @before_model</span>
    <span class="hljs-keyword">def</span> <span class="hljs-title function_">run_crag</span>(<span class="hljs-params">self, state</span>):
        <span class="hljs-string">&quot;&quot;&quot;Run retrieval -&gt; evaluation -&gt; correction before model invocation and prepare the final context&quot;&quot;&quot;</span>
        <span class="hljs-comment"># Get the last user message</span>
        last_msg = state[<span class="hljs-string">&quot;messages&quot;</span>][-<span class="hljs-number">1</span>]
        query = <span class="hljs-built_in">getattr</span>(last_msg, <span class="hljs-string">&quot;content&quot;</span>, <span class="hljs-string">&quot;&quot;</span>) <span class="hljs-keyword">if</span> <span class="hljs-built_in">hasattr</span>(last_msg, <span class="hljs-string">&quot;content&quot;</span>) <span class="hljs-keyword">else</span> last_msg.get(<span class="hljs-string">&quot;content&quot;</span>, <span class="hljs-string">&quot;&quot;</span>)

        <span class="hljs-comment"># 1. Retrieval: get documents from Milvus (PartitionKey + confidence filtering)</span>
        docs = <span class="hljs-variable language_">self</span>._retrieve_from_milvus(query)

        <span class="hljs-comment"># 2. Evaluation: three-way decision</span>
        verdict = <span class="hljs-variable language_">self</span>._evaluate_relevance(query, docs)

        <span class="hljs-comment"># 3. Correction: choose the handling strategy based on the verdict</span>
        <span class="hljs-keyword">if</span> verdict == <span class="hljs-string">&quot;incorrect&quot;</span>:
            <span class="hljs-comment"># Retrieval failed, rely entirely on Web search</span>
            web_results = <span class="hljs-variable language_">self</span>._web_search_fallback(query)
            final_context = <span class="hljs-variable language_">self</span>._format_web_results(web_results)
        <span class="hljs-keyword">elif</span> verdict == <span class="hljs-string">&quot;ambiguous&quot;</span>:
            <span class="hljs-comment"># Retrieval is ambiguous, refine documents + supplement with Web search</span>
            refined_docs = <span class="hljs-variable language_">self</span>._refine_documents(docs, query)
            web_results = <span class="hljs-variable language_">self</span>._web_search_fallback(query)
            final_context = <span class="hljs-variable language_">self</span>._merge_context(refined_docs, web_results)
        <span class="hljs-keyword">else</span>:
            <span class="hljs-comment"># Retrieval quality is good, only refine the documents</span>
            refined_docs = <span class="hljs-variable language_">self</span>._refine_documents(docs, query)
            final_context = <span class="hljs-variable language_">self</span>._format_internal_docs(refined_docs)

        <span class="hljs-comment"># 4. Put the context into a temporary key, used only for dynamic prompt assembly in the current model call</span>
        state[<span class="hljs-string">&quot;_crag_context&quot;</span>] = final_context
        <span class="hljs-keyword">return</span> state

<span class="hljs-meta">    @dynamic_prompt</span>
    <span class="hljs-keyword">def</span> <span class="hljs-title function_">attach_context</span>(<span class="hljs-params">self, state, prompt_messages: <span class="hljs-type">List</span></span>):
        <span class="hljs-string">&quot;&quot;&quot;Inject the CRAG-generated context as a SystemMessage before the prompt for the current model call&quot;&quot;&quot;</span>
        final_context = state.get(<span class="hljs-string">&quot;_crag_context&quot;</span>)
        <span class="hljs-keyword">if</span> final_context:
            sys_msg = SystemMessage(
                content=<span class="hljs-string">f&quot;Here is some relevant background information. Please answer the user&#x27;s question based on this information:\n\n<span class="hljs-subst">{final_context}</span>&quot;</span>
            )
            <span class="hljs-comment"># Applies only to the current call and is not permanently written into state[&quot;messages&quot;]</span>
            prompt_messages = [sys_msg] + prompt_messages
        <span class="hljs-keyword">return</span> prompt_messages

    <span class="hljs-comment"># ======== Internal methods: retrieval / evaluation / refinement / formatting ========</span>

    <span class="hljs-keyword">def</span> <span class="hljs-title function_">_retrieve_from_milvus</span>(<span class="hljs-params">self, query: <span class="hljs-built_in">str</span></span>) -&gt; <span class="hljs-built_in">list</span>:
        <span class="hljs-string">&quot;&quot;&quot;Retrieve documents from Milvus (Partition Key + confidence filtering)&quot;&quot;&quot;</span>
        <span class="hljs-keyword">try</span>:
            <span class="hljs-comment"># Note: different adapter versions may place filter parameters differently; here expr is passed through search_kwargs</span>
            docs = <span class="hljs-variable language_">self</span>.vector_store.similarity_search(
                query,
                k=<span class="hljs-number">3</span>,
                search_kwargs={<span class="hljs-string">&quot;expr&quot;</span>: <span class="hljs-string">f&#x27;agent_id == &quot;<span class="hljs-subst">{self.agent_id}</span>&quot;&#x27;</span>}
            )
            <span class="hljs-comment"># Confidence filtering (to avoid low-quality memory contamination)</span>
            filtered_docs = [
                doc <span class="hljs-keyword">for</span> doc <span class="hljs-keyword">in</span> docs
                <span class="hljs-keyword">if</span> (doc.metadata <span class="hljs-keyword">or</span> {}).get(<span class="hljs-string">&quot;confidence&quot;</span>, <span class="hljs-number">0.0</span>) &gt; <span class="hljs-number">0.7</span>
            ]
            <span class="hljs-keyword">return</span> filtered_docs <span class="hljs-keyword">or</span> docs  <span class="hljs-comment"># If there are no high-confidence results, fall back to the original results for evaluator judgment</span>
        <span class="hljs-keyword">except</span> Exception <span class="hljs-keyword">as</span> e:
            <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[CRAG] Retrieval failed: <span class="hljs-subst">{e}</span>&quot;</span>)
            <span class="hljs-keyword">return</span> []

    <span class="hljs-keyword">def</span> <span class="hljs-title function_">_evaluate_relevance</span>(<span class="hljs-params">self, query: <span class="hljs-built_in">str</span>, docs: <span class="hljs-built_in">list</span></span>) -&gt; <span class="hljs-type">Literal</span>[<span class="hljs-string">&quot;relevant&quot;</span>, <span class="hljs-string">&quot;ambiguous&quot;</span>, <span class="hljs-string">&quot;incorrect&quot;</span>]:
        <span class="hljs-string">&quot;&quot;&quot;Evaluate document relevance (three-way decision), simplified version: the LLM returns the verdict directly&quot;&quot;&quot;</span>
        <span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> docs:
            <span class="hljs-keyword">return</span> <span class="hljs-string">&quot;incorrect&quot;</span>

        <span class="hljs-comment"># Evaluate only the Top-3 documents, taking the first 500 characters of each</span>
        doc_content = <span class="hljs-string">&quot;\n\n&quot;</span>.join([
            <span class="hljs-string">f&quot;[Document <span class="hljs-subst">{i+<span class="hljs-number">1</span>}</span>] <span class="hljs-subst">{(doc.page_content <span class="hljs-keyword">or</span> <span class="hljs-string">&#x27;&#x27;</span>)[:<span class="hljs-number">500</span>]}</span>...&quot;</span>
            <span class="hljs-keyword">for</span> i, doc <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(docs[:<span class="hljs-number">3</span>])
        ])

        prompt = <span class="hljs-string">f&quot;&quot;&quot;You are an expert in document relevance evaluation. Assess whether the following documents can answer the query.

Query: <span class="hljs-subst">{query}</span>

Document content:
<span class="hljs-subst">{doc_content}</span>

Evaluation criteria:
- relevant: the document directly contains the answer and is highly relevant
- ambiguous: the document is partially relevant and needs external knowledge
- incorrect: the document is irrelevant and cannot answer the query

Return only one word: relevant or ambiguous or incorrect
&quot;&quot;&quot;</span>
        <span class="hljs-keyword">try</span>:
            result = <span class="hljs-variable language_">self</span>.evaluator.invoke(prompt)
            verdict = (<span class="hljs-built_in">getattr</span>(result, <span class="hljs-string">&quot;content&quot;</span>, <span class="hljs-string">&quot;&quot;</span>) <span class="hljs-keyword">or</span> <span class="hljs-string">&quot;&quot;</span>).strip().lower()
            <span class="hljs-keyword">if</span> verdict <span class="hljs-keyword">not</span> <span class="hljs-keyword">in</span> {<span class="hljs-string">&quot;relevant&quot;</span>, <span class="hljs-string">&quot;ambiguous&quot;</span>, <span class="hljs-string">&quot;incorrect&quot;</span>}:
                verdict = <span class="hljs-string">&quot;ambiguous&quot;</span>
            <span class="hljs-keyword">return</span> verdict
        <span class="hljs-keyword">except</span> Exception <span class="hljs-keyword">as</span> e:
            <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[CRAG] Evaluation failed: <span class="hljs-subst">{e}</span>&quot;</span>)
            <span class="hljs-keyword">return</span> <span class="hljs-string">&quot;ambiguous&quot;</span>

    <span class="hljs-keyword">def</span> <span class="hljs-title function_">_refine_documents</span>(<span class="hljs-params">self, docs: <span class="hljs-built_in">list</span>, query: <span class="hljs-built_in">str</span></span>) -&gt; <span class="hljs-built_in">list</span>:
        <span class="hljs-string">&quot;&quot;&quot;Refine documents (simplified strips: sentence filtering based on keywords)&quot;&quot;&quot;</span>
        refined = []
        <span class="hljs-comment"># Simple Chinese-period replacement + rough English sentence splitting</span>
        keywords = [kw.strip() <span class="hljs-keyword">for</span> kw <span class="hljs-keyword">in</span> query.split() <span class="hljs-keyword">if</span> kw.strip()]

        <span class="hljs-keyword">for</span> doc <span class="hljs-keyword">in</span> docs:
            text = doc.page_content <span class="hljs-keyword">or</span> <span class="hljs-string">&quot;&quot;</span>
            sentences = (
                text.replace(<span class="hljs-string">&quot;。&quot;</span>, <span class="hljs-string">&quot;。\n&quot;</span>)
                    .replace(<span class="hljs-string">&quot;. &quot;</span>, <span class="hljs-string">&quot;.\n&quot;</span>)
                    .replace(<span class="hljs-string">&quot;! &quot;</span>, <span class="hljs-string">&quot;!\n&quot;</span>)
                    .replace(<span class="hljs-string">&quot;? &quot;</span>, <span class="hljs-string">&quot;?\n&quot;</span>)
                    .split(<span class="hljs-string">&quot;\n&quot;</span>)
            )
            sentences = [s.strip() <span class="hljs-keyword">for</span> s <span class="hljs-keyword">in</span> sentences <span class="hljs-keyword">if</span> s.strip()]

            <span class="hljs-comment"># Match any keyword</span>
            relevant_sentences = [
                s <span class="hljs-keyword">for</span> s <span class="hljs-keyword">in</span> sentences
                <span class="hljs-keyword">if</span> <span class="hljs-built_in">any</span>(keyword <span class="hljs-keyword">in</span> s <span class="hljs-keyword">for</span> keyword <span class="hljs-keyword">in</span> keywords)
            ]

            <span class="hljs-keyword">if</span> relevant_sentences:
                refined_text = <span class="hljs-string">&quot;。&quot;</span>.join(relevant_sentences[:<span class="hljs-number">3</span>])
                refined.append(Document(page_content=refined_text, metadata=doc.metadata <span class="hljs-keyword">or</span> {}))

        <span class="hljs-keyword">return</span> refined <span class="hljs-keyword">if</span> refined <span class="hljs-keyword">else</span> docs  <span class="hljs-comment"># If nothing is extracted, fall back to the original documents</span>

    <span class="hljs-keyword">def</span> <span class="hljs-title function_">_web_search_fallback</span>(<span class="hljs-params">self, query: <span class="hljs-built_in">str</span></span>) -&gt; <span class="hljs-built_in">list</span>:
        <span class="hljs-string">&quot;&quot;&quot;Web search fallback&quot;&quot;&quot;</span>
        <span class="hljs-keyword">try</span>:
            <span class="hljs-keyword">return</span> <span class="hljs-variable language_">self</span>.web_search.invoke(query) <span class="hljs-keyword">or</span> []
        <span class="hljs-keyword">except</span> Exception <span class="hljs-keyword">as</span> e:
            <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[CRAG] Web search failed: <span class="hljs-subst">{e}</span>&quot;</span>)
            <span class="hljs-keyword">return</span> []

    <span class="hljs-keyword">def</span> <span class="hljs-title function_">_merge_context</span>(<span class="hljs-params">self, internal_docs: <span class="hljs-built_in">list</span>, web_results: <span class="hljs-built_in">list</span></span>) -&gt; <span class="hljs-built_in">str</span>:
        <span class="hljs-string">&quot;&quot;&quot;Merge internal memory and external knowledge into the final context&quot;&quot;&quot;</span>
        parts = []
        <span class="hljs-keyword">if</span> internal_docs:
            parts.append(<span class="hljs-string">&quot;[Internal Memory]&quot;</span>)
            <span class="hljs-keyword">for</span> i, doc <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(internal_docs, <span class="hljs-number">1</span>):
                parts.append(<span class="hljs-string">f&quot;<span class="hljs-subst">{i}</span>. <span class="hljs-subst">{doc.page_content}</span>&quot;</span>)
        <span class="hljs-keyword">if</span> web_results:
            parts.append(<span class="hljs-string">&quot;[External Knowledge]&quot;</span>)
            <span class="hljs-keyword">for</span> i, result <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(web_results, <span class="hljs-number">1</span>):
                content = (result <span class="hljs-keyword">or</span> {}).get(<span class="hljs-string">&quot;content&quot;</span>, <span class="hljs-string">&quot;&quot;</span>)
                url = (result <span class="hljs-keyword">or</span> {}).get(<span class="hljs-string">&quot;url&quot;</span>, <span class="hljs-string">&quot;&quot;</span>)
                parts.append(<span class="hljs-string">f&quot;<span class="hljs-subst">{i}</span>. <span class="hljs-subst">{content}</span>\n   Source: <span class="hljs-subst">{url}</span>&quot;</span>)
        <span class="hljs-keyword">return</span> <span class="hljs-string">&quot;\n\n&quot;</span>.join(parts) <span class="hljs-keyword">if</span> parts <span class="hljs-keyword">else</span> <span class="hljs-string">&quot;No relevant information found&quot;</span>

    <span class="hljs-keyword">def</span> <span class="hljs-title function_">_format_internal_docs</span>(<span class="hljs-params">self, docs: <span class="hljs-built_in">list</span></span>) -&gt; <span class="hljs-built_in">str</span>:
        <span class="hljs-string">&quot;&quot;&quot;Format internal documents&quot;&quot;&quot;</span>
        <span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> docs:
            <span class="hljs-keyword">return</span> <span class="hljs-string">&quot;No relevant information found&quot;</span>
        parts = [<span class="hljs-string">&quot;[Internal Memory]&quot;</span>]
        <span class="hljs-keyword">for</span> i, doc <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(docs, <span class="hljs-number">1</span>):
            parts.append(<span class="hljs-string">f&quot;<span class="hljs-subst">{i}</span>. <span class="hljs-subst">{doc.page_content}</span>&quot;</span>)
        <span class="hljs-keyword">return</span> <span class="hljs-string">&quot;\n\n&quot;</span>.join(parts)

    <span class="hljs-keyword">def</span> <span class="hljs-title function_">_format_web_results</span>(<span class="hljs-params">self, results: <span class="hljs-built_in">list</span></span>) -&gt; <span class="hljs-built_in">str</span>:
        <span class="hljs-string">&quot;&quot;&quot;Format Web search results&quot;&quot;&quot;</span>
        <span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> results:
            <span class="hljs-keyword">return</span> <span class="hljs-string">&quot;No relevant information found&quot;</span>
        parts = [<span class="hljs-string">&quot;[External Knowledge]&quot;</span>]
        <span class="hljs-keyword">for</span> i, result <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(results, <span class="hljs-number">1</span>):
            content = (result <span class="hljs-keyword">or</span> {}).get(<span class="hljs-string">&quot;content&quot;</span>, <span class="hljs-string">&quot;&quot;</span>)
            url = (result <span class="hljs-keyword">or</span> {}).get(<span class="hljs-string">&quot;url&quot;</span>, <span class="hljs-string">&quot;&quot;</span>)
            parts.append(<span class="hljs-string">f&quot;<span class="hljs-subst">{i}</span>. <span class="hljs-subst">{content}</span>\n   Source: <span class="hljs-subst">{url}</span>&quot;</span>)
        <span class="hljs-keyword">return</span> <span class="hljs-string">&quot;\n\n&quot;</span>.join(parts)


<span class="hljs-comment"># ============ Initialize the Milvus vector database ============</span>
vector_store = Milvus(
    embedding_function=OpenAIEmbeddings(),
    connection_args={<span class="hljs-string">&quot;host&quot;</span>: <span class="hljs-string">&quot;localhost&quot;</span>, <span class="hljs-string">&quot;port&quot;</span>: <span class="hljs-string">&quot;19530&quot;</span>},
    collection_name=<span class="hljs-string">&quot;agent_memory&quot;</span>
)

<span class="hljs-comment"># ============ Create Agent ============</span>
agent = create_agent(
    model=<span class="hljs-string">&quot;openai:gpt-4o&quot;</span>,
    tools=[TavilySearchResults(max_results=<span class="hljs-number">3</span>)],  <span class="hljs-comment"># Web search tool</span>
    middleware=[
        CRAGMiddleware(
            vector_store=vector_store,
            agent_id=<span class="hljs-string">&quot;user_123_session_456&quot;</span>  <span class="hljs-comment"># multi-tenant isolation: each Agent instance uses its own ID</span>
        )
    ]
)

<span class="hljs-comment"># ============ Example run ============</span>
<span class="hljs-keyword">if</span> __name__ == <span class="hljs-string">&quot;__main__&quot;</span>:
    <span class="hljs-comment"># Example query: use HumanMessage to ensure compatibility</span>
    response = agent.invoke({
        <span class="hljs-string">&quot;messages&quot;</span>: [
            HumanMessage(content=<span class="hljs-string">&quot;What were the operating expenses in Nike&#x27;s latest quarterly earnings report?&quot;</span>)
        ]
    })
    <span class="hljs-built_in">print</span>(response[<span class="hljs-string">&quot;messages&quot;</span>][-<span class="hljs-number">1</span>].content)
<button class="copy-code-btn"></button></code></pre>
<blockquote>
<p><strong>版本注意事項：</strong>本程式碼使用 LangGraph 與 LangChain 中最新的中介軟體功能。這些 API 可能會隨著框架的演進而改變-請檢查<a href="https://langchain-ai.github.io/langgraph/">LangGraph 文件</a>以取得最新的用法。</p>
</blockquote>
<h3 id="Key-Modules" class="common-anchor-header">關鍵模組</h3><p><strong>1.生產級評估器設計</strong></p>
<p>上面程式碼中的<code translate="no">_evaluate_relevance()</code> 方法是為了快速測試而刻意簡化的。對於生產級，您需要結構化的輸出，並具備置信度評分和可解釋性：</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> pydantic <span class="hljs-keyword">import</span> BaseModel
<span class="hljs-keyword">from</span> langchain.prompts <span class="hljs-keyword">import</span> PromptTemplate

<span class="hljs-keyword">class</span> <span class="hljs-title class_">RelevanceVerdict</span>(<span class="hljs-title class_ inherited__">BaseModel</span>):
    <span class="hljs-string">&quot;&quot;&quot;Structured output for the evaluation result&quot;&quot;&quot;</span>
    verdict: <span class="hljs-type">Literal</span>[<span class="hljs-string">&quot;relevant&quot;</span>, <span class="hljs-string">&quot;ambiguous&quot;</span>, <span class="hljs-string">&quot;incorrect&quot;</span>]
    confidence: <span class="hljs-built_in">float</span>  <span class="hljs-comment"># confidence score (used for memory quality monitoring)</span>
    reasoning: <span class="hljs-built_in">str</span>     <span class="hljs-comment"># reason for the judgment (used for debugging and review)</span>

<span class="hljs-comment"># Note: the CRAG paper uses a fine-tuned T5-Large evaluator (10-20 ms latency)</span>
<span class="hljs-comment"># Here, gpt-4o-mini is used as the engineering implementation option (easier to deploy, but with slightly higher latency)</span>
grader_llm = ChatOpenAI(model=<span class="hljs-string">&quot;gpt-4o-mini&quot;</span>, temperature=<span class="hljs-number">0</span>)

grader_prompt = PromptTemplate(
    template=<span class="hljs-string">&quot;&quot;&quot;You are an expert in document relevance evaluation. Assess whether the following documents can answer the query.

Query: {query}

Document content:
{document}

Evaluation criteria:
- relevant: the document directly contains the answer, confidence &gt; 0.9
- ambiguous: the document is partially relevant, confidence 0.5-0.9
- incorrect: the document is irrelevant, confidence &lt; 0.5

Return in JSON format: {{&quot;verdict&quot;: &quot;...&quot;, &quot;confidence&quot;: 0.xx, &quot;reasoning&quot;: &quot;...&quot;}}
&quot;&quot;&quot;</span>,
    input_variables=[<span class="hljs-string">&quot;query&quot;</span>, <span class="hljs-string">&quot;document&quot;</span>]
)

grader_chain = grader_prompt | grader_llm.with_structured_output(RelevanceVerdict)

<span class="hljs-comment"># Replace the _evaluate_relevance() method in CRAGMiddleware</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">_evaluate_relevance</span>(<span class="hljs-params">self, query: <span class="hljs-built_in">str</span>, docs: <span class="hljs-built_in">list</span></span>) -&gt; <span class="hljs-type">Literal</span>[<span class="hljs-string">&quot;relevant&quot;</span>, <span class="hljs-string">&quot;ambiguous&quot;</span>, <span class="hljs-string">&quot;incorrect&quot;</span>]:
    <span class="hljs-string">&quot;&quot;&quot;Evaluate document relevance (returns structured result)&quot;&quot;&quot;</span>
    <span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> docs:
        <span class="hljs-keyword">return</span> <span class="hljs-string">&quot;incorrect&quot;</span>

    <span class="hljs-comment"># Evaluate only the Top-3 documents, taking the first 500 characters of each</span>
    doc_content = <span class="hljs-string">&quot;\n\n&quot;</span>.join([
        <span class="hljs-string">f&quot;[Document <span class="hljs-subst">{i+<span class="hljs-number">1</span>}</span>] <span class="hljs-subst">{doc.page_content[:<span class="hljs-number">500</span>]}</span>...&quot;</span>
        <span class="hljs-keyword">for</span> i, doc <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(docs[:<span class="hljs-number">3</span>])
    ])

    result = grader_chain.invoke({
        <span class="hljs-string">&quot;query&quot;</span>: query,
        <span class="hljs-string">&quot;document&quot;</span>: doc_content
    })

    <span class="hljs-comment"># Store the confidence score in logs or a monitoring system</span>
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[CRAG Evaluation] verdict=<span class="hljs-subst">{result.verdict}</span>, confidence=<span class="hljs-subst">{result.confidence:<span class="hljs-number">.2</span>f}</span>&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[CRAG Reasoning] <span class="hljs-subst">{result.reasoning}</span>&quot;</span>)

    <span class="hljs-comment"># Optional: store the evaluation result in Milvus for memory quality analysis</span>
    <span class="hljs-variable language_">self</span>._store_evaluation_metrics(query, result)

    <span class="hljs-keyword">return</span> result.verdict

<span class="hljs-keyword">def</span> <span class="hljs-title function_">_store_evaluation_metrics</span>(<span class="hljs-params">self, query: <span class="hljs-built_in">str</span>, verdict_result: RelevanceVerdict</span>):
    <span class="hljs-string">&quot;&quot;&quot;Store evaluation metrics in Milvus (for memory quality monitoring)&quot;&quot;&quot;</span>
    <span class="hljs-comment"># Example: store the evaluation result in a separate Collection for analysis</span>
    <span class="hljs-comment"># In actual use, you need to create the evaluation_metrics Collection</span>
    <span class="hljs-keyword">pass</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>2.知識精煉和回退</strong></p>
<p>三種機制共同作用以保持模型上下文的高品質：</p>
<ul>
<li><strong>知識精煉</strong>會擷取與查詢最相關的句子，並去除雜訊。</li>
<li>當本地檢索不足時，會<strong>啟動後備搜尋</strong>，透過 Tavily 擷取外部知識。</li>
<li><strong>上下文合併</strong>將內部記憶體與外部結果合併為單一的、重複的上下文區塊，然後再傳送至模型。</li>
</ul>
<h2 id="Tips-for-Running-CRAG-in-Production" class="common-anchor-header">在生產中運行 CRAG 的提示<button data-href="#Tips-for-Running-CRAG-in-Production" class="anchor-icon" translate="no">
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
    </button></h2><p>一旦超越原型設計，有三個方面最重要。</p>
<h3 id="1-Cost-Pick-the-Right-Evaluator" class="common-anchor-header">1.成本：選擇正確的評估器</h3><p>評估器會在每個查詢上執行，因此是延遲和成本的最大槓桿。</p>
<ul>
<li><strong>高併發工作負載：</strong>像 T5-Large 這種經過微調的輕量級模型，可以將延遲維持在 10 到 20 毫秒，而且成本可以預測。</li>
<li><strong>低流量或原型：</strong> <code translate="no">gpt-4o-mini</code> 之類的託管機型設定速度較快，需要的作業也較少，但延遲和每次呼叫成本較高。</li>
</ul>
<h3 id="2-Observability-Instrument-from-Day-One" class="common-anchor-header">2.可觀察性：從第一天開始儀器</h3><p>最難處理的生產問題是您在答覆品質下降前無法察覺的問題。</p>
<ul>
<li><strong>基礎結構監控：</strong>Milvus 與<a href="https://milvus.io/docs/monitor_overview.md">Prometheus</a> 整合。從三個指標開始：<code translate="no">milvus_query_latency_seconds</code>,<code translate="no">milvus_search_qps</code>, 和<code translate="no">milvus_insert_throughput</code> 。</li>
<li><strong>應用程式監控：</strong>追蹤 CRAG 判決分佈、網路搜尋觸發率和信心分數分佈。如果沒有這些訊號，您就無法判斷品質下降是由於不良的檢索或評估人員的錯誤判斷所造成。</li>
</ul>
<h3 id="3-Long-Term-Maintenance-Prevent-Memory-Contamination" class="common-anchor-header">3.長期維護：防止記憶體污染</h3><p>代理程式執行的時間越長，記憶體中累積的陳舊和低品質資料就越多。及早設定防護措施：</p>
<ul>
<li><strong>預先過濾：</strong>只浮現<code translate="no">confidence &gt; 0.7</code> 的記憶體，讓低品質的內容在到達評估器前就被攔截。</li>
<li><strong>時間衰減：</strong>逐漸降低較舊記憶體的權重。30 天是一個合理的預設起始時間，可依使用情況調整。</li>
<li><strong>排程清理：</strong>每週執行一次工作，清除舊的、低可信度、未經驗證的記憶。這可防止陳舊資料被擷取、使用、再儲存的回饋循環。</li>
</ul>
<h2 id="Wrapping-Up--and-a-Few-Common-Questions" class="common-anchor-header">總結 - 以及一些常見問題<button data-href="#Wrapping-Up--and-a-Few-Common-Questions" class="anchor-icon" translate="no">
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
    </button></h2><p>CRAG 可解決生產 RAG 最常見的問題之一：檢索結果看起來相關，但實際上卻不相關。透過在擷取與產生之間插入評估與修正步驟，它可以篩選出不良的結果、填補外部搜尋的缺口，並提供模型更乾淨的工作情境。</p>
<p>要讓 CRAG 在生產中可靠地運作，需要的不只是良好的擷取邏輯。它需要一個向量資料庫，能夠處理多租戶隔離、混合搜尋，以及不斷演進的模式 - 這正是<a href="https://milvus.io/intro">Milvus</a>的用武之地。在應用程式方面，選擇正確的評估器、及早檢測可觀察性，以及主動管理記憶體品質，才能將演示與值得信賴的系統區分開來。</p>
<p>如果您正在建立 RAG 或代理系統，並遇到檢索品質問題，我們很樂意提供協助：</p>
<ul>
<li>加入<a href="https://slack.milvus.io/">Milvus Slack 社群</a>，提出問題、分享您的架構，並向其他正在處理類似問題的開發人員取經。</li>
<li><a href="https://milvus.io/office-hours">預約 20 分鐘的 Milvus Office Hours 免費會議</a>，與團隊一起討論您的使用個案 - 無論是 CRAG 設計、混合檢索或多租戶擴充。</li>
<li>如果您想跳過基礎架構的設定，直接開始建置，<a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a>(Milvus管理) 提供免費的層級讓您開始使用。</li>
</ul>
<hr>
<p>當團隊開始實施 CRAG 時，經常會遇到的幾個問題：</p>
<p><strong>CRAG 與只在 RAG 中加入 reranker 有何不同？</strong></p>
<p>重排器會根據相關性對結果重新排序，但仍假設擷取的文件是可用的。CRAG 則更進一步--它會評估擷取的內容是否真的完全符合查詢的需求，並在不符合時採取矯正措施：精煉部分符合的內容、以網路搜尋作為補充，或是完全捨棄結果。這是一個品質控制循環，而不只是一個更好的排序。</p>
<p><strong>為什麼高相似度得分有時候會傳回錯誤的文件？</strong></p>
<p>嵌入相似性測量向量空間中的語意接近度，但這與回答問題不同。關於在 Apache 上設定 HTTPS 的文件，在語義上與關於 Nginx 上 HTTPS 的問題很接近，但卻沒有幫助。CRAG 藉由評估與實際查詢的相關性，而不只是向量距離，來捕捉這一點。</p>
<p><strong>CRAG 的向量資料庫應該注意什麼？</strong></p>
<p>最重要的有三件事：混合檢索 (因此您可以結合語意搜尋與關鍵字比對，以取得精確的詞彙)、多租戶隔離 (因此每個使用者或代理程式會話都有自己的記憶體空間)，以及彈性的模式 (因此您可以新增<code translate="no">confidence</code> 或<code translate="no">verified</code> 等欄位，而不會因為管道演進而停機)。</p>
<p><strong>如果擷取的文件都不相關，該怎麼辦？</strong></p>
<p>CRAG 不會就此放棄。當置信度低於 0.5 時，它會回到網頁搜尋。當結果模棱兩可 (0.5-0.9) 時，它會將精煉的內部文件與外部搜尋結果合併。即使在知識庫有缺口的情況下，模型也總是能得到一些背景資料。</p>
