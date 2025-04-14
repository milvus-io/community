---
id: how-to-choose-the-right-embedding-model.md
title: 적합한 임베딩 모델은 어떻게 선택하나요?
author: Lumina Wang
date: 2025-04-09T00:00:00.000Z
desc: 효과적인 데이터 표현과 성능 향상을 위해 적합한 임베딩 모델을 선택하기 위한 필수 요소와 모범 사례를 살펴보세요.
cover: assets.zilliz.com/Complete_Workflow_31b4ac825c.gif
tag: Engineering
tags: >-
  Embedding Model, RAG, Model Selection, Machine Learning, Performance
  Optimization
canonicalUrl: 'https://milvus.io/blog/how-to-choose-the-right-embedding-model.md'
---
<p>텍스트, 이미지 또는 오디오와 같은 <a href="https://zilliz.com/learn/introduction-to-unstructured-data">비정형 데이터를</a> 이해하고 작업하는 시스템을 구축할 때 올바른 <a href="https://zilliz.com/ai-models">임베딩 모델을</a> 선택하는 것은 매우 중요한 결정입니다. 이러한 모델은 원시 입력을 의미론적 의미를 포착하는 고정된 크기의 고차원 벡터로 변환하여 유사도 검색, 추천, 분류 등의 강력한 애플리케이션을 가능하게 합니다.</p>
<p>하지만 모든 임베딩 모델이 똑같이 만들어지는 것은 아닙니다. 사용 가능한 옵션이 너무 많은데 어떻게 올바른 옵션을 선택할 수 있을까요? 잘못된 선택은 정확도가 떨어지거나 성능 병목 현상 또는 불필요한 비용 발생으로 이어질 수 있습니다. 이 가이드는 특정 요구사항에 가장 적합한 임베딩 모델을 평가하고 선택하는 데 도움이 되는 실용적인 프레임워크를 제공합니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Complete_Workflow_31b4ac825c.gif" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="1-Define-Your-Task-and-Business-Requirements" class="common-anchor-header">1. 업무 및 비즈니스 요구사항 정의하기<button data-href="#1-Define-Your-Task-and-Business-Requirements" class="anchor-icon" translate="no">
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
    </button></h2><p>임베딩 모델을 선택하기 전에 핵심 목표를 명확히 하는 것부터 시작하세요:</p>
<ul>
<li><strong>작업 유형:</strong> 시맨틱 검색, 추천 시스템, 분류 파이프라인 등 구축하려는 핵심 애플리케이션을 파악하는 것부터 시작하세요. 각 사용 사례마다 임베딩이 정보를 표현하고 구성하는 방식에 대한 요구 사항이 다릅니다. 예를 들어, 시맨틱 검색 엔진을 구축하는 경우, 쿼리와 문서 사이의 미묘한 의미적 의미를 포착하여 유사한 개념이 벡터 공간에서 가깝도록 하는 Sentence-BERT와 같은 모델이 필요합니다. 분류 작업의 경우, 임베딩은 카테고리별 구조를 반영하여 같은 클래스의 입력이 벡터 공간에서 서로 가깝게 배치되도록 해야 합니다. 이렇게 하면 다운스트림 분류기가 클래스를 더 쉽게 구분할 수 있습니다. DistilBERT, RoBERTa와 같은 모델이 일반적으로 사용됩니다. 추천 시스템에서는 사용자-아이템 관계 또는 선호도를 반영하는 임베딩을 찾는 것이 목표입니다. 이를 위해 신경 협력 필터링(NCF)과 같이 암시적 피드백 데이터로 특별히 훈련된 모델을 사용할 수 있습니다.</li>
<li><strong>ROI 평가:</strong> 특정 비즈니스 상황에 따라 성능과 비용의 균형을 맞출 수 있습니다. 의료 진단과 같은 미션 크리티컬 애플리케이션은 생사가 걸린 문제일 수 있으므로 정확도가 높은 프리미엄 모델을 사용하는 것이 타당할 수 있지만, 대량으로 사용되는 비용에 민감한 애플리케이션은 신중한 비용 편익 분석이 필요합니다. 핵심은 2~3%의 성능 개선이 특정 시나리오에서 잠재적으로 상당한 비용 증가를 정당화할 수 있는지 여부를 판단하는 것입니다.</li>
<li><strong>기타 제약 조건:</strong> 옵션의 범위를 좁힐 때는 기술적 요구 사항을 고려하세요. 다국어 지원이 필요한 경우 일반 모델은 비영어권 콘텐츠에 어려움을 겪는 경우가 많으므로 전문화된 다국어 모델이 필요할 수 있습니다. 의료/법률 등 전문 분야에서 작업하는 경우 범용 임베딩은 종종 도메인별 전문 용어를 놓치는 경우가 있습니다. 예를 들어 의료 맥락에서 <em>'stat'가</em> <em>'즉시'를</em> 의미하거나 법률 문서에서 <em>'고려'</em> 가 계약에서 교환되는 가치 있는 것을 의미한다는 것을 이해하지 못할 수 있습니다. 마찬가지로 하드웨어 제한 및 지연 시간 요구 사항은 배포 환경에 적합한 모델에 직접적인 영향을 미칩니다.</li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/clarify_task_and_business_requirement_b1bce2ccc0.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="2-Evaluate-Your-Data" class="common-anchor-header">2. 데이터 평가<button data-href="#2-Evaluate-Your-Data" class="anchor-icon" translate="no">
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
    </button></h2><p>데이터의 특성은 임베딩 모델 선택에 큰 영향을 미칩니다. 주요 고려 사항은 다음과 같습니다:</p>
<ul>
<li><strong>데이터 양식:</strong> 데이터의 성격이 텍스트, 시각적 또는 멀티모달인가요? 데이터 유형에 맞는 모델을 선택하세요. 텍스트의 경우 <a href="https://zilliz.com/learn/what-is-bert">BERT</a> 또는 <a href="https://zilliz.com/learn/Sentence-Transformers-for-Long-Form-Text">Sentence-BERT와</a> 같은 트랜스포머 기반 모델을 사용하고, 이미지의 경우 <a href="https://zilliz.com/glossary/convolutional-neural-network">CNN 아키텍처</a> 또는 비전 트랜스포머<a href="https://zilliz.com/learn/understanding-vision-transformers-vit">(ViT)</a>, 오디오의 경우 특수 모델을, 멀티모달 애플리케이션의 경우 <a href="https://zilliz.com/learn/exploring-openai-clip-the-future-of-multimodal-ai-learning">CLIP</a> 및 MagicLens와 같은 멀티모달 모델을 사용하세요.</li>
<li><strong>도메인 특이성:</strong> 일반 모델로 충분한지, 아니면 전문 지식을 이해하는 도메인별 모델이 필요한지 고려하세요. 다양한 데이터 세트에서 학습된 일반 모델(예: <a href="https://zilliz.com/ai-models/text-embedding-3-large">OpenAI 텍스트 임베딩 모델</a>)은 일반적인 주제에 대해서는 잘 작동하지만 전문 분야에서는 미묘한 차이를 놓치는 경우가 많습니다. 그러나 의료나 법률 서비스와 같은 분야에서는 미묘한 차이를 놓치는 경우가 많기 때문에 <a href="https://arxiv.org/abs/1901.08746">BioBERT나</a> <a href="https://arxiv.org/abs/2010.02559">LegalBERT와</a> 같은 도메인별 임베딩이 더 적합할 수 있습니다.</li>
<li><strong>임베딩 유형:</strong> <a href="https://zilliz.com/learn/sparse-and-dense-embeddings">드문드문 임베딩은</a> 키워드 매칭에 탁월하므로 제품 카탈로그나 기술 문서에 이상적입니다. 고밀도 임베딩은 의미 관계를 더 잘 포착하므로 자연어 쿼리 및 의도 이해에 적합합니다. 이커머스 추천 시스템과 같은 많은 프로덕션 시스템은 키워드 매칭에 <a href="https://zilliz.com/learn/mastering-bm25-a-deep-dive-into-the-algorithm-and-application-in-milvus">BM25</a> (스파스)를 사용하면서 의미적 유사성을 포착하기 위해 BERT(고밀도 임베딩)를 추가하는 등 두 가지 유형을 모두 활용하는 하이브리드 접근 방식을 통해 이점을 누리고 있습니다.</li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/evaluate_your_data_6caeeb813e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="3-Research-Available-Models" class="common-anchor-header">3. 사용 가능한 모델 조사<button data-href="#3-Research-Available-Models" class="anchor-icon" translate="no">
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
    </button></h2><p>작업과 데이터를 이해했다면, 이제 사용 가능한 임베딩 모델을 조사할 차례입니다. 다음과 같은 방법으로 접근할 수 있습니다:</p>
<ul>
<li><p><strong>인기도:</strong> 커뮤니티가 활성화되어 있고 널리 채택된 모델을 우선적으로 고려하세요. 이러한 모델은 일반적으로 더 나은 문서화, 광범위한 커뮤니티 지원 및 정기적인 업데이트의 이점을 누릴 수 있습니다. 이렇게 하면 구현의 어려움을 크게 줄일 수 있습니다. 해당 도메인의 선도적인 모델을 숙지하세요. 예를 들어</p>
<ul>
<li>텍스트의 경우: OpenAI 임베딩, Sentence-BERT 변형 또는 E5/BGE 모델을 고려하세요.</li>
<li>이미지의 경우: 텍스트와 이미지 정렬을 위해 ViT와 ResNet, 또는 CLIP과 SigLIP을 살펴보세요.</li>
<li>오디오: PNN, CLAP 또는 <a href="https://zilliz.com/learn/top-10-most-used-embedding-models-for-audio-data">기타 인기 있는 모델을</a> 확인하세요.</li>
</ul></li>
<li><p><strong>저작권 및 라이선스</strong>: 라이선싱은 장단기 비용에 직접적인 영향을 미치므로 라이선싱의 영향을 신중하게 평가하세요. 오픈 소스 모델(MIT, Apache 2.0 또는 이와 유사한 라이선스)은 수정 및 상업적 사용을 위한 유연성을 제공하므로 배포를 완전히 제어할 수 있지만 인프라에 대한 전문 지식이 필요합니다. API를 통해 액세스하는 독점 모델은 편리함과 단순성을 제공하지만 지속적인 비용과 잠재적인 데이터 프라이버시 문제가 있습니다. 이러한 결정은 데이터 주권 또는 규정 준수 요건으로 인해 초기 투자 비용이 높더라도 자체 호스팅이 필요할 수 있는 규제 대상 산업의 애플리케이션에 특히 중요합니다.</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/model_research2_b0df75cb55.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="4-Evaluate-Candidate-Models" class="common-anchor-header">4. 후보 모델 평가<button data-href="#4-Evaluate-Candidate-Models" class="anchor-icon" translate="no">
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
    </button></h2><p>몇 가지 모델을 후보로 선정했다면 이제 샘플 데이터로 테스트할 차례입니다. 다음은 고려해야 할 주요 요소입니다:</p>
<ul>
<li><strong>평가:</strong> 임베딩 품질, 특히 검색 증강 생성(RAG) 또는 검색 애플리케이션에서 임베딩 품질을 평가할 때는 반환된 결과가 <em>얼마나 정확하고 관련성이 있으며 완전한지</em> 측정하는 것이 중요합니다. 주요 측정 지표에는 충실도, 답변 관련성, 문맥 정확도, 회상도 등이 포함됩니다. Ragas, DeepEval, Phoenix, TruLens-Eval과 같은 프레임워크는 임베딩 품질의 다양한 측면을 평가하기 위한 구조화된 방법론을 제공함으로써 이러한 평가 프로세스를 간소화합니다. 데이터 세트는 의미 있는 평가를 위해 똑같이 중요합니다. 데이터 세트는 실제 사용 사례를 나타내기 위해 수작업으로 제작하거나, 특정 기능을 테스트하기 위해 LLM에서 합성적으로 생성하거나, 특정 테스트 측면을 타겟팅하기 위해 Ragas 및 FiddleCube 같은 툴을 사용하여 생성할 수 있습니다. 데이터 세트와 프레임워크의 올바른 조합은 특정 애플리케이션과 확실한 결정을 내리는 데 필요한 평가 세부 수준에 따라 달라집니다.</li>
<li><strong>벤치마크 성능:</strong> 작업별 벤치마크(예: 검색을 위한 MTEB)로 모델을 평가하세요. 순위는 시나리오(검색 대 분류), 데이터 세트(일반 대 BioASQ와 같은 도메인별), 메트릭(정확도, 속도)에 따라 크게 달라진다는 것을 기억하세요. 벤치마크 성능은 귀중한 인사이트를 제공하지만, 실제 애플리케이션에 항상 완벽하게 적용되는 것은 아닙니다. 데이터 유형 및 목표에 부합하는 최고 성능의 모델을 교차 확인하되, 항상 사용자 지정 테스트 케이스로 검증하여 벤치마크에는 적합하지만 특정 데이터 패턴의 실제 조건에서는 성능이 저하될 수 있는 모델을 식별하세요.</li>
<li><strong>로드 테스트:</strong> 자체 호스팅 모델의 경우 실제 프로덕션 부하를 시뮬레이션하여 실제 조건에서 성능을 평가합니다. 추론 중 처리량과 GPU 사용률 및 메모리 소비량을 측정하여 잠재적인 병목 현상을 파악하세요. 개별적으로 잘 작동하는 모델도 동시 요청이나 복잡한 입력을 처리할 때는 문제가 될 수 있습니다. 모델이 너무 리소스 집약적인 경우 벤치마크 지표의 정확도와 관계없이 대규모 또는 실시간 애플리케이션에 적합하지 않을 수 있습니다.</li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/evaluate_candidate_models_3a7edd9cd7.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="5-Model-Integration" class="common-anchor-header">5. 모델 통합<button data-href="#5-Model-Integration" class="anchor-icon" translate="no">
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
    </button></h2><p>모델을 선택했으면 이제 통합 접근 방식을 계획할 차례입니다.</p>
<ul>
<li><strong>가중치 선택:</strong> 빠른 배포를 위해 사전 학습된 가중치를 사용할지, 성능 향상을 위해 도메인별 데이터를 미세 조정할지 결정하세요. 미세 조정은 성능을 향상시킬 수 있지만 리소스를 많이 사용한다는 점을 기억하세요. 성능 향상이 추가적인 복잡성을 정당화할 만한 가치가 있는지 고려하세요.</li>
<li><strong>자체 호스팅 대 타사 추론 서비스:</strong> 인프라 기능 및 요구 사항에 따라 배포 방식을 선택하세요. 자체 호스팅을 사용하면 모델과 데이터 흐름을 완벽하게 제어할 수 있어 잠재적으로 요청당 비용을 대규모로 절감하고 데이터 프라이버시를 보장할 수 있습니다. 하지만 인프라 전문 지식과 지속적인 유지 관리가 필요합니다. 타사 추론 서비스는 최소한의 설정으로 신속한 배포를 제공하지만 네트워크 지연 시간, 잠재적인 사용량 제한, 그리고 규모에 따라 상당한 비용이 발생할 수 있는 지속적인 비용이 발생합니다.</li>
<li><strong>통합 설계:</strong> 임베딩을 효율적으로 저장하고 쿼리하기 위한 API 설계, 캐싱 전략, 일괄 처리 방식, <a href="https://milvus.io/blog/what-is-a-vector-database.md">벡터 데이터베이스</a> 선택을 계획하세요.</li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/model_integration_8c8f0410c7.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="6-End-to-End-Testing" class="common-anchor-header">6. 엔드투엔드 테스트<button data-href="#6-End-to-End-Testing" class="anchor-icon" translate="no">
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
    </button></h2><p>전체 배포 전에 엔드투엔드 테스트를 실행하여 모델이 예상대로 작동하는지 확인하세요:</p>
<ul>
<li><strong>성능</strong>: 성능: 항상 자체 데이터 세트에서 모델을 평가하여 특정 사용 사례에서 모델이 제대로 작동하는지 확인하세요. 검색 품질, 정확도, 리콜, F1과 같은 메트릭은 검색 품질, 정밀도, 정확도, 처리량 및 대기 시간 백분위수, 운영 성능에 대한 백분위수 등을 고려하세요.</li>
<li><strong>견고성</strong>: 에지 케이스와 다양한 데이터 입력을 포함한 다양한 조건에서 모델을 테스트하여 모델이 일관되고 정확하게 작동하는지 확인합니다.</li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/end_to_end_testing_7ae244a73b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Summary" class="common-anchor-header">요약<button data-href="#Summary" class="anchor-icon" translate="no">
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
    </button></h2><p>이 가이드 전체에서 살펴본 바와 같이, 올바른 임베딩 모델을 선택하려면 다음 6가지 중요한 단계를 따라야 합니다:</p>
<ol>
<li>비즈니스 요구 사항 및 작업 유형 정의</li>
<li>데이터 특성과 도메인 특수성 분석하기</li>
<li>사용 가능한 모델과 라이선스 조건 조사</li>
<li>관련 벤치마크 및 테스트 데이터 세트에 대해 후보를 엄격하게 평가합니다.</li>
<li>배포 옵션을 고려하여 통합 접근 방식 계획</li>
<li>프로덕션 배포 전에 포괄적인 엔드투엔드 테스트 수행</li>
</ol>
<p>이 프레임워크를 따르면 특정 사용 사례의 성능, 비용 및 기술적 제약 조건의 균형을 맞추는 정보에 입각한 결정을 내릴 수 있습니다. '가장 좋은' 모델은 반드시 벤치마크 점수가 가장 높은 모델이 아니라 운영상의 제약 조건 내에서 특정 요구사항을 가장 잘 충족하는 모델이라는 점을 기억하세요.</p>
<p>임베딩 모델이 빠르게 발전하고 있으므로 애플리케이션을 크게 개선할 수 있는 새로운 옵션이 등장하면 주기적으로 선택 사항을 재평가하는 것도 좋습니다.</p>
