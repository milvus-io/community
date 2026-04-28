---
id: build-production-chatbot-with-kimi-k2-and-milvus.md
title: |
  Build a Production-Grade Chatbot with Kimi K2 and Milvus
author: Lumina Wang
date: 2025-07-25T00:00:00.000Z
cover: assets.zilliz.com/Chat_GPT_Image_Jul_26_2025_06_40_46_PM_a262e721ae.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'vector database, mcp, AI Agents, LLM, Kimi'
meta_keywords: 'Kimi K2, Milvus, AI agents, semantic search, tool calling'
meta_title: |
  Build a Production-Grade Chatbot with Kimi K2 and Milvus
desc: >-
  Explore how Kimi K2 and Milvus create a production AI agent for automatic file
  processing, semantic search, and intelligent Q&A in real-world tasks.
origin: 'https://milvus.io/blog/build-production-chatbot-with-kimi-k2-and-milvus.md'
---
<p><a href="https://moonshotai.github.io/Kimi-K2/">Kimi K2</a> has been making waves lately—and for good reason. Hugging Face co-founders and other industry leaders have praised it as an open-source model that performs on par with top closed models, such as GPT-4 and Claude, in many areas.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/huggingface_leader_twitter_b96c9d3f21.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Two breakthrough advantages set Kimi K2 apart:</strong></p>
<ul>
<li><p><strong>State-of-the-art performance</strong>: K2 achieves top results on key benchmarks, such as AIME2025, and consistently outperforms models like Grok-4 across most dimensions.</p></li>
<li><p><strong>Robust agent capabilities</strong>: K2 doesn’t just call tools—it knows when to use them, how to switch between them mid-task, and when to stop using them. That opens up serious real-world use cases.</p></li>
</ul>
<p>User testing shows that Kimi K2’s coding abilities are already comparable to Claude 4—at about 20% of the cost. More importantly, it supports <strong>autonomous task planning and tool usage</strong>. You define available tools, and K2 handles when and how to use them—no fine-tuning or orchestration layer required.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Kimi_k2_performance_550ffd5c61.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>It also supports OpenAI and Anthropic-compatible APIs, allowing anything built for those ecosystems—such as Claude Code—to be integrated with Kimi K2 directly. It’s clear that Moonshot AI is targeting agent workloads.</p>
<p>In this tutorial, I’ll show how to build a <strong>production-grade chatbot using Kimi K2 and Milvus.</strong> The chatbot will be able to upload files, run intelligent Q&amp;A, and manage data through vector search, eliminating the need for manual chunking, embedding scripts, or fine-tuning.</p>
<h2 id="What-We’ll-Build" class="common-anchor-header">What We’ll Build<button data-href="#What-We’ll-Build" class="anchor-icon" translate="no">
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
    </button></h2><p>We’re building an intelligent chatbot by combining Kimi K2’s reasoning capabilities with Milvus’s vector database performance. The system handles three core workflows that engineers actually need:</p>
<ol>
<li><p><strong>Automatic file processing and chunking</strong> - Upload documents in various formats and let the system intelligently break them into searchable chunks</p></li>
<li><p><strong>Semantic search</strong> - Find relevant information using natural language queries, not keyword matching</p></li>
<li><p><strong>Intelligent decision-making</strong> - The assistant understands context and automatically chooses the right tools for each task</p></li>
</ol>
<p>The entire system is built around just two main classes, making it easy to understand, modify, and extend:</p>
<ul>
<li><p><strong>VectorDatabase class</strong>: This is your data processing workhorse. It handles everything related to the Milvus vector database—from connecting and creating collections to chunking files and running similarity searches.</p></li>
<li><p><strong>SmartAssistant class</strong>: Think of this as the system’s brain. It understands what users want and determines which tools to use to get the job done.</p></li>
</ul>
<p>Here’s how it works in practice: users chat with the SmartAssistant using natural language. The assistant leverages Kimi K2’s reasoning capabilities to break down requests, then orchestrates 7 specialized tool functions to interact with the Milvus vector database. It’s like having a smart coordinator that knows exactly which database operations to run based on what you’re asking for.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/chatbot_architecture_ea73cac6ca.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Prerequisites-and-Setup" class="common-anchor-header">Prerequisites and Setup<button data-href="#Prerequisites-and-Setup" class="anchor-icon" translate="no">
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
    </button></h2><p>Before diving into the code, ensure you have the following ready:</p>
<p><strong>System Requirements:</strong></p>
<ul>
<li><p>Python 3.8 or higher</p></li>
<li><p>Milvus server (we’ll use the local instance on port 19530)</p></li>
<li><p>At least 4GB RAM for processing documents</p></li>
</ul>
<p><strong>API Keys Required:</strong></p>
<ul>
<li><p>Kimi API key from <a href="https://platform.moonshot.cn/">Moonshot AI</a></p></li>
<li><p>OpenAI API key for text embeddings (we’ll use the text-embedding-3-small model)</p></li>
</ul>
<p><strong>Quick Installation:</strong></p>
<pre><code translate="no">pip install pymilvus openai numpy
<button class="copy-code-btn"></button></code></pre>
<p><strong>Start Milvus locally:</strong></p>
<pre><code translate="no"><span class="hljs-comment"># Using Docker (recommended)</span>
docker run -d --name milvus -p <span class="hljs-number">19530</span>:<span class="hljs-number">19530</span> milvusdb/milvus:latest

<span class="hljs-comment"># Or download and run the standalone version from milvus.io</span>
<button class="copy-code-btn"></button></code></pre>
<h2 id="Import-Libraries-and-Basic-Configuration" class="common-anchor-header">Import Libraries and Basic Configuration<button data-href="#Import-Libraries-and-Basic-Configuration" class="anchor-icon" translate="no">
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
    </button></h2><p>Here, pymilvus is the library for Milvus vector database operations, and openai is used to call Kimi and OpenAI APIs (the benefit of Kimi K2’s API compatibility with OpenAI and Anthropic is evident here).</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> json
<span class="hljs-keyword">import</span> numpy <span class="hljs-keyword">as</span> np
<span class="hljs-keyword">from</span> typing <span class="hljs-keyword">import</span> <span class="hljs-type">List</span>, <span class="hljs-type">Dict</span>
<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient, DataType
<span class="hljs-keyword">from</span> openai <span class="hljs-keyword">import</span> OpenAI
<span class="hljs-keyword">import</span> time
<span class="hljs-keyword">import</span> os
<span class="hljs-keyword">import</span> re
<button class="copy-code-btn"></button></code></pre>
<h2 id="Data-Processing-VectorDatabase-Class" class="common-anchor-header">Data Processing: VectorDatabase Class<button data-href="#Data-Processing-VectorDatabase-Class" class="anchor-icon" translate="no">
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
    </button></h2><p>This is the data processing core of the entire system, responsible for all interactions with the vector database. It can be divided into two major modules: <strong>Milvus vector database operations and file processing system.</strong></p>
<p>The design philosophy here is the separation of concerns—this class focuses purely on data operations while leaving the intelligence to the SmartAssistant class. This makes the code more maintainable and testable.</p>
<h3 id="Milvus-Vector-Database-Operations" class="common-anchor-header">Milvus Vector Database Operations</h3><h4 id="Initialization-Method" class="common-anchor-header"><strong>Initialization Method</strong></h4><p>Creates an OpenAI client for text vectorization, using the text-embedding-3-small model with vector dimension set to 1536.</p>
<p>Also initializes the Milvus client as None, creating the connection when needed.</p>
<pre><code translate="no"><span class="hljs-keyword">def</span> <span class="hljs-title function_">__init__</span>(<span class="hljs-params">self, openai_api_key: <span class="hljs-built_in">str</span></span>):
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;🔧 Initializing vector database components...&quot;</span>)
    
    <span class="hljs-comment"># OpenAI client for generating text vectors</span>
    <span class="hljs-variable language_">self</span>.openai_client = OpenAI(api_key=openai_api_key)
    <span class="hljs-variable language_">self</span>.vector_dimension = <span class="hljs-number">1536</span>  <span class="hljs-comment"># Vector dimension for OpenAI text-embedding-3-small</span>
    
    <span class="hljs-comment"># Milvus client</span>
    <span class="hljs-variable language_">self</span>.milvus_client = <span class="hljs-literal">None</span>
    
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;✅ Vector database component initialization complete&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Text-Vectorization" class="common-anchor-header"><strong>Text Vectorization</strong></h4><p>Calls OpenAI’s embedding API to vectorize text, returning a 1536-dimensional vector array.</p>
<pre><code translate="no"><span class="hljs-keyword">def</span> <span class="hljs-title function_">generate_vector</span>(<span class="hljs-params">self, text: <span class="hljs-built_in">str</span></span>) -&gt; <span class="hljs-type">List</span>[<span class="hljs-built_in">float</span>]:
    <span class="hljs-string">&quot;&quot;&quot;Convert text to vector&quot;&quot;&quot;</span>
    response = <span class="hljs-variable language_">self</span>.openai_client.embeddings.create(
        <span class="hljs-built_in">input</span>=[text],
        model=<span class="hljs-string">&quot;text-embedding-3-small&quot;</span>
    )
    <span class="hljs-keyword">return</span> response.data[<span class="hljs-number">0</span>].embedding
<button class="copy-code-btn"></button></code></pre>
<h4 id="Database-Connection" class="common-anchor-header"><strong>Database Connection</strong></h4><p>Creates a MilvusClient connection to the local database on port 19530 and returns a unified result dictionary format.</p>
<pre><code translate="no"><span class="hljs-keyword">def</span> <span class="hljs-title function_">connect_database</span>(<span class="hljs-params">self</span>) -&gt; <span class="hljs-built_in">dict</span>:
    <span class="hljs-string">&quot;&quot;&quot;Connect to Milvus vector database&quot;&quot;&quot;</span>
    <span class="hljs-keyword">try</span>:
        <span class="hljs-variable language_">self</span>.milvus_client = MilvusClient(
            uri=<span class="hljs-string">&quot;http://localhost:19530&quot;</span>
        )
        <span class="hljs-keyword">return</span> {<span class="hljs-string">&quot;success&quot;</span>: <span class="hljs-literal">True</span>, <span class="hljs-string">&quot;message&quot;</span>: <span class="hljs-string">&quot;Successfully connected to Milvus vector database&quot;</span>}
    <span class="hljs-keyword">except</span> Exception <span class="hljs-keyword">as</span> e:
        <span class="hljs-keyword">return</span> {<span class="hljs-string">&quot;success&quot;</span>: <span class="hljs-literal">False</span>, <span class="hljs-string">&quot;message&quot;</span>: <span class="hljs-string">f&quot;Connection failed: <span class="hljs-subst">{<span class="hljs-built_in">str</span>(e)}</span>&quot;</span>}
<button class="copy-code-btn"></button></code></pre>
<h4 id="Create-Collection" class="common-anchor-header"><strong>Create Collection</strong></h4><ul>
<li><p><strong>Duplicate Check</strong>: Avoids creating collections with the same name</p></li>
<li><p><strong>Define Structure</strong>: Three fields: id (primary key), text (text), vector (vector)</p></li>
<li><p><strong>Create Index</strong>: Uses <code translate="no">IVF_FLAT</code> algorithm and cosine similarity to improve search efficiency</p></li>
<li><p><strong>Auto ID</strong>: System automatically generates unique identifiers</p></li>
</ul>
<pre><code translate="no"><span class="hljs-keyword">def</span> <span class="hljs-title function_">create_collection</span>(<span class="hljs-params">self, collection_name: <span class="hljs-built_in">str</span>, description: <span class="hljs-built_in">str</span> = <span class="hljs-string">&quot;&quot;</span></span>) -&gt; <span class="hljs-built_in">dict</span>:
    <span class="hljs-string">&quot;&quot;&quot;Create document collection&quot;&quot;&quot;</span>
    <span class="hljs-keyword">try</span>:
        <span class="hljs-comment"># Check if database is connected</span>
        <span class="hljs-keyword">if</span> <span class="hljs-variable language_">self</span>.milvus_client <span class="hljs-keyword">is</span> <span class="hljs-literal">None</span>:
            <span class="hljs-keyword">return</span> {<span class="hljs-string">&quot;success&quot;</span>: <span class="hljs-literal">False</span>, <span class="hljs-string">&quot;message&quot;</span>: <span class="hljs-string">&quot;Please connect to database first&quot;</span>}
        
        <span class="hljs-comment"># Check if collection already exists</span>
        <span class="hljs-keyword">if</span> <span class="hljs-variable language_">self</span>.milvus_client.has_collection(collection_name):
            <span class="hljs-keyword">return</span> {<span class="hljs-string">&quot;success&quot;</span>: <span class="hljs-literal">False</span>, <span class="hljs-string">&quot;message&quot;</span>: <span class="hljs-string">f&quot;Collection <span class="hljs-subst">{collection_name}</span> already exists&quot;</span>}
        
        <span class="hljs-comment"># Define collection structure</span>
        schema = <span class="hljs-variable language_">self</span>.milvus_client.create_schema(
            auto_id=<span class="hljs-literal">True</span>,
            enable_dynamic_field=<span class="hljs-literal">False</span>,
            description=description
        )
        
        <span class="hljs-comment"># Add fields</span>
        schema.add_field(field_name=<span class="hljs-string">&quot;id&quot;</span>, datatype=DataType.INT64, is_primary=<span class="hljs-literal">True</span>)
        schema.add_field(field_name=<span class="hljs-string">&quot;text&quot;</span>, datatype=DataType.VARCHAR, max_length=<span class="hljs-number">2000</span>)
        schema.add_field(field_name=<span class="hljs-string">&quot;vector&quot;</span>, datatype=DataType.FLOAT_VECTOR, dim=<span class="hljs-variable language_">self</span>.vector_dimension)
        
        <span class="hljs-comment"># Create index parameters</span>
        index_params = <span class="hljs-variable language_">self</span>.milvus_client.prepare_index_params()
        index_params.add_index(
            field_name=<span class="hljs-string">&quot;vector&quot;</span>,
            index_type=<span class="hljs-string">&quot;IVF_FLAT&quot;</span>,
            metric_type=<span class="hljs-string">&quot;COSINE&quot;</span>,
            params={<span class="hljs-string">&quot;nlist&quot;</span>: <span class="hljs-number">128</span>}
        )
        
        <span class="hljs-comment"># Create collection</span>
        <span class="hljs-variable language_">self</span>.milvus_client.create_collection(
            collection_name=collection_name,
            schema=schema,
            index_params=index_params
        )
        
        <span class="hljs-keyword">return</span> {<span class="hljs-string">&quot;success&quot;</span>: <span class="hljs-literal">True</span>, <span class="hljs-string">&quot;message&quot;</span>: <span class="hljs-string">f&quot;Successfully created collection <span class="hljs-subst">{collection_name}</span>&quot;</span>}
    <span class="hljs-keyword">except</span> Exception <span class="hljs-keyword">as</span> e:
        <span class="hljs-keyword">return</span> {<span class="hljs-string">&quot;success&quot;</span>: <span class="hljs-literal">False</span>, <span class="hljs-string">&quot;message&quot;</span>: <span class="hljs-string">f&quot;Failed to create collection: <span class="hljs-subst">{<span class="hljs-built_in">str</span>(e)}</span>&quot;</span>}
<button class="copy-code-btn"></button></code></pre>
<h4 id="Add-Documents-to-Collection" class="common-anchor-header"><strong>Add Documents to Collection</strong></h4><p>Generates vector representations for all documents, assembles them into the dictionary format required by Milvus, then performs batch data insertion, finally returning insertion count and status information.</p>
<pre><code translate="no"><span class="hljs-keyword">def</span> <span class="hljs-title function_">add_documents</span>(<span class="hljs-params">self, collection_name: <span class="hljs-built_in">str</span>, documents: <span class="hljs-type">List</span>[<span class="hljs-built_in">str</span>]</span>) -&gt; <span class="hljs-built_in">dict</span>:
    <span class="hljs-string">&quot;&quot;&quot;Add documents to collection&quot;&quot;&quot;</span>
    <span class="hljs-keyword">try</span>:
        <span class="hljs-comment"># Check if database is connected</span>
        <span class="hljs-keyword">if</span> <span class="hljs-variable language_">self</span>.milvus_client <span class="hljs-keyword">is</span> <span class="hljs-literal">None</span>:
            <span class="hljs-keyword">return</span> {<span class="hljs-string">&quot;success&quot;</span>: <span class="hljs-literal">False</span>, <span class="hljs-string">&quot;message&quot;</span>: <span class="hljs-string">&quot;Please connect to database first&quot;</span>}
        
        <span class="hljs-comment"># Generate vectors for each document</span>
        <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;📝 Generating vectors for <span class="hljs-subst">{<span class="hljs-built_in">len</span>(documents)}</span> documents...&quot;</span>)
        vectors = []
        <span class="hljs-keyword">for</span> doc <span class="hljs-keyword">in</span> documents:
            vector = <span class="hljs-variable language_">self</span>.generate_vector(doc)
            vectors.append(vector)
        
        <span class="hljs-comment"># Prepare insertion data</span>
        data = []
        <span class="hljs-keyword">for</span> i, (doc, vector) <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(<span class="hljs-built_in">zip</span>(documents, vectors)):
            data.append({
                <span class="hljs-string">&quot;text&quot;</span>: doc,
                <span class="hljs-string">&quot;vector&quot;</span>: vector
            })
        
        <span class="hljs-comment"># Insert data</span>
        result = <span class="hljs-variable language_">self</span>.milvus_client.insert(
            collection_name=collection_name,
            data=data
        )
        
        <span class="hljs-keyword">return</span> {
            <span class="hljs-string">&quot;success&quot;</span>: <span class="hljs-literal">True</span>,
            <span class="hljs-string">&quot;message&quot;</span>: <span class="hljs-string">f&quot;Successfully added <span class="hljs-subst">{<span class="hljs-built_in">len</span>(documents)}</span> documents to collection <span class="hljs-subst">{collection_name}</span>&quot;</span>,
            <span class="hljs-string">&quot;inserted_count&quot;</span>: <span class="hljs-built_in">len</span>(result[<span class="hljs-string">&quot;insert_count&quot;</span>]) <span class="hljs-keyword">if</span> <span class="hljs-string">&quot;insert_count&quot;</span> <span class="hljs-keyword">in</span> result <span class="hljs-keyword">else</span> <span class="hljs-built_in">len</span>(documents)
        }
    <span class="hljs-keyword">except</span> Exception <span class="hljs-keyword">as</span> e:
        <span class="hljs-keyword">return</span> {<span class="hljs-string">&quot;success&quot;</span>: <span class="hljs-literal">False</span>, <span class="hljs-string">&quot;message&quot;</span>: <span class="hljs-string">f&quot;Failed to add documents: <span class="hljs-subst">{<span class="hljs-built_in">str</span>(e)}</span>&quot;</span>}
<button class="copy-code-btn"></button></code></pre>
<h4 id="Search-Similar-Documents" class="common-anchor-header"><strong>Search Similar Documents</strong></h4><p>Converts user questions to 1536-dimensional vectors, uses Cosine to calculate semantic similarity, and returns the most relevant documents in descending order of similarity.</p>
<pre><code translate="no"><span class="hljs-keyword">def</span> <span class="hljs-title function_">search_documents</span>(<span class="hljs-params">self, collection_name: <span class="hljs-built_in">str</span>, query: <span class="hljs-built_in">str</span>, limit: <span class="hljs-built_in">int</span> = <span class="hljs-number">5</span></span>) -&gt; <span class="hljs-built_in">dict</span>:
    <span class="hljs-string">&quot;&quot;&quot;Search similar documents&quot;&quot;&quot;</span>
    <span class="hljs-keyword">try</span>:
        <span class="hljs-comment"># Check if database is connected</span>
        <span class="hljs-keyword">if</span> <span class="hljs-variable language_">self</span>.milvus_client <span class="hljs-keyword">is</span> <span class="hljs-literal">None</span>:
            <span class="hljs-keyword">return</span> {<span class="hljs-string">&quot;success&quot;</span>: <span class="hljs-literal">False</span>, <span class="hljs-string">&quot;message&quot;</span>: <span class="hljs-string">&quot;Please connect to database first&quot;</span>}
        
        <span class="hljs-comment"># Convert query text to vector</span>
        query_vector = <span class="hljs-variable language_">self</span>.generate_vector(query)
        
        <span class="hljs-comment"># Search parameters</span>
        search_params = {
            <span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;COSINE&quot;</span>,
            <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;nprobe&quot;</span>: <span class="hljs-number">10</span>}
        }
        
        <span class="hljs-comment"># Execute search</span>
        results = <span class="hljs-variable language_">self</span>.milvus_client.search(
            collection_name=collection_name,
            data=[query_vector],
            anns_field=<span class="hljs-string">&quot;vector&quot;</span>,
            search_params=search_params,
            limit=limit,
            output_fields=[<span class="hljs-string">&quot;text&quot;</span>]
        )
        
        <span class="hljs-comment"># Organize search results</span>
        found_docs = []
        <span class="hljs-keyword">for</span> result <span class="hljs-keyword">in</span> results[<span class="hljs-number">0</span>]:  <span class="hljs-comment"># Take results from first query</span>
            found_docs.append({
                <span class="hljs-string">&quot;text&quot;</span>: result[<span class="hljs-string">&quot;entity&quot;</span>][<span class="hljs-string">&quot;text&quot;</span>],
                <span class="hljs-string">&quot;similarity&quot;</span>: <span class="hljs-string">f&quot;<span class="hljs-subst">{(<span class="hljs-number">1</span> - result[<span class="hljs-string">&#x27;distance&#x27;</span>]) * <span class="hljs-number">100</span>:<span class="hljs-number">.1</span>f}</span>%&quot;</span>
            })
        
        <span class="hljs-keyword">return</span> {
            <span class="hljs-string">&quot;success&quot;</span>: <span class="hljs-literal">True</span>,
            <span class="hljs-string">&quot;message&quot;</span>: <span class="hljs-string">f&quot;Found <span class="hljs-subst">{<span class="hljs-built_in">len</span>(found_docs)}</span> relevant documents&quot;</span>,
            <span class="hljs-string">&quot;query&quot;</span>: query,
            <span class="hljs-string">&quot;results&quot;</span>: found_docs
        }
    <span class="hljs-keyword">except</span> Exception <span class="hljs-keyword">as</span> e:
        <span class="hljs-keyword">return</span> {<span class="hljs-string">&quot;success&quot;</span>: <span class="hljs-literal">False</span>, <span class="hljs-string">&quot;message&quot;</span>: <span class="hljs-string">f&quot;Search failed: <span class="hljs-subst">{<span class="hljs-built_in">str</span>(e)}</span>&quot;</span>}
<button class="copy-code-btn"></button></code></pre>
<h4 id="Query-Collections" class="common-anchor-header"><strong>Query Collections</strong></h4><p>Gets collection name, document count, and description information.</p>
<pre><code translate="no"><span class="hljs-keyword">def</span> <span class="hljs-title function_">list_all_collections</span>(<span class="hljs-params">self</span>) -&gt; <span class="hljs-built_in">dict</span>:
    <span class="hljs-string">&quot;&quot;&quot;Query all collections in database&quot;&quot;&quot;</span>
    <span class="hljs-keyword">try</span>:
        <span class="hljs-comment"># Check if database is connected</span>
        <span class="hljs-keyword">if</span> <span class="hljs-variable language_">self</span>.milvus_client <span class="hljs-keyword">is</span> <span class="hljs-literal">None</span>:
            <span class="hljs-keyword">return</span> {<span class="hljs-string">&quot;success&quot;</span>: <span class="hljs-literal">False</span>, <span class="hljs-string">&quot;message&quot;</span>: <span class="hljs-string">&quot;Please connect to database first&quot;</span>}
        
        <span class="hljs-comment"># Get all collection names</span>
        collections = <span class="hljs-variable language_">self</span>.milvus_client.list_collections()
        
        <span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> collections:
            <span class="hljs-keyword">return</span> {
                <span class="hljs-string">&quot;success&quot;</span>: <span class="hljs-literal">True</span>,
                <span class="hljs-string">&quot;message&quot;</span>: <span class="hljs-string">&quot;No collections in database&quot;</span>,
                <span class="hljs-string">&quot;collections&quot;</span>: []
            }
        
        <span class="hljs-comment"># Get detailed information for each collection</span>
        collection_details = []
        <span class="hljs-keyword">for</span> collection_name <span class="hljs-keyword">in</span> collections:
            <span class="hljs-keyword">try</span>:
                <span class="hljs-comment"># Get collection statistics</span>
                stats = <span class="hljs-variable language_">self</span>.milvus_client.get_collection_stats(collection_name)
                doc_count = stats.get(<span class="hljs-string">&quot;row_count&quot;</span>, <span class="hljs-number">0</span>)
                
                <span class="hljs-comment"># Get collection description</span>
                desc_result = <span class="hljs-variable language_">self</span>.milvus_client.describe_collection(collection_name)
                description = desc_result.get(<span class="hljs-string">&quot;description&quot;</span>, <span class="hljs-string">&quot;No description&quot;</span>)
                
                collection_details.append({
                    <span class="hljs-string">&quot;name&quot;</span>: collection_name,
                    <span class="hljs-string">&quot;document_count&quot;</span>: doc_count,
                    <span class="hljs-string">&quot;description&quot;</span>: description
                })
            <span class="hljs-keyword">except</span> Exception <span class="hljs-keyword">as</span> e:
                collection_details.append({
                    <span class="hljs-string">&quot;name&quot;</span>: collection_name,
                    <span class="hljs-string">&quot;document_count&quot;</span>: <span class="hljs-string">&quot;Failed to retrieve&quot;</span>,
                    <span class="hljs-string">&quot;description&quot;</span>: <span class="hljs-string">f&quot;Error: <span class="hljs-subst">{<span class="hljs-built_in">str</span>(e)}</span>&quot;</span>
                })
        
        <span class="hljs-keyword">return</span> {
            <span class="hljs-string">&quot;success&quot;</span>: <span class="hljs-literal">True</span>,
            <span class="hljs-string">&quot;message&quot;</span>: <span class="hljs-string">f&quot;Database contains <span class="hljs-subst">{<span class="hljs-built_in">len</span>(collections)}</span> collections total&quot;</span>,
            <span class="hljs-string">&quot;total_collections&quot;</span>: <span class="hljs-built_in">len</span>(collections),
            <span class="hljs-string">&quot;collections&quot;</span>: collection_details
        }
    <span class="hljs-keyword">except</span> Exception <span class="hljs-keyword">as</span> e:
        <span class="hljs-keyword">return</span> {<span class="hljs-string">&quot;success&quot;</span>: <span class="hljs-literal">False</span>, <span class="hljs-string">&quot;message&quot;</span>: <span class="hljs-string">f&quot;Failed to query collections: <span class="hljs-subst">{<span class="hljs-built_in">str</span>(e)}</span>&quot;</span>}
<button class="copy-code-btn"></button></code></pre>
<h3 id="32-File-Processing-System" class="common-anchor-header"><strong>3.2 File Processing System</strong></h3><h4 id="Intelligent-Text-Chunking" class="common-anchor-header"><strong>Intelligent Text Chunking</strong></h4><p><strong>Chunking Strategy:</strong></p>
<ul>
<li><p><strong>Paragraph Priority</strong>: First split by double line breaks to maintain paragraph integrity</p></li>
<li><p><strong>Long Paragraph Processing</strong>: Split overly long paragraphs by periods, question marks, exclamation marks</p></li>
<li><p><strong>Size Control</strong>: Ensure each chunk doesn’t exceed limits, with maximum chunk size of 500 characters and overlap of 50 characters to avoid losing important information at split boundaries</p></li>
<li><p><strong>Semantic Preservation</strong>: Avoid breaking sentences in the middle</p></li>
</ul>
<pre><code translate="no"><span class="hljs-keyword">def</span> <span class="hljs-title function_">split_text_into_chunks</span>(<span class="hljs-params">self, text: <span class="hljs-built_in">str</span>, chunk_size: <span class="hljs-built_in">int</span> = <span class="hljs-number">500</span>, overlap: <span class="hljs-built_in">int</span> = <span class="hljs-number">50</span></span>) -&gt; <span class="hljs-type">List</span>[<span class="hljs-built_in">str</span>]:
    <span class="hljs-string">&quot;&quot;&quot;Split long text into chunks&quot;&quot;&quot;</span>
    <span class="hljs-comment"># Clean text</span>
    text = text.strip()
    
    <span class="hljs-comment"># Split by paragraphs</span>
    paragraphs = [p.strip() <span class="hljs-keyword">for</span> p <span class="hljs-keyword">in</span> text.split(<span class="hljs-string">&#x27;\n\n&#x27;</span>) <span class="hljs-keyword">if</span> p.strip()]
    
    chunks = []
    current_chunk = <span class="hljs-string">&quot;&quot;</span>
    
    <span class="hljs-keyword">for</span> paragraph <span class="hljs-keyword">in</span> paragraphs:
        <span class="hljs-comment"># If current paragraph is too long, needs further splitting</span>
        <span class="hljs-keyword">if</span> <span class="hljs-built_in">len</span>(paragraph) &gt; chunk_size:
            <span class="hljs-comment"># Save current chunk first</span>
            <span class="hljs-keyword">if</span> current_chunk:
                chunks.append(current_chunk.strip())
                current_chunk = <span class="hljs-string">&quot;&quot;</span>
            
            <span class="hljs-comment"># Split long paragraph by sentences</span>
            sentences = re.split(<span class="hljs-string">r&#x27;[。！？.!?]&#x27;</span>, paragraph)
            temp_chunk = <span class="hljs-string">&quot;&quot;</span>
            
            <span class="hljs-keyword">for</span> sentence <span class="hljs-keyword">in</span> sentences:
                sentence = sentence.strip()
                <span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> sentence:
                    <span class="hljs-keyword">continue</span>
                
                <span class="hljs-keyword">if</span> <span class="hljs-built_in">len</span>(temp_chunk + sentence) &lt;= chunk_size:
                    temp_chunk += sentence + <span class="hljs-string">&quot;。&quot;</span>
                <span class="hljs-keyword">else</span>:
                    <span class="hljs-keyword">if</span> temp_chunk:
                        chunks.append(temp_chunk.strip())
                    temp_chunk = sentence + <span class="hljs-string">&quot;。&quot;</span>
            
            <span class="hljs-keyword">if</span> temp_chunk:
                chunks.append(temp_chunk.strip())
        
        <span class="hljs-comment"># If adding this paragraph won&#x27;t exceed limit</span>
        <span class="hljs-keyword">elif</span> <span class="hljs-built_in">len</span>(current_chunk + paragraph) &lt;= chunk_size:
            current_chunk += paragraph + <span class="hljs-string">&quot;\n\n&quot;</span>
        
        <span class="hljs-comment"># If it would exceed limit, save current chunk first, then start new one</span>
        <span class="hljs-keyword">else</span>:
            <span class="hljs-keyword">if</span> current_chunk:
                chunks.append(current_chunk.strip())
            current_chunk = paragraph + <span class="hljs-string">&quot;\n\n&quot;</span>
    
    <span class="hljs-comment"># Save last chunk</span>
    <span class="hljs-keyword">if</span> current_chunk:
        chunks.append(current_chunk.strip())
    
    <span class="hljs-comment"># Add overlapping content to improve context coherence</span>
    <span class="hljs-keyword">if</span> overlap &gt; <span class="hljs-number">0</span> <span class="hljs-keyword">and</span> <span class="hljs-built_in">len</span>(chunks) &gt; <span class="hljs-number">1</span>:
        overlapped_chunks = []
        <span class="hljs-keyword">for</span> i, chunk <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(chunks):
            <span class="hljs-keyword">if</span> i == <span class="hljs-number">0</span>:
                overlapped_chunks.append(chunk)
            <span class="hljs-keyword">else</span>:
                <span class="hljs-comment"># Take part of previous chunk as overlap</span>
                prev_chunk = chunks[i-<span class="hljs-number">1</span>]
                overlap_text = prev_chunk[-overlap:] <span class="hljs-keyword">if</span> <span class="hljs-built_in">len</span>(prev_chunk) &gt; overlap <span class="hljs-keyword">else</span> prev_chunk
                overlapped_chunk = overlap_text + <span class="hljs-string">&quot;\n&quot;</span> + chunk
                overlapped_chunks.append(overlapped_chunk)
        chunks = overlapped_chunks
    
    <span class="hljs-keyword">return</span> chunks
<button class="copy-code-btn"></button></code></pre>
<h4 id="File-Reading-and-Chunking" class="common-anchor-header"><strong>File Reading and Chunking</strong></h4><p>Supports user file uploads (txt, md, py and other formats), automatically tries different encoding formats, and provides detailed error feedback.</p>
<p><strong>Metadata Enhancement</strong>: source_file records document source, chunk_index records chunk sequence index, total_chunks records total number of chunks, facilitating integrity tracking.</p>
<pre><code translate="no"><span class="hljs-keyword">def</span> <span class="hljs-title function_">read_and_chunk_file</span>(<span class="hljs-params">self, file_path: <span class="hljs-built_in">str</span>, chunk_size: <span class="hljs-built_in">int</span> = <span class="hljs-number">500</span>, overlap: <span class="hljs-built_in">int</span> = <span class="hljs-number">50</span></span>) -&gt; <span class="hljs-built_in">dict</span>:
    <span class="hljs-string">&quot;&quot;&quot;Read local file and chunk into pieces&quot;&quot;&quot;</span>
    <span class="hljs-keyword">try</span>:
        <span class="hljs-comment"># Check if file exists</span>
        <span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> os.path.exists(file_path):
            <span class="hljs-keyword">return</span> {<span class="hljs-string">&quot;success&quot;</span>: <span class="hljs-literal">False</span>, <span class="hljs-string">&quot;message&quot;</span>: <span class="hljs-string">f&quot;File does not exist: <span class="hljs-subst">{file_path}</span>&quot;</span>}
        
        <span class="hljs-comment"># Get file information</span>
        file_size = os.path.getsize(file_path)
        file_name = os.path.basename(file_path)
        
        <span class="hljs-comment"># Choose reading method based on file extension</span>
        file_ext = os.path.splitext(file_path)[<span class="hljs-number">1</span>].lower()
        
        <span class="hljs-keyword">if</span> file_ext <span class="hljs-keyword">in</span> [<span class="hljs-string">&#x27;.txt&#x27;</span>, <span class="hljs-string">&#x27;.md&#x27;</span>, <span class="hljs-string">&#x27;.py&#x27;</span>, <span class="hljs-string">&#x27;.js&#x27;</span>, <span class="hljs-string">&#x27;.html&#x27;</span>, <span class="hljs-string">&#x27;.css&#x27;</span>, <span class="hljs-string">&#x27;.json&#x27;</span>]:
            <span class="hljs-comment"># Text file, try multiple encodings</span>
            encodings = [<span class="hljs-string">&#x27;utf-8&#x27;</span>, <span class="hljs-string">&#x27;gbk&#x27;</span>, <span class="hljs-string">&#x27;gb2312&#x27;</span>, <span class="hljs-string">&#x27;latin-1&#x27;</span>]
            content = <span class="hljs-literal">None</span>
            used_encoding = <span class="hljs-literal">None</span>
            
            <span class="hljs-keyword">for</span> encoding <span class="hljs-keyword">in</span> encodings:
                <span class="hljs-keyword">try</span>:
                    <span class="hljs-keyword">with</span> <span class="hljs-built_in">open</span>(file_path, <span class="hljs-string">&#x27;r&#x27;</span>, encoding=encoding) <span class="hljs-keyword">as</span> f:
                        content = f.read()
                    used_encoding = encoding
                    <span class="hljs-keyword">break</span>
                <span class="hljs-keyword">except</span> UnicodeDecodeError:
                    <span class="hljs-keyword">continue</span>
            
            <span class="hljs-keyword">if</span> content <span class="hljs-keyword">is</span> <span class="hljs-literal">None</span>:
                <span class="hljs-keyword">return</span> {<span class="hljs-string">&quot;success&quot;</span>: <span class="hljs-literal">False</span>, <span class="hljs-string">&quot;message&quot;</span>: <span class="hljs-string">&quot;Cannot read file, encoding format not supported&quot;</span>}
            
            <span class="hljs-comment"># Split text</span>
            chunks = <span class="hljs-variable language_">self</span>.split_text_into_chunks(content, chunk_size, overlap)
            
            <span class="hljs-comment"># Add metadata to each chunk</span>
            chunk_data = []
            <span class="hljs-keyword">for</span> i, chunk <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(chunks):
                chunk_data.append({
                    <span class="hljs-string">&quot;text&quot;</span>: chunk,
                    <span class="hljs-string">&quot;source_file&quot;</span>: file_name,
                    <span class="hljs-string">&quot;chunk_index&quot;</span>: i,
                    <span class="hljs-string">&quot;total_chunks&quot;</span>: <span class="hljs-built_in">len</span>(chunks)
                })
            
            <span class="hljs-keyword">return</span> {
                <span class="hljs-string">&quot;success&quot;</span>: <span class="hljs-literal">True</span>,
                <span class="hljs-string">&quot;message&quot;</span>: <span class="hljs-string">f&quot;Successfully read and chunked file <span class="hljs-subst">{file_name}</span>&quot;</span>,
                <span class="hljs-string">&quot;total_chunks&quot;</span>: <span class="hljs-built_in">len</span>(chunks),
                <span class="hljs-string">&quot;chunks&quot;</span>: chunk_data
            }
        
    <span class="hljs-keyword">except</span> Exception <span class="hljs-keyword">as</span> e:
        <span class="hljs-keyword">return</span> {<span class="hljs-string">&quot;success&quot;</span>: <span class="hljs-literal">False</span>, <span class="hljs-string">&quot;message&quot;</span>: <span class="hljs-string">f&quot;Failed to read file: <span class="hljs-subst">{<span class="hljs-built_in">str</span>(e)}</span>&quot;</span>}
<button class="copy-code-btn"></button></code></pre>
<h4 id="Upload-File-to-Collection" class="common-anchor-header"><strong>Upload File to Collection</strong></h4><p>Calls <code translate="no">read_and_chunk_file</code> to chunk user uploaded files and generates vectors to store in specified collection.</p>
<pre><code translate="no"><span class="hljs-keyword">def</span> <span class="hljs-title function_">upload_file_to_collection</span>(<span class="hljs-params">self, file_path: <span class="hljs-built_in">str</span>, collection_name: <span class="hljs-built_in">str</span>, chunk_size: <span class="hljs-built_in">int</span> = <span class="hljs-number">500</span>, overlap: <span class="hljs-built_in">int</span> = <span class="hljs-number">50</span></span>) -&gt; <span class="hljs-built_in">dict</span>:
    <span class="hljs-string">&quot;&quot;&quot;Upload file to specified collection&quot;&quot;&quot;</span>
    <span class="hljs-keyword">try</span>:
        <span class="hljs-comment"># Check if database is connected</span>
        <span class="hljs-keyword">if</span> <span class="hljs-variable language_">self</span>.milvus_client <span class="hljs-keyword">is</span> <span class="hljs-literal">None</span>:
            <span class="hljs-keyword">return</span> {<span class="hljs-string">&quot;success&quot;</span>: <span class="hljs-literal">False</span>, <span class="hljs-string">&quot;message&quot;</span>: <span class="hljs-string">&quot;Please connect to database first&quot;</span>}
        
        <span class="hljs-comment"># First read and chunk file</span>
        result = <span class="hljs-variable language_">self</span>.read_and_chunk_file(file_path, chunk_size, overlap)
        <span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> result[<span class="hljs-string">&quot;success&quot;</span>]:
            <span class="hljs-keyword">return</span> result
        
        chunk_data = result[<span class="hljs-string">&quot;chunks&quot;</span>]
        <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;📝 Generating vectors for <span class="hljs-subst">{<span class="hljs-built_in">len</span>(chunk_data)}</span> text chunks...&quot;</span>)
        
        <span class="hljs-comment"># Generate vectors for each chunk</span>
        vectors = []
        texts = []
        <span class="hljs-keyword">for</span> chunk_info <span class="hljs-keyword">in</span> chunk_data:
            vector = <span class="hljs-variable language_">self</span>.generate_vector(chunk_info[<span class="hljs-string">&quot;text&quot;</span>])
            vectors.append(vector)
            
            <span class="hljs-comment"># Create text with metadata</span>
            enriched_text = <span class="hljs-string">f&quot;[File: <span class="hljs-subst">{chunk_info[<span class="hljs-string">&#x27;source_file&#x27;</span>]}</span> | Chunk: <span class="hljs-subst">{chunk_info[<span class="hljs-string">&#x27;chunk_index&#x27;</span>]+<span class="hljs-number">1</span>}</span>/<span class="hljs-subst">{chunk_info[<span class="hljs-string">&#x27;total_chunks&#x27;</span>]}</span>]\n<span class="hljs-subst">{chunk_info[<span class="hljs-string">&#x27;text&#x27;</span>]}</span>&quot;</span>
            texts.append(enriched_text)
        
        <span class="hljs-comment"># Prepare insertion data</span>
        data = []
        <span class="hljs-keyword">for</span> i, (text, vector) <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(<span class="hljs-built_in">zip</span>(texts, vectors)):
            data.append({
                <span class="hljs-string">&quot;text&quot;</span>: text,
                <span class="hljs-string">&quot;vector&quot;</span>: vector
            })
        
        <span class="hljs-comment"># Insert data into collection</span>
        insert_result = <span class="hljs-variable language_">self</span>.milvus_client.insert(
            collection_name=collection_name,
            data=data
        )
        
        <span class="hljs-keyword">return</span> {
            <span class="hljs-string">&quot;success&quot;</span>: <span class="hljs-literal">True</span>,
            <span class="hljs-string">&quot;message&quot;</span>: <span class="hljs-string">f&quot;Successfully uploaded file <span class="hljs-subst">{result[<span class="hljs-string">&#x27;file_name&#x27;</span>]}</span> to collection <span class="hljs-subst">{collection_name}</span>&quot;</span>,
            <span class="hljs-string">&quot;file_name&quot;</span>: result[<span class="hljs-string">&quot;file_name&quot;</span>],
            <span class="hljs-string">&quot;file_size&quot;</span>: result[<span class="hljs-string">&quot;file_size&quot;</span>],
            <span class="hljs-string">&quot;total_chunks&quot;</span>: result[<span class="hljs-string">&quot;total_chunks&quot;</span>],
            <span class="hljs-string">&quot;average_chunk_size&quot;</span>: result[<span class="hljs-string">&quot;average_chunk_size&quot;</span>],
            <span class="hljs-string">&quot;inserted_count&quot;</span>: <span class="hljs-built_in">len</span>(data),
            <span class="hljs-string">&quot;collection_name&quot;</span>: collection_name
        }
        
    <span class="hljs-keyword">except</span> Exception <span class="hljs-keyword">as</span> e:
        <span class="hljs-keyword">return</span> {<span class="hljs-string">&quot;success&quot;</span>: <span class="hljs-literal">False</span>, <span class="hljs-string">&quot;message&quot;</span>: <span class="hljs-string">f&quot;Failed to upload file: <span class="hljs-subst">{<span class="hljs-built_in">str</span>(e)}</span>&quot;</span>}
<button class="copy-code-btn"></button></code></pre>
<h2 id="Intelligent-Decision-Making-SmartAssistant-Class" class="common-anchor-header">Intelligent Decision-Making: SmartAssistant Class<button data-href="#Intelligent-Decision-Making-SmartAssistant-Class" class="anchor-icon" translate="no">
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
    </button></h2><p>This is the brain of the system, also called the intelligent decision center. This is where Kimi K2’s autonomous reasoning capabilities really shine—it doesn’t just execute predefined workflows, but actually understands user intent and makes intelligent decisions about which tools to use and when.</p>
<p>The design philosophy here is to create a natural language interface that feels like talking to a knowledgeable assistant, not operating a database through voice commands.</p>
<h3 id="Initialization-and-Tool-Definition" class="common-anchor-header"><strong>Initialization and Tool Definition</strong></h3><p>The tool definition structure follows OpenAI’s function calling format, which Kimi K2 supports natively. This makes the integration seamless and allows for complex tool orchestration without custom parsing logic.</p>
<p>Basic Tools (4):</p>
<p><code translate="no">connect_database</code> - Database connection management
<code translate="no">create_collection</code> - Collection creation
<code translate="no">add_documents</code> - Batch document addition
<code translate="no">list_all_collections</code> - Collection management</p>
<p>Search Tools (1):</p>
<p><code translate="no">search_documents</code> - Search in specified collection</p>
<p>File Tools (2):</p>
<p><code translate="no">read_and_chunk_file</code> - File preview and chunking
<code translate="no">upload_file_to_collection</code> - File upload processing</p>
<pre><code translate="no"><span class="hljs-keyword">def</span> <span class="hljs-title function_">__init__</span>(<span class="hljs-params">self, kimi_api_key: <span class="hljs-built_in">str</span>, openai_api_key: <span class="hljs-built_in">str</span></span>):
    <span class="hljs-string">&quot;&quot;&quot;Initialize intelligent assistant&quot;&quot;&quot;</span>
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;🚀 Starting intelligent assistant...&quot;</span>)
    
    <span class="hljs-comment"># Kimi client</span>
    <span class="hljs-variable language_">self</span>.kimi_client = OpenAI(
        api_key=kimi_api_key,
        base_url=<span class="hljs-string">&quot;https://api.moonshot.cn/v1&quot;</span>
    )
    
    <span class="hljs-comment"># Vector database</span>
    <span class="hljs-variable language_">self</span>.vector_db = VectorDatabase(openai_api_key)
    
    <span class="hljs-comment"># Define available tools</span>
    <span class="hljs-variable language_">self</span>.available_tools = [
        {
            <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;function&quot;</span>,
            <span class="hljs-string">&quot;function&quot;</span>: {
                <span class="hljs-string">&quot;name&quot;</span>: <span class="hljs-string">&quot;connect_database&quot;</span>,
                <span class="hljs-string">&quot;description&quot;</span>: <span class="hljs-string">&quot;Connect to vector database&quot;</span>,
                <span class="hljs-string">&quot;parameters&quot;</span>: {<span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;object&quot;</span>, <span class="hljs-string">&quot;properties&quot;</span>: {}, <span class="hljs-string">&quot;required&quot;</span>: []}
            }
        },
        {
            <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;function&quot;</span>,
            <span class="hljs-string">&quot;function&quot;</span>: {
                <span class="hljs-string">&quot;name&quot;</span>: <span class="hljs-string">&quot;create_collection&quot;</span>,
                <span class="hljs-string">&quot;description&quot;</span>: <span class="hljs-string">&quot;Create new document collection&quot;</span>,
                <span class="hljs-string">&quot;parameters&quot;</span>: {
                    <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;object&quot;</span>,
                    <span class="hljs-string">&quot;properties&quot;</span>: {
                        <span class="hljs-string">&quot;collection_name&quot;</span>: {<span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;string&quot;</span>, <span class="hljs-string">&quot;description&quot;</span>: <span class="hljs-string">&quot;Collection name&quot;</span>},
                        <span class="hljs-string">&quot;description&quot;</span>: {<span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;string&quot;</span>, <span class="hljs-string">&quot;description&quot;</span>: <span class="hljs-string">&quot;Collection description&quot;</span>}
                    },
                    <span class="hljs-string">&quot;required&quot;</span>: [<span class="hljs-string">&quot;collection_name&quot;</span>]
                }
            }
        },
        {
            <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;function&quot;</span>,
            <span class="hljs-string">&quot;function&quot;</span>: {
                <span class="hljs-string">&quot;name&quot;</span>: <span class="hljs-string">&quot;add_documents&quot;</span>,
                <span class="hljs-string">&quot;description&quot;</span>: <span class="hljs-string">&quot;Add documents to collection&quot;</span>,
                <span class="hljs-string">&quot;parameters&quot;</span>: {
                    <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;object&quot;</span>,
                    <span class="hljs-string">&quot;properties&quot;</span>: {
                        <span class="hljs-string">&quot;collection_name&quot;</span>: {<span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;string&quot;</span>, <span class="hljs-string">&quot;description&quot;</span>: <span class="hljs-string">&quot;Collection name&quot;</span>},
                        <span class="hljs-string">&quot;documents&quot;</span>: {<span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;array&quot;</span>, <span class="hljs-string">&quot;items&quot;</span>: {<span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;string&quot;</span>}, <span class="hljs-string">&quot;description&quot;</span>: <span class="hljs-string">&quot;Document list&quot;</span>}
                    },
                    <span class="hljs-string">&quot;required&quot;</span>: [<span class="hljs-string">&quot;collection_name&quot;</span>, <span class="hljs-string">&quot;documents&quot;</span>]
                }
            }
        },
        {
            <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;function&quot;</span>,
            <span class="hljs-string">&quot;function&quot;</span>: {
                <span class="hljs-string">&quot;name&quot;</span>: <span class="hljs-string">&quot;search_documents&quot;</span>,
                <span class="hljs-string">&quot;description&quot;</span>: <span class="hljs-string">&quot;Search similar documents&quot;</span>,
                <span class="hljs-string">&quot;parameters&quot;</span>: {
                    <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;object&quot;</span>,
                    <span class="hljs-string">&quot;properties&quot;</span>: {
                        <span class="hljs-string">&quot;collection_name&quot;</span>: {<span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;string&quot;</span>, <span class="hljs-string">&quot;description&quot;</span>: <span class="hljs-string">&quot;Collection name&quot;</span>},
                        <span class="hljs-string">&quot;query&quot;</span>: {<span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;string&quot;</span>, <span class="hljs-string">&quot;description&quot;</span>: <span class="hljs-string">&quot;Search content&quot;</span>},
                        <span class="hljs-string">&quot;limit&quot;</span>: {<span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;integer&quot;</span>, <span class="hljs-string">&quot;description&quot;</span>: <span class="hljs-string">&quot;Number of results&quot;</span>, <span class="hljs-string">&quot;default&quot;</span>: <span class="hljs-number">5</span>}
                    },
                    <span class="hljs-string">&quot;required&quot;</span>: [<span class="hljs-string">&quot;collection_name&quot;</span>, <span class="hljs-string">&quot;query&quot;</span>]
                }
            }
        },
        {
            <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;function&quot;</span>,
            <span class="hljs-string">&quot;function&quot;</span>: {
                <span class="hljs-string">&quot;name&quot;</span>: <span class="hljs-string">&quot;list_all_collections&quot;</span>,
                <span class="hljs-string">&quot;description&quot;</span>: <span class="hljs-string">&quot;Query information about all collections in database&quot;</span>,
                <span class="hljs-string">&quot;parameters&quot;</span>: {<span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;object&quot;</span>, <span class="hljs-string">&quot;properties&quot;</span>: {}, <span class="hljs-string">&quot;required&quot;</span>: []}
            }
        },
        {
            <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;function&quot;</span>,
            <span class="hljs-string">&quot;function&quot;</span>: {
                <span class="hljs-string">&quot;name&quot;</span>: <span class="hljs-string">&quot;read_and_chunk_file&quot;</span>,
                <span class="hljs-string">&quot;description&quot;</span>: <span class="hljs-string">&quot;Read local file and chunk into text blocks&quot;</span>,
                <span class="hljs-string">&quot;parameters&quot;</span>: {
                    <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;object&quot;</span>,
                    <span class="hljs-string">&quot;properties&quot;</span>: {
                        <span class="hljs-string">&quot;file_path&quot;</span>: {<span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;string&quot;</span>, <span class="hljs-string">&quot;description&quot;</span>: <span class="hljs-string">&quot;File path&quot;</span>},
                        <span class="hljs-string">&quot;chunk_size&quot;</span>: {<span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;integer&quot;</span>, <span class="hljs-string">&quot;description&quot;</span>: <span class="hljs-string">&quot;Size of each text chunk&quot;</span>, <span class="hljs-string">&quot;default&quot;</span>: <span class="hljs-number">500</span>},
                        <span class="hljs-string">&quot;overlap&quot;</span>: {<span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;integer&quot;</span>, <span class="hljs-string">&quot;description&quot;</span>: <span class="hljs-string">&quot;Overlapping characters between text chunks&quot;</span>, <span class="hljs-string">&quot;default&quot;</span>: <span class="hljs-number">50</span>}
                    },
                    <span class="hljs-string">&quot;required&quot;</span>: [<span class="hljs-string">&quot;file_path&quot;</span>]
                }
            }
        },
        {
            <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;function&quot;</span>,
            <span class="hljs-string">&quot;function&quot;</span>: {
                <span class="hljs-string">&quot;name&quot;</span>: <span class="hljs-string">&quot;upload_file_to_collection&quot;</span>,
                <span class="hljs-string">&quot;description&quot;</span>: <span class="hljs-string">&quot;Upload local file to specified collection, automatically chunk and vectorize&quot;</span>,
                <span class="hljs-string">&quot;parameters&quot;</span>: {
                    <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;object&quot;</span>,
                    <span class="hljs-string">&quot;properties&quot;</span>: {
                        <span class="hljs-string">&quot;file_path&quot;</span>: {<span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;string&quot;</span>, <span class="hljs-string">&quot;description&quot;</span>: <span class="hljs-string">&quot;File path&quot;</span>},
                        <span class="hljs-string">&quot;collection_name&quot;</span>: {<span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;string&quot;</span>, <span class="hljs-string">&quot;description&quot;</span>: <span class="hljs-string">&quot;Target collection name&quot;</span>},
                        <span class="hljs-string">&quot;chunk_size&quot;</span>: {<span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;integer&quot;</span>, <span class="hljs-string">&quot;description&quot;</span>: <span class="hljs-string">&quot;Size of each text chunk&quot;</span>, <span class="hljs-string">&quot;default&quot;</span>: <span class="hljs-number">500</span>},
                        <span class="hljs-string">&quot;overlap&quot;</span>: {<span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;integer&quot;</span>, <span class="hljs-string">&quot;description&quot;</span>: <span class="hljs-string">&quot;Overlapping characters between text chunks&quot;</span>, <span class="hljs-string">&quot;default&quot;</span>: <span class="hljs-number">50</span>}
                    },
                    <span class="hljs-string">&quot;required&quot;</span>: [<span class="hljs-string">&quot;file_path&quot;</span>, <span class="hljs-string">&quot;collection_name&quot;</span>]
                }
            }
        }
    ]
    
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;✅ Intelligent assistant startup complete&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="42-Tool-Mapping-and-Execution" class="common-anchor-header"><strong>4.2 Tool Mapping and Execution</strong></h3><p>All tools are executed uniformly through _execute_tool.</p>
<pre><code translate="no"><span class="hljs-keyword">def</span> <span class="hljs-title function_">_execute_tool</span>(<span class="hljs-params">self, tool_name: <span class="hljs-built_in">str</span>, args: <span class="hljs-built_in">dict</span></span>) -&gt; <span class="hljs-built_in">dict</span>:
    <span class="hljs-string">&quot;&quot;&quot;Execute specific tool&quot;&quot;&quot;</span>
    <span class="hljs-keyword">if</span> tool_name == <span class="hljs-string">&quot;connect_database&quot;</span>:
        <span class="hljs-keyword">return</span> <span class="hljs-variable language_">self</span>.vector_db.connect_database()
    <span class="hljs-keyword">elif</span> tool_name == <span class="hljs-string">&quot;create_collection&quot;</span>:
        <span class="hljs-keyword">return</span> <span class="hljs-variable language_">self</span>.vector_db.create_collection(**args)
    <span class="hljs-keyword">elif</span> tool_name == <span class="hljs-string">&quot;add_documents&quot;</span>:
        <span class="hljs-keyword">return</span> <span class="hljs-variable language_">self</span>.vector_db.add_documents(**args)
    <span class="hljs-keyword">elif</span> tool_name == <span class="hljs-string">&quot;search_documents&quot;</span>:
        <span class="hljs-keyword">return</span> <span class="hljs-variable language_">self</span>.vector_db.search_documents(**args)
    <span class="hljs-keyword">elif</span> tool_name == <span class="hljs-string">&quot;list_all_collections&quot;</span>:
        <span class="hljs-keyword">return</span> <span class="hljs-variable language_">self</span>.vector_db.list_all_collections()
    <span class="hljs-keyword">elif</span> tool_name == <span class="hljs-string">&quot;read_and_chunk_file&quot;</span>:
        <span class="hljs-keyword">return</span> <span class="hljs-variable language_">self</span>.vector_db.read_and_chunk_file(**args)
    <span class="hljs-keyword">elif</span> tool_name == <span class="hljs-string">&quot;upload_file_to_collection&quot;</span>:
        <span class="hljs-keyword">return</span> <span class="hljs-variable language_">self</span>.vector_db.upload_file_to_collection(**args)
    <span class="hljs-keyword">else</span>:
        <span class="hljs-keyword">return</span> {<span class="hljs-string">&quot;success&quot;</span>: <span class="hljs-literal">False</span>, <span class="hljs-string">&quot;message&quot;</span>: <span class="hljs-string">f&quot;Unknown tool: <span class="hljs-subst">{tool_name}</span>&quot;</span>}
<button class="copy-code-btn"></button></code></pre>
<h3 id="43-Core-Conversation-Engine" class="common-anchor-header"><strong>4.3 Core Conversation Engine</strong></h3><p>This is where the magic happens. The method calls Kimi’s latest model:<a href="https://moonshotai.github.io/Kimi-K2/"> kimi-k2-0711-preview</a> to analyze user intent, automatically select needed tools and execute them, then return results to Kimi, finally generating final answers based on tool results.</p>
<p>What makes this particularly powerful is the conversational loop—Kimi K2 can chain multiple tool calls together, learn from intermediate results, and adapt its strategy based on what it discovers. This enables complex workflows that would require multiple manual steps in traditional systems.</p>
<p><strong>Parameter Configuration:</strong></p>
<ul>
<li><p><code translate="no">temperature=0.3</code>: Lower temperature ensures stable tool calling</p></li>
<li><p><code translate="no">tool_choice=&quot;auto&quot;</code>: Lets Kimi autonomously decide whether to use tools</p></li>
</ul>
<pre><code translate="no"><span class="hljs-keyword">def</span> <span class="hljs-title function_">execute_command</span>(<span class="hljs-params">self, user_command: <span class="hljs-built_in">str</span></span>) -&gt; <span class="hljs-built_in">str</span>:
    <span class="hljs-string">&quot;&quot;&quot;Execute user command&quot;&quot;&quot;</span>
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;\n📝 User command: <span class="hljs-subst">{user_command}</span>&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;=&quot;</span> * <span class="hljs-number">60</span>)
    
    <span class="hljs-comment"># Prepare conversation messages</span>
    messages = [
        {
            <span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;system&quot;</span>,
            <span class="hljs-string">&quot;content&quot;</span>: <span class="hljs-string">&quot;&quot;&quot;You are an intelligent assistant that can help users manage vector databases and answer questions.

Intelligent Decision Principles:
1. Prioritize answer speed and quality, choose optimal response methods
2. For general knowledge questions, directly use your knowledge for quick responses
3. Only use database search in the following situations:
   - User explicitly requests searching database content
   - Questions involve user-uploaded specific documents or professional materials
   - Need to find specific, specialized information
4. You can handle file uploads, database management and other tasks
5. Always aim to provide the fastest, most accurate answers

Important Reminders:
- Before executing any database operations, please first call connect_database to connect to the database
- If encountering API limit errors, the system will automatically retry, please be patient

Remember: Don&#x27;t use tools just to use tools, but solve user problems in the optimal way.&quot;&quot;&quot;</span>
        },
        {
            <span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>,
            <span class="hljs-string">&quot;content&quot;</span>: user_command
        }
    ]
    
    <span class="hljs-comment"># Start conversation and tool calling loop</span>
    <span class="hljs-keyword">while</span> <span class="hljs-literal">True</span>:
        <span class="hljs-keyword">try</span>:
            <span class="hljs-comment"># Call Kimi model - Add retry mechanism to handle API limits</span>
            max_retries = <span class="hljs-number">5</span>
            retry_delay = <span class="hljs-number">20</span>  <span class="hljs-comment"># seconds</span>
            
            <span class="hljs-keyword">for</span> attempt <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(max_retries):
                <span class="hljs-keyword">try</span>:
                    response = <span class="hljs-variable language_">self</span>.kimi_client.chat.completions.create(
                        model=<span class="hljs-string">&quot;kimi-k2-0711-preview&quot;</span>, <span class="hljs-comment">#moonshot-v1-8k</span>
                        messages=messages,
                        temperature=<span class="hljs-number">0.3</span>,
                        tools=<span class="hljs-variable language_">self</span>.available_tools,
                        tool_choice=<span class="hljs-string">&quot;auto&quot;</span>
                    )
                    <span class="hljs-keyword">break</span>  <span class="hljs-comment"># Success, break out of retry loop</span>
                <span class="hljs-keyword">except</span> Exception <span class="hljs-keyword">as</span> e:
                    <span class="hljs-keyword">if</span> <span class="hljs-string">&quot;rate_limit&quot;</span> <span class="hljs-keyword">in</span> <span class="hljs-built_in">str</span>(e).lower() <span class="hljs-keyword">or</span> <span class="hljs-string">&quot;429&quot;</span> <span class="hljs-keyword">in</span> <span class="hljs-built_in">str</span>(e) <span class="hljs-keyword">and</span> attempt &lt; max_retries - <span class="hljs-number">1</span>:
                        <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;⏳ Kimi API limit, waiting <span class="hljs-subst">{retry_delay}</span> seconds before retry... (attempt <span class="hljs-subst">{attempt + <span class="hljs-number">1</span>}</span>/<span class="hljs-subst">{max_retries}</span>)&quot;</span>)
                        time.sleep(retry_delay)
                        retry_delay *= <span class="hljs-number">1.5</span>  <span class="hljs-comment"># Moderately increase delay</span>
                        <span class="hljs-keyword">continue</span>
                    <span class="hljs-keyword">else</span>:
                        <span class="hljs-keyword">raise</span> e
            <span class="hljs-keyword">else</span>:
                <span class="hljs-keyword">raise</span> Exception(<span class="hljs-string">&quot;Failed to call Kimi API: exceeded maximum retry attempts&quot;</span>)
            
            choice = response.choices[<span class="hljs-number">0</span>]
            
            <span class="hljs-comment"># If need to call tools</span>
            <span class="hljs-keyword">if</span> choice.finish_reason == <span class="hljs-string">&quot;tool_calls&quot;</span>:
                messages.append(choice.message)
                
                <span class="hljs-comment"># Execute each tool call</span>
                <span class="hljs-keyword">for</span> tool_call <span class="hljs-keyword">in</span> choice.message.tool_calls:
                    tool_name = tool_call.function.name
                    tool_args = json.loads(tool_call.function.arguments)
                    
                    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;🔧 Calling tool: <span class="hljs-subst">{tool_name}</span>&quot;</span>)
                    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;📋 Parameters: <span class="hljs-subst">{tool_args}</span>&quot;</span>)
                    
                    <span class="hljs-comment"># Execute tool</span>
                    result = <span class="hljs-variable language_">self</span>._execute_tool(tool_name, tool_args)
                    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;✅ Result: <span class="hljs-subst">{result}</span>&quot;</span>)
                    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;-&quot;</span> * <span class="hljs-number">40</span>)
                    
                    <span class="hljs-comment"># Add tool result to conversation</span>
                    messages.append({
                        <span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;tool&quot;</span>,
                        <span class="hljs-string">&quot;tool_call_id&quot;</span>: tool_call.<span class="hljs-built_in">id</span>,
                        <span class="hljs-string">&quot;name&quot;</span>: tool_name,
                        <span class="hljs-string">&quot;content&quot;</span>: json.dumps(result)
                    })
            
            <span class="hljs-comment"># If task completed</span>
            <span class="hljs-keyword">else</span>:
                final_response = choice.message.content
                <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;🎯 Task completed: <span class="hljs-subst">{final_response}</span>&quot;</span>)
                <span class="hljs-keyword">return</span> final_response
        
        <span class="hljs-keyword">except</span> Exception <span class="hljs-keyword">as</span> e:
            error_msg = <span class="hljs-string">f&quot;Execution error: <span class="hljs-subst">{<span class="hljs-built_in">str</span>(e)}</span>&quot;</span>
            <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;❌ <span class="hljs-subst">{error_msg}</span>&quot;</span>)
            <span class="hljs-keyword">return</span> error_msg
<button class="copy-code-btn"></button></code></pre>
<h2 id="Main-Program-and-Usage-Demonstration" class="common-anchor-header">Main Program and Usage Demonstration<button data-href="#Main-Program-and-Usage-Demonstration" class="anchor-icon" translate="no">
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
    </button></h2><p>This main program sets up the interactive environment. For production use, you’d want to replace the hardcoded API keys with environment variables and add proper logging and monitoring.</p>
<p>Get <code translate="no">KIMI_API_KEY</code> and <code translate="no">OPENAI_API_KEY</code> from the official website to start using.</p>
<pre><code translate="no">python
<span class="hljs-keyword">def</span> <span class="hljs-title function_">main</span>():
    <span class="hljs-string">&quot;&quot;&quot;Main program&quot;&quot;&quot;</span>
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;🌟 Kimi K2 Intelligent Vector Database Assistant&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;=&quot;</span> * <span class="hljs-number">60</span>)
    
    <span class="hljs-comment"># API key configuration</span>
    KIMI_API_KEY = <span class="hljs-string">&quot;sk-xxxxxxxxxxxxxxxx&quot;</span>
    OPENAI_API_KEY = <span class="hljs-string">&quot;sk-proj-xxxxxxxxxxxxxxxx&quot;</span>
    
    <span class="hljs-comment"># Create intelligent assistant</span>
    assistant = SmartAssistant(KIMI_API_KEY, OPENAI_API_KEY)
    
    <span class="hljs-comment"># Interactive mode</span>
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n🎮 Interactive mode (enter &#x27;quit&#x27; to exit)&quot;</span>)
    <span class="hljs-keyword">while</span> <span class="hljs-literal">True</span>:
        <span class="hljs-keyword">try</span>:
            user_input = <span class="hljs-built_in">input</span>(<span class="hljs-string">&quot;\nPlease enter command: &quot;</span>).strip()
            <span class="hljs-keyword">if</span> user_input.lower() <span class="hljs-keyword">in</span> [<span class="hljs-string">&#x27;quit&#x27;</span>, <span class="hljs-string">&#x27;exit&#x27;</span>]:
                <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;👋 Goodbye!&quot;</span>)
                <span class="hljs-keyword">break</span>
            
            <span class="hljs-keyword">if</span> user_input:
                assistant.execute_command(user_input)
                <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n&quot;</span> + <span class="hljs-string">&quot;=&quot;</span> * <span class="hljs-number">60</span>)
        
        <span class="hljs-keyword">except</span> KeyboardInterrupt:
            <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n👋 Goodbye!&quot;</span>)
            <span class="hljs-keyword">break</span>

<span class="hljs-keyword">if</span> __name__ == <span class="hljs-string">&quot;__main__&quot;</span>:
    main()
<button class="copy-code-btn"></button></code></pre>
<h2 id="Usage-Examples" class="common-anchor-header">Usage Examples<button data-href="#Usage-Examples" class="anchor-icon" translate="no">
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
    </button></h2><p>These examples demonstrate the system’s capabilities in realistic scenarios that engineers would encounter in production environments.</p>
<h3 id="Upload-file-example" class="common-anchor-header">Upload file example</h3><p>This example shows how the system handles a complex workflow autonomously. Notice how Kimi K2 breaks down the user’s request and executes the necessary steps in the correct order.</p>
<pre><code translate="no">User Input: Upload ./The Adventures of Sherlock Holmes.txt to the database
<button class="copy-code-btn"></button></code></pre>
<p>What’s remarkable here is that from the tool call chain, you can see that Kimi K2 parses the command and knows to connect to the database (connect_database function) first, and then upload the file to the collection (upload_file_to_collection function).</p>
<p>When encountering an error, Kimi K2 also knows to promptly correct it based on the error message, knowing that it should first create the collection (create_collection) and then upload the file to the collection (upload_file_to_collection). This autonomous error recovery is a key advantage over traditional scripted approaches.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/usage_example_1_a4c0b2a006.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>The system automatically handles:</p>
<ol>
<li><p>Database connection</p></li>
<li><p>Collection creation (if needed)</p></li>
<li><p>File reading and chunking</p></li>
<li><p>Vector generation</p></li>
<li><p>Data insertion</p></li>
<li><p>Status reporting</p></li>
</ol>
<h3 id="Question-answer-example" class="common-anchor-header">Question-answer example</h3><p>This section demonstrates the system’s intelligence in deciding when to use tools versus when to rely on existing knowledge.</p>
<pre><code translate="no">User Input: List five advantages of the Milvus vector database
<button class="copy-code-btn"></button></code></pre>
<p>From the image, we can see that Kimi K2 answered the user’s question directly without calling any functions. This demonstrates the system’s efficiency—it doesn’t perform unnecessary database operations for questions it can answer from its training data.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/usage_example_2_c912f3273b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<pre><code translate="no"><span class="hljs-title class_">How</span> many stories are included <span class="hljs-keyword">in</span> the book <span class="hljs-string">&quot;Sherlock Holmes&quot;</span> that I uploaded? <span class="hljs-title class_">Summarize</span> each story <span class="hljs-keyword">in</span> one sentence.
<button class="copy-code-btn"></button></code></pre>
<p>For this query, Kimi correctly identifies that it needs to search the uploaded document content. The system:</p>
<ol>
<li><p>Recognizes this requires document-specific information</p></li>
<li><p>Calls the search_documents function</p></li>
<li><p>Analyzes the retrieved content</p></li>
<li><p>Provides a comprehensive answer based on the actual uploaded content</p></li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/usage_example_3_7517b69889.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/usage_example_4_96ea51a798.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Database-Management-Example" class="common-anchor-header">Database Management Example</h3><p>Administrative tasks are handled just as smoothly as content queries.</p>
<pre><code translate="no"><span class="hljs-built_in">list</span> <span class="hljs-built_in">all</span> the collections
<button class="copy-code-btn"></button></code></pre>
<p>Kimi K2 utilizes the appropriate tools to answer this question correctly, demonstrating that it understands both administrative and content operations.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/usage_example_5_457a4d5db0.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>The system provides comprehensive information including:</p>
<ul>
<li><p>Collection names</p></li>
<li><p>Document counts</p></li>
<li><p>Descriptions</p></li>
<li><p>Overall database statistics</p></li>
</ul>
<h2 id="The-Dawn-of-Production-AI-Agents" class="common-anchor-header">The Dawn of Production AI Agents<button data-href="#The-Dawn-of-Production-AI-Agents" class="anchor-icon" translate="no">
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
    </button></h2><p>By connecting <strong>Kimi K2</strong> with <strong>Milvus</strong>, we’ve moved beyond traditional chatbots or basic semantic search. What we’ve built is a real production agent—one that can interpret complex instructions, break them down into tool-based workflows, and execute end-to-end tasks like file handling, semantic search, and intelligent Q&amp;A with minimal overhead.</p>
<p>This architecture reflects a broader shift in AI development, moving from isolated models to composable systems, where reasoning, memory, and action work in tandem. LLMs like Kimi K2 provide flexible reasoning, while vector databases like Milvus offer long-term, structured memory; and tool calling enables real-world execution.</p>
<p>For developers, the question is no longer <em>if</em> these components can work together, but <em>how well</em> they can generalize across domains, scale with data, and respond to increasingly complex user needs.</p>
<p><strong><em>Looking ahead, one pattern is becoming clear:LLM (reasoning) + Vector DB (knowledge) + Tools (action) = Real AI agents.</em></strong></p>
<p>This system we built is just one example, but the principles apply broadly. As LLMs continue improving and tool ecosystems mature, Milvus is positioned to remain a core part of the production AI stack—powering intelligent systems that can reason over data, not just retrieve it.</p>
