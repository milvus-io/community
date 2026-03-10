---
id: milvus-2-4-nvidia-cagra-gpu-index-multivector-search-sparse-vector-support.md
title: >-
  Unveiling Milvus 2.4: Multi-vector Search, Sparse Vector, CAGRA Index, and
  More!
author: Fendy Feng
date: 2024-3-20
desc: >-
  We are happy to announce the launch of Milvus 2.4, a major advancement in
  enhancing search capabilities for large-scale datasets.
metaTitle: 'Milvus 2.4 Supports Multi-vector Search, Sparse Vector, CAGRA, and More!'
cover: assets.zilliz.com/What_is_new_in_Milvus_2_4_1_c580220be3.png
tag: Engineering
tags: >-
  Data science, Database, Tech, Artificial Intelligence, Vector Management,
  Milvus
recommend: true
canonicalUrl: >-
  https://milvus.io/blog/milvus-2-4-nvidia-cagra-gpu-index-multivector-search-sparse-vector-support.md
---
<p>We are happy to announce the launch of Milvus 2.4, a major advancement in enhancing search capabilities for large-scale datasets. This latest release adds new features, such as support for the GPU-based CAGRA index, beta support for <a href="https://zilliz.com/learn/sparse-and-dense-embeddings">sparse embeddings</a>, group search, and various other improvements in search capabilities. These developments reinforce our commitment to the community by offering developers like you a powerful and efficient tool for handling and querying vector data. Let’s jump into the key benefits of Milvus 2.4 together.</p>
<h2 id="Enabled-Multi-vector-Search-for-Simplified-Multimodal-Searches" class="common-anchor-header">Enabled Multi-vector Search for Simplified Multimodal Searches<button data-href="#Enabled-Multi-vector-Search-for-Simplified-Multimodal-Searches" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.4 provides multivector search capability, allowing simultaneous search and reranking of different vector types within the same Milvus system. This feature streamlines multimodal searches, significantly enhancing recall rates and enabling developers to effortlessly manage intricate AI applications with varied data types. Additionally, this functionality simplifies the integration and fine-tuning of custom reranking models, aiding in the creation of advanced search functions like precise <a href="https://zilliz.com/vector-database-use-cases/recommender-system">recommender systems</a> that utilize insights from multidimensional data.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/How_the_multi_vector_search_feature_works_6c85961349.png" alt="How the Milti-Vector Search Feature Works" class="doc-image" id="how-the-milti-vector-search-feature-works" />
    <span>How the Milti-Vector Search Feature Works</span>
  </span>
</p>
<p>Multivector support in Milvus has two components:</p>
<ol>
<li><p>The ability to store/query multiple vectors for a single entity within a collection, which is a more natural way to organize data</p></li>
<li><p>The ability to build/optimize a reranking algorithm by leveraging the prebuilt reranking algorithms in Milvus</p></li>
</ol>
<p>Besides being a highly <a href="https://github.com/milvus-io/milvus/issues/25639">requested feature</a>, we built this capability because the industry is moving towards multimodal models with the release of GPT-4 and Claude 3. Reranking is a commonly used technique to further improve query performance in search. We aimed to make it easy for developers to build and optimize their rerankers within the Milvus ecosystem.</p>
<h2 id="Grouping-Search-Support-for-Enhanced-Compute-Efficiency" class="common-anchor-header">Grouping Search Support for Enhanced Compute Efficiency<button data-href="#Grouping-Search-Support-for-Enhanced-Compute-Efficiency" class="anchor-icon" translate="no">
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
    </button></h2><p>Grouping Search is another often <a href="https://github.com/milvus-io/milvus/issues/25343">requested feature</a> we added to Milvus 2.4. It integrates a group-by operation designed for fields of types BOOL, INT, or VARCHAR, filling a crucial efficiency gap in executing large-scale grouping queries.</p>
<p>Traditionally, developers relied on extensive Top-K searches followed by manual post-processing to distill group-specific results, a compute-intensive and code-heavy method. Grouping Search refines this process by efficiently linking query outcomes to aggregate group identifiers like document or video names, streamlining the handling of segmented entities within larger datasets.</p>
<p>Milvus distinguishes its Grouping Search with an iterator-based implementation, offering a marked improvement in computational efficiency over similar technologies. This choice ensures superior performance scalability, particularly in production environments where compute resource optimization is paramount. By reducing data traversal and computation overhead, Milvus supports more efficient query processing, significantly reducing response times and operational costs compared to other vector databases.</p>
<p>Grouping Search bolsters Milvus’s capability to manage high-volume, complex queries and aligns with high-performance computing practices for robust data management solutions.</p>
<h2 id="Beta-Support-for-Sparse-Vector-Embeddings" class="common-anchor-header">Beta Support for Sparse Vector Embeddings<button data-href="#Beta-Support-for-Sparse-Vector-Embeddings" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://zilliz.com/learn/sparse-and-dense-embeddings">Sparse embeddings</a> represent a paradigm shift from traditional dense vector approaches, catering to the nuances of semantic similarity rather than mere keyword frequency. This distinction allows for a more nuanced search capability, aligning closely with the semantic content of the query and the documents. Sparse vector models, particularly useful in information retrieval and natural language processing, offer powerful out-of-domain search capabilities and interpretability compared to their dense counterparts.</p>
<p>In Milvus 2.4, we have expanded the Hybrid Search to include sparse embeddings generated by advanced neural models like SPLADEv2 or statistical models such as BM25. In Milvus, sparse vectors are treated on par with dense vectors, enabling the creation of collections with sparse vector fields, data insertion, index building, and performing similarity searches. Notably, sparse embeddings in Milvus support the <a href="https://zilliz.com/blog/similarity-metrics-for-vector-search#Inner-Product">Inner Product</a> (IP) distance metric, which is advantageous given their high-dimensional nature, making other metrics less effective. This functionality also supports data types with a dimension as an unsigned 32-bit integer and a 32-bit float for the value, thus facilitating a broad spectrum of applications, from nuanced text searches to elaborate <a href="https://zilliz.com/learn/information-retrieval-metrics">information retrieval</a> systems.</p>
<p>With this new feature, Milvus allows for hybrid search methodologies that meld keyword and embedding-based techniques, offering a seamless transition for users moving from keyword-centric search frameworks seeking a comprehensive, low-maintenance solution.</p>
<p>We are labeling this feature as “Beta” to continue our performance testing of the feature and gather feedback from the community. The general availability (GA) of sparse vector support is anticipated with the release of Milvus 3.0.</p>
<h2 id="CAGRA-Index-Support-for-Advanced-GPU-Accelerated-Graph-Indexing" class="common-anchor-header">CAGRA Index Support for Advanced GPU-Accelerated Graph Indexing<button data-href="#CAGRA-Index-Support-for-Advanced-GPU-Accelerated-Graph-Indexing" class="anchor-icon" translate="no">
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
    </button></h2><p>Developed by NVIDIA, <a href="https://arxiv.org/abs/2308.15136">CAGRA</a> (Cuda Anns GRAph-based) is a GPU-based graph indexing technology that significantly surpasses traditional CPU-based methods like the HNSW index in efficiency and performance, especially in high-throughput environments.</p>
<p>With the introduction of the CAGRA Index, Milvus 2.4 provides enhanced GPU-accelerated graph indexing capability. This enhancement is ideal for building similarity search applications requiring minimal latency. Additionally, Milvus 2.4 integrates a brute-force search with the CAGRA index to achieve maximum recall rates in applications. For detailed insights, explore the <a href="https://zilliz.com/blog/Milvus-introduces-GPU-index-CAGRA">introduction blog on CAGRA</a>.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Milvus_raft_cagra_vs_milvus_hnsw_ffe0415ff5.png" alt="Milvus Raft CAGRA vs. Milvus HNSW" class="doc-image" id="milvus-raft-cagra-vs.-milvus-hnsw" />
    <span>Milvus Raft CAGRA vs. Milvus HNSW</span>
  </span>
</p>
<h2 id="Additional-Enhancements-and-Features" class="common-anchor-header">Additional Enhancements and Features<button data-href="#Additional-Enhancements-and-Features" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.4 also includes other key enhancements, such as Regular Expression support for enhanced substring matching in <a href="https://zilliz.com/blog/metadata-filtering-with-zilliz-cloud-pipelines">metadata filtering</a>, a new scalar inverted index for efficient scalar data type filtering, and a Change Data Capture tool for monitoring and replicating changes in Milvus collections. These updates collectively enhance Milvus’s performance and versatility, making it a comprehensive solution for complex data operations.</p>
<p>For more details, see <a href="https://milvus.io/docs/release_notes.md">Milvus 2.4 documentation</a>.</p>
<h2 id="Stay-Connected" class="common-anchor-header">Stay Connected!<button data-href="#Stay-Connected" class="anchor-icon" translate="no">
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
    </button></h2><p>Excited to learn more about Milvus 2.4? <a href="https://zilliz.com/event/unlocking-advanced-search-capabilities-milvus">Join our upcoming webinar</a> with James Luan, Zilliz’s VP of Engineering, for an in-depth discussion on the capabilities of this latest release. If you have questions or feedback, join our <a href="https://discord.com/invite/8uyFbECzPX">Discord channel</a> to engage with our engineers and community members. Don’t forget to follow us on <a href="https://twitter.com/milvusio">Twitter</a> or <a href="https://www.linkedin.com/company/the-milvus-project">LinkedIn</a> for the latest news and updates about Milvus.</p>
