---
id: harness-engineering-ai-agents.md
title: '하네스 엔지니어링: 실행 계층 AI 에이전트가 실제로 필요로 하는 것'
author: Min Yin
date: 2026-4-9
cover: assets.zilliz.com/05842e3a_b21b_41c9_9d29_13b8d7afa211_428ab449a7.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  harness engineering, AI agent infrastructure, hybrid search, Milvus 2.6,
  Sparse-BM25
meta_title: |
  What Is Harness Engineering for AI Agents? | Milvus
desc: >-
  하네스 엔지니어링은 자율 AI 에이전트를 중심으로 실행 환경을 구축합니다. 하네스 엔지니어링의 정의, OpenAI의 사용 방법, 하이브리드
  검색이 필요한 이유에 대해 알아보세요.
origin: 'https://milvus.io/blog/harness-engineering-ai-agents.md'
---
<p>Mitchell Hashimoto는 해시코프를 설립하고 Terraform을 공동 개발했습니다. 2026년 2월, 그는 AI 에이전트와 함께 일하면서 개발한 습관, 즉 에이전트가 실수를 할 때마다 에이전트의 환경을 영구적으로 수정하는 방법을 설명하는 <a href="https://mitchellh.com/writing/my-ai-adoption-journey">블로그 게시물을</a> 올렸습니다. 그는 이를 "하네스 엔지니어링"이라고 불렀습니다. 몇 주 만에 <a href="https://openai.com/index/harness-engineering/">OpenAI와</a> <a href="https://www.anthropic.com/engineering/harness-design-long-running-apps">Anthropic은</a> 이 아이디어를 확장한 엔지니어링 기사를 발표했습니다. <em>하네스 엔지니어링이라는</em> 용어가 등장했습니다.</p>
<p>이 용어는 <a href="https://zilliz.com/glossary/ai-agents">AI 에이전트를</a> 구축하는 모든 엔지니어가 이미 직면한 문제를 명명했기 때문에 큰 반향을 불러일으켰습니다. <a href="https://zilliz.com/glossary/prompt-as-code-(prompt-engineering)">프롬프트 엔지니어링은</a> 더 나은 단일 턴 결과물을 제공합니다. 컨텍스트 엔지니어링은 모델이 보는 것을 관리합니다. 하지만 에이전트가 몇 시간 동안 자율적으로 실행되어 감독 없이 수백 가지 결정을 내릴 때 어떤 일이 발생하는지는 다루지 못합니다. 하네스 엔지니어링은 이러한 격차를 메우며, 거의 항상 하이브리드 검색(하이브리드 전체 텍스트 및 시맨틱 검색)에 의존하여 작동합니다.</p>
<h2 id="What-Is-Harness-Engineering" class="common-anchor-header">하네스 엔지니어링이란?<button data-href="#What-Is-Harness-Engineering" class="anchor-icon" translate="no">
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
    </button></h2><p>하네스 엔지니어링은 자율 AI 에이전트를 중심으로 실행 환경을 설계하는 분야입니다. 이는 에이전트가 호출할 수 있는 도구, 정보를 얻는 위치, 자체 결정을 검증하는 방법, 중단해야 하는 시점을 정의합니다.</p>
<p>이것이 왜 중요한지 이해하려면 AI 에이전트 개발의 세 가지 계층을 고려하세요:</p>
<table>
<thead>
<tr><th>레이어</th><th>최적화 대상</th><th>범위</th><th>예제</th></tr>
</thead>
<tbody>
<tr><td><strong>프롬프트 엔지니어링</strong></td><td>모델에게 하는 말</td><td>단일 교환</td><td>몇 가지 예시, 생각의 연쇄 프롬프트</td></tr>
<tr><td><strong>컨텍스트 엔지니어링</strong></td><td>모델이 볼 수 있는 내용</td><td><a href="https://zilliz.com/glossary/context-window">컨텍스트 창</a></td><td>문서 검색, 히스토리 압축</td></tr>
<tr><td><strong>하네스 엔지니어링</strong></td><td>에이전트가 작동하는 세계</td><td>다시간 자율 실행</td><td>도구, 유효성 검사 로직, 아키텍처 제약 조건</td></tr>
</tbody>
</table>
<p><strong>프롬프트 엔지니어링은</strong> 문구, 구조, 예시 등 단일 교환의 품질을 최적화합니다. 하나의 대화, 하나의 결과물.</p>
<p><strong>컨텍스트 엔지니어링은</strong> 검색할 문서, 히스토리 압축 방법, 컨텍스트 창에 맞는 항목과 삭제할 항목 등 모델이 한 번에 볼 수 있는 정보의 양을 관리합니다.</p>
<p><strong>하네스 엔지니어링은</strong> 에이전트가 활동하는 세계를 구축합니다. 도구, 지식 소스, 유효성 검사 로직, 아키텍처 제약 등 에이전트가 사람의 감독 없이도 수백 가지의 의사 결정을 안정적으로 실행할 수 있는지를 결정하는 모든 것을 구축합니다.</p>
<p>
 <span class="img-wrapper">
   <img translate="no" src="https://assets.zilliz.com/harness_engineering_ai_agents_4_2f4bc35890.png" alt="Three layers of AI agent development: Prompt Engineering optimizes what you say, Context Engineering manages what the model sees, and Harness Engineering designs the execution environment" class="doc-image" id="three-layers-of-ai-agent-development:-prompt-engineering-optimizes-what-you-say,-context-engineering-manages-what-the-model-sees,-and-harness-engineering-designs-the-execution-environment" />
   <span>AI 에이전트 개발의 세 가지 레이어: 프롬프트 엔지니어링은 사용자가 말하는 것을 최적화하고, 컨텍스트 엔지니어링은 모델이 보는 것을 관리하며, 하네스 엔지니어링은 실행 환경을 설계합니다.</span> </span></p>
<p>처음 두 계층은 한 턴의 품질을 결정합니다. 세 번째 레이어는 에이전트가 사용자가 지켜보는 가운데서도 몇 시간 동안 작동할 수 있는지 여부를 결정합니다.</p>
<p>이 두 가지 접근 방식은 경쟁하는 것이 아닙니다. 발전 과정입니다. 에이전트 역량이 성장함에 따라 동일한 팀이 단일 프로젝트 내에서 이 세 가지를 모두 진행하는 경우가 많습니다.</p>
<h2 id="How-OpenAI-Used-Harness-Engineering-to-Build-a-Million-Line-Codebase-and-Lessons-They-Learnt" class="common-anchor-header">OpenAI가 하네스 엔지니어링을 사용하여 백만 줄의 코드베이스를 구축한 방법과 그 과정에서 얻은 교훈<button data-href="#How-OpenAI-Used-Harness-Engineering-to-Build-a-Million-Line-Codebase-and-Lessons-They-Learnt" class="anchor-icon" translate="no">
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
    </button></h2><p>OpenAI는 하네스 엔지니어링을 구체적으로 살펴볼 수 있는 내부 실험을 진행했습니다. 엔지니어링 블로그 게시물 <a href="https://openai.com/index/harness-engineering/">'하네스 엔지니어링'</a>에서 이를 설명했습니다: <a href="https://openai.com/index/harness-engineering/">에이전트 우선 세계에서 코덱스 활용하기"에서 설명합니다.</a> 세 명으로 구성된 팀은 2025년 8월 말에 빈 리포지토리로 시작했습니다. 5개월 동안 직접 코드를 작성하지 않았고, 모든 라인은 OpenAI의 AI 기반 코딩 에이전트인 Codex를 통해 생성되었습니다. 그 결과 100만 줄의 프로덕션 코드와 1,500개의 병합된 풀 리퀘스트가 생성되었습니다.</p>
<p>흥미로운 부분은 결과물이 아닙니다. 그들이 해결한 네 가지 문제와 이를 해결하기 위해 구축한 하네스 레이어 솔루션입니다.</p>
<h3 id="Problem-1-No-Shared-Understanding-of-the-Codebase" class="common-anchor-header">문제 1: 코드베이스에 대한 공유된 이해 부족</h3><p>에이전트는 어떤 추상화 계층을 사용해야 할까요? 명명 규칙은 무엇인가요? 지난 주 아키텍처 논의는 어디까지 진행되었나요? 답을 찾지 못한 에이전트는 추측과 오답을 반복했습니다.</p>
<p>첫 번째 본능은 모든 관습, 규칙 및 과거 결정이 포함된 단일 파일( <code translate="no">AGENTS.md</code> )이었습니다. 네 가지 이유로 실패했습니다. 컨텍스트가 부족하고 부풀려진 지침 파일이 실제 작업을 방해했습니다. 모든 것을 중요하다고 표시하면 중요한 것은 아무것도 없습니다. 문서가 썩습니다. 2주 차의 규칙이 8주 차에는 잘못된 것이 됩니다. 그리고 밋밋한 문서는 기계적으로 검증할 수 없습니다.</p>
<p>해결 방법: <code translate="no">AGENTS.md</code> 을 100줄로 줄이세요. 규칙이 아니라 지도입니다. 이 지도는 디자인 결정, 실행 계획, 제품 사양 및 참조 문서가 포함된 구조화된 <code translate="no">docs/</code> 디렉터리를 가리킵니다. 린터와 CI는 교차 링크가 그대로 유지되는지 확인합니다. 에이전트는 정확히 필요한 곳으로 이동합니다.</p>
<p>기본 원칙은 런타임에 컨텍스트에 맞지 않는 것이 있으면 에이전트에게 존재하지 않는다는 것입니다.</p>
<h3 id="Problem-2-Human-QA-Couldnt-Keep-Pace-with-Agent-Output" class="common-anchor-header">문제 2: 인적 QA가 에이전트 출력을 따라잡지 못함</h3><p>팀은 크롬 개발자 도구 프로토콜을 코덱스에 연결했습니다. 에이전트는 UI 경로를 스크린샷하고, 런타임 이벤트를 관찰하고, LogQL로 로그를 쿼리하고, PromQL로 메트릭을 쿼리할 수 있었습니다. 구체적인 임계값을 설정했는데, 서비스가 800밀리초 이내에 시작되어야 작업이 완료된 것으로 간주했습니다. 코덱스 작업은 보통 엔지니어가 잠자는 동안에도 6시간 이상 실행되었습니다.</p>
<h3 id="Problem-3-Architectural-Drift-Without-Constraints" class="common-anchor-header">문제 3: 제약이 없는 아키텍처 드리프트</h3><p>가드레일이 없으면 에이전트는 잘못된 패턴을 포함하여 리포지토리에서 발견되는 모든 패턴을 재현했습니다.</p>
<p>해결 방법: 단일 종속성 방향(유형 → 구성 → 리포지토리 → 서비스 → 런타임 → UI)이 적용된 엄격한 계층형 아키텍처. 사용자 정의 린터는 수정 명령어를 인라인으로 포함하는 오류 메시지를 통해 이러한 규칙을 기계적으로 적용했습니다.</p>
<p>
 <span class="img-wrapper">
   <img translate="no" src="https://assets.zilliz.com/harness_engineering_ai_agents_3_f0fc3c9e92.png" alt="Strict layered architecture with one-way dependency validation: Types at the base, UI at the top, custom linters enforce rules with inline fix suggestions" class="doc-image" id="strict-layered-architecture-with-one-way-dependency-validation:-types-at-the-base,-ui-at-the-top,-custom-linters-enforce-rules-with-inline-fix-suggestions" />
   <span>단방향 종속성 유효성 검사를 통한 엄격한 계층 구조: 기본에는 유형, 맨 위에는 UI, 사용자 지정 린터는 인라인 수정 제안을 통해 규칙을 적용합니다.</span> </span></p>
<p>인간 팀에서 이러한 제약은 보통 회사가 수백 명의 엔지니어로 확장될 때 발생합니다. 코딩 에이전트의 경우, 이는 처음부터 필수 조건입니다. 에이전트가 제약 없이 빠르게 움직일수록 아키텍처 드리프트는 더 심해집니다.</p>
<h3 id="Problem-4-Silent-Technical-Debt" class="common-anchor-header">문제 4: 조용한 기술 부채</h3><p>해결책: 프로젝트의 핵심 원칙을 리포지토리에 인코딩한 다음 일정에 따라 백그라운드 코덱스 작업을 실행하여 편차를 스캔하고 리팩토링 PR을 제출하세요. 대부분 1분 이내에 자동으로 병합되며, 주기적인 계산이 아닌 소량의 지속적인 지불이 이루어집니다.</p>
<h2 id="Why-AI-Agents-Cant-Grade-Their-Own-Work" class="common-anchor-header">AI 에이전트가 스스로 작업을 채점할 수 없는 이유<button data-href="#Why-AI-Agents-Cant-Grade-Their-Own-Work" class="anchor-icon" translate="no">
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
    </button></h2><p>OpenAI의 실험은 하네스 엔지니어링이 작동한다는 것을 증명했습니다. 하지만 별도의 연구를 통해 에이전트가 자신의 결과물을 체계적으로 평가하지 못하는 실패 모드가 드러났습니다.</p>
<p>이 문제는 두 가지 형태로 나타납니다.</p>
<p><strong>컨텍스트 불안.</strong> 컨텍스트 창이 가득 차면 상담원은 작업이 완료되었기 때문이 아니라 창 한도가 다가오는 것을 감지하여 작업을 조기에 마무리하기 시작합니다. AI 코딩 에이전트 Devin의 개발팀인 Cognition은 Claude Sonnet 4.5용으로 Devin을 재구축하면서 <a href="https://cognition.ai/blog/devin-sonnet-4-5-lessons-and-challenges">이 동작을 문서화했는데</a>, 모델이 자체 컨텍스트 창을 인식하고 실제로 공간이 부족해지기 훨씬 전에 지름길을 택하기 시작했습니다.</p>
<p>이 문제를 해결한 것은 순수한 하네스 엔지니어링이었습니다. 100만 토큰 컨텍스트 베타를 활성화했지만 실제 사용량을 20만 토큰으로 제한하여 모델이 충분한 런웨이가 있다고 믿도록 속였습니다. 불안감은 사라졌습니다. 모델을 변경할 필요 없이 더 스마트한 환경만 있으면 됩니다.</p>
<p>가장 일반적인 완화 방법은 기록을 요약하고 동일한 에이전트가 압축된 컨텍스트를 계속 사용하도록 하는 압축입니다. 이렇게 하면 연속성은 유지되지만 근본적인 행동이 제거되지는 않습니다. 또 다른 대안은 컨텍스트 재설정입니다. 창을 지우고 새 인스턴스를 스핀업한 다음 구조화된 아티팩트를 통해 상태를 핸드오프하는 것입니다. 이렇게 하면 불안 트리거가 완전히 제거되지만 완전한 핸드오프 문서가 필요하므로 아티팩트에 공백이 생기면 새 상담원의 이해에 공백이 생길 수 있습니다.</p>
<p><strong>자기 평가 편향.</strong> 상담원은 자신의 성과를 스스로 평가할 때 높은 점수를 줍니다. 객관적인 합격/불합격 기준이 있는 작업에서도 상담원은 문제를 발견하고도 심각하지 않다고 스스로 판단하여 실패해야 할 작업을 승인합니다.</p>
<p>이 수정 사항은 GAN(생성적 적대 신경망)을 차용하여 생성자와 평가자를 완전히 분리합니다. GAN에서는 두 개의 신경망(하나는 생성, 하나는 판단)이 경쟁하며, 이러한 적대적 긴장감이 품질을 향상시킵니다. <a href="https://milvus.io/blog/openagents-milvus-how-to-build-smarter-multi-agent-systems-that-share-memory.md">멀티 에이전트 시스템에도</a> 동일한 역학 관계가 적용됩니다.</p>
<p>앤트로픽은 기획자, 생성자, 평가자 등 3명의 에이전트가 2D 레트로 게임 엔진을 구축하는 작업을 수행하는 단독 에이전트와 비교하여 이를 테스트했습니다. 전체 실험은 <a href="https://www.anthropic.com/engineering/harness-design-long-running-apps">"장기적인 애플리케이션 개발을 위한 하네스 설계"</a> (Anthropic, 2026)에 설명되어 있습니다. 플래너는 짧은 프롬프트를 전체 제품 사양으로 확장하여 구현 세부 사항을 의도적으로 지정하지 않은 상태로 두어 초기의 과도한 사양이 다운스트림 오류로 이어지도록 합니다. 생성자는 스프린트에서 기능을 구현하지만 코드를 작성하기 전에 평가자와 스프린트 계약, 즉 "완료"에 대한 공유된 정의를 체결합니다. 평가자는 Playwright(Microsoft의 오픈 소스 브라우저 자동화 프레임워크)를 사용하여 실제 사용자처럼 애플리케이션을 클릭하고 UI, API 및 데이터베이스 동작을 테스트합니다. 실패하면 스프린트는 실패한 것입니다.</p>
<p>단독 에이전트는 기술적으로는 게임이 실행되었지만 코드 수준에서 엔티티와 런타임 간의 연결이 끊어져 소스를 읽어야만 발견할 수 있었습니다. 3 에이전트 하네스는 AI 지원 레벨 생성, 스프라이트 애니메이션, 음향 효과를 갖춘 플레이 가능한 게임을 제작했습니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/harness_engineering_ai_agents_1_38a13120a7.png" alt="Comparison of solo agent versus three-agent harness: solo agent ran 20 minutes at nine dollars with broken core functionality, while the full harness ran 6 hours at two hundred dollars producing a fully functional game with AI-assisted features" class="doc-image" id="comparison-of-solo-agent-versus-three-agent-harness:-solo-agent-ran-20-minutes-at-nine-dollars-with-broken-core-functionality,-while-the-full-harness-ran-6-hours-at-two-hundred-dollars-producing-a-fully-functional-game-with-ai-assisted-features" />
   </span> <span class="img-wrapper"> <span>단독 에이전트와 3에이전트 하네스의 비교: 단독 에이전트는 핵심 기능이 손상된 상태에서 9달러로 20분 동안 실행된 반면, 전체 하네스는 200달러로 6시간 동안 실행되어 AI 지원 기능을 갖춘 완전한 기능을 갖춘 게임을 제작했습니다.</span> </span></p>
<p>에이전트 3명으로 구성된 아키텍처는 약 20배의 비용이 더 들었습니다. 결과물은 사용 불가능에서 사용 가능으로 바뀌었습니다. 이것이 바로 하네스 엔지니어링이 구조적 오버헤드를 감수하는 대신 안정성을 확보하는 핵심적인 거래입니다.</p>
<h2 id="The-Retrieval-Problem-Inside-Every-Agent-Harness" class="common-anchor-header">모든 에이전트 하네스 내부의 검색 문제<button data-href="#The-Retrieval-Problem-Inside-Every-Agent-Harness" class="anchor-icon" translate="no">
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
    </button></h2><p>구조화된 <code translate="no">docs/</code> 시스템과 생성기/평가자 스프린트 주기라는 두 패턴은 모두 에이전트가 필요할 때 진화하는 실시간 지식창고에서 올바른 정보를 찾아야 한다는 소리 없는 의존성을 공유합니다.</p>
<p>이는 보기보다 어려운 일입니다. 구체적인 예를 들어보자. 제너레이터가 사용자 인증을 구현하는 스프린트 3을 실행하고 있습니다. 코드를 작성하기 전에 두 가지 종류의 정보가 필요합니다.</p>
<p>첫째, <a href="https://zilliz.com/glossary/semantic-search">시맨틱 검색</a> 쿼리: <em>사용자 세션과 관련된 이 제품의 설계 원칙은 무엇인가요?</em> 관련 문서에서 "사용자 인증"이 아닌 "세션 관리" 또는 "액세스 제어"를 사용할 수 있습니다. 시맨틱에 대한 이해가 없으면 검색이 이를 놓치게 됩니다.</p>
<p>둘째, 정확히 일치하는 쿼리: <em>어떤 문서가 <code translate="no">validateToken</code> 함수를 참조하는가?</em> 함수 이름은 의미론적 의미가 없는 임의의 문자열입니다. <a href="https://zilliz.com/glossary/vector-embeddings">임베딩 기반 검색은</a> 이를 안정적으로 찾을 수 없습니다. 키워드 매칭만 작동합니다.</p>
<p>이 두 쿼리는 동시에 발생합니다. 순차적인 단계로 분리할 수 없습니다.</p>
<p>순수 <a href="https://zilliz.com/learn/vector-similarity-search">벡터 검색은</a> 일치 검색에서 실패합니다. 기존 <a href="https://milvus.io/docs/embed-with-bm25.md">BM25는</a> 시맨틱 쿼리에서 실패하며 문서가 어떤 어휘를 사용할지 예측할 수 없습니다. Milvus 2.5 이전에는 사용자 정의 결과 융합 로직으로 쿼리 시 동시에 실행되는 두 개의 병렬 검색 시스템, 즉 벡터 인덱스와 <a href="https://milvus.io/docs/full-text-search.md">전체 텍스트 인덱스가</a> 유일한 옵션이었습니다. 지속적으로 업데이트되는 라이브 <code translate="no">docs/</code> 리포지토리의 경우, 두 색인 모두 동기화 상태를 유지해야 했기 때문에 문서가 변경될 때마다 두 곳에서 재색인이 트리거되어 불일치의 위험이 항상 존재했습니다.</p>
<h2 id="How-Milvus-26-Solves-Agent-Retrieval-with-a-Single-Hybrid-Pipeline" class="common-anchor-header">Milvus 2.6이 단일 하이브리드 파이프라인으로 에이전트 검색을 해결하는 방법<button data-href="#How-Milvus-26-Solves-Agent-Retrieval-with-a-Single-Hybrid-Pipeline" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus는 AI 워크로드를 위해 설계된 오픈 소스 <a href="https://zilliz.com/learn/what-is-vector-database">벡터 데이터베이스입니다</a>. Milvus 2.6의 Sparse-BM25는 이중 파이프라인 검색 문제를 단일 시스템으로 축소합니다.</p>
<p>수집 시 Milvus는 시맨틱 검색을 위한 <a href="https://zilliz.com/learn/sparse-and-dense-embeddings">고밀도 임베딩과</a> BM25 채점을 위한 <a href="https://milvus.io/docs/sparse_vector.md">TF 인코딩된 스파스 벡터라는</a> 두 가지 표현을 동시에 생성합니다. 문서가 추가되거나 제거되면 글로벌 <a href="https://zilliz.com/learn/tf-idf-understanding-term-frequency-inverse-document-frequency-in-nlp">IDF 통계가</a> 자동으로 업데이트되므로 수동 재색인 트리거가 필요 없습니다. 쿼리 시 자연어 입력은 내부적으로 두 가지 쿼리 벡터 유형을 모두 생성합니다. <a href="https://milvus.io/docs/rrf-ranker.md">상호 순위 융합(RRF)이</a> 순위가 매겨진 결과를 병합하고 호출자는 하나의 통합된 결과 세트를 받습니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/harness_engineering_ai_agents_2_8504a6ee08.png" alt="Before and after: two separate systems with manual sync, fragmented results, and custom fusion logic versus Milvus 2.6 single pipeline with dense embedding, Sparse BM25, RRF fusion, and automatic IDF maintenance producing unified results" class="doc-image" id="before-and-after:-two-separate-systems-with-manual-sync,-fragmented-results,-and-custom-fusion-logic-versus-milvus-2.6-single-pipeline-with-dense-embedding,-sparse-bm25,-rrf-fusion,-and-automatic-idf-maintenance-producing-unified-results" />
   </span> <span class="img-wrapper"> <span>이전과 이후: 수동 동기화, 파편화된 결과, 사용자 정의 융합 로직을 사용하는 두 개의 개별 시스템과 밀집 임베딩, 스파스 BM25, RRF 융합, 통합 결과를 생성하는 자동 IDF 유지 관리를 사용하는 Milvus 2.6 단일 파이프라인 비교</span> </span></p>
<p>단일 인터페이스. 하나의 인덱스로 유지 관리.</p>
<p>18개의 이기종 검색 데이터세트를 포괄하는 표준 평가 제품군인 <a href="https://zilliz.com/glossary/beir">BEIR 벤치마크에서</a> Milvus는 동등한 리콜에서 Elasticsearch보다 3-4배 더 높은 처리량을 달성하며 특정 워크로드에서 최대 7배의 QPS 향상을 이룹니다. 스프린트 시나리오의 경우, 단일 쿼리로 세션 설계 원칙(시맨틱 경로)과 <code translate="no">validateToken</code> (정확한 경로)를 언급하는 모든 문서를 모두 찾습니다. <code translate="no">docs/</code> 리포지토리는 지속적으로 업데이트되며, BM25 IDF 유지보수는 새로 작성된 문서가 일괄 재구축 없이 다음 쿼리의 스코어링에 참여한다는 것을 의미합니다.</p>
<p>이것은 바로 이러한 종류의 문제를 위해 구축된 검색 계층입니다. 에이전트 하네스가 코드 문서, 디자인 결정, 스프린트 기록 등 살아있는 지식 기반을 검색해야 하는 경우, 단일 파이프라인 하이브리드 검색은 좋은 방법이 아닙니다. 나머지 하네스가 작동해야만 합니다.</p>
<h2 id="The-Best-Harness-Components-Are-Designed-to-Be-Deleted" class="common-anchor-header">최고의 하네스 구성 요소는 삭제하도록 설계되었습니다.<button data-href="#The-Best-Harness-Components-Are-Designed-to-Be-Deleted" class="anchor-icon" translate="no">
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
    </button></h2><p>하네스의 모든 구성 요소는 모델 제한에 대한 가정을 인코딩합니다. 긴 작업에서 모델이 일관성을 잃을 때 스프린트 분해가 필요했습니다. 컨텍스트 재설정은 모델이 윈도우 한계 근처에서 불안을 경험할 때 필요했습니다. 평가자 에이전트는 자체 평가 편향을 관리할 수 없을 때 필요했습니다.</p>
<p>이러한 가정은 이제 유효하지 않습니다. 모델이 진정한 장기 컨텍스트 체력을 갖추게 되면 인지의 컨텍스트 윈도우 트릭은 불필요해질 수 있습니다. 모델이 계속 개선됨에 따라 다른 구성 요소는 신뢰성을 추가하지 않고 에이전트 속도를 저하시키는 불필요한 오버헤드가 될 것입니다.</p>
<p>하네스 엔지니어링은 고정된 아키텍처가 아닙니다. 새로운 모델이 출시될 때마다 재조정되는 시스템입니다. 주요 업그레이드 후 첫 번째 질문은 "무엇을 추가할 수 있는가?"가 아닙니다. "무엇을 제거할 수 있을까?"가 아닙니다.</p>
<p>검색에도 동일한 논리가 적용됩니다. 모델이 더 긴 컨텍스트를 더 안정적으로 처리함에 따라 청킹 전략과 검색 타이밍이 바뀔 것입니다. 오늘은 신중한 조각화가 필요한 정보가 내일은 전체 페이지로 수집될 수 있습니다. 검색 인프라는 모델과 함께 적응합니다.</p>
<p>잘 구축된 하네스의 모든 구성 요소는 더 스마트한 모델에 의해 중복성을 갖추기 위해 기다리고 있습니다. 그건 문제가 되지 않습니다. 이것이 바로 목표입니다.</p>
<h2 id="Get-Started-with-Milvus" class="common-anchor-header">Milvus 시작하기<button data-href="#Get-Started-with-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>하나의 파이프라인에서 시맨틱 검색과 키워드 검색을 함께 사용하는 하이브리드 검색이 필요한 에이전트 인프라를 구축하고 있다면 여기에서 시작하세요:</p>
<ul>
<li><a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md"><strong>Milvus 2.6 릴리즈 노트에서</strong></a> Sparse-BM25, 자동 IDF 유지 관리 및 성능 벤치마크에 대한 자세한 내용을 읽어보세요.</li>
<li><a href="https://milvus.io/community"><strong>Milvus 커뮤니티에</strong></a> 가입하여 질문하고 구축 중인 내용을 공유하세요.</li>
<li><a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"><strong>무료 Milvus 오피스 아워 세션을 예약하여</strong></a> 벡터 데이터베이스 전문가와 함께 사용 사례를 살펴보세요.</li>
<li>인프라 설정을 건너뛰고 싶다면, 업무용 이메일로 등록하면 $100의 무료 크레딧으로 시작할 수 있는 무료 티어를 제공하는 <a href="https://cloud.zilliz.com/signup"><strong>Zilliz Cloud</strong></a> (완전 관리형 Milvus)를 이용하세요.</li>
<li>GitHub에서 별을 달아주세요: <a href="https://github.com/milvus-io/milvus"><strong>milvus-io/milvus</strong></a> - 43,000개 이상의 별이 달렸고 계속 증가하고 있습니다.</li>
</ul>
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
    </button></h2><h3 id="What-is-harness-engineering-and-how-is-it-different-from-prompt-engineering" class="common-anchor-header">하네스 엔지니어링이란 무엇이며 프롬프트 엔지니어링과 어떻게 다른가요?</h3><p>프롬프트 엔지니어링은 단일 교환에서 모델에 대한 문구, 구조, 예시 등 사용자가 말하는 내용을 최적화합니다. 하네스 엔지니어링은 호출할 수 있는 도구, 액세스할 수 있는 지식, 작업을 확인하는 유효성 검사 로직, 아키텍처 이탈을 방지하는 제약 조건 등 자율 AI 에이전트를 중심으로 실행 환경을 구축합니다. 프롬프트 엔지니어링은 한 번의 대화 전환을 형성합니다. 하네스 엔지니어링은 에이전트가 사람의 감독 없이 수백 가지 의사 결정에 걸쳐 몇 시간 동안 안정적으로 작동할 수 있는지 여부를 결정합니다.</p>
<h3 id="Why-do-AI-agents-need-both-vector-search-and-BM25-at-the-same-time" class="common-anchor-header">AI 에이전트에 벡터 검색과 BM25가 동시에 필요한 이유는 무엇인가요?</h3><p>에이전트는 근본적으로 다른 두 가지 검색 쿼리에 동시에 답변해야 합니다. 시맨틱 쿼리 - <em>사용자 세션에 대한 설계 원칙은 무엇인가요?</em> - 어휘와 관계없이 개념적으로 관련된 콘텐츠를 일치시키기 위해 조밀한 벡터 임베딩이 필요합니다. 정확히 일치하는 쿼리 - <em>어떤 문서가 <code translate="no">validateToken</code> 함수를 참조하나요?</em> - 함수 이름은 의미론적 의미가 없는 임의의 문자열이기 때문에 BM25 키워드 스코어링이 필요합니다. 한 가지 모드만 처리하는 검색 시스템은 다른 유형의 쿼리를 체계적으로 놓치게 됩니다.</p>
<h3 id="How-does-Milvus-Sparse-BM25-work-for-agent-knowledge-retrieval" class="common-anchor-header">상담원 지식 검색을 위해 Milvus Sparse-BM25는 어떻게 작동하나요?</h3><p>수집 시 Milvus는 각 문서에 대해 고밀도 임베딩과 TF 인코딩된 스파스 벡터를 동시에 생성합니다. 지식창고가 변경되면 글로벌 IDF 통계가 실시간으로 업데이트되므로 수동으로 재색인할 필요가 없습니다. 쿼리 시 두 벡터 유형이 모두 내부적으로 생성되고, 상호 순위 퓨전이 순위가 매겨진 결과를 병합하며, 에이전트는 하나의 통합된 결과 세트를 받습니다. 전체 파이프라인은 하나의 인터페이스와 하나의 인덱스를 통해 실행되며, 이는 코드 문서 저장소와 같이 지속적으로 업데이트되는 지식창고에 매우 중요합니다.</p>
<h3 id="When-should-I-add-an-evaluator-agent-to-my-agent-harness" class="common-anchor-header">언제 에이전트 하네스에 평가자 에이전트를 추가해야 하나요?</h3><p>자동화된 테스트만으로는 생성기의 출력 품질을 확인할 수 없거나 자체 평가 편향으로 인해 결함을 놓친 경우 별도의 평가자를 추가하세요. 핵심 원칙: 평가자는 구조적으로 제너레이터와 분리되어야 합니다. 컨텍스트를 공유하면 제거하려는 것과 동일한 편향이 다시 도입될 수 있습니다. 평가자는 코드 검토뿐만 아니라 동작을 테스트하기 위해 런타임 도구(브라우저 자동화, API 호출, 데이터베이스 쿼리)에 액세스할 수 있어야 합니다. Anthropic의 <a href="https://www.anthropic.com/engineering/harness-design-long-running-apps">연구에</a> 따르면 GAN에서 영감을 얻은 이러한 분리는 출력 품질을 "기술적으로는 실행되지만 깨진 상태"에서 "단독 에이전트가 시도한 적이 없는 기능을 갖춘 완전한 기능"으로 끌어올렸습니다.</p>
