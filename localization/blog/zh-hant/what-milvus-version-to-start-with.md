---
id: what-milvus-version-to-start-with.md
title: 從哪個 Milvus 版本開始
author: Chris Churilo
date: 2024-02-19T00:00:00.000Z
desc: 各版本 Milvus 功能與性能的全面指南，為您的向量搜尋專案做出明智的決定。
cover: assets.zilliz.com/which_milvus_to_start_4a4250e314.jpeg
tag: Engineering
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Vector Management
recommend: true
canonicalUrl: 'https://milvus.io/blog/what-milvus-version-to-start-with.md'
---
<custom-h1>Milvus 版本介紹</custom-h1><p>選擇適當的Milvus版本是任何利用向量搜尋技術的專案成功的關鍵。不同的Milvus版本針對不同的需求而量身定做，了解選擇正確版本的重要性對達成預期的結果至關重要。</p>
<p>正確的 Milvus 版本可以幫助開發人員快速學習和建立原型，或幫助優化資源利用率、簡化開發工作，並確保與現有基礎設施和工具的相容性。最終，這是關於保持開發人員的生產力，提高效率、可靠性和用戶滿意度。</p>
<h2 id="Available-Milvus-versions" class="common-anchor-header">可用的 Milvus 版本<button data-href="#Available-Milvus-versions" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 有三個版本可供開發人員使用，而且都是開放原始碼。這三個版本分別是 Milvus Lite、Milvus Standalone 和 Milvus Cluster，它們的功能以及使用者計劃在短期和長期使用 Milvus 的方式各不相同。因此，讓我們逐一探討。</p>
<h2 id="Milvus-Lite" class="common-anchor-header">Milvus Lite<button data-href="#Milvus-Lite" class="anchor-icon" translate="no">
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
    </button></h2><p>顧名思義，Milvus Lite 是與 Google Colab 和 Jupyter Notebook 無縫整合的輕量級版本。它包裝成單一的二進位檔，沒有額外的相依性，因此可以輕鬆安裝並在您的機器上執行，或嵌入到 Python 應用程式中。此外，Milvus Lite 包含基於 CLI 的 Milvus 獨立伺服器，提供直接在您的機器上執行的彈性。無論您是將其嵌入 Python 程式碼中，還是將其作為獨立伺服器使用，完全取決於您的偏好和特定應用程式需求。</p>
<h3 id="Features-and-Capabilities" class="common-anchor-header">特色與功能</h3><p>Milvus Lite 包含 Milvus 所有核心向量搜尋功能。</p>
<ul>
<li><p><strong>搜尋功能</strong>：支援 top-k、range 及混合搜尋，包括 metadata 過濾，以迎合不同的搜尋需求。</p></li>
<li><p><strong>索引類型與相似度指標</strong>：提供 11 種索引類型與 5 種相似度指標的支援，針對您的特定使用個案提供彈性與客製化選項。</p></li>
<li><p><strong>資料處理</strong>：支援批次 (Apache Parquet、陣列、JSON) 及串流處理，並透過 Airbyte、Apache Kafka 及 Apache Spark 的連接器進行無縫整合。</p></li>
<li><p><strong>CRUD 操作</strong>：提供完整的 CRUD 支援 (建立、讀取、更新/上傳、刪除)，讓使用者擁有全面的資料管理能力。</p></li>
</ul>
<h3 id="Applications-and-limitations" class="common-anchor-header">應用與限制</h3><p>Milvus Lite 是快速原型設計與本機開發的理想選擇，可在您的機器上提供快速設定與小規模資料集的實驗支援。然而，當轉換到具有較大資料集和較嚴苛基礎架構需求的生產環境時，它的限制就顯而易見了。因此，雖然 Milvus Lite 是初步探索和測試的絕佳工具，但它可能不適合在大量或生產就緒的環境中部署應用程式。</p>
<h3 id="Available-Resources" class="common-anchor-header">可用資源</h3><ul>
<li><p><a href="https://milvus.io/docs/milvus_lite.md">說明文件</a></p></li>
<li><p><a href="https://github.com/milvus-io/milvus-lite/">Github 儲存庫</a></p></li>
<li><p><a href="https://github.com/milvus-io/milvus-lite/tree/main/examples">Google Colab 範例</a></p></li>
<li><p><a href="https://www.youtube.com/watch?v=IgJdrGiB5ZY">入門影片</a></p></li>
</ul>
<h2 id="Milvus-Standalone" class="common-anchor-header">Milvus 單機版<button data-href="#Milvus-Standalone" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 提供兩種運作模式：Standalone 和 Cluster。這兩種模式的核心向量資料庫功能相同，但在資料大小支援和可擴展性要求上有所不同。此區別可讓您選擇最符合您的資料集大小、流量及其他生產基礎架構需求的模式。</p>
<p>Milvus Standalone 是 Milvus 向量資料庫系統的一種運作模式，它以單一實例獨立運作，沒有任何集群或分散式設定。在此模式下，Milvus 在單一伺服器或機器上執行，提供索引和向量搜尋等功能。它適用於資料和流量規模相對較小，且不需要集群設定所提供的分散式功能的情況。</p>
<h3 id="Features-and-Capabilities" class="common-anchor-header">功能與能力</h3><ul>
<li><p><strong>高效能</strong>：在海量資料集（數以十億計或更多）上進行向量搜尋，速度快、效率高。</p></li>
<li><p><strong>搜尋功能</strong>：支援 top-k、range 及混合搜尋，包括 metadata 過濾，以滿足各種不同的搜尋需求。</p></li>
<li><p><strong>索引類型與相似度指標</strong>：支援 11 種索引類型與 5 種類似度指標，可針對您的特定使用個案提供彈性與客製化選項。</p></li>
<li><p><strong>資料處理</strong>：支援批次（Apache Parquet、Arrays、Json）及串流處理，並透過 Airbyte、Apache Kafka 及 Apache Spark 的連接器進行無縫整合。</p></li>
<li><p><strong>可擴充性</strong>：透過元件層級的擴充，實現動態可擴充性功能，可根據需求無縫地向上或向下擴充。Milvus 可在元件層級自動擴充，優化資源分配以提升效率。</p></li>
<li><p><strong>多租戶</strong>：支援多租用功能，可在一個群集中管理多達 10,000 個集合/分區，為不同使用者或應用程式提供有效的資源運用與隔離。</p></li>
<li><p><strong>CRUD 作業</strong>：提供完整的 CRUD 支援 (建立、讀取、更新/上傳、刪除)，讓使用者擁有全面的資料管理能力。</p></li>
</ul>
<h3 id="Essential-components" class="common-anchor-header">基本元件：</h3><ul>
<li><p>Milvus: 核心功能元件。</p></li>
<li><p>etcd：元資料引擎，負責存取和儲存 Milvus 內部元件的元資料，包括代理、索引節點等。</p></li>
<li><p>MinIO: 儲存引擎，負責 Milvus 內的資料持久化。</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Screenshot_2024_02_19_at_4_16_41_PM_5e635586a7.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>圖 1：Milvus 獨立架構</p>
<h3 id="Available-Resources" class="common-anchor-header">可用資源</h3><ul>
<li><p>說明文件</p>
<ul>
<li><p><a href="https://milvus.io/docs/prerequisite-docker.md">使用 Docker Compose 安裝 Milvus 的環境清單</a></p></li>
<li><p><a href="https://milvus.io/docs/install_standalone-docker.md">使用 Docker 安裝 Milvus Standalone</a></p></li>
</ul></li>
<li><p><a href="https://github.com/milvus-io/milvus">Github 儲存庫</a></p></li>
</ul>
<h2 id="Milvus-Cluster" class="common-anchor-header">Milvus 集群<button data-href="#Milvus-Cluster" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus Cluster 是 Milvus 向量資料庫系統的一種運作模式，它分散在多個節點或伺服器上運作。在此模式下，Milvus 實例集群在一起，形成一個統一的系統，與獨立設定相比，可以處理更大量的資料和更高的流量負載。Milvus Cluster 提供可擴展性、容錯和負載平衡功能，使其適用於需要處理大量資料和有效服務多個並發查詢的場景。</p>
<h3 id="Features-and-Capabilities" class="common-anchor-header">功能與能力</h3><ul>
<li><p>繼承 Milvus Standalone 的所有功能，包括高效能向量搜尋、支援多種索引類型和相似度指標，以及與批次和串流處理框架的無縫整合。</p></li>
<li><p>利用分散式運算和多節點負載平衡，提供無與倫比的可用性、效能和成本最佳化。</p></li>
<li><p>透過有效利用整個群集的資源，並根據工作負載需求最佳化資源分配，以較低的總成本部署和擴充安全的企業級工作負載。</p></li>
</ul>
<h3 id="Essential-components" class="common-anchor-header">基本元件：</h3><p>Milvus Cluster 包含八個微服務元件和三個第三方依賴元件。所有微服務都可以獨立部署在 Kubernetes 上。</p>
<h4 id="Microservice-components" class="common-anchor-header">微服務元件</h4><ul>
<li><p>根協定</p></li>
<li><p>代理</p></li>
<li><p>查詢協定</p></li>
<li><p>查詢節點</p></li>
<li><p>索引協定</p></li>
<li><p>索引節點</p></li>
<li><p>資料節點</p></li>
<li><p>資料節點</p></li>
</ul>
<h4 id="Third-party-dependencies" class="common-anchor-header">第三方依賴</h4><ul>
<li><p>etcd：儲存群集中各種元件的元資料。</p></li>
<li><p>MinIO：負責群集中大型檔案的資料持久化，例如索引和二進位記錄檔。</p></li>
<li><p>Pulsar：管理最近突變作業的日誌，輸出串流日誌，並提供日誌發佈-訂閱服務。</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Screenshot_2024_02_19_at_4_18_01_PM_88971280ed.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>圖 2：Milvus 叢集架構</p>
<h4 id="Available-Resources" class="common-anchor-header">可用資源</h4><ul>
<li><p><a href="https://milvus.io/docs/install_cluster-milvusoperator.md">說明文件</a>| 如何開始</p>
<ul>
<li><p><a href="https://milvus.io/docs/install_cluster-milvusoperator.md">使用 Milvus Operator 安裝 Milvus Cluster</a></p></li>
<li><p><a href="https://milvus.io/docs/install_cluster-helm.md">使用 Helm 安裝 Milvus Cluster</a></p></li>
<li><p><a href="https://milvus.io/docs/scaleout.md">如何擴充 Milvus Cluster</a></p></li>
</ul></li>
<li><p><a href="https://github.com/milvus-io/milvus">Github 儲存庫</a></p></li>
</ul>
<h2 id="Making-the-Decision-on-which-Milvus-version-to-use" class="common-anchor-header">決定使用哪個版本的 Milvus<button data-href="#Making-the-Decision-on-which-Milvus-version-to-use" class="anchor-icon" translate="no">
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
    </button></h2><p>當決定在您的專案中使用哪個版本的 Milvus 時，您必須考慮的因素包括您的資料集大小、流量、可擴展性需求，以及生產環境限制。Milvus Lite 非常適合在您的筆記型電腦上進行原型開發。Milvus Standalone 提供高效能與彈性，可在您的資料集上進行向量搜尋，適合較小規模的部署、CI/CD，以及沒有 Kubernetes 支援時的離線部署......最後，Milvus Cluster 為企業級工作負載提供無與倫比的可用性、可擴充性與成本最佳化，是大規模、高可用性生產環境的首選。</p>
<p>還有另一個省心的版本，那就是 Milvus 的管理版本，稱為<a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a>。</p>
<p>最終，Milvus 版本取決於您的特定使用個案、基礎架構需求和長期目標。透過仔細評估這些因素，並瞭解每個版本的特色與功能，您就能做出符合專案需求與目標的明智決策。無論您選擇 Milvus Standalone 或 Milvus Cluster，您都可以利用向量資料庫的強大功能來提升 AI 應用程式的效能與效率。</p>
