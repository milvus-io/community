---
id: in-memory-replicas.md
title: 使用內存複製提高向量資料庫的讀取吞吐量
author: Congqi Xia
date: 2022-08-22T00:00:00.000Z
desc: 使用記憶體內複製，以提高讀取吞吐量和硬體資源的利用率。
cover: assets.zilliz.com/in_memory_replica_af1fa21d61.png
tag: Engineering
tags: 'Vector Database for AI, Artificial Intelligence, Machine Learning'
canonicalUrl: 'https://milvus.io/blog/in-memory-replicas.md'
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/in_memory_replica_af1fa21d61.png" alt="Cover_image" class="doc-image" id="cover_image" />
   </span> <span class="img-wrapper"> <span>封面圖片</span> </span></p>
<blockquote>
<p>本文<a href="https://github.com/congqixia">由夏琮琦</a>和<a href="https://www.linkedin.com/in/yiyun-n-2aa713163/">倪安琪</a>共同撰寫。</p>
</blockquote>
<p>隨著 Milvus 2.1 的正式發布，Milvus 2.1 帶來了許多新功能，為用戶提供了便利和更好的用戶體驗。雖然對於分散式資料庫的世界來說，記憶體內複製的概念並不新鮮，但它卻是一個重要的功能，可以幫助您毫不費力地提升系統效能、增強系統可用性。因此，這篇文章將解釋何謂記憶體內複製以及其重要性，然後介紹如何在用於人工智能的向量資料庫 Milvus 中啟用這項新功能。</p>
<p><strong>跳至：</strong></p>
<ul>
<li><p><a href="#Concepts-related-to-in-memory-replica">與記憶體內複製相關的概念</a></p></li>
<li><p><a href="#What-is-in-memory-replica">什麼是記憶體內複製？</a></p></li>
<li><p><a href="#Why-are-in-memory-replicas-important">為什麼記憶體內複製很重要？</a></p></li>
<li><p><a href="#Enable-in-memory-replicas-in-the-Milvus-vector-database">在 Milvus 向量資料庫中啟用記憶體內副本</a></p></li>
</ul>
<h2 id="Concepts-related-to-in-memory-replica" class="common-anchor-header">與記憶體內複製相關的概念<button data-href="#Concepts-related-to-in-memory-replica" class="anchor-icon" translate="no">
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
    </button></h2><p>在瞭解什麼是記憶體內複製以及為什麼它很重要之前，我們需要先瞭解幾個相關的概念，包括複製群組、分片複製、串流複製、歷史複製和分片領導者。下圖說明了這些概念。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/diagram_1_525afc706a.jpg" alt="Replica_concepts" class="doc-image" id="replica_concepts" />
   </span> <span class="img-wrapper"> <span>複製概念</span> </span></p>
<h3 id="Replica-group" class="common-anchor-header">複製群組</h3><p>複製群組由多個負責處理歷史資料和複製品的<a href="https://milvus.io/docs/v2.1.x/four_layers.md#Query-node">查詢節點</a>組成。</p>
<h3 id="Shard-replica" class="common-anchor-header">分片複製</h3><p>一個分片複製本由一個串流複製本和一個歷史複製本組成，兩者都屬於同一<a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md#Shard">個分片</a>（即 DML 通道）。多個分片副本組成一個副本群組。複製群組中分片複製本的確實數量由指定集合中的分片數量決定。</p>
<h3 id="Streaming-replica" class="common-anchor-header">串流複製</h3><p>流複製包含來自相同 DML 通道的所有<a href="https://milvus.io/docs/v2.1.x/glossary.md#Segment">成長區段</a>。技術上來說，一個串流複製應該只由一個複製中的一個查詢節點提供服務。</p>
<h3 id="Historical-replica" class="common-anchor-header">歷史副本</h3><p>歷史副本包含來自相同 DML 通道的所有封存區段。一個歷史副本的封存區段可以分佈在同一個副本群組內的多個查詢節點上。</p>
<h3 id="Shard-leader" class="common-anchor-header">分片領導者</h3><p>分片領導者是在分片複製中服務於串流複製的查詢節點。</p>
<h2 id="What-is-in-memory-replica" class="common-anchor-header">什麼是記憶體複製？<button data-href="#What-is-in-memory-replica" class="anchor-icon" translate="no">
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
    </button></h2><p>啟用記憶體內複製可讓您在多個查詢節點上載入集合中的資料，以便充分利用額外的 CPU 和記憶體資源。如果您的資料集相對較小，但希望增加讀取吞吐量並提高硬體資源的利用率，則此功能非常有用。</p>
<p>Milvus 向量資料庫目前在記憶體中為每個區段保留一個副本。不過，有了記憶體內複製，您可以在不同的查詢節點上對一個區段進行多次複製。這表示如果有一個查詢節點正在對某一區段進行搜尋，傳入的新搜尋請求可以分配給另一個閒置的查詢節點，因為這個查詢節點擁有完全相同區段的複製。</p>
<p>此外，如果我們有多個在記憶體中的複製，就可以更好地應付查詢節點當機的情況。之前，我們必須等待區段重新載入，才能在另一個查詢節點上繼續搜尋。但是，有了記憶體內複製，搜尋要求可以立即重新傳送到新的查詢節點，而不需要再次重新載入資料。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/replication_3_1_2c25513cb9.jpg" alt="Replication" class="doc-image" id="replication" />
   </span> <span class="img-wrapper"> <span>複製</span> </span></p>
<h2 id="Why-are-in-memory-replicas-important" class="common-anchor-header">為什麼記憶體內複製很重要？<button data-href="#Why-are-in-memory-replicas-important" class="anchor-icon" translate="no">
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
    </button></h2><p>啟用「記憶體內複製」的最顯著好處之一，是可提高整體 QPS（每秒查詢次 數）和吞吐量。此外，可以維護多個網段複製，而且系統在面臨故障轉移時更具彈性。</p>
<h2 id="Enable-in-memory-replicas-in-the-Milvus-vector-database" class="common-anchor-header">在 Milvus 向量資料庫中啟用記憶體內副本<button data-href="#Enable-in-memory-replicas-in-the-Milvus-vector-database" class="anchor-icon" translate="no">
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
    </button></h2><p>在 Milvus 向量資料庫中啟用記憶體內複製的新功能並不費力。您只需要在載入集合時指定您想要的副本數量（即呼叫<code translate="no">collection.load()</code> ）。</p>
<p>在下面的示例教程中，我們假設您已經<a href="https://milvus.io/docs/v2.1.x/create_collection.md">創建了一個</a>名為 "book "<a href="https://milvus.io/docs/v2.1.x/create_collection.md">的集合</a>，並在其中<a href="https://milvus.io/docs/v2.1.x/insert_data.md">插入了資料</a>。然後，您可以執行以下指令，在<a href="https://milvus.io/docs/v2.1.x/load_collection.md">載入</a>書本集合時建立兩個複本。</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> Collection
collection = Collection(<span class="hljs-string">&quot;book&quot;</span>)      <span class="hljs-comment"># Get an existing collection.</span>
collection.load(replica_number=<span class="hljs-number">2</span>) <span class="hljs-comment"># load collection as 2 replicas</span>
<button class="copy-code-btn"></button></code></pre>
<p>您可以靈活修改上述示例程式碼中的副本數量，以最適合您的應用程式情境。之後，您就可以直接在多個複本上進行向量相似性<a href="https://milvus.io/docs/v2.1.x/search.md">搜尋或</a> <a href="https://milvus.io/docs/v2.1.x/query.md">查詢</a>，而不需要執行任何額外的指令。但需要注意的是，允許的最大複製本數量受限於執行查詢節點的可用記憶體總量。如果您指定的副本數量超過可用記憶體的限制，在資料載入時會傳回錯誤。</p>
<p>您也可以透過執行<code translate="no">collection.get_replicas()</code> 來檢查您所建立的記憶體內複製群組的資訊。將傳回複製群組以及相應查詢節點和分片的資訊。以下是輸出的範例。</p>
<pre><code translate="no">Replica <span class="hljs-built_in">groups</span>:
- Group: &lt;group_id:435309823872729305&gt;, &lt;group_nodes:(21, 20)&gt;, &lt;shards:[Shard: &lt;channel_name:milvus-zong-rootcoord-dml_27_435367661874184193v0&gt;, &lt;shard_leader:21&gt;, &lt;shard_nodes:[21]&gt;, Shard: &lt;channel_name:milvus-zong-rootcoord-dml_28_435367661874184193v1&gt;, &lt;shard_leader:20&gt;, &lt;shard_nodes:[20, 21]&gt;]&gt;
- Group: &lt;group_id:435309823872729304&gt;, &lt;group_nodes:(25,)&gt;, &lt;shards:[Shard: &lt;channel_name:milvus-zong-rootcoord-dml_28_435367661874184193v1&gt;, &lt;shard_leader:25&gt;, &lt;shard_nodes:[25]&gt;, Shard: &lt;channel_name:milvus-zong-rootcoord-dml_27_435367661874184193v0&gt;, &lt;shard_leader:25&gt;, &lt;shard_nodes:[25]&gt;]&gt;
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
