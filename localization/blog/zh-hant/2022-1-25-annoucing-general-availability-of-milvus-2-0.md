---
id: 2022-1-25-annoucing-general-availability-of-milvus-2-0.md
title: 宣布 Milvus 2.0 全面上市
author: Xiaofan Luan
date: 2022-01-25T00:00:00.000Z
desc: 處理大量高維資料的簡易方法
cover: assets.zilliz.com/Milvus_2_0_GA_4308a0f552.png
tag: News
---
<p>親愛的Milvus社群成員和朋友們：</p>
<p>今天，在第一個Release Candidate (RC)公開六個月之後，我們很高興地宣布Milvus 2.0已經可以<a href="https://milvus.io/docs/v2.0.x/release_notes.md#v200">通用(GA)</a>並準備生產！這是一段漫長的旅程，我們感謝社區貢獻者、使用者以及 LF AI &amp; Data 基金會等所有人，是他們一路協助我們實現這個目標。</p>
<p>處理數十億高維數據的能力對現今的 AI 系統來說是一件大事，而且是有充分理由的：</p>
<ol>
<li>相較於傳統的結構化資料，非結構化資料在數量上佔有主導地位。</li>
<li>資料的新鮮度從未如此重要。資料科學家渴望及時的資料解決方案，而不是傳統的 T+1 折衷方案。</li>
<li>因此，Milvus 2.0 出現了。Milvus 是一種資料庫，可協助大規模處理高維資料。它專為雲端設計，能夠在任何地方執行。如果您有追蹤我們的 RC 版本，您就會知道我們花了很大的心力讓 Milvus 更穩定、更容易部署和維護。</li>
</ol>
<h2 id="Milvus-20-GA-now-offers" class="common-anchor-header">Milvus 2.0 GA 現在提供<button data-href="#Milvus-20-GA-now-offers" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>實體刪除</strong></p>
<p>作為一個資料庫，Milvus 現在支援<a href="https://milvus.io/docs/v2.0.x/delete_data.md">按主鍵刪除實體</a>，稍後也會支援按表達式刪除實體。</p>
<p><strong>自動負載平衡</strong></p>
<p>Milvus 現在支援外掛式負載平衡政策，以平衡每個查詢節點和資料節點的負載。由於計算與儲存的分離，平衡只需幾分鐘即可完成。</p>
<p><strong>移交</strong></p>
<p>一旦成長中的片段透過 flush 封存，交接任務會以索引的歷史片段取代成長中的片段，以改善搜尋效能。</p>
<p><strong>資料壓縮</strong></p>
<p>資料壓縮是一項背景工作，可將小區段合併為大區段，並清理邏輯刪除的資料。</p>
<p><strong>支援嵌入式 etcd 與本機資料儲存</strong></p>
<p>在 Milvus 獨立模式下，我們只需要幾個配置就可以移除 etcd/MinIO 的依賴。本機資料儲存也可當作本機快取，避免將所有資料載入主記憶體。</p>
<p><strong>多語言 SDK</strong></p>
<p>除了<a href="https://github.com/milvus-io/pymilvus">PyMilvus</a> 之外，<a href="https://github.com/milvus-io/milvus-sdk-node">Node.js</a>、<a href="https://github.com/milvus-io/milvus-sdk-java">Java</a>和<a href="https://github.com/milvus-io/milvus-sdk-go">Go</a>SDK 現在也可立即使用。</p>
<p><strong>Milvus K8s Operator</strong></p>
<p><a href="https://milvus.io/docs/v2.0.x/install_cluster-milvusoperator.md">Milvus Operator</a>提供簡易的解決方案，以可擴充和高可用性的方式，部署和管理完整的 Milvus 服務堆疊，包括 Milvus 元件和其相關的相依性 (例如 etcd、Pulsar 和 MinIO)，到目標<a href="https://kubernetes.io/">Kubernetes</a>集群。</p>
<p><strong>協助管理 Milvus 的工具</strong></p>
<p>我們要感謝<a href="https://zilliz.com/">Zilliz</a>對管理工具的卓越貢獻。我們現在有了<a href="https://milvus.io/docs/v2.0.x/attu.md">Attu</a>，它允許我們透過直觀的 GUI 與 Milvus 互動，還有<a href="https://milvus.io/docs/v2.0.x/cli_overview.md">Milvus_CLI</a>，一個管理 Milvus 的命令列工具。</p>
<p>感謝所有 212 位貢獻者，社群在過去 6 個月內完成了 6718 次提交，並關閉了大量的穩定性和效能問題。在 2.0 GA 發佈後，我們將馬上開放我們的穩定性和效能基準報告。</p>
<h2 id="Whats-next" class="common-anchor-header">下一步是什麼？<button data-href="#Whats-next" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>功能性</strong></p>
<p>字串類型支援將是 Milvus 2.1 的下一個殺手功能。我們也將引入生存時間（TTL）機制和基本的 ACL 管理，以更好地滿足用戶的需求。</p>
<p><strong>可用性</strong></p>
<p>我們正在重構查詢協調排程機制，以支援每個區段的多重記憶體副本。有了多個活躍的副本，Milvus 可以支援更快的故障移轉和推測執行，以縮短停機時間至幾秒之內。</p>
<p><strong>效能</strong></p>
<p>效能基準結果即將在我們的網站上提供。在接下來的版本中，我們預期會看到令人印象深刻的效能改善。我們的目標是將小型資料集的搜尋延遲時間減半，並將系統吞吐量提高一倍。</p>
<p><strong>易於使用</strong></p>
<p>Milvus 的設計可在任何地方執行。在接下來的幾個小版本中，我們將在 MacOS (M1 和 X86) 和 ARM 伺服器上支援 Milvus。我們也會提供嵌入式 PyMilvus，讓您可以簡單地<code translate="no">pip install</code> Milvus，而不需要複雜的環境設定。</p>
<p><strong>社群管理</strong></p>
<p>我們將精簡會員規則，釐清貢獻者角色的要求與責任。此外，我們也正在開發一個導師計畫；對雲原生資料庫、向量搜尋和/或社群治理有興趣的人，歡迎與我們聯絡。</p>
<p>對於最新的 Milvus GA 版本，我們感到非常興奮！一如往常，我們很樂意聽取您的意見。如果您遇到任何問題，請隨時透過<a href="https://github.com/milvus-io/milvus">GitHub</a>或<a href="http://milvusio.slack.com/">Slack</a> 聯絡我們。</p>
<p><br/></p>
<p>最誠摯的問候</p>
<p>栾小凡</p>
<p>Milvus 專案維護員</p>
<p><br/></p>
<blockquote>
<p><em>由<a href="https://github.com/claireyuw">Claire Yu</a> 編輯</em></p>
</blockquote>
