---
id: >-
  announcing-milvus-3-lake-native-vector-search-and-a-more-powerful-retrieval-engine.md
title: Milvus 3.0 發布：Lake-Native 向量搜尋與更強大的檢索引擎
author: Fendy Feng and Li Liu
date: 2026-7-27
cover: assets.zilliz.com/cover_of_milvus_3_0_6fab4ba929.jpg
tag: Announcements
recommend: true
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  Milvus 3.0, lake-native vector search, vector database, External Collections,
  AI retrieval engine
meta_title: |
  Milvus 3.0: Lake-Native Vector Search & Retrieval Engine
desc: 探索 Milvus 3.0 的湖原生向量搜尋、零複製外部集合、更快速的稀疏檢索、快照、Spark 整合，以及進階排序功能。
origin: >-
  https://milvus.io/blog/announcing-milvus-3-lake-native-vector-search-and-a-more-powerful-retrieval-engine.md
---
<p>今天，我們發布 Milvus 3.0，這是此專案的一個重大架構里程碑。它改變了 Milvus 能在哪裡建置與提供索引服務，也改變了可直接在引擎內完成多少檢索工作。</p>
<ul>
<li>Milvus 3.0 引入<strong>湖原生路徑</strong>，可為位於物件儲存與開放資料表格式中的向量資料建立索引，包括 Parquet、Lance、Iceberg 與 Vortex。團隊可以讓常駐於資料湖的資料變得可搜尋，而無需在向量資料庫中維護另一份副本。</li>
<li><strong>此版本也將 Milvus 擴展到初始候選檢索之外。</strong>伺服器端排序、聚合、分面搜尋、用於巢狀 doc/chunk 結構與 ColBERT 向量的 StructArray，以及重新設計的稀疏索引，將更多排名、分組與結果處理從應用程式碼移至檢索引擎中。</li>
</ul>
<p>這些進展共同使 Milvus 成為生產級 AI 檢索，以及結合湖原生儲存與高效能向量檢索的 <a href="https://zilliz.com/blog/from-vector-database-to-vector-lakebase">Vector Lakebase</a> 架構的開源基礎。</p>
<iframe width="560" height="315" src="https://www.youtube.com/embed/SAm4YfrO1ok?si=xzgw5RjRTwaHWYxO" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
<h2 id="A-quick-glance-at-the-Milvus-30-feature-set" class="common-anchor-header">快速瀏覽 Milvus 3.0 功能集<button data-href="#A-quick-glance-at-the-Milvus-30-feature-set" class="anchor-icon" translate="no">
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
    </button></h2><table>
<thead>
<tr><th><strong>領域</strong></th><th><strong>功能</strong></th><th><strong>重要原因</strong></th></tr>
</thead>
<tbody>
<tr><td>湖原生檢索</td><td>基於 Parquet、Lance、Iceberg 與 Vortex 的 External Collections</td><td>搜尋常駐於資料湖的資料，而無需維護第二份服務副本</td></tr>
<tr><td>以 S3 為基礎的儲存</td><td>Loon (Storage v3)</td><td>降低服務型存取的點讀取放大，並支援結構描述演進</td></tr>
<tr><td>離線/批次工作流程與復原</td><td>Snapshots、Spark DataSource V2 與線上結構描述演進</td><td>將穩定的 collection 視圖帶入評估、去重、叢集與特徵管線</td></tr>
<tr><td>檢索引擎</td><td>ORDER BY、聚合、分面、StructArray 與改進的稀疏檢索</td><td>將更多結果處理與多向量評分移入 Milvus</td></tr>
<tr><td>資料模型與操作</td><td>可為 Null 的向量、TEXT LOB、TTL、MinHash、Woodpecker 與 ForceMerge</td><td>支援更豐富的資料模型與生產環境運作模式</td></tr>
</tbody>
</table>
<h2 id="The-lake-native-infrastructure-index-and-serve-data-where-it-already-lives" class="common-anchor-header">湖原生基礎架構：在資料原本所在的位置建立索引並提供服務<button data-href="#The-lake-native-infrastructure-index-and-serve-data-where-it-already-lives" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 3.0 最大的架構變更在於系統可在哪裡建置與提供索引服務。向量資料可以保留在物件儲存上的開放格式中，同時由 Milvus 提供生產級索引、檢索與 API。</p>
<h3 id="1-External-Collections-indexing-directly-on-lake-resident-data" class="common-anchor-header">1. External Collections：直接在常駐於資料湖的資料上建立索引</h3><p>許多團隊已經將嵌入儲存在資料湖中 — Lance 資料表、Iceberg 資料表、Parquet 檔案，或 S3、GCS、Azure Blob Storage 上其他開放格式的資料集。在 Milvus 3.0 之前，搜尋這些資料通常有兩種選擇。</p>
<ul>
<li>將嵌入複製到向量資料庫。這提供低延遲搜尋，但會建立第二份副本以及必須保持同步的 ETL 管線。</li>
<li>直接查詢資料湖。這避免了重複，但若沒有 ANN 索引，向量搜尋會變成無法滿足生產延遲要求的暴力掃描。</li>
</ul>
<p><strong>External Collections 引入第三條路徑。</strong>你可以在仍保留於物件儲存中的資料之上定義 Milvus collection，將外部欄位對應到 Milvus 結構描述，並使用與原生 collection 相同的搜尋與查詢 API。來源檔案不會移動；Milvus 會在外部資料上建置並提供向量、BM25 倒排、JSON 與純量索引。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/announcing_milvus_30_lake_native_vector_search_and_a_more_powerful_retrieval_engine_md_1_c1fb7ab16e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>External Collections 是唯讀且零拷貝的</strong>，當治理、所有權邊界或營運成本要求來源資料集必須留在資料湖中時，這使它們特別有用。</p>
<p>當外部資料集變更時，Milvus 會讀取其儲存 manifest，並只為新加入的片段建立索引，而不是重建整個 collection。</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">import</span> json
<span class="hljs-keyword">import</span> os
<span class="hljs-keyword">import</span> time

<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> DataType, MilvusClient

client = MilvusClient(uri=<span class="hljs-string">&quot;&quot;</span>)

<span class="hljs-comment"># Register an Iceberg table as a zero-copy collection.</span>
schema = client.create_schema(
    external_source=<span class="hljs-string">&quot;s3://lake/docs/metadata/v1.metadata.json&quot;</span>,
    external_spec=json.dumps(
        {
            <span class="hljs-string">&quot;format&quot;</span>: <span class="hljs-string">&quot;iceberg-table&quot;</span>,
            <span class="hljs-string">&quot;snapshot_id&quot;</span>: <span class="hljs-number">123456789</span>,
            <span class="hljs-string">&quot;extfs&quot;</span>: {
                <span class="hljs-string">&quot;cloud_provider&quot;</span>: <span class="hljs-string">&quot;aws&quot;</span>,
                <span class="hljs-string">&quot;region&quot;</span>: <span class="hljs-string">&quot;us-east-1&quot;</span>,
                <span class="hljs-string">&quot;access_key_id&quot;</span>: os.environ[<span class="hljs-string">&quot;AWS_ACCESS_KEY_ID&quot;</span>],
                <span class="hljs-string">&quot;access_key_value&quot;</span>: os.environ[<span class="hljs-string">&quot;AWS_SECRET_ACCESS_KEY&quot;</span>],
            },
        }
    ),
)

schema.add_field(field_name=<span class="hljs-string">&quot;id&quot;</span>, datatype=DataType.INT64, external_field=<span class="hljs-string">&quot;doc_id&quot;</span>)
schema.add_field(field_name=<span class="hljs-string">&quot;emb&quot;</span>, datatype=DataType.FLOAT_VECTOR, dim=<span class="hljs-number">1024</span>, external_field=<span class="hljs-string">&quot;embedding&quot;</span>)
schema.add_field(field_name=<span class="hljs-string">&quot;title&quot;</span>, datatype=DataType.VARCHAR, max_length=<span class="hljs-number">1024</span>, external_field=<span class="hljs-string">&quot;title&quot;</span>)

client.create_collection(collection_name=<span class="hljs-string">&quot;docs&quot;</span>, schema=schema)

<span class="hljs-comment"># Import the external table snapshot.</span>
job_id = client.refresh_external_collection(collection_name=<span class="hljs-string">&quot;docs&quot;</span>)
<span class="hljs-keyword">while</span> <span class="hljs-literal">True</span>:
    progress = client.get_refresh_external_collection_progress(job_id=job_id)
    <span class="hljs-keyword">if</span> progress.state == <span class="hljs-string">&quot;RefreshCompleted&quot;</span>:
        <span class="hljs-keyword">break</span>
    <span class="hljs-keyword">if</span> progress.state == <span class="hljs-string">&quot;RefreshFailed&quot;</span>:
        <span class="hljs-keyword">raise</span> RuntimeError(progress.reason)
    time.sleep(<span class="hljs-number">1</span>)

index_params = client.prepare_index_params()
index_params.add_index(field_name=<span class="hljs-string">&quot;emb&quot;</span>, index_type=<span class="hljs-string">&quot;HNSW&quot;</span>, metric_type=<span class="hljs-string">&quot;COSINE&quot;</span>)
client.create_index(collection_name=<span class="hljs-string">&quot;docs&quot;</span>, index_params=index_params)

client.load_collection(collection_name=<span class="hljs-string">&quot;docs&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>對於受治理的環境，檢索可以在資料被允許所在的位置執行。對於大型 AI 系統，常駐於資料湖的資料集可以支援多個檢索部署，而無需在它們之間執行遷移作業。</p>
<p>External Collections 是一項增量能力。原生 Milvus collections 仍然是寫入密集、低延遲服務的主要路徑，而 External Collections 則是為系統記錄來源仍位於 Milvus 外部的資料集所設計。</p>
<p>更多詳細資訊，請參閱 <a href="https://milvus.io/docs/create-an-external-collection.md">Create an External Collection</a>。</p>
<h3 id="2-Loon-Storage-v3-Efficient-Point-Reads-for-Lake-Native-Retrieval" class="common-anchor-header">2. Loon (Storage v3)：用於湖原生檢索的高效率點讀取</h3><p>External Collections 提出了一個顯而易見的問題：物件儲存是為規模與耐久性而設計的，但它能否支援 ANN 搜尋之後的窄範圍點讀取？</p>
<p><strong>挑戰在於讀取放大。</strong>向量搜尋通常分為兩個階段：ANN 索引回傳候選 ID，系統再擷取這些候選項的所選欄位。為分析掃描最佳化的格式，可能會將窄範圍的邏輯查找轉變為更大的實體讀取。</p>
<p><strong>Milvus 3.0 透過 Loon（也稱為 Storage v3）解決此問題，這是一個用於 S3 相容物件儲存、以 manifest 為基礎的欄式儲存引擎。</strong>Loon 將欄位組織成具有對齊 row ID 的 <code translate="no">ColumnGroups</code>，讓純量欄位偏向篩選與掃描，而向量與點讀取密集欄位則使用為較窄查找設計的配置。</p>
<p>Loon 將向量與倒排索引與檔案格式分離，而不是將它們嵌入其中。每個資料集版本都由不可變的 manifest 描述，記錄其 <code translate="no">ColumnGroups</code>，使同一個索引引擎能夠跨 Lance、Parquet、Iceberg 與 Vortex 運作。</p>
<p>manifest 設計也讓結構描述演進的干擾更小。新增或刪除欄位可以更新中繼資料，而無需重寫現有欄位。填入新欄位會寫入新的 <code translate="no">ColumnGroup</code>，同時讓現有 <code translate="no">ColumnGroups</code> 保持不變。</p>
<p><a href="https://github.com/vortex-data/vortex"><strong>Vortex</strong></a> 是此路徑的預設格式。它是一種開放、與 Arrow 相容的欄式格式，具備彈性配置與巢狀編碼，更能匹配點查詢密集的 AI 資料。在一項使用 300 萬列、128 維向量、S3 與 256 個並行讀取器的內部基準測試中，每次點讀取的實測 I/O 從 Parquet 基準約 9.4 MB 降至搭配 Loon 的 Vortex 的 0.07 MB，約少了 135 倍。</p>
<p>Milvus 3.0 並不會讓物件儲存表現得像本機記憶體。它降低了原本會讓物件儲存不適合服務型點查找的讀取放大。格式層的謂詞下推以及本機 Vortex 變體是接下來的路線圖項目。</p>
<p><em>更多詳細資訊，請參閱我們的部落格：</em><a href="https://milvus.io/blog/why-we-built-loon-a-storage-engine-for-ai-data-that-never-stops-changing.md"><em>Why We Built Loon</em></a> <em>以及</em> <a href="https://github.com/vortex-data/vortex"><em>Vortex 專案</em></a><em>。</em></p>
<h3 id="3-Snapshots-point-in-time-view-without-data-copy" class="common-anchor-header">3. Snapshots：無需資料複製的時間點視圖</h3><p>即使生產環境 collections 持續接收寫入，離線作業也需要一致的資料視圖。Milvus snapshot 是一個時間點、唯讀視圖，它記錄對現有資料、索引與中繼資料檔案的參照，而不是複製完整資料集。</p>
<p>這使得 snapshots 的建立成本低到足以在模型替換、重新嵌入作業或結構描述遷移等高風險操作之前建立。還原 snapshot 可以透過物件儲存中的伺服器端複製重用現有資料與索引檔案，而不是重新匯入每一列並重建每個索引。這項功能對於 AI agents 這類快速變動的工作負載特別有用，因為資料不斷變更，而你需要頻繁且低成本的復原點，而不是偶爾進行沉重的備份。</p>
<p>同一個凍結視圖可以支援評估、去重、回填驗證與隔離測試，同時 live collection 持續接受寫入。snapshot 會穩定邏輯輸入，儘管工作負載仍可能共享物件儲存與網路頻寬等基礎架構。</p>
<p>Snapshots 並不取代備份。snapshot 參照由 live collection 擁有的檔案，最適合用於邏輯復原、複製與短期穩定視圖。備份則會建立獨立副本，用於長期保留與災難復原。</p>
<p>更多資訊，請參閱 <a href="https://milvus.io/docs/snapshots.md">Snapshots</a>、<a href="https://milvus.io/docs/manage-snapshots.md">Manage Snapshots</a> 與 <a href="https://milvus.io/docs/snapshot-use-cases.md">Snapshot Use Cases</a>。</p>
<h3 id="4-Spark-connector-connect-Milvus-to-batch-workflows" class="common-anchor-header">4. Spark connector：將 Milvus 連接到批次工作流程</h3><p>穩定的 snapshot 只有在批次引擎能讀取它時才有用。Milvus 3.0 將 Milvus 暴露為 Spark DataSource V2，讓 Spark、Databricks 與 EMR 作業能在標準批次管線中從 Milvus 讀取並寫入 Milvus。</p>
<p>這項功能很重要，因為 AI 資料工作流程是迭代式的：去重提供重新嵌入的輸入，叢集提供評估的輸入，而評估會產生經策展的訓練或服務集合。穩定的 snapshot 為這些作業提供一致輸入，同時 live collection 持續提供服務。透過 Spark connector，一個作業的輸出會成為下一個作業的來源，而無需每次都將完整 collection 匯出 Milvus。</p>
<p>Milvus 3.0 也引入向量原生批次運算子，用於去重、異常偵測與叢集等任務，讓計算密集工作保留在線上查詢路徑之外，同時直接在向量資料上運作。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/announcing_milvus_30_lake_native_vector_search_and_a_more_powerful_retrieval_engine_md_3_cd37cad0c3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="5-Online-schema-changes-and-backfill" class="common-anchor-header">5. 線上結構描述變更與回填</h3><p>結構描述在生產環境中很少會保持靜態 — 團隊會隨著時間加入新的嵌入模型、稀疏向量、標籤、中繼資料欄位與保留政策。Milvus 3.0 讓他們在服務持續運作的同時新增、填入與刪除欄位，而不是像過去那樣需要具破壞性的重建。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/announcing_milvus_30_lake_native_vector_search_and_a_more_powerful_retrieval_engine_md_4_51c9b4e2c1.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>新增或刪除欄位不需要重寫現有資料。<code translate="no">client.add_collection_field(...)</code> 會加入新的可為 Null 欄位，而不使 collection 離線；<code translate="no">client.drop_collection_field(...)</code> 則可在執行時移除已棄用或實驗性欄位。兩者都不會重寫現有資料 — 每一項都是對 collection manifest 的變更，而不是對資料檔案的變更，這就是為什麼不需要重建。</p>
<p>Milvus 3.0 支援兩種回填路徑：</p>
<ul>
<li><strong>內部回填</strong>（3.0 中提供）適用於從現有欄位衍生出的值。Milvus 可以在核心內從文字欄位產生 BM25 稀疏向量，消除在建置 dense-plus-sparse 混合檢索時對用戶端編碼器的需求。</li>
<li><strong>外部回填</strong>（路線圖中）將適用於在 Milvus 外部計算的值：取得 snapshot，讓 Spark 針對一致視圖執行，計算新欄位，將值寫回，並讓 Milvus 增量更新索引。這是大型重新嵌入作業的預期路徑 — 例如，在寫入持續進行的同時，為數億列新增新的嵌入欄位。</li>
</ul>
<p>總之，線上結構描述變更與回填讓檢索管線更容易演進，而不必每次資料模型變更時都重建整個 collection。</p>
<h2 id="A-More-Powerful-Engine-for-End-to-End-Retrieval" class="common-anchor-header">用於端對端檢索的更強大引擎<button data-href="#A-More-Powerful-Engine-for-End-to-End-Retrieval" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 長期以來支援的不只是密集 ANN 搜尋，還包括基於 BM25 的稀疏檢索與混合搜尋。Milvus 3.0 沿著另一個軸向擴展引擎：它將更多多階段檢索管線帶入 Milvus 本身，減少過度擷取、重複的應用程式邏輯，以及對獨立後處理服務的依賴。</p>
<h3 id="1-Server-side-ORDER-BY-sort-inside-the-engine-per-segment" class="common-anchor-header">1. 伺服器端 ORDER BY：在引擎內依 segment 排序</h3><p>過去排序需要應用程式過度擷取候選項，將它們移至用戶端，並在那裡排序。這會消耗頻寬，並使最終結果取決於用戶端截斷發生的位置。</p>
<p><strong>Milvus 3.0 新增伺服器端 ORDER BY</strong>，讓查詢工作負載可以依 rating、price、freshness、inventory 或 timestamp 等純量欄位對篩選後的列進行排序。</p>
<ul>
<li>在查詢路徑上，每個 segment 對其篩選後的結果集排序，query nodes 合併這些串流，proxy 回傳請求的切片。</li>
<li>在搜尋路徑上，ORDER BY 會在 Milvus 內對 ANN 候選集排序，減少用戶端過度擷取與重複後處理。它不會改變由 ANN 候選項所建立的召回邊界。</li>
</ul>
<pre><code translate="no" class="language-sql">client.query(
    collection_name=<span class="hljs-string">&quot;products&quot;</span>,
    <span class="hljs-built_in">filter</span>=<span class="hljs-string">&quot;category == &#x27;shoes&#x27;&quot;</span>,
    output_fields=[<span class="hljs-string">&quot;price&quot;</span>, <span class="hljs-string">&quot;rating&quot;</span>],
    limit=<span class="hljs-number">10</span>,
    order_by=[<span class="hljs-string">&quot;rating:desc&quot;</span>, <span class="hljs-string">&quot;price:asc&quot;</span>],
)
<button class="copy-code-btn"></button></code></pre>
<p>這對於將相關性與業務或使用者面向限制（例如 rating、price、freshness、inventory 或 timestamp）結合的搜尋特別有用。</p>
<p>更多資訊，請參閱 <a href="https://milvus.io/docs/single-vector-search.md#Sort-Search-Results-by-Scalar-Fields--Milvus-30x">Sort Search Results by Scalar Fields</a> 與 <a href="https://milvus.io/docs/get-and-scalar-query.md#Sort-Query-Results--Milvus-30x">Sort Query Results</a>。</p>
<h3 id="2-Aggregation-and-faceted-search" class="common-anchor-header">2. 聚合與分面搜尋</h3><p>Milvus 3.0 新增查詢端聚合，支援 count、sum、average、minimum 與 maximum 等操作，並可依一個或多個純量欄位分組。這移除了常見模式：團隊只是為了計數、分組或計算簡單統計，就將篩選後的列拉到用戶端程式碼中。</p>
<pre><code translate="no" class="language-sql">client.query(
    collection_name=<span class="hljs-string">&quot;orders&quot;</span>,
    <span class="hljs-built_in">filter</span>=<span class="hljs-string">&quot;in_stock == true&quot;</span>,
    group_by_fields=[<span class="hljs-string">&quot;category&quot;</span>],
    output_fields=[<span class="hljs-string">&quot;category&quot;</span>, <span class="hljs-string">&quot;count(*)&quot;</span>, <span class="hljs-string">&quot;avg(price)&quot;</span>, <span class="hljs-string">&quot;max(rating)&quot;</span>],
)
<button class="copy-code-btn"></button></code></pre>
<p>Milvus 3.0 也新增用於分面搜尋的<strong>搜尋聚合</strong>。在 ANN 搜尋之後，Milvus 會依欄位對擷取到的命中結果分組，並回傳 bucket 計數、聚合統計與每個 bucket 的 top-N 範例命中 — 這正是依品牌、價格範圍、顏色、租戶或文件類型分組背後的模式。有一點需要注意：搜尋聚合是在 ANN 擷取到的結果集上運作，而不是整個 collection，因此分面計數是近似值。當你需要精確計數時，請使用查詢端聚合。</p>
<p>更多資訊，請參閱 <a href="https://milvus.io/docs/get-and-scalar-query.md#Aggregate-Query-Results--Milvus-30x">Aggregate Query Results</a>。</p>
<h3 id="3-StructArray-for-Nested-Vectors-and-Late-Interaction-Model" class="common-anchor-header">3. 用於巢狀向量與 late-interaction 模型的 StructArray</h3><p>許多實體很自然地由多個向量表示。一篇長文件是一系列 chunk；一段影片是一連串 frame，你更希望將它們保留在同一列中，而不是分散到多列；一個產品有多張圖片或多個角度。Late-interaction 模型更進一步 — ColBERT 會為每個 token 產生一個向量，ColPali 會為每個視覺 patch 產生一個向量。在每種情況下，你真正想要儲存與搜尋的單位都是整個實體，而不是各個 fragment 本身。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/announcing_milvus_30_lake_native_vector_search_and_a_more_powerful_retrieval_engine_md_5_e15816e38b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>StructArray</strong> 允許 Milvus 的一列包含可變長度的結構化元素陣列，包括多個向量，同時保留單一 entity ID 與單一組中繼資料。這避免了將文件拆成多列，並在 fragments 之間重複標籤、權限或其他欄位。</p>
<p>Milvus 支援兩種搜尋粒度。</p>
<ul>
<li><strong>元素層級搜尋</strong>會將一個查詢向量與清單中的每個元素比對，並回傳特定匹配元素及其 offset。當你想知道是哪個 chunk、token、patch 或 image 匹配時，這很有用。如果多個元素匹配，同一列可能會出現多次。</li>
<li><strong>實體層級搜尋</strong>使用 <code translate="no">MAX_SIM</code> 搭配 <code translate="no">MAX_SIM_COSINE</code> metric，將查詢的完整向量清單與列中的向量清單比較。每個查詢 token 都會取得其在文件中的最佳匹配，然後將這些最佳分數加總。這讓 Milvus 在保持每份文件一列的同時，原生支援 ColBERT 與 ColPali 等 late-interaction 檢索模式。</li>
</ul>
<p>為每個 token 向量建立索引可能成本高昂；因此 Milvus 3.0 新增多種加速路徑，包括 TokenANN、Muvera 與 Lemur，它們在索引大小、訓練成本與召回率之間做取捨。</p>
<table>
<thead>
<tr><th>策略</th><th>第一階段表示</th><th>成本概況</th><th>最適用於</th></tr>
</thead>
<tbody>
<tr><td>TokenANN</td><td>每個 token 向量都會建立索引。</td><td>最高，精確</td><td>高辨識度模型與短文件</td></tr>
<tr><td>Muvera</td><td>使用 random-projection FDE，每份文件一個向量。</td><td>中等，無需訓練</td><td>長文件</td></tr>
<tr><td>Lemur</td><td>使用 learned MLP compression，每份文件一個向量</td><td>最低，需要訓練</td><td>低辨識度模型與視覺或 patch 向量</td></tr>
</tbody>
</table>
<p>在我們的基準測試中，Lemur 在多數資料集上的召回率匹配或優於 TokenANN，同時將每份文件壓縮為單一向量；例外是長度變異很高的語料庫，在這種情況下 TokenANN 或其他策略較為安全。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/announcing_milvus_30_lake_native_vector_search_and_a_more_powerful_retrieval_engine_md_7_8ff1ab957e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>對於大於記憶體的語料庫，Milvus 也支援 <code translate="no">DISKANN</code> 索引，可將 embedding lists 保存在磁碟上以降低 RAM 壓力。</p>
<p>元素層級搜尋已在 Milvus 2.6 中推出。Muvera、Lemur 與 StructList 的篩選則是 3.0 的新功能。</p>
<h3 id="4-BM25-Index-Compression-and-SINDI" class="common-anchor-header">4. BM25 索引壓縮與 SINDI</h3><p>Milvus 在較早版本中已支援稀疏向量搜尋。Milvus 3.0 透過區塊壓縮 postings（VByte 相關演算法加上 SIMD 解碼）與量化（內積使用 fp16，BM25 使用 u16）降低稀疏索引佔用空間。</p>
<p>在一組內部 BM25 基準測試中，新的實作在相近召回率下約比 Milvus 2.6 稀疏索引小 3 倍。較小的索引降低記憶體與頻寬壓力，並可改善受資料移動限制的工作負載速度。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/announcing_milvus_30_lake_native_vector_search_and_a_more_powerful_retrieval_engine_md_8_2e62fc9573.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Milvus 3.0 也引入 <a href="https://arxiv.org/abs/2509.08395">SINDI</a>，這是一種新的稀疏檢索演算法，針對 SPLADE 等學習式稀疏嵌入最佳化。由於這些嵌入會產生比 BM25 更密集的 posting lists，重度剪枝的搜尋演算法可能會花費大量 CPU 時間決定要跳過哪些項目。SINDI 改為將 postings 組織成緊湊的 windows，並使用 SIMD 友善的分數累加來高效率處理它們，同時透過無損剪枝保留檢索準確性。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/announcing_milvus_30_lake_native_vector_search_and_a_more_powerful_retrieval_engine_md_9_c7de29a223.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>我們也將 SINDI 擴展到其原始設計之外，加入原生 BM25 支援，使 Milvus 能對學習式稀疏嵌入與傳統全文搜尋使用同一條最佳化的稀疏檢索路徑。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/announcing_milvus_30_lake_native_vector_search_and_a_more_powerful_retrieval_engine_md_10_e94a903bcd.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>在我們跨 4 個 SPLADE 稀疏向量資料集的基準測試中，SINDI 在 learned-sparse vectors 上的 QPS 最高可達 MaxScore 約 10 倍，最差情況也約為 5 倍。</p>
<p>SINDI 是 Milvus 3.0 中稀疏內積搜尋的預設選項。</p>
<h2 id="Other-Enhancements" class="common-anchor-header">其他增強功能<button data-href="#Other-Enhancements" class="anchor-icon" translate="no">
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
    </button></h2><ul>
<li><strong>TEXT LOB:</strong> 在向量旁儲存長篇來源文字。小於 64 KB 的文字維持內嵌；較大的值使用 Vortex LOB 參照。</li>
<li><strong>擴展的密集索引支援：</strong> 在 Faiss 家族中新增更多索引選擇，包括 SVS、Panorama、PQ、IVFPQ 與 ScaNN，以滿足不同規模、記憶體與召回需求。</li>
<li><strong>MinHash 與近重複搜尋：</strong> 在伺服器端產生 MinHash signatures，並使用 MINHASH_LSH 擷取近重複候選項。</li>
<li><strong>可為 Null 的向量與新型別：</strong> 允許向量欄位為 NULL，並新增 TIMESTAMPTZ 以支援時間感知篩選與保留政策。</li>
<li><strong>自訂全文字典：</strong> 在叢集上註冊字典、同義詞與停用詞資源，以支援多語言與領域特定 tokenization。</li>
<li><strong>獨立 Woodpecker：</strong> 將 Milvus write-ahead log 作為可獨立擴展且可觀測的服務執行。</li>
<li><strong>實體</strong> <strong>TTL****:</strong> 透過 TIMESTAMPTZ 欄位使個別記錄過期，先進行 MVCC 篩選，再於 compaction 期間進行 garbage collection。</li>
<li><strong>ForceMerge:</strong> 將小型 segments 壓縮至目標大小並重建索引，以在長時間讀取密集服務之前降低讀取放大。</li>
<li>以及更多</li>
</ul>
<h2 id="Get-started-with-Milvus-30" class="common-anchor-header">開始使用 Milvus 3.0<button data-href="#Get-started-with-Milvus-30" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 3.0 現已在 Apache 2.0 授權下提供，並持續作為 LF AI &amp; Data 專案。若要開始使用：</p>
<ul>
<li>閱讀<a href="https://milvus.io/docs/release_notes.md">版本說明</a>與<a href="https://milvus.io/docs/quickstart.md">快速入門</a>，並在 <a href="https://github.com/milvus-io/milvus">github.com/milvus-io/milvus</a> 取得原始碼。</li>
<li>加入 <a href="https://discord.com/invite/8uyFbECzPX">Milvus Discord 社群</a>，或預約 <a href="https://milvus.io/office-hours">Milvus Office Hours</a> 時段，與維護者討論你的使用案例。</li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/announcing_milvus_30_lake_native_vector_search_and_a_more_powerful_retrieval_engine_md_11_78476298b9.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Milvus-30-and-Zilliz-Vector-Lakebase" class="common-anchor-header">Milvus 3.0 與 Zilliz Vector Lakebase<button data-href="#Milvus-30-and-Zilliz-Vector-Lakebase" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 3.0 為生產級 AI 檢索與新興的 <a href="https://zilliz.com/blog/from-vector-database-to-vector-lakebase">Vector Lakebase</a> 架構奠定開源基礎，該架構在單一真相來源上結合湖原生儲存與高效能向量檢索，並讓各自以適當成本運作。</p>
<p><a href="https://zilliz.com/">Zilliz Cloud</a> 是由 Milvus 背後團隊打造的全託管 Vector Lakebase。它與 Milvus 共享相同的分散式湖原生架構，並完全相容於 Milvus API。Zilliz Cloud 由其專有 Cardinal 索引引擎驅動，相較標準開源索引方法可提供最高 10× 更佳的性價比，同時消除管理基礎架構的營運複雜度。企業功能包括 scale-to-zero compute、跨區域災難復原、BYOC 部署、企業級安全與合規（SOC 2、HIPAA、ISO 27001 與 GDPR），以及最高 99.99% SLA。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/announcing_milvus_30_lake_native_vector_search_and_a_more_powerful_retrieval_engine_md_12_08d1c21d25.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>開發者可以將 Milvus 部署為開源向量資料庫，或使用 <a href="https://zilliz.com/">Zilliz Cloud</a> 作為託管平台，在 AI 資料生命週期中支援多種工作負載。</p>
<h2 id="What-comes-next" class="common-anchor-header">接下來是什麼<button data-href="#What-comes-next" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 路線圖將基於 3.0 架構持續發展，包含 External Collections 的謂詞下推、外部回填、更多 Spark 運算子，以及支援更多資料表格式，包括 Delta Lake 與 Apache Paimon。</p>
<p>更大的方向很明確：AI 資料系統需要在線上檢索與離線資料改進之間建立更緊密的迴圈。每當團隊想要搜尋、分析、改進或提供向量資料服務時，向量資料不應被迫複製到分離的系統中。</p>
