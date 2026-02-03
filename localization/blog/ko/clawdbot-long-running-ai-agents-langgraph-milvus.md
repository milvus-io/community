---
id: clawdbot-long-running-ai-agents-langgraph-milvus.md
title: Clawdbot이 입소문을 탄 이유와 LangGraph 및 Milvus로 프로덕션에 적합한 장기 실행 에이전트를 구축하는 방법
author: Min Yin
date: 2026-02-03T00:00:00.000Z
cover: >-
  assets.zilliz.com/Clawdbot_Long_Running_Agents_with_Lang_Graph_and_Milvus_62dab00205.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'AI Agent, Langgraph, Milvus, vector database, Clawdbot'
meta_keywords: 'Clawdbot, LangGraph, Milvus, AI Agents, Openclaw'
meta_title: |
  Build Clawdbot-Style AI Agents with LangGraph & Milvus
desc: >-
  클로봇은 사람들이 행동하는 AI를 원한다는 것을 증명했습니다. 두 에이전트 아키텍처인 Milvus와 LangGraph를 사용하여 프로덕션에
  바로 사용할 수 있는 장기 실행 에이전트를 구축하는 방법을 알아보세요.
origin: 'https://milvus.io/blog/clawdbot-long-running-ai-agents-langgraph-milvus.md'
---
<h2 id="Clawdbot-now-OpenClaw-went-viral" class="common-anchor-header">입소문을 탄 Clawdbot(현재 OpenClaw)<button data-href="#Clawdbot-now-OpenClaw-went-viral" class="anchor-icon" translate="no">
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
    </button></h2><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/openclaw_screenshot_two_agents_p1_9bf856b499.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>현재 OpenClaw로 이름이 바뀐<a href="https://openclaw.ai/">Clawdbot은</a> 지난 주 인터넷을 강타했습니다. 피터 스타인버거가 만든 이 오픈소스 AI 비서가 단 며칠 만에 <a href="https://github.com/openclaw/openclaw">GitHub 별 11만 개 이상을</a> 기록했습니다. 사용자들은 자율적으로 항공편을 확인하고, 이메일을 관리하고, 스마트 홈 기기를 제어하는 동영상을 올렸습니다. OpenAI의 창립 엔지니어인 안드레이 카르파시(Andrej Karpathy)도 극찬했습니다. 기술 창업자이자 투자자인 데이비드 색스는 트위터를 통해 이에 대해 언급했습니다. 사람들은 "자비스, 하지만 진짜"라고 불렀습니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/David_Stacks_replace_NYC_with_Mac_and_clawdbot_two_agent_p2_2f62f6ad49.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>그러다 보안 경고가 나왔습니다.</p>
<p>연구원들은 수백 개의 노출된 관리자 패널을 발견했습니다. 이 봇은 기본적으로 루트 액세스 권한으로 실행됩니다. 샌드박스가 없습니다. 프롬프트 인젝션 취약점으로 인해 공격자가 에이전트를 탈취할 수 있습니다. 보안의 악몽.</p>
<h2 id="Clawdbot-went-viral-for-a-reason" class="common-anchor-header">Clawdbot이 입소문을 탄 데에는 이유가 있습니다.<button data-href="#Clawdbot-went-viral-for-a-reason" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Clawdbot이 입소문을 탄 데에는 이유가 있습니다.</strong> 로컬 또는 자체 서버에서 실행됩니다. 사람들이 이미 사용하고 있는 메시징 앱, 즉 왓츠앱, 슬랙, 텔레그램, iMessage에 연결합니다. 매번 답장할 때마다 모든 내용을 잊어버리지 않고 시간이 지남에 따라 맥락을 기억합니다. 캘린더를 관리하고, 이메일을 요약하며, 여러 앱에서 작업을 자동화합니다.</p>
<p>사용자는 단순히 즉각적인 응답 도구가 아니라 항상 켜져 있는 개인용 AI라는 느낌을 받을 수 있습니다. 오픈소스 기반의 자체 호스팅 모델은 제어와 커스터마이징을 원하는 개발자에게 매력적입니다. 또한 기존 워크플로우와 쉽게 통합할 수 있어 공유 및 추천이 용이합니다.</p>
<h2 id="Two-challenges-for-building-long-running-agents" class="common-anchor-header">장기적으로 운영되는 에이전트를 구축하기 위한 두 가지 과제<button data-href="#Two-challenges-for-building-long-running-agents" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>클로봇의 인기는 사람들이</strong><strong> 단순한 답변이 아닌</strong> <em>행동하는</em><strong>AI를 원한다는 것을 증명합니다</strong><strong>.</strong> 하지만 장기간에 걸쳐 실행되고 실제 작업을 완료하는 모든 에이전트(클로봇이든 사용자가 직접 구축한 것이든)는 <strong>메모리와</strong> <strong>검증이라는</strong> 두 가지 기술적 과제를 해결해야 합니다.</p>
<p><strong>메모리 문제는</strong> 여러 가지 방식으로 나타납니다:</p>
<ul>
<li><p>상담원은 작업 도중에 컨텍스트 창이 소진되어 반쯤 완료된 작업을 남겨둡니다.</p></li>
<li><p>전체 작업 목록을 보지 못하고 너무 일찍 '완료'를 선언합니다.</p></li>
<li><p>세션 간에 컨텍스트를 넘겨줄 수 없으므로 새 세션마다 처음부터 다시 시작합니다.</p></li>
</ul>
<p>이 모든 문제는 상담원에게 영구 메모리가 없다는 동일한 뿌리에서 비롯됩니다. 컨텍스트 창은 유한하고 세션 간 검색이 제한되며 상담원이 액세스할 수 있는 방식으로 진행 상황을 추적하지 못합니다.</p>
<p><strong>확인 문제는</strong> 다릅니다. 메모리가 작동하더라도 상담원은 기능이 실제로 엔드투엔드로 작동하는지 확인하지 않고 빠른 단위 테스트 후 작업을 완료로 표시합니다.</p>
<p>클로봇은 이 두 가지 문제를 모두 해결합니다. 세션 전반에 걸쳐 로컬로 메모리를 저장하고 모듈식 '스킬'을 사용하여 브라우저, 파일 및 외부 서비스를 자동화합니다. 이 접근 방식은 효과가 있습니다. 하지만 프로덕션 환경에는 적합하지 않습니다. 기업용으로 사용하려면 구조, 감사 가능성 및 보안이 필요한데, Clawdbot은 이러한 기능을 기본적으로 제공하지 않습니다.</p>
<p>이 문서에서는 프로덕션 지원 솔루션과 동일한 문제를 다룹니다.</p>
<p>메모리의 경우, 프로젝트를 검증 가능한 기능으로 나누는 초기화 에이전트와 깔끔한 핸드오프를 통해 한 번에 하나씩 작업하는 코딩 에이전트, 즉 <a href="https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents">Anthropic의 연구를</a> 기반으로 하는 <strong>두 가지 에이전트 아키텍처를</strong> 사용합니다. 세션 전반의 시맨틱 리콜을 위해 에이전트가 키워드가 아닌 의미로 검색할 수 있는 벡터 데이터베이스인 <a href="https://milvus.io/">Milvus를</a> 사용합니다.</p>
<p>검증을 위해 <strong>브라우저 자동화를</strong> 사용합니다. 단위 테스트를 신뢰하는 대신 에이전트는 실제 사용자가 하는 방식으로 기능을 테스트합니다.</p>
<p>개념을 살펴본 다음 <a href="https://github.com/langchain-ai/langgraph">LangGraph와</a> Milvus를 사용하여 실제로 구현된 모습을 보여드리겠습니다.</p>
<h2 id="How-the-Two-Agent-Architecture-Prevents-Context-Exhaustion" class="common-anchor-header">두 에이전트 아키텍처가 컨텍스트 고갈을 방지하는 방법<button data-href="#How-the-Two-Agent-Architecture-Prevents-Context-Exhaustion" class="anchor-icon" translate="no">
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
    </button></h2><p>모든 LLM에는 한 번에 처리할 수 있는 텍스트의 양을 제한하는 컨텍스트 창이 있습니다. 에이전트가 복잡한 작업을 수행하면 이 창은 코드, 오류 메시지, 대화 기록 및 문서로 가득 차게 됩니다. 창이 가득 차면 상담원은 작업을 중단하거나 이전 컨텍스트를 잊어버리기 시작합니다. 장기 실행 작업의 경우 이는 불가피한 현상입니다.</p>
<p>상담원에게 간단한 프롬프트가 주어졌다고 가정해 보세요: "claude.ai의 클론을 만들어 보세요." 이 프로젝트에는 인증, 채팅 인터페이스, 대화 기록, 스트리밍 응답 및 기타 수십 가지 기능이 필요합니다. 한 명의 에이전트가 모든 것을 한꺼번에 처리하려고 합니다. 채팅 인터페이스를 구현하는 도중에 컨텍스트 창이 가득 차게 됩니다. 세션은 반쯤 작성된 코드, 시도한 내용에 대한 문서화, 그리고 무엇이 작동하고 무엇이 작동하지 않는지 알 수 없는 상태로 끝납니다. 다음 세션은 엉망진창으로 이어집니다. 컨텍스트 압축을 사용하더라도 새 에이전트는 이전 세션이 무엇을 했는지 추측하고, 작성하지 않은 코드를 디버그하고, 어디서 다시 시작해야 할지 파악해야 합니다. 새로운 진전이 이루어지기 전에 시간이 낭비됩니다.</p>
<h3 id="The-Two-Fold-Agent-Solution" class="common-anchor-header">두 가지 에이전트 솔루션</h3><p>엔지니어링 게시물 <a href="https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents">"장기 실행 에이전트를 위한 효과적인 하네스"</a>에 설명된 Anthropic의 솔루션은 첫 번째 세션에는 <strong>초기화 프롬</strong> 프트를, 이후 세션에는 <strong>코딩 프롬프트를</strong> 사용하는 두 가지 프롬프트 모드를 사용하는 것입니다.</p>
<p>기술적으로 두 모드 모두 동일한 기본 에이전트, 시스템 프롬프트, 툴 및 하네스를 사용합니다. 유일한 차이점은 초기 사용자 프롬프트입니다. 하지만 서로 다른 역할을 수행하기 때문에 두 에이전트를 별개의 에이전트로 생각하는 것이 유용한 사고 모델입니다. 이를 두 에이전트 아키텍처라고 부릅니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/two_agent_p3_f9dd23fed9.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>이니셜라이저는 점진적 진행을 위한 환경을 설정합니다.</strong> 이니셜라이저는 모호한 요청을 받아 세 가지 작업을 수행합니다:</p>
<ul>
<li><p><strong>프로젝트를 구체적이고 검증 가능한 기능으로 나눕니다.</strong> "채팅 인터페이스 만들기"와 같은 모호한 요구 사항이 아니라 구체적이고 테스트 가능한 단계로 나눕니다: "사용자가 새 채팅 버튼을 클릭 → 사이드바에 새 대화가 표시됨 → 채팅 영역에 환영 상태가 표시됨"과 같은 구체적인 단계입니다. Anthropic의 claude.ai 클론 예시에는 이러한 기능이 200개 이상 있었습니다.</p></li>
<li><p><strong>진행 상황 추적 파일을 생성합니다.</strong> 이 파일은 모든 기능의 완료 상태를 기록하므로 모든 세션에서 완료된 작업과 남은 작업을 확인할 수 있습니다.</p></li>
<li><p><strong>설정 스크립트를 작성하고 초기 git 커밋을 수행합니다.</strong> <code translate="no">init.sh</code> 같은 스크립트를 사용하면 향후 세션에서 개발 환경을 빠르게 가동할 수 있습니다. git 커밋은 깨끗한 기준선을 설정합니다.</p></li>
</ul>
<p>이니셜라이저는 단순히 계획만 하는 것이 아닙니다. 향후 세션이 즉시 작업을 시작할 수 있는 인프라를 만듭니다.</p>
<p><strong>코딩 에이전트는</strong> 이후의 모든 세션을 처리합니다. It:</p>
<ul>
<li><p>진행 파일과 git 로그를 읽어 현재 상태를 파악합니다.</p></li>
<li><p>기본적인 엔드투엔드 테스트를 실행하여 앱이 여전히 작동하는지 확인합니다.</p></li>
<li><p>작업할 기능 하나를 선택합니다.</p></li>
<li><p>기능을 구현하고 철저하게 테스트한 후 설명 메시지와 함께 git에 커밋하고 진행 파일을 업데이트합니다.</p></li>
</ul>
<p>세션이 종료되면 코드베이스는 병합 가능한 상태가 됩니다. 큰 버그가 없고, 코드가 정돈되어 있으며, 문서가 명확합니다. 미완성된 작업도 없고 어떤 작업이 완료되었는지 알 수 없는 미스터리도 없습니다. 다음 세션에서는 이 세션이 멈춘 지점에서 정확히 시작됩니다.</p>
<h3 id="Use-JSON-for-Feature-Tracking-Not-Markdown" class="common-anchor-header">기능 추적에 마크다운이 아닌 JSON 사용</h3><p><strong>한 가지 주목할 만한 구현 세부 사항은 기능 목록은 마크다운이 아닌 JSON이어야 한다는 것입니다.</strong></p>
<p>JSON을 편집할 때 AI 모델은 특정 필드를 외과적으로 수정하는 경향이 있습니다. 마크다운을 편집할 때는 전체 섹션을 다시 작성하는 경우가 많습니다. 200개 이상의 기능 목록이 있는 마크다운 편집은 실수로 진행 상황 추적을 손상시킬 수 있습니다.</p>
<p>JSON 항목은 다음과 같습니다:</p>
<pre><code translate="no">json
{
  <span class="hljs-string">&quot;category&quot;</span>: <span class="hljs-string">&quot;functional&quot;</span>,
  <span class="hljs-string">&quot;description&quot;</span>: <span class="hljs-string">&quot;New chat button creates a fresh conversation&quot;</span>,
  <span class="hljs-string">&quot;steps&quot;</span>: [
    <span class="hljs-string">&quot;Navigate to main interface&quot;</span>,
    <span class="hljs-string">&quot;Click the &#x27;New Chat&#x27; button&quot;</span>,
    <span class="hljs-string">&quot;Verify a new conversation is created&quot;</span>,
    <span class="hljs-string">&quot;Check that chat area shows welcome state&quot;</span>,
    <span class="hljs-string">&quot;Verify conversation appears in sidebar&quot;</span>
  ],
  <span class="hljs-string">&quot;passes&quot;</span>: <span class="hljs-literal">false</span>
}
<button class="copy-code-btn"></button></code></pre>
<p>각 기능에는 명확한 확인 단계가 있습니다. <code translate="no">passes</code> 필드는 완료를 추적합니다. "기능이 누락되거나 버그가 발생할 수 있으므로 테스트를 제거하거나 편집하는 것은 허용되지 않습니다."와 같이 강력한 문구의 지침도 에이전트가 어려운 기능을 삭제하여 시스템을 게임하는 것을 방지하는 데 도움이 됩니다.</p>
<h2 id="How-Milvus-Gives-Agents-Semantic-Memory-Across-Sessions" class="common-anchor-header">Milvus가 세션 전반에 걸쳐 에이전트에게 시맨틱 메모리를 제공하는 방법<button data-href="#How-Milvus-Gives-Agents-Semantic-Memory-Across-Sessions" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>두 에이전트 아키텍처는 컨텍스트 고갈을 해결하지만 망각은 해결하지 못합니다.</strong> 세션 간에 깔끔한 핸드오프가 이루어지더라도 에이전트는 학습한 내용을 잊어버리게 됩니다. 진행 파일에 정확한 단어가 나타나지 않는 한 'JWT 새로 고침 토큰'이 '사용자 인증'과 관련이 있다는 사실을 기억할 수 없습니다. 프로젝트가 성장함에 따라 수백 개의 깃 커밋을 검색하는 속도가 느려집니다. 키워드 매칭은 사람이라면 분명한 연결을 놓치게 됩니다.</p>
<p><strong>이때 벡터 데이터베이스가 유용합니다.</strong> 벡터 데이터베이스는 텍스트를 저장하고 키워드를 검색하는 대신 텍스트를 의미의 수치 표현으로 변환합니다. "사용자 인증"을 검색하면 "JWT 새로 고침 토큰"과 "로그인 세션 처리"에 대한 항목을 찾습니다. 단어가 일치해서가 아니라 개념이 의미적으로 비슷하기 때문입니다. 상담원은 "전에 이런 것을 본 적이 있나요?"라고 질문하여 유용한 답변을 얻을 수 있습니다.</p>
<p><strong>실제로는 진행 기록과 git 커밋을 데이터베이스에 벡터로 임베드하는 방식으로 작동합니다.</strong> 코딩 세션이 시작되면 에이전트는 현재 작업으로 데이터베이스를 쿼리합니다. 데이터베이스는 이전에 시도한 작업, 성공한 작업, 실패한 작업 등 관련 기록을 밀리초 단위로 반환합니다. 에이전트는 처음부터 시작하지 않습니다. 컨텍스트에서 시작됩니다.</p>
<p><a href="https://milvus.io/"><strong>Milvus는</strong></a> <strong>이러한 사용 사례에 적합합니다.</strong> 오픈 소스이며 프로덕션 규모의 벡터 검색을 위해 설계되어 수십억 개의 벡터를 손쉽게 처리할 수 있습니다. 소규모 프로젝트나 로컬 개발의 경우, <a href="https://milvus.io/docs/milvus_lite.md">Milvus Lite를</a> SQLite와 같은 애플리케이션에 직접 임베드할 수 있습니다. 클러스터 설정이 필요하지 않습니다. 프로젝트가 커지면 코드를 변경하지 않고도 분산 Milvus로 마이그레이션할 수 있습니다. 임베딩을 생성할 때 <a href="https://www.sbert.net/">SentenceTransformer와</a> 같은 외부 모델을 사용해 세밀하게 제어하거나, <a href="https://milvus.io/docs/embeddings.md">내장된 임베딩 함수를</a> 참조하여 더 간단하게 설정할 수 있습니다. 또한 Milvus는 벡터 유사성과 기존 필터링을 결합한 <a href="https://milvus.io/docs/hybridsearch.md">하이브리드 검색을</a> 지원하므로 한 번의 호출로 "지난 주에 발생한 유사한 인증 문제 찾기"를 쿼리할 수 있습니다.</p>
<p><strong>이는 전송 문제도 해결합니다.</strong> 벡터 데이터베이스는 단일 세션 외부에서도 지속되므로 시간이 지남에 따라 지식이 축적됩니다. 세션 50에서는 세션 1부터 49까지 학습한 모든 내용에 액세스할 수 있습니다. 이 프로젝트는 기관의 기억을 개발합니다.</p>
<h2 id="Verifying-Completion-with-Automated-Testing" class="common-anchor-header">자동화된 테스트를 통한 완료 확인<button data-href="#Verifying-Completion-with-Automated-Testing" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>두 에이전트 아키텍처와 장기 기억을 사용하더라도 에이전트가 너무 일찍 승리를 선언할 수 있습니다. 이것이 바로 검증 문제입니다.</strong></p>
<p>다음은 일반적인 실패 모드입니다: 코딩 세션에서 기능을 완성하고 빠른 단위 테스트를 실행한 후 통과를 확인하고 <code translate="no">&quot;passes&quot;: false</code> 을 <code translate="no">&quot;passes&quot;: true</code> 으로 전환하지만 단위 테스트를 통과했다고 해서 기능이 실제로 작동한다는 의미는 아닙니다. API는 올바른 데이터를 반환하지만 CSS 버그로 인해 UI에 아무것도 표시되지 않을 수 있습니다. 진행 파일에는 "완료"라고 표시되지만 사용자에게는 아무것도 표시되지 않습니다.</p>
<p><strong>해결책은 상담원이 실제 사용자처럼 테스트하도록 하는 것입니다.</strong> 기능 목록의 각 기능에는 구체적인 검증 단계가 있습니다: "사용자가 새 채팅 버튼을 클릭 → 사이드바에 새 대화가 표시됨 → 채팅 영역에 환영 상태가 표시됨". 상담원은 이러한 단계를 말 그대로 검증해야 합니다. 코드 수준 테스트만 실행하는 대신 Puppeteer와 같은 브라우저 자동화 도구를 사용하여 실제 사용을 시뮬레이션합니다. 페이지를 열고, 버튼을 클릭하고, 양식을 채우고, 올바른 요소가 화면에 표시되는지 확인합니다. 전체 흐름을 통과해야만 에이전트는 기능이 완료된 것으로 표시합니다.</p>
<p><strong>이를 통해 단위 테스트에서 놓치는 문제를 포착할</strong> 수 있습니다. 채팅 기능에 완벽한 백엔드 로직과 올바른 API 응답이 있을 수 있습니다. 하지만 프론트엔드에서 응답을 렌더링하지 않으면 사용자는 아무것도 볼 수 없습니다. 브라우저 자동화는 결과를 스크린샷으로 찍어 화면에 표시되는 내용이 표시되어야 하는 내용과 일치하는지 확인할 수 있습니다. <code translate="no">passes</code> 필드는 이 기능이 실제로 엔드 투 엔드 방식으로 작동할 때만 <code translate="no">true</code> 으로 바뀝니다.</p>
<p><strong>하지만 한계가 있습니다.</strong> 일부 브라우저 기본 기능은 Puppeteer와 같은 도구로 자동화할 수 없습니다. 파일 선택기와 시스템 확인 대화 상자가 대표적인 예입니다. <a href="https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents">앤트로픽은</a> 브라우저 네이티브 경고 모달에 의존하는 기능은 에이전트가 Puppeteer를 통해 볼 수 없기 때문에 버그가 더 많이 발생하는 경향이 있다고 <a href="https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents">지적했습니다</a>. 현실적인 해결 방법은 이러한 제한 사항을 고려하여 디자인하는 것입니다. 가능하면 기본 대화 상자 대신 사용자 지정 UI 구성 요소를 사용하여 상담원이 기능 목록의 모든 확인 단계를 테스트할 수 있도록 하세요.</p>
<h2 id="Putting-It-Together-LangGraph-for-Session-State-Milvus-for-Long-Term-Memory" class="common-anchor-header">종합하기: 세션 상태를 위한 LangGraph, 장기 메모리를 위한 Milvus<button data-href="#Putting-It-Together-LangGraph-for-Session-State-Milvus-for-Long-Term-Memory" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>위의 개념은 두 가지 도구를 사용하여 작업 시스템에서 통합됩니다: 세션 상태를 위한 LangGraph와 장기 메모리를 위한 Milvus입니다.</strong> LangGraph는 작업 중인 기능, 완료된 작업, 다음 작업 등 단일 세션 내에서 일어나는 일을 관리합니다. Milvus는 이전에 수행한 작업, 발생한 문제, 해결 방법 등 세션 전반에 걸쳐 검색 가능한 기록을 저장합니다. 이를 통해 상담원에게 단기 기억과 장기 기억을 모두 제공합니다.</p>
<p><strong>이 구현에 대한 참고 사항:</strong> 아래 코드는 단순화된 데모입니다. 단일 스크립트에서 핵심 패턴을 보여 주지만 앞서 설명한 세션 분리를 완전히 복제하지는 않습니다. 프로덕션 환경에서는 각 코딩 세션이 다른 컴퓨터에서 또는 다른 시간에 별도의 호출이 될 수 있습니다. LangGraph의 <code translate="no">MemorySaver</code> 및 <code translate="no">thread_id</code> 은 호출 간에 상태를 유지하여 이를 가능하게 합니다. 재개 동작을 명확하게 확인하려면 스크립트를 한 번 실행하고 중지한 다음 동일한 <code translate="no">thread_id</code> 으로 다시 실행하면 됩니다. 두 번째 실행은 첫 번째 실행이 중단된 지점에서 시작됩니다.</p>
<p>Python</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> sentence_transformers <span class="hljs-keyword">import</span> SentenceTransformer
<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient
<span class="hljs-keyword">from</span> langgraph.checkpoint.memory <span class="hljs-keyword">import</span> MemorySaver
<span class="hljs-keyword">from</span> langgraph.graph <span class="hljs-keyword">import</span> StateGraph, START, END
<span class="hljs-keyword">from</span> typing <span class="hljs-keyword">import</span> TypedDict, Annotated
<span class="hljs-keyword">import</span> operator
<span class="hljs-keyword">import</span> subprocess
<span class="hljs-keyword">import</span> json

<span class="hljs-comment"># ==================== Initialization ====================</span>
embedding_model = SentenceTransformer(<span class="hljs-string">&#x27;all-MiniLM-L6-v2&#x27;</span>)
milvus_client = MilvusClient(<span class="hljs-string">&quot;./milvus_agent_memory.db&quot;</span>)

<span class="hljs-comment"># Create collection</span>
<span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> milvus_client.has_collection(<span class="hljs-string">&quot;agent_history&quot;</span>):
    milvus_client.create_collection(
        collection_name=<span class="hljs-string">&quot;agent_history&quot;</span>,
        dimension=<span class="hljs-number">384</span>,
        auto_id=<span class="hljs-literal">True</span>
    )

<span class="hljs-comment"># ==================== Milvus Operations ====================</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">retrieve_context</span>(<span class="hljs-params">query: <span class="hljs-built_in">str</span>, top_k: <span class="hljs-built_in">int</span> = <span class="hljs-number">3</span></span>):
    <span class="hljs-string">&quot;&quot;&quot;Retrieve relevant history from Milvus (core element: semantic retrieval)&quot;&quot;&quot;</span>
    query_vec = embedding_model.encode(query).tolist()
    results = milvus_client.search(
        collection_name=<span class="hljs-string">&quot;agent_history&quot;</span>,
        data=[query_vec],
        limit=top_k,
        output_fields=[<span class="hljs-string">&quot;content&quot;</span>]
    )
    <span class="hljs-keyword">if</span> results <span class="hljs-keyword">and</span> results[<span class="hljs-number">0</span>]:
        <span class="hljs-keyword">return</span> [hit[<span class="hljs-string">&quot;entity&quot;</span>][<span class="hljs-string">&quot;content&quot;</span>] <span class="hljs-keyword">for</span> hit <span class="hljs-keyword">in</span> results[<span class="hljs-number">0</span>]]
    <span class="hljs-keyword">return</span> []

<span class="hljs-keyword">def</span> <span class="hljs-title function_">save_progress</span>(<span class="hljs-params">content: <span class="hljs-built_in">str</span></span>):
    <span class="hljs-string">&quot;&quot;&quot;Save progress to Milvus (long-term memory)&quot;&quot;&quot;</span>
    embedding = embedding_model.encode(content).tolist()
    milvus_client.insert(
        collection_name=<span class="hljs-string">&quot;agent_history&quot;</span>,
        data=[{<span class="hljs-string">&quot;vector&quot;</span>: embedding, <span class="hljs-string">&quot;content&quot;</span>: content}]
    )

<span class="hljs-comment"># ==================== Core Element 1: Git Commit ====================</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">git_commit</span>(<span class="hljs-params">message: <span class="hljs-built_in">str</span></span>):
    <span class="hljs-string">&quot;&quot;&quot;Git commit (core element from the article)&quot;&quot;&quot;</span>
    <span class="hljs-keyword">try</span>:
        <span class="hljs-comment"># In a real project, actual Git commands would be executed</span>
        <span class="hljs-comment"># subprocess.run([&quot;git&quot;, &quot;add&quot;, &quot;.&quot;], check=True)</span>
        <span class="hljs-comment"># subprocess.run([&quot;git&quot;, &quot;commit&quot;, &quot;-m&quot;, message], check=True)</span>
        <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Git Commit] <span class="hljs-subst">{message}</span>&quot;</span>)
        <span class="hljs-keyword">return</span> <span class="hljs-literal">True</span>
    <span class="hljs-keyword">except</span> Exception <span class="hljs-keyword">as</span> e:
        <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Git Commit Failed] <span class="hljs-subst">{e}</span>&quot;</span>)
        <span class="hljs-keyword">return</span> <span class="hljs-literal">False</span>

<span class="hljs-comment"># ==================== Core Element 2: Test Verification ====================</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">run_tests</span>(<span class="hljs-params">feature: <span class="hljs-built_in">str</span></span>):
    <span class="hljs-string">&quot;&quot;&quot;Run tests (end-to-end testing emphasized in the article)&quot;&quot;&quot;</span>
    <span class="hljs-keyword">try</span>:
        <span class="hljs-comment"># In a real project, testing tools like Puppeteer would be called</span>
        <span class="hljs-comment"># Simplified to simulated testing here</span>
        <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Test Verification] Testing feature: <span class="hljs-subst">{feature}</span>&quot;</span>)
        <span class="hljs-comment"># Simulated test result</span>
        test_passed = <span class="hljs-literal">True</span>  <span class="hljs-comment"># In practice, this would return actual test results</span>
        <span class="hljs-keyword">if</span> test_passed:
            <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Test Passed] <span class="hljs-subst">{feature}</span>&quot;</span>)
        <span class="hljs-keyword">return</span> test_passed
    <span class="hljs-keyword">except</span> Exception <span class="hljs-keyword">as</span> e:
        <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Test Failed] <span class="hljs-subst">{e}</span>&quot;</span>)
        <span class="hljs-keyword">return</span> <span class="hljs-literal">False</span>

<span class="hljs-comment"># ==================== State Definition ====================</span>
<span class="hljs-keyword">class</span> <span class="hljs-title class_">AgentState</span>(<span class="hljs-title class_ inherited__">TypedDict</span>):
    messages: Annotated[<span class="hljs-built_in">list</span>, operator.add]
    features: <span class="hljs-built_in">list</span>  <span class="hljs-comment"># All features list</span>
    completed_features: <span class="hljs-built_in">list</span>  <span class="hljs-comment"># Completed features</span>
    current_feature: <span class="hljs-built_in">str</span>  <span class="hljs-comment"># Currently processing feature</span>
    session_count: <span class="hljs-built_in">int</span>  <span class="hljs-comment"># Session counter</span>

<span class="hljs-comment"># ==================== Two-Agent Nodes ====================</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">initialize_node</span>(<span class="hljs-params">state: AgentState</span>):
    <span class="hljs-string">&quot;&quot;&quot;Initializer Agent: Generate feature list and set up work environment&quot;&quot;&quot;</span>
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n========== Initializer Agent Started ==========&quot;</span>)
    
    <span class="hljs-comment"># Generate feature list (in practice, a detailed feature list would be generated based on requirements)</span>
    features = [
        <span class="hljs-string">&quot;Implement user registration&quot;</span>,
        <span class="hljs-string">&quot;Implement user login&quot;</span>,
        <span class="hljs-string">&quot;Implement password reset&quot;</span>,
        <span class="hljs-string">&quot;Implement user profile editing&quot;</span>,
        <span class="hljs-string">&quot;Implement session management&quot;</span>
    ]
    
    <span class="hljs-comment"># Save initialization info to Milvus</span>
    init_summary = <span class="hljs-string">f&quot;Project initialized with <span class="hljs-subst">{<span class="hljs-built_in">len</span>(features)}</span> features&quot;</span>
    save_progress(init_summary)
    
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Initialization Complete] Feature list: <span class="hljs-subst">{features}</span>&quot;</span>)
    
    <span class="hljs-keyword">return</span> {
        **state,
        <span class="hljs-string">&quot;features&quot;</span>: features,
        <span class="hljs-string">&quot;completed_features&quot;</span>: [],
        <span class="hljs-string">&quot;current_feature&quot;</span>: features[<span class="hljs-number">0</span>] <span class="hljs-keyword">if</span> features <span class="hljs-keyword">else</span> <span class="hljs-string">&quot;&quot;</span>,
        <span class="hljs-string">&quot;session_count&quot;</span>: <span class="hljs-number">0</span>,
        <span class="hljs-string">&quot;messages&quot;</span>: [init_summary]
    }

<span class="hljs-keyword">def</span> <span class="hljs-title function_">code_node</span>(<span class="hljs-params">state: AgentState</span>):
    <span class="hljs-string">&quot;&quot;&quot;Coding Agent: Implement, test, commit (core loop node)&quot;&quot;&quot;</span>
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;\n========== Coding Agent Session #<span class="hljs-subst">{state[<span class="hljs-string">&#x27;session_count&#x27;</span>] + <span class="hljs-number">1</span>}</span> ==========&quot;</span>)
    
    current_feature = state[<span class="hljs-string">&quot;current_feature&quot;</span>]
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Current Task] <span class="hljs-subst">{current_feature}</span>&quot;</span>)
    
    <span class="hljs-comment"># ===== Core Element 3: Retrieve history from Milvus (cross-session memory) =====</span>
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Retrieving History] Querying experiences related to &#x27;<span class="hljs-subst">{current_feature}</span>&#x27;...&quot;</span>)
    context = retrieve_context(current_feature)
    <span class="hljs-keyword">if</span> context:
        <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Retrieval Results] Found <span class="hljs-subst">{<span class="hljs-built_in">len</span>(context)}</span> relevant records:&quot;</span>)
        <span class="hljs-keyword">for</span> i, ctx <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(context, <span class="hljs-number">1</span>):
            <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;  <span class="hljs-subst">{i}</span>. <span class="hljs-subst">{ctx[:<span class="hljs-number">60</span>]}</span>...&quot;</span>)
    <span class="hljs-keyword">else</span>:
        <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;[Retrieval Results] No relevant history (first time implementing this type of feature)&quot;</span>)
    
    <span class="hljs-comment"># ===== Step 1: Implement feature =====</span>
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Starting Implementation] <span class="hljs-subst">{current_feature}</span>&quot;</span>)
    <span class="hljs-comment"># In practice, an LLM would be called to generate code</span>
    implementation_result = <span class="hljs-string">f&quot;Implemented feature: <span class="hljs-subst">{current_feature}</span>&quot;</span>
    
    <span class="hljs-comment"># ===== Step 2: Test verification (core element) =====</span>
    test_passed = run_tests(current_feature)
    <span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> test_passed:
        <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Session End] Tests did not pass, fixes needed&quot;</span>)
        <span class="hljs-keyword">return</span> state  <span class="hljs-comment"># Don&#x27;t proceed if tests fail</span>
    
    <span class="hljs-comment"># ===== Step 3: Git commit (core element) =====</span>
    commit_message = <span class="hljs-string">f&quot;feat: <span class="hljs-subst">{current_feature}</span>&quot;</span>
    git_commit(commit_message)
    
    <span class="hljs-comment"># ===== Step 4: Update progress file =====</span>
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Updating Progress] Marking feature as complete&quot;</span>)
    
    <span class="hljs-comment"># ===== Step 5: Save to Milvus long-term memory =====</span>
    progress_record = <span class="hljs-string">f&quot;Completed feature: <span class="hljs-subst">{current_feature}</span> | Commit message: <span class="hljs-subst">{commit_message}</span> | Test status: passed&quot;</span>
    save_progress(progress_record)
    
    <span class="hljs-comment"># ===== Step 6: Update state and prepare for next feature =====</span>
    new_completed = state[<span class="hljs-string">&quot;completed_features&quot;</span>] + [current_feature]
    remaining_features = [f <span class="hljs-keyword">for</span> f <span class="hljs-keyword">in</span> state[<span class="hljs-string">&quot;features&quot;</span>] <span class="hljs-keyword">if</span> f <span class="hljs-keyword">not</span> <span class="hljs-keyword">in</span> new_completed]
    
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Progress] Completed: <span class="hljs-subst">{<span class="hljs-built_in">len</span>(new_completed)}</span>/<span class="hljs-subst">{<span class="hljs-built_in">len</span>(state[<span class="hljs-string">&#x27;features&#x27;</span>])}</span>&quot;</span>)
    <span class="hljs-comment"># ===== Core Element 4: Session end (clear session boundary) =====</span>
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Session End] Codebase is in clean state, safe to interrupt\n&quot;</span>)
    
    <span class="hljs-keyword">return</span> {
        **state,
        <span class="hljs-string">&quot;completed_features&quot;</span>: new_completed,
        <span class="hljs-string">&quot;current_feature&quot;</span>: remaining_features[<span class="hljs-number">0</span>] <span class="hljs-keyword">if</span> remaining_features <span class="hljs-keyword">else</span> <span class="hljs-string">&quot;&quot;</span>,
        <span class="hljs-string">&quot;session_count&quot;</span>: state[<span class="hljs-string">&quot;session_count&quot;</span>] + <span class="hljs-number">1</span>,
        <span class="hljs-string">&quot;messages&quot;</span>: [implementation_result]
    }

<span class="hljs-comment"># ==================== Core Element 3: Loop Control ====================</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">should_continue</span>(<span class="hljs-params">state: AgentState</span>):
    <span class="hljs-string">&quot;&quot;&quot;Determine whether to continue to next feature (incremental loop development)&quot;&quot;&quot;</span>
    <span class="hljs-keyword">if</span> state[<span class="hljs-string">&quot;current_feature&quot;</span>] <span class="hljs-keyword">and</span> state[<span class="hljs-string">&quot;current_feature&quot;</span>] != <span class="hljs-string">&quot;&quot;</span>:
        <span class="hljs-keyword">return</span> <span class="hljs-string">&quot;code&quot;</span>  <span class="hljs-comment"># Continue to next feature</span>
    <span class="hljs-keyword">else</span>:
        <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n========== All Features Complete ==========&quot;</span>)
        <span class="hljs-keyword">return</span> END

<span class="hljs-comment"># ==================== Build Workflow ====================</span>
workflow = StateGraph(AgentState)

<span class="hljs-comment"># Add nodes</span>
workflow.add_node(<span class="hljs-string">&quot;initialize&quot;</span>, initialize_node)
workflow.add_node(<span class="hljs-string">&quot;code&quot;</span>, code_node)

<span class="hljs-comment"># Add edges</span>
workflow.add_edge(START, <span class="hljs-string">&quot;initialize&quot;</span>)
workflow.add_edge(<span class="hljs-string">&quot;initialize&quot;</span>, <span class="hljs-string">&quot;code&quot;</span>)

<span class="hljs-comment"># Add conditional edges (implement loop)</span>
workflow.add_conditional_edges(
    <span class="hljs-string">&quot;code&quot;</span>,
    should_continue,
    {
        <span class="hljs-string">&quot;code&quot;</span>: <span class="hljs-string">&quot;code&quot;</span>,  <span class="hljs-comment"># Continue loop</span>
        END: END  <span class="hljs-comment"># End</span>
    }
)

<span class="hljs-comment"># Compile workflow (using MemorySaver as checkpointer)</span>
app = workflow.<span class="hljs-built_in">compile</span>(checkpointer=MemorySaver())

<span class="hljs-comment"># ==================== Usage Example: Demonstrating Cross-Session Recovery ====================</span>
<span class="hljs-keyword">if</span> __name__ == <span class="hljs-string">&quot;__main__&quot;</span>:
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;=&quot;</span> * <span class="hljs-number">60</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Demo Scenario: Multi-Session Development for Long-Running Agents&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;=&quot;</span> * <span class="hljs-number">60</span>)
    
    <span class="hljs-comment"># ===== Session 1: Initialize + complete first 2 features =====</span>
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n[Scenario 1] First launch: Complete first 2 features&quot;</span>)
    config = {<span class="hljs-string">&quot;configurable&quot;</span>: {<span class="hljs-string">&quot;thread_id&quot;</span>: <span class="hljs-string">&quot;project_001&quot;</span>}}
    
    result = app.invoke({
        <span class="hljs-string">&quot;messages&quot;</span>: [],
        <span class="hljs-string">&quot;features&quot;</span>: [],
        <span class="hljs-string">&quot;completed_features&quot;</span>: [],
        <span class="hljs-string">&quot;current_feature&quot;</span>: <span class="hljs-string">&quot;&quot;</span>,
        <span class="hljs-string">&quot;session_count&quot;</span>: <span class="hljs-number">0</span>
    }, config)
    
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n&quot;</span> + <span class="hljs-string">&quot;=&quot;</span> * <span class="hljs-number">60</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;[Simulated Scenario] Developer manually interrupts (Ctrl+C) or context window exhausted&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;=&quot;</span> * <span class="hljs-number">60</span>)
    
    <span class="hljs-comment"># ===== Session 2: Restore state from checkpoint =====</span>
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n[Scenario 2] New session starts: Continue from last interruption&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Using the same thread_id, LangGraph automatically restores from checkpoint...&quot;</span>)
    
    <span class="hljs-comment"># Using the same thread_id, LangGraph will automatically restore state from checkpoint</span>
    result = app.invoke({
        <span class="hljs-string">&quot;messages&quot;</span>: [],
        <span class="hljs-string">&quot;features&quot;</span>: [],
        <span class="hljs-string">&quot;completed_features&quot;</span>: [],
        <span class="hljs-string">&quot;current_feature&quot;</span>: <span class="hljs-string">&quot;&quot;</span>,
        <span class="hljs-string">&quot;session_count&quot;</span>: <span class="hljs-number">0</span>
    }, config)
    
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n&quot;</span> + <span class="hljs-string">&quot;=&quot;</span> * <span class="hljs-number">60</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Demo Complete!&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;=&quot;</span> * <span class="hljs-number">60</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\nKey Takeaways:&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;1. ✅ Two-Agent Architecture (initialize + code)&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;2. ✅ Incremental Loop Development (conditional edges control loop)&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;3. ✅ Git Commits (commit after each feature)&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;4. ✅ Test Verification (end-to-end testing)&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;5. ✅ Session Management (clear session boundaries)&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;6. ✅ Cross-Session Recovery (thread_id + checkpoint)&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;7. ✅ Semantic Retrieval (Milvus long-term memory)&quot;</span>)
  

**The key insight <span class="hljs-keyword">is</span> <span class="hljs-keyword">in</span> the last part.** By using the same `thread_id`, LangGraph automatically restores the checkpoint <span class="hljs-keyword">from</span> the previous session. Session <span class="hljs-number">2</span> picks up exactly where session <span class="hljs-number">1</span> stopped — no manual state transfer, no lost progress.

<button class="copy-code-btn"></button></code></pre>
<h3 id="Conclusion" class="common-anchor-header">결론</h3><p>AI 에이전트는 지속적인 메모리와 적절한 검증이 부족하기 때문에 장기 실행 작업에 실패합니다. Clawdbot은 이러한 문제를 해결하여 입소문이 났지만, 그 접근 방식은 프로덕션에 사용할 준비가 되어 있지 않습니다.</p>
<p>이 문서에서는 세 가지 솔루션을 다루었습니다:</p>
<ul>
<li><p><strong>두 에이전트 아키텍처:</strong> 이니셜라이저가 프로젝트를 검증 가능한 기능으로 나누고 코딩 에이전트가 깔끔한 핸드오프를 통해 한 번에 하나씩 작업합니다. 이렇게 하면 컨텍스트 고갈을 방지하고 진행 상황을 추적할 수 있습니다.</p></li>
<li><p><strong>시맨틱 메모리를 위한 벡터 데이터베이스:</strong> <a href="https://milvus.io/">Milvus는</a> 진행 상황 기록과 깃 커밋을 임베딩으로 저장하므로 에이전트는 키워드가 아닌 의미로 검색할 수 있습니다. 세션 50은 세션 1에서 학습한 내용을 기억합니다.</p></li>
<li><p><strong>실제 검증을 위한 브라우저 자동화:</strong> 단위 테스트를 통해 코드가 실행되는지 확인합니다. Puppeteer는 사용자가 화면에 표시되는 내용을 테스트하여 기능이 실제로 작동하는지 확인합니다.</p></li>
</ul>
<p>이러한 패턴은 소프트웨어 개발에만 국한되지 않습니다. 과학 연구, 재무 모델링, 법률 문서 검토 등 여러 세션에 걸쳐 진행되며 신뢰할 수 있는 핸드오프가 필요한 모든 작업에 활용할 수 있습니다.</p>
<p>핵심 원칙</p>
<ul>
<li><p>이니셜라이저를 사용해 작업을 검증 가능한 덩어리로 나누기</p></li>
<li><p>체계적이고 기계가 읽을 수 있는 형식으로 진행 상황을 추적하세요.</p></li>
<li><p>시맨틱 검색을 위해 경험을 벡터 데이터베이스에 저장합니다.</p></li>
<li><p>단위 테스트뿐만 아니라 실제 테스트를 통해 완료 여부 확인</p></li>
<li><p>세션 경계를 깔끔하게 디자인하여 작업을 안전하게 일시 중지하고 다시 시작할 수 있습니다.</p></li>
</ul>
<p>도구가 존재합니다. 패턴은 입증되었습니다. 남은 것은 적용하는 것입니다.</p>
<p><strong>시작할 준비가 되셨나요?</strong></p>
<ul>
<li><p>상담원에게 시맨틱 메모리를 추가하기 위한 <a href="https://milvus.io/">Milvus</a> 및 <a href="https://milvus.io/docs/milvus_lite.md">Milvus Lite를</a> 살펴보세요.</p></li>
<li><p>세션 상태 관리를 위한 LangGraph 살펴보기</p></li>
<li><p>장기 실행 에이전트 하네스에 대한 <a href="https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents">Anthropic의 전체 연구</a> 읽기</p></li>
</ul>
<p><strong>질문이 있거나 구축 중인 내용을 공유하고 싶으신가요?</strong></p>
<ul>
<li><p><a href="https://milvus.io/slack">Milvus Slack 커뮤니티에</a> 가입하여 다른 개발자들과 소통하세요.</p></li>
<li><p><a href="https://milvus.io/office-hours">Milvus 오피스 아워에</a> 참석하여 팀과 실시간 Q&amp;A를 진행하세요.</p></li>
</ul>
