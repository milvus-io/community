---
id: 2022-1-25-annoucing-general-availability-of-milvus-2-0.md
title: Milvus 2.0 정식 출시 발표
author: Xiaofan Luan
date: 2022-01-25T00:00:00.000Z
desc: 대용량 고차원 데이터를 손쉽게 처리하는 방법
cover: assets.zilliz.com/Milvus_2_0_GA_4308a0f552.png
tag: News
---
<p>Milvus 커뮤니티의 회원과 친구 여러분:</p>
<p>첫 번째 릴리즈 후보(RC)가 공개된 지 6개월이 지난 오늘, Milvus 2.0이 정식 버전 <a href="https://milvus.io/docs/v2.0.x/release_notes.md#v200">(GA)</a> 으로 출시되었음을 알려드리게 되어 매우 기쁩니다! 긴 여정이었으며, 이 모든 과정을 도와주신 커뮤니티 기여자, 사용자, LF AI 및 데이터 재단 등 모든 분들께 감사드립니다.</p>
<p>수십억 개의 고차원 데이터를 처리할 수 있는 능력은 오늘날 AI 시스템에서 매우 중요한 문제이며, 그럴 만한 이유가 있습니다:</p>
<ol>
<li>기존의 정형 데이터에 비해 비정형 데이터가 압도적으로 많은 양을 차지하고 있기 때문입니다.</li>
<li>데이터의 최신성이 그 어느 때보다 중요해졌습니다. 데이터 과학자들은 기존의 T+1 타협이 아닌 시기적절한 데이터 솔루션을 원하고 있습니다.</li>
<li>비용과 성능이 더욱 중요해졌지만, 현재 솔루션과 실제 사용 사례 사이에는 여전히 큰 격차가 존재합니다. 따라서 Milvus 2.0이 탄생했습니다. Milvus는 고차원 데이터를 대규모로 처리하는 데 도움이 되는 데이터베이스입니다. 어디서나 실행할 수 있는 클라우드용으로 설계되었습니다. Milvus의 RC 릴리스를 계속 지켜보셨다면, Milvus를 더욱 안정적이고 배포 및 유지 관리가 용이하도록 만드는 데 많은 노력을 기울여 왔다는 것을 알고 계실 것입니다.</li>
</ol>
<h2 id="Milvus-20-GA-now-offers" class="common-anchor-header">Milvus 2.0 GA는 이제 다음을 제공합니다.<button data-href="#Milvus-20-GA-now-offers" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>엔티티 삭제</strong></p>
<p>데이터베이스로서 Milvus는 이제 <a href="https://milvus.io/docs/v2.0.x/delete_data.md">기본 키별 엔티티 삭제를</a> 지원하며, 추후 표현식별 엔티티 삭제도 지원할 예정입니다.</p>
<p><strong>자동 로드 밸런스</strong></p>
<p>Milvus는 이제 각 쿼리 노드와 데이터 노드의 부하를 분산시키는 플러그인 부하 분산 정책을 지원합니다. 계산과 스토리지의 분리 덕분에 단 몇 분 만에 부하 분산이 완료됩니다.</p>
<p><strong>핸드오프</strong></p>
<p>플러시를 통해 증가하는 세그먼트가 봉인되면 핸드오프 작업은 증가하는 세그먼트를 색인된 기록 세그먼트로 대체하여 검색 성능을 개선합니다.</p>
<p><strong>데이터 압축</strong></p>
<p>데이터 압축은 작은 세그먼트를 큰 세그먼트로 병합하고 논리적으로 삭제된 데이터를 정리하는 백그라운드 작업입니다.</p>
<p><strong>임베디드 등데이터 및 로컬 데이터 저장소 지원</strong></p>
<p>Milvus 독립형 모드에서는 몇 가지 설정만으로 etcd/MinIO 종속성을 제거할 수 있습니다. 또한 로컬 데이터 스토리지를 로컬 캐시로 사용하여 모든 데이터를 메인 메모리로 로드하지 않아도 됩니다.</p>
<p><strong>다국어 SDK</strong></p>
<p>이제 <a href="https://github.com/milvus-io/pymilvus">PyMilvus</a> 외에도 <a href="https://github.com/milvus-io/milvus-sdk-node">Node.js</a>, <a href="https://github.com/milvus-io/milvus-sdk-java">Java</a>, <a href="https://github.com/milvus-io/milvus-sdk-go">Go</a> SDK를 바로 사용할 수 있습니다.</p>
<p><strong>Milvus K8s 오퍼레이터</strong></p>
<p>Milvus<a href="https://milvus.io/docs/v2.0.x/install_cluster-milvusoperator.md">Operator는</a> Milvus 구성 요소와 관련 종속 요소(예: etcd, Pulsar 및 MinIO)를 포함한 전체 Milvus 서비스 스택을 확장 가능하고 가용성이 높은 방식으로 대상 <a href="https://kubernetes.io/">Kubernetes</a> 클러스터에 배포 및 관리할 수 있는 간편한 솔루션을 제공합니다.</p>
<p><strong>Milvus를 관리하는 데 도움이 되는 도구</strong></p>
<p>관리 도구의 환상적인 기여에 대해 감사해야 할 <a href="https://zilliz.com/">Zilliz가</a> 있습니다. 이제 직관적인 GUI를 통해 Milvus와 상호 작용할 수 있는 <a href="https://milvus.io/docs/v2.0.x/attu.md">Attu와</a> Milvus를 관리하기 위한 명령줄 도구인 <a href="https://milvus.io/docs/v2.0.x/cli_overview.md">Milvus_CLI가</a> 있습니다.</p>
<p>212명의 모든 기여자 덕분에 커뮤니티는 지난 6개월 동안 6718개의 커밋을 완료했으며 수많은 안정성 및 성능 문제가 해결되었습니다. 2.0 GA 릴리스 직후 안정성 및 성능 벤치마크 보고서를 공개할 예정입니다.</p>
<h2 id="Whats-next" class="common-anchor-header">다음 단계는 무엇인가요?<button data-href="#Whats-next" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>기능</strong></p>
<p>문자열 유형 지원은 Milvus 2.1의 다음 킬러 기능이 될 것입니다. 또한 사용자 요구를 더 잘 충족시키기 위해 TTL(Time to Live) 메커니즘과 기본 ACL 관리 기능을 도입할 예정입니다.</p>
<p><strong>가용성</strong></p>
<p>각 세그먼트에 대한 다중 메모리 복제본을 지원하기 위해 쿼리 코디 스케줄링 메커니즘을 리팩토링하는 작업을 진행 중입니다. 여러 개의 활성 복제본을 통해 Milvus는 더 빠른 페일오버와 추측 실행을 지원하여 가동 중단 시간을 몇 초 이내로 단축할 수 있습니다.</p>
<p><strong>성능</strong></p>
<p>성능 벤치마크 결과는 곧 웹사이트를 통해 제공될 예정입니다. 다음 릴리스에서는 성능이 크게 향상될 것으로 예상됩니다. 저희의 목표는 더 작은 데이터 세트에서 검색 지연 시간을 절반으로 줄이고 시스템 처리량을 두 배로 늘리는 것입니다.</p>
<p><strong>사용 편의성</strong></p>
<p>Milvus는 어디서나 실행되도록 설계되었습니다. 향후 몇 차례의 소규모 릴리즈에서 MacOS(M1 및 X86 모두)와 ARM 서버에서 Milvus를 지원할 예정입니다. 또한 복잡한 환경 설정 없이 간단히 <code translate="no">pip install</code> Milvus를 사용할 수 있도록 임베디드 PyMilvus를 제공할 예정입니다.</p>
<p><strong>커뮤니티 거버넌스</strong></p>
<p>멤버십 규칙을 개선하고 기여자 역할의 요구 사항과 책임을 명확히 할 것입니다. 멘토링 프로그램도 개발 중이므로 클라우드 네이티브 데이터베이스, 벡터 검색 및/또는 커뮤니티 거버넌스에 관심이 있는 분이라면 언제든지 문의해 주세요.</p>
<p>최신 Milvus GA 릴리스가 정말 기대됩니다! 언제나 그렇듯이 여러분의 피드백을 기다리겠습니다. 문제가 발생하면 주저하지 마시고 <a href="https://github.com/milvus-io/milvus">GitHub</a> 또는 <a href="http://milvusio.slack.com/">Slack을</a> 통해 문의해 주세요.</p>
<p><br/></p>
<p>감사합니다,</p>
<p>샤오판 루안</p>
<p>Milvus 프로젝트 관리자</p>
<p><br/></p>
<blockquote>
<p><em> <a href="https://github.com/claireyuw">클레어 유</a> 편집.</em></p>
</blockquote>
