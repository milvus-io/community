---
id: choosing-a-vector-database-for-ann-search-at-reddit.md
title: 在 Reddit 為 ANN 搜尋選擇向量資料庫
author: Chris Fournie
date: 2025-11-28T00:00:00.000Z
cover: assets.zilliz.com/Chat_GPT_Image_Nov_29_2025_12_03_05_AM_min_1_05250269a8.png
tag: Engineering
recommend: true
publishToMedium: true
tags: 'Milvus, vector database, reddit'
meta_keywords: 'Milvus, vector database, reddit'
meta_title: |
  Choosing a vector database for ANN search at Reddit
desc: 這篇文章描述 Reddit 團隊選擇最適合的向量資料庫的過程，以及他們選擇 Milvus 的原因。
origin: 'https://milvus.io/blog/choosing-a-vector-database-for-ann-search-at-reddit.md'
---
<p><em>本篇文章由 Reddit 的員工軟體工程師 Chris Fournie 撰寫，並原載</em>於<a href="https://www.reddit.com/r/RedditEng/comments/1ozxnjc/choosing_a_vector_database_for_ann_search_at/">Reddit</a> 網站，現經授權轉載於此。</p>
<p>2024 年，Reddit 團隊使用各種解決方案來執行近似最近鄰 (ANN) 向量搜尋。從 Google 的<a href="https://docs.cloud.google.com/vertex-ai/docs/vector-search/overview">Vertex AI 向量搜尋</a>，以及實驗使用<a href="https://solr.apache.org/guide/solr/latest/query-guide/dense-vector-search.html">Apache Solr 的 ANN 向量搜尋來</a>處理一些較大型的資料集，到 Facebook 的<a href="https://github.com/facebookresearch/faiss">FAISS 函式庫來</a>處理較小型的資料集（託管在垂直縮放的側邊車中）。Reddit 越來越多的團隊想要一個廣泛支援的 ANN 向量搜尋解決方案，這個解決方案必須符合成本效益、擁有他們想要的搜尋功能，並且能夠擴充至 Reddit 大小的資料。為了滿足這個需求，我們在 2025 年為 Reddit 團隊尋找理想的向量資料庫。</p>
<p>這篇文章描述了我們根據 Reddit 目前的需求，選擇最佳向量資料庫的過程。它並沒有描述整體最佳的向量資料庫，也沒有描述所有情況下最基本的功能和非功能需求集。它描述了 Reddit 及其工程文化在選擇向量資料庫時所重視和優先處理的事項。這篇文章可能會成為您收集和評估需求的靈感，但每個組織都有自己的文化、價值觀和需求。</p>
<h2 id="Evaluation-process" class="common-anchor-header">評估過程<button data-href="#Evaluation-process" class="anchor-icon" translate="no">
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
    </button></h2><p>總體而言，選擇步驟如下</p>
<p>1.從團隊收集情境</p>
<p>2.定性評估解決方案</p>
<p>3.定量評估頂尖競爭者</p>
<p>4.最終選擇</p>
<h3 id="1-Collect-context-from-teams" class="common-anchor-header">1.向團隊收集背景資料</h3><p>從對執行 ANN 向量搜尋有興趣的團隊收集三項情境：</p>
<ul>
<li><p>功能需求（例如，混合向量和詞彙搜尋？範圍搜尋查詢？以非向量屬性篩選？）</p></li>
<li><p>非功能性需求（例如，能否支援 1B 向量？ 能否達到 &lt;100ms P99 延遲？）</p></li>
<li><p>團隊已對向量資料庫感興趣</p></li>
</ul>
<p>訪問團隊的需求並非小事。許多人會以他們目前解決問題的方式來描述他們的需求，而您的挑戰就是了解並消除這種偏見。</p>
<p>例如，一個團隊已經在使用 FAISS 進行 ANN 向量搜尋，並表示新解決方案必須在每次搜尋呼叫中有效率地傳回 10K 個結果。經過進一步討論後，他們發現 10K 結果的原因是他們需要執行後期篩選，而 FAISS 並未在查詢時提供篩選 ANN 結果的功能。他們的實際問題是需要篩選，因此任何提供有效篩選的解決方案都已足夠，而傳回 10K 個結果只是為了提高召回率所需的變通方式。他們的理想是在尋找最近鄰之前預先篩選整個集合。</p>
<p>詢問團隊已經在使用或感興趣的向量資料庫也很有價值。如果至少有一個團隊對他們目前的解決方案有正面的看法，就表示向量資料庫可能是整個公司都可以分享的有用解決方案。如果團隊對某個解決方案只有負面的看法，那麼我們就不應該將其列入選項。接受團隊感興趣的解決方案，也是確保團隊在過程中感受到被包容的一種方式，並幫助我們形成一份要評估的主要競爭者的初步清單；在新的和現有的資料庫中，有太多 ANN 向量搜尋解決方案，不可能窮盡測試所有的解決方案。</p>
<h3 id="2-Qualitatively-evaluate-solutions" class="common-anchor-header">2.定性評估解決方案</h3><p>從團隊感興趣的解決方案清單開始，為了定性評估哪個 ANN 向量搜尋解決方案最符合我們的需求，我們</p>
<ul>
<li><p>研究每個解決方案，並根據每個需求的滿足程度與該需求的加權重要性進行評分</p></li>
<li><p>根據定性標準和討論剔除解決方案</p></li>
<li><p>挑出前 N 個解決方案進行定量測試</p></li>
</ul>
<p>我們的 ANN 向量搜尋解決方案清單包括</p>
<ul>
<li><p><a href="https://milvus.io/">Milvus</a></p></li>
<li><p>Qdrant</p></li>
<li><p>Weviate</p></li>
<li><p>開放搜尋</p></li>
<li><p>Pgvector (已經使用 Postgres 作為 RDBMS)</p></li>
<li><p>Redis (已用作 KV 儲存與快取)</p></li>
<li><p>Cassandra (已用於非 ANN 搜尋)</p></li>
<li><p>Solr (已用於詞彙搜尋，並試用向量搜尋)</p></li>
<li><p>Vespa</p></li>
<li><p>Pinecone</p></li>
<li><p>Vertex AI (已用於 ANN 向量搜尋)</p></li>
</ul>
<p>然後，我們將團隊提到的每項功能性與非功能性需求，加上一些代表我們工程價值與目標的限制條件，將它們列在試算表中，並衡量它們的重要性 (從 1 到 3，如下表所示)。</p>
<p>對於我們要比較的每個解決方案，我們評估（以 0 到 3 的標準）每個系統滿足該需求的程度（如下表所示）。以這種方式評分有點主觀，因此我們挑選了一個系統，並提供了評分範例與書面理由，讓審核人員參考這些範例。我們也為每個分數值的賦予提供了以下指導：在下列情況下賦予此值：</p>
<ul>
<li><p>0: 沒有支援/需求支援的證據</p></li>
<li><p>1：基本或不充分的需求支援</p></li>
<li><p>2: 需求得到合理的支援</p></li>
<li><p>3: 超出可比解決方案的強大需求支援</p></li>
</ul>
<p>接著，我們用解決方案的需求分數與該需求的重要性之乘積的總和，為每個解決方案建立總分（例如，Qdrant 在重新排序/分數結合方面得 3 分，而該需求的重要性為 2，因此 3 x 2 = 6，對所有行重複此步驟，然後相加）。最後，我們會得到一個總分，這個總分可以作為排序和討論解決方案的基礎，以及哪些需求最重要（請注意，這個分數不是用來做最後決定，而是作為討論工具）。</p>
<p><strong><em>編者註：</em></strong> <em>這篇評論是基於 Milvus 2.4。之後我們陸續推出了 Milvus 2.5、</em> <a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md"><em>Milvus 2.6</em></a><em>，而 Milvus 3.0 也即將推出，因此有些數據可能已經過時。儘管如此，這次的比較仍然提供了很強的洞察力，而且仍然非常有幫助。</em></p>
<table>
<thead>
<tr><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th></tr>
</thead>
<tbody>
<tr><td><strong>類別</strong></td><td><strong>重要性</strong></td><td><strong>Qdrant</strong></td><td><a href="https://milvus.io/"><strong>Milvus</strong></a> <strong>(2.4)</strong></td><td><strong>Cassandra</strong></td><td><strong>Weviate</strong></td><td><strong>邏輯</strong></td><td><strong>Vertex AI</strong></td></tr>
<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td><strong>搜尋類型</strong></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td><a href="https://milvus.io/blog/get-started-with-hybrid-semantic-full-text-search-with-milvus-2-5.md">混合搜尋</a></td><td>1</td><td>3</td><td>2</td><td>0</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>關鍵字搜尋</td><td>1</td><td>2</td><td>2</td><td>2</td><td>2</td><td>3</td><td>1</td></tr>
<tr><td>近似 NN 搜尋</td><td>3</td><td>3</td><td>3</td><td>2</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>範圍搜尋</td><td>1</td><td>3</td><td>3</td><td>2</td><td>2</td><td>0</td><td>0</td></tr>
<tr><td>重新排序/分數合併</td><td>2</td><td>3</td><td>2</td><td>0</td><td>2</td><td>2</td><td>1</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td><strong>索引方法</strong></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>HNSW</td><td>3</td><td>3</td><td>3</td><td>2</td><td>2</td><td>2</td><td>0</td></tr>
<tr><td>支援多種索引方法</td><td>3</td><td>0</td><td>3</td><td>1</td><td>2</td><td>1</td><td>1</td></tr>
<tr><td>量化</td><td>1</td><td>3</td><td>3</td><td>0</td><td>3</td><td>0</td><td>0</td></tr>
<tr><td>區域敏感散列 (LSH)</td><td>1</td><td>0</td><td>0註：<a href="https://milvus.io/blog/minhash-lsh-in-milvus-the-secret-weapon-for-fighting-duplicates-in-llm-training-data.md">Milvus 2.6 支援。 </a></td><td>0</td><td>0</td><td>0</td><td>0</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td><strong>資料</strong></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>浮點型以外的向量類型</td><td>1</td><td>2</td><td>2</td><td>0</td><td>2</td><td>2</td><td>0</td></tr>
<tr><td>向量上的元資料屬性 (支援多重屬性、較大的記錄大小等)</td><td>3</td><td>3</td><td>2</td><td>2</td><td>2</td><td>2</td><td>1</td></tr>
<tr><td>元資料篩選選項（可篩選元資料，具有前/後篩選功能）</td><td>2</td><td>3</td><td>2</td><td>2</td><td>2</td><td>3</td><td>2</td></tr>
<tr><td>元資料屬性資料類型 (強健模式，例如 bool、int、string、json、陣列)</td><td>1</td><td>3</td><td>3</td><td>2</td><td>2</td><td>3</td><td>1</td></tr>
<tr><td>元資料屬性限制（範圍查詢，例如 10 &lt; x &lt; 15）</td><td>1</td><td>3</td><td>3</td><td>2</td><td>2</td><td>2</td><td>1</td></tr>
<tr><td>按屬性劃分的結果多樣性 (例如：在回覆中從每個 subreddit 取得的結果不超過 N 個)</td><td>1</td><td>2</td><td>1</td><td>2</td><td>3</td><td>3</td><td>0</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td><strong>規模</strong></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>數億向量索引</td><td>3</td><td>2</td><td>3</td><td></td><td>1</td><td>2</td><td>3</td></tr>
<tr><td>十億向量指數</td><td>1</td><td>2</td><td>2</td><td></td><td>1</td><td>2</td><td>2</td></tr>
<tr><td>支援向量至少 2k</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>1</td><td>1</td></tr>
<tr><td>支援向量大於 2k</td><td>2</td><td>2</td><td>2</td><td>2</td><td>1</td><td>1</td><td>1</td></tr>
<tr><td>P95 延遲 50-100ms @ X QPS</td><td>3</td><td>2</td><td>2</td><td>2</td><td>1</td><td>1</td><td>2</td></tr>
<tr><td>P99 延遲 &lt;= 10ms @ X QPS</td><td>3</td><td>2</td><td>2</td><td>2</td><td>3</td><td>1</td><td>2</td></tr>
<tr><td>99.9% 可用性檢索</td><td>2</td><td>2</td><td>2</td><td>3</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>99.99% 可用性索引/儲存</td><td>2</td><td>1</td><td>1</td><td>3</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td><strong>儲存作業</strong></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>可託管於 AWS</td><td>3</td><td>2</td><td>2</td><td>2</td><td>2</td><td>3</td><td>0</td></tr>
<tr><td>多區域</td><td>1</td><td>1</td><td>2</td><td>3</td><td>1</td><td>2</td><td>2</td></tr>
<tr><td>零停機升級</td><td>1</td><td>2</td><td>2</td><td>3</td><td>2</td><td>2</td><td>1</td></tr>
<tr><td>多雲端</td><td>1</td><td>3</td><td>3</td><td>3</td><td>2</td><td>2</td><td>0</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td><strong>APIs/Libraries</strong></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>gRPC</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>0</td><td>2</td></tr>
<tr><td>RESTful API</td><td>1</td><td>3</td><td>2</td><td>2</td><td>2</td><td>1</td><td>2</td></tr>
<tr><td>去圖書館</td><td>3</td><td>2</td><td>2</td><td>2</td><td>2</td><td>1</td><td>2</td></tr>
<tr><td>Java 圖書館</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>Python</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>其他語言（C++、Ruby 等）</td><td>1</td><td>2</td><td>2</td><td>3</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td><strong>運行時作業</strong></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>Prometheus 度量</td><td>3</td><td>2</td><td>2</td><td>2</td><td>3</td><td>2</td><td>0</td></tr>
<tr><td>基本 DB 操作</td><td>3</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>上鎖</td><td>2</td><td>2</td><td>2</td><td>2</td><td>1</td><td>2</td><td>2</td></tr>
<tr><td>Kubernetes 操作員</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>0</td></tr>
<tr><td>結果分頁</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>0</td></tr>
<tr><td>依 ID 嵌入查詢</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>返回包含候選 ID 和候選得分的嵌入</td><td>1</td><td>3</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>使用者提供的 ID</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>能夠在大規模批次情境中搜尋</td><td>1</td><td>2</td><td>1</td><td>1</td><td>2</td><td>1</td><td>2</td></tr>
<tr><td>備份 / 快照：支援為整個資料庫建立備份的功能</td><td>1</td><td>2</td><td>2</td><td>2</td><td>3</td><td>3</td><td>2</td></tr>
<tr><td>高效的大型索引支援（冷儲存與熱儲存的區別）</td><td>1</td><td>3</td><td>2</td><td>2</td><td>2</td><td>1</td><td>2</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td><strong>支援/社區</strong></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>供應商中立性</td><td>3</td><td>3</td><td>2</td><td>3</td><td>2</td><td>3</td><td>0</td></tr>
<tr><td>強大的 api 支援</td><td>3</td><td>3</td><td>3</td><td>2</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>供應商支援</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>0</td></tr>
<tr><td>社區速度</td><td>2</td><td>3</td><td>2</td><td>2</td><td>2</td><td>2</td><td>0</td></tr>
<tr><td>生產用戶群</td><td>2</td><td>3</td><td>3</td><td>2</td><td>2</td><td>1</td><td>2</td></tr>
<tr><td>社區感受</td><td>1</td><td>3</td><td>2</td><td>2</td><td>2</td><td>2</td><td>1</td></tr>
<tr><td>Github 星級</td><td>1</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>0</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td><strong>配置</strong></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>秘密處理</td><td>2</td><td>2</td><td>2</td><td>2</td><td>1</td><td>2</td><td>2</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td><strong>來源</strong></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>開放源碼</td><td>3</td><td>3</td><td>3</td><td>3</td><td>2</td><td>3</td><td>0</td></tr>
<tr><td>語言</td><td>2</td><td>3</td><td>3</td><td>2</td><td>3</td><td>2</td><td>0</td></tr>
<tr><td>釋出</td><td>2</td><td>3</td><td>3</td><td>2</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>上游測試</td><td>1</td><td>2</td><td>3</td><td>3</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>文件的提供</td><td>3</td><td>3</td><td>3</td><td>2</td><td>1</td><td>2</td><td>1</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td><strong>成本效益</strong></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>成本效益</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>1</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td><strong>效能</strong></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>支援調整 CPU、記憶體和磁碟的資源使用率</td><td>3</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>多節點 (pod) 分片</td><td>3</td><td>2</td><td>2</td><td>3</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>具備調整系統以平衡延遲與吞吐量的能力</td><td>2</td><td>2</td><td>2</td><td>3</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>使用者定義的分割 (寫入)</td><td>1</td><td>3</td><td>2</td><td>3</td><td>1</td><td>2</td><td>0</td></tr>
<tr><td>多租戶</td><td>1</td><td>3</td><td>2</td><td>1</td><td>3</td><td>2</td><td>2</td></tr>
<tr><td>分區</td><td>2</td><td>2</td><td>2</td><td>3</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>複製</td><td>2</td><td>2</td><td>2</td><td>3</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>冗餘</td><td>1</td><td>2</td><td>2</td><td>3</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>自動故障移轉</td><td>3</td><td>2</td><td>0 注意：<a href="https://milvus.io/docs/coordinator_ha.md">Milvus 2.6 支援。 </a></td><td>3</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>負載平衡</td><td>2</td><td>2</td><td>2</td><td>3</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>GPU 支援</td><td>1</td><td>0</td><td>2</td><td>0</td><td>0</td><td>0</td><td>0</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td></td><td></td><td><strong>Qdrant</strong></td><td><a href="https://milvus.io/"><strong>Milvus</strong></a></td><td><strong>卡桑德拉</strong></td><td><strong>Weviate</strong></td><td><strong>邏輯</strong></td><td><strong>Vertex AI</strong></td></tr>
<tr><td><strong>整體解決方案得分</strong></td><td></td><td>292</td><td>281</td><td>264</td><td>250</td><td>242</td><td>173</td></tr>
</tbody>
</table>
<p>我們討論了各種系統的整體評分和需求評分，並試圖瞭解我們是否適當地衡量了需求的重要性，以及某些需求是否重要到應該被視為核心限制。我們發現的其中一項需求是解決方案是否開放原始碼，因為我們希望解決方案能讓我們參與其中、貢獻心力，並在我們的規模遇到小問題時快速修正。貢獻和使用開源軟體是 Reddit 工程文化的重要部分。因此，我們排除了只提供託管服務的解決方案 (Vertex AI、Pinecone)。</p>
<p>在討論過程中，我們發現其他幾項關鍵需求對我們來說非常重要：</p>
<ul>
<li><p>規模與可靠性：我們希望看到其他公司運行該解決方案時，向量達到 1 億以上甚至 1B 的證據。</p></li>
<li><p>社群：我們希望解決方案擁有一個健康的社群，並在這個快速成熟的領域中擁有強大的動力。</p></li>
<li><p>豐富的元資料類型和篩選功能，以支援我們更多的使用案例 (依日期、布林值等篩選)</p></li>
<li><p>支援多種索引類型 (不只是 HNSW 或 DiskANN)，以更符合我們許多獨特使用個案的效能。</p></li>
</ul>
<p>我們討論的結果和關鍵需求的磨練，讓我們選擇（依序）量化測試：</p>
<ol>
<li><p>Qdrant</p></li>
<li><p>Milvus</p></li>
<li><p>Vespa 和</p></li>
<li><p>Weviate</p></li>
</ol>
<p>不幸的是，這樣的決定需要時間和資源，而任何組織都沒有無限的時間和資源。考慮到我們的預算，我們決定測試 Qdrant 和 Milvus，並將測試 Vespa 和 Weviate 列為延伸目標。</p>
<p>Qdrant vs Milvus 也是對兩種不同架構的有趣測試：</p>
<ul>
<li><p><strong>Qdrant：</strong>執行所有 ANN 向量資料庫作業的同質節點類型</p></li>
<li><p><strong>Milvus：</strong> <a href="https://milvus.io/docs/architecture_overview.md">異質節點類型</a>(Milvus；一個用於查詢，另一個用於索引，還有一個用於資料擷取、代理等)</p></li>
</ul>
<p>哪一個容易設定（對其文件的測試）？哪一種容易執行（測試其彈性特徵與潤飾）？哪一個對於我們關心的使用個案和規模來說表現最好？這些問題都是我們在量化比較解決方案時想要回答的。</p>
<h3 id="3-Quantitatively-evaluate-top-contenders" class="common-anchor-header">3.量化評估頂尖競爭者</h3><p>我們想要更好地瞭解每個解決方案的可擴充性，並在過程中體驗每個解決方案在規模上的設定、組態、維護和執行。為此，我們針對三種不同的使用案例，收集了三個文件和查詢向量的資料集，在 Kubernetes 中使用類似的資源設定每個解決方案，將文件載入每個解決方案，並使用<a href="https://k6.io/">Grafana 的 K6</a>搭配斜坡式到達率執行器傳送相同的查詢負載，讓系統在達到目標吞吐量 (例如 100 QPS) 前暖身。</p>
<p>我們測試了吞吐量、每個解決方案的突破點、吞吐量與延遲之間的關係，以及它們在負載下失去節點時的反應（錯誤率、延遲影響等）。最令人感興趣的是<strong>過濾對延遲的影響</strong>。我們還進行了簡單的是/否測試，以驗證文件中的功能是否如描述般有效（例如，upserts、delete、get by ID、使用者管理等），並體驗這些 API 的人體工學。</p>
<p><strong>測試在 Milvus v2.4 和 Qdrant v1.12 上進行。</strong>由於時間有限，我們並沒有徹底調整或測試所有類型的索引設定；每個解決方案都使用類似的設定，偏重於高 ANN 召回率，測試則著重於 HNSW 索引的效能。每個解決方案的 CPU 和記憶體資源也相似。</p>
<p>在實驗中，我們發現兩個解決方案之間有一些有趣的差異。在以下的實驗中，每個解決方案都有大約 340M Reddit post 向量，每個向量有 384 個維度，對於 HNSW，M=16，efConstruction=100。</p>
<p>在一個實驗中，我們發現在相同的查詢吞吐量 (100 QPS，同時沒有擷取) 下，加入過濾功能對 Milvus 的延遲影響比 Qdrant 更大。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Post_query_latency_with_filtering_2cb4c03d5b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>使用過濾的查詢延遲</p>
<p>另外，我們發現在 Qdrant 上，擷取與查詢負載之間的互動程度遠高於 Milvus（如下圖所示，在吞吐量固定的情況下）。這可能是由於其架構所致；Milvus 將大部分的擷取與提供查詢流量的節點分開，而 Qdrant 則從相同的節點提供擷取與查詢流量。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Posts_query_latency_100_QPS_during_ingest_e919a448cb.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>擷取期間的查詢延遲 @ 100 QPS</p>
<p>當測試按屬性分類的結果多樣性時 (例如，在回應中從每個 subreddit 取得的結果不超過 N 個)，我們發現在相同的吞吐量下，Milvus 的延遲比 Qdrant 更差 (在 100 QPS 的情況下)。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Post_query_latency_with_result_diversity_b126f562cd.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>結果多樣性的查詢後延遲</p>
<p>我們也想看看當資料複製次數增加時（即複製因子 RF 從 1 增加到 2），每個解決方案的擴充效率如何。最初，在 RF=1 的情況下，Qdrant 能夠以比 Milvus 更高的吞吐量為我們提供令人滿意的延遲（由於測試未完成且未出錯，因此未顯示更高的 QPS）。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Qdrant_posts_RF_1_latency_for_varying_throughput_bc161c8b1c.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Qdrant 在不同吞吐量下的 RF=1 延遲時間</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Milvus_posts_RF_1_latency_for_varying_throughput_e81775b3af.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Milvus 在不同吞吐量下的延遲為 RF=1</p>
<p>然而，當增加複製因子時，Qdrant 的 p99 延遲有所改善，但 Milvus 能維持比 Qdrant 更高的吞吐量，且延遲可接受 (Qdrant 400 QPS 未顯示，因為測試因高延遲及錯誤而未完成)。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Milvus_posts_RF_2_latency_for_varying_throughput_7737dfb8a3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Milvus 在不同吞吐量下的延遲為 RF=2</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Qdrant_posts_RF_2_latency_for_varying_throughput_13fb26aaa1.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Qdrant 在不同吞吐量下的 RF=2 延遲</p>
<p>由於時間限制，我們沒有足夠時間比較 ANN 在我們的資料集上的解決方案召回率，但我們參考了<a href="https://ann-benchmarks.com/">https://ann-benchmarks.com/</a>所提供的 ANN 在公開資料集上的解決方案召回率測量。</p>
<h3 id="4-Final-selection" class="common-anchor-header">4.最終選擇</h3><p><strong>從效能上來</strong>看，在沒有做太多的調整且只使用 HNSW 的情況下，Qdrant 在許多測試中的原始延遲似乎都比 Milvus 好。然而，Milvus 看起來會隨著複製的增加而擴充得更好，而且由於其多節點類型的架構，在擷取與查詢負載之間有更好的隔離。</p>
<p><strong>在操作方面，</strong>儘管 Milvus 的架構很複雜（多節點類型、依賴像 Kafka 之類的外部先寫日誌和像 etcd 之類的元資料儲存庫），但當任何一個解決方案進入不良狀態時，我們都比 Qdrant 更容易除錯和修復 Milvus。Milvus 還能在增加集合的複製因子時自動重新平衡，而在開放原始碼的 Qdrant 中，要增加複製因子就必須手動建立或丟棄分片（這是我們必須自行建立或使用非開放原始碼版本的功能）。</p>
<p>Milvus 是比 Qdrant 更「Reddit 型」的技術；它與我們技術堆疊的其他部分有更多相似之處。Milvus 是用我們偏好的後端程式語言 Golang 寫成的，因此對我們來說比用 Rust 寫成的 Qdrant 更容易貢獻心力。與 Qdrant 相比，Milvus 的開放原始碼產品擁有極佳的專案速度，而且符合我們更多的關鍵需求。</p>
<p>最後，兩個解決方案都滿足了我們大部分的需求，而且在某些情況下，Qdrant 在效能上更具優勢，但我們覺得可以進一步擴充 Milvus，執行起來也更舒適，而且它比 Qdrant 更適合我們的組織。我們希望有更多時間測試 Vespa 和 Weaviate，但它們也可能因為組織契合度（Vespa 基於 Java）和架構（Weaviate 和 Qdrant 一樣是單結點類型）而被選中。</p>
<h2 id="Key-takeaways" class="common-anchor-header">重要啟示<button data-href="#Key-takeaways" class="anchor-icon" translate="no">
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
<li><p>挑戰給您的需求，並嘗試消除現有解決方案的偏見。</p></li>
<li><p>為候選解決方案評分，並以此作為討論基本需求的依據，而非萬無一失。</p></li>
<li><p>定量評估解決方案，但在過程中也要注意與解決方案合作的感受。</p></li>
<li><p>從維護、成本、可用性和效能的角度來看，挑選最適合您組織的解決方案，而不只是因為某個解決方案的效能最好。</p></li>
</ul>
<h2 id="Acknowledgements" class="common-anchor-header">鳴謝<button data-href="#Acknowledgements" class="anchor-icon" translate="no">
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
    </button></h2><p>本評估工作由 Ben Kochie、Charles Njoroge、Amit Kumar 和我共同完成。也感謝其他對本工作有貢獻的人，包括 Annie Yang、Konrad Reiche、Sabrina Kong 和 Andrew Johnson，他們對解決方案進行了定性研究。</p>
<h2 id="Editor’s-Notes" class="common-anchor-header">編輯手記<button data-href="#Editor’s-Notes" class="anchor-icon" translate="no">
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
    </button></h2><p>我們要衷心感謝 Reddit 工程團隊 - 不只是因為他們選擇 Milvus 來處理向量搜尋工作負載，也因為他們花時間發表如此詳細且公平的評估。很少看到真正的工程團隊在比較資料庫時有如此高的透明度，他們的文章對 Milvus 社群（以及其他社群）中嘗試了解不斷成長的向量資料庫環境的人很有幫助。</p>
<p>正如 Chris 在文章中提到的，沒有單一「最佳」的向量資料庫。重要的是一個系統是否適合您的工作量、限制條件和操作理念。Reddit 的比較很好地反映了這一現實。Milvus 並非在每個類別中都名列前茅，這完全在意料之中，因為不同的資料模型和效能目標會有所取捨。</p>
<p>有一點值得澄清：Reddit 的評估使用了<strong>Milvus 2.4</strong>，也就是當時的穩定版。有些功能 - 例如 LSH 和幾個索引優化 - 在 2.4 時還不存在或不成熟，所以有幾個評分很自然地反映了較舊的基線。自此之後，我們相繼發佈了 Milvus 2.5 和<a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md"><strong>Milvus 2.6</strong></a>，在效能、效率和彈性方面，它都是一個截然不同的系統。社群反應強烈，許多團隊已經升級。</p>
<p><strong>以下是 Milvus 2.6 的新功能簡介：</strong></p>
<ul>
<li><p>使用 RaBitQ 1 位量化技術，<strong>記憶體使用率降低 72%</strong>，<strong>查詢速度提升 4 倍</strong></p></li>
<li><p>智慧型分層儲存可<strong>降低 50% 的成本</strong></p></li>
<li><p>與 Elasticsearch 相比，<strong>BM25 全文搜尋速度快 4 倍</strong></p></li>
<li><p>使用新的路徑索引，<strong>JSON 篩選速度提高 100 倍</strong></p></li>
<li><p>全新的零磁碟架構，能以更低的成本進行更新的搜尋</p></li>
<li><p>更簡單的「資料進出」工作流程，可嵌入管道</p></li>
<li><p>支援<strong>100K 以上的集合</strong>，以處理大型的多租戶環境</p></li>
</ul>
<p>如果您想要完整的細節，這裡有一些很好的跟進：</p>
<ul>
<li><p>部落格：<a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md">介紹 Milvus 2.6：十億規模的經濟實惠向量搜尋</a></p></li>
<li><p><a href="https://milvus.io/docs/release_notes.md">Milvus 2.6 發行紀錄： </a></p></li>
<li><p><a href="https://milvus.io/blog/vdbbench-1-0-benchmarking-with-your-real-world-production-workloads.md">VDBBench 1.0：矢量資料庫的真實世界基準 - Milvus 部落格</a></p></li>
</ul>
<p>有問題或想深入了解任何功能？加入我們的<a href="https://discord.com/invite/8uyFbECzPX"> Discord 頻道</a>或在<a href="https://github.com/milvus-io/milvus"> GitHub</a> 上提出問題。您也可以透過<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus Office Hours</a> 預約 20 分鐘的一對一會議，以獲得洞察力、指導和問題解答。</p>
