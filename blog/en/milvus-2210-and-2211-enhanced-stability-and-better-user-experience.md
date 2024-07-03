---
id: milvus-2210-and-2211-enhanced-stability-and-better-user-experience.md
title: "Milvus 2.2.10 & 2.2.11: Minor Updates for Enhanced System Stability and User Experience"
author: Fendy Feng, Owen Jiao 
date: 2023-07-06
cover: assets.zilliz.com/What_s_New_in_Milvus_2_2_10_and_2_2_11_5018946465.png
tag: News
tags: Milvus, Vector Database, Open Source, Data science, Artificial Intelligence, Vector Management
desc: introducing new features and improvements of Milvus 2.2.10 and 2.2.11
recommend: true
metaTitle: Milvus 2.2.10 & 2.2.11 Enhanced System Stability and User Experience
canonicalUrl: https://milvus.io/blog/milvus-2210-and-2211-enhanced-stability-and-better-user-experience.md
---

![](https://assets.zilliz.com/What_s_New_in_Milvus_2_2_10_and_2_2_11_5018946465.png)


Greetings, Milvus fans! We're excited to announce that we have just released Milvus 2.2.10 and 2.2.11, two minor updates primarily focusing on bug fixes and overall performance improvement. You can expect a more stable system and a better user experience with the two updates. Let’s take a quick look at what is new in these two releases. 

## Milvus 2.2.10

Milvus 2.2.10 has fixed occasional system crashes, accelerated loading and indexing, reduced memory usage in data nodes, and made many other improvements. Below are some notable changes: 

- Replaced the old CGO payload writer with a new one written in pure Go, reducing memory usage in data nodes.
- Added `go-api/v2` to the `milvus-proto` file to prevent confusion with different `milvus-proto` versions. 
- Upgraded Gin from version 1.9.0 to 1.9.1 to fix a bug in the `Context.FileAttachment` function.
- Added role-based access control (RBAC) for the FlushAll and Database APIs.
- Fixed a random crash caused by the AWS S3 SDK.
- Improved the loading and indexing speeds. 

For more details, see [Milvus 2.2.10 Release Notes](https://milvus.io/docs/release_notes.md#2210). 

## Milvus 2.2.11

Milvus 2.2.11 has resolved various issues to improve the system's stability. It has also improved its performance in monitoring, logging, rate limiting, and interception of cross-cluster requests. See below for the highlights of this update. 

- Added an interceptor to the Milvus GRPC server to prevent any issues with Cross-Cluster routing.
- Added error codes to the minio chunk manager to make diagnosing and fixing errors easier. 
- Utilized a singleton coroutine pool to avoid wasting coroutines and maximize the use of resources. 
- Reduced the disk usage for RocksMq to one-tenth of its original level by enabling zstd compression.
- Fixed occasional QueryNode panic during loading.
- Rectified the read request throttling issue caused by miscalculating queue length twice.
- Fixed issues with GetObject returning null values on MacOS.
- Fixed a crash caused by incorrect use of the noexcept modifier.

For more details, see [Milvus 2.2.11 Release Notes](https://milvus.io/docs/release_notes.md#2211). 

## Let’s keep in touch!

If you have questions or feedback about Milvus, please don't hesitate to contact us through [Twitter](https://twitter.com/milvusio) or [LinkedIn](https://www.linkedin.com/company/the-milvus-project). You're also welcome to join our [Slack channel](https://milvus.io/slack/) to chat with our engineers and the community directly or check out our [Tuesday office hours](https://us02web.zoom.us/meeting/register/tZ0pcO6vrzsuEtVAuGTpNdb6lGnsPBzGfQ1T#/registration)!

