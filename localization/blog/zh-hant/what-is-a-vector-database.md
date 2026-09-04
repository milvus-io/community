---
id: what-is-vector-database-and-how-it-works.md
title: 究竟什麼是向量資料庫，它又是如何運作的？
author: Zilliz
date: 2025-03-24T00:00:00.000Z
desc: 向量資料庫會儲存、索引並搜尋由機器學習模型所生成的向量嵌入，以實現快速的資訊檢索與相似度搜尋。
cover: assets.zilliz.com/What_s_a_Vector_Database_and_How_Does_It_Work_cac0875415.png
tag: Engineering
canonicalUrl: 'https://milvus.io/blog/what-is-a-vector-database.md'
---
<p>向量資料庫會為快速檢索和相似性搜尋建立索引並儲存向量嵌入，具備 CRUD 操作、元資料篩選和水平擴充等功能，專為 AI 應用程式所設計。</p>
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
    </button></h2><p>在 ImageNet 的早期，需要25,000名人工標註員手動為資料集標籤。這個驚人的數字凸顯了 AI 中的一項根本挑戰：手動分類非結構化資料根本無法擴充。由於每天都會產生數十億張圖片、影片、文件和音訊檔案，電腦理解和互動內容的方式需要一場典範轉移。</p>
<p><a href="https://zilliz.com/blog/relational-databases-vs-vector-databases">傳統關聯式資料庫</a>系統擅長管理具有預定義格式的結構化資料，並執行精確的搜尋操作。相比之下，向量資料庫專注於透過稱為向量嵌入的高維數值表示，來儲存和檢索<a href="https://zilliz.com/learn/introduction-to-unstructured-data">非結構化資料</a>類型，例如圖片、音訊、影片和文字內容。向量資料庫透過提供高效的資料檢索和管理來支援<a href="https://zilliz.com/glossary/large-language-models-(llms)">大型語言模型</a>。現代向量資料庫透過硬體感知最佳化（AVX512、SIMD、GPU、NVMe SSD）、高度最佳化的搜尋演算法（HNSW、IVF、DiskANN）和欄位導向的儲存設計，效能比傳統系統高出2-10倍。其雲原生的解耦架構能夠獨立擴充搜尋、資料插入和索引元件，使系統能夠在維持效能的同時，有效處理數十億個向量，以滿足 Salesforce、PayPal、eBay 和 NVIDIA 等公司的企業級 AI 應用需求。</p>
<p>這代表了專家所稱的「語意鴻溝」（semantic gap）——傳統資料庫以精確匹配和預定義關係運作，而人類對內容的理解則是細膩、情境化且多維度的。隨著 AI 應用需求日益提高，這個鴻溝變得越來越棘手：</p>
<ul>
<li><p>尋找概念相似性而非精確匹配</p></li>
<li><p>理解不同內容片段之間的脈絡關係</p></li>
<li><p>超越關鍵字，捕捉資訊的語意本質</p></li>
<li><p>在統一框架內處理多模態資料</p></li>
</ul>
<p>向量資料庫已成為彌合此鴻溝的關鍵技術，成為現代 AI 基礎架構中不可或缺的元件。它們透過促進聚類和分類等任務，來增強機器學習模型的效能。</p>
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
    </button></h2><p><a href="https://zilliz.com/glossary/vector-embeddings">向量嵌入</a>是跨越語意鴻溝的關鍵橋樑。這些高維數值表示以電腦可以有效處理的形式，捕捉非結構化資料的語意本質。現代的嵌入模型將原始內容（無論是文字、圖片或音訊）轉換為稠密向量，其中相似的概念在向量空間中會聚集在一起，無論表面層級的差異為何。</p>
<p>例如，正確建構的嵌入會將「automobile」、「car」和「vehicle」等概念置於向量空間中的相近位置，儘管它們的詞彙形式不同。這個特性使<a href="https://zilliz.com/glossary/semantic-search">語意搜尋</a>、<a href="https://zilliz.com/vector-database-use-cases/recommender-system">推薦系統</a>和 AI 應用程式能夠超越簡單的模式匹配來理解內容。</p>
<p>嵌入的威力延伸到各種模態。先進的向量資料庫支援在統一的系統中處理各種非結構化資料類型——文字、圖片、音訊——實現了以往無法有效建模的跨模態搜尋和關聯。這些向量資料庫的功能對於聊天機器人和影像辨識系統等 AI 驅動技術至關重要，支援語意搜尋和推薦系統等進階應用。</p>
<p>然而，大規模儲存、索引和檢索嵌入帶來了傳統資料庫天生無法應對的獨特計算挑戰。</p>
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
    </button></h2><p>向量資料庫代表了我們儲存和查詢非結構化資料方式的典範轉移。與擅長管理具有預定義格式的結構化資料的傳統關聯式資料庫系統不同，向量資料庫專注於透過數值向量表示來處理非結構化資料。</p>
<p>從核心來看，向量資料庫旨在解決一個根本問題：在大型非結構化資料集中實現高效的相似性搜尋。它們透過三個關鍵元件來達成此目標：</p>
<p><strong>向量嵌入</strong>：捕捉非結構化資料（文字、圖片、音訊等）語意意義的高維數值表示。</p>
<p><strong>專業索引</strong>：針對高維向量空間最佳化的演算法，可實現快速的近似搜尋。向量資料庫會索引向量，以提升相似性搜尋的速度和效率，利用各種 ML 演算法在向量嵌入上建立索引。</p>
<p><a href="https://zilliz.com/blog/similarity-metrics-for-vector-search"><strong>距離度量</strong></a>：量化向量之間相似度的數學函式。</p>
<p>向量資料庫中的主要操作是<a href="https://zilliz.com/blog/k-nearest-neighbor-algorithm-for-machine-learning">k 最近鄰</a>（KNN）查詢，它會找出與給定查詢向量最相似的 k 個向量。對於大規模應用，這些資料庫通常實作<a href="https://zilliz.com/glossary/anns">近似最近鄰</a>（ANN）演算法，以少量的精確度換取搜尋速度的顯著提升。</p>
<h3 id="Mathematical-Foundations-of-Vector-Similarity" class="common-anchor-header">向量相似性的數學基礎</h3><p>理解向量資料庫需要掌握向量相似性背後的數學原理。以下是基本概念：</p>
<h3 id="Vector-Spaces-and-Embeddings" class="common-anchor-header">向量空間與嵌入</h3><p><a href="https://zilliz.com/learn/everything-you-should-know-about-vector-embeddings">向量嵌入</a>是固定長度的浮點數陣列（維度範圍可從100到32,768！），以數值格式表示非結構化資料。這些嵌入將相似的項目置於高維向量空間中更近的位置。</p>
<p>例如，在訓練良好的詞嵌入空間中，「king」和「queen」這兩個詞的向量表示會比它們各自與「automobile」的距離更近。</p>
<h3 id="Distance-Metrics" class="common-anchor-header">距離度量</h3><p>距離度量的選擇從根本上影響相似性的計算方式。常見的距離度量包括：</p>
<ol>
<li><p><strong>歐幾里得距離</strong>：歐幾里得空間中兩點之間的直線距離。</p></li>
<li><p><strong>餘弦相似度</strong>：測量兩個向量之間夾角的餘弦值，專注於方向而非大小。</p></li>
<li><p><strong>點積</strong>：對於正規化向量，表示兩個向量的對齊程度。</p></li>
<li><p><strong>曼哈頓距離（L1 範數）</strong>：座標之間絕對差值的總和。</p></li>
</ol>
<p>不同的使用案例可能需要不同的距離度量。例如，餘弦相似度通常對文字嵌入效果良好，而歐幾里得距離可能更適合某些類型的<a href="https://zilliz.com/learn/image-embeddings-for-enhanced-image-search">影像嵌入</a>。</p>
<p>向量空間中向量之間的<a href="https://zilliz.com/glossary/semantic-similarity">語意相似性</a></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Semantic_similarity_between_vectors_in_a_vector_space_ee6fb35909.png" alt="Semantic similarity between vectors in a vector space" class="doc-image" id="semantic-similarity-between-vectors-in-a-vector-space" />
    <span>向量空間中向量之間的語意相似性</span>
  </span>
</p>
<p>理解這些數學基礎引出了一個關於實作的重要問題：那麼，只要在任何資料庫中加上向量索引就行了嗎？</p>
<p>單純在關聯式資料庫中加上向量索引是不夠的，使用獨立的<a href="https://zilliz.com/learn/comparing-vector-database-vector-search-library-and-vector-search-plugin">向量索引函式庫</a>也不夠。雖然向量索引提供了有效尋找相似向量的關鍵能力，但它們缺乏生產應用所需的基礎架構：</p>
<ul>
<li><p>它們不提供用於管理向量資料的 CRUD 操作</p></li>
<li><p>它們缺乏元資料儲存和篩選功能</p></li>
<li><p>它們沒有內建的擴充、複製或容錯能力</p></li>
<li><p>它們需要自訂基礎架構來進行資料持久化和管理</p></li>
</ul>
<p>向量資料庫的出現正是為了解決這些限制，提供專為向量嵌入設計的完整資料管理功能。它們結合了向量搜尋的語意能力與資料庫系統的操作能力。</p>
<p>與基於精確匹配運作的傳統資料庫不同，向量資料庫專注於語意搜尋——根據特定的距離度量，找出與查詢向量「最相似」的向量。這個根本差異驅動了這些專用系統背後的獨特架構和演算法。</p>
<p>其他專門的儲存系統也遵循同樣的邏輯——高頻率、按時間排序的事件資料通常存放在<a href="https://questdb.com/">時序資料庫</a>（例如 QuestDB）中，而向量資料庫則保存從中衍生的嵌入。</p>
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
          d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.
