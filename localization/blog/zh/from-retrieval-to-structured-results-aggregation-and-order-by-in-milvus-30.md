---
id: from-retrieval-to-structured-results-aggregation-and-order-by-in-milvus-30.md
title: 从检索到结构化结果：Milvus 3.0 中的聚合和 ORDER BY
author: Chun Han
date: 2026-8-7
cover: assets.zilliz.com/cover_of_milvus_3_blog_37a6c88c81.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus 3.0, query aggregation, Search Aggregation, ORDER BY, vector search'
meta_title: |
  Milvus 3.0 Aggregation & ORDER BY: Query and Search Guide
desc: 了解 Milvus 3.0 如何添加查询聚合、Search Aggregation 和服务器端 ORDER BY，以获得结构化且高效的向量搜索结果。
origin: >-
  https://milvus.io/blog/from-retrieval-to-structured-results-aggregation-and-order-by-in-milvus-30.md
---
<p>考虑一个熟悉的产品搜索流程。购物者上传一张连衣裙照片，向量搜索会从包含数千万件商品的目录中检索出一组相关候选结果。</p>
<p>然而，页面需要的不仅仅是一个排序列表。它需要品牌分面。它需要按价格排序。商品运营团队想知道哪些品牌在这组结果中占主导地位、每个品牌内的价格范围，以及每个分组中的几个代表性商品。</p>
<p>在 Milvus 3.0 之前，应用程序通常自行处理第二步：从 Milvus 获取行，在 pandas 或服务层中对其分组和排序，然后组装响应。一些团队维护了单独的分析流水线，只为计算已存在于向量数据库中的数据的计数和分布。</p>
<p>向量数据库找到了候选项；应用程序则必须把它们转换成结构化结果。</p>
<p>Milvus 3.0 将更多这类工作移入检索引擎。它新增了三项相关但不同的能力：</p>
<ul>
<li><strong>查询聚合</strong>在经过过滤且可见的行上计算 <code translate="no">count</code>、<code translate="no">sum</code>、<code translate="no">avg</code>、<code translate="no">min</code> 和 <code translate="no">max</code>，并可选使用 <code translate="no">GROUP BY</code> 字段。</li>
<li><strong>Search Aggregation</strong> 将保留下来的近似最近邻（ANN）候选项组织到桶中，计算每个桶的指标，构建嵌套桶，并返回代表性命中结果。</li>
<li><strong>服务端</strong> <code translate="no">**ORDER BY**</code> 在应用程序接收结果之前，按一个或多个标量字段对查询结果或 ANN 候选项进行排序。</li>
</ul>
<p>查询和搜索之间的区别很重要：</p>
<table>
<thead>
<tr><th>能力</th><th>被汇总或排序的数据</th><th>主要结果形态</th><th>精确性边界</th></tr>
</thead>
<tbody>
<tr><td>查询聚合</td><td>匹配过滤条件的所有可见行</td><td>每个分组一行，包含聚合值</td><td>在查询的可见行集合上精确</td></tr>
<tr><td>Search Aggregation</td><td>由 ANN 搜索和分组阶段保留的候选项</td><td>桶、指标、代表性命中结果，以及可选的子桶</td><td>设计上就是近似的</td></tr>
<tr><td>查询 <code translate="no">ORDER BY</code></td><td>匹配过滤条件的可见行</td><td>排序后的行</td><td>在过滤后的查询结果上精确</td></tr>
<tr><td>搜索 <code translate="no">ORDER BY</code></td><td>ANN 候选项</td><td>排序后的搜索命中结果或分组</td><td>不会扩大 ANN 召回边界</td></tr>
</tbody>
</table>
<p>本文将解释为什么这些操作应属于数据库内部，分布式聚合如何工作，Search Aggregation 与 Grouping Search 有何不同，以及新语义的边界在哪里。</p>
<h2 id="Why-application-side-post-processing-breaks-down" class="common-anchor-header">为什么应用侧后处理会失效<button data-href="#Why-application-side-post-processing-breaks-down" class="anchor-icon" translate="no">
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
    </button></h2><p>将聚合和排序移到应用程序中，看起来可能只是一个小的实现选择。在规模化场景下，它会造成三个更大的问题。</p>
<h3 id="The-application-moves-far-more-data-than-the-answer-contains" class="common-anchor-header">应用程序移动的数据远多于答案本身包含的数据</h3><p>假设一个运营仪表板需要在两百万条有库存行中，统计每个类别的产品数量和平均价格。即使每行仅按 100 字节的粗略负载来计算，用于类别、价格、主键和序列化开销，应用程序也必须先接收约 200 MB 数据，才能计算结果。</p>
<p>如果目录有 200 个类别，答案只是几百个键和数字——大约只有 KB 级。应用程序移动的数据比它返回的数据多出几个数量级，每次刷新都要支付同样的成本，并且需要足够的客户端内存来保存或流式处理这些中间行。</p>
<p>引擎内聚合改变了数据移动的单位。原始行留在原处。跨节点传输并最终离开 Milvus 的，是小得多的部分分组状态和最终分组状态集合。</p>
<h3 id="Page-local-sorting-is-not-global-sorting" class="common-anchor-header">页面内排序不是全局排序</h3><p>分页之后再排序是正确性缺陷，而不仅仅是低效实现。</p>
<p>如果应用程序获取第 11 到第 20 行，并仅按价格对这些行排序，它得到的是该页面内部的价格顺序，而不是全局按价格排序结果中的第 11 到第 20 行。后续页面可能包含比第一页中所有产品都更便宜的商品。</p>
<p>同样的边界也适用于向量搜索。获取一个较小的 Top-K 集合并在应用程序中排序，只能重新排序这些候选项。它无法找回 ANN 阶段未返回的相关候选项，并且常常导致应用程序为了让客户端排序有意义而过度获取。</p>
<p>服务端排序让 Milvus 控制排序和分页顺序。对于查询工作负载，引擎在应用页面窗口之前先对过滤后的行集合排序。对于搜索工作负载，它在 ANN 候选边界内排序，并明确保留这一限制。</p>
<h3 id="The-client-cannot-reproduce-database-visibility" class="common-anchor-header">客户端无法复现数据库可见性</h3><p>聚合还取决于查询时间戳下哪些行是可见的。删除、过期实体和并发写入都由 Milvus 的多版本并发控制（MVCC）和一致性语义管理。</p>
<p>一旦原始行离开数据库，应用程序通常会假设收到的批次代表正确快照。在客户端重建相同的可见性规则并不现实，尤其是在 collection 正在接收写入和删除时。</p>
<p>常见的变通方案是使用由导出和 ETL 供给的第二个分析引擎，但这会增加另一份数据副本、另一个一致性边界，以及另一条需要运维的流水线。计数、指标和排序应该在数据及其可见性规则已经存在的地方运行。</p>
<p>现在，让我们看看 Milvus 3.0 提供了什么。</p>
<h2 id="Query-aggregation-exact-statistics-over-visible-rows" class="common-anchor-header">查询聚合：对可见行进行精确统计<button data-href="#Query-aggregation-exact-statistics-over-visible-rows" class="anchor-icon" translate="no">
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
    </button></h2><p>查询聚合可以回答如下问题：</p>
<ul>
<li>每个类别中有多少在售产品？</li>
<li>每个品牌的平均价格是多少？</li>
<li>每台主机的最小和最大事件时间戳是多少？</li>
<li>应用过滤条件和 TTL 可见性后还剩多少记录？</li>
</ul>
<p>这个 API 对任何使用过 SQL 的人来说都很熟悉：在 <code translate="no">group_by_fields</code> 中传入一个或多个字段，然后在 <code translate="no">output_fields</code> 中放置聚合表达式。</p>
<pre><code translate="no" class="language-python">res = client.query(
    collection_name=<span class="hljs-string">&quot;products&quot;</span>,
    <span class="hljs-built_in">filter</span>=<span class="hljs-string">&#x27;status == &quot;on_sale&quot;&#x27;</span>,
    group_by_fields=[<span class="hljs-string">&quot;category&quot;</span>],
    output_fields=[<span class="hljs-string">&quot;category&quot;</span>, <span class="hljs-string">&quot;count(*)&quot;</span>, <span class="hljs-string">&quot;avg(price)&quot;</span>],
)

<span class="hljs-comment"># [</span>
<span class="hljs-comment">#     {&quot;category&quot;: &quot;books&quot;, &quot;count(*)&quot;: 18734, &quot;avg(price)&quot;: 45.3},</span>
<span class="hljs-comment">#     ...</span>
<span class="hljs-comment"># ]</span>
<button class="copy-code-btn"></button></code></pre>
<p>语法是简单的部分。执行模型才是让结果在分布式向量数据库中真正有用的关键。</p>
<h3 id="Segment-local-states-replace-raw-row-movement" class="common-anchor-header">Segment 本地状态取代原始行移动</h3><p>一个 Milvus collection 可以跨越分布在多个查询节点上的数百或数千个 segment，且最近写入的数据仍在流式路径上。没有任何单个执行节点一开始就拥有所有可见行。</p>
<p>因此，Milvus 会将聚合下推到 segment：</p>
<ol>
<li>每个 segment 在本地应用过滤条件和 MVCC 可见性规则。</li>
<li>segment 为每个分组发出一个部分状态，而不是发出匹配行。</li>
<li>部分状态在查询节点内合并。</li>
<li>proxy 执行最终的跨节点合并，并返回完成后的分组。</li>
</ol>
<p>此时，中间数据量随分组数和聚合状态数量扩展，而不是直接随匹配行数量扩展。</p>
<p>合并操作取决于聚合类型：</p>
<table>
<thead>
<tr><th>聚合</th><th>部分状态</th><th>合并规则</th></tr>
</thead>
<tbody>
<tr><td><code translate="no">count</code></td><td>部分计数</td><td>计数相加</td></tr>
<tr><td><code translate="no">sum</code></td><td>部分求和</td><td>求和值相加</td></tr>
<tr><td><code translate="no">min</code></td><td>部分最小值</td><td>取最小值</td></tr>
<tr><td><code translate="no">max</code></td><td>部分最大值</td><td>取最大值</td></tr>
<tr><td><code translate="no">avg</code></td><td>部分求和与计数</td><td>两个状态都相加，然后仅在最终阶段做一次除法</td></tr>
</tbody>
</table>
<p><code translate="no">avg</code> 是一个很有说明性的案例。当分区包含的行数不同时，对两个部分平均值再求平均是错误的。Milvus 会分别携带 <code translate="no">sum</code> 和 <code translate="no">count</code>，并且只有在二者都完成全局合并后才计算最终平均值。</p>
<p>这也是聚合属于数据库内部的原因之一：该操作并不是简单地“在多个批次上运行同一个函数”。引擎必须在 segment 和节点边界之间保留每种聚合的代数性质。</p>
<h3 id="Visibility-is-applied-before-aggregation" class="common-anchor-header">可见性在聚合之前应用</h3><p>已删除和已过期的行会根据查询的可见性边界，在 segment 层级从部分状态中移除。它们不会向上传输后再由应用程序修正。</p>
<p>因此，结果描述的是 Milvus 认为该请求可见的行，而不是在略有不同时间拉取的一组任意批次。</p>
<h3 id="limit-now-counts-groups" class="common-anchor-header"><code translate="no">limit</code> 现在统计的是分组</h3><p>在普通查询中，<code translate="no">limit</code> 控制返回多少实体行。在分组查询中，它控制返回多少个分组。由于结果基数由分组而不是匹配行决定，当查询聚合需要每个分组时，也可以省略 <code translate="no">limit</code>。</p>
<p>这听起来只是一个小的 API 细节，但它反映的是一种不同的结果模型：输出不再是一页实体。它是一个行代表分组的关系。</p>
<h2 id="Search-Aggregation-a-bucketed-view-of-ANN-candidates" class="common-anchor-header">Search Aggregation：ANN 候选项的桶视图<button data-href="#Search-Aggregation-a-bucketed-view-of-ANN-candidates" class="anchor-icon" translate="no">
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
    </button></h2><p>查询聚合回答的是：“匹配此过滤条件的可见行是什么样的？”Search Aggregation 问的是另一个问题：“为这个向量检索到的候选集是什么样的？”</p>
<p>这个操作没有精确的 SQL 等价物。ANN 搜索首先建立一个由相似度驱动的候选边界。然后，Milvus 按标量键组织保留下来的候选项，并返回一个桶树，而不是普通的扁平命中列表。</p>
<p>一个桶可以包含：</p>
<ul>
<li>一个键，例如 <code translate="no">brand</code>，或一个复合键，例如 <code translate="no">(brand, color)</code>；</li>
<li>保留候选项计数；</li>
<li>包括 <code translate="no">count</code>、<code translate="no">sum</code>、<code translate="no">avg</code>、<code translate="no">min</code> 和 <code translate="no">max</code> 在内的指标；</li>
<li>通过 <code translate="no">top_hits</code> 选择的代表性实体；以及</li>
<li>用于创建子桶的嵌套 <code translate="no">sub_aggregation</code>。</li>
</ul>
<p>对于产品搜索页面，一个请求即可返回品牌桶、每个桶内的平均价格，以及每个品牌的三个代表性商品：</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> SearchAggregation, TopHits

aggregation = SearchAggregation(
    fields=[<span class="hljs-string">&quot;brand&quot;</span>],
    size=<span class="hljs-number">10</span>,                                    <span class="hljs-comment"># Return up to 10 brand buckets</span>
    metrics={<span class="hljs-string">&quot;avg_price&quot;</span>: {<span class="hljs-string">&quot;avg&quot;</span>: <span class="hljs-string">&quot;price&quot;</span>}},
    order=[{<span class="hljs-string">&quot;_count&quot;</span>: <span class="hljs-string">&quot;desc&quot;</span>}],               <span class="hljs-comment"># Order by retained-candidate count</span>
    top_hits=TopHits(
        size=<span class="hljs-number">3</span>,
        sort=[{<span class="hljs-string">&quot;_score&quot;</span>: <span class="hljs-string">&quot;desc&quot;</span>}],            <span class="hljs-comment"># Use &quot;asc&quot; for L2 distance</span>
    ),
)

res = client.search(
    collection_name=<span class="hljs-string">&quot;products&quot;</span>,
    data=[query_vector],
    anns_field=<span class="hljs-string">&quot;embedding&quot;</span>,
    search_aggregation=aggregation,
    output_fields=[<span class="hljs-string">&quot;title&quot;</span>, <span class="hljs-string">&quot;brand&quot;</span>, <span class="hljs-string">&quot;price&quot;</span>],
)

buckets = res.agg_buckets[<span class="hljs-number">0</span>]
<button class="copy-code-btn"></button></code></pre>
<p>当设置 <code translate="no">search_aggregation</code> 时，普通命中列表为空。应用程序从 <code translate="no">result.agg_buckets</code> 读取桶响应。</p>
<h3 id="The-aggregation-specification-sets-two-different-bounds" class="common-anchor-header">聚合规范设置了两个不同的边界</h3><p>Search Aggregation 不会对 collection 中的每个实体运行 <code translate="no">GROUP BY</code>，也不是简单地拿一个普通 Top-K 响应并聚合那个扁平列表。</p>
<p>它的执行有三个阶段：</p>
<ol>
<li>Milvus 运行 ANN 搜索，以检索靠近查询向量的候选项。</li>
<li>分组阶段为每个完整桶键保留有界数量的候选项。</li>
<li>Milvus 构建桶，基于保留候选项计算指标，对桶排序，并附加代表性命中结果或子桶。</li>
</ol>
<p>两个参数控制结果的不同部分：</p>
<ul>
<li><code translate="no">SearchAggregation.size</code> 限制该聚合层级返回多少个桶。</li>
<li>聚合树中任意位置最大的 <code translate="no">TopHits.size</code> 会设置每个完整复合键的保留候选预算。如果请求不包含 <code translate="no">top_hits</code>，则每个键的预算默认为一。</li>
</ul>
<p>顶层搜索 <code translate="no">limit</code> 不控制此模式，并且在存在 <code translate="no">search_aggregation</code> 时会被忽略。</p>
<p>在阅读桶的 <code translate="no">count</code> 或指标时，这一区别至关重要。使用 <code translate="no">TopHits(size=3)</code> 时，一个品牌桶最多只能汇总其完整键下三个保留候选项，即使 collection 中包含数千个来自该品牌的相关产品。增大 <code translate="no">TopHits.size</code> 会扩大每个键的指标窗口，但它不会把 ANN 搜索变成精确扫描。</p>
<p>如果应用程序需要对匹配过滤条件的每个可见行进行精确统计，应使用查询聚合。Search Aggregation 用于描述和比较由相似度检索产生的候选项。</p>
<h2 id="Search-Aggregation-and-Grouping-Search-solve-different-problems" class="common-anchor-header">Search Aggregation 和 Grouping Search 解决的是不同问题<button data-href="#Search-Aggregation-and-Grouping-Search-solve-different-problems" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 自 Milvus 2.4 起就支持 Grouping Search（<code translate="no">group_by</code>）。很容易因为两个功能中都有“grouping”这个词，就认为它们是同一操作的两个接口。它们的输出契约不同。</p>
<p><strong>Grouping Search</strong> 改变的是哪些实体出现在排序结果列表中。一个常见的 RAG 模式是将 chunk 存储为单独实体，按 <code translate="no">doc_id</code> 对它们分组，并从每个文档返回一个或几个 chunk。主要输出仍然是普通搜索命中结果，只是来自分组字段的重复值更少。</p>
<p><strong>Search Aggregation</strong> 返回的是统计视图。主要输出是一个包含键、计数、指标、代表性命中结果和可选子桶的桶树。</p>
<table>
<thead>
<tr><th>应用需求</th><th>优先选择</th><th>消费对象</th></tr>
</thead>
<tbody>
<tr><td>一个在某个字段上具有更大多样性的排序实体列表</td><td>Grouping Search</td><td>普通搜索命中结果</td></tr>
<tr><td>分面计数、每组指标、代表性命中结果或嵌套分布</td><td>Search Aggregation</td><td><code translate="no">result.agg_buckets</code> 中的 <code translate="no">AggregationBucket</code> 对象</td></tr>
</tbody>
</table>
<p>一个实用规则是从 UI 或 API 响应形态出发。如果应用程序渲染的是列表，Grouping Search 通常是正确的原语。如果它渲染的是分面、分布卡片或分组层级结构，则使用 Search Aggregation。</p>
<p>这两种模式在一个请求中互斥，因为它们定义了不同的主要结果形态。</p>
<h2 id="ORDER-BY-move-sorting-before-the-application-boundary" class="common-anchor-header"><code translate="no">ORDER BY</code>：将排序移到应用程序边界之前<button data-href="#ORDER-BY-move-sorting-before-the-application-boundary" class="anchor-icon" translate="no">
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
    </button></h2><p>排序是本次发布中最不“奇特”的功能，也是最容易在引擎外实现错误的功能之一。</p>
<p>Milvus 3.0 在查询和搜索上都暴露了排序能力，但两条路径使用不同的 SDK 参数，并作用于不同的输入集合。</p>
<h3 id="Query-sorting-orders-the-filtered-row-set" class="common-anchor-header">查询排序对过滤后的行集合排序</h3><p>PyMilvus 查询使用 <code translate="no">order_by</code>，表示为 <code translate="no">&quot;field:direction&quot;</code> 字符串列表。引擎先应用过滤条件，对可见行排序，然后应用 <code translate="no">limit</code> 和 <code translate="no">offset</code>。</p>
<pre><code translate="no" class="language-python">res = client.query(
    collection_name=<span class="hljs-string">&quot;products&quot;</span>,
    <span class="hljs-built_in">filter</span>=<span class="hljs-string">&#x27;category == &quot;books&quot;&#x27;</span>,
    output_fields=[<span class="hljs-string">&quot;title&quot;</span>, <span class="hljs-string">&quot;price&quot;</span>],
    order_by=[<span class="hljs-string">&quot;price:desc&quot;</span>, <span class="hljs-string">&quot;title:asc&quot;</span>],
    limit=<span class="hljs-number">10</span>,
    offset=<span class="hljs-number">10</span>,  <span class="hljs-comment"># Rows 11-20 in the filtered, price-sorted result</span>
)
<button class="copy-code-btn"></button></code></pre>
<p>这使查询适合按业务顺序浏览：最新摄入的记录、过滤条件内价格最高的产品、库存最低的商品，或用于数据检查的极值。如果没有服务端排序，应用程序必须先检索行，并且无法跨页面定义可靠的业务顺序。</p>
<p>对于可为空的查询字段，升序会将 null 放在最后，降序会将 null 放在最前。排序字段不必出现在 <code translate="no">output_fields</code> 中；只有当应用程序需要在响应中获得该值时才包含它。</p>
<h3 id="Search-sorting-reorders-the-ANN-candidate-set" class="common-anchor-header">搜索排序重新排列 ANN 候选集</h3><p>PyMilvus 搜索使用 <code translate="no">order_by_fields</code>，其中每个条目指定一个标量字段和方向：</p>
<pre><code translate="no" class="language-python">res = client.search(
    collection_name=<span class="hljs-string">&quot;products&quot;</span>,
    data=[query_vector],
    anns_field=<span class="hljs-string">&quot;embedding&quot;</span>,
    <span class="hljs-built_in">limit</span>=50,
    output_fields=[<span class="hljs-string">&quot;title&quot;</span>, <span class="hljs-string">&quot;price&quot;</span>],
    order_by_fields=[
        {<span class="hljs-string">&quot;field&quot;</span>: <span class="hljs-string">&quot;price&quot;</span>, <span class="hljs-string">&quot;order&quot;</span>: <span class="hljs-string">&quot;asc&quot;</span>},
    ],
)
<button class="copy-code-btn"></button></code></pre>
<p>ANN 仍然决定哪些实体成为候选项。<code translate="no">order_by_fields</code> 改变的是这些候选项如何返回；它不会让搜索全局扫描 collection 来寻找最便宜的产品。</p>
<p>这一边界赋予两个 API 不同的职责：</p>
<ul>
<li>当标量顺序本身定义结果时，例如库存中最便宜的十个产品，使用查询加 <code translate="no">order_by</code>。</li>
<li>当语义或向量相关性定义候选集，而标量字段决定这些候选项应如何呈现时，使用搜索加 <code translate="no">order_by_fields</code>。</li>
</ul>
<p>多字段排序按列表顺序应用键。当搜索候选项在每个指定标量键上的值都相同时，Milvus 会保留它们原始的相似度分数顺序。</p>
<p>排序也可以与 Grouping Search 组合。Milvus 会按每个分组顶部实体的配置标量值对分组排序，同时保留分组结果形态。当应用程序既希望在某个字段上具有多样性，又希望分组按业务相关顺序排列时，这很有用。</p>
<h2 id="What-these-capabilities-make-possible" class="common-anchor-header">这些能力带来了什么可能<button data-href="#What-these-capabilities-make-possible" class="anchor-icon" translate="no">
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
    </button></h2><p>这些 API 是通用数据库原语，但有几类检索工作负载会立即受益。</p>
<h3 id="RAG-and-agents-inspect-retrieval-concentration" class="common-anchor-header">RAG 和 agents：检查检索集中度</h3><p>RAG 或 agentic 系统可以按源文档、产品线、租户或内容类型对检索到的 chunk 分桶。集中在两个文档中的结果，与分散在数十个来源中的结果相比，传递的是不同的覆盖率信号。</p>
<p>这种分布并不是答案质量的保证。不过，它是一个有用的检索诊断信号，应用程序或 agent 可以在决定是否扩展查询、再次检索或要求澄清时，将其与分数、引用和其他检查结合起来。</p>
<p>当目标只是让返回的 chunk 更加多样化时，Grouping Search 仍然是正确选择。当系统需要分布本身时，Search Aggregation 很有用。</p>
<h3 id="E-commerce-and-content-recommendation-return-facets-with-the-search" class="common-anchor-header">电商和内容推荐：随搜索一起返回分面</h3><p>开头的产品搜索页面可以从 Milvus 接收品牌桶、价格指标、代表性商品，以及按标量排序的候选列表。应用程序仍然控制展示和业务逻辑，但不再需要从导出的命中结果中重建基础桶语义。</p>
<h3 id="Logs-and-security-combine-similarity-with-incident-distribution" class="common-anchor-header">日志与安全：将相似度与事件分布结合</h3><p>相似度搜索可以找到与可疑日志行相关的事件。Search Aggregation 随后可以显示哪些主机在这些候选项中占主导地位、每个主机桶中的最小和最大时间戳，或候选项如何按严重级别和服务划分。</p>
<p>结果仍然是检索候选项的视图，而不是精确的全局事件计数。当调查需要对匹配过滤条件的每个事件进行精确计数时，查询聚合提供了第二条路径。</p>
<h3 id="Operations-and-data-exploration-calculate-instead-of-export" class="common-anchor-header">操作与数据探索：计算而不是导出</h3><p>仪表板和管理工具可以对过滤后的行运行精确计数和平均值，然后按定义好的标量顺序浏览底层实体。这消除了许多一次性的“导出、计算和排序”工具，同时也不会假装 Milvus 已经变成完整的分析数据库。</p>
<h2 id="Boundaries-what-aggregation-and-ORDER-BY-do-not-replace" class="common-anchor-header">边界：聚合和 <code translate="no">ORDER BY</code> 不能替代什么<button data-href="#Boundaries-what-aggregation-and-ORDER-BY-do-not-replace" class="anchor-icon" translate="no">
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
    </button></h2><p>这些功能扩展了检索引擎；它们并不会把 Milvus 变成在线分析处理（OLAP）系统。</p>
<ul>
<li>查询聚合支持分组以及 <code translate="no">count</code>、<code translate="no">sum</code>、<code translate="no">avg</code>、<code translate="no">min</code> 和 <code translate="no">max</code>。它不会新增 join、窗口函数或复杂子查询。大型离线分析任务仍然属于 Spark 等系统，这些系统可以使用 Milvus 3.0 快照和共享存储路径。</li>
<li>查询分组键支持整数、<code translate="no">VARCHAR</code> 和 <code translate="no">TIMESTAMPTZ</code> 字段。Search Aggregation 桶键还额外支持布尔字段。浮点、向量、JSON 和数组值不能作为桶键。</li>
<li>对于 Search Aggregation，<code translate="no">count</code> 接受 <code translate="no">&quot;*&quot;</code> 或非 JSON、非 dynamic 来源；<code translate="no">sum</code> 和 <code translate="no">avg</code> 需要数值来源；<code translate="no">min</code> 和 <code translate="no">max</code> 也支持字符串和 <code translate="no">TIMESTAMPTZ</code> 来源。查询聚合遵循相同的算术类型边界。在对复杂字段类型应用聚合之前，请查阅 API 指南。</li>
<li>查询聚合可以按分组键对分组输出排序，而按计算聚合值（例如 <code translate="no">count(*)</code>）排序仍然是当前边界。没有显式排序时，分组顺序不保证。</li>
<li>Search Aggregation 目前不能在同一个请求中与 Hybrid Search、Grouping Search、Search Iterators、非零 offset 或高亮组合使用。</li>
<li>Search Aggregation 的计数和指标描述的是保留下来的 ANN 候选项，而不是完整 collection，也不是每个可能语义相关的实体。</li>
<li>搜索 <code translate="no">ORDER BY</code> 改变的是候选项呈现方式。它不会修复遗漏的 ANN 候选项，也不会将相似度检索转换成精确的标量 Top-N 查询。</li>
</ul>
<p>在这些新原语之间做选择，最清晰的方法是从问题本身出发：</p>
<ul>
<li>对于过滤后的可见行上的精确统计，使用查询聚合。</li>
<li>对于相似度检索候选项上的分布，使用 Search Aggregation。</li>
<li>对于多样化的排序列表，使用 Grouping Search。</li>
<li>对于定义好的标量顺序，根据哪条路径建立了结果集，使用查询或搜索 <code translate="no">ORDER BY</code>。</li>
</ul>
<h2 id="From-candidate-lists-to-structured-results" class="common-anchor-header">从候选列表到结构化结果<button data-href="#From-candidate-lists-to-structured-results" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>向量数据库传统上优化的是一个问题：哪 K 个实体离这个向量最近？</strong></p>
<p>生产检索系统会立即提出后续问题。哪些分组主导了结果？它们的计数和范围是多少？哪些示例能代表每个分组？应用程序应以什么业务顺序呈现这些行或候选项？</p>
<p>Milvus 3.0 将这些操作带入同一个拥有数据、ANN 候选边界和可见性语义的引擎中。查询聚合对可见行执行精确的分布式规约。Search Aggregation 在保留的 ANN 候选项上构建桶视图。<code translate="no">ORDER BY</code> 为查询和搜索路径提供服务端标量顺序，而无需应用程序逐页重建它。</p>
<p>结果并不是隐藏在向量数据库中的 OLAP 引擎。它是一个能够返回应用程序实际需要的更多结构的检索引擎。</p>
<h2 id="Try-aggregation-and-ORDER-BY-in-Milvus-30" class="common-anchor-header">在 Milvus 3.0 中试用聚合和 <code translate="no">ORDER BY</code><button data-href="#Try-aggregation-and-ORDER-BY-in-Milvus-30" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 3.0 现已可用。使用 <a href="https://milvus.io/docs/get-and-scalar-query.md">Query 指南</a>了解精确聚合和查询排序，使用 <a href="https://milvus.io/docs/search-aggregation.md">Search Aggregation 指南</a>了解桶语义和限制，使用 <a href="https://milvus.io/docs/single-vector-search.md">基础向量搜索指南</a>了解搜索排序，当你的主要目标是结果多样性时，使用 <a href="https://milvus.io/docs/grouping-search.md">Grouping Search 指南</a>。</p>
<p>如需了解更广泛的版本发布内容，请参阅 <a href="https://milvus.io/blog/announcing-milvus-3-lake-native-vector-search-and-a-more-powerful-retrieval-engine.md">Milvus 3.0 发布博客</a>、<a href="https://milvus.io/docs/release_notes.md">Milvus 3.0 发布说明</a>，以及 <a href="https://github.com/milvus-io/milvus">milvus-io/milvus 仓库</a>。</p>
<p>如果你想在不自行运维集群的情况下评估同样的 API，可以在 <a href="https://cloud.zilliz.com">Zilliz Cloud</a> 上试用它们。当前的 <a href="https://docs.zilliz.com/reference/python/python/Vector-query">Zilliz Cloud 查询参考</a>和<a href="https://docs.zilliz.com/reference/python/python/Vector-search">搜索参考</a>介绍了托管集群类型的可用性和参数。</p>
<p>如需与团队讨论工作负载或边界案例，请加入 <a href="https://discord.com/invite/8uyFbECzPX">Milvus Discord 社区</a>，或预约 <a href="https://meetings.hubspot.com/chloe-williams1/milvus-meeting">Milvus Office Hours 场次</a>。</p>
