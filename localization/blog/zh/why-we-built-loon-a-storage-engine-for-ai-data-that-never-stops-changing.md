---
id: why-we-built-loon-a-storage-engine-for-ai-data-that-never-stops-changing.md
title: |
  我们为何开发Loon：一款专为不断变化的AI数据设计的存储引擎。
author: Ted Xu
date: 2026-6-5
cover: assets.zilliz.com/Loon_New_Cover_8270435335.png
tag: Engineering
recommend: true
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus 3.0, Zilliz Vector Lakebase, vector storage, AI datasets, Vortex'
meta_title: |
  AI Datasets Are Never Done. So We Built Loon.
desc: >
  Loon 是 Milvus 3.0 和 Zilliz Vector Lakebase 的一款全新存储引擎，旨在通过 ColumnGroups、行 ID
  对齐和清单（Manifests）来管理不断演变的向量数据集。
origin: >-
  https://zilliz.com/blog/why-we-built-loon-a-storage-engine-for-ai-data-that-never-stops-changing
---
<p><em>本文最初发表于 zilliz.com，经授权转载。</em></p>
<h2 id="Key-takeaways" class="common-anchor-header">关键要点<button data-href="#Key-takeaways" class="anchor-icon" translate="no">
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
    </button></h2><p>这是一篇篇幅较长且深入的技术探讨，因此在进入细节之前，先来梳理一下关键要点。</p>
<ul>
<li>AI 数据集并非静态表格。随着团队替换 Embeddings 模型、添加稀疏向量、修订图注、补全标签、重建索引以及运行离线分析，同一行数据会不断发生变化。</li>
<li>传统存储布局存在三大缺陷：长向量列导致补标成本高昂；单一文件格式无法同时满足全表扫描和点读需求；而私有数据库存储迫使外部管道创建额外的“真实数据”副本。</li>
<li>Loon 是 Milvus 和 Zilliz Vector Lakebase 的新存储引擎。它基于混合文件格式、行 ID 对齐以及定义数据集版本状态的清单（Manifest）构建而成。</li>
<li>其目标是让单个向量数据集能够支持在线搜索、离线分析、回填、压缩和外部计算，而无需不断复制、重写或重新导入数据。</li>
</ul>
<h2 id="Introduction" class="common-anchor-header">简介<button data-href="#Introduction" class="anchor-icon" translate="no">
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
    </button></h2><p>有一段时间，曾有一种针对向量数据库的反对意见听起来颇为合理。</p>
<p><em>传统数据库已经可以存储整数、字符串、JSON、二进制大对象（blobs）和索引。为什么不添加一个</em> <code translate="no">_vector_</code> <em>类型，在其旁边构建一个人工神经网络（ANN）索引，然后就此作罢呢？</em></p>
<p>对于早期的语义搜索，这种做法确实足够好用。一个向量列加一个索引，足以支持演示、小型 RAG 应用或内部搜索功能。问题出现在后续阶段，当数据集的行为不再像一张表，而更像一个 AI 数据系统时。</p>
<p>一个生产环境中的向量数据集包含行、主键、标量字段以及可查询的列。从这个意义上说，它看起来像一个数据库表。 但它同时也具备数据湖的规模和工作流形态。它可能包含数亿条记录，并被 Spark、Ray、DuckDB、训练管道、评估任务以及数据质量系统反复读取和重写。</p>
<p>它还依赖于对象存储。源对象通常是视频、图像、PDF、音频文件或网页文档，这些文件保存在 S3、GCS、OSS 或其他对象存储中。 数据库存储引用、元数据、衍生特征和索引。随后，它将传统存储模型无法管理的内容作为第一类对象纳入其中：密集Embeddings、稀疏向量、字幕、向量索引、文本索引、删除日志、统计信息、模型版本、解析器版本、外部二进制大对象（blob）引用，以及它们之间的版本关系。</p>
<p><strong>正因如此，“只需添加一个向量列”这种做法开始行不通了。</strong>问题并不在于数据库能否存储向量字节——许多系统都能做到这一点。更棘手的问题在于<strong>，存储模型能否处理向量数据的变化方式、查询方式，以及在 AI 数据栈中的共享方式。</strong></p>
<p><strong>这就是我们开发 Loon 的原因——它是 Milvus 和</strong> <a href="https://zilliz.com/blog/from-vector-database-to-vector-lakebase"><strong>Zilliz Vector Lakebase</strong></a> <strong>（Zilliz Cloud 的下一代演进）</strong><strong>的新存储引擎</strong> <strong>。</strong></p>
<p>Loon的设计基于三个核心理念：</p>
<ol>
<li>针对不同类型的列采用不同的物理格式。</li>
<li>通过共享的行 ID 空间对这些列进行对齐。</li>
<li>使用清单（Manifest）来定义数据集的版本化状态。</li>
</ol>
<p>要理解这些要素的重要性，让我们先从一个常见的多模态工作流入手。</p>
<h2 id="A-vector-dataset-is-never-really-finished" class="common-anchor-header">向量数据集其实永远不会真正“完成”。<button data-href="#A-vector-dataset-is-never-really-finished" class="anchor-icon" translate="no">
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
    </button></h2><p>设想一个 AI 团队正在构建用于多模态训练的视频数据集。</p>
<p>一段长视频被上传到对象存储中。一条数据处理管道会根据场景变化、镜头边界或时间窗口将其分割成片段。过长或过短、模糊、重复或质量较低的片段会被过滤掉。 剩余的片段会由一个美学模型进行评分，由另一个模型生成字幕，再由视觉语言模型进行嵌入，最后存储在向量数据库中，以便进行搜索、去重和训练数据过滤。</p>
<p>从宏观层面看，该工作流看似简单：</p>
<pre><code translate="no">video
→ clips
→ metadata
→ aesthetic_score
→ caption
→ embedding
→ search / dedup / training data filtering
<button class="copy-code-btn"></button></code></pre>
<p>但数据集并非一开始就已完全成型。</p>
<ul>
<li>在第一周，数据表中可能仅包含<code translate="no">clip_id</code> 、<code translate="no">video_id</code> 、<code translate="no">start_offset</code> 以及<code translate="no">duration</code> 。</li>
<li>第二周，团队添加了<code translate="no">aesthetic_score</code> 。</li>
<li>第三周，运行了字幕生成模型，每个片段都获得了<code translate="no">caption</code> 。</li>
<li>第四周，首个嵌入模型上线，每个片段都获得一个 768 维的 CLIP 嵌入向量。</li>
<li>一个月后，团队更换了模型，并补录了<code translate="no">embedding_v2</code> ，此时维度已增至1024。</li>
<li>两个月后，由于需要进行混合搜索，团队添加了一列稀疏向量。</li>
<li>三个月后，字幕需经人工审核，并必须就地更正。</li>
</ul>
<p>该数据集从未真正完成。它不断积累着对同一底层行的新解读。</p>
<p>这就是向量数据与传统业务数据之间的核心差异之一。同一行数据会被反复处理。而规模的扩大则将这种不便转化为存储问题：多模态数据集通常不是几百万条记录，而是数亿甚至数十亿条。 LAION-5B 是一个有用的参考案例——它包含数十亿组图像-文本对，每组都带有元数据、图注和 Embeddings。因此，难点并不在于首次插入。难点在于数据集开始演变后发生的一切<strong>。这种演变暴露了三个问题。</strong></p>
<h2 id="The-first-problem-long-columns-make-write-amplification-expensive" class="common-anchor-header">第一个问题：长列导致写入放大成本高昂<button data-href="#The-first-problem-long-columns-make-write-amplification-expensive" class="anchor-icon" translate="no">
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
    </button></h2><p>Parquet 等列式格式非常适合许多分析型工作负载。当 Schema 相对稳定、读取数据比重写数据更频繁、扫描仅涉及部分列，且压缩效果显著时，它们表现优异。这正是许多分析格式所优化的应用场景。</p>
<h3 id="Vector-rows-are-much-wider-than-analytical-rows" class="common-anchor-header">向量行的宽度远大于分析型行的宽度</h3><p>TPC-H<code translate="no">lineitem</code> 是一个很好的基准。它包含 16 个列：整数键、十进制值、日期、短字符串以及一个小型注释字段。 一行未压缩的数据大约为 150 字节。压缩后，其大小可能会小得多。对于 64 MB 的行组，存储系统可以将数十万行数据打包到一个组中。</p>
<p><strong>向量数据集则截然不同。</strong></p>
<p>LAION风格的图像-文本数据集则更接近当今许多AI管道生成的数据。每行数据仍包含常规元数据：URL、图注、宽度、高度、质量评分、标签等。但一旦添加了Embeddings，该行的物理结构就会发生变化。</p>
<p>一个768维的CLIP向量在fp16格式下约占1.5 KB，在fp32格式下约占3 KB。这一列的体积可能远大于整个TPC-H<code translate="no">lineitem</code> 数据表中的一行。</p>
<p>而且以当今标准来看，768维并不罕见，也不算大。在多模态处理管道中，1024维或2048维的Embeddings很常见。OpenAI的<code translate="no">text-embedding-3-large</code> 最高可达3072维，按fp32格式计算，每个向量约占12 KB。</p>
<p>对比十分鲜明：</p>
<table>
<thead>
<tr><th>数据集结构</th><th>近似行大小</th><th>行数据的主要构成</th></tr>
</thead>
<tbody>
<tr><td>TPC-H 明细项</td><td>~150字节（未压缩）</td><td>标量和短字符串字段</td></tr>
<tr><td>LAION 风格的行，包含 768 维 fp16 向量</td><td>约1.5 KB+</td><td>嵌入</td></tr>
<tr><td>LAION风格的行，包含768维fp32向量</td><td>~3 KB+</td><td>嵌入</td></tr>
<tr><td>包含3072维fp32向量的行</td><td>仅向量部分约12 KB+</td><td>嵌入</td></tr>
</tbody>
</table>
<p>在许多AI数据集中，向量列不仅仅是一个普通的字段。从物理上讲，它占据了行的大部分空间。这会改变Schema演化的成本。</p>
<h3 id="Adding-one-vector-column-can-mean-hundreds-of-gigabytes" class="common-anchor-header">添加一列向量可能意味着数百吉字节的数据量</h3><p>假设某数据集包含 1 亿个视频片段。添加一个新的 1024 维 fp32 嵌入向量列，意味着需要写入约 400 GB 的原始向量数据。这还不包括统计信息、索引、元数据更新、对象存储开销、验证以及服务路径集成。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/why_we_built_loon_a_storage_engine_for_ai_data_that_never_stops_changing_md_3_ca3c616b9e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>如果团队每月添加一两个向量类列（例如<code translate="no">embedding_v2</code> 、<code translate="no">sparse_vector</code> 或重新排序特征），那么模式演进将变成一项以数百吉字节或太字节为单位衡量的、周期性的数据工程任务。</p>
<h3 id="Small-logical-updates-can-trigger-large-physical-rewrites" class="common-anchor-header">微小的逻辑更新可能会触发大规模的物理重写</h3><p>更新同样重要。</p>
<p>在列式系统中，旧数据通常不会就地更新。删除日志会记录发生了哪些变化，随后通过压缩将活动行重写到新文件中。当行数据较小时，这种模型尚可管理。</p>
<p>但在向量数据中，一次微小的逻辑更新可能会触发大规模的物理重写。</p>
<p>一项人工审核任务可能仅需更正标题中的几百字节内容。但如果标题、密集向量、稀疏向量及其他其他派生特征共享相同的物理文件生命周期，系统最终可能会连向量也一并重写。逻辑变更虽小，但物理 I/O 却可能巨大。</p>
<p>这就是向量存储中的写入放大问题。其开销巨大的原因不仅在于向量体积庞大，更在于大型派生字段与小型可变字段常因存储布局而被捆绑在一起，被视为一个整体。</p>
<h3 id="For-AI-datasets-backfill-is-a-routine-workload" class="common-anchor-header">对于 AI 数据集而言，回填是一项常规工作负载</h3><p>对于传统的分析表，模式演变可能仅偶尔发生。而对于 AI 数据集，这却是家常便饭。标题模型会升级，Embeddings 模型会被替换，稀疏向量会在后期添加，重新排序特征会出现，人工标注会被更正，治理标签会被补录，索引会被重建。</p>
<p>这些操作并非简单的追加，而是经常会修改或扩展现有行数据。</p>
<p>正因如此，向量存储不仅要优化扫描吞吐量，还必须降低补录和部分更新的开销。</p>
<h2 id="The-second-problem-the-same-data-must-support-scans-and-point-reads" class="common-anchor-header">第二个问题：同一数据必须同时支持扫描和点读<button data-href="#The-second-problem-the-same-data-must-support-scans-and-point-reads" class="anchor-icon" translate="no">
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
    </button></h2><p>数据写入后，读取路径会分叉。同一向量数据集通常具有两种截然不同的访问模式：<strong>分析性扫描和点读取。</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/why_we_built_loon_a_storage_engine_for_ai_data_that_never_stops_changing_md_4_cef8d0e3ea.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Analytical-workloads-want-wide-compressed-scans" class="common-anchor-header">分析型工作负载需要宽范围的压缩扫描</h3><p>一条管道可能会运行诸如以下过滤器：</p>
<pre><code translate="no" class="language-sql">WHERE aesthetic_score &gt; 0.8 AND duration &gt; 5
<button class="copy-code-btn"></button></code></pre>
<p>或者它可能执行离线分析、完整的 Embeddings 向量评估、BM25 统计、位图构建、数据质量检查、计数以及分组操作。</p>
<p>这种模式会读取大量行，但仅读取少数列。它适合顺序 I/O、较大的行组、压缩、列剪枝、批量解码和向量执行。</p>
<p>较大的行组在此处大有裨益。它们使单次 I/O 请求就能获取大量有用数据，提高压缩效率，并为执行引擎提供足够的连续数据以摊销开销。当同时读取多列时，保持列的有序排列以提高扫描吞吐量，也有助于减少向量执行过程中的缓存未命中。</p>
<p>Parquet 在这方面表现尤为出色。</p>
<h3 id="ANN-results-need-narrow-row-level-lookups" class="common-anchor-header">ANN 结果需要窄范围的行级查找</h3><p>在 ANN 搜索返回候选行 ID 之后，系统通常需要获取以下字段：</p>
<pre><code translate="no">caption
embedding
rerank feature
video_uri
metadata
<button class="copy-code-btn"></button></code></pre>
<p>这种模式读取的行数较少，通常只有数百或数千行，但需要通过行 ID 进行精确访问。它希望定位特定的行和列，仅获取所需的字节范围，并避免仅仅为了检索几条记录就拉取整个行组。</p>
<p>点查找在扫描方面的偏好几乎与其相反。它需要更小的读取粒度。理想情况下，存储层能够通过行 ID 定位相关段或字节范围，仅读取该范围，并仅解码结果所需的数据。</p>
<p>压缩也存在不同的权衡。对于扫描操作，更强的压缩通常是值得的，因为系统会读取大量数据并节省 I/O 开销。对于点查询，如果检索一行数据需要解码一个体积大得多的压缩块，那么压缩反而会成为负担。</p>
<h3 id="One-layout-cannot-optimize-for-both-paths" class="common-anchor-header">一种布局无法同时优化这两种路径</h3><p>这就是核心矛盾。标量过滤和分析需要宽、压缩且适合扫描的布局；而向量查找则需要窄、精确且支持按行寻址的布局。</p>
<p>一种文件格式可以在一定程度上同时支持这两种需求，但无法同时对两者都做到最优化。</p>
<p>如果所有列都存储在 Parquet 中，标量扫描会很顺畅。但召回后的 ANN 查找就会变得困难。系统可能只需要几百个向量、标题或元数据记录，而存储层却可能不得不读取包含大量无关行的巨大行组。</p>
<p>在本地 SSD 上，缓存和 mmap 可以隐藏部分开销。一旦数据存储在对象存储中，这些开销就会变得更加明显。每次缓存未命中都可能演变为远程范围读取。如果候选行分散在许多行组中，单个查询可能会触发多次读取，每次读取的数据量都超过查询实际所需。 在布局不佳的情况下，获取 1,000 行候选行很容易导致数十或数百兆字节的非必要 I/O，极端情况下甚至更多。</p>
<p>缩小行组规模有助于点查找，但会损害扫描效率。过多的细小碎片会降低压缩效率，增加元数据开销，并破坏分析引擎所依赖的长序列读取。</p>
<p><strong>因此，问题并不在于寻找一个“神奇”的行组大小。问题在于，同一数据集被要求同时像两种不同的存储系统那样工作。</strong></p>
<h3 id="Hybrid-search-forces-both-paths-into-one-query" class="common-anchor-header">混合搜索将这两种路径强行合并到一个查询中</h3><p>混合搜索使得这种冲突更难被忽视。一个查询可能首先应用标量过滤器：</p>
<pre><code translate="no" class="language-sql">aesthetic_score &gt; 0.8 AND duration &gt; 5
<button class="copy-code-btn"></button></code></pre>
<p>随后执行 ANN 搜索。</p>
<p>接着根据行 ID 检索标题、向量和元数据。</p>
<p>对用户而言，这只是一次搜索请求；但对存储层来说，这既是一次分析性扫描，又是一次低延迟的随机查找。</p>
<p>这就是为什么向量存储需要的不仅仅是更好的 Parquet 设置。它需要一种方法，根据列的实际读取方式来安排不同列的位置。</p>
<h2 id="The-third-problem-the-dataset-does-not-live-inside-one-engine" class="common-anchor-header">第三个问题：数据集并不存储在单一引擎中<button data-href="#The-third-problem-the-dataset-does-not-live-inside-one-engine" class="anchor-icon" translate="no">
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
    </button></h2><p>前两个问题发生在数据库内部，而第三个问题则发生在系统之间的边界处。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/why_we_built_loon_a_storage_engine_for_ai_data_that_never_stops_changing_md_5_802e6d92c3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="AI-data-pipelines-span-many-systems" class="common-anchor-header">AI 数据管道横跨多个系统</h3><p>在视频工作流中，向量数据库本身处理的任务非常少。</p>
<p>原始视频存储在对象存储中。片段生成可能在 Spark 或 Ray 上运行。美学评分可能在 GPU 服务上运行。字幕生成可能在 LLM 推理管道中运行。Embeddings 可能由另一个 GPU 任务生成。稀疏向量可能来自 SPLADE 服务。 离线评估、训练数据过滤、人工审核和治理任务都可能在其他地方运行。</p>
<p>向量数据库负责在线搜索，但数据集的生成、修正、评估和扩展则由众多系统共同完成。</p>
<h3 id="Private-storage-formats-create-multiple-copies-of-the-truth" class="common-anchor-header">专有存储格式会产生多个“真实数据”的副本</h3><p>如果数据库使用仅其自身能读写的私有物理格式，每个外部任务都需要进行导出、转换、复制和导入。同一数据集可能同时存在于数据库中、Spark临时目录中、评估输出中以及本地回填目录中。那么真正的问题就变成了：</p>
<ul>
<li>哪一份副本才是“真实数据”的来源？</li>
<li>哪一份包含上个月的字幕模型？</li>
<li>哪些行已经过人工审核更正？</li>
<li>哪个稀疏向量列是由哪个模型生成的？</li>
<li>回填后哪个向量索引仍然有效？</li>
<li>这一行所指的原始视频对象是哪个？</li>
</ul>
<p>在小规模情况下，团队有时仅靠命名约定和人工检查就能应付。但当数据量达到数亿行且Embeddings达数太字节时，这便会演变为一致性问题。</p>
<h3 id="Vector-datasets-need-a-shared-versioned-state" class="common-anchor-header">向量数据集需要一个共享的、带版本的状态</h3><p>Lakehouse 系统曾针对结构化数据解决过此类问题的一个版本。Iceberg、Delta Lake 和 Hudi 不仅仅用于存储文件。它们的核心贡献在于让多个引擎围绕相同的表状态进行协调。</p>
<p>向量数据库现在也需要类似的能力，但其状态更为复杂。它不仅必须包含表文件和分区，还必须包含向量索引、文本索引、稀疏特征、删除日志、统计信息、行 ID 范围以及对外部二进制大对象（BLOB）的引用。</p>
<p>问题不仅仅在于“Spark能否读取 Milvus 文件？”</p>
<p>问题在于，当 Spark 补全稀疏向量列后，Milvus 如何知道该列属于哪个版本、覆盖哪些行、由哪个模型生成，以及在线查询何时可以安全地使用它？</p>
<p>答案必须体现在存储模型中。</p>
<h2 id="Why-patches-are-not-enough" class="common-anchor-header">为什么补丁还不够<button data-href="#Why-patches-are-not-enough" class="anchor-icon" translate="no">
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
    </button></h2><p>人们很容易将这些视为三个独立的工程问题。</p>
<ul>
<li>写入放大？添加批处理。</li>
<li>点读取？添加缓存。</li>
<li>外部系统？添加导出和导入工具。</li>
</ul>
<p>这些补丁虽有帮助，但并未解决根本问题：向量数据集在物理层面上是异构的。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/why_we_built_loon_a_storage_engine_for_ai_data_that_never_stops_changing_md_6_0744ff4445.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>在视频示例中，<code translate="no">clip_id</code> 、<code translate="no">video_id</code> 、<code translate="no">duration</code> 和<code translate="no">aesthetic_score</code> 是短标量字段。它们对于过滤和分析非常有用。</p>
<ul>
<li><code translate="no">caption</code> 是文本。它可用于 BM25、审查、更正和数据补全。</li>
<li><code translate="no">embedding</code> 是一个长而密集的向量。它用于人工神经网络（ANN）的召回，随后用于行级查找或重新排序。</li>
<li><code translate="no">embedding_v2</code> 是新模型的输出，通常在原始数据插入很久之后才补入。</li>
<li><code translate="no">sparse_vector</code> 支持混合搜索，并具有其自身的访问模式。</li>
<li>原始视频应保存在对象存储中。数据库应存储引用、校验和、MIME 类型、解析器版本以及行级关联关系。</li>
<li>向量索引、文本索引、统计信息和删除日志是派生对象，具有各自的版本语义。</li>
</ul>
<p>这些对象共享一个逻辑行，但不应全部共享相同的物理布局或生命周期。</p>
<ul>
<li>如果将它们强行放入一个普通的表布局中，更新操作的成本就会很高。</li>
<li>如果将它们强行放入一种列式文件格式中，点读取的成本就会很高。</li>
<li>如果将它们视为互不相关的对象文件，版本管理就会变得脆弱。</li>
</ul>
<p>因此，存储模型必须基于数据集是异构这一事实来设计。</p>
<p><strong>这导致了三个设计要求：</strong></p>
<ul>
<li>首先，不同的列组应采用不同的物理格式进行存储。</li>
<li>其次，这些列组需要共享行 ID 空间，以便它们仍能作为单个逻辑表运行。</li>
<li>第三，数据集需要一个带版本控制的清单文件，用于声明哪些文件、索引、日志、统计信息和对象引用属于当前视图。</li>
</ul>
<p><strong>这就是 Loon 的设计理念，它是支撑 Milvus 和 Zilliz Cloud 的全新存储引擎。</strong></p>
<h2 id="Loon-a-storage-engine-behind-Milvus-and-Zilliz-Cloud-for-evolving-vector-datasets" class="common-anchor-header">Loon：Milvus 和 Zilliz Cloud 专为演进型向量数据集打造的存储引擎<button data-href="#Loon-a-storage-engine-behind-Milvus-and-Zilliz-Cloud-for-evolving-vector-datasets" class="anchor-icon" translate="no">
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
    </button></h2><p>为解决上述所有问题，我们开发了<strong>Loon</strong>——这是专为演化向量数据集设计的、用于 Milvus 和<a href="https://zilliz.com/blog/from-vector-database-to-vector-lakebase"><strong>Zilliz Vector Lakebase</strong></a>（Zilliz Cloud 的下一代演进）的新存储引擎。</p>
<p>该名称遵循了 Zilliz 以鸟类命名的传统。Loon 是一种栖息在湖泊中的潜水鸟，这与系统的目标高度契合：向量数据库在每次执行查询、回填列或构建索引时，不应需要移动、扫描或重写整个“数据湖”。 它应首先理解当前数据集的版本，包括其列、索引、统计信息、删除日志和对象引用，然后仅读取实际所需的部分。</p>
<p>混合文件格式、行 ID 对齐和清单（Manifest）并非三项独立的功能。它们源于同一个设计假设：向量数据集本质上是异构的。</p>
<h3 id="Three-pieces-one-storage-model" class="common-anchor-header">三部分，一个存储模型</h3><p>混合文件格式承认不同列具有不同的访问模式。标量字段适合扫描和过滤。向量字段需要高效的行级查找。视频、PDF、图像和音频文件等原始对象应存放在对象存储中，而非数据库数据文件内。</p>
<p>行 ID 对齐承认，这些列在物理上可能分离，但它们仍描述着相同的逻辑行。字幕、Embeddings、稀疏向量和视频 URI 可能位于不同的文件和格式中，但仍需要被整合为单一结果。</p>
<p>清单机制承认，数据集并非写入一次后便不再更改。它将由多个系统进行修改，经历多个版本，并用于多种任务。索引、统计信息、删除日志、外部对象引用和列组都必须出现在同一个版本化视图中。</p>
<p><strong>这就是为什么 Loon 不仅仅是一种更快的向量文件格式。</strong>更快的格式有助于点查找，但无法解决 Schema 演进或多引擎协调问题。行 ID 对齐使拆分后的列能够像单张表一样工作，但并未指定哪些文件属于当前版本。 清单（Manifest）可以描述数据集的状态，但如果没有列组和行 ID 对齐，它就无法清晰地表示一个逻辑 Collection 内部的不同物理布局。</p>
<p>存储模型需要这三者：针对不同列组的不同格式、用于重建行的共享行 ID 空间，以及一个版本化的清单，它能告知每个读取者和写入者数据集的当前状态。</p>
<h3 id="Where-Loon-fits-in-Milvus-and-Zilliz-Vector-Lakebase" class="common-anchor-header">Loon 在 Milvus 和 Zilliz Vector Lakebase 中的定位</h3><p>在 Milvus 中，它用一个围绕清单（Manifest）、列组（ColumnGroup）、文件格式和文件系统抽象构建的模型，取代了旧的段二进制日志（binlog）存储层。 在<a href="https://zilliz.com/blog/from-vector-database-to-vector-lakebase"><strong>Zilliz Vector Lakebase</strong></a>（Zilliz Cloud 的下一代演进）<strong>中，</strong>Vector Lakebase 架构也遵循相同的方向：在保持向量数据库服务路径高速的同时，使底层数据更易于演进、分析以及与外部系统协调。</p>
<p>Milvus 的上层组件仍保留其熟悉的角色：Proxy 负责路由；QueryCoord 和 DataCoord 负责调度；IndexNode 负责构建索引。面向应用程序的 Collections、插入、搜索和混合搜索 API 无需暴露 Manifest 文件或 ColumnGroups。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/why_we_built_loon_a_storage_engine_for_ai_data_that_never_stops_changing_md_7_d4d1a34604.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>变化发生在底层。</p>
<p>DataNode、QueryNode、segcore、压缩以及外部连接器均可通过相同的存储抽象层进行操作。这一点至关重要，因为数据集不再仅由数据库进行读写。它既可能被外部计算系统扩展，又可能同时被在线搜索系统使用。</p>
<p>从宏观层面来看，各层结构如下：</p>
<pre><code translate="no">Manifest
→ ColumnGroup
→ file <span class="hljs-built_in">format</span> layer
→ filesystem abstraction
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/why_we_built_loon_a_storage_engine_for_ai_data_that_never_stops_changing_md_8_70917bdfc7.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Manifest 描述了数据集的版本化状态。ColumnGroups 将逻辑 Collection 映射到物理列组。文件格式层允许每个 ColumnGroup 选择合适的格式。文件系统抽象层可同时支持对象存储和本地存储。</p>
<p>关键在于，混合文件格式、行 ID 对齐和清单并非独立的功能。它们共同定义了存储模型。</p>
<p>基于该模型，我们可以逐一探讨三个设计选择：Loon 如何存储不同的 ColumnGroups、如何将它们重新对齐为行，以及清单如何将这些文件转换为版本化数据集。</p>
<h2 id="Design-1-use-the-right-file-format-for-the-right-column-group" class="common-anchor-header">设计 1：为不同的 ColumnGroup 选用合适的文件格式<button data-href="#Design-1-use-the-right-file-format-for-the-right-column-group" class="anchor-icon" translate="no">
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
    </button></h2><p>不同的列具有不同的访问模式。不应强行将它们归入同一文件格式。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/why_we_built_loon_a_storage_engine_for_ai_data_that_never_stops_changing_md_9_c262865944.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Loon-separates-a-logical-collection-into-ColumnGroups" class="common-anchor-header">Loon 将逻辑 Collection 划分为 ColumnGroups。</h3><ul>
<li>标量字段、过滤字段、业务键和统计字段通常会被扫描、过滤、聚合或用于查询规划。它们能从压缩、列剪枝和生态系统兼容性中获益。Parquet 非常适合这些列。</li>
<li>稠密向量、稀疏向量和重新排序特征通常在人工神经网络（ANN）通过行 ID 进行召回后被读取。它们需要低延迟的随机访问、精确的字节范围读取以及选择性解码。段式布局更适合这些场景。Loon 在此方向上采用了 Vortex。</li>
<li>视频、PDF、图像和音频文件等原始对象不应嵌入向量数据库的数据文件中，而应保留在对象存储中。数据库负责记录引用、校验和、MIME 类型、解析器版本以及行级关系。</li>
</ul>
<p>以视频为例，其物理布局可能如下所示：</p>
<pre><code translate="no"><span class="hljs-title class_">Parquet</span> <span class="hljs-title class_">ColumnGroup</span>:
clip_id / video_id / start_offset / duration / aesthetic_score / caption

<span class="hljs-title class_">Vortex</span> <span class="hljs-title class_">ColumnGroups</span>:
embedding
embedding_v2
sparse_vector

<span class="hljs-title class_">Object</span> <span class="hljs-attr">storage</span>:
raw video objects
<button class="copy-code-btn"></button></code></pre>
<p>对于应用程序而言，这仍然是一个Collection。而在存储层看来，该Collection的不同部分采用不同的物理格式。这直接减少了不必要的重写操作。添加<code translate="no">embedding_v2</code> 可以转化为一个新的向量ColumnGroup加上一个Manifest提交，无需重写字幕列、标量元数据或现有的Embeddings列。</p>
<p>同样的思路也适用于稀疏向量、重新排序特征或其他派生字段。如果新列在物理上可以独立，并且能通过行 ID 进行对齐，那么它就不必将无关的列也拖入相同的重写路径中。</p>
<h3 id="Loon-also-adapts-the-use-of-file-formats" class="common-anchor-header">Loon 还调整了文件格式的使用方式。</h3><p><strong>对于 Parquet，默认设置对向量密集型数据并不总是理想的选择。</strong>一个 64 MB 的行组对于点查找而言可能过大，因为一次小规模的随机读取可能会拉取远超所需的数据。Loon 在相关路径中将行组压缩至 1 MB，并在向量列的字典编码等编码方式对随机访问的向量数据无益时将其禁用。</p>
<p><strong>对于 Vortex，更重要的工作在于布局。</strong>Loon 采用了一种在扫描效率和点查找之间取得平衡的布局<strong>。</strong>在行组内，相关列的段可以紧邻放置以支持扫描。在执行操作时，子段读取允许系统仅获取相关的字节，而不是拉取整个段。</p>
<p><strong>Loon 还支持只读的 Lance 集成</strong>，因此在兼容性至关重要时，现有的 Lance 数据集可以作为 ColumnGroups 挂载。</p>
<h3 id="What-the-benchmark-shows" class="common-anchor-header">基准测试结果</h3><p>在一项本地测试中，使用一个包含 40,000 行且采用<code translate="no">{id: int64, name: utf8, value: float64, vector: list&lt;float32&gt;[128]}</code> Schema 的单个文件，Vortex 与采用 1 MB 行组的 Parquet 相比，取得了以下结果：</p>
<table>
<thead>
<tr><th>操作</th><th>Vortex</th><th>Parquet</th><th>差异</th></tr>
</thead>
<tbody>
<tr><td>随机抽取 K=1000 行</td><td>5.8 毫秒</td><td>144 毫秒</td><td>快了25倍</td></tr>
<tr><td>全向量列扫描</td><td>21 毫秒</td><td>142 毫秒</td><td>速度提升6.76倍</td></tr>
<tr><td>文件大小，约21 MB原始数据</td><td>6.62 MB</td><td>7.16 MB</td><td>小了 7%</td></tr>
</tbody>
</table>
<p><code translate="no">take</code> 的测试结果源于减少了必须读取和解码的无关数据量。扫描结果则源于压缩算法和实现方案的选择。</p>
<p>这些数值应与具体测试环境相关联：8个vCPU的Ubuntu 22.04 KVM环境、本地文件系统、单个文件、40,000行数据、1 MB的行组，以及上述Schema。 在对象存储环境中，网络 I/O 可能占据主导地位，因此降低读取放大效应就显得尤为重要。实际结果取决于数据集结构、对象存储行为、缓存状态以及查询模式。</p>
<p>更广泛的观点并非指每列都应使用 Vortex。</p>
<p>关键在于，向量数据集需要在 ColumnGroup 级别选择合适的文件格式。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/why_we_built_loon_a_storage_engine_for_ai_data_that_never_stops_changing_md_11_127c1953e6.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Design-2-align-physical-files-through-row-IDs" class="common-anchor-header">设计 2：通过行 ID 对齐物理文件<button data-href="#Design-2-align-physical-files-through-row-IDs" class="anchor-icon" translate="no">
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
    </button></h2><p>混合文件格式解决了一个问题：不同列现在可以存放在最适合它们的格式中。</p>
<p>但这又引发了第二个问题。如果标量字段存储在 Parquet 中，向量存储在 Vortex 中，原始对象存储在对象存储中，系统如何才能将它们视为一个 Collection？</p>
<p><strong>Loon 通过行 ID 对齐解决了这一问题。</strong></p>
<h3 id="Row-ID-is-the-storage-layer-coordinate-system" class="common-anchor-header">行 ID 是存储层的坐标系统</h3><p>每个物理 ColumnGroupFile 都会记录其文件路径以及所覆盖的行 ID 范围：</p>
<pre><code translate="no">path
start_index
end_index
<button class="copy-code-btn"></button></code></pre>
<p>即使位于不同的文件和格式中，不同的 ColumnGroups 也可以覆盖相同的行 ID 空间。</p>
<p>对于行 ID<code translate="no">12345</code> ，标量元数据可能位于 Parquet ColumnGroup 中，Embeddings 可能位于 Vortex ColumnGroup 中，而原始视频可能由对象存储引用表示。从逻辑上讲，它们仍然属于同一行。这为存储层提供了一个稳定的坐标系。</p>
<p>行 ID 并非业务主键。它是存储层的坐标系，使 Loon 能够在不丧失逻辑重建能力的前提下，对 Collection 进行物理拆分。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/why_we_built_loon_a_storage_engine_for_ai_data_that_never_stops_changing_md_12_3da04acdec.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="New-columns-do-not-have-to-rewrite-old-columns" class="common-anchor-header">新增列无需重写旧列</h3><p>添加<code translate="no">embedding_v2</code> 时，无需重写原始的字幕、元数据或<code translate="no">embedding_v1</code> 列组。Loon可以写入一个新的向量列组，记录其覆盖的行ID范围，并通过清单（Manifest）提交该变更。</p>
<p>这同样适用于稀疏向量、重新排序特征或稍后到达的其他派生字段。</p>
<p>只要新的 ColumnGroup 覆盖正确的行 ID 范围，它就可以加入同一个逻辑 Collection，而无需强制移动无关的数据。</p>
<h3 id="Deletes-and-compaction-can-be-more-targeted" class="common-anchor-header">删除和压缩操作可以更具针对性</h3><p>行 ID 对齐也有助于删除操作。</p>
<p>删除操作可以首先通过删除日志来表达。该行在逻辑层面上变得不可见，而物理清理则推迟到压缩时进行。当最终运行压缩时，并不总是需要重写与受影响行相关的每个 ColumnGroup。它可以专注于需要清理的 ColumnGroups。</p>
<p>这一点至关重要，因为并非每列的成本特征都相同。重写一个短的标量 ColumnGroup 与重写数百千兆字节的密集向量有着天壤之别。</p>
<h3 id="Hybrid-search-can-fetch-only-the-columns-it-needs" class="common-anchor-header">混合搜索可以仅检索所需的列</h3><p>行 ID 对齐也是混合搜索能够基于混合文件格式实际运行的关键。</p>
<p>在 ANN 搜索返回候选行 ID 后，系统可以仅获取最终结果所需的字段：标题、元数据、向量、重新排序特征或对象引用。</p>
<p>例如，一个查询可能需要：</p>
<pre><code translate="no">caption
embedding
video_uri
<button class="copy-code-btn"></button></code></pre>
<p>这些字段可能位于不同的 ColumnGroup 中。Loon 可以通过行 ID 范围定位相关文件，读取必要的字节范围，并组装结果。</p>
<p>如果没有行 ID 对齐，混合格式就只是并列放置的独立文件。有了行 ID 对齐，它们便表现为一个单一的逻辑 Collection。</p>
<h3 id="Packed-Reader-hides-the-split-from-the-upper-layer" class="common-anchor-header">Packed Reader 将拆分操作隐藏在上一层之外</h3><p>使这一功能得以实现的运行时组件是 Packed Reader。</p>
<p>上层仅看到统一的 Arrow RecordBatch 流。而在底层，数据可能来自不同文件格式的多个 ColumnGroups。“压缩读取器”隐藏了这些差异，根据行 ID 范围对齐数据，并在控制内存使用量的前提下调度多文件 I/O。</p>
<p>它还支持按行 ID 直接进行<code translate="no">take</code> 。给定一组行 ID 后，它会定位相关的 ColumnGroupFiles，发出范围读取请求，并返回所请求的字段。</p>
<p>对于视频工作流，一个 ANN 查询可能需要进行<code translate="no">caption</code> 、<code translate="no">embedding</code> 和<code translate="no">video_uri</code> 操作。Packed Reader 可以提取标量 ColumnGroup 和向量 ColumnGroup，而无需触及无关的列。</p>
<p>这就是“单独文件”与“具有多种物理布局的表”之间的区别。</p>
<h2 id="Design-3-make-the-Manifest-the-source-of-truth" class="common-anchor-header">设计 3：将清单（Manifest）作为权威数据源<button data-href="#Design-3-make-the-Manifest-the-source-of-truth" class="anchor-icon" translate="no">
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
    </button></h2><p>混合文件格式定义了数据的物理存储方式。行 ID 对齐机制决定了分离的 ColumnGroup 如何仍能构成单一逻辑表。但系统仍需解答一个更宏观的问题：<strong>哪些文件、日志、统计信息、索引和对象引用属于数据集的当前版本？这就是清单（Manifest）的职责。</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/why_we_built_loon_a_storage_engine_for_ai_data_that_never_stops_changing_md_13_cd18b2da18.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Object-storage-directories-are-not-enough" class="common-anchor-header">仅靠对象存储目录是不够的</h3><p>对象存储并非数据库目录。一个目录可能包含旧文件、新文件、失败任务的输出、临时文件、删除日志、仍被旧快照引用的文件，以及等待清理的文件。文件的存在并不意味着它属于当前数据集版本。</p>
<p>一个 Loon 数据集可能组织为如下目录结构：</p>
<pre><code translate="no">_metadata/
_data/
_delta/
_stats/
_index/
<button class="copy-code-btn"></button></code></pre>
<p>但目录结构并非权威来源。Manifest 才是。读者不应列出目录并根据其中恰好存在的文件来推断状态。他们应阅读当前的 Manifest，并遵循其声明的版本化视图。</p>
<h3 id="The-Manifest-defines-one-versioned-view-of-the-dataset" class="common-anchor-header">清单定义了数据集的一个版本化视图</h3><p>清单定义了特定版本下的数据集。它记录了：</p>
<ul>
<li>存在哪些 ColumnGroups</li>
<li>它们涵盖哪些行 ID 范围</li>
<li>每个 ColumnGroup 使用何种物理格式</li>
<li>文件存储位置</li>
<li>哪些删除日志处于活动状态</li>
<li>有哪些统计信息可用</li>
<li>存在哪些索引</li>
<li>引用了哪些外部二进制大对象</li>
<li>这些统计信息或索引涵盖哪些列和行范围</li>
</ul>
<p>每次更新都会写入一个新的清单版本。打开版本 N 的读取者将看到该数据集在版本 N 时的稳定视图。写入者可以在不影响仍在使用版本 N 的读取者的情况下，准备版本 N+1。</p>
<h3 id="The-Manifest-tracks-more-than-table-files" class="common-anchor-header">清单不仅跟踪表文件</h3><p>在 Loon 中，清单主体采用 Apache Avro 编码，并围绕四个主要部分组织。</p>
<ul>
<li>ColumnGroups 描述了列、格式、文件以及行 ID 范围。</li>
<li>DeltaLogs 描述删除操作。不同的删除类型涵盖不同的变更来源，例如来自客户端的主键删除、来自内部压缩的位置删除，或来自外部引擎的等值删除。</li>
<li>Stats 包含规划元数据，例如布隆过滤器、BM25 统计信息以及最小/最大值。</li>
<li>Indexes 描述了索引类型、参数、涵盖的列以及行 ID 范围。这可能包括 HNSW 或 IVF 等向量索引、文本索引、倒排索引、位图索引以及相关结构。</li>
</ul>
<p>这正是 Loon 与传统表清单的不同之处。</p>
<p>向量数据集不仅需要跟踪数据文件和分区，还需跟踪向量索引、文本索引、稀疏特征、删除日志、统计信息、外部对象引用，以及连接它们的行 ID 范围。</p>
<h3 id="The-Manifest-must-be-writable-by-more-than-the-database" class="common-anchor-header">清单必须允许除数据库之外的其他主体进行写入</h3><p>最关键的不仅在于清单包含什么内容，更在于谁可以对其进行写入。</p>
<ul>
<li>如果只有数据库能写入清单，它就仍属于内部元数据。虽然元数据更简洁，但依然仅限于某个引擎内部。</li>
<li>如果外部引擎能够生成新的 ColumnGroups、统计信息和清单条目，那么清单就会成为一个协调接口。</li>
<li>例如，一个 Spark 作业可以对稀疏向量列进行回填。它会写入一个新的 ColumnGroup，记录行覆盖范围和统计信息，并提交一个新的清单。在线查询在作业执行期间仍可继续读取旧版本。一旦提交成功，新版本便会生效。</li>
</ul>
<p>这种设计理念与 Iceberg 和 Delta Lake 相似，但对象模型更为广泛。向量数据集需要跟踪向量索引、文本索引、稀疏特征、删除日志、统计信息、BLOB 引用以及行 ID 范围，而不仅仅是表文件和分区。</p>
<h3 id="Optimistic-commits-keep-version-updates-simple" class="common-anchor-header">乐观提交使版本更新变得简单</h3><p>每次提交都会写入一个新的清单版本。写入方可以基于版本 N 构建新内容，然后尝试写入<code translate="no">manifest-{N+1}.avro</code> 。如果该版本已经存在，对象存储的条件写入或代号匹配语义会导致提交失败。此时，写入方可以针对新版本重试。</p>
<p>这使 Loon 能够实现乐观并发，而无需强制将每次更新都通过繁重且强一致性的协调路径。如果没有清单，多格式和多引擎存储最终将演变为命名约定和手动对账。这对于小型数据集可能有效，但对于 TB 级别的向量数据则行不通。</p>
<p>正是清单将异构文件转化为多个系统均可安全读取和更新的数据集。</p>
<h2 id="What-changes-for-users-when-storage-becomes-versioned" class="common-anchor-header">当存储采用版本控制后，用户会面临哪些变化<button data-href="#What-changes-for-users-when-storage-becomes-versioned" class="anchor-icon" translate="no">
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
    </button></h2><p>对于应用程序开发人员而言，Loon 不应成为新的 API 负担。</p>
<p>用户仍应使用熟悉的 Milvus 概念：Collection、插入、搜索和混合搜索。在正常的应用程序开发过程中，他们无需考虑清单文件、ColumnGroups、行 ID 范围或文件布局。</p>
<p>变化发生在底层。存储系统将更深入地理解 AI 数据集的实际演变过程。</p>
<h3 id="Adding-a-new-embedding-should-not-move-the-old-data" class="common-anchor-header">添加新的Embeddings不应导致旧数据被移动</h3><p>此前，向现有Collection添加<code translate="no">embedding_v2</code> 通常需要导出数据、训练新模型、生成向量，然后通过SDK重新导入或批量更新Collection。这一流程会产生大量运维工作：版本追踪、任务失败重试、索引重建、服务影响以及一致性检查。</p>
<p><strong>借助 Loon，这一过程可简化为 Schema 演进加一个新的 ColumnGroup 提交。</strong>新的嵌入向量列可作为独立的物理 ColumnGroup 写入，按行 ID 对齐，并通过清单（Manifest）使其可见。旧的标题列、标量元数据列和原始嵌入向量列无需移动。</p>
<h3 id="Backfills-should-not-require-a-client-side-update-loop" class="common-anchor-header">数据补全不应需要客户端更新循环</h3><p>许多 AI 数据更新属于回填操作。当混合搜索变得重要时，团队可能会添加稀疏向量；训练新模型后，可能会添加重新排序特征；人工审核后，可能会修正标题；政策更新后，可能会添加治理标签。</p>
<p>在传统架构中，即使数据由 Spark、Ray 或其他外部引擎生成，这些更改通常也需通过客户端 SDK 更新或仅限数据库的写入路径来实现。</p>
<p>借助 Loon，外部计算系统可以生成新的 ColumnGroups 并通过 Manifest 提交。数据库不再是每次重写的唯一入口。</p>
<h3 id="Offline-analysis-should-not-require-another-copy-of-the-truth" class="common-anchor-header">离线分析不应需要另一份“真实数据”副本</h3><p>此前，团队通常会将在线Collection导出到 Parquet 中以供离线评估或分析。这会导致同一Collection产生两个版本：在线Collection和分析副本。一旦标注被更正、Embeddings被重新生成、删除日志被应用或索引被重建，团队就必须确认哪个副本是最新版本。</p>
<p>借助基于清单的存储模型，分析引擎可以读取与服务系统相同的版本化数据集视图。它们可以仅投影所需的列，仅扫描相关的行范围，并基于声明的数据集版本进行操作，而非依赖手动导出的快照。</p>
<h3 id="Deletes-and-corrections-should-touch-only-what-changed" class="common-anchor-header">删除和更正操作应仅针对发生变化的部分</h3><p>删除、标题更正、标签修正和治理更新是 AI 数据集中的常规操作。这些操作不应强制每个长向量列都经过相同的重写路径。</p>
<p>借助 Loon，删除日志可首先被视为逻辑删除。后续的压缩操作可在不重写无关数据的情况下清理受影响的 ColumnGroups。如果一个短文本字段发生变化，存储层不应仅仅因为它们共享同一逻辑行，就不得不重写数百吉字节的密集向量。</p>
<h3 id="External-engines-become-part-of-the-workflow-not-an-escape-hatch" class="common-anchor-header">外部引擎成为工作流的一部分，而非“后门”</h3><p>更重大的转变在于，外部引擎不再被视为向量数据库之外的系统。</p>
<p>Spark、Ray、评估任务、标注系统和治理管道已经生成并修改了大量数据。存储层应使它们能够围绕单一可信数据源进行协作，而不是不断地导出、复制和重新导入。</p>
<p>这正是 Manifest 的某个版本所能实现的。它为在线服务、离线分析、数据补全任务和数据压缩提供了对数据集的统一视图。</p>
<p>这些听起来或许像是内部存储的细节，但它们直接影响团队迭代 AI 数据集的速度。每次模型变更、特征补全、标注更正、质量过滤和索引重建，都取决于同一个问题：<strong>“系统能否在不移动非必要数据的情况下更新数据集？”</strong></p>
<p>这就是该存储模型的实际价值。</p>
<h2 id="Loon-is-available-in-Milvus-30-beta-and-Zilliz-Vector-Lakebase" class="common-anchor-header">Loon 已在 Milvus 3.0 测试版和 Zilliz Vector Lakebase 中提供<button data-href="#Loon-is-available-in-Milvus-30-beta-and-Zilliz-Vector-Lakebase" class="anchor-icon" translate="no">
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
    </button></h2><p>Loon 已在<a href="https://milvus.io/docs/release_notes.md">Milvus 3.0 测试版中</a>推出，同时也是<a href="https://zilliz.com/blog/from-vector-database-to-vector-lakebase">Zilliz</a> Cloud 的下一代<a href="https://zilliz.com/blog/from-vector-database-to-vector-lakebase">产品——Zilliz Vector Lakebase</a> 存储层的一部分。本次发布重点关注三个核心领域：</p>
<ul>
<li><strong>Manifest。其</strong>目标是确保写入、回填、删除、统计信息和索引更新能生成带版本的数据集视图，以便读取者能够一致地访问这些视图。 对于读取方而言，这意味着查询可以打开特定的 Manifest 版本，并查看数据集的稳定视图。对于写入方而言，这意味着可以先准备好新的数据文件、删除日志、统计信息或索引文件，然后通过带版本的提交使其可见。</li>
<li><strong>ColumnGroup 和格式支持。</strong>Parquet 支持标量列和生态系统友好的列。Vortex 支持以向量为主的访问模式。Lance 可在只读模式下集成，以兼容现有的 Lance 数据集。</li>
<li><strong>Lake 上的索引。</strong>标量统计信息、过滤索引和文本倒排索引均可参与基于 Manifest 的按行范围规划。Lake 原生向量索引的参与程度则更为复杂。 HNSW 和 IVF 在对象存储上的行为各不相同，尤其是 HNSW 对随机访问和缓存局部性非常敏感。它不能简单地复用为本地 SSD 设计的布局并期望获得相同的结果。</li>
</ul>
<h3 id="There-is-still-work-ahead" class="common-anchor-header">仍有工作待完成</h3><ul>
<li><strong>外部写入路径</strong>至关重要，因为 Spark 和 Ray 应当能够生成 ColumnGroups 和 Manifest 提交，而无需强制将每次回填都通过客户端 SDK 循环进行。</li>
<li><strong>湖仓互操作性</strong>至关重要，因为许多团队已经在使用<strong>Iceberg、Delta Lake、Trino、DuckDB 和 Athena</strong>等目录和查询引擎<strong>。</strong>向量数据应能够融入该生态系统，同时不损失向量搜索性能。</li>
<li><strong>索引布局</strong>至关重要，因为图索引和倒排结构在对象存储上的访问模式各不相同。</li>
<li><strong>大对象语义</strong>至关重要，因为原始视频、PDF、图像和音频文件需要与衍生向量数据集保持一致的引用管理、版本控制和删除行为。</li>
</ul>
<p>具体的发布行为、默认设置和迁移路径应遵循相关的 Milvus 和<a href="https://docs.zilliz.com/docs/release-notes-2605">Zilliz Cloud 发布说明</a>。不过，存储方向是明确的：向量数据库需要在服务层之下拥有一个支持版本控制、原生支持数据湖的基础架构。</p>
<h2 id="Try-Loon-under-Zilliz-Vector-Lakebase" class="common-anchor-header">在 Zilliz 向量湖 base 上试用 Loon<button data-href="#Try-Loon-under-Zilliz-Vector-Lakebase" class="anchor-icon" translate="no">
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
    </button></h2><p>如果您的当前技术栈将在线服务、离线分析、数据回填和外部数据湖工作流分隔在不同的系统中，那么 Zilliz Vector Lakebase 值得您关注。您可以在<a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a> 中试用该平台。新注册的工作邮箱用户可获得 100 美元免费信用额度。也欢迎您<a href="https://zilliz.com/contact-sales">与我们探讨</a>您的具体应用场景。</p>
<p>您还可以关注<a href="https://milvus.io/docs/release_notes.md">Milvus 3.0 的发布，</a>了解 Loon 在开源引擎中的演进情况。</p>
<p><strong>Zilliz 向量湖底座整合了以下功能：</strong></p>
<ul>
<li>针对不同实时性能与成本权衡的分层服务</li>
<li>按需搜索，适用于大规模或探索性工作负载，无需持续运行的计算资源</li>
<li>外部数据湖搜索，可直接对现有数据湖数据进行索引和搜索</li>
<li>支持向量、文本、JSON 和地理空间数据的全方位搜索，并具备混合检索和重新排序功能</li>
<li>基于 Vortex 构建的统一数据湖原生存储，Vortex 是一种开放格式，专为在向量密集型数据上实现更快、更低成本的随机读取而设计</li>
</ul>
