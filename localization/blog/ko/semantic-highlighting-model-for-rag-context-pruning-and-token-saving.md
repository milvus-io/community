---
id: semantic-highlighting-model-for-rag-context-pruning-and-token-saving.md
title: RAG 컨텍스트 가지치기 및 토큰 저장을 위한 시맨틱 하이라이트 모델을 구축한 방법
author: 'Cheney Zhang, Jiang Chen'
date: 2026-1-19
cover: 'https://assets.zilliz.com/semantic_highlight2_cover_1406d8b11e.png'
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  semantic highlighting, RAG, context pruning, RAG noise filtering, context
  engineering
meta_title: |
  Semantic Highlighting for RAG Context Pruning and Token Saving
desc: >-
  질리즈가 인코더 전용 아키텍처, LLM 추론, 대규모 이중 언어 학습 데이터를 사용하여 RAG 노이즈 필터링, 문맥 정리, 토큰 저장을 위한
  시맨틱 하이라이트 모델을 구축한 방법을 알아보세요.
origin: >-
  https://milvus.io/blog/semantic-highlighting-model-for-rag-context-pruning-and-token-saving.md
---
<h2 id="The-Problem-RAG-Noise-and-Token-Waste" class="common-anchor-header">문제: RAG 노이즈 및 토큰 낭비<button data-href="#The-Problem-RAG-Noise-and-Token-Waste" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>벡터 검색은</strong> 엔터프라이즈 어시스턴트, AI 에이전트, 고객 지원 봇 등 RAG 시스템을 위한 견고한 기반입니다. 중요한 문서를 안정적으로 찾아냅니다. 하지만 검색만으로는 컨텍스트 문제를 해결하지 못합니다. 잘 조정된 인덱스조차도 광범위하게 관련성이 있는 청크를 반환하지만, 그 청크 안의 문장 중 실제로 쿼리에 대한 답변은 극히 일부에 불과합니다.</p>
<p>프로덕션 시스템에서는 이러한 격차가 즉시 나타납니다. 하나의 쿼리가 각각 수천 개의 토큰 길이를 가진 수십 개의 문서를 가져올 수 있습니다. 실제 신호가 포함된 문장은 소수에 불과하며, 나머지는 토큰 사용량을 늘리고 추론 속도를 늦추며 종종 LLM의 주의를 분산시키는 컨텍스트입니다. 쿼리 자체가 다단계 추론의 결과물이고 검색된 텍스트의 작은 부분만 일치하는 에이전트 워크플로우에서는 문제가 더욱 분명해집니다.</p>
<p>따라서 <em>유용한 문장을</em> <em><strong>식별하고 강조 표시하고</strong></em> <em>나머지는 무시할</em>수 있는 모델, 즉 문장 수준의 관련성 필터링 또는 많은 팀에서 <a href="https://milvus.io/blog/llm-context-pruning-a-developers-guide-to-better-rag-and-agentic-ai-results.md"><strong>컨텍스트</strong></a> 가지치기라고 부르는 모델이 분명하게 필요하게 됩니다. 목표는 간단합니다. 중요한 부분은 유지하고 노이즈는 LLM에 도달하기 전에 제거하는 것입니다.</p>
<p>기존의 키워드 기반 강조 표시로는 이 문제를 해결할 수 없습니다. 예를 들어 사용자가 "파이썬 코드 실행 효율을 높이려면 어떻게 해야 하나요?"라고 묻는 경우, 키워드 하이라이터는 "파이썬"과 "효율성"을 선택하지만 쿼리와 키워드를 공유하지 않기 때문에 실제로 질문에 대한 답인 "루프 대신 NumPy 벡터화된 연산을 사용하세요"라는 문장을 놓칩니다. 대신 필요한 것은 문자열 매칭이 아니라 의미론적 이해입니다.</p>
<h2 id="A-Semantic-Highlighting-Model-for-RAG-Noise-Filtering-and-Context-Pruning" class="common-anchor-header">RAG 노이즈 필터링 및 컨텍스트 프루닝을 위한 시맨틱 강조 모델<button data-href="#A-Semantic-Highlighting-Model-for-RAG-Noise-Filtering-and-Context-Pruning" class="anchor-icon" translate="no">
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
    </button></h2><p>RAG 빌더가 이 작업을 쉽게 수행할 수 있도록, 검색된 문서에서 쿼리와 의미적으로 더 일치하는 문장을 식별하고 강조 표시하는 <a href="https://huggingface.co/zilliz/semantic-highlight-bilingual-v1"><strong>시맨틱 강조 표시 모델을</strong></a> 학습시키고 오픈 소스화했습니다. 이 모델은 현재 영어와 중국어 모두에서 최신 성능을 제공하며, 기존 RAG 파이프라인에 바로 삽입할 수 있도록 설계되었습니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/context_pruning_80f7b16280.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>모델 세부 정보</strong></p>
<ul>
<li><p><strong>허깅페이스:</strong> <a href="https://huggingface.co/zilliz/semantic-highlight-bilingual-v1">zilliz/semantic-highlight-bilingual-v1</a></p></li>
<li><p><strong>라이선스:</strong> MIT(상업용)</p></li>
<li><p><strong>아키텍처:</strong> 0.6B 인코더 전용 모델(BGE-M3 Reranker v2 기반)</p></li>
<li><p><strong>컨텍스트 창:</strong> 8192 토큰</p></li>
<li><p><strong>지원 언어:</strong> 영어 및 중국어</p></li>
</ul>
<p>시맨틱 강조 표시는 긴 검색 문서에서 유용한 부분만 선택하는 데 필요한 관련성 신호를 제공합니다. 실제로 이 모델은 다음을 가능하게 합니다:</p>
<ul>
<li><p>문서에서 실제로 중요한 부분을 표시하여<strong>해석 가능성 향상</strong></p></li>
<li><p>강조 표시된 문장만 LLM으로 전송하여<strong>토큰 비용 70~80% 절감</strong> </p></li>
<li><p>모델이 관련 없는 문맥을 덜 보기 때문에<strong>답변 품질 향상</strong></p></li>
<li><p>엔지니어가 문장 수준의 일치 여부를 직접 검사할 수 있으므로<strong>디버깅이 더 쉬워짐</strong></p></li>
</ul>
<h3 id="Evaluation-Results-Achieving-SOTA-Performance" class="common-anchor-header">평가 결과: SOTA 성능 달성</h3><p>영어와 중국어를 아우르는 여러 데이터 세트에서 도메인 내 및 도메인 외부 조건 모두에서 시맨틱 강조 표시 모델을 평가했습니다.</p>
<p>벤치마크 제품군은 다음과 같습니다:</p>
<ul>
<li><p><strong>영어 다중 스팬 QA:</strong> 멀티스팬큐아</p></li>
<li><p><strong>도메인 외부 영어 위키백과:</strong> 위키텍스트2</p></li>
<li><p><strong>중국어 다중 스팬 QA:</strong> multispanqa_zh</p></li>
<li><p><strong>중국어 도메인 외 위키백과:</strong> wikitext2_zh</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/benchmarking_results_25545c952f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>평가 대상 모델은 다음과 같습니다:</p>
<ul>
<li><p>오픈 프로방스 시리즈</p></li>
<li><p>네이버의 프로방스/엑스프로방스 시리즈</p></li>
<li><p>OpenSearch의 시맨틱-하이라이터</p></li>
<li><p>훈련된 이중 언어 모델: <a href="https://huggingface.co/zilliz/semantic-highlight-bilingual-v1">zilliz/semantic-highlight-bilingual-v1</a></p></li>
</ul>
<p>네 가지 데이터 세트 모두에서 이 모델이 최고 순위를 차지했습니다. 더 중요한 것은 영어와 중국어 모두에서 일관되게 우수한 성능을 보이는 <em>유일한</em> 모델이라는 점입니다. 경쟁 모델은 영어에만 집중하거나 중국어 텍스트에서 뚜렷한 성능 저하를 보입니다.</p>
<h2 id="How-We-Built-This-Semantic-Highlighting-Model" class="common-anchor-header">시맨틱 하이라이트 모델을 구축한 방법<button data-href="#How-We-Built-This-Semantic-Highlighting-Model" class="anchor-icon" translate="no">
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
    </button></h2><p>이 작업을 위한 모델을 훈련하는 것은 어려운 부분이 아니며, 앞의 문제를 처리하고 SOTA에 가까운 성능을 제공하는 <em>좋은</em> 모델을 훈련하는 것이 진짜 작업입니다. 유니티의 접근 방식은 두 가지에 중점을 두었습니다:</p>
<ul>
<li><p><strong>모델 아키텍처:</strong> 빠른 추론을 위해 인코더 전용 설계를 사용합니다.</p></li>
<li><p><strong>학습 데이터:</strong> 추론이 가능한 LLM을 사용해 고품질의 관련성 레이블을 생성하고 로컬 추론 프레임워크로 데이터 생성을 확장합니다.</p></li>
</ul>
<h3 id="Model-Architecture" class="common-anchor-header">모델 아키텍처</h3><p>저희는 문맥 가지치기를 <strong>토큰 수준의 연관성 점수 작업으로</strong> 처리하는 경량 <strong>인코더 전용</strong> 네트워크로 모델을 구축했습니다. 이 설계는 네이버가 ICLR 2025에서 소개한 컨텍스트 프루닝 접근 방식인 <a href="https://arxiv.org/html/2501.16214v1">프로방스에서</a> 영감을 받아 "올바른 청크 선택"에서 "모든 토큰 점수 매기기"로 프루닝을 재구성한 것입니다. 이러한 프레이밍은 세분화된 신호가 필수인 시맨틱 하이라이트와 자연스럽게 연계됩니다.</p>
<p>인코더 전용 모델은 최신 아키텍처는 아니지만, 빠르고 확장하기 쉬우며 모든 토큰 위치에 대한 관련성 점수를 병렬로 생성할 수 있다는 점에서 매우 실용적입니다. 프로덕션 RAG 시스템의 경우, 이러한 속도 이점은 더 큰 디코더 모델을 사용하는 것보다 훨씬 더 중요합니다.</p>
<p>토큰 수준의 정확도 점수를 계산한 후에는 이를 <strong>문장 수준의</strong> 점수로 집계합니다. 이 단계에서는 노이즈가 많은 토큰 신호를 안정적이고 해석 가능한 연관성 메트릭으로 변환합니다. 구성 가능한 임계값을 초과하는 문장은 강조 표시되고, 그 외의 모든 문장은 필터링됩니다. 이렇게 하면 쿼리에 실제로 중요한 문장을 선택하는 간단하고 신뢰할 수 있는 메커니즘이 만들어집니다.</p>
<h3 id="Inference-Process" class="common-anchor-header">추론 프로세스</h3><p>런타임에 시맨틱 강조 표시 모델은 간단한 파이프라인을 따릅니다:</p>
<ol>
<li><p><strong>입력 -</strong> 프로세스는 사용자 쿼리로 시작됩니다. 검색된 문서는 관련성 평가를 위한 후보 문맥으로 취급됩니다.</p></li>
<li><p><strong>모델 처리 -</strong> 쿼리와 컨텍스트가 하나의 시퀀스로 연결됩니다: [BOS] + 쿼리 + 컨텍스트</p></li>
<li><p><strong>토큰 점수 매기기</strong> - 컨텍스트의 각 토큰에는 쿼리와 얼마나 관련이 있는지를 반영하여 0에서 1 사이의 관련성 점수가 할당됩니다.</p></li>
<li><p><strong>문장 집계 -</strong> 토큰 점수는 일반적으로 평균을 내어 문장 수준에서 집계되어 각 문장에 대한 관련성 점수를 생성합니다.</p></li>
<li><p><strong>임계값 필터링 -</strong> 구성 가능한 임계값 이상의 점수를 가진 문장은 강조 표시되어 유지되는 반면, 점수가 낮은 문장은 다운스트림 LLM으로 전달되기 전에 필터링됩니다.</p></li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/semantic_highlighting_workflows_db3d12a666.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Base-Model-BGE-M3-Reranker-v2" class="common-anchor-header">기본 모델: BGE-M3 리랭커 v2</h3><p>여러 가지 이유로 BGE-M3 Reranker v2를 기본 모델로 선택했습니다:</p>
<ol>
<li><p>토큰 및 문장 채점에 적합한 인코더 아키텍처를 사용합니다.</p></li>
<li><p>영어와 중국어 모두에 최적화되어 여러 언어를 지원합니다.</p></li>
<li><p>긴 RAG 문서에 적합한 8192 토큰 컨텍스트 창을 제공합니다.</p></li>
<li><p>계산량이 많지 않으면서도 충분히 강력한 0.6억 개의 파라미터 유지</p></li>
<li><p>기본 모델에서 충분한 세계 지식 보장</p></li>
<li><p>관련성 판단 작업과 밀접하게 연계된 재랭킹을 위해 훈련됨</p></li>
</ol>
<h2 id="Training-Data-LLM-Annotation-with-Reasoning" class="common-anchor-header">학습 데이터: 추론이 포함된 LLM 어노테이션<button data-href="#Training-Data-LLM-Annotation-with-Reasoning" class="anchor-icon" translate="no">
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
    </button></h2><p>모델 아키텍처를 완성한 후, 다음 과제는 실제로 신뢰할 수 있는 모델을 학습시킬 데이터 세트를 구축하는 것이었습니다. 먼저 Open Provence가 이를 어떻게 처리하는지 살펴봤습니다. 그들의 접근 방식은 공개 QA 데이터 세트와 작은 LLM을 사용하여 어떤 문장이 관련성이 있는지 레이블을 지정합니다. 확장성이 뛰어나고 자동화하기 쉬워 저희에게는 좋은 기준이 되었습니다.</p>
<p>하지만 곧 그들이 설명하는 것과 같은 문제에 부딪혔습니다. LLM에 직접 문장 수준의 라벨을 출력하도록 요청하면 결과가 항상 안정적이지 않다는 것입니다. 어떤 레이블은 정확하지만 어떤 레이블은 의심스럽고 나중에 정리하기가 어렵습니다. 수작업으로 라벨을 붙이는 것보다 훨씬 더 많은 데이터가 필요했기 때문에 완전한 수작업 주석도 불가능했습니다.</p>
<p>확장성을 희생하지 않으면서 안정성을 개선하기 위해 한 가지 변경을 했습니다. LLM이 출력하는 모든 레이블에 대해 짧은 추론 스니펫을 제공해야 한다는 것이죠. 각 훈련 예제에는 쿼리, 문서, 문장 범위, 그리고 문장이 관련성이 있거나 관련성이 없는 이유에 대한 간단한 설명이 포함됩니다. 이 작은 조정으로 주석의 일관성이 훨씬 더 높아졌고 데이터 세트의 유효성을 검사하거나 디버깅할 때 참조할 수 있는 구체적인 내용이 생겼습니다.</p>
<p>추론을 포함시키는 것은 놀랍도록 가치 있는 것으로 밝혀졌습니다:</p>
<ul>
<li><p><strong>주석 품질 향상:</strong> 추론을 작성하는 것은 자체 점검의 역할을 하므로 무작위적이거나 일관성 없는 레이블이 줄어듭니다.</p></li>
<li><p><strong>관찰 가능성 향상:</strong> 라벨을 블랙박스로 취급하는 대신 문장이 선택된 <em>이유를</em> 확인할 수 있습니다.</p></li>
<li><p><strong>더 쉬운 디버깅:</strong> 뭔가 잘못되었을 때 추론을 통해 프롬프트, 도메인 또는 주석 로직 중 어느 쪽에 문제가 있는지 쉽게 파악할 수 있습니다.</p></li>
<li><p><strong>재사용 가능한 데이터:</strong> 추론 추적은 나중에 다른 라벨링 모델로 전환하더라도 라벨을 다시 지정하거나 감사할 때 유용하게 사용할 수 있습니다.</p></li>
</ul>
<p>어노테이션 워크플로는 다음과 같습니다:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/annotation_data_generation_ff93eb18f4.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Qwen3-8B-for-Annotation" class="common-anchor-header">어노테이션용 Qwen3 8B</h3><p>주석의 경우, 출력을 통한 '사고 모드'를 기본적으로 지원하여 일관된 추론 추적을 훨씬 쉽게 추출할 수 있는 Qwen3 8B를 선택했습니다. 더 작은 모델은 안정적인 레이블을 제공하지 못했고, 더 큰 모델은 이러한 종류의 파이프라인에 비해 속도가 느리고 불필요하게 비용이 많이 들었습니다. Qwen3 8B는 품질, 속도, 비용 사이에서 적절한 균형을 맞췄습니다.</p>
<p>저희는 클라우드 API 대신 <strong>로컬 vLLM 서비스를</strong> 사용하여 모든 주석을 실행했습니다. 이를 통해 높은 처리량, 예측 가능한 성능, 훨씬 낮은 비용(본질적으로 GPU 시간을 API 토큰 수수료와 교환하는 것)을 얻을 수 있었으며, 이는 수백만 개의 샘플을 생성할 때 더 나은 거래였습니다.</p>
<h3 id="Dataset-Scale" class="common-anchor-header">데이터 세트 규모</h3><p>총 <strong>5백만 개 이상의 이중 언어 훈련 샘플을</strong> 구축했으며, 영어와 중국어가 거의 균등하게 분포되어 있습니다.</p>
<ul>
<li><p><strong>영어 소스:</strong> MS MARCO, Natural Questions, GooAQ</p></li>
<li><p><strong>중국어 소스:</strong> DuReader, 중국어 위키백과, mmarco_chinese</p></li>
</ul>
<p>데이터 세트의 일부는 Open Provence와 같은 프로젝트에서 사용하는 기존 데이터를 재주석한 것입니다. 나머지는 먼저 쿼리-문맥 쌍을 생성한 다음 추론 기반 파이프라인으로 레이블을 지정하여 원시 코퍼스로부터 생성되었습니다.</p>
<p>모든 주석이 달린 훈련 데이터는 커뮤니티 개발 및 훈련 참조를 위해 HuggingFace에서도 사용할 수 있습니다: <a href="https://huggingface.co/zilliz/datasets">질리즈 데이터 세트</a></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/zilliz_datasets_dd91330d4d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Training-Method" class="common-anchor-header">훈련 방법</h3><p>모델 아키텍처와 데이터 세트가 준비되면 <strong>8× A100 GPU에서</strong> 3회에 걸쳐 모델을 훈련했으며, 총 <strong>9시간이</strong> 소요되었습니다.</p>
<p><strong>참고:</strong> 훈련은 시맨틱 강조 표시 작업을 담당하는 <strong>Pruning Head만을</strong> 대상으로 했습니다. 가지치기 목표에만 집중하면 문장 수준의 연관성 점수에서 더 나은 결과를 얻을 수 있었기 때문에 <strong>재랭크 헤드는</strong> 훈련하지 않았습니다.</p>
<h2 id="Real-World-Case-Study" class="common-anchor-header">실제 사례 연구<button data-href="#Real-World-Case-Study" class="anchor-icon" translate="no">
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
    </button></h2><p>벤치마크는 이야기의 일부분만 보여주기 때문에 다음은 검색된 텍스트에 정답과 매우 유혹적인 방해 요소가 모두 포함된 일반적인 에지 케이스에서 모델이 어떻게 작동하는지 보여주는 실제 예시입니다.</p>
<p><strong>쿼리:</strong> <em>'신성한 사슴의 죽음'은 누가 썼나요?</em></p>
<p><strong>문맥(5문장):</strong></p>
<pre><code translate="no">1\. The Killing of a Sacred Deer is a 2017 psychological horror film directed by Yorgos Lanthimos,

   with a screenplay by Lanthimos and Efthymis Filippou.

2\. The film stars Colin Farrell, Nicole Kidman, Barry Keoghan, Raffey Cassidy,

   Sunny Suljic, Alicia Silverstone, and Bill Camp.

3\. The story is based on the ancient Greek playwright Euripides&#x27; play Iphigenia in Aulis.

4\. The film tells the story of a cardiac surgeon (Farrell) who secretly

   befriends a teenager (Keoghan) connected to his past.

5\. He introduces the boy to his family, who then mysteriously fall ill.
<button class="copy-code-btn"></button></code></pre>
<p>정답입니다: 문장 1(명시적으로 "란티모스와 에프티미스 필리포의 각본")</p>
<p>이 예에는 함정이 있습니다. 문장 3은 "에우리피데스"가 원작 희곡을 썼다고 언급하고 있습니다. 그러나 이 질문은 "영화 '신성한 사슴의 죽음'을 쓴 사람은 누구인가"를 묻는 것이므로 수천 년 전의 그리스 극작가가 아니라 영화의 시나리오 작가가 정답이어야 합니다.</p>
<h3 id="Model-results" class="common-anchor-header">모델 결과</h3><table>
<thead>
<tr><th>모델</th><th>정답을 찾았나요?</th><th>예측</th></tr>
</thead>
<tbody>
<tr><td>우리 모델</td><td>✓</td><td>선택된 문장 1(정답) 및 3</td></tr>
<tr><td>XProvence v1</td><td>✗</td><td>3번 문장만 선택, 정답 누락</td></tr>
<tr><td>XProvence v2</td><td>✗</td><td>3번 문장만 선택, 정답 누락</td></tr>
</tbody>
</table>
<p><strong>주요 문장 점수 비교:</strong></p>
<table>
<thead>
<tr><th>문장</th><th>모델</th><th>XProvence v1</th><th>XProvence v2</th></tr>
</thead>
<tbody>
<tr><td>문장 1 (영화 시나리오, 정답)</td><td>0.915</td><td>0.133</td><td>0.081</td></tr>
<tr><td>문장 3(원작 연극, 산만함)</td><td>0.719</td><td>0.947</td><td>0.802</td></tr>
</tbody>
</table>
<p>엑스프로방스 모델:</p>
<ul>
<li><p>'에우리피데스'와 '놀이'에 강한 매력을 느껴 문장 3에 만점에 가까운 점수(0.947점 및 0.802점)를 부여함.</p></li>
<li><p>실제 답(문장 1)을 완전히 무시하여 매우 낮은 점수(0.133 및 0.081)를 부여함.</p></li>
<li><p>임계값을 0.5에서 0.2로 낮춰도 여전히 정답을 찾지 못함.</p></li>
</ul>
<p>우리 모델:</p>
<ul>
<li><p>1번 문장에 가장 높은 점수(0.915점)를 올바르게 부여함</p></li>
<li><p>3번 문장은 배경과 관련이 있기 때문에 여전히 어느 정도 관련성(0.719)을 부여합니다.</p></li>
<li><p>0.2의 여백을 두고 두 문장을 명확하게 구분합니다.</p></li>
</ul>
<p>이 예는 이 모델의 핵심 강점인 표면 수준의 키워드 매칭이 아닌 <strong>쿼리 의도를</strong> 이해하는 것을 보여줍니다. 여기서 "누가 <em>신성한 사</em>슴을 죽였는가"는 고대 그리스 희곡이 아니라 영화를 의미합니다. 다른 모델은 강한 어휘적 단서 때문에 주의가 산만해지는 반면, 저희 모델은 이를 포착합니다.</p>
<h2 id="Try-It-Out-and-Tell-Us-What-You-Think" class="common-anchor-header">사용해 보고 의견을 알려주세요<button data-href="#Try-It-Out-and-Tell-Us-What-You-Think" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://huggingface.co/zilliz/semantic-highlight-bilingual-v1">zilliz/semantic-highlight-bilingual-v1</a> 모델은 이제 MIT 라이선스에 따라 완전히 오픈소스로 제공되며 프로덕션에서 바로 사용할 수 있습니다. RAG 파이프라인에 연결하거나, 자체 도메인에 맞게 미세 조정하거나, 그 위에 새로운 도구를 구축할 수 있습니다. 또한 커뮤니티의 기여와 피드백도 환영합니다.</p>
<ul>
<li><p><strong>허깅페이스에서 다운로드</strong>: <a href="https://huggingface.co/zilliz/semantic-highlight-bilingual-v1">zilliz/semantic-highlight-bilingual-v1</a></p></li>
<li><p><strong>모든 주석이 달린 훈련 데이터:</strong> <a href="https://huggingface.co/zilliz/datasets">https://huggingface.co/zilliz/datasets</a></p></li>
</ul>
<h3 id="Semantic-Highlighting-Available-in-Milvus-and-Zilliz-Cloud" class="common-anchor-header">밀버스 및 질리즈 클라우드에서 시맨틱 하이라이트 사용 가능</h3><p>시맨틱 강조 표시 기능은 <a href="https://milvus.io/">Milvus와</a> <a href="https://zilliz.com/cloud">Zilliz Cloud</a> (완전 관리형 Milvus)에도 직접 내장되어 있어 사용자가 각 문서가 검색된 <em>이유를</em> 명확하게 파악할 수 있습니다. 전체 청크를 스캔하는 대신, 문구가 정확히 일치하지 않더라도 검색어와 관련된 특정 문장을 즉시 확인할 수 있습니다. 따라서 검색 결과를 더 쉽게 이해하고 디버그하기가 훨씬 빨라집니다. RAG 파이프라인의 경우, 다운스트림 LLM이 집중해야 할 부분을 명확히 하여 신속한 설계 및 품질 검사에도 도움이 됩니다.</p>
<p><a href="https://cloud.zilliz.com/signup?utm_source=milvusio&amp;utm_page=semantic-highlighting-blog"><strong>완전 관리형 Zilliz Cloud에서 시맨틱 하이라이팅을 무료로 사용해 보세요.</strong></a></p>
<p>버그 보고, 개선 아이디어 또는 워크플로에 통합하는 동안 발견한 모든 것을 포함하여 시맨틱 하이라이팅이 어떻게 작동하는지 듣고 싶습니다.</p>
<p>더 자세한 이야기를 나누고 싶으시면 언제든지 <a href="https://discord.com/invite/8uyFbECzPX">Discord 채널에</a> 참여하거나 20분 동안 진행되는 <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">Milvus 오피스 아워</a> 세션을 예약하세요. 언제든지 다른 빌더와 채팅하고 노트를 교환할 수 있습니다.</p>
<h2 id="Acknowledgements" class="common-anchor-header">감사의 말<button data-href="#Acknowledgements" class="anchor-icon" translate="no">
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
    </button></h2><p>이 작업은 수많은 훌륭한 아이디어와 오픈소스 기여를 바탕으로 이루어졌으며, 이 모델을 가능하게 한 프로젝트들을 강조하고 싶습니다.</p>
<ul>
<li><p><strong>Provence는</strong> 경량 인코더 모델을 사용하여 깔끔하고 실용적인 컨텍스트 프루닝 프레임을 도입했습니다.</p></li>
<li><p><strong>오픈 프로방스는</strong> 허용적인 라이선스 하에 트레이닝 파이프라인, 데이터 처리, 모델 헤드 등 견고하고 잘 설계된 코드베이스를 제공했습니다. 덕분에 실험을 위한 강력한 출발점을 마련할 수 있었습니다.</p></li>
</ul>
<p>이러한 기반 위에 저희는 몇 가지 자체적인 기여를 추가했습니다:</p>
<ul>
<li><p><strong>LLM 추론을</strong> 사용하여 더 높은 품질의 관련성 레이블 생성하기</p></li>
<li><p>실제 RAG 워크로드에 맞춰 <strong>약 5백만</strong> 개의 이중 언어 학습 샘플 생성</p></li>
<li><p>긴 문맥 관련성 스코어링에 더 적합한 기본 모델 선택<strong>(BGE-M3 Reranker v2</strong>)</p></li>
<li><p>의미론적 강조를 위해 모델을 전문화하기 위해 가지치기 <strong>헤드만</strong> 훈련하기</p></li>
</ul>
<p>자신들의 작업을 공개적으로 게시해준 프로방스 및 오픈 프로방스 팀에 감사드립니다. 이들의 기여 덕분에 개발 속도가 크게 빨라졌고 이 프로젝트가 가능했습니다.</p>
