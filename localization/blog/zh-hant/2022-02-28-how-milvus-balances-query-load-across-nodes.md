---
id: 2022-02-28-how-milvus-balances-query-load-across-nodes.md
title: Milvus 如何平衡各節點的查詢負載？
author: Xi Ge
date: 2022-02-28T00:00:00.000Z
desc: Milvus 2.0 支援查詢節點間的自動負載平衡。
cover: assets.zilliz.com/Load_balance_b2f35a5577.png
tag: Engineering
tags: 'Data science, Database, Technology, Artificial Intelligence, Vector Management'
canonicalUrl: >-
  https://milvus.io/blog/2022-02-28-how-milvus-balances-query-load-across-nodes.md
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Load_balance_b2f35a5577.png" alt="Binlog Cover Image" class="doc-image" id="binlog-cover-image" />
   </span> <span class="img-wrapper"> <span>Binlog 封面圖片</span> </span></p>
<p>作者：<a href="https://github.com/xige-16">葛曦</a></p>
<p>在之前的博客文章中，我們相繼介紹了 Milvus 2.0 中的 Deletion、Bitset 和 Compaction 功能。在本系列文章的最後，我們想分享一下負載平衡背後的設計，這是 Milvus 分佈式集群的一個重要功能。</p>
<h2 id="Implementation" class="common-anchor-header">執行<button data-href="#Implementation" class="anchor-icon" translate="no">
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
    </button></h2><p>當查詢節點緩衝的片段數量和大小不同時，各查詢節點的搜尋效能也可能不同。最糟糕的情況可能發生在幾個查詢節點在大量資料上搜尋到精疲力竭，但新建立的查詢節點卻因為沒有分段給它們而一直閒置，造成 CPU 資源的大量浪費和搜尋效能的大幅下降。</p>
<p>為了避免這種情況，查詢協調器 (query coordinator) 被編程為根據各查詢節點的 RAM 使用量，將區段平均分配給各查詢節點。因此，CPU 資源在各節點上被平均消耗，從而大幅提升搜尋效能。</p>
<h3 id="Trigger-automatic-load-balance" class="common-anchor-header">觸發自動負載平衡</h3><p>根據配置<code translate="no">queryCoord.balanceIntervalSeconds</code> 的預設值，查詢協調器每 60 秒檢查一次所有查詢節點的 RAM 使用量（百分比）。如果滿足下列任一條件，查詢協調器就會開始平衡各查詢節點的查詢負載：</p>
<ol>
<li>群集中任何查詢節點的 RAM 使用量大於<code translate="no">queryCoord.overloadedMemoryThresholdPercentage</code> (預設值：90)；</li>
<li>或任何兩個查詢節點的 RAM 使用量差異的絕對值大於<code translate="no">queryCoord.memoryUsageMaxDifferencePercentage</code> (預設值：30)。</li>
</ol>
<p>網段從來源查詢節點傳送到目的地查詢節點後，也必須同時滿足下列兩個條件：</p>
<ol>
<li>目的地查詢節點的 RAM 使用量不超過<code translate="no">queryCoord.overloadedMemoryThresholdPercentage</code> (預設值：90)；</li>
<li>負載平衡後，來源查詢節點和目的查詢節點的 RAM 使用量差異的絕對值小於負載平衡前的差異。</li>
</ol>
<p>在滿足上述條件的情況下，查詢協調器會繼續平衡各節點的查詢負載。</p>
<h2 id="Load-balance" class="common-anchor-header">負載平衡<button data-href="#Load-balance" class="anchor-icon" translate="no">
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
    </button></h2><p>當負載平衡被觸發，查詢協調器首先載入目標段到目的地查詢節點。此時，兩個查詢節點都會在任何查詢請求中回傳目標網段的查詢結果，以保證結果的完整性。</p>
<p>在目的地查詢節點成功載入目標網段後，查詢協調器會發佈<code translate="no">sealedSegmentChangeInfo</code> 到查詢頻道。如下圖所示，<code translate="no">onlineNodeID</code> 和<code translate="no">onlineSegmentIDs</code> 分別表示載入網段的查詢節點和載入的網段，<code translate="no">offlineNodeID</code> 和<code translate="no">offlineSegmentIDs</code> 分別表示需要釋放網段的查詢節點和要釋放的網段。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/20220228_145413_f253cec15b.png" alt="sealedSegmentChangeInfo" class="doc-image" id="sealedsegmentchangeinfo" />
   </span> <span class="img-wrapper"> <span>sealedSegmentChangeInfo</span> </span></p>
<p>收到<code translate="no">sealedSegmentChangeInfo</code> 後，來源查詢節點就會釋放目標網段。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/20220228_145436_2604bc57a5.png" alt="Load Balance Workflow" class="doc-image" id="load-balance-workflow" />
   </span> <span class="img-wrapper"> <span>負載平衡工作流程</span> </span></p>
<p>當源查詢節點釋放目標網段時，整個流程就成功了。完成此步驟後，查詢節點間的查詢負載就被設定為平衡，也就是所有查詢節點的 RAM 使用量都不大於<code translate="no">queryCoord.overloadedMemoryThresholdPercentage</code> ，而且負載平衡後來源查詢節點和目標查詢節點的 RAM 使用量差異的絕對值小於負載平衡前的差異。</p>
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
    </button></h2><p>在 2.0 新功能系列部落格中，我們的目標是解釋新功能的設計。閱讀此系列部落格的更多內容！</p>
<ul>
<li><a href="https://milvus.io/blog/2022-02-07-how-milvus-deletes-streaming-data-in-distributed-cluster.md">Milvus 如何在分散式集群中刪除串流資料</a></li>
<li><a href="https://milvus.io/blog/2022-2-21-compact.md">Milvus 如何壓縮資料？</a></li>
<li><a href="https://milvus.io/blog/2022-02-28-how-milvus-balances-query-load-across-nodes.md">Milvus 如何平衡節點間的查詢負載？</a></li>
<li><a href="https://milvus.io/blog/2022-2-14-bitset.md">Bitset 如何實現向量相似性搜索的多樣性</a></li>
</ul>
<p>這是 Milvus 2.0 新功能博客系列的壓軸篇。在此系列之後，我們正計劃一個新的 Milvus<a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md">Deep Dive</a> 系列，介紹 Milvus 2.0 的基本架構。請繼續關注。</p>
