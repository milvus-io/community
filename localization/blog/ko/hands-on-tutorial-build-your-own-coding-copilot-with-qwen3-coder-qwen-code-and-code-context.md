---
id: >-
  hands-on-tutorial-build-your-own-coding-copilot-with-qwen3-coder-qwen-code-and-code-context.md
title: '실습 튜토리얼: Qwen3-Coder, Qwen 코드 및 코드 컨텍스트를 사용하여 나만의 코딩 부조종사 구축하기'
author: Lumina Wang
date: 2025-07-29T00:00:00.000Z
desc: >-
  심층적인 시맨틱 코드 이해를 위해 Qwen3-Coder, Qwen Code CLI 및 코드 컨텍스트 플러그인을 사용하여 나만의 AI 코딩
  부조종사를 만드는 방법을 알아보세요.
cover: assets.zilliz.com/_9dfadf5877.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search, AI Agents, LLM'
meta_keywords: 'Qwen3 Code, Qwen3, Cursor, Code Context, Code Search'
meta_title: |
  Build a Coding Copilot with Qwen3-Coder & Code Context
origin: >-
  https://milvus.io/blog/hands-on-tutorial-build-your-own-coding-copilot-with-qwen3-coder-qwen-code-and-code-context.md
---
<p>AI 코딩 어시스턴트 전장이 빠르게 가열되고 있습니다. Anthropic의 <a href="https://milvus.io/blog/claude-code-vs-gemini-cli-which-ones-the-real-dev-co-pilot.md#Claude-Code-or-Gemini-CLI-Choose-Your-Co-Pilot-Wisely">클로드 코드</a>, 터미널 워크플로우를 뒤흔든 구글의 <a href="https://milvus.io/blog/claude-code-vs-gemini-cli-which-ones-the-real-dev-co-pilot.md#Claude-Code-or-Gemini-CLI-Choose-Your-Co-Pilot-Wisely">제미니 CLI</a>, GitHub 코파일럿을 지원하는 OpenAI의 코덱스, VS Code 사용자를 사로잡은 커서, 그리고 <strong>이제 알리바바 클라우드가 퀀 코드에 뛰어</strong>들었습니다.</p>
<p>솔직히 이것은 개발자에게 좋은 소식입니다. 더 많은 플레이어는 더 나은 도구, 혁신적인 기능, 그리고 가장 중요한 것은 값비싼 독점 솔루션에 대한 <strong>오픈 소스 대안을</strong> 의미합니다. 이 최신 플레이어가 어떤 기능을 제공하는지 알아보세요.</p>
<h2 id="Meet-Qwen3-Coder-and-Qwen-Code" class="common-anchor-header">Qwen3-Coder와 Qwen 코드 만나보기<button data-href="#Meet-Qwen3-Coder-and-Qwen-Code" class="anchor-icon" translate="no">
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
    </button></h2><p>Alibaba Cloud는 최근 여러 벤치마크에서 최첨단 결과를 달성한 오픈 소스 에이전트 코딩 모델인<a href="https://github.com/QwenLM/Qwen3-Coder"> <strong>Qwen3-Coder를</strong></a> 출시했습니다. 또한 Gemini CLI를 기반으로 구축되었지만 Qwen3-Coder를 위한 특수 파서로 강화된 오픈 소스 AI 코딩 CLI 도구인<a href="https://github.com/QwenLM/qwen-code"> <strong>Qwen Code도</strong></a> 출시했습니다.</p>
<p>플래그십 모델인 <strong>Qwen3-Coder-480B-A35B-Instruct는</strong> 358개 프로그래밍 언어에 대한 기본 지원, 256K 토큰 컨텍스트 창(YaRN을 통해 100만 토큰까지 확장 가능), Claude Code, Cline 및 기타 코딩 어시스턴트와의 원활한 통합 등 인상적인 기능을 제공합니다.</p>
<h2 id="The-Universal-Blind-Spot-in-Modern-AI-Coding-Copilots" class="common-anchor-header">최신 AI 코딩 코파일럿의 보편적인 사각지대<button data-href="#The-Universal-Blind-Spot-in-Modern-AI-Coding-Copilots" class="anchor-icon" translate="no">
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
    </button></h2><p>Qwen3-Coder는 강력하지만 저는 코딩 어시스턴트에 더 관심이 많습니다: <strong>Qwen Code입니다</strong>. 제가 흥미로웠던 점은 다음과 같습니다. 모든 혁신에도 불구하고 Qwen Code는 <strong><em>새로운 코드를 생성하는 데는 뛰어나지만 기존 코드베이스를 이해하는 데는 어려움을</em></strong> 겪는다는 점에서 Claude Code 및 Gemini CLI와 똑같은 한계를 공유합니다.</p>
<p>예를 들어 Gemini CLI 또는 Qwen Code에 "이 프로젝트에서 사용자 인증을 처리하는 위치를 찾아달라"고 요청한다고 가정해 보겠습니다. 이 도구는 "로그인" 또는 "비밀번호"와 같은 명백한 키워드를 찾기 시작하지만 중요한 <code translate="no">verifyCredentials()</code> 기능을 완전히 놓칩니다. 비용과 시간이 많이 드는 전체 코드베이스를 컨텍스트로 제공하여 토큰을 소진하지 않는 한, 이러한 도구는 금방 벽에 부딪히게 됩니다.</p>
<p><strong><em>이것이 바로 오늘날 AI 도구의 진정한 격차, 즉 지능형 코드 컨텍스트 이해입니다.</em></strong></p>
<h2 id="Supercharge-Any-Coding-Copilot-with-Semantic-Code-Search" class="common-anchor-header">시맨틱 코드 검색으로 모든 코딩 부조종사의 역량 강화<button data-href="#Supercharge-Any-Coding-Copilot-with-Semantic-Code-Search" class="anchor-icon" translate="no">
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
    </button></h2><p>Claude Code, Gemini CLI, Qwen Code 등 모든 AI 코딩 부조종사에게 코드베이스를 의미론적으로 이해할 수 있는 기능을 부여할 수 있다면 어떨까요? 막대한 구독료 없이도 코드와 데이터를 완벽하게 제어하면서 자체 프로젝트를 위해 Cursor와 같은 강력한 기능을 구축할 수 있다면 어떨까요?</p>
<p>모든 AI 코딩 에이전트를 컨텍스트를 인식하는 강력한 도구로 바꿔주는 오픈 소스, MCP 호환 플러그인인<a href="https://github.com/zilliztech/code-context"> <strong>Code Context를</strong></a>소개합니다. 마치 수년간 코드베이스 작업을 해온 선임 개발자의 기억을 AI 어시스턴트에게 제공하는 것과 같습니다. Qwen Code, Claude Code, Gemini CLI를 사용하든, VSCode에서 작업하든, 심지어 Chrome에서 코딩하든, <strong>Code Context는</strong> 워크플로에 시맨틱 코드 검색 기능을 제공합니다.</p>
<p>어떻게 작동하는지 알아볼 준비가 되셨나요? <strong>Qwen3-Coder + Qwen Code + Code Context를</strong> 사용하여 엔터프라이즈급 AI 코딩 부조종사를 구축해 보겠습니다.</p>
<h2 id="Hands-On-Tutorial-Building-Your-Own-AI-Coding-Copilot" class="common-anchor-header">실습 튜토리얼: 나만의 AI 코파일럿 구축하기<button data-href="#Hands-On-Tutorial-Building-Your-Own-AI-Coding-Copilot" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Prerequisites" class="common-anchor-header">전제 조건</h3><p>시작하기 전에 다음이 필요합니다:</p>
<ul>
<li><p><strong>Node.js 20 이상</strong> 설치</p></li>
<li><p><strong>OpenAI API 키</strong><a href="https://openai.com/index/openai-api/">(여기에서 받기</a>)</p></li>
<li><p>Qwen3-Coder 액세스를 위한<strong>Alibaba Cloud 계정</strong><a href="https://www.alibabacloud.com/en">(여기에서 생성</a>)</p></li>
<li><p>벡터 데이터베이스용<strong>Zilliz Cloud 계정</strong><a href="https://cloud.zilliz.com/login">(</a> 아직 계정이 없는 경우<a href="https://cloud.zilliz.com/login">여기에서</a> 무료로<a href="https://cloud.zilliz.com/login">등록</a> )</p></li>
</ul>
<p><strong>참고 사항</strong><strong>1)</strong> 이 튜토리얼에서는 강력한 코딩 기능과 사용 편의성 때문에 Qwen3-Coder의 상용 버전인 Qwen3-Coder-Plus를 사용할 것입니다. 오픈 소스 옵션을 선호하는 경우 대신 qwen3-coder-480b-a35b-instruct를 사용할 수 있습니다. 2) Qwen3-Coder-Plus는 뛰어난 성능과 사용성을 제공하지만 토큰 소비량이 높습니다. 기업 예산 계획에 이 점을 고려해야 합니다.</p>
<h3 id="Step-1-Environment-Setup" class="common-anchor-header">1단계: 환경 설정</h3><p>Node.js 설치를 확인합니다:</p>
<pre><code translate="no">curl -qL <span class="hljs-attr">https</span>:<span class="hljs-comment">//www.npmjs.com/install.sh | sh</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-2-Install-Qwen-Code" class="common-anchor-header">2단계: Qwen 코드 설치</h3><pre><code translate="no">npm install -g <span class="hljs-meta">@qwen</span>-code/qwen-code
qwen --version
<button class="copy-code-btn"></button></code></pre>
<p>아래와 같은 버전 번호가 표시되면 설치에 성공한 것입니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/1_0d5ebc152e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-3-Configure-Qwen-Code" class="common-anchor-header">3단계: Qwen 코드 구성</h3><p>프로젝트 디렉토리로 이동하여 Qwen 코드를 초기화합니다.</p>
<pre><code translate="no">Qwen
<button class="copy-code-btn"></button></code></pre>
<p>그러면 아래와 같은 페이지가 표시됩니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2_e6598ea982.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>API 구성 요구 사항:</strong></p>
<ul>
<li><p>API 키:<a href="https://modelstudio.console.alibabacloud.com/"> Alibaba 클라우드 모델 스튜디오에서</a> 획득</p></li>
<li><p>기본 URL: <code translate="no">https://dashscope.aliyuncs.com/compatible-mode/v1</code></p></li>
<li><p>모델 선택:</p>
<ul>
<li><p><code translate="no">qwen3-coder-plus</code> (상용 버전, 최고 성능)</p></li>
<li><p><code translate="no">qwen3-coder-480b-a35b-instruct</code> (오픈 소스 버전)</p></li>
</ul></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/3_5ed0c54084.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>구성 후 <strong>Enter</strong> 키를 눌러 계속 진행합니다.</p>
<h3 id="Step-4-Test-Basic-Functionality" class="common-anchor-header">4단계: 기본 기능 테스트</h3><p>두 가지 실제 테스트를 통해 설정을 확인해 보겠습니다:</p>
<p><strong>테스트 1: 코드 이해</strong></p>
<p>프롬프트: "이 프로젝트의 아키텍처와 주요 구성 요소를 한 문장으로 요약하세요."</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/4_41e601fc82.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Qwen3-Coder-Plus는 이 프로젝트를 RAG 시스템, 검색 전략 등에 중점을 두고 Milvus에 구축된 기술 튜토리얼로 요약하여 설명했습니다.</p>
<p><strong>테스트 2: 코드 생성</strong></p>
<p>프롬프트: "작은 테트리스 게임을 만들어 주세요"</p>
<p>1분도 채 안 되어 Qwen3-coder-plus:</p>
<ul>
<li><p>필요한 라이브러리를 자율적으로 설치</p></li>
<li><p>게임 로직 구조화</p></li>
<li><p>플레이 가능한 완전한 구현을 생성합니다.</p></li>
<li><p>일반적으로 몇 시간씩 연구해야 하는 모든 복잡성을 처리합니다.</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/6_c67e1725eb.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/7_fd91d5a290.gif" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>코드 완성뿐만 아니라 아키텍처 의사 결정과 완벽한 솔루션 제공까지 진정한 자율 개발을 보여줍니다.</p>
<h3 id="Step-5-Set-Up-Your-Vector-Database" class="common-anchor-header">5단계: 벡터 데이터베이스 설정</h3><p>이 튜토리얼에서는 <a href="https://zilliz.com/cloud">Zilliz Cloud를</a> 벡터 데이터베이스로 사용하겠습니다.</p>
<p><strong>질리즈 클러스터를 생성합니다:</strong></p>
<ol>
<li><p><a href="https://cloud.zilliz.com/"> 질리즈 클라우드 콘솔에</a> 로그인</p></li>
<li><p>새 클러스터를 생성합니다.</p></li>
<li><p><strong>퍼블릭 엔드포인트와</strong> <strong>토큰</strong> 복사하기</p></li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/8_5e692e6e80.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/9_753f281055.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-6-Configure-Code-Context-Integration" class="common-anchor-header">6단계: 코드 컨텍스트 연동 구성하기</h3><p><code translate="no">~/.qwen/settings.json</code> 을 생성합니다:</p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;mcpServers&quot;</span>: {
    <span class="hljs-string">&quot;code-context&quot;</span>: {
      <span class="hljs-string">&quot;command&quot;</span>: <span class="hljs-string">&quot;npx&quot;</span>,
      <span class="hljs-string">&quot;args&quot;</span>: [<span class="hljs-string">&quot;@zilliz/code-context-mcp@latest&quot;</span>],
      <span class="hljs-string">&quot;env&quot;</span>: {
        <span class="hljs-string">&quot;OPENAI_API_KEY&quot;</span>: <span class="hljs-string">&quot;sk-xxxxxxxxxx&quot;</span>,
        <span class="hljs-string">&quot;MILVUS_ADDRESS&quot;</span>: <span class="hljs-string">&quot;https://in03-xxxx.cloud.zilliz.com&quot;</span>,
        <span class="hljs-string">&quot;MILVUS_TOKEN&quot;</span>: <span class="hljs-string">&quot;4f699xxxxx&quot;</span>
      },
      <span class="hljs-string">&quot;cwd&quot;</span>: <span class="hljs-string">&quot;./server-directory&quot;</span>,
      <span class="hljs-string">&quot;timeout&quot;</span>: <span class="hljs-number">30000</span>,
      <span class="hljs-string">&quot;trust&quot;</span>: <span class="hljs-literal">false</span>
    }
  }
}
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-7-Activate-Enhanced-Capabilities" class="common-anchor-header">7단계: 향상된 기능 활성화</h3><p>Qwen 코드를 다시 시작합니다:</p>
<pre><code translate="no">Qwen
<button class="copy-code-btn"></button></code></pre>
<p><strong>Ctrl + T를</strong> 누르면 MCP 서버 내에 세 가지 새로운 도구가 표시됩니다:</p>
<ul>
<li><p><code translate="no">index-codebase</code>: 리포지토리 이해를 위한 시맨틱 인덱스 생성</p></li>
<li><p><code translate="no">search-code</code>: 코드베이스 전반에서 자연어 코드 검색</p></li>
<li><p><code translate="no">clear-index</code>: 필요한 경우 인덱스 재설정.</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/10_bebbb44460.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-8-Test-the-Complete-Integration" class="common-anchor-header">8단계: 완전한 통합 테스트</h3><p>여기 실제 예가 있습니다: 대규모 프로젝트에서 코드 이름을 검토하던 중 '더 넓은 창'이 비전문적으로 들린다는 것을 발견하여 변경하기로 결정했습니다.</p>
<p>프롬프트: "전문적인 이름 변경이 필요한 '더 넓은 창'과 관련된 모든 함수를 찾아보세요."</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/11_c54398c4f2.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>아래 그림과 같이 qwen3-coder-plus는 먼저 <code translate="no">index_codebase</code> 도구를 호출하여 전체 프로젝트에 대한 인덱스를 생성했습니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/12_25a7f3a039.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>그런 다음 <code translate="no">index_codebase</code> 도구로 이 프로젝트의 539개 파일에 대한 인덱스를 생성하여 9,991개의 청크로 분할했습니다. 인덱스를 만든 직후에는 <code translate="no">search_code</code>도구를 호출하여 쿼리를 수행했습니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/13_6766663346.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>그 다음, 수정이 필요한 해당 파일을 찾았다고 알려주었습니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/14_7b3c7e9cc0.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>마지막으로, 코드 컨텍스트를 사용하여 함수, 가져오기, 문서의 일부 이름 지정 등 4가지 문제를 발견하여 이 작은 작업을 완료하는 데 도움을 주었습니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/15_a529905b28.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>코드 컨텍스트가 추가됨에 따라 <code translate="no">qwen3-coder-plus</code> 이제 더 스마트한 코드 검색과 코딩 환경에 대한 더 나은 이해를 제공합니다.</p>
<h3 id="What-Youve-Built" class="common-anchor-header">구축한 내용</h3><p>이제 결합된 완벽한 AI 코딩 부조종사가 생겼습니다:</p>
<ul>
<li><p><strong>Qwen3-Coder</strong>: 지능형 코드 생성 및 자율 개발</p></li>
<li><p><strong>코드 컨텍스트</strong>: 기존 코드베이스에 대한 의미론적 이해</p></li>
<li><p><strong>범용 호환성</strong>: Claude Code, Gemini CLI, VSCode 등과 함께 사용 가능</p></li>
</ul>
<p>개발 속도 향상뿐 아니라 레거시 현대화, 팀 간 협업 및 아키텍처 진화에 대한 완전히 새로운 접근 방식이 가능합니다.</p>
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
    </button></h2><p>개발자로서 저는 Claude Code부터 Cursor, Gemini CLI, Qwen Code에 이르기까지 수많은 AI 코딩 도구를 사용해 보았지만, 새로운 코드를 생성하는 데는 훌륭하지만 기존 코드베이스를 이해하는 데는 보통 한계가 있었습니다. 함수를 처음부터 새로 작성하는 것이 아니라 복잡하고 지저분한 레거시 코드를 탐색하고 특정 방식으로 작업이 수행된 <em>이유를</em> 파악하는 것이 진정한 문제입니다.</p>
<p>그렇기 때문에 <strong>Qwen3-Coder + Qwen Code + Code Context를</strong> 사용한 이 설정은 매우 매력적입니다. 모든 기능을 갖춘 구현을 생성할 수 있는 강력한 코딩 <em>모델과</em> 프로젝트 기록, 구조 및 명명 규칙을 실제로 이해하는 시맨틱 검색 레이어라는 두 가지 장점을 모두 누릴 수 있습니다.</p>
<p>벡터 검색과 MCP 플러그인 에코시스템을 사용하면 더 이상 프롬프트 창에 임의의 파일을 붙여넣거나 올바른 컨텍스트를 찾기 위해 리포지토리를 스크롤하지 않아도 됩니다. 모든 것을 기억하는 선배 개발자가 있는 것처럼 쉬운 언어로 질문하기만 하면 관련 파일, 기능 또는 결정 사항을 찾아줍니다.</p>
<p>분명히 말하지만, 이 접근 방식은 단순히 속도가 빨라지는 것이 아니라 실제로 작업 방식이 바뀝니다. AI가 단순한 코딩 도우미가 아니라 전체 프로젝트 컨텍스트를 파악하는 팀 동료이자 아키텍처 조력자로서 새로운 종류의 개발 워크플로우를 향한 한 걸음입니다.</p>
<p><em>즉... 공정한 경고입니다: Qwen3-Coder-Plus는 놀랍지만 토큰을 많이 사용합니다. 이 프로토타입을 만드는 데만 2천만 개의 토큰이 소모되었습니다. 그래서 이제 공식적으로 크레딧이 다 떨어졌어요 😅.</em></p>
<p>__</p>
