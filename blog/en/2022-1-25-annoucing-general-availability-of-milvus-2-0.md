---
id: 2022-1-25-annoucing-general-availability-of-milvus-2-0.md
title: Announcing General Availability of Milvus 2.0
author: Xiaofan Luan
date: 2022-01-25
desc: An easy way to handle massive high-dimensional data 
cover: assets.zilliz.com/Announcing_General_Availability_of_Milvus_2_0_1dfc59febc.png
tag: News
recommend: true
---

*This article is edited by [Claire Yu](https://www.linkedin.com/in/wuchuanzi-yu-claire/).*

Today, six months after the first Release Candidate (RC) was made public, we are thrilled to announce that Milvus 2.0 is General Available (GA) and production ready! It's been a long journey, and we thank everyone – community contributors, users, and the LF AI & Data Foundation – along the way who helped us make this happen.

The ability to handle billions of high dimensional data is a big deal for AI systems these days, and for good reasons:
  1. Unstructured data occupy dominant volumes compared to traditional structured data.
  2. Data freshness has never been more important. Data scientists are eager for timely data solutions rather than the traditional T+1 compromise.
  3. Cost and performance have become even more critical, and yet there still exists a big gap between current solutions and real world user cases.
Hence, Milvus 2.0. Milvus is a database that helps handle high dimensional data at scale. It is designed for cloud with the ability to run everywhere. If you've been following our RC releases, you know we've spent great effort on making Milvus more stable and easier to deploy and maintain. 

## Milvus 2.0 GA now offers

**Entity deletion**

As a database, Milvus now supports deleting entities by primary key and will support deleting entities by expression later on.

**Automatic load balance**

Milvus now supports plugin load balance policy to balance the load of each query node and data node. Thanks to the disaggregation of computation and storage, the balance will be done in just a couple of minutes.

**Handoff** 

Once growing segments are sealed through flush, handoff tasks replace growing segments with indexed historical segments to improve search performance.

**Data compaction**

Data compaction is a background task to merge small segments into large ones and clean logical deleted data.  

**Support embedded etcd and local data storage**

Under Milvus standalone mode, we can remove etcd/MinIO dependency with just a few configurations. Local data storage can also be used as a local cache to avoid loading all data into main memory.

**Multi language SDKs**

In addition to PyMilvus, Node.js, Java and Go SDKs are now ready-to-use.

**Milvus K8s Operator**

Milvus Operator provides an easy solution to deploy and manage a full Milvus service stack, including both Milvus components and its relevant dependencies (e.g. etcd, Pulsar and MinIO), to the target [Kubernetes](https://kubernetes.io/) clusters in a scalable and highly available manner.

**Tools that help to manage Milvus**

We have Zilliz to thank for the fantastic contribution of management tools. We now have Attu, which allows us to interact with Milvus via an intuitive GUI, and Milvus_CLI, a command-line tool for managing Milvus.

Thanks to all 212 contributors, the community finished 6718 commits during the last 6 months, and tons of stability and performance issues have been closed. We'll open our stability and performance benchmark report soon after the 2.0 GA release. 

## What's next?

**Functionality**

String type support will be the next killer features for Milvus 2.1. We will also bring in time to live (TTL) mechanism and basic ACL management to better satisfy user needs.

**Availability**

We are working on refactoring the query coord scheduling mechanism to support multi memory replicas for each segment. With multiple active replicas, Milvus can support faster failover and speculative execution to shorten the downtime to within a couple of seconds.

**Performance**

Performance benchmark results will soon be offered on our websites. The following releases are anticipated to see an impressive performance improvement. Our target is to halve the search latency under smaller datasets and double the system throughput.

**Ease of use**

Milvus is designed to run anywhere. We will support Milvus on MacOS (Both M1 and X86) and on ARM servers in the next few small releases. We will also offer embedded PyMilvus so you can simply `pip install` Milvus without complex environment setup.

**Community governance**

We will refine the membership rules and clarify the requirements and responsibilities of contributor roles. A mentorship program is also under development; for anyone who is interested in cloud-native database, vector search, and/or community governance, feel free to contact us.

We’re really excited about the latest Milvus GA release! As always, we are happy to hear your feedback. If you encounter any problems, don't hesitate to contact us on [GitHub](https://github.com/milvus-io/milvus) or via [Slack](http://milvusio.slack.com/).


