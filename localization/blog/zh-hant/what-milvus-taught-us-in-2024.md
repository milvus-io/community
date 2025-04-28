---
id: what-milvus-taught-us-in-2024.md
title: Milvus 使用者在 2024 年給我們的啟示
author: Stefan Webb
date: 2025-02-18T00:00:00.000Z
desc: 在我們的 Discord 中查看關於 Milvus 的熱門問題。
cover: assets.zilliz.com/What_Milvus_Users_Taught_Us_in_2024_db63863725.png
tag: Engineering
tags: null
recommend: true
canonicalUrl: 'https://milvus.io/blog/what-milvus-taught-us-in-2024.md'
---
<h2 id="Overview" class="common-anchor-header">概述<button data-href="#Overview" class="anchor-icon" translate="no">
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
    </button></h2><p>當 Milvus 在 2024 年隨著主要版本和蓬勃發展的開放原始碼生態系統而蓬勃發展時，一個隱藏的使用者洞察力寶庫正悄悄地在我們的<a href="https://discord.gg/xwqmFDURcz">Discord</a> 社群中形成。這個社群討論的匯集提供了一個獨特的機會，讓我們可以第一手瞭解使用者所面臨的挑戰。我對這個尚未開發的資源很感興趣，於是開始全面分析這一年來的每個討論主題，尋找可以幫助我們編輯 Milvus 使用者常見問題資源的模式。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/top_image_6bbdbe8caa.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>我的分析揭示了用戶持續尋求指導的三個主要領域：<strong>效能最佳化</strong>、<strong>部署策略</strong>和<strong>資料管理</strong>。使用者經常討論如何針對生產環境微調 Milvus 以及有效追蹤效能指標。當談到部署時，社群致力於選擇適當的部署、選擇最佳的搜尋索引，以及解決分散式設定中的問題。資料管理方面的討論則圍繞服務對服務資料遷移策略以及嵌入模型的選擇。</p>
<p>讓我們詳細檢視這些領域。</p>
<h2 id="Deployment" class="common-anchor-header">部署<button data-href="#Deployment" class="anchor-icon" translate="no">
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
    </button></h2><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/deployment_c951c46339.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Milvus 提供彈性的部署模式，以符合各種使用情況。然而，一些用戶確實發現要找到正確的選擇很有挑戰性，他們希望能放心地認為自己這樣做是 「正確的」。</p>
<h3 id="Which-deployment-type-should-I-choose" class="common-anchor-header">我應該選擇哪一種部署類型？</h3><p>一個很常見的問題是在 Milvus<a href="https://milvus.io/docs/milvus_lite.md">Lite</a>、<a href="https://milvus.io/docs/prerequisite-docker.md">Standalone</a> 和<a href="https://milvus.io/docs/prerequisite-helm.md">Distributed</a> 中選擇哪一種部署方式。答案主要取決於您的向量資料庫需要有多大，以及它將提供多少流量：</p>
<h4 id="Milvus-Lite" class="common-anchor-header">Milvus Lite</h4><p>當您在本機系統上使用幾百萬向量進行原型開發，或為單元測試和 CI/CD 尋找嵌入式向量資料庫時，您可以使用 Milvus Lite。請注意，Milvus Lite 尚未提供一些更進階的功能，例如全文搜尋，但即將推出。</p>
<h4 id="Milvus-Standalone" class="common-anchor-header">Milvus 單機版</h4><p>如果您的系統需要為生產流量提供服務，或者您需要儲存幾百萬到上億個向量，您應該使用 Milvus Standalone，它將 Milvus 的所有元件都打包到單一的 Docker 映像檔中。還有一種變體，只將其持久性儲存 (minio) 和元資料儲存 (etcd) 的相依性分開，成為獨立的映像檔。</p>
<h4 id="Milvus-Distributed" class="common-anchor-header">分散式 Milvus</h4><p>對於提供生產流量的任何較大規模部署，例如以數千 QPS 提供數十億向量，您應該使用 Milvus Distributed。有些使用者可能想要執行離線批次處理，例如，重複資料刪除或記錄連結，未來版本的 Milvus 3.0 將提供更有效率的方式，我們稱之為向量湖。</p>
<h4 id="Fully-Managed-Service" class="common-anchor-header">全面管理服務</h4><p>對於想要專注於應用程式開發而無需擔心 DevOps 的開發人員而言，<a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a>是提供免費層級的完全管理式 Milvus。</p>
<p>詳情請參閱<a href="https://milvus.io/docs/install-overview.md#Choose-the-Right-Deployment-for-Your-Use-Case">「Milvus 部署概述」</a>。</p>
<h3 id="How-much-memory-storage-and-compute-will-I-require" class="common-anchor-header">我需要多少記憶體、儲存和運算？</h3><p>這個問題經常出現，不僅是現有的 Milvus 用戶，還有那些正在考慮 Milvus 是否適合他們應用程式的用戶。部署需要多少記憶體、儲存和運算的確實組合，取決於複雜的互動因素。</p>
<p>向量內嵌因使用的模型而有不同的維度。有些向量搜尋索引完全儲存在記憶體中，有些則將資料儲存在磁碟上。此外，許多搜尋索引能夠儲存嵌入的壓縮 (量化) 副本，而圖形資料結構則需要額外的記憶體。這些只是影響記憶體和儲存的幾個因素。</p>
<h4 id="Milvus-Resource-Sizing-Tool" class="common-anchor-header">Milvus 資源大小工具</h4><p>幸運的是，Zilliz（維護 Milvus 的團隊）建立了<a href="https://milvus.io/tools/sizing">一個資源大小工具</a>，可以很好地回答這個問題。輸入您的向量維度、索引類型、部署選項等等，工具就會估算出不同類型的 Milvus 節點及其相依性所需的 CPU、記憶體和儲存。您的里程可能會有所不同，因此使用您的資料和樣本流量進行實際負載測試是個好主意。</p>
<h3 id="Which-vector-index-or-distance-metric-should-I-choose" class="common-anchor-header">我應該選擇哪個向量索引或距離度量？</h3><p>許多使用者不確定他們應該選擇哪一種索引以及如何設定超參數。首先，您可以選擇 AUTOINDEX，將索引類型的選擇交給 Milvus。但是，如果您希望選擇特定的索引類型，幾個經驗規則提供了一個起點。</p>
<h4 id="In-Memory-Indexes" class="common-anchor-header">記憶體索引</h4><p>您願意花費成本將索引完全放入記憶體中嗎？記憶體索引通常是最快的，但也很昂貴。請參閱<a href="https://milvus.io/docs/index.md?tab=floating">「記憶體內索引」</a>，瞭解 Milvus 支援的<a href="https://milvus.io/docs/index.md?tab=floating">索引</a>清單，以及它們在延遲、記憶體和調用方面的折衷。</p>
<p>請記住，您的索引大小不只是向量數量乘以其維度和浮點大小那麼簡單。大多數索引會量化向量以減少記憶體使用量，但需要記憶體來存放額外的資料結構。其他非向量資料（標量）及其索引也會佔用記憶體空間。</p>
<h4 id="On-Disk-Indexes" class="common-anchor-header">磁碟上索引</h4><p>當您的索引不適合放在記憶體中時，您可以使用 Milvus 提供的<a href="https://milvus.io/docs/disk_index.md">「磁碟上索引」</a>。<a href="https://milvus.io/docs/disk_index.md">DiskANN</a>和<a href="https://milvus.io/docs/mmap.md#MMap-enabled-Data-Storage">MMap</a> 是延遲/資源折衷非常不同的兩種選擇。</p>
<p>DiskANN 在記憶體中儲存向量的高度壓縮副本，並在磁碟上儲存未壓縮的向量和圖搜尋結構。它使用一些聰明的想法來搜尋向量空間，同時盡量減少磁碟讀取，並利用固態硬碟的快速隨機存取速度。為了將延遲降至最低，固態硬碟必須透過 NVMe 而非 SATA 連接，以獲得最佳的 I/O 效能。</p>
<p>技術上來說，MMap 並非一種索引類型，而是指使用虛擬記憶體與記憶體內索引。有了虛擬記憶體，頁面可視需要在磁碟和 RAM 之間交換，如果存取模式是每次只使用一小部分資料，就能有效使用大得多的索引。</p>
<p>DiskANN 具有優異且穩定的延遲。MMap 在存取記憶體中的頁面時，有更好的延遲，但頻繁的頁面交換會造成延遲尖峰。因此，依據記憶體存取模式，MMap 的延遲會有較高的變異性。</p>
<h4 id="GPU-Indexes" class="common-anchor-header">GPU 索引</h4><p>第三個選擇是<a href="https://milvus.io/docs/gpu_index.md">使用 GPU 記憶體和計算來</a>建構<a href="https://milvus.io/docs/gpu_index.md">索引</a>。Milvus 的 GPU 支援由 Nvidia<a href="https://rapids.ai/">RAPIDS</a>團隊提供。GPU 向量搜尋的延遲可能比相對應的 CPU 搜尋低，不過通常需要數百或數千個搜尋 QPS 才能完全發揮 GPU 的平行性。此外，GPU 的記憶體通常比 CPU RAM 少，執行成本也較高。</p>
<h4 id="Distance-Metrics" class="common-anchor-header">距離度量</h4><p>一個比較容易回答的問題是，您應該選擇哪個距離指標來衡量向量之間的相似性。建議您選擇與嵌入模型訓練時相同的距離指標，通常是 COSINE（或輸入正常化時的 IP）。您的模型來源（例如 HuggingFace 上的模型頁面）會說明使用的是哪一種距離指標。Zilliz 也整理了一個方便的<a href="https://zilliz.com/ai-models">表格</a>來查詢。</p>
<p>總而言之，我認為索引選擇的許多不確定性都圍繞著這些選擇如何影響您部署的延遲/資源使用/回復權衡的不確定性。我建議使用上述經驗法則來決定使用記憶體索引、磁碟索引或 GPU 索引，然後再使用 Milvus 文件中提供的權衡準則來選擇特定的索引。</p>
<h3 id="Can-you-fix-my-broken-Milvus-Distributed-deployment" class="common-anchor-header">你能修復我破損的 Milvus 分散式部署嗎？</h3><p>許多問題都圍繞著Milvus Distributed部署啟動和運行的問題，包括與配置、工具和調試日誌相關的問題。很難提供單一的解決方案，因為每個問題似乎都與上一個問題不同，幸運的是 Milvus 有<a href="https://milvus.io/discord">一個充滿活力的 Discord</a>，您可以在那裡尋求幫助，我們也提供<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">與專家 1 對 1 的辦公時間</a>。</p>
<h3 id="How-do-I-deploy-Milvus-on-Windows" class="common-anchor-header">如何在 Windows 上部署 Milvus？</h3><p>如何在 Windows 機器上部署 Milvus 是一個多次出現的問題。根據您的回饋，我們已經為此重寫了文件：請參閱<a href="https://milvus.io/docs/install_standalone-windows.md">在 Docker (Windows) 中運行 Milvus</a>，了解如何使用<a href="https://learn.microsoft.com/en-us/windows/wsl/about#what-is-wsl-2">Windows Subsystem for Linux 2 (WSL2)</a>。</p>
<h2 id="Performance-and-Profiling" class="common-anchor-header">效能與剖析<button data-href="#Performance-and-Profiling" class="anchor-icon" translate="no">
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
    </button></h2><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Performance_and_Profiling_481975ea1d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>在選擇部署類型並讓其運作之後，使用者希望對自己所做的最佳決策感到安心，並希望剖析其部署的效能與狀態。許多問題與如何剖析效能、觀察狀態，以及深入瞭解內容和原因有關。</p>
<h3 id="How-do-I-measure-performance" class="common-anchor-header">如何衡量效能？</h3><p>使用者希望檢查與部署效能相關的指標，以便瞭解瓶頸並加以補救。提到的指標包括平均查詢延遲、延遲分佈、查詢量、記憶體使用量、磁碟儲存量等。這些指標都可以<a href="https://milvus.io/docs/monitor_overview.md">從監控系統</a>觀察到。此外，Milvus 2.5 引入了一個新工具<a href="https://milvus.io/docs/milvus-webui.md#Milvus-WebUI">WebUI</a>（歡迎回饋！），讓您可以從友善的 Web 介面存取更多系統內部資訊，例如網段壓縮狀態。</p>
<h3 id="What’s-happening-inside-Milvus-right-now-ie-observe-state" class="common-anchor-header">Milvus 內部現在正在發生什麼事（即觀察狀態）？</h3><p>與此相關的是，使用者想要觀察其部署的內部狀態。提出的問題包括瞭解為何建立搜尋索引需要這麼長的時間、如何判斷群集是否健康，以及瞭解查詢是如何跨節點執行的。許多這些問題都可以透過新的<a href="https://milvus.io/docs/milvus-webui.md#Milvus-WebUI">WebUI</a>來解答，<a href="https://milvus.io/docs/milvus-webui.md#Milvus-WebUI">WebUI</a>讓系統內部的運作透明化。</p>
<h3 id="How-does-some-complex-aspect-of-the-internals-work" class="common-anchor-header">內部的某些（複雜）方面是如何運作的？</h3><p>進階使用者通常希望瞭解 Milvus 的內部運作，例如瞭解封段或記憶體管理。其根本目的通常是提高性能，有時也是為了調試問題。文件，尤其是 「概念 」和 「管理指南 」部分下的文件在這方面很有幫助，例如，請參閱<a href="https://milvus.io/docs/architecture_overview.md">「Milvus 架構概述 」</a>和<a href="https://milvus.io/docs/clustering-compaction.md">「集群壓縮 」</a>頁面<a href="https://milvus.io/docs/clustering-compaction.md">。</a>我們將繼續改進有關 Milvus 內部的文件，使其更容易理解，歡迎通過<a href="https://milvus.io/discord">Discord</a> 提出任何反饋或請求。</p>
<h3 id="Which-embedding-model-should-I-choose" class="common-anchor-header">我應該選擇哪一種嵌入模型？</h3><p>在聚會、辦公時間和 Discord 上多次出現的一個與效能相關的問題是如何選擇嵌入模型。這個問題很難有明確的答案，不過我們建議您先從預設模型開始，例如<a href="https://huggingface.co/sentence-transformers/all-MiniLM-L6-v2">all-MiniLM-L6-v2</a>。</p>
<p>類似於搜尋索引的選擇，在計算、儲存和召回之間也有取捨。具有較大輸出維度的嵌入模型需要較多的儲存空間，在其他條件相同的情況下，雖然可能會導致較高的相關項目召回率。對於固定的維度，較大的嵌入模型在召回率方面通常會優於較小的模型，不過會以增加運算量和時間為代價。排名嵌入模型效能的排行榜（例如<a href="https://huggingface.co/spaces/mteb/leaderboard">MTEB</a>）所依據的基準可能與您的特定資料和任務不符。</p>
<p>因此，認為「最佳」嵌入模型是沒有意義的。一開始，您可以選擇召回率可接受，且符合計算嵌入所需的計算與時間預算的模型。進一步的優化，例如在您的資料上進行微調，或根據經驗探索計算/召回的折衷，可以延遲到您在生產中擁有可運作的系統之後。</p>
<h2 id="Data-Management" class="common-anchor-header">資料管理<button data-href="#Data-Management" class="anchor-icon" translate="no">
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
    </button></h2><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Data_Management_aa2d1159bd.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>如何將資料移入或移出 Milvus 部署是 Discord 討論的另一個主題，這並不令人意外，因為這項任務對應用程式投入生產是非常重要的。</p>
<h3 id="How-do-I-migrate-data-from-X-to-Milvus-How-do-I-migrate-data-from-Standalone-to-Distributed-How-do-I-migrate-from-24x-to-25x" class="common-anchor-header">如何將資料從 X 遷移到 Milvus？如何將資料從單機版遷移到分散式系統？如何從 2.4.x 遷移到 2.5.x？</h3><p>新用戶通常希望將現有的資料從其他平台遷移到 Milvus，包括傳統的搜尋引擎如<a href="https://docs.zilliz.com/docs/migrate-from-elasticsearch">Elasticsearch</a>和其他向量資料庫如<a href="https://docs.zilliz.com/docs/migrate-from-pinecone">Pinecone</a>或<a href="https://docs.zilliz.com/docs/migrate-from-qdrant">Qdrant</a>。現有使用者也可能希望將資料從一個 Milvus 部署遷移到另一個部署，或<a href="https://docs.zilliz.com/docs/migrate-from-milvus">從自我託管的 Milvus 遷移到完全管理的 Zilliz Cloud</a>。</p>
<p>Zilliz Cloud 上的<a href="https://github.com/zilliztech/vts">Vector Transport Service (VTS)</a>和受管理的<a href="https://docs.zilliz.com/docs/migrations">Migration</a> <a href="https://github.com/zilliztech/vts">服務</a>就是為此目的而設計的。</p>
<h3 id="How-do-I-save-and-load-data-backups-How-do-I-export-data-from-Milvus" class="common-anchor-header">如何儲存和載入資料備份？如何從 Milvus 匯出資料？</h3><p>Milvus 有一個專用的工具，<a href="https://github.com/zilliztech/milvus-backup">milvus-backup</a>，可以在永久的儲存空間中進行快照，並還原它們。</p>
<h2 id="Next-Steps" class="common-anchor-header">下一步<button data-href="#Next-Steps" class="anchor-icon" translate="no">
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
    </button></h2><p>我希望這能給您一些指導，讓您知道如何解決使用向量資料庫建立時所面臨的常見挑戰。這絕對有助於我們再次檢視我們的文件和功能路線圖，以持續開發能幫助社群成功使用 Milvus 的東西。我想強調的一個關鍵要點是，您的選擇會讓您在計算、儲存、延遲和記憶力之間進行不同程度的取捨。<em>您不可能同時將所有這些效能標準發揮到極致，因此不存在「最佳」部署。然而，藉由深入瞭解向量搜尋與分散式資料庫系統的運作方式，您可以做出明智的決定。</em></p>
<p>在瀏覽過 2024 年的大量文章後，我開始思考：為什麼人類要做這件事？生成式人工智能不是已承諾可以解決這種擠壓大量文字並提取洞察力的任務嗎？請跟我一起閱讀這篇博文的第二部分（即將推出），在這部分中，我將探討<em>從討論區中擷取洞察力的多機器人系統的</em>設計與實作<em>。</em></p>
<p>再次感謝您，希望能在社區<a href="https://milvus.io/discord">Discord</a>和我們下次的<a href="https://lu.ma/unstructured-data-meetup">Unstructured Data</a>聚會中見到您。如需更多實作協助，我們歡迎您預約<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">1 對 1 辦公時間</a>。<em>您的回饋對於改進 Milvus 非常重要！</em></p>
