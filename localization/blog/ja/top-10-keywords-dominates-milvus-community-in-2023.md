---
id: top-10-keywords-dominates-milvus-community-in-2023.md
title: Unveiling the Top 10 Keywords Dominating the Milvus Community in 2023
author: 'Jack Li, Fendy Feng'
date: 2024-1-21
desc: >-
  This post explores the heart of the community by analyzing chat histories and
  revealing the top 10 keywords in discussions.
metaTitle: Top 10 Keywords Dominating the Milvus Community in 2023
cover: >-
  assets.zilliz.com/Top_10_Keywords_in_the_Milvus_Community_20240116_111204_1_f65b17a8ea.png
tag: Engineering
tags: >-
  Data science, Database, Tech, Artificial Intelligence, Vector Management,
  Milvus
recommend: true
canonicalUrl: 'https://milvus.io/blog/top-10-keywords-dominates-milvus-community-in-2023.md'
---
<p>As we conclude 2023, let’s review the Milvus community’s remarkable journey: boasting <a href="https://github.com/milvus-io/milvus">25,000 GitHub Stars</a>, the launch of <a href="https://milvus.io/blog/unveiling-milvus-2-3-milestone-release-offering-support-for-gpu-arm64-cdc-and-other-features.md">Milvus 2.3.0</a>, and exceeding 10 million <a href="https://hub.docker.com/r/milvusdb/milvus">Docker image</a> downloads. This post explores the heart of the community by analyzing chat histories and revealing the top 10 keywords in discussions.</p>
<iframe class="video-player" src="https://www.youtube.com/embed/o5uMdNLioQ0?list=PLPg7_faNDlT5Fb8WN8r1PzzQTNzdechnS" title="Mastering Milvus: Turbocharge Your Vector Database with Optimization Secrets!" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
<h2 id="1-Version--The-rise-of-AIGC-drives-rapid-Milvus-iteration" class="common-anchor-header">#1 Version — The rise of AIGC drives rapid Milvus iteration<button data-href="#1-Version--The-rise-of-AIGC-drives-rapid-Milvus-iteration" class="anchor-icon" translate="no">
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
    </button></h2><p>Surprisingly, “Version” emerged as the most discussed keyword in 2023. This revelation is rooted in the year’s AI wave, with vector databases as a critical infrastructure to tackle challenges in AIGC applications’ hallucination issues.</p>
<p>The enthusiasm around vector databases drives Milvus into a stage of swift iteration. The community witnessed the release of Twenty versions in 2023 alone, accommodating the demands of AIGC developers flooding the community with inquiries about choosing the optimal version of Milvus for various applications. For users navigating these updates, we recommend embracing the latest version for enhanced features and performance.</p>
<p>If you are interested in Milvus’s release planning, refer to the <a href="https://wiki.lfaidata.foundation/display/MIL/Milvus+Long+Term+Roadmap+and+Time+schedule">Milvus Roadmap</a> page on the official website.</p>
<h2 id="2-Search--beyond-Vector-Search" class="common-anchor-header">#2 Search — beyond Vector Search<button data-href="#2-Search--beyond-Vector-Search" class="anchor-icon" translate="no">
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
    </button></h2><p>“Search” takes second place, reflecting its fundamental role in database operations. Milvus supports various search capabilities, from Top-K ANN search to scalar filtered search and range search. The imminent release of Milvus 3.0 (Beta) promises keyword search (sparse embeddings), which many RAG app developers eagerly await.</p>
<p>Community discussions about searching focus on performance, capabilities, and principles. Users often ask questions about attribute filtering, setting index threshold values, and addressing latency concerns. Resources like <a href="https://milvus.io/docs/v2.0.x/search.md">query and search documentation</a>, <a href="https://wiki.lfaidata.foundation/pages/viewpage.action?pageId=43287103">Milvus Enhancement Proposals (MEPs)</a>, and Discord discussions have become the go-to references for unraveling the intricacies of searching within Milvus.</p>
<h2 id="3-Memory--trade-offs-between-performance-and-accuracy-for-minimized-memory-overhead" class="common-anchor-header">#3 Memory — trade-offs between performance and accuracy for minimized memory overhead<button data-href="#3-Memory--trade-offs-between-performance-and-accuracy-for-minimized-memory-overhead" class="anchor-icon" translate="no">
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
    </button></h2><p>“Memory” also took center stage in community discussions over the past year. As a distinctive data type, vectors inherently have high dimensions. Storing vectors in memory is a common practice for optimal performance, but the escalating data volume limits available memory. Milvus optimizes memory usage by adopting techniques like <a href="https://zilliz.com/blog/milvus-introduced-mmap-for-redefined-data-management-increased-storage-capability">MMap</a> and DiskANN.</p>
<p>However, achieving low memory usage, excellent performance, and high accuracy simultaneously in a database system remains complex, necessitating trade-offs between performance and accuracy to minimize memory overhead.</p>
<p>In the case of Artificial Intelligence Generated Content (AIGC), developers usually prioritize fast responses and result accuracy over stringent performance requirements. Milvus’s addition of MMap and DiskANN minimizes memory usage while maximizing data processing and result accuracy, striking a balance that aligns with the practical needs of AIGC applications.</p>
<h2 id="4-Insert--smooth-sailing-through-data-insertion" class="common-anchor-header">#4 Insert — smooth sailing through data insertion<button data-href="#4-Insert--smooth-sailing-through-data-insertion" class="anchor-icon" translate="no">
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
    </button></h2><p>Efficient data insertion is a crucial concern for developers, sparking frequent discussions on optimizing insertion speed within the Milvus community. Milvus excels in the efficient insertion of streaming data and the building of indexes, thanks to its adept separation of streaming and batch data. This capability sets it apart as a highly performant solution compared to other vector database providers, such as Pinecone.</p>
<p>Here are some valuable insights and recommendations about data insertions:</p>
<ul>
<li><p><strong>Batch Insertion:</strong> Opt for batch over single-row insertion for enhanced efficiency. Notably, insertion from files surpasses batch insertion in speed. When handling large datasets exceeding ten million records, consider using the <code translate="no">bulk_insert</code> interface for a streamlined and accelerated import process.</p></li>
<li><p><strong>Strategic <code translate="no">flush()</code> Usage:</strong> Rather than invoking the <code translate="no">flush()</code> interface after each batch, make a single call after completing all data insertion. Excessive use of the <code translate="no">flush()</code> interface between batches can lead to the generation of fragmented segment files, placing a considerable compaction burden on the system.</p></li>
<li><p><strong>Primary Key Deduplication:</strong> Milvus does not perform primary key deduplication when using the <code translate="no">insert</code> interface for data insertion. If you need to deduplicate primary keys, we recommend you deploy the <code translate="no">upsert</code> interface. However, the insertion performance of <code translate="no">upsert</code>is lower than that of <code translate="no">insert</code>, owing to an additional internal query operation.</p></li>
</ul>
<h2 id="5-Configuration--decoding-the-parameter-maze" class="common-anchor-header">#5 Configuration — decoding the parameter maze<button data-href="#5-Configuration--decoding-the-parameter-maze" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus is a distributed vector database that integrates many third-party components like object storage, message queues, and Etcd. Users grappled with adjusting parameters and understanding their impact on Milvus’s performance, making “Configuration” a frequently discussed topic.</p>
<p>Among all the questions about configurations, “which parameters to adjust” is arguably the most challenging aspect, as the parameters vary in different situations. For instance, optimizing search performance parameters differs from optimizing insertion performance parameters and relies heavily on practical experience.</p>
<p>Once users identify “which parameters to adjust,” the subsequent questions of “how to adjust” become more manageable. For specific procedures, refer to our documentation <a href="https://milvus.io/docs/configure-helm.md">Configure Milvus</a>. The great news is that Milvus has supported dynamic parameter adjustments since version 2.3.0, eliminating the need for restarts for changes to take effect. For specific procedures, refer to <a href="https://milvus.io/docs/dynamic_config.md">Configure Milvus on the Fly</a>.</p>
<h2 id="6-Logs--navigating-the-troubleshooting-compass" class="common-anchor-header">#6 Logs — navigating the troubleshooting compass<button data-href="#6-Logs--navigating-the-troubleshooting-compass" class="anchor-icon" translate="no">
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
    </button></h2><p>“Logs” serve as the troubleshooter’s compass. Users sought guidance in the community on exporting Milvus logs, adjusting log levels, and integrating with systems like Grafana’s Loki. Here are some suggestions about Milvus logs.</p>
<ul>
<li><p><strong>How to view and export Milvus logs:</strong> You can easily export Milvus logs with the one-click script <a href="https://github.com/milvus-io/milvus/tree/master/deployments/export-log">export-milvus-log.sh</a> which is available on the GitHub repository.</p></li>
<li><p><strong>Log level:</strong> Milvus has multiple log levels to accommodate diverse use cases. The info level is enough for most cases, and the debug level is for debugging. An excess of Milvus logs may signal misconfigured log levels.</p></li>
<li><p><strong>We recommend integrating Milvus logs with a log collection system</strong> like Loki for streamlined log retrieval in future troubleshooting.</p></li>
</ul>
<h2 id="7-Cluster--scaling-for-production-environments" class="common-anchor-header">#7 Cluster — scaling for production environments<button data-href="#7-Cluster--scaling-for-production-environments" class="anchor-icon" translate="no">
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
    </button></h2><p>Given Milvus’s identity as a distributed vector database, the term “cluster” is a frequent topic of discussion in the community. Conversations revolve around scaling data in a cluster, data migration, and data backup and synchronization.</p>
<p>In production environments, robust scalability and high availability are standard requirements for distributed database systems. Milvus’s storage-computation separation architecture allows seamless data scalability by expanding resources for computation and storage nodes, accommodating limitless data scales. Milvus also provides high availability with a multi-replica architecture and robust backup and syncing capabilities.  For more information, refer to <a href="https://milvus.io/docs/coordinator_ha.md#Coordinator-HA">Coordinator HA</a>.</p>
<h2 id="8-Documentation--the-gateway-to-understanding-Milvus" class="common-anchor-header">#8 Documentation — the gateway to understanding Milvus<button data-href="#8-Documentation--the-gateway-to-understanding-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>“Documentation” is another frequently raised keyword in community discussions, often tied to questions about whether there is any documentation page for a specific feature and where to find it.</p>
<p>Serving as the gateway to understanding Milvus, around 80% of community inquiries find answers in the <a href="https://milvus.io/docs">official documentation</a>. We recommend you read our documentation before using Milvus or encountering any problems. In addition, you can explore code examples in various SDK repositories for insights into using Milvus.</p>
<h2 id="9-Deployment--simplifying-the-Milvus-journey" class="common-anchor-header">#9 Deployment — simplifying the Milvus journey<button data-href="#9-Deployment--simplifying-the-Milvus-journey" class="anchor-icon" translate="no">
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
    </button></h2><p>Simple deployment remains the Milvus team’s ongoing goal. To fulfill this commitment, we introduced <a href="https://milvus.io/docs/milvus_lite.md#Get-Started-with-Milvus-Lite">Milvus Lite</a>, a lightweight alternative to Milvus that is fully functional but has no K8s or Docker dependencies.</p>
<p>We further streamlined deployment by introducing the lighter <a href="https://zilliz.com/blog/optimizing-data-communication-milvus-embraces-nats-messaging">NATS</a> messaging solution and consolidating node components. Responding to user feedback, we’re gearing up to release a standalone version without dependencies, with ongoing efforts to enhance features and simplify deployment operations. The rapid iteration of Milvus showcases the community’s continuous commitment to the continued refinement of the deployment process.</p>
<h2 id="10-Deletion--unraveling-the-impact" class="common-anchor-header">#10 Deletion — unraveling the impact<button data-href="#10-Deletion--unraveling-the-impact" class="anchor-icon" translate="no">
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
    </button></h2><p>The prevalent discussions on “deletion” revolve around unchanged data counts after deletion, the continued retrievability of deleted data, and the failure of disk space recovery after deletion.</p>
<p>Milvus 2.3 introduces the <code translate="no">count(*)</code> expression to address delayed entity count updates. The persistence of deleted data in queries is probably due to the inappropriate use of <a href="https://zilliz.com/blog/understand-consistency-models-for-vector-databases">data consistency models</a>. Disk space recovery failure concerns prompt insights into redesigning Milvus’s garbage collection mechanism, which sets a waiting period before the complete deletion of data. This approach allows a time window for potential recovery.</p>
<h2 id="Conclusion" class="common-anchor-header">Conclusion<button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p>The top 10 keywords offer a glimpse into the vibrant discussions within the Milvus community. As Milvus continues to evolve, the community remains an invaluable resource for developers seeking solutions, sharing experiences, and contributing to advancing vector databases in the era of AI.</p>
<p>Join this exciting journey by joining our <a href="https://discord.com/invite/8uyFbECzPX">Discord channel</a> in 2024. There, you can engage with our brilliant engineers and connect with like-minded Milvus enthusiasts. Also, attend the <a href="https://discord.com/invite/RjNbk8RR4f">Milvus Community Lunch and Learn</a> every Tuesday from 12:00 to 12:30 PM PST. Share your thoughts, questions, and feedback, as every contribution adds to the collaborative spirit propelling Milvus forward. Your active participation is not just welcomed; it’s appreciated. Let’s innovate together!</p>
