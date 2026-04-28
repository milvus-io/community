---
id: building-a-milvus-cluster-based-on-juicefs.md
title: What is JuiceFS?
author: Changjian Gao and Jingjing Jia
date: 2021-06-15T07:21:07.938Z
desc: >-
  Learn how to build a Milvus cluster based on JuiceFS, a shared file system
  designed for cloud-native environments.
cover: assets.zilliz.com/Juice_FS_blog_cover_851cc9e726.jpg
tag: Engineering
canonicalUrl: 'https://zilliz.com/blog/building-a-milvus-cluster-based-on-juicefs'
---
<custom-h1>Building a Milvus Cluster Based on JuiceFS</custom-h1><p>Collaborations between open-source communities are a magical thing. Not only do passionate, intelligent, and creative volunteers keep open-source solutions innovative, they also work to bring different tools together in interesting and useful ways. <a href="https://milvus.io/">Milvus</a>, the world’s most popular vector database, and <a href="https://github.com/juicedata/juicefs">JuiceFS</a>, a shared file system designed for cloud-native environments, were united in this spirit by their respective open-source communities. This article explains what JuiceFS is, how to build a Milvus cluster based on JuiceFS shared file storage, and the performance users can expect using this solution.</p>
<h2 id="What-is-JuiceFS" class="common-anchor-header"><strong>What is JuiceFS?</strong><button data-href="#What-is-JuiceFS" class="anchor-icon" translate="no">
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
    </button></h2><p>JuiceFS is a high-performance, open-source distributed POSIX file system, which can be built on top of Redis and S3. It was designed for cloud-native environments and supports managing, analyzing, archiving, and backing up data of any type. JuiceFS is commonly used for solving big data challenges, building artificial intelligence (AI) applications, and log collection. The system also supports data sharing across multiple clients and can be used directly as shared storage in Milvus.</p>
<p>After data, and its corresponding metadata, are persisted to object storage and <a href="https://redis.io/">Redis</a> respectively, JuiceFS serves as a stateless middleware. Data sharing is realized by enabling different applications to dock with each other seamlessly through a standard file system interface. JuiceFS relies on Redis, an open-source in-memory data store, for metadata storage. Redis is used because it guarantees atomicity and provides high performance metadata operations. All data is stored in object storage through the JuiceFS client. The architecture diagram is as follows:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/juicefs_architecture_2023b37a4e.png" alt="juicefs-architecture.png" class="doc-image" id="juicefs-architecture.png" />
    <span>juicefs-architecture.png</span>
  </span>
</p>
<h2 id="Build-a-Milvus-cluster-based-on-JuiceFS" class="common-anchor-header"><strong>Build a Milvus cluster based on JuiceFS</strong><button data-href="#Build-a-Milvus-cluster-based-on-JuiceFS" class="anchor-icon" translate="no">
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
    </button></h2><p>A Milvus cluster built with JuiceFS (see architecture diagram below) works by splitting upstream requests using Mishards, a cluster sharding middleware, to cascade the requests down to its sub-modules. When inserting data, Mishards allocates upstream requests to the Milvus write node, which stores newly inserted data in JuiceFS. When reading data, Mishards loads the data from JuiceFS through a Milvus read node to memory for processing, then collects and returns results from sub-services upstream.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/milvus_cluster_built_with_juicefs_3a43cd262c.png" alt="milvus-cluster-built-with-juicefs.png" class="doc-image" id="milvus-cluster-built-with-juicefs.png" />
    <span>milvus-cluster-built-with-juicefs.png</span>
  </span>
</p>
<h3 id="Step-1-Launch-MySQL-service" class="common-anchor-header"><strong>Step 1: Launch MySQL service</strong></h3><p>Launch the MySQL service on <strong>any</strong> node in the cluster. For details, see <a href="https://milvus.io/docs/v1.1.0/data_manage.md">Manage Metadata with MySQL</a>.</p>
<h3 id="Step-2-Create-a-JuiceFS-file-system" class="common-anchor-header"><strong>Step 2: Create a JuiceFS file system</strong></h3><p>For demonstration purposes, the pre-compiled binary JuiceFS program is used. Download the correct <a href="https://github.com/juicedata/juicefs/releases">installation package</a> for your system and follow the JuiceFS <a href="https://github.com/juicedata/juicefs-quickstart">Quick Start Guide</a> for detailed install instructions. To create a JuiceFS file system, first set up a Redis database for metadata storage. It is recommended that for public cloud deployments you host the Redis service on the same cloud as the application. Additionally, set up object storage for JuiceFS. In this example, Azure Blob Storage is used; however, JuiceFS supports almost all object services. Select the object storage service that best suits the demands of your scenario.</p>
<p>After configuring the Redis service and object storage, format a new file system and mount JuiceFS to the local directory:</p>
<pre><code translate="no">1 $  <span class="hljs-built_in">export</span> AZURE_STORAGE_CONNECTION_STRING=<span class="hljs-string">&quot;DefaultEndpointsProtocol=https;AccountName=XXX;AccountKey=XXX;EndpointSuffix=core.windows.net&quot;</span>
2 $ ./juicefs format \
3     --storage wasb \
4     --bucket https://&lt;container&gt; \
5     ... \
6     localhost <span class="hljs-built_in">test</span> <span class="hljs-comment">#format</span>
7 $ ./juicefs mount -d localhost ~/jfs  <span class="hljs-comment">#mount</span>
8
<button class="copy-code-btn"></button></code></pre>
<blockquote>
<p>If the Redis server is not running locally, replace the localhost with the following address: <code translate="no">redis://&lt;user:password&gt;@host:6379/1</code>.</p>
</blockquote>
<p>When the installation succeeds, JuiceFS returns the shared storage page <strong>/root/jfs</strong>.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/installation_success_9d05279ecd.png" alt="installation-success.png" class="doc-image" id="installation-success.png" />
    <span>installation-success.png</span>
  </span>
</p>
<h3 id="Step-3-Start-Milvus" class="common-anchor-header"><strong>Step 3: Start Milvus</strong></h3><p>All the nodes in the cluster should have Milvus installed, and each Milvus node should be configured with read or write permission. Only one Milvus node can be configured as write node, and the rest must be read nodes. First, set the parameters of sections <code translate="no">cluster</code> and <code translate="no">general</code> in the Milvus system configuration file <strong>server_config.yaml</strong>:</p>
<p><strong>Section</strong> <code translate="no">cluster</code></p>
<table>
<thead>
<tr><th style="text-align:left"><strong>Parameter</strong></th><th style="text-align:left"><strong>Description</strong></th><th style="text-align:left"><strong>Configuration</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:left"><code translate="no">enable</code></td><td style="text-align:left">Whether to enable cluster mode</td><td style="text-align:left"><code translate="no">true</code></td></tr>
<tr><td style="text-align:left"><code translate="no">role</code></td><td style="text-align:left">Milvus deployment role</td><td style="text-align:left"><code translate="no">rw</code>/<code translate="no">ro</code></td></tr>
</tbody>
</table>
<p><strong>Section</strong> <code translate="no">general</code></p>
<pre><code translate="no"><span class="hljs-comment"># meta_uri is the URI for metadata storage, using MySQL (for Milvus Cluster). Format: mysql://&lt;username:password&gt;@host:port/database</span>
general:
  timezone: UTC+8
  meta_uri: mysql://root:milvusroot@host:3306/milvus
<button class="copy-code-btn"></button></code></pre>
<p>During installation, the configured JuiceFS shared storage path is set as <strong>/root/jfs/milvus/db</strong>.</p>
<pre><code translate="no">1 <span class="hljs-built_in">sudo</span> docker run -d --name milvus_gpu_1.0.0 --gpus all \
2 -p 19530:19530 \
3 -p 19121:19121 \
4 -v /root/jfs/milvus/db:/var/lib/milvus/db \  <span class="hljs-comment">#/root/jfs/milvus/db is the shared storage path</span>
5 -v /home/<span class="hljs-variable">$USER</span>/milvus/conf:/var/lib/milvus/conf \
6 -v /home/<span class="hljs-variable">$USER</span>/milvus/logs:/var/lib/milvus/logs \
7 -v /home/<span class="hljs-variable">$USER</span>/milvus/wal:/var/lib/milvus/wal \
8 milvusdb/milvus:1.0.0-gpu-d030521-1ea92e
9
<button class="copy-code-btn"></button></code></pre>
<p>After the installation completes, start Milvus and confirm that it is launched properly.
Finally, start the Mishards service on <strong>any</strong> of the nodes in the cluster. The image below shows a successful launch of Mishards. For more information, refer to the GitHub <a href="https://github.com/milvus-io/bootcamp/tree/new-bootcamp/deployments/juicefs">tutorial</a>.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/mishards_launch_success_921695d3a8.png" alt="mishards-launch-success.png" class="doc-image" id="mishards-launch-success.png" />
    <span>mishards-launch-success.png</span>
  </span>
</p>
<h2 id="Performance-benchmarks" class="common-anchor-header"><strong>Performance benchmarks</strong><button data-href="#Performance-benchmarks" class="anchor-icon" translate="no">
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
    </button></h2><p>Shared storage solutions are usually implemented by network-attached storage (NAS) systems. Commonly used NAS systems types include Network File System (NFS) and Server Message Block (SMB). Public cloud platforms generally provide managed storage services compatible with these protocols, such as Amazon Elastic File System (EFS).</p>
<p>Unlike traditional NAS systems, JuiceFS is implemented based on Filesystem in Userspace (FUSE), where all data reading and writing takes place directly on the application side, further reducing access latency. There are also features unique to JuiceFS that cannot be found in other NAS systems, such as data compression and caching.</p>
<p>Benchmark testing reveals that JuiceFS offers major advantages over EFS. In the metadata benchmark (Figure 1), JuiceFS sees I/O operations per second (IOPS) up to ten times higher than EFS. Additionally, the I/O throughput benchmark (Figure 2) shows JuiceFS outperforms EFS in both single- and multi-job scenarios.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/performance_benchmark_1_b7fcbb4439.png" alt="performance-benchmark-1.png" class="doc-image" id="performance-benchmark-1.png" />
    <span>performance-benchmark-1.png</span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/performance_benchmark_2_e311098123.png" alt="performance-benchmark-2.png" class="doc-image" id="performance-benchmark-2.png" />
    <span>performance-benchmark-2.png</span>
  </span>
</p>
<p>Additionally, benchmark testing shows first query retrieval time, or time to load newly inserted data from disk to memory, for the JuiceFS-based Milvus cluster is just 0.032 seconds on average, indicating that data is loaded from disk to memory almost instantaneously. For this test, first query retrieval time is measured using one million rows of 128-dimensional vector data inserted in batches of 100k at intervals of 1 to 8 seconds.</p>
<p>JuiceFS is a stable and reliable shared file storage system, and the Milvus cluster built on JuiceFS offers both high performance and flexible storage capacity.</p>
<h2 id="Learn-more-about-Milvus" class="common-anchor-header"><strong>Learn more about Milvus</strong><button data-href="#Learn-more-about-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus is a powerful tool capable of powering a vast array of artificial intelligence and vector similarity search applications. To learn more about the project, check out the following resources:</p>
<ul>
<li>Read our <a href="https://zilliz.com/blog">blog</a>.</li>
<li>Interact with our open-source community on <a href="https://join.slack.com/t/milvusio/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ">Slack</a>.</li>
<li>Use or contribute to the world’s most popular vector database on <a href="https://github.com/milvus-io/milvus/">GitHub</a>.</li>
<li>Quickly test and deploy AI applications with our new <a href="https://github.com/milvus-io/bootcamp">bootcamp</a>.</li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/writer_bio_changjian_gao_68018f7716.png" alt="writer bio-changjian gao.png" class="doc-image" id="writer-bio-changjian-gao.png" />
    <span>writer bio-changjian gao.png</span>
  </span>


  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/writer_bio_jingjing_jia_a85d1c2e3b.png" alt="writer bio-jingjing jia.png" class="doc-image" id="writer-bio-jingjing-jia.png" />
    <span>writer bio-jingjing jia.png</span>
  </span>
</p>
