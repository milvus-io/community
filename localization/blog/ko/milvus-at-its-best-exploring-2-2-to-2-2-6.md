---
id: milvus-at-its-best-exploring-2-2-to-2-2-6.md
title: '밀버스 최고의 기능: v2.2부터 v2.2.6까지 살펴보기'
author: Fendy Feng
date: 2023-04-22T00:00:00.000Z
cover: assets.zilliz.com/explore_milvus_latest_versions_48a4138d02.png
tag: News
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Vector Management
desc: Milvus 2.2~2.2.6의 새로운 기능
recommend: true
canonicalUrl: 'https://milvus.io/blog/milvus-at-its-best-exploring-2-2-to-2-2-6.md'
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/exploring_milvus_latest_versions_4fa890533e.png" alt="Milvus at Its Best" class="doc-image" id="milvus-at-its-best" />
   </span> <span class="img-wrapper"> <span>최고의 밀버스</span> </span></p>
<p>Milvus 팔로워 여러분, 다시 오신 것을 환영합니다! 이 최첨단 오픈 소스 벡터 데이터베이스에 대한 업데이트를 마지막으로 공유한 지 꽤 오래되었다는 것을 알고 있습니다. 하지만 걱정하지 마세요. 지난 8월 이후 일어난 모든 흥미로운 발전 사항을 알려드리기 위해 이 자리에 모였습니다.</p>
<p>이 블로그 게시물에서는 버전 2.2부터 버전 2.2.6에 이르는 최신 Milvus 릴리스를 소개합니다. 새로운 기능, 개선 사항, 버그 수정 및 최적화 등 다양한 내용을 다루고 있습니다. 그러니 안전벨트를 단단히 매고 자세히 살펴봅시다!</p>
<h2 id="Milvus-v22-a-major-release-with-enhanced-stability-faster-search-speed-and-flexible-scalability" class="common-anchor-header">Milvus v2.2: 향상된 안정성, 빨라진 검색 속도, 유연한 확장성을 갖춘 주요 릴리즈<button data-href="#Milvus-v22-a-major-release-with-enhanced-stability-faster-search-speed-and-flexible-scalability" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus v2.2는 7가지 새로운 기능과 이전 버전에 대한 수많은 획기적인 개선 사항을 도입한 중요한 릴리스입니다. 주요 기능 중 몇 가지를 자세히 살펴보겠습니다:</p>
<ul>
<li><strong>파일에서 엔티티 대량 삽입</strong>: 이 기능을 사용하면 몇 줄의 코드만으로 하나 또는 여러 파일에 있는 엔티티 배치를 Milvus에 직접 업로드할 수 있어 시간과 노력을 절약할 수 있습니다.</li>
<li><strong>쿼리 결과 페이지 매김</strong>: 단일 RPC(원격 프로시저 호출)로 대량의 검색 및 쿼리 결과가 반환되는 것을 방지하기 위해 Milvus v2.2에서는 검색 및 쿼리에서 키워드로 오프셋 및 필터링 결과를 구성할 수 있습니다.</li>
<li><strong>역할 기반 액세스 제어(RBAC)</strong>: Milvus v2.2는 이제 RBAC를 지원하므로 사용자, 역할 및 권한을 관리하여 Milvus 인스턴스에 대한 액세스를 제어할 수 있습니다.</li>
<li><strong>할당량 및 제한</strong>: 할당량 및 제한은 Milvus v2.2의 새로운 메커니즘으로, 갑작스러운 트래픽 급증 시 메모리 부족(OOM) 오류 및 충돌로부터 데이터베이스 시스템을 보호합니다. 이 기능을 사용하면 수집, 검색 및 메모리 사용량을 제어할 수 있습니다.</li>
<li><strong>수집 수준에서의 TTL(Time to Live)</strong>: 이전 릴리즈에서는 Milvus에서 클러스터에 대한 TTL만 구성할 수 있었습니다. 그러나 Milvus v2.2에서는 이제 컬렉션 수준에서 TTL을 구성할 수 있습니다. 특정 컬렉션 및 해당 컬렉션의 엔티티에 대해 TTL을 구성하면 TTL이 종료된 후 자동으로 만료됩니다. 이 구성을 통해 데이터 보존을 보다 세밀하게 제어할 수 있습니다.</li>
<li><strong>디스크 기반 근사 근접 이웃 검색(ANNS) 인덱스(베타)</strong>: Milvus v2.2에서는 SSD에 상주하는 DiskANN과 Vamana 그래프 기반 ANNS 알고리즘을 지원합니다. 이 지원으로 대규모 데이터 세트에 대한 직접 검색이 가능해져 메모리 사용량을 최대 10배까지 크게 줄일 수 있습니다.</li>
<li><strong>데이터 백업(베타)</strong>: Milvus v2.2는 명령줄 또는 API 서버를 통해 Milvus 데이터를 올바르게 백업하고 복원할 수 있는 <a href="https://github.com/zilliztech/milvus-backup">새로운 도구를</a> 제공합니다.</li>
</ul>
<p>위에서 언급한 새로운 기능 외에도 Milvus v2.2에는 5가지 버그 수정과 Milvus의 안정성, 관찰 가능성 및 성능 향상을 위한 여러 가지 개선 사항이 포함되어 있습니다. 자세한 내용은 <a href="https://milvus.io/docs/release_notes.md#v220">Milvus v2.2 릴리스 노트를</a> 참조하세요.</p>
<h2 id="Milvus-v221--v222-minor-releases-with-issues-fixed" class="common-anchor-header">Milvus v2.2.1 및 v2.2.2: 문제가 수정된 마이너 릴리스<button data-href="#Milvus-v221--v222-minor-releases-with-issues-fixed" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus v2.2.1 및 v2.2.2는 이전 버전의 중요한 문제를 수정하고 새로운 기능을 도입하는 데 중점을 둔 마이너 릴리스입니다. 다음은 몇 가지 주요 내용입니다:</p>
<h3 id="Milvus-v221" class="common-anchor-header">Milvus v2.2.1</h3><ul>
<li>Pulsa 테넌트 및 인증 지원</li>
<li>etcd 구성 소스에서 TLS(전송 계층 보안) 지원</li>
<li>검색 성능 30% 이상 개선</li>
<li>스케줄러 최적화 및 병합 작업 확률 증가</li>
<li>인덱싱된 스칼라 필드에서 용어 필터링 실패 및 인덱스 생성 실패 시 IndexNode 패닉을 포함한 여러 버그 수정</li>
</ul>
<h3 id="Milvus-v222" class="common-anchor-header">Milvus v2.2.2</h3><ul>
<li>프록시가 샤드 리더의 캐시를 업데이트하지 않는 문제를 수정했습니다.</li>
<li>릴리즈된 컬렉션/파티션에 대해 로드된 정보가 정리되지 않는 문제 수정</li>
<li>로드 카운트가 제때 지워지지 않는 문제 수정</li>
</ul>
<p>자세한 내용은 <a href="https://milvus.io/docs/release_notes.md#v221">Milvus v2.2.1 릴리즈 노트</a> 및 <a href="https://milvus.io/docs/release_notes.md#v222">Milvus v2.2.2 릴리즈 노트를</a> 참조하세요.</p>
<h2 id="Milvus-v223-more-secure-stable-and-available" class="common-anchor-header">Milvus v2.2.3: 보안, 안정성 및 가용성 향상<button data-href="#Milvus-v223-more-secure-stable-and-available" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus v2.2.3은 시스템의 보안, 안정성 및 가용성을 강화하는 데 중점을 둔 릴리스입니다. 또한 두 가지 중요한 기능이 도입되었습니다:</p>
<ul>
<li><p><strong>롤링 업그레이드</strong>: 이 기능을 사용하면 이전 릴리스에서는 불가능했던 업그레이드 프로세스 중에 들어오는 요청에 Milvus가 응답할 수 있습니다. 롤링 업그레이드는 업그레이드 중에도 시스템을 계속 사용할 수 있고 사용자 요청에 응답할 수 있도록 보장합니다.</p></li>
<li><p><strong>코디네이터 고가용성(HA)</strong>: 이 기능을 통해 Milvus 코디네이터는 활성-대기 모드에서 작업할 수 있어 단일 지점 장애의 위험을 줄일 수 있습니다. 예상치 못한 재해가 발생하더라도 복구 시간이 최대 30초로 단축됩니다.</p></li>
</ul>
<p>이러한 새로운 기능 외에도 Milvus v2.2.3에는 향상된 대량 삽입 성능, 메모리 사용량 감소, 모니터링 지표 최적화, 메타 스토리지 성능 개선 등 수많은 개선 사항과 버그 수정이 포함되어 있습니다. 자세한 내용은 <a href="https://milvus.io/docs/release_notes.md#v223">Milvus v2.2.3 릴리즈 노트를</a> 참조하세요.</p>
<h2 id="Milvus-v224-faster-more-reliable-and-resource-saving" class="common-anchor-header">Milvus v2.2.4: 더 빠르고, 더 안정적이며, 리소스 절약<button data-href="#Milvus-v224-faster-more-reliable-and-resource-saving" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus v2.2.4는 Milvus v2.2의 마이너 업데이트입니다. 4가지 새로운 기능과 몇 가지 향상된 기능을 도입하여 성능이 향상되고 안정성이 개선되며 리소스 소비가 감소합니다. 이번 릴리스의 주요 기능은 다음과 같습니다:</p>
<ul>
<li><strong>리소스 그룹화</strong>: Milvus는 이제 쿼리 노드를 다른 리소스 그룹으로 그룹화하여 서로 다른 그룹의 물리적 리소스에 대한 액세스를 완전히 격리할 수 있도록 지원합니다.</li>
<li><strong>컬렉션 이름 변경</strong>: 컬렉션 이름 변경 API를 통해 사용자는 컬렉션의 이름을 변경할 수 있어 컬렉션을 보다 유연하게 관리하고 사용성을 개선할 수 있습니다.</li>
<li><strong>Google 클라우드 스토리지 지원</strong></li>
<li><strong>검색 및 쿼리 API의 새로운 옵션</strong>: 이 새로운 기능을 통해 사용자는 증가하는 모든 세그먼트에서 검색을 건너뛸 수 있어 데이터 삽입과 동시에 검색이 수행되는 시나리오에서 더 나은 검색 성능을 제공할 수 있습니다.</li>
</ul>
<p>자세한 내용은 <a href="https://milvus.io/docs/release_notes.md#v224">Milvus v2.2.4 릴리즈 노트를</a> 참조하세요.</p>
<h2 id="Milvus-v225-NOT-RECOMMENDED" class="common-anchor-header">Milvus v2.2.5: 권장되지 않음<button data-href="#Milvus-v225-NOT-RECOMMENDED" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus v2.2.5에는 몇 가지 중요한 문제가 있으므로 이 릴리스의 사용을 권장하지 않습니다.  이로 인해 불편을 끼쳐 드린 점 진심으로 사과드립니다. 그러나 이러한 문제는 Milvus v2.2.6에서 해결되었습니다.</p>
<h2 id="Milvus-v226-resolves-critical-issues-from-v225" class="common-anchor-header">Milvus v2.2.6: v2.2.5의 중요한 문제 해결<button data-href="#Milvus-v226-resolves-critical-issues-from-v225" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus v2.2.6은 더티 빈로그 데이터 재활용 문제와 DataCoord GC 오류를 포함하여 v2.2.5에서 발견된 중요한 문제를 성공적으로 해결했습니다. 현재 v2.2.5를 사용 중이라면 최적의 성능과 안정성을 보장하기 위해 업그레이드하시기 바랍니다.</p>
<p>수정된 중요한 문제는 다음과 같습니다:</p>
<ul>
<li>DataCoord GC 실패</li>
<li>전달된 인덱스 매개변수 재정의</li>
<li>RootCoord 메시지 백로그로 인한 시스템 지연</li>
<li>메트릭 RootCoordInsertChannelTimeTick의 부정확성</li>
<li>타임스탬프 중지 가능성</li>
<li>재시작 프로세스 중 가끔씩 코디네이터 역할이 자체 파괴됨</li>
<li>비정상적인 가비지 수집 종료로 인해 체크포인트가 뒤처지는 현상</li>
</ul>
<p>자세한 내용은 <a href="https://milvus.io/docs/release_notes.md#v226">Milvus v2.2.6 릴리즈 노트를</a> 참조하세요.</p>
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
    </button></h2><p>결론적으로, v2.2부터 v2.2.6까지의 최신 Milvus 릴리스에는 많은 흥미로운 업데이트와 개선 사항이 포함되어 있습니다. 새로운 기능부터 버그 수정 및 최적화에 이르기까지 Milvus는 최첨단 솔루션을 제공하고 다양한 영역의 애플리케이션을 강화하기 위한 노력을 계속하고 있습니다. Milvus 커뮤니티의 더 많은 흥미로운 업데이트와 혁신을 기대해 주세요.</p>
