---
id: milvus-3-0-external-collection.md
title: Milvus External Collection：索引和检索数据湖驻留数据，无需移动
author: Leo Liu
date: 2026-8-24
cover: assets.zilliz.com/blog_cover_external_collection_3e4d7334de.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  External Collection, Milvus 3.0, vector search on data lake, Iceberg vector
  search, Vector Lakebase
meta_title: >
  Milvus External Collection: Index and Retrieve Lake-Resident Data Without
  Moving It
desc: Milvus 3.0 引入了外部 Collection，使 Milvus 能够针对仍保留在数据湖中的数据构建索引并提供检索服务。
origin: 'https://milvus.io/blog/milvus-3-0-external-collection.md'
---
<p>在许多 AI 流水线中，Embeddings 和元数据已经在数据湖中生成并存储。产品流水线可能会将产品属性和多模态 Embeddings 写入 S3 中的 Parquet 文件。检索或训练语料库可能存放在 Iceberg 或 Lance 表中。数据湖已经是这些数据集被生成、更新、版本化并被数据栈其余部分使用的地方。</p>
<p>然而，向量数据库传统上是围绕数据库自有的服务副本来构建的。如果团队希望对已经存放在数据湖中的数据执行低延迟向量搜索，他们通常有两种选择：</p>
<ul>
<li><strong>将数据复制到向量数据库中。</strong>这提供了 ANN 索引和生产服务路径，但会创建数据集的第二份副本，并且需要一条必须与源保持同步的 ETL 流水线。</li>
<li><strong>直接查询数据湖。</strong>这避免了数据重复，但如果没有 ANN 索引和服务层，向量搜索将退化为不适用于生产延迟要求的扫描。</li>
</ul>
<p><strong>Milvus 3.0</strong> <a href="https://milvus.io/docs/create-an-external-collection.md"><strong>External Collection</strong></a> <strong>引入了第三条路径。</strong> 源数据保留在 Parquet、Iceberg、Lance、Vortex 或其他受支持的外部格式中，而 Milvus 在其上构建并提供索引服务。您可以将外部字段映射到 Milvus Schema 中，定义所需的索引，刷新 Collection，并使用常规的 Milvus 搜索和查询 API——而无需先将源行复制到 Milvus 管理的 Collection 中。</p>
<p>这一架构变化很直接：数据可以留在数据湖中，而 Milvus 在其上增加索引和检索层。</p>
<p>这也使 External Collection 成为迈向 <a href="https://zilliz.com/blog/what-is-a-vector-lakebase"><strong>Vector Lakebase</strong></a><strong> 的重要一步。</strong>Vector Lakebase 是一种统一的、面向 AI 的湖原生数据架构，它将向量数据库级的服务能力与开放式数据湖存储、可复用的湖级索引以及共享语义层相结合。在线检索不再需要从单独的服务副本开始，而 Spark、训练流水线、评估作业和治理工具也不必在另一个版本的数据上运行。它们可以在同一份湖驻数据基础上工作。</p>
<h2 id="What-an-External-Collection-is-and-what-it-changes" class="common-anchor-header">什么是 External Collection，以及它带来了哪些改变<button data-href="#What-an-External-Collection-is-and-what-it-changes" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>External Collection</strong> 是一种 Milvus Collection 类型，其源数据位于 Milvus 管理的存储之外。</p>
<p>如果没有 External Collection，要将该目录接入生产级向量搜索，通常意味着在 Milvus 中再创建一份副本：</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/milvus_30_external_collection_vector_search_on_lake_resident_data_without_a_second_copy_md_2_333b278a04.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>每当目录发生变化、Embedding 模型发生变化或某个字段被回填时，都需要另一条流水线将更新后的数据跨越这一边界移动。</p>
<p>使用 External Collection 后，架构变为：</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/milvus_30_external_collection_vector_search_on_lake_resident_data_without_a_second_copy_md_3_71172afb44.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Milvus <strong>不会</strong>将外部文件作为自己的源数据副本。相反，External Collection 包含 Milvus 解释和搜索这些文件所需的信息：</p>
<ol>
<li>一个用于标识外部文件或表的 <code translate="no">external_source</code>。</li>
<li>一个描述源格式和存储访问方式的 <code translate="no">external_spec</code>。</li>
<li>将 Milvus Schema 中的字段与外部数据集中的列连接起来的 <code translate="no">external_field</code> 映射。</li>
<li>Milvus 为检索创建的索引、manifest 和服务状态。</li>
</ol>
<p><strong>源数据零拷贝并不意味着 Milvus 内部零状态。</strong> Milvus 仍然会构建索引，仍然会消耗计算资源，仍然会缓存数据。变化在于，权威行数据不再仅仅因为需要 Milvus 搜索它们就必须被复制到 Milvus 中。</p>
<h3 id="Normal-Milvus-Collection-vs-External-Collection" class="common-anchor-header">普通 Milvus Collection vs. External Collection</h3><table>
<thead>
<tr><th><strong>关注点</strong></th><th><strong>Milvus 管理的 Collection</strong></th><th><strong>External Collection</strong></th></tr>
</thead>
<tbody>
<tr><td>源记录</td><td>由 Milvus 存储和管理</td><td>保留在外部文件或表中</td></tr>
<tr><td>数据如何进入 Milvus</td><td>插入、更新（upsert）、导入或流式写入</td><td>外部源映射 + Refresh</td></tr>
<tr><td>在线变更</td><td>支持</td><td>Milvus 侧只读</td></tr>
<tr><td>数据新鲜度</td><td>遵循 Milvus 写入路径和一致性模型</td><td>遵循最近一次成功发布的 Refresh</td></tr>
<tr><td>Milvus 管理的状态</td><td>源数据、元数据、索引、缓存</td><td>映射、manifest、索引、缓存</td></tr>
<tr><td>查询路径</td><td>Milvus 搜索和查询 API</td><td>Milvus 搜索和查询 API</td></tr>
<tr><td>最适合的场景</td><td>持续变化的在线数据</td><td>大规模、批量生成、以读为主的数据湖数据</td></tr>
</tbody>
</table>
<p>因此，External Collection 是对普通 Milvus Collections 的补充，而非替代。</p>
<p>系统可以在普通 Milvus Collections 中保存快速变化的在线状态，同时使用 External Collections 来处理大型语料库、目录、历史数据集、模型特征或已在数据湖中生成和治理的其他数据。</p>
<h2 id="Why-removing-the-second-copy-matters" class="common-anchor-header">为什么消除第二份副本很重要<button data-href="#Why-removing-the-second-copy-matters" class="anchor-icon" translate="no">
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
    </button></h2><p>人们很容易将 External Collections 描述为一种存储优化：不将数 TB 的数据复制到另一个数据库中，从而节省存储空间。这确实有用，但这不是主要的架构问题。</p>
<p><strong>更高的成本来自保持两个数据系统的对齐。</strong></p>
<p>再次以产品目录为例。数据平台生成权威的 Parquet 数据集。搜索将其导入向量数据库。推荐团队可能通过 Spark 读取相同的数据湖数据进行离线分析。新的 Embedding 模型随后生成替代的向量列。库存和元数据同时不断变化。</p>
<p>一旦在线服务副本变得独立于数据湖，每次变更都必须跨越这个边界：</p>
<ul>
<li>数据需要被复制；</li>
<li>传输需要被调度和监控；</li>
<li>失败的作业需要重试；</li>
<li>Schema 和权限可能需要在多个系统中表示；</li>
<li>数据新鲜度取决于同步流水线的追赶速度；</li>
<li>团队必须知道哪份副本代表他们真正想要的版本。</li>
</ul>
<p>存储只是其中一项成本。</p>
<table>
<thead>
<tr><th><strong>成本</strong></th><th><strong>数据湖 + 独立服务副本</strong></th><th><strong>External Collection</strong></th></tr>
</thead>
<tbody>
<tr><td><strong>源数据副本</strong></td><td>数据湖副本加单独的服务副本</td><td>源行保留在数据湖中</td></tr>
<tr><td><strong>数据移动</strong></td><td>持续的 ETL/导入流水线</td><td>基于外部源的 Refresh</td></tr>
<tr><td><strong>数据新鲜度</strong></td><td>取决于导出/导入节奏</td><td>由新 Refresh 发布时间控制</td></tr>
<tr><td><strong>治理</strong></td><td>源副本和服务副本必须保持对齐</td><td>源所有权、血缘关系和版本管理保留在数据湖平台</td></tr>
<tr><td><strong>离线复用</strong></td><td>其他消费者可能需要准备自己的副本</td><td>现有数据湖工具可以继续读取同一数据源</td></tr>
<tr><td><strong>服务资源</strong></td><td>围绕数据库副本和查询负载进行配置</td><td>索引、查询计算和缓存可以与源行所有权分开管理</td></tr>
</tbody>
</table>
<p>随着 AI 数据变更频率的不断提高，这种差异变得尤为重要。</p>
<p>团队对语料库进行去重，对数据进行聚类分析。当模型发生变化时，他们会生成新的 Embeddings。他们会添加标签、摘要、抽取的实体、质量分数或反馈信号。他们会对生产应用程序所检索的同一语料库运行评估作业和数据清洗流水线。</p>
<p>如果每个系统都拥有自己的副本，那么每项改进都会变成又一个同步作业。</p>
<p>External Collection 改变了这个边界：<strong>离线系统可以继续在数据湖数据集上工作，而 Milvus 在同一基础上提供检索服务。</strong></p>
<h2 id="What-data-sources-External-Collection-supports" class="common-anchor-header">External Collection 支持哪些数据源<button data-href="#What-data-sources-External-Collection-supports" class="anchor-icon" translate="no">
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
    </button></h2><p>External Collection 围绕开放的、外部管理的数据而设计，而非 Milvus 专属的源布局。它通过 <a href="https://milvus.io/blog/why-we-built-loon-a-storage-engine-for-ai-data-that-never-stops-changing.md">Storage V3</a> 支持多种外部源格式：</p>
<table>
<thead>
<tr><th><strong>外部格式</strong></th><th><strong>format 值</strong></th><th><strong>Milvus 读取的内容</strong></th></tr>
</thead>
<tbody>
<tr><td>Apache Parquet</td><td>parquet</td><td>包含 Parquet 文件和行组的目录或对象存储前缀</td></tr>
<tr><td>Vortex</td><td>vortex</td><td>Vortex 文件及其布局元数据</td></tr>
<tr><td>Lance</td><td>lance-table</td><td>Lance 数据集及其 fragment 元数据</td></tr>
<tr><td>Apache Iceberg</td><td>iceberg-table</td><td>Iceberg 元数据加选定的快照</td></tr>
<tr><td>Milvus snapshot</td><td>milvus-table</td><td>作为外部源暴露的受支持的 Milvus 快照</td></tr>
</tbody>
</table>
<p>源与 Milvus 之间的映射是显式的。</p>
<p>名为 <code translate="no">product_id</code> 的源列可以成为 Milvus 的 <code translate="no">id</code> 字段；<code translate="no">image_vec</code> 可以成为 <code translate="no">embedding</code> 字段；宽源表也不需要将每一列都暴露给 Collection。这意味着数据平台不必为了满足服务数据库的要求而重命名或重写其数据源。</p>
<p>带版本管理的格式还增加了另一个有用的特性。对于 Iceberg 等数据源，Collection 可以指向特定的快照，而不是查询运行时恰好是最新的内容。固定的源版本对于可重复的评估、回归测试、历史分析和审计工作负载非常有用。</p>
<p>底层文件也仍然可以被数据栈的其余部分使用。Spark、训练框架、治理系统和其他兼容数据湖的工具可以继续读取相同的开放数据。</p>
<p>External Collection 只是为该数据增加了另一个消费者；它不会让 Milvus 成为其唯一所有者。</p>
<h3 id="Accessing-external-storage-securely" class="common-anchor-header">安全访问外部存储</h3><p>Milvus 还需要获得读取外部存储的权限。</p>
<p>根据存储提供商的不同，部署可以使用工作负载或实例身份、AWS STS 角色扮演、服务账号模拟、基于 SAS 的访问或提供商特定的角色系统等机制，而无需在应用程序配置中嵌入长期有效的凭据。</p>
<p>这种存储身份控制着 Milvus 如何访问数据源。Milvus 内部的授权仍然是一个独立的安全边界。</p>
<h2 id="How-to-create-index-refresh-and-query-an-external-collection" class="common-anchor-header">如何创建、索引、刷新和查询 External Collection<button data-href="#How-to-create-index-refresh-and-query-an-external-collection" class="anchor-icon" translate="no">
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
    </button></h2><p>External Collection 的生命周期包含四个主要步骤：</p>
<ol>
<li>定义外部源并将其列映射到 Milvus Schema 中。</li>
<li>定义工作负载所需的索引。</li>
<li>运行 Refresh，让 Milvus 发现源数据并准备可查询的版本。</li>
<li>加载 Collection 并使用常规的 Milvus 搜索和查询 API。</li>
</ol>
<p>下面是将同一个产品目录表示为 External Collection 的示例：</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">import</span> json
<span class="hljs-keyword">import</span> time

<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> <span class="hljs-title class_">DataType</span>, <span class="hljs-title class_">MilvusClient</span>

client = <span class="hljs-title class_">MilvusClient</span>(
    uri=<span class="hljs-string">&quot;http://localhost:19530&quot;</span>,
    token=<span class="hljs-string">&quot;root:Milvus&quot;</span>,
)

schema = client.<span class="hljs-title function_">create_schema</span>(
    external_source=<span class="hljs-string">&quot;s3://my-lake/datasets/products/&quot;</span>,
    external_spec=json.<span class="hljs-title function_">dumps</span>(
        {
            <span class="hljs-string">&quot;format&quot;</span>: <span class="hljs-string">&quot;parquet&quot;</span>,
            <span class="hljs-string">&quot;extfs&quot;</span>: {
                <span class="hljs-string">&quot;cloud_provider&quot;</span>: <span class="hljs-string">&quot;aws&quot;</span>,
                <span class="hljs-string">&quot;region&quot;</span>: <span class="hljs-string">&quot;us-east-1&quot;</span>,
                <span class="hljs-string">&quot;use_iam&quot;</span>: <span class="hljs-string">&quot;true&quot;</span>,
                <span class="hljs-string">&quot;iam_endpoint&quot;</span>: <span class="hljs-string">&quot;https://sts.us-east-1.amazonaws.com&quot;</span>,
            },
        }
    ),
)

schema.<span class="hljs-title function_">add_field</span>(
    field_name=<span class="hljs-string">&quot;id&quot;</span>,
    datatype=<span class="hljs-title class_">DataType</span>.<span class="hljs-property">INT64</span>,
    external_field=<span class="hljs-string">&quot;product_id&quot;</span>,
)
schema.<span class="hljs-title function_">add_field</span>(
    field_name=<span class="hljs-string">&quot;embedding&quot;</span>,
    datatype=<span class="hljs-title class_">DataType</span>.<span class="hljs-property">FLOAT_VECTOR</span>,
    dim=<span class="hljs-number">768</span>,
    external_field=<span class="hljs-string">&quot;image_vec&quot;</span>,
)
schema.<span class="hljs-title function_">add_field</span>(
    field_name=<span class="hljs-string">&quot;title&quot;</span>,
    datatype=<span class="hljs-title class_">DataType</span>.<span class="hljs-property">VARCHAR</span>,
    max_length=<span class="hljs-number">256</span>,
    external_field=<span class="hljs-string">&quot;product_name&quot;</span>,
)
schema.<span class="hljs-title function_">add_field</span>(
    field_name=<span class="hljs-string">&quot;stock&quot;</span>,
    datatype=<span class="hljs-title class_">DataType</span>.<span class="hljs-property">INT64</span>,
    external_field=<span class="hljs-string">&quot;stock&quot;</span>,
)
schema.<span class="hljs-title function_">add_field</span>(
    field_name=<span class="hljs-string">&quot;rating&quot;</span>,
    datatype=<span class="hljs-title class_">DataType</span>.<span class="hljs-property">FLOAT</span>,
    external_field=<span class="hljs-string">&quot;rating&quot;</span>,
)

client.<span class="hljs-title function_">create_collection</span>(
    collection_name=<span class="hljs-string">&quot;products_ext&quot;</span>,
    schema=schema,
)
<button class="copy-code-btn"></button></code></pre>
<p>索引使用常规的 Milvus 接口：</p>
<pre><code translate="no" class="language-python">index_params = client.<span class="hljs-title function_">prepare_index_params</span>()
index_params.<span class="hljs-title function_">add_index</span>(
    field_name=<span class="hljs-string">&quot;embedding&quot;</span>,
    index_type=<span class="hljs-string">&quot;HNSW&quot;</span>,
    metric_type=<span class="hljs-string">&quot;COSINE&quot;</span>,
)
index_params.<span class="hljs-title function_">add_index</span>(field_name=<span class="hljs-string">&quot;stock&quot;</span>, index_type=<span class="hljs-string">&quot;AUTOINDEX&quot;</span>)
index_params.<span class="hljs-title function_">add_index</span>(field_name=<span class="hljs-string">&quot;rating&quot;</span>, index_type=<span class="hljs-string">&quot;AUTOINDEX&quot;</span>)

client.<span class="hljs-title function_">create_index</span>(
    collection_name=<span class="hljs-string">&quot;products_ext&quot;</span>,
    index_params=index_params,
)
<button class="copy-code-btn"></button></code></pre>
<p>然后刷新外部源：</p>
<pre><code translate="no" class="language-python">job_id = client.refresh_external_collection(
    collection_name=<span class="hljs-string">&quot;products_ext&quot;</span>,
)

<span class="hljs-keyword">while</span> <span class="hljs-literal">True</span>:
    progress = client.get_refresh_external_collection_progress(job_id=job_id)
    <span class="hljs-keyword">if</span> progress.state == <span class="hljs-string">&quot;RefreshCompleted&quot;</span>:
        <span class="hljs-keyword">break</span>
    <span class="hljs-keyword">if</span> progress.state == <span class="hljs-string">&quot;RefreshFailed&quot;</span>:
        <span class="hljs-keyword">raise</span> RuntimeError(progress.reason)
    time.sleep(<span class="hljs-number">2</span>)
<button class="copy-code-btn"></button></code></pre>
<p>刷新版本就绪后，就可以像普通 Milvus Collection 一样加载和搜索它：</p>
<pre><code translate="no" class="language-python">client.load_collection(<span class="hljs-string">&quot;products_ext&quot;</span>)

results = client.search(
    collection_name=<span class="hljs-string">&quot;products_ext&quot;</span>,
    data=[query_vec],
    anns_field=<span class="hljs-string">&quot;embedding&quot;</span>,
    <span class="hljs-built_in">filter</span>=<span class="hljs-string">&quot;stock &gt; 0 and rating &gt;= 4.0&quot;</span>,
    limit=<span class="hljs-number">10</span>,
    output_fields=[<span class="hljs-string">&quot;id&quot;</span>, <span class="hljs-string">&quot;title&quot;</span>, <span class="hljs-string">&quot;stock&quot;</span>, <span class="hljs-string">&quot;rating&quot;</span>],
)
<button class="copy-code-btn"></button></code></pre>
<p>重要的区别不在于搜索调用本身，而在于生命周期的起点。Milvus 管理的 Collection 始于将数据写入或导入 Milvus。而 External Collection 始于对已经存在于其他位置的数据的引用。</p>
<h2 id="How-Refresh-picks-up-changes-in-external-data" class="common-anchor-header">Refresh 如何捕获外部数据中的变更<button data-href="#How-Refresh-picks-up-changes-in-external-data" class="anchor-icon" translate="no">
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
    </button></h2><p>External Collection 在 Milvus 侧是只读的，但底层的数据湖数据集不必永远保持不变。</p>
<p>假设产品流水线新增了一批数据、更新了元数据，或使用新模型写入了 Embeddings。Milvus 不会持续跟踪源路径中出现的每一个对象。这些变更通过 <strong>Refresh</strong> 变为可见。</p>
<p>Refresh 会读取外部元数据，解析源 fragment，更新将它们与 Milvus Collection 关联的 manifest，并准备相应的索引状态。</p>
<p>关键在于，这项工作可以是增量的。</p>
<p>Milvus 会识别未发生变化的源 fragment，并复用它们现有的 segment 和索引成果。新的或已变更的 fragment 才是需要重新处理的部分。</p>
<p>因此，对多 TB 数据集的小规模变更不必触发又一次全量导入和全量索引重建。</p>
<p>Refresh 还为服务系统提供了清晰的版本边界。在准备新版本期间，查询继续使用先前发布的状态。一旦 Refresh 完成，新状态将作为完整版本可用，而不会暴露新旧混合或部分准备的数据。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/milvus_30_external_collection_vector_search_on_lake_resident_data_without_a_second_copy_md_4_46aaa22589.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>这种模型天然适合每小时构建的目录、每晚更新的知识库、周期性的 Embedding 刷新、模型生成的特征流水线以及类似的批处理型工作负载。</p>
<p>它<strong>不能</strong>替代流式写入路径。如果每次插入或删除都必须立即可通过 Milvus 搜索，那么 Milvus 管理的 Collection 仍然是更好的模型。</p>
<h2 id="How-Lazy-Loading-reduces-memory-use-for-wide-datasets" class="common-anchor-header">Lazy Loading 如何减少宽数据集的内存使用<button data-href="#How-Lazy-Loading-reduces-memory-use-for-wide-datasets" class="anchor-icon" translate="no">
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
    </button></h2><p>只有当服务层不必在回答查询之前将每个字节都加载到本地时，将源行保留在对象存储中才有意义。启用 Milvus Tiered Storage（分层存储）后，就不必如此。</p>
<p>在 Collection 加载时，QueryNodes 最初只需保留轻量级元数据，例如 Schema 信息、索引定义、chunk 映射以及对远程对象的引用。字段数据在查询需要时按 chunk 级别获取；索引在首次使用前可以保留在远程，之后缓存在本地。高频使用的数据保持热状态，而访问频率较低的数据可以被逐出。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/milvus_30_external_collection_vector_search_on_lake_resident_data_without_a_second_copy_md_5_145b2aa0c7.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>这对于宽 AI 数据集尤其有用。</p>
<p>一个产品行可能包含多个 Embeddings、长描述、原始 JSON、图像元数据、生成的摘要、库存、定价、评分以及许多其他属性。典型的相似性搜索可能只需要一个向量以及库存、价格和评分。没有理由因为其他字段属于同一条记录就让它们永久占用服务内存。</p>
<p>External Collection 可以在两个层面缩小服务占用空间：</p>
<ul>
<li><strong>第一，Schema 级投影。</strong> 通过 <code translate="no">external_field</code>，External Collection 可以只暴露应用程序需要的源列。其他列保留在数据湖数据集中，不包含在此服务 Schema 中。</li>
<li><strong>第二，运行时投影。</strong> 在分层服务模型下，QueryNodes 按需获取并缓存工作负载实际需要的字段和索引，而不是预先加载整个映射的数据集。</li>
</ul>
<p>换句话说，<strong>数据集可以在数据湖中保持宽表形态，而无需让服务占用空间也同等宽大。</strong></p>
<p>这里存在一个明显的权衡。查询首次访问冷字段或冷索引时，可能需要付出远程读取的成本。预热策略可以预加载对延迟敏感的字段或索引，而缓存和逐出策略则可以避免访问频率较低的状态无限期占用本地资源。</p>
<p>重点不在于对象存储可以像内存一样工作，而在于内存和本地磁盘可以跟随检索工作负载的工作集，而不是跟随源数据集的总大小和宽度。</p>
<p>源格式在这里也很重要。为宽泛的分析扫描而设计的格式与针对较窄或随机读取优化的格式，在按需访问下会产生不同的 I/O 行为。External Collection 不会消除这些存储层面的权衡；它让 Milvus 在这些权衡之上构建检索层。</p>
<h2 id="What-search-and-indexing-capabilities-External-Collection-supports" class="common-anchor-header">External Collection 支持哪些搜索和索引能力<button data-href="#What-search-and-indexing-capabilities-External-Collection-supports" class="anchor-icon" translate="no">
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
    </button></h2><p>External Collection 并不是简单地将 Milvus 指向一个 Embeddings 目录然后扫描文件。Milvus 会在外部数据上构建检索结构，并通过其标准检索引擎执行查询。</p>
<h3 id="Milvus-indexes-built-over-external-data" class="common-anchor-header">基于外部数据构建的 Milvus 索引</h3><p>根据字段和工作负载的不同，Milvus 可以构建：</p>
<ul>
<li>用于 ANN 搜索的向量索引；</li>
<li>用于元数据过滤的标量索引；</li>
<li>用于半结构化属性的 JSON 索引；</li>
<li>用于词法检索的 BM25 和全文索引。</li>
<li>Milvus 数据模型支持的函数生成字段。</li>
</ul>
<p>ANN 搜索使用这些索引来缩小候选集，而不是读取每个源向量。</p>
<p>这种区别很重要，因为在数据湖中存储 Embedding 与在其上运行向量数据库并非一回事。持久化带来的只是字节。生产级检索还需要索引、查询规划、过滤、排序、缓存以及低延迟服务路径。</p>
<h3 id="Beyond-vector-top-K" class="common-anchor-header">超越向量 Top-K</h3><p>另一个常见误解是将“External Collection”理解为“对 Parquet 进行向量搜索”。这低估了生产级检索的实际需求。</p>
<p>生产级搜索结果很少仅依赖向量相似度。它还可能依赖于精确词项、访问策略、库存、时间戳、类别、价格、来源质量或业务排序信号。</p>
<p>考虑这样一个查询：</p>
<table>
<thead>
<tr><th>夏季红色碎花连衣裙，有货，评分最高者优先</th></tr>
</thead>
<tbody>
</tbody>
</table>
<p>生产级检索路径可能需要多种信号：</p>
<ul>
<li><strong>向量相似度</strong>，用于理解“夏季碎花连衣裙”的语义。</li>
<li><strong>词法或全文搜索</strong>，用于匹配“红色”等精确词项。</li>
<li><strong>标量过滤</strong>，用于排除缺货或低于评分阈值的产品。</li>
<li><strong>混合检索与排序</strong>，用于组合多种检索信号。</li>
</ul>
<p>Milvus 3.0 还在最初的近邻检索之外扩展了查询引擎，增加了<strong>服务端排序、聚合和分面（faceted）</strong>等能力。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/milvus_30_external_collection_vector_search_on_lake_resident_data_without_a_second_copy_md_6_d805a24b72.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>更广泛的意义在于，External Collection 为存储在数据湖中的数据提供了数据库级检索路径——而不仅仅是从文件中读取向量的方式。</p>
<h2 id="How-the-same-lake-data-supports-online-serving-and-offline-processing" class="common-anchor-header">同一份数据湖数据如何同时支持在线服务和离线处理<button data-href="#How-the-same-lake-data-supports-online-serving-and-offline-processing" class="anchor-icon" translate="no">
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
    </button></h2><p>将数据源保留在开放式数据湖格式中的最强架构理由，并不仅仅是第二份副本需要花费成本，而是同一份数据集可以持续被那些不断改进它的系统所用。</p>
<p>回到产品目录的例子。</p>
<p>白天，Milvus 可以为产品搜索、推荐或 Agent 检索提供 External Collection 服务。</p>
<p>与此同时，其他系统可以直接在数据湖数据集上工作：</p>
<ul>
<li>Spark 可以识别重复产品。</li>
<li>训练流水线可以使用新模型生成 Embeddings。</li>
<li>数据质量作业可以检测格式错误或异常的记录。</li>
<li>评估流水线可以比较不同模型版本之间的检索质量。</li>
<li>批处理可以生成摘要、标签或其他元数据。</li>
</ul>
<p>External Collection <strong>不会</strong>自己运行这些作业。Spark 仍然是 Spark，训练仍然是训练。它的作用是消除它们之间额外的服务数据边界。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/milvus_30_external_collection_vector_search_on_lake_resident_data_without_a_second_copy_md_7_df2791e199.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>离线工作可以将改进后的数据或新字段写回数据湖。随后的 Refresh 会使更新后的数据源对 Milvus 检索路径可用。</p>
<p>不再需要单独的导出-导入循环，仅为了重建另一份权威副本来提供服务。</p>
<p>治理也同样保持清晰的划分。源版本、血缘关系和源所有权保留在数据湖平台。Milvus 维护自己的 Collection 级授权以及读取源所需的凭据。共享单一数据基础并不意味着将每个安全域合并为一个单一系统。</p>
<p>这就是与 <a href="https://zilliz.com/blog/what-is-a-vector-lakebase"><strong>Vector Lakebase</strong></a> 的联系：数据湖仍然是共享的数据基础，而 Milvus 在其之上提供低延迟检索层。External Collection 是该架构的一部分，与 Storage V3、Snapshots、Spark 集成、Schema 演化和回填并列。</p>
<h2 id="Where-External-Collection-fitsand-where-it-does-not" class="common-anchor-header">External Collection 适用的场景——以及不适用的场景<button data-href="#Where-External-Collection-fitsand-where-it-does-not" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>External Collection 在以下场景中非常适用：</strong></p>
<ul>
<li>您的权威数据已经存放在 Parquet、Vortex、Lance、Iceberg 或其他受支持的外部源中。</li>
<li>数据集主要通过批量方式生成，而非高频事务性写入。</li>
<li>维护第二份服务副本会带来显著的 ETL、新鲜度或治理开销。</li>
<li>多个系统需要使用同一份开放数据集。</li>
<li>显式的 Refresh 边界对于服务新鲜度是可以接受的。</li>
<li>您希望在不对 Milvus 成为源行所有者的前提下获得生产级 Milvus 检索能力。</li>
</ul>
<p><strong>在以下场景中，普通 Milvus Collection 仍然是更好的选择：</strong></p>
<ul>
<li>应用程序持续插入或更新记录；</li>
<li>删除需要通过在线写入路径立即可见；</li>
<li>工作负载依赖于外部 Schema 无法提供的 Collection 功能；</li>
<li>服务设计有意将所有必需数据保留在内存中，以避免远程缓存未命中。</li>
</ul>
<p><strong>有几个边界值得注意。</strong></p>
<ul>
<li><strong>External Collections 是只读的。</strong> 源变更发生在 Milvus 之外。</li>
<li><strong>零拷贝仅适用于源行。</strong> 索引、manifest、缓存和计算仍然消耗资源。</li>
<li><strong>Refresh 是显式的。</strong> 它不是流式同步机制。</li>
<li><strong>数据源必须保持可达。</strong> 搜索、索引和刷新行为仍然依赖于存储访问和凭据。</li>
<li><strong>需要 Storage V3。</strong> 在开源 Milvus 3.0 中，必须先启用它才能使用 External Collection。</li>
<li><strong>External Collection 不会替代上游处理。</strong> Embedding 生成、聚类、去重和数据清洗仍然在相应的上游系统中进行。</li>
</ul>
<p>因此，这种选择是互补的，而非二选一。系统可以使用普通 Milvus Collections 处理快速变化的在线状态，使用 External Collections 处理以数据湖为自然归属的大型批量生成数据集。</p>
<h2 id="Try-External-Collection-in-Milvus-30" class="common-anchor-header">在 Milvus 3.0 中试用 External Collection<button data-href="#Try-External-Collection-in-Milvus-30" class="anchor-icon" translate="no">
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
    </button></h2><p>External Collection 已在 Milvus 3.0 中可用。从一个有代表性的数据湖数据集开始，评估对您的工作负载至关重要的方面：初始和增量 Refresh、索引构建成本、热/冷查询行为，以及您的应用程序所需的新鲜度间隔。</p>
<p>有关实现细节，请参阅：</p>
<ul>
<li><a href="https://milvus.io/docs/create-an-external-collection.md">创建 External Collection</a></li>
<li><a href="https://milvus.io/docs/release_notes.md">Milvus 3.0 发布说明</a></li>
<li><a href="https://milvus.io/blog/announcing-milvus-3-lake-native-vector-search-and-a-more-powerful-retrieval-engine.md">Milvus 3.0 发布博客</a></li>
</ul>
<p>如果您更倾向于托管方式，External Collection 也可以作为 Zilliz Cloud 中 <strong>Zilliz Vector Lakebase</strong> 的一部分使用。请参阅：</p>
<ul>
<li><a href="https://docs.zilliz.com/docs/external-collection">Zilliz Cloud 中的 External Collection</a></li>
<li><a href="https://zilliz.com/blog/from-vector-database-to-vector-lakebase">从向量数据库到 Vector Lakebase</a></li>
<li><a href="https://zilliz.com/blog/why-we-built-vector-lakebase">我们为什么构建 Vector Lakebase：重新思考 AI 的非结构化数据架构</a></li>
</ul>
<p>您也可以将实现问题或反馈提交到 <a href="https://github.com/milvus-io/milvus">Milvus GitHub 仓库</a>或 <a href="https://discord.com/invite/8uyFbECzPX">Milvus Discord 社区</a>。</p>
