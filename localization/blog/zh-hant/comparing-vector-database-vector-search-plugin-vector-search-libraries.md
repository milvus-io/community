---
id: comparing-vector-database-vector-search-plugin-vector-search-libraries.md
title: 比較向量資料庫、向量搜尋程式庫和向量搜尋外掛程式
author: Frank Liu
date: 2023-11-9
desc: 在這篇文章中，我們將繼續探索向量搜尋的複雜領域，比較向量資料庫、向量搜尋外掛程式和向量搜尋程式庫。
cover: >-
  assets.zilliz.com/Vector_Databases_vs_Vector_Search_Plugins_vs_Vector_Search_Libraries_74def521ad.png
tag: Engineering
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  vector search
recommend: true
canonicalUrl: >-
  https://zilliz.com/learn/comparing-vector-database-vector-search-library-and-vector-search-plugin
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Vector_Databases_vs_Vector_Search_Plugins_vs_Vector_Search_Libraries_74def521ad.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>大家好 - 歡迎回到向量資料庫 101！</p>
<p><a href="https://zilliz.com/learn/ChatGPT-Vector-Database-Prompt-as-code">ChatGPT</a>和其他大型語言模型 (LLM) 的激增帶動了向量搜尋技術的成長，包括<a href="https://zilliz.com/what-is-milvus">Milvus</a>和<a href="https://zilliz.com/cloud">Zilliz Cloud</a>等專業向量資料庫，以及<a href="https://zilliz.com/blog/set-up-with-facebook-ai-similarity-search-faiss">FAISS</a>等資料庫和傳統資料庫內的整合向量搜尋外掛。</p>
<p>在<a href="https://zilliz.com/learn/what-is-vector-database">上一篇系列文章</a>中，我們深入探討了向量資料庫的基本原理。在這篇文章中，我們將繼續探索向量搜尋的複雜領域，比較向量資料庫、向量搜尋外掛程式和向量搜尋程式庫。</p>
<h2 id="What-is-vector-search" class="common-anchor-header">什麼是向量搜尋？<button data-href="#What-is-vector-search" class="anchor-icon" translate="no">
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
    </button></h2><p>向量<a href="https://zilliz.com/learn/vector-similarity-search">搜尋也</a>稱為向量相似性搜尋，是一種在廣泛的密集向量資料集合中，擷取與指定查詢向量最相似或語意最相關的 top-k 結果的技術。在進行相似性搜尋之前，我們利用神經網路<a href="https://zilliz.com/learn/introduction-to-unstructured-data">將非結構化資料</a>，例如文字、影像、視訊和音訊，轉換成高維數值向量，稱為嵌入向量。在產生嵌入向量之後，向量搜尋引擎會比較輸入查詢向量與向量倉庫中的向量之間的空間距離。它們在空間上越接近，就表示越相似。</p>
<p>市場上有多種向量搜尋技術，包括 Python 的 NumPy 等機器學習程式庫、FAISS 等向量搜尋程式庫、建置在傳統資料庫上的向量搜尋外掛，以及 Milvus 和 Zilliz Cloud 等專門向量資料庫。</p>
<h2 id="Vector-databases-vs-vector-search-libraries" class="common-anchor-header">向量資料庫 vs. 向量搜尋程式庫<button data-href="#Vector-databases-vs-vector-search-libraries" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://zilliz.com/blog/what-is-a-real-vector-database">專門的向量資料庫並</a>不是類似性搜尋的唯一堆疊。在向量資料庫出現之前，許多向量搜索庫，例如 FAISS、ScaNN 和 HNSW，都是用來進行向量檢索的。</p>
<p>向量搜尋程式庫可以幫助您快速建立高效能的向量搜尋系統原型。以 FAISS 為例，它是由 Meta 開發的開放原始碼，用於高效率的相似性搜尋和密集向量聚類。FAISS 可以處理任何大小的向量集合，甚至是無法完全載入記憶體的向量集合。此外，FAISS 還提供評估和參數調整的工具。儘管 FAISS 是以 C++ 寫成，但仍提供 Python/NumPy 介面。</p>
<p>然而，向量搜尋函式庫只是輕量級 ANN 函式庫，而非管理式解決方案，而且功能有限。如果您的資料集較小且有限，這些函式庫足以處理非結構化資料，甚至對於在生產中運行的系統也是如此。然而，隨著資料集規模的擴大和更多使用者的加入，規模問題變得越來越難解決。此外，這些資料庫不允許對其索引資料進行任何修改，也無法在資料匯入時進行查詢。</p>
<p>相比之下，向量資料庫是非結構化資料儲存和檢索的最佳解決方案。它們可以儲存和查詢數百萬甚至數十億個向量，同時提供即時回應；它們具有高度擴充性，可以滿足使用者不斷成長的業務需求。</p>
<p>此外，Milvus 等向量資料庫對於結構化/半結構化資料具有更多的使用者友好功能：雲性、多租戶、可擴展性等。當我們深入了解本教學後，這些功能就會明瞭。</p>
<p>它們也是在與向量搜尋庫完全不同的抽象層中運作 - 向量資料庫是完整的服務，而 ANN 函式庫則是要整合到您正在開發的應用程式中。在這個意義上，ANN 函式庫是向量資料庫建構在其上的眾多元件之一，類似於 Elasticsearch 建構在 Apache Lucene 之上。</p>
<p>要舉例說明這個抽象為何如此重要，讓我們來看看在向量資料庫中插入一個新的非結構化資料元素。這在 Milvus 中超級簡單：</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> <span class="hljs-title class_">Collectioncollection</span> = <span class="hljs-title class_">Collection</span>(<span class="hljs-string">&#x27;book&#x27;</span>)mr = collection.<span class="hljs-title function_">insert</span>(data)
<button class="copy-code-btn"></button></code></pre>
<p>就是這麼簡單 - 3 行代碼。對於 FAISS 或 ScaNN 之類的函式庫，不幸的是，如果不在特定檢查點手動重新建立整個索引，就沒有簡單的方法可以做到這一點。即使可以，向量搜尋程式庫仍然缺乏可擴充性和多租戶功能，而這兩項功能正是向量資料庫最重要的功能。</p>
<h2 id="Vector-databases-vs-vector-search-plugins-for-traditional-databases" class="common-anchor-header">向量資料庫 vs. 傳統資料庫的向量搜尋外掛<button data-href="#Vector-databases-vs-vector-search-plugins-for-traditional-databases" class="anchor-icon" translate="no">
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
    </button></h2><p>很好，既然我們已經確立了向量搜尋程式庫與向量資料庫之間的差異，現在讓我們來看看向量資料庫與<strong>向量搜尋外掛</strong>的不同之處。</p>
<p>越來越多的傳統關聯式資料庫以及搜尋系統（例如 Clickhouse 和<a href="https://zilliz.com/blog/elasticsearch-cloud-vs-zilliz">Elasticsearch</a>）都內建了向量搜尋外掛。例如，Elasticsearch 8.0 包含向量插入和 ANN 搜尋功能，可透過 restful API 端點來呼叫。向量搜尋外掛的問題應該是一目了然的 -<strong>這些解決方案並未採用全堆疊的方式來嵌入管理和向量搜尋</strong>。相反地，這些外掛程式的目的是在現有架構的基礎上進行增強，因此使它們變得有限且未經優化。在傳統資料庫之上開發非結構化資料應用程式，就好像試圖將鋰電池和電動馬達裝入汽油動力汽車的車架內一樣，不是一個好主意！</p>
<p>為了說明原因，讓我們回到向量資料庫應該實現的功能清單（從第一部分開始）。向量搜尋外掛缺少其中兩項功能 - 可調整性和使用者友善的 API/SDK。我將繼續以 Elasticsearch 的 ANN 引擎為例；其他向量搜尋外掛的運作方式都非常類似，所以我就不多說了。Elasticsearch 透過<code translate="no">dense_vector</code> 資料欄位類型支援向量儲存，並允許透過<code translate="no">knnsearch endpoint</code> 進行查詢：</p>
<pre><code translate="no" class="language-json">PUT index
{
<span class="hljs-string">&quot;mappings&quot;</span>: {
  <span class="hljs-string">&quot;properties&quot;</span>: {
    <span class="hljs-string">&quot;image-vector&quot;</span>: {
      <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;dense_vector&quot;</span>,
      <span class="hljs-string">&quot;dims&quot;</span>: 128,
      <span class="hljs-string">&quot;index&quot;</span>: <span class="hljs-literal">true</span>,
      <span class="hljs-string">&quot;similarity&quot;</span>: <span class="hljs-string">&quot;l2_norm&quot;</span>
    }
  }
}
}


PUT index/_doc
{
<span class="hljs-string">&quot;image-vector&quot;</span>: [0.12, 1.34, ...]
}
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no" class="language-json">GET index/_knn_search
{
<span class="hljs-string">&quot;knn&quot;</span>: {
  <span class="hljs-string">&quot;field&quot;</span>: <span class="hljs-string">&quot;image-vector&quot;</span>,
  <span class="hljs-string">&quot;query_vector&quot;</span>: [-0.5, 9.4, ...],
  <span class="hljs-string">&quot;k&quot;</span>: 10,
  <span class="hljs-string">&quot;num_candidates&quot;</span>: 100
}
}
<button class="copy-code-btn"></button></code></pre>
<p>Elasticsearch 的 ANN 外掛只支援一種索引演算法：Hierarchical Navigable Small Worlds，也稱為 HNSW（我喜歡認為創作者在普及多元宇宙時走在了 Marvel 的前面）。除此之外，只支援 L2/Euclidean 距離作為距離公制。這是一個不錯的開始，但讓我們將它與完整的向量資料庫 Milvus 作一比較。使用<code translate="no">pymilvus</code> ：</p>
<pre><code translate="no" class="language-python"><span class="hljs-meta">&gt;&gt;&gt; </span>field1 = FieldSchema(name=<span class="hljs-string">&#x27;id&#x27;</span>, dtype=DataType.INT64, description=<span class="hljs-string">&#x27;int64&#x27;</span>, is_primary=<span class="hljs-literal">True</span>)
<span class="hljs-meta">&gt;&gt;&gt; </span>field2 = FieldSchema(name=<span class="hljs-string">&#x27;embedding&#x27;</span>, dtype=DataType.FLOAT_VECTOR, description=<span class="hljs-string">&#x27;embedding&#x27;</span>, dim=<span class="hljs-number">128</span>, is_primary=<span class="hljs-literal">False</span>)
<span class="hljs-meta">&gt;&gt;&gt; </span>schema = CollectionSchema(fields=[field1, field2], description=<span class="hljs-string">&#x27;hello world collection&#x27;</span>)
<span class="hljs-meta">&gt;&gt;&gt; </span>collection = Collection(name=<span class="hljs-string">&#x27;my_collection&#x27;</span>, data=<span class="hljs-literal">None</span>, schema=schema)
<span class="hljs-meta">&gt;&gt;&gt; </span>index_params = {
       <span class="hljs-string">&#x27;index_type&#x27;</span>: <span class="hljs-string">&#x27;IVF_FLAT&#x27;</span>,
       <span class="hljs-string">&#x27;params&#x27;</span>: {<span class="hljs-string">&#x27;nlist&#x27;</span>: <span class="hljs-number">1024</span>},
       <span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&#x27;L2&#x27;</span>}
<span class="hljs-meta">&gt;&gt;&gt; </span>collection.create_index(<span class="hljs-string">&#x27;embedding&#x27;</span>, index_params)
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no" class="language-python"><span class="hljs-meta">&gt;&gt;&gt; </span>search_param = {
       <span class="hljs-string">&#x27;data&#x27;</span>: vector,
       <span class="hljs-string">&#x27;anns_field&#x27;</span>: <span class="hljs-string">&#x27;embedding&#x27;</span>,
       <span class="hljs-string">&#x27;param&#x27;</span>: {<span class="hljs-string">&#x27;metric_type&#x27;</span>: <span class="hljs-string">&#x27;L2&#x27;</span>, <span class="hljs-string">&#x27;params&#x27;</span>: {<span class="hljs-string">&#x27;nprobe&#x27;</span>: <span class="hljs-number">16</span>}},
       <span class="hljs-string">&#x27;limit&#x27;</span>: <span class="hljs-number">10</span>,
       <span class="hljs-string">&#x27;expr&#x27;</span>: <span class="hljs-string">&#x27;id_field &gt; 0&#x27;</span>
   }
<span class="hljs-meta">&gt;&gt;&gt; </span>results = collection.search(**search_param)
<button class="copy-code-btn"></button></code></pre>
<p>雖然<a href="https://zilliz.com/comparison/elastic-vs-milvus">Elasticsearch 和 Milvus</a>都有建立索引、插入嵌入向量和執行近鄰搜尋的方法，但從這些範例中可以明顯看出，Milvus 有更直覺的向量搜尋 API (更好的使用者介面 API)，以及更廣泛的向量索引 + 距離公制支援 (更好的可調性)。Milvus 還計畫在未來支援更多向量索引，並允許透過類似 SQL 的語句進行查詢，以進一步改善可調性和可用性。</p>
<p>我們剛剛讀了不少內容。這一部分的內容確實相當長，所以對於那些略過這一部分的人來說，這裡有一個快速的總結：Milvus 比向量搜尋外掛更好，因為 Milvus 從一開始就是以向量資料庫的方式來建立的，允許更豐富的功能和更適合非結構化資料的架構。</p>
<h2 id="How-to-choose-from-different-vector-search-technologies" class="common-anchor-header">如何選擇不同的向量搜尋技術？<button data-href="#How-to-choose-from-different-vector-search-technologies" class="anchor-icon" translate="no">
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
    </button></h2><p>並不是所有的向量資料庫都是一樣的；每種資料庫都擁有獨特的特質來迎合特定的應用程式。向量搜尋程式庫和外掛程式對使用者友善，非常適合處理擁有數百萬向量的小型生產環境。如果您的資料規模較小，而且只需要基本的向量搜尋功能，這些技術就足以滿足您的需求。</p>
<p>然而，對於處理數百萬向量且要求即時回應的資料密集型企業而言，專門的向量資料庫應該是您的首選。例如，Milvus 可以毫不費力地管理數十億個向量，提供快如閃電的查詢速度和豐富的功能。此外，像 Zilliz 這種全面管理的解決方案更具優勢，可將您從營運挑戰中解放出來，專注於核心業務活動。</p>
<h2 id="Take-another-look-at-the-Vector-Database-101-courses" class="common-anchor-header">再來看看 Vector 資料庫 101 課程<button data-href="#Take-another-look-at-the-Vector-Database-101-courses" class="anchor-icon" translate="no">
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
<li><a href="https://zilliz.com/blog/introduction-to-unstructured-data">非結構化資料簡介</a></li>
<li><a href="https://zilliz.com/learn/what-is-vector-database">什麼是向量資料庫？</a></li>
<li><a href="https://zilliz.com/learn/comparing-vector-database-vector-search-library-and-vector-search-plugin">比較矢量資料庫、矢量搜尋庫和矢量搜尋外掛程式</a></li>
<li><a href="https://zilliz.com/blog/introduction-to-milvus-vector-database">Milvus 簡介</a></li>
<li><a href="https://zilliz.com/blog/milvus-vector-database-quickstart">Milvus 快速入門</a></li>
<li><a href="https://zilliz.com/blog/vector-similarity-search">矢量相似度搜尋介紹</a></li>
<li><a href="https://zilliz.com/blog/vector-index">矢量索引基礎與反向檔案索引</a></li>
<li><a href="https://zilliz.com/blog/scalar-quantization-and-product-quantization">標量量化與乘積量化</a></li>
<li><a href="https://zilliz.com/blog/hierarchical-navigable-small-worlds-HNSW">分層可導航的小世界 (HNSW)</a></li>
<li><a href="https://zilliz.com/learn/approximate-nearest-neighbor-oh-yeah-ANNOY">近似近鄰 (ANNOY)</a></li>
<li><a href="https://zilliz.com/learn/choosing-right-vector-index-for-your-project">為您的專案選擇正確的向量索引</a></li>
<li><a href="https://zilliz.com/learn/DiskANN-and-the-Vamana-Algorithm">DiskANN 與 Vamana 演算法</a></li>
</ol>
