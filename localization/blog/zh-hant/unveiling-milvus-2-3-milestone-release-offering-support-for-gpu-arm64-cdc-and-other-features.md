---
id: >-
  unveiling-milvus-2-3-milestone-release-offering-support-for-gpu-arm64-cdc-and-other-features.md
title: 揭開 Milvus 2.3 的神秘面紗：提供 GPU、Arm64、CDC 及其他眾多令人期待的功能支援的里程碑式版本
author: 'Owen Jiao, Fendy Feng'
date: 2023-08-28T00:00:00.000Z
desc: >-
  Milvus 2.3 是一個里程碑式的版本，擁有眾多備受期待的功能，包括支援 GPU、Arm64、upsert、變更資料擷取、ScaNN
  索引和範圍搜尋。它還引入了改進的查詢性能、更強大的負載平衡和調度，以及更好的可觀察性和可操作性。
cover: assets.zilliz.com/Milvus_2_3_Milvus_io_2e3b0eb55c.jpeg
tag: News
tags: >-
  Vector Database, AI, Artificial Intelligence, Machine Learning, Milvus, LLM,
  Large Language Models, Embeddings, Vector search, Vector similarity search
recommend: true
canonicalUrl: >-
  https://milvus.io/blog/unveiling-milvus-2-3-milestone-release-offering-support-for-gpu-arm64-cdc-and-other-features.md
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Milvus_2_3_Milvus_io_2e3b0eb55c.jpeg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>令人興奮的消息！經過八個月的共同努力，我們非常興奮地宣布 Milvus 2.3 正式發行，這個里程碑式的版本帶來了眾多備受期待的功能，包括支援 GPU、Arm64、upsert、變更資料擷取、ScaNN 索引和 MMap 技術。Milvus 2.3 還引入了改進的查詢性能、更強大的負載平衡和調度，以及更好的可觀察性和可操作性。</p>
<p>跟我一起看看這些新功能和增強功能，並學習如何從這個版本中獲益。</p>
<h2 id="Support-for-GPU-index-that-leads-to-3-10-times-faster-in-QPS" class="common-anchor-header">支援 GPU 索引，使 QPS 速度提升 3-10 倍<button data-href="#Support-for-GPU-index-that-leads-to-3-10-times-faster-in-QPS" class="anchor-icon" translate="no">
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
    </button></h2><p>GPU 索引是 Milvus 社群中備受期待的功能。感謝與 Nvidia 工程師的通力合作，Milvus 2.3 已將強大的 RAFT 演算法加入 Milvus 索引引擎 Knowhere，以支援 GPU 索引。有了 GPU 支援，Milvus 2.3 的 QPS 速度比使用 CPU HNSW 索引的舊版本快三倍以上，對於需要大量運算的特定資料集，速度更快近十倍。</p>
<h2 id="Arm64-support-to-accommodate-growing-user-demand" class="common-anchor-header">支援 Arm64 以因應不斷成長的使用者需求<button data-href="#Arm64-support-to-accommodate-growing-user-demand" class="anchor-icon" translate="no">
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
    </button></h2><p>Arm CPU 越來越受雲端供應商和開發人員歡迎。為了滿足這種日益增長的需求，Milvus 現在提供適用於 ARM64 架構的 Docker 映像檔。有了這項新的 CPU 支援，MacOS 使用者可以更順暢地使用 Milvus 建立應用程式。</p>
<h2 id="Upsert-support-for-better-user-experience" class="common-anchor-header">Upsert 支援提供更好的使用者體驗<button data-href="#Upsert-support-for-better-user-experience" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.3 引入了一個值得注意的改進，就是支援 upsert 操作。這項新功能允許使用者無縫更新或插入資料，並授權使用者透過 Upsert 介面在單一要求中執行這兩項作業。此功能可簡化資料管理並提高效率。</p>
<p><strong>注意</strong>：</p>
<ul>
<li>Upsert 功能不適用於自動增加 ID。</li>
<li>Upsert 是以<code translate="no">delete</code> 和<code translate="no">insert</code> 的組合方式實作，可能會造成一些效能損失。如果您在寫入繁重的情況下使用 Milvus，我們建議使用<code translate="no">insert</code> 。</li>
</ul>
<h2 id="Range-search-for-more-accurate-results" class="common-anchor-header">範圍搜尋以獲得更精確的結果<button data-href="#Range-search-for-more-accurate-results" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.3 允許使用者在查詢時指定輸入向量與儲存於 Milvus 的向量之間的距離。之後，Milvus 會返回設定範圍內的所有匹配結果。以下是使用範圍搜尋功能指定搜尋距離的範例。</p>
<pre><code translate="no"><span class="hljs-comment">// add radius and range_filter to params in search_params</span>
search_params = {<span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;nprobe&quot;</span>: <span class="hljs-number">10</span>, <span class="hljs-string">&quot;radius&quot;</span>: <span class="hljs-number">10</span>, <span class="hljs-string">&quot;range_filter&quot;</span> : <span class="hljs-number">20</span>}, <span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;L2&quot;</span>}
res = collection.<span class="hljs-title function_">search</span>(
vectors, <span class="hljs-string">&quot;float_vector&quot;</span>, search_params, topK,
<span class="hljs-string">&quot;int64 &gt; 100&quot;</span>, output_fields=[<span class="hljs-string">&quot;int64&quot;</span>, <span class="hljs-string">&quot;float&quot;</span>]
)
<button class="copy-code-btn"></button></code></pre>
<p>在這個範例中，使用者要求 Milvus 返回與輸入向量相距 10 到 20 個單位範圍內的向量。</p>
<p><strong>注意</strong>：不同的距離指標在計算距離的方式上有所不同，因此會產生不同的值範圍和排序策略。因此，在使用範圍搜尋功能之前，必須先瞭解它們的特性。</p>
<h2 id="ScaNN-index-for-faster-query-speed" class="common-anchor-header">加快查詢速度的 ScaNN 索引<button data-href="#ScaNN-index-for-faster-query-speed" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.3 現在支援 ScaNN 索引，這是由 Google 開發的開放源碼<a href="https://zilliz.com/glossary/anns">近似近鄰 (ANN)</a>索引。ScaNN 索引在各種基準測試中表現優異，比 HNSW 快約 20%，比 IVFFlat 快約 7 倍。有了 ScaNN 索引的支援，Milvus 的查詢速度比舊版本快很多。</p>
<h2 id="Growing-index-for-stable-and-better-query-performance" class="common-anchor-header">成長中的索引提供穩定且更佳的查詢效能<button data-href="#Growing-index-for-stable-and-better-query-performance" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 包含兩類資料：索引資料和串流資料。Milvus 可以使用索引快速搜尋索引資料，但只能逐行粗暴搜尋串流資料，這會影響效能。Milvus 2.3 引入了成長索引 (Growing Index)，可自動為串流資料建立即時索引，以改善查詢效能。</p>
<h2 id="Iterator-for-data-retrieval-in-batches" class="common-anchor-header">分批擷取資料的迭代器<button data-href="#Iterator-for-data-retrieval-in-batches" class="anchor-icon" translate="no">
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
    </button></h2><p>在 Milvus 2.3 中，Pymilvus 引入了迭代器介面，允許使用者在搜尋或範圍搜尋中擷取超過 16,384 個實體。當使用者需要分批匯出數以萬計甚至更多的向量時，這項功能非常方便。</p>
<h2 id="Support-for-MMap-for-increased-capacity" class="common-anchor-header">支援 MMap 以增加容量<button data-href="#Support-for-MMap-for-increased-capacity" class="anchor-icon" translate="no">
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
    </button></h2><p>MMap 是一種 UNIX 系統呼叫，用於將檔案和其他物件映射到記憶體中。Milvus 2.3 支援 MMap，可讓使用者將資料載入本機磁碟並映射至記憶體，從而增加單機容量。</p>
<p>我們的測試結果顯示，使用 MMap 技術，Milvus 可以將資料容量增加一倍，同時將效能衰減限制在 20% 以內。此方法可大幅降低整體成本，對於預算緊縮且不介意犧牲效能的使用者來說，尤其有利。</p>
<h2 id="CDC-support-for-higher-system-availability" class="common-anchor-header">CDC 支援可提高系統可用性<button data-href="#CDC-support-for-higher-system-availability" class="anchor-icon" translate="no">
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
    </button></h2><p>變更資料擷取 (CDC) 是資料庫系統常用的功能，可擷取資料變更並複製至指定目的地。透過 CDC 功能，Milvus 2.3 可讓使用者跨資料中心同步資料、備份增量資料、無縫遷移資料，使系統更具可用性。</p>
<p>除上述功能外，Milvus 2.3 還引入了計數介面，可即時精確計算資料集中儲存的資料行數，支援 Cosine 公制測量向量距離，並對 JSON 陣列進行更多操作。如需更多功能和詳細資訊，請參閱<a href="https://milvus.io/docs/release_notes.md">Milvus 2.3 發行紀錄</a>。</p>
<h2 id="Enhancements-and-bug-fixes" class="common-anchor-header">增強功能與錯誤修正<button data-href="#Enhancements-and-bug-fixes" class="anchor-icon" translate="no">
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
    </button></h2><p>除了新功能之外，Milvus 2.3 還包含許多舊版本的改進與錯誤修正。</p>
<h3 id="Improved-performance-for-data-filtering" class="common-anchor-header">改善資料篩選的效能</h3><p>在混合標量和向量資料查詢中，Milvus 會在向量搜尋之前執行標量篩選，以獲得更精確的結果。然而，如果使用者在標量篩選後篩選出太多資料，索引效能可能會下降。在 Milvus 2.3 中，我們針對這個問題優化了 HNSW 的篩選策略，從而改善了查詢效能。</p>
<h3 id="Increased-multi-core-CPU-usage" class="common-anchor-header">增加多核心 CPU 使用量</h3><p>近似最近搜索 (ANN) 是一項需要大量 CPU 資源的計算密集型任務。在先前的版本中，Milvus 只能使用約 70% 的可用多核心 CPU 資源。然而，在最新版本中，Milvus 克服了這一限制，可以充分利用所有可用的多核 CPU 資源，從而提高了查詢性能，減少了資源浪費。</p>
<h3 id="Refactored-QueryNode" class="common-anchor-header">重構的 QueryNode</h3><p>QueryNode 是 Milvus 負責向量搜尋的重要元件。然而，在舊版本中，QueryNode 有複雜的狀態、重複的訊息佇列、無組織的程式碼結構，以及非直覺的錯誤訊息。</p>
<p>在 Milvus 2.3 中，我們升級了 QueryNode，引入了無狀態的程式碼結構，並移除刪除資料的訊息佇列。這些更新減少了資源浪費，並使向量搜尋更快、更穩定。</p>
<h3 id="Enhanced-message-queues-based-on-NATS" class="common-anchor-header">基於 NATS 的增強型訊息佇列</h3><p>我們在基於日誌的架構上建立 Milvus，在之前的版本中，我們使用 Pulsar 和 Kafka 作為核心日誌中介。然而，這種組合面臨三大挑戰：</p>
<ul>
<li>在多主題情況下不穩定。</li>
<li>閒置時會消耗資源，而且難以重複訊息。</li>
<li>Pulsar 和 Kafka 與 Java 生態系統緊密相連，因此它們的社群很少維護和更新 Go SDK。</li>
</ul>
<p>為了解決這些問題，我們結合了 NATS 和 Bookeeper 作為 Milvus 的新日誌中介，更符合使用者的需求。</p>
<h3 id="Optimized-load-balancer" class="common-anchor-header">優化的負載平衡器</h3><p>Milvus 2.3 採用了更靈活的負載平衡演算法，以系統真實負載為基礎。這種優化的演算法可以讓用戶快速檢測到節點故障和不平衡負載，並據此調整調度。根據我們的測試結果，Milvus 2.3 可以在幾秒鐘內檢測到故障、不平衡負載、節點狀態異常等事件，並迅速做出調整。</p>
<p>有關 Milvus 2.3 的更多資訊，請參閱<a href="https://milvus.io/docs/release_notes.md">Milvus 2.3 發行紀錄</a>。</p>
<h2 id="Tool-upgrades" class="common-anchor-header">工具升級<button data-href="#Tool-upgrades" class="anchor-icon" translate="no">
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
    </button></h2><p>在Milvus 2.3的同時，我們也升級了Birdwatcher和Attu這兩個操作和維護Milvus的重要工具。</p>
<h3 id="Birdwatcher-update" class="common-anchor-header">觀鳥者更新</h3><p>我們升級了 Milvus 的調試工具<a href="https://github.com/milvus-io/birdwatcher">Birdwatcher</a>，引入了許多功能和增強功能，包括</p>
<ul>
<li>RESTful API，可與其他診斷系統無縫整合。</li>
<li>支援 PProf 指令，方便與 Go pprof 工具整合。</li>
<li>儲存使用分析功能。</li>
<li>高效的日誌分析功能。</li>
<li>支援在 etcd 中檢視和修改組態。</li>
</ul>
<h3 id="Attu-update" class="common-anchor-header">Attu 更新</h3><p>我們推出了全新的<a href="https://zilliz.com/attu">Attu</a> 介面，這是一個多合一的向量資料庫管理工具。新介面的設計更直接，也更容易理解。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Attu_s_new_interface_e24dd0d670.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>如需詳細資訊，請參閱<a href="https://milvus.io/docs/release_notes.md">Milvus 2.3 發行紀錄</a>。</p>
<h2 id="Let’s-keep-in-touch" class="common-anchor-header">讓我們保持聯繫<button data-href="#Let’s-keep-in-touch" class="anchor-icon" translate="no">
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
    </button></h2><p>如果您有任何關於 Milvus 的問題或回饋，請隨時透過<a href="https://twitter.com/milvusio">Twitter</a>或<a href="https://www.linkedin.com/company/the-milvus-project">LinkedIn</a> 與我們聯繫。也歡迎您加入我們的<a href="https://milvus.io/slack/">Slack 頻道</a>，直接與我們的工程師和社群聊天，或查看我們的<a href="https://us02web.zoom.us/meeting/register/tZ0pcO6vrzsuEtVAuGTpNdb6lGnsPBzGfQ1T#/registration">週二辦公時間</a>！</p>
