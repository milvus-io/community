---
id: 2022-08-05-whats-new-in-milvus-2-1.md
title: Milvus 2.1 的新功能 - 邁向簡單與快速
author: Xiaofan Luan
date: 2022-08-05T00:00:00.000Z
desc: 開放原始碼向量資料庫 Milvus 現在在效能與可用性上都有了使用者期待已久的改進。
cover: assets.zilliz.com/What_s_New_in_2_1_2_a0660df2a5.png
tag: News
canonicalUrl: 'https://milvus.io/blog/2022-08-05-whats-new-in-milvus-2-1.md'
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/What_s_New_in_2_1_2_a0660df2a5.png" alt="What's new in Milvus 2.1 - Towards simplicity and speed" class="doc-image" id="what's-new-in-milvus-2.1---towards-simplicity-and-speed" />
   </span> <span class="img-wrapper"> <span>Milvus 2.1 的新功能 - 邁向簡潔與快速</span> </span></p>
<p>經過 Milvus 社群所有貢獻者六個月的努力，我們很高興宣佈 Milvus 2.1 正式<a href="https://milvus.io/docs/v2.1.x/release_notes.md">發行</a>。這個廣受歡迎的向量資料庫的重要迭代強調了<strong>效能</strong>和<strong>可用性</strong>，這是我們最關注的兩個關鍵字。我們新增了對字串、Kafka 訊息佇列和內嵌式 Milvus 的支援，並在效能、擴充性、安全性和可觀察性方面做了許多改進。Milvus 2.1 是一項令人振奮的更新，它將為演算法工程師的筆記型電腦與生產級向量相似性搜尋服務之間的「最後一哩」架起橋樑。</p>
<custom-h1>效能 - 提升 3.2 倍以上</custom-h1><h2 id="5ms-level-latency" class="common-anchor-header">5 毫秒等級的延遲<button data-href="#5ms-level-latency" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 已經支援近似近鄰 (ANN) 搜尋，與傳統的 KNN 方法相比，是一大躍進。然而，吞吐量和延遲的問題仍然是需要處理十億級向量資料檢索情境的使用者所面臨的挑戰。</p>
<p>在 Milvus 2.1 中，有一個新的路由通訊協定，不再依賴檢索連結中的訊息佇列，大幅降低小型資料集的檢索延遲。我們的測試結果顯示，Milvus 現在將其延遲等級降至 5 毫秒，符合相似性搜尋和推薦等關鍵線上連結的要求。</p>
<h2 id="Concurrency-control" class="common-anchor-header">並發控制<button data-href="#Concurrency-control" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.1 透過引進新的成本評估模型和並發排程，微調其並發模型。它現在提供了並發控制，可確保不會有大量的並發請求競爭 CPU 和快取記憶體資源，也不會因為沒有足夠的請求而導致 CPU 利用率不足。Milvus 2.1 中全新的智慧型排程層還會合併具有一致請求參數的小 nq 查詢，在具有小 nq 和高查詢並發的情況下，提供驚人的 3.2 倍效能提升。</p>
<h2 id="In-memory-replicas" class="common-anchor-header">記憶體複製<button data-href="#In-memory-replicas" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.1 帶來了記憶體副本，可提高小型資料集的可擴展性和可用性。類似於傳統資料庫中的唯讀複製，當讀取 QPS 高時，記憶體複製可透過增加機器進行水平擴充。在小型資料集的向量擷取中，推薦系統經常需要提供超過單台機器效能極限的 QPS。現在在這些情況下，透過在記憶體中載入多個複本，可以大幅提升系統的吞吐量。未來，我們還將引入基於記憶體內副本的對沖讀取機制，在系統需要從故障中恢復時，快速請求其他功能副本，充分利用記憶體冗餘來提高系統的整體可用性。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/What_s_New_in_Milvus_2_1_Figure_1_excalidraw_1f7fe3c998.png" alt="In-memory replicas allow query services to be based on separate
copies of the same data." class="doc-image" id="in-memory-replicas-allow-query-services-to-be-based-on-separate-copies-of-the-same-data." />
   </span> <span class="img-wrapper"> <span>記憶體內副本允許查詢服務基於相同資料的不同副本</span>。 </span></p>
<h2 id="Faster-data-loading" class="common-anchor-header">更快的資料載入<button data-href="#Faster-data-loading" class="anchor-icon" translate="no">
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
    </button></h2><p>最後一項效能提升來自資料載入。Milvus 2.1 現在使用 Zstandard (zstd) 來壓縮<a href="https://milvus.io/docs/v2.1.x/glossary.md#Log-snapshot">二進位日誌</a>，大幅減少物件與訊息儲存區的資料大小，以及資料載入時的網路開銷。此外，現在還引入了 goroutine pool，因此 Milvus 可以在控制記憶體佔用量的情況下同時載入網段，並將故障恢復和載入資料所需的時間降至最低。</p>
<p>Milvus 2.1 的完整基準結果即將在我們的網站上發佈。敬請期待。</p>
<h2 id="String-and-scalar-index-support" class="common-anchor-header">支援字串與標量索引<button data-href="#String-and-scalar-index-support" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.1 現在支援變長字串 (VARCHAR) 作為標量資料類型。VARCHAR 可用作可作為輸出回傳的主索引鍵，也可作為屬性篩選器。<a href="https://milvus.io/docs/v2.1.x/hybridsearch.md">屬性篩選</a>是 Milvus 使用者最常需要的功能之一。如果您經常發現自己想要「尋找與使用者最相似的<span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mo>200-200</mo></mrow><annotation encoding="application/x-tex">-</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.7278em;vertical-align:-0.0833em;"></span><span class="mord">200-300</span></span></span></span>價格區間的產品」，或是「尋找關鍵字為「向量資料庫」且與雲原生主題相關的文章」，您一定會喜歡 Milvus 2.1。</p>
<p>Milvus 2.1 也支援標量倒轉索引，以<a href="https://www.cs.le.ac.uk/people/ond1/XMLcomp/confersWEA06_LOUDS.pdf">簡潔的</a><a href="https://github.com/s-yata/marisa-trie">MARISA-Tries</a>為資料結構，提高篩選速度。現在，所有資料都能以非常低的佔用空間載入記憶體，這使得字串的比對、篩選和前綴匹配速度大大加快。我們的測試結果顯示，MARISA-trie 的記憶體需求僅為 Python 字典的 10%，即可將所有資料載入記憶體，並提供查詢功能。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/What_s_new_in_Milvus_Figure_2_excalidraw_a1149aca96.png" alt="Milvus 2.1 combines MARISA-Trie with inverted index to significantly improve filtering speed." class="doc-image" id="milvus-2.1-combines-marisa-trie-with-inverted-index-to-significantly-improve-filtering-speed." />
   </span> <span class="img-wrapper"> <span>Milvus 2.1 將 MARISA-Trie 與倒排索引結合，大幅提升篩選速度。</span> </span></p>
<p>未來，Milvus 將繼續專注於標量查詢相關的開發，支援更多標量索引類型和查詢運算符，並提供基於磁碟的標量查詢功能，這些都是為了降低標量資料的儲存和使用成本而持續努力的一部分。</p>
<custom-h1>可用性改進</custom-h1><h2 id="Kafka-support" class="common-anchor-header">Kafka 支援<button data-href="#Kafka-support" class="anchor-icon" translate="no">
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
    </button></h2><p>我們的社群長久以來一直要求在 Milvus 中支援<a href="https://kafka.apache.org">Apache Kafka</a> <a href="https://milvus.io/docs/v2.1.x/deploy_pulsar.md">作為訊息儲存空間</a>，Milvus 2.1 現在提供您依據使用者配置使用<a href="https://pulsar.apache.org">Pulsar</a>或 Kafka 作為訊息儲存空間的選擇，這要歸功於 Milvus 的抽象與封裝設計，以及 Confluent 所貢獻的 Go Kafka SDK。</p>
<h2 id="Production-ready-Java-SDK" class="common-anchor-header">生產就緒的 Java SDK<button data-href="#Production-ready-Java-SDK" class="anchor-icon" translate="no">
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
    </button></h2><p>隨著 Milvus 2.1 的推出，我們的<a href="https://github.com/milvus-io/milvus-sdk-java">Java SDK</a>也正式發行。Java SDK 具備與 Python SDK 完全相同的功能，甚至有更好的並發效能。下一步，我們的社群貢獻者將逐步完善 Java SDK 的說明文件和使用案例，並協助將 Go 和 RESTful SDK 也推入生產就緒的階段。</p>
<h2 id="Observability-and-maintainability" class="common-anchor-header">可觀察性與可維護性<button data-href="#Observability-and-maintainability" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.1 增加了重要的監控<a href="https://milvus.io/docs/v2.1.x/metrics_dashboard.md">指標</a>，例如向量插入次數、搜尋延遲/吞吐量、節點記憶體開銷和 CPU 開銷。此外，新版本還透過調整日誌層級和減少無用的日誌列印，大幅優化日誌保存。</p>
<h2 id="Embedded-Milvus" class="common-anchor-header">嵌入式 Milvus<button data-href="#Embedded-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 大幅簡化了大規模海量向量資料檢索服務的部署，但對於想要在較小規模上驗證演算法的科學家而言，Docker 或 K8s 仍然太過不必要的複雜。隨著<a href="https://github.com/milvus-io/embd-milvus">嵌入式 Milvus</a> 的推出，現在您可以使用 pip 安裝 Milvus，就像安裝 Pyrocksb 和 Pysqlite 一樣。嵌入式 Milvus 支援集群版和獨立版的所有功能，讓您可以輕鬆地從筆記型電腦切換到分散式生產環境，而不需變更任何程式碼。演算法工程師在使用 Milvus 建立原型時，將會有更好的體驗。</p>
<custom-h1>立即試用開箱即用的向量搜尋</custom-h1><p>此外，Milvus 2.1 在穩定性和可擴展性方面也有一些很大的改進，我們期待您的使用和反饋。</p>
<h2 id="Whats-next" class="common-anchor-header">下一步<button data-href="#Whats-next" class="anchor-icon" translate="no">
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
<li>有關 Milvus 2.1 的所有變更，請參閱詳細的「<a href="https://milvus.io/docs/v2.1.x/release_notes.md">發行記錄」</a>。</li>
<li><a href="https://milvus.io/docs/v2.1.x/install_standalone-docker.md">安裝</a>Milvus 2.1 並試用新功能</li>
<li>加入我們的<a href="https://slack.milvus.io/">Slack 社群</a>，與全球數以千計的 Milvus 使用者討論新功能。</li>
<li>在<a href="https://twitter.com/milvusio">Twitter</a>和<a href="https://www.linkedin.com/company/the-milvus-project">LinkedIn</a>上關注我們，當我們關於特定新功能的博客發布後，您就可以獲得更新。</li>
</ul>
<blockquote>
<p>編輯：<a href="https://github.com/songxianj">江松賢</a></p>
</blockquote>
