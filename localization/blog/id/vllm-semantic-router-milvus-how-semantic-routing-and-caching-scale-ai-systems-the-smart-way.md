---
id: >-
  vllm-semantic-router-milvus-how-semantic-routing-and-caching-scale-ai-systems-the-smart-way.md
title: >
  vLLM Semantic Router + Milvus: How Semantic Routing and Caching Build Scalable
  AI Systems the Smart Way
author: Min Yin
date: 2025-10-17T00:00:00.000Z
cover: assets.zilliz.com/Chat_GPT_Image_Oct_19_2025_04_30_18_PM_af7fda1170.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus, semantic routing, cache layer, vector database, vllm semantic router'
meta_title: Scale Your AI Apps the Smart Way with vLLM Semantic Router and Milvus
desc: >-
  Learn how vLLM, Milvus, and semantic routing optimize large model inference,
  reduce compute costs, and boost AI performance across scalable deployments.
origin: >-
  https://milvus.io/blog/vllm-semantic-router-milvus-how-semantic-routing-and-caching-scale-ai-systems-the-smart-way.md
---
<p>Most AI apps rely on a single model for every request. But that approach quickly runs into limits. Large models are powerful yet expensive, even when they’re used for simple queries. Smaller models are cheaper and faster but can’t handle complex reasoning. When traffic surges—say your AI app suddenly goes viral with ten million users overnight—the inefficiency of this one-model-for-all setup becomes painfully apparent. Latency spikes, GPU bills explode, and the model that ran fine yesterday starts gasping for air.</p>
<p>And my friend, <em>you</em>, the engineer behind this app, have to fix it—fast.</p>
<p>Imagine deploying multiple models of varying sizes and having your system automatically select the best one for each request. Simple prompts go to smaller models; complex queries route to larger ones. That’s the idea behind the <a href="https://github.com/vllm-project/semantic-router"><strong>vLLM Semantic Router</strong></a>—a routing mechanism that directs requests based on meaning, not endpoints. It analyzes the semantic content, complexity, and intent of each input to select the most suitable language model, ensuring every query is handled by the model best equipped for it.</p>
<p>To make this even more efficient, the Semantic Router pairs with <a href="https://milvus.io/"><strong>Milvus</strong></a>, an open-source vector database that serves as a <strong>semantic cache layer</strong>. Before recomputing a response, it checks whether a semantically similar query has already been processed and instantly retrieves the cached result if found. The result: faster responses, lower costs, and a retrieval system that scales intelligently rather than wastefully.</p>
<p>In this post, we’ll dive deeper into how the <strong>vLLM Semantic Router</strong> works, how <strong>Milvus</strong> powers its caching layer, and how this architecture can be applied in real-world AI applications.</p>
<h2 id="What-is-a-Semantic-Router" class="common-anchor-header">What is a Semantic Router?<button data-href="#What-is-a-Semantic-Router" class="anchor-icon" translate="no">
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
    </button></h2><p>At its core, a <strong>Semantic Router</strong> is a system that decides <em>which model</em> should handle a given request based on its meaning, complexity, and intent. Instead of routing everything to one model, it distributes requests intelligently across multiple models to balance accuracy, latency, and cost.</p>
<p>Architecturally, it’s built on three key layers: <strong>Semantic Routing</strong>, <strong>Mixture of Models (MoM)</strong>, and a <strong>Cache Layer</strong>.</p>
<h3 id="Semantic-Routing-Layer" class="common-anchor-header">Semantic Routing Layer</h3><p>The <strong>semantic routing layer</strong> is the brain of the system. It analyzes each input—what it’s asking, how complex it is, and what kind of reasoning it requires—to select the model best suited for the job. For example, a simple fact lookup might go to a lightweight model, while a multi-step reasoning query is routed to a larger one. This dynamic routing keeps the system responsive even as traffic and query diversity increase.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/modern_approach_714403b61c.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="The-Mixture-of-Models-MoM-Layer" class="common-anchor-header">The Mixture of Models (MoM) Layer</h3><p>The second layer, the <strong>Mixture of Models (MoM)</strong>, integrates multiple models of different sizes and capabilities into one unified system. It’s inspired by the <a href="https://zilliz.com/learn/what-is-mixture-of-experts"><strong>Mixture of Experts</strong></a> <strong>(MoE)</strong> architecture, but instead of picking “experts” inside a single large model, it operates across multiple independent models. This design reduces latency, lowers costs, and avoids being locked into any single model provider.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/MOM_0a3eb61985.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="The-Cache-Layer-Where-Milvus-Makes-the-Difference" class="common-anchor-header">The Cache Layer: Where Milvus Makes the Difference</h3><p>Finally, the <strong>cache layer</strong>—powered by <a href="https://milvus.io/">Milvus Vector Database</a>—acts as the system’s memory. Before running a new query, it checks whether a semantically similar request has been processed before. If so, it retrieves the cached result instantly, saving compute time and improving throughput.</p>
<p>Traditional caching systems rely on in-memory key-value stores, matching requests by exact strings or templates. That works fine when queries are repetitive and predictable. But real users rarely type the same thing twice. Once the phrasing changes—even slightly—the cache fails to recognize it as the same intent. Over time, the cache hit rate drops, and performance gains vanish as language naturally drifts.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/semantic_caching_for_vllm_routing_df889058c9.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>To fix this, we need caching that understands <em>meaning</em>, not just matching words. That’s where <strong>semantic retrieval</strong> comes in. Instead of comparing strings, it compares embeddings—high-dimensional vector representations that capture semantic similarity. The challenge, though, is scale. Running a brute-force search across millions or billions of vectors on a single machine (with time complexity O(N·d)) is computationally prohibitive. Memory costs explode, horizontal scalability collapses, and the system struggles to handle sudden traffic spikes or long-tail queries.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/milvus_routing_system_5837b93074.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>As a distributed vector database purpose-built for large-scale semantic search, <strong>Milvus</strong> brings the horizontal scalability and fault tolerance this cache layer needs. It stores embeddings efficiently across nodes and performs <a href="https://zilliz.com/blog/ANN-machine-learning">Approximate Nearest Neighbo</a>r (ANN) searches with minimal latency, even at massive scale. With the right similarity thresholds and fallback strategies, Milvus ensures stable, predictable performance—turning the cache layer into a resilient semantic memory for your entire routing system.</p>
<h2 id="How-Developers-Are-Using-Semantic-Router-+-Milvus-in-Production" class="common-anchor-header">How Developers Are Using Semantic Router + Milvus in Production<button data-href="#How-Developers-Are-Using-Semantic-Router-+-Milvus-in-Production" class="anchor-icon" translate="no">
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
    </button></h2><p>The combination of <strong>vLLM Semantic Router</strong> and <strong>Milvus</strong> shines in real-world production environments where speed, cost, and reusability all matter.</p>
<p>Three common scenarios stand out:</p>
<h3 id="1-Customer-Service-QA" class="common-anchor-header">1. Customer Service Q&amp;A</h3><p>Customer-facing bots handle massive volumes of repetitive queries every day—password resets, account updates, delivery statuses. This domain is both cost- and latency-sensitive, making it ideal for semantic routing. The router sends routine questions to smaller, faster models and escalates complex or ambiguous ones to larger models for deeper reasoning. Meanwhile, Milvus caches previous Q&amp;A pairs, so when similar queries appear, the system can instantly reuse past answers instead of regenerating them.</p>
<h3 id="2-Code-Assistance" class="common-anchor-header">2. Code Assistance</h3><p>In developer tools or IDE assistants, many queries overlap—syntax help, API lookups, small debugging hints. By analyzing the semantic structure of each prompt, the router dynamically selects an appropriate model size: lightweight for simple tasks, more capable for multi-step reasoning. Milvus boosts responsiveness further by caching similar coding problems and their solutions, turning prior user interactions into a reusable knowledge base.</p>
<h3 id="3-Enterprise-Knowledge-Base" class="common-anchor-header">3. Enterprise Knowledge Base</h3><p>Enterprise queries tend to repeat over time—policy lookups, compliance references, product FAQs. With Milvus as the semantic cache layer, frequently asked questions and their answers can be stored and retrieved efficiently. This minimizes redundant computation while keeping responses consistent across departments and regions.</p>
<p>Under the hood, the <strong>Semantic Router + Milvus</strong> pipeline is implemented in <strong>Go</strong> and <strong>Rust</strong> for high performance and low latency. Integrated at the gateway layer, it continuously monitors key metrics—like hit rates, routing latency, and model performance—to fine-tune routing strategies in real time.</p>
<h2 id="How-to-Quickly-Test-the-Semantic-Caching-in-the-Semantic-Router" class="common-anchor-header">How to Quickly Test the Semantic Caching in the Semantic Router<button data-href="#How-to-Quickly-Test-the-Semantic-Caching-in-the-Semantic-Router" class="anchor-icon" translate="no">
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
    </button></h2><p>Before deploying semantic caching at scale, it’s useful to validate how it behaves in a controlled setup. In this section, we’ll walk through a quick local test that shows how the Semantic Router uses <strong>Milvus</strong> as its semantic cache. You’ll see how similar queries hit the cache instantly while new or distinct ones trigger model generation—proving the caching logic in action.</p>
<h3 id="Prerequisites" class="common-anchor-header">Prerequisites</h3><ul>
<li>Container Environment: Docker + Docker Compose</li>
<li>Vector Database: Milvus Service</li>
<li>LLM + Embedding: Project downloaded locally</li>
</ul>
<h3 id="1Deploy-the-Milvus-Vector-Database" class="common-anchor-header">1.Deploy the Milvus Vector Database</h3><p>Download the deployment files</p>
<pre><code translate="no">wget https://github.com/Milvus-io/Milvus/releases/download/v2.5.12/Milvus-standalone-docker-compose.yml -O docker-compose.yml
<button class="copy-code-btn"></button></code></pre>
<p>Start the Milvus service.</p>
<pre><code translate="no">docker-compose up -d
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">docker-compose ps -a
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Start_the_Milvus_service_211f8b11f1.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="2-Clone-the-project" class="common-anchor-header">2. Clone the project</h3><pre><code translate="no">git <span class="hljs-built_in">clone</span> https://github.com/vllm-project/semantic-router.git
<button class="copy-code-btn"></button></code></pre>
<h3 id="3-Download-local-models" class="common-anchor-header">3. Download local models</h3><pre><code translate="no"><span class="hljs-built_in">cd</span> semantic-router
make download-models
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Download_local_models_6243011fa5.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="4-Configuration-Modifications" class="common-anchor-header">4. Configuration Modifications</h3><p>Note: Modify the semantic_cache type to milvus</p>
<pre><code translate="no">vim config.yaml
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">semantic_cache:
  enabled: true
  backend_type: <span class="hljs-string">&quot;milvus&quot;</span>  <span class="hljs-comment"># Options: &quot;memory&quot; or &quot;milvus&quot;</span>
  backend_config_path: <span class="hljs-string">&quot;config/cache/milvus.yaml&quot;</span>
  similarity_threshold: <span class="hljs-number">0.8</span>
  max_entries: <span class="hljs-number">1000</span>  <span class="hljs-comment"># Only applies to memory backend</span>
  ttl_seconds: <span class="hljs-number">3600</span>
  eviction_policy: <span class="hljs-string">&quot;fifo&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>Modify the Mmilvus configuration
Note: Fill in the Milvusmilvus service just deployed</p>
<pre><code translate="no">vim milvus.yaml
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no"><span class="hljs-comment"># Milvus connection settings</span>
connection:
  <span class="hljs-comment"># Milvus server host (change for production deployment)</span>
  host: <span class="hljs-string">&quot;192.168.7.xxx&quot;</span>  <span class="hljs-comment"># For production: use your Milvus cluster endpoint</span>
  <span class="hljs-comment"># Milvus server port</span>
  port: <span class="hljs-number">19530</span>  <span class="hljs-comment"># Standard Milvus port</span>
  <span class="hljs-comment"># Database name (optional, defaults to &quot;default&quot;)</span>
  database: <span class="hljs-string">&quot;default&quot;</span>
  <span class="hljs-comment"># Connection timeout in seconds</span>
  timeout: <span class="hljs-number">30</span>
  <span class="hljs-comment"># Authentication (enable for production)</span>
  auth:
    enabled: false  <span class="hljs-comment"># Set to true for production</span>
    username: <span class="hljs-string">&quot;&quot;</span>    <span class="hljs-comment"># Your Milvus username</span>
    password: <span class="hljs-string">&quot;&quot;</span>    <span class="hljs-comment"># Your Milvus password</span>
  <span class="hljs-comment"># TLS/SSL configuration (recommended for production)</span>
  tls:
    enabled: false      <span class="hljs-comment"># Set to true for secure connections</span>
    cert_file: <span class="hljs-string">&quot;&quot;</span>       <span class="hljs-comment"># Path to client certificate</span>
    key_file: <span class="hljs-string">&quot;&quot;</span>        <span class="hljs-comment"># Path to client private key</span>
    ca_file: <span class="hljs-string">&quot;&quot;</span>         <span class="hljs-comment"># Path to CA certificate</span>
<span class="hljs-comment"># Collection settings</span>
collection:
  <span class="hljs-comment"># Name of the collection to store cache entries</span>
  name: <span class="hljs-string">&quot;semantic_cache&quot;</span>
  <span class="hljs-comment"># Description of the collection</span>
  description: <span class="hljs-string">&quot;Semantic cache for LLM request-response pairs&quot;</span>
  <span class="hljs-comment"># Vector field configuration</span>
  vector_field:
    <span class="hljs-comment"># Name of the vector field</span>
    name: <span class="hljs-string">&quot;embedding&quot;</span>
    <span class="hljs-comment"># Dimension of the embeddings (auto-detected from model at runtime)</span>
    dimension: <span class="hljs-number">384</span>  <span class="hljs-comment"># This value is ignored - dimension is auto-detected from the embedding model</span>
    <span class="hljs-comment"># Metric type for similarity calculation</span>
    metric_type: <span class="hljs-string">&quot;IP&quot;</span>  <span class="hljs-comment"># Inner Product (cosine similarity for normalized vectors)</span>
  <span class="hljs-comment"># Index configuration for the vector field</span>
  index:
    <span class="hljs-comment"># Index type (HNSW is recommended for most use cases)</span>
    <span class="hljs-built_in">type</span>: <span class="hljs-string">&quot;HNSW&quot;</span>
    <span class="hljs-comment"># Index parameters</span>
    params:
      M: <span class="hljs-number">16</span>              <span class="hljs-comment"># Number of bi-directional links for each node</span>
      efConstruction: <span class="hljs-number">64</span>  <span class="hljs-comment"># Search scope during index construction</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="5-Start-the-project" class="common-anchor-header">5. Start the project</h3><p>Note: It is recommended to modify some Dockerfile dependencies to domestic sources</p>
<pre><code translate="no">docker compose --profile testing up --build
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Start_the_project_4e7c2a8332.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="6-Test-Requests" class="common-anchor-header">6. Test Requests</h3><p>Note: Two requests in total (no cache and cache hit)
First request:</p>
<pre><code translate="no"><span class="hljs-built_in">echo</span> <span class="hljs-string">&quot;=== 第一次请求（无缓存状态） ===&quot;</span> &amp;&amp; \
<span class="hljs-keyword">time</span> curl -X POST http://localhost:8801/v1/chat/completions \
  -H <span class="hljs-string">&quot;Content-Type: application/json&quot;</span> \
  -H <span class="hljs-string">&quot;Authorization: Bearer test-token&quot;</span> \
  -d <span class="hljs-string">&#x27;{
    &quot;model&quot;: &quot;auto&quot;,
    &quot;messages&quot;: [
      {&quot;role&quot;: &quot;system&quot;, &quot;content&quot;: &quot;You are a helpful assistant.&quot;},
      {&quot;role&quot;: &quot;user&quot;, &quot;content&quot;: &quot;What are the main renewable energy sources?&quot;}
    ],
    &quot;temperature&quot;: 0.7
  }&#x27;</span> | jq .
<button class="copy-code-btn"></button></code></pre>
<p>Output:</p>
<pre><code translate="no"><span class="hljs-built_in">real</span>    <span class="hljs-number">0</span>m16<span class="hljs-number">.546</span>s
user    <span class="hljs-number">0</span>m0<span class="hljs-number">.116</span>s
sys     <span class="hljs-number">0</span>m0<span class="hljs-number">.033</span>s
<button class="copy-code-btn"></button></code></pre>
<p>Second request:</p>
<pre><code translate="no"><span class="hljs-built_in">echo</span> <span class="hljs-string">&quot;=== 第二次请求（缓存状态） ===&quot;</span> &amp;&amp; \
<span class="hljs-keyword">time</span> curl -X POST http://localhost:8801/v1/chat/completions \
  -H <span class="hljs-string">&quot;Content-Type: application/json&quot;</span> \
  -H <span class="hljs-string">&quot;Authorization: Bearer test-token&quot;</span> \
  -d <span class="hljs-string">&#x27;{
    &quot;model&quot;: &quot;auto&quot;,
    &quot;messages&quot;: [
      {&quot;role&quot;: &quot;system&quot;, &quot;content&quot;: &quot;You are a helpful assistant.&quot;},
      {&quot;role&quot;: &quot;user&quot;, &quot;content&quot;: &quot;What are the main renewable energy sources?&quot;}
    ],
    &quot;temperature&quot;: 0.7
  }&#x27;</span> | jq .
<button class="copy-code-btn"></button></code></pre>
<p>Output:</p>
<pre><code translate="no"><span class="hljs-built_in">real</span>    <span class="hljs-number">0</span>m2<span class="hljs-number">.393</span>s
user    <span class="hljs-number">0</span>m0<span class="hljs-number">.116</span>s
sys     <span class="hljs-number">0</span>m0<span class="hljs-number">.021</span>s
<button class="copy-code-btn"></button></code></pre>
<p>This test demonstrates Semantic Router’s semantic caching in action. By leveraging Milvus as the vector database, it efficiently matches semantically similar queries, improving response times when users ask the same or similar questions.</p>
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
    </button></h2><p>As AI workloads grow and cost optimization becomes essential, the combination of vLLM Semantic Router and <a href="https://milvus.io/">Milvus</a> provides a practical way to scale intelligently. By routing each query to the right model and caching semantically similar results with a distributed vector database, this setup cuts compute overhead while keeping responses fast and consistent across use cases.</p>
<p>In short, you get smarter scaling—less brute force, more brains.</p>
<p>If you’d like to explore this further, join the conversation in our <a href="https://discord.com/invite/8uyFbECzPX">Milvus Discord</a> or open an issue on<a href="https://github.com/milvus-io/milvus"> GitHub</a>. You can also book a 20-minute<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus Office Hours session</a> for one-on-one guidance, insights, and technical deep dives from the team behind Milvus.</p>
