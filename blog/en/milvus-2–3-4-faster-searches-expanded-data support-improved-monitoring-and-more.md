---
id: milvus-2–3-4-faster-searches-expanded-data support-improved-monitoring-and-more.md
title: 'Milvus 2.3.4: Faster Searches, Expanded Data Support, Improved Monitoring, and More'
author: Ken Zhang, Fendy Feng
date: 2024-01-12
cover: assets.zilliz.com/What_is_new_in_Milvus_2_3_4_1847b0fa8a.png
tag: News
tags: Milvus, Vector Database, Open Source, Data science, Artificial Intelligence, Vector Management, Vector Search
recommend: true
canonicalUrl: https://milvus.io/blog/milvus-2–3-4-faster-searches-expanded-data support-improved-monitoring-and-more.md
---

![](https://assets.zilliz.com/What_is_new_in_Milvus_2_3_4_1847b0fa8a.png)


We are excited to unveil the latest release of Milvus 2.3.4. This update introduces a suite of features and enhancements meticulously crafted to optimize performance, boost efficiency, and deliver a seamless user experience. In this blog post, we'll delve into the highlights of Milvus 2.3.4. 

# Access logs for improved monitoring

Milvus now supports access logs, offering invaluable insights into interactions with external interfaces. These logs record method names, user requests, response times, error codes, and other interaction information, empowering developers and system administrators to conduct performance analysis, security auditing, and efficient troubleshooting. 

**_Note:_** _Currently, access logs only support gRPC interactions. However, our commitment to improvement continues, and future versions will extend this capability to include RESTful request logs._ 

For more detailed information, refer to [Configure Access Logs](https://milvus.io/docs/configure_access_logs.md).

## Parquet file imports for enhanced data processing efficiency

Milvus 2.3.4 now supports importing Parquet files, a widely embraced columnar storage format designed to enhance the efficiency of storing and processing large-scale datasets. This addition gives users increased flexibility and efficiency in their data processing endeavors. By eliminating the need for laborious data format conversions, users managing substantial datasets in the Parquet format will experience a streamlined data import process, significantly reducing the time from initial data preparation to subsequent vector retrieval.

Furthermore, our data format conversion tool, BulkWriter, has now embraced Parquet as its default output data format, ensuring a more intuitive experience for developers. 

## Binlog index on growing segments for faster searches

Milvus now leverages a binlog index on growing segments, resulting in up to tenfold faster searches in growing segments. This enhancement significantly boosts search efficiency and supports advanced indices like IVF or Fast Scan, improving the overall user experience.

## Support for up to 10,000 collections/partitions

Like tables and partitions in relational databases, collections and partitions are the core units for storing and managing vector data in Milvus. Responding to users' evolving needs for nuanced data organization, Milvus 2.3.4 now supports up to 10,000 collections/partitions in a cluster, a significant jump from the previous limit of 4,096. This enhancement benefits diverse use cases, such as knowledge base management and multi-tenant environments. The expanded support for collections/partitions stems from refinements to the time tick mechanism, goroutine management, and memory usage.

 **_Note:_** _The recommended limit for the number of collections/partitions is 10,000, as exceeding this limit may impact failure recovery and resource usage._

## Other enhancements 

In addition to the features above, Milvus 2.3.4 includes various improvements and bug fixes. These include reduced memory usage during data retrieval and variable-length data handling, refined error messaging, accelerated loading speed, and improved query shard balance. These collective enhancements contribute to a smoother and more efficient overall user experience.

For a comprehensive overview of all the changes introduced in Milvus 2.3.4, refer to our [Release Notes](https://milvus.io/docs/release_notes.md#v234).

## Stay connected!

If you have questions or feedback about Milvus, join our [Discord channel](https://discord.com/invite/8uyFbECzPX) to engage with our engineers and the community directly or join our [Milvus Community Lunch and Learn](https://discord.com/invite/RjNbk8RR4f) Every Tuesday from 12-12:30 PM PST. You’re also welcome to follow us on [Twitter](https://twitter.com/milvusio) or [LinkedIn](https://www.linkedin.com/company/the-milvus-project) for the latest news and updates about Milvus.
