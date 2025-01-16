---
id: how-to-migrate-data-to-milvus-seamlessly.md
title: 如何無縫遷移您的資料到 Milvus：全面指南
author: Wenhui Zhang
date: 2023-12-01T00:00:00.000Z
desc: 將您的資料從 Elasticsearch、FAISS 和舊版 Milvus 1.x 遷移到 Milvus 2.x 版本的全面指南。
cover: assets.zilliz.com/How_to_Migrate_Your_Data_to_Milvus_with_Ease_485dcb8b22.png
tag: Engineering
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Vector Management, Data Migration, Milvus Migration
recommend: true
canonicalUrl: >-
  https://zilliz.com/blog/how-to-migrate-data-to-milvus-seamlessly-comprehensive-guide
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/How_to_Migrate_Your_Data_to_Milvus_with_Ease_485dcb8b22.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><a href="https://milvus.io/">Milvus</a>是一個強大的開放原始碼向量資料庫，用於<a href="https://zilliz.com/learn/vector-similarity-search">相似性搜尋</a>，能夠以最小的延遲儲存、處理和擷取數十億甚至數萬億的向量資料。它也是高度可擴充、可靠、雲原生且功能豐富的資料庫。<a href="https://milvus.io/blog/unveiling-milvus-2-3-milestone-release-offering-support-for-gpu-arm64-cdc-and-other-features.md">Milvus 的最新版本</a>引入了更多令人振奮的功能和改進，包括<a href="https://zilliz.com/blog/getting-started-with-gpu-powered-milvus-unlocking-10x-higher-performance">GPU 支援</a>，可將效能提升 10 倍以上，以及 MMap，可在單一機器上提供更大的儲存容量。</p>
<p>截至 2023 年 9 月，Milvus 已在 GitHub 上贏得近 23,000 顆星星，並擁有來自各行各業、需求各異的數萬名使用者。隨著<a href="https://zilliz.com/learn/ChatGPT-Vector-Database-Prompt-as-code">ChatGPT</a>等 Generative AI 技術的普及，它也變得更加流行。它是各種 AI 堆疊的重要組成部分，尤其是<a href="https://zilliz.com/use-cases/llm-retrieval-augmented-generation">檢索擴增生成</a>框架，可解決大型語言模型的幻覺問題。</p>
<p>為了滿足希望遷移到 Milvus 的新用戶和希望升級到最新 Milvus 版本的現有用戶日益增長的需求，我們開發了<a href="https://github.com/zilliztech/milvus-migration">Milvus Migration</a>。在這篇部落格中，我們將探討 Milvus Migration 的功能，並引導您快速地將資料從 Milvus 1.x、<a href="https://zilliz.com/blog/set-up-with-facebook-ai-similarity-search-faiss">FAISS</a> 和<a href="https://zilliz.com/comparison/elastic-vs-milvus">Elasticsearch 7.0</a>及更高版本轉移到 Milvus。</p>
<h2 id="Milvus-Migration-a-powerful-data-migration-tool" class="common-anchor-header">Milvus Migration，強大的資料遷移工具<button data-href="#Milvus-Migration-a-powerful-data-migration-tool" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://github.com/zilliztech/milvus-migration">Milvus Migration</a>是用 Go 寫成的資料遷移工具。它能讓使用者將資料從舊版本的 Milvus (1.x)、FAISS 和 Elasticsearch 7.0 及更高版本無縫遷移至 Milvus 2.x 版本。</p>
<p>下圖展示了我們如何建立 Milvus Migration 及其運作方式。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/milvus_migration_architecture_144e22f499.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="How-Milvus-Migration-migrates-data" class="common-anchor-header">Milvus Migration 如何遷移資料</h3><h4 id="From-Milvus-1x-and-FAISS-to-Milvus-2x" class="common-anchor-header">從 Milvus 1.x 和 FAISS 遷移到 Milvus 2.x</h4><p>從 Milvus 1.x 和 FAISS 的資料遷移包括解析原始資料檔案的內容，轉換成 Milvus 2.x 的資料儲存格式，並使用 Milvus SDK 的<code translate="no">bulkInsert</code> 寫入資料。整個過程以流為基礎，理論上只受限於磁碟空間，並將資料檔案儲存於本機磁碟、S3、OSS、GCP 或 Minio。</p>
<h4 id="From-Elasticsearch-to-Milvus-2x" class="common-anchor-header">從 Elasticsearch 到 Milvus 2.x</h4><p>在 Elasticsearch 資料遷移中，資料擷取是不同的。資料不是從檔案取得，而是使用 Elasticsearch 的捲動 API 依序取得。然後將資料解析並轉換為 Milvus 2.x 儲存格式，接著使用<code translate="no">bulkInsert</code> 寫入資料。除了遷移儲存在 Elasticsearch 中的<code translate="no">dense_vector</code> 類型向量之外，Milvus Migration 也支援遷移其他欄位類型，包括長、整數、短、布林、關鍵字、文字和 double。</p>
<h3 id="Milvus-Migration-feature-set" class="common-anchor-header">Milvus Migration 功能集</h3><p>Milvus Migration通過其強大的功能集簡化了遷移過程：</p>
<ul>
<li><p><strong>支援的資料來源：</strong></p>
<ul>
<li><p>Milvus 1.x 至 Milvus 2.x</p></li>
<li><p>Elasticsearch 7.0 及以上至 Milvus 2.x</p></li>
<li><p>FAISS 至 Milvus 2.x</p></li>
</ul></li>
</ul>
<ul>
<li><p><strong>多種互動模式：</strong></p>
<ul>
<li><p>使用 Cobra 框架的命令列介面 (CLI)</p></li>
<li><p>內建 Swagger UI 的 Restful API</p></li>
<li><p>整合為其他工具中的 Go 模組</p></li>
</ul></li>
</ul>
<ul>
<li><p><strong>多樣化的檔案格式支援：</strong></p>
<ul>
<li><p>本機檔案</p></li>
<li><p>亞馬遜 S3</p></li>
<li><p>物件儲存服務 (OSS)</p></li>
<li><p>Google 雲端平台 (GCP)</p></li>
</ul></li>
</ul>
<ul>
<li><p><strong>彈性的 Elasticsearch 整合：</strong></p>
<ul>
<li><p>從 Elasticsearch 遷移<code translate="no">dense_vector</code> 類型向量</p></li>
<li><p>支援遷移其他欄位類型，例如 long、integer、short、boolean、keyword、text 和 double</p></li>
</ul></li>
</ul>
<h3 id="Interface-definitions" class="common-anchor-header">介面定義</h3><p>Milvus Migration 提供下列主要介面：</p>
<ul>
<li><p><code translate="no">/start</code>:啟動遷移工作（等同於 dump 和 load 的組合，目前僅支援 ES 遷移）。</p></li>
<li><p><code translate="no">/dump</code>:啟動轉儲工作（將源資料寫入目標儲存媒體）。</p></li>
<li><p><code translate="no">/load</code>:啟動載入作業（將資料從目標儲存媒體寫入 Milvus 2.x）。</p></li>
<li><p><code translate="no">/get_job</code>:允許使用者檢視工作執行結果。(如需詳細資訊，請參閱<a href="https://github.com/zilliztech/milvus-migration/blob/main/server/server.go">專案的 server.go</a>）。</p></li>
</ul>
<p>接下來，讓我們使用一些範例資料來探討如何在本節中使用 Milvus Migration。您可以在 GitHub<a href="https://github.com/zilliztech/milvus-migration#migration-examples-migrationyaml-details">這裡</a>找到這些範例。</p>
<h2 id="Migration-from-Elasticsearch-to-Milvus-2x" class="common-anchor-header">從 Elasticsearch 遷移到 Milvus 2.x<button data-href="#Migration-from-Elasticsearch-to-Milvus-2x" class="anchor-icon" translate="no">
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
    </button></h2><ol>
<li>準備 Elasticsearch 資料</li>
</ol>
<p>要<a href="https://zilliz.com/blog/elasticsearch-cloud-vs-zilliz">遷移 Elasticsearch</a>資料，您應該已經設定好自己的 Elasticsearch 伺服器。您應該在<code translate="no">dense_vector</code> 欄位中儲存向量資料，並將它們與其他欄位建立索引。索引對應如下所示。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/migrate_elasticsearch_data_milvus_index_mappings_59370f9596.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<ol start="2">
<li>編譯與建立</li>
</ol>
<p>首先，<a href="https://github.com/zilliztech/milvus-migration">從 GitHub</a> 下載 Milvus Migration 的<a href="https://github.com/zilliztech/milvus-migration">原始碼</a>。然後，執行下列指令來編譯。</p>
<pre><code translate="no"><span class="hljs-keyword">go</span> get
<span class="hljs-keyword">go</span> build
<button class="copy-code-btn"></button></code></pre>
<p>此步驟會產生一個名為<code translate="no">milvus-migration</code> 的可執行檔案。</p>
<ol start="3">
<li>設定<code translate="no">migration.yaml</code></li>
</ol>
<p>在開始遷移之前，您必須準備一個名為<code translate="no">migration.yaml</code> 的配置檔案，其中包含資料來源、目標和其他相關設定的資訊。以下是一個配置範例：</p>
<pre><code translate="no"><span class="hljs-comment"># Configuration for Elasticsearch to Milvus 2.x migration</span>


dumper:
  worker:
    workMode: Elasticsearch
    reader:
      bufferSize: 2500
meta:
  mode: config
  index: test_index
  fields:
    - name: <span class="hljs-built_in">id</span>
      pk: <span class="hljs-literal">true</span>
      <span class="hljs-built_in">type</span>: long
    - name: other_field
      maxLen: 60
      <span class="hljs-built_in">type</span>: keyword
    - name: data
      <span class="hljs-built_in">type</span>: dense_vector
      dims: 512
  milvus:
      collection: <span class="hljs-string">&quot;rename_index_test&quot;</span>
      closeDynamicField: <span class="hljs-literal">false</span>
      consistencyLevel: Eventually
      shardNum: 1


<span class="hljs-built_in">source</span>:
  es:
    urls:
      - http://localhost:9200
    username: xxx
    password: xxx


target:
  mode: remote
  remote:
    outputDir: outputPath/migration/test1
    cloud: aws
    region: us-west-2
    bucket: xxx
    useIAM: <span class="hljs-literal">true</span>
    checkBucket: <span class="hljs-literal">false</span>
  milvus2x:
    endpoint: {yourMilvusAddress}:{port}
    username: ******
    password: ******
<button class="copy-code-btn"></button></code></pre>
<p>有關配置檔案的詳細說明，請參閱 GitHub 上的<a href="https://github.com/zilliztech/milvus-migration/blob/main/README_ES.md#elasticsearch-to-milvus-2x-migrationyaml-example">此頁面</a>。</p>
<ol start="4">
<li>執行轉移工作</li>
</ol>
<p>現在您已經配置好<code translate="no">migration.yaml</code> 檔案，可以執行以下指令開始執行遷移任務：</p>
<pre><code translate="no">./milvus-migration start --config=/{YourConfigFilePath}/migration.yaml
<button class="copy-code-btn"></button></code></pre>
<p>觀察日誌輸出。當您看到類似以下的日誌時，表示轉移成功。</p>
<pre><code translate="no">[task/load_base_task.go:94] [<span class="hljs-string">&quot;[LoadTasker] Dec Task Processing--------------&gt;&quot;</span>] [Count=0] [fileName=testfiles/output/zwh/migration/test_mul_field4/data_1_1.json] [taskId=442665677354739304][task/load_base_task.go:76] [<span class="hljs-string">&quot;[LoadTasker] Progress Task ---------------&gt;&quot;</span>] [fileName=testfiles/output/zwh/migration/test_mul_field4/data_1_1.json] [taskId=442665677354739304][dbclient/cus_field_milvus2x.go:86] [<span class="hljs-string">&quot;[Milvus2x] begin to ShowCollectionRows&quot;</span>][loader/cus_milvus2x_loader.go:66] [<span class="hljs-string">&quot;[Loader] Static: &quot;</span>] [collection=test_mul_field4_rename1] [beforeCount=50000] [afterCount=100000] [increase=50000][loader/cus_milvus2x_loader.go:66] [<span class="hljs-string">&quot;[Loader] Static Total&quot;</span>] [<span class="hljs-string">&quot;Total Collections&quot;</span>=1] [beforeTotalCount=50000] [afterTotalCount=100000] [totalIncrease=50000][migration/es_starter.go:25] [<span class="hljs-string">&quot;[Starter] migration ES to Milvus finish!!!&quot;</span>] [Cost=80.009174459][starter/starter.go:106] [<span class="hljs-string">&quot;[Starter] Migration Success!&quot;</span>] [Cost=80.00928425][cleaner/remote_cleaner.go:27] [<span class="hljs-string">&quot;[Remote Cleaner] Begin to clean files&quot;</span>] [bucket=a-bucket] [rootPath=testfiles/output/zwh/migration][cmd/start.go:32] [<span class="hljs-string">&quot;[Cleaner] clean file success!&quot;</span>]
<button class="copy-code-btn"></button></code></pre>
<p>除了命令行方式，Milvus Migration也支持使用Restful API進行遷移。</p>
<p>要使用Restful API，請使用以下命令啟動API服務器：</p>
<pre><code translate="no">./milvus-migration server run -p 8080
<button class="copy-code-btn"></button></code></pre>
<p>一旦服務運行，你就可以通過呼叫 API 來啟動遷移。</p>
<pre><code translate="no">curl -XPOST http://localhost:8080/api/v1/start
<button class="copy-code-btn"></button></code></pre>
<p>當遷移完成後，你可以使用<a href="https://zilliz.com/attu">Attu</a>（一體化的向量資料庫管理工具）查看成功遷移的總行數，並執行其他與收集相關的操作。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/attu_interface_vector_database_admin_4893a31f6d.png" alt="The Attu interface" class="doc-image" id="the-attu-interface" />
   </span> <span class="img-wrapper"> <span>Attu 介面</span> </span></p>
<h2 id="Migration-from-Milvus-1x-to-Milvus-2x" class="common-anchor-header">從 Milvus 1.x 遷移到 Milvus 2.x<button data-href="#Migration-from-Milvus-1x-to-Milvus-2x" class="anchor-icon" translate="no">
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
    </button></h2><ol>
<li>準備 Milvus 1.x 資料</li>
</ol>
<p>為了幫助您快速體驗遷移過程，我們在 Milvus Migration 的源代碼中放了 10,000 個 Milvus 1.x<a href="https://github.com/zilliztech/milvus-migration/blob/main/README_1X.md">測試數據</a>記錄。然而，在實際情況下，你必須在開始遷移過程之前，從你的Milvus 1.x實例中導出你自己的<code translate="no">meta.json</code> 檔案。</p>
<ul>
<li>您可以使用以下命令匯出資料。</li>
</ul>
<pre><code translate="no">./milvus-migration <span class="hljs-built_in">export</span> -m <span class="hljs-string">&quot;user:password@tcp(adderss)/milvus?charset=utf8mb4&amp;parseTime=True&amp;loc=Local&quot;</span> -o outputDir
<button class="copy-code-btn"></button></code></pre>
<p>確保</p>
<ul>
<li><p>用您實際的 MySQL 認證取代占位符。</p></li>
<li><p>在執行此匯出之前，停止 Milvus 1.x 伺服器或停止資料寫入。</p></li>
<li><p>複製 Milvus<code translate="no">tables</code> 資料夾和<code translate="no">meta.json</code> 檔案到同一個目錄。</p></li>
</ul>
<p><strong>注意：</strong>如果您在<a href="https://zilliz.com/cloud">Zilliz Cloud</a>（Milvus 的完全管理服務）上使用 Milvus 2.x，您可以使用 Cloud Console 開始遷移。</p>
<ol start="2">
<li>編譯和建立</li>
</ol>
<p>首先，<a href="https://github.com/zilliztech/milvus-migration">從 GitHub</a> 下載 Milvus Migration 的<a href="https://github.com/zilliztech/milvus-migration">原始碼</a>。然後，執行下列指令來編譯。</p>
<pre><code translate="no"><span class="hljs-keyword">go</span> get
<span class="hljs-keyword">go</span> build
<button class="copy-code-btn"></button></code></pre>
<p>此步驟將生成一個名為<code translate="no">milvus-migration</code> 的可執行檔案。</p>
<ol start="3">
<li>配置<code translate="no">migration.yaml</code></li>
</ol>
<p>準備一個<code translate="no">migration.yaml</code> 的設定檔，指定來源、目標和其他相關設定的詳細資訊。以下是一個配置範例：</p>
<pre><code translate="no"><span class="hljs-comment"># Configuration for Milvus 1.x to Milvus 2.x migration</span>


dumper:
  worker:
    <span class="hljs-built_in">limit</span>: 2
    workMode: milvus1x
    reader:
      bufferSize: 1024
    writer:
      bufferSize: 1024
loader:
  worker:
    <span class="hljs-built_in">limit</span>: 16
meta:
  mode: <span class="hljs-built_in">local</span>
  localFile: /outputDir/test/meta.json


<span class="hljs-built_in">source</span>:
  mode: <span class="hljs-built_in">local</span>
  <span class="hljs-built_in">local</span>:
    tablesDir: /db/tables/


target:
  mode: remote
  remote:
    outputDir: <span class="hljs-string">&quot;migration/test/xx&quot;</span>
    ak: xxxx
    sk: xxxx
    cloud: aws
    endpoint: 0.0.0.0:9000
    region: ap-southeast-1
    bucket: a-bucket
    useIAM: <span class="hljs-literal">false</span>
    useSSL: <span class="hljs-literal">false</span>
    checkBucket: <span class="hljs-literal">true</span>
  milvus2x:
    endpoint: localhost:19530
    username: xxxxx
    password: xxxxx
<button class="copy-code-btn"></button></code></pre>
<p>有關配置檔案的詳細說明，請參閱 GitHub 上的<a href="https://github.com/zilliztech/milvus-migration/blob/main/README_1X.md">此頁面</a>。</p>
<ol start="4">
<li>執行遷移工作</li>
</ol>
<p>您必須分別執行<code translate="no">dump</code> 和<code translate="no">load</code> 指令才能完成遷移。這些命令會轉換資料並匯入 Milvus 2.x。</p>
<p><strong>注意：</strong>我們將簡化這一步驟，使用戶只需使用一個命令即可完成遷移。敬請期待。</p>
<p><strong>Dump 指令</strong></p>
<pre><code translate="no">./milvus-migration dump --config=/{YourConfigFilePath}/migration.yaml
<button class="copy-code-btn"></button></code></pre>
<p><strong>Load Command：</strong></p>
<pre><code translate="no">./milvus-migration load --config=/{YourConfigFilePath}/migration.yaml
<button class="copy-code-btn"></button></code></pre>
<p>遷移完成後，在 Milvus 2.x 中產生的集合將包含兩個欄位：<code translate="no">id</code> 和<code translate="no">data</code> 。您可以使用多合一向量資料庫管理工具<a href="https://zilliz.com/attu">Attu</a> 檢視更多詳細資訊。</p>
<h2 id="Migration-from-FAISS-to-Milvus-2x" class="common-anchor-header">從 FAISS 遷移到 Milvus 2.x<button data-href="#Migration-from-FAISS-to-Milvus-2x" class="anchor-icon" translate="no">
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
    </button></h2><ol>
<li>準備 FAISS 資料</li>
</ol>
<p>要遷移 Elasticsearch 資料，您應該準備好自己的 FAISS 資料。為了幫助您快速體驗遷移過程，我們在 Milvus Migration 的原始碼中放入了一些<a href="https://github.com/zilliztech/milvus-migration/blob/main/README_FAISS.md">FAISS 測試資料</a>。</p>
<ol start="2">
<li>編譯和建立</li>
</ol>
<p>首先，<a href="https://github.com/zilliztech/milvus-migration">從 GitHub</a> 下載 Milvus Migration 的<a href="https://github.com/zilliztech/milvus-migration">原始碼</a>。然後，執行下列指令來編譯它。</p>
<pre><code translate="no"><span class="hljs-keyword">go</span> get
<span class="hljs-keyword">go</span> build
<button class="copy-code-btn"></button></code></pre>
<p>此步驟會產生一個名為<code translate="no">milvus-migration</code> 的可執行檔案。</p>
<ol start="3">
<li>配置<code translate="no">migration.yaml</code></li>
</ol>
<p>為 FAISS 遷移準備<code translate="no">migration.yaml</code> 配置檔案，指定來源、目標和其他相關設定的詳細資訊。以下是一個配置範例：</p>
<pre><code translate="no"><span class="hljs-comment"># Configuration for FAISS to Milvus 2.x migration</span>


dumper:
  worker:
    <span class="hljs-built_in">limit</span>: 2
    workMode: FAISS
    reader:
      bufferSize: 1024
    writer:
      bufferSize: 1024
loader:
  worker:
    <span class="hljs-built_in">limit</span>: 2
<span class="hljs-built_in">source</span>:
  mode: <span class="hljs-built_in">local</span>
  <span class="hljs-built_in">local</span>:
    FAISSFile: ./testfiles/FAISS/FAISS_ivf_flat.index


target:
  create:
    collection:
      name: test1w
      shardsNums: 2
      dim: 256
      metricType: L2
  mode: remote
  remote:
    outputDir: testfiles/output/
    cloud: aws
    endpoint: 0.0.0.0:9000
    region: ap-southeast-1
    bucket: a-bucket
    ak: minioadmin
    sk: minioadmin
    useIAM: <span class="hljs-literal">false</span>
    useSSL: <span class="hljs-literal">false</span>
    checkBucket: <span class="hljs-literal">true</span>
  milvus2x:
    endpoint: localhost:19530
    username: xxxxx
    password: xxxxx
<button class="copy-code-btn"></button></code></pre>
<p>有關配置檔案的詳細說明，請參閱 GitHub 上的<a href="https://github.com/zilliztech/milvus-migration/blob/main/README_FAISS.md">此頁面</a>。</p>
<ol start="4">
<li>執行遷移工作</li>
</ol>
<p>和 Milvus 1.x 向 Milvus 2.x 遷移一樣，FAISS 遷移也需要執行<code translate="no">dump</code> 和<code translate="no">load</code> 兩個命令。這些命令會轉換資料並匯入 Milvus 2.x。</p>
<p><strong>注意：</strong>我們將簡化這一步驟，使用戶只需使用一個命令即可完成遷移。敬請期待。</p>
<p><strong>Dump 指令</strong></p>
<pre><code translate="no">./milvus-migration dump --config=/{YourConfigFilePath}/migration.yaml
<button class="copy-code-btn"></button></code></pre>
<p><strong>載入指令：</strong></p>
<pre><code translate="no">./milvus-migration load --config=/{YourConfigFilePath}/migration.yaml
<button class="copy-code-btn"></button></code></pre>
<p>您可以使用多合一向量資料庫管理工具<a href="https://zilliz.com/attu">Attu</a> 檢視更多細節。</p>
<h2 id="Stay-tuned-for-future-migration-plans" class="common-anchor-header">請繼續關注未來的遷移計劃<button data-href="#Stay-tuned-for-future-migration-plans" class="anchor-icon" translate="no">
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
    </button></h2><p>未來，我們會支援從更多資料來源進行遷移，並新增更多遷移功能，包括</p>
<ul>
<li><p>支援從 Redis 遷移到 Milvus。</p></li>
<li><p>支援從 MongoDB 遷移到 Milvus。</p></li>
<li><p>支援可恢復的遷移。</p></li>
<li><p>將 dump 與 load 程序合二為一，簡化遷移指令。</p></li>
<li><p>支援從其他主流資料來源遷移至 Milvus。</p></li>
</ul>
<h2 id="Conclusion" class="common-anchor-header">總結<button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.3，Milvus 的最新版本，帶來了令人振奮的新功能和性能改進，迎合了日益增長的數據管理需求。將您的資料遷移至 Milvus 2.x 可以釋放這些優點，Milvus 遷移專案讓遷移過程變得簡化且容易。試試看，您一定不會失望。</p>
<p><em><strong>註：</strong>本部落格的資訊是基於截至 2023 年 9 月的 Milvus 和<a href="https://github.com/zilliztech/milvus-migration">Milvus Migration</a>專案狀態。請查閱官方的<a href="https://milvus.io/docs">Milvus 文件</a>，以獲得最新的資訊和說明。</em></p>
