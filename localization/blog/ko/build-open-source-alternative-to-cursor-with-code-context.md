---
id: build-open-source-alternative-to-cursor-with-code-context.md
title: 코드 컨텍스트가 있는 커서의 오픈소스 대안 구축하기
author: Cheney Zhang
date: 2025-06-24T00:00:00.000Z
cover: assets.zilliz.com/Chat_GPT_Image_Jul_26_2025_08_26_35_PM_b728fb730c.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'vector database, mcp, LLM, claude, gemini'
meta_keywords: 'Cursor, Claude Code, Gemini CLI, Code search, semantic code search'
meta_title: |
  Building an Open-Source Alternative to Cursor with Code Context
desc: >-
  코드 컨텍스트 - 오픈 소스, MCP 호환 플러그인으로, 모든 AI 코딩 에이전트, Claude Code 및 Gemini CLI,
  VSCode와 같은 IDE, 심지어 Chrome 같은 환경에서도 강력한 시맨틱 코드 검색 기능을 제공합니다.
origin: >-
  https://milvus.io/blog/build-open-source-alternative-to-cursor-with-code-context.md
---
<h2 id="The-AI-Coding-BoomAnd-Its-Blind-Spot" class="common-anchor-header">AI 코딩 붐과 그 사각지대<button data-href="#The-AI-Coding-BoomAnd-Its-Blind-Spot" class="anchor-icon" translate="no">
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
    </button></h2><p>AI 코딩 도구는 어디에나 존재하며, 그럴 만한 이유가 있어 입소문을 타고 있습니다. <a href="https://milvus.io/blog/claude-code-vs-gemini-cli-which-ones-the-real-dev-co-pilot.md">Claude Code, Gemini CLI부터</a> 오픈 소스 커서 대체 도구까지, 이러한 에이전트는 함수를 작성하고, 코드 종속성을 설명하고, 전체 파일을 단 한 번의 프롬프트로 리팩터링할 수 있습니다. 개발자들은 이러한 에이전트를 워크플로에 통합하기 위해 경쟁적으로 도입하고 있으며, 여러 가지 면에서 그 기대에 부응하고 있습니다.</p>
<p><strong>하지만 <em>코드베이스를 이해하는</em> 데 있어서는 대부분의 AI 도구가 벽에 부딪힙니다.</strong></p>
<p>Claude Code에 "이 프로젝트에서 사용자 인증을 처리하는 위치"를 찾으라고 요청하면 <code translate="no">grep -r &quot;auth&quot;</code>으로 돌아와 주석, 변수 이름, 파일 이름에 걸쳐 87개의 느슨하게 연관된 일치 항목을 뱉어내며 인증 로직이 있지만 "auth"라는 이름이 없는 함수가 많이 누락되어 있을 가능성이 높습니다. Gemini CLI를 사용해 보면 '로그인' 또는 '비밀번호'와 같은 키워드를 찾지만 <code translate="no">verifyCredentials()</code> 같은 함수는 완전히 누락되어 있습니다. 이러한 도구는 코드를 생성하는 데는 훌륭하지만 익숙하지 않은 시스템을 탐색, 디버그 또는 탐색해야 할 때 무너지게 됩니다. 토큰과 시간을 들여 컨텍스트 연소를 위해 전체 코드베이스를 LLM으로 보내지 않는 한 의미 있는 답변을 제공하기가 어렵습니다.</p>
<p><em>이것이 바로 오늘날 AI 툴링의 진정한 격차, 즉</em> <strong><em>코드 컨텍스트입니다.</em></strong></p>
<h2 id="Cursor-Nailed-ItBut-Not-for-Everyone" class="common-anchor-header">하지만 모든 사람에게 적합한 것은 아닙니다.<button data-href="#Cursor-Nailed-ItBut-Not-for-Everyone" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Cursor는</strong> 이 문제를 정면으로 해결합니다. 키워드 검색 대신 구문 트리, 벡터 임베딩, 코드 인식 검색을 사용하여 코드베이스의 시맨틱 맵을 구축합니다. "이메일 유효성 검사 로직이 어디에 있나요?"라고 질문하면 <code translate="no">isValidEmailFormat()</code> 이라는 결과를 반환하는데, 이는 이름이 일치하기 때문이 아니라 해당 코드의 <em>기능을</em> 이해하기 때문입니다.</p>
<p>Cursor는 강력하지만 모든 사람에게 적합하지 않을 수도 있습니다. <strong><em>Cursor는 비공개 소스, 클라우드 호스팅, 구독 기반입니다.</em></strong> 따라서 민감한 코드를 다루는 팀, 보안에 민감한 조직, 인디 개발자, 학생, 개방형 시스템을 선호하는 사람에게는 적합하지 않을 수 있습니다.</p>
<h2 id="What-if-You-Could-Build-Your-Own-Cursor" class="common-anchor-header">커서를 직접 만들 수 있다면 어떨까요?<button data-href="#What-if-You-Could-Build-Your-Own-Cursor" class="anchor-icon" translate="no">
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
    </button></h2><p>Cursor의 핵심 기술은 독점적인 것이 아닙니다. <a href="https://milvus.io/">Milvus와</a> 같은 벡터 데이터베이스, <a href="https://zilliz.com/ai-models">임베딩 모델</a>, Tree-sitter가 포함된 구문 분석기 등 검증된 오픈 소스 기반에 구축되어 있으며, 점들을 연결하고자 하는 모든 사람이 사용할 수 있습니다.</p>
<p><em>그래서 저희는 이렇게 물었습니다:</em> <strong><em>누구나 자신만의 커서를 만들 수 있다면 어떨까요?</em></strong> 여러분의 인프라에서 실행됩니다. 구독료가 없습니다. 완전히 사용자 정의할 수 있습니다. 코드와 데이터를 완벽하게 제어할 수 있습니다.</p>
<p>이것이 바로 Claude Code, Gemini CLI와 같은 모든 AI 코딩 에이전트, VSCode와 같은 IDE, 심지어 Google Chrome과 같은 환경에 강력한 시맨틱 코드 검색 기능을 제공하는 오픈 소스, MCP 호환 플러그인인 <a href="https://github.com/zilliztech/code-context"><strong>Code Context를</strong></a>구축한 이유입니다. 또한 Cursor와 같은 코딩 에이전트를 처음부터 직접 구축하여 코드베이스를 실시간으로 지능적으로 탐색할 수 있는 기능을 제공합니다.</p>
<p><strong><em>구독이 필요 없습니다. 블랙박스도 없습니다. 원하는 대로 코딩 인텔리전스만 있으면 됩니다.</em></strong></p>
<p>이 글의 나머지 부분에서는 코드 컨텍스트의 작동 방식과 지금 바로 사용할 수 있는 방법을 살펴보겠습니다.</p>
<h2 id="Code-Context-Open-Source-Alternative-to-Cursors-Intelligence" class="common-anchor-header">코드 컨텍스트: 커서의 인텔리전스를 대체하는 오픈 소스 대안<button data-href="#Code-Context-Open-Source-Alternative-to-Cursors-Intelligence" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://github.com/zilliztech/code-context"><strong>Code Context는</strong></a> MCP와 호환되는 오픈 소스 시맨틱 코드 검색 엔진입니다. 맞춤형 AI 코딩 어시스턴트를 처음부터 구축하든, Claude Code 및 Gemini CLI와 같은 AI 코딩 에이전트에 시맨틱 인식을 추가하든, Code Context는 이를 가능하게 하는 엔진입니다.</p>
<p>이 엔진은 로컬에서 실행되고 VS Code 및 Chrome 브라우저와 같이 자주 사용하는 도구 및 환경과 통합되며 클라우드 전용의 비공개 소스 플랫폼에 의존하지 않고도 강력한 코드 이해 기능을 제공합니다.</p>
<p><strong>핵심 기능은 다음과 같습니다:</strong></p>
<ul>
<li><p><strong>자연어를 통한 시맨틱 코드 검색:</strong> 일반 영어를 사용해 코드를 찾습니다. '사용자 로그인 확인' 또는 '결제 처리 로직'과 같은 개념을 검색하면 코드 컨텍스트가 키워드와 정확히 일치하지 않더라도 관련 기능을 찾아줍니다.</p></li>
<li><p><strong>다국어 지원:</strong> JavaScript, Python, Java, Go 등 15개 이상의 프로그래밍 언어에서 일관된 의미 이해로 원활하게 검색할 수 있습니다.</p></li>
<li><p><strong>AST 기반 코드 청킹:</strong> AST 구문 분석을 사용해 코드가 함수나 클래스 같은 논리적 단위로 자동 분할되어 검색 결과가 완전하고 의미 있으며, 함수 중간에 끊어지지 않도록 보장합니다.</p></li>
<li><p><strong>실시간 증분 인덱싱:</strong> 코드 변경 사항은 실시간으로 색인됩니다. 파일을 편집할 때 검색 색인은 최신 상태로 유지되므로 수동으로 새로 고치거나 색인을 다시 생성할 필요가 없습니다.</p></li>
<li><p><strong>완전 로컬, 안전한 배포:</strong> 자체 인프라에서 모든 것을 실행하세요. Code Context는 Ollama를 통한 로컬 모델과 <a href="https://milvus.io/">Milvus를</a> 통한 인덱싱을 지원하므로 코드가 사용자 환경을 벗어나지 않습니다.</p></li>
<li><p><strong>최고 수준의 IDE 통합:</strong> VSCode 확장 기능을 사용하면 컨텍스트 전환 없이 에디터에서 바로 검색하고 결과로 바로 이동할 수 있습니다.</p></li>
<li><p><strong>MCP 프로토콜 지원:</strong> 코드 컨텍스트는 MCP를 지원하므로 AI 코딩 어시스턴트와 쉽게 통합하고 워크플로에 시맨틱 검색을 바로 도입할 수 있습니다.</p></li>
<li><p><strong>브라우저 플러그인 지원:</strong> 탭이나 복사/붙여넣기 없이 브라우저에서 GitHub에서 바로 리포지토리를 검색하여 작업 중인 모든 곳에서 즉시 컨텍스트를 확인할 수 있습니다.</p></li>
</ul>
<h3 id="How-Code-Context-Works" class="common-anchor-header">코드 컨텍스트의 작동 방식</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/How_Code_Context_Works_3faaa2fff3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Code Context는 임베딩, 구문 분석, 저장 및 검색을 위한 핵심 오케스트레이터와 특수 구성 요소가 포함된 모듈식 아키텍처를 사용합니다.</p>
<h3 id="The-Core-Module-Code-Context-Core" class="common-anchor-header">핵심 모듈: 코드 컨텍스트 코어</h3><p>코드 컨텍스트의 핵심은 코드 구문 분석, 임베딩, 저장 및 시맨틱 검색을 조정하는 <strong>코드 컨텍스트 코어입니다</strong>:</p>
<ul>
<li><p><strong>텍스트 처리 모듈은</strong> 언어 인식 AST 분석을 위해 트리시터를 사용하여 코드를 분할하고 구문 분석합니다.</p></li>
<li><p><strong>임베딩 인터페이스는</strong> 플러그형 백엔드(현재 OpenAI 및 VoyageAI)를 지원하여 코드 청크를 의미론적 의미와 문맥적 관계를 파악하는 벡터 임베딩으로 변환합니다.</p></li>
<li><p><strong>벡터 데이터베이스 인터페이스는</strong> 이러한 임베딩을 자체 호스팅 <a href="https://milvus.io/">Milvus</a> 인스턴스(기본값) 또는 관리형 Milvus 버전인 <a href="https://zilliz.com/cloud">Zilliz Cloud에</a> 저장합니다.</p></li>
</ul>
<p>이 모든 것이 예약된 방식으로 파일 시스템과 동기화되므로 수동 개입 없이도 인덱스가 최신 상태로 유지됩니다.</p>
<h3 id="Extension-Modules-on-top-of-Code-Context-Core" class="common-anchor-header">코드 컨텍스트 코어를 기반으로 하는 확장 모듈</h3><ul>
<li><p><strong>VSCode 확장</strong>: 편집기 내 빠른 시맨틱 검색 및 정의로 이동을 위한 원활한 IDE 통합.</p></li>
<li><p><strong>Chrome 확장 프로그램</strong>: 탭을 전환할 필요 없이 GitHub 리포지토리를 탐색하는 동안 인라인 시맨틱 코드 검색이 가능합니다.</p></li>
<li><p><strong>MCP 서버</strong>: MCP 프로토콜을 통해 모든 AI 코딩 어시스턴트에 코드 컨텍스트를 노출하여 실시간 컨텍스트 인식 지원을 가능하게 합니다.</p></li>
</ul>
<h2 id="Getting-Started-with-Code-Context" class="common-anchor-header">코드 컨텍스트 시작하기<button data-href="#Getting-Started-with-Code-Context" class="anchor-icon" translate="no">
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
    </button></h2><p>코드 컨텍스트는 이미 사용 중인 코딩 도구에 연결하거나 처음부터 사용자 지정 AI 코딩 어시스턴트를 구축할 수 있습니다. 이 섹션에서는 두 가지 시나리오를 모두 살펴봅니다:</p>
<ul>
<li><p>코드 컨텍스트를 기존 도구와 통합하는 방법</p></li>
<li><p>나만의 AI 코딩 어시스턴트를 구축할 때 독립형 시맨틱 코드 검색을 위해 코어 모듈을 설정하는 방법</p></li>
</ul>
<h3 id="MCP-Integration" class="common-anchor-header">MCP 통합</h3><p>Code Context는 <strong>MCP(모델 컨텍스트 프로토콜)를</strong> 지원하므로 Claude Code와 같은 AI 코딩 에이전트가 이를 시맨틱 백엔드로 사용할 수 있습니다.</p>
<p>Claude Code와 통합하려면</p>
<pre><code translate="no">claude mcp add code-context -e OPENAI_API_KEY=your-openai-api-key -e MILVUS_ADDRESS=your-zilliz-cloud-<span class="hljs-keyword">public</span>-endpoint -e MILVUS_TOKEN=your-zilliz-cloud-api-key -- npx <span class="hljs-meta">@zilliz</span>/code-context-mcp<span class="hljs-meta">@latest</span>
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/mcp_code_context_processed_3908097481.gif" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>구성이 완료되면 클로드 코드가 필요할 때 시맨틱 코드 검색을 위해 자동으로 코드 컨텍스트를 호출합니다.</p>
<p>다른 도구 또는 환경과 통합하려면 더 많은 예제 및 어댑터가 있는<a href="https://github.com/zilliztech/code-context"> GitHub</a> 리포지토리를 확인하세요.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/MCP_Integration_2_683c7ef73d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Building-Your-Own-AI-Coding-Assistant-with-Code-Context" class="common-anchor-header">코드 컨텍스트를 사용하여 나만의 AI 코딩 어시스턴트 구축하기</h3><p>코드 컨텍스트를 사용하여 사용자 지정 AI 어시스턴트를 구축하려면 시맨틱 코드 검색을 위한 핵심 모듈을 단 3단계로 설정할 수 있습니다:</p>
<ol>
<li><p>임베딩 모델 구성</p></li>
<li><p>벡터 데이터베이스에 연결</p></li>
<li><p>프로젝트 색인 생성 및 검색 시작</p></li>
</ol>
<p>다음은 <strong>OpenAI 임베딩과</strong> <a href="https://zilliz.com/cloud"><strong>Zilliz Cloud</strong></a> <strong>벡터 데이터베이스를</strong> 벡터 백엔드로 사용하는 예제입니다:</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> { <span class="hljs-title class_">CodeContext</span>, <span class="hljs-title class_">MilvusVectorDatabase</span>, <span class="hljs-title class_">OpenAIEmbedding</span> } <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;@zilliz/code-context-core&#x27;</span>;

<span class="hljs-comment">// Initialize embedding model</span>
<span class="hljs-keyword">const</span> embedding = <span class="hljs-keyword">new</span> <span class="hljs-title class_">OpenAIEmbedding</span>({
    <span class="hljs-attr">apiKey</span>: <span class="hljs-string">&#x27;your-openai-api-key&#x27;</span>,
    <span class="hljs-attr">model</span>: <span class="hljs-string">&#x27;text-embedding-3-small&#x27;</span>
});

<span class="hljs-comment">// Initialize Zilliz Cloud vector database</span>
<span class="hljs-comment">// Sign up for free at https://zilliz.com/cloud</span>
<span class="hljs-keyword">const</span> vectorDatabase = <span class="hljs-keyword">new</span> <span class="hljs-title class_">MilvusVectorDatabase</span>({
    <span class="hljs-attr">address</span>: <span class="hljs-string">&#x27;https://xxx-xxxxxxxxxxxx.serverless.gcp-us-west1.cloud.zilliz.com&#x27;</span>,
    <span class="hljs-attr">token</span>: <span class="hljs-string">&#x27;xxxxxxx&#x27;</span>
});

<span class="hljs-comment">// Create the Code Context indexer</span>
<span class="hljs-keyword">const</span> context = <span class="hljs-keyword">new</span> <span class="hljs-title class_">CodeContext</span>({ embedding, vectorDatabase });

<span class="hljs-comment">// Index the codebase</span>
<span class="hljs-keyword">await</span> context.<span class="hljs-title function_">indexCodebase</span>(<span class="hljs-string">&#x27;./your-project&#x27;</span>);

<span class="hljs-comment">// Perform semantic code search</span>
<span class="hljs-keyword">const</span> results = <span class="hljs-keyword">await</span> context.<span class="hljs-title function_">semanticSearch</span>(<span class="hljs-string">&#x27;./your-project&#x27;</span>, <span class="hljs-string">&#x27;vector database operations&#x27;</span>, <span class="hljs-number">5</span>);
results.<span class="hljs-title function_">forEach</span>(<span class="hljs-function"><span class="hljs-params">result</span> =&gt;</span> {
    <span class="hljs-variable language_">console</span>.<span class="hljs-title function_">log</span>(<span class="hljs-string">`<span class="hljs-subst">${result.relativePath}</span>:<span class="hljs-subst">${result.startLine}</span>-<span class="hljs-subst">${result.endLine}</span>`</span>);
    <span class="hljs-variable language_">console</span>.<span class="hljs-title function_">log</span>(<span class="hljs-string">`score: <span class="hljs-subst">${(result.score * <span class="hljs-number">100</span>).toFixed(<span class="hljs-number">2</span>)}</span>%`</span>);
});
<button class="copy-code-btn"></button></code></pre>
<h3 id="VSCode-Extension" class="common-anchor-header">VSCode 확장</h3><p>코드 컨텍스트는 지능형 자연어 기반 코드 검색을 에디터에 직접 제공하는 <strong>"시맨틱 코드 검색"</strong>이라는 이름의 VSCode 확장 기능으로 제공됩니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/VS_Code_Extension_e358f36464.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>설치가 완료되면</p>
<ul>
<li><p>API 키 구성</p></li>
<li><p>프로젝트 색인 생성</p></li>
<li><p>일반 영어 쿼리 사용(정확히 일치할 필요 없음)</p></li>
<li><p>클릭 투 탐색으로 즉시 결과로 이동</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/mcp_code_context_processed_3908097481.gif" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>터미널이나 브라우저 없이도 시맨틱 탐색을 코딩 워크플로우의 기본 요소로 사용할 수 있습니다.</p>
<h3 id="Chrome-Extension-Coming-Soon" class="common-anchor-header">Chrome 확장 프로그램(출시 예정)</h3><p>곧 출시될 <strong>Chrome 확장 프로그램은</strong> 코드 컨텍스트를 GitHub 웹 페이지에 제공하여 컨텍스트 전환이나 탭 없이도 모든 공개 리포지토리 내에서 바로 시맨틱 코드 검색을 실행할 수 있게 해줍니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/chrome_4e67b683d7.gif" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>로컬에서와 동일한 심층 검색 기능으로 익숙하지 않은 코드베이스를 탐색할 수 있게 됩니다. 확장 기능이 개발 중이며 곧 출시될 예정입니다.</p>
<h2 id="Why-Use-Code-Context" class="common-anchor-header">왜 코드 컨텍스트를 사용하나요?<button data-href="#Why-Use-Code-Context" class="anchor-icon" translate="no">
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
    </button></h2><p>기본 설정으로 빠르게 실행할 수 있지만 <strong>Code Context가</strong> 진정으로 빛을 발하는 곳은 전문적인 고성능 개발 환경입니다. 고급 기능은 엔터프라이즈급 배포부터 맞춤형 AI 툴링까지 다양한 워크플로를 지원하도록 설계되었습니다.</p>
<h3 id="Private-Deployment-for-Enterprise-Grade-Security" class="common-anchor-header">엔터프라이즈급 보안을 위한 비공개 배포</h3><p>Code Context는 <strong>Ollama</strong> 로컬 임베딩 모델과 자체 호스팅 벡터 데이터베이스로서 <strong>Milvus를</strong> 사용하여 완전한 오프라인 배포를 지원합니다. 따라서 API 호출, 인터넷 전송, 데이터가 로컬 환경을 벗어나지 않는 완전히 비공개적인 코드 검색 파이프라인이 가능합니다.</p>
<p>이 아키텍처는 금융, 정부, 국방과 같이 코드 기밀 유지가 타협할 수 없는 엄격한 규정 준수 요건을 가진 산업에 이상적입니다.</p>
<h3 id="Real-Time-Indexing-with-Intelligent-File-Sync" class="common-anchor-header">지능형 파일 동기화를 통한 실시간 인덱싱</h3><p>코드 색인을 최신 상태로 유지하는 작업이 느리거나 수동으로 이루어져서는 안 됩니다. Code Context에는 변경 사항을 즉시 감지하고 실시간으로 증분 업데이트를 수행하는 <strong>머클 트리 기반 파일 모니터링 시스템이</strong> 포함되어 있습니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Real_Time_Indexing_with_Intelligent_File_Sync_49c303a38f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>수정된 파일만 다시 색인화함으로써 대규모 리포지토리의 업데이트 시간을 몇 분에서 몇 초로 단축합니다. 따라서 "새로 고침"을 클릭할 필요 없이 방금 작성한 코드를 이미 검색할 수 있습니다.</p>
<p>빠르게 변화하는 개발 환경에서는 이러한 즉시성이 매우 중요합니다.</p>
<h3 id="AST-Parsing-That-Understands-Code-Like-You-Do" class="common-anchor-header">사용자처럼 코드를 이해하는 AST 구문 분석</h3><p>기존의 코드 검색 도구는 텍스트를 줄 또는 문자 수로 분할하여 논리 단위를 깨뜨리고 혼란스러운 결과를 반환하는 경우가 많습니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/AST_Parsing_That_Understands_Code_Like_You_Do_3236afc075.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>코드 컨텍스트는 더 좋습니다. 트리시터 AST 구문 분석을 활용하여 실제 코드 구조를 이해합니다. 완전한 함수, 클래스, 인터페이스 및 모듈을 식별하여 의미적으로 완전한 결과를 제공합니다.</p>
<p>정확한 청킹을 위한 언어별 전략과 함께 JavaScript/TypeScript, Python, Java, C/C++, Go, Rust를 비롯한 주요 프로그래밍 언어를 지원합니다. 지원되지 않는 언어의 경우 규칙 기반 구문 분석으로 돌아가서 충돌이나 빈 결과 없이 우아하게 처리합니다.</p>
<p>이러한 구조화된 코드 단위는 보다 정확한 의미론적 검색을 위해 메타데이터에도 반영됩니다.</p>
<h3 id="Open-Source-and-Extensible-by-Design" class="common-anchor-header">오픈 소스 및 확장 가능한 설계</h3><p>Code Context는 MIT 라이선스에 따라 완전 오픈 소스입니다. 모든 핵심 모듈은 GitHub에서 공개적으로 사용할 수 있습니다.</p>
<p>저희는 개방형 인프라가 강력하고 신뢰할 수 있는 개발자 도구를 구축하는 핵심이라고 믿으며, 개발자들이 새로운 모델, 언어 또는 사용 사례에 맞게 확장할 수 있도록 초대합니다.</p>
<h3 id="Solving-the-Context-Window-Problem-for-AI-Assistants" class="common-anchor-header">AI 어시스턴트를 위한 컨텍스트 창 문제 해결</h3><p>대규모 언어 모델(LLM)에는 컨텍스트 창이라는 어려운 한계가 있습니다. 이로 인해 전체 코드베이스를 볼 수 없기 때문에 완성, 수정 및 제안의 정확도가 떨어집니다.</p>
<p>코드 컨텍스트는 이러한 격차를 해소하는 데 도움이 됩니다. 시맨틱 코드 검색은 <em>올바른</em> 코드 조각을 검색하여 AI 어시스턴트가 추론할 수 있는 관련 컨텍스트를 제공합니다. 이는 모델이 실제로 중요한 부분을 '확대'하여 AI가 생성한 결과물의 품질을 향상시킵니다.</p>
<p>Claude Code 및 Gemini CLI와 같이 널리 사용되는 AI 코딩 도구에는 네이티브 시맨틱 코드 검색 기능이 없으며, 얕은 키워드 기반 휴리스틱에 의존합니다. 코드 컨텍스트는 <strong>MCP를</strong> 통해 통합되면 두뇌가 업그레이드됩니다.</p>
<h3 id="Built-for-Developers-by-Developers" class="common-anchor-header">개발자를 위한, 개발자에 의한, 개발자를 위한 구축</h3><p>Code Context는 모듈식으로 재사용할 수 있도록 패키징되어 있으며, 각 구성 요소는 독립적인 <strong>npm</strong> 패키지로 제공됩니다. 프로젝트에 필요에 따라 혼합, 조합 및 확장할 수 있습니다.</p>
<ul>
<li><p>시맨틱 코드 검색만 필요하신가요? 사용<code translate="no">@zilliz/code-context-core</code></p></li>
<li><p>AI 에이전트에 연결하고 싶으신가요? 추가 <code translate="no">@zilliz/code-context-mcp</code></p></li>
<li><p>자체 IDE/브라우저 도구를 구축하시나요? VSCode 및 Chrome 확장 프로그램 예제를 포크하세요.</p></li>
</ul>
<p>코드 컨텍스트의 몇 가지 적용 예시입니다:</p>
<ul>
<li><p><strong>컨텍스트 인식 자동 완성 플러그인</strong>: 더 나은 LLM 완성을 위해 관련 스니펫을 가져오는<strong>컨텍스트 인식 자동 완성 플러그인</strong> </p></li>
<li><p>주변 코드를 수집하여 수정 제안을 개선하는<strong>지능형 버그 탐지기</strong> </p></li>
<li><p>의미적으로 관련된 위치를 자동으로 찾아주는<strong>안전한 코드 리팩토링 도구</strong> </p></li>
<li><p>시맨틱 코드 관계에서 다이어그램을 생성하는<strong>아키텍처 시각화</strong> 도구</p></li>
<li><p>PR 검토 중에 과거 구현을 표시하는<strong>더 스마트한 코드 검토 도우미</strong> </p></li>
</ul>
<h2 id="Welcome-to-Join-Our-Community" class="common-anchor-header">커뮤니티 가입을 환영합니다<button data-href="#Welcome-to-Join-Our-Community" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://github.com/zilliztech/code-context"><strong>Code Context는</strong></a> 단순한 도구가 아니라 <strong>AI와 벡터 데이터베이스가</strong> 어떻게 함께 작동하여 코드를 진정으로 이해할 수 있는지 살펴볼 수 있는 플랫폼입니다. AI 지원 개발이 표준이 되면서 시맨틱 코드 검색은 기본 기능이 될 것이라고 믿습니다.</p>
<p>모든 종류의 기여를 환영합니다:</p>
<ul>
<li><p>새로운 언어 지원</p></li>
<li><p>새로운 임베딩 모델 백엔드</p></li>
<li><p>혁신적인 AI 지원 워크플로</p></li>
<li><p>피드백, 버그 리포트, 디자인 아이디어</p></li>
</ul>
<p>여기를 찾아주세요:</p>
<ul>
<li><p><a href="https://github.com/zilliztech/code-context">GitHub의 코드 컨텍스트</a> | <a href="https://www.npmjs.com/package/@zilliz/code-context-mcp"><strong>MCP npm 패키지</strong></a> | <a href="https://marketplace.visualstudio.com/items?itemName=zilliz.semanticcodesearch"><strong>VSCode 마켓플레이스</strong></a></p></li>
<li><p><a href="https://discuss.milvus.io/">Discord</a> | <a href="https://www.linkedin.com/company/the-milvus-project/">LinkedIn</a> | <a href="https://x.com/zilliz_universe">X</a> | <a href="https://www.youtube.com/@MilvusVectorDatabase/featured">YouTube</a></p></li>
</ul>
<p>우리는 함께 투명하고 강력하며 개발자 우선의 차세대 AI 개발 도구를 위한 인프라를 구축할 수 있습니다.</p>
<p><a href="https://meetings.hubspot.com/chloe-williams1/milvus-office-hour">
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/office_hour_83d4623510.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</a></p>
