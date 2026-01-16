---
id: llm-context-pruning-a-developers-guide-to-better-rag-and-agentic-ai-results.md
title: 'LLM 컨텍스트 프루닝: 더 나은 RAG 및 에이전트 AI 결과를 위한 개발자 가이드'
author: Cheney Zhang
date: 2026-01-15T00:00:00.000Z
cover: assets.zilliz.com/context_pruning_cover_d1b034ba67.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Context Pruning, RAG, long context LLMs, context engineering'
meta_title: |
  LLM Context Pruning: Improving RAG and Agentic AI Systems
desc: >-
  긴 컨텍스트 RAG 시스템에서 컨텍스트 가지치기가 어떻게 작동하는지, 왜 중요한지, 프로방스 같은 모델이 시맨틱 필터링을 가능하게 하고
  실제로 어떻게 작동하는지 알아보세요.
origin: >-
  https://milvus.io/blog/llm-context-pruning-a-developers-guide-to-better-rag-and-agentic-ai-results.md
---
<p>최근 LLM의 컨텍스트 창은 점점 커지고 있습니다. 일부 모델은 한 번에 백만 개 이상의 토큰을 사용할 수 있으며, 새로운 릴리스가 나올 때마다 그 수치는 더 높아지는 것 같습니다. 흥미롭지만 실제로 긴 컨텍스트를 사용하는 것을 구축해 본 적이 있다면 <em>가능한</em> 것과 <em>유용한</em> 것 사이에는 차이가 있다는 것을 알 것입니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/LLM_Leaderboard_7c64e4a18c.PNG" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>모델이 한 번의 프롬프트로 책 한 권을 읽을 <em>수</em> 있다고 해서 무조건 그렇게 해야 한다는 의미는 아닙니다. 대부분의 긴 입력은 모델에 필요하지 않은 내용으로 가득 차 있습니다. 수십만 개의 토큰을 프롬프트에 덤핑하기 시작하면 모델이 한 번에 모든 것에 주의를 기울이려고 하기 때문에 일반적으로 응답 속도가 느려지고 컴퓨팅 비용이 증가하며 때로는 품질이 낮은 답변이 나오게 됩니다.</p>
<p>따라서 컨텍스트 창이 계속 커지더라도 <strong>실제로 거기에 무엇을 넣어야 할까요?</strong> 바로 여기에 <strong>컨텍스트 프루닝이</strong> 등장합니다. 이는 기본적으로 검색하거나 조합한 컨텍스트에서 모델이 질문에 답하는 데 도움이 되지 않는 부분을 잘라내는 프로세스입니다. 올바르게 수행하면 시스템을 빠르고 안정적이며 훨씬 더 예측 가능하게 유지할 수 있습니다.</p>
<p>이 문서에서는 긴 컨텍스트가 종종 예상과 다르게 작동하는 이유, 가지치기를 통해 상황을 통제하는 방법, 그리고 설정을 더 복잡하게 만들지 않고 실제 RAG 파이프라인에 <strong>Provence와</strong> 같은 가지치기 도구를 적용하는 방법에 대해 설명합니다.</p>
<h2 id="Four-Common-Failure-Modes-in-Long-Context-Systems" class="common-anchor-header">긴 컨텍스트 시스템에서 흔히 발생하는 네 가지 장애 모드<button data-href="#Four-Common-Failure-Modes-in-Long-Context-Systems" class="anchor-icon" translate="no">
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
    </button></h2><p>컨텍스트 창이 크다고 해서 마술처럼 모델이 더 똑똑해지는 것은 아닙니다. 오히려 프롬프트에 많은 정보를 채우기 시작하면 완전히 새로운 방식으로 문제가 발생할 수 있습니다. 다음은 긴 컨텍스트 또는 RAG 시스템을 구축할 때 항상 직면하게 되는 네 가지 문제입니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Four_Failure_Modes_e9b9bcb3b2.PNG" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="1-Context-Clash" class="common-anchor-header">1. 컨텍스트 충돌</h3><p>컨텍스트 충돌은 여러 턴에 걸쳐 축적된 정보가 내부적으로 모순될 때 발생합니다.</p>
<p>예를 들어 사용자가 대화 초반에 "나는 사과를 좋아해요"라고 말했다가 나중에 "나는 과일을 좋아하지 않아요"라고 말할 수 있습니다. 두 진술이 모두 컨텍스트에 남아 있으면 모델은 충돌을 해결할 신뢰할 수 있는 방법이 없어 일관되지 않거나 주저하는 응답으로 이어집니다.</p>
<h3 id="2-Context-Confusion" class="common-anchor-header">2. 문맥 혼동</h3><p>문맥 혼동은 문맥에 관련성이 없거나 관련성이 약한 정보가 많이 포함되어 있어 모델이 올바른 작업이나 도구를 선택하기 어려울 때 발생합니다.</p>
<p>이 문제는 특히 도구 증강 시스템에서 두드러집니다. 컨텍스트가 관련 없는 세부 정보로 복잡하면 모델이 사용자의 의도를 잘못 해석하여 잘못된 도구나 작업을 선택할 수 있는데, 이는 올바른 옵션이 없어서가 아니라 신호가 노이즈에 묻혀 있기 때문입니다.</p>
<h3 id="3-Context-Distraction" class="common-anchor-header">3. 컨텍스트 산만</h3><p>컨텍스트 주의 분산은 과도한 컨텍스트 정보가 모델의 주의를 산만하게 하여 사전 학습된 지식과 일반적인 추론에 대한 의존도를 낮출 때 발생합니다.</p>
<p>모델은 광범위하게 학습된 패턴에 의존하는 대신, 불완전하거나 신뢰할 수 없는 경우에도 맥락에서 최근의 세부 정보에 가중치를 부여합니다. 이로 인해 더 높은 수준의 이해를 적용하기보다는 문맥을 너무 가깝게 반영하는 얕거나 취약한 추론으로 이어질 수 있습니다.</p>
<h3 id="4-Context-Poisoning" class="common-anchor-header">4. 컨텍스트 중독</h3><p>문맥 중독은 잘못된 정보가 문맥에 들어와 여러 차례에 걸쳐 반복적으로 참조되고 강화될 때 발생합니다.</p>
<p>대화 초반에 도입된 하나의 잘못된 진술이 이후 추론의 근거가 될 수 있습니다. 대화가 계속 진행됨에 따라 모델은 이 잘못된 가정을 기반으로 구축되어 오류를 가중시키고 정답에서 점점 더 멀어지게 됩니다.</p>
<h2 id="What-Is-Context-Pruning-and-Why-It-Matters" class="common-anchor-header">컨텍스트 프루닝이란 무엇이며 중요한 이유<button data-href="#What-Is-Context-Pruning-and-Why-It-Matters" class="anchor-icon" translate="no">
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
    </button></h2><p>긴 컨텍스트를 다루기 시작하면 상황을 통제하기 위해 한 가지 이상의 트릭이 필요하다는 것을 금방 깨닫게 됩니다. 실제 시스템에서 팀은 보통 여러 가지 전술, 즉 걸레질, 도구 로드아웃, 요약, 특정 메시지 격리, 오래된 기록 오프로드 등을 조합하여 사용합니다. 모두 서로 다른 방식으로 도움이 됩니다. 하지만 <strong>컨텍스트 프루닝은</strong> 모델에 <em>실제로 공급되는 내용을</em> 직접 결정하는 기능입니다.</p>
<p>컨텍스트 가지치기는 간단히 말해 관련성이 없거나 가치가 낮거나 상충되는 정보를 모델의 컨텍스트 창에 들어가기 전에 자동으로 제거하는 프로세스입니다. 기본적으로 현재 작업에 가장 중요할 가능성이 높은 텍스트 조각만 유지하는 필터입니다.</p>
<p>다른 전략으로는 컨텍스트를 재구성하거나, 압축하거나, 나중에 사용할 수 있도록 일부 부분을 옆으로 미룰 수 있습니다. 가지치기는 <strong>"이 정보를 프롬프트에 넣어야 하는가?"라는 질문에 답하는</strong> 보다 직접적인 방법입니다.</p>
<p>그렇기 때문에 RAG 시스템에서 가지치기가 특히 중요한 것입니다. 벡터 검색은 훌륭하지만 완벽하지는 않습니다. 어떤 것은 유용하고, 어떤 것은 느슨하게 연관되어 있으며, 어떤 것은 완전히 엉뚱한 후보를 반환하는 경우가 많습니다. 이 모든 것을 프롬프트에 덤프하면 앞서 다룬 실패 모드에 부딪히게 됩니다. 가지치기는 검색과 모델 사이에 위치하며, 어떤 청크를 유지할지 결정하는 게이트키퍼 역할을 합니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/RAG_Pipeline_with_Context_Pruning_01a0d40819.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>가지 치기가 잘 작동하면 문맥이 더 깔끔해지고, 답변이 더 일관되며, 토큰 사용량이 줄어들고, 관련 없는 텍스트가 몰래 들어오는 이상한 부작용이 줄어드는 등 이점이 즉시 나타납니다. 검색 설정에 대해 아무것도 변경하지 않더라도 확실한 가지치기 단계를 추가하면 전반적인 시스템 성능이 눈에 띄게 향상될 수 있습니다.</p>
<p>실제로 프루닝은 긴 컨텍스트 또는 RAG 파이프라인에서 가장 활용도가 높은 최적화 중 하나로, 간단한 아이디어로 큰 효과를 볼 수 있습니다.</p>
<h2 id="Provence-A-Practical-Context-Pruning-Model" class="common-anchor-header">프로방스: 실용적인 컨텍스트 프루닝 모델<button data-href="#Provence-A-Practical-Context-Pruning-Model" class="anchor-icon" translate="no">
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
    </button></h2><p>컨텍스트 프루닝에 대한 접근 방식을 탐색하던 중 <strong>네이버랩스 유럽에서</strong> 개발한 두 가지 매력적인 오픈소스 모델을 발견했습니다: <a href="https://huggingface.co/naver/provence-reranker-debertav3-v1"><strong>프로방스와</strong></a> 그 다국어 버전인 <a href="https://huggingface.co/naver/xprovence-reranker-bgem3-v1"><strong>XProvence입니다</strong></a>.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/provence1_b9d2c43276.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>프로방스는 검색 증강 생성을 위한 경량 문맥 가지치기 모델을 훈련하는 방법으로, 특히 질문 답변에 중점을 두고 있습니다. 사용자 질문과 검색된 구절이 주어지면 관련 없는 문장을 식별하고 제거하여 최종 답변에 기여하는 정보만 유지합니다.</p>
<p>프로방스는 생성 전에 가치가 낮은 콘텐츠를 제거함으로써 모델 입력의 노이즈를 줄이고 프롬프트를 단축하며 LLM 추론 지연 시간을 줄입니다. 또한 플러그 앤 플레이 방식으로, 긴밀한 통합이나 아키텍처 변경 없이도 모든 LLM 또는 검색 시스템과 함께 작동합니다.</p>
<p>프로방스는 실제 RAG 파이프라인을 위한 몇 가지 실용적인 기능을 제공합니다.</p>
<p><strong>1. 문서 수준 이해</strong></p>
<p>Provence는 문장을 개별적으로 채점하지 않고 문서 전체에 대해 추론합니다. 이는 실제 문서에 "그것", "이것" 또는 "위의 방법"과 같은 참조가 자주 포함되기 때문에 중요합니다. 이러한 문장은 개별적으로 보면 의미가 모호하거나 심지어 무의미할 수도 있습니다. 문맥에서 보면 관련성이 명확해집니다. Provence는 문서를 전체적으로 모델링함으로써 보다 정확하고 일관된 가지치기 결정을 내릴 수 있습니다.</p>
<p><strong>2. 적응형 문장 선택</strong></p>
<p>Provence는 검색된 문서에서 얼마나 많은 문장을 유지할지 자동으로 결정합니다. "상위 5개 문장 유지"와 같은 고정된 규칙에 의존하는 대신 쿼리와 콘텐츠에 따라 적응합니다.</p>
<p>어떤 질문은 한 문장으로 답변할 수 있는 반면, 어떤 질문은 여러 개의 근거 문장이 필요합니다. Provence는 도메인 전반에서 잘 작동하고 필요할 때 조정할 수 있는 관련성 임계값을 사용하여 이러한 변화를 동적으로 처리하며, 대부분의 경우 수동 조정 없이도 가능합니다.</p>
<p><strong>3. 통합 리랭킹을 통한 높은 효율성</strong></p>
<p>프로방스는 효율적으로 설계되었습니다. 작고 가벼운 모델이기 때문에 LLM 기반 프루닝 접근 방식보다 훨씬 빠르고 저렴하게 실행할 수 있습니다.</p>
<p>더 중요한 것은, 프로방스는 리랭크와 컨텍스트 프루닝을 단일 단계로 결합할 수 있다는 점입니다. 재랭크는 이미 최신 RAG 파이프라인에서 표준 단계이므로 이 시점에서 가지치기를 통합하면 컨텍스트 가지치기의 추가 비용이 0에 가까워지면서도 언어 모델에 전달되는 컨텍스트의 품질은 향상됩니다.</p>
<p><strong>4. XProvence를 통한 다국어 지원</strong></p>
<p>Provence에는 동일한 아키텍처를 사용하지만 다국어 데이터에 대해 학습된 XProvence라는 변형도 있습니다. 따라서 중국어, 영어, 한국어 등 여러 언어에 걸쳐 쿼리와 문서를 평가할 수 있으므로 다국어 및 교차 언어 RAG 시스템에 적합합니다.</p>
<h3 id="How-Provence-Is-Trained" class="common-anchor-header">프로방스의 학습 방법</h3><p>Provence는 크로스 인코더 아키텍처에 기반한 깔끔하고 효과적인 훈련 설계를 사용합니다. 훈련 중에 쿼리와 검색된 각 구절이 하나의 입력으로 연결되고 함께 인코딩됩니다. 이를 통해 모델은 질문과 구절의 전체 맥락을 한 번에 관찰하고 관련성을 직접 추론할 수 있습니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/provence2_80523f7a9e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>이 공동 인코딩을 통해 프로방스는 세분화된 관련성 신호를 통해 학습할 수 있습니다. 이 모델은 경량 인코더로서 <a href="https://zilliz.com/ai-faq/what-is-the-difference-between-bert-roberta-and-deberta-for-embeddings"><strong>DeBERTa에서</strong></a> 미세 조정되어 두 가지 작업을 동시에 수행하도록 최적화되었습니다:</p>
<ol>
<li><p><strong>문서 수준 연관성 점수(재순위 점수):</strong> 이 모델은 전체 문서에 대한 연관성 점수를 예측하여 쿼리와 얼마나 잘 일치하는지를 나타냅니다. 예를 들어, 0.8점은 높은 연관성을 나타냅니다.</p></li>
<li><p><strong>토큰 수준의 연관성 라벨링(바이너리 마스크):</strong> 이와 동시에 모델은 각 토큰에 이진 레이블을 할당하여 쿼리와 관련성이 있는지(<code translate="no">1</code>) 또는 관련성이 없는지(<code translate="no">0</code>) 표시합니다.</p></li>
</ol>
<p>그 결과, 훈련된 모델은 문서의 전반적인 관련성을 평가하고 어떤 부분을 유지하거나 제거해야 하는지 식별할 수 있습니다.</p>
<p>추론 시, 프로방스는 토큰 수준에서 관련성 레이블을 예측합니다. 그런 다음 이러한 예측은 문장 수준에서 집계됩니다. 관련성이 낮은 토큰보다 관련성이 높은 토큰이 더 많이 포함된 문장은 유지되고 그렇지 않은 문장은 잘려나갑니다. 모델은 문장 수준의 감독을 통해 학습되기 때문에 같은 문장 내의 토큰 예측은 일관성을 유지하는 경향이 있으므로 이 집계 전략은 실제로 신뢰할 수 있습니다. 또한 집계 임계값을 조정하여 더 보수적이거나 더 공격적인 가지치기를 달성함으로써 가지치기 동작을 조정할 수도 있습니다.</p>
<p>결정적으로, 프로방스는 대부분의 RAG 파이프라인에 이미 포함되어 있는 재랭크 단계를 재사용합니다. 즉, 추가 오버헤드가 거의 또는 전혀 없이 컨텍스트 가지치기를 추가할 수 있으므로 실제 RAG 시스템에 특히 실용적입니다.</p>
<h2 id="Evaluating-Context-Pruning-Performance-Across-Models" class="common-anchor-header">여러 모델에서 컨텍스트 프루닝 성능 평가하기<button data-href="#Evaluating-Context-Pruning-Performance-Across-Models" class="anchor-icon" translate="no">
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
    </button></h2><p>지금까지는 프로방스의 설계와 교육에 중점을 두었습니다. 다음 단계는 실제 성능을 평가하는 것입니다. 컨텍스트를 얼마나 잘 정리하는지, 다른 접근 방식과 어떻게 비교되는지, 실제 조건에서 어떻게 작동하는지 등입니다.</p>
<p>이러한 질문에 답하기 위해 실제 평가 환경에서 여러 모델에 걸쳐 문맥 정리 품질을 비교하는 일련의 정량적 실험을 설계했습니다.</p>
<p>이 실험은 두 가지 주요 목표에 초점을 맞췄습니다:</p>
<ul>
<li><p><strong>가지치기 효과:</strong> 각 모델이 관련 없는 정보를 제거하면서 관련성 있는 콘텐츠를 얼마나 정확하게 유지하는지 측정하기 위해 정확도, 회상도, F1 점수 등의 표준 메트릭을 사용합니다.</p></li>
<li><p><strong>도메인 외 일반화:</strong> 각 모델이 학습 데이터와 다른 데이터 분포에서 얼마나 잘 작동하는지 평가하여 도메인 외 시나리오에서의 견고성을 평가합니다.</p></li>
</ul>
<h3 id="Models-Compared" class="common-anchor-header">비교 모델</h3><ul>
<li><p><a href="https://huggingface.co/naver/provence-reranker-debertav3-v1"><strong>프로방스</strong></a></p></li>
<li><p><a href="https://huggingface.co/naver/xprovence-reranker-bgem3-v1"><strong>XProvence</strong></a></p></li>
<li><p><a href="https://huggingface.co/opensearch-project/opensearch-semantic-highlighter-v1"><strong>OpenSearch 시맨틱 하이라이터</strong></a> (시맨틱 하이라이터 작업을 위해 특별히 설계된 BERT 아키텍처 기반의 가지치기 모델)</p></li>
</ul>
<h3 id="Dataset" class="common-anchor-header">데이터 세트</h3><p>평가 데이터셋으로 WikiText-2를 사용합니다. WikiText-2는 Wikipedia 문서에서 파생된 것으로, 관련 정보가 여러 문장에 분산되어 있고 의미 관계가 명확하지 않을 수 있는 다양한 문서 구조를 포함합니다.</p>
<p>중요한 점은 WikiText-2는 일반적으로 문맥 정리 모델을 훈련하는 데 사용되는 데이터와 크게 다르면서도 실제 지식이 많은 콘텐츠와 유사하다는 점입니다. 따라서 실험의 핵심 초점인 도메인 외부 평가에 매우 적합합니다.</p>
<h3 id="Query-Generation-and-Annotation" class="common-anchor-header">쿼리 생성 및 어노테이션</h3><p>도메인 외부 가지치기 작업을 구성하기 위해, 우리는 <strong>GPT-4o-mini를</strong> 사용하여 원시 WikiText-2 코퍼스에서 질문-답변 쌍을 자동으로 생성합니다. 각 평가 샘플은 세 가지 구성 요소로 이루어져 있습니다:</p>
<ul>
<li><p><strong>쿼리:</strong> 쿼리: 문서에서 생성된 자연어 질문입니다.</p></li>
<li><p><strong>컨텍스트:</strong> 문맥: 수정되지 않은 완전한 문서입니다.</p></li>
<li><p><strong>근거 자료:</strong> 답을 포함하는 문장(유지해야 할 문장)과 관련 없는 문장(정리해야 할 문장)을 나타내는 문장 수준 주석.</p></li>
</ul>
<p>이 설정은 자연스럽게 문맥 정리 작업을 정의합니다. 쿼리와 전체 문서가 주어지면 모델은 실제로 중요한 문장을 식별해야 합니다. 답을 포함하는 문장은 관련성이 있는 것으로 표시되어 유지되어야 하고, 그 외의 모든 문장은 관련성이 없는 것으로 처리되어 가지치기를 해야 합니다. 이 공식은 정확도, 회상도, F1 점수를 사용하여 가지치기 품질을 정량적으로 측정할 수 있게 해줍니다.</p>
<p>결정적으로, 생성된 질문은 평가된 모델의 훈련 데이터에 나타나지 않습니다. 그 결과, 성능은 암기가 아닌 진정한 일반화를 반영합니다. 실제 사용 패턴을 더 잘 반영하기 위해 간단한 사실 기반 질문, 멀티홉 추론 작업, 보다 복잡한 분석 프롬프트에 걸쳐 총 300개의 샘플을 생성합니다.</p>
<h3 id="Evaluation-Pipeline" class="common-anchor-header">평가 파이프라인</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/pipeline_77e52002fc.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>하이퍼파라미터 최적화: 각 모델에 대해 미리 정의된 하이퍼파라미터 공간에서 그리드 검색을 수행하여 F1 점수를 최대화하는 구성을 선택합니다.</p>
<h3 id="Results-and-Analysis" class="common-anchor-header">결과 및 분석</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/result_0df098152a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>결과는 세 모델 간에 뚜렷한 성능 차이를 보여줍니다.</p>
<p><strong>프로방스는</strong> <strong>F1 점수 66.76%로</strong> 가장 강력한 성능을 달성했습니다. 정확도<strong>(69.53%</strong>)와 재인식률<strong>(64.19%</strong>)도 균형이 잘 잡혀 있어 강력한 도메인 외 일반화를 나타냅니다. 최적의 구성은 <strong>0.6의</strong> 가지치기 임계값과 <strong>α = 0.051을</strong> 사용하여 모델의 관련성 점수가 잘 보정되고 가지치기 동작이 직관적이고 실제로 조정하기 쉽다는 것을 시사합니다.</p>
<p><strong>XProvence의</strong> <strong>F1 점수는 58.97%로</strong>, <strong>높은</strong> <strong>정확도</strong> <strong>(75.52%</strong> )와 <strong>낮은 정확도(48.37%</strong>)가 특징입니다. 이는 노이즈를 공격적으로 제거하는 것보다 잠재적으로 관련성이 있는 정보를 유지하는 것을 우선시하는 보다 보수적인 가지치기 전략을 반영합니다. 이러한 방식은 의료나 법률 애플리케이션과 같이 오탐으로 인한 비용이 많이 드는 분야에서는 바람직할 수 있지만, 오탐을 증가시켜 정확도를 낮추는 단점이 있습니다. 이러한 장단점에도 불구하고 XProvence의 다국어 기능은 비영어권 또는 다국어 환경에서 강력한 옵션이 될 수 있습니다.</p>
<p>반면, <strong>OpenSearch 시맨틱 하이라이터는</strong> <strong>F1 점수가 46.37%</strong> (정확도 <strong>62.35%</strong>, 리콜 <strong>36.98%</strong>)로 성능이 훨씬 떨어집니다. 프로방스 및 엑스프로방스와의 격차는 특히 도메인 외 조건에서 점수 보정과 도메인 외 일반화 모두에서 한계가 있음을 나타냅니다.</p>
<h2 id="Semantic-Highlighting-Another-Way-to-Find-What-Actually-Matters-in-Text" class="common-anchor-header">시맨틱 하이라이트: 텍스트에서 실제로 중요한 내용을 찾는 또 다른 방법<button data-href="#Semantic-Highlighting-Another-Way-to-Find-What-Actually-Matters-in-Text" class="anchor-icon" translate="no">
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
    </button></h2><p>이제 문맥 가지치기에 대해 이야기했으니 관련 퍼즐 조각인 시맨틱 <a href="https://milvus.io/blog/zilliz-trained-and-open-sourced-bilingual-semantic-highlighting-model-for-production-ai.md"><strong>하이라이팅에</strong></a> 대해 살펴볼 필요가 있습니다. 기술적으로는 두 기능 모두 쿼리와 얼마나 관련성이 있는지에 따라 텍스트의 점수를 매기는 거의 동일한 기본 작업을 수행합니다. 차이점은 파이프라인에서 결과를 사용하는 방식입니다.</p>
<p>대부분의 사람들은 "강조 표시"라고 하면 Elasticsearch나 Solr에서 볼 수 있는 고전적인 키워드 하이라이터를 떠올리게 됩니다. 이러한 도구는 기본적으로 문자 그대로 일치하는 키워드를 찾아 <code translate="no">&lt;em&gt;</code> 와 같은 형식으로 감싸줍니다. 저렴하고 예측 가능하지만 텍스트가 쿼리와 <em>정확히</em> 동일한 단어를 사용할 때만 작동합니다. 문서가 의역을 하거나 동의어를 사용하거나 아이디어를 다르게 표현하는 경우, 기존 하이라이터는 이를 완전히 놓칩니다.</p>
<p><strong>시맨틱 하이라이팅은 다른 경로를 사용합니다.</strong> 정확한 문자열 일치 여부를 확인하는 대신, 모델을 사용해 쿼리와 다른 텍스트 범위 사이의 의미적 유사성을 추정합니다. 이를 통해 문구가 완전히 다른 경우에도 관련 콘텐츠를 강조 표시할 수 있습니다. RAG 파이프라인, 에이전트 워크플로 또는 토큰보다 의미가 더 중요한 모든 AI 검색 시스템의 경우, 시맨틱 강조 표시를 사용하면 문서가 검색된 <em>이유를</em> 훨씬 더 명확하게 파악할 수 있습니다.</p>
<p>문제는 대부분의 기존 시맨틱 강조 표시 솔루션이 프로덕션 AI 워크로드용으로 구축되지 않았다는 점입니다. 사용 가능한 모든 솔루션을 테스트해 본 결과, 실제 RAG 및 에이전트 시스템에 필요한 수준의 정밀도, 지연 시간 또는 다국어 안정성을 제공하는 솔루션은 없었습니다. 그래서 결국 자체 모델을 훈련하고 오픈 소스화했습니다. <a href="https://huggingface.co/zilliz/semantic-highlight-bilingual-v1">zilliz/semantic-highlight-bilingual-v1</a></p>
<p>높은 수준에서 보면, <strong>문맥 정리와 시맨틱 하이라이트는</strong> 쿼리와 텍스트 덩어리가 주어지면 실제로 중요한 부분을 파악하는 <strong>동일한 핵심 작업을 해결합니다</strong>. 유일한 차이점은 다음에 일어나는 일입니다.</p>
<ul>
<li><p><strong>문맥</strong> 가지치기는 생성 전에 관련 없는 부분을 삭제합니다.</p></li>
<li><p><strong>시맨틱 강조 표시는</strong> 전체 텍스트는 유지하되 중요한 부분을 시각적으로 드러냅니다.</p></li>
</ul>
<p>기본 작업이 매우 유사하기 때문에 동일한 모델이 두 기능을 모두 지원할 수 있는 경우가 많습니다. 따라서 스택 전체에서 구성 요소를 재사용하기가 더 쉬워지고 RAG 시스템이 전반적으로 더 간단하고 효율적으로 유지됩니다.</p>
<h3 id="Semantic-Highlighting-in-Milvus-and-Zilliz-Cloud" class="common-anchor-header">Milvus 및 Zilliz Cloud의 시맨틱 강조 표시</h3><p>시맨틱 강조 표시 기능은 이제 <a href="https://milvus.io">Milvus와</a> <a href="https://zilliz.com/cloud"><strong>Zilliz Cloud</strong></a> (Milvus의 완전 관리형 서비스)에서 완벽하게 지원되며, 이미 RAG 또는 AI 기반 검색을 사용하는 모든 사용자에게 유용하다는 것이 입증되고 있습니다. 이 기능은 매우 간단하지만 골치 아픈 문제를 해결합니다. 벡터 검색이 수많은 청크를 반환할 때, <em>그 청크들 중에서 실제로 중요한 문장을</em> 어떻게 빠르게 파악할 수 있을까요?</p>
<p>강조 표시가 없으면 사용자는 검색된 이유를 이해하기 위해 전체 문서를 읽게 됩니다. 의미론적 강조 표시 기능이 내장된 Milvus와 Zilliz Cloud는 문구가 다르더라도 검색어와 의미론적으로 관련된 특정 구간에 자동으로 표시를 해줍니다. 더 이상 키워드 일치 항목을 찾거나 청크가 표시된 이유를 추측할 필요가 없습니다.</p>
<p>검색이 훨씬 더 투명해집니다. Milvus는 단순히 '관련 문서'를 반환하는 대신 관련성이 있는 <em>위치를</em> 보여줍니다. RAG 파이프라인의 경우, 이 기능이 특히 유용합니다. 모델이 어떤 부분에 집중해야 하는지 즉시 확인할 수 있으므로 디버깅과 신속한 구축이 훨씬 쉬워지기 때문입니다.</p>
<p>이러한 지원은 Milvus와 Zilliz Cloud에 직접 구축되었기 때문에 사용 가능한 어트리뷰션을 얻기 위해 외부 모델을 추가하거나 다른 서비스를 실행할 필요가 없습니다. 벡터 검색 → 관련성 점수 → 강조 표시된 스팬 등 모든 것이 검색 경로 내에서 실행됩니다. 대규모로 즉시 작동하며 <a href="https://huggingface.co/zilliz/semantic-highlight-bilingual-v1">zilliz/semantic-highlight-bilingual-v1</a> 모델을 통해 다국어 워크로드를 지원합니다.</p>
<h2 id="Looking-Ahead" class="common-anchor-header">앞으로의 전망<button data-href="#Looking-Ahead" class="anchor-icon" translate="no">
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
    </button></h2><p>컨텍스트 엔지니어링은 아직 새로운 기술이며, 아직 해결해야 할 부분이 많이 남아 있습니다. <a href="https://milvus.io">Milvus와</a> <a href="https://zilliz.com/cloud"><strong>Zilliz Cloud</strong></a> 내에서 가지치기와 시맨틱 하이라이트가 잘 작동하고<strong> 있지만</strong> 아직 이야기의 끝이 아닙니다. 속도 저하 없이 가지치기 모델을 더 정확하게 만들고, 이상하거나 도메인을 벗어난 쿼리를 더 잘 처리하며, 검색 → 재랭크 → 가지치기 → 강조 표시가 서로 붙어 있는 해킹 세트가 아니라 하나의 깨끗한 파이프라인처럼 느껴지도록 모든 조각을 함께 연결하는 등 실제 엔지니어링 작업이 필요한 영역이 아직 많이 남아 있습니다.</p>
<p>컨텍스트 창이 계속 늘어남에 따라 이러한 결정은 더욱 중요해지고 있습니다. 우수한 컨텍스트 관리는 더 이상 '좋은 보너스'가 아니라, 긴 컨텍스트와 RAG 시스템을 안정적으로 작동시키는 핵심적인 부분이 되고 있습니다.</p>
<p>저희는 계속해서 실험하고 벤치마킹하여 개발자에게 실제로 도움이 되는 부분을 출시할 예정입니다. 목표는 간단합니다. 지저분한 데이터, 예측할 수 없는 쿼리 또는 대규모 워크로드에서도 고장 나지 않는 시스템을 더 쉽게 구축할 수 있도록 하는 것입니다.</p>
<p>이와 관련된 이야기를 나누고 싶거나 디버깅에 도움이 필요하다면 <a href="https://discord.com/invite/8uyFbECzPX">Discord 채널에</a> 접속하거나<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus 오피스 아워를</a> 통해 20분간 일대일 세션을 예약하여 인사이트, 안내, 질문에 대한 답변을 얻을 수 있습니다.</p>
<p>다른 빌더와 언제든지 채팅하고 노트를 교환할 수 있습니다.</p>
