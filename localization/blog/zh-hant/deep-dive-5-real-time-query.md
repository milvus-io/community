---
id: deep-dive-5-real-time-query.md
title: 使用 Milvus 向量資料庫進行即時查詢
author: Xi Ge
date: 2022-04-11T00:00:00.000Z
desc: 了解 Milvus 即時查詢的基本機制。
cover: assets.zilliz.com/deep_dive_5_5e9175c7f7.png
tag: Engineering
tags: 'Data science, Database, Technology, Artificial Intelligence, Vector Management'
canonicalUrl: 'https://milvus.io/blog/deep-dive-5-real-time-query.md'
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/deep_dive_5_5e9175c7f7.png" alt="Cover image" class="doc-image" id="cover-image" />
   </span> <span class="img-wrapper"> <span>封面圖片</span> </span></p>
<blockquote>
<p>本文<a href="https://github.com/xige-16">由葛曦</a>撰寫，<a href="https://www.linkedin.com/in/yiyun-n-2aa713163/">倪安琪</a>轉載。</p>
</blockquote>
<p>在上一篇文章中，我們介紹了Milvus中的<a href="https://milvus.io/blog/deep-dive-4-data-insertion-and-data-persistence.md">數據插入和數據持久化</a>。在這篇文章中，我們將繼續解釋 Milvus 中<a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md">不同的元件</a>如何互動來完成即時資料查詢。</p>
<p><em>在開始之前，下面列出了一些有用的資源。我們建議您先閱讀這些資源，以便更好地理解本篇文章的主題。</em></p>
<ul>
<li><a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md">深入了解 Milvus 架構</a></li>
<li><a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md#Data-Model">Milvus 資料模型</a></li>
<li><a href="https://milvus.io/docs/v2.0.x/four_layers.md">Milvus 各個元件的角色與功能</a></li>
<li><a href="https://milvus.io/blog/deep-dive-3-data-processing.md">Milvus 中的資料處理</a></li>
<li><a href="https://milvus.io/blog/deep-dive-4-data-insertion-and-data-persistence.md">Milvus 中的資料插入和資料持久化</a></li>
</ul>
<h2 id="Load-data-to-query-node" class="common-anchor-header">將資料載入查詢節點<button data-href="#Load-data-to-query-node" class="anchor-icon" translate="no">
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
    </button></h2><p>在執行查詢之前，必須先將資料載入查詢節點。</p>
<p>有兩種類型的資料會被載入查詢節點：來自<a href="https://milvus.io/docs/v2.0.x/four_layers.md#Log-broker">日誌代理</a>的串流資料，以及來自<a href="https://milvus.io/docs/v2.0.x/four_layers.md#Object-storage">物件儲存</a>（以下也稱為持久化儲存）的歷史資料。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/flowchart_b1c51dfdaa.png" alt="Flowchart" class="doc-image" id="flowchart" />
   </span> <span class="img-wrapper"> <span>流程圖</span> </span></p>
<p>Data coord 負責處理不斷插入 Milvus 的串流資料。當 Milvus 使用者呼叫<code translate="no">collection.load()</code> 載入一個資料集時，查詢協調器會查詢資料協調器，以瞭解哪些片段已被持久化儲存及其對應的檢查點。檢查點（checkpoint）是一個標記，表示在檢查點之前被持久化的區段會被消耗，而檢查點之後的區段不會被消耗。</p>
<p>然後，查詢協調器根據資料協調器的資訊輸出分配策略：按區段或按通道。段分配器負責將持久性儲存（批次資料）中的段分配給不同的查詢節點。例如，在上圖中，區段分配器將區段 1 和 3 (S1, S3) 分配給查詢節點 1，將區段 2 和 4 (S2, S4) 分配給查詢節點 2。通道分配器會指派不同的查詢節點觀看日誌代理程式中的多個資料操作<a href="https://milvus.io/docs/v2.0.x/data_processing.md#Data-insertion">通道</a>(DMChannels)。例如，在上圖中，通道分配器指派查詢節點 1 觀看通道 1 (Ch1)，指派查詢節點 2 觀看通道 2 (Ch2)。</p>
<p>在此分配策略下，每個查詢節點會載入段資料，並依此觀看頻道。在圖中的查詢節點 1 中，歷史資料 (批次資料) 透過分配的 S1 和 S3 從持久性儲存空間載入。同時，查詢節點 1 透過訂閱日誌經紀人的頻道 1 載入增量資料 (串流資料)。</p>
<h2 id="Data-management-in-query-node" class="common-anchor-header">查詢節點的資料管理<button data-href="#Data-management-in-query-node" class="anchor-icon" translate="no">
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
    </button></h2><p>查詢節點需要管理歷史和增量資料。歷史資料儲存在<a href="https://milvus.io/blog/deep-dive-4-data-insertion-and-data-persistence.md#Sealed-segment">封存區段</a>中，而增量資料則儲存在<a href="https://milvus.io/blog/deep-dive-4-data-insertion-and-data-persistence.md#Growing-segment">成長</a>中<a href="https://milvus.io/blog/deep-dive-4-data-insertion-and-data-persistence.md#Growing-segment">的區段</a>中。</p>
<h3 id="Historical-data-management" class="common-anchor-header">歷史資料管理</h3><p>歷史資料管理主要有兩個考量：負載平衡和查詢節點故障移轉。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/load_balance_c77e22bb5c.png" alt="Load balance" class="doc-image" id="load-balance" />
   </span> <span class="img-wrapper"> <span>負載平衡</span> </span></p>
<p>例如，如圖所示，查詢節點 4 獲分配的密封區段比其他查詢節點多。這很有可能使查詢節點 4 成為瓶頸，拖慢整個查詢流程。為了解決這個問題，系統需要將查詢節點 4 中的數個網段分配給其他查詢節點。這稱為負載平衡。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Query_node_failover_3278c0e307.png" alt="Query node failover" class="doc-image" id="query-node-failover" />
   </span> <span class="img-wrapper"> <span>查詢節點故障移轉</span> </span></p>
<p>另一種可能的情況如上圖所示。其中一個節點 (查詢節點 4) 突然宕機。在這種情況下，負載 (分配給查詢節點 4 的區段) 需要轉移到其他工作的查詢節點，以確保查詢結果的準確性。</p>
<h3 id="Incremental-data-management" class="common-anchor-header">增量資料管理</h3><p>查詢節點觀看 DMChannels 以接收增量資料。在此過程中會引入 Flowgraph。它首先過濾所有資料插入訊息。這是為了確保只有指定分區的資料會被載入。Milvus 中的每個集合都有相對應的通道，該通道由該集合中的所有分割區共享。因此，如果 Milvus 使用者只需要載入某個分割區中的資料，就需要流程圖來過濾插入的資料。否則，集合中所有分區的資料都會載入查詢節點。</p>
<p>經過篩選後，增量資料會插入到成長中的區段，並進一步傳送到伺服器時間節點。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/flow_graph_dc58651367.png" alt="Flowgraph" class="doc-image" id="flowgraph" />
   </span> <span class="img-wrapper"> <span>流程圖</span> </span></p>
<p>在資料插入過程中，每個插入訊息都會指定一個時間戳記。在上圖所示的 DMChannel 中，資料從左至右依序插入。第一個插入訊息的時間戳是 1；第二個是 2；第三個是 6。 第四個以紅色標示的訊息不是插入訊息，而是時間戳訊息。這表示時間戳小於這個時間刻度的插入資料已經在日誌經紀人中。換句話說，在此 timetick 訊息之後插入的資料，其時間戳值都應該大於此 timetick。例如，在上圖中，當查詢節點感知到目前的 timetick 為 5 時，表示所有時間戳值小於 5 的插入訊息都會被載入查詢節點。</p>
<p>伺服器時間節點每次收到插入節點的 timetick 時，都會提供一個更新的<code translate="no">tsafe</code> 值。<code translate="no">tsafe</code> 表示安全時間，所有在這個時間點之前插入的資料都可以被查詢。舉例來說，如果<code translate="no">tsafe</code> = 9，小於 9 的時間戳的插入資料都可以被查詢。</p>
<h2 id="Real-time-query-in-Milvus" class="common-anchor-header">Milvus 中的實時查詢<button data-href="#Real-time-query-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 的即時查詢是透過查詢訊息來啟用的。查詢訊息由代理插入日誌經紀人。然後，查詢節點透過觀看日誌經紀人的查詢通道來取得查詢訊息。</p>
<h3 id="Query-message" class="common-anchor-header">查詢訊息</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/query_message_4d57814f47.png" alt="Query message" class="doc-image" id="query-message" />
   </span> <span class="img-wrapper"> <span>查詢訊息</span> </span></p>
<p>查詢訊息包括以下關於查詢的重要資訊：</p>
<ul>
<li><code translate="no">msgID</code>:訊息 ID，系統指定的查詢訊息 ID。</li>
<li><code translate="no">collectionID</code>:要查詢的集合 ID (如果使用者指定)。</li>
<li><code translate="no">execPlan</code>:執行計畫主要用於查詢中的屬性篩選。</li>
<li><code translate="no">service_ts</code>:服務時間戳會與上述<code translate="no">tsafe</code> 一起更新。服務時間戳表示服務是在哪個時間點。在<code translate="no">service_ts</code> 之前插入的所有資料都可供查詢。</li>
<li><code translate="no">travel_ts</code>:行程時間戳指定過去的時間範圍。查詢將在<code translate="no">travel_ts</code> 指定的時間範圍內的資料上進行。</li>
<li><code translate="no">guarantee_ts</code>:Guarantee timestamp（保證時間戳記）：保證時間戳記指定查詢需要進行的時間段。只有當<code translate="no">service_ts</code> &gt;<code translate="no">guarantee_ts</code> 時，才會進行查詢。</li>
</ul>
<h3 id="Real-time-query" class="common-anchor-header">即時查詢</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/query_process_7f676972d8.png" alt="Query process" class="doc-image" id="query-process" />
   </span> <span class="img-wrapper"> <span>查詢流程</span> </span></p>
<p>當收到查詢訊息時，Milvus 會先判斷目前的服務時間<code translate="no">service_ts</code> 是否大於查詢訊息中的保證時間戳<code translate="no">guarantee_ts</code> 。如果是，則執行查詢。查詢會在歷史資料和增量資料上平行進行。由於串流資料和批次資料之間可能會有資料重疊，因此需要一個稱為 "local reduce "的動作來過濾掉多餘的查詢結果。</p>
<p>然而，如果當前的服務時間小於新插入查詢訊息中的保證時間戳，則查詢訊息將成為未解決的訊息，等待服務時間大於保證時間戳時再進行處理。</p>
<p>查詢結果最終會推送到結果通道。代理從該通道取得查詢結果。同樣地，proxy 也會進行「全域還原」，因為它會收到來自多個查詢節點的結果，而且查詢結果可能是重複的。</p>
<p>為了確保代理程式在回傳所有查詢結果給 SDK 之前，已經收到所有查詢結果，結果訊息也會保留資訊記錄，包括搜尋過的封閉區段、搜尋過的 DMChannels，以及全局封閉區段 (所有查詢節點上的所有區段)。只有滿足以下兩個條件，系統才能斷定代理已收到所有查詢結果：</p>
<ul>
<li>所有結果訊息中記錄的所有搜尋的封存區段的聯合大於全局封存區段、</li>
<li>集合中的所有 DMChannels 都被查詢。</li>
</ul>
<p>最後，proxy 將「全域還原」後的最終結果回傳給 Milvus SDK。</p>
<h2 id="About-the-Deep-Dive-Series" class="common-anchor-header">關於 Deep Dive 系列<button data-href="#About-the-Deep-Dive-Series" class="anchor-icon" translate="no">
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
    </button></h2><p>隨著 Milvus 2.0<a href="https://milvus.io/blog/2022-1-25-annoucing-general-availability-of-milvus-2-0.md">正式宣布全面上市</a>，我們安排了這個 Milvus Deep Dive 系列部落格，提供對 Milvus 架構和原始碼的深入詮釋。本系列部落格涵蓋的主題包括</p>
<ul>
<li><a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md">Milvus 架構概述</a></li>
<li><a href="https://milvus.io/blog/deep-dive-2-milvus-sdk-and-api.md">API 與 Python SDK</a></li>
<li><a href="https://milvus.io/blog/deep-dive-3-data-processing.md">資料處理</a></li>
<li><a href="https://milvus.io/blog/deep-dive-4-data-insertion-and-data-persistence.md">資料管理</a></li>
<li><a href="https://milvus.io/blog/deep-dive-5-real-time-query.md">即時查詢</a></li>
<li><a href="https://milvus.io/blog/deep-dive-7-query-expression.md">標量執行引擎</a></li>
<li><a href="https://milvus.io/blog/deep-dive-6-oss-qa.md">QA 系統</a></li>
<li><a href="https://milvus.io/blog/deep-dive-8-knowhere.md">向量執行引擎</a></li>
</ul>
