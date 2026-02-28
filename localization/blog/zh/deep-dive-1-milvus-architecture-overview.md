---
id: deep-dive-1-milvus-architecture-overview.md
title: Building a Vector Database for Scalable Similarity Search
author: Xiaofan Luan
date: 2022-03-14T00:00:00.000Z
desc: >-
  The first one in a blog series to take a closer look at the thought process
  and design principles behind the building of the most popular open-source
  vector database.
cover: assets.zilliz.com/20220705_102717_dd4124dee3.png
tag: Engineering
tags: 'Data science, Database, Technology, Artificial Intelligence, Vector Management'
canonicalUrl: 'https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md'
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/20220705_102717_dd4124dee3.png" alt="Cover image" class="doc-image" id="cover-image" />
    <span>Cover image</span>
  </span>
</p>
<blockquote>
<p>This article is written by Xiaofan Luan and transcreated by Angela Ni and Claire Yu.</p>
</blockquote>
<p>According to <a href="https://mitsloan.mit.edu/ideas-made-to-matter/tapping-power-unstructured-data">statistics</a>, about 80%-90% of the world’s data is unstructured. Fueled by the rapid growth of the Internet, an explosion of unstructured data is expected in the coming years. Consequently, companies are in urgent need of a powerful database that can help them better handle and understand such kind of data. However, developing a database is always easier said than done. This article aims to share the thinking process and design principles of building Milvus, an open-source, cloud-native vector database for scalable similarity search. This article also explains the Milvus architecture in detail.</p>
<p>Jump to:</p>
<ul>
<li><a href="#Unstructured-data-requires-a-complete-basic-software-stack">Unstructured data requires a complete basic software stack</a>
<ul>
<li><a href="#Vectors-and-scalars">Vectors and scalars</a></li>
<li><a href="#From-vector-search-engine-to-vector-database">From vector search engine to vector database</a></li>
<li><a href="#A-cloud-native-first-approach">A cloud-native first approach</a></li>
</ul></li>
<li><a href="#The-design-principles-of-Milvus-20">The design principles of Milvus 2.0</a>
<ul>
<li><a href="#Log-as-data">Log as data</a></li>
<li><a href="#Duality-of-table-and-log">Duality of table and log</a></li>
<li><a href="#Log-persistency">Log persistency</a></li>
</ul></li>
<li><a href="#Building-a-vector-database-for-scalable-similarity-search">Building a vector database for scalable similarity search</a>
<ul>
<li><a href="#Standalone-and-cluster">Standalone and cluster</a></li>
<li><a href="#A-bare-bones-skeleton-of-the-Milvus-architecture">A bare-bones skeleton of the Milvus architecture</a></li>
<li><a href="#Data-Model">Data model</a></li>
</ul></li>
</ul>
<h2 id="Unstructured-data-requires-a-complete-basic-software-stack" class="common-anchor-header">Unstructured data requires a complete basic software stack<button data-href="#Unstructured-data-requires-a-complete-basic-software-stack" class="anchor-icon" translate="no">
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
    </button></h2><p>As the Internet grew and evolved, unstructured data became more and more common, including emails, papers, IoT sensor data, Facebook photos, protein structures, and much more. In order for computers to understand and process unstructured data, these are converted into vectors using <a href="https://zilliz.com/learn/embedding-generation">embedding techniques</a>.</p>
<p>Milvus stores and indexes these vectors, and analyzes the correlation between two vectors by calculating their similarity distance. If the two embedding vectors are very similar, it means that the original data sources are similar as well.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Frame_1_6_5e0ab80f2c.png" alt="The workflow of processing unstructured data." class="doc-image" id="the-workflow-of-processing-unstructured-data." />
    <span>The workflow of processing unstructured data.</span>
  </span>
</p>
<h3 id="Vectors-and-scalars" class="common-anchor-header">Vectors and scalars</h3><p>A scalar is a quantity that is described only in one measurement - magnitude. A scalar can be represented as a number. For instance, a car is traveling at the speed of 80 km/h. Here, the speed (80km/h) is a scalar. Meanwhile, a vector is a quantity that is described in at least two measurements - magnitude and direction. If a car is traveling towards west at the speed of 80 km/h, here the velocity (80 km/h west) is a vector. The image below is an example of common scalars and vectors.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Frame_1_7_90a142ab5b.png" alt="Scalars vs. Vectors" class="doc-image" id="scalars-vs.-vectors" />
    <span>Scalars vs. Vectors</span>
  </span>
</p>
<p>Since most of the important data have more than one attribute, we can understand these data better if we convert them into vectors. One common way for us to manipulate vector data is to calculate the  distance between vectors using <a href="https://milvus.io/docs/v2.0.x/metric.md">metrics</a> such as Euclidean distance, inner product, Tanimoto distance, Hamming distance, etc. The closer the distance, the more similar the vectors are. To query a massive vector dataset efficiently, we can organize vector data by building indexes on them. After the dataset is indexed, queries can be routed to clusters, or subsets of data, that are most likely to contain vectors similar to an input query.</p>
<p>To learn more about the indexes, refer to <a href="https://milvus.io/docs/v2.0.x/index.md">Vector Index</a>.</p>
<h3 id="From-vector-search-engine-to-vector-database" class="common-anchor-header">From vector search engine to vector database</h3><p>From the very beginning, Milvus 2.0 is designed to serve not only as a search engine, but more importantly, as a powerful vector database.</p>
<p>One way to help you understand the difference here is by drawing an analogy between <a href="https://dev.mysql.com/doc/refman/5.7/en/innodb-introduction.html">InnoDB</a> and <a href="https://www.mysql.com/">MySQL</a>, or <a href="https://lucene.apache.org/">Lucene</a> and <a href="https://www.elastic.co/">Elasticsearch</a>.</p>
<p>Just like MySQL and Elasticsearch, Milvus is also built on top of open-source libraries such as <a href="https://github.com/facebookresearch/faiss">Faiss</a>, <a href="https://github.com/nmslib/hnswlib">HNSW</a>, <a href="https://github.com/spotify/annoy">Annoy</a>, which focus on providing search functionalities and ensuring search performance. However, it would be unfair to degrade Milvus to merely a layer atop Faiss as it stores, retrieves, analyzes vectors, and, just as with any other database, also provides a standard interface for CRUD operations. In addition, Milvus also boasts features including:</p>
<ul>
<li>Sharding and partitioning</li>
<li>Replication</li>
<li>Disaster recovery</li>
<li>Load balance</li>
<li>Query parser or optimizer</li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/database_d912320ea7.png" alt="Vector database" class="doc-image" id="vector-database" />
    <span>Vector database</span>
  </span>
</p>
<p>For a more comprehensive understanding of what a vector database is, read the blog <a href="https://zilliz.com/learn/what-is-vector-database">here</a>.</p>
<h3 id="A-cloud-native-first-approach" class="common-anchor-header">A cloud-native first approach</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/image_2_be82d762db.png" alt="Could-native approach" class="doc-image" id="could-native-approach" />
    <span>Could-native approach</span>
  </span>
</p>
<h4 id="From-shared-nothing-to-shared-storage-then-to-shared-something" class="common-anchor-header">From shared nothing, to shared storage, then to shared something</h4><p>Traditional databases used to adopt a “shared nothing” architecture in which nodes in the distributed systems are independent but connected by a network. No memory or storage are shared among the nodes. However, <a href="https://docs.snowflake.com/en/user-guide/intro-key-concepts.html">Snowflake</a> revolutionized the industry by introducing a “shared storage” architecture in which compute (query processing) is separated from storage (database storage). With a shared storage architecture, databases can achieve greater availability, scalability, and a reduction of data duplication. Inspired by Snowflake, many companies started to leverage cloud-based infrastructure for data persistence while using local storage for caching. This type of database architecture is called “shared something” and has become the mainstream architecture in most applications today.</p>
<p>Apart from the “shared something” architecture, Milvus supports flexible scaling of each component by using Kubernetes to manage its execution engine and separating read, write and other services with microservices.</p>
<h4 id="Database-as-a-service-DBaaS" class="common-anchor-header">Database as a service (DBaaS)</h4><p>Database as a service is a hot trend as many users not only care about regular database functionalities but also yearn for more varied services. This means that apart from the traditional CRUD operations, our database has to enrich the type of services it can provide, such as database management, data transport, charging, visualization, etc.</p>
<h4 id="Synergy-with-the-broader-open-source-ecosystem" class="common-anchor-header">Synergy with the broader open-source ecosystem</h4><p>Another trend in database development is leveraging the synergy between the database and other cloud-native infrastructure. In the case of Milvus, it relies on some open-source systems. For instance, Milvus uses <a href="https://etcd.io/">etcd</a> for storing metadata. It also adopts message queue, a type of asynchronous service-to-service communication used in microservices architecture, which can help export incremental data.</p>
<p>In the future, we hope to build Milvus on top of AI infrastructures such as <a href="https://spark.apache.org/">Spark</a> or <a href="https://www.tensorflow.org/">Tensorflow</a>, and integrate Milvus with streaming engines so that we can better support unified stream and batch processing to meet the various needs of Milvus users.</p>
<h2 id="The-design-principles-of-Milvus-20" class="common-anchor-header">The design principles of Milvus 2.0<button data-href="#The-design-principles-of-Milvus-20" class="anchor-icon" translate="no">
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
    </button></h2><p>As our next-generation cloud-native vector database, Milvus 2.0 is built around the following three principles.</p>
<h3 id="Log-as-data" class="common-anchor-header">Log as data</h3><p>A log in a database serially records all the changes made to data. As shown in the figure below, from left to right are “old data” and &quot;new data&quot;. And the logs are in time order. Milvus has a global timer mechanism assigning one globally unique and auto-incremental timestamp.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Frame_1_8_6e40211f44.png" alt="Logs" class="doc-image" id="logs" />
    <span>Logs</span>
  </span>
</p>
<p>In Milvus 2.0, the log broker serves as the system’s backbone: all data insert and update operations must go through the log broker, and worker nodes execute CRUD operations by subscribing to and consuming logs.</p>
<h3 id="Duality-of-table-and-log" class="common-anchor-header">Duality of table and log</h3><p>Both the table and the log are data, and they are but just two different forms. Tables are bounded data while logs are unbounded. Logs can be converted into tables. In the case of Milvus, it aggregates logs using a processing window from TimeTick. Based on log sequence, multiple logs are aggregated into one small file called log snapshot. Then these log snapshots are combined to form a segment, which can be used individually for load balance.</p>
<h3 id="Log-persistency" class="common-anchor-header">Log persistency</h3><p>Log persistency is one of the tricky issues faced by many databases. The storage of logs in a distributed system usually depends on replication algorithms.</p>
<p>Unlike databases such as <a href="https://aws.amazon.com/rds/aurora/">Aurora</a>, <a href="https://hbase.apache.org/">HBase</a>, <a href="https://www.cockroachlabs.com/">Cockroach DB</a>, and <a href="https://en.pingcap.com/">TiDB</a>, Milvus takes a ground-breaking approach and introduces a publish-subscribe (pub/sub) system for log storage and persistency. A pub/sub system is analogous to the message queue in <a href="https://kafka.apache.org/">Kafka</a> or <a href="https://pulsar.apache.org/">Pulsar</a>. All nodes within the system can consume the logs. In Milvus, this kind of system is called a log broker. Thanks to the log broker, logs are decoupled from the server, ensuring that Milvus is itself stateless and better positioned to quickly recover from system failure.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/log_broker_cafe889835.png" alt="Log broker" class="doc-image" id="log-broker" />
    <span>Log broker</span>
  </span>
</p>
<h2 id="Building-a-vector-database-for-scalable-similarity-search" class="common-anchor-header">Building a vector database for scalable similarity search<button data-href="#Building-a-vector-database-for-scalable-similarity-search" class="anchor-icon" translate="no">
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
    </button></h2><p>Built on top of popular vector search libraries including Faiss, ANNOY, HNSW, and more, Milvus was designed for similarity search on dense vector datasets containing millions, billions, or even trillions of vectors.</p>
<h3 id="Standalone-and-cluster" class="common-anchor-header">Standalone and cluster</h3><p>Milvus offers two ways of deployment - standalone or cluster. In Milvus standalone, since all nodes are deployed together, we can see Milvus as one single process. Currently, Milvus standalone relies on MinIO and etcd for data persistence and metadata storage. In future releases, we hope to eliminate these two third-party dependencies to ensure the simplicity of the Milvus system. Milvus cluster includes eight microservice components and three third-party dependencies: MinIO, etcd, and Pulsar. Pulsar serves as the log broker and provides log pub/sub services.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/standalone_and_cluster_7558f56e8c.png" alt="Standalone and cluster" class="doc-image" id="standalone-and-cluster" />
    <span>Standalone and cluster</span>
  </span>
</p>
<h3 id="A-bare-bones-skeleton-of-the-Milvus-architecture" class="common-anchor-header">A bare-bones skeleton of the Milvus architecture</h3><p>Milvus separates data flow from control flow, and is divided into four layers that are independent in terms of scalability and disaster recovery.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Milvus_architecture_b7743a4a7f.png" alt="Milvus architecture" class="doc-image" id="milvus-architecture" />
    <span>Milvus architecture</span>
  </span>
</p>
<h4 id="Access-layer" class="common-anchor-header">Access layer</h4><p>The access layer acts as the system’s face, exposing the endpoint of the client connection to the outside world. It is responsible for processing client connections, carrying out static verification, basic dynamic checks for user requests, forwarding requests, and gathering and returning results to the client. The proxy itself is stateless and provides unified access addresses and services to the outside world through load balancing components (Nginx, Kubernetess Ingress, NodePort, and LVS). Milvus uses a massively parallel processing (MPP) architecture, where proxies return results gathered from worker nodes after global aggregation and post-processing.</p>
<h4 id="Coordinator-service" class="common-anchor-header">Coordinator service</h4><p>The coordinator service is the system’s brain, responsible for cluster topology node management, load balancing, timestamp generation, data declaration, and data management. For a detailed explanation of the function of each coordinator service, read the <a href="https://milvus.io/docs/v2.0.x/four_layers.md#Coordinator-service">Milvus technical documentation</a>.</p>
<h4 id="Worker-nodes" class="common-anchor-header">Worker nodes</h4><p>The worker, or execution, node acts as the limbs of the system, executing instructions issued by the coordinator service and the data manipulation language (DML) commands initiated by the proxy. A worker node in Milvus is similar to a data node in <a href="https://hadoop.apache.org/">Hadoop</a>, or a region server in HBase. Each type of worker node corresponds to a coord service. For a detailed explanation of the function of each worker node, read the <a href="https://milvus.io/docs/v2.0.x/four_layers.md#Worker-nodes">Milvus technical documentation</a>.</p>
<h4 id="Storage" class="common-anchor-header">Storage</h4><p>Storage is the cornerstone of Milvus, responsible for data persistence. The storage layer is divided into three parts:</p>
<ul>
<li><strong>Meta store:</strong> Responsible for storing snapshots of meta data such as collection schema, node status, message consumption checkpoints, etc. Milvus relies on etcd for these functions and Etcd also assumes the responsibility of service registration and health checks.</li>
<li><strong>Log broker:</strong> A pub/sub system that supports playback and is responsible for streaming data persistence, reliable asynchronous query execution, event notifications, and returning query results. When nodes are performing downtime recovery, the log broker ensures the integrity of incremental data through log broker playback. Milvus cluster uses Pulsar as its log broker, while the standalone mode uses RocksDB. Streaming storage services such as Kafka and Pravega can also be used as log brokers.</li>
<li><strong>Object storage:</strong> Stores snapshot files of logs, scalar/vector index files, and intermediate query processing results. Milvus supports <a href="https://aws.amazon.com/s3/">AWS S3</a> and <a href="https://azure.microsoft.com/en-us/services/storage/blobs/">Azure Blob</a>, as well as <a href="https://min.io/">MinIO</a>, a lightweight, open-source object storage service. Due to the high access latency and billing per query of object storage services, Milvus will soon support memory/SSD-based cache pools and hot/cold data separation to improve performance and reduce costs.</li>
</ul>
<h3 id="Data-Model" class="common-anchor-header">Data Model</h3><p>The data model organizes the data in a database. In Milvus, all data are organized by collection, shard, partition, segment, and entity.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Data_model_1_5d6bb43673.png" alt="Data model 1" class="doc-image" id="data-model-1" />
    <span>Data model 1</span>
  </span>
</p>
<h4 id="Collection" class="common-anchor-header">Collection</h4><p>A collection in Milvus can be likened to a table in a relational storage system. Collection is the biggest data unit in Milvus.</p>
<h4 id="Shard" class="common-anchor-header">Shard</h4><p>To take full advantage of the parallel computing power of clusters when writing data, collections in Milvus must spread data writing operations to different nodes. By default, a single collection contains two shards. Depending on your dataset volume, you can have more shards in a collection. Milvus uses a master key hashing method for sharding.</p>
<h4 id="Partition" class="common-anchor-header">Partition</h4><p>There are also multiple partitions in a shard. A partition in Milvus refers to a set of data marked with the same label in a collection. Common partitioning methods including partitioning by date, gender, user age, and more. Creating partitions can benefit the query process as tremendous data can be filtered by partition tag.</p>
<p>In comparison, sharding is more of scaling capabilities when writing data, while partitioning is more of enhancing system performance when reading data.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Data_model_2_044a443751.png" alt="Data model 2" class="doc-image" id="data-model-2" />
    <span>Data model 2</span>
  </span>
</p>
<h4 id="Segments" class="common-anchor-header">Segments</h4><p>Within each partition, there are multiple small segments. A segment is the smallest unit for system scheduling in Milvus. There are two types of segments, growing and sealed. Growing segments are subscribed by query nodes. The Milvus user keeps writing data into growing segments. When the size of a growing segment reaches an upper limit (512 MB by default), the system will not allow writing extra data into this growing segment, hence sealing this segment. Indexes are built on sealed segments.</p>
<p>To access data in real time, the system reads data in both growing segments and sealed segments.</p>
<h4 id="Entity" class="common-anchor-header">Entity</h4><p>Each segment contains massive amount of entities. An entity in Milvus is equivalent to a row in a traditional database. Each entity has a unique primary key field, which can also be automatically generated. Entities must also contain timestamp (ts), and vector field - the core of Milvus.</p>
<h2 id="About-the-Deep-Dive-Series" class="common-anchor-header">About the Deep Dive Series<button data-href="#About-the-Deep-Dive-Series" class="anchor-icon" translate="no">
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
    </button></h2><p>With the <a href="https://milvus.io/blog/2022-1-25-annoucing-general-availability-of-milvus-2-0.md">official announcement of general availability</a> of Milvus 2.0, we orchestrated this Milvus Deep Dive blog series to provide an in-depth interpretation of the Milvus architecture and source code. Topics covered in this blog series include:</p>
<ul>
<li><a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md">Milvus architecture overview</a></li>
<li><a href="https://milvus.io/blog/deep-dive-2-milvus-sdk-and-api.md">APIs and Python SDKs</a></li>
<li><a href="https://milvus.io/blog/deep-dive-3-data-processing.md">Data processing</a></li>
<li><a href="https://milvus.io/blog/deep-dive-4-data-insertion-and-data-persistence.md">Data management</a></li>
<li><a href="https://milvus.io/blog/deep-dive-5-real-time-query.md">Real-time query</a></li>
<li><a href="https://milvus.io/blog/deep-dive-7-query-expression.md">Scalar execution engine</a></li>
<li><a href="https://milvus.io/blog/deep-dive-6-oss-qa.md">QA system</a></li>
<li><a href="https://milvus.io/blog/deep-dive-8-knowhere.md">Vector execution engine</a></li>
</ul>
