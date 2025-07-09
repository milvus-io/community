---
id: claude-code-vs-gemini-cli-which-ones-the-real-dev-co-pilot.md
title: '클로드 코드와 제미니 CLI: 어떤 것이 진정한 개발 부조종사인가?'
author: Min Yin
date: 2025-07-09T00:00:00.000Z
desc: >-
  터미널 워크플로우를 혁신하는 두 가지 AI 코딩 도구, Gemini CLI와 Claude Code를 비교해 보세요. 다음 프로젝트에 어떤
  툴을 사용해야 할까요?
cover: assets.zilliz.com/Claude_Code_vs_Gemini_CLI_e3a04a49cf.jpeg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search, Gemini, Claude'
meta_keywords: >-
  Claude Code, Gemini CLI, Natural Language Coding, Vibe Coding, AI Coding
  Assistants
meta_title: |
  Claude Code vs Gemini CLI: Who’s the Real Dev Co-Pilot?
origin: >-
  https://milvus.io/blog/claude-code-vs-gemini-cli-which-ones-the-real-dev-co-pilot.md
---
<p>IDE가 부풀어 있습니다. 코딩 어시스턴트가 오래되었습니다. 아직도 리팩터링을 위해 마우스 오른쪽 버튼을 클릭하고 계신가요? CLI 르네상스에 오신 것을 환영합니다.</p>
<p>AI 코딩 어시스턴트는 기믹에서 필수 도구로 진화하고 있으며 개발자들은 이를 채택하고 있습니다. 스타트업의 센세이션을 일으킨 Cursor를 뛰어넘어, <strong>Anthropic의</strong> <a href="https://www.anthropic.com/claude-code"><strong>Claude Code는</strong></a> 정확성과 세련미를 제공합니다. 구글의 <a href="https://github.com/google-gemini/gemini-cli"><strong>Gemini CLI</strong></a>? 빠르고, 무료이며, 컨텍스트에 굶주려 있습니다. 두 가지 모두 자연어를 새로운 셸 스크립팅으로 만들 것을 약속합니다. 그렇다면 다음 리포지토리를 리팩터링할 때 어느 <em>쪽을</em> 신뢰해야 할까요?</p>
<p>제가 본 바로는 Claude Code가 초기에는 우위를 점하고 있었습니다. 하지만 판도는 빠르게 바뀌었습니다. Gemini CLI가 출시된 후 개발자들이 몰려들어<strong>24시간 만에 15.1만 개의 GitHub 별을</strong> 획득했습니다. 현재 <strong>별은 55,000개를</strong> 넘어섰고 계속 증가하고 있습니다. 놀랍습니다!</p>
<p>많은 개발자가 Gemini CLI에 열광하는 이유를 간단히 설명해드리겠습니다:</p>
<ul>
<li><p><strong>Apache 2.0 기반의 오픈 소스이며 완전 무료입니다:</strong> Gemini CLI는 Google의 최상위 Gemini 2.0 플래시 모델에 무료로 연결됩니다. 개인 Google 계정으로 로그인하기만 하면 Gemini 코드 어시스트에 액세스할 수 있습니다. 미리 보기 기간 동안 분당 최대 60건, 일일 1,000건의 요청을 모두 무료로 이용할 수 있습니다.</p></li>
<li><p><strong>진정한 멀티태스킹의 강자입니다:</strong> 가장 강력한 기능인 프로그래밍 외에도 파일 관리, 콘텐츠 생성, 스크립트 제어, 심층 연구 기능까지 처리합니다.</p></li>
<li><p><strong>가볍습니다:</strong> 터미널 스크립트에 매끄럽게 임베드하거나 독립형 에이전트로 사용할 수 있습니다.</p></li>
<li><p><strong>긴 컨텍스트 길이를 제공합니다:</strong> 1백만 개의 토큰(약 75만 단어)의 컨텍스트가 있어 소규모 프로젝트의 전체 코드베이스를 한 번에 수집할 수 있습니다.</p></li>
</ul>
<h2 id="Why-Developers-Are-Ditching-IDEs-for-AI-Powered-Terminals" class="common-anchor-header">개발자들이 IDE를 버리고 AI 기반 터미널을 선택하는 이유<button data-href="#Why-Developers-Are-Ditching-IDEs-for-AI-Powered-Terminals" class="anchor-icon" translate="no">
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
    </button></h2><p>이러한 터미널 기반 도구에 열광하는 이유는 무엇일까요? 개발자로서 이런 고민을 해본 적이 있을 것입니다: 기존 IDE는 인상적인 기능을 제공하지만 워크플로가 복잡해 개발의 추진력을 떨어뜨립니다. 하나의 함수를 리팩터링하고 싶으신가요? 코드를 선택하고 마우스 오른쪽 버튼을 클릭하여 컨텍스트 메뉴를 선택한 다음 '리팩터링'으로 이동하여 특정 리팩터링 유형을 선택하고 대화 상자에서 옵션을 구성한 다음 마지막으로 변경 사항을 적용해야 합니다.</p>
<p><strong>터미널 AI 도구는 모든 작업을 자연어 명령으로 간소화하여 이러한 워크플로우를 변화시켰습니다.</strong> 명령 구문을 외우는 대신 &quot;<em>가독성을 높이기 위해 이 함수를 리팩터링하게 도와주세요</em>&quot;라고 말하기만 하면 도구가 전체 프로세스를 처리하는 것을 지켜볼 수 있습니다.</p>
<p>이는 단순한 편의성이 아니라 사고 방식의 근본적인 변화입니다. 복잡한 기술 작업이 자연어 대화로 바뀌면서 도구의 메커니즘이 아닌 비즈니스 로직에 집중할 수 있게 됩니다.</p>
<h2 id="Claude-Code-or-Gemini-CLI-Choose-Your-Co-Pilot-Wisely" class="common-anchor-header">클로드 코드 또는 제미니 CLI? 현명한 부조종사 선택<button data-href="#Claude-Code-or-Gemini-CLI-Choose-Your-Co-Pilot-Wisely" class="anchor-icon" translate="no">
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
    </button></h2><p>Claude Code도 꽤 인기 있고 사용하기 쉬우며 이전에는 채택률이 높았는데, 새로운 Gemini CLI와 비교하면 어떤 점이 다를까요? 둘 중 어떤 것을 선택해야 할까요? 이 두 가지 AI 코딩 도구를 자세히 살펴보겠습니다.</p>
<h3 id="1-Cost-Free-vs-Paid" class="common-anchor-header"><strong>1. 비용: 무료 대 유료</strong></h3><ul>
<li><p><strong>Gemini CLI는</strong> 모든 Google 계정에서 완전히 무료로 제공되며, 별도의 결제 설정 없이 하루에 1,000건의 요청과 분당 60건의 요청을 제공합니다.</p></li>
<li><p><strong>Claude Code는</strong> 활성 Anthropic 구독이 필요하며 사용량 기반 유료 모델을 따르지만 상용 프로젝트에 유용한 엔터프라이즈급 보안과 지원이 포함되어 있습니다.</p></li>
</ul>
<h3 id="2-Context-Window-How-Much-Code-Can-It-See" class="common-anchor-header"><strong>2. 컨텍스트 창: 얼마나 많은 코드를 볼 수 있나요?</strong></h3><ul>
<li><p><strong>Gemini CLI:</strong> 1백만 토큰(약 75만 단어)</p></li>
<li><p><strong>클로드 코드:</strong> 약 200,000개의 토큰(약 150,000단어)</p></li>
</ul>
<p>더 큰 컨텍스트 창을 통해 모델은 응답을 생성할 때 더 많은 입력 콘텐츠를 참조할 수 있습니다. 또한 다중 턴 대화에서 대화의 일관성을 유지하여 모델이 전체 대화를 더 잘 기억할 수 있도록 도와줍니다.</p>
<p>기본적으로 Gemini CLI는 단일 세션에서 전체 중소규모 프로젝트를 분석할 수 있으므로 대규모 코드베이스와 파일 간 관계를 이해하는 데 이상적입니다. 특정 파일이나 기능에 집중할 때 클로드 코드가 더 효과적입니다.</p>
<h3 id="3-Code-Quality-vs-Speed" class="common-anchor-header"><strong>3. 코드 품질과 속도 비교</strong></h3><table>
<thead>
<tr><th></th><th></th><th></th><th></th></tr>
</thead>
<tbody>
<tr><td><strong>기능</strong></td><td><strong>Gemini CLI</strong></td><td><strong>클로드 코드</strong></td><td><strong>참고</strong></td></tr>
<tr><td><strong>코딩 속도</strong></td><td>8.5/10</td><td>7.2/10</td><td>Gemini는 코드를 더 빠르게 생성합니다.</td></tr>
<tr><td><strong>코딩 품질</strong></td><td>7.8/10</td><td>9.1/10</td><td>Claude는 더 높은 품질의 코드를 생성합니다.</td></tr>
<tr><td><strong>오류 처리</strong></td><td>7.5/10</td><td>8.8/10</td><td>Claude는 오류 처리에 더 능숙합니다.</td></tr>
<tr><td><strong>컨텍스트 이해</strong></td><td>9.2/10</td><td>7.9/10</td><td>제미니의 메모리가 더 길다</td></tr>
<tr><td><strong>다국어 지원</strong></td><td>8.9/10</td><td>8.5/10</td><td>둘 다 훌륭함</td></tr>
</tbody>
</table>
<ul>
<li><p><strong>Gemini CLI는</strong> 코드를 더 빠르게 생성하고 대규모 컨텍스트를 이해하는 데 탁월하여 신속한 프로토타이핑에 적합합니다.</p></li>
<li><p><strong>Claude Code는</strong> 정밀도와 오류 처리가 뛰어나 코드 품질이 중요한 프로덕션 환경에 더 적합합니다.</p></li>
</ul>
<h3 id="4-Platform-Support-Where-Can-You-Run-It" class="common-anchor-header"><strong>4. 플랫폼 지원: 어디에서 실행할 수 있나요?</strong></h3><ul>
<li><p><strong>Gemini CLI는</strong> 처음부터 Windows, macOS, Linux에서 동일하게 잘 작동합니다.</p></li>
<li><p><strong>Claude Code는</strong> macOS에 먼저 최적화되었으며, 다른 플랫폼에서도 실행할 수 있지만 여전히 최고의 경험은 Mac에서 제공됩니다.</p></li>
</ul>
<h3 id="5-Authentication-and-Access" class="common-anchor-header"><strong>5. 인증 및 액세스</strong></h3><p><strong>클로드 코드를</strong> 사용하려면 활성 Anthropic 구독(프로, 맥스, 팀 또는 엔터프라이즈) 또는 AWS Bedrock/Vertex AI를 통한 API 액세스가 필요합니다. 즉, 사용을 시작하기 전에 과금을 설정해야 합니다.</p>
<p><strong>Gemini CLI는</strong> 개별 Google 계정 소유자를 위한 넉넉한 무료 요금제를 제공하며, 모든 기능을 갖춘 Gemini 2.0 플래시 모델에 대해 하루 1,000건의 무료 요청과 분당 60건의 요청을 제공합니다. 더 높은 한도 또는 특정 모델이 필요한 사용자는 API 키를 통해 업그레이드할 수 있습니다.</p>
<h3 id="6-Feature-Comparison-Overview" class="common-anchor-header"><strong>6. 기능 비교 개요</strong></h3><table>
<thead>
<tr><th></th><th></th><th></th></tr>
</thead>
<tbody>
<tr><td><strong>기능</strong></td><td><strong>클로드 코드</strong></td><td><strong>Gemini CLI</strong></td></tr>
<tr><td>컨텍스트 창 길이</td><td>200만 토큰</td><td>100만 토큰</td></tr>
<tr><td>멀티모달 지원</td><td>제한적</td><td>강력함(이미지, PDF 등)</td></tr>
<tr><td>코드 이해도</td><td>우수</td><td>우수</td></tr>
<tr><td>도구 통합</td><td>기본</td><td>Rich(MCP 서버)</td></tr>
<tr><td>보안</td><td>엔터프라이즈급</td><td>표준</td></tr>
<tr><td>무료 요청</td><td>제한적</td><td>60분, 1000/일</td></tr>
</tbody>
</table>
<h2 id="When-to-Choose-Claude-Code-vs-Gemini-CLI" class="common-anchor-header">언제 클로드 코드와 Gemini CLI를 선택해야 할까요?<button data-href="#When-to-Choose-Claude-Code-vs-Gemini-CLI" class="anchor-icon" translate="no">
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
    </button></h2><p>이제 두 도구의 주요 기능을 비교했으니, 각 도구를 언제 선택해야 하는지에 대한 요점을 정리해 보겠습니다:</p>
<p><strong>다음과 같은 경우 Gemini CLI를 선택하세요:</strong></p>
<ul>
<li><p>비용 효율성과 신속한 실험이 우선 순위인 경우</p></li>
<li><p>대규모 컨텍스트 창이 필요한 대규모 프로젝트에서 작업하는 경우</p></li>
<li><p>최첨단 오픈 소스 도구를 좋아합니다.</p></li>
<li><p>크로스 플랫폼 호환성이 중요한 경우</p></li>
<li><p>강력한 멀티모달 기능을 원하는 경우</p></li>
</ul>
<p><strong>다음과 같은 경우 클로드 코드를 선택하세요:</strong></p>
<ul>
<li><p>고품질 코드 생성이 필요한 경우</p></li>
<li><p>미션 크리티컬한 상용 애플리케이션을 구축하는 경우</p></li>
<li><p>엔터프라이즈급 지원은 타협할 수 없습니다.</p></li>
<li><p>코드 품질이 비용 고려 사항보다 우선하는 경우</p></li>
<li><p>주로 macOS에서 작업하는 경우</p></li>
</ul>
<h2 id="Claude-Code-vs-Gemini-CLI-Setup-and-Best-Practices" class="common-anchor-header">클로드 코드와 Gemini CLI 비교: 설정 및 모범 사례<button data-href="#Claude-Code-vs-Gemini-CLI-Setup-and-Best-Practices" class="anchor-icon" translate="no">
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
    </button></h2><p>이제 이 두 가지 터미널 AI 도구의 기능에 대한 기본적인 이해를 마쳤으니 이제 시작하는 방법과 모범 사례를 자세히 살펴보겠습니다.</p>
<h3 id="Claude-Code-Setup-and-Best-Practices" class="common-anchor-header">클로드 코드 설정 및 모범 사례</h3><p><strong>설치:</strong> Claude Code에는 npm 및 Node.js 버전 18 이상이 필요합니다.</p>
<pre><code translate="no"><span class="hljs-comment"># Install Claude Code on your system</span>
npm install -g @anthropic-ai/claude-code

<span class="hljs-comment"># Set up API key</span>
claude config <span class="hljs-built_in">set</span> api-key YOUR_API_KEY

<span class="hljs-comment"># Verify installation was successful</span>
claude --version

<span class="hljs-comment"># Launch Claude Code</span>
Claude
<button class="copy-code-btn"></button></code></pre>
<p>****  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/1_c413bbf950.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
****</p>
<p><strong>클로드 코드 모범 사례:</strong></p>
<ol>
<li><strong>아키텍처 이해부터 시작하세요:</strong> 새 프로젝트에 접근할 때는 자연어를 사용하여 전체 구조를 먼저 이해하도록 Claude Code에 도움을 요청하세요.</li>
</ol>
<pre><code translate="no"><span class="hljs-meta"># Let Claude analyze project architecture</span>
&gt; Analyze the main architectural components of <span class="hljs-keyword">this</span> project

<span class="hljs-meta"># Understand security mechanisms</span>
&gt; What security measures does <span class="hljs-keyword">this</span> system have?

<span class="hljs-meta"># Get code overview</span>
&gt; Give me an overview of <span class="hljs-keyword">this</span> codebase
<button class="copy-code-btn"></button></code></pre>
<ol start="2">
<li><strong>구체적이고 맥락을 제공하세요:</strong> 더 많은 컨텍스트를 제공할수록 클로드 코드의 제안이 더 정확해집니다.</li>
</ol>
<pre><code translate="no"><span class="hljs-meta"># Implement specific features</span>
&gt; Implement an initial version <span class="hljs-keyword">for</span> GitHub issue <span class="hljs-meta">#123</span>

<span class="hljs-meta"># Code migration</span>
&gt; Help me migrate <span class="hljs-keyword">this</span> codebase to the latest Java version, first create a plan

<span class="hljs-meta"># Code refactoring</span>
&gt; Refactor <span class="hljs-keyword">this</span> function to make it more readable <span class="hljs-keyword">and</span> maintainable
<button class="copy-code-btn"></button></code></pre>
<ol start="3">
<li><strong>디버깅 및 최적화에 사용하세요:</strong></li>
</ol>
<pre><code translate="no"><span class="hljs-meta"># Error analysis</span>
&gt; What caused <span class="hljs-keyword">this</span> error? How can we fix it?

<span class="hljs-meta"># Performance optimization</span>
&gt; Analyze the performance bottlenecks <span class="hljs-keyword">in</span> <span class="hljs-keyword">this</span> code

<span class="hljs-meta"># Code review</span>
&gt; Review <span class="hljs-keyword">this</span> pull request <span class="hljs-keyword">and</span> point <span class="hljs-keyword">out</span> potential issues
<button class="copy-code-btn"></button></code></pre>
<p><strong>요약:</strong></p>
<ul>
<li><p>간단한 코드 설명부터 시작하여 점차 더 복잡한 코드 생성 작업으로 이동하는 점진적 학습을 사용하세요.</p></li>
<li><p>Claude Code는 이전 토론 내용을 기억하므로 대화 컨텍스트 유지</p></li>
<li><p><code translate="no">bug</code> 명령을 사용하여 문제를 보고하고 도구 개선에 도움이 되는 피드백 제공</p></li>
<li><p>데이터 수집 정책을 검토하고 민감한 코드에 주의를 기울여 보안을 유지하세요.</p></li>
</ul>
<h3 id="Gemini-CLI-Setup-and-Best-Practices" class="common-anchor-header">Gemini CLI 설정 및 모범 사례</h3><p><strong>설치하기:</strong> 클로드 코드와 마찬가지로 Gemini CLI도 npm 및 Node.js 버전 18 이상이 필요합니다.</p>
<pre><code translate="no"><span class="hljs-comment"># Install Gemini CLI</span>
npm install -g @google/gemini-cli

<span class="hljs-comment"># Login to your Google account</span>
gemini auth login

<span class="hljs-comment"># Verify installation</span>
gemini --version

<span class="hljs-comment"># Launch Gemini CLI</span>
Gemini
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2_bec1984bb0.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>개인 계정이 있는 경우 Google 계정으로 로그인하여 즉시 액세스할 수 있으며, 분당 요청 횟수는 60회로 제한됩니다. 더 높은 제한을 설정하려면 API 키를 구성하세요:</p>
<pre><code translate="no"><span class="hljs-keyword">export</span> <span class="hljs-variable constant_">GEMINI_API_KEY</span>=<span class="hljs-string">&quot;YOUR_API_KEY&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>Gemini CLI의 모범 사례를 참조하세요:</strong></p>
<ol>
<li><strong>아키텍처 이해부터 시작하세요:</strong> 클로드 코드와 마찬가지로 새 프로젝트에 접근할 때는 먼저 자연어를 사용하여 전체 구조를 이해하는 데 Gemini CLI의 도움을 받으세요. Gemini CLI는 100만 개의 토큰 컨텍스트 창을 지원하므로 대규모 코드베이스 분석에 매우 효과적이라는 점에 유의하세요.</li>
</ol>
<pre><code translate="no"><span class="hljs-meta"># Analyze project architecture</span>
&gt; Analyze the main architectural components of <span class="hljs-keyword">this</span> project

<span class="hljs-meta"># Understand security mechanisms</span>
&gt; What security measures does <span class="hljs-keyword">this</span> system have?

<span class="hljs-meta"># Get code overview</span>
&gt; Give me an overview of <span class="hljs-keyword">this</span> codebase
<button class="copy-code-btn"></button></code></pre>
<ol start="2">
<li><strong>멀티모달 기능을 활용하세요:</strong> 바로 이 부분에서 Gemini CLI의 진가가 빛을 발합니다.</li>
</ol>
<pre><code translate="no"><span class="hljs-meta"># Generate app from PDF</span>
&gt; Create a <span class="hljs-keyword">new</span> app based <span class="hljs-keyword">on</span> <span class="hljs-keyword">this</span> PDF design document

<span class="hljs-meta"># Generate code from sketch</span>
&gt; Generate frontend code based <span class="hljs-keyword">on</span> <span class="hljs-keyword">this</span> UI sketch

<span class="hljs-meta"># Image processing tasks</span>
&gt; Convert all images <span class="hljs-keyword">in</span> <span class="hljs-keyword">this</span> directory to PNG format <span class="hljs-keyword">and</span> rename <span class="hljs-keyword">using</span> EXIF data
<button class="copy-code-btn"></button></code></pre>
<ol start="3">
<li><strong>도구 통합 살펴보기:</strong> Gemini CLI는 여러 도구 및 MCP 서버와 통합하여 기능을 강화할 수 있습니다.</li>
</ol>
<pre><code translate="no"><span class="hljs-comment"># Connect external tools</span>
&gt; Use MCP server to connect my <span class="hljs-built_in">local</span> system tools

<span class="hljs-comment"># Media generation</span>
&gt; Use Imagen to generate project logo

<span class="hljs-comment"># Search integration</span>
&gt; Use Google search tool to find related technical documentation
<button class="copy-code-btn"></button></code></pre>
<p><strong>요약:</strong></p>
<ul>
<li><p>프로젝트 지향적입니다: 항상 프로젝트 디렉토리에서 Gemini를 실행하여 컨텍스트를 더 잘 이해하세요.</p></li>
<li><p>텍스트뿐만 아니라 이미지, 문서 및 기타 미디어를 입력으로 사용하여 멀티모달 기능 극대화</p></li>
<li><p>외부 툴과 MCP 서버를 연결하여 툴 통합을 탐색하세요.</p></li>
<li><p>최신 정보에 대한 기본 제공 Google 검색을 사용하여 검색 기능 향상</p></li>
</ul>
<h2 id="AI-Code-is-Outdated-on-Arrival-Here’s-How-to-Fix-it-with-Milvus" class="common-anchor-header">도착 시 AI 코드가 오래되었습니다. Milvus로 해결하는 방법은 다음과 같습니다.<button data-href="#AI-Code-is-Outdated-on-Arrival-Here’s-How-to-Fix-it-with-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p><em>Claude Code 및 Gemini CLI와 같은 AI 코딩 도구는 강력하지만</em> <strong><em>최신 정보를 알 수 없다는</em></strong><em>맹점이 있습니다</em><em>.</em></p>
<p><em>현실은 어떨까요? 대부분의 모델은 즉시 오래된 패턴을 생성합니다. 몇 달 전, 때로는 몇 년 전에 교육을 받았기 때문입니다. 따라서 코드를 빠르게 생성할 수는 있지만</em> <strong><em>최신 API</em></strong><em>, 프레임워크 또는 SDK 버전을</em><em>반영한다고 보장할 수는 없습니다</em><em>.</em></p>
<p><strong>실제 예시:</strong></p>
<p>커서에게 Milvus에 연결하는 방법을 물어보면 이런 답이 돌아올 수 있습니다:</p>
<pre><code translate="no">connections.<span class="hljs-title function_">connect</span>(<span class="hljs-string">&quot;default&quot;</span>, host=<span class="hljs-string">&quot;localhost&quot;</span>, port=<span class="hljs-string">&quot;19530&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>이 방법은 이제 더 이상 사용되지 않는다는 점을 제외하면 괜찮아 보입니다. 권장되는 접근 방식은 <code translate="no">MilvusClient</code> 을 사용하는 것이지만 대부분의 어시스턴트는 아직 이 방법을 모릅니다.</p>
<p>또는 OpenAI의 자체 API를 사용하세요. 많은 도구가 여전히 <code translate="no">openai.ChatCompletion</code> 을 통해 <code translate="no">gpt-3.5-turbo</code> 을 제안하지만 2024년 3월에 더 이상 사용되지 않는 방법입니다. 이 방법은 더 느리고, 더 많은 비용이 들며, 더 나쁜 결과를 제공합니다. 하지만 LLM은 이를 알지 못합니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/3_8f0d1a42b6.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/3_5_3f4c4a0d4c.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="The-Fix-Real-Time-Intelligence-with-Milvus-MCP-+-RAG" class="common-anchor-header">해결책이 있습니다: Milvus MCP + RAG를 통한 실시간 인텔리전스</h3><p>이 문제를 해결하기 위해 두 가지 강력한 아이디어를 결합했습니다:</p>
<ul>
<li><p>바로<strong>모델 컨텍스트 프로토콜(MCP)</strong>입니다: 자연어를 통해 라이브 시스템과 상호 작용하는 에이전트 도구의 표준</p></li>
<li><p><strong>검색 증강 세대(RAG</strong>): 가장 최신의 관련성 높은 콘텐츠를 온디맨드 방식으로 가져옵니다.</p></li>
</ul>
<p>이 두 가지를 함께 사용하면 어시스턴트를 더욱 스마트하고 최신 상태로 만들 수 있습니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/4_e6bc6cacd6.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>작동 방식은 다음과 같습니다:</strong></p>
<ol>
<li><p>문서, SDK 참조 및 API 가이드를 사전 처리합니다.</p></li>
<li><p>오픈 소스 벡터 데이터베이스인 <a href="https://milvus.io/"><strong>Milvus에</strong></a> 벡터 임베딩으로 저장합니다.</p></li>
<li><p>개발자가 질문(예: "Milvus에 연결하려면 어떻게 해야 하나요?")을 하면 시스템에서</p>
<ul>
<li><p><strong>시맨틱 검색을</strong> 실행합니다.</p></li>
<li><p>가장 관련성이 높은 문서와 예제를 검색합니다.</p></li>
<li><p>이를 어시스턴트의 프롬프트 컨텍스트에 삽입합니다.</p></li>
</ul></li>
</ol>
<ol start="4">
<li>결과: <strong>현재 상황을 정확히</strong> 반영하는 코드 제안</li>
</ol>
<h3 id="Live-Code-Live-Docs" class="common-anchor-header">라이브 코드, 라이브 문서</h3><p><strong>Milvus MCP 서버를</strong> 사용하면 이 흐름을 코딩 환경에 직접 연결할 수 있습니다. 어시스턴트가 더 똑똑해집니다. 코드가 더 좋아집니다. 개발자는 흐름을 유지할 수 있습니다.</p>
<p>이는 단순한 이론이 아니라 Cursor의 에이전트 모드, Context7, DeepWiki와 같은 다른 설정과 비교하여 실제 테스트를 거쳤습니다. 어떤 차이가 있을까요? Milvus + MCP는 단순히 프로젝트를 요약하는 데 그치지 않고 프로젝트와 동기화 상태를 유지합니다.</p>
<p>실제로 확인해 보세요: <a href="https://milvus.io/blog/why-vibe-coding-generate-outdated-code-and-how-to-fix-it-with-milvus-mcp.md">Vibe 코딩에서 오래된 코드가 생성되는 이유와 Milvus MCP로 이를 해결하는 방법 </a></p>
<h2 id="The-Future-of-Coding-is-ConversationalAnd-Its-Happening-Right-Now" class="common-anchor-header">코딩의 미래는 대화형이며 지금 바로 일어나고 있습니다.<button data-href="#The-Future-of-Coding-is-ConversationalAnd-Its-Happening-Right-Now" class="anchor-icon" translate="no">
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
    </button></h2><p>터미널 AI 혁명은 이제 막 시작되었습니다. 이러한 도구가 발전함에 따라 개발 워크플로와 더욱 긴밀하게 통합되고, 코드 품질이 향상되며, MCP+RAG와 같은 접근 방식을 통해 통화 문제를 해결할 수 있게 될 것입니다.</p>
<p>품질 면에서 Claude Code를 선택하든, 접근성과 성능 면에서 Gemini CLI를 선택하든 한 가지 분명한 것은 <strong>자연어 프로그래밍은 계속 유지될</strong> 것이라는 점입니다. 문제는 이러한 도구를 채택할지 여부가 아니라 개발 워크플로에 효과적으로 통합하는 방법입니다.</p>
<p>우리는 구문을 암기하는 것에서 코드와 대화하는 것으로의 근본적인 변화를 목격하고 있습니다. <strong>코딩의 미래는 대화형이며, 지금 바로 여러분의 터미널에서 일어나고 있습니다.</strong></p>
<h2 id="Keep-Reading" class="common-anchor-header">계속 읽기<button data-href="#Keep-Reading" class="anchor-icon" translate="no">
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
    </button></h2><ul>
<li><p><a href="https://milvus.io/blog/building-a-production-ready-ai-assistant-with-spring-boot-and-milvus.md">Spring Boot와 Milvus로 프로덕션에 바로 사용할 수 있는 AI 어시스턴트 구축하기</a></p></li>
<li><p><a href="https://zilliz.com/blog/introducing-zilliz-mcp-server">Zilliz MCP 서버: 벡터 데이터베이스에 대한 자연어 액세스 - Zilliz 블로그</a></p></li>
<li><p><a href="https://milvus.io/blog/vdbbench-1-0-benchmarking-with-your-real-world-production-workloads.md">VDBBench 1.0: 벡터 데이터베이스를 위한 실제 벤치마킹 - Milvus 블로그</a></p></li>
<li><p><a href="https://milvus.io/blog/why-vibe-coding-generate-outdated-code-and-how-to-fix-it-with-milvus-mcp.md">바이브 코딩에서 오래된 코드가 생성되는 이유와 Milvus MCP로 이를 해결하는 방법 - Milvus 블로그</a></p></li>
<li><p><a href="https://milvus.io/blog/why-ai-databases-do-not-need-sql.md">AI 데이터베이스에 SQL이 필요 없는 이유 </a></p></li>
</ul>
