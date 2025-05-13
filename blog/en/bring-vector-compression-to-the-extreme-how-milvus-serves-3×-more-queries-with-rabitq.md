---
id: bring-vector-compression-to-the-extreme-how-milvus-serves-3×-more-queries-with-rabitq.md 
title: >
 Bring Vector Compression to the Extreme: How Milvus Serves 3× More Queries with RaBitQ
author: Alexandr Guzhva, Li Liu, Jiang Chen
date: 2025-05-13
desc: Discover how Milvus leverages RaBitQ to enhance vector search efficiency, reducing memory costs while maintaining accuracy. Learn to optimize your AI solutions today!
cover: assets.zilliz.com/Bring_Vector_Compression_to_the_Extreme_How_Milvus_Serves_3_More_Queries_with_Ra_Bit_Q_12f5b4d932.jpg
tag: Engineering
recommend: true
publishToMedium: true
tags: Milvus, vector database, vector search, AI Agents, LLM
meta_keywords:  Vector Quantization, binary quantization, RaBitQ, vector compression, Milvus vector database 
meta_title: > 
 Bring Vector Compression to the Extreme: How Milvus Serves 3× More Queries with RaBitQ
origin: https://milvus.io/blog/bring-vector-compression-to-the-extreme-how-milvus-serves-3×-more-queries-with-rabitq.md
---


[Milvus](https://milvus.io/docs/overview.md) is an open-source, highly scalable vector database powering semantic search at a billion-vector scale. As users deploy RAG chatbots, AI customer service, and visual search at this magnitude, a common challenge emerges: **infrastructure costs.** While exponential business growth is exciting, skyrocketing cloud bills are not. Fast vector search typically requires storing vectors in memory, which is expensive. Naturally, you might ask: _can we compress vectors to save space without sacrificing search quality?_

The answer is **YES**, and in this blog, we'll show you how our implementation of a novel technique called [**RaBitQ**](https://dl.acm.org/doi/pdf/10.1145/3654970) enables Milvus to serve 3× more traffic with lower memory cost while still maintaining comparable accuracy. We’ll also share the practical lessons learned from integrating RaBitQ into both open-source Milvus and the fully-managed Milvus service on [Zilliz Cloud](https://zilliz.com/cloud).

![](https://assets.zilliz.com/Bring_Vector_Compression_to_the_Extreme_How_Milvus_Serves_3_More_Queries_with_Ra_Bit_Q_12f5b4d932.jpg)


## Understanding Vector Search and Compression

Before diving into RaBitQ, let's understand the challenge. 

At the heart of a vector database are [**Approximate Nearest Neighbor (ANN)**](https://zilliz.com/glossary/anns) search algorithms—finding the top-k vectors closest to a given query. A vector is a coordinate in high-dimensional space, often comprising hundreds of floating-point numbers. As vector data scales up, so do storage and compute demands. For instance, running [HNSW](https://zilliz.com/learn/hierarchical-navigable-small-worlds-HNSW) (an ANN search algorithm) with one billion 768-dimensional vectors in FP32 requires over 3TB of memory!

Just like MP3 compresses audio by discarding frequencies imperceptible to the human ear, vector data can be compressed with minimal impact on search accuracy. Research shows that full-precision FP32 is often unnecessary for ANN. [Scalar Quantization](https://zilliz.com/learn/scalar-quantization-and-product-quantization) (SQ), a popular compression technique, for example, maps floating-point values into discrete bins and stores only the bin indices using low-bit integers. By representing the same information with fewer bits, quantization methods significantly reduce memory usage. Research in this domain strives to achieve the most savings with the least loss in accuracy.

The most extreme compression technique—1-bit Scalar Quantization, also known as [Binary Quantization](https://zilliz.com/learn/scalar-quantization-and-product-quantization)—represents each float with just a single bit. Compared to FP32 (32-bit encoding), this reduces memory usage by 32×. Since memory is often the main bottleneck in vector search, such compression can significantly boost performance. **The challenge, however, lies in preserving search accuracy.** Typically, 1-bit SQ reduces recall to below 70%, making it practically unusable.

This is where **RaBitQ** stands out—an excellent compression technique that achieves 1-bit quantization while preserving high recall. Milvus now supports RaBitQ starting from version 2.6, enabling the vector database to serve 3× the QPS while maintaining a comparable level of accuracy. 


## A Brief Intro to RaBitQ

[RaBitQ](https://dl.acm.org/doi/pdf/10.1145/3654970) is a smartly designed binary quantization method that leverages the geometry property of high-dimensional space to achieve efficient and accurate vector compression.

At first glance, reducing each dimension of a vector to a single bit may seem too aggressive, but in high-dimensional space, our intuitions often fail us. As Jianyang Gao, an author of RaBitQ,[ illustrated](https://dev.to/gaoj0017/quantization-in-the-counterintuitive-high-dimensional-space-4feg), high-dimensional vectors exhibit the property that individual coordinates tend to be tightly concentrated around zero, a result of a counterintuitive phenomenon explained in[ Concentration of Measure](https://en.wikipedia.org/wiki/Concentration_of_measure). This makes it possible to discard much of the original precision while still preserving the relative structure needed for an accurate nearest neighbor search.

![](https://assets.zilliz.com/Figure_The_counterintuitive_value_distribution_in_high_dimensional_geometry_fad6143bfd.png)

Figure: The counterintuitive value distribution in high-dimensional geometry.

Consider the value of the first dimension for a random unit vector uniformly sampled from the unit sphere; the values are uniformly spread in 3D space. However, for high-dimensional space (e.g., 1000D), the values concentrate around zero, an unintuitive property of high-dimensional geometry. (Image source: [Quantization in The Counterintuitive High-Dimensional Space](https://dev.to/gaoj0017/quantization-in-the-counterintuitive-high-dimensional-space-4feg)) 

Inspired by this property of high-dimensional space, **RaBitQ focuses on encoding angular information rather than exact spatial coordinates**. It does this by normalizing each data vector relative to a reference point such as the centroid of the dataset. Each vector is then mapped to its nearest vertex on the hypercube, allowing representation with just 1 bit per dimension. This approach naturally extends to `IVF_RABITQ`, where normalization is done relative to the closest cluster centroid, improving local encoding accuracy.

![](https://assets.zilliz.com/Figure_Compressing_a_vector_by_finding_its_closest_approximation_on_the_hypercube_so_that_each_dimension_can_be_represented_with_just_1_bit_cd0d50bb30.png)

_Figure: Compressing a vector by finding its closest approximation on the hypercube, so that each dimension can be represented with just 1 bit. (Image source:_ [_Quantization in The Counterintuitive High-Dimensional Space_](https://dev.to/gaoj0017/quantization-in-the-counterintuitive-high-dimensional-space-4feg)_)_ 

To ensure search remains reliable even with such compressed representations, RaBitQ introduces a **theoretically grounded, unbiased estimator** for the distance between a query vector and binary-quantized document vectors. This helps minimize reconstruction error and sustain high recall.

RaBitQ is also highly compatible with other optimization techniques, such as[ FastScan](https://www.vldb.org/pvldb/vol9/p288-andre.pdf) and[ random rotation preprocessing](https://github.com/facebookresearch/faiss/wiki/Pre--and-post-processing). Moreover, RaBitQ is **lightweight to train and fast to execute**. Training involves simply determining the sign of each vector component, and search is accelerated via fast bitwise operations supported by modern CPUs. Together, these optimizations enable RaBitQ to deliver high-speed search with minimal loss of accuracy.


## Engineering RaBitQ in Milvus: From Academic Research to Production

While RaBitQ is conceptually straightforward and accompanied by a[ reference implementation](https://github.com/gaoj0017/RaBitQ), adapting it in a distributed, production-grade vector database like Milvus presented several engineering challenges. We've implemented RaBitQ in Knowhere, the core vector search engine behind Milvus, and also contributed an optimized version to the open-source ANN search library[ FAISS](https://github.com/facebookresearch/faiss).

Let's look at how we brought this algorithm to life in Milvus.


### Implementation Tradeoffs 

One important design decision involved handling **per-vector auxiliary data**. RaBitQ requires two floating-point values per vector pre-computed during indexing time, and a third value that can either be computed on-the-fly or pre-computed. In Knowhere, we chose to precompute this value at indexing time and store it to improve efficiency during search. In contrast, the FAISS implementation conserves memory by calculating it at query time, taking a different tradeoff between memory usage and query speed.


### Hardware Acceleration

Modern CPUs offer specialized instructions that can significantly accelerate binary operations. We tailored the distance computation kernel to take advantage of modern CPU instructions. Since RaBitQ relies on popcount operations, we created a specialized path in Knowhere that uses the `VPOPCNTDQ` instructions for AVX512 when available. On supported hardware (e.g., Intel IceLake or AMD Zen 4), this can accelerate binary distance computations by several factors compared to default implementations.


### Query Optimization

Both Knowhere (Milvus’s search engine) and our optimized FAISS version support scalar quantization (SQ1–SQ8) on query vectors. This provides additional flexibility: even with 4-bit query quantization, recall remains high while computational demands decrease significantly, which is particularly useful when queries must be processed at high throughput. 

We go a step further in optimizing our proprietary Cardinal engine, which powers the fully managed Milvus on Zilliz Cloud. Beyond the capabilities of the open-source Milvus, we introduce advanced enhancements, including integration with a graph-based vector index, additional layers of optimization, and support for Arm SVE instructions.


## The Performance Gain: 3× More QPS with Comparable Accuracy

Starting with version 2.6, Milvus introduces the new `IVF_RABITQ` index type. This new index combines RaBitQ with IVF clustering, random rotation transformation, and optional refinement to deliver an optimal balance of performance, memory efficiency, and accuracy.


### Using IVF_RABITQ in Your Application

Here's how to implement `IVF_RABITQ` in your Milvus application:


```
from pymilvus import MilvusClient

index_params = MilvusClient.prepare_index_params()

index_params.add_index(
    field_name="your_vector_field_name", # Name of the vector field to be indexed
    index_type="IVF_RABITQ", # Will be introduced in Milvus 2.6
    index_name="vector_index", # Name of the index to create
    metric_type="IP", # IVF_RABITQ supports IP and COSINE
    params={
        "nlist": 1024, # IVF param, specifies the number of clusters
    } # Index building params
)
```

### Benchmarking: Numbers Tell the Story

We benchmarked different configurations using[ vdb-bench](https://github.com/zilliztech/vectordbbench), an open-source benchmarking tool for evaluating vector databases. Both the test and control environments use Milvus Standalone deployed on AWS EC2 `m6id.2xlarge` instances. These machines feature 8 vCPUs, 32 GB of RAM, and an Intel Xeon 8375C CPU based on the Ice Lake architecture, which supports the VPOPCNTDQ AVX-512 instruction set.

We used the Search Performance Test from vdb-bench, with a dataset of 1 million vectors, each with 768 dimensions. Since the default segment size in Milvus is 1 GB, and the raw dataset (768 dimensions × 1M vectors × 4 bytes per float) totals roughly 3 GB, the benchmarking involved multiple segments per database.

![](https://assets.zilliz.com/Figure_Example_test_configuration_in_vdb_bench_000142f634.png)

Figure: Example test configuration in vdb-bench.

Here are some low level details about the configuration knobs for IVF, RaBitQ and refinement process: 

- `nlist` and `nprobe` are standard parameters for all `IVF`-based methods

- `nlist` is a non-negative integer that specifies the total number of IVF buckets for the dataset.

- `nprobe` is a non-negative integer that specifies the number of IVF buckets that are visited for a single data vector during the search process. It is a search-related parameter.

- `rbq_bits_query` specifies the level of quantization of a query vector. Use 1..8 values for the `SQ1`..`SQ8` levels of quantization. Use 0 value to disable quantization. It is a search-related parameter.

- `refine`, `refine_type` and `refine_k` parameters are standard parameters for the refine process

- `refine` is a boolean that enables the refinement strategy.

- `refine_k` is a non-negative fp-value. The refining process uses a higher quality quantization method to pick the needed number of nearest neighbors from a `refine_k` times larger pool of candidates, chosen using `IVFRaBitQ`. It is a search-related parameter.

- `refine_type` is a string that specifies the quantization type for a refining index. Available options are `SQ6`, `SQ8`, `FP16`, `BF16` and `FP32` / `FLAT`.

The results reveal important insights:

![](https://assets.zilliz.com/Figure_Cost_and_performance_comparison_of_baseline_IVF_FLAT_IVF_SQ_8_and_IVF_RABITQ_with_different_refinement_strategies_9f69fa449f.png)

Figure: Cost and performance comparison of baseline (IVF_FLAT), IVF_SQ8 and IVF_RABITQ with different refinement strategies

Compared to the baseline `IVF_FLAT` index, which achieves 236 QPS with 95.2% recall, `IVF_RABITQ` reaches significantly higher throughput—648 QPS with FP32 queries and 898 QPS when paired with SQ8-quantized queries. These numbers demonstrate the performance advantage of RaBitQ, especially when refinement is applied.

However, this performance comes with a noticeable trade-off in recall. When `IVF_RABITQ` is used without refinement, recall levels off at around 76%, which may fall short for applications that require high accuracy. That said, achieving this level of recall using 1-bit vector compression is still impressive.

Refinement is essential for recovering accuracy. When configured with SQ8 query and SQ8 refinement, `IVF_RABITQ` delivers both great performance and recall. It maintains a high recall of 94.7%, nearly matching IVF_FLAT, while achieving 864 QPS, over 3× higher than IVF_FLAT. Even compared with another popular quantization index `IVF_SQ8`, `IVF_RABITQ` with SQ8 refinement achieves more than half of the throughput at similar recall, only with a marginal more cost. This makes it an excellent option for scenarios that demand both speed and accuracy.

In short, `IVF_RABITQ` alone is great for maximizing throughput with acceptable recall, and becomes even more powerful when paired with refinement to close the quality gap, using only a fraction of the memory space compared to `IVF_FLAT`.


## Conclusion

RaBitQ marks a significant advancement in vector quantization technology. By combining binary quantization with smart encoding strategies, it achieves what seemed impossible: extreme compression with minimal accuracy loss.

Starting with the upcoming version 2.6, Milvus will introduce IVF_RABITQ, integrating this powerful compression technique with IVF clustering and refinement strategies to bring binary quantization to production. This combination creates a practical balance between accuracy, speed, and memory efficiency that can transform your vector search workloads.

We're committed to bringing more innovations like this to both open-source Milvus and its fully managed service on Zilliz Cloud, making vector search more efficient and accessible for everyone.

Stay tuned for the Milvus 2.6 release with many more powerful features, and join our community at[ milvus.io/discord](https://milvus.io/discord) to learn more, share your experiences, or ask questions.




