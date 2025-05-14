---
id: >-
  bring-vector-compression-to-the-extreme-how-milvus-serves-3×-more-queries-with-rabitq.md
title: 將向量壓縮發揮到極致：Milvus 如何利用 RaBitQ 提供多 3 倍的查詢服務
author: 'Alexandr Guzhva, Li Liu, Jiang Chen'
date: 2025-05-13T00:00:00.000Z
desc: 探索 Milvus 如何利用 RaBitQ 來提升向量搜尋效率，在維持精確度的同時降低記憶體成本。立即瞭解如何優化您的 AI 解決方案！
cover: >-
  assets.zilliz.com/Bring_Vector_Compression_to_the_Extreme_How_Milvus_Serves_3_More_Queries_with_Ra_Bit_Q_12f5b4d932.jpg
tag: Engineering
recommend: true
publishToMedium: true
tags: 'Milvus, vector database, vector search, AI Agents, LLM'
meta_keywords: >-
  Vector Quantization, binary quantization, RaBitQ, vector compression, Milvus
  vector database
meta_title: >
  Bring Vector Compression to the Extreme: How Milvus Serves 3× More Queries
  with RaBitQ
origin: >-
  https://milvus.io/blog/bring-vector-compression-to-the-extreme-how-milvus-serves-3×-more-queries-with-rabitq.md
---
<p><a href="https://milvus.io/docs/overview.md">Milvus</a>是一個開放原始碼、高度可擴充的向量資料庫，能以十億向量的規模進行語意搜尋。當使用者部署如此規模的 RAG 聊天機器人、AI 客戶服務和視覺搜尋時，出現了一個共同的挑戰：<strong>基礎架構成本。</strong>相較之下，指數級的業務成長令人興奮，但雲端費用的暴漲卻令人興奮不起來。快速向量搜尋通常需要將向量儲存在記憶體中，而記憶體的成本很高。自然地，您可能會問：<em>我們能夠壓縮向量以節省空間，而不犧牲搜尋品質嗎？</em></p>
<p>答案是<strong>肯定的</strong>，在這篇部落格中，我們將向您展示如何實作一種名為<a href="https://dl.acm.org/doi/pdf/10.1145/3654970"><strong>RaBitQ</strong></a>的新技術，讓 Milvus 能以更低的記憶體成本提供 3 倍以上的流量，同時維持相當的精確度。我們也會分享將 RaBitQ 整合至開放原始碼 Milvus 以及<a href="https://zilliz.com/cloud">Zilliz Cloud</a> 上全面管理的 Milvus 服務的實際經驗。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Bring_Vector_Compression_to_the_Extreme_How_Milvus_Serves_3_More_Queries_with_Ra_Bit_Q_12f5b4d932.jpg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Understanding-Vector-Search-and-Compression" class="common-anchor-header">瞭解向量搜尋與壓縮<button data-href="#Understanding-Vector-Search-and-Compression" class="anchor-icon" translate="no">
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
    </button></h2><p>在深入了解 RaBitQ 之前，讓我們先了解挑戰。</p>
<p><a href="https://zilliz.com/glossary/anns"><strong>近似近鄰 (ANN)</strong></a>搜尋演算法是向量資料庫的核心，可找出最接近給定查詢的前 k 個向量。向量是高維空間中的一個坐標，通常包含數百個浮點數。隨著向量資料的擴大，儲存和計算需求也會隨之增加。例如，在 FP32 中使用十億個 768 維向量執行<a href="https://zilliz.com/learn/hierarchical-navigable-small-worlds-HNSW">HNSW</a>（一種 ANN 搜尋演算法）需要超過 3 TB 的記憶體！</p>
<p>就像 MP3 透過捨棄人耳無法感知的頻率來壓縮音訊一樣，向量資料也可以在對搜尋準確性影響最小的情況下進行壓縮。研究顯示，對於 ANN 而言，全精度 FP32 通常是不必要的。<a href="https://zilliz.com/learn/scalar-quantization-and-product-quantization"> Scalar Quantization</a>(SQ) 是一種流行的壓縮技術，它將浮點值映射到離散的 bin 中，並僅使用低位元整數儲存 bin 的索引。量化方法能以較少的位元表示相同的資訊，大幅降低記憶體使用量。此領域的研究致力於以最少的精確度損失達到最大的節省。</p>
<p>最極端的壓縮技術-1 位元標量值量化 (Scalar Quantization)，也稱為<a href="https://zilliz.com/learn/scalar-quantization-and-product-quantization">二進位量化 (Binary Quantization</a>)-以單一位元表示每個浮點值。與 FP32 (32 位元編碼) 相比，可減少 32 倍的記憶體使用量。由於記憶體通常是向量搜尋的主要瓶頸，因此這種壓縮可以大幅提升效能。<strong>然而，挑戰在於保留搜尋準確性。</strong>通常，1 位 SQ 會將召回率降低到 70% 以下，使其幾乎無法使用。</p>
<p>這正是<strong>RaBitQ 脫穎</strong>而出之處--它是一種出色的壓縮技術，可在保持高回復率的同時實現 1 位元量化。Milvus 現在從版本 2.6 開始支援 RaBitQ，使向量資料庫能夠提供 3 倍的 QPS，同時維持相若的精確度。</p>
<h2 id="A-Brief-Intro-to-RaBitQ" class="common-anchor-header">RaBitQ 簡介<button data-href="#A-Brief-Intro-to-RaBitQ" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://dl.acm.org/doi/pdf/10.1145/3654970">RaBitQ</a>是一種設計精巧的二進位量化方法，可利用高維空間的幾何特性來達成高效且精確的向量壓縮。</p>
<p>驟眼看來，將向量的每個維度還原為單一位元似乎過於激進，但在高維空間中，我們的直覺往往會失效。正如 RaBitQ 的作者高健陽 (Jianyang Gao)<a href="https://dev.to/gaoj0017/quantization-in-the-counterintuitive-high-dimensional-space-4feg"> 所說</a>，高維向量顯示出個別坐標趨向緊密集中在零附近的特性，這是《<a href="https://en.wikipedia.org/wiki/Concentration_of_measure"> 量測的集中</a>》(<a href="https://en.wikipedia.org/wiki/Concentration_of_measure"> Concentration of Measure</a>) 一書中解釋的反直覺現象的結果。這使得捨棄大部分原始精確度成為可能，同時仍能保留精確近鄰搜尋所需的相對結構。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_The_counterintuitive_value_distribution_in_high_dimensional_geometry_fad6143bfd.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>圖：高維幾何中的反直覺數值分佈。<em>考慮從單位球體中均勻抽樣的隨機單位向量的第一維值；值在 3D 空間中是均勻分布的。然而，對於高維空間 (例如 1000D)，數值會集中在零附近，這是高維幾何的非直覺特性。(圖片來源:<a href="https://dev.to/gaoj0017/quantization-in-the-counterintuitive-high-dimensional-space-4feg">Quantization in The Counterintuitive High-Dimensional Space</a>)</em></p>
<p>受到高維空間這個特性的啟發，<strong>RaBitQ 著重於編碼角度資訊，而非精確的空間坐標</strong>。它透過將相對於參考點（如資料集的中心點）的每個資料向量歸一化來達到此目的。然後，每個向量都會映射到超立方體上最接近的頂點，因此每個維度只需 1 位元就能呈現。此方法可自然延伸至<code translate="no">IVF_RABITQ</code> ，其中的歸一化是相對於最接近的群集中心點進行，以改善局部編碼的精確度。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_Compressing_a_vector_by_finding_its_closest_approximation_on_the_hypercube_so_that_each_dimension_can_be_represented_with_just_1_bit_cd0d50bb30.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>圖：透過在超立方體上尋找最接近的近似值來壓縮向量，因此每個維度只需 1 位元即可表示。(圖片來源:</em> <a href="https://dev.to/gaoj0017/quantization-in-the-counterintuitive-high-dimensional-space-4feg"><em>Quantization in The Counterintuitive High-Dimensional Space</em></a><em>)</em></p>
<p>為了確保搜尋即使在如此壓縮的<strong>表示法</strong>下仍然可靠，RaBitQ 為查詢向量與二進位量化的文件向量之間的距離，引進了一個<strong>有理論依據、無偏頗的估計器</strong>。這有助於最小化重構誤差並維持高召回率。</p>
<p>RaBitQ 也與其他優化技術高度相容，例如<a href="https://www.vldb.org/pvldb/vol9/p288-andre.pdf"> FastScan</a>和<a href="https://github.com/facebookresearch/faiss/wiki/Pre--and-post-processing"> 隨機旋轉預處理</a>。此外，RaBitQ<strong>訓練輕巧，執行快速</strong>。訓練只需決定每個向量元件的符號，搜尋則透過現代 CPU 支援的快速位元運算來加速。這些優化共同使 RaBitQ 能夠在提供高速搜尋的同時，將準確性的損失降到最低。</p>
<h2 id="Engineering-RaBitQ-in-Milvus-From-Academic-Research-to-Production" class="common-anchor-header">Milvus 中的 RaBitQ 工程：從學術研究到生產<button data-href="#Engineering-RaBitQ-in-Milvus-From-Academic-Research-to-Production" class="anchor-icon" translate="no">
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
    </button></h2><p>雖然 RaBitQ 在概念上很簡單，而且也有<a href="https://github.com/gaoj0017/RaBitQ"> 參考實作</a>，但要將它應用在像 Milvus 這樣的分散式、生產級向量資料庫中，卻面臨許多工程上的挑戰。我們在 Milvus 背後的核心向量搜尋引擎 Knowhere 中實作了 RaBitQ，並將最佳化版本貢獻給開放原始碼 ANN 搜尋庫<a href="https://github.com/facebookresearch/faiss"> FAISS</a>。</p>
<p>讓我們來看看我們如何在 Milvus 中實現這個演算法。</p>
<h3 id="Implementation-Tradeoffs" class="common-anchor-header">實作上的取捨</h3><p>一個重要的設計決定涉及到處理每向量的輔助資料。RaBitQ 需要在索引期間預先計算每個向量的兩個浮點值，以及可以即時計算或預先計算的第三個值。在 Knowhere 中，我們在建立索引時預先計算這個值並加以儲存，以提高搜尋時的效率。相反地，FAISS 的實作則是在查詢時計算，以節省記憶體，在記憶體使用量與查詢速度之間做出不同的取捨。</p>
<h3 id="Hardware-Acceleration" class="common-anchor-header">硬體加速</h3><p>現代的 CPU 提供可以大幅加速二進位運算的專門指令。我們量身打造了距離計算核心，以利用現代 CPU 指令的優勢。由於 RaBitQ 依賴 popcount 運算，我們在 Knowhere 中建立了一個專門的路徑，在可用時使用 AVX512 的<code translate="no">VPOPCNTDQ</code> 指令。在支援的硬體 (例如 Intel IceLake 或 AMD Zen 4)上，與預設實作相比，這可以加速二進位距離計算數倍。</p>
<h3 id="Query-Optimization" class="common-anchor-header">查詢最佳化</h3><p>Knowhere (Milvus 的搜尋引擎) 與我們的 FAISS 最佳化版本都支援查詢向量的標量量化 (SQ1-SQ8)。這提供了額外的彈性：即使使用 4 位元的查詢量化，回復率仍然很高，而計算需求卻大幅降低，這在必須以高吞吐量處理查詢時尤其有用。</p>
<p>我們更進一步優化我們專屬的 Cardinal 引擎，為 Zilliz Cloud 上全面管理的 Milvus 提供動力。除了開放原始碼 Milvus 的功能之外，我們還引進了進階的增強功能，包括整合圖型向量索引、額外的優化層級，以及支援 Arm SVE 指令。</p>
<h2 id="The-Performance-Gain-3×-More-QPS-with-Comparable-Accuracy" class="common-anchor-header">效能提升：精確度相當的情況下增加 3 倍 QPS<button data-href="#The-Performance-Gain-3×-More-QPS-with-Comparable-Accuracy" class="anchor-icon" translate="no">
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
    </button></h2><p>從版本 2.6 開始，Milvus 引進新的<code translate="no">IVF_RABITQ</code> 索引類型。這個新索引結合了 RaBitQ 與 IVF 聚類、隨機旋轉轉換，以及可選的精細化，以提供效能、記憶體效率和精確度的最佳平衡。</p>
<h3 id="Using-IVFRABITQ-in-Your-Application" class="common-anchor-header">在您的應用程式中使用 IVF_RABITQ</h3><p>以下是如何在您的 Milvus 應用程式中實作<code translate="no">IVF_RABITQ</code> ：</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient

index_params = MilvusClient.prepare_index_params()

index_params.add_index(
    field_name=<span class="hljs-string">&quot;your_vector_field_name&quot;</span>, <span class="hljs-comment"># Name of the vector field to be indexed</span>
    index_type=<span class="hljs-string">&quot;IVF_RABITQ&quot;</span>, <span class="hljs-comment"># Will be introduced in Milvus 2.6</span>
    index_name=<span class="hljs-string">&quot;vector_index&quot;</span>, <span class="hljs-comment"># Name of the index to create</span>
    metric_type=<span class="hljs-string">&quot;IP&quot;</span>, <span class="hljs-comment"># IVF_RABITQ supports IP and COSINE</span>
    params={
        <span class="hljs-string">&quot;nlist&quot;</span>: <span class="hljs-number">1024</span>, <span class="hljs-comment"># IVF param, specifies the number of clusters</span>
    } <span class="hljs-comment"># Index building params</span>
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Benchmarking-Numbers-Tell-the-Story" class="common-anchor-header">基準測試：數字說故事</h3><p>我們使用<a href="https://github.com/zilliztech/vectordbbench"> vdb-bench</a> 對不同的配置進行了基準測試，<a href="https://github.com/zilliztech/vectordbbench"> vdb-bench</a> 是用於評估向量資料庫的開放原始碼基準測試工具。測試和控制環境都使用部署在 AWS EC2<code translate="no">m6id.2xlarge</code> 實體上的 Milvus Standalone。這些機器具有 8 個 vCPU、32 GB 記憶體，以及基於 Ice Lake 架構的 Intel Xeon 8375C CPU，支援 VPOPCNTDQ AVX-512 指令集。</p>
<p>我們使用 vdb-bench 的搜尋效能測試，資料集包含 100 萬個向量，每個向量有 768 個維度。由於 Milvus 的預設分段大小為 1 GB，而原始資料集（768 維度 × 1M 向量 × 每個浮點 4 位元組）總計約為 3 GB，因此基準測試涉及每個資料庫的多個分段。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_Example_test_configuration_in_vdb_bench_000142f634.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>圖：vdb-bench 中的測試配置範例。</p>
<p>以下是一些關於 IVF、RaBitQ 和精煉過程的配置旋鈕的低階詳細資料：</p>
<ul>
<li><p><code translate="no">nlist</code> 和 是所有基於 方法的標準參數<code translate="no">nprobe</code> <code translate="no">IVF</code></p></li>
<li><p><code translate="no">nlist</code> 是一個非負整數，指定資料集的 IVF 桶總數。</p></li>
<li><p><code translate="no">nprobe</code> 是一個非負整數，指定在搜尋過程中，針對單一資料向量所訪問的 IVF 桶數。這是與搜尋相關的參數。</p></li>
<li><p><code translate="no">rbq_bits_query</code> 指定查詢向量的量化程度。使用 1...8 值表示 ... 量子化層級。使用 0 值可停用量化。這是搜尋相關的參數。<code translate="no">SQ1</code><code translate="no">SQ8</code> </p></li>
<li><p><code translate="no">refine</code>,<code translate="no">refine_type</code> 和<code translate="no">refine_k</code> 參數是精煉過程的標準參數</p></li>
<li><p><code translate="no">refine</code> 是啟用精細化策略的布林值。</p></li>
<li><p><code translate="no">refine_k</code> 是一個非負的 fp 值。精煉過程使用較高品質的量化方法，從 倍大的候選庫中挑選所需數量的最近鄰居，使用 。是與搜尋相關的參數。<code translate="no">refine_k</code> <code translate="no">IVFRaBitQ</code></p></li>
<li><p><code translate="no">refine_type</code> 是一個字串，指定精煉索引的量化類型。可用的選項有 , , , 和 / 。<code translate="no">SQ6</code> <code translate="no">SQ8</code> <code translate="no">FP16</code> <code translate="no">BF16</code> <code translate="no">FP32</code> <code translate="no">FLAT</code></p></li>
</ul>
<p>結果揭示了重要的啟示：</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_Cost_and_performance_comparison_of_baseline_IVF_FLAT_IVF_SQ_8_and_IVF_RABITQ_with_different_refinement_strategies_9f69fa449f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>圖：採用不同精煉策略的基線 (IVF_FLAT)、IVF_SQ8 和 IVF_RABITQ 的成本與效能比較</p>
<p>基線<code translate="no">IVF_FLAT</code> 索引的召回率為 95.2%，達到 236 QPS，相較之下，<code translate="no">IVF_RABITQ</code> 的吞吐量明顯較高--使用 FP32 查詢時為 648 QPS，搭配 SQ8 量化查詢時為 898 QPS。這些數字顯示了 RaBitQ 的效能優勢，尤其是在應用精煉功能時。</p>
<p>然而，這種效能在召回率上有明顯的折衷。當<code translate="no">IVF_RABITQ</code> 在沒有精煉的情況下使用時，回復率約為 76%，對於需要高準確度的應用程式來說，這可能是不足夠的。儘管如此，使用 1 位元向量壓縮達到這樣的回復率仍然令人印象深刻。</p>
<p>精煉是恢復精確度的關鍵。當配置 SQ8 查詢和 SQ8 精煉時，<code translate="no">IVF_RABITQ</code> 可提供極佳的效能和召回率。它維持 94.7% 的高召回率，幾乎與 IVF_FLAT 不相伯仲，同時達到 864 QPS，比 IVF_FLAT 高出 3 倍以上。即使與另一種流行的量化索引<code translate="no">IVF_SQ8</code> 相比，使用 SQ8 精細化的<code translate="no">IVF_RABITQ</code> 也能以類似的召回率達到一半以上的吞吐量，只是成本略高。這讓它成為同時要求速度與精確度的情況下的絕佳選擇。</p>
<p>簡而言之，單獨使用<code translate="no">IVF_RABITQ</code> 就能在可接受的召回率下達到最大吞吐量，若搭配精煉功能以縮小品質差距，則功能會更加強大，與<code translate="no">IVF_FLAT</code> 相比，只需使用一小部分的記憶體空間。</p>
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
    </button></h2><p>RaBitQ 標誌著向量量化技術的重大進步。結合二進位量化與智慧型編碼策略，它實現了看似不可能的目標：以最小的精確度損失達到極致壓縮。</p>
<p>從即將推出的 2.6 版開始，Milvus 將引入 IVF_RABITQ，將這項強大的壓縮技術與 IVF 聚類和精煉策略相結合，將二進位量化技術帶入生產中。這一組合在精確度、速度和記憶體效率之間建立了實用的平衡，可以改變您的向量搜尋工作負載。</p>
<p>我們致力於為開放原始碼的 Milvus 及其在 Zilliz Cloud 上的全面管理服務帶來更多類似的創新，讓向量搜尋更有效率，並讓每個人都能使用。</p>
<p>敬請期待 Milvus 2.6 版本推出更多的強大功能，並加入我們的社群<a href="https://milvus.io/discord"> milvus.io/discord</a>，了解更多資訊、分享您的經驗或提出問題。</p>
