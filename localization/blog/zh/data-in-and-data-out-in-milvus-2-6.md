---
id: data-in-and-data-out-in-milvus-2-6.md
title: Embeddings 功能介绍：Milvus 2.6 如何简化向量化和语义搜索
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
desc: 了解 Milvus 2.6 如何通过数据输入、数据输出简化嵌入过程和向量搜索。自动处理嵌入和 Rerankers - 无需外部预处理。
origin: 'https://milvus.io/blog/data-in-and-data-out-in-milvus-2-6.md'
---
<p>如果你曾经创建过一个向量搜索应用程序，那么你对工作流程就已经略知一二了。在存储任何数据之前，首先必须使用 Embeddings 模型将其转换为向量，然后进行清理和格式化，最后将其输入向量数据库。每个查询也要经过同样的过程：嵌入输入、运行相似性搜索，然后将得到的 ID 映射回原始文档或记录。这样做是可行的，但却会产生一个由预处理脚本、Embeddings 管道和胶水代码组成的分布式纠结系统，您必须对其进行维护。</p>
<p><a href="https://milvus.io/">Milvus</a> 是一个高性能开源向量数据库，现在它朝着简化所有这些工作迈出了重要一步。<a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md">Milvus 2.6</a>引入了<strong>数据输入、数据输出功能（也称为</strong> <a href="https://milvus.io/docs/embedding-function-overview.md#Embedding-Function-Overview"><strong>嵌入功能</strong></a><strong>）</strong>，这是一种内置嵌入功能，可直接连接 OpenAI、AWS Bedrock、Google Vertex AI 和 Hugging Face 等主要模型提供商。Milvus 现在可以为你调用这些模型，而无需管理自己的嵌入式基础架构。您还可以使用原始文本进行插入和查询--很快还可以使用其他数据类型--而 Milvus 会在写入和查询时自动处理向量。</p>
<p>在本篇文章的其余部分，我们将详细介绍 Data-in、Data-out 在引擎盖下的工作原理、如何配置提供程序和 Embeddings 函数，以及如何使用它来简化端到端的向量搜索工作流。</p>
<h2 id="What-is-Data-in-Data-out" class="common-anchor-header">什么是数据输入、数据输出？<button data-href="#What-is-Data-in-Data-out" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.6 中的 "数据输入，数据输出 "建立在新的功能模块之上--该框架使 Milvus 能够在内部处理数据转换和嵌入生成，而无需任何外部预处理服务。(您可以关注<a href="https://github.com/milvus-io/milvus/issues/35856">GitHub issue #35856</a> 中的设计建议）有了这个模块，Milvus 可以获取原始输入数据，直接调用嵌入提供者，并自动将生成的向量写入您的 Collections。</p>
<p>在高层次上，<strong>功能模块</strong>将嵌入生成转化为一种本地数据库功能。Milvus 现在不再运行单独的嵌入管道、后台工作者或 Rerankers 服务，而是向配置的提供商发送请求，检索嵌入，并将它们与数据一起存储--所有这些都在摄取路径内。这消除了管理自己的 Embeddings 基础设施的操作开销。</p>
<p>数据输入、数据输出对 Milvus 工作流程进行了三大改进：</p>
<ul>
<li><p><strong>直接插入原始数据</strong>--您现在可以将未经处理的文本、图像或其他数据类型直接插入 Milvus。无需事先将其转换为向量。</p></li>
<li><p><strong>配置一个嵌入功能</strong>--一旦你在 Milvus 中配置了嵌入模型，它就会自动管理整个嵌入过程。Milvus 与一系列模型提供商无缝集成，包括 OpenAI、AWS Bedrock、Google Vertex AI、Cohere 和 Hugging Face。</p></li>
<li><p><strong>使用原始输入进行查询</strong>--您现在可以使用原始文本或其他基于内容的查询执行语义搜索。Milvus 使用相同的配置模型动态生成嵌入，执行相似性搜索，并返回相关结果。</p></li>
</ul>
<p>简而言之，Milvus 现在可以自动嵌入--并可选择重新ankers--您的数据。向量化成为数据库的内置功能，无需外部嵌入服务或自定义预处理逻辑。</p>
<h2 id="How-Data-in-Data-out-Works" class="common-anchor-header">数据输入和输出的工作原理<button data-href="#How-Data-in-Data-out-Works" class="anchor-icon" translate="no">
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
    </button></h2><p>下图说明了数据输入、数据输出在 Milvus 内部的操作符。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/diagram_data_in_data_out_4c9e06c884.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>数据输入、数据输出工作流程可分为六个主要步骤：</p>
<ol>
<li><p><strong>输入数据</strong>--用户将原始数据（如文本、图像或其他内容类型）直接插入 Milvus，无需进行任何外部预处理。</p></li>
<li><p><strong>生成嵌入</strong>模型--功能模块通过其第三方应用程序接口自动调用配置的嵌入模型，实时将原始输入转换为向量嵌入。</p></li>
<li><p><strong>存储嵌入</strong>模型--Milvus 将生成的嵌入模型写入 Collections 中指定的向量字段，以便进行相似性搜索操作。</p></li>
<li><p><strong>提交查询</strong>--与输入阶段一样，用户向 Milvus 发出原始文本或基于内容的查询。</p></li>
<li><p><strong>语义搜索</strong>--Milvus使用相同的配置模型嵌入查询，在存储的向量上运行相似性搜索，并确定最接近的语义匹配。</p></li>
<li><p><strong>返回结果</strong>--Milvus 将最相似的前 k 个结果（映射回其原始数据）直接返回给应用程序。</p></li>
</ol>
<h2 id="How-to-Configure-Data-in-Data-out" class="common-anchor-header">如何配置数据输入、数据输出<button data-href="#How-to-Configure-Data-in-Data-out" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Prerequisites" class="common-anchor-header">先决条件</h3><ul>
<li><p>安装最新版本的<strong>Milvus 2.6</strong>。</p></li>
<li><p>准备好支持提供商（如 OpenAI、AWS Bedrock 或 Cohere）提供的嵌入式 API 密钥。在本例中，我们将使用<strong>Cohere</strong>作为嵌入提供商。</p></li>
</ul>
<h3 id="Modify-the-milvusyaml-Configuration" class="common-anchor-header">修改<code translate="no">milvus.yaml</code> 配置</h3><p>如果使用<strong>Docker Compose</strong> 运行 Milvus，则需要修改<code translate="no">milvus.yaml</code> 文件以启用 Function 模块。您可以参考官方文档以获得指导：<a href="https://milvus.io/docs/configure-docker.md?tab=component#Download-a-configuration-file">使用 Docker Compose 配置 Milvus</a>（也可在此处找到其他部署方法的说明）。</p>
<p>在配置文件中，找到<code translate="no">credential</code> 和<code translate="no">function</code> 部分。</p>
<p>然后，更新<code translate="no">apikey1.apikey</code> 和<code translate="no">providers.cohere</code> 字段。</p>
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
<p>完成这些更改后，重启 Milvus 以应用更新的配置。</p>
<h2 id="How-to-Use-the-Data-in-Data-out-Feature" class="common-anchor-header">如何使用数据输入、数据输出功能<button data-href="#How-to-Use-the-Data-in-Data-out-Feature" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="1-Define-the-Schema-for-the-Collection" class="common-anchor-header">1.定义 Collections 的 Schema</h3><p>要启用 Embeddings 功能，您的<strong>Collections Schema</strong>必须至少包含三个字段：</p>
<ul>
<li><p><strong>主键字段 (</strong><code translate="no">id</code> ) - 唯一标识 Collections 中的每个实体。</p></li>
<li><p><strong>标量字段 (</strong><code translate="no">document</code> ) - 存储原始数据。</p></li>
<li><p><strong>向量字段 (</strong><code translate="no">dense</code> ) - 存储生成的向量嵌入。</p></li>
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
<h3 id="2-Define-the-Embedding-Function" class="common-anchor-header">2.定义嵌入函数</h3><p>接下来，在 Schema 中定义<strong>嵌入函数</strong>。</p>
<ul>
<li><p><code translate="no">name</code> - 函数的唯一标识符。</p></li>
<li><p><code translate="no">function_type</code> - 文本嵌入时设置为<code translate="no">FunctionType.TEXTEMBEDDING</code> 。Milvus 还支持其他函数类型，如<code translate="no">FunctionType.BM25</code> 和<code translate="no">FunctionType.RERANK</code> 。详情请参阅<a href="https://milvus.io/docs/full-text-search.md#Full-Text-Search">全文搜索</a>和<a href="https://milvus.io/docs/decay-ranker-overview.md#Decay-Ranker-Overview">衰减排名器概述</a>。</p></li>
<li><p><code translate="no">input_field_names</code> - 定义原始数据的输入字段 (<code translate="no">document</code>)。</p></li>
<li><p><code translate="no">output_field_names</code> - 定义存储向量嵌入的输出字段 (<code translate="no">dense</code>)。</p></li>
<li><p><code translate="no">params</code> - 包含嵌入函数的配置参数。<code translate="no">provider</code> 和<code translate="no">model_name</code> 的值必须与<code translate="no">milvus.yaml</code> 配置文件中的相应条目一致。</p></li>
</ul>
<p><strong>注意：</strong>每个函数都必须有唯一的<code translate="no">name</code> 和<code translate="no">output_field_names</code> ，以区分不同的转换逻辑并防止冲突。</p>
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
<h3 id="3-Configure-the-Index" class="common-anchor-header">3.配置索引</h3><p>定义字段和函数后，为 Collections 创建索引。为简单起见，我们在此使用 AUTOINDEX 类型作为示例。</p>
<pre><code translate="no"><span class="hljs-comment"># Prepare index parameters</span>
index_params = client.prepare_index_params()
<span class="hljs-comment"># Add AUTOINDEX to automatically select optimal indexing method</span>
index_params.add_index(
    field_name=<span class="hljs-string">&quot;dense&quot;</span>,
    index_type=<span class="hljs-string">&quot;AUTOINDEX&quot;</span>,
    metric_type=<span class="hljs-string">&quot;COSINE&quot;</span> 
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="4-Create-the-Collection" class="common-anchor-header">4.创建 Collections</h3><p>使用定义的 Schema 和索引创建新的 Collections。在本例中，我们将创建一个名为 Demo 的 Collection。</p>
<pre><code translate="no"><span class="hljs-comment"># Create collection named &quot;demo&quot;</span>
client.create_collection(
    collection_name=<span class="hljs-string">&#x27;demo&#x27;</span>, 
    schema=schema, 
    index_params=index_params
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="5-Insert-Data" class="common-anchor-header">5.插入数据</h3><p>现在，你可以直接在 Milvus 中插入原始数据--无需手动生成 Embeddings。</p>
<pre><code translate="no"><span class="hljs-comment"># Insert sample documents</span>
client.insert(<span class="hljs-string">&#x27;demo&#x27;</span>, [
    {<span class="hljs-string">&#x27;id&#x27;</span>: <span class="hljs-number">1</span>, <span class="hljs-string">&#x27;document&#x27;</span>: <span class="hljs-string">&#x27;Milvus simplifies semantic search through embeddings.&#x27;</span>},
    {<span class="hljs-string">&#x27;id&#x27;</span>: <span class="hljs-number">2</span>, <span class="hljs-string">&#x27;document&#x27;</span>: <span class="hljs-string">&#x27;Vector embeddings convert text into searchable numeric data.&#x27;</span>},
    {<span class="hljs-string">&#x27;id&#x27;</span>: <span class="hljs-number">3</span>, <span class="hljs-string">&#x27;document&#x27;</span>: <span class="hljs-string">&#x27;Semantic search helps users find relevant information quickly.&#x27;</span>},
])
<button class="copy-code-btn"></button></code></pre>
<h3 id="6-Perform-Vector-Search" class="common-anchor-header">6.执行向量搜索</h3><p>插入数据后，您可以直接使用原始文本查询执行搜索。Milvus 会自动将你的查询转换为嵌入，根据存储的向量执行相似性搜索，并返回最匹配的结果。</p>
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
<p>有关向量搜索的更多详情，请参阅：<a href="https://milvus.io/docs/single-vector-search.md">基本向量搜索 </a>和<a href="https://milvus.io/docs/get-and-scalar-query.md">查询 API</a>。</p>
<h2 id="Get-Started-with-Milvus-26" class="common-anchor-header">开始使用 Milvus 2.6<button data-href="#Get-Started-with-Milvus-26" class="anchor-icon" translate="no">
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
    </button></h2><p>通过数据输入、数据输出，Milvus 2.6 将向量搜索的简易性提升到了一个新的水平。通过在 Milvus 中直接集成 Embeddings 和 Rerankers 功能，您不再需要管理外部预处理或维护单独的嵌入服务。</p>
<p>准备好试用了吗？立即安装<a href="https://milvus.io/docs">Milvus</a>2.6，亲身体验数据输入、数据输出的强大功能。</p>
<p>有问题或想深入了解任何功能？加入我们的<a href="https://discord.com/invite/8uyFbECzPX"> Discord 频道</a>或在<a href="https://github.com/milvus-io/milvus"> GitHub</a> 上提交问题。您还可以通过<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus Office Hours</a> 预订 20 分钟的一对一课程，以获得见解、指导和问题解答。</p>
<h2 id="Learn-More-about-Milvus-26-Features" class="common-anchor-header">了解有关 Milvus 2.6 功能的更多信息<button data-href="#Learn-More-about-Milvus-26-Features" class="anchor-icon" translate="no">
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
<li><p><a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md">介绍 Milvus 2.6：十亿规模的经济型向量搜索</a></p></li>
<li><p><a href="https://milvus.io/blog/json-shredding-in-milvus-faster-json-filtering-with-flexibility.md">Milvus中的JSON粉碎：灵活的JSON过滤速度提高88.9倍</a></p></li>
<li><p><a href="https://milvus.io/blog/unlocking-true-entity-level-retrieval-new-array-of-structs-and-max-sim-capabilities-in-milvus.md">解锁真正的实体级检索：Milvus 中新的结构数组和 MAX_SIM 功能</a></p></li>
<li><p><a href="https://milvus.io/blog/minhash-lsh-in-milvus-the-secret-weapon-for-fighting-duplicates-in-llm-training-data.md">Milvus 中的 MinHash LSH：打击 LLM 训练数据中重复数据的秘密武器 </a></p></li>
<li><p><a href="https://milvus.io/blog/bring-vector-compression-to-the-extreme-how-milvus-serves-3%C3%97-more-queries-with-rabitq.md">将向量压缩发挥到极致：Milvus如何利用RaBitQ将查询次数提高3倍</a></p></li>
<li><p><a href="https://milvus.io/blog/benchmarks-lie-vector-dbs-deserve-a-real-test.md">基准会说谎--向量数据库需要真正的测试 </a></p></li>
<li><p><a href="https://milvus.io/blog/we-replaced-kafka-pulsar-with-a-woodpecker-for-milvus.md">我们为 Milvus 用啄木鸟取代了 Kafka/Pulsar </a></p></li>
<li><p><a href="https://milvus.io/blog/how-to-filter-efficiently-without-killing-recall.md">真实世界中的向量搜索：如何高效过滤而不牺牲召回率 </a></p></li>
</ul>
