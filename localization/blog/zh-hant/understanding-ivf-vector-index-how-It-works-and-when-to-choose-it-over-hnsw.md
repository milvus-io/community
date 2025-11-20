---
id: understanding-ivf-vector-index-how-It-works-and-when-to-choose-it-over-hnsw.md
title: 瞭解 IVF 向量索引：它如何運作以及何時選擇它而非 HNSW
author: Jack Li
date: 2025-10-27T00:00:00.000Z
cover: assets.zilliz.com/ivf_1bbe0e9f85.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'IVF, ANN, HNSW, vector index, vector database'
meta_title: How to Choose Between IVF and HNSW for ANN Vector Search
desc: 瞭解 IVF 向量索引如何運作、如何加速 ANN 搜尋，以及何時在速度、記憶體和篩選效率方面優於 HNSW。
origin: >-
  https://milvus.io/blog/understanding-ivf-vector-index-how-It-works-and-when-to-choose-it-over-hnsw.md
---
<p>在向量資料庫中，我們經常需要在龐大的高維向量集合中快速找出最相似的結果，例如影像特徵、文字嵌入或音訊表示。如果沒有索引，唯一的選擇就是將查詢向量與資料集中的每個向量進行比較。當您只有幾千個向量時，這種<strong>粗暴的搜尋</strong>方式也許會奏效，但當您要處理數以千萬或億計的向量時，<strong>搜尋</strong>速度就會變得非常緩慢，計算成本也會變得非常昂貴。</p>
<p>這就是<strong>近似近鄰 (ANN)</strong>搜尋的用武之地。將它想像成在龐大的圖書館中尋找特定的書籍。您不需要逐本檢查，而是從最有可能包含該書的部分開始瀏覽。您可能無法得到與完整搜尋<em>完全相同</em>的結果，但您可以得到非常接近的結果，而且只需要極少的時間。簡而言之，ANN 以準確性上的些微損失，換取速度與擴充性上的顯著提升。</p>
<p>在許多實作 ANN 搜尋的方法中，<strong>IVF (Inverted File)</strong>和<strong>HNSW (Hierarchical Navigable Small World)</strong>是使用最廣泛的兩種。但 IVF 以其在大規模向量搜尋中的效率和適應性而脫穎而出。在這篇文章中，我們會帶您了解 IVF 的運作方式，以及它與 HNSW 的比較，讓您瞭解它們之間的權衡，並選擇最適合您工作負荷的一種。</p>
<h2 id="What-is-an-IVF-Vector-Index" class="common-anchor-header">什麼是 IVF 向量索引？<button data-href="#What-is-an-IVF-Vector-Index" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>IVF (Inverted File)</strong>是 ANN 使用最廣泛的演算法之一。它的核心理念借用自文字檢索系統中使用的「倒置索引」，只是這次我們處理的不是文字和文件，而是高維空間中的向量。</p>
<p>想想看，這就像是整理一個龐大的圖書館。如果您把所有的書（向量）都倒進一個巨大的堆疊中，要找到您需要的東西將需要很長的時間。IVF 首先將所有向量<strong>聚類</strong>為群組或<em>桶</em>，以解決這個問題。每個桶代表一個類似向量的「類別」，由一個<strong>中心點定義 - 這是</strong>該叢集內所有東西的一種摘要或「標籤」。</p>
<p>當查詢來到時，搜尋會分兩個步驟進行：</p>
<p><strong>1.尋找最近的叢集。</strong>系統會尋找其中心點最接近查詢向量的幾個叢集 - 就像直接前往圖書館中最有可能有您所需書籍的兩到三個區域。</p>
<p><strong>2.在這些叢集內搜尋。</strong>一旦您進入正確的區域，您只需要檢視一小部分的書籍，而不是整個圖書館。</p>
<p>這種方法可以將計算量減少幾個數量級。您仍可獲得高度精確的結果，但速度卻快得多。</p>
<h2 id="How-to-Build-an-IVF-Vector-Index" class="common-anchor-header">如何建立 IVF 向量索引<button data-href="#How-to-Build-an-IVF-Vector-Index" class="anchor-icon" translate="no">
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
    </button></h2><p>建立 IVF 向量索引的過程包含三個主要步驟：K-means 聚類（K-means Clustering）、向量分配（Vector Assignment）和壓縮編碼（可選）。完整流程如下：</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ivf_building_process_90c2966975.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-1-K-means-Clustering" class="common-anchor-header">步驟 1：K-means 聚類</h3><p>首先，在資料集 X 上執行 K-means 聚類，將高維向量空間分成 nlist 叢集。每個簇由一個中心點代表，該中心點儲存在中心點表 C 中。中心點的數量 nlist 是一個關鍵超參數，它決定了聚類的精細程度。</p>
<p>以下是 k-means 的工作原理：</p>
<ul>
<li><p><strong>初始化：</strong>隨機選擇<em>nlist</em>向量作為初始中心點。</p></li>
<li><p><strong>分派：</strong>對於每個向量，計算它到所有中心點的距離，然後將它指派到最近的一個中心點。</p></li>
<li><p><strong>更新：</strong>對於每個群集，計算其向量的平均值，並設定為新的中心點。</p></li>
<li><p><strong>迭代與收斂：</strong>重複指派和更新，直到中心點不再大幅改變或達到最大迭代次數為止。</p></li>
</ul>
<p>一旦 k-means 收斂，產生的 nlist 中心點就會形成 IVF 的「索引目錄」。它們定義了資料集的粗略分割方式，允許稍後的查詢快速縮小搜尋空間。</p>
<p>回想一下圖書館的比喻：訓練中心點就像是決定如何依主題將書籍分類：</p>
<ul>
<li><p>較大的 nlist 代表較多的區塊，每個區塊都有較少、較特定的書籍。</p></li>
<li><p>較小的 nlist 代表較少的區塊，每個區塊涵蓋更廣泛、更混雜的主題。</p></li>
</ul>
<h3 id="Step-2-Vector-Assignment" class="common-anchor-header">步驟 2：向量分配</h3><p>接下來，每個向量會被分派到其中心點最接近的叢集，形成倒列表 (List_i)。每個倒列表會儲存屬於該群集的所有向量的 ID 和儲存資訊。</p>
<p>您可以將這個步驟想像成將書籍分類上架。當您稍後要找一個書名時，您只需要檢查最有可能有這個書名的幾個區塊，而不需要逛遍整個圖書館。</p>
<h3 id="Step-3-Compression-Encoding-Optional" class="common-anchor-header">步驟 3：壓縮編碼 (選用)</h3><p>為了節省記憶體和加快計算速度，每個叢集內的向量都可以經過壓縮編碼。有兩種常見的方法：</p>
<ul>
<li><p><strong>SQ8（標量量化）：</strong>此方法將向量的每個維度量化為 8 位元。對於標準的<code translate="no">float32</code> 向量，每個維度通常佔用 4 位元組。有了 SQ8，每個維度只需 1 個位元組，達到 4:1 的壓縮比，同時保持向量的幾何圖形基本不變。</p></li>
<li><p><strong>PQ (乘積量化)：</strong>它將一個高維向量分割成幾個子空間。例如，128 維向量可以分成 8 個子向量，每個子向量 16 維。在每個子空間中，預先訓練一個小編碼本（通常有 256 個項目），每個子向量由一個指向其最近編碼本項目的 8 位元索引來表示。這表示原始的 128-D<code translate="no">float32</code> 向量 (需要 512 位元組) 只需使用 8 位元組 (8 個子空間 × 每個子空間 1 位元組) 即可表示，達到 64:1 的壓縮比。</p></li>
</ul>
<h2 id="How-to-Use-the-IVF-Vector-Index-for-Search" class="common-anchor-header">如何使用 IVF 向量索引進行搜尋<button data-href="#How-to-Use-the-IVF-Vector-Index-for-Search" class="anchor-icon" translate="no">
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
    </button></h2><p>一旦建立了中心點表、倒轉列表以及壓縮編碼器和編碼本（可選），就可以使用 IVF 索引來加速相似性搜尋。這個過程通常有三個主要步驟，如下所示：</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ivf_search_process_025d3f444f.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-1-Calculate-distances-from-the-query-vector-to-all-centroids" class="common-anchor-header">步驟 1：計算從查詢向量到所有中心點的距離</h3><p>當查詢向量 q 到達時，系統會先判斷它最有可能屬於哪些叢集。然後計算 q 與中心點表 C 中每個中心點之間的距離 - 通常使用歐氏距離或內乘積作為相似度指標。然後，中心點依其與查詢向量的距離排序，產生一個從最近到最遠的有序清單。</p>
<p>例如，如圖所示，順序為C4 &lt; C2 &lt; C1 &lt; C3 &lt; C5。</p>
<h3 id="Step-2-Select-the-nearest-nprobe-clusters" class="common-anchor-header">步驟 2：選擇最近的 nprobe 叢集</h3><p>為了避免掃描整個資料集，IVF 只會在最接近查詢向量的<em>nprobe</em>叢集內進行搜尋。</p>
<p>參數 nprobe 定義了搜尋範圍，並直接影響速度與召回率之間的平衡：</p>
<ul>
<li><p>nprobe 越小，查詢速度越快，但可能會降低召回率。</p></li>
<li><p>較大的 nprobe 會提高召回率，但會增加延遲。</p></li>
</ul>
<p>在真實世界的系統中，nprobe 可以根據延遲預算或精確度需求來動態調整。 在上面的範例中，如果 nprobe = 2，系統只會在叢集 2 和叢集 4（兩個最近的叢集）內搜尋。</p>
<h3 id="Step-3-Search-the-nearest-neighbor-in-the-selected-clusters" class="common-anchor-header">步驟 3：在選定的叢集中搜尋最近的鄰居</h3><p>一旦選定候選叢集，系統就會比較查詢向量 q 與叢集內儲存的向量。 比較主要有兩種模式：</p>
<ul>
<li><p><strong>精確比較 (IVF_FLAT)：</strong>系統從選取的叢集中擷取原始向量，並直接計算它們與 q 的距離，傳回最精確的結果。</p></li>
<li><p><strong>近似比較 (IVF_PQ / IVF_SQ8)：</strong>當使用 PQ 或 SQ8 壓縮時，系統會採用<strong>查詢表法來</strong>加速距離計算。在搜尋開始之前，系統會預先計算查詢向量與每個編碼簿項目之間的距離。然後，對於每個向量，它可以簡單地將這些預先計算的距離「查閱並求和」，以估計相似性。</p></li>
</ul>
<p>最後，來自所有搜尋叢集的候選結果會合併並重新排序，產生 Top-k 最相似向量作為最終輸出。</p>
<h2 id="IVF-In-Practice" class="common-anchor-header">IVF 實際應用<button data-href="#IVF-In-Practice" class="anchor-icon" translate="no">
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
    </button></h2><p>瞭解 IVF 向量索引的<strong>建立</strong>與<strong>搜尋</strong>方式後，下一步就是將它應用於實際工作負載。在實務中，您通常需要在<strong>效能</strong>、<strong>準確性</strong>和<strong>記憶體使用量</strong>之間取得平衡。以下是從工程經驗中汲取的一些實用指引。</p>
<h3 id="How-to-Choose-the-Right-nlist" class="common-anchor-header">如何選擇正確的 nlist</h3><p>如前所述，參數 nlist 決定了建立 IVF 索引時將資料集分為多少個群集。</p>
<ul>
<li><p><strong>較大的 nlist</strong>：建立更細緻的叢集，也就是說每個叢集包含較少的向量。這可減少搜尋時掃描的向量數量，通常可加快查詢速度。但建立索引需要較長時間，而且中心點表會消耗較多記憶體。</p></li>
<li><p><strong>較小的 nlist</strong>：加快索引建立速度並減少記憶體使用量，但每個群集會變得更 「擁擠」。每次查詢都必須掃描群集內更多的向量，這可能會導致效能瓶頸。</p></li>
</ul>
<p>根據這些權衡，這裡有一個實用的經驗法則：</p>
<p>對於<strong>百萬規模</strong>的資料集，一個好的起點是<strong>nlist ≈ √n</strong>（n 是索引資料分片中向量的數量）。</p>
<p>例如，如果您有 100 萬個向量，請嘗試 nlist = 1,000。對於數以千萬或億計的大型資料集，大多數向量資料庫會將資料分片，使每個分片包含約 100 萬個向量，以維持此規則的實用性。</p>
<p>由於 nlist 在索引建立時是固定的，稍後變更它就意味著要重建整個索引。因此最好及早進行實驗。測試幾個值 - 最好是 2 的幂數 (例如 1024、2048)，以找到平衡速度、準確性和記憶體的最佳位置，以滿足您的工作負載。</p>
<h3 id="How-to-Tune-nprobe" class="common-anchor-header">如何調整 nprobe</h3><p>參數 nprobe 控制在查詢期間搜尋的叢集數量。它直接影響召回率與延遲之間的權衡。</p>
<ul>
<li><p><strong>nprobe 越大</strong>：覆蓋更多群集，導致更高的召回率，但也會有更高的延遲。延遲通常會隨著搜尋的叢集數呈線性增加。</p></li>
<li><p><strong>較小的 nprobe</strong>：搜尋較少的叢集，因此延遲較低，查詢速度較快。不過，它可能會遺漏一些真正的近鄰，稍微降低召回率和結果精確度。</p></li>
</ul>
<p>如果您的應用程式對延遲不是非常敏感，最好動態測試 nprobe，例如測試 1 到 16 的值，觀察召回率和延遲的變化。我們的目標是找到可接受的召回率，而延遲仍維持在目標範圍內的最佳位置。</p>
<p>由於 nprobe 是一個執行時搜尋參數，因此可以在不需要重建索引的情況下即時調整。這可在不同的工作負載或查詢情境中實現快速、低成本且高度靈活的調整。</p>
<h3 id="Common-Variants-of-the-IVF-Index" class="common-anchor-header">IVF 索引的常見變體</h3><p>在建立 IVF 索引時，您需要決定是否對每個群集中的向量使用壓縮編碼，如果是，則決定使用哪種方法。</p>
<p>這會產生三種常見的 IVF 索引變體：</p>
<table>
<thead>
<tr><th><strong>IVF 變異</strong></th><th><strong>主要功能</strong></th><th><strong>使用案例</strong></th></tr>
</thead>
<tbody>
<tr><td><strong>IVF_FLAT</strong></td><td>在每個群集中儲存原始向量，不做壓縮。提供最高的精確度，但也消耗最多的記憶體。</td><td>適合需要高回復率 (95%+) 的中等規模資料集（高達數億向量）。</td></tr>
<tr><td><strong>IVF_PQ</strong></td><td>應用乘積量化 (PQ) 來壓縮叢集內的向量。透過調整壓縮比率，可大幅降低記憶體使用量。</td><td>適用於大規模向量搜尋 (數以億計或更多)，在這種情況下，一些精確度的損失是可以接受的。在 64:1 的壓縮比率下，召回率通常約為 70%，但降低壓縮比率可達到 90% 或更高。</td></tr>
<tr><td><strong>IVF_SQ8</strong></td><td>使用標量量化 (SQ8) 來量化向量。記憶體使用量介於 IVF_FLAT 與 IVF_PQ 之間。</td><td>非常適合需要維持相對高回復率 (90%+) 並同時提高效率的大規模向量搜尋。</td></tr>
</tbody>
</table>
<h2 id="IVF-vs-HNSW-Pick-What-Fits" class="common-anchor-header">IVF vs HNSW：選擇合適的方法<button data-href="#IVF-vs-HNSW-Pick-What-Fits" class="anchor-icon" translate="no">
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
    </button></h2><p>除了 IVF 之外，<strong>HNSW (Hierarchical Navigable Small World)</strong>是另一種廣泛使用的記憶體向量索引。下表強調了兩者的主要差異。</p>
<table>
<thead>
<tr><th></th><th><strong>IVF</strong></th><th><strong>HNSW</strong></th></tr>
</thead>
<tbody>
<tr><td><strong>演算法 概念</strong></td><td>聚類與分桶</td><td>多層圖表導航</td></tr>
<tr><td><strong>記憶體使用量</strong></td><td>相對低</td><td>相對較高</td></tr>
<tr><td><strong>索引建立速度</strong></td><td>快速 (僅需要聚類)</td><td>慢 (需要多層圖形建構)</td></tr>
<tr><td><strong>查詢速度 (無過濾)</strong></td><td>快速，取決於<em>nprobe</em></td><td>極快，但複雜度為對數</td></tr>
<tr><td><strong>查詢速度 (有過濾)</strong></td><td>穩定 - 在中心點層級執行粗略篩選，以縮窄候選範圍</td><td>不穩定 - 尤其是當過濾比率很高 (90%+) 時，圖形會變得支離破碎，可能會退化到接近全圖遍歷，甚至比暴力搜尋更慢</td></tr>
<tr><td><strong>召回率</strong></td><td>取決於是否使用壓縮；若沒有量化，召回率可達<strong>95% 以上</strong></td><td>通常更高，約<strong>98%+</strong></td></tr>
<tr><td><strong>關鍵參數</strong></td><td><em>nlist</em>,<em>nprobe</em></td><td><em>m</em>,<em>ef_construction</em>,<em>ef_search</em></td></tr>
<tr><td><strong>使用個案</strong></td><td>當記憶體有限，但需要高查詢效能和召回率時；非常適合有過濾條件的搜尋</td><td>當記憶體充足，目標是極高的召回率和查詢效能，但不需要篩選，或篩選比率很低時</td></tr>
</tbody>
</table>
<p>在實際應用中，包含篩選條件是很常見的--例如，「僅搜尋來自特定使用者的向量」或「將結果限制在特定時間範圍內」。由於兩者底層演算法的差異，IVF 一般比 HNSW 更有效率地處理篩選搜尋。</p>
<p>IVF 的優勢在於其兩層篩選過程。它可以先在中心點 (叢集) 層級執行粗粒度篩選，以快速縮小候選集的範圍，然後在選定的叢集中進行細粒度距離計算。這樣即使篩選出大部分資料，也能維持穩定且可預測的效能。</p>
<p>相較之下，HNSW 是以圖形遍歷 (graph traversal) 為基礎。由於其結構關係，它無法在遍歷過程中直接利用篩選條件。當過濾比率較低時，這不會造成重大問題。但是，當過濾比率很高時 (例如，超過 90% 的資料被過濾掉)，剩餘的圖形通常會變得支離破碎，形成許多 「孤立節點」。在這種情況下，搜尋可能會退化為近乎全圖的遍歷 - 有時甚至比暴力搜尋還差。</p>
<p>實際上，IVF 索引已經在不同領域中為許多影響深遠的使用案例提供了動力：</p>
<ul>
<li><p><strong>電子商務搜尋：</strong>使用者可以上傳產品圖片，並立即從數百萬個列表中找到視覺上相似的商品。</p></li>
<li><p><strong>專利檢索：</strong>只要給出簡短的描述，系統就能從龐大的資料庫中找出語意上最相關的專利，效率遠高於傳統的關鍵字搜尋。</p></li>
<li><p><strong>RAG 知識庫：</strong>IVF 有助於從數百萬個租戶文件中檢索出最相關的上下文，確保 AI 模型產生更精確、更接地氣的回應。</p></li>
</ul>
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
    </button></h2><p>要選擇正確的索引，一切都要視乎您的特定使用個案而定。如果您正在處理大型資料集或需要支援篩選搜尋，IVF 可能會比較適合。與 HNSW 等以圖表為基礎的索引相比，IVF 的索引建立速度更快、記憶體使用量更低，而且在速度與精確度之間取得了很好的平衡。</p>
<p>最受歡迎的開放原始碼向量資料庫<a href="https://milvus.io/">Milvus</a> 提供對整個 IVF 系列的完整支援，包括 IVF_FLAT、IVF_PQ 和 IVF_SQ8。您可以輕鬆嘗試使用這些索引類型，找到最適合您的效能與記憶體需求的設定。如需 Milvus 支援索引的完整清單，請參閱此<a href="https://milvus.io/docs/index-explained.md">Milvus 索引說明文件頁面</a>。</p>
<p>如果您正在建立圖片搜尋、推薦系統或 RAG 知識庫，請嘗試一下 Milvus 中的 IVF 索引 - 看看高效率、大規模向量搜尋在運作上的感受。</p>
