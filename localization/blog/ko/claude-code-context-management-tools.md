---
id: claude-code-context-management-tools.md
title: 클로드 코드 컨텍스트 관리를 위한 최고의 오픈소스 도구 7가지
author: Cheney Zhang
date: 2026-5-7
cover: assets.zilliz.com/cccm_11zon_848f7f1c6b.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  Claude Code context, Claude Code tools, token management, MCP code search, AI
  agent memory
meta_title: |
  7 Best Open-Source Tools for Claude Code Context Management
desc: >-
  긴 클로드 코드 세션은 신호 손실이 빠릅니다. 터미널 노이즈, 코드 검색, 도구 출력, 메모리 및 토큰 사용량을 줄이기 위한 7가지 도구를
  알아보세요.
origin: 'https://milvus.io/blog/claude-code-context-management-tools.md'
---
<p>클로드 코드에 1백만 토큰의 컨텍스트 창을 제공해도 시간이 지남에 따라 더 나쁜 답변을 얻을 수 있습니다. 문제는 컨텍스트 크기뿐만이 아닙니다. 컨텍스트 품질입니다.</p>
<p>터미널 로그, 원시 도구 출력, 반복적인 파일 읽기, 장황한 응답, 잊혀진 프로젝트 기록 등이 모두 관심을 끌기 위해 경쟁할 때 Claude Code 세션의 품질이 저하됩니다. 장기간 실행되는 에이전트 워크플로에서는 이러한 노이즈가 루프로 전환되어 모델이 스레드를 잃고, 답을 수정하기 위해 더 많은 턴을 추가하고, 추가 턴은 더 많은 노이즈를 추가합니다.</p>
<p>이는 <strong>컨텍스트 디포커스입니다</strong>. 모델에 정보를 담을 공간이 충분하지만 중요한 정보는 신호가 적은 컨텍스트에 묻혀버리는 것입니다. 창이 크면 개발자가 프롬프트에 들어갈 내용을 신중하게 생각하지 않기 때문에 이를 무시하기 쉬워집니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_code_context_management_tools_13_3e7a004cd6.png" alt="Prompt caching diagram showing how reused prefixes can still add billed context across turns" class="doc-image" id="prompt-caching-diagram-showing-how-reused-prefixes-can-still-add-billed-context-across-turns" />
   </span> <span class="img-wrapper"> <span>재사용된 접두사가 여러 차례에 걸쳐 청구된 컨텍스트를 추가할 수 있는 방법을 보여주는 프롬프트 캐싱 다이어그램</span> </span></p>
<p>프롬프트 캐싱은 반복되는 접두사 비용을 줄일 수 있지만 컨텍스트 창을 쓰레기통으로 만들지는 않습니다. 여전히 새 토큰에 대한 비용을 지불해야 하며, 올바른 정보를 추론하기 위한 모델이 필요합니다.</p>
<p>이 글에서는 터미널 출력, 도구 출력, 코드베이스 탐색, 파일 읽기, 모델 상세도, 시맨틱 코드 검색, 교차 세션 메모리 등 다양한 계층에서 컨텍스트 디포커스를 공격하는 7가지 오픈 소스 도구를 검토합니다. 또한 이러한 아이디어가 <a href="https://zilliz.com/learn/what-is-vector-database">벡터 데이터베이스</a> 설계, <a href="https://zilliz.com/learn/vector-similarity-search">벡터 유사성 검색</a>, Milvus와 같은 검색 시스템에 어떻게 매핑되는지 설명합니다.</p>
<h2 id="What-causes-Claude-Code-context-defocus" class="common-anchor-header">클로드 코드 컨텍스트 디포커스의 원인은 무엇인가요?<button data-href="#What-causes-Claude-Code-context-defocus" class="anchor-icon" translate="no">
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
    </button></h2><p>클로드 코드 컨텍스트 디포커스는 일반적으로 너무 많은 원시 명령어 텍스트, 노이즈가 많은 도구 출력, 반복적인 코드베이스 탐색, 긴 모델 응답, 세션 또는 에이전트 간 메모리 격차 등 5가지 실패 모드에서 발생합니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_code_context_management_tools_15_56a2da172a.png" alt="Five causes of Claude Code context loss: redundant instructions, messy tool output, repeated codebase retrieval, long responses, and memory gaps" class="doc-image" id="five-causes-of-claude-code-context-loss:-redundant-instructions,-messy-tool-output,-repeated-codebase-retrieval,-long-responses,-and-memory-gaps" />
   </span> <span class="img-wrapper"> <span>클로드 코드 컨텍스트 손실의 다섯 가지 원인: 중복 명령어, 지저분한 도구 출력, 반복되는 코드베이스 검색, 긴 응답, 메모리 공백</span> </span></p>
<table>
<thead>
<tr><th>컨텍스트 실패 모드</th><th>클로드 코드의 모습</th><th>도움이 되는 도구 카테고리</th></tr>
</thead>
<tbody>
<tr><td>터미널 로그가 노이즈</td><td><code translate="no">git</code>, <code translate="no">pytest</code>, <code translate="no">gh</code>, 클라우드 CLI는 모델에 필요한 것보다 더 많은 텍스트를 덤프합니다.</td><td>CLI 출력 압축</td></tr>
<tr><td>창에 넘쳐나는 도구 출력</td><td>테스트 로그, DOM 덤프, MCP 출력은 거대한 원시 블록으로 채팅에 들어옵니다.</td><td>도구 출력 샌드박싱</td></tr>
<tr><td>반복되는 코드베이스 탐색</td><td>Claude는 디렉터리를 나열하고, 파일을 구문 분석하고, 파일을 읽고, 매 세션마다 동일한 탐색을 반복합니다.</td><td>코드 그래프 또는 시맨틱 검색</td></tr>
<tr><td>파일 읽기가 너무 광범위함</td><td>심볼이나 요약 하나만 있으면 되는 파일을 모델이 전체 파일을 읽습니다.</td><td>점진적 코드 읽기</td></tr>
<tr><td>Claude가 너무 많은 말을 함</td><td>답변 자체가 향후 차례를 위해 불필요한 컨텍스트를 추가합니다.</td><td>응답 압축</td></tr>
<tr><td>메모리가 지속되지 않음</td><td>새 세션을 시작할 때마다 프로젝트 결정을 다시 설명합니다.</td><td>마크다운 우선 메모리</td></tr>
</tbody>
</table>
<p>좋은 컨텍스트 관리 스택은 세 가지 기능을 수행해야 합니다. 즉, 정크를 없애고, 필요에 따라 올바른 프로젝트 지식을 검색하고, 세션 전체에서 내구성 있는 결정을 보존하는 것입니다.</p>
<h2 id="Which-Claude-Code-context-tool-should-you-use-first" class="common-anchor-header">어떤 클로드 코드 컨텍스트 도구를 먼저 사용해야 할까요?<button data-href="#Which-Claude-Code-context-tool-should-you-use-first" class="anchor-icon" translate="no">
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
    </button></h2><p>워크플로에서 가장 많은 노이즈를 생성하는 레이어부터 시작하세요. 터미널 출력이 문제라면 RTK부터 시작하세요. Claude가 대규모 리포지토리를 계속 헤매는 경우, claude-context 또는 code-review-graph로 시작하세요. 매일 같은 결정을 다시 설명하는 것이 진짜 고통이라면 memsearch로 시작하세요.</p>
<table>
<thead>
<tr><th>도구</th><th>주요 문제 해결</th><th>가장 적합</th></tr>
</thead>
<tbody>
<tr><td><a href="https://github.com/rtk-ai/rtk">RTK</a></td><td>일반적인 개발자 명령으로 인한 노이즈 터미널 출력.</td><td>클로드 코드 내에서 많은 CLI 명령을 실행하는 개발자.</td></tr>
<tr><td><a href="https://github.com/mksglu/context-mode">컨텍스트 모드</a></td><td>메인 대화에 들어가는 대량의 원시 도구 출력.</td><td>Playwright, GitHub, 로그 또는 MCP 도구 사용량이 많은 사용자.</td></tr>
<tr><td><a href="https://github.com/tirth8205/code-review-graph">코드 리뷰 그래프</a></td><td>대규모 리포지토리에서 블라인드 코드베이스 탐색.</td><td>리뷰, 종속성 분석 및 폭발 반경 질문.</td></tr>
<tr><td><a href="https://github.com/Mibayy/token-savior">토큰 구세주</a></td><td>심볼 요약으로 충분할 때 전체 파일 읽기.</td><td>대용량 파일, 반복적인 심볼 조회, 증분 코드 읽기.</td></tr>
<tr><td><a href="https://github.com/JuliusBrussee/caveman">Caveman</a></td><td>Claude 자신의 장황한 응답 습관.</td><td>간결한 출력과 더 작은 미래 컨텍스트를 원하는 사용자.</td></tr>
<tr><td><a href="https://github.com/zilliztech/claude-context">클로드 컨텍스트</a></td><td>매 세션마다 코드베이스 재탐색.</td><td>MCP를 통한 시맨틱 코드 검색.</td></tr>
<tr><td><a href="https://github.com/zilliztech/memsearch">memsearch</a></td><td>세션, 에이전트 및 모델 전환 간에 프로젝트 메모리 손실 방지.</td><td>내구성 있는 결정과 교훈으로 장기적인 프로젝트 운영.</td></tr>
</tbody>
</table>
<p>처음 다섯 가지 도구는 컨텍스트에 입력되거나 남는 내용을 줄여줍니다. 마지막 두 도구는 유용한 컨텍스트를 더 쉽게 기억할 수 있게 해줍니다.</p>
<h2 id="RTK-compresses-raw-command-output-before-Claude-sees-it" class="common-anchor-header">Claude가 보기 전에 원시 명령 출력을 압축하는 RTK<button data-href="#RTK-compresses-raw-command-output-before-Claude-sees-it" class="anchor-icon" translate="no">
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
    <img translate="no" src="https://assets.zilliz.com/rtk_de6e8e7fb3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>RTK는 일반적인 개발자 명령어에서 토큰 사용량을 줄이기 위한 CLI 프록시입니다. GitHub 설명에 따르면 일반적인 개발 명령에서 LLM 토큰 소비를 60~90%까지 줄여주며, 단일 Rust 바이너리로 제공됩니다.</p>
<p>일상적인 클로드 코드 사용에서 <code translate="no">git status</code>, <code translate="no">pytest</code>, 디렉토리 목록과 같은 명령은 종종 전체 환경 정보 및 상태 설명을 컨텍스트 창에 덤프합니다. 이 모델에는 일반적으로 어떤 파일이 변경되었는지, 어떤 테스트가 실패했는지, PR이 어디에 멈춰 있는지, 디렉터리에 어떤 주요 파일이 존재하는지 등 간단한 대답만 필요합니다.</p>
<p>RTK는 셸과 Claude 사이에 위치합니다. Claude 코드 훅을 통해 명령을 다시 작성하고 압축된 출력을 다시 전달할 수 있습니다.</p>
<p>원시 <code translate="no">git status</code> 출력:</p>
<pre><code translate="no" class="language-bash">On branch feat/payment-retry
Your branch is up to <span class="hljs-built_in">date</span> with <span class="hljs-string">&#x27;origin/feat/payment-retry&#x27;</span>.

Changes not staged <span class="hljs-keyword">for</span> commit:
  modified:   src/webhook/handler.ts
  modified:   src/queue/dlq.ts
  modified:   tests/webhook.test.ts

Untracked files:
  docs/notes.md

no changes added to commit
<button class="copy-code-btn"></button></code></pre>
<p>실제로 중요한 것:</p>
<pre><code translate="no" class="language-bash">3 modified, 1 untracked
- src/webhook/handler.ts
- src/queue/dlq.ts
- tests/webhook.test.ts
<button class="copy-code-btn"></button></code></pre>
<p><code translate="no">pytest</code> 도 마찬가지입니다. 원시 출력은 통과하는 케이스와 환경 노이즈로 가득합니다:</p>
<pre><code translate="no" class="language-markdown">============================= <span class="hljs-built_in">test</span> session starts =============================
platform darwin -- Python 3.12.4, pytest-8.4.1
collected 128 items

tests/test_auth.py ....................................
tests/test_webhook.py ....F....
tests/test_queue.py ...................................

================================== FAILURES ==================================
________________ test_retry_to_dlq __________________
E   AssertionError: expected status code 202, got 500
<button class="copy-code-btn"></button></code></pre>
<p>압축된 출력은 신호가 즉각적입니다:</p>
<pre><code translate="no" class="language-apache">128 tests collected, 1 failed
FAIL tests/test_webhook.py::test_retry_to_dlq
AssertionError: expected status code 202, got 500
<button class="copy-code-btn"></button></code></pre>
<p>컨텍스트 부풀림이 코드 검색이 아닌 셸 명령에서 발생하는 경우 RTK가 가장 쉬운 출발점입니다.</p>
<h2 id="Context-Mode-sandboxes-giant-tool-outputs-outside-the-main-chat" class="common-anchor-header">컨텍스트 모드는 메인 채팅 외부의 거대한 도구 출력을 샌드박스화합니다.<button data-href="#Context-Mode-sandboxes-giant-tool-outputs-outside-the-main-chat" class="anchor-icon" translate="no">
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
    </button></h2><p>컨텍스트 모드는 도구가 반환하는 원시 블록(테스트 로그, 브라우저 DOM 스냅샷, GitHub 페이로드, MCP 도구 출력 및 스크랩된 페이지)을 위해 만들어졌습니다. GitHub 설명에서는 AI 코딩 에이전트를 위한 컨텍스트 창 최적화를 강조하며 98%의 도구 출력 감소를 보고합니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_code_context_management_tools_5_f00e17ea6f.png" alt="Context Mode GitHub repository card showing sandboxed tool output and context optimization positioning" class="doc-image" id="context-mode-github-repository-card-showing-sandboxed-tool-output-and-context-optimization-positioning" />
   </span> <span class="img-wrapper"> <span>샌드박스가 적용된 도구 출력 및 컨텍스트 최적화 위치를 보여주는 컨텍스트 모드 GitHub 리포지토리 카드</span> </span></p>
<p>이 접근 방식은 대규모 도구 출력을 로컬 샌드박스와 인덱스로 분리한 다음 요약과 검색 핸들만 Claude 대화에 전달하는 것입니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_code_context_management_tools_12_32e50fec44.png" alt="Context Mode flow showing large tool output moving through sandbox execution, SQLite or FTS indexes, summaries, and retrieval results" class="doc-image" id="context-mode-flow-showing-large-tool-output-moving-through-sandbox-execution,-sqlite-or-fts-indexes,-summaries,-and-retrieval-results" />
   </span> <span class="img-wrapper"> <span>샌드박스 실행, SQLite 또는 FTS 인덱스, 요약 및 검색 결과를 통해 이동하는 대규모 도구 출력을 보여주는 컨텍스트 모드 흐름</span> </span></p>
<p>이 흐름은 코딩 에이전트가 전체 DOM이나 통과한 모든 테스트 라인이 아니라 실패한 노드, 깨진 선택기 또는 관련 스택 추적이 필요한 경우가 많기 때문에 유용합니다. 컨텍스트 모드는 전체 출력을 로컬에서 사용할 수 있도록 유지하면서 메인 대화를 지배하지 않도록 합니다.</p>
<p>이는 프로덕션 <a href="https://zilliz.com/blog/hybrid-search-with-milvus">하이브리드 검색</a> 시스템이 저장과 검색을 분리하는 방식과 유사합니다. 원시 데이터를 내구성 있는 곳에 보관한 다음 중요한 부분만 검색할 수 있습니다.</p>
<h2 id="code-review-graph-maps-code-structure-before-Claude-navigates-it" class="common-anchor-header">Claude가 탐색하기 전에 코드 구조를 매핑하는 code-review-graph<button data-href="#code-review-graph-maps-code-structure-before-Claude-navigates-it" class="anchor-icon" translate="no">
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
    </button></h2><p>code-review-graph는 다른 문제를 해결합니다. Claude는 항상 더 많은 텍스트가 필요한 것이 아니라 더 나은 맵이 필요합니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_code_context_management_tools_8_6d4632f3c9.png" alt="code-review-graph logo image used in the original article" class="doc-image" id="code-review-graph-logo-image-used-in-the-original-article" />
   </span> <span class="img-wrapper"> <span>원본 문서에 사용된 code-review-graph 로고 이미지</span> </span></p>
<p>대규모 리포지토리에서는 간단한 질문으로 인해 비용이 많이 드는 탐색이 시작될 수 있습니다:</p>
<blockquote>
<p>이 로그인 로직을 변경하면 어떤 파일과 테스트가 영향을 받는가?</p>
</blockquote>
<p>코드 그래프가 없다면 Claude의 일반적인 방법은 다음과 같습니다:</p>
<pre><code translate="no" class="language-perl"><span class="hljs-built_in">read</span> auth.ts
grep login
<span class="hljs-built_in">read</span> middleware
<span class="hljs-built_in">read</span> tests
keep guessing
<button class="copy-code-btn"></button></code></pre>
<p>코드-리뷰-그래프는 코드베이스의 구조 맵을 미리 빌드합니다. Tree-sitter를 사용하여 함수, 클래스, 임포트, 호출 관계, 상속 및 테스트 종속성을 구문 분석한 다음 그래프를 SQLite에 작성합니다.</p>
<p>따라서 코드 검토 및 폭발 반경 분석에 유용합니다. Claude에게 반복적인 읽기를 통해 종속성 그래프를 재발견하도록 요청하는 대신 구조를 먼저 쿼리하도록 할 수 있습니다.</p>
<p>이것은 <a href="https://zilliz.com/blog/semantic-search-vs-lexical-search-vs-full-text-search">시맨틱 검색과</a> 유사하지만 동일하지는 않습니다. 구조 그래프는 "무엇이 무엇에 의존하는가?"라는 질문에 답합니다. 시맨틱 검색은 "어떤 코드가 이 질문과 개념적으로 관련이 있는가?"라는 질문에 답합니다. 실제 코드 어시스턴트 워크플로에서는 이 두 가지가 모두 필요한 경우가 많습니다.</p>
<h2 id="Token-Savior-gives-Claude-symbol-summaries-before-full-files" class="common-anchor-header">토큰 세이비어는 전체 파일보다 먼저 Claude 심볼 요약을 제공합니다.<button data-href="#Token-Savior-gives-Claude-symbol-summaries-before-full-files" class="anchor-icon" translate="no">
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
    </button></h2><p>토큰 세이비어의 핵심 아이디어는 간단합니다. 기본적으로 전체 파일을 보내지 않는다는 것입니다. 인덱스나 심볼 요약을 먼저 보낸 다음, 작업에 더 자세한 정보가 필요할 때만 확장하세요.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_code_context_management_tools_10_5f63ad36d1.png" alt="Token Savior GitHub repository card showing its MCP server description and project statistics" class="doc-image" id="token-savior-github-repository-card-showing-its-mcp-server-description-and-project-statistics" />
   </span> <span class="img-wrapper"> <span>MCP 서버 설명과 프로젝트 통계를 보여주는 Token Savior GitHub 리포지토리 카드</span> </span></p>
<p>결제 웹훅이 처리되는 위치를 묻는 경우, 모델은 모든 관련 파일의 모든 줄이 필요하지 않은 경우가 많습니다. 먼저 파일이나 심볼이 관련성이 있는지 여부를 파악해야 합니다.</p>
<p>토큰 세이버는 코드를 레이어로 제공합니다:</p>
<table>
<thead>
<tr><th>레이어</th><th>클로드가 받는 것</th><th>확장할 때</th></tr>
</thead>
<tbody>
<tr><td>요약</td><td>색인, 심볼 이름 및 간단한 설명.</td><td>기본 첫 번째 응답입니다.</td></tr>
<tr><td>스니펫</td><td>관련 심볼 주변의 작은 코드 섹션입니다.</td><td>요약이 관련성이 있을 때 사용합니다.</td></tr>
<tr><td>전체 파일</td><td>전체 파일 콘텐츠입니다.</td><td>편집 또는 심층 추론이 필요한 경우에만 사용합니다.</td></tr>
</tbody>
</table>
<p>이는 개발자가 실제로 코드를 읽는 방식을 반영합니다. 스캔하여 관련성을 확인한 다음 필요한 경우에만 전체 파일을 열 수 있습니다. 또한 <a href="https://zilliz.com/blog/metadata-filtering-hybrid-search-or-agent-in-rag-applications">RAG 애플리케이션에서</a> 사용되는 점진적 검색 패턴과도 유사합니다. 방향을 잡을 수 있을 만큼 광범위하게 검색한 다음 생성 전에 컨텍스트를 좁혀가는 방식입니다.</p>
<h2 id="Caveman-reduces-Claudes-own-response-bloat" class="common-anchor-header">Claude의 응답 부풀림을 줄여주는 Caveman<button data-href="#Caveman-reduces-Claudes-own-response-bloat" class="anchor-icon" translate="no">
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
    </button></h2><p>대부분의 컨텍스트 도구는 모델에 입력되는 내용에 초점을 맞춥니다. Caveman은 Claude가 출력하는 것을 대상으로 합니다.</p>
<p>Caveman은 필러, 유희, 래퍼 문장, 과도한 설명, 반복적인 구조를 제거하는 Claude 코드 스킬/플러그인입니다. 목표는 지식을 제거하는 것이 아니라 답을 더 밀도 있게 만드는 것입니다.</p>
<p>케이브맨 없이:</p>
<blockquote>
<p>React 컴포넌트가 다시 렌더링되는 이유는 다음과 같습니다.</p>
</blockquote>
<p>Caveman 사용 시:</p>
<blockquote>
<p>렌더링할 때마다 새로운 객체 참조를 생성합니다. 인라인 객체 prop = 새로운 ref = 다시 렌더링. 사용 메모로 래핑합니다.</p>
</blockquote>
<p>이것이 중요한 이유는 클로드의 답변이 미래의 컨텍스트가 되기 때문입니다. 모든 답변에 긴 설명이 포함되어 있으면 다음 차례는 필요 이상으로 많은 텍스트로 시작하게 됩니다. 짧은 답변은 현재 턴을 개선하는 것만큼 다음 턴을 개선할 수 있습니다.</p>
<p><a href="https://zilliz.com/blog/context-engineering-for-ai-agents">AI 에이전트를 위한 컨텍스트 엔지니어링을</a> 고민하는 팀에게 케이브맨은 출력 정책이 컨텍스트 정책의 일부라는 점을 상기시켜 줍니다.</p>
<h2 id="claude-context-adds-semantic-code-search-through-MCP" class="common-anchor-header">MCP를 통해 시맨틱 코드 검색을 추가하는 claude-context<button data-href="#claude-context-adds-semantic-code-search-through-MCP" class="anchor-icon" translate="no">
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
    </button></h2><p>claude-context는 시맨틱 검색을 통해 반복적인 코드베이스 탐색 문제를 해결합니다. 저장소를 색인하고, 코드 청크를 벡터 데이터베이스에 저장하며, <a href="https://zilliz.com/glossary/model-context-protocol-%28mcp%29">모델 컨텍스트 프로토콜을</a> 통해 검색을 노출합니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_code_context_management_tools_2_a0cc547fe3.png" alt="Claude Context repository shown on GitHub Trending in the original article" class="doc-image" id="claude-context-repository-shown-on-github-trending-in-the-original-article" />
   </span> <span class="img-wrapper"> <span>GitHub에 표시된 Claude 컨텍스트 리포지토리 원본 문서의 인기 검색어</span> </span></p>
<p>대규모 코드베이스에서는 다음과 같은 질문을 끊임없이 Claude에게 던집니다:</p>
<blockquote>
<p>코드의 어느 부분이 이 버그와 관련이 있는지 알아낼 수 있게 도와주세요.</p>
</blockquote>
<p>검색 계층이 없는 경우 Claude의 기본 접근 방식은 종종 다음과 같습니다:</p>
<pre><code translate="no" class="language-perl">list the directory
grep around
<span class="hljs-built_in">read</span> a bunch of files
keep guessing
<button class="copy-code-btn"></button></code></pre>
<p>클라우드는 검색 레이어로 작업하는 컨텍스트 이동을 수행합니다. 이 방법은 리포지토리를 청크화하고, 임베딩을 생성하고, <a href="https://milvus.io/blog/claude-context-reduce-claude-code-token-usage.md">Milvus 지원 코드 인덱스에</a> 저장하고, 모델이 무작위로 파일을 읽기 시작하기 전에 관련 코드 청크를 검색합니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_code_context_management_tools_11_f9d952830d.png" alt="claude-context flow showing codebase chunking, embeddings, vector database and hybrid search, relevant code retrieval, and Claude context injection" class="doc-image" id="claude-context-flow-showing-codebase-chunking,-embeddings,-vector-database-and-hybrid-search,-relevant-code-retrieval,-and-claude-context-injection" />
   </span> <span class="img-wrapper"> <span>코드베이스 청킹, 임베딩, 벡터 데이터베이스 및 하이브리드 검색, 관련 코드 검색, Claude 컨텍스트 삽입을 보여주는 클라우데 컨텍스트 흐름.</span> </span></p>
<p>여기서부터 AI 코딩 도구가 검색 시스템처럼 보이기 시작합니다. 청킹, 임베딩, 메타데이터, 어휘 매칭, 순위 지정, 최신성 등이 필요합니다. 이러한 요소들은 <a href="https://zilliz.com/blog/top-10-context-engineering-techniques-you-should-know-for-production-rag">프로덕션 RAG 검색</a>, <a href="https://milvus.io/blog/build-smarter-rag-routing-hybrid-retrieval.md">하이브리드 검색 라우팅</a>, <a href="https://milvus.io/blog/choose-embedding-model-rag-2026.md">임베딩 모델 선택의</a> 기반이 되는 동일한 구성 요소입니다.</p>
<h2 id="memsearch-keeps-useful-memory-across-sessions-and-agents" class="common-anchor-header">세션과 에이전트 전반에서 유용한 메모리를 유지하는 memsearch<button data-href="#memsearch-keeps-useful-memory-across-sessions-and-agents" class="anchor-icon" translate="no">
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
    </button></h2><p>memsearch는 문제의 반대 측면, 즉 무엇을 잊어버릴 것인가가 아니라 중요한 것을 어떻게 기억할 것인가라는 문제를 해결합니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_code_context_management_tools_7_d39c2f200e.png" alt="memsearch logo image from the original article" class="doc-image" id="memsearch-logo-image-from-the-original-article" />
   </span> <span class="img-wrapper"> <span>원본 기사의 memsearch 로고 이미지</span> </span></p>
<p>월요일에 클로드에게 말했다고 상상해 보세요:</p>
<blockquote>
<p>우리 웹훅은 실패에 대해 재시도할 수 없습니다. 실패한 이벤트는 죽은 편지 큐로 보내야 합니다.</p>
</blockquote>
<p>수요일에 새 세션을 열고 다음과 같이 질문합니다:</p>
<blockquote>
<p>웹후크 레이어에서 또 무엇을 최적화할 수 있을까요?</p>
</blockquote>
<p>지속적 메모리가 없으면 클로드는 월요일의 결정을 마치 없었던 일로 처리합니다. 다시 설명합니다.</p>
<p>memsearch는 메모리를 사람이 읽을 수 있는 로컬 마크다운 파일로 저장하고 재구축 가능한 검색 인덱스로 Milvus를 사용합니다. 이러한 설계는 사람이 메모리를 편집할 수 있도록 유지하면서 에이전트가 검색할 수 있도록 합니다.</p>
<p>검색 시 memsearch는 먼저 검색하고 필요한 경우 확장한 다음 필요한 경우에만 원본 기록으로 드릴다운하는 프로그레시브 리콜을 사용합니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/20260507_210137_73d4b0b8ea.png" alt="memsearch progressive retrieval flow showing search, expand, transcript, and summarized return to the main conversation" class="doc-image" id="memsearch-progressive-retrieval-flow-showing-search,-expand,-transcript,-and-summarized-return-to-the-main-conversation" />
   </span> <span class="img-wrapper"> <span>검색, 확장, 대화 내용 및 요약된 내용이 기본 대화로 돌아가는 것을 보여주는 memsearch 점진적 검색 흐름</span> </span></p>
<p>이 마크다운 우선 패턴은 세션, 모델 및 상담원 전반에서 작업하는 팀에 유용합니다. 또한 <a href="https://milvus.io/blog/adding-persistent-memory-to-claude-code-with-the-lightweight-memsearch-plugin.md">장기적인 AI 상담원 메모리</a>, <a href="https://milvus.io/blog/openagents-milvus-how-to-build-smarter-multi-agent-systems-that-share-memory.md">공유 다중 상담원 메모리</a>, <a href="https://zilliz.com/ai-faq/can-context-engineering-help-reduce-context-rot">상담원 시스템의 컨텍스트</a> 썩음 방지라는 광범위한 문제와도 자연스럽게 어울립니다.</p>
<h2 id="How-do-these-tools-work-together" class="common-anchor-header">이러한 도구는 어떻게 함께 작동하나요?<button data-href="#How-do-these-tools-work-together" class="anchor-icon" translate="no">
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
    </button></h2><p>7가지 도구는 상호 보완적인 것이지 서로 바꿀 수 있는 것이 아닙니다. 레이어로 사용하세요.</p>
<table>
<thead>
<tr><th>레이어</th><th>다음 도구를 사용하세요.</th><th>왜</th></tr>
</thead>
<tbody>
<tr><td>명령 노이즈 제거</td><td>RTK</td><td>대용량 터미널 출력이 클로드에 도달하기 전에 압축합니다.</td></tr>
<tr><td>샌드박스 원시 도구 출력</td><td>컨텍스트 모드</td><td>대용량 로그, DOM 및 도구 페이로드를 메인 대화 외부에 보관하세요.</td></tr>
<tr><td>코드 구조 매핑</td><td>코드 리뷰 그래프</td><td>블라인드 파일 읽기 없이 종속성 및 폭발 반경 질문에 답하세요.</td></tr>
<tr><td>점진적으로 코드 읽기</td><td>토큰 구세주</td><td>기호 요약으로 시작한 다음 필요한 경우에만 확장하세요.</td></tr>
<tr><td>Claude의 답변 압축하기</td><td>Caveman</td><td>모델 자체의 출력이 향후 컨텍스트 부풀림이 되는 것을 방지합니다.</td></tr>
<tr><td>관련 코드 검색</td><td>클로드 컨텍스트</td><td>반복되는 grep 루프 대신 시맨틱 및 하이브리드 코드 검색을 사용하세요.</td></tr>
<tr><td>내구성 있는 결정 재사용</td><td>memsearch</td><td>세션, 에이전트 및 모델 스위치 전반에서 프로젝트 기록을 불러올 수 있습니다.</td></tr>
</tbody>
</table>
<p>실용적인 롤아웃 순서는 다음과 같습니다:</p>
<ol>
<li><strong>명백한 노이즈부터 제거하세요.</strong> 셸 출력 및 도구 페이로드가 컨텍스트를 지배하는 경우 RTK 또는 컨텍스트 모드를 추가하세요.</li>
<li><strong>리포지토리 탐색을 수정합니다.</strong> 구조를 위해 코드 리뷰 그래프를 추가하거나 시맨틱 코드 검색을 위해 클라우드 컨텍스트를 추가하세요.</li>
<li><strong>남은 내용을 제어하세요.</strong> 토큰 세이비어와 케이브맨을 사용해 파일 읽기 및 모델 응답을 간결하게 유지하세요.</li>
<li><strong>내구성 있는 지식을 보존하세요.</strong> 반복되는 설명이 병목 현상이 될 때는 memsearch를 사용하세요.</li>
</ol>
<h2 id="Keep-in-touch" class="common-anchor-header">연락 유지<button data-href="#Keep-in-touch" class="anchor-icon" translate="no">
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
<li><a href="https://discord.com/invite/8uyFbECzPX">Milvus Discord 커뮤니티에</a> 가입하여 질문하고 다른 개발자들과 컨텍스트 관리 패턴을 비교하세요.</li>
<li>코드, 메모리 또는 RAG 워크로드를 위한 검색 레이어를 설계하는 데 도움이 필요하다면<a href="https://milvus.io/office-hours">무료 Milvus 오피스 아워 세션을 예약하세요</a>.</li>
<li>인프라 설정을 건너뛰고 싶으신 경우, <a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a> (관리형 Milvus)에서 무료 티어를 통해 시작할 수 있습니다.</li>
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
    </button></h2><p><strong>유용한 컨텍스트를 잃지 않고 클로드 코드 토큰 사용량을 줄이려면 어떻게 해야 하나요?</strong></p>
<p>터미널 출력, 원시 도구 페이로드, 반복되는 코드 읽기 등 가장 시끄러운 입력을 압축하는 것부터 시작하세요. 그런 다음 클라우데가 리포지토리를 처음부터 탐색하는 대신 관련 코드를 가져올 수 있도록 클라우데 컨텍스트 또는 코드 리뷰 그래프와 같은 검색 도구를 추가하세요.</p>
<p><strong>대규모 리포지토리에 claude-context 또는 code-review-graph를 사용해야 하나요?</strong></p>
<p>시맨틱 코드 검색이 필요한 경우, 특히 정확한 파일이나 심볼 이름을 모를 때는 claude-context를 사용하세요. 호출 관계, 가져오기, 테스트 종속성, 검토 폭발 반경과 같은 구조적인 답변이 필요한 경우에는 code-review-graph를 사용하세요.</p>
<p><strong>Claude Code에서 메모리는 코드 검색과 다른가요?</strong></p>
<p>네. 코드 검색은 관련 프로젝트 파일이나 심볼을 찾습니다. 메모리 검색은 영구적인 결정, 사용자 기본 설정, 디버깅 기록, 교차 세션 레슨을 불러옵니다. memsearch는 메모리에 초점을 맞추고, Claude Code는 코드 검색에 초점을 맞춥니다.</p>
<p><strong>이러한 도구가 프롬프트 캐싱이나 더 큰 컨텍스트 창을 대체하나요?</strong></p>
<p>아니요. 프롬프트 캐싱과 큰 컨텍스트 창은 용량과 비용에 도움이 되지만 어떤 정보가 주목할 가치가 있는지를 결정하지는 못합니다. 컨텍스트 관리 도구는 애초에 모델에 입력되는 정보의 품질과 밀도를 향상시킵니다. <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/cccm_11zon_848f7f1c6b.png" alt="cccm 11zon" class="doc-image" id="cccm-11zon" /><span>cccm 11zon</span> </span></p>
