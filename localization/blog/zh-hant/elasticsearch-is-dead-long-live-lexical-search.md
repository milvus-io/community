---
id: elasticsearch-is-dead-long-live-lexical-search.md
title: 'Elasticsearch is Dead, Long Live Lexical Search'
author: James Luan
date: 2024-12-17T00:00:00.000Z
cover: >-
  assets.zilliz.com/Elasticsearch_is_Dead_Long_Live_Lexical_Search_0fa15cd6d7.png
tag: Engineering
tags: Milvus
recommend: false
canonicalUrl: 'https://milvus.io/blog/elasticsearch-is-dead-long-live-lexical-search.md'
---
<p>By now, everyone knows that hybrid search has improved <a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">RAG</a> (Retrieval-Augmented Generation) search quality. While <a href="https://zilliz.com/learn/sparse-and-dense-embeddings">dense embedding</a> search has shown impressive capabilities in capturing deep semantic relationships between queries and documents, it still has notable limitations. These include a lack of explainability and suboptimal performance with long-tail queries and rare terms.</p>
<p>Many RAG applications struggle because pre-trained models often lack domain-specific knowledge. In some scenarios, simple BM25 keyword matching outperforms these sophisticated models. This is where hybrid search bridges the gap, combining the semantic understanding of dense vector retrieval with the precision of keyword matching.</p>
<h2 id="Why-Hybrid-Search-is-Complex-in-Production" class="common-anchor-header">Why Hybrid Search is Complex in Production<button data-href="#Why-Hybrid-Search-is-Complex-in-Production" class="anchor-icon" translate="no">
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
    </button></h2><p>While frameworks like <a href="https://zilliz.com/learn/LangChain">LangChain</a> or <a href="https://zilliz.com/learn/getting-started-with-llamaindex">LlamaIndex</a> make building a proof-of-concept hybrid retriever easy, scaling to production with massive datasets is challenging. Traditional architectures require separate vector databases and search engines, leading to several key challenges:</p>
<ul>
<li><p>High infrastructure maintenance costs and operational complexity</p></li>
<li><p>Data redundancy across multiple systems</p></li>
<li><p>Difficult data consistency management</p></li>
<li><p>Complex security and access control across systems</p></li>
</ul>
<p>The market needs a unified solution that supports lexical and semantic search while reducing system complexity and cost.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/elasticsearch_vs_milvus_5be6e2b69e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="The-Pain-Points-of-Elasticsearch" class="common-anchor-header">The Pain Points of Elasticsearch<button data-href="#The-Pain-Points-of-Elasticsearch" class="anchor-icon" translate="no">
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
    </button></h2><p>Elasticsearch has been one of the past decade’s most influential open-source search projects. Built on Apache Lucene, it gained popularity through its high performance, scalability, and distributed architecture. While it added vector ANN search in version 8.0, production deployments face several critical challenges:</p>
<p><strong>High Update and Indexing Costs:</strong> Elasticsearch’s architecture doesn’t fully decouple write operations, index building, and querying. This leads to significant CPU and I/O overhead during write operations, especially in bulk updates. The resource contention between indexing and querying impacts performance, creating a major bottleneck for high-frequency update scenarios.</p>
<p><strong>Poor Real-time Performance:</strong> As a “near real-time” search engine, Elasticsearch introduces noticeable latency in data visibility. This latency becomes particularly problematic for AI applications, such as Agent systems, where high-frequency interactions and dynamic decision-making require immediate data access.</p>
<p><strong>Difficult Shard Management:</strong> While Elasticsearch uses sharding for distributed architecture, shard management poses significant challenges. The lack of dynamic sharding support creates a dilemma: too many shards in small datasets lead to poor performance, while too few shards in large datasets limit scalability and cause uneven data distribution.</p>
<p><strong>Non-Cloud-Native Architecture:</strong> Developed before cloud-native architectures became prevalent, Elasticsearch’s design tightly couples storage and compute, limiting its integration with modern infrastructure like public clouds and Kubernetes. Resource scaling requires simultaneous increases in both storage and compute, reducing flexibility. In multi-replica scenarios, each shard must build its index independently, increasing computational costs and reducing resource efficiency.</p>
<p><strong>Poor Vector Search Performance:</strong> Though Elasticsearch 8.0 introduced vector ANN search, its performance significantly lags behind that of dedicated vector engines like Milvus. Based on the Lucene kernel, its index structure proves inefficient for high-dimensional data, struggling with large-scale vector search requirements. Performance becomes particularly unstable in complex scenarios involving scalar filtering and multi-tenancy, making it challenging to support high-load or diverse business needs.</p>
<p><strong>Excessive Resource Consumption:</strong> Elasticsearch places extreme demands on memory and CPU, especially when processing large-scale data. Its JVM dependency requires frequent heap size adjustments and garbage collection tuning, severely impacting memory efficiency. Vector search operations require intensive SIMD-optimized computations, for which the JVM environment is far from ideal.</p>
<p>These fundamental limitations become increasingly problematic as organizations scale their AI infrastructure, making Elasticsearch particularly challenging for modern AI applications requiring high performance and reliability.</p>
<h2 id="Introducing-Sparse-BM25-Reimagining-Lexical-Search" class="common-anchor-header">Introducing Sparse-BM25: Reimagining Lexical Search<button data-href="#Introducing-Sparse-BM25-Reimagining-Lexical-Search" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://milvus.io/blog/introduce-milvus-2-5-full-text-search-powerful-metadata-filtering-and-more.md">Milvus 2.5</a> introduces native lexical search support through Sparse-BM25, building upon the hybrid search capabilities introduced in version 2.4. This innovative approach includes the following key components:</p>
<ul>
<li><p>Advanced tokenization and preprocessing via Tantivy</p></li>
<li><p>Distributed vocabulary and term frequency management</p></li>
<li><p>Sparse vector generation using corpus TF and query TF-IDF</p></li>
<li><p>Inverted index support with WAND algorithm (Block-Max WAND and graph index support in development)</p></li>
</ul>
<p>Compared to Elasticsearch, Milvus offers significant advantages in algorithm flexibility. Its vector distance-based similarity computation enables more sophisticated matching, including implementing TW-BERT (Term Weighting BERT) based on “End-to-End Query Term Weighting” research. This approach has demonstrated superior performance in both in-domain and out-domain testing.</p>
<p>Another crucial advantage is cost efficiency. By leveraging both inverted index and dense embedding compression, Milvus achieves a fivefold performance improvement with less than 1% recall degradation. Through tail-term pruning and vector quantization, memory usage has been reduced by over 50%.</p>
<p>Long query optimization stands out as a particular strength. Where traditional WAND algorithms struggle with longer queries, Milvus excels by combining sparse embeddings with graph indices, delivering a tenfold performance improvement in high-dimensional sparse vector search scenarios.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/document_in_and_out_b84771bec4.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Milvus-The-Ultimate-Vector-Database-for-RAG" class="common-anchor-header">Milvus: The Ultimate Vector Database for RAG<button data-href="#Milvus-The-Ultimate-Vector-Database-for-RAG" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus is the premier choice for RAG applications through its comprehensive feature set. Key advantages include:</p>
<ul>
<li><p>Rich metadata support with dynamic schema capabilities and powerful filtering options</p></li>
<li><p>Enterprise-grade multi-tenancy with flexible isolation through collections, partitions, and partition keys</p></li>
<li><p>Industry-first disk vector index support with multi-tier storage from memory to S3</p></li>
<li><p>Cloud-native scalability supporting seamless scaling from 10M to 1B+ vectors</p></li>
<li><p>Comprehensive search capabilities, including grouping, range, and hybrid search</p></li>
<li><p>Deep ecosystem integration with LangChain, LlamaIndex, Dify, and other AI tools</p></li>
</ul>
<p>The system’s diverse search capabilities encompass grouping, range, and hybrid search methodologies. Deep integration with tools like LangChain, LlamaIndex, and Dify, as well as support for numerous AI products, places Milvus at the center of the modern AI infrastructure ecosystem.</p>
<h2 id="Looking-Forward" class="common-anchor-header">Looking Forward<button data-href="#Looking-Forward" class="anchor-icon" translate="no">
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
    </button></h2><p>As AI transitions from POC to production, Milvus continues to evolve. We focus on making vector search more accessible and cost-effective while enhancing search quality. Whether you’re a startup or an enterprise, Milvus reduces the technical barriers to AI application development.</p>
<p>This commitment to accessibility and innovation has led us to another major step forward. While our open-source solution continues to serve as the foundation for thousands of applications worldwide, we recognize that many organizations need a fully managed solution that eliminates operational overhead.</p>
<h2 id="Zilliz-Cloud-The-Managed-Solution" class="common-anchor-header">Zilliz Cloud: The Managed Solution<button data-href="#Zilliz-Cloud-The-Managed-Solution" class="anchor-icon" translate="no">
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
    </button></h2><p>We’ve built <a href="https://zilliz.com/cloud">Zilliz Cloud</a>, a fully managed vector database service based on Milvus, over the past three years. Through a cloud-native reimplementation of the Milvus protocol, it offers enhanced usability, cost efficiency, and security.</p>
<p>Drawing from our experience maintaining the world’s largest vector search clusters and supporting thousands of AI application developers, Zilliz Cloud significantly reduces operational overhead and costs compared to self-hosted solutions.</p>
<p>Ready to experience the future of vector search? Start your free trial today with up to $200 in credits, no credit card required.</p>
