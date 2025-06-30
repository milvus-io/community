---
id: journey-to-35k-github-stars-story-of-building-milvus-from-scratch.md
title: '35,000개 이상의 깃허브 스타를 향한 여정: 처음부터 Milvus를 구축한 실제 이야기'
author: Zilliz
date: 2025-06-27T00:00:00.000Z
cover: assets.zilliz.com/Github_star_30_K_2_f329467096.png
tag: Announcements
recommend: true
publishToMedium: true
tags: 'Milvus, vector database, vector search, AI Agents, LLM'
meta_keywords: 'Milvus, vector database, vector search, AI search, Zilliz Cloud'
meta_title: |
  Our Journey to 35K+ GitHub Stars: Building Milvus from Scratch
desc: >-
  GitHub에서 35.5만 개의 별을 받은 벡터 데이터베이스 Milvus를 축하하는 자리에 함께하세요. Milvus의 스토리와 개발자가 더
  쉽게 AI 솔루션을 개발할 수 있는 방법을 알아보세요.
origin: >-
  https://milvus.io/blog/journey-to-35k-github-stars-story-of-building-milvus-from-scratch.md
---
<p>지난 몇 년 동안 저희는 AI 시대를 위한 기업용 벡터 데이터베이스 구축이라는 한 가지에 집중해 왔습니다. 어려운 부분은 데이터베이스를 <em>구축하는</em> 것이 아니라 확장 가능하고 사용하기 쉬우며 실제로 프로덕션의 실제 문제를 해결할 수 있는 데이터베이스를 구축하는 것입니다.</p>
<p>올해 6월, 저희는 새로운 이정표를 달성했습니다: Milvus는 <a href="https://github.com/milvus-io/milvus">GitHub에서 35,000개의 별</a> 을 달성했습니다(현재 35.5만 개 이상의 별을 보유하고 있습니다). 단순히 숫자에 불과한 것이 아니라 저희에게 큰 의미가 있습니다.</p>
<p>각 별은 시간을 내서 저희가 만든 것을 살펴보고 북마크에 추가할 만큼 유용하다고 생각하여 사용하기로 결정한 개발자를 나타냅니다. 여러분 중 일부는 문제를 제기하고, 코드를 기여하고, 포럼에서 질문에 답하고, 다른 개발자가 막혔을 때 도움을 주는 등 더 나아가 도움을 주셨습니다.</p>
<p>저희는 잠시 시간을 내어 지저분한 부분까지 모두 포함한 실제 이야기를 나누고 싶었습니다.</p>
<h2 id="We-Started-Building-Milvus-Because-Nothing-Else-Worked" class="common-anchor-header">다른 방법이 없었기 때문에 Milvus를 만들기 시작했습니다.<button data-href="#We-Started-Building-Milvus-Because-Nothing-Else-Worked" class="anchor-icon" translate="no">
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
    </button></h2><p>2017년, 저희는 단순한 질문에서 시작했습니다: AI 애플리케이션이 등장하기 시작하고 비정형 데이터가 폭증하는 상황에서 의미 이해를 돕는 벡터 임베딩을 어떻게 하면 효율적으로 저장하고 검색할 수 있을까요?</p>
<p>기존 데이터베이스는 이를 위해 구축되지 않았습니다. 고차원 벡터가 아닌 행과 열에 최적화되어 있었기 때문입니다. 기존의 기술과 도구는 우리가 필요로 하는 것을 구현하는 것이 불가능하거나 고통스러울 정도로 느렸습니다.</p>
<p>우리는 사용 가능한 모든 것을 시도했습니다. Elasticsearch와 함께 솔루션을 조합했습니다. MySQL 위에 사용자 정의 인덱스를 구축했습니다. 심지어 FAISS를 실험해보기도 했지만, 이는 프로덕션 데이터베이스 인프라가 아닌 연구용 라이브러리로 설계된 것이었습니다. 엔터프라이즈 AI 워크로드에 대해 우리가 구상했던 완벽한 솔루션을 제공하는 것은 없었습니다.</p>
<p><strong>그래서 저희는 직접 구축하기 시작했습니다.</strong> 데이터베이스는 제대로 구축하기 어렵기로 악명이 높기 때문에 쉽다고 생각했기 때문이 아니라, AI가 어디로 향하고 있는지 알 수 있었고 거기에 도달하기 위해서는 특별히 구축된 인프라가 필요하다는 것을 알았기 때문입니다.</p>
<p>2018년이 되자 저희는 <a href="https://milvus.io/">Milvus를</a> 개발하는 데 깊이 빠져들었습니다. 당시에는 '<strong>벡터 데이터베이스</strong>'라는 용어조차 존재하지 않았습니다. 우리는 본질적으로 새로운 범주의 인프라 소프트웨어를 만들고 있었고, 이는 흥미롭기도 하고 두려운 일이기도 했습니다.</p>
<h2 id="Open-Sourcing-Milvus-Building-in-Public" class="common-anchor-header">Milvus의 오픈 소스화: 공개적으로 구축하기<button data-href="#Open-Sourcing-Milvus-Building-in-Public" class="anchor-icon" translate="no">
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
    </button></h2><p>2019년 11월, 저희는 Milvus 버전 0.10을 오픈소스화하기로 결정했습니다.</p>
<p>오픈소싱은 모든 결함을 전 세계에 노출하는 것을 의미합니다. 모든 해킹, 모든 할 일 코멘트, 완전히 확신할 수 없는 디자인 결정까지. 하지만 벡터 데이터베이스가 AI의 핵심 인프라가 되려면 모든 사람이 액세스할 수 있도록 공개해야 한다고 믿었습니다.</p>
<p>반응은 압도적이었습니다. 개발자들은 Milvus를 사용하는 데 그치지 않고 이를 개선했습니다. 개발자들은 우리가 놓친 버그를 발견하고, 우리가 고려하지 않았던 기능을 제안하고, 디자인 선택에 대해 더 깊이 생각하게 만드는 질문을 던졌습니다.</p>
<p>2020년에는 <a href="https://lfaidata.foundation/">LF AI &amp; 데이터 재단에</a> 가입했습니다. 이는 단순히 신뢰성을 위한 것이 아니라 지속 가능한 오픈소스 프로젝트를 유지하는 방법을 가르쳐주었습니다. 거버넌스, 이전 버전과의 호환성, 몇 달이 아닌 몇 년 동안 지속되는 소프트웨어를 구축하는 방법을 배웠습니다.</p>
<p>2021년에 Milvus 1.0을 출시하고 <a href="https://lfaidata.foundation/projects/milvus/">LF AI &amp; Data Foundation을 졸업했습니다</a>. 같은 해, 10억 개 규모의 벡터 검색을 위한 <a href="https://big-ann-benchmarks.com/neurips21.html">BigANN 글로벌 챌린지에서</a> 우승했습니다. 그 우승은 기분이 좋았지만 더 중요한 것은 우리가 실제 문제를 올바른 방식으로 해결하고 있다는 것을 입증했다는 점입니다.</p>
<h2 id="The-Hardest-Decision-Starting-Over" class="common-anchor-header">가장 어려운 결정: 다시 시작하기<button data-href="#The-Hardest-Decision-Starting-Over" class="anchor-icon" translate="no">
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
    </button></h2><p>여기서부터 상황이 복잡해집니다. 2021년까지 Milvus 1.0은 많은 사용 사례에서 잘 작동했지만 기업 고객들은 더 나은 클라우드 네이티브 아키텍처, 더 쉬운 수평적 확장, 운영 간소화 등 동일한 요구 사항을 계속 요구했습니다.</p>
<p>저희에게는 선택의 여지가 있었습니다. 패치를 적용하거나 처음부터 다시 구축해야 했습니다. 저희는 재구축을 선택했습니다.</p>
<p>Milvus 2.0은 본질적으로 완전히 다시 작성되었습니다. 동적 확장성을 갖춘 완전히 분리된 스토리지-컴퓨팅 아키텍처를 도입했습니다. 2년이 걸렸고 솔직히 회사 역사상 가장 스트레스가 많았던 시기 중 하나였습니다. 수천 명이 사용하던 업무용 시스템을 버리고 검증되지 않은 무언가를 구축해야 했으니까요.</p>
<p><strong>하지만 2022년에 Milvus 2.0을 출시하면서 Milvus는 강력한 벡터 데이터베이스에서 엔터프라이즈 워크로드에 맞게 확장할 수 있는 프로덕션 지원 인프라로 탈바꿈했습니다.</strong> 같은 해, 저희는 자금 소진이 <a href="https://zilliz.com/news/vector-database-company-zilliz-series-b-extension">아닌</a>제품 품질과 글로벌 고객 지원을 두 배로 강화하기 위해 <a href="https://zilliz.com/news/vector-database-company-zilliz-series-b-extension">시리즈 B+ 펀딩 라운드도</a>완료했습니다. 시간이 걸리겠지만 모든 단계가 탄탄한 토대 위에 구축되어야 한다는 것을 알고 있었습니다.</p>
<h2 id="When-Everything-Accelerated-with-AI" class="common-anchor-header">AI로 모든 것이 가속화되는 시기<button data-href="#When-Everything-Accelerated-with-AI" class="anchor-icon" translate="no">
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
    </button></h2><p>2023년은 <a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">RAG</a> (검색 증강 세대)의 해였습니다. 갑자기 시맨틱 검색은 흥미로운 AI 기술에서 챗봇, 문서 Q&amp;A 시스템, AI 에이전트를 위한 필수 인프라가 되었습니다.</p>
<p>Milvus의 깃허브 스타가 급증했습니다. 지원 요청도 배가되었습니다. 벡터 데이터베이스에 대해 들어본 적도 없는 개발자들이 갑자기 인덱싱 전략과 쿼리 최적화에 대한 정교한 질문을 쏟아냈습니다.</p>
<p>이러한 성장은 흥미롭기도 했지만 부담스럽기도 했습니다. 저희는 기술뿐만 아니라 커뮤니티 지원에 대한 전체 접근 방식을 확장해야 한다는 것을 깨달았습니다. 더 많은 개발자 지원자를 고용하고, 문서를 완전히 다시 작성했으며, 벡터 데이터베이스를 처음 접하는 개발자를 위한 교육 콘텐츠를 만들기 시작했습니다.</p>
<p>또한 Milvus의 완전 관리형 <a href="https://zilliz.com/cloud">버전인 Zilliz Cloud를</a>출시했습니다. 오픈소스 프로젝트를 왜 '상업화'하느냐고 묻는 분들도 있었습니다. 정직한 대답은 엔터프라이즈급 인프라를 유지 관리하는 것은 비용이 많이 들고 복잡하기 때문입니다. Zilliz Cloud를 사용하면 핵심 프로젝트를 완전히 오픈소스로 유지하면서 Milvus 개발을 지속하고 가속화할 수 있습니다.</p>
<p>그리고 2024년이 왔습니다. <a href="https://zilliz.com/blog/zilliz-named-a-leader-in-the-forrester-wave-vector-database-report"><strong>포레스터는 우리를</strong></a> <strong>벡터 데이터베이스 부문의</strong> <a href="https://zilliz.com/blog/zilliz-named-a-leader-in-the-forrester-wave-vector-database-report"><strong>리더로 선정했습니다</strong></a> <strong>.</strong> Milvus는 깃허브 별 30,000개를 돌파했습니다. <strong>그리고 우리는 7년 동안 닦아온 길이 마침내 고속도로가 되었다는 사실을 깨달았습니다.</strong> 더 많은 기업이 벡터 데이터베이스를 핵심 인프라로 채택함에 따라 비즈니스 성장 속도가 빨라졌고, 우리가 구축한 기반이 기술적으로나 상업적으로나 확장할 수 있다는 것을 입증했습니다.</p>
<h2 id="The-Team-Behind-Milvus-Zilliz" class="common-anchor-header">Milvus를 만든 팀: Zilliz<button data-href="#The-Team-Behind-Milvus-Zilliz" class="anchor-icon" translate="no">
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
    </button></h2><p>흥미로운 점은 많은 사람들이 Milvus는 알지만 Zilliz는 모른다는 것입니다. 사실 저희는 괜찮습니다. <strong>밀버스를 구축하고, 유지 관리하고, 지원하는 팀은 바로</strong> <a href="https://zilliz.com/"><strong>Zilliz입니다</strong></a> <strong>.</strong></p>
<p>저희가 가장 중요하게 생각하는 것은 성능 최적화, 보안 패치, 초보자에게 실제로 도움이 되는 문서화, GitHub 문제에 대한 신중한 대응 등 멋진 데모와 프로덕션 지원 인프라의 차이를 만드는 화려하지 않은 것들입니다.</p>
<p>미국, 유럽, 아시아 전역에 연중무휴 24시간 글로벌 지원팀을 구축한 이유는 개발자는 우리가 아닌 자신의 시간대에 도움이 필요하기 때문입니다. 이벤트를 조직하고, 포럼 질문에 답변하며, 종종 우리보다 더 잘 개념을 설명해 주는 커뮤니티 기여자 '<a href="https://docs.google.com/forms/d/e/1FAIpQLSfkVTYObayOaND8M1ci9eF_YWvoKDb-xQjLJYZ-LhbCdLAt2Q/viewform">Milvus 앰배서더</a>'가 있습니다.</p>
<p>또한 AWS, GCP 및 기타 클라우드 제공업체가 자체적으로 Milvus의 관리형 버전을 제공하는 경우에도 통합을 환영합니다. 더 많은 배포 옵션은 사용자에게 좋습니다. 팀에서 복잡한 기술적 문제에 부딪혔을 때 저희가 시스템을 가장 깊이 이해하고 있기 때문에 저희에게 직접 연락하는 경우가 많다는 사실을 알게 되었습니다.</p>
<p>많은 사람들이 오픈소스를 단순한 '도구 상자'라고 생각하지만, 실제로는 오픈소스를 사랑하고 믿는 수많은 사람들의 집단적 노력으로 이루어진 '진화 과정'입니다. 아키텍처를 진정으로 이해하는 사람만이 버그 수정, 성능 병목 현상 분석, 데이터 시스템 통합 및 아키텍처 조정의 '이유'를 제공할 수 있습니다.</p>
<p><strong>따라서 오픈 소스 Milvus를 사용 중이거나 AI 시스템의 핵심 구성 요소로 벡터 데이터베이스를 고려하고 있다면, 가장 전문적이고 시기적절한 지원을 위해 유니티에 직접 문의하는 것이 좋습니다.</strong></p>
<h2 id="Real-Impact-in-Production-The-Trust-from-Users" class="common-anchor-header">프로덕션에 실질적인 영향: 사용자의 신뢰<button data-href="#Real-Impact-in-Production-The-Trust-from-Users" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus의 사용 사례는 처음에 상상했던 것 이상으로 성장했습니다. 모든 산업 분야에서 전 세계에서 가장 까다로운 기업의 AI 인프라를 지원하고 있습니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/zilliz_customers_e7340d5dd4.png" alt="zilliz customers.png" class="doc-image" id="zilliz-customers.png" />
   </span> <span class="img-wrapper"> <span>질리즈 고객사.png</span> </span></p>
<p>글로벌 자동차 기술 리더이자 자율 주행 분야의 선구자인<a href="https://zilliz.com/customers/bosch"><strong>Bosch는</strong></a> Milvus를 통해 데이터 분석에 혁신을 일으켜 데이터 수집 비용을 80% 절감하고 연간 140만 달러를 절감하는 동시에 수십억 개의 주행 시나리오를 밀리초 단위로 검색하여 중요한 엣지 사례를 찾아냈습니다.</p>
<p>수백만 명의 월간 활성 사용자에게 서비스를 제공하며 가장 빠르게 성장하고 있는 생산성 AI 회사 중 하나인<a href="https://zilliz.com/customers/read-ai"><strong>Read AI는</strong></a> Milvus를 사용하여 수십억 개의 레코드에서 검색 지연 시간을 20~50ms 미만으로 줄이고 에이전트 검색 속도를 5배 향상시켰습니다. "Milvus는 중앙 저장소 역할을 하며 수십억 개의 레코드에서 정보 검색을 강화합니다."라고 CTO는 말합니다.</p>
<p>200개 이상의 국가와 25개 이상의 통화로 수백억 건의 거래를 처리하는 세계 최대의 디지털 결제 플랫폼 중 하나인<a href="https://zilliz.com/customers/global-fintech-leader"><strong>글로벌 핀테크 리더는</strong></a> 경쟁사보다 5~10배 빠른 일괄 수집을 위해 Milvus를 선택했으며, 다른 업체에서는 8시간 이상 걸리는 작업을 1시간 이내에 완료했습니다.</p>
<p>미국 전역의 수천 개의 로펌이 신뢰하는 선도적인 법률 업무 플랫폼인<a href="https://zilliz.com/customers/filevine"><strong>Filevine은</strong></a> 수백만 개의 법률 문서에서 30억 개의 벡터를 관리하여 변호사들이 문서 분석 시간을 60~80% 절약하고 법률 사건 관리를 위한 '진정한 데이터 의식'을 실현하고 있습니다.</p>
<p>그 외에도 <strong>NVIDIA, OpenAI, Microsoft, Salesforce, Walmart</strong> 등 거의 모든 산업 분야의 기업들을 지원하고 있습니다. 10,000개 이상의 조직이 Milvus 또는 Zilliz Cloud를 벡터 데이터베이스로 선택했습니다.</p>
<p>이는 단순한 기술적 성공 사례가 아니라, 벡터 데이터베이스가 사람들이 매일 사용하는 AI 애플리케이션을 구동하는 핵심 인프라로 조용히 자리잡고 있음을 보여주는 사례입니다.</p>
<h2 id="Why-We-Built-Zilliz-Cloud-Enterprise-Grade-Vector-Database-as-a-Service" class="common-anchor-header">질리즈 클라우드를 구축한 이유 엔터프라이즈급 서비스형 벡터 데이터베이스<button data-href="#Why-We-Built-Zilliz-Cloud-Enterprise-Grade-Vector-Database-as-a-Service" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus는 오픈 소스이며 무료로 사용할 수 있습니다. 하지만 엔터프라이즈 규모로 Milvus를 제대로 운영하려면 심도 있는 전문 지식과 상당한 리소스가 필요합니다. 인덱스 선택, 메모리 관리, 확장 전략, 보안 구성 등은 결코 사소한 결정이 아닙니다. 많은 팀들이 운영의 복잡성 없이 엔터프라이즈 지원, SLA 보장 등을 통해 Milvus의 강력한 기능을 사용하기를 원합니다.</p>
<p>그래서 저희는 성능, 보안, 안정성이 요구되는 엔터프라이즈급 AI 워크로드를 위해 특별히 설계되어 전 세계 25개 지역과 AWS, GCP, Azure 등 5개의 주요 클라우드에 배포되는 Milvus의 완전 관리형 <a href="https://zilliz.com/cloud">버전인 Zilliz Cloud를</a>구축했습니다.</p>
<p>Zilliz Cloud의 차별점은 다음과 같습니다:</p>
<ul>
<li><p><strong>고성능을 갖춘 대규모 확장성:</strong> 독점적인 AI 기반 자동 인덱스 엔진은 인덱스 튜닝이 전혀 필요 없는 오픈 소스 Milvus보다 3~5배 빠른 쿼리 속도를 제공합니다. 클라우드 네이티브 아키텍처는 수십억 개의 벡터와 수만 개의 동시 쿼리를 지원하면서도 1초 미만의 응답 시간을 유지합니다.</p></li>
<li><p><a href="https://zilliz.com/trust-center"><strong>기본 제공 보안 및 규정 준수</strong></a><strong>:</strong> 미사용 및 전송 중 암호화, 세분화된 RBAC, 포괄적인 감사 로깅, SAML/OAuth2.0 통합, <a href="https://zilliz.com/bring-your-own-cloud">BYOC</a> (Bring Your Own Cloud) 배포를 지원합니다. GDPR, HIPAA 및 기타 기업에서 실제로 필요로 하는 글로벌 표준을 준수합니다.</p></li>
<li><p><strong>비용 효율성에 최적화:</strong> 계층화된 핫/콜드 데이터 스토리지, 실제 워크로드에 대응하는 탄력적인 확장, 종량제 요금제를 통해 자체 관리형 배포에 비해 총 소유 비용을 50% 이상 절감할 수 있습니다.</p></li>
<li><p><strong>공급업체 종속 없이 진정한 클라우드 독립성:</strong> 공급업체에 종속되지 않고 AWS, Azure, GCP, 알리바바 클라우드 또는 텐센트 클라우드에 배포할 수 있습니다. 어디에서 실행하든 글로벌 일관성과 확장성을 보장합니다.</p></li>
</ul>
<p>이러한 기능은 화려하게 들리지는 않지만, 엔터프라이즈 팀이 대규모로 AI 애플리케이션을 구축할 때 직면하는 실제적인 일상적인 문제를 해결합니다. 그리고 가장 중요한 것은 내부적으로는 여전히 Milvus이므로 독점적인 종속성이나 호환성 문제가 없다는 점입니다.</p>
<h2 id="Whats-Next-Vector-Data-Lake" class="common-anchor-header">다음 단계 벡터 데이터 레이크<button data-href="#Whats-Next-Vector-Data-Lake" class="anchor-icon" translate="no">
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
    </button></h2><p>저희는 '<a href="https://zilliz.com/learn/what-is-vector-database">벡터 데이터베이스</a>'라는 용어를 만들어내고 최초로 이를 구축했지만, 여기서 멈추지 않고 있습니다. 이제 다음 단계의 진화를 준비하고 있습니다: <strong>바로 벡터 데이터 레이크입니다.</strong></p>
<p><strong>우리가 해결하고자 하는 문제는 다음과 같습니다. 모든 벡터 검색에 밀리초 단위의 지연 시간이 필요한 것은 아닙니다.</strong> 많은 기업들은 과거 문서 분석, 일괄 유사도 계산, 장기 추세 분석 등 가끔씩 쿼리되는 대규모 데이터 세트를 보유하고 있습니다. 이러한 사용 사례의 경우, 기존의 실시간 벡터 데이터베이스는 과부하가 걸리고 비용이 많이 듭니다.</p>
<p>Vector Data Lake는 자주 액세스하지 않는 대규모 벡터에 특별히 최적화된 스토리지-컴퓨팅 분리 아키텍처를 사용하면서도 실시간 시스템보다 훨씬 낮은 비용을 유지합니다.</p>
<p><strong>핵심 기능은 다음과 같습니다:</strong></p>
<ul>
<li><p><strong>통합 데이터 스택:</strong> 일관된 형식과 효율적인 스토리지로 온라인과 오프라인 데이터 레이어를 원활하게 연결하여 포맷을 다시 지정하거나 복잡한 마이그레이션 없이 핫 티어와 콜드 티어 간에 데이터를 이동할 수 있습니다.</p></li>
<li><p><strong>호환 가능한 컴퓨팅 에코시스템:</strong> 기본적으로 Spark 및 Ray와 같은 프레임워크와 함께 작동하며, 벡터 검색부터 기존 ETL 및 분석에 이르기까지 모든 것을 지원합니다. 즉, 기존 데이터 팀은 이미 알고 있는 도구를 사용해 벡터 데이터로 작업할 수 있습니다.</p></li>
<li><p><strong>비용 최적화된 아키텍처:</strong> 핫 데이터는 빠른 액세스를 위해 SSD 또는 NVMe에 보관하고, 콜드 데이터는 자동으로 S3와 같은 오브젝트 스토리지로 이동합니다. 스마트 인덱싱 및 스토리지 전략은 필요할 때 빠른 I/O를 유지하면서 스토리지 비용을 예측 가능하고 저렴하게 만들어줍니다.</p></li>
</ul>
<p>이는 벡터 데이터베이스를 대체하는 것이 아니라 기업에게 각 워크로드에 적합한 도구를 제공하는 것입니다. 사용자 대면 애플리케이션에 대한 실시간 검색, 분석 및 기록 처리를 위한 비용 효율적인 벡터 데이터 레이크.</p>
<p>무어의 법칙과 제본스의 역설은 컴퓨팅의 단가가 낮아질수록 도입이 확대된다는 논리를 뒷받침합니다. 이는 벡터 인프라에도 동일하게 적용됩니다.</p>
<p>매일매일 인덱스, 스토리지 구조, 캐싱, 배포 모델을 개선함으로써 누구나 더 쉽게 접근하고 저렴하게 AI 인프라를 이용할 수 있도록 하고, 비정형 데이터를 AI 네이티브의 미래로 가져오는 데 도움이 되기를 바랍니다.</p>
<h2 id="A-Big-Thanks-to-You-All" class="common-anchor-header">여러분 모두에게 큰 감사를 드립니다!<button data-href="#A-Big-Thanks-to-You-All" class="anchor-icon" translate="no">
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
    </button></h2><p>35,000개 이상의 별은 Milvus를 추천하고 기여할 만큼 유용하다고 생각하는 개발자 커뮤니티가 있다는 것을 의미합니다.</p>
<p>하지만 아직 끝나지 않았습니다. Milvus에는 수정해야 할 버그, 개선해야 할 성능, 커뮤니티에서 요청해 온 기능이 있습니다. 로드맵은 공개되어 있으며, 우선순위에 대한 여러분의 의견을 진심으로 기다리고 있습니다.</p>
<p>중요한 것은 숫자 자체가 아니라 별이 상징하는 신뢰입니다. 앞으로도 계속 공개하고, 피드백에 귀 기울이며, 더 나은 Milvus를 만들어 나갈 것이라는 믿음을 가져주세요.</p>
<ul>
<li><p><strong>기여자 여러분:</strong> 여러분의 홍보, 버그 보고, 문서 개선으로 Milvus는 매일 더 나아지고 있습니다. 정말 감사합니다.</p></li>
<li><p><strong>사용자</strong> 여러분<strong>:</strong> 프로덕션 워크로드를 믿고 맡겨 주시고 피드백을 보내주셔서 감사합니다.</p></li>
<li><p><strong>커뮤니티 여러분:</strong> 질문에 답변하고, 이벤트를 조직하고, 신규 사용자의 시작을 도와주셔서 감사합니다.</p></li>
</ul>
<p>벡터 데이터베이스를 처음 사용하시는 분들을 위해 저희가 도와드리겠습니다. 이미 Milvus 또는 Zilliz Cloud를 사용 중이시라면, <a href="https://zilliz.com/share-your-story">여러분의 경험에 대해 듣고</a> 싶습니다. 그리고 우리가 무엇을 구축하고 있는지 궁금하다면 커뮤니티 채널이 항상 열려 있습니다.</p>
<p>AI 애플리케이션을 가능하게 하는 인프라를 함께 구축해 나갑시다.</p>
<hr>
<p>여기를 찾아주세요: <a href="https://github.com/milvus-io/milvus">Milvus on GitHub</a> |<a href="https://zilliz.com/"> Zilliz Cloud</a> |<a href="https://discuss.milvus.io/"> Discord</a> | <a href="https://www.linkedin.com/company/the-milvus-project/">LinkedIn</a> | <a href="https://x.com/zilliz_universe">X</a> | <a href="https://www.youtube.com/@MilvusVectorDatabase/featured">YouTube</a></p>
<p><a href="https://meetings.hubspot.com/chloe-williams1/milvus-office-hour?__hstc=175614333.dc4bcf53f6c7d650ea8978dcdb9e7009.1727350436713.1751017913702.1751029841530.667&amp;__hssc=175614333.3.1751029841530&amp;__hsfp=3554976067">
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/office_hour_4fb9130a9b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</a></p>
