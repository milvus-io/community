---
id: >-
  productionizing-semantic-search-how-we-built-and-scaled-vector-infrastructure-at-airtable.md
title: 語意搜尋的生產化：我們如何在 Airtable 建立並擴展向量基礎架構
author: Aria Malkani and Cole Dearmon-Moore
date: 2026-3-18
cover: assets.zilliz.com/cover_airtable_milvus_3c77b22ee2.jpg
tag: Use Cases
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  Airtable semantic search, Milvus vector database, vector infrastructure,
  multi-tenant vector search, scalable AI retrieval
meta_title: |
  How Airtable Built and Scaled Vector Infrastructure with Milvus
desc: 了解 Airtable 如何為語意搜尋、多租戶檢索和低延遲 AI 體驗建立可擴充的 Milvus 型向量基礎架構。
origin: >-
  https://milvus.io/blog/productionizing-semantic-search-how-we-built-and-scaled-vector-infrastructure-at-airtable.md
---
<p><em>本篇文章最初發表於</em> <em><a href="https://medium.com/airtable-eng/productionizing-semantic-search-how-we-built-and-scaled-vector-infrastructure-at-airtable-180fff11a136">Airtable Medium</a></em> <em>頻道，並經允許轉載於此。</em></p>
<p>當 Airtable 的語意搜尋從一個概念演變成核心產品功能時，資料基礎架構團隊面臨著擴充的挑戰。正如我們<a href="https://medium.com/airtable-eng/building-a-resilient-embedding-system-for-semantic-search-at-airtable-d5fdf27807e2">之前在「建立嵌入式系統」一文</a>中所詳述的，我們已經設計了一個強大且最終一致的應用層來處理嵌入式的生命週期。但是，我們的架構圖中仍缺少一個關鍵部分：向量資料庫本身。</p>
<p>我們需要一個儲存引擎，能夠索引和服務數十億個嵌入式資料，支援大量的多租戶，並在分散式雲端環境中維持效能和可用性目標。這就是我們如何建構、加強和演進向量搜尋平台，使其成為 Airtable 基礎架構堆疊核心支柱的故事。</p>
<h2 id="Background" class="common-anchor-header">背景<button data-href="#Background" class="anchor-icon" translate="no">
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
    </button></h2><p>在 Airtable，我們的目標是協助客戶以強大、直覺的方式處理他們的資料。隨著功能日益強大且精確的 LLM 的出現，利用資料語意的功能已成為我們產品的核心。</p>
<h2 id="How-We-Use-Semantic-Search" class="common-anchor-header">我們如何使用語意搜尋<button data-href="#How-We-Use-Semantic-Search" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Omni-Airtable’s-AI-Chat-answering-real-questions-from-large-datasets" class="common-anchor-header">Omni（Airtable 的人工智能聊天工具）回答來自大型資料集的真實問題</h3><p>試想一下，向您擁有 50 萬行資料的資料庫（資料庫）提出一個自然語言問題，並獲得一個上下文豐富的正確答案。舉例來說</p>
<p>「最近客戶對電池續航力有什麼意見？」</p>
<p>在小型資料集上，可以直接將所有資料列傳送至 LLM。在規模較大的情況下，這很快就變得不可行。相反地，我們需要一個系統能夠</p>
<ul>
<li>瞭解查詢的語意意圖</li>
<li>透過向量相似性搜尋擷取最相關的資料列</li>
<li>將這些行作為上下文提供給 LLM</li>
</ul>
<p>這個需求幾乎影響了接下來的所有設計決策：Omni 需要有即時和智慧的感覺，即使是在非常大的基礎上。</p>
<h3 id="Linked-record-recommendations-Meaning-over-exact-matches" class="common-anchor-header">連結記錄推薦：意義遠大於精確匹配</h3><p>语义搜索还增强了 Airtable 的一项核心功能：关联记录。使用者需要基於上下文的關係建議，而非精確的文字匹配。例如，項目描述可能暗示與「Team Infrastructure」有關係，但卻沒有使用該特定詞組。</p>
<p>提供這些按需建議需要高品質的語意檢索，而且要有一致、可預測的延遲。</p>
<h2 id="Our-Design-Priorities" class="common-anchor-header">我們的設計優先順序<button data-href="#Our-Design-Priorities" class="anchor-icon" translate="no">
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
    </button></h2><p>為了支援這些功能及更多功能，我們將系統錨定在 4 個目標上：</p>
<ul>
<li><strong>低延遲查詢 (500ms p99)：</strong>可預測的效能對使用者的信任度至關重要</li>
<li><strong>高吞吐量寫入：</strong>基礎會不斷變更，嵌入必須保持同步</li>
<li><strong>水平擴充性：</strong>系統必須支援數百萬個獨立資料庫</li>
<li><strong>自我託管：</strong>所有客戶資料都必須保留在 Airtable 控制的基礎架構內<strong>。</strong></li>
</ul>
<p>這些目標塑造了接下來的每個架構決策。</p>
<h2 id="Vector-Database-Vendor-Evaluation" class="common-anchor-header">矢量資料庫供應商評估<button data-href="#Vector-Database-Vendor-Evaluation" class="anchor-icon" translate="no">
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
    </button></h2><p>2024 年底，我們評估了多個向量資料庫選項，最後基於三個關鍵需求選擇了<a href="https://milvus.io/">Milvus</a>。</p>
<ul>
<li>首先，我們優先採用自託管解決方案，以確保資料隱私，並維持對基礎架構的精細控制。</li>
<li>其次，我們的重寫工作負載和突發查詢模式需要一個可以彈性擴充的系統，同時維持低且可預測的延遲。</li>
<li>最後，我們的架構需要跨越數百萬客戶租戶的強大隔離性。</li>
</ul>
<p><strong>Milvus</strong>是最合適的選擇：它的分散式特性可支援大量的多租戶，並允許我們獨立擴充擷取、索引和查詢執行，在提供效能的同時保持可預測的成本。</p>
<h2 id="Architecture-Design" class="common-anchor-header">架構設計<button data-href="#Architecture-Design" class="anchor-icon" translate="no">
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
    </button></h2><p>選擇了技術之後，我們就必須決定一個架構來呈現 Airtable 獨特的資料形態：數百萬個由不同客戶所擁有的不同「基地」。</p>
<h2 id="The-Partitioning-Challenge" class="common-anchor-header">分區挑戰<button data-href="#The-Partitioning-Challenge" class="anchor-icon" translate="no">
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
    </button></h2><p>我們評估了兩種主要的資料分割策略：</p>
<h3 id="Option-1-Shared-Partitions" class="common-anchor-header">方案 1：共享分區</h3><p>多個資料庫共用一個分割區，透過篩選資料庫 id 來進行查詢。這可提高資源利用率，但會帶來額外的篩選開銷，並使資料庫刪除變得更複雜。</p>
<h3 id="Option-2-One-Base-per-Partition" class="common-anchor-header">选项 2：每个分区一个碱基</h3><p>在 Milvus 中，每个 Airtable base 都映射到自己的物理分区。這提供了強大的隔離性，可快速、簡單地刪除資料庫，並避免查詢後過濾對效能的影響。</p>
<h3 id="Final-Strategy" class="common-anchor-header">最終策略</h3><p>我們選擇方案 2 的原因是其簡單性及強大的隔離性。然而，早期的測試顯示，在單一 Milvus 資料集中建立 100k 個磁碟分割會造成顯著的效能下降：</p>
<ul>
<li>磁碟分割建立延遲從 ~20 毫秒增加到 ~250 毫秒</li>
<li>磁碟分割載入時間超過 30 秒</li>
</ul>
<p>為了解決這個問題，我們限制每個集合的磁碟分割數量。對於每個 Milvus 叢集，我們建立 400 個集合，每個集合最多有 1,000 個分割區。這將每個群集的基數總數限制為 400k，並隨著新增客戶的加入而配置新的群集。</p>
<h2 id="Indexing--Recall" class="common-anchor-header">索引與調用<button data-href="#Indexing--Recall" class="anchor-icon" translate="no">
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
    </button></h2><p>索引選擇是我們系統中最重要的權衡之一。當載入一個分割區時，其索引會緩存在記憶體或磁碟上。為了在召回率、索引大小和效能之間取得平衡，我們測試了幾種索引類型。</p>
<ul>
<li><strong>IVF-SQ8：</strong>提供較小的記憶體佔用量，但召回率較低。</li>
<li><strong>HNSW：</strong>提供最佳的召回率 (99%-100%)，但記憶體佔用量大。</li>
<li><strong>DiskANN：</strong>提供類似 HNSW 的召回率，但查詢延遲較高。</li>
</ul>
<p>最後，我們選擇了 HNSW，因為它的召回率和效能特性都很優異。</p>
<h2 id="The-Application-layer" class="common-anchor-header">應用程式層<button data-href="#The-Application-layer" class="anchor-icon" translate="no">
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
    </button></h2><p>從高層次來看，Airtable 的語意搜尋管道包含兩個核心流程：</p>
<ol>
<li><strong>輸入流程：</strong>將 Airtable 的資料列轉換成嵌入資料，並儲存在 Milvus 中。</li>
<li><strong>查詢流程：</strong>嵌入使用者查詢、擷取相關的行 ID，並提供上下文給 LLM</li>
</ol>
<p>這兩個流程都必須在規模上持續可靠地運作，我們會在下文逐一說明。我們會在下文逐一說明。</p>
<h2 id="Ingestion-Flow-Keeping-Milvus-in-Sync-with-Airtable" class="common-anchor-header">輸入流程：讓 Milvus 與 Airtable 保持同步<button data-href="#Ingestion-Flow-Keeping-Milvus-in-Sync-with-Airtable" class="anchor-icon" translate="no">
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
    </button></h2><p>當使用者開啟 Omni 時，Airtable 開始將他們的資料同步至 Milvus。我們會建立一個分割區，然後分塊處理資料，產生 embeddings 並插入 Milvus。從此之後，我們會擷取對基礎資料所做的任何變更，並重新嵌入和上插這些資料，以保持資料的一致性。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Airtable_Milvusblog_1_aac199ae50.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Query-Flow-How-we-use-the-Data" class="common-anchor-header">查詢流程：我們如何使用資料<button data-href="#Query-Flow-How-we-use-the-Data" class="anchor-icon" translate="no">
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
    </button></h2><p>在查詢方面，我們會嵌入使用者的要求，並將其傳送至 Milvus，以擷取最相關的行 ID。之後，我們會取得這些資料的最新版本，並將其納入 LLM 的要求中。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Airtable_Milvusblog_2_6e9067b16d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Operational-Challenges--How-We-Solved-Them" class="common-anchor-header">作業上的挑戰與我們如何解決它們<button data-href="#Operational-Challenges--How-We-Solved-Them" class="anchor-icon" translate="no">
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
    </button></h2><p>建立一個語意搜尋架構是一項挑戰，而為成千上萬的資料庫可靠地執行則是另一項挑戰。以下是我們一路走來所學到的幾個主要作業經驗。</p>
<h3 id="Deployment" class="common-anchor-header">部署</h3><p>我們透過 Kubernetes CRD 與<a href="https://github.com/zilliztech/milvus-operator">Milvus 操作員</a>部署<a href="https://github.com/zilliztech/milvus-operator">Milvus</a>，讓我們可以宣告式地定義與管理集群。每一項變更，無論是組態更新、用戶端改進或 Milvus 升級，都會先經過單元測試和模擬生產流量的隨選負載測試，然後才推出給使用者。</p>
<p>在 2.5 版中，Milvus 叢集由這些核心元件組成：</p>
<ul>
<li>查詢節點在記憶體中保存向量索引並執行向量搜尋</li>
<li>資料節點處理擷取與壓縮，並將新資料持久化至儲存空間</li>
<li>索引節點建立並維護向量索引，以便在資料成長時保持快速搜尋</li>
<li>協調節點 (Coordinator Node) 協調所有群集活動和分片指派</li>
<li>代理節點路由 API 流量並平衡節點間的負載</li>
<li>Kafka 為內部訊息和資料流提供日誌/串流骨幹</li>
<li>Etcd 儲存群集元資料與協調狀態</li>
</ul>
<p>透過 CRD 驅動的自動化和嚴格的測試管道，我們可以快速、安全地推出更新。</p>
<h2 id="Observability-Understanding-System-Health-End-to-End" class="common-anchor-header">可觀察性：了解端對端的系統健康狀況<button data-href="#Observability-Understanding-System-Health-End-to-End" class="anchor-icon" translate="no">
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
    </button></h2><p>我們在兩個層級監控系統，以確保語義搜尋保持快速且可預測。</p>
<p>在基礎架構層級，我們追蹤所有 Milvus 元件的 CPU、記憶體使用率和 Pod 健康狀況。這些訊號告訴我們集群是否在安全的範圍內運作，並協助我們在資源飽和或不健康的節點影響使用者之前捕捉到這些問題。</p>
<p>在服務層，我們著重於每個基礎如何跟上我們的擷取和查詢工作負載。壓縮和索引吞吐量等指標可讓我們瞭解資料擷取的效率。查詢成功率和延遲讓我們瞭解使用者查詢資料的體驗，而分割區的成長讓我們瞭解資料成長的情況，因此我們在需要擴充時會收到警示。</p>
<h2 id="Node-Rotation" class="common-anchor-header">節點輪換<button data-href="#Node-Rotation" class="anchor-icon" translate="no">
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
    </button></h2><p>基於安全性與法規遵循的理由，我們會定期輪換 Kubernetes 節點。在向量搜尋叢集中，這並非難事：</p>
<ul>
<li>當查詢節點輪換時，協調器會重新平衡查詢節點之間的記憶體資料。</li>
<li>Kafka 和 Etcd 會儲存有狀態的資訊，因此需要法定人數和持續可用性。</li>
</ul>
<p>我們使用嚴格的中斷預算和一次一個節點的輪換政策來解決這個問題。Milvus 協調器在下一個節點循環之前有時間重新平衡。這種謹慎的協調方式既能保持可靠性，又不會減慢我們的速度。</p>
<h2 id="Cold-Partition-Offloading" class="common-anchor-header">冷分割卸載<button data-href="#Cold-Partition-Offloading" class="anchor-icon" translate="no">
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
    </button></h2><p>我們在運作上最大的勝利之一，就是意識到我們的資料有明顯的冷熱存取模式。透過分析使用情況，我們發現 Milvus 中只有 ~25% 的資料會在一週內被寫入或讀取。Milvus 讓我們可以卸載整個分區，釋放查詢節點上的記憶體。如果稍後需要這些資料，我們可以在幾秒鐘內重新載入。這可讓我們將熱門資料保留在記憶體中，並將其餘資料卸載，從而降低成本，並讓我們能更有效率地隨時間擴充。</p>
<h2 id="Data-Recovery" class="common-anchor-header">資料復原<button data-href="#Data-Recovery" class="anchor-icon" translate="no">
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
    </button></h2><p>在廣泛推出 Milvus 之前，我們需要有信心能夠從任何故障情況中快速復原。雖然群集內建的容錯功能已涵蓋大部分問題，但我們也針對資料可能損毀或系統可能進入無法復原狀態的罕見情況進行規劃。</p>
<p>在這些情況下，我們的復原路徑很直接。我們首先啟動新的 Milvus 叢集，以便幾乎立即恢復流量服務。一旦新的叢集啟動，我們會主動重新納入最常用的資料庫，然後在存取其他資料庫時懶洋洋地處理它們。當系統逐漸重建一致的語意索引時，這可以將最常存取資料的停機時間減至最短。</p>
<h2 id="What’s-Next" class="common-anchor-header">下一步<button data-href="#What’s-Next" class="anchor-icon" translate="no">
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
    </button></h2><p>我們與<a href="https://milvus.io/">Milvus</a>的合作為 Airtable 的語意搜尋奠定了堅實的基礎：以規模提供快速、有意義的 AI 體驗。有了這個系統，我們現在正在探索更豐富的檢索管道，並在整個產品中進行更深入的 AI 整合。未來還有許多令人振奮的工作，而我們才剛剛起步。</p>
<p><em>感謝所有過去和現在資料基礎建設上的 Airtablets 以及整個組織對此專案的貢獻：Alex Sorokin、Andrew Wang、Aria Malkani、Cole Dearmon-Moore、Nabeel Farooqui、Will Powelson、Xiaobing Xia。</em></p>
<h2 id="About-Airtable" class="common-anchor-header">關於 Airtable<button data-href="#About-Airtable" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://www.airtable.com/">Airtable</a>是領先的數位營運平台，可協助企業建立客製化應用程式、自動化工作流程，並管理企業規模的共用資料。Airtable 專為支援複雜的跨功能流程而設計，可協助團隊建立靈活的系統，在共用的真相來源上進行規劃、協調和執行。隨著 Airtable 擴展其人工智能驅動平台，Milvus 等技術在強化提供更快速、更智慧產品體驗所需的檢索基礎架構方面扮演重要角色。</p>
