---
id: >-
  productionizing-semantic-search-how-we-built-and-scaled-vector-infrastructure-at-airtable.md
title: >
  Productionizing Semantic Search: How We Built and Scaled Vector Infrastructure
  at Airtable
author: Aria Malkani and Cole Dearmon-Moore
date: 2026-3-18
cover: assets.zilliz.com/cover_airtable_milvus_3c77b22ee2.jpg
tag: Use Cases
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  Airtable semantic search, Milvus vector database, vector infrastructure,
  multi-tenant vector search, scalable AI retrieval
meta_title: |
  How Airtable Built and Scaled Vector Infrastructure with Milvus
desc: >
  Learn how Airtable built a scalable Milvus-based vector infrastructure for
  semantic search, multi-tenant retrieval, and low-latency AI experiences.
origin: >-
  https://milvus.io/blog/productionizing-semantic-search-how-we-built-and-scaled-vector-infrastructure-at-airtable.md
---
<p><em>This post was originally published on</em> <em><a href="https://medium.com/airtable-eng/productionizing-semantic-search-how-we-built-and-scaled-vector-infrastructure-at-airtable-180fff11a136">the Airtable Medium</a></em> <em>channel and is reposted here with permission.</em></p>
<p>As semantic search at Airtable evolved from a concept into a core product feature, the Data Infrastructure team faced the challenge of scaling it. As detailed in our <a href="https://medium.com/airtable-eng/building-a-resilient-embedding-system-for-semantic-search-at-airtable-d5fdf27807e2">previous post on Building the Embedding System</a>, we had already designed a robust, eventually consistent application layer to handle the embedding lifecycle. But one critical piece was still missing from our architecture diagram: the vector database itself.</p>
<p>We needed a storage engine capable of indexing and serving billions of embeddings, supporting massive multi-tenancy, and maintaining performance and availability targets in a distributed cloud environment. This is the story of how we architected, hardened, and evolved our vector search platform to become a core pillar of Airtable’s infrastructure stack.</p>
<h2 id="Background" class="common-anchor-header">Background<button data-href="#Background" class="anchor-icon" translate="no">
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
    </button></h2><p>At Airtable, our goal is to help customers work with their data in powerful, intuitive ways. With the emergence of increasingly powerful and accurate LLMs, features that leverage the semantic meaning of your data have become core to our product.</p>
<h2 id="How-We-Use-Semantic-Search" class="common-anchor-header">How We Use Semantic Search<button data-href="#How-We-Use-Semantic-Search" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Omni-Airtable’s-AI-Chat-answering-real-questions-from-large-datasets" class="common-anchor-header">Omni (Airtable’s AI Chat) answering real questions from large datasets</h3><p>Imagine asking a natural-language question of your base (database) with half a million rows, and getting a correct, context-rich answer. For example:</p>
<p>“What are customers saying about battery life lately?”</p>
<p>On small datasets, it’s possible to send all rows directly to an LLM. At scale, that quickly becomes infeasible. Instead, we needed a system capable of:</p>
<ul>
<li>Understanding the semantic intent of a query</li>
<li>Retrieving the most relevant rows via vector similarity search</li>
<li>Supplying those rows as context to an LLM</li>
</ul>
<p>This requirement shaped nearly every design decision that followed: Omni needed to feel instant and intelligent, even on very large bases.</p>
<h3 id="Linked-record-recommendations-Meaning-over-exact-matches" class="common-anchor-header">Linked record recommendations: Meaning over exact matches</h3><p>Semantic search also enhances a core Airtable feature: linked records. Users need relationship suggestions based on context rather than exact text matches. For instance, a project description might imply a relationship with “Team Infrastructure” without ever using that specific phrase.</p>
<p>Delivering these on-demand suggestions requires high-quality semantic retrieval with consistent, predictable latency.</p>
<h2 id="Our-Design-Priorities" class="common-anchor-header">Our Design Priorities<button data-href="#Our-Design-Priorities" class="anchor-icon" translate="no">
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
    </button></h2><p>To support these features and more, we anchored the system around 4 goals:</p>
<ul>
<li><strong>Low-latency queries (500ms p99):</strong> predictable performance is critical for user trust</li>
<li><strong>High-throughput writes:</strong> bases change constantly, and embeddings must stay in sync</li>
<li><strong>Horizontal scalability:</strong> the system must support millions of independent bases</li>
<li><strong>Self-hosting:</strong> all customer data must remain inside Airtable-controlled infrastructure</li>
</ul>
<p>These goals shaped every architectural decision that followed.</p>
<h2 id="Vector-Database-Vendor-Evaluation" class="common-anchor-header">Vector Database Vendor Evaluation<button data-href="#Vector-Database-Vendor-Evaluation" class="anchor-icon" translate="no">
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
    </button></h2><p>In late 2024, we evaluated several vector database options and ultimately selected <a href="https://milvus.io/">Milvus</a> based on three key requirements.</p>
<ul>
<li>First, we prioritized a self-hosted solution to ensure data privacy and maintain fine-grained control of our infrastructure.</li>
<li>Second, our write-heavy workload and bursty query patterns required a system that could scale elastically while maintaining low, predictable latency.</li>
<li>Finally, our architecture required strong isolation across millions of customer tenants.</li>
</ul>
<p><strong>Milvus</strong> emerged as the best fit: its distributed nature supports massive multi-tenancy and allows us to scale ingestion, indexing, and query execution independently, delivering performance while keeping costs predictable.</p>
<h2 id="Architecture-Design" class="common-anchor-header">Architecture Design<button data-href="#Architecture-Design" class="anchor-icon" translate="no">
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
    </button></h2><p>After choosing a technology, we then had to determine an architecture to represent Airtable’s unique data shape: millions of distinct “bases” owned by different customers.</p>
<h2 id="The-Partitioning-Challenge" class="common-anchor-header">The Partitioning Challenge<button data-href="#The-Partitioning-Challenge" class="anchor-icon" translate="no">
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
    </button></h2><p>We evaluated two primary data partitioning strategies:</p>
<h3 id="Option-1-Shared-Partitions" class="common-anchor-header">Option 1: Shared Partitions</h3><p>Multiple bases share a partition, and queries are scoped by filtering on a base id. This improves resource utilization, but introduces additional filtering overhead and makes base deletion more complex.</p>
<h3 id="Option-2-One-Base-per-Partition" class="common-anchor-header">Option 2: One Base per Partition</h3><p>Each Airtable base is mapped to its own physical partition in Milvus. This provides strong isolation, enables fast and simple base deletion, and avoids the performance impact of post-query filtering.</p>
<h3 id="Final-Strategy" class="common-anchor-header">Final Strategy</h3><p>We chose option 2 for its simplicity and strong isolation. However, early tests showed that creating 100k partitions in a single Milvus collection caused significant performance degradation:</p>
<ul>
<li>Partition creation latency increased from ~20 ms to ~250 ms</li>
<li>Partition load times exceeded 30 seconds</li>
</ul>
<p>To address this, we capped the number of partitions per collection. For each Milvus cluster, we create 400 collections, each with at most 1,000 partitions. This limits the total number of bases per cluster to 400k, and new clusters are provisioned as additional customers are onboarded.</p>
<h2 id="Indexing--Recall" class="common-anchor-header">Indexing &amp; Recall<button data-href="#Indexing--Recall" class="anchor-icon" translate="no">
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
    </button></h2><p>Index choice turned out to be one of the most consequential trade-offs in our system. When a partition is loaded, its index is cached in memory or on disk. To strike a balance between recall rate, index size, and performance, we benchmarked several index types.</p>
<ul>
<li><strong>IVF-SQ8:</strong> Offered a small memory footprint but lower recall.</li>
<li><strong>HNSW:</strong> Delivers the best recall (99%-100%) but is memory-hungry.</li>
<li><strong>DiskANN:</strong> Offers a recall similar to HNSW but with higher query latency</li>
</ul>
<p>Ultimately, we selected HNSW for its superior recall and performance characteristics.</p>
<h2 id="The-Application-layer" class="common-anchor-header">The Application layer<button data-href="#The-Application-layer" class="anchor-icon" translate="no">
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
    </button></h2><p>At a high level, Airtable’s semantic search pipeline involves two core flows:</p>
<ol>
<li><strong>Ingestion flow:</strong> Convert Airtable rows into embeddings and store them in Milvus</li>
<li><strong>Query flow:</strong> Embed user queries, retrieve relevant row IDs, and provide context to the LLM</li>
</ol>
<p>Both flows must operate continuously and reliably at scale, and we walk through each below. We walk through each below.</p>
<h2 id="Ingestion-Flow-Keeping-Milvus-in-Sync-with-Airtable" class="common-anchor-header">Ingestion Flow: Keeping Milvus in Sync with Airtable<button data-href="#Ingestion-Flow-Keeping-Milvus-in-Sync-with-Airtable" class="anchor-icon" translate="no">
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
    </button></h2><p>When a user opens Omni, Airtable begins syncing their base to Milvus. We create a partition, then process the rows in chunks, generating embeddings and upserting into Milvus. From then on, we capture any changes made to the base, and re-embed and upsert those rows to keep the data consistent.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Airtable_Milvusblog_1_aac199ae50.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Query-Flow-How-we-use-the-Data" class="common-anchor-header">Query Flow: How we use the Data<button data-href="#Query-Flow-How-we-use-the-Data" class="anchor-icon" translate="no">
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
    </button></h2><p>On the query side, we embed the user’s request and send it to Milvus to retrieve the most relevant row IDs. We then fetch the latest versions of those rows and include them as context in the request to the LLM.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Airtable_Milvusblog_2_6e9067b16d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Operational-Challenges--How-We-Solved-Them" class="common-anchor-header">Operational Challenges &amp; How We Solved Them<button data-href="#Operational-Challenges--How-We-Solved-Them" class="anchor-icon" translate="no">
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
    </button></h2><p>Building a semantic search architecture is one challenge; running it reliably for hundreds of thousands of bases is another. Below are a few key operational lessons we learned along the way.</p>
<h3 id="Deployment" class="common-anchor-header">Deployment</h3><p>We deploy Milvus via its Kubernetes CRD with the <a href="https://github.com/zilliztech/milvus-operator">Milvus operator</a>, allowing us to define and manage clusters declaratively. Every change, whether it’s a configuration update, client improvement, or Milvus upgrade, runs through unit tests and an on-demand load test that simulates production traffic before rolling out to users.</p>
<p>In version 2.5, the Milvus cluster is made up of these core components:</p>
<ul>
<li>Query Nodes hold the vector indices in memory and execute vector searches</li>
<li>Data Nodes handle ingestion and compaction, and persist new data to storage</li>
<li>Index Nodes build and maintain vector indexes to keep search fast as data grows</li>
<li>The Coordinator Node orchestrates all cluster activity and shard assignment</li>
<li>Proxy nodes route API traffic and balance load across nodes</li>
<li>Kafka provides the log/streaming backbone for internal messaging and data flow</li>
<li>Etcd stores cluster metadata and coordination state</li>
</ul>
<p>With CRD-driven automation and a rigorous testing pipeline, we can roll out updates quickly and safely.</p>
<h2 id="Observability-Understanding-System-Health-End-to-End" class="common-anchor-header">Observability: Understanding System Health End-to-End<button data-href="#Observability-Understanding-System-Health-End-to-End" class="anchor-icon" translate="no">
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
    </button></h2><p>We monitor the system on two levels to ensure semantic search remains fast and predictable.</p>
<p>At the infrastructure level, we track CPU, memory usage, and pod health across all Milvus components. These signals tell us whether the cluster is operating within safe limits and help us catch issues such as resource saturation or unhealthy nodes before they affect users.</p>
<p>At the service layer, we focus on how well each base is keeping up with our ingestion and query workloads. Metrics like compaction and indexing throughput give us visibility into how efficiently data is being ingested. Query success rates and latency give us an understanding of the user experience querying the data, and partition growth lets us know how our data is growing, so we are alerted if we need to scale.</p>
<h2 id="Node-Rotation" class="common-anchor-header">Node Rotation<button data-href="#Node-Rotation" class="anchor-icon" translate="no">
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
    </button></h2><p>For security and compliance reasons, we regularly rotate Kubernetes nodes. In a vector search cluster, this is non-trivial:</p>
<ul>
<li>As the query nodes are rotated, the coordinator will rebalance the in-memory data between the query nodes</li>
<li>Kafka and Etcd store stateful information and require quorum and continuous availability</li>
</ul>
<p>We address this with strict disruption budgets and a one-node-at-a-time rotation policy. The Milvus coordinator is given time to rebalance before the next node is cycled. This careful orchestration preserves reliability without slowing down our velocity.</p>
<h2 id="Cold-Partition-Offloading" class="common-anchor-header">Cold Partition Offloading<button data-href="#Cold-Partition-Offloading" class="anchor-icon" translate="no">
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
    </button></h2><p>One of our biggest operational wins was recognizing that our data has clear hot/cold access patterns. By analyzing usage, we found that only ~25% of the data in Milvus is written to or read from in a given week. Milvus lets us offload entire partitions, freeing memory on the Query Nodes. If that data is needed later, we can reload it within seconds. This allows us to keep hot data in memory and offload the rest, reducing costs and allowing us to scale more efficiently over time.</p>
<h2 id="Data-Recovery" class="common-anchor-header">Data Recovery<button data-href="#Data-Recovery" class="anchor-icon" translate="no">
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
    </button></h2><p>Before rolling Milvus out broadly, we needed confidence that we could recover quickly from any failure scenario. While most issues are covered by the cluster’s built-in fault tolerance, we also planned for rare cases where data might become corrupted or the system might enter an unrecoverable state.</p>
<p>In those situations, our recovery path is straightforward. We first bring up a fresh Milvus cluster so we can resume serving traffic almost immediately. Once the new cluster is live, we proactively re-embed the most commonly used bases, then lazily process the rest as they are accessed. This minimizes downtime for most-accessed data while the system gradually rebuilds a consistent semantic index.</p>
<h2 id="What’s-Next" class="common-anchor-header">What’s Next<button data-href="#What’s-Next" class="anchor-icon" translate="no">
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
    </button></h2><p>Our work with <a href="https://milvus.io/">Milvus</a> has laid a strong foundation for semantic search at Airtable: powering fast, meaningful AI experiences at scale. With this system in place, we’re now exploring richer retrieval pipelines and deeper AI integrations across the product. There’s a lot of exciting work ahead, and we’re just getting started.</p>
<p><em>Thanks to all past and present Airtablets on Data Infrastructure and across the organization who contributed to this project: Alex Sorokin, Andrew Wang, Aria Malkani, Cole Dearmon-Moore, Nabeel Farooqui, Will Powelson, Xiaobing Xia.</em></p>
<h2 id="About-Airtable" class="common-anchor-header">About Airtable<button data-href="#About-Airtable" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://www.airtable.com/">Airtable</a> is a leading digital operations platform that enables organizations to build custom apps, automate workflows, and manage shared data at enterprise scale. Designed to support complex, cross-functional processes, Airtable helps teams build flexible systems for planning, coordination, and execution on a shared source of truth. As Airtable expands its AI-powered platform, technologies like Milvus play an important role in strengthening the retrieval infrastructure needed to deliver faster, smarter product experiences.</p>
