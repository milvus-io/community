---
id: building-a-personalized-product-recommender-system-with-vipshop-and-milvus.md
title: 건축 전반
author: milvus
date: 2021-07-29T08:46:39.920Z
desc: 밀버스를 사용하면 사용자에게 개인화된 추천 서비스를 쉽게 제공할 수 있습니다.
cover: assets.zilliz.com/blog_shopping_27fba2c990.jpg
tag: Scenarios
canonicalUrl: >-
  https://zilliz.com/blog/building-a-personalized-product-recommender-system-with-vipshop-and-milvus
---
<custom-h1>Vipshop과 Milvus로 개인 맞춤형 상품 추천 시스템 구축하기</custom-h1><p>인터넷 데이터 규모가 폭발적으로 증가함에 따라 현재 주류 이커머스 플랫폼의 상품 수와 카테고리는 늘어나는 반면, 사용자가 필요한 상품을 찾는 어려움은 급증하고 있습니다.</p>
<p><a href="https://www.vip.com/">Vipshop은</a> 중국의 대표적인 브랜드 온라인 할인 소매업체입니다. 이 회사는 중국 전역의 소비자에게 고품질의 인기 브랜드 제품을 소매가보다 대폭 할인된 가격으로 제공합니다. 이 회사는 고객의 쇼핑 경험을 최적화하기 위해 사용자 검색 키워드와 사용자 초상화를 기반으로 개인화된 검색 추천 시스템을 구축하기로 결정했습니다.</p>
<p>이커머스 검색 추천 시스템의 핵심 기능은 수많은 상품 중에서 적합한 상품을 검색하여 사용자의 검색 의도와 선호도에 따라 사용자에게 표시하는 것입니다. 이 과정에서 시스템은 상품과 사용자의 검색 의도 및 선호도 간의 유사도를 계산하고, 유사도가 가장 높은 TopK 상품을 사용자에게 추천해야 합니다.</p>
<p>상품 정보, 사용자 검색 의도, 사용자 선호도 등의 데이터는 모두 비정형 데이터입니다. 이러한 데이터의 유사도를 계산하기 위해 검색 엔진 Elasticsearch(ES)의 CosineSimilarity(7.x)를 사용했지만, 이 방식에는 다음과 같은 단점이 있습니다.</p>
<ul>
<li><p>긴 계산 응답 시간 - 수백만 개의 항목에서 TopK 결과를 검색하는 데 걸리는 평균 지연 시간은 약 300ms입니다.</p></li>
<li><p>ES 인덱스의 높은 유지 관리 비용 - 상품 특징 벡터와 기타 관련 데이터 모두에 동일한 인덱스 세트가 사용되므로 인덱스 구성이 거의 용이하지 않지만 방대한 양의 데이터를 생성합니다.</p></li>
</ul>
<p>저희는 ES의 코사인 유사도 계산을 가속화하기 위해 자체적으로 로컬에 민감한 해시 플러그인을 개발하려고 했습니다. 가속 후 성능과 처리량은 크게 개선되었지만 100ms 이상의 지연 시간은 여전히 실제 온라인 제품 검색 요구 사항을 충족하기 어려웠습니다.</p>
<p>철저한 연구 끝에 일반적으로 사용되는 독립형 Faiss에 비해 분산 배포, 다국어 SDK, 읽기/쓰기 분리 등을 지원하는 오픈소스 벡터 데이터베이스인 Milvus를 사용하기로 결정했습니다.</p>
<p>다양한 딥러닝 모델을 사용해 방대한 비정형 데이터를 특징 벡터로 변환하고, 그 벡터를 Milvus로 가져옵니다. 밀버스의 뛰어난 성능을 통해 이커머스 검색 추천 시스템은 타깃 벡터와 유사한 TopK 벡터를 효율적으로 쿼리할 수 있습니다.</p>
<h2 id="Overall-Architecture" class="common-anchor-header">건축 전반<button data-href="#Overall-Architecture" class="anchor-icon" translate="no">
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
    </button></h2><p>아키텍처](https://assets.zilliz.com/1_01551e7b2b.jpg &quot;아키텍처&quot;) 다이어그램에서 볼 수 있듯이 시스템 전체 아키텍처는 크게 두 가지로 구성됩니다.</p>
<ul>
<li><p>쓰기 프로세스: 딥러닝 모델에서 생성된 항목 특징 벡터(이하 항목 벡터)를 정규화하여 MySQL에 기록합니다. 그런 다음 MySQL은 데이터 동기화 도구(ETL)를 사용하여 처리된 항목 특징 벡터를 읽고 이를 벡터 데이터베이스 Milvus로 가져옵니다.</p></li>
<li><p>읽기 프로세스: 검색 서비스는 사용자 쿼리 키워드와 사용자 초상화를 기반으로 사용자 선호도 특징 벡터(이하 사용자 벡터)를 얻고, Milvus에서 유사한 벡터를 쿼리하여 TopK 항목 벡터를 불러옵니다.</p></li>
</ul>
<p>Milvus는 증분 데이터 업데이트와 전체 데이터 업데이트를 모두 지원합니다. 증분 업데이트는 기존 항목 벡터를 삭제하고 새 항목 벡터를 삽입해야 하므로 새로 업데이트되는 모든 컬렉션이 다시 색인화됩니다. 이 방식은 읽기가 많고 쓰기가 적은 시나리오에 더 적합합니다. 따라서 전체 데이터 업데이트 방법을 선택합니다. 또한, 전체 데이터를 여러 파티션에 일괄적으로 쓰는 데 몇 분밖에 걸리지 않아 거의 실시간 업데이트에 해당합니다.</p>
<p>Milvus 쓰기 노드는 데이터 컬렉션 생성, 인덱스 구축, 벡터 삽입 등 모든 쓰기 작업을 수행하며 쓰기 도메인 네임으로 대중에게 서비스를 제공합니다. Milvus 읽기 노드는 모든 읽기 작업을 수행하며 읽기 전용 도메인 네임으로 대중에게 서비스를 제공합니다.</p>
<p>현재 버전의 Milvus는 컬렉션 별칭 전환을 지원하지 않지만, Redis를 도입하여 여러 개의 전체 데이터 컬렉션 간에 별칭을 원활하게 전환할 수 있습니다.</p>
<p>읽기 노드는 기존 메타데이터 정보와 벡터 데이터 또는 인덱스를 MySQL, Milvus, GlusterFS 분산 파일 시스템에서 읽기만 하면 되기 때문에 여러 인스턴스를 배포하여 읽기 기능을 수평적으로 확장할 수 있습니다.</p>
<h2 id="Implementation-Details" class="common-anchor-header">구현 세부 사항<button data-href="#Implementation-Details" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Data-Update" class="common-anchor-header">데이터 업데이트</h3><p>데이터 업데이트 서비스에는 벡터 데이터 쓰기뿐만 아니라 벡터의 데이터 볼륨 감지, 인덱스 구성, 인덱스 사전 로딩, 별칭 제어 등이 포함됩니다. 전체 프로세스는 다음과 같습니다. <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_6052b01334.jpg" alt="Process" class="doc-image" id="process" /><span>프로세스</span> </span></p>
<ol>
<li><p>전체 데이터를 구축하기 전에 CollectionA가 대국민 데이터 서비스를 제공하고, 사용 중인 전체 데이터는 CollectionA(<code translate="no">redis key1 = CollectionA</code>)로 연결된다고 가정합니다. 전체 데이터 구축의 목적은 새로운 컬렉션 CollectionB를 생성하는 것입니다.</p></li>
<li><p>상품 데이터 확인 - MySQL 테이블에서 상품 데이터의 항목 번호를 확인하고, 해당 상품 데이터를 CollectionA의 기존 데이터와 비교합니다. 수량 또는 백분율에 따라 알림을 설정할 수 있습니다. 설정한 수량(백분율)에 도달하지 못하면 전체 데이터가 구축되지 않고 구축 작업 실패로 간주되어 알림이 트리거되며, 설정한 수량(백분율)에 도달하면 전체 데이터 구축 프로세스가 시작됩니다.</p></li>
<li><p>전체 데이터 구축 시작 - 구축 중인 전체 데이터의 별칭을 초기화하고 Redis를 업데이트합니다. 업데이트 후, 구축 중인 전체 데이터의 별칭은 CollectionB(<code translate="no">redis key2 = CollectionB</code>)로 지정됩니다.</p></li>
<li><p>새 전체 컬렉션 만들기 - CollectionB가 존재하는지 확인합니다. 존재하는 경우 새 컬렉션을 만들기 전에 삭제합니다.</p></li>
<li><p>데이터 일괄 쓰기 - 모듈로 연산을 사용하여 각 상품 데이터의 파티션 ID를 계산하고, 새로 생성된 컬렉션에 여러 파티션에 데이터를 일괄적으로 씁니다.</p></li>
<li><p>인덱스 생성 및 사전 로드 - 새 컬렉션에 대한 인덱스(<code translate="no">createIndex()</code>)를 생성합니다. 인덱스 파일은 분산 스토리지 서버인 GlusterFS에 저장됩니다. 시스템이 자동으로 새 컬렉션에 대한 쿼리를 시뮬레이션하고 쿼리 워밍업을 위해 인덱스를 미리 로드합니다.</p></li>
<li><p>컬렉션 데이터 확인 - 새 컬렉션의 데이터 항목 수를 확인하고, 기존 컬렉션과 데이터를 비교한 후 수량과 백분율에 따라 알람을 설정합니다. 설정한 수(백분율)에 도달하지 못하면 컬렉션이 전환되지 않고 구축 프로세스가 실패한 것으로 간주되어 알람이 트리거됩니다.</p></li>
<li><p>컬렉션 전환 - 별칭 제어. Redis 업데이트 후 사용 중인 전체 데이터 별칭이 CollectionB(<code translate="no">redis key1 = CollectionB</code>)로 이동하고, 원래 Redis 키2가 삭제된 후 빌드 프로세스가 완료됩니다.</p></li>
</ol>
<h3 id="Data-Recall" class="common-anchor-header">데이터 리콜</h3><p>사용자 쿼리 키워드와 사용자 초상화를 기반으로 얻은 사용자 벡터와 항목 벡터 간의 유사도를 계산하기 위해 Milvus 파티션 데이터를 여러 번 호출하고, 병합 후 TopK 항목 벡터를 반환합니다. 전체 워크플로우 도식은 다음과 같습니다: <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_93518602b1.jpg" alt="workflow" class="doc-image" id="workflow" /><span>워크플로우</span> </span>다음 표는 이 프로세스에 관련된 주요 서비스를 나열한 것입니다. TopK 벡터를 불러오는 데 걸리는 평균 지연 시간은 약 30ms임을 알 수 있습니다.</p>
<table>
<thead>
<tr><th><strong>서비스</strong></th><th><strong>Role</strong></th><th><strong>입력 매개변수</strong></th><th><strong>출력 매개변수</strong></th><th><strong>응답 지연 시간</strong></th></tr>
</thead>
<tbody>
<tr><td>사용자 벡터 획득</td><td>사용자 벡터 획득</td><td>사용자 정보 + 쿼리</td><td>사용자 벡터</td><td>10ms</td></tr>
<tr><td>밀버스 검색</td><td>벡터 유사도를 계산하고 TopK 결과를 반환합니다.</td><td>사용자 벡터</td><td>항목 벡터</td><td>10 ms</td></tr>
<tr><td>스케줄링 로직</td><td>동시 결과 리콜 및 병합</td><td>다중 채널 리콜 항목 벡터 및 유사도 점수</td><td>TopK 항목</td><td>10 ms</td></tr>
</tbody>
</table>
<p><strong>구현 프로세스:</strong></p>
<ol>
<li>사용자 쿼리 키워드와 사용자 초상화를 기반으로 딥러닝 모델에 의해 사용자 벡터를 계산합니다.</li>
<li>사용 중인 전체 데이터의 컬렉션 별칭을 Redis currentInUseKeyRef에서 가져와 Milvus CollectionName을 얻습니다. 이 과정은 데이터 동기화 서비스, 즉 전체 데이터 업데이트 후 별칭을 Redis로 전환하는 과정입니다.</li>
<li>Milvus는 사용자 벡터와 동시에 비동기적으로 호출되어 동일한 컬렉션의 다른 파티션에서 데이터를 가져오고, Milvus는 사용자 벡터와 항목 벡터 간의 유사도를 계산하여 각 파티션에서 유사한 항목 벡터를 TopK 개씩 반환합니다.</li>
<li>각 파티션에서 반환된 TopK 항목 벡터를 병합하고 IP 내부 곱을 사용하여 계산된 유사도 거리의 역순으로 결과의 순위를 매깁니다(벡터 사이의 거리가 클수록 더 유사함). 최종 TopK 항목 벡터가 반환됩니다.</li>
</ol>
<h2 id="Looking-Ahead" class="common-anchor-header">앞으로의 전망<button data-href="#Looking-Ahead" class="anchor-icon" translate="no">
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
    </button></h2><p>현재 Milvus 기반 벡터 검색은 추천 시나리오 검색에 꾸준히 사용될 수 있으며, 높은 성능 덕분에 모델과 알고리즘 선택의 차원을 넓힐 수 있는 여지가 더 많아졌습니다.</p>
<p>Milvus는 메인 사이트 검색의 리콜과 전체 시나리오 추천 등 더 많은 시나리오의 미들웨어로서 중요한 역할을 할 것입니다.</p>
<p>향후 Milvus에서 가장 기대되는 세 가지 기능은 다음과 같습니다.</p>
<ul>
<li>컬렉션 별칭 전환을 위한 로직 - 외부 구성 요소 없이 컬렉션 간 전환을 조정합니다.</li>
<li>필터링 메커니즘 - Milvus v0.11.0은 독립형 버전에서 ES DSL 필터링 메커니즘만 지원합니다. 새로 출시된 Milvus 2.0은 스칼라 필터링과 읽기/쓰기 분리를 지원합니다.</li>
<li>Hadoop 분산 파일 시스템(HDFS)에 대한 스토리지 지원 - 현재 사용 중인 Milvus v0.10.6은 POSIX 파일 인터페이스만 지원하며, 스토리지 백엔드로 FUSE가 지원되는 GlusterFS를 배포했습니다. 그러나 성능과 확장 용이성 측면에서 HDFS가 더 나은 선택입니다.</li>
</ul>
<h2 id="Lessons-Learned-and-Best-Practices" class="common-anchor-header">교훈 및 모범 사례<button data-href="#Lessons-Learned-and-Best-Practices" class="anchor-icon" translate="no">
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
<li>읽기 작업이 주를 이루는 애플리케이션의 경우, 읽기-쓰기 분리 배포를 통해 처리 능력을 크게 높이고 성능을 개선할 수 있습니다.</li>
<li>리콜 서비스에서 사용하는 Milvus 클라이언트는 메모리에 상주하기 때문에 Milvus Java 클라이언트에는 재연결 메커니즘이 없습니다. 따라서 하트비트 테스트를 통해 Java 클라이언트와 서버 간의 연결 가용성을 보장하기 위해 자체 연결 풀을 구축해야 합니다.</li>
<li>Milvus에서 때때로 느린 쿼리가 발생합니다. 이는 새 컬렉션의 워밍업이 충분하지 않기 때문입니다. 새 컬렉션에 대한 쿼리를 시뮬레이션하여 인덱스 파일을 메모리에 로드하여 인덱스 워밍업을 수행합니다.</li>
<li>nlist는 인덱스 구축 매개변수이고 nprobe는 쿼리 매개변수입니다. 검색 성능과 정확도의 균형을 맞추기 위해 압력 테스트 실험을 통해 비즈니스 시나리오에 따라 합리적인 임계값을 얻어야 합니다.</li>
<li>정적 데이터 시나리오의 경우 모든 데이터를 먼저 컬렉션으로 가져오고 나중에 인덱스를 구축하는 것이 더 효율적입니다.</li>
</ol>
