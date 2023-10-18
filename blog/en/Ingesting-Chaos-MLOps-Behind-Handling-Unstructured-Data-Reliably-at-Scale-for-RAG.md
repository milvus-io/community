---
id: Ingesting-Chaos-MLOps-Behind-Handling-Unstructured-Data-Reliably-at-Scale-for-RAG.md
title: 
 > 
 Ingesting Chaos: The MLOps Behind Handling Unstructured Data Reliably at Scale for RAG 
author: David Garnitz 
date: 2023-10-16
cover: assets.zilliz.com/Ingesting_Chaos_20231017_110103_54fe2009cb.png
tag: News
tags: Milvus, Vector Database, Open Source, Data science, Artificial Intelligence, Retrieval Augmented Generation, RAG, Unstructured Data
recommend: true
canonicalUrl: https://milvus.io/blog/Ingesting-Chaos-MLOps-Behind-Handling-Unstructured-Data-Reliably-at-Scale-for-RAG.md
---


![](https://assets.zilliz.com/Ingesting_Chaos_20231017_110103_54fe2009cb.png)


Data is being generated faster than ever before in every form imaginable. This data is the gasoline that will power a new wave of artificial intelligence applications, but these productivity enhancement engines need help ingesting this fuel. The wide range of scenarios and edge cases surrounding unstructured data makes it challenging to use in production AI systems.

For starters, there are a vast number of data sources. These export data in various file formats, each with its eccentricities. For example, how you process a PDF varies greatly depending on where it comes from. Ingesting a PDF for a securities litigation case will likely focus on textual data. In contrast, a system design specification for a rocket engineer will be full of diagrams that require visual processing. The lack of a defined schema in unstructured data further adds complexity. Even when the challenge of processing the data is overcome, the issue of ingesting it at scale remains. Files can vary significantly in size, which changes how they are processed. You can quickly process a 1MB upload on an API over HTTP, but reading in dozens of GBs from a single file requires streaming and a dedicated worker. 

Overcoming these traditional data engineering challenges is table stakes for connecting raw data to [LLMs](https://zilliz.com/glossary/large-language-models-(llms)) via [vector databases](https://zilliz.com/learn/what-is-vector-database) like [Milvus](https://github.com/milvus-io/milvus). However, emerging use cases such as performing semantic similarity searches with the help of a vector database require new processing steps like chunking the source data, orchestrating metadata for hybrid searches, picking the suitable vector embedding model, and tuning the search parameters to determine what data to feed to the LLM. These workflows are so new that there are no established best practices for developers to follow. Instead, they must experiment to find the correct configuration and use case for their data. To speed up this process, using a vector embedding pipeline to handle the data ingestion into the vector database is invaluable. 

A vector embedding pipeline like [VectorFlow](https://github.com/dgarnitz/vectorflow) will connect your raw data to your vector database, including chunking, metadata orchestration, embedding, and upload. VectorFlow enables engineering teams to focus on the core application logic, experimenting with the different retrieval parameters generated from the embedding model, the chunking strategy, the metadata fields, and aspects of the search to see what performs best. 

In our work helping engineering teams move their [retrieval augmented generation (RAG)](https://zilliz.com/use-cases/llm-retrieval-augmented-generation) systems from prototype to production, we have observed the following approach to be successful in testing the different parameters of a RAG search pipeline:

1. Use a small set of the data you are familiar with for speed of iteration, like a few PDFs where they have relevant chunks for the search queries.
2. Make a standard set of questions and answers about that subset of the data. For example, after reading the PDFs, write a list of questions and have your team agree on the answers.
3. Create an automated evaluation system that scores how the retrieval does on each question. One way to do this is to take the answer from the RAG system and run it back through the LLM with a prompt that asks if this RAG result answers the question given the correct answer. This should be a “yes” or “no” answer. For example, if you have 25 questions on your documents, and the system gets 20 correct, you can use this to benchmark against other approaches.  
4. Ensure you use a different LLM for the evaluation than you used to encode the vector embeddings stored in the database. The evaluation LLM is typically a decoder-type of a model like GPT-4. One thing to remember is the cost of these evaluations when run repeatedly. Open-source models like Llama2 70B or the Deci AI LLM 6B, which can run on a single, smaller GPU, have roughly the same performance at a fraction of the cost.
5. Run each test multiple times and average the score to smooth out the stochasticity of the LLM.

Holding every option constant except one, you can quickly determine which parameters work best for your use case. A vector embedding pipeline like VectorFlow makes this especially easy on the ingestion side, where you can quickly try out different chunking strategies, chunk lengths, chunk overlaps, and open-source embedding models to see what leads to the best results. This is especially useful when your dataset has various file types and data sources that require custom logic. 

Once the team knows what works for its use case, the vector embedding pipeline enables them to quickly move to production without having to redesign the system to consider things like reliability and monitoring. With technologies like VectorFlow and [Milvus](https://zilliz.com/what-is-milvus), which are open-source and platform-agnostic, the team can efficiently test across different environments while complying with privacy and security requirements. 



