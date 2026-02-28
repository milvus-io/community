---
id: how-to-safely-upgrade-from-milvu-2-5-x-to-milvus-2-6-x.md
title: |
  How to Safely Upgrade from Milvus 2.5.x to Milvus 2.6.x
author: Yiqing Lu
date: 2025-12-25T00:00:00.000Z
cover: assets.zilliz.com/milvus_upgrade_25x_to_26x_700x438_856ac6b75c.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus, vector databases, Milvus 2.6 features, Nvidia Cagra, full text search'
meta_title: |
  How to Safely Upgrade from Milvus 2.5.x to Milvus 2.6.x
desc: >-
  Explore what’s new in Milvus 2.6, including architecture changes and key
  features, and learn how to perform a rolling upgrade from Milvus 2.5.
origin: >-
  https://milvus.io/blog/how-to-safely-upgrade-from-milvu-2-5-x-to-milvus-2-6-x.md
---
<p><a href="https://milvus.io/docs/release_notes.md"><strong>Milvus 2.6</strong></a> has been live for a while, and it’s proving to be a solid step forward for the project. The release brings a refined architecture, stronger real-time performance, lower resource consumption, and smarter scaling behavior in production environments. Many of these improvements were shaped directly by user feedback, and early adopters of 2.6.x have already reported noticeably faster search and more predictable system performance under heavy or dynamic workloads.</p>
<p>For teams running Milvus 2.5.x and evaluating a move to 2.6.x, this guide is your starting point. It breaks down the architectural differences, highlights the key capabilities introduced in Milvus 2.6, and provides a practical, step-by-step upgrade path designed to minimize operational disruption.</p>
<p>If your workloads involve real-time pipelines, multimodal or hybrid search, or large-scale vector operations, this blog will help you assess whether 2.6 aligns with your needs—and, if you decide to proceed, upgrade with confidence while maintaining data integrity and service availability.</p>
<h2 id="Architecture-Changes-from-Milvus-25-to-Milvus-26" class="common-anchor-header">Architecture Changes from Milvus 2.5 to Milvus 2.6<button data-href="#Architecture-Changes-from-Milvus-25-to-Milvus-26" class="anchor-icon" translate="no">
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
    </button></h2><p>Before diving into the upgrade workflow itself, let’s first understand how the Milvus architecture changes in Milvus 2.6.</p>
<h3 id="Milvus-25-Architecture" class="common-anchor-header">Milvus 2.5 Architecture</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Milvus_Architecture_2_5_4e228af3c4.PNG" alt="Milvus 2.5 Architecture" class="doc-image" id="milvus-2.5-architecture" />
    <span>Milvus 2.5 Architecture</span>
  </span>
</p>
<p>In Milvus 2.5, streaming and batch workflows were intertwined across multiple worker nodes:</p>
<ul>
<li><p><strong>QueryNode</strong> handled both historical queries <em>and</em> incremental (streaming) queries.</p></li>
<li><p><strong>DataNode</strong> handled both ingest-time flushing <em>and</em> background compaction on historical data.</p></li>
</ul>
<p>This mixing of batch and real-time logic made it difficult to scale batch workloads independently. It also meant the streaming state was scattered across several components, introducing synchronization delays, complicating failure recovery, and increasing operational complexity.</p>
<h3 id="Milvus-26-Architecture" class="common-anchor-header">Milvus 2.6 Architecture</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Milvus_Architecture_2_6_ee6f1f0635.PNG" alt="Milvus 2.6 Architecture" class="doc-image" id="milvus-2.6-architecture" />
    <span>Milvus 2.6 Architecture</span>
  </span>
</p>
<p>Milvus 2.6 introduces a dedicated <strong>StreamingNode</strong> that handles all real-time data responsibilities: consuming the message queue, writing incremental segments, serving incremental queries, and managing WAL-based recovery. With streaming isolated, the remaining components take on cleaner, more focused roles:</p>
<ul>
<li><p><strong>QueryNode</strong> now handles <em>only</em> batch queries on historical segments.</p></li>
<li><p><strong>DataNode</strong> now handles <em>only</em> historical data tasks such as compaction and index building.</p></li>
</ul>
<p>The StreamingNode absorbs all streaming-related tasks that were split among DataNode, QueryNode, and even the Proxy in Milvus 2.5, bringing clarity and reducing cross-role state sharing.</p>
<h3 id="Milvus-25x-vs-Milvus-26x-Component-by-Component-Comparison" class="common-anchor-header">Milvus 2.5.x vs Milvus 2.6.x: Component-by-Component Comparison</h3><table>
<thead>
<tr><th></th><th style="text-align:center"><strong>Milvus 2.5.x</strong></th><th style="text-align:center"><strong>Milvus 2.6.x</strong></th><th style="text-align:center"><strong>What Changed</strong></th></tr>
</thead>
<tbody>
<tr><td>Coordinator Services</td><td style="text-align:center">RootCoord / QueryCoord / DataCoord (or MixCoord)</td><td style="text-align:center">MixCoord</td><td style="text-align:center">Metadata management and task scheduling are consolidated into a single MixCoord, simplifying coordination logic and reducing distributed complexity.</td></tr>
<tr><td>Access Layer</td><td style="text-align:center">Proxy</td><td style="text-align:center">Proxy</td><td style="text-align:center">Write requests are routed only through the Streaming Node for data ingestion.</td></tr>
<tr><td>Worker Nodes</td><td style="text-align:center">—</td><td style="text-align:center">Streaming Node</td><td style="text-align:center">Dedicated streaming processing node responsible for all incremental (growing segments) logic, including:• Incremental data ingestion• Incremental data querying• Persisting incremental data to object storage• Stream-based writes• Failure recovery based on WAL</td></tr>
<tr><td></td><td style="text-align:center">Query Node</td><td style="text-align:center">Query Node</td><td style="text-align:center">Batch-processing node that handles queries over historical data only.</td></tr>
<tr><td></td><td style="text-align:center">Data Node</td><td style="text-align:center">Data Node</td><td style="text-align:center">Batch-processing node responsible for historical data only, including compaction and index building.</td></tr>
<tr><td></td><td style="text-align:center">Index Node</td><td style="text-align:center">—</td><td style="text-align:center">Index Node is merged into Data Node, simplifying role definitions and deployment topology.</td></tr>
</tbody>
</table>
<p>In short, Milvus 2.6 draws a clear line between streaming and batch workloads, eliminating the cross-component entanglement seen in 2.5 and creating a more scalable, maintainable architecture.</p>
<h2 id="Milvus-26-Feature-Highlights" class="common-anchor-header">Milvus 2.6 Feature Highlights<button data-href="#Milvus-26-Feature-Highlights" class="anchor-icon" translate="no">
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
    </button></h2><p>Before getting into the upgrade workflow, here’s a quick look at what Milvus 2.6 brings to the table. <strong>This release focuses on lowering infrastructure cost, improving search performance, and making large, dynamic AI workloads easier to scale.</strong></p>
<h3 id="Cost--Efficiency-Improvements" class="common-anchor-header">Cost &amp; Efficiency Improvements</h3><ul>
<li><p><a href="https://milvus.io/docs/ivf-rabitq.md#RaBitQ"><strong>RaBitQ</strong></a> <strong>Quantization for Primary Indexes</strong> – A new 1-bit quantization method that compresses vector indexes to <strong>1/32</strong> of their original size. Combined with SQ8 reranking, it reduces memory usage to ~28%, boosts QPS by 4×, and maintains ~95% recall, significantly lowering hardware costs.</p></li>
<li><p><a href="https://milvus.io/docs/full-text-search.md#BM25-implementation"><strong>BM25</strong></a><strong>-Optimized Full-Text Search</strong> – Native BM25 scoring powered by sparse term–weight vectors. Keyword search runs <strong>3–4× faster</strong> (up to <strong>7×</strong> on some datasets) compared to Elasticsearch, while keeping index size to around a third of the original text data.</p></li>
<li><p><strong>JSON Path Indexing with JSON Shredding</strong> – Structured filtering on nested JSON is now dramatically faster and much more predictable. Pre-indexed JSON paths cut filter latency from <strong>140 ms → 1.5 ms</strong> (P99: <strong>480 ms → 10 ms</strong>), making hybrid vector search + metadata filtering significantly more responsive.</p></li>
<li><p><strong>Expanded Data Type Support</strong> – Adds Int8 vector types, <a href="https://milvus.io/docs/geometry-field.md#Geometry-Field">Geometry</a> fields (POINT / LINESTRING / POLYGON), and Array-of-Structs. These extensions support geospatial workloads, richer metadata modeling, and cleaner schemas.</p></li>
<li><p><strong>Upsert for Partial Updates</strong> – You can now insert or update entities using a single primary-key call. Partial updates modify only the fields provided, reducing write amplification and simplifying pipelines that frequently refresh metadata or embeddings.</p></li>
</ul>
<h3 id="Search-and-Retrieval-Enhancements" class="common-anchor-header">Search and Retrieval Enhancements</h3><ul>
<li><p><strong>Improved Text Processing &amp; Multilingual Support:</strong> New Lindera and ICU tokenizers improve Japanese, Korean, and <a href="https://milvus.io/docs/multi-language-analyzers.md#Multi-language-Analyzers">multi-language</a> text handling. Jieba now supports custom dictionaries. <code translate="no">run_analyzer</code> helps debug tokenization behavior, and multi-language analyzers ensure consistent cross-language search.</p></li>
<li><p><strong>High-Precision Text Matching:</strong> <a href="https://milvus.io/docs/phrase-match.md#Phrase-Match">Phrase Match</a> enforces ordered phrase queries with configurable slop. The new <a href="https://milvus.io/docs/ngram.md#NGRAM">NGRAM</a> index accelerates substring and <code translate="no">LIKE</code> queries on both VARCHAR fields and JSON paths, enabling fast partial-text and fuzzy matching.</p></li>
<li><p><strong>Time-Aware and Metadata-Aware Reranking:</strong> <a href="https://milvus.io/docs/decay-ranker-overview.md">Decay Rankers</a> (exponential, linear, Gaussian) adjust scores using timestamps; <a href="https://milvus.io/docs/boost-ranker.md#Boost-Ranker">Boost Rankers</a> apply metadata-driven rules to promote or demote results. Both help fine-tune retrieval behavior without changing your underlying data.</p></li>
<li><p><strong>Simplified Model Integration &amp; Auto-Vectorization:</strong> Built-in integrations with OpenAI, Hugging Face, and other embedding providers let Milvus automatically vectorize text during insert and query operations. No more manual embedding pipelines for common use cases.</p></li>
<li><p><strong>Online Schema Updates for Scalar Fields:</strong> Add new scalar fields to existing collections without downtime or reloads, simplifying schema evolution as metadata requirements grow.</p></li>
<li><p><strong>Near-Duplicate Detection with MinHash:</strong> <a href="https://milvus.io/docs/minhash-lsh.md#MINHASHLSH">MinHash</a> + LSH enables efficient near-duplicate detection across large datasets without expensive exact comparisons.</p></li>
</ul>
<h3 id="Architecture-and-Scalability-Upgrades" class="common-anchor-header">Architecture and Scalability Upgrades</h3><ul>
<li><p><a href="https://milvus.io/docs/tiered-storage-overview.md#Tiered-Storage-Overview"><strong>Tiered Storage</strong></a> <strong>for Hot–Cold Data Management:</strong> Separates hot and cold data across SSD and object storage; supports lazy and partial loading; eliminates the need to fully load collections locally; reduces resource usage by up to 50% and speeds up load times for large datasets.</p></li>
<li><p><strong>Real-Time Streaming Service:</strong> Adds dedicated Streaming Nodes integrated with Kafka/Pulsar for continuous ingestion; enables immediate indexing and query availability; improves write throughput and accelerates failure recovery for real-time, fast-changing workloads.</p></li>
<li><p><strong>Enhanced Scalability &amp; Stability:</strong> Milvus now supports 100,000+ collections for large multi-tenant environments. Infrastructure upgrades — <a href="https://milvus.io/docs/woodpecker_architecture.md#Woodpecker">Woodpecker</a> (zero-disk WAL), <a href="https://milvus.io/docs/roadmap.md#%F0%9F%94%B9-HotCold-Tiering--Storage-Architecture-StorageV2">Storage v2</a> (reduced IOPS/memory), and the <a href="https://milvus.io/docs/release_notes.md#Coordinator-Merge-into-MixCoord">Coordinator Merge</a> — improve cluster stability and enable predictable scaling under heavy workloads.</p></li>
</ul>
<p>For a complete list of Milvus 2.6 features, check out the <a href="https://milvus.io/docs/release_notes.md">Milvus release notes</a>.</p>
<h2 id="How-to-Upgrade-from-Milvus-25x-to-Milvus-26x" class="common-anchor-header">How to Upgrade from Milvus 2.5.x to Milvus 2.6.x<button data-href="#How-to-Upgrade-from-Milvus-25x-to-Milvus-26x" class="anchor-icon" translate="no">
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
    </button></h2><p>To keep the system as available as possible during the upgrade, Milvus 2.5 clusters should be upgraded to Milvus 2.6 in the following order.</p>
<p><strong>1. Start the Streaming Node first</strong></p>
<p>Start the Streaming Node in advance. The new <strong>Delegator</strong> (the component in the Query Node responsible for streaming data handling) must be moved to the Milvus 2.6 Streaming Node.</p>
<p><strong>2. Upgrade MixCoord</strong></p>
<p>Upgrade the coordinator components to <strong>MixCoord</strong>. During this step, MixCoord needs to detect the versions of Worker Nodes in order to handle cross-version compatibility within the distributed system.</p>
<p><strong>3. Upgrade the Query Node</strong></p>
<p>Query Node upgrades typically take longer. During this phase, Milvus 2.5 Data Nodes and Index Nodes can continue handling operations such as Flush and Index building, helping reduce query-side pressure while Query Nodes are being upgraded.</p>
<p><strong>4. Upgrade the Data Node</strong></p>
<p>Once Milvus 2.5 DataNodes are taken offline, Flush operations become unavailable, and data in Growing Segments may continue to accumulate until all nodes are fully upgraded to Milvus 2.6.</p>
<p><strong>5. Upgrade the Proxy</strong></p>
<p>After upgrading a Proxy to Milvus 2.6, write operations on that Proxy will remain unavailable until all cluster components are upgraded to 2.6.</p>
<p><strong>6. Remove the Index Node</strong></p>
<p>Once all other components are upgraded, the standalone Index Node can be safely removed.</p>
<p><strong>Notes:</strong></p>
<ul>
<li><p>From the completion of the DataNode upgrade until the completion of the Proxy upgrade, Flush operations are unavailable.</p></li>
<li><p>From the time the first Proxy is upgraded until all Proxy nodes are upgraded, some write operations are unavailable.</p></li>
<li><p><strong>When upgrading directly from Milvus 2.5.x to 2.6.6, DDL (Data Definition Language) operations are unavailable during the upgrade process due to changes in the DDL framework.</strong></p></li>
</ul>
<h2 id="How-to-Upgrade-to-Milvus-26-with-Milvus-Operator" class="common-anchor-header">How to Upgrade to Milvus 2.6 with Milvus Operator<button data-href="#How-to-Upgrade-to-Milvus-26-with-Milvus-Operator" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://github.com/zilliztech/milvus-operator">Milvus Operator</a> is an open-source Kubernetes operator that provides a scalable, highly available way to deploy, manage, and upgrade the entire Milvus service stack on a target Kubernetes cluster. The Milvus service stack managed by the operator includes:</p>
<ul>
<li><p>Core Milvus components</p></li>
<li><p>Required dependencies such as etcd, Pulsar, and MinIO</p></li>
</ul>
<p>Milvus Operator follows the standard Kubernetes Operator pattern. It introduces a Milvus Custom Resource (CR) that describes the desired state of a Milvus cluster, such as its version, topology, and configuration.</p>
<p>A controller continuously monitors the cluster and reconciles the actual state with the desired state defined in the CR. When changes are made—such as upgrading the Milvus version—the operator automatically applies them in a controlled and repeatable way, enabling automated upgrades and ongoing lifecycle management.</p>
<h3 id="Milvus-Custom-Resource-CR-Example" class="common-anchor-header">Milvus Custom Resource (CR) Example</h3><pre><code translate="no">apiVersion: milvus.io/v1beta1
kind: Milvus
metadata:
  name: my-milvus-mansion    
  namespace: dev       
spec:
  mode: cluster                  <span class="hljs-comment"># cluster or standalone</span>
  <span class="hljs-comment"># Milvus Components</span>
  components:
    image: milvusdb/milvus:v2.6.5
    imageUpdateMode: rollingUpgrade 
    proxy:                   
      replicas: 1          
    mixCoord:              
      replicas: 1           
    dataNode:               
      replicas: 1          
    queryNode:              
      replicas: 2           
      resources:
        requests:
          cpu: <span class="hljs-string">&quot;2&quot;</span>
          memory: <span class="hljs-string">&quot;8Gi&quot;</span>  
  <span class="hljs-comment"># Dependencies, including etcd, storage and message stream</span>
  dependencies:
    etcd:                   
      inCluster:
        values:
          replicaCount: 3    
    storage:                 
      <span class="hljs-built_in">type</span>: MinIO
      inCluster:
        values:
          mode: distributed     
    msgStreamType: pulsar    
    pulsar:
      inCluster:
        values:
          bookkeeper:
            replicas: 3   
  <span class="hljs-comment"># Milvus configs</span>
  config:
    dataCoord:
      enableActiveStandby: <span class="hljs-literal">true</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Rolling-Upgrades-from-Milvus-25-to-26-with-Milvus-Operator" class="common-anchor-header">Rolling Upgrades from Milvus 2.5 to 2.6 with Milvus Operator</h3><p>Milvus Operator provides built-in support for <strong>rolling upgrades from Milvus 2.5 to 2.6</strong> in cluster mode, adapting its behavior to account for architectural changes introduced in 2.6.</p>
<p><strong>1. Upgrade Scenario Detection</strong></p>
<p>During an upgrade, Milvus Operator determines the target Milvus version from the cluster specification. This is done by either:</p>
<ul>
<li><p>Inspecting the image tag defined in <code translate="no">spec.components.image</code>, or</p></li>
<li><p>Reading the explicit version specified in <code translate="no">spec.components.version</code></p></li>
</ul>
<p>The operator then compares this desired version with the currently running version, which is recorded in <code translate="no">status.currentImage</code> or <code translate="no">status.currentVersion</code>. If the current version is 2.5 and the desired version is 2.6, the operator identifies the upgrade as a 2.5 → 2.6 upgrade scenario.</p>
<p><strong>2. Rolling Upgrade Execution Order</strong></p>
<p>When a 2.5 → 2.6 upgrade is detected and the upgrade mode is set to rolling upgrade (<code translate="no">spec.components.imageUpdateMode: rollingUpgrade</code>, which is the default), Milvus Operator automatically performs the upgrade in a predefined order aligned with the Milvus 2.6 architecture:</p>
<p>Start the Streaming Node → Upgrade MixCoord → Upgrade the Query Node → Upgrade the Data Node → Upgrade the Proxy → Remove the Index Node</p>
<p><strong>3. Automatic Coordinator Consolidation</strong></p>
<p>Milvus 2.6 replaces multiple coordinator components with a single MixCoord. Milvus Operator handles this architectural transition automatically.</p>
<p>When <code translate="no">spec.components.mixCoord</code> is configured, the operator brings up MixCoord and waits until it becomes ready. Once MixCoord is fully operational, the operator gracefully shuts down the legacy coordinator components—RootCoord, QueryCoord, and DataCoord—completing the migration without requiring any manual intervention.</p>
<h3 id="Upgrade-Steps-from-Milvus-25-to-26" class="common-anchor-header">Upgrade Steps from Milvus 2.5 to 2.6</h3><p>1.Upgrade Milvus Operator to the latest version (In this guide, we use <strong>version 1.3.3</strong>, which was the latest release at the time of writing.)</p>
<pre><code translate="no"><span class="hljs-comment"># Option 1: Using Helm</span>
helm upgrade --install milvus-operator \
  -n milvus-operator --create-namespace \
  https://github.com/zilliztech/milvus-operator/releases/download/v1.3.3/milvus-operator-1.3.3.tgz
 <span class="hljs-comment"># Option 2: Using kubectl &amp; raw manifests</span>
 kubectl apply -f https://raw.githubusercontent.com/zilliztech/milvus-operator/v1.3.3/deploy/manifests/deployment.yaml
<button class="copy-code-btn"></button></code></pre>
<p>2.Merge coordinator components</p>
<pre><code translate="no">kubectl patch milvus my-release -n demo-operator --<span class="hljs-built_in">type</span>=merge -p <span class="hljs-string">&#x27;
{
  &quot;spec&quot;: {
    &quot;components&quot;: {
      &quot;mixCoord&quot;: {
        &quot;replicas&quot;: 1
      }
    }
  }
}&#x27;</span>
<button class="copy-code-btn"></button></code></pre>
<p>3.Ensure the cluster is running Milvus 2.5.16 or later</p>
<pre><code translate="no">kubectl patch milvus my-release -n demo-operator --<span class="hljs-built_in">type</span>=merge -p <span class="hljs-string">&#x27;
{
  &quot;spec&quot;: {
    &quot;components&quot;: {
      &quot;image&quot;: &quot;milvusdb/milvus:v2.5.22&quot;
    }
  }
}&#x27;</span>
<span class="hljs-comment"># wait till updated</span>
kubectl <span class="hljs-built_in">wait</span> milvus my-release -n demo-operator --<span class="hljs-keyword">for</span>=condition=milvusupdated --<span class="hljs-built_in">timeout</span>=1h
<button class="copy-code-btn"></button></code></pre>
<p>4.Upgrade Milvus to version 2.6</p>
<pre><code translate="no">kubectl patch milvus my-release -n demo-operator --<span class="hljs-built_in">type</span>=merge -p <span class="hljs-string">&#x27;
{
  &quot;spec&quot;: {
    &quot;components&quot;: {
      &quot;image&quot;: &quot;milvusdb/milvus:v2.6.5&quot;
    }
  }
}&#x27;</span>
<span class="hljs-comment"># wait till updated</span>
kubectl <span class="hljs-built_in">wait</span> milvus my-release -n demo-operator --<span class="hljs-keyword">for</span>=condition=milvusupdated --<span class="hljs-built_in">timeout</span>=1h
<button class="copy-code-btn"></button></code></pre>
<h2 id="How-to-Upgrade-to-Milvus-26-with-Helm" class="common-anchor-header">How to Upgrade to Milvus 2.6 with Helm<button data-href="#How-to-Upgrade-to-Milvus-26-with-Helm" class="anchor-icon" translate="no">
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
    </button></h2><p>When deploying Milvus using Helm, all Kubernetes <code translate="no">Deployment</code> resources are updated in parallel, without a guaranteed execution order. As a result, Helm does not provide strict control over rolling upgrade sequences across components. For production environments, using Milvus Operator is therefore strongly recommended.</p>
<p>Milvus can still be upgraded from 2.5 to 2.6 using Helm by following the steps below.</p>
<p>System Requirements</p>
<ul>
<li><p><strong>Helm version:</strong> ≥ 3.14.0</p></li>
<li><p><strong>Kubernetes version:</strong> ≥ 1.20.0</p></li>
</ul>
<p>1.Upgrade the Milvus Helm chart to the latest version. In this guide, we use <strong>chart version 5.0.7</strong>, which was the latest at the time of writing.</p>
<pre><code translate="no">helm repo <span class="hljs-keyword">add</span> zilliztech https:<span class="hljs-comment">//zilliztech.github.io/milvus-helm</span>
helm repo update
<button class="copy-code-btn"></button></code></pre>
<p>2.If the cluster is deployed with multiple coordinator components, first upgrade Milvus to version 2.5.16 or later and enable MixCoord.</p>
<pre><code translate="no">mixCoordinator
。
helm upgrade -i my-release zilliztech/milvus \
  --namespace=helm-demo \
  --<span class="hljs-built_in">set</span> image.all.tag=<span class="hljs-string">&quot;v2.5.22&quot;</span> \
  --<span class="hljs-built_in">set</span> mixCoordinator.enabled=<span class="hljs-literal">true</span> \
  --<span class="hljs-built_in">set</span> rootCoordinator.enabled=<span class="hljs-literal">false</span> \
  --<span class="hljs-built_in">set</span> indexCoordinator.enabled=<span class="hljs-literal">false</span> \
  --<span class="hljs-built_in">set</span> queryCoordinator.enabled=<span class="hljs-literal">false</span> \
  --<span class="hljs-built_in">set</span> dataCoordinator.enabled=<span class="hljs-literal">false</span> \
  --<span class="hljs-built_in">set</span> streaming.enabled=<span class="hljs-literal">false</span> \
  --<span class="hljs-built_in">set</span> indexNode.enabled=<span class="hljs-literal">true</span> \
  --reset-then-reuse-values \
  --version=5.0.7 \
  --<span class="hljs-built_in">wait</span> --<span class="hljs-built_in">timeout</span> 1h
<button class="copy-code-btn"></button></code></pre>
<p>3.Upgrade Milvus to version 2.6</p>
<pre><code translate="no">helm upgrade my-release zilliztech/milvus \
  --namespace=helm-demo \
  --<span class="hljs-built_in">set</span> image.all.tag=<span class="hljs-string">&quot;v2.6.5&quot;</span> \
  --<span class="hljs-built_in">set</span> streaming.enabled=<span class="hljs-literal">true</span> \
  --<span class="hljs-built_in">set</span> indexNode.enabled=<span class="hljs-literal">false</span> \
  --reset-then-reuse-values \
  --version=5.0.7 \
  --<span class="hljs-built_in">wait</span> --<span class="hljs-built_in">timeout</span> 1h
<button class="copy-code-btn"></button></code></pre>
<h2 id="FAQ-on-Milvus-26-Upgrade-and-Operations" class="common-anchor-header">FAQ on Milvus 2.6 Upgrade and Operations<button data-href="#FAQ-on-Milvus-26-Upgrade-and-Operations" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Q1-Milvus-Helm-vs-Milvus-Operator--which-one-should-I-use" class="common-anchor-header">Q1: Milvus Helm vs. Milvus Operator — which one should I use?</h3><p>For production environments, Milvus Operator is strongly recommended.</p>
<p>Refer to the official guide for details: <a href="https://github.com/zilliztech/milvus-operator?tab=readme-ov-file#milvus-operator-vs-helm">https://github.com/zilliztech/milvus-operator?tab=readme-ov-file#milvus-operator-vs-helm</a></p>
<h3 id="Q2-How-should-I-choose-a-Message-Queue-MQ" class="common-anchor-header">Q2: How should I choose a Message Queue (MQ)?</h3><p>The recommended MQ depends on the deployment mode and operational requirements:</p>
<p><strong>1. Standalone mode:</strong> For cost-sensitive deployments, RocksMQ is recommended.</p>
<p><strong>2. Cluster mode</strong></p>
<ul>
<li><p><strong>Pulsar</strong> supports multi-tenancy, allows large clusters to share infrastructure, and offers strong horizontal scalability.</p></li>
<li><p><strong>Kafka</strong> has a more mature ecosystem, with managed SaaS offerings available on most major cloud platforms.</p></li>
</ul>
<p><strong>3. Woodpecker (introduced in Milvus 2.6):</strong> Woodpecker removes the need for an external message queue, reducing cost and operational complexity.</p>
<ul>
<li><p>Currently, only the embedded Woodpecker mode is supported, which is lightweight and easy to operate.</p></li>
<li><p>For Milvus 2.6 standalone deployments, Woodpecker is recommended.</p></li>
<li><p>For production cluster deployments, it is recommended to use the upcoming Woodpecker cluster mode once it becomes available.</p></li>
</ul>
<h3 id="Q3-Can-the-Message-Queue-be-switched-during-an-upgrade" class="common-anchor-header">Q3: Can the Message Queue be switched during an upgrade?</h3><p>No. Switching the Message Queue during an upgrade is not currently supported. Future releases will introduce management APIs to support switching between Pulsar, Kafka, Woodpecker, and RocksMQ.</p>
<h3 id="Q4-Do-rate-limiting-configurations-need-to-be-updated-for-Milvus-26" class="common-anchor-header">Q4: Do rate-limiting configurations need to be updated for Milvus 2.6?</h3><p>No. Existing rate-limiting configurations remain effective and also apply to the new Streaming Node. No changes are required.</p>
<h3 id="Q5-After-the-coordinator-merge-do-monitoring-roles-or-configurations-change" class="common-anchor-header">Q5: After the coordinator merge, do monitoring roles or configurations change?</h3><ul>
<li><p>Monitoring roles remain unchanged (<code translate="no">RootCoord</code>, <code translate="no">QueryCoord</code>, <code translate="no">DataCoord</code>).</p></li>
<li><p>Existing configuration options continue to work as before.</p></li>
<li><p>A new configuration option, <code translate="no">mixCoord.enableActiveStandby</code>, is introduced and will fall back to <code translate="no">rootcoord.enableActiveStandby</code> if not explicitly set.</p></li>
</ul>
<h3 id="Q6-What-are-the-recommended-resource-settings-for-StreamingNode" class="common-anchor-header">Q6: What are the recommended resource settings for StreamingNode?</h3><ul>
<li><p>For light real-time ingestion or occasional write-and-query workloads, a smaller configuration, such as 2 CPU cores and 8 GB of memory, is sufficient.</p></li>
<li><p>For heavy real-time ingestion or continuous write-and-query workloads, it is recommended to allocate resources comparable to those of the Query Node.</p></li>
</ul>
<h3 id="Q7-How-do-I-upgrade-a-standalone-deployment-using-Docker-Compose" class="common-anchor-header">Q7: How do I upgrade a standalone deployment using Docker Compose?</h3><p>For Docker Compose–based standalone deployments, simply update the Milvus image tag in <code translate="no">docker-compose.yaml</code>.</p>
<p>Refer to the official guide for details: <a href="https://milvus.io/docs/upgrade_milvus_standalone-docker.md">https://milvus.io/docs/upgrade_milvus_standalone-docker.md</a></p>
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
    </button></h2><p>Milvus 2.6 marks a major improvement in both architecture and operations. By separating streaming and batch processing with the introduction of StreamingNode, consolidating coordinators into MixCoord, and simplifying worker roles, Milvus 2.6 provides a more stable, scalable, and easier-to-operate foundation for large-scale vector workloads.</p>
<p>These architectural changes make upgrades—especially from Milvus 2.5—more order-sensitive. A successful upgrade depends on respecting component dependencies and temporary availability constraints. For production environments, Milvus Operator is the recommended approach, as it automates upgrade sequencing and reduces operational risk, while Helm-based upgrades are better suited for non-production use cases.</p>
<p>With enhanced search capabilities, richer data types, tiered storage, and improved message queue options, Milvus 2.6 is well-positioned to support modern AI applications that require real-time ingestion, high query performance, and efficient operations at scale.</p>
<p>Have questions or want a deep dive on any feature of the latest Milvus? Join our<a href="https://discord.com/invite/8uyFbECzPX"> Discord channel</a> or file issues on<a href="https://github.com/milvus-io/milvus"> GitHub</a>. You can also book a 20-minute one-on-one session to get insights, guidance, and answers to your questions through<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus Office Hours</a>.</p>
<h2 id="More-Resources-about-Milvus-26" class="common-anchor-header">More Resources about Milvus 2.6<button data-href="#More-Resources-about-Milvus-26" class="anchor-icon" translate="no">
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
    </button></h2><ul>
<li><p><a href="https://milvus.io/docs/release_notes.md">Milvus 2.6 Release Notes</a></p></li>
<li><p><a href="https://www.youtube.com/watch?v=Guct-UMK8lw&amp;t=157s">Milvus 2.6 Webinar Recording: Faster Search, Lower Cost, and Smarter Scaling</a></p></li>
<li><p>Milvus 2.6 Feature Blogs</p>
<ul>
<li><p><a href="https://milvus.io/blog/data-in-and-data-out-in-milvus-2-6.md">Introducing the Embedding Function: How Milvus 2.6 Streamlines Vectorization and Semantic Search</a></p></li>
<li><p><a href="https://milvus.io/blog/json-shredding-in-milvus-faster-json-filtering-with-flexibility.md">JSON Shredding in Milvus: 88.9x Faster JSON Filtering with Flexibility</a></p></li>
<li><p><a href="https://milvus.io/blog/unlocking-true-entity-level-retrieval-new-array-of-structs-and-max-sim-capabilities-in-milvus.md">Unlocking True Entity-Level Retrieval: New Array-of-Structs and MAX_SIM Capabilities in Milvus</a></p></li>
<li><p><a href="https://milvus.io/blog/milvus-tiered-storage-80-less-vector-search-cost-with-on-demand-hot%E2%80%93cold-data-loading.md">Stop Paying for Cold Data: 80% Cost Reduction with On-Demand Hot–Cold Data Loading in Milvus Tiered Storage</a></p></li>
<li><p><a href="https://milvus.io/blog/introducing-aisaq-in-milvus-billion-scale-vector-search-got-3200-cheaper-on-memory.md">Introducing AISAQ in Milvus: Billion-Scale Vector Search Just Got 3,200× Cheaper on Memory</a></p></li>
<li><p><a href="https://milvus.io/blog/faster-index-builds-and-scalable-queries-with-gpu-cagra-in-milvus.md">Optimizing NVIDIA CAGRA in Milvus: A Hybrid GPU–CPU Approach to Faster Indexing and Cheaper Queries</a></p></li>
<li><p><a href="https://milvus.io/blog/milvus-ngram-index-faster-keyword-matching-and-like-queries-for-agent-workloads.md">Introducing the Milvus Ngram Index: Faster Keyword Matching and LIKE Queries for Agent Workloads</a></p></li>
<li><p><a href="https://milvus.io/blog/unlock-geo-vector-search-with-geometry-fields-and-rtree-index-in-milvus.md">Bringing Geospatial Filtering and Vector Search Together with Geometry Fields and RTREE in Milvus 2.6</a></p></li>
<li><p><a href="https://milvus.io/blog/how-to-filter-efficiently-without-killing-recall.md">Vector Search in the Real World: How to Filter Efficiently Without Killing Recall</a></p></li>
<li><p><a href="https://milvus.io/blog/bring-vector-compression-to-the-extreme-how-milvus-serves-3%C3%97-more-queries-with-rabitq.md">Bring Vector Compression to the Extreme: How Milvus Serves 3× More Queries with RaBitQ</a></p></li>
<li><p><a href="https://milvus.io/blog/benchmarks-lie-vector-dbs-deserve-a-real-test.md">Benchmarks Lie — Vector DBs Deserve a Real Test</a></p></li>
<li><p><a href="https://milvus.io/blog/we-replaced-kafka-pulsar-with-a-woodpecker-for-milvus.md">We Replaced Kafka/Pulsar with a Woodpecker for Milvus—Here’s What Happened</a></p></li>
<li><p><a href="https://milvus.io/blog/minhash-lsh-in-milvus-the-secret-weapon-for-fighting-duplicates-in-llm-training-data.md">MinHash LSH in Milvus: The Secret Weapon for Fighting Duplicates in LLM Training Data</a></p></li>
</ul></li>
</ul>
