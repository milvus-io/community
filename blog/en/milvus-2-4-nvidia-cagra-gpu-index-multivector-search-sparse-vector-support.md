---
id: milvus-2-4-nvidia-cagra-gpu-index-multivector-search-sparse-vector-support.md
title: "Unveiling Milvus 2.4: Multi-vector Search, Sparse Vector, CAGRA Index, and More!"
author: Fendy Feng
date: 2024-3-20
desc: We are happy to announce the launch of Milvus 2.4, a major advancement in enhancing search capabilities for large-scale datasets. 
metaTitle: Milvus 2.4 Supports Multi-vector Search, Sparse Vector, CAGRA, and More!
cover: assets.zilliz.com/What_is_new_in_Milvus_2_4_1_c580220be3.png
tag: Engineering
tags: Data science, Database, Tech, Artificial Intelligence, Vector Management, Milvus
recommend: true
canonicalUrl: https://milvus.io/blog/milvus-2-4-nvidia-cagra-gpu-index-multivector-search-sparse-vector-support.md 
---

We are happy to announce the launch of Milvus 2.4, a major advancement in enhancing search capabilities for large-scale datasets. This latest release adds new features, such as support for the GPU-based CAGRA index, beta support for [sparse embeddings](https://zilliz.com/learn/sparse-and-dense-embeddings), group search, and various other improvements in search capabilities. These developments reinforce our commitment to the community by offering developers like you a powerful and efficient tool for handling and querying vector data. Let's jump into the key benefits of Milvus 2.4 together.


## Enabled Multi-vector Search for Simplified Multimodal Searches

Milvus 2.4 provides multivector search capability, allowing simultaneous search and reranking of different vector types within the same Milvus system. This feature streamlines multimodal searches, significantly enhancing recall rates and enabling developers to effortlessly manage intricate AI applications with varied data types. Additionally, this functionality simplifies the integration and fine-tuning of custom reranking models, aiding in the creation of advanced search functions like precise [recommender systems](https://zilliz.com/vector-database-use-cases/recommender-system) that utilize insights from multidimensional data.

![](https://assets.zilliz.com/How_the_multi_vector_search_feature_works_6c85961349.png)

Multivector support in Milvus has two components: 

1. The ability to store/query multiple vectors for a single entity within a collection, which is a more natural way to organize data 

2. The ability to build/optimize a reranking algorithm by leveraging the prebuilt reranking algorithms in Milvus

Besides being a highly [requested feature](https://github.com/milvus-io/milvus/issues/25639), we built this capability because the industry is moving towards multimodal models with the release of GPT-4 and Claude 3. Reranking is a commonly used technique to further improve query performance in search. We aimed to make it easy for developers to build and optimize their rerankers within the Milvus ecosystem.


## Grouping Search Support for Enhanced Compute Efficiency

Grouping Search is another often [requested feature](https://github.com/milvus-io/milvus/issues/25343) that we added to Milvus 2.4. This feature improves compute efficiency and developer productivity when handling grouped search queries. In particular, this functionality tackles the challenges associated with querying large datasets like documents or videos segmented into vectorized chunks or frames by enabling the aggregation of search results based on specific attributes. With this new feature, developers can obtain top results grouped by specified fields (BOOL, INT, or VARCHAR) with a simple query, thus removing any custom code to enable aggregation.


## Beta Support for Sparse Vector Embeddings

We have expanded the Hybrid Search in Milvus to include sparse embeddings so developers can further refine their semantically rich approximate nearest neighbor ([ANN](https://zilliz.com/glossary/anns)) searches. This feature, compatible with neural models like SPLADEv2 and statistical models like BM25, enables hybrid search strategies that combine keyword and embedding approaches. It is ideal for users seeking enhanced search accuracy without extensive customization efforts.

We are labeling this feature as “Beta” to continue our performance testing of the feature and gather feedback from the community. 


## CAGRA Index Support for Advanced GPU-Accelerated Graph Indexing

Developed by NVIDIA, [CAGRA](https://arxiv.org/abs/2308.15136) (Cuda Anns GRAph-based) is a GPU-based graph indexing technology that significantly surpasses traditional CPU-based methods like the HNSW index in efficiency and performance, especially in high-throughput environments.

With the introduction of the CAGRA Index, Milvus 2.4 provides enhanced GPU-accelerated graph indexing capability. This enhancement is ideal for building similarity search applications requiring minimal latency. Additionally, Milvus 2.4 integrates a brute-force search with the CAGRA index to achieve maximum recall rates in applications. For detailed insights, explore the [introduction blog on CAGRA](https://zilliz.com/blog/Milvus-introduces-GPU-index-CAGRA).

![](https://assets.zilliz.com/Milvus_raft_cagra_vs_milvus_hnsw_ffe0415ff5.png)


## Additional Enhancements and Features

Milvus 2.4 also includes other key enhancements, such as Regular Expression support for enhanced substring matching in [metadata filtering](https://zilliz.com/blog/metadata-filtering-with-zilliz-cloud-pipelines), a new scalar inverted index for efficient scalar data type filtering, and a Change Data Capture tool for monitoring and replicating changes in Milvus collections. These updates collectively enhance Milvus's performance and versatility, making it a comprehensive solution for complex data operations.

For more details, see [Milvus 2.4 documentation](https://milvus.io/docs/release_notes.md). 


## Stay Connected!

Excited to learn more about Milvus 2.4? [Join our upcoming webinar](https://zilliz.com/event/unlocking-advanced-search-capabilities-milvus) with James Luan, Zilliz’s VP of Engineering, for an in-depth discussion on the capabilities of this latest release. If you have questions or feedback, join our [Discord channel](https://discord.com/invite/8uyFbECzPX) to engage with our engineers and community members. Don’t forget to follow us on [Twitter](https://twitter.com/milvusio) or [LinkedIn](https://www.linkedin.com/company/the-milvus-project) for the latest news and updates about Milvus.
