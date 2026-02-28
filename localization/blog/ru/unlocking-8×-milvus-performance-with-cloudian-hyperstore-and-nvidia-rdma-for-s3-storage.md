---
id: >-
  unlocking-8×-milvus-performance-with-cloudian-hyperstore-and-nvidia-rdma-for-s3-storage.md
title: >
  Unlocking 8× Milvus Performance with Cloudian HyperStore and NVIDIA RDMA for
  S3 Storage
author: Jon Toor
date: 2025-11-17T00:00:00.000Z
cover: assets.zilliz.com/cloudian_931ffc8646.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Cloudian, NVIDIA, RDMA for S3-compatible storage, Milvus'
meta_title: 8× Milvus Boost with Cloudian HyperStore and NVIDIA RDMA
desc: >-
  Cloudian and NVIDIA introduce RDMA for S3-compatible storage, accelerating AI
  workloads with low latency and enabling an 8× performance boost in  Milvus.
origin: >-
  https://cloudian.com/blog/cloudian-deploys-new-nvidia-rdma-for-s3-compatible-storage-a-game-changer-for-ai-storage-performance/
---
<p><em>This post was originally published on <a href="https://cloudian.com/blog/cloudian-deploys-new-nvidia-rdma-for-s3-compatible-storage-a-game-changer-for-ai-storage-performance/">Cloudian</a> and is reposted here with permission.</em></p>
<p>Cloudian has collaborated with NVIDIA to add support for RDMA for S3-compatible storage to its HyperStore® solution, drawing on its 13+ years of experience in S3 API implementation. As an S3-API based platform with parallel processing architecture, Cloudian is uniquely suited to both contribute to and capitalize on the development of this technology. This collaboration leverages Cloudian’s deep expertise in object storage protocols and NVIDIA’s leadership in compute and network acceleration to create a solution that seamlessly integrates high-performance computing with enterprise-scale storage.</p>
<p>NVIDIA has announced the upcoming general availability of RDMA for S3-compatible storage (Remote Direct Memory Access) technology, marking a significant milestone in AI infrastructure evolution. This breakthrough technology promises to transform how organizations handle the massive data requirements of modern AI workloads, delivering unprecedented performance improvements while maintaining the scalability and simplicity that has made S3-compatible object storage the foundation of cloud computing.</p>
<h2 id="What-is-RDMA-for-S3-compatible-storage" class="common-anchor-header">What is RDMA for S3-compatible storage?<button data-href="#What-is-RDMA-for-S3-compatible-storage" class="anchor-icon" translate="no">
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
    </button></h2><p>This launch represents a fundamental advancement in how storage systems communicate with AI accelerators. The technology enables direct data transfers between S3 API-compatible object storage and GPU memory, completely bypassing traditional CPU-mediated data paths. Unlike conventional storage architectures that route all data transfers through the CPU and system memory—creating bottlenecks and latency—RDMA for S3-compatible storage establishes a direct highway from storage to GPU.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/RDMA_for_S3_compatible_storage_18fdd69d02.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>At its core, this technology eliminates intermediate steps with a direct pathway that reduces latency, dramatically cuts CPU processing demands, and significantly reduces power consumption. The result is storage systems that can deliver data at the speed modern GPUs require for demanding AI applications.</p>
<p>The technology maintains compatibility with the ubiquitous S3 APIs while adding this high-performance data path. Commands are still issued through standard S3-API based storage protocols, but the actual data transfer occurs via RDMA directly to GPU memory, bypassing the CPU entirely and eliminating the overhead of TCP protocol processing.</p>
<h2 id="Breakthrough-Performance-Results" class="common-anchor-header">Breakthrough Performance Results<button data-href="#Breakthrough-Performance-Results" class="anchor-icon" translate="no">
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
    </button></h2><p>The performance improvements delivered by RDMA for S3-compatible storage are nothing short of transformational. Real-world testing demonstrates the technology’s ability to eliminate storage I/O bottlenecks that constrain AI workloads.</p>
<h3 id="Dramatic-Speed-Improvements" class="common-anchor-header">Dramatic Speed Improvements:</h3><ul>
<li><p><strong>35 GB/s per node throughput</strong> (reads) measured, with linear scalability across clusters</p></li>
<li><p><strong>Scalability to TBs/s</strong> with Cloudian’s parallel processing architecture</p></li>
<li><p><strong>3-5x throughput improvement</strong> compared to conventional TCP-based object storage</p></li>
</ul>
<h3 id="Resource-Efficiency-Gains" class="common-anchor-header">Resource Efficiency Gains:</h3><ul>
<li><p><strong>90% reduction in CPU utilization</strong> by establishing direct data pathways to GPUs</p></li>
<li><p><strong>Increase GPU utilization</strong> with bottlenecks eliminated</p></li>
<li><p>Dramatic reduction in power consumption through reduced processing overhead</p></li>
<li><p>Cost reductions for AI storage</p></li>
</ul>
<h3 id="8X-Performance-Boost-on-Milvus-by-Zilliz-Vector-DB" class="common-anchor-header">8X Performance Boost on Milvus by Zilliz Vector DB</h3><p>These performance improvements are particularly evident in vector database operations, where collaboration between Cloudian and Zilliz using <a href="https://developer.nvidia.com/cuvs">NVIDIA cuVS</a> and <a href="https://www.nvidia.com/en-us/data-center/l40s/">NVIDIA L40S GPUs</a> demonstrated an <strong>8x performance boost in Milvus operations</strong> when compared with CPU-based systems and TCP-based data transfer. This represents a fundamental shift from storage being a constraint to storage enabling AI applications to achieve their full potential.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/vector_indexing_time_354bdd4b46.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Why-S3-API-based-Object-Storage-for-AI-Workloads" class="common-anchor-header">Why S3 API-based Object Storage for AI Workloads<button data-href="#Why-S3-API-based-Object-Storage-for-AI-Workloads" class="anchor-icon" translate="no">
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
    </button></h2><p>The convergence of RDMA technology  with object storage architecture creates the ideal foundation for AI infrastructure, addressing multiple challenges that have constrained traditional storage approaches.</p>
<p><strong>Exabyte Scalability for AI’s Data Explosion:</strong> AI workloads, particularly those involving synthetic and multi-modal data, are pushing storage requirements into the 100-petabyte range and beyond. Object storage’s flat address space scales seamlessly from petabytes to exabytes, accommodating the exponential growth in AI training datasets without the hierarchical limitations that constrain file-based systems.</p>
<p><strong>Unified Platform for Complete AI Workflows:</strong> Modern AI operations span data ingestion, cleansing, training, checkpointing, and inference—each with distinct performance and capacity requirements. S3-compatible object storage supports this entire spectrum through consistent API access, eliminating the complexity and cost of managing multiple storage tiers. Training data, models, checkpoint files, and inference datasets can all reside in a single, high-performance data lake.</p>
<p><strong>Rich Metadata for AI Operations:</strong> Critical AI operations like search and enumeration are fundamentally metadata-driven. Object storage’s rich, customizable metadata capabilities enable efficient data tagging, searching, and management—essential for organizing and retrieving data in complex AI model training and inference workflows.</p>
<p><strong>Economic and Operational Advantages:</strong> S3-compatible object storage delivers up to 80% lower total cost of ownership compared to file storage alternatives, leveraging industry-standard hardware and independent scaling of capacity and performance. This economic efficiency becomes crucial as AI datasets reach enterprise scale.</p>
<p><strong>Enterprise Security and Governance:</strong> Unlike GPUDirect implementations that require kernel-level modifications, RDMA for S3-compatible storage requires no vendor-specific kernel changes, maintaining system security and regulatory compliance. This approach is particularly valuable in sectors like healthcare and finance where data security and regulatory compliance are paramount.</p>
<h2 id="The-Road-Ahead" class="common-anchor-header">The Road Ahead<button data-href="#The-Road-Ahead" class="anchor-icon" translate="no">
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
    </button></h2><p>NVIDIA’s announcement of RDMA for S3-compatible storage general availability represents more than a technological milestone—it signals the maturation of AI infrastructure architecture. By combining the limitless scalability of object storage with the breakthrough performance of direct GPU access, organizations can finally build AI infrastructures that scale with their ambitions.</p>
<p>As AI workloads continue to grow in complexity and scale, RDMA for S3-compatible storage provides the storage foundation that enables organizations to maximize their AI investments while maintaining data sovereignty and operational simplicity. The technology transforms storage from a bottleneck into an enabler, allowing AI applications to achieve their full potential at enterprise scale.</p>
<p>For organizations planning their AI infrastructure roadmap, the general availability of RDMA for S3-compatible storage marks the beginning of a new era where storage performance truly matches the demands of modern AI workloads.</p>
<h2 id="Industry-Perspectives" class="common-anchor-header">Industry Perspectives<button data-href="#Industry-Perspectives" class="anchor-icon" translate="no">
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
    </button></h2><p>As AI becomes increasingly central to healthcare delivery, we continuously seek to boost the performance and efficiency of our infrastructure. The new RDMA for S3-compatible storage from NVIDIA and Cloudian will be critical for our medical imaging analysis and diagnostic AI applications, where processing large datasets quickly can directly impact patient care, while reducing costs of moving data between S3-API based storage devices and SSD based NAS storages.  – <em>Dr. Swapnil Rane MD, DNB, PDCC (Nephropath), Mres (TCM), Fellowship in Oncopath, FRCPath Professor (F) of Pathology, PI, AI/Computational Pathology And Imaging Lab OIC- Department of Digital and Computational Oncology, Tata Memorial Centre</em></p>
<p>“NVIDIA’s RDMA for S3-compatible announcement confirms the value of our Cloudian-based AI infrastructure strategy. We enable organizations to run high-performance AI at scale while preserving S3 API compatibility that keeps migration simple and application development costs low.” – <em>Sunil Gupta, Co-founder, Managing Director &amp; Chief Executive Officer (CEO), Yotta Data Services</em></p>
<p>“As we expand our on-premises capabilities to deliver sovereign AI, NVIDIA’s RDMA for S3-compatible storage technology and Cloudian’s high-performance object storage give us the performance we need without compromising data residency and without requiring any kernel-level modifications. The Cloudian HyperStore platform lets us scale to exabytes while keeping our sensitive AI data completely under our control.” – <em>Logan Lee, EVP &amp; Head of Cloud, Kakao</em></p>
<p>“We’re excited about NVIDIA’s announcement of the upcoming RDMA for S3-compatible storage GA release. Our testing with Cloudian showed up to 8X performance improvement for vector database operations, which will let our Milvus by Zilliz users achieve cloud-scale performance for demanding AI workloads while maintaining complete data sovereignty.” – <em>Charles Xie, Founder and CEO of Zilliz</em></p>
