---
id: understanding-consistency-levels-in-the-milvus-vector-database.md
title: 瞭解 Milvus 向量資料庫的一致性等級
author: Chenglong Li
date: 2022-08-29T00:00:00.000Z
desc: 瞭解 Milvus 向量資料庫支援的四種一致性層級 - 強、有界線僵化、會話和最終。
cover: assets.zilliz.com/1280_X1280_0e0d4bc107.png
tag: Engineering
tags: 'Vector Database for AI, Artificial Intelligence, Machine Learning'
canonicalUrl: >-
  https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database.md
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1280_X1280_0e0d4bc107.png" alt="Cover_image" class="doc-image" id="cover_image" />
   </span> <span class="img-wrapper"> <span>封面圖片</span> </span></p>
<blockquote>
<p>本文由<a href="https://github.com/JackLCL">李成龍</a>撰寫，<a href="https://www.linkedin.com/in/yiyun-n-2aa713163/">倪安琪</a>轉載。</p>
</blockquote>
<p>您有沒有想過，為什麼有時候您從 Mlivus 向量資料庫中刪除的資料仍然會出現在搜尋結果中呢？</p>
<p>一個很可能的原因是您沒有為您的應用程式設定適當的一致性等級。在分散式向量資料庫中，一致性等級是非常重要的，因為它決定了特定資料寫入在哪個階段可以被系統讀取。</p>
<p>因此，本文旨在揭開一致性概念的神秘面紗，並深入探討 Milvus 向量資料庫所支援的一致性等級。</p>
<p><strong>跳到</strong></p>
<ul>
<li><a href="#What-is-consistency">什麼是一致性</a></li>
<li><a href="#Four-levels-of-consistency-in-the-Milvus-vector-database">Milvus 向量資料庫的四種一致性等級</a><ul>
<li><a href="#Strong">強</a></li>
<li><a href="#Bounded-staleness">有限制的僵化</a></li>
<li><a href="#Session">會話</a></li>
<li><a href="#Eventual">最終</a></li>
</ul></li>
</ul>
<h2 id="What-is-consistency" class="common-anchor-header">什麼是一致性<button data-href="#What-is-consistency" class="anchor-icon" translate="no">
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
    </button></h2><p>在開始之前，我們需要先澄清一致性在本文中的內涵，因為「一致性」一詞在電腦產業中是一個過載的名詞。在分散式資料庫中，一致性特別指的是確保每個節點或副本在特定時間寫入或讀取資料時擁有相同資料視圖的屬性。因此，在此我們談論的是<a href="https://en.wikipedia.org/wiki/CAP_theorem">CAP 理論</a>中的一致性。</p>
<p>在現代世界中，為了服務大量的線上企業，通常會採用多個副本。例如，線上電子商務巨頭 Amazon 在多個資料中心、區域甚至國家之間複製其訂單或 SKU 資料，以確保在系統崩潰或故障時系統的高可用性。這對系統提出了挑戰 - 跨多個副本的資料一致性。如果沒有一致性，Amazon 購物車中被刪除的商品很可能會重新出現，造成非常糟糕的使用者體驗。</p>
<p>因此，我們需要為不同的應用程式提供不同的資料一致性等級。幸運的是，Milvus 這個人工智能資料庫在一致性層級上提供彈性，您可以設定最適合您應用程式的一致性層級。</p>
<h3 id="Consistency-in-the-Milvus-vector-database" class="common-anchor-header">Milvus 向量資料庫的一致性</h3><p>一致性等級的概念是在 Milvus 2.0 發表時首次提出的。Milvus 1.0 版本不是分散式向量資料庫，所以我們當時沒有涉及可調整的一致性等級。Milvus 1.0 每秒刷新一次資料，這表示新資料插入後幾乎立即可見，而且 Milvus 會在向量相似性搜尋或查詢請求來臨時讀取最新的資料視圖。</p>
<p>然而，Milvus 在其 2.0 版本中進行了重構，<a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md">Milvus 2.0 是</a>基於 pub-sub 機制的<a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md">分散式向量資料庫</a>。<a href="https://en.wikipedia.org/wiki/PACELC_theorem">PACELC</a>理論指出，分散式系統必須在一致性、可用性和延遲之間作出取捨。此外，不同層級的一致性適用於不同的情境。因此，<a href="https://milvus.io/blog/2022-1-25-annoucing-general-availability-of-milvus-2-0.md">Milvus 2.0</a>引入了一致性的概念，並支援調整一致性等級。</p>
<h2 id="Four-levels-of-consistency-in-the-Milvus-vector-database" class="common-anchor-header">Milvus 向量資料庫的四種一致性等級<button data-href="#Four-levels-of-consistency-in-the-Milvus-vector-database" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 支援四個層級的一致性：強、有邊界的僵化、會話和最終。而 Milvus 使用者可以在<a href="https://milvus.io/docs/v2.1.x/create_collection.md">建立資料集</a>、進行<a href="https://milvus.io/docs/v2.1.x/search.md">向量相似性搜尋或</a> <a href="https://milvus.io/docs/v2.1.x/query.md">查詢</a>時指定一致性等級。本節將繼續解釋這四種一致性等級的差異，以及它們最適合哪種情況。</p>
<h3 id="Strong" class="common-anchor-header">強</h3><p>Strong 是最高、最嚴格的一致性等級。它可確保使用者能讀取最新版本的資料。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Consistency_Strong_5d791eb8b2.png" alt="Strong" class="doc-image" id="strong" />
   </span> <span class="img-wrapper"> <span>強</span> </span></p>
<p>根據 PACELC 理論，如果一致性等級設定為強，延遲會增加。因此，我們建議在功能測試時選擇強一致性，以確保測試結果的準確性。此外，強一致性也最適合對資料一致性有嚴格要求，但卻犧牲搜尋速度的應用程式。例如，處理訂單付款和帳單的線上財務系統。</p>
<h3 id="Bounded-staleness" class="common-anchor-header">有限制的陳舊性</h3><p>有界僵化，顧名思義，允許資料在某段時間內不一致。然而，一般而言，在該期間外的資料總是全局一致的。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Consistency_Bounded_c034bc6e51.png" alt="Bounded_staleness" class="doc-image" id="bounded_staleness" />
   </span> <span class="img-wrapper"> <span>有界</span> </span>僵化</p>
<p>Bounded staleness 適用於需要控制搜尋延遲，並且可以接受零星資料不存在的情況。例如，在視訊推薦引擎等推薦系統中，資料偶爾不存在對整體召回率的影響其實很小，但卻能大幅提升推薦系統的效能。舉例來說，您可以使用應用程式來追蹤線上訂單的狀態。</p>
<h3 id="Session" class="common-anchor-header">會話</h3><p>Session 可確保所有寫入的資料都能在同一個 session 中立即被讀取。換句話說，當您透過一個用戶端寫入資料時，新插入的資料會立即成為可搜尋的資料。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Consistency_Session_6dc4782212.png" alt="Session" class="doc-image" id="session" />
   </span> <span class="img-wrapper"> <span>會話</span> </span></p>
<p>我們建議在對同一會話中的資料一致性要求較高的情況下，選擇 Session 作為一致性層級。例如：從圖書館系統中刪除一個書籍條目的資料，在確認刪除並重 新刷新頁面（不同的會話）後，搜尋結果中應該不再顯示該書籍。</p>
<h3 id="Eventual" class="common-anchor-header">最終</h3><p>讀取與寫入的順序並無保證，只要不再進行寫入作業，副本最終都會收斂到相同的狀態。在最終一致性下，副本會以最新更新的值開始執行讀取要求。最終一致性是四種一致性中最弱的一種。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Consistency_Eventual_7c66dd5b6f.png" alt="Eventual" class="doc-image" id="eventual" />
   </span> <span class="img-wrapper"> <span>最終</span> </span></p>
<p>然而，根據 PACELC 理論，犧牲一致性可以大幅縮短搜尋延遲。因此，最終一致性最適合對資料一致性要求不高，但需要極快搜尋效能的情況。例如，使用最終一致性檢索 Amazon 產品的評論和評分。</p>
<h2 id="Endnote" class="common-anchor-header">尾註<button data-href="#Endnote" class="anchor-icon" translate="no">
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
    </button></h2><p>回到本文一開始提出的問題，刪除的資料仍會以搜尋結果的方式傳回，因為使用者並未選擇適當的一致性層級。在 Milvus 向量資料庫中，一致性等級的預設值是有界僵化 (<code translate="no">Bounded</code>)。因此，資料讀取可能會滯後，Milvus 可能會碰巧在您進行相似性搜尋或查詢時進行刪除操作之前讀取資料檢視。不過，這個問題很容易解決。您只需要在建立資料集、進行向量相似性搜尋或查詢時，<a href="https://milvus.io/docs/v2.1.x/tune_consistency.md">調整一致性等級</a>。很簡單！</p>
<p>在下一篇文章中，我們將揭露背後的機制，並解釋 Milvus 向量資料庫如何達到不同等級的一致性。敬請期待！</p>
<h2 id="Whats-next" class="common-anchor-header">下一步<button data-href="#Whats-next" class="anchor-icon" translate="no">
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
    </button></h2><p>隨著 Milvus 2.1 正式發行，我們準備了一系列介紹新功能的部落格。閱讀此系列部落格的更多內容：</p>
<ul>
<li><a href="https://milvus.io/blog/2022-08-08-How-to-use-string-data-to-empower-your-similarity-search-applications.md">如何使用字串資料來強化您的相似性搜尋應用程式</a></li>
<li><a href="https://milvus.io/blog/embedded-milvus.md">使用 Embedded Milvus 即時以 Python 安裝及執行 Milvus</a></li>
<li><a href="https://milvus.io/blog/in-memory-replicas.md">使用內建記憶體複本提高向量資料庫的讀取吞吐量</a></li>
<li><a href="https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database.md">瞭解 Milvus 向量資料庫的一致性等級</a></li>
<li><a href="https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database-2.md">瞭解 Milvus Vector 資料庫的一致性層級（第二部分）</a></li>
<li><a href="https://milvus.io/blog/data-security.md">Milvus Vector 資料庫如何確保資料安全？</a></li>
</ul>
