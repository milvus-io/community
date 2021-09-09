---
id: build-semantic-search-at-speed-milvus-lucidworks.md
title: Build Semantic Search at Speed
author: Elizabeth Edmiston
date: 2021-04-19 07:32:50.416+00
desc: Learn more about using semantic machine learning methodologies to power more relevant search results across your organization.
cover: zilliz-cms.s3.us-west-2.amazonaws.com/lucidworks_4753c98727.png
tag: test1
origin: zilliz.com/blog/build-semantic-search-at-speed-milvus-lucidworks
---
  
# Build Semantic Search at Speed
[Semantic search](https://lucidworks.com/post/what-is-semantic-search/) is a great tool to help your customers—or your employees—find the right products or information. It can even surface difficult-to-index information for better results. That said, if your semantic methodologies aren’t being deployed to work fast, they won’t do you any good. The customer or employee isn’t just going to sit around while the system takes its time responding to their query—and a thousand others are likely being ingested at the same time.

How can you make semantic search fast? Slow semantic search isn’t going to cut it.

Fortunately, this is the kind of problem Lucidworks loves to solve. We recently tested a modest-sized cluster—read on for more details—that resulted in 1500 RPS (requests per second) against a collection of over one million documents, with an average response time of roughly 40 milliseconds. Now that’s some serious speed.

<br/>

### Implementing Semantic Search
To make lightning-fast, machine learning magic happen, Lucidworks has implemented semantic search using the semantic vector search approach. There are two critical parts.

<br/>

#### Part One: The Machine Learning Model

First, you need a way to encode text into a numerical vector. The text could be a product description, a user search query, a question, or even an answer to a question. A semantic search model is trained to encode text such that text that is semantically similar to other text is encoded into vectors that are numerically “close” to one another. This encoding step needs to be fast in order to support the thousand or more possible customer searches or user queries coming in every second.

<br/>

#### Part Two: The Vector Search Engine
Second, you need a way to quickly find the best matches to the customer search or user query. The model will have encoded that text into a numerical vector. From there, you need to compare that to all the numerical vectors in your catalog or lists of questions and answers to find those best matches—the vectors that are “closest” to the query vector. For that, you will need a vector engine that can handle all of that information effectively and at lightning speed. The engine could contain millions of vectors and you really just want the best twenty or so matches to your query. And of course, it needs to handle a thousand or so such queries every second.

To tackle these challenges, we added the vector search engine [Milvus](https://doc.lucidworks.com/fusion/5.3/8821/milvus) in our [Fusion 5.3 release](https://lucidworks.com/post/enhance-personalization-efforts-with-new-features-in-fusion/). Milvus is open-source software and it is fast. Milvus uses FAISS ([Facebook AI Similarity Search](https://ai.facebook.com/tools/faiss/)), the same technology Facebook uses in production for its own machine learning initiatives. When needed, it can run even faster on [GPU](https://en.wikipedia.org/wiki/Graphics_processing_unit). When Fusion 5.3 (or higher) is installed with the machine learning component, Milvus is automatically installed as part of that component so you can turn on all of these capabilities with ease.

The size of the vectors in a given collection, specified when the collection is created, depends on the model that produces those vectors. For example, a given collection could store the vectors created from encoding (via a model) all of the product descriptions in a product catalog. Without a vector search engine like Milvus, similarity searches would not be feasible across the entire vector space. So, similarity searches would have to be limited to pre-selected candidates from the vector space (for example, 500) and would have both slower performance and lower quality results. Milvus can store hundreds of billions of vectors across multiple collections of vectors to ensure that search is fast and results are relevant.

<br/>

### Using Semantic Search

Let’s get back to the semantic search workflow, now that we’ve learned a little about why Milvus might be so important. Semantic search has three stages. During the first stage, the machine learning model is loaded and/or trained. Afterwards, data is indexed into Milvus and Solr. The final stage is the query stage, when the actual search occurs. We’ll focus on those last two stages below.

<br/>

### Indexing into Milvus
![Lucidworks-1.png](https://zilliz-cms.s3.us-west-2.amazonaws.com/Lucidworks_1_47a9221723.png)
###### *Architectural diagram for indexing into Milvus.*

As shown in the above diagram, the query stage begins similarly to the indexing stage, just with queries coming in instead of documents. For each query:

1. The query is sent to the [Smart Answers](https://lucidworks.com/products/smart-answers/) index pipeline.
2. The query is then sent to the ML model.
3. The ML model returns a numeric vector (encrypted from the query). Again, the type of model determines the size of the vector.
4. The vector is sent to Milvus, which then determines which vectors, in the specified Milvus collection, best match the provided vector.
5. Milvus returns a list of unique IDs and distances corresponding to the vectors determined in step four.
6. A query containing those IDs and distances is sent to Solr.
7. Solr then returns an ordered list of the documents associated with those IDs.

<br/>

### Scale Testing
In order to prove that our semantic search flows are running at the efficiency we require for our customers, we run scale tests using Gatling scripts on the Google Cloud Platform using a Fusion cluster with eight replicas of the ML model, eight replicas of the query service, and a single instance of Milvus. Tests were run using the Milvus FLAT and HNSW indexes. The FLAT index has 100% recall, but is less efficient – except when the datasets are small. The HNSW (Hierarchical Small World Graph) index still has high quality results and it has improved performance on larger datasets.

Let’s jump into some numbers from a recent example we ran:

![Lucidworks-2.png](https://zilliz-cms.s3.us-west-2.amazonaws.com/Lucidworks_2_3162113560.png)
###### *Performance of Milvus FLAT and HNSW indexes on a small dataset.*

![Lucidworks-3.png](https://zilliz-cms.s3.us-west-2.amazonaws.com/Lucidworks_3_3dc17f0ed8.png)
###### *Performance of Milvus FLAT and HNSW indexes on a medium dataset.*

![Lucidworks-4.png](https://zilliz-cms.s3.us-west-2.amazonaws.com/Lucidworks_4_8a6edd2f59.png)
###### *Performance of Milvus FLAT and HNSW indexes on a large dataset.*

<br/>

### Getting Started

The [Smart Answers](https://lucidworks.com/products/smart-answers/) pipelines are designed to be easy-to-use. Lucidworks has [pre-trained models that are easy-to-deploy](https://doc.lucidworks.com/how-to/734/set-up-a-pre-trained-cold-start-model-for-smart-answers) and generally have good results—though training your own models, in tandem with pre-trained models, will offer the best results. Contact us today to learn how you can implement these initiatives into your search tools to power more effective and delightful results.


> This blog is reposted from: https://lucidworks.com/post/how-to-build-fast-semantic-search/?utm_campaign=Oktopost-Blog+Posts&utm_medium=organic_social&utm_source=linkedin

  