---
id: top-10-keywords-dominates-milvus-community-in-2023.md
title: 揭曉 2023 年支配 Milvus 社群的十大關鍵字
author: 'Jack Li, Fendy Feng'
date: 2024-1-21
desc: 本文章透過分析聊天記錄和揭示討論中的十大關鍵字，探索社群的核心。
metaTitle: Top 10 Keywords Dominating the Milvus Community in 2023
cover: >-
  assets.zilliz.com/Top_10_Keywords_in_the_Milvus_Community_20240116_111204_1_f65b17a8ea.png
tag: Engineering
tags: >-
  Data science, Database, Tech, Artificial Intelligence, Vector Management,
  Milvus
recommend: true
canonicalUrl: 'https://milvus.io/blog/top-10-keywords-dominates-milvus-community-in-2023.md'
---
<p>在 2023 年結束之際，讓我們回顧 Milvus 社群的非凡歷程：擁有<a href="https://github.com/milvus-io/milvus">25,000 個 GitHub Stars</a>、推出<a href="https://milvus.io/blog/unveiling-milvus-2-3-milestone-release-offering-support-for-gpu-arm64-cdc-and-other-features.md">Milvus 2.3.0</a>，以及<a href="https://hub.docker.com/r/milvusdb/milvus">Docker 映像</a>下載量突破 1<a href="https://github.com/milvus-io/milvus">,000</a> 萬次。本篇文章透過分析聊天記錄，揭示討論中的十大關鍵字，探索社群的核心。</p>
<iframe class="video-player" src="https://www.youtube.com/embed/o5uMdNLioQ0?list=PLPg7_faNDlT5Fb8WN8r1PzzQTNzdechnS" title="Mastering Milvus: Turbocharge Your Vector Database with Optimization Secrets!" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
<h2 id="1-Version--The-rise-of-AIGC-drives-rapid-Milvus-iteration" class="common-anchor-header">#1 版本 - AIGC 的崛起推動 Milvus 快速迭代<button data-href="#1-Version--The-rise-of-AIGC-drives-rapid-Milvus-iteration" class="anchor-icon" translate="no">
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
    </button></h2><p>令人驚訝的是，「版本」成為 2023 年討論最多的關鍵字。這一啟示根源於這一年的 AI 浪潮，向量資料庫成為解決 AIGC 應用程式幻覺問題挑戰的重要基礎架構。</p>
<p>圍繞向量資料庫的熱情驅使 Milvus 進入快速迭代的階段。僅在 2023 年，社群就見證了 20 個版本的釋出，滿足了 AIGC 開發人員的需求，他們的詢問充斥著社群，詢問如何為各種應用選擇最佳版本的 Milvus。對於正在瀏覽這些更新的使用者，我們建議您使用最新的版本，以增強功能和效能。</p>
<p>如果您對 Milvus 的發行規劃有興趣，請參考官方網站的<a href="https://wiki.lfaidata.foundation/display/MIL/Milvus+Long+Term+Roadmap+and+Time+schedule">Milvus Roadmap</a>頁面。</p>
<h2 id="2-Search--beyond-Vector-Search" class="common-anchor-header">#2 搜尋 - 超越向量搜尋<button data-href="#2-Search--beyond-Vector-Search" class="anchor-icon" translate="no">
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
    </button></h2><p>「搜尋 」排在第二位，反映出它在資料庫運作中的基本角色。Milvus 支援各種搜尋功能，從 Top-K ANN 搜尋到標量篩選搜尋和範圍搜尋。即將發行的 Milvus 3.0 (Beta) 承諾提供關鍵字搜尋 (sparse embeddings)，許多 RAG 應用程式開發人員都熱切期待。</p>
<p>社群中關於搜尋的討論著重於效能、功能和原則。使用者經常會問關於屬性過濾、設定索引臨界值以及解決延遲問題等問題。<a href="https://milvus.io/docs/v2.0.x/search.md">查詢和搜尋文件</a>、<a href="https://wiki.lfaidata.foundation/pages/viewpage.action?pageId=43287103">Milvus 增強提案 (MEP)</a> 和 Discord 討論等資源已成為了解 Milvus 搜尋複雜性的參考資料。</p>
<h2 id="3-Memory--trade-offs-between-performance-and-accuracy-for-minimized-memory-overhead" class="common-anchor-header">#3 記憶體 - 在效能與精確度之間取捨，以達到最小的記憶體開銷<button data-href="#3-Memory--trade-offs-between-performance-and-accuracy-for-minimized-memory-overhead" class="anchor-icon" translate="no">
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
    </button></h2><p>"記憶體」在過去一年也成為社群討論的焦點。向量是一種獨特的資料類型，本身就有很高的維度。為了達到最佳效能，將向量儲存於記憶體是常見的做法，但不斷增加的資料量卻限制了可用記憶體。Milvus 採用<a href="https://zilliz.com/blog/milvus-introduced-mmap-for-redefined-data-management-increased-storage-capability">MMap</a>和 DiskANN 等技術來優化記憶體的使用。</p>
<p>然而，要在資料庫系統中同時達到低記憶體使用率、優異效能和高準確度的目標仍然相當複雜，必須在效能和準確度之間作出權衡，以盡量減少記憶體開銷。</p>
<p>就人工智慧產生的內容 (AIGC) 而言，開發人員通常會將快速回應和結果精確度放在優先地位，而非嚴格的效能要求。Milvus 新增的 MMap 和 DiskANN 可將記憶體佔用量降至最低，同時最大化資料處理和結果精確度，達到符合 AIGC 應用程式實際需求的平衡。</p>
<h2 id="4-Insert--smooth-sailing-through-data-insertion" class="common-anchor-header">#4 Insert - 資料插入一帆風順<button data-href="#4-Insert--smooth-sailing-through-data-insertion" class="anchor-icon" translate="no">
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
    </button></h2><p>高效率的資料插入是開發人員最關心的問題，因此 Milvus 社群經常討論如何優化插入速度。由於 Milvus 擅於分離串流和批次資料，因此在高效插入串流資料和建立索引方面表現優異。與其他向量資料庫供應商（如 Pinecone）相比，這種能力使其成為性能卓越的解決方案。</p>
<p>以下是關於資料插入的一些寶貴見解及建議：</p>
<ul>
<li><p><strong>批次插入：</strong>選擇批次插入而非單行插入，以提高效率。值得注意的是，從檔案插入的速度超越批次插入。當處理超過一千萬筆記錄的大型資料集時，請考慮使用<code translate="no">bulk_insert</code> 介面，以簡化並加速匯入程序。</p></li>
<li><p><strong>策略性<code translate="no">flush()</code> 使用：</strong>與其在每個批次之後呼叫<code translate="no">flush()</code> 介面，不如在完成所有資料插入之後呼叫一次。在批次之間過度使用<code translate="no">flush()</code> 介面會導致產生零碎的區段檔案，對系統造成相當大的壓縮負擔。</p></li>
<li><p><strong>主索引鍵重複資料刪除：</strong>使用<code translate="no">insert</code> 介面插入資料時，Milvus 不會執行重複主索引鍵。如果您需要重複主索引鍵，我們建議您部署<code translate="no">upsert</code> 介面。然而，<code translate="no">upsert</code>的插入性能比<code translate="no">insert</code> 低，這是由於多了一個內部查詢操作。</p></li>
</ul>
<h2 id="5-Configuration--decoding-the-parameter-maze" class="common-anchor-header">#5 配置 - 解碼參數迷宮<button data-href="#5-Configuration--decoding-the-parameter-maze" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 是一個分散式向量資料庫，整合了許多第三方元件，例如物件儲存、訊息佇列和 Etcd。使用者致力於調整參數，並瞭解其對 Milvus 效能的影響，因此「組態」成為經常討論的話題。</p>
<p>在所有關於組態的問題中，「調整哪些參數」可說是最具挑戰性的一環，因為在不同的情況下，參數會有所不同。例如，優化搜尋性能參數與優化插入性能參數就有所不同，而且在很大程度上依賴於實際經驗。</p>
<p>一旦用戶確定了 「哪些參數需要調整」，接下來的 「如何調整 」問題就變得更容易處理了。有關具體程序，請參閱我們的文檔<a href="https://milvus.io/docs/configure-helm.md">配置 Milvus</a>。好消息是 Milvus 自 2.3.0 版起已支援動態參數調整，無需重新啟動更改即可生效。具體步驟請參考<a href="https://milvus.io/docs/dynamic_config.md">Configure Milvus on the Fly</a>。</p>
<h2 id="6-Logs--navigating-the-troubleshooting-compass" class="common-anchor-header">#6 日誌 - 導航故障排除指南針<button data-href="#6-Logs--navigating-the-troubleshooting-compass" class="anchor-icon" translate="no">
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
    </button></h2><p>"日誌」是故障排除者的指南針。使用者在社群中尋求有關匯出 Milvus 日誌、調整日誌層級，以及與 Grafana's Loki 等系統整合的指引。以下是一些關於 Milvus 日誌的建議。</p>
<ul>
<li><p><strong>如何檢視和匯出 Milvus 日誌：</strong>您可以使用 GitHub 套件庫中的<a href="https://github.com/milvus-io/milvus/tree/master/deployments/export-log">export-milvus-log.sh</a>一鍵式腳本輕鬆匯出<a href="https://github.com/milvus-io/milvus/tree/master/deployments/export-log">Milvus</a>日誌。</p></li>
<li><p><strong>日誌層級：</strong>Milvus 有多種日誌層級，以因應不同的使用情況。info 層級足以應付大多數情況，而 debug 層級則用於除錯。過多的 Milvus 日誌可能表示日誌層級設定錯誤。</p></li>
<li><p><strong>我們建議將 Milvus 日誌與</strong>Loki 之類的<strong>日誌收集系統整合</strong>，以便在未來的故障排除中簡化日誌檢索。</p></li>
</ul>
<h2 id="7-Cluster--scaling-for-production-environments" class="common-anchor-header">#7 集群 - 為生產環境擴展<button data-href="#7-Cluster--scaling-for-production-environments" class="anchor-icon" translate="no">
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
    </button></h2><p>考慮到 Milvus 作為分散式向量資料庫的特性，「叢集」一詞是社群中經常討論的話題。討論圍繞著叢集中的資料擴充、資料遷移、資料備份與同步。</p>
<p>在生產環境中，強大的可擴展性和高可用性是分散式資料庫系統的標準要求。Milvus 的儲存與運算分離架構可透過擴充運算與儲存節點的資源，實現無縫的資料擴充能力，以容納無限的資料規模。Milvus 還提供多複本架構的高可用性，以及強大的備份和同步功能。  如需詳細資訊，請參閱<a href="https://milvus.io/docs/coordinator_ha.md#Coordinator-HA">協調器 HA</a>。</p>
<h2 id="8-Documentation--the-gateway-to-understanding-Milvus" class="common-anchor-header">#8 文件 - 瞭解 Milvus 的門戶<button data-href="#8-Documentation--the-gateway-to-understanding-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>在社群討論中，「文件」是另一個經常被提出的關鍵字，通常是關於特定功能是否有任何文件頁面，以及在哪裡可以找到的問題。</p>
<p>作為了解 Milvus 的門戶，大約 80% 的社區查詢都能在<a href="https://milvus.io/docs">官方文件</a>中找到答案。我們建議您在使用 Milvus 或遇到任何問題前先閱讀我們的說明文件。此外，您可以在不同的 SDK 套件庫中探索程式碼範例，以了解如何使用 Milvus。</p>
<h2 id="9-Deployment--simplifying-the-Milvus-journey" class="common-anchor-header">#9 部署 - 簡化 Milvus 旅程<button data-href="#9-Deployment--simplifying-the-Milvus-journey" class="anchor-icon" translate="no">
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
    </button></h2><p>簡單部署一直是 Milvus 團隊的目標。為了實現這一承諾，我們推出了<a href="https://milvus.io/docs/milvus_lite.md#Get-Started-with-Milvus-Lite">Milvus Lite</a>，這是 Milvus 的輕量級替代品，功能完整，但不需要依賴 K8s 或 Docker。</p>
<p>我們透過引入更輕量的<a href="https://zilliz.com/blog/optimizing-data-communication-milvus-embraces-nats-messaging">NATS</a>訊息傳送解決方案和整合節點元件，進一步簡化部署。為回應使用者的回饋意見，我們正準備推出無相關依賴的獨立版本，並持續努力強化功能和簡化部署作業。Milvus 的快速迭代展現了社群對持續精進部署流程的不懈努力。</p>
<h2 id="10-Deletion--unraveling-the-impact" class="common-anchor-header">#10 刪除 - 解開影響<button data-href="#10-Deletion--unraveling-the-impact" class="anchor-icon" translate="no">
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
    </button></h2><p>關於「刪除」的討論普遍圍繞著刪除後資料數量不變、刪除資料的持續可擷取性，以及刪除後磁碟空間恢復失敗等問題。</p>
<p>Milvus 2.3 引入了<code translate="no">count(*)</code> 表達式來處理延遲的實體計數更新。查詢中已刪除資料的持續性可能是因為<a href="https://zilliz.com/blog/understand-consistency-models-for-vector-databases">資料一致性模型</a>使用不當所致。磁碟空間恢復失敗的疑慮促使我們重新設計 Milvus 的垃圾回收機制，在完全刪除資料前設定等待期。這個方法允許一個時間窗來進行潛在的復原。</p>
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
    </button></h2><p>前十名的關鍵字提供了 Milvus 社群內部熱烈討論的一瞥。隨著 Milvus 的持續發展，社群仍是開發人員尋求解決方案、分享經驗，以及在 AI 時代推進向量資料庫的寶貴資源。</p>
<p>在 2024 年加入我們的<a href="https://discord.com/invite/8uyFbECzPX">Discord 頻道</a>，加入這段令人振奮的旅程。在那裡，您可以與我們傑出的工程師交流，並與志同道合的 Milvus 愛好者聯繫。此外，請參加<a href="https://discord.com/invite/RjNbk8RR4f">Milvus 社群午餐會 (Milvus Community Lunch and Learn</a>)，時間為太平洋標準時間每週二下午 12:00 至 12:30。分享您的想法、問題和反饋，因為每一個貢獻都會增加推動 Milvus 前進的合作精神。我們不僅歡迎您的積極參與，也非常感謝您的參與。讓我們一起創新！</p>
