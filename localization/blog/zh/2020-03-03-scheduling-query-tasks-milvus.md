---
id: scheduling-query-tasks-milvus.md
title: 背景介绍
author: milvus
date: 2020-03-03T22:38:17.829Z
desc: 幕后工作
cover: assets.zilliz.com/eric_rothermel_Fo_KO_4_Dp_Xam_Q_unsplash_469fe12aeb.jpg
tag: Engineering
canonicalUrl: 'https://zilliz.com/blog/scheduling-query-tasks-milvus'
---
<custom-h1>Milvus 如何安排查询任务</custom-h1><p>本文将讨论 Milvus 如何调度查询任务。我们还将讨论实现 Milvus 调度的问题、解决方案和未来方向。</p>
<h2 id="Background" class="common-anchor-header">背景介绍<button data-href="#Background" class="anchor-icon" translate="no">
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
    </button></h2><p>我们从《大规模向量搜索引擎中的数据管理》中了解到，向量相似性搜索是通过两个向量在高维空间中的距离来实现的。向量搜索的目标是找到与目标向量最接近的 K 个向量。</p>
<p>衡量向量距离的方法有很多，比如欧氏距离：</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_euclidean_distance_156037c939.png" alt="1-euclidean-distance.png" class="doc-image" id="1-euclidean-distance.png" />
   </span> <span class="img-wrapper"> <span>1-euclidean-distance.png</span> </span></p>
<p>其中 x 和 y 是两个向量。n 是向量的维数。</p>
<p>为了在数据集中找到 K 个最近的向量，需要计算目标向量与要搜索的数据集中所有向量之间的欧氏距离。然后，根据距离对向量进行排序，以获得 K 个最近的向量。计算工作量与数据集的大小成正比。数据集越大，查询所需的计算工作量就越大。专门用于图形处理的 GPU 恰好拥有大量内核，可以提供所需的计算能力。因此，在 Milvus 的实施过程中也考虑到了多 GPU 支持。</p>
<h2 id="Basic-concepts" class="common-anchor-header">基本概念<button data-href="#Basic-concepts" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Data-blockTableFile" class="common-anchor-header">数据块（表文件）</h3><p>为了提高对大规模数据搜索的支持，我们对 Milvus 的数据存储进行了优化。Milvus 将表中的数据按大小分割成多个数据块。在向量搜索过程中，Milvus 在每个数据块中搜索向量并合并结果。一次向量搜索操作包括 N 次独立的向量搜索操作（N 为数据块的数量）和 N-1 次结果合并操作。</p>
<h3 id="Task-queueTaskTable" class="common-anchor-header">任务队列（任务表）</h3><p>每个资源都有一个任务数组，用于记录属于该资源的任务。每个任务都有不同的状态，包括开始、加载、载入、执行和已执行。计算设备中的加载器和执行器共享同一个任务队列。</p>
<h3 id="Query-scheduling" class="common-anchor-header">查询调度</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_query_scheduling_5798178be2.png" alt="2-query-scheduling.png" class="doc-image" id="2-query-scheduling.png" />
   </span> <span class="img-wrapper"> <span>2-query-scheduling.png</span> </span></p>
<ol>
<li>当 Milvus 服务器启动时，Milvus 会通过<code translate="no">server_config.yaml</code> 配置文件中的<code translate="no">gpu_resource_config</code> 参数启动相应的 GpuResource。DiskResource 和 CpuResource 仍无法在<code translate="no">server_config.yaml</code> 中编辑。GpuResource 是<code translate="no">search_resources</code> 和<code translate="no">build_index_resources</code> 的组合，在下面的示例中称为<code translate="no">{gpu0, gpu1}</code> ：</li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_sample_code_ffee1c290f.png" alt="3-sample-code.png" class="doc-image" id="3-sample-code.png" />
   </span> <span class="img-wrapper"> <span>3 示例代码.png</span> </span></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_example_0eeb85da71.png" alt="3-example.png" class="doc-image" id="3-example.png" />
   </span> <span class="img-wrapper"> <span>3-example.png</span> </span></p>
<ol start="2">
<li>Milvus 接收到一个请求。表元数据存储在外部数据库中，单主机数据库为 SQLite 或 MySQl，分布式数据库为 MySQL。收到搜索请求后，Milvus 会验证表是否存在，维度是否一致。然后，Milvus 读取表的 TableFile 列表。</li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/4_milvus_reads_tablefile_list_1e9d851543.png" alt="4-milvus-reads-tablefile-list.png" class="doc-image" id="4-milvus-reads-tablefile-list.png" />
   </span> <span class="img-wrapper"> <span>4-milvus-reads-tablefile-list.png</span> </span></p>
<ol start="3">
<li>Milvus 创建一个 SearchTask。由于每个 TableFile 的计算都是独立进行的，因此 Milvus 会为每个 TableFile 创建一个 SearchTask。作为任务调度的基本单位，SearchTask 包含目标向量、搜索参数和 TableFile 的文件名。</li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/5_table_file_list_task_creator_36262593e4.png" alt="5-table-file-list-task-creator.png" class="doc-image" id="5-table-file-list-task-creator.png" />
   </span> <span class="img-wrapper"> <span>5-table-file-list-task-creator.png</span> </span></p>
<ol start="4">
<li>Milvus 选择计算设备。搜索任务执行计算的设备取决于每个设备的<strong>预计完成</strong>时间。<strong>预计完成</strong>时间是指当前时间与预计计算完成时间之间的预计间隔。</li>
</ol>
<p>例如，当一个 SearchTask 的数据块加载到 CPU 内存时，下一个 SearchTask 正在 CPU 计算任务队列中等待，而 GPU 计算任务队列处于空闲状态。CPU 的<strong>预计完成时间</strong>等于前一个搜索任务和当前搜索任务的预计时间成本之和。GPU 的<strong>预计完成</strong>时间等于数据块加载到 GPU 的时间与当前搜索任务的预计时间成本之和。资源中搜索任务的<strong>预计完成时间</strong>等于资源中所有搜索任务的平均执行时间。然后，Milvus 会选择<strong>估计完成时间</strong>最少的设备，并将 SearchTask 分配给该设备。</p>
<p>这里我们假设 GPU1 的<strong>估计完成时间</strong>较短。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/6_GPU_1_shorter_estimated_completion_time_42c7639b87.png" alt="6-GPU1-shorter-estimated-completion-time.png" class="doc-image" id="6-gpu1-shorter-estimated-completion-time.png" />
   </span> <span class="img-wrapper"> <span>6-GPU1-shorter-estimated-completion-time.png</span> </span></p>
<ol start="5">
<li><p>Milvus 将 SearchTask 添加到 DiskResource 的任务队列中。</p></li>
<li><p>Milvus 将 SearchTask 移至 CpuResource 的任务队列。CpuResource 中的加载线程按顺序从任务队列中加载每个任务。CpuResource 将相应的数据块读入 CPU 内存。</p></li>
<li><p>Milvus 将 SearchTask 移至 GpuResource。GpuResource 中的加载线程将数据从 CPU 内存复制到 GPU 内存。GpuResource 将相应的数据块读入 GPU 内存。</p></li>
<li><p>Milvus 在 GpuResource 中执行 SearchTask。由于 SearchTask 的结果相对较小，因此结果会直接返回 CPU 内存。</p></li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/7_scheduler_53f1fbbaba.png" alt="7-scheduler.png" class="doc-image" id="7-scheduler.png" />
   </span> <span class="img-wrapper"> <span>7-scheduler.png</span> </span></p>
<ol start="9">
<li>Milvus 会将 SearchTask 的结果合并为整个搜索结果。</li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/8_milvus_merges_searchtast_result_9f3446e65a.png" alt="8-milvus-merges-searchtast-result.png" class="doc-image" id="8-milvus-merges-searchtast-result.png" />
   </span> <span class="img-wrapper"> <span>8-milvus-merges-searchtast-result.png</span> </span></p>
<p>所有 SearchTask 完成后，Milvus 会将整个搜索结果返回给客户端。</p>
<h2 id="Index-building" class="common-anchor-header">建立索引<button data-href="#Index-building" class="anchor-icon" translate="no">
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
    </button></h2><p>建立索引的过程与搜索过程基本相同，但没有合并过程。我们将不再详细讨论。</p>
<h2 id="Performance-optimization" class="common-anchor-header">性能优化<button data-href="#Performance-optimization" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Cache" class="common-anchor-header">缓存</h3><p>如前所述，数据块需要在计算前加载到相应的存储设备，如 CPU 内存或 GPU 内存。为了避免重复加载数据，Milvus 引入了 LRU（最近最少使用）缓存。当缓存满时，新数据块会推走旧数据块。你可以根据当前内存大小，通过配置文件自定义缓存大小。建议使用较大的缓存来存储搜索数据，以有效节省数据加载时间并提高搜索性能。</p>
<h3 id="Data-loading-and-computation-overlap" class="common-anchor-header">数据加载和计算重叠</h3><p>缓存并不能满足我们提高搜索性能的需求。当内存不足或数据集过大时，需要重新加载数据。我们需要减少数据加载对搜索性能的影响。数据加载，无论是从磁盘到 CPU 内存，还是从 CPU 内存到 GPU 内存，都属于 IO 操作，几乎不需要处理器做任何计算工作。因此，我们考虑并行执行数据加载和计算，以更好地利用资源。</p>
<p>我们将数据块的计算分为 3 个阶段（从磁盘加载到 CPU 内存、CPU 计算、结果合并）或 4 个阶段（从磁盘加载到 CPU 内存、从 CPU 内存加载到 GPU 内存、GPU 计算和结果检索、结果合并）。以 3 阶段计算为例，我们可以启动 3 个线程，分别负责 3 个阶段，以实现指令流水线功能。由于结果集大多较小，结果合并不需要太多时间。在某些情况下，数据加载和计算的重叠可以将搜索时间缩短 1/2。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/9_sequential_overlapping_load_milvus_1af809b29e.png" alt="9-sequential-overlapping-load-milvus.png" class="doc-image" id="9-sequential-overlapping-load-milvus.png" />
   </span> <span class="img-wrapper"> <span>9-sequential-overlapping-load-milvus.png</span> </span></p>
<h2 id="Problems-and-solutions" class="common-anchor-header">问题和解决方案<button data-href="#Problems-and-solutions" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Different-transmission-speeds" class="common-anchor-header">不同的传输速度</h3><p>此前，Milvus 在多 GPU 任务调度中使用的是循环罗宾（Round Robin）策略。这一策略在我们的 4 GPU 服务器上运行完美，搜索性能提高了 4 倍。但是，对于我们的 2 GPU 主机，性能却没有提高 2 倍。我们做了一些实验，发现一个 GPU 的数据复制速度为 11 GB/秒。而另一个 GPU 的数据复制速度为 3 GB/秒。参考主板文档后，我们确认主板通过 PCIe x16 与一个 GPU 连接，通过 PCIe x4 与另一个 GPU 连接。也就是说，这些 GPU 的复制速度不同。随后，我们增加了复制时间，以测量每个 SearchTask 的最佳设备。</p>
<h2 id="Future-work" class="common-anchor-header">未来工作<button data-href="#Future-work" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Hardware-environment-with-increased-complexity" class="common-anchor-header">增加复杂性的硬件环境</h3><p>在实际条件下，硬件环境可能会更加复杂。对于拥有多个 CPU、NUMA 架构内存、NVLink 和 NVSwitch 的硬件环境，跨 CPU/GPU 的通信会带来很多优化机会。</p>
<p>查询优化</p>
<p>在实验过程中，我们发现了一些提高性能的机会。例如，当服务器收到针对同一个表的多个查询时，在某些条件下可以合并查询。通过使用数据局部性，我们可以提高性能。我们将在未来的开发中实现这些优化。 现在，我们已经知道在单主机、多 GPU 的情况下如何调度和执行查询。我们将在接下来的文章中继续介绍 Milvus 的更多内部机制。</p>
