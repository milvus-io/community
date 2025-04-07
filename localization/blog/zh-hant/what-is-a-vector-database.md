---
id: what-is-vector-database-and-how-it-works.md
title: 矢量資料庫到底是什麼？
author: Zilliz
date: 2025-03-24T00:00:00.000Z
desc: 向量資料庫可儲存、索引和搜尋由機器學習模型產生的向量嵌入，以進行快速資訊檢索和相似性搜尋。
cover: assets.zilliz.com/What_s_a_Vector_Database_and_How_Does_It_Work_cac0875415.png
tag: Engineering
canonicalUrl: >-
  https://milvus.io/blog/parse-is-hard-solve-semantic-understanding-with-mistral-ocr-and-milvus.md
---
<p>向量資料庫可索引並儲存向量嵌入，以進行快速檢索和相似性搜尋，其功能包括 CRUD 操作、元資料過濾，以及專為 AI 應用程式設計的水平擴充。</p>
<iframe width="100%" height="315" src="https://www.youtube.com/embed/4yQjsY5iD9Q" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
<h2 id="Introduction-The-Rise-of-Vector-Databases-in-the-AI-Era" class="common-anchor-header">簡介：向量資料庫在 AI 時代的興起<button data-href="#Introduction-The-Rise-of-Vector-Databases-in-the-AI-Era" class="anchor-icon" translate="no">
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
    </button></h2><p>在 ImageNet 的早期，需要 25,000 名人力策展人來手動標籤資料集。這個驚人的數字突顯了人工智能的基本挑戰：手動將非結構性資料分類根本無法擴充。由於每天都會產生數十億張圖片、視訊、文件和音訊檔案，因此需要改變電腦理解內容和與內容互動的模式。</p>
<p><a href="https://zilliz.com/blog/relational-databases-vs-vector-databases">傳統的關聯式資料庫系統</a>擅長以預先定義的格式管理結構化資料，並執行精確的搜尋作業。相反，向量資料庫則專精於透過稱為向量嵌入的高維數值表示來儲存和檢索<a href="https://zilliz.com/learn/introduction-to-unstructured-data">非結構化資料 </a>類型，例如影像、音訊、視訊和文字內容。向量資料庫透過提供高效率的資料擷取與管理，支援<a href="https://zilliz.com/glossary/large-language-models-(llms)">大型語言模型</a>。現代向量資料庫透過硬體感知最佳化 (AVX512、SIMD、GPU、NVMe SSD)、高度最佳化的搜尋演算法 (HNSW、IVF、DiskANN) 以及面向欄位的儲存設計，表現優於傳統系統 2-10 倍。其雲端原生、解耦式架構可獨立擴充搜尋、資料插入和索引元件，讓系統有效處理數十億個向量，同時維持 Salesforce、PayPal、eBay 和 NVIDIA 等公司的企業級 AI 應用程式效能。</p>
<p>這代表了專家所謂的「語義差距」- 傳統資料庫的運作是基於精確匹配和預先定義的關係，而人類對內容的理解是細微的、情境性的和多維的。隨著 AI 應用程式的需求，這個差距變得越來越棘手：</p>
<ul>
<li><p>尋找概念上的相似性，而非完全匹配</p></li>
<li><p>瞭解不同內容之間的上下文關係</p></li>
<li><p>捕捉關鍵字以外的資訊語意精髓</p></li>
<li><p>在統一框架內處理多模態資料</p></li>
</ul>
<p>矢量資料庫已經成為彌補這一差距的關鍵技術，成為現代人工智能基礎設施的重要組成部分。矢量資料庫有助於完成聚類和分類等任務，從而增強機器學習模型的性能。</p>
<iframe style="border-radius:12px" src="https://open.spotify.com/embed/episode/1T6K6wlZuryLbETUrafO9f?utm_source=generator" width="100%" height="152" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
<h2 id="Understanding-Vector-Embeddings-The-Foundation" class="common-anchor-header">瞭解向量嵌入：基礎<button data-href="#Understanding-Vector-Embeddings-The-Foundation" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://zilliz.com/glossary/vector-embeddings">矢量嵌入</a>是跨越語意鴻溝的重要橋樑。這些高維數值表示以電腦可有效處理的形式，捕捉非結構化資料的語意精髓。現代的嵌入模型會將原始內容 (無論是文字、影像或音訊) 轉換成密集向量，在向量空間中，相似的概念會聚集在一起，而不考慮表面層級的差異。</p>
<p>舉例來說，儘管詞彙形式不同，但正確建構的嵌入模型會將「automobile」、「car」和「vehicle」等概念在向量空間中定位在相近的位置。這個特性讓<a href="https://zilliz.com/glossary/semantic-search">語意搜尋</a>、<a href="https://zilliz.com/vector-database-use-cases/recommender-system">推薦系統</a>和 AI 應用程式能夠理解內容，而不只是簡單的模式匹配。</p>
<p>嵌入的力量可延伸至各種模式。先進的向量資料庫可在統一的系統中支援各種非結構化資料類型 (文字、影像、音訊)，從而實現跨模式搜尋，並建立過去無法有效建模的關係。這些向量資料庫功能對聊天機器人和影像識別系統等人工智慧驅動的技術至關重要，可支援語意搜尋和推薦系統等進階應用。</p>
<p>然而，大規模的嵌入式資料儲存、索引與擷取所帶來的獨特計算挑戰，是傳統資料庫無法解決的。</p>
<h2 id="Vector-Databases-Core-Concepts" class="common-anchor-header">向量資料庫：核心概念<button data-href="#Vector-Databases-Core-Concepts" class="anchor-icon" translate="no">
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
    </button></h2><p>矢量資料庫代表著我們儲存和查詢非結構化資料方式的範式轉變。傳統的關聯式資料庫系統擅長以預先定義的格式管理結構化資料，而向量資料庫則不同，它專門透過數值向量表示來處理非結構化資料。</p>
<p>向量資料庫的核心是要解決一個基本問題：在大量非結構性資料的資料集中進行有效率的相似性搜尋。它們透過三個關鍵元件來達成這個目標：</p>
<p><strong>向量嵌入</strong>：捕捉非結構化資料（文字、影像、音訊等）語義的高維數值表示法。</p>
<p><strong>專門索引</strong>：針對高維向量空間最佳化的演算法，可實現快速近似搜尋。向量資料庫為向量建立索引，以提高相似性搜尋的速度和效率，利用各種 ML 演算法在向量嵌入上建立索引。</p>
<p><a href="https://zilliz.com/blog/similarity-metrics-for-vector-search"><strong>距離度量</strong></a>：量化向量間相似性的數學函數</p>
<p>向量資料庫的主要操作是<a href="https://zilliz.com/blog/k-nearest-neighbor-algorithm-for-machine-learning">k 最近鄰</a>(KNN) 查詢，它會找出與指定查詢向量最相似的 k 個向量。對於大規模的應用，這些資料庫通常會執行<a href="https://zilliz.com/glossary/anns">近似最近鄰</a>(ANN) 演算法，以少量的精確度來換取搜尋速度的顯著提升。</p>
<h3 id="Mathematical-Foundations-of-Vector-Similarity" class="common-anchor-header">向量相似性的數學基礎</h3><p>理解向量資料庫需要掌握向量相似性背後的數學原理。以下是基本概念：</p>
<h3 id="Vector-Spaces-and-Embeddings" class="common-anchor-header">向量空間與嵌入</h3><p><a href="https://zilliz.com/learn/everything-you-should-know-about-vector-embeddings">向量嵌入</a>是固定長度的浮點數陣列（可從 100 到 32,768 維不等！），以數字格式表示非結構化資料。這些內嵌在高維向量空間中將相似的項目定位在較近的位置。</p>
<p>例如，在訓練有素的字詞嵌入空間中，「king」和「queen」這兩個字詞的向量表示會比較接近「automobile」。</p>
<h3 id="Distance-Metrics" class="common-anchor-header">距離指標</h3><p>距離指標的選擇會從根本影響相似性的計算方式。常見的距離指標包括</p>
<ol>
<li><p><strong>歐氏距離</strong>：歐氏空間中兩點間的直線距離。</p></li>
<li><p><strong>余弦相似度</strong>：量測兩個向量之間的角度余弦，著重於方向而非大小。</p></li>
<li><p><strong>點積</strong>：對於標準化向量，代表兩個向量的對齊程度。</p></li>
<li><p><strong>曼哈頓距離 (L1 Norm)：</strong>坐標間絕對差異的總和。</p></li>
</ol>
<p>不同的使用個案可能需要不同的距離指標。例如，余弦相似性通常適用於文字嵌入，而歐氏距離可能更適合某些類型的<a href="https://zilliz.com/learn/image-embeddings-for-enhanced-image-search">影像嵌入</a>。</p>
<p>向量空間中向量間的<a href="https://zilliz.com/glossary/semantic-similarity">語意相似性</a></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Semantic_similarity_between_vectors_in_a_vector_space_ee6fb35909.png" alt="Semantic similarity between vectors in a vector space" class="doc-image" id="semantic-similarity-between-vectors-in-a-vector-space" />
   </span> <span class="img-wrapper"> <span>向量空間中向量間的語意相似性</span> </span></p>
<p>了解了這些數學基礎之後，就會引出一個關於實作的重要問題：那麼只要在任何資料庫中加入向量索引不就行了嗎？</p>
<p>僅在關係資料庫中加入向量索引是不夠的，使用獨立的<a href="https://zilliz.com/learn/comparing-vector-database-vector-search-library-and-vector-search-plugin">向量索引函式庫</a>也是不夠的。雖然向量索引提供了有效尋找相似向量的關鍵能力，但它們缺乏生產應用程式所需的基礎架構：</p>
<ul>
<li><p>它們不提供管理向量資料的 CRUD 操作</p></li>
<li><p>缺乏元資料儲存與篩選功能</p></li>
<li><p>不提供內建擴充、複製或容錯功能</p></li>
<li><p>它們需要自訂的基礎架構來進行資料持久化和管理</p></li>
</ul>
<p>向量資料庫的出現就是為了解決這些限制，提供專為向量嵌入設計的完整資料管理功能。它們結合了向量搜尋的語意能力與資料庫系統的操作能力。</p>
<p>與傳統資料庫的精確匹配不同，向量資料庫專注於語意搜尋 - 根據特定的距離指標，找出與查詢向量「最類似」的向量。這個根本性的差異驅動了這些專門系統的獨特架構和演算法。</p>
<h2 id="Vector-Database-Architecture-A-Technical-Framework" class="common-anchor-header">向量資料庫架構：技術架構<button data-href="#Vector-Database-Architecture-A-Technical-Framework" class="anchor-icon" translate="no">
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
    </button></h2><p>現代向量資料庫實作了精密的多層架構，可區分關注點、實現可擴充性並確保可維護性。此技術架構遠遠超越了簡單的搜尋索引，可創造出能夠處理生產 AI 工作負載的系統。向量資料庫的工作方式是處理和擷取 AI 與 ML 應用程式的資訊，利用近似近鄰搜尋的演算法，將各種類型的原始資料轉換為向量，並透過語意搜尋有效管理各種資料類型。</p>
<h3 id="Four-Tier-Architecture" class="common-anchor-header">四層架構</h3><p>生產向量資料庫通常包含四個主要架構層：</p>
<ol>
<li><p><strong>儲存層</strong>：管理向量資料和元資料的持久性儲存、執行專門的編碼和壓縮策略，以及最佳化向量特定存取的 I/O 模式。</p></li>
<li><p><strong>索引層</strong>：維護多種索引演算法，管理其建立與更新，並實作硬體特定的效能最佳化。</p></li>
<li><p><strong>查詢層</strong>：處理傳入的查詢、決定執行策略、處理結果處理，並為重複查詢實施快取。</p></li>
<li><p><strong>服務層</strong>：管理用戶端連線、處理請求路由、提供監控和日誌，並實作安全性和多租戶。</p></li>
</ol>
<h3 id="Vector-Search-Workflow" class="common-anchor-header">向量搜尋工作流程</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Complete_workflow_of_a_vector_search_operation_7283d7546a.png" alt="Complete workflow of a vector search operation.png" class="doc-image" id="complete-workflow-of-a-vector-search-operation.png" />
   </span> <span class="img-wrapper"> <span>向量搜尋作業的完整工作流程.png</span> </span></p>
<p>典型的向量資料庫實作遵循此工作流程：</p>
<ol>
<li><p>機器學習模型將非結構化資料 (文字、影像、音訊) 轉換為向量嵌入 (vector embeddings)</p></li>
<li><p>這些向量嵌入與相關的元資料一起儲存在資料庫中</p></li>
<li><p>當使用者執行查詢時，會使用<em>相同的</em>模型將其轉換成向量嵌入。</p></li>
<li><p>資料庫使用近似近鄰演算法比較查詢向量與儲存向量</p></li>
<li><p>系統會根據向量的相似度，返回前 K 個最相關的結果</p></li>
<li><p>可選的後處理可應用額外的過濾器或重新排序</p></li>
</ol>
<p>此管道可在大量非結構化資料集合中進行有效率的語意搜尋，而傳統資料庫方法則無法做到這一點。</p>
<h4 id="Consistency-in-Vector-Databases" class="common-anchor-header">向量資料庫的一致性</h4><p>由於需要在效能與正確性之間作出取捨，因此確保分散式向量資料庫的一致性是一項挑戰。雖然最終一致性在大型系統中很常見，但對於詐欺偵測和即時推薦等關鍵任務應用程式來說，強一致性模型是必需的。基於法定人數的寫入和分散式共識（例如<a href="https://zilliz.com/learn/raft-or-not">Raft</a>、Paxos）等技術可確保資料完整性，而不需要過度的效能取捨。</p>
<p>生產實作採用共享儲存架構，以儲存與運算分離為特色。這種分離遵循資料平面與控制平面分離的原則，每層都可獨立擴充，以達到最佳資源利用率。</p>
<h3 id="Managing-Connections-Security-and-Multitenancy" class="common-anchor-header">管理連線、安全性與多重租用</h3><p>由於這些資料庫用於多使用者和多租戶環境，因此保護資料安全和管理存取控制對於維護機密性至關重要。</p>
<p>加密等安全措施（包括靜止和傳輸中）可保護嵌入和元資料等敏感資料。驗證和授權可確保只有授權使用者才能存取系統，並提供細粒度權限以管理特定資料的存取。</p>
<p>存取控制定義角色和權限，以限制資料存取。這對於儲存客戶資料或專屬 AI 模型等敏感資訊的資料庫尤其重要。</p>
<p>多租户包括隔离每个租户的数据，以防止未经授权的访问，同时实现资源共享。這可透過分片、分割或行層級安全性來實現，以確保不同團隊或客戶的可擴充與安全存取。</p>
<p>外部身分與存取管理 (IAM) 系統可與向量資料庫整合，以強制執行安全政策，並確保符合業界標準。</p>
<h2 id="Advantages-of-Vector-Databases" class="common-anchor-header">向量資料庫的優勢<button data-href="#Advantages-of-Vector-Databases" class="anchor-icon" translate="no">
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
    </button></h2><p>與傳統資料庫相比，向量資料庫具有多項優點，是處理向量資料的理想選擇。以下是一些主要優點：</p>
<ol>
<li><p><strong>高效的相似性搜尋</strong>：矢量資料庫的突出特色之一是能夠執行有效率的語意搜尋。與依賴精確匹配的傳統資料庫不同，向量資料庫擅長尋找與指定查詢向量相似的資料點。這種能力對於推薦系統等應用程式來說非常重要，在這些應用程式中，找到與使用者過去互動類似的項目可以大幅提升使用者體驗。</p></li>
<li><p><strong>處理高維資料</strong>：向量資料庫專為有效管理高維資料而設計。這使得向量資料庫特別適合自然語言處理、<a href="https://zilliz.com/learn/what-is-computer-vision">電腦視覺</a>和基因組學的應用，因為這些領域的資料通常存在於高維空間中。透過利用先進的索引與搜尋演算法，向量資料庫能夠快速擷取相關的資料點，即使是複雜的向量嵌入資料集也不例外。</p></li>
<li><p><strong>可擴充性</strong>：可擴充性是現代人工智慧應用程式的重要需求，而向量資料庫就是為了有效擴充而建立的。無論是處理數百萬或數十億向量，向量資料庫都能透過水平擴充，處理人工智慧應用程式不斷成長的需求。這可確保即使資料量增加，效能仍能保持一致。</p></li>
<li><p><strong>彈性</strong>：向量資料庫在資料表示方面提供了極佳的靈活性。它們可以儲存和管理各種類型的資料，包括數值特徵、文字或影像的嵌入，甚至是分子結構等複雜資料。這種多樣性讓向量資料庫成為從文字分析到科學研究等廣泛應用的強大工具。</p></li>
<li><p><strong>即時應用</strong>：許多向量資料庫已針對即時或接近即時的查詢進行最佳化。這對於需要快速回應的應用程式尤其重要，例如詐欺偵測、即時推薦和互動式 AI 系統。執行快速相似性搜尋的能力可確保這些應用程式能及時提供相關結果。</p></li>
</ol>
<h2 id="Use-Cases-for-Vector-Databases" class="common-anchor-header">向量資料庫的使用案例<button data-href="#Use-Cases-for-Vector-Databases" class="anchor-icon" translate="no">
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
    </button></h2><p>矢量資料庫在各行各業都有廣泛的應用，展現出它的多樣性與強大功能。以下是一些值得注意的使用案例：</p>
<ol>
<li><p><strong>自然語言處理</strong>：在自然語言處理 (NLP) 領域中，向量資料庫扮演著重要的角色。向量資料庫可用於文字分類、情感分析和語言翻譯等任務。向量資料庫將文字轉換成高維向量嵌入，可有效率地進行相似性搜尋和語義理解，提升<a href="https://zilliz.com/learn/7-nlp-models">NLP 模型</a>的效能。</p></li>
<li><p><strong>電腦視覺</strong>：向量資料庫也廣泛應用於電腦視覺應用。向量資料庫能夠處理高維影像嵌入，讓影像辨識、<a href="https://zilliz.com/learn/what-is-object-detection">物體偵測</a>和影像分割等任務獲益良多。這可快速、精確地檢索視覺相似的影像，讓向量資料庫成為自動駕駛、醫療影像和數位資產管理等領域不可或缺的工具。</p></li>
<li><p><strong>基因組學</strong>：在基因組學中，向量資料庫可用於儲存和分析基因序列、蛋白質結構和其他分子資料。此類資料的高維度特性使向量資料庫成為管理和查詢大型基因組資料集的理想選擇。研究人員可以執行向量搜尋，找出具有類似模式的基因序列，協助發現基因標記和了解複雜的生物過程。</p></li>
<li><p><strong>推薦系統</strong>：向量資料庫是現代推薦系統的基石。透過將用戶互動和項目特徵儲存為向量嵌入，這些資料庫可以快速識別出與用戶之前互動過的項目相似的項目。此功能可增強推薦的準確性和相關性，提高使用者的滿意度和參與程度。</p></li>
<li><p><strong>聊天機器人與虛擬助理</strong>：向量資料庫可用於聊天機器人和虛擬助理，為使用者的查詢提供即時的情境答案。透過將使用者輸入轉換為向量嵌入，這些系統可以執行相似性搜尋，找出最相關的回應。這可讓聊天機器人和虛擬助理提供更精準且符合情境的答案，進而提升整體使用者體驗。</p></li>
</ol>
<p>透過利用向量資料庫的獨特功能，各行各業的組織可以建立更智慧、反應更迅速且可擴充的 AI 應用程式。</p>
<h2 id="Vector-Search-Algorithms-From-Theory-to-Practice" class="common-anchor-header">向量搜尋算法：從理論到實踐<button data-href="#Vector-Search-Algorithms-From-Theory-to-Practice" class="anchor-icon" translate="no">
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
    </button></h2><p>向量資料庫需要專門的索引<a href="https://zilliz.com/learn/vector-index">演算法</a>，才能在高維空間中進行有效率的相似性搜尋。演算法的選擇會直接影響精確度、速度、記憶體使用量和擴充性。</p>
<h3 id="Graph-Based-Approaches" class="common-anchor-header">基於圖形的方法</h3><p><strong>HNSW (</strong><a href="https://zilliz.com/learn/hierarchical-navigable-small-worlds-HNSW"><strong>Hierarchical Navigable Small World</strong></a><strong>)</strong>透過連接相似向量來建立可瀏覽的結構，讓搜尋過程能夠有效率地進行遍歷。HNSW 限制每個節點的最大連線數和搜尋範圍，以平衡效能和精確度，使其成為向量相似性搜尋最廣泛使用的演算法之一。</p>
<p><strong>Cagra</strong>是專為 GPU 加速而優化的圖形索引。它能建構出符合 GPU 處理模式的可瀏覽圖形結構，從而實現大規模的平行向量比較。Cagra 之所以特別有效，是因為它能夠透過可設定的參數（例如圖形程度和搜尋寬度）來平衡召回率和效能。與昂貴的訓練級硬體相比，使用 Cagra 的推理級 GPU 更具成本效益，同時仍能提供高吞吐量，特別是對於大規模向量集合而言。不過，值得注意的是，除非是在高查詢壓力下運作，否則 GPU 索引 (例如 Cagra) 不一定會比 CPU 索引降低延遲。</p>
<h3 id="Quantization-Techniques" class="common-anchor-header">量化技術</h3><p><a href="https://zilliz.com/learn/scalar-quantization-and-product-quantization"><strong>乘積量化 (Product Quantization, PQ)</strong></a>可將高維向量分解成較小的子向量，並將每個子向量單獨量化。這可大幅降低儲存需求 (通常可降低 90% 以上)，但會造成一些精確度上的損失。</p>
<p><strong>Scalar Quantization (SQ)</strong>將 32 位元浮點數轉換為 8 位元整數，可減少 75% 的記憶體使用量，但對精確度的影響極小。</p>
<h3 id="On-Disk-Indexing-Cost-Effective-Scaling" class="common-anchor-header">磁碟索引：具成本效益的擴充</h3><p>對於大規模向量集合 (100M+ 向量)，記憶體內索引會變得非常昂貴。舉例來說，1 億個 1024 維向量大約需要 400GB 記憶體。這就是 DiskANN 等磁碟索引演算法提供顯著成本效益的地方。</p>
<p><a href="https://zilliz.com/learn/DiskANN-and-the-Vamana-Algorithm">DiskANN</a> 以 Vamana 圖演算法為基礎，可在 NVMe SSD 而非 RAM 上儲存大部分索引的同時，進行有效率的向量搜尋。這種方法具有多項成本優勢：</p>
<ul>
<li><p><strong>降低硬體成本</strong>：組織可使用具有適度 RAM 配置的商品硬體，進行規模化的向量搜尋部署</p></li>
<li><p><strong>降低營運支出</strong>：較少的 RAM 代表資料中心較低的耗電量和冷卻成本</p></li>
<li><p><strong>線性成本縮放</strong>：記憶體成本與資料量呈線性關係，而效能則相對穩定</p></li>
<li><p><strong>最佳化的 I/O 模式</strong>：DiskANN 的專門設計透過謹慎的圖形遍歷策略將磁碟讀取減至最少</p></li>
</ul>
<p>與純粹的記憶體方法相比，DiskANN 的權衡通常是查詢延遲時間的適度增加（通常僅為 2-3ms），這對於許多生產用例而言是可以接受的。</p>
<h3 id="Specialized-Index-Types" class="common-anchor-header">專門索引類型</h3><p><strong>二進位嵌入索引</strong>專門用於電腦視覺、影像指紋和推薦系統，在這些系統中，資料可表示為二進位特徵。這些索引可滿足不同的應用需求。對於影像重複刪除、數位水印和版權偵測等需要精確匹配的應用程式，最佳化的二進位索引可提供精確的相似性偵測。對於高吞吐量推薦系統、以內容為基礎的影像檢索，以及以速度優先於完美回復率的大規模特徵比對，二進位索引提供了卓越的效能優勢。</p>
<p><strong>稀疏向量索引針對</strong>大多數元素為零、只有少數非零值的向量進行最佳化。與密集向量 (大多數或所有的維度都包含有意義的值) 不同，稀疏向量能有效率地表示具有許多維度，但只有少數有效特徵的資料。這種表示法在文字處理中特別常見，在文字處理中，文件可能只使用詞彙中所有可能詞彙的一小部分。稀疏向量索引擅長於自然語言處理任務，例如語意文件搜尋、全文查詢和主題建模。這些索引對於跨大型文件集的企業搜尋、必須有效率地找出特定詞彙和概念的法律文件發現，以及為數百萬篇具有專門術語的論文編製索引的學術研究平台，尤其有價值。</p>
<h2 id="Advanced-Query-Capabilities" class="common-anchor-header">先進的查詢功能<button data-href="#Advanced-Query-Capabilities" class="anchor-icon" translate="no">
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
    </button></h2><p>向量資料庫的核心在於其執行有效率語意搜尋的能力。向量搜尋功能的範圍從基本的相似性比對到進階技術，以改善相關性和多樣性。</p>
<h3 id="Basic-ANN-Search" class="common-anchor-header">基本 ANN 搜尋</h3><p>近似近鄰 (ANN) 搜尋是向量資料庫的基礎搜尋方法。與精確的 k-Nearest Neighbors (kNN) 搜尋（將查詢向量與資料庫中的每個向量進行比較）不同，ANN 搜尋使用索引結構快速找出可能最相似的向量子集，大幅提升效能。</p>
<p>ANN 搜尋的主要元件包括</p>
<ul>
<li><p><strong>查詢向量</strong>：您正在搜尋的向量表示法</p></li>
<li><p><strong>索引結構</strong>：預先建立的資料結構，用來組織向量以進行有效率的檢索</p></li>
<li><p><strong>度量類型</strong>：測量向量之間相似性的數學函數，例如 Euclidean (L2)、Cosine 或 Inner Product</p></li>
<li><p><strong>Top-K 結果</strong>：返回最相似向量的指定數量</p></li>
</ul>
<p>向量資料庫提供優化功能，以提高搜尋效率：</p>
<ul>
<li><p><strong>大量向量搜尋</strong>：並行使用多個查詢向量進行搜尋</p></li>
<li><p><strong>分區搜尋</strong>：將搜尋限制在特定的資料分區</p></li>
<li><p><strong>分頁</strong>：使用限制和偏移參數檢索大型結果集</p></li>
<li><p><strong>輸出欄位選擇</strong>：控制哪些實體欄位會隨結果傳回</p></li>
</ul>
<h3 id="Advanced-Search-Techniques" class="common-anchor-header">進階搜尋技術</h3><h4 id="Range-Search" class="common-anchor-header">範圍搜尋</h4><p>範圍搜尋可將結果限制為相似度得分在特定範圍內的向量，以改善結果的相關性。標準 ANN 搜尋會返回前 K 個最相似的向量，與此不同的是，範圍搜尋會使用「環狀區域」來定義：</p>
<ul>
<li><p>設定最大允許距離的外部邊界 (半徑)</p></li>
<li><p>內側邊界 (range_filter) 可以排除太相似的向量</p></li>
</ul>
<p>當您想要尋找「類似但不完全相同」的項目時，這個方法特別有用，例如與使用者已瀏覽過的項目相關但不完全重複的產品推薦。</p>
<h4 id="Filtered-Search" class="common-anchor-header">篩選搜尋</h4><p>篩選搜尋結合向量相似性與元資料限制，將搜尋結果縮小到符合特定條件的向量。例如，在產品目錄中，您可以找到視覺上相似的項目，但將結果限制在特定品牌或價格範圍內。</p>
<p>Highly Scalable 向量資料庫支援兩種篩選方法：</p>
<ul>
<li><p><strong>標準篩選</strong>：在向量搜尋之前套用元資料篩選器，大幅減少候選資料池</p></li>
<li><p><strong>迭代過濾</strong>：先執行向量搜尋，然後對每個結果套用篩選器，直到達到所需的匹配次數。</p></li>
</ul>
<h4 id="Text-Match" class="common-anchor-header">文字匹配</h4><p>文字匹配可根據特定詞彙進行精確的文件檢索，以精確的文字匹配功能補充向量相似性搜尋。語意搜尋會尋找概念上相似的內容，而文字匹配則不同，它著重於尋找查詢字詞的精確出現。</p>
<p>舉例來說，產品搜尋可以結合文字匹配來尋找明確提到「防水」的產品，並結合向量相似性來尋找視覺上相似的產品，以確保符合語意相關性和特定功能需求。</p>
<h4 id="Grouping-Search" class="common-anchor-header">群組搜尋</h4><p>群組搜尋會依指定欄位彙整搜尋結果，以改善結果的多樣性。例如，在每個段落都是獨立向量的文件集合中，分組可確保結果來自不同的文件，而非同一文件中的多個段落。</p>
<p>此技術對以下情況非常有用</p>
<ul>
<li><p>需要來自不同來源的代表的文件檢索系統</p></li>
<li><p>需要提供多種選項的推薦系統</p></li>
<li><p>結果多樣性與相似性同樣重要的搜尋系統</p></li>
</ul>
<h4 id="Hybrid-Search" class="common-anchor-header">混合搜尋</h4><p>混合搜尋結合了來自多個向量場的結果，每個向量場可能代表資料的不同方面或使用不同的嵌入模型。這可以</p>
<ul>
<li><p><strong>稀疏-密集向量組合</strong>：結合語意理解（密集向量）與關鍵字比對（稀疏向量），以進行更全面的文字搜尋</p></li>
<li><p><strong>多模式搜尋</strong>：跨不同資料類型尋找匹配，例如使用影像和文字輸入搜尋產品</p></li>
</ul>
<p>混合搜尋實作使用精密的重新排序 (reranking) 策略來合併結果：</p>
<ul>
<li><p><strong>加權排序</strong>：優先處理來自特定向量領域的結果</p></li>
<li><p><strong>互惠排名融合</strong>：平衡所有向量領域的結果，不做特別強調</p></li>
</ul>
<h4 id="Full-Text-Search" class="common-anchor-header">全文檢索</h4><p>現代向量資料庫的全文檢索功能縮小了傳統文字檢索與向量相似性之間的差距。這些系統</p>
<ul>
<li><p>自動將原始文字查詢轉換為稀疏嵌入</p></li>
<li><p>擷取包含特定詞彙或片語的文件</p></li>
<li><p>根據詞彙相關性和語意相似性對結果進行排序</p></li>
<li><p>補足向量搜尋，捕捉語意搜尋可能遺漏的精確匹配結果</p></li>
</ul>
<p>這種混合方法對於需要精確詞彙匹配和語義理解的綜合<a href="https://zilliz.com/learn/what-is-information-retrieval">資訊檢索</a>系統特別有價值。</p>
<h2 id="Performance-Engineering-Metrics-That-Matter" class="common-anchor-header">效能工程：重要的指標<button data-href="#Performance-Engineering-Metrics-That-Matter" class="anchor-icon" translate="no">
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
    </button></h2><p>向量資料庫的效能最佳化需要瞭解關鍵指標及其折衷。</p>
<h3 id="The-Recall-Throughput-Tradeoff" class="common-anchor-header">召回率 - 吞吐量權衡</h3><p>召回率衡量的是在返回的結果中找到的真正近鄰的比例。更高的召回率需要更廣泛的搜尋，從而降低吞吐量（每秒查詢次數）。生產系統會根據應用程式需求來平衡這些指標，一般目標是 80-99% 的召回率，視使用情況而定。</p>
<p>評估向量資料庫效能時，ANN-Benchmarks 等標準化基準環境可提供寶貴的比較資料。這些工具測量的關鍵指標包括</p>
<ul>
<li><p>搜索召回率：在傳回的結果中找到真正近鄰的查詢比例</p></li>
<li><p>每秒查詢次數 (QPS)：資料庫在標準條件下處理查詢的速度</p></li>
<li><p>跨不同資料集大小和維度的效能</p></li>
</ul>
<p>另一個選擇是開放原始碼基準系統<a href="https://zilliz.com/vector-database-benchmark-tool?database=ZillizCloud%2CMilvus%2CElasticCloud%2CPgVector%2CPinecone%2CQdrantCloud%2CWeaviateCloud&amp;dataset=medium&amp;filter=none%2Clow%2Chigh&amp;tab=1">VDB Bench</a>。VectorDBBench 是一個<a href="https://github.com/zilliztech/VectorDBBench">開放原始碼的基準測試工具</a>，設計用來評估和比較主流向量資料庫的效能，例如 Milvus 和 Zilliz Cloud 使用自己的資料集。它還能幫助開發人員選擇最適合其使用個案的向量資料庫。</p>
<p>這些基準可讓組織找出最適合其特定需求的向量資料庫實作，並考慮精確度、速度和可擴充性之間的平衡。</p>
<h3 id="Memory-Management" class="common-anchor-header">記憶體管理</h3><p>高效的記憶體管理可讓向量資料庫在維持效能的同時，擴充至數十億向量：</p>
<ul>
<li><p><strong>動態分配</strong>可根據工作負載特性調整記憶體使用量</p></li>
<li><p>快取<strong>政策</strong>將經常存取的向量保留在記憶體中</p></li>
<li><p><strong>向量壓縮技術</strong>可大幅降低記憶體需求</p></li>
</ul>
<p>對於超出記憶體容量的資料集，以磁碟為基礎的解決方案提供了重要的能力。這些演算法透過波束搜尋和圖形導覽等技術，針對 NVMe SSD 優化 I/O 模式。</p>
<h3 id="Advanced-Filtering-and-Hybrid-Search" class="common-anchor-header">進階過濾與混合搜尋</h3><p>向量資料庫結合語意相似性與傳統過濾功能，創造出強大的查詢能力：</p>
<ul>
<li><p><strong>預過濾</strong>在向量搜尋之前應用元資料限制，減少相似性比較的候選集</p></li>
<li><p><strong>後篩選先</strong>執行向量搜尋，然後將篩選條件套用到結果上</p></li>
<li><p><strong>元資料索引</strong>透過針對不同資料類型的專門索引來改善篩選效能</p></li>
</ul>
<p>性能強大的向量資料庫支援結合多重向量欄位與標量約束的複雜查詢模式。多向量查詢可同時尋找與多個參考點相似的實體，而否定向量查詢則可排除與指定範例相似的向量。</p>
<h2 id="Scaling-Vector-Databases-in-Production" class="common-anchor-header">在生產中擴充向量資料庫<button data-href="#Scaling-Vector-Databases-in-Production" class="anchor-icon" translate="no">
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
    </button></h2><p>向量資料庫需要深思熟慮的部署策略，以確保在不同規模下都能發揮最佳效能：</p>
<ul>
<li><p><strong>小規模部署</strong>(數百萬向量) 可在具有足夠記憶體的單一機器上有效運作</p></li>
<li><p><strong>中規模部署</strong>(數千至數百萬) 可從高記憶體實體和 SSD 儲存的垂直擴充<strong>中</strong>獲益</p></li>
<li><p><strong>十億規模的部署</strong>需要在多個具有專門角色的節點上進行水平擴充</p></li>
</ul>
<p>分片與複製構成可擴充向量資料庫架構的基礎：</p>
<ul>
<li><p><strong>水平分片</strong>在多個節點上分割集合</p></li>
<li><p><strong>複製</strong>會建立資料的備援副本，以改善容錯能力和查詢吞吐量</p></li>
</ul>
<p>現代系統可根據查詢模式和可靠性需求動態調整複製因子。</p>
<h2 id="Real-World-Impact" class="common-anchor-header">現實世界的影響<button data-href="#Real-World-Impact" class="anchor-icon" translate="no">
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
    </button></h2><p>高效能向量資料庫的彈性從其部署選項中可見一斑。系統可以在各種環境中運行，從用於原型設計的筆記型電腦上的輕量級安裝，到管理數百億向量的大型分散式集群。這種可擴充性讓組織能夠在不改變資料庫技術的情況下，從概念轉移至生產。</p>
<p>Salesforce、PayPal、eBay、NVIDIA、IBM 和 Airbnb 等公司現在都仰賴向量資料庫 (例如開放原始碼<a href="https://milvus.io/">Milvus</a>) 來支援大型 AI 應用程式。這些實作涵蓋各種不同的使用個案，從複雜的產品推薦系統到內容管理、詐欺偵測和客戶支援自動化，全都建構在向量搜尋的基礎上。</p>
<p>近年來，向量資料庫透過提供特定領域、最新或機密資料，在解決 LLM 常見的幻覺問題上變得非常重要。例如，<a href="https://zilliz.com/cloud">Zilliz Cloud</a>將專門資料儲存為向量嵌入。當使用者提出問題時，它會將查詢轉換為向量，執行 ANN 搜尋最相關的結果，並將這些結果與原始問題結合，為大型語言模型建立全面的上下文。此架構可作為開發可靠的 LLM 驅動應用程式的基礎，以產生更精確且與上下文相關的回應。</p>
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
    </button></h2><p>向量資料庫的興起代表的不僅僅是一項新技術，它更意味著我們在處理 AI 應用程式資料管理方式上的根本性轉變。藉由縮短非結構化資料與計算系統之間的差距，向量資料庫已成為現代人工智慧基礎架構的重要組成部分，讓應用程式能以越來越像人類的方式來理解和處理資訊。</p>
<p>與傳統資料庫系統相比，向量資料庫的主要優勢包括</p>
<ul>
<li><p>高維搜尋：在機器學習和生成式 AI 應用程式中使用的高維向量上進行高效的相似性搜尋</p></li>
<li><p>可擴充性：橫向擴充可有效儲存與檢索大型向量集合</p></li>
<li><p>混合搜尋的彈性：處理各種向量資料類型，包括稀疏和密集向量</p></li>
<li><p>效能：與傳統資料庫相比，向量相似性搜尋的速度顯著加快</p></li>
<li><p>自訂索引：支援針對特定使用個案與資料類型最佳化的自訂索引方案</p></li>
</ul>
<p>隨著人工智慧 (AI) 應用越來越複雜，對向量資料庫的需求也持續演進。現代系統必須平衡效能、準確性、擴充性與成本效益，同時與更廣泛的 AI 生態系統無縫整合。對於希望大規模實施 AI 的組織而言，瞭解向量資料庫技術不僅是技術上的考量，更是策略上的必要。</p>
