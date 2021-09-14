---
id: Whats-Inside-Milvus-1.0.md
title: What's Inside Milvus 1.0?
author: milvus
date: 2021-04-29 08:46:04.019+00
desc: Milvus v1.0 is available now. This stable, long-term support version powers image/video search, chatbots, and many more AI applications.
cover: zilliz-cms.s3.us-west-2.amazonaws.com/Milvus_510cf50aee.jpeg
tag: Technology,Community
origin: zilliz.com/blog/Whats-Inside-Milvus-1.0
---

# What's Inside Milvus 1.0?

![Milvus.jpeg](https://zilliz-cms.s3.us-west-2.amazonaws.com/Milvus_510cf50aee.jpeg)

Milvus is an open-source vector database designed to manage massive million, billion, or even trillion vector datasets. Milvus has broad applications spanning new drug discovery, computer vision, autonomous driving, recommendation engines, chatbots, and much more.

In March, 2021 Zilliz, the company behind Milvus, released the platform's first long-term support version—Milvus v1.0. After months of extensive testing, a stable, production ready version of the world's most popular vector database is ready for prime time. This blog article covers some Milvus fundamentals as well as key features of v1.0.

<br/>

### Milvus distributions

Milvus is available in CPU-only and GPU-enabled distributions. The former relies exclusively on CPU for index building and search; the latter enables CPU and GPU hybrid search and index building that further accelerates Milvus. For example, using the hybrid distribution, CPU can be used for search and GPU for index building, further improving query efficiency.

Both Milvus distributions are available in Docker. You can either compile Milvus from Docker (if your operating system supports it) or compile Milvus from source code on Linux (other operating systems are not supported).

<br/>

### Embedding vectors

Vectors are stored in Milvus as entities. Each entity has one vector ID field and one vector field. Milvus v1.0 supports integer vector IDs only. When creating a collection within Milvus, vector IDs can be automatically generated or manually defined. Milvus ensures auto-generated vector IDs are unique however, manually defined IDs can be duplicated within Milvus. If manually defining IDs, users are responsible for making sure all IDs are unique.

<br/>

### Partitions

Milvus supports creating partitions in a collection. In situations where data is inserted regularly and historical data isn't significant (e.g., streaming data), partitions can be used to accelerate vector similarity search. One collection can have up to 4,096 partitions. Specifying a vector search within a specific partition narrows the search and may significantly reduce query time, particularly for collections that contain more than a trillion vectors.

<br/>

### Index algorithm optimizations

Milvus is built on top of multiple widely-adopted index libraries, including Faiss, NMSLIB, and Annoy. Milvus is far more than a basic wrapper for these index libraries. Here are some of the major enhancements that have been made to the underlying libraries:

- IVF index performance optimizations using the Elkan k-means algorithm.
- FLAT search optimizations.
- IVF_SQ8H hybrid index support, which can reduce index file sizes by up to 75% without sacrificing data accuracy. IVF_SQ8H is built upon IVF_SQ8, with identical recall but much faster query speed. It was designed specifically for Milvus to harnesses the parallel processing capacity of GPUs, and the potential for synergy between CPU/GPU co-processing.
- Dynamic instruction set compatibility.

<br/>

### Search, index building, and other Milvus optimizations

The following optimizations have been made to Milvus to improve search and index building performance.

- Search performance is optimized in situations when the number of queries (nq) is less than the number of CPU threads.
- Milvus combines search requests from a client that take the same topK and search parameters.
- Index building is suspended when search requests come in.
- Milvus automatically preloads collections to memory at start.
- Multiple GPU devices can be assigned to accelerate vector similarity search.

<br/>

### Distance metrics

Milvus is a vector database built to power vector similarity search. The platform was built with MLOps and production level AI applications in mind. Milvus supports a wide range of distance metrics for calculating similarity, such as Euclidean distance (L2), inner product (IP), Jaccard distance, Tanimoto, Hamming distance, superstructure, and substructure. The last two metrics are commonly used in molecular search and AI-powered new drug discovery.

<br/>

### Logging

Milvus supports log rotation. In the system configuration file, milvus.yaml, you can set the size of a single log file, the number of log files, and log output to stdout.

<br/>

### Distributed solution

Mishards, a Milvus sharding middleware, is the distributed solution for Milvus With one write node and an unlimited number of read nodes, Mishards unleashes the computational potential of server cluster. Its features include request forwarding, read/write splitting, dynamic/horizontal scaling, and more.

<br/>

### Monitoring

Milvus is compatible with Prometheus, an open-source system monitoring and alerts toolkit. Milvus adds support for Pushgateway in Prometheus, making it possible for Prometheus to acquire short-lived batch metrics. The monitoring and alerts system works as follows:

- The Milvus server pushes customized metrics data to Pushgateway.
- Pushgateway ensures ephemeral metric data is safely sent to Prometheus.
- Prometheus continues pulling data from Pushgateway.
- Alertmanager is used to set the alert threshold for different indicators and send alerts via email or message.

<br/>

### Metadata management

Milvus uses SQLite for metadata management by default. SQLite is implemented in Milvus and does not require configuration. In a production environment, it is recommended that you use MySQL for metadata management.

<br/>

### Engage with our open-source community:

- Find or contribute to Milvus on [GitHub](https://github.com/milvus-io/milvus/).
- Interact with the community via [Slack](https://join.slack.com/t/milvusio/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ).
- Connect with us on [Twitter](https://twitter.com/milvusio).
