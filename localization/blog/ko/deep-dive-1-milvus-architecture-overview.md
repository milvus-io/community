---
id: deep-dive-1-milvus-architecture-overview.md
title: 확장 가능한 유사도 검색을 위한 벡터 데이터베이스 구축
author: Xiaofan Luan
date: 2022-03-14T00:00:00.000Z
desc: 가장 인기 있는 오픈소스 벡터 데이터베이스 구축의 사고 과정과 설계 원칙을 자세히 살펴보는 블로그 시리즈의 첫 번째 글입니다.
cover: assets.zilliz.com/20220705_102717_dd4124dee3.png
tag: Engineering
tags: 'Data science, Database, Technology, Artificial Intelligence, Vector Management'
canonicalUrl: 'https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md'
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/20220705_102717_dd4124dee3.png" alt="Cover image" class="doc-image" id="cover-image" />
   </span> <span class="img-wrapper"> <span>표지 이미지</span> </span></p>
<blockquote>
<p>이 글은 샤오판 루안이 작성하고 안젤라 니와 클레어 유가 번역했습니다.</p>
</blockquote>
<p><a href="https://mitsloan.mit.edu/ideas-made-to-matter/tapping-power-unstructured-data">통계에</a> 따르면 전 세계 데이터의 약 80~90%가 비정형 데이터라고 합니다. 인터넷의 급속한 성장에 힘입어 향후 몇 년 동안 비정형 데이터의 폭발적인 증가가 예상됩니다. 따라서 기업들은 이러한 종류의 데이터를 더 잘 처리하고 이해하는 데 도움이 되는 강력한 데이터베이스가 절실히 필요합니다. 하지만 데이터베이스를 개발하는 것은 말처럼 쉬운 일이 아닙니다. 이 글에서는 확장 가능한 유사도 검색을 위한 오픈 소스 클라우드 네이티브 벡터 데이터베이스인 Milvus를 구축하는 사고 과정과 설계 원칙을 공유하고자 합니다. 이 문서에서는 Milvus 아키텍처에 대해서도 자세히 설명합니다.</p>
<p>이동하기:</p>
<ul>
<li><a href="#Unstructured-data-requires-a-complete-basic-software-stack">비정형 데이터에는 완벽한 기본 소프트웨어 스택이 필요합니다</a>.<ul>
<li><a href="#Vectors-and-scalars">벡터와 스칼라</a></li>
<li><a href="#From-vector-search-engine-to-vector-database">벡터 검색 엔진에서 벡터 데이터베이스로</a></li>
<li><a href="#A-cloud-native-first-approach">클라우드 네이티브 우선 접근 방식</a></li>
</ul></li>
<li><a href="#The-design-principles-of-Milvus-20">Milvus 2.0의 설계 원칙</a><ul>
<li><a href="#Log-as-data">데이터로서의 로그</a></li>
<li><a href="#Duality-of-table-and-log">테이블과 로그의 이중성</a></li>
<li><a href="#Log-persistency">로그 지속성</a></li>
</ul></li>
<li><a href="#Building-a-vector-database-for-scalable-similarity-search">확장 가능한 유사도 검색을 위한 벡터 데이터베이스 구축하기</a><ul>
<li><a href="#Standalone-and-cluster">독립형 및 클러스터</a></li>
<li><a href="#A-bare-bones-skeleton-of-the-Milvus-architecture">Milvus 아키텍처의 기본 골격</a></li>
<li><a href="#Data-Model">데이터 모델</a></li>
</ul></li>
</ul>
<h2 id="Unstructured-data-requires-a-complete-basic-software-stack" class="common-anchor-header">비정형 데이터에는 완벽한 기본 소프트웨어 스택이 필요합니다.<button data-href="#Unstructured-data-requires-a-complete-basic-software-stack" class="anchor-icon" translate="no">
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
    </button></h2><p>인터넷이 성장하고 발전함에 따라 이메일, 논문, IoT 센서 데이터, Facebook 사진, 단백질 구조 등을 포함한 비정형 데이터가 점점 더 보편화되었습니다. 컴퓨터가 비정형 데이터를 이해하고 처리할 수 있도록 <a href="https://zilliz.com/learn/embedding-generation">임베딩 기술을</a> 사용해 벡터로 변환합니다.</p>
<p>Milvus는 이러한 벡터를 저장하고 색인화하며, 유사도 거리를 계산하여 두 벡터 간의 상관관계를 분석합니다. 두 임베딩 벡터가 매우 유사하다는 것은 원본 데이터 소스도 유사하다는 것을 의미합니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Frame_1_6_5e0ab80f2c.png" alt="The workflow of processing unstructured data." class="doc-image" id="the-workflow-of-processing-unstructured-data." />
   </span> <span class="img-wrapper"> <span>비정형 데이터를 처리하는 워크플로우입니다</span>. </span></p>
<h3 id="Vectors-and-scalars" class="common-anchor-header">벡터와 스칼라</h3><p>스칼라는 크기라는 하나의 측정값으로만 설명되는 양을 말합니다. 스칼라는 숫자로 표현할 수 있습니다. 예를 들어 자동차가 시속 80km/h의 속도로 달리고 있다고 가정해 보겠습니다. 여기서 속도(80km/h)는 스칼라입니다. 반면 벡터는 크기와 방향이라는 최소 두 가지 측정값으로 설명되는 양입니다. 자동차가 시속 80km/h의 속도로 서쪽을 향해 달리고 있다면 여기서 속도(서쪽 80km/h)는 벡터입니다. 아래 이미지는 일반적인 스칼라와 벡터의 예시입니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Frame_1_7_90a142ab5b.png" alt="Scalars vs. Vectors" class="doc-image" id="scalars-vs.-vectors" />
   </span> <span class="img-wrapper"> <span>스칼라 대 벡터</span> </span></p>
<p>대부분의 중요한 데이터에는 두 가지 이상의 속성이 있기 때문에 이러한 데이터를 벡터로 변환하면 더 잘 이해할 수 있습니다. 벡터 데이터를 조작하는 일반적인 방법 중 하나는 유클리드 거리, 내적 곱, 타니모토 거리, 해밍 거리 등과 같은 <a href="https://milvus.io/docs/v2.0.x/metric.md">메트릭을</a> 사용하여 벡터 간의 거리를 계산하는 것입니다. 거리가 가까울수록 벡터는 더 유사합니다. 방대한 벡터 데이터 세트를 효율적으로 쿼리하기 위해, 벡터 데이터에 인덱스를 구축하여 벡터 데이터를 정리할 수 있습니다. 데이터 세트가 색인된 후에는 쿼리가 입력 쿼리와 유사한 벡터를 포함할 가능성이 가장 높은 클러스터 또는 데이터의 하위 집합으로 라우팅될 수 있습니다.</p>
<p>인덱스에 대해 자세히 알아보려면 <a href="https://milvus.io/docs/v2.0.x/index.md">벡터 인덱스를</a> 참조하세요.</p>
<h3 id="From-vector-search-engine-to-vector-database" class="common-anchor-header">벡터 검색 엔진에서 벡터 데이터베이스로</h3><p>Milvus 2.0은 처음부터 검색 엔진으로서의 역할뿐만 아니라 더 중요한 것은 강력한 벡터 데이터베이스로서의 역할도 하도록 설계되었습니다.</p>
<p>여기서 그 차이를 이해하는 데 도움이 되는 한 가지 방법은 <a href="https://dev.mysql.com/doc/refman/5.7/en/innodb-introduction.html">InnoDB와</a> <a href="https://www.mysql.com/">MySQL</a> 또는 <a href="https://lucene.apache.org/">Lucene과</a> <a href="https://www.elastic.co/">Elasticsearch를</a> 비유하는 것입니다.</p>
<p>MySQL 및 Elasticsearch와 마찬가지로 Milvus도 검색 기능을 제공하고 검색 성능을 보장하는 데 중점을 둔 <a href="https://github.com/facebookresearch/faiss">Faiss</a>, <a href="https://github.com/nmslib/hnswlib">HNSW</a>, <a href="https://github.com/spotify/annoy">Annoy와</a> 같은 오픈 소스 라이브러리 위에 구축되었습니다. 하지만 다른 데이터베이스와 마찬가지로 벡터를 저장, 검색, 분석하고 CRUD 작업을 위한 표준 인터페이스도 제공하므로 Milvus를 단순히 Faiss 위에 있는 레이어로 평가절하하는 것은 부당합니다. 또한 Milvus는 다음과 같은 기능도 제공합니다:</p>
<ul>
<li>샤딩 및 파티셔닝</li>
<li>복제</li>
<li>재해 복구</li>
<li>로드 밸런스</li>
<li>쿼리 파서 또는 최적화 도구</li>
</ul>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/database_d912320ea7.png" alt="Vector database" class="doc-image" id="vector-database" />
   </span> <span class="img-wrapper"> <span>벡터 데이터베이스</span> </span></p>
<p>벡터 데이터베이스가 무엇인지에 대한 보다 포괄적인 이해는 <a href="https://zilliz.com/learn/what-is-vector-database">여기에서</a> 블로그를 참조하세요.</p>
<h3 id="A-cloud-native-first-approach" class="common-anchor-header">클라우드 네이티브 우선 접근 방식</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/image_2_be82d762db.png" alt="Could-native approach" class="doc-image" id="could-native-approach" />
   </span> <span class="img-wrapper"> <span>Could-네이티브 접근 방식</span> </span></p>
<h4 id="From-shared-nothing-to-shared-storage-then-to-shared-something" class="common-anchor-header">공유 없는 공유에서 공유 스토리지로, 그리고 공유 가능한 공유로</h4><p>기존 데이터베이스는 분산 시스템의 노드가 독립적이지만 네트워크로 연결되는 '아무것도 공유하지 않는' 아키텍처를 채택했습니다. 노드 간에 메모리나 스토리지를 공유하지 않았습니다. 하지만 <a href="https://docs.snowflake.com/en/user-guide/intro-key-concepts.html">Snowflake는</a> 컴퓨팅(쿼리 처리)과 스토리지(데이터베이스 저장)가 분리된 '공유 스토리지' 아키텍처를 도입하여 업계에 혁신을 일으켰습니다. 공유 스토리지 아키텍처를 통해 데이터베이스는 가용성, 확장성, 데이터 중복 감소를 달성할 수 있습니다. 스노우플레이크에서 영감을 받은 많은 회사들이 데이터 지속성을 위해 클라우드 기반 인프라를 활용하고 캐싱을 위해 로컬 스토리지를 사용하기 시작했습니다. 이러한 유형의 데이터베이스 아키텍처를 "공유형"이라고 하며 오늘날 대부분의 애플리케이션에서 주류 아키텍처가 되었습니다.</p>
<p>"공유된 무언가" 아키텍처와는 별도로, Milvus는 실행 엔진을 관리하고 읽기, 쓰기 및 기타 서비스를 마이크로서비스로 분리하기 위해 Kubernetes를 사용하여 각 구성 요소의 유연한 확장을 지원합니다.</p>
<h4 id="Database-as-a-service-DBaaS" class="common-anchor-header">서비스형 데이터베이스(DBaaS)</h4><p>많은 사용자가 일반적인 데이터베이스 기능에 관심을 가질 뿐만 아니라 보다 다양한 서비스를 갈망함에 따라 서비스로서의 데이터베이스는 핫 트렌드입니다. 즉, 기존의 CRUD 작업 외에도 데이터베이스 관리, 데이터 전송, 과금, 시각화 등과 같이 데이터베이스가 제공할 수 있는 서비스 유형을 강화해야 합니다.</p>
<h4 id="Synergy-with-the-broader-open-source-ecosystem" class="common-anchor-header">광범위한 오픈 소스 생태계와의 시너지 효과</h4><p>데이터베이스 개발의 또 다른 트렌드는 데이터베이스와 다른 클라우드 네이티브 인프라 간의 시너지를 활용하는 것입니다. Milvus의 경우, 일부 오픈 소스 시스템에 의존하고 있습니다. 예를 들어 Milvus는 메타데이터 저장을 위해 <a href="https://etcd.io/">etcd를</a> 사용합니다. 또한 마이크로서비스 아키텍처에서 사용되는 비동기 서비스 간 통신의 일종인 메시지 큐를 채택하여 증분 데이터를 내보내는 데 도움이 될 수 있습니다.</p>
<p>향후에는 <a href="https://spark.apache.org/">Spark나</a> <a href="https://www.tensorflow.org/">Tensorflow와</a> 같은 AI 인프라 위에 Milvus를 구축하고, 스트리밍 엔진과 통합하여 통합 스트림 및 배치 처리를 더 잘 지원하여 Milvus 사용자의 다양한 요구를 충족시킬 수 있기를 희망합니다.</p>
<h2 id="The-design-principles-of-Milvus-20" class="common-anchor-header">Milvus 2.0의 설계 원칙<button data-href="#The-design-principles-of-Milvus-20" class="anchor-icon" translate="no">
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
    </button></h2><p>차세대 클라우드 네이티브 벡터 데이터베이스인 Milvus 2.0은 다음 세 가지 원칙을 중심으로 구축되었습니다.</p>
<h3 id="Log-as-data" class="common-anchor-header">데이터로서의 로그</h3><p>데이터베이스의 로그는 데이터에 대한 모든 변경 사항을 연속적으로 기록합니다. 아래 그림과 같이 왼쪽에서 오른쪽으로 '이전 데이터'와 '새 데이터'가 있습니다. 그리고 로그는 시간 순서대로 기록됩니다. Milvus에는 전역적으로 고유하고 자동 증분되는 타임스탬프를 할당하는 글로벌 타이머 메커니즘이 있습니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Frame_1_8_6e40211f44.png" alt="Logs" class="doc-image" id="logs" />
   </span> <span class="img-wrapper"> <span>로그</span> </span></p>
<p>Milvus 2.0에서 로그 브로커는 시스템의 중추 역할을 합니다. 모든 데이터 삽입 및 업데이트 작업은 로그 브로커를 거쳐야 하며, 워커 노드는 로그를 구독하고 소비함으로써 CRUD 작업을 실행합니다.</p>
<h3 id="Duality-of-table-and-log" class="common-anchor-header">테이블과 로그의 이중성</h3><p>테이블과 로그는 모두 데이터이며, 서로 다른 두 가지 형태일 뿐입니다. 테이블은 제한이 있는 데이터인 반면, 로그는 제한이 없는 데이터입니다. 로그는 테이블로 변환할 수 있습니다. Milvus의 경우, TimeTick의 처리 창을 사용하여 로그를 집계합니다. 로그 순서에 따라 여러 개의 로그가 로그 스냅샷이라는 하나의 작은 파일로 집계됩니다. 그런 다음 이러한 로그 스냅샷을 결합하여 세그먼트를 형성하고 로드 밸런스를 위해 개별적으로 사용할 수 있습니다.</p>
<h3 id="Log-persistency" class="common-anchor-header">로그 지속성</h3><p>로그 지속성은 많은 데이터베이스가 직면하는 까다로운 문제 중 하나입니다. 분산 시스템의 로그 저장은 일반적으로 복제 알고리즘에 따라 달라집니다.</p>
<p><a href="https://aws.amazon.com/rds/aurora/">Aurora</a>, <a href="https://hbase.apache.org/">HBase</a>, <a href="https://www.cockroachlabs.com/">Cockroach DB</a>, <a href="https://en.pingcap.com/">TiDB와</a> 같은 데이터베이스와 달리 Milvus는 획기적인 접근 방식을 취하여 로그 저장 및 지속성을 위해 게시-구독(pub/sub) 시스템을 도입했습니다. 게시/구독 시스템은 <a href="https://kafka.apache.org/">Kafka나</a> <a href="https://pulsar.apache.org/">Pulsar의</a> 메시지 큐와 유사합니다. 시스템 내의 모든 노드가 로그를 소비할 수 있습니다. Milvus에서는 이러한 종류의 시스템을 로그 브로커라고 부릅니다. 로그 브로커 덕분에 로그가 서버에서 분리되어 Milvus 자체가 상태 저장소가 아니며 시스템 장애로부터 신속하게 복구할 수 있는 더 나은 위치에 있습니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/log_broker_cafe889835.png" alt="Log broker" class="doc-image" id="log-broker" />
   </span> <span class="img-wrapper"> <span>로그 브로커</span> </span></p>
<h2 id="Building-a-vector-database-for-scalable-similarity-search" class="common-anchor-header">확장 가능한 유사도 검색을 위한 벡터 데이터베이스 구축<button data-href="#Building-a-vector-database-for-scalable-similarity-search" class="anchor-icon" translate="no">
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
    </button></h2><p>Faiss, ANNOY, HNSW 등 널리 사용되는 벡터 검색 라이브러리를 기반으로 구축된 Milvus는 수백만, 수십억, 심지어 수조 개의 벡터가 포함된 고밀도 벡터 데이터 세트에서 유사도 검색을 위해 설계되었습니다.</p>
<h3 id="Standalone-and-cluster" class="common-anchor-header">독립형 및 클러스터</h3><p>Milvus는 독립형 또는 클러스터의 두 가지 배포 방법을 제공합니다. Milvus 독립형에서는 모든 노드가 함께 배포되므로 Milvus를 하나의 단일 프로세스로 볼 수 있습니다. 현재 Milvus 스탠드얼론은 데이터 지속성 및 메타데이터 저장을 위해 MinIO와 etcd에 의존하고 있습니다. 향후 릴리스에서는 이 두 가지 타사 종속성을 제거하여 Milvus 시스템의 단순성을 보장하고자 합니다. Milvus 클러스터에는 8개의 마이크로서비스 구성 요소와 3개의 타사 종속성이 포함되어 있습니다: MinIO, etcd, Pulsar. Pulsar는 로그 브로커 역할을 하며 로그 게시/서브 서비스를 제공합니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/standalone_and_cluster_7558f56e8c.png" alt="Standalone and cluster" class="doc-image" id="standalone-and-cluster" />
   </span> <span class="img-wrapper"> <span>독립형 및 클러스터</span> </span></p>
<h3 id="A-bare-bones-skeleton-of-the-Milvus-architecture" class="common-anchor-header">Milvus 아키텍처의 기본 골격</h3><p>Milvus는 데이터 흐름과 제어 흐름을 분리하고 확장성과 재해 복구 측면에서 독립적인 네 개의 계층으로 나뉩니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Milvus_architecture_b7743a4a7f.png" alt="Milvus architecture" class="doc-image" id="milvus-architecture" />
   </span> <span class="img-wrapper"> <span>Milvus 아키텍처</span> </span></p>
<h4 id="Access-layer" class="common-anchor-header">액세스 레이어</h4><p>액세스 레이어는 시스템의 얼굴 역할을 하며 클라이언트 연결의 엔드포인트를 외부에 노출합니다. 클라이언트 연결 처리, 정적 확인, 사용자 요청에 대한 기본 동적 검사, 요청 전달, 결과 수집 및 클라이언트 반환을 담당합니다. 프록시 자체는 상태 비저장형이며 로드 밸런싱 구성 요소(Nginx, Kubernetess Ingress, NodePort 및 LVS)를 통해 외부 세계에 통합 액세스 주소와 서비스를 제공합니다. Milvus는 프록시가 글로벌 집계 및 사후 처리 후 워커 노드에서 수집한 결과를 반환하는 MPP(대규모 병렬 처리) 아키텍처를 사용합니다.</p>
<h4 id="Coordinator-service" class="common-anchor-header">코디네이터 서비스</h4><p>코디네이터 서비스는 클러스터 토폴로지 노드 관리, 로드 밸런싱, 타임스탬프 생성, 데이터 선언 및 데이터 관리를 담당하는 시스템의 두뇌 역할을 합니다. 각 코디네이터 서비스의 기능에 대한 자세한 설명은 <a href="https://milvus.io/docs/v2.0.x/four_layers.md#Coordinator-service">Milvus 기술 문서를</a> 참조하세요.</p>
<h4 id="Worker-nodes" class="common-anchor-header">워커 노드</h4><p>작업자 또는 실행 노드는 시스템의 팔다리 역할을 하며, 코디네이터 서비스에서 발행한 명령과 프록시에서 시작한 데이터 조작 언어(DML) 명령을 실행합니다. Milvus의 워커 노드는 <a href="https://hadoop.apache.org/">Hadoop의</a> 데이터 노드 또는 HBase의 리전 서버와 유사합니다. 각 유형의 워커 노드는 코디 서비스에 해당합니다. 각 워커 노드의 기능에 대한 자세한 설명은 <a href="https://milvus.io/docs/v2.0.x/four_layers.md#Worker-nodes">Milvus 기술 문서를</a> 참조하세요.</p>
<h4 id="Storage" class="common-anchor-header">스토리지</h4><p>저장소는 데이터 지속성을 담당하는 Milvus의 초석입니다. 스토리지 계층은 세 부분으로 나뉩니다:</p>
<ul>
<li><strong>메타 저장소:</strong> 수집 스키마, 노드 상태, 메시지 소비 체크포인트 등과 같은 메타 데이터의 스냅샷 저장을 담당합니다. Milvus는 이러한 기능을 위해 etcd에 의존하며 서비스 등록 및 상태 확인도 Etcd가 담당합니다.</li>
<li><strong>로그 브로커:</strong> 재생을 지원하고 스트리밍 데이터 지속성, 안정적인 비동기 쿼리 실행, 이벤트 알림, 쿼리 결과 반환을 담당하는 퍼브/서브 시스템입니다. 노드가 다운타임 복구를 수행할 때 로그 브로커는 로그 브로커 재생을 통해 증분 데이터의 무결성을 보장합니다. Milvus 클러스터는 Pulsar를 로그 브로커로 사용하며, 독립형 모드에서는 RocksDB를 사용합니다. Kafka나 Pravega와 같은 스트리밍 스토리지 서비스도 로그 브로커로 사용할 수 있습니다.</li>
<li><strong>객체 스토리지:</strong> 로그의 스냅샷 파일, 스칼라/벡터 인덱스 파일, 중간 쿼리 처리 결과 등을 저장합니다. Milvus는 가벼운 오픈 소스 오브젝트 스토리지 서비스인 <a href="https://min.io/">MinIO뿐만</a> 아니라 <a href="https://aws.amazon.com/s3/">AWS S3와</a> <a href="https://azure.microsoft.com/en-us/services/storage/blobs/">Azure Blob도</a> 지원합니다. 객체 스토리지 서비스의 높은 액세스 지연 시간과 쿼리당 과금으로 인해, Milvus는 곧 메모리/SSD 기반 캐시 풀과 핫/콜드 데이터 분리를 지원하여 성능을 개선하고 비용을 절감할 수 있도록 할 예정입니다.</li>
</ul>
<h3 id="Data-Model" class="common-anchor-header">데이터 모델</h3><p>데이터 모델은 데이터베이스에서 데이터를 구성합니다. Milvus에서는 모든 데이터가 컬렉션, 샤드, 파티션, 세그먼트, 엔티티별로 구성됩니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Data_model_1_5d6bb43673.png" alt="Data model 1" class="doc-image" id="data-model-1" />
   </span> <span class="img-wrapper"> <span>데이터 모델 1</span> </span></p>
<h4 id="Collection" class="common-anchor-header">컬렉션</h4><p>Milvus의 컬렉션은 관계형 스토리지 시스템의 테이블에 비유할 수 있습니다. 컬렉션은 Milvus에서 가장 큰 데이터 단위입니다.</p>
<h4 id="Shard" class="common-anchor-header">샤드</h4><p>데이터를 쓸 때 클러스터의 병렬 컴퓨팅 성능을 최대한 활용하려면 Milvus의 컬렉션은 데이터 쓰기 작업을 여러 노드로 분산해야 합니다. 기본적으로 단일 컬렉션에는 두 개의 샤드가 포함됩니다. 데이터 세트 볼륨에 따라 컬렉션에 더 많은 샤드를 포함할 수 있습니다. Milvus는 샤딩에 마스터 키 해싱 방식을 사용합니다.</p>
<h4 id="Partition" class="common-anchor-header">파티션</h4><p>샤드에는 여러 개의 파티션도 있습니다. Milvus에서 파티션은 컬렉션에서 동일한 레이블로 표시된 데이터 집합을 의미합니다. 날짜, 성별, 사용자 연령 등으로 파티션을 나누는 것이 일반적인 파티션 방법입니다. 파티션을 생성하면 방대한 데이터를 파티션 태그별로 필터링할 수 있으므로 쿼리 프로세스에 도움이 될 수 있습니다.</p>
<p>이에 비해 샤딩은 데이터를 쓸 때 기능을 확장하는 반면, 파티셔닝은 데이터를 읽을 때 시스템 성능을 향상시키는 데 더 중점을 둡니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Data_model_2_044a443751.png" alt="Data model 2" class="doc-image" id="data-model-2" />
   </span> <span class="img-wrapper"> <span>데이터 모델 2</span> </span></p>
<h4 id="Segments" class="common-anchor-header">세그먼트</h4><p>각 파티션 내에는 여러 개의 작은 세그먼트가 있습니다. 세그먼트는 Milvus에서 시스템 스케줄링을 위한 가장 작은 단위입니다. 세그먼트에는 성장하는 세그먼트와 봉인된 세그먼트의 두 가지 유형이 있습니다. 성장하는 세그먼트는 쿼리 노드에 의해 구독됩니다. Milvus 사용자는 증가하는 세그먼트에 데이터를 계속 씁니다. 증가하는 세그먼트의 크기가 상한(기본적으로 512MB)에 도달하면, 시스템은 이 증가하는 세그먼트에 추가 데이터 쓰기를 허용하지 않으므로 이 세그먼트를 봉인합니다. 인덱스는 봉인된 세그먼트에 구축됩니다.</p>
<p>실시간으로 데이터에 액세스하기 위해 시스템은 증가하는 세그먼트와 봉인된 세그먼트 모두에서 데이터를 읽습니다.</p>
<h4 id="Entity" class="common-anchor-header">엔티티</h4><p>각 세그먼트에는 방대한 양의 엔티티가 포함되어 있습니다. Milvus의 엔티티는 기존 데이터베이스의 행에 해당합니다. 각 엔티티에는 고유한 기본 키 필드가 있으며, 이 필드는 자동으로 생성될 수도 있습니다. 또한 엔티티에는 타임스탬프(ts)와 Milvus의 핵심인 벡터 필드도 포함되어야 합니다.</p>
<h2 id="About-the-Deep-Dive-Series" class="common-anchor-header">심층 분석 시리즈 소개<button data-href="#About-the-Deep-Dive-Series" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.0의 <a href="https://milvus.io/blog/2022-1-25-annoucing-general-availability-of-milvus-2-0.md">공식</a> 출시와 함께 Milvus 아키텍처와 소스 코드에 대한 심층적인 해석을 제공하기 위해 Milvus 딥 다이브 블로그 시리즈를 기획했습니다. 이 블로그 시리즈에서 다루는 주제는 다음과 같습니다:</p>
<ul>
<li><a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md">Milvus 아키텍처 개요</a></li>
<li><a href="https://milvus.io/blog/deep-dive-2-milvus-sdk-and-api.md">API 및 Python SDK</a></li>
<li><a href="https://milvus.io/blog/deep-dive-3-data-processing.md">데이터 처리</a></li>
<li><a href="https://milvus.io/blog/deep-dive-4-data-insertion-and-data-persistence.md">데이터 관리</a></li>
<li><a href="https://milvus.io/blog/deep-dive-5-real-time-query.md">실시간 쿼리</a></li>
<li><a href="https://milvus.io/blog/deep-dive-7-query-expression.md">스칼라 실행 엔진</a></li>
<li><a href="https://milvus.io/blog/deep-dive-6-oss-qa.md">QA 시스템</a></li>
<li><a href="https://milvus.io/blog/deep-dive-8-knowhere.md">벡터 실행 엔진</a></li>
</ul>
