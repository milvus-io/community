---
id: why-and-when-you-need-a-purpose-built-vector-database.md
title: 為何及何時需要專用的向量資料庫？
author: James Luan
date: 2023-08-29T00:00:00.000Z
cover: >-
  assets.zilliz.com/Why_you_need_a_real_vector_database2_20230830_075505_1_4b32582c87.png
tag: Engineering
tags: >-
  Vector Database, AI, Artificial Intelligence, Machine Learning, Milvus, LLM,
  Large Language Models, Embeddings, Vector search, Vector similarity search
desc: 本文章將概述向量搜尋及其功能，比較不同的向量搜尋技術，並解釋為何選擇專門建立的向量資料庫至關重要。
recommend: true
canonicalUrl: >-
  https://www.aiacceleratorinstitute.com/why-and-when-do-you-need-a-purpose-built-vector-database/
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Why_you_need_a_real_vector_database2_20230830_075505_1_4b32582c87.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>本文最初發表於<a href="https://www.aiacceleratorinstitute.com/why-and-when-do-you-need-a-purpose-built-vector-database/">AIAI</a>，經授權後在此轉載。</em></p>
<p><a href="https://zilliz.com/learn/ChatGPT-Vector-Database-Prompt-as-code">ChatGPT</a>和其他大型語言模型 (LLM) 的日益普及，推動了向量搜尋技術的興起，包括<a href="https://milvus.io/docs/overview.md">Milvus</a>和<a href="https://zilliz.com/cloud">Zilliz Cloud</a> 等專門打造的向量資料庫、<a href="https://zilliz.com/blog/set-up-with-facebook-ai-similarity-search-faiss">FAISS</a> 等向量搜尋程式庫，以及與傳統資料庫整合的向量搜尋外掛。然而，選擇符合您需求的最佳解決方案可能極具挑戰性。就像在高級餐廳和快餐連鎖店之間做選擇一樣，選擇正確的向量搜尋技術取決於您的需求和期望。</p>
<p>在這篇文章中，我將概述向量搜尋及其功能，比較不同的向量搜尋技術，並解釋為何選擇專用向量資料庫是至關重要的。</p>
<h2 id="What-is-vector-search-and-how-does-it-work" class="common-anchor-header">什麼是向量搜尋，它是如何運作的？<button data-href="#What-is-vector-search-and-how-does-it-work" class="anchor-icon" translate="no">
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
    </button></h2><p>向量<a href="https://zilliz.com/blog/vector-similarity-search">搜尋也</a>稱為向量相似性搜尋，是一種在大量密集向量資料中，擷取與指定查詢向量最相似或語意相關的前 k 個結果的技術。</p>
<p>在進行相似性搜尋之前，我們先利用神經網路<a href="https://zilliz.com/blog/introduction-to-unstructured-data">將非結構化資料</a>，例如文字、影像、視訊和音訊，轉換成高維數值向量，稱為嵌入向量。例如，我們可以使用預先訓練好的 ResNet-50 捲卷神經網路，將鳥類影像轉換成 2,048 維的嵌入向量集合。在此，我們列出前三個和後三個向量元素：<code translate="no">[0.1392, 0.3572, 0.1988, ..., 0.2888, 0.6611, 0.2909]</code> 。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/bird_image_4a1be18f99.png" alt="A bird image by Patrice Bouchard" class="doc-image" id="a-bird-image-by-patrice-bouchard" />
   </span> <span class="img-wrapper"> <span>Patrice Bouchard 的鳥類圖像</span> </span></p>
<p>產生嵌入向量之後，向量搜尋引擎會比較輸入查詢向量與向量倉庫中的向量之間的空間距離。它們在空間上越接近，就表示越相似。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Frame_3732_20230510_073643_25f985523e.png" alt="Embedding arithmetic" class="doc-image" id="embedding-arithmetic" />
   </span> <span class="img-wrapper"> <span>嵌入演算法</span> </span></p>
<h2 id="Popular-vector-search-technologies" class="common-anchor-header">熱門向量搜尋技術<button data-href="#Popular-vector-search-technologies" class="anchor-icon" translate="no">
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
    </button></h2><p>市場上有多種向量搜尋技術，包括 Python 的 NumPy 等機器學習程式庫、FAISS 等向量搜尋程式庫、建置在傳統資料庫上的向量搜尋外掛，以及 Milvus 和 Zilliz Cloud 等專門向量資料庫。</p>
<h3 id="Machine-learning-libraries" class="common-anchor-header">機器學習程式庫</h3><p>使用機器學習函式庫是實作向量搜尋最簡單的方法。舉例來說，我們可以使用 Python 的 NumPy 以不到 20 行的程式碼來實作近鄰演算法。</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> numpy <span class="hljs-keyword">as</span> np

<span class="hljs-comment"># Function to calculate euclidean distance</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">euclidean_distance</span>(<span class="hljs-params">a, b</span>):
<span class="hljs-keyword">return</span> np.linalg.norm(a - b)

<span class="hljs-comment"># Function to perform knn</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">knn</span>(<span class="hljs-params">data, target, k</span>):
<span class="hljs-comment"># Calculate distances between target and all points in the data</span>
distances = [euclidean_distance(d, target) <span class="hljs-keyword">for</span> d <span class="hljs-keyword">in</span> data]
<span class="hljs-comment"># Combine distances with data indices</span>
distances = np.array(<span class="hljs-built_in">list</span>(<span class="hljs-built_in">zip</span>(distances, np.arange(<span class="hljs-built_in">len</span>(data)))))

<span class="hljs-comment"># Sort by distance</span>
sorted_distances = distances[distances[:, <span class="hljs-number">0</span>].argsort()]

<span class="hljs-comment"># Get the top k closest indices</span>
closest_k_indices = sorted_distances[:k, <span class="hljs-number">1</span>].astype(<span class="hljs-built_in">int</span>)

<span class="hljs-comment"># Return the top k closest vectors</span>
<span class="hljs-keyword">return</span> data[closest_k_indices]
<button class="copy-code-btn"></button></code></pre>
<p>我們可以產生 100 個二維向量，並找出向量 [0.5, 0.5] 的最近鄰。</p>
<pre><code translate="no"><span class="hljs-comment"># Define some 2D vectors</span>
data = np.random.rand(<span class="hljs-number">100</span>, <span class="hljs-number">2</span>)

<span class="hljs-comment"># Define a target vector</span>
target = np.array([<span class="hljs-number">0.5</span>, <span class="hljs-number">0.5</span>])

<span class="hljs-comment"># Define k</span>
k = <span class="hljs-number">3</span>

<span class="hljs-comment"># Perform knn</span>
closest_vectors = knn(data, target, k)

<span class="hljs-comment"># Print the result</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;The closest vectors are:&quot;</span>)
<span class="hljs-built_in">print</span>(closest_vectors)
<button class="copy-code-btn"></button></code></pre>
<p>機器學習函式庫，例如 Python 的 NumPy，以低成本提供了極大的靈活性。然而，它們也有一些限制。例如，它們只能處理少量的資料，而且無法確保資料的持久性。</p>
<p>我只建議在下列情況下使用 NumPy 或其他機器學習函式庫來進行向量搜尋：</p>
<ul>
<li>您需要快速建立原型。</li>
<li>您不在乎資料的持久性。</li>
<li>您的資料大小在一百萬以下，而且不需要標量篩選。</li>
<li>不需要高效能。</li>
</ul>
<h3 id="Vector-search-libraries" class="common-anchor-header">向量搜尋程式庫</h3><p>向量搜尋程式庫可以協助您快速建立高效能的向量搜尋系統原型。FAISS 就是一個典型的例子。它是由 Meta 開發的開放原始碼軟體，用於高效率的相似性搜尋和密集向量聚類。FAISS 可以處理任何大小的向量集合，甚至是無法完全載入記憶體的向量集合。此外，FAISS 還提供評估和參數調整的工具。儘管 FAISS 是以 C++ 寫成，但仍提供 Python/NumPy 介面。</p>
<p>以下是基於 FAISS 的向量搜尋範例程式碼：</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> numpy <span class="hljs-keyword">as</span> np
<span class="hljs-keyword">import</span> faiss

<span class="hljs-comment"># Generate some example data</span>
dimension = <span class="hljs-number">64</span> <span class="hljs-comment"># dimension of the vector space</span>
database_size = <span class="hljs-number">10000</span> <span class="hljs-comment"># size of the database</span>
query_size = <span class="hljs-number">100</span> <span class="hljs-comment"># number of queries to perform</span>
np.random.seed(<span class="hljs-number">123</span>) <span class="hljs-comment"># make the random numbers predictable</span>

<span class="hljs-comment"># Generating vectors to index in the database (db_vectors)</span>
db_vectors = np.random.random((database_size, dimension)).astype(<span class="hljs-string">&#x27;float32&#x27;</span>)

<span class="hljs-comment"># Generating vectors for query (query_vectors)</span>
query_vectors = np.random.random((query_size, dimension)).astype(<span class="hljs-string">&#x27;float32&#x27;</span>)

<span class="hljs-comment"># Building the index</span>
index = faiss.IndexFlatL2(dimension) <span class="hljs-comment"># using the L2 distance metric</span>
<span class="hljs-built_in">print</span>(index.is_trained) <span class="hljs-comment"># should return True</span>

<span class="hljs-comment"># Adding vectors to the index</span>
index.add(db_vectors)
<span class="hljs-built_in">print</span>(index.ntotal) <span class="hljs-comment"># should return database_size (10000)</span>

<span class="hljs-comment"># Perform a search</span>
k = <span class="hljs-number">4</span> <span class="hljs-comment"># we want to see 4 nearest neighbors</span>
distances, indices = index.search(query_vectors, k)

<span class="hljs-comment"># Print the results</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Indices of nearest neighbors: \n&quot;</span>, indices)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\nL2 distances to the nearest neighbors: \n&quot;</span>, distances)
<button class="copy-code-btn"></button></code></pre>
<p>FAISS 之類的向量搜尋程式庫使用簡單，速度也快，足以處理擁有數百萬向量的小型生產環境。您可以利用量化和 GPU 以及減少資料維度來增強它們的查詢效能。</p>
<p>然而，這些函式庫在用於生產時有一些限制。例如，FAISS 不支援即時資料新增與刪除、遠端呼叫、多種語言、標量篩選、可擴充性或災難復原。</p>
<h3 id="Different-types-of-vector-databases" class="common-anchor-header">不同類型的向量資料庫</h3><p>向量資料庫的出現解決了上述資料庫的限制，為生產應用程式提供了更全面、更實用的解決方案。</p>
<p>戰場上有四種類型的向量資料庫：</p>
<ul>
<li>結合向量搜尋外掛的現有關係型或列型資料庫。PG Vector 就是一個例子。</li>
<li>支援密集向量索引的傳統倒置索引搜尋引擎。<a href="https://zilliz.com/comparison/elastic-vs-milvus">ElasticSearch</a>就是一個例子。</li>
<li>建立在向量搜尋程式庫上的輕量級向量資料庫。Chroma 就是一個例子。</li>
<li><strong>專用向量資料庫</strong>。這類型的資料庫是專門為向量搜尋而設計，並由下往上進行最佳化。專用向量資料庫通常提供更先進的功能，包括分散式運算、災難復原和資料持久性。<a href="https://zilliz.com/what-is-milvus">Milvus</a>就是一個主要的例子。</li>
</ul>
<p>並非所有向量資料庫都是一樣的。每個堆疊都有其獨特的優點和限制，使它們或多或少適合不同的應用程式。</p>
<p>相較於其他解決方案，我更偏好專門的向量資料庫，因為它們是最有效率、最方便的選擇，並提供許多獨特的優點。在以下的章節中，我會以 Milvus 為例，說明我偏好的原因。</p>
<h2 id="Key-benefits-of-purpose-built-vector-databases" class="common-anchor-header">專用向量資料庫的主要優點<button data-href="#Key-benefits-of-purpose-built-vector-databases" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://milvus.io/">Milvus</a>是一個開放原始碼、分散式的專用向量資料庫，可以儲存、索引、管理和擷取數十億個嵌入向量。它也是最流行的<a href="https://zilliz.com/use-cases/llm-retrieval-augmented-generation">LLM 檢索擴增生成</a>向量資料庫之一。身為特定用途向量資料庫的典範，Milvus 與其同業分享許多獨特的優勢。</p>
<h3 id="Data-Persistence-and-Cost-Effective-Storage" class="common-anchor-header">資料持久性與低成本儲存</h3><p>雖然防止資料遺失是資料庫的最低要求，但許多單機和輕量級向量資料庫並不重視資料的可靠性。相比之下，<a href="https://zilliz.com/what-is-milvus">Milvus</a>等專門設計的分散式向量資料庫則透過分離儲存與計算，優先考量系統的彈性、可擴充性與資料持久性。</p>
<p>此外，大多數使用近似近鄰 (ANN) 索引的向量資料庫都需要大量記憶體才能執行向量搜尋，因為它們會將 ANN 索引純粹載入記憶體。然而，Milvus 支援磁碟索引，使得儲存的成本效益比記憶體索引高出十倍以上。</p>
<h3 id="Optimal-Query-Performance" class="common-anchor-header">最佳查詢效能</h3><p>與其他向量搜尋選項相比，專門的向量資料庫能提供最佳的查詢效能。例如，Milvus 處理查詢的速度比向量搜尋外掛快十倍。Milvus 使用<a href="https://zilliz.com/glossary/anns">ANN 演算法</a>，而非 KNN 原始搜尋演算法，以加快向量搜尋速度。此外，它將索引分片，隨著資料量的增加而減少建構索引所需的時間。此方法可讓 Milvus 輕鬆處理數以十億計的向量，並能即時增加和刪除資料。相較之下，其他向量搜尋附加元件只適用於資料少於數千萬筆，且新增與刪除不頻繁的情境。</p>
<p>Milvus 也支援 GPU 加速。內部測試顯示，GPU 加速的向量索引在搜尋數千萬筆資料時，可達到 10,000+ QPS 的速度，比傳統 CPU 索引的單機查詢效能至少快十倍。</p>
<h3 id="System-Reliability" class="common-anchor-header">系統可靠性</h3><p>許多應用程式使用向量資料庫進行線上查詢，需要低查詢延遲和高吞吐量。這些應用程式要求單機故障移轉達到分鐘級別，有些甚至需要跨區域災難復原來處理關鍵情境。傳統基於 Raft/Paxos 的複製策略會造成嚴重的資源浪費，而且需要協助預先分片資料，導致可靠性不佳。相比之下，Milvus 採用分散式架構，利用 K8s 訊息佇列實現高可用性，減少復原時間並節省資源。</p>
<h3 id="Operability-and-Observability" class="common-anchor-header">可操作性與可觀察性</h3><p>為了更好地服務企業用戶，向量資料庫必須提供一系列企業級功能，以獲得更好的可操作性和可觀察性。Milvus 支援多種部署方式，包括 K8s Operator 和 Helm 圖表、docker-compose 和 pip install，讓不同需求的使用者都能使用。Milvus 也提供基於 Grafana、Prometheus 與 Loki 的監控與警報系統，提升其可觀察性。Milvus 採用分散式雲端原生架構，是業界第一個支援多租客隔離、RBAC、配額限制和滾動升級的向量資料庫。所有這些方法都讓 Milvus 的管理與監控變得更簡單。</p>
<h2 id="Getting-started-with-Milvus-in-3-simple-steps-within-10-minutes" class="common-anchor-header">在 10 分鐘內以 3 個簡單步驟開始使用 Milvus<button data-href="#Getting-started-with-Milvus-in-3-simple-steps-within-10-minutes" class="anchor-icon" translate="no">
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
    </button></h2><p>建立向量資料庫是一項複雜的任務，但使用向量資料庫就像使用 Numpy 和 FAISS 一樣簡單。即使是不熟悉 AI 的學生，也能在短短 10 分鐘內，根據 Milvus 實作向量搜尋。要體驗高度可擴充和高效能的向量搜尋服務，請遵循以下三個步驟：</p>
<ul>
<li>在<a href="https://milvus.io/docs/install_standalone-docker.md">Milvus 部署文件</a>的幫助下，在您的伺服器上部署 Milvus。</li>
<li>參考<a href="https://milvus.io/docs/example_code.md">Hello Milvus 文件</a>，只需 50 行代碼就能實作向量搜尋。</li>
<li>探索<a href="https://github.com/towhee-io/examples/">Towhee 的範例文件</a>，深入瞭解<a href="https://zilliz.com/use-cases">向量資料庫的</a>熱門<a href="https://zilliz.com/use-cases">使用案例</a>。</li>
</ul>
