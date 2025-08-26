---
id: >-
  why-im-against-claude-codes-grep-only-retrieval-it-just-burns-too-many-tokens.md
title: 클레드 코드의 그렙 전용 검색을 반대하는 이유는 무엇인가요? 너무 많은 토큰을 소모합니다
author: Cheney Zhang
date: 2025-08-25T00:00:00.000Z
desc: >-
  벡터 기반 코드 검색으로 Claude Code 토큰 소비를 40% 절감하는 방법을 알아보세요. MCP 통합이 간편한 오픈 소스 솔루션. 지금
  바로 클라우데 컨텍스트를 사용해 보세요.
cover: >-
  assets.zilliz.com/why_im_against_claude_codes_grep_only_retrieval_it_just_burns_too_many_tokens_milvus_cover_2928b4b72d.png
tag: Engineering
recommend: false
tags: 'Milvus, vector database, vector search'
meta_keywords: 'Claude Code, vector search, AI IDE, code retrieval, token optimization'
meta_title: >
  Why I’m Against Claude Code’s Grep-Only Retrieval? It Just Burns Too Many
  Tokens
origin: >
  https://milvus.io/blog/why-im-against-claude-codes-grep-only-retrieval-it-just-burns-too-many-tokens.md
---
<p>AI 코딩 어시스턴트가 폭발적으로 증가하고 있습니다. 불과 2년 만에 Cursor, Claude Code, Gemini CLI, Qwen Code와 같은 도구는 수백만 개발자의 호기심에서 일상적인 동반자로 자리 잡았습니다. 하지만 이러한 급격한 성장의 이면에는 <strong>AI 코딩 어시스턴트가 실제로 코드베이스에서 컨텍스트를 검색하는 방법이라는</strong> 놀랍도록 간단한 문제를 놓고 치열한 논쟁이 벌어지고 있습니다 <strong>.</strong></p>
<p>현재로서는 두 가지 접근 방식이 있습니다:</p>
<ul>
<li><p><strong>벡터 검색 기반의 RAG</strong> (시맨틱 검색).</p></li>
<li><p><strong>grep을 사용한 키워드 검색</strong> (리터럴 문자열 일치).</p></li>
</ul>
<p>Claude Code와 Gemini는 후자를 선택했습니다. 실제로 Claude의 한 엔지니어는 Hacker News에서 Claude Code가 RAG를 전혀 사용하지 않는다고 공개적으로 인정했습니다. 대신, 의미론이나 구조 없이 원시 문자열 매칭만으로 리포지토리를 한 줄씩 검색("에이전트 검색"이라고 함)할 뿐입니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/1_2b03e89759.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>그 폭로는 커뮤니티를 분열시켰습니다:</p>
<ul>
<li><p><strong>지지자들은</strong> grep의 단순성을 옹호합니다. 빠르고 정확하며 가장 중요한 것은 예측이 가능하다는 것입니다. 이들은 프로그래밍에서는 정확성이 가장 중요하며, 오늘날의 임베딩은 여전히 신뢰하기에는 너무 모호하다고 주장합니다.</p></li>
<li><p><strong>비평가들은</strong> 그렙을 막다른 골목으로 보고 있습니다. 관련 없는 일치 항목에 빠지고 토큰을 소모하며 워크플로우를 지연시킨다는 것이죠. 시맨틱 이해 없이는 인공지능에게 눈을 가린 채 디버깅을 하라는 것과 같습니다.</p></li>
</ul>
<p>양쪽 모두 일리가 있습니다. 제가 직접 솔루션을 구축하고 테스트한 결과, 벡터 검색 기반의 RAG 접근 방식이 판도를 바꾼다고 말할 수 있습니다. <strong>검색 속도가 획기적으로 빨라지고 정확도가 높아질 뿐만 아니라 토큰 사용량도 40% 이상 감소합니다. (저의 접근 방식에 대한 자세한 내용은 Claude 컨텍스트 부분으로 건너뛰세요.)</strong></p>
<p>그렇다면 왜 grep은 그토록 제한적일까요? 그리고 실제로 벡터 검색이 어떻게 더 나은 결과를 제공할 수 있을까요? 자세히 살펴보겠습니다.</p>
<h2 id="What’s-Wrong-with-Claude-Code’s-Grep-Only-Code-Search" class="common-anchor-header">Claude Code의 그렙 전용 코드 검색의 문제점은 무엇인가요?<button data-href="#What’s-Wrong-with-Claude-Code’s-Grep-Only-Code-Search" class="anchor-icon" translate="no">
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
    </button></h2><p>저는 까다로운 문제를 디버깅하다가 이 문제에 직면했습니다. Claude Code가 제 리포지토리 전체에 걸쳐 그렙 쿼리를 실행하여 관련 없는 거대한 텍스트 덩어리를 저에게 다시 던져주었습니다. 1분 후에도 여전히 관련 파일을 찾지 못했습니다. 5분이 지나서야 겨우 10줄을 찾았지만 500줄의 노이즈에 묻혀버리고 말았습니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2_299eeeaea5.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>이건 에지 케이스가 아닙니다. Claude Code의 깃허브 이슈를 훑어보면 많은 개발자가 같은 벽에 부딪혀 좌절하고 있음을 알 수 있습니다:</p>
<ul>
<li><p>issue1:<a href="https://github.com/anthropics/claude-code/issues/1315"> https://github.com/anthropics/claude-code/issues/1315</a></p></li>
<li><p>issue2:<a href="https://github.com/anthropics/claude-code/issues/4556"> https://github.com/anthropics/claude-code/issues/4556</a></p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/3_938c7244da.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>커뮤니티의 불만은 세 가지 문제점으로 요약됩니다:</p>
<ol>
<li><p><strong>토큰 부풀리기.</strong> 모든 그렙 덤프는 관련 없는 엄청난 양의 코드를 LLM에 밀어 넣기 때문에 리포지토리 크기에 따라 비용이 끔찍하게 증가합니다.</p></li>
<li><p><strong>시간 세금.</strong> AI가 코드베이스에 대해 스무 가지 질문을 하는 동안 기다리느라 집중력과 흐름을 잃게 됩니다.</p></li>
<li><p><strong>제로 컨텍스트.</strong> Grep은 리터럴 문자열을 일치시킵니다. 의미나 관계에 대한 감각이 없으므로 사실상 맹목적인 검색을 하는 것과 같습니다.</p></li>
</ol>
<p>그렇기 때문에 이 논쟁이 중요한 이유는 그렙이 단순히 '구식'일 뿐만 아니라 AI 지원 프로그래밍을 적극적으로 방해하고 있기 때문입니다.</p>
<h2 id="Claude-Code-vs-Cursor-Why-the-Latter-Has-Better-Code-Context" class="common-anchor-header">클로드 코드와 커서: 후자가 더 나은 코드 컨텍스트를 갖는 이유<button data-href="#Claude-Code-vs-Cursor-Why-the-Latter-Has-Better-Code-Context" class="anchor-icon" translate="no">
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
    </button></h2><p>코드 컨텍스트에 관해서는 Cursor가 더 나은 작업을 수행했습니다. 처음부터 Cursor는 <strong>코드베이스 인덱싱에</strong> 의존해 왔습니다. 리포지토리를 의미 있는 청크로 나누고, 그 청크를 벡터에 포함시킨 다음, AI가 컨텍스트가 필요할 때마다 의미론적으로 검색하는 방식이죠. 이것은 교과서적인 검색 증강 생성(RAG)을 코드에 적용한 것으로, 그 결과는 더 긴밀한 컨텍스트, 더 적은 토큰 낭비, 더 빠른 검색이라는 말로 설명할 수 있습니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/4_a9f5beb01d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>이와는 대조적으로 Claude Code는 단순성을 두 배로 높였습니다. 인덱스도, 임베딩도 없이 그저 grep만 사용합니다. 즉, 모든 검색은 구조나 의미에 대한 이해 없이 리터럴 문자열 매칭으로 이루어집니다. 이론적으로는 빠르지만 실제로는 개발자가 실제로 필요한 하나의 바늘을 찾기 전에 관련 없는 일치 항목의 건초 더미를 샅샅이 뒤져야 하는 경우가 많습니다.</p>
<table>
<thead>
<tr><th></th><th><strong>클로드 코드</strong></th><th><strong>커서</strong></th></tr>
</thead>
<tbody>
<tr><td>검색 정확도</td><td>정확히 일치하는 항목만 표시하고 이름이 다른 항목은 놓치지 않습니다.</td><td>키워드가 정확히 일치하지 않더라도 의미적으로 관련된 코드를 찾아냅니다.</td></tr>
<tr><td>효율성</td><td>Grep은 방대한 양의 코드를 모델에 덤프하여 토큰 비용을 증가시킵니다.</td><td>더 작고 높은 신호 청크는 토큰 부하를 30~40%까지 줄여줍니다.</td></tr>
<tr><td>확장성</td><td>매번 리포지토리를 다시 그립하므로 프로젝트가 성장함에 따라 속도가 느려집니다.</td><td>한 번 인덱싱한 다음 최소한의 지연으로 대규모로 검색합니다.</td></tr>
<tr><td>철학</td><td>추가 인프라 없이 최소한의 인프라를 유지하세요.</td><td>모든 것을 색인하고 지능적으로 검색하세요.</td></tr>
</tbody>
</table>
<p>그렇다면 왜 클로드(또는 제미니, 클라인)는 커서의 뒤를 따르지 않았을까요? 그 이유는 부분적으로는 기술적, 부분적으로는 문화적 이유 때문입니다. <strong>벡터 검색은 청킹, 증분 업데이트, 대규모 인덱싱을 해결해야 하는 등 간단한 문제가 아닙니다.</strong> 하지만 더 중요한 것은 Claude Code가 서버도, 인덱스도 없이 깔끔한 CLI만 있는 미니멀리즘을 기반으로 구축되었다는 점입니다. 임베딩과 벡터 DB는 이러한 설계 철학에 맞지 않습니다.</p>
<p>이러한 단순함은 매력적이지만, 동시에 클로드 코드가 제공할 수 있는 기능의 한계를 제한하기도 합니다. 실제 인덱싱 인프라에 기꺼이 투자하는 Cursor의 의지가 오늘날 더 강력하게 느껴지는 이유입니다.</p>
<h2 id="Claude-Context-an-Open-Source-Project-for-Adding-Semantic-Code-Search-to-Claude-Code" class="common-anchor-header">클로드 컨텍스트: 클로드 코드에 시맨틱 코드 검색을 추가하기 위한 오픈 소스 프로젝트<button data-href="#Claude-Context-an-Open-Source-Project-for-Adding-Semantic-Code-Search-to-Claude-Code" class="anchor-icon" translate="no">
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
    </button></h2><p>Claude Code는 강력한 도구이지만 코드 컨텍스트가 빈약하다는 단점이 있습니다. Cursor는 코드베이스 인덱싱으로 이 문제를 해결했지만, Cursor는 비공개 소스이고 구독에 종속되어 있으며 개인이나 소규모 팀이 사용하기에는 가격이 비쌉니다.</p>
<p>이러한 격차가 바로 우리가 자체 오픈 소스 솔루션을 구축하기 시작한 이유입니다: 바로 <a href="https://github.com/zilliztech/claude-context"><strong>클로드 컨텍스트입니다</strong></a>.</p>
<p>Claude<a href="https://github.com/zilliztech/claude-context"><strong>Context는</strong></a> Claude Code(및 MCP를 사용하는 다른 모든 AI 코딩 에이전트)에 <strong>시맨틱 코드 검색</strong> 기능을 제공하는 오픈 소스 MCP 플러그인입니다. 이 플러그인은 grep으로 리포지토리를 무작위 추출하는 대신 벡터 데이터베이스를 임베딩 모델과 통합하여 전체 코드베이스에서 <em>심층적이고 타겟팅된 컨텍스트를</em> LLM에 제공합니다. 그 결과 검색이 더 빨라지고 토큰 낭비가 줄어들며 개발자 환경이 훨씬 개선됩니다.</p>
<p>구축 방법은 다음과 같습니다:</p>
<h3 id="Technologies-We-Use" class="common-anchor-header">사용된 기술</h3><p><strong>🔌 인터페이스 레이어: 범용 커넥터로서의 MCP</strong></p>
<p>저희는 이 기능이 Claude뿐만 아니라 모든 곳에서 작동하기를 원했습니다. MCP(모델 컨텍스트 프로토콜)는 LLM을 위한 USB 표준처럼 작동하여 외부 도구를 원활하게 연결할 수 있게 해줍니다. 클로드 컨텍스트를 MCP 서버로 패키징하면 클로드 코드뿐만 아니라 Gemini CLI, Qwen Code, Cline, 심지어 Cursor와도 작동합니다.</p>
<p><strong>🗄️ 벡터 데이터베이스: 질리즈 클라우드</strong></p>
<p>백본으로는 <a href="https://milvus.io/">Milvus에</a> 구축된 완전 관리형 서비스인 <a href="https://zilliz.com/cloud">Zilliz Cloud를</a> 선택했습니다. 이 서비스는 고성능, 클라우드 네이티브, 탄력적이며 코드베이스 색인과 같은 AI 워크로드를 위해 설계되었습니다. 즉, 지연 시간이 짧은 검색, 거의 무한에 가까운 확장성, 견고한 안정성을 제공합니다.</p>
<p><strong>🧩 임베딩 모델: 설계에 따른 유연성팀마다</strong>요구 사항이 다르기 때문에 Claude Context는 기본적으로 여러 임베딩 제공업체를 지원합니다:</p>
<ul>
<li><p>안정성과 폭넓은 채택을 위한<strong>OpenAI 임베딩</strong>.</p></li>
<li><p>코드에 특화된 성능을 위한<strong>Voyage 임베딩</strong>.</p></li>
<li><p>개인 정보 보호를 최우선으로 하는 로컬 배포를 위한<strong>Ollama</strong>.</p></li>
</ul>
<p>요구 사항이 발전함에 따라 추가 모델을 추가할 수 있습니다.</p>
<p><strong>💻 언어 선택: TypeScript</strong></p>
<p>Python과 TypeScript를 놓고 토론했습니다. 애플리케이션 수준의 호환성(VSCode 플러그인, 웹 툴링)뿐만 아니라 Claude Code와 Gemini CLI 자체가 TypeScript 기반이기 때문에 TypeScript가 승리했습니다. 따라서 통합이 원활하게 이루어지고 에코시스템의 일관성을 유지할 수 있습니다.</p>
<h3 id="System-Architecture" class="common-anchor-header">시스템 아키텍처</h3><p>Claude Context는 깔끔하고 계층화된 디자인을 따릅니다:</p>
<ul>
<li><p><strong>핵심 모듈은</strong> 코드 구문 분석, 청킹, 인덱싱, 검색, 동기화 등 무거운 작업을 처리합니다.</p></li>
<li><p><strong>사용자 인터페이스는</strong> 통합(CP 서버, VSCode 플러그인 또는 기타 어댑터)을 처리합니다.</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/5_0c70864d6f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>이러한 분리는 코어 엔진을 다양한 환경에서 재사용할 수 있도록 유지하면서 새로운 AI 코딩 어시스턴트가 등장함에 따라 통합을 빠르게 발전시킬 수 있도록 합니다.</p>
<h3 id="Core-Module-Implementation" class="common-anchor-header">핵심 모듈 구현</h3><p>핵심 모듈은 전체 시스템의 기초를 형성합니다. 벡터 데이터베이스, 임베딩 모델 및 기타 구성 요소를 컨텍스트 객체를 생성하는 컴포저블 모듈로 추상화하여 다양한 시나리오에 맞는 다양한 벡터 데이터베이스와 임베딩 모델을 구현할 수 있습니다.</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> { <span class="hljs-title class_">Context</span>, <span class="hljs-title class_">MilvusVectorDatabase</span>, <span class="hljs-title class_">OpenAIEmbedding</span> } <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;@zilliz/claude-context-core&#x27;</span>;
<span class="hljs-comment">// Initialize embedding provider</span>
<span class="hljs-keyword">const</span> embedding = <span class="hljs-keyword">new</span> <span class="hljs-title class_">OpenAIEmbedding</span>(...);
<span class="hljs-comment">// Initialize vector database</span>
<span class="hljs-keyword">const</span> vectorDatabase = <span class="hljs-keyword">new</span> <span class="hljs-title class_">MilvusVectorDatabase</span>(...);
<span class="hljs-comment">// Create context instance</span>
<span class="hljs-keyword">const</span> context = <span class="hljs-keyword">new</span> <span class="hljs-title class_">Context</span>({embedding, vectorDatabase});
<span class="hljs-comment">// Index your codebase with progress tracking</span>
<span class="hljs-keyword">const</span> stats = <span class="hljs-keyword">await</span> context.<span class="hljs-title function_">indexCodebase</span>(<span class="hljs-string">&#x27;./your-project&#x27;</span>);
<span class="hljs-comment">// Perform semantic search</span>
<span class="hljs-keyword">const</span> results = <span class="hljs-keyword">await</span> context.<span class="hljs-title function_">semanticSearch</span>(<span class="hljs-string">&#x27;./your-project&#x27;</span>, <span class="hljs-string">&#x27;vector database operations&#x27;</span>);
<button class="copy-code-btn"></button></code></pre>
<h2 id="Solving-Key-Technical-Challenges" class="common-anchor-header">주요 기술적 과제 해결<button data-href="#Solving-Key-Technical-Challenges" class="anchor-icon" translate="no">
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
    </button></h2><p>클로드 컨텍스트 구축은 단순히 임베딩과 벡터 DB를 연결하는 것만이 아니었습니다. 진정한 작업은 대규모 코드 인덱싱의 성패를 좌우하는 어려운 문제를 해결하는 것이었습니다. 다음은 세 가지 가장 큰 도전 과제에 접근한 방법입니다:</p>
<h3 id="Challenge-1-Intelligent-Code-Chunking" class="common-anchor-header">과제 1: 지능형 코드 청킹</h3><p>코드는 단순히 줄이나 문자로 분할할 수 없습니다. 그렇게 하면 지저분하고 불완전한 조각이 생기고 코드를 이해할 수 있게 해주는 논리가 사라집니다.</p>
<p>저희는 <strong>두 가지 상호 보완적인 전략으로</strong> 이 문제를 해결했습니다:</p>
<h4 id="AST-Based-Chunking-Primary-Strategy" class="common-anchor-header">AST 기반 청킹(기본 전략)</h4><p>트리 시터 파서를 사용하여 코드 구문 구조를 이해하고 함수, 클래스, 메서드 등 의미적 경계를 따라 분할하는 기본 접근 방식입니다. 이 방법은 다음과 같은 이점을 제공합니다:</p>
<ul>
<li><p>구문<strong>완전성</strong> - 잘게 잘린 함수나 깨진 선언이 없습니다.</p></li>
<li><p><strong>논리적 일관성</strong> - 관련 논리가 함께 유지되어 의미 검색이 향상됩니다.</p></li>
<li><p><strong>다국어 지원</strong> - 트리 시터 문법을 통해 JS, Python, Java, Go 등에서 작동합니다.</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/6_e976593d7e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h4 id="LangChain-Text-Splitting-Fallback-Strategy" class="common-anchor-header">LangChain 텍스트 분할(폴백 전략)</h4><p>AST가 구문 분석할 수 없거나 구문 분석에 실패한 언어의 경우, LangChain의 <code translate="no">RecursiveCharacterTextSplitter</code> 에서 안정적인 백업을 제공합니다.</p>
<pre><code translate="no"><span class="hljs-comment">// Use recursive character splitting to maintain code structure</span>
<span class="hljs-keyword">const</span> splitter = <span class="hljs-title class_">RecursiveCharacterTextSplitter</span>.<span class="hljs-title function_">fromLanguage</span>(language, { 
  <span class="hljs-attr">chunkSize</span>: <span class="hljs-number">1000</span>, 
  <span class="hljs-attr">chunkOverlap</span>: <span class="hljs-number">200</span>,
});
<button class="copy-code-btn"></button></code></pre>
<p>AST보다는 덜 "지능적"이지만, 안정성이 높아 개발자가 좌초되지 않도록 보장합니다. 이 두 가지 전략은 의미론적 풍부함과 보편적 적용성의 균형을 맞추고 있습니다.</p>
<h3 id="Challenge-2-Handling-Code-Changes-Efficiently" class="common-anchor-header">과제 2: 효율적인 코드 변경 처리</h3><p>코드 변경 사항 관리는 코드 색인 시스템에서 가장 큰 과제 중 하나입니다. 사소한 파일 수정에 대해 전체 프로젝트를 다시 색인하는 것은 완전히 비현실적입니다.</p>
<p>이 문제를 해결하기 위해 머클 트리 기반 동기화 메커니즘을 구축했습니다.</p>
<h4 id="Merkle-Trees-The-Foundation-of-Change-Detection" class="common-anchor-header">머클 트리: 변경 사항 감지의 기초</h4><p>머클 트리는 각 파일마다 고유한 해시 지문이 있고, 폴더에는 콘텐츠에 따라 지문이 있으며, 전체 코드베이스에 대한 고유한 루트 노드 지문으로 모든 것이 정점을 이루는 계층적 '지문' 시스템을 생성합니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/7_79adb21c84.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>파일 콘텐츠가 변경되면 해시 지문이 각 계층을 거쳐 루트 노드까지 올라가게 됩니다. 이렇게 하면 루트에서 아래쪽으로 해시 지문을 계층별로 비교하여 전체 프로젝트 재색인 없이도 파일 수정 사항을 빠르게 식별하고 로컬라이즈함으로써 신속한 변경 탐지가 가능합니다.</p>
<p>이 시스템은 간소화된 3단계 프로세스를 통해 5분마다 핸드셰이크 동기화 검사를 수행합니다:</p>
<p><strong>1단계: 초고속 감지:</strong> 전체 코드베이스의 Merkle 루트 해시를 계산하고 이를 이전 스냅샷과 비교합니다. 루트 해시가 동일하다는 것은 변경 사항이 없다는 의미이며, 시스템은 밀리초 단위로 모든 처리를 건너뜁니다.</p>
<p><strong>2단계: 정밀 비교는</strong> 루트 해시가 다를 때 트리거되어 자세한 파일 수준 분석을 수행하여 어떤 파일이 추가, 삭제 또는 수정되었는지 정확히 식별합니다.</p>
<p><strong>3단계: 증분 업데이트는</strong> 변경된 파일에 대해서만 벡터를 다시 계산하고 그에 따라 벡터 데이터베이스를 업데이트하여 효율성을 극대화합니다.</p>
<h4 id="Local-Snapshot-Management" class="common-anchor-header">로컬 스냅샷 관리</h4><p>모든 동기화 상태는 사용자의 <code translate="no">~/.context/merkle/</code> 디렉토리에 로컬로 유지됩니다. 각 코드베이스는 파일 해시 테이블과 직렬화된 머클 트리 데이터가 포함된 독립적인 스냅샷 파일을 유지하므로 프로그램이 다시 시작된 후에도 정확한 상태 복구를 보장합니다.</p>
<p>이 설계는 변경 사항이 없는 경우 대부분의 검사가 밀리초 내에 완료되고, 진정으로 수정된 파일만 재처리를 트리거하며(대규모 계산 낭비를 방지), 상태 복구가 프로그램 세션 전반에서 완벽하게 작동한다는 분명한 이점을 제공합니다.</p>
<p>사용자 경험 관점에서 보면, 단일 함수를 수정하면 전체 프로젝트가 아닌 해당 파일에 대해서만 재색인이 트리거되므로 개발 효율성이 크게 향상됩니다.</p>
<h3 id="Challenge-3-Designing-the-MCP-Interface" class="common-anchor-header">과제 3: MCP 인터페이스 설계</h3><p>아무리 똑똑한 색인 엔진이라도 개발자를 위한 깔끔한 인터페이스가 없으면 무용지물입니다. MCP는 당연한 선택이었지만 고유한 과제를 안겨주었습니다:</p>
<h4 id="🔹-Tool-Design-Keep-It-Simple" class="common-anchor-header"><strong>🔹 도구 설계: 단순함 유지</strong></h4><p>MCP 모듈은 사용자 대면 인터페이스 역할을 하므로 사용자 경험을 최우선으로 고려해야 합니다.</p>
<p>도구 설계는 표준 코드베이스 색인 및 검색 작업을 두 가지 핵심 도구(코드베이스 색인용 <code translate="no">index_codebase</code> 및 코드 검색용 <code translate="no">search_code</code> )로 추상화하는 것으로 시작됩니다.</p>
<p>그러면 어떤 추가 도구가 필요한가라는 중요한 질문이 제기됩니다.</p>
<p>도구 수가 너무 많으면 인지적 오버헤드가 발생하고 LLM 도구 선택에 혼란을 줄 수 있으며, 너무 적으면 필수 기능을 놓칠 수 있기 때문에 신중한 균형이 필요합니다.</p>
<p>실제 사용 사례에서 거꾸로 작업하면 이 질문에 답하는 데 도움이 됩니다.</p>
<h4 id="Addressing-Background-Processing-Challenges" class="common-anchor-header">백그라운드 처리 문제 해결</h4><p>대규모 코드베이스는 색인하는 데 상당한 시간이 걸릴 수 있습니다. 완료될 때까지 동기적으로 기다리는 순진한 접근 방식은 사용자가 몇 분을 기다리게 하는데, 이는 용납할 수 없는 일입니다. 비동기 백그라운드 처리가 필수적이지만, MCP는 기본적으로 이 패턴을 지원하지 않습니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/8_e1f0aa290f.png" alt="8.png" class="doc-image" id="8.png" />
   </span> <span class="img-wrapper"> <span>8.png</span> </span></p>
<p>저희 MCP 서버는 MCP 서버 내에서 백그라운드 프로세스를 실행하여 인덱싱을 처리하는 동시에 사용자에게 시작 메시지를 즉시 반환하여 사용자가 작업을 계속할 수 있도록 합니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/9_1cb37d15f3.png" alt="9.png" class="doc-image" id="9.png" />
   </span> <span class="img-wrapper"> <span>9.png</span> </span></p>
<p>이로 인해 새로운 과제가 생깁니다. 사용자가 색인 진행 상황을 어떻게 추적할 수 있을까요?</p>
<p>인덱싱 진행 상황이나 상태를 쿼리하는 전용 도구가 이 문제를 깔끔하게 해결해 줍니다. 백그라운드 인덱싱 프로세스는 진행률 정보를 비동기적으로 캐시하여 사용자가 언제든지 완료 비율, 성공 상태 또는 실패 상태를 확인할 수 있습니다. 또한 수동 인덱스 삭제 도구는 사용자가 부정확한 인덱스를 재설정하거나 인덱싱 프로세스를 다시 시작해야 하는 상황을 처리합니다.</p>
<p><strong>최종 도구 설계:</strong></p>
<p><code translate="no">index_codebase</code> - 색인 코드베이스<code translate="no">search_code</code> - 검색 코드<code translate="no">get_indexing_status</code> - 색인 상태 쿼리<code translate="no">clear_index</code> - 색인 지우기</p>
<p>단순성과 기능성 사이에서 완벽한 균형을 이루는 네 가지 도구.</p>
<h4 id="🔹-Environment-Variable-Management" class="common-anchor-header">🔹 환경 변수 관리</h4><p>환경 변수 관리는 사용자 경험에 큰 영향을 미침에도 불구하고 간과되는 경우가 많습니다. 모든 MCP 클라이언트에 대해 별도의 API 키 구성을 요구하면 사용자가 Claude Code와 Gemini CLI 간에 전환할 때 자격 증명을 여러 번 구성해야 합니다.</p>
<p>글로벌 구성 접근 방식은 사용자의 홈 디렉터리에 <code translate="no">~/.context/.env</code> 파일을 생성하여 이러한 번거로움을 없애줍니다:</p>
<pre><code translate="no"><span class="hljs-comment"># ~/.context/.env</span>
OPENAI_API_KEY=your-api-key-here
MILVUS_TOKEN=your-milvus-token
<button class="copy-code-btn"></button></code></pre>
<p><strong>이 접근 방식은</strong> 사용자가 한 번만 구성하면 모든 MCP 클라이언트에서 어디서나 사용할 수 있고, 모든 구성이 단일 위치에서 중앙 집중화되어 유지 관리가 쉬우며, 중요한 API 키가 여러 구성 파일에 흩어지지 않는다는<strong>명확한 이점을 제공합니다</strong>.</p>
<p>또한 3단계 우선순위 계층 구조를 구현하여 프로세스 환경 변수가 가장 우선순위가 높고, 전역 구성 파일이 중간 우선순위를 가지며, 기본값이 폴백으로 사용됩니다.</p>
<p>개발자는 임시 테스트 오버라이드를 위해 환경 변수를 사용할 수 있고, 프로덕션 환경에서는 보안 강화를 위해 시스템 환경 변수를 통해 민감한 구성을 주입할 수 있으며, 사용자는 한 번의 구성으로 Claude Code, Gemini CLI 및 기타 도구에서 원활하게 작업할 수 있는 등 뛰어난 유연성을 제공하는 설계입니다.</p>
<p>이 시점에서 MCP 서버의 핵심 아키텍처는 지능형 검색 및 구성 관리를 통해 코드 파싱과 벡터 스토리지에 이르기까지 완성되었습니다. 모든 구성 요소는 강력하면서도 사용자 친화적인 시스템을 만들기 위해 세심하게 설계되고 최적화되었습니다.</p>
<h2 id="Hands-on-Testing" class="common-anchor-header">실습 테스트<button data-href="#Hands-on-Testing" class="anchor-icon" translate="no">
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
    </button></h2><p>그렇다면 Claude Context는 실제로 어떤 성능을 발휘할까요? 처음에 좌절감을 안겨주었던 버그 찾기 시나리오와 똑같은 상황에서 테스트해 보았습니다.</p>
<p>Claude Code를 실행하기 전에 명령 한 번으로 설치가 완료되었습니다:</p>
<pre><code translate="no">claude mcp add claude-context -e OPENAI_API_KEY=your-openai-api-key -e MILVUS_TOKEN=your-zilliz-cloud-api-key -- npx <span class="hljs-meta">@zilliz</span>/claude-context-mcp<span class="hljs-meta">@latest</span>
<button class="copy-code-btn"></button></code></pre>
<p>코드베이스가 색인된 후, 이전에 <strong>5분 동안 그립을 사용하여 거위 추격전을</strong> 벌였던 것과 동일한 버그 설명을 Claude Code에 제공했습니다. 이번에는 <code translate="no">claude-context</code> MCP 호출을 통해 <strong>즉시 정확한 파일과 줄 번호를 찾아내어</strong> 문제에 대한 설명과 함께 알려주었습니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/claude_context_gif_e04d07cd00.gif" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>미묘한 차이가 아니라 밤낮으로 차이가 났습니다.</p>
<p>그리고 단순한 버그 사냥이 아니었습니다. 클로드 컨텍스트가 통합되면서 클로드 코드는 전반적으로 더 높은 품질의 결과를 일관되게 생성했습니다:</p>
<ul>
<li><p><strong>문제 해결</strong></p></li>
<li><p><strong>코드 리팩토링</strong></p></li>
<li><p><strong>중복 코드 감지</strong></p></li>
<li><p><strong>포괄적인 테스트</strong></p></li>
</ul>
<p>성능 향상은 수치로도 나타납니다. 나란히 테스트한 결과:</p>
<ul>
<li><p>리콜 손실 없이 토큰 사용량이 40% 이상 감소했습니다.</p></li>
<li><p>이는 곧 API 비용 절감과 빠른 응답으로 직결됩니다.</p></li>
<li><p>또는 동일한 예산으로 Claude Context가 훨씬 더 정확한 검색 결과를 제공했습니다.</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/11_2659dd3429.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Claude Context는 GitHub에서 오픈 소스화되어 있으며 이미 260,000개 이상의 별을 받았습니다. 여러분의 성원과 좋아요에 감사드립니다.</p>
<p>직접 사용해 보세요:</p>
<ul>
<li><p>GitHub:<a href="https://github.com/zilliztech/claude-context"> github.com/zilliztech/claude-context</a></p></li>
<li><p>npm:<a href="https://www.npmjs.com/package/@zilliz/claude-context-mcp"> @zilliz/claude-context-mcp</a></p></li>
</ul>
<p>자세한 벤치마크와 테스트 방법론은 저장소에서 확인할 수 있으며, 여러분의 피드백을 기다립니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/12_88bf595b15.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Looking-Forward" class="common-anchor-header">앞으로의 계획<button data-href="#Looking-Forward" class="anchor-icon" translate="no">
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
    </button></h2><p>Claude Code의 grep에 대한 불만에서 시작된 것이 이제는 견고한 솔루션으로 성장했습니다: Claude Code 및 기타 코딩 보조 도구에 시맨틱, 벡터 기반 검색 기능을 제공하는 오픈 소스 MCP 플러그인인 Claude <a href="https://github.com/zilliztech/claude-context"><strong>Context입니다</strong></a>. 메시지는 간단합니다. 개발자는 비효율적인 AI 도구에 안주할 필요가 없습니다. RAG 및 벡터 검색을 사용하면 디버깅 속도를 높이고 토큰 비용을 40%까지 절감할 수 있으며, 코드베이스를 진정으로 이해하는 AI 지원을 받을 수 있습니다.</p>
<p>이는 Claude Code에만 국한되지 않습니다. 클로드 컨텍스트는 개방형 표준을 기반으로 구축되었기 때문에 동일한 접근 방식이 Gemini CLI, Qwen Code, Cursor, Cline 등에서도 원활하게 작동합니다. 더 이상 성능보다 단순성을 우선시하는 공급업체의 트레이드오프에 얽매이지 않아도 됩니다.</p>
<p>여러분도 그 미래의 일부가 되기를 바랍니다:</p>
<ul>
<li><p><a href="https://github.com/zilliztech/claude-context"><strong>클레드 컨텍스트</strong></a><strong>체험하기</strong><strong>:</strong> 오픈 소스이며 완전 무료입니다.</p></li>
<li><p><strong>개발에 기여하기</strong></p></li>
<li><p><strong>또는</strong> 클로드 컨텍스트를 사용하여 나만의<strong>솔루션을 구축하세요</strong>.</p></li>
</ul>
<p><a href="https://discord.com/invite/8uyFbECzPX"><strong>Discord 커뮤니티에</strong></a> 가입하여 피드백을 공유하고, 질문하거나, 도움을 받으세요.</p>
