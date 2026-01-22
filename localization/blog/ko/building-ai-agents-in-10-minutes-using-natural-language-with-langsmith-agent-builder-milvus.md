---
id: >-
  building-ai-agents-in-10-minutes-using-natural-language-with-langsmith-agent-builder-milvus.md
title: 랭스미스 에이전트 빌더 + 밀버스로 자연어를 사용하여 10분 만에 AI 에이전트 구축하기
author: Min Yin
date: 2026-01-22T00:00:00.000Z
desc: >-
  코드 없이 자연어를 지원하며 프로덕션에 바로 사용할 수 있는 LangSmith 에이전트 빌더와 Milvus를 사용하여 메모리 지원 AI
  에이전트를 몇 분 만에 빌드하는 방법을 알아보세요.
cover: assets.zilliz.com/cover_LS_MVS_ab8af19bfa.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search'
meta_keywords: >-
  LangSmith Agent Builder, Milvus vector database, AI agent memory, no-code AI
  agents, building AI assistants
meta_title: |
  Build AI Agents in 10 Minutes with LangSmith Agent Builder & Milvus
origin: >-
  https://milvus.io/blog/building-ai-agents-in-10-minutes-using-natural-language-with-langsmith-agent-builder-milvus.md
---
<p>AI 개발이 가속화됨에 따라 AI 어시스턴트를 구축하는 데 반드시 소프트웨어 엔지니어링 배경 지식이 필요하지 않다는 사실을 깨닫는 팀이 늘고 있습니다. 제품 팀, 운영, 지원, 연구원 등 어시스턴트를 가장 필요로 하는 사람들은 에이전트가 무엇을 해야 하는지는 정확히 알고 있지만 코드로 구현하는 방법은 모르는 경우가 많습니다. 기존의 '코드 없는' 툴은 드래그 앤 드롭 캔버스로 이러한 격차를 해소하려고 했지만 다단계 추론, 툴 사용 또는 영구 메모리 등 실제 에이전트 행동이 필요한 순간 무너집니다.</p>
<p>새로 출시된 <a href="https://www.langchain.com/langsmith/agent-builder"><strong>LangSmith 에이전트 빌더는</strong></a> 다른 접근 방식을 취합니다. 워크플로를 설계하는 대신 에이전트의 목표와 사용 가능한 툴을 일반 언어로 설명하면 런타임이 의사 결정을 처리합니다. 플로차트나 스크립트 없이도 명확한 의도만 있으면 됩니다.</p>
<p>하지만 의도만으로는 지능형 어시스턴트를 만들 수 없습니다. <strong>메모리가</strong> 필요합니다. 널리 채택된 오픈 소스 벡터 데이터베이스인 <a href="https://milvus.io/"><strong>Milvus가</strong></a> 그 기반을 제공합니다. 문서와 대화 기록을 임베딩으로 저장함으로써 Milvus는 상담원이 문맥을 기억하고 관련 정보를 검색하며 규모에 맞게 정확하게 응답할 수 있도록 해줍니다.</p>
<p>이 가이드에서는 코드 한 줄도 작성하지 않고도 <strong>LangSmith 에이전트 빌더 + Milvus를</strong> 사용하여 프로덕션에 바로 사용할 수 있는 메모리 지원 AI 어시스턴트를 구축하는 방법을 안내합니다.</p>
<h2 id="What-is-LangSmith-Agent-Builder-and-How-It-Works" class="common-anchor-header">랭스미스 에이전트 빌더란 무엇이며 어떻게 작동하나요?<button data-href="#What-is-LangSmith-Agent-Builder-and-How-It-Works" class="anchor-icon" translate="no">
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
    </button></h2><p>이름에서 알 수 있듯이 <a href="https://www.google.com/search?q=LangSmith+Agent+Builder&amp;oq=what+is+LangSmith+Agent+Builder&amp;gs_lcrp=EgZjaHJvbWUyBggAEEUYOTIHCAEQABiABDIHCAIQABiABDIHCAMQABiABDIHCAQQABiABDIHCAUQABiABDIHCAYQABiABDIHCAcQABiABDIGCAgQABgDMggICRAAGBYYHtIBCTI1OTJqMGoxNagCCLACAfEF2Mylr_IuXLk&amp;sourceid=chrome&amp;ie=UTF-8&amp;ved=2ahUKEwjV1LfvxZ6SAxVFsFYBHYzTJAsQgK4QegQIARAB">LangSmith 에이전트 빌더는</a> 일반 언어를 사용하여 AI 에이전트를 구축, 배포 및 관리할 수 있는 LangChain의 노코드 툴입니다. 로직을 작성하거나 시각적 흐름을 설계하는 대신 에이전트가 수행해야 하는 작업, 사용할 수 있는 도구, 에이전트의 동작 방식을 설명하면 됩니다. 그러면 시스템이 프롬프트 생성, 도구 선택, 구성 요소 연결, 메모리 활성화 등 어려운 부분을 처리합니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/_57c5cee35b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>기존의 노코드 또는 워크플로 툴과 달리 에이전트 빌더에는 드래그 앤 드롭 캔버스나 노드 라이브러리가 없습니다. ChatGPT와 동일한 방식으로 상호작용할 수 있습니다. 구축하고자 하는 내용을 설명하고 몇 가지 명확한 질문에 답하면 빌더가 사용자의 의도에 따라 완벽하게 작동하는 에이전트를 생성합니다.</p>
<p>그 이면에는 네 가지 핵심 빌딩 블록으로 에이전트가 구성됩니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_05b90b1f3d.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<ul>
<li><strong>프롬프트:</strong> 프롬프트는 에이전트의 목표, 제약 조건 및 의사 결정 논리를 정의하는 에이전트의 두뇌 역할을 합니다. 랭스미스 에이전트 빌더는 메타 프롬프트를 사용하여 이를 자동으로 구축합니다. 사용자가 원하는 것을 설명하고, 명확한 질문을 하면, 사용자의 답변이 프로덕션에 바로 사용할 수 있는 상세한 시스템 프롬프트로 종합됩니다. 직접 로직을 작성하는 대신 의도를 표현하기만 하면 됩니다.</li>
<li><strong>도구:</strong> 도구를 통해 상담원은 이메일 보내기, Slack에 게시하기, 캘린더 이벤트 만들기, 데이터 검색 또는 API 호출 등의 작업을 수행할 수 있습니다. 에이전트 빌더는 안전하고 확장 가능한 방식으로 기능을 노출할 수 있는 모델 컨텍스트 프로토콜(MCP)을 통해 이러한 도구를 통합합니다. 사용자는 기본 제공 통합을 사용하거나 벡터 검색 및 장기 메모리를 위한 Milvus <a href="https://milvus.io/blog/why-vibe-coding-generate-outdated-code-and-how-to-fix-it-with-milvus-mcp.md">MCP 서버를</a>비롯한 사용자 지정 MCP 서버를 추가할 수 있습니다.</li>
<li><strong>트리거:</strong> 트리거는 에이전트가 실행되는 시기를 정의합니다. 수동 실행 외에도 에이전트를 일정이나 외부 이벤트에 연결하여 메시지, 이메일 또는 웹훅 활동에 자동으로 응답하도록 할 수 있습니다. 트리거가 실행되면 에이전트 빌더가 새 실행 스레드를 시작하고 에이전트의 로직을 실행하여 지속적인 이벤트 중심 동작을 가능하게 합니다.</li>
<li><strong>하위 에이전트:</strong> 하위 에이전트는 복잡한 작업을 더 작고 전문화된 단위로 나눕니다. 기본 에이전트는 각각 고유한 프롬프트와 툴셋을 갖춘 하위 에이전트에 작업을 위임할 수 있으므로 데이터 검색, 요약 또는 서식 지정과 같은 작업은 전용 헬퍼가 처리합니다. 이렇게 하면 하나의 프롬프트가 과부하되는 것을 방지하고 보다 모듈적이고 확장 가능한 상담원 아키텍처를 만들 수 있습니다.</li>
</ul>
<h2 id="How-Does-an-Agent-Remember-Your-Preferences" class="common-anchor-header">상담원은 내 기본 설정을 어떻게 기억하나요?<button data-href="#How-Does-an-Agent-Remember-Your-Preferences" class="anchor-icon" translate="no">
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
    </button></h2><p>에이전트 빌더가 특별한 이유는 <em>메모리를</em> 처리하는 방식 때문입니다. 상담원은 채팅 기록에 기본 설정을 채우는 대신 실행 중에 자체 행동 규칙을 업데이트할 수 있습니다. "지금부터 모든 Slack 메시지를 시로 끝내세요"라고 말하면 상담원은 이를 일회성 요청으로 처리하지 않고 향후 실행에 적용되는 영구적인 기본 설정으로 저장합니다.</p>
<p>내부적으로 에이전트는 내부 메모리 파일, 즉 진화하는 시스템 프롬프트를 유지합니다. 시작할 때마다 이 파일을 읽어 동작 방식을 결정합니다. 사용자가 수정이나 제약 조건을 제시하면 에이전트는 "항상 짧은 격려의 시로 브리핑을 마무리"와 같은 구조화된 규칙을 추가하여 파일을 편집합니다. 이 접근 방식은 대화 기록에 의존하는 것보다 훨씬 안정적이며, 상담원이 사용자의 선호 사항을 녹취록에 묻어두지 않고 적극적으로 작동 지침을 다시 작성하기 때문입니다.</p>
<p>이 설계는 딥에이전트의 파일시스템미들웨어에서 비롯되었지만 에이전트 빌더에서 완전히 추상화되었습니다. 사용자는 파일을 직접 건드리지 않고 자연어로 업데이트를 표현하면 시스템이 뒤에서 편집을 처리합니다. 더 많은 제어가 필요한 경우 사용자 지정 MCP 서버를 연결하거나 딥에이전트 계층에 드롭하여 고급 메모리 커스터마이징을 수행할 수 있습니다.</p>
<h2 id="Hands-on-Demo-Building-a-Milvus-Assistant-in-10-Minutes-using-Agent-Builder" class="common-anchor-header">실습 데모: 에이전트 빌더를 사용하여 10분 만에 밀버스 어시스턴트 구축하기<button data-href="#Hands-on-Demo-Building-a-Milvus-Assistant-in-10-Minutes-using-Agent-Builder" class="anchor-icon" translate="no">
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
    </button></h2><p>이제 에이전트 빌더의 설계 철학에 대해 살펴보았으니 실습 예제를 통해 전체 빌드 프로세스를 살펴보겠습니다. 우리의 목표는 Milvus 관련 기술 질문에 답하고, 공식 문서를 검색하고, 시간이 지남에 따라 사용자 기본 설정을 기억할 수 있는 지능형 어시스턴트를 만드는 것입니다.</p>
<h3 id="Step-1-Sign-In-to-the-LangChain-Website" class="common-anchor-header">1단계. LangChain 웹사이트에 로그인</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_1_b3c461d39b.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-2-Set-Up-Your-Anthropic-API-Key" class="common-anchor-header">2단계. 앤트로픽 API 키 설정</h3><p><strong>참고:</strong> 기본적으로 Anthropic이 지원됩니다. 사용자 지정 모델을 사용할 수도 있으며, 해당 유형이 LangChain에서 공식적으로 지원하는 목록에 포함되어 있는 한 사용할 수 있습니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_2_c04400695e.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>1. API 키 추가하기</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_3_11db4b3824.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>2. API 키 입력 및 저장</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_4_abfc27d796.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-3-Create-a-New-Agent" class="common-anchor-header">3. 새 에이전트 만들기</h3><p><strong>참고:</strong> 사용 설명서를 보려면 <strong>자세히</strong> 보기를 클릭합니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_5_e90bf254f2.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_6_7c839d96f3.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<ol>
<li><strong>사용자 지정 모델 구성하기(선택 사항)</strong></li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_7_0dfd5ff561.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>(1) 매개변수 입력 및 저장</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_8_85f9e3008f.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_9_0d5d0c062c.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-4-Describe-Your-Requirements-to-Create-the-Agent" class="common-anchor-header">4단계. 상담원 만들기에 대한 요구 사항 설명하기</h3><p><strong>참고:</strong> 자연어 설명을 사용하여 상담원을 만듭니다.</p>
<pre><code translate="no">
I need a Milvus technical consultant to <span class="hljs-built_in">help</span> me answer technical questions about vector databases. 

Search the official documentation <span class="hljs-keyword">and</span> remember my preference <span class="hljs-keyword">for</span> the index <span class="hljs-built_in">type</span> I use. 

<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_10_0e033a5200.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<ol>
<li><strong>시스템에서 요구 사항을 구체화하기 위한 후속 질문을 합니다.</strong></li>
</ol>
<p>질문 1: 상담원이 기억할 Milvus 인덱스 유형을 선택하세요.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_11_050ac891f0.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>질문 2: 상담원이 기술적인 질문을 어떻게 처리해야 하는지 선택하세요.  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_12_d1d6d4f2ed.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>질문 3: 상담원이 특정 Milvus 버전에 대한 안내에 집중해야 하는지 여부 지정하기  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_13_5d60df75e9.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-5-Review-and-Confirm-the-Generated-Agent" class="common-anchor-header">5단계. 생성된 상담원 검토 및 확인</h3><p><strong>참고:</strong> 시스템이 자동으로 상담원 구성을 생성합니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_14_8a596ae853.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>상담원을 만들기 전에 메타데이터, 도구 및 프롬프트를 검토할 수 있습니다. 모든 것이 올바르게 보이면 <strong>만들기를</strong> 클릭하여 계속 진행합니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_15_5c0b27aca7.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_16_998921b071.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-6-Explore-the-Interface-and-Feature-Areas" class="common-anchor-header">6단계. 인터페이스 및 기능 영역 살펴보기</h3><p>상담원이 만들어지면 인터페이스의 왼쪽 하단에 세 가지 기능 영역이 표시됩니다:</p>
<p><strong>(1) 트리거</strong></p>
<p>트리거는 외부 이벤트에 대한 응답 또는 일정에 따라 에이전트가 실행되어야 하는 시기를 정의합니다:</p>
<ul>
<li><strong>Slack:</strong> 특정 채널에 메시지가 도착하면 에이전트를 활성화합니다.</li>
<li><strong>Gmail:</strong> 새 이메일이 수신되면 에이전트 트리거하기</li>
<li><strong>Cron:</strong> 예약된 간격으로 에이전트 실행</li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_17_b77c603413.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>(2) 도구 상자</strong></p>
<p>상담원이 호출할 수 있는 도구의 집합입니다. 표시된 예에서는 세 가지 도구가 만드는 동안 자동으로 생성되며, <strong>도구 추가를</strong> 클릭하여 더 추가할 수 있습니다.  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_18_94637d4548.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>상담원에게 대량의 기술 문서에 대한 시맨틱 검색과 같은 벡터 검색 기능이 필요한 경우에는 Milvus의 MCP 서버를 배포하고</strong> <strong>MCP</strong> 버튼을 사용하여 여기에 추가할<strong>수 있습니다</strong>. MCP 서버가 <strong>연결 가능한 네트워크 엔드포인트에서</strong> 실행되고 있는지 확인하세요. 그렇지 않으면 에이전트 빌더가 이를 호출할 수 없습니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_19_94fe99a3b8.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>


  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_20_f887a8fbda.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>(3) 하위 에이전트</strong></p>
<p>특정 하위 작업 전용의 독립적인 에이전트 모듈을 만들어 모듈식 시스템 설계를 가능하게 합니다.</p>
<h3 id="Step-7-Test-the-Agent" class="common-anchor-header">7단계. 에이전트 테스트하기</h3><p>오른쪽 상단 모서리에 있는 <strong>테스트를</strong> 클릭하여 테스트 모드로 들어갑니다. 아래는 테스트 결과의 샘플입니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_22_527619519b.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_23_639d40c40d.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_24_42a71d2592.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_25_8ab35e15f8.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Agent-Builder-vs-DeepAgents-Which-One-Should-You-Choose" class="common-anchor-header">에이전트 빌더와 DeepAgents 비교: 어떤 것을 선택해야 하나요?<button data-href="#Agent-Builder-vs-DeepAgents-Which-One-Should-You-Choose" class="anchor-icon" translate="no">
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
    </button></h2><p>LangChain은 여러 에이전트 프레임워크를 제공하며, 필요한 제어의 정도에 따라 올바른 선택이 달라집니다. <a href="https://www.google.com/search?q=DeepAgents&amp;newwindow=1&amp;sca_esv=0e7ec9ce2aa7d5b4&amp;sxsrf=ANbL-n5pe1KqjmJVjQCqmc3jneYhmGGOUg%3A1769066335766&amp;ei=X89xab21Lp3a1e8Ppam06Ag&amp;ved=2ahUKEwio15nYzZ6SAxU_mq8BHcf3BqUQgK4QegQIARAB&amp;uact=5&amp;oq=what+is+DeepAgents&amp;gs_lp=Egxnd3Mtd2l6LXNlcnAiEndoYXQgaXMgRGVlcEFnZW50czIKEAAYsAMY1gQYRzIKEAAYsAMY1gQYRzIKEAAYsAMY1gQYRzIKEAAYsAMY1gQYRzIKEAAYsAMY1gQYRzIKEAAYsAMY1gQYRzIKEAAYsAMY1gQYRzIKEAAYsAMY1gQYRzINEAAYgAQYsAMYQxiKBTINEAAYgAQYsAMYQxiKBUi8BlAYWL8FcAF4AZABAJgBqgKgAbAKqgEFMC4yLjS4AQPIAQD4AQGYAgGgAgyYAwCIBgGQBgqSBwExoAehHrIHALgHAMIHAzMtMcgHCYAIAA&amp;sclient=gws-wiz-serp">딥에이전트는</a> 에이전트 구축 도구입니다. 복잡한 다단계 작업을 처리하는 자율적이고 장기적으로 실행되는 AI 에이전트를 구축하는 데 사용됩니다. LangGraph를 기반으로 구축되어 고급 계획, 파일 기반 컨텍스트 관리 및 하위 에이전트 오케스트레이션을 지원하므로 장기 프로젝트 또는 프로덕션급 프로젝트에 이상적입니다.</p>
<p>그렇다면 <strong>에이전트 빌더와</strong> 비교했을 때 어떤 차이가 있으며, 각각 언제 사용해야 할까요?</p>
<p><strong>에이전트 빌더는</strong> 단순성과 속도에 중점을 둡니다. 대부분의 구현 세부 사항을 추상화하여 자연어로 에이전트를 설명하고, 툴을 구성하고, 즉시 실행할 수 있습니다. 메모리, 도구 사용 및 휴먼 인 더 루프 워크플로가 자동으로 처리됩니다. 따라서 에이전트 빌더는 세밀한 제어보다 사용 편의성이 더 중요한 신속한 프로토타이핑, 내부 툴 및 초기 단계의 검증에 적합합니다.</p>
<p>반면<strong>DeepAgents는</strong> 메모리, 실행 및 인프라에 대한 완전한 제어가 필요한 시나리오를 위해 설계되었습니다. 미들웨어를 사용자 정의하고, 모든 Python 도구를 통합하고, 스토리지 백엔드( <a href="https://milvus.io/blog">Milvus의</a> 영구 메모리 포함)를 수정하고, 에이전트의 상태 그래프를 명시적으로 관리할 수 있습니다. 코드를 작성하고, 종속성을 관리하고, 장애 모드를 직접 처리하는 등 엔지니어링 작업이 필요하지만, 완전히 사용자 지정 가능한 에이전트 스택을 얻을 수 있습니다.</p>
<p>중요한 점은 <strong>에이전트 빌더와 DeepAgents가 별개의 에코시스템이 아니라 하나의 연속체를 형성한다는</strong> 점입니다. 에이전트 빌더는 딥에이전트 위에 구축되었습니다. 즉, 에이전트 빌더에서 빠른 프로토타입으로 시작한 다음 유연성이 더 필요할 때 모든 것을 처음부터 다시 작성하지 않고도 DeepAgents로 전환할 수 있습니다. 그 반대도 가능합니다. DeepAgents에서 구축된 패턴을 에이전트 빌더 템플릿으로 패키징하여 비전문 사용자가 재사용할 수 있도록 할 수도 있습니다.</p>
<h2 id="Conclusion" class="common-anchor-header">결론<button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p>AI의 발전 덕분에 AI 에이전트를 구축하는 데 더 이상 복잡한 워크플로나 무거운 엔지니어링이 필요하지 않습니다. 랭스미스 에이전트 빌더를 사용하면 자연어만으로 상태 저장형, 장기 실행형 어시스턴트를 만들 수 있습니다. 사용자는 에이전트가 수행해야 할 작업을 설명하는 데 집중하고 시스템은 계획, 도구 실행 및 지속적인 메모리 업데이트를 처리합니다.</p>
<p><a href="https://milvus.io/blog">Milvus와</a> 함께 사용하면 이러한 에이전트는 시맨틱 검색, 선호도 추적, 세션 전반의 장기적인 컨텍스트를 위한 안정적이고 지속적인 메모리를 확보할 수 있습니다. 아이디어를 검증하든 확장 가능한 시스템을 배포하든, LangSmith 에이전트 빌더와 Milvus는 단순히 응답만 하는 것이 아니라 시간이 지나면서 기억하고 개선하는 에이전트를 위한 간단하고 유연한 기반을 제공합니다.</p>
<p>질문이 있거나 더 자세한 안내를 원하시나요? <a href="https://milvusio.slack.com/join/shared_invite/zt-3nntzngkz-gYwhrdSE4~76k0VMyBfD1Q#/shared-invite/email">Slack 채널에</a> 참여하거나 20분 동안 진행되는 <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">Milvus 오피스 아워</a> 세션을 예약하여 개인 맞춤형 안내를 받아보세요.</p>
