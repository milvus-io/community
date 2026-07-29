---
id: >-
  announcing-milvus-3-lake-native-vector-search-and-a-more-powerful-retrieval-engine.md
title: Milvus 3.0 发布：Lake-Native 向量搜索与更强大的检索引擎
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
desc: 探索 Milvus 3.0 的湖原生向量搜索、零拷贝外部 Collections、更快的稀疏检索、快照、Spark 集成和高级排序能力。
origin: >-
  https://milvus.io/blog/announcing-milvus-3-lake-native-vector-search-and-a-more-powerful-retrieval-engine.md
---
<p>今天，我们发布 Milvus 3.0，这是该项目在架构上的一个重要里程碑。它改变了 Milvus 可以构建和服务索引的位置，也改变了可直接在引擎内完成的检索工作量。</p>
<ul>
<li>Milvus 3.0 引入了<strong>湖原生路径</strong>，用于为存放在对象存储和开放表格式中的向量数据建立索引，包括 Parquet、Lance、Iceberg 和 Vortex。团队可以让驻留在湖中的数据可搜索，而无需在向量数据库中维护另一份副本。</li>
<li><strong>此版本还将 Milvus 扩展到初始候选检索之外。</strong>服务端排序、聚合、分面搜索、用于嵌套文档/分块结构和 ColBERT 向量的 StructArray，以及重新设计的稀疏索引，将更多排序、分组和结果处理从应用代码移入检索引擎。</li>
</ul>
<p>这些改进共同使 Milvus 成为生产级 AI 检索以及 <a href="https://zilliz.com/blog/from-vector-database-to-vector-lakebase">Vector Lakebase</a> 架构的开源基础，这类架构将湖原生存储与高性能向量检索结合在一起。</p>
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
<tr><th><strong>领域</strong></th><th><strong>功能</strong></th><th><strong>重要性</strong></th></tr>
</thead>
<tbody>
<tr><td>湖原生检索</td><td>基于 Parquet、Lance、Iceberg 和 Vortex 的 External Collections</td><td>无需维护第二份服务副本，即可搜索驻留在湖中的数据</td></tr>
<tr><td>基于 S3 的存储</td><td>Loon (Storage v3)</td><td>降低服务式访问的点读放大，并支持 Schema 演进</td></tr>
<tr><td>离线/批处理工作流和恢复</td><td>Snapshots、Spark DataSource V2 和在线 Schema 演进</td><td>将稳定的 Collection 视图引入评估、去重、聚类和特征流水线</td></tr>
<tr><td>检索引擎</td><td>ORDER BY、聚合、分面、StructArray 和改进的稀疏检索</td><td>将更多结果处理和多向量评分移入 Milvus</td></tr>
<tr><td>数据模型与操作</td><td>可空向量、TEXT LOB、TTL、MinHash、Woodpecker 和 ForceMerge</td><td>支持更丰富的数据模型和生产操作模式</td></tr>
</tbody>
</table>
<h2 id="The-lake-native-infrastructure-index-and-serve-data-where-it-already-lives" class="common-anchor-header">湖原生基础设施：在数据已有位置建立索引并提供服务<button data-href="#The-lake-native-infrastructure-index-and-serve-data-where-it-already-lives" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 3.0 中最大的架构变化，是系统可以构建和服务索引的位置。向量数据可以保留在对象存储上的开放格式中，同时由 Milvus 提供生产级索引、检索和 API。</p>
<h3 id="1-External-Collections-indexing-directly-on-lake-resident-data" class="common-anchor-header">1. External Collections：直接在驻留于湖中的数据上建立索引</h3><p>许多团队已经将嵌入存储在数据湖中——例如 Lance 表、Iceberg 表、Parquet 文件，或 S3、GCS、Azure Blob Storage 上的其他开放格式数据集。在 Milvus 3.0 之前，搜索这些数据通常有两种选择。</p>
<ul>
<li>将嵌入复制到向量数据库中。这能提供低延迟搜索，但会产生第二份副本，并需要一个必须保持同步的 ETL 流水线。</li>
<li>直接查询数据湖。这避免了重复，但如果没有 ANN 索引，向量搜索就会变成无法满足生产延迟要求的暴力扫描。</li>
</ul>
<p><strong>External Collections 引入了第三条路径。</strong>你可以在仍保留于对象存储中的数据之上定义一个 Milvus Collection，将外部字段映射到 Milvus Schema，并使用与原生 Collection 相同的搜索和查询 API。源文件不会移动；Milvus 会在外部数据之上构建并服务向量、BM25 倒排、JSON 和标量索引。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/announcing_milvus_30_lake_native_vector_search_and_a_more_powerful_retrieval_engine_md_1_c1fb7ab16e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>External Collections 是只读且零拷贝的</strong>，因此当治理、所有权边界或操作成本要求源数据集保留在湖中时，它们非常有用。</p>
<p>当外部数据集发生变化时，Milvus 会读取其存储清单，并仅为新增片段建立索引，而不是重建整个 Collection。Collection 级别的加载模式还允许团队选择在本地保留多少数据：</p>
<table>
<thead>
<tr><th><strong>加载模式</strong></th><th><strong>行为</strong></th><th><strong>最适合</strong></th></tr>
</thead>
<tbody>
<tr><td>Take</td><td>每次查询都从对象存储读取</td><td>最低存储成本；对延迟不太敏感的工作负载</td></tr>
<tr><td>LazyLoad</td><td>首次访问时缓存数据</td><td>热数据随时间浮现的混合工作负载</td></tr>
<tr><td>Load</td><td>让数据常驻</td><td>最低延迟服务</td></tr>
</tbody>
</table>
<pre><code translate="no" class="language-python"><span class="hljs-comment"># register a lake table as a zero-copy Collection</span>
client.create_collection(
  name=<span class="hljs-string">&quot;docs&quot;</span>,
  external_source={<span class="hljs-string">&quot;format&quot;</span>: <span class="hljs-string">&quot;iceberg&quot;</span>,  <span class="hljs-comment"># iceberg|lance|parquet|vortex</span>
                   <span class="hljs-string">&quot;uri&quot;</span>: <span class="hljs-string">&quot;s3://lake/docs&quot;</span>},
  schema=[
    Field(<span class="hljs-string">&quot;id&quot;</span>,  INT64, primary=<span class="hljs-literal">True</span>, external_field=<span class="hljs-string">&quot;doc_id&quot;</span>),
    Field(<span class="hljs-string">&quot;emb&quot;</span>, FLOAT_VECTOR, dim=<span class="hljs-number">1024</span>, external_field=<span class="hljs-string">&quot;embedding&quot;</span>),
    Field(<span class="hljs-string">&quot;title&quot;</span>, VARCHAR, external_field=<span class="hljs-string">&quot;title&quot;</span>)])

client.create_index(<span class="hljs-string">&quot;docs&quot;</span>, <span class="hljs-string">&quot;emb&quot;</span>, {<span class="hljs-string">&quot;index_type&quot;</span>: <span class="hljs-string">&quot;HNSW&quot;</span>})  <span class="hljs-comment"># in place</span>
client.load(<span class="hljs-string">&quot;docs&quot;</span>, mode=<span class="hljs-string">&quot;lazy&quot;</span>)  <span class="hljs-comment"># Take | LazyLoad | Load</span>
<button class="copy-code-btn"></button></code></pre>
<p>对于受治理的环境，检索可以在数据被允许驻留的位置运行。对于大型 AI 系统，驻留在湖中的数据集可以支持多个检索部署，而无需在它们之间执行迁移作业。</p>
<p>External Collections 是一项增量能力。原生 Milvus Collections 仍然是写入密集型、低延迟服务的主要路径，而 External Collections 则面向记录系统保留在 Milvus 外部的数据集而设计。</p>
<p>更多详情，请参阅 <a href="https://milvus.io/docs/create-an-external-collection.md">创建 External Collection</a>。</p>
<h3 id="2-Loon-Storage-v3-Efficient-Point-Reads-for-Lake-Native-Retrieval" class="common-anchor-header">2. Loon (Storage v3)：面向湖原生检索的高效点读</h3><p>External Collections 引出了一个显而易见的问题：对象存储为规模和耐久性而设计，但它能否支持 ANN 搜索之后的窄范围点读？</p>
<p><strong>挑战在于读放大。</strong>向量搜索通常分两个阶段运行：ANN 索引返回候选 ID，系统为这些候选项获取选定字段。针对分析扫描优化的格式，可能会将一次窄范围逻辑查找变成规模大得多的物理读取。</p>
<p><strong>Milvus 3.0 通过 Loon（也称为 Storage v3）解决了这一问题。Loon 是一个面向 S3 兼容对象存储、基于清单的列式存储引擎。</strong>Loon 将字段组织到具有对齐行 ID 的 <code translate="no">ColumnGroups</code> 中，使标量字段可以偏向过滤和扫描，而向量以及点读密集型字段则使用为更窄查找设计的布局。</p>
<p>Loon 将向量和倒排索引与文件格式分离，而不是将它们嵌入文件格式中。每个数据集版本都由一个不可变清单描述，该清单记录其 <code translate="no">ColumnGroups</code>，从而使同一个索引引擎能够跨 Lance、Parquet、Iceberg 和 Vortex 工作。</p>
<p>清单设计还降低了 Schema 演进的干扰性。添加或删除字段可以通过更新元数据完成，而无需重写现有列。填充新字段会写入新的 <code translate="no">ColumnGroup</code>，同时让现有 <code translate="no">ColumnGroups</code> 保持不变。</p>
<p><a href="https://github.com/vortex-data/vortex"><strong>Vortex</strong></a> 是这一路径的默认格式。它是一种开放的、兼容 Arrow 的列式格式，具有灵活布局和嵌套编码，能更好地匹配点查询密集型 AI 数据。在一项使用 300 万行、128 维向量、S3 和 256 个并发读取器的内部基准测试中，每次点读测得的 I/O 从 Parquet 基线约 9.4 MB 降至使用 Loon 的 Vortex 的 0.07 MB，约减少 135 倍。</p>
<p>Milvus 3.0 并不会让对象存储表现得像本地内存。它减少了原本会让对象存储不适合服务式点查找的读放大。格式级谓词下推和本地 Vortex 变体是路线图中的下一步。</p>
<p><em>更多详情，请参阅我们的博客：</em><a href="https://milvus.io/blog/why-we-built-loon-a-storage-engine-for-ai-data-that-never-stops-changing.md"><em>为什么我们构建 Loon</em></a><em>以及</em><a href="https://github.com/vortex-data/vortex"><em>Vortex 项目</em></a><em>。</em></p>
<h3 id="3-Snapshots-point-in-time-view-without-data-copy" class="common-anchor-header">3. Snapshots：无需数据复制的时间点视图</h3><p>即使生产 Collections 仍在持续接收写入，离线作业也需要一致的数据视图。Milvus snapshot 是一个时间点只读视图，它记录对现有数据、索引和元数据文件的引用，而不是复制完整数据集。</p>
<p>这使得 snapshots 的创建成本足够低，可在模型切换、重新嵌入作业或 Schema 迁移等高风险操作之前创建。恢复 snapshot 可以通过对象存储中的服务端复制复用现有数据和索引文件，而不是重新导入每一行并重建每个索引。对于 AI agents 等快速变化的工作负载来说，此功能尤其有用，因为数据持续变化，而你更希望拥有频繁、低成本的恢复点，而不是偶尔进行一次沉重的备份。</p>
<p>同一个冻结视图可以支持评估、去重、回填验证和隔离测试，同时实时 Collection 继续接受写入。snapshot 稳定了逻辑输入，尽管这些工作负载仍可能共享对象存储和网络带宽等基础设施。</p>
<p>Snapshots 不能替代备份。snapshot 引用由实时 Collection 拥有的文件，最适合逻辑恢复、克隆和短生命周期稳定视图。备份则会创建用于长期保留和灾难恢复的独立副本。</p>
<p>更多信息，请参阅 <a href="https://milvus.io/docs/snapshots.md">Snapshots</a>、<a href="https://milvus.io/docs/manage-snapshots.md">管理 Snapshots</a> 和 <a href="https://milvus.io/docs/snapshot-use-cases.md">Snapshot 使用案例</a>。</p>
<h3 id="4-Spark-connector-connect-Milvus-to-batch-workflows" class="common-anchor-header">4. Spark 连接器：将 Milvus 连接到批处理工作流</h3><p>只有当批处理引擎能够读取稳定 snapshot 时，它才有用。Milvus 3.0 将 Milvus 暴露为 Spark DataSource V2，允许 Spark、Databricks 和 EMR 作业在标准批处理流水线中读写 Milvus。</p>
<p>此功能之所以重要，是因为 AI 数据工作流是迭代式的：去重会馈入重新嵌入，聚类会馈入评估，而评估会产生经过整理的训练集或服务集。稳定的 snapshot 为这些作业提供一致输入，同时实时 Collection 继续提供服务。借助 Spark 连接器，一个作业的输出就会成为下一个作业的输入，而无需每次都从 Milvus 导出完整 Collection。</p>
<p>Milvus 3.0 还引入了向量原生批处理操作符，用于去重、异常检测和聚类等任务，使计算密集型工作保持在在线查询路径之外，同时直接在向量数据上操作。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/announcing_milvus_30_lake_native_vector_search_and_a_more_powerful_retrieval_engine_md_3_cd37cad0c3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="5-Online-schema-changes-and-backfill" class="common-anchor-header">5. 在线 Schema 变更与回填</h3><p>在生产环境中，Schema 很少保持静态——团队会随着时间添加新的嵌入模型、稀疏向量、标签、元数据字段和保留策略。Milvus 3.0 允许在服务持续运行的同时添加、填充和删除列，而不再需要过去那种破坏性的重建。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/announcing_milvus_30_lake_native_vector_search_and_a_more_powerful_retrieval_engine_md_4_51c9b4e2c1.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>添加或删除列不需要重写现有数据。<code translate="no">client.add_collection_field(...)</code> 会在不让 Collection 离线的情况下落地一个新的可空列，而 <code translate="no">client.drop_collection_field(...)</code> 会在运行时移除已弃用或实验性字段。二者都不会重写现有数据——每一个都是对 Collection 清单的变更，而不是对数据文件的变更，这也是无需重建的原因。</p>
<p>Milvus 3.0 支持两条回填路径：</p>
<ul>
<li><strong>内部回填</strong>（3.0 中提供）适用于由现有字段派生的值。Milvus 可以在内核中从文本列生成 BM25 稀疏向量，从而在构建稠密加稀疏混合检索时消除对客户端编码器的需求。</li>
<li><strong>外部回填</strong>（在路线图中）将用于在 Milvus 外部计算的值：获取 snapshot，针对一致视图运行 Spark，计算新列，将值写回，并让 Milvus 增量更新索引。这是大型重新嵌入作业的预期路径——例如，在写入持续进行的同时，为数亿行添加新的嵌入列。</li>
</ul>
<p>在线 Schema 变更与回填结合起来，使检索流水线更容易演进，而不必每次数据模型变化都重建整个 Collection。</p>
<h2 id="A-More-Powerful-Engine-for-End-to-End-Retrieval" class="common-anchor-header">面向端到端检索的更强大引擎<button data-href="#A-More-Powerful-Engine-for-End-to-End-Retrieval" class="anchor-icon" translate="no">
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
    </button></h2><p>长期以来，Milvus 支持的不只是稠密 ANN 搜索，还包括基于 BM25 的稀疏检索和混合搜索。Milvus 3.0 从另一个维度扩展了引擎：它将更多多阶段检索流水线带入 Milvus 本身，减少过度拉取、重复的应用逻辑以及对独立后处理服务的依赖。</p>
<h3 id="1-Server-side-ORDER-BY-sort-inside-the-engine-per-segment" class="common-anchor-header">1. 服务端 ORDER BY：在引擎内按 segment 排序</h3><p>此前，排序要求应用程序过度拉取候选项，将它们移动到客户端，并在那里排序。这会消耗带宽，并使最终结果取决于客户端截断发生的位置。</p>
<p><strong>Milvus 3.0 增加了服务端 ORDER BY</strong>，允许查询工作负载按 rating、price、freshness、inventory 或 timestamp 等标量字段对过滤后的行进行排序。</p>
<ul>
<li>在查询路径上，每个 segment 对其过滤后的结果集进行排序，查询节点合并这些流，proxy 返回请求的切片。</li>
<li>在搜索路径上，ORDER BY 在 Milvus 内对 ANN 候选集进行排序，减少客户端过度拉取和重复后处理。它不会改变由 ANN 候选项建立的召回边界。</li>
</ul>
<pre><code translate="no" class="language-sql">client.query(
    collection_name=<span class="hljs-string">&quot;products&quot;</span>,
    <span class="hljs-built_in">filter</span>=<span class="hljs-string">&quot;category == &#x27;shoes&#x27;&quot;</span>,
    output_fields=[<span class="hljs-string">&quot;price&quot;</span>, <span class="hljs-string">&quot;rating&quot;</span>],
    limit=<span class="hljs-number">10</span>,
    order_by=[<span class="hljs-string">&quot;rating:desc&quot;</span>, <span class="hljs-string">&quot;price:asc&quot;</span>],
)
<button class="copy-code-btn"></button></code></pre>
<p>这对于将相关性与业务或用户侧约束（如 rating、price、freshness、inventory 或 timestamp）结合起来的搜索尤其有用。</p>
<p>更多信息，请参阅 <a href="https://milvus.io/docs/single-vector-search.md#Sort-Search-Results-by-Scalar-Fields--Milvus-30x">按标量字段排序搜索结果</a> 和 <a href="https://milvus.io/docs/get-and-scalar-query.md#Sort-Query-Results--Milvus-30x">排序查询结果</a>。</p>
<h3 id="2-Aggregation-and-faceted-search" class="common-anchor-header">2. 聚合与分面搜索</h3><p>Milvus 3.0 添加了查询侧聚合，支持 count、sum、average、minimum 和 maximum 等操作，并可按一个或多个标量字段分组。这移除了一个常见模式：团队只是为了计数、分组或计算简单统计信息，就把过滤后的行拉到客户端代码中。</p>
<pre><code translate="no" class="language-sql">client.query(
    collection_name=<span class="hljs-string">&quot;orders&quot;</span>,
    <span class="hljs-built_in">filter</span>=<span class="hljs-string">&quot;in_stock == true&quot;</span>,
    group_by_fields=[<span class="hljs-string">&quot;category&quot;</span>],
    output_fields=[<span class="hljs-string">&quot;category&quot;</span>, <span class="hljs-string">&quot;count(*)&quot;</span>, <span class="hljs-string">&quot;avg(price)&quot;</span>, <span class="hljs-string">&quot;max(rating)&quot;</span>],
)
<button class="copy-code-btn"></button></code></pre>
<p>Milvus 3.0 还为分面搜索添加了<strong>搜索聚合</strong>。在 ANN 搜索之后，Milvus 会按某个字段对检索到的命中项分组，并返回桶计数、聚合统计信息和每个桶的 top-N 示例命中项——这正是按品牌、价格区间、颜色、租户或文档类型分组背后的模式。一个注意事项：搜索聚合是在 ANN 检索到的结果集上操作，而不是整个 Collection，因此分面计数是近似的。当你需要精确计数时，请使用查询侧聚合。</p>
<p>更多信息，请参阅 <a href="https://milvus.io/docs/get-and-scalar-query.md#Aggregate-Query-Results--Milvus-30x">聚合查询结果</a>。</p>
<h3 id="3-StructArray-for-Nested-Vectors-and-Late-Interaction-Model" class="common-anchor-header">3. 用于嵌套向量和后期交互模型的 StructArray</h3><p>许多实体天然由多个向量表示。长文档是一系列分块；视频是一系列帧，你更希望把它们作为一行保存在一起，而不是分散到多行中；产品有多张图片或多个角度。后期交互模型则进一步强化了这一点——ColBERT 每个 token 输出一个向量，ColPali 每个视觉 patch 输出一个向量。在所有情况下，你真正想存储和搜索的单元是整个实体，而不是每个片段本身。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/announcing_milvus_30_lake_native_vector_search_and_a_more_powerful_retrieval_engine_md_5_e15816e38b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>StructArray</strong> 允许 Milvus 的一行包含可变长度的结构化元素数组，其中包括多个向量，同时保留单个实体 ID 和一组元数据。这避免了将文档拆分为多行，并在片段之间重复标签、权限或其他字段。</p>
<p>Milvus 支持两种搜索粒度。</p>
<ul>
<li><strong>元素级搜索</strong>将一个查询向量与列表中的每个元素进行匹配，并返回具体匹配的元素及其偏移量。当你想知道哪个 chunk、token、patch 或图片匹配时，这非常有用。如果多个元素匹配，同一行可能出现多次。</li>
<li><strong>实体级搜索</strong>使用 <code translate="no">MAX_SIM</code> 将查询的完整向量列表与行的向量列表进行比较，并使用 <code translate="no">MAX_SIM_COSINE</code> 度量。每个查询 token 在文档中取得其最佳匹配，并将这些最佳分数相加。这让 Milvus 原生支持 ColBERT 和 ColPali 等后期交互检索模式，同时保持每个文档一行。</li>
</ul>
<p>为每个 token 向量建立索引可能代价高昂；因此 Milvus 3.0 增加了多条加速路径，包括 TokenANN、Muvera 和 Lemur，它们在索引大小、训练成本和召回率之间做权衡。</p>
<table>
<thead>
<tr><th>策略</th><th>第一阶段表示</th><th>成本画像</th><th>最适合</th></tr>
</thead>
<tbody>
<tr><td>TokenANN</td><td>每个 token 向量都会建立索引。</td><td>最高，精确</td><td>高区分度模型和短文档</td></tr>
<tr><td>Muvera</td><td>使用随机投影 FDE，每个文档一个向量。</td><td>中等，无需训练</td><td>长文档</td></tr>
<tr><td>Lemur</td><td>使用学习型 MLP 压缩，每个文档一个向量</td><td>最低，需要训练</td><td>低区分度模型以及视觉或 patch 向量</td></tr>
</tbody>
</table>
<p>在我们的基准测试中，Lemur 在大多数数据集上的召回率与 TokenANN 相当或更好，同时将每个文档压缩为单个向量；例外是长度差异很大的语料库，在这种情况下 TokenANN 或其他策略更安全。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/announcing_milvus_30_lake_native_vector_search_and_a_more_powerful_retrieval_engine_md_7_8ff1ab957e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>对于大于内存的语料库，Milvus 还支持 <code translate="no">DISKANN</code> 索引，将嵌入列表保存在磁盘上以降低 RAM 压力。</p>
<p>元素级搜索已经在 Milvus 2.6 中推出。Muvera、Lemur 和 StructList 的过滤是 3.0 中的新功能。</p>
<h3 id="4-BM25-Index-Compression-and-SINDI" class="common-anchor-header">4. BM25 索引压缩与 SINDI</h3><p>Milvus 在早期版本中已经支持稀疏向量搜索。Milvus 3.0 通过块压缩 postings（VByte 相关算法加 SIMD 解码）和量化（用于内积的 fp16、用于 BM25 的 u16）降低了稀疏索引占用。</p>
<p>在一组内部 BM25 基准测试中，在召回率相当的情况下，新实现的大小大约是 Milvus 2.6 稀疏索引的三分之一。更小的索引降低了内存和带宽压力，并可在受数据移动限制的工作负载中提升速度。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/announcing_milvus_30_lake_native_vector_search_and_a_more_powerful_retrieval_engine_md_8_2e62fc9573.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Milvus 3.0 还引入了 <a href="https://arxiv.org/abs/2509.08395">SINDI</a>，这是一种新的稀疏检索算法，针对 SPLADE 等学习型稀疏嵌入进行了优化。由于这些嵌入会产生比 BM25 更密集的 posting lists，重剪枝搜索算法可能会花费大量 CPU 时间来决定跳过什么。SINDI 则将 postings 组织成紧凑窗口，并使用 SIMD 友好的分数累加来高效处理它们，同时通过无损剪枝保持检索准确性。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/announcing_milvus_30_lake_native_vector_search_and_a_more_powerful_retrieval_engine_md_9_c7de29a223.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>我们还将 SINDI 扩展到其原始设计之外，加入了原生 BM25 支持，使 Milvus 能够对学习型稀疏嵌入和传统全文搜索使用同一条优化后的稀疏检索路径。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/announcing_milvus_30_lake_native_vector_search_and_a_more_powerful_retrieval_engine_md_10_e94a903bcd.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>在我们针对 4 个 SPLADE 稀疏向量数据集的基准测试中，SINDI 在学习型稀疏向量上的 QPS 最高可达到 MaxScore 的约 10 倍，最差情况下也约为 5 倍。</p>
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
<li><strong>扩展的稠密索引支持：</strong>在 Faiss 系列中增加更多索引选择，包括 SVS、Panorama、PQ、IVFPQ 和 ScaNN，以满足不同规模、内存和召回要求。</li>
<li><strong>MinHash 与近重复搜索：</strong>在服务端生成 MinHash 签名，并使用 MINHASH_LSH 检索近重复候选项。</li>
<li><strong>可空向量和新类型：</strong>允许向量字段为 NULL，并增加 TIMESTAMPTZ，用于时间感知过滤和保留策略。</li>
<li><strong>自定义全文词典：</strong>在集群上注册词典、同义词和停用词资源，用于多语言和特定领域分词。</li>
<li><strong>Standalone Woodpecker：</strong>将 Milvus 预写日志作为可独立扩展和可观测的服务运行。</li>
<li><strong>实体</strong> <strong>TTL****：</strong>通过 TIMESTAMPTZ 字段使单条记录过期，并在压缩期间先进行 MVCC 过滤，再进行垃圾回收。</li>
<li><strong>ForceMerge：</strong>将小 segment 压缩到目标大小并重建索引，以在持续读密集型服务之前降低读放大。</li>
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
    </button></h2><p>Milvus 3.0 今天已在 Apache 2.0 许可证下发布，并仍然是 LF AI &amp; Data 项目。要开始使用：</p>
<ul>
<li>阅读<a href="https://milvus.io/docs/release_notes.md">发布说明</a>和<a href="https://milvus.io/docs/quickstart.md">快速入门</a>，并在 <a href="https://github.com/milvus-io/milvus">github.com/milvus-io/milvus</a> 获取源码。</li>
<li>加入 <a href="https://discord.com/invite/8uyFbECzPX">Milvus Discord 社区</a>，或预约一次 <a href="https://milvus.io/office-hours">Milvus Office Hours</a> 会议，与维护者讨论你的用例。</li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/announcing_milvus_30_lake_native_vector_search_and_a_more_powerful_retrieval_engine_md_11_78476298b9.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Milvus-30-and-Zilliz-Vector-Lakebase" class="common-anchor-header">Milvus 3.0 与 Zilliz Vector Lakebase<button data-href="#Milvus-30-and-Zilliz-Vector-Lakebase" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 3.0 为生产级 AI 检索以及新兴的 <a href="https://zilliz.com/blog/from-vector-database-to-vector-lakebase">Vector Lakebase</a> 架构奠定了开源基础，该架构在单一事实来源之上将湖原生存储与高性能向量检索结合起来，并让每一部分都以合适成本运行。</p>
<p><a href="https://zilliz.com/">Zilliz Cloud</a> 是由 Milvus 背后团队构建的全托管 Vector Lakebase。它与 Milvus 共享相同的分布式、湖原生架构，并与 Milvus API 完全兼容。由其专有 Cardinal 索引引擎驱动，Zilliz Cloud 相比标准开源索引方法可提供最高 10× 更好的性价比，同时消除管理基础设施的操作复杂性。企业能力包括缩容到零计算、跨区域灾难恢复、BYOC 部署、企业级安全与合规（SOC 2、HIPAA、ISO 27001 和 GDPR），以及最高 99.99% 的 SLA。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/announcing_milvus_30_lake_native_vector_search_and_a_more_powerful_retrieval_engine_md_12_08d1c21d25.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>开发者可以将 Milvus 部署为开源向量数据库，或使用 <a href="https://zilliz.com/">Zilliz Cloud</a>，在整个 AI 数据生命周期中为多种工作负载提供托管平台。</p>
<h2 id="What-comes-next" class="common-anchor-header">接下来是什么<button data-href="#What-comes-next" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 路线图将基于 3.0 架构继续推进，包括 External Collections 的谓词下推、外部回填、更多 Spark 操作符，以及对更多表格式的支持，包括 Delta Lake 和 Apache Paimon。</p>
<p>更大的方向已经很清晰：AI 数据系统需要在在线检索和离线数据改进之间形成更紧密的闭环。每当团队想要搜索、分析、改进或服务向量数据时，都不应该被迫将其复制到独立系统中。</p>
