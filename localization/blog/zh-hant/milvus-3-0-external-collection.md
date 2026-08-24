---
id: milvus-3-0-external-collection.md
title: Milvus 外部集合：無需移動資料，即可索引與檢索資料湖中的資料
author: Leo Liu
date: 2026-8-24
cover: assets.zilliz.com/blog_cover_external_collection_3e4d7334de.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  External Collection, Milvus 3.0, vector search on data lake, Iceberg vector
  search, Vector Lakebase
meta_title: >
  Milvus External Collection: Index and Retrieve Lake-Resident Data Without
  Moving It
desc: Milvus 3.0 引入了 External Collection，讓 Milvus 可以為仍保留在資料湖中的資料建立索引並提供檢索服務。
origin: 'https://milvus.io/blog/milvus-3-0-external-collection.md'
---
<p>在許多 AI 資料管道中，嵌入向量與中繼資料已經在資料湖中產出並儲存。產品管道可能會將產品屬性與多模態嵌入向量寫入 S3 中的 Parquet 檔案。檢索或訓練語料庫可能存放在 Iceberg 或 Lance 資料表中。資料湖本來就是這些資料集被產生、更新、版本化管理，並供資料堆疊其餘部分使用的地方。</p>
<p>然而，向量資料庫傳統上一直是圍繞著「由資料庫自行管理的服務副本」來設計。如果團隊想要對已存放在資料湖中的資料進行低延遲向量搜尋，通常只有兩個選擇：</p>
<ul>
<li><strong>將資料複製到向量資料庫中。</strong> 這樣可以提供 ANN 索引和正式的服務路徑，但會產生第二份資料副本，以及必須與來源保持同步的 ETL 管道。</li>
<li><strong>直接查詢資料湖。</strong> 這可以避免重複，但由於沒有 ANN 索引與服務層，向量搜尋會退化為不適合正式環境延遲需求的掃描。</li>
</ul>
<p><strong>Milvus 3.0</strong> <a href="https://milvus.io/docs/create-an-external-collection.md"><strong>外部集合</strong></a> <strong>引入了第三條路徑。</strong> 來源資料仍然保留在 Parquet、Iceberg、Lance、Vortex 或其他受支援的外部格式中，而 Milvus 會在其上建立索引並提供服務。您可以將外部欄位對應到 Milvus 的 schema、定義所需的索引、重新整理集合，然後使用一般的 Milvus 搜尋與查詢 API——無需先將來源資料列複製到 Milvus 管理的集合中。</p>
<p>架構上的改變很直接：資料可以繼續留在資料湖中，而 Milvus 負責加上索引與檢索層。</p>
<p>這也使外部集合成為邁向 <a href="https://zilliz.com/blog/what-is-a-vector-lakebase"><strong>Vector Lakebase</strong></a> 的重要一步。<strong>Vector Lakebase</strong> 是一個統一的、以資料湖為原生基礎的 AI 資料架構，結合了向量資料庫等級的服務能力、開放式資料湖儲存、可重用的湖級索引，以及共享的語意層。線上檢索不再需要從一份獨立的服務副本開始，而 Spark、訓練管道、評估作業與治理工具也不必再操作另一份資料版本。它們可以基於同一份湖駐留資料基礎來運作。</p>
<h2 id="What-an-External-Collection-is-and-what-it-changes" class="common-anchor-header">什麼是外部集合，以及它帶來了什麼改變<button data-href="#What-an-External-Collection-is-and-what-it-changes" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>外部集合</strong> 是一種 Milvus 集合類型，其來源資料存放在 Milvus 管理儲存之外。</p>
<p>如果沒有外部集合，要將該目錄放到正式環境的向量搜尋後方，通常意味著必須在 Milvus 中建立另一份副本：</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/milvus_30_external_collection_vector_search_on_lake_resident_data_without_a_second_copy_md_2_333b278a04.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>每當目錄變更、嵌入模型改變，或某個欄位被回填，就會需要另一條管道將更新後的資料搬移到那個邊界之外。</p>
<p>有了外部集合，架構就變成：</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/milvus_30_external_collection_vector_search_on_lake_resident_data_without_a_second_copy_md_3_71172afb44.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Milvus <strong>不會</strong>將外部檔案變成自己的來源資料副本。相反地，外部集合中存放的是 Milvus 為了解讀與搜尋這些檔案所需的資訊：</p>
<ol>
<li>一個 <code translate="no">external_source</code>，用來識別外部檔案或資料表。</li>
<li>一個 <code translate="no">external_spec</code>，用來描述來源格式與儲存存取方式。</li>
<li><code translate="no">external_field</code> 對應，將 Milvus schema 中的欄位連接到外部資料集中的欄位。</li>
<li>Milvus 為檢索所建立的索引、manifest 與服務狀態。</li>
</ol>
<p><strong>來源資料零複製並不代表 Milvus 內部沒有任何狀態。</strong> Milvus 仍然會建立索引。它仍然會使用運算資源。它仍然會快取資料。改變在於：權威資料列不再因為你需要 Milvus 搜尋它們，就必須先被複製到 Milvus 中。</p>
<h3 id="Normal-Milvus-Collection-vs-External-Collection" class="common-anchor-header">一般 Milvus 集合 vs. 外部集合</h3><table>
<thead>
<tr><th><strong>關注點</strong></th><th><strong>Milvus 管理的集合</strong></th><th><strong>外部集合</strong></th></tr>
</thead>
<tbody>
<tr><td>來源資料列</td><td>由 Milvus 儲存與管理</td><td>保留在外部檔案或資料表中</td></tr>
<tr><td>資料如何進入 Milvus</td><td>Insert、upsert、匯入或串流寫入</td><td>外部來源對應 + Refresh</td></tr>
<tr><td>線上變更</td><td>支援</td><td>從 Milvus 端為唯讀</td></tr>
<tr><td>資料新鮮度</td><td>跟隨 Milvus 寫入路徑與一致性模型</td><td>跟隨最後一次成功發布的 Refresh</td></tr>
<tr><td>Milvus 管理的狀態</td><td>來源資料、中繼資料、索引、快取</td><td>對應關係、manifest、索引、快取</td></tr>
<tr><td>查詢路徑</td><td>Milvus 搜尋與查詢 API</td><td>Milvus 搜尋與查詢 API</td></tr>
<tr><td>最適合的情境</td><td>持續變動的線上資料</td><td>大量、批次產生、讀取密集的資料湖資料</td></tr>
</tbody>
</table>
<p>因此，外部集合是補足一般 Milvus 集合，而非取代它們。</p>
<p>系統可以將快速變動的線上狀態放在一般的 Milvus 集合中，同時對大型語料庫、目錄、歷史資料集、模型特徵或其他已在資料湖中產出並受治理的資料使用外部集合。</p>
<h2 id="Why-removing-the-second-copy-matters" class="common-anchor-header">為什麼移除第二份副本很重要<button data-href="#Why-removing-the-second-copy-matters" class="anchor-icon" translate="no">
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
    </button></h2><p>把外部集合描述成一種儲存最佳化，的確很誘人：不要把好幾 TB 的資料複製到另一個資料庫，就能省下儲存空間。這確實有用，但這不是主要的架構問題。</p>
<p><strong>更高的成本來自於讓兩套資料系統保持一致。</strong></p>
<p>再次以產品目錄為例。資料平台產出權威的 Parquet 資料集。搜尋系統將其匯入向量資料庫。推薦團隊可能透過 Spark 讀取同一份資料湖資料進行離線分析。之後一個新的嵌入模型產生了取代舊有的向量欄位。庫存與中繼資料也在持續變動。</p>
<p>一旦線上服務副本獨立於資料湖，每一次變更都必須跨越那個邊界：</p>
<ul>
<li>資料需要被複製；</li>
<li>傳輸需要被排程與監控；</li>
<li>失敗的工作需要重試；</li>
<li>schema 與權限可能需要在多個系統中重複表示；</li>
<li>新鮮度取決於同步管道追趕的速度；</li>
<li>團隊必須知道哪一份副本才是他們真正想要的版本。</li>
</ul>
<p>儲存成本只是其中一項。</p>
<table>
<thead>
<tr><th><strong>成本</strong></th><th><strong>分離的資料湖 + 服務副本</strong></th><th><strong>外部集合</strong></th></tr>
</thead>
<tbody>
<tr><td><strong>來源資料副本</strong></td><td>資料湖副本加上一份獨立的服務副本</td><td>來源資料列保留在資料湖中</td></tr>
<tr><td><strong>資料搬移</strong></td><td>持續運作的 ETL／匯入管道</td><td>對外部來源執行 Refresh</td></tr>
<tr><td><strong>新鮮度</strong></td><td>取決於匯出／匯入的頻率</td><td>由何時發布新的 Refresh 來控制</td></tr>
<tr><td><strong>治理</strong></td><td>來源與服務副本必須保持對齊</td><td>來源所有權、血緣與版本管理繼續保留在資料湖平台</td></tr>
<tr><td><strong>離線重用</strong></td><td>其他消費者可能各自準備自己的副本</td><td>現有的資料湖工具可以繼續讀取同一份來源</td></tr>
<tr><td><strong>服務資源</strong></td><td>依資料庫副本與查詢工作負載來規劃規模</td><td>索引、查詢運算與快取可以與來源資料列的所有權分開管理</td></tr>
</tbody>
</table>
<p>隨著 AI 資料變動越來越頻繁，這個差異變得格外重要。</p>
<p>團隊會對語料庫進行去重。他們會為了分析而對資料進行分群。當模型改變時，他們會產生新的嵌入向量。他們會加上標籤、摘要、抽取出的實體、品質分數或回饋訊號。他們會對同一份語料庫執行評估作業與資料清理管道，而這份語料庫也正是正式環境應用程式所檢索的對象。</p>
<p>如果每個系統都擁有自己的副本，那麼每一次改進都會變成另一個同步工作。</p>
<p>外部集合改變了那個邊界：<strong>離線系統可以繼續在資料湖資料集上運作，而 Milvus 在同一份基礎上提供檢索服務。</strong></p>
<h2 id="What-data-sources-External-Collection-supports" class="common-anchor-header">外部集合支援哪些資料來源<button data-href="#What-data-sources-External-Collection-supports" class="anchor-icon" translate="no">
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
    </button></h2><p>外部集合是圍繞著開放、外部管理的資料來設計，而不是針對 Milvus 專屬的來源佈局。它透過 <a href="https://milvus.io/blog/why-we-built-loon-a-storage-engine-for-ai-data-that-never-stops-changing.md">Storage V3</a> 支援多種外部來源格式：</p>
<table>
<thead>
<tr><th><strong>外部格式</strong></th><th><strong>format 值</strong></th><th><strong>Milvus 讀取的內容</strong></th></tr>
</thead>
<tbody>
<tr><td>Apache Parquet</td><td>parquet</td><td>包含 Parquet 檔案與 row group 的目錄或物件儲存前綴</td></tr>
<tr><td>Vortex</td><td>vortex</td><td>Vortex 檔案及其佈局中繼資料</td></tr>
<tr><td>Lance</td><td>lance-table</td><td>Lance 資料集及其 fragment 中繼資料</td></tr>
<tr><td>Apache Iceberg</td><td>iceberg-table</td><td>Iceberg 中繼資料加上所選取的 snapshot</td></tr>
<tr><td>Milvus snapshot</td><td>milvus-table</td><td>以外部來源形式暴露的受支援 Milvus snapshot</td></tr>
</tbody>
</table>
<p>來源與 Milvus 之間的對應是明確的。</p>
<p>名為 <code translate="no">product_id</code> 的來源欄位可以變成 Milvus 的 <code translate="no">id</code> 欄位；<code translate="no">image_vec</code> 可以變成 <code translate="no">embedding</code>；而寬型的來源資料表不需要把每個欄位都暴露給集合。這表示資料平台不需要為了配合服務資料庫而重新命名或重寫來源。</p>
<p>具版本管理的格式還增加了另一個有用的特性。對於 Iceberg 這類來源，集合可以指向特定的 snapshot，而不是查詢執行時當下所指向的內容。固定的來源版本對於可重現的評估、回歸測試、歷史分析與稽核工作負載非常有用。</p>
<p>底層檔案也仍然可以被資料堆疊的其他部分使用。Spark、訓練框架、治理系統以及其他相容於資料湖的工具都可以繼續讀取同一份開放資料。</p>
<p>外部集合只是為這份資料增加了一個新的消費者；它不會讓 Milvus 變成唯一的擁有者。</p>
<h3 id="Accessing-external-storage-securely" class="common-anchor-header">安全地存取外部儲存</h3><p>Milvus 也需要權限才能讀取外部儲存。</p>
<p>根據儲存供應商的不同，部署可以使用 workload 或 instance identity、AWS STS 角色假設、服務帳戶 impersonation、以 SAS 為基礎的存取，或供應商專屬的角色系統等機制，而不是在應用程式設定中嵌入長期有效的憑證。</p>
<p>這個儲存身分控制的是 Milvus 如何連到來源。Milvus 內部的授權仍然是一個獨立的安全邊界。</p>
<h2 id="How-to-create-index-refresh-and-query-an-external-collection" class="common-anchor-header">如何建立、索引、重新整理與查詢外部集合<button data-href="#How-to-create-index-refresh-and-query-an-external-collection" class="anchor-icon" translate="no">
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
    </button></h2><p>外部集合的生命週期有四個主要步驟：</p>
<ol>
<li>定義外部來源，並將其欄位對應到 Milvus schema。</li>
<li>定義工作負載所需的索引。</li>
<li>執行 Refresh，讓 Milvus 探索來源資料並準備可查詢的版本。</li>
<li>載入集合，然後使用一般的 Milvus 搜尋與查詢 API。</li>
</ol>
<p>以下是以外部集合表示的同一份產品目錄：</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">import</span> json
<span class="hljs-keyword">import</span> time

<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> <span class="hljs-title class_">DataType</span>, <span class="hljs-title class_">MilvusClient</span>

client = <span class="hljs-title class_">MilvusClient</span>(
    uri=<span class="hljs-string">&quot;http://localhost:19530&quot;</span>,
    token=<span class="hljs-string">&quot;root:Milvus&quot;</span>,
)

schema = client.<span class="hljs-title function_">create_schema</span>(
    external_source=<span class="hljs-string">&quot;s3://my-lake/datasets/products/&quot;</span>,
    external_spec=json.<span class="hljs-title function_">dumps</span>(
        {
            <span class="hljs-string">&quot;format&quot;</span>: <span class="hljs-string">&quot;parquet&quot;</span>,
            <span class="hljs-string">&quot;extfs&quot;</span>: {
                <span class="hljs-string">&quot;cloud_provider&quot;</span>: <span class="hljs-string">&quot;aws&quot;</span>,
                <span class="hljs-string">&quot;region&quot;</span>: <span class="hljs-string">&quot;us-east-1&quot;</span>,
                <span class="hljs-string">&quot;use_iam&quot;</span>: <span class="hljs-string">&quot;true&quot;</span>,
                <span class="hljs-string">&quot;iam_endpoint&quot;</span>: <span class="hljs-string">&quot;https://sts.us-east-1.amazonaws.com&quot;</span>,
            },
        }
    ),
)

schema.<span class="hljs-title function_">add_field</span>(
    field_name=<span class="hljs-string">&quot;id&quot;</span>,
    datatype=<span class="hljs-title class_">DataType</span>.<span class="hljs-property">INT64</span>,
    external_field=<span class="hljs-string">&quot;product_id&quot;</span>,
)
schema.<span class="hljs-title function_">add_field</span>(
    field_name=<span class="hljs-string">&quot;embedding&quot;</span>,
    datatype=<span class="hljs-title class_">DataType</span>.<span class="hljs-property">FLOAT_VECTOR</span>,
    dim=<span class="hljs-number">768</span>,
    external_field=<span class="hljs-string">&quot;image_vec&quot;</span>,
)
schema.<span class="hljs-title function_">add_field</span>(
    field_name=<span class="hljs-string">&quot;title&quot;</span>,
    datatype=<span class="hljs-title class_">DataType</span>.<span class="hljs-property">VARCHAR</span>,
    max_length=<span class="hljs-number">256</span>,
    external_field=<span class="hljs-string">&quot;product_name&quot;</span>,
)
schema.<span class="hljs-title function_">add_field</span>(
    field_name=<span class="hljs-string">&quot;stock&quot;</span>,
    datatype=<span class="hljs-title class_">DataType</span>.<span class="hljs-property">INT64</span>,
    external_field=<span class="hljs-string">&quot;stock&quot;</span>,
)
schema.<span class="hljs-title function_">add_field</span>(
    field_name=<span class="hljs-string">&quot;rating&quot;</span>,
    datatype=<span class="hljs-title class_">DataType</span>.<span class="hljs-property">FLOAT</span>,
    external_field=<span class="hljs-string">&quot;rating&quot;</span>,
)

client.<span class="hljs-title function_">create_collection</span>(
    collection_name=<span class="hljs-string">&quot;products_ext&quot;</span>,
    schema=schema,
)
<button class="copy-code-btn"></button></code></pre>
<p>索引使用一般的 Milvus 介面：</p>
<pre><code translate="no" class="language-python">index_params = client.<span class="hljs-title function_">prepare_index_params</span>()
index_params.<span class="hljs-title function_">add_index</span>(
    field_name=<span class="hljs-string">&quot;embedding&quot;</span>,
    index_type=<span class="hljs-string">&quot;HNSW&quot;</span>,
    metric_type=<span class="hljs-string">&quot;COSINE&quot;</span>,
)
index_params.<span class="hljs-title function_">add_index</span>(field_name=<span class="hljs-string">&quot;stock&quot;</span>, index_type=<span class="hljs-string">&quot;AUTOINDEX&quot;</span>)
index_params.<span class="hljs-title function_">add_index</span>(field_name=<span class="hljs-string">&quot;rating&quot;</span>, index_type=<span class="hljs-string">&quot;AUTOINDEX&quot;</span>)

client.<span class="hljs-title function_">create_index</span>(
    collection_name=<span class="hljs-string">&quot;products_ext&quot;</span>,
    index_params=index_params,
)
<button class="copy-code-btn"></button></code></pre>
<p>然後重新整理外部來源：</p>
<pre><code translate="no" class="language-python">job_id = client.refresh_external_collection(
    collection_name=<span class="hljs-string">&quot;products_ext&quot;</span>,
)

<span class="hljs-keyword">while</span> <span class="hljs-literal">True</span>:
    progress = client.get_refresh_external_collection_progress(job_id=job_id)
    <span class="hljs-keyword">if</span> progress.state == <span class="hljs-string">&quot;RefreshCompleted&quot;</span>:
        <span class="hljs-keyword">break</span>
    <span class="hljs-keyword">if</span> progress.state == <span class="hljs-string">&quot;RefreshFailed&quot;</span>:
        <span class="hljs-keyword">raise</span> RuntimeError(progress.reason)
    time.sleep(<span class="hljs-number">2</span>)
<button class="copy-code-btn"></button></code></pre>
<p>一旦重新整理後的版本準備就緒，就可以像一般的 Milvus 集合一樣載入並搜尋：</p>
<pre><code translate="no" class="language-python">client.load_collection(<span class="hljs-string">&quot;products_ext&quot;</span>)

results = client.search(
    collection_name=<span class="hljs-string">&quot;products_ext&quot;</span>,
    data=[query_vec],
    anns_field=<span class="hljs-string">&quot;embedding&quot;</span>,
    <span class="hljs-built_in">filter</span>=<span class="hljs-string">&quot;stock &gt; 0 and rating &gt;= 4.0&quot;</span>,
    limit=<span class="hljs-number">10</span>,
    output_fields=[<span class="hljs-string">&quot;id&quot;</span>, <span class="hljs-string">&quot;title&quot;</span>, <span class="hljs-string">&quot;stock&quot;</span>, <span class="hljs-string">&quot;rating&quot;</span>],
)
<button class="copy-code-btn"></button></code></pre>
<p>重要的差異不在於搜尋呼叫本身，而在於生命週期的起點。Milvus 管理的集合始於資料被寫入或匯入 Milvus。外部集合則始於一個指向已存在於其他地方之資料的參照。</p>
<h2 id="How-Refresh-picks-up-changes-in-external-data" class="common-anchor-header">Refresh 如何取得外部資料的變更<button data-href="#How-Refresh-picks-up-changes-in-external-data" class="anchor-icon" translate="no">
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
    </button></h2><p>外部集合從 Milvus 端來看是唯讀的，但底層的資料湖資料集不需要永遠保持靜止。</p>
<p>假設產品管道新增了一批資料、更新了中繼資料，或寫入了來自新模型的嵌入向量。Milvus 不會持續追蹤來源路徑中出現的每一個物件。這些變更會透過 <strong>Refresh</strong> 變得可見。</p>
<p>Refresh 會讀取外部中繼資料、解析來源 fragment、更新將它們連到 Milvus 集合的 manifest，並準備對應的索引狀態。</p>
<p>關鍵在於，這項工作可以是增量式的。</p>
<p>Milvus 會識別出沒有變更的來源 fragment，並重用它們既有的 segment 與索引工作。新的或變更過的 fragment 才是需要重新處理的部分。</p>
<p>因此，對一個數 TB 的大型資料集做小幅變更，不需要觸發另一次完整的匯入與完整的索引重建。</p>
<p>Refresh 也為服務系統提供了一個清楚的版本邊界。當新版本正在準備時，查詢會繼續使用先前發布的狀態。一旦 Refresh 完成，新狀態就會以完整版本的形式上線，而不是暴露出新舊資料混雜、或部分準備完成的狀態。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/milvus_30_external_collection_vector_search_on_lake_resident_data_without_a_second_copy_md_4_46aaa22589.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>這種模型很自然地符合每小時的目錄建置、每日的知識庫更新、週期性的嵌入向量重新整理、模型產生的特徵管道，以及其他類似的批次導向工作負載。</p>
<p>它<strong>不會</strong>取代串流寫入路徑。如果每一次 insert 或 delete 都必須立即透過 Milvus 變成可搜尋的，那麼受管理的集合仍然是比較好的模型。</p>
<h2 id="How-Lazy-Loading-reduces-memory-use-for-wide-datasets" class="common-anchor-header">Lazy Loading 如何為寬型資料集減少記憶體使用<button data-href="#How-Lazy-Loading-reduces-memory-use-for-wide-datasets" class="anchor-icon" translate="no">
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
    </button></h2><p>把來源資料列留在物件儲存中，只有在服務層不需要在回答查詢前先將每個位元組載入本機時，才真的有幫助。啟用 Milvus 分層儲存之後，確實如此。</p>
<p>在集合載入時，QueryNodes 可以只先保留輕量的中繼資料，例如 schema 資訊、索引定義、chunk 對應表，以及指向遠端物件的參照。欄位資料會在查詢需要時以 chunk 層級的方式擷取；索引可以保留在遠端直到首次使用，之後再快取到本機。經常使用的資料會保持在熱狀態，而較少存取的資料則可以被淘汰。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/milvus_30_external_collection_vector_search_on_lake_resident_data_without_a_second_copy_md_5_145b2aa0c7.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>這對於寬型的 AI 資料集特別有用。</p>
<p>一列產品資料可能包含多個嵌入向量、一段很長的描述、原始 JSON、圖片中繼資料、產生的摘要、庫存、定價、評分，以及許多其他屬性。一個典型的相似度搜尋可能只會碰觸一個向量加上庫存、價格與評分。沒有理由因為其他欄位屬於同一筆記錄，就必須永遠佔用服務記憶體。</p>
<p>外部集合可以在兩個層級縮小服務佔用空間：</p>
<ul>
<li><strong>首先，schema 層級的投影。</strong> 透過 <code translate="no">external_field</code>，外部集合可以只暴露應用程式需要的來源欄位。其他欄位繼續留在資料湖資料集中，不會被納入這個服務 schema。</li>
<li><strong>其次，執行期的投影。</strong> 在分層服務模型下，QueryNodes 只會擷取並快取工作負載實際需要的欄位與索引，而不是在一開始就載入整個已對應的資料集。</li>
</ul>
<p>換句話說，<strong>資料集可以在資料湖中保持寬型，而不必迫使服務佔用空間也同樣寬。</strong></p>
<p>這裡有一個顯而易見的取捨。命中冷欄位或冷索引的查詢，在首次存取時可能會有遠端讀取的成本。預熱策略可以預先載入延遲敏感的欄位或索引，而快取與淘汰策略則可以避免較少存取的狀態無限佔用本機資源。</p>
<p>重點不在於物件儲存可以表現得像 RAM 一樣。而是在於記憶體與本機磁碟可以跟著檢索工作負載的工作集走，而不是跟著來源資料集的總大小與寬度走。</p>
<p>來源格式在這裡也很重要。為了廣泛分析掃描而設計的格式，與針對較窄或隨機讀取最佳化的格式，在按需存取時會產生不同的 I/O 行為。外部集合不會抹除這些儲存層級的取捨；它讓 Milvus 可以在這些取捨之上建立檢索層。</p>
<h2 id="What-search-and-indexing-capabilities-External-Collection-supports" class="common-anchor-header">外部集合支援哪些搜尋與索引能力<button data-href="#What-search-and-indexing-capabilities-External-Collection-supports" class="anchor-icon" translate="no">
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
    </button></h2><p>外部集合不只是讓 Milvus 指向一個嵌入向量目錄然後掃描檔案。Milvus 會在外部資料上建立檢索結構，並透過其標準檢索引擎執行查詢。</p>
<h3 id="Milvus-indexes-built-over-external-data" class="common-anchor-header">在外部資料上建立的 Milvus 索引</h3><p>根據欄位與工作負載的不同，Milvus 可以建立：</p>
<ul>
<li>用於 ANN 搜尋的向量索引；</li>
<li>用於中繼資料過濾的純量索引；</li>
<li>用於半結構化屬性的 JSON 索引；</li>
<li>用於詞彙檢索的 BM25 與全文索引。</li>
<li>Milvus 資料模型支援的函式產生欄位。</li>
</ul>
<p>ANN 搜尋會使用這些索引來縮小候選集合，而不是讀取每一個來源向量。</p>
<p>這個區別很重要，因為把嵌入向量存放在資料湖中，並不等於對它營運向量資料庫。持久化給你的是位元組。正式環境的檢索還需要索引、查詢規劃、過濾、排序、快取，以及低延遲的服務路徑。</p>
<h3 id="Beyond-vector-top-K" class="common-anchor-header">超越向量 top-K</h3><p>另一個常見的誤解是把「外部集合」理解成「在 Parquet 上做向量搜尋」。這低估了正式環境檢索實際上的需求。</p>
<p>一個正式環境的搜尋結果很少只依賴向量相似度。它可能還依賴於精確詞彙、存取政策、庫存、時間戳、類別、價格、來源品質或商業排序訊號。</p>
<p>考慮一個像是這樣的查詢：</p>
<table>
<thead>
<tr><th>夏季紅色碎花洋裝，有庫存，最高評分優先</th></tr>
</thead>
<tbody>
</tbody>
</table>
<p>一個正式環境的檢索路徑可能需要多種訊號：</p>
<ul>
<li><strong>向量相似度</strong>，用於「夏季碎花洋裝」的語意。</li>
<li><strong>詞彙或全文搜尋</strong>，用於像是「紅色」這樣的精確詞彙。</li>
<li><strong>純量過濾</strong>，用來排除缺貨或低於評分門檻的產品。</li>
<li><strong>混合檢索與排序</strong>，用來結合多種檢索訊號。</li>
</ul>
<p>Milvus 3.0 也將查詢引擎擴展到初始最近鄰檢索之外，加入了<strong>伺服器端排序、聚合與分面（facet）</strong>等能力。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/milvus_30_external_collection_vector_search_on_lake_resident_data_without_a_second_copy_md_6_d805a24b72.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>更廣泛的觀點是，外部集合讓湖駐留資料獲得了一套資料庫級的檢索路徑——而不只是一種從檔案中讀取向量的方式。</p>
<h2 id="How-the-same-lake-data-supports-online-serving-and-offline-processing" class="common-anchor-header">同一份資料湖資料如何同時支援線上服務與離線處理<button data-href="#How-the-same-lake-data-supports-online-serving-and-offline-processing" class="anchor-icon" translate="no">
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
    </button></h2><p>把來源保留在開放式資料湖格式中最強的架構理由，不只是第二份副本要花錢。而是同一份資料集可以繼續被那些持續改進它的系統使用。</p>
<p>回到產品目錄的例子。</p>
<p>白天，Milvus 可以提供一個外部集合來服務產品搜尋、推薦或 agent 檢索。</p>
<p>與此同時，其他系統可以直接在資料湖資料集上運作：</p>
<ul>
<li>Spark 可以識別重複的產品。</li>
<li>訓練管道可以從新模型產生嵌入向量。</li>
<li>資料品質工作可以偵測格式錯誤或異常的記錄。</li>
<li>評估管道可以比較不同模型版本之間的檢索品質。</li>
<li>批次處理可以產生摘要、標籤或其他中繼資料。</li>
</ul>
<p>外部集合<strong>不會</strong>自己執行這些工作。Spark 仍然是 Spark；訓練仍然是訓練。它的角色是移除它們之間那道額外的服務資料邊界。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/milvus_30_external_collection_vector_search_on_lake_resident_data_without_a_second_copy_md_7_df2791e199.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>離線工作可以將改進後的資料或新欄位寫回資料湖。之後的一次 Refresh 就會讓更新後的來源可供 Milvus 檢索路徑使用。</p>
<p>不再需要一個獨立匯出與匯入的迴圈，只為了重建另一份用於服務的權威副本。</p>
<p>治理也能保持明確的劃分。來源版本、血緣與來源所有權留在資料湖平台。Milvus 維護自己集合層級的授權，以及讀取來源所需的憑證。共享同一份資料基礎，並不代表要把每個安全域都收斂到單一系統中。</p>
<p>這就是與 <a href="https://zilliz.com/blog/what-is-a-vector-lakebase"><strong>Vector Lakebase</strong></a> 的關聯：資料湖仍然是共享的資料基礎，而 Milvus 在其上提供低延遲的檢索層。外部集合是該架構的一部分，與 Storage V3、Snapshots、Spark 整合、schema 演進和 backfill 並列。</p>
<h2 id="Where-External-Collection-fitsand-where-it-does-not" class="common-anchor-header">外部集合適合什麼地方——以及不適合什麼地方<button data-href="#Where-External-Collection-fitsand-where-it-does-not" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>外部集合在以下情況非常適合：</strong></p>
<ul>
<li>您的權威資料已經存放在 Parquet、Vortex、Lance、Iceberg 或其他受支援的外部來源中。</li>
<li>資料集主要是以批次方式產出，而不是透過高頻率的交易型寫入。</li>
<li>維護第二份服務副本會造成顯著的 ETL、新鮮度或治理成本。</li>
<li>多個系統需要處理同一份開放資料集。</li>
<li>明確的 Refresh 邊界對服務新鮮度來說是可接受的。</li>
<li>您想要正式的 Milvus 檢索能力，但不希望 Milvus 成為來源資料列的擁有者。</li>
</ul>
<p><strong>在以下情況，一般的 Milvus 集合仍然是更好的選擇：</strong></p>
<ul>
<li>應用程式持續進行 insert 或 upsert；</li>
<li>刪除需要透過線上寫入路徑立即生效；</li>
<li>工作負載依賴於外部 schema 無法提供的集合功能；</li>
<li>服務設計刻意將所有必要資料保持在記憶體中，以避免遠端快取未命中。</li>
</ul>
<p><strong>有幾個邊界值得牢記在心。</strong></p>
<ul>
<li><strong>外部集合是唯讀的。</strong> 來源變更發生在 Milvus 之外。</li>
<li><strong>零複製適用於來源資料列。</strong> 索引、manifest、快取與運算仍然需要消耗資源。</li>
<li><strong>Refresh 是明確的。</strong> 它不是一套串流同步機制。</li>
<li><strong>來源必須保持可達。</strong> 搜尋、索引與 Refresh 的行為仍然取決於儲存存取與憑證。</li>
<li><strong>必須啟用 Storage V3。</strong> 在開放原始碼 Milvus 3.0 中，使用外部集合前必須先啟用它。</li>
<li><strong>外部集合不會取代上游處理。</strong> 嵌入向量產生、分群、去重與資料清理仍然在適當的上游系統中進行。</li>
</ul>
<p>因此，這個選擇是互補的，而不是二選一。系統可以對快速變動的線上狀態使用一般的 Milvus 集合，並對大型、批次產生、自然歸屬於資料湖的資料集使用外部集合。</p>
<h2 id="Try-External-Collection-in-Milvus-30" class="common-anchor-header">在 Milvus 3.0 中試用外部集合<button data-href="#Try-External-Collection-in-Milvus-30" class="anchor-icon" translate="no">
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
    </button></h2><p>外部集合已在 Milvus 3.0 中提供。從一個有代表性的資料湖資料集開始，評估對您的工作負載重要的各個面向：初始與增量 Refresh、索引建置成本、熱查詢與冷查詢行為，以及您的應用程式所需的新鮮度間隔。</p>
<p>實作細節請參閱：</p>
<ul>
<li><a href="https://milvus.io/docs/create-an-external-collection.md">建立外部集合</a></li>
<li><a href="https://milvus.io/docs/release_notes.md">Milvus 3.0 版本說明</a></li>
<li><a href="https://milvus.io/blog/announcing-milvus-3-lake-native-vector-search-and-a-more-powerful-retrieval-engine.md">Milvus 3.0 發布部落格</a></li>
</ul>
<p>如果您偏好受管理的路徑，外部集合也可以在 Zilliz Cloud 中以 <strong>Zilliz Vector Lakebase</strong> 的一部分來使用。請參閱：</p>
<ul>
<li><a href="https://docs.zilliz.com/docs/external-collection">Zilliz Cloud 中的外部集合</a></li>
<li><a href="https://zilliz.com/blog/from-vector-database-to-vector-lakebase">從向量資料庫到 Vector Lakebase</a></li>
<li><a href="https://zilliz.com/blog/why-we-built-vector-lakebase">我們為什麼打造 Vector Lakebase：為 AI 重新思考非結構化資料架構</a></li>
</ul>
<p>您也可以將實作問題或意見回饋帶到 <a href="https://github.com/milvus-io/milvus">Milvus GitHub 儲存庫</a> 或 <a href="https://discord.com/invite/8uyFbECzPX">Milvus Discord 社群</a>。</p>
