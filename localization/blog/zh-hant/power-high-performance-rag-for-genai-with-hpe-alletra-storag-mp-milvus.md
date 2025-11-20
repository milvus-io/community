---
id: power-high-performance-rag-for-genai-with-hpe-alletra-storag-mp-milvus.md
title: 利用 HPE Alletra Storage MP + Milvus 為 GenAI 的高效能 RAG 提供動力
author: Denise Ochoa-Mendoza
date: 2025-11-10T00:00:00.000Z
cover: assets.zilliz.com/hpe_cover_ead19ff709.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus, HPE, Alletra Storage MP X10000, vector database, RAG'
meta_title: Optimized RAG with HPE Alletra Storage MP X10000 + Milvus
desc: >-
  利用 HPE Alletra Storage MP X10000 和 Milvus 提升
  GenAI。取得可擴充、低延遲向量搜尋及企業級儲存設備，以達到快速、安全的 RAG。
origin: >-
  https://community.hpe.com/t5/around-the-storage-block/power-high-performance-rag-for-genai-with-hpe-alletra-storage-mp/ba-p/7257369
---
<p><em>本文章最初發表於<a href="https://community.hpe.com/t5/around-the-storage-block/power-high-performance-rag-for-genai-with-hpe-alletra-storage-mp/ba-p/7257369">HPE Community</a>，並經允許在此轉載。</em></p>
<p>HPE Alletra Storage MP X10000 和 Milvus 為可擴充、低延遲的 RAG 提供動力，讓 LLM 能夠以高效能向量搜尋為 GenAI 工作負載提供精確、內容豐富的回應。</p>
<h2 id="In-generative-AI-RAG-needs-more-than-just-an-LLM" class="common-anchor-header">在生成式人工智能中，RAG 需要的不僅僅是 LLM<button data-href="#In-generative-AI-RAG-needs-more-than-just-an-LLM" class="anchor-icon" translate="no">
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
    </button></h2><p>上下文可釋放生成式人工智能 (GenAI) 和大型語言模型 (LLM) 的真正威力。當 LLM 有正確的訊號來定位其回應時，它就能提供準確、相關且值得信賴的答案。</p>
<p>您可以這樣想：如果您被丟進一個茂密的叢林，帶著 GPS 裝置但沒有衛星訊號。螢幕上會顯示地圖，但沒有您目前的位置，對於導航毫無用處。相反地，衛星訊號強大的 GPS 不僅會顯示地圖，還會提供您轉彎導航。</p>
<p>這就是檢索增強生成 (RAG) 對 LLM 的作用。模型已經有了地圖（其預先訓練的知識），但沒有方向（您的特定領域資料）。沒有 RAG 的 LLM 就像 GPS 裝置一樣，充滿了知識卻沒有即時方向。RAG 提供訊號，告訴模型它在哪裡以及該往哪裡去。</p>
<p>RAG 將模型的回應建立在可信賴的最新知識上，這些知識來自您自己的特定領域內容，包括政策、產品文件、票據、PDF、程式碼、語音檔案、圖片等。要讓 RAG 在大規模下運作是相當具有挑戰性的。擷取程序需要有足夠的速度以保持使用者體驗的順暢、精確度以傳回最相關的資訊，而且即使系統負載過重也能預測。這意味著要在不降低性能的情況下處理大量查詢、持續資料擷取以及索引建置等背景工作。使用少量 PDF 開發 RAG 管道相對簡單。但是，當擴展到數百個 PDF 時，就顯得更具挑戰性。您不可能將所有東西都儲存在記憶體中，因此強大且有效率的儲存策略對於管理嵌入、索引和擷取效能是非常重要的。RAG 需要一個向量資料庫和一個儲存層，才能隨著並發量和資料量的成長而保持同步。</p>
<h2 id="Vector-databases-power-RAG" class="common-anchor-header">向量資料庫為 RAG 提供動力<button data-href="#Vector-databases-power-RAG" class="anchor-icon" translate="no">
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
    </button></h2><p>RAG 的核心是語意搜尋，即透過意義而非精確的關鍵字來尋找資訊。這就是向量資料庫的用武之地。向量資料庫儲存文字、影像和其他非結構性資料的高維嵌入，可進行相似性搜尋，擷取與您的查詢最相關的上下文。Milvus 是一個領先的例子：一個雲原生的開放原始碼向量資料庫，專為十億規模的相似性搜尋而打造。它支援混合搜尋，結合向量類似性、關鍵字與標量篩選器以達到精確度，並提供獨立的運算與儲存擴充，以及 GPU 感知的最佳化加速選項。Milvus 還透過智慧型區段生命週期管理資料，從成長中的區段轉換為封閉的區段，並採用壓縮和多種近似近鄰 (ANN) 索引選項 (例如 HNSW 和 DiskANN)，確保 RAG 等即時 AI 工作負載的效能和可擴充性。</p>
<h2 id="The-hidden-challenge-Storage-throughput--latency" class="common-anchor-header">隱藏的挑戰：儲存容量與延遲<button data-href="#The-hidden-challenge-Storage-throughput--latency" class="anchor-icon" translate="no">
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
    </button></h2><p>向量搜尋工作負載對系統的每個部分都造成壓力。它們要求高併發的擷取，同時維持互動式查詢的低延遲擷取。同時，索引建立、壓縮和資料重新載入等背景作業必須在不中斷即時效能的情況下執行。傳統架構中的許多效能瓶頸都可追溯至儲存。無論是輸入/輸出 (I/O) 限制、元資料查詢延遲或並發限制。為了在規模上提供可預測的即時效能，儲存層必須跟上向量資料庫的需求。</p>
<h2 id="The-storage-foundation-for-high-performance-vector-search" class="common-anchor-header">高效能向量搜尋的儲存基礎<button data-href="#The-storage-foundation-for-high-performance-vector-search" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://www.hpe.com/in/en/alletra-storage-mp-x10000.html">HPE Alletra Storage MP X10000</a>是快閃記憶體最佳化、全 NVMe、相容於 S3 的物件儲存平台，專為規模化即時效能而設計。與傳統以容量為重點的物件儲存不同，HPE Alletra Storage MP X10000 專為向量搜尋等低延遲、高吞吐量工作負載而設計。其日誌結構化的 key-value 引擎和以 extent 為基礎的 metadata 可實現高度平行讀寫，而 GPUDirect RDMA 則提供零複製資料路徑，可降低 CPU 開銷，並加速資料移動至 GPU。此架構支援分離式擴充，讓容量與效能可獨立成長，並包含加密、角色式存取控制 (RBAC)、不變性及資料耐久性等企業級功能。結合其雲端原生設計，HPE Alletra Storage MP X10000 可與 Kubernetes 環境無縫整合，使其成為 Milvus 部署的理想儲存基礎。</p>
<h2 id="HPE-Alletra-Storage-MP-X10000-and-Milvus-A-scalable-foundation-for-RAG" class="common-anchor-header">HPE Alletra Storage MP X10000 與 Milvus：RAG 的可擴充基礎<button data-href="#HPE-Alletra-Storage-MP-X10000-and-Milvus-A-scalable-foundation-for-RAG" class="anchor-icon" translate="no">
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
    </button></h2><p>HPE Alletra Storage MP X10000 與 Milvus 相輔相成，提供快速、可預測且易於擴充的 RAG。圖 1 說明可擴充的 AI 用例與 RAG 管道的架構，顯示部署在容器化環境中的 Milvus 元件如何與 HPE Alletra Storage MP X10000 的高效能物件儲存互動。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_1_Architecture_of_scalable_AI_use_cases_and_RAG_pipeline_using_HPE_Alletra_Storage_MP_X10000_and_Milvus_ed3a87a5ee.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Milvus 將運算與儲存乾淨分離，而 HPE Alletra Storage MP X10000 則提供與向量工作負載同步的高吞吐量、低延遲物件存取。兩者結合，可實現可預測的擴充效能：Milvus 將查詢分散到各個分片，而 HPE Alletra Storage MP X10000 的分數多維擴充功能則可隨著資料與 QPS 的成長，保持延遲一致。簡單來說，您可以在需要時增加所需的容量或效能。操作簡單是另一項優勢：HPE Alletra Storage MP X10000 可從單一儲存桶維持最高效能，省去複雜的分層，而企業功能 (加密、RBAC、不變性、穩健耐用性) 則可支援內部部署或混合部署，並提供強大的資料主權及一致的服務層級目標 (SLO)。</p>
<p>當向量搜尋的規模擴大時，儲存通常會因為擷取、壓縮或擷取速度緩慢而受到指責。有了 HPE Alletra Storage MP X10000 上的 Milvus，這種說法就會改變。該平台的全 NVMe、日誌結構架構和 GPUDirect RDMA 選項可提供一致、超低延遲的物件存取 - 即使在大量並發以及索引建立和重新載入等生命週期作業期間也是如此。實際上，您的 RAG 管道仍是以運算為主，而非以儲存為主。當資料集成長、查詢量激增時，Milvus 會保持反應迅速，同時 HPE Alletra Storage MP X10000 會保留 I/O 空間，以實現可預測的線性擴充能力，而無需重新架構儲存。當 RAG 部署的規模超越最初的概念驗證階段並進入全面生產時，這一點變得尤為重要。</p>
<h2 id="Enterprise-ready-RAG-Scalable-predictable-and-built-for-GenAI" class="common-anchor-header">企業就緒的 RAG：可擴充、可預測，專為 GenAI 打造<button data-href="#Enterprise-ready-RAG-Scalable-predictable-and-built-for-GenAI" class="anchor-icon" translate="no">
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
    </button></h2><p>對於 RAG 和即時 GenAI 工作負載，HPE Alletra Storage MP X10000 與 Milvus 的結合提供了一個未來就緒的基礎，可放心擴充。此整合式解決方案可讓組織建立快速、彈性且安全的智慧型系統，而不會降低效能或可管理性。Milvus 透過模組化擴充提供分散式 GPU 加速向量搜尋，而 HPE Alletra Storage MP X10000 則可確保超快速、低延遲的物件存取，並提供企業級的耐用性與生命週期管理。兩者結合，可將計算與儲存分離，即使資料量和查詢複雜度增加，也能實現可預測的效能。無論您是提供即時推薦、強化語意搜尋功能，或是橫跨數十億個向量進行擴充，此架構都能讓您的 RAG 管道保持反應迅速、具成本效益，並達到雲端最佳化。透過與 Kubernetes 及 HPE GreenLake Cloud 的無縫整合，您可獲得統一管理、基於消耗的定價，以及在混合或私有雲環境中部署的彈性。HPE Alletra Storage MP X10000 與 Milvus：針對現代 GenAI 需求打造的可擴充、高效能 RAG 解決方案。</p>
