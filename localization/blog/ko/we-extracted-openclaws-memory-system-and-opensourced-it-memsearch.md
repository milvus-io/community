---
id: we-extracted-openclaws-memory-system-and-opensourced-it-memsearch.md
title: OpenClaw의 메모리 시스템을 추출하여 오픈소스화했습니다(memsearch).
author: Cheney Zhang
date: 2026-02-13T00:00:00.000Z
cover: assets.zilliz.com/memsearch_openclaw_memory_11zon_b2a6b4cbb9.jpg
tag: Engineering
recommend: true
publishToMedium: true
tags: 'OpenClaw, AI agent memory, vector search, Milvus'
meta_keywords: >-
  OpenClaw, AI agent memory, persistent memory, Python, vector search, Milvus,
  memsearch
meta_title: |
  We Extracted OpenClaw’s Memory System and Open-Sourced It (memsearch)
desc: >-
  우리는 OpenClaw의 AI 메모리 아키텍처를 마크다운 로그, 하이브리드 벡터 검색, Git을 지원하는 독립형 Python 라이브러리인
  memsearch로 추출했습니다.
origin: >-
  https://milvus.io/blog/we-extracted-openclaws-memory-system-and-opensourced-it-memsearch.md
---
<p>2주 만에 <a href="https://github.com/openclaw/openclaw">189,000개 이상의 GitHub 별을</a> 받은<a href="https://milvus.io/blog/openclaw-formerly-clawdbot-moltbot-explained-a-complete-guide-to-the-autonomous-ai-agent.md">OpenClaw</a> (이전 명칭은 clawdbot 및 moltbot)가 입소문을 타고 있습니다. 정말 대단한 수치입니다. 대부분의 입소문은 iMessage, WhatsApp, Slack, Telegram 등 일상적인 채팅 채널에서 자율적이고 에이전트적인 기능에 관한 것입니다.</p>
<p>하지만 벡터 데이터베이스 시스템을 개발하는 엔지니어로서 저희의 관심을 끌었던 것은 <strong>장기 기억에 대한 OpenClaw의 접근 방식이었습니다</strong>. 대부분의 메모리 시스템과 달리 OpenClaw는 AI가 자동으로 일일 로그를 마크다운 파일로 작성합니다. 이 파일은 진실의 원천이며, 모델은 디스크에 기록되는 내용만 '기억'합니다. 인간 개발자는 이러한 마크다운 파일을 열어 직접 편집하고, 장기적인 원칙을 추출하고, AI가 기억하는 내용을 언제든지 정확히 확인할 수 있습니다. 블랙박스가 없습니다. 솔직히 지금까지 본 것 중 가장 깔끔하고 개발자 친화적인 메모리 아키텍처 중 하나입니다.</p>
<p>그래서 자연스럽게 의문이 생겼습니다. <strong><em>왜 이 기능이 OpenClaw 내부에서만 작동해야 할까요? 모든 에이전트가 이런 메모리를 가질 수 있다면 어떨까요?</em></strong> 저희는 OpenClaw의 메모리 아키텍처를 그대로 가져와 모든 에이전트에 지속적이고 투명하며 사람이 편집할 수 있는 메모리를 제공하는 독립형 플러그 앤 플레이 장기 메모리 라이브러리인 <a href="https://github.com/zilliztech/memsearch">memsearch를</a> 구축했습니다. OpenClaw의 나머지 부분에 대한 종속성이 없습니다. 이 라이브러리를 도입하기만 하면 에이전트는 Milvus/Zilliz Cloud가 제공하는 검색과 마크다운 로그를 표준 소스로 사용하여 내구성 있는 메모리를 확보할 수 있습니다.</p>
<iframe width="997" height="561" src="https://www.youtube.com/embed/VRzqRVFm39s" title="MemSearch: OpenClaw's long-term memory" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
<ul>
<li><p><strong>GitHub 리포지토리:</strong> <a href="https://github.com/zilliztech/memsearch">github.com/zilliztech/memsearch</a> (오픈 소스, MIT 라이선스)</p></li>
<li><p><strong>문서:</strong> <a href="https://zilliztech.github.io/memsearch/">https://zilliztech.github.io/memsearch/</a></p></li>
<li><p><strong>클로드 코드 플러그인:</strong> <a href="https://zilliztech.github.io/memsearch/claude-plugin/">https://zilliztech.github.io/memsearch/claude-plugin/</a></p></li>
</ul>
<h2 id="What-Makes-OpenClaws-Memory-Different" class="common-anchor-header">OpenClaw의 메모리가 다른 이유<button data-href="#What-Makes-OpenClaws-Memory-Different" class="anchor-icon" translate="no">
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
    </button></h2><p>OpenClaw 메모리 아키텍처에 대해 자세히 알아보기 전에 <strong>컨텍스트와</strong> <strong>메모리라는</strong> 두 가지 개념을 정리해 보겠습니다. 비슷하게 들리지만 실제로는 매우 다르게 작동합니다.</p>
<ul>
<li><p><strong>컨텍스트는</strong> 시스템 프롬프트, <code translate="no">AGENTS.md</code> 및 <code translate="no">SOUL.md</code> 과 같은 프로젝트 수준 안내 파일, 대화 기록(메시지, 도구 호출, 압축 요약), 사용자의 현재 메시지 등 에이전트가 단일 요청에서 볼 수 있는 모든 것을 의미합니다. 하나의 세션으로 범위가 한정되어 있고 비교적 압축되어 있습니다.</p></li>
<li><p><strong>메모리는</strong> 여러 세션에 걸쳐 지속되는 것입니다. 과거 대화의 전체 기록, 상담원이 작업한 파일, 사용자 기본 설정 등 로컬 디스크에 저장됩니다. 요약되지 않습니다. 압축되지 않습니다. 원본 그대로입니다.</p></li>
</ul>
<p><strong>모든 메모리는 로컬 파일 시스템에 일반 마크다운 파일로 저장된다는</strong> 점이 OpenClaw의 접근 방식을 특별하게 만드는 설계 결정입니다. 각 세션이 끝나면 AI가 해당 마크다운 로그에 자동으로 업데이트를 기록합니다. 사용자는 물론 모든 개발자가 해당 로그를 열고, 편집하고, 재구성하고, 삭제하거나 수정할 수 있습니다. 한편, 벡터 데이터베이스는 이 시스템과 함께 검색을 위한 인덱스를 생성하고 유지 관리합니다. 마크다운 파일이 변경될 때마다 시스템은 변경 사항을 감지하고 자동으로 색인을 다시 생성합니다.</p>
<p>Mem0이나 Zep 같은 도구를 사용해 본 적이 있다면 그 차이를 바로 느낄 수 있을 것입니다. 이러한 시스템은 메모리를 임베딩으로 저장하는데, 이것이 유일한 사본입니다. 상담원이 기억하는 내용을 읽을 수 없습니다. 행을 편집하여 잘못된 메모리를 수정할 수도 없습니다. OpenClaw의 접근 방식은 일반 파일의 <strong>투명성과</strong> 벡터 데이터베이스를 사용한 벡터 검색의 검색 능력이라는 두 가지 장점을 모두 제공합니다. 그냥 파일일 뿐이므로 읽고, <code translate="no">git diff</code> 보고, 조회할 수 있습니다.</p>
<p>유일한 단점은? 현재 이 마크다운 우선 메모리 시스템은 게이트웨이 프로세스, 플랫폼 커넥터, 작업 공간 구성, 메시징 인프라 등 전체 OpenClaw 에코시스템과 긴밀하게 얽혀 있다는 점입니다. 메모리 모델만 원한다면 많은 기계 장치를 끌어들여야 합니다.</p>
<p>이것이 바로 우리가 마크다운, 자동 벡터 인덱싱, 사람이 완전히 편집할 수 있는 마크다운이라는 동일한 철학을 바탕으로 모든 에이전트 아키텍처에 넣을 수 있는 가벼운 독립형 라이브러리로 제공되는 <a href="http://github.com/zilliztech/memsearch"><strong>memsearch를</strong></a> 구축한 이유입니다.</p>
<h2 id="How-Memsearch-Works" class="common-anchor-header">Memsearch의 작동 방식<button data-href="#How-Memsearch-Works" class="anchor-icon" translate="no">
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
    </button></h2><p>앞서 언급했듯이, <a href="https://github.com/zilliztech/memsearch">memsearch는</a> 완전히 독립적인 장기 메모리 라이브러리로, OpenClaw에서 사용되는 것과 동일한 메모리 아키텍처를 구현하면서도 나머지 OpenClaw 스택을 가져오지 않습니다. 모든 에이전트 프레임워크(Claude, GPT, Llama, 사용자 정의 에이전트, 워크플로 엔진)에 연결하여 시스템에 영구적이고 투명하며 사람이 편집할 수 있는 메모리를 즉시 제공할 수 있습니다.</p>
<p>memsearch의 모든 에이전트 메모리는 로컬 디렉터리에 일반 텍스트 마크다운으로 저장됩니다. 개발자가 한눈에 이해할 수 있도록 구조가 의도적으로 단순합니다:</p>
<pre><code translate="no">~/your-project/
└── memory/
    ├── MEMORY.md              <span class="hljs-comment"># Hand-written long-term memory</span>
    ├── 2026-02-09.md          <span class="hljs-comment"># Today&#x27;s work log</span>
    ├── 2026-02-08.md
    └── 2026-02-07.md
<button class="copy-code-btn"></button></code></pre>
<p>Memsearch는 빠른 의미 검색을 위해 <a href="https://milvus.io/"><strong>Milvus를</strong></a> 벡터 데이터베이스로 사용해 이러한 Markdown 파일을 색인화합니다. 하지만 결정적으로, 벡터 인덱스가 진실의 원천이 <em>아니라</em> 파일이 진실의 원천입니다. Milvus 인덱스를 완전히 삭제해도 <strong>아무</strong> 것도 잃지 않습니다. Memsearch는 단순히 마크다운 파일을 다시 임베딩하고 다시 색인하여 몇 분 안에 전체 검색 레이어를 다시 구축합니다. 즉, 에이전트의 메모리는 투명하고 내구성이 뛰어나며 완전히 재구성이 가능합니다.</p>
<p>다음은 memsearch의 핵심 기능입니다:</p>
<h3 id="Readable-Markdown-Makes-Debugging-as-Simple-as-Editing-a-File" class="common-anchor-header">읽기 쉬운 마크다운으로 파일 편집만큼이나 간단한 디버깅 가능</h3><p>AI 메모리를 디버깅하는 것은 보통 힘든 작업입니다. 에이전트가 오답을 생성할 때 대부분의 메모리 시스템에서는 실제로 저장된 <em>내용을</em> 확인할 수 있는 명확한 방법이 없습니다. 일반적인 워크플로에서는 메모리 API를 쿼리하기 위해 사용자 지정 코드를 작성한 다음 불투명한 임베딩이나 장황한 JSON 블롭을 살펴보는데, 이 둘은 AI의 실제 내부 상태에 대해 많은 것을 알려주지 못합니다.</p>
<p><strong>memsearch는 이러한 모든 종류의 문제를 제거합니다.</strong> 모든 메모리는 메모리/폴더에 일반 마크다운으로 저장됩니다:</p>
<pre><code translate="no" class="language-markdown"><span class="hljs-meta">## Morning</span>
- Fixed N+<span class="hljs-number">1</span> query issue — <span class="hljs-function">switched to <span class="hljs-title">selectinload</span>()
- Query count dropped <span class="hljs-keyword">from</span> 152 to 3
</span><button class="copy-code-btn"></button></code></pre>
<p>AI에 문제가 발생하면 파일을 편집하는 것만큼이나 간단하게 수정할 수 있습니다. 항목을 업데이트하고 저장하면 memsearch가 자동으로 변경 사항을 다시 색인화합니다. 5초면 됩니다. API 호출이 필요 없습니다. 도구가 필요 없습니다. 미스터리도 없습니다. 파일을 편집하여 문서를 디버깅하는 것과 같은 방식으로 AI 메모리를 디버깅할 수 있습니다.</p>
<h3 id="Git-Backed-Memory-Means-Teams-Can-Track-Review-and-Roll-Back-Changes" class="common-anchor-header">팀이 변경 사항을 추적, 검토 및 롤백할 수 있는 Git 지원 메모리</h3><p>데이터베이스에 있는 AI 메모리는 협업이 어렵습니다. 누가 언제 무엇을 변경했는지 파악하려면 감사 로그를 샅샅이 뒤져야 하는데, 많은 솔루션은 감사 로그조차 제공하지 않습니다. 변경은 소리 없이 일어나며, AI가 무엇을 기억해야 하는지에 대한 의견 불일치는 명확한 해결 경로가 없습니다. 팀은 결국 Slack 메시지와 가정에 의존하게 됩니다.</p>
<p>Memsearch는 메모리를 마크다운 파일로만 구성하여 이 문제를 해결합니다. 즉, <strong>Git이 버전 관리를 자동으로 처리합니다</strong>. 명령 한 번으로 전체 히스토리를 볼 수 있습니다:</p>
<pre><code translate="no" class="language-bash">git <span class="hljs-built_in">log</span> memory/MEMORY.md
git diff HEAD~1 memory/2026-02-09.md
<button class="copy-code-btn"></button></code></pre>
<p>이제 AI 메모리는 코드와 동일한 워크플로에 참여합니다. 아키텍처 결정, 구성 업데이트, 기본 설정 변경이 모두 Diff에 표시되어 누구나 댓글을 달고 승인하거나 되돌릴 수 있습니다:</p>
<pre><code translate="no" class="language-diff">+ <span class="hljs-meta">## Architecture Decision</span>
+ - Use Kafka <span class="hljs-keyword">for</span> <span class="hljs-keyword">event</span> bus instead of RabbitMQ
+ - Reason: better horizontal scaling
<button class="copy-code-btn"></button></code></pre>
<h3 id="Plaintext-Memory-Makes-Migration-Nearly-Effortless" class="common-anchor-header">평문 메모리로 거의 손쉽게 마이그레이션 가능</h3><p>마이그레이션은 메모리 프레임워크의 가장 큰 숨겨진 비용 중 하나입니다. 한 도구에서 다른 도구로 이동하려면 일반적으로 데이터를 내보내고, 형식을 변환하고, 다시 가져오고, 필드가 호환되기를 바라야 합니다. 이러한 작업에는 반나절이 쉽게 소요될 수 있으며, 결과를 보장할 수 없습니다.</p>
<p>memsearch는 메모리가 평문 마크다운이기 때문에 이 문제를 완전히 피할 수 있습니다. 독점적인 형식도 없고, 번역할 스키마도 없으며, 마이그레이션할 것도 없습니다:</p>
<ul>
<li><p><strong>컴퓨터 전환:</strong> <code translate="no">rsync</code> 메모리 폴더. 완료.</p></li>
<li><p><strong>임베딩 모델을 전환합니다:</strong> 인덱스 명령을 다시 실행합니다. 5분 정도 걸리며 마크다운 파일은 그대로 유지됩니다.</p></li>
<li><p><strong>벡터 데이터베이스 배포를 전환합니다:</strong> 구성 값 하나를 변경합니다. 예를 들어 개발 환경의 Milvus Lite에서 프로덕션 환경의 Zilliz Cloud로 전환할 수 있습니다:</p></li>
</ul>
<pre><code translate="no" class="language-python"><span class="hljs-meta"># Development</span>
ms = MemSearch(milvus_uri=<span class="hljs-string">&quot;~/.memsearch/milvus.db&quot;</span>)

<span class="hljs-meta"># Production (change only this <span class="hljs-keyword">line</span>)</span>
ms = MemSearch(milvus_uri=<span class="hljs-string">&quot;https://xxx.zillizcloud.com&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>메모리 파일은 그대로 유지됩니다. 주변 인프라는 자유롭게 진화할 수 있습니다. 그 결과 AI 시스템에서는 드물게 장기적인 이식성이 보장됩니다.</p>
<h3 id="Shared-Markdown-Files-Let-Humans-and-Agents-Co-Author-Memory" class="common-anchor-header">공유 마크다운 파일을 통해 사람과 에이전트가 메모리를 공동 저작할 수 있습니다.</h3><p>대부분의 메모리 솔루션에서 AI가 기억하는 내용을 편집하려면 API에 대한 코드를 작성해야 합니다. 즉, 개발자만 AI 메모리를 유지 관리할 수 있으며, 개발자에게도 번거로운 작업입니다.</p>
<p>Memsearch는 보다 자연스러운 책임 분담을 가능하게 합니다:</p>
<ul>
<li><p><strong>AI가 처리합니다:</strong> "v2.3.1 배포, 12% 성능 향상"과 같은 실행 세부 정보가 포함된 자동 일일 로그(<code translate="no">YYYY-MM-DD.md</code>).</p></li>
<li><p><strong>사람이 처리합니다:</strong> <code translate="no">MEMORY.md</code> )의 장기적인 원칙(예: "팀 스택: Python + FastAPI + PostgreSQL."과 같은 장기 원칙.</p></li>
</ul>
<p>양쪽 모두 이미 사용하고 있는 도구로 동일한 마크다운 파일을 편집합니다. API 호출도, 특별한 도구도, 게이트키퍼도 없습니다. 메모리가 데이터베이스 내부에 잠겨 있으면 이런 종류의 공유 저작은 불가능합니다. memsearch는 이를 기본값으로 설정합니다.</p>
<h2 id="Under-the-Hood-memsearch-Runs-on-Four-Workflows-That-Keep-Memory-Fast-Fresh-and-Lean" class="common-anchor-header">내부 살펴보기: 메모리를 빠르고, 최신 상태로, 간결하게 유지하는 네 가지 워크플로우에서 실행되는 memsearch<button data-href="#Under-the-Hood-memsearch-Runs-on-Four-Workflows-That-Keep-Memory-Fast-Fresh-and-Lean" class="anchor-icon" translate="no">
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
    <img translate="no" src="https://assets.zilliz.com/ms1_c855cb19a5.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>memsearch에는 네 가지 핵심 워크플로가 있습니다: <strong>보기</strong> (모니터링) → <strong>색인</strong> (청크 및 임베드) → <strong>검색</strong> ( <strong>검색</strong> ) → <strong>압축</strong> (요약)입니다. 각 워크플로의 기능은 다음과 같습니다.</p>
<h3 id="1-Watch-Automatically-Re-Index-on-Every-File-Save" class="common-anchor-header">1. Watch: 모든 파일 저장 시 자동으로 색인 다시 만들기</h3><p><strong>Watch</strong> 워크플로는 메모리/디렉토리에 있는 모든 마크다운 파일을 모니터링하고 파일이 수정되어 저장될 때마다 재색인을 트리거합니다. <strong>1500ms 디바운스는</strong> 컴퓨팅 낭비 없이 업데이트를 감지하도록 보장합니다. 여러 번의 저장이 빠르게 연속해서 발생하는 경우 타이머가 재설정되고 편집이 안정화될 때만 실행됩니다.</p>
<p>이 지연은 경험적으로 조정됩니다:</p>
<ul>
<li><p><strong>100ms</strong> → 너무 민감함; 모든 키 입력 시 실행되어 임베딩 호출이 끊김</p></li>
<li><p><strong>10초</strong> → 너무 느림; 개발자가 지연을 느낌</p></li>
<li><p><strong>1500ms</strong> → 응답성과 리소스 효율성의 이상적인 균형</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ms2_92fdb7f1f8.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>실제로는 개발자가 한 창에서 코드를 작성하고 다른 창에서 <code translate="no">MEMORY.md</code> 을 편집하여 API 문서 URL을 추가하거나 오래된 항목을 수정할 수 있습니다. 파일을 저장하면 다음 AI 쿼리가 새 메모리를 가져옵니다. 다시 시작하거나 수동으로 색인을 다시 생성할 필요가 없습니다.</p>
<h3 id="2-Index-Smart-Chunking-Deduplication-and-Version-Aware-Embeddings" class="common-anchor-header">2. 색인: 스마트 청킹, 중복 제거, 버전 인식 임베딩</h3><p>인덱스는 성능에 중요한 워크플로우입니다. <strong>청킹, 중복 제거, 버전 인식 청크 ID라는</strong> 세 가지를 처리합니다 <strong>.</strong></p>
<p><strong>청킹은</strong> 의미적 경계(제목과 본문)를 따라 텍스트를 분할하여 관련 콘텐츠가 함께 유지되도록 합니다. 이렇게 하면 "Redis 구성"과 같은 문구가 청크에 걸쳐 분할되는 경우를 방지할 수 있습니다.</p>
<p>예를 들어, 이 마크다운:</p>
<pre><code translate="no" class="language-markdown"><span class="hljs-comment">## Redis Caching</span>
We use Redis <span class="hljs-keyword">for</span> L1 cache <span class="hljs-keyword">with</span> 5<span class="hljs-built_in">min</span> TTL.
The connection pool <span class="hljs-keyword">is</span> configured <span class="hljs-keyword">with</span> <span class="hljs-built_in">max</span> <span class="hljs-number">100</span> connections.

<span class="hljs-comment">## Database</span>
PostgreSQL <span class="hljs-number">16</span> <span class="hljs-keyword">is</span> the primary database.
<button class="copy-code-btn"></button></code></pre>
<p>은 두 개의 청크가 됩니다:</p>
<ul>
<li><p>청크 1: <code translate="no">## Redis Caching\nWe use Redis for L1 cache...</code></p></li>
<li><p>청크 2: <code translate="no">## Database\nPostgreSQL 16 is the primary database.</code></p></li>
</ul>
<p><strong>중복 제거는</strong> 각 청크의 SHA-256 해시를 사용하여 동일한 텍스트가 두 번 포함되지 않도록 합니다. 여러 파일에서 "PostgreSQL 16"을 언급하는 경우 임베딩 API는 파일당 한 번이 아니라 한 번만 호출됩니다. 약 500KB의 텍스트의 경우 <strong> 월 0.15달러를</strong> 절약할 수 있습니다 <strong>.</strong> 규모에 따라 수백 달러에 달하는 비용이 추가됩니다.</p>
<p>청크<strong>ID 디자인은</strong> 청크가 오래되었는지 여부를 파악하는 데 필요한 모든 것을 인코딩합니다. 형식은 <code translate="no">hash(source_path:start_line:end_line:content_hash:model_version)</code> 입니다. <code translate="no">model_version</code> 필드는 중요한 부분입니다. 임베딩 모델이 <code translate="no">text-embedding-3-small</code> 에서 <code translate="no">text-embedding-3-large</code> 로 업그레이드되면 이전 임베딩은 유효하지 않게 됩니다. 모델 버전이 ID에 베이크되기 때문에 시스템에서 자동으로 다시 임베딩해야 하는 청크를 식별합니다. 수동으로 정리할 필요가 없습니다.</p>
<h3 id="3-Search-Hybrid-Vector-+-BM25-Retrieval-for-Maximum-Accuracy" class="common-anchor-header">3. 검색: 하이브리드 벡터 + BM25 검색으로 정확도 극대화</h3><p>검색은 70%의 가중치가 부여된 벡터 검색과 30%의 가중치가 부여된 BM25 키워드 검색이라는 하이브리드 검색 방식을 사용합니다. 이는 실무에서 자주 발생하는 두 가지 요구 사항의 균형을 맞춥니다.</p>
<ul>
<li><p><strong>벡터 검색은</strong> 시맨틱 매칭을 처리합니다. "Redis 캐시 구성"에 대한 쿼리는 문구가 다르더라도 "5분 TTL이 있는 Redis L1 캐시"를 포함하는 청크를 반환합니다. 이는 개발자가 개념은 기억하지만 정확한 문구는 기억하지 못하는 경우에 유용합니다.</p></li>
<li><p><strong>BM25는</strong> 정확한 일치를 처리합니다. "PostgreSQL 16"에 대한 쿼리는 "PostgreSQL 15"에 대한 결과를 반환하지 않습니다. 이는 오류 코드, 함수 이름 및 버전별 동작에서 중요하며, 닫기로는 충분하지 않습니다.</p></li>
</ul>
<p>기본 70/30 분할은 대부분의 사용 사례에서 잘 작동합니다. 정확한 일치에 크게 의존하는 워크플로우의 경우, BM25 가중치를 50%로 올리면 한 줄의 구성 변경으로 충분합니다.</p>
<p>결과는 각각 200자로 잘린 상위 K 청크(기본값 3)로 반환됩니다. 전체 콘텐츠가 필요한 경우 <code translate="no">memsearch expand &lt;chunk_hash&gt;</code> 에서 로드합니다. 이 점진적 공개는 세부 정보에 대한 액세스를 희생하지 않으면서도 LLM 컨텍스트 창 사용량을 간결하게 유지합니다.</p>
<h3 id="4-Compact-Summarize-Historical-Memory-to-Keep-Context-Clean" class="common-anchor-header">4. 압축: 과거 메모리를 요약하여 컨텍스트를 깔끔하게 유지하세요.</h3><p>누적된 메모리는 결국 문제가 됩니다. 오래된 항목은 컨텍스트 창을 가득 채우고 토큰 비용을 증가시키며 응답 품질을 저하시키는 노이즈를 추가합니다. Compact는 LLM을 호출하여 과거 메모리를 압축된 형태로 요약한 다음 원본을 삭제하거나 보관함으로써 이 문제를 해결합니다. 수동으로 트리거하거나 일정한 간격으로 실행되도록 예약할 수 있습니다.</p>
<h2 id="How-to-get-started-with-memsearch" class="common-anchor-header">memsearch를 시작하는 방법<button data-href="#How-to-get-started-with-memsearch" class="anchor-icon" translate="no">
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
    </button></h2><p>Memsearch는 <strong>Python API와</strong> <strong>CLI를</strong> 모두 제공하므로 상담원 프레임워크 내부에서 사용하거나 독립형 디버깅 도구로 사용할 수 있습니다. 설정이 최소화되어 있으며 로컬 개발 환경과 프로덕션 배포가 거의 동일하게 보이도록 시스템이 설계되어 있습니다.</p>
<p>Memsearch는 <strong>동일한 API를</strong> 통해 노출되는 세 가지 Milvus 호환 백엔드를 지원합니다:</p>
<ul>
<li><p><a href="https://milvus.io/docs/milvus_lite.md"><strong>Milvus Lite(기본값)</strong></a><strong>:</strong> 로컬 <code translate="no">.db</code> 파일, 제로 구성, 개별 사용에 적합.</p></li>
<li><p><strong>Milvus 독립형/클러스터:</strong> 자체 호스팅, 여러 에이전트가 데이터를 공유할 수 있도록 지원하며 팀 환경에 적합합니다.</p></li>
<li><p><a href="https://zilliz.com/cloud"><strong>질리즈 클라우드</strong></a><strong>:</strong> 자동 확장, 백업, 고가용성 및 격리 기능을 갖춘 완전 관리형 서비스입니다. 프로덕션 워크로드에 이상적입니다.</p></li>
</ul>
<p>로컬 개발에서 프로덕션으로 전환하는 것은 일반적으로 <strong>한 줄의 구성 변경으로</strong> 이루어집니다. 코드는 동일하게 유지됩니다.</p>
<h3 id="Install" class="common-anchor-header">설치</h3><pre><code translate="no" class="language-bash">pip install memsearch
<button class="copy-code-btn"></button></code></pre>
<p>memsearch는 OpenAI, Google, Voyage, Ollama 및 로컬 모델을 포함한 여러 임베딩 제공업체도 지원합니다. 따라서 메모리 아키텍처의 이식성과 공급업체에 구애받지 않습니다.</p>
<h3 id="Option-1-Python-API-integrated-into-your-agent-framework" class="common-anchor-header">옵션 1: Python API(상담원 프레임워크에 통합)</h3><p>다음은 memsearch를 사용하는 전체 에이전트 루프의 최소한의 예입니다. 필요에 따라 복사/붙여넣기 및 수정할 수 있습니다:</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> openai <span class="hljs-keyword">import</span> OpenAI
<span class="hljs-keyword">from</span> memsearch <span class="hljs-keyword">import</span> MemSearch

llm = OpenAI()
ms = MemSearch(paths=[<span class="hljs-string">&quot;./memory/&quot;</span>])

<span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">agent_chat</span>(<span class="hljs-params">user_input: <span class="hljs-built_in">str</span></span>) -&gt; <span class="hljs-built_in">str</span>:
    <span class="hljs-comment"># 1. Recall — search relevant memories</span>
    memories = <span class="hljs-keyword">await</span> ms.search(user_input, top_k=<span class="hljs-number">3</span>)
    context = <span class="hljs-string">&quot;\n&quot;</span>.join(<span class="hljs-string">f&quot;- <span class="hljs-subst">{m[<span class="hljs-string">&#x27;content&#x27;</span>][:<span class="hljs-number">200</span>]}</span>&quot;</span> <span class="hljs-keyword">for</span> m <span class="hljs-keyword">in</span> memories)

    <span class="hljs-comment"># 2. Think — call LLM</span>
    resp = llm.chat.completions.create(
        model=<span class="hljs-string">&quot;gpt-4o-mini&quot;</span>,
        messages=[
            {<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;system&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: <span class="hljs-string">f&quot;Memories:\n<span class="hljs-subst">{context}</span>&quot;</span>},
            {<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: user_input},
        ],
    )

    <span class="hljs-comment"># 3. Remember — write to markdown, update index</span>
    save_memory(<span class="hljs-string">f&quot;## <span class="hljs-subst">{user_input}</span>\n<span class="hljs-subst">{resp.choices[<span class="hljs-number">0</span>].message.content}</span>&quot;</span>)
    <span class="hljs-keyword">await</span> ms.index()
    <span class="hljs-keyword">return</span> resp.choices[<span class="hljs-number">0</span>].message.content
<button class="copy-code-btn"></button></code></pre>
<p>다음은 핵심 루프를 보여줍니다:</p>
<ul>
<li><p><strong>기억하기</strong>: memsearch는 하이브리드 벡터 + BM25 검색을 수행합니다.</p></li>
<li><p><strong>생각하기</strong>: LLM이 사용자 입력 + 검색된 메모리를 처리합니다.</p></li>
<li><p><strong>기억하기</strong>: 에이전트가 마크다운에 새 메모리를 쓰고, memsearch가 그 인덱스를 업데이트합니다.</p></li>
</ul>
<p>이 패턴은 LangChain, AutoGPT, 시맨틱 라우터, LangGraph 또는 사용자 정의 에이전트 루프 등 모든 에이전트 시스템에 자연스럽게 들어맞습니다. 설계상 프레임워크에 구애받지 않습니다.</p>
<h3 id="Option-2-CLI-quick-operations-good-for-debugging" class="common-anchor-header">옵션 2: CLI(빠른 작업, 디버깅에 적합)</h3><p>CLI는 독립형 워크플로, 빠른 검사 또는 개발 중 메모리 검사에 이상적입니다:</p>
<pre><code translate="no" class="language-bash">memsearch index ./docs/              <span class="hljs-comment"># Index files</span>
memsearch search <span class="hljs-string">&quot;Redis caching&quot;</span>     <span class="hljs-comment"># Search</span>
memsearch watch ./docs/              <span class="hljs-comment"># Watch for file changes</span>
memsearch compact                    <span class="hljs-comment"># Compact old memory</span>
<button class="copy-code-btn"></button></code></pre>
<p>CLI는 Python API의 기능을 미러링하지만 코드를 작성하지 않고도 작동하므로 디버깅, 검사, 마이그레이션 또는 메모리 폴더 구조의 유효성 검사에 적합합니다.</p>
<h2 id="How-memsearch-Compares-to-Other-Memory-Solutions" class="common-anchor-header">다른 메모리 솔루션과 memsearch의 비교<button data-href="#How-memsearch-Compares-to-Other-Memory-Solutions" class="anchor-icon" translate="no">
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
    </button></h2><p>개발자들이 가장 많이 하는 질문은 이미 확립된 옵션이 있는데 왜 굳이 memsearch를 사용해야 하느냐는 것입니다. 간단히 답하자면, memsearch는 임시 지식 그래프와 같은 고급 기능을 투명성, 이식성, 단순성과 교환합니다. 대부분의 에이전트 메모리 사용 사례에서는 이것이 올바른 절충안입니다.</p>
<table>
<thead>
<tr><th>솔루션</th><th>강점</th><th>제한 사항</th><th>최적 대상</th></tr>
</thead>
<tbody>
<tr><td>멤서치</td><td>투명한 일반 텍스트 메모리, 인간-AI 공동 저작, 마이그레이션 마찰 제로, 손쉬운 디버깅, Git 네이티브</td><td>내장된 임시 그래프나 복잡한 멀티에이전트 메모리 구조 없음</td><td>장기 메모리의 제어, 단순성, 이식성을 중요시하는 팀</td></tr>
<tr><td>Mem0</td><td>완전 관리형, 실행 또는 유지 관리할 인프라 없음</td><td>불투명 - 메모리를 검사하거나 수동으로 편집할 수 없으며, 임베딩이 유일한 표현입니다.</td><td>핸즈오프 관리형 서비스를 원하고 가시성이 낮아도 괜찮은 팀</td></tr>
<tr><td>Zep</td><td>풍부한 기능 세트: 임시 메모리, 다중 페르소나 모델링, 복잡한 지식 그래프</td><td>무거운 아키텍처, 움직이는 부분이 많아 학습 및 운영이 어려움</td><td>고급 메모리 구조 또는 시간 인식 추론이 진정으로 필요한 에이전트</td></tr>
<tr><td>랭멤 / 레타</td><td>자체 에코시스템 내부의 심층적이고 원활한 통합</td><td>프레임워크 종속성, 다른 에이전트 스택으로 포팅하기 어려움</td><td>이미 특정 프레임워크에 전념하고 있는 팀</td></tr>
</tbody>
</table>
<h2 id="Try-memsearch-and-let-us-know-your-feedback" class="common-anchor-header">memsearch를 사용해 보고 피드백을 알려주세요.<button data-href="#Try-memsearch-and-let-us-know-your-feedback" class="anchor-icon" translate="no">
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
    </button></h2><p>Memsearch는 MIT 라이선스에 따라 완전 오픈 소스이며, 현재 리포지토리는 프로덕션 실험을 위한 준비가 완료되었습니다.</p>
<ul>
<li><p><strong>리포지토리:</strong> <a href="https://github.com/zilliztech/memsearch">github.com/zilliztech/memsearch</a></p></li>
<li><p><strong>문서:</strong> <a href="https://zilliztech.github.io/memsearch">zilliztech.github.io/memsearch</a></p></li>
</ul>
<p>여러 세션에 걸쳐 무언가를 기억해야 하는 에이전트를 구축하고 있고 기억하는 내용을 완전히 제어하고 싶다면 memsearch를 살펴볼 가치가 있습니다. 이 라이브러리는 단일 <code translate="no">pip install</code> 로 설치되며 모든 에이전트 프레임워크에서 작동하고 모든 것을 Git으로 읽고, 편집하고, 버전 관리할 수 있는 마크다운으로 저장합니다.</p>
<p>저희는 memsearch를 적극적으로 개발 중이며 커뮤니티의 의견을 환영합니다.</p>
<ul>
<li><p>문제가 발생하면 이슈를 열어주세요.</p></li>
<li><p>라이브러리를 확장하려면 PR을 제출하세요.</p></li>
<li><p>마크다운을 진실의 원천으로 삼는 철학이 마음에 든다면 리포지토리에 별표를 표시하세요.</p></li>
</ul>
<p>OpenClaw의 메모리 시스템은 더 이상 OpenClaw 내부에 잠겨 있지 않습니다. 이제 누구나 사용할 수 있습니다.</p>
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
<li><p><a href="https://milvus.io/blog/openclaw-formerly-clawdbot-moltbot-explained-a-complete-guide-to-the-autonomous-ai-agent.md">OpenClaw란 무엇인가요? 오픈 소스 AI 에이전트에 대한 전체 가이드</a></p></li>
<li><p><a href="https://milvus.io/blog/stepbystep-guide-to-setting-up-openclaw-previously-clawdbotmoltbot-with-slack.md">OpenClaw 튜토리얼: 로컬 AI 어시스턴트를 위해 Slack에 연결하기</a></p></li>
<li><p><a href="https://milvus.io/blog/clawdbot-long-running-ai-agents-langgraph-milvus.md">LangGraph 및 Milvus로 클로봇 스타일의 AI 에이전트 구축하기</a></p></li>
<li><p><a href="https://milvus.io/blog/is-rag-become-outdated-now-long-running-agents-like-claude-cowork-are-emerging.md">RAG와 장기 실행 에이전트 비교: RAG는 더 이상 쓸모가 없나요?</a></p></li>
<li><p><a href="https://milvus.io/blog/create-a-custom-anthropic-skill-for-milvus-to-quickly-spin-up-rag.md">Milvus를 위한 커스텀 인공 지능 스킬을 만들어 RAG를 빠르게 스핀업하기</a></p></li>
</ul>
