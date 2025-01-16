---
id: mishards-distributed-vector-search-milvus.md
title: 분산 아키텍처 개요
author: milvus
date: 2020-03-17T21:36:16.974Z
desc: 확장하는 방법
cover: assets.zilliz.com/tim_j_ots0_EO_Yu_Gt_U_unsplash_14f939b344.jpg
tag: Engineering
canonicalUrl: 'https://zilliz.com/blog/mishards-distributed-vector-search-milvus'
---
<custom-h1>Mishards - Milvus의 분산 벡터 검색</custom-h1><p>Milvus는 대규모 벡터에 대한 효율적인 유사도 검색 및 분석을 목표로 합니다. 독립형 Milvus 인스턴스는 10억 개 규모의 벡터에 대한 벡터 검색을 쉽게 처리할 수 있습니다. 하지만 100억, 1000억 또는 그 이상의 데이터 세트의 경우 Milvus 클러스터가 필요합니다. 이 클러스터는 상위 애플리케이션을 위한 독립형 인스턴스로 사용할 수 있으며, 대규모 데이터에 대한 짧은 지연 시간, 높은 동시성이라는 비즈니스 요구 사항을 충족할 수 있습니다. Milvus 클러스터는 요청을 재전송하고, 읽기와 쓰기를 분리하며, 수평적으로 확장하고, 동적으로 확장할 수 있으므로 제한 없이 확장할 수 있는 Milvus 인스턴스를 제공합니다. 미샤드는 Milvus를 위한 분산 솔루션입니다.</p>
<p>이 글에서는 Mishards 아키텍처의 구성 요소에 대해 간략하게 소개합니다. 보다 자세한 내용은 다음 글에서 소개할 예정입니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_milvus_cluster_mishards_daf78a0a91.png" alt="1-milvus-cluster-mishards.png" class="doc-image" id="1-milvus-cluster-mishards.png" />
   </span> <span class="img-wrapper"> <span>1-milvus-cluster-mishards.png</span> </span></p>
<h2 id="Distributed-architecture-overview" class="common-anchor-header">분산 아키텍처 개요<button data-href="#Distributed-architecture-overview" class="anchor-icon" translate="no">
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
    </button></h2><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_distributed_architecture_overview_f059fe8c90.png" alt="2-distributed-architecture-overview.png" class="doc-image" id="2-distributed-architecture-overview.png" />
   </span> <span class="img-wrapper"> <span>2-distributed-architecture-overview.png</span> </span></p>
<h2 id="Service-tracing" class="common-anchor-header">서비스 추적<button data-href="#Service-tracing" class="anchor-icon" translate="no">
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
    </button></h2><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_service_tracing_milvus_38559f7fd7.png" alt="3-service-tracing-milvus.png" class="doc-image" id="3-service-tracing-milvus.png" />
   </span> <span class="img-wrapper"> <span>3-service-tracing-milvus.png</span> </span></p>
<h2 id="Primary-service-components" class="common-anchor-header">기본 서비스 구성 요소<button data-href="#Primary-service-components" class="anchor-icon" translate="no">
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
<li>ZooKeeper, etcd, Consul과 같은 서비스 검색 프레임워크.</li>
<li>로드 밸런서(예: Nginx, HAProxy, 인그레스 컨트롤러).</li>
<li>미샤드 노드: 상태 비저장, 확장 가능.</li>
<li>쓰기 전용 Milvus 노드: 단일 노드이며 확장할 수 없습니다. 단일 장애 지점을 피하려면 이 노드에 고가용성 솔루션을 사용해야 합니다.</li>
<li>읽기 전용 Milvus 노드: 스테이트풀 노드이며 확장 가능.</li>
<li>공유 스토리지 서비스: 모든 Milvus 노드는 공유 스토리지 서비스를 사용하여 NAS 또는 NFS와 같은 데이터를 공유합니다.</li>
<li>메타데이터 서비스: 모든 Milvus 노드는 이 서비스를 사용하여 메타데이터를 공유합니다. 현재 MySQL만 지원됩니다. 이 서비스를 사용하려면 MySQL 고가용성 솔루션이 필요합니다.</li>
</ul>
<h2 id="Scalable-components" class="common-anchor-header">확장 가능한 구성 요소<button data-href="#Scalable-components" class="anchor-icon" translate="no">
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
<li>미샤드</li>
<li>읽기 전용 Milvus 노드</li>
</ul>
<h2 id="Components-introduction" class="common-anchor-header">컴포넌트 소개<button data-href="#Components-introduction" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>미샤즈 노드</strong></p>
<p>미샤드는 업스트림 요청을 분할하고 하위 요청을 하위 서비스로 라우팅하는 역할을 담당합니다. 결과는 요약되어 업스트림으로 반환됩니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/4_mishards_nodes_3fbe7d255d.jpg" alt="4-mishards-nodes.jpg" class="doc-image" id="4-mishards-nodes.jpg" />
   </span> <span class="img-wrapper"> <span>4-mishards-nodes.jpg</span> </span></p>
<p>위 차트에서 볼 수 있듯이, 미샤드는 TopK 검색 요청을 수락한 후 먼저 요청을 하위 요청으로 나누고 하위 요청을 다운스트림 서비스로 보냅니다. 모든 하위 응답이 수집되면 하위 응답이 병합되어 업스트림으로 반환됩니다.</p>
<p>미샤드는 스테이트리스 서비스이기 때문에 데이터를 저장하거나 복잡한 계산에 참여하지 않습니다. 따라서 노드의 구성 요구 사항이 높지 않으며 컴퓨팅 파워는 주로 하위 결과를 병합하는 데 사용됩니다. 따라서 높은 동시성을 위해 미샤드 노드 수를 늘릴 수 있습니다.</p>
<h2 id="Milvus-nodes" class="common-anchor-header">밀버스 노드<button data-href="#Milvus-nodes" class="anchor-icon" translate="no">
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
    </button></h2><p>밀버스 노드는 CRUD 관련 핵심 작업을 담당하기 때문에 상대적으로 높은 구성 요구 사항을 가지고 있습니다. 첫째, 너무 많은 디스크 IO 작업을 피하기 위해 메모리 크기가 충분히 커야 합니다. 둘째, CPU 구성도 성능에 영향을 미칠 수 있습니다. 클러스터 크기가 커질수록 시스템 처리량을 늘리려면 더 많은 Milvus 노드가 필요합니다.</p>
<h3 id="Read-only-nodes-and-writable-nodes" class="common-anchor-header">읽기 전용 노드와 쓰기 가능 노드</h3><ul>
<li>Milvus의 핵심 작업은 벡터 삽입과 검색입니다. 검색은 CPU 및 GPU 구성에 대한 요구 사항이 매우 높은 반면, 삽입이나 다른 작업은 상대적으로 요구 사항이 낮습니다. 검색을 실행하는 노드와 다른 연산을 실행하는 노드를 분리하면 보다 경제적으로 배포할 수 있습니다.</li>
<li>서비스 품질 측면에서 노드가 검색 작업을 수행하면 관련 하드웨어가 최대 부하로 실행되어 다른 작업의 서비스 품질을 보장할 수 없습니다. 따라서 두 가지 노드 유형이 사용됩니다. 검색 요청은 읽기 전용 노드에서 처리하고 다른 요청은 쓰기 가능한 노드에서 처리합니다.</li>
</ul>
<h3 id="Only-one-writable-node-is-allowed" class="common-anchor-header">쓰기 가능한 노드는 하나만 허용됩니다.</h3><ul>
<li><p>현재 Milvus는 쓰기 가능한 여러 인스턴스에 대한 데이터 공유를 지원하지 않습니다.</p></li>
<li><p>배포 시 쓰기 가능한 노드의 단일 장애 지점을 고려해야 합니다. 쓰기 가능한 노드를 위한 고가용성 솔루션을 준비해야 합니다.</p></li>
</ul>
<h3 id="Read-only-node-scalability" class="common-anchor-header">읽기 전용 노드 확장성</h3><p>데이터 크기가 매우 크거나 지연 시간 요구 사항이 매우 높은 경우 읽기 전용 노드를 스테이트풀 노드로 수평 확장할 수 있습니다. 호스트가 4개 있고 각 호스트의 구성이 다음과 같다고 가정합니다: CPU 코어: 16, GPU: 1, 메모리: 64GB. 다음 차트는 스테이트풀 노드를 수평 확장할 때의 클러스터를 보여줍니다. 컴퓨팅 성능과 메모리는 모두 선형적으로 확장됩니다. 데이터는 8개의 샤드로 분할되며 각 노드는 2개의 샤드에서 요청을 처리합니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/5_read_only_node_scalability_milvus_be3ee6e0a7.png" alt="5-read-only-node-scalability-milvus.png" class="doc-image" id="5-read-only-node-scalability-milvus.png" />
   </span> <span class="img-wrapper"> <span>5-read-only-node-scalability-milvus.png</span> </span></p>
<p>일부 샤드의 요청 수가 많을 경우, 이러한 샤드에 상태 비저장 읽기 전용 노드를 배포하여 처리량을 늘릴 수 있습니다. 위의 호스트를 예로 들어보겠습니다. 호스트가 서버리스 클러스터로 결합되면 컴퓨팅 성능이 선형적으로 증가합니다. 처리할 데이터가 증가하지 않기 때문에 동일한 데이터 샤드에 대한 처리 능력도 선형적으로 증가합니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/6_read_only_node_scalability_milvus_2_2cb98b9aa8.png" alt="6-read-only-node-scalability-milvus-2.png" class="doc-image" id="6-read-only-node-scalability-milvus-2.png" />
   </span> <span class="img-wrapper"> <span>6-read-only-node-scalability-milvus-2.png</span> </span></p>
<h3 id="Metadata-service" class="common-anchor-header">메타데이터 서비스</h3><p>키워드: MySQL</p>
<p>Milvus 메타데이터에 대한 자세한 내용은 메타데이터를 보는 방법을 참조하세요. 분산 시스템에서 Milvus 쓰기 가능 노드는 메타데이터를 생성하는 유일한 노드입니다. 미샤드 노드, Milvus 쓰기 가능 노드, Milvus 읽기 전용 노드는 모두 메타데이터의 소비자입니다. 현재 Milvus는 메타데이터의 스토리지 백엔드로 MySQL과 SQLite만 지원합니다. 분산 시스템에서는 가용성이 높은 MySQL로만 서비스를 배포할 수 있습니다.</p>
<h3 id="Service-discovery" class="common-anchor-header">서비스 검색</h3><p>키워드: 아파치 주키퍼, etcd, 컨설턴트, 쿠버네티스</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/7_service_discovery_054a977c6e.png" alt="7-service-discovery.png" class="doc-image" id="7-service-discovery.png" />
   </span> <span class="img-wrapper"> <span>7-service-discovery.png</span> </span></p>
<p>서비스 검색은 모든 Milvus 노드에 대한 정보를 제공합니다. Milvus 노드는 온라인 상태가 되면 정보를 등록하고 오프라인 상태가 되면 로그아웃합니다. 또한 Milvus 노드는 주기적으로 서비스 상태를 확인하여 비정상 노드를 탐지할 수 있습니다.</p>
<p>서비스 검색에는 etcd, Consul, ZooKeeper 등 많은 프레임워크가 포함되어 있습니다. Mishards는 서비스 검색 인터페이스를 정의하고 플러그인을 통해 확장할 수 있는 가능성을 제공합니다. 현재 Mishards는 두 가지 종류의 플러그인을 제공하며, 이는 Kubernetes 클러스터와 정적 구성에 해당합니다. 이러한 플러그인의 구현에 따라 자체 서비스 검색을 사용자 정의할 수 있습니다. 인터페이스는 임시적이며 재설계가 필요합니다. 자체 플러그인 작성에 대한 자세한 내용은 다음 글에서 자세히 설명할 예정입니다.</p>
<h3 id="Load-balancing-and-service-sharding" class="common-anchor-header">로드 밸런싱 및 서비스 샤딩</h3><p>키워드: Nginx, HAProxy, 쿠버네티스</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/7_load_balancing_and_service_sharding_f91891c6c1.png" alt="7-load-balancing-and-service-sharding.png" class="doc-image" id="7-load-balancing-and-service-sharding.png" />
   </span> <span class="img-wrapper"> <span>7-로드 밸런싱 및 서비스 샤딩.png</span> </span></p>
<p>서비스 검색과 로드 밸런싱은 함께 사용됩니다. 로드 밸런싱은 폴링, 해싱 또는 일관된 해싱으로 구성할 수 있습니다.</p>
<p>로드 밸런서는 사용자 요청을 미샤드 노드로 재전송하는 역할을 담당합니다.</p>
<p>각 미샤즈 노드는 서비스 디스커버리 센터를 통해 모든 다운스트림 밀버스 노드의 정보를 수집합니다. 모든 관련 메타데이터는 메타데이터 서비스를 통해 획득할 수 있습니다. 미샤드는 이러한 리소스를 소비하여 샤딩을 구현합니다. 미샤드는 라우팅 전략과 관련된 인터페이스를 정의하고 플러그인을 통해 확장 기능을 제공합니다. 현재 Mishards는 가장 낮은 세그먼트 레벨을 기반으로 일관된 해싱 전략을 제공합니다. 차트에서 볼 수 있듯이, s1부터 s10까지 10개의 세그먼트가 있습니다. 세그먼트 기반의 일관된 해싱 전략에 따라, 미샤즈는 s1, 24, s6, s9와 관련된 요청을 Milvus 1 노드로, s2, s3, s5는 Milvus 2 노드로, s7, s8, s10은 Milvus 3 노드로 라우팅합니다.</p>
<p>비즈니스 요구 사항에 따라 기본 일관된 해싱 라우팅 플러그인을 따라 라우팅을 사용자 지정할 수 있습니다.</p>
<h3 id="Tracing" class="common-anchor-header">추적</h3><p>키워드: 오픈트레이싱, 예거, 집킨</p>
<p>분산 시스템의 복잡성을 고려할 때, 요청은 여러 내부 서비스 호출로 전송됩니다. 문제를 정확히 파악하려면 내부 서비스 호출 체인을 추적해야 합니다. 복잡성이 증가함에 따라 사용 가능한 추적 시스템의 이점은 자명합니다. 저희는 CNCF OpenTracing 표준을 선택했습니다. OpenTracing은 개발자가 추적 시스템을 편리하게 구현할 수 있도록 플랫폼과 벤더에 독립적인 API를 제공합니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/8_tracing_demo_milvus_fd385f0aba.png" alt="8-tracing-demo-milvus.png" class="doc-image" id="8-tracing-demo-milvus.png" />
   </span> <span class="img-wrapper"> <span>8-tracing-demo-milvus.png</span> </span></p>
<p>이전 차트는 검색 호출 중 추적의 예시입니다. 검색은 <code translate="no">get_routing</code>, <code translate="no">do_search</code>, <code translate="no">do_merge</code> 를 연속적으로 호출합니다. <code translate="no">do_search</code> 는 <code translate="no">search_127.0.0.1</code> 도 호출합니다.</p>
<p>전체 추적 레코드는 다음과 같은 트리를 형성합니다:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/8_search_traceid_milvus_35040d75bc.png" alt="8-search-traceid-milvus.png" class="doc-image" id="8-search-traceid-milvus.png" />
   </span> <span class="img-wrapper"> <span>8-search-traceid-milvus.png</span> </span></p>
<p>다음 차트는 각 노드의 요청/응답 정보 및 태그의 예를 보여줍니다:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/request_response_info_tags_node_milvus_e169a31cb1.png" alt="request-response-info-tags-node-milvus.png" class="doc-image" id="request-response-info-tags-node-milvus.png" />
   </span> <span class="img-wrapper"> <span>요청-응답-정보-태그-노드-milvus.png</span> </span></p>
<p>OpenTracing이 Milvus에 통합되었습니다. 자세한 내용은 다음 글에서 다룰 예정입니다.</p>
<h3 id="Monitoring-and-alerting" class="common-anchor-header">모니터링 및 알림</h3><p>키워드: 프로메테우스, 그라파나</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/10_monitor_alert_milvus_3ae8910af6.jpg" alt="10-monitor-alert-milvus.jpg" class="doc-image" id="10-monitor-alert-milvus.jpg" />
   </span> <span class="img-wrapper"> <span>10-monitor-alert-milvus.jpg</span> </span></p>
<h2 id="Summary" class="common-anchor-header">요약<button data-href="#Summary" class="anchor-icon" translate="no">
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
    </button></h2><p>미샤즈는 서비스 미들웨어로서 서비스 검색, 라우팅 요청, 결과 병합, 추적 기능을 통합합니다. 플러그인 기반의 확장 기능도 제공합니다. 현재 미샤드를 기반으로 하는 분산 솔루션은 다음과 같은 단점이 있습니다:</p>
<ul>
<li>미샤드는 프록시를 중간 계층으로 사용하며 지연 시간이 발생합니다.</li>
<li>Milvus 쓰기 가능한 노드는 단일 지점 서비스입니다.</li>
<li>가용성이 높은 MySQL 서비스에 의존합니다. -샤드가 여러 개 있고 단일 샤드에 여러 개의 복사본이 있는 경우 배포가 복잡합니다.</li>
<li>메타데이터에 대한 액세스와 같은 캐시 계층이 부족합니다.</li>
</ul>
<p>다음 버전에서는 이러한 알려진 문제를 수정하여 미샤드를 프로덕션 환경에 보다 편리하게 적용할 수 있도록 할 예정입니다.</p>
