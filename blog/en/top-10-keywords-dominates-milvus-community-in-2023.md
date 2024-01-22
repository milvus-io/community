---
id: top-10-keywords-dominates-milvus-community-in-2023.md
title: Unveiling the Top 10 Keywords Dominating the Milvus Community in 2023
author: Jack Li, Fendy Feng
date: 2024-1-21
desc: This post explores the heart of the community by analyzing chat histories and revealing the top 10 keywords in discussions.
metaTitle: Top 10 Keywords Dominating the Milvus Community in 2023
cover: assets.zilliz.com/Top_10_Keywords_in_the_Milvus_Community_20240116_111204_1_f65b17a8ea.png
tag: Engineering
tags: Data science, Database, Tech, Artificial Intelligence, Vector Management, Milvus
recommend: true
canonicalUrl: https://milvus.io/blog/top-10-keywords-dominates-milvus-community-in-2023.md
---

As we conclude 2023, let's review the Milvus community's remarkable journey: boasting [25,000 GitHub Stars](https://github.com/milvus-io/milvus), the launch of [Milvus 2.3.0](https://milvus.io/blog/unveiling-milvus-2-3-milestone-release-offering-support-for-gpu-arm64-cdc-and-other-features.md), and exceeding 10 million [Docker image](https://hub.docker.com/r/milvusdb/milvus) downloads. This post explores the heart of the community by analyzing chat histories and revealing the top 10 keywords in discussions.

## #1 Version — The rise of AIGC drives rapid Milvus iteration

Surprisingly, "Version" emerged as the most discussed keyword in 2023. This revelation is rooted in the year's AI wave, with vector databases as a critical infrastructure to tackle challenges in AIGC applications' hallucination issues.

The enthusiasm around vector databases drives Milvus into a stage of swift iteration. The community witnessed the release of Twenty versions in 2023 alone, accommodating the demands of AIGC developers flooding the community with inquiries about choosing the optimal version of Milvus for various applications. For users navigating these updates, we recommend embracing the latest version for enhanced features and performance. 

If you are interested in Milvus's release planning, refer to the [Milvus Roadmap](https://wiki.lfaidata.foundation/display/MIL/Milvus+Long+Term+Roadmap+and+Time+schedule) page on the official website. 


## #2 Search — beyond Vector Search

"Search" takes second place, reflecting its fundamental role in database operations. Milvus supports various search capabilities, from Top-K ANN search to scalar filtered search and range search. The imminent release of Milvus 3.0 (Beta) promises keyword search (sparse embeddings), which many RAG app developers eagerly await.

Community discussions about searching focus on performance, capabilities, and principles. Users often ask questions about attribute filtering, setting index threshold values, and addressing latency concerns. Resources like [query and search documentation](https://milvus.io/docs/v2.0.x/search.md), [Milvus Enhancement Proposals (MEPs)](https://wiki.lfaidata.foundation/pages/viewpage.action?pageId=43287103), and Discord discussions have become the go-to references for unraveling the intricacies of searching within Milvus.


## #3 Memory — trade-offs between performance and accuracy for minimized memory overhead

“Memory” also took center stage in community discussions over the past year. As a distinctive data type, vectors inherently have high dimensions. Storing vectors in memory is a common practice for optimal performance, but the escalating data volume limits available memory. Milvus optimizes memory usage by adopting techniques like [MMap](https://zilliz.com/blog/milvus-introduced-mmap-for-redefined-data-management-increased-storage-capability) and DiskANN.

However, achieving low memory usage, excellent performance, and high accuracy simultaneously in a database system remains complex, necessitating trade-offs between performance and accuracy to minimize memory overhead.

In the case of Artificial Intelligence Generated Content (AIGC), developers usually prioritize fast responses and result accuracy over stringent performance requirements. Milvus’s addition of MMap and DiskANN minimizes memory usage while maximizing data processing and result accuracy, striking a balance that aligns with the practical needs of AIGC applications. 


## #4 Insert — smooth sailing through data insertion

Efficient data insertion is a crucial concern for developers, sparking frequent discussions on optimizing insertion speed within the Milvus community. Here are some valuable insights and recommendations about data insertions: 

- **Batch Insertion:** Opt for batch over single-row insertion for enhanced efficiency. Notably, insertion from files surpasses batch insertion in speed. When handling large datasets exceeding ten million records, consider using the `bulk_insert` interface for a streamlined and accelerated import process.

- **Strategic `flush()` Usage:** Rather than invoking the `flush()` interface after each batch, make a single call after completing all data insertion. Excessive use of the `flush()` interface between batches can lead to the generation of fragmented segment files, placing a considerable compaction burden on the system.

- **Primary Key Deduplication:** Milvus does not perform primary key deduplication when using the `insert` interface for data insertion. If you need to deduplicate primary keys, we recommend you deploy the `upsert` interface. However, the insertion performance of `upsert `is lower than that of `insert`, owing to an additional internal query operation. 


## #5 Configuration — decoding the parameter maze

Milvus is a distributed vector database that integrates many third-party components like object storage, message queues, and Etcd. Users grappled with adjusting parameters and understanding their impact on Milvus's performance, making "Configuration" a frequently discussed topic.

Among all the questions about configurations, "which parameters to adjust" is arguably the most challenging aspect, as the parameters vary in different situations. For instance, optimizing search performance parameters differs from optimizing insertion performance parameters and relies heavily on practical experience.

Once users identify "which parameters to adjust," the subsequent questions of "how to adjust" become more manageable. For specific procedures, refer to our documentation [Configure Milvus](https://milvus.io/docs/configure-helm.md). The great news is that Milvus has supported dynamic parameter adjustments since version 2.3.0, eliminating the need for restarts for changes to take effect. For specific procedures, refer to [Configure Milvus on the Fly](https://milvus.io/docs/dynamic_config.md). 


## #6 Logs — navigating the troubleshooting compass

"Logs" serve as the troubleshooter's compass. Users sought guidance in the community on exporting Milvus logs, adjusting log levels, and integrating with systems like Grafana’s Loki. Here are some suggestions about Milvus logs. 

- **How to view and export Milvus logs:** You can easily export Milvus logs with the one-click script[export-milvus-log.sh](https://github.com/milvus-io/milvus/tree/master/deployments/export-log) which is available on the GitHub repository. 

- **Log level:** Milvus has multiple log levels to accommodate diverse use cases. The info level is enough for most cases, and the debug level is for debugging. An excess of Milvus logs may signal misconfigured log levels.

- **We recommend integrating Milvus logs with a log collection system** like Loki for streamlined log retrieval in future troubleshooting.


## #7 Cluster — scaling for production environments

Given Milvus's identity as a distributed vector database, the term "cluster" is a frequent topic of discussion in the community. Conversations revolve around scaling data in a cluster, data migration, and data backup and synchronization. 

In production environments, robust scalability and high availability are standard requirements for distributed database systems. Milvus's storage-computation separation architecture allows seamless data scalability by expanding resources for computation and storage nodes, accommodating limitless data scales. Milvus also provides high availability with a multi-replica architecture and robust backup and syncing capabilities.  For more information, refer to [Coordinator HA](https://milvus.io/docs/coordinator_ha.md#Coordinator-HA).


## #8 Documentation — the gateway to understanding Milvus

"Documentation" is another frequently raised keyword in community discussions, often tied to questions about whether there is any documentation page for a specific feature and where to find it. 

Serving as the gateway to understanding Milvus, around 80% of community inquiries find answers in the [official documentation](https://milvus.io/docs). We recommend you read our documentation before using Milvus or encountering any problems. In addition, you can explore code examples in various SDK repositories for insights into using Milvus. 


## #9 Deployment — simplifying the Milvus journey

Simple deployment remains the Milvus team’s ongoing goal. To fulfill this commitment, we introduced [Milvus Lite](https://milvus.io/docs/milvus_lite.md#Get-Started-with-Milvus-Lite), a lightweight alternative to Milvus that is fully functional but has no K8s or Docker dependencies. 

We further streamlined deployment by introducing the lighter [NATS](https://zilliz.com/blog/optimizing-data-communication-milvus-embraces-nats-messaging)messaging solution and consolidating node components. Responding to user feedback, we're gearing up to release a standalone version without dependencies, with ongoing efforts to enhance features and simplify deployment operations. The rapid iteration of Milvus showcases the community's continuous commitment to the continued refinement of the deployment process.


## #10 Deletion — unraveling the impact

The prevalent discussions on "deletion" revolve around unchanged data counts after deletion, the continued retrievability of deleted data, and the failure of disk space recovery after deletion.

Milvus 2.3 introduces the `count(*)` expression to address delayed entity count updates. The persistence of deleted data in queries is probably due to the inappropriate use of [data consistency models](https://zilliz.com/blog/understand-consistency-models-for-vector-databases). Disk space recovery failure concerns prompt insights into redesigning Milvus's garbage collection mechanism, which sets a waiting period before the complete deletion of data. This approach allows a time window for potential recovery.


## Conclusion

The top 10 keywords offer a glimpse into the vibrant discussions within the Milvus community. As Milvus continues to evolve, the community remains an invaluable resource for developers seeking solutions, sharing experiences, and contributing to advancing vector databases in the era of AI. 

Join this exciting journey by joining our [Discord channel](https://discord.com/invite/8uyFbECzPX) in 2024. There, you can engage with our brilliant engineers and connect with like-minded Milvus enthusiasts. Also, attend the [Milvus Community Lunch and Learn](https://discord.com/invite/RjNbk8RR4f) every Tuesday from 12:00 to 12:30 PM PST. Share your thoughts, questions, and feedback, as every contribution adds to the collaborative spirit propelling Milvus forward. Your active participation is not just welcomed; it's appreciated. Let's innovate together!
