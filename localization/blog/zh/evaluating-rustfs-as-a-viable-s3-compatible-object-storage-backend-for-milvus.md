---
id: >-
  evaluating-rustfs-as-a-viable-s3-compatible-object-storage-backend-for-milvus.md
title: MinIO 停止接受社区修改：评估 RustFS 作为 Milvus S3 兼容对象存储后端的可行性
author: Min Yin
date: 2026-01-14T00:00:00.000Z
cover: assets.zilliz.com/Min_IO_cover_4102d4ef61.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'object storage, S3 compatible storage, MinIO, RustFS, Milvus'
meta_title: |
  Evaluating RustFS for Milvus S3-Compatible Object Storage
desc: 了解 Milvus 如何依赖 S3 兼容对象存储，以及如何通过实践演练在 Milvus 中部署 RustFS 作为 MinIO 的替代。
origin: >-
  https://milvus.io/blog/evaluating-rustfs-as-a-viable-s3-compatible-object-storage-backend-for-milvus.md
---
<p><em>本文作者尹敏是 Milvus 最活跃的社区贡献者之一，经授权在此发布。</em></p>
<p><a href="https://github.com/minio/minio">MinIO</a>是一个开源、高性能、兼容 S3 的对象存储系统，广泛应用于 AI/ML、分析和其他数据密集型工作负载。对于许多<a href="https://milvus.io/">Milvus</a>部署来说，它也一直是对象存储的默认选择。不过最近，MinIO 团队更新了<a href="https://github.com/minio/minio?tab=readme-ov-file">GitHub README</a>，表示<strong><em>该项目不再接受新的变更</em></strong><em>。</em></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/minio_7b7df16860.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>实际上，在过去几年中，MinIO 已逐渐将注意力转向商业产品，收紧了许可和分发模型，并缩减了社区存储库中的活跃开发。将开源项目转入维护模式是这一广泛转型的自然结果。</p>
<p>对于默认依赖MinIO的Milvus用户来说，这一变化是难以忽视的。对象存储是 Milvus 持久层的核心，随着时间的推移，它的可靠性不仅取决于当前的工作情况，还取决于系统是否能与它所支持的工作负载一起继续发展。</p>
<p>在此背景下，本文探讨了作为潜在替代方案的<a href="https://github.com/rustfs/rustfs">RustFS</a>。RustFS 是一个基于 Rust、兼容 S3 的对象存储系统，强调内存安全和现代系统设计。该系统目前仍处于实验阶段，本文的讨论并非生产推荐。</p>
<h2 id="The-Milvus-Architecture-and-Where-the-Object-Storage-Component-Sits" class="common-anchor-header">Milvus 架构和对象存储组件的位置<button data-href="#The-Milvus-Architecture-and-Where-the-Object-Storage-Component-Sits" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.6 采用完全解耦的存储-计算架构。在这个模型中，存储层由三个独立的组件组成，每个组件都扮演着不同的角色。</p>
<p>Etcd 用于存储元数据，Pulsar 或 Kafka 用于处理流日志，而对象存储（通常是 MinIO 或 S3 兼容服务）则为向量数据和索引文件提供持久性。由于存储和计算是分开的，因此 Milvus 可以独立扩展计算节点，同时依靠共享、可靠的存储后端。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/milvus_architecture_fe897f1098.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="The-Role-of-Object-Storage-in-Milvus" class="common-anchor-header">对象存储在 Milvus 中的作用</h3><p>对象存储是 Milvus 的持久存储层。原始向量数据以 binlog 的形式持久化，HNSW 和 IVF_FLAT 等索引结构也存储在这里。</p>
<p>这种设计使计算节点成为无状态节点。查询节点不在本地存储数据，而是按需从对象存储中加载数据段和索引。因此，节点可以自由增减，从故障中快速恢复，并支持整个集群的动态负载平衡，而无需在存储层重新平衡数据。</p>
<pre><code translate="no">my-milvus-bucket/
├── files/                          <span class="hljs-comment"># rootPath (default)</span>
│   ├── insert_log/                 <span class="hljs-comment"># insert binlogs</span>
│   │   └── {Collection_ID}/
│   │       └── {Partition_ID}/
│   │           └── {Segment_ID}/
│   │               └── {Field_ID}/
│   │                   └── {Log_ID}     <span class="hljs-comment"># Per-field binlog files</span>
│   │
│   ├── delta_log/                  <span class="hljs-comment"># Delete binlogs</span>
│   │   └── {Collection_ID}/
│   │       └── {Partition_ID}/
│   │           └── {Segment_ID}/
│   │               └── {Log_ID}        
│   │
│   ├── stats_log/                  <span class="hljs-comment"># Statistical data (e.g., Bloom filters)</span>
│   │   └── {Collection_ID}/
│   │       └── {Partition_ID}/
│   │           └── {Segment_ID}/
│   │               └── {Field_ID}/
│   │                   └── {Log_ID}
│   │
│   └── index_files/                <span class="hljs-comment"># Index files</span>
│       └── {Build_ID}_{Index_Version}_{Segment_ID}_{Field_ID}/
│           ├── index_file_0
│           ├── index_file_1
│           └── ...
<button class="copy-code-btn"></button></code></pre>
<h3 id="Why-Milvus-Uses-the-S3-API" class="common-anchor-header">Milvus 为何使用 S3 API</h3><p>Milvus 没有定义自定义存储协议，而是使用 S3 API 作为其对象存储接口。S3 已成为对象存储的事实标准：AWS S3、阿里巴巴云 OSS 和腾讯云 COS 等主要云提供商原生支持 S3，而 MinIO、Ceph RGW、SeaweedFS 和 RustFS 等开源系统也完全兼容 S3。</p>
<p>通过对 S3 API 进行标准化，Milvus 可以依赖成熟的、经过良好测试的 Go SDK，而不是为每个存储后端维护单独的集成。这种抽象还为用户提供了部署灵活性：MinIO 用于本地开发，云对象存储用于生产，Ceph 和 RustFS 用于私有环境。只要有与 S3 兼容的端点，Milvus 就不需要知道或关心下面使用的是哪种存储系统。</p>
<pre><code translate="no"><span class="hljs-comment"># Milvus configuration file milvus.yaml</span>
minio:
 address: localhost
 port: <span class="hljs-number">9000</span>
 accessKeyID: minioadmin
 secretAccessKey: minioadmin
 useSSL: false
 bucketName: milvus-bucket
<button class="copy-code-btn"></button></code></pre>
<h2 id="Evaluating-RustFS-as-an-S3-Compatible-Object-Storage-Backend-for-Milvus" class="common-anchor-header">评估 RustFS 作为 Milvus 的 S3 兼容对象存储后端<button data-href="#Evaluating-RustFS-as-an-S3-Compatible-Object-Storage-Backend-for-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Project-Overview" class="common-anchor-header">项目概述</h3><p>RustFS 是用 Rust 编写的分布式对象存储系统。它目前处于 alpha 阶段（版本 1.0.0-alpha.68），旨在将 MinIO 的操作简易性与 Rust 在内存安全和性能方面的优势结合起来。更多详情请访问<a href="https://github.com/rustfs/rustfs">GitHub</a>。</p>
<p>RustFS 仍在积极开发中，其分布式模式尚未正式发布。因此，现阶段不建议将 RustFS 用于生产或关键任务工作负载。</p>
<h3 id="Architecture-Design" class="common-anchor-header">架构设计</h3><p>RustFS 采用的设计在概念上与 MinIO 相似。HTTP 服务器提供与 S3 兼容的 API，对象管理器负责处理对象元数据，存储引擎负责数据块管理。在存储层，RustFS 依赖 XFS 或 ext4 等标准文件系统。</p>
<p>对于计划中的分布式模式，RustFS 打算使用 etcd 进行元数据协调，多个 RustFS 节点组成一个集群。这种设计与常见的对象存储架构非常吻合，让拥有 MinIO 经验的用户对 RustFS 并不陌生。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/architecture_design_852f73b2c8.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Compatibility-with-Milvus" class="common-anchor-header">与 Milvus 的兼容性</h3><p>在考虑将 RustFS 作为替代对象存储后端之前，有必要评估它是否符合 Milvus 的核心存储要求。</p>
<table>
<thead>
<tr><th style="text-align:center"><strong>Milvus 要求</strong></th><th style="text-align:center"><strong>S3 应用程序接口</strong></th><th style="text-align:center"><strong>RustFS 支持</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center">向量数据持久化</td><td style="text-align:center"><code translate="no">PutObject</code>,<code translate="no">GetObject</code></td><td style="text-align:center">✅ 完全支持</td></tr>
<tr><td style="text-align:center">索引文件管理</td><td style="text-align:center"><code translate="no">ListObjects</code>,<code translate="no">DeleteObject</code></td><td style="text-align:center">完全支持</td></tr>
<tr><td style="text-align:center">分段合并操作</td><td style="text-align:center">多部分上传</td><td style="text-align:center">✅ 完全支持</td></tr>
<tr><td style="text-align:center">一致性保证</td><td style="text-align:center">强读写后</td><td style="text-align:center">强一致性（单节点）</td></tr>
</tbody>
</table>
<p>根据上述评估，RustFS 当前的 S3 API 实现满足 Milvus 的基线功能要求。这使其适合在非生产环境中进行实际测试。</p>
<h2 id="Hands-On-Replacing-MinIO-with-RustFS-in-Milvus" class="common-anchor-header">实际操作：在 Milvus 中用 RustFS 替换 MinIO<button data-href="#Hands-On-Replacing-MinIO-with-RustFS-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>本练习的目标是替换默认的 MinIO 对象存储服务，并使用 RustFS 作为对象存储后端部署 Milvus 2.6.7。</p>
<h3 id="Prerequisites" class="common-anchor-header">前提条件</h3><ol>
<li><p>已安装 Docker 和 Docker Compose（版本≥ 20.10），系统可正常拉取镜像并运行容器。</p></li>
<li><p>本地目录可用于对象数据存储，如<code translate="no">/volume/data/</code> （或自定义路径）。</p></li>
<li><p>主机端口 9000 对外开放，或相应配置其他端口。</p></li>
<li><p>RustFS 容器以非根用户身份运行 (<code translate="no">rustfs</code>)。确保主机数据目录为 UID 10001 所有。</p></li>
</ol>
<h3 id="Step-1-Create-the-Data-Directory-and-Set-Permissions" class="common-anchor-header">第 1 步：创建数据目录并设置权限</h3><pre><code translate="no"><span class="hljs-comment"># Create the project directory</span>
<span class="hljs-built_in">mkdir</span> -p milvus-rustfs &amp;&amp; <span class="hljs-built_in">cd</span> milvus-rustfs
<span class="hljs-comment"># Create the data directory</span>
<span class="hljs-built_in">mkdir</span> -p volumes/{rustfs, etcd, milvus}
<span class="hljs-comment"># Update permissions for the RustFS directory</span>
<span class="hljs-built_in">sudo</span> <span class="hljs-built_in">chown</span> -R 10001:10001 volumes/rustfs
<button class="copy-code-btn"></button></code></pre>
<p><strong>下载官方 Docker Compose 文件</strong></p>
<pre><code translate="no">wget https://github.com/milvus-io/milvus/releases/download/v2.6.7/milvus-standalone-docker-compose.yml -O docker-compose.yml
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-2-Modify-the-Object-Storage-Service" class="common-anchor-header">第 2 步：修改对象存储服务</h3><p><strong>定义 RustFS 服务</strong></p>
<p>注意：确保访问密钥和秘钥与 Milvus 服务中配置的凭证相匹配。</p>
<pre><code translate="no">rustfs:
 container_name: milvus-rustfs
 image: registry.cn-hangzhou.aliyuncs.com/rustfs/rustfs: latest
 environment:
 RUSTFS_ACCESS_KEY: minioadmin
 RUSTFS_SECRET_KEY: minioadmin
 RUSTFS_CONSOLE_ENABLE: “<span class="hljs-literal">true</span>”
 RUSTFS_REGION: us-east-1
 <span class="hljs-comment"># RUSTFS_SERVER_DOMAINS: localhost# Optional; not required for local deployments</span>
 ports:
 - “9001:9001”
 - “9000:9000”
 volumes:
 - <span class="hljs-variable">${DOCKER_VOLUME_DIRECTORY:-.}</span>/volumes/rustfs:/data
 <span class="hljs-built_in">command</span>: &gt;
 --address :9000
 --console-enable
 /data
 healthcheck:
 <span class="hljs-built_in">test</span>: [“CMD”, “curl”, “-f”, “http://localhost:9000/health<span class="hljs-string">&quot;]
 interval: 30s
 timeout: 20s
 retries: 3
</span><button class="copy-code-btn"></button></code></pre>
<p><strong>完成配置</strong></p>
<p>注意：Milvus 的存储配置目前假设 MinIO 风格的默认值，尚不允许自定义访问密钥或秘钥值。使用 RustFS 作为替代时，必须使用 Milvus 期望的相同默认凭据。</p>
<pre><code translate="no">version: ‘3.5’
services:
 etcd:
 container_name: milvus-etcd
 image: registry.cn-hangzhou.aliyuncs.com/etcd/etcd: v3.5.25
 environment:
 - ETCD_AUTO_COMPACTION_MODE=revision
 - ETCD_AUTO_COMPACTION_RETENTION=1000
 - ETCD_QUOTA_BACKEND_BYTES=4294967296
 - ETCD_SNAPSHOT_COUNT=50000
 volumes:
 - <span class="hljs-variable">${DOCKER_VOLUME_DIRECTORY:-.}</span>/volumes/etcd:/etcd
 <span class="hljs-built_in">command</span>: etcd -advertise-client-urls=http://etcd:2379 -listen-client-urls http://0.0.0.0:2379 --data-dir /etcd
 healthcheck:
 <span class="hljs-built_in">test</span>: [“CMD”, “etcdctl”, “endpoint”, “health”]
 interval: 30s
 <span class="hljs-built_in">timeout</span>: 20s
 retries: 3
 rustfs:
 container_name: milvus-rustfs
 image: registry.cn-hangzhou.aliyuncs.com/rustfs/rustfs: latest
 environment:
 RUSTFS_ACCESS_KEY: minioadmin
 RUSTFS_SECRET_KEY: minioadmin
 RUSTFS_CONSOLE_ENABLE: “<span class="hljs-literal">true</span>”
 RUSTFS_REGION: us-east-1
 <span class="hljs-comment"># RUSTFS_SERVER_DOMAINS: localhost# Optional; not required for local deployments</span>
 ports:
 - “9001:9001”
 - “9000:9000”
 volumes:
 - <span class="hljs-variable">${DOCKER_VOLUME_DIRECTORY:-.}</span>/volumes/rustfs:/data
 <span class="hljs-built_in">command</span>: &gt;
 --address :9000
 --console-enable
 /data
 healthcheck:
 <span class="hljs-built_in">test</span>: [“CMD”, “curl”, “-f”, “http://localhost:9000/health<span class="hljs-string">&quot;]
 interval: 30s
 timeout: 20s
 retries: 3
 standalone:
 container_name: milvus-standalone
 image: registry.cn-hangzhou.aliyuncs.com/milvus/milvus: v2.6.7
 command: [”milvus“, ”run“, ”standalone“]
 security_opt:
 - seccomp: unconfined
 environment:
 MINIO_REGION: us-east-1
 ETCD_ENDPOINTS: etcd:2379
 MINIO_ADDRESS: rustfs:9000
 MINIO_ACCESS_KEY: minioadmin
 MINIO_SECRET_KEY: minioadmin
 MINIO_USE_SSL: ”false“
 MQ_TYPE: rocksmq
 volumes:
 - <span class="hljs-variable">${DOCKER_VOLUME_DIRECTORY:-.}</span>/volumes/milvus:/var/lib/milvus
 healthcheck:
 test: [”CMD“, ”curl“, ”-f“, ”http://localhost:9091/healthz&quot;</span>]
 interval: 30s
 start_period: 90s
 <span class="hljs-built_in">timeout</span>: 20s
 retries: 3
 ports:
 - “19530:19530”
 - “9091:9091”
 depends_on:
 - “etcd”
 - “rustfs”
networks:
 default:
 name: milvus
<button class="copy-code-btn"></button></code></pre>
<p><strong>启动服务</strong></p>
<pre><code translate="no">docker-compose -f docker-compose.yaml up -d
<button class="copy-code-btn"></button></code></pre>
<p><strong>检查服务状态</strong></p>
<pre><code translate="no">docker-compose ps -a
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/code_d64dc88a96.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>访问 RustFS Web UI</strong></p>
<p>在浏览器中打开 RustFS 网页界面<a href="http://localhost:9001">：http://localhost:9001</a></p>
<p>使用默认凭据登录：用户名和密码都是 minioadmin。</p>
<p><strong>测试 Milvus 服务</strong></p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> connections, Collection, FieldSchema, CollectionSchema, DataType
<span class="hljs-comment"># connect to Milvus</span>
connections.connect(
 alias=<span class="hljs-string">&quot;default&quot;</span>,
 host=<span class="hljs-string">&#x27;localhost&#x27;</span>,
 port=<span class="hljs-string">&#x27;19530&#x27;</span>
)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;✓ Successfully connected to Milvus!&quot;</span>)
<span class="hljs-comment"># create test collection</span>
fields = [
 FieldSchema(name=<span class="hljs-string">&quot;id&quot;</span>, dtype=DataType.INT64, is_primary=<span class="hljs-literal">True</span>, auto_id=<span class="hljs-literal">True</span>),
 FieldSchema(name=<span class="hljs-string">&quot;embedding&quot;</span>, dtype=DataType.FLOAT_VECTOR, dim=<span class="hljs-number">128</span>)
]
schema = CollectionSchema(fields=fields, description=<span class="hljs-string">&quot;test collection&quot;</span>)
collection = Collection(name=<span class="hljs-string">&quot;test_collection&quot;</span>, schema=schema)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;✓ Test collection created!&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;✓ RustFS verified as the S3 storage backend!&quot;</span>)

<span class="hljs-comment">### Step 3: Storage Performance Testing (Experimental)</span>

**Test Design**

Two Milvus deployments were <span class="hljs-built_in">set</span> up on identical hardware (<span class="hljs-number">16</span> cores / <span class="hljs-number">32</span> GB memory / NVMe SSD), using RustFS <span class="hljs-keyword">and</span> MinIO respectively <span class="hljs-keyword">as</span> the <span class="hljs-built_in">object</span> storage backend. The test dataset consisted of <span class="hljs-number">1</span>,<span class="hljs-number">000</span>,<span class="hljs-number">000</span> vectors <span class="hljs-keyword">with</span> <span class="hljs-number">768</span> dimensions, using an HNSW index <span class="hljs-keyword">with</span> parameters _M = 16_ <span class="hljs-keyword">and</span> _efConstruction = 200_. Data was inserted <span class="hljs-keyword">in</span> batches of <span class="hljs-number">5</span>,<span class="hljs-number">000.</span>

The following metrics were evaluated: Insert throughput, Index build time, Cold <span class="hljs-keyword">and</span> warm load time, Search latency, Storage footprint.

**Test Code**

Note: Only the core parts of the test code are shown below.

<button class="copy-code-btn"></button></code></pre>
<p>def milvus_load_bench(dim=768, rows=1_000_000, batch=5000): collection = Collection(...) # Insert test t0 = time.perf_counter() for i in range(0, rows, batch): collection.insert([rng.random((batch, dim), dtype=np.float32).tolist()]) insert_time = time.perf_counter() - t0 # Index build collection.flush() collection.create_index(field_name=&quot;embededding&quot;, index_params={&quot;index_type&quot;: &quot;HNSW&quot;, ...}) # 加载测试（冷启动 + 两次热启动） Collections.release() load_times = [] for i in range(3): if i &gt; 0: collection.release(); time.sleep(2) collection.load() load_times.append(...) # 查询测试 search_times = [] for _ in range(3): collection.search(queries, limit=10, ...)</p>
<pre><code translate="no">
**Test Command**

<button class="copy-code-btn"></button></code></pre>
<custom-h1>RustFS: --port 19530 --s3-endpoint http://localhost:9000 --s3-bucket bench</custom-h1><custom-h1>MinIO: --port 19531 --s3-endpoint http://localhost:9001 --s3-bucket a-bucket</custom-h1><p>python bench.py milvus-load-bench --dim 768 --rows 1000000 --batch 5000 <br>
-索引类型 HNSW --repeat-load 3 --release-before-load --do-search --drop-after</p>
<pre><code translate="no">
**Performance Results**

- **RustFS**

<span class="hljs-function">Faster <span class="hljs-title">writes</span> (<span class="hljs-params">+<span class="hljs-number">57</span>%</span>), lower storage <span class="hljs-title">usage</span> (<span class="hljs-params">–<span class="hljs-number">57</span>%</span>), <span class="hljs-keyword">and</span> faster warm <span class="hljs-title">loads</span> (<span class="hljs-params">+<span class="hljs-number">67</span>%</span>), making it suitable <span class="hljs-keyword">for</span> write-heavy, cost-sensitive workloads. 

Much slower <span class="hljs-title">queries</span> (<span class="hljs-params"><span class="hljs-number">7.96</span> ms vs. <span class="hljs-number">1.85</span> ms, ~+<span class="hljs-number">330</span>% latency</span>) <span class="hljs-keyword">with</span> noticeable <span class="hljs-title">variance</span> (<span class="hljs-params">up to <span class="hljs-number">17.14</span> ms</span>), <span class="hljs-keyword">and</span> 43% slower index builds. Not suitable <span class="hljs-keyword">for</span> query-intensive applications.

- **MinIO**

Excellent query <span class="hljs-title">performance</span> (<span class="hljs-params">**<span class="hljs-number">1.85</span> ms** average latency</span>), mature small-<span class="hljs-keyword">file</span> <span class="hljs-keyword">and</span> random I/O optimizations, <span class="hljs-keyword">and</span> a well-established ecosystem.


|     **Metric**    |  **RustFS**  |   **MinIO**  | **Difference** |
| :---------------: | :----------: | :----------: | :------------: |
| Insert Throughput | 4,472 rows/s | 2,845 rows/s |      0.57      |
|  Index Build Time |     803 s    |     562 s    |      -43%      |
| <span class="hljs-title">Load</span> (<span class="hljs-params">Cold Start</span>) |    22.7 s    |    18.3 s    |      -24%      |
| <span class="hljs-title">Load</span> (<span class="hljs-params">Warm Start</span>) |    0.009 s   |    0.027 s   |      0.67      |
|   Search Latency  |    7.96 ms   |    1.85 ms   |    **-330%**   |
|   Storage Usage   |    7.8 GB    |    18.0 GB   |      0.57      |

RustFS significantly outperforms MinIO <span class="hljs-keyword">in</span> write performance <span class="hljs-keyword">and</span> storage efficiency, <span class="hljs-keyword">with</span> both showing roughly 57% improvement. This demonstrates the system-level advantages of the Rust ecosystem. However, the 330% gap <span class="hljs-keyword">in</span> query latency limits RustFS’s suitability <span class="hljs-keyword">for</span> query-intensive workloads.

For **production environments**, cloud-managed <span class="hljs-built_in">object</span> storage services like **AWS S3** are recommended first, <span class="hljs-keyword">as</span> they are mature, stable, <span class="hljs-keyword">and</span> require no operational effort. Self-hosted solutions are better suited to specific scenarios: RustFS <span class="hljs-keyword">for</span> cost-sensitive <span class="hljs-keyword">or</span> write-intensive workloads, MinIO <span class="hljs-keyword">for</span> query-intensive use cases, <span class="hljs-keyword">and</span> Ceph <span class="hljs-keyword">for</span> data sovereignty. With further optimization <span class="hljs-keyword">in</span> random read performance, RustFS has the potential to become a strong self-hosted option.


## Conclusion

MinIO’s decision to stop accepting <span class="hljs-keyword">new</span> community contributions <span class="hljs-keyword">is</span> disappointing <span class="hljs-keyword">for</span> many developers, but it won’t disrupt Milvus users. Milvus depends <span class="hljs-keyword">on</span> the S3 API—<span class="hljs-keyword">not</span> any specific vendor implementation—so swapping storage backends <span class="hljs-keyword">is</span> straightforward. This S3-compatibility layer <span class="hljs-keyword">is</span> intentional: it ensures Milvus stays flexible, portable, <span class="hljs-keyword">and</span> decoupled <span class="hljs-keyword">from</span> vendor <span class="hljs-keyword">lock</span>-<span class="hljs-keyword">in</span>.

For production deployments, cloud-managed services such <span class="hljs-keyword">as</span> AWS S3 <span class="hljs-keyword">and</span> Alibaba Cloud OSS remain the most reliable options. They’re mature, highly available, <span class="hljs-keyword">and</span> drastically reduce the operational load compared to running your own <span class="hljs-built_in">object</span> storage. Self-hosted systems like MinIO <span class="hljs-keyword">or</span> Ceph still make sense <span class="hljs-keyword">in</span> cost-sensitive environments <span class="hljs-keyword">or</span> <span class="hljs-keyword">where</span> data sovereignty <span class="hljs-keyword">is</span> non-negotiable, but they require significantly more engineering overhead to operate safely at scale.

RustFS <span class="hljs-keyword">is</span> interesting—Apache 2.0-licensed, Rust-based, <span class="hljs-keyword">and</span> community-driven—but it&#x27;s still early. The performance gap <span class="hljs-keyword">is</span> noticeable, <span class="hljs-keyword">and</span> the distributed mode hasn’t shipped yet. It’s <span class="hljs-keyword">not</span> production-ready today, but it’s a project worth watching <span class="hljs-keyword">as</span> it matures.

If you’re comparing <span class="hljs-built_in">object</span> storage options <span class="hljs-keyword">for</span> Milvus, evaluating MinIO replacements, <span class="hljs-keyword">or</span> weighing the operational trade-offs of different backends, we’d love to hear <span class="hljs-keyword">from</span> you.

Join our[ Discord channel](<span class="hljs-params">https://discord.com/invite/<span class="hljs-number">8u</span>yFbECzPX</span>) <span class="hljs-keyword">and</span> share your thoughts. You can also book a 20-minute one-<span class="hljs-keyword">on</span>-one session to <span class="hljs-keyword">get</span> insights, guidance, <span class="hljs-keyword">and</span> answers to your questions through[ Milvus Office Hours](<span class="hljs-params">https://milvus.io/blog/<span class="hljs-keyword">join</span>-milvus-office-hours-to-<span class="hljs-keyword">get</span>-support-<span class="hljs-keyword">from</span>-vectordb-experts.md</span>).
</span><button class="copy-code-btn"></button></code></pre>
