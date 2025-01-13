---
id: deep-dive-4-data-insertion-and-data-persistence.md
title: 向量資料庫中的資料插入和資料持久性
author: Bingyi Sun
date: 2022-04-06T00:00:00.000Z
desc: 了解 Milvus 向量資料庫中資料插入和資料持久化背後的機制。
cover: assets.zilliz.com/Deep_Dive_4_812021d715.png
tag: Engineering
tags: 'Data science, Database, Technology, Artificial Intelligence, Vector Management'
canonicalUrl: 'https://milvus.io/blog/deep-dive-4-data-insertion-and-data-persistence.md'
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Deep_Dive_4_812021d715.png" alt="Cover image" class="doc-image" id="cover-image" />
   </span> <span class="img-wrapper"> <span>封面圖片</span> </span></p>
<blockquote>
<p>本文作者：<a href="https://github.com/sunby">孫秉義</a>，<a href="https://www.linkedin.com/in/yiyun-n-2aa713163/">倪安琪</a>轉載。</p>
</blockquote>
<p>在 Deep Dive 系列的上一篇文章中，我們介紹了世界上最先進的向量資料庫<a href="https://milvus.io/blog/deep-dive-3-data-processing.md">Milvus 是如何處理資料的</a>。在這篇文章中，我們將繼續檢視資料插入所涉及的組件，詳細說明Milvus的資料模型，並解釋Milvus是如何實現資料持久化的。</p>
<p>跳到</p>
<ul>
<li><a href="#Milvus-architecture-recap">Milvus 架構重溫</a></li>
<li><a href="#The-portal-of-data-insertion-requests">資料插入請求的入口</a></li>
<li><a href="#Data-coord-and-data-node">資料坐標和資料節點</a></li>
<li><a href="#Root-coord-and-Time-Tick">根坐標和時間標記</a></li>
<li><a href="#Data-organization-collection-partition-shard-channel-segment">資料組織：集合、分割、分片 (通道)、區段</a></li>
<li><a href="#Data-allocation-when-and-how">資料分配：何時及如何分配</a></li>
<li><a href="#Binlog-file-structure-and-data-persistence">Binlog 檔案結構與資料持久性</a></li>
</ul>
<h2 id="Milvus-architecture-recap" class="common-anchor-header">Milvus 架構重溫<button data-href="#Milvus-architecture-recap" class="anchor-icon" translate="no">
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
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Milvus_architecture_c7910cb89d.png" alt="Milvus architecture." class="doc-image" id="milvus-architecture." />
   </span> <span class="img-wrapper"> <span>Milvus 架構</span>。 </span></p>
<p>SDK 透過負載平衡器將資料請求傳送到代理，也就是入口網站。然後，代理與協調器服務互動，將 DDL（資料定義語言）和 DML（資料操作語言）請求寫入訊息儲存中。</p>
<p>工作節點（包括查詢節點、資料節點和索引節點）從訊息儲存中消耗這些請求。具體來說，查詢節點負責資料查詢；資料節點負責資料插入和資料持久化；索引節點主要處理索引建立和查詢加速。</p>
<p>底層是物件儲存，主要利用 MinIO、S3 和 AzureBlob 來儲存日誌、delta binlog 和索引檔案。</p>
<h2 id="The-portal-of-data-insertion-requests" class="common-anchor-header">資料插入請求的入口<button data-href="#The-portal-of-data-insertion-requests" class="anchor-icon" translate="no">
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
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Proxy_in_Milvus_aa6b724e0b.jpeg" alt="Proxy in Milvus." class="doc-image" id="proxy-in-milvus." />
   </span> <span class="img-wrapper"> <span>Milvus 中的 Proxy</span>。 </span></p>
<p>Proxy 是資料插入請求的入口。</p>
<ol>
<li>最初，代理接受 SDK 的資料插入請求，並使用哈希演算法將這些請求分配到幾個資料桶中。</li>
<li>接著，代理請求資料協調員 (data coord) 分配區段 (segments)，這是 Milvus 用來儲存資料的最小單位。</li>
<li>之後，代理程式會將所要求的區段資訊插入訊息儲存區，以避免這些資訊遺失。</li>
</ol>
<h2 id="Data-coord-and-data-node" class="common-anchor-header">資料坐標與資料節點<button data-href="#Data-coord-and-data-node" class="anchor-icon" translate="no">
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
    </button></h2><p>Data coord 的主要功能是管理通道和段的分配，而 Data node 的主要功能是消耗和持久化插入的資料。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Data_coord_and_data_node_in_Milvus_8bcf010f9e.jpeg" alt="Data coord and data node in Milvus." class="doc-image" id="data-coord-and-data-node-in-milvus." />
   </span> <span class="img-wrapper"> <span>Milvus 中的資料協調器和資料節點</span>。 </span></p>
<h3 id="Function" class="common-anchor-header">功能</h3><p>資料協調器的功能如下：</p>
<ul>
<li><p><strong>分配區段空間</strong>資料協調器分配成長中的區段空間給代理，以便代理可以使用區段中的可用空間插入資料。</p></li>
<li><p><strong>記錄分段分配和分段中已分配空間的到期時間</strong>由 data coord 分配的每個分段中的空間不是永久性的，因此，data coord 也需要記錄每個分段分配的到期時間。</p></li>
<li><p><strong>自動沖洗區段資料</strong>如果區段已滿，資料協調器會自動觸發資料沖洗。</p></li>
<li><p><strong>為資料節點分配通道</strong>一個集合可以有多個<a href="https://milvus.io/docs/v2.0.x/glossary.md#VChannel">vnchanels</a>。資料協調器決定哪些 v 通道由哪些資料節點使用。</p></li>
</ul>
<p>資料節點在以下方面提供服務：</p>
<ul>
<li><p><strong>消耗資料 資料</strong>節點從資料協調器分配的通道消耗資料，並為資料建立序列。</p></li>
<li><p><strong>資料持久</strong>化 在記憶體中快取插入的資料，並在資料量達到特定臨界值時，自動將插入的資料刷新到磁碟。</p></li>
</ul>
<h3 id="Workflow" class="common-anchor-header">工作流程</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/One_vchannel_can_only_be_assigned_to_one_data_node_14aa3bd718.png" alt="One vchannel can only be assigned to one data node." class="doc-image" id="one-vchannel-can-only-be-assigned-to-one-data-node." />
   </span> <span class="img-wrapper"> <span>一個 vchannel 只能指定給一個資料節點</span>。 </span></p>
<p>如上圖所示，集合有四個 v 通道 (V1、V2、V3 和 V4)，而有兩個資料節點。資料協調器很可能會指派一個資料節點消耗來自 V1 和 V2 的資料，而另一個資料節點則消耗來自 V3 和 V4 的資料。單一 vchannel 不能指派給多個資料節點，這是為了防止重複消耗資料，否則會造成同一批資料重複插入同一區段。</p>
<h2 id="Root-coord-and-Time-Tick" class="common-anchor-header">Root coord 和 Time Tick<button data-href="#Root-coord-and-Time-Tick" class="anchor-icon" translate="no">
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
    </button></h2><p>Root coord 管理 TSO (時間戳 Oracle)，並在全球發佈 Time Tick 訊息。每個資料插入請求都有一個由根坐標指定的時間戳。Time Tick 是 Milvus 的基石，它就像 Milvus 中的時鐘，標誌著 Milvus 系統處於哪個時間點。</p>
<p>在 Milvus 中寫入資料時，每個資料插入請求都帶有時間戳。在資料消耗時，每個時間資料節點消耗時間戳在一定範圍內的資料。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/An_example_of_data_insertion_and_data_consumption_based_on_timestamp_e820f682f9.jpeg" alt="An example of data insertion and data consumption based on timestamp." class="doc-image" id="an-example-of-data-insertion-and-data-consumption-based-on-timestamp." />
   </span> <span class="img-wrapper"> <span>一個基於時間戳的資料插入和資料消耗的例子</span>。 </span></p>
<p>上圖是資料插入的過程。時間戳的值用數字 1,2,6,5,7,8 表示。資料由兩個代理程式寫入系統：p1 和 p2。在資料消耗期間，如果 Time Tick 的目前時間是 5，資料節點只能讀取資料 1 和 2。然後在第二次讀取時，如果 Time Tick 的目前時間變成 9，資料節點就可以讀取資料 6、7、8。</p>
<h2 id="Data-organization-collection-partition-shard-channel-segment" class="common-anchor-header">資料組織：集合、分割、分片 (通道)、區段<button data-href="#Data-organization-collection-partition-shard-channel-segment" class="anchor-icon" translate="no">
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
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Data_organization_in_Milvus_75ad710752.jpeg" alt="Data organization in Milvus." class="doc-image" id="data-organization-in-milvus." />
   </span> <span class="img-wrapper"> <span>Milvus 中的資料組織</span>。 </span></p>
<p>請先閱讀這<a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md#Data-Model">篇文章</a>，瞭解 Milvus 中的資料模型，以及 collection、shard、partition 和 segment 的概念。</p>
<p>總而言之，Milvus 中最大的資料單位是集合，集合可比喻為關係資料庫中的資料表。一個集合可以有多個分塊（每個分塊對應於一個通道），每個分塊中也可以有多個分區。如上圖所示，通道（分片）是垂直的長條，而分區則是水平的長條。每個交叉點都是區段的概念，也就是資料分配的最小單位。在 Milvus 中，索引建立在段上。在查詢過程中，Milvus 系統也會平衡不同查詢節點的查詢負載，而這個過程是以區段為單位進行的。分段包含數個<a href="https://milvus.io/docs/v2.0.x/glossary.md#Binlog">binlog</a>，當分段資料消耗完畢後，會產生一個 binlog 檔案。</p>
<h3 id="Segment" class="common-anchor-header">區段</h3><p>在 Milvus 中，有三種狀態不同的段落：成長中的段落、封閉中的段落和被沖洗的段落。</p>
<h4 id="Growing-segment" class="common-anchor-header">成長中的區段</h4><p>成長中的區段是一個新建立的區段，可以分配給代理插入資料。段的內部空間可以是已使用、已分配或已釋放。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Three_status_in_a_growing_segment_bdae45e26f.png" alt="Three status in a growing segment" class="doc-image" id="three-status-in-a-growing-segment" />
   </span> <span class="img-wrapper"> <span>成長中的區段有三種狀態</span> </span></p>
<ul>
<li>已使用：成長中區段的這部分空間已被資料節點消耗。</li>
<li>已分配：成長中區段的這部分空間已由代理程式請求，並由資料協調器分配。已分配的空間會在一段時間後過期。</li>
<li>Free: 成長中區段的這部分空間未被使用。可用空間的值等於該區段的整體空間減去已使用和已分配空間的值。因此，段的可用空間會隨著已分配空間的到期而增加。</li>
</ul>
<h4 id="Sealed-segment" class="common-anchor-header">封閉區段</h4><p>封閉網段是一個封閉的網段，不能再分配給代理插入資料。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Sealed_segment_in_Milvus_8def5567e1.jpeg" alt="Sealed segment in Milvus" class="doc-image" id="sealed-segment-in-milvus" />
   </span> <span class="img-wrapper"> <span>Milvus 中的封閉網段</span> </span></p>
<p>成長中的網段在下列情況下會被封閉：</p>
<ul>
<li>如果成長中的區段已使用的空間達到總空間的 75%，該區段將被封閉。</li>
<li>Milvus 使用者手動呼叫 Flush() 來持久化集合中的所有資料。</li>
<li>成長中的區段如果經過一段長時間仍未封存，就會被封存，因為太多成長中的區段會導致資料節點過度佔用記憶體。</li>
</ul>
<h4 id="Flushed-segment" class="common-anchor-header">刷新的區段</h4><p>已刷分段是已寫入磁碟的分段。為了資料的持久性，Flush 指的是將區段資料儲存到物件儲存區。只有當封閉區段中分配的空間到期時，區段才能被刷新。當被刷新時，封存的區段會變成被刷新的區段。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Flushed_segment_in_Milvus_0c1f54d432.png" alt="Flushed segment in Milvus" class="doc-image" id="flushed-segment-in-milvus" />
   </span> <span class="img-wrapper"> <span>Milvus 中被刷新的段</span> </span></p>
<h3 id="Channel" class="common-anchor-header">通道</h3><p>通道被分配為 ：</p>
<ul>
<li>當資料節點啟動或關閉；或</li>
<li>當代理要求分配的段空間時。</li>
</ul>
<p>通道分配有幾種策略。Milvus 支援其中 2 種策略：</p>
<ol>
<li>一致性散列</li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Consistency_hashing_in_Milvus_fb5e5d84ce.jpeg" alt="Consistency hashing in Milvus" class="doc-image" id="consistency-hashing-in-milvus" />
   </span> <span class="img-wrapper"> <span>Milvus 的一致性散列</span> </span></p>
<p>Milvus 的預設策略。此策略利用散列技術為每個通道在環上分配一個位置，然後沿時鐘方向搜尋與通道最近的資料節點。因此，在上圖中，頻道 1 被分配給資料節點 2，而頻道 2 則被分配給資料節點 3。</p>
<p>然而，這個策略有一個問題，就是資料節點數量的增減 (例如：一個新的資料節點開始運作或一個資料節點突然關閉) 會影響頻道分配的過程。為了解決這個問題，data coord 會透過 etcd 監控資料節點的狀態，以便在資料節點的狀態發生任何變化時，立即通知 data coord。然後，data coord 會進一步決定將頻道適當地分配給哪個資料節點。</p>
<ol start="2">
<li>負載平衡</li>
</ol>
<p>第二種策略是將相同集合的頻道分配給不同的資料節點，確保頻道平均分配。此策略的目的是達到負載平衡。</p>
<h2 id="Data-allocation-when-and-how" class="common-anchor-header">資料分配：時間與方式<button data-href="#Data-allocation-when-and-how" class="anchor-icon" translate="no">
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
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/The_process_of_data_allocation_in_Milvus_0ba86b3ad1.jpeg" alt="The process of data allocation in Milvus" class="doc-image" id="the-process-of-data-allocation-in-milvus" />
   </span> <span class="img-wrapper"> <span>Milvus 的資料分配過程</span> </span></p>
<p>資料分配的過程從用戶端開始。它首先向代理發送帶有時間戳<code translate="no">t1</code> 的資料插入請求。然後，代理向資料協調器傳送段分配請求。</p>
<p>收到分段分配請求後，資料協調器檢查分段狀態並進行分段分配。如果已建立區段的目前空間足以容納新插入的資料列，資料協調器就會分配這些已建立的區段。但是，如果目前區段的可用空間不足，資料協調器就會分配新的區段。每次請求時，資料協調器可以傳回一個或多個區段。與此同時，資料協調器也會將已分配的區段儲存在元伺服器中，以便資料持久化。</p>
<p>之後，資料協調器會將已分配區段的資訊 (包括區段 ID、行數、到期時間<code translate="no">t2</code> 等) 傳回給代理。代理將這些已分配區段的資訊傳送給訊息存放區，以便正確記錄這些資訊。請注意，<code translate="no">t1</code> 的值必須小於<code translate="no">t2</code> 的值。<code translate="no">t2</code> 的預設值是 2,000 毫秒，可以在<code translate="no">data_coord.yaml</code> 檔案中設定參數<code translate="no">segment.assignmentExpiration</code> 來改變。</p>
<h2 id="Binlog-file-structure-and-data-persistence" class="common-anchor-header">Binlog 檔案結構與資料持久化<button data-href="#Binlog-file-structure-and-data-persistence" class="anchor-icon" translate="no">
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
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Data_node_flush_86832f46d0.png" alt="Data node flush" class="doc-image" id="data-node-flush" />
   </span> <span class="img-wrapper"> <span>資料節點刷新</span> </span></p>
<p>資料節點訂閱訊息儲存，因為資料插入請求會保存在訊息儲存中，資料節點因此可以消耗插入訊息。資料節點會先將插入請求放置在插入緩衝區中，隨著請求的累積，在達到臨界值後，這些請求就會被刷新到物件儲存區中。</p>
<h3 id="Binlog-file-structure" class="common-anchor-header">Binlog 檔案結構</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Binlog_file_structure_ca2897a095.png" alt="Binlog file structure." class="doc-image" id="binlog-file-structure." />
   </span> <span class="img-wrapper"> <span>binlog 檔案結構</span>。 </span></p>
<p>Milvus 的 binlog 檔案結構與 MySQL 相似。binlog 用來提供兩個功能：資料復原和索引建立。</p>
<p>binlog 包含許多<a href="https://github.com/milvus-io/milvus/blob/master/docs/developer_guides/chap08_binlog.md#event-format">事件</a>。每個事件都有事件標頭和事件資料。</p>
<p>包括 binlog 建立時間、寫入節點 ID、事件長度和 NextPosition（下一個事件的偏移量）等元資料都寫在事件標頭中。</p>
<p>事件資料可分為固定和可變兩部分。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/File_structure_of_an_insert_event_829b1f628d.png" alt="File structure of an insert event." class="doc-image" id="file-structure-of-an-insert-event." />
   </span> <span class="img-wrapper"> <span>插入事件的檔案結構</span>。 </span></p>
<p><code translate="no">INSERT_EVENT</code> 事件資料中的固定部分包含<code translate="no">StartTimestamp</code>,<code translate="no">EndTimestamp</code>, 和<code translate="no">reserved</code> 。</p>
<p>可變部分實際上是儲存插入的資料。插入資料會以 parquet 格式排序，並儲存在此檔案中。</p>
<h3 id="Data-persistence" class="common-anchor-header">資料持久化</h3><p>如果 schema 中有多個欄位，Milvus 會將 binlog 儲存在欄位中。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Binlog_data_persistence_0c028bf26a.png" alt="Binlog data persistence." class="doc-image" id="binlog-data-persistence." />
   </span> <span class="img-wrapper"> <span>binlog 數據的持久性</span>。 </span></p>
<p>如上圖所示，第一列是 binlog 的主索引鍵。第二列是時間戳列。其餘為模式中定義的列。MinIO 中 binlog 的檔案路徑也顯示在上圖中。</p>
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
