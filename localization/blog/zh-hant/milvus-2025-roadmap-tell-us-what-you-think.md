---
id: milvus-2025-roadmap-tell-us-what-you-think.md
title: Milvus 2025 路線圖 - 告訴我們您的想法
author: 'Fendy Feng, Field Zhang'
date: 2025-03-27T00:00:00.000Z
desc: 2025 年，我們將陸續推出 Milvus 2.6 和 Milvus 3.0 兩大版本，以及許多其他技術功能。歡迎您與我們分享您的想法。
cover: assets.zilliz.com/2025_roadmap_04e6c5d1c3.png
tag: Announcements
recommend: true
canonicalUrl: 'https://milvus.io/blog/milvus-2025-roadmap-tell-us-what-you-think.md'
---
<p>嗨，Milvus 的用戶和貢獻者們！</p>
<p>我們很高興與您分享<a href="https://milvus.io/docs/roadmap.md"><strong>Milvus 2025 的發展藍圖</strong></a>。這份技術計畫強調了我們正在建置的主要功能和改進，讓 Milvus 更能滿足您的向量搜尋需求。</p>
<p>但這只是個開始，我們需要您的洞察力！您的反饋有助於塑造 Milvus，確保它不斷發展，以滿足現實世界的挑戰。讓我們知道您的想法，並幫助我們改進路線圖。</p>
<h2 id="The-Current-Landscape" class="common-anchor-header">現況<button data-href="#The-Current-Landscape" class="anchor-icon" translate="no">
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
    </button></h2><p>在過去的一年裡，我們看到許多人使用 Milvus 建立了令人印象深刻的 RAG 和代理應用程式，並利用了我們許多受歡迎的功能，例如我們的模型整合、全文搜索和混合搜索。您的實作對於真實世界的向量搜尋需求提供了寶貴的見解。</p>
<p>隨著人工智慧技術的演進，您的用例也變得越來越複雜 - 從基本的向量搜尋到複雜的多模式應用，涵蓋了智慧型代理人、自主系統和具體化人工智慧。在我們持續開發 Milvus 以滿足您需求的過程中，這些技術挑戰為我們的發展藍圖提供了參考。</p>
<h2 id="Two-Major-Releases-in-2025-Milvus-26-and-Milvus-30" class="common-anchor-header">2025 年的兩個主要版本：Milvus 2.6 和 Milvus 3.0<button data-href="#Two-Major-Releases-in-2025-Milvus-26-and-Milvus-30" class="anchor-icon" translate="no">
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
    </button></h2><p>2025 年，我們將發佈兩個主要版本：Milvus 2.6 (CY25年中) 和 Milvus 3.0 (2025年底)。</p>
<p><strong>Milvus 2.6</strong>著重於您一直要求的核心架構改進：</p>
<ul>
<li><p>更簡單的部署與更少的相依性 (再見了，令人頭痛的部署問題!)</p></li>
<li><p>更快的資料擷取管道</p></li>
<li><p>降低儲存成本（我們聽到您對生產成本的憂慮）</p></li>
<li><p>更好地處理大型資料作業 (刪除/修改)</p></li>
<li><p>更有效率的標量與全文搜尋</p></li>
<li><p>支援您正在使用的最新嵌入模型</p></li>
</ul>
<p><strong>Milvus 3.0</strong>是我們更大的架構演進，引入向量資料湖系統，用於</p>
<ul>
<li><p>無縫的 AI 服務整合</p></li>
<li><p>次級搜尋功能</p></li>
<li><p>更強大的資料管理</p></li>
<li><p>更好地處理您正在使用的大量離線資料集</p></li>
</ul>
<h2 id="Technical-Features-Were-Planning---We-Need-Your-Feedback" class="common-anchor-header">我們正在規劃的技術功能 - 我們需要您的意見回饋<button data-href="#Technical-Features-Were-Planning---We-Need-Your-Feedback" class="anchor-icon" translate="no">
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
    </button></h2><p>以下是我們計劃加入 Milvus 的主要技術功能。</p>
<table>
<thead>
<tr><th><strong>關鍵功能區</strong></th><th><strong>技術功能</strong></th></tr>
</thead>
<tbody>
<tr><td><strong>AI 驅動的非結構化資料處理</strong></td><td>- 資料輸入/輸出：與主要模型服務原生整合，以進行原始文字輸入<br>- 原始資料處理：原始資料處理的文字/URL 參考支援<br>- 張量支援：向量清單實作 (適用於 ColBERT/CoPali/視訊情境)<br>- 延伸資料類型：根據需求支援 DateTime、Map、GIS<br>- 迭代搜尋：透過使用者的回饋改進查詢向量</td></tr>
<tr><td><strong>搜尋品質與效能改善</strong></td><td>- 進階配對：phrase_match 及 multi_match 功能<br>- 分析器升級：透過擴充標記器支援和改善可觀察性來強化分析器<br>- JSON 最佳化：透過改進的索引加快過濾速度<br>- 執行排序：基於標量欄位的結果排序<br>- 進階重排序器：基於模型的重新排名與自訂評分功能<br>- 迭代搜尋：透過使用者的回饋改善查詢向量</td></tr>
<tr><td><strong>資料管理彈性</strong></td><td>- 模式變更：新增/刪除欄位、修改 varchar 長度<br>- 標量聚合：計數/區分/最小/最大操作<br>- 支援 UDF：支援使用者定義函數<br>- 資料版本管理：基於快照的回滾系統<br>- 資料集群：透過配置進行共址<br>- 資料取樣：根據取樣資料快速取得結果</td></tr>
<tr><td><strong>架構改進</strong></td><td>- 流節點：簡化增量資料擷取<br>- MixCoord：統一的協調器架構<br>- 獨立於 Logstore：減少像 pulsar 之類的外部依賴性<br>- PK 重複資料刪除：全局主索引鍵重複刪除</td></tr>
<tr><td><strong>成本效益與架構改進</strong></td><td>- 分層儲存：冷熱資料分離，降低儲存成本<br>- 資料驅逐政策：使用者可自行定義資料驅逐政策<br>- 大量更新：支援欄位特定值修改、ETL 等功能<br>- 大型 TopK：傳回大量資料集<br>- VTS GA：連接不同的資料來源<br>- 進階量化：根據量化技術優化記憶體消耗與效能<br>- 資源彈性：動態擴充資源以適應不同的寫入負載、讀取負載和背景工作負載</td></tr>
</tbody>
</table>
<p>在我們實現此路線圖的過程中，希望您能就下列事項提供意見與回饋：</p>
<ol>
<li><p><strong>功能優先順序：</strong>我們的路線圖中哪些功能對您的工作影響最大？</p></li>
<li><p><strong>實施構想：</strong>任何您認為對這些功能有效的特定方法？</p></li>
<li><p><strong>用例一致性：</strong>這些計劃中的功能如何與您目前和未來的使用個案相結合？</p></li>
<li><p><strong>效能考量：</strong>針對您的特定需求，我們應該著重在哪些效能方面？</p></li>
</ol>
<p><strong>您的見解有助於我們為每個人打造更好的 Milvus。歡迎在我們的<a href="https://github.com/milvus-io/milvus/discussions/40263"> Milvus 討論區</a>或<a href="https://discord.com/invite/8uyFbECzPX">Discord 頻道</a>分享您的想法。</strong></p>
<h2 id="Welcome-to-Contribute-to-Milvus" class="common-anchor-header">歡迎貢獻 Milvus<button data-href="#Welcome-to-Contribute-to-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>作為一個開源專案，Milvus 總是歡迎您的貢獻：</p>
<ul>
<li><p><strong>分享回饋：</strong>通過我們的<a href="https://github.com/milvus-io/milvus/issues">GitHub 問題頁面</a>報告問題或建議功能</p></li>
<li><p><strong>程式碼貢獻：</strong>提交拉取請求 (請參閱我們的<a href="https://github.com/milvus-io/milvus/blob/82915a9630ab0ff40d7891b97c367ede5726ff7c/CONTRIBUTING.md">貢獻者指南</a>)</p></li>
<li><p><strong>傳播訊息：</strong>分享您的 Milvus 經驗，<a href="https://github.com/milvus-io/milvus">成為我們 GitHub 儲存庫的明星。</a></p></li>
</ul>
<p>我們很高興能與您一起建立 Milvus 的下一頁。您的程式碼、想法和回饋驅使這個專案向前邁進！</p>
<p>- Milvus 團隊</p>
