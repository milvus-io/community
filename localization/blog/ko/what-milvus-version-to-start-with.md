---
id: what-milvus-version-to-start-with.md
title: 시작할 Milvus 버전
author: Chris Churilo
date: 2024-02-19T00:00:00.000Z
desc: 벡터 검색 프로젝트에 대한 정보에 입각한 결정을 내릴 수 있도록 각 Milvus 버전의 특징과 기능에 대한 종합적인 가이드를 제공합니다.
cover: assets.zilliz.com/which_milvus_to_start_4a4250e314.jpeg
tag: Engineering
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Vector Management
recommend: true
canonicalUrl: 'https://milvus.io/blog/what-milvus-version-to-start-with.md'
---
<custom-h1>Milvus 버전 소개</custom-h1><p>벡터 검색 기술을 활용하는 모든 프로젝트의 성공을 위해서는 적절한 Milvus 버전을 선택하는 것이 무엇보다 중요합니다. 다양한 요구사항에 맞춘 다양한 Milvus 버전이 있으므로 원하는 결과를 얻으려면 올바른 버전을 선택하는 것의 중요성을 이해하는 것이 중요합니다.</p>
<p>올바른 Milvus 버전은 개발자가 빠르게 학습하고 프로토타입을 제작하거나 리소스 활용을 최적화하고 개발 노력을 간소화하며 기존 인프라 및 도구와의 호환성을 보장하는 데 도움이 될 수 있습니다. 궁극적으로는 개발자의 생산성을 유지하고 효율성, 안정성 및 사용자 만족도를 개선하는 것입니다.</p>
<h2 id="Available-Milvus-versions" class="common-anchor-header">사용 가능한 Milvus 버전<button data-href="#Available-Milvus-versions" class="anchor-icon" translate="no">
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
    </button></h2><p>개발자는 세 가지 버전의 Milvus를 사용할 수 있으며 모두 오픈 소스입니다. Milvus 라이트, Milvus 스탠드얼론, Milvus 클러스터의 세 가지 버전은 기능 및 사용자가 장단기적으로 Milvus를 사용하는 방식에 차이가 있습니다. 이제 각 버전을 개별적으로 살펴보겠습니다.</p>
<h2 id="Milvus-Lite" class="common-anchor-header">Milvus Lite<button data-href="#Milvus-Lite" class="anchor-icon" translate="no">
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
    </button></h2><p>이름에서 알 수 있듯이 Milvus Lite는 Google Colab 및 Jupyter Notebook과 원활하게 통합되는 경량 버전입니다. 추가 종속성 없이 단일 바이너리로 패키징되어 있어 컴퓨터에 쉽게 설치 및 실행하거나 Python 애플리케이션에 임베드할 수 있습니다. 또한 Milvus Lite에는 CLI 기반 Milvus 독립형 서버가 포함되어 있어 머신에서 직접 실행할 수 있는 유연성을 제공합니다. Python 코드에 포함할지 아니면 독립형 서버로 활용할지는 전적으로 사용자의 선호도와 특정 애플리케이션 요구 사항에 따라 결정됩니다.</p>
<h3 id="Features-and-Capabilities" class="common-anchor-header">특징 및 기능</h3><p>Milvus Lite에는 Milvus의 모든 핵심 벡터 검색 기능이 포함되어 있습니다.</p>
<ul>
<li><p><strong>검색 기능</strong>: 메타데이터 필터링을 포함한 상위-k, 범위 및 하이브리드 검색을 지원하여 다양한 검색 요구 사항을 충족합니다.</p></li>
<li><p><strong>인덱스 유형 및 유사성 메트릭</strong>: 11가지 인덱스 유형과 5가지 유사성 지표를 지원하여 특정 사용 사례에 맞는 유연성과 사용자 정의 옵션을 제공합니다.</p></li>
<li><p><strong>데이터 처리</strong>: 일괄 처리(Apache Parquet, Arrays, JSON) 및 스트림 처리를 지원하며, Airbyte, Apache Kafka, Apache Spark용 커넥터를 통해 원활하게 통합할 수 있습니다.</p></li>
<li><p><strong>CRUD 운영</strong>: 완전한 CRUD 지원(생성, 읽기, 업데이트/삽입, 삭제)을 제공하여 사용자에게 포괄적인 데이터 관리 기능을 제공합니다.</p></li>
</ul>
<h3 id="Applications-and-limitations" class="common-anchor-header">애플리케이션 및 제한 사항</h3><p>Milvus Lite는 신속한 프로토타이핑과 로컬 개발에 이상적이며, 머신에서 소규모 데이터 세트를 빠르게 설정하고 실험할 수 있도록 지원합니다. 그러나 대규모 데이터 세트와 더 까다로운 인프라 요구 사항이 있는 프로덕션 환경으로 전환할 때는 그 한계가 분명해집니다. 따라서 Milvus Lite는 초기 탐색 및 테스트에는 훌륭한 도구이지만, 대량 또는 프로덕션 환경에서 애플리케이션을 배포하는 데는 적합하지 않을 수 있습니다.</p>
<h3 id="Available-Resources" class="common-anchor-header">사용 가능한 리소스</h3><ul>
<li><p><a href="https://milvus.io/docs/milvus_lite.md">문서</a></p></li>
<li><p><a href="https://github.com/milvus-io/milvus-lite/">Github 리포지토리</a></p></li>
<li><p><a href="https://github.com/milvus-io/milvus-lite/tree/main/examples">Google Colab 예제</a></p></li>
<li><p><a href="https://www.youtube.com/watch?v=IgJdrGiB5ZY">시작하기 비디오</a></p></li>
</ul>
<h2 id="Milvus-Standalone" class="common-anchor-header">Milvus 스탠드얼론<button data-href="#Milvus-Standalone" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus는 두 가지 운영 모드를 제공합니다: 독립형과 클러스터. 두 모드 모두 핵심 벡터 데이터베이스 기능은 동일하지만 데이터 크기 지원 및 확장성 요구 사항에서 차이가 있습니다. 이러한 차이점을 통해 데이터 세트 크기, 트래픽 양, 기타 프로덕션 인프라 요구 사항에 가장 적합한 모드를 선택할 수 있습니다.</p>
<p>Milvus Standalone은 클러스터링이나 분산 설정 없이 단일 인스턴스로 독립적으로 작동하는 Milvus 벡터 데이터베이스 시스템의 운영 모드입니다. Milvus는 이 모드에서 단일 서버 또는 머신에서 실행되며, 인덱싱 및 벡터 검색과 같은 기능을 제공합니다. 데이터 및 트래픽 규모가 상대적으로 작고 클러스터 설정에서 제공하는 분산 기능이 필요하지 않은 상황에 적합합니다.</p>
<h3 id="Features-and-Capabilities" class="common-anchor-header">특징 및 기능</h3><ul>
<li><p><strong>고성능</strong>: 수십억 개 이상의 대규모 데이터 세트에 대한 벡터 검색을 탁월한 속도와 효율성으로 수행할 수 있습니다.</p></li>
<li><p><strong>검색 기능</strong>: 메타데이터 필터링을 포함한 상위-k, 범위, 하이브리드 검색을 지원하여 다양한 검색 요구사항을 충족합니다.</p></li>
<li><p><strong>색인 유형 및 유사성 메트릭</strong>: 11가지 색인 유형과 5가지 유사성 지표를 지원하여 특정 사용 사례에 맞는 유연성과 사용자 지정 옵션을 제공합니다.</p></li>
<li><p><strong>데이터 처리</strong>: 일괄 처리(Apache Parquet, Arrays, Json)와 스트림 처리를 모두 지원하며, Airbyte, Apache Kafka, Apache Spark용 커넥터를 통해 원활하게 통합할 수 있습니다.</p></li>
<li><p><strong>데이터 복제 및 페일오버</strong>: 기본 제공되는 복제 및 장애 조치/장애 복구 기능은 중단이나 장애 발생 시에도 데이터 무결성과 애플리케이션 가용성을 보장합니다.</p></li>
<li><p><strong>확장성</strong>: 구성 요소 수준 확장을 통해 동적 확장성을 달성하여 수요에 따라 원활하게 확장 및 축소할 수 있습니다. Milvus는 구성 요소 수준에서 자동 확장이 가능하므로 리소스 할당을 최적화하여 효율성을 높일 수 있습니다.</p></li>
<li><p><strong>멀티 테넌시</strong>: 클러스터에서 최대 10,000개의 컬렉션/파티션을 관리할 수 있는 멀티 테넌시를 지원하여 다양한 사용자 또는 애플리케이션을 위한 효율적인 리소스 활용과 격리를 제공합니다.</p></li>
<li><p><strong>CRUD 운영</strong>: 완전한 CRUD 지원(만들기, 읽기, 업데이트/삽입, 삭제)을 제공하여 사용자에게 포괄적인 데이터 관리 기능을 제공합니다.</p></li>
</ul>
<h3 id="Essential-components" class="common-anchor-header">필수 구성 요소:</h3><ul>
<li><p>Milvus: 핵심 기능 구성 요소.</p></li>
<li><p>etcd: 프록시, 인덱스 노드 등을 포함한 Milvus의 내부 구성 요소에서 메타데이터에 액세스하고 저장하는 메타데이터 엔진입니다.</p></li>
<li><p>MinIO: Milvus 내에서 데이터 지속성을 담당하는 스토리지 엔진.</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Screenshot_2024_02_19_at_4_16_41_PM_5e635586a7.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>그림 1: Milvus 독립형 아키텍처</p>
<h3 id="Available-Resources" class="common-anchor-header">사용 가능한 리소스</h3><ul>
<li><p>문서</p>
<ul>
<li><p><a href="https://milvus.io/docs/prerequisite-docker.md">Docker Compose를 사용한 Milvus 환경 체크리스트</a></p></li>
<li><p><a href="https://milvus.io/docs/install_standalone-docker.md">Docker로 Milvus 독립형 설치</a></p></li>
</ul></li>
<li><p><a href="https://github.com/milvus-io/milvus">깃허브 리포지토리</a></p></li>
</ul>
<h2 id="Milvus-Cluster" class="common-anchor-header">밀버스 클러스터<button data-href="#Milvus-Cluster" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 클러스터는 여러 노드 또는 서버에 분산되어 작동하는 Milvus 벡터 데이터베이스 시스템의 운영 모드입니다. 이 모드에서는 Milvus 인스턴스가 함께 클러스터링되어 독립형 설정에 비해 더 많은 양의 데이터와 더 높은 트래픽 부하를 처리할 수 있는 통합 시스템을 형성합니다. Milvus 클러스터는 확장성, 내결함성, 부하 분산 기능을 제공하므로 빅 데이터를 처리하고 많은 동시 쿼리를 효율적으로 처리해야 하는 시나리오에 적합합니다.</p>
<h3 id="Features-and-Capabilities" class="common-anchor-header">특징 및 기능</h3><ul>
<li><p>고성능 벡터 검색, 여러 인덱스 유형 및 유사성 메트릭 지원, 배치 및 스트림 처리 프레임워크와의 원활한 통합 등 Milvus Standalone에서 제공되는 모든 기능을 그대로 계승합니다.</p></li>
<li><p>분산 컴퓨팅과 여러 노드에 걸친 부하 분산 기능을 활용하여 탁월한 가용성, 성능, 비용 최적화를 제공합니다.</p></li>
<li><p>클러스터 전반의 리소스를 효율적으로 활용하고 워크로드 수요에 따라 리소스 할당을 최적화하여 총 비용을 절감하면서 안전한 엔터프라이즈급 워크로드를 배포 및 확장할 수 있습니다.</p></li>
</ul>
<h3 id="Essential-components" class="common-anchor-header">필수 구성 요소:</h3><p>Milvus Cluster에는 8개의 마이크로서비스 구성 요소와 3개의 타사 종속성이 포함되어 있습니다. 모든 마이크로서비스는 서로 독립적으로 Kubernetes에 배포할 수 있습니다.</p>
<h4 id="Microservice-components" class="common-anchor-header">마이크로서비스 구성 요소</h4><ul>
<li><p>루트 조정</p></li>
<li><p>프록시</p></li>
<li><p>쿼리 조정</p></li>
<li><p>쿼리 노드</p></li>
<li><p>인덱스 좌표</p></li>
<li><p>인덱스 노드</p></li>
<li><p>데이터 좌표</p></li>
<li><p>데이터 노드</p></li>
</ul>
<h4 id="Third-party-dependencies" class="common-anchor-header">서드파티 종속성</h4><ul>
<li><p>etcd: 클러스터의 다양한 컴포넌트에 대한 메타데이터를 저장합니다.</p></li>
<li><p>MinIO: 인덱스 및 바이너리 로그 파일과 같은 클러스터 내 대용량 파일의 데이터 지속성을 담당합니다.</p></li>
<li><p>Pulsar: 최근 변경 작업의 로그를 관리하고, 스트리밍 로그를 출력하며, 로그 게시-구독 서비스를 제공합니다.</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Screenshot_2024_02_19_at_4_18_01_PM_88971280ed.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>그림 2: Milvus 클러스터 아키텍처</p>
<h4 id="Available-Resources" class="common-anchor-header">사용 가능한 리소스</h4><ul>
<li><p><a href="https://milvus.io/docs/install_cluster-milvusoperator.md">문서</a> | 시작 방법</p>
<ul>
<li><p><a href="https://milvus.io/docs/install_cluster-milvusoperator.md">밀버스 운영자로 밀버스 클러스터 설치하기</a></p></li>
<li><p><a href="https://milvus.io/docs/install_cluster-helm.md">헬름으로 Milvus 클러스터 설치하기</a></p></li>
<li><p><a href="https://milvus.io/docs/scaleout.md">Milvus 클러스터를 확장하는 방법</a></p></li>
</ul></li>
<li><p><a href="https://github.com/milvus-io/milvus">깃허브 리포지토리</a></p></li>
</ul>
<h2 id="Making-the-Decision-on-which-Milvus-version-to-use" class="common-anchor-header">사용할 Milvus 버전 결정하기<button data-href="#Making-the-Decision-on-which-Milvus-version-to-use" class="anchor-icon" translate="no">
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
    </button></h2><p>프로젝트에 사용할 Milvus 버전을 결정할 때는 데이터 세트 크기, 트래픽 볼륨, 확장성 요구 사항 및 프로덕션 환경 제약 조건과 같은 요소를 고려해야 합니다. Milvus Lite는 노트북에서 프로토타이핑하는 데 적합합니다. Milvus Standalone은 데이터 세트에서 벡터 검색을 수행할 수 있는 높은 성능과 유연성을 제공하므로 소규모 배포, CI/CD, Kubernetes를 지원하지 않는 오프라인 배포에 적합합니다. 마지막으로 Milvus Cluster는 엔터프라이즈급 워크로드를 위한 탁월한 가용성, 확장성, 비용 최적화를 제공하므로 대규모의 고가용성 운영 환경을 위한 선호되는 선택이 될 것입니다.</p>
<p>번거로움이 없는 또 다른 버전이 있는데, 바로 <a href="https://cloud.zilliz.com/signup">Zilliz Cloud라는</a> Milvus의 관리형 버전입니다.</p>
<p>궁극적으로 Milvus 버전은 특정 사용 사례, 인프라 요구 사항 및 장기적인 목표에 따라 달라집니다. 이러한 요소를 신중하게 평가하고 각 버전의 특징과 기능을 이해하면 프로젝트의 요구 사항과 목표에 맞는 정보에 입각한 결정을 내릴 수 있습니다. Milvus 스탠드얼론과 Milvus 클러스터 중 어떤 것을 선택하든 벡터 데이터베이스의 강력한 기능을 활용하여 AI 애플리케이션의 성능과 효율성을 향상시킬 수 있습니다.</p>
