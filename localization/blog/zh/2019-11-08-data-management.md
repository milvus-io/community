---
id: 2019-11-08-data-management.md
title: Milvus中如何进行数据管理
author: Yihua Mo
date: 2019-11-08T00:00:00.000Z
desc: 本帖介绍 Milvus 的数据管理策略。
cover: null
tag: Engineering
origin: null
---
<custom-h1>在大规模向量搜索引擎中管理数据</custom-h1><blockquote>
<p>作者： 莫一华莫一华</p>
<p>日期： 2019-11-08</p>
</blockquote>
<h2 id="How-data-management-is-done-in-Milvus" class="common-anchor-header">Milvus中如何进行数据管理<button data-href="#How-data-management-is-done-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>首先介绍 Milvus 的一些基本概念：</p>
<ul>
<li>表：表是由向量组成的数据集，每个向量都有一个唯一的 ID。每个向量及其 ID 代表表的一行。表中的所有向量必须具有相同的维度。下面是一个包含 10 维向量的表的示例：</li>
</ul>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/data_manage/table.png" alt="table" class="doc-image" id="table" />
   </span> <span class="img-wrapper"> <span>表</span> </span></p>
<ul>
<li>索引：建立索引是通过一定算法对向量进行聚类的过程，需要额外的磁盘空间。有些索引类型因为简化和压缩了向量，所以需要的空间较少，而其他一些类型则比原始向量需要更多空间。</li>
</ul>
<p>在 Milvus 中，用户可以执行创建表格、插入向量、建立索引、搜索向量、检索表格信息、删除表格、删除表格中的部分数据和删除索引等任务。</p>
<p>假设我们有 1 亿个 512 维向量，需要在 Milvus 中插入和管理这些向量，以实现高效的向量搜索。</p>
<p><strong>(1) 向量插入</strong></p>
<p>让我们来看看向量是如何插入 Milvus 的。</p>
<p>由于每个向量占用 2 KB 空间，1 亿个向量的最小存储空间约为 200 GB，一次性插入所有这些向量是不现实的。因此需要多个数据文件，而不是一个文件。插入性能是关键性能指标之一。Milvus 支持一次性插入数百甚至数万个向量。例如，一次性插入 3 万个 512 维向量一般只需要 1 秒钟。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/data_manage/insert.png" alt="insert" class="doc-image" id="insert" />
   </span> <span class="img-wrapper"> <span>插入</span> </span></p>
<p>并非每次向量插入都会加载到磁盘。Milvus 为创建的每个表在 CPU 内存中保留了一个可变缓冲区，插入的数据可以快速写入该缓冲区。当可变缓冲区中的数据达到一定大小时，该空间将被标记为不可变。与此同时，新的可变缓冲区将被保留。不可变缓冲区中的数据会被定期写入磁盘，相应的 CPU 内存也会被释放。定期写入磁盘的机制与 Elasticsearch 中使用的机制类似，后者每 1 秒钟就会向磁盘写入缓冲数据。此外，熟悉 LevelDB/RocksDB 的用户还可以在这里看到与 MemTable 的一些相似之处。</p>
<p>数据插入机制的目标是</p>
<ul>
<li>数据插入必须高效。</li>
<li>插入的数据可以立即使用。</li>
<li>数据文件不应过于分散。</li>
</ul>
<p><strong>(2) 原始数据文件</strong></p>
<p>向量写入磁盘时，会保存在包含原始向量的原始数据文件中。如前所述，大规模向量需要保存在多个数据文件中并进行管理。插入的数据大小各不相同，用户可以一次插入 10 个向量，也可以一次插入 100 万个向量。然而，写入磁盘的操作每 1 秒钟执行一次。因此会产生不同大小的数据文件。</p>
<p>零散的数据文件既不便于管理，也不便于向量搜索。Milvus 会不断合并这些小数据文件，直到合并后的文件大小达到某个特定大小，例如 1GB。这一特定大小可在创建表格时通过 API 参数<code translate="no">index_file_size</code> 进行配置。因此，1 亿个 512 维向量将分布并保存在约 200 个数据文件中。</p>
<p>考虑到增量计算场景中向量的插入和搜索是并发进行的，我们需要确保向量一旦写入磁盘，就可用于搜索。因此，在合并小数据文件之前，可以对它们进行访问和搜索。合并完成后，小数据文件将被删除，新合并的文件将被用于搜索。</p>
<p>这就是合并前查询文件的样子：</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/data_manage/rawdata1.png" alt="rawdata1" class="doc-image" id="rawdata1" />
   </span> <span class="img-wrapper"> <span>rawdata1</span> </span></p>
<p>合并后的查询文件：</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/data_manage/rawdata2.png" alt="rawdata2" class="doc-image" id="rawdata2" />
   </span> <span class="img-wrapper"> <span>原始数据 2</span> </span></p>
<p><strong>(3) 索引文件</strong></p>
<p>基于原始数据文件的搜索是蛮力搜索，它比较查询向量和原点向量之间的距离，并计算出最近的 k 个向量。暴力搜索的效率很低。如果基于索引文件进行搜索，则可以大大提高搜索效率。建立索引需要额外的磁盘空间，通常也很耗时。</p>
<p>那么原始数据文件和索引文件有什么区别呢？简单来说，原始数据文件记录的是每一个向量及其唯一 ID，而索引文件记录的是向量聚类结果，如索引类型、聚类中心点和每个聚类中的向量。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/data_manage/indexfile.png" alt="indexfile" class="doc-image" id="indexfile" />
   </span> <span class="img-wrapper"> <span>索引文件</span> </span></p>
<p>一般来说，索引文件比原始数据文件包含更多信息，但文件大小却小得多，因为在索引构建过程中（对于某些索引类型），向量会被简化和量化。</p>
<p>新创建的表默认采用暴力计算搜索。索引在系统中创建后，Milvus 会在独立线程中自动为大小达到 1 GB 的合并文件建立索引。索引建立完成后，会生成一个新的索引文件。原始数据文件将被归档，以便根据其他索引类型建立索引。</p>
<p>Milvus 会自动为达到 1 GB 的文件建立索引：</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/data_manage/buildindex.png" alt="buildindex" class="doc-image" id="buildindex" />
   </span> <span class="img-wrapper"> <span>建立索引</span> </span></p>
<p>索引构建完成：</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/data_manage/indexcomplete.png" alt="indexcomplete" class="doc-image" id="indexcomplete" />
   </span> <span class="img-wrapper"> <span>索引完成</span> </span></p>
<p>未达到 1 GB 的原始数据文件不会自动建立索引，这可能会降低搜索速度。要避免这种情况，需要手动强制为该表建立索引。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/data_manage/forcebuild.png" alt="forcebuild" class="doc-image" id="forcebuild" />
   </span> <span class="img-wrapper"> <span>强制建立</span> </span></p>
<p>为文件强制建立索引后，搜索性能将大大提高。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/data_manage/indexfinal.png" alt="indexfinal" class="doc-image" id="indexfinal" />
   </span> <span class="img-wrapper"> <span>最终索引</span> </span></p>
<p><strong>(4) 元数据</strong></p>
<p>如前所述，200 个磁盘文件中保存了 1 亿个 512 维向量。当为这些向量建立索引时，将增加 200 个索引文件，这使得文件总数达到 400 个（包括磁盘文件和索引文件）。需要一种有效的机制来管理这些文件的元数据（文件状态和其他信息），以便检查文件状态、删除或创建文件。</p>
<p>使用 OLTP 数据库管理这些信息是一个不错的选择。Standalone 版 Milvus 使用 SQLite 管理元数据，而在分布式部署中，Milvus 使用 MySQL。Milvus 服务器启动时，会分别在 SQLite/MySQL 中创建 2 个表（即 "表 "和 "TableFiles"）。表 "记录表信息，"TableFiles "记录数据文件和索引文件信息。</p>
<p>如下流程图所示，"表 "包含表名（table_id）、向量维度（dimension）、表创建日期（created_on）、表状态（state）、索引类型（engine_type）、向量簇数量（nlist）和距离计算方法（metric_type）等元数据信息。</p>
<p>而 "TableFiles "包含文件所属表的名称（table_id）、文件的索引类型（engine_type）、文件名（file_id）、文件类型（file_type）、文件大小（file_size）、行数（row_count）和文件创建日期（created_on）。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/data_manage/Metadata.png" alt="metadata" class="doc-image" id="metadata" />
   </span> <span class="img-wrapper"> <span>元数据</span> </span></p>
<p>有了这些元数据，就可以执行各种操作符。下面是一些示例：</p>
<ul>
<li>要创建一个表，Meta 管理器只需执行一条 SQL 语句：<code translate="no">INSERT INTO TABLES VALUES(1, 'table_2, 512, xxx, xxx, ...)</code> 。</li>
<li>要在表_2 上执行向量搜索，Meta 管理器将在 SQLite/MySQL 中执行一个查询，这是一个事实上的 SQL 语句：<code translate="no">SELECT * FROM TableFiles WHERE table_id='table_2'</code> ，以检索表_2 的文件信息。然后，查询调度程序会将这些文件加载到内存中，以便进行搜索计算。</li>
<li>不允许立即删除表，因为表上可能正在执行查询。这就是表有软删除和硬删除的原因。删除表时，表将被标记为 "软删除"，不允许再对其进行查询或更改。但是，删除前正在运行的查询仍在继续。只有当所有这些删除前的查询都完成后，表及其元数据和相关文件才会被永久硬删除。</li>
</ul>
<p><strong>(5) 查询调度程序</strong></p>
<p>下图展示了 CPU 和 GPU 的向量搜索过程，通过查询复制并保存在磁盘、CPU 内存和 GPU 内存中的文件（原始数据文件和索引文件）来查找 TOPK 最相似的向量。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/data_manage/topkresult.png" alt="topkresult" class="doc-image" id="topkresult" />
    查询 </span> <span class="img-wrapper"> <span>结果</span> </span></p>
<p>查询调度算法显著提高了系统性能。其基本设计理念是通过最大限度地利用硬件资源来实现最佳搜索性能。以下只是对查询调度算法的简要介绍，未来将有专门的文章介绍这一主题。</p>
<p>我们将针对给定表的第一次查询称为 "冷 "查询，随后的查询称为 "热 "查询。当对给定表进行第一次查询时，Milvus 会做大量工作将数据加载到 CPU 内存中，并将一些数据加载到 GPU 内存中，这非常耗时。在以后的查询中，由于部分或全部数据已经在 CPU 内存中，节省了从磁盘读取数据的时间，因此搜索速度大大加快。</p>
<p>为了缩短首次查询的搜索时间，Milvus 提供了预加载表 (<code translate="no">preload_table</code>) 配置，可在服务器启动时自动将表预加载到 CPU 内存中。对于一个包含 1 亿个 512 维向量的表，也就是 200 GB，如果有足够的 CPU 内存来存储所有这些数据，搜索速度是最快的。但是，如果表中包含十亿规模的向量，有时就不可避免地要释放 CPU/GPU 内存来添加未查询的新数据。目前，我们使用 LRU（最近使用）作为数据替换策略。</p>
<p>如下图所示，假设有一个表在磁盘上存储了 6 个索引文件。CPU 内存只能存储 3 个索引文件，GPU 内存只能存储 1 个索引文件。</p>
<p>搜索开始时，CPU 内存会加载 3 个索引文件进行查询。第一个文件被查询后将立即从 CPU 内存中释放。与此同时，第 4 个文件被载入 CPU 内存。同样，当在 GPU 内存中查询到一个文件时，它将立即被释放并替换为一个新文件。</p>
<p>查询调度程序主要处理两组任务队列，一组是数据加载队列，另一组是搜索执行队列。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/data_manage/queryschedule.png" alt="queryschedule" class="doc-image" id="queryschedule" />
   </span> <span class="img-wrapper"> <span>查询调度</span> </span></p>
<p><strong>(6) 结果还原器</strong></p>
<p>与向量搜索相关的有 2 个关键参数：一个是 "n"，表示 n 个目标向量；另一个是 "k"，表示前 k 个最相似的向量。搜索结果实际上是 n 组 KVP（键值对），每组有 k 对键值。由于查询需要针对每个文件执行，无论是原始数据文件还是索引文件，因此每个文件都将检索到 n 组前 k 个结果集。所有这些结果集合并后就得到了表的前 k 个结果集。</p>
<p>下面的示例展示了如何合并和缩减结果集，以便对包含 4 个索引文件（n=2，k=3）的表进行向量搜索。请注意，每个结果集都有 2 列。左列代表向量 id，右列代表欧氏距离。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/data_manage/resultreduce.png" alt="result" class="doc-image" id="result" />
   </span> <span class="img-wrapper"> <span>结果</span> </span></p>
<p><strong>(7) 未来优化</strong></p>
<p>以下是对数据管理可能优化的一些想法。</p>
<ul>
<li>如果不可变缓冲区甚至可变缓冲区中的数据也能即时查询，会怎样？目前，不可变缓冲区中的数据在写入磁盘之前无法查询。有些用户对插入后即时访问数据更感兴趣。</li>
<li>提供表分区功能，允许用户将非常大的表分成较小的分区，并对给定分区执行向量搜索。</li>
<li>为向量添加一些可过滤的属性。例如，有些用户只想搜索具有特定属性的向量。这就需要检索向量属性甚至原始向量。一种可行的方法是使用 KV 数据库，如 RocksDB。</li>
<li>提供数据迁移功能，实现过期数据自动迁移到其他存储空间。在某些场景中，数据一直在流入，数据可能会老化。由于一些用户只关心最近一个月的数据并对其执行搜索，因此较旧的数据变得不那么有用，但却占用了大量磁盘空间。数据迁移机制有助于为新数据释放磁盘空间。</li>
</ul>
<h2 id="Summary" class="common-anchor-header">总结<button data-href="#Summary" class="anchor-icon" translate="no">
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
    </button></h2><p>本文主要介绍 Milvus 的数据管理策略。有关 Milvus Distributed 部署、向量索引方法选择和查询调度程序的更多文章将陆续推出。敬请期待！</p>
<h2 id="Related-blogs" class="common-anchor-header">相关博客<button data-href="#Related-blogs" class="anchor-icon" translate="no">
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
<li><a href="https://medium.com/@milvusio/milvus-metadata-management-1-6b9e05c06fb0">Milvus 元数据管理 (1)：如何查看元数据</a></li>
<li><a href="https://medium.com/@milvusio/milvus-metadata-management-2-fields-in-the-metadata-table-3bf0d296ca6d">Milvus 元数据管理（2）：元数据表中的字段</a></li>
</ul>
