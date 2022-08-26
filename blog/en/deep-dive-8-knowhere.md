---
id: deep-dive-8-knowhere.md
title: What Powers Similarity Search in Milvus Vector Database?
author: Yudong Cai
date: 2022-05-10
desc: And no, it's not Faiss.
cover: assets.zilliz.com/Deep_Dive_8_6919720d59.png
tag: Engineering
tags: Data science, Database, Tech, Artificial Intelligence, Vector Management
canonicalUrl: https://milvus.io/blog/deep-dive-8-knowhere.md
---

![cover image](https://assets.zilliz.com/Deep_Dive_8_6919720d59.png "What Powers Similarity Search in Milvus Vector Database?")

> This article is written by [Yudong Cai](https://github.com/cydrain) and translated by [Angela Ni](https://www.linkedin.com/in/yiyun-n-2aa713163/).

As the core vector execution engine, Knowhere to Milvus is what an engine is to a sports car. This post introduces what Knowhere is, how it is different from Faiss, and how the code of Knowhere is structured.

**Jump to:**
- [The concept of Knowhere](#The-concept-of-Knowhere)
- [Knowhere in the Milvus architecture](#Knowhere-in-the-Milvus-architecture)
- [Knowhere Vs Faiss](#Knowhere-Vs-Faiss)
- [Understanding the Knowhere code](#Understanding-the-Knowhere-code)
- [Adding indexes to Knowhere](#Adding-indexes-to-Knowhere)

## The concept of Knowhere
Narrowly speaking, Knowhere is an operation interface for accessing services in the upper layers of the system and vector similarity search libraries like [Faiss](https://github.com/facebookresearch/faiss), [Hnswlib](https://github.com/nmslib/hnswlib), [Annoy](https://github.com/spotify/annoy) in the lower layers of the system. In addition, Knowhere is also in charge of heterogeneous computing. More specifically, Knowhere controls on which hardware (eg. CPU or GPU) to execute index building and search requests. This is how Knowhere gets its name - knowing where to execute the operations. More types of hardware including DPU and TPU will be supported in future releases.

In a broader sense, Knowhere also incorporates other third-party index libraries like Faiss. Therefore, as a whole, Knowhere is recognized as the core vector computation engine in the Milvus vector database.

From the concept of Knowhere, we can see that it only processes data computing tasks, while those tasks like sharding, load balance, disaster recovery are beyond the work scope of Knowhere.

Starting from Milvus 2.0.1, [Knowhere](https://github.com/milvus-io/knowhere) (in the broader sense) becomes independent from the Milvus project.

## Knowhere in the Milvus architecture


![knowhere architecture](https://assets.zilliz.com/ec63d1e9_86e1_48e3_9d75_8fed305bbcb5_26b842e9f6.png "Knowhere architecture in Milvus.")


Computation in Milvus mainly involves vector and scalar operations. Knowhere only handles the operations on vectors in Milvus. The figure above illustrates the Knowhere architecture in Milvus.

The bottom-most layer is the system hardware. The third-party index libraries are on top of the hardware. Then Knowhere interacts with the index node and query node on the top via CGO. 

This article talks about Knowhere in its broader sense, as marked within the blue frame in the architecture illustration.

## Knowhere Vs Faiss

Knowhere not only further extends the functions of Faiss but also optimizes the performance. More specifically, Knowhere has the following advantages.

### 1. Support for BitsetView

Initially, bitset was introduced in Milvus for the purpose of "soft deletion". A soft-deleted vector still exists in the database but will not be computed during a vector similarity search or query. Each bit in the bitset corresponds to an indexed vector. If a vector is marked as "1" in the bitset, it means this vector is soft-deleted and will not be involved during a vector search.

The bitset parameters are added to all the exposed Faiss index query APIs in Knowhere, including CPU and GPU indexes. 

Learn more about [how bitset enables the versatility of vector search](https://milvus.io/blog/2022-2-14-bitset.md).

### 2. Support for more similarity metrics for indexing binary vectors

Apart from [Hamming](https://milvus.io/docs/v2.0.x/metric.md#Hamming-distance), Knowhere also supports [Jaccard](https://milvus.io/docs/v2.0.x/metric.md#Jaccard-distance), [Tanimoto](https://milvus.io/docs/v2.0.x/metric.md#Tanimoto-distance), [Superstructure](https://milvus.io/docs/v2.0.x/metric.md#Superstructure), [Substructure](https://milvus.io/docs/v2.0.x/metric.md#Substructure). Jaccard and Tanimoto can be used to measure the similarity between two sample sets while Superstructure and Substructure can be used to measure the similarity of chemical structures.

### 3. Support for AVX512 instruction set

Faiss itself supports multiple instruction sets including [AArch64](https://en.wikipedia.org/wiki/AArch64), [SSE4.2](https://en.wikipedia.org/wiki/SSE4#SSE4.2), [AVX2](https://en.wikipedia.org/wiki/Advanced_Vector_Extensions). Knowhere further extends the supported instruction sets by adding [AVX512](https://en.wikipedia.org/wiki/AVX-512), which can [improve the performance of index building and query by 20% to 30%](https://milvus.io/blog/milvus-performance-AVX-512-vs-AVX2.md) compared to AVX2.

### 4. Automatic SIMD-instruction selection

Knowhere is designed to work well on a wide spectrum of CPU processors (both on-premises and cloud platforms) with different SIMD instructions (e.g., SIMD SSE, AVX, AVX2, and AVX512). Thus the challenge is, given a single piece of software binary (i.e., Milvus), how to make it automatically invoke the suitable SIMD instructions on any CPU processor? Faiss does not support automatic SIMD-instruction selection and users need to manually specify the SIMD flag (e.g., “-msse4”) during compilation. However, Knowhere is built by refactoring the codebase of Faiss. Common functions (e.g., similarity computing) that rely on SIMD accelerations are factored out. Then for each function, four versions (i.e., SSE, AVX, AVX2, AVX512) are implemented and each put into a separate source file. Then the source files are further compiled individually with the corresponding SIMD flag. Therefore, at runtime, Knowhere can automatically choose the best suited SIMD instructions based on the current CPU flags and then link the right function pointers using hooking. 

### 5. Other performance optimization
Read [Milvus: A Purpose-Built Vector Data Management System](https://www.cs.purdue.edu/homes/csjgwang/pubs/SIGMOD21_Milvus.pdf) for more about Knowhere's performance optimization.

## Understanding the Knowhere code

As mentioned in the first section, Knowhere only handles vector search operations. Therefore, Knowhere only processes the vector field of an entity (currently, only one vector field for entities in a collection is supported). Index building and vector similarity search are also targeted at the vector field in a segment. To have a better understanding of the data model, read the blog [here](https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md#Data-Model).


![entity fields](https://assets.zilliz.com/Entity_fields_6aa517cc4c.png "Entity fields.")

### Index

Index is a type of independent data structure from the original vector data. Indexing requires four steps: create an index, insert data, train data, and build an index.

For some of the AI applications, dataset training is an individual process from vector search. In this type of application, data from datasets are first trained and then inserted into a vector database like Milvus for similarity search. Open datasets like sift1M and sift1B provides data for training and testing. However, in Knowhere, data for training and searching are mixed together. That is to say, Knowhere trains all the data in a segment and then inserts all the trained data and builds an index for them.

### Knowhere code structure

DataObj is the base class of all data structure in Knowhere. `Size()` is the only virtual method in DataObj. The Index class inherits from DataObj with a field named "size_". The Index class also has two virtual methods - `Serialize()` and `Load()`. The VecIndex class derived from Index is the virtual base class for all vector indexes. VecIndex provides methods including `Train()`, `Query()`, `GetStatistics()`, and `ClearStatistics()`.



![base clase](https://assets.zilliz.com/Knowhere_base_classes_9d610618d9.png "Knowhere base classes.")

Other index types are listed on the right in the figure above. 

- The Faiss index has two sub classes: FaissBaseIndex for all indexes on float point vectors, and FaissBaseBinaryIndex for all indexes on binary vectors.
- GPUIndex is the base class for all Faiss GPU indexes.
- OffsetBaseIndex is the base class for all self-developed indexes. Only vector ID is stored in the index file. As a result, an index file size for 128-dimensional vectors can be reduced by 2 orders of magnitude. We recommend taking the original vectors into consideration as well when using this type of index for vector similarity search.



![IDMAP](https://assets.zilliz.com/IDMAP_8773a4511c.png "IDMAP code structure.")

Technically speaking, [IDMAP](https://github.com/facebookresearch/faiss/wiki/Guidelines-to-choose-an-index#then-flat) is not an index, but rather used for brute-force search. When vectors are inserted to the vector database, no data training and index building is required. Searches will be conducted directly on the inserted vector data.

However, for the sake of code consistency, IDMAP also inherits from the VecIndex class with all its virtual interfaces. The usage of IDMAP is the same as other indexes.



![IVF](https://assets.zilliz.com/IVF_42b0f123d1.png "Code structure of IVF indexes.")

The IVF (inverted file) indexes are the most frequently used. The IVF class is derived from VecIndex and FaissBaseIndex, and further extends to IVFSQ and IVFPQ. GPUIVF is derived from GPUIndex and IVF. Then GPUIVF further extends to GPUIVFSQ and GPUIVFPQ.

IVFSQHybrid is a class for self-developed hybrid index that is executed by coarse quantize on GPU. And search in the bucket is executed on CPU. This type of index can reduce the occurrence of memory copy between CPU and GPU by leveraging the computing power of GPU. IVFSQHybrid has the same recall rate as GPUIVFSQ but comes with a better performance.

The base class structure for binary indexes are relatively simpler. BinaryIDMAP and BinaryIVF are derived from FaissBaseBinaryIndex and VecIndex.



![third-party index](https://assets.zilliz.com/third_party_index_34ad029848.png "Code structure of other third-party indexes.")

Currently, only two types of third-party indexes are supported apart from Faiss: tree-based index Annoy, and graph-based index HNSW. These two common and frequently used third-party indexes are both derived from VecIndex. 

## Adding indexes to Knowhere

If you want to add new indexes to Knowhere, you can refer to existing indexes first:
- To add quantization-based index, refer to IVF_FLAT. 
- To add graph-based index, refer to HNSW. 
- To add tree-based index, refer to Annoy.

After referring to the existing index, you can follow the steps below to add a new index to Knowhere.
1. Add the name of the new index in `IndexEnum`. The data type is string.
2. Add data validation check on the new index in the file `ConfAdapter.cpp`. The validation check is mainly to validate the parameters for data training and query.
3. Create a new file for the new index. The base class of the new index should include `VecIndex`, and the necessary virtual interface of `VecIndex`.
4. Add the index building logic for new index in `VecIndexFactory::CreateVecIndex()`.
5. Add unit test under the `unittest` directory.


## About the Deep Dive Series

With the [official announcement of general availability](https://milvus.io/blog/2022-1-25-annoucing-general-availability-of-milvus-2-0.md) of Milvus 2.0, we orchestrated this Milvus Deep Dive blog series to provide an in-depth interpretation of the Milvus architecture and source code. Topics covered in this blog series include:

- [Milvus architecture overview](https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md)
- [APIs and Python SDKs](https://milvus.io/blog/deep-dive-2-milvus-sdk-and-api.md)
- [Data processing](https://milvus.io/blog/deep-dive-3-data-processing.md)
- [Data management](https://milvus.io/blog/deep-dive-4-data-insertion-and-data-persistence.md)
- [Real-time query](https://milvus.io/blog/deep-dive-5-real-time-query.md)
- [Scalar execution engine](https://milvus.io/blog/deep-dive-7-query-expression.md)
- [QA system](https://milvus.io/blog/deep-dive-6-oss-qa.md)
- [Vector execution engine](https://milvus.io/blog/deep-dive-8-knowhere.md)
