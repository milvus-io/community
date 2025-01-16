---
id: deep-dive-3-data-processing.md
title: 向量資料庫如何處理資料？
author: Zhenshan Cao
date: 2022-03-28T00:00:00.000Z
desc: Milvus 提供生產型 AI 應用程式不可或缺的資料管理基礎架構。本文揭開資料處理的複雜內幕。
cover: assets.zilliz.com/How_Is_Data_Processed_in_a_Vector_Database_9fb236bc01.png
tag: Engineering
tags: 'Data science, Database, Technology, Artificial Intelligence, Vector Management'
canonicalUrl: 'https://milvus.io/blog/deep-dive-3-data-processing.md'
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/How_Is_Data_Processed_in_a_Vector_Database_9fb236bc01.png" alt="Cover image" class="doc-image" id="cover-image" />
   </span> <span class="img-wrapper"> <span>封面圖片</span> </span></p>
<blockquote>
<p>本文由<a href="https://github.com/czs007">曹振山</a>撰寫，<a href="https://www.linkedin.com/in/yiyun-n-2aa713163/">倪安琪</a>轉載。</p>
</blockquote>
<p>在本博客系列的前兩篇文章中，我們已經介紹了世界上最先進的向量資料庫 Milvus 的<a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md">系統架構</a>，以及它的<a href="https://milvus.io/blog/deep-dive-2-milvus-sdk-and-api.md">Python SDK 和 API</a>。</p>
<p>這篇文章主要是希望透過深入了解 Milvus 系統，以及檢視資料處理元件之間的互動關係，幫助您瞭解 Milvus 是如何處理資料的。</p>
<p><em>在開始之前，下面列出了一些有用的資源。我們建議您先閱讀這些資源，以便更好地理解本文章的主題。</em></p>
<ul>
<li><a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md">深入了解 Milvus 架構</a></li>
<li><a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md#Data-Model">Milvus 資料模型</a></li>
<li><a href="https://milvus.io/docs/v2.0.x/four_layers.md">每個 Milvus 元件的角色和功能</a></li>
<li><a href="https://milvus.io/docs/v2.0.x/data_processing.md">Milvus 中的資料處理</a></li>
</ul>
<h2 id="MsgStream-interface" class="common-anchor-header">MsgStream 介面<button data-href="#MsgStream-interface" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://github.com/milvus-io/milvus/blob/ca129d4308cc7221bb900b3722dea9b256e514f9/docs/developer_guides/chap04_message_stream.md">MsgStream 介面</a>對 Milvus 的資料處理非常重要。當<code translate="no">Start()</code> 被呼叫時，後台的 coroutine 將資料寫入<a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md#Log-as-data">log broker</a>或從那裡讀取資料。當<code translate="no">Close()</code> 被呼叫時，coroutine 停止。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Msg_Stream_interface_66b70309a7.png" alt="MsgStream interface" class="doc-image" id="msgstream-interface" />
   </span> <span class="img-wrapper"> <span>MsgStream 介面</span> </span></p>
<p>MsgStream 可以作為生產者和消費者。<code translate="no">AsProducer(channels []string)</code> 介面將 MsgStream 定義為生產者，而<code translate="no">AsConsumer(channels []string, subNamestring)</code>則將其定義為消費者。<code translate="no">channels</code> 這個參數在兩個介面中都是共用的，用來定義要寫入資料或讀取資料的 (實體) 通道。</p>
<blockquote>
<p>集合中的分片數量可以在建立集合時指定。每個分片對應一個<a href="https://milvus.io/docs/v2.0.x/glossary.md#VChannel">虛擬通道 (vchannel)</a>。因此，一個集合可以有多個 vchannel。Milvus 會為記錄中介中的每個 v 通道指定一個<a href="https://milvus.io/docs/v2.0.x/glossary.md#PChannel">實體通道 (pchannel)</a>。</p>
</blockquote>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Each_virtual_channel_shard_corresponds_to_a_physical_channel_7cd60e4ed1.png" alt="Each virtual channel/shard corresponds to a physical channel." class="doc-image" id="each-virtual-channel/shard-corresponds-to-a-physical-channel." />
   </span> <span class="img-wrapper"> <span>每個虛擬通道/shard 對應一個實體通道</span>。 </span></p>
<p><code translate="no">Produce()</code> 在 MsgStream 介面中，負責將資料寫入 log broker 中的 pchannel。資料可以兩種方式寫入：</p>
<ul>
<li>單一寫入：實體依據主鍵的散列值寫入不同的分片 (vchannel)。然後，這些實體會流入日誌經紀人中對應的 pnchanels。</li>
<li>廣播寫入：實體會寫入參數<code translate="no">channels</code> 指定的所有 pchannels。</li>
</ul>
<p><code translate="no">Consume()</code> 是一種封鎖式 API。如果指定的 pchannel 中沒有可用的資料，則當在 MsgStream 介面中呼叫 時，coroutine 將被阻塞。另一方面， 是一種非阻塞式 API，這表示只有在指定的 pchannel 中存在現有資料時，coroutine 才會讀取和處理資料。否則，coroutine 可以處理其他任務，不會在沒有可用資料時阻塞。<code translate="no">Consume()</code> <code translate="no">Chan()</code> </p>
<p><code translate="no">Seek()</code> 是故障恢復的方法。當一個新的節點啟動時，可以取得資料消耗記錄，並透過呼叫 從中斷的地方恢復資料消耗。<code translate="no">Seek()</code></p>
<h2 id="Write-data" class="common-anchor-header">寫入資料<button data-href="#Write-data" class="anchor-icon" translate="no">
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
    </button></h2><p>寫入不同 v 通道 (shards) 的資料可以是插入訊息或刪除訊息。這些 vchannels 也可以稱為 DmChannels（資料操作通道）。</p>
<p>不同的集合可以在日誌中介中共用相同的 pchannels。一個集合可以有多個分片，因此也可以有多個對應的 v 通道。因此，同一集合中的實體會流入日誌中介中多個對應的 pchannels。因此，共用 pchannels 的好處是透過日誌經紀人的高並發能力來增加吞吐量。</p>
<p>當建立一個集合時，不僅要指定分片的數量，還要決定日誌經紀人中 vchannels 和 pchannels 之間的映射。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Write_path_in_Milvus_00d93fb377.png" alt="Write path in Milvus" class="doc-image" id="write-path-in-milvus" />
   </span> <span class="img-wrapper"> <span>Milvus 中的寫入路徑</span> </span></p>
<p>如上圖所示，在寫入路徑中，代理透過 MsgStream 的<code translate="no">AsProducer()</code> 介面將資料寫入日誌經紀人。然後，資料節點消耗資料，再將消耗的資料轉換並儲存到物件儲存中。儲存路徑是一種元資訊，會由資料協調器記錄在 etcd 中。</p>
<h3 id="Flowgraph" class="common-anchor-header">流程圖</h3><p>由於不同的集合可能會共用日誌經紀人中相同的 pnchanels，因此在消耗資料時，資料節點或查詢節點需要判斷 pchannel 中的資料屬於哪個集合。為了解決這個問題，我們在 Milvus 中引入了 flowgraph。它主要負責根據集合 ID 過濾共用 pchannel 中的資料。因此，我們可以說每個 flowgraph 處理集合中相對應的 shard (vchannel) 的資料流。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Flowgraph_in_write_path_1b201e1b71.png" alt="Flowgraph in write path" class="doc-image" id="flowgraph-in-write-path" />
   </span> <span class="img-wrapper"> <span>寫入路徑中的流程圖</span> </span></p>
<h3 id="MsgStream-creation" class="common-anchor-header">MsgStream 建立</h3><p>寫入資料時，MsgStream 物件會在下列兩種情況下建立：</p>
<ul>
<li>當代理程式接收到資料插入請求時，它會先嘗試透過根協調器 (root coordinator) 取得 vchannel 和 pchannels 之間的對應關係。然後，代理會建立一個 MsgStream 物件。</li>
</ul>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Creating_Msg_Stream_object_in_write_path_Scenario_1_bdd0f94d8b.png" alt="Scenario 1" class="doc-image" id="scenario-1" />
   </span> <span class="img-wrapper"> <span>情況一</span> </span></p>
<ul>
<li>當資料節點啟動並讀取 etcd 中通道的 meta 資訊時，會建立 MsgStream 物件。</li>
</ul>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Creating_Msg_Stream_object_in_write_path_Scenario_2_5b3f99a6d1.png" alt="Scenario 2" class="doc-image" id="scenario-2" />
   </span> <span class="img-wrapper"> <span>情況 2</span> </span></p>
<h2 id="Read-data" class="common-anchor-header">讀取資料<button data-href="#Read-data" class="anchor-icon" translate="no">
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
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Read_path_in_Milvus_c2f0ae5109.png" alt="Read path in Milvus" class="doc-image" id="read-path-in-milvus" />
   </span> <span class="img-wrapper"> <span>在 Milvus 中讀取路徑</span> </span></p>
<p>讀取資料的一般工作流程如上圖所示。查詢請求透過 DqRequestChannel 廣播到查詢節點。查詢節點並行執行查詢任務。來自查詢節點的查詢結果會透過 gRPC 和代理匯總結果，並將結果回傳給用戶端。</p>
<p>要仔細觀察資料讀取過程，我們可以看到代理將查詢請求寫入 DqRequestChannel。然後查詢節點透過訂閱 DqRequestChannel 來消耗訊息。DqRequestChannel 中的每條訊息都會進行廣播，讓所有訂閱的查詢節點都能收到訊息。</p>
<p>當查詢節點收到查詢請求時，它們會對儲存於密封區段的批次資料，以及動態插入 Milvus 並儲存於成長區段的串流資料進行本機查詢。之後，查詢節點需要聚合<a href="https://milvus.io/docs/v2.0.x/glossary.md#Segment">密封區段和成長區段</a>中的查詢結果。這些聚合結果會透過 gRPC 傳送給代理。</p>
<p>代理收集來自多個查詢節點的所有結果，然後匯總這些結果以獲得最終結果。然後，代理將最終的查詢結果回傳給用戶端。由於每個查詢請求及其對應的查詢結果都有相同的唯一 requestID，因此代理可以找出哪個查詢結果對應於哪個查詢請求。</p>
<h3 id="Flowgraph" class="common-anchor-header">流程圖</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Flowgraph_in_read_path_8a5faf2d58.png" alt="Flowgraph in read path" class="doc-image" id="flowgraph-in-read-path" />
   </span> <span class="img-wrapper"> <span>讀取路徑中的流程圖</span> </span></p>
<p>類似於寫入路徑，讀取路徑中也引入了 flowgraph。Milvus 實現了統一的 Lambda 架構，整合了增量資料和歷史資料的處理。因此，查詢節點也需要取得即時的串流資料。同樣地，讀取路徑中的 flowgraph 也會過濾和區分來自不同集合的資料。</p>
<h3 id="MsgStream-creation" class="common-anchor-header">建立 MsgStream</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Creating_Msg_Stream_object_in_read_path_7f059bde2f.png" alt="Creating MsgStream object in read path" class="doc-image" id="creating-msgstream-object-in-read-path" />
   </span> <span class="img-wrapper"> <span>在讀取路徑中建立 MsgStream 物件</span> </span></p>
<p>讀取資料時，MsgStream 物件會在以下情況建立：</p>
<ul>
<li>在 Milvus 中，除非資料已被載入，否則無法讀取資料。當代理收到資料載入請求時，它會將請求傳送至查詢協調器，由查詢協調器決定將分片指派給不同查詢節點的方式。分配資訊（即 vchannels 的名稱以及 vchannels 與其對應的 pchannels 之間的映射）會透過方法呼叫或 RPC（遠端程序呼叫）傳送至查詢節點。隨後，查詢節點會建立相應的 MsgStream 物件來消耗資料。</li>
</ul>
<h2 id="DDL-operations" class="common-anchor-header">DDL 作業<button data-href="#DDL-operations" class="anchor-icon" translate="no">
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
    </button></h2><p>DDL 代表資料定義語言。元資料上的 DDL 作業可分為寫入請求與讀取請求。不過，在處理元資料時，這兩種請求會被同等對待。</p>
<p>元資料上的讀取請求包括</p>
<ul>
<li>查詢集合模式</li>
<li>查詢索引資訊 等等</li>
</ul>
<p>寫入請求包括</p>
<ul>
<li>建立資料集</li>
<li>刪除集合</li>
<li>建立索引</li>
<li>丟棄索引 還有更多</li>
</ul>
<p>DDL 請求從用戶端傳送至代理，代理進一步將這些請求以接收到的順序傳送給根協調器，根協調器為每個 DDL 請求指定一個時間戳，並對請求進行動態檢查。代理以序列方式處理每個請求，也就是一次處理一個 DDL 請求。代理在完成處理上一個請求並從根坐標收到結果之前，不會處理下一個請求。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/DDL_operations_02679a393c.png" alt="DDL operations." class="doc-image" id="ddl-operations." />
   </span> <span class="img-wrapper"> <span>DDL 操作</span>。 </span></p>
<p>如上圖所示，Root coord 任務佇列中有<code translate="no">K</code> DDL 請求。任务队列中的 DDL 请求按照根协调器收到的顺序排列。因此，<code translate="no">ddl1</code> 是第一個傳送給根協調，而<code translate="no">ddlK</code> 是這一批中的最後一個。根協調器會按照時間順序逐一處理這些請求。</p>
<p>在分散式系統中，代理伺服器與根協調器之間的通訊是透過 gRPC 來啟用的。根協調器會保留已執行任務的最大時間戳值記錄，以確保所有 DDL 請求都會依時間順序處理。</p>
<p>假設有兩個獨立的代理，代理 1 和代理 2。它們都會傳送 DDL 請求到相同的根目錄。但是，有一個問題是，較早的請求不一定會在較後的另一個代理收到的請求之前傳送到根協定。例如，在上圖中，當<code translate="no">DDL_K-1</code> 從代理 1 傳送至根坐標時，代理 2 的<code translate="no">DDL_K</code> 已經被根坐標接受並執行。根據根坐標的記錄，此時已執行任務的最大時間戳值為<code translate="no">K</code> 。因此，為了不打亂時間順序，根目錄的任務佇列將拒絕<code translate="no">DDL_K-1</code> 的請求。但是，如果代理 2 在此點將請求<code translate="no">DDL_K+5</code> 傳送給根坐標，則該請求將被接受到任務佇列，並將在稍後根據其時間戳值執行。</p>
<h2 id="Indexing" class="common-anchor-header">建立索引<button data-href="#Indexing" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Building-an-index" class="common-anchor-header">建立索引</h3><p>當從用戶端接收到建立索引的請求時，代理會先對這些請求進行靜態檢查，然後將它們傳送給根協調。然後，根協調器會將這些索引建立請求持久化到元儲存 (etcd) 中，並將請求傳送給索引協調器 (索引協調器)。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Building_an_index_e130a4e715.png" alt="Building an index." class="doc-image" id="building-an-index." />
   </span> <span class="img-wrapper"> <span>建立索引</span>。 </span></p>
<p>如上圖所示，當索引協調器收到來自根協調器的索引建立請求時，它會先將任務持久化到 etcd 中的元儲存區。索引建立任務的初始狀態是<code translate="no">Unissued</code> 。索引協調會維護每個索引節點的任務負載記錄，並將進入的任務傳送到負載較少的索引節點。任務完成後，索引節點會將該任務的狀態<code translate="no">Finished</code> 或<code translate="no">Failed</code> 寫入 meta 儲存，也就是 Milvus 中的 etcd。之後，索引協調器就會透過在 etcd 中查詢，瞭解建立索引的任務是成功還是失敗。如果任務因為系統資源有限或索引節點丟失而失敗，索引協調器會重新觸發整個流程，並將相同的任務指派給另一個索引節點。</p>
<h3 id="Dropping-an-index" class="common-anchor-header">丟棄索引</h3><p>此外，索引協調員也負責刪除索引的請求。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Dropping_an_index_afdab6a339.png" alt="Dropping an index." class="doc-image" id="dropping-an-index." />
   </span> <span class="img-wrapper"> <span>丟棄索引</span> </span></p>
<p>當根協調器收到用戶端的刪除索引請求時，它會首先將索引標記為 &quot;drop&quot;，並將結果返回給用戶端，同時通知索引協調器。然後，索引協調器使用<code translate="no">IndexID</code> 過濾所有索引任務，符合條件的任務會被丟棄。</p>
<p>索引協調器的背景 coroutine 會逐漸從物件儲存空間 (MinIO 和 S3) 刪除所有標示為 "dropped" 的索引任務。這個過程涉及 recycleIndexFiles 介面。當所有對應的索引檔案刪除後，被刪除索引任務的元資訊也會從元儲存 (etcd) 中移除。</p>
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
