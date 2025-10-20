---
id: >-
  vllm-semantic-router-milvus-how-semantic-routing-and-caching-scale-ai-systems-the-smart-way.md
title: vLLM 语义路由器 + Milvus：语义路由和缓存如何以智能方式构建可扩展的人工智能系统
author: Min Yin
date: 2025-10-17T00:00:00.000Z
cover: assets.zilliz.com/Chat_GPT_Image_Oct_19_2025_04_30_18_PM_af7fda1170.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus, semantic routing, cache layer, vector database, vllm semantic router'
meta_title: Scale Your AI Apps the Smart Way with vLLM Semantic Router and Milvus
desc: 了解 vLLM、Milvus 和语义路由如何在可扩展部署中优化大型模型推理、降低计算成本并提升人工智能性能。
origin: >-
  https://milvus.io/blog/vllm-semantic-router-milvus-how-semantic-routing-and-caching-scale-ai-systems-the-smart-way.md
---
<p>大多数人工智能应用程序都依赖单一模型来处理每个请求。但这种方法很快就会受到限制。大型模型功能强大但成本高昂，即使用于简单查询也是如此。小型模型成本低、速度快，但无法处理复杂的推理。当流量激增时，比如你的人工智能应用突然在一夜之间拥有了千万用户，这种 "一个模型解决所有问题 "的低效率就会变得非常明显。延迟激增，GPU 费用爆炸，昨天还运行良好的模型开始喘不过气来。</p>
<p>而我的朋友，<em>你</em>，这个应用程序背后的工程师，必须尽快解决这个问题。</p>
<p>想象一下，部署多个不同大小的 ® 模型，让系统自动为每个请求选择最佳模型。简单的提示选择较小的模型，复杂的查询选择较大的模型。这就是<a href="https://github.com/vllm-project/semantic-router"><strong>vLLM Semantic Router（语义路由器</strong></a>）背后的理念<a href="https://github.com/vllm-project/semantic-router"><strong>--一种</strong></a>基于意义而非端点来引导请求的路由机制。它能分析每个输入的语义内容、复杂程度和意图，从而选择最合适的语言模型，确保每个查询都由最适合的模型来处理。</p>
<p>为了提高效率，语义路由器与充当<strong>语义缓存层</strong>的开源向量数据库<a href="https://milvus.io/"><strong>Milvus</strong></a> 配对。在重新计算响应之前，它会检查是否已经处理过语义相似的查询，如果发现，则立即检索缓存结果。这样做的结果是：响应速度更快、成本更低、检索系统能够智能扩展而不是浪费。</p>
<p>在本篇文章中，我们将深入探讨<strong>vLLM Semantic Router</strong>的工作原理、<strong>Milvus</strong>如何为其缓存层提供动力，以及这种架构如何应用于现实世界中的人工智能应用。</p>
<h2 id="What-is-a-Semantic-Router" class="common-anchor-header">什么是语义路由器？<button data-href="#What-is-a-Semantic-Router" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>语义路由器（Semantic Router</strong>）的核心是一个系统，它能根据给定请求的含义、复杂程度和意图来决定<em>由哪个模型</em>来处理。它不是将所有请求路由到一个模型，而是在多个模型之间智能地分配请求，以平衡准确性、延迟和成本。</p>
<p>从架构上讲，它建立在三个关键层上：<strong>语义路由</strong> <strong>层</strong>、<strong>混合模型层（MoM）</strong>和<strong>缓存层</strong>。</p>
<h3 id="Semantic-Routing-Layer" class="common-anchor-header">语义路由层</h3><p><strong>语义路由层</strong>是系统的大脑。它分析每个输入--要求什么、有多复杂、需要什么样的推理--从而选择最适合这项工作的模型。例如，一个简单的事实查询可能会进入一个轻量级模型，而一个多步骤推理查询则会进入一个大型模型。即使流量和查询多样性增加，这种动态路由也能保持系统的响应速度。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/modern_approach_714403b61c.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="The-Mixture-of-Models-MoM-Layer" class="common-anchor-header">混合模型（MoM）层</h3><p>第二层是<strong>混合模型层（MoM）</strong>，它将不同规模和功能的多个模型集成到一个统一的系统中。它的灵感来源于<a href="https://zilliz.com/learn/what-is-mixture-of-experts"><strong>混合专家</strong></a> <strong>（MoE）</strong>架构，但不是在一个大型模型内挑选 "专家"，而是在多个独立模型间操作符。这种设计减少了延迟，降低了成本，并避免了被任何单一模型提供商锁定。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/MOM_0a3eb61985.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="The-Cache-Layer-Where-Milvus-Makes-the-Difference" class="common-anchor-header">缓存层：Milvus 的与众不同之处</h3><p>最后，由<a href="https://milvus.io/">Milvus 向量数据库</a> <strong>驱动的缓存层充当</strong>系统的内存。在运行新查询之前，它会检查之前是否处理过语义相似的请求。如果是，它会立即检索缓存结果，从而节省计算时间并提高吞吐量。</p>
<p>传统的缓存系统依赖于内存中的键值存储，通过精确的字符串或模板来匹配请求。在查询重复且可预测的情况下，这种方法很有效。但实际用户很少会两次输入相同的内容。一旦措辞发生变化，哪怕是轻微的变化，缓存也无法将其识别为相同的意图。随着时间的推移，缓存的命中率会下降，性能提升也会随着语言的自然变化而消失。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/semantic_caching_for_vllm_routing_df889058c9.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>为了解决这个问题，我们需要能够理解<em>含义的</em>缓存，而不仅仅是匹配单词。这就是<strong>语义检索的</strong>用武之地。语义检索不是比较字符串，而是比较 Embeddings--捕捉语义相似性的高维向量表示。不过，挑战在于规模。在单台机器上对数百万或数十亿向量进行暴力搜索（时间复杂度为 O(N-d)）在计算上是令人望而却步的。内存成本爆炸式增长，水平可扩展性崩溃，系统难以处理突如其来的流量高峰或长尾查询。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/milvus_routing_system_5837b93074.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>作为专为大规模语义搜索而设计的分布式向量数据库，<strong>Milvus</strong>为缓存层带来了所需的水平可扩展性和容错性。它能跨节点高效存储 Embeddings，并以最小的延迟执行<a href="https://zilliz.com/blog/ANN-machine-learning">近似近邻</a>（ANN）搜索，即使在大规模搜索时也是如此。有了正确的相似性阈值和回退策略，Milvus 就能确保稳定、可预测的性能，将缓存层变成整个路由系统的弹性语义存储器。</p>
<h2 id="How-Developers-Are-Using-Semantic-Router-+-Milvus-in-Production" class="common-anchor-header">开发人员如何在生产中使用 Semantic Router + Milvus<button data-href="#How-Developers-Are-Using-Semantic-Router-+-Milvus-in-Production" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>vLLM Semantic Router</strong>和<strong>Milvus</strong>的组合在速度、成本和可重用性都很重要的实际生产环境中大放异彩。</p>
<p>其中有三种常见的应用场景最为突出：</p>
<h3 id="1-Customer-Service-QA" class="common-anchor-header">1.客户服务问答</h3><p>面向客户的机器人每天都要处理大量重复性查询--密码重置、账户更新、交付状态。这一领域对成本和延迟都很敏感，因此非常适合语义路由。路由器将常规问题发送给更小、更快的模型，并将复杂或模糊的问题升级到更大的模型进行更深入的推理。同时，Milvus 会缓存以前的问答对，因此当类似的查询出现时，系统可以立即重用过去的答案，而不是重新生成。</p>
<h3 id="2-Code-Assistance" class="common-anchor-header">2.代码辅助</h3><p>在开发人员工具或集成开发环境助手中，许多查询是重叠的--语法帮助、API 查询、小的调试提示。通过分析每个提示的语义结构，路由器可以动态地选择合适的模型大小：对于简单的任务，可以选择轻量级的模型；对于多步骤推理，则可以选择能力更强的模型。Milvus 通过缓存类似的编码问题及其解决方案，将先前的用户交互转化为可重复使用的知识库，从而进一步提高响应速度。</p>
<h3 id="3-Enterprise-Knowledge-Base" class="common-anchor-header">3.企业知识库</h3><p>企业查询往往会随着时间的推移而重复--政策查询、合规性参考、产品常见问题解答。利用 Milvus 作为语义缓存层，可以高效地存储和检索常见问题及其答案。这样就能最大限度地减少冗余计算，同时保持跨部门和跨地区响应的一致性。</p>
<p>在引擎盖下，<strong>语义路由器 + Milvus</strong>管道是用<strong>Go</strong>和<strong>Rust</strong>实现的，具有高性能和低延迟的特点。它集成在网关层，持续监控命中率、路由延迟和模型性能等关键指标，实时微调路由策略。</p>
<h2 id="How-to-Quickly-Test-the-Semantic-Caching-in-the-Semantic-Router" class="common-anchor-header">如何快速测试语义路由器中的语义缓存<button data-href="#How-to-Quickly-Test-the-Semantic-Caching-in-the-Semantic-Router" class="anchor-icon" translate="no">
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
    </button></h2><p>在大规模部署语义缓存之前，验证它在受控设置中的表现是非常有用的。在本节中，我们将进行一次快速本地测试，展示语义路由器（Semantic Router）是如何将<strong>Milvus</strong>用作其语义缓存的。您将看到，相似的查询会立即进入缓存，而新的或不同的查询则会触发模型生成--从而验证缓存逻辑的作用。</p>
<h3 id="Prerequisites" class="common-anchor-header">前提条件</h3><ul>
<li>容器环境：Docker + Docker Compose</li>
<li>向量数据库：Milvus 服务</li>
<li>LLM + Embeddings：本地下载项目</li>
</ul>
<h3 id="1Deploy-the-Milvus-Vector-Database" class="common-anchor-header">1.部署 Milvus 向量数据库</h3><p>下载部署文件</p>
<pre><code translate="no">wget https://github.com/Milvus-io/Milvus/releases/download/v2.5.12/Milvus-standalone-docker-compose.yml -O docker-compose.yml
<button class="copy-code-btn"></button></code></pre>
<p>启动 Milvus 服务。</p>
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
<h3 id="2-Clone-the-project" class="common-anchor-header">2.克隆项目</h3><pre><code translate="no">git <span class="hljs-built_in">clone</span> https://github.com/vllm-project/semantic-router.git
<button class="copy-code-btn"></button></code></pre>
<h3 id="3-Download-local-models" class="common-anchor-header">3.下载本地模型</h3><pre><code translate="no"><span class="hljs-built_in">cd</span> semantic-router
make download-models
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Download_local_models_6243011fa5.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="4-Configuration-Modifications" class="common-anchor-header">4.配置修改</h3><p>注意：将 semantic_cache 类型修改为 milvus</p>
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
<p>修改 Mmilvus 配置 注意：填写刚刚部署的 Milvusmilvus 服务</p>
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
<h3 id="5-Start-the-project" class="common-anchor-header">5.启动项目</h3><p>注意：建议将某些 Dockerfile 依赖项修改为国内资源</p>
<pre><code translate="no">docker compose --profile testing up --build
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Start_the_project_4e7c2a8332.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="6-Test-Requests" class="common-anchor-header">6.测试请求</h3><p>注：总共两个请求（无缓存和缓存命中） 第一个请求：</p>
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
<p>输出：</p>
<pre><code translate="no"><span class="hljs-built_in">real</span>    <span class="hljs-number">0</span>m16<span class="hljs-number">.546</span>s
user    <span class="hljs-number">0</span>m0<span class="hljs-number">.116</span>s
sys     <span class="hljs-number">0</span>m0<span class="hljs-number">.033</span>s
<button class="copy-code-btn"></button></code></pre>
<p>第二个请求</p>
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
<p>输出</p>
<pre><code translate="no"><span class="hljs-built_in">real</span>    <span class="hljs-number">0</span>m2<span class="hljs-number">.393</span>s
user    <span class="hljs-number">0</span>m0<span class="hljs-number">.116</span>s
sys     <span class="hljs-number">0</span>m0<span class="hljs-number">.021</span>s
<button class="copy-code-btn"></button></code></pre>
<p>本测试展示了 Semantic Router（语义路由器）的语义缓存功能。通过利用Milvus作为向量数据库，它可以高效地匹配语义相似的查询，从而在用户提出相同或相似的问题时提高响应速度。</p>
<h2 id="Conclusion" class="common-anchor-header">结论<button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p>随着人工智能工作负载的增长，成本优化变得至关重要，vLLM Semantic Router 和<a href="https://milvus.io/">Milvus</a>的结合为智能扩展提供了一种实用的方法。通过将每个查询路由到正确的模型，并利用分布式向量数据库缓存语义相似的结果，这种设置可以减少计算开销，同时保持跨用例响应的快速性和一致性。</p>
<p>简而言之，您将获得更智能的扩展--无需蛮力，更多智慧。</p>
<p>如果您想进一步了解这个问题，请加入我们的<a href="https://discord.com/invite/8uyFbECzPX">Milvus Discord 对话</a>，或在<a href="https://github.com/milvus-io/milvus"> GitHub</a> 上提交问题。您还可以预约 20 分钟的<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus Office Hours 会议</a>，获得 Milvus 背后团队的一对一指导、见解和技术深挖。</p>
