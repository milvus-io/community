---
id: understanding-consistency-levels-in-the-milvus-vector-database-2.md
title: Understanding Consistency Level in the Milvus Vector Database - Part II
author: Jiquan Long
date: 2022-09-13
desc: An anatomy of the mechanism behind tunable consistency levels in the Milvus vector database.
cover: assets.zilliz.com/1280_X1280_0e0d4bc107.png
tag: Engineering
tags: Vector Database for AI, Artificial Intelligence, Machine Learning
canonicalUrl: http://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database-2.md
---

![Cover_image](https://assets.zilliz.com/1280_X1280_0e0d4bc107.png "Understanding Consistency Level in the Milvus Vector Database")

> This article is written by [Jiquan Long](https://github.com/longjiquan) and transcreated by [Angela Ni](https://www.linkedin.com/in/yiyun-n-2aa713163/).

In the [previous blog](https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database.md) about consistency, we have explained what is the connotation of consistency in a distributed vector database, covered the four levels of consistency - strong, bounded staleness, session, and eventual supported in the Milvus vector database, and explained the best-suited application scenario of each consistency level. 

In this post, we will continue to examine the mechanism behind that enables users of the Milvus vector database to flexibly choose the ideal consistency level for various application scenarios. We will also provide the basic tutorial on how to tune consistency level in the Milvus vector database.

**Jump to:**

- [The underlying time tick mechanism](#The-underlying-time-tick-mechanism)
- [Guarantee timestamp](#Guarantee-timestamp)
- [Consistency levels](#Consistency-levels)
- [How to tune consistency level in Milvus?](#How-to-tune-consistency-level-in-Milvus)

## The underlying time tick mechanism

Milvus uses the time tick mechanism to ensure different levels of consistency when a vector search or query is conducted. Time Tick is the watermark of Milvus which acts like a clock in Milvus and signifies at which point of time is the Milvus system in. Whenever there is a data manipulation language (DML) request sent to the Milvus vector database, it assigns a timestamp to the request. As shown in the figure below, when new data are inserted into the message queue for instance, Milvus not only marks a timestamp on these inserted data, but also inserts time ticks at a regular interval. 

![timetick](https://assets.zilliz.com/timetick_b395df9804.png "Timestamp and time tick.")

Let's take `syncTs1` in the figure above as an example. When downstream consumers like query nodes see `syncTs1`, the consumer components understand that all data which are inserted earlier than `syncTs1` has been consumed. In other words, the data insertion requests whose timestamp values are smaller than `syncTs1` will no longer appear in the message queue.

## Guarantee Timestamp

As mentioned in the previous section, downstream consumer components like query nodes continuously obtains messages of data insertion requests and time tick from the message queue. Every time a time tick is consumed, the query node will mark this consumed time tick as the serviceable time - `ServiceTime` and all data inserted before `ServiceTime` are visible to the query node.

In addition to `ServiceTime`, Milvus also adopts a type of timestamp - guarantee timestamp (`GuaranteeTS`) to satisfy the need for various levels of consistency and availability by different users. This means that users of the Milvus vector datbase can specify `GuaranteeTs` in order to inform query nodes that all the data before `GuaranteeTs` should be visible and involved when a search or query is conducted.

There are usually two scenarios when the query node executes a search request in the Milvus vector database.

### Scenario 1: Execute search request immediately

As shown in the figure below, if `GuaranteeTs` is smaller than `ServiceTime`, query nodes can execute the search request immediately.

![execute_immediately](https://assets.zilliz.com/execute_immediately_dd1913775d.png "Execute search request immediately.")

### Scenario 2: Wait till "ServiceTime > GuaranteeTs"

If `GuaranteeTs` is greater than `ServiceTime`, query nodes must continue to consume time tick from the message queue. Search requests cannot be executed until `ServiceTime` is greater than `GuaranteeTs`.

![wait_search](https://assets.zilliz.com/wait_search_f09a2f6cf9.png "Wait till ServiceTime > GuaranteeTs.")

## Consistency Levels

Therefore, the `GuaranteeTs` is configurable in the search request to achieve the level of consistency specified by you. A `GuaranteeTs` with a large value ensures [strong consistency](https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database.md#Strong) at the cost of a high search latency. And a `GuaranteeTs` with a small value reduces search latency but the data visibility is compromised.

`GuaranteeTs` in Milvus is a hybrid timestamp format. And the user has no idea of the [TSO](https://github.com/milvus-io/milvus/blob/master/docs/design_docs/milvus_hybrid_ts_en.md?from=from_parent_mindnote) inside Milvus. Therefore, Specifying the value of`GuaranteeTs` is a much too complicated task for users. To save the trouble for users and provide an optimal user experience, Milvus only requires the users to choose the specific consistency level, and the Milvus vector database will automatically handle the `GuaranteeTs` value for users. That is to say, the Milvus user only needs to choose from the four consistency levels: `Strong`, `Bounded`, `Session`, and `Eventually`. And each of the consistency level corresponds to a certain `GuaranteeTs` value.

The figure below illustrates the `GuaranteeTs` for each of the four levels of consistency in the Milvus vector database.

![guarantee_ts](https://assets.zilliz.com/guarantee_ts_f4b3e119d3.png "The corresponding GuaranteeTs for the four consistency levels in Milvus.")

The Milvus vector database supports four levels of consistency:

- `CONSISTENCY_STRONG`: `GuaranteeTs` is set to the same value as the latest system timestamp, and query nodes wait until the service time proceeds to the latest system timestamp to process the search or query request. 

- `CONSISTENCY_EVENTUALLY`: `GuaranteeTs` is set to a value insignificantly smaller than the latest system timestamp in order to skip the consistency check. Query nodes search immediately on the existing data view. 

- `CONSISTENCY_BOUNDED`: `GuaranteeTs` is set to a value relatively smaller than the latest system timestamp, and query nodes search on a tolerably less updated data view. 

- `CONSISTENCY_SESSION`: The client uses the timestamp of the last write operation as the `GuaranteeTs` so that each client can at least retrieve the data inserted by itself. 

## How to tune consistency level in Milvus?

Milvus supports tuning the consistency level when [creating a collection](https://milvus.io/docs/v2.1.x/create_collection.md) or conducting a [search](https://milvus.io/docs/v2.1.x/search.md) or [query](https://milvus.io/docs/v2.1.x/query.md).  

### Conduct a vector similarity search

To conduct a vector similarity search with the level of consistency you want, simply set the value for the parameter `consistency_level` as either `Strong`, `Bounded`, `Session`, or `Eventually`. If you do not set the value for the parameter `consistency_level`, the consistency level will be `Bounded` by default. The example conducts a vector similarity search with `Strong` consistency.  

```
results = collection.search(
        data=[[0.1, 0.2]], 
        anns_field="book_intro", 
        param=search_params, 
        limit=10, 
        expr=None,
        consistency_level="Strong"
)
```

### Conduct a vector query

Similar to conducting a vector similarity search, you can specify the value for the parameter `consistency_level` when conducting a vector query. The example conducts a vector query with `Strong` consistency.  

```
res = collection.query(
  expr = "book_id in [2,4,6,8]", 
  output_fields = ["book_id", "book_intro"],
  consistency_level="Strong"
)
```

## What's next

With the official release of Milvus 2.1, we have prepared a series of blogs introducing the new features. Read more in this blog series:

- [How to Use String Data to Empower Your Similarity Search Applications](https://milvus.io/blog/2022-08-08-How-to-use-string-data-to-empower-your-similarity-search-applications.md)
- [Using Embedded Milvus to Instantly Install and Run Milvus with Python](https://milvus.io/blog/embedded-milvus.md)
- [Increase Your Vector Database Read Throughput with In-Memory Replicas](https://milvus.io/blog/in-memory-replicas.md)
- [Understanding Consistency Level in the Milvus Vector Database](https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database.md)
- [Understanding Consistency Level in the Milvus Vector Database (Part II)](https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database-2.md)
- [How Does the Milvus Vector Database Ensure Data Security?](https://milvus.io/blog/data-security.md)



