---
id: unlock-geo-vector-search-with-geometry-fields-and-rtree-index-in-milvus.md
title: 空間與語義的結合：在 Milvus 中使用幾何欄位和 RTREE 索引解鎖地理向量搜尋
author: Cai Zhang
date: 2025-12-08T00:00:00.000Z
cover: assets.zilliz.com/rtree_cover_53c424f967.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus 2.6, Geometry field, RTREE index, Geo-Vector Search'
meta_title: |
  Milvus Geometry Field and RTREE Index for Geo-Vector Search
desc: 瞭解 Milvus 2.6 如何使用幾何欄位和 RTREE 索引將向量搜尋與地理空間索引統一，以實現精確、位置感知的 AI 檢索。
origin: >-
  https://milvus.io/blog/unlock-geo-vector-search-with-geometry-fields-and-rtree-index-in-milvus.md
---
<p>隨著現代系統日益智慧化，地理位置資料已成為人工智慧驅動的建議、智慧調度和自動駕駛等應用程式的必要資料。</p>
<p>舉例來說，當您在 DoorDash 或 Uber Eats 等平台上點餐時，系統考慮的不只是您與餐廳之間的距離。它還會衡量餐廳評分、快遞位置、交通狀況，甚至是您的個人偏好嵌入。在自動駕駛中，車輛必須執行路徑規劃、障礙偵測以及場景層級的語意理解，通常只需要幾毫秒的時間。</p>
<p>所有這些都取決於有效索引和擷取地理空間資料的能力。</p>
<p>傳統上，地理資料與向量資料分屬兩個獨立的系統：</p>
<ul>
<li><p>地理空間系統儲存坐標和空間關係（緯度、經度、多邊形區域等）。</p></li>
<li><p>向量資料庫則處理人工智能模型所產生的語意嵌入與相似性搜尋。</p></li>
</ul>
<p>這種分離方式使架構變得複雜、減慢查詢速度，並使應用程式難以同時執行空間與語意推理。</p>
<p><a href="https://milvus.io/docs/release_notes.md#v264">Milvus 2.6 針對</a>這個問題引入了<a href="https://milvus.io/docs/geometry-field.md">幾何領域 (Geometry Field)</a>，允許向量相似性搜尋直接與空間限制結合。這使得以下使用案例成為可能：</p>
<ul>
<li><p>位置基礎服務 (LBS)："在此城市區塊內尋找相似的 POI</p></li>
<li><p>多模式搜尋："檢索此點 1 公里範圍內的相似照片</p></li>
<li><p>地圖與物流：「區域內的資產 」或 「與路徑相交的路線」</p></li>
</ul>
<p>搭配全新的<a href="https://milvus.io/docs/rtree.md">RTREE 索引</a>(專為空間篩選最佳化的樹狀結構)，Milvus 現在可支援高效率的地理空間運算符號，例如<code translate="no">st_contains</code> 、<code translate="no">st_within</code> 和<code translate="no">st_dwithin</code> ，以及高維向量搜尋。這兩項功能的結合，讓空間感知的智慧型檢索不僅成為可能，而且更為實用。</p>
<p>在這篇文章中，我們將介紹幾何領域 (Geometry Field) 和 RTREE 索引如何運作，以及它們如何與向量相似性搜尋結合，以實現真實世界的空間語意應用程式。</p>
<h2 id="What-Is-a-Geometry-Field" class="common-anchor-header">什麼是幾何欄位？<button data-href="#What-Is-a-Geometry-Field" class="anchor-icon" translate="no">
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
    </button></h2><p>在 Milvus 中，<strong>Geometry Field</strong>是一種模式定義的資料類型 (<code translate="no">DataType.GEOMETRY</code>)，用來儲存幾何資料。與只處理原始坐標的系統不同，Milvus 支援一系列空間結構，包括<strong>Point</strong>、<strong>LineString</strong> 和<strong>Polygon</strong>。</p>
<p>這使得表示真實世界的概念成為可能，例如餐廳位置 (Point)、送貨區 (Polygon) 或自動駕駛車軌跡 (LineString)，這些都可以在相同的資料庫中儲存語意向量。換句話說，Milvus 成為一個統一的系統，可同時顯示某物的<em>位置</em>和<em>意義</em>。</p>
<p>幾何值使用<a href="https://en.wikipedia.org/wiki/Well-known_text_representation_of_geometry">Well-Known Text (WKT)</a>格式儲存，此格式是插入和查詢幾何資料的人類可讀標準。由於 WKT 字串可直接插入 Milvus 記錄中，因此簡化了資料擷取與查詢。例如</p>
<pre><code translate="no">data = [
    { 
        <span class="hljs-string">&quot;id&quot;</span>: <span class="hljs-number">1</span>,
        <span class="hljs-string">&quot;geo&quot;</span>: <span class="hljs-string">&quot;POINT(116.4074 39.9042)&quot;</span>,
        <span class="hljs-string">&quot;vector&quot;</span>: vector,
    }
]
<button class="copy-code-btn"></button></code></pre>
<h2 id="What-Is-the-RTREE-Index-and-How-Does-It-Work" class="common-anchor-header">什麼是 RTREE 索引，它是如何工作的？<button data-href="#What-Is-the-RTREE-Index-and-How-Does-It-Work" class="anchor-icon" translate="no">
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
    </button></h2><p>一旦 Milvus 引入了幾何資料類型，它也需要一個有效的方法來過濾空間物件。Milvus 使用兩個階段的空間篩選管道來處理：</p>
<ul>
<li><p><strong>粗略篩選：</strong>使用 RTREE 等空間索引快速縮小候選物件的範圍。</p></li>
<li><p><strong>精細篩選：</strong>對餘下的候選物件套用精確的幾何檢查，確保邊界的正確性。</p></li>
</ul>
<p>此流程的核心是<strong>RTREE (矩形樹)</strong>，這是專為多維幾何資料設計的空間索引結構。RTREE 透過分層組織幾何物件來加速空間查詢。</p>
<p><strong>第 1 階段：建立索引</strong></p>
<p><strong>1.建立葉節點：</strong>對於每個幾何物件，計算其<strong>最小邊界矩形 (MBR)</strong>- 完全包含該物件的最小矩形，並將其儲存為葉節點。</p>
<p><strong>2.組合成較大的方塊：</strong>集群附近的葉節點，並將每個群組包覆在新的 MBR 內，產生內部節點。</p>
<p><strong>3.新增根節點：</strong>建立一個根節點，其 MBR 涵蓋所有內部群組，形成高度平衡的樹狀結構。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/RTREE_Index_11b5d09e07.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>第二階段：加速查詢</strong></p>
<p><strong>1.形成查詢 MBR：</strong>為查詢中使用的幾何圖形計算 MBR。</p>
<p><strong>2.修剪分支：</strong>從根開始，比較查詢 MBR 與每個內部節點。跳過任何 MBR 與查詢 MBR 沒有交集的分支。</p>
<p><strong>3.收集候選：</strong>下降到相交的分支，並收集候選葉節點。</p>
<p><strong>4.執行精確匹配：</strong>針對每個候選節點，執行空間謂語以獲得精確結果。</p>
<h3 id="Why-RTREE-Is-Fast" class="common-anchor-header">RTREE 快速的原因</h3><p>RTREE 在空間篩選方面提供強大的效能，是因為幾個關鍵的設計特點：</p>
<ul>
<li><p><strong>每個節點都儲存一個 MBR：</strong>每個節點都近似其子樹中所有幾何圖形的面積。這可讓您輕鬆決定在查詢過程中是否要探索某個分支。</p></li>
<li><p><strong>快速剪枝：</strong>僅探索 MBR 與查詢區域相交的子樹。不相關的區域會被完全忽略。</p></li>
<li><p><strong>隨資料大小調整：</strong>RTREE 支援在<strong>O(log N)</strong>時間內進行空間搜尋，即使資料集不斷擴大，也能進行快速查詢。</p></li>
<li><p><strong>Boost.Geometry 實作：</strong>Milvus 使用<a href="https://www.boost.org/library/latest/geometry/">Boost.Geometry</a> 建立 RTREE 索引，<a href="https://www.boost.org/library/latest/geometry/">Boost.Geometry</a> 是一個廣泛使用的 C++ 函式庫，提供最佳化的幾何演算法，以及適用於並發工作負載的線程安全 RTREE 實作。</p></li>
</ul>
<h3 id="Supported-geometry-operators" class="common-anchor-header">支援的幾何運算符號</h3><p>Milvus 提供一組空間運算子，可讓您根據幾何關係過濾和擷取實體。對於需要瞭解物件在空間中如何相互關聯的工作負載而言，這些運算符號是不可或缺的。</p>
<p>下表列出 Milvus 目前可用的<a href="https://milvus.io/docs/geometry-operators.md">幾何運算符號</a>。</p>
<table>
<thead>
<tr><th style="text-align:center"><strong>操作員</strong></th><th style="text-align:center"><strong>說明</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center"><strong>st_intersects(A, B)</strong></td><td style="text-align:center">如果幾何圖 A 和 B 至少有一個共同點，則傳回值為 TRUE。</td></tr>
<tr><td style="text-align:center"><strong>st_contains(A, B)</strong></td><td style="text-align:center">如果幾何圖 A 完全包含幾何圖 B (不包含邊界)，則傳回值為 TRUE。</td></tr>
<tr><td style="text-align:center"><strong>st_within(A, B)</strong></td><td style="text-align:center">如果幾何圖形 A 完全包含在幾何圖形 B 中，則傳回值為 TRUE。</td></tr>
<tr><td style="text-align:center"><strong>st_covers(A, B)</strong></td><td style="text-align:center">如果幾何圖形 A 包覆幾何圖形 B (包括邊界)，則傳回值為 TRUE。</td></tr>
<tr><td style="text-align:center"><strong>st_touches(A, B)</strong></td><td style="text-align:center">如果幾何圖形 A 和 B 在邊界相接，但內部沒有相交，則傳回值 TRUE。</td></tr>
<tr><td style="text-align:center"><strong>st_equals(A, B)</strong></td><td style="text-align:center">如果幾何圖 A 和 B 在空間上相同，則傳回值為 TRUE。</td></tr>
<tr><td style="text-align:center"><strong>st_overlaps(A, B)</strong></td><td style="text-align:center">如果幾何圖 A 與 B 部分重疊，且兩者都不完全包含對方，則傳回 TRUE。</td></tr>
<tr><td style="text-align:center"><strong>st_dwithin(A, B, d)</strong></td><td style="text-align:center">如果 A 和 B 之間的距離小於<em>d</em>，則傳回 TRUE。</td></tr>
</tbody>
</table>
<h3 id="How-to-Combine-Geolocation-Index-and-Vector-Index" class="common-anchor-header">如何結合地理位置索引與向量索引</h3><p>有了幾何支援和 RTREE 索引，Milvus 可以在單一工作流程中結合地理空間篩選和向量相似性搜尋。這個過程分兩個步驟</p>
<p><strong>1.使用 RTREE 依位置篩選：</strong>Milvus 首先使用 RTREE 索引，將搜尋範圍縮小至指定地理範圍內的實體 (例如「2 公里內」)。</p>
<p><strong>2.使用向量搜尋依語意排序：</strong>向量索引會根據嵌入相似度，從剩餘的候選項中選擇 Top-N 最相似的結果。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Geometry_R_Tree_f1d88fc252.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Real-World-Applications-of-Geo-Vector-Retrieval" class="common-anchor-header">地理向量檢索的實際應用<button data-href="#Real-World-Applications-of-Geo-Vector-Retrieval" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="1-Delivery-Services-Smarter-Location-Aware-Recommendations" class="common-anchor-header">1.配送服務：更聰明、位置感知的推薦</h3><p>DoorDash 或 Uber Eats 等平台每天要處理數以億計的請求。當使用者打開應用程式的那一刻，系統必須根據使用者的位置、時間、口味偏好、預計送貨時間、即時交通流量和快遞公司的可用性來判斷哪些餐廳或快遞公司是<em>目前</em>最適合的。</p>
<p>傳統上，這需要查詢地理空間資料庫和單獨的推薦引擎，然後進行多輪篩選和重新排序。有了地理位置索引，Milvus 大幅簡化了這個工作流程：</p>
<ul>
<li><p><strong>統一儲存</strong>- 餐廳座標、快遞位置和使用者偏好嵌入都儲存在一個系統中。</p></li>
<li><p><strong>聯合檢索</strong>- 首先套用空間篩選 (例如，<em>3 公里內的餐廳</em>)，然後再使用向量搜尋，以相似度、口味偏好或品質進行排序。</p></li>
<li><p><strong>動態決策</strong>- 結合即時快遞分佈與交通信號，快速指派最近、最適合的快遞。</p></li>
</ul>
<p>這種統一的方法可讓平台在單一查詢中執行空間和語意推理。舉例來說，當使用者搜尋「咖哩飯」時，Milvus 會檢索語意相關的餐廳<em>，並優</em>先考慮鄰近、送貨速度快、且符合使用者過往口味習慣的餐廳。</p>
<h3 id="2-Autonomous-Driving-More-Intelligent-Decisions" class="common-anchor-header">2.自動駕駛：更智慧的決策</h3><p>在自動駕駛中，地理空間索引是感知、定位和決策的基礎。車輛必須持續對準高解析度地圖、偵測障礙物，並規劃安全軌跡，而這一切都必須在幾毫秒之內完成。</p>
<p>透過 Milvus，Geometry 類型和 RTREE 索引可以儲存和查詢豐富的空間結構，例如</p>
<ul>
<li><p><strong>道路邊界</strong>(LineString)</p></li>
<li><p><strong>交通管制區</strong>（多邊形）</p></li>
<li><p><strong>偵測到的障礙</strong>(點)</p></li>
</ul>
<p>這些結構可以有效率地建立索引，讓地理空間資料直接參與 AI 決策迴圈。例如，只需透過 RTREE 空間謂語，自動駕駛車輛就能快速判斷其目前座標是否位於特定車道或與限制區域相交。</p>
<p>當與感知系統產生的向量內嵌結合時 (例如捕捉目前駕駛環境的場景內嵌)，Milvus 可支援更進階的查詢，例如擷取半徑 50 公尺範圍內與目前駕駛類似的歷史駕駛情境。這有助於模型更快地詮釋環境，並做出更好的決策。</p>
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
    </button></h2><p>地理位置不只是經度與緯度，它更是寶貴的語意資訊來源，能告訴我們事情發生的地點、它們與周遭環境的關係，以及它們屬於何種情境。</p>
<p>在 Zilliz 的下一代資料庫中，向量資料與地理空間資訊逐漸結合為統一的基礎。這樣就能</p>
<ul>
<li><p>跨向量、地理空間資料和時間的聯合檢索</p></li>
<li><p>空間感知推薦系統</p></li>
<li><p>多模式、基於位置的搜尋 (LBS)</p></li>
</ul>
<p>在未來，人工智能不僅能瞭解內容<em>的</em>意義，還能瞭解其適用的位置以及最重要的時間。</p>
<p>如需更多關於 Geometry Field 和 RTREE 索引的資訊，請查看以下說明文件：</p>
<ul>
<li><p><a href="https://milvus.io/docs/geometry-field.md">Geometry Field | Milvus 文件</a></p></li>
<li><p><a href="https://milvus.io/docs/rtree.md">RTREE | Milvus 文件</a></p></li>
</ul>
<p>對最新 Milvus 的任何功能有問題或想要深入瞭解？加入我們的<a href="https://discord.com/invite/8uyFbECzPX"> Discord 頻道</a>或在<a href="https://github.com/milvus-io/milvus"> GitHub</a> 上提出問題。您也可以透過<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus Office Hours</a> 預約 20 分鐘的一對一課程，以獲得深入的瞭解、指導和問題解答。</p>
<h2 id="Learn-More-about-Milvus-26-Features" class="common-anchor-header">進一步了解 Milvus 2.6 功能<button data-href="#Learn-More-about-Milvus-26-Features" class="anchor-icon" translate="no">
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
<li><p><a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md">介紹 Milvus 2.6：十億規模的經濟實惠向量搜尋</a></p></li>
<li><p><a href="https://milvus.io/blog/data-in-and-data-out-in-milvus-2-6.md">介紹嵌入功能：Milvus 2.6 如何簡化矢量化和語意搜尋</a></p></li>
<li><p><a href="https://milvus.io/blog/json-shredding-in-milvus-faster-json-filtering-with-flexibility.md">Milvus的JSON粉碎功能：彈性化JSON篩選速度提升88.9倍</a></p></li>
<li><p><a href="https://milvus.io/blog/unlocking-true-entity-level-retrieval-new-array-of-structs-and-max-sim-capabilities-in-milvus.md">解鎖真正的實體層級檢索：Milvus 中新的結構陣列與 MAX_SIM 功能</a></p></li>
<li><p><a href="https://milvus.io/blog/minhash-lsh-in-milvus-the-secret-weapon-for-fighting-duplicates-in-llm-training-data.md">Milvus 中的 MinHash LSH：對抗 LLM 訓練資料中重複資料的秘密武器 </a></p></li>
<li><p><a href="https://milvus.io/blog/bring-vector-compression-to-the-extreme-how-milvus-serves-3%C3%97-more-queries-with-rabitq.md">將向量壓縮發揮到極致：Milvus 如何利用 RaBitQ 提供多 3 倍的查詢服務</a></p></li>
<li><p><a href="https://milvus.io/blog/benchmarks-lie-vector-dbs-deserve-a-real-test.md">基準會說謊 - 向量資料庫應該接受真正的測試 </a></p></li>
<li><p><a href="https://milvus.io/blog/we-replaced-kafka-pulsar-with-a-woodpecker-for-milvus.md">我們為 Milvus 用啄木鳥取代了 Kafka/Pulsar </a></p></li>
<li><p><a href="https://milvus.io/blog/how-to-filter-efficiently-without-killing-recall.md">現實世界中的向量搜尋：如何有效率地過濾而不損害回復率</a></p></li>
</ul>
