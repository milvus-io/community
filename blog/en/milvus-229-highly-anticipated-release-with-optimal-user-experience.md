---
id: milvus-229-highly-anticipated-release-with-optimal-user-experience.md
title: 
> 
 Milvus 2.2.9: A Highly Anticipated Release with Optimal User Experience
author: Owen Jiao, Fendy Feng
date: 2023-06-06
cover: assets.zilliz.com/What_s_New_in_2_2_9_858e54a2d3.png
tag: News
tags: Milvus, Vector Database, Open Source, Data science, Artificial Intelligence, Vector Management
recommend: true
canonicalUrl: https://milvus.io/blog/milvus-229-highly-anticipated-release-with-optimal-user-experience.md
---

We are thrilled to announce the arrival of Milvus 2.2.9, a highly anticipated release that marks a significant milestone for the team and the community. This release offers many exciting features, including long-awaited support for JSON data types, dynamic schema, and partition keys, ensuring an optimized user experience and streamlined development workflow. Additionally, this release incorporates numerous enhancements and bug fixes. Join us in exploring Milvus 2.2.9 and discovering why this release is so exciting.

## Optimized user experience with JSON support

Milvus has introduced highly anticipated support for the JSON data type, allowing for the seamless storage of JSON data alongside the metadata of vectors within users' collections. With this enhancement, users can efficiently insert JSON data in bulk and perform advanced querying and filtering based on their JSON fields' contents. Furthermore, users can leverage expressions and perform operations tailored to their dataset's JSON fields, construct queries, and apply filters based on the content and structure of their JSON fields, allowing them to extract relevant information and manipulate data better.  

In the future, the Milvus team will add indexes for fields within the JSON type, further optimizing the performance of mixed scalar and vector queries. So stay tuned for exciting developments ahead! 

## Added flexibility with support for dynamic schema

With support for JSON data, Milvus 2.2.9 now provides dynamic schema functionality through a simplified software development kit (SDK).

Starting with Milvus 2.2.9, the Milvus SDK includes a high-level API that automatically fills dynamic fields into the hidden JSON field of the collection, allowing users to concentrate solely on their business fields.

## etter data separation and enhanced search efficiency with Partition Key

Milvus 2.2.9 enhances its partitioning capabilities by introducing the Partition Key feature. It allows user-specific columns as primary keys for partitioning, eliminating the need for additional APIs such as `loadPartition` and `releasePartition`. This new feature also removes the limit on the number of partitions, leading to more efficient resource utilization. 

## Support for Alibaba Cloud OSS

Milvus 2.2.9 now supports Alibaba Cloud Object Storage Service (OSS). Alibaba Cloud users can easily configure the `cloudProvider` to Alibaba Cloud and take advantage of seamless integration for efficient storage and retrieval of vector data in the cloud.

In addition to the previously mentioned features, Milvus 2.2.9 offers database support in Role-Based Access Control (RBAC), introduces connection management, and includes multiple enhancements and bug fixes. For more information, refer to [Milvus 2.2.9 Release Notes](https://milvus.io/docs/release_notes.md).

## Let’s keep in touch!

If you have questions or feedback about Milvus, please don't hesitate to contact us through [Twitter](https://twitter.com/milvusio) or [LinkedIn](https://www.linkedin.com/company/the-milvus-project). You're also welcome to join our [Slack channel](https://milvus.io/slack/) to chat with our engineers and the community directly or check out our [Tuesday office hours](https://us02web.zoom.us/meeting/register/tZ0pcO6vrzsuEtVAuGTpNdb6lGnsPBzGfQ1T#/registration)!