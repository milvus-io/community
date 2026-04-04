---
id: turboquant-rabitq-vector-database-cost.md
title: '터보퀀트-라비트큐 논쟁을 넘어서: AI 인프라 비용에 벡터 정량화가 중요한 이유'
author: Li Liu
date: 2026-4-2
cover: assets.zilliz.com/vectorquantization_0bea9e6bec.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  TurboQuant, RaBitQ, vector quantization, TurboQuant vs RaBitQ, vector database
  memory optimization
meta_title: |
  Vector Quantization: Beyond the TurboQuant-RaBitQ Debate
desc: >-
  터보퀀트-라비트큐 논쟁으로 벡터 양자화 관련 뉴스가 헤드라인을 장식했습니다. RaBitQ 1비트 압축의 작동 방식과 Milvus가 97%
  메모리 절약을 위해 IVF_RABITQ를 제공하는 방법.
origin: 'https://milvus.io/blog/turboquant-rabitq-vector-database-cost.md'
---
<p>Google의 TurboQuant 논문(ICLR 2026)에 따르면 정확도 손실이 거의 없는 6배 KV 캐시 압축은 하루 만에 <a href="https://www.cnbc.com/2026/03/26/google-ai-turboquant-memory-chip-stocks-samsung-micron.html"> 메모리 칩 재고에서 900억</a> 달러가 사라질 정도로 놀라운 결과입니다. SK하이닉스는 12% 하락했습니다. 삼성은 7% 하락했습니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Beyond_the_Turbo_Quant_Ra_Bit_Q_Debate_How_Vector_Quantization_Is_Reshaping_AI_Infrastructure_from_Paper_to_Production_1_825845eccb.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>이 논문은 곧바로 주목을 받았습니다. <a href="https://dl.acm.org/doi/10.1145/3654970">RaBitQ</a> (SIGMOD 2024)의 첫 번째 저자인 <a href="https://gaoj0017.github.io/">지안양 가오는</a> 터보퀀트의 방법론과 벡터 양자화에 대한 자신의 이전 연구 사이의 관계에 대해 <a href="https://medium.com/@gaojianyang0017/turboquant-and-rabitq-what-the-public-story-gets-wrong-23df83209c22">의문을 제기했습니다</a>. (곧 가오 박사와의 대담을 게시할 예정이니 관심 있으시면 팔로우해 주세요.)</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Beyond_the_Turbo_Quant_Ra_Bit_Q_Debate_How_Vector_Quantization_Is_Reshaping_AI_Infrastructure_from_Paper_to_Production_2_0860406cae.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>이 글은 이러한 논의에서 어느 한 편을 들기 위한 것이 아닙니다. <a href="https://milvus.io/docs/index-explained.md">벡터 양자화</a> 논문 하나가 900억 달러의 시장 가치를 움직일 수 있다는 사실은 이 기술이 AI 인프라에 얼마나 중요한지 말해줍니다. 추론 엔진의 KV 캐시 압축이든 <a href="https://zilliz.com/learn/what-is-vector-database">벡터 데이터베이스의</a> 인덱스 압축이든, 품질을 유지하면서 고차원 데이터를 축소하는 능력은 막대한 비용에 영향을 미치며, 이는 우리가 RaBitQ를 <a href="https://milvus.io/">Milvus</a> 벡터 데이터베이스에 통합하여 생산 인프라로 전환하면서 해결하고자 노력해 온 문제이기도 합니다.</p>
<p>이 글에서는 벡터 양자화가 현재 중요한 이유, TurboQuant와 RaBitQ의 비교, RaBitQ의 정의와 작동 방식, Milvus에 탑재하기 위한 엔지니어링 작업, AI 인프라의 광범위한 메모리 최적화 환경에 대해 다룰 예정입니다.</p>
<h2 id="Why-Does-Vector-Quantization-Matter-for-Infrastructure-Costs" class="common-anchor-header">벡터 양자화가 인프라 비용에 중요한 이유는 무엇인가요?<button data-href="#Why-Does-Vector-Quantization-Matter-for-Infrastructure-Costs" class="anchor-icon" translate="no">
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
    </button></h2><p>벡터 양자화는 새로운 것이 아닙니다. 새로운 것은 업계에서 이를 얼마나 시급하게 필요로 하는가입니다. 지난 2년 동안 LLM 파라미터는 급증했고, 컨텍스트 윈도우는 4K에서 128K+ 토큰으로 늘어났으며, 텍스트, 이미지, 오디오, 비디오 등 비정형 데이터는 AI 시스템의 주요 입력이 되었습니다. 이러한 모든 추세는 저장, 색인화, 검색해야 하는 고차원 벡터를 더 많이 생성합니다. 더 많은 벡터, 더 많은 메모리, 더 많은 비용.</p>
<p><a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">RAG 파이프라인</a>, 추천 엔진, 멀티모달 검색 등 대규모로 벡터 검색을 실행하는 경우, 메모리 비용은 가장 큰 인프라 골칫거리 중 하나일 것입니다.</p>
<p>모델을 배포하는 동안 모든 주요 LLM 추론 스택은 이전에 계산된 키-값 쌍을 저장하여 주의 메커니즘이 모든 새 토큰에 대해 다시 계산하지 않도록 하는 <a href="https://zilliz.com/glossary/kv-cache">KV 캐시에</a> 의존합니다. 이것이 바로 O(n²) 대신 O(n) 추론을 가능하게 하는 원동력입니다. <a href="https://github.com/vllm-project/vllm">vLLM에서</a> <a href="https://github.com/NVIDIA/TensorRT-LLM">TensorRT-LLM에</a> 이르는 모든 프레임워크가 이 기술에 의존합니다. 하지만 KV 캐시는 모델 가중치 자체보다 더 많은 GPU 메모리를 소비할 수 있습니다. 컨텍스트가 길어지고 동시 사용자가 많아지면 빠르게 증가합니다.</p>
<p>수십억 개의 고차원 벡터가 각각 차원당 32비트 부동 소수점으로 메모리에 저장되어 있는 벡터 데이터베이스에도 동일한 압박이 가해집니다. 벡터 양자화는 이러한 벡터를 32비트 플로트에서 4비트, 2비트, 심지어 1비트 표현으로 압축하여 메모리를 90% 이상 줄입니다. 추론 엔진의 KV 캐시든 벡터 데이터베이스의 인덱스든, 기본 수학은 동일하며 비용 절감 효과는 실질적입니다. 이 분야의 획기적인 발전을 보고한 논문 한 편으로 주식 시장 가치가 900억 달러나 상승한 이유도 바로 이 때문입니다.</p>
<h2 id="TurboQuant-vs-RaBitQ-Whats-the-Difference" class="common-anchor-header">TurboQuant와 RaBitQ: 차이점은 무엇인가요?<button data-href="#TurboQuant-vs-RaBitQ-Whats-the-Difference" class="anchor-icon" translate="no">
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
    </button></h2><p>TurboQuant와 RaBitQ는 모두 양자화 전에 입력 벡터에 무작위 회전<a href="https://arxiv.org/abs/2406.03482">(존슨-린덴스트라우스 변환)</a>을 적용하는 동일한 기본 기술을 기반으로 합니다. 이 회전은 불규칙하게 분포된 데이터를 예측 가능한 균일한 분포로 변환하여 낮은 오차로 더 쉽게 정량화할 수 있게 해줍니다.</p>
<p>이러한 공통 기반 외에도, 이 두 가지는 서로 다른 문제를 대상으로 하며 서로 다른 접근 방식을 취합니다:</p>
<table>
<thead>
<tr><th></th><th>TurboQuant</th><th>RaBitQ</th></tr>
</thead>
<tbody>
<tr><td><strong>목표</strong></td><td>LLM 추론의 KV 캐시(임시, 요청별 데이터)</td><td>데이터베이스의 영구 벡터 인덱스(저장된 데이터)</td></tr>
<tr><td><strong>접근 방식</strong></td><td>2단계: PolarQuant(좌표당 로이드-맥스 스칼라 양자화기) + <a href="https://arxiv.org/abs/2406.03482">QJL</a> (1비트 잔류 보정)</td><td>단일 단계: 하이퍼큐브 투영 + 비편향 거리 추정기</td></tr>
<tr><td><strong>비트 폭</strong></td><td>3비트 키, 2비트 값(혼합 정밀도)</td><td>차원당 1비트(다중 비트 변형 사용 가능)</td></tr>
<tr><td><strong>이론적 주장</strong></td><td>최적에 가까운 MSE 왜곡률</td><td>점근적으로 최적의 내부 제품 추정 오차(알론-클라탁 하한과 일치)</td></tr>
<tr><td><strong>생산 상태</strong></td><td>커뮤니티 구현, Google에서 공식 출시되지 않음</td><td><a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md">Milvus 2.6에서</a> 제공, Faiss, VSAG, Elasticsearch에서 채택됨</td></tr>
</tbody>
</table>
<p>실무자를 위한 핵심적인 차이점: TurboQuant는 추론 엔진 내부의 일시적인 KV 캐시를 최적화하는 반면, RaBitQ는 벡터 데이터베이스가 수십억 개의 벡터에 걸쳐 구축, 샤드 및 쿼리하는 영구 인덱스를 대상으로 합니다. 이 글의 나머지 부분에서는 Milvus 내부에 통합되어 프로덕션 버전으로 제공되는 알고리즘인 RaBitQ에 대해 집중적으로 살펴보겠습니다.</p>
<h2 id="What-Is-RaBitQ-and-What-Does-It-Deliver" class="common-anchor-header">RaBitQ란 무엇이며 어떤 기능을 제공하나요?<button data-href="#What-Is-RaBitQ-and-What-Does-It-Deliver" class="anchor-icon" translate="no">
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
    </button></h2><p>먼저 결론부터 말씀드리자면, 768차원의 천만 개의 벡터 데이터 세트에서 RaBitQ는 각 벡터를 원래 크기의 1/32로 압축하는 동시에 94% 이상의 리콜률을 유지합니다. Milvus에서 이는 전체 정밀도 인덱스보다 3.6배 높은 쿼리 처리량을 의미합니다. 이것은 이론적인 예측이 아니라 Milvus 2.6의 벤치마크 결과입니다.</p>
<p>이제 어떻게 그렇게 되는지 알아보겠습니다.</p>
<p>기존의 2진 양자화는 FP32 벡터를 차원당 1비트, 즉 32배 압축으로 압축합니다. 단점: 너무 많은 정보를 버리기 때문에 리콜 붕괴가 발생합니다. <a href="https://arxiv.org/abs/2405.12497">RaBitQ</a> (Gao &amp; Long, SIGMOD 2024)는 동일한 32배 압축을 유지하지만 검색에 실제로 중요한 정보는 보존합니다. <a href="https://arxiv.org/abs/2409.09913">확장 버전</a> (Gao &amp; Long, SIGMOD 2025)은 이것이 점근적으로 최적이라는 것을 증명하며, Alon &amp; Klartag(FOCS 2017)가 설정한 이론적 하한과 일치합니다.</p>
<h3 id="Why-Do-Angles-Matter-More-Than-Coordinates-in-High-Dimensions" class="common-anchor-header">고차원에서 좌표보다 각도가 더 중요한 이유는 무엇인가요?</h3><p>핵심 인사이트: <strong>고차원에서는 벡터 사이의 각도가 개별 좌표 값보다 더 안정적이고 유용한 정보를 제공합니다.</strong> 이는 측정값 집중의 결과로, 존슨-린덴스트라우스 랜덤 투영이 작동하는 것과 같은 현상입니다.</p>
<p>이것이 실제로 의미하는 바는 고차원 벡터의 정확한 좌표값을 버리고 데이터 집합을 기준으로 한 방향만 유지할 수 있다는 것입니다. <a href="https://zilliz.com/glossary/anns">최접근 이웃 검색이</a> 실제로 의존하는 각도 관계는 압축 후에도 살아남습니다.</p>
<h3 id="How-Does-RaBitQ-Work" class="common-anchor-header">RaBitQ는 어떻게 작동하나요?</h3><p>RaBitQ는 이 기하학적 인사이트를 세 단계로 변환합니다:</p>
<p><strong>1단계: 정규화.</strong> 데이터 세트 중심을 기준으로 각 벡터의 중심을 잡고 단위 길이에 맞게 배율을 조정합니다. 이렇게 하면 문제를 단위 벡터 간의 내적 곱 추정으로 변환하여 분석과 바인딩이 더 쉬워집니다.</p>
<p><strong>2단계: 무작위 회전 + 하이퍼큐브 투영.</strong> 임의의 직교 행렬(존슨-린덴스트라우스 유형 회전)을 적용하여 특정 축에 대한 편향을 제거합니다. 각 회전된 벡터를 {±1/√D}^D 하이퍼큐브의 가장 가까운 꼭지점에 투영합니다. 각 차원은 단일 비트로 축소됩니다. 결과는 벡터당 D비트 이진 코드입니다.</p>
<p><strong>3단계: 편향되지 않은 거리 추정.</strong> 쿼리와 원래(수량화되지 않은) 벡터 사이의 내적 곱에 대한 추정기를 구축합니다. 이 추정기는 오차가 O(1/√D)로 제한되는 편향되지 않은 것으로 증명됩니다. 768차원 벡터의 경우, 94% 이상의 리콜을 유지합니다.</p>
<p>이진 벡터 사이의 거리 계산은 최신 CPU가 한 주기로 실행하는 비트 AND + 팝카운트 연산으로 축소됩니다. 이것이 바로 RaBitQ가 작을 뿐만 아니라 빠른 이유입니다.</p>
<h3 id="Why-Is-RaBitQ-Practical-Not-Just-Theoretical" class="common-anchor-header">RaBitQ가 이론이 아닌 실용적인 이유는 무엇인가요?</h3><ul>
<li><strong>교육이 필요하지 않습니다.</strong> 회전을 적용하고 부호를 확인하면 됩니다. 반복적인 최적화나 코드북 학습이 필요 없습니다. 인덱싱 시간은 <a href="https://milvus.io/docs/ivf-pq.md">제품 정량화와</a> 비슷합니다.</li>
<li><strong>하드웨어 친화적입니다.</strong> 거리 계산은 비트 단위 AND + 팝카운트입니다. 최신 CPU(Intel IceLake+, AMD Zen 4+)에는 전용 AVX512VPOPCNTDQ 명령어가 있습니다. 단일 벡터 추정은 PQ 룩업 테이블보다 3배 더 빠르게 실행됩니다.</li>
<li><strong>멀티비트 유연성.</strong> <a href="https://vectordb-ntu.github.io/RaBitQ-Library/">RaBitQ 라이브러리는</a> 1비트 이상의 변형을 지원합니다: 4비트는 ~90%, 5비트는 ~95%, 7비트는 ~99%의 리콜을 달성하며 모두 재랭크 없이 가능합니다.</li>
<li><strong>컴포저블.</strong> <a href="https://milvus.io/docs/ivf-flat.md">IVF 인덱스</a> 및 <a href="https://milvus.io/docs/hnsw.md">HNSW 그래프와</a> 같은 기존 인덱스 구조에 연결할 수 있으며, 배치 거리 계산을 위해 FastScan과 함께 작동합니다.</li>
</ul>
<h2 id="From-Paper-to-Production-What-We-Built-to-Ship-RaBitQ-in-Milvus" class="common-anchor-header">종이에서 생산까지: Milvus에서 RaBitQ를 출시하기 위해 구축한 것들<button data-href="#From-Paper-to-Production-What-We-Built-to-Ship-RaBitQ-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>원래 RaBitQ 코드는 단일 머신 연구용 프로토타입입니다. 샤딩, 장애 조치, 실시간 수집을 통해 <a href="https://milvus.io/docs/architecture_overview.md">분산된 클러스터에서</a> 작동하도록 하려면 네 가지 엔지니어링 문제를 해결해야 했습니다. <a href="https://zilliz.com/">질리즈에서는</a> 단순히 알고리즘을 구현하는 것을 넘어 엔진 통합, 하드웨어 가속, 인덱스 최적화, 런타임 튜닝 등의 작업을 통해 RaBitQ를 Milvus 내부의 산업 등급 기능으로 전환했습니다. 자세한 내용은 이 블로그에서도 확인할 수 있습니다: <a href="https://milvus.io/blog/bring-vector-compression-to-the-extreme-how-milvus-serves-3%C3%97-more-queries-with-rabitq.md">벡터 압축을 극한으로 끌어올리기: Milvus가 RaBitQ로 3배 더 많은 쿼리를 처리하는 방법</a></p>
<h3 id="Making-RaBitQ-Distributed-Ready" class="common-anchor-header">RaBitQ의 분산 준비 완료</h3><p>저희는 플러그인이 아닌 통합 인터페이스를 갖춘 기본 인덱스 유형으로 Milvus의 핵심 검색 엔진인 <a href="https://github.com/milvus-io/knowhere">Knowhere에</a> RaBitQ를 직접 통합했습니다. 이 인덱스는 샤딩, 파티셔닝, 동적 확장, <a href="https://milvus.io/docs/manage-collections.md">수집 관리</a> 등 Milvus의 전체 분산 아키텍처와 함께 작동합니다.</p>
<p>핵심 과제는 양자화 코드북(회전 행렬, 중심 벡터, 스케일링 파라미터)을 세그먼트 인식으로 만들어 각 샤드가 자체적인 양자화 상태를 구축하고 저장하도록 하는 것입니다. 인덱스 빌드, 압축, 로드 밸런싱은 모두 기본적으로 새로운 인덱스 유형을 이해합니다.</p>
<h3 id="Squeezing-Every-Cycle-Out-of-Popcount" class="common-anchor-header">팝카운트에서 모든 사이클을 짜내기</h3><p>RaBitQ의 속도는 바이너리 벡터에서 설정된 비트를 세는 팝카운트에서 비롯됩니다. 이 알고리즘은 본질적으로 빠르지만, 처리량은 하드웨어를 얼마나 잘 사용하느냐에 따라 달라집니다. 저희는 두 가지 주요 서버 아키텍처를 위한 전용 SIMD 코드 경로를 구축했습니다:</p>
<ul>
<li><strong>x86(인텔 아이스레이크+ / AMD Zen 4+):</strong> AVX-512의 VPOPCNTDQ 명령어는 여러 512비트 레지스터에서 팝카운트를 병렬로 계산합니다. Knowhere의 내부 루프는 이진 거리 계산을 SIMD 폭 청크로 일괄 처리하도록 재구성되어 처리량을 최대화합니다.</li>
<li><strong>ARM(그래비톤, 암페어):</strong> 동일한 병렬 팝카운트 패턴을 위한 SVE(확장 가능한 벡터 확장) 명령어 - 비용 최적화된 클라우드 배포에서 ARM 인스턴스가 점점 더 일반화되고 있기 때문에 매우 중요합니다.</li>
</ul>
<h3 id="Eliminating-Runtime-Overhead" class="common-anchor-header">런타임 오버헤드 제거</h3><p>RaBitQ는 쿼리 시 데이터 세트 중심, 벡터별 노름, 각 양자화된 벡터와 원본 사이의 내부 곱(거리 추정기에서 사용) 등 보조 부동 소수점 매개변수가 필요합니다. 쿼리마다 이를 계산하면 지연 시간이 늘어납니다. 전체 원본 벡터를 저장하면 압축의 목적이 무색해집니다.</p>
<p>우리의 해결책은 인덱스 빌드 중에 이러한 매개변수를 미리 계산하고 유지하여 바이너리 코드와 함께 캐싱하는 것입니다. 메모리 오버헤드는 작지만(벡터당 몇 개의 플로트), 쿼리당 계산을 없애고 높은 동시성에서도 지연 시간을 안정적으로 유지합니다.</p>
<h3 id="IVFRABITQ-The-Index-You-Actually-Deploy" class="common-anchor-header">IVF_RABITQ: 실제로 배포하는 인덱스</h3><p><a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md">Milvus 2.6부터는</a> <a href="https://milvus.io/docs/ivf-rabitq.md">IVF_RABITQ</a> - <a href="https://milvus.io/docs/ivf-flat.md">반전 파일 인덱스</a> + RaBitQ 양자화 기능을 제공합니다. 검색은 두 단계로 진행됩니다:</p>
<ol>
<li><strong>거친 검색(IVF).</strong> K-평균은 벡터 공간을 클러스터로 분할합니다. 쿼리 시에는 가장 가까운 n프로브 클러스터만 스캔합니다.</li>
<li><strong>미세 점수화(RaBitQ).</strong> 각 클러스터 내에서 1비트 코드와 편향되지 않은 추정기를 사용하여 거리를 추정합니다. 팝카운트는 무거운 작업을 처리합니다.</li>
</ol>
<p>768차원, 1,000만 개의 벡터 데이터 세트에 대한 결과입니다:</p>
<table>
<thead>
<tr><th>메트릭</th><th>IVF_FLAT(기준선)</th><th>IVF_RABITQ</th><th>IVF_RABITQ + SQ8 정제</th></tr>
</thead>
<tbody>
<tr><td>리콜</td><td>95.2%</td><td>94.7%</td><td>~95%</td></tr>
<tr><td>QPS</td><td>236</td><td>864</td><td>-</td></tr>
<tr><td>메모리 풋프린트</td><td>32비트/디엠</td><td>1비트/디엠(원본의 ~3%)</td><td>원본의 ~25%</td></tr>
</tbody>
</table>
<p>0.5%의 리콜 간격도 허용할 수 없는 워크로드의 경우, refine_type 매개변수는 두 번째 스코어링 패스를 추가합니다: SQ6, SQ8, FP16, BF16 또는 FP32입니다. SQ8이 일반적으로 선택되며, 원래 메모리의 약 1/4 수준에서 리콜을 IVF_FLAT 수준으로 복원합니다. 또한 쿼리 측에 <a href="https://milvus.io/docs/ivf-sq8.md">스칼라 양자화를</a> 독립적으로 적용(SQ1-SQ8)하여 워크로드당 지연 시간-리콜 비용 절충을 조정할 수 있는 두 개의 노브를 제공할 수도 있습니다.</p>
<h2 id="How-Milvus-Optimizes-Memory-Beyond-Quantization" class="common-anchor-header">밀버스가 양자화를 넘어 메모리를 최적화하는 방법<button data-href="#How-Milvus-Optimizes-Memory-Beyond-Quantization" class="anchor-icon" translate="no">
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
    </button></h2><p>RaBitQ는 가장 극적인 압축 수단이지만, 광범위한 <a href="https://milvus.io/blog/milvus-26-preview-72-memory-reduction-without-compromising-recall-and-4x-faster-than-elasticsearch.md">메모리 최적화</a> 스택의 한 계층에 불과합니다:</p>
<table>
<thead>
<tr><th>전략</th><th>역할</th><th>영향</th></tr>
</thead>
<tbody>
<tr><td><strong>풀스택 양자화</strong></td><td>다양한 정밀도-비용 트레이드 오프의 SQ8, PQ, RaBitQ</td><td>4배에서 32배 메모리 감소</td></tr>
<tr><td><strong>인덱스 구조 최적화</strong></td><td>HNSW 그래프 압축, DiskANN SSD 오프로딩, OOM 안전 인덱스 빌드</td><td>인덱스당 더 적은 DRAM, 노드당 더 큰 데이터 세트</td></tr>
<tr><td><strong>메모리 매핑 I/O(mmap)</strong></td><td>벡터 파일을 디스크에 매핑, OS 페이지 캐시를 통해 온디맨드 페이지 로드</td><td>모든 것을 RAM에 로드하지 않고도 TB급 데이터세트 지원</td></tr>
<tr><td><strong>계층형 스토리지</strong></td><td>자동 스케줄링을 통한 핫/웜/콜드 데이터 분리</td><td>자주 액세스하는 데이터에 대해서만 메모리 가격 지불</td></tr>
<tr><td><strong>클라우드 네이티브 스케일링</strong><a href="https://zilliz.com/cloud">(Zilliz Cloud</a>, 관리형 Milvus)</td><td>탄력적인 메모리 할당, 유휴 리소스 자동 해제</td><td>사용한 만큼만 지불</td></tr>
</tbody>
</table>
<h3 id="Full-Stack-Quantization" class="common-anchor-header">풀스택 정량화</h3><p>RaBitQ의 1비트 극한 압축이 모든 워크로드에 적합한 것은 아닙니다. Milvus는 완벽한 양자화 매트릭스를 제공합니다: 정밀도와 비용의 균형이 필요한 워크로드를 위한 <a href="https://milvus.io/docs/ivf-sq8.md">SQ8</a> 및 <a href="https://milvus.io/docs/ivf-pq.md">제품 양자화(PQ)</a>, 초대형 데이터 세트에서 최대 압축을 위한 RaBitQ, 세밀한 제어를 위해 여러 방법을 결합한 하이브리드 구성 등 다양한 양자화 매트릭스를 제공합니다.</p>
<h3 id="Index-Structure-Optimization" class="common-anchor-header">인덱스 구조 최적화</h3><p>양자화 외에도 Milvus는 핵심 인덱스 구조의 메모리 오버헤드를 지속적으로 최적화하고 있습니다. <a href="https://milvus.io/docs/hnsw.md">HNSW의</a> 경우, 인접성 목록 중복성을 줄여 그래프당 메모리 사용량을 줄였습니다. <a href="https://milvus.io/docs/diskann.md">DiskANN은</a> 벡터 데이터와 인덱스 구조를 모두 SSD로 푸시하여 대규모 데이터 세트의 DRAM 의존성을 획기적으로 줄였습니다. 또한 노드 메모리 제한에 근접하는 데이터 세트에 인덱스를 구축할 때 OOM 장애를 방지하기 위해 인덱스 구축 중 중간 메모리 할당을 최적화했습니다.</p>
<h3 id="Smart-Memory-Loading" class="common-anchor-header">스마트 메모리 로딩</h3><p>Milvus의 <a href="https://milvus.io/docs/mmap.md">mmap</a> (메모리 매핑 I/O) 지원은 벡터 데이터를 디스크 파일에 매핑하여 온디맨드 로딩을 위해 OS 페이지 캐시에 의존하므로 시작 시 모든 데이터를 메모리에 로드할 필요가 없습니다. 갑작스러운 메모리 급증을 방지하는 지연 로딩 및 세그먼트 로딩 전략과 결합하여 적은 메모리 비용으로 TB 규모의 벡터 데이터세트를 원활하게 운영할 수 있습니다.</p>
<h3 id="Tiered-Storage" class="common-anchor-header">계층형 스토리지</h3><p>Milvus의 <a href="https://milvus.io/docs/tiered-storage-overview.md">3계층 스토리지 아키텍처는</a> 메모리, SSD, 오브젝트 스토리지를 아우르며, 핫 데이터는 낮은 지연 시간을 위해 메모리에, 웜 데이터는 성능과 비용의 균형을 위해 SSD에 캐시되며, 콜드 데이터는 오버헤드를 최소화하기 위해 오브젝트 스토리지로 싱크됩니다. 시스템이 데이터 스케줄링을 자동으로 처리하므로 애플리케이션 계층을 변경할 필요가 없습니다.</p>
<h3 id="Cloud-Native-Scaling" class="common-anchor-header">클라우드 네이티브 스케일링</h3><p>Milvus의 <a href="https://milvus.io/docs/architecture_overview.md">분산 아키텍처에서는</a> 데이터 샤딩과 로드 밸런싱을 통해 단일 노드 메모리 과부하를 방지합니다. 메모리 풀링은 조각화를 줄이고 사용률을 향상시킵니다. 서버리스 모드에서는 유휴 리소스가 자동으로 해제되어 총 소유 비용을 더욱 절감하는 온디맨드 메모리 확장을 위한 탄력적인 스케줄링으로 한 단계 더 발전한 <a href="https://zilliz.com/cloud">Zilliz Cloud</a> (완전 관리형 Milvus)를 사용할 수 있습니다.</p>
<h3 id="How-These-Layers-Compound" class="common-anchor-header">이러한 계층의 결합 방식</h3><p>이러한 최적화는 대안이 아니라 중첩됩니다. RaBitQ는 벡터를 축소합니다. DiskANN은 SSD에 인덱스를 유지합니다. Mmap은 콜드 데이터를 메모리에 로드하지 않습니다. <a href="https://milvus.io/blog/milvus-tiered-storage-80-less-vector-search-cost-with-on-demand-hot–cold-data-loading.md">계층형 스토리지는</a> 아카이브 데이터를 오브젝트 스토리지로 푸시합니다. 그 결과, 수십억 개의 벡터를 제공하는 배포에는 수십억 개의 벡터에 해당하는 RAM이 필요하지 않습니다.</p>
<h2 id="Get-Started" class="common-anchor-header">시작하기<button data-href="#Get-Started" class="anchor-icon" translate="no">
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
    </button></h2><p>AI 데이터의 양이 계속 증가함에 따라 벡터 데이터베이스의 효율성과 비용이 AI 애플리케이션의 확장 가능 범위를 직접적으로 결정하게 될 것입니다. 저희는 더 많은 AI 애플리케이션이 프로토타입에서 생산 단계로 나아갈 수 있도록 고성능, 저비용의 벡터 인프라에 지속적으로 투자할 것입니다.</p>
<p><a href="https://github.com/milvus-io/milvus">Milvus는</a> 오픈 소스입니다. IVF_RABITQ를 사용해 보려면:</p>
<ul>
<li>구성 및 튜닝 지침은 <a href="https://milvus.io/docs/ivf-rabitq.md">IVF_RABITQ 설명서를</a> 참조하세요.</li>
<li>자세한 벤치마크 및 구현 세부 사항은 <a href="https://milvus.io/blog/bring-vector-compression-to-the-extreme-how-milvus-serves-3×-more-queries-with-rabitq.md">RaBitQ 통합 블로그 게시물</a> 전문을 읽어보세요.</li>
<li><a href="https://slack.milvus.io/">Milvus Slack 커뮤니티에</a> 가입하여 질문하고 다른 개발자로부터 배워보세요.</li>
<li><a href="https://milvus.io/office-hours">무료 Milvus 오피스 아워 세션을 예약하여</a> 사용 사례를 살펴보세요.</li>
</ul>
<p>인프라 설정을 건너뛰고 싶으시다면 <a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a> (완전 관리형 Milvus)에서 IVF_RABITQ가 지원되는 무료 티어를 제공합니다.</p>
<p>곧 있을 <a href="https://personal.ntu.edu.sg/c.long/">청 롱</a> 교수(NTU, VectorDB@NTU)와 RaBitQ의 첫 번째 저자인 <a href="https://gaoj0017.github.io/">지안양 가오 박사</a> (ETH 취리히)와의 인터뷰를 통해 벡터 양자화 이론과 다음 단계에 대해 더 자세히 알아볼 예정입니다. 댓글로 궁금한 점을 남겨주세요.</p>
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
    </button></h2><h3 id="What-are-TurboQuant-and-RaBitQ" class="common-anchor-header">TurboQuant와 RaBitQ란 무엇인가요?</h3><p>TurboQuant(Google, ICLR 2026)와 RaBitQ(Gao &amp; Long, SIGMOD 2024)는 모두 무작위 회전을 사용해 고차원 벡터를 압축하는 벡터 양자화 방식입니다. TurboQuant는 LLM 추론에서 KV 캐시 압축을 목표로 하는 반면, RaBitQ는 데이터베이스의 영구 벡터 인덱스를 목표로 합니다. 두 가지 모두 현재 벡터 양자화에 대한 관심의 물결에 기여했지만, 시스템마다 다른 문제를 해결합니다.</p>
<h3 id="How-does-RaBitQ-achieve-1-bit-quantization-without-destroying-recall" class="common-anchor-header">RaBitQ는 어떻게 리콜을 파괴하지 않고 1비트 양자화를 달성하나요?</h3><p>RaBitQ는 고차원 공간에서의 측정 집중도를 활용합니다. 벡터 사이의 각도는 차원이 증가할수록 개별 좌표값보다 더 안정적입니다. 데이터 세트 중심을 기준으로 벡터를 정규화한 다음, 각 벡터를 하이퍼큐브의 가장 가까운 꼭지점에 투영합니다(각 차원을 단일 비트로 축소). 증명 가능한 오차 한계를 가진 편향되지 않은 거리 추정기는 압축에도 불구하고 정확한 검색을 유지합니다.</p>
<h3 id="What-is-IVFRABITQ-and-when-should-I-use-it" class="common-anchor-header">IVF_RABITQ란 무엇이며 언제 사용해야 하나요?</h3><p>IVF_RABITQ는 역방향 파일 클러스터링과 RaBitQ 1비트 양자화를 결합한 Milvus의 벡터 인덱스 유형(버전 2.6부터 사용 가능)입니다. IVF_FLAT의 3.6배 처리량으로 94.7%의 리콜률을 달성하며, 메모리 사용량은 원본 벡터의 약 1/32 수준입니다. 대규모 벡터 검색(수백만에서 수십억 개의 벡터)을 처리해야 하고 메모리 비용이 주요 관심사이며 RAG, 추천 및 멀티모달 검색 워크로드에서 흔히 사용되는 경우에 이 방법을 사용합니다.</p>
<h3 id="How-does-vector-quantization-relate-to-KV-cache-compression-in-LLMs" class="common-anchor-header">벡터 양자화는 LLM에서 KV 캐시 압축과 어떤 관련이 있나요?</h3><p>두 문제 모두 고차원 부동소수점 벡터를 압축하는 것과 관련이 있습니다. KV 캐시는 트랜스포머 주의 메커니즘의 키-값 쌍을 저장하는데, 컨텍스트 길이가 길면 메모리 사용량에서 모델 가중치를 초과할 수 있습니다. RaBitQ와 같은 벡터 양자화 기술은 이러한 벡터를 더 낮은 비트 표현으로 축소합니다. 측정 집중도, 무작위 회전, 편향되지 않은 거리 추정 등 동일한 수학적 원리가 데이터베이스 인덱스에서 벡터를 압축하든 추론 엔진의 KV 캐시에서 벡터를 압축하든 모두 적용됩니다.</p>
