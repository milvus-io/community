---
id: optimize-vector-databases-enhance-rag-driven-generative-ai.md
title: 'Optimize Vector Databases, Enhance RAG-Driven Generative AI'
author: 'Cathy Zhang, Dr. Malini Bhandaru'
date: 2024-05-13T00:00:00.000Z
desc: >-
  In this article, you’ll learn more about vector databases and their
  benchmarking frameworks, datasets to tackle different aspects, and the tools
  used for performance analysis — everything you need to start optimizing vector
  databases.
cover: >-
  assets.zilliz.com/Optimize_Vector_Databases_Enhance_RAG_Driven_Generative_AI_6e3b370f25.png
tag: Engineering
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Vector Management, RAG, Generative AI
recommend: true
canonicalUrl: >-
  https://medium.com/intel-tech/optimize-vector-databases-enhance-rag-driven-generative-ai-90c10416cb9c
---
<p><em>This post was originally published on <a href="https://medium.com/intel-tech/optimize-vector-databases-enhance-rag-driven-generative-ai-90c10416cb9c">Intel’s Medium Channel</a> and is reposted here with permission.</em></p>
<p><br></p>
<p>Two methods to optimize your vector database when using RAG</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://miro.medium.com/v2/resize:fit:1400/1*FRWBVwOHPYFDIVTp_ylZNQ.jpeg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Photo by <a href="https://unsplash.com/@ilyapavlov?utm_content=creditCopyText&amp;utm_medium=referral&amp;utm_source=unsplash">Ilya Pavlov</a> on <a href="https://unsplash.com/photos/monitor-showing-java-programming-OqtafYT5kTw?utm_content=creditCopyText&amp;utm_medium=referral&amp;utm_source=unsplash">Unsplash</a></p>
<p>By Cathy Zhang and Dr. Malini Bhandaru
Contributors: Lin Yang and Changyan Liu</p>
<p>Generative AI (GenAI) models, which are seeing exponential adoption in our daily lives, are being improved by <a href="https://www.techtarget.com/searchenterpriseai/definition/retrieval-augmented-generation">retrieval-augmented generation (RAG)</a>, a technique used to enhance response accuracy and reliability by fetching facts from external sources. RAG helps a regular <a href="https://www.techtarget.com/whatis/definition/large-language-model-LLM">large language model (LLM)</a> understand context and reduce <a href="https://en.wikipedia.org/wiki/Hallucination_(artificial_intelligence)">hallucinations</a> by leveraging a giant database of unstructured data stored as vectors — a mathematical presentation that helps capture context and relationships between data.</p>
<p>RAG helps to retrieve more contextual information and thus generate better responses, but the vector databases they rely on are getting ever larger to provide rich content to draw upon. Just as trillion-parameter LLMs are on the horizon, vector databases of billions of vectors are not far behind. As optimization engineers, we were curious to see if we could make vector databases more performant, load data faster, and create indices faster to ensure retrieval speed even as new data is added. Doing so would not only result in reduced user wait time, but also make RAG-based AI solutions a little more sustainable.</p>
<p>In this article, you’ll learn more about vector databases and their benchmarking frameworks, datasets to tackle different aspects, and the tools used for performance analysis — everything you need to start optimizing vector databases. We will also share our optimization achievements on two popular vector database solutions to inspire you on your optimization journey of performance and sustainability impact.</p>
<h2 id="Understanding-Vector-Databases" class="common-anchor-header">Understanding Vector Databases<button data-href="#Understanding-Vector-Databases" class="anchor-icon" translate="no">
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
    </button></h2><p>Unlike traditional relational or non-relational databases where data is stored in a structured manner, a vector database contains a mathematical representation of individual data items, called a vector, constructed using an embedding or transformation function. The vector commonly represents features or semantic meanings and can be short or long. Vector databases do vector retrieval by similarity search using a distance metric (where closer means the results are more similar) such as <a href="https://www.pinecone.io/learn/vector-similarity/">Euclidean, dot product, or cosine similarity</a>.</p>
<p>To accelerate the retrieval process, the vector data is organized using an indexing mechanism. Examples of these organization methods include flat structures, <a href="https://arxiv.org/abs/2002.09094">inverted file (IVF),</a> <a href="https://arxiv.org/abs/1603.09320">Hierarchical Navigable Small Worlds (HNSW),</a> and <a href="https://en.wikipedia.org/wiki/Locality-sensitive_hashing">locality-sensitive hashing (LSH)</a>, among others. Each of these methods contributes to the efficiency and effectiveness of retrieving similar vectors when needed.</p>
<p>Let’s examine how you would use a vector database in a GenAI system. Figure 1 illustrates both the loading of data into a vector database and using it in the context of a GenAI application. When you input your prompt, it undergoes a transformation process identical to the one used to generate vectors in the database. This transformed vector prompt is then used to retrieve similar vectors from the vector database. These retrieved items essentially serve as conversational memory, furnishing contextual history for prompts, akin to how LLMs operate. This feature proves particularly advantageous in natural language processing, computer vision, recommendation systems, and other domains requiring semantic comprehension and data matching. Your initial prompt is subsequently “merged” with the retrieved elements, supplying context, and assisting the LLM in formulating responses based on the provided context rather than solely relying on its original training data.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://miro.medium.com/v2/resize:fit:1400/1*zQj_YJdWc2xKB6Vv89lzDQ.jpeg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Figure 1. A RAG application architecture.</p>
<p>Vectors are stored and indexed for speedy retrieval. Vector databases come in two main flavors, traditional databases that have been extended to store vectors, and purpose-built vector databases. Some examples of traditional databases that provide vector support are <a href="https://redis.io/">Redis</a>, <a href="https://github.com/pgvector/pgvector">pgvector</a>, <a href="https://www.elastic.co/elasticsearch">Elasticsearch</a>, and <a href="https://opensearch.org/">OpenSearch</a>. Examples of purpose-built vector databases include proprietary solutions <a href="https://zilliz.com/">Zilliz</a> and <a href="https://www.pinecone.io/">Pinecone</a>, and open source projects <a href="https://milvus.io/">Milvus</a>, <a href="https://weaviate.io/">Weaviate</a>, <a href="https://qdrant.tech/">Qdrant</a>, <a href="https://github.com/facebookresearch/faiss">Faiss</a>, and <a href="https://www.trychroma.com/">Chroma</a>. You can learn more about vector databases on GitHub via <a href="https://github.com/langchain-ai/langchain/tree/master/libs/langchain/langchain/vectorstores">LangChain </a>and <a href="https://github.com/openai/openai-cookbook/tree/main/examples/vector_databases">OpenAI Cookbook</a>.</p>
<p>We’ll take a closer look at one from each category, Milvus and Redis.</p>
<h2 id="Improving-Performance" class="common-anchor-header">Improving Performance<button data-href="#Improving-Performance" class="anchor-icon" translate="no">
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
    </button></h2><p>Before diving into the optimizations, let’s review how vector databases are evaluated, some evaluation frameworks, and available performance analysis tools.</p>
<h3 id="Performance-Metrics" class="common-anchor-header">Performance Metrics</h3><p>Let’s look at key metrics that can help you measure vector database performance.</p>
<ul>
<li><strong>Load latency</strong> measures the time required to load data into the vector database’s memory and build an index. An index is a data structure used to efficiently organize and retrieve vector data based on its similarity or distance. Types of <a href="https://milvus.io/docs/index.md#In-memory-Index">in-memory indices</a> include <a href="https://thedataquarry.com/posts/vector-db-3/#flat-indexes">flat index</a>, <a href="https://supabase.com/docs/guides/ai/vector-indexes/ivf-indexes">IVF_FLAT</a>, <a href="https://towardsdatascience.com/ivfpq-hnsw-for-billion-scale-similarity-search-89ff2f89d90e">IVF_PQ, HNSW</a>, <a href="https://github.com/google-research/google-research/tree/master/scann">scalable nearest neighbors (ScaNN),</a>and <a href="https://milvus.io/docs/disk_index.md">DiskANN</a>.</li>
<li><strong>Recall</strong> is the proportion of true matches, or relevant items, found in the <a href="https://redis.io/docs/data-types/probabilistic/top-k/">Top K</a> results retrieved by the search algorithm. Higher recall values indicate better retrieval of relevant items.</li>
<li><strong>Queries per second (QPS)</strong> is the rate at which the vector database can process incoming queries. Higher QPS values imply better query processing capability and system throughput.</li>
</ul>
<h3 id="Benchmarking-Frameworks" class="common-anchor-header">Benchmarking Frameworks</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://miro.medium.com/v2/resize:fit:920/1*mssEjZAuXg6nf-pad67rHA.jpeg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Figure 2. The vector database benchmarking framework.</p>
<p>Benchmarking a vector database requires a vector database server and clients. In our performance tests, we used two popular open source tools.</p>
<ul>
<li><a href="https://github.com/zilliztech/VectorDBBench/tree/main"><strong>VectorDBBench</strong></a><strong>:</strong> Developed and open sourced by Zilliz, VectorDBBench helps test different vector databases with different index types and provides a convenient web interface.</li>
<li><a href="https://github.com/qdrant/vector-db-benchmark/tree/master"><strong>vector-db-benchmark</strong></a><strong>:</strong> Developed and open sourced by Qdrant, vector-db-benchmark helps test several typical vector databases for the <a href="https://www.datastax.com/guides/hierarchical-navigable-small-worlds">HNSW</a> index type. It runs tests through the command line and provides a <a href="https://docs.docker.com/compose/">Docker Compose</a> __file to simplify starting server components.</li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://miro.medium.com/v2/resize:fit:1400/1*NpHHEFV0TxRMse83hK6H1A.jpeg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Figure 3. An example vector-db-benchmark command used to run the benchmark test.</p>
<p>But the benchmark framework is only part of the equation. We need data that exercises different aspects of the vector database solution itself, such as its ability to handle large volumes of data, various vector sizes, and speed of retrieval.With that, let’s look at some available public datasets.</p>
<h3 id="Open-Datasets-to-Exercise-Vector-Databases" class="common-anchor-header">Open Datasets to Exercise Vector Databases</h3><p>Large datasets are good candidates to test load latency and resource allocation. Some datasets have high dimensional data and are good for testing speed of computing similarity.</p>
<p>Datasets range from a dimension of 25 to a dimension of 2048. The <a href="https://laion.ai/">LAION</a> dataset, an open image collection, has been used for training very large visual and language deep-neural models like stable diffusion generative models. OpenAI’s dataset of 5M vectors, each with a dimension of 1536, was created by VectorDBBench by running OpenAI on <a href="https://huggingface.co/datasets/allenai/c4">raw data</a>. Given each vector element is of type FLOAT, to save the vectors alone, approximately 29 GB (5M * 1536 * 4) of memory is needed, plus a similar amount extra to hold indices and other metadata for a total of 58 GB of memory for testing. When using the vector-db-benchmark tool, ensure adequate disk storage to save results.</p>
<p>To test for load latency, we needed a large collection of vectors, which <a href="https://docs.hippo.transwarp.io/docs/performance-dataset">deep-image-96-angular</a> offers. To test performance of index generation and similarity computation, high dimensional vectors provide more stress. To this end we chose the 500K dataset of 1536 dimension vectors.</p>
<h3 id="Performance-Tools" class="common-anchor-header">Performance Tools</h3><p>We’ve covered ways to stress the system to identify metrics of interest, but let’s examine what’s happening at a lower level: How busy is the computing unit, memory consumption, waits on locks, and more? These provide clues to databasebehavior, particularly useful in identifying problem areas.</p>
<p>The Linux <a href="https://www.redhat.com/sysadmin/interpret-top-output">top</a> utility provides system-performance information. However, the <a href="https://perf.wiki.kernel.org/index.php/Main_Page">perf</a> tool in Linux provides a deeper set of insights. To learn more, we also recommend reading <a href="https://www.brendangregg.com/perf.html">Linux perf examples</a> and the <a href="https://www.intel.com/content/www/us/en/docs/vtune-profiler/cookbook/2023-0/top-down-microarchitecture-analysis-method.html">Intel top-down microarchitecture analysis method</a>. Yet another tool is the <a href="https://www.intel.com/content/www/us/en/developer/tools/oneapi/vtune-profiler.html">Intel® vTune™ Profiler</a>, which is useful when optimizing not just application but also system performance and configuration for a variety of workloads spanning HPC, cloud, IoT, media, storage, and more.</p>
<h2 id="Milvus-Vector-Database-Optimizations" class="common-anchor-header">Milvus Vector Database Optimizations<button data-href="#Milvus-Vector-Database-Optimizations" class="anchor-icon" translate="no">
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
    </button></h2><p>Let’s walk through some examples of how we attempted to improve the performance of the Milvus vector database.</p>
<h3 id="Reducing-Memory-Movement-Overhead-in-Datanode-Buffer-Write" class="common-anchor-header">Reducing Memory Movement Overhead in Datanode Buffer Write</h3><p>Milvus’s write path proxies write data into a log broker via <em>MsgStream</em>. The data nodes then consume the data, converting and storing it into segments. Segments will merge the newly inserted data. The merge logic allocates a new buffer to hold/move both the old data and the new data to be inserted and then returns the new buffer as old data for the next data merge. This results in the old data getting successively larger, which in turn makes data movement slower. Perf profiles showed a high overhead for this logic.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://miro.medium.com/v2/resize:fit:1400/1*Az4dMVBcGmdeyKNrwpR19g.jpeg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Figure 4. Merging and moving data in the vector database generates a high-performance overhead.</p>
<p>We changed the <em>merge buffer</em> logic to directly append the new data to be inserted into the old data, avoiding allocating a new buffer and moving the large old data. Perf profiles confirm that there is no overhead to this logic. The microcode metrics <em>metric_CPU operating frequency</em> and <em>metric_CPU utilization</em> indicate an improvement that is consistent with the system not having to wait for the long memory movement anymore. Load latency improved by more than 60 percent. The improvement is captured on <a href="https://github.com/milvus-io/milvus/pull/26839">GitHub</a>.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://miro.medium.com/v2/resize:fit:1400/1*MmaUtBTdqmMvC5MlQ8V0wQ.jpeg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Figure 5. With less copying we see a performance improvement of more than 50 percent in load latency.</p>
<h3 id="Inverted-Index-Building-with-Reduced-Memory-Allocation-Overhead" class="common-anchor-header">Inverted Index Building with Reduced Memory Allocation Overhead</h3><p>The Milvus search engine, <a href="https://milvus.io/docs/knowhere.md">Knowhere</a>, employs the <a href="https://www.vlfeat.org/api/kmeans-fundamentals.html#kmeans-elkan">Elkan k-means algorithm</a> to train cluster data for creating <a href="https://milvus.io/docs/v1.1.1/index.md">inverted file (IVF) indices</a>. Each round of data training defines an iteration count. The larger the count, the better the training results. However, it also implies that the Elkan algorithm will be called more frequently.</p>
<p>The Elkan algorithm handles memory allocation and deallocation each time it’s executed. Specifically, it allocates memory to store half the size of symmetric matrix data, excluding the diagonal elements. In Knowhere, the symmetric matrix dimension used by the Elkan algorithm is set to 1024, resulting in a memory size of approximately 2 MB. This means for each training round Elkan repeatedly allocates and deallocates 2 MB memory.</p>
<p>Perf profiling data indicated frequent large memory allocation activity. In fact, it triggered <a href="https://www.oreilly.com/library/view/linux-device-drivers/9781785280009/4759692f-43fb-4066-86b2-76a90f0707a2.xhtml">virtual memory area (VMA)</a>allocation, physical page allocation, page map setup, and updating of memory cgroup statistics in the kernel. This pattern of large memory allocation/deallocation activity can, in some situations, also aggravate memory fragmentation. This is a significant tax.</p>
<p>The <em>IndexFlatElkan</em> structure is specifically designed and constructed to support the Elkan algorithm. Each data training process will have an <em>IndexFlatElkan</em> instance initialized. To mitigate the performance impact resulting from frequent memory allocation and deallocation in the Elkan algorithm, we refactored the code logic, moving the memory management outside of the Elkan algorithm function up into the construction process of <em>IndexFlatElkan</em>. This enables memory allocation to occur only once during the initialization phase while serving all subsequent Elkan algorithm function calls from the current data training process and helps to improve load latency by around 3 percent. Find the <a href="https://github.com/zilliztech/knowhere/pull/280">Knowhere patch here</a>.</p>
<h2 id="Redis-Vector-Search-Acceleration-through-Software-Prefetch" class="common-anchor-header">Redis Vector Search Acceleration through Software Prefetch<button data-href="#Redis-Vector-Search-Acceleration-through-Software-Prefetch" class="anchor-icon" translate="no">
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
    </button></h2><p>Redis, a popular traditional in-memory key-value data store, recently began supporting vector search. To go beyond a typical key-value store, it offers extensibility modules; the <a href="https://github.com/RediSearch/RediSearch">RediSearch</a> module facilitates the storage and search of vectors directly within Redis.</p>
<p>For vector similarity search, Redis supports two algorithms, namely brute force and HNSW. The HNSW algorithm is specifically crafted for efficiently locating approximate nearest neighbors in high-dimensional spaces. It uses a priority queue named <em>candidate_set</em> to manage all vector candidates for distance computing.</p>
<p>Each vector candidate encompasses substantial metadata in addition to the vector data. As a result, when loading a candidate from memory it can cause data cache misses, which incur processing delays. Our optimization introduces software prefetching to proactively load the next candidate while processing the current one. This enhancement has resulted in a 2 to 3 percent throughput improvement for vector similarity searches in a single instance Redis setup. The patch is in the process of being upstreamed.</p>
<h2 id="GCC-Default-Behavior-Change-to-Prevent-Mixed-Assembly-Code-Penalties" class="common-anchor-header">GCC Default Behavior Change to Prevent Mixed Assembly Code Penalties<button data-href="#GCC-Default-Behavior-Change-to-Prevent-Mixed-Assembly-Code-Penalties" class="anchor-icon" translate="no">
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
    </button></h2><p>To drive maximum performance, frequently used sections of code are often handwritten in assembly. However, when different segments of code are written either by different people or at different points in time, the instructions used may come from incompatible assembly instruction sets such as <a href="https://www.intel.com/content/www/us/en/architecture-and-technology/avx-512-overview.html">Intel® Advanced Vector Extensions 512 (Intel® AVX-512)</a> and <a href="https://en.wikipedia.org/wiki/Streaming_SIMD_Extensions">Streaming SIMD Extensions (SSE)</a>. If not compiled appropriately, the mixed code results in a performance penalty. <a href="https://www.intel.com/content/dam/develop/external/us/en/documents/11mc12-avoiding-2bavx-sse-2btransition-2bpenalties-2brh-2bfinal-809104.pdf">Learn more about mixing Intel AVX and SSE instructions here</a>.</p>
<p>You can easily determine if you’re using mixed-mode assembly code and have not compiled the code with <em>VZEROUPPER</em>, incurring the performance penalty. It can be observed through a perf command like <em>sudo perf stat -e ‘assists.sse_avx_mix/event/event=0xc1,umask=0x10/’ &lt;workload&gt;</em>. If your OS doesn’t have support for the event, use <em>cpu/event=0xc1,umask=0x10,name=assists_sse_avx_mix/</em>.</p>
<p>The Clang compiler by default inserts <em>VZEROUPPER</em>, avoiding any mixed mode penalty. But the GCC compiler only inserted <em>VZEROUPPER</em> when the -O2 or -O3 compiler flags were specified. We contacted the GCC team and explained the issue and they now, by default, correctly handle mixed mode assembly code.</p>
<h2 id="Start-Optimizing-Your-Vector-Databases" class="common-anchor-header">Start Optimizing Your Vector Databases<button data-href="#Start-Optimizing-Your-Vector-Databases" class="anchor-icon" translate="no">
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
    </button></h2><p>Vector databases are playing an integral role in GenAI, and they are growing ever larger to generate higher-quality responses. With respect to optimization, AI applications are no different from other software applications in that they reveal their secrets when one employs standard performance analysis tools along with benchmark frameworks and stress input.</p>
<p>Using these tools, we uncovered performance traps pertaining to unnecessary memory allocation, failing to prefetch instructions, and using incorrect compiler options. Based on our findings, we upstreamed enhancements to Milvus, Knowhere, Redis, and the GCC compiler to help make AI a little more performant and sustainable. Vector databases are an important class of applications worthy of your optimization efforts. We hope this article helps you get started.</p>
