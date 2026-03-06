---
id: scheduling-query-tasks-milvus.md
title: Background
author: milvus
date: 2020-03-03T22:38:17.829Z
desc: The work behind the scene
cover: assets.zilliz.com/eric_rothermel_Fo_KO_4_Dp_Xam_Q_unsplash_469fe12aeb.jpg
tag: Engineering
canonicalUrl: 'https://zilliz.com/blog/scheduling-query-tasks-milvus'
---
<custom-h1>How Does Milvus Schedule Query Tasks</custom-h1><p>n this article, we will discuss how Milvus schedules query tasks. We will also talk about problems, solutions, and future orientations for implementing Milvus scheduling.</p>
<h2 id="Background" class="common-anchor-header">Background<button data-href="#Background" class="anchor-icon" translate="no">
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
    </button></h2><p>We know from Managing Data in Massive-Scale Vector Search Engine that vector similarity search is implemented by the distance between two vectors in high-dimensional space. The goal of vector search is to find K vectors that are closest to the target vector.</p>
<p>There are many ways to measure vector distance, such as Euclidean distance:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/1_euclidean_distance_156037c939.png" alt="1-euclidean-distance.png" class="doc-image" id="1-euclidean-distance.png" />
    <span>1-euclidean-distance.png</span>
  </span>
</p>
<p>where x and y are two vectors. n is the dimension of the vectors.</p>
<p>In order to find K nearest vectors in a dataset, Euclidean distance needs to be computed between the target vector and all vectors in the dataset to be searched. Then, vectors are sorted by distance to acquire K nearest vectors. The computational work is in direct proportion to the size of the dataset. The larger the dataset, the more computational work a query requires. A GPU, specialized for graph processing, happens to have a lot of cores to provide the required computing power. Thus, multi-GPU support is also taken into consideration during Milvus implementation.</p>
<h2 id="Basic-concepts" class="common-anchor-header">Basic concepts<button data-href="#Basic-concepts" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Data-blockTableFile" class="common-anchor-header">Data block（TableFile）</h3><p>To improve support for massive-scale data search, we optimized the data storage of Milvus. Milvus splits the data in a table by size into multiple data blocks. During vector search, Milvus searches vectors in each data block and merges the results. One vector search operation consists of N independent vector search operations (N is the number of data blocks) and N-1 result merge operations.</p>
<h3 id="Task-queueTaskTable" class="common-anchor-header">Task queue（TaskTable）</h3><p>Each Resource has a task array, which records tasks belonging to the Resource. Each task has different states, including Start, Loading, Loaded, Executing, and Executed. The Loader and Executor in a computing device share the same task queue.</p>
<h3 id="Query-scheduling" class="common-anchor-header">Query scheduling</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2_query_scheduling_5798178be2.png" alt="2-query-scheduling.png" class="doc-image" id="2-query-scheduling.png" />
    <span>2-query-scheduling.png</span>
  </span>
</p>
<ol>
<li>When the Milvus server starts, Milvus launches the corresponding GpuResource via the <code translate="no">gpu_resource_config</code> parameters in the <code translate="no">server_config.yaml</code> configuration file. DiskResource and CpuResource still cannot be edited in <code translate="no">server_config.yaml</code>. GpuResource is the combination of <code translate="no">search_resources</code> and <code translate="no">build_index_resources</code> and referred to as <code translate="no">{gpu0, gpu1}</code> in the following example:</li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/3_sample_code_ffee1c290f.png" alt="3-sample-code.png" class="doc-image" id="3-sample-code.png" />
    <span>3-sample-code.png</span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/3_example_0eeb85da71.png" alt="3-example.png" class="doc-image" id="3-example.png" />
    <span>3-example.png</span>
  </span>
</p>
<ol start="2">
<li>Milvus receives a request. Table metadata is stored in an external database, which is SQLite or MySQl for single-host and MySQL for distributed. After receiving a search request, Milvus validates whether the table exists and the dimension is consistent. Then, Milvus reads the TableFile list of the table.</li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/4_milvus_reads_tablefile_list_1e9d851543.png" alt="4-milvus-reads-tablefile-list.png" class="doc-image" id="4-milvus-reads-tablefile-list.png" />
    <span>4-milvus-reads-tablefile-list.png</span>
  </span>
</p>
<ol start="3">
<li>Milvus creates a SearchTask. Because the computation of each TableFile is performed independently, Milvus creates a SearchTask for each TableFile. As the basic unit of task scheduling, a SearchTask contains the target vectors, search parameters, and the filenames of TableFile.</li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/5_table_file_list_task_creator_36262593e4.png" alt="5-table-file-list-task-creator.png" class="doc-image" id="5-table-file-list-task-creator.png" />
    <span>5-table-file-list-task-creator.png</span>
  </span>
</p>
<ol start="4">
<li>Milvus chooses a computing device. The device that a SearchTask performs computation depends on the <strong>estimated completion</strong> time for each device. The <strong>estimated completion</strong> time specifies the estimated interval between the current time and the estimated time when the computation completes.</li>
</ol>
<p>For example, when a data block of a SearchTask is loaded to CPU memory, the next SearchTask is waiting in the CPU computation task queue and the GPU computation task queue is idle. The <strong>estimated completion time</strong> for CPU is equal to the sum of the estimated time cost of the previous SearchTask and the current SearchTask. The <strong>estimated completion time</strong> for a GPU is equal to the sum of the time for data blocks to be loaded to the GPU and the estimated time cost of the current SearchTask. The <strong>estimated completion time</strong> for a SearchTask in a Resource is equal to the average execution time of all SearchTasks in the Resource. Milvus then chooses a device with the least <strong>estimated completion time</strong> and assign SearchTask to the device.</p>
<p>Here we assume that the <strong>estimated completion time</strong> for GPU1 is shorter.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/6_GPU_1_shorter_estimated_completion_time_42c7639b87.png" alt="6-GPU1-shorter-estimated-completion-time.png" class="doc-image" id="6-gpu1-shorter-estimated-completion-time.png" />
    <span>6-GPU1-shorter-estimated-completion-time.png</span>
  </span>
</p>
<ol start="5">
<li><p>Milvus adds SearchTask to the task queue of DiskResource.</p></li>
<li><p>Milvus moves SearchTask to the task queue of CpuResource. The loading thread in CpuResource loads each task from the task queue sequentially. CpuResource reads the corresponding data blocks to CPU memory.</p></li>
<li><p>Milvus moves SearchTask to GpuResource. The loading thread in GpuResource copies data from CPU memory to GPU memory. GpuResource reads the corresponding data blocks to GPU memory.</p></li>
<li><p>Milvus executes SearchTask in GpuResource. Because the result of a SearchTask is relatively small, the result is directly returned to CPU memory.</p></li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/7_scheduler_53f1fbbaba.png" alt="7-scheduler.png" class="doc-image" id="7-scheduler.png" />
    <span>7-scheduler.png</span>
  </span>
</p>
<ol start="9">
<li>Milvus merges the result of SearchTask to the whole search result.</li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/8_milvus_merges_searchtast_result_9f3446e65a.png" alt="8-milvus-merges-searchtast-result.png" class="doc-image" id="8-milvus-merges-searchtast-result.png" />
    <span>8-milvus-merges-searchtast-result.png</span>
  </span>
</p>
<p>After all SearchTasks are complete, Milvus returns the whole search result to the client.</p>
<h2 id="Index-building" class="common-anchor-header">Index building<button data-href="#Index-building" class="anchor-icon" translate="no">
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
    </button></h2><p>Index building is basically the same as the search process without the merging process. We will not talk about this in detail.</p>
<h2 id="Performance-optimization" class="common-anchor-header">Performance optimization<button data-href="#Performance-optimization" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Cache" class="common-anchor-header">Cache</h3><p>As mentioned before, data blocks need to be loaded to corresponding storage devices such as CPU memory or GPU memory before computation. To avoid repetitive data loading, Milvus introduces LRU (Least Recently Used) cache. When the cache is full, new data blocks push away old data blocks. You can customize the cache size by the configuration file based on the current memory size. A large cache to store search data is recommended to effectively save data loading time and improve search performance.</p>
<h3 id="Data-loading-and-computation-overlap" class="common-anchor-header">Data loading and computation overlap</h3><p>The cache cannot satisfy our needs for better search performance. Data needs to be reloaded when memory is insufficient or the size of the dataset is too large. We need to decrease the effect of data loading on search performance. Data loading, whether it be from disk to CPU memory or from CPU memory to GPU memory, belongs to IO operations and barely needs any computational work from processors. So, we consider performing data loading and computation in parallel for better resource usage.</p>
<p>We split the computation on a data block into 3 stages (loading from disk to CPU memory, CPU computation, result merging) or 4 stages (loading from disk to CPU memory, loading from CPU memory to GPU memory, GPU computation and result retrieval, and result merging). Take 3-stage computation as an example, we can launch 3 threads responsible for the 3 stages to function as instruction pipelining. Because the results sets are mostly small, result merging does not take much time. In some cases, the overlap of data loading and computation can reduce the search time by 1/2.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/9_sequential_overlapping_load_milvus_1af809b29e.png" alt="9-sequential-overlapping-load-milvus.png" class="doc-image" id="9-sequential-overlapping-load-milvus.png" />
    <span>9-sequential-overlapping-load-milvus.png</span>
  </span>
</p>
<h2 id="Problems-and-solutions" class="common-anchor-header">Problems and solutions<button data-href="#Problems-and-solutions" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Different-transmission-speeds" class="common-anchor-header">Different transmission speeds</h3><p>Previously, Milvus uses the Round Robin strategy for multi-GPU task scheduling. This strategy worked perfectly in our 4-GPU server and the search performance was 4 times better. However, for our 2-GPU hosts, the performance was not 2 times better. We did some experiments and discovered that the data copy speed for a GPU was 11 GB/s. However, for another GPU, it was 3 GB/s. After referring to the mainboard documentation, we confirmed that the mainboard was connected to one GPU via PCIe x16 and another GPU via PCIe x4. That is to say, these GPUs have different copy speeds. Later, we added copy time to measure the optimal device for each SearchTask.</p>
<h2 id="Future-work" class="common-anchor-header">Future work<button data-href="#Future-work" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Hardware-environment-with-increased-complexity" class="common-anchor-header">Hardware environment with increased complexity</h3><p>In real conditions, the hardware environment may be more complicated. For hardware environments with multiple CPUs, memory with NUMA architecture, NVLink, and NVSwitch, communication across CPUs/GPUs brings a lot of opportunities for optimization.</p>
<p>Query optimization</p>
<p>During experimentation, we discovered some opportunities for performance improvement. For example, when the server receives multiple queries for the same table, the queries can be merged under some conditions. By using data locality, we can improve the performance. These optimizations will be implemented in our future development.
Now we already know how queries are scheduled and performed for the single-host, multi-GPU scenario. We will continue to introduce more inner mechanisms for Milvus in the upcoming articles.</p>
