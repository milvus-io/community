---
id: milvus-3-0-structarray.md
title: 一个实体，多个向量：使用 Milvus 3.0 StructArray 进行实体级与元素级检索
author: Chenjie Tang
date: 2026-8-19
cover: assets.zilliz.com/milvus_3_0_entity_and_element_level_search_28bba6d843.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  Milvus 3.0, StructArray, multi-vector search, EmbeddingList search,
  element-level search
meta_title: |
  Milvus 3.0 StructArray: Multi-Vector Search Within One Entity
desc: 一个实体可以包含多个对齐的向量和元数据字段，并且 Milvus 可以搜索整个实体或单个元素，而无需将数据展平为单独的行。
origin: 'https://milvus.io/blog/milvus-3-0-structarray.md'
---
<p>大多数向量数据库的 Schema 都始于一个简单的假设：一个实体对应一个 Embedding。产品有一个向量，文档也是如此。用户查询经过 Embedding 处理后，通过近似最近邻（ANN）搜索与这些向量进行比较。这一模型适用于第一代向量搜索用例，包括 RAG、语义搜索和推荐系统。</p>
<p><strong>然而，现实世界中的 AI 数据很少符合这一假设。</strong>视频包含片段、镜头或关键帧，每个都有自己的 Embedding、时间范围、字幕、场景标签和置信度分数。一个产品可能有多个图像和视角。长文档包含段落或章节，其局部含义比整个文档的单个 Embedding 更重要。流行的 late-interaction 模型在更细的粒度上暴露了同样的限制：ColBERT 为每个 token 生成一个向量，而 ColPali 为每个视觉补丁生成一个向量。</p>
<p>在每种情况下，父实体仍然是应用程序存储、展示、保护和返回的单位。然而，相关性、过滤和结果解释往往取决于该实体内部的元素。</p>
<p><strong>新的 StructArray 功能为 Milvus 提供了一种针对这种形态的原生数据模型：一个实体包含一个由 Schema 定义的 Struct 元素组成的有序数组，每个元素可以携带标量元数据、向量 Embedding，或两者兼有。</strong>Milvus 可以过滤属于同一元素的字段、在实体级别比较两个 Embedding 列表，或搜索单个元素并返回匹配的偏移量。</p>
<p>本文以视频搜索为例解释这一数据模型，然后依次介绍 Schema 设计、过滤、向量搜索粒度、EmbeddingList 索引策略、混合结果折叠，以及使该功能可执行的物理布局。</p>
<h2 id="Why-one-vector-and-one-flat-row-model-are-no-longer-enough" class="common-anchor-header">为什么单一向量和扁平行模型已不再够用<button data-href="#Why-one-vector-and-one-flat-row-model-are-no-longer-enough" class="anchor-icon" translate="no">
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
    </button></h2><p>假设用户要在视频目录中搜索“一个人在厨房切菜”。相关信号可能存在于一个八秒钟的片段中，而不是整个视频的 Embedding 中。<strong>将每个片段、对象和动作压缩到一个向量中或许能保留大主题，但可能会冲淡局部细节。</strong></p>
<p>同样的不匹配也出现在其他工作负载中：</p>
<ul>
<li>产品的相关性可能来自多个图像或角度中的某一个。</li>
<li>文档的匹配可能源于某一个段落，而不是其整体主题。</li>
<li>Agent 记忆可能包含多条观察记录，但只有其中一条对当前任务重要。</li>
<li>ColBERT 或 ColPali 记录包含一个可变长度的 token 或补丁向量列表，而不是一个稠密向量。</li>
</ul>
<p>一种替代方案是将每个片段、图像或段落拆分为独立的数据库行。这样可以实现局部搜索，但也会将每个片段与其父实体分离。父级元数据可能跨行重复，实体级检索随后需要在片段搜索之后进行分组、去重和重排序。</p>
<p>仅靠嵌套存储并不能解决查询问题。JSON 可以存储对象，但它不能为 Milvus 提供预定义的子字段 Schema 用于向量和标量索引。并行数组可以存储字幕、场景标签和置信度值，但应用程序必须维护偏移量对齐。数据库无法安全地推断 <code translate="no">scene_type[3]</code> 和 <code translate="no">label_confidence[3]</code> 描述的是同一个片段，除非这种关系是数据模型的一部分。</p>
<p>StructArray 直接编码了这种关系。它将局部元素保留在父实体内部，同时将其对齐的子字段暴露给 Schema 校验、索引、过滤和向量搜索。</p>
<h2 id="What-is-StructArray-and-its-data-model" class="common-anchor-header">什么是 StructArray 及其数据模型？<button data-href="#What-is-StructArray-and-its-data-model" class="anchor-icon" translate="no">
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
    </button></h2><p>StructArray，也称为结构体数组，在每个实体中存储一组有序的 Struct 元素。StructArray 字段是一个 <code translate="no">Array</code>，其元素都遵循一个预定义的 <code translate="no">Struct</code> Schema。对于视频 Collection，其逻辑形态如下所示：</p>
<pre><code translate="no">Plaintext
clips: ARRAY&lt;STRUCT&lt;
    clip_embedding_list: FLOAT_VECTOR,
    clip_embedding: FLOAT_VECTOR,
    start_sec: DOUBLE,
    end_sec: DOUBLE,
    caption: VARCHAR,
    scene_type: VARCHAR,
    label_confidence: FLOAT
&gt;&gt;
<button class="copy-code-btn"></button></code></pre>
<p>其中：</p>
<ul>
<li><code translate="no">clips</code> 是父级 StructArray 字段。</li>
<li><code translate="no">clip_embedding_list</code>、<code translate="no">clip_embedding</code>、<code translate="no">start_sec</code> 和其他属性都是子字段。</li>
<li><code translate="no">clips[0]</code> 是第一个片段。</li>
<li>偏移量 <code translate="no">0</code> 处的每个子字段都属于同一个片段。</li>
<li>偏移量 <code translate="no">3</code> 处的每个子字段都属于另一个片段。</li>
</ul>
<p>这两个向量子字段服务于不同的搜索模式。<code translate="no">clips[clip_embedding_list]</code> 使用 <code translate="no">MAX_SIM*</code> 度量进行索引，用于实体级 EmbeddingList 搜索；而 <code translate="no">clips[clip_embedding]</code> 使用常规向量度量进行索引，用于元素级搜索。由于一个向量字段或向量子字段只能接受一个索引，因此需要两种模式的 Collection 必须分别定义和索引这两个子字段。</p>
<p>该模型支持三种不同的查询语义。</p>
<h3 id="1-EmbeddingList-search-returns-parent-entities" class="common-anchor-header">1. EmbeddingList 搜索返回父实体</h3><p><code translate="no">clips[clip_embedding_list]</code> 中的向量构成该视频的一个 Embedding 列表。查询也是一个 <code translate="no">EmbeddingList</code>。Milvus 使用 <code translate="no">MAX_SIM*</code> 度量将查询列表与每个存储的列表进行比较，并返回实体级结果。</p>
<pre><code translate="no">Plaintext
clips[clip_embedding_list] = [
    embedding_0,
    embedding_1,
    embedding_2,
    ...
]
<button class="copy-code-btn"></button></code></pre>
<h3 id="2-The-MATCH-family-filters-parent-entities" class="common-anchor-header">2. <code translate="no">MATCH_*</code> 系列筛选父实体</h3><p><code translate="no">MATCH_ANY</code>、<code translate="no">MATCH_ALL</code>、<code translate="no">MATCH_LEAST</code>、<code translate="no">MATCH_MOST</code> 和 <code translate="no">MATCH_EXACT</code> 会对 Struct 元素求值一个谓词，统计有多少元素满足该谓词，然后决定父实体是否通过过滤。</p>
<p>例如：</p>
<pre><code translate="no">Plaintext
<span class="hljs-title function_">MATCH_ANY</span><span class="hljs-params">(clips, $[scene_type] == <span class="hljs-string">&quot;kitchen&quot;</span> &amp;&amp; $[label_confidence] &gt; <span class="hljs-number">0.8</span>)</span>
<button class="copy-code-btn"></button></code></pre>
<p>两个标量条件必须在同一个片段偏移量上同时成立。Milvus 不会将一个片段的厨房标签与另一个片段的高置信度值组合在一起。</p>
<h3 id="3-Element-level-search-returns-the-matching-element-offset" class="common-anchor-header">3. 元素级搜索返回匹配的元素偏移量</h3><p>常规查询向量可以独立搜索 <code translate="no">clips[clip_embedding]</code> 中的每个向量。每个命中结果都会标识父实体以及匹配 Struct 元素的从零开始的偏移量。<code translate="no">element_filter</code> 可以限制哪些元素参与该向量搜索。</p>
<p>这些操作共享一个前提：Milvus 知道哪些向量和标量值属于同一个元素，以及哪些元素属于同一个实体。</p>
<p>StructArray 并不是一个通用的任意嵌套系统。其当前模型是一个包含受支持的标量和向量子字段的 <code translate="no">Struct</code> 元素 <code translate="no">Array</code>。这一边界使得子字段索引和元素感知执行变得可行。</p>
<h2 id="Build-the-schema-indexes-and-insert-path" class="common-anchor-header">构建 Schema、索引和插入路径<button data-href="#Build-the-schema-indexes-and-insert-path" class="anchor-icon" translate="no">
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
    </button></h2><p>以下简化的 PyMilvus 示例创建了一个视频 Collection，其中包含一个顶层向量和一个用于片段的 StructArray。它使用了独立的片段向量子字段，以便同一个 Collection 可以演示两种搜索模式。</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> DataType, MilvusClient

client = MilvusClient(uri=<span class="hljs-string">&quot;http://localhost:19530&quot;</span>)

schema = client.create_schema(auto_id=<span class="hljs-literal">False</span>, enable_dynamic_field=<span class="hljs-literal">False</span>)
schema.add_field(<span class="hljs-string">&quot;id&quot;</span>, DataType.INT64, is_primary=<span class="hljs-literal">True</span>)
schema.add_field(<span class="hljs-string">&quot;title&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">512</span>)
schema.add_field(<span class="hljs-string">&quot;video_embedding&quot;</span>, DataType.FLOAT_VECTOR, dim=<span class="hljs-number">768</span>)

<span class="hljs-comment"># Define the Struct schema explicitly.</span>
clip_schema = client.create_struct_field_schema()
clip_schema.add_field(<span class="hljs-string">&quot;clip_embedding_list&quot;</span>, DataType.FLOAT_VECTOR, dim=<span class="hljs-number">768</span>)
clip_schema.add_field(<span class="hljs-string">&quot;clip_embedding&quot;</span>, DataType.FLOAT_VECTOR, dim=<span class="hljs-number">768</span>)
clip_schema.add_field(<span class="hljs-string">&quot;start_sec&quot;</span>, DataType.DOUBLE)
clip_schema.add_field(<span class="hljs-string">&quot;end_sec&quot;</span>, DataType.DOUBLE)
clip_schema.add_field(<span class="hljs-string">&quot;caption&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">2048</span>)
clip_schema.add_field(<span class="hljs-string">&quot;scene_type&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">128</span>)
clip_schema.add_field(<span class="hljs-string">&quot;label_confidence&quot;</span>, DataType.FLOAT)

schema.add_field(
    <span class="hljs-string">&quot;clips&quot;</span>,
    datatype=DataType.ARRAY,
    element_type=DataType.STRUCT,
    struct_schema=clip_schema,
    max_capacity=<span class="hljs-number">1024</span>,
)

client.create_collection(<span class="hljs-string">&quot;videos&quot;</span>, schema=schema)
<button class="copy-code-btn"></button></code></pre>
<p>向量子字段必须在搜索之前建立索引。由于度量族决定了搜索模式，因此每个向量子字段都有自己的索引：</p>
<pre><code translate="no" class="language-python">index_params = client.prepare_index_params()

<span class="hljs-meta"># EmbeddingList search.</span>
index_params.add_index(
    field_name=<span class="hljs-string">&quot;clips[clip_embedding_list]&quot;</span>,
    index_type=<span class="hljs-string">&quot;HNSW&quot;</span>,
    metric_type=<span class="hljs-string">&quot;MAX_SIM_COSINE&quot;</span>,
    index_name=<span class="hljs-string">&quot;clips_clip_embedding_list_maxsim_idx&quot;</span>,
    <span class="hljs-keyword">params</span>={<span class="hljs-string">&quot;M&quot;</span>: <span class="hljs-number">16</span>, <span class="hljs-string">&quot;efConstruction&quot;</span>: <span class="hljs-number">200</span>},
)

<span class="hljs-meta"># Element-level search.</span>
index_params.add_index(
    field_name=<span class="hljs-string">&quot;clips[clip_embedding]&quot;</span>,
    index_type=<span class="hljs-string">&quot;HNSW&quot;</span>,
    metric_type=<span class="hljs-string">&quot;COSINE&quot;</span>,
    index_name=<span class="hljs-string">&quot;clips_clip_embedding_cosine_idx&quot;</span>,
    <span class="hljs-keyword">params</span>={<span class="hljs-string">&quot;M&quot;</span>: <span class="hljs-number">16</span>, <span class="hljs-string">&quot;efConstruction&quot;</span>: <span class="hljs-number">200</span>},
)

client.create_index(<span class="hljs-string">&quot;videos&quot;</span>, index_params=index_params)
<button class="copy-code-btn"></button></code></pre>
<p>标量索引是可选的，但经常出现在大规模过滤中的子字段应使用兼容的标量索引。例如，<code translate="no">clips[scene_type]</code> 可以使用倒排索引，而 <code translate="no">clips[label_confidence]</code> 等数值子字段可以使用适合数值过滤的索引。</p>
<p>以自然的实体形态插入数据：一行视频记录包含一个片段对象数组。为保持示例简洁，这里将相同的片段向量写入两个向量子字段。</p>
<pre><code translate="no" class="language-python">rows = [
    {
        <span class="hljs-string">&quot;id&quot;</span>: <span class="hljs-number">1</span>,
        <span class="hljs-string">&quot;title&quot;</span>: <span class="hljs-string">&quot;cooking tutorial&quot;</span>,
        <span class="hljs-string">&quot;video_embedding&quot;</span>: video_vec,
        <span class="hljs-string">&quot;clips&quot;</span>: [
            {
                <span class="hljs-string">&quot;clip_embedding_list&quot;</span>: clip_vec_1,
                <span class="hljs-string">&quot;clip_embedding&quot;</span>: clip_vec_1,
                <span class="hljs-string">&quot;start_sec&quot;</span>: <span class="hljs-number">0.0</span>,
                <span class="hljs-string">&quot;end_sec&quot;</span>: <span class="hljs-number">8.0</span>,
                <span class="hljs-string">&quot;caption&quot;</span>: <span class="hljs-string">&quot;A person washes vegetables.&quot;</span>,
                <span class="hljs-string">&quot;scene_type&quot;</span>: <span class="hljs-string">&quot;kitchen&quot;</span>,
                <span class="hljs-string">&quot;label_confidence&quot;</span>: <span class="hljs-number">0.92</span>,
            },
            {
                <span class="hljs-string">&quot;clip_embedding_list&quot;</span>: clip_vec_2,
                <span class="hljs-string">&quot;clip_embedding&quot;</span>: clip_vec_2,
                <span class="hljs-string">&quot;start_sec&quot;</span>: <span class="hljs-number">8.0</span>,
                <span class="hljs-string">&quot;end_sec&quot;</span>: <span class="hljs-number">16.0</span>,
                <span class="hljs-string">&quot;caption&quot;</span>: <span class="hljs-string">&quot;A person cuts carrots on a board.&quot;</span>,
                <span class="hljs-string">&quot;scene_type&quot;</span>: <span class="hljs-string">&quot;kitchen&quot;</span>,
                <span class="hljs-string">&quot;label_confidence&quot;</span>: <span class="hljs-number">0.96</span>,
            },
        ],
    }
]

client.<span class="hljs-title function_">insert</span>(<span class="hljs-string">&quot;videos&quot;</span>, rows)
client.<span class="hljs-title function_">flush</span>(<span class="hljs-string">&quot;videos&quot;</span>)
client.<span class="hljs-title function_">load_collection</span>(<span class="hljs-string">&quot;videos&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>在 API 边界，<code translate="no">clips</code> 仍然是一个结构化对象数组。在 Milvus 内部，每个子字段都遵循其自身索引、过滤和输出行为所需的类型化路径。这种区别在插入时是透明的，但对后续一切功能都至关重要。</p>
<h2 id="Same-element-filtering-is-the-difference-between-structure-and-parallel-arrays" class="common-anchor-header">同元素过滤是结构体与并行数组之间的区别<button data-href="#Same-element-filtering-is-the-difference-between-structure-and-parallel-arrays" class="anchor-icon" translate="no">
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
    </button></h2><p>过滤的主要优势不是嵌套字段的更短语法，而是跨标量子字段的正确关联。</p>
<p>假设应用程序需要包含置信度分数高于 <code translate="no">0.8</code> 的厨房片段的视频。视频中仅仅包含某个厨房片段和某个高置信度片段是不够的；同一个片段必须同时满足这两个条件。</p>
<p>StructArray 的 <code translate="no">MATCH_*</code> 系列直接表达了这一需求：</p>
<pre><code translate="no">Plaintext
<span class="hljs-title function_">MATCH_ANY</span><span class="hljs-params">(clips, $[scene_type] == <span class="hljs-string">&quot;kitchen&quot;</span> &amp;&amp; $[label_confidence] &gt; <span class="hljs-number">0.8</span>)</span>
MATCH_ALL(clips, $[label_confidence] &gt; <span class="hljs-number">0.5</span>)
MATCH_LEAST(clips, $[scene_type] == <span class="hljs-string">&quot;sports&quot;</span>, threshold=<span class="hljs-number">3</span>)
MATCH_MOST(clips, $[label_confidence] &lt; <span class="hljs-number">0.2</span>, threshold=<span class="hljs-number">1</span>)
MATCH_EXACT(clips, $[scene_type] == <span class="hljs-string">&quot;intro&quot;</span>, threshold=<span class="hljs-number">1</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Milvus 在每个元素偏移量处对谓词进行求值，然后应用操作符的量词来决定父实体是否通过：</p>
<ul>
<li><code translate="no">MATCH_ANY</code>：至少一个元素匹配。</li>
<li><code translate="no">MATCH_ALL</code>：所有元素都匹配。</li>
<li><code translate="no">MATCH_LEAST</code>：至少 <code translate="no">threshold</code> 个元素匹配。</li>
<li><code translate="no">MATCH_MOST</code>：最多 <code translate="no">threshold</code> 个元素匹配。</li>
<li><code translate="no">MATCH_EXACT</code>：恰好 <code translate="no">threshold</code> 个元素匹配。</li>
</ul>
<p>如果相同的数据存储在两个独立的数组中，以下表达式将无法保留这种关联：</p>
<pre><code translate="no">Plaintext
<span class="hljs-title function_">array_contains</span><span class="hljs-params">(clips[scene_type], <span class="hljs-string">&quot;kitchen&quot;</span>)</span>
AND
<span class="hljs-title function_">array_contains</span><span class="hljs-params">(clips[label_confidence], <span class="hljs-number">0.9</span>)</span>
<button class="copy-code-btn"></button></code></pre>
<p>这两个值可能出现在不同的偏移量处。对于不相关的属性，这可能是有效的，但当两个条件描述的是同一个片段、产品图像或文档段落时，这就是错误的。</p>
<p>StructArray 将元素身份作为数据库谓词的一部分，而不是应用程序必须遵守的约定。</p>
<h2 id="Two-vector-search-granularities-two-result-identities" class="common-anchor-header">两种向量搜索粒度，两种结果身份<button data-href="#Two-vector-search-granularities-two-result-identities" class="anchor-icon" translate="no">
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
    </button></h2><p>一旦实体存储了多个向量，检索必须在 ANN 搜索开始之前解决一个建模问题：</p>
<p><strong>向量应该作为一个父实体的整体表示来统一评分，还是每个元素向量应该独立竞争？</strong></p>
<p>StructArray 支持两种模型，但它们使用不同的查询形态、度量族、向量子字段和结果身份。</p>
<h3 id="EmbeddingList-search-a-list-of-query-vectors-finds-an-entity" class="common-anchor-header">EmbeddingList 搜索：一组查询向量找到一个实体</h3><p><code translate="no">EmbeddingList</code> 查询包含多个向量。查询视频可能被分成多个片段；产品查询可能包含多个参考图像；ColBERT 查询为每个查询 token 包含一个向量。</p>
<p>对于每个实体，Milvus 将查询列表与实体存储的 Embedding 列表进行比较。在 MaxSim 风格的评分下，每个查询向量在实体列表中选择其最佳匹配，Milvus 将这些最佳匹配分数聚合为实体分数。最终命中结果代表父实体，而不是某个特定的 Struct 元素。</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> pymilvus.client.embedding_list import EmbeddingList

query = EmbeddingList()
query.<span class="hljs-keyword">add</span>(query_clip_vec_1)
query.<span class="hljs-keyword">add</span>(query_clip_vec_2)

client.search(
    collection_name=<span class="hljs-string">&quot;videos&quot;</span>,
    data=[query],
    anns_field=<span class="hljs-string">&quot;clips[clip_embedding_list]&quot;</span>,
    search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;MAX_SIM_COSINE&quot;</span>},
    limit=<span class="hljs-number">10</span>,
)
<button class="copy-code-btn"></button></code></pre>
<p>该搜索回答的问题是：<strong>哪些视频是这组查询片段的最佳整体匹配？</strong></p>
<p>它适用于视频到视频检索、多图像产品搜索、ColBERT 和 ColPali 风格的检索，以及其他查询和存储实体都由多个向量表示的场景。</p>
<h3 id="Element-level-search-one-query-vector-finds-a-clip-inside-an-entity" class="common-anchor-header">元素级搜索：一个查询向量找到实体中的片段</h3><p>元素级搜索使用常规查询向量。<code translate="no">clips[clip_embedding]</code> 中的每个向量都作为独立候选参与 ANN 搜索。每个命中结果都会标识父实体和匹配元素的偏移量。</p>
<pre><code translate="no" class="language-python">client.search(
    collection_name=<span class="hljs-string">&quot;videos&quot;</span>,
    data=[query_vec],
    anns_field=<span class="hljs-string">&quot;clips[clip_embedding]&quot;</span>,
    search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;COSINE&quot;</span>},
    <span class="hljs-built_in">limit</span>=10,
    output_fields=[<span class="hljs-string">&quot;id&quot;</span>, <span class="hljs-string">&quot;title&quot;</span>, <span class="hljs-string">&quot;clips&quot;</span>],
)
<button class="copy-code-btn"></button></code></pre>
<p>要仅搜索选定的片段，请附加一个 <code translate="no">element_filter</code>，其标量条件应用于同一个片段：</p>
<pre><code translate="no" class="language-python">client.search(
    collection_name=<span class="hljs-string">&quot;videos&quot;</span>,
    data=[query_vec],
    anns_field=<span class="hljs-string">&quot;clips[clip_embedding]&quot;</span>,
    search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;COSINE&quot;</span>},
    <span class="hljs-built_in">filter</span>=<span class="hljs-string">&#x27;element_filter(clips, $[scene_type] == &quot;kitchen&quot; &amp;&amp; $[label_confidence] &gt; 0.8)&#x27;</span>,
    limit=<span class="hljs-number">10</span>,
    output_fields=[<span class="hljs-string">&quot;id&quot;</span>, <span class="hljs-string">&quot;title&quot;</span>, <span class="hljs-string">&quot;clips&quot;</span>],
)
<button class="copy-code-btn"></button></code></pre>
<p>该过滤器不会先选择一个厨房片段，然后再搜索另一个不同的高置信度片段。谓词和向量候选都指向同一个 Struct 元素。</p>
<p>未分组的结果可能如下所示：</p>
<pre><code translate="no">Plaintext
<span class="hljs-built_in">id</span> = <span class="hljs-number">1</span>, offset = <span class="hljs-number">1</span>, distance = <span class="hljs-number">0.91</span>
<span class="hljs-built_in">id</span> = <span class="hljs-number">8</span>, offset = <span class="hljs-number">4</span>, distance = <span class="hljs-number">0.88</span>
<span class="hljs-built_in">id</span> = <span class="hljs-number">1</span>, offset = <span class="hljs-number">3</span>, distance = <span class="hljs-number">0.84</span>
<button class="copy-code-btn"></button></code></pre>
<p>同一个实体可能多次出现，因为多个片段都可能匹配。当应用程序不仅需要展示哪个视频或文档相关，还需要展示哪个片段或段落产生了匹配时，这非常有用。</p>
<table>
<thead>
<tr><th>方面</th><th>EmbeddingList 搜索</th><th>元素级搜索</th></tr>
</thead>
<tbody>
<tr><td>查询输入</td><td><code translate="no">EmbeddingList</code> 中的一个或多个查询向量</td><td>一个常规查询向量</td></tr>
<tr><td>示例目标</td><td><code translate="no">clips[clip_embedding_list]</code></td><td><code translate="no">clips[clip_embedding]</code></td></tr>
<tr><td>度量族</td><td><code translate="no">MAX_SIM*</code></td><td>常规度量，如 <code translate="no">COSINE</code>、<code translate="no">IP</code> 或 <code translate="no">L2</code></td></tr>
<tr><td>ANN 候选单位</td><td>父实体的 Embedding 列表</td><td>每个 Struct 元素向量</td></tr>
<tr><td>结果身份</td><td>父实体</td><td>父实体加元素偏移量</td></tr>
<tr><td>典型使用场景</td><td>将多向量查询与多向量实体进行匹配</td><td>找到最相关的片段、图像、段落、补丁或事实</td></tr>
</tbody>
</table>
<p>要在同一个 Collection 中支持两种模式，需要定义并索引独立的向量子字段。查询形态、度量族和目标索引必须一致。</p>
<h2 id="EmbeddingList-indexing-is-a-quality-cost-decision" class="common-anchor-header">EmbeddingList 索引是质量与成本的权衡<button data-href="#EmbeddingList-indexing-is-a-quality-cost-decision" class="anchor-icon" translate="no">
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
    </button></h2><p>每个实体只有一个 Embedding 时，ANN 索引可以找到查询向量附近的实体。EmbeddingList 搜索成本更高，因为相关性取决于两个向量列表之间的两两交互。</p>
<p>对每个实体中的每个向量计算精确 MaxSim 可以产生最干净的参考排名，但全量扫描对于在线检索来说通常过于昂贵。因此，Milvus 使用两阶段模型：</p>
<ol>
<li>近似策略检索候选父实体。</li>
<li>当启用 <code translate="no">emb_list_rerank</code> 时，Milvus 会重新计算这些候选实体的 MaxSim，以生成最终排名。</li>
</ol>
<p>检索更多第一阶段的候选通常可以提高真正排名靠前的结果进入重排序器的机会，但同时也会增加延迟和计算量。这三种策略的主要区别在于它们如何生成候选集。</p>
<table>
<thead>
<tr><th>策略</th><th>第一阶段候选表示</th><th>何时适合作为起点</th><th>主要权衡</th></tr>
</thead>
<tbody>
<tr><td>TokenANN</td><td>索引每个 Embedding 列表中的每个向量。查询向量独立运行 ANN；在 MaxSim 重排序之前，匹配结果聚合回父实体。</td><td>质量优先、列表为短或中等长度，且单个向量具有区分度时。</td><td>索引大小和第一阶段搜索工作量随列表长度和查询向量数量增长。</td></tr>
<tr><td>MUVERA</td><td>通过随机投影将每个 Embedding 列表编码为一个固定维度的向量，然后运行常规 ANN。</td><td>TokenANN 过于沉重，且更倾向于无需训练管道的压缩方案时。</td><td>编码会丢失信息；更强的投影设置会增加编码维度和 ANN 成本。</td></tr>
<tr><td>LEMUR</td><td>训练一个模型，将 Embedding 列表映射为固定维度的父实体向量。</td><td>Embeddings 区分度较低、列表较大，或工作负载是视觉或多模态时。</td><td>需要训练，并且可能对语料分布和文档长度偏差敏感。</td></tr>
</tbody>
</table>
<p>没有一种策略对所有工作负载都是最优的。从目标数据和查询分布出发：</p>
<ul>
<li>当数据集规模允许时，将 TokenANN 作为质量优先的基线。</li>
<li>当 TokenANN 的索引或候选检索随着列表长度增长而变得过于昂贵，并且你希望避免训练管道时，可以尝试 MUVERA。</li>
<li>当 Embedding 空间噪声较大或区分度较弱，或者工作负载是视觉或多模态时，评估 LEMUR。</li>
<li>在关注延迟和索引大小的同时，衡量召回率或 nDCG。对短文本有效的策略在长尾文档长度或数千个视觉补丁的情况下可能表现不同。</li>
</ul>
<p>StructArray 解决了一个问题：如何在单个实体内部表示对齐的、可过滤的、携带向量的元素。EmbeddingList 策略解决了另一个问题：如何针对特定模型和语料以可接受的成本近似 MaxSim。</p>
<h2 id="Hybrid-search-makes-result-identity-explicit" class="common-anchor-header">混合搜索使结果身份显式化<button data-href="#Hybrid-search-makes-result-identity-explicit" class="anchor-icon" translate="no">
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
    </button></h2><p>生产环境的检索很少遵循单一的向量路径。视频请求可能会组合顶层视频 Embedding、一个或多个片段级 Embedding、字幕或文本信号，以及一个 Reranker。</p>
<p>一旦元素级候选进入该管道，引擎必须决定什么标识最终候选。</p>
<table>
<thead>
<tr><th>混合请求组成</th><th>最终候选范围</th><th>结果身份</th></tr>
</thead>
<tbody>
<tr><td>所有子搜索都是元素级，并且针对同一个 StructArray 下的向量子字段</td><td>元素级</td><td>主键加 StructArray 字段加元素偏移量</td></tr>
<tr><td>包含顶层向量字段</td><td>实体级</td><td>主键</td></tr>
<tr><td>包含 EmbeddingList 请求</td><td>实体级</td><td>主键</td></tr>
<tr><td>元素级请求针对不同的 StructArray 字段</td><td>实体级</td><td>主键</td></tr>
</tbody>
</table>
<p>第一种配置保留了元素身份，因为在给定的父级 StructArray 下，偏移量 <code translate="no">3</code> 对于每个子搜索都指向同一个 Struct 元素。这适用于希望在融合多个元素级信号后返回最相关片段或段落的应用程序。</p>
<p>其他配置混合了候选粒度或元素命名空间。因此，元素命中必须在最终重排序之前折叠为实体级分数。Milvus 支持多种折叠策略：</p>
<table>
<thead>
<tr><th>折叠策略</th><th>返回的元素命中生成的实体分数</th><th>重要条件</th></tr>
</thead>
<tbody>
<tr><td><code translate="no">max</code></td><td>最佳元素分数</td><td>适用于受支持的常规向量度量</td></tr>
<tr><td><code translate="no">sum</code></td><td>所有返回元素分数的总和</td><td>与 <code translate="no">IP</code> 或 <code translate="no">COSINE</code> 等正相关度量一起使用</td></tr>
<tr><td><code translate="no">avg</code></td><td>返回元素分数的平均值</td><td>适用于受支持的常规向量度量</td></tr>
<tr><td><code translate="no">topk_sum</code></td><td>最佳 <code translate="no">K</code> 个返回元素分数的总和</td><td>需要正数 <code translate="no">topk</code>；与 <code translate="no">IP</code> 或 <code translate="no">COSINE</code> 一起使用</td></tr>
<tr><td><code translate="no">topk_avg</code></td><td>最佳 <code translate="no">K</code> 个返回元素分数的平均值</td><td>需要正数 <code translate="no">topk</code></td></tr>
</tbody>
</table>
<p>折叠仅作用于该 ANN 子搜索返回的元素命中结果；它不会在检索后扫描实体中的每个元素。因此，请求的 <code translate="no">limit</code> 控制着哪些元素命中结果可用于折叠函数。</p>
<p>这一选择塑造的是检索语义，而不仅仅是输出格式。如果应用程序展示的是片段或段落，在融合过程中保留偏移量是自然的。如果展示的是视频、产品或文档，实体级折叠是自然的。当信号在不同粒度上运行时，系统需要一个显式的元素到实体的评分规则。</p>
<p>StructArray 将身份与折叠问题从临时拼凑的后处理转移到搜索执行模型中。</p>
<h2 id="How-Milvus-executes-StructArray-without-treating-it-as-a-blob" class="common-anchor-header">Milvus 如何在不将 StructArray 视为 Blob 的情况下执行它<button data-href="#How-Milvus-executes-StructArray-without-treating-it-as-a-blob" class="anchor-icon" translate="no">
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
    </button></h2><p>用户面对的模型是 <code translate="no">ARRAY&lt;STRUCT&gt;</code>。然而，如果将整个值存储为一个不透明的 Blob，子字段索引、过滤和选择性输出将变得低效。</p>
<p>Milvus 采用逻辑父级、物理子列的设计。</p>
<p>在 Schema 层，<code translate="no">clips</code> 是逻辑父字段。它定义了 Struct Schema、最大容量和可空性等属性。其子字段被规范化为诸如 <code translate="no">clips[clip_embedding_list]</code>、<code translate="no">clips[clip_embedding]</code>、<code translate="no">clips[scene_type]</code> 和 <code translate="no">clips[label_confidence]</code> 这样的路径。</p>
<p>标量子字段遵循每个实体的标量数组存储路径，而向量子字段遵循向量数组路径。每个子字段随后可以使用适合其类型的数据路径：元数据使用标量过滤和标量索引，Embeddings 使用向量索引和 ANN 搜索。</p>
<p>在数据摄入时，Proxy 将嵌套的 Struct 列表展开为类型化的子列。在执行期间，Milvus 维护每个物理元素与其父实体之间的关系。从概念上讲，这种关系如下所示：</p>
<pre><code translate="no">Plaintext
entity 0 -&gt; elements [0, 1, 2]
entity 1 -&gt; elements [3]
entity 2 -&gt; elements []
entity 3 -&gt; elements [4, 5, 6, 7]
<button class="copy-code-btn"></button></code></pre>
<p>当元素级搜索返回物理元素 ID 时，Milvus 会将其映射回父实体和元素偏移量。当 <code translate="no">element_filter</code> 生成元素级位图时，引擎会将其与父实体可见性、删除和其他过滤器对齐。</p>
<p>在返回结果时，Milvus 使用逻辑 Schema 和共享偏移量来重建应用程序插入的 StructArray 形态。系统可以在类型化子列上执行，同时用户继续读写自然的嵌套对象。这种物理布局使 StructArray 不仅仅是有类型的 JSON：嵌套关系参与索引和执行模型。</p>
<h2 id="Where-StructArray-fits-and-where-it-does-not" class="common-anchor-header">StructArray 的适用场景与不适用场景<button data-href="#Where-StructArray-fits-and-where-it-does-not" class="anchor-icon" translate="no">
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
    </button></h2><p>当以下所有条件都成立时，StructArray 非常适用：</p>
<ul>
<li>应用程序有一个有意义的父实体，例如视频、产品、文档、视觉页面或记忆记录。</li>
<li>每个父实体包含一组有序的、可变长度的局部元素。</li>
<li>这些元素需要自己的标量元数据、向量，或两者兼有。</li>
<li>搜索或过滤必须保留同一元素偏移量处子字段之间的关系。</li>
<li>应用程序需要实体级多向量检索、元素级命中，或两者兼有。</li>
</ul>
<p>StructArray 并不自动对每个 Collection 都更好。短文档或简单查询可能使用单个稠密 Embedding 就足够了。多向量索引会增加存储和搜索成本，因此额外的表示应通过改进检索质量或更有用的结果粒度来证明其价值。</p>
<p>当前的 Schema 和执行边界也很重要：</p>
<ul>
<li><code translate="no">Struct</code> 受支持作为 <code translate="no">Array</code> 的元素类型，而不是作为顶层 Collection 字段。</li>
<li>一个 StructArray 中的所有元素共享一个预定义的 Schema。</li>
<li><code translate="no">max_capacity</code> 是必填的，并限制每个实体的元素数量。</li>
<li>StructArray 内部不支持嵌套的 <code translate="no">Struct</code>、<code translate="no">Array</code>、<code translate="no">ArrayOfStruct</code> 和 <code translate="no">JSON</code> 子字段。</li>
<li>一个向量子字段只能接受一个索引。当同时需要 EmbeddingList 和元素级搜索时，请使用独立的向量子字段。</li>
<li>向量子字段必须在搜索之前建立索引。过滤中频繁使用的标量子字段应适当建立索引。</li>
<li>子字段 Schema 在 StructArray 字段创建后即固定，因此请在生产环境上线前规划好元素属性。</li>
</ul>
<p>这些约束使得该模型比文档数据库的任意嵌套更窄，但也为 Milvus 提供了足够的结构来推理元素身份、索引每个子字段，并以两种搜索粒度执行。</p>
<h2 id="StructArray-keeps-local-evidence-first-class-without-losing-the-entity" class="common-anchor-header">StructArray 让局部证据成为一等公民，同时不丢失实体<button data-href="#StructArray-keeps-local-evidence-first-class-without-losing-the-entity" class="anchor-icon" translate="no">
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
    </button></h2><p>StructArray 为 Milvus 提供了一种扁平 Schema 难以表示的检索对象：一个包含有序结构化元素集的父实体。这些元素之间的关系参与过滤、索引和搜索，而不仅仅存在于存储中。</p>
<p>每个元素保留自己的元数据和 Embeddings。这些元素可以满足同元素标量谓词、一起参与实体级 EmbeddingList 搜索，或在元素级搜索中独立竞争。同时，它们仍然归属于父实体，父实体的元数据、权限和应用程序身份为它们提供了上下文。</p>
<p>对于视频片段、产品图像、文档段落、视觉补丁和记忆片段，局部证据可以被搜索和过滤，同时不会丢失其所属的实体。其余的设计选择是明确的：选择搜索粒度、为每个向量子字段分配匹配的度量和索引，并决定混合结果是保留元素偏移量还是折叠回实体。</p>
<h2 id="Try-StructArray-in-Milvus-30" class="common-anchor-header">在 Milvus 3.0 中试用 StructArray<button data-href="#Try-StructArray-in-Milvus-30" class="anchor-icon" translate="no">
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
    </button></h2><p>StructArray 已在 Milvus 3.0 中可用。从 <a href="https://milvus.io/docs/array-of-structs.md">StructArray 概述</a> 开始。如果你正在评估实体级多向量检索，请阅读 <a href="https://milvus.io/docs/choose-an-embeddinglist-search-strategy.md">EmbeddingList 策略指南</a>。关于结果粒度和折叠行为，请参阅 <a href="https://milvus.io/docs/hybrid-search-with-structarray.md">使用 StructArray 进行混合搜索</a>。</p>
<p>关于更广泛的版本背景，请参阅 <a href="https://milvus.io/blog/announcing-milvus-3-lake-native-vector-search-and-a-more-powerful-retrieval-engine.md">Milvus 3.0 发布博客</a>、<a href="https://milvus.io/docs/release_notes.md">版本说明</a> 和 <a href="https://github.com/milvus-io/milvus">milvus-io/milvus 仓库</a>。</p>
<p><a href="https://zilliz.com/">Zilliz Cloud</a> 也支持托管部署中的 StructArray 和 EmbeddingList 搜索。请查阅 <a href="https://docs.zilliz.com/docs/use-array-of-structs">Zilliz Cloud StructArray 指南</a> 了解特定于服务的限制。在 Zilliz Cloud 中，StructArray 上的标量操作符目前仅针对 On-Demand 集群提供文档。</p>
<p>要与团队讨论 Schema 或检索设计，请加入 <a href="https://discord.com/invite/8uyFbECzPX">Milvus Discord 社区</a> 或预约 <a href="https://meetings.hubspot.com/chloe-williams1/milvus-meeting">Milvus Office Hours</a> 会话。</p>
