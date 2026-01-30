---
id: >-
  why-claude-code-feels-so-stable-a-developers-deep-dive-into-its-local-storage-design.md
title: '클로드 코드가 안정적으로 느껴지는 이유: 로컬 스토리지 설계에 대한 개발자의 심층 분석'
author: Bill Chen
date: 2026-01-30T00:00:00.000Z
cover: assets.zilliz.com/cover_Claudecode_storage_81155960ef.jpeg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Claude, Claude Code, Vector Database, Retreival Augmented Generation, Milvus'
meta_keywords: 'Claude Code, AI agent, AI coding assistant, Agent memory'
meta_title: |
  How Claude Code Manages Local Storage for AI Agents
desc: >-
  클로드 코드의 스토리지에 대해 자세히 알아보세요: JSONL 세션 로그, 프로젝트 격리, 계층화된 구성 및 파일 스냅샷으로 AI 지원 코딩을
  안정적이고 복구 가능하게 합니다.
origin: >-
  https://milvus.io/blog/why-claude-code-feels-so-stable-a-developers-deep-dive-into-its-local-storage-design.md
---
<p>Claude Code는 최근 모든 곳에서 사용되고 있습니다. 개발자들은 기능을 더 빠르게 출시하고, 워크플로를 자동화하고, 실제 프로젝트에서 작동하는 에이전트를 프로토타이핑하는 데 사용하고 있습니다. 더욱 놀라운 점은 코딩을 하지 않는 사람들도 도구를 구축하고, 작업을 연결하고, 거의 설정 없이도 유용한 결과를 얻는 등 많은 사람들이 이 도구에 뛰어들었다는 것입니다. AI 코딩 도구가 이렇게 다양한 기술 수준에 걸쳐 빠르게 확산되는 경우는 드뭅니다.</p>
<p>하지만 정말 눈에 띄는 것은 <em>안정성이라는</em> 점입니다. Claude Code는 여러 세션에서 일어난 일을 기억하고, 진행 상황을 잃지 않고 충돌을 극복하며, 채팅 인터페이스가 아닌 로컬 개발 도구처럼 작동합니다. 이러한 안정성은 로컬 저장소를 처리하는 방식에서 비롯됩니다.</p>
<p>Claude Code는 코딩 세션을 임시 채팅으로 취급하는 대신 실제 파일을 읽고 쓰고, 프로젝트 상태를 디스크에 저장하고, 상담원의 모든 작업 단계를 기록합니다. 세션을 추측 없이 재개, 검사 또는 롤백할 수 있으며, 각 프로젝트가 깨끗하게 격리되어 있어 많은 상담원 도구에서 발생하는 교차 오염 문제를 피할 수 있습니다.</p>
<p>이 글에서는 이러한 안정성을 뒷받침하는 스토리지 아키텍처를 자세히 살펴보고, 이 아키텍처가 일상적인 개발에서 Claude Code를 실용적으로 만드는 데 큰 역할을 하는 이유에 대해 설명합니다.</p>
<h2 id="Challenges-Every-Local-AI-Coding-Assistant-Faces" class="common-anchor-header">모든 로컬 AI 코딩 어시스턴트가 직면한 과제<button data-href="#Challenges-Every-Local-AI-Coding-Assistant-Faces" class="anchor-icon" translate="no">
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
    </button></h2><p>Claude Code가 스토리지에 접근하는 방식을 설명하기 전에 로컬 AI 코딩 도구가 직면하는 일반적인 문제를 살펴봅시다. 이러한 문제는 어시스턴트가 파일 시스템에서 직접 작업하고 시간이 지나도 상태를 유지할 때 자연스럽게 발생합니다.</p>
<p><strong>1. 프로젝트 데이터가 여러 작업 공간에 섞여 있습니다.</strong></p>
<p>대부분의 개발자는 하루 종일 여러 리포지토리를 전환합니다. 어시스턴트가 한 프로젝트에서 다른 프로젝트로 상태를 이월하면 그 동작을 이해하기 어렵고 잘못된 가정을 하기 쉬워집니다. 각 프로젝트에는 상태와 히스토리를 위한 깨끗하고 격리된 자체 공간이 필요합니다.</p>
<p><strong>2. 크래시로 인해 데이터가 손실될 수 있습니다.</strong></p>
<p>코딩 세션 중에 어시스턴트는 파일 편집, 도구 호출, 중간 단계 등 유용한 데이터를 꾸준히 생성합니다. 이 데이터를 즉시 저장하지 않으면 충돌이나 강제 재시작으로 인해 데이터가 지워질 수 있습니다. 안정적인 시스템은 중요한 상태가 생성되는 즉시 디스크에 기록하므로 예기치 않게 작업이 손실되지 않습니다.</p>
<p><strong>3. 상담원이 실제로 무엇을 했는지 항상 명확하지 않습니다.</strong></p>
<p>일반적인 세션에는 많은 작은 작업이 포함됩니다. 이러한 작업에 대한 명확하고 정돈된 기록이 없으면 어시스턴트가 특정 결과물에 어떻게 도달했는지 역추적하거나 문제가 발생한 단계를 찾기가 어렵습니다. 전체 기록이 있으면 디버깅과 검토가 훨씬 더 관리하기 쉬워집니다.</p>
<p><strong>4. 실수를 되돌리려면 너무 많은 노력이 필요합니다.</strong></p>
<p>가끔 어시스턴트가 제대로 작동하지 않는 변경을 할 때가 있습니다. 이러한 변경 사항을 롤백할 수 있는 기본 제공 방법이 없다면 결국 리포지토리 전체에서 수동으로 편집 내용을 찾아야 합니다. 시스템이 자동으로 변경된 내용을 추적하여 추가 작업 없이 깔끔하게 되돌릴 수 있어야 합니다.</p>
<p><strong>5. 프로젝트마다 다른 설정이 필요합니다.</strong></p>
<p>로컬 환경은 다양합니다. 어떤 프로젝트는 특정 권한, 도구 또는 디렉터리 규칙이 필요하고, 어떤 프로젝트는 사용자 지정 스크립트나 워크플로우가 필요합니다. 어시스턴트는 이러한 차이를 존중하고 프로젝트별 설정을 허용하면서도 핵심 동작은 일관되게 유지해야 합니다.</p>
<h2 id="The-Storage-Design-Principles-Behind-Claude-Code" class="common-anchor-header">클로드 코드의 스토리지 설계 원칙<button data-href="#The-Storage-Design-Principles-Behind-Claude-Code" class="anchor-icon" translate="no">
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
    </button></h2><p>Claude Code의 스토리지 디자인은 네 가지 간단한 아이디어를 중심으로 구축되었습니다. 단순해 보일 수 있지만, AI 어시스턴트가 머신과 여러 프로젝트에서 직접 작업할 때 발생하는 실질적인 문제를 함께 해결합니다.</p>
<h3 id="1-Each-project-gets-its-own-storage" class="common-anchor-header">1. 각 프로젝트마다 고유한 저장 공간을 확보합니다.</h3><p>클로드 코드는 모든 세션 데이터를 해당 세션이 속한 프로젝트 디렉토리에 연결합니다. 즉, 대화, 편집 및 로그는 해당 프로젝트에 보관되며 다른 프로젝트로 유출되지 않습니다. 저장소를 분리하면 어시스턴트의 동작을 더 쉽게 이해할 수 있고 특정 리포지토리의 데이터를 검사하거나 삭제하기 쉬워집니다.</p>
<h3 id="2-Data-is-saved-to-disk-right-away" class="common-anchor-header">2. 데이터가 바로 디스크에 저장됩니다.</h3><p>Claude Code는 인터랙션 데이터를 메모리에 보관하는 대신 생성되는 즉시 디스크에 기록합니다. 각 이벤트(메시지, 도구 호출 또는 상태 업데이트)는 새 항목으로 추가됩니다. 프로그램이 충돌하거나 예기치 않게 종료되더라도 거의 모든 데이터가 그대로 유지됩니다. 이 접근 방식은 복잡성을 크게 추가하지 않고도 세션의 내구성을 유지합니다.</p>
<h3 id="3-Every-action-has-a-clear-place-in-history" class="common-anchor-header">3. 모든 작업은 기록에서 명확한 위치를 차지합니다.</h3><p>Claude Code는 각 메시지와 도구 작업을 그 이전의 작업과 연결하여 완전한 시퀀스를 형성합니다. 이렇게 정돈된 이력을 통해 세션이 어떻게 전개되었는지 검토하고 특정 결과를 이끌어낸 단계를 추적할 수 있습니다. 개발자는 이러한 종류의 추적을 통해 에이전트 동작을 훨씬 쉽게 디버깅하고 이해할 수 있습니다.</p>
<h3 id="4-Code-edits-are-easy-to-roll-back" class="common-anchor-header">4. 코드 편집 내용을 쉽게 롤백할 수 있습니다.</h3><p>어시스턴트가 파일을 업데이트하기 전에 Claude Code는 이전 상태의 스냅샷을 저장합니다. 변경 사항이 잘못된 것으로 판명되면 리포지토리를 뒤지거나 무엇이 변경되었는지 추측할 필요 없이 이전 버전으로 복원할 수 있습니다. 이 간단한 안전망 덕분에 AI 기반 편집은 훨씬 덜 위험합니다.</p>
<h2 id="Claude-Code-Local-Storage-Layout" class="common-anchor-header">클로드 코드 로컬 스토리지 레이아웃<button data-href="#Claude-Code-Local-Storage-Layout" class="anchor-icon" translate="no">
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
    </button></h2><p>Claude Code는 모든 로컬 데이터를 한 곳, 즉 홈 디렉토리에 저장합니다. 따라서 시스템을 예측 가능하게 유지하고 필요할 때 검사, 디버그 또는 정리를 더 쉽게 할 수 있습니다. 스토리지 레이아웃은 작은 전역 설정 파일과 모든 프로젝트 수준 상태가 저장되는 더 큰 데이터 디렉터리라는 두 가지 주요 구성 요소를 중심으로 구축됩니다.</p>
<p><strong>두 가지 핵심 구성 요소:</strong></p>
<ul>
<li><p><code translate="no">~/.claude.json</code>프로젝트 매핑, MCP 서버 설정, 최근에 사용한 프롬프트 등 글로벌 구성과 바로가기를 저장합니다.</p></li>
<li><p><code translate="no">~/.claude/</code>기본 데이터 디렉토리: 대화, 프로젝트 세션, 권한, 플러그인, 스킬, 기록 및 관련 런타임 데이터를 저장하는 곳입니다.</p></li>
</ul>
<p>이제 이 두 가지 핵심 구성 요소를 자세히 살펴보겠습니다.</p>
<p><strong>(1) 전역 구성</strong>: <code translate="no">~/.claude.json</code></p>
<p>이 파일은 데이터 저장소가 아닌 인덱스 역할을 합니다. 어떤 프로젝트에서 작업했는지, 각 프로젝트에 어떤 도구가 첨부되어 있는지, 최근에 사용한 프롬프트가 무엇인지 기록합니다. 대화 데이터 자체는 여기에 저장되지 않습니다.</p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;projects&quot;</span>: {
    <span class="hljs-string">&quot;/Users/xxx/my-project&quot;</span>: {
      <span class="hljs-string">&quot;mcpServers&quot;</span>: {
        <span class="hljs-string">&quot;jarvis-tasks&quot;</span>: {
          <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;stdio&quot;</span>,
          <span class="hljs-string">&quot;command&quot;</span>: <span class="hljs-string">&quot;python&quot;</span>,
          <span class="hljs-string">&quot;args&quot;</span>: [<span class="hljs-string">&quot;/path/to/run_mcp.py&quot;</span>]
        }
      }
    }
  },
  <span class="hljs-string">&quot;recentPrompts&quot;</span>: [
    <span class="hljs-string">&quot;Fix the bug in auth module&quot;</span>,
    <span class="hljs-string">&quot;Add unit tests&quot;</span>
  ]
}
<button class="copy-code-btn"></button></code></pre>
<p><strong>(2) 기본 데이터 디렉토리</strong>: <code translate="no">~/.claude/</code></p>
<p><code translate="no">~/.claude/</code> 디렉토리는 클로드 코드의 로컬 상태 대부분이 있는 곳입니다. 이 구조는 프로젝트 격리, 즉각적인 지속성, 실수로부터의 안전한 복구라는 몇 가지 핵심 설계 아이디어를 반영합니다.</p>
<pre><code translate="no">~/.claude/
├── settings.json                    <span class="hljs-comment"># Global settings (permissions, plugins, cleanup intervals)</span>
├── settings.local.json              <span class="hljs-comment"># Local settings (machine-specific, not committed to Git)</span>
├── history.jsonl                    <span class="hljs-comment"># Command history</span>
│
├── projects/                        <span class="hljs-comment"># 📁 Session data (organized by project, core directory)</span>
│   └── -Users-xxx-project/          <span class="hljs-comment"># Path-encoded project directory</span>
│       ├── {session-<span class="hljs-built_in">id</span>}.jsonl       <span class="hljs-comment"># Primary session data (JSONL format)</span>
│       └── agent-{agentId}.jsonl    <span class="hljs-comment"># Sub-agent session data</span>
│
├── session-env/                     <span class="hljs-comment"># Session environment variables</span>
│   └── {session-<span class="hljs-built_in">id</span>}/                <span class="hljs-comment"># Isolated by session ID</span>
│
├── skills/                          <span class="hljs-comment"># 📁 User-level skills (globally available)</span>
│   └── mac-mail/
│       └── SKILL.md
│
├── plugins/                         <span class="hljs-comment"># 📁 Plugin management</span>
│   ├── config.json                  <span class="hljs-comment"># Global plugin configuration</span>
│   ├── installed_plugins.json       <span class="hljs-comment"># List of installed plugins</span>
│   ├── known_marketplaces.json      <span class="hljs-comment"># Marketplace source configuration</span>
│   ├── cache/                       <span class="hljs-comment"># Plugin cache</span>
│   └── marketplaces/
│       └── anthropic-agent-skills/
│           ├── .claude-plugin/
│           │   └── marketplace.json
│           └── skills/
│               ├── pdf/
│               ├── docx/
│               └── frontend-design/
│
├── todos/                           <span class="hljs-comment"># Task list storage</span>
│   └── {session-<span class="hljs-built_in">id</span>}-*.json          <span class="hljs-comment"># Session-linked task files</span>
│
├── file-history/                    <span class="hljs-comment"># File edit history (stored by content hash)</span>
│   └── {content-<span class="hljs-built_in">hash</span>}/              <span class="hljs-comment"># Hash-named backup directory</span>
│
├── shell-snapshots/                 <span class="hljs-comment"># Shell state snapshots</span>
├── plans/                           <span class="hljs-comment"># Plan Mode storage</span>
├── local/                           <span class="hljs-comment"># Local tools / node_modules</span>
│   └── claude                       <span class="hljs-comment"># Claude CLI executable</span>
│   └── node_modules/                <span class="hljs-comment"># Local dependencies</span>
│
├── statsig/                         <span class="hljs-comment"># Feature flag cache</span>
├── telemetry/                       <span class="hljs-comment"># Telemetry data</span>
└── debug/                           <span class="hljs-comment"># Debug logs</span>
<button class="copy-code-btn"></button></code></pre>
<p>이 레이아웃은 의도적으로 단순합니다. Claude Code에서 생성하는 모든 것이 프로젝트와 세션별로 정리된 하나의 디렉터리 아래에 있습니다. 시스템 곳곳에 숨겨진 상태가 흩어져 있지 않으므로 필요할 때 쉽게 검사하거나 정리할 수 있습니다.</p>
<h2 id="How-Claude-Code-Manages-Configuration" class="common-anchor-header">클로드 코드의 구성 관리 방식<button data-href="#How-Claude-Code-Manages-Configuration" class="anchor-icon" translate="no">
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
    </button></h2><p>Claude Code의 구성 시스템은 여러 머신에서 기본 동작을 일관되게 유지하되 개별 환경과 프로젝트에서 필요한 사항을 사용자 지정할 수 있도록 하는 간단한 아이디어를 중심으로 설계되었습니다. 이를 위해 Claude Code는 3계층 구성 모델을 사용합니다. 동일한 설정이 두 곳 이상에서 나타나는 경우 항상 더 구체적인 계층이 우선합니다.</p>
<h3 id="The-three-configuration-levels" class="common-anchor-header">세 가지 구성 수준</h3><p>Claude Code는 우선순위가 가장 낮은 것부터 가장 높은 것 순으로 구성을 로드합니다:</p>
<pre><code translate="no">┌─────────────────────────────────────────┐
│    <span class="hljs-title class_">Project</span>-level configuration          │  <span class="hljs-title class_">Highest</span> priority
│    project/.<span class="hljs-property">claude</span>/settings.<span class="hljs-property">json</span>        │  <span class="hljs-title class_">Project</span>-specific, overrides other configs
├─────────────────────────────────────────┤
│    <span class="hljs-title class_">Local</span> configuration                  │  <span class="hljs-title class_">Machine</span>-specific, not version-controlled
│    ~<span class="hljs-regexp">/.claude/</span>settings.<span class="hljs-property">local</span>.<span class="hljs-property">json</span>        │  <span class="hljs-title class_">Overrides</span> <span class="hljs-variable language_">global</span> configuration
├─────────────────────────────────────────┤
│    <span class="hljs-title class_">Global</span> configuration                 │  <span class="hljs-title class_">Lowest</span> priority
│    ~<span class="hljs-regexp">/.claude/</span>settings.<span class="hljs-property">json</span>              │  <span class="hljs-title class_">Base</span> <span class="hljs-keyword">default</span> configuration
└─────────────────────────────────────────┘
<button class="copy-code-btn"></button></code></pre>
<p>글로벌 기본값으로 시작한 다음 머신별 조정을 적용하고 마지막으로 프로젝트별 규칙을 적용한다고 생각하면 됩니다.</p>
<p>이제 각 구성 수준을 자세히 살펴보겠습니다.</p>
<p><strong>(1) 전역 구성</strong>: <code translate="no">~/.claude/settings.json</code></p>
<p>전역 구성은 모든 프로젝트에서 클로드 코드의 기본 동작을 정의합니다. 여기서 기본 권한을 설정하고, 플러그인을 활성화하고, 정리 동작을 구성할 수 있습니다.</p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;<span class="hljs-variable">$schema</span>&quot;</span>: <span class="hljs-string">&quot;https://json.schemastore.org/claude-code-settings.json&quot;</span>,
  <span class="hljs-string">&quot;permissions&quot;</span>: {
    <span class="hljs-string">&quot;allow&quot;</span>: [<span class="hljs-string">&quot;Read(**)&quot;</span>, <span class="hljs-string">&quot;Bash(npm:*)&quot;</span>],
    <span class="hljs-string">&quot;deny&quot;</span>: [<span class="hljs-string">&quot;Bash(rm -rf:*)&quot;</span>],
    <span class="hljs-string">&quot;ask&quot;</span>: [<span class="hljs-string">&quot;Edit&quot;</span>, <span class="hljs-string">&quot;Write&quot;</span>]
  },
  <span class="hljs-string">&quot;enabledPlugins&quot;</span>: {
    <span class="hljs-string">&quot;document-skills@anthropic-agent-skills&quot;</span>: <span class="hljs-literal">true</span>
  },
  <span class="hljs-string">&quot;cleanupPeriodDays&quot;</span>: 30
}
<button class="copy-code-btn"></button></code></pre>
<p><strong>(2) 로컬 구성</strong>: <code translate="no">~/.claude/settings.local.json</code></p>
<p>로컬 구성은 단일 머신에만 적용됩니다. 공유하거나 버전 관리로 확인하지 않습니다. 따라서 API 키, 로컬 도구 또는 환경별 권한을 저장하기에 좋은 곳입니다.</p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;permissions&quot;</span>: {
    <span class="hljs-string">&quot;allow&quot;</span>: [<span class="hljs-string">&quot;Bash(git:*)&quot;</span>, <span class="hljs-string">&quot;Bash(docker:*)&quot;</span>]
  },
  <span class="hljs-string">&quot;env&quot;</span>: {
    <span class="hljs-string">&quot;ANTHROPIC_API_KEY&quot;</span>: <span class="hljs-string">&quot;sk-ant-xxx&quot;</span>
  }
}
<button class="copy-code-btn"></button></code></pre>
<p><strong>(3) 프로젝트 수준 구성</strong>: <code translate="no">project/.claude/settings.json</code></p>
<p>프로젝트 수준 구성은 단일 프로젝트에만 적용되며 우선순위가 가장 높습니다. 여기에서 해당 리포지토리에서 작업할 때 항상 적용되어야 하는 규칙을 정의할 수 있습니다.</p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;permissions&quot;</span>: {
    <span class="hljs-string">&quot;allow&quot;</span>: [<span class="hljs-string">&quot;Bash(pytest:*)&quot;</span>]
  }
}
<button class="copy-code-btn"></button></code></pre>
<p>구성 계층이 정의되었으므로 다음 질문은 <strong>Claude Code가 런타임에 실제로 구성 및 권한을 해결하는 방법입니다.</strong></p>
<p><strong>Claude Code는</strong> 글로벌 기본값으로 시작한 다음, 머신별 재정의, 마지막으로 프로젝트별 규칙을 적용하는 세 가지 계층으로 구성을 적용합니다. 동일한 설정이 여러 곳에 표시되는 경우 가장 구체적인 설정이 우선 적용됩니다.</p>
<p>권한은 고정된 평가 순서를 따릅니다:</p>
<ol>
<li><p><strong>거부</strong> - 항상 차단</p></li>
<li><p><strong>ask</strong> - 확인 필요</p></li>
<li><p><strong>허용</strong> - 자동으로 실행</p></li>
<li><p><strong>기본값</strong> - 일치하는 규칙이 없을 때만 적용</p></li>
</ol>
<p>이렇게 하면 기본적으로 시스템을 안전하게 유지하면서 프로젝트와 개별 시스템에 필요한 유연성을 제공합니다.</p>
<h2 id="Session-Storage-How-Claude-Code-Persists-Core-Interaction-Data" class="common-anchor-header">세션 스토리지: 클로드 코드가 핵심 인터랙션 데이터를 유지하는 방법<button data-href="#Session-Storage-How-Claude-Code-Persists-Core-Interaction-Data" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>클로드 코드에서</strong> 세션은 데이터의 핵심 단위입니다. 세션은 대화 자체, 도구 호출, 파일 변경 및 관련 컨텍스트를 포함하여 사용자와 AI 간의 전체 상호 작용을 캡처합니다. 세션이 저장되는 방식은 시스템의 안정성, 디버깅 가능성 및 전반적인 안전성에 직접적인 영향을 미칩니다.</p>
<h3 id="Keep-session-data-separate-for-each-project" class="common-anchor-header">각 프로젝트마다 세션 데이터를 별도로 보관</h3><p>세션이 정의되면 다음 질문은 데이터를 체계적이고 격리된 상태로 유지하는 방식으로 세션을 저장하는 방법입니다.</p>
<p><strong>클로드 코드는</strong> 프로젝트별로 세션 데이터를 분리합니다. 각 프로젝트의 세션은 프로젝트의 파일 경로에서 파생된 디렉토리에 저장됩니다.</p>
<p>저장 경로는 이 패턴을 따릅니다:</p>
<p><code translate="no">~/.claude/projects/ + path-encoded project directory</code></p>
<p>유효한 디렉토리 이름을 만들기 위해 <code translate="no">/</code>, 공백 및 <code translate="no">~</code> 과 같은 특수 문자는 <code translate="no">-</code> 로 대체됩니다.</p>
<p>예를 들어</p>
<p><code translate="no">/Users/bill/My Project → -Users-bill-My-Project</code></p>
<p>이 접근 방식을 사용하면 서로 다른 프로젝트의 세션 데이터가 섞이지 않고 프로젝트별로 관리하거나 제거할 수 있습니다.</p>
<h3 id="Why-sessions-are-stored-in-JSONL-format" class="common-anchor-header">세션이 JSONL 형식으로 저장되는 이유</h3><p><strong>클로드 코드는</strong> 표준 JSON 대신 JSONL(JSON 줄)을 사용하여 세션 데이터를 저장합니다.</p>
<p>기존 JSON 파일에서는 모든 메시지가 하나의 큰 구조 안에 함께 묶여 있으므로 메시지가 변경될 때마다 전체 파일을 읽고 다시 작성해야 합니다. 이와는 대조적으로 JSONL은 각 메시지를 파일에 개별 줄로 저장합니다. 한 줄은 외부 래퍼 없이 하나의 메시지와 동일합니다.</p>
<table>
<thead>
<tr><th>Aspect</th><th>표준 JSON</th><th>JSONL(JSON 줄)</th></tr>
</thead>
<tbody>
<tr><td>데이터 저장 방식</td><td>하나의 큰 구조</td><td>한 줄당 하나의 메시지</td></tr>
<tr><td>데이터가 저장되는 시기</td><td>보통 마지막에</td><td>즉시, 메시지당</td></tr>
<tr><td>충돌 영향</td><td>전체 파일이 깨질 수 있음</td><td>마지막 줄만 영향을 받음</td></tr>
<tr><td>새 데이터 쓰기</td><td>전체 파일 다시 쓰기</td><td>한 줄 추가</td></tr>
<tr><td>메모리 사용량</td><td>모든 항목 로드</td><td>한 줄씩 읽기</td></tr>
</tbody>
</table>
<p>JSONL은 몇 가지 주요 방식으로 더 잘 작동합니다:</p>
<ul>
<li><p><strong>즉각적인 저장:</strong> 각 메시지는 세션이 완료될 때까지 기다리지 않고 생성되는 즉시 디스크에 기록됩니다.</p></li>
<li><p><strong>충돌 방지:</strong> 프로그램이 충돌하는 경우 마지막 미완성 메시지만 손실될 수 있습니다. 그 전에 작성된 모든 내용은 그대로 유지됩니다.</p></li>
<li><p><strong>빠른 추가:</strong> 기존 데이터를 읽거나 다시 쓰지 않고 파일 끝에 새 메시지가 추가됩니다.</p></li>
<li><p><strong>메모리 사용량이 적습니다:</strong> 세션 파일은 한 번에 한 줄씩 읽을 수 있으므로 전체 파일을 메모리에 로드할 필요가 없습니다.</p></li>
</ul>
<p>단순화된 JSONL 세션 파일은 다음과 같습니다:</p>
<pre><code translate="no">{<span class="hljs-string">&quot;type&quot;</span>:<span class="hljs-string">&quot;user&quot;</span>,<span class="hljs-string">&quot;message&quot;</span>:{<span class="hljs-string">&quot;role&quot;</span>:<span class="hljs-string">&quot;user&quot;</span>,<span class="hljs-string">&quot;content&quot;</span>:<span class="hljs-string">&quot;Hello&quot;</span>},<span class="hljs-string">&quot;timestamp&quot;</span>:<span class="hljs-string">&quot;2026-01-05T10:00:00Z&quot;</span>}
{<span class="hljs-string">&quot;type&quot;</span>:<span class="hljs-string">&quot;assistant&quot;</span>,<span class="hljs-string">&quot;message&quot;</span>:{<span class="hljs-string">&quot;role&quot;</span>:<span class="hljs-string">&quot;assistant&quot;</span>,<span class="hljs-string">&quot;content&quot;</span>:[{<span class="hljs-string">&quot;type&quot;</span>:<span class="hljs-string">&quot;text&quot;</span>,<span class="hljs-string">&quot;text&quot;</span>:<span class="hljs-string">&quot;Hi!&quot;</span>}]}}
{<span class="hljs-string">&quot;type&quot;</span>:<span class="hljs-string">&quot;user&quot;</span>,<span class="hljs-string">&quot;message&quot;</span>:{<span class="hljs-string">&quot;role&quot;</span>:<span class="hljs-string">&quot;user&quot;</span>,<span class="hljs-string">&quot;content&quot;</span>:<span class="hljs-string">&quot;Help me fix this bug&quot;</span>}}
<button class="copy-code-btn"></button></code></pre>
<h3 id="Session-message-types" class="common-anchor-header">세션 메시지 유형</h3><p>세션 파일은 클로드 코드와 상호작용하는 동안 일어나는 모든 일을 기록합니다. 이를 명확히 하기 위해 다양한 종류의 이벤트에 대해 서로 다른 메시지 유형을 사용합니다.</p>
<ul>
<li><p><strong>사용자 메시지는</strong> 시스템에 들어오는 새로운 입력을 나타냅니다. 여기에는 사용자가 입력한 내용뿐만 아니라 셸 명령의 출력과 같이 도구에서 반환한 결과도 포함됩니다. AI의 관점에서 보면 두 가지 모두 응답해야 하는 입력입니다.</p></li>
<li><p><strong>어시스턴트 메시지는</strong> 클라우드가 이에 응답하여 수행하는 작업을 캡처합니다. 이러한 메시지에는 AI의 추론, 생성하는 텍스트, 사용하기로 결정한 모든 도구가 포함됩니다. 또한 토큰 수와 같은 사용 세부 정보도 기록하여 상호 작용에 대한 완전한 그림을 제공합니다.</p></li>
<li><p><strong>파일 히스토리 스냅샷은</strong> Claude가 파일을 수정하기 전에 생성되는 안전 체크포인트입니다. 원본 파일 상태를 먼저 저장함으로써 Claude Code는 문제가 발생했을 때 변경 사항을 되돌릴 수 있습니다.</p></li>
<li><p><strong>요약은</strong> 세션에 대한 간결한 개요를 제공하며 최종 결과와 연결됩니다. 요약은 모든 단계를 다시 재생하지 않고도 세션의 내용을 쉽게 이해할 수 있게 해줍니다.</p></li>
</ul>
<p>이러한 메시지 유형은 대화뿐만 아니라 세션 중에 발생하는 모든 작업 및 효과의 전체 순서를 함께 기록합니다.</p>
<p>이를 보다 구체적으로 이해하기 위해 사용자 메시지와 어시스턴트 메시지의 구체적인 예를 살펴보겠습니다.</p>
<p><strong>(1) 사용자 메시지 예시:</strong></p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>,
  <span class="hljs-string">&quot;uuid&quot;</span>: <span class="hljs-string">&quot;7d90e1c9-e727-4291-8eb9-0e7b844c4348&quot;</span>,
  <span class="hljs-string">&quot;parentUuid&quot;</span>: <span class="hljs-literal">null</span>,
  <span class="hljs-string">&quot;sessionId&quot;</span>: <span class="hljs-string">&quot;e5d52290-e2c1-41d6-8e97-371401502fdf&quot;</span>,
  <span class="hljs-string">&quot;timestamp&quot;</span>: <span class="hljs-string">&quot;2026-01-05T10:00:00.000Z&quot;</span>,
  <span class="hljs-string">&quot;message&quot;</span>: {
    <span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>,
    <span class="hljs-string">&quot;content&quot;</span>: <span class="hljs-string">&quot;Analyze the architecture of this project&quot;</span>
  },
  <span class="hljs-string">&quot;cwd&quot;</span>: <span class="hljs-string">&quot;/Users/xxx/project&quot;</span>,
  <span class="hljs-string">&quot;gitBranch&quot;</span>: <span class="hljs-string">&quot;main&quot;</span>,
  <span class="hljs-string">&quot;version&quot;</span>: <span class="hljs-string">&quot;2.0.76&quot;</span>
}
<button class="copy-code-btn"></button></code></pre>
<p><strong>(2) 어시스턴트 메시지 예시:</strong></p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;assistant&quot;</span>,
  <span class="hljs-string">&quot;uuid&quot;</span>: <span class="hljs-string">&quot;e684816e-f476-424d-92e3-1fe404f13212&quot;</span>,
  <span class="hljs-string">&quot;parentUuid&quot;</span>: <span class="hljs-string">&quot;7d90e1c9-e727-4291-8eb9-0e7b844c4348&quot;</span>,
  <span class="hljs-string">&quot;message&quot;</span>: {
    <span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;assistant&quot;</span>,
    <span class="hljs-string">&quot;model&quot;</span>: <span class="hljs-string">&quot;claude-opus-4-5-20251101&quot;</span>,
    <span class="hljs-string">&quot;content&quot;</span>: [
      {
        <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;thinking&quot;</span>,
        <span class="hljs-string">&quot;thinking&quot;</span>: <span class="hljs-string">&quot;The user wants to understand the project architecture, so I need to check the directory structure first...&quot;</span>
      },
      {
        <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;text&quot;</span>,
        <span class="hljs-string">&quot;text&quot;</span>: <span class="hljs-string">&quot;Let me take a look at the project structure first.&quot;</span>
      },
      {
        <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;tool_use&quot;</span>,
        <span class="hljs-string">&quot;id&quot;</span>: <span class="hljs-string">&quot;toolu_01ABC&quot;</span>,
        <span class="hljs-string">&quot;name&quot;</span>: <span class="hljs-string">&quot;Bash&quot;</span>,
        <span class="hljs-string">&quot;input&quot;</span>: {<span class="hljs-string">&quot;command&quot;</span>: <span class="hljs-string">&quot;ls -la&quot;</span>}
      }
    ],
    <span class="hljs-string">&quot;usage&quot;</span>: {
      <span class="hljs-string">&quot;input_tokens&quot;</span>: <span class="hljs-number">1500</span>,
      <span class="hljs-string">&quot;output_tokens&quot;</span>: <span class="hljs-number">200</span>,
      <span class="hljs-string">&quot;cache_read_input_tokens&quot;</span>: <span class="hljs-number">50000</span>
    }
  }
}
<button class="copy-code-btn"></button></code></pre>
<h3 id="How-Session-Messages-Are-Linked" class="common-anchor-header">세션 메시지가 연결되는 방식</h3><p>클로드 코드는 세션 메시지를 독립된 항목으로 저장하지 않습니다. 대신 메시지를 서로 연결하여 명확한 이벤트 체인을 형성합니다. 각 메시지에는 고유 식별자(<code translate="no">uuid</code>)와 그 앞에 온 메시지에 대한 참조(<code translate="no">parentUuid</code>)가 포함됩니다. 이를 통해 어떤 일이 일어났는지뿐만 아니라 왜 그런 일이 일어났는지도 확인할 수 있습니다.</p>
<p>세션은 사용자 메시지로 시작하여 체인을 시작합니다. 클로드의 각 응답은 그 원인이 된 메시지를 가리킵니다. 도구 호출과 그 출력도 같은 방식으로 추가되며, 모든 단계는 그 전 단계에 연결됩니다. 세션이 종료되면 최종 메시지에 요약이 첨부됩니다.</p>
<p>모든 단계가 연결되어 있기 때문에 Claude Code는 전체 작업 순서를 재생하고 결과가 어떻게 생성되었는지 이해할 수 있어 디버깅과 분석이 훨씬 쉬워집니다.</p>
<h2 id="Making-Code-Changes-Easy-to-Undo-with-File-Snapshots" class="common-anchor-header">파일 스냅샷으로 코드 변경 사항을 쉽게 되돌리기<button data-href="#Making-Code-Changes-Easy-to-Undo-with-File-Snapshots" class="anchor-icon" translate="no">
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
    </button></h2><p>AI가 생성한 편집 내용이 항상 정확한 것은 아니며, 때로는 완전히 잘못된 방향으로 변경되는 경우도 있습니다. 이러한 변경 사항을 안전하게 실험할 수 있도록 Claude Code에서는 변경 사항을 실행 취소할 수 있는 간단한 스냅샷 시스템을 사용하여 Diff를 파헤치거나 파일을 수동으로 정리할 필요 없이 편집 내용을 되돌릴 수 있습니다.</p>
<p><strong>Claude Code는 파일을 수정하기 전에 원본 콘텐츠의 사본을 저장합니다</strong>. 편집이 실수로 판명되면 시스템은 즉시 이전 버전으로 복원할 수 있습니다.</p>
<h3 id="What-is-a-file-history-snapshot" class="common-anchor-header"><em>파일 히스토리 스냅샷이란</em> 무엇인가요?</h3><p><em>파일 히스토리 스냅샷은</em> 파일을 수정하기 전에 생성되는 체크포인트입니다. <strong>Claude가</strong> 수정하려는 모든 파일의 원본 콘텐츠를 기록합니다. 이러한 스냅샷은 실행 취소 및 롤백 작업의 데이터 소스 역할을 합니다.</p>
<p>사용자가 파일을 변경할 수 있는 메시지를 보내면 <strong>Claude Code는</strong> 해당 메시지에 대한 빈 스냅샷을 만듭니다. 편집하기 전에 시스템은 각 대상 파일의 원본 콘텐츠를 스냅샷에 백업한 다음 편집 내용을 디스크에 직접 적용합니다. 사용자가 <em>실행 취소를</em> 트리거하면 <strong>클로드 코드는</strong> 저장된 콘텐츠를 복원하고 수정된 파일을 덮어씁니다.</p>
<p>실제로 실행 취소가 가능한 편집의 수명 주기는 다음과 같습니다:</p>
<ol>
<li><p><strong>사용자가 메시지를 보냄클라우드</strong>코드가 빈 <code translate="no">file-history-snapshot</code> 레코드를 새로 생성합니다.</p></li>
<li><p><strong>Claude가 파일 수정을 준비합니다시스템이</strong>편집할 파일을 식별하고 원본 콘텐츠를 <code translate="no">trackedFileBackups</code> 에 백업합니다.</p></li>
<li><p><strong>Claude가 편집을 실행합니다편집</strong>및 쓰기 작업이 수행되고 수정된 콘텐츠가 디스크에 기록됩니다.</p></li>
<li><p>사용자가<strong>und를 트리거합니다사용자가</strong> <strong>Esc + Esc를</strong> 눌러 변경 사항을 되돌리라는 신호를 보냅니다.</p></li>
<li><p><strong>원본 콘텐츠가 복원됩니다클라우드</strong>코드가 <code translate="no">trackedFileBackups</code> 에서 저장된 콘텐츠를 읽고 현재 파일을 덮어쓰면서 실행 취소가 완료됩니다.</p></li>
</ol>
<h3 id="Why-Undo-Works-Snapshots-Save-the-Old-Version" class="common-anchor-header">실행 취소가 작동하는 이유 스냅샷은 이전 버전을 저장합니다</h3><p>Claude Code에서 실행 취소가 작동하는 이유는 시스템이 편집하기 전에 <em>원본</em> 파일 콘텐츠를 저장하기 때문입니다.</p>
<p>사후에 변경 사항을 되돌리려고 하는 대신, Claude Code는 <em>수정하기 전에</em> 존재했던 파일을 복사하여 <code translate="no">trackedFileBackups</code> 에 저장하는 더 간단한 접근 방식을 취합니다. 사용자가 실행 취소를 트리거하면 시스템은 이 저장된 버전을 복원하고 편집한 파일을 덮어씁니다.</p>
<p>아래 다이어그램은 이 흐름을 단계별로 보여줍니다:</p>
<pre><code translate="no">┌─────────────────────────┐
│    before edit,  app.py │
│    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;old&quot;</span>)         │───────→  Backed up into snapshot trackedFileBackups
└─────────────────────────┘

↓

┌──────────────────────────┐
│   After Claude edits     │
│    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;new&quot;</span>)          │───────→  Written to disk (overwrites the original file)
└──────────────────────────┘

↓

┌──────────────────────────┐
│    User triggers undo    │
│    Press   Esc + Esc     │───────→ Restore <span class="hljs-string">&quot;old&quot;</span> content to disk <span class="hljs-keyword">from</span> snapshot
└──────────────────────────┘
<button class="copy-code-btn"></button></code></pre>
<h3 id="What-a-file-History-snapshot-Looks-Like-Internally" class="common-anchor-header"><em>파일-히스토리 스냅샷의</em> 내부 모습</h3><p>스냅샷 자체는 구조화된 레코드로 저장됩니다. 사용자 메시지, 스냅샷의 시간, 그리고 가장 중요한 것은 파일의 원본 콘텐츠에 대한 맵에 대한 메타데이터를 캡처합니다.</p>
<p>아래 예는 Claude가 파일을 편집하기 전에 만든 단일 <code translate="no">file-history-snapshot</code> 레코드를 보여줍니다. <code translate="no">trackedFileBackups</code> 의 각 항목은 파일의 <em>편집 전</em> 콘텐츠를 저장하며, 나중에 실행 취소 시 파일을 복원하는 데 사용됩니다.</p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;file-history-snapshot&quot;</span>,
  <span class="hljs-string">&quot;messageId&quot;</span>: <span class="hljs-string">&quot;7d90e1c9-e727-4291-8eb9-0e7b844c4348&quot;</span>,
  <span class="hljs-string">&quot;snapshot&quot;</span>: {
    <span class="hljs-string">&quot;messageId&quot;</span>: <span class="hljs-string">&quot;7d90e1c9-e727-4291-8eb9-0e7b844c4348&quot;</span>,
    <span class="hljs-string">&quot;trackedFileBackups&quot;</span>: {
      <span class="hljs-string">&quot;/path/to/file1.py&quot;</span>: <span class="hljs-string">&quot;Original file content\ndef hello():\n    print(&#x27;old&#x27;)&quot;</span>,
      <span class="hljs-string">&quot;/path/to/file2.js&quot;</span>: <span class="hljs-string">&quot;// Original content...&quot;</span>
    },
    <span class="hljs-string">&quot;timestamp&quot;</span>: <span class="hljs-string">&quot;2026-01-05T10:00:00.000Z&quot;</span>
  },
  <span class="hljs-string">&quot;isSnapshotUpdate&quot;</span>: <span class="hljs-literal">false</span>
}
<button class="copy-code-btn"></button></code></pre>
<h3 id="Where-Snapshots-Are-Stored-and-How-Long-They-Are-Kept" class="common-anchor-header">스냅샷이 저장되는 위치 및 보관 기간</h3><ul>
<li><p><strong>스냅샷 메타데이터가 저장되는 위치</strong>: 스냅샷 레코드는 특정 세션에 바인딩되어<code translate="no">~/.claude/projects/-path-to-project/{session-id}.jsonl</code> 아래에 JSONL 파일로 저장됩니다.</p></li>
<li><p><strong>원본 파일 콘텐츠가 백업되는 위치</strong>: 각 파일의 사전 편집 콘텐츠는 콘텐츠 해시별로<code translate="no">~/.claude/file-history/{content-hash}/</code> 에 별도로 저장됩니다.</p></li>
<li><p><strong>기본적으로 스냅샷이 보관되는 기간</strong>: 스냅샷 데이터는 글로벌 <code translate="no">cleanupPeriodDays</code> 설정에 따라 30일 동안 보존됩니다.</p></li>
<li><p><strong>보존 기간을 변경하는 방법</strong> 보존 일수는 <code translate="no">~/.claude/settings.json</code> 의 <code translate="no">cleanupPeriodDays</code> 필드에서 조정할 수 있습니다.</p></li>
</ul>
<h3 id="Related-Commands" class="common-anchor-header">관련 명령</h3><table>
<thead>
<tr><th>명령/작업</th><th>설명</th></tr>
</thead>
<tbody>
<tr><td>Esc + Esc</td><td>가장 최근의 파일 편집을 실행 취소합니다(가장 일반적으로 사용됨).</td></tr>
<tr><td>/되감기</td><td>이전에 지정한 체크포인트(스냅샷)로 되돌립니다.</td></tr>
<tr><td>/diff</td><td>현재 파일과 스냅샷 백업 간의 차이점 보기</td></tr>
</tbody>
</table>
<h2 id="Other-Important-Directories" class="common-anchor-header">기타 중요 디렉토리<button data-href="#Other-Important-Directories" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>(1) plugins/ - 플러그인 관리</strong></p>
<p><code translate="no">plugins/</code> 디렉터리에는 Claude Code에 추가 기능을 제공하는 애드온이 저장됩니다.</p>
<p>이 디렉터리에는 설치된 <em>플러그인</em>, 플러그인의 출처, 해당 플러그인이 제공하는 추가 기능이 저장됩니다. 또한 다운로드한 플러그인의 로컬 복사본을 유지하므로 다시 가져올 필요가 없습니다.</p>
<pre><code translate="no">~/.claude/plugins/
├── config.json
│   Global plugin configuration (e.g., <span class="hljs-built_in">enable</span>/disable rules)
├── installed_plugins.json
│   List of installed plugins (including version and status)
├── known_marketplaces.json
│   Plugin marketplace <span class="hljs-built_in">source</span> configuration (e.g., Anthropic official marketplace)
├── cache/
│   Plugin download cache (avoids repeated downloads)
└── marketplaces/
    Marketplace <span class="hljs-built_in">source</span> storage
    └── anthropic-agent-skills/
        Official plugin marketplace
        ├── .claude-plugin/
        │   └── marketplace.json
        │       Marketplace metadata
        └── skills/
            Skills provided by the marketplace
            ├── pdf/
            │   PDF-related skills
            ├── docx/
            │   Word document processing skills
            └── frontend-design/
                Frontend design skills
<button class="copy-code-btn"></button></code></pre>
<p><strong>(2) 스킬/ - 스킬이 저장되고 적용되는 위치</strong></p>
<p>Claude Code에서 스킬은 PDF 작업, 문서 편집, 코딩 워크플로 따라하기 등 특정 작업을 수행하는 데 도움이 되는 재사용 가능한 작은 기능입니다.</p>
<p>모든 스킬을 모든 곳에서 사용할 수 있는 것은 아닙니다. 일부는 전 세계에 적용되는 반면, 일부는 단일 프로젝트로 제한되거나 플러그인으로 제공됩니다. Claude Code는 각 스킬을 사용할 수 있는 위치를 제어하기 위해 스킬을 여러 위치에 저장합니다.</p>
<p>아래 계층 구조는 전 세계적으로 사용 가능한 스킬부터 프로젝트별 및 플러그인 제공 스킬까지 범위별로 스킬이 어떻게 계층화되어 있는지 보여줍니다.</p>
<table>
<thead>
<tr><th>레벨</th><th>저장 위치</th><th>설명</th></tr>
</thead>
<tbody>
<tr><td>사용자</td><td>~/.claude/skills/</td><td>전 세계에서 사용 가능하며 모든 프로젝트에서 액세스 가능</td></tr>
<tr><td>프로젝트</td><td>project/.claude/skills/</td><td>현재 프로젝트에서만 사용 가능, 프로젝트별 사용자 지정</td></tr>
<tr><td>플러그인</td><td>~/.claude/플러그인/마켓플레이스/*/skills/</td><td>플러그인과 함께 설치, 플러그인 활성화 상태에 따라 다름</td></tr>
</tbody>
</table>
<p><strong>(3) todos/ - 작업 목록 저장소</strong></p>
<p><code translate="no">todos/</code> 디렉터리에는 완료할 단계, 진행 중인 항목, 완료된 작업 등 대화 중 작업을 추적하기 위해 Claude가 생성하는 작업 목록이 저장됩니다.</p>
<p>작업 목록은<code translate="no">~/.claude/todos/{session-id}-*.json</code> 아래에 JSON 파일로 저장되며, 각 파일 이름에는 작업 목록을 특정 대화에 연결하는 세션 ID가 포함되어 있습니다.</p>
<p>이러한 파일의 내용은 <code translate="no">TodoWrite</code> 도구에서 가져오며 작업 설명, 현재 상태, 우선순위 및 관련 메타데이터와 같은 기본적인 작업 정보를 포함합니다.</p>
<p><strong>(4) local/ - 로컬 런타임 및 도구</strong></p>
<p><code translate="no">local/</code> 디렉터리에는 클로드 코드가 컴퓨터에서 실행하는 데 필요한 핵심 파일이 있습니다.</p>
<p>여기에는 <code translate="no">claude</code> 명령줄 실행 파일과 런타임 종속성이 포함된 <code translate="no">node_modules/</code> 디렉터리가 포함됩니다. 이러한 구성 요소를 로컬에 유지함으로써 Claude Code는 외부 서비스나 시스템 전체 설치에 의존하지 않고 독립적으로 실행할 수 있습니다.</p>
<p><strong>(5) 추가 지원 디렉터리</strong></p>
<ul>
<li><p><strong>shell-snapshots/:</strong> 셸 세션 상태 스냅샷(현재 디렉토리 및 환경 변수 등)을 저장하여 셸 작업 롤백을 가능하게 합니다.</p></li>
<li><p><strong>plans/:</strong> 계획 모드에서 생성된 실행 계획(예: 다단계 프로그래밍 작업의 단계별 분석)을 저장합니다.</p></li>
<li><p><strong>statsig/:</strong> 반복되는 요청을 줄이기 위해 기능 플래그 구성(예: 새 기능 활성화 여부)을 캐시합니다.</p></li>
<li><p><strong>telemetry/:</strong> 제품 최적화를 위해 익명의 텔레메트리 데이터(예: 기능 사용 빈도)를 저장합니다.</p></li>
<li><p><strong>debug/:</strong> 문제 해결을 돕기 위해 디버그 로그(오류 스택 및 실행 추적 포함)를 저장합니다.</p></li>
</ul>
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
    </button></h2><p>Claude Code가 모든 것을 로컬에 저장하고 관리하는 방법을 자세히 살펴본 결과, 이 도구는 기초가 탄탄하여 안정적으로 느껴집니다. 화려하지 않고 사려 깊은 엔지니어링이 돋보입니다. 각 프로젝트에는 고유한 공간이 있고, 모든 작업은 기록되며, 파일 편집 내용은 변경되기 전에 백업됩니다. 조용히 제 몫을 다하고 작업에만 집중할 수 있는 디자인이죠.</p>
<p>제가 가장 좋아하는 점은 신비로운 요소가 없다는 점입니다. Claude Code는 기본이 제대로 되어 있기 때문에 잘 작동합니다. 실제 파일을 다루는 에이전트를 구축해 본 적이 있다면 상태가 뒤섞이고, 충돌로 인해 진행 상황이 지워지고, 실행 취소가 추측으로 바뀌는 등 일이 얼마나 쉽게 무너지는지 잘 알 것입니다. Claude Code는 간단하고 일관되며 깨지기 어려운 스토리지 모델을 통해 이러한 모든 문제를 방지합니다.</p>
<p>특히 보안 환경에서 로컬 또는 온프레미스 AI 에이전트를 구축하는 팀의 경우, 이 접근 방식은 강력한 스토리지와 지속성이 일상적인 개발에서 AI 도구를 얼마나 안정적이고 실용적으로 만드는지 보여줍니다.</p>
<p>로컬 또는 온프레미스 AI 에이전트를 설계 중이고 스토리지 아키텍처, 세션 설계 또는 안전한 롤백에 대해 더 자세히 논의하고 싶다면 언제든지 <a href="https://milvusio.slack.com/join/shared_invite/zt-3nntzngkz-gYwhrdSE4~76k0VMyBfD1Q#/shared-invite/email">Slack 채널에</a> 참여하세요. 또한 <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">Milvus 오피스 아워를</a> 통해 20분간 일대일 상담을 예약하여 개인화된 안내를 받을 수도 있습니다.</p>
