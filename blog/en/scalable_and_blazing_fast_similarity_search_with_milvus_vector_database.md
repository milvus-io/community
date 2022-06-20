---
id: scalable_and_blazing_fast_similarity_search_with_milvus_vector_database.md
title: Scalable and Blazing Fast Similarity Search with Milvus Vector Database
author: Dipanjan Sarkar
date: 2022-06-21
desc: Store, index, manage and search trillions of document vectors in milliseconds!
cover: assets.zilliz.com/1_14_Rd_Zi_Sj_SMG_Ydxo_Xqhxjs_Q_7d2622ce88.png
tag: Engineering
tags: Data science, Database, Tech, Artificial Intelligence, Vector Management
canonicalUrl: http://milvus.io/blog/scalable_and_blazing_fast_similarity_search_with_milvus_vector_database.md
---

![cover image](https://assets.zilliz.com/1_14_Rd_Zi_Sj_SMG_Ydxo_Xqhxjs_Q_7d2622ce88.png)

## Introduction

In this article, we will cover some interesting aspects relevant to vector databases and similarity search at scale. In today’s rapidly evolving world, we see new technology, new businesses, new data sources and consequently we will need to keep using new ways to store, manage and leverage this data for insights. Structured, tabular data has been stored in relational databases for decades, and Business Intelligence thrives on analyzing and extracting insights from such data. However, considering the current data landscape, “over 80–90% of data is unstructured information like text, video, audio, web server logs, social media, and more”. Organizations have been leveraging the power of machine learning and deep learning to try and extract insights from such data as traditional query-based methods may not be enough or even possible. There is a huge, untapped potential to extract valuable insights from such data and we are only getting started!

> “Since most of the world’s data is unstructured, an ability to analyze and act on it presents a big opportunity.” — Mikey Shulman, Head of ML, Kensho

Unstructured data, as the name suggests, does not have an implicit structure, like a table of rows and columns (hence called tabular or structured data). Unlike structured data, there is no easy way to store the contents of unstructured data within a relational database. There are three main challenges with leveraging unstructured data for insights:

- Storage: Regular relational databases are good for holding structured data. While you can use NoSQL databases to store such data, it becomes an additional overhead to process such data to extract the right representations to power AI applications at scale
- Representation: Computers don’t understand text or images like we do. They only understand numbers and we need to covert unstructed data into some useful numeric representation, typically vectors or embeddings.
- Querying: You can’t query unstructured data directly based on definite conditional statements like SQL for structured data. Imagine, a simple example of you trying to search for similar shoes given a photo of your favorite pair of shoes! You can’t use raw pixel values for search, neither can you represent structured features like shoe shape, size, style, color and more. Now imagine having to do this for millions of shoes!

Hence, in order for computers to understand, process and represent unstructured data, we typically convert them into dense vectors, often called embeddings.

![figure 1](https://assets.zilliz.com/Representing_Images_as_Dense_Embedding_Vectors_0b6a5f516c.png "Representing Images as Dense Embedding Vectors; Source: https://zilliz.com/learn/embedding-generation")

There exist a variety of methodologies especially leveraging deep learning, including convolutional neural networks (CNNs) for visual data like images and Transformers for text data which can be used to transform such unstructured data into embeddings. [Zilliz](https://zilliz.com/) has [an excellent article covering different embedding techiques](https://zilliz.com/learn/embedding-generation)!

Now storing these embedding vectors is not enough. One also needs to be able to query and find out similar vectors. Why do you ask? A majority of real-world applications are powered by vector similarity search for AI based solutions. This includes visual (image) search in Google, recommendations systems in Netflix or Amazon, text search engines in Google, multi-modal search, data de-duplication and many more!

Storing, managing and querying vectors at scale is not a simple task. You need specialized tools for this and vector databases are the most effective tool for the job! In this article we will cover the following aspects:

- [Vectors and Vector Similarity Search](#Vectors-and-Vector-Similarity-Search)
- [What is a Vector Database?](#What-is-a-Vector-Database)
- [Milvus — The World’s Most Advanced Vector Database](#Milvus—The-World-s-Most-Advanced-Vector-Database)
- [Performing visual image search with Milvus — A use-case blueprint](#Performing-visual-image-search-with-Milvus—A-use-case-blueprint)

Let’s get started!

## Vectors and Vector Similarity Search

Earlier, we established the necessity of representing unstructured data like images and text as vectors, since computers can only understand numbers. We typically leverage AI models, to be more specific deep learning models to convert unstructured data into numeric vectors which can be read in by machines. Typically these vectors are basically a list of floating point numbers which collectively represents the underlying item (image, text etc.).

### Understanding Vectors

Considering the field of natural language processing (NLP) we have many word embedding models like [Word2Vec, GloVe and FastText](https://towardsdatascience.com/understanding-feature-engineering-part-4-deep-learning-methods-for-text-data-96c44370bbfa) which can help represent words as numeric vectors. With advancements over time, we have seen the rise of [Transformer](https://arxiv.org/abs/1706.03762) models like [BERT](https://jalammar.github.io/illustrated-bert/) which can be leveraged to learn contextual embedding vectors and better representations for entire sentences and paragraphs.

Similarly for the field of computer vision we have models like [Convolutional Neural Networks (CNNs)](https://proceedings.neurips.cc/paper/2012/file/c399862d3b9d6b76c8436e924a68c45b-Paper.pdf) which can help in learning representations from visual data such as images and videos. With the rise of Transformers, we also have [Vision Transformers](https://arxiv.org/abs/2010.11929) which can perform better than regular CNNs.

![figure 2](https://assets.zilliz.com/Sample_workflow_for_extracting_insights_from_unstructured_data_c74f08f75a.png "Sample workflow for extracting insights from unstructured data; Source: https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md")

The advantage with such vectors is that we can leverage them for solving real-world problems such as visual search, where you typically upload a photo and get search results including visually similar images. Google has this as a very popular feature in their search engine as depicted in the following example.

![figure 3](https://assets.zilliz.com/An_example_of_Google_s_Visual_Image_Search_fa49b81e88.png "An example of Google’s Visual Image Search; Source: Created by Author")

Such applications are powered with data vectors and vector similarity search. If you consider two points in an X-Y cartesian coordinate space. The distance between two points can be computed as a simple euclidean distance depicted by the following equation.

![figure 4](https://assets.zilliz.com/2_D_Euclidean_Distance_6a52b7bc2f.png "2-D Euclidean Distance; Source: https://en.wikipedia.org/wiki/Euclidean_distance")

Now imagine each data point is a vector having D-dimensions, you could still use euclidean distance or even other distance metrics like hamming or cosine distance to find out how close the two data points are to each other. This can help build a notion of closeness or similarity which could be used as a quantifiable metric to find similar items given a reference item using their vectors.

### Understanding Vector Similarity Search

Vector similarity search, often known as nearest neighbor (NN) search, is basically the process of computing pairwise similarity (or distances) between a reference item (for which we want to find similar items) and a collection of existing items (typically in a database) and returning the top ‘k’ nearest neighbors which are the top ‘k’ most similar items. The key component to compute this similarity is the similarity metric which can be euclidean distance, inner product, cosine distance, hamming distance, etc. The smaller the distance, the more similar are the vectors.

The challenge with exact nearest neighbor (NN) search is scalability. You need to compute N-distances (assuming N existing items) everytime to get similar items. This can be super slow especially if you don’t store and index the data somewhere (like a vector database!). To speed up computation, we typically leverage approximate nearest neighbor search which is often called ANN search which ends up storing the vectors into an index. The index helps in storing these vectors in an intelligent way to enable quick retrieval of ‘approximately’ similar neighbors for a reference query item. Typical ANN indexing methodologies include:

- **Vector Transformations:** This includes adding additional transformations to the vectors like dimension reduction (e.g PCA \ t-SNE), rotation and so on
- **Vector Encoding:** This includes applying techniques based on data structures like Locality Sensitive Hashing (LSH), Quantization, Trees etc. which can help in faster retrieval of similar items
- **Non-Exhaustive Search Methods:** This is mostly used to prevent exhaustive search and includes methods like neighborhood graphs, inverted indices etc.

This establishes the case that to build any vector similarity search application, you need a database which can help you with efficient storing, indexing and querying (search) at scale. Enter vector databases!

## What is a Vector Database?

Given that we now understand how vectors can be used to represent unstructured data and how vector search works, we can combine the two concepts together to build a vector database.

Vector databases are scalable data platforms to store, index and query across embedding vectors which are generated from unstructured data (images, text etc.) using deep learning models.

Handling a massive numbers of vectors for similarity search (even with indices) can be super expensive. Despite this, the best and most advanced vector databases should allow you to insert, index and search across millions or billions of target vectors, in addition to specifying an indexing algorithm and similarity metric of your choice.

Vector databases mainly should satisfy the following key requirements considering a robust database management system to be used in the enterprise:

1. **Scalable:** Vector databases should be able to index and run approximate nearest neighbor search for billions of embedding vectors
2. **Reliable:** Vector databases should be able to handle internal faults without data loss and with minimal operational impact, i.e be fault-tolerant
3. **Fast:** Query and write speeds are important for vector databases. For platforms such as Snapchat and Instagram, which can have hundreds or thousands of new images uploaded per second, speed becomes an incredibly important factor.

Vector databases don’t just store data vectors. They are also responsible for using efficient data structures to index these vectors for fast retrieval and supporting CRUD (create, read, update and delete) operations. Vector databases should also ideally support attribute filtering which is filtering based on metadata fields which are usually scalar fields. A simple example would be retrieving similar shoes based on the image vectors for a specific brand. Here brand would be the attribute based on which filtering would be done.

![figure 5](https://assets.zilliz.com/The_Milvus_filtering_mechanism_23188800de.png "The Milvus filtering mechanism; Source: https://zilliz.com/learn/attribute-filtering")

The figure above showcases how [Milvus](https://milvus.io/), the vector database we will talk about shortly, uses attribute filtering. [Milvus](https://milvus.io/) introduces the concept of a bitmask to the filtering mechanism to keep similar vectors with a bitmask of 1 based on satisfying specific attribute filters. More details on this [here](https://zilliz.com/learn/attribute-filtering).

## Milvus — The World’s Most Advanced Vector Database

[Milvus](https://milvus.io/) is an open-source vector database management platform built specifically for massive-scale vector data and streamlining machine learning operations (MLOps).

![figure 6](https://assets.zilliz.com/0_ml3_C4d_A_Ma3t49_C_Ky_bfabd8d4a0.png "Milvus")

[Zilliz](https://zilliz.com/), is the organization behind building [Milvus](https://milvus.io/), the world’s most advanced vector database, to accelerate the development of next generation data fabric. Milvus is currently a graduation project at the [LF AI & Data Foundation](https://lfaidata.foundation/) and focuses on managing massive unstructured datasets for storage and search. The platform’s efficiency and reliability simplifies the process of deploying AI models and MLOps at scale. Milvus has broad applications spanning drug discovery, computer vision, recommendation systems, chatbots, and much more.

### Key Features of Milvus

Milvus is packed with useful features and capabilities, such as:

- **Blazing search speeds on a trillion vector datasets:** Average latency of vector search and retrieval has been measured in milliseconds on a trillion vector datasets.
- **Simplified unstructured data management:** Milvus has rich APIs designed for data science workflows.
- **Reliable, always on vector database:** Milvus’ built-in replication and failover/failback features ensure data and applications can maintain business continuity always.
- **Highly scalable and elastic:** Component-level scalability makes it possible to scale up and down on demand.
- **Hybrid search:** In addition to vectors, Milvus supports data types such as Boolean, String, integers, floating-point numbers, and more. Milvus pairs scalar filtering with powerful vector similarity search (as seen in the shoe similarity example earlier).
- **Unified Lambda structure:** Milvus combines stream and batch processing for data storage to balance timeliness and efficiency.
- **[Time Travel](https://milvus.io/docs/v2.0.x/timetravel_ref.md):** Milvus maintains a timeline for all data insert and delete operations. It allows users to specify timestamps in a search to retrieve a data view at a specified point in time.
- **Community supported & Industry recognized:** With over 1,000 enterprise users, 10.5K+ stars on [GitHub](https://github.com/milvus-io/milvus), and an active open-source community, you’re not alone when you use Milvus. As a graduate project under the [LF AI & Data Foundation](https://lfaidata.foundation/), Milvus has institutional support.

### Existing Approaches to Vector Data Management and Search

A common way to build an AI system powered by vector similarity search is to pair algorithms like Approximate Nearest Neighbor Search (ANNS) with open-source libraries such as:

- **[Facebook AI Similarity Search (FAISS)](https://ai.facebook.com/tools/faiss/):** This framework enables efficient similarity search and clustering of dense vectors. It contains algorithms that search in sets of vectors of any size, up to ones that possibly do not fit in RAM. It supports indexing capabilities like inverted multi-index and product quantization
- **[Spotify’s Annoy (Approximate Nearest Neighbors Oh Yeah)](https://github.com/spotify/annoy):** This framework uses [random projections](http://en.wikipedia.org/wiki/Locality-sensitive_hashing#Random_projection) and builds up a tree to enable ANNS at scale for dense vectors
- **[Google’s ScaNN (Scalable Nearest Neighbors)](https://github.com/google-research/google-research/tree/master/scann):** This framework performs efficient vector similarity search at scale. Consists of implementations, which includes search space pruning and quantization for Maximum Inner Product Search (MIPS)

While each of these libraries are useful in their own way, due to several limitations, these algorithm-library combinations are not equivalent to a full-fledged vector data management system like Milvus. We will discuss some of these limitations now.

### Limitations of Existing Approaches

Existing approaches used for managing vector data as discussed in the previous section has the following limitations:

1. **Flexibility:** Existing systems typically store all data in main memory, hence they cannot be run in distributed mode across multiple machines easily and are not well-suited for handling massive datasets
2. **Dynamic data handling:** Data is often assumed to be static once fed into existing systems, complicating processing for dynamic data and making near real-time search impossible
3. **Advanced query processing:** Most tools do not support advanced query processing (e.g., attribute filtering, hybrid search and multi-vector queries), which is essential for building real-world similarity search engines supporting advanced filtering.
4. **Heterogeneous computing optimizations:** Few platforms offer optimizations for heterogenous system architectures on both CPUs and GPUs (excluding FAISS), leading to efficiency losses.

[Milvus](https://milvus.io/) attempts to overcome all of these limitations and we will discuss this in detail in the next section.

### The Milvus Advantage —Understanding Knowhere

[Milvus](https://milvus.io/) tries to tackle and successfully solve the limitations of existing systems build on top of inefficient vector data management and similarity search algorithms in the following ways:

- It enhances flexibility by offering support for a variety of application interfaces (including SDKs in Python, Java, Go, C++ and RESTful APIs)
- It supports multiple vector index types (e.g., quantization-based indexes and graph-based indexes), and advanced query processing
- Milvus handles dynamic vector data using a log-structured merge-tree (LSM tree), keeping data insertions and deletions efficient and searches humming along in real time
- Milvus also provides optimizations for heterogeneous computing architectures on modern CPUs and GPUs, allowing developers to adjust systems for specific scenarios, datasets, and application environments

Knowhere, the vector execution engine of Milvus, is an operation interface for accessing services in the upper layers of the system and vector similarity search libraries like Faiss, Hnswlib, Annoy in the lower layers of the system. In addition, Knowhere is also in charge of heterogeneous computing. Knowhere controls on which hardware (eg. CPU or GPU) to execute index building and search requests. This is how Knowhere gets its name — knowing where to execute the operations. More types of hardware including DPU and TPU will be supported in future releases.

![figure 7](https://assets.zilliz.com/knowhere_architecture_f1be3dbb1a.png "Knowhere architecture in Milvus; Source: https://milvus.io/blog/deep-dive-8-knowhere.md")

Computation in Milvus mainly involves vector and scalar operations. Knowhere only handles the operations on vectors in Milvus. The figure above illustrates the Knowhere architecture in Milvus. The bottom-most layer is the system hardware. The third-party index libraries are on top of the hardware. Then Knowhere interacts with the index node and query node on the top via CGO. Knowhere not only further extends the functions of Faiss but also optimizes the performance and has several advantages including support for BitsetView, support for more similarity metrics, support for AVX512 instruction set, automatic SIMD-instruction selection and other performance optimizations. Details can be found [here](https://milvus.io/blog/deep-dive-8-knowhere.md).

### Milvus Architecture

The following figure showcases the overall architecture of the Milvus platform. Milvus separates data flow from control flow, and is divided into four layers that are independent in terms of scalability and disaster recovery.

![figure 8](https://assets.zilliz.com/milvus_architecture_ca80be5f96.png "Milvus Architecture; Source: https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md")

- **Access layer:** The access layer is composed of a group of stateless proxies and serves as the front layer of the system and endpoint to users.
- **Coordinator service:** The coordinator service is responsible for cluster topology node management, load balancing, timestamp generation, data declaration, and data management
- **Worker nodes:** The worker, or execution, node executes instructions issued by the coordinator service and the data manipulation language (DML) commands initiated by the proxy. A worker node in Milvus is similar to a data node in [Hadoop](https://hadoop.apache.org/), or a region server in HBase
- **Storage:** This is the cornerstone of Milvus, responsible for data persistence. The storage layer is comprised of **meta store**, **log broker** and **object storage**

Do check out more details about the architecture [here](https://milvus.io/docs/v2.0.x/four_layers.md)!

## Performing visual image search with Milvus — A use-case blueprint

Open-source vector databases like Milvus makes it possible for any business to create their own visual image search system with a minimum number of steps. Developers can use pre-trained AI models to convert their own image datasets into vectors, and then leverage Milvus to enable searching for similar products by image. Let’s look at the following blueprint of how to design and build such a system.

![figure 9](https://assets.zilliz.com/Workflow_for_Visual_Image_Search_c490906a58.jpeg "Workflow for Visual Image Search; Source: https://github.com/milvus-io/bootcamp/tree/master/solutions/reverse_image_search/quick_deploy")

In this workflow we can use an open-source framework like [towhee](https://github.com/towhee-io/towhee) to leverage a pre-trained model like ResNet-50 and extract vectors from images, store and index these vectors with ease in Milvus and also store a mapping of image IDs to the actual pictures in a MySQL database. Once the data is indexed we can upload any new image with ease and perform image search at scale using Milvus. The following figure shows a sample visual image search.

![figure 10](https://assets.zilliz.com/Sample_Visual_Search_Example_52c6410dfd.png "Sample Visual Search Example; Source: https://github.com/milvus-io/bootcamp/tree/master/solutions/reverse_image_search/quick_deploy")

Do check out the detailed [tutorial](https://github.com/milvus-io/bootcamp/tree/master/solutions/reverse_image_search/quick_deploy) which has been open-sourced on GitHub thanks to Milvus.

## Conclusion

We’ve covered a fair amount of ground in this article. We started with challenges in representing unstrucutured data, leveraging vectors and vector similarity search at scale with Milvus, an open-source vector database. We discussed about details on how Milvus is structured and the key components powering it and a blueprint of how to solve a real-world problem, visual image search with Milvus. Do give it a try and start solving your own real-world problems with [Milvus](https://milvus.io/)!

Liked this article? Do [reach out to me](https://www.linkedin.com/in/dipanzan/) to discuss more on it or give feedback!

## About the author

Dipanjan (DJ) Sarkar is a Data Science Lead @Applied4Tech, @Google Developer Expert — Machine Learning, Author, Consultant, AI Advisor @Springboard, Connect: http://bit.ly/djs_linkedin

