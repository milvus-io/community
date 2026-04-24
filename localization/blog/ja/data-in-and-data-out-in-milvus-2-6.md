---
id: data-in-and-data-out-in-milvus-2-6.md
title: >
  Introducing the Embedding Function: How Milvus 2.6 Streamlines Vectorization
  and Semantic Search
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
desc: >-
  Discover how Milvus 2.6 simplifies embedding process and vector search with
  Data-in, Data-out. Automatically handle embedding and reranking — no external
  preprocessing needed.
origin: 'https://milvus.io/blog/data-in-and-data-out-in-milvus-2-6.md'
---
<p>If you’ve ever built a vector search application, you already know the workflow a little too well. Before any data can be stored, it must first be transformed into vectors using an embedding model, cleaned and formatted, and then finally ingested into your vector database. Every query goes through the same process as well: embed the input, run a similarity search, then map the resulting IDs back to your original documents or records. It works — but it creates a distributed tangle of preprocessing scripts, embedding pipelines, and glue code that you have to maintain.</p>
<p><a href="https://milvus.io/">Milvus</a>, a high-performance open-source vector database, now takes a major step toward simplifying all of that. <a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md">Milvus 2.6</a> introduces the <strong>Data-in, Data-out feature (also known as the</strong> <a href="https://milvus.io/docs/embedding-function-overview.md#Embedding-Function-Overview"><strong>Embedding Function</strong></a><strong>)</strong>, a built-in embedding capability that connects directly to major model providers such as OpenAI, AWS Bedrock, Google Vertex AI, and Hugging Face. Instead of managing your own embedding infrastructure, Milvus can now call these models for you. You can also insert and query using raw text — and soon other data types — while Milvus automatically handles vectorization at write and query time.</p>
<p>In the rest of this post, we’ll take a closer look at how Data-in, Data-out works under the hood, how to configure providers and embedding functions, and how you can use it to streamline your vector search workflows end-to-end.</p>
<h2 id="What-is-Data-in-Data-out" class="common-anchor-header">What is Data-in, Data-out?<button data-href="#What-is-Data-in-Data-out" class="anchor-icon" translate="no">
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
    </button></h2><p>Data-in, Data-out in Milvus 2.6 is built on the new Function module — a framework that enables Milvus to handle data transformation and embedding generation internally, without any external preprocessing services. (You can follow the design proposal in <a href="https://github.com/milvus-io/milvus/issues/35856">GitHub issue #35856</a>.) With this module, Milvus can take raw input data, call an embedding provider directly, and automatically write the resulting vectors into your collection.</p>
<p>At a high level, the <strong>Function</strong> module turns embedding generation into a native database capability. Instead of running separate embedding pipelines, background workers, or reranker services, Milvus now sends requests to your configured provider, retrieves embeddings, and stores them alongside your data — all inside the ingestion path. This removes the operational overhead of managing your own embedding infrastructure.</p>
<p>Data-in, Data-out introduces three major improvements to the Milvus workflow:</p>
<ul>
<li><p><strong>Insert raw data directly</strong> – You can now insert unprocessed text, images, or other data types directly into Milvus. No need to convert them into vectors in advance.</p></li>
<li><p><strong>Configure one embedding function</strong> – Once you configure an embedding model in Milvus, it automatically manages the entire embedding process. Milvus integrates seamlessly with a range of model providers, including OpenAI, AWS Bedrock, Google Vertex AI, Cohere, and Hugging Face.</p></li>
<li><p><strong>Query with raw inputs</strong> – You can now perform semantic search using raw text or other content-based queries. Milvus uses the same configured model to generate embeddings on the fly, perform similarity search, and return relevant results.</p></li>
</ul>
<p>In short, Milvus now automatically embeds — and optionally reranks — your data. Vectorization becomes a built-in database function, eliminating the need for external embedding services or custom preprocessing logic.</p>
<h2 id="How-Data-in-Data-out-Works" class="common-anchor-header">How Data-in, Data-out Works<button data-href="#How-Data-in-Data-out-Works" class="anchor-icon" translate="no">
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
    </button></h2><p>The diagram below illustrates how Data-in, Data-out operates inside Milvus.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/diagram_data_in_data_out_4c9e06c884.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>The Data-in, Data-out workflow can be broken down into six main steps:</p>
<ol>
<li><p><strong>Input Data</strong> – The user inserts raw data — such as text, images, or other content types — directly into Milvus without performing any external preprocessing.</p></li>
<li><p><strong>Generate Embeddings</strong> – The Function module automatically invokes the configured embedding model through its third-party API, converting the raw input into vector embeddings in real time.</p></li>
<li><p><strong>Store Embeddings</strong> – Milvus writes the generated embeddings into the designated vector field within your collection, where they become available for similarity search operations.</p></li>
<li><p><strong>Submit a Query</strong> – The user issues a raw-text or content-based query to Milvus, just as with the input stage.</p></li>
<li><p><strong>Semantic Search</strong> – Milvus embeds the query using the same configured model, runs a similarity search over the stored vectors, and determines the closest semantic matches.</p></li>
<li><p><strong>Return Results</strong> – Milvus returns the top-k most similar results — mapped back to their original data — directly to the application.</p></li>
</ol>
<h2 id="How-to-Configure-Data-in-Data-out" class="common-anchor-header">How to Configure Data-in, Data-out<button data-href="#How-to-Configure-Data-in-Data-out" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Prerequisites" class="common-anchor-header">Prerequisites</h3><ul>
<li><p>Install the latest version of <strong>Milvus 2.6</strong>.</p></li>
<li><p>Prepare your embedding API key from a supported provider (e.g., OpenAI, AWS Bedrock, or Cohere). In this example, we’ll use <strong>Cohere</strong> as the embedding provider.</p></li>
</ul>
<h3 id="Modify-the-milvusyaml-Configuration" class="common-anchor-header">Modify the <code translate="no">milvus.yaml</code> Configuration</h3><p>If you are running Milvus with <strong>Docker Compose</strong>, you’ll need to modify the <code translate="no">milvus.yaml</code> file to enable the Function module. You can refer to the official documentation for guidance: <a href="https://milvus.io/docs/configure-docker.md?tab=component#Download-a-configuration-file">Configure Milvus with Docker Compose</a> (Instructions for other deployment methods can also be found here).</p>
<p>In the configuration file, locate the sections <code translate="no">credential</code> and <code translate="no">function</code>.</p>
<p>Then, update the fields <code translate="no">apikey1.apikey</code> and <code translate="no">providers.cohere</code>.</p>
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
<p>Once you’ve made these changes, restart Milvus to apply the updated configuration.</p>
<h2 id="How-to-Use-the-Data-in-Data-out-Feature" class="common-anchor-header">How to Use the Data-in, Data-out Feature<button data-href="#How-to-Use-the-Data-in-Data-out-Feature" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="1-Define-the-Schema-for-the-Collection" class="common-anchor-header">1. Define the Schema for the Collection</h3><p>To enable the embedding feature, your <strong>collection schema</strong> must include at least three fields:</p>
<ul>
<li><p><strong>Primary key field (</strong><code translate="no">id</code><strong>)</strong> – Uniquely identifies each entity in the collection.</p></li>
<li><p><strong>Scalar field (</strong><code translate="no">document</code><strong>)</strong> – Stores the original raw data.</p></li>
<li><p><strong>Vector field (</strong><code translate="no">dense</code><strong>)</strong> – Stores the generated vector embeddings.</p></li>
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
<h3 id="2-Define-the-Embedding-Function" class="common-anchor-header">2. Define the Embedding Function</h3><p>Next, define the <strong>embedding function</strong> in the schema.</p>
<ul>
<li><p><code translate="no">name</code> – A unique identifier for the function.</p></li>
<li><p><code translate="no">function_type</code> – Set to <code translate="no">FunctionType.TEXTEMBEDDING</code> for text embeddings. Milvus also supports other function types such as <code translate="no">FunctionType.BM25</code> and <code translate="no">FunctionType.RERANK</code>. See <a href="https://milvus.io/docs/full-text-search.md#Full-Text-Search">Full Text Search</a> and <a href="https://milvus.io/docs/decay-ranker-overview.md#Decay-Ranker-Overview">Decay Ranker Overview</a> for more details.</p></li>
<li><p><code translate="no">input_field_names</code> – Defines the input field for raw data (<code translate="no">document</code>).</p></li>
<li><p><code translate="no">output_field_names</code> – Defines the output field where the vector embeddings will be stored (<code translate="no">dense</code>).</p></li>
<li><p><code translate="no">params</code> – Contains configuration parameters for the embedding function. The values for <code translate="no">provider</code> and <code translate="no">model_name</code> must match the corresponding entries in your <code translate="no">milvus.yaml</code> configuration file.</p></li>
</ul>
<p><strong>Note:</strong> Each function must have a unique <code translate="no">name</code> and <code translate="no">output_field_names</code> to distinguish different transformation logics and prevent conflicts.</p>
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
<h3 id="3-Configure-the-Index" class="common-anchor-header">3. Configure the Index</h3><p>Once the fields and functions are defined, create an index for the collection. For simplicity, we use the AUTOINDEX type here as an example.</p>
<pre><code translate="no"><span class="hljs-comment"># Prepare index parameters</span>
index_params = client.prepare_index_params()
<span class="hljs-comment"># Add AUTOINDEX to automatically select optimal indexing method</span>
index_params.add_index(
    field_name=<span class="hljs-string">&quot;dense&quot;</span>,
    index_type=<span class="hljs-string">&quot;AUTOINDEX&quot;</span>,
    metric_type=<span class="hljs-string">&quot;COSINE&quot;</span> 
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="4-Create-the-Collection" class="common-anchor-header">4. Create the Collection</h3><p>Use the defined schema and index to create a new collection. In this example, we’ll create a collection named Demo.</p>
<pre><code translate="no"><span class="hljs-comment"># Create collection named &quot;demo&quot;</span>
client.create_collection(
    collection_name=<span class="hljs-string">&#x27;demo&#x27;</span>, 
    schema=schema, 
    index_params=index_params
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="5-Insert-Data" class="common-anchor-header">5. Insert Data</h3><p>Now you can insert raw data directly into Milvus — there’s no need to generate embeddings manually.</p>
<pre><code translate="no"><span class="hljs-comment"># Insert sample documents</span>
client.insert(<span class="hljs-string">&#x27;demo&#x27;</span>, [
    {<span class="hljs-string">&#x27;id&#x27;</span>: <span class="hljs-number">1</span>, <span class="hljs-string">&#x27;document&#x27;</span>: <span class="hljs-string">&#x27;Milvus simplifies semantic search through embeddings.&#x27;</span>},
    {<span class="hljs-string">&#x27;id&#x27;</span>: <span class="hljs-number">2</span>, <span class="hljs-string">&#x27;document&#x27;</span>: <span class="hljs-string">&#x27;Vector embeddings convert text into searchable numeric data.&#x27;</span>},
    {<span class="hljs-string">&#x27;id&#x27;</span>: <span class="hljs-number">3</span>, <span class="hljs-string">&#x27;document&#x27;</span>: <span class="hljs-string">&#x27;Semantic search helps users find relevant information quickly.&#x27;</span>},
])
<button class="copy-code-btn"></button></code></pre>
<h3 id="6-Perform-Vector-Search" class="common-anchor-header">6. Perform Vector Search</h3><p>After inserting data, you can perform searches directly using raw text queries. Milvus automatically converts your query into an embedding, perform similarity search against stored vectors, and return the top matches.</p>
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
<p>For more details on vector search, see: <a href="https://milvus.io/docs/single-vector-search.md">Basic Vector Search </a>and <a href="https://milvus.io/docs/get-and-scalar-query.md">Query API</a>.</p>
<h2 id="Get-Started-with-Milvus-26" class="common-anchor-header">Get Started with Milvus 2.6<button data-href="#Get-Started-with-Milvus-26" class="anchor-icon" translate="no">
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
    </button></h2><p>With Data-in, Data-out, Milvus 2.6 takes vector search simplicity to the next level. By integrating embedding and reranking functions directly within Milvus, you no longer need to manage external preprocessing or maintain separate embedding services.</p>
<p>Ready to try it out? Install <a href="https://milvus.io/docs">Milvus</a> 2.6 today and experience the power of Data-in, Data-out for yourself.</p>
<p>Have questions or want a deep dive on any feature? Join our<a href="https://discord.com/invite/8uyFbECzPX"> Discord channel</a> or file issues on<a href="https://github.com/milvus-io/milvus"> GitHub</a>. You can also book a 20-minute one-on-one session to get insights, guidance, and answers to your questions through<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus Office Hours</a>.</p>
<h2 id="Learn-More-about-Milvus-26-Features" class="common-anchor-header">Learn More about Milvus 2.6 Features<button data-href="#Learn-More-about-Milvus-26-Features" class="anchor-icon" translate="no">
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
<li><p><a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md">Introducing Milvus 2.6: Affordable Vector Search at Billion Scale</a></p></li>
<li><p><a href="https://milvus.io/blog/json-shredding-in-milvus-faster-json-filtering-with-flexibility.md">JSON Shredding in Milvus: 88.9x Faster JSON Filtering with Flexibility</a></p></li>
<li><p><a href="https://milvus.io/blog/unlocking-true-entity-level-retrieval-new-array-of-structs-and-max-sim-capabilities-in-milvus.md">Unlocking True Entity-Level Retrieval: New Array-of-Structs and MAX_SIM Capabilities in Milvus</a></p></li>
<li><p><a href="https://milvus.io/blog/minhash-lsh-in-milvus-the-secret-weapon-for-fighting-duplicates-in-llm-training-data.md">MinHash LSH in Milvus: The Secret Weapon for Fighting Duplicates in LLM Training Data </a></p></li>
<li><p><a href="https://milvus.io/blog/bring-vector-compression-to-the-extreme-how-milvus-serves-3%C3%97-more-queries-with-rabitq.md">Bring Vector Compression to the Extreme: How Milvus Serves 3× More Queries with RaBitQ</a></p></li>
<li><p><a href="https://milvus.io/blog/benchmarks-lie-vector-dbs-deserve-a-real-test.md">Benchmarks Lie — Vector DBs Deserve a Real Test </a></p></li>
<li><p><a href="https://milvus.io/blog/we-replaced-kafka-pulsar-with-a-woodpecker-for-milvus.md">We Replaced Kafka/Pulsar with a Woodpecker for Milvus </a></p></li>
<li><p><a href="https://milvus.io/blog/how-to-filter-efficiently-without-killing-recall.md">Vector Search in the Real World: How to Filter Efficiently Without Killing Recall </a></p></li>
</ul>
