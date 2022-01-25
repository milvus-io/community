---
id: 2022-01-07-year-in-review.md
title: Milvus in 2021 - Year in Review
author: Xiaofan Luan
date: 2022-01-07
desc: Learn what Milvus community has achieved and what's in store for year 2022.
cover: assets.zilliz.com/1_ca3747f982.png
tag: Events
---

2021 was an amazing year for Milvus as an open-source project. I want to take a moment to thank all the contributors and users of Milvus, as well as partners for contributing to such an outstanding year.

**One of the most impressive moments of this year for me is the release of Milvus 2.0. Before we started this project, only a few community members believed that we could deliver the most advanced vector database in the world , but now I am proud to say that Milvus 2.0 GA is production-ready.**

We’re already working on a new and exciting set of challenges for 2022, but I thought it would be fun to celebrate a couple of the big steps we took last year. Here are a few:


## Community Growth

First, here’s a summary of community statistics from GitHub and Slack. By the end of December 2021:

- **Contributors** have increased from 121 in December 2020 to 209 in December 2021 (up 172%)

- **Stars** have increased from 4828 in December 2020 to 9090 in December 2021 (up 188%)

- **Forks** have increased from 756 in December 2020 to 1383 in December 2021 (up 182%)

- **Slack members** have increased from 541  in December 2020 to 1233 in December 2021 (up 227%)


![img](https://assets.zilliz.com/1_1_e94deb087f.png)

## Community Governance and Advocacy

When Milvus first went open source in Oct. 2019, we had a relatively small team and a small community, so naturally the project was mainly governed by a few core team members. But since then the community had grown significantly, we realized that we needed a better system to run the project so we could welcome new contributors more efficiently. 

As a result, we have appointed 5 new maintainers in 2021 to keep track of the ongoing work and reported issues to make sure that they get reviewed and merged in a timely manner. The GitHub IDs of the five maintainers are @xiaofan-luan; @congqixia; @scsven; @czs007; @yanliang567. Please feel free to contact these maintainers if you need help with your PRs.

We've also launched the [Milvus Advocate Program](https://milvus.io/community/milvus_advocate.md), and we welcome more people to join us to share your experiences, offer help to community members and gain recognition in return.


![img](https://assets.zilliz.com/1_2_835f379fb0.png)

(Image: Milvus GitHub contributors, made with dynamicwebpaige's [project](https://github.com/dynamicwebpaige/nanowrimo-2021/blob/main/15_VS_Code_contributors.ipynb) )


## Milvus Project Announcements and Milestones

1. **Number of version releases：14**

- [Milvus 1.0 release](https://milvus.io/blog/Whats-Inside-Milvus-1.0.md?page=4#all)
- [Milvus 2.0 release RC](https://milvus.io/blog/milvus2.0-redefining-vector-database.md?page=2#all) 
- [Milvus 2.0 release PreGA](https://milvus.io/docs/v2.0.0/release_notes.md#v200-PreGA)

2. **Milvus v2.0.0 GA supported SDKs**

- PyMilvus (Available)

- Go SDK (Available)

- Java SDK (Available)

- Node.js SDK (Available)

- C++ SDK (Developing)

3. **New Milvus tools launched:**

- [Milvus_CLI](https://github.com/zilliztech/milvus_cli#community) (Milvus Command Line)
- [Attu](https://github.com/zilliztech/attu) (Milvus Management GUI)
- [Milvus K8s Operator](https://github.com/milvus-io/milvus-operator)

4. **[Milvus became a graduation project of LF AI & Data Foundation.](https://lfaidata.foundation/blog/2021/06/23/lf-ai-data-foundation-announces-graduation-of-milvus-project/)**

5. **[Milvus: A Purpose-Built Vector Data Management System published in SIGMOD'2021.](https://www.cs.purdue.edu/homes/csjgwang/pubs/SIGMOD21_Milvus.pdf))**

6. **[Milvus Community Forum launched.](https://discuss.milvus.io/)**

## Community Events

We have hosted and joined many events this year so our global community members can meet (mostly virtually) despite the current Covid-19 situation. In total, we have attended 21 conferences and hosted:

- 6 Technical Meetings
- 7 Milvus Office Hours
- 34 Webinars
- 3 Offline Meetups

We are planning for more events in 2022. If you want to join the events near you, please check the [Events and Meetup](https://discuss.milvus.io/c/events-and-meetups/13) category in our community forum to see the upcoming events and their locations. If you'd like to be our speaker or host for the future events, please contact us at [community@milvus.io](mailto:community@milvus.io).

## Looking Ahead to 2022- Roadmap & Announcement

**Community:**

1. Improve Milvus Project Membership to attract/elect more maintainers and committers to build the community together.
2. Launch Mentorship Program to offer more help to newcomers who want to join the community and contribute.
3. Improve community document governance, including **Technical documents, user guides and community documents**. In 2022, hopefully our community members can complete a Milvus Handbook together so people can learn how to use Milvus better.
4. Strengthen the cooperation and interaction with other open source communities, including upstream AI communities and communities like Kubernetes, MinIO, etcd and Pulsar which Milvus relies on.
5. Become more community-driven by having more regular SIG meetings. Besides the sig-pymilvus that is currently running, our plan is to have more SIGs in 2022.


**Milvus Project:**

1. Performance tuning

Excellent performance has always been an important reason why users choose Milvus. In 2022, we plan to start a performance optimization project to increase throughput and delay by at least twice. We also plan to introduce memory replicas to improve throughput and system stability under small data set, and support GPU to accelerate index building and online serving.

2. Functionality

Milvus 2.0 has already supported functionalities such as vector/scalar hybrid search, entity deletion and time travel. We plan to support the following features in the next two major releases:

- Support for richer data types: String, Blob, Geospatial, etc. 
- Role-based access control
- Primary key deduplication
- Support for range search on vectors (search where distance < 0.8)
- Restful API support, and other language SDKs

3. Ease of use

In the coming year we plan to develop several tools to help better deploy and manage Milvus.

- Milvus up:  A deployment component that helps users to bring up Milvus in an offline environment without K8s cluster. It also helps to deploy monitoring, tracing and other Milvus development.

- Attu — We'll keep improving Attu as our cluster management system. We are planing to add functionalities such as health diagnosis and index optimization.

- Milvus DM: Data migration tool for migrating vectors from other database or files to Milvus. We'll first support FAISS, HNSW, Milvus 1.0/2.0, then other databases such as MySQL and Elasticsearch.

## About the author

Xiaofan Luan, partner and Engineering Director of Zilliz, and Technical Advisory Committee member of LF AI & Data Foundation. He worked successively in the Oracle US headquarters and Hedvig, a software defined storage startup. He joined Alibaba Cloud Database team and was in charge of the development of  NoSQL database HBase and  Lindorm. Luan obtained his master's degree in Electronic Computer Engineering from Cornell University.
