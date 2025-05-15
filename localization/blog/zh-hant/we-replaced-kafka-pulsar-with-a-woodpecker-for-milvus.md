---
id: we-replaced-kafka-pulsar-with-a-woodpecker-for-milvus.md
title: 我們為 Milvus 用啄木鳥取代了 Kafka/Pulsar，結果如下
author: James Luan
date: 2025-05-15T00:00:00.000Z
desc: 我們建立了雲原生 WAL 系統 Woodpecker，取代 Milvus 中的 Kafka 和 Pulsar，以降低作業複雜度和成本。
cover: >-
  assets.zilliz.com/We_Replaced_Kafka_Pulsar_with_a_Woodpecker_for_Milvus_Here_s_What_Happened_77e8de27a9.png
tag: Engineering
recommend: true
publishToMedium: true
tags: 'Milvus, vector database, vector search, AI Agents, LLM'
meta_keywords: >-
  Replace Kafka, replace Pulsar, messaging queues, Write-Ahead Logging (WAL),
  Milvus vector database
meta_title: |
  We Replaced Kafka/Pulsar with a Woodpecker for Milvus
origin: >-
  https://milvus.io/blog/we-replaced-kafka-pulsar-with-a-woodpecker-for-milvus.md
---
<p><strong>TL;DR：</strong>我們在 Milvus 2.6 中建立了 Woodpecker 這個雲端原生的 Write-Ahead Logging (WAL) 系統，以取代 Kafka 和 Pulsar。結果如何？為我們的 Milvus 向量資料庫簡化操作、提升效能並降低成本。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/We_Replaced_Kafka_Pulsar_with_a_Woodpecker_for_Milvus_Here_s_What_Happened_77e8de27a9.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="The-Starting-Point-When-Message-Queues-No-Longer-Fit" class="common-anchor-header">起點：當訊息佇列不再適合時<button data-href="#The-Starting-Point-When-Message-Queues-No-Longer-Fit" class="anchor-icon" translate="no">
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
    </button></h2><p>我們喜愛並使用 Kafka 和 Pulsar。它們一直都很有效，直到失效為止。隨著領先的開放原始碼向量資料庫 Milvus 的發展，我們發現這些強大的訊息佇列不再符合我們的擴充性需求。因此我們做了一個大膽的舉動：我們重寫了 Milvus 2.6 中的串流骨幹，並實作了我們自己的 WAL -<strong>Woodpecker</strong>。</p>
<p>讓我帶您走過我們的旅程，並解釋我們為何做出這個乍看之下可能有違直覺的改變。</p>
<h2 id="Cloud-Native-From-Day-One" class="common-anchor-header">雲端原生從第一天開始<button data-href="#Cloud-Native-From-Day-One" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 從一開始就是一個雲原生向量資料庫。我們利用 Kubernetes 來進行彈性擴充和快速故障復原，並利用 Amazon S3 和 MinIO 等物件儲存解決方案來進行資料持久化。</p>
<p>這種雲端為先的方法提供了極大的優勢，但也帶來了一些挑戰：</p>
<ul>
<li><p>S3 等雲端物件儲存服務提供幾乎無限制的吞吐量與可用性處理能力，但延遲時間通常超過 100 毫秒。</p></li>
<li><p>這些服務的定價模式（基於存取模式和頻率）可能會為即時資料庫作業增加意想不到的成本。</p></li>
<li><p>在雲原生特性與即時向量搜尋需求之間取得平衡，會帶來重大的架構挑戰。</p></li>
</ul>
<h2 id="The-Shared-Log-Architecture-Our-Foundation" class="common-anchor-header">共享日誌架構：我們的基礎<button data-href="#The-Shared-Log-Architecture-Our-Foundation" class="anchor-icon" translate="no">
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
    </button></h2><p>許多向量搜尋系統僅限於批次處理，因為在雲原生環境中建立串流系統會面對更大的挑戰。相反地，Milvus 優先考量即時資料的新鮮度，並實作共享日誌架構 - 將其想像成檔案系統的硬碟機。</p>
<p>這種共用日誌架構提供了一個重要的基礎，將共識協定與核心資料庫功能分開。透過採用此方法，Milvus 無需直接管理複雜的共識協定，讓我們得以專注於提供卓越的向量搜尋功能。</p>
<p>我們並非唯一採用此架構模式的資料庫，例如 AWS Aurora、Azure Socrates 和 Neon 都採用類似的設計。<strong>然而，在開放原始碼生態系統中仍存在一個重大的缺口：儘管這種方式具有明顯的優勢，但社群仍缺乏低延遲、可擴充且具成本效益的分散式寫入日誌 (WAL) 實作。</strong></p>
<p>現有的解決方案（例如 Bookie）因其重量級的用戶端設計，以及缺乏適用於 Golang 和 C++ 的生產就緒 SDK 而無法滿足我們的需求。這個技術缺口導致我們最初使用訊息佇列的方法。</p>
<h2 id="Our-Initial-Solution-Message-Queues-as-WAL" class="common-anchor-header">我們最初的解決方案：訊息佇列作為 WAL<button data-href="#Our-Initial-Solution-Message-Queues-as-WAL" class="anchor-icon" translate="no">
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
    </button></h2><p>為了彌補這個差距，我們最初的方法是使用訊息佇列 (Kafka/Pulsar) 作為我們的前寫日誌 (WAL)。這個架構是這樣運作的：</p>
<ul>
<li><p>所有傳入的即時更新都流經訊息佇列。</p></li>
<li><p>一旦訊息佇列接受，寫入者會立即收到確認。</p></li>
<li><p>查詢節點 (QueryNode) 和資料節點 (DataNode) 以異步方式處理這些資料，確保高寫入吞吐量，同時維持資料的新鮮度。</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_Milvus_2_0_Architecture_Overview_465f5ba27a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>圖表Milvus 2.0 架構概觀</p>
<p>這個系統有效地提供即時的寫入確認，同時啟用異步資料處理，這對於維持 Milvus 使用者所期望的吞吐量與資料新鮮度之間的平衡至關重要。</p>
<h2 id="Why-We-Needed-Something-Different-for-WAL" class="common-anchor-header">為什麼我們需要不同的 WAL<button data-href="#Why-We-Needed-Something-Different-for-WAL" class="anchor-icon" translate="no">
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
    </button></h2><p>隨著 Milvus 2.6 的推出，我們決定逐步淘汰外部訊息佇列，改用 Woodpecker，也就是我們專門打造的雲原生 WAL 實作。這並不是我們輕易做出的決定。畢竟，我們已成功使用 Kafka 和 Pulsar 多年。</p>
<p>問題不在於這些技術本身 - 兩者都是功能強大的優秀系統。反之，挑戰來自於這些外部系統隨著 Milvus 的發展所帶來的日益增加的複雜性和開銷。隨著我們的需求越來越專門，通用訊息佇列所提供的功能與向量資料庫所需的功能之間的差距不斷擴大。</p>
<p>三個特定因素最終促使我們決定建立一個替代系統：</p>
<h3 id="Operational-Complexity" class="common-anchor-header">作業複雜性</h3><p>像 Kafka 或 Pulsar 之類的外部依賴，需要具備多個節點的專用機器，以及謹慎的資源管理。這造成了幾項挑戰：</p>
<ul>
<li>增加作業複雜性</li>
</ul>
<ul>
<li>系統管理員的學習曲線更陡峭</li>
</ul>
<ul>
<li>配置錯誤和安全漏洞的風險較高</li>
</ul>
<h3 id="Architectural-Constraints" class="common-anchor-header">架構限制</h3><p>Kafka 等訊息佇列對於支援的主題數量有固有的限制。我們開發了 VShard 作為跨元件主題共享的變通方案，但這個解決方案在有效解決擴充需求的同時，也帶來了顯著的架構複雜性。</p>
<p>這些外部依賴使得重要功能 (例如日誌垃圾回收) 更難實作，也增加了與其他系統模組整合的摩擦。隨著時間的推移，一般用途的訊息佇列與向量資料庫特定的高效能需求之間的架構錯配變得越來越明顯，促使我們重新評估我們的設計選擇。</p>
<h3 id="Resource-Inefficiency" class="common-anchor-header">資源效率低</h3><p>確保 Kafka 和 Pulsar 等系統的高可用性通常需要</p>
<ul>
<li><p>跨多個節點的分散式部署</p></li>
<li><p>即使是較小的工作負載也需要大量的資源分配</p></li>
<li><p>儲存短暫訊號（如 Milvus 的 Timetick），這些訊號實際上不需要長期保留</p></li>
</ul>
<p>然而，這些系統缺乏彈性，無法繞過這些短暫訊號的持久性，導致不必要的 I/O 作業和儲存使用。這會導致不成比例的資源開銷和成本增加，尤其是在規模較小或資源有限的環境中。</p>
<h2 id="Introducing-Woodpecker---A-Cloud-Native-High-Performance-WAL-Engine" class="common-anchor-header">介紹 Woodpecker - 雲端原生的高效能 WAL 引擎<button data-href="#Introducing-Woodpecker---A-Cloud-Native-High-Performance-WAL-Engine" class="anchor-icon" translate="no">
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
    </button></h2><p>在 Milvus 2.6 中，我們以<strong>Woodpecker</strong> 取代 Kafka/Pulsar，<strong>Woodpecker</strong> 是專為雲端原生 WAL 系統而設計的。Woodpecker 專為物件儲存而設計，可簡化作業，同時提升效能與擴充性。</p>
<p>Woodpecker 是為了將雲端原生儲存的潛力發揮到極致而從零開始打造的，其目標是：成為最高吞吐量的 WAL 解決方案，專為雲端環境最佳化，同時提供 append-only write-ahead 日誌所需的核心功能。</p>
<h3 id="The-Zero-Disk-Architecture-for-Woodpecker" class="common-anchor-header">Woodpecker 的零磁碟架構</h3><p>Woodpecker 的核心創新是其<strong>Zero-Disk 架構</strong>：</p>
<ul>
<li><p>所有日誌資料都儲存在雲端物件儲存（例如 Amazon S3、Google Cloud Storage 或 Alibaba OS）</p></li>
<li><p>透過分散式鍵值儲存（如 etcd）管理元資料</p></li>
<li><p>核心作業不需依賴本機磁碟</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_Woodpecker_Architecture_cc31e15ed9.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>圖：  啄木鳥架構概述</p>
<p>這種方法大幅降低了運營開銷，同時最大限度地提高了耐用性和雲效率。透過消除本機磁碟依賴，Woodpecker 完全符合雲原生原則，並大幅降低系統管理員的作業負擔。</p>
<h3 id="Performance-Benchmarks-Exceeding-Expectations" class="common-anchor-header">效能基準：超出預期</h3><p>我們執行了全面的基準來評估 Woodpecker 在單結點、單用戶端、單記錄流設定中的效能。與 Kafka 和 Pulsar 相比，結果令人印象深刻：</p>
<table>
<thead>
<tr><th><strong>系統</strong></th><th><strong>卡夫卡</strong></th><th><strong>Pulsar</strong></th><th><strong>WP MinIO</strong></th><th><strong>WP Local</strong></th><th><strong>WP S3</strong></th></tr>
</thead>
<tbody>
<tr><td>吞吐量</td><td>129.96 MB/秒</td><td>107 MB/秒</td><td>71 MB/s</td><td>450 MB/秒</td><td>750 MB/秒</td></tr>
<tr><td>延遲時間</td><td>58 毫秒</td><td>35 毫秒</td><td>184 毫秒</td><td>1.8 毫秒</td><td>166 毫秒</td></tr>
</tbody>
</table>
<p>為了說明情況，我們在測試機器上測量了不同儲存後端的理論吞吐量限制：</p>
<ul>
<li><p><strong>MinIO</strong>: ~110 MB/s</p></li>
<li><p><strong>本機檔案系統</strong>：600-750 MB/s</p></li>
<li><p><strong>Amazon S3（單個 EC2 實例）</strong>：高達 1.1 GB/秒</p></li>
</ul>
<p>值得注意的是，Woodpecker 對每個後端都持續達到最大可能吞吐量的 60-80%，對於中介軟體來說，這是一個非凡的效率水準。</p>
<h4 id="Key-Performance-Insights" class="common-anchor-header">關鍵性能洞察</h4><ol>
<li><p><strong>本地檔案系統模式</strong>：Woodpecker 的速度達到 450 MB/s，比 Kafka 快 3.5 倍，比 Pulsar 快 4.2 倍，超低延遲僅為 1.8 ms，非常適合高性能單節點部署。</p></li>
<li><p><strong>雲端儲存模式 (S3)：</strong>直接寫入 S3 時，Woodpecker 達到 750 MB/s（約為 S3 理論極限的 68%），比 Kafka 高 5.8 倍，比 Pulsar 高 7 倍。雖然延遲較高 (166 毫秒)，但此設定可為面向批次的工作負載提供優異的吞吐量。</p></li>
<li><p><strong>物件儲存模式 (MinIO)：</strong>即使使用 MinIO，Woodpecker 也能達到 71 MB/s，約為 MinIO 容量的 65%。此性能可與 Kafka 和 Pulsar 媲美，但對資源的需求明顯較低。</p></li>
</ol>
<p>Woodpecker 特別針對並發、大容量寫入進行了優化，在這種情況下，維持順序至關重要。這些結果只反映了開發的早期階段--在 I/O 合併、智慧緩衝和預取方面的持續優化，可望讓效能更接近理論極限。</p>
<h3 id="Design-Goals" class="common-anchor-header">設計目標</h3><p>Woodpecker 透過下列關鍵技術需求，滿足即時向量搜尋工作負載不斷演進的需求：</p>
<ul>
<li><p>跨可用性區域持久性的高吞吐量資料擷取</p></li>
<li><p>用於即時訂閱的低延遲尾端讀取，以及用於故障恢復的高吞吐量追蹤讀取</p></li>
<li><p>可插拔的儲存後端，包括雲端物件儲存和支援 NFS 通訊協定的檔案系統</p></li>
<li><p>靈活的部署選項，可支援輕量級單機架設，也可支援多租戶 Milvus 部署的大型叢集。</p></li>
</ul>
<h3 id="Architecture-Components" class="common-anchor-header">架構元件</h3><p>標準的 Woodpecker 部署包括以下元件。</p>
<ul>
<li><p><strong>用戶端</strong>- 發出讀寫請求的介面層</p></li>
<li><p><strong>日誌儲存</strong>- 管理高速寫入緩衝、異步上傳儲存和日誌壓縮</p></li>
<li><p><strong>儲存後端</strong>- 支援可擴充、低成本的儲存服務，例如 S3、GCS 和檔案系統 (例如 EFS)</p></li>
<li><p><strong>ETCD</strong>- 在分散式節點間儲存元資料並協調日誌狀態</p></li>
</ul>
<h3 id="Flexible-Deployments-to-Match-Your-Specific-Needs" class="common-anchor-header">靈活部署，滿足您的特定需求</h3><p>Woodpecker 提供兩種部署模式，以配合您的特定需求：</p>
<p><strong>MemoryBuffer 模式 - 重量輕、免維護</strong></p>
<p>MemoryBuffer 模式提供了一個簡單、輕量級的部署選項，Woodpecker 會在記憶體中暫時緩衝寫入的內容，並定期將其刷新至雲端物件儲存服務。元數據使用 etcd 管理，以確保一致性和協調性。此模式最適合用於較小規模部署中的批次繁重工作負載，或將簡單性置於性能之上的生產環境，尤其是在低寫入延遲並非關鍵的情況下。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_The_memory_Buffer_Mode_3429d693a1.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>圖memoryBuffer 模式</em></p>
<p><strong>QuorumBuffer 模式 - 專為低延遲、高耐用性部署而優化</strong></p>
<p>QuorumBuffer 模式專為對延遲敏感的高頻率讀/寫工作負載而設計，這些工作負載同時需要實時的回應能力和強大的容錯能力。在此模式下，Woodpecker 可作為高速寫入緩衝器使用三個副本 quorum 寫入，以確保強大的一致性和高可用性。</p>
<p>寫入一旦複製到三個節點中的至少兩個，即被視為成功，通常在個位數毫秒內完成，之後，資料會以非同步方式刷新到雲端物件儲存，以達到長期耐用性。此架構可將節點上的狀態降至最低，不需要大型本機磁碟區，並避免傳統基於法定人數的系統通常需要的複雜反熵修復。</p>
<p>結果是一個精簡、穩健的 WAL 層，非常適合對一致性、可用性和快速復原要求極高的關鍵任務生產環境。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_The_Quorum_Buffer_Mode_72573dc666.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>圖：QuorumBuffer 模式QuorumBuffer 模式</em></p>
<h2 id="StreamingService-Built-for-Real-Time-Data-Flow" class="common-anchor-header">StreamingService：為即時資料流而建<button data-href="#StreamingService-Built-for-Real-Time-Data-Flow" class="anchor-icon" translate="no">
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
    </button></h2><p>除了 Woodpecker 之外，Milvus 2.6 還引入了<strong>StreamingService -</strong>專為日誌管理、日誌擷取和串流資料訂閱所設計的特殊元件。</p>
<p>要瞭解我們的新架構如何運作，釐清這兩個元件之間的關係非常重要：</p>
<ul>
<li><p><strong>Woodpecker</strong>是儲存層，負責處理寫前日誌的實際持久性，提供持久性與可靠性。</p></li>
<li><p><strong>StreamingService</strong>是服務層，負責管理日誌作業，並提供即時資料串流功能。</p></li>
</ul>
<p>它們共同組成了外部訊息佇列的完整替代品。Woodpecker 提供耐用的儲存基礎，而 StreamingService 則提供應用程式可直接互動的高階功能。這種關注點的分離使每個元件都能針對其特定角色進行最佳化，同時作為一個整合的系統無縫協同運作。</p>
<h3 id="Adding-Streaming-Service-to-Milvus-26" class="common-anchor-header">將 Streaming Service 加入 Milvus 2.6</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_Milvus_2_6_Architecture_Overview_238428c58f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>圖表：Milvus 2.6 架構中新增的串流服務</p>
<p>串流服務由三個核心元件組成：</p>
<p><strong>串流協調器</strong></p>
<ul>
<li><p>透過監控 Milvus ETCD 會話發現可用的串流節點</p></li>
<li><p>透過 ManagerService 管理 WAL 的狀態，並收集負載平衡指標</p></li>
</ul>
<p><strong>串流用戶端</strong></p>
<ul>
<li><p>查詢 AssignmentService，以確定 WAL 區段在串流節點間的分佈情況</p></li>
<li><p>透過適當的串流節點上的 HandlerService 執行讀/寫作業</p></li>
</ul>
<p><strong>串流節點</strong></p>
<ul>
<li><p>處理實際的 WAL 作業，並為即時資料串流提供發佈-訂閱功能</p></li>
<li><p>包含<strong>ManagerService</strong>，用於 WAL 管理和效能報告</p></li>
<li><p>以<strong>HandlerService</strong>為特色，為 WAL 項目實作有效率的發佈-訂閱機制</p></li>
</ul>
<p>這種分層架構可讓 Milvus 在串流功能（訂閱、即時處理）與實際儲存機制之間維持清楚的區隔。Woodpecker 處理日誌儲存的「如何」，而 StreamingService 則管理日誌作業的「什麼」和「什麼時候」。</p>
<p>因此，Streaming Service 大幅增強了 Milvus 的即時功能，因為它引入了本機訂閱支援，不再需要外部訊息佇列。它透過整合查詢和資料路徑中先前重複的快取記憶體，降低了記憶體消耗；透過移除異步同步延遲，降低了強度一致讀取的延遲，並改善了整個系統的可擴充性和復原速度。</p>
<h2 id="Conclusion---Streaming-on-a-Zero-Disk-Architecture" class="common-anchor-header">結論 - 在零磁碟架構上進行串流處理<button data-href="#Conclusion---Streaming-on-a-Zero-Disk-Architecture" class="anchor-icon" translate="no">
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
    </button></h2><p>管理狀態很困難。有狀態的系統通常會犧牲彈性和擴充性。在雲原生設計中，越來越多人接受的答案是將狀態與運算解耦，允許各自獨立擴充。</p>
<p>與其重新發明輪子，我們不如將耐久、可擴充儲存的複雜性委託給 AWS S3、Google Cloud Storage 和 MinIO 等服務背後的世界級工程團隊。在這些服務中，S3 以其幾乎無限的容量、十一個九 (99.999999999%) 的耐用性、99.99% 的可用性以及高吞吐量的讀/寫效能脫穎而出。</p>
<p>但是，即使是「零磁碟」架構也有權責取捨。物件儲存仍需面對高寫入延遲和小檔案低效率的問題，這些限制在許多即時工作負載中仍未解決。</p>
<p>對於向量資料庫，尤其是那些支援關鍵任務 RAG、AI 代理和低延遲搜尋工作負載的資料庫，即時存取和快速寫入是不可或缺的。這就是我們圍繞 Woodpecker 和 Streaming Service 重新設計 Milvus 的原因。這種轉變簡化了整體系統（面對現實吧-沒有人想在向量資料庫內維護完整的 Pulsar 堆疊），確保資料更新鮮，提高成本效益，並加速故障復原。</p>
<p>我們相信 Woodpecker 不只是 Milvus 的元件 - 它可以成為其他雲端原生系統的基礎建構區塊。隨著雲端基礎架構的演進，像 S3 Express 這樣的創新可能會讓我們更接近理想：以個位數毫秒的寫入延遲達到跨 AZ 的耐用性。</p>
<h2 id="Whats-Next" class="common-anchor-header">下一步<button data-href="#Whats-Next" class="anchor-icon" translate="no">
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
    </button></h2><p>請密切注意即將推出的 Milvus 2.6，其中包含 Woodpecker 以及更多強大的功能。準備好體驗改進的效能和簡化的操作了嗎？請查看我們的<a href="https://milvus.io/docs"> 說明文件</a>開始使用！也歡迎您加入<a href="https://discord.gg/milvus"> Discord</a>或<a href="https://github.com/milvus-io/milvus/discussions">GitHub</a>上的 Milvus 社群，提出問題或分享經驗。</p>
<p>如果您在大型關鍵任務向量搜尋工作負載上遇到挑戰，我們樂意提供協助。<a href="https://milvus.io/office-hours"> 預約 Milvus Office Hours 會話</a>，與我們的工程團隊討論您的特定需求。</p>
