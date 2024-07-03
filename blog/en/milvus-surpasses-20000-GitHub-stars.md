---
id: milvus-surpasses-20000-github-stars.md
title: 'A Stellar Milestone: Milvus Surpasses 20,000 Stars on GitHub'
author: Yujian Tang
date: 2023-06-29
cover: assets.zilliz.com/Milvus_hit_20_000_stars_284ed694d2.png
tag: News
tags: Milvus, Vector Database, Open Source, Data science, Artificial Intelligence, Vector Management
recommend: true
canonicalUrl: https://milvus.io/blog/milvus-surpasses-20000-github-stars.md
---

![](https://assets.zilliz.com/Milvus_hit_20_000_stars_284ed694d2.png)

Let's break out the confetti and celebrate! 

[Milvus](https://github.com/milvus-io/milvus) has achieved a stellar milestone - surpassing 20,000 stars on GitHub! We couldn't have achieved it without the support and feedback of our loyal fans and community members. Thank you so much. 

To share the joy, we've put together a list of critical topics from the broader Milvus community, including:
 
- Six prominent projects that utilize Milvus
- Five integrations with other open-source projects
- Five well-known use cases of Milvus
- Five excellent upcoming features

## Six LLM projects that utilize Milvus

### PaperGPT

[PaperGPT](http://papergpt.bio) is a search tool for biomedical papers powered by an LLM and a vector database. It leverages the PubMed database and technologies like SentenceTransformers and Zilliz Cloud for efficient search. 

### NoticeAI

NoticeAI helps companies automate their customer support process. It utilizes Milvus and LangChain to track customer support questions, update the knowledge base, and decide whether or not to involve a human.

### Search.anything.io 

[Search Anything](http://search.anything.io) leverages LLMs and Milvus to provide a better search experience. It takes a text description from a user and finds the corresponding images on the web.

### IkuStudies

[IkuStudies](https://ikustudies.xyz/) is a project allowing users to search through homophones in 28 languages. It uses Milvus as the vector store to find similarities between the words. 

### AssistLink AI

[AssistLink AI](https://www.linkedin.com/company/assistlink/about/) is a Seattle-based startup that uses Milvus and LLaMa 65bn to store variables for a Government Assistance system.

### OSS Chat

[OSS Chat](http://osschat.io) allows you to chat with open-source software. It uses Milvus to inject domain knowledge about open-source projects and uses [GPTCache](https://zilliz.com/blog/Caching-LLM-Queries-for-performance-improvements) to cache frequently asked questions to reduce LLM costs. 

## Five AI projects Milvus integrates with

### LlamaIndex 

[LlamaIndex](https://github.com/jerryjliu/llama_index) is a data framework for LLM applications that provides data connectors to link external data sources with an LLM. LlamaIndex enables you to inject your private data or domain-specific knowledge directly into your LLM application. 

### LangChain/LangChainJS

[LangChain](https://github.com/hwchase17/langchain) is a library designed to accelerate LLM application development, offering features such as prompt management, chains, data-augmented generation, memory, and more. 

### ChatGPT Retrieval Plugin 

The [ChatGPT Retrieval Plugin](https://github.com/openai/chatgpt-retrieval-plugin) from OpenAI enables semantic search and retrieval of personal or organizational documents using natural language queries, allowing developers to deploy their plugin and register it with ChatGPT. 

### Haystack 

[Haystack](https://github.com/deepset-ai/haystack) is an end-to-end NLP framework for building NLP applications powered by LLMs, transformer models, vector search, and other technologies for tasks such as question answering, semantic document search, and building complex decision-making. 

### GPTCache

LLM API calls can be both expensive and slow. [GPTCache](https://github.com/zilliztech/gptcache) can remedy both problems by providing a semantic cache for LLM queries. 

## Five well-known use cases of Milvus

### LLM augmentation

LLMs or LLM applications have three major problems: lack of domain-specific data, outdated data, and high costs. Milvus can solve all three of these problems by allowing you to inject external data and serve as a cache for frequent queries.

### Anomaly detection

Anomalous data is significantly different from the rest in a given set. Vector databases like Milvus are beneficial for conducting similarity searches, making it easier to identify such anomalous data. 

### Recommender systems

A recommender system recommends people items similar to what they already enjoy. It is a classic example of Milvus accelerating this process by performing similarity searches. 

### Semantic search

Keyword search doesn’t do it when you want to search text to find things with similar meanings. That’s where semantic search comes in and where Milvus can help. Milvus allows you to compare the intentions behind the text, not just the words themselves.

### Automatic data labeling

Got labeled data and need to mark more? By storing the vector representations in Milvus, you can automatically detect the most similar data points in your new data and apply the appropriate labels.

## Five awesome upcoming features

### NVIDIA GPU support

GPU support is coming in Milvus 2.3 and is already available in the most [recent beta release](https://github.com/milvus-io/milvus/releases/tag/v2.3.0-beta)! 

### Delete by Expression

You can already perform scalar/metadata filtering via boolean expressions in Milvus. The Delete by Expression feature is also coming.

### Change Data Capture (CDC)

CDC is a technique to capture and track changes made to your Milvus instance in real-time.

### Range Search

Range search, also known in some circles as epsilon search, will allow you to find all vectors within a certain distance of your query vector.

### Fast Scan

4-bit quantization and FastScan were added to FAISS recently and will also be coming to Milvus.

## Looking forward to Milvus reaching even greater heights!

We would like to give our most enormous thanks to our users, community members, ecosystem partners, and stargazers for your continued support, feedback, and contribution. Looking forward to Milvus reaching even greater heights! 


