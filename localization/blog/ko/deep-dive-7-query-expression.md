---
id: deep-dive-7-query-expression.md
title: 데이터베이스는 쿼리를 어떻게 이해하고 실행하나요?
author: Milvus
date: 2022-05-05T00:00:00.000Z
desc: 벡터 쿼리는 스칼라 필터링을 통해 벡터를 검색하는 프로세스입니다.
cover: assets.zilliz.com/Deep_Dive_7_baae830823.png
tag: Engineering
tags: 'Data science, Database, Tech, Artificial Intelligence, Vector Management'
canonicalUrl: 'https://milvus.io/blog/deep-dive-7-query-expression.md'
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Deep_Dive_7_baae830823.png" alt="Cover image" class="doc-image" id="cover-image" />
   </span> <span class="img-wrapper"> <span>표지 이미지</span> </span></p>
<blockquote>
<p>이 글은 <a href="https://www.linkedin.com/in/yiyun-n-2aa713163/">Angela Ni가</a> 번역했습니다.</p>
</blockquote>
<p>Milvus의 <a href="https://milvus.io/docs/v2.0.x/query.md">벡터 쿼리는</a> 부울 표현식에 기반한 스칼라 필터링을 통해 벡터를 검색하는 프로세스입니다. 스칼라 필터링을 통해 사용자는 데이터 속성에 특정 조건을 적용하여 쿼리 결과를 제한할 수 있습니다. 예를 들어, 사용자가 1990~2010년에 개봉한 영화 중 8.5점 이상인 영화를 쿼리할 경우, 해당 속성(개봉 연도 및 점수)이 조건을 충족하는 영화만 표시합니다.</p>
<p>이번 포스팅에서는 쿼리 표현식 입력부터 쿼리 계획 생성 및 쿼리 실행까지 Milvus에서 쿼리가 어떻게 완료되는지 살펴보겠습니다.</p>
<p><strong>바로가기:</strong></p>
<ul>
<li><a href="#Query-expression">쿼리 표현식</a></li>
<li><a href="#Plan-AST-generation">계획 AST 생성</a></li>
<li><a href="#Query-execution">쿼리 실행</a></li>
</ul>
<h2 id="Query-expression" class="common-anchor-header">쿼리 표현식<button data-href="#Query-expression" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus에서 속성 필터링이 적용된 쿼리 표현식은 EBNF(확장 백커스-나우어 형식) 구문을 채택하고 있습니다. 아래 그림은 Milvus의 표현식 규칙입니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Expression_Syntax_966493a5be.png" alt="Expression Syntax" class="doc-image" id="expression-syntax" />
   </span> <span class="img-wrapper"> <span>표현식 구문</span> </span></p>
<p>논리 표현식은 이진 논리 연산자, 단항 논리 연산자, 논리 표현식, 단일 표현식의 조합을 사용하여 만들 수 있습니다. EBNF 구문 자체가 재귀적이기 때문에 논리 표현식은 조합의 결과이거나 더 큰 논리 표현식의 일부일 수 있습니다. 논리 표현식은 많은 하위 논리 표현식을 포함할 수 있습니다. Milvus에서도 동일한 규칙이 적용됩니다. 사용자가 여러 조건으로 결과의 속성을 필터링해야 하는 경우, 사용자는 다양한 논리 연산자와 표현식을 조합하여 자신만의 필터링 조건 집합을 만들 수 있습니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Boolean_expression_1_dce12f8483.png" alt="Boolean expression" class="doc-image" id="boolean-expression" />
   </span> <span class="img-wrapper"> <span>부울 표현식</span> </span></p>
<p>위 이미지는 Milvus의 부울 <a href="https://milvus.io/docs/v2.0.x/boolean.md">표현식 규칙</a> 중 일부를 보여줍니다. 표현식에 단항 논리 연산자를 추가할 수 있습니다. 현재 Milvus는 시스템에서 스칼라 필드 값이 계산 결과를 만족하지 않는 벡터를 가져와야 함을 나타내는 단항 논리 연산자 &quot;not&quot;만 지원합니다. 이진 논리 연산자에는 &quot;and&quot; 및 &quot;or&quot;가 포함됩니다. 단일 표현식에는 용어 표현식과 비교 표현식이 포함됩니다.</p>
<p>더하기, 빼기, 곱하기, 나누기와 같은 기본적인 산술 계산도 Milvus에서 쿼리 중에 지원됩니다. 다음 이미지는 연산의 우선 순위를 보여줍니다. 연산자는 내림차순으로 위에서 아래로 나열됩니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Precedence_b8cfbdf17b.png" alt="Precedence" class="doc-image" id="precedence" />
   </span> <span class="img-wrapper"> <span>우선 순위</span> </span></p>
<h3 id="How-a-query-expression-on-certain-films-is-processed-in-Milvus" class="common-anchor-header">특정 영화에 대한 쿼리 표현식이 Milvus에서 어떻게 처리될까요?</h3><p>Milvus에 많은 필름 데이터가 저장되어 있고 사용자가 특정 필름을 쿼리하고자 한다고 가정해 보겠습니다. 예를 들어 Milvus에 저장된 각 영화 데이터에는 영화 ID, 개봉 연도, 영화 유형, 점수, 포스터의 다섯 가지 필드가 있습니다. 이 예에서 영화 ID와 개봉 연도의 데이터 유형은 int64이고, 영화 점수는 부동 소수점 데이터입니다. 또한 영화 포스터는 부동 소수점 벡터 형식으로, 영화 유형은 문자열 데이터 형식으로 저장됩니다. 특히 문자열 데이터 유형에 대한 지원은 Milvus 2.1의 새로운 기능입니다.</p>
<p>예를 들어 사용자가 8.5점보다 높은 점수를 받은 영화를 쿼리하고자 한다고 가정해 보겠습니다. 또한 영화가 2000년 이전 10년에서 2000년 이후 10년 사이에 개봉했거나 영화 유형이 코미디 또는 액션 영화여야 하는 경우, 사용자는 다음과 같은 술어 표현식을 입력해야 합니다: <code translate="no">score &gt; 8.5 &amp;&amp; (2000 - 10 &lt; release_year &lt; 2000 + 10 || type in [comedy,action])</code>.</p>
<p>쿼리 표현식을 받으면 시스템은 다음 우선순위에 따라 실행합니다:</p>
<ol>
<li>8.5점보다 높은 점수를 받은 영화를 쿼리합니다. 쿼리 결과를 &quot;result1&quot;이라고 합니다.</li>
<li>2000 - 10을 계산하여 "result2"(1990)를 얻습니다.</li>
<li>2000 + 10을 계산하여 "result3"(2010)을 얻습니다.</li>
<li><code translate="no">release_year</code> 값이 &quot;result2&quot;보다 크고 &quot;result3&quot;보다 작은 영화에 대해 쿼리합니다. 즉, 시스템에서 1990년부터 2010년 사이에 개봉한 영화를 쿼리해야 합니다. 쿼리 결과를 &quot;result4&quot;라고 합니다.</li>
<li>코미디 또는 액션 영화인 영화를 쿼리합니다. 쿼리 결과를 &quot;result5&quot;라고 합니다.</li>
<li>"result4"와 "result5"를 결합하여 1990년부터 2010년 사이에 개봉했거나 코미디 또는 액션 영화 카테고리에 속하는 영화를 얻습니다. 결과를 &quot;result6&quot;이라고 합니다.</li>
<li>"result1"과 "result6"의 공통 부분을 취하여 모든 조건을 만족하는 최종 결과를 얻습니다.</li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Frame_1_16_00972a6e5d.png" alt="Film example" class="doc-image" id="film-example" />
   </span> <span class="img-wrapper"> <span>영화 예제</span> </span></p>
<h2 id="Plan-AST-generation" class="common-anchor-header">AST 생성 계획<button data-href="#Plan-AST-generation" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus는 AST(추상 구문 트리) 생성을 위해 오픈 소스 도구인 <a href="https://www.antlr.org/">ANTLR</a> (ANother Tool for Language Recognition)을 활용합니다. ANTLR은 구조 텍스트 또는 바이너리 파일을 읽고, 처리하고, 실행하거나 번역하기 위한 강력한 파서 생성기입니다. 보다 구체적으로, ANTLR은 사전 정의된 구문 또는 규칙을 기반으로 구문 분석 트리를 구축하고 워킹하기 위한 구문 분석기를 생성할 수 있습니다. 다음 이미지는 입력 표현식이 &quot;SP=100;&quot;인 예제입니다. ANTLR에 내장된 언어 인식 기능인 LEXER는 입력 표현식에 대해 &quot;SP&quot;, &quot;=&quot;, &quot;100&quot;, &quot;;&quot; 등 네 개의 토큰을 생성합니다. 그런 다음 이 도구는 4개의 토큰을 추가로 파싱하여 해당 파싱 트리를 생성합니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/parse_tree_b2c3fb0b36.png" alt="parse tree" class="doc-image" id="parse-tree" />
   </span> <span class="img-wrapper"> <span>구문 분석 트리</span> </span></p>
<p>워커 메커니즘은 ANTLR 도구에서 매우 중요한 부분입니다. 워커 메커니즘은 모든 구문 분석 트리를 탐색하여 각 노드가 구문 규칙을 준수하는지 검사하거나 특정 민감한 단어를 감지하도록 설계되었습니다. 관련 API 중 일부는 아래 이미지에 나열되어 있습니다. ANTLR은 루트 노드에서 시작하여 각 하위 노드를 거쳐 맨 아래까지 내려가기 때문에 구문 분석 트리를 걷는 순서를 구분할 필요가 없습니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/parse_tree_walker_9a27942502.png" alt="parse tree walker" class="doc-image" id="parse-tree-walker" />
   </span> <span class="img-wrapper"> <span>구문 분석 트리 워커</span> </span></p>
<p>Milvus는 ANTLR과 유사한 방식으로 쿼리용 PlanAST를 생성합니다. 그러나 ANTLR을 사용하려면 다소 복잡한 구문 규칙을 재정의해야 합니다. 따라서 Milvus는 가장 널리 사용되는 규칙 중 하나인 부울 표현식 규칙을 채택하고, 쿼리 표현식의 구문을 쿼리하고 구문 분석하기 위해 GitHub에서 오픈 소스된 <a href="https://github.com/antonmedv/expr">Expr</a> 패키지에 의존합니다.</p>
<p>속성 필터링이 있는 쿼리 중에 Milvus는 쿼리 식을 수신하면 Expr에서 제공하는 구문 분석 방법인 앤트 파서를 사용하여 원시 미해결 계획 트리를 생성합니다. 기본 계획 트리는 단순한 이진 트리입니다. 그런 다음 이 계획 트리는 Expr과 Milvus에 내장된 최적화 도구에 의해 미세 조정됩니다. Milvus의 최적화 도구는 앞서 언급한 워커 메커니즘과 매우 유사합니다. Expr에서 제공하는 플랜 트리 최적화 기능은 매우 정교하기 때문에 Milvus에 내장된 옵티마이저의 부담이 상당 부분 완화됩니다. 최종적으로 분석기는 최적화된 플랜 트리를 재귀적인 방식으로 분석하여 <a href="https://developers.google.com/protocol-buffers">프로토콜 버퍼</a> (protobuf) 구조의 플랜 AST를 생성합니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/plan_AST_workflow_3e50b7a0d4.png" alt="plan AST workflow" class="doc-image" id="plan-ast-workflow" />
   </span> <span class="img-wrapper"> <span>계획 AST 워크플로우</span> </span></p>
<h2 id="Query-execution" class="common-anchor-header">쿼리 실행<button data-href="#Query-execution" class="anchor-icon" translate="no">
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
    </button></h2><p>쿼리 실행은 이전 단계에서 생성된 계획 AST의 실행을 근간으로 합니다.</p>
<p>Milvus에서 plan AST는 프로토 구조로 정의됩니다. 아래 이미지는 프로토 구조의 메시지입니다. 표현식은 6가지 유형이 있으며, 이 중 이진 표현식과 단항 표현식은 이진 논리 표현식과 단항 논리 표현식을 추가로 가질 수 있습니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Protobuf1_232132dcf2.png" alt="protobuf1" class="doc-image" id="protobuf1" />
   </span> <span class="img-wrapper"> <span>protobuf1</span> </span></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/protobuf2_193f92f033.png" alt="protobuf2" class="doc-image" id="protobuf2" />
   </span> <span class="img-wrapper"> <span>protobuf2</span> </span></p>
<p>아래 이미지는 쿼리 표현식의 UML 이미지입니다. 각 표현식의 기본 클래스와 파생 클래스를 보여줍니다. 각 클래스에는 방문자 매개변수를 받아들이는 메서드가 있습니다. 이것은 일반적인 방문자 디자인 패턴입니다. 이 패턴의 가장 큰 장점은 사용자가 기본 표현식에 아무 작업도 하지 않고 패턴의 메서드 중 하나에 직접 접근하여 특정 쿼리 표현식 클래스 및 관련 요소를 수정할 수 있다는 점입니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/UML_1238bc30e1.png" alt="UML" class="doc-image" id="uml" />
   </span> <span class="img-wrapper"> <span>UML</span> </span></p>
<p>계획 AST를 실행할 때 Milvus는 먼저 프로토 타입의 계획 노드를 받습니다. 그런 다음 내부 C++ 프로토 파서를 통해 세그코어 타입의 플랜 노드를 얻습니다. 두 가지 유형의 플랜 노드를 얻으면 Milvus는 일련의 클래스 액세스를 수락한 다음 플랜 노드의 내부 구조에서 수정 및 실행합니다. 마지막으로 Milvus는 모든 실행 계획 노드를 검색하여 필터링된 결과를 얻습니다. 최종 결과는 비트마스크 형식으로 출력됩니다. 비트마스크는 비트 숫자("0"과 "1")의 배열입니다. 필터 조건을 충족하는 데이터는 비트마스크에서 "1"로 표시되고, 조건을 충족하지 않는 데이터는 비트마스크에서 "0"으로 표시됩니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/execute_workflow_d89f1ee925.png" alt="execute workflow" class="doc-image" id="execute-workflow" />
   </span> <span class="img-wrapper"> <span>워크플로 실행</span> </span></p>
<h2 id="About-the-Deep-Dive-Series" class="common-anchor-header">심층 분석 시리즈 소개<button data-href="#About-the-Deep-Dive-Series" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.0의 <a href="https://milvus.io/blog/2022-1-25-annoucing-general-availability-of-milvus-2-0.md">공식</a> 출시와 함께 Milvus 아키텍처와 소스 코드에 대한 심층적인 해석을 제공하기 위해 Milvus 딥 다이브 블로그 시리즈를 기획했습니다. 이 블로그 시리즈에서 다루는 주제는 다음과 같습니다:</p>
<ul>
<li><a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md">Milvus 아키텍처 개요</a></li>
<li><a href="https://milvus.io/blog/deep-dive-2-milvus-sdk-and-api.md">API 및 Python SDK</a></li>
<li><a href="https://milvus.io/blog/deep-dive-3-data-processing.md">데이터 처리</a></li>
<li><a href="https://milvus.io/blog/deep-dive-4-data-insertion-and-data-persistence.md">데이터 관리</a></li>
<li><a href="https://milvus.io/blog/deep-dive-5-real-time-query.md">실시간 쿼리</a></li>
<li><a href="https://milvus.io/blog/deep-dive-7-query-expression.md">스칼라 실행 엔진</a></li>
<li><a href="https://milvus.io/blog/deep-dive-6-oss-qa.md">QA 시스템</a></li>
<li><a href="https://milvus.io/blog/deep-dive-8-knowhere.md">벡터 실행 엔진</a></li>
</ul>
