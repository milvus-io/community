---
id: milvus-2-2-12-easier-access-faster-vector-search-speeds-better-user-experience.md
title: 
 > 
 Milvus 2.2.12: Easier Access, Faster Vector Search Speeds, and Better User Experience 
author: Owen Jiao, Fendy Feng
date: 2023-07-28
cover: assets.zilliz.com/What_s_New_in_2_2_12_20230720_143424_7d19280738.png
tag: News
tags: Milvus, Vector Database, Open Source, Data science, Artificial Intelligence, Vector Management, Vector Search
recommend: true
canonicalUrl: milvus-2-2-12-easier-access-faster-vector-search-speeds-better-user-experience.md
---

![](https://assets.zilliz.com/What_s_New_in_2_2_12_20230720_143424_7d19280738.png)

We are thrilled to announce the latest release of Milvus 2.2.12. This update includes multiple new features, such as support for RESTful API, `json_contains` function, and vector retrieval during ANN searches in response to user feedback. We have also streamlined the user experience, enhanced the vector searching speeds, and resolved many issues. Let's delve into what we can expect from Milvus 2.2.12.

## Support for RESTful API

Milvus 2.2.12 now supports RESTful API, which enables users to access Milvus without installing a client, making client-server operations effortless. Additionally, deploying Milvus has become more convenient because the Milvus SDK and RESTful API share the same port number. 

**Note**: We still recommend using the SDK to deploy Milvus for advanced operations or if your business is latency sensitive. 

## Vector retrieval during ANN searches

In earlier versions, Milvus did not allow vector retrieval during approximate nearest neighbor (ANN) searches to prioritize performance and memory usage. As a result, retrieving raw vectors had to be split into two steps: performing the ANN search and then querying the raw vectors based on their IDs. This approach increased development costs and made it harder for users to deploy and adopt Milvus.

With Milvus 2.2.12, users can retrieve raw vectors during ANN searches by setting the vector field as an output field and querying in HNSW-, DiskANN-, or IVF-FLAT-indexed collections. In addition, users can expect a much faster vector retrieval speed. 

## Support for operations on JSON arrays

We recently added support for JSON in Milvus 2.2.8. Since then, users have sent numerous requests to support additional JSON arrays operations, such as inclusion, exclusion, intersection, union, difference, and more. In Milvus 2.2.12, we've prioritized supporting the `json_contains` function to enable the inclusion operation. We will continue to add support for other operators in future versions.

## Enhancements and bug fixes 

In addition to introducing new features, Milvus 2.2.12 has improved its vector search performance with reduced overhead, making it easier to handle extensive topk searches. Moreover, it enhances the write performance in partition-key-enabled and multi-partition situations and optimizes CPU usage for large machines. 
This update addresses various issues: excessive disk usage, stuck compaction, infrequent data deletions, and bulk insertion failures. For further information, please refer to the [Milvus 2.2.12 Release Notes](https://milvus.io/docs/release_notes.md#2212).

## Let's keep in touch!

If you have questions or feedback about Milvus, please don't hesitate to contact us through [Twitter](https://twitter.com/milvusio) or [LinkedIn](https://www.linkedin.com/company/the-milvus-project). You're also welcome to join our [Slack channel](https://milvus.io/slack/) to chat with our engineers and the community directly or check out our [Tuesday office hours](https://us02web.zoom.us/meeting/register/tZ0pcO6vrzsuEtVAuGTpNdb6lGnsPBzGfQ1T#/registration)!
