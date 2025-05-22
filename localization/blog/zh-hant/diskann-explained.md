---
id: diskann-explained.md
title: DiskANN 解釋
author: Stefan Webb
date: 2025-05-20T00:00:00.000Z
desc: 瞭解 DiskANN 如何使用 SSD 提供十億規模的向量搜尋，在低記憶體使用率、高精確度和可擴充效能之間取得平衡。
cover: assets.zilliz.com/Disk_ANN_Explained_35db4b3ef1.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search'
meta_keywords: >-
  Milvus, DiskANN, vector similarity search, indexing, Vamana algorithm, disk
  vector search
meta_title: DiskANN Explained
origin: 'https://milvus.io/blog/diskann-explained.md'
---
<h2 id="What-is-DiskANN" class="common-anchor-header">什麼是 DiskANN？<button data-href="#What-is-DiskANN" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://github.com/microsoft/DiskANN">DiskANN</a>代表了<a href="https://zilliz.com/learn/vector-similarity-search">向量相似性搜尋的</a>範式轉換方法。在此之前，HNSW 等大多數向量索引類型都嚴重依賴 RAM 來實現低延遲和高召回率。雖然這種方法對中等大小的資料集很有效，但隨著資料量的增加，這種方法變得非常昂貴，而且擴充性也較低。DiskANN 利用固態硬碟來儲存索引，大幅降低記憶體需求，提供符合成本效益的替代方案。</p>
<p>DiskANN 採用專為磁碟存取而優化的平面圖結構，因此只需記憶體方法所需記憶體佔用量的一小部分，即可處理十億級規模的資料集。舉例來說，DiskANN 可以索引多達十億個向量，同時以 5 毫秒的延遲達到 95% 的搜尋準確度，而基於 RAM 的演算法則以 1 億至 2 億個點的峰值達到類似效能。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Vector_indexing_and_search_workflow_with_Disk_ANN_41cdf33652.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>圖 1：DiskANN 的向量索引與搜尋工作流程</em></p>
<p>雖然與基於 RAM 的方法相比，DiskANN 可能會帶來稍高的延遲，但由於可大幅節省成本並帶來可擴展性優勢，因此折衷結果通常是可以接受的。DiskANN 特別適合需要在商品硬體上進行大規模向量搜尋的應用程式。</p>
<p>本文將解釋 DiskANN 在 RAM 之外，還利用 SSD 並降低 SSD 讀取成本的巧妙方法。</p>
<h2 id="How-Does-DiskANN-Work" class="common-anchor-header">DiskANN 如何運作？<button data-href="#How-Does-DiskANN-Work" class="anchor-icon" translate="no">
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
    </button></h2><p>DiskANN 是一種基於圖的向量搜尋方法，與 HNSW 屬於同一系列的方法。我們首先建構一個搜尋圖，其中節點對應向量（或向量群組），而邊表示一對向量在某種意義上「相對接近」。典型的搜尋會隨機選擇一個「入口節點」，並導航到最接近查詢的鄰居，以貪婪的方式重複，直到達到局部最小值為止。</p>
<p>基於圖的索引框架主要差別在於它們如何建構搜尋圖和執行搜尋。在本節中，我們將從技術層面深入探討 DiskANN 在這些步驟上的創新，以及它們如何允許低延遲、低記憶體的效能。(請參閱上圖的摘要）。</p>
<h3 id="An-Overview" class="common-anchor-header">概述</h3><p>我們假設使用者已產生一組文件向量嵌入。第一步是對嵌入進行聚類。使用 Vamana 演算法 (在下一節中說明) 分別為每個叢集建構搜尋圖形，然後將結果合併為單一圖形。<em>用分而治之的策略來建立最終的搜尋圖形，可以大幅降低記憶體使用量，但不會對搜尋延遲或召回率造成太大的影響。</em></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/How_Disk_ANN_stores_vector_index_across_RAM_and_SSD_d6564b087f.jpg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>圖 2：DiskANN 如何跨 RAM 和 SSD 儲存向量索引</em></p>
<p>產生全局搜尋圖之後，它會和全精準向量嵌入一起儲存在 SSD 上。由於 SSD 存取相較於 RAM 存取昂貴，要在一定的 SSD 讀取次數內完成搜尋是一大挑戰。因此，我們使用一些巧妙的技巧來限制讀取的次數：</p>
<p>首先，Vamana 演算法鼓勵鄰近節點間的較短路徑，同時限制節點的最大鄰居數。第二，使用固定大小的資料結構來儲存每個節點的 embedding 及其鄰居 (請參閱上圖)。這表示我們只要將資料結構的大小乘以節點的索引，並以此作為偏移量，就可以取得節點的元資料，同時取得節點的 embedding。第三，由於 SSD 的運作方式，我們可以在每次讀取請求中取得多個節點 (在我們的案例中為鄰居節點)，進一步減少讀取請求的次數。</p>
<p>另外，我們使用乘積量化壓縮嵌入式資料，並將其儲存在 RAM 中。如此一來，我們就可以將數以十億計的向量資料集儲存到單一機器上可行的記憶體中，以便在不讀取磁碟的情況下快速計算<em>近似向量相似度</em>。這可為減少 SSD 上下一步要存取的鄰居節點數量提供指引。然而，重要的是，搜尋決定是使用<em>確切的向量相似性</em>來做的，並從 SSD 擷取完整的嵌入，以確保更高的召回率。為了強調這一點，有一個使用記憶體中量化的嵌入式進行搜尋的初始階段，以及隨後從 SSD 擷取較小的子集進行搜尋。</p>
<p>在這段描述中，我們略去了兩個重要但牽涉甚廣的步驟：如何建構圖表，以及如何搜尋圖表 - 這兩個步驟由上面紅色方塊所表示。讓我們依次檢查這兩個步驟。</p>
<h3 id="Vamana-Graph-Construction" class="common-anchor-header">"Vamana 圖形建構</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Vamana_Graph_Construction_ecb4dab839.jpg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>圖："Vamana 圖形建構</em></p>
<p>DiskANN 的作者開發了一種建構搜尋圖的新方法，他們稱之為 Vamana 演算法。它會隨機加入 O(N) 條邊來初始化搜尋圖。這會產生一個「連接良好」的圖形，但無法保證貪婪搜尋的收斂性。然後，它會以智慧的方式修剪和重新連接邊緣，以確保有足夠的長距離連線 (請參閱上圖)。請容許我們詳細說明：</p>
<h4 id="Initialization" class="common-anchor-header">初始化</h4><p>搜索圖初始化為隨機有向圖，其中每個節點都有 R 個外鄰。我們也會計算圖形的 medoid，也就是與所有其他點平均距離最小的點。您可以將其視為類似於節點集合中的一個中心點。</p>
<h4 id="Search-for-Candidates" class="common-anchor-header">搜尋候選點</h4><p>初始化之後，我們會遍歷所有節點，每一步都會同時執行新增和移除邊緣的動作。首先，我們在選取的節點 p 上執行搜尋演算法，產生候選人清單。搜尋演算法從 medoid 開始，貪婪地越來越接近選取的節點，每一步都加入目前找到的最接近節點的外鄰。最接近 p 的 L 個找到的節點清單將會傳回。(如果您不熟悉這個概念，圖表的中間點 (medoid) 是與所有其他點平均距離最小的點，類似於圖表的中心點)。</p>
<h4 id="Pruning-and-Adding-Edges" class="common-anchor-header">剪枝與加邊</h4><p>節點的候選鄰居會依距離排序，對於每個候選鄰居，演算法會檢查其方向是否與已選擇的鄰居「太接近」。如果是，它就會被修剪。這會促進鄰居間的角度多樣性，根據經驗，這會帶來更好的導航特性。實際上，這表示從隨機節點開始的搜尋，可以透過探索稀疏的長距離和局部連結集來更快速地到達任何目標節點。</p>
<p>修剪邊緣之後，沿著通往 p 的貪婪搜尋路徑添加邊緣。會執行兩次剪枝，改變剪枝的距離臨界值，以便在第二次剪枝時加入長距離的邊緣。</p>
<h2 id="What’s-Next" class="common-anchor-header">下一步是什麼？<button data-href="#What’s-Next" class="anchor-icon" translate="no">
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
    </button></h2><p>接下來的工作是在 DiskANN 的基礎上做額外的改進。其中一個值得注意的例子是<a href="https://arxiv.org/abs/2105.09613">FreshDiskANN</a>，它修改了方法，讓索引可以在建立後輕易更新。這種搜尋索引在效能標準之間做了極佳的取捨，在<a href="https://milvus.io/docs/overview.md">Milvus</a>向量資料庫中可使用<code translate="no">DISKANN</code> 索引類型。</p>
<pre><code translate="no" class="language-python"><span class="hljs-comment"># Prepare index parameters</span>
index_params = client.prepare_index_params()

<span class="hljs-comment"># Add DiskANN index</span>
index_params.add_index(
    field_name=<span class="hljs-string">&quot;vector&quot;</span>,
    index_type=<span class="hljs-string">&quot;DISKANN&quot;</span>,
    metric_type=<span class="hljs-string">&quot;COSINE&quot;</span>
)

<span class="hljs-comment"># Create collection with index</span>
client.create_collection(
    collection_name=<span class="hljs-string">&quot;diskann_collection&quot;</span>,
    schema=schema,
    index_params=index_params
)
<button class="copy-code-btn"></button></code></pre>
<p>您甚至可以調整 DiskANN 參數，例如<code translate="no">MaxDegree</code> 和<code translate="no">BeamWidthRatio</code>: 詳細資訊請參閱<a href="https://milvus.io/docs/disk_index.md#On-disk-Index">說明文件頁面</a>。</p>
<h2 id="Resources" class="common-anchor-header">資源<button data-href="#Resources" class="anchor-icon" translate="no">
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
<li><p><a href="https://milvus.io/docs/disk_index.md#On-disk-Index">使用 DiskANN 的 Milvus 文件</a></p></li>
<li><p><a href="https://suhasjs.github.io/files/diskann_neurips19.pdf">「DiskANN：在單一節點上進行快速精確的十億點最近鄰搜索」(DiskANN: Fast Accurate Billion-point Nearest Neighbor Search on a Single Node)</a></p></li>
<li><p><a href="https://arxiv.org/abs/2105.09613">「FreshDiskANN：用於流類似性搜尋的快速精確圖形 ANN 索引」</a></p></li>
</ul>
