---
id: >-
  is-mcp-already-outdated-the-real-reason-anthropic-shipped-skills-and-how-to-pair-them-with-milvus.md
title: MCP는 이미 시대에 뒤떨어진 기술인가요? 인류가 배송 기술을 도입한 진짜 이유와 밀버스와 함께 사용하는 방법
author: Min Yin
date: 2025-11-19T00:00:00.000Z
cover: assets.zilliz.com/skill_mcp_cover_0b12d0d95d.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Claude, Skills, MCP, Milvus, AI workflow'
meta_title: 'Exploring Skills, MCP, and Milvus for Smarter AI Workflows'
desc: '스킬이 토큰 소비를 줄이기 위해 어떻게 작동하는지, 스킬과 MCP가 밀버스와 협력하여 AI 워크플로를 개선하는 방법을 알아보세요.'
origin: >-
  https://milvus.io/blog/is-mcp-already-outdated-the-real-reason-anthropic-shipped-skills-and-how-to-pair-them-with-milvus.md
---
<p>지난 몇 주 동안 X와 해커 뉴스에서 놀랍도록 열띤 논쟁이 벌어졌습니다: <em>MCP 서버가 정말 더 이상 필요한가?</em> 일부 개발자는 MCP가 과도하게 설계되어 있고 토큰을 많이 사용하며 에이전트가 도구를 사용하는 방식과 근본적으로 맞지 않는다고 주장합니다. 다른 개발자들은 MCP가 실제 기능을 언어 모델에 노출하는 신뢰할 수 있는 방법이라고 옹호하기도 합니다. 어떤 글을 읽느냐에 따라 MCP는 도구 사용의 미래가 될 수도 있고 도착하자마자 죽어 버릴 수도 있습니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/hackernews_c3236cca2c.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>좌절감은 충분히 이해할 수 있습니다. MCP는 외부 시스템에 대한 강력한 액세스를 제공하지만 모델에 긴 스키마, 장황한 설명, 방대한 도구 목록을 로드하도록 강요합니다. 이는 실제 비용을 추가합니다. 회의 내용을 다운로드한 후 나중에 다른 도구에 입력하면 모델이 동일한 텍스트를 여러 번 재처리하여 토큰 사용량을 부풀려서 별다른 이점 없이 토큰 사용량을 늘릴 수 있습니다. 대규모로 운영되는 팀에게 이는 불편함이 아니라 비용입니다.</p>
<p>하지만 MCP를 더 이상 쓸모없다고 선언하는 것은 시기상조입니다. MCP를 개발한 팀과 동일한 팀인 Anthropic은 조용히 새로운 기능인 <a href="https://claude.com/blog/skills"><strong>스킬을</strong></a> 도입했습니다. Skills는 도구를 <em>언제</em> <em>어떻게</em> 사용해야 하는지를 설명하는 경량 마크다운/YAML 정의입니다. 전체 스키마를 컨텍스트 창에 덤프하는 대신 모델은 먼저 압축된 메타데이터를 읽고 이를 계획에 사용합니다. 실제로 Skills는 토큰 오버헤드를 획기적으로 줄이고 개발자에게 도구 오케스트레이션에 대한 더 많은 제어권을 부여합니다.</p>
<p>그렇다면 Skills가 MCP를 대체한다는 뜻인가요? 그렇지는 않습니다. Skills는 계획을 간소화하지만, 파일 읽기, API 호출, 스토리지 시스템과의 상호 작용, 대규모의 빠른 의미 검색을 지원하는 오픈 소스 벡터 데이터베이스인 <a href="https://milvus.io/"><strong>Milvus와</strong></a> 같은 외부 인프라 연결 등 실제 기능은 여전히 MCP가 제공하므로 Skills에 실제 데이터 액세스가 필요할 때 중요한 백엔드가 될 수 있습니다.</p>
<p>이 게시물에서는 Skills의 장점과 MCP가 여전히 중요한 부분, 그리고 이 두 가지가 진화하는 Anthropic의 에이전트 아키텍처에 어떻게 적용되는지에 대해 자세히 설명합니다. 그런 다음 Milvus와 깔끔하게 통합되는 자체 스킬을 구축하는 방법을 살펴보겠습니다.</p>
<h2 id="What-Are-Anthropic-Agent-Skills-and-How-Do-They-Work" class="common-anchor-header">앤트로픽 에이전트 스킬이란 무엇이며 어떻게 작동하나요?<button data-href="#What-Are-Anthropic-Agent-Skills-and-How-Do-They-Work" class="anchor-icon" translate="no">
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
    </button></h2><p>기존 AI 에이전트의 오랜 고질적인 문제점은 대화가 길어질수록 명령어가 사라진다는 점입니다.</p>
<p>아무리 세심하게 만들어진 시스템 프롬프트가 있어도 대화가 진행되는 동안 모델의 행동이 점차 흐트러질 수 있습니다. 몇 번의 턴이 지나면 클로드는 원래의 지시를 잊어버리거나 집중력을 잃기 시작합니다.</p>
<p>문제는 시스템 프롬프트의 구조에 있습니다. 이 프롬프트는 대화 기록, 문서 및 기타 입력과 함께 모델의 컨텍스트 창에서 공간을 차지하기 위해 경쟁하는 일회성 정적 주입입니다. 컨텍스트 창이 가득 차면 시스템 프롬프트에 대한 모델의 주의력이 점점 희석되어 시간이 지남에 따라 일관성이 떨어지게 됩니다.</p>
<p>스킬은 이 문제를 해결하기 위해 고안되었습니다. 스킬은 지침, 스크립트 및 리소스가 포함된 폴더입니다. 스킬은 정적인 시스템 프롬프트에 의존하는 대신 전문 지식을 재사용 가능한 모듈식 영구적 지침 번들로 분류하여 작업에 필요할 때 Claude가 동적으로 검색하고 로드할 수 있도록 합니다.</p>
<p>Claude는 작업을 시작하면 먼저 사용 가능한 모든 스킬의 YAML 메타데이터(수십 개의 토큰)만 읽어서 가벼운 스캔을 수행합니다. 이 메타데이터는 클로드가 스킬이 현재 작업과 관련이 있는지 판단할 수 있는 충분한 정보를 제공합니다. 그렇다면 Claude는 전체 지침 세트(보통 5천 토큰 미만)로 확장하고, 필요한 경우에만 추가 리소스나 스크립트를 로드합니다.</p>
<p>이러한 점진적 공개를 통해 클로드는 단 30~50개의 토큰으로 스킬을 초기화할 수 있어 효율성이 크게 향상되고 불필요한 컨텍스트 오버헤드가 줄어듭니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/how_skills_works_a8563f346c.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="How-Skills-Compares-to-Prompts-Projects-MCP-and-Subagents" class="common-anchor-header">스킬을 프롬프트, 프로젝트, MCP 및 서브에이전트와 비교하는 방법<button data-href="#How-Skills-Compares-to-Prompts-Projects-MCP-and-Subagents" class="anchor-icon" translate="no">
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
    </button></h2><p>오늘날의 모델 툴링 환경은 복잡하게 느껴질 수 있습니다. 클로드의 에이전트 에코시스템만 보더라도 여러 가지 구성 요소가 있습니다: 스킬, 프롬프트, 프로젝트, 서브에이전트 및 MCP입니다.</p>
<p>이제 스킬이 무엇인지, 모듈식 인스트럭션 번들과 동적 로딩을 통해 스킬이 어떻게 작동하는지 이해했으니 스킬이 Claude 에코시스템의 다른 부분, 특히 MCP와 어떻게 연관되어 있는지 알아볼 필요가 있습니다. 다음은 요약된 내용입니다:</p>
<h3 id="1-Skills" class="common-anchor-header">1. Skills</h3><p>스킬은 인스트럭션, 스크립트 및 리소스가 포함된 폴더입니다. Claude는 먼저 메타데이터, 그다음 전체 지침, 마지막으로 필요한 파일 등 점진적 공개를 사용하여 동적으로 검색하고 로드합니다.</p>
<p><strong>최상의 대상:</strong></p>
<ul>
<li><p>조직 워크플로우(브랜드 가이드라인, 규정 준수 절차)</p></li>
<li><p>도메인 전문성(Excel 수식, 데이터 분석)</p></li>
<li><p>개인 취향(노트 필기 시스템, 코딩 패턴)</p></li>
<li><p>여러 대화에서 재사용해야 하는 전문적인 작업(OWASP 기반 코드 보안 검토)</p></li>
</ul>
<h3 id="2-Prompts" class="common-anchor-header">2. 프롬프트</h3><p>프롬프트는 대화 내에서 사용자가 Claude에게 제공하는 자연어 지침입니다. 프롬프트는 일시적이며 현재 대화에만 존재합니다.</p>
<p><strong>가장 적합한 경우</strong></p>
<ul>
<li><p>일회성 요청(기사 요약, 목록 서식 지정)</p></li>
<li><p>대화 세분화(어조 조정, 세부 사항 추가)</p></li>
<li><p>즉각적인 맥락 파악(특정 데이터 분석, 콘텐츠 해석)</p></li>
<li><p>임시 지침</p></li>
</ul>
<h3 id="3-Projects" class="common-anchor-header">3. 프로젝트</h3><p>프로젝트는 자체 채팅 기록과 지식창고가 있는 독립된 작업 공간입니다. 각 프로젝트는 200만 개의 컨텍스트 창을 제공합니다. 프로젝트 지식이 컨텍스트 한도에 가까워지면 Claude는 RAG 모드로 원활하게 전환되어 유효 용량을 최대 10배까지 확장할 수 있습니다.</p>
<p><strong>최적의 용도:</strong></p>
<ul>
<li><p>영구적인 컨텍스트(예: 제품 출시와 관련된 모든 대화)</p></li>
<li><p>워크스페이스 구성(다양한 이니셔티브를 위한 별도의 컨텍스트)</p></li>
<li><p>팀 협업(팀 및 엔터프라이즈 요금제에서)</p></li>
<li><p>사용자 지정 지침(프로젝트별 어조 또는 관점)</p></li>
</ul>
<h3 id="4-Subagents" class="common-anchor-header">4. 서브에이전트</h3><p>서브에이전트는 자체 컨텍스트 창, 사용자 지정 시스템 프롬프트 및 특정 도구 권한이 있는 전문 AI 어시스턴트입니다. 독립적으로 작업하고 결과를 메인 에이전트에게 반환할 수 있습니다.</p>
<p><strong>최적 대상:</strong></p>
<ul>
<li><p>작업 전문화(코드 검토, 테스트 생성, 보안 감사)</p></li>
<li><p>컨텍스트 관리(메인 대화에 집중 유지)</p></li>
<li><p>병렬 처리(여러 하위 에이전트가 서로 다른 측면에서 동시에 작업)</p></li>
<li><p>도구 제한(예: 읽기 전용 액세스)</p></li>
</ul>
<h3 id="5-MCP-Model-Context-Protocol" class="common-anchor-header">5. MCP(모델 컨텍스트 프로토콜)</h3><p>MCP(모델 컨텍스트 프로토콜)는 AI 모델을 외부 도구 및 데이터 소스에 연결하는 개방형 표준입니다.</p>
<p><strong>최상의 용도:</strong></p>
<ul>
<li><p>외부 데이터 액세스(Google 드라이브, Slack, GitHub, 데이터베이스)</p></li>
<li><p>비즈니스 도구 사용(CRM 시스템, 프로젝트 관리 플랫폼)</p></li>
<li><p>개발 환경 연결(로컬 파일, IDE, 버전 관리)</p></li>
<li><p>사용자 지정 시스템(독점 도구 및 데이터 소스)과의 통합</p></li>
</ul>
<p>위의 내용을 바탕으로 Skills와 MCP는 서로 다른 과제를 해결하고 서로를 보완하기 위해 협력한다는 것을 알 수 있습니다.</p>
<table>
<thead>
<tr><th><strong>차원</strong></th><th><strong>MCP</strong></th><th><strong>Skills</strong></th></tr>
</thead>
<tbody>
<tr><td><strong>핵심 가치</strong></td><td>외부 시스템(데이터베이스, API, SaaS 플랫폼)에 연결합니다.</td><td>동작 사양 정의(데이터 처리 및 표시 방법)</td></tr>
<tr><td><strong>질문에 대한 답변</strong></td><td>"클로드는 무엇에 액세스할 수 있나요?"</td><td>"클로드는 무엇을 해야 하나요?"</td></tr>
<tr><td><strong>구현</strong></td><td>클라이언트-서버 프로토콜 + JSON 스키마</td><td>마크다운 파일 + YAML 메타데이터</td></tr>
<tr><td><strong>컨텍스트 소비</strong></td><td>수만 개의 토큰(여러 서버 누적)</td><td>작업당 30~50개 토큰</td></tr>
<tr><td><strong>사용 사례</strong></td><td>대규모 데이터베이스 쿼리, GitHub API 호출</td><td>검색 전략 정의, 필터링 규칙 적용, 출력 형식 지정</td></tr>
</tbody>
</table>
<p>코드 검색을 예로 들어보겠습니다.</p>
<ul>
<li><p><strong>MCP(예: 클라우드 컨텍스트):</strong> Milvus 벡터 데이터베이스에 액세스할 수 있는 기능을 제공합니다.</p></li>
<li><p><strong>스킬:</strong> 가장 최근에 수정된 코드의 우선 순위를 정하고, 관련성별로 결과를 정렬하고, 데이터를 마크다운 테이블에 표시하는 등 워크플로우를 정의합니다.</p></li>
</ul>
<p>MCP는 기능을 제공하고 Skills는 프로세스를 정의합니다. 이 둘은 함께 상호 보완적인 쌍을 이룹니다.</p>
<h2 id="How-to-Build-Custom-Skills-with-Claude-Context-and-Milvus" class="common-anchor-header">Claude-Context 및 Milvus로 사용자 지정 스킬을 구축하는 방법<button data-href="#How-to-Build-Custom-Skills-with-Claude-Context-and-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://github.com/zilliztech/claude-context">Claude-Context는</a> Claude Code에 시맨틱 코드 검색 기능을 추가하여 전체 코드베이스를 Claude의 컨텍스트로 전환하는 MCP 플러그인입니다.</p>
<h3 id="Prerequisite" class="common-anchor-header">전제 조건</h3><p>시스템 요구 사항:</p>
<ul>
<li><p><strong>Node.js</strong>: 버전 &gt;= 20.0.0 및 24.0.0 미만</p></li>
<li><p><strong>OpenAI API 키</strong> (모델 임베딩용)</p></li>
<li><p><a href="https://zilliz.com.cn/"><strong>질리즈 클라우드</strong></a> <strong>API 키</strong> (관리형 밀버스 서비스)</p></li>
</ul>
<h3 id="Step-1-Configure-the-MCP-Service-claude-context" class="common-anchor-header">1단계: MCP 서비스 구성(클라우딩 컨텍스트)</h3><p>터미널에서 다음 명령을 실행합니다:</p>
<pre><code translate="no">claude mcp add claude-context \
  -e OPENAI_API_KEY=sk-your-openai-api-key \
  -e MILVUS_ADDRESS=https:<span class="hljs-comment">//xxxxxxxxx-cn-hangzhou.cloud.zilliz.com.cn \</span>
  -e MILVUS_TOKEN=your-zilliz-cloud-api-key \
  -e COLLECTION_NAME=medium_articles \
  -- npx <span class="hljs-meta">@zilliz</span>/claude-context-mcp<span class="hljs-meta">@latest</span>
<button class="copy-code-btn"></button></code></pre>
<p>구성을 확인합니다:</p>
<pre><code translate="no">claude mcp list
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Check_the_Configuration_5d2abd5ee8.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>MCP 설정이 완료되었습니다. 이제 Claude가 Milvus 벡터 데이터베이스에 액세스할 수 있습니다.</p>
<h3 id="Step-2-Create-the-Skill" class="common-anchor-header">2단계: 스킬 생성</h3><p>스킬 디렉토리를 만듭니다:</p>
<pre><code translate="no"><span class="hljs-built_in">mkdir</span> -p ~/.claude/skills/milvus-code-search
<span class="hljs-built_in">cd</span> ~/.claude/skills/milvus-code-search
<button class="copy-code-btn"></button></code></pre>
<p>SKILL.md 파일을 만듭니다:</p>
<pre><code translate="no">---
name: milvus-code-search
description: A semantic code search <span class="hljs-keyword">and</span> architecture analysis skill designed <span class="hljs-keyword">for</span> the Milvus codebase
---

<span class="hljs-meta">## Instructions</span>
When the user asks questions related to the Milvus codebase, I will:

<span class="hljs-number">1.</span> **Code Search** : Use semantic search to locate relevant code snippets across the Milvus repository  
<span class="hljs-number">2.</span> **Architecture Analysis** : Analyze Milvus’s module structure, component relationships, <span class="hljs-keyword">and</span> design patterns  
<span class="hljs-number">3.</span> **Feature Explanation** : Explain how specific features are implemented <span class="hljs-keyword">and</span> how the corresponding logic works  
<span class="hljs-number">4.</span> **Development Guidance** : Provide suggestions, best practices, <span class="hljs-keyword">and</span> improvement ideas <span class="hljs-keyword">for</span> modifying the code  

<span class="hljs-meta">## Target Repository</span>
- **Core Modules**:  
  - `<span class="hljs-keyword">internal</span>/` — Core <span class="hljs-keyword">internal</span> components  
  - `pkg/` — Public packages <span class="hljs-keyword">and</span> utilities  
  - `client/` — Go client implementation  
  - `cmd/` — Command-line tools  

<span class="hljs-meta">## Usage Examples</span>

<span class="hljs-meta">### Architecture Query</span>
User: How does Milvus’s query coordinator work?  
Assistant: *(searching <span class="hljs-keyword">for</span> `querycoordv2`)* Let me walk you through how the query coordinator operates <span class="hljs-keyword">in</span> Milvus…

<span class="hljs-meta">### Feature Implementation</span>
User: How does Milvus implement vector indexing?  
Assistant: *(searching <span class="hljs-keyword">for</span> `index` code)* The vector indexing logic <span class="hljs-keyword">in</span> Milvus <span class="hljs-keyword">is</span> mainly implemented <span class="hljs-keyword">in</span> the following modules…

<span class="hljs-meta">### Code Understanding</span>
User: What does <span class="hljs-keyword">this</span> function <span class="hljs-keyword">do</span>? *(points to a specific <span class="hljs-keyword">file</span>)*  
Assistant: *(analyzing the surrounding code)* Based <span class="hljs-keyword">on</span> the context of the Milvus codebase, <span class="hljs-keyword">this</span> function <span class="hljs-keyword">is</span> responsible <span class="hljs-keyword">for</span>…

<span class="hljs-meta">### Development Guidance</span>
User: How can I <span class="hljs-keyword">add</span> a <span class="hljs-keyword">new</span> vector distance metric to Milvus?  
Assistant: *(searching <span class="hljs-keyword">for</span> `distance` implementations)* Following the existing pattern, you can <span class="hljs-keyword">add</span> a <span class="hljs-keyword">new</span> distance method <span class="hljs-keyword">by</span>…

<span class="hljs-meta">## Best Practices</span>
<span class="hljs-number">1.</span> **Precise Search** : Use specific technical terms <span class="hljs-keyword">and</span> module names  
<span class="hljs-number">2.</span> **Contextual Understanding** : Interpret code within Milvus’s overall system architecture  
<span class="hljs-number">3.</span> **Actionable Advice** : Provide practical, implementation-ready suggestions  
<span class="hljs-number">4.</span> **Performance Awareness** : Consider Milvus’s requirements <span class="hljs-keyword">as</span> a high-performance vector database  

---

*A custom code-search Skill tailored <span class="hljs-keyword">for</span> the open-source Milvus vector database project.*

---
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-3-Restart-Claude-to-Apply-Skills" class="common-anchor-header">3단계: Claude를 재시작하여 스킬 적용하기</h3><p>다음 명령을 실행하여 Claude를 재시작합니다:</p>
<pre><code translate="no">claude
<button class="copy-code-btn"></button></code></pre>
<p><strong>참고:</strong> 구성이 완료되면 즉시 스킬을 사용하여 Milvus 코드베이스를 쿼리할 수 있습니다.</p>
<p>다음은 작동 방식의 예입니다.</p>
<p>쿼리: Milvus QueryCoord는 어떻게 작동하나요?</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/code_a95429ddb0.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/code2_d58a942777.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/code3_6c9f835c65.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
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
    </button></h2><p>핵심적으로 스킬은 전문 지식을 캡슐화하고 전달하는 메커니즘 역할을 합니다. 스킬을 사용하면 AI는 팀의 경험을 이어받아 코드 리뷰 체크리스트나 문서 표준 등 업계 모범 사례를 따를 수 있습니다. 이러한 암묵적 지식을 마크다운 파일을 통해 명시적으로 만들면 AI가 생성한 결과물의 품질이 크게 향상될 수 있습니다.</p>
<p>앞으로 스킬을 효과적으로 활용할 수 있는 능력은 팀과 개인이 AI를 활용하는 방식에서 핵심적인 차별화 요소가 될 수 있습니다.</p>
<p>조직에서 AI의 잠재력을 탐색하는 과정에서 Milvus는 대규모 벡터 데이터를 관리하고 검색하는 데 중요한 도구로 자리 잡았습니다. Milvus의 강력한 벡터 데이터베이스와 Skills와 같은 AI 도구를 함께 사용하면 워크플로우뿐만 아니라 데이터 기반 인사이트의 깊이와 속도도 향상시킬 수 있습니다.</p>
<p>궁금한 점이 있거나 기능에 대해 자세히 알아보고 싶으신가요?<a href="https://discord.com/invite/8uyFbECzPX"> Discord 채널에</a> 참여하여 저희 엔지니어 및 커뮤니티의 다른 AI 엔지니어와 채팅하세요. 또한<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus 오피스 아워를</a> 통해 20분간의 일대일 세션을 예약하여 인사이트, 안내 및 질문에 대한 답변을 얻을 수도 있습니다.</p>
