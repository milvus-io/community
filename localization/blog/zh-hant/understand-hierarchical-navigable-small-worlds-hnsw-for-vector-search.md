---
id: understand-hierarchical-navigable-small-worlds-hnsw-for-vector-search.md
title: 瞭解向量搜尋的 Hierarchical Navigable Small Worlds (HNSW)
author: Stefan Webb
date: 2025-05-21T00:00:00.000Z
desc: HNSW (Hierarchical Navigable Small World) 是一種使用分層圖結構進行近似近鄰搜尋的有效演算法。
cover: assets.zilliz.com/Chat_GPT_Image_May_26_2025_11_56_17_AM_1a84d31090.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search'
meta_keywords: 'Milvus, HNSW, Hierarchical Navigable Small Worlds, RAG, vector search'
meta_title: |
  Understand HNSW for Vector Search
origin: >-
  https://milvus.io/blog/understand-hierarchical-navigable-small-worlds-hnsw-for-vector-search.md
---
<p><a href="https://milvus.io/blog/what-is-a-vector-database.md">向量資料庫</a>的關鍵作業是<em>相似性搜尋</em>，這包括在資料庫中找出與查詢向量最近的鄰居，例如以歐氏距離（Euclidean distance）來搜尋。最簡單的方法是計算查詢向量與資料庫中儲存的每個向量之間的距離，然後取最接近的前 K 個向量。然而，這顯然無法隨著資料庫大小的增加而擴展。實際上，只有少於 100 萬個向量的資料庫才會採用簡單的相似性搜尋。我們要如何將搜尋的規模擴大到 1,000 萬或 1 億向量，甚至數十億向量呢？</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_Descending_a_hierarchy_of_vector_search_indices_cf9fb8060a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>圖：向量搜尋索引的層級遞降</em></p>
<p>我們已經開發了許多演算法和資料結構，可以將高維向量空間中的相似性搜尋擴大到次線性時間複雜度。在這篇文章中，我們將解釋並實作一種流行且有效的方法，稱為 Hierarchical Navigable Small Worlds (HNSW)，它經常是中型向量資料集的預設選擇。它屬於在向量上建構圖表的搜尋方法系列，其中頂點表示向量，邊表示向量之間的相似性。搜尋是透過瀏覽圖表來執行，在最簡單的情況下，貪婪地遍歷與查詢最接近的目前節點的鄰居，並重複直到達到局部最小值為止。</p>
<p>我們將詳細解釋如何建構搜尋圖表，以及圖表如何啟用搜尋，最後，我們將連結到 HNSW 的實作，由您親自以簡單的 Python 來實作。</p>
<h2 id="Navigable-Small-Worlds" class="common-anchor-header">可導航的小世界<button data-href="#Navigable-Small-Worlds" class="anchor-icon" translate="no">
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
    </button></h2><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_NSW_graph_created_from_100_randomly_located_2_D_points_3ffccbd6a7.jpg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>圖：由 100 個隨機定位的 2D 點所建立的 NSW 圖形。</em></p>
<p>如前所述，HNSW 會在我們執行查詢之前，離線建構搜尋圖形。這個演算法建立在先前工作的基礎上，這種方法稱為「可導航的小世界」（Navigable Small Worlds，簡稱 NSW）。我們會先解釋 NSW，接下來就可以淺顯地介紹<em>Hierarchical</em>NSW。上圖是在 2 維向量上為 NSW 建構的搜尋圖。在以下的所有範例中，我們都以 2 維向量為限，以便將它們形象化。</p>
<h2 id="Constructing-the-Graph" class="common-anchor-header">建構圖形<button data-href="#Constructing-the-Graph" class="anchor-icon" translate="no">
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
    </button></h2><p>NSW 是一個圖形，其中的頂點代表向量，而邊是根據向量之間的相似性啟發式地建構出來的，因此大多數的向量都可以從任何地方透過少量的跳躍達到。這就是所謂的「小世界」特性，它允許快速導航。請看上圖。</p>
<p>圖形初始化為空。我們會遍歷向量，依序將每個向量加入圖表。對於每個向量，從隨機的入口節點開始，我們貪婪地<em>在目前建構的圖表中</em>找到從入口點到達的最近 R 節點。然後將這些 R 節點連接到代表插入向量的新節點，並選擇性地修剪任何鄰近節點，因為這些節點現在有超過 R 個鄰近節點。對所有向量重複這個程序，就會得到 NSW 圖形。請參閱上面可視化演算法的插圖，並參閱文章末尾的資源，以瞭解對如此建構的圖表特性的理論分析。</p>
<h2 id="Searching-the-Graph" class="common-anchor-header">搜尋圖<button data-href="#Searching-the-Graph" class="anchor-icon" translate="no">
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
    </button></h2><p>我們已經從圖表建構中的使用看到搜尋演算法。不過，在這種情況下，查詢節點是由使用者提供，而不是插入圖表的節點。我們從隨機的入口筆記開始，貪婪地導航到與查詢最接近的鄰居，並維護目前遇到的最接近向量的動態集。請參閱上面的說明。請注意，我們可以透過從多個隨機入口點開始搜尋並彙總結果，以及在每一步考慮多個鄰居，來提高搜尋準確度。然而，這些改進的代價是延遲時間的增加。</p>
<custom-h1>增加層級結構</custom-h1><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/adding_hierarchy_0101234812.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>到目前為止，我們已經描述了 NSW 演算法和資料結構，可以幫助我們擴大在高維空間的搜尋。儘管如此，這個方法仍有嚴重的缺點，包括在低維空間失敗、搜尋收斂緩慢，以及容易陷入局部最小值。</p>
<p>HNSW 的作者對 NSW 做了三項修改，修正了這些缺點：</p>
<ul>
<li><p>在建构和搜索过程中明确选择入口节点；</p></li>
<li><p>以不同尺度分離邊緣；以及</p></li>
<li><p>使用先進的啟發式來選擇鄰居。</p></li>
</ul>
<p>前兩項是以一個簡單的想法來實現：建立<em>搜尋圖的層次結構</em>。HNSW 不採用 NSW 中的單一圖形，而是建構圖形的層次結構。每個圖形或圖層都會以與 NSW 相同的方式進行個別搜尋。首先搜尋的頂層包含極少的節點，而更深的層次會逐漸包含越來越多的節點，最底層則包含所有節點。這表示頂層在向量空間中包含較長的跳躍，允許一種從軌道到精細的搜尋。請參閱上面的說明。</p>
<h2 id="Constructing-the-Graph" class="common-anchor-header">建構圖<button data-href="#Constructing-the-Graph" class="anchor-icon" translate="no">
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
    </button></h2><p>建構演算法的運作如下：我們事先固定一個層數<em>L</em>。l=1 的值對應於最粗的層，也就是搜尋開始的地方，而 l=L 則對應於最密集的層，也就是搜尋結束的地方。我們會遍歷每個要插入的向量，並依據截斷的<a href="https://en.wikipedia.org/wiki/Geometric_distribution">幾何分佈</a>(拒絕<em>l &gt; L</em>或設定<em>l' =</em>min_(l，L)_) 抽樣插入層。假設我們對目前的向量採樣<em>1 &lt; l &lt; L</em>。我們在頂層 L 執行貪婪搜尋，直到達到其局部最小值。接著，我們沿著 _L_th 層的局部最小值到 _(L-1)_th 層對應向量的邊緣，並以它作為入口點，貪婪地搜尋 _(L-1)_th 層。</p>
<p>這個過程重複進行，直到我們到達第 _l_ 層。然後，我們開始為要插入的向量建立節點，將其連接到目前所建立的 _l_th 層中透過貪婪搜尋找到的最接近的鄰居，再導航到 _(l-1)_th 層，如此重複，直到我們將向量插入 _1_st 層。上面的動畫說明了這一點</p>
<p>我們可以看到，這個分層圖的建構方法巧妙地為每個向量明確選擇插入節點。我們會搜尋目前所建構的插入層之上的各層，從航線到細小距離進行有效率的搜尋。與此相關的是，此方法在每一層中以不同的尺度分隔連結：最上層提供跨越搜尋空間的長尺度跳躍，而到最下層的尺度則逐層遞減。這兩項修改都有助於避免陷入次優極限，並在增加記憶體的代價下加速搜尋收斂。</p>
<h2 id="Searching-the-Graph" class="common-anchor-header">搜尋圖<button data-href="#Searching-the-Graph" class="anchor-icon" translate="no">
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
    </button></h2><p>搜尋程序的運作方式與內部圖形建構步驟很相似。從頂層開始，我們貪婪地導航到最接近查詢的一個或多個節點。然後，我們跟隨該節點到下一層，並重複這個過程。我們的答案是由最底層的<em>R 個</em>最接近鄰居的清單所得到的，如上圖的動畫所示。</p>
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
    </button></h2><p>像 Milvus 之類的向量資料庫提供高度最佳化和調整的 HNSW 實作，而且它通常是適用於記憶體的資料集的最佳預設搜尋索引。</p>
<p>我們對 HNSW 的運作方式和原因做了高層次的概述，比起理論和數學，我們更偏好可視化和直覺。因此，我們省略了對建構與搜尋演算法的精確描述<a href="https://arxiv.org/abs/1603.09320">[Malkov and Yashushin, 2016</a>; Alg 1-3]、搜尋與建構複雜度分析<a href="https://arxiv.org/abs/1603.09320">[</a><a href="https://arxiv.org/abs/1603.09320">Malkov</a><a href="https://arxiv.org/abs/1603.09320">and</a><a href="https://arxiv.org/abs/1603.09320">Yashushin</a><a href="https://arxiv.org/abs/1603.09320">, 2016</a>; §4.2]，以及較不重要的細節，例如在建構過程中更有效選擇鄰居節點的啟發式<a href="https://arxiv.org/abs/1603.09320">[Malkov and Yashushin, 2016</a>; Alg 5]。此外，我們省略了對演算法超參數、其意義以及它們如何影響延遲/速度/記憶體權衡的討論<a href="https://arxiv.org/abs/1603.09320">[Malkov and Yashushin, 2016</a>; §4.1]。了解這一點對於在實踐中使用 HNSW 非常重要。</p>
<p>以下資源包含這些主題的進一步閱讀，以及 NSW 和 HNSW 的完整 Python 教學實作 (由我自己撰寫)，包括產生本文動畫的程式碼。</p>
<custom-h1>資源</custom-h1><ul>
<li><p>GitHub："<a href="https://github.com/stefanwebb/hnsw-illustrated">HNSW-Illustrated：Hierarchical Navigable Small Worlds (HNSW)（一種向量搜尋演算法）的小型實作，用於學習目的</a>"</p></li>
<li><p><a href="https://milvus.io/docs/hnsw.md#HNSW">HNSW | Milvus 文件</a></p></li>
<li><p><a href="https://zilliz.com/learn/hierarchical-navigable-small-worlds-HNSW">瞭解 Hierarchical Navigable Small Worlds (HNSW) - Zilliz Learn</a></p></li>
<li><p>HNSW 論文：<a href="https://arxiv.org/abs/1603.09320">"使用 Hierarchical Navigable Small World 圖表進行高效且穩健的近似近鄰搜尋</a></p></li>
<li><p>NSW 論文：<a href="https://publications.hse.ru/pubs/share/folder/x5p6h7thif/128296059.pdf">「基於可導航小型世界圖的近似近鄰演算法</a>」</p></li>
</ul>
