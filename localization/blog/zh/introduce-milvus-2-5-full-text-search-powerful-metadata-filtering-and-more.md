---
id: introduce-milvus-2-5-full-text-search-powerful-metadata-filtering-and-more.md
title: 介绍 Milvus 2.5：全文搜索、更强大的元数据过滤功能和可用性改进！
author: 'Ken Zhang, Stefan Webb, Jiang Chen'
date: 2024-12-17T00:00:00.000Z
cover: assets.zilliz.com/Introducing_Milvus_2_5_e4968e1cdb.png
tag: Engineering
tags: >-
  Milvus, contribute to open-source projects, vector databases, Contribute to
  Milvus
recommend: true
canonicalUrl: >-
  https://milvus.io/blog/introduce-milvus-2-5-full-text-search-powerful-metadata-filtering-and-more.md
---
<h2 id="Overview" class="common-anchor-header">概述<button data-href="#Overview" class="anchor-icon" translate="no">
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
    </button></h2><p>我们非常高兴地向您介绍 Milvus 的最新版本 2.5，它引入了一项强大的新功能：<a href="https://milvus.io/docs/full-text-search.md#Full-Text-Search">全文搜索</a>，也称为词法或关键词搜索。如果您是搜索新手，全文搜索允许您通过搜索文档中的特定单词或短语来查找文档，类似于您在谷歌中的搜索方式。这与我们现有的语义搜索功能相辅相成，后者可以理解您搜索背后的含义，而不仅仅是匹配准确的单词。</p>
<p>我们使用行业标准 BM25 指标来衡量文档的相似性，我们的实现基于稀疏向量，从而提高了存储和检索效率。对于那些不熟悉这个术语的人来说，稀疏向量是一种表示文本的方法，其中大多数值都为零，因此存储和处理起来非常高效--想象一下，在一个巨大的电子表格中，只有少数几个单元格包含数字，其余都是空的。这种方法非常符合 Milvus 以向量为核心搜索实体的产品理念。</p>
<p>我们的实现还有一个值得注意的方面，那就是能够<em>直接插入</em>和查询文本，而不是让用户先手动将文本转换为稀疏向量。这使 Milvus 向全面处理非结构化数据又迈进了一步。</p>
<p>但这仅仅是个开始。随着 2.5 版本的发布，我们更新了<a href="https://milvus.io/docs/roadmap.md">Milvus 产品路线图</a>。在 Milvus 未来的产品迭代中，我们将重点发展 Milvus 在四个关键方向的功能：</p>
<ul>
<li>简化非结构化数据处理；</li>
<li>更高的搜索质量和效率</li>
<li>更便捷的数据管理；</li>
<li>通过算法和设计进步降低成本</li>
</ul>
<p>我们的目标是在人工智能时代建立既能高效存储又能有效检索信息的数据基础设施。</p>
<h2 id="Full-text-Search-via-Sparse-BM25" class="common-anchor-header">通过稀疏-BM25 进行全文检索<button data-href="#Full-text-Search-via-Sparse-BM25" class="anchor-icon" translate="no">
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
    </button></h2><p>虽然语义搜索通常具有更好的语境意识和意图理解能力，但当用户需要搜索特定的专有名词、序列号或完全匹配的短语时，使用关键字匹配的全文检索通常会产生更准确的结果。</p>
<p>举个例子来说明这一点：</p>
<ul>
<li>当您询问："查找有关可再生能源解决方案的文档 "时，语义搜索就会表现出色。</li>
<li>当您需要：&quot;查找提及<em>特斯拉模型 3 2024</em> 的文档 &quot;时，全文检索更胜一筹</li>
</ul>
<p>在我们之前的版本（Milvus 2.4）中，用户必须在自己的机器上使用单独的工具（PyMilvus的BM25EmbeddingFunction模块）对文本进行预处理，然后才能进行搜索。这种方法有几个局限性：它不能很好地处理不断增长的数据集，需要额外的设置步骤，而且使整个过程变得比必要的还要复杂。对于技术人员来说，主要的限制是它只能在单台机器上工作；用于 BM25 评分的词汇和其他语料库统计数据无法随着语料库的变化而更新；在客户端将文本转换为向量，直接使用文本的直观性较差。</p>
<p>Milvus 2.5 简化了一切。现在，您可以直接处理文本：</p>
<ul>
<li>存储原始文本文档</li>
<li>使用自然语言查询进行搜索</li>
<li>以可读形式获取结果</li>
</ul>
<p>在幕后，Milvus 自动处理所有复杂的向量转换，使文本数据的处理变得更加容易。这就是我们所说的 "文档入库，文档出库 "方法--您只需处理可读文本，其余的由我们来处理。</p>
<h3 id="Techical-Implementation" class="common-anchor-header">技术实现</h3><p>对于那些对技术细节感兴趣的人，Milvus 2.5 通过其内置的 Sparse-BM25 实现增加了全文搜索功能，其中包括</p>
<ul>
<li><strong>基于 tantivy 的标记器</strong>：Milvus 现在与蓬勃发展的 tantivy 生态系统相集成</li>
<li><strong>摄取和检索原始文档的能力</strong>：支持直接摄取和查询文本数据</li>
<li><strong>BM25 相关性评分</strong>：内部化 BM25 评分，基于稀疏向量实现</li>
</ul>
<p>我们选择与完善的 tantivy 生态系统合作，并在 tantivy 上构建 Milvus 文本标记器。未来，Milvus 将支持更多的令牌化器，并公开令牌化过程，帮助用户更好地了解检索质量。我们还将探索基于深度学习的标记符和词干策略，以进一步优化全文检索的性能。下面是使用和配置标记化器的示例代码：</p>
<pre><code translate="no" class="language-Python"><span class="hljs-comment"># Tokenizer configuration</span>
schema.add_field(
    field_name=<span class="hljs-string">&#x27;text&#x27;</span>,
    datatype=DataType.VARCHAR,
    max_length=<span class="hljs-number">65535</span>,
    enable_analyzer=<span class="hljs-literal">True</span>, <span class="hljs-comment"># Enable tokenizer on this column</span>
    analyzer_params={<span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;english&quot;</span>},  <span class="hljs-comment"># Configure tokenizer parameters, here we choose the english template, fine-grained configuration is also supported</span>
    enable_match=<span class="hljs-literal">True</span>, <span class="hljs-comment"># Build an inverted index for Text_Match</span>
)
<button class="copy-code-btn"></button></code></pre>
<p>在 Collections Schema 中配置标记符后，用户可以通过 add_function 方法将文本注册到 bm25 函数中。这将在 Milvus 服务器内部运行。所有后续数据流，如添加、删除、修改和查询，都可以通过操作原始文本字符串（而非向量表示）来完成。请参阅下面的代码示例，了解如何使用新的应用程序接口摄取文本并进行全文搜索：</p>
<pre><code translate="no" class="language-Python"><span class="hljs-comment"># Define the mapping relationship between raw text data and vectors on the schema</span>
bm25_function = Function(
    name=<span class="hljs-string">&quot;text_bm25_emb&quot;</span>,
    input_field_names=[<span class="hljs-string">&quot;text&quot;</span>], <span class="hljs-comment"># Input text field</span>
    output_field_names=[<span class="hljs-string">&quot;sparse&quot;</span>], <span class="hljs-comment"># Internal mapping sparse vector field</span>
    function_type=FunctionType.BM25, <span class="hljs-comment"># Model for processing mapping relationship</span>
)

schema.add_function(bm25_function)
...
<span class="hljs-comment"># Support for raw text in/out</span>
MilvusClient.insert(<span class="hljs-string">&#x27;demo&#x27;</span>, [
    {<span class="hljs-string">&#x27;text&#x27;</span>: <span class="hljs-string">&#x27;Artificial intelligence was founded as an academic discipline in 1956.&#x27;</span>},
    {<span class="hljs-string">&#x27;text&#x27;</span>: <span class="hljs-string">&#x27;Alan Turing was the first person to conduct substantial research in AI.&#x27;</span>},
    {<span class="hljs-string">&#x27;text&#x27;</span>: <span class="hljs-string">&#x27;Born in Maida Vale, London, Turing was raised in southern England.&#x27;</span>},
])

MilvusClient.search(
    collection_name=<span class="hljs-string">&#x27;demo&#x27;</span>,
    data=[<span class="hljs-string">&#x27;Who started AI research?&#x27;</span>],
    anns_field=<span class="hljs-string">&#x27;sparse&#x27;</span>,
    limit=<span class="hljs-number">3</span>
)
<button class="copy-code-btn"></button></code></pre>
<p>我们采用了 BM25 相关性评分的实现方法，将查询和文档表示为稀疏向量，称为<strong>Sparse-BM25</strong>。这就释放了许多基于稀疏向量的优化功能，比如：</p>
<p>Milvus 通过其尖端的<strong>Sparse-BM25 实现</strong>了混合搜索功能，将全文搜索集成到向量数据库架构中。通过将术语频率表示为稀疏向量而不是传统的倒置索引，Sparse-BM25 实现了先进的优化，<strong>如图索引</strong>、<strong>乘积量化（PQ）</strong>和<strong>标量量化（SQ）</strong>。这些优化最大限度地减少了内存使用，并加快了搜索性能。与倒排索引方法类似，Milvus 支持将原始文本作为输入，并在内部生成稀疏向量。这样，它就能与任何标记符号化器配合使用，并掌握动态变化的语料库中显示的任何单词。</p>
<p>此外，基于启发式的剪枝会丢弃低价值的稀疏向量，从而在不影响准确性的前提下进一步提高效率。与以往使用稀疏向量的方法不同，它能适应不断增长的语料库，而不是 BM25 评分的准确性。</p>
<ol>
<li>在稀疏向量上建立图索引，由于倒排索引需要更多步骤才能完成查询中标记的匹配，因此在长文本的查询中，倒排索引的性能优于倒排索引；</li>
<li>利用近似技术（如向量量化和基于启发式的剪枝）来加快搜索速度，同时只对检索质量产生轻微影响；</li>
<li>统一执行语义搜索和全文搜索的界面和数据模型，从而提升用户体验。</li>
</ol>
<pre><code translate="no" class="language-Python"><span class="hljs-comment"># Creating an index on the sparse column</span>
index_params.add_index(
    field_name=<span class="hljs-string">&quot;sparse&quot;</span>,
    index_type=<span class="hljs-string">&quot;AUTOINDEX&quot;</span>,  <span class="hljs-comment"># Default WAND index</span>
    metric_type=<span class="hljs-string">&quot;BM25&quot;</span> <span class="hljs-comment"># Configure relevance scoring through metric_type</span>
)

<span class="hljs-comment"># Configurable parameters at search time to speed up search</span>
search_params = {
    <span class="hljs-string">&#x27;params&#x27;</span>: {<span class="hljs-string">&#x27;drop_ratio_search&#x27;</span>: <span class="hljs-number">0.6</span>}, <span class="hljs-comment"># WAND search parameter configuration can speed up search</span>
}
<button class="copy-code-btn"></button></code></pre>
<p>总之，Milvus 2.5 通过引入全文检索，将搜索能力扩展到语义搜索之外，使用户更容易构建高质量的人工智能应用。这些只是在 Sparse-BM25 搜索领域迈出的第一步，我们预计未来还会有更多优化措施可供尝试。</p>
<h2 id="Text-Matching-Search-Filters" class="common-anchor-header">文本匹配搜索过滤器<button data-href="#Text-Matching-Search-Filters" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.5 发布的第二个文本搜索功能是<strong>文本匹配（Text Match</strong>），它允许用户将搜索筛选为包含特定文本字符串的条目。该功能也建立在标记化的基础上，通过<code translate="no">enable_match=True</code> 激活。</p>
<p>值得注意的是，使用文本匹配时，查询文本的处理是基于标记化后的 OR 逻辑。例如，在下面的示例中，结果将返回包含 "向量 "或 "数据库 "的所有文档（使用 "文本 "字段）。</p>
<pre><code translate="no" class="language-Python"><span class="hljs-built_in">filter</span> = <span class="hljs-string">&quot;TEXT_MATCH(text, &#x27;vector database&#x27;)&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>如果您的场景需要同时匹配 "向量 "和 "数据库"，那么您需要编写两个单独的文本匹配，并用 AND 叠加来实现目标。</p>
<pre><code translate="no" class="language-Python"><span class="hljs-built_in">filter</span> = <span class="hljs-string">&quot;TEXT_MATCH(text, &#x27;vector&#x27;) and TEXT_MATCH(text, &#x27;database&#x27;)&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<h2 id="Significant-Enhancement-in-Scalar-Filtering-Performance" class="common-anchor-header">标量过滤性能显著增强<button data-href="#Significant-Enhancement-in-Scalar-Filtering-Performance" class="anchor-icon" translate="no">
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
    </button></h2><p>我们之所以强调标量过滤性能，是因为我们发现向量检索和元数据过滤的结合可以大大提高各种情况下的查询性能和准确性。这些应用场景既包括图像搜索应用，如自动驾驶中的拐角识别，也包括企业知识库中复杂的 RAG 应用场景。因此，它非常适合企业用户在大规模数据应用场景中实施。</p>
<p>在实际应用中，过滤数据的多少、数据的组织方式以及搜索方式等诸多因素都会影响性能。为了解决这个问题，Milvus 2.5 引入了三种新型索引--BitMap 索引、数组反转索引和标记 Varchar 文本字段后的反转索引。这些新索引可显著提高实际使用案例中的性能。</p>
<p>具体来说</p>
<ol>
<li><strong>BitMap 索引</strong>可用于加速标签过滤（常用操作符包括 in、array_contains 等），适用于字段类别数据（数据 Cardinal）较少的场景。其原理是判断一行数据的某一列上是否有某个值，1 表示有，0 表示没有，然后维护一个 BitMap 列表。下图显示了我们根据客户的业务场景进行的性能测试比较。在该场景中，数据量为 5 亿，数据类别为 20，不同的值有不同的分布比例（1%、5%、10%、50%），不同过滤量下的性能也各不相同。在过滤率为 50%的情况下，我们可以通过 BitMap Index 实现 6.8 倍的性能提升。值得注意的是，随着 Cardinality 的增加，与 BitMap Index 相比，Inverted Index 会表现出更均衡的性能。</li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/QPS_comparison_f3f580d697.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<ol start="2">
<li><strong>文本匹配</strong>基于文本字段标记化后的倒排索引。其性能远远超过我们在 2.4 中提供的通配符匹配（即 like + %）功能。根据我们的内部测试结果，文本匹配的优势非常明显，尤其是在并发查询场景中，其 QPS 最多可提高 400 倍。</li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/data_size_and_concurrency_e19dc44c59.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>在 JSON 数据处理方面，我们计划在 2.5.x 的后续版本中为用户指定的键建立反向索引，并为所有键记录默认位置信息，以加快解析速度。我们希望这两个方面都能显著提升 JSON 和 Dynamic Field 的查询性能。我们计划在未来的发布说明和技术博客中展示更多信息，敬请期待！</p>
<h2 id="New-Management-Interface" class="common-anchor-header">新的管理界面<button data-href="#New-Management-Interface" class="anchor-icon" translate="no">
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
    </button></h2><p>管理数据库不需要计算机科学学位，但我们知道数据库管理员需要功能强大的工具。因此，我们推出了<strong>集群管理 WebUI</strong>，这是一个全新的基于 Web 的界面，可通过集群地址 9091/webui 端口访问。这个可观察性工具提供</p>
<ul>
<li>显示整个集群指标的实时监控仪表板</li>
<li>每个节点的详细内存和性能分析</li>
<li>分段信息和慢查询跟踪</li>
<li>系统健康指标和节点状态</li>
<li>针对复杂系统问题的易用故障排除工具</li>
</ul>
<p>虽然该界面仍处于测试阶段，但我们正在根据数据库管理员的用户反馈积极进行开发。未来的更新将包括人工智能辅助诊断、更多交互式管理功能和增强的集群可观察性功能。</p>
<h2 id="Documentation-and-Developer-Experience" class="common-anchor-header">文档和开发人员体验<button data-href="#Documentation-and-Developer-Experience" class="anchor-icon" translate="no">
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
    </button></h2><p>我们全面改造了<strong>文档</strong>和<strong>SDK/API</strong>体验，使 Milvus 更易于使用，同时为有经验的用户保持深度。改进包括</p>
<ul>
<li>重新构建的文档系统，从基本概念到高级概念的顺序更加清晰</li>
<li>交互式教程和真实示例，展示实际实施情况</li>
<li>全面的 API 参考资料和实用的代码示例</li>
<li>更加友好的 SDK 设计，简化了常用操作符</li>
<li>图文并茂的指南使复杂的概念更容易理解</li>
<li>人工智能文档助手（ASK AI）可提供快速解答</li>
</ul>
<p>更新后的 SDK/API 主要通过更直观的界面和更好的文档集成来改善开发人员的体验。我们相信，您在使用 2.5.x 系列时会注意到这些改进。</p>
<p>不过，我们知道文档和 SDK 的开发是一个持续的过程。我们将根据社区反馈继续优化内容结构和 SDK 设计。加入我们的 Discord 频道，分享您的建议，帮助我们进一步改进。</p>
<h2 id="Summary" class="common-anchor-header"><strong>内容摘要</strong><button data-href="#Summary" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.5 包含 13 项新功能和多项系统级优化，这不仅是 Zilliz 的贡献，也是开源社区的贡献。我们在这篇文章中只介绍了其中的一部分，更多信息请访问我们的<a href="https://milvus.io/docs/release_notes.md">发布说明</a>和<a href="https://milvus.io/docs">官方文档</a>！</p>
