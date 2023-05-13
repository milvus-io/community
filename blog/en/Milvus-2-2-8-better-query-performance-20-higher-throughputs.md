---
id: Milvus-2-2-8-better-query-performance-20-higher-throughputs.md
title: 
 > 
 Milvus 2.2.8: Better Query Performance, 20% Higher Throughput 
author: Fendy Feng
date: 2023-05-12
cover: assets.zilliz.com/What_s_New_in_2_2_8_f4dd6de0f2.png
tag: News
tags: Milvus, Vector Database, Open Source, Data science, Artificial Intelligence, Vector Management
recommend: true
canonicalUrl: https://milvus.io/blog/Milvus-2-2-8-better-query-performance-20-higher-throughputs.md
---

![Milvus 2.2.8](https://assets.zilliz.com/What_s_New_in_2_2_8_f4dd6de0f2.png)


We are excited to announce our latest release of Milvus 2.2.8. This release includes numerous improvements and bug fixes from previous versions, resulting in better querying performance, resource-saving, and higher throughputs. Let's take a look at what's new in this release together. 

## Reduced peak memory consumption during collection loading

To perform queries, Milvus needs to load data and indexes into memory. However, during the loading process, multiple memory copies can cause the peak memory usage to increase up to three to four times higher than during actual runtime. The latest version of Milvus 2.2.8 effectively addresses this issue and optimizes memory usage.

## Expanded querying scenarios with QueryNode supporting plugins

QueryNode now supports plugins in the latest Milvus 2.2.8. You can easily specify the path of the plugin file with the `queryNode.soPath` configuration. Then, Milvus can load the plugin at runtime and expand the available querying scenarios. Refer to the [Go plugin documentation](https://pkg.go.dev/plugin), if you need guidance on developing plugins. 

## Optimized querying performance with enhanced compaction algorithm

The compaction algorithm determines the speed at which the segments can converge, directly affecting the querying performance. With the recent improvements to the compaction algorithm, the convergence efficiency has dramatically improved, resulting in faster queries. 

## Better resource saving and querying performance with reduced collection shards

Milvus is a massively parallel processing (MPP) system, which means that the number of collection shards impacts Milvus’ efficiency in writing and querying. In older versions, a collection had two shards by default, which resulted in excellent writing performance but compromised querying performance and resource cost. With the new Milvus 2.2.8 update, the default collection shards have been reduced to one, allowing users to save more resources and perform better queries. Most users in the community have less than 10 million data volumes, and one shard is sufficient to achieve good writing performance.

**Note**: This upgrade does not affect collections created before this release. 

## 20% throughput increase with an improved query grouping algorithm 
Milvus has an efficient query grouping algorithm that combines multiple query requests in the queue into one for faster execution, significantly improving throughput. In the latest release, we make additional enhancements to this algorithm, increasing Milvus' throughput by at least 20%.

In addition to the mentioned improvements, Milvus 2.2.8 also fixes various bugs. For more details, see [Milvus Release Notes](https://milvus.io/docs/release_notes.md). 

## Let’s keep in touch!
If you have questions or feedback about Milvus, please don't hesitate to contact us through [Twitter](https://twitter.com/milvusio) or [LinkedIn](https://www.linkedin.com/company/the-milvus-project). You're also welcome to join our [Slack channel](https://milvus.io/slack/) to chat with our engineers and the entire community directly or check out our [Tuesday office hours](https://us02web.zoom.us/meeting/register/tZ0pcO6vrzsuEtVAuGTpNdb6lGnsPBzGfQ1T#/registration)!
