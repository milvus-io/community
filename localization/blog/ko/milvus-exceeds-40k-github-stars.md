---
id: milvus-exceeds-40k-github-stars.md
title: '7년, 두 번의 대대적인 리빌드, 4만 개 이상의 깃허브 스타: 선도적인 오픈 소스 벡터 데이터베이스로 부상한 Milvus'
author: Fendy Feng
date: 2025-12-02T00:00:00.000Z
cover: assets.zilliz.com/star_history_3dfceda40f.png
tag: announcements
recommend: true
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus, vector database'
meta_title: >
  7 Years, 2 Major Rebuilds, 40K+ GitHub Stars: The Rise of Milvus as the
  Leading Open-Source Vector Database
desc: 세계 최고의 오픈 소스 벡터 데이터베이스가 되기 위한 Milvus의 7년간의 여정을 기념하며
origin: 'https://milvus.io/blog/milvus-exceeds-40k-github-stars.md'
---
<p>2025년 6월, Milvus는 35,000개의 GitHub 스타를 달성했습니다. 불과 몇 달 만에 <a href="https://github.com/milvus-io/milvus">40,000개를 넘어섰으니</a>, 그 추진력뿐만 아니라 벡터 및 멀티모달 검색의 미래를 계속 발전시키는 글로벌 커뮤니티가 있다는 <a href="https://github.com/milvus-io/milvus">증거이기도</a>합니다.</p>
<p>깊은 감사를 드립니다. 별표, 포크, 이슈 제기, API에 대한 논쟁, 벤치마크 공유, Milvus와 함께 놀라운 무언가를 만들어주신 모든 분들께 <strong>감사드립니다. 여러분 덕분에 이 프로젝트가 지금처럼 빠르게 발전할 수</strong> 있었습니다. 모든 별은 단순히 버튼을 누른 것 이상의 의미를 지니며, 자신의 작업을 지원하기 위해 Milvus를 선택한 사람, 우리가 만들고 있는 것을 믿는 사람, 개방적이고 접근 가능한 고성능 AI 인프라에 대한 비전을 공유하는 사람을 의미합니다.</p>
<p>따라서 우리는 이를 축하하는 동시에 여러분이 요청하는 기능, 현재 AI가 요구하는 아키텍처, 그리고 모든 애플리케이션에서 멀티모달 시맨틱 이해가 기본이 되는 세상을 향해 나아가고 있습니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/star_history_3dfceda40f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="The-Journey-From-Zero-to-40000+-Stars" class="common-anchor-header">여정: 0에서 40,000개 이상의 별이 되기까지<button data-href="#The-Journey-From-Zero-to-40000+-Stars" class="anchor-icon" translate="no">
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
    </button></h2><p>2017년에 Milvus를 구축하기 시작했을 때는 <em>벡터 데이터베이스라는</em> 용어조차 존재하지 않았습니다. 저희는 소규모 엔지니어들로 구성된 팀이었을 뿐이며, 곧 AI 애플리케이션에 행과 열이 아닌 고차원의 비정형 멀티모달 데이터를 위해 구축된 새로운 종류의 데이터 인프라가 필요할 것이라고 확신했습니다. 기존의 데이터베이스는 이러한 세상을 위해 구축되지 않았고, 누군가는 저장과 검색의 모습을 다시 상상해야 한다는 것을 알고 있었습니다.</p>
<p>초창기는 그리 순탄치 않았습니다. 엔터프라이즈급 인프라 구축은 코드 경로를 프로파일링하고, 구성 요소를 다시 작성하고, 새벽 2시에 설계 선택에 의문을 제기하는 등 느리고 고집스러운 작업이었지만, 저희는 <strong>AI 애플리케이션을 구축하는 모든 개발자가 벡터 검색에 접근 가능하고 확장 가능하며 신뢰할 수 있도록</strong> 한다는 단순한 사명을 붙잡고 있었습니다. 그 사명 덕분에 첫 번째 돌파구를 마련하고 피할 수 없는 좌절을 극복할 수 있었습니다.</p>
<p>그리고 그 과정에서 몇 가지 전환점이 모든 것을 바꾸어 놓았습니다:</p>
<ul>
<li><p><strong>2019년:</strong> Milvus 0.10을 오픈소스화했습니다. 이는 해킹, 할 일, 아직 자랑스럽지 않은 부분 등 우리의 모든 거친 부분을 노출하는 것을 의미했습니다. 하지만 커뮤니티가 나타났어요. 개발자들은 우리가 미처 발견하지 못했던 문제를 제기하고, 상상하지 못했던 기능을 제안하고, 가설에 이의를 제기하여 궁극적으로 Milvus를 더욱 강력하게 만들었습니다.</p></li>
<li><p><strong>2020-2021:</strong> <a href="https://lfaidata.foundation/projects/milvus/">LF AI &amp; Data Foundation에</a> 가입하고, Milvus 1.0을 출시하고, LF AI &amp; Data를 졸업하고, 10억 <a href="https://big-ann-benchmarks.com/neurips21.html">개</a> 규모의 벡터 검색 챌린지에서 우승하며, 우리 아키텍처가 실제 규모를 처리할 수 있다는 것을 조기에 증명했습니다.</p></li>
<li><p><strong>2022년:</strong> 엔터프라이즈 사용자들은 Kubernetes의 기본 확장성, 탄력성, 스토리지와 컴퓨팅의 실질적인 분리를 필요로 했습니다. 우리는 기존 시스템을 패치하느냐 아니면 모든 것을 다시 구축하느냐 하는 어려운 결정에 직면했습니다. 저희는 어려운 길을 선택했습니다. Milvus <strong>2.0은</strong> 완전히 분리된 클라우드 네이티브 아키텍처를 도입하여 Milvus를 미션 크리티컬 AI 워크로드를 위한 프로덕션급 플랫폼으로 탈바꿈시킨 완전히 <strong>새로운 혁신이었습니다</strong>.</p></li>
<li><p><strong>2024-2025:</strong> <a href="https://zilliz.com/">Zilliz</a> (Milvus 개발팀)는 <a href="https://zilliz.com/resources/analyst-report/zilliz-forrester-wave-vector-database-report">Forrester에서 리더로</a> 선정되었고, 별점 3만 개를 넘어 4만 개를 넘어섰습니다. 교육, 금융, 창작물 제작, 과학 연구 등 다양한 산업 분야에서 멀티모달 검색, RAG 시스템, 에이전트 워크플로, 수십억 건 규모의 검색을 위한 중추적인 역할을 담당하게 되었습니다.</p></li>
</ul>
<p>이 이정표는 과대 광고가 아니라 개발자들이 실제 프로덕션 워크로드를 위해 Milvus를 선택하고 모든 단계를 개선하기 위해 노력한 덕분에 달성할 수 있었습니다.</p>
<h2 id="2025-Two-Major-Releases-Massive-Performance-Gains" class="common-anchor-header">2025: 두 개의 주요 릴리스, 대규모 성능 향상<button data-href="#2025-Two-Major-Releases-Massive-Performance-Gains" class="anchor-icon" translate="no">
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
    </button></h2><p>2025년은 Milvus가 새로운 단계로 도약한 해입니다. 벡터 검색은 의미론적 이해에 탁월하지만, <strong>개발자들은 여전히</strong> 제품 ID, 일련 번호, 정확한 구문, 법률 용어 등에 대한 <strong>정확한 키워드 매칭을 필요로</strong> 합니다. 기본 전체 텍스트 검색이 없으면, 팀들은 Elasticsearch/OpenSearch 클러스터를 유지 관리하거나 자체 사용자 정의 솔루션을 함께 사용해야 했기 때문에 운영 오버헤드와 파편화가 두 배로 증가했습니다.</p>
<p><a href="https://milvus.io/blog/introduce-milvus-2-5-full-text-search-powerful-metadata-filtering-and-more.md"><strong>Milvus 2.5가</strong></a> <strong>이를 바꿔놓았습니다</strong>. 전체 텍스트 검색과 벡터 검색을 단일 엔진으로 결합한 <strong>진정한 네이티브 하이브리드 검색을</strong> 도입했습니다. 개발자들은 처음으로 별도의 시스템이나 파이프라인 동기화 없이 어휘 쿼리, 시맨틱 쿼리, 메타데이터 필터를 함께 실행할 수 있게 되었습니다. 또한 메타데이터 필터링, 표현식 구문 분석 및 실행 효율성을 업그레이드하여 실제 프로덕션 부하에서도 하이브리드 쿼리가 자연스럽고 빠르게 느껴지도록 했습니다.</p>
<p><a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md"><strong>Milvus 2.6은</strong></a> <strong>이러한 모멘텀을 더욱 강화하여</strong> 대규모로 실행하는 사용자들로부터 가장 자주 듣는 두 가지 문제, 즉 <strong><em>비용과</em> <em>성능을</em></strong> 목표로 삼았습니다 <strong>.</strong> 이번 릴리즈는 보다 예측 가능한 쿼리 경로, 더 빠른 인덱싱, 획기적으로 낮아진 메모리 사용량, 훨씬 더 효율적인 스토리지 등 아키텍처를 대폭 개선했습니다. 많은 팀에서 애플리케이션 코드를 단 한 줄도 변경하지 않고도 즉각적인 이점을 얻었다고 보고했습니다.</p>
<p>다음은 Milvus 2.6의 몇 가지 주요 특징입니다:</p>
<ul>
<li><p><a href="https://milvus.io/docs/tiered-storage-overview.md"><strong>계층형 스토리지를</strong></a> 통해 팀이 비용과 성능의 균형을 더욱 지능적으로 조정하여 스토리지 비용을 최대 50%까지 절감할 수 있습니다.</p></li>
<li><p><a href="https://milvus.io/blog/bring-vector-compression-to-the-extreme-how-milvus-serves-3%C3%97-more-queries-with-rabitq.md">RaBitQ 1비트 양자화를</a> 통해 메모리 사용량을 최대 72%까지 줄이면서도 쿼리는 더 빠르게 처리할 수 있는<strong>메모리 절약</strong>.</p></li>
<li><p>훨씬 더 빠른 BM25 구현으로<a href="https://milvus.io/docs/full-text-search.md"><strong>재설계된 전체 텍스트 엔진</strong></a> - 벤치마크에서 Elasticsearch보다 최대 4배 더 빠릅니다.</p></li>
<li><p>복잡한 문서에서 최대 100배 빠른 필터링이 가능한 <a href="https://milvus.io/blog/json-shredding-in-milvus-faster-json-filtering-with-flexibility.md">JSON 구조의 메타데이터를</a> 위한<strong>새로운 경로 인덱스</strong>.</p></li>
<li><p><a href="https://milvus.io/docs/aisaq.md"><strong>AiSAQ</strong>:</a> 3200배의 저장 공간 절감과 강력한 리콜을 통한 10억 개 규모의 압축</p></li>
<li><p><strong>R-Tree를 사용한</strong><strong>시맨틱 +</strong> <a href="https://milvus.io/docs/geometry-operators.md"><strong>지리공간 검색</strong></a> <strong>:</strong> <em>사물의 위치와</em> <em>의미를</em> 결합하여 보다 관련성 높은 결과 제공</p></li>
<li><p><a href="https://zilliz.com/blog/Milvus-introduces-GPU-index-CAGRA"><strong>CAGRA+ Vamana</strong></a><strong>:</strong> GPU에서 빌드하지만 쿼리는 CPU에서 수행하는 하이브리드 CAGRA 모드로 배포 비용 절감</p></li>
<li><p>특히 멀티모달 파이프라인의 경우 임베딩 수집 및 검색을 간소화하는<strong>'</strong><a href="https://milvus.io/blog/data-in-and-data-out-in-milvus-2-6.md"><strong>데이터 인, 데이터 아웃</strong></a><strong>' 워크플로우</strong>.</p></li>
<li><p>단일 클러스터에서<strong>최대 10만 개의 컬렉션 지원</strong> - 진정한 대규모 멀티테넌시를 향한 중요한 단계입니다.</p></li>
</ul>
<p>Milvus 2.6에 대해 자세히 알아보려면 <a href="https://milvus.io/docs/release_notes.md">전체 릴리즈 노트를</a> 확인하세요.</p>
<h2 id="Beyond-Milvus-Open-Source-Tools-for-AI-Developers" class="common-anchor-header">Milvus 그 너머: AI 개발자를 위한 오픈 소스 도구<button data-href="#Beyond-Milvus-Open-Source-Tools-for-AI-Developers" class="anchor-icon" translate="no">
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
    </button></h2><p>2025년에는 Milvus를 개선하는 데 그치지 않고 전체 AI 개발자 생태계를 강화하는 도구를 구축했습니다. 우리의 목표는 트렌드를 쫓는 것이 아니라 개발자에게 항상 존재했으면 하는 개방적이고 강력하며 투명한 도구를 제공하는 것이었습니다.</p>
<h3 id="DeepSearcher-Research-Without-Cloud-Lock-In" class="common-anchor-header">딥서처: 클라우드 종속 없는 연구</h3><p>OpenAI의 딥 리서처는 심층 추론 에이전트가 무엇을 할 수 있는지 증명했습니다. 하지만 이 솔루션은 폐쇄적이고 비용이 많이 들며 클라우드 API에 종속되어 있습니다. <a href="https://github.com/zilliztech/deep-searcher"><strong>DeepSearcher가</strong></a> <strong>그 해답입니다.</strong> 제어나 개인 정보를 희생하지 않고 구조화된 조사를 원하는 모든 사용자를 위해 설계된 로컬 오픈 소스 심층 연구 엔진입니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/deepsearcher_5cf6a4f0dc.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>DeepSearcher는 전적으로 사용자의 컴퓨터에서 실행되며, 여러 소스에서 정보를 수집하고, 인사이트를 종합하며, 인용, 추론 단계, 추적성 등 표면적인 요약뿐 아니라 실제 연구에 필수적인 기능을 제공합니다. 블랙박스 없음. 특정 벤더에 종속되지 않습니다. 개발자와 연구자가 신뢰할 수 있는 투명하고 재현 가능한 분석만 제공합니다.</p>
<h3 id="Claude-Context-Coding-Assistants-That-Actually-Understand-Your-Code" class="common-anchor-header">클로드 컨텍스트: 코드를 실제로 이해하는 코딩 어시스턴트</h3><p>대부분의 AI 코딩 도구는 여전히 빠르고, 얕고, 토큰을 태우고, 실제 프로젝트 구조를 파악하지 못하는 멋진 그렙 파이프라인처럼 작동합니다. <a href="https://github.com/zilliztech/claude-context"><strong>클로드 컨텍스트</strong></a> (****)는 이를 바꿔줍니다. MCP 플러그인으로 구축된 이 도구는 코딩 어시스턴트가 놓치고 있던 기능, 즉 코드베이스에 대한 진정한 의미론적 이해를 마침내 제공합니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/claude_context_7f608a153d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Claude Context는 프로젝트 전반에 걸쳐 벡터 기반의 시맨틱 인덱스를 구축하여 에이전트가 올바른 모듈을 찾고, 파일 간의 관계를 추적하고, 아키텍처 수준의 의도를 이해하고, 추측이 아닌 관련성을 바탕으로 질문에 답할 수 있게 해줍니다. 토큰 낭비를 줄이고 정확성을 높이며, 무엇보다도 코딩 어시스턴트가 소프트웨어를 이해하는 척하지 않고 진정으로 이해하는 것처럼 행동할 수 있도록 해줍니다.</p>
<p>두 도구 모두 완전 오픈 소스입니다. AI 인프라는 모든 사람의 것이어야 하며, AI의 미래가 독점적인 벽 뒤에 갇혀서는 안 되기 때문입니다.</p>
<h2 id="Trusted-by-10000+-Teams-in-Production" class="common-anchor-header">10,000개 이상의 프로덕션 팀이 신뢰하는 도구<button data-href="#Trusted-by-10000+-Teams-in-Production" class="anchor-icon" translate="no">
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
    </button></h2><p>현재 빠르게 성장하는 스타트업부터 세계에서 가장 유명한 기술 기업 및 포춘 500대 기업에 이르기까지 10,000개 이상의 엔터프라이즈 팀이 Milvus를 프로덕션 환경에서 운영하고 있습니다. NVIDIA, Salesforce, eBay, Airbnb, IBM, AT&amp;T, LINE, Shopee, Roblox, Bosch, 그리고 Microsoft 내부의 팀들은 매일 매 순간 작동하는 AI 시스템을 구동하기 위해 Milvus를 사용하고 있습니다. 이들 기업의 워크로드는 검색, 추천, 에이전트 파이프라인, 멀티모달 검색, 그리고 벡터 인프라의 한계를 뛰어넘는 기타 애플리케이션에 걸쳐 있습니다.</p>
<p><a href="https://assets.zilliz.com/logos_eb0d3ad4af.png"></a></p>
<p>그러나 가장 중요한 것은 Milvus를 사용하는 <em>사람이 누구</em> 인지가 아니라 Milvus를 <em>통해 무엇을 구축하는지가</em> 중요합니다. Milvus는 산업 전반에 걸쳐 비즈니스 운영, 혁신, 경쟁 방식을 형성하는 시스템 뒤에 자리 잡고 있습니다:</p>
<ul>
<li><p>수십억 개의 임베딩에 즉시 액세스하여 고객 지원, 영업 워크플로, 내부 의사 결정을 개선하는<strong>AI 코파일럿 및 엔터프라이즈 어시스턴트입니다</strong>.</p></li>
<li><p><strong>이커머스, 미디어, 광고 분야의 시맨틱 및 시각적 검색으로</strong> 전환율을 높이고, 검색을 개선하며, 더 빠르게 크리에이티브를 제작할 수 있습니다.</p></li>
<li><p>정확성, 감사 가능성, 규정 준수가 실질적인 운영상의 이득으로 이어지는<strong>법률, 금융, 과학 인텔리전스 플랫폼</strong>.</p></li>
<li><p>빠른 시맨틱 매칭을 통해 실시간으로 손실을 방지하는 핀테크 및 은행 분야의<strong>사기 탐지 및 리스크 엔진</strong>.</p></li>
<li><p><strong>대규모 RAG 및 에이전트 시스템으로</strong> 팀에 심층적인 컨텍스트 및 도메인 인식 AI 동작을 제공합니다.</p></li>
<li><p>텍스트, 코드, 이미지, 메타데이터를 하나의 일관된 시맨틱 패브릭으로 통합하는<strong>엔터프라이즈 지식 레이어</strong>.</p></li>
</ul>
<p>이는 실험실 벤치마크가 아니라 세계에서 가장 까다로운 프로덕션 배포 환경입니다. Milvus는 일상적으로 이를 달성합니다:</p>
<ul>
<li><p>수십억 개의 벡터에 걸쳐 50ms 미만의 검색 속도</p></li>
<li><p>단일 시스템에서 수십억 개의 문서와 이벤트 관리</p></li>
<li><p>대체 솔루션보다 5~10배 빠른 워크플로</p></li>
<li><p>수십만 개의 컬렉션을 지원하는 멀티 테넌트 아키텍처</p></li>
</ul>
<p>팀들은 <strong>속도, 안정성, 비용 효율성, 몇 달마다 아키텍처를 뜯어고치지 않고도 수십억 개로 확장할 수 있는 능력 등 중요한 부분을 충족하는</strong> Milvus를 선택합니다 <strong>.</strong> 이러한 팀들의 신뢰가 바로 앞으로의 10년을 위해 Milvus를 계속 강화하는 이유입니다.</p>
<p><a href="https://zilliz.com/share-your-story">
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/share_your_story_3c44c533ed.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</a></p>
<h2 id="When-You-Need-Milvus-Without-the-Ops-Zilliz-Cloud" class="common-anchor-header">운영팀 없이 Milvus가 필요할 때: Zilliz Cloud<button data-href="#When-You-Need-Milvus-Without-the-Ops-Zilliz-Cloud" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus는 무료이며 강력하고 실전 테스트를 거쳤습니다. 하지만 분산 시스템이기도 하며, 분산 시스템을 잘 실행하는 것은 실제 엔지니어링 작업입니다. 인덱스 튜닝, 메모리 관리, 클러스터 안정성, 확장, 통합 가시성... 이러한 작업에는 많은 팀에게 여유가 없는 시간과 전문 지식이 필요합니다. 개발자들은 대규모로 관리할 때 필연적으로 수반되는 운영 부담 없이 Milvus의 강력한 기능을 사용하기를 원했습니다.</p>
<p>이러한 현실을 통해 우리는 Milvus가 AI 애플리케이션의 핵심 인프라가 되려면 운영이 쉬워야 한다는 간단한 결론에 도달했습니다. 그래서 오픈소스 프로젝트의 동일한 팀이 만들고 유지 관리하는 완전 관리형 Milvus 서비스인 <a href="https://zilliz.com/cloud"><strong>Zilliz Cloud를</strong></a> 구축했습니다.</p>
<p>Zilliz Cloud는 개발자가 이미 알고 있고 신뢰하는 Milvus를 제공하지만 클러스터 프로비저닝, 성능 문제 해결, 업그레이드 계획, 스토리지 및 컴퓨팅 튜닝에 대한 걱정 없이 사용할 수 있습니다. 또한 자체 관리 환경에서는 실행할 수 없는 최적화가 포함되어 있어 더욱 빠르고 안정적입니다. 상용 등급의 자체 최적화 벡터 엔진인 <a href="https://zilliz.com/blog/cardinal-most-performant-vector-search-engine">Cardinal은</a> <strong>오픈 소스 Milvus보다</strong> 10배 높은 성능을 제공합니다.</p>
<p><strong>질리즈 클라우드의 차별화 요소</strong></p>
<ul>
<li><strong>자체 최적화 성능:</strong> 자동 인덱스는 HNSW, IVF, DiskANN을 자동으로 조정하여 수동 구성 없이도 96% 이상의 리콜률을 제공합니다.</li>
</ul>
<ul>
<li><p><strong>탄력적이고 비용 효율적입니다:</strong> 종량제 요금제, 서버리스 자동 확장, 지능형 리소스 관리로 자체 관리형 배포에 비해 비용을 50% 이상 절감할 수 있습니다.</p></li>
<li><p><strong>엔터프라이즈급 안정성:</strong> 99.95% 가동 시간 SLA, 다중 AZ 이중화, SOC 2 유형 II, ISO 27001 및 GDPR 준수. RBAC, BYOC, 감사 로그 및 암호화를 완벽하게 지원합니다.</p></li>
<li><p><strong>클라우드에 구애받지 않는 배포:</strong> 공급업체에 종속되지 않고 어디서나 일관된 성능을 제공하는 AWS, Azure, GCP, Alibaba Cloud 또는 Tencent Cloud에서 실행할 수 있습니다.</p></li>
<li><p><strong>자연어 쿼리:</strong> 내장된 MCP 서버 지원을 통해 수동으로 API 호출을 작성하는 대신 대화식으로 데이터를 쿼리할 수 있습니다.</p></li>
<li><p><strong>손쉬운 마이그레이션</strong>: 스키마 재작성이나 다운타임 없이 기본 제공 마이그레이션 도구를 사용해 Milvus, Pinecone, Qdrant, Weaviate, Elasticsearch 또는 PostgreSQL에서 이동할 수 있습니다.</p></li>
<li><p><strong>오픈 소스 Milvus와 100% 호환.</strong> 독점적인 포크가 없습니다. 종속성 없음. 더 쉬워진 Milvus만 있습니다.</p></li>
</ul>
<p><strong>Milvus는 항상 오픈 소스로 유지되며 무료로 사용할 수 있습니다.</strong> 하지만 엔터프라이즈 규모로 안정적으로 실행하고 운영하려면 상당한 전문 지식과 리소스가 필요합니다. <strong>질리즈 클라우드는 이러한 격차에 대한 해답입니다</strong>. 29개 지역과 5개의 주요 클라우드에 배포된 Zilliz Cloud는 엔터프라이즈급 성능, 보안 및 비용 효율성을 제공하면서도 이미 알고 있는 Milvus를 완벽하게 유지합니다.</p>
<p><a href="https://cloud.zilliz.com/signup"><strong>무료 평가판 시작하기 →</strong></a></p>
<h2 id="Whats-Next-Milvus-Lake" class="common-anchor-header">다음 단계 밀버스 레이크<button data-href="#Whats-Next-Milvus-Lake" class="anchor-icon" translate="no">
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
    </button></h2><p>벡터 데이터베이스를 도입한 팀으로서 저희는 엔터프라이즈 데이터가 어떻게 변화하고 있는지 가장 가까이에서 지켜보았습니다. 테라바이트 단위의 정형화된 테이블에 깔끔하게 들어맞던 데이터는 이제 페타바이트, 곧 수조 단위의 멀티모달 객체로 빠르게 변하고 있습니다. 텍스트, 이미지, 오디오, 비디오, 시계열 스트림, 다중 센서 로그 등이 이제 최신 AI 시스템이 의존하는 데이터 세트를 정의합니다.</p>
<p>벡터 데이터베이스는 비정형 및 멀티모달 데이터를 위해 특별히 구축되었지만, 특히 대부분의 데이터가 콜드 데이터인 경우 항상 가장 경제적이거나 아키텍처적으로 건전한 선택은 아닙니다. 대규모 모델, 자율 주행 인식 로그, 로보틱스 데이터 세트를 위한 코퍼라 학습에는 일반적으로 밀리초 수준의 지연 시간이나 높은 동시성이 필요하지 않습니다. 이러한 수준의 성능을 필요로 하지 않는 파이프라인의 경우 실시간 벡터 데이터베이스를 통해 이러한 양의 데이터를 실행하는 것은 비용이 많이 들고, 운영 부담이 크며, 지나치게 복잡해집니다.</p>
<p>이러한 현실이 저희의 다음 주요 이니셔티브로 이어졌습니다: 바로 AI 규모의 데이터를 위해 설계된 시맨틱 기반의 인덱스 우선 멀티모달 레이크하우스인 <strong>Milvus Lake</strong>입니다. Milvus Lake는 벡터, 메타데이터, 레이블, LLM에서 생성된 설명, 구조화된 필드 등 모든 양식에서 시맨틱 신호를 통합하고 실제 비즈니스 엔티티를 중심으로 <strong>시맨틱 와이드 테이블로</strong> 조직화합니다. 개체 스토리지, 레이크하우스, 모델 파이프라인에 원시 파일로 흩어져 있던 데이터가 통합되고 쿼리가 가능한 시맨틱 계층으로 바뀝니다. 대규모 멀티모달 코퍼스는 기업 전체에서 일관된 의미를 지닌 관리 가능하고 검색 가능하며 재사용 가능한 자산으로 바뀝니다.</p>
<p>내부적으로 Milvus Lake는 깔끔한 <strong>매니페스트 + 데이터 + 인덱스</strong> 아키텍처를 기반으로 구축되어 있어 인덱싱을 사후 작업이 아닌 기본으로 취급합니다. 이를 통해 수조 규모의 콜드 데이터에 최적화된 '선 검색, 후 처리' 워크플로우를 구현하여 예측 가능한 지연 시간, 획기적으로 낮은 스토리지 비용, 훨씬 더 뛰어난 운영 안정성을 제공합니다. 계층형 스토리지 접근 방식(핫 경로를 위한 NVMe/SSD와 딥 아카이브를 위한 오브젝트 스토리지)과 효율적인 압축 및 지연 로드 인덱스가 결합되어 시맨틱 충실도를 유지하면서 인프라 오버헤드를 확실하게 제어할 수 있습니다.</p>
<p>또한 Milvus Lake는 최신 데이터 에코시스템에 원활하게 연결되며, Paimon, Iceberg, Hudi, Spark, Ray 및 기타 빅데이터 엔진 및 형식과 통합됩니다. 팀은 기존 워크플로를 다시 플랫폼화하지 않고도 일괄 처리, 실시간에 가까운 파이프라인, 시맨틱 검색, 기능 엔지니어링, 교육 데이터 준비 등을 모두 한 곳에서 실행할 수 있습니다. 기초 모델 코퍼스를 구축하든, 자율 주행 시뮬레이션 라이브러리를 관리하든, 로봇 에이전트를 훈련하든, 대규모 검색 시스템을 구동하든, Milvus Lake는 AI 시대를 위한 확장 가능하고 비용 효율적인 시맨틱 레이크하우스를 제공합니다.</p>
<p><strong>Milvus Lake는 현재 활발히 개발 중입니다.</strong> 얼리 액세스에 관심이 있거나 자세히 알아보고 싶으신가요?<a href="https://zilliz.com/contact"> </a></p>
<p><a href="https://zilliz.com/contact-sales"><strong>문의하기 →</strong></a></p>
<h2 id="Built-by-the-Community-For-the-Community" class="common-anchor-header">커뮤니티에 의해, 커뮤니티를 위해 구축<button data-href="#Built-by-the-Community-For-the-Community" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus를 특별하게 만드는 것은 기술뿐만 아니라 그 뒤에 있는 사람들입니다. 고성능 컴퓨팅, 분산 시스템, AI 인프라 분야의 전문가들이 모여 전 세계에 걸쳐 밀버스의 기여자 기반을 형성하고 있습니다. ARM, NVIDIA, AMD, Intel, Meta, IBM, Salesforce, Alibaba, Microsoft 등의 엔지니어와 연구원이 자신의 전문 지식을 제공하여 현재의 Milvus를 만들어냈습니다.</p>
<p>모든 풀 리퀘스트, 모든 버그 리포트, 포럼에서 답변한 모든 질문, 만들어진 모든 튜토리얼 등 이러한 기여 덕분에 Milvus는 모두에게 더 나은 제품이 되었습니다.</p>
<p>이 이정표는 여러분 모두의 것입니다:</p>
<ul>
<li><p><strong>기여자</strong> 여러분께 감사드립니다: 여러분의 코드, 아이디어, 시간에 감사드립니다. 여러분은 매일 Milvus를 개선하고 있습니다.</p></li>
<li><p><strong>사용자 여러분께</strong>: Milvus를 믿고 프로덕션 워크로드를 맡겨주시고 좋은 경험과 어려운 경험을 공유해 주셔서 감사합니다. 여러분의 피드백이 저희 로드맵의 원동력이 됩니다.</p></li>
<li><p><strong>커뮤니티 서포터 여러분께</strong>: 질문에 답변하고, 튜토리얼을 작성하고, 콘텐츠를 만들고, 신규 사용자의 시작을 도와주셔서 감사합니다. 여러분 덕분에 저희 커뮤니티는 따뜻하고 포용적인 분위기가 조성됩니다.</p></li>
<li><p><strong>파트너 및 통합업체 여러분께</strong>: 저희와 함께 Milvus를 AI 개발 생태계의 일류 시민으로 만들어 주셔서 감사합니다.</p></li>
<li><p><strong>질리즈 팀에게</strong>: 오픈소스 프로젝트와 사용자의 성공을 위해 변함없이 헌신해 주셔서 감사합니다.</p></li>
</ul>
<p>수천 명의 사람들이 기초적인 AI 인프라를 누구나 이용할 수 있어야 한다는 신념으로 개방적이고 관대하게 함께 무언가를 만들기로 결정했기에 Milvus는 성장할 수 있었습니다.</p>
<h2 id="Join-Us-on-This-Journey" class="common-anchor-header">이 여정에 동참하세요<button data-href="#Join-Us-on-This-Journey" class="anchor-icon" translate="no">
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
    </button></h2><p>첫 번째 벡터 검색 애플리케이션을 구축하든, 수십억 개의 벡터로 확장하든, Milvus 커뮤니티의 일원이 되어 주시면 감사하겠습니다.</p>
<p><strong>시작하기</strong>:</p>
<ul>
<li><p><strong>깃허브에 별표</strong> 달아주세요:<a href="https://github.com/milvus-io/milvus"> github.com/milvus-io/milvus</a></p></li>
<li><p>☁️ <strong>질리즈 클라우드 무료 체험</strong>:<a href="https://zilliz.com/"> zilliz.com/cloud</a></p></li>
<li><p>💬 <a href="https://discord.com/invite/8uyFbECzPX"><strong>디스코드에</strong></a> <strong>가입하여</strong> 전 세계 개발자들과 소통하세요.</p></li>
<li><p>📚 <strong>문서를 살펴보세요</strong>: <a href="https://milvus.io/docs">밀버스 문서</a></p></li>
<li><p><a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"><strong>20분 일대일 세션을</strong></a> <strong>예약하여</strong> 인사이트, 안내 및 질문에 대한 답변을 얻으세요.</p></li>
</ul>
<p>앞으로의 여정은 흥미진진합니다. AI가 산업을 재편하고 새로운 가능성을 열면서 벡터 데이터베이스는 이러한 변화의 핵심에 자리 잡을 것입니다. 우리는 함께 최신 AI 애플리케이션이 의존하는 시맨틱 기반을 구축하고 있으며, 이는 이제 시작에 불과합니다.</p>
<p>다음 40,000명의 스타들과 <strong>함께</strong> AI 인프라의 미래를 <strong>함께</strong> 구축해 나가겠습니다. 🎉</p>
