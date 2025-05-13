---
id: how-to-filter-efficiently-without-killing-recall.md
title: 真實世界中的矢量搜尋：如何有效篩選而不損害回憶力
author: Chris Gao and Patrick Xu
date: 2025-05-12T00:00:00.000Z
desc: 本部落格將探討向量搜尋中常用的過濾技術，以及我們內建於 Milvus 和 Zilliz Cloud 的創新最佳化技術。
cover: assets.zilliz.com/Filter_Efficiently_Without_Killing_Recall_1c355c229c.png
tag: Engineering
tags: 'Vector search, filtering vector search, vector search with filtering'
recommend: true
canonicalUrl: 'https://milvus.io/blog/how-to-filter-efficiently-without-killing-recall.md'
---
<p>許多人認為向量搜尋只不過是執行 ANN（近似近鄰）演算法，然後就可以了事。但如果您在生產中執行向量搜尋，您就會知道真相：它很快就會變得複雜。</p>
<p>想像您正在建立一個產品搜尋引擎。使用者可能會問：「<em>請顯示與這張照片相似的鞋子，但必須是紅色且價格在 100 美元以下</em>」。提供此查詢需要將元資料篩選器套用至語意相似性搜尋結果。聽起來就像在向量搜尋返回後套用篩選程式一樣簡單？嗯，不盡然。</p>
<p>如果您的篩選條件具有高度選擇性，會發生什麼情況？您可能無法傳回足夠的結果。而簡單地增加向量搜尋的<strong>topK</strong>參數可能會迅速降低效能，並消耗更多的資源來處理相同的搜尋量。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Show_me_shoes_similar_to_this_photo_but_only_in_red_and_under_100_0862a41a60.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>在引擎蓋下，有效率的元資料篩選相當具有挑戰性。您的向量資料庫需要掃描圖表索引、套用元資料篩選器，並在嚴格的延遲預算（例如 20 毫秒）內回應。每秒服務數千次這樣的查詢而不致破產，需要深思熟慮的工程和仔細的最佳化。</p>
<p>本篇部落格將探討向量搜尋中常用的篩選技術，以及我們內建於<a href="https://milvus.io/docs/overview.md">Milvus</a>向量資料庫及其全面管理雲端服務<a href="https://zilliz.com/cloud">(Zilliz Cloud</a>) 中的創新最佳化技術。我們也會分享一個基準測試，證明以 1000 美元的雲端預算，完全管理的 Milvus 所能達到的效能比其他向量資料庫高出多少。</p>
<h2 id="Graph-Index-Optimization" class="common-anchor-header">圖形索引最佳化<button data-href="#Graph-Index-Optimization" class="anchor-icon" translate="no">
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
    </button></h2><p>向量資料庫需要有效率的索引方法來處理大型資料集。如果沒有索引，資料庫必須將您的查詢與資料集中的每個向量進行比較（暴力掃描），隨著資料的增加，速度會變得極慢。</p>
<p><strong>Milvus</strong>支援多種索引類型來解決這個效能挑戰。最受歡迎的是以圖表為基礎的索引類型：HNSW (完全在記憶體中執行) 和 DiskANN (同時有效使用記憶體和 SSD)。這些索引將向量組織成網路架構，其中向量的鄰域在地圖上相連，允許搜尋快速導航到相關結果，同時只檢查所有向量的一小部分。全面管理的 Milvus 服務<strong>Zilliz Cloud</strong> 更進一步，引進先進的專屬向量搜尋引擎 Cardinal，進一步強化這些索引，以獲得更好的效能。</p>
<p>然而，當我們加入篩選要求 (例如「只顯示低於 100 美元的產品」)，新的問題就出現了。標準的方法是建立一個<em>bitset</em>- 標記哪些向量符合篩選條件的清單。在搜尋過程中，系統只會考慮在這個 bitset 中標記為有效的向量。這種方法看似合乎邏輯，但卻產生了一個嚴重的問題：<strong>連通性受損</strong>。當許多向量被篩選出來時，我們圖形索引中精心建構的路徑就會被打亂。</p>
<p>這裡有一個簡單的例子說明這個問題：在下圖中，A 點連接到 B、C 和 D，但 B、C 和 D 並沒有直接連接到彼此。如果我們的篩選程式移除 A 點 (也許它太貴了)，那麼即使 B、C 和 D 與我們的搜尋相關，它們之間的路徑也會中斷。這會造成「孤島」狀的斷連向量，在搜尋過程中變得無法到達，損害搜尋結果的品質 (回復率)。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/simple_example_of_the_problem_0f09b36639.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>在圖表遍歷過程中，有兩種常見的篩選方法：事先排除所有篩選出來的點，或是包含所有點，然後再套用篩選器。如下圖所示，這兩種方法都不理想。當過濾比率接近 1 時，完全跳過過濾點會導致召回率崩潰（藍線），而不論元資料為何，都要造訪每個點會使搜尋空間變得龐大，並大幅降低效能（紅線）。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Filtering_ratio_911e32783b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>研究人員提出了幾種方法，以在召回率和效能之間取得平衡：</p>
<ol>
<li><strong>Alpha 策略：</strong>這引入了一種概率方法：即使向量不符合篩選條件，我們仍有可能在搜尋期間以某種概率造訪它。這個概率 (alpha) 取決於篩選比率 - 篩選的嚴格程度。這有助於維護圖表中的基本連線，而不會造訪太多不相干的向量。</li>
</ol>
<ol start="2">
<li><strong>ACORN 方法 [1]：</strong>在標準 HNSW 中，索引建構期間會使用邊緣修剪來建立稀疏圖形，並加快搜尋速度。ACORN 方法刻意跳過此剪枝步驟，以保留更多邊緣並強化連線性，這在篩選器可能排除許多節點時非常重要。在某些情況下，ACORN 也會透過收集額外的近似近鄰來擴大每個節點的鄰居列表，進一步強化圖形。此外，它的遍歷演算法會往前看兩步 (也就是檢視鄰居的鄰居)，即使在過濾比率很高的情況下，也能提高找到有效路徑的機會。</li>
</ol>
<ol start="3">
<li><strong>動態選擇鄰居：</strong>一種比 Alpha Strategy 更進步的方法。這種方法不依賴概率跳過，而是在搜尋過程中自適應地選擇下一個節點。它提供比 Alpha Strategy 更多的控制。</li>
</ol>
<p>在 Milvus 中，我們在實施 Alpha 策略的同時，也實施了其他優化技術。舉例來說，當偵測到選擇性極高的篩選條件時，它會動態切換策略：例如，當約 99% 的資料不符合篩選表達式時，「包含所有」策略會導致圖形遍歷路徑大幅延長，造成效能下降和孤立的資料「孤島」。在這種情況下，Milvus 會自動退回到暴力掃描，完全繞過圖形索引以獲得更好的效率。在 Cardinal 這個提供全面管理 Milvus (Zilliz Cloud) 功能的向量搜尋引擎中，我們更進一步實作了「包含所有」與「排除所有」遍歷方法的動態組合，可根據資料統計進行智慧型調整，以最佳化查詢效能。</p>
<p>我們使用 AWS r7gd.4xlarge 實例在 Cohere 1M 資料集（維數 = 768）上進行的實驗證明了這種方法的有效性。在下面的圖表中，藍線代表我們的動態組合策略，紅線則說明遍歷圖表中所有篩選點的基線方法。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Graph_2_067a13500b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Metadata-Aware-Indexing" class="common-anchor-header">元資料感知索引<button data-href="#Metadata-Aware-Indexing" class="anchor-icon" translate="no">
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
    </button></h2><p>另一個挑戰來自於元資料與向量嵌入之間的關係。在大多數應用中，項目元資料屬性（例如產品價格）與向量實際代表的內容（語義意義或視覺特徵）關係極小。舉例來說，一件<span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>90dressanda90</mi></mrow><annotation encoding="application/x-tex">連身裙和一件</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.6944em;"></span><span class="mord mathnormal">90dressanda90</span></span></span></span>皮帶的價格相同，但卻呈現完全不同的視覺特徵。這種脫節使得篩選與向量搜尋的結合本身就缺乏效率。</p>
<p>為了解決這個問題，我們開發了<strong>元資料感知向量索引</strong>。它並非只有一個圖表適用於所有向量，而是針對不同的元資料值建立專門的「子圖表」。例如，如果您的資料有「顏色」和「形狀」欄位，它會為這些欄位建立獨立的圖形結構。</p>
<p>當您使用類似「顏色 = 藍色」的篩選項進行搜尋時，它會使用特定於顏色的子圖形，而非主圖形。這會快很多，因為子圖形已經根據您要篩選的元資料組織好了。</p>
<p>在下圖中，主圖索引稱為<strong>基本圖</strong>，而針對特定元資料欄位建立的專用圖則稱為<strong>列圖</strong>。為了有效管理記憶體使用量，它會限制每個點可以有多少連線 (out-degree)。當搜尋不包含任何元資料篩選器時，它會預設為基本圖形。當應用篩選條件時，它會切換到適當的列圖，提供顯著的速度優勢。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Metadata_Aware_Indexing_7c3e0707d9.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Iterative-Filtering" class="common-anchor-header">迭代篩選<button data-href="#Iterative-Filtering" class="anchor-icon" translate="no">
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
    </button></h2><p>有時候篩選本身會成為瓶頸，而不是向量搜尋。這種情況特別發生在複雜的篩選器上，例如 JSON 條件或詳細的字串比較。傳統的方法 (先過濾，再搜尋) 可能會非常慢，因為系統甚至在開始向量搜尋之前，就必須在可能數百萬筆的記錄上評估這些昂貴的過濾器。</p>
<p>您可能會想：「為何不先進行向量搜尋，然後再篩選最頂端的結果？這種方法有時可行，但有一個很大的缺點：如果您的篩選條件很嚴格，篩選出大部分的結果，您可能會在篩選後得到太少（或零）的結果。</p>
<p>為了解決這個難題，我們在 Milvus 和 Zilliz Cloud 中創造了<strong>迭代篩選 (Iterative Filtering</strong>)，靈感來自<a href="https://www.usenix.org/system/files/osdi23-zhang-qianxi_1.pdf"> VBase</a>。迭代篩選並非採用全有或全無的方式，而是分批進行：</p>
<ol>
<li><p>取得一批最接近的向量匹配結果</p></li>
<li><p>將篩選器套用至此批次</p></li>
<li><p>如果我們沒有足夠的篩選結果，再取得另一批</p></li>
<li><p>重複，直到我們得到所需數量的結果</p></li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Iterative_Filtering_b65a057559.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>此方法可大幅減少我們需要執行的昂貴篩選操作，同時仍能確保我們獲得足夠的高品質結果。有關啟用迭代篩選的詳細資訊，請參閱此<a href="https://docs.zilliz.com/docs/filtered-search#iterative-filtering">迭代篩選文件頁面</a>。</p>
<h2 id="External-Filtering" class="common-anchor-header">外部篩選<button data-href="#External-Filtering" class="anchor-icon" translate="no">
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
    </button></h2><p>許多現實世界的應用程式會將資料分割到不同的系統中 - 向量資料庫中的向量和傳統資料庫中的元資料。舉例來說，許多組織將產品描述和使用者評論以向量的形式儲存在 Milvus 中以進行語意搜尋，而將庫存狀態、價格和其他結構化資料儲存在 PostgreSQL 或 MongoDB 等傳統資料庫中。</p>
<p>這種分離在架構上是合理的，但卻為篩選搜尋帶來了挑戰。典型的工作流程如下</p>
<ul>
<li><p>查詢關聯式資料庫中符合篩選條件 (例如：「50 美元以下的庫存商品」) 的記錄</p></li>
<li><p>取得符合條件的 ID 並傳送給 Milvus 以過濾向量搜尋</p></li>
<li><p>僅對符合這些 ID 的向量執行語意搜尋</p></li>
</ul>
<p>這聽起來很簡單，但是當行數超過數百萬時，就會變成瓶頸。傳輸大量的 ID 清單會消耗網路頻寬，而在 Milvus 中執行大量的篩選表達式也會增加開銷。</p>
<p>為了解決這個問題，我們在 Milvus 中引入了<strong>外部篩選 (External</strong>Filtering)，這是一個輕量級的 SDK 級解決方案，使用搜尋迭接器 API 並顛倒傳統的工作流程。</p>
<ul>
<li><p>首先執行向量搜尋，擷取成批語意最相關的候選項目</p></li>
<li><p>在客戶端將您自訂的篩選功能套用至每個批次</p></li>
<li><p>自動擷取更多批次，直到有足夠的篩選結果為止</p></li>
</ul>
<p>這種分批迭代的方法可大幅降低網路流量和處理開銷，因為您只處理向量搜尋中最有希望的候選項目。</p>
<p>以下是在 pymilvus 中使用 External Filtering 的範例：</p>
<pre><code translate="no">vector_to_search = rng.random((<span class="hljs-number">1</span>, DIM), np.float32)
expr = <span class="hljs-string">f&quot;10 &lt;= <span class="hljs-subst">{AGE}</span> &lt;= 25&quot;</span>
valid_ids = [<span class="hljs-number">1</span>, <span class="hljs-number">12</span>, <span class="hljs-number">123</span>, <span class="hljs-number">1234</span>]

<span class="hljs-keyword">def</span> <span class="hljs-title function_">external_filter_func</span>(<span class="hljs-params">hits: Hits</span>):
    <span class="hljs-keyword">return</span> <span class="hljs-built_in">list</span>(<span class="hljs-built_in">filter</span>(<span class="hljs-keyword">lambda</span> hit: hit.<span class="hljs-built_in">id</span> <span class="hljs-keyword">in</span> valid_ids, hits))

search_iterator = milvus_client.search_iterator(
    collection_name=collection_name,
    data=vector_to_search,
    batch_size=<span class="hljs-number">100</span>,
    anns_field=PICTURE,
    <span class="hljs-built_in">filter</span>=expr,
    external_filter_func=external_filter_func,
    output_fields=[USER_ID, AGE]
)

<span class="hljs-keyword">while</span> <span class="hljs-literal">True</span>:
    res = search_iterator.<span class="hljs-built_in">next</span>()
    <span class="hljs-keyword">if</span> <span class="hljs-built_in">len</span>(res) == <span class="hljs-number">0</span>:
        search_iterator.close()
        <span class="hljs-keyword">break</span>
    <span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-built_in">len</span>(res)):
        <span class="hljs-built_in">print</span>(res[i])
<button class="copy-code-btn"></button></code></pre>
<p>迭代過濾 (Iterative Filtering) 在區段層級的迭代器上運作，與此不同的是，外部過濾 (External Filtering) 在全局查詢層級運作。此設計可最小化元資料評估，並避免在 Milvus 內執行大型篩選器，從而獲得更精簡、更快速的端對端效能。</p>
<h2 id="AutoIndex" class="common-anchor-header">自動索引<button data-href="#AutoIndex" class="anchor-icon" translate="no">
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
    </button></h2><p>向量搜尋總是需要在精確度與速度之間取捨 - 檢查的向量越多，結果就越好，但查詢速度就越慢。當您加入篩選條件時，這個平衡就更難拿捏了。</p>
<p>在 Zilliz Cloud 中，我們建立了<strong>AutoIndex</strong>- 一個以 ML 為基礎的最佳化器，可自動為您微調這種平衡。AutoIndex 不需要手動設定複雜的參數，而是使用機器學習來決定特定資料和查詢模式的最佳設定。</p>
<p>Zilliz 建立在 Milvus 之上，要瞭解其運作方式，最好先瞭解一下 Milvus 的架構：查詢分佈在多個 QueryNode 實體上。每個節點處理資料的一部分 (一個區段)、執行搜尋，然後將結果合併在一起。</p>
<p>AutoIndex 會分析這些區段的統計資料，並進行智慧型調整。對於低過濾率，索引查詢範圍會擴大以增加召回率。對於高過濾率，則會縮小查詢範圍，以避免在不可能的候選項上浪費精力。這些決策是由統計模型引導的，這些模型會預測每個特定過濾情況下最有效的搜尋策略。</p>
<p>AutoIndex 不只是索引參數。它還能幫助選擇最佳的篩選評估策略。透過解析篩選表達式和抽樣區段資料，它可以估計評估成本。如果偵測到評估成本過高，它會自動切換至更有效率的技術，例如迭代篩選 (Iterative Filtering)。這種動態調整可確保每次查詢都使用最適合的策略。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Autoindex_3f37988d5c.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Performance-on-a-1000-Budget" class="common-anchor-header">1,000 美元預算的效能<button data-href="#Performance-on-a-1000-Budget" class="anchor-icon" translate="no">
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
    </button></h2><p>理論上的改進固然重要，但對大多數開發人員而言，實際效能才是最重要的。我們想要測試在實際預算限制下，這些最佳化如何轉化為實際應用程式效能。</p>
<p>我們以每月 1,000 美元的實際預算為基準，測試了幾個向量資料庫解決方案，這是許多公司分配給向量搜尋基礎架構的合理金額。對於每個解決方案，我們都選擇了在此預算限制下性能最高的實例配置。</p>
<p>我們的測試使用</p>
<ul>
<li><p>擁有 100 萬個 768 維向量的 Cohere 1M 資料集</p></li>
<li><p>實際世界中經過篩選與未經篩選的混合搜尋工作負載</p></li>
<li><p>開放原始碼的 vdb-bench 基準工具，以進行一致的比較</p></li>
</ul>
<p>競爭的解決方案 (匿名為「VDB A」、「VDB B」和「VDB C」) 都是在預算範圍內的最佳配置。結果顯示，完全管理的 Milvus (Zilliz Cloud) 在篩選和未篩選的查詢中都持續取得最高的吞吐量。在相同的 1,000 美元預算下，我們的最佳化技術能以具競爭力的回收率提供最高的效能。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Performance_on_a_1_000_Budget_5ebefaec48.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
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
    </button></h2><p>表面上看來，具備篩選功能的矢量搜尋可能很簡單 - 只要在查詢中加入篩選子句就可以了。然而，正如我們在這篇部落格中所展示的，要在規模上達到高效能與精確的結果，需要精密的工程解決方案。Milvus 和 Zilliz Cloud 透過幾種創新方法來解決這些挑戰：</p>
<ul>
<li><p><strong>圖形索引最佳化</strong>：即使篩選器移除連接節點，仍可保留類似項目之間的路徑，防止出現降低結果品質的「孤島」問題。</p></li>
<li><p><strong>元資料感知索引</strong>：針對常見的篩選條件建立專屬路徑，讓篩選搜尋的速度大幅提升，同時不影響精確度。</p></li>
<li><p><strong>迭代篩選</strong>：分批處理結果，只將複雜的篩選條件套用至最有希望的候選項目，而非整個資料集。</p></li>
<li><p><strong>自動索引</strong>：使用機器學習根據您的資料和查詢自動調整搜尋參數，在速度和精確度之間取得平衡，無需手動設定。</p></li>
<li><p><strong>外部篩選</strong>：有效橋接向量搜尋與外部資料庫，消除網路瓶頸，同時維持結果品質。</p></li>
</ul>
<p>Milvus 和 Zilliz Cloud 繼續發展新功能，進一步改善篩選搜尋效能。<a href="https://docs.zilliz.com/docs/use-partition-key"> Partition Key</a>等功能允許根據篩選模式進行更有效率的資料組織，而先進的子圖路由技術則進一步推進效能的極限。</p>
<p>非結構化資料的數量和複雜性持續成倍成長，為各地的搜尋系統帶來新的挑戰。我們的團隊不斷突破向量資料庫的極限，以提供更快速、更具擴充性的人工智能搜尋。</p>
<p>如果您的應用程式在使用篩選向量搜尋時遇到效能瓶頸，我們邀請您加入我們活躍的開發人員社群，網址是<a href="https://milvus.io/community">milvus.io/community</a>- 您可以在此分享挑戰、獲得專家指導，並發掘新興的最佳實務。</p>
<h2 id="References" class="common-anchor-header">參考資料<button data-href="#References" class="anchor-icon" translate="no">
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
    </button></h2><ol>
<li><p><a href="https://arxiv.org/pdf/2403.04871">https://arxiv.org/pdf/2403.04871</a></p></li>
<li><p><a href="https://www.usenix.org/system/files/osdi23-zhang-qianxi_1.pdf">https://www.usenix.org/system/files/osdi23-zhang-qianxi_1.pdf</a></p></li>
</ol>
<hr>
