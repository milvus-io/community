---
id: what-milvus-taught-us-in-2024.md
title: 2024 年 Milvus 用户给我们的启示
author: Stefan Webb
date: 2025-02-18T00:00:00.000Z
desc: 在我们的 Discord 中查看有关 Milvus 的热门问题。
cover: assets.zilliz.com/What_Milvus_Users_Taught_Us_in_2024_db63863725.png
tag: Engineering
tags: null
recommend: true
canonicalUrl: 'https://milvus.io/blog/what-milvus-taught-us-in-2024.md'
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
    </button></h2><p>2024 年，Milvus 发布了多个重要版本，开源生态系统蓬勃发展，与此同时，我们的<a href="https://discord.gg/xwqmFDURcz">Discord</a> 社区也悄然形成了一个隐藏的用户洞察宝库。这些社区讨论汇编提供了一个独特的机会，让我们能够第一时间了解用户面临的挑战。我被这一尚未开发的资源所吸引，开始全面分析这一年来的每一个讨论主题，寻找可以帮助我们为 Milvus 用户编制常见问题资源的模式。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/top_image_6bbdbe8caa.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>通过分析，我发现用户经常寻求指导的三个主要领域：<strong>性能优化</strong>、<strong>部署策略</strong>和<strong>数据管理</strong>。用户经常讨论如何针对生产环境对 Milvus 进行微调，以及如何有效跟踪性能指标。在部署方面，社区努力选择适当的部署、选择最佳搜索索引，以及解决分布式设置中的问题。数据管理对话则围绕服务到服务的数据迁移策略和嵌入模型的选择展开。</p>
<p>下面让我们对这些领域逐一进行详细分析。</p>
<h2 id="Deployment" class="common-anchor-header">部署<button data-href="#Deployment" class="anchor-icon" translate="no">
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
<p>Milvus 提供灵活的部署模式，以适应各种使用情况。然而，一些用户发现，找到正确的选择具有挑战性，他们希望自己的选择是 "正确的"。</p>
<h3 id="Which-deployment-type-should-I-choose" class="common-anchor-header">我应该选择哪种部署类型？</h3><p>一个很常见的问题是从 Milvus<a href="https://milvus.io/docs/milvus_lite.md">Lite</a>、<a href="https://milvus.io/docs/prerequisite-docker.md">Standalone</a> 和<a href="https://milvus.io/docs/prerequisite-helm.md">Distributed</a> 中选择哪种部署方式。答案主要取决于你需要多大的向量数据库，以及它将提供多少流量：</p>
<h4 id="Milvus-Lite" class="common-anchor-header">Milvus Lite</h4><p>在本地系统上使用多达几百万个向量进行原型开发，或为单元测试和 CI/CD 寻找嵌入式向量数据库时，可以使用 Milvus Lite。需要注意的是，Milvus Lite 还不具备全文搜索等高级功能，但即将推出。</p>
<h4 id="Milvus-Standalone" class="common-anchor-header">Milvus 单机版</h4><p>如果你的系统需要为生产流量提供服务，或者你需要存储几百万到上亿个向量，你应该使用 Milvus Standalone，它将 Milvus 的所有组件打包到一个 Docker 镜像中。还有一种变体，它只是将其持久存储（minio）和元数据存储（etcd）的依赖关系作为单独的镜像取出。</p>
<h4 id="Milvus-Distributed" class="common-anchor-header">分布式 Milvus</h4><p>对于任何服务于生产流量的大规模部署，例如以数千 QPS 服务于数十亿向量，你应该使用 Milvus Distributed。有些用户可能希望大规模执行离线批量处理，例如重复数据删除或记录链接，而未来版本的 Milvus 3.0 将通过我们所称的向量湖提供更高效的处理方式。</p>
<h4 id="Fully-Managed-Service" class="common-anchor-header">全面托管服务</h4><p>对于希望专注于应用程序开发而无需担心 DevOps 的开发人员来说，<a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a>是提供免费层级的全面托管 Milvus。</p>
<p>更多信息，请参阅<a href="https://milvus.io/docs/install-overview.md#Choose-the-Right-Deployment-for-Your-Use-Case">"Milvus 部署概述"</a>。</p>
<h3 id="How-much-memory-storage-and-compute-will-I-require" class="common-anchor-header">我需要多少内存、存储和计算能力？</h3><p>这个问题经常出现，不仅是现有的 Milvus 用户，还有那些正在考虑 Milvus 是否适合其应用程序的用户。部署需要多少内存、存储空间和计算能力，取决于各种复杂因素的相互作用。</p>
<p>由于使用的模型不同，向量嵌入的维度也不同。而有些向量搜索索引完全存储在内存中，其他的则将数据存储到磁盘上。另外，很多搜索索引能够存储嵌入的压缩（量化）副本，需要额外的内存来存储图数据结构。以上只是影响内存和存储的几个因素。</p>
<h4 id="Milvus-Resource-Sizing-Tool" class="common-anchor-header">Milvus 资源大小工具</h4><p>幸运的是，Zilliz（Milvus 的维护团队）构建了<a href="https://milvus.io/tools/sizing">一个资源大小工具</a>，可以很好地回答这个问题。输入向量维度、索引类型、部署选项等信息，该工具就能估算出不同类型的 Milvus 节点及其依赖关系所需的 CPU、内存和存储空间。具体情况因人而异，因此最好使用自己的数据和样本流量进行实际负载测试。</p>
<h3 id="Which-vector-index-or-distance-metric-should-I-choose" class="common-anchor-header">我应该选择哪种向量索引或距离度量？</h3><p>许多用户不确定应该选择哪种索引以及如何设置超参数。首先，可以选择自动索引（AUTOINDEX），将索引类型的选择权交给 Milvus。不过，如果你想选择特定的索引类型，一些经验法则可以为你提供一个起点。</p>
<h4 id="In-Memory-Indexes" class="common-anchor-header">内存索引</h4><p>你是否愿意花钱将索引完全装入内存？内存索引通常最快，但也很昂贵。请参阅<a href="https://milvus.io/docs/index.md?tab=floating">"内存索引"</a>，了解 Milvus 支持的<a href="https://milvus.io/docs/index.md?tab=floating">索引</a>列表，以及它们在延迟、内存和调用方面的权衡。</p>
<p>请记住，索引大小不仅仅是向量数量乘以其维度和浮点大小那么简单。大多数索引会量化向量以减少内存使用量，但需要内存来存储额外的数据结构。其他非向量数据（标量）及其索引也会占用内存空间。</p>
<h4 id="On-Disk-Indexes" class="common-anchor-header">磁盘索引</h4><p>当内存无法容纳索引时，可以使用 Milvus 提供的<a href="https://milvus.io/docs/disk_index.md">"盘上索引"</a>。<a href="https://milvus.io/docs/disk_index.md">DiskANN</a>和<a href="https://milvus.io/docs/mmap.md#MMap-enabled-Data-Storage">MMap</a> 是延迟/资源权衡非常不同的两种选择。</p>
<p>DiskANN 在内存中存储向量的高度压缩副本，在磁盘上存储未压缩的向量和图搜索结构。它利用一些巧妙的想法来搜索向量空间，同时尽量减少磁盘读取，并利用固态硬盘的快速随机存取速度。为了将延迟降到最低，固态硬盘必须通过 NVMe 而不是 SATA 连接，以获得最佳 I/O 性能。</p>
<p>从技术上讲，MMap 并不是一种索引类型，而是指使用虚拟内存和内存索引。有了虚拟内存，页面可以根据需要在磁盘和内存之间交换，这样，如果访问模式是每次只使用一小部分数据，就可以有效地使用大得多的索引。</p>
<p>DiskANN 具有出色而稳定的延迟。MMap 在内存中访问页面时的延迟甚至更好，但频繁的页面交换会导致延迟峰值。因此，根据内存访问模式的不同，MMap 的延迟变化会更大。</p>
<h4 id="GPU-Indexes" class="common-anchor-header">GPU 索引</h4><p>第三种选择是<a href="https://milvus.io/docs/gpu_index.md">使用 GPU 内存和计算</a>构建<a href="https://milvus.io/docs/gpu_index.md">索引</a>。Milvus 的 GPU 支持由 Nvidia<a href="https://rapids.ai/">RAPIDS</a>团队提供。GPU 向量搜索的延迟可能低于相应的 CPU 搜索，不过通常需要数百或数千个搜索 QPS 才能充分利用 GPU 的并行性。此外，GPU 的内存通常小于 CPU RAM，运行成本也更高。</p>
<h4 id="Distance-Metrics" class="common-anchor-header">距离度量</h4><p>一个更容易回答的问题是，应该选择哪种距离度量来衡量向量之间的相似性。建议选择与嵌入模型训练时相同的距离度量，通常是 COSINE（或输入归一化后的 IP）。您的模型来源（例如 HuggingFace 上的模型页面）会说明使用了哪种距离度量。Zilliz 还提供了一个方便查找的<a href="https://zilliz.com/ai-models">表格</a>。</p>
<p>总而言之，我认为索引选择的不确定性很大程度上取决于这些选择如何影响部署的延迟/资源使用/调用权衡的不确定性。我建议使用上述经验法则来决定内存索引、磁盘索引或 GPU 索引，然后使用 Milvus 文档中给出的权衡指南来选择特定的索引。</p>
<h3 id="Can-you-fix-my-broken-Milvus-Distributed-deployment" class="common-anchor-header">你们能修复我损坏的 Milvus Distributed 部署吗？</h3><p>许多问题都围绕着Milvus Distributed部署的启动和运行问题，包括配置、工具和调试日志。很难给出一个单一的解决方案，因为每个问题似乎都与上一个问题不同，不过幸运的是，Milvus 有<a href="https://milvus.io/discord">一个活跃的 Discord</a>，您可以在那里寻求帮助，我们还提供<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">与专家一对一的办公时间</a>。</p>
<h3 id="How-do-I-deploy-Milvus-on-Windows" class="common-anchor-header">如何在 Windows 上部署 Milvus？</h3><p>如何在 Windows 机器上部署 Milvus 是一个多次出现的问题。根据大家的反馈，我们重写了相关文档：请参阅<a href="https://milvus.io/docs/install_standalone-windows.md">在 Docker（Windows）中运行 Milvus</a>，了解如何使用<a href="https://learn.microsoft.com/en-us/windows/wsl/about#what-is-wsl-2">Windows Subsystem for Linux 2 (WSL2)</a>。</p>
<h2 id="Performance-and-Profiling" class="common-anchor-header">性能和剖析<button data-href="#Performance-and-Profiling" class="anchor-icon" translate="no">
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
<p>在选择了部署类型并开始运行后，用户希望对自己做出的最佳决策感到放心，并希望对部署的性能和状态进行剖析。许多问题都与如何剖析性能、观察状态以及深入了解原因有关。</p>
<h3 id="How-do-I-measure-performance" class="common-anchor-header">如何衡量性能？</h3><p>用户希望检查与部署性能相关的指标，以便了解并解决瓶颈问题。提到的指标包括平均查询延迟、延迟分布、查询量、内存使用、磁盘存储等。使用<a href="https://milvus.io/docs/monitor_overview.md">传统的监控系统</a>获取这些指标一直是个挑战，而 Milvus 2.5 引入了一个名为<a href="https://milvus.io/docs/milvus-webui.md#Milvus-WebUI">WebUI</a>的新系统（欢迎反馈！），让您可以从一个用户友好的 Web 界面获取所有这些信息。</p>
<h3 id="What’s-happening-inside-Milvus-right-now-ie-observe-state" class="common-anchor-header">Milvus 内部现在正在发生什么（即观察状态）？</h3><p>与此相关的是，用户希望观察其部署的内部状态。提出的问题包括了解为什么建立搜索索引需要这么长时间、如何确定集群是否健康，以及了解查询是如何跨节点执行的。新的<a href="https://milvus.io/docs/milvus-webui.md#Milvus-WebUI">WebUI</a>可以透明地显示系统的内部运行情况，从而回答其中的许多问题。</p>
<h3 id="How-does-some-complex-aspect-of-the-internals-work" class="common-anchor-header">内部的某些（复杂）方面是如何工作的？</h3><p>高级用户通常希望对 Milvus 的内部结构有一定的了解，例如，了解段的密封或内存管理。其根本目的通常是为了提高性能，有时是为了调试问题。文档，尤其是 &quot;概念 &quot;和 &quot;管理指南 &quot;部分的文档在这方面很有帮助，例如，请参阅<a href="https://milvus.io/docs/architecture_overview.md">&quot;Milvus 架构概述 &quot;</a>和<a href="https://milvus.io/docs/clustering-compaction.md">&quot;集群压缩 &quot;</a>页面<a href="https://milvus.io/docs/clustering-compaction.md">。</a>我们将继续改进 Milvus 内部文档，使其更易于理解，并欢迎通过<a href="https://milvus.io/discord">Discord</a> 提出任何反馈或要求。</p>
<h3 id="Which-embedding-model-should-I-choose" class="common-anchor-header">我应该选择哪种 Embeddings 模型？</h3><p>在见面会、办公时间和 Discord 上多次出现的一个与性能有关的问题是如何选择嵌入模型。这是一个很难给出明确答案的问题，不过我们建议从默认模型（如<a href="https://huggingface.co/sentence-transformers/all-MiniLM-L6-v2">all-MiniLM-L6-v2</a>）开始。</p>
<p>与搜索索引的选择类似，计算、存储和召回之间也存在权衡。在其他条件相同的情况下，输出维度越大的嵌入模型所需的存储空间就越大，不过相关项目的召回率可能会更高。对于固定维度而言，较大的嵌入模型通常在召回率方面优于较小的模型，但代价是计算量和时间的增加。对嵌入模型性能进行排名的排行榜（如<a href="https://huggingface.co/spaces/mteb/leaderboard">MTEB</a>）所依据的基准可能与您的特定数据和任务不一致。</p>
<p>因此，考虑 "最佳 "嵌入模型是没有意义的。首先要选择一个具有可接受的召回率，并能满足计算嵌入所需的计算量和时间预算的模型。进一步的优化工作，如对数据进行微调，或根据经验探索计算/召回的权衡，可以推迟到系统投入使用后再进行。</p>
<h2 id="Data-Management" class="common-anchor-header">数据管理<button data-href="#Data-Management" class="anchor-icon" translate="no">
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
<p>如何将数据移入和移出 Milvus 部署是 Discord 讨论的另一个主题，这并不奇怪，因为这项任务是将应用程序投入生产的核心。</p>
<h3 id="How-do-I-migrate-data-from-X-to-Milvus-How-do-I-migrate-data-from-Standalone-to-Distributed-How-do-I-migrate-from-24x-to-25x" class="common-anchor-header">如何将数据从 X 迁移到 Milvus？如何将数据从单机版迁移到分布式系统？如何从 2.4.x 迁移到 2.5.x？</h3><p>新用户通常希望将现有数据从其他平台导入 Milvus，包括传统搜索引擎（如<a href="https://docs.zilliz.com/docs/migrate-from-elasticsearch">Elasticsearch</a>）和其他向量数据库（如<a href="https://docs.zilliz.com/docs/migrate-from-pinecone">Pinecone</a>或<a href="https://docs.zilliz.com/docs/migrate-from-qdrant">Qdrant</a>）。现有用户也可能希望将数据从一个 Milvus 部署迁移到另一个部署，或<a href="https://docs.zilliz.com/docs/migrate-from-milvus">从自托管的 Milvus</a> 迁移<a href="https://docs.zilliz.com/docs/migrate-from-milvus">到完全托管的 Zilliz Cloud</a>。</p>
<p><a href="https://github.com/zilliztech/vts">向量传输服务（VTS）</a>和 Zilliz Cloud 上的托管<a href="https://docs.zilliz.com/docs/migrations">迁移</a> <a href="https://github.com/zilliztech/vts">服务</a>就是为此目的而设计的。</p>
<h3 id="How-do-I-save-and-load-data-backups-How-do-I-export-data-from-Milvus" class="common-anchor-header">如何保存和加载数据备份？如何从 Milvus 导出数据？</h3><p>Milvus 有一个专门的工具--<a href="https://github.com/zilliztech/milvus-backup">milvus-backup</a>，可以在永久存储上拍摄快照并还原。</p>
<h2 id="Next-Steps" class="common-anchor-header">下一步<button data-href="#Next-Steps" class="anchor-icon" translate="no">
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
    </button></h2><p>我希望这篇文章能给你一些提示，让你知道如何应对使用向量数据库构建时面临的常见挑战。这无疑有助于我们重新审视我们的文档和功能路线图，继续努力，帮助我们的社区更好地使用 Milvus。我想强调的一个重要启示是，你的选择会让你在计算、存储、延迟和调用之间的不同点上做出取舍。<em>你不可能同时最大限度地提高所有这些性能标准，因此不存在 "最佳 "部署。然而，通过进一步了解向量搜索和分布式数据库系统的工作原理，你就能做出明智的决定。</em></p>
<p>在浏览了大量来自 2024 年的帖子后，我开始思考：为什么要由人来做这件事？难道生成式人工智能没有承诺解决这种压缩大量文本并提取洞察力的任务吗？请跟我一起看这篇博文的第二部分（即将推出），在这一部分中，我将研究<em>从论坛中提取洞察力的多 Agents 系统</em>的设计与实现<em>。</em></p>
<p>再次感谢，希望能在社区<a href="https://milvus.io/discord">讨论区</a>和下一次<a href="https://lu.ma/unstructured-data-meetup">非结构化数据</a>会议上见到您。如需更多实际帮助，我们欢迎您预约<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">1 对 1 办公时间</a>。<em>您的反馈对改进 Milvus 至关重要！</em></p>
