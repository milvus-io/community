---
id: >-
  beyond-context-overload-how-parlant-milvus-brings-control-and-clarity-to-llm-agent-behavior.md
title: '컨텍스트 과부하를 넘어서: Parlant × Milvus가 LLM 에이전트 행동에 제어와 명확성을 제공하는 방법'
author: Min Yin
date: 2025-11-05T00:00:00.000Z
cover: assets.zilliz.com/parlant_cover1_466dc0fe21.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Parlant, Milvus, AI agents, vector database, LLM'
meta_title: How Parlant × Milvus Brings Control to LLM Agent Behavior
desc: >-
  Parlant × Milvus가 정렬 모델링과 벡터 인텔리전스를 사용하여 LLM 에이전트 동작을 제어 가능하고, 설명 가능하며, 프로덕션에
  바로 적용할 수 있도록 만드는 방법을 알아보세요.
origin: >-
  https://milvus.io/blog/beyond-context-overload-how-parlant-milvus-brings-control-and-clarity-to-llm-agent-behavior.md
---
<p>200개의 비즈니스 규칙, 50개의 도구, 30개의 데모가 포함된 작업을 완료하라는 지시를 받았는데 시간이 한 시간밖에 없다고 상상해 보세요. 불가능에 가까운 일입니다. 하지만 우리는 종종 대규모 언어 모델을 '에이전트'로 전환하고 지침으로 과부하를 주면 정확히 그렇게 할 수 있을 것으로 기대합니다.</p>
<p>실제로 이러한 접근 방식은 금방 무너집니다. LangChain이나 LlamaIndex와 같은 기존의 에이전트 프레임워크는 모든 규칙과 도구를 모델의 컨텍스트에 한 번에 주입하기 때문에 규칙 충돌, 컨텍스트 과부하, 프로덕션에서 예측할 수 없는 동작으로 이어집니다.</p>
<p>이 문제를 해결하기 위해 최근<a href="https://github.com/emcie-co/parlant?utm_source=chatgpt.com"> <strong>Parlant라는</strong></a> 오픈 소스 에이전트 프레임워크가 GitHub에서 주목을 받고 있습니다. 이 프레임워크는 에이전트 행동을 훨씬 더 제어 가능하고 설명할 수 있도록 하는 감독 메커니즘 및 조건부 전환과 함께 정렬 모델링이라는 새로운 접근 방식을 도입합니다.</p>
<p>오픈 소스 벡터 데이터베이스인 <a href="https://milvus.io/"><strong>Milvus와</strong></a> 함께 사용하면 Parlant의 기능이 더욱 향상됩니다. Milvus는 시맨틱 인텔리전스를 추가하여 상담원이 가장 관련성이 높은 규칙과 컨텍스트를 실시간으로 동적으로 검색하여 정확하고 효율적이며 프로덕션에 바로 사용할 수 있도록 지원합니다.</p>
<p>이 게시물에서는 Parlant가 내부에서 어떻게 작동하는지, 그리고 이를 Milvus와 통합하여 프로덕션급을 구현하는 방법에 대해 살펴봅니다.</p>
<h2 id="Why-Traditional-Agent-Frameworks-Fall-Apart" class="common-anchor-header">기존 에이전트 프레임워크가 실패하는 이유<button data-href="#Why-Traditional-Agent-Frameworks-Fall-Apart" class="anchor-icon" translate="no">
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
    </button></h2><p>기존 에이전트 프레임워크는 수백 개의 규칙, 수십 개의 툴, 몇 개의 데모 등 모든 것을 하나의 과대 포장된 프롬프트에 집어넣어 큰 것을 좋아합니다. 데모나 소규모 샌드박스 테스트에서는 훌륭해 보일 수 있지만 일단 프로덕션에 적용하면 금방 결함이 드러나기 시작합니다.</p>
<ul>
<li><p><strong>상충되는 규칙은 혼란을 가져옵니다:</strong> 두 개 이상의 규칙이 동시에 적용되는 경우, 이러한 프레임워크에는 어떤 규칙이 승리할지 결정하는 기본 제공 방법이 없습니다. 때로는 한 가지를 선택하기도 합니다. 때로는 두 가지를 혼합하기도 합니다. 때로는 전혀 예측할 수 없는 일을 하기도 합니다.</p></li>
<li><p><strong>엣지 케이스는 격차를 드러냅니다:</strong> 사용자가 할 수 있는 모든 말을 예측할 수는 없습니다. 그리고 모델이 학습 데이터를 벗어난 상황에 부딪히면 기본적으로 일반적이고 확정적이지 않은 답변으로 돌아갑니다.</p></li>
<li><p><strong>디버깅은 힘들고 비용이 많이 듭니다:</strong> 에이전트가 오작동을 하면 어떤 규칙이 문제를 일으켰는지 정확히 파악하는 것은 거의 불가능합니다. 모든 것이 하나의 거대한 시스템 프롬프트 안에 있기 때문에 문제를 해결할 수 있는 유일한 방법은 프롬프트를 다시 작성하고 모든 것을 처음부터 다시 테스트하는 것입니다.</p></li>
</ul>
<h2 id="What-is-Parlant-and-How-It-Works" class="common-anchor-header">Parlant란 무엇이며 어떻게 작동하나요?<button data-href="#What-is-Parlant-and-How-It-Works" class="anchor-icon" translate="no">
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
    </button></h2><p>Parlant는 LLM 에이전트를 위한 오픈 소스 정렬 엔진입니다. 구조화된 규칙 기반 방식으로 의사 결정 프로세스를 모델링하여 다양한 시나리오에서 에이전트의 작동 방식을 정확하게 제어할 수 있습니다.</p>
<p>기존 에이전트 프레임워크에서 발견되는 문제를 해결하기 위해 Parlant는 새롭고 강력한 접근 방식을 도입했습니다: <strong>바로 정렬 모델링입니다</strong>. 이 접근법의 핵심은 규칙 정의와 규칙 실행을 분리하여 주어진 시간에 가장 관련성이 높은 규칙만 LLM의 컨텍스트에 주입되도록 하는 것입니다.</p>
<h3 id="Granular-Guidelines-The-Core-of-Alignment-Modeling" class="common-anchor-header">세분화된 가이드라인: 정렬 모델링의 핵심</h3><p>Parlant의 정렬 모델의 핵심은 세분화된 <strong>지침이라는</strong> 개념입니다. 규칙으로 가득 찬 하나의 거대한 시스템 프롬프트를 작성하는 대신 상담원이 특정 유형의 상황을 어떻게 처리해야 하는지를 설명하는 작은 모듈식 가이드라인을 정의합니다.</p>
<p>각 가이드라인은 세 부분으로 구성됩니다:</p>
<ul>
<li><p><strong>조건</strong> - 규칙이 언제 적용되어야 하는지에 대한 자연어 설명입니다. Parlant는 이 조건을 시맨틱 벡터로 변환하고 사용자의 입력과 일치시켜 관련성이 있는지 파악합니다.</p></li>
<li><p><strong>액션</strong> - 조건이 충족되면 상담원이 어떻게 응답해야 하는지를 정의하는 명확한 지침입니다. 이 액션은 트리거될 때만 LLM의 컨텍스트에 주입됩니다.</p></li>
<li><p><strong>도구</strong> - 특정 규칙에 연결된 모든 외부 함수 또는 API입니다. 이러한 도구는 가이드라인이 활성화되어 있을 때만 상담원에게 노출되며, 도구 사용을 제어하고 컨텍스트를 인식합니다.</p></li>
</ul>
<pre><code translate="no"><span class="hljs-keyword">await</span> agent.<span class="hljs-title function_">create_guideline</span>(
    condition=<span class="hljs-string">&quot;The user asks about a refund and the order amount exceeds 500 RMB&quot;</span>,
    action=<span class="hljs-string">&quot;First call the order status check tool to confirm whether the refund conditions are met, then provide a detailed explanation of the refund process&quot;</span>,
    tools=[check_order_status, calculate_refund_amount]
)
<button class="copy-code-btn"></button></code></pre>
<p>사용자가 상담원과 상호작용할 때마다 Parlant는 가벼운 매칭 단계를 실행하여 가장 관련성이 높은 3~5개의 가이드라인을 찾습니다. 이러한 규칙만 모델의 컨텍스트에 주입되어 프롬프트가 간결하고 집중력을 유지하면서 에이전트가 일관되게 올바른 규칙을 따르도록 합니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/guideline_system_652fb287ce.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Supervising-Mechanism-for-Accuracy-and-Consistency" class="common-anchor-header">정확성과 일관성을 위한 감독 메커니즘</h3><p>정확성과 일관성을 더욱 유지하기 위해 Parlant는 품질 관리의 두 번째 계층으로 작용하는 <strong>감독 메커니즘을</strong> 도입했습니다. 이 프로세스는 세 단계로 진행됩니다:</p>
<p><strong>1. 후보 응답 생성</strong> - 상담원이 일치하는 가이드라인과 현재 대화 컨텍스트를 기반으로 초기 응답을 생성합니다.</p>
<p><strong>2. 규정 준수 확인</strong> - 응답을 활성 가이드라인과 비교하여 모든 지침이 올바르게 준수되었는지 확인합니다.</p>
<p><strong>3. 수정 또는 확인</strong> - 문제가 발견되면 시스템에서 출력을 수정하고, 모든 것이 확인되면 응답이 승인되어 사용자에게 전송됩니다.</p>
<p>이 감독 메커니즘은 상담원이 규칙을 이해할 뿐만 아니라 실제로 규칙을 준수한 후에 답장하도록 하여 신뢰성과 통제력을 모두 향상시킵니다.</p>
<h3 id="Conditional-Transitions-for-Control-and-Safety" class="common-anchor-header">제어 및 안전을 위한 조건부 전환</h3><p>기존 에이전트 프레임워크에서는 사용 가능한 모든 툴이 항상 LLM에 노출됩니다. 이러한 '테이블 위의 모든 것' 접근 방식은 종종 과부하된 프롬프트와 의도하지 않은 도구 호출로 이어집니다. Parlant는 <strong>조건부 전환을</strong> 통해 이 문제를 해결합니다. 상태 머신의 작동 방식과 유사하게, 특정 조건이 충족될 때만 작업이나 도구가 트리거됩니다. 각 도구는 해당 가이드라인에 엄격하게 묶여 있으며, 해당 가이드라인의 조건이 활성화될 때만 사용할 수 있게 됩니다.</p>
<pre><code translate="no"><span class="hljs-comment"># The balance inquiry tool is exposed only when the condition &quot;the user wants to make a transfer&quot; is met</span>
<span class="hljs-keyword">await</span> agent.create_guideline(
    condition=<span class="hljs-string">&quot;The user wants to make a transfer&quot;</span>,
    action=<span class="hljs-string">&quot;First check the account balance. If the balance is below 500 RMB, remind the user that an overdraft fee may apply.&quot;</span>,
    tools=[get_user_account_balance]
)
<button class="copy-code-btn"></button></code></pre>
<p>이 메커니즘은 도구 호출을 조건부 전환으로 전환하여 트리거 조건이 충족될 때만 도구가 '비활성'에서 '활성'으로 이동합니다. 이러한 방식으로 실행을 구조화함으로써 Parlant는 모든 작업이 신중하고 상황에 맞게 이루어지도록 보장하여 오용을 방지하는 동시에 효율성과 시스템 안전성을 모두 개선합니다.</p>
<h2 id="How-Milvus-Powers-Parlant" class="common-anchor-header">Milvus가 Parlant를 지원하는 방법<button data-href="#How-Milvus-Powers-Parlant" class="anchor-icon" translate="no">
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
    </button></h2><p>Parlant의 가이드라인 매칭 프로세스의 내부를 살펴보면 한 가지 핵심적인 기술적 과제가 명확해집니다. 시스템이 수백, 수천 개의 옵션 중에서 어떻게 단 몇 밀리초 만에 가장 관련성이 높은 3~5개의 규칙을 찾을 수 있을까요? 바로 여기에 벡터 데이터베이스가 등장합니다. 시맨틱 검색이 이를 가능하게 합니다.</p>
<h3 id="How-Milvus-Supports-Parlant’s-Guideline-Matching-Process" class="common-anchor-header">Milvus가 Parlant의 가이드 라인 매칭 프로세스를 지원하는 방법</h3><p>가이드라인 매칭은 시맨틱 유사성을 통해 작동합니다. 각 가이드라인의 조건 필드는 벡터 임베딩으로 변환되어 문자 그대로의 텍스트가 아닌 그 의미를 포착합니다. 사용자가 메시지를 보내면 Parlant는 해당 메시지의 의미를 저장된 모든 가이드라인 임베딩과 비교하여 가장 관련성이 높은 임베딩을 찾습니다.</p>
<p>이 프로세스의 단계별 작동 방식은 다음과 같습니다:</p>
<p><strong>1. 쿼리 인코딩</strong> - 사용자의 메시지와 최근 대화 내역이 쿼리 벡터로 변환됩니다.</p>
<p><strong>2. 유사성 검색</strong> - 시스템이 가이드라인 벡터 저장소 내에서 유사성 검색을 수행하여 가장 가까운 일치 항목을 찾습니다.</p>
<p><strong>3. Top-K 결과 검색</strong> - 의미적으로 가장 연관성이 높은 상위 3~5개의 가이드라인이 반환됩니다.</p>
<p><strong>4. 컨텍스트에</strong> 삽입 - 이렇게 일치하는 가이드라인은 모델이 올바른 규칙에 따라 작동할 수 있도록 LLM의 컨텍스트에 동적으로 삽입됩니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/guideline_matching_process_ffd874c77e.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>이 워크플로우를 가능하게 하려면 벡터 데이터베이스가 고성능 ANN(근사 최인접 이웃) 검색, 유연한 메타데이터 필터링, 실시간 벡터 업데이트라는 세 가지 중요한 기능을 제공해야 합니다. 오픈 소스 클라우드 네이티브 벡터 데이터베이스인 <a href="https://milvus.io/"><strong>Milvus는</strong></a> 이 세 가지 영역 모두에서 프로덕션급 성능을 제공합니다.</p>
<p>실제 시나리오에서 Milvus가 어떻게 작동하는지 이해하기 위해 금융 서비스 에이전트를 예로 들어 보겠습니다.</p>
<p>시스템에서 계좌 조회, 자금 이체, 자산 관리 상품 상담 등의 업무를 다루는 800개의 비즈니스 지침을 정의한다고 가정해 보겠습니다. 이 설정에서 Milvus는 모든 지침 데이터의 저장 및 검색 레이어 역할을 합니다.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> connections, Collection, FieldSchema, CollectionSchema, DataType
<span class="hljs-keyword">import</span> parlant.sdk <span class="hljs-keyword">as</span> p

<span class="hljs-comment"># Connect to Milvus</span>
connections.connect(host=<span class="hljs-string">&quot;localhost&quot;</span>, port=<span class="hljs-string">&quot;19530&quot;</span>)

<span class="hljs-comment"># Define the schema for the guideline collection</span>
fields = [
    FieldSchema(name=<span class="hljs-string">&quot;guideline_id&quot;</span>, dtype=DataType.VARCHAR, max_length=<span class="hljs-number">100</span>, is_primary=<span class="hljs-literal">True</span>),
    FieldSchema(name=<span class="hljs-string">&quot;condition_vector&quot;</span>, dtype=DataType.FLOAT_VECTOR, dim=<span class="hljs-number">768</span>),
    FieldSchema(name=<span class="hljs-string">&quot;condition_text&quot;</span>, dtype=DataType.VARCHAR, max_length=<span class="hljs-number">1000</span>),
    FieldSchema(name=<span class="hljs-string">&quot;action_text&quot;</span>, dtype=DataType.VARCHAR, max_length=<span class="hljs-number">2000</span>),
    FieldSchema(name=<span class="hljs-string">&quot;priority&quot;</span>, dtype=DataType.INT64),
    FieldSchema(name=<span class="hljs-string">&quot;business_domain&quot;</span>, dtype=DataType.VARCHAR, max_length=<span class="hljs-number">50</span>)
]
schema = CollectionSchema(fields=fields, description=<span class="hljs-string">&quot;Agent Guidelines&quot;</span>)
guideline_collection = Collection(name=<span class="hljs-string">&quot;agent_guidelines&quot;</span>, schema=schema)

<span class="hljs-comment"># Create an HNSW index for high-performance retrieval</span>
index_params = {
    <span class="hljs-string">&quot;index_type&quot;</span>: <span class="hljs-string">&quot;HNSW&quot;</span>,
    <span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;COSINE&quot;</span>,
    <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;M&quot;</span>: <span class="hljs-number">16</span>, <span class="hljs-string">&quot;efConstruction&quot;</span>: <span class="hljs-number">200</span>}
}
guideline_collection.create_index(field_name=<span class="hljs-string">&quot;condition_vector&quot;</span>, index_params=index_params)
<button class="copy-code-btn"></button></code></pre>
<p>이제 사용자가 "어머니 계좌로 100,000위안을 이체하고 싶어요"라고 말하면 런타임 흐름은 다음과 같습니다:</p>
<p><strong>1. 쿼리 정규화</strong> - 사용자 입력을 768차원 벡터로 변환합니다.</p>
<p><strong>2. 하이브리드 검색</strong> - 메타데이터 필터링(예: <code translate="no">business_domain=&quot;transfer&quot;</code>)을 사용하여 Milvus에서 벡터 유사성 검색을 실행합니다.</p>
<p><strong>3. 결과 순위</strong> - <strong>우선순위</strong> 값과 결합된 유사도 점수를 기준으로 후보 가이드라인의 순위를 매깁니다.</p>
<p><strong>4. 컨텍스트 삽입</strong> - 일치하는 상위 3개 가이드라인의 <code translate="no">action_text</code> 을 Parlant 에이전트의 컨텍스트에 삽입합니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/bank_transfer_use_case_481d09a407.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>이 구성에서 Milvus는 가이드라인 라이브러리가 100,000개의 항목으로 확장되는 경우에도 15ms 미만의 P99 지연 시간을 제공합니다. 이에 비해 키워드 매칭에 기존의 관계형 데이터베이스를 사용하면 일반적으로 지연 시간이 200ms를 초과하고 매칭 정확도가 현저히 낮아집니다.</p>
<h3 id="How-Milvus-Enables-Long-Term-Memory-and-Personalization" class="common-anchor-header">Milvus가 장기적인 메모리와 개인화를 지원하는 방법</h3><p>Milvus는 가이드 라인 매칭 그 이상의 기능을 제공합니다. 상담원에게 장기 기억과 개인화된 응답이 필요한 시나리오에서 Milvus는 사용자의 과거 상호작용을 벡터 임베딩으로 저장하고 검색하는 메모리 레이어 역할을 하여 상담원이 이전에 논의된 내용을 기억할 수 있도록 도와줍니다.</p>
<pre><code translate="no"><span class="hljs-comment"># store user’s past interactions</span>
user_memory_fields = [
    FieldSchema(name=<span class="hljs-string">&quot;interaction_id&quot;</span>, dtype=DataType.VARCHAR, max_length=<span class="hljs-number">100</span>, is_primary=<span class="hljs-literal">True</span>),
    FieldSchema(name=<span class="hljs-string">&quot;user_id&quot;</span>, dtype=DataType.VARCHAR, max_length=<span class="hljs-number">50</span>),
    FieldSchema(name=<span class="hljs-string">&quot;interaction_vector&quot;</span>, dtype=DataType.FLOAT_VECTOR, dim=<span class="hljs-number">768</span>),
    FieldSchema(name=<span class="hljs-string">&quot;interaction_summary&quot;</span>, dtype=DataType.VARCHAR, max_length=<span class="hljs-number">500</span>),
    FieldSchema(name=<span class="hljs-string">&quot;timestamp&quot;</span>, dtype=DataType.INT64)
]
memory_collection = Collection(name=<span class="hljs-string">&quot;user_memory&quot;</span>, schema=CollectionSchema(user_memory_fields))
<button class="copy-code-btn"></button></code></pre>
<p>동일한 사용자가 다시 방문하면 상담원은 Milvus에서 가장 관련성이 높은 과거 상호작용을 검색하여 보다 인간적인 경험을 제공하는 데 사용할 수 있습니다. 예를 들어 사용자가 지난주에 투자 펀드에 대해 질문했다면 상담원은 그 맥락을 기억하고 선제적으로 대응할 수 있습니다: "어서 오세요! 지난번에 말씀드렸던 펀드에 대해 아직 질문이 있으신가요?"와 같이 선제적으로 응답할 수 있습니다.</p>
<h3 id="How-to-Optimize-Performance-for-Milvus-Powered-Agent-Systems" class="common-anchor-header">Milvus 기반 에이전트 시스템의 성능을 최적화하는 방법</h3><p>프로덕션 환경에 Milvus 기반 에이전트 시스템을 배포할 때는 성능 튜닝이 매우 중요합니다. 짧은 지연 시간과 높은 처리량을 달성하려면 몇 가지 주요 매개 변수에 주의를 기울여야 합니다:</p>
<p><strong>1. 올바른 인덱스 유형 선택</strong></p>
<p>적절한 인덱스 구조를 선택하는 것이 중요합니다. 예를 들어, 정확도가 중요한 금융이나 의료와 같이 리콜 빈도가 높은 시나리오에는 HNSW(계층적 탐색이 가능한 작은 세계)가 이상적입니다. 전자 상거래 추천과 같은 대규모 애플리케이션의 경우, 빠른 성능과 메모리 사용량을 줄이는 대신 약간 낮은 리콜을 허용하는 IVF_FLAT이 더 효과적입니다.</p>
<p><strong>2. 샤딩 전략</strong></p>
<p>저장된 가이드라인의 항목 수가 100만 개를 초과하는 경우 <strong>파티션을</strong> 사용하여 데이터를 비즈니스 도메인 또는 사용 사례별로 분할하는 것이 좋습니다. 파티셔닝은 쿼리당 검색 공간을 줄여 검색 속도를 개선하고 데이터 세트가 증가하더라도 지연 시간을 안정적으로 유지합니다.</p>
<p><strong>3. 캐시 구성</strong></p>
<p>표준 고객 쿼리 또는 트래픽이 많은 워크플로우와 같이 자주 액세스하는 가이드라인의 경우 Milvus 쿼리 결과 캐싱을 사용할 수 있습니다. 이렇게 하면 시스템이 이전 결과를 재사용하여 반복 검색 시 대기 시간을 5밀리초 미만으로 단축할 수 있습니다.</p>
<h2 id="Hands-on-Demo-How-to-Build-a-Smart-QA-System-with-Parlant-and-Milvus-Lite" class="common-anchor-header">실습 데모: Parlant와 Milvus Lite로 스마트 Q&amp;A 시스템을 구축하는 방법<button data-href="#Hands-on-Demo-How-to-Build-a-Smart-QA-System-with-Parlant-and-Milvus-Lite" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus<a href="https://milvus.io/docs/install-overview.md">Lite는</a> 애플리케이션에 쉽게 임베드할 수 있는 Python 라이브러리인 Milvus의 경량 버전입니다. Jupyter 노트북과 같은 환경에서 빠르게 프로토타이핑하거나 컴퓨팅 리소스가 제한된 엣지 및 스마트 기기에서 실행하는 데 이상적입니다. 설치 공간은 작지만 Milvus Lite는 다른 Milvus 배포와 동일한 API를 지원합니다. 즉, Milvus Lite용으로 작성한 클라이언트 측 코드는 나중에 리팩토링 없이도 전체 Milvus 또는 Zilliz Cloud 인스턴스에 원활하게 연결할 수 있습니다.</p>
<p>이 데모에서는 최소한의 설정으로 상황에 맞는 빠른 답변을 제공하는 지능형 Q&amp;A 시스템을 구축하는 방법을 보여드리기 위해 Milvus Lite를 Parlant와 함께 사용합니다.</p>
<h3 id="Prerequisites" class="common-anchor-header">전제 조건</h3><p>1.Parlant 깃허브: https://github.com/emcie-co/parlant</p>
<p>2.Parlant 문서: https://parlant.io/docs</p>
<p>3.python3.10+</p>
<p>4.OpenAI_key</p>
<p>5.MlivusLite</p>
<h3 id="Step-1-Install-Dependencies" class="common-anchor-header">1단계: 종속성 설치</h3><pre><code translate="no"><span class="hljs-comment"># Install required Python packages</span>
pip install pymilvus parlant openai
<span class="hljs-comment"># Or, if you’re using a Conda environment:</span>
conda activate your_env_name
pip install pymilvus parlant openai
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-2-Configure-Environment-Variables" class="common-anchor-header">2단계: 환경 변수 구성</h3><pre><code translate="no"><span class="hljs-comment"># Set your OpenAI API key</span>
<span class="hljs-built_in">export</span> OPENAI_API_KEY=<span class="hljs-string">&quot;your_openai_api_key_here&quot;</span>
<span class="hljs-comment"># Verify that the variable is set correctly</span>
<span class="hljs-built_in">echo</span> <span class="hljs-variable">$OPENAI_API_KEY</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-3-Implement-the-Core-Code" class="common-anchor-header">3단계: 핵심 코드 구현</h3><ul>
<li>커스텀 OpenAI 임베더 생성</li>
</ul>
<pre><code translate="no"><span class="hljs-keyword">class</span> <span class="hljs-title class_">OpenAIEmbedder</span>(p.Embedder):
    <span class="hljs-comment"># Converts text into vector embeddings with built-in timeout and retry</span>
    <span class="hljs-comment"># Dimension: 1536 (text-embedding-3-small)</span>
    <span class="hljs-comment"># Timeout: 60 seconds; Retries: up to 2 times</span>
<button class="copy-code-btn"></button></code></pre>
<ul>
<li>지식 기반 초기화</li>
</ul>
<p>1. kb_articles라는 이름의 Milvus 컬렉션을 만듭니다.</p>
<p>2. 샘플 데이터(예: 환불 정책, 교환 정책, 배송 시간)를 삽입합니다.</p>
<p>3. 검색을 가속화하기 위해 HNSW 인덱스를 구축합니다.</p>
<ul>
<li>벡터 검색 도구 구축</li>
</ul>
<pre><code translate="no"><span class="hljs-meta">@p.tool</span>
<span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">vector_search</span>(<span class="hljs-params">query: <span class="hljs-built_in">str</span>, top_k: <span class="hljs-built_in">int</span> = <span class="hljs-number">5</span>, min_score: <span class="hljs-built_in">float</span> = <span class="hljs-number">0.35</span></span>):
    <span class="hljs-comment"># 1. Convert user query into a vector</span>
    <span class="hljs-comment"># 2. Perform similarity search in Milvus</span>
    <span class="hljs-comment"># 3. Return results with relevance above threshold</span>
<button class="copy-code-btn"></button></code></pre>
<ul>
<li>Parlant 에이전트 구성</li>
</ul>
<p><strong>가이드라인 1:</strong> 사실 또는 정책 관련 질문의 경우 상담원이 먼저 벡터 검색을 수행해야 합니다.</p>
<p><strong>가이드라인 2:</strong> 증거가 발견되면 상담원은 구조화된 템플릿(요약 + 요점 + 출처)을 사용하여 답변해야 합니다.</p>
<pre><code translate="no"><span class="hljs-comment"># Guideline 1: Run vector search for factual or policy-related questions</span>
<span class="hljs-keyword">await</span> agent.create_guideline(
            condition=<span class="hljs-string">&quot;User asks a factual question about policy, refund, exchange, or shipping&quot;</span>,
            action=(
                <span class="hljs-string">&quot;Call vector_search with the user&#x27;s query. &quot;</span>
                <span class="hljs-string">&quot;If evidence is found, synthesize an answer by quoting key sentences and cite doc_id/title. &quot;</span>
                <span class="hljs-string">&quot;If evidence is insufficient, ask a clarifying question before answering.&quot;</span>
            ),
            tools=[vector_search],

<span class="hljs-comment"># Guideline 2: Use a standardized, structured response when evidence is available</span>
<span class="hljs-keyword">await</span> agent.create_guideline(
            condition=<span class="hljs-string">&quot;Evidence is available&quot;</span>,
            action=(
                <span class="hljs-string">&quot;Answer with the following template:\\n&quot;</span>
                <span class="hljs-string">&quot;Summary: provide a concise conclusion.\\n&quot;</span>
                <span class="hljs-string">&quot;Key points: 2-3 bullets distilled from evidence.\\n&quot;</span>
                <span class="hljs-string">&quot;Sources: list doc_id and title.\\n&quot;</span>
                <span class="hljs-string">&quot;Note: if confidence is low, state limitations and ask for clarification.&quot;</span>
            ),
            tools=[],
        )

    tools=[],
)
<button class="copy-code-btn"></button></code></pre>
<ul>
<li>전체 코드 작성하기</li>
</ul>
<pre><code translate="no"><span class="hljs-keyword">import</span> os
<span class="hljs-keyword">import</span> asyncio
<span class="hljs-keyword">import</span> json
<span class="hljs-keyword">from</span> typing <span class="hljs-keyword">import</span> <span class="hljs-type">List</span>, <span class="hljs-type">Dict</span>, <span class="hljs-type">Any</span>
<span class="hljs-keyword">import</span> parlant.sdk <span class="hljs-keyword">as</span> p
<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient, DataType
<span class="hljs-comment"># 1) Environment variables: using OpenAI (as both the default generation model and embedding service)</span>
<span class="hljs-comment"># Make sure the OPENAI_API_KEY is set</span>
OPENAI_API_KEY = os.environ.get(<span class="hljs-string">&quot;OPENAI_API_KEY&quot;</span>)
<span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> OPENAI_API_KEY:
    <span class="hljs-keyword">raise</span> RuntimeError(<span class="hljs-string">&quot;Please set OPENAI_API_KEY environment variable&quot;</span>)
<span class="hljs-comment"># 2) Initialize Milvus Lite (runs locally, no standalone service required)</span>
<span class="hljs-comment"># MilvusClient runs in Lite mode using a local file path (requires pymilvus &gt;= 2.x)</span>
client = MilvusClient(<span class="hljs-string">&quot;./milvus_demo.db&quot;</span>)  <span class="hljs-comment"># Lite mode uses a local file path</span>
COLLECTION = <span class="hljs-string">&quot;kb_articles&quot;</span>
<span class="hljs-comment"># 3) Example data: three policy or FAQ entries (in practice, you can load and chunk data from files)</span>
DOCS = [
    {<span class="hljs-string">&quot;doc_id&quot;</span>: <span class="hljs-string">&quot;POLICY-001&quot;</span>, <span class="hljs-string">&quot;title&quot;</span>: <span class="hljs-string">&quot;Refund Policy&quot;</span>, <span class="hljs-string">&quot;chunk&quot;</span>: <span class="hljs-string">&quot;Refunds are available within 30 days of purchase if the product is unused.&quot;</span>},
    {<span class="hljs-string">&quot;doc_id&quot;</span>: <span class="hljs-string">&quot;POLICY-002&quot;</span>, <span class="hljs-string">&quot;title&quot;</span>: <span class="hljs-string">&quot;Exchange Policy&quot;</span>, <span class="hljs-string">&quot;chunk&quot;</span>: <span class="hljs-string">&quot;Exchanges are permitted within 15 days; original packaging required.&quot;</span>},
    {<span class="hljs-string">&quot;doc_id&quot;</span>: <span class="hljs-string">&quot;FAQ-101&quot;</span>, <span class="hljs-string">&quot;title&quot;</span>: <span class="hljs-string">&quot;Shipping Time&quot;</span>, <span class="hljs-string">&quot;chunk&quot;</span>: <span class="hljs-string">&quot;Standard shipping usually takes 3–5 business days within the country.&quot;</span>},
]
<span class="hljs-comment"># 4) Generate embeddings using OpenAI (you can replace this with another embedding service)</span>
<span class="hljs-comment"># Here we use Parlant’s built-in OpenAI embedder for simplicity, but you could also call the OpenAI SDK directly.</span>
<span class="hljs-keyword">class</span> <span class="hljs-title class_">OpenAIEmbedder</span>(p.Embedder):
    <span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">embed</span>(<span class="hljs-params">self, texts: <span class="hljs-type">List</span>[<span class="hljs-built_in">str</span>], hints: <span class="hljs-type">Dict</span>[<span class="hljs-built_in">str</span>, <span class="hljs-type">Any</span>] = {}</span>) -&gt; p.EmbeddingResult:
        <span class="hljs-comment"># Generate text embeddings using the OpenAI API, with timeout and retry handling</span>
        <span class="hljs-keyword">import</span> openai
        <span class="hljs-keyword">try</span>:
            client = openai.AsyncOpenAI(
                api_key=OPENAI_API_KEY,
                timeout=<span class="hljs-number">60.0</span>,  <span class="hljs-comment"># 60-second timeout</span>
                max_retries=<span class="hljs-number">2</span>  <span class="hljs-comment"># Retry up to 2 times</span>
            )
            <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Generating embeddings for <span class="hljs-subst">{<span class="hljs-built_in">len</span>(texts)}</span> texts...&quot;</span>)
            response = <span class="hljs-keyword">await</span> client.embeddings.create(
                model=<span class="hljs-string">&quot;text-embedding-3-small&quot;</span>,
                <span class="hljs-built_in">input</span>=texts
            )
            vectors = [data.embedding <span class="hljs-keyword">for</span> data <span class="hljs-keyword">in</span> response.data]
            <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Successfully generated <span class="hljs-subst">{<span class="hljs-built_in">len</span>(vectors)}</span> embeddings.&quot;</span>)
            <span class="hljs-keyword">return</span> p.EmbeddingResult(vectors=vectors)
        <span class="hljs-keyword">except</span> Exception <span class="hljs-keyword">as</span> e:
            <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;OpenAI API call failed: <span class="hljs-subst">{e}</span>&quot;</span>)
            <span class="hljs-comment"># Return mock vectors for testing Milvus connectivity</span>
            <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Using mock vectors for testing...&quot;</span>)
            <span class="hljs-keyword">import</span> random
            vectors = [[random.random() <span class="hljs-keyword">for</span> _ <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-number">1536</span>)] <span class="hljs-keyword">for</span> _ <span class="hljs-keyword">in</span> texts]
            <span class="hljs-keyword">return</span> p.EmbeddingResult(vectors=vectors)
<span class="hljs-meta">    @property</span>
    <span class="hljs-keyword">def</span> <span class="hljs-title function_">id</span>(<span class="hljs-params">self</span>) -&gt; <span class="hljs-built_in">str</span>:
        <span class="hljs-keyword">return</span> <span class="hljs-string">&quot;text-embedding-3-small&quot;</span>
<span class="hljs-meta">    @property</span>
    <span class="hljs-keyword">def</span> <span class="hljs-title function_">max_tokens</span>(<span class="hljs-params">self</span>) -&gt; <span class="hljs-built_in">int</span>:
        <span class="hljs-keyword">return</span> <span class="hljs-number">8192</span>
<span class="hljs-meta">    @property</span>
    <span class="hljs-keyword">def</span> <span class="hljs-title function_">tokenizer</span>(<span class="hljs-params">self</span>) -&gt; p.EstimatingTokenizer:
        <span class="hljs-keyword">from</span> parlant.core.nlp.tokenization <span class="hljs-keyword">import</span> ZeroEstimatingTokenizer
        <span class="hljs-keyword">return</span> ZeroEstimatingTokenizer()
<span class="hljs-meta">    @property</span>
    <span class="hljs-keyword">def</span> <span class="hljs-title function_">dimensions</span>(<span class="hljs-params">self</span>) -&gt; <span class="hljs-built_in">int</span>:
        <span class="hljs-keyword">return</span> <span class="hljs-number">1536</span>
embedder = OpenAIEmbedder()
<span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">ensure_collection_and_load</span>():
    <span class="hljs-comment"># Create the collection (schema: primary key, vector field, additional fields)</span>
    <span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> client.has_collection(COLLECTION):
        client.create_collection(
            collection_name=COLLECTION,
            dimension=<span class="hljs-built_in">len</span>((<span class="hljs-keyword">await</span> embedder.embed([<span class="hljs-string">&quot;dimension_probe&quot;</span>])).vectors[<span class="hljs-number">0</span>]),
            <span class="hljs-comment"># Default metric: COSINE (can be changed with metric_type=&quot;COSINE&quot;)</span>
            auto_id=<span class="hljs-literal">True</span>,
        )
        <span class="hljs-comment"># Create an index to speed up retrieval (HNSW used here as an example)</span>
        client.create_index(
            collection_name=COLLECTION,
            field_name=<span class="hljs-string">&quot;vector&quot;</span>,
            index_type=<span class="hljs-string">&quot;HNSW&quot;</span>,
            metric_type=<span class="hljs-string">&quot;COSINE&quot;</span>,
            params={<span class="hljs-string">&quot;M&quot;</span>: <span class="hljs-number">32</span>, <span class="hljs-string">&quot;efConstruction&quot;</span>: <span class="hljs-number">200</span>}
        )
    <span class="hljs-comment"># Insert data (skip if already exists; simple idempotent logic for the demo)</span>
    <span class="hljs-comment"># Generate embeddings</span>
    chunks = [d[<span class="hljs-string">&quot;chunk&quot;</span>] <span class="hljs-keyword">for</span> d <span class="hljs-keyword">in</span> DOCS]
    embedding_result = <span class="hljs-keyword">await</span> embedder.embed(chunks)
    vectors = embedding_result.vectors
    <span class="hljs-comment"># Check if the same doc_id already exists; this is for demo purposes only — real applications should use stricter deduplication</span>
    <span class="hljs-comment"># Here we insert directly. In production, use an upsert operation or an explicit primary key</span>
    client.insert(
        COLLECTION,
        data=[
            {<span class="hljs-string">&quot;vector&quot;</span>: vectors[i], <span class="hljs-string">&quot;doc_id&quot;</span>: DOCS[i][<span class="hljs-string">&quot;doc_id&quot;</span>], <span class="hljs-string">&quot;title&quot;</span>: DOCS[i][<span class="hljs-string">&quot;title&quot;</span>], <span class="hljs-string">&quot;chunk&quot;</span>: DOCS[i][<span class="hljs-string">&quot;chunk&quot;</span>]}
            <span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-built_in">len</span>(DOCS))
        ],
    )
    <span class="hljs-comment"># Load into memory</span>
    client.load_collection(COLLECTION)
<span class="hljs-comment"># 5) Define the vector search tool (Parlant Tool)</span>
<span class="hljs-meta">@p.tool</span>
<span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">vector_search</span>(<span class="hljs-params">context: p.ToolContext, query: <span class="hljs-built_in">str</span>, top_k: <span class="hljs-built_in">int</span> = <span class="hljs-number">5</span>, min_score: <span class="hljs-built_in">float</span> = <span class="hljs-number">0.35</span></span>) -&gt; p.ToolResult:
    <span class="hljs-comment"># 5.1 Generate the query vector</span>
    embed_res = <span class="hljs-keyword">await</span> embedder.embed([query])
    qvec = embed_res.vectors[<span class="hljs-number">0</span>]
    <span class="hljs-comment"># 5.2 Search Milvus</span>
    results = client.search(
        collection_name=COLLECTION,
        data=[qvec],
        limit=top_k,
        output_fields=[<span class="hljs-string">&quot;doc_id&quot;</span>, <span class="hljs-string">&quot;title&quot;</span>, <span class="hljs-string">&quot;chunk&quot;</span>],
        search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;COSINE&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;ef&quot;</span>: <span class="hljs-number">128</span>}},
    )
    <span class="hljs-comment"># 5.3 Assemble structured evidence and filter by score threshold</span>
    hits = []
    <span class="hljs-keyword">for</span> hit <span class="hljs-keyword">in</span> results[<span class="hljs-number">0</span>]:
        score = hit[<span class="hljs-string">&quot;distance&quot;</span>] <span class="hljs-keyword">if</span> <span class="hljs-string">&quot;distance&quot;</span> <span class="hljs-keyword">in</span> hit <span class="hljs-keyword">else</span> hit.get(<span class="hljs-string">&quot;score&quot;</span>, <span class="hljs-number">0.0</span>)
        <span class="hljs-keyword">if</span> score &gt;= min_score:
            hits.append({
                <span class="hljs-string">&quot;doc_id&quot;</span>: hit[<span class="hljs-string">&quot;entity&quot;</span>][<span class="hljs-string">&quot;doc_id&quot;</span>],
                <span class="hljs-string">&quot;title&quot;</span>: hit[<span class="hljs-string">&quot;entity&quot;</span>][<span class="hljs-string">&quot;title&quot;</span>],
                <span class="hljs-string">&quot;chunk&quot;</span>: hit[<span class="hljs-string">&quot;entity&quot;</span>][<span class="hljs-string">&quot;chunk&quot;</span>],
                <span class="hljs-string">&quot;score&quot;</span>: <span class="hljs-built_in">float</span>(score),
            })
    <span class="hljs-keyword">return</span> p.ToolResult({<span class="hljs-string">&quot;evidence&quot;</span>: hits})
<span class="hljs-comment"># 6) Run Parlant Server and create the Agent + Guidelines</span>
<span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">main</span>():
    <span class="hljs-keyword">await</span> ensure_collection_and_load()
    <span class="hljs-keyword">async</span> <span class="hljs-keyword">with</span> p.Server() <span class="hljs-keyword">as</span> server:
        agent = <span class="hljs-keyword">await</span> server.create_agent(
            name=<span class="hljs-string">&quot;Policy Assistant&quot;</span>,
            description=<span class="hljs-string">&quot;Rule-controlled RAG assistant with Milvus Lite&quot;</span>,
        )
        <span class="hljs-comment"># Example variable: current time (can be used in templates or logs)</span>
<span class="hljs-meta">        @p.tool</span>
        <span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">get_datetime</span>(<span class="hljs-params">context: p.ToolContext</span>) -&gt; p.ToolResult:
            <span class="hljs-keyword">from</span> datetime <span class="hljs-keyword">import</span> datetime
            <span class="hljs-keyword">return</span> p.ToolResult({<span class="hljs-string">&quot;now&quot;</span>: datetime.now().isoformat()})
        <span class="hljs-keyword">await</span> agent.create_variable(name=<span class="hljs-string">&quot;current-datetime&quot;</span>, tool=get_datetime)
        <span class="hljs-comment"># Core Guideline 1: Run vector search for factual or policy-related questions</span>
        <span class="hljs-keyword">await</span> agent.create_guideline(
            condition=<span class="hljs-string">&quot;User asks a factual question about policy, refund, exchange, or shipping&quot;</span>,
            action=(
                <span class="hljs-string">&quot;Call vector_search with the user&#x27;s query. &quot;</span>
                <span class="hljs-string">&quot;If evidence is found, synthesize an answer by quoting key sentences and cite doc_id/title. &quot;</span>
                <span class="hljs-string">&quot;If evidence is insufficient, ask a clarifying question before answering.&quot;</span>
            ),
            tools=[vector_search],
        )
        <span class="hljs-comment"># Core Guideline 2: Use a standardized, structured response when evidence is available</span>
        <span class="hljs-keyword">await</span> agent.create_guideline(
            condition=<span class="hljs-string">&quot;Evidence is available&quot;</span>,
            action=(
                <span class="hljs-string">&quot;Answer with the following template:\\n&quot;</span>
                <span class="hljs-string">&quot;Summary: provide a concise conclusion.\\n&quot;</span>
                <span class="hljs-string">&quot;Key points: 2-3 bullets distilled from evidence.\\n&quot;</span>
                <span class="hljs-string">&quot;Sources: list doc_id and title.\\n&quot;</span>
                <span class="hljs-string">&quot;Note: if confidence is low, state limitations and ask for clarification.&quot;</span>
            ),
            tools=[],
        )
        <span class="hljs-comment"># Hint: Local Playground URL</span>
        <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Playground: &lt;http://localhost:8800&gt;&quot;</span>)
<span class="hljs-keyword">if</span> __name__ == <span class="hljs-string">&quot;__main__&quot;</span>:
    asyncio.run(main())
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-4-Run-the-Code" class="common-anchor-header">4단계: 코드 실행하기</h3><pre><code translate="no"><span class="hljs-comment"># Run the main program</span>
python main.py
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/python_main_eb7d7c6d73.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<ul>
<li>플레이그라운드를 방문합니다:</li>
</ul>
<pre><code translate="no">&lt;<span class="hljs-attr">http</span>:<span class="hljs-comment">//localhost:8800&gt;</span>
<button class="copy-code-btn"></button></code></pre>
<p>이제 Parlant와 Milvus를 사용하여 지능형 Q&amp;A 시스템을 성공적으로 구축했습니다.</p>
<h2 id="Parlant-vs-LangChainLlamaIndex-How-They-Differ-and-How-They-Work-Together" class="common-anchor-header">Parlant 대 LangChain/LlamaIndex: 차이점과 함께 작동하는 방법<button data-href="#Parlant-vs-LangChainLlamaIndex-How-They-Differ-and-How-They-Work-Together" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>LangChain이나</strong> <strong>LlamaIndex와</strong> 같은 기존 에이전트 프레임워크와 비교했을 때 Parlant는 어떻게 다른가요?</p>
<p>LangChain과 LlamaIndex는 범용 프레임워크입니다. 이들은 광범위한 구성 요소와 통합을 제공하므로 신속한 프로토타이핑과 연구 실험에 이상적입니다. 그러나 프로덕션에 배포할 때는 에이전트의 일관성과 신뢰성을 유지하기 위해 개발자가 직접 규칙 관리, 규정 준수 검사, 안정성 메커니즘과 같은 추가 계층을 구축해야 하는 경우가 많습니다.</p>
<p>Parlant는 기본으로 제공되는 가이드라인 관리, 자체 비판 메커니즘, 설명 가능성 도구를 통해 개발자가 에이전트의 행동, 응답 및 이유를 관리할 수 있도록 도와줍니다. 따라서 금융, 의료, 법률 서비스 등 정확성과 책임감이 중요한 고객 대면 사용 사례에 특히 적합합니다.</p>
<p>실제로 이러한 프레임워크는 함께 작동할 수 있습니다:</p>
<ul>
<li><p>복잡한 데이터 처리 파이프라인이나 검색 워크플로우를 구축하려면 LangChain을 사용하세요.</p></li>
<li><p>Parlant를 사용해 최종 상호 작용 계층을 관리하고, 출력이 비즈니스 규칙을 따르고 해석 가능한 상태를 유지할 수 있도록 하세요.</p></li>
<li><p>Milvus를 벡터 데이터베이스 기반으로 사용해 시스템 전체에 실시간 시맨틱 검색, 메모리 및 지식 검색을 제공하세요.</p></li>
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
    </button></h2><p>LLM 에이전트가 실험에서 생산 단계로 넘어가면서 더 이상 무엇을 할 수 있는지가 아니라 얼마나 안정적이고 안전하게 수행할 수 있는지가 핵심 질문이 되었습니다. Parlant는 이러한 안정성을 위한 구조와 제어 기능을 제공하며, Milvus는 모든 것을 빠르고 컨텍스트 인식적으로 유지하는 확장 가능한 벡터 인프라를 제공합니다.</p>
<p>이 두 가지를 함께 사용하면 개발자는 성능뿐 아니라 신뢰할 수 있고 설명이 가능하며 프로덕션에 바로 사용할 수 있는 AI 에이전트를 구축할 수 있습니다.</p>
<p><a href="https://github.com/emcie-co/parlant?utm_source=chatgpt.com"> GitHub에서 Parlant를</a> 확인하고<a href="https://milvus.io"> Milvus와</a> 통합하여 나만의 지능형 규칙 기반 에이전트 시스템을 구축하세요.</p>
<p>궁금한 점이 있거나 기능에 대해 자세히 알아보고 싶으신가요?<a href="https://discord.com/invite/8uyFbECzPX"> Discord 채널에</a> 참여하거나<a href="https://github.com/milvus-io/milvus"> GitHub에</a> 이슈를 제출하세요. 또한<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus 오피스 아워를</a> 통해 20분간 일대일 세션을 예약하여 인사이트, 안내 및 질문에 대한 답변을 얻을 수도 있습니다.</p>
