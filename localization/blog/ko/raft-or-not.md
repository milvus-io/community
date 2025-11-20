---
id: raft-or-not.md
title: '뗏목인가, 아닌가? 클라우드 네이티브 데이터베이스의 데이터 일관성을 위한 최고의 솔루션'
author: Xiaofan Luan
date: 2022-05-16T00:00:00.000Z
desc: 합의 기반 복제 알고리즘이 분산 데이터베이스에서 데이터 일관성을 달성하기 위한 만병통치약이 아닌 이유는 무엇인가요?
cover: assets.zilliz.com/Tech_Modify_5_e18025ffbc.png
tag: Engineering
tags: 'Data science, Database, Tech, Artificial Intelligence, Vector Management'
canonicalUrl: 'https://milvus.io/blog/raft-or-not.md'
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Tech_Modify_5_e18025ffbc.png" alt="Cover image" class="doc-image" id="cover-image" />
   </span> <span class="img-wrapper"> <span>표지 이미지</span> </span></p>
<blockquote>
<p>이 글은 <a href="https://github.com/xiaofan-luan">샤오판 루안이</a> 작성하고 <a href="https://www.linkedin.com/in/yiyun-n-2aa713163/">안젤라 니가</a> 번역했습니다.</p>
</blockquote>
<p>합의 기반 복제는 많은 클라우드 네이티브 분산 데이터베이스에서 널리 채택되고 있는 전략입니다. 하지만 몇 가지 단점도 있고 만병통치약도 아닙니다.</p>
<p>이 글에서는 클라우드 네이티브 분산 데이터베이스에서 복제, 일관성, 합의의 개념을 설명한 다음, Paxos나 Raft와 같은 합의 기반 알고리즘이 왜 만병통치약이 아닌지 명확히 하고, 마지막으로 <a href="#a-log-replication-strategy-for-cloud-native-and-distributed-database">합의 기반 복제에 대한 해결책을</a> 제안하고자 합니다.</p>
<p><strong>건너뛰기:</strong></p>
<ul>
<li><a href="#Understanding-replication-consistency-and-consensus">복제, 일관성 및 합의에 대한 이해</a></li>
<li><a href="#Consensus-based-replication">합의 기반 복제</a></li>
<li><a href="#A-log-replication-strategy-for-cloud-native-and-distributed-database">클라우드 네이티브 및 분산 데이터베이스를 위한 로그 복제 전략</a></li>
<li><a href="#Summary">요약</a></li>
</ul>
<h2 id="Understanding-replication-consistency-and-consensus" class="common-anchor-header">복제, 일관성 및 합의에 대한 이해<button data-href="#Understanding-replication-consistency-and-consensus" class="anchor-icon" translate="no">
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
    </button></h2><p>Paxos와 Raft의 장단점을 자세히 살펴보고 가장 적합한 로그 복제 전략을 제안하기 전에 먼저 복제, 일관성, 합의에 대한 개념을 이해할 필요가 있습니다.</p>
<p>이 글은 주로 증분 데이터/로그의 동기화에 초점을 맞추고 있습니다. 따라서 데이터/로그 복제에 대해 이야기할 때는 기록 데이터가 아닌 증분 데이터 복제만 언급합니다.</p>
<h3 id="Replication" class="common-anchor-header">복제</h3><p>복제는 데이터 안정성을 높이고 데이터 쿼리를 가속화하기 위해 데이터의 복사본을 여러 개 만들어 다른 디스크, 프로세스, 머신, 클러스터 등에 저장하는 프로세스입니다. 복제에서는 데이터가 여러 위치에 복사되어 저장되므로 디스크 장애, 물리적 시스템 장애 또는 클러스터 오류로부터 데이터를 복구할 때 더욱 안정적입니다. 또한, 데이터의 여러 복제본은 쿼리 속도를 크게 높여 분산 데이터베이스의 성능을 향상시킬 수 있습니다.</p>
<p>복제 모드에는 동기식/비동기식 복제, 강력한/이벤트 일관성 복제, 리더-팔로워/분산 복제 등 다양한 모드가 있습니다. 복제 모드의 선택은 시스템 가용성과 일관성에 영향을 미칩니다. 따라서 유명한 <a href="https://medium.com/analytics-vidhya/cap-theorem-in-distributed-system-and-its-tradeoffs-d8d981ecf37e">CAP 정리에서</a> 제안한 것처럼, 시스템 설계자는 네트워크 분할이 불가피한 경우 일관성과 가용성 사이에서 절충점을 찾아야 합니다.</p>
<h3 id="Consistency" class="common-anchor-header">일관성</h3><p>간단히 말해, 분산 데이터베이스의 일관성이란 주어진 시간에 데이터를 쓰거나 읽을 때 모든 노드 또는 복제본이 동일한 데이터 보기를 갖도록 보장하는 속성을 말합니다. 일관성 수준의 전체 목록은 <a href="https://docs.microsoft.com/en-us/azure/cosmos-db/consistency-levels">여기에서</a> 문서를 참조하세요.</p>
<p>명확히 하기 위해, 여기서 말하는 일관성은 ACID(원자성, 일관성, 격리성, 내구성)가 아니라 CAP 정리에서 말하는 일관성에 대해 이야기하고 있습니다. CAP 정리의 일관성은 시스템의 각 노드가 동일한 데이터를 갖는 것을 의미하며, ACID의 일관성은 단일 노드가 모든 잠재적 커밋에 대해 동일한 규칙을 적용하는 것을 의미합니다.</p>
<p>일반적으로 OLTP(온라인 트랜잭션 처리) 데이터베이스는 이를 보장하기 위해 강력한 일관성 또는 선형화 가능성이 필요합니다:</p>
<ul>
<li>각 읽기는 최신 삽입 데이터에 액세스할 수 있습니다.</li>
<li>읽기 후에 새 값이 반환되는 경우, 동일하거나 다른 클라이언트에 관계없이 모든 후속 읽기에서 새 값을 반환해야 합니다.</li>
</ul>
<p>선형화 기능의 핵심은 여러 데이터 복제본의 최신성을 보장하는 것입니다. 새 값을 쓰거나 읽으면 이후의 모든 읽기는 나중에 값을 덮어쓰기 전까지 새 값을 볼 수 있습니다. 선형화 가능성을 제공하는 분산 시스템은 사용자가 여러 복제본을 주시해야 하는 수고를 덜어주고 원자성과 순서 또는 각 작업을 보장할 수 있습니다.</p>
<h3 id="Consensus" class="common-anchor-header">합의</h3><p>사용자가 분산 시스템이 독립형 시스템과 동일한 방식으로 작동하기를 열망함에 따라 합의라는 개념이 분산 시스템에 도입되었습니다.</p>
<p>간단히 말해, 합의는 가치에 대한 일반적인 합의입니다. 예를 들어 스티브와 프랭크는 무언가를 먹고 싶었습니다. 스티브는 샌드위치를 먹자고 제안했습니다. 프랭크는 스티브의 제안에 동의했고 두 사람은 샌드위치를 먹었습니다. 그들은 합의에 도달했습니다. 좀 더 구체적으로 말하면, 둘 중 한 명이 제안한 가치(샌드위치)에 대해 두 사람이 동의하고 그 가치에 따라 두 사람 모두 행동을 취하는 것입니다. 마찬가지로 분산 시스템에서의 합의는 한 프로세스가 어떤 값을 제안하면 시스템의 나머지 모든 프로세스가 이 값에 동의하고 그에 따라 행동하는 것을 의미합니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2bb46e57_9eb5_456e_be7e_e7762aa9eb7e_68dd2e8e65.png" alt="Consensus" class="doc-image" id="consensus" />
   </span> <span class="img-wrapper"> <span>합의</span> </span></p>
<h2 id="Consensus-based-replication" class="common-anchor-header">합의 기반 복제<button data-href="#Consensus-based-replication" class="anchor-icon" translate="no">
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
    </button></h2><p>최초의 합의 기반 알고리즘은 1988년 <a href="https://pmg.csail.mit.edu/papers/vr.pdf">뷰스탬프 복제와</a> 함께 제안되었습니다. 1989년 Leslie Lamport는 합의 기반 알고리즘인 <a href="https://lamport.azurewebsites.net/pubs/paxos-simple.pdf">Paxos를</a> 제안했습니다.</p>
<p>최근 몇 년 동안 업계에서 또 다른 합의 기반 알고리즘인 <a href="https://raft.github.io/">Raft가</a> 널리 사용되고 있습니다. 이 알고리즘은 CockroachDB, TiDB, OceanBase 등과 같은 많은 주류 NewSQL 데이터베이스에서 채택되었습니다.</p>
<p>특히, 분산 시스템이 합의 기반 복제를 채택하더라도 반드시 선형화 가능성을 지원하는 것은 아닙니다. 그러나 선형화 가능성은 ACID 분산 데이터베이스를 구축하기 위한 전제 조건입니다.</p>
<p>데이터베이스 시스템을 설계할 때는 로그와 상태 머신의 커밋 순서를 고려해야 합니다. 또한 Paxos 또는 Raft의 리더 리스를 유지하고 네트워크 파티션에서 분할 브레인을 방지하기 위해 각별한 주의가 필요합니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://user-images.githubusercontent.com/1500781/165926429-69b5144c-f3ba-4819-87c3-ab7e04a7e22e.png" alt="Raft replication state machine" class="doc-image" id="raft-replication-state-machine" />
   </span> <span class="img-wrapper"> <span>래프트 복제 스테이트 머신</span> </span></p>
<h3 id="Pros-and-cons" class="common-anchor-header">장단점</h3><p>실제로 Raft, ZAB, Aurora의 <a href="https://aws.amazon.com/blogs/database/amazon-aurora-under-the-hood-quorum-and-correlated-failure/">쿼럼 기반 로그 프로토콜은</a> 모두 Paxos의 변형입니다. 합의 기반 복제에는 다음과 같은 장점이 있습니다:</p>
<ol>
<li>합의 기반 복제는 CAP 정리에서 일관성과 네트워크 파티션에 더 중점을 두지만, 기존의 리더-팔로워 복제에 비해 상대적으로 더 나은 가용성을 제공합니다.</li>
<li>Raft는 합의 기반 알고리즘을 크게 단순화한 획기적인 기술입니다. 그리고 GitHub에는 많은 오픈 소스 Raft 라이브러리가 있습니다(예: <a href="https://github.com/sofastack/sofa-jraft">소파-크래프트</a>).</li>
<li>합의 기반 복제의 성능은 대부분의 애플리케이션과 비즈니스를 만족시킬 수 있습니다. 고성능 SSD와 기가바이트 NIC(네트워크 인터페이스 카드)의 보급으로 여러 복제본을 동기화해야 하는 부담이 줄어들어 Paxos와 Raft 알고리즘이 업계의 주류로 자리 잡았습니다.</li>
</ol>
<p>한 가지 오해는 합의 기반 복제가 분산 데이터베이스에서 데이터 일관성을 달성하기 위한 만병통치약이라는 것입니다. 하지만 이는 사실이 아닙니다. 합의 기반 알고리즘이 직면한 가용성, 복잡성, 성능의 문제 때문에 완벽한 솔루션이 될 수 없습니다.</p>
<ol>
<li><p>가용성 저하 최적화된 Paxos 또는 Raft 알고리즘은 리더 복제본에 대한 의존도가 높기 때문에 회색 장애에 대한 대처 능력이 약합니다. 합의 기반 복제에서는 리더 노드가 오랫동안 응답하지 않을 때까지 리더 복제본의 새로운 선출이 이루어지지 않습니다. 따라서 합의 기반 복제는 리더 노드가 느리거나 쓰래싱이 발생하는 상황을 처리할 수 없습니다.</p></li>
<li><p>높은 복잡성 이미 Paxos와 Raft를 기반으로 하는 확장된 알고리즘이 많이 있지만, <a href="http://www.vldb.org/pvldb/vol13/p3072-huang.pdf">Multi-Raft와</a> <a href="https://www.vldb.org/pvldb/vol11/p1849-cao.pdf">Parallel Raft의</a> 등장으로 로그와 상태 머신 간의 동기화에 대해 더 많은 고려와 테스트가 필요합니다.</p></li>
<li><p>성능 저하 클라우드 네이티브 시대에는 데이터 안정성과 일관성을 보장하기 위해 로컬 스토리지를 EBS 및 S3와 같은 공유 스토리지 솔루션으로 대체합니다. 그 결과, 합의 기반 복제는 더 이상 분산 시스템에서 필수 사항이 아닙니다. 또한, 합의 기반 복제는 솔루션과 EBS 모두 복수의 복제본을 가지고 있기 때문에 데이터 중복성 문제가 발생합니다.</p></li>
</ol>
<p>멀티 데이터센터 및 멀티 클라우드 복제의 경우, 일관성을 추구하면 가용성뿐만 아니라 <a href="https://en.wikipedia.org/wiki/PACELC_theorem">지연</a> 시간도 저하되어 성능이 저하됩니다. 따라서 대부분의 애플리케이션에서 다중 데이터센터 재해 내성을 위해서는 선형화 기능이 반드시 필요한 것은 아닙니다.</p>
<h2 id="A-log-replication-strategy-for-cloud-native-and-distributed-database" class="common-anchor-header">클라우드 네이티브 및 분산 데이터베이스를 위한 로그 복제 전략<button data-href="#A-log-replication-strategy-for-cloud-native-and-distributed-database" class="anchor-icon" translate="no">
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
    </button></h2><p>부인할 수 없는 사실은 Raft와 Paxos 같은 합의 기반 알고리즘이 여전히 많은 OLTP 데이터베이스에서 채택하고 있는 주류 알고리즘이라는 것입니다. 하지만 <a href="https://www.microsoft.com/en-us/research/publication/pacifica-replication-in-log-based-distributed-storage-systems/">퍼시피카</a> 프로토콜, <a href="https://www.microsoft.com/en-us/research/uploads/prod/2019/05/socrates.pdf">소크라테스</a>, <a href="https://rockset.com/">록셋의</a> 사례를 보면 트렌드가 변화하고 있음을 알 수 있습니다.</p>
<p>클라우드 네이티브 분산 데이터베이스를 가장 잘 지원할 수 있는 솔루션에는 크게 두 가지 원칙이 있습니다.</p>
<h3 id="1-Replication-as-a-service" class="common-anchor-header">1. 서비스로서의 복제</h3><p>데이터 동기화 전용 마이크로서비스가 별도로 필요합니다. 동기화 모듈과 스토리지 모듈은 더 이상 동일한 프로세스 내에서 긴밀하게 결합되어서는 안 됩니다.</p>
<p>예를 들어, Socrates는 스토리지, 로그, 컴퓨팅을 분리합니다. 하나의 전용 로그 서비스(아래 그림 가운데의 XLog 서비스)가 있습니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_0d7822a781.png" alt="Socrates architecture" class="doc-image" id="socrates-architecture" />
   </span> <span class="img-wrapper"> <span>소크라테스 아키텍처</span> </span></p>
<p>XLog 서비스는 개별 서비스입니다. 지연 시간이 짧은 스토리지의 도움으로 데이터 지속성을 달성합니다. 소크라테스의 랜딩 존은 3개의 복제본을 빠른 속도로 보관하는 역할을 담당합니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_6d1182b6f1.png" alt="Socrates XLog service" class="doc-image" id="socrates-xlog-service" />
   </span> <span class="img-wrapper"> <span>소크라테스 XLog 서비스</span> </span></p>
<p>리더 노드는 로그 브로커에 로그를 비동기적으로 배포하고 데이터를 Xstore로 플러시합니다. 로컬 SSD 캐시는 데이터 읽기를 가속화할 수 있습니다. 데이터 플러시가 성공하면 랜딩 영역의 버퍼를 정리할 수 있습니다. 모든 로그 데이터는 랜딩 영역, 로컬 SSD, XStore의 세 가지 계층으로 나뉩니다.</p>
<h3 id="2-Russian-doll-principle" class="common-anchor-header">2. 러시아 인형 원리</h3><p>시스템을 설계하는 한 가지 방법은 러시안 인형 원칙을 따르는 것입니다. 각 레이어가 완전하고 그 레이어가 하는 일에 완벽하게 적합해야 다른 레이어가 그 위에 또는 그 주위에 구축될 수 있다는 원칙입니다.</p>
<p>클라우드 네이티브 데이터베이스를 설계할 때는 시스템 아키텍처의 복잡성을 줄이기 위해 다른 타사 서비스를 현명하게 활용해야 합니다.</p>
<p>단일 지점 장애를 피하기 위해 Paxos를 사용할 수는 없는 것 같습니다. 그러나 리더 선출을 <a href="https://research.google.com/archive/chubby-osdi06.pdf">Chubby</a>, <a href="https://github.com/bloomreach/zk-replicator">Zk</a> <a href="https://etcd.io/">등을</a> 기반으로 하는 Raft 또는 Paxos 서비스로 넘겨 로그 복제를 크게 간소화할 수 있습니다.</p>
<p>예를 들어, <a href="https://rockset.com/">Rockset</a> 아키텍처는 러시안 인형 원리를 따르며 분산 로그에는 Kafka/Kineses를, 스토리지에는 S3를, 쿼리 성능 향상을 위해 로컬 SSD 캐시를 사용합니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://user-images.githubusercontent.com/1500781/165926697-c8b380dc-d71a-41a9-a76d-a261b77f0b5d.png" alt="Rockset architecture" class="doc-image" id="rockset-architecture" />
   </span> <span class="img-wrapper"> <span>Rockset 아키텍처</span> </span></p>
<h3 id="The-Milvus-approach" class="common-anchor-header">Milvus 접근 방식</h3><p>Milvus의 조정 가능한 일관성은 사실 합의 기반 복제의 팔로워 읽기와 유사합니다. 팔로워 읽기 기능은 강력한 일관성을 전제로 팔로워 복제본을 사용하여 데이터 읽기 작업을 수행하는 것을 말합니다. 그 목적은 클러스터 처리량을 향상시키고 리더의 부하를 줄이는 것입니다. 팔로워 읽기 기능의 메커니즘은 최신 로그의 커밋 인덱스를 조회하고 커밋 인덱스의 모든 데이터가 스테이트 머신에 적용될 때까지 쿼리 서비스를 제공하는 것입니다.</p>
<p>하지만 Milvus의 설계는 팔로워 전략을 채택하지 않았습니다. 즉, Milvus는 쿼리 요청을 받을 때마다 커밋 인덱스를 조회하지 않습니다. 대신, Milvus는 <a href="https://flink.apache.org/">Flink의</a> 워터마크와 같은 메커니즘을 채택하여 쿼리 노드에 커밋 인덱스의 위치를 일정한 간격으로 알려줍니다. 이러한 메커니즘을 채택하는 이유는 Milvus 사용자는 일반적으로 데이터 일관성에 대한 요구가 높지 않으며, 더 나은 시스템 성능을 위해 데이터 가시성의 타협을 받아들일 수 있기 때문입니다.</p>
<p>또한 Milvus는 다중 마이크로서비스를 채택하고 스토리지와 컴퓨팅을 분리합니다. <a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md#A-bare-bones-skeleton-of-the-Milvus-architecture">Milvus 아키텍처에서는</a> S3, MinIo 및 Azure Blob이 스토리지에 사용됩니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Milvus_architecture_b7743a4a7f.png" alt="Milvus architecture" class="doc-image" id="milvus-architecture" />
   </span> <span class="img-wrapper"> <span>Milvus 아키텍처</span> </span></p>
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
    </button></h2><p>오늘날 점점 더 많은 클라우드 네이티브 데이터베이스가 로그 복제를 개별 서비스로 만들고 있습니다. 이렇게 하면 읽기 전용 복제본과 이기종 복제를 추가하는 데 드는 비용을 줄일 수 있습니다. 여러 마이크로서비스를 사용하면 기존 데이터베이스에서는 불가능했던 성숙한 클라우드 기반 인프라를 빠르게 활용할 수 있습니다. 개별 로그 서비스는 합의 기반 복제에 의존할 수도 있지만, 러시아 인형 전략에 따라 Paxos나 Raft와 함께 다양한 일관성 프로토콜을 채택하여 선형화 가능성을 달성할 수도 있습니다.</p>
<h2 id="References" class="common-anchor-header">참고 자료<button data-href="#References" class="anchor-icon" translate="no">
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
<li>램포트 L. 팩소스 단순화[J]. ACM SIGACT 뉴스 (분산 컴퓨팅 칼럼) 32, 4 (전체 번호 121, 2001년 12월), 2001: 51-58.</li>
<li>옹가로 D, 오스터하우트 J. 이해할 수 있는 합의 알고리즘을 찾아서[C]//2014 USENIX 연례 기술 컨퍼런스(Usenix ATC 14). 2014: 305-319.</li>
<li>오키 B M, 리스코프 B H. 뷰스탬프 복제: 고가용성 분산 시스템을 지원하는 새로운 기본 복사 방법[C]// 분산 컴퓨팅의 원리에 관한 일곱 번째 연례 ACM 심포지엄의 절차. 1988: 8-17.</li>
<li>Lin W, Yang M, Zhang L 외. PacificA: 로그 기반 분산 스토리지 시스템에서의 복제[J]. 2008.</li>
<li>Verbitski A, Gupta A, Saha D 외. Amazon aurora: I/O, 커밋 및 멤버십 변경에 대한 분산 합의 방지[C]// 2018 국제 데이터 관리 컨퍼런스 논문집. 2018: 789-796.</li>
<li>Antonopoulos P, Budovski A, Diaconu C 외. Socrates: 클라우드의 새로운 SQL 서버[C]// 2019 국제 데이터 관리 컨퍼런스 논문집. 2019: 1743-1756.</li>
</ul>
