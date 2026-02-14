---
id: >-
  adding-persistent-memory-to-claude-code-with-the-lightweight-memsearch-plugin.md
title: 경량 memsearch 플러그인을 사용하여 클로드 코드에 영구 메모리 추가하기
author: Cheney Zhang
date: 2026-02-13T00:00:00.000Z
cover: assets.zilliz.com/blog_cover_memsearch_ccplugin_43b5ecfd6f.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'OpenClaw, vector search, Milvus, Claude Code'
meta_keywords: >-
  Claude Code memory, Claude Code plugin, persistent memory, ccplugin, long-term
  memory AI
meta_title: |
  Persistent Memory for Claude Code: memsearch ccplugin
desc: >-
  memsearch ccplugin으로 클로드 코드에 장기 메모리를 제공하세요. 가볍고 투명한 마크다운 스토리지, 자동 시맨틱 검색, 토큰
  오버헤드 제로.
origin: >-
  https://milvus.io/blog/adding-persistent-memory-to-claude-code-with-the-lightweight-memsearch-plugin.md
---
<p>최근에 모든 에이전트에 지속적이고 투명하며 사람이 편집할 수 있는 메모리를 제공하는 독립형 플러그 앤 플레이 장기 메모리 라이브러리인 <a href="https://github.com/zilliztech/memsearch">memsearch를</a> 구축하여 오픈 소스화했습니다. 이 라이브러리는 OpenClaw와 동일한 기본 메모리 아키텍처를 사용하지만, OpenClaw 스택의 나머지 부분이 없습니다. 즉, 모든 에이전트 프레임워크(Claude, GPT, Llama, 사용자 지정 에이전트, 워크플로 엔진)에 드롭하여 즉시 내구성 있고 쿼리 가능한 메모리를 추가할 수 있습니다. <em>(멤서치 작동 방식에 대해 자세히 알아보려면</em> <a href="https://milvus.io/blog/we-extracted-openclaws-memory-system-and-opensourced-it-memsearch.md"><em>여기에 별도의 게시물을</em></a> <em> 작성하세요</em><em>.)</em></p>
<p>대부분의 상담원 워크플로우에서 멤서치는 의도한 대로 정확하게 작동합니다. 하지만 <strong>에이전트 코딩은</strong> 다른 이야기입니다. 코딩 세션이 오래 걸리고 컨텍스트 전환이 수시로 이루어지며 보관할 가치가 있는 정보가 며칠 또는 몇 주에 걸쳐 축적됩니다. 이러한 엄청난 양과 변동성은 일반적인 에이전트 메모리 시스템(멤서치 포함)의 약점을 노출시킵니다. 코딩 시나리오에서 검색 패턴은 기존 도구를 그대로 재사용할 수 없을 정도로 다양합니다.</p>
<p>이 문제를 해결하기 위해 <strong>Claude Code를 위해 특별히 설계된 영구 메모리 플러그인을</strong> 구축했습니다. 이 플러그인은 memsearch CLI 위에 위치하며, <strong>memsearch ccplugin이라고</strong> 부릅니다.</p>
<ul>
<li>GitHub 리포지토리: <a href="https://github.com/zilliztech/memsearch"></a> <em> https://zilliztech.github.io/memsearch/claude-plugin/(오픈 소스, MIT 라이선스)</em></li>
</ul>
<p>백그라운드에서 메모리를 관리하는 경량 <strong>memsearch ccplugin을</strong> 통해 Claude Code는 모든 대화, 모든 결정, 모든 스타일 선호도, 모든 며칠간의 스레드를 자동으로 색인하고, 완벽하게 검색 가능하며, 세션 전반에 걸쳐 영구적으로 기억할 수 있는 기능을 확보할 수 있습니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/memsearch_plugin_diagram_41563f84dd.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>이 글 전체에서 명확히 하기 위해 "ccplugin"은 상위 계층 또는 Claude Code 플러그인 자체를 의미합니다. "memsearch"는 하위 계층, 즉 그 아래에 있는 독립 실행형 CLI 도구를 의미합니다.</em></p>
<p>그렇다면 코딩에 자체 플러그인이 필요한 이유는 무엇이며, 왜 이렇게 가벼운 것을 만들었을까요? 그것은 거의 확실하게 두 가지 문제로 귀결됩니다: 클로드 코드의 영구 메모리 부족과 클로드 멤과 같은 기존 솔루션의 번거로움과 복잡성입니다.</p>
<p>그렇다면 전용 플러그인을 구축하는 이유는 무엇일까요? 코딩 에이전트는 두 가지 문제점에 부딪히기 때문입니다:</p>
<ul>
<li><p>클로드 코드에는 영구 메모리가 없습니다.</p></li>
<li><p><em>클라우드 멤과</em>같은 기존의 많은 커뮤니티 솔루션은 강력하지만 무겁고 투박하거나 일상적인 코딩 작업에는 지나치게 복잡합니다.</p></li>
</ul>
<p>ccplugin은 멤서치 위에 최소한의 투명하고 개발자 친화적인 레이어를 추가하여 이 두 가지 문제를 모두 해결하는 것을 목표로 합니다.</p>
<h2 id="Claude-Codes-Memory-Problem-It-Forgets-Everything-When-a-Session-Ends" class="common-anchor-header">클로드 코드의 메모리 문제: 세션이 종료되면 모든 것을 잊어버림<button data-href="#Claude-Codes-Memory-Problem-It-Forgets-Everything-When-a-Session-Ends" class="anchor-icon" translate="no">
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
    </button></h2><p>Claude Code 사용자가 가장 많이 겪어봤을 시나리오부터 시작하겠습니다.</p>
<p>아침에 Claude Code를 열었습니다. "어제의 인증 리팩터링 계속"이라고 입력합니다. Claude가 대답합니다: "어제 무슨 작업을 하셨는지 잘 모르겠네요." 그래서 다음 10분 동안 어제의 로그를 복사하여 붙여넣는 데 시간을 보냅니다. 큰 문제는 아니지만 너무 자주 나타나기 때문에 금방 짜증이 납니다.</p>
<p>Claude Code에는 자체 메모리 메커니즘이 있지만 만족스럽지는 않습니다. <code translate="no">CLAUDE.md</code> 파일은 프로젝트 지시어와 환경 설정을 저장할 수 있지만 정적 규칙과 짧은 명령어에 더 효과적이지 장기적인 지식을 축적하는 데는 적합하지 않습니다.</p>
<p>Claude Code는 <code translate="no">resume</code> 및 <code translate="no">fork</code> 명령을 제공하지만 사용자 친화적이지 않습니다. 포크 명령의 경우 세션 ID를 기억하고, 수동으로 명령을 입력하고, 분기 대화 기록 트리를 관리해야 합니다. <code translate="no">/resume</code> 을 실행하면 세션 제목의 벽이 나타납니다. 며칠 전에 수행한 작업에 대한 몇 가지 세부 사항만 기억하고 있다면 올바른 것을 찾는 데 어려움을 겪을 수 있습니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/code_snippet_82ec01cc5e.jpeg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>장기적인 프로젝트 간 지식 축적을 위해서는 이러한 접근 방식은 불가능합니다.</p>
<p>이 아이디어를 실현하기 위해 claude-mem은 3계층 메모리 시스템을 사용합니다. 첫 번째 계층은 높은 수준의 요약을 검색합니다. 두 번째 계층은 타임라인을 파헤쳐 더 자세한 내용을 확인합니다. 세 번째 계층은 원시 대화를 위해 전체 관찰 내용을 가져옵니다. 그 외에도 개인정보 보호 라벨, 비용 추적, 웹 시각화 인터페이스가 있습니다.</p>
<p>내부 작동 방식은 다음과 같습니다:</p>
<ul>
<li><p><strong>런타임 레이어.</strong> Node.js Worker 서비스는 포트 37777에서 실행됩니다. 세션 메타데이터는 경량 SQLite 데이터베이스에 저장됩니다. 벡터 데이터베이스는 메모리 콘텐츠에 대한 정확한 의미 검색을 처리합니다.</p></li>
<li><p><strong>인터랙션 레이어.</strong> React 기반 웹 UI를 통해 요약, 타임라인, 원시 기록 등 캡처된 메모리를 실시간으로 볼 수 있습니다.</p></li>
<li><p><strong>인터페이스 레이어.</strong> MCP(모델 컨텍스트 프로토콜) 서버는 표준화된 도구 인터페이스를 노출합니다. Claude는 <code translate="no">search</code> (높은 수준의 요약 쿼리), <code translate="no">timeline</code> (자세한 타임라인 보기), <code translate="no">get_observations</code> (원시 인터랙션 기록 검색)을 호출하여 메모리를 직접 검색하고 사용할 수 있습니다.</p></li>
</ul>
<p>공정하게 말하자면, 이것은 Claude Code의 메모리 문제를 해결하는 견고한 제품입니다. 하지만 일상적으로 사용하기에는 투박하고 복잡합니다.</p>
<table>
<thead>
<tr><th>레이어</th><th>기술</th></tr>
</thead>
<tbody>
<tr><td>언어</td><td>TypeScript(ES2022, ESNext 모듈)</td></tr>
<tr><td>런타임</td><td>Node.js 18+</td></tr>
<tr><td>데이터베이스</td><td>bun:sqlite 드라이버가 포함된 SQLite 3</td></tr>
<tr><td>벡터 스토어</td><td>ChromaDB(선택 사항, 시맨틱 검색용)</td></tr>
<tr><td>HTTP 서버</td><td>Express.js 4.18</td></tr>
<tr><td>실시간</td><td>서버 전송 이벤트(SSE)</td></tr>
<tr><td>UI 프레임워크</td><td>React + 타입스크립트</td></tr>
<tr><td>AI SDK</td><td>@anthropic-ai/claude-agent-sdk</td></tr>
<tr><td>빌드 도구</td><td>esbuild(타입스크립트 번들)</td></tr>
<tr><td>프로세스 관리자</td><td>Bun</td></tr>
<tr><td>테스트</td><td>Node.js 내장 테스트 러너</td></tr>
</tbody>
</table>
<p><strong>우선 설정이 번거롭습니다.</strong> 클라우드 메모리를 실행하려면 Node.js, Bun, MCP 런타임을 설치한 다음 그 위에 Worker 서비스, Express 서버, React UI, SQLite, 벡터 스토어를 설치해야 합니다. 이는 배포, 유지보수, 문제가 발생했을 때 디버깅해야 하는 수많은 움직이는 부품을 의미합니다.</p>
<p><strong>또한 이러한 모든 구성 요소는 사용자가 요청하지 않은 토큰을 소모합니다.</strong> MCP 도구 정의는 Claude의 컨텍스트 창에 영구적으로 로드되며, 모든 도구 호출은 요청과 응답에서 토큰을 소모합니다. 세션이 길어지면 이러한 오버헤드가 빠르게 누적되어 토큰 비용이 통제 불능 상태가 될 수 있습니다.</p>
<p><strong>메모리 리콜은 클로드의 검색 선택에 전적으로 의존하기 때문에 신뢰할 수 없습니다.</strong> Claude는 검색을 트리거하기 위해 <code translate="no">search</code> 같은 도구를 호출할지 여부를 스스로 결정해야 합니다. 메모리가 필요하다고 인식하지 못하면 관련 콘텐츠가 표시되지 않습니다. 그리고 세 가지 메모리 계층은 각각 명시적인 도구 호출이 필요하므로 Claude가 찾을 생각을 하지 않을 경우 대체할 수 있는 방법이 없습니다.</p>
<p><strong>마지막으로, 데이터 저장소가 불투명하여 디버깅과 마이그레이션이 불편합니다.</strong> 세션 메타데이터의 경우 SQLite에, 바이너리 벡터 데이터의 경우 Chroma에 메모리가 분할되어 있으며, 이를 하나로 묶어주는 개방형 형식이 없습니다. 마이그레이션은 내보내기 스크립트를 작성하는 것을 의미합니다. AI가 실제로 기억하는 것을 확인하려면 웹 UI 또는 전용 쿼리 인터페이스를 통해 확인해야 합니다. 원시 데이터만 볼 수 있는 방법은 없습니다.</p>
<h2 id="Why-the-memsearch-Plugin-for-Claude-Code-is-Better" class="common-anchor-header">클로드 코드용 memsearch 플러그인이 더 나은 이유는 무엇인가요?<button data-href="#Why-the-memsearch-Plugin-for-Claude-Code-is-Better" class="anchor-icon" translate="no">
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
    </button></h2><p>저희는 추가 서비스, 복잡한 아키텍처, 운영 오버헤드 없이 정말 가벼운 메모리 계층을 원했습니다. 이것이 바로 <strong>memsearch ccplugin을</strong> 개발하게 된 동기입니다. 이 실험의 핵심은 <em>코딩 중심의 메모리 시스템이 근본적으로 더 간단해질 수 있을까</em> 하는 것이었습니다.</p>
<p>그리고 우리는 그것을 증명했습니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/memsearch_icon_d68365006a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>전체 ccplugin은 4개의 셸 훅과 백그라운드 감시 프로세스로 구성되어 있습니다. Node.js도 없고, MCP 서버도 없고, 웹 UI도 없습니다. 단지 memsearch CLI를 호출하는 셸 스크립트일 뿐이므로 설정 및 유지 관리의 부담이 크게 줄어듭니다.</p>
<p>ccplugin이 이렇게 얇을 수 있는 이유는 엄격한 책임 경계 때문입니다. 메모리 저장, 벡터 검색, 텍스트 임베딩을 처리하지 않습니다. 이 모든 것은 그 아래에 있는 memsearch CLI에 위임되어 있습니다. ccplugin의 역할은 단 하나, Claude Code의 수명 주기 이벤트(세션 시작, 프롬프트 제출, 응답 중지, 세션 종료)를 해당 memsearch CLI 함수에 연결하는 것입니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/memsearch_diagram_2_6b2dbeaaf6.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>이렇게 분리된 설계 덕분에 Claude Code를 넘어서는 유연한 시스템을 구축할 수 있습니다. memsearch CLI는 다른 IDE, 다른 에이전트 프레임워크 또는 일반 수동 호출과도 독립적으로 작동합니다. 단일 사용 사례에 종속되지 않습니다.</p>
<p>실제로 이 설계는 세 가지 주요 이점을 제공합니다.</p>
<h3 id="1-All-Memories-Live-in-Plain-Markdown-Files" class="common-anchor-header">1. 모든 메모리가 일반 마크다운 파일에 저장됨</h3><p>ccplugin이 생성하는 모든 메모리는 <code translate="no">.memsearch/memory/</code> 에 마크다운 파일로 저장됩니다.</p>
<pre><code translate="no">.memsearch/memory/
├── 2026-02-09.md
├── 2026-02-10.md
└── 2026-02-11.md
<button class="copy-code-btn"></button></code></pre>
<p>하루에 하나의 파일입니다. 각 파일에는 사람이 읽을 수 있는 일반 텍스트로 그날의 세션 요약이 포함되어 있습니다. 다음은 memsearch 프로젝트 자체의 일일 메모리 파일 스크린샷입니다:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/markdown_file_d0ab53e13b.jpeg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>타임스탬프, 세션 ID, 턴 ID, 세션 요약 등 형식을 바로 확인할 수 있습니다. 아무것도 숨겨져 있지 않습니다.</p>
<p>AI가 무엇을 기억하는지 알고 싶으신가요? 마크다운 파일을 열어보세요. 메모를 편집하고 싶으신가요? 텍스트 편집기를 사용하세요. 데이터를 마이그레이션하고 싶으신가요? <code translate="no">.memsearch/memory/</code> 폴더를 복사하세요.</p>
<p><a href="https://milvus.io/">Milvus</a> 벡터 인덱스는 시맨틱 검색 속도를 높이기 위한 캐시입니다. 언제든지 마크다운에서 다시 빌드됩니다. 불투명한 데이터베이스도, 바이너리 블랙박스도 없습니다. 모든 데이터를 추적할 수 있고 완전히 재구성할 수 있습니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/milvus_index_workflow_e8de4628da.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="2-Automatic-Context-Injection-Costs-Zero-Extra-Tokens" class="common-anchor-header">2. 추가 토큰이 필요 없는 자동 컨텍스트 주입 비용 제로</h3><p>투명한 스토리지는 이 시스템의 기반입니다. 진정한 보상은 이러한 메모리를 사용하는 방식에서 비롯되며, ccplugin에서는 메모리 리콜이 완전 자동으로 이루어집니다.</p>
<p>프롬프트가 제출될 때마다 <code translate="no">UserPromptSubmit</code> 훅이 시맨틱 검색을 실행하고 상위 3개의 관련 메모리를 컨텍스트에 삽입합니다. Claude는 검색 여부를 결정하지 않습니다. 컨텍스트만 가져올 뿐입니다.</p>
<p>이 과정에서 Claude는 MCP 도구 정의를 볼 수 없으므로 컨텍스트 창을 추가로 차지하는 것은 없습니다. 후크는 CLI 계층에서 실행되며 일반 텍스트 검색 결과를 삽입합니다. IPC 오버헤드나 도구 호출 토큰 비용이 없습니다. MCP 도구 정의와 함께 제공되는 컨텍스트 창 부풀림이 완전히 사라졌습니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/diagram_3_b9e8391c2a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>자동 상위 3단계로 충분하지 않은 경우를 위해 세 가지 단계의 프로그레시브 검색도 구축했습니다. 세 가지 모두 MCP 도구가 아닌 CLI 명령어입니다.</p>
<ul>
<li><p><strong>L1(자동):</strong> 모든 프롬프트는 <code translate="no">chunk_hash</code> 및 200자 미리보기와 함께 상위 3개의 시맨틱 검색 결과를 반환합니다. 대부분의 일상적인 용도에 적합합니다.</p></li>
<li><p><strong>L2(주문형):</strong> 전체 컨텍스트가 필요한 경우 <code translate="no">memsearch expand &lt;chunk_hash&gt;</code> 에서 전체 마크다운 섹션과 메타데이터를 반환합니다.</p></li>
<li><p><strong>L3(심층):</strong> 원본 대화가 필요한 경우 <code translate="no">memsearch transcript &lt;jsonl_path&gt; --turn &lt;uuid&gt;</code> 은 Claude Code에서 원시 JSONL 레코드를 가져옵니다.</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/memsearch_diagram_4_ccc495d5ac.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/memsearch_diagram_5_0333650103.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="3-Session-Summaries-Are-Generated-in-the-Background-at-Near-Zero-Cost" class="common-anchor-header">3. 거의 제로에 가까운 비용으로 백그라운드에서 생성되는 세션 요약</h3><p>검색은 메모리가 어떻게 사용되는지를 다룹니다. 하지만 메모리를 먼저 작성해야 합니다. 이 모든 마크다운 파일은 어떻게 생성될까요?</p>
<p>ccplugin은 비동기적으로 실행되는 백그라운드 파이프라인을 통해 생성하며 비용은 거의 들지 않습니다. 클로드 응답을 중지할 때마다 <code translate="no">Stop</code> 훅이 실행되어 대화 내용을 파싱하고 클로드 하이쿠(<code translate="no">claude -p --model haiku</code>)를 호출하여 요약을 생성한 다음 이를 현재 날짜의 마크다운 파일에 추가합니다. 하이쿠 API 호출은 호출당 거의 무시할 수 있을 정도로 매우 저렴합니다.</p>
<p>그 다음에는 감시 프로세스가 파일 변경을 감지하고 새 콘텐츠를 Milvus에 자동으로 색인화하여 바로 검색할 수 있도록 합니다. 전체 흐름은 작업을 중단하지 않고 백그라운드에서 실행되며 비용은 계속 관리됩니다.</p>
<h2 id="Quickstart-memsearch-plugin-with-Claude-Code" class="common-anchor-header">Claude Code를 사용한 빠른 시작 memsearch 플러그인<button data-href="#Quickstart-memsearch-plugin-with-Claude-Code" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="First-install-from-the-Claude-Code-plugin-marketplace" class="common-anchor-header">먼저, Claude Code 플러그인 마켓플레이스에서 설치합니다:</h3><pre><code translate="no">
bash
<span class="hljs-comment"># Run in Claude Code terminal</span>
/plugin marketplace add zilliztech/memsearch
/plugin install memsearch
<button class="copy-code-btn"></button></code></pre>
<h3 id="Second-restart-Claude-Code" class="common-anchor-header">둘째, Claude Code를 다시 시작합니다.</h3><p>플러그인이 자동으로 구성을 초기화합니다.</p>
<h3 id="Third-after-a-conversation-check-the-days-memory-file" class="common-anchor-header">셋째, 대화가 끝난 후 그날의 메모리 파일을 확인합니다:</h3><pre><code translate="no">bash
<span class="hljs-built_in">cat</span> .memsearch/memory/$(<span class="hljs-built_in">date</span> +%Y-%m-%d).md
<button class="copy-code-btn"></button></code></pre>
<h3 id="Fourth-enjoy" class="common-anchor-header">넷째, 즐기세요.</h3><p>다음 번에 클로드 코드가 시작되면 시스템이 자동으로 관련 메모리를 검색하여 삽입합니다. 추가 단계가 필요 없습니다.</p>
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
    </button></h2><p>원래 질문으로 돌아가서, 어떻게 AI에 지속적 메모리를 제공할 수 있을까요? Claude-mem과 memsearch ccplugin은 각각 다른 강점을 가진 서로 다른 접근 방식을 취합니다. 두 가지 중 하나를 선택하는 데 필요한 간단한 가이드를 요약해 보았습니다:</p>
<table>
<thead>
<tr><th>카테고리</th><th>memsearch</th><th>claude-mem</th></tr>
</thead>
<tbody>
<tr><td>아키텍처</td><td>4개의 셸 훅 + 1개의 감시 프로세스</td><td>Node.js 워커 + 익스프레스 + 리액트 UI</td></tr>
<tr><td>통합 방법</td><td>네이티브 후크 + CLI</td><td>MCP 서버(stdio)</td></tr>
<tr><td>리콜</td><td>자동(훅 주입)</td><td>에이전트 기반(도구 호출 필요)</td></tr>
<tr><td>컨텍스트 소비</td><td>0(결과 텍스트만 주입)</td><td>MCP 도구 정의 지속</td></tr>
<tr><td>세션 요약</td><td>비동기 하이쿠 CLI 호출 1회</td><td>여러 API 호출 + 관찰 압축</td></tr>
<tr><td>저장 형식</td><td>일반 마크다운 파일</td><td>SQLite + 크로마 임베딩</td></tr>
<tr><td>데이터 마이그레이션</td><td>일반 마크다운 파일</td><td>SQLite + Chroma 임베딩</td></tr>
<tr><td>마이그레이션 방법</td><td>.md 파일 복사</td><td>데이터베이스에서 내보내기</td></tr>
<tr><td>런타임</td><td>Python + Claude CLI</td><td>Node.js + Bun + MCP 런타임</td></tr>
</tbody>
</table>
<p>claude-mem은 더 풍부한 기능, 세련된 UI, 세분화된 제어 기능을 제공합니다. 협업, 웹 시각화 또는 세부적인 메모리 관리가 필요한 팀이라면 이 도구를 추천합니다.</p>
<p>멤서치 CC플러그인은 최소한의 디자인, 컨텍스트 창 오버헤드 제로, 완전히 투명한 스토리지를 제공합니다. 추가적인 복잡성 없이 가벼운 메모리 계층을 원하는 엔지니어에게는 이 플러그인이 더 적합합니다. 어떤 것이 더 나은지는 필요에 따라 달라집니다.</p>
<p>더 자세히 알아보고 싶거나 memsearch 또는 Milvus 구축에 대한 도움을 받고 싶으신가요?</p>
<ul>
<li><p><a href="https://milvus.io/slack">Milvus Slack 커뮤니티에</a> 가입하여 다른 개발자들과 소통하고 구축 중인 내용을 공유하세요.</p></li>
<li><p>실시간 Q&amp;A 및 팀의 직접적인 지원을 <a href="https://milvus.io/office-hours">받으려면 Milvus 오피스 아워를</a>예약하세요.</p></li>
</ul>
<h2 id="Resources" class="common-anchor-header">리소스<button data-href="#Resources" class="anchor-icon" translate="no">
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
<li><p><strong>멤서치 CC플러그인 문서:</strong> <a href="https://zilliztech.github.io/memsearch/claude-plugin/">https://zilliztech.github.io/memsearch/claude-plugin/</a></p></li>
<li><p><strong>깃허브:</strong> <a href="https://github.com/zilliztech/memsearch/tree/main/ccplugin">https://github.com/zilliztech/memsearch/tree/main/ccplugin</a></p></li>
<li><p><strong>memsearch 프로젝트:</strong> <a href="https://github.com/zilliztech/memsearch">https://github.com/zilliztech/memsearch</a></p></li>
<li><p>블로그: <a href="https://milvus.io/blog/we-extracted-openclaws-memory-system-and-opensourced-it-memsearch.md">OpenClaw의 메모리 시스템을 추출하여 오픈소스화(memsearch)</a></p></li>
<li><p>블로그: <a href="https://milvus.io/blog/openclaw-formerly-clawdbot-moltbot-explained-a-complete-guide-to-the-autonomous-ai-agent.md">OpenClaw란 무엇인가요? 오픈 소스 AI 에이전트에 대한 완벽한 가이드 - 블로그</a></p></li>
<li><p>블로그 <a href="https://milvus.io/blog/stepbystep-guide-to-setting-up-openclaw-previously-clawdbotmoltbot-with-slack.md">OpenClaw 튜토리얼: 로컬 AI 어시스턴트를 위해 Slack에 연결하기</a></p></li>
</ul>
