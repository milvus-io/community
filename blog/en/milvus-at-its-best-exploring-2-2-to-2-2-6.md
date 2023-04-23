---
id: milvus-at-its-best-exploring-2-2-to-2-2-6.md
title: 
 > 
 Milvus at Its Best: Exploring v2.2 to v2.2.6
author: Fendy Feng
date: 2023-04-22
cover: assets.zilliz.com/explore_milvus_latest_versions_48a4138d02.png
tag: News
tags: Milvus, Vector Database, Open Source, Data science, Artificial Intelligence, Vector Management
recommend: true
canonicalUrl: https://milvus.io/blog/milvus-at-its-best-exploring-2-2-to-2-2-6.md
---

![Milvus at Its Best](https://assets.zilliz.com/exploring_milvus_latest_versions_4fa890533e.png)

Welcome back, Milvus followers! We know it's been a while since we last shared our updates on this cutting-edge open-source vector database. But fear not, because we’re here to catch you up on all the exciting developments that have taken place since last August.

In this blog post, we'll take you through the latest Milvus releases, spanning from version 2.2 to version 2.2.6. We have much to cover, including new features, improvements, bug fixes, and optimizations. So, fasten your seatbelts, and let’s dive in!

## Milvus v2.2: a major release with enhanced stability, faster search speed, and flexible scalability

Milvus v2.2 is a significant release that introduces seven brand-new features and numerous breakthrough improvements to previous versions. Let's take a closer look at some of the highlights:

* **Bulk Inserts of Entities from Files**: With this feature, you can upload a batch of entities in one or multiple files directly to Milvus with just a few lines of code, saving you time and effort.
* **Query Result Pagination**: To avoid massive search and query results returning in a single remote procedure call (RPC), Milvus v2.2 allows you to configure offset and filter results with keywords in searches and queries. 
* **Role-Based Access Control (RBAC)**: Milvus v2.2 now supports RBAC, allowing you to control access to your Milvus instance by managing users, roles, and permissions. 
* **Quotas and Limits**: Quotas and limits is a new mechanism in Milvus v2.2 that protects the database system from out-of-memory (OOM) errors and crashes during sudden traffic surges. With this feature, you can control ingestion, search, and memory usage.
* **Time to Live (TTL) at a Collection Level**: In previous releases, Milvus only allowed you to configure TTL for your clusters. However, Milvus v2.2 now supports configuring TTL at the collection level. Configuring TTL for a specific collection and entities in that collection will automatically expire after the TTL ends. This configuration provides more fine-grained control over data retention.
* **Disk-Based Approximate Nearest Neighbor Search (ANNS) Indexes (Beta)**: Milvus v2.2 introduces support for DiskANN, an SSD-resident, and Vamana graph-based ANNS algorithm. This support allows for direct searching on large-scale datasets, which can significantly reduce memory usage, by up to 10 times.
* **Data Backup (Beta)**: Milvus v2.2 provides [a brand new tool](https://github.com/zilliztech/milvus-backup) for backing up and restoring your Milvus data properly, either through a command line or an API server. 

In addition to the new features mentioned above, Milvus v2.2 includes fixes for five bugs and multiple improvements to enhance Milvus' stability, observability, and performance. For more details, see [Milvus v2.2 Release Notes](https://milvus.io/docs/release_notes.md#v220). 

## Milvus v2.2.1 & v2.2.2: minor releases with issues fixed

Milvus v2.2.1 and v2.2.2 are minor releases focusing on fixing critical issues in older versions and introducing new features. Here are some highlights:

### Milvus v2.2.1

* Supports Pulsa tenant and authentication
* Supports transport layer security (TLS) in the etcd config source
* Improves search performance by over 30%
* Optimizes the scheduler and increases the probability of merge tasks
* Fixes multiple bugs, including term filtering failures on indexed scalar fields and IndexNode panic upon failures to create an index

### Milvus v2.2.2

* Fixes the issue that the proxy doesn't update the cache of shard leaders
* Fixes the issue that the loaded info is not cleaned for released collections/partitions
* Fixes the issue that the load count is not cleared on time

For more details, see [Milvus v2.2.1 Release Notes](https://milvus.io/docs/release_notes.md#v221) and [Milvus v2.2.2 Release Notes](https://milvus.io/docs/release_notes.md#v222). 

## Milvus v2.2.3: more secure, stable, and available 

Milvus v2.2.3 is a release that focuses on enhancing the system’s security, stability, and availability. In addition, it introduces two important features:

* **Rolling upgrade**: This feature allows Milvus to respond to incoming requests during the upgrade process, which was impossible in previous releases. Rolling upgrades ensure the system remains available and responsive to user requests even during upgrades.

* **Coordinator high availability (HA)**: This feature enables Milvus coordinators to work in an active-standby mode, reducing the risk of single-point failures. Even in unexpected disasters, the recovery time is reduced to at most 30 seconds. 

In addition to these new features, Milvus v2.2.3 includes numerous improvements and bug fixes, including enhanced bulk insert performance, reduced memory usage, optimized monitoring metrics, and improved meta-storage performance. For more details, see [Milvus v2.2.3 Release Notes](https://milvus.io/docs/release_notes.md#v223). 

## Milvus v2.2.4: faster, more reliable and resource saving

Milvus v2.2.4 is a minor update to Milvus v2.2. It introduces four new features and several enhancements, resulting in faster performance, improved reliability, and reduced resource consumption. The highlights of this release include:

* **Resource grouping**: Milvus now supports grouping QueryNodes into other resource groups, allowing for complete isolation of access to physical resources in different groups. 
* **Collection renaming**: The Collection-renaming API allows users to change the name of a collection, providing more flexibility in managing collections and improving usability.
* **Support for Google Cloud Storage**
* **New option in search and query APIs**: This new feature allows users to skip search on all growing segments, offering better search performance in scenarios where the search is performed concurrently with data insertion. 

For more information, see [Milvus v2.2.4 Release Notes](https://milvus.io/docs/release_notes.md#v224). 

## Milvus v2.2.5: NOT RECOMMENDED

Milvus v2.2.5 has several critical issues, and therefore, we do not recommend using this release.  We sincerely apologize for any inconvenience caused by them. However, these issues have been addressed in Milvus v2.2.6.

## Milvus v2.2.6: resolves critical issues from v2.2.5 

Milvus v2.2.6 has successfully addressed the critical issues discovered in v2.2.5, including problems with recycling dirty binlog data and the DataCoord GC failure. If you currently use v2.2.5, please upgrade it to ensure optimal performance and stability.

Critical issues fixed include: 

* DataCoord GC failure
* Override of passed index parameters 
* System delay caused by RootCoord message backlog
* Inaccuracy of metric RootCoordInsertChannelTimeTick 
* Possible timestamp stop
* Occasional coordinator role self-destruction during the restart process 
* Checkpoints falling behind due to abnormal exit of garbage collection 

For more details, see [Milvus v2.2.6 Release Notes](https://milvus.io/docs/release_notes.md#v226). 

## Summary 

In conclusion, the latest Milvus releases from v2.2 to v2.2.6 have delivered many exciting updates and improvements. From new features to bug fixes and optimizations, Milvus continues to meet its commitments to provide cutting-edge solutions and empower applications in various domains. Stay tuned for more exciting updates and innovations from the Milvus community. 

