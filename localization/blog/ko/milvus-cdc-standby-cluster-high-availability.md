---
id: milvus-cdc-standby-cluster-high-availability.md
title: '벡터 데이터베이스 고가용성: CDC로 Milvus 대기 클러스터를 구축하는 방법'
author: Cal Huang
date: 2026-3-26
cover: assets.zilliz.com/download_2867bc5064.jpg
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  vector database high availability, Milvus CDC, standby cluster, disaster
  recovery, change data capture
meta_title: |
  Vector Database High Availability: Milvus CDC Standby Cluster Guide
desc: >-
  Milvus CDC로 고가용성 벡터 데이터베이스를 구축하는 방법을 알아보세요. 기본 대기 복제, 장애 조치 및 프로덕션 DR에 대한 단계별
  가이드입니다.
origin: 'https://milvus.io/blog/milvus-cdc-standby-cluster-high-availability.md'
---
<p>모든 프로덕션 데이터베이스에는 문제가 발생했을 때를 대비한 계획이 필요합니다. 관계형 데이터베이스는 수십 년 동안 WAL 전송, 빈로그 복제, 자동화된 장애 복구 기능을 제공해 왔습니다. 그러나 <a href="https://zilliz.com/learn/what-is-a-vector-database">벡터 데이터베이스는</a> AI 애플리케이션의 핵심 인프라가 되었음에도 불구하고 여전히 이 분야에서 뒤처지고 있습니다. 대부분은 기껏해야 노드 수준의 이중화를 제공합니다. 전체 클러스터가 다운되면 백업에서 복원하고 <a href="https://zilliz.com/learn/vector-index">벡터 인덱스를</a> 처음부터 다시 구축해야 하는데, ML 파이프라인을 통해 <a href="https://zilliz.com/glossary/vector-embeddings">임베딩을</a> 재생성하는 비용이 저렴하지 않기 때문에 몇 시간이 걸리고 컴퓨팅 비용이 수천 달러에 달할 수 있는 프로세스입니다.</p>
<p><a href="https://milvus.io/">Milvus는</a> 다른 접근 방식을 취합니다. 클러스터 내에서 빠른 장애 조치를 위한 노드 수준 복제본, 클러스터 수준 및 지역 간 보호를 위한 CDC 기반 복제, 안전망 복구를 위한 백업 등 계층화된 고가용성을 제공합니다. 이러한 계층화 모델은 기존 데이터베이스의 표준 관행이며, Milvus는 이를 벡터 워크로드에 도입한 최초의 주요 벡터 데이터베이스입니다.</p>
<p>이 가이드에서는 벡터 데이터베이스에 사용할 수 있는 고가용성 전략('프로덕션 지원'이 실제로 무엇을 의미하는지 평가할 수 있도록)과 Milvus CDC 기본 대기 복제를 처음부터 설정하는 실습 자습서 두 가지를 다룹니다.</p>
<blockquote>
<p>이 글은 시리즈의 <strong>1부입니다</strong>:</p>
<ul>
<li><strong>1부</strong> (이 문서): 1부: 새 클러스터에서 기본 대기 복제 설정하기</li>
<li><strong>2부</strong>: <a href="https://milvus.io/docs/milvus_backup_overview.md">Milvus 백업을</a> 사용하여 이미 데이터가 있는 기존 클러스터에 CDC 추가하기</li>
<li><strong>3부</strong>: 페일오버 관리 - 프라이머리 다운 시 스탠바이 승격하기</li>
</ul>
</blockquote>
<h2 id="Why-Does-High-Availability-Matter-More-for-Vector-Databases" class="common-anchor-header">벡터 데이터베이스에 고가용성이 더 중요한 이유는 무엇인가요?<button data-href="#Why-Does-High-Availability-Matter-More-for-Vector-Databases" class="anchor-icon" translate="no">
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
    </button></h2><p>기존 SQL 데이터베이스가 다운되면 구조화된 레코드에 액세스할 수 없게 되지만 데이터 자체는 일반적으로 업스트림 소스에서 다시 가져올 수 있습니다. 벡터 데이터베이스가 다운되면 복구가 근본적으로 더 어렵습니다.</p>
<p>벡터 데이터베이스는 머신 러닝 모델에 의해 생성된 조밀한 수치 표현인 <a href="https://zilliz.com/glossary/vector-embeddings">임베딩을</a> 저장합니다. 이를 다시 구축한다는 것은 임베딩 파이프라인을 통해 전체 데이터 세트를 다시 실행하는 것을 의미합니다. 원시 문서를 로드하고, 청크하고, <a href="https://zilliz.com/ai-models">임베딩 모델을</a> 호출하고, 모든 것을 다시 색인하는 과정을 거치게 됩니다. 수억 개의 벡터가 포함된 데이터 세트의 경우, 이 작업에는 며칠이 걸리고 수천 달러의 GPU 컴퓨팅 비용이 들 수 있습니다.</p>
<p>한편, <a href="https://zilliz.com/learn/what-is-vector-search">벡터 검색에</a> 의존하는 시스템은 종종 임계 경로에 있는 경우가 많습니다:</p>
<ul>
<li>고객 대면 챗봇과 검색을 지원하는<strong><a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">RAG</a> 파이프라인</strong> - 벡터 데이터베이스가 다운되면 검색이 중단되고 AI가 일반적이거나 엉뚱한 답변을 반환합니다.</li>
<li>실시간으로 제품 또는 콘텐츠 추천을 제공하는<strong>추천 엔진</strong> - 다운타임은 곧 매출 누락으로 이어집니다.</li>
<li><a href="https://zilliz.com/glossary/similarity-search">유사성 검색에</a> 의존하여 의심스러운 활동을 표시하는<strong>사기 탐지 및 이상 징후 모니터링</strong> 시스템 - 적용 범위의 공백으로 인해 취약점이 생깁니다.</li>
<li>메모리 및 도구 검색을 위해 벡터 저장소를 사용하는<strong>자율 에이전트 시스템</strong> - 지식 기반이 없으면 에이전트가 실패하거나 반복됩니다.</li>
</ul>
<p>이러한 사용 사례에 대해 벡터 데이터베이스를 평가하는 경우, 고가용성은 나중에 확인하면 좋은 기능이 아닙니다. 가장 먼저 살펴봐야 할 사항 중 하나입니다.</p>
<h2 id="What-Does-Production-Grade-HA-Look-Like-for-a-Vector-Database" class="common-anchor-header">프로덕션급 HA는 벡터 데이터베이스에 어떤 모습일까요?<button data-href="#What-Does-Production-Grade-HA-Look-Like-for-a-Vector-Database" class="anchor-icon" translate="no">
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
    </button></h2><p>고가용성이라고 해서 모두 같은 것은 아닙니다. 단일 클러스터 내에서만 노드 장애를 처리하는 벡터 데이터베이스는 프로덕션 시스템에서 요구하는 방식으로 "고가용성"이 아닙니다. 진정한 고가용성은 세 가지 계층을 포괄해야 합니다:</p>
<table>
<thead>
<tr><th>계층</th><th>보호 대상</th><th>작동 방식</th><th>복구 시간</th><th>데이터 손실</th></tr>
</thead>
<tbody>
<tr><td><strong>노드 수준</strong> (멀티 레플리카)</td><td>단일 노드 충돌, 하드웨어 장애, OOM 킬, AZ 장애</td><td>여러 노드에 동일한 <a href="https://milvus.io/docs/glossary.md">데이터 세그먼트</a> 복사, 다른 노드가 부하 흡수</td><td>즉시</td><td>제로</td></tr>
<tr><td><strong>클러스터 수준</strong> (CDC 복제)</td><td>전체 클러스터 다운 - 잘못된 K8 롤아웃, 네임스페이스 삭제, 스토리지 손상</td><td><a href="https://milvus.io/docs/four_layers.md">쓰기 사전 로그를</a> 통해 모든 쓰기를 대기 클러스터로 스트리밍, 대기 클러스터는 항상 몇 초 뒤처짐</td><td>분</td><td>초</td></tr>
<tr><td><strong>안전망</strong> (주기적 백업)</td><td>치명적인 데이터 손상, 랜섬웨어, 복제를 통해 전파되는 사람의 실수</td><td>주기적으로 스냅샷을 생성하여 별도의 위치에 저장합니다.</td><td>시간</td><td>시간(마지막 백업 이후)</td></tr>
</tbody>
</table>
<p>이러한 계층은 상호 보완적인 것이지 대안이 아닙니다. 프로덕션 배포에서는 이러한 계층을 스택해야 합니다:</p>
<ol>
<li><strong><a href="https://milvus.io/docs/replica.md">멀티 복제본</a> 우선</strong> - 가장 일반적인 장애(노드 충돌, AZ 장애)를 다운타임과 데이터 손실 없이 처리합니다.</li>
<li><strong>다음으로<a href="https://milvus.io/docs/milvus-cdc-overview.md">CDC</a></strong> - 멀티 레플리카가 처리할 수 없는 장애(클러스터 전체 중단, 치명적인 인적 오류 등)로부터 보호합니다. 대기 클러스터는 다른 장애 도메인에 있습니다.</li>
<li><strong>항상<a href="https://milvus.io/docs/milvus_backup_overview.md">주기적인 백업</a></strong> - 최후의 안전망. 손상된 데이터를 발견하기 전에 대기 상태로 복제되면 CDC조차도 복구할 수 없습니다.</li>
</ol>
<p>벡터 데이터베이스를 평가할 때는 이 세 가지 계층 중 제품이 실제로 어떤 계층을 지원하는지 물어보세요. 오늘날 대부분의 벡터 데이터베이스는 첫 번째 레이어만 제공합니다. Milvus는 타사 애드온이 아닌 기본 제공 기능으로 CDC를 통해 이 세 가지를 모두 지원합니다.</p>
<h2 id="What-Is-Milvus-CDC-and-How-Does-It-Work" class="common-anchor-header">Milvus CDC란 무엇이며 어떻게 작동하나요?<button data-href="#What-Is-Milvus-CDC-and-How-Does-It-Work" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Milvus CDC(변경 데이터 캡처)</strong> 는 기본 제공 복제 기능으로, 기본 클러스터의 <a href="https://milvus.io/docs/four_layers.md">WAL(Write-Ahead Log)</a> 을 읽고 각 항목을 별도의 대기 클러스터로 스트리밍하는 기능입니다. 대기 클러스터는 항목을 재생하고 일반적으로 몇 초 후에 동일한 데이터로 끝납니다.</p>
<p>이 패턴은 데이터베이스 업계에서 잘 확립된 방식입니다. MySQL에는 빈로그 복제가 있습니다. PostgreSQL에는 WAL 배송이 있습니다. MongoDB는 oplog 기반 복제를 사용합니다. 이러한 기술은 수십 년 동안 관계형 및 문서 데이터베이스를 프로덕션 환경에서 운영해 온 검증된 기술입니다. Milvus는 벡터 워크로드에도 동일한 접근 방식을 제공하며, WAL 기반 복제를 기본 기능으로 제공하는 최초의 주요 <a href="https://zilliz.com/learn/what-is-a-vector-database">벡터 데이터베이스입니다</a>.</p>
<p>CDC가 재해 복구에 적합한 이유는 세 가지입니다:</p>
<ul>
<li><strong>지연 시간이 짧은 동기화.</strong> CDC는 예약된 일괄 처리가 아니라 작업이 발생하는 대로 스트리밍합니다. 대기 상태는 정상적인 조건에서 기본 상태보다 몇 초 뒤에 유지됩니다.</li>
<li><strong>주문된 재생.</strong> 작업이 기록된 순서와 동일한 순서로 대기 상태에 도착합니다. 데이터는 조정 없이 일관되게 유지됩니다.</li>
<li><strong>체크포인트 복구.</strong> CDC 프로세스가 충돌하거나 네트워크가 끊어지면 중단된 지점부터 다시 시작됩니다. 데이터가 건너뛰거나 복제되지 않습니다.</li>
</ul>
<h3 id="How-Does-the-CDC-Architecture-Work" class="common-anchor-header">CDC 아키텍처는 어떻게 작동하나요?</h3><p>CDC 배포에는 세 가지 구성 요소가 있습니다:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/milvus_cdc_standby_cluster_high_availability_1_7c6e5baf76.png" alt="CDC architecture showing Source Cluster with Streaming Nodes and CDC Nodes consuming the WAL, replicating data to the Target Cluster's Proxy layer, which forwards DDL/DCL/DML operations to Streaming Nodes and appends to WAL" class="doc-image" id="cdc-architecture-showing-source-cluster-with-streaming-nodes-and-cdc-nodes-consuming-the-wal,-replicating-data-to-the-target-cluster's-proxy-layer,-which-forwards-ddl/dcl/dml-operations-to-streaming-nodes-and-appends-to-wal" />
   </span> <span class="img-wrapper"> <span>스트리밍 노드가 있는 소스 클러스터와 WAL을 소비하는 CDC 노드, 데이터를 대상 클러스터의 프록시 계층으로 복제하여 DDL/DCL/DML 작업을 스트리밍 노드로 전달하고 WAL에 추가하는 CDC 아키텍처를 보여줍니다</span> </span>.</p>
<table>
<thead>
<tr><th>컴포넌트</th><th>역할</th></tr>
</thead>
<tbody>
<tr><td><strong>기본 클러스터</strong></td><td>프로덕션 <a href="https://milvus.io/docs/architecture_overview.md">Milvus 인스턴스입니다</a>. 모든 읽기와 쓰기가 이곳으로 이동합니다. 모든 쓰기는 WAL에 기록됩니다.</td></tr>
<tr><td><strong>CDC 노드</strong></td><td>기본 클러스터와 함께 백그라운드 프로세스입니다. WAL 항목을 읽고 스탠바이로 전달합니다. 읽기/쓰기 경로와 독립적으로 실행되므로 쿼리 또는 삽입 성능에 영향을 미치지 않습니다.</td></tr>
<tr><td><strong>대기 클러스터</strong></td><td>전달된 WAL 항목을 재생하는 별도의 Milvus 인스턴스입니다. 기본 클러스터와 동일한 데이터를 몇 초 뒤에서 보유합니다. 읽기 쿼리는 처리할 수 있지만 쓰기는 허용하지 않습니다.</td></tr>
</tbody>
</table>
<p>흐름: 쓰기가 프라이머리에 도달 → CDC 노드가 스탠바이에 복사 → 스탠바이가 재생합니다. 다른 어떤 것도 스탠바이의 쓰기 경로와 통신하지 않습니다. 프라이머리가 다운되면 스탠바이가 이미 거의 모든 데이터를 가지고 있으므로 승격할 수 있습니다.</p>
<h2 id="Tutorial-Setting-Up-a-Milvus-CDC-Standby-Cluster" class="common-anchor-header">튜토리얼: Milvus CDC 스탠바이 클러스터 설정하기<button data-href="#Tutorial-Setting-Up-a-Milvus-CDC-Standby-Cluster" class="anchor-icon" translate="no">
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
    </button></h2><p>이 문서의 나머지 부분은 실습을 통해 설명합니다. 마지막에는 두 개의 Milvus 클러스터가 실시간 복제를 통해 실행됩니다.</p>
<h3 id="Prerequisites" class="common-anchor-header">전제 조건</h3><p>시작하기 전에</p>
<ul>
<li><strong><a href="https://milvus.io/">Milvus</a> v2.6.6 이상.</strong> CDC에는 이 버전이 필요합니다. 최신 2.6.x 패치를 권장합니다.</li>
<li><strong><a href="https://milvus.io/docs/install_cluster-milvusoperator.md">밀버스 오퍼레이터</a> v1.3.4 이상.</strong> 이 가이드는 쿠버네티스에서 클러스터 관리를 위해 오퍼레이터를 사용한다.</li>
<li><code translate="no">kubectl</code> 및 <code translate="no">helm</code> 이 구성된<strong>실행 중인 Kubernetes 클러스터</strong>.</li>
<li>복제 구성 단계에<strong> <a href="https://milvus.io/docs/install-pymilvus.md">pymilvus가</a> 포함된 Python</strong>.</li>
</ul>
<p>현재 릴리스에는 두 가지 제한 사항이 있다:</p>
<table>
<thead>
<tr><th>제한</th><th>세부 사항</th></tr>
</thead>
<tbody>
<tr><td>단일 CDC 복제본</td><td>클러스터당 하나의 CDC 복제본. 분산 CDC는 향후 릴리스에 포함될 예정입니다.</td></tr>
<tr><td>대량 삽입 안 함</td><td>CDC가 활성화되어 있는 동안에는<a href="https://milvus.io/docs/import-data.md">BulkInsert가</a> 지원되지 않습니다. 또한 향후 릴리스에서 지원될 예정입니다.</td></tr>
</tbody>
</table>
<h3 id="Step-1-Upgrade-the-Milvus-Operator" class="common-anchor-header">1단계: Milvus 운영자 업그레이드</h3><p>Milvus 오퍼레이터를 v1.3.4 이상으로 업그레이드합니다:</p>
<pre><code translate="no">helm repo add zilliztech-milvus-operator https://zilliztech.github.io/milvus-operator/
<span class="hljs-comment"># &quot;zilliztech-milvus-operator&quot; has been added to your repositories</span>

helm repo update zilliztech-milvus-operator
<span class="hljs-comment"># Hang tight while we grab the latest from your chart repositories...</span>
<span class="hljs-comment"># ...Successfully got an update from the &quot;zilliztech-milvus-operator&quot; chart repository</span>
<span class="hljs-comment"># Update Complete. ⎈Happy Helming!⎈</span>

helm -n milvus-operator upgrade milvus-operator zilliztech-milvus-operator/milvus-operator
<span class="hljs-comment"># Release &quot;milvus-operator&quot; has been upgraded. Happy Helming!</span>
<span class="hljs-comment"># NAME: milvus-operator</span>
<span class="hljs-comment"># LAST DEPLOYED: Wed Dec  3 17:25:28 2025</span>
<span class="hljs-comment"># NAMESPACE: milvus-operator</span>
<span class="hljs-comment"># STATUS: deployed</span>
<span class="hljs-comment"># REVISION: 30</span>
<span class="hljs-comment"># TEST SUITE: None</span>
<span class="hljs-comment"># NOTES:</span>
<span class="hljs-comment"># Milvus Operator Is Starting, use `kubectl get -n milvus-operator deploy/milvus-operator` to check if its successfully installed</span>
<span class="hljs-comment"># Full Installation doc can be found in https://github.com/zilliztech/milvus-operator/blob/main/docs/installation/installation.md</span>
<span class="hljs-comment"># Quick start with `kubectl apply -f https://raw.githubusercontent.com/zilliztech/milvus-operator/main/config/samples/milvus_minimum.yaml`</span>
<span class="hljs-comment"># More samples can be found in https://github.com/zilliztech/milvus-operator/tree/main/config/samples</span>
<span class="hljs-comment"># CRD Documentation can be found in https://github.com/zilliztech/milvus-operator/tree/main/docs/CRD</span>
<span class="hljs-comment"># Administration Documentation can be found in https://github.com/zilliztech/milvus-operator/tree/main/docs/administration</span>
<button class="copy-code-btn"></button></code></pre>
<p>운영자 파드가 실행 중인지 확인합니다:</p>
<pre><code translate="no">kubectl <span class="hljs-keyword">get</span> pods -n milvus-<span class="hljs-keyword">operator</span>
<span class="hljs-meta"># NAME                             READY   STATUS    RESTARTS   AGE</span>
<span class="hljs-meta"># milvus-operator-9fc99f88-h2hwz   1/1     Running   0          54s</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-2-Deploy-the-Primary-Cluster" class="common-anchor-header">2단계: 기본 클러스터 배포</h3><p>기본(소스) 클러스터에 대한 YAML 파일을 생성합니다. <code translate="no">components</code> 아래의 <code translate="no">cdc</code> 섹션은 운영자에게 클러스터와 함께 CDC 노드를 배포하도록 지시합니다:</p>
<pre><code translate="no"><span class="hljs-comment"># This is a sample to deploy a milvus cluster with cdc.</span>
apiVersion: milvus.io/v1beta1
kind: Milvus
metadata:
  name: source-cluster
  namespace: milvus
  labels:
    app: milvus
spec:
  mode: cluster
  components:
    image: milvusdb/milvus:v2<span class="hljs-number">.6</span><span class="hljs-number">.6</span> <span class="hljs-comment"># Use version 2.6.6 or above, as CDC is available from 2.6.6 onwards</span>
    cdc:
      replicas: <span class="hljs-number">1</span>  <span class="hljs-comment"># Currently, CDC only supports 1 replica</span>
  dependencies:
    msgStreamType: woodpecker
<button class="copy-code-btn"></button></code></pre>
<p><code translate="no">msgStreamType: woodpecker</code> 설정은 Kafka나 Pulsar와 같은 외부 메시지 큐 대신 Milvus의 기본 제공 <a href="https://milvus.io/docs/four_layers.md">Woodpecker WAL을</a> 사용합니다. Woodpecker는 Milvus 2.6에 도입된 클라우드 네이티브 미리 쓰기 로그로, 외부 메시징 인프라가 필요하지 않습니다.</p>
<p>구성을 적용합니다:</p>
<pre><code translate="no">kubectl create namespace milvus
<span class="hljs-comment"># namespace/milvus created</span>
kubectl apply -f milvus_source_cluster.yaml
<span class="hljs-comment"># milvus.milvus.io/source-cluster created</span>
<button class="copy-code-btn"></button></code></pre>
<p>모든 파드가 실행 중 상태가 될 때까지 기다립니다. CDC 파드가 가동 중인지 확인합니다:</p>
<pre><code translate="no">kubectl <span class="hljs-keyword">get</span> pods -n milvus
<span class="hljs-meta"># Look for source-cluster-milvus-cdc-xxx in Running state</span>
<span class="hljs-meta"># NAME                                                READY   STATUS    RESTARTS   AGE</span>
<span class="hljs-meta"># source-cluster-milvus-cdc-66d64747bd-sckxj          1/1     Running   0          2m42s</span>
<span class="hljs-meta"># source-cluster-milvus-datanode-85f9f56fd-qgbzq       1/1     Running   0          2m42s</span>
<span class="hljs-meta"># ...</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-3-Deploy-the-Standby-Cluster" class="common-anchor-header">3단계: 대기 클러스터 배포하기</h3><p>대기(대상) 클러스터는 동일한 Milvus 버전을 사용하지만 CDC 구성 요소를 포함하지 않으며, 복제된 데이터만 수신합니다:</p>
<pre><code translate="no"><span class="hljs-comment"># This is a sample to deploy a milvus cluster with cdc.</span>
apiVersion: milvus.io/v1beta1
kind: Milvus
metadata:
  name: target-cluster
  namespace: milvus
  labels:
    app: milvus
spec:
  mode: cluster
  components:
    image: milvusdb/milvus:v2<span class="hljs-number">.6</span><span class="hljs-number">.6</span> <span class="hljs-comment"># Use version 2.6.6 or above, as CDC is available from 2.6.6 onwards</span>
  dependencies:
    msgStreamType: woodpecker
<button class="copy-code-btn"></button></code></pre>
<p>적용:</p>
<pre><code translate="no">kubectl apply -f milvus_target_cluster.yaml
<span class="hljs-comment"># milvus.milvus.io/target-cluster created</span>
<button class="copy-code-btn"></button></code></pre>
<p>모든 파드가 실행 중인지 확인합니다:</p>
<pre><code translate="no">kubectl <span class="hljs-keyword">get</span> pods -n milvus
<span class="hljs-meta"># NAME                                                   READY   STATUS    RESTARTS   AGE</span>
<span class="hljs-meta"># ...</span>
<span class="hljs-meta"># target-cluster-milvus-datanode-7ffc8cdb6b-xhzcd        1/1     Running   0          104m</span>
<span class="hljs-meta"># target-cluster-milvus-mixcoord-8649b87c98-btk7m        1/1     Running   0          104m</span>
<span class="hljs-meta"># ...</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-4-Configure-the-Replication-Relationship" class="common-anchor-header">4단계: 복제 관계 구성하기</h3><p>두 클러스터가 모두 실행 중인 상태에서, <a href="https://milvus.io/docs/install-pymilvus.md">pymilvus와</a> 함께 Python을 사용하여 복제 토폴로지를 구성합니다.</p>
<p>클러스터 연결 세부정보와 물리적 채널(p채널) 이름을 정의합니다:</p>
<pre><code translate="no">source_cluster_addr = <span class="hljs-string">&quot;http://10.98.124.90:19530&quot;</span> <span class="hljs-comment"># example address — replace with your actual Milvus server address</span>
target_cluster_addr = <span class="hljs-string">&quot;http://10.109.234.172:19530&quot;</span>
source_cluster_token = <span class="hljs-string">&quot;root:Milvus&quot;</span>
target_cluster_token = <span class="hljs-string">&quot;root:Milvus&quot;</span>
source_cluster_id = <span class="hljs-string">&quot;source-cluster&quot;</span>
target_cluster_id = <span class="hljs-string">&quot;target-cluster&quot;</span>
pchannel_num = <span class="hljs-number">16</span>

source_cluster_pchannels = []
target_cluster_pchannels = []
<span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(pchannel_num):
    source_cluster_pchannels.append(<span class="hljs-string">f&quot;<span class="hljs-subst">{source_cluster_id}</span>-rootcoord-dml_<span class="hljs-subst">{i}</span>&quot;</span>)
    target_cluster_pchannels.append(<span class="hljs-string">f&quot;<span class="hljs-subst">{target_cluster_id}</span>-rootcoord-dml_<span class="hljs-subst">{i}</span>&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>복제 구성을 빌드합니다:</p>
<pre><code translate="no">config = {
    <span class="hljs-string">&quot;clusters&quot;</span>: [
        {
            <span class="hljs-string">&quot;cluster_id&quot;</span>: source_cluster_id,
            <span class="hljs-string">&quot;connection_param&quot;</span>: {
                <span class="hljs-string">&quot;uri&quot;</span>: source_cluster_addr,
                <span class="hljs-string">&quot;token&quot;</span>: source_cluster_token
            },
            <span class="hljs-string">&quot;pchannels&quot;</span>: source_cluster_pchannels
        },
        {
            <span class="hljs-string">&quot;cluster_id&quot;</span>: target_cluster_id,
            <span class="hljs-string">&quot;connection_param&quot;</span>: {
                <span class="hljs-string">&quot;uri&quot;</span>: target_cluster_addr,
                <span class="hljs-string">&quot;token&quot;</span>: target_cluster_token
            },
            <span class="hljs-string">&quot;pchannels&quot;</span>: target_cluster_pchannels
        }
    ],
    <span class="hljs-string">&quot;cross_cluster_topology&quot;</span>: [
        {
            <span class="hljs-string">&quot;source_cluster_id&quot;</span>: source_cluster_id,
            <span class="hljs-string">&quot;target_cluster_id&quot;</span>: target_cluster_id
        }
    ]
}
<button class="copy-code-btn"></button></code></pre>
<p>두 클러스터에 모두 적용합니다:</p>
<pre><code translate="no">from pymilvus <span class="hljs-keyword">import</span> MilvusClient

source_client = MilvusClient(uri=source_cluster_addr, token=source_cluster_token)
source_client.update_replicate_configuration(**config)
source_client.<span class="hljs-built_in">close</span>()

target_client = MilvusClient(uri=target_cluster_addr, token=target_cluster_token)
target_client.update_replicate_configuration(**config)
target_client.<span class="hljs-built_in">close</span>()
<button class="copy-code-btn"></button></code></pre>
<p>이 작업이 성공하면 프라이머리의 증분 변경 사항이 자동으로 스탠바이에 복제되기 시작합니다.</p>
<h3 id="Step-5-Verify-That-Replication-Works" class="common-anchor-header">5단계: 복제가 작동하는지 확인</h3><ol>
<li>프라이머리에 연결하여 <a href="https://milvus.io/docs/manage-collections.md">컬렉션을 만들고</a>, <a href="https://milvus.io/docs/insert-update-delete.md">벡터를 삽입하고</a>, <a href="https://milvus.io/docs/load-and-release.md">로드합니다</a>.</li>
<li>프라이머리에서 검색을 실행하여 데이터가 있는지 확인합니다.</li>
<li>스탠바이에 연결하여 동일한 검색을 실행합니다.</li>
<li>스탠바이가 동일한 결과를 반환하면 복제가 작동하는 것입니다.</li>
</ol>
<p>참조가 필요한 경우 <a href="https://milvus.io/docs/quickstart.md">Milvus 빠른 시작에서</a> 컬렉션 생성, 삽입 및 검색을 다룹니다.</p>
<h2 id="Running-CDC-in-Production" class="common-anchor-header">프로덕션 환경에서 CDC 실행<button data-href="#Running-CDC-in-Production" class="anchor-icon" translate="no">
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
    </button></h2><p>CDC 설정은 간단한 부분입니다. 시간이 지나도 안정적으로 유지하려면 몇 가지 운영 영역에 주의를 기울여야 합니다.</p>
<h3 id="Monitor-Replication-Lag" class="common-anchor-header">복제 지연 모니터링</h3><p>대기 상태는 항상 기본 상태보다 약간 뒤처지는데, 이는 비동기 복제에 내재된 특성입니다. 정상적인 부하에서는 지연 시간이 몇 초에 불과합니다. 그러나 쓰기 급증, 네트워크 혼잡 또는 대기 상태의 리소스 압박으로 인해 지연이 길어질 수 있습니다.</p>
<p>지연을 메트릭으로 추적하고 이에 대한 경고를 표시하세요. 복구되지 않고 지연이 길어진다는 것은 일반적으로 CDC 노드가 쓰기 처리량을 따라잡을 수 없다는 뜻입니다. 먼저 클러스터 간의 네트워크 대역폭을 확인한 다음 대기 상태에 더 많은 리소스가 필요한지 여부를 고려하세요.</p>
<h3 id="Use-the-Standby-for-Read-Scaling" class="common-anchor-header">읽기 확장을 위해 스탠바이 사용</h3><p>스탠바이 노드는 재해가 발생할 때까지 유휴 상태로 대기하는 콜드 백업이 아닙니다. 복제가 활성화되어 있는 동안에는 <a href="https://milvus.io/docs/single-vector-search.md">검색 및 쿼리 요청을</a> 수락하고 쓰기만 차단합니다. 따라서 실용적인 용도로 사용할 수 있습니다:</p>
<ul>
<li>일괄 <a href="https://zilliz.com/glossary/similarity-search">유사도 검색</a> 또는 분석 워크로드를 대기 상태로 라우팅하기</li>
<li>피크 시간대에 읽기 트래픽을 분할하여 기본 서버에 대한 부담 감소</li>
<li>프로덕션 쓰기 지연 시간에 영향을 주지 않고 고비용 쿼리(대규모 컬렉션에 걸친 대용량 상위-K, 필터링된 검색)를 실행합니다.</li>
</ul>
<p>DR 인프라를 성능 자산으로 전환합니다. 장애가 발생하지 않는 경우에도 대기 상태가 유지됩니다.</p>
<h3 id="Size-the-Standby-Correctly" class="common-anchor-header">올바른 대기 크기 조정</h3><p>스탠바이에서는 프라이머리에서 모든 쓰기를 재생하므로 비슷한 컴퓨팅 및 메모리 리소스가 필요합니다. 읽기 작업도 라우팅하는 경우 추가 부하를 고려하세요. 스토리지 요구 사항은 동일하며 동일한 데이터를 보관합니다.</p>
<h3 id="Test-Failover-Before-You-Need-It" class="common-anchor-header">필요하기 전에 장애 조치 테스트</h3><p>실제 장애가 발생할 때까지 기다렸다가 장애 조치 프로세스가 작동하지 않는다는 사실을 알아내지 마세요. 주기적으로 훈련을 실행하세요:</p>
<ol>
<li>기본 데이터에 대한 쓰기 중지</li>
<li>스탠바이가 따라잡을 때까지 기다림(지연 → 0)</li>
<li>스탠바이 승격</li>
<li>쿼리가 예상 결과를 반환하는지 확인</li>
<li>프로세스 역순으로 진행</li>
</ol>
<p>각 단계에 걸리는 시간을 측정하고 문서화하세요. 목표는 장애 조치를 새벽 3시에 스트레스를 주는 즉흥적인 조치가 아니라 타이밍이 알려진 일상적인 절차로 만드는 것입니다. 이 시리즈의 3부에서는 장애 조치 프로세스에 대해 자세히 다룹니다.</p>
<h2 id="Dont-Want-to-Manage-CDC-Yourself-Zilliz-Cloud-Handles-It" class="common-anchor-header">CDC를 직접 관리하고 싶지 않으신가요? 질리즈 클라우드가 처리합니다.<button data-href="#Dont-Want-to-Manage-CDC-Yourself-Zilliz-Cloud-Handles-It" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus의 CDC 복제를 설정하고 운영하는 것은 강력하지만, 두 개의 클러스터를 관리하고, 복제 상태를 모니터링하고, 장애 조치 런북을 처리하고, 여러 지역에 걸쳐 인프라를 유지해야 하는 등 운영 오버헤드가 발생합니다. 운영 부담 없이 프로덕션급 HA를 원하는 팀을 위해 <a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a> (관리형 Milvus)는 이를 기본으로 제공합니다.</p>
<p><strong>글로벌 클러스터는</strong> 질리즈 클라우드의 대표 기능입니다. 이를 통해 북미, 유럽, 아시아 태평양 등 여러 지역에 걸친 Milvus 배포를 단일 논리적 클러스터로 실행할 수 있습니다. 내부적으로는 이 문서에서 설명한 것과 동일한 CDC/WAL 복제 기술을 사용하지만 완전히 관리됩니다:</p>
<table>
<thead>
<tr><th>기능</th><th>자체 관리형 CDC(이 문서)</th><th>질리즈 클라우드 글로벌 클러스터</th></tr>
</thead>
<tbody>
<tr><td><strong>복제</strong></td><td>사용자가 구성 및 모니터링</td><td>자동화된 비동기 CDC 파이프라인</td></tr>
<tr><td><strong>페일오버</strong></td><td>수동 런북</td><td>자동화 - 코드 변경, 연결 문자열 업데이트 없음</td></tr>
<tr><td><strong>자가 복구</strong></td><td>장애 클러스터를 다시 프로비저닝</td><td>자동: 오래된 상태를 감지하여 재설정하고 새로운 보조로 재구축합니다.</td></tr>
<tr><td><strong>교차 지역</strong></td><td>두 클러스터를 모두 배포 및 관리</td><td>로컬 읽기 액세스가 가능한 멀티 리전 기본 제공</td></tr>
<tr><td><strong>RPO</strong></td><td>초(모니터링에 따라 다름)</td><td>초(비계획) / 0(계획된 전환)</td></tr>
<tr><td><strong>RTO</strong></td><td>분(런북에 따라 다름)</td><td>분(자동)</td></tr>
</tbody>
</table>
<p>비즈니스 크리티컬 요금제에는 글로벌 클러스터 외에도 추가적인 DR 기능이 포함되어 있습니다:</p>
<ul>
<li>특정<strong>시점 복구(PITR)</strong> - 보존 기간 내 어느 시점으로든 컬렉션을 롤백하여 실수로 삭제하거나 대기 상태로 복제되는 데이터 손상으로부터 복구하는 데 유용합니다.</li>
<li><strong>지역 간</strong> 백업 - 대상 지역으로 자동화된 지속적인 백업 복제를 수행합니다. 새 클러스터로 복원하는 데 몇 분밖에 걸리지 않습니다.</li>
<li><strong>99.99% 가동 시간 SLA</strong> - 여러 복제본이 있는 다중 AZ 배포로 지원됩니다.</li>
</ul>
<p>프로덕션 환경에서 벡터 검색을 실행 중이고 DR이 필요한 경우, 자체 관리형 Milvus 접근 방식과 함께 Zilliz Cloud를 평가해 볼 가치가 있습니다. 자세한 내용은 <a href="https://zilliz.com/contact-sales">Zilliz 팀에 문의</a> 하세요.</p>
<h2 id="Whats-Next" class="common-anchor-header">다음 단계<button data-href="#Whats-Next" class="anchor-icon" translate="no">
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
    </button></h2><p>이 문서에서는 벡터 데이터베이스의 HA 환경을 다루고 기본-대기 쌍을 처음부터 구축하는 과정을 안내했습니다. 다음 단계로 넘어갑니다:</p>
<ul>
<li><strong>2부</strong>: 이미 데이터가 있는 기존 Milvus 클러스터에 CDC 추가하기 - 복제를 활성화하기 전에 <a href="https://milvus.io/docs/milvus_backup_overview.md">Milvus 백업을</a> 사용하여 스탠바이에 시딩하기</li>
<li><strong>3부</strong>: 장애 조치 관리 - 대기 상태 승격, 트래픽 리디렉션, 원본 기본 복구하기</li>
</ul>
<p>계속 지켜봐 주세요.</p>
<hr>
<p>프로덕션 환경에서 <a href="https://milvus.io/">Milvus를</a> 실행하고 재해 복구에 대해 고민하고 계신다면 저희가 도와드리겠습니다:</p>
<ul>
<li>Milvus <a href="https://slack.milvus.io/">Slack 커뮤니티에</a> 참여하여 질문하고, HA 아키텍처를 공유하고, Milvus를 대규모로 실행 중인 다른 팀으로부터 배우세요.</li>
<li><a href="https://milvus.io/office-hours">20분 동안 진행되는 무료 Milvus 오피스 아워 세션을 예약하여</a> CDC 구성, 장애 조치 계획, 다중 지역 배포 등 DR 설정에 대해 안내받으세요.</li>
<li>인프라 설정을 건너뛰고 바로 프로덕션 지원 HA로 이동하려는 경우, <a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a> (관리형 Milvus)는 글로벌 클러스터 기능을 통해 수동 CDC 설정이 필요 없는 지역 간 고가용성을 제공합니다.</li>
</ul>
<hr>
<p>팀이 벡터 데이터베이스 고가용성을 설정하기 시작할 때 자주 묻는 몇 가지 질문입니다:</p>
<p><strong>질문: CDC가 기본 클러스터의 속도를 저하시키나요?</strong></p>
<p>CDC 노드는 읽기/쓰기 경로와 무관하게 비동기적으로 WAL 로그를 읽습니다. 기본 클러스터의 리소스에 대한 쿼리 또는 삽입과 경쟁하지 않습니다. CDC를 사용해도 성능에는 차이가 없습니다.</p>
<p><strong>질문: CDC가 활성화되기 전에 존재했던 데이터를 복제할 수 있나요?</strong></p>
<p>아니요 - CDC는 활성화된 시점의 변경 사항만 캡처합니다. 기존 데이터를 스탠바이로 가져오려면 먼저 <a href="https://milvus.io/docs/milvus_backup_overview.md">Milvus Backup을</a> 사용하여 스탠바이를 시딩한 다음 지속적인 복제를 위해 CDC를 활성화하세요. 이 시리즈의 2부에서는 이 워크플로우를 다룹니다.</p>
<p><strong>질문: 이미 다중 복제 기능을 활성화한 경우에도 CDC가 필요한가요?</strong></p>
<p>예. 다양한 장애 모드로부터 보호합니다. <a href="https://milvus.io/docs/replica.md">멀티 복제본은</a> 하나의 클러스터 내의 여러 노드에 동일한 <a href="https://milvus.io/docs/glossary.md">세그먼트의</a> 사본을 유지하므로 노드 장애에 유용하지만 전체 클러스터가 사라진 경우(배포 오류, AZ 중단, 네임스페이스 삭제)에는 쓸모가 없습니다. CDC는 거의 실시간에 가까운 데이터로 다른 장애 도메인에 별도의 클러스터를 유지합니다. 개발 환경 이외의 환경에서는 이 두 가지가 모두 필요합니다.</p>
<p><strong>질문: Milvus CDC는 다른 벡터 데이터베이스의 복제와 어떻게 비교되나요?</strong></p>
<p>오늘날 대부분의 벡터 데이터베이스는 노드 수준의 중복성(멀티 복제본과 동일)을 제공하지만 클러스터 수준의 복제 기능은 없습니다. Milvus는 현재 WAL 기반 CDC 복제가 내장된 유일한 주요 벡터 데이터베이스로, PostgreSQL이나 MySQL 같은 관계형 데이터베이스가 수십 년 동안 사용해온 검증된 패턴입니다. 클러스터 간 또는 지역 간 장애 복구가 요구되는 경우, 이는 의미 있는 차별화 요소로 평가할 수 있습니다.</p>
