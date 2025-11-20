---
id: >-
  unlocking-8×-milvus-performance-with-cloudian-hyperstore-and-nvidia-rdma-for-s3-storage.md
title: 利用 Cloudian HyperStore 和 NVIDIA RDMA 為 S3 儲存解鎖 8 倍 Milvus 效能
author: Jon Toor
date: 2025-11-17T00:00:00.000Z
cover: assets.zilliz.com/cloudian_931ffc8646.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Cloudian, NVIDIA, RDMA for S3-compatible storage, Milvus'
meta_title: 8× Milvus Boost with Cloudian HyperStore and NVIDIA RDMA
desc: Cloudian 與 NVIDIA 推出適用於 S3 相容儲存設備的 RDMA，以低延遲加速 AI 工作負載，並使 Milvus 的效能提升 8 倍。
origin: >-
  https://cloudian.com/blog/cloudian-deploys-new-nvidia-rdma-for-s3-compatible-storage-a-game-changer-for-ai-storage-performance/
---
<p><em>本文章最初發表於<a href="https://cloudian.com/blog/cloudian-deploys-new-nvidia-rdma-for-s3-compatible-storage-a-game-changer-for-ai-storage-performance/">Cloudian</a>網站，並經許可轉載於此。</em></p>
<p>Cloudian 與 NVIDIA 合作，利用其 13 年以上的 S3 API 實作經驗，在其 HyperStore® 解決方案中加入對 S3 相容儲存的 RDMA 支援。Cloudian 是一個以 S3-API 為基礎、具備平行處理架構的平台，在貢獻並利用此技術的發展上，Cloudian 擁有獨特的優勢。此次合作充分利用了 Cloudian 在物件儲存協定方面的深厚專業知識，以及 NVIDIA 在運算與網路加速方面的領導地位，創造出將高效能運算與企業級儲存無縫整合的解決方案。</p>
<p>NVIDIA 宣佈 S3 相容的 RDMA 儲存 (Remote Direct Memory Access) 技術即將全面上市，標誌著 AI 基礎架構演進的重要里程碑。這項突破性技術有望改變企業處理現代 AI 工作負載的大量資料需求的方式，提供前所未有的效能改善，同時維持 S3 相容物件儲存的擴充性與簡易性，這也是 S3 相容物件儲存成為雲端運算基礎的原因。</p>
<h2 id="What-is-RDMA-for-S3-compatible-storage" class="common-anchor-header">什麼是 S3 相容儲存的 RDMA？<button data-href="#What-is-RDMA-for-S3-compatible-storage" class="anchor-icon" translate="no">
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
    </button></h2><p>這次推出的 RDMA 代表儲存系統與 AI 加速器通訊方式的根本性進步。這項技術可讓 S3 API 相容物件儲存與 GPU 記憶體之間直接進行資料傳輸，完全繞過傳統以 CPU 為中介的資料路徑。傳統的儲存架構會透過 CPU 和系統記憶體進行所有資料傳輸，造成瓶頸和延遲，而適用於 S3 相容儲存的 RDMA 則不同，可建立從儲存到 GPU 的直接高速公路。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/RDMA_for_S3_compatible_storage_18fdd69d02.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>此技術的核心是透過直接通路消除中間步驟，以減少延遲、大幅降低 CPU 處理需求，並顯著降低功耗。因此，儲存系統能夠以現代 GPU 所需的速度提供資料，滿足嚴苛的 AI 應用需求。</p>
<p>這項技術在增加高效能資料路徑的同時，也保持了與無所不在的 S3 API 的相容性。指令仍透過基於標準 S3-API 的儲存通訊協定發出，但實際資料傳輸是透過 RDMA 直接傳輸至 GPU 記憶體，完全繞過 CPU 並消除 TCP 通訊協定處理的開銷。</p>
<h2 id="Breakthrough-Performance-Results" class="common-anchor-header">突破性的效能結果<button data-href="#Breakthrough-Performance-Results" class="anchor-icon" translate="no">
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
    </button></h2><p>RDMA 為 S3 相容的儲存設備帶來的效能改善簡直是翻天覆地。實際測試證明，這項技術能夠消除限制人工智能工作負載的儲存 I/O 瓶頸。</p>
<h3 id="Dramatic-Speed-Improvements" class="common-anchor-header">速度大幅提升：</h3><ul>
<li><p>測得<strong>每個節點的吞吐量</strong>(讀取) 為<strong>35 GB/秒</strong>，在群集間具有線性擴充能力</p></li>
<li><p>透過 Cloudian 的平行處理架構<strong>，可擴充至 TBs/秒</strong></p></li>
<li><p>與傳統 TCP 型物件儲存相比，<strong>吞吐量提升 3-5 倍</strong></p></li>
</ul>
<h3 id="Resource-Efficiency-Gains" class="common-anchor-header">資源效率提升：</h3><ul>
<li><p>透過建立直接到 GPU 的資料通路，<strong>CPU 使用率降低 90</strong></p></li>
<li><p>消除瓶頸，<strong>提高 GPU 利用率</strong></p></li>
<li><p>透過減少處理開銷，大幅降低功耗</p></li>
<li><p>降低 AI 儲存的成本</p></li>
</ul>
<h3 id="8X-Performance-Boost-on-Milvus-by-Zilliz-Vector-DB" class="common-anchor-header">透過 Zilliz 向量 DB 在 Milvus 上提升 8 倍效能</h3><p>這些效能提升在向量資料庫作業中尤其明顯，Cloudian 與 Zilliz 合作使用<a href="https://developer.nvidia.com/cuvs">NVIDIA cuVS</a>與<a href="https://www.nvidia.com/en-us/data-center/l40s/">NVIDIA L40S GPU</a>，與基於 CPU 的系統和基於 TCP 的資料傳輸相比，<strong>Milvus 作業的效能提升了 8 倍</strong>。這代表著從儲存成為限制到儲存使 AI 應用發揮全部潛力的根本性轉變。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/vector_indexing_time_354bdd4b46.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Why-S3-API-based-Object-Storage-for-AI-Workloads" class="common-anchor-header">為什麼 AI 工作負載需要基於 S3 API 的物件儲存？<button data-href="#Why-S3-API-based-Object-Storage-for-AI-Workloads" class="anchor-icon" translate="no">
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
    </button></h2><p>RDMA 技術與物件儲存架構的融合為人工智慧基礎架構創造了理想的基礎，解決了限制傳統儲存方法的多項挑戰。</p>
<p><strong>針對人工智慧資料爆炸的 Exabyte 可擴充性：</strong>人工智能工作負載，尤其是那些涉及合成與多模式資料的工作負載，正將儲存需求推向 100 PB 以上的範圍。物件儲存的平面位址空間可從 PB 級無縫擴充至 exB 級，可容納指數級成長的人工智慧訓練資料集，而不會受到檔案型系統的層級限制。</p>
<p><strong>完整 AI 工作流程的統一平台：</strong>現代人工智慧作業跨越資料擷取、清潔、訓練、檢查點和推理，每個作業都有不同的效能和容量需求。與 S3 相容的物件儲存可透過一致的 API 存取支援整個範圍，消除管理多重儲存層的複雜性與成本。訓練資料、模型、檢查點檔案和推理資料集都可以存放在單一的高效能資料湖中。</p>
<p><strong>豐富的 AI 作業元資料：</strong>關鍵的 AI 作業，例如搜尋和枚举，基本上都是由元資料驅動的。物件儲存的豐富、可自訂的元資料功能可實現有效率的資料標記、搜尋與管理，這對於在複雜的人工智慧模型訓練與推論工作流程中組織與擷取資料是非常重要的。</p>
<p><strong>經濟與營運優勢：</strong>相容於 S3 的物件儲存利用業界標準的硬體以及容量和效能的獨立擴充，與檔案儲存替代方案相比，總擁有成本可降低 80%。當人工智慧資料集達到企業規模時，此經濟效益變得非常重要。</p>
<p><strong>企業安全性與治理：</strong>與需要核心層級修改的 GPUDirect 實作不同，相容於 S3 儲存的 RDMA 不需要針對特定廠商進行核心修改，可維持系統安全性與法規遵循。在醫療保健和金融等對資料安全性和法規遵循要求極高的領域，這種方法尤其有價值。</p>
<h2 id="The-Road-Ahead" class="common-anchor-header">前進之路<button data-href="#The-Road-Ahead" class="anchor-icon" translate="no">
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
    </button></h2><p>NVIDIA 宣佈 RDMA 適用於 S3 相容的儲存設備已全面上市，這不僅是技術上的里程碑，更標誌著 AI 基礎架構的成熟。藉由結合物件儲存的無限擴充能力與 GPU 直接存取的突破性效能，企業終於可以建置出能夠隨其雄心壯志而擴充的 AI 基礎架構。</p>
<p>隨著人工智慧工作負載的複雜度與規模持續成長，RDMA for S3 相容的儲存提供了儲存基礎，讓組織能夠在維持資料主權與操作簡易性的同時，將人工智慧投資發揮到最大。此技術可將儲存從瓶頸轉變為推動力，讓 AI 應用在企業規模上充分發揮潛力。</p>
<p>對於規劃 AI 基礎架構路線圖的組織而言，RDMA for S3 相容儲存設備的全面上市，標誌著儲存效能真正符合現代 AI 工作負載需求的新時代的開始。</p>
<h2 id="Industry-Perspectives" class="common-anchor-header">產業展望<button data-href="#Industry-Perspectives" class="anchor-icon" translate="no">
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
    </button></h2><p>隨著人工智慧日益成為醫療照護服務的核心，我們不斷尋求提升基礎架構的效能與效率。NVIDIA 與 Cloudian 推出的全新 RDMA for S3 相容儲存設備，對於我們的醫療影像分析與診斷 AI 應用而言將至關重要，快速處理大型資料集可直接影響病患照護，同時降低在以 S3-API 為基礎的儲存設備與以 SSD 為基礎的 NAS 儲存設備之間移動資料的成本。  -<em>Swapnil Rane 博士 MD, DNB, PDCC (Nephropath), Mres (TCM), Fellowship in Oncopath, FRCPath 病理學教授 (F), PI, AI/Computational Pathology And Imaging Lab OIC- Department of Digital and Computational Oncology, Tata Memorial Centre</em></p>
<p>"NVIDIA的RDMA for S3相容聲明肯定了我們以Cloudian為基礎的AI基礎架構策略的價值。我們讓組織能夠以規模運行高效能的 AI，同時保留 S3 API 的相容性，讓遷移簡單且應用程式開發成本低。"-<em>Yotta Data Services 聯合創始人、董事總經理兼首席執行官 (CEO) Sunil Gupta</em></p>
<p>"在我們擴展內部部署能力以提供主權 AI 時，NVIDIA 的 RDMA for S3 相容儲存技術與 Cloudian 的高效能物件儲存為我們提供所需的效能，且不會影響資料的暫存性，也不需要任何核心層級的修改。Cloudian HyperStore 平台可讓我們擴充至 exabytes，同時讓我們的敏感 AI 資料完全在我們的控制之下。-<em>Logan Lee，Kakao 執行副總裁暨雲端主管</em></p>
<p>"我們對於 NVIDIA 宣佈即將推出 RDMA for S3 相容的儲存 GA 感到非常興奮。我們使用 Cloudian 進行的測試顯示，向量資料庫作業的效能提升高達 8 倍，這將讓我們的 Milvus by Zilliz 使用者在維持完整資料主權的同時，針對要求嚴苛的 AI 工作負載達到雲端規模的效能。"-<em>Charles Xie，Zilliz 創辦人兼 CEO</em></p>
