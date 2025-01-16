---
id: 2022-08-05-whats-new-in-milvus-2-1.md
title: Milvus 2.1의 새로운 기능 - 단순함과 속도를 지향하다
author: Xiaofan Luan
date: 2022-08-05T00:00:00.000Z
desc: 오픈 소스 벡터 데이터베이스인 Milvus는 이제 사용자들이 오랫동안 기대해왔던 성능과 사용성 개선 기능을 제공합니다.
cover: assets.zilliz.com/What_s_New_in_2_1_2_a0660df2a5.png
tag: News
canonicalUrl: 'https://milvus.io/blog/2022-08-05-whats-new-in-milvus-2-1.md'
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/What_s_New_in_2_1_2_a0660df2a5.png" alt="What's new in Milvus 2.1 - Towards simplicity and speed" class="doc-image" id="what's-new-in-milvus-2.1---towards-simplicity-and-speed" />
   </span> <span class="img-wrapper"> <span>Milvus 2.1의 새로운 기능 - 단순함과 속도를 지향하다</span> </span></p>
<p>Milvus 커뮤니티 기여자들의 6개월간의 노력 끝에 Milvus 2.1이<a href="https://milvus.io/docs/v2.1.x/release_notes.md">출시되었음을</a> 알려드리게 되어 매우 기쁩니다. 인기 있는 벡터 데이터베이스의 이번 주요 버전에서는 가장 중요한 두 가지 키워드인 <strong>성능과</strong> <strong>사용성을</strong> 강조했습니다. 문자열, Kafka 메시지 큐, 임베디드 Milvus에 대한 지원이 추가되었으며, 성능, 확장성, 보안, 통합 가시성 등 여러 가지가 개선되었습니다. Milvus 2.1은 알고리즘 엔지니어의 노트북에서 프로덕션 수준의 벡터 유사도 검색 서비스까지 '라스트 마일'을 연결해줄 흥미로운 업데이트입니다.</p>
<custom-h1>성능 - 3.2배 이상 향상된 성능</custom-h1><h2 id="5ms-level-latency" class="common-anchor-header">5ms 수준의 지연 시간<button data-href="#5ms-level-latency" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus는 이미 기존의 KNN 방식에서 크게 발전한 근사 근사 이웃(ANN) 검색을 지원합니다. 하지만 처리량과 지연 시간 문제는 수십억 개 규모의 벡터 데이터 검색 시나리오를 처리해야 하는 사용자들에게 계속 문제가 되고 있습니다.</p>
<p>Milvus 2.1에서는 더 이상 검색 링크의 메시지 큐에 의존하지 않는 새로운 라우팅 프로토콜이 도입되어 소규모 데이터 세트의 검색 대기 시간을 크게 줄였습니다. 테스트 결과에 따르면 Milvus는 이제 유사도 검색 및 추천과 같은 중요한 온라인 링크의 요구 사항을 충족하는 5ms까지 지연 시간을 낮췄습니다.</p>
<h2 id="Concurrency-control" class="common-anchor-header">동시성 제어<button data-href="#Concurrency-control" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.1은 새로운 비용 평가 모델과 동시성 스케줄러를 도입하여 동시성 모델을 미세 조정합니다. 이제 동시성 제어 기능을 제공하여 많은 수의 동시 요청이 CPU 및 캐시 리소스를 놓고 경쟁하거나 요청이 충분하지 않아 CPU가 제대로 활용되지 않는 일이 없도록 합니다. 또한 Milvus 2.1의 새로운 지능형 스케줄러 계층은 요청 매개변수가 일관된 소규모 쿼리를 병합하여 소규모 쿼리와 높은 쿼리 동시성이 있는 시나리오에서 놀라운 3.2배의 성능 향상을 제공합니다.</p>
<h2 id="In-memory-replicas" class="common-anchor-header">인메모리 복제본<button data-href="#In-memory-replicas" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.1은 소규모 데이터 세트의 확장성과 가용성을 개선하는 인메모리 복제본을 제공합니다. 기존 데이터베이스의 읽기 전용 복제본과 마찬가지로, 인메모리 복제본은 읽기 QPS가 높을 때 머신을 추가하여 수평적으로 확장할 수 있습니다. 소규모 데이터 세트에 대한 벡터 검색에서 추천 시스템은 종종 단일 머신의 성능 한계를 초과하는 QPS를 제공해야 합니다. 이제 이러한 시나리오에서는 메모리에 여러 복제본을 로드하여 시스템의 처리량을 크게 향상시킬 수 있습니다. 향후에는 인메모리 복제본에 기반한 헤지된 읽기 메커니즘도 도입하여 시스템 장애 복구가 필요한 경우 다른 기능의 복제본을 신속하게 요청하고 메모리 중복성을 최대한 활용하여 시스템의 전반적인 가용성을 개선할 예정입니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/What_s_New_in_Milvus_2_1_Figure_1_excalidraw_1f7fe3c998.png" alt="In-memory replicas allow query services to be based on separate
copies of the same data." class="doc-image" id="in-memory-replicas-allow-query-services-to-be-based-on-separate-copies-of-the-same-data." />
   </span> <span class="img-wrapper"> <span>인메모리 복제본을 사용하면 동일한 데이터의 별도 복사본을 기반으로 쿼리 서비스를 제공할 수 있습니다</span>. </span></p>
<h2 id="Faster-data-loading" class="common-anchor-header">더 빠른 데이터 로딩<button data-href="#Faster-data-loading" class="anchor-icon" translate="no">
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
    </button></h2><p>마지막 성능 향상은 데이터 로딩에서 비롯됩니다. Milvus 2.1은 이제 Zstandard(zstd)로 <a href="https://milvus.io/docs/v2.1.x/glossary.md#Log-snapshot">바이너리 로그를</a> 압축하여 객체 및 메시지 저장소의 데이터 크기와 데이터 로딩 중 네트워크 오버헤드를 크게 줄여줍니다. 또한 고루틴 풀이 도입되어 Milvus가 메모리 풋프린트를 제어하면서 동시에 세그먼트를 로드하고 장애 복구 및 데이터 로드에 필요한 시간을 최소화할 수 있습니다.</p>
<p>Milvus 2.1의 전체 벤치마크 결과는 곧 웹사이트를 통해 공개될 예정입니다. 계속 지켜봐 주세요.</p>
<h2 id="String-and-scalar-index-support" class="common-anchor-header">문자열 및 스칼라 인덱스 지원<button data-href="#String-and-scalar-index-support" class="anchor-icon" translate="no">
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
    </button></h2><p>2.1 버전에서 Milvus는 이제 스칼라 데이터 유형으로 가변 길이 문자열(VARCHAR)을 지원합니다. VARCHAR는 출력으로 반환할 수 있는 기본 키로 사용할 수 있으며, 속성 필터로도 작동할 수 있습니다. <a href="https://milvus.io/docs/v2.1.x/hybridsearch.md">속성 필터링은</a> Milvus 사용자에게 가장 많이 사용되는 기능 중 하나입니다. &quot; <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mo>200-200</mo></mrow><annotation encoding="application/x-tex">-</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.7278em;vertical-align:-0.0833em;"></span><span class="mord">200-300</span></span></span></span>가격대의 사용자와 가장 유사한 제품 찾기&quot; 또는 &quot;키워드가 '벡터 데이터베이스'이고 클라우드 네이티브 주제와 관련된 문서 찾기&quot;를 자주 원하신다면 Milvus 2.1이 마음에 드실 것입니다.</p>
<p>Milvus 2.1은 또한<a href="https://www.cs.le.ac.uk/people/ond1/XMLcomp/confersWEA06_LOUDS.pdf">간결한</a><a href="https://github.com/s-yata/marisa-trie">MARISA-Tries</a> 데이터 구조를 기반으로 필터링 속도를 개선하기 위해 스칼라 반전 인덱스를 지원합니다. 이제 모든 데이터를 매우 적은 공간으로 메모리에 로드할 수 있어 문자열의 비교, 필터링, 접두사 매칭을 훨씬 더 빠르게 수행할 수 있습니다. 테스트 결과, 모든 데이터를 메모리에 로드하고 쿼리 기능을 제공하는 데 필요한 MARISA-trie의 메모리 요구량은 Python 사전의 10%에 불과한 것으로 나타났습니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/What_s_new_in_Milvus_Figure_2_excalidraw_a1149aca96.png" alt="Milvus 2.1 combines MARISA-Trie with inverted index to significantly improve filtering speed." class="doc-image" id="milvus-2.1-combines-marisa-trie-with-inverted-index-to-significantly-improve-filtering-speed." />
   </span> <span class="img-wrapper"> <span>Milvus 2.1은 MARISA-Trie와 역 인덱스를 결합하여 필터링 속도를 크게 향상시켰습니다.</span> </span></p>
<p>앞으로도 Milvus는 스칼라 데이터의 저장 및 사용 비용을 줄이기 위한 지속적인 노력의 일환으로 스칼라 쿼리 관련 개발에 집중하고, 더 많은 스칼라 인덱스 유형과 쿼리 연산자를 지원하고, 디스크 기반 스칼라 쿼리 기능을 제공할 것입니다.</p>
<custom-h1>사용성 개선</custom-h1><h2 id="Kafka-support" class="common-anchor-header">Kafka 지원<button data-href="#Kafka-support" class="anchor-icon" translate="no">
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
    </button></h2><p>커뮤니티에서는 오랫동안 Milvus의 <a href="https://milvus.io/docs/v2.1.x/deploy_pulsar.md">메시지 저장소로</a> <a href="https://kafka.apache.org">Apache Kafka에</a> 대한 지원을 요청해 왔습니다. 이제 Milvus 2.1에서는 Milvus의 추상화 및 캡슐화 설계와 Confluent에서 기여한 Go Kafka SDK 덕분에 사용자 구성에 따라<a href="https://pulsar.apache.org">Pulsar</a> 또는 Kafka를 메시지 저장소로 사용할 수 있는 옵션을 제공할 수 있게 되었습니다.</p>
<h2 id="Production-ready-Java-SDK" class="common-anchor-header">프로덕션에 바로 사용할 수 있는 Java SDK<button data-href="#Production-ready-Java-SDK" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.1과 함께 이제 <a href="https://github.com/milvus-io/milvus-sdk-java">Java SDK가</a> 공식 출시되었습니다. Java SDK는 Python SDK와 완전히 동일한 기능을 제공하며 동시성 성능은 더욱 향상되었습니다. 다음 단계에서는 커뮤니티 기여자들이 Java SDK에 대한 문서와 사용 사례를 점진적으로 개선하고 Go 및 RESTful SDK도 프로덕션 준비 단계로 나아갈 수 있도록 지원할 예정입니다.</p>
<h2 id="Observability-and-maintainability" class="common-anchor-header">관찰 가능성 및 유지 관리 가능성<button data-href="#Observability-and-maintainability" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.1에는 벡터 삽입 횟수, 검색 지연 시간/처리량, 노드 메모리 오버헤드, CPU 오버헤드와 같은 중요한 모니터링<a href="https://milvus.io/docs/v2.1.x/metrics_dashboard.md">메트릭이</a> 추가되었습니다. 또한 새 버전은 로그 수준을 조정하고 쓸모없는 로그 인쇄를 줄임으로써 로그 보관도 크게 최적화합니다.</p>
<h2 id="Embedded-Milvus" class="common-anchor-header">임베디드 Milvus<button data-href="#Embedded-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus는 대규모 대규모 벡터 데이터 검색 서비스의 배포를 크게 간소화했지만, 소규모로 알고리즘을 검증하려는 과학자들에게는 Docker나 K8이 여전히 불필요하게 복잡합니다. <a href="https://github.com/milvus-io/embd-milvus">임베디드 Milvus의</a> 도입으로 이제 Pyrocksb 및 Pysqlite와 마찬가지로 pip를 사용하여 Milvus를 설치할 수 있습니다. 임베디드 Milvus는 클러스터 버전과 독립 실행형 버전의 모든 기능을 지원하므로 코드 한 줄도 변경하지 않고도 노트북에서 분산 프로덕션 환경으로 쉽게 전환할 수 있습니다. 알고리즘 엔지니어는 Milvus로 프로토타입을 구축할 때 훨씬 더 나은 경험을 할 수 있습니다.</p>
<custom-h1>지금 바로 벡터 검색을 사용해 보세요</custom-h1><p>또한 Milvus 2.1은 안정성과 확장성이 크게 개선되었으며, 여러분의 많은 사용과 피드백을 기다리겠습니다.</p>
<h2 id="Whats-next" class="common-anchor-header">다음 업데이트<button data-href="#Whats-next" class="anchor-icon" translate="no">
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
<li>Milvus 2.1의 모든 변경 사항은 자세한 <a href="https://milvus.io/docs/v2.1.x/release_notes.md">릴리스 노트를</a> 참조하세요.</li>
<li>Milvus 2.1을<a href="https://milvus.io/docs/v2.1.x/install_standalone-docker.md">설치하고</a>새로운 기능을 사용해 보세요.</li>
<li><a href="https://slack.milvus.io/">Slack 커뮤니티에</a> 가입하여 전 세계 수천 명의 Milvus 사용자와 함께 새로운 기능에 대해 토론하세요.</li>
<li><a href="https://twitter.com/milvusio">트위터와</a><a href="https://www.linkedin.com/company/the-milvus-project">링크드인을</a> 팔로우하여 특정 새 기능에 대한 블로그가 게시되면 업데이트를 받아보세요.</li>
</ul>
<blockquote>
<p>편집자: <a href="https://github.com/songxianj">송시안 장</a></p>
</blockquote>
