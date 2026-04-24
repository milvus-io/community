---
id: hermes-agent-learning-loop-milvus-hybrid-search.md
title: 如何使用 Milvus 2.6 混合搜索修复赫尔墨斯代理的学习循环问题
author: Min Yin
date: 2026-4-24
cover: >-
  assets.zilliz.com/hermes_agent_learning_loop_milvus_hybrid_search_md_2_e0b44ee562.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Hermes Agent, Milvus 2.6, hybrid search, agent memory, skill learning loop'
meta_title: |
  How to Fix Hermes Agent's Learning Loop with Milvus 2.6 Hybrid Search
desc: >-
  Hermes Agents 的 Learning Loop 可从使用中写入技能，但其 FTS5 retriever 会错过重新措辞的查询。Milvus
  2.6 混合搜索修复了跨会话召回问题。
origin: 'https://milvus.io/blog/hermes-agent-learning-loop-milvus-hybrid-search.md'
---
<p><strong>最近，</strong><a href="https://github.com/NousResearch/hermes-agent"><strong>Hermes Agent 的</strong></a> <strong>身影随处可见。</strong>Hermes 由 Nous Research 打造，是一个自托管的个人人工智能 Agents，可在你自己的硬件上运行（5 美元的 VPS 也可以），并通过 Telegram 等现有聊天渠道与你对话。</p>
<p><strong>它最大的亮点是内置的学习回路：</strong>回路根据经验创建技能，在使用过程中改进技能，并搜索过去的对话以找到可重复使用的模式。其他 Agents 框架都是在部署前手工编写技能代码。而 Hermes 的技能是从使用中成长起来的，重复的工作流程无需修改代码即可重复使用。</p>
<p><strong>不足之处在于，Hermes 的检索仅限于关键词。</strong>它只匹配准确的单词，而不匹配用户想要表达的意思。当用户在不同的会话中使用不同的措辞时，循环无法将它们连接起来，也就无法编写新的 Skill。当只有几百份文档时，这种差距还可以忍受。<strong>超过这个数量，循环就会停止学习，因为它找不到自己的历史记录。</strong></p>
<p><strong>Milvus 2.6 可以解决这个问题。</strong>它的<a href="https://milvus.io/docs/multi-vector-search.md">混合搜索</a>在一次查询中涵盖了含义和精确关键词，因此循环终于可以跨会话连接重新措辞的信息。它非常轻便，可以放在小型云服务器上（每月 5 美元的 VPS 就能运行）。换上它并不需要改变赫尔墨斯--Milvus 插在检索层后面，因此学习循环保持不变。Hermes 仍会选择要运行的技能，而 Milvus 则会处理要检索的内容。</p>
<p>但是，更深层次的回报远不止更好的检索：一旦检索成功，学习回路就能将检索策略本身作为一项技能存储起来，而不仅仅是检索内容。这样，Agent 的知识工作就能在不同的会话中复合起来。</p>
<h2 id="Hermes-Agent-Architecture-How-Four-Layer-Memory-Powers-the-Skill-Learning-Loop" class="common-anchor-header">赫尔墨斯代理架构：四层内存如何为技能学习回路提供动力<button data-href="#Hermes-Agent-Architecture-How-Four-Layer-Memory-Powers-the-Skill-Learning-Loop" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://github.com/NousResearch/hermes-agent"><strong>赫尔墨斯</strong></a> <strong>有四个记忆层，而 L4 技能是它与众不同的记忆层。</strong></p>
<ul>
<li><strong>L1</strong>- 会话上下文，在会话关闭时清除</li>
<li><strong>L2</strong>- 持久事实：项目堆栈、团队约定、已解决的决定</li>
<li><strong>L3</strong>- 通过本地文件进行 SQLite FTS5 关键字搜索</li>
<li><strong>L4</strong>- 将工作流程存储为 Markdown 文件。与开发人员在部署前编写代码的 LangChain 工具或 AutoGPT 插件不同，L4 技能是自编写的：它们从 Agents 实际运行的内容中发展而来，开发人员无需编写任何代码。</li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/hermes_agent_learning_loop_milvus_hybrid_search_md_3_3653368e99.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Why-Hermess-FTS5-Keyword-Retrieval-Breaks-the-Learning-Loop" class="common-anchor-header">为什么说 Hermes 的 FTS5 关键字检索打破了学习循环？<button data-href="#Why-Hermess-FTS5-Keyword-Retrieval-Breaks-the-Learning-Loop" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Hermes 首先需要检索来触发跨会话工作流。</strong>但其内置 L3 层使用的是 SQLite FTS5，只能匹配字面标记，而不能匹配含义。</p>
<p><strong>当用户在不同会话中以不同方式表达相同意图时，FTS5 就会错过匹配。</strong>学习循环不会启动。没有写入新的 Skill，下次再出现该意图时，用户又要重新手工路由。</p>
<p>示例：知识库存储了 "asyncio 事件循环、异步任务调度、非阻塞 I/O"。用户搜索 "Python 并发"。FTS5 返回零命中率--没有字面上的单词重叠，而且 FTS5 无法看出它们是同一个问题。</p>
<p>在几百个文档以下，这种差距是可以容忍的。超过这个范围，文档使用一种词汇，而用户使用另一种词汇提问，FTS5 无法在两者之间架起桥梁。<strong>无法检索的内容还不如不存在于知识库中，而学习循环也无从学习。</strong></p>
<h2 id="How-Milvus-26-Fixes-the-Retrieval-Gap-with-Hybrid-Search-and-Tiered-Storage" class="common-anchor-header">Milvus 2.6 如何通过混合搜索和分层存储弥补检索差距<button data-href="#How-Milvus-26-Fixes-the-Retrieval-Gap-with-Hybrid-Search-and-Tiered-Storage" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Milvus 2.6带来了两个符合Hermes故障点的升级。</strong> <strong>混合搜索</strong>通过在一次调用中同时涵盖语义和关键字检索，疏通了学习环路。<strong>分层存储</strong>使整个检索后端保持足够小的规模，可以在与 Hermes 相同的 5 美元/月 VPS 上运行。</p>
<h3 id="What-Hybrid-Search-Solves-Finding-Relevant-Information" class="common-anchor-header">混合搜索能解决什么问题？查找相关信息</h3><p>Milvus 2.6 支持在单个查询中同时运行向量检索（语义）和<a href="https://milvus.io/docs/full-text-search.md">BM25 全文检索</a>（关键词），然后通过<a href="https://milvus.io/docs/multi-vector-search.md">互惠排名融合（RRF）</a>合并两个排名列表。</p>
<p>例如：问 &quot;asyncio 的原理是什么&quot;，向量检索会命中语义相关的内容。问 &quot;<code translate="no">find_similar_task</code> 函数在哪里定义&quot;，BM25 会精确匹配代码中的函数名称。对于涉及特定任务类型中的函数的问题，混合搜索只需一次调用就能返回正确结果，无需手工编写路由逻辑。</p>
<p>对于赫尔墨斯来说，这就是 "学习循环 "的解锁。当第二个会话重新表述意图时，向量检索就会捕捉到 FTS5 错过的语义匹配。循环启动，新的 Skill 开始编写。</p>
<h3 id="What-Tiered-Storage-Solves-Cost" class="common-anchor-header">分层存储解决了什么问题？成本</h3><p>传统的向量数据库希望在 RAM 中建立完整的 Embeddings 索引，这将个人部署推向更大、更昂贵的基础设施。Milvus 2.6 采用三层存储，根据访问频率在层级之间移动条目，从而避免了这种情况：</p>
<ul>
<li><strong>热</strong>--在内存中</li>
<li><strong>热</strong>--在固态硬盘上</li>
<li><strong>冷</strong>--对象存储</li>
</ul>
<p>只有热数据才会常驻。500 篇文档的知识库可容纳在 2 GB 内存中。整个检索堆栈运行在与 Hermes 目标相同的每月 5 美元的 VPS 上，无需升级基础设施。</p>
<h2 id="Hermes-+-Milvus-System-Architecture" class="common-anchor-header">Hermes + Milvus：系统架构<button data-href="#Hermes-+-Milvus-System-Architecture" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>赫尔墨斯选择要运行的技能。Milvus 处理检索内容。</strong>两个系统保持独立，Hermes 的界面不会改变。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/hermes_agent_learning_loop_milvus_hybrid_search_md_4_1794304940.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>流程</strong></p>
<ol>
<li>赫尔墨斯会识别用户的意图，并将其导向一个技能。</li>
<li>该技能通过终端工具调用检索脚本。</li>
<li>脚本点击 Milvus，运行混合搜索，并返回带有源元数据的排序块。</li>
<li>赫尔墨斯合成答案。内存记录工作流程。</li>
<li>当相同的模式在不同会话中重复出现时，学习循环就会编写新的技能。</li>
</ol>
<h2 id="How-to-Install-Hermes-and-Milvus-26" class="common-anchor-header">如何安装 Hermes 和 Milvus 2.6<button data-href="#How-to-Install-Hermes-and-Milvus-26" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>安装 Hermes 和</strong> <a href="https://milvus.io/docs/install_standalone-docker.md"><strong>Milvus 2.6 Standalone</strong></a><strong>，然后创建一个带有密集字段和 BM25 字段的 Collections。</strong>这就是学习循环启动前的全部设置。</p>
<h3 id="Install-Hermes" class="common-anchor-header">安装赫尔墨斯</h3><pre><code translate="no" class="language-bash">curl -fsSL https://raw.githubusercontent.com/NousResearch/hermes-agent/main/scripts/install.sh | bash
<button class="copy-code-btn"></button></code></pre>
<p>运行<code translate="no">hermes</code> ，进入交互式启动向导：</p>
<ul>
<li><strong>LLM 提供商</strong>- OpenAI、Anthropic、OpenRouter（OpenRouter 有免费模型）</li>
<li><strong>通道</strong>--本攻略使用的是 FLark 机器人</li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/hermes_agent_learning_loop_milvus_hybrid_search_md_5_dceeae1519.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Run-Milvus-26-Standalone" class="common-anchor-header">运行 Milvus 2.6 单机版</h3><p>对于个人 Agents 而言，单节点独立运行即可：</p>
<pre><code translate="no" class="language-bash">curl -sfL https://raw.githubusercontent.com/milvus-io/milvus/master/scripts/standalone_embed.sh \
-o standalone_embed.sh
bash standalone_embed.sh start
<span class="hljs-comment"># Verify service status</span>
docker ps | grep milvus
<button class="copy-code-btn"></button></code></pre>
<h3 id="Create-the-Collection" class="common-anchor-header">创建 Collections</h3><p>Schema 设计盖住了检索能做的事。该 Schema 可并行运行密集向量和 BM25 稀疏向量：</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient, DataType, Function, FunctionType
client = MilvusClient(
    uri=<span class="hljs-string">&quot;http://192.168.x.x:19530&quot;</span>,
)
schema = client.create_schema(auto_id=<span class="hljs-literal">True</span>, enable_dynamic_field=<span class="hljs-literal">True</span>)
schema.add_field(<span class="hljs-string">&quot;id&quot;</span>, DataType.INT64, is_primary=<span class="hljs-literal">True</span>)
<span class="hljs-comment"># Raw text (for BM25 full-text search)</span>
schema.add_field(
    <span class="hljs-string">&quot;text&quot;</span>,
    DataType.VARCHAR,
    max_length=<span class="hljs-number">8192</span>,
    enable_analyzer=<span class="hljs-literal">True</span>,
    enable_match=<span class="hljs-literal">True</span>
)
<span class="hljs-comment"># Dense vector (semantic search)</span>
schema.add_field(<span class="hljs-string">&quot;dense_vector&quot;</span>, DataType.FLOAT_VECTOR, dim=<span class="hljs-number">1536</span>)
<span class="hljs-comment"># Sparse vector (BM25 auto-generated, Milvus 2.6 feature)</span>
schema.add_field(<span class="hljs-string">&quot;sparse_vector&quot;</span>, DataType.SPARSE_FLOAT_VECTOR)
schema.add_field(<span class="hljs-string">&quot;source&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">512</span>)
schema.add_field(<span class="hljs-string">&quot;chunk_index&quot;</span>, DataType.INT32)
<span class="hljs-comment"># Tell Milvus to auto-convert text to sparse_vector via BM25</span>
bm25_function = Function(
    name=<span class="hljs-string">&quot;text_bm25&quot;</span>,
    function_type=FunctionType.BM25,
    input_field_names=[<span class="hljs-string">&quot;text&quot;</span>],
    output_field_names=[<span class="hljs-string">&quot;sparse_vector&quot;</span>],
)
schema.add_function(bm25_function)
index_params = client.prepare_index_params()
<span class="hljs-comment"># HNSW graph index (dense vector)</span>
index_params.add_index(
    field_name=<span class="hljs-string">&quot;dense_vector&quot;</span>,
    index_type=<span class="hljs-string">&quot;HNSW&quot;</span>,
    metric_type=<span class="hljs-string">&quot;COSINE&quot;</span>,
    params={<span class="hljs-string">&quot;M&quot;</span>: <span class="hljs-number">16</span>, <span class="hljs-string">&quot;efConstruction&quot;</span>: <span class="hljs-number">256</span>}
)
<span class="hljs-comment"># BM25 inverted index (sparse vector)</span>
index_params.add_index(
    field_name=<span class="hljs-string">&quot;sparse_vector&quot;</span>,
    index_type=<span class="hljs-string">&quot;SPARSE_INVERTED_INDEX&quot;</span>,
    metric_type=<span class="hljs-string">&quot;BM25&quot;</span>
)
client.create_collection(
    collection_name=<span class="hljs-string">&quot;hermes_milvus&quot;</span>,
    schema=schema,
    index_params=index_params
)
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/hermes_agent_learning_loop_milvus_hybrid_search_md_6_0646f46d36.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Hybrid-Search-Script" class="common-anchor-header">混合搜索脚本</h3><pre><code translate="no" class="language-python"><span class="hljs-keyword">import</span> sys, json
<span class="hljs-keyword">from</span> openai <span class="hljs-keyword">import</span> OpenAI
<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient, AnnSearchRequest, RRFRanker

client = MilvusClient(<span class="hljs-string">&quot;http://192.168.x.x:19530&quot;</span>)
oai    = OpenAI()
COLLECTION = <span class="hljs-string">&quot;hermes_milvus&quot;</span>

<span class="hljs-keyword">def</span> <span class="hljs-title function_">hybrid_search</span>(<span class="hljs-params">query: <span class="hljs-built_in">str</span>, top_k: <span class="hljs-built_in">int</span> = <span class="hljs-number">5</span></span>) -&gt; <span class="hljs-built_in">list</span>[<span class="hljs-built_in">dict</span>]:
    <span class="hljs-comment"># 1. Vectorize query</span>
    dense_vec = oai.embeddings.create(
        model=<span class="hljs-string">&quot;text-embedding-3-small&quot;</span>,
        <span class="hljs-built_in">input</span>=query
    ).data[<span class="hljs-number">0</span>].embedding

    <span class="hljs-comment"># 2. Dense vector retrieval (semantic relevance)</span>
    dense_req = AnnSearchRequest(
        data=[dense_vec],
        anns_field=<span class="hljs-string">&quot;dense_vector&quot;</span>,
        param={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;COSINE&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;ef&quot;</span>: <span class="hljs-number">128</span>}},
        limit=top_k * <span class="hljs-number">2</span>       <span class="hljs-comment"># Widen candidate set, let RRF do final ranking</span>
    )

    <span class="hljs-comment"># 3. BM25 sparse vector retrieval (exact term matching)</span>
    bm25_req = AnnSearchRequest(
        data=[query],
        anns_field=<span class="hljs-string">&quot;sparse_vector&quot;</span>,
        param={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;BM25&quot;</span>},
        limit=top_k * <span class="hljs-number">2</span>
    )

    <span class="hljs-comment"># 4. RRF fusion ranking</span>
    results = client.hybrid_search(
        collection_name=COLLECTION,
        reqs=[dense_req, bm25_req],
        ranker=RRFRanker(k=<span class="hljs-number">60</span>),
        limit=top_k,
        output_fields=[<span class="hljs-string">&quot;text&quot;</span>, <span class="hljs-string">&quot;source&quot;</span>, <span class="hljs-string">&quot;doc_type&quot;</span>]
    )

    <span class="hljs-keyword">return</span> [
        {
            <span class="hljs-string">&quot;text&quot;</span>:     r.entity.get(<span class="hljs-string">&quot;text&quot;</span>),
            <span class="hljs-string">&quot;source&quot;</span>:   r.entity.get(<span class="hljs-string">&quot;source&quot;</span>),
            <span class="hljs-string">&quot;doc_type&quot;</span>: r.entity.get(<span class="hljs-string">&quot;doc_type&quot;</span>),
            <span class="hljs-string">&quot;score&quot;</span>:    <span class="hljs-built_in">round</span>(r.distance, <span class="hljs-number">4</span>)
        }
        <span class="hljs-keyword">for</span> r <span class="hljs-keyword">in</span> results[<span class="hljs-number">0</span>]
    ]

<span class="hljs-keyword">if</span> __name__ == <span class="hljs-string">&quot;__main__&quot;</span>:
    query= sys.argv[<span class="hljs-number">1</span>] <span class="hljs-keyword">if</span> <span class="hljs-built_in">len</span>(sys.argv) &gt; <span class="hljs-number">1</span> <span class="hljs-keyword">else</span> <span class="hljs-string">&quot;&quot;</span>
    top_k  = <span class="hljs-built_in">int</span>(sys.argv[<span class="hljs-number">2</span>]) <span class="hljs-keyword">if</span> <span class="hljs-built_in">len</span>(sys.argv) &gt; <span class="hljs-number">2</span> <span class="hljs-keyword">else</span> <span class="hljs-number">5</span>
    output = hybrid_search(query, top_k)
    <span class="hljs-built_in">print</span>(json.dumps(output, ensure_ascii=<span class="hljs-literal">False</span>, indent=<span class="hljs-number">2</span>))
<button class="copy-code-btn"></button></code></pre>
<p><code translate="no">text-embedding-3-small</code> 是仍能保持检索质量的最便宜的 OpenAI 嵌入；如果预算允许，可以换成<code translate="no">text-embedding-3-large</code> <strong>。</strong></p>
<p>环境和知识库准备就绪后，下一节将对学习循环进行测试。</p>
<h2 id="Hermes-Skill-Auto-Generation-in-Practice" class="common-anchor-header">赫尔墨斯技能自动生成实践<button data-href="#Hermes-Skill-Auto-Generation-in-Practice" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>两个会话展示了学习循环的运行情况。</strong>在第一个环节中，用户手动为脚本命名。在第二个会话中，新会员提出了同样的问题，但没有给脚本命名。赫尔墨斯掌握了这一模式，并编写了三个技能。</p>
<h3 id="Session-1-Call-the-Script-by-Hand" class="common-anchor-header">环节 1：手动调用脚本</h3><p>在云雀中打开赫尔墨斯。向它提供脚本路径和检索目标。赫尔墨斯会调用终端工具，运行脚本，并返回带有源代码的答案。<strong>目前还不存在技能。这是一个普通的工具调用。</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/hermes_agent_learning_loop_milvus_hybrid_search_md_7_1c2d9261f4.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Session-2-Ask-Without-Naming-the-Script" class="common-anchor-header">环节 2：在不命名脚本的情况下提问</h3><p>清除对话。重新开始。提出同一类问题，但不提及脚本或路径。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/hermes_agent_learning_loop_milvus_hybrid_search_md_8_27253eda82.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Memory-Writes-First-Skill-Follows" class="common-anchor-header">记忆先行，技能随后</h3><p><strong>学习循环记录工作流程（脚本、参数、返回形状）并返回答案。</strong>记忆保存跟踪，技能尚不存在。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/hermes_agent_learning_loop_milvus_hybrid_search_md_9_a0768f84bd.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>第二个会话的匹配会告诉循环这个模式值得保留。</strong>当它启动时，会写入三个技能：</p>
<table>
<thead>
<tr><th>技能</th><th>作用</th></tr>
</thead>
<tbody>
<tr><td><code translate="no">hybrid-search-doc-qa</code></td><td>在内存中运行语义+关键字混合搜索并撰写答案</td></tr>
<tr><td><code translate="no">milvus-docs-ingest-verification</code></td><td>验证文档是否已输入知识库</td></tr>
<tr><td><code translate="no">terminal</code></td><td>运行 shell 命令：脚本、环境设置、检查</td></tr>
</tbody>
</table>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/hermes_agent_learning_loop_milvus_hybrid_search_md_10_b68e35bc46.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>从这时起，<strong>用户不再命名技能。</strong>赫尔墨斯会推断出用户的意图，然后路由到技能，从内存中提取相关内容，并写入答案。提示中没有技能选择器。</p>
<p>大多数 RAG（检索增强生成）系统都能解决存储和获取问题，但获取逻辑本身是硬编码在应用程序代码中的。如果以不同的方式或在新的场景中提问，检索就会中断。赫耳墨斯将获取策略存储为 Skill，这意味着<strong>获取路径变成了你可以阅读、编辑和修改的文档。</strong> <code translate="no">💾 Memory updated · Skill 'hybrid-search-doc-qa' created</code> 这一行并不是设置完成的标记。它是<strong>Agents 将行为模式保存在长期记忆中。</strong></p>
<h2 id="Hermes-vs-OpenClaw-Accumulation-vs-Orchestration" class="common-anchor-header">赫尔墨斯与 OpenClaw：积累与协调<button data-href="#Hermes-vs-OpenClaw-Accumulation-vs-Orchestration" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Hermes和OpenClaw解决的是不同的问题。</strong>赫尔墨斯是为单个 Agents 而设计的，它可以在不同的会话中积累记忆和技能。OpenClaw 则是将复杂的任务分解成多个部分，然后将每个部分交给专门的 Agents。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/hermes_agent_learning_loop_milvus_hybrid_search_md_11_afcb575d50.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>OpenClaw 的优势在于协调。它能优化任务自动完成的程度。赫尔墨斯的优势在于积累：单个 Agents 可跨会话记忆，其技能在使用中不断增长。Hermes 可优化长期环境和领域经验。</p>
<p><strong>这两个框架可以堆叠。</strong>Hermes 有一个一步到位的迁移路径，可将<code translate="no">~/.openclaw</code> 内存和技能拉入 Hermes 的内存层。协调堆栈可以位于顶层，下面是积累代理。</p>
<p>关于 OpenClaw 的拆分，请参阅《<a href="https://milvus.io/blog/openclaw-formerly-clawdbot-moltbot-explained-a-complete-guide-to-the-autonomous-ai-agent.md">什么是 OpenClaw？</a>Milvus 博客上的<a href="https://milvus.io/blog/openclaw-formerly-clawdbot-moltbot-explained-a-complete-guide-to-the-autonomous-ai-agent.md">开源人工智能 Agents 完整指南</a>。</p>
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
    </button></h2><p>赫尔墨斯的 "学习循环"（Learning Loop）可将重复的工作流程转化为可重复使用的技能，但前提是检索能够跨会话连接它们。FTS5 关键字搜索无法做到这一点。<a href="https://milvus.io/docs/multi-vector-search.md"><strong>Milvus 2.6 混合搜索</strong></a>可以：密集向量处理意义，BM25 处理精确关键词，RRF 合并两者，<a href="https://milvus.io/docs/tiered-storage-overview.md">分层存储</a>将整个堆栈保存在每月 5 美元的 VPS 上。</p>
<p>更重要的一点是：一旦检索成功，Agent 不仅能存储更好的答案，还能存储更好的检索策略。获取路径成为一个可版本化的文档，并随着使用而不断改进。这就是积累领域专业知识的 Agents 与每次会话都从头开始的 Agents 的区别所在。有关其他 Agents 如何处理（或未能处理）这一问题的比较，请参阅《<a href="https://milvus.io/blog/claude-code-memory-memsearch.md">克劳德代码的记忆系统解析》。</a></p>
<h2 id="Get-Started" class="common-anchor-header">开始使用<button data-href="#Get-Started" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>试用本文中的工具：</strong></p>
<ul>
<li><a href="https://github.com/NousResearch/hermes-agent">GitHub 上的 Hermes Agent</a>- 上面使用的安装脚本、提供商设置和通道配置。</li>
<li><a href="https://milvus.io/docs/install_standalone-docker.md">Milvus 2.6 Standalone 快速入门</a>--知识库后端的单节点 Docker 部署。</li>
<li><a href="https://milvus.io/docs/multi-vector-search.md">Milvus 混合搜索教程</a>--与本帖中的脚本相匹配的全密集 + BM25 + RRF 示例。</li>
</ul>
<p><strong>有关于 Hermes + Milvus 混合搜索的问题？</strong></p>
<ul>
<li>加入<a href="https://discord.gg/milvus">Milvus Discord</a>，询问有关混合搜索、分层存储或技能路由模式的问题--其他开发人员正在构建类似的堆栈。</li>
<li><a href="https://milvus.io/community#office-hours">预订 Milvus Office Hours 会议</a>，与 Milvus 团队一起了解自己的代理和知识库设置。</li>
</ul>
<p><strong>想跳过自助托管？</strong></p>
<ul>
<li><a href="https://cloud.zilliz.com/signup">注册</a>或<a href="https://cloud.zilliz.com/login">登录</a>Zilliz Cloud - 开箱即用的混合搜索和分层存储管理 Milvus。新的工作邮件账户可获得<strong> 100 美元的免费积分</strong>。</li>
</ul>
<h2 id="Further-Reading" class="common-anchor-header">更多阅读<button data-href="#Further-Reading" class="anchor-icon" translate="no">
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
<li><a href="https://milvus.io/docs/release_notes.md">Milvus 2.6 发布说明</a>--分层存储、混合搜索、Schema 更改</li>
<li><a href="https://zilliz.com/blog">Zilliz Cloud &amp; Milvus CLI + Official Skills</a>- Milvus 本地代理的操作符工具</li>
<li><a href="https://zilliz.com/blog">为什么 RAG 式知识管理对 Agents 不利</a>？</li>
<li><a href="https://zilliz.com/blog">克劳德代码的内存系统比你想象的更原始</a>--关于另一个 Agents 内存堆栈的对比文章</li>
</ul>
<h2 id="Frequently-Asked-Questions" class="common-anchor-header">常见问题<button data-href="#Frequently-Asked-Questions" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="How-does-Hermes-Agents-Skill-Learning-Loop-actually-work" class="common-anchor-header">Hermes Agent 的技能学习循环究竟是如何运作的？</h3><p>赫尔墨斯会把运行的每一个工作流程--调用的脚本、传递的参数和返回的形状--记录下来，作为记忆跟踪。当相同的模式出现在两个或两个以上的会话中时，学习循环就会启动，并写入一个可重复使用的技能（Skill）：一个将工作流程作为可重复程序捕获的 Markdown 文件。从这一点出发，Hermes 只根据意图路由到 Skill，而不需要用户命名。关键的依存关系是检索--只有在能找到早期会话跟踪的情况下，循环才会启动，这就是为什么纯关键字搜索会成为大规模搜索的瓶颈。</p>
<h3 id="Whats-the-difference-between-hybrid-search-and-vector-only-search-for-agent-memory" class="common-anchor-header">对于 Agents 内存，混合搜索和纯向量搜索有什么区别？</h3><p>纯向量搜索能很好地处理意义，但会错过精确匹配。如果开发人员粘贴了 ConnectionResetError 这样的错误字符串或 find_similar_task 这样的函数名称，纯向量搜索可能会返回语义相关但错误的结果。混合搜索将密集向量（语义）与 BM25（关键字）结合起来，并通过互易等级融合（Reciprocal Rank Fusion）合并两个结果集。对于 Agents 内存（查询范围从模糊的意图（"Python 并发"）到精确的符号），混合搜索只需一次调用即可覆盖两端，无需在应用层中进行路由逻辑。</p>
<h3 id="Can-I-use-Milvus-hybrid-search-with-AI-agents-other-than-Hermes" class="common-anchor-header">我能否将 Milvus 混合搜索与其他人工智能 Agents 一起使用？</h3><p>可以。集成模式是通用的：Agent 调用检索脚本，脚本查询 Milvus，结果以带有源元数据的排序块形式返回。任何支持工具调用或 shell 执行的 Agents 框架都可以使用相同的方法。Hermes 恰好非常适合，因为它的 "学习循环"（Learning Loop）特别依赖于跨会话检索来启动，但 Milvus 方面与 Agents 无关--它不知道也不关心是哪个代理在调用它。</p>
<h3 id="How-much-does-a-self-hosted-Milvus-+-Hermes-setup-cost-per-month" class="common-anchor-header">自托管的 Milvus + Hermes 设置每月费用是多少？</h3><p>在 2 核 / 4 GB VPS 上运行 Milvus 2.6 Standalone 单节点，带分层存储，每月约 5 美元。OpenAI text-embeddings-3-small 的成本为每 100 万个代币 0.02 美元--个人知识库每月只需几美分。LLM 推理在总成本中占主导地位，并随使用量而扩展，而不是随检索堆栈而扩展。</p>
