---
id: we-replaced-kafka-pulsar-with-a-woodpecker-for-milvus.md
title: 밀버스에서 카프카/펄서를 딱따구리로 대체한 이유 - 이렇게 되었습니다.
author: James Luan
date: 2025-05-15T00:00:00.000Z
desc: >-
  운영 복잡성과 비용을 낮추기 위해 Milvus의 Kafka와 Pulsar를 대체하기 위해 클라우드 네이티브 WAL 시스템인
  Woodpecker를 구축했습니다.
cover: >-
  assets.zilliz.com/We_Replaced_Kafka_Pulsar_with_a_Woodpecker_for_Milvus_Here_s_What_Happened_77e8de27a9.png
tag: Engineering
recommend: true
publishToMedium: true
tags: 'Milvus, vector database, vector search, AI Agents, LLM'
meta_keywords: >-
  Replace Kafka, replace Pulsar, messaging queues, Write-Ahead Logging (WAL),
  Milvus vector database
meta_title: |
  We Replaced Kafka/Pulsar with a Woodpecker for Milvus
origin: >-
  https://milvus.io/blog/we-replaced-kafka-pulsar-with-a-woodpecker-for-milvus.md
---
<p><strong>요약:</strong> Milvus 2.6에서 Kafka와 Pulsar를 대체하기 위해 클라우드 네이티브 WAL(Write-Ahead Logging) 시스템인 Woodpecker를 구축했습니다. 그 결과는? Milvus 벡터 데이터베이스의 운영 간소화, 성능 향상, 비용 절감.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/We_Replaced_Kafka_Pulsar_with_a_Woodpecker_for_Milvus_Here_s_What_Happened_77e8de27a9.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="The-Starting-Point-When-Message-Queues-No-Longer-Fit" class="common-anchor-header">시작점: 메시지 큐가 더 이상 적합하지 않을 때<button data-href="#The-Starting-Point-When-Message-Queues-No-Longer-Fit" class="anchor-icon" translate="no">
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
    </button></h2><p>저희는 카프카와 펄서를 좋아하고 사용했습니다. 더 이상 작동하지 않을 때까지는 말이죠. 선도적인 오픈 소스 벡터 데이터베이스인 Milvus가 발전함에 따라 이러한 강력한 메시지 큐가 더 이상 확장성 요구 사항을 충족하지 못한다는 사실을 알게 되었습니다. 그래서 과감한 결정을 내렸습니다. Milvus 2.6에서 스트리밍 백본을 다시 작성하고 자체 WAL인 <strong>Woodpecker를</strong> 구현했습니다.</p>
<p>언뜻 직관적이지 않은 것처럼 보일 수 있는 이러한 변경을 단행한 이유를 설명해 드리겠습니다.</p>
<h2 id="Cloud-Native-From-Day-One" class="common-anchor-header">첫날부터 클라우드 네이티브<button data-href="#Cloud-Native-From-Day-One" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus는 처음부터 클라우드 네이티브 벡터 데이터베이스였습니다. 탄력적인 확장과 빠른 장애 복구를 위해 Kubernetes를 활용하고, 데이터 지속성을 위해 Amazon S3 및 MinIO와 같은 객체 스토리지 솔루션을 사용합니다.</p>
<p>이러한 클라우드 우선 접근 방식은 엄청난 이점을 제공하지만 몇 가지 문제점도 있습니다:</p>
<ul>
<li><p>S3와 같은 클라우드 오브젝트 스토리지 서비스는 처리량과 가용성에 있어 사실상 무제한의 기능을 제공하지만 지연 시간이 100ms를 초과하는 경우가 많습니다.</p></li>
<li><p>이러한 서비스의 가격 모델(액세스 패턴 및 빈도에 기반)은 실시간 데이터베이스 운영에 예상치 못한 비용을 추가할 수 있습니다.</p></li>
<li><p>클라우드 네이티브 특성과 실시간 벡터 검색의 요구 사항 간의 균형을 맞추려면 상당한 아키텍처 문제가 발생합니다.</p></li>
</ul>
<h2 id="The-Shared-Log-Architecture-Our-Foundation" class="common-anchor-header">공유 로그 아키텍처: 기반<button data-href="#The-Shared-Log-Architecture-Our-Foundation" class="anchor-icon" translate="no">
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
    </button></h2><p>클라우드 네이티브 환경에서 스트리밍 시스템을 구축하는 것은 훨씬 더 큰 도전 과제이기 때문에 많은 벡터 검색 시스템은 배치 처리로 제한됩니다. 이와는 대조적으로, Milvus는 실시간 데이터 최신성을 우선시하며 파일 시스템의 하드 드라이브라고 할 수 있는 공유 로그 아키텍처를 구현합니다.</p>
<p>이 공유 로그 아키텍처는 합의 프로토콜과 핵심 데이터베이스 기능을 분리하는 중요한 기반을 제공합니다. 이러한 접근 방식을 채택함으로써 Milvus는 복잡한 합의 프로토콜을 직접 관리할 필요가 없어져 탁월한 벡터 검색 기능을 제공하는 데 집중할 수 있게 되었습니다.</p>
<p>이러한 아키텍처 패턴은 저희뿐만이 아닙니다. AWS Aurora, Azure Socrates, Neon과 같은 데이터베이스도 모두 유사한 설계를 활용하고 있습니다. <strong>그러나 오픈 소스 생태계에는 이 접근 방식의 분명한 장점에도 불구하고 지연 시간이 짧고 확장 가능하며 비용 효율적인 분산 쓰기 로그(WAL) 구현이 부족하다는 점에서 상당한 격차가 남아 있습니다.</strong></p>
<p>Bookie와 같은 기존 솔루션은 무거운 클라이언트 설계와 Golang 및 C++용 프로덕션 지원 SDK의 부재로 인해 우리의 요구에 부적합한 것으로 판명되었습니다. 이러한 기술적 격차로 인해 메시지 큐를 통한 초기 접근 방식을 채택하게 되었습니다.</p>
<h2 id="Our-Initial-Solution-Message-Queues-as-WAL" class="common-anchor-header">초기 솔루션: WAL로서의 메시지 큐<button data-href="#Our-Initial-Solution-Message-Queues-as-WAL" class="anchor-icon" translate="no">
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
    </button></h2><p>이러한 격차를 해소하기 위해 초기 접근 방식에서는 메시지 큐(Kafka/Pulsar)를 미리 쓰기 로그(WAL)로 활용했습니다. 아키텍처는 다음과 같이 작동했습니다:</p>
<ul>
<li><p>들어오는 모든 실시간 업데이트는 메시지 큐를 통과합니다.</p></li>
<li><p>작성자는 메시지 대기열에서 수락되면 즉시 확인을 받습니다.</p></li>
<li><p>쿼리 노드와 데이터 노드는 이 데이터를 비동기적으로 처리하여 데이터 최신성을 유지하면서 높은 쓰기 처리량을 보장합니다.</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_Milvus_2_0_Architecture_Overview_465f5ba27a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>그림: Milvus 2.0 아키텍처 개요</p>
<p>이 시스템은 비동기식 데이터 처리를 가능하게 하면서도 즉각적인 쓰기 확인을 효과적으로 제공했으며, 이는 Milvus 사용자가 기대하는 처리량과 데이터 최신성 간의 균형을 유지하는 데 매우 중요했습니다.</p>
<h2 id="Why-We-Needed-Something-Different-for-WAL" class="common-anchor-header">WAL을 위해 뭔가 다른 것이 필요했던 이유<button data-href="#Why-We-Needed-Something-Different-for-WAL" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.6에서는 외부 메시지 큐를 단계적으로 없애고 특별히 구축된 클라우드 네이티브 WAL 구현인 Woodpecker를 사용하기로 결정했습니다. 이는 가볍게 내린 결정이 아니었습니다. 결국 우리는 수년 동안 Kafka와 Pulsar를 성공적으로 사용해왔기 때문입니다.</p>
<p>두 기술 모두 강력한 기능을 갖춘 훌륭한 시스템이었기 때문에 문제는 기술 자체가 아니었습니다. 대신 Milvus가 발전함에 따라 이러한 외부 시스템이 도입되면서 복잡성과 오버헤드가 증가하는 것이 문제였습니다. 요구 사항이 더욱 전문화됨에 따라 범용 메시지 큐가 제공하는 것과 벡터 데이터베이스에 필요한 것 사이의 격차가 계속 커졌습니다.</p>
<p>결국 세 가지 구체적인 요인으로 인해 대체 시스템을 구축하기로 결정했습니다:</p>
<h3 id="Operational-Complexity" class="common-anchor-header">운영 복잡성</h3><p>카프카나 펄서 같은 외부 종속성은 여러 노드를 갖춘 전용 머신과 신중한 리소스 관리를 요구합니다. 이로 인해 몇 가지 문제가 발생합니다:</p>
<ul>
<li>운영 복잡성 증가</li>
</ul>
<ul>
<li>시스템 관리자의 가파른 학습 곡선</li>
</ul>
<ul>
<li>구성 오류 및 보안 취약성 위험 증가</li>
</ul>
<h3 id="Architectural-Constraints" class="common-anchor-header">아키텍처 제약</h3><p>Kafka와 같은 메시지 큐는 지원되는 토픽 수에 본질적인 제한이 있습니다. 구성 요소 간의 토픽 공유를 위한 해결 방법으로 VShard를 개발했지만, 이 솔루션은 확장 요구 사항을 효과적으로 해결하지만 아키텍처의 복잡성을 크게 증가시켰습니다.</p>
<p>이러한 외부 종속성으로 인해 로그 가비지 수집과 같은 중요한 기능을 구현하기가 더 어려워졌고 다른 시스템 모듈과의 통합 마찰이 증가했습니다. 시간이 지남에 따라 범용 메시지 큐와 벡터 데이터베이스의 특정 고성능 요구 사항 간의 아키텍처 불일치가 점점 더 명확해지면서 설계 선택을 재평가해야 했습니다.</p>
<h3 id="Resource-Inefficiency" class="common-anchor-header">리소스 비효율성</h3><p>Kafka 및 Pulsar와 같은 시스템에서 고가용성을 보장하려면 일반적으로 많은 것이 요구됩니다:</p>
<ul>
<li><p>여러 노드에 분산 배포</p></li>
<li><p>소규모 워크로드에도 상당한 리소스 할당</p></li>
<li><p>실제로 장기간 보관할 필요가 없는 임시 신호(예: Milvus의 Timetick)를 위한 스토리지</p></li>
</ul>
<p>그러나 이러한 시스템에는 이러한 일시적 신호에 대한 지속성을 우회할 수 있는 유연성이 부족하여 불필요한 I/O 작업과 스토리지 사용으로 이어집니다. 이는 특히 규모가 작거나 리소스가 제한된 환경에서 불균형적인 리소스 오버헤드와 비용 증가로 이어집니다.</p>
<h2 id="Introducing-Woodpecker---A-Cloud-Native-High-Performance-WAL-Engine" class="common-anchor-header">클라우드 네이티브 고성능 WAL 엔진, 우드페커 소개<button data-href="#Introducing-Woodpecker---A-Cloud-Native-High-Performance-WAL-Engine" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.6에서는 Kafka/Pulsar를 특수 목적의 클라우드 네이티브 WAL 시스템인 <strong>Woodpecker로</strong> 대체했습니다. 개체 스토리지용으로 설계된 Woodpecker는 운영을 간소화하는 동시에 성능과 확장성을 향상시킵니다.</p>
<p>처음부터 클라우드 네이티브 스토리지의 잠재력을 극대화하도록 설계된 Woodpecker는 클라우드 환경에 최적화된 처리량이 가장 높은 WAL 솔루션이 되는 동시에 추가 전용 쓰기-앞서 로그에 필요한 핵심 기능을 제공하는 것을 목표로 삼고 있습니다.</p>
<h3 id="The-Zero-Disk-Architecture-for-Woodpecker" class="common-anchor-header">우드페커를 위한 제로 디스크 아키텍처</h3><p>우드페커의 핵심 혁신은 <strong>제로 디스크 아키텍처입니다</strong>:</p>
<ul>
<li><p>모든 로그 데이터는 클라우드 오브젝트 스토리지(예: Amazon S3, Google Cloud Storage 또는 Alibaba OS)에 저장됩니다.</p></li>
<li><p>etcd와 같은 분산 키-값 저장소를 통해 관리되는 메타데이터</p></li>
<li><p>핵심 작업에 대한 로컬 디스크 종속성 없음</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_Woodpecker_Architecture_cc31e15ed9.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>그림:  우드페커 아키텍처 개요</p>
<p>이 접근 방식은 운영 오버헤드를 획기적으로 줄이면서 내구성과 클라우드 효율성을 극대화합니다. 로컬 디스크 종속성을 제거함으로써 우드페커는 클라우드 네이티브 원칙에 완벽하게 부합하며 시스템 관리자의 운영 부담을 크게 줄여줍니다.</p>
<h3 id="Performance-Benchmarks-Exceeding-Expectations" class="common-anchor-header">성능 벤치마크: 기대 이상의 성능</h3><p>단일 노드, 단일 클라이언트, 단일 로그 스트림 설정에서 Woodpecker의 성능을 평가하기 위해 포괄적인 벤치마크를 실행했습니다. 그 결과는 Kafka 및 Pulsar와 비교했을 때 인상적이었습니다:</p>
<table>
<thead>
<tr><th><strong>시스템</strong></th><th><strong>Kafka</strong></th><th><strong>Pulsar</strong></th><th><strong>WP MinIO</strong></th><th><strong>WP 로컬</strong></th><th><strong>WP S3</strong></th></tr>
</thead>
<tbody>
<tr><td>처리량</td><td>129.96 MB/s</td><td>107 MB/s</td><td>71 MB/s</td><td>450 MB/s</td><td>750 MB/s</td></tr>
<tr><td>지연 시간</td><td>58ms</td><td>35ms</td><td>184ms</td><td>1.8ms</td><td>166ms</td></tr>
</tbody>
</table>
<p>테스트 머신에서 다양한 스토리지 백엔드의 이론적 처리량 한계를 측정했습니다:</p>
<ul>
<li><p><strong>MinIO</strong>: ~110MB/s</p></li>
<li><p><strong>로컬 파일 시스템</strong>: 600-750MB/s</p></li>
<li><p><strong>Amazon S3(단일 EC2 인스턴스)</strong>: 최대 1.1GB/s</p></li>
</ul>
<p>놀랍게도 우드페커는 각 백엔드에서 가능한 최대 처리량의 60~80%를 일관되게 달성했으며, 이는 미들웨어로서는 탁월한 효율성 수준입니다.</p>
<h4 id="Key-Performance-Insights" class="common-anchor-header">주요 성능 인사이트</h4><ol>
<li><p><strong>로컬 파일 시스템 모드</strong>: 우드펙커는 450MB/s(카프카보다 3.5배, 펄사보다 4.2배 빠른 속도)를 달성했으며 지연 시간은 1.8ms에 불과해 고성능 단일 노드 배포에 이상적입니다.</p></li>
<li><p><strong>클라우드 스토리지 모드(S3</strong>): S3에 직접 기록할 때 Woodpecker는 750MB/s(S3의 이론적 한계치의 약 68%)에 도달하여 Kafka보다 5.8배, Pulsar보다 7배 더 높았습니다. 지연 시간은 더 높지만(166밀리초), 이 설정은 배치 지향 워크로드에 탁월한 처리량을 제공합니다.</p></li>
<li><p><strong>객체 스토리지 모드(MinIO</strong>): MinIO를 사용하더라도 Woodpecker는 MinIO 용량의 약 65%인 71MB/s를 달성했습니다. 이 성능은 Kafka 및 Pulsar와 비슷하지만 리소스 요구 사항이 훨씬 낮습니다.</p></li>
</ol>
<p>우드페커는 특히 질서 유지가 중요한 동시 대용량 쓰기에 최적화되어 있습니다. 그리고 이러한 결과는 개발 초기 단계에 불과하며, I/O 병합, 지능형 버퍼링 및 프리페칭의 지속적인 최적화를 통해 성능이 이론적 한계에 더욱 가까워질 것으로 예상됩니다.</p>
<h3 id="Design-Goals" class="common-anchor-header">설계 목표</h3><p>우드페커는 다음과 같은 주요 기술 요건을 통해 실시간 벡터 검색 워크로드의 진화하는 요구 사항을 해결합니다:</p>
<ul>
<li><p>가용성 영역 전반에서 내구성이 뛰어난 지속성을 갖춘 높은 처리량의 데이터 수집</p></li>
<li><p>실시간 구독을 위한 지연 시간이 짧은 꼬리 읽기 및 장애 복구를 위한 높은 처리량의 캐치업 읽기.</p></li>
<li><p>클라우드 오브젝트 스토리지 및 NFS 프로토콜을 지원하는 파일 시스템을 포함한 플러그형 스토리지 백엔드</p></li>
<li><p>유연한 배포 옵션, 경량 독립형 설정과 멀티 테넌트 Milvus 배포를 위한 대규모 클러스터를 모두 지원</p></li>
</ul>
<h3 id="Architecture-Components" class="common-anchor-header">아키텍처 구성 요소</h3><p>표준 Woodpecker 배포에는 다음과 같은 구성 요소가 포함됩니다.</p>
<ul>
<li><p><strong>클라이언트</strong> - 읽기 및 쓰기 요청을 발행하기 위한 인터페이스 계층</p></li>
<li><p><strong>LogStore</strong> - 고속 쓰기 버퍼링, 스토리지에 대한 비동기 업로드, 로그 압축을 관리합니다.</p></li>
<li><p><strong>스토리지 백엔드</strong> - S3, GCS, EFS와 같은 파일 시스템 등 확장 가능한 저비용 스토리지 서비스 지원</p></li>
<li><p><strong>ETCD</strong> - 분산 노드에 메타데이터를 저장하고 로그 상태를 조정합니다.</p></li>
</ul>
<h3 id="Flexible-Deployments-to-Match-Your-Specific-Needs" class="common-anchor-header">특정 요구 사항에 맞는 유연한 배포</h3><p>딱따구리는 특정 요구 사항에 맞는 두 가지 배포 모드를 제공합니다:</p>
<p><strong>메모리버퍼 모드 - 가볍고 유지보수가 필요 없는 모드</strong></p>
<p>MemoryBuffer 모드는 간단하고 가벼운 배포 옵션으로, 들어오는 쓰기를 메모리에 일시적으로 버퍼링하고 주기적으로 클라우드 오브젝트 스토리지 서비스로 플러시합니다. 메타데이터는 일관성과 조정을 보장하기 위해 etcd를 사용하여 관리됩니다. 이 모드는 성능보다 단순성을 우선시하는 소규모 배포 또는 프로덕션 환경의 일괄 처리량이 많은 워크로드에 가장 적합하며, 특히 쓰기 지연 시간이 중요하지 않은 경우에 적합합니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_The_memory_Buffer_Mode_3429d693a1.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>그림: 메모리 버퍼 모드</em></p>
<p><strong>쿼럼버퍼 모드 - 짧은 레이턴시, 고내구성 배포에 최적화된 모드</strong></p>
<p>쿼럼버퍼 모드는 실시간 응답성과 강력한 내결함성이 모두 필요한 지연 시간에 민감하고 빈도가 높은 읽기/쓰기 워크로드를 위해 설계되었습니다. 이 모드에서 딱따구리는 3복제 쿼럼 쓰기를 통해 고속 쓰기 버퍼로 작동하여 강력한 일관성과 고가용성을 보장합니다.</p>
<p>쓰기 작업은 3개 노드 중 2개 이상에 복제되면 성공한 것으로 간주되며, 일반적으로 한 자릿수 밀리초 이내에 완료되고 그 후에는 장기적인 내구성을 위해 데이터가 클라우드 오브젝트 스토리지로 비동기적으로 플러시됩니다. 이 아키텍처는 온노드 상태를 최소화하고, 대용량 로컬 디스크 볼륨이 필요하지 않으며, 기존 쿼럼 기반 시스템에서 종종 필요한 복잡한 엔트로피 방지 복구 작업을 피할 수 있습니다.</p>
<p>그 결과 일관성, 가용성, 빠른 복구가 필수적인 미션 크리티컬 프로덕션 환경에 이상적인 간소화되고 강력한 WAL 계층을 구축할 수 있습니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_The_Quorum_Buffer_Mode_72573dc666.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>그림: 쿼럼버퍼 모드</em></p>
<h2 id="StreamingService-Built-for-Real-Time-Data-Flow" class="common-anchor-header">스트리밍 서비스: 실시간 데이터 흐름을 위해 구축<button data-href="#StreamingService-Built-for-Real-Time-Data-Flow" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.6에서는 딱따구리 외에도 로그 관리, 로그 수집, 스트리밍 데이터 구독을 위해 설계된 전문 구성 <strong>요소인 StreamingService를</strong>도입했습니다.</p>
<p>새로운 아키텍처의 작동 방식을 이해하려면 이 두 구성 요소 간의 관계를 명확히 하는 것이 중요합니다:</p>
<ul>
<li><p><strong>Woodpecker는</strong> 쓰기 전 로그의 실제 지속성을 처리하는 스토리지 계층으로 내구성과 안정성을 제공합니다.</p></li>
<li><p><strong>StreamingService는</strong> 로그 작업을 관리하고 실시간 데이터 스트리밍 기능을 제공하는 서비스 계층입니다.</p></li>
</ul>
<p>이 두 가지를 함께 사용하면 외부 메시지 큐를 완전히 대체할 수 있습니다. 우드페커는 내구성이 뛰어난 스토리지 기반을 제공하는 반면, 스트리밍 서비스는 애플리케이션이 직접 상호작용하는 높은 수준의 기능을 제공합니다. 이렇게 분리되어 있기 때문에 각 구성 요소는 특정 역할에 맞게 최적화되는 동시에 통합 시스템으로 원활하게 함께 작동할 수 있습니다.</p>
<h3 id="Adding-Streaming-Service-to-Milvus-26" class="common-anchor-header">Milvus 2.6에 스트리밍 서비스 추가하기</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_Milvus_2_6_Architecture_Overview_238428c58f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>그림: Milvus 2.6 아키텍처에 추가된 스트리밍 서비스</p>
<p>스트리밍 서비스는 세 가지 핵심 구성 요소로 이루어져 있습니다:</p>
<p><strong>스트리밍 코디네이터</strong></p>
<ul>
<li><p>Milvus ETCD 세션을 모니터링하여 사용 가능한 스트리밍 노드를 검색합니다.</p></li>
<li><p>매니저 서비스를 통해 WAL의 상태를 관리하고 로드 밸런싱 메트릭을 수집합니다.</p></li>
</ul>
<p><strong>스트리밍 클라이언트</strong></p>
<ul>
<li><p>AssignmentService를 쿼리하여 스트리밍 노드 전반의 WAL 세그먼트 배포를 결정합니다.</p></li>
<li><p>적절한 스트리밍 노드에서 핸들러 서비스를 통해 읽기/쓰기 작업을 수행합니다.</p></li>
</ul>
<p><strong>스트리밍 노드</strong></p>
<ul>
<li><p>실제 WAL 작업을 처리하고 실시간 데이터 스트리밍을 위한 게시-구독 기능을 제공합니다.</p></li>
<li><p>WAL 관리 및 성능 보고를 위한 <strong>ManagerService를</strong> 포함합니다.</p></li>
<li><p>WAL 항목에 대한 효율적인 퍼블리시-구독 메커니즘을 구현하는 <strong>핸들러 서비스</strong> 포함</p></li>
</ul>
<p>이러한 계층화된 아키텍처를 통해 Milvus는 스트리밍 기능(구독, 실시간 처리)과 실제 저장 메커니즘을 명확하게 분리할 수 있습니다. 우드페커는 로그 저장의 '방법'을 처리하는 반면, 스트리밍 서비스는 로그 작업의 '내용'과 '시기'를 관리합니다.</p>
<p>그 결과, 스트리밍 서비스는 기본 구독 지원을 도입하여 외부 메시지 큐가 필요 없게 함으로써 Milvus의 실시간 기능을 크게 향상시킵니다. 쿼리 및 데이터 경로에서 이전에 중복된 캐시를 통합하여 메모리 소비를 줄이고, 비동기 동기화 지연을 제거하여 강력하게 일관된 읽기를 위한 지연 시간을 낮추고, 시스템 전반의 확장성과 복구 속도를 모두 개선합니다.</p>
<h2 id="Conclusion---Streaming-on-a-Zero-Disk-Architecture" class="common-anchor-header">결론 - 제로 디스크 아키텍처에서의 스트리밍<button data-href="#Conclusion---Streaming-on-a-Zero-Disk-Architecture" class="anchor-icon" translate="no">
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
    </button></h2><p>상태 관리는 어렵습니다. 스테이트풀 시스템은 종종 탄력성과 확장성을 희생합니다. 클라우드 네이티브 설계에서 점점 더 많이 받아들여지고 있는 해답은 상태를 컴퓨팅에서 분리하여 각각 독립적으로 확장할 수 있도록 하는 것입니다.</p>
<p>저희는 새로운 것을 개발하기보다는 내구성과 확장성이 뛰어난 스토리지의 복잡성을 AWS S3, Google Cloud Storage, MinIO와 같은 서비스를 지원하는 세계적 수준의 엔지니어링 팀에 위임하고 있습니다. 그중에서도 S3는 사실상 무제한 용량, 99.99(99.999999999%)의 내구성, 99.99%의 가용성, 높은 읽기/쓰기 성능으로 두각을 나타내고 있습니다.</p>
<p>하지만 '제로 디스크' 아키텍처에도 장단점이 있습니다. 객체 저장소는 여전히 높은 쓰기 지연 시간과 작은 파일 비효율성으로 인해 많은 실시간 워크로드에서 여전히 해결되지 않는 한계가 있습니다.</p>
<p>벡터 데이터베이스, 특히 미션 크리티컬 RAG, AI 에이전트, 저지연 검색 워크로드를 지원하는 데이터베이스의 경우 실시간 액세스와 빠른 쓰기는 타협할 수 없는 필수 요소입니다. 이것이 바로 Milvus를 Woodpecker와 스트리밍 서비스를 중심으로 재설계한 이유입니다. 이러한 변화는 전체 시스템을 단순화하고(벡터 데이터베이스 내부에 전체 Pulsar 스택을 유지하고 싶어하는 사람은 아무도 없습니다), 더 신선한 데이터를 보장하며, 비용 효율성을 개선하고, 장애 복구 속도를 높입니다.</p>
<p>우드페커는 단순한 Milvus 구성 요소가 아니라 다른 클라우드 네이티브 시스템의 기본 구성 요소 역할을 할 수 있다고 믿습니다. 클라우드 인프라가 발전함에 따라 S3 Express와 같은 혁신은 한 자릿수 밀리초의 쓰기 레이턴시로 AZ 간 내구성이라는 이상에 더욱 가까워질 수 있습니다.</p>
<h2 id="Getting-Started-with-Milvus-26" class="common-anchor-header">Milvus 2.6 시작하기<button data-href="#Getting-Started-with-Milvus-26" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.6은 지금 사용 가능합니다. Woodpecker 외에도 계층형 스토리지, RabbitQ 정량화 방법, 향상된 전체 텍스트 검색 및 멀티테넌시 등 수십 가지의 새로운 기능과 성능 최적화를 도입하여 오늘날 벡터 검색에서 가장 시급한 과제인 효율적인 확장과 비용 관리를 직접 해결합니다.</p>
<p>Milvus가 제공하는 모든 것을 살펴볼 준비가 되셨나요?<a href="https://milvus.io/docs/release_notes.md"> 릴리즈 노트를</a> 자세히 살펴보고,<a href="https://milvus.io/docs"> 전체 설명서를</a> 찾아보거나,<a href="https://milvus.io/blog"> 기능 블로그를</a> 확인해 보세요.</p>
<p>질문이 있으신가요? <a href="https://discord.com/invite/8uyFbECzPX">Discord 커뮤니티에</a> 참여하시거나<a href="https://github.com/milvus-io/milvus"> GitHub에</a> 이슈를 제출해 주시면 Milvus 2.6을 최대한 활용할 수 있도록 도와드리겠습니다.</p>
