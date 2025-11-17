---
id: unlocking-8×-milvus-performance-with-cloudian-hyperstore-and-nvidia-rdma-for-s3-storage.md
title: >
 Unlocking 8× Milvus Performance with Cloudian HyperStore and NVIDIA RDMA for S3 Storage
author: Jon Toor
date: 2025-11-17
cover: assets.zilliz.com/claodian_ab0da73e3f.png
tag: Engineering
recommend: false
publishToMedium: true
tags: Milvus, vector database
meta_keywords: Cloudian, NVIDIA, RDMA for S3-compatible storage, Milvus
meta_title: 8× Milvus Boost with Cloudian HyperStore and NVIDIA RDMA
desc: Cloudian and NVIDIA introduce RDMA for S3-compatible storage, accelerating AI workloads with low latency and enabling an 8× performance boost in  Milvus.
origin: https://cloudian.com/blog/cloudian-deploys-new-nvidia-rdma-for-s3-compatible-storage-a-game-changer-for-ai-storage-performance/
---

*This post was originally published on [Cloudian](https://cloudian.com/blog/cloudian-deploys-new-nvidia-rdma-for-s3-compatible-storage-a-game-changer-for-ai-storage-performance/) and is reposted here with permission.*

Cloudian has collaborated with NVIDIA to add support for RDMA for S3-compatible storage to its HyperStore® solution, drawing on its 13+ years of experience in S3 API implementation. As an S3-API based platform with parallel processing architecture, Cloudian is uniquely suited to both contribute to and capitalize on the development of this technology. This collaboration leverages Cloudian’s deep expertise in object storage protocols and NVIDIA’s leadership in compute and network acceleration to create a solution that seamlessly integrates high-performance computing with enterprise-scale storage.

NVIDIA has announced the upcoming general availability of RDMA for S3-compatible storage (Remote Direct Memory Access) technology, marking a significant milestone in AI infrastructure evolution. This breakthrough technology promises to transform how organizations handle the massive data requirements of modern AI workloads, delivering unprecedented performance improvements while maintaining the scalability and simplicity that has made S3-compatible object storage the foundation of cloud computing.

## What is RDMA for S3-compatible storage?

This launch represents a fundamental advancement in how storage systems communicate with AI accelerators. The technology enables direct data transfers between S3 API-compatible object storage and GPU memory, completely bypassing traditional CPU-mediated data paths. Unlike conventional storage architectures that route all data transfers through the CPU and system memory—creating bottlenecks and latency—RDMA for S3-compatible storage establishes a direct highway from storage to GPU.

![](https://assets.zilliz.com/RDMA_for_S3_compatible_storage_18fdd69d02.webp)

At its core, this technology eliminates intermediate steps with a direct pathway that reduces latency, dramatically cuts CPU processing demands, and significantly reduces power consumption. The result is storage systems that can deliver data at the speed modern GPUs require for demanding AI applications.

The technology maintains compatibility with the ubiquitous S3 APIs while adding this high-performance data path. Commands are still issued through standard S3-API based storage protocols, but the actual data transfer occurs via RDMA directly to GPU memory, bypassing the CPU entirely and eliminating the overhead of TCP protocol processing.

## Breakthrough Performance Results

The performance improvements delivered by RDMA for S3-compatible storage are nothing short of transformational. Real-world testing demonstrates the technology’s ability to eliminate storage I/O bottlenecks that constrain AI workloads.

### Dramatic Speed Improvements:

- **35 GB/s per node throughput** (reads) measured, with linear scalability across clusters

- **Scalability to TBs/s** with Cloudian’s parallel processing architecture

- **3-5x throughput improvement** compared to conventional TCP-based object storage

### Resource Efficiency Gains:

- **90% reduction in CPU utilization** by establishing direct data pathways to GPUs

- **Increase GPU utilization** with bottlenecks eliminated

- Dramatic reduction in power consumption through reduced processing overhead

- Cost reductions for AI storage

### 8X Performance Boost on Milvus by Zilliz Vector DB

These performance improvements are particularly evident in vector database operations, where collaboration between Cloudian and Zilliz using [NVIDIA cuVS](https://developer.nvidia.com/cuvs) and [NVIDIA L40S GPUs](https://www.nvidia.com/en-us/data-center/l40s/) demonstrated an **8x performance boost in Milvus operations** when compared with CPU-based systems and TCP-based data transfer. This represents a fundamental shift from storage being a constraint to storage enabling AI applications to achieve their full potential.

![](https://assets.zilliz.com/vector_indexing_time_354bdd4b46.webp)

## Why S3 API-based Object Storage for AI Workloads

The convergence of RDMA technology  with object storage architecture creates the ideal foundation for AI infrastructure, addressing multiple challenges that have constrained traditional storage approaches.

**Exabyte Scalability for AI’s Data Explosion:** AI workloads, particularly those involving synthetic and multi-modal data, are pushing storage requirements into the 100-petabyte range and beyond. Object storage’s flat address space scales seamlessly from petabytes to exabytes, accommodating the exponential growth in AI training datasets without the hierarchical limitations that constrain file-based systems.

**Unified Platform for Complete AI Workflows:** Modern AI operations span data ingestion, cleansing, training, checkpointing, and inference—each with distinct performance and capacity requirements. S3-compatible object storage supports this entire spectrum through consistent API access, eliminating the complexity and cost of managing multiple storage tiers. Training data, models, checkpoint files, and inference datasets can all reside in a single, high-performance data lake.

**Rich Metadata for AI Operations:** Critical AI operations like search and enumeration are fundamentally metadata-driven. Object storage’s rich, customizable metadata capabilities enable efficient data tagging, searching, and management—essential for organizing and retrieving data in complex AI model training and inference workflows.

**Economic and Operational Advantages:** S3-compatible object storage delivers up to 80% lower total cost of ownership compared to file storage alternatives, leveraging industry-standard hardware and independent scaling of capacity and performance. This economic efficiency becomes crucial as AI datasets reach enterprise scale.

**Enterprise Security and Governance:** Unlike GPUDirect implementations that require kernel-level modifications, RDMA for S3-compatible storage requires no vendor-specific kernel changes, maintaining system security and regulatory compliance. This approach is particularly valuable in sectors like healthcare and finance where data security and regulatory compliance are paramount.

## The Road Ahead

NVIDIA’s announcement of RDMA for S3-compatible storage general availability represents more than a technological milestone—it signals the maturation of AI infrastructure architecture. By combining the limitless scalability of object storage with the breakthrough performance of direct GPU access, organizations can finally build AI infrastructures that scale with their ambitions.

As AI workloads continue to grow in complexity and scale, RDMA for S3-compatible storage provides the storage foundation that enables organizations to maximize their AI investments while maintaining data sovereignty and operational simplicity. The technology transforms storage from a bottleneck into an enabler, allowing AI applications to achieve their full potential at enterprise scale.

For organizations planning their AI infrastructure roadmap, the general availability of RDMA for S3-compatible storage marks the beginning of a new era where storage performance truly matches the demands of modern AI workloads.

## Industry Perspectives

As AI becomes increasingly central to healthcare delivery, we continuously seek to boost the performance and efficiency of our infrastructure. The new RDMA for S3-compatible storage from NVIDIA and Cloudian will be critical for our medical imaging analysis and diagnostic AI applications, where processing large datasets quickly can directly impact patient care, while reducing costs of moving data between S3-API based storage devices and SSD based NAS storages.  – _Dr. Swapnil Rane MD, DNB, PDCC (Nephropath), Mres (TCM), Fellowship in Oncopath, FRCPath Professor (F) of Pathology, PI, AI/Computational Pathology And Imaging Lab OIC- Department of Digital and Computational Oncology, Tata Memorial Centre_

“NVIDIA’s RDMA for S3-compatible announcement confirms the value of our Cloudian-based AI infrastructure strategy. We enable organizations to run high-performance AI at scale while preserving S3 API compatibility that keeps migration simple and application development costs low.” – _Sunil Gupta, Co-founder, Managing Director & Chief Executive Officer (CEO), Yotta Data Services_

“As we expand our on-premises capabilities to deliver sovereign AI, NVIDIA’s RDMA for S3-compatible storage technology and Cloudian’s high-performance object storage give us the performance we need without compromising data residency and without requiring any kernel-level modifications. The Cloudian HyperStore platform lets us scale to exabytes while keeping our sensitive AI data completely under our control.” – _Logan Lee, EVP & Head of Cloud, Kakao_

“We’re excited about NVIDIA’s announcement of the upcoming RDMA for S3-compatible storage GA release. Our testing with Cloudian showed up to 8X performance improvement for vector database operations, which will let our Milvus by Zilliz users achieve cloud-scale performance for demanding AI workloads while maintaining complete data sovereignty.” – _Charles Xie, Founder and CEO of Zilliz_
