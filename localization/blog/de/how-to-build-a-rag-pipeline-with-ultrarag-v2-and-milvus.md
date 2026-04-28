---
id: how-to-build-a-rag-pipeline-with-ultrarag-v2-and-milvus.md
title: |
  How to Build a RAG Pipeline with UltraRAG v2 and Milvus
author: Min Yin
date: 2026-3-11
cover: assets.zilliz.com/cover_ultra_RAG_7bf485abd9.jpg
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  UltraRAG v2, Milvus vector database, RAG pipeline, Model Context Protocol MCP,
  vector search retrieval
meta_title: |
  Build a RAG Pipeline with UltraRAG v2 and Milvus
desc: >
  Learn how to build a RAG pipeline using UltraRAG v2 and Milvus with MCP,
  modular components, and YAML-based workflows.
origin: >-
  https://milvus.io/blog/how-to-build-a-rag-pipeline-with-ultrarag-v2-and-milvus.md
---
<p>Retrieval-Augmented Generation (RAG) has evolved far beyond the simple “retrieve then generate” pattern. Modern systems now behave more like full reasoning engines, combining adaptive retrieval, multi-step planning, and dynamic decision-making. But this progress comes with two major challenges: <strong>high engineering cost</strong> and <strong>growing system complexity</strong>. Reproducing existing methods often requires rebuilding intricate pipelines, while experimenting with new ideas demands significant orchestration work.</p>
<p><a href="https://github.com/OpenBMB/UltraRAG">UltraRAG v2</a> tackles these pain points directly. Developed by THUNLP, NEUIR, OpenBMB, and AI9stars, it’s the first RAG framework built on the Model Context Protocol (MCP). Instead of hand-writing complex logic, researchers can declare sequences, loops, and branching behavior in simple YAML files, enabling fast, low-code construction of multi-stage RAG systems.</p>
<p>Even with a framework like UltraRAG, a RAG system still needs a strong retrieval layer. This is where a vector database helps. <a href="https://milvus.io/">Milvus</a>, an open-source vector database, stores embeddings, builds indexes, and performs fast similarity search on large datasets. In an UltraRAG pipeline, Milvus retrieves relevant information for the model. Together, UltraRAG and Milvus make it easier to build RAG systems that are both flexible and efficient.</p>
<p>In this post, we’ll show how to integrate Milvus with UltraRAG v2 and build a complete RAG pipeline.</p>
<h2 id="UltraRAG-v2-Architecture-at-a-Glance" class="common-anchor-header">UltraRAG v2 Architecture at a Glance<button data-href="#UltraRAG-v2-Architecture-at-a-Glance" class="anchor-icon" translate="no">
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
    </button></h2><p>In different RAG systems, core functions such as retrieval, generation, and evaluation are similar but implemented in different ways, making components difficult to reuse or combine. The MCP addresses this problem by standardizing how LLMs communicate with external tools through a simple Client–Server architecture.</p>
<p>Inspired by this, UltraRAG v2 is built around three core ideas:</p>
<ul>
<li><strong>Modular encapsulation:</strong> UltraRAG v2 packages key RAG capabilities into standalone MCP Servers with unified Tool interfaces. This creates a clean, modular structure where you can focus on reasoning logic rather than backend wiring. New components can be added, replaced, or upgraded like plugins—no core-code edits required.</li>
<li><strong>YAML configuration:</strong> Complex, multi-step RAG pipelines are hard to debug. UltraRAG v2 makes them transparent by moving all control logic into YAML. Sequences, loops, and conditional branches are defined in a declarative manner, and every step’s inputs and outputs are clearly traceable. This greatly simplifies debugging and accelerates workflow iteration.</li>
<li><strong>Lightweight workflow orchestration:</strong> A built-in MCP Client executes pipeline, keeping workflow behavior fully decoupled from underlying implementations. While traditional RAG systems often require editing core code to add new features, UltraRAG v2 adopts a microservice-like model where new modules can be deployed independently, just like installing a plugin.</li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Blog_Howto_Builda_RAG_Pipelinewith_Ultra_RA_Gv2and_Mi_3_f993c219a3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Why-and-How-to-Integrate-Milvus-into-the-UltraRAG-Pipeline" class="common-anchor-header">Why and How to Integrate Milvus into the UltraRAG Pipeline<button data-href="#Why-and-How-to-Integrate-Milvus-into-the-UltraRAG-Pipeline" class="anchor-icon" translate="no">
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
    </button></h2><p>In the UltraRAG v2 stack, the vector database plays a critical role in retrieval quality and system performance. <strong>Milvus</strong>, an open-source vector database, is a strong fit thanks to its scalability, efficient indexing, and seamless integration capabilities.</p>
<p>Once Milvus is integrated into an UltraRAG pipeline, you can build indexes and run queries using simple commands such as ultrarag build and ultrarag run. UltraRAG will automatically load your configuration and coordinate all modules needed to complete the task.</p>
<p>In this demo, we will walk through four objectives:</p>
<ol>
<li><p>Integrate Milvus into an UltraRAG v2 project</p></li>
<li><p>Create a custom pipeline that uses Milvus for retrieval</p></li>
<li><p>Run the full pipeline to verify everything works end to end</p></li>
<li><p>Check the run results (Optional)</p></li>
</ol>
<h3 id="Dataset-Setup" class="common-anchor-header">Dataset Setup</h3><p>For this demo, we will use the Milvus FAQ dataset from the official Milvus repository. The dataset is provided in JSONL format.</p>
<pre><code translate="no">{<span class="hljs-string">&quot;id&quot;</span>: <span class="hljs-string">&quot;faq_0&quot;</span>, <span class="hljs-string">&quot;contents&quot;</span>: <span class="hljs-string">&quot;If you failed to pull the Milvus Docker image from Docker Hub, try adding other registry mirrors. Users from the Chinese mainland can add the URL https://registry.docker-cn.com to the registry-mirrors array in /etc.docker/daemon.json.&quot;</span>}
{<span class="hljs-string">&quot;id&quot;</span>: <span class="hljs-string">&quot;faq_1&quot;</span>, <span class="hljs-string">&quot;contents&quot;</span>: <span class="hljs-string">&quot;Docker is an efficient way to deploy Milvus, but not the only way. You can also deploy Milvus from source code. This requires Ubuntu (18.04 or higher) or CentOS (7 or higher). See Building Milvus from Source Code for more information.&quot;</span>}
{<span class="hljs-string">&quot;id&quot;</span>: <span class="hljs-string">&quot;faq_2&quot;</span>, <span class="hljs-string">&quot;contents&quot;</span>: <span class="hljs-string">&quot;Recall is affected mainly by index type and search parameters. For FLAT index, Milvus takes an exhaustive scan within a collection, with a 100% return. For IVF indexes, the nprobe parameter determines the scope of a search within the collection. Increasing nprobe increases the proportion of vectors searched and recall, but diminishes query performance.&quot;</span>}
{<span class="hljs-string">&quot;id&quot;</span>: <span class="hljs-string">&quot;faq_3&quot;</span>, <span class="hljs-string">&quot;contents&quot;</span>: <span class="hljs-string">&quot;Milvus does not support modification to configuration files during runtime. You must restart Milvus Docker for configuration file changes to take effect.&quot;</span>}
{<span class="hljs-string">&quot;id&quot;</span>: <span class="hljs-string">&quot;faq_4&quot;</span>, <span class="hljs-string">&quot;contents&quot;</span>: <span class="hljs-string">&quot;If Milvus is started using Docker Compose, run docker ps to observe how many Docker containers are running and check if Milvus services started correctly. For Milvus standalone, you should be able to observe at least three running Docker containers, one being the Milvus service and the other two being etcd management and storage service.&quot;</span>}
{<span class="hljs-string">&quot;id&quot;</span>: <span class="hljs-string">&quot;faq_5&quot;</span>, <span class="hljs-string">&quot;contents&quot;</span>: <span class="hljs-string">&quot;The time difference is usually due to the fact that the host machine does not use Coordinated Universal Time (UTC). The log files inside the Docker image use UTC by default. If your host machine does not use UTC, this issue may occur.&quot;</span>}
{<span class="hljs-string">&quot;id&quot;</span>: <span class="hljs-string">&quot;faq_6&quot;</span>, <span class="hljs-string">&quot;contents&quot;</span>: <span class="hljs-string">&quot;Milvus requires your CPU to support a SIMD instruction set: SSE4.2, AVX, AVX2, or AVX512. CPU must support at least one of these to ensure that Milvus operates normally.&quot;</span>}
{<span class="hljs-string">&quot;id&quot;</span>: <span class="hljs-string">&quot;faq_7&quot;</span>, <span class="hljs-string">&quot;contents&quot;</span>: <span class="hljs-string">&quot;Milvus requires your CPU to support a SIMD instruction set: SSE4.2, AVX, AVX2, or AVX512. CPU must support at least one of these to ensure that Milvus operates normally. An illegal instruction error returned during startup suggests that your CPU does not support any of the above four instruction sets.&quot;</span>}
{<span class="hljs-string">&quot;id&quot;</span>: <span class="hljs-string">&quot;faq_8&quot;</span>, <span class="hljs-string">&quot;contents&quot;</span>: <span class="hljs-string">&quot;Yes. You can install Milvus on Windows either by compiling from source code or from a binary package. See Run Milvus on Windows to learn how to install Milvus on Windows.&quot;</span>}
{<span class="hljs-string">&quot;id&quot;</span>: <span class="hljs-string">&quot;faq_9&quot;</span>, <span class="hljs-string">&quot;contents&quot;</span>: <span class="hljs-string">&quot;It is not recommended to install PyMilvus on Windows. But if you have to install PyMilvus on Windows but got an error, try installing it in a Conda environment. See Install Milvus SDK for more information about how to install PyMilvus in the Conda environment.&quot;</span>}
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-1-Deploy-the-Milvus-Vector-Database" class="common-anchor-header">Step 1: Deploy the Milvus Vector Database</h3><p><strong>Download the Deployment Files</strong></p>
<pre><code translate="no">wget https://github.com/Milvus-io/Milvus/releases/download/v2.5.12/Milvus-standalone-docker-compose.yml -O docker-compose.yml
<button class="copy-code-btn"></button></code></pre>
<p><strong>Start the Milvus Service</strong></p>
<pre><code translate="no">docker-compose up -d
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">docker-compose ps -a
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Blog_Howto_Builda_RAG_Pipelinewith_Ultra_RA_Gv2and_Mi_1_ff7eb318e0.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-2-Clone-the-Project" class="common-anchor-header">Step 2: Clone the Project</h3><pre><code translate="no">git <span class="hljs-built_in">clone</span> https://github.com/OpenBMB/UltraRAG.git
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-3-Implement-the-Pipeline" class="common-anchor-header">Step 3: Implement the Pipeline</h3><p><strong>Integrate the Milvus Vector Database</strong></p>
<p>Note: Milvus is added as one of the supported vector database types in the retrieval module.</p>
<pre><code translate="no">vim ultraRAG/UltraRAG/servers/retriever/src/retriever.py
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no"><span class="hljs-keyword">import</span> os
<span class="hljs-keyword">from</span> urllib.parse <span class="hljs-keyword">import</span> urlparse, urlunparse
<span class="hljs-keyword">from</span> typing <span class="hljs-keyword">import</span> <span class="hljs-type">Any</span>, <span class="hljs-type">Dict</span>, <span class="hljs-type">List</span>, <span class="hljs-type">Optional</span>
<span class="hljs-keyword">import</span> aiohttp
<span class="hljs-keyword">import</span> asyncio
<span class="hljs-keyword">import</span> jsonlines
<span class="hljs-keyword">import</span> numpy <span class="hljs-keyword">as</span> np
<span class="hljs-keyword">import</span> pandas <span class="hljs-keyword">as</span> pd
<span class="hljs-keyword">from</span> tqdm <span class="hljs-keyword">import</span> tqdm
<span class="hljs-keyword">from</span> flask <span class="hljs-keyword">import</span> Flask, jsonify, request
<span class="hljs-keyword">from</span> openai <span class="hljs-keyword">import</span> AsyncOpenAI, OpenAIError
<span class="hljs-keyword">from</span> fastmcp.exceptions <span class="hljs-keyword">import</span> NotFoundError, ToolError, ValidationError
<span class="hljs-keyword">from</span> ultrarag.server <span class="hljs-keyword">import</span> UltraRAG_MCP_Server
app = UltraRAG_MCP_Server(<span class="hljs-string">&quot;retriever&quot;</span>)
retriever_app = Flask(__name__)
<span class="hljs-keyword">class</span> <span class="hljs-title class_">Retriever</span>:
    <span class="hljs-keyword">def</span> <span class="hljs-title function_">__init__</span>(<span class="hljs-params">self, mcp_inst: UltraRAG_MCP_Server</span>):
        mcp_inst.tool(
            <span class="hljs-variable language_">self</span>.retriever_init,
            output=<span class="hljs-string">&quot;retriever_path,corpus_path,index_path,faiss_use_gpu,infinity_kwargs,cuda_devices-&gt;None&quot;</span>,
        )
        mcp_inst.tool(
            <span class="hljs-variable language_">self</span>.retriever_init_openai,
            output=<span class="hljs-string">&quot;corpus_path,openai_model,api_base,api_key-&gt;None&quot;</span>,
        )
        mcp_inst.tool(
            <span class="hljs-variable language_">self</span>.retriever_init_Milvus,
            output=<span class="hljs-string">&quot;corpus_path,Milvus_host,Milvus_port,collection_name,embedding_dim-&gt;None&quot;</span>,
        )
        mcp_inst.tool(
            <span class="hljs-variable language_">self</span>.retriever_embed,
            output=<span class="hljs-string">&quot;embedding_path,overwrite,use_alibaba_cloud,alibaba_api_key,alibaba_model,alibaba_endpoint-&gt;None&quot;</span>,
        )
        mcp_inst.tool(
            <span class="hljs-variable language_">self</span>.retriever_embed_openai,
            output=<span class="hljs-string">&quot;embedding_path,overwrite-&gt;None&quot;</span>,
        )
        mcp_inst.tool(
            <span class="hljs-variable language_">self</span>.retriever_index,
            output=<span class="hljs-string">&quot;embedding_path,index_path,overwrite,index_chunk_size-&gt;None&quot;</span>,
        )
        mcp_inst.tool(
            <span class="hljs-variable language_">self</span>.retriever_index_lancedb,
            output=<span class="hljs-string">&quot;embedding_path,lancedb_path,table_name,overwrite-&gt;None&quot;</span>,
        )
        <span class="hljs-comment"># Note: retriever_index_Milvus has been removed</span>
        <span class="hljs-comment"># Use setup_Milvus_collection.py for collection creation and indexing</span>
        mcp_inst.tool(
            <span class="hljs-variable language_">self</span>.retriever_search,
            output=<span class="hljs-string">&quot;q_ls,top_k,query_instruction,use_openai-&gt;ret_psg&quot;</span>,
        )
        mcp_inst.tool(
            <span class="hljs-variable language_">self</span>.retriever_search_lancedb,
            output=<span class="hljs-string">&quot;q_ls,top_k,query_instruction,use_openai,lancedb_path,table_name,filter_expr-&gt;ret_psg&quot;</span>,
        )
        mcp_inst.tool(
            <span class="hljs-variable language_">self</span>.retriever_search_Milvus,
            output=<span class="hljs-string">&quot;q_ls,top_k,query_instruction,use_openai-&gt;ret_psg&quot;</span>,
        )
        mcp_inst.tool(
            <span class="hljs-variable language_">self</span>.retriever_deploy_service,
            output=<span class="hljs-string">&quot;retriever_url-&gt;None&quot;</span>,
        )
        mcp_inst.tool(
            <span class="hljs-variable language_">self</span>.retriever_deploy_search,
            output=<span class="hljs-string">&quot;retriever_url,q_ls,top_k,query_instruction-&gt;ret_psg&quot;</span>,
        )
        mcp_inst.tool(
            <span class="hljs-variable language_">self</span>.retriever_exa_search,
            output=<span class="hljs-string">&quot;q_ls,top_k-&gt;ret_psg&quot;</span>,
        )
        mcp_inst.tool(
            <span class="hljs-variable language_">self</span>.retriever_tavily_search,
            output=<span class="hljs-string">&quot;q_ls,top_k-&gt;ret_psg&quot;</span>,
        )
    <span class="hljs-keyword">def</span> <span class="hljs-title function_">retriever_init</span>(<span class="hljs-params">
        self,
        retriever_path: <span class="hljs-built_in">str</span>,
        corpus_path: <span class="hljs-built_in">str</span>,
        index_path: <span class="hljs-type">Optional</span>[<span class="hljs-built_in">str</span>] = <span class="hljs-literal">None</span>,
        faiss_use_gpu: <span class="hljs-built_in">bool</span> = <span class="hljs-literal">False</span>,
        infinity_kwargs: <span class="hljs-type">Optional</span>[<span class="hljs-type">Dict</span>[<span class="hljs-built_in">str</span>, <span class="hljs-type">Any</span>]] = <span class="hljs-literal">None</span>,
        cuda_devices: <span class="hljs-type">Optional</span>[<span class="hljs-built_in">str</span>] = <span class="hljs-literal">None</span>,
    </span>):
        <span class="hljs-keyword">try</span>:
            <span class="hljs-keyword">import</span> faiss
        <span class="hljs-keyword">except</span> ImportError:
            err_msg = <span class="hljs-string">&quot;faiss is not installed. Please install it with `conda install -c pytorch faiss-cpu` or `conda install -c pytorch faiss-gpu`.&quot;</span>
            app.logger.error(err_msg)
            <span class="hljs-keyword">raise</span> ImportError(err_msg)
        <span class="hljs-keyword">try</span>:
            <span class="hljs-keyword">from</span> infinity_emb.log_handler <span class="hljs-keyword">import</span> LOG_LEVELS
            <span class="hljs-keyword">from</span> infinity_emb <span class="hljs-keyword">import</span> AsyncEngineArray, EngineArgs
        <span class="hljs-keyword">except</span> ImportError:
            err_msg = <span class="hljs-string">&quot;infinity_emb is not installed. Please install it with `pip install infinity-emb`.&quot;</span>
            app.logger.error(err_msg)
            <span class="hljs-keyword">raise</span> ImportError(err_msg)
        <span class="hljs-variable language_">self</span>.faiss_use_gpu = faiss_use_gpu
        app.logger.setLevel(LOG_LEVELS[<span class="hljs-string">&quot;warning&quot;</span>])
        <span class="hljs-keyword">if</span> cuda_devices <span class="hljs-keyword">is</span> <span class="hljs-keyword">not</span> <span class="hljs-literal">None</span>:
            <span class="hljs-keyword">assert</span> <span class="hljs-built_in">isinstance</span>(cuda_devices, <span class="hljs-built_in">str</span>), <span class="hljs-string">&quot;cuda_devices should be a string&quot;</span>
            os.environ[<span class="hljs-string">&quot;CUDA_VISIBLE_DEVICES&quot;</span>] = cuda_devices
        infinity_kwargs = infinity_kwargs <span class="hljs-keyword">or</span> {}
        <span class="hljs-variable language_">self</span>.model = AsyncEngineArray.from_args(
            [EngineArgs(model_name_or_path=retriever_path, **infinity_kwargs)]
        )[<span class="hljs-number">0</span>]
        <span class="hljs-variable language_">self</span>.contents = []
        <span class="hljs-keyword">with</span> jsonlines.<span class="hljs-built_in">open</span>(corpus_path, mode=<span class="hljs-string">&quot;r&quot;</span>) <span class="hljs-keyword">as</span> reader:
            <span class="hljs-variable language_">self</span>.contents = [item[<span class="hljs-string">&quot;contents&quot;</span>] <span class="hljs-keyword">for</span> item <span class="hljs-keyword">in</span> reader]
        <span class="hljs-variable language_">self</span>.faiss_index = <span class="hljs-literal">None</span>
        <span class="hljs-keyword">if</span> index_path <span class="hljs-keyword">is</span> <span class="hljs-keyword">not</span> <span class="hljs-literal">None</span> <span class="hljs-keyword">and</span> os.path.exists(index_path):
            cpu_index = faiss.read_index(index_path)
            <span class="hljs-keyword">if</span> <span class="hljs-variable language_">self</span>.faiss_use_gpu:
                co = faiss.GpuMultipleClonerOptions()
                co.shard = <span class="hljs-literal">True</span>
                co.useFloat16 = <span class="hljs-literal">True</span>
                <span class="hljs-keyword">try</span>:
                    <span class="hljs-variable language_">self</span>.faiss_index = faiss.index_cpu_to_all_gpus(cpu_index, co)
                    app.logger.info(<span class="hljs-string">f&quot;Loaded index to GPU(s).&quot;</span>)
                <span class="hljs-keyword">except</span> RuntimeError <span class="hljs-keyword">as</span> e:
                    app.logger.error(
                        <span class="hljs-string">f&quot;GPU index load failed: <span class="hljs-subst">{e}</span>. Falling back to CPU.&quot;</span>
                    )
                    <span class="hljs-variable language_">self</span>.faiss_use_gpu = <span class="hljs-literal">False</span>
                    <span class="hljs-variable language_">self</span>.faiss_index = cpu_index
            <span class="hljs-keyword">else</span>:
                <span class="hljs-variable language_">self</span>.faiss_index = cpu_index
                app.logger.info(<span class="hljs-string">&quot;Loaded index on CPU.&quot;</span>)
            app.logger.info(<span class="hljs-string">f&quot;Retriever index path has already been built&quot;</span>)
        <span class="hljs-keyword">else</span>:
            app.logger.warning(<span class="hljs-string">f&quot;Cannot find path: <span class="hljs-subst">{index_path}</span>&quot;</span>)
            <span class="hljs-variable language_">self</span>.faiss_index = <span class="hljs-literal">None</span>
            app.logger.info(<span class="hljs-string">f&quot;Retriever initialized&quot;</span>)
    <span class="hljs-keyword">def</span> <span class="hljs-title function_">retriever_init_openai</span>(<span class="hljs-params">
        self,
        corpus_path: <span class="hljs-built_in">str</span>,
        openai_model: <span class="hljs-built_in">str</span>,
        api_base: <span class="hljs-built_in">str</span>,
        api_key: <span class="hljs-built_in">str</span>,
    </span>):
        <span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> openai_model:
            <span class="hljs-keyword">raise</span> ValueError(<span class="hljs-string">&quot;openai_model must be provided.&quot;</span>)
        <span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> api_base <span class="hljs-keyword">or</span> <span class="hljs-keyword">not</span> <span class="hljs-built_in">isinstance</span>(api_base, <span class="hljs-built_in">str</span>):
            <span class="hljs-keyword">raise</span> ValueError(<span class="hljs-string">&quot;api_base must be a non-empty string.&quot;</span>)
        <span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> api_key <span class="hljs-keyword">or</span> <span class="hljs-keyword">not</span> <span class="hljs-built_in">isinstance</span>(api_key, <span class="hljs-built_in">str</span>):
            <span class="hljs-keyword">raise</span> ValueError(<span class="hljs-string">&quot;api_key must be a non-empty string.&quot;</span>)
        <span class="hljs-variable language_">self</span>.contents = []
        <span class="hljs-keyword">with</span> jsonlines.<span class="hljs-built_in">open</span>(corpus_path, mode=<span class="hljs-string">&quot;r&quot;</span>) <span class="hljs-keyword">as</span> reader:
            <span class="hljs-variable language_">self</span>.contents = [item[<span class="hljs-string">&quot;contents&quot;</span>] <span class="hljs-keyword">for</span> item <span class="hljs-keyword">in</span> reader]
        <span class="hljs-keyword">try</span>:
            <span class="hljs-variable language_">self</span>.openai_model = openai_model
            <span class="hljs-variable language_">self</span>.client = AsyncOpenAI(base_url=api_base, api_key=api_key)
            app.logger.info(
                <span class="hljs-string">f&quot;OpenAI client initialized with model &#x27;<span class="hljs-subst">{openai_model}</span>&#x27; and base &#x27;<span class="hljs-subst">{api_base}</span>&#x27;&quot;</span>
            )
        <span class="hljs-keyword">except</span> OpenAIError <span class="hljs-keyword">as</span> e:
            app.logger.error(<span class="hljs-string">f&quot;Failed to initialize OpenAI client: <span class="hljs-subst">{e}</span>&quot;</span>)
    <span class="hljs-keyword">def</span> <span class="hljs-title function_">retriever_init_Milvus</span>(<span class="hljs-params">
        self,
        corpus_path: <span class="hljs-built_in">str</span>,
        Milvus_host: <span class="hljs-built_in">str</span> = <span class="hljs-string">&quot;192.168.8.130&quot;</span>,
        Milvus_port: <span class="hljs-built_in">int</span> = <span class="hljs-number">19530</span>,
        collection_name: <span class="hljs-built_in">str</span> = <span class="hljs-string">&quot;ultrarag_collection_v3&quot;</span>,
        embedding_dim: <span class="hljs-built_in">int</span> = <span class="hljs-number">1024</span>,
    </span>):
        <span class="hljs-string">&quot;&quot;&quot;Initialize Milvus vector database connection.
        Args:
            corpus_path (str): Path to the corpus JSONL file (for reference only)
            Milvus_host (str): Milvus server host
            Milvus_port (int): Milvus server port
            collection_name (str): Name of the existing collection to use
            embedding_dim (int): Dimension of embeddings (for reference only)
        Note:
            This method assumes the collection already exists and is properly configured.
            Use setup_Milvus_collection.py to create and configure collections.
        &quot;&quot;&quot;</span>
        <span class="hljs-keyword">try</span>:
            <span class="hljs-keyword">from</span> pyMilvus <span class="hljs-keyword">import</span> connections, Collection, utility
        <span class="hljs-keyword">except</span> ImportError:
            err_msg = <span class="hljs-string">&quot;pyMilvus is not installed. Please install it with `pip install pyMilvus`.&quot;</span>
            app.logger.error(err_msg)
            <span class="hljs-keyword">raise</span> ImportError(err_msg)
        <span class="hljs-comment"># Initialize Alibaba Cloud client for embeddings</span>
        <span class="hljs-keyword">try</span>:
            <span class="hljs-keyword">from</span> openai <span class="hljs-keyword">import</span> AsyncOpenAI
        <span class="hljs-keyword">except</span> ImportError:
            err_msg = <span class="hljs-string">&quot;openai is not installed. Please install it with `pip install openai`.&quot;</span>
            app.logger.error(err_msg)
            <span class="hljs-keyword">raise</span> ImportError(err_msg)
        <span class="hljs-comment"># Set up Alibaba Cloud client for embeddings</span>
        <span class="hljs-variable language_">self</span>.alibaba_client = AsyncOpenAI(
            base_url=<span class="hljs-string">&quot;https://dashscope.aliyuncs.com/compatible-mode/v1&quot;</span>,
            api_key=<span class="hljs-string">&quot;sk-xxxxxx&quot;</span>
        )
        <span class="hljs-variable language_">self</span>.alibaba_model = <span class="hljs-string">&quot;text-embedding-v3&quot;</span>
        <span class="hljs-comment"># Load corpus data (for reference, not used in search)</span>
        <span class="hljs-variable language_">self</span>.contents = []
        <span class="hljs-keyword">with</span> jsonlines.<span class="hljs-built_in">open</span>(corpus_path, mode=<span class="hljs-string">&quot;r&quot;</span>) <span class="hljs-keyword">as</span> reader:
            <span class="hljs-variable language_">self</span>.contents = [item[<span class="hljs-string">&quot;contents&quot;</span>] <span class="hljs-keyword">for</span> item <span class="hljs-keyword">in</span> reader]
        <span class="hljs-comment"># Connect to Milvus</span>
        <span class="hljs-keyword">try</span>:
            connections.connect(
                alias=<span class="hljs-string">&quot;default&quot;</span>,
                host=Milvus_host,
                port=Milvus_port
            )
            app.logger.info(<span class="hljs-string">f&quot;Connected to Milvus at <span class="hljs-subst">{Milvus_host}</span>:<span class="hljs-subst">{Milvus_port}</span>&quot;</span>)
        <span class="hljs-keyword">except</span> Exception <span class="hljs-keyword">as</span> e:
            app.logger.error(<span class="hljs-string">f&quot;Failed to connect to Milvus: <span class="hljs-subst">{e}</span>&quot;</span>)
            <span class="hljs-keyword">raise</span> ConnectionError(<span class="hljs-string">f&quot;Failed to connect to Milvus: <span class="hljs-subst">{e}</span>&quot;</span>)
        <span class="hljs-comment"># Store Milvus configuration</span>
        <span class="hljs-variable language_">self</span>.Milvus_host = Milvus_host
        <span class="hljs-variable language_">self</span>.Milvus_port = Milvus_port
        <span class="hljs-variable language_">self</span>.collection_name = collection_name
        <span class="hljs-variable language_">self</span>.embedding_dim = embedding_dim
        <span class="hljs-comment"># Connect to existing collection (must exist and be loaded)</span>
        <span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> utility.has_collection(collection_name):
            <span class="hljs-keyword">raise</span> ValueError(<span class="hljs-string">f&quot;Collection &#x27;<span class="hljs-subst">{collection_name}</span>&#x27; does not exist. Please create it first using setup_Milvus_collection.py&quot;</span>)
        <span class="hljs-variable language_">self</span>.Milvus_collection = Collection(collection_name)
        <span class="hljs-comment"># Verify collection is loaded</span>
        load_state = utility.load_state(collection_name)
        <span class="hljs-keyword">if</span> load_state != <span class="hljs-string">&quot;Loaded&quot;</span>:
            app.logger.warning(<span class="hljs-string">f&quot;Collection &#x27;<span class="hljs-subst">{collection_name}</span>&#x27; is not loaded (state: <span class="hljs-subst">{load_state}</span>). Attempting to load...&quot;</span>)
            <span class="hljs-keyword">try</span>:
                <span class="hljs-variable language_">self</span>.Milvus_collection.load()
                utility.wait_for_loading_complete(collection_name=collection_name, timeout=<span class="hljs-number">60</span>)
                app.logger.info(<span class="hljs-string">f&quot;Successfully loaded collection &#x27;<span class="hljs-subst">{collection_name}</span>&#x27;&quot;</span>)
            <span class="hljs-keyword">except</span> Exception <span class="hljs-keyword">as</span> e:
                <span class="hljs-keyword">raise</span> RuntimeError(<span class="hljs-string">f&quot;Failed to load collection &#x27;<span class="hljs-subst">{collection_name}</span>&#x27;: <span class="hljs-subst">{e}</span>&quot;</span>)
        <span class="hljs-comment"># Verify collection has data and indexes</span>
        entity_count = <span class="hljs-variable language_">self</span>.Milvus_collection.num_entities
        <span class="hljs-keyword">if</span> entity_count == <span class="hljs-number">0</span>:
            app.logger.warning(<span class="hljs-string">f&quot;Collection &#x27;<span class="hljs-subst">{collection_name}</span>&#x27; is empty&quot;</span>)
        <span class="hljs-keyword">else</span>:
            app.logger.info(<span class="hljs-string">f&quot;Connected to collection &#x27;<span class="hljs-subst">{collection_name}</span>&#x27; with <span class="hljs-subst">{entity_count}</span> entities&quot;</span>)
        app.logger.info(<span class="hljs-string">&quot;Milvus retriever initialized successfully&quot;</span>)
    <span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">retriever_embed</span>(<span class="hljs-params">
        self,
        embedding_path: <span class="hljs-type">Optional</span>[<span class="hljs-built_in">str</span>] = <span class="hljs-literal">None</span>,
        overwrite: <span class="hljs-built_in">bool</span> = <span class="hljs-literal">False</span>,
        use_alibaba_cloud: <span class="hljs-built_in">bool</span> = <span class="hljs-literal">False</span>,
        alibaba_api_key: <span class="hljs-type">Optional</span>[<span class="hljs-built_in">str</span>] = <span class="hljs-literal">None</span>,
        alibaba_model: <span class="hljs-built_in">str</span> = <span class="hljs-string">&quot;text-embedding-v3&quot;</span>,
        alibaba_endpoint: <span class="hljs-type">Optional</span>[<span class="hljs-built_in">str</span>] = <span class="hljs-literal">None</span>,
    </span>):
        <span class="hljs-keyword">if</span> embedding_path <span class="hljs-keyword">is</span> <span class="hljs-keyword">not</span> <span class="hljs-literal">None</span>:
            <span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> embedding_path.endswith(<span class="hljs-string">&quot;.npy&quot;</span>):
                err_msg = <span class="hljs-string">f&quot;Embedding save path must end with .npy, now the path is <span class="hljs-subst">{embedding_path}</span>&quot;</span>
                app.logger.error(err_msg)
                <span class="hljs-keyword">raise</span> ValidationError(err_msg)
            output_dir = os.path.dirname(embedding_path)
        <span class="hljs-keyword">else</span>:
            current_file = os.path.abspath(__file__)
            project_root = os.path.dirname(os.path.dirname(current_file))
            output_dir = os.path.join(project_root, <span class="hljs-string">&quot;output&quot;</span>, <span class="hljs-string">&quot;embedding&quot;</span>)
            embedding_path = os.path.join(output_dir, <span class="hljs-string">&quot;embedding.npy&quot;</span>)
        <span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> overwrite <span class="hljs-keyword">and</span> os.path.exists(embedding_path):
            app.logger.info(<span class="hljs-string">&quot;embedding already exists, skipping&quot;</span>)
            <span class="hljs-keyword">return</span>
        os.makedirs(output_dir, exist_ok=<span class="hljs-literal">True</span>)
        <span class="hljs-keyword">if</span> use_alibaba_cloud:
            <span class="hljs-comment"># Use Alibaba Cloud API for embeddings</span>
            <span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> alibaba_api_key <span class="hljs-keyword">or</span> <span class="hljs-keyword">not</span> alibaba_endpoint:
                <span class="hljs-keyword">raise</span> ValueError(<span class="hljs-string">&quot;Alibaba Cloud API key and endpoint must be provided&quot;</span>)
            client = AsyncOpenAI(base_url=alibaba_endpoint, api_key=alibaba_api_key)
            <span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">alibaba_embed</span>(<span class="hljs-params">texts</span>):
                embeddings = []
                batch_size = <span class="hljs-number">100</span>  <span class="hljs-comment"># Process in batches to avoid rate limits</span>
                <span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-number">0</span>, <span class="hljs-built_in">len</span>(texts), batch_size):
                    batch = texts[i:i+batch_size]
                    <span class="hljs-keyword">try</span>:
                        response = <span class="hljs-keyword">await</span> client.embeddings.create(
                            <span class="hljs-built_in">input</span>=batch, model=alibaba_model
                        )
                        batch_embeddings = [item.embedding <span class="hljs-keyword">for</span> item <span class="hljs-keyword">in</span> response.data]
                        embeddings.extend(batch_embeddings)
                        app.logger.info(<span class="hljs-string">f&quot;Processed batch <span class="hljs-subst">{i//batch_size + <span class="hljs-number">1</span>}</span>/<span class="hljs-subst">{(<span class="hljs-built_in">len</span>(texts)-<span class="hljs-number">1</span>)//batch_size + <span class="hljs-number">1</span>}</span>&quot;</span>)
                    <span class="hljs-keyword">except</span> Exception <span class="hljs-keyword">as</span> e:
                        app.logger.error(<span class="hljs-string">f&quot;Error in Alibaba Cloud embedding batch <span class="hljs-subst">{i//batch_size + <span class="hljs-number">1</span>}</span>: <span class="hljs-subst">{e}</span>&quot;</span>)
                        <span class="hljs-keyword">raise</span>
                <span class="hljs-keyword">return</span> embeddings
            embeddings = <span class="hljs-keyword">await</span> alibaba_embed(<span class="hljs-variable language_">self</span>.contents)
            app.logger.info(<span class="hljs-string">&quot;Alibaba Cloud embedding completed&quot;</span>)
        <span class="hljs-keyword">else</span>:
            <span class="hljs-comment"># Use local model for embeddings</span>
            <span class="hljs-keyword">async</span> <span class="hljs-keyword">with</span> <span class="hljs-variable language_">self</span>.model:
                embeddings, usage = <span class="hljs-keyword">await</span> <span class="hljs-variable language_">self</span>.model.embed(sentences=<span class="hljs-variable language_">self</span>.contents)
        embeddings = np.array(embeddings, dtype=np.float16)
        np.save(embedding_path, embeddings)
        app.logger.info(<span class="hljs-string">&quot;embedding success&quot;</span>)
    <span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">retriever_embed_openai</span>(<span class="hljs-params">
        self,
        embedding_path: <span class="hljs-type">Optional</span>[<span class="hljs-built_in">str</span>] = <span class="hljs-literal">None</span>,
        overwrite: <span class="hljs-built_in">bool</span> = <span class="hljs-literal">False</span>,
    </span>):
        <span class="hljs-keyword">if</span> embedding_path <span class="hljs-keyword">is</span> <span class="hljs-keyword">not</span> <span class="hljs-literal">None</span>:
            <span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> embedding_path.endswith(<span class="hljs-string">&quot;.npy&quot;</span>):
                err_msg = <span class="hljs-string">f&quot;Embedding save path must end with .npy, now the path is <span class="hljs-subst">{embedding_path}</span>&quot;</span>
                app.logger.error(err_msg)
                <span class="hljs-keyword">raise</span> ValidationError(err_msg)
            output_dir = os.path.dirname(embedding_path)
        <span class="hljs-keyword">else</span>:
            current_file = os.path.abspath(__file__)
            project_root = os.path.dirname(os.path.dirname(current_file))
            output_dir = os.path.join(project_root, <span class="hljs-string">&quot;output&quot;</span>, <span class="hljs-string">&quot;embedding&quot;</span>)
            embedding_path = os.path.join(output_dir, <span class="hljs-string">&quot;embedding.npy&quot;</span>)
        <span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> overwrite <span class="hljs-keyword">and</span> os.path.exists(embedding_path):
            app.logger.info(<span class="hljs-string">&quot;embedding already exists, skipping&quot;</span>)
        os.makedirs(output_dir, exist_ok=<span class="hljs-literal">True</span>)
        <span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">openai_embed</span>(<span class="hljs-params">texts</span>):
            embeddings = []
            <span class="hljs-keyword">for</span> text <span class="hljs-keyword">in</span> texts:
                response = <span class="hljs-keyword">await</span> <span class="hljs-variable language_">self</span>.client.embeddings.create(
                    <span class="hljs-built_in">input</span>=text, model=<span class="hljs-variable language_">self</span>.openai_model
                )
                embeddings.append(response.data[<span class="hljs-number">0</span>].embedding)
            <span class="hljs-keyword">return</span> embeddings
        embeddings = <span class="hljs-keyword">await</span> openai_embed(<span class="hljs-variable language_">self</span>.contents)
        embeddings = np.array(embeddings, dtype=np.float16)
        np.save(embedding_path, embeddings)
        app.logger.info(<span class="hljs-string">&quot;embedding success&quot;</span>)
    <span class="hljs-keyword">def</span> <span class="hljs-title function_">retriever_index</span>(<span class="hljs-params">
        self,
        embedding_path: <span class="hljs-built_in">str</span>,
        index_path: <span class="hljs-type">Optional</span>[<span class="hljs-built_in">str</span>] = <span class="hljs-literal">None</span>,
        overwrite: <span class="hljs-built_in">bool</span> = <span class="hljs-literal">False</span>,
        index_chunk_size: <span class="hljs-built_in">int</span> = <span class="hljs-number">50000</span>,
    </span>):
        <span class="hljs-string">&quot;&quot;&quot;
        Build a Faiss index from an embedding matrix.
        Args:
            embedding_path (str): .npy file of shape (N, dim), dtype float32.
            index_path (str, optional): where to save .index file.
            overwrite (bool): overwrite existing index.
            index_chunk_size (int): batch size for add_with_ids.
        &quot;&quot;&quot;</span>
        <span class="hljs-keyword">try</span>:
            <span class="hljs-keyword">import</span> faiss
        <span class="hljs-keyword">except</span> ImportError:
            err_msg = <span class="hljs-string">&quot;faiss is not installed. Please install it with `conda install -c pytorch faiss-cpu` or `conda install -c pytorch faiss-gpu`.&quot;</span>
            app.logger.error(err_msg)
            <span class="hljs-keyword">raise</span> ImportError(err_msg)
        <span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> os.path.exists(embedding_path):
            app.logger.error(<span class="hljs-string">f&quot;Embedding file not found: <span class="hljs-subst">{embedding_path}</span>&quot;</span>)
            NotFoundError(<span class="hljs-string">f&quot;Embedding file not found: <span class="hljs-subst">{embedding_path}</span>&quot;</span>)
        <span class="hljs-keyword">if</span> index_path <span class="hljs-keyword">is</span> <span class="hljs-keyword">not</span> <span class="hljs-literal">None</span>:
            <span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> index_path.endswith(<span class="hljs-string">&quot;.index&quot;</span>):
                app.logger.error(
                    <span class="hljs-string">f&quot;Parameter index_path must end with .index now is <span class="hljs-subst">{index_path}</span>&quot;</span>
                )
                ValidationError(
                    <span class="hljs-string">f&quot;Parameter index_path must end with .index now is <span class="hljs-subst">{index_path}</span>&quot;</span>
                )
            output_dir = os.path.dirname(index_path)
        <span class="hljs-keyword">else</span>:
            current_file = os.path.abspath(__file__)
            project_root = os.path.dirname(os.path.dirname(current_file))
            output_dir = os.path.join(project_root, <span class="hljs-string">&quot;output&quot;</span>, <span class="hljs-string">&quot;index&quot;</span>)
            index_path = os.path.join(output_dir, <span class="hljs-string">&quot;index.index&quot;</span>)
        <span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> overwrite <span class="hljs-keyword">and</span> os.path.exists(index_path):
            app.logger.info(<span class="hljs-string">&quot;Index already exists, skipping&quot;</span>)
        os.makedirs(output_dir, exist_ok=<span class="hljs-literal">True</span>)
        embedding = np.load(embedding_path)
        dim = embedding.shape[<span class="hljs-number">1</span>]
        vec_ids = np.arange(embedding.shape[<span class="hljs-number">0</span>]).astype(np.int64)
        <span class="hljs-comment"># with cpu</span>
        cpu_flat = faiss.IndexFlatIP(dim)
        cpu_index = faiss.IndexIDMap2(cpu_flat)
        <span class="hljs-comment"># chunk to write</span>
        total = embedding.shape[<span class="hljs-number">0</span>]
        <span class="hljs-keyword">for</span> start <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-number">0</span>, total, index_chunk_size):
            end = <span class="hljs-built_in">min</span>(start + index_chunk_size, total)
            cpu_index.add_with_ids(embedding[start:end], vec_ids[start:end])
        <span class="hljs-comment"># with gpu</span>
        <span class="hljs-keyword">if</span> <span class="hljs-variable language_">self</span>.faiss_use_gpu:
            co = faiss.GpuMultipleClonerOptions()
            co.shard = <span class="hljs-literal">True</span>
            co.useFloat16 = <span class="hljs-literal">True</span>
            <span class="hljs-keyword">try</span>:
                gpu_index = faiss.index_cpu_to_all_gpus(cpu_index, co)
                index = gpu_index
                app.logger.info(<span class="hljs-string">&quot;Using GPU for indexing with sharding&quot;</span>)
            <span class="hljs-keyword">except</span> RuntimeError <span class="hljs-keyword">as</span> e:
                app.logger.warning(<span class="hljs-string">f&quot;GPU indexing failed (<span class="hljs-subst">{e}</span>); fall back to CPU&quot;</span>)
                <span class="hljs-variable language_">self</span>.faiss_use_gpu = <span class="hljs-literal">False</span>
                index = cpu_index
        <span class="hljs-keyword">else</span>:
            index = cpu_index
        <span class="hljs-comment"># save</span>
        faiss.write_index(cpu_index, index_path)
        <span class="hljs-keyword">if</span> <span class="hljs-variable language_">self</span>.faiss_index <span class="hljs-keyword">is</span> <span class="hljs-literal">None</span>:
            <span class="hljs-variable language_">self</span>.faiss_index = index
        app.logger.info(<span class="hljs-string">&quot;Indexing success&quot;</span>)
    <span class="hljs-keyword">def</span> <span class="hljs-title function_">retriever_index_lancedb</span>(<span class="hljs-params">
        self,
        embedding_path: <span class="hljs-built_in">str</span>,
        lancedb_path: <span class="hljs-built_in">str</span>,
        table_name: <span class="hljs-built_in">str</span>,
        overwrite: <span class="hljs-built_in">bool</span> = <span class="hljs-literal">False</span>,
    </span>):
        <span class="hljs-string">&quot;&quot;&quot;
        Build a Faiss index from an embedding matrix.
        Args:
            embedding_path (str): .npy file of shape (N, dim), dtype float32.
            lancedb_path (str): directory path to store LanceDB tables.
            table_name (str): the name of the LanceDB table.
            overwrite (bool): overwrite existing index.
        &quot;&quot;&quot;</span>
        <span class="hljs-keyword">try</span>:
            <span class="hljs-keyword">import</span> lancedb
        <span class="hljs-keyword">except</span> ImportError:
            err_msg = <span class="hljs-string">&quot;lancedb is not installed. Please install it with `pip install lancedb`.&quot;</span>
            app.logger.error(err_msg)
            <span class="hljs-keyword">raise</span> ImportError(err_msg)
        <span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> os.path.exists(embedding_path):
            app.logger.error(<span class="hljs-string">f&quot;Embedding file not found: <span class="hljs-subst">{embedding_path}</span>&quot;</span>)
            NotFoundError(<span class="hljs-string">f&quot;Embedding file not found: <span class="hljs-subst">{embedding_path}</span>&quot;</span>)
        <span class="hljs-keyword">if</span> lancedb_path <span class="hljs-keyword">is</span> <span class="hljs-literal">None</span>:
            current_file = os.path.abspath(__file__)
            project_root = os.path.dirname(os.path.dirname(current_file))
            lancedb_path = os.path.join(project_root, <span class="hljs-string">&quot;output&quot;</span>, <span class="hljs-string">&quot;lancedb&quot;</span>)
        os.makedirs(lancedb_path, exist_ok=<span class="hljs-literal">True</span>)
        db = lancedb.connect(lancedb_path)
        <span class="hljs-keyword">if</span> table_name <span class="hljs-keyword">in</span> db.table_names() <span class="hljs-keyword">and</span> <span class="hljs-keyword">not</span> overwrite:
            info_msg = <span class="hljs-string">f&quot;LanceDB table &#x27;<span class="hljs-subst">{table_name}</span>&#x27; already exists, skipping&quot;</span>
            app.logger.info(info_msg)
            <span class="hljs-keyword">return</span> {<span class="hljs-string">&quot;status&quot;</span>: info_msg}
        <span class="hljs-keyword">elif</span> table_name <span class="hljs-keyword">in</span> db.table_names() <span class="hljs-keyword">and</span> overwrite:
            <span class="hljs-keyword">import</span> shutil
            shutil.rmtree(os.path.join(lancedb_path, table_name))
            app.logger.info(<span class="hljs-string">f&quot;Overwriting LanceDB table &#x27;<span class="hljs-subst">{table_name}</span>&#x27;&quot;</span>)
        embedding = np.load(embedding_path)
        ids = [<span class="hljs-built_in">str</span>(i) <span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-built_in">len</span>(embedding))]
        data = [{<span class="hljs-string">&quot;id&quot;</span>: i, <span class="hljs-string">&quot;vector&quot;</span>: v} <span class="hljs-keyword">for</span> i, v <span class="hljs-keyword">in</span> <span class="hljs-built_in">zip</span>(ids, embedding)]
        df = pd.DataFrame(data)
        db.create_table(table_name, data=df)
        app.logger.info(<span class="hljs-string">&quot;LanceDB indexing success&quot;</span>)
    <span class="hljs-comment"># Note: retriever_index_Milvus method has been removed</span>
    <span class="hljs-comment"># Collection creation and indexing is now handled by setup_Milvus_collection.py</span>
    <span class="hljs-comment"># This simplifies the retriever logic and separates concerns</span>
    <span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">retriever_search</span>(<span class="hljs-params">
        self,
        query_list: <span class="hljs-type">List</span>[<span class="hljs-built_in">str</span>],
        top_k: <span class="hljs-built_in">int</span> = <span class="hljs-number">5</span>,
        query_instruction: <span class="hljs-built_in">str</span> = <span class="hljs-string">&quot;&quot;</span>,
        use_openai: <span class="hljs-built_in">bool</span> = <span class="hljs-literal">False</span>,
    </span>) -&gt; <span class="hljs-type">Dict</span>[<span class="hljs-built_in">str</span>, <span class="hljs-type">List</span>[<span class="hljs-type">List</span>[<span class="hljs-built_in">str</span>]]]:
        <span class="hljs-keyword">if</span> <span class="hljs-built_in">isinstance</span>(query_list, <span class="hljs-built_in">str</span>):
            query_list = [query_list]
        queries = [<span class="hljs-string">f&quot;<span class="hljs-subst">{query_instruction}</span><span class="hljs-subst">{query}</span>&quot;</span> <span class="hljs-keyword">for</span> query <span class="hljs-keyword">in</span> query_list]
        <span class="hljs-keyword">if</span> use_openai:
            <span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">openai_embed</span>(<span class="hljs-params">texts</span>):
                embeddings = []
                <span class="hljs-keyword">for</span> text <span class="hljs-keyword">in</span> texts:
                    response = <span class="hljs-keyword">await</span> <span class="hljs-variable language_">self</span>.client.embeddings.create(
                        <span class="hljs-built_in">input</span>=text, model=<span class="hljs-variable language_">self</span>.openai_model
                    )
                    embeddings.append(response.data[<span class="hljs-number">0</span>].embedding)
                <span class="hljs-keyword">return</span> embeddings
            query_embedding = <span class="hljs-keyword">await</span> openai_embed(queries)
        <span class="hljs-keyword">else</span>:
            <span class="hljs-keyword">async</span> <span class="hljs-keyword">with</span> <span class="hljs-variable language_">self</span>.model:
                query_embedding, usage = <span class="hljs-keyword">await</span> <span class="hljs-variable language_">self</span>.model.embed(sentences=queries)
        query_embedding = np.array(query_embedding, dtype=np.float16)
        app.logger.info(<span class="hljs-string">&quot;query embedding finish&quot;</span>)
        scores, ids = <span class="hljs-variable language_">self</span>.faiss_index.search(query_embedding, top_k)
        rets = []
        <span class="hljs-keyword">for</span> i, query <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(query_list):
            cur_ret = []
            <span class="hljs-keyword">for</span> _, <span class="hljs-built_in">id</span> <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(ids[i]):
                cur_ret.append(<span class="hljs-variable language_">self</span>.contents[<span class="hljs-built_in">id</span>])
            rets.append(cur_ret)
        app.logger.debug(<span class="hljs-string">f&quot;ret_psg: <span class="hljs-subst">{rets}</span>&quot;</span>)
        <span class="hljs-keyword">return</span> {<span class="hljs-string">&quot;ret_psg&quot;</span>: rets}
    <span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">retriever_search_Milvus</span>(<span class="hljs-params">
        self,
        query_list: <span class="hljs-type">List</span>[<span class="hljs-built_in">str</span>],
        top_k: <span class="hljs-built_in">int</span> = <span class="hljs-number">5</span>,
        query_instruction: <span class="hljs-built_in">str</span> = <span class="hljs-string">&quot;&quot;</span>,
        use_openai: <span class="hljs-built_in">bool</span> = <span class="hljs-literal">False</span>,
    </span>) -&gt; <span class="hljs-type">Dict</span>[<span class="hljs-built_in">str</span>, <span class="hljs-type">List</span>[<span class="hljs-type">List</span>[<span class="hljs-built_in">str</span>]]]:
        <span class="hljs-string">&quot;&quot;&quot;
        Search in Milvus vector database.
        Args:
            query_list (List[str]): List of query strings
            top_k (int): Number of top results to return
            query_instruction (str): Instruction to prepend to queries
            use_openai (bool): Whether to use OpenAI for embedding
        Returns:
            Dict[str, List[List[str]]]: Search results
        &quot;&quot;&quot;</span>
        <span class="hljs-keyword">try</span>:
            <span class="hljs-keyword">from</span> pyMilvus <span class="hljs-keyword">import</span> connections, Collection
        <span class="hljs-keyword">except</span> ImportError:
            err_msg = <span class="hljs-string">&quot;pyMilvus is not installed. Please install it with `pip install pyMilvus`.&quot;</span>
            app.logger.error(err_msg)
            <span class="hljs-keyword">raise</span> ImportError(err_msg)
        <span class="hljs-keyword">if</span> <span class="hljs-built_in">isinstance</span>(query_list, <span class="hljs-built_in">str</span>):
            query_list = [query_list]
        queries = [<span class="hljs-string">f&quot;<span class="hljs-subst">{query_instruction}</span><span class="hljs-subst">{query}</span>&quot;</span> <span class="hljs-keyword">for</span> query <span class="hljs-keyword">in</span> query_list]
        <span class="hljs-comment"># Generate query embeddings</span>
        <span class="hljs-keyword">if</span> use_openai:
            <span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">openai_embed</span>(<span class="hljs-params">texts</span>):
                embeddings = []
                <span class="hljs-keyword">for</span> text <span class="hljs-keyword">in</span> texts:
                    response = <span class="hljs-keyword">await</span> <span class="hljs-variable language_">self</span>.client.embeddings.create(
                        <span class="hljs-built_in">input</span>=text, model=<span class="hljs-variable language_">self</span>.openai_model
                    )
                    embeddings.append(response.data[<span class="hljs-number">0</span>].embedding)
                <span class="hljs-keyword">return</span> embeddings
            query_embedding = <span class="hljs-keyword">await</span> openai_embed(queries)
        <span class="hljs-keyword">else</span>:
            <span class="hljs-comment"># Use Alibaba Cloud API for embeddings</span>
            <span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">alibaba_embed</span>(<span class="hljs-params">texts</span>):
                embeddings = []
                <span class="hljs-keyword">for</span> text <span class="hljs-keyword">in</span> texts:
                    response = <span class="hljs-keyword">await</span> <span class="hljs-variable language_">self</span>.alibaba_client.embeddings.create(
                        <span class="hljs-built_in">input</span>=text, model=<span class="hljs-variable language_">self</span>.alibaba_model
                    )
                    embeddings.append(response.data[<span class="hljs-number">0</span>].embedding)
                <span class="hljs-keyword">return</span> embeddings
            query_embedding = <span class="hljs-keyword">await</span> alibaba_embed(queries)
        query_embedding = np.array(query_embedding, dtype=np.float32)
        app.logger.info(<span class="hljs-string">&quot;Query embedding finished&quot;</span>)
        <span class="hljs-comment"># Ensure collection is loaded before search</span>
        <span class="hljs-keyword">try</span>:
            <span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> <span class="hljs-variable language_">self</span>.Milvus_collection.has_index():
                app.logger.warning(<span class="hljs-string">&quot;Collection has no index, search may be slow&quot;</span>)
            <span class="hljs-comment"># Always load collection before search to ensure it&#x27;s available</span>
            app.logger.debug(<span class="hljs-string">&quot;Loading collection for search...&quot;</span>)
            <span class="hljs-variable language_">self</span>.Milvus_collection.load()
            app.logger.debug(<span class="hljs-string">&quot;Collection loaded successfully&quot;</span>)
        <span class="hljs-keyword">except</span> Exception <span class="hljs-keyword">as</span> load_error:
            app.logger.error(<span class="hljs-string">f&quot;Failed to load collection: <span class="hljs-subst">{load_error}</span>&quot;</span>)
            <span class="hljs-keyword">return</span> {<span class="hljs-string">&quot;ret_psg&quot;</span>: [[]] * <span class="hljs-built_in">len</span>(query_list)}
        <span class="hljs-comment"># Search in Milvus</span>
        search_params = {
            <span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;IP&quot;</span>,
            <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;nprobe&quot;</span>: <span class="hljs-number">10</span>}
        }
        rets = []
        <span class="hljs-keyword">for</span> i, query_vec <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(query_embedding):
            <span class="hljs-keyword">try</span>:
                <span class="hljs-comment"># Perform search with proper error handling</span>
                results = <span class="hljs-variable language_">self</span>.Milvus_collection.search(
                    data=[query_vec.tolist()],
                    anns_field=<span class="hljs-string">&quot;embedding&quot;</span>,
                    param=search_params,
                    limit=top_k,
                    output_fields=[<span class="hljs-string">&quot;text&quot;</span>],
                    expr=<span class="hljs-literal">None</span>  <span class="hljs-comment"># Explicitly set no filter expression</span>
                )
                <span class="hljs-comment"># Extract results with null checks</span>
                cur_ret = []
                <span class="hljs-keyword">for</span> hit <span class="hljs-keyword">in</span> results[<span class="hljs-number">0</span>]:
                    text_content = hit.entity.get(<span class="hljs-string">&quot;text&quot;</span>)
                    <span class="hljs-keyword">if</span> text_content <span class="hljs-keyword">is</span> <span class="hljs-keyword">not</span> <span class="hljs-literal">None</span>:
                        cur_ret.append(text_content)
                    <span class="hljs-keyword">else</span>:
                        app.logger.warning(<span class="hljs-string">f&quot;Found null text content in search result&quot;</span>)
                rets.append(cur_ret)
            <span class="hljs-keyword">except</span> Exception <span class="hljs-keyword">as</span> e:
                app.logger.error(<span class="hljs-string">f&quot;Milvus search failed for query <span class="hljs-subst">{i}</span>: <span class="hljs-subst">{e}</span>&quot;</span>)
                <span class="hljs-comment"># Return empty result for failed query</span>
                rets.append([])
        app.logger.debug(<span class="hljs-string">f&quot;ret_psg: <span class="hljs-subst">{rets}</span>&quot;</span>)
        <span class="hljs-keyword">return</span> {<span class="hljs-string">&quot;ret_psg&quot;</span>: rets}
    <span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">retriever_search_lancedb</span>(<span class="hljs-params">
        self,
        query_list: <span class="hljs-type">List</span>[<span class="hljs-built_in">str</span>],
        top_k: <span class="hljs-type">Optional</span>[<span class="hljs-built_in">int</span>] | <span class="hljs-literal">None</span> = <span class="hljs-literal">None</span>,
        query_instruction: <span class="hljs-built_in">str</span> = <span class="hljs-string">&quot;&quot;</span>,
        use_openai: <span class="hljs-built_in">bool</span> = <span class="hljs-literal">False</span>,
        lancedb_path: <span class="hljs-built_in">str</span> = <span class="hljs-string">&quot;&quot;</span>,
        table_name: <span class="hljs-built_in">str</span> = <span class="hljs-string">&quot;&quot;</span>,
        filter_expr: <span class="hljs-type">Optional</span>[<span class="hljs-built_in">str</span>] = <span class="hljs-literal">None</span>,
    </span>) -&gt; <span class="hljs-type">Dict</span>[<span class="hljs-built_in">str</span>, <span class="hljs-type">List</span>[<span class="hljs-type">List</span>[<span class="hljs-built_in">str</span>]]]:
        <span class="hljs-keyword">try</span>:
            <span class="hljs-keyword">import</span> lancedb
        <span class="hljs-keyword">except</span> ImportError:
            err_msg = <span class="hljs-string">&quot;lancedb is not installed. Please install it with `pip install lancedb`.&quot;</span>
            app.logger.error(err_msg)
            <span class="hljs-keyword">raise</span> ImportError(err_msg)
        <span class="hljs-keyword">if</span> <span class="hljs-built_in">isinstance</span>(query_list, <span class="hljs-built_in">str</span>):
            query_list = [query_list]
        queries = [<span class="hljs-string">f&quot;<span class="hljs-subst">{query_instruction}</span><span class="hljs-subst">{query}</span>&quot;</span> <span class="hljs-keyword">for</span> query <span class="hljs-keyword">in</span> query_list]
        <span class="hljs-keyword">if</span> use_openai:
            <span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">openai_embed</span>(<span class="hljs-params">texts</span>):
                embeddings = []
                <span class="hljs-keyword">for</span> text <span class="hljs-keyword">in</span> texts:
                    response = <span class="hljs-keyword">await</span> <span class="hljs-variable language_">self</span>.client.embeddings.create(
                        <span class="hljs-built_in">input</span>=text, model=<span class="hljs-variable language_">self</span>.openai_model
                    )
                    embeddings.append(response.data[<span class="hljs-number">0</span>].embedding)
                <span class="hljs-keyword">return</span> embeddings
            query_embedding = <span class="hljs-keyword">await</span> openai_embed(queries)
        <span class="hljs-keyword">else</span>:
            <span class="hljs-keyword">async</span> <span class="hljs-keyword">with</span> <span class="hljs-variable language_">self</span>.model:
                query_embedding, usage = <span class="hljs-keyword">await</span> <span class="hljs-variable language_">self</span>.model.embed(sentences=queries)
        query_embedding = np.array(query_embedding, dtype=np.float16)
        app.logger.info(<span class="hljs-string">&quot;query embedding finish&quot;</span>)
        rets = []
        <span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> lancedb_path:
            NotFoundError(<span class="hljs-string">f&quot;`lancedb_path` must be provided.&quot;</span>)
        db = lancedb.connect(lancedb_path)
        <span class="hljs-variable language_">self</span>.lancedb_table = db.open_table(table_name)
        <span class="hljs-keyword">for</span> i, query_vec <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(query_embedding):
            q = <span class="hljs-variable language_">self</span>.lancedb_table.search(query_vec).limit(top_k)
            <span class="hljs-keyword">if</span> filter_expr:
                q = q.where(filter_expr)
            df = q.to_df()
            cur_ret = []
            <span class="hljs-keyword">for</span> id_str <span class="hljs-keyword">in</span> df[<span class="hljs-string">&quot;id&quot;</span>]:
                id_int = <span class="hljs-built_in">int</span>(id_str)
                cur_ret.append(<span class="hljs-variable language_">self</span>.contents[id_int])
            rets.append(cur_ret)
        app.logger.debug(<span class="hljs-string">f&quot;ret_psg: <span class="hljs-subst">{rets}</span>&quot;</span>)
        <span class="hljs-keyword">return</span> {<span class="hljs-string">&quot;ret_psg&quot;</span>: rets}
    <span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">retriever_deploy_service</span>(<span class="hljs-params">
        self,
        retriever_url: <span class="hljs-built_in">str</span>,
    </span>):
        <span class="hljs-comment"># Ensure URL is valid, adding &quot;http://&quot; prefix if necessary</span>
        retriever_url = retriever_url.strip()
        <span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> retriever_url.startswith(<span class="hljs-string">&quot;http://&quot;</span>) <span class="hljs-keyword">and</span> <span class="hljs-keyword">not</span> retriever_url.startswith(
            <span class="hljs-string">&quot;https://&quot;</span>
        ):
            retriever_url = <span class="hljs-string">f&quot;http://<span class="hljs-subst">{retriever_url}</span>&quot;</span>
        url_obj = urlparse(retriever_url)
        retriever_host = url_obj.hostname
        retriever_port = (
            url_obj.port <span class="hljs-keyword">if</span> url_obj.port <span class="hljs-keyword">else</span> <span class="hljs-number">8080</span>
        )  <span class="hljs-comment"># Default port if none provided</span>
<span class="hljs-meta">        @retriever_app.route(<span class="hljs-params"><span class="hljs-string">&quot;/search&quot;</span>, methods=[<span class="hljs-string">&quot;POST&quot;</span>]</span>)</span>
        <span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">deploy_retrieval_model</span>():
            data = request.get_json()
            query_list = data[<span class="hljs-string">&quot;query_list&quot;</span>]
            top_k = data[<span class="hljs-string">&quot;top_k&quot;</span>]
            <span class="hljs-keyword">async</span> <span class="hljs-keyword">with</span> <span class="hljs-variable language_">self</span>.model:
                query_embedding, _ = <span class="hljs-keyword">await</span> <span class="hljs-variable language_">self</span>.model.embed(sentences=query_list)
            query_embedding = np.array(query_embedding, dtype=np.float16)
            _, ids = <span class="hljs-variable language_">self</span>.faiss_index.search(query_embedding, top_k)
            rets = []
            <span class="hljs-keyword">for</span> i, _ <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(query_list):
                cur_ret = []
                <span class="hljs-keyword">for</span> _, <span class="hljs-built_in">id</span> <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(ids[i]):
                    cur_ret.append(<span class="hljs-variable language_">self</span>.contents[<span class="hljs-built_in">id</span>])
                rets.append(cur_ret)
            <span class="hljs-keyword">return</span> jsonify({<span class="hljs-string">&quot;ret_psg&quot;</span>: rets})
        retriever_app.run(host=retriever_host, port=retriever_port)
        app.logger.info(<span class="hljs-string">f&quot;employ embedding server at <span class="hljs-subst">{retriever_url}</span>&quot;</span>)
    <span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">retriever_deploy_search</span>(<span class="hljs-params">
        self,
        retriever_url: <span class="hljs-built_in">str</span>,
        query_list: <span class="hljs-type">List</span>[<span class="hljs-built_in">str</span>],
        top_k: <span class="hljs-type">Optional</span>[<span class="hljs-built_in">int</span>] | <span class="hljs-literal">None</span> = <span class="hljs-literal">None</span>,
        query_instruction: <span class="hljs-built_in">str</span> = <span class="hljs-string">&quot;&quot;</span>,
    </span>):
        <span class="hljs-comment"># Validate the URL format</span>
        url = retriever_url.strip()
        <span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> url.startswith(<span class="hljs-string">&quot;http://&quot;</span>) <span class="hljs-keyword">and</span> <span class="hljs-keyword">not</span> url.startswith(<span class="hljs-string">&quot;https://&quot;</span>):
            url = <span class="hljs-string">f&quot;http://<span class="hljs-subst">{url}</span>&quot;</span>
        url_obj = urlparse(url)
        api_url = urlunparse(url_obj._replace(path=<span class="hljs-string">&quot;/search&quot;</span>))
        app.logger.info(<span class="hljs-string">f&quot;Calling url: <span class="hljs-subst">{api_url}</span>&quot;</span>)
        <span class="hljs-keyword">if</span> <span class="hljs-built_in">isinstance</span>(query_list, <span class="hljs-built_in">str</span>):
            query_list = [query_list]
        query_list = [<span class="hljs-string">f&quot;<span class="hljs-subst">{query_instruction}</span><span class="hljs-subst">{query}</span>&quot;</span> <span class="hljs-keyword">for</span> query <span class="hljs-keyword">in</span> query_list]
        payload = {<span class="hljs-string">&quot;query_list&quot;</span>: query_list}
        <span class="hljs-keyword">if</span> top_k <span class="hljs-keyword">is</span> <span class="hljs-keyword">not</span> <span class="hljs-literal">None</span>:
            payload[<span class="hljs-string">&quot;top_k&quot;</span>] = top_k
        <span class="hljs-keyword">async</span> <span class="hljs-keyword">with</span> aiohttp.ClientSession() <span class="hljs-keyword">as</span> session:
            <span class="hljs-keyword">async</span> <span class="hljs-keyword">with</span> session.post(
                api_url,
                json=payload,
            ) <span class="hljs-keyword">as</span> response:
                <span class="hljs-keyword">if</span> response.status == <span class="hljs-number">200</span>:
                    response_data = <span class="hljs-keyword">await</span> response.json()
                    app.logger.debug(
                        <span class="hljs-string">f&quot;status_code: <span class="hljs-subst">{response.status}</span>, response data: <span class="hljs-subst">{response_data}</span>&quot;</span>
                    )
                    <span class="hljs-keyword">return</span> response_data
                <span class="hljs-keyword">else</span>:
                    err_msg = (
                        <span class="hljs-string">f&quot;Failed to call <span class="hljs-subst">{retriever_url}</span> with code <span class="hljs-subst">{response.status}</span>&quot;</span>
                    )
                    app.logger.error(err_msg)
                    <span class="hljs-keyword">raise</span> ToolError(err_msg)
    <span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">retriever_exa_search</span>(<span class="hljs-params">
        self,
        query_list: <span class="hljs-type">List</span>[<span class="hljs-built_in">str</span>],
        top_k: <span class="hljs-type">Optional</span>[<span class="hljs-built_in">int</span>] | <span class="hljs-literal">None</span> = <span class="hljs-literal">None</span>,
    </span>) -&gt; <span class="hljs-built_in">dict</span>[<span class="hljs-built_in">str</span>, <span class="hljs-type">List</span>[<span class="hljs-type">List</span>[<span class="hljs-built_in">str</span>]]]:
        <span class="hljs-keyword">try</span>:
            <span class="hljs-keyword">from</span> exa_py <span class="hljs-keyword">import</span> AsyncExa
            <span class="hljs-keyword">from</span> exa_py.api <span class="hljs-keyword">import</span> Result
        <span class="hljs-keyword">except</span> ImportError:
            err_msg = (
                <span class="hljs-string">&quot;exa_py is not installed. Please install it with `pip install exa_py`.&quot;</span>
            )
            app.logger.error(err_msg)
            <span class="hljs-keyword">raise</span> ImportError(err_msg)
        exa_api_key = os.environ.get(<span class="hljs-string">&quot;EXA_API_KEY&quot;</span>, <span class="hljs-string">&quot;&quot;</span>)
        exa = AsyncExa(api_key=exa_api_key <span class="hljs-keyword">if</span> exa_api_key <span class="hljs-keyword">else</span> <span class="hljs-string">&quot;EMPTY&quot;</span>)
        sem = asyncio.Semaphore(<span class="hljs-number">16</span>)
        <span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">call_with_retry</span>(<span class="hljs-params">
            idx: <span class="hljs-built_in">int</span>, q: <span class="hljs-built_in">str</span>, retries: <span class="hljs-built_in">int</span> = <span class="hljs-number">3</span>, delay: <span class="hljs-built_in">float</span> = <span class="hljs-number">1.0</span>
        </span>):
            <span class="hljs-keyword">async</span> <span class="hljs-keyword">with</span> sem:
                <span class="hljs-keyword">for</span> attempt <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(retries):
                    <span class="hljs-keyword">try</span>:
                        resp = <span class="hljs-keyword">await</span> exa.search_and_contents(
                            q,
                            num_results=top_k,
                            text=<span class="hljs-literal">True</span>,
                        )
                        results: <span class="hljs-type">List</span>[Result] = <span class="hljs-built_in">getattr</span>(resp, <span class="hljs-string">&quot;results&quot;</span>, []) <span class="hljs-keyword">or</span> []
                        psg_ls: <span class="hljs-type">List</span>[<span class="hljs-built_in">str</span>] = [(r.text <span class="hljs-keyword">or</span> <span class="hljs-string">&quot;&quot;</span>) <span class="hljs-keyword">for</span> r <span class="hljs-keyword">in</span> results]
                        <span class="hljs-keyword">return</span> idx, psg_ls
                    <span class="hljs-keyword">except</span> Exception <span class="hljs-keyword">as</span> e:
                        status = <span class="hljs-built_in">getattr</span>(
                            <span class="hljs-built_in">getattr</span>(e, <span class="hljs-string">&quot;response&quot;</span>, <span class="hljs-literal">None</span>), <span class="hljs-string">&quot;status_code&quot;</span>, <span class="hljs-literal">None</span>
                        )
                        <span class="hljs-keyword">if</span> status == <span class="hljs-number">401</span> <span class="hljs-keyword">or</span> <span class="hljs-string">&quot;401&quot;</span> <span class="hljs-keyword">in</span> <span class="hljs-built_in">str</span>(e):
                            <span class="hljs-keyword">raise</span> RuntimeError(
                                <span class="hljs-string">&quot;Unauthorized (401): Access denied by Exa API. &quot;</span>
                                <span class="hljs-string">&quot;Invalid or missing EXA_API_KEY.&quot;</span>
                            ) <span class="hljs-keyword">from</span> e
                        app.logger.warning(
                            <span class="hljs-string">f&quot;[Retry <span class="hljs-subst">{attempt+<span class="hljs-number">1</span>}</span>] EXA failed (idx=<span class="hljs-subst">{idx}</span>): <span class="hljs-subst">{e}</span>&quot;</span>
                        )
                        <span class="hljs-keyword">await</span> asyncio.sleep(delay)
                <span class="hljs-keyword">return</span> idx, []
        tasks = [
            asyncio.create_task(call_with_retry(i, q)) <span class="hljs-keyword">for</span> i, q <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(query_list)
        ]
        ret: <span class="hljs-type">List</span>[<span class="hljs-type">List</span>[<span class="hljs-built_in">str</span>]] = [<span class="hljs-literal">None</span>] * <span class="hljs-built_in">len</span>(query_list)
        iterator = tqdm(
            asyncio.as_completed(tasks), total=<span class="hljs-built_in">len</span>(tasks), desc=<span class="hljs-string">&quot;EXA Searching: &quot;</span>
        )
        <span class="hljs-keyword">for</span> fut <span class="hljs-keyword">in</span> iterator:
            idx, psg_ls = <span class="hljs-keyword">await</span> fut
            ret[idx] = psg_ls
        <span class="hljs-keyword">return</span> {<span class="hljs-string">&quot;ret_psg&quot;</span>: ret}
    <span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">retriever_tavily_search</span>(<span class="hljs-params">
        self,
        query_list: <span class="hljs-type">List</span>[<span class="hljs-built_in">str</span>],
        top_k: <span class="hljs-type">Optional</span>[<span class="hljs-built_in">int</span>] | <span class="hljs-literal">None</span> = <span class="hljs-literal">None</span>,
    </span>) -&gt; <span class="hljs-built_in">dict</span>[<span class="hljs-built_in">str</span>, <span class="hljs-type">List</span>[<span class="hljs-type">List</span>[<span class="hljs-built_in">str</span>]]]:
        <span class="hljs-keyword">try</span>:
            <span class="hljs-keyword">from</span> tavily <span class="hljs-keyword">import</span> (
                AsyncTavilyClient,
                BadRequestError,
                UsageLimitExceededError,
                InvalidAPIKeyError,
                MissingAPIKeyError,
            )
        <span class="hljs-keyword">except</span> ImportError:
            err_msg = <span class="hljs-string">&quot;tavily is not installed. Please install it with `pip install tavily-python`.&quot;</span>
            app.logger.error(err_msg)
            <span class="hljs-keyword">raise</span> ImportError(err_msg)
        tavily_api_key = os.environ.get(<span class="hljs-string">&quot;TAVILY_API_KEY&quot;</span>, <span class="hljs-string">&quot;&quot;</span>)
        <span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> tavily_api_key:
            <span class="hljs-keyword">raise</span> MissingAPIKeyError(
                <span class="hljs-string">&quot;TAVILY_API_KEY environment variable is not set. Please set it to use Tavily.&quot;</span>
            )
        tavily = AsyncTavilyClient(api_key=tavily_api_key)
        sem = asyncio.Semaphore(<span class="hljs-number">16</span>)
        <span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">call_with_retry</span>(<span class="hljs-params">
            idx: <span class="hljs-built_in">int</span>, q: <span class="hljs-built_in">str</span>, retries: <span class="hljs-built_in">int</span> = <span class="hljs-number">3</span>, delay: <span class="hljs-built_in">float</span> = <span class="hljs-number">1.0</span>
        </span>):
            <span class="hljs-keyword">async</span> <span class="hljs-keyword">with</span> sem:
                <span class="hljs-keyword">for</span> attempt <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(retries):
                    <span class="hljs-keyword">try</span>:
                        resp = <span class="hljs-keyword">await</span> tavily.search(
                            query=q,
                            max_results=top_k,
                        )
                        results: <span class="hljs-type">List</span>[<span class="hljs-type">Dict</span>[<span class="hljs-built_in">str</span>, <span class="hljs-type">Any</span>]] = resp[<span class="hljs-string">&quot;results&quot;</span>]
                        psg_ls: <span class="hljs-type">List</span>[<span class="hljs-built_in">str</span>] = [(r[<span class="hljs-string">&quot;content&quot;</span>] <span class="hljs-keyword">or</span> <span class="hljs-string">&quot;&quot;</span>) <span class="hljs-keyword">for</span> r <span class="hljs-keyword">in</span> results]
                        <span class="hljs-keyword">return</span> idx, psg_ls
                    <span class="hljs-keyword">except</span> UsageLimitExceededError <span class="hljs-keyword">as</span> e:
                        app.logger.error(<span class="hljs-string">f&quot;Usage limit exceeded: <span class="hljs-subst">{e}</span>&quot;</span>)
                        <span class="hljs-keyword">raise</span> ToolError(<span class="hljs-string">f&quot;Usage limit exceeded: <span class="hljs-subst">{e}</span>&quot;</span>) <span class="hljs-keyword">from</span> e
                    <span class="hljs-keyword">except</span> InvalidAPIKeyError <span class="hljs-keyword">as</span> e:
                        app.logger.error(<span class="hljs-string">f&quot;Invalid API key: <span class="hljs-subst">{e}</span>&quot;</span>)
                        <span class="hljs-keyword">raise</span> ToolError(<span class="hljs-string">f&quot;Invalid API key: <span class="hljs-subst">{e}</span>&quot;</span>) <span class="hljs-keyword">from</span> e
                    <span class="hljs-keyword">except</span> (BadRequestError, Exception) <span class="hljs-keyword">as</span> e:
                        app.logger.warning(
                            <span class="hljs-string">f&quot;[Retry <span class="hljs-subst">{attempt+<span class="hljs-number">1</span>}</span>] Tavily failed (idx=<span class="hljs-subst">{idx}</span>): <span class="hljs-subst">{e}</span>&quot;</span>
                        )
                        <span class="hljs-keyword">await</span> asyncio.sleep(delay)
                <span class="hljs-keyword">return</span> idx, []
        tasks = [
            asyncio.create_task(call_with_retry(i, q)) <span class="hljs-keyword">for</span> i, q <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(query_list)
        ]
        ret: <span class="hljs-type">List</span>[<span class="hljs-type">List</span>[<span class="hljs-built_in">str</span>]] = [<span class="hljs-literal">None</span>] * <span class="hljs-built_in">len</span>(query_list)
        iterator = tqdm(
            asyncio.as_completed(tasks), total=<span class="hljs-built_in">len</span>(tasks), desc=<span class="hljs-string">&quot;Tavily Searching: &quot;</span>
        )
        <span class="hljs-keyword">for</span> fut <span class="hljs-keyword">in</span> iterator:
            idx, psg_ls = <span class="hljs-keyword">await</span> fut
            ret[idx] = psg_ls
        <span class="hljs-keyword">return</span> {<span class="hljs-string">&quot;ret_psg&quot;</span>: ret}
<span class="hljs-keyword">if</span> __name__ == <span class="hljs-string">&quot;__main__&quot;</span>:
    Retriever(app)
    app.run(transport=<span class="hljs-string">&quot;stdio&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p><strong>Define the Parameter Configuration File</strong></p>
<p>Note: This file specifies all parameter settings used in the pipeline.</p>
<pre><code translate="no">vim parameter.yaml
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no"><span class="hljs-comment"># servers/retriever/parameter.yaml</span>
retriever_path: openbmb/MiniCPM-Embedding-Light
corpus_path: UltraRAG/data/Milvus_faq_corpus.jsonl
embedding_path: embedding/embedding.npy
index_path: index/index.index
<span class="hljs-comment"># infinify_emb config</span>
infinity_kwargs:
  bettertransformer: <span class="hljs-literal">false</span>
  pooling_method: auto
  device: cuda
  batch_size: 1024
cuda_devices: <span class="hljs-string">&quot;0,1&quot;</span>
query_instruction: <span class="hljs-string">&quot;Query: &quot;</span>
faiss_use_gpu: True
top_k: 5
overwrite: <span class="hljs-literal">false</span>
retriever_url: http://localhost:8080
index_chunk_size: 50000
<span class="hljs-comment"># OpenAI API configuration (if used)</span>
use_openai: <span class="hljs-literal">false</span>
openai_model: <span class="hljs-string">&quot;embedding&quot;</span>
api_base: <span class="hljs-string">&quot;&quot;</span>
api_key: <span class="hljs-string">&quot;&quot;</span>
<span class="hljs-comment"># Alibaba Cloud API configuration (alternative to local embedding)</span>
use_alibaba_cloud: <span class="hljs-literal">true</span>
alibaba_api_key: <span class="hljs-string">&quot;sk-xxxxxxx&quot;</span> <span class="hljs-comment"># Your Alibaba Cloud API key</span>
alibaba_model: <span class="hljs-string">&quot;embedding&quot;</span> <span class="hljs-comment"># Alibaba Cloud embedding model</span>
alibaba_endpoint: <span class="hljs-string">&quot;https://dashscope.aliyuncs.com/compatible-mode/v1&quot;</span> <span class="hljs-comment"># Alibaba Cloud endpoint</span>
<span class="hljs-comment"># LanceDB configuration (if used)</span>
lancedb_path: <span class="hljs-string">&quot;lancedb/&quot;</span>
table_name: <span class="hljs-string">&quot;vector_index&quot;</span>
filter_expr: null
<span class="hljs-comment"># Milvus configuration (if used)</span>
use_Milvus: <span class="hljs-literal">true</span>
Milvus_host: <span class="hljs-string">&quot;192.168.8.130&quot;</span>
Milvus_port: 19530
collection_name: <span class="hljs-string">&quot;ultrarag_collection_v3&quot;</span>
embedding_dim: 1024
<button class="copy-code-btn"></button></code></pre>
<p><strong>Define the Server Configuration File</strong></p>
<p>Note: This configuration includes integration with Alibaba Cloud APIs.</p>
<pre><code translate="no">vim rag_Milvus_faq_server.yaml
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">benchmark:
  parameter: /root/ultraRAG/UltraRAG/servers/benchmark/parameter.yaml
  path: /root/ultraRAG/UltraRAG/servers/benchmark/src/benchmark.py
  tools:
    get_data:
      input:
        benchmark: <span class="hljs-variable">$benchmark</span>
      output:
      - q_ls
      - gt_ls
custom:
  parameter: /root/ultraRAG/UltraRAG/servers/custom/parameter.yaml
  path: /root/ultraRAG/UltraRAG/servers/custom/src/custom.py
  tools:
    output_extract_from_boxed:
      input:
        ans_ls: ans_ls
      output:
      - pred_ls
evaluation:
  parameter: /root/ultraRAG/UltraRAG/servers/evaluation/parameter.yaml
  path: /root/ultraRAG/UltraRAG/servers/evaluation/src/evaluation.py
  tools:
    evaluate:
      input:
        gt_ls: gt_ls
        metrics: <span class="hljs-variable">$metrics</span>
        pred_ls: pred_ls
        save_path: <span class="hljs-variable">$save_path</span>
      output:
      - eval_res
generation:
  parameter: /root/ultraRAG/UltraRAG/servers/generation/parameter.yaml
  path: /root/ultraRAG/UltraRAG/servers/generation/src/generation.py
  tools:
    generate:
      input:
        base_url: <span class="hljs-variable">$base_url</span>
        model_name: <span class="hljs-variable">$model_name</span>
        prompt_ls: prompt_ls
        sampling_params: <span class="hljs-variable">$sampling_params</span>
        api_key: <span class="hljs-variable">$api_key</span>
      output:
      - ans_ls
prompt:
  parameter: /root/ultraRAG/UltraRAG/servers/prompt/parameter.yaml
  path: /root/ultraRAG/UltraRAG/servers/prompt/src/prompt.py
  prompts:
    qa_rag_boxed:
      input:
        q_ls: q_ls
        ret_psg: ret_psg
        template: <span class="hljs-variable">$template</span>
      output:
      - prompt_ls
retriever:
  parameter: /root/ultraRAG/UltraRAG/servers/retriever/parameter.yaml
  path: /root/ultraRAG/UltraRAG/servers/retriever/src/retriever.py
  tools:
    retriever_init_Milvus:
      input:
        collection_name: <span class="hljs-variable">$collection_name</span>
        corpus_path: <span class="hljs-variable">$corpus_path</span>
        embedding_dim: <span class="hljs-variable">$embedding_dim</span>
        Milvus_host: <span class="hljs-variable">$Milvus_host</span>
        Milvus_port: <span class="hljs-variable">$Milvus_port</span>
    retriever_search_Milvus:
      input:
        query_instruction: <span class="hljs-variable">$query_instruction</span>
        query_list: q_ls
        top_k: <span class="hljs-variable">$top_k</span>
        use_openai: <span class="hljs-variable">$use_openai</span>
      output:
      - ret_psg
<button class="copy-code-btn"></button></code></pre>
<p><strong>Define the</strong> <strong>Build Index</strong></p>
<p>Note: Convert the document corpus into vector embeddings and store them in Milvus. Configure the key indexing parameters needed for this process.</p>
<pre><code translate="no">vim Milvus_index_parameter.yaml
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">retriever:
  alibaba_api_key: sk-xxxxxxx
  alibaba_endpoint: https://dashscope.aliyuncs.com/compatible-mode/v1
  alibaba_model: text-embedding-v3
  collection_name: ultrarag_collection_v3
  corpus_path: data/corpus_example.jsonl
  embedding_dim: 1024
  embedding_path: embedding/embedding.npy
  Milvus_host: 192.168.8.130
  Milvus_port: 19530
  overwrite: <span class="hljs-literal">false</span>
  use_alibaba_cloud: <span class="hljs-literal">true</span>
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">vim mivus_index.yaml
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no"><span class="hljs-comment"># Milvus Index Building Configuration</span>
<span class="hljs-comment"># Build vector index using Milvus database</span>
<span class="hljs-comment"># Note: This configuration is now deprecated. Use setup_Milvus_collection.py instead.</span>
<span class="hljs-comment"># MCP Server</span>
servers:
  retriever: servers/retriever
<span class="hljs-comment"># Parameter Configuration</span>
parameter_config: examples/parameter/Milvus_index_parameter.yaml
<span class="hljs-comment"># MCP Client Pipeline</span>
<span class="hljs-comment"># Updated pipeline for new architecture</span>
pipeline:
  - retriever.retriever_init_Milvus    <span class="hljs-comment"># Connect to existing Milvus collection</span>
  - retriever.retriever_embed          <span class="hljs-comment"># Generate embeddings (if needed)</span>
  <span class="hljs-comment"># Note: Index building is now handled by setup_Milvus_collection.py</span>
  <span class="hljs-comment"># The collection ultrarag_collection_v3 should already exist with proper indexing</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>Run RAG</strong></p>
<p>Runs the full RAG workflow including retrieval, answer generation, and evaluation. Configure the key indexing parameters needed for this process.</p>
<pre><code translate="no">vim rag_Milvus_faq_server
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">benchmark:
  parameter: /root/ultraRAG/UltraRAG/servers/benchmark/parameter.yaml
  path: /root/ultraRAG/UltraRAG/servers/benchmark/src/benchmark.py
  tools:
    get_data:
      input:
        benchmark: <span class="hljs-variable">$benchmark</span>
      output:
      - q_ls
      - gt_ls
custom:
  parameter: /root/ultraRAG/UltraRAG/servers/custom/parameter.yaml
  path: /root/ultraRAG/UltraRAG/servers/custom/src/custom.py
  tools:
    output_extract_from_boxed:
      input:
        ans_ls: ans_ls
      output:
      - pred_ls
evaluation:
  parameter: /root/ultraRAG/UltraRAG/servers/evaluation/parameter.yaml
  path: /root/ultraRAG/UltraRAG/servers/evaluation/src/evaluation.py
  tools:
    evaluate:
      input:
        gt_ls: gt_ls
        metrics: <span class="hljs-variable">$metrics</span>
        pred_ls: pred_ls
        save_path: <span class="hljs-variable">$save_path</span>
      output:
      - eval_res
generation:
  parameter: /root/ultraRAG/UltraRAG/servers/generation/parameter.yaml
  path: /root/ultraRAG/UltraRAG/servers/generation/src/generation.py
  tools:
    generate:
      input:
        base_url: <span class="hljs-variable">$base_url</span>
        model_name: <span class="hljs-variable">$model_name</span>
        prompt_ls: prompt_ls
        sampling_params: <span class="hljs-variable">$sampling_params</span>
        api_key: <span class="hljs-variable">$api_key</span>
      output:
      - ans_ls
prompt:
  parameter: /root/ultraRAG/UltraRAG/servers/prompt/parameter.yaml
  path: /root/ultraRAG/UltraRAG/servers/prompt/src/prompt.py
  prompts:
    qa_rag_boxed:
      input:
        q_ls: q_ls
        ret_psg: ret_psg
        template: <span class="hljs-variable">$template</span>
      output:
      - prompt_ls
retriever:
  parameter: /root/ultraRAG/UltraRAG/servers/retriever/parameter.yaml
  path: /root/ultraRAG/UltraRAG/servers/retriever/src/retriever.py
  tools:
    retriever_init_Milvus:
      input:
        collection_name: <span class="hljs-variable">$collection_name</span>
        corpus_path: <span class="hljs-variable">$corpus_path</span>
        embedding_dim: <span class="hljs-variable">$embedding_dim</span>
        Milvus_host: <span class="hljs-variable">$Milvus_host</span>
        Milvus_port: <span class="hljs-variable">$Milvus_port</span>
    retriever_search_Milvus:
      input:
        query_instruction: <span class="hljs-variable">$query_instruction</span>
        query_list: q_ls
        top_k: <span class="hljs-variable">$top_k</span>
        use_openai: <span class="hljs-variable">$use_openai</span>
      output:
      - ret_psg
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">vim rag_Milvus_faq.yaml
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no"><span class="hljs-comment"># Milvus RAG FAQ Demo</span>
<span class="hljs-comment"># Complete RAG pipeline using Milvus vector database with FAQ dataset</span>
<span class="hljs-comment"># MCP Server Configuration</span>
servers:
  benchmark: UltraRAG/servers/benchmark
  retriever: UltraRAG/servers/retriever
  prompt: UltraRAG/servers/prompt
  generation: UltraRAG/servers/generation
  evaluation: UltraRAG/servers/evaluation
  custom: UltraRAG/servers/custom
<span class="hljs-comment"># Parameter Configuration</span>
parameter_config: examples/parameter/rag_Milvus_faq_parameter.yaml
<span class="hljs-comment"># MCP Client Pipeline</span>
<span class="hljs-comment"># Sequential execution: data -&gt; init -&gt; search -&gt; prompt -&gt; generate -&gt; extract -&gt; evaluate</span>
pipeline:
- benchmark.get_data
- retriever.retriever_init_Milvus
- retriever.retriever_search_Milvus
- prompt.qa_rag_boxed
- generation.generate
- custom.output_extract_from_boxed
- evaluation.evaluate
<button class="copy-code-btn"></button></code></pre>
<p><strong>Run the Build Index</strong></p>
<p>Note: After a successful run, the system generates the vector embeddings and index files. The RAG pipeline can then use these directly to perform retrieval.</p>
<pre><code translate="no">ultrarag build examples/Milvus_index.yaml
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Blog_Howto_Builda_RAG_Pipelinewith_Ultra_RA_Gv2and_Mi_5_b440bef3d5.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<pre><code translate="no">ultrarag run examples/Milvus_index.yaml
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Blog_Howto_Builda_RAG_Pipelinewith_Ultra_RA_Gv2and_Mi_7_6066145908.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Run the RAG Query</strong></p>
<p>Note: Build and execute the full RAG pipeline end to end.</p>
<pre><code translate="no">ultrarag build examples/rag_Milvus.yaml
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Blog_Howto_Builda_RAG_Pipelinewith_Ultra_RA_Gv2and_Mi_6_0ee79592a0.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<pre><code translate="no">ultrarag run examples/rag_Milvus.yaml
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Blog_Howto_Builda_RAG_Pipelinewith_Ultra_RA_Gv2and_Mi_4_52b89f938a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Blog_Howto_Builda_RAG_Pipelinewith_Ultra_RA_Gv2and_Mi_2_758a9ae6b8.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
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
    </button></h2><p>Building a traditional RAG pipeline often means writing hundreds or even thousands of lines of code. UltraRAG v2 takes a very different approach. With its MCP-based modular design, declarative YAML configuration, and lightweight orchestration model, you can build the same end-to-end pipeline in just a few dozen lines. Furthermore, YAML is used to describe the steps of the workflow. You don’t actually need to write real code. This makes it much easier to bring enterprise-level RAG into real-world applications.</p>
<p>Integrating Milvus into this workflow adds another advantage: a high-performance, production-ready vector database that’s designed specifically for scalable semantic retrieval. Together, Milvus and UltraRAG v2 make it far easier to prototype quickly, iterate confidently, and deploy RAG systems that can handle real workloads.</p>
<p><strong>Ready to simplify your RAG development?</strong> Try UltraRAG v2 with Milvus. Explore the example pipeline, run it yourself, and build a complete RAG workflow with just a few lines of configuration.</p>
<p>If you have any questions, join our <a href="https://milvusio.slack.com/join/shared_invite/zt-3nntzngkz-gYwhrdSE4~76k0VMyBfD1Q#/shared-invite/email">Slack channel</a> or book a 20-minute <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">Milvus Office Hours</a> session to discuss your use case.</p>
