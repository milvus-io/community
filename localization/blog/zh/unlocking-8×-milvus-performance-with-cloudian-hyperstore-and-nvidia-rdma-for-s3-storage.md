---
id: >-
  unlocking-8×-milvus-performance-with-cloudian-hyperstore-and-nvidia-rdma-for-s3-storage.md
title: 利用 Cloudian HyperStore 和英伟达 RDMA 为 S3 存储释放 8× milvus 性能
author: Jon Toor
date: 2025-11-17T00:00:00.000Z
cover: assets.zilliz.com/cloudian_b7531febff.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Cloudian, NVIDIA, RDMA for S3-compatible storage, Milvus'
meta_title: 8× Milvus Boost with Cloudian HyperStore and NVIDIA RDMA
desc: Cloudian 和英伟达™（NVIDIA®）为 S3 兼容型存储推出 RDMA，以低延迟加速人工智能工作负载，使 Milvus 的性能提升 8 倍。
origin: >-
  https://cloudian.com/blog/cloudian-deploys-new-nvidia-rdma-for-s3-compatible-storage-a-game-changer-for-ai-storage-performance/
---
<p><em>本文章最初发布于<a href="https://cloudian.com/blog/cloudian-deploys-new-nvidia-rdma-for-s3-compatible-storage-a-game-changer-for-ai-storage-performance/">Cloudian</a>网站，现经授权在此转发。</em></p>
<p>Cloudian 与英伟达™（NVIDIA®）合作，利用其 13 年多的 S3 API 实施经验，在其 HyperStore® 解决方案中添加了对 S3 兼容存储的 RDMA 支持。作为一个基于S3-API的并行处理架构平台，Cloudian具有得天独厚的优势，既能为这项技术的发展做出贡献，又能充分利用这项技术。此次合作充分利用了Cloudian在对象存储协议方面的深厚专业知识以及英伟达™（NVIDIA®）在计算和网络加速方面的领先地位，从而打造出一款将高性能计算与企业级存储无缝集成的解决方案。</p>
<p>英伟达™（NVIDIA®）宣布即将全面推出兼容S3存储的RDMA（远程直接内存访问）技术，这是人工智能基础架构发展的一个重要里程碑。这项突破性技术有望改变企业处理现代人工智能工作负载的海量数据需求的方式，在保持可扩展性和简易性的同时实现前所未有的性能提升，而这正是 S3 兼容对象存储成为云计算基础的原因。</p>
<h2 id="What-is-RDMA-for-S3-compatible-storage" class="common-anchor-header">什么是 S3 兼容存储的 RDMA？<button data-href="#What-is-RDMA-for-S3-compatible-storage" class="anchor-icon" translate="no">
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
    </button></h2><p>这项技术的推出标志着存储系统与人工智能加速器通信方式的根本性进步。该技术实现了兼容 S3 API 的对象存储与 GPU 内存之间的直接数据传输，完全绕过了传统的以 CPU 为媒介的数据路径。与传统的存储架构不同，传统的存储架构通过 CPU 和系统内存进行所有数据传输，从而造成瓶颈和延迟，而 S3 兼容存储的 RDMA 则建立了一条从存储到 GPU 的直接高速公路。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/RDMA_for_S3_compatible_storage_18fdd69d02.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>这项技术的核心是消除中间环节，通过直接途径减少延迟，大幅降低 CPU 处理需求，并显著降低功耗。因此，存储系统能以现代 GPU 所需的速度提供数据，满足要求苛刻的人工智能应用的需要。</p>
<p>该技术在增加高性能数据通道的同时，保持了与无处不在的 S3 API 的兼容性。命令仍通过基于 S3-API 的标准存储协议发出，但实际数据传输是通过 RDMA 直接传输到 GPU 内存，完全绕过了 CPU，消除了 TCP 协议处理的开销。</p>
<h2 id="Breakthrough-Performance-Results" class="common-anchor-header">突破性的性能结果<button data-href="#Breakthrough-Performance-Results" class="anchor-icon" translate="no">
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
    </button></h2><p>RDMA 为 S3 兼容存储带来的性能提升堪称变革性的。实际测试证明，该技术能够消除制约人工智能工作负载的存储 I/O 瓶颈。</p>
<h3 id="Dramatic-Speed-Improvements" class="common-anchor-header">速度大幅提升：</h3><ul>
<li><p>测得<strong>每节点吞吐量</strong>（读取）为<strong>35 GB/秒</strong>，可在集群间线性扩展</p></li>
<li><p>借助 Cloudian 的并行处理架构<strong>，可扩展至 TBs/s</strong></p></li>
<li><p>与传统的基于 TCP 的对象存储相比，<strong>吞吐量提高了 3-5 倍</strong></p></li>
</ul>
<h3 id="Resource-Efficiency-Gains" class="common-anchor-header">资源效率提升：</h3><ul>
<li><p>通过建立直接连接 GPU 的数据通道，<strong>CPU 利用率降低 90</strong></p></li>
<li><p>消除瓶颈，<strong>提高 GPU 利用率</strong></p></li>
<li><p>通过减少处理开销大幅降低功耗</p></li>
<li><p>降低人工智能存储成本</p></li>
</ul>
<h3 id="8X-Performance-Boost-on-Milvus-by-Zilliz-Vector-DB" class="common-anchor-header">通过 Zilliz 向量 DB 在 Milvus 上实现 8 倍性能提升</h3><p>这些性能提升在向量数据库操作中尤为明显，Cloudian 与 Zilliz 合作使用<a href="https://developer.nvidia.com/cuvs">英伟达 cuVS</a>和<a href="https://www.nvidia.com/en-us/data-center/l40s/">英伟达 L40S GPU</a>，与基于 CPU 的系统和基于 TCP 的数据传输相比，<strong>Milvus Operator 操作的性能提升了 8 倍</strong>。这代表着从存储成为制约因素到存储使人工智能应用充分发挥潜力的根本性转变。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/vector_indexing_time_354bdd4b46.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Why-S3-API-based-Object-Storage-for-AI-Workloads" class="common-anchor-header">为什么要将基于 S3 API 的对象存储用于人工智能工作负载<button data-href="#Why-S3-API-based-Object-Storage-for-AI-Workloads" class="anchor-icon" translate="no">
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
    </button></h2><p>RDMA 技术与对象存储架构的融合为人工智能基础架构奠定了理想的基础，解决了制约传统存储方法的多重挑战。</p>
<p><strong>针对人工智能数据爆炸的超大规模可扩展性：</strong>人工智能工作负载，尤其是那些涉及合成数据和多模式数据的工作负载，正在将存储需求推向 100 PB 甚至更高的范围。对象存储的扁平地址空间可从PB级无缝扩展到EB级，可适应人工智能训练数据集的指数级增长，而不会受到基于文件系统的分级限制。</p>
<p><strong>完整人工智能工作流的统一平台：</strong>现代人工智能操作涵盖数据摄取、清理、训练、检查点和推理，每个操作都有不同的性能和容量要求。与 S3 兼容的对象存储通过一致的 API 访问支持整个范围，消除了管理多个存储层的复杂性和成本。训练数据、模型、检查点文件和推理数据集都可以驻留在单一的高性能数据湖中。</p>
<p><strong>为人工智能操作提供丰富的元数据：</strong>关键的人工智能操作（如搜索和枚举）从根本上说是由元数据驱动的。对象存储丰富的可定制元数据功能可实现高效的数据标记、搜索和管理，这对于在复杂的人工智能模型训练和推理工作流中组织和检索数据至关重要。</p>
<p><strong>经济和操作符优势：</strong>与文件存储替代方案相比，兼容 S3 的对象存储利用行业标准硬件以及独立的容量和性能扩展，可将总拥有成本最多降低 80%。随着人工智能数据集达到企业级规模，这种经济效益变得至关重要。</p>
<p><strong>企业安全与治理：</strong>与需要进行内核级修改的 GPUDirect 实现不同，兼容 S3 存储的 RDMA 无需对特定供应商的内核进行修改，从而维护了系统的安全性和合规性。这种方法在医疗保健和金融等行业尤为重要，因为这些行业对数据安全性和法规合规性要求极高。</p>
<h2 id="The-Road-Ahead" class="common-anchor-header">未来之路<button data-href="#The-Road-Ahead" class="anchor-icon" translate="no">
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
    </button></h2><p>英伟达宣布 RDMA for S3 兼容型存储全面上市不仅仅是一个技术里程碑，它还标志着人工智能基础架构的成熟。通过将对象存储的无限可扩展性与GPU直接访问的突破性性能相结合，企业终于可以建立起能够随其雄心壮志而扩展的人工智能基础架构。</p>
<p>随着人工智能工作负载的复杂性和规模不断增长，兼容 S3 的 RDMA 存储为企业提供了存储基础，使其能够最大限度地利用人工智能投资，同时保持数据主权和操作的简便性。该技术将存储从瓶颈转变为推动力，让人工智能应用在企业级规模上充分发挥潜力。</p>
<p>对于规划其人工智能基础架构路线图的企业来说，RDMA for S3 兼容型存储的全面上市标志着一个新时代的开始，在这个时代，存储性能将真正满足现代人工智能工作负载的需求。</p>
<h2 id="Industry-Perspectives" class="common-anchor-header">行业视角<button data-href="#Industry-Perspectives" class="anchor-icon" translate="no">
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
    </button></h2><p>随着人工智能日益成为医疗保健服务的核心，我们不断寻求提高基础设施的性能和效率。英伟达™（NVIDIA®）和 Cloudian 推出的全新 RDMA for S3 兼容型存储对于我们的医疗成像分析和人工智能诊断应用至关重要，在这些应用中，快速处理大型数据集可直接影响患者护理，同时降低在基于 S3-API 的存储设备和基于 SSD 的 NAS 存储设备之间移动数据的成本。  -<em>Swapnil Rane 博士医学博士、DNB、PDCC（肾病学）、Mres（中医）、肿瘤学研究员、FRCPath 病理学教授（F）、塔塔纪念中心数字与计算肿瘤学系 AI/Computational Pathology And Imaging Lab OIC 首席科学家</em></p>
<p>"英伟达™（NVIDIA®）发布的兼容S3的RDMA证实了我们基于Cloudian的人工智能基础架构战略的价值。我们使企业能够大规模运行高性能人工智能，同时保留S3 API兼容性，从而保持迁移简单和应用开发成本低廉。"-<em>Yotta Data Services 联合创始人、董事总经理兼首席执行官（CEO）Sunil Gupta</em></p>
<p>"在我们扩展本地部署能力以提供主权人工智能的过程中，英伟达的RDMA for S3兼容存储技术和Cloudian的高性能对象存储为我们提供了所需的性能，同时不影响数据驻留，也不需要任何内核级修改。Cloudian HyperStore 平台可以让我们将敏感的人工智能数据完全置于我们的控制之下，并将其扩展到数亿字节。-<em>Kakao 执行副总裁兼云计算主管 Logan Lee</em></p>
<p>"英伟达宣布即将发布RDMA for S3兼容存储GA，我们对此感到非常兴奋。我们与Cloudian的测试显示，向量数据库操作的性能提升高达8倍，这将让我们的Milvus by Zilliz用户在保持完全数据主权的同时，为要求苛刻的AI工作负载实现云规模性能。"-<em>Zilliz 创始人兼首席执行官 Charles Xie</em></p>
