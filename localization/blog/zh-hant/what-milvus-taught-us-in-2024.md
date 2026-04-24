---
id: what-milvus-taught-us-in-2024.md
title: What Milvus Users Taught Us in 2024
author: Stefan Webb
date: 2025-02-18T00:00:00.000Z
desc: Check out the top asked questions about Milvus in our Discord.
cover: assets.zilliz.com/What_Milvus_Users_Taught_Us_in_2024_db63863725.png
tag: Engineering
tags: null
recommend: true
canonicalUrl: 'https://milvus.io/blog/what-milvus-taught-us-in-2024.md'
---
<h2 id="Overview" class="common-anchor-header">Overview<button data-href="#Overview" class="anchor-icon" translate="no">
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
    </button></h2><p>As Milvus flourished in 2024 with major releases and a thriving open-source ecosystem, a hidden treasure trove of user insights was quietly forming in our community on <a href="https://discord.gg/xwqmFDURcz">Discord</a>. This compilation of community discussions presented a unique opportunity to understand our users’ challenges firsthand. Intrigued by this untapped resource, I embarked on a comprehensive analysis of every discussion thread from the year, searching for patterns that could help us compile a frequently asked questions resource for Milvus users.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/top_image_6bbdbe8caa.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>My analysis revealed three primary areas where users consistently sought guidance: <strong>Performance Optimization</strong>, <strong>Deployment Strategies</strong>, and <strong>Data Management</strong>. Users frequently discussed how to fine-tune Milvus for production environments and track performance metrics effectively. When it came to deployment, the community grappled with selecting appropriate deployments, choosing optimal search indices, and resolving issues in distributed setups. The data management conversations centered around service-to-service data migration strategies and the selection of embedding models.</p>
<p>Let’s examine each of these areas in more detail.</p>
<h2 id="Deployment" class="common-anchor-header">Deployment<button data-href="#Deployment" class="anchor-icon" translate="no">
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
    </button></h2><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/deployment_c951c46339.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Milvus provides flexible deployment modes to fit various use cases. However, some users do find it challenging to find the right choice, and want to feel comfortable that they are doing so “correctly.”</p>
<h3 id="Which-deployment-type-should-I-choose" class="common-anchor-header">Which deployment type should I choose?</h3><p>A very frequent question is which deployment to choose out of Milvus <a href="https://milvus.io/docs/milvus_lite.md">Lite</a>, <a href="https://milvus.io/docs/prerequisite-docker.md">Standalone</a>, and <a href="https://milvus.io/docs/prerequisite-helm.md">Distributed</a>. The answer primarily depends on how large your vector database needs to be and how much traffic it will serve:</p>
<h4 id="Milvus-Lite" class="common-anchor-header">Milvus Lite</h4><p>When prototyping on your local system with up to a few million vectors, or looking for an embedded vector db for unit testing and CI/CD, you can use Milvus Lite. Note that some more advanced features like full-text search are not yet available within Milvus Lite but coming soon.</p>
<h4 id="Milvus-Standalone" class="common-anchor-header">Milvus Standalone</h4><p>If your system needs to serve production traffic and / or you need to store between a few million and a hundred-million vectors, you should use Milvus Standalone, which packs all components of Milvus into a single Docker image. There is a variation which just takes its persistent storage (minio) and metadata store (etcd) dependencies out as separate images.</p>
<h4 id="Milvus-Distributed" class="common-anchor-header">Milvus Distributed</h4><p>For any larger scale deployments serving production traffic, like serving billions of vectors at thousands of QPS, you should use Milvus Distributed. Some users may want to perform offline batch processing at scale, for example, for data deduplication or record linkage, and the future version of Milvus 3.0 will provide a more efficient way of doing this by what we term a vector lake.</p>
<h4 id="Fully-Managed-Service" class="common-anchor-header">Fully Managed Service</h4><p>For developers who want to focus on the application development without worrying about DevOps, <a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a> is the fully managed Milvus that offers a free tier.</p>
<p>See <a href="https://milvus.io/docs/install-overview.md#Choose-the-Right-Deployment-for-Your-Use-Case">“Overview of Milvus Deployments”</a> for more information.</p>
<h3 id="How-much-memory-storage-and-compute-will-I-require" class="common-anchor-header">How much memory, storage, and compute will I require?</h3><p>This question comes up a lot, not only for existing Milvus users but also those who are considering whether Milvus is appropriate for their application. The exact combination of how much memory, storage, and compute a deployment will require depends on complex interaction of factors.</p>
<p>Vector embeddings differ in dimensionality due to the model that is used. And some vector search indexes are stored entirely in memory, whereas others store data to disk. Also, many search indexes are able to store a compressed (quantized) copy of the embeddings and require additional memory for graph data structures. These are just a few factors that affect the memory and storage.</p>
<h4 id="Milvus-Resource-Sizing-Tool" class="common-anchor-header">Milvus Resource Sizing Tool</h4><p>Luckily, Zilliz (the team that maintains Milvus) has built <a href="https://milvus.io/tools/sizing">a resource sizing tool</a> that does a fantastic job of answering this question. Input your vector dimensionality, index type, deployment options, and so on and the tool estimates CPU, memory, and storage needed across the various types of Milvus nodes and its dependencies. Your mileage may vary so a real load testing with your data and sample traffic is always a good idea.</p>
<h3 id="Which-vector-index-or-distance-metric-should-I-choose" class="common-anchor-header">Which vector index or distance metric should I choose?</h3><p>Many users are uncertain which index they should choose and how to set the hyperparameters. First, it is always possible to defer the choice of index type to Milvus by selecting AUTOINDEX. If you wish to select a specific index type, however, a few rules of thumb provide a starting point.</p>
<h4 id="In-Memory-Indexes" class="common-anchor-header">In-Memory Indexes</h4><p>Would you like to pay the cost to fit your index entirely into memory? An in-memory index is typically the fastest but also expensive. See <a href="https://milvus.io/docs/index.md?tab=floating">“In-memory indexes”</a> for a list of the ones supported by Milvus and the tradeoffs they make in terms of latency, memory, and recall.</p>
<p>Keep in mind that your index size is not simply the number of vectors times their dimensionality and floating point size. Most indexes quantize the vectors to reduce memory usage, but require memory for additional data structures. Other non-vector data (scalar) and their index also takes up memory space.</p>
<h4 id="On-Disk-Indexes" class="common-anchor-header">On-Disk Indexes</h4><p>When your index does not fit in memory, you can use one of the <a href="https://milvus.io/docs/disk_index.md">“On-disk indexes”</a> provided by Milvus. Two choices with very different latency/resource tradeoffs are <a href="https://milvus.io/docs/disk_index.md">DiskANN</a> and <a href="https://milvus.io/docs/mmap.md#MMap-enabled-Data-Storage">MMap</a>.</p>
<p>DiskANN stores a highly compressed copy of the vectors in memory, and the uncompressed vectors and graph search structures on disk. It uses some clever ideas to search the vector space while minimizing disk reads and takes advantage of the fast random access speed of SSDs. For minimum latency, the SSD must be connected via NVMe rather than SATA for best I/O performance.</p>
<p>Technically speaking, MMap is not an index type, but refers to the use of virtual memory with an in-memory index. With virtual memory, pages can be swapped between disk and RAM as required, which allows a much larger index to be used efficiently if the access patterns are such that only a small portion of the data is used at a time.</p>
<p>DiskANN has excellent and consistent latency. MMap has even better latency when it is accessing a page in-memory, but frequent page-swapping will cause latency spikes. Thus MMap can have a higher variability in latency, depending on the memory access patterns.</p>
<h4 id="GPU-Indexes" class="common-anchor-header">GPU Indexes</h4><p>A third option is to construct <a href="https://milvus.io/docs/gpu_index.md">an index using GPU memory and compute</a>. Milvus’ GPU support is contributed by the Nvidia <a href="https://rapids.ai/">RAPIDS</a> team. GPU vector search may have lower latency than a corresponding CPU search, although it usually takes hundreds or thousands of search QPS to fully exploit the parallelism of GPU. Also, GPUs typically have less memory than the CPU RAM and are more costly to run.</p>
<h4 id="Distance-Metrics" class="common-anchor-header">Distance Metrics</h4><p>An easier question to answer is which distance metric should you choose to measure similarity between vectors. It is recommended to choose the same distance metric that your embedding model was trained with, which is typically COSINE (or IP when inputs are normalized). The source of your model (e.g. the model page on HuggingFace) will provide clarification on which distance metric was used. Zilliz also put together a convenient <a href="https://zilliz.com/ai-models">table</a> to look that up.</p>
<p>To summarize, I think a lot of the uncertainty around index choice revolves around uncertainty about how these choices affect the latency/resource usage/recall tradeoff of your deployment. I recommend using the rules of thumb above to decide between in-memory, on-disk, or GPU indexes, and then using the tradeoff guidelines given in the Milvus documentation to pick a particular one.</p>
<h3 id="Can-you-fix-my-broken-Milvus-Distributed-deployment" class="common-anchor-header">Can you fix my broken Milvus Distributed deployment?</h3><p>Many questions revolve around issues getting a Milvus Distributed deployment up and running, with questions relating to configuration, tooling, and debugging logs. It’s hard to give a single fix as each question seems different from the last, although luckily Milvus has <a href="https://milvus.io/discord">a vibrant Discord</a> where you can seek help, and we also offer <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">1-on-1 office hours with an expert</a>.</p>
<h3 id="How-do-I-deploy-Milvus-on-Windows" class="common-anchor-header">How do I deploy Milvus on Windows?</h3><p>A question that has come up several times is how to deploy Milvus on Windows machines. Based on your feedback, we have rewritten the documentation for this: see <a href="https://milvus.io/docs/install_standalone-windows.md">Run Milvus in Docker (Windows)</a> for how to do this, using <a href="https://learn.microsoft.com/en-us/windows/wsl/about#what-is-wsl-2">Windows Subsystem for Linux 2 (WSL2)</a>.</p>
<h2 id="Performance-and-Profiling" class="common-anchor-header">Performance and Profiling<button data-href="#Performance-and-Profiling" class="anchor-icon" translate="no">
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
    </button></h2><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Performance_and_Profiling_481975ea1d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Having chosen a deployment type and got it running, users want to feel comfortable that they have made optimal decisions and would like to profile their deployment’s performance and state. Many questions related to how to profile performance, observe state, and get an insight into what and why.</p>
<h3 id="How-do-I-measure-performance" class="common-anchor-header">How do I measure performance?</h3><p>Users want to check metrics related to the performance of their deployment so they can understand and remedy bottlenecks. Metrics mentioned include average query latency, distribution of latencies, query volume, memory usage, disk storage, and so on. These metrics can be observed from the <a href="https://milvus.io/docs/monitor_overview.md">monitoring system</a>. In addition, Milvus 2.5 introduces a new tool called <a href="https://milvus.io/docs/milvus-webui.md#Milvus-WebUI">WebUI</a> (feedback welcome!), which allows you to access more system internal information like segment compaction status, from a user-friendly web interface.</p>
<h3 id="What’s-happening-inside-Milvus-right-now-ie-observe-state" class="common-anchor-header">What’s happening inside Milvus right now (i.e. observe state)?</h3><p>Relatedly, users want to observe the internal state of their deployment. Issues raised include understanding why a search index is taking so long to build, how to determine if the cluster is healthy, and understanding how a query is executed across nodes. Many of these questions can be answered with the new <a href="https://milvus.io/docs/milvus-webui.md#Milvus-WebUI">WebUI</a> that gives transparency to what the system is doing internally.</p>
<h3 id="How-does-some-complex-aspect-of-the-internals-work" class="common-anchor-header">How does some (complex) aspect of the internals work?</h3><p>Advanced users often want some understanding of Milvus internals, for example, having an understanding of the sealing of segments or memory management. The underlying goal is typically to improve performance and sometimes to debug issues. The documentation, particularly under the sections “Concepts” and “Administration Guide&quot; is helpful here, for instance see the pages <a href="https://milvus.io/docs/architecture_overview.md">“Milvus Architecture Overview”</a> and <a href="https://milvus.io/docs/clustering-compaction.md">“Clustering Compaction”</a>. We will continue to improve the documentation on Milvus internals, make it easier to understand, and welcome any feedback or requests via <a href="https://milvus.io/discord">Discord</a>.</p>
<h3 id="Which-embedding-model-should-I-choose" class="common-anchor-header">Which embedding model should I choose?</h3><p>A question related to performance that has come up multiple times in meetups, office hours, and on Discord is how to choose an embedding model. This is a difficult question to give a definitive answer although we recommend starting with default models like <a href="https://huggingface.co/sentence-transformers/all-MiniLM-L6-v2">all-MiniLM-L6-v2</a>.</p>
<p>Similar to the choice of search index, there are tradeoffs between compute, storage, and recall. An embedding model with larger output dimension will require more storage, all else held equal, although probably result in higher recall of relevant items. Larger embedding models, for a fixed dimension, typically outperform smaller ones in terms of recall, although at the cost of increased compute and time. Leaderboards that rank embedding model performance such as <a href="https://huggingface.co/spaces/mteb/leaderboard">MTEB</a> are based on benchmarks that may not align with your specific data and task.</p>
<p>So, it does not make sense to think of a “best” embedding model. Start with one that has acceptable recall and meets your compute and time budget for calculating embeddings. Further optimizations like fine-tuning on your data or exploring the compute/recall tradeoff empirically can be deferred to after you have a working system in production.</p>
<h2 id="Data-Management" class="common-anchor-header">Data Management<button data-href="#Data-Management" class="anchor-icon" translate="no">
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
    </button></h2><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Data_Management_aa2d1159bd.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>How to move data into and out of a Milvus deployment is another main theme in the Discord discussions, which is no surprise given how central this task is to putting an application into production.</p>
<h3 id="How-do-I-migrate-data-from-X-to-Milvus-How-do-I-migrate-data-from-Standalone-to-Distributed-How-do-I-migrate-from-24x-to-25x" class="common-anchor-header">How do I migrate data from X to Milvus? How do I migrate data from Standalone to Distributed? How do I migrate from 2.4.x to 2.5.x?</h3><p>A new user commonly wants to get existing data into Milvus from another platform, including traditional search engines like <a href="https://docs.zilliz.com/docs/migrate-from-elasticsearch">Elasticsearch</a> and other vector databases like <a href="https://docs.zilliz.com/docs/migrate-from-pinecone">Pinecone</a> or <a href="https://docs.zilliz.com/docs/migrate-from-qdrant">Qdrant</a>. Existing users may also want to migrate their data from one Milvus deployment to another, or <a href="https://docs.zilliz.com/docs/migrate-from-milvus">from self-hosted Milvus to fully managed Zilliz Cloud</a>.</p>
<p>The <a href="https://github.com/zilliztech/vts">Vector Transport Service (VTS)</a> and the managed <a href="https://docs.zilliz.com/docs/migrations">Migration</a> service on Zilliz Cloud are designed for this purpose.</p>
<h3 id="How-do-I-save-and-load-data-backups-How-do-I-export-data-from-Milvus" class="common-anchor-header">How do I save and load data backups? How do I export data from Milvus?</h3><p>Milvus has a dedicated tool, <a href="https://github.com/zilliztech/milvus-backup">milvus-backup</a>, to take snapshots on permanent storage and restore them.</p>
<h2 id="Next-Steps" class="common-anchor-header">Next Steps<button data-href="#Next-Steps" class="anchor-icon" translate="no">
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
    </button></h2><p>I hope this has given you some pointers on how to tackle common challenges faced when building with a vector database. This definitely helped us to take another look at our documentation and feature roadmap to keep working on things that can help our community best succeed with Milvus. A key takeaway that I would like to emphasize, is that your choices put you within different points of a tradeoff space between compute, storage, latency, and recall. <em>You cannot maximize all of these performance criteria simultaneously - there is no “optimal” deployment. Yet, by understanding more about how vector search and distributed database systems work you can make an informed decision.</em></p>
<p>After trawling through the large number of posts from 2024, it got me thinking: why should a human do this? Has not Generative AI promised to solve such a task of crunching large amounts of text and extracting insight? Join me in the second part of this blog post (coming soon), where I investigate the design and implementation of <em>a multi-agent system for extracting insight from discussion forums.</em></p>
<p>Thanks again and hope to see you in the community <a href="https://milvus.io/discord">Discord</a> and our next <a href="https://lu.ma/unstructured-data-meetup">Unstructured Data</a> meetups. For more hands-on assistance, we welcome you to book a <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">1-on-1 office hour</a>. <em>Your feedback is essential to improving Milvus!</em></p>
