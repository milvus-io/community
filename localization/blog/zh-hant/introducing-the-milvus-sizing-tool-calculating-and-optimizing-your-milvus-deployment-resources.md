---
id: >-
  introducing-the-milvus-sizing-tool-calculating-and-optimizing-your-milvus-deployment-resources.md
title: 介紹 Milvus 大小工具：計算和優化您的 Milvus 部署資源
author: 'Ken Zhang, Fendy Feng'
date: 2025-04-11T00:00:00.000Z
desc: 使用我們的用戶友好型尺寸工具最大化您的 Milvus 性能！了解如何配置您的部署，以獲得最佳的資源使用和成本節約。
cover: assets.zilliz.com/Introducing_Milvus_Sizing_Tool_c0c98343a2.png
tag: Tutorials
recommend: false
canonicalUrl: 'https://zilliz.com/blog/demystify-milvus-sizing-tool'
---
<h2 id="Introduction" class="common-anchor-header">簡介<button data-href="#Introduction" class="anchor-icon" translate="no">
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
    </button></h2><p>為您的 Milvus 部署選擇最佳配置對性能優化、資源有效利用和成本管理至關重要。無論您是在建立原型或規劃生產部署，適當地調整您的 Milvus 實例大小，可能意味著一個流暢運行的向量資料庫與一個在性能上掙扎或產生不必要成本的資料庫之間的差異。</p>
<p>為了簡化這一過程，我們更新了<a href="https://milvus.io/tools/sizing">Milvus 大小工具</a>，這是一個用戶友好的計算機，可根據您的特定需求生成推薦的資源估算。在本指南中，我們將引導您使用該工具，並深入瞭解影響 Milvus 性能的因素。</p>
<h2 id="How-to-Use-the-Milvus-Sizing-Tool" class="common-anchor-header">如何使用 Milvus 大小工具<button data-href="#How-to-Use-the-Milvus-Sizing-Tool" class="anchor-icon" translate="no">
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
    </button></h2><p>使用這個尺寸工具超級簡單。只需遵循以下步驟。</p>
<ol>
<li><p>訪問<a href="https://milvus.io/tools/sizing/"> Milvus Sizing Tool</a>頁面。</p></li>
<li><p>輸入您的關鍵參數：</p>
<ul>
<li><p>向量數量和每個向量的尺寸</p></li>
<li><p>索引類型</p></li>
<li><p>標量欄位資料大小</p></li>
<li><p>區段大小</p></li>
<li><p>您偏好的部署模式</p></li>
</ul></li>
<li><p>檢閱產生的資源建議</p></li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/milvus_sizing_tool_3ca881b3d5.jpeg" alt="milvus sizing tool" class="doc-image" id="milvus-sizing-tool" />
   </span> <span class="img-wrapper"> <span>Milvus 大小工具</span> </span></p>
<p>讓我們來探討這些參數如何影響您的 Milvus 部署。</p>
<h2 id="Index-Selection-Balancing-Storage-Cost-Accuracy-and-Speed" class="common-anchor-header">索引選擇：平衡儲存、成本、準確性和速度<button data-href="#Index-Selection-Balancing-Storage-Cost-Accuracy-and-Speed" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 提供多種索引演算法，包括<a href="https://zilliz.com/learn/hierarchical-navigable-small-worlds-HNSW">HNSW</a>、FLAT、IVF_FLAT、IVF_SQ8、<a href="https://zilliz.com/learn/what-is-scann-scalable-nearest-neighbors-google">ScaNN</a>、<a href="https://zilliz.com/learn/DiskANN-and-the-Vamana-Algorithm">DiskANN</a> 等，每種演算法在記憶體使用量、磁碟空間需求、查詢速度和搜尋準確度上都有不同的取捨。</p>
<p>以下是您需要瞭解的最常見選項：</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/index_dde661d579.jpeg" alt="index" class="doc-image" id="index" />
   </span> <span class="img-wrapper"> <span>索引</span> </span></p>
<p>HNSW（分層導航小世界）</p>
<ul>
<li><p><strong>架構</strong>：結合跳躍清單與 Navigable Small Worlds (NSWs) 圖形的層級結構</p></li>
<li><p><strong>效能</strong>：查詢速度極快，召回率極高</p></li>
<li><p><strong>資源使用</strong>：每個向量需要的記憶體最多（成本最高）</p></li>
<li><p><strong>最適合</strong>對速度和精確度要求極高，且不太在意記憶體限制的應用程式</p></li>
<li><p><strong>技術註解</strong>：搜尋從節點最少的最上層開始，向下遍歷密度越來越高的各層</p></li>
</ul>
<p>平面</p>
<ul>
<li><p><strong>架構</strong>：沒有近似值的簡單窮盡搜尋</p></li>
<li><p><strong>效能</strong>：100% 回復率，但查詢時間極慢 (<code translate="no">O(n)</code> for data size<code translate="no">n</code>)</p></li>
<li><p><strong>資源使用</strong>：索引大小等於原始向量資料大小</p></li>
<li><p><strong>最適合</strong>小型資料集或需要完美召回率的應用程式</p></li>
<li><p><strong>技術註解</strong>： 執行查詢向量與資料庫中每個向量之間的完整距離計算</p></li>
</ul>
<p>IVF_FLAT</p>
<ul>
<li><p><strong>架構</strong>：將向量空間分割成群組，以提高搜尋效率</p></li>
<li><p><strong>效能</strong>：中高召回率與中等查詢速度 (比 HNSW 慢，但比 FLAT 快)</p></li>
<li><p><strong>資源使用</strong>：所需記憶體比 FLAT 少，但比 HNSW 多</p></li>
<li><p><strong>最適合</strong>平衡的應用程式，可以用一些召回率來換取更好的效能</p></li>
<li><p><strong>技術註解</strong>：在搜尋過程中，只檢查<code translate="no">nlist</code> 叢集，大幅減少計算量</p></li>
</ul>
<p>IVF_SQ8</p>
<ul>
<li><p><strong>架構</strong>：將標量量化套用至 IVF_FLAT，壓縮向量資料</p></li>
<li><p><strong>效能</strong>：中等召回率與中等高查詢速度</p></li>
<li><p><strong>資源使用</strong>：與 IVF_FLAT 相比，磁碟、運算和記憶體消耗減少 70-75</p></li>
<li><p><strong>最適合</strong>資源有限的環境，精確度可能會略有降低</p></li>
<li><p><strong>技術說明</strong>：將 32 位元浮點數值壓縮為 8 位元整數數值</p></li>
</ul>
<h3 id="Advanced-Index-Options-ScaNN-DiskANN-CAGRA-and-more" class="common-anchor-header">進階索引選項：ScaNN、DiskANN、CAGRA 等等</h3><p>對於有特殊需求的開發人員，Milvus 也提供了：</p>
<ul>
<li><p><a href="https://zilliz.com/learn/what-is-scann-scalable-nearest-neighbors-google"><strong>ScaNN</strong></a>: CPU 速度比 HNSW 快 20%，記憶率相近</p></li>
<li><p><a href="https://milvus.io/docs/disk_index.md"><strong>DiskANN</strong></a>：磁碟/記憶體混合索引，最適合需要支援大量向量且召回率高，並能接受稍長延遲 (~100ms) 的情況。它只將索引的一部分保留在記憶體中，其他部分則保留在磁碟上，從而平衡記憶體使用量與效能。</p></li>
<li><p><strong>基於 GPU 的索引</strong>：</p>
<ul>
<li><p><a href="https://zilliz.com/blog/Milvus-introduces-GPU-index-CAGRA">GPU_CAGRA</a>： 這是最快的 GPU 索引，但它需要具備 GDDR 記憶體的推理卡，而不是具備 HBM 記憶體的推理卡。</p></li>
<li><p>gpu_brute_force：在 GPU 上執行的窮盡搜尋</p></li>
<li><p>GPU_IVF_FLAT：GPU加速版本的IVF_FLAT</p></li>
<li><p>GPU_IVF_PQ: 具備<a href="https://zilliz.com/learn/harnessing-product-quantization-for-memory-efficiency-in-vector-databases">乘積量化</a>功能的 GPU 加速版本 IVF</p></li>
</ul></li>
<li><p><strong>HNSW-PQ/SQ/PRQ</strong>：</p>
<ul>
<li><p><strong>HNSW_SQ</strong>: 非常高速的查詢，記憶體資源有限；可接受召回率的輕微折衷。</p></li>
<li><p><strong>HNSW_PQ</strong>：中速查詢；記憶體資源非常有限；接受召回率的輕微折衷</p></li>
<li><p><strong>HNSW_PRQ</strong>: 中等速度查詢；記憶體資源非常有限；接受召回率的輕微折衷。</p></li>
<li><p><strong>AUTOINDEX</strong>: 在開放原始碼的 Milvus 中預設為 HNSW (或在受管理的 Milvus<a href="https://zilliz.com/cloud">Zilliz Cloud</a> 中使用效能較高的專屬索引)。</p></li>
</ul></li>
<li><p><strong>二進位、稀疏和其他專用索引</strong>：適用於特定的資料類型和使用個案。如需詳細資訊，請參閱<a href="https://milvus.io/docs/index.md">此索引說明文件頁面</a>。</p></li>
</ul>
<h2 id="Segment-Size-and-Deployment-Configuration" class="common-anchor-header">區段大小與部署組態<button data-href="#Segment-Size-and-Deployment-Configuration" class="anchor-icon" translate="no">
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
    </button></h2><p>區段是 Milvus 內部資料組織的基本建構塊。它們的功能是在您的部署中實現分散式搜索和負載平衡的數據塊。此 Milvus 大小工具提供三種區段大小選項 (512 MB、1024 MB、2048 MB)，預設為 1024 MB。</p>
<p>瞭解區段對效能最佳化至關重要。作為一般指引：</p>
<ul>
<li><p>512 MB 區段：最適合 4-8 GB 記憶體的查詢節點</p></li>
<li><p>1 GB 區段：最適合 8-16 GB 記憶體的查詢節點</p></li>
<li><p>2 GB 區段：建議使用 &gt;16 GB 記憶體的查詢節點</p></li>
</ul>
<p>開發人員洞察力：較少、較大的區段通常可提供更快的搜尋效能。對於大規模部署，2 GB 區段通常能在記憶體效率和查詢速度之間取得最佳平衡。</p>
<h2 id="Message-Queue-System-Selection" class="common-anchor-header">訊息佇列系統選擇<button data-href="#Message-Queue-System-Selection" class="anchor-icon" translate="no">
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
    </button></h2><p>選擇 Pulsar 或 Kafka 作為您的訊息傳送系統：</p>
<ul>
<li><p><strong>Pulsar</strong>：推薦用於新專案，因為每個主題的開銷較低，且具有較佳的擴充性</p></li>
<li><p><strong>Kafka</strong>：如果您的組織已經有 Kafka 專業知識或基礎架構，可能會更適合。</p></li>
</ul>
<h2 id="Enterprise-Optimizations-in-Zilliz-Cloud" class="common-anchor-header">Zilliz Cloud 中的企業優化<button data-href="#Enterprise-Optimizations-in-Zilliz-Cloud" class="anchor-icon" translate="no">
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
    </button></h2><p>對於有嚴格效能要求的生產部署，Zilliz Cloud（Milvus 在雲端上的完整管理和企業版本）在索引和量化方面提供額外的最佳化：</p>
<ul>
<li><p><strong>防止記憶體不足 (OOM)：</strong>精密的記憶體管理可防止記憶體不足而當機</p></li>
<li><p><strong>壓縮最佳化</strong>：改善搜尋效能與資源利用率</p></li>
<li><p><strong>分層儲存</strong>：使用適當的運算單元有效管理冷熱資料</p>
<ul>
<li><p>標準運算單元 (CU) 用於經常存取的資料</p></li>
<li><p>分層儲存單元 (CU)，以符合成本效益的方式儲存很少存取的資料</p></li>
</ul></li>
</ul>
<p>如需詳細的企業規模選項，請造訪<a href="https://docs.zilliz.com/docs/select-zilliz-cloud-service-plans"> Zilliz Cloud 服務計劃文件</a>。</p>
<h2 id="Advanced-Configuration-Tips-for-Developers" class="common-anchor-header">開發人員進階組態提示<button data-href="#Advanced-Configuration-Tips-for-Developers" class="anchor-icon" translate="no">
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
<li><p><strong>多索引類型</strong>：大小調整工具著重於單一索引。對於需要針對各種集合使用不同索引演算法的複雜應用程式，請使用自訂組態建立獨立的集合。</p></li>
<li><p><strong>記憶體分配</strong>：規劃部署時，請同時考慮向量資料和索引的記憶體需求。HNSW 通常需要原始向量資料 2-3 倍的記憶體。</p></li>
<li><p><strong>效能測試</strong>：在確定您的組態之前，請在具有代表性的資料集上對您的特定查詢模式進行基準測試。</p></li>
<li><p><strong>規模考量</strong>：考慮未來成長的因素。一開始使用稍微多一點的資源，比之後重新配置來得容易。</p></li>
</ol>
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
    </button></h2><p><a href="https://milvus.io/tools/sizing/"> Milvus 大小工具</a>為資源規劃提供了絕佳的起點，但請記住每個應用程式都有其獨特的需求。為了獲得最佳效能，您需要根據特定的工作負載特性、查詢模式和擴充需求來微調您的配置。</p>
<p>我們會根據使用者的回饋持續改善我們的工具和說明文件。如果您對 Milvus 部署的大小有任何疑問或需要進一步協助，請聯絡我們在<a href="https://github.com/milvus-io/milvus/discussions"> GitHub</a>或<a href="https://discord.com/invite/8uyFbECzPX"> Discord</a> 上的社群。</p>
<h2 id="References" class="common-anchor-header">參考資料<button data-href="#References" class="anchor-icon" translate="no">
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
<li><p><a href="https://thesequence.substack.com/p/guest-post-choosing-the-right-vector">為您的專案選擇正確的向量索引</a></p></li>
<li><p><a href="https://milvus.io/docs/index.md?tab=floating">記憶體索引 | Milvus 文件</a></p></li>
<li><p><a href="https://zilliz.com/blog/Milvus-introduces-GPU-index-CAGRA">揭開 Milvus CAGRA 的神秘面紗：利用 GPU 索引提升矢量搜尋能力</a></p></li>
<li><p><a href="https://zilliz.com/pricing#estimate_your_cost">Zilliz 雲端定價計算器</a></p></li>
<li><p><a href="https://milvus.io/blog/how-to-get-started-with-milvus.md">如何開始使用 Milvus </a></p></li>
<li><p><a href="https://docs.zilliz.com/docs/resource-planning">Zilliz 雲端資源規劃 | 雲端 | Zilliz 雲端開發者中心</a></p></li>
</ul>
