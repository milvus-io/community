---
id: what-is-vector-database-and-how-it-works.md
title: 向量資料庫究竟是什麼？它又是如何運作的？
author: Zilliz
date: 2025-03-24T00:00:00.000Z
desc: 向量資料庫會儲存、索引和搜尋由機器學習模型產生的向量嵌入，以實現快速的資訊檢索與相似度搜尋。
cover: assets.zilliz.com/What_s_a_Vector_Database_and_How_Does_It_Work_cac0875415.png
tag: Engineering
canonicalUrl: 'https://milvus.io/blog/what-is-a-vector-database.md'
---
<p>向量資料庫可儲存和索引向量嵌入（vector embeddings），以實現快速檢索與相似度搜尋，並具備 CRUD 操作、中繼資料篩選和水平擴展等功能，是專為 AI 應用程式所設計的資料庫系統。</p>
<iframe width="100%" height="315" src="https://www.youtube.com/embed/4yQjsY5iD9Q" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
<h2 id="Introduction-The-Rise-of-Vector-Databases-in-the-AI-Era" class="common-anchor-header">引言：AI 時代中向量資料庫的崛起<button data-href="#Introduction-The-Rise-of-Vector-Databases-in-the-AI-Era" class="anchor-icon" translate="no">
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
    </button></h2><p>在 ImageNet 發展初期，需要 25,000 名人工標註員手動標記資料集。這個驚人的數字凸顯了 AI 的一項根本挑戰：以人工方式分類非結構化資料根本無法擴展。由於每天都會產生數十億張圖片、影片、文件和音訊檔案，電腦理解和處理內容的方式迫切需要一場典範轉移。</p>
<p><a href="https://zilliz.com/blog/relational-databases-vs-vector-databases">傳統關聯式資料庫</a>系統擅長管理具有預先定義格式的結構化資料，並執行精確的搜尋操作。相較之下，向量資料庫則專門透過稱為向量嵌入的高維度數值表示法，來儲存和檢索<a href="https://zilliz.com/learn/introduction-to-unstructured-data">非結構化資料</a>類型，例如圖片、音訊、影片和文字內容。向量資料庫透過提供高效的資料檢索與管理來支援<a href="https://zilliz.com/glossary/large-language-models-(llms)">大型語言模型</a>。現代向量資料庫透過硬體感知最佳化（AVX512、SIMD、GPU、NVMe SSD）、高度最佳化的搜尋演算法（HNSW、IVF、DiskANN）以及列式導向的儲存設計，效能比傳統系統高出 2 至 10 倍。其雲原生、儲存與計算分離的架構，可讓搜尋、資料插入和索引元件獨立擴展，使系統能夠在 Salesforce、PayPal、eBay 和 NVIDIA 等企業級 AI 應用中，有效率地處理數十億個向量，同時維持高效能。</p>
<p>這正是專家所稱的「語意鴻溝」（semantic gap）——傳統資料庫以精確比對和預先定義的關聯來運作，而人類對內容的理解則是細膩、具上下文關聯且多維度的。隨著 AI 應用程式開始要求以下能力，這個鴻溝變得越來越棘手：</p>
<ul>
<li><p>尋找概念上的相似性，而非精確比對</p></li>
<li><p>理解不同內容片段之間的上下文關聯</p></li>
<li><p>捕捉超越關鍵字的資訊語意本質</p></li>
<li><p>在統一架構中處理多模態資料</p></li>
</ul>
<p>向量資料庫已成為彌補這個鴻溝的關鍵技術，並成為現代 AI 基礎架構中不可或缺的組成部分。它們透過促進叢集（clustering）和分類（classification）等任務來強化機器學習模型的效能。</p>
<iframe style="border-radius:12px" src="https://open.spotify.com/embed/episode/1T6K6wlZuryLbETUrafO9f?utm_source=generator" width="100%" height="152" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
<h2 id="Understanding-Vector-Embeddings-The-Foundation" class="common-anchor-header">理解向量嵌入：基礎<button data-href="#Understanding-Vector-Embeddings-The-Foundation" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://zilliz.com/glossary/vector-embeddings">向量嵌入</a>正是跨越語意鴻溝的關鍵橋梁。這些高維度數值表示法以電腦可以高效處理的形式，捕捉非結構化資料的語意本質。現代嵌入模型將原始內容——無論是文字、圖片還是音訊——轉換為稠密向量，使相似的概念在向量空間中彼此靠近，不受表面層級的差異影響。</p>
<p>例如，正確建構的嵌入會將「automobile」、「car」和「vehicle」等概念放在向量空間中的相近位置，儘管它們的詞彙形式不同。這個特性使得<a href="https://zilliz.com/glossary/semantic-search">語意搜尋</a>、<a href="https://zilliz.com/vector-database-use-cases/recommender-system">推薦系統</a>和 AI 應用程式能夠超越單純的模式比對來理解內容。</p>
<p>嵌入的威力涵蓋了各種模態。先進的向量資料庫可以在統一的系統中支援各種非結構化資料類型——文字、圖片、音訊——實現過去無法有效建模的跨模態搜尋與關聯。這些向量資料庫能力對於聊天機器人和影像辨識系統等 AI 驅動技術至關重要，並支援語意搜尋和推薦系統等進階應用。</p>
<p>然而，大規模儲存、索引和檢索嵌入資料帶來了傳統資料庫並未設計來因應的獨特運算挑戰。</p>
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
    </button></h2><p>向量資料庫代表了我們儲存和查詢非結構化資料方式的典範轉移。傳統關聯式資料庫系統擅長管理具有預先定義格式的結構化資料，而向量資料庫則專門透過數值向量表示法來處理非結構化資料。</p>
<p>就其核心而言，向量資料庫旨在解決一個根本問題：在大規模非結構化資料集上實現高效的相似度搜尋。它們透過三個關鍵元件來達成這個目標：</p>
<p><strong>向量嵌入</strong>：捕捉非結構化資料（文字、圖片、音訊等）語意意義的高維度數值表示法</p>
<p><strong>專門化索引</strong>：針對高維度向量空間最佳化的演算法，可實現快速的近似搜尋。向量資料庫對向量建立索引，以提升相似度搜尋的速度和效率，並利用各種機器學習演算法在向量嵌入上建立索引。</p>
<p><a href="https://zilliz.com/blog/similarity-metrics-for-vector-search"><strong>距離度量</strong></a>：量化向量之間相似度的數學函式</p>
<p>向量資料庫中的主要操作是<a href="https://zilliz.com/blog/k-nearest-neighbor-algorithm-for-machine-learning">k 最近鄰</a>（KNN）查詢，用於找出與給定查詢向量最相似的 k 個向量。對於大規模應用，這些資料庫通常會實作<a href="https://zilliz.com/glossary/anns">近似最近鄰</a>（ANN）演算法，以少量的精確度換取搜尋速度的顯著提升。</p>
<h3 id="Mathematical-Foundations-of-Vector-Similarity" class="common-anchor-header">向量相似度的數學基礎</h3><p>理解向量資料庫需要先掌握向量相似度背後的數學原理。以下是基礎概念：</p>
<h3 id="Vector-Spaces-and-Embeddings" class="common-anchor-header">向量空間與嵌入</h3><p><a href="https://zilliz.com/learn/everything-you-should-know-about-vector-embeddings">向量嵌入</a>是一個固定長度的浮點數陣列（維度範圍可從 100 到 32,768！），以數值格式表示非結構化資料。這些嵌入會將相似的項目放置在高維度向量空間中彼此相近的位置。</p>
<p>例如，在訓練良好的詞嵌入空間中，「king」和「queen」這兩個詞的向量表示會比它們各自與「automobile」的距離更為接近。</p>
<h3 id="Distance-Metrics" class="common-anchor-header">距離度量</h3><p>距離度量的選擇從根本上影響相似度的計算方式。常見的距離度量包括：</p>
<ol>
<li><p><strong>歐幾里得距離（Euclidean Distance）</strong>：歐幾里得空間中兩點之間的直線距離。</p></li>
<li><p><strong>餘弦相似度（Cosine Similarity）</strong>：衡量兩個向量之間夾角的餘弦值，著重於方向而非大小。</p></li>
<li><p><strong>點積（Dot Product）</strong>：對於正規化向量，表示兩個向量的對齊程度。</p></li>
<li><p><strong>曼哈頓距離（L1 範數）</strong>：座標之間絕對差值的總和。</p></li>
</ol>
<p>不同的使用場景可能需要不同的距離度量。例如，餘弦相似度通常對文字嵌入效果良好，而歐幾里得距離可能更適合某些類型的<a href="https://zilliz.com/learn/image-embeddings-for-enhanced-image-search">圖片嵌入</a>。</p>
<p><a href="https://zilliz.com/glossary/semantic-similarity">語意相似度</a>：向量空間中向量之間的相似程度</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Semantic_similarity_between_vectors_in_a_vector_space_ee6fb35909.png" alt="Semantic similarity between vectors in a vector space" class="doc-image" id="semantic-similarity-between-vectors-in-a-vector-space" />
    <span>向量空間中向量之間的語意相似度</span>
  </span>
</p>
<p>理解這些數學基礎之後，自然會產生一個關於實作的問題：那麼，只要為任何資料庫加上向量索引就行了嗎？</p>
<p>單純在關聯式資料庫中加入向量索引是不夠的，使用獨立的<a href="https://zilliz.com/learn/comparing-vector-database-vector-search-library-and-vector-search-plugin">向量索引函式庫</a>也是如此。雖然向量索引提供了有效尋找相似向量的關鍵能力，但它們缺乏生產環境應用所需的基礎設施：</p>
<ul>
<li><p>它們不提供用於管理向量資料的 CRUD 操作</p></li>
<li><p>它們缺乏中繼資料儲存和篩選能力</p></li>
<li><p>它們沒有內建的擴展、複製或容錯機制</p></li>
<li><p>它們需要自訂基礎設施來進行資料持久化和管理</p></li>
</ul>
<p>向量資料庫的出現正是為了解決這些限制，提供專為向量嵌入設計的完整資料管理能力。它們結合了向量搜尋的語意能力與資料庫系統的操作能力。</p>
<p>與以精確比對運作的傳統資料庫不同，向量資料庫專注於語意搜尋——根據特定的距離度量，找出與查詢向量「最相似」的向量。這個根本差異驅動了支援這些專門化系統的獨特架構和演算法。</p>
<p>其他專門化的儲存系統也遵循相同的邏輯——高頻率、按時間排序的事件資料通常存放在時序資料庫（例如 <a href="https://questdb.com/">QuestDB</a>）中，而從中衍生出的嵌入則由向量資料庫保存。</p>
<h2 id="Vector-Database-Architecture-A-Technical-Framework" class="common-anchor-header">向量資料庫架構：技術框架<button data-href="#Vector-Database-Architecture-A-Technical-Framework" class="anchor-icon" translate="no">
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
    </button></h2><p>現代向量資料庫實作了精密的多層架構，以分離關注點、實現可擴展性並確保可維護性。這個技術框架遠超單純的搜尋索引，可建立能夠處理生產級 AI 工作負載的系統。向量資料庫透過處理和檢索 AI 與 ML 應用所需的資訊來運作，利用近似最近鄰搜尋演算法，將各種類型的原始資料轉換為向量，並透過語意搜尋有效管理多樣化的資料類型。</p>
<h3 id="Four-Tier-Architecture" class="common-anchor-header">四層架構</h3><p>一個生產級的向量資料庫通常由四個主要的架構層組成：</p>
<ol>
<li><p><strong>儲存層（Storage Layer）</strong>：管理向量資料和中繼資料的持久化儲存，實作專門的編碼與壓縮策略，並針對向量特定的存取模式最佳化 I/O。</p></li>
<li><p><strong>索引層（Index Layer）</strong>：維護多種索引演算法，管理其建立與更新，並實作針對效能的硬體特定最佳化。</p></li>
<li><p><strong>查詢層（Query Layer）</strong>：處理傳入的查詢、決定執行策略、處理結果集，並為重複查詢實作快取機制。</p></li>
<li><p><strong>服務層（Service Layer）</strong>：管理用戶端連線、處理請求路由、提供監控與日誌記錄，並實作安全性和多租戶隔離。</p></li>
</ol>
<h3 id="Vector-Search-Workflow" class="common-anchor-header">向量搜尋工作流程</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Complete_workflow_of_a_vector_search_operation_7283d7546a.png" alt="Complete workflow of a vector search operation.png" class="doc-image" id="complete-workflow-of-a-vector-search-operation.png" />
    <span>向量搜尋操作的完整工作流程.png</span>
  </span>
</p>
<p>典型的向量資料庫實作遵循以下工作流程：</p>
<ol>
<li><p>機器學習模型將非結構化資料（文字、圖片、音訊）轉換為向量嵌入</p></li>
<li><p>這些向量嵌入與相關的中繼資料一起儲存在資料庫中</p></li>
<li><p>當使用者執行查詢時，系統會使用<em>相同</em>的模型將查詢轉換為向量嵌入</p></li>
<li><p>資料庫使用近似最近鄰演算法，將查詢向量與已儲存的向量進行比較</p></li>
<li><p>系統根據向量相似度回傳 top-K 個最相關的結果</p></li>
<li><p>可選的後處理可能會套用額外的篩選或重新排序</p></li>
</ol>
<p>這個管線使得在大規模非結構化資料集合上進行高效的語意搜尋成為可能，這是傳統資料庫方法無法做到的。</p>
<h4 id="Consistency-in-Vector-Databases" class="common-anchor-header">向量資料庫中的一致性</h4><p>在分散式向量資料庫中確保一致性是一項挑戰，因為需要在效能與正確性之間取得取捨。雖然最終一致性（eventual consistency）在大規模系統中很常見，但對於詐欺偵測和即時推薦等關鍵任務應用，則需要強一致性模型。基於法定人數的寫入（quorum-based writes）和分散式共識（例如 <a href="https://zilliz.com/learn/raft-or-not">Raft</a>、Paxos）等技術，可以在不過度犧牲效能的情況下確保資料完整性。</p>
<p>生產環境的實作採用共享儲存架構，具備儲存與計算分離的特性。這種分離遵循資料平面（data plane）與控制平面（control plane）分離的原則，每一層都可獨立擴展，以達到最佳的資源利用率。</p>
<h3 id="Managing-Connections-Security-and-Multitenancy" class="common-anchor-header">管理連線、安全性與多租戶</h3><p>由於這些資料庫被用於多使用者、多租戶的環境中，保護資料安全和管理存取控制對於維護機密性至關重要。</p>
<p>加密（包括靜態資料和傳輸中資料）等安全措施可以保護敏感資料，例如嵌入和中繼資料。身分驗證和授權可確保只有授權的使用者才能存取系統，並透過細粒度的權限來管理對特定資料的存取。</p>
<p>存取控制透過定義角色和權限來限制資料存取。對於儲存客戶資料或專有 AI 模型等敏感資訊的資料庫來說，這一點尤其重要。</p>
<p>多租戶架構涉及隔離每個租戶的資料以防止未經授權的存取，同時實現資源共享。這可透過分片（sharding）、分割（partitioning）或列級安全性來達成，以確保不同團隊或客戶都能獲得可擴展且安全的存取。</p>
<p>外部身分與存取管理（IAM）系統可與向量資料庫整合，以強制執行安全策略並確保符合業界標準。</p>
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
    </button></h2><p>向量資料庫相較於傳統資料庫提供了多項優勢，使其成為處理向量資料的理想選擇。以下是其中一些主要優點：</p>
<ol>
<li><p><strong>高效的相似度搜尋</strong>：向量資料庫最突出的特性之一，就是能夠執行高效的語意搜尋。與依賴精確比對的傳統資料庫不同，向量資料庫擅長找出與給定查詢向量相似的資料點。這項能力對於推薦系統等應用至關重要，因為找出與使用者過去互動相似的項目，可以顯著提升使用者體驗。</p></li>
<li><p><strong>處理高維度資料</strong>：向量資料庫是專門為高效率管理高維度資料而設計的。這使得它們特別適合自然語言處理、<a href="https://zilliz.com/learn/what-is-computer-vision">電腦視覺</a>和基因體學等應用，因為這些領域的資料通常存在於高維度空間中。透過利用先進的索引和搜尋演算法，向量資料庫即使在複雜的向量嵌入資料集中，也能快速檢索相關的資料點。</p></li>
<li><p><strong>可擴展性</strong>：可擴展性是現代 AI 應用的關鍵要求，而向量資料庫天生就是為了高效擴展而設計的。無論是處理數百萬還是數十億個向量，向量資料庫都能透過水平擴展來應對 AI 應用日益增長的需求。這確保了即使資料量增加，效能也能保持一致。</p></li>
<li><p><strong>靈活性</strong>：向量資料庫在資料表示方面提供了卓越的靈活性。它們可以儲存和管理各種類型的資料，包括數值特徵、來自文字或圖片的嵌入，甚至像是分子結構這樣的複雜資料。這種多功能性使得向量資料庫成為從文字分析到科學研究等廣泛應用的強大工具。</p></li>
<li><p><strong>即時應用</strong>：許多向量資料庫都針對即時或接近即時的查詢進行了最佳化。這對於需要快速回應的應用特別重要，例如詐欺偵測、即時推薦和互動式 AI 系統。快速執行相似度搜尋的能力確保了這些應用能夠提供即時且相關的結果。</p></li>
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
    </button></h2><p>向量資料庫在各種產業中都有廣泛的應用，展現了它們的多功能性和強大能力。以下是一些值得注意的使用案例：</p>
<ol>
<li><p><strong>自然語言處理</strong>：在自然語言處理（NLP）領域中，向量資料庫扮演著至關重要的角色。它們被用於文字分類、情緒分析和語言翻譯等任務。透過將文字轉換為高維度向量嵌入，向量資料庫實現了高效的相似度搜尋和語意理解，從而提升<a href="https://zilliz.com/learn/7-nlp-models">NLP 模型</a>的效能。</p></li>
<li><p><strong>電腦視覺</strong>：向量資料庫也廣泛應用於電腦視覺領域。影像辨識、<a href="https://zilliz.com/learn/what-is-object-detection">物體偵測</a>和影像分割等任務，都受惠於向量資料庫處理高維度影像嵌入的能力。這使得快速且準確地檢索視覺上相似的圖片成為可能，讓向量資料庫在自動駕駛、醫學影像和數位資產管理等領域成為不可或缺的工具。</p></li>
<li><p><strong>基因體學</strong>：在基因體學中，向量資料庫被用來儲存和分析基因序列、蛋白質結構和其他分子資料。這類資料的高維度特性使得向量資料庫成為管理和查詢大型基因體資料集的理想選擇。研究人員可以執行向量搜尋來尋找具有相似模式的基因序列，有助於發現基因標記並理解複雜的生物過程。</p></li>
<li><p><strong>推薦系統</strong>：向量資料庫是現代推薦系統的基石。透過將使用者互動和項目特徵儲存為向量嵌入，這些資料庫可以快速識別與使用者過去互動過的項目相似的項目。這項能力提升了推薦的準確性和相關性，進而提高使用者滿意度和參與度。</p></li>
<li><p><strong>聊天機器人與虛擬助理</strong>：向量資料庫被用於聊天機器人和虛擬助理中，以提供即時的上下文相關回答。透過將使用者輸入轉換為向量嵌入，這些系統可以執行相似度搜尋，找出最相關的回應。這使得聊天機器人和虛擬助理能夠提供更準確且符合上下文的答案，從而提升整體使用者體驗。</p></li>
</ol>
<p>透過利用向量資料庫的獨特能力，各產業的組織可以建立更智慧、更具回應性且更可擴展的 AI 應用程式。</p>
<h2 id="Vector-Search-Algorithms-From-Theory-to-Practice" class="common-anchor-header">向量搜尋演算法：從理論到實務<button data-href="#Vector-Search-Algorithms-From-Theory-to-Practice" class="anchor-icon" translate="no">
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
    </button></h2><p>向量資料庫需要專門的索引<a href="https://zilliz.com/learn/vector-index">演算法</a>，才能在高維度空間中實現高效的相似度搜尋。演算法的選擇直接影響精確度、速度、記憶體使用量和可擴展性。</p>
<h3 id="Graph-Based-Approaches" class="common-anchor-header">圖形為基礎的方法</h3><p><strong>HNSW（</strong><a href="https://zilliz.com/learn/hierarchical-navigable-small-worlds-HNSW"><strong>階層式可導航小世界</strong></a><strong>）</strong>透過連接相似向量來建立可導航的結構，從而在搜尋過程中實現高效的遍歷。HNSW 限制了每個節點的最大連線數和搜尋範圍，以在效能與精確度之間取得平衡，使其成為向量相似度搜尋中使用最廣泛的演算法之一。</p>
<p><strong>Cagra</strong> 是一種專為 GPU 加速最佳化的圖形為基礎索引。它建構了與 GPU 處理模式對齊的可導航圖形結構，從而實現大規模的平行向量比較。Cagra 特別有效的原因在於，它能夠透過圖形度數和搜尋寬度等可設定參數來平衡召回率與效能。使用具備 Cagra 的推論級 GPU 可能比昂貴的訓練級硬體更具成本效益，同時仍能提供高吞吐量，尤其是在大型向量集合的場景中。不過，值得注意的是，除非在高查詢壓力的情況下，否則像 Cagra 這類 GPU 索引在降低延遲方面不一定比 CPU 索引更有優勢。</p>
<h3 id="Quantization-Techniques" class="common-anchor-header">量化技術</h3><p><a href="https://zilliz.com/learn/scalar-quantization-and-product-quantization"><strong>乘積量化（PQ）</strong></a>將高維度向量分解為較小的子向量，並分別對每個子向量進行量化。這可以顯著減少儲存需求（通常減少 90% 以上），但會引入一些精確度損失。</p>
<p><strong>純量量化（SQ）</strong>將 32 位元浮點數轉換為 8 位元整數，可將記憶體使用量減少 75%，且對精確度的影響很小。</p>
<h3 id="On-Disk-Indexing-Cost-Effective-Scaling" class="common-anchor-header">磁碟索引：具成本效益的擴展</h3><p>對於大型向量集合（1 億個以上的向量），記憶體索引的成本會高得令人卻步。例如，1 億個 1024 維向量需要大約 400GB 的 RAM。這就是 DiskANN 等磁碟索引演算法能帶來顯著成本優勢的地方。</p>
<p><a href="https://zilliz.com/learn/DiskANN-and-the-Vamana-Algorithm">DiskANN</a> 基於 Vamana 圖形演算法，可實現高效的向量搜尋，同時將大部分索引儲存在 NVMe SSD 而非 RAM 中。這種方法具有多項成本優勢：</p>
<ul>
<li><p><strong>降低硬體成本</strong>：組織可以使用 RAM 配置適中的通用硬體來部署大規模向量搜尋</p></li>
<li><p><strong>降低營運費用</strong>：更少的 RAM 意味著資料中心內的電力消耗和散熱成本更低</p></li>
<li><p><strong>線性成本擴展</strong>：記憶體成本隨資料量線性成長，而效能則保持相對穩定</p></li>
<li><p><strong>最佳化 I/O 模式</strong>：DiskANN 的專門設計透過謹慎的圖形遍歷策略來最小化磁碟讀取</p></li>
</ul>
<p>通常的代價是查詢延遲會適度增加（通常僅 2-3 毫秒），相較於純記憶體的方法，這在許多生產使用案例中是可以接受的。</p>
<h3 id="Specialized-Index-Types" class="common-anchor-header">專門化索引類型</h3><p><strong>二元嵌入索引</strong>專為電腦視覺、影像指紋辨識和推薦系統而設計，在這些領域中，資料可以用二元特徵來表示。這些索引服務於不同的應用需求。對於需要精確比對的影像去重、數位浮水印和版權偵測，最佳化的二元索引可提供精確的相似度偵測。對於將速度置於完美召回率之上的高吞吐量推薦系統、基於內容的影像檢索和大規模特徵比對，二元索引則提供了卓越的效能優勢。</p>
<p><strong>稀疏向量索引</strong>針對大多數元素為零、只有少數非零值的向量進行了最佳化。與稠密向量（其中大多數或所有維度都包含有意義的值）不同，稀疏向量可以有效地表示具有許多維度但只有少數活躍特徵的資料。這種表示法在文字處理中特別常見，因為一份文件可能只使用詞彙表中所有可能詞彙的一小部分。稀疏向量索引在語意文件搜尋、全文查詢和主題建模等自然語言處理任務中表現出色。這些索引對於大型文件集合的企業搜尋、必須有效定位特定術語和概念的法律文件發現，以及為數百萬篇具有專業術語的論文建立索引的學術研究平台特別有價值。</p>
<h2 id="Advanced-Query-Capabilities" class="common-anchor-header">進階查詢能力<button data-href="#Advanced-Query-Capabilities" class="anchor-icon" translate="no">
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
    </button></h2><p>向量資料庫的核心在於其執行高效語意搜尋的能力。向量搜尋能力從基本的相似度比對，到用於提升相關性和多樣性的進階技術，範圍相當廣泛。</p>
<h3 id="Basic-ANN-Search" class="common-anchor-header">基本 ANN 搜尋</h3><p>近似最近鄰（ANN）搜尋是向量資料庫中最基礎的搜尋方法。與將查詢向量與資料庫中的每個向量進行比較的精確 k 最近鄰（kNN）搜尋不同，ANN 搜尋使用索引結構來快速識別一組可能最相似的向量，從而大幅提升效能。</p>
<p>ANN 搜尋的關鍵組成部分包括：</p>
<ul>
<li><p><strong>查詢向量</strong>：您正在搜尋之內容的向量表示</p></li>
<li><p><strong>索引結構</strong>：預先建構的資料結構，用於組織向量以實現高效檢索</p></li>
<li><p><strong>度量類型</strong>：用於衡量向量之間相似度的數學函式，例如歐幾里得（L2）、餘弦或內積</p></li>
<li><p><strong>Top-K 結果</strong>：指定要回傳的最相似向量數量</p></li>
</ul>
<p>向量資料庫提供了多種最佳化來提升搜尋效率：</p>
<ul>
<li><p><strong>批次向量搜尋</strong>：同時使用多個查詢向量進行平行搜尋</p></li>
<li><p><strong>分割搜尋</strong>：將搜尋限制在特定的資料分割中</p></li>
<li><p><strong>分頁</strong>：使用 limit 和 offset 參數來檢索大型結果集</p></li>
<li><p><strong>輸出欄位選擇</strong>：控制要隨結果回傳哪些實體欄位</p></li>
</ul>
<h3 id="Advanced-Search-Techniques" class="common-anchor-header">進階搜尋技術</h3><h4 id="Range-Search" class="common-anchor-header">範圍搜尋</h4><p>範圍搜尋透過將結果限制在相似度分數落在特定範圍內的向量來提升結果相關性。與回傳 top-K 個最相似向量的標準 ANN 搜尋不同，範圍搜尋使用以下方式定義一個「環形區域」：</p>
<ul>
<li><p>外部邊界（radius）：設定允許的最大距離</p></li>
<li><p>內部邊界（range_filter）：可排除過於相似的向量</p></li>
</ul>
<p>這種方法在您想要尋找「相似但不完全相同」的項目時特別有用，例如推薦與使用者已瀏覽過的商品相關但不完全重複的產品推薦。</p>
<h4 id="Filtered-Search" class="common-anchor-header">篩選搜尋</h4><p>篩選搜尋將向量相似度與中繼資料約束結合起來，將結果縮小到符合特定條件的向量。例如，在產品目錄中，您可以找出視覺上相似的項目，但將結果限制在特定品牌或價格範圍內。</p>
<p>高度可擴展的向量資料庫支援兩種篩選方法：</p>
<ul>
<li><p><strong>標準篩選</strong>：在向量搜尋之前套用中繼資料篩選，可顯著縮小候選池</p></li>
<li><p><strong>迭代篩選</strong>：先執行向量搜尋，然後對每個結果套用篩選，直到達到所需的相符數量</p></li>
</ul>
<h4 id="Text-Match" class="common-anchor-header">文字比對</h4><p>文字比對可根據特定詞彙實現精確的文件檢索，為向量相似度搜尋補充了精確文字比對的能力。與尋找概念上相似內容的語意搜尋不同，文字比對專注於尋找查詢詞彙的精確出現位置。</p>
<p>例如，產品搜尋可能會結合文字比對來找出明確提及「防水」的產品，並結合向量相似度來找出視覺上相似的產品，從而確保同時滿足語意相關性和特定的功能需求。</p>
<h4 id="Grouping-Search" class="common-anchor-header">分組搜尋</h4><p>分組搜尋會依指定的欄位彙總結果，以提升結果的多樣性。例如，在每個段落都是獨立向量的文件集合中，分組可確保結果來自不同的文件，而不是同一文件中的多個段落。</p>
<p>這項技術在以下情境中非常有價值：</p>
<ul>
<li><p>希望結果來自不同來源的文件檢索系統</p></li>
<li><p>需要呈現多樣化選項的推薦系統</p></li>
<li><p>結果多樣性與相似度同等重要的搜尋系統</p></li>
</ul>
<h4 id="Hybrid-Search" class="common-anchor-header">混合搜尋</h4><p>混合搜尋結合了來自多個向量欄位的結果，每個欄位可能代表資料的不同面向，或使用不同的嵌入模型。這可以實現：</p>
<ul>
<li><p><strong>稀疏-稠密向量組合</strong>：結合語意理解（稠密向量）與關鍵字比對（稀疏向量），實現更全面的文字搜尋</p></li>
<li><p><strong>多模態搜尋</strong>：在不同資料類型之間尋找相符項目，例如同時使用圖片和文字輸入來搜尋產品</p></li>
</ul>
<p>混合搜尋實作使用精密的重新排序策略來結合結果：</p>
<ul>
<li><p><strong>加權排名</strong>：優先考慮來自特定向量欄位的結果</p></li>
<li><p><strong>互惠排名融合（Reciprocal Rank Fusion）</strong>：在沒有特定偏重的情況下，平衡所有向量欄位的結果</p></li>
</ul>
<h4 id="Full-Text-Search" class="common-anchor-header">全文搜尋</h4><p>現代向量資料庫中的全文搜尋能力，彌合了傳統文字搜尋與向量相似度之間的差距。這些系統：</p>
<ul>
<li><p>自動將原始文字查詢轉換為稀疏嵌入</p></li>
<li><p>檢索包含特定詞彙或片語的文件</p></li>
<li><p>根據詞彙相關性和語意相似度對結果進行排名</p></li>
<li><p>透過捕捉語意搜尋可能遺漏的精確比對來補充向量搜尋</p></li>
</ul>
<p>這種混合方法對於需要同時具備精確詞彙比對和語意理解的全面性<a href="https://zilliz.com/learn/what-is-information-retrieval">資訊檢索</a>系統特別有價值。</p>
<h2 id="Performance-Engineering-Metrics-That-Matter" class="common-anchor-header">效能工程：關鍵指標<button data-href="#Performance-Engineering-Metrics-That-Matter" class="anchor-icon" translate="no">
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
    </button></h2><p>向量資料庫的效能最佳化需要理解關鍵指標及其取捨。</p>
<h3 id="The-Recall-Throughput-Tradeoff" class="common-anchor-header">召回率與吞吐量的取捨</h3><p>召回率（Recall）衡量在回傳的結果中找到真正最近鄰的比例。較高的召回率需要更廣泛的搜尋，這會降低吞吐量（每秒查詢數）。生產系統會根據應用需求來平衡這些指標，通常會依使用案例將召回率目標設定在 80-99% 之間。</p>
<p>在評估向量資料庫效能時，ANN-Benchmarks 等標準化基準測試環境提供了有價值的比較數據。這些工具衡量的關鍵指標包括：</p>
<ul>
<li><p>搜尋召回率：在回傳的結果中找到真正最近鄰的查詢比例</p></li>
<li><p>每秒查詢數（QPS）：資料庫在標準化條件下處理查詢的速率</p></li>
<li><p>在不同資料集大小和維度下的效能表現</p></li>
</ul>
<p>另一種選擇是名為 <a href="https://zilliz.com/vector-database-benchmark-tool?database=ZillizCloud%2CMilvus%2CElasticCloud%2CPgVector%2CPinecone%2CQdrantCloud%2CWeaviateCloud&amp;dataset=medium&amp;filter=none%2Clow%2Chigh&amp;tab=1">VDB Bench</a> 的開源基準測試系統。VectorDBBench 是一個<a href="https://github.com/zilliztech/VectorDBBench">開源基準測試工具</a>，旨在使用自己的資料集來評估和比較 Milvus、Zilliz Cloud 等主流向量資料庫的效能。它也能幫助開發人員為其使用案例選擇最合適的向量資料庫。</p>
<p>這些基準測試使組織能夠根據自身特定需求，在兼顧精確度、速度和可擴展性的情況下，識別出最合適的向量資料庫實作。</p>
<h3 id="Memory-Management" class="common-anchor-header">記憶體管理</h3><p>高效的記憶體管理使向量資料庫能夠擴展到數十億個向量，同時維持效能：</p>
<ul>
<li><p><strong>動態分配</strong>根據工作負載特性調整記憶體使用量</p></li>
<li><p><strong>快取策略</strong>將頻繁存取的向量保留在記憶體中</p></li>
<li><p><strong>向量壓縮技術</strong>可顯著減少記憶體需求</p></li>
</ul>
<p>對於超過記憶體容量的資料集，磁碟型解決方案提供了關鍵能力。這些演算法透過光束搜尋（beam search）和圖形導航等技術，為 NVMe SSD 最佳化 I/O 模式。</p>
<h3 id="Advanced-Filtering-and-Hybrid-Search" class="common-anchor-header">進階篩選與混合搜尋</h3><p>向量資料庫將語意相似度與傳統篩選結合起來，創造出強大的查詢能力：</p>
<ul>
<li><p><strong>預先篩選（Pre-filtering）</strong>在向量搜尋之前套用中繼資料約束，減少用於相似度比較的候選集</p></li>
<li><p><strong>後置篩選（Post-filtering）</strong>先執行向量搜尋，然後對結果套用篩選</p></li>
<li><p><strong>中繼資料索引</strong>透過針對不同資料類型的專門索引來提升篩選效能</p></li>
</ul>
<p>高效能的向量資料庫支援結合多個向量欄位與純量約束的複雜查詢模式。多向量查詢可同時尋找與多個參考點相似的實體，而負向量查詢則可排除與指定範例相似的向量。</p>
<h2 id="Scaling-Vector-Databases-in-Production" class="common-anchor-header">在生產環境中擴展向量資料庫<button data-href="#Scaling-Vector-Databases-in-Production" class="anchor-icon" translate="no">
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
    </button></h2><p>向量資料庫需要深思熟慮的部署策略，以確保在不同規模下都能達到最佳效能：</p>
<ul>
<li><p><strong>小規模部署</strong>（數百萬個向量）可以在具有足夠記憶體的單一機器上有效運作</p></li>
<li><p><strong>中規模部署</strong>（數千萬到數億）適合採用具有高記憶體實例和 SSD 儲存的主流垂直擴展方案</p></li>
<li><p><strong>十億級部署</strong>需要跨多個節點進行水平擴展，並配備專門的角色</p></li>
</ul>
<p>分片（Sharding）和複製（Replication）構成了可擴展向量資料庫架構的基礎：</p>
<ul>
<li><p><strong>水平分片</strong>將集合劃分到多個節點上</p></li>
<li><p><strong>複製</strong>建立資料的冗餘副本，同時提升容錯能力和查詢吞吐量</p></li>
</ul>
<p>現代系統會根據查詢模式和可靠性需求動態調整複製因子。</p>
<h2 id="Real-World-Impact" class="common-anchor-header">實際影響<button data-href="#Real-World-Impact" class="anchor-icon" translate="no">
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
    </button></h2><p>高效能向量資料庫的靈活性體現在其部署選項上。系統可以在各種環境中執行，從筆記型電腦上用於原型開發的輕量級安裝，到管理數百億個向量的大規模分散式叢集。這種可擴展性使組織能夠在不更換資料庫技術的情況下，從概念驗證直接進入生產環境。</p>
<p>Salesforce、PayPal、eBay、NVIDIA、IBM 和 Airbnb 等公司現在都依賴像是開源 <a href="https://milvus.io/">Milvus</a> 這類向量資料庫來驅動大規模 AI 應用。這些實作涵蓋了各種使用案例——從精密的產品推薦系統到內容審核、詐欺偵測和客戶支援自動化——全部建立在向量搜尋的基礎之上。</p>
<p>近年來，向量資料庫在解決 LLM 中常見的幻覺（hallucination）問題方面變得至關重要，因為它們可以提供特定領域、最新或機密的資料。例如，<a href="https://zilliz.com/cloud">Zilliz Cloud</a> 將專門化資料儲存為向量嵌入。當使用者提出問題時，系統會將查詢轉換為向量，執行 ANN 搜尋以找出最相關的結果，並將這些結果與原始問題結合，為大型語言模型建立完整的上下文。這個框架是開發可靠的 LLM 驅動應用程式的基礎，可產生更精確且與上下文更相關的回應。</p>
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
    </button></h2><p>向量資料庫的崛起不僅僅代表一項新技術——它象徵著我們為 AI 應用程式進行資料管理的方式發生了根本性的轉變。透過彌合非結構化資料與運算系統之間的鴻溝，向量資料庫已成為現代 AI 基礎架構中不可或缺的組成部分，使應用程式能夠以越來越接近人類的方式來理解和處理資訊。</p>
<p>向量資料庫相較於傳統資料庫系統的主要優勢包括：</p>
<ul>
<li><p>高維度搜尋：對機器學習和生成式 AI 應用中所使用的高維度向量進行高效的相似度搜尋</p></li>
<li><p>可擴展性：水平擴展，可有效儲存和檢索大型向量集合</p></li>
<li><p>混合搜尋的靈活性：處理各種向量資料類型，包括稀疏向量和稠密向量</p></li>
<li><p>效能：向量相似度搜尋速度遠快於傳統資料庫</p></li>
<li><p>可自訂索引：支援針對特定使用案例和資料類型最佳化的自訂索引方案</p></li>
</ul>
<p>隨著 AI 應用變得越來越精密，對向量資料庫的需求也持續演進。現代系統必須在效能、精確度、擴展性和成本效益之間取得平衡，同時與更廣泛的 AI 生態系統無縫整合。對於希望大規模實作 AI 的組織而言，理解向量資料庫技術不僅是技術層面的考量——更是一項策略性的必要條件。</p>
