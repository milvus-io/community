---
id: faster-index-builds-and-scalable-queries-with-gpu-cagra-in-milvus.md
title: 在 Milvus 中優化 NVIDIA CAGRA：GPU-CPU 混合方法可加快索引速度並降低查詢成本
author: Marcelo Chen
date: 2025-12-10T00:00:00.000Z
cover: assets.zilliz.com/CAGRA_cover_7b9675965f.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus2.6, CAGRA, GPU, CPU, graph-based index'
meta_title: |
  Optimizing CAGRA in Milvus: A Hybrid GPU–CPU Approach
desc: 瞭解 Milvus 2.6 中的 GPU_CAGRA 如何使用 GPU 來快速建構圖形，並使用 CPU 來提供可擴充的查詢服務。
origin: >-
  https://milvus.io/blog/faster-index-builds-and-scalable-queries-with-gpu-cagra-in-milvus.md
---
<p>隨著人工智能系統從實驗走向生產基礎架構，向量資料庫不再需要處理數百萬的嵌入。<strong>現在，數十億個嵌入式資料已是家常便飯，數百億個嵌入式資料也越來越常見。</strong>在這種規模下，演算法的選擇不僅會影響效能與召回率，也會直接轉換為基礎架構成本。</p>
<p>這引出了大規模部署的核心問題：<strong>如何選擇正確的索引，以提供可接受的召回率和延遲時間，而不會讓計算資源的使用失控？</strong></p>
<p>基於圖形的索引 (例如<strong>NSW、HNSW、CAGRA 和 Vamana)</strong>已經成為最廣泛採用的答案。透過瀏覽預先建立的鄰居圖，這些索引能夠以十億級的規模進行快速的最近鄰居搜尋，避免對每個向量進行粗暴掃描和與查詢進行比較。</p>
<p>然而，這種方法的成本並不均衡。<strong>查詢圖表相對便宜，但建構圖表就不便宜。</strong>建構高品質的圖形需要進行大規模的距離計算，並在整個資料集上反覆精煉，而傳統的 CPU 資源很難在資料成長時有效率地處理這些工作量。</p>
<p>NVIDIA 的 CAGRA 可利用 GPU 的大量平行性加速圖形建構，從而解決這個瓶頸問題。雖然這可大幅縮短建置時間，但在生產環境中，依賴 GPU 來建置索引與提供查詢服務，會產生較高的成本與擴充性限制。</p>
<p>為了平衡這些取捨，<a href="https://milvus.io/docs/release_notes.md#v261">Milvus 2.6.1</a> <strong>採用了</strong> <a href="https://milvus.io/docs/gpu-cagra.md">GPU_CAGRA</a> <strong>索引</strong> <strong>的混合設計</strong>：<strong>GPU 僅用於圖形建構，而查詢執行則在 CPU 上執行。</strong>這樣既能保留 GPU 建構圖表的品質優勢，又能保持查詢服務的可擴展性和成本效益，因此特別適合資料更新頻率低、查詢量大、成本敏感度高的工作負載。</p>
<h2 id="What-Is-CAGRA-and-How-Does-It-Work" class="common-anchor-header">什麼是 CAGRA 以及它如何運作？<button data-href="#What-Is-CAGRA-and-How-Does-It-Work" class="anchor-icon" translate="no">
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
    </button></h2><p>基於圖的向量索引通常分為兩大類：</p>
<ul>
<li><p><strong>迭代圖形建構</strong>，以<strong>CAGRA</strong>為代表 (Milvus 已支援)。</p></li>
<li><p><strong>插入式圖形建構</strong>，以<strong>Vamana</strong>為代表 (目前 Milvus 正在開發中)。</p></li>
</ul>
<p>這兩種方法在設計目標和技術基礎上有顯著差異，因此各自適用於不同的資料規模和工作負載模式。</p>
<p><strong>NVIDIA CAGRA (CUDA ANN Graph-based)</strong>是一種用於近似近鄰 (ANN) 搜尋的 GPU 原生演算法，專為有效率地建立和查詢大型近鄰圖而設計。透過利用 GPU 的平行性，CAGRA 可大幅加速圖形建構，並提供高吞吐量的查詢效能，比起 HNSW 等以 CPU 為基礎的方法更勝一籌。</p>
<p>CAGRA 建立在<strong>NN-Descent（最近鄰居後裔）</strong>演算法的基礎上，該演算法透過迭代精煉來建構 k 最近鄰居 (kNN) 圖。在每次迭代中，都會評估和更新候選鄰居，在整個資料集中逐漸向更高品質的鄰居關係靠攏。</p>
<p>每輪精煉之後，CAGRA 會應用額外的圖形剪枝技術 (例如<strong>2 跳迂迴剪枝)，以</strong>移除多餘的邊緣，同時保持搜尋品質。這種反覆精煉和剪枝的結合方式，可以產生<strong>緊湊但連接良好的圖形</strong>，在查詢時可以有效率地進行遍歷。</p>
<p>透過重複精煉和剪枝，CAGRA 所產生的圖結構可支援<strong>大規模的高召回率和低延遲最近鄰搜索</strong>，因此特別適合靜態或不常更新的資料集。</p>
<h3 id="Step-1-Building-the-Initial-Graph-with-NN-Descent" class="common-anchor-header">步驟 1：使用 NN-Descent 建立初始圖形</h3><p>NN-Descent 是基於一個簡單但強大的觀察：如果節點<em>u</em>是<em>v</em> 的鄰居，而節點<em>w</em>是<em>u</em> 的鄰居，那麼<em>w</em>很可能也是<em>v</em>的鄰居。這個反式屬性允許演算法有效率地發現真正的最近鄰居，而不需要窮盡比較每一對向量。</p>
<p>CAGRA 使用 NN-Descent 作為其核心圖形建構演算法。過程如下：</p>
<p><strong>1.隨機初始化：</strong>每個節點一開始都會隨機選取一小組鄰居，形成一個粗略的初始圖形。</p>
<p><strong>2.鄰居擴展：</strong>在每次迭代中，節點收集其目前鄰居及其鄰居，形成候選人清單。演算法會計算節點與所有候選人之間的相似度。由於每個節點的候選名單都是獨立的，因此這些計算可以分配給獨立的 GPU 線程區塊，並以大規模的方式並行執行。</p>
<p><strong>3.候選名單更新：</strong>如果演算法找到比節點目前鄰居更近的候選名單，就會換掉較遠的鄰居，並更新節點的 kNN 名單。經過多次迭代後，此過程會產生品質更高的近似 kNN 圖。</p>
<p><strong>4.收斂檢查：</strong>隨著迭代的進行，鄰居更新的次數會越來越少。一旦更新的連線數下降到設定的臨界值以下，演算法就會停止，表示圖形已經有效地穩定下來。</p>
<p>由於不同節點的鄰居擴充和相似性計算是完全獨立的，CAGRA 將每個節點的 NN-Descent 工作量映射到專用的 GPU 線程區塊。此設計可實現大量的平行性，並使圖形建構的速度比基於 CPU 的傳統方法快上幾個數量級。</p>
<h3 id="Step-2-Pruning-the-Graph-with-2-Hop-Detours" class="common-anchor-header">步驟 2：使用 2 跳迂迴路徑修剪圖形</h3><p>在 NN-Descent 完成之後，所得到的圖表雖然精確，但過於密集。NN-Descent 會刻意保留額外的候選鄰居，而隨機初始化階段會引入許多弱邊緣或不相關的邊緣。因此，每個節點的階級通常會是目標階級的兩倍，甚至幾倍。</p>
<p>為了產生緊湊且有效率的圖表，CAGRA 應用了 2 跳迂迴剪枝。</p>
<p>這個想法很簡單：如果節點<em>A</em>可以透過共用鄰居<em>C</em>間接抵達節點<em>B</em>(形成一條路徑 A → C → B)，而且這條間接路徑的距離與<em>A</em>和<em>B</em> 之間的直接距離相若，那麼 A → B 這條直接邊就會被視為多餘，可以移除。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2_hop_detours_d15eae8702.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>此剪枝策略的主要優點是每條邊的冗餘檢查只取決於本地資訊 - 兩個端點及其共用鄰居之間的距離。由於每條邊緣都可以獨立評估，因此剪枝步驟具有高度的平行性，可以很自然地在 GPU 上批次執行。</p>
<p>因此，CAGRA 可以在 GPU 上有效率地剪枝圖形，將儲存開銷降低<strong>40-50%</strong>，同時在查詢執行過程中保持搜尋準確性並提昇遍歷速度。</p>
<h2 id="GPUCAGRA-in-Milvus-What’s-Different" class="common-anchor-header">Milvus 中的 GPU_CAGRA：有何不同？<button data-href="#GPUCAGRA-in-Milvus-What’s-Different" class="anchor-icon" translate="no">
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
    </button></h2><p>儘管 GPU 為圖表建構提供了重大的效能優勢，但生產環境卻面臨實際的挑戰：GPU 資源遠比 CPU 昂貴且有限。如果索引建立和查詢執行都完全依賴 GPU，那麼幾個運作上的問題很快就會浮現：</p>
<ul>
<li><p><strong>資源利用率低：</strong>查詢流量通常是不定期且突發性的，導致 GPU 長時間閒置，浪費昂貴的計算能力。</p></li>
<li><p><strong>部署成本高：</strong>為每個查詢服務實例分配 GPU 會增加硬體成本，即使大多數查詢都無法充分利用 GPU 的效能。</p></li>
<li><p><strong>可擴充性有限：</strong>可用的 GPU 數量直接影響您可以執行的服務複本數量，限制了您隨需求擴充的能力。</p></li>
<li><p><strong>彈性降低：</strong>當索引建立和查詢都依賴 GPU 時，系統就會被 GPU 的可用性束縛，無法輕易將工作負載轉移到 CPU。</p></li>
</ul>
<p>為了解決這些限制，Milvus 2.6.1 透過<code translate="no">adapt_for_cpu</code> 參數為 GPU_CAGRA 索引引進了彈性部署模式。此模式可實現混合工作流程：CAGRA 使用 GPU 建立高品質的圖表索引，而查詢執行則在 CPU 上執行 - 通常使用 HNSW 作為搜尋演算法。</p>
<p>在此設定中，GPU 用於提供最大價值的地方 (快速、高精確度的索引建置)，而 CPU 則以更具成本效益和可擴充的方式處理大型查詢工作負載。</p>
<p>因此，這種混合方法特別適用於下列工作負載：</p>
<ul>
<li><p><strong>資料更新頻率低</strong>，因此索引重建次數少</p></li>
<li><p><strong>查詢量大</strong>，需要許多低成本的複本</p></li>
<li><p><strong>成本敏感度高</strong>，必須嚴格控制 GPU 使用量</p></li>
</ul>
<h3 id="Understanding-adaptforcpu" class="common-anchor-header">瞭解<code translate="no">adapt_for_cpu</code></h3><p>在 Milvus 中，<code translate="no">adapt_for_cpu</code> 參數控制 CAGRA 索引在建立索引時如何序列化到磁碟，以及在載入時如何反序列化到記憶體。透過在建立和載入時變更這個設定，Milvus 可以靈活地在基於 GPU 的索引建立和基於 CPU 的查詢執行之間切換。</p>
<p><code translate="no">adapt_for_cpu</code> 在建立時間和載入時間的不同組合會產生四種執行模式，每種模式都是針對特定的作業情境而設計。</p>
<table>
<thead>
<tr><th style="text-align:center"><strong>建立時間 (<code translate="no">adapt_for_cpu</code>)</strong></th><th style="text-align:center"><strong>載入時間 (<code translate="no">adapt_for_cpu</code>)</strong></th><th style="text-align:center"><strong>執行邏輯</strong></th><th style="text-align:center"><strong>建議方案</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center"><strong>真</strong></td><td style="text-align:center"><strong>真</strong></td><td style="text-align:center">使用 GPU_CAGRA 建立 → 序列化為 HNSW → 反序列化為 HNSW →<strong>CPU 查詢</strong></td><td style="text-align:center">成本敏感型工作負載；大規模查詢服務</td></tr>
<tr><td style="text-align:center"><strong>真</strong></td><td style="text-align:center"><strong>假</strong></td><td style="text-align:center">使用 GPU_CAGRA 建立 → 序列化為 HNSW → 反序列化為 HNSW →<strong>CPU 查詢</strong></td><td style="text-align:center">當發生參數不匹配時，後續查詢回落到 CPU</td></tr>
<tr><td style="text-align:center"><strong>假</strong></td><td style="text-align:center"><strong>真</strong></td><td style="text-align:center">使用 GPU_CAGRA 建立 → 序列化為 CAGRA → 反序列化為 HNSW →<strong>CPU 查詢</strong></td><td style="text-align:center">保留原始 CAGRA 索引進行儲存，同時啟用臨時 CPU 查詢</td></tr>
<tr><td style="text-align:center"><strong>假</strong></td><td style="text-align:center"><strong>假</strong></td><td style="text-align:center">使用 GPU_CAGRA 建立 → 序列化為 CAGRA → 反序列化為 CAGRA →<strong>GPU 查詢</strong></td><td style="text-align:center">成本次要的效能關鍵工作負載</td></tr>
</tbody>
</table>
<p><strong>注意：</strong> <code translate="no">adapt_for_cpu</code> 機制僅支援單向轉換。CAGRA 索引可以轉換為 HNSW，因為 CAGRA 圖形結構保留了 HNSW 所需的所有鄰居關係。但是，HNSW 索引不能轉換回 CAGRA，因為它缺乏基於 GPU 的查詢所需的額外結構資訊。因此，在選擇建立時間設定時應小心謹慎，並考慮長期部署和查詢需求。</p>
<h2 id="Putting-GPUCAGRA-to-the-Test" class="common-anchor-header">測試 GPU_CAGRA<button data-href="#Putting-GPUCAGRA-to-the-Test" class="anchor-icon" translate="no">
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
    </button></h2><p>為了評估混合執行模式 (使用 GPU 建構索引，CPU 執行查詢) 的效能，我們在標準化環境中進行了一系列受控實驗。評估著重於三個層面：<strong>索引建立效能</strong>、<strong>查詢效能</strong>和<strong>回復準確度</strong>。</p>
<p><strong>實驗設定</strong></p>
<p>實驗在廣泛採用的業界標準硬體上進行，以確保結果仍然可靠且廣泛適用。</p>
<ul>
<li><p>CPU：MD EPYC 7R13 處理器 (16 CPU)</p></li>
<li><p>GPU：NVIDIA L4</p></li>
</ul>
<h3 id="1-Index-Build-Performance" class="common-anchor-header">1.索引建立效能</h3><p>我們比較在 GPU 上建立的 CAGRA 與在 CPU 上建立的 HNSW，在相同的目標圖形程度 64 下。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/cp1_a177200ab2.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>主要結果</strong></p>
<ul>
<li><p><strong>GPU CAGRA 建立索引的速度比 CPU HNSW 快 12-15 倍。</strong>在 Cohere1M 和 Gist1M 上，基於 GPU 的 CAGRA 效能明顯優於基於 CPU 的 HNSW，突顯出 GPU 並行性在圖形建構過程中的效率。</p></li>
<li><p><strong>建立時間隨著 NN-Descent 複製次數的增加而呈線性增加。</strong>隨著迭代次數的增加，建構時間也以接近線性的方式成長，反映出 NN-Descent 的迭代精煉性質，並在建構成本與圖表品質之間提供可預測的權衡。</p></li>
</ul>
<h3 id="2-Query-performance" class="common-anchor-header">2.查詢效能</h3><p>在本實驗中，CAGRA 圖形在 GPU 上建立一次，然後透過兩種不同的執行路徑進行查詢：</p>
<ul>
<li><p><strong>CPU 查詢</strong>：索引被反序列化為 HNSW 格式並在 CPU 上進行搜尋</p></li>
<li><p><strong>GPU 查詢</strong>：使用基於 GPU 的遍歷法直接在 CAGRA 圖上執行搜尋</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/cp2_bd00e60553.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>主要發現</strong></p>
<ul>
<li><p><strong>GPU 搜尋吞吐量比 CPU 搜尋高出 5-6 倍。</strong>在 Cohere1M 和 Gist1M 中，基於 GPU 的遍歷提供了大幅提升的 QPS，突顯了 GPU 上平行圖形導航的效率。</p></li>
<li><p><strong>Recall 會隨著 NN-Descent 的迭代次數增加，然後停滯不前。</strong>隨著建立迭代次數的增加，CPU 和 GPU 查詢的召回率都有所改善。然而，超過某一點後，額外的迭代次數所產生的收益會逐漸減少，顯示圖表品質已大致收斂。</p></li>
</ul>
<h3 id="3-Recall-accuracy" class="common-anchor-header">3.召回準確度</h3><p>在本實驗中，CAGRA 和 HNSW 都在 CPU 上進行查詢，以比較相同查詢條件下的召回率。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/cp3_1a46a7bdda.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>主要結果</strong></p>
<p><strong>在這兩個資料集上，CAGRA 的召回率都比 HNSW 高</strong>，顯示即使在 GPU 上建立 CAGRA 索引，然後再反序列化供 CPU 搜尋時，圖表品質仍能維持良好。</p>
<h2 id="What’s-Next-Scaling-Index-Construction-with-Vamana" class="common-anchor-header">下一步：使用 Vamana 擴展索引建置<button data-href="#What’s-Next-Scaling-Index-Construction-with-Vamana" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 的 GPU-CPU 混合方法為當今的大型向量搜尋工作負載提供了實用且具成本效益的解決方案。透過在 GPU 上建立高品質的 CAGRA 圖，並在 CPU 上提供查詢服務，Milvus 將快速索引建置與可擴充<strong>、</strong>經濟實惠的查詢執行結合在一起，特別<strong>適合更新頻率低、查詢量大，以及有嚴格成本限制的工作負載。</strong></p>
<p>在更大的規模（數百<strong>或數千億向量）</strong>下，<strong>索引</strong>建置本身就成為瓶頸。當整個資料集不再適合 GPU 記憶體時，業界通常會轉而採用<strong>插入式圖形建構</strong>方法，例如<strong>Vamana</strong>。Vamana 並非一次性建構圖形，而是分批處理資料，在維持全局連線性的同時，逐步插入新向量。</p>
<p>其建構管道遵循三個關鍵階段：</p>
<p><strong>1.幾何批次成長</strong>- 從小批次開始形成骨架圖，然後增加批次大小以最大化平行性，最後再使用大批次完善細節。</p>
<p><strong>2.貪婪插入</strong>- 每個新節點都從中央入口點導航插入，反覆精煉其鄰居集。</p>
<p><strong>3.反向邊緣更新</strong>- 加入反向連接以保持對稱性並確保有效的圖形導航。</p>
<p>剪枝使用 α-RNG 準則直接整合到建構過程中：如果候選鄰居<em>v</em>已經被現有鄰居<em>p′</em>覆蓋 (即<em>d(p′, v) &lt; α × d(p, v)</em>)，則<em>v</em>會被剪枝。參數 α 可以精確控制稀疏性和精確度。GPU 加速是透過批次內平行和幾何批次縮放來實現，在索引品質和吞吐量之間取得平衡。</p>
<p>這些技術讓團隊能夠處理快速的資料成長和大規模的索引更新，而不會受到 GPU 記憶體的限制。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/One_more_thing_b458360e25.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Milvus 團隊正在積極建置 Vamana 支援，目標是在 2026 年上半年推出。敬請期待。</p>
<p>對最新 Milvus 的任何功能有問題或想要深入瞭解？加入我們的<a href="https://discord.com/invite/8uyFbECzPX"> Discord 頻道</a>或在<a href="https://github.com/milvus-io/milvus"> GitHub</a> 上提出問題。您也可以透過<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus Office Hours</a> 預約 20 分鐘的一對一課程，以獲得深入的了解、指導和問題解答。</p>
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
<li><p><a href="https://milvus.io/blog/we-replaced-kafka-pulsar-with-a-woodpecker-for-milvus.md">我們為 Milvus 用啄木鳥取代了 Kafka/Pulsar</a></p></li>
</ul>
