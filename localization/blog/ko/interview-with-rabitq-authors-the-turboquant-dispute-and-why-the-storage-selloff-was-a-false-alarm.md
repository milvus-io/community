---
id: >-
  interview-with-rabitq-authors-the-turboquant-dispute-and-why-the-storage-selloff-was-a-false-alarm.md
title: 'RaBitQ 저자 인터뷰: 터보퀀트 분쟁과 스토리지 매각이 오보였던 이유'
author: 'Cheng Long, Jianyang Gao, Li Liu'
date: 2026-4-17
cover: assets.zilliz.com/0415_updated_rabitq_interviewdocx_md_1_d5709718fc.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'RaBitQ, TurboQuant, vector quantization, Milvus, IVF_RABITQ'
meta_title: |
  RaBitQ Authors on the TurboQuant Vector Quantization Dispute
desc: >-
  RaBitQ의 저자들이 Google의 TurboQuant 논문에 대한 답변: 벤치마크 불균형, 잘못 알려진 이론, 스토리지 매도가 잘못된
  경보였던 이유에 대해 설명합니다.
origin: >-
  https://milvus.io/blog/interview-with-rabitq-authors-the-turboquant-dispute-and-why-the-storage-selloff-was-a-false-alarm.md
---
<p>Google의 <a href="https://research.google/blog/turboquant-redefining-ai-efficiency-with-extreme-compression/">TurboQuant</a> 논문은 벡터 표현에 대해 <strong>6배 압축, 8배 속도 향상, 거의 제로에 가까운 정확도 손실을</strong> 주장했습니다. 이 논문이 발표된 후 메모리와 스토리지 주가는 급락했고, 주요 기술 매체는 이를 곧바로 헤드라인 기사로 다뤘습니다.</p>
<p>시장의 반응은 시작에 불과했습니다. 연구원들은 곧 이 논문의 주장이 과장된 것은 아닌지, 이전 연구, 특히 <a href="https://dl.acm.org/doi/10.1145/3654970">RaBitQ를</a> 공정하게 취급했는지에 대해 질문하기 시작했습니다. 이 논쟁으로 <strong>벡터 양자화가</strong> 다시 주목받게 되었는데, 이는 부분적으로는 <a href="https://zilliz.com/learn/vector-similarity-search">벡터 검색 시스템과</a> 대규모 모델을 위한 KV 캐시 압축이라는 두 가지 중요한 AI 스택에서 동일한 기본 아이디어가 중요해졌기 때문입니다.</p>
<p>기술적 논쟁과 생산 시스템에 대한 의미를 모두 이해하기 위해 싱가포르국립대학교 부교수이자 VectorDB@NTU의 책임자인 <strong>Cheng Long</strong>, RaBitQ의 제1저자인 <strong>Jianyang Gao</strong>, Zilliz의 엔지니어링 디렉터인 <strong>Li Liu와</strong> 이야기를 나눴습니다. 이 대화에서는 벡터 양자화 자체, TurboQuant와 관련해 제기된 질문, 그리고 이것이 가장 인기 있는 오픈 소스 <a href="https://zilliz.com/learn/what-is-vector-database">벡터 데이터베이스인</a> <a href="https://milvus.io/">Milvus와</a> 같은 시스템과 대규모 벡터 검색에 중요한 이유에 대해 다뤘습니다.</p>
<p><strong><em>관련 읽기:</em></strong> <em>인터뷰가 아닌 엔지니어링 측면을 원하신다면</em> <a href="https://milvus.io/blog/turboquant-rabitq-vector-database-cost.md"><em>벡터 양자화가 AI 인프라 비용에 미치는 영향에</em></a> <em>대한 동반 기사를 참조하세요</em><em>.</em></p>
<h2 id="Why-did-vector-quantization-suddenly-become-such-a-big-topic" class="common-anchor-header">벡터 양자화가 갑자기 큰 화제가 된 이유는 무엇인가요?<button data-href="#Why-did-vector-quantization-suddenly-become-such-a-big-topic" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>질리즈: 논쟁에 들어가기 전에 벡터 양자화가 무엇인지, 그리고 왜 AI에서 벡터 양자화가 중요해졌는지 먼저 설명해 주시겠어요?</strong></p>
<p><strong>청 롱:</strong> 벡터 양자화는 <strong>데이터 압축</strong> 및 <strong>근사 표현을</strong> 위한 기술입니다. 원래는 이미지와 오디오 압축에 사용되던 신호 처리에서 유래했습니다. 현대의 AI 시스템에서는 벡터가 계산의 기본 단위 중 하나가 되면서 그 역할이 바뀌었습니다.</p>
<p>오늘날 벡터의 중요성은 두 곳에서 가장 명확하게 드러납니다.</p>
<p>하나는 <strong>수십억 또는 수백억 개의 벡터가 포함된 컬렉션에 대한 실시간 검색입니다</strong>. 시맨틱 검색 시스템에서 핵심 작업은 고차원 벡터에 대한 유사도 검색입니다. 하지만 원시 벡터는 크기가 크고 부동소수점 계산은 비용이 많이 듭니다. 규모가 커지면 밀리초 수준의 지연 시간을 제공하기가 어렵습니다. 벡터 양자화는 벡터를 저비트 표현으로 압축하고 거리 계산 속도를 높임으로써 도움을 줍니다. 그렇기 때문에 <a href="https://milvus.io/docs/single-vector-search.md">단일 벡터 검색</a>, <a href="https://milvus.io/docs/multi-vector-search.md">다중 벡터 검색</a>, <a href="https://milvus.io/docs/index-explained.md">Milvus 검색 아키텍처의</a> 인덱스 설계와 같은 실제 워크로드에 중요한 역할을 합니다.</p>
<p>다른 하나는 대규모 모델을 위한 <strong>KV 캐시 압축입니다</strong>. KV 캐시는 생성 시 중복 계산을 줄여주지만, 컨텍스트가 길어질수록 메모리 비용이 빠르게 증가합니다. 따라서 출력 품질을 크게 해치지 않으면서 이러한 벡터를 압축하는 방법이 문제가 됩니다. 이 역시 벡터 양자화의 핵심 문제입니다.</p>
<p><strong>질리즈: 벡터 양자화가 더 널리 사용된다면, 그리고 TurboQuant의 결과가 유지된다면 스토리지 수요가 급격히 감소한다는 뜻인가요?</strong></p>
<p><strong>지안양 가오:</strong> 동일한 모델과 동일한 워크로드에서 압축은 스토리지 수요를 줄일 수 있습니다. 하지만 그렇다고 해서 사람들이 내린 광범위한 결론이 정당화되지는 않습니다.</p>
<p>TurboQuant가 <strong>6배 압축과</strong> <strong>8배 속도 향상에</strong> 대해 이야기할 때, 이는 기본 <strong>16비트/32비트 기준과</strong> 비교하는 것입니다. 이는 같은 카테고리의 다른 방법과 비교하는 것과는 다릅니다. 따라서 실제 효과는 좀 더 신중하게 평가해야 합니다.</p>
<p><strong>질리즈: 그렇다면 그런 관점에서 볼 때, 시장 반응이 정말 기술 자체에 대한 것이었다면 비슷한 아이디어가 이미 등장했을 때 훨씬 더 일찍 일어났어야 하는 건가요?</strong></p>
<p><strong>청 롱:</strong> 기술적인 관점에서 보면 비슷한 이론적 영역에 이미 도달했다고 말할 수 있습니다. 하지만 시장은 연구와 동시에 움직이지 않습니다. 일반적으로 학문적 결과와 공학적 채택, 재무적 해석 사이에는 시차가 존재합니다.</p>
<p>그리고 더 긴 관점에서 보면 그 효과는 선형적이지 않을 수도 있습니다. 압축을 통해 더 작은 기기에서 큰 모델을 실행할 수 있게 되면 단순히 수요를 줄이는 것이 아니라 새로운 수요를 창출할 수 있습니다. 기술과 시장의 관계는 직선으로 추정하는 것보다 더 복잡합니다.</p>
<h2 id="How-did-RaBitQ-emerge-and-what-did-it-contribute" class="common-anchor-header">RaBitQ는 어떻게 등장했으며 어떤 기여를 했나요?<button data-href="#How-did-RaBitQ-emerge-and-what-did-it-contribute" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>질리즈: RaBitQ에 대한 아이디어는 어떻게 처음 떠올리게 되었나요?</strong></p>
<p><strong>지안양 가오:</strong> 저희는 벡터 데이터베이스에서 발견한 격차에서 출발했습니다. <a href="https://milvus.io/docs/ivf-pq.md">제품 정량화와</a> 같은 전통적인 방법은 경험적으로 잘 작동했지만 이론적으로 보장하는 부분이 거의 없었습니다.</p>
<p>당시 저는 싱가포르 국립대학교에서 고차원 확률을 연구하고 있었는데, 이를 통해 실용적일 뿐만 아니라 이론적으로도 확실한 보증을 받을 수 있는 방법을 개발할 수 없을지 고민하게 되었습니다. 이것이 RaBitQ의 출발점이었습니다.</p>
<p><strong>질리즈: RaBitQ의 핵심 독창성은 무엇이라고 생각하시나요?</strong></p>
<p><strong>지안양 가오:</strong> 핵심 아이디어는 랜덤 회전, 즉 존슨-린덴스트라우스 변환을 사용하여 벡터 좌표의 분포를 보다 균일하고 예측 가능하게 만드는 것이었습니다.</p>
<p>일단 이를 확보하면 그 위에 최적의 양자화 추정기를 도출할 수 있습니다. 그런 다음 이론적 하한에 도달한다는 것을 엄격하게 증명했습니다.</p>
<p>이전 연구에서도 무작위 회전을 도입하려고 시도했습니다. 하지만 알고리즘 설계의 실용적인 문제로 인해 우리가 원하는 효과를 얻지 못했습니다.</p>
<p><strong>질리즈: 엔지니어링 관점에서 RaBitQ에서 가장 눈에 띄는 점은 무엇인가요?</strong></p>
<p><strong>리 리우:</strong> <a href="https://milvus.io/docs/ivf-sq8.md">스칼라 양자화 방법부터</a> PQ 및 기타 변형에 이르기까지 다양한 양자화 알고리즘을 사용해 보았습니다. RaBitQ에서 가장 눈에 띄는 점은 사람들이 문제에 접근하는 방식을 바꿨다는 점입니다.</p>
<p>그 전에는 이 분야의 많은 부분이 여전히 상당히 경험적인 방식이었습니다. 어떤 방법이 효과가 있다고 말할 수는 있지만 그 이유를 명확하게 설명하기는 어려웠습니다. RaBitQ는 훨씬 더 수학적 방식으로 문제에 접근했습니다. 이 방법은 우아하고 어떤 의미에서는 단순하게 느껴졌습니다. 이러한 사고 방식은 이후 작업에 많은 영향을 미쳤습니다.</p>
<p><strong>질리즈: 간단히 말해 메모리와 비용을 얼마나 절약할 수 있나요?</strong></p>
<p><strong>Li Liu:</strong> 동일한 리콜 수준에서 4비트 압축에서 2비트 압축으로 전환하면 메모리 사용량이 절반으로 줄어듭니다.</p>
<p>그리고 단순히 압축만이 문제가 아닙니다. 이전 접근 방식에 비해 성능이 훨씬 뛰어나며, 이는 팀이 메모리 효율성과 검색 품질을 모두 중요하게 생각하는 프로덕션 환경에서 중요합니다. 그렇기 때문에 <a href="https://milvus.io/docs/dense-vector.md">고밀도 벡터 스토리지</a>, 처리량, 리콜의 균형을 맞춰야 하는 시스템에서 중요합니다.</p>
<p><strong>Zilliz: Milvus 외에도 현재 RaBitQ는 어디에서 사용되고 있나요?</strong></p>
<p><strong>쳉 롱:</strong> 먼저 RaBitQ를 가장 먼저 도입한 Milvus 팀에게 감사의 말씀을 전하고 싶습니다. 그 과정에서 많은 토론과 공동 연구도 진행했습니다.</p>
<p>RaBitQ는 Meta의 FAISS, VSAG, VectorChord, Volcengine OpenSearch, CockroachDB, ElasticSearch, Lucene, 터보퍼퍼 등 다른 시스템에도 채택되어 있습니다. Milvus 측에서 눈에 띄는 점은 <a href="https://milvus.io/docs/manage-collections.md">수집 관리</a>, <a href="https://milvus.io/docs/ivf-flat.md">IVF 기반 인덱싱</a>, <a href="https://milvus.io/docs/hnsw.md">HNSW 기반 인덱싱에</a> 대한 광범위한 작업과 함께 <a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md">Milvus 2.6에서</a> 실제 인덱스 옵션으로 <a href="https://milvus.io/docs/ivf-rabitq.md">IVF_RABITQ를</a> 제공했다는 점입니다.</p>
<h2 id="How-should-we-evaluate-TurboQuant" class="common-anchor-header">TurboQuant는 어떻게 평가해야 하나요?<button data-href="#How-should-we-evaluate-TurboQuant" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Zilliz: 공개 답변에서 TurboQuant에 몇 가지 심각한 문제가 있다고 말씀하셨죠. 가장 큰 문제는 무엇이라고 생각하시나요?</strong></p>
<p><strong>가오 지안양:</strong> 저희는 크게 세 가지 문제를 발견했습니다.</p>
<p>하나는 논문이 이전 연구를 기술하고 중복되는 부분을 논의하는 방식입니다. TurboQuant 논문은 존슨-린덴스트라우스 변환과 같이 가장 유사한 부분을 무시한 채 RaBitQ의 방법론을 잘못 표현하고 있습니다. 또 다른 문제는 논문이 이론적 결과를 특징짓는 방식입니다. 논문은 아무런 설명이나 근거를 제시하지 않고 RaBitQ를 차선책이라고 기술하고 있지만, 사실 RaBitQ는 최적입니다. 세 번째는 실험 비교의 공정성입니다. RaBitQ를 평가할 때는 싱글코어 CPU를 사용하고 TurboQuant를 평가할 때는 A100 GPU를 사용했습니다.</p>
<p><strong>질리즈: 벤치마크 문제를 먼저 짚어보겠습니다. 왜 비교가 공정하지 않았다고 생각하시나요?</strong></p>
<p><strong>지안양 가오:</strong> 벤치마크 결과는 설정이 비슷할 때만 의미가 있습니다. 한 시스템이 매우 다른 하드웨어 또는 소프트웨어 환경에서 테스트되는 경우 알고리즘 자체보다 설정이 더 많이 반영된 결과가 나올 수 있습니다.</p>
<p>저희는 프로세서 선택, 구현 언어, 최적화 수준의 차이가 큰 차이를 만들 수 있다고 생각합니다. 그렇기 때문에 특히 프로덕션 검색 시스템을 구축하는 팀에서는 벤치마크 방법론을 매우 신중하게 해석해야 합니다.</p>
<p><strong>Cheng Long:</strong> 이 논문에서는 타당하지 않은 다른 주장도 제기했습니다.</p>
<p>예를 들어, 논문에서는 <strong>RaBitQ를 벡터화할 수 없다고</strong> 말합니다. 하지만 2024년 논문이 발표되었을 때 이미 RaBitQ는 SIMD 기반 벡터화된 연산이 포함된 코드를 오픈 소스화했습니다. 따라서 저희의 관점에서 볼 때 그 내용은 사실과 다릅니다.</p>
<p>또한 작년에 NVIDIA와 협업을 시작하여 RaBitQ의 GPU 구현을 완료했다는 점도 언급할 가치가 있습니다. 관련 코드를 NVIDIA의 cuVS 라이브러리에 포함하기 위해 검토 중입니다.</p>
<p><strong>질리즈: 밀버스는 2025년 하반기에 터보퀀트를 평가했지만 채택하지는 않았습니다. 테스트에서 어떤 점을 확인하셨나요?</strong></p>
<p><strong>Li Liu:</strong> 유용한 아이디어가 하나 포함되어 있긴 합니다. 저희가 보기에는 양자화 그리드를 할당하는 방식에서 약간의 최적화가 이루어졌습니다. 하지만 이 방법에서 가장 중요한 단계인 양자화를 위해 무작위 회전을 사용하는 것은 RaBitQ에서 처음 도입한 것입니다.</p>
<p>그리고 편향되지 않은 추정에 관해서는 RaBitQ의 접근 방식이 더 깔끔하고 이론적 도출이 더 강력합니다.</p>
<p>하지만 이는 Google의 결과이기 때문에 2025년에 테스트했습니다. 저희 실험실에서 표준화된 CPU 환경 하에서 평가한 대부분의 경우에서 TurboQuant는 내부 RaBitQ 버전을 능가하지 못했습니다. 그래서 시장의 반응이 너무 뜨거웠을 때 저희는 정말 놀랐습니다.</p>
<p><strong>Zilliz: 두 논문을 자세히 살펴보지 않은 독자들을 위해 RaBitQ와 TurboQuant가 겹치는 부분을 쉬운 말로 설명해 주시겠어요?</strong></p>
<p><strong>Li Liu:</strong> 두 방법 모두 크게 보면 <strong>무작위 회전으로</strong> 시작합니다. 수학적으로 이는 벡터에 무작위 직교 행렬을 곱하는 것을 의미합니다. 고차원 공간에서 시야각을 변경한다고 생각하면 됩니다. 데이터 포인트의 상대적 위치는 변경되지 않지만, 정보를 여러 차원에 더 균등하게 분산시킵니다.</p>
<p>그 다음이 <strong>양자화입니다</strong>. 연속 실수값 공간을 <strong>2^k 그리드 셀로</strong> 나눈 다음(여기서 <strong>k는</strong> 양자화 비트 수), 각 벡터 요소를 가까운 그리드 점에 매핑합니다. TurboQuant는 여기서 그리드를 균등하게 분배하는 대신 데이터 분포에 따라 그리드를 할당하여 약간의 조정을 수행합니다.</p>
<p>마지막 단계는 <strong>오차 추정이며</strong>, 이 단계에서 RaBitQ의 주요 기여가 이루어집니다. 기존 방식은 양자화된 값에서 직접 계산하기 때문에 오차를 제어하기가 더 어렵습니다. RaBitQ는 양자화 오차를 더 정확하게 추정하며, 바로 여기에서 수학적 최적화가 이루어집니다. 터보퀀트의 솔루션은 더 복잡하며, 저희 환경에서는 트레이드오프가 그다지 매력적이지 않았습니다.</p>
<h2 id="Why-is-attribution-so-hard-to-resolve-in-practice" class="common-anchor-header">어트리뷰션이 실제로 해결이 어려운 이유는 무엇인가요?<button data-href="#Why-is-attribution-so-hard-to-resolve-in-practice" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Zilliz:</strong> 공개 성명을 발표한 후 구글과 ICLR의 반응은 어땠나요?</p>
<p><strong>Cheng Long:</strong> ICLR은 아무런 조치를 취하지 않았습니다. 작년 9월에 검토 기간 동안 이메일을 보냈지만 답변을 받지 못했습니다. 올해 3월에 다시 편지를 보냈고 OpenReview에 의견을 게시하라는 답변을 받았지만 그 이후에는 아무런 조치가 없었습니다.</p>
<p>구글의 경우 공동 저자 중 한 명이 며칠 전에 답장을 보내왔습니다. 답장에는 RaBitQ의 최적성에 대한 부정확한 설명을 수정하기 위해 arXiv 버전을 수정하겠다고 했습니다.</p>
<p><strong>질리즈:</strong> 이전에는 학문적 부정행위를 중심으로 논의가 진행되었습니다. 이제는 불균형과 누가 이야기를 만들어가는지에 대한 문제처럼 들리기도 합니다. 자신의 작업을 옹호하는 것이 왜 그렇게 어려운가요?</p>
<p><strong>청 롱:</strong> 한 가지 문제는 규모입니다. AI 컨퍼런스는 이제 규모가 너무 커져서 한 번의 주기에 수만 개의 논문이 발표될 수 있습니다. 주최자가 이런 종류의 분쟁을 모두 처리할 수 있는 역량이 없습니다.</p>
<p>또 다른 문제는 불균형입니다. 대기업은 대중의 목소리가 훨씬 더 강합니다. 독립적인 연구자나 소규모 팀은 동일한 커뮤니케이션 능력을 갖지 못합니다.</p>
<p><strong>지안양 가오:</strong> 개인에게는 비용이 매우 높습니다. 롱 교수와 저는 최근 몇 주 동안 거의 정상적으로 일할 수 없었습니다.</p>
<p>그 과정 자체도 답답했습니다. 저자들에게 연락했을 때 단호하게 거절당했고, 학회 주최 측으로부터도 아무런 답변을 받지 못했습니다. 실제로 많은 연구자들이 이런 상황을 보고 포기하는 경우가 많습니다. 하지만 그렇게 해서 많은 독창적인 기고문이 대중의 관심에서 사라지기도 합니다.</p>
<p><strong>질리즈:</strong> 팀에서 이런 종류의 문제를 겪은 것이 이번이 처음은 아닌 것 같네요.</p>
<p><strong>Cheng Long:</strong> 네, 그렇지 않습니다.</p>
<p>이전에도 기업들이 RaBitQ를 가져와서 몇 가지 공학적 수정을 가하고 새로운 이름을 붙인 다음 RaBitQ에서 영감을 받은 것이라고만 설명하는 경우를 본 적이 있습니다.</p>
<p>그렇기 때문에 Milvus를 비롯한 일부 업계 팀이 이를 처리하는 방식을 높이 평가합니다. RaBitQ를 사용할 때는 객관적으로 설명합니다. 그리고 원래 버전보다 더 많은 최적화를 추가할 때는 이를 자신의 엔지니어링 공헌으로 명확하게 설명합니다. 이를 통해 원본 작업에 대한 적절한 크레딧을 제공하는 동시에 회사의 기술력을 보여줄 수 있습니다.</p>
<p><strong>Zilliz:</strong> 대기업에서 학술 연구를 기반으로 개발할 때 일반적으로 재정적 공유나 이익 배분을 제공하나요?</p>
<p><strong>지안양 가오:</strong> 대부분의 경우 그렇지 않습니다.</p>
<p>하지만 대기업은 여전히 기술 발전을 남의 것을 도입한 것이 아니라 자체적으로 개발한 것으로 제시하려는 강한 인센티브가 있습니다. 누구나 고객과 투자자가 가장 진보된 작업을 자기 팀의 혁신의 결과물로 보기를 원합니다.</p>
<h2 id="What-comes-next-for-vector-quantization" class="common-anchor-header">벡터 양자화의 다음 단계는 무엇인가요?<button data-href="#What-comes-next-for-vector-quantization" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>질리즈:</strong> 현재 어떤 연구 방향을 연구하고 있나요?</p>
<p><strong>청 롱:</strong> 저희 작업의 대부분은 벡터 검색에 계속 집중할 것입니다.</p>
<p>한 가지 방향은 RaBitQ를 IVF 및 HNSW와 같은 다양한 벡터 검색 인덱스와 결합하여 시스템이 더 낮은 지연 시간, 더 높은 동시성, 더 낮은 비용으로 대규모 데이터를 지원할 수 있도록 하는 것입니다. 또한 KV 캐시 압축에도 주목하고 있습니다.</p>
<p><strong>지안양 가오:</strong> 대규모 모델의 KV 캐시와 벡터 검색은 모두 고차원 벡터를 다루기 때문에 수학적으로나 시스템 수준에서나 동일한 속성을 많이 공유합니다.</p>
<p>앞으로는 추론과 훈련을 가속화하기 위해 고차원 확률의 아이디어를 포함한 수학적 도구를 적용하는 방법에 대해 더 많이 고민하고 싶습니다.</p>
<p><strong>질리즈:</strong> 분야로서 벡터 양자화의 한계는 어디인가요? 개선의 여지가 얼마나 남아있나요?</p>
<p><strong>쳉 롱:</strong> 이론적인 관점에서 보면 천장은 거의 보이지 않습니다. RaBitQ는 이미 점근적으로 최적입니다.</p>
<p>하지만 엔지니어링 측면에서는 여전히 많은 여지가 있습니다. 하드웨어 특성, 데이터 배포, 지연 시간 제약 및 기타 여러 가지 실질적인 요인을 여전히 해결해야 합니다. 그렇기 때문에 프로덕션 시스템에서는 <a href="https://milvus.io/docs/architecture_overview.md">분산 벡터 데이터베이스 아키텍처</a>, <a href="https://milvus.io/docs/sparse_vector.md">희소 벡터 지원</a>, <a href="https://milvus.io/docs/reranking.md">파이프라인 재순위</a> 지정, <a href="https://milvus.io/docs/metric.md">Milvus 거리 메</a>트릭의 메트릭 선택과 같은 영역에서 여전히 신중한 작업이 필요합니다.</p>
<h2 id="Keep-Reading" class="common-anchor-header">계속 읽기<button data-href="#Keep-Reading" class="anchor-icon" translate="no">
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
    </button></h2><p>RaBitQ의 엔지니어링 측면과 Milvus에 어떻게 적용되는지 더 자세히 알아보려면 다음 리소스를 참조하세요:</p>
<ul>
<li><a href="https://milvus.io/docs/ivf-rabitq.md">IVF_RABITQ 문서</a> - 구성 세부 정보 및 튜닝 지침.</li>
<li><a href="https://milvus.io/blog/bring-vector-compression-to-the-extreme-how-milvus-serves-3×-more-queries-with-rabitq.md">RaBitQ 통합 심층 분석</a> - Milvus가 RaBitQ를 생산 지표로 전환한 방법.</li>
<li><a href="https://milvus.io/blog/turboquant-rabitq-vector-database-cost.md">벡터 양자화가 AI 인프라 비용에 미치는 영향</a> - TurboQuant-RaBitQ 논의에 대한 광범위한 분석.</li>
<li><a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md">Milvus 2.6 릴리즈 포스트</a> - IVF_RABITQ가 실제 Milvus 인덱스 옵션으로 출시된 곳.</li>
<li><a href="https://milvus.io/docs/index-explained.md">Milvus 인덱스 설명</a> - IVF_RABITQ가 다른 인덱스 옵션과 어떻게 어울리는지.</li>
<li><a href="https://milvus.io/docs/ivf-flat.md">IVF_FLAT 인덱싱과</a> <a href="https://milvus.io/docs/hnsw.md">HNSW 인덱싱</a> - 인덱스 트레이드오프를 비교하는 경우 유용한 기준선.</li>
<li><a href="https://milvus.io/docs/schema.md">Milvus의 스키마 설계</a> 및 <a href="https://milvus.io/docs/filtered-search.md">필터링된 검색</a> - 분리된 상태가 아닌 실제 애플리케이션에서 RaBitQ를 평가하는 경우 유용합니다.</li>
<li><a href="https://milvus.io/docs/quickstart.md">Milvus 빠른 시작</a> 및 <a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">RAG 시스템 설계</a> - 검색 파이프라인에서 이를 시도하려는 경우 유용합니다.</li>
</ul>
<p>워크로드에 대한 상담을 원하시면 <a href="https://slack.milvus.io/">Milvus Slack 커뮤니티에</a> 가입하거나 <a href="https://milvus.io/office-hours">Milvus 오피스 아워를 예약하세요</a>.</p>
<p>인프라 설정을 건너뛰고 싶다면 <a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a> (완전 관리형 Milvus)에 가입할 수 있습니다.</p>
