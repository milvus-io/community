---
id: 2022-01-07-year-in-review.md
title: 2021년 밀버스 - 한 해를 돌아보며
author: Xiaofan Luan
date: 2022-01-07T00:00:00.000Z
desc: Milvus 커뮤니티가 달성한 성과와 2022년 계획에 대해 알아보세요.
cover: assets.zilliz.com/Year_in_review_6deaee3a96.png
tag: Events
---
<p>2021년은 오픈소스 프로젝트인 Milvus에게 놀라운 한 해였습니다. 이렇게 뛰어난 한 해를 보낼 수 있도록 기여해주신 모든 기여자와 Milvus 사용자, 그리고 파트너 여러분께 감사의 말씀을 전하고 싶습니다.</p>
<p><strong>올해 저에게 가장 인상적인 순간 중 하나는 Milvus 2.0의 출시입니다. 이 프로젝트를 시작하기 전에는 소수의 커뮤니티 구성원만이 우리가 세계에서 가장 진보된 벡터 데이터베이스를 제공할 수 있다고 믿었지만, 이제 Milvus 2.0 GA가 생산 준비가 되었다고 말할 수 있게 되어 자랑스럽습니다.</strong></p>
<p>우리는 이미 2022년을 위한 새롭고 흥미로운 도전 과제들을 준비하고 있지만, 작년에 우리가 취한 몇 가지 큰 발걸음을 축하하는 것도 재미있을 것 같았습니다. 다음은 몇 가지입니다:</p>
<h2 id="Community-Growth" class="common-anchor-header">커뮤니티 성장<button data-href="#Community-Growth" class="anchor-icon" translate="no">
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
    </button></h2><p>먼저, GitHub와 Slack의 커뮤니티 통계를 요약해 보겠습니다. 2021년 12월 말 기준:</p>
<ul>
<li><p><strong>기여자</strong> 수 2020년 12월 121명에서 2021년 12월 209명으로 증가(172% 증가)</p></li>
<li><p><strong>별은</strong> 2020년 12월 4828개에서 2021년 12월 9090개로 증가했습니다(188% 증가).</p></li>
<li><p><strong>포크는</strong> 2020년 12월 756개에서 2021년 12월 1383개로 증가했습니다(182% 증가).</p></li>
<li><p><strong>슬랙 멤버는</strong> 2020년 12월 541명에서 2021년 12월 1233명으로 증가했습니다(227% 증가).</p></li>
</ul>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_1_e94deb087f.png" alt="img" class="doc-image" id="img" />
   </span> <span class="img-wrapper"> <span>img</span> </span></p>
<h2 id="Community-Governance-and-Advocacy" class="common-anchor-header">커뮤니티 거버넌스 및 옹호<button data-href="#Community-Governance-and-Advocacy" class="anchor-icon" translate="no">
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
    </button></h2><p>2019년 10월 Milvus가 처음 오픈소스로 전환되었을 때는 비교적 소규모의 팀과 소규모 커뮤니티가 있었기 때문에 자연스럽게 소수의 핵심 팀원이 프로젝트를 주로 관리했습니다. 하지만 그 이후 커뮤니티가 크게 성장하면서 새로운 기여자를 더 효율적으로 맞이하기 위해 프로젝트를 운영할 더 나은 시스템이 필요하다는 것을 깨달았습니다.</p>
<p>그 결과, 2021년에 5명의 새로운 관리자를 임명하여 진행 중인 작업과 보고된 문제를 추적하여 적시에 검토하고 병합할 수 있도록 했습니다. 5명의 관리자의 GitHub ID는 @xiaofan-luan, @congqixia, @scsven, @czs007, @yanliang567입니다. PR과 관련하여 도움이 필요하시면 언제든지 이 관리자에게 연락해 주세요.</p>
<p>또한 <a href="https://milvus.io/community/milvus_advocate.md">Milvus 옹호자 프로그램을</a> 시작했으며, 더 많은 분들이 참여하여 경험을 공유하고 커뮤니티 구성원에게 도움을 주며 그 대가로 인정을 받을 수 있기를 바랍니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_2_835f379fb0.png" alt="img" class="doc-image" id="img" />
   </span> <span class="img-wrapper"> <span>img</span> </span></p>
<p>(이미지: Milvus GitHub 기여자, 역동적인 웹페이지의 <a href="https://github.com/dynamicwebpaige/nanowrimo-2021/blob/main/15_VS_Code_contributors.ipynb">프로젝트로</a> 제작 )</p>
<h2 id="Milvus-Project-Announcements-and-Milestones" class="common-anchor-header">Milvus 프로젝트 공지 및 마일스톤<button data-href="#Milvus-Project-Announcements-and-Milestones" class="anchor-icon" translate="no">
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
<li><strong>버전 릴리스 수: 14</strong></li>
</ol>
<ul>
<li><a href="https://milvus.io/blog/Whats-Inside-Milvus-1.0.md">Milvus 1.0 릴리스</a></li>
<li><a href="https://milvus.io/blog/milvus2.0-redefining-vector-database.md">Milvus 2.0 릴리스 RC</a></li>
<li><a href="https://milvus.io/docs/v2.0.x/release_notes.md#v200-PreGA">Milvus 2.0 릴리스 PreGA</a></li>
</ul>
<ol>
<li><strong>Milvus v2.0.0 GA 지원 SDK</strong></li>
</ol>
<ul>
<li><p>PyMilvus(사용 가능)</p></li>
<li><p>Go SDK(사용 가능)</p></li>
<li><p>Java SDK(사용 가능)</p></li>
<li><p>Node.js SDK(사용 가능)</p></li>
<li><p>C++ SDK(개발 중)</p></li>
</ul>
<ol start="3">
<li><strong>새로운 Milvus 도구 출시:</strong></li>
</ol>
<ul>
<li><a href="https://github.com/zilliztech/milvus_cli#community">Milvus_CLI</a> (Milvus 명령줄)</li>
<li><a href="https://github.com/zilliztech/attu">Attu</a> (Milvus 관리 GUI)</li>
<li><a href="https://github.com/milvus-io/milvus-operator">Milvus K8s 오퍼레이터</a></li>
</ul>
<ol start="4">
<li><p><strong><a href="https://lfaidata.foundation/blog/2021/06/23/lf-ai-data-foundation-announces-graduation-of-milvus-project/">Milvus가 LF AI &amp; Data Foundation의 졸업 프로젝트가 되었습니다.</a></strong></p></li>
<li><p><strong><a href="https://www.cs.purdue.edu/homes/csjgwang/pubs/SIGMOD21_Milvus.pdf">Milvus: 특수 목적의 벡터 데이터 관리 시스템, SIGMOD'2021에 발표</a>).</strong></p></li>
<li><p><strong><a href="https://discuss.milvus.io/">Milvus 커뮤니티 포럼 출범.</a></strong></p></li>
</ol>
<h2 id="Community-Events" class="common-anchor-header">커뮤니티 이벤트<button data-href="#Community-Events" class="anchor-icon" translate="no">
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
    </button></h2><p>올해에는 코로나19 상황에도 불구하고 전 세계 커뮤니티 구성원들이 (대부분 온라인으로) 만날 수 있도록 다양한 행사를 주최하고 참여했습니다. 총 21개의 컨퍼런스에 참석하고 주최했습니다:</p>
<ul>
<li>6회의 기술 회의</li>
<li>7회의 밀버스 오피스 아워</li>
<li>웨비나 34회</li>
<li>오프라인 밋업 3회</li>
</ul>
<p>2022년에는 더 많은 행사를 계획하고 있습니다. 가까운 이벤트에 참여하고 싶으시다면 커뮤니티 포럼의 <a href="https://discuss.milvus.io/c/events-and-meetups/13">이벤트 및 밋업</a> 카테고리에서 예정된 이벤트와 장소를 확인하시기 바랍니다. 향후 이벤트의 연사 또는 호스트가 되고 싶으시다면 <a href="mailto:community@milvus.io">community@milvus.io</a> 으로 문의해 주세요.</p>
<h2 id="Looking-Ahead-to-2022--Roadmap--Announcement" class="common-anchor-header">2022년 전망 - 로드맵 및 공지사항<button data-href="#Looking-Ahead-to-2022--Roadmap--Announcement" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>커뮤니티:</strong></p>
<ol>
<li>Milvus 프로젝트 멤버십을 개선하여 더 많은 관리자와 커미터를 유치/선출하여 커뮤니티를 함께 구축합니다.</li>
<li>멘토링 프로그램을 시작하여 커뮤니티에 합류하고 기여하고자 하는 신규 사용자에게 더 많은 도움을 제공합니다.</li>
<li><strong>기술 문서, 사용자 가이드, 커뮤니티 문서</strong> 등 커뮤니티 문서 거버넌스를 개선합니다. 2022년에는 커뮤니티 구성원들이 함께 Milvus 핸드북을 완성하여 사람들이 Milvus 사용법을 더 잘 배울 수 있기를 바랍니다.</li>
<li>업스트림 AI 커뮤니티와 Milvus가 의존하고 있는 Kubernetes, MinIO 등d 및 Pulsar와 같은 커뮤니티를 포함한 다른 오픈 소스 커뮤니티와의 협력 및 상호 작용을 강화합니다.</li>
<li>더 많은 정기적인 SIG 회의를 통해 커뮤니티 주도성을 강화하세요. 현재 운영 중인 sig-pymilvus 외에도 2022년에는 더 많은 SIG를 만들 계획입니다.</li>
</ol>
<p><strong>밀버스 프로젝트:</strong></p>
<ol>
<li>성능 튜닝</li>
</ol>
<p>뛰어난 성능은 항상 사용자들이 Milvus를 선택하는 중요한 이유였습니다. 2022년에는 성능 최적화 프로젝트를 시작하여 처리량과 지연 시간을 최소 2배 이상 향상시킬 계획입니다. 또한 작은 데이터 세트에서 처리량과 시스템 안정성을 개선하기 위해 메모리 복제본을 도입하고, 인덱스 구축과 온라인 서비스를 가속화하기 위해 GPU를 지원할 계획입니다.</p>
<ol start="2">
<li>기능</li>
</ol>
<p>Milvus 2.0은 이미 벡터/스칼라 하이브리드 검색, 엔티티 삭제, 시간 여행과 같은 기능을 지원하고 있습니다. 다음 두 가지 주요 릴리스에서는 다음과 같은 기능을 지원할 계획입니다:</p>
<ul>
<li>더 풍부한 데이터 유형 지원: 문자열, 블롭, 지리공간 등 더 풍부한 데이터 유형 지원</li>
<li>역할 기반 액세스 제어</li>
<li>기본 키 중복 제거</li>
<li>벡터에서 범위 검색 지원(거리가 0.8 미만인 경우 검색)</li>
<li>Restful API 지원 및 기타 언어 SDK</li>
</ul>
<ol start="3">
<li>사용 편의성</li>
</ol>
<p>내년에는 Milvus를 더 잘 배포하고 관리할 수 있는 몇 가지 도구를 개발할 계획입니다.</p>
<ul>
<li><p>Milvus 업:  사용자가 K8 클러스터 없이 오프라인 환경에서 Milvus를 실행할 수 있도록 도와주는 배포 구성 요소입니다. 또한 모니터링, 추적 및 기타 Milvus 개발을 배포하는 데 도움이 됩니다.</p></li>
<li><p>Attu - 클러스터 관리 시스템으로서 Attu를 계속 개선해 나갈 것입니다. 상태 진단 및 인덱스 최적화와 같은 기능을 추가할 계획입니다.</p></li>
<li><p>Milvus DM: 다른 데이터베이스나 파일에서 Milvus로 벡터를 마이그레이션하기 위한 데이터 마이그레이션 도구입니다. 우선 FAISS, HNSW, Milvus 1.0/2.0을 지원한 후 MySQL, Elasticsearch 등 다른 데이터베이스를 지원할 예정입니다.</p></li>
</ul>
<h2 id="About-the-author" class="common-anchor-header">저자 소개<button data-href="#About-the-author" class="anchor-icon" translate="no">
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
    </button></h2><p>샤오판 루안, Zilliz의 파트너 겸 엔지니어링 디렉터이자 LF AI &amp; Data Foundation의 기술 자문 위원. 오라클 미국 본사와 소프트웨어 정의 스토리지 스타트업인 Hedvig에서 연이어 근무했습니다. 알리바바 클라우드 데이터베이스 팀에 합류하여 NoSQL 데이터베이스 HBase와 Lindorm의 개발을 담당했습니다. 코넬대학교에서 전자 컴퓨터 공학 석사 학위를 취득했습니다.</p>
