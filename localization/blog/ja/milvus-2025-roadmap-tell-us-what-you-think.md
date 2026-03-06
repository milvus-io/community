---
id: milvus-2025-roadmap-tell-us-what-you-think.md
title: |
  Milvus 2025 Roadmap - Tell Us What You Think
author: 'Fendy Feng, Field Zhang'
date: 2025-03-27T00:00:00.000Z
desc: >-
  In 2025, we’re rolling out two major versions, Milvus 2.6 and Milvus 3.0, and
  many other technical features. We welcome you to share your thoughts with us.
cover: assets.zilliz.com/2025_roadmap_04e6c5d1c3.png
tag: Announcements
recommend: true
canonicalUrl: 'https://milvus.io/blog/milvus-2025-roadmap-tell-us-what-you-think.md'
---
<p>Hey, Milvus users and contributors!</p>
<p>We’re excited to share our <a href="https://milvus.io/docs/roadmap.md"><strong>Milvus 2025 roadmap</strong></a> with you. 🚀 This technical plan highlights the key features and improvements we’re building to make Milvus even more powerful for your vector search needs.</p>
<p>But this is just the beginning—we want your insights! Your feedback helps shape Milvus, ensuring it evolves to meet real-world challenges. Let us know what you think and help us refine the roadmap as we move forward.</p>
<h2 id="The-Current-Landscape" class="common-anchor-header">The Current Landscape<button data-href="#The-Current-Landscape" class="anchor-icon" translate="no">
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
    </button></h2><p>Over the past year, we’ve seen many of you build impressive RAG and agent applications with Milvus, leveraging many of our popular features, such as our model integration, full-text search, and hybrid search. Your implementations have provided valuable insights into real-world vector search requirements.</p>
<p>As AI technologies evolve, your use cases are becoming more sophisticated - from basic vector search to complex multimodal applications spanning intelligent agents, autonomous systems, and embodied AI. These technical challenges are informing our roadmap as we continue to develop Milvus to meet your needs.</p>
<h2 id="Two-Major-Releases-in-2025-Milvus-26-and-Milvus-30" class="common-anchor-header">Two Major Releases in 2025: Milvus 2.6 and Milvus 3.0<button data-href="#Two-Major-Releases-in-2025-Milvus-26-and-Milvus-30" class="anchor-icon" translate="no">
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
    </button></h2><p>In 2025, we’re rolling out two major versions: Milvus 2.6 (Middle of CY25) and Milvus 3.0 (end of 2025).</p>
<p><strong>Milvus 2.6</strong> focuses on core architecture improvements you’ve been asking for:</p>
<ul>
<li><p>Simpler deployment with fewer dependencies (goodbye, deployment headaches!)</p></li>
<li><p>Faster data ingestion pipelines</p></li>
<li><p>Lower storage costs (we hear your production cost concerns)</p></li>
<li><p>Better handling of large-scale data operations (delete/modify)</p></li>
<li><p>More efficient scalar and full-text search</p></li>
<li><p>Support for the latest embedding models you’re working with</p></li>
</ul>
<p><strong>Milvus 3.0</strong> is our bigger architectural evolution, introducing a vector data lake system for:</p>
<ul>
<li><p>Seamless AI service integration</p></li>
<li><p>Next-level search capabilities</p></li>
<li><p>More robust data management</p></li>
<li><p>Better handling of those massive offline datasets you’re working with</p></li>
</ul>
<h2 id="Technical-Features-Were-Planning---We-Need-Your-Feedback" class="common-anchor-header">Technical Features We’re Planning - We Need Your Feedback<button data-href="#Technical-Features-Were-Planning---We-Need-Your-Feedback" class="anchor-icon" translate="no">
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
    </button></h2><p>Below are key technical features we are planning to add to Milvus.</p>
<table>
<thead>
<tr><th><strong>Key Feature Area</strong></th><th><strong>Technical Features</strong></th></tr>
</thead>
<tbody>
<tr><td><strong>AI-Driven Unstructured Data Processing</strong></td><td>- Data-In/Out: Native integration with major model services for raw text ingestion<br>- Original Data Handling: Text/URL reference support for raw data processing<br>- Tensor Support: Vector list implementation (for ColBERT/CoPali/Video scenarios)<br>- Extended Data Types: DateTime, Map, GIS support based on requirements<br>- Iterative Search: Query vector refinement through user‘s feedback</td></tr>
<tr><td><strong>Search Quality &amp; Performance Improvements</strong></td><td>- Advanced Matching: phrase_match &amp; multi_match capabilities<br>- Analyzer Upgrade: Enhance Analyzer with expanded tokenizer support and improved observability<br>- JSON Optimization: Faster filtering through improved indexing<br>- Execution Sorting: Scalar field-based result ordering<br>- Advanced Reranker: Model-based reranking &amp; custom scoring functions<br>- Iterative Search: Query vector refinement through user‘s feedback</td></tr>
<tr><td><strong>Data Management Flexibility</strong></td><td>- Schema Change: Add/delete field, modify varchar length<br>- Scalar Aggregations: count/distinct/min/max operations<br>- Support UDF: Support user-defined function<br>- Data Versioning: Snapshot-based rollback system<br>- Data Clustering: Co-location through configuration<br>- Data Sampling: Fast get results based on sampling data</td></tr>
<tr><td><strong>Architectural Improvements</strong></td><td>- Stream Node: Simplified incremental data ingestion<br>- MixCoord: Unified coordinator architecture<br>- Logstore Independence: Reduced external dependencies like pulsar<br>- PK Deduplication: Global primary key deduplication</td></tr>
<tr><td><strong>Cost Efficiency &amp; Architecture Improvements</strong></td><td>- Tiered Storage: Hot/cold data separation for lower storage cost<br>- Data Evict Policy: Users can define their own data evict policy<br>- Bulk Updates: Support field-specific value modifications, ETL, etc<br>- Large TopK: Returns massive datasets<br>- VTS GA: Connect to different sources of data<br>- Advanced Quantization: Optimize memory consumption and performance based on quantization techniques<br>- Resource Elasticity: Dynamically scale resources to accommodate varying write loads, read loads, and background task loads</td></tr>
</tbody>
</table>
<p>As we implement this roadmap, we’d appreciate your thoughts and feedback on the following:</p>
<ol>
<li><p><strong>Feature priorities:</strong> Which features in our roadmap would have the most impact on your work?</p></li>
<li><p><strong>Implementation ideas:</strong> Any specific approaches you think would work well for these features?</p></li>
<li><p><strong>Use case alignment:</strong> How do these planned features align with your current and future use cases?</p></li>
<li><p><strong>Performance considerations:</strong> Any performance aspects we should focus on for your specific needs?</p></li>
</ol>
<p><strong>Your insights help us make Milvus better for everyone. Feel free to share your thoughts on our<a href="https://github.com/milvus-io/milvus/discussions/40263"> Milvus Discussion Forum</a> or our <a href="https://discord.com/invite/8uyFbECzPX">Discord Channel</a>.</strong></p>
<h2 id="Welcome-to-Contribute-to-Milvus" class="common-anchor-header">Welcome to Contribute to Milvus<button data-href="#Welcome-to-Contribute-to-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>As an open-source project, Milvus always welcomes your contributions:</p>
<ul>
<li><p><strong>Share feedback:</strong> Report issues or suggest features through our <a href="https://github.com/milvus-io/milvus/issues">GitHub issue page</a></p></li>
<li><p><strong>Code contributions:</strong> Submit pull requests (see our <a href="https://github.com/milvus-io/milvus/blob/82915a9630ab0ff40d7891b97c367ede5726ff7c/CONTRIBUTING.md">Contributor’s Guide</a>)</p></li>
<li><p><strong>Spread the word:</strong> Share your Milvus experiences and <a href="https://github.com/milvus-io/milvus">star our GitHub repository</a></p></li>
</ul>
<p>We’re excited to build this next chapter of Milvus with you. Your code, ideas, and feedback drive this project forward!</p>
<p>– The Milvus Team</p>
