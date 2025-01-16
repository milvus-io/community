---
id: getting-started-with-hnswlib.md
title: 開始使用 HNSWlib
author: Haziqa Sajid
date: 2024-11-25T00:00:00.000Z
desc: HNSWlib 是實作 HNSW 的函式庫，具有高效率和可擴充的特性，即使在數百萬點的情況下也能表現良好。了解如何在幾分鐘內實現它。
metaTitle: Getting Started with HNSWlib
cover: assets.zilliz.com/Getting_Started_with_HNS_Wlib_30922def3e.png
tag: Engineering
tags: >-
  HNSWlib, HNSW Hierarchical Navigable Small Worlds, Vector Search, Approximate
  Nearest Neighbor (ANN) search, ANNS
recommend: true
canonicalUrl: 'https://milvus.io/blog/getting-started-with-hnswlib.md'
---
<p><a href="https://zilliz.com/glossary/semantic-search">語意搜尋可</a>讓機器理解語言，並產生更好的搜尋結果，這在人工智能和資料分析中是不可或缺的。一旦將語言表示為<a href="https://zilliz.com/learn/everything-you-should-know-about-vector-embeddings">嵌入式</a>，就可以使用精確或近似的方法進行搜尋。近似最近鄰<a href="https://zilliz.com/glossary/anns">(ANN</a>) 搜尋是一種用來快速找出資料集中最接近給定查詢點的方法，這與<a href="https://zilliz.com/blog/k-nearest-neighbor-algorithm-for-machine-learning">精確最近鄰搜尋</a>不同，<a href="https://zilliz.com/blog/k-nearest-neighbor-algorithm-for-machine-learning">精確最近鄰搜尋對</a>於高維資料的計算成本可能很高。近鄰搜索 (ANN) 可提供近似接近最近鄰的結果，從而加快檢索速度。</p>
<p>近似最近鄰 (ANN) 搜尋的演算法之一是<a href="https://zilliz.com/learn/hierarchical-navigable-small-worlds-HNSW">HNSW</a>(Hierarchical Navigable Small Worlds)，在<a href="https://zilliz.com/learn/learn-hnswlib-graph-based-library-for-fast-anns">HNSWlib</a> 下實作，這將是今天討論的重點。在這篇部落格中，我們將會</p>
<ul>
<li><p>瞭解 HNSW 演算法。</p></li>
<li><p>探索 HNSWlib 及其主要功能。</p></li>
<li><p>設定 HNSWlib，涵蓋索引建立與搜尋執行。</p></li>
<li><p>與 Milvus 作比較。</p></li>
</ul>
<h2 id="Understanding-HNSW" class="common-anchor-header">瞭解 HNSW<button data-href="#Understanding-HNSW" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Hierarchical Navigable Small Worlds（</strong><a href="https://zilliz.com/learn/hierarchical-navigable-small-worlds-HNSW"><strong>HNSW</strong></a><strong>）</strong>是一種基於圖的資料結構，可透過建立「小世界」網路的多層圖，進行有效率的相似性搜尋，尤其是在高維空間。HNSW 於<a href="https://arxiv.org/abs/1603.09320">2016 年</a>推出，可解決與傳統搜尋方法（如暴力搜尋和樹狀搜尋）相關的可擴展性問題。它非常適合涉及大型資料集的應用，例如推薦系統、圖像識別和<a href="https://zilliz.com/vector-database-use-cases/llm-retrieval-augmented-generation">檢索增量生成 (RAG)</a>。</p>
<h3 id="Why-HNSW-Matters" class="common-anchor-header">HNSW 的重要性</h3><p>HNSW 可顯著增強高維空間中近鄰搜尋的效能。結合了層次結構與小世界導航能力，避免了舊式方法的計算效率低的問題，使其在處理大量複雜的資料集時也能有良好的表現。為了更了解這一點，我們現在就來看看它是如何運作的。</p>
<h3 id="How-HNSW-Works" class="common-anchor-header">HNSW 如何運作</h3><ol>
<li><p><strong>分層：</strong>HNSW 將資料組織為層次分明的圖層，每層包含由邊連接的節點。頂層較為稀疏，允許在圖表上廣泛「跳過」，就像放大地圖，只看到城市之間的主要高速公路一樣。較低的圖層密度會增加，提供更細緻的細節以及更多近鄰之間的連結。</p></li>
<li><p><strong>可導航的小世界概念：</strong>HNSW 中的每一層都建立在「小世界」網路的概念上，其中節點（資料點）之間只有幾個「跳」的距離。搜尋演算法會從最高、最稀疏的層開始，然後向下移動，逐漸移到密度較高的層，以精細搜尋。這種方法就像是從全局觀往下移動到鄰近層的細節，逐漸縮小搜尋範圍。</p></li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Fig_1_An_Example_of_a_Navigable_Small_World_Graph_afa737ee9f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><a href="https://daniel-at-world.blogspot.com/2019/04/navigable-small-world-graphs-for.html">圖 1</a>：可導航的小世界圖表範例</p>
<ol start="3">
<li><strong>類似跳列表的結構：</strong>HNSW 的層級結構類似於跳躍清單 (skip list)，這是一種概率資料結構，其中較高層級的節點較少，可加快初始搜尋速度。</li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Fig_2_An_Example_of_Skip_List_Structure_f41b07234d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><a href="https://www.cs.cmu.edu/~ckingsf/bioinfo-lectures/skiplists.pdf">圖 2</a>：Skip List 結構範例</p>
<p>要在給定的跳躍清單中搜尋 96，我們從最左邊的頂層開始，從頭節點開始。向右移動時，我們遇到 31，小於 96，因此我們繼續到下一個節點。現在，我們需要向下移動一層，再次看到 31；由於它仍然小於 96，所以我們再向下移動一層。再一次找到 31，然後我們向右移動，到達 96，也就是我們的目標值。因此，我們無需下到跳過清單的最低層就可以找到 96。</p>
<ol start="4">
<li><p><strong>搜尋效率：</strong>HNSW 演算法從最高層的入口節點開始，每一步都會邁向較近的鄰居。它會逐層下降，利用每個層級進行粗粒度到細粒度的探索，直到達到可能找到最相似節點的最低層。這種分層導航減少了需要探索的節點和邊緣的數量，使得搜尋快速而精確。</p></li>
<li><p><strong>插入和維護</strong>：新增節點時，演算法會根據概率決定其進入層，並使用鄰居選擇啟發式將其連接到鄰近的節點。啟發式的目的是優化連線性，建立可改善導航性的連結，同時平衡圖形密度。這種方法可以保持結構的穩健性，並適應新的資料點。</p></li>
</ol>
<p>儘管我們對 HNSW 演算法有了基本的了解，但從頭開始實作可能會讓我們手足無措。幸運的是，社群已經開發了像<a href="https://github.com/nmslib/hnswlib">HNSWlib</a>這樣的函式庫來簡化使用方式，讓您無須撓頭也能使用。因此，讓我們仔細看看 HNSWlib。</p>
<h2 id="Overview-of-HNSWlib" class="common-anchor-header">HNSWlib 概觀<button data-href="#Overview-of-HNSWlib" class="anchor-icon" translate="no">
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
    </button></h2><p>HNSWlib 是實作 HNSW 的流行函式庫，具有高效率和可擴充的特性，即使在數百萬點的情況下也能表現良好。它允許圖層間的快速跳躍，並針對密集的高維資料進行最佳化搜尋，因而達到次線性的時間複雜度。以下是 HNSWlib 的主要功能：</p>
<ul>
<li><p><strong>圖形結構：</strong>多層圖表代表資料點，允許快速的近鄰搜尋。</p></li>
<li><p><strong>高維效率：</strong>針對高維資料進行最佳化，提供快速且精確的近似搜尋。</p></li>
<li><p><strong>次線性搜尋時間：</strong>透過跳層達到次線性複雜性，大幅提升速度。</p></li>
<li><p><strong>動態更新：</strong>支援即時插入和刪除節點，無需重建完整圖形。</p></li>
<li><p><strong>記憶體效率：</strong>記憶體使用效率高，適用於大型資料集。</p></li>
<li><p><strong>可擴充性：</strong>可順利擴充至數百萬個資料點，非常適合推薦系統等中等規模的應用程式。</p></li>
</ul>
<p><strong>注意：</strong>HNSWlib 非常適合建立向量搜尋應用程式的簡單原型。然而，由於擴充性的限制，可能會有更好的選擇，例如針對涉及數億甚至數十億資料點、更複雜的情境使用<a href="https://zilliz.com/blog/what-is-a-real-vector-database">專門建立的向量資料庫</a>。讓我們來看看實作。</p>
<h2 id="Getting-Started-with-HNSWlib-A-Step-by-Step-Guide" class="common-anchor-header">開始使用 HNSWlib：逐步指南<button data-href="#Getting-Started-with-HNSWlib-A-Step-by-Step-Guide" class="anchor-icon" translate="no">
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
    </button></h2><p>本節將透過建立 HNSW 索引、插入資料和執行搜尋，示範如何使用 HNSWlib 作為<a href="https://zilliz.com/learn/comparing-vector-database-vector-search-library-and-vector-search-plugin">向量</a>搜尋資料<a href="https://zilliz.com/learn/comparing-vector-database-vector-search-library-and-vector-search-plugin">庫</a>。讓我們從安裝開始：</p>
<h3 id="Setup-and-Imports" class="common-anchor-header">安裝與匯入</h3><p>要開始使用 Python 中的 HNSWlib，首先使用 pip 安裝：</p>
<pre><code translate="no">pip install hnswlib
<button class="copy-code-btn"></button></code></pre>
<p>然後，匯入必要的函式庫：</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> hnswlib 
<span class="hljs-keyword">import</span> numpy <span class="hljs-keyword">as</span> np
<button class="copy-code-btn"></button></code></pre>
<h3 id="Preparing-Data" class="common-anchor-header">準備資料</h3><p>在這個範例中，我們會使用<code translate="no">NumPy</code>來產生一個隨機資料集，其中有 10,000 個元素，每個元素的維度大小為 256。</p>
<pre><code translate="no">dim = <span class="hljs-number">256</span>  <span class="hljs-comment"># Dimensionality of your vectors</span>
num_elements = <span class="hljs-number">10000</span>  <span class="hljs-comment"># Number of elements to insert</span>
<button class="copy-code-btn"></button></code></pre>
<p>讓我們建立資料：</p>
<pre><code translate="no">data = np.random.rand(num_elements, dim).astype(np.float32)  <span class="hljs-comment"># Example data</span>
<button class="copy-code-btn"></button></code></pre>
<p>現在資料已準備就緒，讓我們建立索引。</p>
<h3 id="Building-an-Index" class="common-anchor-header">建立索引</h3><p>在建立索引時，我們需要定義向量的維度和空間類型。讓我們建立索引：</p>
<pre><code translate="no">p = hnswlib.<span class="hljs-title class_">Index</span>(space=<span class="hljs-string">&#x27;l2&#x27;</span>, dim=dim)
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><code translate="no">space='l2'</code>:此參數定義類似性所使用的距離指標。將它設定為<code translate="no">'l2'</code> 表示使用歐氏距離 (L2 norm)。如果將它設定為<code translate="no">'ip'</code> ，則會使用內乘積，這對余弦相似性等任務很有幫助。</li>
</ul>
<ul>
<li><code translate="no">dim=dim</code>:此參數指定您要處理的資料點的維度。它必須與您計畫加入索引的資料維度相符。</li>
</ul>
<p>以下是如何初始化索引：</p>
<pre><code translate="no">p.init_index(max_elements=num_elements, ef_construction=200, M=16)
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><code translate="no">max_elements=num_elements</code>:<code translate="no">Num_elements</code> 是最大容量，所以我們設定為 10,000，因為我們要處理 10,000 個資料點。</li>
</ul>
<ul>
<li><code translate="no">ef_construction=200</code>:此參數可控制索引建立時準確性與建立速度的取捨。較高的值可提高召回率 (精確度)，但會增加記憶體使用量和建立時間。常見值範圍從 100 到 200。</li>
</ul>
<ul>
<li><code translate="no">M=16</code>:此參數決定為每個資料點建立的雙向連結數，影響精確度和搜尋速度。典型值介於 12 到 48 之間；16 通常是精確度和速度的良好平衡。</li>
</ul>
<pre><code translate="no">p.set_ef(<span class="hljs-number">50</span>)  <span class="hljs-comment"># This parameter controls the speed/accuracy trade-off</span>
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><code translate="no">ef</code>:<code translate="no">ef</code> 參數是「探索因數」的縮寫，決定搜尋時要檢查多少個鄰居。<code translate="no">ef</code> 值越高，搜尋的鄰居數就越多，這通常會增加搜尋的精確度 (回復率)，但也會使搜尋速度變慢。相反，較低的<code translate="no">ef</code> 值可以加快搜尋速度，但可能會降低精確度。</li>
</ul>
<p>在這種情況下，將<code translate="no">ef</code> 設為 50 表示搜尋演算法在尋找最相似的資料點時，最多會評估 50 個鄰居。</p>
<p>注意：<code translate="no">ef_construction</code> 會在建立索引時設定鄰居搜尋工作，以提高精確度，但會減慢建立速度。<code translate="no">ef</code> 會在查詢時控制搜尋工作，動態平衡每個查詢的速度和召回率。</p>
<h3 id="Performing-Searches" class="common-anchor-header">執行搜尋</h3><p>要使用 HNSWlib 執行近鄰搜尋，我們首先要建立隨機查詢向量。在這個範例中，向量的維度與索引資料相符。</p>
<pre><code translate="no">query_vector = np.random.rand(dim).astype(np.float32)  <span class="hljs-comment"># Example query</span>

labels, distances = p.knn_query(query_vector, k=<span class="hljs-number">5</span>)  <span class="hljs-comment"># k is the number of nearest neighbors</span>
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><code translate="no">query_vector</code>:這一行會產生一個與索引資料相同維度的隨機向量，以確保最近鄰搜尋的相容性。</li>
<li><code translate="no">knn_query</code>:該方法會在索引<code translate="no">p</code> 中搜尋<code translate="no">k</code> <code translate="no">query_vector</code> 的最近鄰。它會返回兩個陣列：<code translate="no">labels</code>, 包含最近鄰居的索引，以及<code translate="no">distances</code>, 表示查詢向量到每個鄰居的距離。在這裡，<code translate="no">k=5</code> 指定我們要找出五個最近的鄰居。</li>
</ul>
<p>以下是列印標籤和距離之後的結果：</p>
<pre><code translate="no"><span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Nearest neighbors&#x27; labels:&quot;</span>, labels)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Distances:&quot;</span>, distances)
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">&gt; Nearest neighbors&#x27; labels: [[4498 1751 5647 4483 2471]]
&gt; Distances: [[33.718    35.484592 35.627766 35.828312 35.91495 ]]
<button class="copy-code-btn"></button></code></pre>
<p>這就是使用 HNSWlib 的簡單指南。</p>
<p>如前所述，HNSWlib 是一個很棒的向量搜尋引擎，可用來建立原型或實驗中等大小的資料集。如果您有更高的擴充性需求或需要其他企業級的功能，您可能需要選擇專門打造的向量資料庫，例如開放原始碼的<a href="https://zilliz.com/what-is-milvus">Milvus</a>或其在<a href="https://zilliz.com/cloud">Zilliz Cloud</a> 上的完整管理服務。因此，在下一節中，我們將比較 HNSWlib 與 Milvus。</p>
<h2 id="HNSWlib-vs-Purpose-Built-Vector-Databases-Like-Milvus" class="common-anchor-header">HNSWlib 與 Milvus 等特定用途向量資料庫的比較<button data-href="#HNSWlib-vs-Purpose-Built-Vector-Databases-Like-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://zilliz.com/learn/what-is-vector-database">向量資料庫以</a>數學表示的方式儲存資料，讓<a href="https://zilliz.com/ai-models">機器學習模型</a>能夠透過<a href="https://zilliz.com/blog/similarity-metrics-for-vector-search">相似度指標</a>來識別資料，以瞭解上下文，從而為搜尋、推薦和文字生成提供動力。</p>
<p>向量索引函式庫 (例如 HNSWlib) 可改善<a href="https://zilliz.com/learn/vector-similarity-search">向量搜尋與</a>檢索，但缺乏完整資料庫的管理功能。另一方面，向量資料庫 (如<a href="https://milvus.io/">Milvus</a>) 是專為處理向量嵌入而設計的規模化資料庫，在資料管理、索引和查詢功能方面具有獨立資料庫通常缺乏的優勢。以下是使用 Milvus 的其他優點：</p>
<ul>
<li><p><strong>高速向量相似性搜尋</strong>：Milvus 在十億級向量資料集上提供毫秒級的搜尋效能，非常適合影像擷取、推薦系統、自然語言處理<a href="https://zilliz.com/learn/A-Beginner-Guide-to-Natural-Language-Processing">(NLP</a>) 和擷取擴增生成<a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">(RAG</a>) 等應用。</p></li>
<li><p><strong>可擴充性及高可用性：</strong>Milvus 專為處理大量資料而打造，可水平擴充，並包含複製與故障移轉機制，以提供可靠性。</p></li>
<li><p><strong>分散式架構：</strong>Milvus 使用分散式、可擴充的架構，將儲存與運算分開在多個節點上，以提供彈性與穩健性。</p></li>
<li><p><a href="https://zilliz.com/blog/a-review-of-hybrid-search-in-milvus"><strong>混合式搜尋</strong></a><strong>：</strong>Milvus 支援多模式搜尋、混合<a href="https://zilliz.com/learn/sparse-and-dense-embeddings">稀疏與密集搜尋</a>，以及混合密集與<a href="https://thenewstack.io/elasticsearch-was-great-but-vector-databases-are-the-future/">全文搜尋</a>，提供多樣且彈性的搜尋功能。</p></li>
<li><p><strong>靈活的資料支援</strong>：Milvus 支援多種資料類型 - 向量、標量和結構化資料 - 允許在單一系統中進行無縫管理和分析。</p></li>
<li><p><a href="https://discord.com/invite/8uyFbECzPX"><strong>活躍的社群</strong></a> <strong>與支援</strong>：一個蓬勃發展的社群提供定期更新、教學與支援，確保 Milvus 緊貼使用者需求與領域進展。</p></li>
<li><p><a href="https://milvus.io/docs/integrations_overview.md">AI 整合</a>：Milvus 已整合各種流行的 AI 框架與技術，讓開發人員更容易使用他們熟悉的技術堆疊建立應用程式。</p></li>
</ul>
<p>Milvus 也在<a href="https://zilliz.com/cloud">Ziliz Cloud</a> 上提供全面的管理服務，無後顧之憂，速度比 Milvus 快 10 倍。</p>
<h3 id="Comparison-Milvus-vs-HNSWlib" class="common-anchor-header">比較：Milvus vs. HNSWlib</h3><table>
<thead>
<tr><th style="text-align:center"><strong>特點</strong></th><th style="text-align:center"><strong>Milvus</strong></th><th style="text-align:center"><strong>HNSWlib</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center">擴充性</td><td style="text-align:center">輕鬆處理數以億計的向量</td><td style="text-align:center">由於使用 RAM，適合較小的資料集</td></tr>
<tr><td style="text-align:center">適用於</td><td style="text-align:center">原型、實驗和企業級應用程式</td><td style="text-align:center">專注於原型與輕量級 ANN 任務</td></tr>
<tr><td style="text-align:center">索引</td><td style="text-align:center">支援 10 種以上的索引演算法，包括 HNSW、DiskANN、Quantization 及 Binary。</td><td style="text-align:center">僅使用基於圖形的 HNSW</td></tr>
<tr><td style="text-align:center">整合性</td><td style="text-align:center">提供 API 與雲端原生服務</td><td style="text-align:center">提供輕量、獨立的函式庫</td></tr>
<tr><td style="text-align:center">效能</td><td style="text-align:center">針對大型資料、分散式查詢進行最佳化</td><td style="text-align:center">提供高速但有限的擴充性</td></tr>
</tbody>
</table>
<p>總體來說，Milvus 適合需要複雜索引的大型生產級應用程式，而 HNSWlib 則適合原型設計和較直接的使用個案。</p>
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
    </button></h2><p>語意搜尋可能是資源密集型的，因此內部資料結構化（例如 HNSW 所執行的結構化）對於更快速的資料擷取是非常重要的。HNSWlib 之類的函式庫關心實作，因此開發人員已準備好食譜，可以進行向量功能的原型開發。只要幾行程式碼，我們就能建立自己的索引並執行搜尋。</p>
<p>HNSWlib 是一個很好的開始方式。不過，如果您想要建立複雜且可投入生產的 AI 應用程式，專門打造的向量資料庫是最佳選擇。舉例來說，<a href="https://milvus.io/">Milvus</a>是一個開放原始碼向量資料庫，具有許多企業就緒的功能，例如高速向量搜尋、可擴充性、可用性，以及在資料類型和程式語言方面的彈性。</p>
<h2 id="Further-Reading" class="common-anchor-header">進一步閱讀<button data-href="#Further-Reading" class="anchor-icon" translate="no">
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
<li><p><a href="https://zilliz.com/learn/faiss">什麼是 Faiss (Facebook AI 類似性搜尋)？ </a></p></li>
<li><p><a href="https://zilliz.com/learn/learn-hnswlib-graph-based-library-for-fast-anns">什麼是 HNSWlib？基於圖形的快速 ANN 搜尋程式庫 </a></p></li>
<li><p><a href="https://zilliz.com/learn/what-is-scann-scalable-nearest-neighbors-google">什麼是 ScaNN (Scalable Nearest Neighbors)？ </a></p></li>
<li><p><a href="https://zilliz.com/vector-database-benchmark-tool?database=ZillizCloud%2CMilvus%2CElasticCloud%2CPgVector%2CPinecone%2CQdrantCloud%2CWeaviateCloud&amp;dataset=medium&amp;filter=none%2Clow%2Chigh&amp;tab=1">VectorDBBench：開放源碼 VectorDB 基準工具</a></p></li>
<li><p><a href="https://zilliz.com/learn/generative-ai">生成式 AI 資源中心 | Zilliz</a></p></li>
<li><p><a href="https://zilliz.com/learn/what-is-vector-database">什麼是向量資料庫，它們如何運作？ </a></p></li>
<li><p><a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">什麼是 RAG？ </a></p></li>
<li><p><a href="https://zilliz.com/ai-models">適用於您的 GenAI 應用程式的最佳效能 AI 模型 | Zilliz</a></p></li>
</ul>
