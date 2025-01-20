---
id: how-to-get-started-with-milvus.md
title: 如何開始使用 Milvus
author: Ruben Winastwan
date: 2025-01-17T00:00:00.000Z
cover: >-
  assets.zilliz.com/How_To_Get_Started_With_Milvus_20230517_084248_28560b1efc.png
tag: Engineering
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Vector Management
recommend: false
canonicalUrl: 'https://milvus.io/blog/how-to-get-started-with-milvus.md'
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/How_To_Get_Started_With_Milvus_20230517_084248_28560b1efc.png" alt="How to get started with Milvus" class="doc-image" id="how-to-get-started-with-milvus" />
   </span> <span class="img-wrapper"> <span>如何開始使用 Milvus</span> </span></p>
<p><strong><em>最後更新於 2025 年 1 月</em></strong></p>
<p>隨著大型語言模型<a href="https://zilliz.com/glossary/large-language-models-(llms)">(</a>Large Language Models<a href="https://zilliz.com/glossary/large-language-models-(llms)">, LLMs</a>) 的進步以及資料量的不斷增加，我們需要一個靈活且可擴充的基礎架構來儲存大量的資訊，例如資料庫。然而，<a href="https://zilliz.com/blog/relational-databases-vs-vector-databases">傳統資料庫</a>的設計是用來儲存表格和結構化資料，而對於利用精密 LLM 和資訊檢索演算法的威力來說，通常有用的資訊都<a href="https://zilliz.com/learn/introduction-to-unstructured-data">是非結構化的</a>，例如文字、影像、視訊或音訊。</p>
<p><a href="https://zilliz.com/learn/what-is-vector-database">向量資料庫</a>是專為非結構化資料設計的資料庫系統。我們不僅可以使用向量資料庫儲存大量的非結構化資料，也可以使用<a href="https://zilliz.com/learn/vector-similarity-search">向量</a>資料庫執行<a href="https://zilliz.com/learn/vector-similarity-search">向量搜尋</a>。向量資料庫擁有先進的索引方法，例如反向檔案索引 (IVFFlat) 或階層式導航小世界<a href="https://zilliz.com/learn/hierarchical-navigable-small-worlds-HNSW">(HNSW</a>)，可執行快速有效的向量搜尋與資訊檢索程序。</p>
<p><strong>Milvus</strong>是一個開放原始碼的向量資料庫，我們可以利用向量資料庫所提供的所有有利功能。以下是本篇文章的內容：</p>
<ul>
<li><p><a href="https://milvus.io/blog/how-to-get-started-with-milvus.md#What-is-Milvus">Milvus 概觀</a></p></li>
<li><p><a href="https://milvus.io/blog/how-to-get-started-with-milvus.md#Milvus-Deployment-Options">Milvus 部署選項</a></p></li>
<li><p><a href="https://milvus.io/blog/how-to-get-started-with-milvus.md#Getting-Started-with-Milvus-Lite">開始使用 Milvus Lite</a></p></li>
<li><p><a href="https://milvus.io/blog/how-to-get-started-with-milvus.md#Getting-Started-with-Milvus-Standalone">開始使用 Milvus Standalone</a></p></li>
<li><p><a href="https://milvus.io/blog/how-to-get-started-with-milvus.md#Fully-Managed-Milvus">全面管理的 Milvus </a></p></li>
</ul>
<h2 id="What-is-Milvus" class="common-anchor-header">Milvus 是什麼？<button data-href="#What-is-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://milvus.io/docs/overview.md"><strong>Milvus</strong>是 </a>一個開放原始碼的向量資料庫，讓我們能夠儲存大量非結構化資料，並在這些資料上執行快速有效的向量搜尋。Milvus 對於許多流行的 GenAI 應用程式非常有用，例如推薦系統、個人化聊天機器人、異常偵測、圖像搜尋、自然語言處理和retrieval augmented generation<a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">(RAG</a>)。</p>
<p>使用 Milvus 作為向量資料庫可獲得多項優勢：</p>
<ul>
<li><p>Milvus 提供多種部署選項，您可以依據您的使用情況和想要建立的應用程式大小來選擇。</p></li>
<li><p>Milvus 支援多樣化的索引方法，以滿足各種資料和效能需求，包括 FLAT、IVFFlat、HNSW 和<a href="https://zilliz.com/learn/what-is-scann-scalable-nearest-neighbors-google">SCANN</a> 等記憶體內選項、可提高記憶體效率的量化變體、適用於大型資料集的磁碟上<a href="https://zilliz.com/learn/DiskANN-and-the-Vamana-Algorithm">DANN</a>，以及 GPU 最佳化索引，例如 GPU_CAGRA、GPU_IVF_FLAT 和 GPU_IVF_PQ，以進行加速、提高記憶體效率的搜尋。</p></li>
<li><p>Milvus 也提供混合搜尋功能，在向量搜尋作業中，我們可以結合使用密集嵌入、稀疏嵌入以及元資料篩選，進而獲得更精確的檢索結果。此外，<a href="https://milvus.io/blog/introduce-milvus-2-5-full-text-search-powerful-metadata-filtering-and-more.md">Milvus 2.5</a>現在支援混合<a href="https://milvus.io/blog/get-started-with-hybrid-semantic-full-text-search-with-milvus-2-5.md">全文檢索</a>與向量檢索，讓您的檢索更加精準。</p></li>
<li><p>Milvus 可透過<a href="https://zilliz.com/cloud">Zilliz Cloud</a> 在雲端上完全使用，由於具有邏輯集群、串流與歷史資料分解、分層儲存、自動擴充與多租戶冷熱分離等四項進階功能，您可以優化其作業成本與向量搜尋速度。</p></li>
</ul>
<p>使用 Milvus 作為向量資料庫時，您可以選擇三種不同的部署選項，每種選項都有其優點和好處。我們將在下一節逐一介紹。</p>
<h2 id="Milvus-Deployment-Options" class="common-anchor-header">Milvus 部署選項<button data-href="#Milvus-Deployment-Options" class="anchor-icon" translate="no">
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
    </button></h2><p>我們可以從四個部署選項中選擇開始使用 Milvus：<strong>Milvus Lite、Milvus Standalone、Milvus Distributed 和 Zilliz Cloud (managed Milvus)。</strong>每個部署選項的設計都是為了滿足我們使用案例中的各種情況，例如我們的資料大小、應用程式的目的以及應用程式的規模。</p>
<h3 id="Milvus-Lite" class="common-anchor-header">Milvus Lite</h3><p><a href="https://milvus.io/docs/quickstart.md"><strong>Milvus Lite</strong></a>是 Milvus 的輕量級版本，也是我們最容易上手的方式。在下一節中，我們會看到如何實際執行 Milvus Lite，而要開始使用 Milvus Lite，我們只需要用 pip 安裝 Pymilvus 函式庫。之後，我們就可以執行 Milvus 作為向量資料庫的大部分核心功能。</p>
<p>Milvus Lite 非常適合做為快速原型或學習用途，而且可以在 Jupyter 記事本中執行，不需要任何複雜的設定。在向量儲存方面，Milvus Lite 適合儲存大約一百萬個向量嵌入。由於 Milvus Lite 具備輕量的特性與儲存容量，因此是與邊緣裝置合作的最佳部署選擇，例如私人文件搜尋引擎、裝置上的物件偵測等。</p>
<h3 id="Milvus-Standalone" class="common-anchor-header">Milvus Standalone</h3><p>Milvus Standalone 是包裝在 Docker 映像檔中的單機伺服器部署。因此，我們只需要在 Docker 中安裝 Milvus，然後啟動 Docker 容器即可開始使用。我們也會在下一節看到 Milvus Standalone 的詳細實作。</p>
<p>Milvus Standalone 是建立和生產中小規模應用程式的理想選擇，因為它能夠儲存高達 10M 的向量嵌入。此外，Milvus Standalone 透過主備份模式提供高可用性，使其在生產就緒的應用程式中使用時具有高度可靠性。</p>
<p>我們也可以使用 Milvus Standalone，例如，在使用 Milvus Lite 執行快速原型和學習 Milvus 功能之後，因為 Milvus Standalone 和 Milvus Lite 共享相同的客戶端 API。</p>
<h3 id="Milvus-Distributed" class="common-anchor-header">分散式 Milvus</h3><p>Milvus Distributed 是一個利用雲端架構的部署選項，資料擷取和資料擷取分開處理，讓應用程式具有高度擴充性和效率。</p>
<p>若要執行 Milvus Distributed，我們通常需要使用 Kubernetes 叢集，讓容器可以在多台機器和環境上執行。Kubernetes 集群的應用確保了 Milvus Distributed 的可擴展性和靈活性，可根據需求和工作量自訂分配的資源。這也代表如果其中一部分發生故障，其他部分可以接手處理，確保整個系統不中斷。</p>
<p>Milvus Distributed 可處理高達數百億個向量嵌入，專為資料過大而無法儲存在單一伺服器機器的使用個案而設計。因此，此部署選項非常適合服務大量使用者的企業用戶端。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_Vector_embedding_storage_capability_of_different_Milvus_deployment_options_e3959ccfcd.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>圖：不同 Milvus 部署選項的向量嵌入儲存能力。</em></p>
<p>在這篇文章中，我們將教您如何開始使用 Milvus Lite 和 Milvus Standalone，因為這兩種方法都可以快速上手，不需要複雜的設定。然而，Milvus Distributed 的設定則比較複雜。一旦我們設定好 Milvus Distributed，建立集合、擷取資料、執行向量搜尋等的程式碼和邏輯流程，都與 Milvus Lite 和 Milvus Standalone 相似，因為它們共用相同的用戶端 API。</p>
<p>除了上述三種部署方式外，您也可以在<a href="https://zilliz.com/cloud">Zilliz Cloud</a>上嘗試管理式 Milvus，以獲得無憂的使用體驗。我們也會在本文稍後談到 Zilliz Cloud。</p>
<h2 id="Getting-Started-with-Milvus-Lite" class="common-anchor-header">開始使用 Milvus Lite<button data-href="#Getting-Started-with-Milvus-Lite" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus Lite 可以直接使用 Python 來實作，方法是使用 pip 匯入一個叫做 Pymilvus 的函式庫。在安裝 Pymilvus 之前，請確保您的環境符合下列需求：</p>
<ul>
<li><p>Ubuntu &gt;= 20.04 (x86_64 和 arm64)</p></li>
<li><p>MacOS &gt;= 11.0 (Apple Silicon M1/M2 和 x86_64)</p></li>
<li><p>Python 3.7 或更新版本</p></li>
</ul>
<p>滿足這些需求後，您可以使用下列指令安裝 Milvus Lite 和必要的相依性來進行示範：</p>
<pre><code translate="no">!pip install -U pymilvus
!pip install <span class="hljs-string">&quot;pymilvus[model]&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><p><code translate="no">!pip install -U pymilvus</code>:此指令會安裝或升級<code translate="no">pymilvus</code> 函式庫，也就是 Milvus 的 Python SDK。Milvus Lite 和 PyMilvus 是捆綁在一起的，所以只需要這一行代碼就可以安裝 Milvus Lite。</p></li>
<li><p><code translate="no">!pip install &quot;pymilvus[model]&quot;</code>:此指令可增加 Milvus 預先整合的進階功能和額外工具，包括像 Hugging Face Transformers、Jina AI embedding models 和 reranking models 等機器學習模型。</p></li>
</ul>
<p>以下是我們使用 Milvus Lite 的步驟：</p>
<ol>
<li><p>使用嵌入模型將文字資料轉換成它們的嵌入表示。</p></li>
<li><p>在 Milvus 資料庫中建立一個模式，以儲存文字資料及其嵌入表示法。</p></li>
<li><p>在我們的模式中儲存和索引我們的資料。</p></li>
<li><p>在儲存的資料上執行簡單的向量搜尋。</p></li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_Workflow_of_vector_search_operation_3e38ccc1f4.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>圖：向量搜尋作業的工作流程。</em></p>
<p>為了將文字資料轉換成向量嵌入，我們會使用 SentenceTransformers 的<a href="https://zilliz.com/ai-models">嵌入模型</a>「all-MiniLM-L6-v2」。這個嵌入模型會將我們的文字轉換成 384 維向量嵌入。讓我們載入模型，轉換我們的文字資料，然後將所有內容打包在一起。</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> model

docs = [
    <span class="hljs-string">&quot;Artificial intelligence was founded as an academic discipline in 1956.&quot;</span>,
    <span class="hljs-string">&quot;Alan Turing was the first person to conduct substantial research in AI.&quot;</span>,
    <span class="hljs-string">&quot;Born in Maida Vale, London, Turing was raised in southern England.&quot;</span>,
]

sentence_transformer_ef = model.dense.SentenceTransformerEmbeddingFunction(
    model_name=<span class="hljs-string">&#x27;all-MiniLM-L6-v2&#x27;</span>, 
    device=<span class="hljs-string">&#x27;cpu&#x27;</span> 
)

vectors  = sentence_transformer_ef.encode_documents(docs)
data = [ {<span class="hljs-string">&quot;id&quot;</span>: i, <span class="hljs-string">&quot;vector&quot;</span>: vectors[i], <span class="hljs-string">&quot;text&quot;</span>: docs[i]} <span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-built_in">len</span>(vectors)) ]
<button class="copy-code-btn"></button></code></pre>
<p>接下來，讓我們建立一個模式，將上面所有的資料儲存在 Milvus 中。如上所示，我們的資料包含三個欄位：ID、向量和文字。因此，我們將以這三個欄位建立一個模式。</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient, DataType, db, connections

schema = MilvusClient.create_schema(
    auto_id=<span class="hljs-literal">False</span>,
    enable_dynamic_field=<span class="hljs-literal">True</span>,
)

<span class="hljs-comment"># Add fields to schema</span>
schema.add_field(field_name=<span class="hljs-string">&quot;id&quot;</span>, datatype=DataType.INT64, is_primary=<span class="hljs-literal">True</span>)
schema.add_field(field_name=<span class="hljs-string">&quot;vector&quot;</span>, datatype=DataType.FLOAT_VECTOR, dim=<span class="hljs-number">384</span>)
schema.add_field(field_name=<span class="hljs-string">&quot;text&quot;</span>, datatype=DataType.VARCHAR, max_length=<span class="hljs-number">512</span>)
<button class="copy-code-btn"></button></code></pre>
<p>使用 Milvus Lite，我們只需要幾行程式碼，就可以輕鬆地根據上面定義的模式，在特定的資料庫上建立一個集合，以及將資料插入到集合中並建立索引。</p>
<pre><code translate="no">client = MilvusClient(<span class="hljs-string">&quot;./milvus_demo.db&quot;</span>)

index_params = client.prepare_index_params()

<span class="hljs-comment">#  Add indexes</span>
index_params.add_index(
    field_name=<span class="hljs-string">&quot;vector&quot;</span>, 
    index_type=<span class="hljs-string">&quot;AUTOINDEX&quot;</span>,
    metric_type=<span class="hljs-string">&quot;COSINE&quot;</span>
)

<span class="hljs-comment"># Create collection</span>
client.create_collection(
    collection_name=<span class="hljs-string">&quot;demo_collection&quot;</span>,
    schema=schema,
    index_params=index_params
)

<span class="hljs-comment"># Insert data into collection</span>
res = client.insert(
    collection_name=<span class="hljs-string">&quot;demo_collection&quot;</span>,
    data=data
)
<button class="copy-code-btn"></button></code></pre>
<p>在上面的程式碼中，我們在一個名為「milvus_demo」的 Milvus 資料庫中建立一個名為「demo_collection」的集合。接下來，我們將所有資料索引到剛剛建立的「demo_collection」中。</p>
<p>現在我們已將資料儲存在資料庫中，我們可以針對任何指定的查詢對這些資料執行向量搜尋。比方說，我們有一個查詢：「<em>誰是 Alan Turing？</em>我們可以透過執行下列步驟來取得查詢的最適當答案：</p>
<ol>
<li><p>使用將資料庫中的資料轉換成嵌入式的相同嵌入式模型，將我們的查詢轉換成向量嵌入式。</p></li>
<li><p>使用余弦相似度或歐氏距離等指標，計算我們的查詢嵌入與資料庫中每個項目的嵌入之間的相似度。</p></li>
<li><p>擷取最相似的項目，作為我們查詢的適當答案。</p></li>
</ol>
<p>以下是使用 Milvus 實作的上述步驟：</p>
<pre><code translate="no">query = [<span class="hljs-string">&quot;Who is Alan Turing&quot;</span>]
query_embedding = sentence_transformer_ef.encode_queries(query)

<span class="hljs-comment"># Load collection</span>
client.load_collection(
    collection_name=<span class="hljs-string">&quot;demo_collection&quot;</span>
)

<span class="hljs-comment"># Vector search</span>
res = client.search(
    collection_name=<span class="hljs-string">&quot;demo_collection&quot;</span>,
    data=query_embedding,
    limit=<span class="hljs-number">1</span>,
    output_fields=[<span class="hljs-string">&quot;text&quot;</span>],
)
<span class="hljs-built_in">print</span>(res)
<span class="hljs-string">&quot;&quot;&quot;
Output:
data: [&quot;[{&#x27;id&#x27;: 1, &#x27;distance&#x27;: 0.7199002504348755, &#x27;entity&#x27;: {&#x27;text&#x27;: &#x27;Alan Turing was the first person to conduct substantial research in AI.&#x27;}}]&quot;] 
&quot;&quot;&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>就是這樣！您也可以在<a href="https://milvus.io/docs/">Milvus 文件</a>中了解更多關於<a href="https://milvus.io/docs/">Milvus</a> 提供的其他功能，例如管理資料庫、插入和刪除集合、選擇合適的索引方法，以及使用元資料過濾和混合搜尋進行更先進的向量搜尋。</p>
<h2 id="Getting-Started-with-Milvus-Standalone" class="common-anchor-header">開始使用 Milvus Standalone<button data-href="#Getting-Started-with-Milvus-Standalone" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus Standalone 是一種部署選項，其中所有東西都打包在 Docker 容器中。因此，我們需要在 Docker 中安裝 Milvus，然後啟動 Docker 容器來開始使用 Milvus Standalone。</p>
<p>在安裝 Milvus Standalone 之前，請確定您的硬體和軟體都符合<a href="https://milvus.io/docs/prerequisite-docker.md">本頁面</a>所述的需求。此外，請確認已經安裝 Docker。若要安裝 Docker，請參閱<a href="https://docs.docker.com/get-started/get-docker/">此頁面</a>。</p>
<p>一旦我們的系統符合要求，並且安裝了 Docker，我們就可以使用下列指令在 Docker 中安裝 Milvus：</p>
<pre><code translate="no"><span class="hljs-comment"># Download the installation script</span>
$ curl -sfL &lt;https://raw.githubusercontent.com/milvus-io/milvus/master/scripts/standalone_embed.sh&gt; -o standalone_embed.sh

<span class="hljs-comment"># Start the Docker container</span>
$ bash standalone_embed.sh start
<button class="copy-code-btn"></button></code></pre>
<p>在上面的程式碼中，我們也啟動了 Docker 容器，一旦它被啟動，您會得到類似下面的輸出：</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_Message_after_successful_starting_of_the_Docker_container_5c60fa15dd.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>圖：成功啟動 Docker 容器後的訊息。</em></p>
<p>執行上面的安裝腳本「standalone_embed.sh」之後，一個名為「milvus」的 Docker 容器就在 19530 連接埠啟動了。因此，我們只要在建立連線時指向這個連接埠，就可以建立新的資料庫，以及存取所有與 Milvus 資料庫相關的東西。</p>
<p>比方說，我們要建立一個名為 "milvus_demo" 的資料庫，類似於上面在 Milvus Lite 所做的。我們可以如下進行：</p>
<pre><code translate="no">conn = connections.<span class="hljs-title function_">connect</span>(host=<span class="hljs-string">&quot;127.0.0.1&quot;</span>, port=<span class="hljs-number">19530</span>)
database = db.<span class="hljs-title function_">create_database</span>(<span class="hljs-string">&quot;milvus_demo&quot;</span>)

client = <span class="hljs-title class_">MilvusClient</span>(
    uri=<span class="hljs-string">&quot;&lt;http://localhost:19530&gt;&quot;</span>,
    token=<span class="hljs-string">&quot;root:Milvus&quot;</span>,
    db_name=<span class="hljs-string">&quot;milvus_demo&quot;</span>
)
<button class="copy-code-btn"></button></code></pre>
<p>接下來，您可以通過訪問 Milvus<a href="https://milvus.io/docs/milvus-webui.md">Web UI</a> 來驗證新創建的名為 "milvus_demo "的資料庫是否真正存在於您的 Milvus 實例中。顧名思義，Milvus Web UI 是 Milvus 提供的圖形化用戶介面，用來觀察組件的統計和度量，檢查資料庫、集合和配置的列表和細節。您可以在啟動上述 Docker 容器後存取 Milvus Web UI，網址是 http://127.0.0.1:9091/webui/。</p>
<p>如果您存取上述連結，您會看到像這樣的登陸頁面：</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Landing_page_UI_187a40e935.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>在「Collections」標籤下，您會看到我們的「milvus_demo」資料庫已成功建立。如您所見，您也可以使用此 Web UI 檢查其他事項，例如集合清單、組態、執行過的查詢等。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Web_Ui_2_666eae57b1.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>現在，我們可以完全按照上面 Milvus Lite 章節中的方法來執行一切。讓我們在 "milvus_demo 「資料庫內建立一個名為 」demo_collection "的資料集，這個資料集由三個欄位組成，與我們之前在 Milvus Lite 部分所建立的一樣。然後，我們要將我們的資料插入這個集合。</p>
<pre><code translate="no">index_params = client.prepare_index_params()

<span class="hljs-comment">#  Add indexes</span>
index_params.add_index(
    field_name=<span class="hljs-string">&quot;vector&quot;</span>, 
    index_type=<span class="hljs-string">&quot;AUTOINDEX&quot;</span>,
    metric_type=<span class="hljs-string">&quot;COSINE&quot;</span>
)

<span class="hljs-comment"># Create collection</span>
client.create_collection(
    collection_name=<span class="hljs-string">&quot;demo_collection&quot;</span>,
    schema=schema,
    index_params=index_params
)

<span class="hljs-comment"># Insert data into collection</span>
res = client.insert(
    collection_name=<span class="hljs-string">&quot;demo_collection&quot;</span>,
    data=data
)
<button class="copy-code-btn"></button></code></pre>
<p>執行向量搜尋作業的程式碼也和 Milvus Lite 相同，您可以在下面的程式碼中看到：</p>
<pre><code translate="no">query = [<span class="hljs-string">&quot;Who is Alan Turing&quot;</span>]
query_embedding = sentence_transformer_ef.encode_queries(query)

<span class="hljs-comment"># Load collection</span>
client.load_collection(
    collection_name=<span class="hljs-string">&quot;demo_collection&quot;</span>
)

<span class="hljs-comment"># Vector search</span>
res = client.search(
    collection_name=<span class="hljs-string">&quot;demo_collection&quot;</span>,
    data=query_embedding,
    limit=<span class="hljs-number">1</span>,
    output_fields=[<span class="hljs-string">&quot;text&quot;</span>],
)
<span class="hljs-built_in">print</span>(res)
<span class="hljs-string">&quot;&quot;&quot;
Output:
data: [&quot;[{&#x27;id&#x27;: 1, &#x27;distance&#x27;: 0.7199004292488098, &#x27;entity&#x27;: {&#x27;text&#x27;: &#x27;Alan Turing was the first person to conduct substantial research in AI.&#x27;}}]&quot;] 
&quot;&quot;&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>除了使用 Docker，您也可以搭配<a href="https://milvus.io/docs/install_standalone-docker-compose.md">Docker Compose</a>(適用於 Linux) 和<a href="https://milvus.io/docs/install_standalone-windows.md">Docker Desktop</a>(適用於 Windows) 來使用 Milvus Standalone。</p>
<p>當我們不再使用 Milvus 實例時，我們可以使用下列指令停止 Milvus Standalone：</p>
<pre><code translate="no">$ bash standalone_embed.sh stop
<button class="copy-code-btn"></button></code></pre>
<h2 id="Fully-Managed-Milvus" class="common-anchor-header">完全管理 Milvus<button data-href="#Fully-Managed-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>另一個開始使用 Milvus 的方法是透過<a href="https://zilliz.com/cloud">Zilliz Cloud</a> 的原生雲端基礎架構，您可以獲得無後顧之憂且速度快 10 倍的體驗。</p>
<p>Zilliz Cloud 提供具有專用環境和資源的專用集群，以支援您的 AI 應用程式。由於它是建構在 Milvus 上的雲端資料庫，我們不需要設定和管理本機基礎架構。Zilliz Cloud 也提供更先進的功能，例如向量儲存與計算之間的分離、資料備份到 S3 等常用物件儲存系統，以及資料快取以加速向量搜尋與檢索作業。</p>
<p>然而，在考慮雲端服務時，有一點需要考慮的是運作成本。在大多數情況下，即使集群閒置，沒有資料擷取或向量搜尋活動，我們仍需要付費。如果您想要進一步優化應用程式的作業成本與效能，Zilliz Cloud Serverless 將會是一個絕佳的選擇。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_Key_benefits_of_using_Zilliz_Cloud_Serverless_20f68e0fff.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>圖：使用 Zilliz Cloud Serverless 的主要優點。</em></p>
<p>Zilliz Cloud Serverless 可在 AWS、Azure 和 GCP 等主要雲供應商上使用。它提供隨用隨付定價等功能，意即您只需在使用集群時付費。</p>
<p>Zilliz Cloud Serverless 還實現了先進的技術，例如邏輯集群、自動擴充、分層儲存、串流與歷史資料的分解，以及冷熱資料分離。與記憶體內的 Milvus 相比，這些功能可讓 Zilliz Cloud Serverless 節省高達 50 倍的成本，並使向量搜尋作業的速度提升約 10 倍。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_Illustration_of_tiered_storage_and_hot_cold_data_separation_c634dfd211.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>圖：分層儲存與冷熱資料分離的說明。</em></p>
<p>如果您想開始使用 Zilliz Cloud Serverless，請查看<a href="https://zilliz.com/serverless">此頁面以</a>瞭解更多資訊。</p>
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
    </button></h2><p>Milvus 是一款多功能且功能強大的向量資料庫，專為因應現代人工智慧應用程式中管理非結構化資料與執行快速、有效率向量搜尋作業的挑戰而設計。Milvus 提供多種部署選項，例如適用於快速原型設計的 Milvus Lite、適用於中小型應用程式的 Milvus Standalone，以及適用於企業級擴充能力的 Milvus Distributed，可靈活配合任何專案的規模與複雜性。</p>
<p>此外，Zilliz Cloud Serverless 將 Milvus 的功能延伸至雲端，並提供符合成本效益的隨用隨付模式，讓您不再需要本機基礎架構。Zilliz Cloud Serverless 具備分層儲存與自動擴充等先進功能，可確保更快速的向量搜尋作業，同時優化成本。</p>
