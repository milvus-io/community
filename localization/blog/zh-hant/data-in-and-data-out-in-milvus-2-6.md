---
id: data-in-and-data-out-in-milvus-2-6.md
title: 介紹嵌入功能：Milvus 2.6 如何簡化向量化和語意搜尋
author: Xuqi Yang
date: 2025-12-03T00:00:00.000Z
cover: assets.zilliz.com/data_in_data_out_cover_0783504ea4.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus, vector database, embedding, vector search'
meta_title: >
  Introducing the Embedding Function: How Milvus 2.6 Streamlines Vectorization
  and Semantic Search
desc: '探索 Milvus 2.6 如何透過 Data-in, Data-out 簡化嵌入程序和向量搜尋。自動處理嵌入和重排 - 無需外部預處理。'
origin: 'https://milvus.io/blog/data-in-and-data-out-in-milvus-2-6.md'
---
<p>如果您曾經建立過向量搜尋應用程式，您就已經對工作流程有點了解了。在儲存任何資料之前，必須先使用嵌入模型將資料轉換成向量，然後進行清理和格式化，最後才輸入向量資料庫。每個查詢也要經過相同的程序：嵌入輸入、執行相似性搜尋，然後將結果 ID 對映回原始文件或記錄。這樣做是可行的，但卻會產生分散式的預處理腳本、嵌入管道以及您必須維護的膠水程式碼。</p>
<p><a href="https://milvus.io/">Milvus</a> 是一個高效能的開放原始碼向量資料庫，現在朝向簡化這一切邁進了一大步。<a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md">Milvus 2.6</a>引入了<strong>Data-in, Data-out 功能 (也稱為</strong> <a href="https://milvus.io/docs/embedding-function-overview.md#Embedding-Function-Overview"><strong>嵌入功能</strong></a><strong>)</strong>，這是一種內建的嵌入功能，可直接連接到 OpenAI、AWS Bedrock、Google Vertex AI 和 Hugging Face 等主要模型提供者。Milvus 現在可以為您呼叫這些模型，而無需管理您自己的嵌入基礎架構。您也可以使用原始文字進行插入與查詢 - 很快也會使用其他資料類型 - 而 Milvus 會在寫入與查詢時自動處理向量化。</p>
<p>在這篇文章的其餘部分，我們將進一步瞭解 Data-in, Data-out 在引擎蓋下的運作方式、如何設定提供者和嵌入函式，以及您如何使用它來簡化向量搜尋端對端的工作流程。</p>
<h2 id="What-is-Data-in-Data-out" class="common-anchor-header">什麼是 Data-in、Data-out？<button data-href="#What-is-Data-in-Data-out" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.6 中的 Data-in, Data-out 是建構在新的 Function 模組上 - 一個能讓 Milvus 在內部處理資料轉換和嵌入產生的框架，不需要任何外部的預處理服務。(您可以參考<a href="https://github.com/milvus-io/milvus/issues/35856">GitHub issue #35856</a> 中的設計提案。）有了這個模組，Milvus 可以取得原始輸入資料，直接呼叫嵌入提供者，並自動將產生的向量寫入您的集合中。</p>
<p>從高層次來看，<strong>Function</strong>模組將嵌入產生轉換為原生資料庫功能。Milvus 現在不需要執行獨立的嵌入管道、後台工作人員或 reranker 服務，而是將請求傳送至您設定的提供者、擷取嵌入，並將它們與您的資料一起儲存 - 所有這些都在攝取路徑中。這消除了管理您自己的嵌入式基礎架構的作業開銷。</p>
<p>Data-in, Data-out 為 Milvus 工作流程引入了三項重大改進：</p>
<ul>
<li><p><strong>直接插入原始資料</strong>- 您現在可以直接將未處理的文字、影像或其他資料類型插入 Milvus。不需要事先將它們轉換成向量。</p></li>
<li><p><strong>配置一個嵌入功能</strong>- 一旦您在 Milvus 中配置了嵌入模型，它就會自動管理整個嵌入過程。Milvus 可與一系列模型提供者無縫整合，包括 OpenAI、AWS Bedrock、Google Vertex AI、Cohere 和 Hugging Face。</p></li>
<li><p><strong>使用原始輸入進行查詢</strong>- 您現在可以使用原始文字或其他基於內容的查詢來執行語意搜尋。Milvus 會使用相同的配置模型來即時產生嵌入、執行相似性搜尋，並傳回相關結果。</p></li>
</ul>
<p>簡而言之，Milvus 現在會自動嵌入 - 並選擇性地重整 - 您的資料。矢量化成為內建的資料庫功能，無需外部嵌入服務或客製化預處理邏輯。</p>
<h2 id="How-Data-in-Data-out-Works" class="common-anchor-header">資料輸入、資料輸出如何運作<button data-href="#How-Data-in-Data-out-Works" class="anchor-icon" translate="no">
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
    </button></h2><p>下圖說明了 Data-in、Data-out 如何在 Milvus 中運作。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/diagram_data_in_data_out_4c9e06c884.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>資料輸入、資料輸出的工作流程可分為六個主要步驟：</p>
<ol>
<li><p><strong>輸入資料</strong>- 使用者直接將原始資料，例如文字、圖片或其他內容類型，插入 Milvus，而不需執行任何外部預處理。</p></li>
<li><p><strong>產生嵌入</strong>- 功能模組透過其第三方 API 自動調用設定的嵌入模型，即時將原始輸入轉換為向量嵌入。</p></li>
<li><p><strong>儲存嵌入</strong>資料 - Milvus 會將產生的嵌入資料寫入資料集中指定的向量欄位，以便進行相似性搜尋作業。</p></li>
<li><p><strong>提交查詢</strong>- 使用者向 Milvus 發出原始文字或基於內容的查詢，就像輸入階段一樣。</p></li>
<li><p><strong>語意搜尋</strong>- Milvus 使用相同的配置模型嵌入查詢，在儲存的向量上執行相似性搜尋，並決定最接近的語意匹配。</p></li>
<li><p><strong>回傳結果</strong>- Milvus 會將最相似的前 k 個結果（映射回原始資料）直接回傳到應用程式。</p></li>
</ol>
<h2 id="How-to-Configure-Data-in-Data-out" class="common-anchor-header">如何設定資料輸入、資料輸出<button data-href="#How-to-Configure-Data-in-Data-out" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Prerequisites" class="common-anchor-header">先決條件</h3><ul>
<li><p>安裝最新版本的<strong>Milvus 2.6</strong>。</p></li>
<li><p>從支援的提供者 (例如 OpenAI、AWS Bedrock 或 Cohere) 準備您的嵌入式 API 金鑰。在本範例中，我們將使用<strong>Cohere</strong>作為嵌入提供者。</p></li>
</ul>
<h3 id="Modify-the-milvusyaml-Configuration" class="common-anchor-header">修改<code translate="no">milvus.yaml</code> 設定</h3><p>如果您使用<strong>Docker Compose</strong> 執行 Milvus，您需要修改<code translate="no">milvus.yaml</code> 檔案以啟用 Function 模組。您可以參考官方文件的指引：<a href="https://milvus.io/docs/configure-docker.md?tab=component#Download-a-configuration-file">使用 Docker Compose 設定 Milvus</a>(其他部署方法的說明也可以在這裡找到)。</p>
<p>在設定檔中，找到<code translate="no">credential</code> 和<code translate="no">function</code> 兩個部分。</p>
<p>然後更新欄位<code translate="no">apikey1.apikey</code> 和<code translate="no">providers.cohere</code> 。</p>
<pre><code translate="no">...
credential:
  aksk1:
    access_key_id:  <span class="hljs-comment"># Your access_key_id</span>
    secret_access_key:  <span class="hljs-comment"># Your secret_access_key</span>
  apikey1:
    apikey: <span class="hljs-string">&quot;***********************&quot;</span> <span class="hljs-comment"># Edit this section</span>
  gcp1:
    credential_json:  <span class="hljs-comment"># base64 based gcp credential data</span>
<span class="hljs-comment"># Any configuration related to functions</span>
function:
  textEmbedding:
    providers:
                        ...
      cohere: <span class="hljs-comment"># Edit the section below</span>
        credential:  apikey1 <span class="hljs-comment"># The name in the crendential configuration item</span>
        enable: true <span class="hljs-comment"># Whether to enable cohere model service</span>
        url:  <span class="hljs-string">&quot;https://api.cohere.com/v2/embed&quot;</span> <span class="hljs-comment"># Your cohere embedding url, Default is the official embedding url</span>
      ...
...
<button class="copy-code-btn"></button></code></pre>
<p>完成這些變更後，重新啟動 Milvus 以套用更新的組態。</p>
<h2 id="How-to-Use-the-Data-in-Data-out-Feature" class="common-anchor-header">如何使用資料輸入、資料輸出功能<button data-href="#How-to-Use-the-Data-in-Data-out-Feature" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="1-Define-the-Schema-for-the-Collection" class="common-anchor-header">1.定義資料集的模式</h3><p>要啟用嵌入功能，您的<strong>集合模式</strong>必須包含至少三個欄位：</p>
<ul>
<li><p><strong>主鍵欄位 (</strong><code translate="no">id</code> ) - 獨一無二地識別集合中的每個實體。</p></li>
<li><p><strong>Scalar 欄位 (</strong><code translate="no">document</code> ) - 儲存原始資料。</p></li>
<li><p><strong>向量欄位 (</strong><code translate="no">dense</code> ) - 儲存所產生的向量嵌入。</p></li>
</ul>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient, DataType, Function, FunctionType
<span class="hljs-comment"># Initialize Milvus client</span>
client = MilvusClient(
    uri=<span class="hljs-string">&quot;http://localhost:19530&quot;</span>,
)
<span class="hljs-comment"># Create a new schema for the collection</span>
schema = client.create_schema()
<span class="hljs-comment"># Add primary field &quot;id&quot;</span>
schema.add_field(<span class="hljs-string">&quot;id&quot;</span>, DataType.INT64, is_primary=<span class="hljs-literal">True</span>, auto_id=<span class="hljs-literal">False</span>)
<span class="hljs-comment"># Add scalar field &quot;document&quot; for storing textual data</span>
schema.add_field(<span class="hljs-string">&quot;document&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">9000</span>)
<span class="hljs-comment"># Add vector field &quot;dense&quot; for storing embeddings.</span>
<span class="hljs-comment"># IMPORTANT: Set `dim` to match the exact output dimension of the embedding model.</span>
<span class="hljs-comment"># For instance, OpenAI&#x27;s text-embedding-3-small model outputs 1536-dimensional vectors.</span>
<span class="hljs-comment"># For dense vector, data type can be FLOAT_VECTOR or INT8_VECTOR</span>
schema.add_field(<span class="hljs-string">&quot;dense&quot;</span>, DataType.FLOAT_VECTOR, dim=<span class="hljs-number">1536</span>) <span class="hljs-comment"># Set dim according to the embedding model you use.</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="2-Define-the-Embedding-Function" class="common-anchor-header">2.定義嵌入函數</h3><p>接下來，在模式中定義<strong>嵌入</strong>函數。</p>
<ul>
<li><p><code translate="no">name</code> - 功能的唯一識別碼。</p></li>
<li><p><code translate="no">function_type</code> - 對於文字嵌入，設定為<code translate="no">FunctionType.TEXTEMBEDDING</code> 。Milvus 也支援其他函數類型，例如<code translate="no">FunctionType.BM25</code> 和<code translate="no">FunctionType.RERANK</code> 。詳情請參閱<a href="https://milvus.io/docs/full-text-search.md#Full-Text-Search">全文檢索</a>和<a href="https://milvus.io/docs/decay-ranker-overview.md#Decay-Ranker-Overview">Decay Ranker 總覽</a>。</p></li>
<li><p><code translate="no">input_field_names</code> - 定義原始資料的輸入欄位 (<code translate="no">document</code>)。</p></li>
<li><p><code translate="no">output_field_names</code> - 定義向量嵌入的輸出欄位 (<code translate="no">dense</code>)。</p></li>
<li><p><code translate="no">params</code> - 包含嵌入函數的設定參數。<code translate="no">provider</code> 和<code translate="no">model_name</code> 的值必須與<code translate="no">milvus.yaml</code> 設定檔中的相應項目相符。</p></li>
</ul>
<p><strong>注意：</strong>每個函式必須有唯一的<code translate="no">name</code> 和<code translate="no">output_field_names</code> ，以區別不同的轉換邏輯，防止衝突。</p>
<pre><code translate="no"><span class="hljs-comment"># Define embedding function (example: OpenAI provider)</span>
text_embedding_function = Function(
    name=<span class="hljs-string">&quot;cohere_embedding&quot;</span>,                  <span class="hljs-comment"># Unique identifier for this embedding function</span>
    function_type=FunctionType.TEXTEMBEDDING, <span class="hljs-comment"># Type of embedding function</span>
    input_field_names=[<span class="hljs-string">&quot;document&quot;</span>],           <span class="hljs-comment"># Scalar field to embed</span>
    output_field_names=[<span class="hljs-string">&quot;dense&quot;</span>],             <span class="hljs-comment"># Vector field to store embeddings</span>
    params={                                  <span class="hljs-comment"># Provider-specific configuration (highest priority)</span>
        <span class="hljs-string">&quot;provider&quot;</span>: <span class="hljs-string">&quot;cohere&quot;</span>,                 <span class="hljs-comment"># Embedding model provider</span>
        <span class="hljs-string">&quot;model_name&quot;</span>: <span class="hljs-string">&quot;embed-v4.0&quot;</span>,     <span class="hljs-comment"># Embedding model</span>
        <span class="hljs-comment"># &quot;credential&quot;: &quot;apikey1&quot;,            # Optional: Credential label</span>
        <span class="hljs-comment"># Optional parameters:</span>
        <span class="hljs-comment"># &quot;dim&quot;: &quot;1536&quot;,       # Optionally shorten the vector dimension</span>
        <span class="hljs-comment"># &quot;user&quot;: &quot;user123&quot;    # Optional: identifier for API tracking</span>
    }
)
<span class="hljs-comment"># Add the embedding function to your schema</span>
schema.add_function(text_embedding_function)
<button class="copy-code-btn"></button></code></pre>
<h3 id="3-Configure-the-Index" class="common-anchor-header">3.設定索引</h3><p>定義欄位和函式後，為集合建立索引。為了簡單起見，我們在此以 AUTOINDEX 類型為例。</p>
<pre><code translate="no"><span class="hljs-comment"># Prepare index parameters</span>
index_params = client.prepare_index_params()
<span class="hljs-comment"># Add AUTOINDEX to automatically select optimal indexing method</span>
index_params.add_index(
    field_name=<span class="hljs-string">&quot;dense&quot;</span>,
    index_type=<span class="hljs-string">&quot;AUTOINDEX&quot;</span>,
    metric_type=<span class="hljs-string">&quot;COSINE&quot;</span> 
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="4-Create-the-Collection" class="common-anchor-header">4.建立集合</h3><p>使用已定義的模式和索引來建立新的集合。在本範例中，我們將建立一個名為 Demo 的集合。</p>
<pre><code translate="no"><span class="hljs-comment"># Create collection named &quot;demo&quot;</span>
client.create_collection(
    collection_name=<span class="hljs-string">&#x27;demo&#x27;</span>, 
    schema=schema, 
    index_params=index_params
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="5-Insert-Data" class="common-anchor-header">5.插入資料</h3><p>現在您可以直接插入原始資料到 Milvus - 不需要手動產生嵌入。</p>
<pre><code translate="no"><span class="hljs-comment"># Insert sample documents</span>
client.insert(<span class="hljs-string">&#x27;demo&#x27;</span>, [
    {<span class="hljs-string">&#x27;id&#x27;</span>: <span class="hljs-number">1</span>, <span class="hljs-string">&#x27;document&#x27;</span>: <span class="hljs-string">&#x27;Milvus simplifies semantic search through embeddings.&#x27;</span>},
    {<span class="hljs-string">&#x27;id&#x27;</span>: <span class="hljs-number">2</span>, <span class="hljs-string">&#x27;document&#x27;</span>: <span class="hljs-string">&#x27;Vector embeddings convert text into searchable numeric data.&#x27;</span>},
    {<span class="hljs-string">&#x27;id&#x27;</span>: <span class="hljs-number">3</span>, <span class="hljs-string">&#x27;document&#x27;</span>: <span class="hljs-string">&#x27;Semantic search helps users find relevant information quickly.&#x27;</span>},
])
<button class="copy-code-btn"></button></code></pre>
<h3 id="6-Perform-Vector-Search" class="common-anchor-header">6.執行向量搜尋</h3><p>插入資料後，您可以直接使用原始文字查詢執行搜尋。Milvus 會自動將您的查詢轉換成嵌入式資料，針對儲存的向量執行相似性搜尋，並傳回最匹配的資料。</p>
<pre><code translate="no"><span class="hljs-comment"># Perform semantic search</span>
results = client.search(
    collection_name=<span class="hljs-string">&#x27;demo&#x27;</span>, 
    data=[<span class="hljs-string">&#x27;How does Milvus handle semantic search?&#x27;</span>], <span class="hljs-comment"># Use text query rather than query vector</span>
    anns_field=<span class="hljs-string">&#x27;dense&#x27;</span>,   <span class="hljs-comment"># Use the vector field that stores embeddings</span>
    limit=<span class="hljs-number">1</span>,
    output_fields=[<span class="hljs-string">&#x27;document&#x27;</span>],
)
<span class="hljs-built_in">print</span>(results)
<span class="hljs-comment"># Example output:</span>
<span class="hljs-comment"># data: [&quot;[{&#x27;id&#x27;: 1, &#x27;distance&#x27;: 0.8821347951889038, &#x27;entity&#x27;: {&#x27;document&#x27;: &#x27;Milvus simplifies semantic search through embeddings.&#x27;}}]&quot;]</span>
<button class="copy-code-btn"></button></code></pre>
<p>有關向量搜尋的詳細資訊，請參閱：<a href="https://milvus.io/docs/single-vector-search.md">基本向量搜尋與 </a> <a href="https://milvus.io/docs/get-and-scalar-query.md">查詢 API</a>。</p>
<h2 id="Get-Started-with-Milvus-26" class="common-anchor-header">開始使用 Milvus 2.6<button data-href="#Get-Started-with-Milvus-26" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.6 的資料輸入、資料輸出功能，讓向量搜尋的簡易性更上一層樓。透過在 Milvus 內直接整合嵌入和重排功能，您不再需要管理外部預處理或維護單獨的嵌入服務。</p>
<p>準備好試用了嗎？立即安裝<a href="https://milvus.io/docs">Milvus</a>2.6，親身體驗 Data-in, Data-out 的強大功能。</p>
<p>對任何功能有問題或想要深入瞭解？加入我們的<a href="https://discord.com/invite/8uyFbECzPX"> Discord 頻道</a>或在<a href="https://github.com/milvus-io/milvus"> GitHub</a> 上提出問題。您也可以透過<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus Office Hours</a> 預約 20 分鐘的一對一課程，以獲得深入瞭解、指導和問題解答。</p>
<h2 id="Learn-More-about-Milvus-26-Features" class="common-anchor-header">進一步了解 Milvus 2.6 功能<button data-href="#Learn-More-about-Milvus-26-Features" class="anchor-icon" translate="no">
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
<li><p><a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md">介紹 Milvus 2.6：十億規模的經濟實惠向量搜尋</a></p></li>
<li><p><a href="https://milvus.io/blog/json-shredding-in-milvus-faster-json-filtering-with-flexibility.md">Milvus的JSON粉碎：靈活的JSON過濾速度快88.9倍</a></p></li>
<li><p><a href="https://milvus.io/blog/unlocking-true-entity-level-retrieval-new-array-of-structs-and-max-sim-capabilities-in-milvus.md">解鎖真正的實體層級檢索：Milvus 中新的結構陣列與 MAX_SIM 功能</a></p></li>
<li><p><a href="https://milvus.io/blog/minhash-lsh-in-milvus-the-secret-weapon-for-fighting-duplicates-in-llm-training-data.md">Milvus 中的 MinHash LSH：對抗 LLM 訓練資料中重複資料的秘密武器 </a></p></li>
<li><p><a href="https://milvus.io/blog/bring-vector-compression-to-the-extreme-how-milvus-serves-3%C3%97-more-queries-with-rabitq.md">將向量壓縮發揮到極致：Milvus 如何利用 RaBitQ 提供多 3 倍的查詢服務</a></p></li>
<li><p><a href="https://milvus.io/blog/benchmarks-lie-vector-dbs-deserve-a-real-test.md">基準會說謊 - 向量資料庫應該接受真正的測試 </a></p></li>
<li><p><a href="https://milvus.io/blog/we-replaced-kafka-pulsar-with-a-woodpecker-for-milvus.md">我們為 Milvus 用啄木鳥取代了 Kafka/Pulsar </a></p></li>
<li><p><a href="https://milvus.io/blog/how-to-filter-efficiently-without-killing-recall.md">現實世界中的向量搜尋：如何有效率地過濾而不損害回復率 </a></p></li>
</ul>
