---
id: the-developers-guide-to-milvus-configuration.md
title: Milvus 설정에 대한 개발자 가이드
author: Jack Li
date: 2025-04-23T00:00:00.000Z
desc: >-
  집중 가이드를 통해 Milvus 구성을 간소화하세요. 벡터 데이터베이스 애플리케이션의 성능 향상을 위해 조정할 수 있는 주요 매개변수에 대해
  알아보세요.
cover: assets.zilliz.com/The_Developer_s_Guide_to_Milvus_Configuration_1519241756.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search'
meta_keywords: 'Milvus, configurations, performance, scalability, stability'
meta_title: The Developer’s Guide to Milvus Configuration
origin: 'https://milvus.io/blog/the-developers-guide-to-milvus-configuration.md'
---
<h2 id="Introduction" class="common-anchor-header">소개<button data-href="#Introduction" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus를 사용하는 개발자는 500개 이상의 파라미터가 포함된 복잡한 <code translate="no">milvus.yaml</code> 설정 파일을 접해본 적이 있을 것입니다. 벡터 데이터베이스 성능을 최적화하는 것이 목표라면 이러한 복잡성을 처리하는 것이 어려울 수 있습니다.</p>
<p>좋은 소식은 모든 매개변수를 이해할 필요는 없다는 것입니다. 이 가이드는 불필요한 요소를 제거하고 실제로 성능에 영향을 미치는 중요한 설정에 집중하여 특정 사용 사례에 맞게 조정해야 할 값을 정확하게 강조합니다.</p>
<p>초고속 쿼리가 필요한 추천 시스템을 구축하든, 비용 제약이 있는 벡터 검색 애플리케이션을 최적화하든, 실용적이고 검증된 값으로 어떤 매개변수를 수정해야 하는지 정확히 보여드리겠습니다. 이 가이드가 끝나면 실제 배포 시나리오를 기반으로 최고의 성능을 위해 Milvus 구성을 조정하는 방법을 알게 될 것입니다.</p>
<h2 id="Configuration-Categories" class="common-anchor-header">구성 카테고리<button data-href="#Configuration-Categories" class="anchor-icon" translate="no">
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
    </button></h2><p>특정 매개 변수에 대해 자세히 알아보기 전에 구성 파일의 구조를 분석해 보겠습니다. <code translate="no">milvus.yaml</code> 에서 작업할 때는 세 가지 파라미터 카테고리를 다루게 됩니다:</p>
<ul>
<li><p><strong>종속성 컴포넌트 구성</strong>: Milvus가 연결되는 외부 서비스 (<code translate="no">etcd</code>, <code translate="no">minio</code>, <code translate="no">mq</code>) - 클러스터 설정 및 데이터 지속성에 중요합니다.</p></li>
<li><p><strong>내부 구성 요소 구성</strong>: Milvus의 내부 아키텍처 (<code translate="no">proxy</code>, <code translate="no">queryNode</code>, 등 ) - 성능 튜닝에 중요</p></li>
<li><p><strong>기능 구성</strong>: 보안, 로깅 및 리소스 제한 - 프로덕션 배포에 중요합니다.</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Milvus_Configurations_f9a7e45dce.PNG" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Milvus-Dependency-Component-Configurations" class="common-anchor-header">Milvus 종속성 구성 요소 구성<button data-href="#Milvus-Dependency-Component-Configurations" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus가 의존하는 외부 서비스부터 시작하겠습니다. 이러한 구성은 개발에서 프로덕션으로 이동할 때 특히 중요합니다.</p>
<h3 id="etcd-Metadata-Store" class="common-anchor-header"><code translate="no">etcd</code>: 메타데이터 저장소</h3><p>Milvus는 메타데이터 지속성 및 서비스 조정을 위해 <code translate="no">etcd</code> 에 의존합니다. 다음 매개변수가 중요합니다:</p>
<ul>
<li><p><code translate="no">Etcd.endpoints</code>: etcd 클러스터의 주소를 지정합니다. 기본적으로 Milvus는 번들 인스턴스를 실행하지만 엔터프라이즈 환경에서는 가용성과 운영 제어를 개선하기 위해 관리되는 <code translate="no">etcd</code> 서비스에 연결하는 것이 좋습니다.</p></li>
<li><p><code translate="no">etcd.rootPath</code>: Milvus 관련 데이터를 etcd에 저장하기 위한 키 접두사를 정의합니다. 동일한 etcd 백엔드에서 여러 Milvus 클러스터를 운영하는 경우 서로 다른 루트 경로를 사용하면 메타데이터를 깔끔하게 격리할 수 있습니다.</p></li>
<li><p><code translate="no">etcd.auth</code>: 인증 자격 증명을 제어합니다. Milvus는 기본적으로 etcd 인증을 활성화하지 않지만, 관리되는 etcd 인스턴스에 자격 증명이 필요한 경우 여기에서 자격 증명을 지정해야 합니다.</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/etcd_in_milvusyaml_dc600c6974.PNG" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="minio-Object-Storage" class="common-anchor-header"><code translate="no">minio</code>: 오브젝트 스토리지</h3><p>이름과 달리 이 섹션은 모든 S3 호환 개체 스토리지 서비스 클라이언트를 관리합니다. <code translate="no">cloudProvider</code> 설정을 통해 AWS S3, GCS, Aliyun OSS와 같은 공급자를 지원합니다.</p>
<p>다음 네 가지 주요 설정에 주의하세요:</p>
<ul>
<li><p><code translate="no">minio.address / minio.port</code>: 이를 사용하여 오브젝트 스토리지 서비스의 엔드포인트를 지정하세요.</p></li>
<li><p><code translate="no">minio.bucketName</code>: 별도의 버킷(또는 논리적 접두사)을 할당하여 여러 Milvus 클러스터를 실행할 때 데이터 충돌을 방지합니다.</p></li>
<li><p><code translate="no">minio.rootPath</code>: 데이터 격리를 위해 버킷 내 네임스페이싱을 활성화합니다.</p></li>
<li><p><code translate="no">minio.cloudProvider</code>: OSS 백엔드를 식별합니다. 전체 호환성 목록은 <a href="https://milvus.io/docs/product_faq.md#Where-does-Milvus-store-data">Milvus 설명서를</a> 참조하세요.</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/minio_in_milvusyaml_faa11c9fcd.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="mq-Message-Queue" class="common-anchor-header"><code translate="no">mq</code>: 메시지 큐</h3><p>Milvus는 내부 이벤트 전파를 위해 메시지 큐를 사용합니다(기본값은 Pulsar) 또는 Kafka). 다음 세 가지 매개 변수에 주의하세요.</p>
<ol>
<li><p><code translate="no">pulsar.address/pulsar.port</code>: 외부 Pulsar 클러스터를 사용하려면 이 값을 설정합니다.</p></li>
<li><p><code translate="no">pulsar.tenant</code>: 테넌트 이름을 정의합니다. 여러 Milvus 클러스터가 Pulsar 인스턴스를 공유하는 경우, 이렇게 하면 채널 분리가 깔끔하게 이루어집니다.</p></li>
<li><p><code translate="no">msgChannel.chanNamePrefix.cluster</code>: Pulsar의 테넌트 모델을 우회하려면 채널 접두사를 조정하여 충돌을 방지하세요.</p></li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/mq_in_milvusyaml1_2214739c84.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/mq_in_milvusyaml2_a44ff64936.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Milvus는 메시지 큐로 Kafka도 지원합니다. 대신 Kafka를 사용하려면 Pulsar 관련 설정을 주석 처리하고 Kafka 구성 블록의 주석 처리를 해제하세요.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/mq_in_milvusyaml3_d41f44f77a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Milvus-Internal-Component-Configurations" class="common-anchor-header">Milvus 내부 구성 요소 구성<button data-href="#Milvus-Internal-Component-Configurations" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="rootCoord-Metadata-+-Timestamps" class="common-anchor-header"><code translate="no">rootCoord</code>: 메타데이터 + 타임스탬프</h3><p><code translate="no">rootCoord</code> 노드는 메타데이터 변경(DDL/DCL) 및 타임스탬프 관리를 처리합니다.</p>
<ol>
<li><p><code translate="no">rootCoord.maxPartitionNum</code>： 컬렉션당 파티션 수에 대한 상한을 설정합니다. 하드 제한은 1024이지만, 이 매개변수는 주로 안전장치 역할을 합니다. 멀티테넌트 시스템의 경우, 파티션을 격리 경계로 사용하지 말고 대신 수백만 개의 논리적 테넌트로 확장되는 테넌트 키 전략을 구현하세요.</p></li>
<li><p><code translate="no">rootCoord.enableActiveStandby</code>대기 노드를 활성화하여 고가용성을 구현합니다. Milvus 코디네이터 노드는 기본적으로 수평적으로 확장되지 않으므로 이는 매우 중요합니다.</p></li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/root_Coord_in_milvusyaml_9c2417dbaf.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="proxy-API-Gateway-+-Request-Router" class="common-anchor-header"><code translate="no">proxy</code>: API 게이트웨이 + 요청 라우터</h3><p><code translate="no">proxy</code> 은 클라이언트 대면 요청, 요청 유효성 검사 및 결과 집계를 처리합니다.</p>
<ul>
<li><p><code translate="no">proxy.maxFieldNum</code>: 컬렉션당 필드 수(스칼라 + 벡터)를 제한합니다. 스키마 복잡성을 최소화하고 I/O 오버헤드를 줄이려면 64개 미만으로 유지하세요.</p></li>
<li><p><code translate="no">proxy.maxVectorFieldNum</code>: 컬렉션의 벡터 필드 수를 제어합니다. Milvus는 멀티모달 검색을 지원하지만 실제로는 10개 벡터 필드가 안전한 상한선입니다.</p></li>
<li><p><code translate="no">proxy.maxShardNum</code>수집 샤드 수를 정의합니다. 경험상</p>
<ul>
<li><p>&lt; 2억 개 미만의 레코드 → 샤드 1개</p></li>
<li><p>200-400M 레코드 → 2샤드</p></li>
<li><p>그 이상 선형적으로 확장</p></li>
</ul></li>
<li><p><code translate="no">proxy.accesslog</code>: 활성화하면 자세한 요청 정보(사용자, IP, 엔드포인트, SDK)를 기록합니다. 감사 및 디버깅에 유용합니다.</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/proxy_in_milvusyaml_897b33c759.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="queryNode-Query-Execution" class="common-anchor-header"><code translate="no">queryNode</code>: 쿼리 실행</h3><p>벡터 검색 실행 및 세그먼트 로딩을 처리합니다. 다음 파라미터에 주의하세요.</p>
<ul>
<li><code translate="no">queryNode.mmap</code>: 스칼라 필드 및 세그먼트 로드를 위한 메모리 매핑 I/O를 토글합니다. <code translate="no">mmap</code> 를 활성화하면 메모리 사용량을 줄이는 데 도움이 되지만, 디스크 I/O가 병목 현상이 발생하면 지연 시간이 저하될 수 있습니다.</li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/query_Node_in_milvusyaml_36e1bf378a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="dataCoord-Segment-+-Index-Management" class="common-anchor-header"><code translate="no">dataCoord</code>: 세그먼트 + 인덱스 관리</h3><p>이 매개변수는 데이터 세분화, 인덱싱, 압축 및 가비지 수집(GC)을 제어합니다. 주요 구성 매개변수는 다음과 같습니다:</p>
<ol>
<li><p><code translate="no">dataCoord.segment.maxSize</code>: 인메모리 데이터 세그먼트의 최대 크기를 지정합니다. 세그먼트가 클수록 일반적으로 시스템의 총 세그먼트 수가 줄어들어 인덱싱 및 검색 오버헤드가 줄어들어 쿼리 성능이 향상될 수 있습니다. 예를 들어, 128GB RAM으로 <code translate="no">queryNode</code> 인스턴스를 실행하는 일부 사용자는 이 설정을 1GB에서 8GB로 늘린 결과 쿼리 성능이 약 4배 빨라졌다고 보고했습니다.</p></li>
<li><p><code translate="no">dataCoord.segment.diskSegmentMaxSize</code>: 위와 유사하게 이 매개변수는 <a href="https://milvus.io/docs/disk_index.md#On-disk-Index">디스크 인덱스</a> (diskann 인덱스)의 최대 크기를 구체적으로 제어합니다.</p></li>
<li><p><code translate="no">dataCoord.segment.sealProportion</code>: 증가하는 세그먼트가 봉인되는 시점(즉, 최종화 및 인덱싱되는 시점)을 결정합니다. 세그먼트는 <code translate="no">maxSize * sealProportion</code> 에 도달하면 봉인됩니다. 기본적으로 <code translate="no">maxSize = 1024MB</code> 및 <code translate="no">sealProportion = 0.12</code> 을 사용하면 세그먼트는 약 123MB에서 봉인됩니다.</p></li>
</ol>
<ul>
<li><p>값이 낮을수록(예: 0.12) 봉인이 더 빨리 트리거되어 인덱스 생성이 빨라지므로 업데이트가 빈번한 워크로드에 유용합니다.</p></li>
<li><p>값이 높을수록(예: 0.3~0.5) 밀봉이 지연되어 인덱싱 오버헤드가 줄어들어 오프라인 또는 일괄 수집 시나리오에 더 적합합니다.</p></li>
</ul>
<ol start="4">
<li><p><code translate="no">dataCoord.segment.expansionRate</code>:  압축 중 허용되는 팽창 계수를 설정합니다. Milvus는 압축 중 최대 허용 세그먼트 크기를 <code translate="no">maxSize * expansionRate</code>.</p></li>
<li><p><code translate="no">dataCoord.gc.dropTolerance</code>: 세그먼트가 압축되거나 컬렉션이 삭제된 후에도 Milvus는 기본 데이터를 즉시 삭제하지 않습니다. 대신 삭제할 세그먼트를 표시하고 가비지 수집(GC) 주기가 완료될 때까지 기다립니다. 이 매개변수는 이 지연 기간을 제어합니다.</p></li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/data_Coord_in_milvusyaml1_100d98a081.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/data_Coord_in_milvusyaml2_7fa8c5f2c0.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Other-Functional-Configurations" class="common-anchor-header">기타 기능 구성<button data-href="#Other-Functional-Configurations" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="log-Observability-and-Diagnostics" class="common-anchor-header"><code translate="no">log</code>: 관찰 가능성 및 진단</h3><p>강력한 로깅은 모든 분산 시스템의 초석이며, Milvus도 예외는 아닙니다. 잘 구성된 로깅 설정은 문제 발생 시 디버깅에 도움이 될 뿐만 아니라 시간이 지남에 따라 시스템 상태와 동작에 대한 가시성을 향상시킵니다.</p>
<p>프로덕션 배포의 경우, 분석 및 알림을 간소화하기 위해 Milvus 로그를 중앙 집중식 로깅 및 모니터링 도구(예: <a href="https://milvus.io/docs/configure_grafana_loki.md#Deploy-Loki">Loki</a> )와 통합하는 것이 좋습니다. 주요 설정은 다음과 같습니다:</p>
<ol>
<li><p><code translate="no">log.level</code>: 로그 출력의 상세도를 제어합니다. 프로덕션 환경의 경우, 시스템에 부담을 주지 않으면서 필수적인 런타임 세부 정보를 캡처하려면 <code translate="no">info</code> 수준을 유지하세요. 개발 또는 문제 해결 중에는 <code translate="no">debug</code> 로 전환하여 내부 운영에 대한 보다 세분화된 인사이트를 얻을 수 있습니다. ⚠️ 프로덕션 환경에서 <code translate="no">debug</code> 레벨을 사용하면 대량의 로그를 생성하므로 확인하지 않으면 디스크 공간을 빠르게 소모하고 I/O 성능이 저하될 수 있으므로 주의하세요.</p></li>
<li><p><code translate="no">log.file</code>: 기본적으로 Milvus는 사이드카 또는 노드 에이전트를 통해 로그를 수집하는 컨테이너화된 환경에 적합한 표준 출력(stdout)에 로그를 기록합니다. 대신 파일 기반 로깅을 사용하려면 구성할 수 있습니다:</p></li>
</ol>
<ul>
<li><p>로테이션 전 최대 파일 크기</p></li>
<li><p>파일 보존 기간</p></li>
<li><p>보관할 백업 로그 파일 수</p></li>
</ul>
<p>이 설정은 스탯아웃 로그 전송을 사용할 수 없는 베어메탈 또는 온프레미스 환경에서 유용합니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/log_in_milvusyaml_248ead1264.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="security-Authentication-and-Access-Control" class="common-anchor-header"><code translate="no">security</code>: 인증 및 액세스 제어</h3><p>Milvus는 <a href="https://milvus.io/docs/authenticate.md?tab=docker">사용자 인증과</a> <a href="https://milvus.io/docs/rbac.md">역할 기반 액세스 제어(RBAC)를</a> 지원하며, 두 가지 모두 <code translate="no">common</code> 모듈에서 구성할 수 있습니다. 이러한 설정은 멀티테넌트 환경 또는 외부 클라이언트에 노출된 모든 배포를 보호하는 데 필수적입니다.</p>
<p>주요 매개변수는 다음과 같습니다:</p>
<ol>
<li><p><code translate="no">common.security.authorizationEnabled</code>: 이 토글은 인증 및 RBAC를 사용 또는 사용하지 않도록 설정합니다. 기본적으로 꺼져 있으므로 신원 확인 없이 모든 작업이 허용됩니다. 보안 액세스 제어를 적용하려면 이 매개변수를 <code translate="no">true</code> 로 설정하세요.</p></li>
<li><p><code translate="no">common.security.defaultRootPassword</code>: 인증이 활성화된 경우 이 설정은 기본 제공 <code translate="no">root</code> 사용자의 초기 비밀번호를 정의합니다.</p></li>
</ol>
<p>프로덕션 환경의 보안 취약성을 방지하려면 인증을 사용 설정한 후 즉시 기본 비밀번호를 변경해야 합니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/security_in_milvusyaml_a8d0187b5a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="quotaAndLimits-Rate-Limiting-and-Write-Control" class="common-anchor-header"><code translate="no">quotaAndLimits</code>: 속도 제한 및 쓰기 제어</h3><p><code translate="no">milvus.yaml</code> 의 <code translate="no">quotaAndLimits</code> 섹션은 시스템에서 데이터가 흐르는 방식을 제어하는 데 중요한 역할을 합니다. 삽입, 삭제, 플러시, 쿼리와 같은 작업에 대한 속도 제한을 관리하여 워크로드가 많은 상황에서도 클러스터 안정성을 보장하고 쓰기 증폭 또는 과도한 압축으로 인한 성능 저하를 방지합니다.</p>
<p>주요 매개변수는 다음과 같습니다:</p>
<p><code translate="no">quotaAndLimits.flushRate.collection</code>: Milvus가 컬렉션에서 데이터를 플러시하는 빈도를 제어합니다.</p>
<ul>
<li><p><strong>기본값은</strong> <code translate="no">0.1</code> 로 설정되어 있으며, 이는 시스템이 10초마다 한 번의 플러시를 허용한다는 의미입니다.</p></li>
<li><p>플러시 작업은 증가하는 세그먼트를 봉인하여 메시지 큐에서 오브젝트 스토리지로 유지합니다.</p></li>
<li><p>플러시를 너무 자주 하면 봉인된 작은 세그먼트가 많이 생성되어 압축 오버헤드가 증가하고 쿼리 성능이 저하될 수 있습니다.</p></li>
</ul>
<p>💡 모범 사례: 대부분의 경우 Milvus가 자동으로 처리하도록 하세요. 증가하는 세그먼트는 <code translate="no">maxSize * sealProportion</code> 에 도달하면 봉인되며, 봉인된 세그먼트는 10분마다 플러시됩니다. 수동 플러시는 더 이상 데이터가 들어오지 않는다고 판단되는 대량 삽입 후에만 권장됩니다.</p>
<p>또한 <strong>데이터 가시성은</strong> 플러시 타이밍이 아니라 쿼리의 <em>일관성 수준에</em> 따라 결정되므로, 플러시한다고 해서 새 데이터를 즉시 쿼리할 수 있는 것은 아니라는 점에 유의하세요.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/quota_And_Limits1_be185e571f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><code translate="no">quotaAndLimits.upsertRate</code>/<code translate="no">quotaAndLimits.deleteRate</code>: 이 매개변수는 업서트 및 삭제 작업에 허용되는 최대 속도를 정의합니다.</p>
<ul>
<li><p>Milvus는 LSM-Tree 스토리지 아키텍처를 사용하므로 잦은 업데이트와 삭제는 압축을 유발합니다. 이는 리소스 집약적이며 신중하게 관리하지 않으면 전체 처리량을 감소시킬 수 있습니다.</p></li>
<li><p>압축 파이프라인에 과부하가 걸리지 않도록 <code translate="no">upsertRate</code> 및 <code translate="no">deleteRate</code> 모두 <strong>0.5MB/s로</strong> 제한하는 것이 좋습니다.</p></li>
</ul>
<p>🚀 대용량 데이터 세트를 빠르게 업데이트해야 하나요? 컬렉션 별칭 전략을 사용하세요:</p>
<ul>
<li><p>새 컬렉션에 새 데이터를 삽입합니다.</p></li>
<li><p>업데이트가 완료되면 별칭을 새 컬렉션으로 다시 가리킵니다. 이렇게 하면 제자리 업데이트의 압축 페널티를 피하고 즉시 전환할 수 있습니다.</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/quota_And_Limits2_32c8640190.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Real-World-Configuration-Examples" class="common-anchor-header">실제 구성 예<button data-href="#Real-World-Configuration-Examples" class="anchor-icon" translate="no">
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
    </button></h2><p>두 가지 일반적인 배포 시나리오를 통해 Milvus 구성 설정을 다양한 운영 목표에 맞게 조정하는 방법을 설명해 보겠습니다.</p>
<h3 id="⚡-Example-1-High-Performance-Configuration" class="common-anchor-header">예 1: 고성능 구성</h3><p>추천 엔진, 시맨틱 검색 플랫폼, 실시간 리스크 스코어링 등 쿼리 지연 시간이 미션 크리티컬한 경우 밀리초 단위가 중요합니다. 이러한 사용 사례에서는 일반적으로 <strong>HNSW</strong> 또는 <strong>DISKANN과</strong> 같은 그래프 기반 인덱스에 의존하고 메모리 사용량과 세그먼트 수명 주기 동작을 모두 최적화합니다.</p>
<p>주요 튜닝 전략</p>
<ul>
<li><p><code translate="no">dataCoord.segment.maxSize</code> 및 <code translate="no">dataCoord.segment.diskSegmentMaxSize</code> 증가: 사용 가능한 RAM에 따라 이 값을 4GB 또는 8GB로 늘립니다. 세그먼트가 클수록 인덱스 빌드 횟수가 줄어들고 세그먼트 팬아웃을 최소화하여 쿼리 처리량이 향상됩니다. 그러나 세그먼트가 클수록 쿼리 시 더 많은 메모리를 소비하므로 <code translate="no">indexNode</code> 및 <code translate="no">queryNode</code> 인스턴스에 충분한 여유 공간이 있는지 확인하세요.</p></li>
<li><p><code translate="no">dataCoord.segment.sealProportion</code> 및 <code translate="no">dataCoord.segment.expansionRate</code> 낮추기: 봉인하기 전에 세그먼트 크기를 200MB 정도로 설정합니다. 이렇게 하면 세그먼트 메모리 사용량을 예측할 수 있고 위임자(분산 검색을 조정하는 쿼리노드 리더)의 부담을 줄일 수 있습니다.</p></li>
</ul>
<p>경험 법칙: 메모리가 풍부하고 지연 시간이 우선시되는 경우에는 더 적은 수의 더 큰 세그먼트를 선호합니다. 인덱스 새로 고침이 중요한 경우에는 봉인 임계값을 보수적으로 설정하세요.</p>
<h3 id="💰-Example-2-Cost-Optimized-Configuration" class="common-anchor-header">💰 예 2: 비용 최적화된 구성</h3><p>모델 훈련 파이프라인, 낮은 QPS 내부 도구, 롱테일 이미지 검색에서 흔히 볼 수 있는 원시 성능보다 비용 효율성을 우선시하는 경우, 리콜이나 지연 시간을 절충하여 인프라 수요를 크게 줄일 수 있습니다.</p>
<p>권장 전략</p>
<ul>
<li><p><strong>인덱스 정량화를 사용하세요:</strong> <code translate="no">SCANN</code> , <code translate="no">IVF_SQ8</code> 또는 <code translate="no">HNSW_PQ/PRQ/SQ</code> (Milvus 2.5에 도입됨)와 같은 인덱스 유형은 인덱스 크기와 메모리 사용 공간을 크게 줄여줍니다. 이러한 방식은 규모나 예산보다 정확도가 덜 중요한 워크로드에 이상적입니다.</p></li>
<li><p><strong>디스크 백업 인덱싱 전략을 채택합니다:</strong> 인덱스 유형을 <code translate="no">DISKANN</code> 로 설정하여 순수 디스크 기반 검색을 활성화합니다. 선택적 메모리 오프로딩을 위해 <code translate="no">mmap</code> <strong>을 활성화합니다</strong>.</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/query_Node_in_milvusyaml_36e1bf378a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>메모리를 극도로 절약하려면 다음 항목에 대해 <code translate="no">mmap</code> 을 활성화합니다: <code translate="no">vectorField</code>, <code translate="no">vectorIndex</code>, <code translate="no">scalarField</code>, <code translate="no">scalarIndex</code> 에 대해 를 활성화합니다. 이렇게 하면 대량의 데이터가 가상 메모리로 오프로드되어 상주 RAM 사용량이 크게 줄어듭니다.</p>
<p>⚠️ 주의: 스칼라 필터링이 쿼리 워크로드의 주요 부분인 경우 <code translate="no">vectorIndex</code> 및 <code translate="no">scalarIndex</code> 에 대해 <code translate="no">mmap</code> 을 비활성화하는 것이 좋습니다. 메모리 매핑은 I/O가 제한된 환경에서 스칼라 쿼리 성능을 저하시킬 수 있습니다.</p>
<h4 id="Disk-usage-tip" class="common-anchor-header">디스크 사용 팁</h4><ul>
<li><p><code translate="no">mmap</code> 으로 구축된 HNSW 인덱스는 총 데이터 크기를 최대 <strong>1.8배까지</strong> 확장할 수 있습니다.</p></li>
<li><p>100GB의 물리적 디스크는 인덱스 오버헤드와 캐싱을 고려할 때 현실적으로 약 50GB의 유효 데이터만 수용할 수 있습니다.</p></li>
<li><p><code translate="no">mmap</code> 로 작업할 때는 항상 추가 스토리지를 프로비저닝하세요. 특히 원본 벡터를 로컬에 캐시하는 경우에는 더욱 그렇습니다.</p></li>
</ul>
<h2 id="Conclusion" class="common-anchor-header">결론<button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus를 조정하는 것은 완벽한 수치를 쫓는 것이 아니라 워크로드의 실제 동작을 중심으로 시스템을 구성하는 것입니다. 가장 영향력 있는 최적화는 Milvus가 I/O, 세그먼트 수명 주기, 인덱싱을 처리하는 방식을 이해하는 데서 비롯되는 경우가 많습니다. 이 경로들은 잘못된 구성이 가장 큰 피해를 입히는 곳이며, 신중한 튜닝이 가장 큰 수익을 가져다주는 곳이기도 합니다.</p>
<p>Milvus를 처음 사용하는 경우, 지금까지 설명한 구성 매개변수로 성능 및 안정성 요구 사항의 80~90%를 충족할 수 있습니다. 거기서부터 시작하세요. 어느 정도 직관이 생겼다면 전체 사양( <code translate="no">milvus.yaml</code> )과 공식 문서를 자세히 살펴보면 배포를 기능적인 수준에서 탁월한 수준으로 끌어올릴 수 있는 세분화된 제어를 발견할 수 있습니다.</p>
<p>올바른 구성을 갖추면 지연 시간이 짧은 서비스, 비용 효율적인 스토리지, 가장 많은 분석 워크로드 등 운영 우선순위에 맞는 확장 가능한 고성능 벡터 검색 시스템을 구축할 준비가 완료됩니다.</p>
