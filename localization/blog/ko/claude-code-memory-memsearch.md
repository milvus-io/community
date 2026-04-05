---
id: claude-code-memory-memsearch.md
title: 클로드 코드의 유출된 소스를 읽어보았습니다. 메모리의 실제 작동 방식은 다음과 같습니다.
author: Cheney Zhang
date: 2026-4-3
cover: assets.zilliz.com/claude_memory_845a789ee8.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  Claude Code memory, AI agent memory, memsearch, Claude Code source leak,
  cross-agent memory
meta_title: |
  Claude Code Memory System Explained: 4 Layers, 5 Limits, and a Fix
desc: >-
  Claude Code가 유출한 소스를 보면 200줄로 제한되는 4계층 메모리에 grep 전용 검색 기능이 있는 것으로 나타났습니다. 각
  계층의 작동 방식과 memsearch의 수정 사항은 다음과 같습니다.
origin: 'https://milvus.io/blog/claude-code-memory-memsearch.md'
---
<p>Claude Code의 소스 코드가 실수로 공개적으로 배포되었습니다. 버전 2.1.88에는 빌드에서 제거되었어야 할 59.8MB의 소스 맵 파일이 포함되어 있었습니다. 이 파일에는 512,000줄에 달하는 읽기 가능한 전체 TypeScript 코드베이스가 포함되어 있었으며, 현재 GitHub에 미러링되어 있습니다.</p>
<p><a href="https://milvus.io/blog/adding-persistent-memory-to-claude-code-with-the-lightweight-memsearch-plugin.md">메모리 시스템이</a> 우리의 관심을 끌었습니다. Claude Code는 시중에서 가장 인기 있는 AI 코딩 에이전트이며, 메모리는 대부분의 사용자가 내부 작동 방식을 이해하지 못한 채 사용하는 부분입니다. 그래서 자세히 살펴봤습니다.</p>
<p>짧은 버전입니다: 클로드 코드의 메모리는 생각보다 기본적인 수준입니다. 메모 용량은 200줄로 제한됩니다. '포트 충돌'에 대해 질문했는데 메모에 '도커-컴포즈 매핑'이라고 적혀 있으면 아무 것도 찾을 수 없습니다. 그리고 그 어떤 것도 Claude Code를 떠나지 않습니다. 다른 에이전트로 전환하면 제로에서 시작합니다.</p>
<p>다음은 네 개의 레이어입니다:</p>
<ul>
<li>Claude가 따라야 할 규칙을 직접 작성한 파일인<strong>CLAUDE.md</strong>. 수동, 정적, 미리 적어두는 양에 따라 제한됩니다.</li>
<li><strong>자동 메모리</strong> - 세션 중에 Claude가 자체적으로 메모를 작성합니다. 유용하지만 200줄 인덱스로 제한되며 의미별 검색 기능은 없습니다.</li>
<li><strong>자동 드림</strong> - 유휴 시간 동안 지저분한 기억을 통합하는 백그라운드 정리 프로세스입니다. 며칠 전의 어수선함을 정리하는 데 도움이 되지만 몇 달을 연결할 수는 없습니다.</li>
<li><strong>KAIROS</strong> - 유출된 코드에서 발견된 미공개 상시 데몬 모드. 아직 공개 빌드에 포함되지 않았습니다.</li>
</ul>
<p>아래에서는 각 계층의 포장을 풀고 아키텍처가 무너지는 부분과 부족한 부분을 해결하기 위해 무엇을 구축했는지 살펴봅니다.</p>
<h2 id="How-Does-CLAUDEmd-Work" class="common-anchor-header">CLAUDE.md는 어떻게 작동하나요?<button data-href="#How-Does-CLAUDEmd-Work" class="anchor-icon" translate="no">
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
    </button></h2><p>CLAUDE.md는 프로젝트 폴더에 생성하여 배치하는 마크다운 파일입니다. 코드 스타일 규칙, 프로젝트 구조, 테스트 명령어, 배포 단계 등 Claude가 기억하기를 원하는 모든 것을 이 파일에 입력합니다. Claude는 모든 세션이 시작될 때 이 파일을 로드합니다.</p>
<p>프로젝트 수준(리포지토리 루트에 있음), 개인(<code translate="no">~/.claude/CLAUDE.md</code>), 조직(엔터프라이즈 구성)의 세 가지 범위가 있습니다. 파일이 짧을수록 더 안정적으로 추적됩니다.</p>
<p>한계는 분명합니다. CLAUDE.md에는 사용자가 미리 적어둔 내용만 저장됩니다. 디버깅 결정, 대화 중에 언급한 기본 설정, 함께 발견한 에지 케이스 등은 사용자가 수동으로 추가하지 않는 한 캡처되지 않습니다. 대부분의 사람들은 그렇게 하지 않습니다.</p>
<h2 id="How-Does-Auto-Memory-Work" class="common-anchor-header">자동 메모리는 어떻게 작동하나요?<button data-href="#How-Does-Auto-Memory-Work" class="anchor-icon" translate="no">
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
    </button></h2><p>자동 메모리는 작업 중에 떠오르는 내용을 캡처합니다. Claude는 보관할 가치가 있는 내용을 결정하고 사용자(역할과 환경설정), 피드백(수정 내용), 프로젝트(결정과 맥락), 참조(자료가 있는 위치)의 네 가지 카테고리로 정리해 컴퓨터의 메모리 폴더에 기록합니다.</p>
<p>각 노트는 별도의 마크다운 파일입니다. 진입 지점은 <code translate="no">MEMORY.md</code> - 각 줄이 세부 파일을 가리키는 짧은 레이블(150자 미만)인 색인입니다. Claude는 색인을 읽은 다음, 관련성이 있어 보이는 특정 파일을 가져옵니다.</p>
<pre><code translate="no">~<span class="hljs-regexp">/.claude/</span>projects/-<span class="hljs-title class_">Users</span>-me-myproject/memory/
├── <span class="hljs-variable constant_">MEMORY</span>.<span class="hljs-property">md</span>                  ← index file, one pointer per line
├── user_role.<span class="hljs-property">md</span>               ← <span class="hljs-string">&quot;Backend engineer, fluent in Go, new to React&quot;</span>
├── feedback_testing.<span class="hljs-property">md</span>        ← <span class="hljs-string">&quot;Integration tests must use real DB, no mocking&quot;</span>
├── project_auth_rewrite.<span class="hljs-property">md</span>    ← <span class="hljs-string">&quot;Auth rewrite driven by compliance, not tech debt&quot;</span>
└── reference_linear.<span class="hljs-property">md</span>        ← <span class="hljs-string">&quot;Pipeline bugs tracked in Linear INGEST project&quot;</span>

<span class="hljs-variable constant_">MEMORY</span>.<span class="hljs-property">md</span> <span class="hljs-title function_">sample</span> (each line ≤<span class="hljs-number">150</span> chars):
- [<span class="hljs-title class_">User</span> role](user_role.<span class="hljs-property">md</span>) — <span class="hljs-title class_">Backend</span> engineer, strong <span class="hljs-title class_">Go</span>, <span class="hljs-keyword">new</span> to <span class="hljs-title class_">React</span>
- [<span class="hljs-title class_">Testing</span> rule](feedback_testing.<span class="hljs-property">md</span>) — <span class="hljs-title class_">No</span> mocking the database <span class="hljs-keyword">in</span> integration tests
- [<span class="hljs-title class_">Auth</span> rewrite](project_auth_rewrite.<span class="hljs-property">md</span>) — <span class="hljs-title class_">Compliance</span>-driven, not tech debt
- [<span class="hljs-title class_">Bug</span> tracker](reference_linear.<span class="hljs-property">md</span>) — <span class="hljs-title class_">Pipeline</span> bugs → <span class="hljs-title class_">Linear</span> <span class="hljs-variable constant_">INGEST</span>
<button class="copy-code-btn"></button></code></pre>
<p>MEMORY.md의 처음 200줄은 모든 세션에 로드됩니다. 그 이후는 보이지 않습니다.</p>
<p>한 가지 현명한 설계 선택: 유출된 시스템 프롬프트는 Claude에게 자체 메모리를 사실이 아닌 힌트로 취급하도록 지시합니다. 기억된 내용을 행동으로 옮기기 전에 실제 코드와 대조하여 확인하므로 환각을 줄이는 데 도움이 되며, 다른 <a href="https://milvus.io/blog/openagents-milvus-how-to-build-smarter-multi-agent-systems-that-share-memory.md">AI 에이전트 프레임워크에서도</a> 이러한 패턴을 채택하기 시작했습니다.</p>
<h2 id="How-Does-Auto-Dream-Consolidate-Stale-Memories" class="common-anchor-header">자동 기억은 오래된 기억을 어떻게 통합하나요?<button data-href="#How-Does-Auto-Dream-Consolidate-Stale-Memories" class="anchor-icon" translate="no">
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
    </button></h2><p>자동 메모리는 메모를 캡처하지만 몇 주 동안 사용하면 메모가 부실해집니다. "어제 배포 버그"라는 항목은 일주일이 지나면 의미가 없어집니다. PostgreSQL을 사용한다는 노트가 있고, MySQL로 마이그레이션했다는 최신 노트가 있습니다. 삭제된 파일에는 여전히 메모리 항목이 있습니다. 색인은 모순과 오래된 참조로 가득 차 있습니다.</p>
<p>Auto Dream은 정리 프로세스입니다. 백그라운드에서 실행되며</p>
<ul>
<li>모호한 시간 참조를 정확한 날짜로 바꿉니다. "어제 배포 이슈" → "2026-03-28 배포 이슈".</li>
<li>모순을 해결합니다. PostgreSQL 노트 + MySQL 노트 → 현재 사실을 유지합니다.</li>
<li>오래된 항목을 삭제합니다. 삭제된 파일이나 완료된 작업을 참조하는 노트가 제거됩니다.</li>
<li><code translate="no">MEMORY.md</code> 을 200줄 미만으로 유지합니다.</li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/claude_code_memory_memsearch_md_1_7973e94494.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>트리거 조건:</strong> 마지막 정리 후 24시간 이상 경과하고 새 세션이 5개 이상 누적된 경우. "dream"을 입력해 수동으로 실행할 수도 있습니다. 이 프로세스는 실제 절전 모드와 같이 백그라운드 하위 에이전트에서 실행되므로 활성 작업을 방해하지 않습니다.</p>
<p>드림 에이전트의 시스템 프롬프트는 다음과 같이 시작됩니다: <em>"메모리 파일에 대한 반사적 통과인 드림을 수행 중입니다."라는 메시지로 시작됩니다.</em></p>
<h2 id="What-Is-KAIROS-Claude-Codes-Unreleased-Always-On-Mode" class="common-anchor-header">카이로스란 무엇인가요? 클로드 코드의 미공개 올웨이즈온 모드<button data-href="#What-Is-KAIROS-Claude-Codes-Unreleased-Always-On-Mode" class="anchor-icon" translate="no">
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
    </button></h2><p>처음 세 개의 레이어는 라이브 또는 롤아웃 중입니다. 유출된 코드에는 아직 출시되지 않은 내용도 포함되어 있습니다: KAIROS입니다.</p>
<p>"적절한 순간"을 뜻하는 그리스어의 이름을 딴 것으로 보이는 KAIROS는 소스에서 150회 이상 등장합니다. 이는 클로드 코드를 사용자가 적극적으로 사용하는 도구에서 프로젝트를 지속적으로 감시하는 백그라운드 비서로 바꿔놓을 수 있습니다.</p>
<p>유출된 코드를 기반으로 KAIROS:</p>
<ul>
<li>하루 종일 관찰, 결정 및 조치에 대한 실행 로그를 유지합니다.</li>
<li>타이머로 체크인합니다. 일정한 간격으로 신호를 수신하고 행동할지, 아니면 조용히 있을지를 결정합니다.</li>
<li>방해하지 않습니다. 15초 이상 방해가 되는 모든 작업은 연기됩니다.</li>
<li>내부적으로 드림 클린업을 실행하고 백그라운드에서 관찰-사고-행동 루프를 실행합니다.</li>
<li>파일 푸시, 알림 전송, GitHub 풀 리퀘스트 모니터링 등 일반 Claude Code에는 없는 독점 도구가 있습니다.</li>
</ul>
<p>KAIROS는 컴파일 타임 기능 플래그 뒤에 있습니다. 공개 빌드에는 없습니다. <a href="https://milvus.io/blog/langchain-and-milvus-build-production-ready-agents-with-real-long-term-memory.md">에이전트 메모리가</a> 세션 단위가 아닌 상시 켜져 있을 때 어떤 일이 발생하는지 탐구하는 Anthropic이라고 생각하면 됩니다.</p>
<h2 id="Where-Does-Claude-Codes-Memory-Architecture-Break-Down" class="common-anchor-header">클로드 코드의 메모리 아키텍처는 어디에서 분해되나요?<button data-href="#Where-Does-Claude-Codes-Memory-Architecture-Break-Down" class="anchor-icon" translate="no">
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
    </button></h2><p>클로드 코드의 메모리는 실제로 작동합니다. 하지만 프로젝트가 성장함에 따라 5가지 구조적 제한으로 인해 처리할 수 있는 기능이 제한됩니다.</p>
<table>
<thead>
<tr><th>제한 사항</th><th>어떤 일이 발생하나요?</th></tr>
</thead>
<tbody>
<tr><td><strong>200줄 인덱스 한도</strong></td><td><code translate="no">MEMORY.md</code> 는 ~25KB를 보유합니다. 몇 달 동안 프로젝트를 실행하면 오래된 항목이 새로운 항목에 밀려납니다. "지난주에 우리가 결정한 Redis 구성은?" - 사라졌습니다.</td></tr>
<tr><td><strong>Grep 전용 검색</strong></td><td>메모리 검색은 리터럴 <a href="https://milvus.io/docs/full-text-search.md">키워드 매칭을</a> 사용합니다. "배포 시 포트 충돌"을 기억하지만 메모에는 "도커-컴포즈 포트 매핑"이라고 되어 있습니다. Grep은 그 간극을 메울 수 없습니다.</td></tr>
<tr><td><strong>요약만 있고 추론은 없음</strong></td><td>자동 메모리는 높은 수준의 노트만 저장할 뿐, 디버깅 단계나 추론은 저장하지 않습니다. <em>방법은</em> 사라집니다.</td></tr>
<tr><td><strong>기초를 다지지 않은 채 복잡성만 쌓입니다</strong></td><td>CLAUDE.md → 자동 메모리 → 자동 드림 → KAIROS. 각 레이어는 마지막 레이어가 충분하지 않았기 때문에 존재합니다. 하지만 아무리 많은 레이어를 쌓아도 그 밑에 있는 하나의 도구, 로컬 파일, 세션별 캡처는 변하지 않습니다.</td></tr>
<tr><td><strong>메모리는 클로드 코드 안에 잠겨 있습니다.</strong></td><td>OpenCode, Codex CLI 또는 다른 에이전트로 전환하면 모든 것이 제로에서 시작됩니다. 내보내기, 공유 형식, 이식성이 없습니다.</td></tr>
</tbody>
</table>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/claude_code_memory_memsearch_md_2_b006110116.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>이는 버그가 아닙니다. 단일 도구, 로컬 파일 아키텍처의 자연스러운 한계입니다. 매달 새로운 에이전트가 출시되고 워크플로가 바뀌지만 프로젝트에서 쌓아온 지식이 에이전트와 함께 사라져서는 안 됩니다. 이것이 바로 <a href="https://github.com/zilliztech/memsearch">memsearch를</a> 구축한 이유입니다.</p>
<h2 id="What-Is-memsearch-Persistent-Memory-for-Any-AI-Coding-Agent" class="common-anchor-header">멤서치란 무엇인가요? 모든 AI 코딩 에이전트를 위한 영구 메모리<button data-href="#What-Is-memsearch-Persistent-Memory-for-Any-AI-Coding-Agent" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://github.com/zilliztech/memsearch">memsearch는</a> 에이전트에서 자체 레이어로 메모리를 가져옵니다. 에이전트는 왔다가 사라집니다. 메모리는 유지됩니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/claude_code_memory_memsearch_md_3_4151da0414.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="How-to-Install-memsearch" class="common-anchor-header">memsearch 설치 방법</h3><p>Claude Code 사용자는 마켓플레이스에서 설치합니다:</p>
<pre><code translate="no">/plugin marketplace add zilliztech/memsearch
/plugin install memsearch
<button class="copy-code-btn"></button></code></pre>
<p>완료. 별도의 구성이 필요하지 않습니다.</p>
<p>다른 플랫폼도 마찬가지로 간단합니다. OpenClaw: <code translate="no">openclaw plugins install clawhub:memsearch</code>. uv 또는 pip를 통한 Python API:</p>
<pre><code translate="no">uv tool install <span class="hljs-string">&quot;memsearch[onnx]&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="What-Does-memsearch-Capture" class="common-anchor-header">memsearch는 무엇을 캡처하나요?</h3><p>일단 설치되면 memsearch는 에이전트의 라이프사이클에 연결됩니다. 모든 대화가 자동으로 요약되고 색인화됩니다. 기록이 필요한 질문을 하면 자동으로 리콜 트리거가 실행됩니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/claude_code_memory_memsearch_md_4_13b257186e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>메모리 파일은 하루에 한 파일씩 날짜가 지정된 마크다운으로 저장됩니다:</p>
<pre><code translate="no">.memsearch/
└── memory/
    ├── <span class="hljs-number">2026</span><span class="hljs-number">-03</span><span class="hljs-number">-28.</span>md    ← one <span class="hljs-keyword">file</span> per day
    ├── <span class="hljs-number">2026</span><span class="hljs-number">-03</span><span class="hljs-number">-29.</span>md
    ├── <span class="hljs-number">2026</span><span class="hljs-number">-03</span><span class="hljs-number">-30.</span>md
    └── <span class="hljs-number">2026</span><span class="hljs-number">-04</span><span class="hljs-number">-01.</span>md
<button class="copy-code-btn"></button></code></pre>
<p>모든 텍스트 편집기에서 메모리 파일을 열고, 읽고, 편집할 수 있습니다. 마이그레이션하려면 폴더를 복사하면 됩니다. 버전 관리를 원한다면 기본적으로 git이 작동합니다.</p>
<p><a href="https://milvus.io/docs/overview.md">Milvus에</a> 저장된 <a href="https://milvus.io/docs/index-explained.md">벡터 인덱스는</a> 캐시 레이어로, 손실될 경우 마크다운 파일에서 다시 빌드하면 됩니다. 데이터는 인덱스가 아니라 파일에 저장됩니다.</p>
<h2 id="How-Does-memsearch-Find-Memories-Semantic-Search-vs-Grep" class="common-anchor-header">멤서치는 메모리를 어떻게 찾나요? 시맨틱 검색과 그렙 비교<button data-href="#How-Does-memsearch-Find-Memories-Semantic-Search-vs-Grep" class="anchor-icon" translate="no">
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
    </button></h2><p>Claude Code의 메모리 검색은 리터럴 키워드 매칭인 grep을 사용합니다. 이 방법은 수십 개의 메모가 있을 때는 효과적이지만 정확한 문구를 기억할 수 없는 수개월의 기록이 쌓이면 고장이 납니다.</p>
<p>memsearch는 대신 <a href="https://milvus.io/blog/get-started-with-hybrid-semantic-full-text-search-with-milvus-2-5.md">하이브리드 검색을</a> 사용합니다. <a href="https://zilliz.com/glossary/semantic-search">시맨틱 벡터는</a> 문구가 다른 경우에도 검색어와 관련된 콘텐츠를 찾아내는 반면, BM25는 정확한 키워드를 일치시킵니다. <a href="https://milvus.io/docs/rrf-ranker.md">RRF(상호 순위 융합)는</a> 두 결과 집합을 병합하고 순위를 매깁니다.</p>
<p>"지난주에 Redis 시간 초과 문제를 어떻게 해결했나요?"라고 질문한다고 가정해 보겠습니다. - 시맨틱 검색은 의도를 이해하고 이를 찾아냅니다. &quot; <code translate="no">handleTimeout</code> 검색&quot;이라고 질문하면 BM25가 정확한 함수 이름을 찾아냅니다. 두 경로는 서로의 사각지대를 커버합니다.</p>
<p>리콜이 트리거되면 하위 에이전트는 3단계로 검색하여 필요할 때만 더 깊게 검색합니다:</p>
<h3 id="L1-Semantic-Search--Short-Previews" class="common-anchor-header">L1: 시맨틱 검색 - 짧은 미리보기</h3><p>하위 에이전트는 Milvus 인덱스에 대해 <code translate="no">memsearch search</code> 을 실행하여 가장 관련성이 높은 결과를 가져옵니다:</p>
<pre><code translate="no">┌─ L1 search results ────────────────────────────┐
│                                                 │
│  <span class="hljs-meta">#a3f8c1 [score: 0.85] memory/2026-03-28.md    │</span>
│  &gt; Redis port conflict during deploy, <span class="hljs-literal">default</span>   │
│    <span class="hljs-number">6379</span> occupied, switched to <span class="hljs-number">6380</span>, updated     │
│    docker-compose...                            │
│                                                 │
│  <span class="hljs-meta">#b7e2d4 [score: 0.72] memory/2026-03-25.md    │</span>
│  &gt; Auth module rewrite complete, JWT replaced   │
│    <span class="hljs-keyword">with</span> session tokens, mobile token refresh    │
│    was unreliable...                            │
│                                                 │
│  <span class="hljs-meta">#c9f1a6 [score: 0.68] memory/2026-03-20.md    │</span>
│  &gt; DB index optimization, added composite       │
│    index <span class="hljs-keyword">on</span> users table, query time dropped     │
│    <span class="hljs-keyword">from</span> <span class="hljs-number">800</span>ms to <span class="hljs-number">50</span>ms...                        │
│                                                 │
└─────────────────────────────────────────────────┘
<button class="copy-code-btn"></button></code></pre>
<p>각 결과에는 관련성 점수, 소스 파일, 200자 미리보기가 표시됩니다. 대부분의 쿼리는 여기서 멈춥니다.</p>
<h3 id="L2-Full-Context--Expand-a-Specific-Result" class="common-anchor-header">L2: 전체 컨텍스트 - 특정 결과 펼치기</h3><p>L1의 미리보기로 충분하지 않은 경우 하위 에이전트는 <code translate="no">memsearch expand a3f8c1</code> 을 실행하여 전체 항목을 가져옵니다:</p>
<pre><code translate="no">┌─ L2 expanded result ───────────────────────────┐
│                                                 │
│  <span class="hljs-comment">## 2026-03-28 Deploy troubleshooting           │</span>
│                                                 │
│  Redis port conflict resolution:                │
│  1. docker-compose up → Redis container failed  │
│  2. Host port 6379 occupied by another instance │
│  3. Changed docker-compose.yml: <span class="hljs-string">&quot;6380:6379&quot;</span>     │
│  4. Updated .<span class="hljs-built_in">env</span>: REDIS_PORT=6380               │
│  5. Updated config/database.py connection       │
│                                                 │
│  Note: Only affects <span class="hljs-built_in">local</span> dev. Prod unaffected. │
│                                                 │
│  [<span class="hljs-built_in">source</span>: memory/2026-03-28.md  lines: 42-55]  │
└─────────────────────────────────────────────────┘
<button class="copy-code-btn"></button></code></pre>
<h3 id="L3-Raw-Conversation-Transcript" class="common-anchor-header">L3: 원시 대화 내용</h3><p>드물지만 정확히 무슨 말이 오갔는지 확인해야 하는 경우에는 하위 에이전트가 원본 교환을 가져옵니다:</p>
<pre><code translate="no">┌─ L3 raw transcript ───────────────────────────┐
│                                                │
│  [user] docker-compose up won&#x27;t start, Redis   │
│         port conflict — can you take a look?   │
│                                                │
│  [agent] Checking host port usage...           │
│          Running lsof -i :6379...              │
│          Suggest remapping to port 6380...     │
│          (tool_call: Bash &quot;lsof -i :6379&quot;)     │
│          (tool_call: Edit &quot;docker-compose.yml&quot;)│
│                                                │
│  [user] Done. Anything else to update?         │
│                                                │
│  [agent] Also need to update .env and          │
│          database.py...                        │
│                                                │
└────────────────────────────────────────────────┘
<button class="copy-code-btn"></button></code></pre>
<p>대화 내용에는 사용자의 정확한 말, 상담원의 정확한 응답, 모든 툴 호출 등 모든 것이 보존됩니다. 하위 에이전트가 드릴링 깊이를 결정한 다음 정리된 결과를 메인 세션에 반환하는 세 단계로 진행됩니다.</p>
<h2 id="How-Does-memsearch-Share-Memory-Across-AI-Coding-Agents" class="common-anchor-header">멤서치는 AI 코딩 에이전트 간에 메모리를 어떻게 공유하나요?<button data-href="#How-Does-memsearch-Share-Memory-Across-AI-Coding-Agents" class="anchor-icon" translate="no">
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
    </button></h2><p>이것이 멤서치와 클로드 코드의 메모리 간의 가장 근본적인 차이점입니다.</p>
<p>Claude Code의 메모리는 하나의 도구 안에 잠겨 있습니다. OpenCode, OpenClaw 또는 Codex CLI를 사용하면 처음부터 다시 시작해야 합니다. MEMORY.md는 로컬이며 한 명의 사용자와 한 명의 에이전트에 바인딩됩니다.</p>
<p>memsearch는 네 가지 코딩 에이전트를 지원합니다: Claude Code, OpenClaw, OpenCode 및 Codex CLI. 이 에이전트들은 동일한 Markdown 메모리 형식과 동일한 <a href="https://milvus.io/docs/manage-collections.md">Milvus 컬렉션을</a> 공유합니다. 어떤 에이전트에서 작성된 메모리는 다른 모든 에이전트에서 검색할 수 있습니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/claude_code_memory_memsearch_md_5_6ed2e386b9.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>두 가지 실제 시나리오:</strong></p>
<p><strong>도구 전환.</strong> 오후 내내 Claude Code에서 배포 파이프라인을 파악하는 데 시간을 보내다가 몇 가지 걸림돌에 부딪힙니다. 대화가 자동으로 요약되고 색인화됩니다. 다음 날 OpenCode로 전환하여 "어제 포트 충돌을 어떻게 해결했나요?"라고 질문합니다. OpenCode는 멤서치를 검색하여 어제의 클로드 코드 메모리를 찾아서 정답을 알려줍니다.</p>
<p><strong>팀 협업.</strong> Milvus 백엔드를 <a href="https://cloud.zilliz.com/signup">Zilliz Cloud로</a> 지정하고 여러 개발자가 서로 다른 컴퓨터에서 서로 다른 에이전트를 사용하여 동일한 프로젝트 메모리를 읽고 쓸 수 있습니다. 새로운 팀원이 합류해도 에이전트가 이미 알고 있으므로 몇 달 동안의 Slack과 문서를 파헤칠 필요가 없습니다.</p>
<h2 id="Developer-API" class="common-anchor-header">개발자 API<button data-href="#Developer-API" class="anchor-icon" translate="no">
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
    </button></h2><p>자체 <a href="https://milvus.io/blog/how-to-build-productionready-multiagent-systems-with-agno-and-milvus.md">에이전트 툴을</a> 구축하는 경우, memsearch는 CLI 및 Python API를 제공합니다.</p>
<p><strong>CLI:</strong></p>
<pre><code translate="no" class="language-bash"><span class="hljs-comment"># Index markdown files</span>
memsearch index ./memory

<span class="hljs-comment"># Search memories</span>
memsearch search <span class="hljs-string">&quot;Redis port conflict&quot;</span>

<span class="hljs-comment"># Expand a specific memory&#x27;s full content</span>
memsearch <span class="hljs-built_in">expand</span> a3f8c1

<span class="hljs-comment"># Watch for file changes, auto-index</span>
memsearch watch ./memory

<span class="hljs-comment"># Compact old memories</span>
memsearch compact
<button class="copy-code-btn"></button></code></pre>
<p><strong>Python API:</strong></p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> memsearch <span class="hljs-keyword">import</span> MemSearch

mem = MemSearch(paths=[<span class="hljs-string">&quot;./memory&quot;</span>])
<span class="hljs-keyword">await</span> mem.index()                          <span class="hljs-comment"># index markdown</span>
results = <span class="hljs-keyword">await</span> mem.search(<span class="hljs-string">&quot;Redis config&quot;</span>) <span class="hljs-comment"># hybrid search</span>
<span class="hljs-keyword">await</span> mem.compact()                        <span class="hljs-comment"># compact old memories</span>
<span class="hljs-keyword">await</span> mem.watch()                          <span class="hljs-comment"># auto-index on file change</span>
<button class="copy-code-btn"></button></code></pre>
<p>내부적으로 Milvus는 벡터 검색을 처리합니다. <a href="https://milvus.io/docs/milvus_lite.md">Milvus Lite</a> (제로 구성)로 로컬에서 실행하거나, <a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a> (무료 티어 사용 가능)를 통해 협업하거나, Docker로 자체 호스팅할 수 있습니다. <a href="https://milvus.io/docs/embeddings.md">임베딩</a> 기본값은 ONNX로, CPU에서 실행되며 GPU는 필요하지 않습니다. 언제든지 OpenAI 또는 Ollama로 교체할 수 있습니다.</p>
<h2 id="Claude-Code-Memory-vs-memsearch-Full-Comparison" class="common-anchor-header">클로드 코드 메모리와 멤서치 비교: 전체 비교<button data-href="#Claude-Code-Memory-vs-memsearch-Full-Comparison" class="anchor-icon" translate="no">
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
<tr><th>기능</th><th>클로드 코드 메모리</th><th>memsearch</th></tr>
</thead>
<tbody>
<tr><td>저장되는 항목</td><td>클로드가 중요하다고 생각하는 항목</td><td>모든 대화, 자동 요약</td></tr>
<tr><td>저장 용량 제한</td><td>~200줄 색인(~25KB)</td><td>무제한(일일 파일 + 벡터 색인)</td></tr>
<tr><td>오래된 기억 찾기</td><td>그렙 키워드 매칭</td><td>의미 기반 + 키워드 하이브리드 검색(밀버스)</td></tr>
<tr><td>읽을 수 있나요?</td><td>수동으로 메모리 폴더 확인</td><td>.md 파일 열기</td></tr>
<tr><td>편집할 수 있나요?</td><td>수동으로 파일 편집</td><td>동일 - 저장 시 자동 색인 다시 생성</td></tr>
<tr><td>버전 관리</td><td>설계되지 않음</td><td>git은 기본적으로 작동합니다.</td></tr>
<tr><td>교차 도구 지원</td><td>클로드 코드만 지원</td><td>에이전트 4명, 공유 메모리</td></tr>
<tr><td>장기 리콜</td><td>몇 주 후 성능 저하</td><td>수개월에 걸쳐 지속적</td></tr>
</tbody>
</table>
<h2 id="Get-Started-with-memsearch" class="common-anchor-header">멤서치 시작하기<button data-href="#Get-Started-with-memsearch" class="anchor-icon" translate="no">
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
    </button></h2><p>클로드 코드의 메모리는 자기 회의적인 설계, 꿈 통합 개념, KAIROS의 15초 차단 예산 등 진정한 강점을 가지고 있습니다. 앤트로픽은 이 문제에 대해 열심히 고민하고 있습니다.</p>
<p>하지만 단일 도구 메모리에는 한계가 있습니다. 워크플로우가 여러 에이전트, 여러 사람 또는 몇 주 이상의 기록에 걸쳐 있으면 자체적으로 존재하는 메모리가 필요합니다.</p>
<ul>
<li>MIT 라이선스를 받은 오픈 소스인 <a href="https://github.com/zilliztech/memsearch">memsearch를</a> 사용해 보세요. 두 가지 명령으로 Claude Code에 설치하세요.</li>
<li><a href="https://milvus.io/blog/we-extracted-openclaws-memory-system-and-opensourced-it-memsearch.md">memsearch의 내부 작동 방식</a> 또는 <a href="https://milvus.io/blog/adding-persistent-memory-to-claude-code-with-the-lightweight-memsearch-plugin.md">Claude Code 플러그인 가이드를</a> 읽어보세요.</li>
<li>질문이 있으신가요? <a href="https://discord.com/invite/8uyFbECzPX">Milvus Discord 커뮤니티에</a> 가입하거나 <a href="https://milvus.io/office-hours">무료 오피스 아워 세션을 예약하여</a> 사용 사례를 살펴보세요.</li>
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
    </button></h2><h3 id="How-does-Claude-Codes-memory-system-work-under-the-hood" class="common-anchor-header">클로드 코드의 메모리 시스템은 내부적으로 어떻게 작동하나요?</h3><p>클로드 코드는 4계층 메모리 아키텍처를 사용하며, 모두 로컬 마크다운 파일로 저장됩니다. CLAUDE.md는 수동으로 작성하는 정적 규칙 파일입니다. 자동 메모리는 세션 중에 사용자 환경설정, 피드백, 프로젝트 컨텍스트, 참조 포인터의 네 가지 카테고리로 구성된 자체 메모를 저장할 수 있습니다. 자동 드림은 오래된 메모를 백그라운드에서 통합합니다. KAIROS는 유출된 소스 코드에서 발견된 미공개 상시 실행 데몬입니다. 전체 시스템의 색인은 200줄로 제한되어 있으며, 시맨틱 검색이나 의미 기반 리콜 없이 정확한 키워드 매칭으로만 검색할 수 있습니다.</p>
<h3 id="Can-AI-coding-agents-share-memory-across-different-tools" class="common-anchor-header">AI 코딩 에이전트가 여러 도구에서 메모리를 공유할 수 있나요?</h3><p>기본적으로 불가능합니다. 클로드 코드의 메모리는 클로드 코드에 고정되어 있으며, 내보내기 형식이나 에이전트 간 프로토콜이 없습니다. OpenCode, Codex CLI 또는 OpenClaw로 전환하면 처음부터 다시 시작해야 합니다. memsearch는 메모리를 <a href="https://zilliz.com/learn/what-is-vector-database">벡터 데이터베이스</a> (Milvus)에 색인된 날짜가 지정된 마크다운 파일로 저장하여 이 문제를 해결합니다. 지원되는 네 가지 에이전트 모두 동일한 메모리 저장소를 읽고 쓰므로 도구를 전환할 때 컨텍스트가 자동으로 전송됩니다.</p>
<h3 id="What-is-the-difference-between-keyword-search-and-semantic-search-for-agent-memory" class="common-anchor-header">에이전트 메모리에 대한 키워드 검색과 시맨틱 검색의 차이점은 무엇인가요?</h3><p>키워드 검색(grep)은 정확한 문자열을 일치시킵니다. 메모리에 "docker-compose 포트 매핑"이라고 되어 있지만 "포트 충돌"을 검색하면 아무것도 반환되지 않습니다. 시맨틱 검색은 텍스트를 의미를 포착하는 <a href="https://zilliz.com/glossary/vector-embeddings">벡터 임베딩으로</a> 변환하므로 문구가 다르더라도 관련 개념이 일치합니다. memsearch는 두 가지 접근 방식을 하이브리드 검색과 결합하여 단일 쿼리에서 의미 기반 리콜과 정확한 키워드 정밀도를 제공합니다.</p>
<h3 id="What-was-leaked-in-the-Claude-Code-source-code-incident" class="common-anchor-header">클로드 코드 소스 코드 사건에서 유출된 내용은 무엇인가요?</h3><p>클로드 코드 2.1.88 버전은 프로덕션 빌드에서 제거되었어야 할 59.8MB의 소스 맵 파일과 함께 제공되었습니다. 이 파일에는 전체 메모리 시스템 구현, Auto Dream 통합 프로세스, 아직 출시되지 않은 상시 대기 에이전트 모드인 KAIROS에 대한 참조를 포함하여 약 512,000줄의 읽기 가능한 전체 TypeScript 코드베이스가 포함되어 있었습니다. 이 코드는 삭제되기 전에 GitHub에 빠르게 미러링되었습니다.</p>
