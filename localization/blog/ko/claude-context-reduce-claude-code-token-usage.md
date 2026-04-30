---
id: claude-context-reduce-claude-code-token-usage.md
title: '클로드 컨텍스트: Milvus 기반 코드 검색으로 클로드 코드 토큰 사용량 줄이기'
author: Cheney Zhang
date: 2026-4-30
cover: assets.zilliz.com/image_3b2d2999ac.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Claude Context, Claude Code token usage, code retrieval, MCP server, Milvus'
meta_title: |
  Claude Context: Cut Claude Code Token Usage with Milvus
desc: >-
  클루드 코드가 grep에서 토큰을 소각하고 있나요? 클로드 컨텍스트가 Milvus 지원 하이브리드 검색을 사용하여 토큰 사용량을 39.4%
  절감한 방법을 알아보세요.
origin: 'https://milvus.io/blog/claude-context-reduce-claude-code-token-usage.md'
---
<p>컨텍스트 창이 크면 AI 코딩 에이전트가 하나의 질문에 답하기 위해 리포지토리의 절반을 읽기 시작할 때까지는 한계가 없다고 느낄 수 있습니다. 많은 Claude Code 사용자에게 비용이 많이 드는 부분은 단순한 모델 추론이 아닙니다. 키워드를 검색하고, 파일을 읽고, 다시 검색하고, 더 많은 파일을 읽고, 관련 없는 컨텍스트에 대한 비용을 계속 지불하는 검색 루프가 바로 그것입니다.</p>
<p>Claude Context는 Claude Code 및 기타 AI 코딩 에이전트가 관련 코드를 더 잘 찾을 수 있는 방법을 제공하는 오픈 소스 코드 검색 MCP 서버입니다. 이 서버는 리포지토리를 색인하고, 검색 가능한 코드 청크를 <a href="https://zilliz.com/learn/what-is-vector-database">벡터 데이터베이스에</a> 저장하며, <a href="https://zilliz.com/blog/hybrid-search-with-milvus">하이브리드 검색을</a> 사용하여 에이전트가 프롬프트에 grep 결과를 가득 채우는 대신 실제로 필요한 코드를 가져올 수 있도록 합니다.</p>
<p>벤치마크 결과, Claude Context는 검색 품질을 유지하면서 토큰 소비를 평균 39.4% 줄이고 도구 호출을 36.1% 줄였습니다. 이 게시물에서는 grep 방식의 검색이 컨텍스트를 낭비하는 이유, Claude Context의 내부 작동 방식, 실제 디버깅 작업의 기본 워크플로와 비교하는 방법에 대해 설명합니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_context_reduce_claude_code_token_usage_6_68b1f70723.png" alt="Claude Context GitHub repository trending and passing 10,000 stars" class="doc-image" id="claude-context-github-repository-trending-and-passing-10,000-stars" />
   </span> <span class="img-wrapper"> <span>별 10,000개를 돌파하며 인기를 끌고 있는 Claude Context GitHub 리포지토리</span> </span></p>
<h2 id="Why-grep-style-code-retrieval-burns-tokens-in-AI-coding-agents" class="common-anchor-header">grep 방식의 코드 검색이 AI 코딩 에이전트에서 토큰을 소모하는 이유<button data-href="#Why-grep-style-code-retrieval-burns-tokens-in-AI-coding-agents" class="anchor-icon" translate="no">
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
    </button></h2><p>AI 코딩 에이전트는 함수 호출 경로, 명명 규칙, 관련 테스트, 데이터 모델, 과거 구현 패턴 등 작업과 관련된 코드베이스를 이해해야만 유용한 코드를 작성할 수 있습니다. 큰 컨텍스트 창은 도움이 되지만 검색 문제를 해결하지는 못합니다. 컨텍스트에 잘못된 파일이 들어가면 모델은 여전히 토큰을 낭비하고 관련 없는 코드에서 추론할 수 있습니다.</p>
<p>코드 검색은 일반적으로 크게 두 가지 패턴으로 나뉩니다:</p>
<table>
<thead>
<tr><th>검색 패턴</th><th>작동 방식</th><th>고장 위치</th></tr>
</thead>
<tbody>
<tr><td>그렙 스타일 검색</td><td>리터럴 문자열을 검색한 다음 일치하는 파일 또는 줄 범위를 읽습니다.</td><td>의미적으로 관련된 코드를 놓치고, 노이즈가 많은 일치 항목을 반환하며, 검색/읽기 주기를 반복해야 하는 경우가 많습니다.</td></tr>
<tr><td>RAG 스타일 검색</td><td>코드를 미리 색인한 다음 의미론적, 어휘적 또는 하이브리드 검색으로 관련 청크를 검색합니다.</td><td>대부분의 코딩 도구가 직접 소유하고 싶지 않은 청킹, 임베딩, 인덱싱 및 업데이트 로직이 필요합니다.</td></tr>
</tbody>
</table>
<p>이는 개발자들이 <a href="https://zilliz.com/blog/metadata-filtering-hybrid-search-or-agent-in-rag-applications">RAG 애플리케이션</a> 설계에서 보는 것과 같은 차이점입니다. 리터럴 매칭은 유용하지만 의미가 중요한 경우에는 충분하지 않은 경우가 많습니다. <code translate="no">compute_final_cost()</code> 이라는 함수는 정확한 단어가 일치하지 않더라도 <code translate="no">calculate_total_price()</code> 에 대한 쿼리와 관련이 있을 수 있습니다. 이때 <a href="https://zilliz.com/blog/semantic-search-vs-lexical-search-vs-full-text-search">시맨틱 검색이</a> 도움이 됩니다.</p>
<p>한 디버깅 실행에서 Claude Code는 올바른 영역을 찾기 전에 파일을 반복적으로 검색하고 읽었습니다. 몇 분이 지나고 나서야 관련성이 있는 코드의 극히 일부만 발견되었습니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_context_reduce_claude_code_token_usage_4_69b8455aeb.png" alt="Claude Code grep-style search spending time on irrelevant file reads" class="doc-image" id="claude-code-grep-style-search-spending-time-on-irrelevant-file-reads" />
   </span> <span class="img-wrapper"> <span>관련 없는 파일 읽기에 시간을 소비하는 Claude Code grep 스타일 검색</span> </span></p>
<p>이러한 패턴은 개발자들이 공개적으로 불만을 토로할 만큼 흔한 것으로, 에이전트는 똑똑할 수 있지만 컨텍스트 검색 루프는 여전히 비싸고 부정확하다고 느껴집니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_context_reduce_claude_code_token_usage_8_b857ab4777.png" alt="Developer comment about Claude Code context and token usage" class="doc-image" id="developer-comment-about-claude-code-context-and-token-usage" />
   </span> <span class="img-wrapper"> <span>Claude 코드 컨텍스트 및 토큰 사용에 대한 개발자 의견</span> </span></p>
<p>Grep 스타일 검색은 세 가지 예측 가능한 방식으로 실패합니다:</p>
<ul>
<li><strong>정보 과부하:</strong> 대규모 리포지토리는 많은 리터럴 일치 항목을 생성하며, 대부분은 현재 작업에 유용하지 않습니다.</li>
<li><strong>시맨틱 블라인드:</strong> grep은 의도, 동작 또는 이와 동등한 구현 패턴이 아닌 문자열만 일치시킵니다.</li>
<li><strong>컨텍스트 손실:</strong> 줄 수준의 일치에는 주변 클래스, 종속성, 테스트 또는 호출 그래프가 자동으로 포함되지 않습니다.</li>
</ul>
<p>더 나은 코드 검색 계층은 키워드 정밀도와 의미론적 이해를 결합한 다음 모델이 코드를 추론할 수 있을 만큼 완전한 청크를 반환해야 합니다.</p>
<h2 id="What-is-Claude-Context" class="common-anchor-header">클로드 컨텍스트란 무엇인가요?<button data-href="#What-is-Claude-Context" class="anchor-icon" translate="no">
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
    </button></h2><p>클로드 컨텍스트는 코드 검색을 위한 오픈 소스 <a href="https://zilliz.com/glossary/model-context-protocol-(mcp)">모델 컨텍스트 프로토콜</a> 서버입니다. 이 서버는 AI 코딩 도구를 Milvus가 지원하는 코드 인덱스에 연결하여 에이전트가 리터럴 텍스트 검색에만 의존하지 않고 의미별로 리포지토리를 검색할 수 있도록 합니다.</p>
<p>목표는 간단합니다. 에이전트가 컨텍스트를 요청하면 가장 작은 유용한 코드 청크 세트를 반환하는 것입니다. Claude Context는 코드베이스를 구문 분석하고, 임베딩을 생성하고, <a href="https://zilliz.com/what-is-milvus">Milvus 벡터 데이터베이스에</a> 청크를 저장하고, MCP 호환 도구를 통해 검색을 노출하는 방식으로 이를 수행합니다.</p>
<table>
<thead>
<tr><th>그렙 문제</th><th>클로드 컨텍스트 접근 방식</th></tr>
</thead>
<tbody>
<tr><td>관련 없는 일치 항목이 너무 많음</td><td>벡터 유사성 및 키워드 관련성을 기준으로 코드 청크의 순위를 매깁니다.</td></tr>
<tr><td>의미론적 이해가 없음</td><td><a href="https://zilliz.com/blog/voyage-ai-embeddings-and-rerankers-for-search-and-rag">임베딩 모델을</a> 사용하여 이름이 다른 경우에도 관련 구현이 일치할 수 있도록 합니다.</td></tr>
<tr><td>주변 컨텍스트 누락</td><td>모델이 동작을 추론하기에 충분한 구조를 갖춘 완전한 코드 청크를 반환하세요.</td></tr>
<tr><td>반복적인 파일 읽기</td><td>인덱스를 먼저 검색한 다음 중요한 파일만 읽거나 편집하세요.</td></tr>
</tbody>
</table>
<p>클로드 컨텍스트는 MCP를 통해 노출되므로 클로드 코드, Gemini CLI, 커서 스타일 MCP 호스트 및 기타 MCP 호환 환경과 함께 작동할 수 있습니다. 동일한 핵심 검색 레이어가 여러 에이전트 인터페이스를 지원할 수 있습니다.</p>
<h2 id="How-Claude-Context-works-under-the-hood" class="common-anchor-header">클로드 컨텍스트의 내부 작동 방식<button data-href="#How-Claude-Context-works-under-the-hood" class="anchor-icon" translate="no">
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
    </button></h2><p>클로드 컨텍스트에는 재사용 가능한 코어 모듈과 통합 모듈이라는 두 가지 주요 계층이 있습니다. 코어는 파싱, 청킹, 인덱싱, 검색, 증분 동기화를 처리합니다. 상위 계층은 MCP와 에디터 통합을 통해 이러한 기능을 노출합니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_context_reduce_claude_code_token_usage_5_cf9f17013f.png" alt="Claude Context architecture showing MCP integrations, core module, embedding provider, and vector database" class="doc-image" id="claude-context-architecture-showing-mcp-integrations,-core-module,-embedding-provider,-and-vector-database" />
   </span> <span class="img-wrapper"> <span>MCP 통합, 코어 모듈, 임베딩 공급자 및 벡터 데이터베이스를 보여주는 Claude Context 아키텍처</span> </span></p>
<h3 id="How-does-MCP-connect-Claude-Context-to-coding-agents" class="common-anchor-header">MCP는 어떻게 클로드 컨텍스트를 코딩 에이전트에 연결하나요?</h3><p>MCP는 LLM 호스트와 외부 툴 간의 인터페이스를 제공합니다. Claude Context를 MCP 서버로 노출함으로써 검색 계층은 하나의 IDE 또는 코딩 어시스턴트로부터 독립적으로 유지됩니다. 에이전트가 검색 도구를 호출하면 Claude Context가 코드 인덱스를 처리하고 관련 청크를 반환합니다.</p>
<p>더 넓은 패턴을 이해하려면 <a href="https://milvus.io/docs/milvus_and_mcp.md">MCP + Milvus 가이드에서</a> MCP가 어떻게 AI 도구를 벡터 데이터베이스 작업에 연결할 수 있는지 살펴보세요.</p>
<h3 id="Why-use-Milvus-for-code-retrieval" class="common-anchor-header">코드 검색에 Milvus를 사용하는 이유는 무엇인가요?</h3><p>코드 검색에는 빠른 벡터 검색, 메타데이터 필터링, 대규모 리포지토리를 처리할 수 있는 충분한 규모가 필요합니다. Milvus는 고성능 벡터 검색을 위해 설계되었으며 고밀도 벡터, 스파스 벡터, 재순위 지정 워크플로우를 지원할 수 있습니다. 검색이 많은 에이전트 시스템을 구축하는 팀의 경우, <a href="https://milvus.io/docs/multi-vector-search.md">다중 벡터 하이브리드 검색</a> 문서와 <a href="https://milvus.io/api-reference/pymilvus/v2.6.x/MilvusClient/Vector/hybrid_search.md">PyMilvus hybrid_search API는</a> 프로덕션 시스템에서 사용되는 것과 동일한 기본 검색 패턴을 보여줍니다.</p>
<p>클로드 컨텍스트는 Zilliz Cloud를 관리형 Milvus 백엔드로 사용할 수 있으므로 벡터 데이터베이스를 직접 실행하고 확장하지 않아도 됩니다. 동일한 아키텍처를 자체 관리형 Milvus 배포에도 적용할 수 있습니다.</p>
<h3 id="Which-embedding-providers-does-Claude-Context-support" class="common-anchor-header">클로드 컨텍스트는 어떤 임베딩 제공업체를 지원하나요?</h3><p>클로드 컨텍스트는 여러 임베딩 옵션을 지원합니다:</p>
<table>
<thead>
<tr><th>제공업체</th><th>가장 적합한</th></tr>
</thead>
<tbody>
<tr><td>OpenAI 임베딩</td><td>광범위한 에코시스템을 지원하는 범용 호스팅 임베딩.</td></tr>
<tr><td>Voyage AI 임베딩</td><td>특히 검색 품질이 중요한 경우에 적합한 코드 지향 검색.</td></tr>
<tr><td>Ollama</td><td>개인정보 보호에 민감한 환경을 위한 로컬 임베딩 워크플로우.</td></tr>
</tbody>
</table>
<p>관련 Milvus 워크플로우에 대해서는 <a href="https://milvus.io/docs/embeddings.md">Milvus 임베딩 개요</a>, <a href="https://milvus.io/docs/embed-with-openai.md">OpenAI 임베딩 통합</a>, <a href="https://milvus.io/docs/embed-with-voyage.md">Voyage 임베딩 통합</a>, <a href="https://zilliz.com/blog/simplifying-legal-research-with-rag-milvus-ollama">Milvus로 Ollama</a> 실행 예시를 참조하세요.</p>
<h3 id="Why-is-the-core-library-written-in-TypeScript" class="common-anchor-header">핵심 라이브러리가 TypeScript로 작성된 이유는 무엇인가요?</h3><p>많은 코딩 에이전트 통합, 에디터 플러그인 및 MCP 호스트가 이미 TypeScript를 많이 사용하기 때문에 Claude Context는 TypeScript로 작성되었습니다. 검색 코어를 TypeScript로 유지하면 깔끔한 API를 노출하면서 애플리케이션 계층 도구와 더 쉽게 통합할 수 있습니다.</p>
<p>코어 모듈은 벡터 데이터베이스와 임베딩 프로바이더를 컴포저블 <code translate="no">Context</code> 객체로 추상화합니다:</p>
<pre><code translate="no" class="language-javascript"><span class="hljs-keyword">import</span> { <span class="hljs-title class_">Context</span>, <span class="hljs-title class_">MilvusVectorDatabase</span>, <span class="hljs-title class_">OpenAIEmbedding</span> } <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;@zilliz/claude-context-core&#x27;</span>;
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
<h2 id="How-Claude-Context-chunks-code-and-keeps-indexes-fresh" class="common-anchor-header">Claude Context가 코드를 청크하고 인덱스를 최신 상태로 유지하는 방법<button data-href="#How-Claude-Context-chunks-code-and-keeps-indexes-fresh" class="anchor-icon" translate="no">
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
    </button></h2><p>청킹과 증분 업데이트는 코드 검색 시스템을 실제로 사용할 수 있는지 여부를 결정합니다. 청크가 너무 작으면 모델에서 컨텍스트를 잃게 됩니다. 청크가 너무 크면 검색 시스템이 노이즈를 반환합니다. 인덱싱이 너무 느리면 개발자는 사용을 중단합니다.</p>
<p>클로드 컨텍스트는 AST 기반 청킹, 폴백 텍스트 분할기, 머클 트리 기반 변경 감지 기능을 통해 이 문제를 처리합니다.</p>
<h3 id="How-does-AST-based-code-chunking-preserve-context" class="common-anchor-header">AST 기반 코드 청킹은 어떻게 컨텍스트를 보존하나요?</h3><p>AST 청킹은 기본 전략입니다. 줄 수나 문자 수로 파일을 분할하는 대신, Claude Context는 함수, 클래스, 메서드와 같은 의미 단위 중심으로 코드 구조와 청크를 파싱합니다.</p>
<p>이를 통해 각 청크에는 세 가지 유용한 속성이 부여됩니다:</p>
<table>
<thead>
<tr><th>속성</th><th>이것이 중요한 이유</th></tr>
</thead>
<tbody>
<tr><td>구문 완전성</td><td>함수와 클래스가 중간에 분할되지 않습니다.</td></tr>
<tr><td>논리적 일관성</td><td>관련 논리가 함께 유지되므로 검색된 청크를 모델에서 더 쉽게 사용할 수 있습니다.</td></tr>
<tr><td>다국어 지원</td><td>다양한 트리시터 파서가 JavaScript, Python, Java, Go 및 기타 언어를 처리할 수 있습니다.</td></tr>
</tbody>
</table>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_context_reduce_claude_code_token_usage_9_153144cc04.png" alt="AST-based code chunking preserving complete syntactic units and chunking results" class="doc-image" id="ast-based-code-chunking-preserving-complete-syntactic-units-and-chunking-results" />
   </span> <span class="img-wrapper"> <span>완전한 구문 단위와 청킹 결과를 보존하는 AST 기반 코드 청킹</span> </span></p>
<h3 id="What-happens-when-AST-parsing-fails" class="common-anchor-header">AST 구문 분석이 실패하면 어떻게 되나요?</h3><p>AST 구문 분석이 처리할 수 없는 언어나 파일의 경우, Claude Context는 LangChain의 <code translate="no">RecursiveCharacterTextSplitter</code> 로 되돌아갑니다. 이 방법은 AST 청킹보다 정확도는 떨어지지만 지원되지 않는 입력에서 색인 실패를 방지할 수 있습니다.</p>
<pre><code translate="no" class="language-php"><span class="hljs-comment">// Use recursive character splitting to preserve code structure</span>
<span class="hljs-keyword">const</span> splitter = <span class="hljs-title class_">RecursiveCharacterTextSplitter</span>.<span class="hljs-title function_">fromLanguage</span>(language, {
    <span class="hljs-attr">chunkSize</span>: <span class="hljs-number">1000</span>,
    <span class="hljs-attr">chunkOverlap</span>: <span class="hljs-number">200</span>,
});
<button class="copy-code-btn"></button></code></pre>
<h3 id="How-does-Claude-Context-avoid-re-indexing-the-whole-repository" class="common-anchor-header">클로드 컨텍스트는 어떻게 전체 리포지토리의 재색인을 피하나요?</h3><p>변경 사항이 있을 때마다 전체 리포지토리를 다시 색인하는 것은 비용이 너무 많이 듭니다. 클로드 컨텍스트는 머클 트리를 사용하여 변경된 내용을 정확히 감지합니다.</p>
<p>머클 트리는 각 파일에 해시를 할당하고, 하위 파일에서 각 디렉터리 해시를 도출한 다음, 전체 리포지토리를 루트 해시로 롤링합니다. 루트 해시가 변경되지 않으면 Claude Context는 인덱싱을 건너뛸 수 있습니다. 루트가 변경되면 트리를 따라 내려가 변경된 파일을 찾아 해당 파일만 다시 임베드합니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_context_reduce_claude_code_token_usage_10_73daa3ca83.png" alt="Merkle tree change detection comparing unchanged and changed file hashes" class="doc-image" id="merkle-tree-change-detection-comparing-unchanged-and-changed-file-hashes" />
   </span> <span class="img-wrapper"> <span>변경되지 않은 파일 해시와 변경된 파일 해시를 비교하는 머클 트리 변경 감지</span> </span></p>
<p>동기화는 3단계로 실행됩니다:</p>
<table>
<thead>
<tr><th>단계</th><th>어떤 일이 일어나는가</th><th>효율적인 이유</th></tr>
</thead>
<tbody>
<tr><td>빠른 확인</td><td>현재 머클 루트를 마지막 스냅샷과 비교합니다.</td><td>변경된 사항이 없으면 확인이 빠르게 완료됩니다.</td></tr>
<tr><td>정확한 차이점</td><td>트리를 따라가면서 추가, 삭제, 수정된 파일을 식별하세요.</td><td>변경된 경로만 앞으로 이동합니다.</td></tr>
<tr><td>증분 업데이트</td><td>변경된 파일에 대한 임베딩을 다시 계산하고 Milvus를 업데이트합니다.</td><td>벡터 인덱스는 전체 재빌드 없이 최신 상태로 유지됩니다.</td></tr>
</tbody>
</table>
<p>로컬 동기화 상태는 <code translate="no">~/.context/merkle/</code> 에 저장되므로 재시작 후 클로드 컨텍스트가 파일 해시 테이블과 직렬화된 머클 트리를 복원할 수 있습니다.</p>
<h2 id="What-happens-when-Claude-Code-uses-Claude-Context" class="common-anchor-header">클로드 코드가 클로드 컨텍스트를 사용하면 어떻게 되나요?<button data-href="#What-happens-when-Claude-Code-uses-Claude-Context" class="anchor-icon" translate="no">
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
    </button></h2><p>설정은 Claude Code를 실행하기 전에 한 번의 명령으로 완료됩니다:</p>
<pre><code translate="no" class="language-nginx">claude mcp add claude-context -e OPENAI_API_KEY=your-openai-api-key -e MILVUS_TOKEN=your-zilliz-cloud-api-key -- npx <span class="hljs-meta">@zilliz</span>/claude-context-mcp<span class="hljs-meta">@latest</span>
<button class="copy-code-btn"></button></code></pre>
<p>리포지토리를 인덱싱한 후 Claude Code는 코드베이스 컨텍스트가 필요할 때 Claude Context를 호출할 수 있습니다. 이전에 grep과 파일 읽기에 시간을 낭비했던 동일한 버그 찾기 시나리오에서 Claude Context는 전체 설명과 함께 정확한 파일과 줄 번호를 찾아냈습니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/article_12_9ad25bd75b.gif" alt="Claude Context demo showing Claude Code finding the relevant bug location" class="doc-image" id="claude-context-demo-showing-claude-code-finding-the-relevant-bug-location" />
   </span> <span class="img-wrapper"> <span>관련 버그 위치를 찾는 Claude Code를 보여주는 Claude Context 데모</span> </span></p>
<p>이 도구는 버그 헌팅에만 국한되지 않습니다. 리팩토링, 중복 코드 감지, 문제 해결, 테스트 생성 및 에이전트가 정확한 리포지토리 컨텍스트를 필요로 하는 모든 작업에도 도움이 됩니다.</p>
<p>동등한 리콜에서 Claude Context는 벤치마크에서 토큰 소비를 39.4% 줄이고 도구 호출을 36.1% 줄였습니다. 도구 호출과 관련 없는 파일 읽기가 코딩 에이전트 워크플로우의 비용을 지배하는 경우가 많기 때문에 이는 중요한 의미를 갖습니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_context_reduce_claude_code_token_usage_3_e20064021b.png" alt="Benchmark chart showing Claude Context reducing token usage and tool calls versus baseline" class="doc-image" id="benchmark-chart-showing-claude-context-reducing-token-usage-and-tool-calls-versus-baseline" />
   </span> <span class="img-wrapper"> <span>기준선 대비 토큰 사용량 및 도구 호출을 줄이는 Claude Context를 보여주는 벤치마크 차트</span> </span></p>
<p>이 프로젝트는 현재 10,000개 이상의 GitHub 별을 받았으며, 리포지토리에는 전체 벤치마크 세부 정보 및 패키지 링크가 포함되어 있습니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_context_reduce_claude_code_token_usage_7_210af604bd.png" alt="Claude Context GitHub star history showing rapid growth" class="doc-image" id="claude-context-github-star-history-showing-rapid-growth" />
   </span> <span class="img-wrapper"> <span>빠른 성장을 보여주는 Claude Context GitHub 스타 기록</span> </span></p>
<h2 id="How-does-Claude-Context-compare-with-grep-on-real-bugs" class="common-anchor-header">실제 버그에 대해 Claude Context는 grep과 어떻게 비교하나요?<button data-href="#How-does-Claude-Context-compare-with-grep-on-real-bugs" class="anchor-icon" translate="no">
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
    </button></h2><p>이 벤치마크는 실제 디버깅 작업에서 순수 텍스트 검색과 Milvus 지원 코드 검색을 비교합니다. 차이점은 단순히 토큰 수가 적다는 것만이 아닙니다. Claude Context는 에이전트의 검색 경로를 변경하여 변경이 필요한 구현에 더 가깝게 시작합니다.</p>
<table>
<thead>
<tr><th>Case</th><th>기준 동작</th><th>클로드 컨텍스트 동작</th><th>토큰 감소</th></tr>
</thead>
<tbody>
<tr><td>장고 <code translate="no">YearLookup</code> 버그</td><td>잘못된 관련 심볼을 검색하고 등록 로직을 수정했습니다.</td><td><code translate="no">YearLookup</code> 최적화 로직을 직접 찾았습니다.</td><td>토큰 93% 감소</td></tr>
<tr><td>Xarray <code translate="no">swap_dims()</code> 버그</td><td><code translate="no">swap_dims</code> 에 대한 언급 주위에 흩어져 있는 파일을 읽음.</td><td>구현 및 관련 테스트를 더 직접적으로 찾았습니다.</td><td>토큰 62% 감소</td></tr>
</tbody>
</table>
<h3 id="Case-1-Django-YearLookup-bug" class="common-anchor-header">사례 1: 장고 연도 조회 버그</h3><p><strong>문제 설명:</strong> 장고 프레임워크에서 <code translate="no">YearLookup</code> 쿼리 최적화가 <code translate="no">__iso_year</code> 필터링을 중단시킵니다. <code translate="no">__iso_year</code> 필터를 사용할 때 <code translate="no">YearLookup</code> 클래스는 표준 BETWEEN 최적화를 잘못 적용합니다(달력 연도에는 유효하지만 ISO 주 번호 연도에는 유효하지 않음).</p>
<pre><code translate="no" class="language-python"><span class="hljs-comment"># This should use EXTRACT(&#x27;isoyear&#x27; FROM ...) but incorrectly uses BETWEEN</span>
DTModel.objects.<span class="hljs-built_in">filter</span>(start_date__iso_year=<span class="hljs-number">2020</span>)

<span class="hljs-comment"># Generated: WHERE &quot;start_date&quot; BETWEEN 2020-01-01 AND 2020-12-31</span>
<span class="hljs-comment"># Should be: WHERE EXTRACT(&#x27;isoyear&#x27; FROM &quot;start_date&quot;) = 2020</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>기준선(grep):</strong></p>
<pre><code translate="no" class="language-swift">🔧 <span class="hljs-title function_">directory_tree</span>()
⚙️ <span class="hljs-title class_">Result</span>: <span class="hljs-title class_">Retrieved</span> <span class="hljs-number">3000</span>+ lines <span class="hljs-keyword">of</span> directory <span class="hljs-title function_">structure</span> (~50k tokens)
   <span class="hljs-title class_">Problem</span>: <span class="hljs-title class_">Massive</span> information overload, no direct relevance
🔧 <span class="hljs-title function_">search_text</span>(<span class="hljs-string">&#x27;ExtractIsoYear&#x27;</span>)
⚙️ <span class="hljs-title class_">Result</span>: <span class="hljs-title class_">Found</span> <span class="hljs-number">21</span> matches across multiple <span class="hljs-attr">files</span>:
   - django/db/models/functions/__init__.<span class="hljs-property">py</span>:<span class="hljs-number">5</span> (<span class="hljs-keyword">import</span> statement)
   - django/db/models/functions/__init__.<span class="hljs-property">py</span>:<span class="hljs-number">31</span> (<span class="hljs-keyword">export</span> list)  
   - django/db/models/functions/datetime.<span class="hljs-property">py</span>:<span class="hljs-number">93</span> (<span class="hljs-title class_">ExtractIsoYear</span> <span class="hljs-keyword">class</span>)
   <span class="hljs-title class_">Problem</span>: <span class="hljs-title class_">Most</span> are unrelated imports and registrations
🔧 <span class="hljs-title function_">edit_file</span>(<span class="hljs-string">&#x27;django/db/models/functions/datetime.py&#x27;</span>)
⚙️ <span class="hljs-title class_">Modified</span> multiple registration statements, but <span class="hljs-variable language_">this</span> is the wrong direction <span class="hljs-keyword">for</span> a fix
<button class="copy-code-btn"></button></code></pre>
<p>텍스트 검색이 <code translate="no">YearLookup</code> 의 최적화 로직 대신 <code translate="no">ExtractIsoYear</code> 등록에 초점을 맞췄습니다.</p>
<p><strong>클로드 컨텍스트:</strong></p>
<pre><code translate="no" class="language-bash">🔧 search_code(<span class="hljs-string">&#x27;YearLookup&#x27;</span>)
⚙️ Found <span class="hljs-number">10</span> results <span class="hljs-keyword">for</span> query: <span class="hljs-string">&quot;YearLookup&quot;</span> across the codebase
   <span class="hljs-number">1.</span> Code <span class="hljs-title function_">snippet</span> <span class="hljs-params">(python)</span> [repo__django__django]
      Location: django/db/models/lookups.py:<span class="hljs-number">568</span>-<span class="hljs-number">577</span>
      Context: YearExact <span class="hljs-keyword">class</span> <span class="hljs-title class_">and</span> get_bound_params method
   <span class="hljs-number">2.</span> Code <span class="hljs-title function_">snippet</span> <span class="hljs-params">(python)</span> [repo__django__django]  
      Location: django/db/models/lookups.py:<span class="hljs-number">538</span>-<span class="hljs-number">569</span>
      Context: YearLookup base <span class="hljs-keyword">class</span> <span class="hljs-title class_">and</span> year_lookup_bounds method
🔧 edit_file(django/db/models/lookups.py)
⚙️ Successfully modified the core optimization logic, adding ISO year handling
<button class="copy-code-btn"></button></code></pre>
<p>시맨틱 검색은 <code translate="no">YearLookup</code> 을 핵심 개념으로 이해하고 올바른 클래스로 바로 이동했습니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_context_reduce_claude_code_token_usage_2_159ccffec9.png" alt="Django YearLookup benchmark table showing 93 percent fewer tokens with Claude Context" class="doc-image" id="django-yearlookup-benchmark-table-showing-93-percent-fewer-tokens-with-claude-context" />
   </span> <span class="img-wrapper"> <span>Claude Context를 사용하여 93% 더 적은 토큰을 보여주는 Django YearLookup 벤치마크 표</span> </span></p>
<p><strong>결과:</strong> 93% 더 적은 토큰.</p>
<h3 id="Case-2-Xarray-swapdims-bug" class="common-anchor-header">사례 2: Xarray swap_dims 버그</h3><p><strong>문제 설명:</strong> Xarray 라이브러리의 <code translate="no">.swap_dims()</code> 메서드가 예기치 않게 원본 객체를 변경하여 불변성에 대한 기대치를 위반합니다.</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">import</span> numpy <span class="hljs-keyword">as</span> np
<span class="hljs-keyword">import</span> xarray <span class="hljs-keyword">as</span> xr
nz = <span class="hljs-number">11</span>
ds = xr.Dataset({
    <span class="hljs-string">&quot;y&quot;</span>: (<span class="hljs-string">&quot;z&quot;</span>, np.random.rand(nz)),
    <span class="hljs-string">&quot;lev&quot;</span>: (<span class="hljs-string">&quot;z&quot;</span>, np.arange(nz) * <span class="hljs-number">10</span>),
})

<span class="hljs-comment"># This shouldn&#x27;t modify ds, but it does</span>
ds2 = ds.swap_dims(z=<span class="hljs-string">&quot;lev&quot;</span>).rename_dims(lev=<span class="hljs-string">&quot;z&quot;</span>).reset_index(<span class="hljs-string">&quot;lev&quot;</span>).reset_coords()
ds2.swap_dims(z=<span class="hljs-string">&#x27;lev&#x27;</span>)  <span class="hljs-comment"># this unexpectedly modifies ds2[&#x27;lev&#x27;]</span>
<span class="hljs-comment"># ds2[&#x27;lev&#x27;] now has dimension &#x27;lev&#x27; instead of &#x27;z&#x27;</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>기준선(grep):</strong></p>
<pre><code translate="no" class="language-bash">🔧 list_directory(<span class="hljs-string">&#x27;repo__pydata__xarray&#x27;</span>)
⚙️ Result: Retrieved directory structure across multiple subdirectories
   Problem: Basic directory navigation, no targeted search
🔧 search_text(<span class="hljs-string">&#x27;swap_dims&#x27;</span>)
⚙️ Result: Found 21 matches across core files:
   - xarray/core/common.py:600 (Dataset.swap_dims reference)
   - xarray/core/dataarray.py:753 (<span class="hljs-string">&quot;.rename() or .swap_dims() instead.&quot;</span>)
   - xarray/core/dataarray.py:2026 (DataArray.swap_dims reference)
   - xarray/core/dataarray.py:2044 (def swap_dims method)
   Problem: Many matches scattered across different contexts
🔧 read_file(<span class="hljs-string">&#x27;xarray/core/dataarray.py&#x27;</span>, offset=2000, <span class="hljs-built_in">limit</span>=40)
⚙️ Result: Read lines 2001-2040 showing rename method documentation

🔧 read_file(<span class="hljs-string">&#x27;xarray/core/dataset.py&#x27;</span>, offset=3600, <span class="hljs-built_in">limit</span>=40) 
⚙️ Result: Read lines 3601-3640 showing rename_dims method
<button class="copy-code-btn"></button></code></pre>
<p>기준선은 실제 구현 경로를 찾기 전에 디렉터리를 탐색하고 주변 코드를 읽는 데 시간을 소비했습니다.</p>
<p><strong>클로드 컨텍스트:</strong></p>
<pre><code translate="no" class="language-bash">🔧 search_code(<span class="hljs-string">&#x27;.swap_dims()&#x27;</span>)
⚙️ Found <span class="hljs-number">10</span> results <span class="hljs-keyword">for</span> query: <span class="hljs-string">&quot;.swap_dims()&quot;</span> across the codebase
   <span class="hljs-number">1.</span> <span class="hljs-function">Code <span class="hljs-title">snippet</span> (<span class="hljs-params">python</span>) [repo__pydata__xarray]
      Location: xarray/tests/test_formatting_html.py:67-76
   2. Code <span class="hljs-title">snippet</span> (<span class="hljs-params">python</span>) [repo__pydata__xarray]
      Location: xarray/tests/test_dataset.py:2926-2979
🔧 <span class="hljs-title">edit_file</span>(<span class="hljs-params"><span class="hljs-string">&#x27;xarray/core/dataset.py&#x27;</span></span>)
⚙️ Successfully modified the <span class="hljs-keyword">file</span>, added dimension handling logic
🔧 <span class="hljs-title">edit_file</span>(<span class="hljs-params"><span class="hljs-string">&#x27;xarray/core/dataarray.py&#x27;</span></span>)
⚙️ Successfully modified the <span class="hljs-keyword">file</span>, ensuring the original DataArray <span class="hljs-keyword">is</span> <span class="hljs-keyword">not</span> mutated
</span><button class="copy-code-btn"></button></code></pre>
<p>시맨틱 검색은 관련 <code translate="no">swap_dims()</code> 구현과 관련 컨텍스트를 더 빨리 찾았습니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_context_reduce_claude_code_token_usage_1_d75e931f20.png" alt="Xarray swap_dims benchmark table showing 62 percent fewer tokens with Claude Context" class="doc-image" id="xarray-swap_dims-benchmark-table-showing-62-percent-fewer-tokens-with-claude-context" />
   </span> <span class="img-wrapper"> <span>Claude Context를 사용하면 62% 더 적은 토큰을 보여주는 Xarray swap_dims 벤치마크 표</span> </span></p>
<p><strong>결과:</strong> 62% 더 적은 토큰.</p>
<h2 id="Get-started-with-Claude-Context" class="common-anchor-header">클로드 컨텍스트 시작하기<button data-href="#Get-started-with-Claude-Context" class="anchor-icon" translate="no">
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
    </button></h2><p>이 글에서 소개한 정확한 도구를 사용해 보고 싶으시다면, <a href="https://github.com/zilliztech/claude-context">Claude Context GitHub 리포지토리와</a> <a href="https://www.npmjs.com/package/%40zilliz/claude-context-mcp">Claude Context MCP 패키지로</a> 시작하세요. 리포지토리에는 설정 지침, 벤치마크 및 핵심 TypeScript 패키지가 포함되어 있습니다.</p>
<p>검색 레이어를 이해하거나 사용자 정의하려는 경우 다음 단계에서 이러한 리소스를 유용하게 활용할 수 있습니다:</p>
<ul>
<li><a href="https://milvus.io/docs/quickstart.md">Milvus 빠른 시작을</a> 통해 벡터 데이터베이스의 기본 사항을 알아보세요.</li>
<li>BM25 스타일의 검색과 밀도 높은 벡터를 결합하려면 <a href="https://milvus.io/docs/full-text-search.md">Milvus 전체 텍스트 검색과</a> <a href="https://milvus.io/docs/full_text_search_with_milvus.md">LangChain 전체 텍스트 검색 튜토리얼을</a> 살펴보세요.</li>
<li>인프라 옵션을 비교하고 있다면 <a href="https://zilliz.com/blog/top-5-open-source-vector-search-engines">오픈 소스 벡터 검색 엔진을</a> 검토하세요.</li>
<li>클로드 코드 워크플로우 내에서 직접 벡터 데이터베이스 작업을 하고 싶다면 클로드 <a href="https://zilliz.com/blog/zilliz-cloud-just-landed-in-claude-code">코드용 질리즈 클라우드 플러그인을</a> 사용해 보세요.</li>
</ul>
<p>Milvus 또는 코드 검색 아키텍처에 대한 도움이 필요하면 Milvus <a href="https://milvus.io/community/">커뮤니티에</a> 가입하거나 <a href="https://milvus.io/office-hours">Milvus 오피스 아워를</a> 예약하여 일대일 안내를 받으세요. 인프라 설정을 건너뛰고 싶다면 <a href="https://cloud.zilliz.com/signup">Zilliz Cloud에 가입</a> 하거나 <a href="https://cloud.zilliz.com/login">Zilliz Cloud에 로그인하여</a> 관리형 Milvus를 백엔드로 사용하세요.</p>
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
    </button></h2><h3 id="Why-does-Claude-Code-use-so-many-tokens-on-some-coding-tasks" class="common-anchor-header">클로드 코드는 왜 일부 코딩 작업에 많은 토큰을 사용하나요?</h3><p>클로드 코드는 대규모 리포지토리에서 반복적인 검색과 파일 읽기가 필요한 작업의 경우 많은 토큰을 사용할 수 있습니다. 에이전트가 키워드로 검색하고 관련 없는 파일을 읽은 다음 다시 검색하는 경우, 코드가 작업에 유용하지 않더라도 파일을 읽을 때마다 토큰이 추가됩니다.</p>
<h3 id="How-does-Claude-Context-reduce-Claude-Code-token-usage" class="common-anchor-header">클로드 컨텍스트는 어떻게 클로드 코드 토큰 사용량을 줄이나요?</h3><p>클로드 컨텍스트는 에이전트가 파일을 읽기 전에 Milvus 지원 코드 인덱스를 검색하여 토큰 사용량을 줄입니다. 하이브리드 검색을 통해 관련 코드 청크를 검색하므로 Claude Code는 더 적은 수의 파일을 검사하고 실제로 중요한 코드에 더 많은 컨텍스트 창을 사용할 수 있습니다.</p>
<h3 id="Is-Claude-Context-only-for-Claude-Code" class="common-anchor-header">Claude 컨텍스트는 Claude Code 전용인가요?</h3><p>아니요. Claude Context는 MCP 서버로 노출되므로 MCP를 지원하는 모든 코딩 도구에서 작동할 수 있습니다. 이 글의 주요 예시는 Claude Code이지만, 동일한 검색 레이어로 다른 MCP 호환 IDE 및 에이전트 워크플로우를 지원할 수 있습니다.</p>
<h3 id="Do-I-need-Zilliz-Cloud-to-use-Claude-Context" class="common-anchor-header">클로드 컨텍스트를 사용하려면 질리즈 클라우드가 필요한가요?</h3><p>클로드 컨텍스트는 벡터 데이터베이스 인프라를 운영하지 않으려는 경우 가장 쉬운 경로인 관리형 Milvus 백엔드로 질리즈 클라우드를 사용할 수 있습니다. 동일한 검색 아키텍처가 Milvus 개념을 기반으로 하므로 팀은 자체 관리형 Milvus 배포에도 적용할 수 있습니다.</p>
