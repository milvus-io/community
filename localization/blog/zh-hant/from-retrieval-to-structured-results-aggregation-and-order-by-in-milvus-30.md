---
id: from-retrieval-to-structured-results-aggregation-and-order-by-in-milvus-30.md
title: 從檢索到結構化結果：Milvus 3.0 中的聚合與 ORDER BY
author: Chun Han
date: 2026-8-7
cover: assets.zilliz.com/cover_of_milvus_3_blog_37a6c88c81.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus 3.0, query aggregation, Search Aggregation, ORDER BY, vector search'
meta_title: |
  Milvus 3.0 Aggregation & ORDER BY: Query and Search Guide
desc: 了解 Milvus 3.0 如何新增查詢聚合、Search Aggregation 和伺服器端 ORDER BY，以獲得結構化且高效的向量搜尋結果。
origin: >-
  https://milvus.io/blog/from-retrieval-to-structured-results-aggregation-and-order-by-in-milvus-30.md
---
<p>試想一個熟悉的產品搜尋流程。購物者上傳一張洋裝照片，向量搜尋會從包含數千萬件商品的型錄中擷取出相關的候選集合。</p>
<p>然而，頁面需要的不只是一個排序清單。它需要品牌篩選面向。它需要價格排序。商品營運團隊想知道哪些品牌主導了這個結果集、每個品牌內的價格範圍，以及每個群組中的幾個代表性商品。</p>
<p>在 Milvus 3.0 之前，應用程式通常自行處理第二個步驟：從 Milvus 擷取資料列，在 pandas 或服務層中分組並排序，然後組裝回應。有些團隊維護一條獨立的分析管線，只為了計算已經存在於向量資料庫中的資料的計數與分布。</p>
<p>向量資料庫找到了候選項；應用程式必須將它們轉換成結構化結果。</p>
<p>Milvus 3.0 將更多這類工作移入檢索引擎。它新增了三項相關但不同的能力：</p>
<ul>
<li><strong>查詢聚合</strong>可在經篩選、可見的資料列上計算 <code translate="no">count</code>、<code translate="no">sum</code>、<code translate="no">avg</code>、<code translate="no">min</code> 和 <code translate="no">max</code>，並可選擇使用 <code translate="no">GROUP BY</code> 欄位。</li>
<li><strong>搜尋聚合</strong>會將保留下來的近似最近鄰（ANN）候選項組織成 bucket，計算每個 bucket 的指標，建立巢狀 bucket，並回傳代表性命中結果。</li>
<li><strong>伺服器端</strong> <code translate="no">**ORDER BY**</code> 會在應用程式收到之前，依據一個或多個純量欄位排序查詢結果或 ANN 候選項。</li>
</ul>
<p>查詢與搜尋之間的區別很重要：</p>
<table>
<thead>
<tr><th>能力</th><th>被彙總或排序的資料</th><th>主要結果形狀</th><th>精確性邊界</th></tr>
</thead>
<tbody>
<tr><td>查詢聚合</td><td>所有符合篩選條件的可見資料列</td><td>每個群組一列，並包含聚合值</td><td>對查詢的可見資料列集合而言是精確的</td></tr>
<tr><td>搜尋聚合</td><td>由 ANN 搜尋與分組階段保留下來的候選項</td><td>Bucket、指標、代表性命中結果，以及選用的子 bucket</td><td>設計上即為近似</td></tr>
<tr><td>查詢 <code translate="no">ORDER BY</code></td><td>符合篩選條件的可見資料列</td><td>已排序資料列</td><td>對經篩選的查詢結果而言是精確的</td></tr>
<tr><td>搜尋 <code translate="no">ORDER BY</code></td><td>ANN 候選項</td><td>已排序的搜尋命中結果或群組</td><td>不會擴大 ANN 的召回邊界</td></tr>
</tbody>
</table>
<p>本文說明為什麼這些操作應該屬於資料庫內部、分散式聚合如何運作、搜尋聚合與分組搜尋有何不同，以及新語義的邊界在哪裡。</p>
<h2 id="Why-application-side-post-processing-breaks-down" class="common-anchor-header">為什麼應用程式端後處理會失效<button data-href="#Why-application-side-post-processing-breaks-down" class="anchor-icon" translate="no">
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
    </button></h2><p>將聚合與排序移到應用程式端，看起來可能只是個小小的實作選擇。但在大規模情境下，它會造成三個更大的問題。</p>
<h3 id="The-application-moves-far-more-data-than-the-answer-contains" class="common-anchor-header">應用程式搬移的資料遠多於答案本身</h3><p>假設一個營運儀表板需要針對兩百萬筆有庫存資料列中的每個類別，取得產品數量與平均價格。即使每列只粗略估算 100 位元組的負載，用於類別、價格、主鍵與序列化開銷，應用程式仍必須在能計算結果之前接收約 200 MB 的資料。</p>
<p>如果型錄有 200 個類別，答案只會是幾百個鍵與數字——大約是 KB 等級。應用程式搬移的資料比它回傳的結果多出好幾個數量級，每次刷新都支付同樣成本，並且需要足夠的用戶端記憶體來保存或串流中間資料列。</p>
<p>引擎內聚合改變了資料移動的單位。原始資料列留在原處。跨節點傳輸並最終離開 Milvus 的，是小得多的部分與最終群組狀態集合。</p>
<h3 id="Page-local-sorting-is-not-global-sorting" class="common-anchor-header">頁面內排序不是全域排序</h3><p>分頁之後再排序是正確性錯誤，而不只是效率不佳的實作。</p>
<p>如果應用程式擷取第 11 到第 20 筆資料列，並只對這些資料列按價格排序，它產生的是該頁面內的價格順序，而不是全域按價格排序結果中的第 11 到第 20 筆。後續頁面可能包含比第一頁每件商品都更便宜的商品。</p>
<p>同樣的邊界也適用於向量搜尋。擷取一個較小的 Top-K 集合並在應用程式中排序，只能重新排序那些候選項。它無法找回 ANN 階段沒有回傳的相關候選項，而且往往導致應用程式過度擷取，只為了讓用戶端排序有用。</p>
<p>伺服器端排序讓 Milvus 控制排序與分頁序列。對查詢工作負載而言，引擎會先排序經篩選的資料列集合，再套用頁面視窗。對搜尋工作負載而言，它會在 ANN 候選邊界內排序，並明確保留該限制。</p>
<h3 id="The-client-cannot-reproduce-database-visibility" class="common-anchor-header">用戶端無法重現資料庫可見性</h3><p>聚合也取決於哪些資料列在查詢時間戳下可見。刪除、過期實體與並行寫入，都由 Milvus 的多版本並行控制（MVCC）與一致性語義管理。</p>
<p>一旦原始資料列離開資料庫，應用程式通常會假設收到的批次代表正確快照。在用戶端重建相同的可見性規則並不切實際，尤其是在集合仍持續接收寫入與刪除時。</p>
<p>常見的權宜作法——透過匯出與 ETL 餵給第二個分析引擎——會增加另一份資料副本、另一個一致性邊界，以及另一條需要維運的管線。計數、指標與排序應該在資料與其可見性規則已經存在的地方執行。</p>
<p>現在，讓我們看看 Milvus 3.0 提供了什麼。</p>
<h2 id="Query-aggregation-exact-statistics-over-visible-rows" class="common-anchor-header">查詢聚合：針對可見資料列的精確統計<button data-href="#Query-aggregation-exact-statistics-over-visible-rows" class="anchor-icon" translate="no">
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
    </button></h2><p>查詢聚合可回答下列問題：</p>
<ul>
<li>每個類別中有多少有庫存商品？</li>
<li>每個品牌的平均價格是多少？</li>
<li>每台主機的事件時間戳最小值與最大值是多少？</li>
<li>套用篩選條件與 TTL 可見性後，還剩下多少筆紀錄？</li>
</ul>
<p>這個 API 對任何使用過 SQL 的人來說都很熟悉：在 <code translate="no">group_by_fields</code> 中傳入一個或多個欄位，然後在 <code translate="no">output_fields</code> 中放入聚合運算式。</p>
<pre><code translate="no" class="language-python">res = client.query(
    collection_name=<span class="hljs-string">&quot;products&quot;</span>,
    <span class="hljs-built_in">filter</span>=<span class="hljs-string">&#x27;status == &quot;on_sale&quot;&#x27;</span>,
    group_by_fields=[<span class="hljs-string">&quot;category&quot;</span>],
    output_fields=[<span class="hljs-string">&quot;category&quot;</span>, <span class="hljs-string">&quot;count(*)&quot;</span>, <span class="hljs-string">&quot;avg(price)&quot;</span>],
)

<span class="hljs-comment"># [</span>
<span class="hljs-comment">#     {&quot;category&quot;: &quot;books&quot;, &quot;count(*)&quot;: 18734, &quot;avg(price)&quot;: 45.3},</span>
<span class="hljs-comment">#     ...</span>
<span class="hljs-comment"># ]</span>
<button class="copy-code-btn"></button></code></pre>
<p>語法是簡單的部分。真正讓結果有用的是執行模型，尤其是在分散式向量資料庫中。</p>
<h3 id="Segment-local-states-replace-raw-row-movement" class="common-anchor-header">Segment 本地狀態取代原始資料列移動</h3><p>一個 Milvus collection 可以跨越分布在多個查詢節點上的數百或數千個 segment，最近寫入的資料仍在串流路徑上。沒有任何單一執行節點一開始就擁有所有可見資料列。</p>
<p>因此，Milvus 會將聚合下推到 segment：</p>
<ol>
<li>每個 segment 在本地套用篩選條件與 MVCC 可見性規則。</li>
<li>Segment 會為每個群組發出一個部分狀態，而不是發出符合條件的資料列。</li>
<li>部分狀態會在查詢節點內合併。</li>
<li>Proxy 會執行最終的跨節點合併，並回傳完成的群組。</li>
</ol>
<p>現在，中間資料量會隨群組數量與聚合狀態數量擴展，而不是直接隨符合條件的資料列數量擴展。</p>
<p>合併操作取決於聚合函式：</p>
<table>
<thead>
<tr><th>聚合</th><th>部分狀態</th><th>合併規則</th></tr>
</thead>
<tbody>
<tr><td><code translate="no">count</code></td><td>部分計數</td><td>加總計數</td></tr>
<tr><td><code translate="no">sum</code></td><td>部分總和</td><td>加總總和</td></tr>
<tr><td><code translate="no">min</code></td><td>部分最小值</td><td>取最小值</td></tr>
<tr><td><code translate="no">max</code></td><td>部分最大值</td><td>取最大值</td></tr>
<tr><td><code translate="no">avg</code></td><td>部分總和與計數</td><td>加總兩種狀態，然後只在最終階段除一次</td></tr>
</tbody>
</table>
<p><code translate="no">avg</code> 是最具啟發性的案例。當分割區包含不同數量的資料列時，將兩個部分平均值再平均是錯誤的。Milvus 會分別攜帶 <code translate="no">sum</code> 與 <code translate="no">count</code>，並且只在兩者都已全域合併後才計算最終平均值。</p>
<p>這也是聚合應該屬於資料庫內部的原因之一：這個操作不只是「在幾個批次上執行同一個函式」。引擎必須在 segment 與節點邊界之間保留每種聚合的代數性質。</p>
<h3 id="Visibility-is-applied-before-aggregation" class="common-anchor-header">可見性會在聚合之前套用</h3><p>已刪除與過期的資料列會根據查詢的可見性邊界，在 segment 層級從部分狀態中移除。它們不會向上傳遞後再由應用程式修正。</p>
<p>因此，結果描述的是 Milvus 認為對該請求可見的資料列，而不是在略有不同時間拉取的任意批次集合。</p>
<h3 id="limit-now-counts-groups" class="common-anchor-header"><code translate="no">limit</code> 現在計算的是群組數</h3><p>在一般查詢中，<code translate="no">limit</code> 控制回傳多少實體資料列。在分組查詢中，它控制回傳多少群組。由於結果基數由群組而不是符合條件的資料列決定，因此查詢聚合在需要每個群組時，也可以省略 <code translate="no">limit</code>。</p>
<p>這聽起來像是一個小小的 API 細節，但它反映了不同的結果模型：輸出不再是一頁實體。它是一個其資料列代表群組的關聯。</p>
<h2 id="Search-Aggregation-a-bucketed-view-of-ANN-candidates" class="common-anchor-header">搜尋聚合：ANN 候選項的 bucket 化視圖<button data-href="#Search-Aggregation-a-bucketed-view-of-ANN-candidates" class="anchor-icon" translate="no">
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
    </button></h2><p>查詢聚合回答的是：「符合這個篩選條件的可見資料列長什麼樣？」搜尋聚合問的是另一個問題：「為這個向量擷取出的候選集合長什麼樣？」</p>
<p>這個操作沒有精確的 SQL 對等物。ANN 搜尋會先建立由相似度驅動的候選邊界。接著 Milvus 會依純量鍵組織保留下來的候選項，並回傳 bucket 樹，而不是一般的扁平命中清單。</p>
<p>一個 bucket 可以包含：</p>
<ul>
<li>像 <code translate="no">brand</code> 這樣的鍵，或像 <code translate="no">(brand, color)</code> 這樣的複合鍵；</li>
<li>保留候選項計數；</li>
<li>包含 <code translate="no">count</code>、<code translate="no">sum</code>、<code translate="no">avg</code>、<code translate="no">min</code> 和 <code translate="no">max</code> 的指標；</li>
<li>以 <code translate="no">top_hits</code> 選出的代表性實體；以及</li>
<li>建立子 bucket 的巢狀 <code translate="no">sub_aggregation</code>。</li>
</ul>
<p>對於產品搜尋頁面，一個請求就能回傳品牌 bucket、每個 bucket 內的平均價格，以及每個品牌的三個代表性商品：</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> SearchAggregation, TopHits

aggregation = SearchAggregation(
    fields=[<span class="hljs-string">&quot;brand&quot;</span>],
    size=<span class="hljs-number">10</span>,                                    <span class="hljs-comment"># Return up to 10 brand buckets</span>
    metrics={<span class="hljs-string">&quot;avg_price&quot;</span>: {<span class="hljs-string">&quot;avg&quot;</span>: <span class="hljs-string">&quot;price&quot;</span>}},
    order=[{<span class="hljs-string">&quot;_count&quot;</span>: <span class="hljs-string">&quot;desc&quot;</span>}],               <span class="hljs-comment"># Order by retained-candidate count</span>
    top_hits=TopHits(
        size=<span class="hljs-number">3</span>,
        sort=[{<span class="hljs-string">&quot;_score&quot;</span>: <span class="hljs-string">&quot;desc&quot;</span>}],            <span class="hljs-comment"># Use &quot;asc&quot; for L2 distance</span>
    ),
)

res = client.search(
    collection_name=<span class="hljs-string">&quot;products&quot;</span>,
    data=[query_vector],
    anns_field=<span class="hljs-string">&quot;embedding&quot;</span>,
    search_aggregation=aggregation,
    output_fields=[<span class="hljs-string">&quot;title&quot;</span>, <span class="hljs-string">&quot;brand&quot;</span>, <span class="hljs-string">&quot;price&quot;</span>],
)

buckets = res.agg_buckets[<span class="hljs-number">0</span>]
<button class="copy-code-btn"></button></code></pre>
<p>設定 <code translate="no">search_aggregation</code> 時，一般命中清單會是空的。應用程式會從 <code translate="no">result.agg_buckets</code> 讀取 bucket 回應。</p>
<h3 id="The-aggregation-specification-sets-two-different-bounds" class="common-anchor-header">聚合規格設定了兩種不同的邊界</h3><p>搜尋聚合不會在 collection 中每個實體上執行 <code translate="no">GROUP BY</code>，也不是單純拿一般 Top-K 回應的扁平清單來聚合。</p>
<p>它的執行包含三個階段：</p>
<ol>
<li>Milvus 執行 ANN 搜尋，以擷取接近查詢向量的候選項。</li>
<li>分組階段會為每個完整 bucket key 保留有界數量的候選項。</li>
<li>Milvus 建立 bucket、針對保留候選項計算指標、排序 bucket，並附加代表性命中結果或子 bucket。</li>
</ol>
<p>兩個參數控制結果的不同部分：</p>
<ul>
<li><code translate="no">SearchAggregation.size</code> 限制該聚合層級回傳多少個 bucket。</li>
<li>聚合樹中任何位置最大的 <code translate="no">TopHits.size</code>，會設定每個完整複合鍵的保留候選項預算。如果請求不包含 <code translate="no">top_hits</code>，則每個鍵的預設預算為一。</li>
</ul>
<p>頂層搜尋 <code translate="no">limit</code> 不控制此模式，並且在存在 <code translate="no">search_aggregation</code> 時會被忽略。</p>
<p>在解讀 bucket 的 <code translate="no">count</code> 或指標時，這個區別至關重要。使用 <code translate="no">TopHits(size=3)</code> 時，即使 collection 中包含數千個來自該品牌的相關商品，一個品牌 bucket 最多也只能彙總其完整鍵的三個保留候選項。增加 <code translate="no">TopHits.size</code> 會擴大每個鍵的指標視窗，但不會把 ANN 搜尋變成精確掃描。</p>
<p>如果應用程式需要對符合篩選條件的每個可見資料列取得精確統計，應使用查詢聚合。搜尋聚合用於描述與比較由相似度檢索產生的候選項。</p>
<h2 id="Search-Aggregation-and-Grouping-Search-solve-different-problems" class="common-anchor-header">搜尋聚合與分組搜尋解決不同問題<button data-href="#Search-Aggregation-and-Grouping-Search-solve-different-problems" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 自 Milvus 2.4 起支援分組搜尋（<code translate="no">group_by</code>）。看到兩個功能都有「grouping」這個詞，很容易以為它們是同一個操作的兩種介面。它們的輸出契約不同。</p>
<p><strong>分組搜尋</strong>會改變哪些實體出現在排序結果清單中。常見的 RAG 模式會將 chunk 儲存為個別實體，依 <code translate="no">doc_id</code> 分組，並從每份文件回傳一個或幾個 chunk。主要輸出仍是一般搜尋命中結果，但分組欄位的重複值較少。</p>
<p><strong>搜尋聚合</strong>會回傳統計視圖。主要輸出是一棵 bucket 樹，包含鍵、計數、指標、代表性命中結果，以及選用的子 bucket。</p>
<table>
<thead>
<tr><th>應用程式需求</th><th>建議使用</th><th>消費內容</th></tr>
</thead>
<tbody>
<tr><td>在某個欄位上具有更高多樣性的排序實體清單</td><td>分組搜尋</td><td>一般搜尋命中結果</td></tr>
<tr><td>面向計數、每群組指標、代表性命中結果，或巢狀分布</td><td>搜尋聚合</td><td><code translate="no">result.agg_buckets</code> 中的 <code translate="no">AggregationBucket</code> 物件</td></tr>
</tbody>
</table>
<p>一個實用規則是從 UI 或 API 回應形狀開始思考。如果應用程式呈現的是清單，分組搜尋通常是正確的原語。如果它呈現的是篩選面向、分布卡片或群組階層，則使用搜尋聚合。</p>
<p>這兩種模式在同一個請求中互斥，因為它們定義了不同的主要結果形狀。</p>
<h2 id="ORDER-BY-move-sorting-before-the-application-boundary" class="common-anchor-header"><code translate="no">ORDER BY</code>：將排序移到應用程式邊界之前<button data-href="#ORDER-BY-move-sorting-before-the-application-boundary" class="anchor-icon" translate="no">
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
    </button></h2><p>排序是此版本中最不新奇的功能，卻也是在引擎外最容易實作錯誤的功能之一。</p>
<p>Milvus 3.0 在查詢與搜尋上都暴露排序能力，但兩條路徑使用不同的 SDK 參數，並作用於不同的輸入集合。</p>
<h3 id="Query-sorting-orders-the-filtered-row-set" class="common-anchor-header">查詢排序會排序經篩選的資料列集合</h3><p>PyMilvus 查詢使用 <code translate="no">order_by</code>，以 <code translate="no">&quot;field:direction&quot;</code> 字串清單表示。引擎會套用篩選條件、排序可見資料列，然後再套用 <code translate="no">limit</code> 與 <code translate="no">offset</code>。</p>
<pre><code translate="no" class="language-python">res = client.query(
    collection_name=<span class="hljs-string">&quot;products&quot;</span>,
    <span class="hljs-built_in">filter</span>=<span class="hljs-string">&#x27;category == &quot;books&quot;&#x27;</span>,
    output_fields=[<span class="hljs-string">&quot;title&quot;</span>, <span class="hljs-string">&quot;price&quot;</span>],
    order_by=[<span class="hljs-string">&quot;price:desc&quot;</span>, <span class="hljs-string">&quot;title:asc&quot;</span>],
    limit=<span class="hljs-number">10</span>,
    offset=<span class="hljs-number">10</span>,  <span class="hljs-comment"># Rows 11-20 in the filtered, price-sorted result</span>
)
<button class="copy-code-btn"></button></code></pre>
<p>這讓查詢可用於依業務順序瀏覽：最新匯入的紀錄、某個篩選條件內最高價的商品、最低庫存，或用於資料檢查的極值。若沒有伺服器端排序，應用程式必須先擷取資料列，且無法跨頁定義可靠的業務順序。</p>
<p>對於可為 null 的查詢欄位，升冪會將 null 放在最後，降冪會將 null 放在最前。排序欄位不一定要出現在 <code translate="no">output_fields</code> 中；只有當應用程式需要在回應中取得該值時才包含它。</p>
<h3 id="Search-sorting-reorders-the-ANN-candidate-set" class="common-anchor-header">搜尋排序會重新排序 ANN 候選集合</h3><p>PyMilvus 搜尋使用 <code translate="no">order_by_fields</code>，其中每個項目會指定一個純量欄位與方向：</p>
<pre><code translate="no" class="language-python">res = client.search(
    collection_name=<span class="hljs-string">&quot;products&quot;</span>,
    data=[query_vector],
    anns_field=<span class="hljs-string">&quot;embedding&quot;</span>,
    <span class="hljs-built_in">limit</span>=50,
    output_fields=[<span class="hljs-string">&quot;title&quot;</span>, <span class="hljs-string">&quot;price&quot;</span>],
    order_by_fields=[
        {<span class="hljs-string">&quot;field&quot;</span>: <span class="hljs-string">&quot;price&quot;</span>, <span class="hljs-string">&quot;order&quot;</span>: <span class="hljs-string">&quot;asc&quot;</span>},
    ],
)
<button class="copy-code-btn"></button></code></pre>
<p>ANN 仍然決定哪些實體會成為候選項。<code translate="no">order_by_fields</code> 會改變這些候選項的回傳方式；它不會讓搜尋全域掃描 collection 以尋找最便宜的商品。</p>
<p>這個邊界賦予兩個 API 不同的工作：</p>
<ul>
<li>當純量順序本身定義結果時，例如十個最便宜的有庫存商品，請使用查詢加上 <code translate="no">order_by</code>。</li>
<li>當語意或向量相關性定義候選集合，而純量欄位決定如何呈現這些候選項時，請使用搜尋加上 <code translate="no">order_by_fields</code>。</li>
</ul>
<p>多欄位排序會依清單順序套用鍵。當搜尋候選項在每個指定純量鍵上的值都相同時，Milvus 會保留它們原本的相似度分數順序。</p>
<p>排序也可與分組搜尋組合使用。Milvus 會依每個群組頂端實體的已設定純量值排序群組，同時保留分組結果形狀。當應用程式同時需要跨欄位的多樣性與符合業務需求的群組順序時，這很有用。</p>
<h2 id="What-these-capabilities-make-possible" class="common-anchor-header">這些能力帶來的可能性<button data-href="#What-these-capabilities-make-possible" class="anchor-icon" translate="no">
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
    </button></h2><p>這些 API 是通用的資料庫原語，但有幾種檢索工作負載會立即受益。</p>
<h3 id="RAG-and-agents-inspect-retrieval-concentration" class="common-anchor-header">RAG 與代理：檢視檢索集中度</h3><p>RAG 或代理式系統可以依來源文件、產品線、租戶或內容類型，將擷取到的 chunk 分桶。結果集中在兩份文件中，與分散在數十個來源中的結果相比，代表不同的覆蓋訊號。</p>
<p>這種分布並不保證答案品質。不過，它是一個有用的檢索診斷訊號，應用程式或代理在決定是否擴展查詢、再次檢索或要求澄清時，可以將它與分數、引用和其他檢查結合使用。</p>
<p>當目標只是讓回傳的 chunk 更具多樣性時，分組搜尋仍是正確選擇。當系統需要分布本身時，搜尋聚合很有用。</p>
<h3 id="E-commerce-and-content-recommendation-return-facets-with-the-search" class="common-anchor-header">電子商務與內容推薦：隨搜尋回傳篩選面向</h3><p>開頭的產品搜尋頁面可以從 Milvus 收到品牌 bucket、價格指標、代表性商品，以及按純量排序的候選清單。應用程式仍控制呈現與業務邏輯，但不再需要從匯出的命中結果中重建基本 bucket 語義。</p>
<h3 id="Logs-and-security-combine-similarity-with-incident-distribution" class="common-anchor-header">日誌與安全：結合相似度與事件分布</h3><p>相似度搜尋可以找出與可疑日誌行相關的事件。搜尋聚合接著可以顯示哪些主機主導這些候選項、每個主機 bucket 中的最小與最大時間戳，或候選項如何依嚴重性與服務分布。</p>
<p>結果仍然是擷取候選項的視圖，而不是精確的全域事件計數。當調查需要對符合篩選條件的每個事件取得精確計數時，查詢聚合提供了第二條路徑。</p>
<h3 id="Operations-and-data-exploration-calculate-instead-of-export" class="common-anchor-header">營運與資料探索：計算而非匯出</h3><p>儀表板與管理工具可以針對經篩選的資料列執行精確計數與平均值，然後以明確的純量順序瀏覽底層實體。這移除了許多一次性的「匯出、計算、排序」工具，同時不假裝 Milvus 已成為完整的分析資料庫。</p>
<h2 id="Boundaries-what-aggregation-and-ORDER-BY-do-not-replace" class="common-anchor-header">邊界：聚合與 <code translate="no">ORDER BY</code> 不會取代什麼<button data-href="#Boundaries-what-aggregation-and-ORDER-BY-do-not-replace" class="anchor-icon" translate="no">
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
    </button></h2><p>這些功能擴展了檢索引擎；它們不會把 Milvus 變成線上分析處理（OLAP）系統。</p>
<ul>
<li>查詢聚合支援分組以及 <code translate="no">count</code>、<code translate="no">sum</code>、<code translate="no">avg</code>、<code translate="no">min</code> 和 <code translate="no">max</code>。它不會新增 join、window function 或複雜子查詢。大型離線分析工作仍適合放在 Spark 等系統中，這些系統可以搭配 Milvus 3.0 快照與共享儲存路徑運作。</li>
<li>查詢群組鍵支援整數、<code translate="no">VARCHAR</code> 和 <code translate="no">TIMESTAMPTZ</code> 欄位。搜尋聚合 bucket key 額外支援布林欄位。浮點、向量、JSON 和陣列值不能作為 bucket key。</li>
<li>對於搜尋聚合，<code translate="no">count</code> 接受 <code translate="no">&quot;*&quot;</code> 或非 JSON、非動態來源；<code translate="no">sum</code> 和 <code translate="no">avg</code> 需要數值來源；<code translate="no">min</code> 和 <code translate="no">max</code> 也支援字串與 <code translate="no">TIMESTAMPTZ</code> 來源。查詢聚合遵循相同的算術型別邊界。在將聚合套用到複雜欄位型別之前，請查閱 API 指南。</li>
<li>查詢聚合可以依群組鍵排序分組輸出，而依計算出的聚合值（例如 <code translate="no">count(*)</code>）排序仍是目前的邊界。若未明確指定排序，群組順序不保證。</li>
<li>搜尋聚合目前不能在同一個請求中與 Hybrid Search、Grouping Search、Search Iterators、非零 offset 或 highlighting 組合使用。</li>
<li>搜尋聚合的計數與指標描述的是保留下來的 ANN 候選項，而不是完整 collection，也不是每個可能在語意上相關的實體。</li>
<li>搜尋 <code translate="no">ORDER BY</code> 會改變候選項呈現方式。它不會修復 ANN 遺漏的候選項，也不會將相似度檢索轉換成精確的純量 Top-N 查詢。</li>
</ul>
<p>在新的原語之間做選擇，最清楚的方法是從問題本身開始：</p>
<ul>
<li>若要對經篩選的可見資料列取得精確統計，使用查詢聚合。</li>
<li>若要取得相似度檢索候選項的分布，使用搜尋聚合。</li>
<li>若要取得多樣化的排序清單，使用分組搜尋。</li>
<li>若要取得明確的純量順序，依據是哪條路徑建立結果集，使用查詢或搜尋 <code translate="no">ORDER BY</code>。</li>
</ul>
<h2 id="From-candidate-lists-to-structured-results" class="common-anchor-header">從候選清單到結構化結果<button data-href="#From-candidate-lists-to-structured-results" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>向量資料庫傳統上一直優化一個問題：哪 K 個實體最接近這個向量？</strong></p>
<p>生產環境中的檢索系統會立即提出後續問題。哪些群組主導了結果？它們的計數與範圍是多少？哪些範例代表每個群組？應用程式應以什麼業務順序呈現資料列或候選項？</p>
<p>Milvus 3.0 將這些操作帶入同一個擁有資料、ANN 候選邊界與可見性語義的引擎。查詢聚合會對可見資料列執行精確的分散式歸約。搜尋聚合會在保留下來的 ANN 候選項上建立 bucket 化視圖。<code translate="no">ORDER BY</code> 讓查詢與搜尋路徑具備伺服器端純量順序，不需要應用程式逐頁重建。</p>
<p>這個結果不是藏在向量資料庫裡的 OLAP 引擎。它是一個能回傳更多應用程式實際需要之結構的檢索引擎。</p>
<h2 id="Try-aggregation-and-ORDER-BY-in-Milvus-30" class="common-anchor-header">在 Milvus 3.0 中試用聚合與 <code translate="no">ORDER BY</code><button data-href="#Try-aggregation-and-ORDER-BY-in-Milvus-30" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 3.0 現已推出。請使用 <a href="https://milvus.io/docs/get-and-scalar-query.md">Query guide</a> 了解精確聚合與查詢排序，使用 <a href="https://milvus.io/docs/search-aggregation.md">Search Aggregation guide</a> 了解 bucket 語義與限制，使用 <a href="https://milvus.io/docs/single-vector-search.md">Basic Vector Search guide</a> 了解搜尋排序；當你的主要目標是結果多樣性時，請使用 <a href="https://milvus.io/docs/grouping-search.md">Grouping Search guide</a>。</p>
<p>若要了解更廣泛的版本發布內容，請參閱 <a href="https://milvus.io/blog/announcing-milvus-3-lake-native-vector-search-and-a-more-powerful-retrieval-engine.md">Milvus 3.0 launch blog</a>、<a href="https://milvus.io/docs/release_notes.md">Milvus 3.0 release notes</a>，以及 <a href="https://github.com/milvus-io/milvus">milvus-io/milvus repository</a>。</p>
<p>如果你想在不自行維運叢集的情況下評估相同 API，可以在 <a href="https://cloud.zilliz.com">Zilliz Cloud</a> 上試用。最新的 <a href="https://docs.zilliz.com/reference/python/python/Vector-query">Zilliz Cloud query reference</a> 與 <a href="https://docs.zilliz.com/reference/python/python/Vector-search">search reference</a> 說明了受管叢集類型的可用性與參數。</p>
<p>若要與團隊討論工作負載或邊界案例，請加入 <a href="https://discord.com/invite/8uyFbECzPX">Milvus Discord community</a>，或預約 <a href="https://meetings.hubspot.com/chloe-williams1/milvus-meeting">Milvus Office Hours session</a>。</p>
