---
id: 2022-03-10-manage-your-milvus-vector-database-with-one-click-simplicity.md
title: 一鍵式簡單管理您的 Milvus 向量資料庫
author: Zhen Chen
date: 2022-03-10T00:00:00.000Z
desc: Attu - Milvus 2.0 的 GUI 工具。
cover: assets.zilliz.com/Attu_3ff9a76156.png
tag: Engineering
tags: 'Data science, Database, Technology, Artificial Intelligence, Vector Management'
canonicalUrl: >-
  https://zilliz.com/blog/manage-your-milvus-vector-database-with-one-click-simplicity
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Attu_3ff9a76156.png" alt="Binlog Cover Image" class="doc-image" id="binlog-cover-image" />
   </span> <span class="img-wrapper"> <span>Binlog 封面圖片</span> </span></p>
<p><a href="https://github.com/czhen-zilliz">由陳振</a>起草，<a href="https://github.com/LocoRichard">王立宸</a>轉載。</p>
<p style="font-size: 12px;color: #4c5a67"><a href="https://zilliz.com/blog/manage-your-milvus-vector-database-with-one-click-simplicity">點此</a>查看原文。</p> 
<p>面對快速增長的非結構化數據處理需求，Milvus 2.0脫穎而出。它是一個面向人工智能的向量資料庫系統，專為海量生產場景而設計。除了這些 Milvus SDK 和 Milvus CLI（Milvus 的命令列介面）之外，有沒有一個工具可以讓使用者更直覺地操作 Milvus 呢？答案是有的。Zilliz 發表了專為 Milvus 設計的圖形化使用者介面 - Attu。在這篇文章中，我們想一步一步地教您如何使用 Attu 執行向量相似性搜尋。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/map_aa1cda30d4.png" alt="Attu island" class="doc-image" id="attu-island" />
   </span> <span class="img-wrapper"> <span>Attu 島嶼</span> </span></p>
<p>相較於 Milvus CLI 帶來最簡單的使用方式，Attu 的特色更多：</p>
<ul>
<li>適用於 Windows 作業系統、macOS 及 Linux 作業系統的安裝程式；</li>
<li>直觀的圖形使用者介面，讓您更容易使用 Milvus；</li>
<li>涵蓋 Milvus 的主要功能；</li>
<li>可擴充自訂功能的外掛程式；</li>
<li>完整的系統拓樸資訊，讓您更容易理解和管理 Milvus 實例。</li>
</ul>
<h2 id="Installation" class="common-anchor-header">安裝<button data-href="#Installation" class="anchor-icon" translate="no">
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
    </button></h2><p>您可以在<a href="https://github.com/zilliztech/attu/releases">GitHub</a> 找到最新的 Attu 版本。Attu 為不同作業系統提供可執行的安裝程式。它是一個開放原始碼的專案，歡迎大家貢獻心力。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/installation_bbe62873af.png" alt="Installation" class="doc-image" id="installation" />
   </span> <span class="img-wrapper"> <span>安裝</span> </span></p>
<p>您也可以透過 Docker 安裝 Attu。</p>
<pre><code translate="no" class="language-shell">docker run -p <span class="hljs-number">8000</span>:<span class="hljs-number">3000</span> -e <span class="hljs-variable constant_">HOST_URL</span>=<span class="hljs-attr">http</span>:<span class="hljs-comment">//{ attu IP }:8000 -e MILVUS_URL={milvus server IP}:19530 zilliz/attu:latest</span>
<button class="copy-code-btn"></button></code></pre>
<p><code translate="no">attu IP</code> 是 Attu 執行環境的 IP 位址，而 是 Milvus 執行環境的 IP 位址。<code translate="no">milvus server IP</code> </p>
<p>成功安裝 Attu 後，您可以在介面中輸入 Milvus IP 和 Port 來啟動 Attu。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/connect_1fde46d9d5.png" alt="Connect Milvus with Attu" class="doc-image" id="connect-milvus-with-attu" />
   </span> <span class="img-wrapper"> <span>使用 Attu 連接 Milvus</span> </span></p>
<h2 id="Feature-overview" class="common-anchor-header">功能總覽<button data-href="#Feature-overview" class="anchor-icon" translate="no">
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
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/overview_591e230514.png" alt="Overview page" class="doc-image" id="overview-page" />
   </span> <span class="img-wrapper"> <span>總覽頁面</span> </span></p>
<p>Attu 介面包括<strong>總覽頁面</strong>、<strong>集合</strong>頁面、<strong>向量搜尋頁</strong>面及<strong>系統檢視頁</strong>面，分別對應左側導覽窗格的四個圖示。</p>
<p><strong>總覽頁</strong>面顯示載入的集合。而<strong>Collection</strong>頁面則列出所有的集合，並顯示它們是否已載入或釋放。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/collection_42656fe308.png" alt="Collection page" class="doc-image" id="collection-page" />
   </span> <span class="img-wrapper"> <span>收藏集頁面</span> </span></p>
<p><strong>Vector Search</strong>和<strong>System View</strong>頁面是 Attu 的外掛程式。外掛的概念和用法將在部落格的最後部分介紹。</p>
<p>您可以在<strong>Vector Search</strong>頁面執行向量相似性搜尋。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/vector_search_be7365687c.png" alt="Vector Search page" class="doc-image" id="vector-search-page" />
   </span> <span class="img-wrapper"> <span>向量搜尋頁面</span> </span></p>
<p>在<strong>System View</strong>頁面，您可以檢查 Milvus 的拓樸結構。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/system_view_e1df15023d.png" alt="System View page" class="doc-image" id="system-view-page" />
   </span> <span class="img-wrapper"> <span>系統檢視頁面</span> </span></p>
<p>您也可以點選節點來查看每個節點的詳細資訊。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/node_view_5bbc25f9b2.png" alt="Node view" class="doc-image" id="node-view" />
   </span> <span class="img-wrapper"> <span>節點檢視</span> </span></p>
<h2 id="Demonstration" class="common-anchor-header">示範<button data-href="#Demonstration" class="anchor-icon" translate="no">
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
    </button></h2><p>讓我們使用測試資料集來探索 Attu。</p>
<p>請查看我們的<a href="https://github.com/zilliztech/attu/tree/main/examples">GitHub 套件</a>，以取得以下測試所使用的資料集。</p>
<p>首先，以下列四個欄位建立一個名為 test 的資料集：</p>
<ul>
<li>欄位名稱：id，主索引欄位</li>
<li>欄位名稱：向量，向量欄位，浮點向量，維度：128</li>
<li>欄位名稱：品牌，標量欄位，Int64</li>
<li>欄位名稱：顏色，標量欄位，Int64</li>
</ul>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/create_collection_95dfa15354.png" alt="Create a collection" class="doc-image" id="create-a-collection" />
   </span> <span class="img-wrapper"> <span>建立集合</span> </span></p>
<p>成功建立集合後，載入集合進行搜尋。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/load_collection_fec39171df.png" alt="Load the collection" class="doc-image" id="load-the-collection" />
   </span> <span class="img-wrapper"> <span>載入集合</span> </span></p>
<p>現在您可以在<strong>總覽頁</strong>面中檢查新建立的集合。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/check_collection_163b05477e.png" alt="Check the collection" class="doc-image" id="check-the-collection" />
   </span> <span class="img-wrapper"> <span>檢查資料集</span> </span></p>
<p>將測試資料集匯入 Milvus。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/import_data_1_f73d71be85.png" alt="Import data" class="doc-image" id="import-data" />
   </span> <span class="img-wrapper"> <span>匯入資料</span> </span></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/import_data_2_4b3c3c3c25.png" alt="Import data" class="doc-image" id="import-data" />
   </span> <span class="img-wrapper"> <span>匯入資料</span> </span></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/import_data_3_0def4e8550.png" alt="Import data" class="doc-image" id="import-data" />
   </span> <span class="img-wrapper"> <span>匯入資料</span> </span></p>
<p>在總覽頁面或集合頁面點選集合名稱，進入查詢介面檢查匯入的資料。</p>
<p>新增篩選器，指定表達式<code translate="no">id != 0</code> ，點選<strong>Apply Filter</strong>，點選<strong>Query</strong>。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/query_data_24d9f71ccc.png" alt="Query data" class="doc-image" id="query-data" />
   </span> <span class="img-wrapper"> <span>查詢資料</span> </span></p>
<p>您會發現所有 50 個實體詞條都已成功匯入。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/query_result_bcbbd17084.png" alt="Query result" class="doc-image" id="query-result" />
   </span> <span class="img-wrapper"> <span>查詢結果</span> </span></p>
<p>讓我們嘗試向量相似性查詢。</p>
<p>從<code translate="no">search_vectors.csv</code> 複製一個向量，貼到<strong>向量值欄位</strong>。選擇集合和欄位。按一下<strong>搜尋</strong>。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/search_data_5af3a1db53.png" alt="Search data" class="doc-image" id="search-data" />
   </span> <span class="img-wrapper"> <span>搜尋資料</span> </span></p>
<p>然後您可以檢查搜尋結果。不需要編譯任何腳本，您就可以輕鬆地使用 Milvus 搜尋。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/search_result_961886efab.png" alt="Search result" class="doc-image" id="search-result" />
   </span> <span class="img-wrapper"> <span>搜尋結果</span> </span></p>
<p>最後，讓我們檢查<strong>系統檢視頁</strong>面。</p>
<p>透過 Milvus Node.js SDK 封裝的 Metrics API，您可以查看系統狀態、節點關係和節點狀態。</p>
<p>作為 Attu 的獨家功能，系統檢視頁面包含完整的系統拓樸圖。點選每個節點，即可檢查其狀態 (每 10 秒刷新一次)。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/topological_graph_d0c5c17586.png" alt="Milvus node topological graph" class="doc-image" id="milvus-node-topological-graph" />
   </span> <span class="img-wrapper"> <span>Milvus 節點拓樸圖</span> </span></p>
<p>按一下每個節點，即可進入<strong>節點清單檢視</strong>。您可以檢查協調節點的所有子節點。透過排序，您可以快速找出 CPU 或記憶體使用率高的節點，並找出系統的問題所在。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/node_list_64fc610a8d.png" alt="Milvus node list" class="doc-image" id="milvus-node-list" />
   </span> <span class="img-wrapper"> <span>Milvus 節點清單</span> </span></p>
<h2 id="Whats-more" class="common-anchor-header">更多內容<button data-href="#Whats-more" class="anchor-icon" translate="no">
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
    </button></h2><p>如前所述，<strong>向量</strong> <strong>搜尋和系統檢視頁</strong>面是 Attu 的外掛程式。我們鼓勵使用者在 Attu 中開發自己的外掛，以符合自己的應用情境。在原始碼中，有一個專為外掛程式碼建立的資料夾。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/plugins_a2d98e4e5b.png" alt="Plugins" class="doc-image" id="plugins" />
   </span> <span class="img-wrapper"> <span>外掛程式</span> </span></p>
<p>您可以參考任何一個外掛來學習如何建立外掛。只要設定以下的 config 檔案，就可以將外掛加入 Attu。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/add_plugins_e3ef53cc0d.png" alt="Add plugins to Attu" class="doc-image" id="add-plugins-to-attu" />
   </span> <span class="img-wrapper"> <span>新增外掛到 Attu</span> </span></p>
<p>您可以參閱<a href="https://github.com/zilliztech/attu/tree/main/doc">Attu GitHub Repo</a>和<a href="https://milvus.io/docs/v2.0.x/attu.md">Milvus 技術文件</a>以獲得詳細說明。</p>
<p>Attu 是一個開源專案。歡迎所有的貢獻。如果您在使用 Attu 時遇到任何問題，您也可以<a href="https://github.com/zilliztech/attu/issues">提出問題</a>。</p>
<p>我們衷心希望 Attu 能帶給您更好的 Milvus 使用經驗。如果您喜歡Attu，或對使用有任何意見，您可以填寫這份<a href="https://wenjuan.feishu.cn/m/cfm?t=suw4QnODU1ui-ok7r">Attu用戶調查問卷</a>，以幫助我們優化Attu，提供更好的用戶體驗。</p>
