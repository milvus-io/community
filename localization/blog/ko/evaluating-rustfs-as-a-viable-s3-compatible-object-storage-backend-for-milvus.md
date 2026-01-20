---
id: >-
  evaluating-rustfs-as-a-viable-s3-compatible-object-storage-backend-for-milvus.md
title: 'MinIO, 커뮤니티 변경 사항 수락 중단: Milvus를 위한 실행 가능한 S3 호환 오브젝트 스토리지 백엔드로서 RustFS 평가하기'
author: Min Yin
date: 2026-01-14T00:00:00.000Z
cover: assets.zilliz.com/minio_cover_new_bc94d37abe.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'object storage, S3 compatible storage, MinIO, RustFS, Milvus'
meta_title: |
  Evaluating RustFS for Milvus S3-Compatible Object Storage
desc: >-
  실습 과정을 통해 Milvus가 S3 호환 오브젝트 스토리지에 의존하는 방법과 Milvus에서 MinIO를 대체하는 RustFS를 배포하는
  방법을 알아보세요.
origin: >-
  https://milvus.io/blog/evaluating-rustfs-as-a-viable-s3-compatible-object-storage-backend-for-milvus.md
---
<p><em>이 게시물은 Milvus의 가장 활발한 커뮤니티 기여자 중 한 명인 Min Yin이 작성했으며, 허가를 받아 여기에 게시되었습니다.</em></p>
<p><a href="https://github.com/minio/minio">MinIO는</a> AI/ML, 분석 및 기타 데이터 집약적인 워크로드에 널리 사용되는 오픈 소스 고성능 S3 호환 객체 스토리지 시스템입니다. 많은 <a href="https://milvus.io/">Milvus</a> 배포의 경우, 객체 스토리지의 기본 선택이기도 했습니다. 그러나 최근 MinIO 팀은 <strong><em>이 프로젝트가 더 이상 새로운 변경 사항을 수용하지 않는다는</em></strong> 내용의 <a href="https://github.com/minio/minio?tab=readme-ov-file">GitHub README를</a> 업데이트했습니다<em>.</em></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/minio_7b7df16860.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>실제로 지난 몇 년 동안 MinIO는 점차 상업용 제품으로 관심을 전환하고 라이선스 및 배포 모델을 강화했으며 커뮤니티 리포지토리에서의 활발한 개발을 축소해 왔습니다. 오픈소스 프로젝트를 유지 관리 모드로 전환하는 것은 이러한 광범위한 전환의 자연스러운 결과입니다.</p>
<p>기본적으로 MinIO를 사용하는 Milvus 사용자에게는 이러한 변화를 무시하기 어렵습니다. 객체 스토리지는 Milvus의 지속성 계층의 중심에 있으며, 시간이 지남에 따라 그 안정성은 현재 작동하는 것뿐만 아니라 시스템이 지원하는 워크로드와 함께 계속 발전하는지에 따라 달라집니다.</p>
<p>이러한 배경에서 이 글에서는 잠재적인 대안으로 <a href="https://github.com/rustfs/rustfs">RustFS를</a> 살펴봅니다. RustFS는 메모리 안전성과 최신 시스템 설계를 강조하는 Rust 기반의 S3 호환 객체 스토리지 시스템입니다. 아직 실험 단계에 있으며 이 논의는 프로덕션 권장 사항이 아닙니다.</p>
<h2 id="The-Milvus-Architecture-and-Where-the-Object-Storage-Component-Sits" class="common-anchor-header">Milvus 아키텍처와 객체 스토리지 구성 요소의 위치<button data-href="#The-Milvus-Architecture-and-Where-the-Object-Storage-Component-Sits" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.6은 완전히 분리된 스토리지-컴퓨팅 아키텍처를 채택하고 있습니다. 이 모델에서 스토리지 계층은 세 개의 독립적인 구성 요소로 구성되어 있으며, 각 구성 요소는 고유한 역할을 수행합니다.</p>
<p>Etcd는 메타데이터를 저장하고, Pulsar 또는 Kafka는 스트리밍 로그를 처리하며, 객체 스토리지(일반적으로 MinIO 또는 S3 호환 서비스)는 벡터 데이터와 인덱스 파일에 대한 내구성 있는 지속성을 제공합니다. 스토리지와 컴퓨팅이 분리되어 있기 때문에 Milvus는 안정적인 공유 스토리지 백엔드에 의존하면서 컴퓨팅 노드를 독립적으로 확장할 수 있습니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/milvus_architecture_fe897f1098.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="The-Role-of-Object-Storage-in-Milvus" class="common-anchor-header">Milvus에서 오브젝트 스토리지의 역할</h3><p>오브젝트 스토리지는 Milvus의 내구성 있는 스토리지 계층입니다. 원시 벡터 데이터는 binlog로 유지되며, HNSW 및 IVF_FLAT과 같은 인덱스 구조도 여기에 저장됩니다.</p>
<p>이 설계는 컴퓨팅 노드를 상태 비저장형으로 만듭니다. 쿼리 노드는 데이터를 로컬에 저장하지 않고 필요에 따라 오브젝트 스토리지에서 세그먼트와 인덱스를 로드합니다. 따라서 노드는 스토리지 계층에서 데이터 리밸런싱 없이도 자유롭게 확장 또는 축소하고, 장애로부터 신속하게 복구하며, 클러스터 전체에서 동적 로드 밸런싱을 지원할 수 있습니다.</p>
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
<h3 id="Why-Milvus-Uses-the-S3-API" class="common-anchor-header">Milvus가 S3 API를 사용하는 이유</h3><p>Milvus는 사용자 정의 스토리지 프로토콜을 정의하는 대신 S3 API를 오브젝트 스토리지 인터페이스로 사용합니다. S3는 사실상 오브젝트 스토리지의 표준으로 자리 잡았으며, AWS S3, Alibaba Cloud OSS, Tencent Cloud COS와 같은 주요 클라우드 제공업체에서 기본적으로 지원하며, MinIO, Ceph RGW, SeaweedFS, RustFS 같은 오픈 소스 시스템과도 완벽하게 호환됩니다.</p>
<p>S3 API로 표준화함으로써 Milvus는 각 스토리지 백엔드에 대해 별도의 통합을 유지하는 대신 성숙하고 충분한 테스트를 거친 Go SDK에 의존할 수 있습니다. 이러한 추상화는 또한 사용자에게 배포 유연성을 제공합니다: 로컬 개발에는 MinIO, 프로덕션 환경에는 클라우드 오브젝트 스토리지, 프라이빗 환경에는 Ceph 및 RustFS를 사용할 수 있습니다. S3 호환 엔드포인트만 있으면 Milvus는 그 밑에 어떤 스토리지 시스템이 사용되는지 알 필요도 없고 신경 쓸 필요도 없습니다.</p>
<pre><code translate="no"><span class="hljs-comment"># Milvus configuration file milvus.yaml</span>
minio:
 address: localhost
 port: <span class="hljs-number">9000</span>
 accessKeyID: minioadmin
 secretAccessKey: minioadmin
 useSSL: false
 bucketName: milvus-bucket
<button class="copy-code-btn"></button></code></pre>
<h2 id="Evaluating-RustFS-as-an-S3-Compatible-Object-Storage-Backend-for-Milvus" class="common-anchor-header">Milvus를 위한 S3 호환 오브젝트 스토리지 백엔드로서 RustFS 평가하기<button data-href="#Evaluating-RustFS-as-an-S3-Compatible-Object-Storage-Backend-for-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Project-Overview" class="common-anchor-header">프로젝트 개요</h3><p>RustFS는 Rust로 작성된 분산형 객체 스토리지 시스템입니다. 현재 알파 단계(버전 1.0.0-alpha.68)에 있으며, MinIO의 운영 단순성과 메모리 안전 및 성능에 대한 Rust의 강점을 결합하는 것을 목표로 합니다. 자세한 내용은 <a href="https://github.com/rustfs/rustfs">GitHub에서</a> 확인할 수 있습니다.</p>
<p>RustFS는 아직 활발히 개발 중이며 분산 모드는 아직 공식적으로 출시되지 않았습니다. 따라서 현 단계에서는 프로덕션 또는 미션 크리티컬 워크로드에는 RustFS를 권장하지 않습니다.</p>
<h3 id="Architecture-Design" class="common-anchor-header">아키텍처 설계</h3><p>RustFS는 개념적으로 MinIO와 유사한 설계를 따릅니다. HTTP 서버는 S3 호환 API를 노출하고, Object Manager는 오브젝트 메타데이터를 처리하며, Storage Engine은 데이터 블록 관리를 담당합니다. 스토리지 계층에서 RustFS는 XFS 또는 ext4와 같은 표준 파일 시스템을 사용합니다.</p>
<p>계획된 분산 모드의 경우, RustFS는 메타데이터 조정을 위해 etcd를 사용하며, 여러 RustFS 노드가 클러스터를 형성합니다. 이러한 설계는 일반적인 오브젝트 스토리지 아키텍처와 밀접하게 연계되어 있어 MinIO를 경험한 사용자에게 친숙하게 다가갈 수 있습니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/architecture_design_852f73b2c8.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Compatibility-with-Milvus" class="common-anchor-header">Milvus와의 호환성</h3><p>대체 오브젝트 스토리지 백엔드로서 RustFS를 고려하기 전에 Milvus의 핵심 스토리지 요구 사항을 충족하는지 평가해야 합니다.</p>
<table>
<thead>
<tr><th style="text-align:center"><strong>Milvus 요구 사항</strong></th><th style="text-align:center"><strong>S3 API</strong></th><th style="text-align:center"><strong>RustFS 지원</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center">벡터 데이터 지속성</td><td style="text-align:center"><code translate="no">PutObject</code>, <code translate="no">GetObject</code></td><td style="text-align:center">✅ 완전 지원</td></tr>
<tr><td style="text-align:center">인덱스 파일 관리</td><td style="text-align:center"><code translate="no">ListObjects</code>, <code translate="no">DeleteObject</code></td><td style="text-align:center">✅ 완벽하게 지원</td></tr>
<tr><td style="text-align:center">세그먼트 병합 작업</td><td style="text-align:center">멀티파트 업로드</td><td style="text-align:center">✅ 완벽 지원</td></tr>
<tr><td style="text-align:center">일관성 보장</td><td style="text-align:center">강력한 읽기 후 쓰기</td><td style="text-align:center">✅ 강력한 일관성(단일 노드)</td></tr>
</tbody>
</table>
<p>이 평가에 따르면, RustFS의 현재 S3 API 구현은 Milvus의 기본 기능 요구 사항을 충족합니다. 따라서 비프로덕션 환경에서의 실제 테스트에 적합합니다.</p>
<h2 id="Hands-On-Replacing-MinIO-with-RustFS-in-Milvus" class="common-anchor-header">실습: Milvus에서 MinIO를 RustFS로 교체하기<button data-href="#Hands-On-Replacing-MinIO-with-RustFS-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>이 실습의 목표는 기본 MinIO 오브젝트 스토리지 서비스를 대체하고 RustFS를 오브젝트 스토리지 백엔드로 사용하여 Milvus 2.6.7을 배포하는 것입니다.</p>
<h3 id="Prerequisites" class="common-anchor-header">전제 조건</h3><ol>
<li><p>Docker 및 Docker Compose가 설치되어 있고(버전 20.10 이상), 시스템이 이미지를 가져오고 컨테이너를 정상적으로 실행할 수 있어야 합니다.</p></li>
<li><p><code translate="no">/volume/data/</code> (또는 사용자 지정 경로)와 같은 로컬 디렉터리를 개체 데이터 스토리지에 사용할 수 있습니다.</p></li>
<li><p>호스트 포트 9000은 외부 액세스를 위해 열려 있거나 그에 따라 대체 포트가 구성됩니다.</p></li>
<li><p>RustFS 컨테이너는 루트가 아닌 사용자(<code translate="no">rustfs</code>)로 실행됩니다. 호스트 데이터 디렉터리의 소유권이 UID 10001에 있는지 확인합니다.</p></li>
</ol>
<h3 id="Step-1-Create-the-Data-Directory-and-Set-Permissions" class="common-anchor-header">1단계: 데이터 디렉터리 생성 및 권한 설정하기</h3><pre><code translate="no"><span class="hljs-comment"># Create the project directory</span>
<span class="hljs-built_in">mkdir</span> -p milvus-rustfs &amp;&amp; <span class="hljs-built_in">cd</span> milvus-rustfs
<span class="hljs-comment"># Create the data directory</span>
<span class="hljs-built_in">mkdir</span> -p volumes/{rustfs, etcd, milvus}
<span class="hljs-comment"># Update permissions for the RustFS directory</span>
<span class="hljs-built_in">sudo</span> <span class="hljs-built_in">chown</span> -R 10001:10001 volumes/rustfs
<button class="copy-code-btn"></button></code></pre>
<p><strong>공식 Docker 컴포즈 파일 다운로드</strong></p>
<pre><code translate="no">wget https://github.com/milvus-io/milvus/releases/download/v2.6.7/milvus-standalone-docker-compose.yml -O docker-compose.yml
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-2-Modify-the-Object-Storage-Service" class="common-anchor-header">2단계: 오브젝트 스토리지 서비스 수정</h3><p><strong>RustFS 서비스 정의</strong></p>
<p>참고: 액세스 키와 비밀 키가 Milvus 서비스에 구성된 자격 증명과 일치하는지 확인하세요.</p>
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
<p><strong>구성 완료</strong></p>
<p>참고: Milvus의 스토리지 구성은 현재 MinIO 스타일의 기본값을 가정하며 사용자 지정 액세스 키 또는 비밀 키 값을 아직 허용하지 않습니다. RustFS를 대체로 사용하는 경우 Milvus에서 예상하는 것과 동일한 기본 자격 증명을 사용해야 합니다.</p>
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
<p><strong>서비스 시작</strong></p>
<pre><code translate="no">docker-compose -f docker-compose.yaml up -d
<button class="copy-code-btn"></button></code></pre>
<p><strong>서비스 상태 확인</strong></p>
<pre><code translate="no">docker-compose ps -a
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/code_d64dc88a96.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>RustFS 웹 UI에 액세스</strong></p>
<p>브라우저에서 RustFS 웹 인터페이스 <a href="http://localhost:9001">(http://localhost:9001)</a>를 엽니다 <a href="http://localhost:9001">.</a></p>
<p>기본 자격 증명(사용자 이름과 비밀번호는 모두 minioadmin)을 사용하여 로그인합니다.</p>
<p><strong>Milvus 서비스 테스트</strong></p>
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
<p>def milvus_load_bench(dim=768, rows=1_000_000, batch=5000): collection = Collection(...) # 삽입 테스트 t0 = time.perf_counter() for i in range(0, rows, batch): collection.insert([rng.random((batch, dim), dtype=np.float32).tolist()]) insert_time = time.perf_counter() - t0 # 색인 구축 collection.flush() 컬렉션입니다.create_index(field_name=&quot;embedding&quot;, index_params={&quot;index_type&quot;: &quot;HNSW&quot;, ...}) # 로드 테스트(콜드 스타트 + 두 번의 웜 스타트) 컬렉션.release() load_times = [] for i in range(3): if i &gt; 0: collection.release(); time.sleep(2) collection.load() load_times.append(...) # 쿼리 테스트 search_times = [] for _ in range(3): collection.search(queries, limit=10, ...)</p>
<pre><code translate="no">
**Test Command**

<button class="copy-code-btn"></button></code></pre>
<custom-h1>RustFS: --port 19530 --s3-endpoint http://localhost:9000 --s3-bucket bench</custom-h1><custom-h1>MinIO: --port 19531 --s3-endpoint http://localhost:9001 --s3-bucket a-bucket</custom-h1><p>python bench.py milvus-load-bench --dim 768 --rows 1000000 --batch 5000 <br>
-index-type HNSW --repeat-load 3 --release-before-load --do-search --drop-after</p>
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
