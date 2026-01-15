---
id: >-
  evaluating-rustfs-as-a-viable-s3-compatible-object-storage-backend-for-milvus.md
title: MinIO 停止接受社群變更：評估 RustFS 作為 Milvus 的 S3 相容物件儲存後端是否可行
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
desc: 瞭解 Milvus 如何依賴 S3 相容的物件儲存，以及如何透過實作演練在 Milvus 中部署 RustFS 作為 MinIO 的替代。
origin: >-
  https://milvus.io/blog/evaluating-rustfs-as-a-viable-s3-compatible-object-storage-backend-for-milvus.md
---
<p><em>本文章由 Milvus 最活躍的社群貢獻者之一 Min Yin 撰寫，並經允許在此發表。</em></p>
<p><a href="https://github.com/minio/minio">MinIO</a>是一套開放原始碼、高效能且相容於 S3 的物件儲存系統，廣泛應用於 AI/ML、分析及其他資料密集型工作負載。對於許多<a href="https://milvus.io/">Milvus</a>部署而言，它也是物件儲存的預設選擇。但最近，MinIO 團隊更新了<a href="https://github.com/minio/minio?tab=readme-ov-file">GitHub README</a>，<strong><em>聲明此專案不再接受新的變更</em></strong><em>。</em></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/minio_7b7df16860.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>事實上，在過去幾年中，MinIO 已逐漸將其注意力轉向商業產品，收緊其授權與發行模式，並縮減社群儲存庫中的主動開發規模。將開源專案轉移到維護模式，是這個更廣泛轉型的自然結果。</p>
<p>對於預設依賴 MinIO 的 Milvus 使用者來說，這個改變是難以忽視的。物件儲存是 Milvus 持久層的核心，隨著時間的推移，它的可靠性不僅取決於目前的運作狀況，也取決於系統是否能隨著其支援的工作負載持續演進。</p>
<p>在此背景下，本文探討<a href="https://github.com/rustfs/rustfs">RustFS</a>作為潛在替代方案的可能性。RustFS 是一個以 Rust 為基礎、與 S3 相容的物件儲存系統，強調記憶體安全與現代系統設計。它仍處於實驗階段，本討論並非生產推薦。</p>
<h2 id="The-Milvus-Architecture-and-Where-the-Object-Storage-Component-Sits" class="common-anchor-header">Milvus 架構與物件儲存元件的位置<button data-href="#The-Milvus-Architecture-and-Where-the-Object-Storage-Component-Sits" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.6 採用完全解耦的儲存-運算架構。在這個模型中，儲存層由三個獨立的元件組成，每個元件都扮演不同的角色。</p>
<p>Etcd 會儲存元資料，Pulsar 或 Kafka 會處理串流日誌，而物件儲存 - 通常是 MinIO 或 S3 相容的服務 - 則會提供向量資料和索引檔案的持久性。由於儲存與運算是分開的，因此 Milvus 可以獨立擴充運算節點，同時依賴共享、可靠的儲存後端。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/milvus_architecture_fe897f1098.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="The-Role-of-Object-Storage-in-Milvus" class="common-anchor-header">物件儲存在 Milvus 中的角色</h3><p>物件儲存是 Milvus 的持久儲存層。原始向量資料以 binlog 的形式持久化，而 HNSW 和 IVF_FLAT 等索引結構也儲存在此。</p>
<p>這種設計使得計算節點無狀態。查詢節點不在本機儲存資料，而是按需求從物件儲存載入區段和索引。因此，節點可以自由增減、從故障中快速恢復，並支援整個群集的動態負載平衡，而無需在儲存層重新平衡資料。</p>
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
<h3 id="Why-Milvus-Uses-the-S3-API" class="common-anchor-header">Milvus 為何使用 S3 API</h3><p>Milvus 並未定義自訂儲存通訊協定，而是使用 S3 API 作為其物件儲存介面。S3 已經成為物件儲存的實際標準：AWS S3、阿里巴巴雲 OSS 及騰訊雲 COS 等主要雲供應商都原生支援 S3，而 MinIO、Ceph RGW、SeaweedFS 及 RustFS 等開放原始碼系統也完全相容。</p>
<p>透過將 S3 API 標準化，Milvus 可以依賴成熟、經過良好測試的 Go SDK，而無需為每個儲存後端維護獨立的整合。這種抽象化也為使用者提供了部署上的彈性：MinIO 用於本機開發，雲端物件儲存用於生產，或 Ceph 和 RustFS 用於私有環境。只要有 S3 相容的端點可用，Milvus 就不需要知道或關心底下使用的是哪一種儲存系統。</p>
<pre><code translate="no"><span class="hljs-comment"># Milvus configuration file milvus.yaml</span>
minio:
 address: localhost
 port: <span class="hljs-number">9000</span>
 accessKeyID: minioadmin
 secretAccessKey: minioadmin
 useSSL: false
 bucketName: milvus-bucket
<button class="copy-code-btn"></button></code></pre>
<h2 id="Evaluating-RustFS-as-an-S3-Compatible-Object-Storage-Backend-for-Milvus" class="common-anchor-header">評估 RustFS 作為 Milvus 的 S3 相容物件儲存後端<button data-href="#Evaluating-RustFS-as-an-S3-Compatible-Object-Storage-Backend-for-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Project-Overview" class="common-anchor-header">專案概述</h3><p>RustFS 是用 Rust 寫成的分散式物件儲存系統。它目前處於 alpha 階段 (版本 1.0.0-alpha.68)，目標是結合 MinIO 的操作簡易性與 Rust 在記憶體安全與效能上的優勢。更多詳細資訊請參閱<a href="https://github.com/rustfs/rustfs">GitHub</a>。</p>
<p>RustFS 仍在積極開發中，其散佈式模式尚未正式發行。因此，現階段不建議使用 RustFS 來處理生產或關鍵任務的工作負載。</p>
<h3 id="Architecture-Design" class="common-anchor-header">架構設計</h3><p>RustFS 遵循的設計概念與 MinIO 相似。HTTP 伺服器會揭露與 S3 相容的 API，而物件管理員會處理物件的元資料，儲存引擎則負責資料區塊的管理。在儲存層，RustFS 依賴 XFS 或 ext4 等標準檔案系統。</p>
<p>對於計劃中的分散式模式，RustFS 打算使用 etcd 來協調元資料，由多個 RustFS 節點組成一個叢集。此設計與一般物件儲存架構緊密結合，讓有 MinIO 經驗的使用者熟悉 RustFS。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/architecture_design_852f73b2c8.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Compatibility-with-Milvus" class="common-anchor-header">與 Milvus 的相容性</h3><p>在考慮 RustFS 作為另一個物件儲存後端之前，有必要評估它是否符合 Milvus 的核心儲存需求。</p>
<table>
<thead>
<tr><th style="text-align:center"><strong>Milvus 要求</strong></th><th style="text-align:center"><strong>S3 API</strong></th><th style="text-align:center"><strong>RustFS 支援</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center">向量資料持久化</td><td style="text-align:center"><code translate="no">PutObject</code>,<code translate="no">GetObject</code></td><td style="text-align:center">✅完全支援</td></tr>
<tr><td style="text-align:center">索引檔案管理</td><td style="text-align:center"><code translate="no">ListObjects</code>,<code translate="no">DeleteObject</code></td><td style="text-align:center">✅ 完全支援</td></tr>
<tr><td style="text-align:center">分割合併作業</td><td style="text-align:center">多部分上傳</td><td style="text-align:center">✅ 完全支援</td></tr>
<tr><td style="text-align:center">一致性保證</td><td style="text-align:center">強讀後寫</td><td style="text-align:center">✅ 強一致性（單節點）</td></tr>
</tbody>
</table>
<p>根據這項評估，RustFS 目前的 S3 API 實作滿足 Milvus 的基線功能需求。這使得它適合在非生產環境中進行實際測試。</p>
<h2 id="Hands-On-Replacing-MinIO-with-RustFS-in-Milvus" class="common-anchor-header">實作：在 Milvus 中以 RustFS 取代 MinIO<button data-href="#Hands-On-Replacing-MinIO-with-RustFS-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>本練習的目標是取代預設的 MinIO 物件儲存服務，並使用 RustFS 作為物件儲存的後端來部署 Milvus 2.6.7。</p>
<h3 id="Prerequisites" class="common-anchor-header">先決條件</h3><ol>
<li><p>已安裝 Docker 和 Docker Compose (版本 ≥ 20.10)，系統可以正常拉取映像檔和執行容器。</p></li>
<li><p>本機目錄可用於物件資料儲存，例如<code translate="no">/volume/data/</code> (或自訂路徑)。</p></li>
<li><p>主機連接埠 9000 開放給外部存取，或依此設定其他連接埠。</p></li>
<li><p>RustFS 容器以非 root 使用者 (<code translate="no">rustfs</code>) 身份執行。確保主機資料目錄為 UID 10001 所有。</p></li>
</ol>
<h3 id="Step-1-Create-the-Data-Directory-and-Set-Permissions" class="common-anchor-header">步驟 1：建立資料目錄並設定權限</h3><pre><code translate="no"><span class="hljs-comment"># Create the project directory</span>
<span class="hljs-built_in">mkdir</span> -p milvus-rustfs &amp;&amp; <span class="hljs-built_in">cd</span> milvus-rustfs
<span class="hljs-comment"># Create the data directory</span>
<span class="hljs-built_in">mkdir</span> -p volumes/{rustfs, etcd, milvus}
<span class="hljs-comment"># Update permissions for the RustFS directory</span>
<span class="hljs-built_in">sudo</span> <span class="hljs-built_in">chown</span> -R 10001:10001 volumes/rustfs
<button class="copy-code-btn"></button></code></pre>
<p><strong>下載官方 Docker Compose 檔案</strong></p>
<pre><code translate="no">wget https://github.com/milvus-io/milvus/releases/download/v2.6.7/milvus-standalone-docker-compose.yml -O docker-compose.yml
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-2-Modify-the-Object-Storage-Service" class="common-anchor-header">步驟 2：修改物件儲存服務</h3><p><strong>定義 RustFS 服務</strong></p>
<p>注意：請確認存取金鑰和秘密金鑰與 Milvus 服務中設定的憑證相符。</p>
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
<p><strong>完成設定</strong></p>
<p>注意：Milvus 的儲存組態目前假設 MinIO 風格的預設值，尚未允許自訂存取金鑰或秘密金鑰值。當使用 RustFS 作為替代時，它必須使用 Milvus 期望的相同預設憑證。</p>
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
<p><strong>啟動服務</strong></p>
<pre><code translate="no">docker-compose -f docker-compose.yaml up -d
<button class="copy-code-btn"></button></code></pre>
<p><strong>檢查服務狀態</strong></p>
<pre><code translate="no">docker-compose ps -a
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/code_d64dc88a96.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>存取 RustFS Web UI</strong></p>
<p>在瀏覽器中開啟 RustFS 網頁介面<a href="http://localhost:9001">：http://localhost:9001</a></p>
<p>使用預設憑證登入：使用者名稱和密碼都是 minioadmin。</p>
<p><strong>測試 Milvus 服務</strong></p>
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
<p>def milvus_load_bench(dim=768, rows=1_000_000, batch=5000): collection = Collection(...) # Insert test t0 = time.perf_counter() for i in range(0, rows, batch): collection.insert([rng.random((batch, dim), dtype=np.float32).tolist()]) insert_time = time.perf_counter() - t0 # Index build collection.flush() collection.create_index(field_name=&quot;embedding&quot;, index_params={&quot;index_type&quot;: &quot;HNSW&quot;, ...})#負載測試 (冷啟動 + 兩次暖啟動) collection.load_times =[**] - t0release() load_times = [] for i in range(3): if i &gt; 0: collection.release(); time.sleep(2) collection.load() load_times.append(...) # 查詢測試 search_times = [] for _ in range(3): collection.search(queries, limit=10, ...)</p>
<pre><code translate="no">
**Test Command**

<button class="copy-code-btn"></button></code></pre>
<custom-h1>RustFS: --port 19530 --s3-endpoint http://localhost:9000 --s3-bucket bench</custom-h1><custom-h1>MinIO: --port 19531 --s3-endpoint http://localhost:9001 --s3-bucket a-bucket</custom-h1><p>python bench.py milvus-load-bench --dim 768 --rows 1000000 --batch 5000 <br>
--索引類型 HNSW --repeat-load 3 --release-before-load --do-search --drop-after</p>
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
