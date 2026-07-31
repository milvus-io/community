---
id: >-
  announcing-milvus-3-lake-native-vector-search-and-a-more-powerful-retrieval-engine.md
title: Milvus 3.0 发布：湖原生向量搜索与更强大的检索引擎
author: Fendy Feng and Li Liu
date: 2026-7-27
cover: assets.zilliz.com/cover_of_milvus_3_0_6fab4ba929.jpg
tag: Announcements
recommend: true
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  Milvus 3.0, lake-native vector search, vector database, External Collections,
  AI retrieval engine
meta_title: |
  Milvus 3.0: Lake-Native Vector Search & Retrieval Engine
desc: 探索 Milvus 3.0 的湖原生向量搜索、零拷贝外部 Collections、更快的稀疏检索、快照、Spark 集成以及高级排序功能。
origin: >-
  https://milvus.io/blog/announcing-milvus-3-lake-native-vector-search-and-a-more-powerful-retrieval-engine.md
---
<p>今天，我们发布 Milvus 3.0，这是该项目的一个重大架构里程碑。它改变了 Milvus 可以构建和服务索引的位置，也改变了可以直接在引擎内完成的检索工作量。</p>
<ul>
<li>Milvus 3.0 引入了<strong>湖原生路径</strong>，用于为位于对象存储和开放表格式中的向量数据建立索引，包括 Parquet、Lance、Iceberg 和 Vortex。团队可以让驻留在湖中的数据可搜索，而无需在向量数据库中维护另一份副本。</li>
<li><strong>此版本还将 Milvus 扩展到初始候选检索之外。</strong>服务端排序、聚合、分面搜索、用于嵌套 doc/chunk 结构和 ColBERT 向量的 StructArray，以及重新设计的稀疏索引，将更多排序、分组和结果处理从应用代码移入检索引擎。</li>
</ul>
<p>这些进展共同使 Milvus 成为生产级 AI 检索的开源基础，也成为结合湖原生存储与高性能向量检索的 <a href="https://zilliz.com/blog/from-vector-database-to-vector-lakebase">向量 Lakebase</a> 架构的基础。</p>
<iframe width="560" height="315" src="https://www.youtube.com/embed/SAm4YfrO1ok?si=xzgw5RjRTwaHWYxO" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
<h2 id="A-quick-glance-at-the-Milvus-30-feature-set" class="common-anchor-header">快速了解 Milvus 3.0 功能集<button data-href="#A-quick-glance-at-the-Milvus-30-feature-set" class="anchor-icon" translate="no">
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
    </button></h2><table>
<thead>
<tr><th><strong>领域</strong></th><th><strong>功能</strong></th><th><strong>为什么重要</strong></th></tr>
</thead>
<tbody>
<tr><td>湖原生检索</td><td>基于 Parquet、Lance、Iceberg 和 Vortex 的外部 Collections</td><td>搜索驻留在湖中的数据，而无需维护第二份服务副本</td></tr>
<tr><td>基于 S3 的存储</td><td>Loon（Storage v3）</td><td>减少服务式访问的点读放大，并支持 Schema 演进</td></tr>
<tr><td>离线/批处理工作流与恢复</td><td>快照、Spark DataSource V2 和在线 Schema 演进</td><td>将稳定的 Collection 视图引入评估、去重、聚类和特征流水线</td></tr>
<tr><td>检索引擎</td><td>ORDER BY、聚合、分面、StructArray 和改进的稀疏检索</td><td>将更多结果处理和多向量评分移入 Milvus</td></tr>
<tr><td>数据模型与操作</td><td>可空向量、TEXT LOB、TTL、MinHash、Woodpecker 和 ForceMerge</td><td>支持更丰富的数据模型和生产操作模式</td></tr>
</tbody>
</table>
<h2 id="The-lake-native-infrastructure-index-and-serve-data-where-it-already-lives" class="common-anchor-header">湖原生基础设施：在数据已存在的位置建立索引并提供服务<button data-href="#The-lake-native-infrastructure-index-and-serve-data-where-it-already-lives" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 3.0 中最大的架构变化，是系统可以在哪里构建并服务索引。向量数据可以保留在对象存储上的开放格式中，同时由 Milvus 提供生产级索引、检索和 API。</p>
<h3 id="1-External-Collections-indexing-directly-on-lake-resident-data" class="common-anchor-header">1. 外部 Collections：直接在驻留于湖中的数据上建立索引</h3><p>许多团队已经将 Embeddings 存储在数据湖中——Lance 表、Iceberg 表、Parquet 文件，或 S3、GCS、Azure Blob Storage 上的其他开放格式数据集。在 Milvus 3.0 之前，搜索这些数据通常有两种选择。</p>
<ul>
<li>将 Embeddings 复制到向量数据库中。这提供了低延迟搜索，但会创建第二份副本，并需要一个必须保持同步的 ETL 流水线。</li>
<li>直接查询数据湖。这避免了重复，但如果没有 ANN 索引，向量搜索就会变成无法满足生产延迟要求的暴力扫描。</li>
</ul>
<p><strong>外部 Collections 引入了第三条路径。</strong>你可以在仍保留于对象存储中的数据之上定义 Milvus Collection，将外部字段映射到 Milvus Schema，并使用与原生 Collection 相同的搜索和查询 API。源文件不会移动；Milvus 会在外部数据之上构建并服务向量、BM25 倒排、JSON 和标量索引。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/announcing_milvus_30_lake_native_vector_search_and_a_more_powerful_retrieval_engine_md_1_c1fb7ab16e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>外部 Collections 是只读且零拷贝的</strong>，因此当治理、所有权边界或操作成本要求源数据集保留在湖中时，它们非常有用。</p>
<p>当外部数据集发生变化时，Milvus 会读取其存储清单，并仅为新增片段建立索引，而不是重建整个 Collection。</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">import</span> json
<span class="hljs-keyword">import</span> os
<span class="hljs-keyword">import</span> time

<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> DataType, MilvusClient

client = MilvusClient(uri=<span class="hljs-string">&quot;&quot;</span>)

<span class="hljs-comment"># Register an Iceberg table as a zero-copy collection.</span>
schema = client.create_schema(
    external_source=<span class="hljs-string">&quot;s3://lake/docs/metadata/v1.metadata.json&quot;</span>,
    external_spec=json.dumps(
        {
            <span class="hljs-string">&quot;format&quot;</span>: <span class="hljs-string">&quot;iceberg-table&quot;</span>,
            <span class="hljs-string">&quot;snapshot_id&quot;</span>: <span class="hljs-number">123456789</span>,
            <span class="hljs-string">&quot;extfs&quot;</span>: {
                <span class="hljs-string">&quot;cloud_provider&quot;</span>: <span class="hljs-string">&quot;aws&quot;</span>,
                <span class="hljs-string">&quot;region&quot;</span>: <span class="hljs-string">&quot;us-east-1&quot;</span>,
                <span class="hljs-string">&quot;access_key_id&quot;</span>: os.environ[<span class="hljs-string">&quot;AWS_ACCESS_KEY_ID&quot;</span>],
                <span class="hljs-string">&quot;access_key_value&quot;</span>: os.environ[<span class="hljs-string">&quot;AWS_SECRET_ACCESS_KEY&quot;</span>],
            },
        }
    ),
)

schema.add_field(field_name=<span class="hljs-string">&quot;id&quot;</span>, datatype=DataType.INT64, external_field=<span class="hljs-string">&quot;doc_id&quot;</span>)
schema.add_field(field_name=<span class="hljs-string">&quot;emb&quot;</span>, datatype=DataType.FLOAT_VECTOR, dim=<span class="hljs-number">1024</span>, external_field=<span class="hljs-string">&quot;embedding&quot;</span>)
schema.add_field(field_name=<span class="hljs-string">&quot;title&quot;</span>, datatype=DataType.VARCHAR, max_length=<span class="hljs-number">1024</span>, external_field=<span class="hljs-string">&quot;title&quot;</span>)

client.create_collection(collection_name=<span class="hljs-string">&quot;docs&quot;</span>, schema=schema)

<span class="hljs-comment"># Import the external table snapshot.</span>
job_id = client.refresh_external_collection(collection_name=<span class="hljs-string">&quot;docs&quot;</span>)
<span class="hljs-keyword">while</span> <span class="hljs-literal">True</span>:
    progress = client.get_refresh_external_collection_progress(job_id=job_id)
    <span class="hljs-keyword">if</span> progress.state == <span class="hljs-string">&quot;RefreshCompleted&quot;</span>:
        <span class="hljs-keyword">break</span>
    <span class="hljs-keyword">if</span> progress.state == <span class="hljs-string">&quot;RefreshFailed&quot;</span>:
        <span class="hljs-keyword">raise</span> RuntimeError(progress.reason)
    time.sleep(<span class="hljs-number">1</span>)

index_params = client.prepare_index_params()
index_params.add_index(field_name=<span class="hljs-string">&quot;emb&quot;</span>, index_type=<span class="hljs-string">&quot;HNSW&quot;</span>, metric_type=<span class="hljs-string">&quot;COSINE&quot;</span>)
client.create_index(collection_name=<span class="hljs-string">&quot;docs&quot;</span>, index_params=index_params)

client.load_collection(collection_name=<span class="hljs-string">&quot;docs&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>对于受治理的环境，检索可以在数据被允许存在的位置运行。对于大型 AI 系统，驻留在湖中的数据集可以支持多个检索部署，而无需在它们之间执行迁移作业。</p>
<p>外部 Collections 是一种增量能力。原生 Milvus Collections 仍然是写入密集、低延迟服务的主要路径，而外部 Collections 则面向其记录系统保留在 Milvus 之外的数据集。</p>
<p>更多详情，请参阅 <a href="https://milvus.io/docs/create-an-external-collection.md">创建外部 Collection</a>。</p>
<h3 id="2-Loon-Storage-v3-Efficient-Point-Reads-for-Lake-Native-Retrieval" class="common-anchor-header">2. Loon（Storage v3）：面向湖原生检索的高效点读</h3><p>外部 Collections 提出了一个显而易见的问题：对象存储为规模和持久性而设计，但它能否支持 ANN 搜索之后的窄范围点读？</p>
<p><strong>挑战在于读放大。</strong>向量搜索通常分两个阶段运行：ANN 索引返回候选 ID，系统为这些候选项获取选定字段。针对分析扫描优化的格式，可能会将窄逻辑查找转换为大得多的物理读取。</p>
<p><strong>Milvus 3.0 通过 Loon（也称为 Storage v3）解决了这个问题，它是一个基于清单的列式存储引擎，面向 S3 兼容对象存储。</strong>Loon 将字段组织到具有对齐行 ID 的 <code translate="no">ColumnGroups</code> 中，使标量字段可以偏向过滤和扫描，而向量和点读密集字段则使用为更窄查找设计的布局。</p>
<p>Loon 将向量和倒排索引与文件格式分离，而不是将它们嵌入其中。每个数据集版本都由不可变清单描述，其中记录其 <code translate="no">ColumnGroups</code>，从而允许同一个索引引擎跨 Lance、Parquet、Iceberg 和 Vortex 工作。</p>
<p>清单设计还降低了 Schema 演进的干扰。添加或删除字段可以通过更新元数据完成，而无需重写现有列。填充新字段会写入新的 <code translate="no">ColumnGroup</code>，同时保持现有 <code translate="no">ColumnGroups</code> 不变。</p>
<p><a href="https://github.com/vortex-data/vortex"><strong>Vortex</strong></a> 是此路径的默认格式。它是一种开放的、兼容 Arrow 的列式格式，具有灵活布局和嵌套编码，更适合点查询密集型 AI 数据。在一项内部基准测试中，使用 300 万行、128 维向量、S3 和 256 个并发读取器，测得每次点读的 I/O 从 Parquet 基线约 9.4 MB 降至使用 Loon 的 Vortex 的 0.07 MB，约减少 135 倍。</p>
<p>Milvus 3.0 并不会让对象存储表现得像本地内存。它减少了读放大，否则这种读放大会使对象存储不适合服务式点查找。格式内谓词下推和本地 Vortex 变体是路线图中的下一步。</p>
<p><em>更多详情，请参阅我们的博客：</em><a href="https://milvus.io/blog/why-we-built-loon-a-storage-engine-for-ai-data-that-never-stops-changing.md"><em>为什么我们构建 Loon</em></a><em>以及</em><a href="https://github.com/vortex-data/vortex"><em>Vortex 项目</em></a><em>。</em></p>
<h3 id="3-Snapshots-point-in-time-view-without-data-copy" class="common-anchor-header">3. 快照：无需数据复制的时间点视图</h3><p>即使生产 Collections 持续接收写入，离线作业也需要一致的数据视图。Milvus 快照是一个时间点只读视图，它记录对现有数据、索引和元数据文件的引用，而不是复制完整数据集。</p>
<p>这使得在模型切换、重新 Embeddings 作业或 Schema 迁移等高风险操作之前创建快照的成本足够低。恢复快照可以通过对象存储中的服务端复制复用现有数据和索引文件，而不是重新导入每一行并重建每个索引。此功能对于 AI Agents 等快速变化的工作负载尤其有用，因为数据不断变化，你需要的是频繁、低成本的恢复点，而不是偶尔执行的重型备份。</p>
<p>同一个冻结视图可以在实时 Collection 继续接受写入时支持评估、去重、回填验证和隔离测试。快照稳定了逻辑输入，尽管这些工作负载仍可能共享对象存储和网络带宽等基础设施。</p>
<p>快照不能替代备份。快照引用由实时 Collection 拥有的文件，最适合用于逻辑恢复、克隆和短生命周期的稳定视图。备份则会创建独立副本，用于长期保留和灾难恢复。</p>
<p>更多信息，请参阅 <a href="https://milvus.io/docs/snapshots.md">快照</a>、<a href="https://milvus.io/docs/manage-snapshots.md">管理快照</a> 和 <a href="https://milvus.io/docs/snapshot-use-cases.md">快照使用场景</a>。</p>
<h3 id="4-Spark-connector-connect-Milvus-to-batch-workflows" class="common-anchor-header">4. Spark 连接器：将 Milvus 连接到批处理工作流</h3><p>只有批处理引擎能够读取稳定快照时，稳定快照才有价值。Milvus 3.0 将 Milvus 暴露为 Spark DataSource V2，使 Spark、Databricks 和 EMR 作业能够作为标准批处理流水线的一部分从 Milvus 读取并写入 Milvus。</p>
<p>此功能很重要，因为 AI 数据工作流是迭代式的：去重为重新 Embeddings 提供输入，聚类为评估提供输入，评估生成经过整理的训练或服务集。稳定快照为这些作业提供一致输入，同时实时 Collection 继续提供服务。借助 Spark 连接器，一个作业的输出可以成为下一个作业的输入，而无需每次都从 Milvus 导出完整 Collection。</p>
<p>Milvus 3.0 还引入了向量原生批处理操作符，用于去重、异常检测和聚类等任务，在直接操作向量数据的同时，将计算密集型工作保持在在线查询路径之外。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/announcing_milvus_30_lake_native_vector_search_and_a_more_powerful_retrieval_engine_md_3_cd37cad0c3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="5-Online-schema-changes-and-backfill" class="common-anchor-header">5. 在线 Schema 变更与回填</h3><p>在生产环境中，Schema 很少保持静态——团队会随着时间推移添加新的 Embeddings 模型、稀疏向量、标签、元数据字段和保留策略。Milvus 3.0 允许在服务持续运行时添加、填充和删除列，而不是像过去那样需要破坏性的重建。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/announcing_milvus_30_lake_native_vector_search_and_a_more_powerful_retrieval_engine_md_4_51c9b4e2c1.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>添加或删除列不需要重写现有数据。<code translate="no">client.add_collection_field(...)</code> 会在不让 Collection 离线的情况下添加新的可空列，<code translate="no">client.drop_collection_field(...)</code> 则会在运行时移除已弃用或实验性字段。两者都不会重写现有数据——它们是对 Collection 清单的变更，而不是对数据文件的变更，这就是无需重建的原因。</p>
<p>Milvus 3.0 支持两种回填路径：</p>
<ul>
<li><strong>内部回填</strong>（在 3.0 中）用于从现有字段派生的值。Milvus 可以在内核中从文本列生成 BM25 稀疏向量，从而在构建稠密加稀疏混合检索时无需客户端编码器。</li>
<li><strong>外部回填</strong>（在路线图中）将用于在 Milvus 外部计算的值：创建快照，针对一致视图运行 Spark，计算新列，将值写回，并让 Milvus 增量更新索引。这是大型重新 Embeddings 作业的预期路径——例如，在写入持续进行的同时，为数亿行添加新的 Embeddings 列。</li>
</ul>
<p>在线 Schema 变更与回填结合起来，使检索流水线在数据模型每次变化时无需重建整个 Collection，也能更轻松地演进。</p>
<h2 id="A-More-Powerful-Engine-for-End-to-End-Retrieval" class="common-anchor-header">用于端到端检索的更强大引擎<button data-href="#A-More-Powerful-Engine-for-End-to-End-Retrieval" class="anchor-icon" translate="no">
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
    </button></h2><p>长期以来，Milvus 支持的不仅仅是稠密 ANN 搜索，还包括基于 BM25 的稀疏检索和混合搜索。Milvus 3.0 从另一个维度扩展了引擎：它将更多多阶段检索流水线引入 Milvus 本身，减少过度获取、重复的应用逻辑，以及对独立后处理服务的依赖。</p>
<h3 id="1-Server-side-ORDER-BY-sort-inside-the-engine-per-segment" class="common-anchor-header">1. 服务端 ORDER BY：在引擎内部按 segment 排序</h3><p>以前，排序要求应用过度获取候选项，将它们移动到客户端，并在那里排序。这会消耗带宽，并使最终结果取决于客户端截断发生的位置。</p>
<p><strong>Milvus 3.0 添加了服务端 ORDER BY</strong>，使查询工作负载可以按 rating、price、freshness、inventory 或 timestamp 等标量字段对过滤后的行排序。</p>
<ul>
<li>在查询路径上，每个 segment 对其过滤后的结果集排序，query nodes 合并这些流，proxy 返回请求的切片。</li>
<li>在搜索路径上，ORDER BY 在 Milvus 内部对 ANN 候选集排序，减少客户端过度获取和重复后处理。它不会改变由 ANN 候选项建立的召回边界。</li>
</ul>
<pre><code translate="no" class="language-sql">client.query(
    collection_name=<span class="hljs-string">&quot;products&quot;</span>,
    <span class="hljs-built_in">filter</span>=<span class="hljs-string">&quot;category == &#x27;shoes&#x27;&quot;</span>,
    output_fields=[<span class="hljs-string">&quot;price&quot;</span>, <span class="hljs-string">&quot;rating&quot;</span>],
    limit=<span class="hljs-number">10</span>,
    order_by=[<span class="hljs-string">&quot;rating:desc&quot;</span>, <span class="hljs-string">&quot;price:asc&quot;</span>],
)
<button class="copy-code-btn"></button></code></pre>
<p>这对于将相关性与业务或面向用户的约束（如 rating、price、freshness、inventory 或 timestamp）结合的搜索尤其有用。</p>
<p>更多信息，请参阅 <a href="https://milvus.io/docs/single-vector-search.md#Sort-Search-Results-by-Scalar-Fields--Milvus-30x">按标量字段对搜索结果排序</a> 和 <a href="https://milvus.io/docs/get-and-scalar-query.md#Sort-Query-Results--Milvus-30x">对查询结果排序</a>。</p>
<h3 id="2-Aggregation-and-faceted-search" class="common-anchor-header">2. 聚合与分面搜索</h3><p>Milvus 3.0 添加了查询侧聚合，支持 count、sum、average、minimum 和 maximum 等操作，并可按一个或多个标量字段分组。这消除了团队为了计数、分组或计算简单统计信息而将过滤后的行拉入客户端代码的常见模式。</p>
<pre><code translate="no" class="language-sql">client.query(
    collection_name=<span class="hljs-string">&quot;orders&quot;</span>,
    <span class="hljs-built_in">filter</span>=<span class="hljs-string">&quot;in_stock == true&quot;</span>,
    group_by_fields=[<span class="hljs-string">&quot;category&quot;</span>],
    output_fields=[<span class="hljs-string">&quot;category&quot;</span>, <span class="hljs-string">&quot;count(*)&quot;</span>, <span class="hljs-string">&quot;avg(price)&quot;</span>, <span class="hljs-string">&quot;max(rating)&quot;</span>],
)
<button class="copy-code-btn"></button></code></pre>
<p>Milvus 3.0 还为分面搜索添加了<strong>搜索聚合</strong>。在 ANN 搜索之后，Milvus 按字段对检索到的命中项分组，并返回桶计数、聚合统计信息，以及每个桶的 top-N 样本命中项——这正是按品牌、价格范围、颜色、租户或文档类型分组背后的模式。需要注意的是：搜索聚合作用于 ANN 检索到的结果集，而不是整个 Collection，因此分面计数是近似的。当你需要精确计数时，请使用查询侧聚合。</p>
<p>更多信息，请参阅 <a href="https://milvus.io/docs/get-and-scalar-query.md#Aggregate-Query-Results--Milvus-30x">聚合查询结果</a>。</p>
<h3 id="3-StructArray-for-Nested-Vectors-and-Late-Interaction-Model" class="common-anchor-header">3. 用于嵌套向量和后期交互模型的 StructArray</h3><p>许多实体天然由多个向量表示。长文档是一系列 chunk；视频是一系列帧，你更希望将它们保留在一行中，而不是分散到许多行；产品有多张图片或多个角度。后期交互模型将这一点推得更远——ColBERT 为每个 token 生成一个向量，ColPali 为每个视觉 patch 生成一个向量。在每种情况下，你真正想存储和搜索的单位都是整个实体，而不是每个单独的片段。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/announcing_milvus_30_lake_native_vector_search_and_a_more_powerful_retrieval_engine_md_5_e15816e38b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>StructArray</strong> 允许 Milvus 的一行包含可变长度的结构化元素数组，其中包括多个向量，同时保留单个实体 ID 和一组元数据。这避免了将文档拆分为多行，并在片段之间重复标签、权限或其他字段。</p>
<p>Milvus 支持两种搜索粒度。</p>
<ul>
<li><strong>元素级搜索</strong>将一个查询向量与列表中的每个元素匹配，并返回具体匹配的元素及其偏移量。当你想知道哪个 chunk、token、patch 或图片匹配时，这很有用。如果多个元素匹配，同一行可能会出现多次。</li>
<li><strong>实体级搜索</strong>使用 <code translate="no">MAX_SIM</code> 以及 <code translate="no">MAX_SIM_COSINE</code> 度量，将查询的完整向量列表与行的向量列表进行比较。每个查询 token 在文档中取其最佳匹配，并将这些最佳分数求和。这使 Milvus 原生支持 ColBERT 和 ColPali 等后期交互检索模式，同时保持每个文档一行。</li>
</ul>
<p>为每个 token 向量建立索引可能成本很高；因此 Milvus 3.0 增加了多种加速路径，包括 TokenANN、Muvera 和 Lemur，它们在索引大小、训练成本和召回之间进行权衡。</p>
<table>
<thead>
<tr><th>策略</th><th>第一阶段表示</th><th>成本特征</th><th>最适合</th></tr>
</thead>
<tbody>
<tr><td>TokenANN</td><td>为每个 token 向量建立索引。</td><td>最高，精确</td><td>高区分度模型和短文档</td></tr>
<tr><td>Muvera</td><td>使用随机投影 FDE 为每个文档生成一个向量。</td><td>中等，无需训练</td><td>长文档</td></tr>
<tr><td>Lemur</td><td>使用学习型 MLP 压缩为每个文档生成一个向量</td><td>最低，需要训练</td><td>低区分度模型以及视觉或 patch 向量</td></tr>
</tbody>
</table>
<p>在我们的基准测试中，Lemur 在大多数数据集上的召回率匹配或超过 TokenANN，同时将每个文档压缩为单个向量；例外是长度方差很高的语料库，在这种情况下 TokenANN 或其他策略更安全。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/announcing_milvus_30_lake_native_vector_search_and_a_more_powerful_retrieval_engine_md_7_8ff1ab957e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>对于大于内存的语料库，Milvus 还支持 <code translate="no">DISKANN</code> 索引，将 Embeddings 列表保存在磁盘上以降低 RAM 压力。</p>
<p>元素级搜索已经在 Milvus 2.6 中推出。Muvera、Lemur 和 StructList 的过滤功能是 3.0 中的新特性。</p>
<h3 id="4-BM25-Index-Compression-and-SINDI" class="common-anchor-header">4. BM25 索引压缩与 SINDI</h3><p>Milvus 在早期版本中已经支持稀疏向量搜索。Milvus 3.0 通过块压缩 postings（VByte 相关算法加 SIMD 解码）和量化（内积使用 fp16，BM25 使用 u16）降低了稀疏索引占用。</p>
<p>在一组内部 BM25 基准测试中，在相当的召回率下，新实现的大小约为 Milvus 2.6 稀疏索引的三分之一。更小的索引减少了内存和带宽压力，并且可以在受数据移动限制的工作负载中提高速度。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/announcing_milvus_30_lake_native_vector_search_and_a_more_powerful_retrieval_engine_md_8_2e62fc9573.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Milvus 3.0 还引入了 <a href="https://arxiv.org/abs/2509.08395">SINDI</a>，这是一种新的稀疏检索算法，针对 SPLADE 等学习型稀疏 Embeddings 进行了优化。由于这些 Embeddings 生成的 posting lists 比 BM25 更密集，重度剪枝的搜索算法可能会花费大量 CPU 时间来决定跳过哪些内容。SINDI 则将 postings 组织为紧凑窗口，并使用 SIMD 友好的分数累加来高效处理它们，同时通过无损剪枝保持检索准确性。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/announcing_milvus_30_lake_native_vector_search_and_a_more_powerful_retrieval_engine_md_9_c7de29a223.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>我们还将 SINDI 扩展到其原始设计之外，加入了原生 BM25 支持，使 Milvus 能够对学习型稀疏 Embeddings 和传统全文搜索使用同一条优化的稀疏检索路径。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/announcing_milvus_30_lake_native_vector_search_and_a_more_powerful_retrieval_engine_md_10_e94a903bcd.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>在我们针对 4 个 SPLADE 稀疏向量数据集的基准测试中，在学习型稀疏向量上，SINDI 的 QPS 最高可达到 MaxScore 的约 10 倍，最差情况也约为 5 倍。</p>
<p>SINDI 是 Milvus 3.0 中稀疏内积搜索的默认选择。</p>
<h2 id="Other-Enhancements" class="common-anchor-header">其他增强功能<button data-href="#Other-Enhancements" class="anchor-icon" translate="no">
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
<li><strong>TEXT LOB：</strong>在向量旁存储较长的源文本。小于 64 KB 的文本保持内联；更大的值使用 Vortex LOB 引用。</li>
<li><strong>扩展的稠密索引支持：</strong>在 Faiss 系列中增加更多索引选择，包括 SVS、Panorama、PQ、IVFPQ 和 ScaNN，以满足不同的规模、内存和召回需求。</li>
<li><strong>MinHash 和近重复搜索：</strong>在服务端生成 MinHash 签名，并使用 MINHASH_LSH 检索近重复候选项。</li>
<li><strong>可空向量和新类型：</strong>允许向量字段为 NULL，并添加 TIMESTAMPTZ，用于时间感知过滤和保留策略。</li>
<li><strong>自定义全文词典：</strong>在集群上注册词典、同义词和停用词资源，用于多语言和领域特定分词。</li>
<li><strong>独立 Woodpecker：</strong>将 Milvus 预写日志作为可独立扩展且可观测的服务运行。</li>
<li><strong>实体</strong> <strong>TTL****：</strong>通过 TIMESTAMPTZ 字段使单条记录过期，并在压缩期间先进行 MVCC 过滤再执行垃圾回收。</li>
<li><strong>ForceMerge：</strong>将小 segment 压缩到目标大小并重建索引，以在持续读密集服务之前减少读放大。</li>
<li>以及更多</li>
</ul>
<h2 id="Get-started-with-Milvus-30" class="common-anchor-header">开始使用 Milvus 3.0<button data-href="#Get-started-with-Milvus-30" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 3.0 现已在 Apache 2.0 许可证下发布，并仍然是 LF AI &amp; Data 项目。要开始使用：</p>
<ul>
<li>阅读<a href="https://milvus.io/docs/release_notes.md">发布说明</a>和<a href="https://milvus.io/docs/quickstart.md">快速入门</a>，并在 <a href="https://github.com/milvus-io/milvus">github.com/milvus-io/milvus</a> 获取源代码。</li>
<li>加入 <a href="https://discord.com/invite/8uyFbECzPX">Milvus Discord 社区</a>，或预约 <a href="https://milvus.io/office-hours">Milvus Office Hours</a> 场次，与维护者讨论你的使用场景。</li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/announcing_milvus_30_lake_native_vector_search_and_a_more_powerful_retrieval_engine_md_11_78476298b9.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Milvus-30-and-Zilliz-Vector-Lakebase" class="common-anchor-header">Milvus 3.0 与 Zilliz 向量 Lakebase<button data-href="#Milvus-30-and-Zilliz-Vector-Lakebase" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 3.0 为生产级 AI 检索以及新兴的 <a href="https://zilliz.com/blog/from-vector-database-to-vector-lakebase">向量 Lakebase</a> 架构奠定了开源基础，该架构将湖原生存储与高性能向量检索结合在单一事实来源之上，并以合适的成本运行。</p>
<p><a href="https://zilliz.com/">Zilliz Cloud</a> 是由 Milvus 背后团队构建的全托管向量 Lakebase。它与 Milvus 共享相同的分布式湖原生架构，并与 Milvus API 完全兼容。凭借其专有的 Cardinal 索引引擎，Zilliz Cloud 相比标准开源索引方法可提供高达 10 倍的性价比提升，同时消除管理基础设施的操作复杂性。企业能力包括计算缩容至零、跨区域灾难恢复、BYOC 部署、企业级安全与合规（SOC 2、HIPAA、ISO 27001 和 GDPR），以及最高 99.99% 的 SLA。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/announcing_milvus_30_lake_native_vector_search_and_a_more_powerful_retrieval_engine_md_12_08d1c21d25.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>开发者可以将 Milvus 部署为开源向量数据库，或使用 <a href="https://zilliz.com/">Zilliz Cloud</a> 作为托管平台，覆盖 AI 数据生命周期中的多种工作负载。</p>
<h2 id="What-comes-next" class="common-anchor-header">接下来会有什么<button data-href="#What-comes-next" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 路线图将在 3.0 架构基础上继续推进，包括面向外部 Collections 的谓词下推、外部回填、更多 Spark 操作符，以及对更多表格式的支持，包括 Delta Lake 和 Apache Paimon。</p>
<p>更大的方向很明确：AI 数据系统需要在在线检索与离线数据改进之间形成更紧密的闭环。向量数据不应在团队每次想要搜索、分析、改进或服务它时，都必须被复制到不同系统中。</p>
