---
id: >-
  when-context-engineering-is-done-right-hallucinations-can-spark-ai-creativity.md
title: 컨텍스트 엔지니어링을 제대로 수행하면 환각은 AI 창의성의 불꽃이 될 수 있습니다.
author: James Luan
date: 2025-09-30T00:00:00.000Z
desc: >-
  AI 환각이 단순한 오류가 아니라 창의력의 불꽃인 이유와 컨텍스트 엔지니어링을 통해 신뢰할 수 있는 실제 결과물로 전환하는 방법을
  알아보세요.
cover: assets.zilliz.com/Chat_GPT_Image_Oct_1_2025_10_42_15_AM_101639b3bf.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, AI Agents, Context Engineering'
meta_keywords: 'Milvus, vector database, AI Agents, Context Engineering'
meta_title: |
  If Context Engineering Done Right, Hallucinations Can Spark AI Creativity
origin: >-
  https://milvus.io/blog/when-context-engineering-is-done-right-hallucinations-can-spark-ai-creativity.md
---
<p>오랫동안 저를 포함한 많은 사람들이 LLM 환각을 단순한 결함으로 취급했습니다. 검색 시스템, 가드레일, 미세 조정 등 전체 도구 체인이 이를 제거하기 위해 구축되었습니다. 이러한 안전장치는 여전히 가치가 있습니다. 하지만 모델이 실제로 응답을 생성하는 방식과 <a href="https://milvus.io/"><strong>Milvus와</strong></a> 같은 시스템이 더 광범위한 AI 파이프라인에 어떻게 적용되는지 연구할수록 환각이 단순한 실패라고 생각하지 않게 되었습니다. 사실 환각은 AI 창의성의 불꽃이 될 수도 있습니다.</p>
<p>인간의 창의성을 살펴보면 동일한 패턴을 발견할 수 있습니다. 모든 혁신은 상상력의 도약에 의존합니다. 하지만 이러한 도약은 결코 갑자기 떠오르지 않습니다. 시인은 규칙을 깨기 전에 먼저 리듬과 운율을 마스터합니다. 과학자들은 검증되지 않은 영역으로 모험을 떠나기 전에 확립된 이론에 의존합니다. 탄탄한 지식과 이해가 바탕이 되는 한, 발전은 이러한 도약에 달려 있습니다.</p>
<p>LLM도 거의 같은 방식으로 작동합니다. 소위 '환각' 또는 '도약'이라고 불리는 유추, 연상, 추론은 모델이 명시적으로 훈련받은 것 이상으로 연결하고, 지식을 확장하고, 아이디어를 표면화할 수 있는 동일한 생성 프로세스에서 비롯됩니다. 모든 도약이 성공하는 것은 아니지만, 성공할 경우 그 결과는 매우 강력할 수 있습니다.</p>
<p>그렇기 때문에 저는 <strong>컨텍스트 엔지니어링을</strong> 중요한 다음 단계로 보고 있습니다. 모든 환상을 없애려고 노력하기보다는 환상을 <em>조정하는</em> 데 집중해야 합니다. 올바른 컨텍스트를 설계함으로써 모델이 새로운 영역을 개척할 수 있을 만큼 상상력을 발휘하면서도 신뢰할 수 있을 만큼 안정적으로 유지되도록 균형을 맞출 수 있습니다.</p>
<h2 id="What-is-Context-Engineering" class="common-anchor-header">컨텍스트 엔지니어링이란 무엇인가요?<button data-href="#What-is-Context-Engineering" class="anchor-icon" translate="no">
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
    </button></h2><p>그렇다면 <em>컨텍스트 엔지니어링이란</em> 정확히 무엇을 의미할까요? 이 용어는 생소할 수 있지만, 실제로는 수년 동안 발전해 왔습니다. RAG, 프롬프트, 함수 호출, MCP와 같은 기술은 모두 모델에 유용한 결과를 생성할 수 있는 적절한 환경을 제공한다는 동일한 문제를 해결하기 위한 초기 시도입니다. 컨텍스트 엔지니어링은 이러한 접근 방식을 일관된 프레임워크로 통합하는 것입니다.</p>
<h2 id="The-Three-Pillars-of-Context-Engineering" class="common-anchor-header">컨텍스트 엔지니어링의 세 가지 기둥<button data-href="#The-Three-Pillars-of-Context-Engineering" class="anchor-icon" translate="no">
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
    </button></h2><p>효과적인 컨텍스트 엔지니어링은 서로 연결된 세 가지 레이어에 기반합니다:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/context_engineering_1_8f2b39c5e7.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="1-The-Instructions-Layer--Defining-Direction" class="common-anchor-header">1. 지침 계층 - 방향 정의</h3><p>이 계층에는 프롬프트, 짧은 예시 및 데모가 포함됩니다. 막연한 "북쪽으로 가세요"가 아니라 웨이포인트가 있는 명확한 경로를 제시하는 모델의 내비게이션 시스템과도 같습니다. 잘 구조화된 지침은 경계를 설정하고 목표를 정의하며 모델 동작의 모호성을 줄여줍니다.</p>
<h3 id="2-The-Knowledge-Layer--Supplying-Ground-Truth" class="common-anchor-header">2. 지식 레이어 - 사실 기반 정보 제공</h3><p>여기에는 모델이 효과적으로 추론하는 데 필요한 사실, 코드, 문서 및 상태를 배치합니다. 이 계층이 없으면 시스템은 불완전한 메모리에서 즉흥적으로 추론합니다. 이 계층이 있으면 모델은 도메인별 데이터에 근거하여 결과를 산출할 수 있습니다. 지식이 정확하고 관련성이 높을수록 추론의 신뢰도가 높아집니다.</p>
<h3 id="3-The-Tools-Layer--Enabling-Action-and-Feedback" class="common-anchor-header">3. 도구 레이어 - 실행 및 피드백 활성화</h3><p>이 계층은 API, 함수 호출 및 외부 통합을 다룹니다. 이를 통해 시스템은 추론을 넘어 데이터 검색, 계산 수행, 워크플로우 트리거 등 실행 단계로 나아갈 수 있습니다. 마찬가지로 중요한 것은 이러한 도구가 모델의 추론에 다시 반복될 수 있는 실시간 피드백을 제공한다는 점입니다. 이러한 피드백을 통해 수정, 조정 및 지속적인 개선이 가능합니다. 실제로 이러한 피드백은 LLM을 수동적인 응답자에서 시스템의 능동적인 참여자로 변화시킵니다.</p>
<p>이러한 계층은 사일로가 아니라 서로를 강화합니다. 지침은 목표를 설정하고, 지식은 작업할 정보를 제공하며, 도구는 결정을 실행으로 전환하고 결과를 다시 루프에 피드백합니다. 이러한 요소들이 잘 조율되면 모델이 창의적이면서도 신뢰할 수 있는 환경을 조성할 수 있습니다.</p>
<h2 id="The-Long-Context-Challenges-When-More-Becomes-Less" class="common-anchor-header">긴 컨텍스트의 도전: 더 많은 것이 더 적은 것이 될 때<button data-href="#The-Long-Context-Challenges-When-More-Becomes-Less" class="anchor-icon" translate="no">
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
    </button></h2><p>현재 많은 AI 모델은 약 75,000줄의 코드 또는 75만 단어의 문서에 해당하는 백만 개의 토큰 창을 광고합니다. 하지만 컨텍스트가 많다고 해서 자동으로 더 나은 결과가 나오는 것은 아닙니다. 실제로 매우 긴 컨텍스트는 추론과 신뢰성을 저하시킬 수 있는 뚜렷한 실패 모드를 도입합니다.</p>
<h3 id="Context-Poisoning--When-Bad-Information-Spreads" class="common-anchor-header">컨텍스트 중독 - 잘못된 정보가 확산되는 경우</h3><p>목표, 요약, 중간 상태 등 잘못된 정보가 작업 컨텍스트에 들어가면 전체 추론 프로세스가 탈선할 수 있습니다. <a href="https://arxiv.org/pdf/2507.06261">딥마인드의 Gemini 2.5 보고서는</a> 명확한 예를 제공합니다. 포켓몬을 플레이하는 LLM 에이전트가 게임 상태를 잘못 읽고 "잡을 수 없는 전설적인 포켓몬을 잡는 것"을 미션으로 정했습니다. 이 잘못된 목표가 사실로 기록되어 에이전트는 정교하지만 불가능한 전략을 세우게 되었습니다.</p>
<p>아래 발췌문에서 볼 수 있듯이, 독이 든 컨텍스트는 상식을 무시하고 동일한 실수를 반복하며 전체 추론 프로세스가 무너질 때까지 반복되는 오류에 모델을 갇히게 했습니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_1_Excerpt_from_Gemini_2_5_Tech_Paper_e89adf9eed.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>그림 1: <a href="https://arxiv.org/pdf/2507.06261">Gemini 2.5 기술 문서</a>에서 발췌한 내용</p>
<h3 id="Context-Distraction--Lost-in-the-Details" class="common-anchor-header">컨텍스트 산만 - 디테일에 집중하지 못함</h3><p>컨텍스트 창이 확장됨에 따라 모델은 훈련 중에 학습한 내용을 과도하게 강조하고 과소평가하기 시작할 수 있습니다. 예를 들어, 딥마인드의 Gemini 2.5 Pro는 백만 개의 토큰 창을 지원하지만 새로운 전략을 생성하는 대신 과거의 행동을 <a href="https://arxiv.org/pdf/2507.06261">재활용하는 약 10만 개의 토큰에서 표류하기 시작합니다</a>. <a href="https://www.databricks.com/blog/long-context-rag-performance-llms">데이터브릭스 연구에</a> 따르면 라마 3.1-405B와 같은 더 작은 모델은 약 32,000개 토큰에서 훨씬 더 빨리 한계에 도달합니다. 이는 인간에게 익숙한 효과입니다. 너무 많은 배경 지식을 읽으면 줄거리를 놓치게 됩니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_2_Excerpt_from_Gemini_2_5_Tech_Paper_56d775c59d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>그림 2: <a href="https://arxiv.org/pdf/2507.06261">Gemini 2.5 기술 문서</a>에서 발췌한 내용</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_3_Long_context_performance_of_GPT_Claude_Llama_Mistral_and_DBRX_models_on_4_curated_RAG_datasets_Databricks_Docs_QA_Finance_Bench_Hot_Pot_QA_and_Natural_Questions_Source_Databricks_99086246b9.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>그림 3: 4개의 선별된 RAG 데이터 세트(Databricks DocsQA, FinanceBench, HotPotQA 및 Natural Questions)에서의 GPT, Claude, Llama, Mistral 및 DBRX 모델의 긴 컨텍스트 성능 [출처:</em> <a href="https://www.databricks.com/blog/long-context-rag-performance-llms"><em>Databricks</em></a><em>]</em></p>
<h3 id="Context-Confusion--Too-Many-Tools-in-the-Kitchen" class="common-anchor-header">컨텍스트 혼동 - 너무 많은 도구들</h3><p>도구를 더 추가한다고 해서 항상 도움이 되는 것은 아닙니다. <a href="https://gorilla.cs.berkeley.edu/leaderboard.html">버클리 함수 호출 리더보드에</a> 따르면 컨텍스트에 관련 없는 옵션이 많은 광범위한 도구 메뉴가 표시되면 모델 신뢰성이 떨어지고 도구가 필요하지 않은 경우에도 도구가 호출되는 것으로 나타났습니다. 한 가지 분명한 예로, 정량화된 라마 3.1-8B는 46개의 도구를 사용할 때는 실패했지만 도구 세트를 19개로 줄였을 때는 성공했습니다. 선택의 역설, 즉 선택지가 너무 많을수록 더 나쁜 결정을 내릴 수 있다는 것이 바로 AI 시스템의 역설입니다.</p>
<h3 id="Context-Clash--When-Information-Conflicts" class="common-anchor-header">컨텍스트 충돌 - 정보가 충돌할 때</h3><p>여러 차례에 걸친 상호 작용은 뚜렷한 실패 모드를 추가합니다. 대화가 분기되면서 초기 오해가 복잡해집니다. <a href="https://arxiv.org/pdf/2505.06120v1">Microsoft와 Salesforce의 실험에서</a> 개방형 및 폐쇄형 LLM은 모두 단일 턴 설정에 비해 멀티 턴 설정에서 현저하게 성능이 저하되었으며, 6세대 작업에서 평균 39%의 성능 저하를 보였습니다. 잘못된 가정이 대화 상태에 들어가면 후속 턴이 이를 상속하여 오류를 증폭시킵니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_4_LL_Ms_get_lost_in_multi_turn_conversations_in_experiments_21f194b02d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>그림 4: 실험에서 멀티턴 대화에서 LLM이 길을 잃는 경우</em></p>
<p>이 효과는 프론티어 모델에서도 나타납니다. 벤치마크 작업을 여러 턴에 걸쳐 분산했을 때 OpenAI의 o3 모델의 성능 점수는 <strong>98.1에서</strong> <strong>64.1로</strong> 떨어졌습니다. 초기 오독은 월드 모델을 효과적으로 '설정'하고, 각 응답은 이를 기반으로 구축되어 명시적으로 수정하지 않는 한 작은 모순이 굳어진 사각지대로 변합니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_4_The_performance_scores_in_LLM_multi_turn_conversation_experiments_414d3a0b3f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>그림 4: LLM 다중 턴 대화 실험의 성능 점수</em></p>
<h2 id="Six-Strategies-to-Tame-Long-Context" class="common-anchor-header">긴 문맥을 길들이기 위한 6가지 전략<button data-href="#Six-Strategies-to-Tame-Long-Context" class="anchor-icon" translate="no">
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
    </button></h2><p>긴 컨텍스트 문제에 대한 해답은 기능을 포기하는 것이 아니라 규율에 맞게 설계하는 것입니다. 다음은 실제로 효과를 본 6가지 전략입니다:</p>
<h3 id="Context-Isolation" class="common-anchor-header">컨텍스트 격리</h3><p>복잡한 워크플로를 고립된 컨텍스트를 가진 전문화된 에이전트로 분리하세요. 각 에이전트는 간섭 없이 고유한 영역에 집중하여 오류 전파의 위험을 줄입니다. 이렇게 하면 정확도가 향상될 뿐만 아니라 잘 조직된 엔지니어링 팀처럼 병렬 실행이 가능합니다.</p>
<h3 id="Context-Pruning" class="common-anchor-header">컨텍스트 프루닝</h3><p>컨텍스트를 정기적으로 감사하고 다듬으세요. 중복된 세부 정보, 오래된 정보, 관련 없는 흔적을 제거하세요. 죽은 코드와 종속성을 정리하고 필수적인 것만 남기는 리팩터링이라고 생각하면 됩니다. 효과적인 가지치기를 위해서는 무엇이 포함되고 무엇이 포함되지 않는지에 대한 명확한 기준이 필요합니다.</p>
<h3 id="Context-Summarization" class="common-anchor-header">컨텍스트 요약</h3><p>긴 히스토리를 전부 가지고 다닐 필요는 없습니다. 대신 다음 단계에 꼭 필요한 내용만 간결하게 요약하여 정리하세요. 좋은 요약은 중요한 사실, 결정, 제약 조건은 유지하면서 반복되는 내용과 불필요한 세부 사항을 제거합니다. 200페이지 분량의 사양서를 한 페이지 분량의 디자인 개요로 대체하면서도 앞으로 나아가는 데 필요한 모든 정보를 제공하는 것과 같습니다.</p>
<h3 id="Context-Offloading" class="common-anchor-header">컨텍스트 오프로딩</h3><p>모든 세부 사항이 라이브 컨텍스트에 포함될 필요는 없습니다. 중요하지 않은 데이터는 지식 기반, 문서 저장소 또는 Milvus와 같은 벡터 데이터베이스와 같은 외부 시스템에 보관하고 필요할 때만 가져올 수 있습니다. 이렇게 하면 모델의 인지 부하를 줄이면서 배경 정보에 계속 액세스할 수 있습니다.</p>
<h3 id="Strategic-RAG" class="common-anchor-header">전략적 RAG</h3><p>정보 검색은 선택적일 때만 강력합니다. 엄격한 필터링과 품질 관리를 통해 외부 지식을 도입하여 모델이 관련성 있고 정확한 입력을 사용하도록 보장하세요. 모든 데이터 파이프라인이 그렇듯이, 가비지 인, 가비지 아웃이지만 고품질 검색을 통해 컨텍스트는 책임이 아니라 자산이 됩니다.</p>
<h3 id="Optimized-Tool-Loading" class="common-anchor-header">최적화된 도구 로딩</h3><p>더 많은 도구가 더 나은 성능을 보장하지는 않습니다. 연구에 따르면 사용 가능한 도구가 30개를 넘어가면 안정성이 급격히 떨어집니다. 주어진 작업에 필요한 기능만 로드하고 나머지는 게이트 액세스로 제한하세요. 간결한 도구 상자는 정확성을 높이고 의사 결정을 압도할 수 있는 잡음을 줄입니다.</p>
<h2 id="The-Infrastructure-Challenge-of-Context-Engineering" class="common-anchor-header">컨텍스트 엔지니어링의 인프라 과제<button data-href="#The-Infrastructure-Challenge-of-Context-Engineering" class="anchor-icon" translate="no">
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
    </button></h2><p>컨텍스트 엔지니어링은 실행되는 인프라만큼만 효과적입니다. 그리고 오늘날의 기업들은 완벽한 데이터 폭풍에 직면해 있습니다:</p>
<h3 id="Scale-Explosion--From-Terabytes-to-Petabytes" class="common-anchor-header">규모 폭발 - 테라바이트에서 페타바이트까지</h3><p>오늘날 데이터 증가로 인해 기준선이 재정의되었습니다. 과거에는 단일 데이터베이스에 적합했던 워크로드가 이제는 페타바이트에 달하며 분산 스토리지와 컴퓨팅을 요구하고 있습니다. 한 줄의 SQL 업데이트에 불과했던 스키마 변경이 클러스터, 파이프라인, 서비스 전반에 걸친 전체 오케스트레이션 작업으로 확대될 수 있습니다. 확장은 단순히 하드웨어를 추가하는 것이 아니라 모든 가정을 스트레스 테스트하는 규모에서 조정, 복원력, 탄력성을 위한 엔지니어링을 의미합니다.</p>
<h3 id="Consumption-Revolution--Systems-That-Speak-AI" class="common-anchor-header">소비 혁명 - AI와 대화하는 시스템</h3><p>AI 에이전트는 단순히 데이터를 쿼리하는 데 그치지 않고 기계의 속도로 지속적으로 데이터를 생성, 변환, 소비합니다. 인간 대면 애플리케이션만을 위해 설계된 인프라로는 이를 따라잡을 수 없습니다. 에이전트를 지원하려면 시스템은 지연 시간이 짧은 검색, 스트리밍 업데이트, 쓰기 작업량이 많은 워크로드를 중단 없이 제공해야 합니다. 즉, 인프라 스택은 사후 고려 사항이 아닌 기본 워크로드로서 'AI를 말할 수 있도록' 구축되어야 합니다.</p>
<h3 id="Multimodal-Complexity--Many-Data-Types-One-System" class="common-anchor-header">멀티모달 복잡성 - 다양한 데이터 유형, 하나의 시스템</h3><p>AI 워크로드에는 텍스트, 이미지, 오디오, 비디오, 고차원 임베딩이 혼합되어 있으며 각각 풍부한 메타데이터가 첨부되어 있습니다. 이러한 이질성을 관리하는 것이 실질적인 컨텍스트 엔지니어링의 핵심입니다. 다양한 개체를 저장하는 것뿐만 아니라 색인을 생성하고 효율적으로 검색하며 여러 양식에 걸쳐 의미론적 일관성을 유지하는 것이 과제입니다. 진정한 AI 지원 인프라는 멀티모달리티를 볼트온 기능이 아닌 일류 설계 원칙으로 취급해야 합니다.</p>
<h2 id="Milvus-+-Loon-Purpose-Built-Data-Infrastructure-for-AI" class="common-anchor-header">밀버스 + 룬: AI를 위한 목적에 맞게 구축된 데이터 인프라<button data-href="#Milvus-+-Loon-Purpose-Built-Data-Infrastructure-for-AI" class="anchor-icon" translate="no">
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
    </button></h2><p>규모, 소비, 멀티모달리티의 과제는 이론만으로는 해결할 수 없으며, AI를 위해 특별히 구축된 인프라가 필요합니다. 이것이 바로 <a href="https://zilliz.com/">질리즈가</a> <strong>Milvus와</strong> <strong>Loon이</strong> 함께 작동하도록 설계한 이유이며, 런타임에서의 고성능 검색과 업스트림에서의 대규모 데이터 처리라는 두 가지 문제를 모두 해결합니다.</p>
<ul>
<li><p><a href="https://milvus.io/"><strong>Milvus</strong></a>: 고성능 벡터 검색 및 저장에 최적화된 가장 널리 채택된 오픈 소스 벡터 데이터베이스입니다.</p></li>
<li><p><strong>Loon</strong>: 곧 출시될 클라우드 네이티브 멀티모달 데이터 레이크 서비스로, 대규모 멀티모달 데이터가 데이터베이스에 도달하기 전에 처리하고 정리하도록 설계되었습니다. 계속 지켜봐 주세요.</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/loon_milvus_min_76aaa39b4e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Lightning-Fast-Vector-Search" class="common-anchor-header">초고속 벡터 검색</h3><p><strong>Milvus는</strong> 처음부터 벡터 워크로드를 위해 구축되었습니다. 서빙 레이어로서 텍스트, 이미지, 오디오, 비디오에서 파생된 수억 개 또는 수십억 개의 벡터에 대해 10ms 미만의 검색을 제공합니다. AI 애플리케이션에서 검색 속도는 "있으면 좋은 것"이 아닙니다. 검색 속도는 에이전트의 반응이 빠른지 느린지, 검색 결과가 관련성이 있는지 없는지를 결정짓는 요소입니다. 여기서 성능은 최종 사용자 경험에서 직접 확인할 수 있습니다.</p>
<h3 id="Multimodal-Data-Lake-Service-at-Scale" class="common-anchor-header">대규모 멀티모달 데이터 레이크 서비스</h3><p><strong>Loon은</strong> 곧 출시될 멀티모달 데이터 레이크 서비스로, 비정형 데이터의 대규모 오프라인 처리 및 분석을 위해 설계되었습니다. 이 서비스는 데이터가 데이터베이스에 도달하기 전에 데이터를 준비하여 파이프라인 측면에서 Milvus를 보완합니다. 텍스트, 이미지, 오디오, 비디오를 아우르는 실제 멀티모달 데이터 세트는 중복, 노이즈, 일관되지 않은 형식 등으로 인해 지저분한 경우가 많습니다. Loon은 데이터를 압축, 중복 제거, 클러스터링한 후 Milvus로 직접 스트리밍하기 전에 Ray 및 Daft와 같은 분산 프레임워크를 사용하여 이러한 무거운 작업을 처리합니다. 그 결과, 스테이징 병목 현상이나 번거로운 형식 변환 없이 모델이 즉시 사용할 수 있는 깔끔하고 구조화된 데이터만 얻을 수 있습니다.</p>
<h3 id="Cloud-Native-Elasticity" class="common-anchor-header">클라우드 네이티브 탄력성</h3><p>두 시스템 모두 클라우드 네이티브로 구축되어 스토리지와 컴퓨팅을 독립적으로 확장할 수 있습니다. 즉, 워크로드가 기가바이트에서 페타바이트로 증가하더라도 어느 한 쪽을 과도하게 프로비저닝하거나 다른 쪽을 축소하지 않고 실시간 제공과 오프라인 교육 간에 리소스 균형을 맞출 수 있습니다.</p>
<h3 id="Future-Proof-Architecture" class="common-anchor-header">미래 지향적인 아키텍처</h3><p>가장 중요한 것은 이 아키텍처가 사용자와 함께 성장하도록 설계되었다는 점입니다. 컨텍스트 엔지니어링은 계속 진화하고 있습니다. 현재 대부분의 팀은 시맨틱 검색과 RAG 파이프라인에 집중하고 있습니다. 하지만 다음 물결에서는 여러 데이터 유형을 통합하고, 여러 데이터 유형에 걸쳐 추론하며, 에이전트 중심 워크플로우를 지원하는 등 더 많은 것이 요구될 것입니다.</p>
<p>Milvus와 Loon을 사용하면 이러한 전환을 위해 기반을 뜯어고칠 필요가 없습니다. 현재의 사용 사례를 지원하는 동일한 스택을 미래의 사용 사례로 자연스럽게 확장할 수 있습니다. 처음부터 다시 시작할 필요 없이 새로운 기능을 추가할 수 있으므로 AI 워크로드가 더욱 복잡해짐에 따라 위험은 줄어들고 비용은 절감되며 보다 원활한 경로를 확보할 수 있습니다.</p>
<h2 id="Your-Next-Move" class="common-anchor-header">다음 단계<button data-href="#Your-Next-Move" class="anchor-icon" translate="no">
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
    </button></h2><p>컨텍스트 엔지니어링은 단순한 기술 분야가 아니라 AI의 창의적인 잠재력을 발휘하는 동시에 안정성을 유지하는 방법입니다. 이러한 아이디어를 실행에 옮길 준비가 되었다면 가장 중요한 부분부터 시작하세요.</p>
<ul>
<li><p><a href="https://milvus.io/docs/overview.md"><strong>Milvus로 실험하여</strong></a> 벡터 데이터베이스가 실제 배포에서 검색을 어떻게 고정시킬 수 있는지 알아보세요.</p></li>
<li><p><a href="https://www.linkedin.com/company/the-milvus-project/"><strong>Milvus를 팔로우하여</strong></a> Loon의 출시에 대한 업데이트와 대규모 멀티모달 데이터 관리에 대한 인사이트를 확인하세요.</p></li>
<li><p><a href="https://discord.com/invite/8uyFbECzPX"><strong>Discord의 Zilliz 커뮤니티에 가입하여</strong></a> 전략을 공유하고, 아키텍처를 비교하고, 모범 사례를 만들어보세요.</p></li>
</ul>
<p>오늘날 컨텍스트 엔지니어링을 마스터하는 기업이 미래의 AI 환경을 주도할 것입니다. 인프라가 제약이 되지 않도록 AI 창의성을 발휘할 수 있는 기반을 구축하세요.</p>
