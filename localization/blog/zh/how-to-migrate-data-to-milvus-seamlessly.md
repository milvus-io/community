---
id: how-to-migrate-data-to-milvus-seamlessly.md
title: 如何将数据无缝迁移到 Milvus：综合指南
author: Wenhui Zhang
date: 2023-12-01T00:00:00.000Z
desc: 将数据从 Elasticsearch、FAISS 和旧版 Milvus 1.x 迁移到 Milvus 2.x 版本的全面指南。
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
<p><a href="https://milvus.io/">Milvus</a>是一个强大的开源向量数据库，用于<a href="https://zilliz.com/learn/vector-similarity-search">相似性搜索</a>，可存储、处理和检索数十亿甚至数万亿向量数据，且延迟极低。它还具有高度可扩展性、可靠性、云原生性和丰富的功能。<a href="https://milvus.io/blog/unveiling-milvus-2-3-milestone-release-offering-support-for-gpu-arm64-cdc-and-other-features.md">最新发布的 Milvus</a>引入了更多令人兴奋的功能和改进，包括<a href="https://zilliz.com/blog/getting-started-with-gpu-powered-milvus-unlocking-10x-higher-performance">支持 GPU</a>以提高 10 倍以上的性能，以及在单台机器上实现更大存储容量的 MMap。</p>
<p>截至 2023 年 9 月，Milvus 在 GitHub 上获得了近 23000 个星，拥有数万名来自不同行业、需求各异的用户。随着<a href="https://zilliz.com/learn/ChatGPT-Vector-Database-Prompt-as-code">ChatGPT</a>等生成式人工智能技术的普及，它正变得越来越受欢迎。它是各种人工智能堆栈的重要组成部分，尤其是<a href="https://zilliz.com/use-cases/llm-retrieval-augmented-generation">检索增强生成</a>框架，可以解决大型语言模型的幻觉问题。</p>
<p>为了满足希望迁移到 Milvus 的新用户和希望升级到最新 Milvus 版本的老用户日益增长的需求，我们开发了<a href="https://github.com/zilliztech/milvus-migration">Milvus 迁移</a>功能。在这篇博客中，我们将探讨 Milvus 迁移的功能，并指导你将数据从 Milvus 1.x、<a href="https://zilliz.com/blog/set-up-with-facebook-ai-similarity-search-faiss">FAISS</a> 和<a href="https://zilliz.com/comparison/elastic-vs-milvus">Elasticsearch 7.0</a>及更高版本快速迁移到 Milvus。</p>
<h2 id="Milvus-Migration-a-powerful-data-migration-tool" class="common-anchor-header">Milvus Migration，一个功能强大的数据迁移工具<button data-href="#Milvus-Migration-a-powerful-data-migration-tool" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://github.com/zilliztech/milvus-migration">Milvus Migration</a>是用 Go 语言编写的数据迁移工具。它能让用户将数据从旧版本的 Milvus（1.x）、FAISS 和 Elasticsearch 7.0 及更高版本无缝迁移到 Milvus 2.x 版本。</p>
<p>下图展示了我们如何构建 Milvus 迁移及其工作原理。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/milvus_migration_architecture_144e22f499.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="How-Milvus-Migration-migrates-data" class="common-anchor-header">Milvus 迁移如何迁移数据</h3><h4 id="From-Milvus-1x-and-FAISS-to-Milvus-2x" class="common-anchor-header">从 Milvus 1.x 和 FAISS 迁移到 Milvus 2.x</h4><p>从 Milvus 1.x 和 FAISS 迁移数据涉及解析原始数据文件的内容，将其转换为 Milvus 2.x 的数据存储格式，并使用 Milvus SDK 的<code translate="no">bulkInsert</code> 写入数据。整个过程基于数据流，理论上仅受磁盘空间限制，数据文件存储在本地磁盘、S3、OSS、GCP 或 Minio 上。</p>
<h4 id="From-Elasticsearch-to-Milvus-2x" class="common-anchor-header">从 Elasticsearch 到 Milvus 2.x</h4><p>在 Elasticsearch 数据迁移中，数据检索有所不同。数据不是从文件中获取，而是使用 Elasticsearch 的滚动 API 按顺序获取。然后将数据解析并转换为 Milvus 2.x 存储格式，接着使用<code translate="no">bulkInsert</code> 写入数据。除了迁移存储在Elasticsearch中的<code translate="no">dense_vector</code> 类型向量外，Milvus迁移还支持迁移其他字段类型，包括长、整数、短、布尔、关键字、文本和双。</p>
<h3 id="Milvus-Migration-feature-set" class="common-anchor-header">Milvus 迁移功能集</h3><p>Milvus Migration通过其强大的功能集简化了迁移过程：</p>
<ul>
<li><p><strong>支持的数据源：</strong></p>
<ul>
<li><p>Milvus 1.x 到 Milvus 2.x</p></li>
<li><p>Elasticsearch 7.0 及以后版本到 Milvus 2.x</p></li>
<li><p>FAISS 到 Milvus 2.x</p></li>
</ul></li>
</ul>
<ul>
<li><p><strong>多种交互模式：</strong></p>
<ul>
<li><p>使用 Cobra 框架的命令行界面 (CLI)</p></li>
<li><p>带有内置 Swagger UI 的有源 API</p></li>
<li><p>作为 Go 模块集成到其他工具中</p></li>
</ul></li>
</ul>
<ul>
<li><p><strong>支持多种文件格式</strong></p>
<ul>
<li><p>本地文件</p></li>
<li><p>亚马逊 S3</p></li>
<li><p>对象存储服务（OSS）</p></li>
<li><p>谷歌云平台（GCP）</p></li>
</ul></li>
</ul>
<ul>
<li><p><strong>灵活的 Elasticsearch 集成：</strong></p>
<ul>
<li><p>从 Elasticsearch 迁移<code translate="no">dense_vector</code> 类型向量</p></li>
<li><p>支持迁移其他字段类型，如 long、integer、short、boolean、keyword、text 和 double</p></li>
</ul></li>
</ul>
<h3 id="Interface-definitions" class="common-anchor-header">接口定义</h3><p>Milvus 迁移提供以下关键接口：</p>
<ul>
<li><p><code translate="no">/start</code>:启动迁移任务（相当于转储和加载的组合，目前仅支持 ES 迁移）。</p></li>
<li><p><code translate="no">/dump</code>:启动转储任务（将源数据写入目标存储介质）。</p></li>
<li><p><code translate="no">/load</code>:启动加载任务（将数据从目标存储介质写入 Milvus 2.x）。</p></li>
<li><p><code translate="no">/get_job</code>:允许用户查看任务执行结果。(更多详情，请参阅<a href="https://github.com/zilliztech/milvus-migration/blob/main/server/server.go">项目的 server.go</a>）<a href="https://github.com/zilliztech/milvus-migration/blob/main/server/server.go">。</a></p></li>
</ul>
<p>接下来，让我们用一些示例数据来探讨如何在本节中使用 Milvus 迁移。你可以<a href="https://github.com/zilliztech/milvus-migration#migration-examples-migrationyaml-details">在</a>GitHub 上找到这些示例。</p>
<h2 id="Migration-from-Elasticsearch-to-Milvus-2x" class="common-anchor-header">从 Elasticsearch 迁移到 Milvus 2.x<button data-href="#Migration-from-Elasticsearch-to-Milvus-2x" class="anchor-icon" translate="no">
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
<li>准备 Elasticsearch 数据</li>
</ol>
<p>要<a href="https://zilliz.com/blog/elasticsearch-cloud-vs-zilliz">迁移 Elasticsearch</a>数据，你应该已经设置好自己的 Elasticsearch 服务器。你应该将向量数据存储在<code translate="no">dense_vector</code> 字段中，并用其他字段为它们建立索引。索引映射如下所示。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/migrate_elasticsearch_data_milvus_index_mappings_59370f9596.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<ol start="2">
<li>编译和构建</li>
</ol>
<p>首先，<a href="https://github.com/zilliztech/milvus-migration">从 GitHub</a> 下载 Milvus 迁移的<a href="https://github.com/zilliztech/milvus-migration">源代码</a>。然后，运行以下命令进行编译。</p>
<pre><code translate="no"><span class="hljs-keyword">go</span> get
<span class="hljs-keyword">go</span> build
<button class="copy-code-btn"></button></code></pre>
<p>这一步将生成一个名为<code translate="no">milvus-migration</code> 的可执行文件。</p>
<ol start="3">
<li>配置<code translate="no">migration.yaml</code></li>
</ol>
<p>在开始迁移之前，你必须准备一个名为<code translate="no">migration.yaml</code> 的配置文件，其中包括数据源、目标和其他相关设置的信息。下面是一个配置示例：</p>
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
<p>有关配置文件的详细说明，请参阅 GitHub 上的<a href="https://github.com/zilliztech/milvus-migration/blob/main/README_ES.md#elasticsearch-to-milvus-2x-migrationyaml-example">此页面</a>。</p>
<ol start="4">
<li>执行迁移任务</li>
</ol>
<p>现在，你已经配置好了<code translate="no">migration.yaml</code> 文件，可以通过运行以下命令来启动迁移任务：</p>
<pre><code translate="no">./milvus-migration start --config=/{YourConfigFilePath}/migration.yaml
<button class="copy-code-btn"></button></code></pre>
<p>观察日志输出。当你看到类似下面的日志时，就说明迁移成功了。</p>
<pre><code translate="no">[task/load_base_task.go:94] [<span class="hljs-string">&quot;[LoadTasker] Dec Task Processing--------------&gt;&quot;</span>] [Count=0] [fileName=testfiles/output/zwh/migration/test_mul_field4/data_1_1.json] [taskId=442665677354739304][task/load_base_task.go:76] [<span class="hljs-string">&quot;[LoadTasker] Progress Task ---------------&gt;&quot;</span>] [fileName=testfiles/output/zwh/migration/test_mul_field4/data_1_1.json] [taskId=442665677354739304][dbclient/cus_field_milvus2x.go:86] [<span class="hljs-string">&quot;[Milvus2x] begin to ShowCollectionRows&quot;</span>][loader/cus_milvus2x_loader.go:66] [<span class="hljs-string">&quot;[Loader] Static: &quot;</span>] [collection=test_mul_field4_rename1] [beforeCount=50000] [afterCount=100000] [increase=50000][loader/cus_milvus2x_loader.go:66] [<span class="hljs-string">&quot;[Loader] Static Total&quot;</span>] [<span class="hljs-string">&quot;Total Collections&quot;</span>=1] [beforeTotalCount=50000] [afterTotalCount=100000] [totalIncrease=50000][migration/es_starter.go:25] [<span class="hljs-string">&quot;[Starter] migration ES to Milvus finish!!!&quot;</span>] [Cost=80.009174459][starter/starter.go:106] [<span class="hljs-string">&quot;[Starter] Migration Success!&quot;</span>] [Cost=80.00928425][cleaner/remote_cleaner.go:27] [<span class="hljs-string">&quot;[Remote Cleaner] Begin to clean files&quot;</span>] [bucket=a-bucket] [rootPath=testfiles/output/zwh/migration][cmd/start.go:32] [<span class="hljs-string">&quot;[Cleaner] clean file success!&quot;</span>]
<button class="copy-code-btn"></button></code></pre>
<p>除了命令行方式外，Milvus迁移还支持使用Restful API进行迁移。</p>
<p>要使用Restful API，请使用以下命令启动API服务器：</p>
<pre><code translate="no">./milvus-migration server run -p 8080
<button class="copy-code-btn"></button></code></pre>
<p>服务运行后，就可以通过调用 API 来启动迁移。</p>
<pre><code translate="no">curl -XPOST http://localhost:8080/api/v1/start
<button class="copy-code-btn"></button></code></pre>
<p>迁移完成后，你可以使用一体化向量数据库管理工具<a href="https://zilliz.com/attu">Attu</a> 查看迁移成功的行总数，并执行其他与 Collection 相关的操作符。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/attu_interface_vector_database_admin_4893a31f6d.png" alt="The Attu interface" class="doc-image" id="the-attu-interface" />
   </span> <span class="img-wrapper"> <span>Attu 界面</span> </span></p>
<h2 id="Migration-from-Milvus-1x-to-Milvus-2x" class="common-anchor-header">从 Milvus 1.x 迁移到 Milvus 2.x<button data-href="#Migration-from-Milvus-1x-to-Milvus-2x" class="anchor-icon" translate="no">
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
<li>准备 Milvus 1.x 数据</li>
</ol>
<p>为了帮助你快速体验迁移过程，我们在 Milvus 迁移的源代码中放入了 10,000 条 Milvus 1.x<a href="https://github.com/zilliztech/milvus-migration/blob/main/README_1X.md">测试数据</a>记录。不过，在实际情况下，你必须在开始迁移过程之前，从你的Milvus 1.x实例中导出自己的<code translate="no">meta.json</code> 文件。</p>
<ul>
<li>你可以使用以下命令导出数据。</li>
</ul>
<pre><code translate="no">./milvus-migration <span class="hljs-built_in">export</span> -m <span class="hljs-string">&quot;user:password@tcp(adderss)/milvus?charset=utf8mb4&amp;parseTime=True&amp;loc=Local&quot;</span> -o outputDir
<button class="copy-code-btn"></button></code></pre>
<p>请确保</p>
<ul>
<li><p>用实际的 MySQL 凭据替换占位符。</p></li>
<li><p>在执行导出之前，停止 Milvus 1.x 服务器或停止数据写入。</p></li>
<li><p>将 Milvus<code translate="no">tables</code> 文件夹和<code translate="no">meta.json</code> 文件复制到同一目录。</p></li>
</ul>
<p><strong>注意：</strong>如果您在<a href="https://zilliz.com/cloud">Zilliz Cloud</a>（Milvus 的完全托管服务）上使用 Milvus 2.x，您可以使用云控制台开始迁移。</p>
<ol start="2">
<li>编译和构建</li>
</ol>
<p>首先，<a href="https://github.com/zilliztech/milvus-migration">从 GitHub</a> 下载 Milvus 迁移的<a href="https://github.com/zilliztech/milvus-migration">源代码</a>。然后，运行以下命令进行编译。</p>
<pre><code translate="no"><span class="hljs-keyword">go</span> get
<span class="hljs-keyword">go</span> build
<button class="copy-code-btn"></button></code></pre>
<p>这一步将生成一个名为<code translate="no">milvus-migration</code> 的可执行文件。</p>
<ol start="3">
<li>配置<code translate="no">migration.yaml</code></li>
</ol>
<p>准备一个<code translate="no">migration.yaml</code> 配置文件，指定源、目标和其他相关设置的详细信息。下面是一个配置示例：</p>
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
<p>有关配置文件的详细说明，请参阅 GitHub 上的<a href="https://github.com/zilliztech/milvus-migration/blob/main/README_1X.md">此页面</a>。</p>
<ol start="4">
<li>执行迁移任务</li>
</ol>
<p>你必须分别执行<code translate="no">dump</code> 和<code translate="no">load</code> 命令才能完成迁移。这些命令会转换数据并将其导入 Milvus 2.x。</p>
<p><strong>注：</strong>我们将简化这一步骤，使用户很快就能只用一条命令完成迁移。敬请期待。</p>
<p><strong>转储命令</strong></p>
<pre><code translate="no">./milvus-migration dump --config=/{YourConfigFilePath}/migration.yaml
<button class="copy-code-btn"></button></code></pre>
<p><strong>加载命令</strong></p>
<pre><code translate="no">./milvus-migration load --config=/{YourConfigFilePath}/migration.yaml
<button class="copy-code-btn"></button></code></pre>
<p>迁移后，Milvus 2.x 中生成的 Collections 将包含两个字段：<code translate="no">id</code> 和<code translate="no">data</code> 。您可以使用一体化向量数据库管理工具<a href="https://zilliz.com/attu">Attu</a> 查看更多详情。</p>
<h2 id="Migration-from-FAISS-to-Milvus-2x" class="common-anchor-header">从 FAISS 迁移到 Milvus 2.x<button data-href="#Migration-from-FAISS-to-Milvus-2x" class="anchor-icon" translate="no">
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
<li>准备 FAISS 数据</li>
</ol>
<p>要迁移 Elasticsearch 数据，您应该准备好自己的 FAISS 数据。为了帮助你快速体验迁移过程，我们在 Milvus 迁移的源代码中放入了一些<a href="https://github.com/zilliztech/milvus-migration/blob/main/README_FAISS.md">FAISS 测试数据</a>。</p>
<ol start="2">
<li>编译和构建</li>
</ol>
<p>首先，<a href="https://github.com/zilliztech/milvus-migration">从 GitHub</a> 下载 Milvus 迁移的<a href="https://github.com/zilliztech/milvus-migration">源代码</a>。然后，运行以下命令进行编译。</p>
<pre><code translate="no"><span class="hljs-keyword">go</span> get
<span class="hljs-keyword">go</span> build
<button class="copy-code-btn"></button></code></pre>
<p>这一步将生成一个名为<code translate="no">milvus-migration</code> 的可执行文件。</p>
<ol start="3">
<li>配置<code translate="no">migration.yaml</code></li>
</ol>
<p>为 FAISS 迁移准备一个<code translate="no">migration.yaml</code> 配置文件，指定源、目标和其他相关设置的详细信息。下面是一个配置示例：</p>
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
<p>有关配置文件的详细说明，请参阅 GitHub 上的<a href="https://github.com/zilliztech/milvus-migration/blob/main/README_FAISS.md">此页面</a>。</p>
<ol start="4">
<li>执行迁移任务</li>
</ol>
<p>与 Milvus 1.x 向 Milvus 2.x 迁移一样，FAISS 迁移也需要同时执行<code translate="no">dump</code> 和<code translate="no">load</code> 命令。这些命令会转换数据并将其导入 Milvus 2.x。</p>
<p><strong>注：</strong>我们将简化这一步骤，使用户只需使用一条命令即可完成迁移。敬请期待。</p>
<p><strong>转储命令</strong></p>
<pre><code translate="no">./milvus-migration dump --config=/{YourConfigFilePath}/migration.yaml
<button class="copy-code-btn"></button></code></pre>
<p><strong>加载命令：</strong></p>
<pre><code translate="no">./milvus-migration load --config=/{YourConfigFilePath}/migration.yaml
<button class="copy-code-btn"></button></code></pre>
<p>您可以使用一体化向量数据库管理工具<a href="https://zilliz.com/attu">Attu</a> 查看更多详情。</p>
<h2 id="Stay-tuned-for-future-migration-plans" class="common-anchor-header">敬请期待未来的迁移计划<button data-href="#Stay-tuned-for-future-migration-plans" class="anchor-icon" translate="no">
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
    </button></h2><p>未来，我们将支持从更多数据源迁移，并添加更多迁移功能，包括</p>
<ul>
<li><p>支持从 Redis 迁移到 Milvus。</p></li>
<li><p>支持从 MongoDB 迁移到 Milvus。</p></li>
<li><p>支持可恢复迁移。</p></li>
<li><p>将转储和加载过程合二为一，简化迁移命令。</p></li>
<li><p>支持从其他主流数据源迁移到 Milvus。</p></li>
</ul>
<h2 id="Conclusion" class="common-anchor-header">结论<button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.3 作为 Milvus 的最新版本，带来了令人振奋的新功能和性能改进，迎合了数据管理日益增长的需求。将数据迁移到 Milvus 2.x 可以释放这些优势，Milvus 迁移项目使迁移过程变得精简、轻松。试一试吧，你不会失望的。</p>
<p><em><strong>注：</strong>本博客中的信息基于Milvus和<a href="https://github.com/zilliztech/milvus-migration">Milvus迁移</a>项目截至2023年9月的状态。请查阅<a href="https://milvus.io/docs">Milvus</a>官方<a href="https://milvus.io/docs">文档</a>，了解最新信息和说明。</em></p>
