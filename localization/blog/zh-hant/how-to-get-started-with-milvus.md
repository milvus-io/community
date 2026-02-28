---
id: how-to-get-started-with-milvus.md
title: How to Get Started with Milvus
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
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/How_To_Get_Started_With_Milvus_20230517_084248_28560b1efc.png" alt="How to get started with Milvus" class="doc-image" id="how-to-get-started-with-milvus" />
    <span>How to get started with Milvus</span>
  </span>
</p>
<p><strong><em>Last updated January 2025</em></strong></p>
<p>The advancements in Large Language Models (<a href="https://zilliz.com/glossary/large-language-models-(llms)">LLMs</a>) and the increasing volume of data necessitate a flexible and scalable infrastructure to store massive amounts of information, such as a database. However, <a href="https://zilliz.com/blog/relational-databases-vs-vector-databases">traditional databases</a> are designed to store tabular and structured data, while the information commonly useful for leveraging the power of sophisticated LLMs and information retrieval algorithms is <a href="https://zilliz.com/learn/introduction-to-unstructured-data">unstructured</a>, such as text, images, videos, or audio.</p>
<p><a href="https://zilliz.com/learn/what-is-vector-database">Vector databases</a> are database systems specifically designed for unstructured data. Not only can we store massive amounts of unstructured data with vector databases, but we can also perform <a href="https://zilliz.com/learn/vector-similarity-search">vector searches</a> with them. Vector databases have advanced indexing methods such as Inverted File Index (IVFFlat) or Hierarchical Navigable Small World (<a href="https://zilliz.com/learn/hierarchical-navigable-small-worlds-HNSW">HNSW</a>) to perform fast and efficient vector search and information retrieval processes.</p>
<p><strong>Milvus</strong> is an open-source vector database that we can use to leverage all of the beneficial features a vector database can offer. Here are what we’ll cover in this post:</p>
<ul>
<li><p><a href="https://milvus.io/blog/how-to-get-started-with-milvus.md#What-is-Milvus">An Overview of Milvus</a></p></li>
<li><p><a href="https://milvus.io/blog/how-to-get-started-with-milvus.md#Milvus-Deployment-Options">Milvus deployment options</a></p></li>
<li><p><a href="https://milvus.io/blog/how-to-get-started-with-milvus.md#Getting-Started-with-Milvus-Lite">Getting started with Milvus Lite</a></p></li>
<li><p><a href="https://milvus.io/blog/how-to-get-started-with-milvus.md#Getting-Started-with-Milvus-Standalone">Getting started with Milvus Standalone</a></p></li>
<li><p><a href="https://milvus.io/blog/how-to-get-started-with-milvus.md#Fully-Managed-Milvus">Fully Managed Milvus </a></p></li>
</ul>
<h2 id="What-is-Milvus" class="common-anchor-header">What is Milvus?<button data-href="#What-is-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://milvus.io/docs/overview.md"><strong>Milvus</strong> </a>is an open-source vector database that enables us to store massive amounts of unstructured data and perform fast and efficient vector searches on them. Milvus is highly useful for many popular GenAI applications, such as recommendation systems, personalized chatbots, anomaly detection, image search, natural language processing, and retrieval augmented generation (<a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">RAG</a>).</p>
<p>There are several advantages that you can get by using Milvus as a vector database:</p>
<ul>
<li><p>Milvus offers multiple deployment options that you can choose from depending on your use case and the size of the applications you want to build.</p></li>
<li><p>Milvus supports a diverse array of indexing methods to meet various data and performance needs, including in-memory options like FLAT, IVFFlat, HNSW, and <a href="https://zilliz.com/learn/what-is-scann-scalable-nearest-neighbors-google">SCANN</a>, quantized variants for memory efficiency, the on-disk <a href="https://zilliz.com/learn/DiskANN-and-the-Vamana-Algorithm">DiskANN</a> for large datasets, and GPU-optimized indexes such as GPU_CAGRA, GPU_IVF_FLAT, and GPU_IVF_PQ for accelerated, memory-efficient searches.</p></li>
<li><p>Milvus also offers hybrid search, where we can use a combination of dense embeddings, sparse embeddings, and metadata filtering during vector search operations, leading to more accurate retrieval results. Additionally, <a href="https://milvus.io/blog/introduce-milvus-2-5-full-text-search-powerful-metadata-filtering-and-more.md">Milvus 2.5</a> now supports a hybrid <a href="https://milvus.io/blog/get-started-with-hybrid-semantic-full-text-search-with-milvus-2-5.md">full-text search</a> and vector search, making your retrieval even more accurate.</p></li>
<li><p>Milvus can be fully used on the cloud via <a href="https://zilliz.com/cloud">Zilliz Cloud</a>, where you can optimize its operational costs and vector search speed due to four advanced features: logical clusters, streaming and historical data disaggregation, tiered storage, autoscaling, and multi-tenancy hot-cold separation.</p></li>
</ul>
<p>When using Milvus as your vector database, you can choose three different deployment options, each with its strengths and benefits. We’ll talk about each of them in the next section.</p>
<h2 id="Milvus-Deployment-Options" class="common-anchor-header">Milvus Deployment Options<button data-href="#Milvus-Deployment-Options" class="anchor-icon" translate="no">
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
    </button></h2><p>We can choose from four deployment options to start using Milvus: <strong>Milvus Lite, Milvus Standalone, Milvus Distributed, and Zilliz Cloud (managed Milvus).</strong> Each deployment option is designed to suit various scenarios in our use case, such as the size of our data, the purpose of our application, and the scale of our application.</p>
<h3 id="Milvus-Lite" class="common-anchor-header">Milvus Lite</h3><p><a href="https://milvus.io/docs/quickstart.md"><strong>Milvus Lite</strong></a> is a lightweight version of Milvus and the easiest way for us to get started. In the next section, we’ll see how we can run Milvus Lite in action, and all we need to do to get started is to install the Pymilvus library with pip. After that, we can perform most of the core functionalities of Milvus as a vector database.</p>
<p>Milvus Lite is perfect for quick prototyping or learning purposes and can be run in a Jupyter notebook without any complicated setup. In terms of vector storage, Milvus Lite is suitable for storing roughly up to a million vector embeddings. Due to its lightweight feature and storage capacity, Milvus Lite is a perfect deployment option for working with edge devices, such as private documents search engine, on-device object detection, etc.</p>
<h3 id="Milvus-Standalone" class="common-anchor-header">Milvus Standalone</h3><p>Milvus Standalone is a single-machine server deployment packed in a Docker image. Therefore, all we need to do to get started is to install Milvus in Docker, and then start the Docker container. We’ll also see the detailed implementation of Milvus Standalone in the next section.</p>
<p>Milvus Standalone is ideal for building and productionizing small to medium-scale applications, as it’s able to store up to 10M vector embeddings. Additionally, Milvus Standalone offers high availability through a primary backup mode, making it highly dependable for use in production-ready applications.</p>
<p>We can also use Milvus Standalone, for example, after performing quick prototyping and learning Milvus functionalities with Milvus Lite, as both Milvus Standalone and Milvus Lite share the same client-side API.</p>
<h3 id="Milvus-Distributed" class="common-anchor-header">Milvus Distributed</h3><p>Milvus Distributed is a deployment option that leverages a cloud-based architecture, where data ingestion and retrieval are handled separately, allowing for a highly scalable and efficient application.</p>
<p>To run Milvus Distributed, we typically need to use a Kubernetes cluster to allow the container to run on multiple machines and environments. The application of a Kubernetes cluster ensures the scalability and flexibility of Milvus Distributed in customizing the allocated resources depending on demand and workload. This also means that if one part fails, others can take over, ensuring the entire system remains uninterrupted.</p>
<p>Milvus Distributed is able to handle up to tens of billions of vector embeddings and is specially designed for use cases where the data are too big to be stored in a single server machine. Therefore, this deployment option is perfect for Enterprise clients that serve a large user base.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_Vector_embedding_storage_capability_of_different_Milvus_deployment_options_e3959ccfcd.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figure: Vector embedding storage capability of different Milvus deployment options.</em></p>
<p>In this article, we’re going to show you how to get started with both Milvus Lite and Milvus Standalone, as you can get started quickly with both methods without complicated setup. Milvus Distributed, however, is more complicated to set up. Once we set Milvus Distributed up, the code and logical process to create collections, ingest data, perform vector search, etc. are similar to Milvus Lite and Milvus Standalone, as they share the same client-side API.</p>
<p>In addition to the three deployment options mentioned above, you can also try the managed Milvus on <a href="https://zilliz.com/cloud">Zilliz Cloud</a> for a hassle-free experience. We’ll also talk about Zilliz Cloud later in this article.</p>
<h2 id="Getting-Started-with-Milvus-Lite" class="common-anchor-header">Getting Started with Milvus Lite<button data-href="#Getting-Started-with-Milvus-Lite" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus Lite can be implemented straightaway with Python by importing a library called Pymilvus using pip. Before installing Pymilvus, ensure that your environment meets the following requirements:</p>
<ul>
<li><p>Ubuntu &gt;= 20.04 (x86_64 and arm64)</p></li>
<li><p>MacOS &gt;= 11.0 (Apple Silicon M1/M2 and x86_64)</p></li>
<li><p>Python 3.7 or later</p></li>
</ul>
<p>Once these requirements are fulfilled, you can install Milvus Lite and the necessary dependencies for demonstration using the following command:</p>
<pre><code translate="no">!pip install -U pymilvus
!pip install <span class="hljs-string">&quot;pymilvus[model]&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><p><code translate="no">!pip install -U pymilvus</code>: This command installs or upgrades the <code translate="no">pymilvus</code> library, the Python SDK of Milvus. Milvus Lite is bunded with PyMilvus, so this single line of code is all you need to install Milvus Lite.</p></li>
<li><p><code translate="no">!pip install &quot;pymilvus[model]&quot;</code>: This command adds advanced features and extra tools pre-integrated with Milvus, including machine learning models like Hugging Face Transformers, Jina AI embedding models, and reranking models.</p></li>
</ul>
<p>Here are the steps we’re going to follow with Milvus Lite:</p>
<ol>
<li><p>Transform text data into their embedding representation using an embedding model.</p></li>
<li><p>Create a schema in our Milvus database to store our text data and their embedding representations.</p></li>
<li><p>Store and index our data into our schema.</p></li>
<li><p>Perform a simple vector search on the stored data.</p></li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_Workflow_of_vector_search_operation_3e38ccc1f4.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figure: Workflow of vector search operation.</em></p>
<p>To transform text data into vector embeddings, we’ll use an <a href="https://zilliz.com/ai-models">embedding model</a> from SentenceTransformers called 'all-MiniLM-L6-v2’. This embedding model transforms our text into a 384-dimensional vector embedding. Let’s load the model, transform our text data, and pack everything together.</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> model

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
<p>Next, let’s create a schema to store all of the data above into Milvus. As you can see above, our data consists of three fields: ID, vector, and text. Therefore, we’re going to create a schema with these three fields.</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient, DataType

schema = MilvusClient.create_schema(
    auto_id=<span class="hljs-literal">False</span>,
    enable_dynamic_field=<span class="hljs-literal">True</span>,
)

<span class="hljs-comment"># Add fields to schema</span>
schema.add_field(field_name=<span class="hljs-string">&quot;id&quot;</span>, datatype=DataType.INT64, is_primary=<span class="hljs-literal">True</span>)
schema.add_field(field_name=<span class="hljs-string">&quot;vector&quot;</span>, datatype=DataType.FLOAT_VECTOR, dim=<span class="hljs-number">384</span>)
schema.add_field(field_name=<span class="hljs-string">&quot;text&quot;</span>, datatype=DataType.VARCHAR, max_length=<span class="hljs-number">512</span>)
<button class="copy-code-btn"></button></code></pre>
<p>With Milvus Lite, we can easily create a collection on a particular database based on the schema defined above, as well as inserting and indexing the data into the collection in just a few lines of code.</p>
<pre><code translate="no" class="language-python">client = MilvusClient(<span class="hljs-string">&quot;./milvus_demo.db&quot;</span>)

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
<p>In the code above, we create a collection called “demo_collection” inside a Milvus database named &quot;milvus_demo&quot;. Next, we index all of our data into the “demo_collection” that we just created.</p>
<p>Now that we have our data inside the database, we can perform a vector search on them for any given query. Let’s say we have a query: &quot;<em>Who is Alan Turing?</em>&quot;. We can get the most appropriate answer to the query by implementing the following steps:</p>
<ol>
<li><p>Transform our query into a vector embedding using the same embedding model that we used to transform our data in the database into embeddings.</p></li>
<li><p>Calculate the similarity between our query embedding and the embedding of each entry in the database using metrics like cosine similarity or Euclidean distance.</p></li>
<li><p>Fetch the most similar entry as the appropriate answer to our query.</p></li>
</ol>
<p>Below is the implementation of the above steps with Milvus:</p>
<pre><code translate="no" class="language-python">query = [<span class="hljs-string">&quot;Who is Alan Turing&quot;</span>]
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
<p>And that’s it! You can also learn more about other functionalities that Milvus offers, such as managing databases, inserting and deleting collections, choosing the right indexing method, and performing more advanced vector searches with metadata filtering and hybrid search in <a href="https://milvus.io/docs/">Milvus documentation</a>.</p>
<h2 id="Getting-Started-with-Milvus-Standalone" class="common-anchor-header">Getting Started with Milvus Standalone<button data-href="#Getting-Started-with-Milvus-Standalone" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus Standalone is a deployment option in which everything is packed in a Docker container. Therefore, we need to install Milvus in Docker and then start the Docker container to get started with Milvus Standalone.</p>
<p>Before installing Milvus Standalone, make sure that both your hardware and software fulfill the requirements described on <a href="https://milvus.io/docs/prerequisite-docker.md">this page</a>. Also, ensure that you’ve installed Docker. To install Docker, refer to <a href="https://docs.docker.com/get-started/get-docker/">this page</a>.</p>
<p>Once our system fulfills the requirements and we have installed Docker, we can proceed with Milvus installation in Docker using the following command:</p>
<pre><code translate="no" class="language-shell"><span class="hljs-comment"># Download the installation script</span>
$ curl -sfL &lt;https://raw.githubusercontent.com/milvus-io/milvus/master/scripts/standalone_embed.sh&gt; -o standalone_embed.sh

<span class="hljs-comment"># Start the Docker container</span>
$ bash standalone_embed.sh start
<button class="copy-code-btn"></button></code></pre>
<p>In the above code, we also start the Docker container and once it’s started, you’ll get similar output as below:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_Message_after_successful_starting_of_the_Docker_container_5c60fa15dd.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figure: Message after successful starting of the Docker container.</em></p>
<p>After running the installation script “standalone_embed.sh” above, a Docker container named “milvus” is started at port 19530. Therefore, we can create a new database as well as access all the things related to the Milvus database by pointing to this port when initiating the client.</p>
<p>Let’s say we want to create a database called “milvus_demo”, similar to what we have done in Milvus Lite above. We can do so as follows:</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> <span class="hljs-title class_">MilvusClient</span>

client = <span class="hljs-title class_">MilvusClient</span>(
    uri=<span class="hljs-string">&quot;http://localhost:19530&quot;</span>,
    token=<span class="hljs-string">&quot;root:Milvus&quot;</span>,
)
client.<span class="hljs-title function_">create_database</span>(<span class="hljs-string">&quot;milvus_demo&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Next, you can verify whether the newly created database called “milvus_demo” truly exists in your Milvus instance by accessing the <a href="https://milvus.io/docs/milvus-webui.md">Milvus Web UI</a>. As the name suggests, Milvus Web UI is a graphical user interface provided by Milvus to observe the statistics and metrics of the components, check the list and details of databases, collections, and configurations. You can access Milvus Web UI once you’ve started the Docker container above at http://127.0.0.1:9091/webui/.</p>
<p>If you access the above link, you’ll see a landing page like this:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Landing_page_UI_187a40e935.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Under the “Collections” tab, you’ll see that our “milvus_demo” database has been successfully created. As you can see, you can also check other things such as the list of collections, configurations, the queries you’ve performed, etc., with this Web UI.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Web_Ui_2_666eae57b1.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Now we can perform everything exactly as we’ve seen in the Milvus Lite section above. Let’s create a collection called “demo_collection” inside the “milvus_demo” database that consists of three fields, the same as what we had in the Milvus Lite section before. Then, we’ll insert our data into the collection.</p>
<pre><code translate="no" class="language-python">index_params = client.prepare_index_params()

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
<p>The code to perform a vector search operation is also the same as Milvus Lite, as you can see in the below code:</p>
<pre><code translate="no" class="language-python">query = [<span class="hljs-string">&quot;Who is Alan Turing&quot;</span>]
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
<p>Aside from using Docker, you can also use Milvus Standalone with <a href="https://milvus.io/docs/install_standalone-docker-compose.md">Docker Compose</a> (for Linux) and <a href="https://milvus.io/docs/install_standalone-windows.md">Docker Desktop</a> (for Windows).</p>
<p>When we’re not using our Milvus instance anymore, we can stop Milvus Standalone with the following command:</p>
<pre><code translate="no" class="language-shell">$ bash standalone_embed.sh stop
<button class="copy-code-btn"></button></code></pre>
<h2 id="Fully-Managed-Milvus" class="common-anchor-header">Fully Managed Milvus<button data-href="#Fully-Managed-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>An alternative way to get started with Milvus is through a native cloud-based infrastructure in <a href="https://zilliz.com/cloud">Zilliz Cloud</a>, where you can get a hassle-free, 10x faster experience.</p>
<p>Zilliz Cloud offers dedicated clusters with dedicated environments and resources to support your AI application. Since it is a cloud-based database built on Milvus, we do not need to set up and manage local infrastructure. Zilliz Cloud also provides more advanced features, such as separation between vector storage and computation, data backup to popular object storage systems like S3, and data caching to speed up vector search and retrieval operations.</p>
<p>However, one thing to consider when considering cloud-based services is the operational cost. In most cases, we still need to pay even when the cluster is idle with no data ingestion or vector search activity. If you want to optimize your application’s operational cost and performance further, Zilliz Cloud Serverless would be an excellent option.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_Key_benefits_of_using_Zilliz_Cloud_Serverless_20f68e0fff.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figure: Key benefits of using Zilliz Cloud Serverless.</em></p>
<p>Zilliz Cloud Serverless is available on major cloud providers such as AWS, Azure, and GCP. It offers features like pay-as-you-go pricing, meaning you only pay when you use the cluster.</p>
<p>Zilliz Cloud Serverless also implements advanced technologies such as logical clusters, auto-scaling, tiered storage, disaggregation of streaming and historical data, and hot-cold data separation. These features enable Zilliz Cloud Serverless to achieve up to 50x cost savings and approximately 10x faster vector search operations compared to in-memory Milvus.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_Illustration_of_tiered_storage_and_hot_cold_data_separation_c634dfd211.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figure: Illustration of tiered storage and hot-cold data separation.</em></p>
<p>If you’d like to get started with Zilliz Cloud Serverless, check out <a href="https://zilliz.com/serverless">this page</a> for more information.</p>
<h2 id="Conclusion" class="common-anchor-header">Conclusion<button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus stands out as a versatile and powerful vector database designed to meet the challenges of managing unstructured data and performing fast, efficient vector search operations in modern AI applications. With deployment options such as Milvus Lite for quick prototyping, Milvus Standalone for small to medium-scale applications, and Milvus Distributed for enterprise-level scalability, it offers flexibility to match any project’s size and complexity.</p>
<p>Additionally, Zilliz Cloud Serverless extends Milvus’s capabilities into the cloud and provides a cost-effective, pay-as-you-go model that eliminates the need for local infrastructure. With advanced features like tiered storage and auto-scaling, Zilliz Cloud Serverless ensures faster vector search operations while optimizing costs.</p>
