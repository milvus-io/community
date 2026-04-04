---
id: turboquant-rabitq-vector-database-cost.md
title: 超越 TurboQuant-RaBitQ 辯論：向量量化為何對 AI 基礎架構成本很重要
author: Li Liu
date: 2026-4-2
cover: assets.zilliz.com/vectorquantization_0bea9e6bec.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  TurboQuant, RaBitQ, vector quantization, TurboQuant vs RaBitQ, vector database
  memory optimization
meta_title: |
  Vector Quantization: Beyond the TurboQuant-RaBitQ Debate
desc: >-
  TurboQuant-RaBitQ 之爭讓向量量化成為頭條新聞。RaBitQ 1 位元壓縮如何運作，以及 Milvus 如何運用 IVF_RABITQ 節省
  97% 記憶體。
origin: 'https://milvus.io/blog/turboquant-rabitq-vector-database-cost.md'
---
<p>Google 的 TurboQuant 論文 (ICLR 2026) 報導 KV 快取<a href="https://www.cnbc.com/2026/03/26/google-ai-turboquant-memory-chip-stocks-samsung-micron.html">記憶體</a>壓縮 6 倍，精確度損失近乎零 - 這些驚人的結果足以讓<a href="https://www.cnbc.com/2026/03/26/google-ai-turboquant-memory-chip-stocks-samsung-micron.html">記憶體晶片股在</a>一天內<a href="https://www.cnbc.com/2026/03/26/google-ai-turboquant-memory-chip-stocks-samsung-micron.html">跌去 900 億美元</a>。SK Hynix 下跌 12%。三星下跌 7%。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Beyond_the_Turbo_Quant_Ra_Bit_Q_Debate_How_Vector_Quantization_Is_Reshaping_AI_Infrastructure_from_Paper_to_Production_1_825845eccb.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>這篇論文很快就引起了審查。<a href="https://dl.acm.org/doi/10.1145/3654970">RaBitQ</a>(SIGMOD 2024) 的第一作者<a href="https://gaoj0017.github.io/">Jianyang Gao</a> <a href="https://medium.com/@gaojianyang0017/turboquant-and-rabitq-what-the-public-story-gets-wrong-23df83209c22">提出了</a>TurboQuant 的方法與他之前向量量化工作之間關係的<a href="https://medium.com/@gaojianyang0017/turboquant-and-rabitq-what-the-public-story-gets-wrong-23df83209c22">問題</a>。(我們即將發表與 Dr. Gao 的對談，如果您有興趣，請關注我們)。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Beyond_the_Turbo_Quant_Ra_Bit_Q_Debate_How_Vector_Quantization_Is_Reshaping_AI_Infrastructure_from_Paper_to_Production_2_0860406cae.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>這篇文章不是要在這場討論中偏袒任何一方。讓我們印象深刻的是一些更大的事情：一篇<a href="https://milvus.io/docs/index-explained.md">向量量化</a>論文就能帶動 900 億美元的市值，這事實告訴你這項技術對於 AI 基礎架構已經變得多麼重要。無論是壓縮推理引擎中的 KV 快取，或是壓縮<a href="https://zilliz.com/learn/what-is-vector-database">向量資料庫中</a>的索引，在保持品質的同時縮小高維資料的能力，對成本有著巨大的影響 - 這是我們一直在努力解決的問題，我們將 RaBitQ 整合到<a href="https://milvus.io/">Milvus</a>向量資料庫中，並將其轉化為生產基礎架構。</p>
<p>以下是我們將介紹的內容：向量量化目前為何如此重要、TurboQuant 與 RaBitQ 的比較、RaBitQ 是什麼以及它如何運作、在 Milvus 內運作它背後的工程工作，以及 AI 基礎架構更廣泛的記憶體最佳化情況。</p>
<h2 id="Why-Does-Vector-Quantization-Matter-for-Infrastructure-Costs" class="common-anchor-header">為什麼向量量化對基礎架構成本很重要？<button data-href="#Why-Does-Vector-Quantization-Matter-for-Infrastructure-Costs" class="anchor-icon" translate="no">
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
    </button></h2><p>向量量化並非新事物。新的是業界對它的迫切需求。過去兩年來，LLM 參數不斷膨脹，上下文視窗從 4K 擴展到 128K+ tokens，而非結構化資料 - 文字、圖片、音訊、視訊 - 已經成為 AI 系統的一流輸入。這些趨勢都會產生更多需要儲存、編索引和搜尋的高維向量。向量越多，記憶體就越多，成本也就越高。</p>
<p>如果您正在大規模執行向量搜尋 -<a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">RAG 管道</a>、推薦引擎、多模態檢索 - 記憶體成本很可能是您最頭痛的基礎架構之一。</p>
<p>在模型部署期間，每個主要的 LLM 推理堆疊都依賴<a href="https://zilliz.com/glossary/kv-cache">KV 快取</a>- 儲存先前計算的 key-value 對，這樣注意機制就不會為每個新的標記重新計算它們。正是它讓 O(n) 推論成為可能，而不是 O(n²)。從<a href="https://github.com/vllm-project/vllm">vLLM</a>到<a href="https://github.com/NVIDIA/TensorRT-LLM">TensorRT-LLM</a>的每個架構都仰賴它。但是 KV 快取所消耗的 GPU 記憶體可能比模型權重本身還多。更長的上下文、更多的並發使用者，這些都會快速增加。</p>
<p>向量資料庫也面臨同樣的壓力 - 數十億的高維向量存放在記憶體中，每個維度都是 32 位元的浮點數。向量量化將這些向量從 32 位元浮點數壓縮為 4 位元、2 位元，甚至 1 位元的表示方式 - 將記憶體縮減 90% 或更多。無論是推論引擎中的 KV 快取，或是向量資料庫中的索引，其基本的計算方法都是一樣的，而所節省的成本也是實實在在的。這就是為什麼一篇報告此領域突破的論文就能帶動 900 億美元的股票市值。</p>
<h2 id="TurboQuant-vs-RaBitQ-Whats-the-Difference" class="common-anchor-header">TurboQuant vs RaBitQ：有什麼區別？<button data-href="#TurboQuant-vs-RaBitQ-Whats-the-Difference" class="anchor-icon" translate="no">
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
    </button></h2><p>TurboQuant 與 RaBitQ 都是以相同的基礎技術為基礎：在量化之前，對輸入向量進行隨機旋轉<a href="https://arxiv.org/abs/2406.03482">(Johnson-Lindenstrauss 變換</a>)。此旋轉將不規則分布的資料轉換成可預測的均勻分布，使其更容易量化且誤差更低。</p>
<p>除了這個共同的基礎之外，兩者針對不同的問題，採取不同的方法：</p>
<table>
<thead>
<tr><th></th><th>TurboQuant</th><th>RaBitQ</th></tr>
</thead>
<tbody>
<tr><td><strong>目標</strong></td><td>LLM 推理中的 KV 快取 (短暫、每次要求的資料)</td><td>資料庫中的持久向量索引（儲存資料）</td></tr>
<tr><td><strong>方法</strong></td><td>兩階段式：PolarQuant (每個座標的 Lloyd-Max 標量量化器) +<a href="https://arxiv.org/abs/2406.03482">QJL</a>(1 位元殘餘修正)</td><td>單階段：超立方投影 + 無偏距離估計器</td></tr>
<tr><td><strong>位元寬度</strong></td><td>3 位元鍵，2 位元值（混合精度）</td><td>每個維度 1 位元 (可提供多位元變體)</td></tr>
<tr><td><strong>理論聲稱</strong></td><td>接近最佳 MSE 失真率</td><td>近似最佳內產估計誤差（與 Alon-Klartag 下限相符）</td></tr>
<tr><td><strong>生產狀況</strong></td><td>社群實作；Google 尚未正式發行</td><td>在<a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md">Milvus 2.6</a> 中發表，並獲 Faiss、VSAG、Elasticsearch 採用</td></tr>
</tbody>
</table>
<p>對實作人員而言，主要差異在於TurboQuant 優化推論引擎內的暫態 KV 快取，而 RaBitQ 則針對向量資料庫在數十億向量中建立、分片與查詢的持久性索引。在這篇文章的其餘部分，我們將專注於 RaBitQ - 我們已在 Milvus 內整合並運作的演算法。</p>
<h2 id="What-Is-RaBitQ-and-What-Does-It-Deliver" class="common-anchor-header">RaBitQ 是什麼？<button data-href="#What-Is-RaBitQ-and-What-Does-It-Deliver" class="anchor-icon" translate="no">
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
    </button></h2><p>首先是底線：在一個 1000 萬向量、768 維度的資料集上，RaBitQ 將每個向量壓縮為原始大小的 1/32，同時保持 94% 以上的召回率。在 Milvus 中，這表示查詢吞吐量比全精確索引高出 3.6 倍。這並非理論上的預測，而是 Milvus 2.6 的基準結果。</p>
<p>現在來看看它是如何達到目標的。</p>
<p>傳統的二進位量化將 FP32 向量壓縮為每維 1 位元 - 32 倍壓縮。這樣做的代價是：由於丟失了太多資訊，回復率會下降。<a href="https://arxiv.org/abs/2405.12497">RaBitQ</a>(Gao &amp; Long, SIGMOD 2024) 保持了相同的 32 倍壓縮，但保留了對搜尋而言真正重要的資訊。<a href="https://arxiv.org/abs/2409.09913">擴展版本</a>(Gao &amp; Long, SIGMOD 2025) 證明這是近似最佳的，符合 Alon &amp; Klartag (FOCS 2017) 所建立的理論下限。</p>
<h3 id="Why-Do-Angles-Matter-More-Than-Coordinates-in-High-Dimensions" class="common-anchor-header">為什麼在高維度中，角度比坐標更重要？</h3><p>關鍵洞察：<strong>在高維中，向量之間的角度比個別坐標值更穩定、更有資訊性。</strong>這是量度集中的結果 - 與約翰遜-林登斯特勞斯隨機投影的現象相同。</p>
<p>這在實務上意味著：您可以捨棄高維向量的精確坐標值，只保留其相對於資料集的方向。角度關係 (也就是<a href="https://zilliz.com/glossary/anns">近鄰搜尋所</a>依賴的實際關係) 在壓縮後仍然存在。</p>
<h3 id="How-Does-RaBitQ-Work" class="common-anchor-header">RaBitQ 如何工作？</h3><p>RaBitQ 將這個幾何觀點轉化為三個步驟：</p>
<p><strong>步驟 1：規範化。</strong>將每個向量置於資料集中心點的中心，並縮放到單位長度。這將問題轉換為單位向量間的內乘估計 - 更容易分析和約束。</p>
<p><strong>步驟 2：隨機旋轉 + 超立方投影。</strong>套用隨機正交矩陣（Johnson-Lindenstrauss 類型的旋轉），以消除對任何軸的偏差。將每個旋轉向量投影到最接近的 {±1/√D}^D 超立方頂點。每個維度折疊為單一位元。結果：每個向量有一個 D 位元的二進碼。</p>
<p><strong>步驟 3：無偏距離估計。</strong>建構查詢與原始 (未量化) 向量之間內積的估計器。此估計器可證明是無偏的，誤差約為 O(1/√D)。對於 768 維向量而言，這可讓回復率維持在 94% 以上。</p>
<p>二進位向量之間的距離計算可簡化為 bitwise AND + popcount - 現代 CPU 只需一個週期即可執行的操作。這就是 RaBitQ 之所以快，而不只是小的原因。</p>
<h3 id="Why-Is-RaBitQ-Practical-Not-Just-Theoretical" class="common-anchor-header">為什麼 RaBitQ 是實用的，而不只是理論上的？</h3><ul>
<li><strong>不需要訓練。</strong>應用旋轉，檢查符號。不需要迭代最佳化，不需要學習編碼簿。索引時間與<a href="https://milvus.io/docs/ivf-pq.md">乘積量化</a>相當。</li>
<li><strong>硬體友善。</strong>距離計算為 bitwise AND + popcount。現代 CPU (Intel IceLake+, AMD Zen 4+) 有專用的 AVX512VPOPCNTDQ 指令。單向量估算的執行速度比 PQ 查表快 3 倍。</li>
<li><strong>多位元靈活性。</strong> <a href="https://vectordb-ntu.github.io/RaBitQ-Library/">RaBitQ Library</a>支援 1 位元以上的變體：4 位元可達到 ~90% 的回復率，5 位元 ~95%，7 位元 ~99% - 全部不需重新排列。</li>
<li><strong>可組合。</strong>可插入現有的索引結構，例如<a href="https://milvus.io/docs/ivf-flat.md">IVF 索引</a>和<a href="https://milvus.io/docs/hnsw.md">HNSW 圖形</a>，並可與<a href="https://milvus.io/docs/hnsw.md">FastScan</a> 搭配使用，進行批次距離計算。</li>
</ul>
<h2 id="From-Paper-to-Production-What-We-Built-to-Ship-RaBitQ-in-Milvus" class="common-anchor-header">從紙張到生產：我們在 Milvus 中為推出 RaBitQ 所做的建置<button data-href="#From-Paper-to-Production-What-We-Built-to-Ship-RaBitQ-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>原始的 RaBitQ 程式碼是單機研究原型。要讓它在具有分片、故障移轉和即時擷取功能的<a href="https://milvus.io/docs/architecture_overview.md">分散式集群</a>中運作，需要解決四個工程問題。在<a href="https://zilliz.com/">Zilliz</a>，我們不只是簡單地實作演算法 - 工作範圍涵蓋引擎整合、硬體加速、索引最佳化和執行時調整，以將 RaBitQ 轉變為 Milvus 內的工業級功能。您也可以在這篇部落格中找到更多詳細資訊：<a href="https://milvus.io/blog/bring-vector-compression-to-the-extreme-how-milvus-serves-3%C3%97-more-queries-with-rabitq.md">將向量壓縮發揮到極致：Milvus 如何使用 RaBitQ 提供多 3 倍的查詢服務</a></p>
<h3 id="Making-RaBitQ-Distributed-Ready" class="common-anchor-header">讓 RaBitQ 成為分布式就緒的工具</h3><p>我們直接將 RaBitQ 整合到 Milvus 的核心搜尋引擎<a href="https://github.com/milvus-io/knowhere">Knowhere</a> 中 - 不是作為外掛，而是作為具有統一介面的原生索引類型。它可與 Milvus 的完整分散式架構搭配使用：分片、分割、動態擴充及<a href="https://milvus.io/docs/manage-collections.md">集合管理</a>。</p>
<p>主要的挑戰是：讓量化編碼本（旋轉矩陣、中心向量、縮放參數）具分段感知功能，因此每個分片都能建立並儲存自己的量化狀態。索引建立、壓縮和負載平衡都能原生理解新的索引類型。</p>
<h3 id="Squeezing-Every-Cycle-Out-of-Popcount" class="common-anchor-header">榨取 Popcount 的每個週期</h3><p>RaBitQ 的速度來自 popcount - 計數二進位向量中的集合位元。這個演算法本質上是快速的，但您能獲得多少吞吐量取決於您如何善用硬體。我們為兩種主流伺服器架構建立了專用的 SIMD 程式碼路徑：</p>
<ul>
<li><strong>x86 (Intel IceLake+ / AMD Zen 4+)：</strong>AVX-512 的 VPOPCNTDQ 指令會在多個 512 位元暫存器之間並行計算 popcount。Knowhere 的內部迴圈經過重組，可將二進位距離計算分批轉換為 SIMD 寬度的分塊，從而最大化吞吐量。</li>
<li><strong>ARM (Graviton, Ampere)：</strong>SVE (Scalable Vector Extension，可擴充向量擴充) 指令用於相同的平行 popcount 模式 - 這點非常重要，因為 ARM 實例在成本最佳化的雲端部署中越來越普遍。</li>
</ul>
<h3 id="Eliminating-Runtime-Overhead" class="common-anchor-header">消除運行時開銷</h3><p>RaBitQ 在查詢時需要輔助浮點參數：資料集中心點、每向量規範，以及每個量化向量與其原始向量之間的內積 (由距離估計器使用)。每次查詢計算這些參數會增加延遲。儲存完整的原始向量有違壓縮的目的。</p>
<p>我們的解決方案：在建立索引時，預先計算並持久化這些參數，將它們與二進位碼一起快取。記憶體開銷很小 (每個向量幾個浮點數)，但它消除了每次查詢的計算，並在高併發下保持延遲穩定。</p>
<h3 id="IVFRABITQ-The-Index-You-Actually-Deploy" class="common-anchor-header">IVF_RABITQ：您實際部署的索引</h3><p>從<a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md">Milvus 2.6</a> 開始，我們提供<a href="https://milvus.io/docs/ivf-rabitq.md">IVF_RABITQ</a>-<a href="https://milvus.io/docs/ivf-flat.md">反向檔案索引</a>+ RaBitQ 量化。搜尋分兩個階段進行：</p>
<ol>
<li><strong>粗搜尋 (IVF)。</strong>K-means 將向量空間分割成群組。在查詢時，只掃描 nprobe 最近的叢集。</li>
<li><strong>精細評分 (RaBitQ)。</strong>在每個簇內，使用 1 位元編碼和無偏估算器估算距離。Popcount 會執行繁重的工作。</li>
</ol>
<p>768 維、1000 萬向量資料集的結果：</p>
<table>
<thead>
<tr><th>公制</th><th>IVF_FLAT (基線)</th><th>IVF_RABITQ</th><th>IVF_RABITQ + SQ8 refine</th></tr>
</thead>
<tbody>
<tr><td>召回率</td><td>95.2%</td><td>94.7%</td><td>~95%</td></tr>
<tr><td>QPS</td><td>236</td><td>864</td><td>-</td></tr>
<tr><td>記憶體佔用量</td><td>32 位元/位元</td><td>1 位元/位元 (~3% 原始值)</td><td>原始資料的 ~25</td></tr>
</tbody>
</table>
<p>對於連 0.5% 的召回差距都無法容忍的工作負載，refine_type 參數會增加第二個評分通道：SQ6、SQ8、FP16、BF16 或 FP32。SQ8 是常見的選擇 - 它可以將記憶回復到 IVF_FLAT 水準，記憶體數量大約是原始記憶體的 1/4。您也可以<a href="https://milvus.io/docs/ivf-sq8.md">將標量量化</a>獨立應用於查詢端 (SQ1-SQ8)，讓您有兩個旋鈕可以調整每個工作負載的延遲-回復-成本權衡。</p>
<h2 id="How-Milvus-Optimizes-Memory-Beyond-Quantization" class="common-anchor-header">Milvus 如何在量化之外優化記憶體<button data-href="#How-Milvus-Optimizes-Memory-Beyond-Quantization" class="anchor-icon" translate="no">
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
    </button></h2><p>RaBitQ 是最引人注目的壓縮工具，但它只是更廣泛的<a href="https://milvus.io/blog/milvus-26-preview-72-memory-reduction-without-compromising-recall-and-4x-faster-than-elasticsearch.md">記憶體最佳化</a>堆疊中的一層：</p>
<table>
<thead>
<tr><th>策略</th><th>作用</th><th>影響</th></tr>
</thead>
<tbody>
<tr><td><strong>全堆疊量化</strong></td><td>SQ8、PQ、RaBitQ 以不同的精確度成本折衷</td><td>記憶體減少 4 到 32 倍</td></tr>
<tr><td><strong>索引結構最佳化</strong></td><td>HNSW 圖形壓縮、DiskANN SSD 卸載、OOM 安全索引建立</td><td>每個索引的 DRAM 更少，每個節點的資料集更大</td></tr>
<tr><td><strong>記憶體映射 I/O (mmap)</strong></td><td>將向量檔案映射到磁碟，透過作業系統的頁面快取記憶體，依需求載入頁面</td><td>TB 規模的資料集，而無需將所有資料載入 RAM</td></tr>
<tr><td><strong>分層儲存</strong></td><td>自動排程的熱/暖/冷資料分離</td><td>只需為經常存取的資料支付記憶體價格</td></tr>
<tr><td><strong>雲端原生擴充</strong><a href="https://zilliz.com/cloud">(Zilliz Cloud</a>、Milvus 管理)</td><td>彈性記憶體分配、閒置資源自動釋放</td><td>只需為您所使用的付費</td></tr>
</tbody>
</table>
<h3 id="Full-Stack-Quantization" class="common-anchor-header">全堆疊量化</h3><p>RaBitQ 的 1 位元極緻壓縮並不適合每種工作負載。Milvus 提供完整的量化矩陣：<a href="https://milvus.io/docs/ivf-sq8.md">SQ8</a>與<a href="https://milvus.io/docs/ivf-pq.md">乘積量化 (PQ)</a>適用於需要平衡精確度與成本權衡的工作負載，RaBitQ 適用於在超大資料集上進行最大壓縮，以及結合多種方法以進行精細控制的混合配置。</p>
<h3 id="Index-Structure-Optimization" class="common-anchor-header">索引結構最佳化</h3><p>除了量化之外，Milvus 也持續優化其核心索引結構的記憶體開銷。對於<a href="https://milvus.io/docs/hnsw.md">HNSW</a>，我們減少了毗鄰列表的冗餘，以降低每個圖的記憶體使用量。<a href="https://milvus.io/docs/diskann.md">DiskANN</a>將向量資料和索引結構推至 SSD，大幅降低大型資料集對 DRAM 的依賴。我們還優化了索引建立期間的中間記憶體分配，以防止在接近節點記憶體限制的資料集上建立索引時發生 OOM 故障。</p>
<h3 id="Smart-Memory-Loading" class="common-anchor-header">智慧型記憶體載入</h3><p>Milvus 的<a href="https://milvus.io/docs/mmap.md">mmap</a>（記憶體映射 I/O）支援可將向量資料映射到磁碟檔案，並依賴作業系統的頁面快取記憶體進行按需載入 - 不需要在啟動時將所有資料載入記憶體。結合可防止記憶體突然激增的懶散載入與分割載入策略，可讓 TB 規模的向量資料集順暢運作，而所需的記憶體成本僅是一小部分。</p>
<h3 id="Tiered-Storage" class="common-anchor-header">分層儲存</h3><p>Milvus 的<a href="https://milvus.io/docs/tiered-storage-overview.md">三層儲存架構</a>跨越記憶體、SSD 和物件儲存：熱資料保留在記憶體中以降低延遲，熱資料快取在 SSD 上以平衡效能與成本，冷資料匯入物件儲存以降低開銷。系統會自動處理資料排程 - 無須變更應用程式層。</p>
<h3 id="Cloud-Native-Scaling" class="common-anchor-header">雲端原生擴充</h3><p>在 Milvus 的<a href="https://milvus.io/docs/architecture_overview.md">分散式架構</a>下，資料分片與負載平衡可防止單一節點記憶體超載。記憶體池可減少分散並提高使用率。<a href="https://zilliz.com/cloud">Zilliz Cloud</a>(完全管理 Milvus) 更進一步，利用彈性排程進行隨選記憶體擴充 - 在 Serverless 模式下，閒置資源會自動釋放，進一步降低總擁有成本。</p>
<h3 id="How-These-Layers-Compound" class="common-anchor-header">這些層級如何複合</h3><p>這些最佳化並非替代方案，而是堆疊在一起的。RaBitQ 縮小向量。DiskANN 將索引保留在 SSD 上。Mmap 避免將冷資料載入記憶體。<a href="https://milvus.io/blog/milvus-tiered-storage-80-less-vector-search-cost-with-on-demand-hot–cold-data-loading.md">分層儲存</a>可將歸檔資料推至物件儲存。結果：提供數十億向量的部署不需要價值數十億向量的 RAM。</p>
<h2 id="Get-Started" class="common-anchor-header">開始使用<button data-href="#Get-Started" class="anchor-icon" translate="no">
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
    </button></h2><p>隨著 AI 資料量持續成長，向量資料庫的效率與成本將直接決定 AI 應用程式的擴充能力。我們將持續投資於高效能、低成本的向量基礎架構，讓更多 AI 應用程式能從原型進入生產階段。</p>
<p><a href="https://github.com/milvus-io/milvus">Milvus</a>是開放原始碼。若要試用 IVF_RABITQ：</p>
<ul>
<li>查看<a href="https://milvus.io/docs/ivf-rabitq.md">IVF_RABITQ 文件</a>以獲得配置和調校指南。</li>
<li>閱讀完整的<a href="https://milvus.io/blog/bring-vector-compression-to-the-extreme-how-milvus-serves-3×-more-queries-with-rabitq.md">RaBitQ 整合部落格文章</a>，瞭解更深入的基準與實作細節。</li>
<li>加入<a href="https://slack.milvus.io/">Milvus Slack 社群</a>，向其他開發人員發問與學習。</li>
<li><a href="https://milvus.io/office-hours">預約免費的 Milvus Office Hours 課程</a>，瞭解您的使用個案。</li>
</ul>
<p>如果您想跳過基礎架構的設定，<a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a>(完全管理的 Milvus) 提供免費的層級與 IVF_RABITQ 支援。</p>
<p>我們即將對 RaBitQ 的第一作者<a href="https://personal.ntu.edu.sg/c.long/">Cheng Long</a>教授 (NTU, VectorDB@NTU) 和<a href="https://gaoj0017.github.io/">Jianyang Gao 博士</a>(ETH Zurich) 進行專訪，深入探討向量量化理論和下一步的發展。請在評論中提出您的問題。</p>
<h2 id="Frequently-Asked-Questions" class="common-anchor-header">常見問題<button data-href="#Frequently-Asked-Questions" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="What-are-TurboQuant-and-RaBitQ" class="common-anchor-header">TurboQuant 和 RaBitQ 是什麼？</h3><p>TurboQuant (Google, ICLR 2026) 和 RaBitQ (Gao &amp; Long, SIGMOD 2024) 都是向量量化方法，使用隨機旋轉來壓縮高維向量。TurboQuant 針對 LLM 推論中的 KV 快取壓縮，而 RaBitQ 則針對資料庫中的持久向量索引。儘管兩者針對不同的系統解決不同的問題，但兩者都對目前向量量化的興趣浪潮有所貢獻。</p>
<h3 id="How-does-RaBitQ-achieve-1-bit-quantization-without-destroying-recall" class="common-anchor-header">RaBitQ 如何在不破壞召回率的情況下實現 1 位元量化？</h3><p>RaBitQ 利用了高維空間中的量度集中：當維數增加時，向量之間的角度比個別坐標值更穩定。它將向量相對於資料集中心點標準化，然後將每個向量投影到超立方的最近頂點 (將每個維度減少到單一位元)。儘管有壓縮，一個無偏差的距離估計器仍能保持精確的搜尋。</p>
<h3 id="What-is-IVFRABITQ-and-when-should-I-use-it" class="common-anchor-header">什麼是 IVF_RABITQ？</h3><p>IVF_RABITQ 是 Milvus 的向量索引類型 (自 2.6 版起可用)，結合了倒置檔案聚類與 RaBitQ 1 位元量化。它以 3.6 倍於 IVF_FLAT 的吞吐量達到 94.7% 的召回率，記憶體使用量大約是原始向量的 1/32。當您需要提供大規模向量搜尋 (數百萬到數十億向量)，且記憶體成本是首要考量時，請使用它 - 這在 RAG、推薦和多模態搜尋工作負載中很常見。</p>
<h3 id="How-does-vector-quantization-relate-to-KV-cache-compression-in-LLMs" class="common-anchor-header">向量量化與 LLM 中的 KV 快取壓縮有何關聯？</h3><p>這兩個問題都涉及壓縮高維浮點向量。KV 快取儲存了 Transformer 注意機制中的鍵值對；在上下文長度較長時，其記憶體使用量可能會超過模型權重。向量量化技術 (例如 RaBitQ) 可將這些向量減少為較低位元的表示。無論是壓縮資料庫索引中的向量，還是推論引擎的 KV 快取記憶體中的向量，都適用相同的數學原則 - 量測集中、隨機旋轉、無偏距估算。</p>
