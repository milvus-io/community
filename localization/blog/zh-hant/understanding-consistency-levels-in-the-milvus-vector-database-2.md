---
id: understanding-consistency-levels-in-the-milvus-vector-database-2.md
title: 瞭解 Milvus 向量資料庫的一致性等級 - 第二部分
author: Jiquan Long
date: 2022-09-13T00:00:00.000Z
desc: 剖析 Milvus 向量資料庫中可調整一致性等級背後的機制。
cover: assets.zilliz.com/1280_X1280_0e0d4bc107.png
tag: Engineering
tags: 'Vector Database for AI, Artificial Intelligence, Machine Learning'
canonicalUrl: >-
  https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database-2.md
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1280_X1280_0e0d4bc107.png" alt="Cover_image" class="doc-image" id="cover_image" />
   </span> <span class="img-wrapper"> <span>封面圖片</span> </span></p>
<blockquote>
<p>本文作者<a href="https://github.com/longjiquan">龍吉全</a>，<a href="https://www.linkedin.com/in/yiyun-n-2aa713163/">倪安琪</a>轉載。</p>
</blockquote>
<p>在<a href="https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database.md">上一篇</a>關於一致性的<a href="https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database.md">博客</a>中，我們解釋了什麼是分散式向量資料庫一致性的內涵，涵蓋了Milvus向量資料庫所支援的四個一致性等級--強一致性、有邊界的不穩定性、會話一致性和最終一致性，並解釋了每個一致性等級最適合的應用場景。</p>
<p>在本篇文章中，我們將繼續探討 Milvus 向量資料庫背後的機制，讓使用者可以針對不同的應用情境，彈性地選擇理想的一致性層級。我們也將提供如何在 Milvus 向量資料庫中調整一致性等級的基本教學。</p>
<p><strong>跳到</strong></p>
<ul>
<li><a href="#The-underlying-time-tick-mechanism">底層時間刻度機制</a></li>
<li><a href="#Guarantee-timestamp">保證時間戳</a></li>
<li><a href="#Consistency-levels">一致性等級</a></li>
<li><a href="#How-to-tune-consistency-level-in-Milvus">如何在 Milvus 中調整一致性等級？</a></li>
</ul>
<h2 id="The-underlying-time-tick-mechanism" class="common-anchor-header">底層時間刻度機制<button data-href="#The-underlying-time-tick-mechanism" class="anchor-icon" translate="no">
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
    </button></h2><p>當進行向量搜尋或查詢時，Milvus 使用時間刻度機制來確保不同等級的一致性。時間刻度是 Milvus 的水印，它就像 Milvus 的時鐘，標誌著 Milvus 系統處於哪個時間點。每當有資料處理語言 (DML) 請求傳送至 Milvus 向量資料庫時，它會指定一個時間戳記。如下圖所示，當有新的資料插入訊息佇列時，Milvus 不僅會在這些插入的資料上標記時間戳，也會以固定的間隔插入時間刻度。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/timetick_b395df9804.png" alt="timetick" class="doc-image" id="timetick" />
   </span> <span class="img-wrapper"> <span>時間刻度</span> </span></p>
<p>讓我們以上圖中的<code translate="no">syncTs1</code> 為例。當下游的消費者 (例如查詢節點) 看到<code translate="no">syncTs1</code> 時，消費者元件就會明白，所有早於<code translate="no">syncTs1</code> 插入的資料都已被消耗。換句話說，時間戳值小於<code translate="no">syncTs1</code> 的資料插入請求將不再出現在訊息佇列中。</p>
<h2 id="Guarantee-Timestamp" class="common-anchor-header">保證時間戳記<button data-href="#Guarantee-Timestamp" class="anchor-icon" translate="no">
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
    </button></h2><p>如上一節所述，下游消費者元件 (如查詢節點) 會持續從訊息佇列取得資料插入請求和時間刻度的訊息。每消耗一個時間刻度，查詢節點就會將這個消耗的時間刻度標記為可服務時間 -<code translate="no">ServiceTime</code> ，查詢節點可以看到所有在<code translate="no">ServiceTime</code> 之前插入的資料。</p>
<p>除了<code translate="no">ServiceTime</code> 之外，Milvus 還採用了一種時間戳 - 保證時間戳 (<code translate="no">GuaranteeTS</code>) 來滿足不同使用者對不同等級的一致性和可用性的需求。這表示 Milvus 向量資料庫的使用者可以指定<code translate="no">GuaranteeTs</code> ，以便通知查詢節點在進行搜尋或查詢時，<code translate="no">GuaranteeTs</code> 之前的所有資料都應該是可見和涉及的。</p>
<p>當查詢節點在 Milvus 向量資料庫中執行搜尋請求時，通常有兩種情況。</p>
<h3 id="Scenario-1-Execute-search-request-immediately" class="common-anchor-header">情況一：立即執行搜尋請求</h3><p>如下圖所示，如果<code translate="no">GuaranteeTs</code> 小於<code translate="no">ServiceTime</code> ，查詢節點可以立即執行搜尋請求。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/execute_immediately_dd1913775d.png" alt="execute_immediately" class="doc-image" id="execute_immediately" />
   </span> <span class="img-wrapper"> <span>execute_immediately</span> </span></p>
<h3 id="Scenario-2-Wait-till-ServiceTime--GuaranteeTs" class="common-anchor-header">情況二：等待至 "ServiceTime &gt; GuaranteeTs" 為止</h3><p>如果<code translate="no">GuaranteeTs</code> 大於<code translate="no">ServiceTime</code> ，查詢節點必須繼續消耗訊息佇列中的時間 tick。在<code translate="no">ServiceTime</code> 大於<code translate="no">GuaranteeTs</code> 之前，查詢請求無法執行。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/wait_search_f09a2f6cf9.png" alt="wait_search" class="doc-image" id="wait_search" />
   </span> <span class="img-wrapper"> <span>等待搜尋</span> </span></p>
<h2 id="Consistency-Levels" class="common-anchor-header">一致性等級<button data-href="#Consistency-Levels" class="anchor-icon" translate="no">
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
    </button></h2><p>因此，<code translate="no">GuaranteeTs</code> 可在搜尋請求中設定，以達到您指定的一致性等級。具有較大值的<code translate="no">GuaranteeTs</code> 可確<a href="https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database.md#Strong">保強一致性</a>，但代價是較高的搜尋延遲。而一個小值的<code translate="no">GuaranteeTs</code> 可以減少搜尋延遲，但資料的可見性則會受到影響。</p>
<p><code translate="no">GuaranteeTs</code> 在 Milvus 是一種混合時間戳格式。而使用者並不知道 Milvus 內的<a href="https://github.com/milvus-io/milvus/blob/master/docs/design_docs/20211214-milvus_hybrid_ts.md">TSO</a>。因此，對使用者來說，指定 的值是一項非常複雜的任務。為了節省用戶的麻煩，提供最佳的用戶體驗，Milvus 只需要用戶選擇特定的一致性等級，Milvus 向量資料庫就會自動為用戶處理 的值。也就是說，Milvus 的使用者只需要從四個一致性等級中選擇：, , , 和 。而每個一致性等級都對應某個 值。<code translate="no">GuaranteeTs</code> <code translate="no">GuaranteeTs</code> <code translate="no">Strong</code> <code translate="no">Bounded</code> <code translate="no">Session</code> <code translate="no">Eventually</code> <code translate="no">GuaranteeTs</code> </p>
<p>下圖說明了 Milvus 向量資料庫中四個一致性等級的<code translate="no">GuaranteeTs</code> 。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/guarantee_ts_f4b3e119d3.png" alt="guarantee_ts" class="doc-image" id="guarantee_ts" />
   </span> <span class="img-wrapper"> <span>保證</span> </span></p>
<p>Milvus 向量資料庫支援四種一致性等級：</p>
<ul>
<li><p><code translate="no">CONSISTENCY_STRONG</code>:<code translate="no">GuaranteeTs</code> 設定為與最新系統時間戳相同的值，查詢節點會等到服務時間進行到最新系統時間戳時才處理搜尋或查詢請求。</p></li>
<li><p><code translate="no">CONSISTENCY_EVENTUALLY</code>：<code translate="no">GuaranteeTs</code> 設定為小於最新系統時間戳的微不足道的值，以跳過一致性檢查。查詢節點會立即在現有資料檢視上進行搜尋。</p></li>
<li><p><code translate="no">CONSISTENCY_BOUNDED</code>：<code translate="no">GuaranteeTs</code> 設定為相對小於最新系統時間戳記的值，查詢節點會在更新較少的資料檢視上進行搜尋。</p></li>
<li><p><code translate="no">CONSISTENCY_SESSION</code>:用戶端使用最後一次寫入操作的時間戳作為<code translate="no">GuaranteeTs</code> ，這樣每個用戶端至少可以檢索到自己插入的資料。</p></li>
</ul>
<h2 id="How-to-tune-consistency-level-in-Milvus" class="common-anchor-header">如何在 Milvus 中調整一致性等級？<button data-href="#How-to-tune-consistency-level-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 支援在<a href="https://milvus.io/docs/v2.1.x/create_collection.md">建立資料集</a>、進行<a href="https://milvus.io/docs/v2.1.x/search.md">搜尋</a>或<a href="https://milvus.io/docs/v2.1.x/query.md">查詢</a>時調整一致性層級。</p>
<h3 id="Conduct-a-vector-similarity-search" class="common-anchor-header">進行向量相似性搜尋</h3><p>要以您想要的一致性等級進行向量相似性搜尋，只需設定參數<code translate="no">consistency_level</code> 的值為<code translate="no">Strong</code>,<code translate="no">Bounded</code>,<code translate="no">Session</code>, 或<code translate="no">Eventually</code> 。如果您沒有設定參數<code translate="no">consistency_level</code> 的值，一致性等級預設為<code translate="no">Bounded</code> 。本範例以<code translate="no">Strong</code> 的一致性進行向量相似性查詢。</p>
<pre><code translate="no">results = collection.search(
        data=[[0.1, 0.2]], 
        anns_field=<span class="hljs-string">&quot;book_intro&quot;</span>, 
        param=search_params, 
        <span class="hljs-built_in">limit</span>=10, 
        <span class="hljs-built_in">expr</span>=None,
        consistency_level=<span class="hljs-string">&quot;Strong&quot;</span>
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Conduct-a-vector-query" class="common-anchor-header">進行向量查詢</h3><p>與進行向量相似性搜尋類似，您可以在進行向量查詢時指定參數<code translate="no">consistency_level</code> 的值。範例以<code translate="no">Strong</code> 的一致性進行向量查詢。</p>
<pre><code translate="no">res = collection.query(
  <span class="hljs-built_in">expr</span> = <span class="hljs-string">&quot;book_id in [2,4,6,8]&quot;</span>, 
  output_fields = [<span class="hljs-string">&quot;book_id&quot;</span>, <span class="hljs-string">&quot;book_intro&quot;</span>],
  consistency_level=<span class="hljs-string">&quot;Strong&quot;</span>
)
<button class="copy-code-btn"></button></code></pre>
<h2 id="Whats-next" class="common-anchor-header">下一步<button data-href="#Whats-next" class="anchor-icon" translate="no">
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
    </button></h2><p>隨著 Milvus 2.1 正式發行，我們準備了一系列介紹新功能的部落格。閱讀此系列部落格的更多內容：</p>
<ul>
<li><a href="https://milvus.io/blog/2022-08-08-How-to-use-string-data-to-empower-your-similarity-search-applications.md">如何使用字串資料來強化您的相似性搜尋應用程式</a></li>
<li><a href="https://milvus.io/blog/embedded-milvus.md">使用 Embedded Milvus 即時以 Python 安裝及執行 Milvus</a></li>
<li><a href="https://milvus.io/blog/in-memory-replicas.md">使用內建記憶體複本提高向量資料庫的讀取吞吐量</a></li>
<li><a href="https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database.md">瞭解 Milvus 向量資料庫的一致性等級</a></li>
<li><a href="https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database-2.md">瞭解 Milvus Vector 資料庫的一致性層級（第二部分）</a></li>
<li><a href="https://milvus.io/blog/data-security.md">Milvus Vector 資料庫如何確保資料安全？</a></li>
</ul>
