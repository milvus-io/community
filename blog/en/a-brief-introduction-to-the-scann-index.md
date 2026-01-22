---
id: a-brief-introduction-to-the-scann-index.md
title: >
 A Brief Introduction to the ScaNN Index 
author: Jack Li
date: 2026-01-21
cover: assets.zilliz.com/scann_cover_9a9787ee8a.png
tag: Engineering
recommend: false
publishToMedium: true
tags: Milvus, vector database
meta_keywords: ScaNN index, IVFPQ, vector similarity search, ANN, Milvus
meta_title: >
 A Brief Introduction to the ScaNN Index and How It Improves IVFPQ
desc: >
 A deep dive into the ScaNN index: how it improves IVFPQ with score-aware quantization and 4-bit FastScan, plus benchmark results from Milvus on the Cohere1M dataset.
origin: https://milvus.io/blog/a-brief-introduction-to-the-scann-index.md
---

[ScaNN](https://github.com/google-research/google-research/tree/master/scann) is Google’s answer to a familiar challenge in large-scale vector search: how to increase query throughput and reduce memory usage without taking an unacceptable hit to result quality. Conceptually, ScaNN starts from the classic IVF+PQ recipe—coarse clustering plus aggressive product quantization—but layers on two important innovations that meaningfully shift the performance frontier:

-   A score-aware quantization objective that better preserves the relative ordering of true neighbors, improving ranking quality even under heavy compression.
    
-   FastScan is a SIMD-optimized 4-bit PQ lookup path that reduces the traditional memory-load bottleneck by keeping more work inside CPU registers.
    

In practice, it is a strong choice when you are okay with trading some recall for high QPS and a much smaller memory footprint (often compressing vectors to ~1/16 of the original size), such as in recall-insensitive recommendation workloads.

In this post, we’ll revisit IVFPQ as the baseline, explore the key optimizations ScaNN introduces on top of it, and wrap up with experimental results that ground the discussion in measured performance.

## IVFPQ Recap

ScaNN was proposed by Google in 2020, and the paper reports a 3× performance improvement over HNSW on the GloVe dataset. You can refer to the [original paper](https://arxiv.org/pdf/1908.10396.pdf) and the [open-source implementation](https://github.com/google-research/google-research/tree/master/scann) for details. 

Before introducing ScaNN, we’ll briefly recap IVFPQ, since ScaNN is built on top of the same overall framework.

IVFPQ stands for Inverted File with Product Quantization, an algorithm used for efficient and large-scale Approximate Nearest Neighbor (ANN) search in high-dimensional vector databases. It is a hybrid approach that combines two techniques, the inverted file index (IVF) and product quantization (PQ), to balance search speed, memory usage, and accuracy. 

### How IVFPQ Works

The process involves two main steps during indexing and searching: 

- IVF layer: vectors are clustered into `nlist` inverted lists (clusters). At query time, you visit only a subset of clusters (`nprobe`) to trade off recall and latency/throughput.

![](https://assets.zilliz.com/ivf1_5e3d29c392.png)

- PQ layer: within each visited cluster, each D-dimensional vector is split into m subvectors, each of dimension (D/m). Each subvector is quantized by assigning it to the nearest centroid in its sub-codebook. If a sub-codebook has 256 centroids, each subvector can be represented by a `uint8` code (an ID in [0, 255]).

![](https://assets.zilliz.com/pq2_6695c9cc6f.png)

Distance computation can then be rewritten as the sum over subvectors:

**D(q, X) = D(q, u0) + D(q, u1) + D(q, u2) + ... + D(q, un)**

**= L(q, id1) + L(q, id2) + L(q, id3) + ... + L(q, idn)**

Here, L represents a lookup table. At query time, the lookup table is constructed, recording the distance between the query and each quantized subvector. All subsequent distance computations are converted into table lookups followed by summation.

![](https://assets.zilliz.com/query_vector3_75d47bdd53.png)

For example, for 128-dimensional vectors split into 32 subvectors of 4 dimensions each, if each subvector is encoded by a `uint8` ID, the storage cost per vector drops from (128 x 4) bytes to (32 x 1) bytes—a 1/16 reduction.

## ScaNN Optimizations Based on IVFPQ

In summary, ScaNN improves IVFPQ in two aspects:

1.  Quantization: ScaNN proposes an objective beyond simply replacing each subvector with its nearest k-means centroid (i.e., minimizing reconstruction error).
    
2.  Lookup efficiency: ScaNN accelerates LUT-based search, which is often memory-bound, via a SIMD-friendly FastScan path.
    

### Score-aware Quantization Loss

ScaNN adopts a quantization approach different from traditional PQ—this is the process shown in the second diagram above, which differs from PQ. In traditional PQ quantization, each vector needs to be assigned to a quantization center by computing distances to different quantization centers and selecting the one with the minimum distance. The objective is essentially to minimize the quantization error introduced when replacing $$x_i$$ with $$\tilde{x_i}$$: 

$$\begin{aligned} \sum\_{i=1}^n\left\\|x\_i-\tilde{x\_i}\right\\|^2 \end{aligned}$$.

ScaNN modifies this process. First, it introduces the concept of loss, which differs slightly from the quantization error above. This loss refers to the error between the actual distance between two vectors and the approximate distance computed using the quantization method. ScaNN primarily targets Inner Product (IP) distance. The IP distance error and query vector distribution can be described by the formula: $$\mathbb{E}_q \sum^n\left(\left\langle q, x_i\right\rangle-\left\langle q, \tilde{x}_i\right\rangle\right)^2=\mathbb{E}_q \sum^n\left\langle q, x_i-\tilde{x}_i\right\rangle^2$$

If the query vector q is assumed to be isotropic, then $$\mathbb{E} [qq^T] = cI$$, where $$I$$ is the identity matrix. Therefore, the loss function can be simplified to:

$$\begin{aligned} \sum_{i=1}^n \mathbb{E}_q\left\langle q, x_i-\tilde{x_i}\right\rangle^2 &=\sum_{i=1}^n \mathbb{E}_q\left(x_i-\tilde{x_i}\right)^T q q^T\left(x_i-\tilde{x_i}\right) \\ &=c \sum_{i=1}^n\left\|x_i-\tilde{x_i}\right\|^2 \end{aligned}$$

ScaNN argues that this loss function is not optimal because, for a given query, data points closer to the query are more important. Reducing the quantization error for these data points is more critical for the results. Therefore, ScaNN proposes a score-aware quantization loss: 

$$\ell\left(x\_i, \tilde{x}\_i, w\right)=\mathbb{E}\_{q \sim \mathcal{Q}}\left\[w\left(\left\langle q, x\_i\right\rangle\right)\left\langle q, x\_i-\tilde{x}\_i\right\rangle^2\right] $$.

Here, w represents the weight. 

![](https://assets.zilliz.com/score_aware_quantization_loss_d9d36223c2.png)

However, this introduces a challenge: this weight is query-aware, meaning we can only compute this loss after knowing the query. Therefore, certain assumptions and transformations are needed to eliminate the explicit dependence on q, enabling index construction during the offline phase.

The paper decomposes the error $$x_i-\tilde{x_i}$$ into components parallel and perpendicular to $$x_i$$, and a larger penalty should be applied to the parallel component. The loss is expressed as: $$\begin{aligned} \ell\left(x_i, \tilde{x}_i, w\right) &=h_{\|}\left(w,\left\|x_i\right\|\right)\left\|r_{\|}\left(x_i, \tilde{x}_i\right)\right\|^2 +h_{\perp}\left(w,\left\|x_i\right\|\right)\left\|r_{\perp}\left(x_i, \tilde{x}_i\right)\right\|^2 \end{aligned}$$

Why should a larger penalty be applied to the parallel component?

First, if x is a near neighbor of q1, then the direction of x is similar to q1, so the parallel component of x can be approximately considered parallel to q1 as well, and this parallel component will increase the error.

![](https://assets.zilliz.com/quantizer_f0e39762a4.png)

Since the analysis is based on the IP metric, after ScaNN decomposes the quantization error into parallel and perpendicular components, only the parallel component affects the result, so a larger penalty term should be applied. Consequently, the loss function can be rewritten as follows:

$$\begin{aligned} \ell\left(x_i, \tilde{x}_i, w\right) &=h_{\|}\left(w,\left\|x_i\right\|\right)\left\|r_{\|}\left(x_i, \tilde{x}_i\right)\right\|^2 +h_{\perp}\left(w,\left\|x_i\right\|\right)\left\|r_{\perp}\left(x_i, \tilde{x}_i\right)\right\|^2 \end{aligned}$$

The figure below shows a two-dimensional example illustrating that the error caused by the parallel component is larger and can lead to incorrect nearest neighbor results, thus warranting a more severe penalty.

![The left figure shows poor quantization because the parallel offset affects the final result, while the right figure shows better quantization.](https://assets.zilliz.com/quantization_cp_81e23dd1df.png)

### 4-bit PQ FastScan

Let's first review the PQ computation process: during querying, the distances between the query and subvector cluster centers are pre-computed to construct a lookup table. Distance computation is then performed through table lookups to obtain segment distances and sum them.

![](https://assets.zilliz.com/PQ_Fast_Scan1_248c53bc93.png)

However, frequent memory reads still become a performance bottleneck. If the lookup table can be made small enough to fit in registers, memory read operations can be transformed into efficient CPU SIMD instructions.

First, each subvector is clustered into 16 classes, so a 4-bit value can represent a cluster center—this is the origin of the name "4-bit PQ." Then, distances typically represented as floats are further converted to uint8 using Scalar Quantization (SQ). This way, the lookup table for one subvector can be stored in a register using 16 × 8 = 128 bits.

![](https://assets.zilliz.com/PQ_Fast_Scan2_07b9589195.png)

Finally, let's examine the register storage layout (using AVX2 instruction set as an example): the subvectors of 32 vectors are placed in a 128-bit register, combined with the lookup table. The "lookup" operation can then be efficiently completed using a single SIMD shuffle CPU instruction.

![register layout](https://assets.zilliz.com/register_layout_b2bf8c2b2b.png)

![SIMD Shuffle for Lookup](https://assets.zilliz.com/SIMD_Shuffle_for_Lookup_c86e6d9657.png)

Here's an interesting observation: the ScaNN paper focuses entirely on the first optimization, which is reasonable since it can be considered an algorithm paper emphasizing mathematical derivations. However, the experimental results presented in the paper are remarkably impressive.

![The experimental results presented in the ScaNN paper.](https://assets.zilliz.com/experimental_results_a46ec830a7.png)

Intuitively, optimizing the loss alone should not produce such dramatic effects. Another [blog](https://medium.com/@kumon/similarity-search-scann-and-4-bit-pq-fastscan-ab98766b32bd) has also pointed this out—what really makes the difference is the 4-bit PQ FastScan portion.

## Experimental Results

Using the vector database benchmark tool [VectorDBBench](https://github.com/zilliztech/VectorDBBench), we conducted a simple test. ScaNN's performance advantage over traditional IVFFLAT and IVF_PQ is quite evident. After integration into Milvus, on the Cohere1M dataset at the same recall rate, QPS can reach 5x that of IVFFLAT and 6x that of IVF_PQ.

However, QPS is slightly lower than that of graph-based indexes like HNSW, so it is not the first choice for high-QPS use cases. But for scenarios with lower recall, it is acceptable (such as in some recommendation systems), using ScaNN without loading raw data can achieve impressive QPS with an extremely low memory footprint (1/16 of the original data), making it an excellent index choice.

| Index_Type | Case | QPS | latency(p99) | recall | memory |
| --- | --- | --- | --- | --- | --- |
| IVFFLAT | Performance1M | 266 | 0.0173s | 0.9544 | 3G |
| HNSW | Performance1M | 1885 | 0.0054s | 0.9438 | 3.24G |
| IVF_PQ | Performance1M | 208 | 0.0292s | 0.928 | 0.375G |
| ScaNN（with_raw_data: true） | Performance1M | 1215 | 0.0069s | 0.9389 | 3.186G |
| ScaNN（with_raw_data: false） | Performance1M | 1265 | 0.0071s | 0.7066 | 0.186G |

## Conclusion

ScaNN builds on the familiar IVFPQ framework but pushes it significantly further through deep engineering work in both quantization and low-level lookup acceleration. By aligning the quantization objective with ranking quality and eliminating memory bottlenecks in the inner loop, ScaNN combines score-aware quantization with a 4-bit PQ FastScan path that turns a traditionally memory-bound process into an efficient, SIMD-friendly computation.

In practice, this gives ScaNN a clear and well-defined niche. It is not intended to replace graph-based indexes like HNSW in high-recall settings. Instead, for recall-insensitive workloads with tight memory budgets, ScaNN delivers high throughput with a very small footprint. In our experiments, after integration into Milvus VectorDB, ScaNN achieved roughly 5× the QPS of IVFFLAT on the Cohere1M dataset, making it a strong choice for high-throughput, low-latency ANN retrieval where compression and efficiency matter more than perfect recall.

If you’re interested in exploring ScaNN further or discussing index selection in real-world systems, join our [Slack Channle](https://milvusio.slack.com/join/shared_invite/zt-3nntzngkz-gYwhrdSE4~76k0VMyBfD1Q#/shared-invite/email) to chat with our engineers and other AI engineers in the community. You can also book a 20-minute one-on-one session to get insights, guidance, and answers to your questions through [Milvus Office Hours](https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md).