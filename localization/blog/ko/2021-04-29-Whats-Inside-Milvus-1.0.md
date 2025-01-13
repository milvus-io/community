---
id: Whats-Inside-Milvus-1.0.md
title: Milvus 1.0에는 무엇이 있나요?
author: milvus
date: 2021-04-29T08:46:04.019Z
desc: Milvus v1.0을 지금 사용할 수 있습니다. Milvus 기본 사항과 Milvus v1.0의 주요 기능에 대해 알아보세요.
cover: assets.zilliz.com/Milvus_510cf50aee.jpeg
tag: Engineering
canonicalUrl: 'https://zilliz.com/blog/Whats-Inside-Milvus-1.0'
---
<custom-h1>Milvus 1.0에는 무엇이 있나요?</custom-h1><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Milvus_510cf50aee.jpeg" alt="Milvus.jpeg" class="doc-image" id="milvus.jpeg" />
   </span> <span class="img-wrapper"> <span>Milvus.jpeg</span> </span></p>
<p>Milvus는 백만, 억, 조 단위의 방대한 벡터 데이터세트를 관리하도록 설계된 오픈 소스 벡터 데이터베이스입니다. Milvus는 신약 개발, 컴퓨터 비전, 자율 주행, 추천 엔진, 챗봇 등 다양한 분야에서 폭넓게 활용되고 있습니다.</p>
<p>2021년 3월, Milvus의 개발사인 Zilliz는 플랫폼의 첫 번째 장기 지원 버전인 Milvus v1.0을 출시했습니다. 수개월간의 광범위한 테스트 끝에 세계에서 가장 인기 있는 벡터 데이터베이스의 안정적이고 프로덕션에 사용할 수 있는 버전이 출시되었습니다. 이 블로그 문서에서는 Milvus의 기본 사항과 v1.0의 주요 기능을 다룹니다.</p>
<p><br/></p>
<h3 id="Milvus-distributions" class="common-anchor-header">Milvus 배포판</h3><p>Milvus는 CPU 전용 배포판과 GPU 지원 배포판으로 제공됩니다. 전자는 인덱스 구축과 검색을 위해 CPU에만 의존하며, 후자는 CPU와 GPU 하이브리드 검색과 인덱스 구축을 가능하게 하여 Milvus를 더욱 가속화합니다. 예를 들어, 하이브리드 배포를 사용하면 CPU는 검색에, GPU는 인덱스 구축에 사용할 수 있어 쿼리 효율성이 더욱 향상됩니다.</p>
<p>두 Milvus 배포판 모두 Docker에서 사용할 수 있습니다. 사용 중인 운영 체제가 지원하는 경우 Docker에서 Milvus를 컴파일하거나 Linux의 소스 코드에서 Milvus를 컴파일할 수 있습니다(다른 운영 체제는 지원되지 않음).</p>
<p><br/></p>
<h3 id="Embedding-vectors" class="common-anchor-header">벡터 임베딩</h3><p>벡터는 Milvus에 엔티티로 저장됩니다. 각 엔티티에는 하나의 벡터 ID 필드와 하나의 벡터 필드가 있습니다. Milvus v1.0은 정수 벡터 ID만 지원합니다. Milvus 내에서 컬렉션을 생성할 때 벡터 ID를 자동으로 생성하거나 수동으로 정의할 수 있습니다. Milvus는 자동 생성된 벡터 ID가 고유하도록 보장하지만, 수동으로 정의된 ID는 Milvus 내에서 중복될 수 있습니다. ID를 수동으로 정의하는 경우, 사용자는 모든 ID가 고유한지 확인해야 할 책임이 있습니다.</p>
<p><br/></p>
<h3 id="Partitions" class="common-anchor-header">파티션</h3><p>Milvus는 컬렉션에 파티션 생성을 지원합니다. 데이터가 정기적으로 삽입되고 기록 데이터가 중요하지 않은 경우(예: 스트리밍 데이터), 파티션을 사용하여 벡터 유사도 검색을 가속화할 수 있습니다. 하나의 컬렉션에는 최대 4,096개의 파티션이 있을 수 있습니다. 특정 파티션 내에서 벡터 검색을 지정하면 검색 범위가 좁아지고 특히 1조 개 이상의 벡터가 포함된 컬렉션의 경우 쿼리 시간이 크게 단축될 수 있습니다.</p>
<p><br/></p>
<h3 id="Index-algorithm-optimizations" class="common-anchor-header">인덱스 알고리즘 최적화</h3><p>Milvus는 Faiss, NMSLIB, Annoy 등 널리 채택된 여러 인덱스 라이브러리를 기반으로 구축되었습니다. Milvus는 이러한 인덱스 라이브러리를 위한 기본 래퍼 그 이상입니다. 다음은 기본 라이브러리에 적용된 몇 가지 주요 개선 사항입니다:</p>
<ul>
<li>Elkan k-평균 알고리즘을 사용한 IVF 인덱스 성능 최적화.</li>
<li>FLAT 검색 최적화.</li>
<li>데이터 정확도 저하 없이 인덱스 파일 크기를 최대 75%까지 줄일 수 있는 IVF_SQ8H 하이브리드 인덱스 지원. IVF_SQ8H는 IVF_SQ8을 기반으로 구축되었으며, 리콜은 동일하지만 쿼리 속도는 훨씬 빠릅니다. Milvus를 위해 특별히 설계되어 GPU의 병렬 처리 용량과 CPU/GPU 공동 처리 간의 시너지 잠재력을 활용할 수 있습니다.</li>
<li>동적 명령어 세트 호환성.</li>
</ul>
<p><br/></p>
<h3 id="Search-index-building-and-other-Milvus-optimizations" class="common-anchor-header">검색, 색인 구축 및 기타 Milvus 최적화</h3><p>검색 및 색인 구축 성능을 개선하기 위해 다음과 같은 최적화가 Milvus에 적용되었습니다.</p>
<ul>
<li>검색 성능은 쿼리 수(nq)가 CPU 스레드 수보다 적은 상황에서 최적화됩니다.</li>
<li>Milvus는 동일한 topK와 검색 매개변수를 사용하는 클라이언트의 검색 요청을 결합합니다.</li>
<li>검색 요청이 들어오면 인덱스 구축이 일시 중단됩니다.</li>
<li>Milvus는 시작할 때 컬렉션을 메모리에 자동으로 미리 로드합니다.</li>
<li>벡터 유사도 검색을 가속화하기 위해 여러 개의 GPU 장치를 할당할 수 있습니다.</li>
</ul>
<p><br/></p>
<h3 id="Distance-metrics" class="common-anchor-header">거리 메트릭</h3><p>Milvus는 벡터 유사도 검색을 강화하기 위해 구축된 벡터 데이터베이스입니다. 이 플랫폼은 MLOps와 프로덕션 수준의 AI 애플리케이션을 염두에 두고 구축되었습니다. Milvus는 유사도 계산을 위해 유클리드 거리(L2), 내부 곱(IP), 자카드 거리, 타니모토, 해밍 거리, 상부 구조 및 하부 구조 등 광범위한 거리 메트릭을 지원합니다. 마지막 두 메트릭은 분자 검색과 AI 기반 신약 발견에 일반적으로 사용됩니다.</p>
<p><br/></p>
<h3 id="Logging" class="common-anchor-header">로깅</h3><p>Milvus는 로그 로테이션을 지원합니다. 시스템 구성 파일인 milvus.yaml에서 단일 로그 파일의 크기, 로그 파일 수, 로그 출력을 stdout으로 설정할 수 있습니다.</p>
<p><br/></p>
<h3 id="Distributed-solution" class="common-anchor-header">분산 솔루션</h3><p>밀버스 샤딩 미들웨어인 미샤드는 밀버스의 분산 솔루션입니다. 하나의 쓰기 노드와 무제한의 읽기 노드를 갖춘 미샤드는 서버 클러스터의 연산 잠재력을 최대한 발휘합니다. 요청 전달, 읽기/쓰기 분할, 동적/수평 확장 등의 기능을 제공합니다.</p>
<p><br/></p>
<h3 id="Monitoring" class="common-anchor-header">모니터링</h3><p>Milvus는 오픈 소스 시스템 모니터링 및 알림 툴킷인 Prometheus와 호환됩니다. Milvus는 Prometheus의 푸시 게이트웨이에 대한 지원을 추가하여 Prometheus가 단기 배치 지표를 수집할 수 있도록 합니다. 모니터링 및 알림 시스템은 다음과 같이 작동합니다:</p>
<ul>
<li>Milvus 서버가 사용자 정의된 지표 데이터를 Pushgateway로 푸시합니다.</li>
<li>푸시게이트웨이는 일시적인 지표 데이터를 Prometheus로 안전하게 전송합니다.</li>
<li>Prometheus는 Pushgateway에서 데이터를 계속 가져옵니다.</li>
<li>알림 관리자는 다양한 지표에 대한 알림 임계값을 설정하고 이메일 또는 메시지를 통해 알림을 전송하는 데 사용됩니다.</li>
</ul>
<p><br/></p>
<h3 id="Metadata-management" class="common-anchor-header">메타데이터 관리</h3><p>Milvus는 기본적으로 메타데이터 관리를 위해 SQLite를 사용합니다. SQLite는 Milvus에서 구현되며 별도의 구성이 필요하지 않습니다. 프로덕션 환경에서는 메타데이터 관리를 위해 MySQL을 사용하는 것이 좋습니다.</p>
<p><br/></p>
<h3 id="Engage-with-our-open-source-community" class="common-anchor-header">오픈 소스 커뮤니티에 참여하세요:</h3><ul>
<li><a href="https://github.com/milvus-io/milvus/">GitHub에서</a> Milvus를 찾거나 기여하세요.</li>
<li><a href="https://join.slack.com/t/milvusio/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ">Slack을</a> 통해 커뮤니티와 소통하세요.</li>
<li><a href="https://twitter.com/milvusio">트위터에서</a> 소통하세요.</li>
</ul>
