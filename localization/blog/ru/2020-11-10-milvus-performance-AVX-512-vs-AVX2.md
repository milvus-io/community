---
id: milvus-performance-AVX-512-vs-AVX2.md
title: What are Advanced Vector Extensions?
author: milvus
date: 2020-11-10T22:15:39.156Z
desc: >-
  Discover how Milvus performs on AVX-512 vs. AVX2 using a variety of different
  vector indexes.
cover: assets.zilliz.com/header_milvus_performance_avx_512_vs_avx2_2c9f14ef96.png
tag: Engineering
canonicalUrl: 'https://zilliz.com/blog/milvus-performance-AVX-512-vs-AVX2'
---
<custom-h1>Milvus performance on AVX-512 vs. AVX2</custom-h1><p>Conscious intelligent machines that want to take over the world are a steady fixture in science fiction, but in reality modern computers are very obedient. Without being told, they seldom know what to do with themselves. Computers perform tasks based on instructions, or orders, sent from a program to a processor. At their lowest level, each instruction is a sequence of ones and zeroes that describes an operation for a computer to execute.
Typically, in computer assembly languages each machine language statement corresponds to a processor instruction. The central processing unit (CPU) relies on instructions to perform calculations and control systems. Additionally, CPU performance is often measured in terms of instruction execution capability (e.g., execution time).</p>
<h2 id="What-are-Advanced-Vector-Extensions" class="common-anchor-header">What are Advanced Vector Extensions?<button data-href="#What-are-Advanced-Vector-Extensions" class="anchor-icon" translate="no">
      <svg translate="no"
        aria-hidden="true"
        focusable="false"
        height="20"
        version="1.1"
        viewBox="0 0 16 16"
        width="16"
      >
        <path
          fill="#0092E4"
          fill-rule="evenodd"
          d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"
        ></path>
      </svg>
    </button></h2><p>Advanced Vector Extensions (AVX) are an instruction set for microprocessors that rely on the x86 family of instruction set architectures. First proposed by Intel in March 2008, AVX saw broad support three years later with the launch of Sandy Bridge—a microarchitecture used in the second generation of Intel Core processors (e.g, Core i7, i5, i3)— and AMD’s competing microarchitecture also released in 2011, Bulldozer.</p>
<p>AVX introduced a new coding scheme, new features, and new instructions. AVX2 expands most integer operations to 256 bits and introduces fused multiply-accumulate (FMA) operations. AVX-512 expands AVX to 512-bit operations using a new enhanced vector extension (EVEX) prefix encoding.</p>
<p><a href="https://milvus.io/docs">Milvus</a> is an open-source vector database designed for similarity search and artificial intelligence (AI) applications. The platform supports the AVX-512 instruction set, meaning it can be used with all CPUs that include the AVX-512 instructions. Milvus has broad applications spanning recommender systems, computer vision, natural language processing (NLP) and more. This article presents performance results and analysis of a Milvus vector database on AVX-512 and AVX2.</p>
<h2 id="Milvus-performance-on-AVX-512-vs-AVX2" class="common-anchor-header">Milvus performance on AVX-512 vs. AVX2<button data-href="#Milvus-performance-on-AVX-512-vs-AVX2" class="anchor-icon" translate="no">
      <svg translate="no"
        aria-hidden="true"
        focusable="false"
        height="20"
        version="1.1"
        viewBox="0 0 16 16"
        width="16"
      >
        <path
          fill="#0092E4"
          fill-rule="evenodd"
          d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"
        ></path>
      </svg>
    </button></h2><h3 id="System-configuration" class="common-anchor-header">System configuration</h3><ul>
<li>CPU: Intel® Platinum 8163 CPU @ 2.50GHz24 cores 48 threads</li>
<li>Number of CPU: 2</li>
<li>Graphics card, GeForce RTX 2080Ti 11GB 4 cards</li>
<li>Mem: 768GB</li>
<li>Disk: 2TB SSD</li>
</ul>
<h3 id="Milvus-parameters" class="common-anchor-header">Milvus parameters</h3><ul>
<li>cahce.cahe_size: 25, The size of CPU memory used for caching data for faster query.</li>
<li>nlist: 4096</li>
<li>nprobe: 128</li>
</ul>
<p>Note: <code translate="no">nlist</code> is the indexing parameter to create from the client; <code translate="no">nprobe</code> the searching parameter. Both IVF_FLAT and IVF_SQ8 use a clustering algorithm to partition a large number of vectors into buckets, <code translate="no">nlist</code> being the total number of buckets to partition during clustering. The first step in a query is to find the number of buckets that are closest to the target vector, and the second step is to find the top-k vectors in these buckets by comparing the distance of the vectors. <code translate="no">nprobe</code> refers to the number of buckets in the first step.</p>
<h3 id="Dataset-SIFT10M-dataset" class="common-anchor-header">Dataset: SIFT10M dataset</h3><p>These tests use the <a href="https://archive.ics.uci.edu/ml/datasets/SIFT10M">SIFT10M dataset</a>, which contains one million 128-dimensional vectors and is often used for analyzing the performance of corresponding nearest-neighbor search methods. The top-1 search time for nq = [1, 10, 100, 500, 1000] will be compared between the two instruction sets.</p>
<h3 id="Results-by-vector-index-type" class="common-anchor-header">Results by vector index type</h3><p><a href="https://zilliz.com/blog/Accelerating-Similarity-Search-on-Really-Big-Data-with-Vector-Indexing">Vector indexes</a> are time- and space-efficient data structures built on the vector field of a collection using various mathematical models. Vector indexing allows large datasets to be searched efficiently when trying to identify similar vectors to an input vector. Due to the time consuming nature of accurate retrieval, most of the index types <a href="https://milvus.io/docs/v2.0.x/index.md#CPU">supported by Milvus</a> use approximate nearest neighbor (ANN) search.</p>
<p>For these tests, three indexes were used with AVX-512 and AVX2: IVF_FLAT, IVF_SQ8, and HNSW.</p>
<h3 id="IVFFLAT" class="common-anchor-header">IVF_FLAT</h3><p>Inverted file (IVF_FLAT) is an index type based on quantization. It is the most basic IVF index, and the encoded data stored in each unit is consistent with the original data.
The index divides vector data into a number of cluster units (nlist), and then compares distances between the target input vector and the center of each cluster. Depending on the number of clusters the system is set to query (nprobe), similarity search results are returned based on comparisons between the target input and the vectors in the most similar cluster(s) only — drastically reducing query time. By adjusting nprobe, an ideal balance between accuracy and speed can be found for a given scenario.</p>
<p><strong>Performance results</strong>

  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/IVF_FLAT_3688377fc8.png" alt="IVF_FLAT.png" class="doc-image" id="ivf_flat.png" />
    <span>IVF_FLAT.png</span>
  </span>
</p>
<h3 id="IVFSQ8" class="common-anchor-header">IVF_SQ8</h3><p>IVF_FLAT does not perform any compression, so the index files it produces are roughly the same size as the original, raw non-indexed vector data. When disk, CPU, or GPU memory resources are limited, IVF_SQ8 is a better option than IVF_FLAT.
This index type can convert each dimension of the original vector from a four-byte floating-point number to a one-byte unsigned integer by performing scalar quantization. This reduces disk, CPU, and GPU memory consumption by 70–75%.</p>
<p><strong>Performance results</strong>

  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/IVF_SQ_8_bed28307f7.png" alt="IVF_SQ8.png" class="doc-image" id="ivf_sq8.png" />
    <span>IVF_SQ8.png</span>
  </span>
</p>
<h3 id="HNSW" class="common-anchor-header">HNSW</h3><p>Hierarchical Small World Graph (HNSW) is a graph-based indexing algorithm. Queries begin in the uppermost layer by finding the node closest to the target, it then goes down to the next layer for another round of search. After multiple iterations, it can quickly approach the target position.</p>
<p><strong>Performance results</strong>

  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/HNSW_52aba39214.png" alt="HNSW.png" class="doc-image" id="hnsw.png" />
    <span>HNSW.png</span>
  </span>
</p>
<h2 id="Comparing-vector-indexes" class="common-anchor-header">Comparing vector indexes<button data-href="#Comparing-vector-indexes" class="anchor-icon" translate="no">
      <svg translate="no"
        aria-hidden="true"
        focusable="false"
        height="20"
        version="1.1"
        viewBox="0 0 16 16"
        width="16"
      >
        <path
          fill="#0092E4"
          fill-rule="evenodd"
          d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"
        ></path>
      </svg>
    </button></h2><p>Vector retrieval is consistently faster on the AVX-512 instruction set than on AVX2. This is because  AVX-512 supports 512-bit computation, compared to just 256-bit computation on AVX2. Theoretically, AVX-512 should be twice as fast as the AVX2 however, Milvus conducts other time-consuming tasks in addition to vector similarity calculations. The overall retrieval time of AVX-512 is unlikely to be twice as short as AVX2 in real-world scenarios.

  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/comparison_a64b92f1dd.png" alt="comparison.png" class="doc-image" id="comparison.png" />
    <span>comparison.png</span>
  </span>
</p>
<p>Retrieval is significantly faster on the HNSW index than the other two indexes, while IVF_SQ8 retrieval is slightly faster than IVF_FLAT on both instruction sets. This is likely because IVF_SQ8 requires just 25% of the memory need by IVF_FLAT. IVF_SQ8 loads 1 byte for each vector dimension, while IVF_FLAT loads 4 bytes per vector dimension. The time required for the calculation is most likely constrained by memory bandwidth. As a result, IVF_SQ8 not only takes up less space, but also requires less time to retrieve vectors.</p>
<h2 id="Milvus-is-a-versatile-high-performance-vector-database" class="common-anchor-header">Milvus is a versatile, high-performance vector database<button data-href="#Milvus-is-a-versatile-high-performance-vector-database" class="anchor-icon" translate="no">
      <svg translate="no"
        aria-hidden="true"
        focusable="false"
        height="20"
        version="1.1"
        viewBox="0 0 16 16"
        width="16"
      >
        <path
          fill="#0092E4"
          fill-rule="evenodd"
          d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"
        ></path>
      </svg>
    </button></h2><p>The tests presented in this article demonstrate that Milvus offers excellent performance on both the AVX-512 and AVX2 instruction sets using different indexes. Regardless of the index type, Milvus  performs better on AVX-512.</p>
<p>Milvus is compatible with a variety of deep learning platforms and is used in miscellaneous AI applications. <a href="https://zilliz.com/news/lfaidata-launches-milvus-2.0-an-advanced-cloud-native-vector-database-built-for-ai">Milvus 2.0</a>, a reimagined version of the world’s most popular vector database, was released under an open-source license in July 2021. For more information about the project, check out the following resources:</p>
<ul>
<li>Find or contribute to Milvus on <a href="https://github.com/milvus-io/milvus/">GitHub</a>.</li>
<li>Interact with the community via <a href="https://join.slack.com/t/milvusio/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ">Slack</a>.</li>
<li>Connect with us on <a href="https://twitter.com/milvusio">Twitter</a>.</li>
</ul>
