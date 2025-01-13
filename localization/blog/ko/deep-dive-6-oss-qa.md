---
id: deep-dive-6-oss-qa.md
title: 오픈 소스 소프트웨어(OSS) 품질 보증 - Milvus 사례 연구
author: Wenxing Zhu
date: 2022-04-25T00:00:00.000Z
desc: 품질 보증은 제품이나 서비스가 특정 요구 사항을 충족하는지 여부를 판단하는 프로세스입니다.
cover: assets.zilliz.com/Deep_Dive_6_c2cd44801d.png
tag: Engineering
tags: 'Data science, Database, Tech, Artificial Intelligence, Vector Management'
canonicalUrl: 'https://milvus.io/blog/deep-dive-6-oss-qa.md'
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Deep_Dive_6_c2cd44801d.png" alt="Cover image" class="doc-image" id="cover-image" />
   </span> <span class="img-wrapper"> <span>표지 이미지</span> </span></p>
<blockquote>
<p>이 문서는 <a href="https://github.com/zhuwenxing">Wenxing Zhu가</a> 작성하고 <a href="https://www.linkedin.com/in/yiyun-n-2aa713163/">Angela Ni가</a> 번역했습니다.</p>
</blockquote>
<p>품질 보증(QA)은 제품이나 서비스가 특정 요구 사항을 충족하는지 여부를 판단하는 체계적인 프로세스입니다. QA 시스템은 이름에서 알 수 있듯이 제품의 품질을 보장하기 때문에 R&amp;D 프로세스에서 없어서는 안 될 부분입니다.</p>
<p>이 글에서는 Milvus 벡터 데이터베이스 개발에 채택된 QA 프레임워크를 소개하여 개발자와 사용자가 프로세스에 참여할 수 있는 가이드라인을 제공하고자 합니다. 또한 Milvus의 주요 테스트 모듈과 QA 테스트의 효율성을 개선하는 데 활용할 수 있는 방법 및 도구에 대해서도 다룹니다.</p>
<p><strong>바로가기:</strong></p>
<ul>
<li><a href="#A-general-introduction-to-the-Milvus-QA-system">Milvus QA 시스템에 대한 일반적인 소개</a></li>
<li><a href="#Test-modules-in-Milvus">Milvus의 테스트 모듈</a></li>
<li><a href="#Tools-and-methods-for-better-QA-efficiency">QA 효율성 향상을 위한 도구 및 방법</a></li>
</ul>
<h2 id="A-general-introduction-to-the-Milvus-QA-system" class="common-anchor-header">Milvus QA 시스템에 대한 일반적인 소개<button data-href="#A-general-introduction-to-the-Milvus-QA-system" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md">시스템 아키텍처는</a> QA 테스트를 수행하는 데 매우 중요합니다. QA 엔지니어가 시스템에 익숙할수록 합리적이고 효율적인 테스트 계획을 수립할 가능성이 높아집니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Milvus_architecture_feaccc489d.png" alt="Milvus architecture" class="doc-image" id="milvus-architecture" />
   </span> <span class="img-wrapper"> <span>Milvus 아키텍처</span> </span></p>
<p>Milvus 2.0은 <a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md#A-cloud-native-first-approach">클라우드 네이티브, 분산형, 계층화된 아키텍처를</a> 채택하고 있으며, SDK는 Milvus에서 <a href="https://milvus.io/blog/deep-dive-2-milvus-sdk-and-api.md">데이터가 유입되는 주요 입구입니다</a>. Milvus 사용자는 SDK를 매우 자주 활용하므로 SDK 측면의 기능 테스트가 매우 필요합니다. 또한 SDK에 대한 기능 테스트는 Milvus 시스템 내에 존재할 수 있는 내부 문제를 감지하는 데 도움이 될 수 있습니다. 기능 테스트 외에도 단위 테스트, 배포 테스트, 신뢰성 테스트, 안정성 테스트, 성능 테스트 등 다른 유형의 테스트도 벡터 데이터베이스에서 수행됩니다.</p>
<p>클라우드 네이티브 및 분산 아키텍처는 QA 테스트에 편리함과 어려움을 동시에 제공합니다. 로컬에 배포되어 실행되는 시스템과 달리, Kubernetes 클러스터에 배포되어 실행되는 Milvus 인스턴스는 소프트웨어 개발과 동일한 환경에서 소프트웨어 테스트를 수행하도록 보장할 수 있습니다. 그러나 단점은 분산 아키텍처의 복잡성으로 인해 불확실성이 증가하여 시스템의 QA 테스트를 더욱 어렵고 힘들게 만들 수 있다는 것입니다. 예를 들어 Milvus 2.0은 다양한 구성 요소의 마이크로서비스를 사용하므로 <a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md#A-bare-bones-skeleton-of-the-Milvus-architecture">서비스 및 노드</a> 수가 증가하고 시스템 오류가 발생할 가능성이 더 커집니다. 따라서 테스트 효율성을 높이기 위해서는 보다 정교하고 포괄적인 QA 계획이 필요합니다.</p>
<h3 id="QA-testings-and-issue-management" class="common-anchor-header">QA 테스트 및 이슈 관리</h3><p>Milvus의 QA에는 테스트 수행과 소프트웨어 개발 중 발생하는 이슈 관리가 모두 포함됩니다.</p>
<h4 id="QA-testings" class="common-anchor-header">QA 테스트</h4><p>밀버스는 아래 이미지와 같이 밀버스의 기능 및 사용자 요구사항에 따라 우선순위에 따라 다양한 유형의 QA 테스트를 수행합니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Frame_1_14_2aff081d41.png" alt="QA testing priority" class="doc-image" id="qa-testing-priority" />
   </span> <span class="img-wrapper"> <span>QA 테스트 우선순위</span> </span></p>
<p>Milvus에서는 다음과 같은 부분에 대해 다음과 같은 우선순위에 따라 QA 테스트를 진행합니다:</p>
<ol>
<li><strong>기능</strong>: 기능과 기능이 원래 설계된 대로 작동하는지 확인합니다.</li>
<li><strong>배포</strong>: 사용자가 다양한 방법(Docker Compose, Helm, APT 또는 YUM 등)으로 Milvus 독립형 버전과 Milvus 클러스터를 모두 배포, 재설치 및 업그레이드할 수 있는지 확인합니다.</li>
<li><strong>성능</strong>:  Milvus에서 데이터 삽입, 인덱싱, 벡터 검색 및 쿼리 성능을 테스트합니다.</li>
<li><strong>안정성</strong>: 정상 수준의 워크로드에서 5~10일 동안 Milvus가 안정적으로 실행되는지 확인합니다.</li>
<li><strong>신뢰성</strong>: 특정 시스템 오류가 발생해도 Milvus가 부분적으로 작동할 수 있는지 테스트합니다.</li>
<li><strong>구성</strong>: 특정 구성에서 Milvus가 예상대로 작동하는지 확인합니다.</li>
<li><strong>호환성</strong>: Milvus가 다양한 유형의 하드웨어 또는 소프트웨어와 호환되는지 테스트합니다.</li>
</ol>
<h4 id="Issue-management" class="common-anchor-header">이슈 관리</h4><p>소프트웨어 개발 중에는 많은 이슈가 발생할 수 있습니다. 템플릿 이슈의 작성자는 QA 엔지니어 자신 또는 오픈 소스 커뮤니티의 Milvus 사용자가 될 수 있습니다. QA 팀은 이슈를 파악할 책임이 있습니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Issue_management_workflow_12c726efa1.png" alt="Issue management workflow" class="doc-image" id="issue-management-workflow" />
   </span> <span class="img-wrapper"> <span>이슈 관리 워크플로</span> </span></p>
<p><a href="https://github.com/milvus-io/milvus/issues">이슈가</a> 생성되면 먼저 분류 작업을 거치게 됩니다. 분류하는 동안 새로운 이슈를 검토하여 이슈에 대한 충분한 세부 정보가 제공되었는지 확인합니다. 이슈가 확인되면 개발자가 이를 수락하고 이슈를 수정하기 위해 노력합니다. 개발이 완료되면 이슈 작성자는 이슈가 수정되었는지 확인해야 합니다. 문제가 해결되었다면 이슈는 최종적으로 종료됩니다.</p>
<h3 id="When-is-QA-needed" class="common-anchor-header">QA는 언제 필요한가요?</h3><p>흔히 오해하는 것 중 하나는 QA와 개발이 서로 독립적이라는 것입니다. 하지만 사실 시스템의 품질을 보장하기 위해서는 개발자와 QA 엔지니어 모두의 노력이 필요합니다. 따라서 QA는 전체 수명 주기 동안 참여해야 합니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/QA_lifecycle_375f4fd8a8.png" alt="QA lifecycle" class="doc-image" id="qa-lifecycle" />
   </span> <span class="img-wrapper"> <span>QA 수명 주기</span> </span></p>
<p>위 그림에서 볼 수 있듯이 전체 소프트웨어 R&amp;D 수명 주기에는 세 단계가 포함됩니다.</p>
<p>초기 단계에서는 개발자가 설계 문서를 게시하고, QA 엔지니어가 테스트 계획을 수립하고, 릴리스 기준을 정의하고, QA 작업을 할당합니다. 개발자와 QA 엔지니어는 디자인 문서와 테스트 계획을 모두 숙지하여 두 팀 간에 릴리스의 목표(기능, 성능, 안정성, 버그 수렴 등)에 대한 상호 이해가 공유되도록 해야 합니다.</p>
<p>R&amp;D 단계에서는 개발과 QA 테스트가 자주 상호 작용하여 기능을 개발 및 검증하고 오픈 소스 <a href="https://slack.milvus.io/">커뮤니티에서</a> 보고된 버그와 문제를 수정합니다.</p>
<p>마지막 단계에서 릴리스 기준이 충족되면 새로운 Milvus 버전의 새로운 Docker 이미지가 릴리스됩니다. 공식 릴리스에는 새로운 기능과 수정된 버그에 초점을 맞춘 릴리스 노트와 릴리스 태그가 필요합니다. 그런 다음 QA 팀에서 이 릴리스에 대한 테스트 보고서도 게시합니다.</p>
<h2 id="Test-modules-in-Milvus" class="common-anchor-header">Milvus의 테스트 모듈<button data-href="#Test-modules-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus에는 여러 테스트 모듈이 있으며 이 섹션에서는 각 모듈에 대해 자세히 설명합니다.</p>
<h3 id="Unit-test" class="common-anchor-header">단위 테스트</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Unit_test_7d3d422345.png" alt="Unit test" class="doc-image" id="unit-test" />
   </span> <span class="img-wrapper"> <span>단위 테스트</span> </span></p>
<p>단위 테스트는 소프트웨어 버그를 조기에 식별하고 코드 재구성을 위한 검증 기준을 제공하는 데 도움이 될 수 있습니다. Milvus PR(풀 리퀘스트) 수락 기준에 따르면 코드 단위 테스트의 <a href="https://app.codecov.io/gh/milvus-io/milvus/">커버리지는</a> 80%여야 합니다.</p>
<h3 id="Function-test" class="common-anchor-header">기능 테스트</h3><p>Milvus의 함수 테스트는 주로 <a href="https://github.com/milvus-io/pymilvus">PyMilvus와</a> SDK를 중심으로 구성됩니다. 함수 테스트의 주요 목적은 인터페이스가 설계된 대로 작동하는지 확인하는 것입니다. 함수 테스트에는 두 가지 측면이 있습니다:</p>
<ul>
<li>올바른 매개변수가 전달되었을 때 SDK가 예상 결과를 반환할 수 있는지 테스트합니다.</li>
<li>SDK가 오류를 처리하고 잘못된 매개변수가 전달될 때 적절한 오류 메시지를 반환할 수 있는지 테스트합니다.</li>
</ul>
<p>아래 그림은 주류 <a href="https://pytest.org/">pytest</a> 프레임워크를 기반으로 하는 현재 기능 테스트를 위한 프레임워크를 보여줍니다. 이 프레임워크는 PyMilvus에 래퍼를 추가하고 자동화된 테스트 인터페이스를 통해 테스트를 강화합니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Function_test_41f837d3e7.png" alt="Function test" class="doc-image" id="function-test" />
   </span> <span class="img-wrapper"> <span>함수 테스트</span> </span></p>
<p>공유 테스트 방법이 필요하고 일부 함수를 재사용해야 한다는 점을 고려하여 PyMilvus 인터페이스를 직접 사용하는 대신 위의 테스트 프레임워크를 채택했습니다. 프레임워크에는 예상값과 실제값을 편리하게 검증할 수 있는 '체크' 모듈도 포함되어 있습니다.</p>
<p>2,700개에 달하는 함수 테스트 케이스가 <code translate="no">tests/python_client/testcases</code> 디렉토리에 통합되어 거의 모든 PyMilvus 인터페이스를 완벽하게 다룹니다. 이러한 기능 테스트는 각 PR의 품질을 엄격하게 감독합니다.</p>
<h3 id="Deployment-test" class="common-anchor-header">배포 테스트</h3><p>Milvus는 <a href="https://milvus.io/docs/v2.0.x/install_standalone-docker.md">독립형과</a> <a href="https://milvus.io/docs/v2.0.x/install_cluster-docker.md">클러스터의</a> 두 가지 모드로 제공됩니다. 그리고 Milvus를 배포하는 방법에는 크게 두 가지가 있습니다: Docker Compose 또는 Helm을 사용하는 것입니다. 또한 Milvus를 배포한 후 사용자는 Milvus 서비스를 다시 시작하거나 업그레이드할 수도 있습니다. 배포 테스트에는 재시작 테스트와 업그레이드 테스트의 두 가지 주요 범주가 있습니다.</p>
<p>재시작 테스트는 데이터 지속성, 즉 재시작 후에도 데이터를 계속 사용할 수 있는지 여부를 테스트하는 프로세스를 말합니다. 업그레이드 테스트는 호환되지 않는 형식의 데이터가 Milvus에 삽입되는 상황을 방지하기 위해 데이터 호환성을 테스트하는 프로세스를 말합니다. 두 가지 유형의 배포 테스트는 아래 이미지와 같이 동일한 워크플로우를 공유합니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Deployment_test_342ab3b3f5.png" alt="Deployment test" class="doc-image" id="deployment-test" />
   </span> <span class="img-wrapper"> <span>배포 테스트</span> </span></p>
<p>재시작 테스트에서 두 배포는 동일한 도커 이미지를 사용합니다. 그러나 업그레이드 테스트에서는 첫 번째 배포는 이전 버전의 도커 이미지를 사용하고 두 번째 배포는 이후 버전의 도커 이미지를 사용합니다. 테스트 결과 및 데이터는 <code translate="no">Volumes</code> 파일 또는 <a href="https://kubernetes.io/docs/concepts/storage/persistent-volumes/">영구 볼륨 클레임</a> (PVC)에 저장됩니다.</p>
<p>첫 번째 테스트를 실행할 때는 여러 컬렉션이 생성되고 각 컬렉션에 대해 서로 다른 작업이 수행됩니다. 두 번째 테스트를 실행할 때는 생성된 컬렉션을 CRUD 작업에 계속 사용할 수 있는지, 그리고 새 컬렉션을 추가로 만들 수 있는지 확인하는 데 중점을 둡니다.</p>
<h3 id="Reliability-test" class="common-anchor-header">안정성 테스트</h3><p>클라우드 네이티브 분산 시스템의 신뢰성 테스트는 일반적으로 카오스 엔지니어링 방법을 채택하여 오류와 시스템 장애를 사전에 차단하는 것을 목적으로 합니다. 즉, 카오스 엔지니어링 테스트에서는 의도적으로 시스템 장애를 생성하여 압력 테스트에서 문제를 식별하고 실제로 위험이 발생하기 전에 시스템 장애를 수정합니다. Milvus의 카오스 테스트에서는 카오스를 생성하는 도구로 카오스 <a href="https://chaos-mesh.org/">메시를</a> 선택합니다. 생성해야 하는 실패 유형에는 여러 가지가 있습니다:</p>
<ul>
<li><strong>파드 킬</strong>: 노드가 다운되는 시나리오의 시뮬레이션.</li>
<li><strong>파드 실패</strong>: 워커 노드 파드 중 하나에 장애가 발생하면 전체 시스템이 계속 작동할 수 있는지 테스트합니다.</li>
<li><strong>메모리 스트레스</strong>: 작업 노드에서 메모리 및 CPU 리소스를 많이 사용하는 시뮬레이션.</li>
<li><strong>네트워크 파티션</strong>: Milvus는 <a href="https://milvus.io/docs/v2.0.x/four_layers.md">스토리지와 컴퓨팅을 분리하기</a> 때문에 시스템은 다양한 구성 요소 간의 통신에 크게 의존합니다. 서로 다른 포드 간의 통신이 분할되는 시나리오의 시뮬레이션은 서로 다른 Milvus 구성 요소의 상호 의존성을 테스트하는 데 필요합니다.</li>
</ul>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Reliability_test_a7331b91f4.png" alt="Reliability test" class="doc-image" id="reliability-test" />
   </span> <span class="img-wrapper"> <span>신뢰성 테스트</span> </span></p>
<p>위 그림은 카오스 테스트를 자동화할 수 있는 Milvus의 신뢰성 테스트 프레임워크를 보여줍니다. 신뢰성 테스트의 워크플로는 다음과 같습니다:</p>
<ol>
<li>배포 구성을 읽어 Milvus 클러스터를 초기화합니다.</li>
<li>클러스터가 준비되면 <code translate="no">test_e2e.py</code> 을 실행하여 Milvus 기능을 사용할 수 있는지 테스트합니다.</li>
<li><code translate="no">hello_milvus.py</code> 을 실행하여 데이터 지속성을 테스트합니다. 데이터 삽입, 플러시, 인덱스 구축, 벡터 검색 및 쿼리를 위해 "hello_milvus"라는 이름의 컬렉션을 만듭니다. 이 컬렉션은 테스트 중에 해제되거나 삭제되지 않습니다.</li>
<li>생성, 삽입, 플러시, 색인, 검색 및 쿼리 작업을 실행하는 6개의 스레드를 시작하는 모니터링 객체를 생성합니다.</li>
</ol>
<pre><code translate="no">checkers = {
    Op.create: CreateChecker(),
    Op.insert: InsertFlushChecker(),
    Op.flush: InsertFlushChecker(flush=<span class="hljs-literal">True</span>),
    Op.index: IndexChecker(),
    Op.search: SearchChecker(),
    Op.query: QueryChecker()
}
<button class="copy-code-btn"></button></code></pre>
<ol start="5">
<li>첫 번째 어설션을 수행합니다. 모든 작업이 예상대로 성공합니다.</li>
<li>카오스 메시를 사용하여 장애를 정의하는 yaml 파일을 파싱하여 Milvus에 시스템 장애를 도입합니다. 예를 들어 5초마다 쿼리 노드가 죽는 실패가 발생할 수 있습니다.</li>
<li>시스템 장애를 도입하면서 두 번째 어설션 만들기 - 시스템 장애가 발생하는 동안 Milvus에서 반환된 작업 결과가 예상과 일치하는지 판단합니다.</li>
<li>카오스 메시를 통해 장애를 제거합니다.</li>
<li>Milvus 서비스가 복구되면(모든 파드가 준비되었음을 의미), 세 번째 어설션을 수행하여 모든 작업이 예상대로 성공했는지 확인합니다.</li>
<li><code translate="no">test_e2e.py</code> 을 실행하여 Milvus 기능을 사용할 수 있는지 테스트합니다. 세 번째 어설션으로 인해 혼돈 중에 일부 작업이 차단될 수 있습니다. 또한 혼돈이 제거된 후에도 일부 작업이 계속 차단되어 세 번째 어설션이 예상대로 성공하지 못할 수 있습니다. 이 단계는 세 번째 어설션을 용이하게 하기 위한 것으로, Milvus 서비스가 복구되었는지 확인하기 위한 표준으로 사용됩니다.</li>
<li><code translate="no">hello_milvus.py</code> 을 실행하여 생성된 컬렉션을 로드하고 컬렉션에 대해 CRUP 작업을 수행합니다. 그런 다음 시스템 장애 이전에 존재하던 데이터가 장애 복구 후에도 여전히 사용 가능한지 확인합니다.</li>
<li>로그를 수집합니다.</li>
</ol>
<h3 id="Stability-and-performance-test" class="common-anchor-header">안정성 및 성능 테스트</h3><p>아래 그림은 안정성 및 성능 테스트의 목적, 테스트 시나리오, 측정 항목에 대해 설명합니다.</p>
<table>
<thead>
<tr><th></th><th>안정성 테스트</th><th>성능 테스트</th></tr>
</thead>
<tbody>
<tr><td>목적</td><td>- 정상적인 워크로드에서 일정 시간 동안 Milvus가 원활하게 작동하는지 확인합니다. <br> - Milvus 서비스 시작 시 리소스가 안정적으로 소비되는지 확인합니다.</td><td>- 모든 Milvus 인터페이스의 성능을 테스트합니다. <br> - 성능 테스트를 통해 최적의 구성을 찾아보세요.  <br> - 향후 릴리스의 벤치마크로 활용하세요. <br> - 더 나은 성능을 방해하는 병목 현상을 찾아보세요.</td></tr>
<tr><td>시나리오</td><td>- 삽입 후 데이터가 거의 업데이트되지 않고 각 요청 유형별 처리 비율이 검색 요청 90%, 삽입 요청 5%, 기타 5%인 오프라인 읽기 집약적 시나리오. <br> - 데이터 삽입과 검색이 동시에 이루어지고 각 요청 유형별 처리 비율은 삽입 요청 50%, 검색 요청 40%, 기타 10%인 온라인 쓰기 집약적 시나리오.</td><td>- 데이터 삽입 <br> - 색인 구축 <br> - 벡터 검색</td></tr>
<tr><td>메트릭</td><td>- 메모리 사용량 <br> - CPU 사용량 <br> - IO 지연 시간 <br> - Milvus 포드 상태 <br> - Milvus 서비스의 응답 시간 <br> 등</td><td>- 데이터 삽입 중 데이터 처리량 <br> - 인덱스 구축에 걸리는 시간 <br> - 벡터 검색 중 응답 시간 <br> - 초당 쿼리 수(QPS) <br> - 초당 요청 수  <br> - 리콜률 <br> 등</td></tr>
</tbody>
</table>
<p>안정성 테스트와 성능 테스트는 모두 동일한 워크플로우를 공유합니다:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Stability_and_performance_test_6ed8532697.png" alt="Stability and performance test" class="doc-image" id="stability-and-performance-test" />
   </span> <span class="img-wrapper"> <span>안정성 및 성능 테스트</span> </span></p>
<ol>
<li>구문 분석 및 구성 업데이트, 메트릭 정의. <code translate="no">server-configmap</code> 은 Milvus 스탠드얼론 또는 클러스터 구성에 해당하고 <code translate="no">client-configmap</code> 은 테스트 케이스 구성에 해당합니다.</li>
<li>서버와 클라이언트를 구성합니다.</li>
<li>데이터 준비</li>
<li>서버와 클라이언트 간의 상호 작용을 요청합니다.</li>
<li>메트릭을 보고 및 표시합니다.</li>
</ol>
<h2 id="Tools-and-methods-for-better-QA-efficiency" class="common-anchor-header">QA 효율성 향상을 위한 도구 및 방법<button data-href="#Tools-and-methods-for-better-QA-efficiency" class="anchor-icon" translate="no">
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
    </button></h2><p>모듈 테스트 섹션에서 대부분의 테스트 절차가 사실상 거의 동일하다는 것을 알 수 있으며, 주로 Milvus 서버 및 클라이언트 구성을 수정하고 API 매개 변수를 전달하는 것이 포함됩니다. 여러 구성이 있는 경우, 다양한 구성의 조합이 다양할수록 이러한 실험과 테스트에서 다룰 수 있는 테스트 시나리오가 더 많아집니다. 따라서 테스트 효율성을 높이는 과정에서 코드와 절차의 재사용이 더욱 중요해집니다.</p>
<h3 id="SDK-test-framework" class="common-anchor-header">SDK 테스트 프레임워크</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/SDK_test_framework_8219e28f4c.png" alt="SDK test framework" class="doc-image" id="sdk-test-framework" />
   </span> <span class="img-wrapper"> <span>SDK 테스트 프레임워크</span> </span></p>
<p>테스트 프로세스를 가속화하기 위해 원래 테스트 프레임워크에 <code translate="no">API_request</code> 래퍼를 추가하고 이를 API 게이트웨이와 유사한 것으로 설정할 수 있습니다. 이 API 게이트웨이는 모든 API 요청을 수집한 다음 Milvus에 전달하여 응답을 일괄적으로 수신하는 역할을 담당합니다. 이러한 응답은 나중에 클라이언트로 다시 전달됩니다. 이러한 설계를 통해 매개변수와 같은 특정 로그 정보와 반환된 결과를 훨씬 쉽게 캡처할 수 있습니다. 또한 SDK 테스트 프레임워크의 검사기 컴포넌트는 Milvus의 결과를 확인하고 검사할 수 있습니다. 그리고 모든 검사 방법은 이 검사기 컴포넌트 내에서 정의할 수 있습니다.</p>
<p>SDK 테스트 프레임워크를 사용하면 몇 가지 중요한 초기화 프로세스를 하나의 함수로 래핑할 수 있습니다. 이렇게 하면 지루한 코드의 큰 덩어리를 제거할 수 있습니다.</p>
<p>또한 각 개별 테스트 케이스가 고유한 컬렉션과 연관되어 데이터 격리를 보장한다는 점도 주목할 만합니다.</p>
<p>테스트 케이스를 실행할 때 pytest 확장 프로그램인<code translate="no">pytest-xdist</code> 을 활용하여 모든 개별 테스트 케이스를 병렬로 실행할 수 있으므로 효율성이 크게 향상됩니다.</p>
<h3 id="GitHub-action" class="common-anchor-header">GitHub 작업</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Git_Hub_action_c3c1bed591.png" alt="GitHub action" class="doc-image" id="github-action" />
   </span> <span class="img-wrapper"> <span>GitHub 액션</span> </span></p>
<p>또한 다음과 같은 특성으로 인해 QA 효율성을 향상시키기 위해<a href="https://docs.github.com/en/actions">GitHub Action을</a> 채택하고 있습니다:</p>
<ul>
<li>GitHub와 긴밀하게 통합된 네이티브 CI/CD 도구입니다.</li>
<li>균일하게 구성된 머신 환경과 Docker, Docker Compose 등 일반적인 소프트웨어 개발 도구가 사전 설치되어 있습니다.</li>
<li>우분투, MacO, Windows 서버 등 여러 운영 체제 및 버전을 지원합니다.</li>
<li>풍부한 확장 기능과 기본 제공 기능을 제공하는 마켓플레이스가 있습니다.</li>
<li>매트릭스는 동시 작업을 지원하고 동일한 테스트 흐름을 재사용하여 효율성을 향상시킵니다.</li>
</ul>
<p>위의 특성 외에도 배포 테스트와 안정성 테스트에는 독립적이고 격리된 환경이 필요하다는 점도 GitHub Action을 채택하는 또 다른 이유입니다. 또한 소규모 데이터 세트에 대한 일일 점검에 GitHub Action이 이상적입니다.</p>
<h3 id="Tools-for-benchmark-tests" class="common-anchor-header">벤치마크 테스트를 위한 도구</h3><p>QA 테스트를 보다 효율적으로 수행하기 위해 여러 가지 도구가 사용됩니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Frame_1_13_fbc71dfe4f.png" alt="QA tools" class="doc-image" id="qa-tools" />
   </span> <span class="img-wrapper"> <span>QA 도구</span> </span></p>
<ul>
<li><a href="https://argoproj.github.io/">Argo</a>: 작업을 예약하여 워크플로우를 실행하고 클러스터를 관리하기 위한 Kubernetes용 오픈 소스 도구 세트입니다. 또한 여러 작업을 병렬로 실행할 수 있습니다.</li>
<li><a href="https://kubernetes.io/docs/tasks/access-application-cluster/web-ui-dashboard/">Kubernetes 대시보드</a>: 시각화를 위한 웹 기반 Kubernetes 사용자 인터페이스 <code translate="no">server-configmap</code> 및 <code translate="no">client-configmap</code>.</li>
<li><a href="https://en.wikipedia.org/wiki/Network-attached_storage">NAS</a>: NAS(네트워크 연결 스토리지)는 일반적인 ANN 벤치마크 데이터 세트를 보관하기 위한 파일 수준의 컴퓨터 데이터 스토리지 서버입니다.</li>
<li><a href="https://www.influxdata.com/">InfluxDB</a> 및 <a href="https://www.mongodb.com/">MongoDB</a>: 벤치마크 테스트 결과를 저장하기 위한 데이터베이스.</li>
<li><a href="https://grafana.com/">Grafana</a>: 서버 리소스 메트릭 및 클라이언트 성능 메트릭을 모니터링하기 위한 오픈 소스 분석 및 모니터링 솔루션입니다.</li>
<li><a href="https://redash.io/">Redash</a>: 데이터를 시각화하고 벤치마크 테스트를 위한 차트를 만드는 데 도움이 되는 서비스입니다.</li>
</ul>
<h2 id="About-the-Deep-Dive-Series" class="common-anchor-header">딥 다이브 시리즈 소개<button data-href="#About-the-Deep-Dive-Series" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.0의 <a href="https://milvus.io/blog/2022-1-25-annoucing-general-availability-of-milvus-2-0.md">공식 출시 발표와</a> 함께 Milvus 아키텍처와 소스 코드에 대한 심층적인 해석을 제공하기 위해 Milvus 딥 다이브 블로그 시리즈를 기획했습니다. 이 블로그 시리즈에서 다루는 주제는 다음과 같습니다:</p>
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
