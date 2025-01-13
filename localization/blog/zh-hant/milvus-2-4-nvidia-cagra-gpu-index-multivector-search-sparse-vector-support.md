---
id: milvus-2-4-nvidia-cagra-gpu-index-multivector-search-sparse-vector-support.md
title: 揭開 Milvus 2.4 的神秘面紗：多向量搜尋、稀疏向量、CAGRA 索引等！
author: Fendy Feng
date: 2024-3-20
desc: 我們很高興宣布推出 Milvus 2.4，這是強化大規模資料集搜尋能力的一大進步。
metaTitle: 'Milvus 2.4 Supports Multi-vector Search, Sparse Vector, CAGRA, and More!'
cover: assets.zilliz.com/What_is_new_in_Milvus_2_4_1_c580220be3.png
tag: Engineering
tags: >-
  Data science, Database, Tech, Artificial Intelligence, Vector Management,
  Milvus
recommend: true
canonicalUrl: >-
  https://milvus.io/blog/milvus-2-4-nvidia-cagra-gpu-index-multivector-search-sparse-vector-support.md
---
<p>我們很高興宣佈推出 Milvus 2.4，這是強化大規模資料集搜尋能力的一大進步。這個最新版本增加了新功能，例如支援以 GPU 為基礎的 CAGRA 索引、beta 版支援<a href="https://zilliz.com/learn/sparse-and-dense-embeddings">稀疏嵌入</a>、群組搜尋，以及其他各種搜尋功能的改進。這些發展強化了我們對社群的承諾，為像您這樣的開發人員提供強大且有效率的工具來處理和查詢向量資料。讓我們一起了解 Milvus 2.4 的主要優點。</p>
<h2 id="Enabled-Multi-vector-Search-for-Simplified-Multimodal-Searches" class="common-anchor-header">啟用多向量搜尋，簡化多模式搜尋<button data-href="#Enabled-Multi-vector-Search-for-Simplified-Multimodal-Searches" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.4 提供多向量搜尋功能，允許在同一個 Milvus 系統內同時搜尋不同的向量類型並重新排序。此功能可簡化多模式搜尋，大幅提升召回率，並讓開發人員毫不費力地管理具有不同資料類型的複雜 AI 應用程式。此外，此功能還可簡化自訂重排模型的整合與微調，協助建立進階搜尋功能，例如利用多維資料洞察力的精確<a href="https://zilliz.com/vector-database-use-cases/recommender-system">推薦系統</a>。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/How_the_multi_vector_search_feature_works_6c85961349.png" alt="How the Milti-Vector Search Feature Works" class="doc-image" id="how-the-milti-vector-search-feature-works" />
   </span> <span class="img-wrapper"> <span>Milti-Vector 搜尋功能如何運作</span> </span></p>
<p>Milvus 的多向量支援包含兩個部分：</p>
<ol>
<li><p>能夠在一個集合中為單一實體儲存/查詢多個向量，這是一種更自然的資料組織方式</p></li>
<li><p>利用 Milvus 中預先建立的重排演算法，建立/優化重排演算法的能力。</p></li>
</ol>
<p>除了是一項<a href="https://github.com/milvus-io/milvus/issues/25639">需求量</a>極高的<a href="https://github.com/milvus-io/milvus/issues/25639">功能</a>外，我們建立這項功能的原因是，隨著 GPT-4 和 Claude 3 的推出，業界正朝多模組模型邁進。重新排序是一種常用的技術，可進一步改善搜尋的查詢效能。我們的目標是讓開發人員可以輕鬆地在 Milvus 生態系統內建立並最佳化他們的 rerankers。</p>
<h2 id="Grouping-Search-Support-for-Enhanced-Compute-Efficiency" class="common-anchor-header">支援群組搜尋以增強運算效率<button data-href="#Grouping-Search-Support-for-Enhanced-Compute-Efficiency" class="anchor-icon" translate="no">
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
    </button></h2><p>Grouping Search 是我們加入 Milvus 2.4 的另一項常見<a href="https://github.com/milvus-io/milvus/issues/25343">功能</a>。它整合了專為 BOOL、INT 或 VARCHAR 類型欄位所設計的分組 (group-by) 操作，填補了執行大規模分組查詢的重要效率缺口。</p>
<p>傳統上，開發人員需要依賴大量的 Top-K 搜尋，然後以手動後處理來萃取特定群組的結果，這是一種計算密集且程式碼繁重的方法。Grouping Search 將查詢結果有效地連結至集合群組識別碼 (例如文件或影片名稱)，精簡了大型資料集內分割實體的處理程序，從而完善了這個流程。</p>
<p>Milvus 的 Grouping Search 採用基於迭代器的實作方式，在計算效率上比類似技術有顯著的改善。此選擇可確保優異的效能擴充性，尤其是在計算資源最佳化至關重要的生產環境中。透過減少資料遍歷和計算開銷，Milvus 可支援更有效率的查詢處理，與其他向量資料庫相比，可大幅減少回應時間和作業成本。</p>
<p>Grouping Search 加強了 Milvus 管理大量複雜查詢的能力，並符合強大資料管理解決方案的高效能運算實務。</p>
<h2 id="Beta-Support-for-Sparse-Vector-Embeddings" class="common-anchor-header">稀疏向量嵌入的測試版支援<button data-href="#Beta-Support-for-Sparse-Vector-Embeddings" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://zilliz.com/learn/sparse-and-dense-embeddings">稀疏</a>向量<a href="https://zilliz.com/learn/sparse-and-dense-embeddings">嵌入</a>代表著傳統密集向量方法的範式轉變，它迎合了語意相似性的細微差異，而不僅僅是關鍵字頻率。這種差異允許更精細的搜尋能力，與查詢和文件的語意內容緊密結合。稀疏向量模型在資訊檢索和自然語言處理中特別有用，與密集向量模型相比，稀疏向量模型提供了強大的域外搜尋能力和可解釋性。</p>
<p>在 Milvus 2.4 中，我們擴展了混合搜尋功能，以包含由 SPLADEv2 等先進神經模型或 BM25 等統計模型所產生的稀疏嵌入。在 Milvus 中，稀疏向量與稠密向量受到同等對待，因此能夠以稀疏向量場建立集合、插入資料、建立索引，以及執行相似性搜尋。值得注意的是，Milvus 中的稀疏嵌入支持<a href="https://zilliz.com/blog/similarity-metrics-for-vector-search#Inner-Product">Inner Product</a>(IP) 距離度量，由於稀疏嵌入具有高維度的特性，因此具有優勢，這使得其他度量不太有效。這項功能也支援資料類型，其維度為無符號 32 位元整數，而值則為 32 位元浮點數，因此有助於廣泛的應用，從細微的文字搜尋到複雜的<a href="https://zilliz.com/learn/information-retrieval-metrics">資訊檢索</a>系統。</p>
<p>有了這項新功能，Milvus 可提供混合搜尋方法，將關鍵字和嵌入式技術融合在一起，為從以關鍵字為中心的搜尋架構轉換到尋求全面、低維護解決方案的使用者提供無縫過渡。</p>
<p>我們將此功能標示為「Beta 版」，以繼續進行功能的效能測試，並收集社群的意見。稀疏向量支援的一般可用性 (GA) 預計會在 Milvus 3.0 發布時推出。</p>
<h2 id="CAGRA-Index-Support-for-Advanced-GPU-Accelerated-Graph-Indexing" class="common-anchor-header">進階 GPU 加速圖形索引的 CAGRA 索引支援<button data-href="#CAGRA-Index-Support-for-Advanced-GPU-Accelerated-Graph-Indexing" class="anchor-icon" translate="no">
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
    </button></h2><p>由 NVIDIA 所開發的<a href="https://arxiv.org/abs/2308.15136">CAGRA</a>(Cuda Anns GRAph-based) 是一種以 GPU 為基礎的圖索引技術，在效率與效能上大幅超越傳統以 CPU 為基礎的方法 (例如 HNSW 索引)，尤其是在高吞吐量的環境中。</p>
<p>隨著 CAGRA 索引的引入，Milvus 2.4 提供了增強的 GPU 加速圖索引能力。這項強化功能非常適合建立需要最低延遲的相似性搜尋應用程式。此外，Milvus 2.4 整合了 CAGRA 索引的暴力搜尋功能，可在應用程式中達到最高的召回率。如需詳細瞭解，請瀏覽<a href="https://zilliz.com/blog/Milvus-introduces-GPU-index-CAGRA">有關 CAGRA 的介紹部落格</a>。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Milvus_raft_cagra_vs_milvus_hnsw_ffe0415ff5.png" alt="Milvus Raft CAGRA vs. Milvus HNSW" class="doc-image" id="milvus-raft-cagra-vs.-milvus-hnsw" />
   </span> <span class="img-wrapper"> <span>Milvus Raft CAGRA 對比 Milvus HNSW</span> </span></p>
<h2 id="Additional-Enhancements-and-Features" class="common-anchor-header">其他增強功能<button data-href="#Additional-Enhancements-and-Features" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.4 還包含其他重要的增強功能，例如在<a href="https://zilliz.com/blog/metadata-filtering-with-zilliz-cloud-pipelines">元資料篩選中</a>增強子字串匹配的 Regular Expression 支援、用於高效率標量資料類型篩選的全新標量倒置索引，以及用於監控和複製 Milvus 資料集中變更的變更資料擷取工具。這些更新共同提升了 Milvus 的效能與多樣性，使其成為複雜資料作業的全面解決方案。</p>
<p>如需詳細資訊，請參閱<a href="https://milvus.io/docs/release_notes.md">Milvus 2.4 文件</a>。</p>
<h2 id="Stay-Connected" class="common-anchor-header">保持連線！<button data-href="#Stay-Connected" class="anchor-icon" translate="no">
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
    </button></h2><p>想了解更多關於 Milvus 2.4 的資訊嗎？<a href="https://zilliz.com/event/unlocking-advanced-search-capabilities-milvus">加入我們即將舉行的網路研討會</a>，與 Zilliz 的工程副總裁 James Luan 深入討論此最新版本的功能。如果您有任何問題或回饋，請加入我們的<a href="https://discord.com/invite/8uyFbECzPX">Discord 頻道</a>，與我們的工程師和社群成員交流。別忘了在<a href="https://twitter.com/milvusio">Twitter</a>或<a href="https://www.linkedin.com/company/the-milvus-project">LinkedIn</a>上關注我們，以獲得 Milvus 的最新消息和更新。</p>
