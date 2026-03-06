---
id: how-to-migrate-data-to-milvus-seamlessly.md
title: 'How to Migrate Your Data to Milvus Seamlessly: A Comprehensive Guide'
author: Wenhui Zhang
date: 2023-12-01T00:00:00.000Z
desc: >-
  A comprehensive guide on migrating your data from Elasticsearch, FAISS, and
  older Milvus 1.x to Milvus 2.x versions.
cover: assets.zilliz.com/How_to_Migrate_Your_Data_to_Milvus_with_Ease_485dcb8b22.png
tag: Engineering
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Vector Management, Data Migration, Milvus Migration
recommend: true
canonicalUrl: >-
  https://zilliz.com/blog/how-to-migrate-data-to-milvus-seamlessly-comprehensive-guide
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/How_to_Migrate_Your_Data_to_Milvus_with_Ease_485dcb8b22.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><a href="https://milvus.io/">Milvus</a> is a robust open-source vector database for <a href="https://zilliz.com/learn/vector-similarity-search">similarity search</a> that can store, process, and retrieve billions and even trillions of vector data with minimal latency. It is also highly scalable, reliable, cloud-native, and feature-rich. <a href="https://milvus.io/blog/unveiling-milvus-2-3-milestone-release-offering-support-for-gpu-arm64-cdc-and-other-features.md">The newest release of Milvus</a> introduces even more exciting features and improvements, including <a href="https://zilliz.com/blog/getting-started-with-gpu-powered-milvus-unlocking-10x-higher-performance">GPU support</a> for over 10x faster performance and MMap for greater storage capacity on a single machine.</p>
<p>As of September 2023, Milvus has earned almost 23,000 stars on GitHub and has tens of thousands of users from diverse industries with varying needs. It is becoming even more popular as Generative AI technology like <a href="https://zilliz.com/learn/ChatGPT-Vector-Database-Prompt-as-code">ChatGPT</a> becomes more prevalent. It is an essential component of various AI stacks, especially the <a href="https://zilliz.com/use-cases/llm-retrieval-augmented-generation">retrieval augmented generation</a> framework, which addresses the hallucination problem of large language models.</p>
<p>To meet the growing demand from new users who want to migrate to Milvus and existing users who wish to upgrade to the latest Milvus versions, we developed  <a href="https://github.com/zilliztech/milvus-migration">Milvus Migration</a>. In this blog, we’ll explore the features of Milvus Migration and guide you through quickly transitioning your data to Milvus from Milvus 1.x, <a href="https://zilliz.com/blog/set-up-with-facebook-ai-similarity-search-faiss">FAISS</a>, and <a href="https://zilliz.com/comparison/elastic-vs-milvus">Elasticsearch 7.0</a> and beyond.</p>
<h2 id="Milvus-Migration-a-powerful-data-migration-tool" class="common-anchor-header">Milvus Migration, a powerful data migration tool<button data-href="#Milvus-Migration-a-powerful-data-migration-tool" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://github.com/zilliztech/milvus-migration">Milvus Migration</a> is a data migration tool written in Go. It enables users to move their data seamlessly from older versions of Milvus (1.x), FAISS, and Elasticsearch 7.0 and beyond to Milvus 2.x versions.</p>
<p>The diagram below demonstrates how we built Milvus Migration and how it works.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/milvus_migration_architecture_144e22f499.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="How-Milvus-Migration-migrates-data" class="common-anchor-header">How Milvus Migration migrates data</h3><h4 id="From-Milvus-1x-and-FAISS-to-Milvus-2x" class="common-anchor-header">From Milvus 1.x and FAISS to Milvus 2.x</h4><p>The data migration from Milvus 1.x and FAISS involves parsing the content of the original data files, transforming them into the data storage format of Milvus 2.x, and writing the data using Milvus SDK’s <code translate="no">bulkInsert</code>. This entire process is stream-based, theoretically limited only by disk space, and stores data files on your local disk, S3, OSS, GCP, or Minio.</p>
<h4 id="From-Elasticsearch-to-Milvus-2x" class="common-anchor-header">From Elasticsearch to Milvus 2.x</h4><p>In the Elasticsearch data migration, data retrieval is different. Data is not obtained from files but sequentially fetched using Elasticsearch’s scroll API. The data is then parsed and transformed into Milvus 2.x storage format, followed by writing it using <code translate="no">bulkInsert</code>. Besides migrating <code translate="no">dense_vector</code> type vectors stored in Elasticsearch, Milvus Migration also supports migrating other field types, including long, integer, short, boolean, keyword, text, and double.</p>
<h3 id="Milvus-Migration-feature-set" class="common-anchor-header">Milvus Migration feature set</h3><p>Milvus Migration simplifies the migration process through its robust feature set:</p>
<ul>
<li><p><strong>Supported Data Sources:</strong></p>
<ul>
<li><p>Milvus 1.x to Milvus 2.x</p></li>
<li><p>Elasticsearch 7.0 and beyond to Milvus 2.x</p></li>
<li><p>FAISS to Milvus 2.x</p></li>
</ul></li>
</ul>
<ul>
<li><p><strong>Multiple Interaction Modes:</strong></p>
<ul>
<li><p>Command-line interface (CLI) using the Cobra framework</p></li>
<li><p>Restful API with a built-in Swagger UI</p></li>
<li><p>Integration as a Go module in other tools</p></li>
</ul></li>
</ul>
<ul>
<li><p><strong>Versatile File Format Support:</strong></p>
<ul>
<li><p>Local files</p></li>
<li><p>Amazon S3</p></li>
<li><p>Object Storage Service (OSS)</p></li>
<li><p>Google Cloud Platform (GCP)</p></li>
</ul></li>
</ul>
<ul>
<li><p><strong>Flexible Elasticsearch Integration:</strong></p>
<ul>
<li><p>Migration of <code translate="no">dense_vector</code> type vectors from Elasticsearch</p></li>
<li><p>Support for migrating other field types such as long, integer, short, boolean, keyword, text, and double</p></li>
</ul></li>
</ul>
<h3 id="Interface-definitions" class="common-anchor-header">Interface definitions</h3><p>Milvus Migration provides the following key interfaces:</p>
<ul>
<li><p><code translate="no">/start</code>: Initiates a migration job (equivalent to a combination of dump and load, currently only supports ES migration).</p></li>
<li><p><code translate="no">/dump</code>: Initiates a dump job (writes source data into the target storage medium).</p></li>
<li><p><code translate="no">/load</code>: Initiates a load job (writes data from the target storage medium into Milvus 2.x).</p></li>
<li><p><code translate="no">/get_job</code>: Allows users to view job execution results. (For more details, refer to <a href="https://github.com/zilliztech/milvus-migration/blob/main/server/server.go">the project’s server.go</a>)</p></li>
</ul>
<p>Next, let’s use some example data to explore how to use Milvus Migration in this section. You can find these examples <a href="https://github.com/zilliztech/milvus-migration#migration-examples-migrationyaml-details">here</a> on GitHub.</p>
<h2 id="Migration-from-Elasticsearch-to-Milvus-2x" class="common-anchor-header">Migration from Elasticsearch to Milvus 2.x<button data-href="#Migration-from-Elasticsearch-to-Milvus-2x" class="anchor-icon" translate="no">
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
    </button></h2><ol>
<li>Prepare Elasticsearch Data</li>
</ol>
<p>To <a href="https://zilliz.com/blog/elasticsearch-cloud-vs-zilliz">migrate Elasticsearch</a> data, you should already set up your own Elasticsearch server. You should store vector data in the <code translate="no">dense_vector</code> field and index them with other fields. The index mappings are as shown below.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/migrate_elasticsearch_data_milvus_index_mappings_59370f9596.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<ol start="2">
<li>Compile and Build</li>
</ol>
<p>First, download the Milvus Migration’s <a href="https://github.com/zilliztech/milvus-migration">source code from GitHub</a>. Then, run the following commands to compile it.</p>
<pre><code translate="no"><span class="hljs-keyword">go</span> get
<span class="hljs-keyword">go</span> build
<button class="copy-code-btn"></button></code></pre>
<p>This step will generate an executable file named <code translate="no">milvus-migration</code>.</p>
<ol start="3">
<li>Configure <code translate="no">migration.yaml</code></li>
</ol>
<p>Before starting the migration, you must prepare a configuration file named <code translate="no">migration.yaml</code> that includes information about the data source, target, and other relevant settings. Here’s an example configuration:</p>
<pre><code translate="no"><span class="hljs-comment"># Configuration for Elasticsearch to Milvus 2.x migration</span>


dumper:
  worker:
    workMode: Elasticsearch
    reader:
      bufferSize: 2500
meta:
  mode: config
  index: test_index
  fields:
    - name: <span class="hljs-built_in">id</span>
      pk: <span class="hljs-literal">true</span>
      <span class="hljs-built_in">type</span>: long
    - name: other_field
      maxLen: 60
      <span class="hljs-built_in">type</span>: keyword
    - name: data
      <span class="hljs-built_in">type</span>: dense_vector
      dims: 512
  milvus:
      collection: <span class="hljs-string">&quot;rename_index_test&quot;</span>
      closeDynamicField: <span class="hljs-literal">false</span>
      consistencyLevel: Eventually
      shardNum: 1


<span class="hljs-built_in">source</span>:
  es:
    urls:
      - http://localhost:9200
    username: xxx
    password: xxx


target:
  mode: remote
  remote:
    outputDir: outputPath/migration/test1
    cloud: aws
    region: us-west-2
    bucket: xxx
    useIAM: <span class="hljs-literal">true</span>
    checkBucket: <span class="hljs-literal">false</span>
  milvus2x:
    endpoint: {yourMilvusAddress}:{port}
    username: ******
    password: ******
<button class="copy-code-btn"></button></code></pre>
<p>For a more detailed explanation of the configuration file, refer to <a href="https://github.com/zilliztech/milvus-migration/blob/main/README_ES.md#elasticsearch-to-milvus-2x-migrationyaml-example">this page</a> on GitHub.</p>
<ol start="4">
<li>Execute the migration job</li>
</ol>
<p>Now that you have configured your <code translate="no">migration.yaml</code> file, you can start the migration task by running the following command:</p>
<pre><code translate="no">./milvus-migration start --config=/{YourConfigFilePath}/migration.yaml
<button class="copy-code-btn"></button></code></pre>
<p>Observe the log output. When you see logs similar to the following, it means the migration was successful.</p>
<pre><code translate="no">[task/load_base_task.go:94] [<span class="hljs-string">&quot;[LoadTasker] Dec Task Processing--------------&gt;&quot;</span>] [Count=0] [fileName=testfiles/output/zwh/migration/test_mul_field4/data_1_1.json] [taskId=442665677354739304][task/load_base_task.go:76] [<span class="hljs-string">&quot;[LoadTasker] Progress Task ---------------&gt;&quot;</span>] [fileName=testfiles/output/zwh/migration/test_mul_field4/data_1_1.json] [taskId=442665677354739304][dbclient/cus_field_milvus2x.go:86] [<span class="hljs-string">&quot;[Milvus2x] begin to ShowCollectionRows&quot;</span>][loader/cus_milvus2x_loader.go:66] [<span class="hljs-string">&quot;[Loader] Static: &quot;</span>] [collection=test_mul_field4_rename1] [beforeCount=50000] [afterCount=100000] [increase=50000][loader/cus_milvus2x_loader.go:66] [<span class="hljs-string">&quot;[Loader] Static Total&quot;</span>] [<span class="hljs-string">&quot;Total Collections&quot;</span>=1] [beforeTotalCount=50000] [afterTotalCount=100000] [totalIncrease=50000][migration/es_starter.go:25] [<span class="hljs-string">&quot;[Starter] migration ES to Milvus finish!!!&quot;</span>] [Cost=80.009174459][starter/starter.go:106] [<span class="hljs-string">&quot;[Starter] Migration Success!&quot;</span>] [Cost=80.00928425][cleaner/remote_cleaner.go:27] [<span class="hljs-string">&quot;[Remote Cleaner] Begin to clean files&quot;</span>] [bucket=a-bucket] [rootPath=testfiles/output/zwh/migration][cmd/start.go:32] [<span class="hljs-string">&quot;[Cleaner] clean file success!&quot;</span>]
<button class="copy-code-btn"></button></code></pre>
<p>In addition to the command-line approach, Milvus Migration also supports migration using Restful API.</p>
<p>To use the Restful API, start the API server using the following command:</p>
<pre><code translate="no">./milvus-migration server run -p 8080
<button class="copy-code-btn"></button></code></pre>
<p>Once the service runs, you can initiate the migration by calling the API.</p>
<pre><code translate="no">curl -XPOST http://localhost:8080/api/v1/start
<button class="copy-code-btn"></button></code></pre>
<p>When the migration is complete, you can use <a href="https://zilliz.com/attu">Attu</a>, an all-in-one vector database administration tool, to view the total number of successful rows migrated and perform other collection-related operations.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/attu_interface_vector_database_admin_4893a31f6d.png" alt="The Attu interface" class="doc-image" id="the-attu-interface" />
    <span>The Attu interface</span>
  </span>
</p>
<h2 id="Migration-from-Milvus-1x-to-Milvus-2x" class="common-anchor-header">Migration from Milvus 1.x to Milvus 2.x<button data-href="#Migration-from-Milvus-1x-to-Milvus-2x" class="anchor-icon" translate="no">
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
    </button></h2><ol>
<li>Prepare Milvus 1.x Data</li>
</ol>
<p>To help you quickly experience the migration process, we’ve put 10,000 Milvus 1.x <a href="https://github.com/zilliztech/milvus-migration/blob/main/README_1X.md">test data</a> records in the source code of Milvus Migration. However, in real cases, you must export your own <code translate="no">meta.json</code> file from your Milvus 1.x instance before starting the migration process.</p>
<ul>
<li>You can export the data with the following command.</li>
</ul>
<pre><code translate="no">./milvus-migration <span class="hljs-built_in">export</span> -m <span class="hljs-string">&quot;user:password@tcp(adderss)/milvus?charset=utf8mb4&amp;parseTime=True&amp;loc=Local&quot;</span> -o outputDir
<button class="copy-code-btn"></button></code></pre>
<p>Make sure to:</p>
<ul>
<li><p>Replace the placeholders with your actual MySQL credentials.</p></li>
<li><p>Stop the Milvus 1.x server or halt data writes before performing this export.</p></li>
<li><p>Copy the Milvus <code translate="no">tables</code> folder and the <code translate="no">meta.json</code> file to the same directory.</p></li>
</ul>
<p><strong>Note:</strong> If you use Milvus 2.x on <a href="https://zilliz.com/cloud">Zilliz Cloud</a> (the fully managed service of Milvus), you can start the migration using Cloud Console.</p>
<ol start="2">
<li>Compile and Build</li>
</ol>
<p>First, download the Milvus Migration’s <a href="https://github.com/zilliztech/milvus-migration">source code from GitHub</a>. Then, run the following commands to compile it.</p>
<pre><code translate="no"><span class="hljs-keyword">go</span> get
<span class="hljs-keyword">go</span> build
<button class="copy-code-btn"></button></code></pre>
<p>This step will generate an executable file named <code translate="no">milvus-migration</code>.</p>
<ol start="3">
<li>Configure <code translate="no">migration.yaml</code></li>
</ol>
<p>Prepare a <code translate="no">migration.yaml</code> configuration file, specifying details about the source, target, and other relevant settings. Here’s an example configuration:</p>
<pre><code translate="no"><span class="hljs-comment"># Configuration for Milvus 1.x to Milvus 2.x migration</span>


dumper:
  worker:
    <span class="hljs-built_in">limit</span>: 2
    workMode: milvus1x
    reader:
      bufferSize: 1024
    writer:
      bufferSize: 1024
loader:
  worker:
    <span class="hljs-built_in">limit</span>: 16
meta:
  mode: <span class="hljs-built_in">local</span>
  localFile: /outputDir/test/meta.json


<span class="hljs-built_in">source</span>:
  mode: <span class="hljs-built_in">local</span>
  <span class="hljs-built_in">local</span>:
    tablesDir: /db/tables/


target:
  mode: remote
  remote:
    outputDir: <span class="hljs-string">&quot;migration/test/xx&quot;</span>
    ak: xxxx
    sk: xxxx
    cloud: aws
    endpoint: 0.0.0.0:9000
    region: ap-southeast-1
    bucket: a-bucket
    useIAM: <span class="hljs-literal">false</span>
    useSSL: <span class="hljs-literal">false</span>
    checkBucket: <span class="hljs-literal">true</span>
  milvus2x:
    endpoint: localhost:19530
    username: xxxxx
    password: xxxxx
<button class="copy-code-btn"></button></code></pre>
<p>For a more detailed explanation of the configuration file, refer to <a href="https://github.com/zilliztech/milvus-migration/blob/main/README_1X.md">this page</a> on GitHub.</p>
<ol start="4">
<li>Execute Migration Job</li>
</ol>
<p>You must execute the <code translate="no">dump</code> and <code translate="no">load</code> commands separately to finish the migration. These commands convert the data and import it into Milvus 2.x.</p>
<p><strong>Note:</strong> We’ll simplify this step and enable users to finish migration using just one command shortly. Stay tuned.</p>
<p><strong>Dump Command:</strong></p>
<pre><code translate="no">./milvus-migration dump --config=/{YourConfigFilePath}/migration.yaml
<button class="copy-code-btn"></button></code></pre>
<p><strong>Load Command:</strong></p>
<pre><code translate="no">./milvus-migration load --config=/{YourConfigFilePath}/migration.yaml
<button class="copy-code-btn"></button></code></pre>
<p>After the migration, the generated collection in Milvus 2.x will contain two fields: <code translate="no">id</code> and <code translate="no">data</code>. You can view more details using <a href="https://zilliz.com/attu">Attu</a>, an all-in-one vector database administration tool.</p>
<h2 id="Migration-from-FAISS-to-Milvus-2x" class="common-anchor-header">Migration from FAISS to Milvus 2.x<button data-href="#Migration-from-FAISS-to-Milvus-2x" class="anchor-icon" translate="no">
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
    </button></h2><ol>
<li>Prepare FAISS Data</li>
</ol>
<p>To migrate Elasticsearch data, you should have your own FAISS data ready. To help you quickly experience the migration process, we’ve put some <a href="https://github.com/zilliztech/milvus-migration/blob/main/README_FAISS.md">FAISS test data</a> in the source code of Milvus Migration.</p>
<ol start="2">
<li>Compile and Build</li>
</ol>
<p>First, download the Milvus Migration’s <a href="https://github.com/zilliztech/milvus-migration">source code from GitHub</a>. Then, run the following commands to compile it.</p>
<pre><code translate="no"><span class="hljs-keyword">go</span> get
<span class="hljs-keyword">go</span> build
<button class="copy-code-btn"></button></code></pre>
<p>This step will generate an executable file named <code translate="no">milvus-migration</code>.</p>
<ol start="3">
<li>Configure <code translate="no">migration.yaml</code></li>
</ol>
<p>Prepare a <code translate="no">migration.yaml</code> configuration file for FAISS migration, specifying details about the source, target, and other relevant settings. Here’s an example configuration:</p>
<pre><code translate="no"><span class="hljs-comment"># Configuration for FAISS to Milvus 2.x migration</span>


dumper:
  worker:
    <span class="hljs-built_in">limit</span>: 2
    workMode: FAISS
    reader:
      bufferSize: 1024
    writer:
      bufferSize: 1024
loader:
  worker:
    <span class="hljs-built_in">limit</span>: 2
<span class="hljs-built_in">source</span>:
  mode: <span class="hljs-built_in">local</span>
  <span class="hljs-built_in">local</span>:
    FAISSFile: ./testfiles/FAISS/FAISS_ivf_flat.index


target:
  create:
    collection:
      name: test1w
      shardsNums: 2
      dim: 256
      metricType: L2
  mode: remote
  remote:
    outputDir: testfiles/output/
    cloud: aws
    endpoint: 0.0.0.0:9000
    region: ap-southeast-1
    bucket: a-bucket
    ak: minioadmin
    sk: minioadmin
    useIAM: <span class="hljs-literal">false</span>
    useSSL: <span class="hljs-literal">false</span>
    checkBucket: <span class="hljs-literal">true</span>
  milvus2x:
    endpoint: localhost:19530
    username: xxxxx
    password: xxxxx
<button class="copy-code-btn"></button></code></pre>
<p>For a more detailed explanation of the configuration file, refer to <a href="https://github.com/zilliztech/milvus-migration/blob/main/README_FAISS.md">this page</a> on GitHub.</p>
<ol start="4">
<li>Execute Migration Job</li>
</ol>
<p>Like Milvus 1.x to Milvus 2.x migration, FAISS migration requires executing both the <code translate="no">dump</code> and <code translate="no">load</code> commands. These commands convert the data and import it into Milvus 2.x.</p>
<p><strong>Note:</strong> We’ll simplify this step and enable users to finish migration using just one command shortly. Stay tuned.</p>
<p><strong>Dump Command:</strong></p>
<pre><code translate="no">./milvus-migration dump --config=/{YourConfigFilePath}/migration.yaml
<button class="copy-code-btn"></button></code></pre>
<p><strong>Load Command:</strong></p>
<pre><code translate="no">./milvus-migration load --config=/{YourConfigFilePath}/migration.yaml
<button class="copy-code-btn"></button></code></pre>
<p>You can view more details using <a href="https://zilliz.com/attu">Attu</a>, an all-in-one vector database administration tool.</p>
<h2 id="Stay-tuned-for-future-migration-plans" class="common-anchor-header">Stay tuned for future migration plans<button data-href="#Stay-tuned-for-future-migration-plans" class="anchor-icon" translate="no">
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
    </button></h2><p>In the future, we’ll support migration from more data sources and add more migration features, including:</p>
<ul>
<li><p>Support migration from Redis to Milvus.</p></li>
<li><p>Support migration from MongoDB to Milvus.</p></li>
<li><p>Support resumable migration.</p></li>
<li><p>Simplify migration commands by merging the dump and load processes into one.</p></li>
<li><p>Support migration from other mainstream data sources to Milvus.</p></li>
</ul>
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
    </button></h2><p>Milvus 2.3, the latest release of Milvus, brings exciting new features and performance improvements that cater to the growing needs of data management. Migrating your data to Milvus 2.x can unlock these benefits, and the Milvus Migration project makes the migration process streamlined and easy. Give it a try, and you won’t be disappointed.</p>
<p><em><strong>Note:</strong> The information in this blog is based on the state of the Milvus and <a href="https://github.com/zilliztech/milvus-migration">Milvus Migration</a> projects as of September 2023. Check the official <a href="https://milvus.io/docs">Milvus documentation</a> for the most up-to-date information and instructions.</em></p>
