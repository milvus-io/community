---
id: create-a-custom-anthropic-skill-for-milvus-to-quickly-spin-up-rag.md
title: 인트로픽 스킬이 에이전트 툴링을 바꾸는 방법과 밀버스가 RAG를 빠르게 스핀업하는 커스텀 스킬을 빌드하는 방법
author: Min Yin
date: 2026-01-23T00:00:00.000Z
cover: assets.zilliz.com/skills_cover_new_8caa774cc5.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Claude Code, Anthropic Skills, MCP, RAG, Milvus'
meta_title: |
  Create a Custom Anthropic Skill for Milvus to Quickly Spin Up RAG
desc: >-
  재사용 가능한 워크플로를 사용하여 자연어 명령어로 Milvus 지원 RAG 시스템을 구축하는 Claude Code에서 스킬이 무엇인지,
  사용자 지정 스킬을 만드는 방법을 알아보세요.
origin: >-
  https://milvus.io/blog/create-a-custom-anthropic-skill-for-milvus-to-quickly-spin-up-rag.md
---
<p>툴 사용은 상담원의 업무 수행에 있어 큰 부분을 차지합니다. 상담원은 올바른 도구를 선택하고, 언제 도구를 호출할지 결정하고, 입력 형식을 올바르게 지정해야 합니다. 서류상으로는 간단해 보이지만 실제 시스템을 구축하기 시작하면 수많은 에지 케이스와 실패 모드를 발견하게 됩니다.</p>
<p>많은 팀이 이를 정리하기 위해 MCP 스타일의 도구 정의를 사용하지만, MCP에는 대략적인 한계가 있습니다. 이 모델은 모든 도구를 한 번에 추론해야 하며, 결정을 안내하는 구조가 많지 않습니다. 게다가 모든 도구 정의는 컨텍스트 창에 있어야 합니다. 이 중 일부는 매우 큰 규모(GitHub MCP의 경우 약 26,000개의 토큰)로 에이전트가 실제 작업을 시작하기도 전에 컨텍스트를 먹어치웁니다.</p>
<p>이러한 상황을 개선하기 위해 앤트로픽은 <a href="https://github.com/anthropics/skills?tab=readme-ov-file"><strong>스킬을</strong></a> 도입했습니다. 스킬은 더 작고, 더 집중적이며, 필요에 따라 로드하기 쉽습니다. 모든 것을 컨텍스트에 덤핑하는 대신 도메인 로직, 워크플로 또는 스크립트를 필요할 때만 에이전트가 가져올 수 있는 작은 단위로 패키징합니다.</p>
<p>이 게시물에서는 인공 지능 스킬의 작동 방식을 살펴본 다음 자연어를 <a href="https://milvus.io/">Milvus 지원</a> 지식창고로 전환하는 간단한 스킬을 Claude Code로 구축하는 방법을 안내하여 추가 배선 없이 RAG를 빠르게 설정하는 방법을 살펴보겠습니다.</p>
<h2 id="What-Are-Anthropic-Skills" class="common-anchor-header">인공 지능 스킬이란 무엇인가요?<button data-href="#What-Are-Anthropic-Skills" class="anchor-icon" translate="no">
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
    </button></h2><p>인공 지능<a href="https://milvus.io/blog/is-mcp-already-outdated-the-real-reason-anthropic-shipped-skills-and-how-to-pair-them-with-milvus.md">스킬</a> (또는 상담원 스킬)은 상담원이 특정 작업을 처리하는 데 필요한 지침, 스크립트 및 참조 파일을 한데 묶은 폴더입니다. 작고 독립적인 기능 팩이라고 생각하면 됩니다. 스킬은 보고서를 생성하거나, 분석을 실행하거나, 특정 워크플로 또는 일련의 규칙을 따르는 방법을 정의할 수 있습니다.</p>
<p>핵심 아이디어는 스킬은 모듈식이며 필요에 따라 로드할 수 있다는 것입니다. 상담원은 컨텍스트 창에 방대한 도구 정의를 채우는 대신 필요한 스킬만 가져옵니다. 이렇게 하면 컨텍스트 사용량을 낮추는 동시에 모델에 어떤 도구가 있는지, 언제 호출해야 하는지, 각 단계를 어떻게 실행해야 하는지에 대한 명확한 지침을 제공할 수 있습니다.</p>
<p>이 형식은 의도적으로 단순하기 때문에 Claude Code, 커서, VS Code 확장 프로그램, GitHub 통합, 코덱스 스타일 설정 등 다양한 개발자 도구에서 이미 지원되거나 쉽게 적용할 수 있습니다.</p>
<p>스킬은 일관된 폴더 구조를 따릅니다:</p>
<pre><code translate="no">skill-name/

├── SKILL.md       <span class="hljs-comment"># Required: Skill instructions and metadata</span>

├── scripts/         <span class="hljs-comment"># Optional: helper scripts</span>

├── templates/       <span class="hljs-comment"># Optional: document templates</span>

└── resources/       <span class="hljs-comment"># Optional: reference materials</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>1.</strong> <code translate="no">SKILL.md</code> <strong>(핵심 파일)</strong></p>
<p>에이전트를 위한 실행 가이드로, 에이전트에게 작업을 정확히 어떻게 수행해야 하는지 알려주는 문서입니다. 스킬의 메타데이터(이름, 설명, 트리거 키워드 등), 실행 흐름 및 기본 설정이 정의되어 있습니다. 이 파일에는 다음과 같이 명확하게 설명해야 합니다:</p>
<ul>
<li><p><strong>스킬이 언제 실행되어야 하는지:</strong> 예를 들어 사용자 입력에 "Python으로 CSV 파일 처리"와 같은 문구가 포함되면 스킬을 트리거합니다.</p></li>
<li><p><strong>작업을 수행하는 방법:</strong> 사용자의 요청 해석 → <code translate="no">scripts/</code> 디렉터리에서 전처리 스크립트 호출 → 필요한 코드 생성 → <code translate="no">templates/</code> 의 템플릿을 사용하여 출력 형식 지정 등의 순서로 실행 단계를 배치합니다.</p></li>
<li><p><strong>규칙 및 제약 조건:</strong> 코딩 규칙, 출력 형식, 오류 처리 방법 등의 세부 사항을 지정합니다.</p></li>
</ul>
<p><strong>2.</strong> <code translate="no">scripts/</code> <strong>(실행 스크립트)</strong></p>
<p>이 디렉터리에는 Python, Shell 또는 Node.js와 같은 언어로 미리 작성된 스크립트가 포함되어 있습니다. 에이전트는 런타임에 동일한 코드를 반복적으로 생성하는 대신 이러한 스크립트를 직접 호출할 수 있습니다. 대표적인 예로는 <code translate="no">create_collection.py</code> 및 <code translate="no">check_env.py</code> 이 있습니다.</p>
<p><code translate="no">templates/</code> <strong>(문서 템플릿)</strong></p>
<p>상담원이 사용자 지정 콘텐츠를 생성하는 데 사용할 수 있는 재사용 가능한 템플릿 파일입니다. 일반적인 예로는 보고서 템플릿이나 구성 템플릿이 있습니다.</p>
<p><code translate="no">resources/</code> <strong>(참고 자료)</strong></p>
<p>API 문서, 기술 사양 또는 모범 사례 가이드 등 상담원이 실행 중에 참조할 수 있는 참조 문서입니다.</p>
<p><code translate="no">SKILL.md</code> 에서는 작업을 설명하고, <code translate="no">scripts/</code> 에서는 바로 사용할 수 있는 도구를 제공하며, <code translate="no">templates/</code> 에서는 표준 형식을 정의하고, <code translate="no">resources/</code> 에서는 배경 정보를 제공하는 등 전반적으로 이 구조는 새로운 팀원에게 업무를 인계하는 방식을 반영하고 있습니다. 이 모든 것이 준비되어 있으면 상담원은 추측을 최소화하면서 안정적으로 작업을 실행할 수 있습니다.</p>
<h2 id="Hands-on-Tutorial-Creating-a-Custom-Skill-for-a-Milvus-Powered-RAG-System" class="common-anchor-header">실습 튜토리얼: Milvus 기반 RAG 시스템을 위한 사용자 지정 스킬 만들기<button data-href="#Hands-on-Tutorial-Creating-a-Custom-Skill-for-a-Milvus-Powered-RAG-System" class="anchor-icon" translate="no">
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
    </button></h2><p>이 섹션에서는 일반 자연어 명령어에서 Milvus 컬렉션을 설정하고 전체 RAG 파이프라인을 조립할 수 있는 사용자 지정 스킬을 만드는 과정을 안내합니다. 수동 스키마 설계, 인덱스 구성, 상용구 코드 등 일반적인 설정 작업을 모두 건너뛰는 것이 목표입니다. 에이전트에게 원하는 것을 말하면 스킬이 밀버스 조각을 자동으로 처리합니다.</p>
<h3 id="Design-Overview" class="common-anchor-header">디자인 개요</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/design_overview_d4c886291b.PNG" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Prerequisites" class="common-anchor-header">전제 조건</h3><table>
<thead>
<tr><th>구성 요소</th><th>요구 사항</th></tr>
</thead>
<tbody>
<tr><td>CLI</td><td><code translate="no">claude-code</code></td></tr>
<tr><td>모델</td><td>GLM 4.7, OpenAI</td></tr>
<tr><td>컨테이너</td><td>Docker</td></tr>
<tr><td>Milvus</td><td>2.6.8</td></tr>
<tr><td>모델 구성 플랫폼</td><td>CC-Switch</td></tr>
<tr><td>패키지 관리자</td><td>npm</td></tr>
<tr><td>개발 언어</td><td>Python</td></tr>
</tbody>
</table>
<h3 id="Step-1-Environment-Setup" class="common-anchor-header">1단계: 환경 설정</h3><p><strong>설치</strong> <code translate="no">claude-code</code></p>
<pre><code translate="no">npm install -g <span class="hljs-meta">@anthropic</span>-ai/claude-code
<button class="copy-code-btn"></button></code></pre>
<p><strong>CC-Switch 설치</strong></p>
<p><strong>참고:</strong> CC-Switch는 로컬에서 AI 모델을 실행할 때 서로 다른 모델 API 간에 쉽게 전환할 수 있는 모델 전환 도구입니다.</p>
<p>프로젝트 저장소: <a href="https://github.com/farion1231/cc-switch">https://github.com/farion1231/cc-switch</a></p>
<p><strong>클로드 선택 및 API 키 추가</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/1_0cdfab2e54.PNG" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2_615ee13649.PNG" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>현재 상태 확인</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/3_f1c13da1fe.PNG" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Milvus-Standalone 배포 및 시작하기</strong></p>
<pre><code translate="no"><span class="hljs-comment"># Download docker-compose.yml</span>

wget https://github.com/milvus-io/milvus/releases/download/v2<span class="hljs-number">.6</span><span class="hljs-number">.8</span>/milvus-standalone-docker-compose.yml -O docker-compose.yml

  

<span class="hljs-comment"># Start Milvus (check port mapping: 19530:19530)</span>

docker-compose up -d

  

<span class="hljs-comment"># Verify that the services are running</span>

docker ps | grep milvus

<span class="hljs-comment"># You should see three containers: milvus-standalone, milvus-etcd, milvus-minio</span>
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/code1_9c6a1a7f93.PNG" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>OpenAI API 키 구성</strong></p>
<pre><code translate="no"><span class="hljs-comment"># Add this to ~/.bashrc or ~/.zshrc</span>

OPENAI_API_KEY=your_openai_api_key_here
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-2-Create-the-Custom-Skill-for-Milvus" class="common-anchor-header">2단계: Milvus용 커스텀 스킬 생성하기</h3><p><strong>디렉토리 구조 생성</strong></p>
<pre><code translate="no"><span class="hljs-built_in">cd</span> ~/.claude/skills/

<span class="hljs-built_in">mkdir</span> -p milvus-skills/example milvus-skills/scripts
<button class="copy-code-btn"></button></code></pre>
<p><strong>초기화</strong> <code translate="no">SKILL.md</code></p>
<p><strong>참고:</strong> SKILL.md는 에이전트의 실행 가이드 역할을 합니다. 여기에는 스킬이 수행하는 작업과 트리거 방법이 정의되어 있습니다.</p>
<pre><code translate="no"><span class="hljs-attr">name</span>: milvus-collection-builder

<span class="hljs-attr">description</span>: <span class="hljs-title class_">Create</span> <span class="hljs-title class_">Milvus</span> collections <span class="hljs-keyword">using</span> natural language, supporting both <span class="hljs-variable constant_">RAG</span> and text search scenarios
<button class="copy-code-btn"></button></code></pre>
<p><strong>핵심 스크립트 작성</strong></p>
<table>
<thead>
<tr><th>스크립트 유형</th><th>파일 이름</th><th>목적</th></tr>
</thead>
<tbody>
<tr><td>환경 확인</td><td><code translate="no">check_env.py</code></td><td>Python 버전, 필수 종속성 및 Milvus 연결을 확인합니다.</td></tr>
<tr><td>인텐트 파싱</td><td><code translate="no">intent_parser.py</code></td><td>"RAG 데이터베이스 구축"과 같은 요청을 다음과 같은 구조화된 인텐트로 변환합니다. <code translate="no">scene=rag</code></td></tr>
<tr><td>컬렉션 생성</td><td><code translate="no">milvus_builder.py</code></td><td>컬렉션 스키마 및 인덱스 구성을 생성하는 핵심 빌더</td></tr>
<tr><td>데이터 수집</td><td><code translate="no">insert_milvus_data.py</code></td><td>문서를 로드하고, 청크하고, 임베딩을 생성하고, Milvus에 데이터를 씁니다.</td></tr>
<tr><td>예제 1</td><td><code translate="no">basic_text_search.py</code></td><td>문서 검색 시스템을 만드는 방법을 보여줍니다.</td></tr>
<tr><td>예제 2</td><td><code translate="no">rag_knowledge_base.py</code></td><td>완전한 RAG 지식창고를 구축하는 방법을 보여드립니다.</td></tr>
</tbody>
</table>
<p>이 스크립트에서는 Milvus 중심 스킬을 실제 문서 검색 시스템과 지능형 Q&amp;A(RAG) 설정으로 전환하는 방법을 보여줍니다.</p>
<h3 id="Step-3-Enable-the-Skill-and-Run-a-Test" class="common-anchor-header">3단계: 스킬 활성화 및 테스트 실행하기</h3><p><strong>자연어로 요청 설명하기</strong></p>
<pre><code translate="no"><span class="hljs-string">&quot;I want to build an RAG system.&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/test1_64fd549573.PNG" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>RAG 시스템 생성</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/test2_80656d59b1.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>샘플 데이터 삽입</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/test3_392753eb73.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>쿼리 실행</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/test4_75e23c6a3a.png" alt="" class="doc-image" id="" />
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
    </button></h2><p>이 튜토리얼에서는 커스텀 스킬을 사용하여 Milvus 기반 RAG 시스템을 구축하는 과정을 살펴봤습니다. 목표는 단순히 Milvus를 호출하는 또 다른 방법을 보여주는 것이 아니라, 스킬을 사용하여 일반적으로 여러 단계의 구성이 많은 설정을 재사용하고 반복할 수 있는 설정으로 바꾸는 방법을 보여드리는 것이었습니다. 스키마를 수동으로 정의하거나 인덱스를 조정하거나 워크플로 코드를 이어 붙이는 대신 스킬이 대부분의 상용구를 처리하므로 사용자는 실제로 중요한 RAG 부분에 집중할 수 있습니다.</p>
<p>이것은 시작에 불과합니다. 전체 RAG 파이프라인에는 전처리, 청킹, 하이브리드 검색 설정, 재랭크, 평가 등 많은 부분이 움직입니다. 이러한 모든 요소는 별도의 스킬로 패키징하여 사용 사례에 따라 구성할 수 있습니다. 팀에 벡터 차원, 인덱스 매개변수, 프롬프트 템플릿 또는 검색 로직에 대한 내부 표준이 있는 경우, 스킬은 이러한 지식을 인코딩하고 반복할 수 있도록 하는 깔끔한 방법입니다.</p>
<p>신규 개발자에게는 진입 장벽을 낮춰주며, 무언가를 실행하기 전에 Milvus의 모든 세부 사항을 배울 필요가 없습니다. 숙련된 팀의 경우 반복적인 설정을 줄이고 여러 환경에서 프로젝트를 일관되게 유지하는 데 도움이 됩니다. 기술이 신중한 시스템 설계를 대체할 수는 없지만 불필요한 마찰을 많이 줄여줍니다.</p>
<p>전체 구현은 <a href="https://github.com/yinmin2020/open-milvus-skills">오픈 소스 리포지토리에서</a> 확인할 수 있으며, <a href="https://skillsmp.com/">스킬 마켓플레이스에서</a> 커뮤니티에서 구축한 더 많은 사례를 살펴볼 수 있습니다.</p>
<h2 id="Stay-tuned" class="common-anchor-header">계속 지켜봐 주세요!<button data-href="#Stay-tuned" class="anchor-icon" translate="no">
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
    </button></h2><p>또한 일반적인 RAG 패턴과 제작 모범 사례를 다루는 공식 Milvus 및 Zilliz Cloud 스킬을 도입하기 위해 노력 중입니다. 지원받고 싶은 아이디어나 특정 워크플로우가 있다면 <a href="https://milvusio.slack.com/join/shared_invite/zt-3nntzngkz-gYwhrdSE4~76k0VMyBfD1Q#/shared-invite/email">Slack 채널에</a> 참여하여 엔지니어와 채팅하세요. 또한 자체 설정에 대한 지침이 필요한 경우 언제든지 <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">Milvus 오피스 아워</a> 세션을 예약할 수 있습니다.</p>
