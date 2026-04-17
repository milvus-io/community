---
id: milvus-boost-ranker-business-aware-vector-search.md
title: 如何使用 Milvus Boost Ranker 进行商业感知向量搜索
author: Wei Zang
date: 2026-3-24
cover: >-
  assets.zilliz.com/How_to_Use_Milvus_Boost_Ranker_to_Improve_Vector_Search_Ranking_4f47a2a8c6_c3ed6feec6.jpg
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search'
meta_keywords: 'Milvus Boost Ranker, vector search ranking, metadata reranking, Milvus 2.6'
meta_title: |
  Milvus Boost Ranker: Add Business Rules to Vector Search
desc: 了解 Milvus Boost Ranker 如何让您在向量相似性基础上建立业务规则--提升官方文档、降级陈旧内容、增加多样性。
origin: 'https://milvus.io/blog/milvus-boost-ranker-business-aware-vector-search.md'
---
<p>向量搜索通过嵌入相似度对结果进行排序--向量越接近，结果越靠前。有些系统添加了基于模型的 Reranker（BGE、Voyage、Cohere），以改进排序。但这两种方法都无法满足生产中的一个基本要求：<strong>业务上下文与语义相关性同样重要，有时甚至更重要。</strong></p>
<p>电子商务网站需要首先显示官方商店的库存产品。一个内容平台需要将最近发布的公告固定下来。企业知识库需要将权威文档放在最前面。如果排名仅仅依赖于向量距离，这些规则就会被忽略。结果可能是相关的，但并不合适。</p>
<p><a href="https://milvus.io/intro">Milvus</a>2.6 中引入的<strong><a href="https://milvus.io/docs/reranking.md">Boost Ranker</a></strong> 解决了这个问题。它可以让你使用元数据规则调整搜索结果排名，无需重建索引，也无需改变模型。本文将介绍它的工作原理、何时使用以及如何用代码实现它。</p>
<h2 id="What-Is-Boost-Ranker" class="common-anchor-header">什么是 Boost Ranker？<button data-href="#What-Is-Boost-Ranker" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Boost Ranker 是 Milvus 2.6.2 中基于规则的轻量级重排功能</strong>，它使用标量元数据字段调整<a href="https://zilliz.com/learn/vector-similarity-search">向量搜索</a>结果。与调用外部 LLMs 或嵌入服务的基于模型的 Rerankers 不同，Boost Ranker 完全在 Milvus 内部使用简单的过滤和加权规则操作符。没有外部依赖性，延迟开销最小--适合实时使用。</p>
<p>您可以通过<a href="https://milvus.io/docs/manage-functions.md">函数应用程序接口对</a>其进行配置。向量搜索返回一组候选结果后，Boost Ranker 会进行三种操作符：</p>
<ol>
<li><strong>筛选：</strong>找出符合特定条件的结果（例如，<code translate="no">is_official == true</code>)</li>
<li><strong>提升：</strong>将它们的得分乘以配置的权重</li>
<li><strong>洗牌：</strong>可选择添加一个小的随机因子（0-1）以引入多样性</li>
</ol>
<h3 id="How-It-Works-Under-the-Hood" class="common-anchor-header">引擎盖下的工作原理</h3><p>Boost Ranker 作为后处理步骤在 Milvus 内部运行：</p>
<ol>
<li><strong>向量搜索</strong>--每个片段都会返回带有 ID、相似度得分和元数据的候选对象。</li>
<li><strong>应用规则</strong>--系统过滤匹配记录，并使用配置的权重和可选的<code translate="no">random_score</code> 调整其分数。</li>
<li><strong>合并和排序</strong>--合并所有候选结果，并根据更新后的分数重新排序，生成最终的 Top-K 结果。</li>
</ol>
<p>由于 Boost Ranker 只对已检索到的候选信息进行操作，而不是对整个数据集进行操作，因此额外的计算成本可以忽略不计。</p>
<h2 id="When-Should-You-Use-Boost-Ranker" class="common-anchor-header">何时使用 Boost Ranker？<button data-href="#When-Should-You-Use-Boost-Ranker" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Boosting-Important-Results" class="common-anchor-header">提升重要结果</h3><p>最常见的使用案例：在语义搜索之上添加简单的业务规则。</p>
<ul>
<li><strong>电子商务：</strong>推送来自旗舰店、官方卖家或付费促销活动的产品。将近期销售额或点击率较高的商品推向更高的位置。</li>
<li><strong>内容平台：</strong>通过<code translate="no">publish_time</code> 字段对最近发布的内容进行优先排序，或推送来自已验证账户的帖子。</li>
<li><strong>企业搜索：</strong>对<code translate="no">doctype == &quot;policy&quot;</code> 或<code translate="no">is_canonical == true</code> 的文档给予更高的优先级。</li>
</ul>
<p>所有这些都可通过过滤器+权重进行配置。不改变 Embeddings 模型，不重建索引。</p>
<h3 id="Demoting-Without-Removing" class="common-anchor-header">降级而不删除</h3><p>Boost Ranker 还可以降低某些结果的排名--这是硬性过滤的一种柔和替代方案。</p>
<ul>
<li><strong>低库存产品：</strong>如果<code translate="no">stock &lt; 10</code> ，则稍微降低其权重。仍然可以找到，但不会占据顶部位置。</li>
<li><strong>敏感内容：</strong>降低标记内容的权重，而不是完全删除。在不进行严格审查的情况下限制曝光率。</li>
<li><strong>陈旧文档：</strong> <code translate="no">year &lt; 2020</code> 的文档会被降权，因此较新的内容会优先出现。</li>
</ul>
<p>用户仍然可以通过滚动或更精确的搜索找到被降级的结果，但它们不会挤掉更相关的内容。</p>
<h3 id="Adding-Diversity-with-Controlled-Randomness" class="common-anchor-header">利用受控随机性增加多样性</h3><p>当许多结果的得分相似时，Top-K 在不同的查询中就会显得完全相同。Boost Ranker 的<code translate="no">random_score</code> 参数引入了轻微的变化：</p>
<pre><code translate="no" class="language-json"><span class="hljs-string">&quot;random_score&quot;</span>: {
  <span class="hljs-string">&quot;seed&quot;</span>: <span class="hljs-number">126</span>,
  <span class="hljs-string">&quot;field&quot;</span>: <span class="hljs-string">&quot;id&quot;</span>
}
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><code translate="no">seed</code>：控制整体随机性以实现可重复性</li>
<li><code translate="no">field</code>：通常是主键<code translate="no">id</code> ，确保同一记录每次获得相同的随机值</li>
</ul>
<p>这对于<strong>多样化推荐</strong>（防止相同的项目总是出现在第一位）和<strong>探索</strong>（将固定的业务权重与小的随机扰动相结合）非常有用。</p>
<h3 id="Combining-Boost-Ranker-with-Other-Rankers" class="common-anchor-header">将 Boost Ranker 与其他排名器相结合</h3><p>Boost Ranker 可通过函数 API 设置，<code translate="no">params.reranker = &quot;boost&quot;</code> 。结合使用有两点需要注意：</p>
<ul>
<li><strong>限制：</strong>在混合（多向量）搜索中，Boost Ranker 不能作为顶级排名器。但它可以在每个单独的<code translate="no">AnnSearchRequest</code> 中使用，以便在合并之前调整结果。</li>
<li><strong>常见组合：</strong><ul>
<li><strong>RRF + Boost：</strong>使用 RRF 合并多模式结果，然后应用 Boost 进行基于元数据的微调。</li>
<li><strong>模型排序器 + Boost：</strong>使用基于模型的排序器进行语义质量排序，然后使用 Boost 进行业务规则排序。</li>
</ul></li>
</ul>
<h2 id="How-to-Configure-Boost-Ranker" class="common-anchor-header">如何配置 Boost 排名器<button data-href="#How-to-Configure-Boost-Ranker" class="anchor-icon" translate="no">
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
    </button></h2><p>Boost Ranker 通过功能 API 进行配置。对于更复杂的逻辑，可将其与<code translate="no">FunctionScore</code> 结合起来，共同应用多个规则。</p>
<h3 id="Required-Fields" class="common-anchor-header">必填字段</h3><p>创建<code translate="no">Function</code> 对象时：</p>
<ul>
<li><code translate="no">name</code>任何自定义名称</li>
<li><code translate="no">input_field_names</code>必须是空列表<code translate="no">[]</code></li>
<li><code translate="no">function_type</code>：设置为<code translate="no">FunctionType.RERANK</code></li>
<li><code translate="no">params.reranker</code>必须是<code translate="no">&quot;boost&quot;</code></li>
</ul>
<h3 id="Key-Parameters" class="common-anchor-header">关键参数</h3><p><strong><code translate="no">params.weight</code> 必填</strong></p>
<p>应用于匹配记录得分的乘数。如何设置取决于度量标准：</p>
<table>
<thead>
<tr><th>指标类型</th><th>提升结果</th><th>降低结果</th></tr>
</thead>
<tbody>
<tr><td>越高越好（COSINE、IP）</td><td><code translate="no">weight &gt; 1</code></td><td><code translate="no">weight &lt; 1</code></td></tr>
<tr><td>低者更优（L2/欧几里得）</td><td><code translate="no">weight &lt; 1</code></td><td><code translate="no">weight &gt; 1</code></td></tr>
</tbody>
</table>
<p><strong><code translate="no">params.filter</code> 可选</strong></p>
<p>选择哪些记录的分数会被调整的条件：</p>
<ul>
<li><code translate="no">&quot;doctype == 'abstract'&quot;</code></li>
<li><code translate="no">&quot;is_premium == true&quot;</code></li>
<li><code translate="no">&quot;views &gt; 1000 and category == 'tech'&quot;</code></li>
</ul>
<p>只有匹配的记录才会受到影响。其他所有记录均保持原有分数。</p>
<p><strong><code translate="no">params.random_score</code> 可选</strong></p>
<p>为多样性添加一个介于 0 和 1 之间的随机值。详见上文随机性部分。</p>
<h3 id="Single-vs-Multiple-Rules" class="common-anchor-header">单规则与多规则</h3><p><strong>单一规则</strong>--当你只有一个业务约束时（例如，提升官方文档），直接将排名器传递给<code translate="no">search(..., ranker=ranker)</code> 。</p>
<p><strong>多规则</strong>--当您需要多个约束条件时（优先考虑库存商品 + 降级低评级产品 + 添加随机性），可创建多个<code translate="no">Function</code> 对象，并将它们与<code translate="no">FunctionScore</code> 结合。您可对其进行配置：</p>
<ul>
<li><code translate="no">boost_mode</code>每条规则如何与原始分数相结合（<code translate="no">multiply</code> 或<code translate="no">add</code> ）</li>
<li><code translate="no">function_mode</code>多个规则如何相互组合 (<code translate="no">multiply</code> 或<code translate="no">add</code>)</li>
</ul>
<h2 id="Hands-On-Prioritizing-Official-Documents" class="common-anchor-header">实际操作：确定正式文件的优先顺序<button data-href="#Hands-On-Prioritizing-Official-Documents" class="anchor-icon" translate="no">
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
    </button></h2><p>让我们举一个具体的例子：让官方文件在文件搜索系统中排名靠前。</p>
<h3 id="Schema" class="common-anchor-header">Schema</h3><p>一个名为<code translate="no">milvus_collection</code> 的 Collection，其中包含这些字段：</p>
<table>
<thead>
<tr><th>字段</th><th>字段</th><th>字段类型</th></tr>
</thead>
<tbody>
<tr><td><code translate="no">id</code></td><td>INT64</td><td>主键</td></tr>
<tr><td><code translate="no">content</code></td><td>VARCHAR</td><td>文件文本</td></tr>
<tr><td><code translate="no">embedding</code></td><td>浮点矢量 (3072)</td><td>语义向量</td></tr>
<tr><td><code translate="no">source</code></td><td>VARCHAR</td><td>来源：&quot;官方&quot;、&quot;社区 &quot;或 &quot;票据</td></tr>
<tr><td><code translate="no">is_official</code></td><td>BOOL</td><td><code translate="no">True</code> 如果<code translate="no">source == &quot;official&quot;</code></td></tr>
</tbody>
</table>
<p><code translate="no">source</code> 和<code translate="no">is_official</code> 字段是 Boost Ranker 用来调整排名的元数据。</p>
<h3 id="Setup-Code" class="common-anchor-header">设置代码</h3><pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> (
    MilvusClient,
    DataType,
    Function,
    FunctionType,
)

<span class="hljs-comment"># 1. Connect to Milvus</span>
client = MilvusClient(uri=<span class="hljs-string">&quot;http://localhost:19530&quot;</span>)
collection_name = <span class="hljs-string">&quot;milvus_collection&quot;</span>

<span class="hljs-comment"># If it already exists, drop it first for repeated testing</span>
<span class="hljs-keyword">if</span> collection_name <span class="hljs-keyword">in</span> client.list_collections():
    client.drop_collection(collection_name)

<span class="hljs-comment"># 2. Define schema</span>
schema = MilvusClient.create_schema(
    auto_id=<span class="hljs-literal">False</span>,
    enable_dynamic_field=<span class="hljs-literal">False</span>,
)

schema.add_field(
    field_name=<span class="hljs-string">&quot;id&quot;</span>,
    datatype=DataType.INT64,
    is_primary=<span class="hljs-literal">True</span>,
)
schema.add_field(
    field_name=<span class="hljs-string">&quot;content&quot;</span>,
    datatype=DataType.VARCHAR,
    max_length=<span class="hljs-number">512</span>,
)
schema.add_field(
    field_name=<span class="hljs-string">&quot;source&quot;</span>,
    datatype=DataType.VARCHAR,
    max_length=<span class="hljs-number">32</span>,
)
schema.add_field(
    field_name=<span class="hljs-string">&quot;is_official&quot;</span>,
    datatype=DataType.BOOL,
)
schema.add_field(
    field_name=<span class="hljs-string">&quot;embedding&quot;</span>,
    datatype=DataType.FLOAT_VECTOR,
    dim=<span class="hljs-number">3072</span>,
)

text_embedding_function = Function(
    name=<span class="hljs-string">&quot;openai_embedding&quot;</span>,
    function_type=FunctionType.TEXTEMBEDDING,
    input_field_names=[<span class="hljs-string">&quot;content&quot;</span>],
    output_field_names=[<span class="hljs-string">&quot;embedding&quot;</span>],
    params={
        <span class="hljs-string">&quot;provider&quot;</span>: <span class="hljs-string">&quot;openai&quot;</span>,
        <span class="hljs-string">&quot;model_name&quot;</span>: <span class="hljs-string">&quot;text-embedding-3-large&quot;</span>
    }
)

schema.add_function(text_embedding_function)

<span class="hljs-comment"># 3. Create Collection</span>
client.create_collection(
    collection_name=collection_name,
    schema=schema,
)

<span class="hljs-comment"># 4. Create index</span>
index_params = client.prepare_index_params()

index_params.add_index(
    field_name=<span class="hljs-string">&quot;embedding&quot;</span>,
    index_type=<span class="hljs-string">&quot;IVF_FLAT&quot;</span>,
    metric_type=<span class="hljs-string">&quot;COSINE&quot;</span>,
    params={<span class="hljs-string">&quot;nlist&quot;</span>: <span class="hljs-number">16</span>},
)

client.create_index(
    collection_name=collection_name,
    index_params=index_params,
)

<span class="hljs-comment"># 5. Load Collection into memory</span>
client.load_collection(collection_name=collection_name)

docs = [
    {
        <span class="hljs-string">&quot;id&quot;</span>: <span class="hljs-number">1</span>,
        <span class="hljs-string">&quot;content&quot;</span>: <span class="hljs-string">&quot;How to deploy Milvus on Kubernetes (Official Guide)&quot;</span>,
        <span class="hljs-string">&quot;source&quot;</span>: <span class="hljs-string">&quot;official&quot;</span>,
        <span class="hljs-string">&quot;is_official&quot;</span>: <span class="hljs-literal">True</span>
    },
    {
        <span class="hljs-string">&quot;id&quot;</span>: <span class="hljs-number">2</span>,
        <span class="hljs-string">&quot;content&quot;</span>: <span class="hljs-string">&quot;Quick deployment of Milvus with Docker Compose (Official Tutorial)&quot;</span>,
        <span class="hljs-string">&quot;source&quot;</span>: <span class="hljs-string">&quot;official&quot;</span>,
        <span class="hljs-string">&quot;is_official&quot;</span>: <span class="hljs-literal">True</span>
    },
    {
        <span class="hljs-string">&quot;id&quot;</span>: <span class="hljs-number">3</span>,
        <span class="hljs-string">&quot;content&quot;</span>: <span class="hljs-string">&quot;Community experience: Lessons learned from deploying Milvus&quot;</span>,
        <span class="hljs-string">&quot;source&quot;</span>: <span class="hljs-string">&quot;community&quot;</span>,
        <span class="hljs-string">&quot;is_official&quot;</span>: <span class="hljs-literal">False</span>
    },
    {
        <span class="hljs-string">&quot;id&quot;</span>: <span class="hljs-number">4</span>,
        <span class="hljs-string">&quot;content&quot;</span>: <span class="hljs-string">&quot;Ticket record: Milvus deployment issue&quot;</span>,
        <span class="hljs-string">&quot;source&quot;</span>: <span class="hljs-string">&quot;ticket&quot;</span>,
        <span class="hljs-string">&quot;is_official&quot;</span>: <span class="hljs-literal">False</span>
    },
]

client.insert(
    collection_name=collection_name,
    data=docs,
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Comparing-Results-With-and-Without-Boost-Ranker" class="common-anchor-header">比较结果：使用和不使用 Boost Ranker</h3><p>首先，运行不带 Boost Ranker 的基准搜索。然后添加带有<code translate="no">filter: is_official == true</code> 和<code translate="no">weight: 1.2</code> 的 Boost Ranker 并进行比较。</p>
<pre><code translate="no" class="language-python"><span class="hljs-comment"># 6. Baseline search (without Boost Ranker)</span>
query_vector = <span class="hljs-string">&quot;how to deploy milvus&quot;</span>

search_params = {
    <span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;COSINE&quot;</span>,
    <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;nprobe&quot;</span>: <span class="hljs-number">2</span>},
}

results = client.search(
    collection_name=collection_name,
    data=[query_vector],
    anns_field=<span class="hljs-string">&quot;embedding&quot;</span>,
    search_params=search_params,
    limit=<span class="hljs-number">4</span>,
    output_fields=[<span class="hljs-string">&quot;content&quot;</span>, <span class="hljs-string">&quot;source&quot;</span>, <span class="hljs-string">&quot;is_official&quot;</span>],
)

<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;=== Baseline search (no Boost Ranker) ===&quot;</span>)
<span class="hljs-keyword">for</span> hit <span class="hljs-keyword">in</span> results[<span class="hljs-number">0</span>]:
    entity = hit[<span class="hljs-string">&quot;entity&quot;</span>]
    <span class="hljs-built_in">print</span>(
        <span class="hljs-string">f&quot;id=<span class="hljs-subst">{hit[<span class="hljs-string">&#x27;id&#x27;</span>]}</span>, &quot;</span>
        <span class="hljs-string">f&quot;score=<span class="hljs-subst">{hit[<span class="hljs-string">&#x27;distance&#x27;</span>]:<span class="hljs-number">.4</span>f}</span>, &quot;</span>
        <span class="hljs-string">f&quot;source=<span class="hljs-subst">{entity[<span class="hljs-string">&#x27;source&#x27;</span>]}</span>, &quot;</span>
        <span class="hljs-string">f&quot;is_official=<span class="hljs-subst">{entity[<span class="hljs-string">&#x27;is_official&#x27;</span>]}</span>&quot;</span>
    )

<span class="hljs-comment"># 7. Define Boost Ranker: apply weight to documents where is_official == true</span>
boost_official_ranker = Function(
    name=<span class="hljs-string">&quot;boost_official&quot;</span>,
    input_field_names=[],               <span class="hljs-comment"># Boost Ranker requires this to be an empty list</span>
    function_type=FunctionType.RERANK,
    params={
        <span class="hljs-string">&quot;reranker&quot;</span>: <span class="hljs-string">&quot;boost&quot;</span>,            <span class="hljs-comment"># Specify Boost Ranker</span>
        <span class="hljs-string">&quot;filter&quot;</span>: <span class="hljs-string">&quot;is_official==true&quot;</span>,
        <span class="hljs-comment"># For COSINE / IP (higher score is better), use weight &gt; 1 to boost</span>
        <span class="hljs-string">&quot;weight&quot;</span>: <span class="hljs-number">1.2</span>
    },
)

boosted_results = client.search(
    collection_name=collection_name,
    data=[query_vector],
    anns_field=<span class="hljs-string">&quot;embedding&quot;</span>,
    search_params=search_params,
    limit=<span class="hljs-number">4</span>,
    output_fields=[<span class="hljs-string">&quot;content&quot;</span>, <span class="hljs-string">&quot;source&quot;</span>, <span class="hljs-string">&quot;is_official&quot;</span>],
    ranker=boost_official_ranker,
)

<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n=== Search with Boost Ranker (official boosted) ===&quot;</span>)
<span class="hljs-keyword">for</span> hit <span class="hljs-keyword">in</span> boosted_results[<span class="hljs-number">0</span>]:
    entity = hit[<span class="hljs-string">&quot;entity&quot;</span>]
    <span class="hljs-built_in">print</span>(
        <span class="hljs-string">f&quot;id=<span class="hljs-subst">{hit[<span class="hljs-string">&#x27;id&#x27;</span>]}</span>, &quot;</span>
        <span class="hljs-string">f&quot;score=<span class="hljs-subst">{hit[<span class="hljs-string">&#x27;distance&#x27;</span>]:<span class="hljs-number">.4</span>f}</span>, &quot;</span>
        <span class="hljs-string">f&quot;source=<span class="hljs-subst">{entity[<span class="hljs-string">&#x27;source&#x27;</span>]}</span>, &quot;</span>
        <span class="hljs-string">f&quot;is_official=<span class="hljs-subst">{entity[<span class="hljs-string">&#x27;is_official&#x27;</span>]}</span>&quot;</span>
    )
<button class="copy-code-btn"></button></code></pre>
<h3 id="Results" class="common-anchor-header">搜索结果</h3><pre><code translate="no">=== Baseline search (no Boost Ranker) ===
<span class="hljs-built_in">id</span>=<span class="hljs-number">1</span>, score=<span class="hljs-number">0.7351</span>, source=official, is_official=<span class="hljs-literal">True</span>
<span class="hljs-built_in">id</span>=<span class="hljs-number">4</span>, score=<span class="hljs-number">0.7017</span>, source=ticket, is_official=<span class="hljs-literal">False</span>
<span class="hljs-built_in">id</span>=<span class="hljs-number">3</span>, score=<span class="hljs-number">0.6706</span>, source=community, is_official=<span class="hljs-literal">False</span>
<span class="hljs-built_in">id</span>=<span class="hljs-number">2</span>, score=<span class="hljs-number">0.6435</span>, source=official, is_official=<span class="hljs-literal">True</span>

=== Search <span class="hljs-keyword">with</span> Boost Ranker (official boosted) ===
<span class="hljs-built_in">id</span>=<span class="hljs-number">1</span>, score=<span class="hljs-number">0.8821</span>, source=official, is_official=<span class="hljs-literal">True</span>
<span class="hljs-built_in">id</span>=<span class="hljs-number">2</span>, score=<span class="hljs-number">0.7722</span>, source=official, is_official=<span class="hljs-literal">True</span>
<span class="hljs-built_in">id</span>=<span class="hljs-number">4</span>, score=<span class="hljs-number">0.7017</span>, source=ticket, is_official=<span class="hljs-literal">False</span>
<span class="hljs-built_in">id</span>=<span class="hljs-number">3</span>, score=<span class="hljs-number">0.6706</span>, source=community, is_official=<span class="hljs-literal">False</span>
<button class="copy-code-btn"></button></code></pre>
<p>主要变化：文档<code translate="no">id=2</code> （官方）从第 4 位跃升至第 2 位，因为其得分乘以 1.2。社区帖子和票据记录没有被删除，只是排名靠后。这就是 Boost Ranker 的意义所在：将语义搜索作为基础，然后在其上层添加业务规则。</p>
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
    </button></h2><p><a href="https://milvus.io/docs/reranking.md">Boost Ranker</a>为您提供了一种在向量搜索结果中注入业务逻辑的方法，而无需接触您的 Embeddings 或重建索引。提升官方内容、降级陈旧结果、增加可控多样性--所有这些都可以通过<a href="https://milvus.io/docs/manage-functions.md">Milvus 功能 API</a> 中简单的过滤器 + 权重配置来实现。</p>
<p>无论您是在构建 RAG 管道、推荐系统还是企业搜索，Boost Ranker 都能帮助您缩小语义相似内容与对用户实际有用内容之间的差距。</p>
<p>如果您正在研究搜索排名并希望讨论您的用例：</p>
<ul>
<li>加入<a href="https://slack.milvus.io/">Milvus Slack 社区</a>，与其他构建搜索和检索系统的开发人员交流。</li>
<li><a href="https://milvus.io/office-hours">预约 20 分钟的免费 Milvus Office Hours 会议</a>，与团队一起讨论您的排名逻辑。</li>
<li>如果你想跳过基础架构设置，<a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a>（托管 Milvus）有一个免费层，可以让你轻松上手。</li>
</ul>
<hr>
<p>团队开始使用 Boost Ranker 时会遇到一些问题：</p>
<p><strong>Boost Ranker 能否取代 Cohere 或 BGE 等基于模型的 Reranker？</strong>它们解决的是不同的问题。基于模型的 Reranker 根据语义质量对结果进行重新评分--它们擅长判断 "哪个文档真正回答了问题"。Boost Ranker 根据业务规则调整分数--它决定 "哪个相关文档应该出现在前面"。在实践中，您往往需要两者兼顾：先用模型排名器来判断语义相关性，然后再用 Boost Ranker 来判断业务逻辑。</p>
<p><strong>Boost Ranker 会显著增加延迟吗？</strong>不会。它操作的是已经检索到的候选集（通常是向量搜索的 Top-K），而不是整个数据集。操作符是简单的过滤和乘法，因此与向量搜索本身相比，开销可以忽略不计。</p>
<p><strong>如何设置权重值？</strong>从小幅调整开始。对于 COSINE 相似度（越高越好），1.1-1.3 的权重通常足以明显改变排名，而不会完全压倒语义相关性。使用您的实际数据进行测试--如果相似度较低的提升结果开始占据主导地位，则降低权重。</p>
<p><strong>我可以组合多个 Boost Ranker 规则吗？</strong>可以。创建多个<code translate="no">Function</code> 对象，然后使用<code translate="no">FunctionScore</code> 将它们组合起来。您可以通过<code translate="no">boost_mode</code> （每条规则如何与原始得分相结合）和<code translate="no">function_mode</code> （规则如何相互结合）来控制规则的交互方式--两者都支持<code translate="no">multiply</code> 和<code translate="no">add</code> 。</p>
