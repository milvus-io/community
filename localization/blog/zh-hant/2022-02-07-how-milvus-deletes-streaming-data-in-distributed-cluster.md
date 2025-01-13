---
id: 2022-02-07-how-milvus-deletes-streaming-data-in-distributed-cluster.md
title: 使用方法
author: Lichen Wang
date: 2022-02-07T00:00:00.000Z
desc: 世界上最先進的向量資料庫 Milvus 2.0 中的刪除功能背後的主要設計。
cover: assets.zilliz.com/Delete_9f40bbfa94.png
tag: Engineering
---
<custom-h1>Milvus 如何在分散式集群中刪除串流資料</custom-h1><p>Milvus 2.0 擁有統一的批次和流處理以及雲原生架構，在 DELETE 功能的開發過程中，Milvus 2.0 比其前身面臨更大的挑戰。得益於先進的儲存-計算分解設計和靈活的發布/訂閱機制，我們很自豪地宣佈我們實現了這一目標。在 Milvus 2.0 中，您可以使用主鍵刪除指定集合中的實體，這樣被刪除的實體就不會再被列在搜尋或查詢的結果中。</p>
<p>請注意，Milvus 中的 DELETE 操作指的是邏輯刪除，而實體資料清理發生在資料壓縮期間。邏輯刪除不僅大大提升了受限於 I/O 速度的搜尋效能，也方便了資料復原。邏輯刪除的資料仍可在時間旅行功能的協助下復原。</p>
<h2 id="Usage" class="common-anchor-header">使用方法<button data-href="#Usage" class="anchor-icon" translate="no">
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
    </button></h2><p>讓我們先試試 Milvus 2.0 中的 DELETE 函式。(以下範例在 Milvus 2.0.0 上使用 PyMilvus 2.0.0)。</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> connections, utility, Collection, DataType, FieldSchema, CollectionSchema
<span class="hljs-comment"># Connect to Milvus</span>
connections.connect(
    alias=<span class="hljs-string">&quot;default&quot;</span>, 
    host=<span class="hljs-string">&#x27;x.x.x.x&#x27;</span>, 
    port=<span class="hljs-string">&#x27;19530&#x27;</span>
)
<span class="hljs-comment"># Create a collection with Strong Consistency level</span>
pk_field = FieldSchema(
    name=<span class="hljs-string">&quot;id&quot;</span>, 
    dtype=DataType.INT64, 
    is_primary=<span class="hljs-literal">True</span>, 
)
vector_field = FieldSchema(
    name=<span class="hljs-string">&quot;vector&quot;</span>, 
    dtype=DataType.FLOAT_VECTOR, 
    dim=<span class="hljs-number">2</span>
)
schema = CollectionSchema(
    fields=[pk_field, vector_field], 
    description=<span class="hljs-string">&quot;Test delete&quot;</span>
)
collection_name = <span class="hljs-string">&quot;test_delete&quot;</span>
collection = Collection(
    name=collection_name, 
    schema=schema, 
    using=<span class="hljs-string">&#x27;default&#x27;</span>, 
    shards_num=<span class="hljs-number">2</span>,
    consistency_level=<span class="hljs-string">&quot;Strong&quot;</span>
)
<span class="hljs-comment"># Insert randomly generated vectors</span>
<span class="hljs-keyword">import</span> random
data = [
    [i <span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-number">100</span>)],
    [[random.random() <span class="hljs-keyword">for</span> _ <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-number">2</span>)] <span class="hljs-keyword">for</span> _ <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-number">100</span>)],
]
collection.insert(data)
<span class="hljs-comment"># Query to make sure the entities to delete exist</span>
collection.load()
expr = <span class="hljs-string">&quot;id in [2,4,6,8,10]&quot;</span>
pre_del_res = collection.query(
    expr,
    output_fields = [<span class="hljs-string">&quot;id&quot;</span>, <span class="hljs-string">&quot;vector&quot;</span>]
)
<span class="hljs-built_in">print</span>(pre_del_res)
<span class="hljs-comment"># Delete the entities with the previous expression</span>
collection.delete(expr)
<span class="hljs-comment"># Query again to check if the deleted entities exist</span>
post_del_res = collection.query(
    expr,
    output_fields = [<span class="hljs-string">&quot;id&quot;</span>, <span class="hljs-string">&quot;vector&quot;</span>]
)
<span class="hljs-built_in">print</span>(post_del_res)
<button class="copy-code-btn"></button></code></pre>
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
    </button></h2><p>在 Milvus 實例中，資料節點主要負責將串流資料 (log broker 中的日誌) 封裝成歷史資料 (日誌快照)，並自動將它們沖洗到物件儲存空間。查詢節點在完整資料（即串流資料和歷史資料）上執行搜尋請求。</p>
<p>為了充分利用集群中平行節點的資料寫入能力，Milvus 採用基於主索引鍵雜湊的分片策略，將寫入作業平均分配到不同的工作節點。也就是說，proxy 會將實體的資料處理語言 (Data Manipulation Language, DML) 訊息 (即請求) 路由到相同的資料節點和查詢節點。這些訊息透過 DML 通道發佈，並由資料節點和查詢節點分別消耗，以共同提供搜尋和查詢服務。</p>
<h3 id="Data-node" class="common-anchor-header">資料節點</h3><p>接收到資料 INSERT 訊息後，資料節點會將資料插入一個成長中的區段，這個區段是為了接收記憶體中的串流資料而建立的新區段。如果資料行數或成長區段的持續時間達到臨界值，資料節點就會封鎖它，以防止任何資料進入。然後，資料節點會將封閉區段 (包含歷史資料) 沖洗至物件儲存區。同時，資料節點根據新資料的主鍵產生 Bloom filter，並將其與封存的區段一起沖洗到物件儲存區，將 Bloom filter 儲存為統計二進位日誌 (binlog) 的一部分，其中包含區段的統計資訊。</p>
<blockquote>
<p>bloom filter 是一種概率資料結構，由一個長的二進位向量和一系列隨機映射函數所組成。它可以用來測試某個元素是否為某個集合的成員，但可能會回傳假陽性的匹配結果。           -- 維基百科</p>
</blockquote>
<p>當資料 DELETE 訊息傳入時，資料節點會緩衝相應分片中的所有 Bloom 過濾器，並將它們與訊息中提供的主索引鍵比對，以擷取可能包含要刪除實體的所有區段 (從成長中和封存中)。找出對應的區段後，資料節點會將區段緩衝到記憶體中，以產生 Delta binlog 來記錄刪除作業，然後將這些 binlog 連同區段一起沖回物件儲存空間。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/data_node_2397ad70c3.png" alt="Data Node" class="doc-image" id="data-node" />
   </span> <span class="img-wrapper"> <span>資料節點</span> </span></p>
<p>由於一個分片只指定一個 DML-Channel，額外加入群集的查詢節點無法訂閱 DML-Channel。為了確保所有查詢節點都能收到 DELETE 訊息，資料節點會過濾 DML-Channel 的 DELETE 訊息，並將訊息轉送至 Delta-Channel，以通知所有查詢節點刪除作業。</p>
<h3 id="Query-node" class="common-anchor-header">查詢節點</h3><p>從物件儲存空間載入集合時，查詢節點會先取得每個分片的檢查點 (checkpoint)，該檢查點會標記自上次刷新 (flush) 作業後的 DML 作業。根據檢查點，查詢節點會載入所有封存區段及其 Delta binlog 和 Bloom 過濾器。所有資料載入後，查詢節點會訂閱 DML-Channel、Delta-Channel 和 Query-Channel。</p>
<p>如果在資料集載入到記憶體之後，有更多的資料 INSERT 訊息傳來，查詢節點會先根據這些訊息找出成長中的區段，並更新記憶體中對應的 Bloom 過濾器，僅供查詢之用。這些查詢專用的 Bloom 過濾器在查詢完成後，不會被刷新到物件儲存空間。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/query_node_a78b1d664f.png" alt="Query Node" class="doc-image" id="query-node" />
   </span> <span class="img-wrapper"> <span>查詢節點</span> </span></p>
<p>如上所述，只有一定數量的查詢節點可以從 DML-Channel 接收 DELETE 訊息，也就是只有它們可以執行成長中的 DELETE 請求。對於那些訂閱了 DML 通道的查詢節點，它們會先過濾成長區段中的 DELETE 訊息，透過所提供的主索引鍵與成長區段中的查詢專用 Bloom 過濾器進行比對來找出實體，然後在對應的區段中記錄刪除作業。</p>
<p>不能訂閱 DML-Channel 的查詢節點，因為只能訂閱 Delta-Channel，所以只能處理封存區段上的搜尋或查詢請求，並接收資料節點轉寄的 DELETE 訊息。查詢節點從 Delta-Channel 收集到封存區段中的所有 DELETE 訊息後，透過提供的主鍵與封存區段的 Bloom 過濾器進行比對，找出實體，然後在對應的區段中記錄刪除作業。</p>
<p>最後，在搜尋或查詢中，查詢節點會根據刪除記錄產生一個位元集，以省略刪除的實體，並在所有區段中的剩餘實體中進行搜尋，而不受區段狀態的限制。最後，一致性等級會影響刪除資料的可見性。在強一致性層級下（如之前的程式碼範例所示），刪除的實體在刪除後立即不見。如果採用 Bounded Consistency Level，則會有幾秒鐘的延遲，刪除的實體才會變成不可見。</p>
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
<li><a href="https://milvus.io/blog/2022-2-14-bitset.md">Bitset 如何實現向量相似性搜尋的多樣性</a></li>
</ul>
