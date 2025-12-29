---
id: >-
  keeping-ai-agents-grounded-context-engineering-strategies-that-prevent-context-rot-using-milvus.md
title: 'AI 에이전트의 기반 유지: Milvus를 사용하여 컨텍스트 썩음을 방지하는 컨텍스트 엔지니어링 전략'
author: Min Yin
date: 2025-12-23T00:00:00.000Z
cover: assets.zilliz.com/context_rot_cover_804387e7c9.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'context engineering, context rot, vector database, Milvus, vector search'
meta_title: |
  Context Engineering Strategies to Prevent LLM Context Rot with Milvus
desc: >-
  장기간 실행되는 LLM 워크플로에서 컨텍스트 로트가 발생하는 이유와 컨텍스트 엔지니어링, 검색 전략 및 Milvus 벡터 검색이 복잡한
  다단계 작업에서 AI 에이전트의 정확성, 집중력 및 안정성을 유지하는 데 어떻게 도움이 되는지 알아보세요.
origin: >-
  https://milvus.io/blog/keeping-ai-agents-grounded-context-engineering-strategies-that-prevent-context-rot-using-milvus.md
---
<p>장시간의 LLM 대화를 진행해 본 적이 있다면, 긴 스레드 중간에 모델이 표류하기 시작하는 답답한 순간을 경험한 적이 있을 것입니다. 답변이 모호해지고 추론이 약해지며 주요 세부 사항이 신비롭게 사라집니다. 하지만 새 채팅에 똑같은 질문을 던지면 모델은 갑자기 집중력 있고 정확하며 근거를 바탕으로 행동합니다.</p>
<p>이것은 모델이 '지쳐서'가 아니라 <strong>컨텍스트가 썩어가는</strong> 것입니다. 대화가 늘어날수록 모델은 더 많은 정보를 처리해야 하고 우선순위를 정하는 능력은 서서히 저하됩니다. <a href="https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents">앤트로픽 연구에</a> 따르면 컨텍스트 창이 약 8K 토큰에서 128K로 늘어나면 검색 정확도가 15~30%까지 떨어질 수 있습니다. 모델에는 여전히 여유가 있지만 중요한 것을 추적하지 못합니다. 더 큰 컨텍스트 윈도우는 문제를 지연시키는 데 도움이 되지만 문제를 없애지는 못합니다.</p>
<p>이때 <strong>컨텍스트 엔지니어링이</strong> 필요합니다. 모델에 모든 것을 한꺼번에 전달하는 대신 중요한 부분만 검색하고, 더 이상 장황할 필요가 없는 내용을 압축하고, 모델이 추론할 수 있을 만큼 프롬프트와 도구를 깔끔하게 유지하는 등 모델에 표시되는 내용을 구체화합니다. 목표는 간단합니다. 중요한 정보만 적시에 제공하고 나머지는 무시하는 것입니다.</p>
<p>특히 장기 운영 에이전트의 경우 검색이 핵심적인 역할을 합니다. <a href="https://milvus.io/"><strong>Milvus와</strong></a> 같은 벡터 데이터베이스는 관련 지식을 효율적으로 다시 컨텍스트로 가져올 수 있는 기반을 제공하여 작업의 깊이와 복잡성이 증가하더라도 시스템을 안정적으로 유지할 수 있게 해줍니다.</p>
<p>이 블로그에서는 컨텍스트 로트가 발생하는 방식과 이를 관리하기 위해 팀이 사용하는 전략, 검색부터 프롬프트 디자인까지 긴 다단계 워크플로우에서 AI 에이전트의 성능을 유지하는 아키텍처 패턴에 대해 살펴봅니다.</p>
<h2 id="Why-Context-Rot-Happens" class="common-anchor-header">컨텍스트 로트가 발생하는 이유<button data-href="#Why-Context-Rot-Happens" class="anchor-icon" translate="no">
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
    </button></h2><p>사람들은 흔히 AI 모델에 더 많은 컨텍스트를 제공하면 당연히 더 나은 답변을 얻을 수 있다고 생각합니다. 하지만 실제로는 그렇지 않습니다. 인지 과학에 따르면 인간의 작업 기억은 대략 <strong>7±2개의</strong> 정보 <strong>덩어리를</strong> 저장할 수 있다고 합니다. 그 이상의 정보를 입력하면 세부 정보를 잊어버리거나 흐릿하게 기억하거나 잘못 해석하기 시작합니다.</p>
<p>LLM은 훨씬 더 큰 규모와 더 극적인 실패 모드를 가지고 있을 뿐 비슷한 행동을 보입니다.</p>
<p>근본적인 문제는 <a href="https://zilliz.com/learn/decoding-transformer-models-a-study-of-their-architecture-and-underlying-principles">트랜스포머 아키텍처</a> 자체에서 비롯됩니다. 모든 토큰은 다른 모든 토큰과 자신을 비교해야 하며, 전체 시퀀스에서 쌍으로 주의 관계를 형성해야 합니다. 즉, 컨텍스트 길이에 따라 계산이 <strong>O(n²</strong> )만큼 증가합니다. 프롬프트를 1,000개의 토큰에서 100,000개로 확장한다고 해서 모델이 "더 열심히 작동"하는 것이 아니라 토큰 상호 작용의 수가 <strong>10,000배로</strong> 증가합니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/contextual_dilution_622033db72.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>그리고 훈련 데이터에 문제가 있습니다.</strong> 모델은 긴 시퀀스보다 짧은 시퀀스를 훨씬 더 많이 보게 됩니다. 따라서 LLM에 매우 큰 컨텍스트에 걸쳐 작동하도록 요청하면 학습되지 않은 체제로 밀어 넣는 것입니다. 실제로 매우 긴 컨텍스트 추론은 대부분의 모델에 <strong>적용되지</strong> 않는 경우가 많습니다.</p>
<p>이러한 한계에도 불구하고 긴 문맥은 이제 피할 수 없습니다. 초기의 LLM 애플리케이션은 대부분 분류, 요약 또는 단순 생성 같은 단일 턴 작업이었습니다. 오늘날 엔터프라이즈 AI 시스템의 70% 이상은 여러 차례의 상호 작용에 걸쳐 활성 상태를 유지하며 분기되는 다단계 워크플로우를 관리하는 에이전트에 의존하고 있습니다. 수명이 긴 세션은 이제 예외에서 기본으로 바뀌었습니다.</p>
<p>그렇다면 다음 질문은 <strong>어떻게 하면 모델에 부담을 주지 않고 집중력을 유지할 수 있을까요?</strong></p>
<h2 id="Context-Retrieval-Approaches-to-Solving-Context-Rot" class="common-anchor-header">컨텍스트 로트를 해결하기 위한 컨텍스트 검색 접근 방식<button data-href="#Context-Retrieval-Approaches-to-Solving-Context-Rot" class="anchor-icon" translate="no">
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
    </button></h2><p>검색은 컨텍스트 로트를 해결할 수 있는 가장 효과적인 수단 중 하나이며, 실제로는 다양한 각도에서 컨텍스트 로트를 해결하는 상호 보완적인 패턴으로 나타나는 경향이 있습니다.</p>
<h3 id="1-Just-in-Time-Retrieval-Reducing-Unnecessary-Context" class="common-anchor-header">1. 적시 검색: 불필요한 컨텍스트 줄이기</h3><p>컨텍스트 로트의 주요 원인 중 하나는 아직 필요하지 않은 정보로 모델에 <em>과부하가</em> 걸리는 것입니다. Claude Code(앤트로픽의 코딩 어시스턴트)는 모델이 관련성이 있을 때만 정보를 가져오는 전략인 <strong>JIT(Just-in-Time) 검색을</strong> 통해 이 문제를 해결합니다.</p>
<p>전체 코드베이스 또는 데이터세트를 컨텍스트에 채우는 대신(이는 드리프트 및 잊어버릴 가능성을 크게 높임) Claude Code는 파일 경로, 명령, 문서 링크와 같은 작은 인덱스를 유지합니다. 모델에 특정 정보가 필요할 때, 그 이전이 <strong>아니라 중요한 순간에</strong>특정 항목을 검색하여 컨텍스트에 삽입합니다.</p>
<p>예를 들어 클로드 코드에 10GB 데이터베이스를 분석하라고 요청하면 전체 데이터베이스를 로드하려고 시도하지 않습니다. 엔지니어처럼 작동합니다:</p>
<ol>
<li><p>SQL 쿼리를 실행하여 데이터 세트의 상위 수준 요약을 가져옵니다.</p></li>
<li><p><code translate="no">head</code> 및 <code translate="no">tail</code> 같은 명령을 사용해 샘플 데이터를 보고 구조를 이해합니다.</p></li>
<li><p>컨텍스트 내에서 주요 통계나 샘플 행과 같은 가장 중요한 정보만 유지합니다.</p></li>
</ol>
<p>컨텍스트에서 유지되는 항목을 최소화함으로써, JIT 검색은 부패의 원인이 되는 관련 없는 토큰이 쌓이는 것을 방지합니다. 모델은 현재 추론 단계에 필요한 정보만 보기 때문에 집중력을 유지할 수 있습니다.</p>
<h3 id="2-Pre-retrieval-Vector-Search-Preventing-Context-Drift-Before-It-Starts" class="common-anchor-header">2. 사전 검색(벡터 검색): 시작하기 전에 컨텍스트 드리프트 방지</h3><p>고객 지원, Q&amp;A 시스템, 상담원 워크플로우 등 모델에서 동적으로 정보를 '요청'할 수 없는 경우가 종종 있는데, 이러한 경우 생성 시작 <em>전에</em> 적절한 지식이 필요한 경우가 많습니다. 바로 이때 <strong>사전 검색이</strong> 중요해집니다.</p>
<p>모델에 대량의 원시 텍스트 더미를 전달하고 중요한 내용을 분류하도록 기대하기 때문에 컨텍스트 썩음이 종종 발생합니다. 사전 검색은 이를 뒤집습니다. 벡터 데이터베이스(예: <a href="https://milvus.io/">Milvus</a> 및 <a href="https://zilliz.com/cloud">Zilliz Cloud</a>)는 추론 <em>전에</em> 가장 관련성이 높은 부분을 식별하여 가치가 높은 컨텍스트만 모델에 도달하도록 보장합니다.</p>
<p>일반적인 RAG 설정에서는</p>
<ul>
<li><p>문서가 Milvus와 같은 벡터 데이터베이스에 임베드되어 저장됩니다.</p></li>
<li><p>쿼리 시 시스템이 유사성 검색을 통해 관련성이 높은 작은 청크 세트를 검색합니다.</p></li>
<li><p>이러한 청크만 모델의 컨텍스트로 이동합니다.</p></li>
</ul>
<p>이는 두 가지 방식으로 부패를 방지합니다:</p>
<ul>
<li><p><strong>노이즈 감소:</strong> 관련성이 없거나 관련성이 약한 텍스트는 애초에 컨텍스트에 포함되지 않습니다.</p></li>
<li><p><strong>효율성:</strong> 모델은 훨씬 적은 수의 토큰을 처리하므로 필수적인 세부 정보를 놓칠 가능성이 줄어듭니다.</p></li>
</ul>
<p>Milvus는 밀리초 단위로 수백만 개의 문서를 검색할 수 있으므로 지연 시간이 중요한 라이브 시스템에 이상적입니다.</p>
<h3 id="3-Hybrid-JIT-and-Vector-Retrieval" class="common-anchor-header">3. 하이브리드 JIT 및 벡터 검색</h3><p>벡터 검색 기반 사전 검색은 모델이 크기가 큰 원시 텍스트가 아닌 고신호 정보로 시작하도록 함으로써 컨텍스트 로트의 상당 부분을 해결합니다. 하지만 앤서픽은 팀이 종종 간과하는 두 가지 실제 과제를 강조합니다:</p>
<ul>
<li><p><strong>바로 적시성입니다:</strong> 벡터 인덱스가 재구축되는 속도보다 지식창고가 더 빨리 업데이트되면 모델이 오래된 정보에 의존할 수 있습니다.</p></li>
<li><p><strong>정확성:</strong> 작업을 시작하기 전에는 특히 다단계 또는 탐색적 워크플로우의 경우 모델에 무엇이 필요한지 정확히 예측하기가 어렵습니다.</p></li>
</ul>
<p>따라서 실제 워크로드에서는 하이브리드 어파오치가 최적의 솔루션입니다.</p>
<ul>
<li><p>안정적이고 신뢰도 높은 지식을 위한 벡터 검색</p></li>
<li><p>진화하거나 작업 도중에만 관련성이 있는 정보에 대한 에이전트 중심의 JIT 탐색</p></li>
</ul>
<p>이 두 가지 접근 방식을 혼합하면 알려진 정보에 대한 벡터 검색의 속도와 효율성을 높이고, 관련성이 높아질 때마다 모델이 새로운 데이터를 발견하고 로드할 수 있는 유연성을 확보할 수 있습니다.</p>
<p>실제 시스템에서 어떻게 작동하는지 살펴봅시다. 프로덕션 문서 도우미를 예로 들어 보겠습니다. 대부분의 팀은 결국 2단계 파이프라인을 사용합니다: Milvus 기반 벡터 검색 + 에이전트 기반 JIT 검색.</p>
<p><strong>1. Milvus 기반 벡터 검색(사전 검색)</strong></p>
<ul>
<li><p>문서, API 참조, 변경 로그 및 알려진 이슈를 임베딩으로 변환하세요.</p></li>
<li><p>제품 영역, 버전, 업데이트 시간 등의 메타데이터와 함께 Milvus Vector 데이터베이스에 저장하세요.</p></li>
<li><p>사용자가 질문을 하면 시맨틱 검색을 실행하여 상위 K개의 관련 세그먼트를 가져옵니다.</p></li>
</ul>
<p>이렇게 하면 약 80%의 일상적인 쿼리를 500ms 이내에 해결하여 모델에 강력하고 컨텍스트에 영향을 받지 않는 시작점을 제공합니다.</p>
<p><strong>2. 에이전트 기반 탐색</strong></p>
<p>초기 검색으로 충분하지 않은 경우(예: 사용자가 매우 구체적이거나 시간에 민감한 정보를 요청하는 경우) 상담원은 도구를 호출하여 새로운 정보를 가져올 수 있습니다:</p>
<ul>
<li><p><code translate="no">search_code</code> 을 사용하여 코드베이스에서 특정 함수나 파일을 찾습니다.</p></li>
<li><p><code translate="no">run_query</code> 을 사용하여 데이터베이스에서 실시간 데이터를 가져옵니다.</p></li>
<li><p><code translate="no">fetch_api</code> 을 사용하여 최신 시스템 상태 가져오기</p></li>
</ul>
<p>이러한 호출은 일반적으로 <strong>3~5초</strong> 정도 걸리지만 시스템이 미처 예상하지 못한 질문에도 항상 새롭고 정확하며 관련성 있는 데이터로 모델이 작동하도록 보장합니다.</p>
<p>이러한 하이브리드 구조는 컨텍스트가 시의적절하고 정확하며 업무별로 유지되도록 보장하여 장기적인 상담원 워크플로우에서 컨텍스트 부패의 위험을 획기적으로 줄여줍니다.</p>
<p>Milvus는 이러한 하이브리드 시나리오에서 특히 다음과 같은 기능을 지원하기 때문에 효과적입니다:</p>
<ul>
<li><p><strong>벡터 검색 + 스칼라 필터링</strong>, 시맨틱 관련성과 구조화된 제약 조건의 결합</p></li>
<li><p><strong>증분 업데이트를</strong> 통해 다운타임 없이 임베딩을 새로 고칠 수 있습니다.</p></li>
</ul>
<p>따라서 Milvus는 의미론적 이해와 검색 대상에 대한 정밀한 제어가 모두 필요한 시스템에 이상적인 백본입니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/milvus_in_hybrid_architecture_7d4e391aa4.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>예를 들어 다음과 같은 쿼리를 실행할 수 있습니다:</p>
<pre><code translate="no"><span class="hljs-comment"># You can combine queries like this in Milvus</span>
collection.search(
    data=[query_embedding],  <span class="hljs-comment"># Semantic similarity</span>
    anns_field=<span class="hljs-string">&quot;embedding&quot;</span>,
    param={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;COSINE&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;nprobe&quot;</span>: <span class="hljs-number">10</span>}},
    expr=<span class="hljs-string">&quot;doc_type == &#x27;API&#x27; and update_time &gt; &#x27;2025-01-01&#x27;&quot;</span>,  <span class="hljs-comment"># Structured filtering</span>
    limit=<span class="hljs-number">5</span>
)
<button class="copy-code-btn"></button></code></pre>
<h2 id="How-to-Choose-the-Right-Approach-for-Dealing-With-Context-Rot" class="common-anchor-header">컨텍스트 로트를 처리하기 위한 올바른 접근 방식을 선택하는 방법<button data-href="#How-to-Choose-the-Right-Approach-for-Dealing-With-Context-Rot" class="anchor-icon" translate="no">
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
    </button></h2><p>벡터 검색 사전 검색, 적시 검색, 하이브리드 검색을 모두 사용할 수 있는 상황에서 자연스러운 질문은 <strong>어떤 것을 사용해야 할까요?</strong></p>
<p>다음은 지식의 <em>안정성과</em> 모델의 정보 요구 사항을 얼마나 <em>예측 가능한지에</em> 따라 선택하는 간단하지만 실용적인 방법입니다.</p>
<h3 id="1-Vector-Search-→-Best-for-Stable-Domains" class="common-anchor-header">1. 벡터 검색 → 안정적인 도메인에 적합</h3><p>금융, 법률 업무, 규정 준수, 의료 문서 등 도메인의 변화는 느리지만 정밀성이 요구되는 경우라면 <strong>사전 검색</strong> 기능이 있는 Milvus 기반 지식 베이스가 적합합니다.</p>
<p>정보가 잘 정의되어 있고 업데이트가 빈번하지 않으며 대부분의 질문은 의미적으로 관련된 문서를 미리 검색하여 답을 찾을 수 있습니다.</p>
<p><strong>예측 가능한 작업 + 안정적인 지식 → 사전 검색.</strong></p>
<h3 id="2-Just-in-Time-Retrieval-→-Best-for-Dynamic-Exploratory-Workflows" class="common-anchor-header">2. 적시 검색 → 동적, 탐색적 워크플로우에 적합</h3><p>소프트웨어 엔지니어링, 디버깅, 분석, 데이터 과학과 같은 분야에서는 새로운 파일, 새로운 데이터, 새로운 배포 상태 등 급변하는 환경이 수시로 발생합니다. 모델은 작업을 시작하기 전에 무엇이 필요한지 예측할 수 없습니다.</p>
<p><strong>예측할 수 없는 작업 + 빠르게 변화하는 지식 → 적시 검색.</strong></p>
<h3 id="3-Hybrid-Approach-→-When-Both-Conditions-Are-True" class="common-anchor-header">3. 하이브리드 접근 방식 → 두 조건이 모두 해당되는 경우</h3><p>실제 시스템 중에는 순전히 안정적이거나 순전히 동적이지 않은 경우가 많습니다. 예를 들어, 개발자 문서는 느리게 변경되는 반면 프로덕션 환경의 상태는 시시각각 변합니다. 하이브리드 접근 방식을 사용하면 다음과 같이 할 수 있습니다:</p>
<ul>
<li><p>벡터 검색을 사용하여 알려진 안정적인 지식을 로드(빠르고 지연 시간이 짧음)</p></li>
<li><p>온디맨드 상담원 도구를 사용하여 동적 정보 가져오기(정확하고 최신 정보)</p></li>
</ul>
<p><strong>혼합 지식 + 혼합 작업 구조 → 하이브리드 검색 방식.</strong></p>
<h2 id="What-if-the-Context-Window-Still-Isn’t-Enough" class="common-anchor-header">컨텍스트 창이 여전히 충분하지 않은 경우<button data-href="#What-if-the-Context-Window-Still-Isn’t-Enough" class="anchor-icon" translate="no">
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
    </button></h2><p>컨텍스트 엔지니어링은 과부하를 줄이는 데 도움이 되지만 때로는 더 근본적인 문제, 즉 세심하게 다듬어도 <strong>작업이 맞지 않는</strong> 경우가 있습니다.</p>
<p>대규모 코드베이스 마이그레이션, 다중 리포지토리 아키텍처 검토, 심층 연구 보고서 생성 등 특정 워크플로우에서는 모델이 작업의 끝에 도달하기 전에 컨텍스트 창이 20만 개 이상 초과될 수 있습니다. 벡터 검색이 많은 작업을 수행하더라도 일부 작업에는 보다 지속적이고 구조화된 메모리가 필요합니다.</p>
<p>최근 Anthropic은 세 가지 실용적인 전략을 제시했습니다.</p>
<h3 id="1-Compression-Preserve-Signal-Drop-Noise" class="common-anchor-header">1. 압축: 신호 보존, 노이즈 제거</h3><p>컨텍스트 창이 한계에 가까워지면 모델은 <strong>이전의 상호작용을</strong> 간결한 요약으로 압축할 수 있습니다. 좋은 압축은 다음을 유지합니다.</p>
<ul>
<li><p>주요 의사 결정</p></li>
<li><p>제약 조건 및 요구 사항</p></li>
<li><p>미해결 문제</p></li>
<li><p>관련 샘플 또는 예제</p></li>
</ul>
<p>그리고 제거합니다:</p>
<ul>
<li><p>자세한 도구 출력</p></li>
<li><p>관련 없는 로그</p></li>
<li><p>중복 단계</p></li>
</ul>
<p>문제는 균형입니다. 너무 공격적으로 압축하면 모델에서 중요한 정보가 손실되고, 너무 가볍게 압축하면 공간이 거의 확보되지 않습니다. 효과적인 압축은 "왜"와 "무엇을"은 유지하면서 "어떻게 여기까지 왔는지"는 버립니다.</p>
<h3 id="2-Structured-Note-Taking-Move-Stable-Information-Outside-Context" class="common-anchor-header">2. 구조화된 노트 필기: 안정적인 정보를 컨텍스트 외부로 이동</h3><p>시스템은 모든 것을 모델 창 안에 보관하는 대신 중요한 사실을 <strong>외부 메모리(</strong>별도의 데이터베이스 또는 상담원이 필요에 따라 쿼리할 수 있는 구조화된 저장소)에 저장할 수 있습니다.</p>
<p>예를 들어 클로드의 포켓몬 에이전트 프로토타입은 다음과 같은 영구적인 사실을 저장합니다:</p>
<ul>
<li><p><code translate="no">Pikachu leveled up to 8</code></p></li>
<li><p><code translate="no">Trained 1234 steps on Route 1</code></p></li>
<li><p><code translate="no">Goal: reach level 10</code></p></li>
</ul>
<p>반면 일시적인 세부 정보(전투 로그, 긴 도구 출력)는 활성 컨텍스트 외부에 보관합니다. 이는 사람이 노트를 사용하는 방식과 유사합니다. 우리는 모든 세부 사항을 작업 기억에 저장하지 않고 참조 지점을 외부에 저장했다가 필요할 때 찾아봅니다.</p>
<p>구조화된 메모 작성은 반복되는 불필요한 세부 사항으로 인한 컨텍스트 부패를 방지하는 동시에 모델에 신뢰할 수 있는 진실의 출처를 제공합니다.</p>
<h3 id="3-Sub-Agent-Architecture-Divide-and-Conquer-Large-Tasks" class="common-anchor-header">3. 서브 에이전트 아키텍처: 대규모 작업의 분할 및 정복</h3><p>복잡한 작업의 경우, 리드 에이전트가 전체 작업을 감독하고 여러 전문 하위 에이전트가 작업의 특정 측면을 처리하는 다중 에이전트 아키텍처를 설계할 수 있습니다. 이러한 하위 에이전트는 하위 작업과 관련된 대량의 데이터를 심층적으로 분석하지만 간결하고 필수적인 결과만 반환합니다. 이 접근 방식은 일반적으로 연구 보고서나 데이터 분석과 같은 시나리오에서 사용됩니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/longduration_task_cbbc07b9ca.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>실제로는 압축과 결합된 단일 에이전트를 사용해 작업을 처리하는 것으로 시작하는 것이 가장 좋습니다. 외부 스토리지는 여러 세션에 걸쳐 메모리를 유지해야 하는 경우에만 도입해야 합니다. 다중 에이전트 아키텍처는 복잡하고 전문적인 하위 작업의 병렬 처리가 진정으로 필요한 작업을 위해 예약해야 합니다.</p>
<p>각 접근 방식은 컨텍스트 창을 날려버리지 않고 컨텍스트 로트를 유발하지 않으면서 시스템의 효과적인 '작업 메모리'를 확장합니다.</p>
<h2 id="Best-Practices-for-Designing-Context-That-Actually-Works" class="common-anchor-header">실제로 작동하는 컨텍스트 설계를 위한 모범 사례<button data-href="#Best-Practices-for-Designing-Context-That-Actually-Works" class="anchor-icon" translate="no">
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
    </button></h2><p>컨텍스트 오버플로를 처리한 후, 마찬가지로 중요한 또 다른 부분이 있습니다: 컨텍스트가 처음에 어떻게 구축되는지입니다. 압축, 외부 메모, 하위 에이전트를 사용하더라도 프롬프트와 도구 자체가 길고 복잡한 추론을 지원하도록 설계되지 않았다면 시스템은 어려움을 겪을 것입니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/System_Prompts_cf655dcd0d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Anthropic은 이를 하나의 프롬프트 작성 연습이 아닌 세 가지 레이어에 걸쳐 컨텍스트를 구축하는 것으로 생각하는 데 유용한 방법을 제공합니다.</p>
<h3 id="System-Prompts-Find-the-Goldilocks-Zone" class="common-anchor-header"><strong>시스템 프롬프트: 골디락스 영역 찾기</strong></h3><p>대부분의 시스템 프롬프트는 극단적인 경우 실패합니다. 규칙 목록, 중첩된 조건, 하드코딩된 예외 등 세부 사항이 너무 많으면 프롬프트가 깨지기 쉽고 유지 관리가 어렵습니다. 구조가 너무 적으면 모델이 무엇을 해야 할지 추측할 수밖에 없습니다.</p>
<p>가장 좋은 프롬프트는 행동을 안내할 수 있을 만큼 구조화되어 있으면서 모델이 추론할 수 있을 만큼 유연성이 있는 중간 정도에 위치합니다. 실제로 이는 모델에게 명확한 역할, 일반적인 워크플로, 간단한 도구 안내, 그 이상도 이하도 아닌 그 중간 정도만 제공한다는 의미입니다.</p>
<p>예를 들어</p>
<pre><code translate="no">You are a technical documentation assistant serving developers.
<span class="hljs-number">1.</span> Start <span class="hljs-keyword">by</span> retrieving relevant documents <span class="hljs-keyword">from</span> the Milvus knowledge <span class="hljs-keyword">base</span>.  
<span class="hljs-number">2.</span> If the retrieval results are insufficient, use the `search_code` tool to perform a deeper search <span class="hljs-keyword">in</span> the codebase.  
<span class="hljs-number">3.</span> When answering, cite specific documentation sections <span class="hljs-keyword">or</span> code line numbers.

<span class="hljs-meta">## Tool guidance</span>
- search_docs: Used <span class="hljs-keyword">for</span> semantic retrieval, best <span class="hljs-keyword">for</span> conceptual questions.  
- search_code: Used <span class="hljs-keyword">for</span> precise lookup <span class="hljs-keyword">in</span> the codebase, best <span class="hljs-keyword">for</span> implementation-detail questions.  
…
<button class="copy-code-btn"></button></code></pre>
<p>이 프롬프트는 모델을 압도하거나 여기에 속하지 않는 동적 정보를 처리하도록 강요하지 않고 방향을 설정합니다.</p>
<h3 id="Tool-Design-Less-Is-More" class="common-anchor-header">도구 디자인: 적은 것이 더 많은 것</h3><p>시스템 프롬프트가 상위 수준의 동작을 설정하면 도구는 실제 운영 로직을 수행합니다. 도구 증강 시스템에서 의외로 흔히 발생하는 실패 모드는 도구가 너무 많거나 목적이 겹치는 도구가 있는 경우입니다.</p>
<p>좋은 경험 법칙입니다:</p>
<ul>
<li><p><strong>하나의 도구, 하나의 목적</strong></p></li>
<li><p><strong>명확하고 모호하지 않은 매개변수</strong></p></li>
<li><p><strong>중복되는 책임 없음</strong></p></li>
</ul>
<p>인간 엔지니어가 어떤 도구를 사용해야 할지 망설인다면 모델도 마찬가지입니다. 깔끔한 도구 설계는 모호성을 줄이고 인지 부하를 줄이며 불필요한 도구 시도로 인해 컨텍스트가 복잡해지는 것을 방지합니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/tooling_complexity_7d2bb60c54.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Dynamic-Information-Should-Be-Retrieved-Not-Hardcoded" class="common-anchor-header">동적 정보는 하드코딩이 아니라 검색해야 합니다.</h3><p>마지막 레이어는 간과하기 가장 쉬운 레이어입니다. 상태 값, 최근 업데이트 또는 사용자별 상태와 같이 동적이거나 시간에 민감한 정보는 시스템 프롬프트에 전혀 표시되지 않아야 합니다. 이러한 정보를 프롬프트에 넣으면 오랜 작업으로 인해 오래되거나 부풀어 오르거나 모순이 생길 수 있습니다.</p>
<p>대신 이 정보는 필요할 때만 검색이나 상담원 툴을 통해 가져와야 합니다. 시스템 프롬프트에서 동적 콘텐츠를 제외하면 컨텍스트 부패를 방지하고 모델의 추론 공간을 깔끔하게 유지할 수 있습니다.</p>
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
    </button></h2><p>AI 에이전트가 다양한 산업 분야의 프로덕션 환경으로 이동함에 따라 이전보다 더 긴 워크플로우와 더 복잡한 작업을 수행하게 되었습니다. 이러한 환경에서는 컨텍스트 관리가 현실적으로 필수적인 요소가 되었습니다.</p>
<p><strong>하지만 컨텍스트 창이 크다고 해서 자동으로 더 나은 결과가 나오는 것은 아니며</strong>, 오히려 그 반대의 경우가 많습니다. 모델에 과부하가 걸리거나, 오래된 정보를 입력하거나, 많은 프롬프트를 강요하면 정확도가 조용히 떨어집니다. 이러한 느리고 미묘한 성능 저하를 우리는 이제 <strong>컨텍스트 로트라고</strong> 부릅니다.</p>
<p>JIT 검색, 사전 검색, 하이브리드 파이프라인, 벡터 데이터베이스 기반 시맨틱 검색과 같은 기술은 모두 같은 목표, 즉 <strong>모델이 더도 말고 덜도 말고 적시에 올바른 정보를 보고 신뢰할 수 있는 답변을 생성할 수 있도록</strong> 하는 것을 목표로 <strong>합니다.</strong></p>
<p>오픈 소스 고성능 벡터 데이터베이스인 <a href="https://milvus.io/"><strong>Milvus는</strong></a> 이러한 워크플로우의 핵심에 위치합니다. 지식을 효율적으로 저장하고 가장 관련성이 높은 부분을 짧은 지연 시간으로 검색할 수 있는 인프라를 제공합니다. JIT 검색 및 기타 상호 보완적인 전략과 함께 Milvus는 AI 에이전트가 작업이 더욱 심층적이고 역동적으로 진행됨에 따라 정확성을 유지할 수 있도록 지원합니다.</p>
<p>하지만 검색은 퍼즐의 한 조각일 뿐입니다. 좋은 프롬프트 디자인, 깔끔하고 최소한의 도구 세트, 압축, 구조화된 메모, 하위 에이전트 등 합리적인 오버플로 전략이 모두 함께 작동하여 모델이 장기적인 세션에서 집중력을 유지할 수 있도록 합니다. 이것이 바로 영리한 해킹이 아니라 사려 깊은 아키텍처를 통한 진정한 컨텍스트 엔지니어링의 모습입니다.</p>
<p>몇 시간, 며칠 또는 전체 워크플로우에 걸쳐 정확성을 유지하는 AI 에이전트를 원한다면 스택의 다른 핵심 부분과 마찬가지로 컨텍스트에도 동일한 주의를 기울여야 합니다.</p>
<p>궁금한 점이 있거나 기능에 대해 자세히 알아보고 싶으신가요?<a href="https://discord.com/invite/8uyFbECzPX"> Discord 채널에</a> 참여하거나<a href="https://github.com/milvus-io/milvus"> GitHub에</a> 이슈를 제출하세요.<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus 오피스 아워를</a> 통해 20분간의 일대일 세션을 예약하여 인사이트, 안내 및 질문에 대한 답변을 얻을 수도 있습니다.</p>
