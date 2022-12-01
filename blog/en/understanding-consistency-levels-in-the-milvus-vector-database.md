---
id: understanding-consistency-levels-in-the-milvus-vector-database.md
title: Understanding Consistency Level in the Milvus Vector Database
author: Chenglong Li
date: 2022-08-29
desc: Learn about the four levels of consistency - strong, bounded staleness, session, and eventual supported in the Milvus vector database.
cover: assets.zilliz.com/1280_X1280_0e0d4bc107.png
tag: Engineering
tags: Vector Database for AI, Artificial Intelligence, Machine Learning
canonicalUrl: https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database.md
---

![Cover_image](https://assets.zilliz.com/1280_X1280_0e0d4bc107.png "Understanding Consistency Level in the Milvus Vector Database")

> This article is written by [Chenglong Li](https://github.com/JackLCL) and transcreated by [Angela Ni](https://www.linkedin.com/in/yiyun-n-2aa713163/).

Have you ever wondered why sometimes the data you have deleted from the Mlivus vector database still appear in the search results? 

A very likely reason is that you have not set the appropriate consistency level for your application. Consistency level in a distributed vector database is critical as it determines at which point a particular data write can be read by the system. 

Therefore, this article aims to demystify the concept of consistency and delve into the levels of consistency supported by the Milvus vector database.


**Jump to:**
- [What is consistency](#What-is-consistency)
- [Four levels of consistency in the Milvus vector database](#Four-levels-of-consistency-in-the-Milvus-vector-database)
  - [Strong](#Strong)
  - [Bounded staleness](#Bounded-staleness)
  - [Session](#Session)
  - [Eventual](#Eventual)


## What is consistency

Before getting started, we need to first clarify the connotation of consistency in this article as the word "consistency" is an overloaded term in the computing industry. Consistency in a distributed database specifically refers to the property that ensures every node or replica has the same view of data when writing or reading data at a given time. Therefore, here we are talking about consistency as in the [CAP theorem](https://en.wikipedia.org/wiki/CAP_theorem). 

For serving massive online businesses in the modern world, multiple replicas are commonly adopted. For instance, online e-commerce giant Amazon replicates its orders or SKU data across multiple data centers, zones, or even countries to ensure high system availability in the event of a system crash or failure. This poses a challenge to the system - data consistency across multiple replicas. Without consistency, it is very likely that the deleted item in your Amazon cart reappears, causing very bad user experience. 

Hence, we need different data consistency levels for different applications. And luckily, Milvus, a database for AI, offers flexibility in consistency level and you can set the consistency level that best suits your application.


### Consistency in the Milvus vector database

The concept of consistency level was first introduced with the release of Milvus 2.0. The 1.0 version of Milvus was not a distributed vector database so we did not involve tunable levels of consistency then. Milvus 1.0 flushes data every second, meaning that new data are almost immediately visible upon their insertion and Milvus reads the most updated data view at the exact time point when a vector similarity search or query request comes. 

However, Milvus was refactored in its 2.0 version and [Milvus 2.0 is a distributed vector database](https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md) based on a pub-sub mechanism. The [PACELC](https://en.wikipedia.org/wiki/PACELC_theorem) theorem points out that a distributed system must trade off among consistency, availability, and latency. Furthermore, different levels of consistency serve for different scenarios. Therefore, the concept of consistency was introduced in [Milvus 2.0](https://milvus.io/blog/2022-1-25-annoucing-general-availability-of-milvus-2-0.md) and it supports tuning levels of consistency.

## Four levels of consistency in the Milvus vector database

Milvus supports four levels of consistency:  strong, bounded staleness, session, and eventual. And a Milvus user can specify the consistency level when [creating a collection](https://milvus.io/docs/v2.1.x/create_collection.md) or conducting a [vector similarity search](https://milvus.io/docs/v2.1.x/search.md) or [query](https://milvus.io/docs/v2.1.x/query.md). This section will continue to explain how these four levels of consistency are different and which scenario are they best suited for. 

### Strong

Strong is the highest and the most strict level of consistency. It ensures that users can read the latest version of data. 

![Strong](https://assets.zilliz.com/Consistency_Strong_5d791eb8b2.png "An illustration of strong consistency.")

According to the PACELC theorem, if the consistency level is set to strong, the latency will increase. Therefore, we recommend choosing strong consistency during functional testings to ensure the accuracy of the test results. And strong consistency is also best suited for applications that have strict demand for data consistency at the cost of search speed. An example can be an online financial system dealing with order payments and billing.

### Bounded staleness

Bounded staleness, as its name suggests, allows data inconsistency during a certain period of time. However, generally, the data are always globally consistent out of that period of time.

![Bounded_staleness](https://assets.zilliz.com/Consistency_Bounded_c034bc6e51.png "An illustration of bounded staleness consistency.")

Bounded staleness is suitable for scenarios that needs to control search latency and can accept sporadic data invisibility. For instance, in recommender systems like video recommendation engines, data invisibility once in a while has really small impact on the overall recall rate, but can significantly boost the performance of the recommender system. An example can be an app for tracking the status of your online orders.

### Session

Session ensures that all data writes can be immediately perceived in reads during the same session. In other words, when you write data via one client, the newly inserted data instantaneously become searchable. 

![Session](https://assets.zilliz.com/Consistency_Session_6dc4782212.png "An illustration of session consistency.")

We recommend choosing session as the consistency level for those scenarios where the demand of data consistency in the same session is high. An example can be deleting the data of a book entry from the library system, and after confirmation of the deletion and refreshing the page (a different session), the book should no longer be visible in search results.

### Eventual

There is no guaranteed order of reads and writes, and replicas eventually converge to the same state given that no further write operations are done. Under eventual consistency, replicas start working on read requests with the latest updated values. Eventual consistency is the weakest level among the four. 

![Eventual](https://assets.zilliz.com/Consistency_Eventual_7c66dd5b6f.png "An illustration of eventual consistency.")

However, according to the PACELC theorem, search latency can be tremendously shortened upon sacrificing consistency. Therefore, eventual consistency is best suited for scenarios that do not have high demand for data consistency but requires blazing-fast search performance. An example can be retrieving reviews and ratings of Amazon products with eventual consistency. 

## Endnote

So going back to the question raised at the beginning of this article, deleted data are still returned as search results because the user has not chosen the proper level of consistency. The default value for consistency level is bounded staleness (`Bounded`) in the Milvus vector database. Therefore, the data read might lag behind and Milvus might happen to read the data view before you conducted delete operations during a similarity search or query. However, this issue is simple to solve. All you need to do is [tune the consistency level](https://milvus.io/docs/v2.1.x/tune_consistency.md) when creating a collection or conducting vector similarity search or query. Simple!

In the next post, we will unveil the mechanism behind and explain how the Milvus vector database achieves different levels of consistency. Stay tuned!

## What's next

With the official release of Milvus 2.1, we have prepared a series of blogs introducing the new features. Read more in this blog series:

- [How to Use String Data to Empower Your Similarity Search Applications](https://milvus.io/blog/2022-08-08-How-to-use-string-data-to-empower-your-similarity-search-applications.md)
- [Using Embedded Milvus to Instantly Install and Run Milvus with Python](https://milvus.io/blog/embedded-milvus.md)
- [Increase Your Vector Database Read Throughput with In-Memory Replicas](https://milvus.io/blog/in-memory-replicas.md)
- [Understanding Consistency Level in the Milvus Vector Database](https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database.md)
- [Understanding Consistency Level in the Milvus Vector Database (Part II)](https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database-2.md)
- [How Does the Milvus Vector Database Ensure Data Security?](https://milvus.io/blog/data-security.md)


