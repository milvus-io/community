---
id: is-mcp-dead-cli-and-skills-for-ai-agents.md
title: 'MCP는 죽었나요? MCP, CLI 및 에이전트 스킬로 구축하면서 배운 점'
author: Cheney Zhang
date: 2026-4-1
cover: assets.zilliz.com/mcp_dead_a23ff23c27.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  MCP protocol, AI agent tooling, agent skills, model context protocol, CLI
  tools
meta_title: |
  Is MCP Dead? MCP vs CLI vs Agent Skills Compared
desc: >-
  MCP는 컨텍스트를 먹고, 프로덕션이 중단되며, 에이전트의 LLM을 재사용할 수 없습니다. 이 세 가지를 모두 고려하여 구축했으며, 각각에
  적합한 시기는 다음과 같습니다.
origin: 'https://milvus.io/blog/is-mcp-dead-cli-and-skills-for-ai-agents.md'
---
<p>퍼플렉시티의 CTO 데니스 야라츠가 ASK 2026에서 회사가 내부적으로 MCP의 우선순위를 낮추고 있다고 말했을 때, 이는 일반적인 사이클의 시작이었습니다. MCP가 컨텍스트 창을 너무 많이 잡아먹고 인증이 중단되어 30분 만에 CLI 대체품을 만들었다고 YC CEO인 Garry Tan이 목소리를 높였습니다. 해커 뉴스는 MCP를 강력하게 반대했습니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/is_mcp_dead_cli_and_skills_for_ai_agents_md_1_4e49d13991.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/is_mcp_dead_cli_and_skills_for_ai_agents_md_2_7dc46108c1.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>1년 전만 해도 이 정도의 대중적 회의론은 드문 일이었을 것입니다. MCP(모델 컨텍스트 프로토콜)는 <a href="https://zilliz.com/glossary/ai-agents">AI 에이전트</a> 도구 통합을 위한 최종 표준으로 자리 잡았습니다. 서버 수는 매주 두 배씩 증가했습니다. 그 후의 패턴은 빠른 과대 광고, 광범위한 채택, 그리고 환멸이라는 익숙한 패턴을 따랐습니다.</p>
<p>업계는 빠르게 대응하고 있습니다. 바이트댄스의 Lark/Feishu는 11개 비즈니스 도메인에 걸쳐 200개 이상의 명령과 19개의 기본 제공 에이전트 스킬을 갖춘 공식 CLI를 오픈소스화했습니다. 구글은 구글 워크스페이스용 gw를 출시했습니다. CLI + 스킬 패턴은 틈새 대안이 아닌 엔터프라이즈 에이전트 툴링의 기본으로 빠르게 자리 잡고 있습니다.</p>
<p>질리즈에서는 코딩 환경을 벗어나지 않고도 터미널에서 직접 <a href="https://milvus.io/intro">Milvus와</a> <a href="https://zilliz.com/cloud">Zilliz Cloud</a> (완전 관리형 Milvus)를 운영 및 관리할 수 있는 <a href="https://docs.zilliz.com/reference/cli/overview">Zilliz CLI를</a> 출시했습니다. 또한 Claude Code, Codex와 같은 AI 코딩 에이전트가 자연어를 통해 <a href="https://zilliz.com/learn/what-is-vector-database">벡터 데이터베이스를</a> 관리할 수 있도록 <a href="https://milvus.io/docs/milvus_for_agents.md">Milvus Skills와</a> <a href="https://docs.zilliz.com/docs/agents/zilliz-skill">Zilliz Skills를</a>구축했습니다.</p>
<p>또한 1년 전에는 Milvus와 Zilliz Cloud를 위한 MCP 서버를 구축했습니다. 그 경험을 통해 MCP의 문제점을 정확히 파악할 수 있었습니다. 컨텍스트 창 비대, 수동적인 도구 설계, 에이전트의 자체 LLM을 재사용할 수 없다는 세 가지 아키텍처적 한계로 인해 CLI와 스킬로 전환하게 되었습니다.</p>
<p>이 게시물에서는 각 문제를 살펴보고, 대신 무엇을 구축하고 있는지 보여주며, MCP, CLI, 상담원 스킬 중에서 선택할 수 있는 실용적인 프레임워크를 제시합니다.</p>
<h2 id="MCP-Eats-72-of-Your-Context-Window-at-Startup" class="common-anchor-header">시작 시 컨텍스트 창의 72%를 차지하는 MCP<button data-href="#MCP-Eats-72-of-Your-Context-Window-at-Startup" class="anchor-icon" translate="no">
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
    </button></h2><p>표준 MCP 설정은 에이전트가 단일 작업을 수행하기 전에 사용 가능한 컨텍스트 창의 약 72%를 소비할 수 있습니다. 200만 토큰 모델에서 GitHub, Playwright, IDE 통합 등 세 개의 서버를 연결하면 도구 정의만 약 143,000 토큰을 차지합니다. 에이전트는 아직 아무것도 하지 않았습니다. 이미 4분의 3이 가득 찼습니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/is_mcp_dead_cli_and_skills_for_ai_agents_md_3_767d46c583.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>비용은 토큰뿐만이 아닙니다. 관련 없는 콘텐츠가 컨텍스트에 많이 포함될수록 실제로 중요한 것에 대한 모델의 초점이 약해집니다. 수백 개의 도구 스키마가 컨텍스트에 포함되어 있다는 것은 상담원이 모든 결정을 내릴 때마다 모든 스키마를 검토해야 한다는 것을 의미합니다. 연구자들은 컨텍스트 과부하로 인한 추론 품질 저하를 ' <em>컨텍스트</em> 썩음'이라고 부르는 현상을 문서화했습니다. 측정된 테스트에서 도구 수가 증가함에 따라 도구 선택 정확도는 43%에서 14% 이하로 떨어졌습니다. 도구가 많다는 것은 역설적으로 도구 사용이 더 나빠진다는 것을 의미합니다.</p>
<p>근본 원인은 아키텍처에 있습니다. MCP는 현재 대화에서 도구를 사용할지 여부와 관계없이 세션 시작 시 모든 도구 설명을 전부 로드합니다. 이는 버그가 아닌 프로토콜 수준의 설계 선택이지만 추가하는 모든 도구에 따라 비용이 증가합니다.</p>
<p>상담원 스킬은 <strong>점진적 공개라는</strong> 다른 접근 방식을 취합니다. 세션 시작 시 상담원은 각 스킬의 메타데이터(이름, 한 줄 설명, 트리거 조건)만 읽습니다. 총 수십 개의 토큰입니다. 전체 스킬 콘텐츠는 상담원이 관련성이 있다고 판단할 때만 로드됩니다. 이렇게 생각하면 됩니다: MCP는 모든 도구를 앞에 나열하고 사용자가 선택하게 하는 반면, 스킬은 인덱스가 먼저 제공되고 필요할 때 전체 콘텐츠가 제공됩니다.</p>
<p>CLI 도구도 비슷한 이점을 제공합니다. 에이전트는 모든 매개변수 정의를 미리 로드하지 않고도 필요에 따라 git --help 또는 docker --help를 실행하여 기능을 검색할 수 있습니다. 컨텍스트 비용은 선불이 아닌 사용량에 따라 지불합니다.</p>
<p>소규모 규모에서는 그 차이가 미미합니다. 프로덕션 규모에서는 제대로 작동하는 에이전트와 자체 도구 정의에 빠져 있는 에이전트의 차이입니다.</p>
<h2 id="MCPs-Passive-Architecture-Limits-Agent-Workflows" class="common-anchor-header">에이전트 워크플로를 제한하는 MCP의 수동적 아키텍처<button data-href="#MCPs-Passive-Architecture-Limits-Agent-Workflows" class="anchor-icon" translate="no">
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
    </button></h2><p>MCP는 도구를 검색하고, 도구를 호출하고, 결과를 수신하는 방법인 도구 호출 프로토콜입니다. 간단한 사용 사례를 위한 깔끔한 디자인. 하지만 이러한 깔끔함은 제약이기도 합니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/is_mcp_dead_cli_and_skills_for_ai_agents_md_4_f80de07814.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Flat-Tool-Space-with-No-Hierarchy" class="common-anchor-header">계층 구조가 없는 평평한 도구 공간</h3><p>MCP 도구는 플랫 함수 시그니처입니다. 하위 명령도 없고, 세션 수명 주기에 대한 인식도 없으며, 상담원이 다단계 워크플로우에서 어디에 있는지 알 수 없습니다. 호출되기만 기다립니다. 그게 전부입니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/is_mcp_dead_cli_and_skills_for_ai_agents_md_5_e7f3630e1f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>CLI는 완전히 다른 실행 경로를 공유하며 단일 인터페이스를 사용하는 git 커밋, git 푸시, git 로그가 작동합니다. 에이전트는 모든 매개변수 문서를 컨텍스트에 프론트로딩하지 않고 --help를 실행하고 사용 가능한 표면을 점진적으로 탐색한 후 필요한 것만 확장합니다.</p>
<h3 id="Skills-Encode-Workflow-Logic--MCP-Cant" class="common-anchor-header">스킬이 워크플로 로직을 인코딩 - MCP는 할 수 없습니다.</h3><p>에이전트 스킬은 먼저 해야 할 일, 다음에 해야 할 일, 장애 처리 방법, 사용자에게 무언가를 표시할 시기 등 표준 운영 절차가 포함된 마크다운 파일입니다. 상담원은 단순한 툴이 아니라 전체 워크플로우를 받게 됩니다. 스킬은 상담원이 대화 중에 행동하는 방식, 즉 무엇이 트리거되고, 무엇을 미리 준비하고, 오류로부터 어떻게 복구하는지를 능동적으로 형성합니다. MCP 도구는 기다릴 수밖에 없습니다.</p>
<h3 id="MCP-Cant-Access-the-Agents-LLM" class="common-anchor-header">MCP가 상담원의 LLM에 액세스할 수 없음</h3><p>이것이 실제로 우리를 막았던 한계였습니다.</p>
<p>Claude Code 및 기타 AI 코딩 에이전트에 <a href="https://zilliz.com/glossary/semantic-search">시맨틱 검색을</a> 추가하여 전체 코드베이스에서 심층적인 컨텍스트를 제공하는 MCP 플러그인인 <a href="https://github.com/zilliztech/claude-context">claude-context를</a> 구축했을 때, Milvus에서 관련성 있는 과거 대화 스니펫을 검색하여 컨텍스트로 표시하고 싶었습니다. <a href="https://zilliz.com/learn/vector-similarity-search">벡터 검색</a> 검색은 효과가 있었습니다. 문제는 결과를 어떻게 처리할 것인가 하는 것이었습니다.</p>
<p>상위 10개 결과를 검색하면 3개 정도는 유용할 수 있습니다. 나머지 7개는 노이즈입니다. 10개를 모두 외부 에이전트에게 넘기면 노이즈가 답을 방해합니다. 테스트에서 관련 없는 과거 기록으로 인해 응답이 산만해지는 것을 보았습니다. 결과를 전달하기 전에 필터링이 필요했습니다.</p>
<p>몇 가지 접근 방식을 시도했습니다. 작은 모델을 사용하여 MCP 서버 내부에 재랭크 단계를 추가하는 방법: 충분히 정확하지 않았고, 관련성 임계값을 사용 사례별로 조정해야 했습니다. 재랭킹에 큰 모델을 사용하는 경우: 기술적으로는 문제가 없지만 MCP 서버는 외부 에이전트의 LLM에 액세스할 수 없는 별도의 프로세스로 실행됩니다. 별도의 LLM 클라이언트를 구성하고, 별도의 API 키를 관리하고, 별도의 호출 경로를 처리해야 했습니다.</p>
<p>우리가 원했던 것은 외부 에이전트의 LLM이 필터링 결정에 직접 참여하도록 하는 것이었습니다. 상위 10개를 검색하고, 에이전트 자체에서 보관할 가치가 있는 것을 판단하여 관련 결과만 반환하면 됩니다. 두 번째 모델이 필요 없습니다. 추가 API 키가 필요하지 않습니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/is_mcp_dead_cli_and_skills_for_ai_agents_md_6_aca200f359.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>MCP는 이 작업을 수행할 수 없습니다. 서버와 에이전트 사이의 프로세스 경계는 인텔리전스 경계이기도 합니다. 서버는 에이전트의 LLM을 사용할 수 없고, 에이전트는 서버 내부에서 일어나는 일을 제어할 수 없습니다. 간단한 CRUD 도구에서는 괜찮습니다. 도구가 판단을 내려야 하는 순간, 이러한 격리는 실질적인 제약이 됩니다.</p>
<p>에이전트 스킬은 이 문제를 직접 해결합니다. 검색 스킬은 상위 10개에 대한 벡터 검색을 호출하고 에이전트의 자체 LLM이 관련성을 평가하여 통과한 것만 반환하도록 할 수 있습니다. 추가 모델이 필요하지 않습니다. 에이전트가 필터링을 자체적으로 수행합니다.</p>
<h2 id="What-We-Built-Instead-with-CLI-and-Skills" class="common-anchor-header">CLI와 스킬로 대신 구축한 기능<button data-href="#What-We-Built-Instead-with-CLI-and-Skills" class="anchor-icon" translate="no">
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
    </button></h2><p>저희는 메모리 검색뿐만 아니라 스택 전반에서 에이전트-도구 상호 작용의 방향성을 CLI + 스킬로 보고 있습니다. 이러한 신념이 우리가 구축하는 모든 것의 원동력입니다.</p>
<h3 id="memsearch-A-Skills-Based-Memory-Layer-for-AI-Agents" class="common-anchor-header">멤서치: AI 에이전트를 위한 스킬 기반 메모리 레이어</h3><p>저희는 클로드 코드와 다른 AI 에이전트를 위한 오픈 소스 메모리 레이어인 <a href="https://github.com/zilliztech/memsearch">memsearch를</a> 구축했습니다. 스킬은 세 단계로 구성된 서브에이전트 내부에서 실행됩니다: Milvus는 광범위한 검색을 위한 초기 벡터 검색을 처리하고, 에이전트의 자체 LLM은 관련성을 평가하고 유망한 히트에 대한 컨텍스트를 확장하며, 최종 드릴다운은 필요할 때만 원본 대화에 액세스합니다. 각 단계에서 노이즈가 제거되므로 중간 검색 정크가 기본 컨텍스트 창에 도달하지 않습니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/is_mcp_dead_cli_and_skills_for_ai_agents_md_7_7c85103513.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>핵심 인사이트: 에이전트의 인텔리전스는 도구 실행의 일부입니다. 이미 루프에 있는 LLM이 필터링을 수행하므로 두 번째 모델이나 추가 API 키, 취약한 임계값 조정이 필요하지 않습니다. 이는 코딩 에이전트를 위한 대화 컨텍스트 검색이라는 특정 사용 사례이지만, 이 아키텍처는 실행뿐 아니라 도구에 판단이 필요한 모든 시나리오에 일반화됩니다.</p>
<h3 id="Zilliz-CLI-Skills-and-Plugin-for-Vector-Database-Operations" class="common-anchor-header">벡터 데이터베이스 운영을 위한 Zilliz CLI, 스킬 및 플러그인</h3><p>Milvus는 세계에서 가장 널리 채택된 오픈소스 벡터 데이터베이스로, <a href="https://github.com/milvus-io/milvus">GitHub에서 43,000개 이상의 별을</a> 받았습니다. <a href="https://zilliz.com/cloud">질리즈 클라우드는</a> 고급 엔터프라이즈 기능을 갖춘 Milvus의 완전 관리형 서비스로, Milvus보다 훨씬 빠릅니다.</p>
<p>위에서 언급한 것과 동일한 계층형 아키텍처가 개발자 도구를 구동합니다:</p>
<ul>
<li><a href="https://docs.zilliz.com/reference/cli/overview">Zilliz CLI는</a> 인프라 계층입니다. 클러스터 관리, <a href="https://milvus.io/docs/manage-collections.md">수집 작업</a>, 벡터 검색, <a href="https://milvus.io/docs/rbac.md">RBAC</a>, 백업, 청구 등 Zilliz Cloud 콘솔에서 할 수 있는 모든 작업을 터미널에서 사용할 수 있습니다. 사람과 에이전트가 동일한 명령을 사용합니다. Zilliz CLI는 Milvus 스킬과 Zilliz 스킬의 기반이 되기도 합니다.</li>
<li>밀버스<a href="https://milvus.io/docs/milvus_for_agents.md">스킬은</a> 오픈 소스 밀버스를 위한 지식 레이어입니다. AI 코딩 에이전트(클로드 코드, 커서, 코덱스, 깃허브 코파일럿)가 연결, <a href="https://milvus.io/docs/schema-hands-on.md">스키마 설계</a>, CRUD, <a href="https://zilliz.com/learn/hybrid-search-with-milvus">하이브리드 검색</a>, <a href="https://milvus.io/docs/full-text-search.md">전체 텍스트 검색</a>, <a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">RAG 파이프라인</a> 등 <a href="https://milvus.io/docs/install-pymilvus.md">pymilvus</a> Python 코드를 통해 Milvus <a href="https://milvus.io/docs/milvus_lite.md">Lite</a>, Standalone 또는 Distributed 등 모든 Milvus 배포를 운영할 수 있도록 가르칩니다.</li>
<li>질리즈<a href="https://docs.zilliz.com/docs/agents/zilliz-skill">스킬은</a> 질리즈 클라우드에서도 동일하게 에이전트가 질리즈 CLI를 통해 클라우드 인프라를 관리할 수 있도록 교육합니다.</li>
<li>질리즈<a href="https://github.com/zilliztech/zilliz-plugin">플러그인은</a> 클로드 코드를 위한 개발자 경험 레이어로, /zilliz:quickstart 및 /zilliz:status와 같은 슬래시 명령을 통해 CLI + Skill을 안내식 경험으로 래핑합니다.</li>
</ul>
<p>CLI는 실행을 처리하고, 스킬은 지식과 워크플로 로직을 인코딩하며, 플러그인은 UX를 제공합니다. 루프에 MCP 서버가 없습니다.</p>
<p>자세한 내용은 다음 리소스를 확인하세요:</p>
<ul>
<li><a href="https://zilliz.com/blog/introducing-zilliz-cli-and-agent-skills-for-zilliz-cloud">질리즈 클라우드용 질리즈 CLI 및 에이전트 스킬 소개</a></li>
<li><a href="https://zilliz.com/blog/zilliz-cloud-just-landed-in-claude-code">질리즈 클라우드, 클로드 코드에 막 상륙하다</a></li>
<li><a href="https://docs.zilliz.com/docs/agents/zilliz-ai-prompts">AI 프롬프트 - 질리즈 클라우드 개발자 허브</a></li>
<li><a href="https://docs.zilliz.com/reference/cli/overview">질리즈 CLI 레퍼런스 - 질리즈 클라우드 개발자 허브</a></li>
<li><a href="https://docs.zilliz.com/docs/agents/zilliz-skill">질리즈 스킬 - 질리즈 클라우드 개발자 허브</a></li>
<li><a href="https://milvus.io/docs/milvus_for_agents.md">AI 에이전트용 Milvus - Milvus 문서</a></li>
</ul>
<h2 id="Is-MCP-Actually-Dying" class="common-anchor-header">MCP는 정말 죽어가고 있나요?<button data-href="#Is-MCP-Actually-Dying" class="anchor-icon" translate="no">
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
    </button></h2><p>저희 질리즈를 포함한 많은 개발자와 기업들이 CLI와 스킬로 눈을 돌리고 있습니다. 하지만 MCP는 정말 죽어가고 있을까요?</p>
<p>짧은 대답은 '아니요'입니다. 하지만 그 범위는 점점 좁아지고 있습니다.</p>
<p>MCP는 리눅스 재단에 기부되었습니다. 활성 서버는 10,000개가 넘습니다. SDK 월간 다운로드 수는 9,700만 건에 달합니다. 이 정도 규모의 생태계는 컨퍼런스 발언 한 마디 때문에 사라지지 않습니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/is_mcp_dead_cli_and_skills_for_ai_agents_md_8_b2246e6825.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Hacker News의 한 스레드 - <em>"MCP와 CLI는 언제 의미가 있을까요?"</em> - "CLI 도구는 정밀한 도구와 같다.", "CLI는 MCP보다 더 빠른 느낌이다." 등 대부분 CLI를 선호하는 응답을 이끌어냈습니다. 일부 개발자는 좀 더 균형 잡힌 시각을 가지고 있습니다: 스킬은 문제를 더 잘 해결하는 데 도움이 되는 세부적인 방법이고, MCP는 문제를 해결하는 데 도움이 되는 도구입니다. 둘 다 각자의 자리가 있습니다.</p>
<p>이는 공평하지만 현실적인 의문을 제기합니다. 레시피 자체로 상담원에게 어떤 도구를 어떻게 사용할지 안내할 수 있다면 별도의 도구 배포 프로토콜이 여전히 필요할까요?</p>
<p>사용 사례에 따라 다릅니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/is_mcp_dead_cli_and_skills_for_ai_agents_md_9_e2cb28812b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>대부분의 개발자가 로컬에서 실행하는 버전인<strong>MCP over stdio는</strong> 불안정한 프로세스 간 통신, 지저분한 환경 격리, 높은 토큰 오버헤드 등 문제가 누적되는 곳입니다. 이러한 맥락에서 거의 모든 사용 사례에 대해 더 나은 대안이 존재합니다.</p>
<p>하지만<strong>MCP over HTTP는</strong> 다른 이야기입니다. 기업 내부 툴링 플랫폼에는 중앙 집중식 권한 관리, 통합 OAuth, 표준화된 원격 측정 및 로깅이 필요합니다. 파편화된 CLI 도구는 이러한 기능을 제공하기가 정말 어렵습니다. MCP의 중앙 집중식 아키텍처는 이러한 맥락에서 진정한 가치를 지니고 있습니다.</p>
<p>퍼플렉시티가 실제로 중단한 것은 주로 stdio 사용 사례였습니다. 데니스 야라츠는 "내부적으로"라는 표현을 썼을 뿐, 업계 전체에 이러한 선택을 채택할 것을 요구하지는 않았습니다. 이러한 뉘앙스가 전달 과정에서 사라져 "Perplexity, MCP 포기"가 "Perplexity, 내부 도구 통합을 위해 stdio보다 MCP를 우선시하다"보다 훨씬 빠르게 퍼져나갔습니다.</p>
<p>MCP는 실제 문제를 해결했기 때문에 등장했습니다. 이전에는 모든 AI 애플리케이션이 공유된 표준 없이 자체적인 도구 호출 로직을 작성했습니다. MCP는 적절한 순간에 통합 인터페이스를 제공했고 에코시스템은 빠르게 구축되었습니다. 그러다 프로덕션 경험을 통해 한계가 드러났습니다. 이는 인프라 툴링의 정상적인 과정이지 사형 선고가 아닙니다.</p>
<h2 id="When-to-Use-MCP-CLI-or-Skills" class="common-anchor-header">MCP, CLI 또는 스킬을 사용해야 할 때<button data-href="#When-to-Use-MCP-CLI-or-Skills" class="anchor-icon" translate="no">
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
    </button></h2><table>
<thead>
<tr><th></th><th>MCP over stdio(로컬)</th><th>MCP over HTTP(엔터프라이즈)</th></tr>
</thead>
<tbody>
<tr><td><strong>인증</strong></td><td>없음</td><td>OAuth, 중앙 집중식</td></tr>
<tr><td><strong>연결 안정성</strong></td><td>프로세스 격리 문제</td><td>안정적인 HTTPS</td></tr>
<tr><td><strong>로깅</strong></td><td>표준 메커니즘 없음</td><td>중앙 집중식 원격 측정</td></tr>
<tr><td><strong>액세스 제어</strong></td><td>없음</td><td>역할 기반 권한</td></tr>
<tr><td><strong>우리의 견해</strong></td><td>CLI + 스킬로 교체</td><td>엔터프라이즈 툴링용으로 유지</td></tr>
</tbody>
</table>
<p><a href="https://zilliz.com/glossary/ai-agents">에이전트 AI</a> 툴링 스택을 선택하는 팀의 경우 레이어를 선택하는 방법은 다음과 같습니다:</p>
<table>
<thead>
<tr><th>레이어</th><th>기능</th><th>최상의 대상</th><th>예시</th></tr>
</thead>
<tbody>
<tr><td><strong>CLI</strong></td><td>운영 작업, 인프라 관리</td><td>에이전트와 사람이 모두 실행하는 명령</td><td>git, docker, zilliz-cli</td></tr>
<tr><td><strong>스킬</strong></td><td>에이전트 워크플로 로직, 인코딩된 지식</td><td>LLM 판단이 필요한 작업, 다단계 SOP</td><td>밀버스 스킬, 질리즈 스킬, 멤서치</td></tr>
<tr><td><strong>REST API</strong></td><td>외부 통합</td><td>타사 서비스에 연결</td><td>GitHub API, Slack API</td></tr>
<tr><td><strong>MCP HTTP</strong></td><td>엔터프라이즈 도구 플랫폼</td><td>중앙 집중식 인증, 감사 로깅</td><td>내부 도구 게이트웨이</td></tr>
</tbody>
</table>
<h2 id="Get-Started" class="common-anchor-header">시작하기<button data-href="#Get-Started" class="anchor-icon" translate="no">
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
    </button></h2><p>이 문서에서 설명한 모든 내용은 지금 바로 사용할 수 있습니다:</p>
<ul>
<li><a href="https://github.com/zilliztech/memsearch"><strong>memsearch</strong></a> - AI 에이전트를 위한 Skills 기반 메모리 계층. Claude Code 또는 Skills를 지원하는 모든 에이전트에 설치하세요.</li>
<li>질리즈<a href="https://docs.zilliz.com/reference/cli/overview"><strong>CLI</strong></a> - 터미널에서 밀버스 및 질리즈 클라우드를 관리하세요. 설치하고 에이전트가 사용할 수 있는 하위 명령을 살펴보세요.</li>
<li><a href="https://milvus.io/docs/milvus_for_agents.md"><strong>Milvus 스킬</strong></a> 및 <a href="https://docs.zilliz.com/docs/agents/zilliz-skill"><strong>질리즈 스킬</strong></a> - AI 코딩 에이전트에게 기본 Milvus 및 질리즈 클라우드 지식을 제공하세요.</li>
</ul>
<p>벡터 검색, 에이전트 아키텍처 또는 CLI 및 스킬을 사용한 구축에 대한 질문이 있으신가요? <a href="https://discord.com/invite/8uyFbECzPX">Milvus Discord 커뮤니티에</a> 가입하거나 <a href="https://milvus.io/office-hours">무료 오피스 아워 세션을 예약하여</a> 사용 사례에 대해 이야기해 보세요.</p>
<p>구축할 준비가 되셨나요? <a href="https://cloud.zilliz.com/signup">질리즈 클라우드에 가입</a> 하세요 - 업무용 이메일이 있는 신규 계정은 $100의 무료 크레딧을 받을 수 있습니다. 이미 계정이 있으신가요? <a href="https://cloud.zilliz.com/login">여기에서 로그인하세요</a>.</p>
<h2 id="Frequently-Asked-Questions" class="common-anchor-header">자주 묻는 질문<button data-href="#Frequently-Asked-Questions" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="What-is-wrong-with-MCP-for-AI-agents" class="common-anchor-header">AI 에이전트용 MCP의 문제점은 무엇인가요?</h3><p>MCP에는 프로덕션 환경에서 세 가지 주요 아키텍처 제한 사항이 있습니다. 첫째, 세션 시작 시 모든 툴 스키마를 컨텍스트 창에 로드합니다. 200만 토큰 모델에서 MCP 서버를 3개만 연결해도 에이전트가 작업을 수행하기 전에 사용 가능한 컨텍스트의 70% 이상이 소모될 수 있습니다. 둘째, MCP 도구는 수동적이어서 호출될 때까지 기다리며 다단계 워크플로, 오류 처리 로직 또는 표준 운영 절차를 인코딩할 수 없습니다. 셋째, MCP 서버는 에이전트의 LLM에 액세스할 수 없는 별도의 프로세스로 실행되므로 검색 결과의 관련성 필터링과 같이 판단이 필요한 모든 툴은 자체 API 키를 사용하여 별도의 모델을 구성해야 합니다. 이러한 문제는 MCP over stdio에서 가장 심각하며, MCP over HTTP는 이러한 문제 중 일부를 완화합니다.</p>
<h3 id="What-is-the-difference-between-MCP-and-Agent-Skills" class="common-anchor-header">MCP와 상담원 스킬의 차이점은 무엇인가요?</h3><p>MCP는 에이전트가 외부 도구를 검색하고 호출하는 방법을 정의하는 도구 호출 프로토콜입니다. 상담원 스킬은 트리거, 단계별 지침, 오류 처리 및 에스컬레이션 규칙 등 전체 표준 운영 절차가 포함된 마크다운 파일입니다. 아키텍처의 핵심적인 차이점입니다: 스킬은 상담원의 프로세스 내부에서 실행되므로 관련성 필터링이나 결과 재순위 지정과 같은 판단 호출에 상담원 자체의 LLM을 활용할 수 있습니다. MCP 툴은 별도의 프로세스에서 실행되며 상담원의 인텔리전스에 액세스할 수 없습니다. 스킬은 또한 시작 시 가벼운 메타데이터만 로드하고 전체 콘텐츠는 필요에 따라 로드하는 점진적 공개를 사용하므로 MCP의 사전 스키마 로딩에 비해 컨텍스트 창 사용량을 최소화합니다.</p>
<h3 id="When-should-I-still-use-MCP-instead-of-CLI-or-Skills" class="common-anchor-header">언제 여전히 CLI나 스킬 대신 MCP를 사용해야 하나요?</h3><p>중앙 집중식 OAuth, 역할 기반 액세스 제어, 표준화된 원격 분석, 여러 내부 도구에 대한 감사 로깅이 필요한 엔터프라이즈 툴링 플랫폼에는 여전히 MCP over HTTP가 적합합니다. 파편화된 CLI 도구는 이러한 엔터프라이즈 요구 사항을 일관되게 제공하기가 어렵습니다. 에이전트가 컴퓨터의 툴과 상호 작용하는 로컬 개발 워크플로우의 경우 일반적으로 CLI + 스킬은 MCP over stdio보다 더 나은 성능, 낮은 컨텍스트 오버헤드, 유연한 워크플로 로직을 제공합니다.</p>
<h3 id="How-do-CLI-tools-and-Agent-Skills-work-together" class="common-anchor-header">CLI 툴과 상담원 스킬은 어떻게 함께 작동하나요?</h3><p>CLI는 실행 계층(실제 명령어)을 제공하고, 스킬은 지식 계층(어떤 명령을 언제, 어떤 순서로 실행할지, 실패를 어떻게 처리할지)을 제공합니다. 예를 들어, Zilliz CLI는 클러스터 관리, 수집 CRUD, 벡터 검색과 같은 인프라 작업을 처리합니다. 밀버스 스킬은 에이전트에게 스키마 설계, 하이브리드 검색, RAG 파이프라인에 적합한 파이밀버스 패턴을 가르칩니다. CLI는 작업을 수행하고 스킬은 워크플로우를 파악합니다. 실행을 위한 CLI, 지식을 위한 스킬, UX를 위한 플러그인이라는 이 계층화된 패턴은 Zilliz의 모든 개발자 도구를 구성하는 방식입니다.</p>
<h3 id="MCP-vs-Skills-vs-CLI-when-should-I-use-each" class="common-anchor-header">MCP와 스킬, CLI는 각각 언제 사용해야 하나요?</h3><p>git, docker, zilliz-cli와 같은 CLI 도구는 계층적 하위 명령어를 노출하고 필요에 따라 로드하는 운영 작업에 가장 적합합니다. 밀버스 스킬과 같은 스킬은 운영 절차, 오류 복구, 에이전트의 LLM에 액세스할 수 있는 등 에이전트 워크플로 로직에 가장 적합합니다. 중앙 집중식 OAuth, 권한 및 감사 로깅이 필요한 엔터프라이즈 도구 플랫폼에는 여전히 MCP over HTTP가 적합합니다. 로컬 버전인 MCP over stdio는 대부분의 프로덕션 설정에서 CLI + Skills로 대체되고 있습니다.</p>
