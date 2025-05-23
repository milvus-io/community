---
id: >-
  we-benchmarked-20-embedding-apis-with-milvus-7-insights-that-will-surprise-you.md
title: 'Milvus로 20개 이상의 임베딩 API를 벤치마킹한 결과: 놀랄만한 7가지 인사이트'
author: Jeremy Zhu
date: 2025-05-23T00:00:00.000Z
desc: >-
  가장 인기 있는 임베딩 API가 가장 빠른 것은 아닙니다. 모델 아키텍처보다 지리가 더 중요합니다. 그리고 때로는 월 20달러의 CPU가 월
  200달러의 API 호출을 능가하기도 합니다.
cover: >-
  assets.zilliz.com/We_Benchmarked_20_Embedding_AP_Is_with_Milvus_7_Insights_That_Will_Surprise_You_12268622f0.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search'
meta_keywords: 'Milvus, Embedding API, RAG, latency, vector search'
meta_title: >
  We Benchmarked 20+ Embedding APIs with Milvus: 7 Insights That Will Surprise
  You
origin: >-
  https://milvus.io/blog/we-benchmarked-20-embedding-apis-with-milvus-7-insights-that-will-surprise-you.md
---
<p><strong>아마도 모든 AI 개발자는 자신의 로컬 환경에서 완벽하게 작동하는 RAG 시스템을 구축했을 것입니다.</strong></p>
<p>검색 정확도를 높이고, 벡터 데이터베이스를 최적화했으며, 데모는 버터처럼 원활하게 실행됩니다. 그런 다음 프로덕션에 배포하면 갑자기 문제가 생깁니다:</p>
<ul>
<li><p>실제 사용자의 로컬 쿼리에 200ms가 걸리던 시간이 3초로 단축됩니다.</p></li>
<li><p>다른 지역에 있는 동료들이 완전히 다른 성능을 보고합니다.</p></li>
<li><p>"최고의 정확도"를 위해 선택한 임베딩 제공업체가 가장 큰 병목 현상이 됩니다.</p></li>
</ul>
<p>어떻게 된 걸까요? 아무도 벤치마킹하지 않는 성능 킬러는 바로 <strong>임베딩 API 지연 시간입니다</strong>.</p>
<p>MTEB 순위는 리콜 점수와 모델 크기에 집착하지만, 사용자가 응답을 보기까지 얼마나 오래 기다려야 하는지에 대한 측정 항목은 무시합니다. 실제 조건에서 모든 주요 임베딩 제공업체를 테스트한 결과, 전체 제공업체 선택 전략에 의문을 품게 할 정도로 극심한 지연 시간 차이를 발견했습니다.</p>
<p><strong><em>스포일러: 가장 인기 있는 임베딩 API가 가장 빠른 것은 아닙니다. 모델 아키텍처보다 지리적 위치가 더 중요합니다. 그리고 때때로 <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mn>월 20/월</mn></mrow><annotation encoding="application/x-tex">CPU비트사20/월이</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord">월</span><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mord"></span><span class="mord mathnormal">20/월</span><span class="mord">CPU비트사200/월</span></span></span></span>API 호출을 <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><annotation encoding="application/x-tex">능가하기도</annotation></semantics></math></span></span>합니다.</em></strong></p>
<h2 id="Why-Embedding-API-Latency-Is-the-Hidden-Bottleneck-in-RAG" class="common-anchor-header">API 지연 시간을 임베딩하는 것이 RAG의 숨겨진 병목 현상인 이유<button data-href="#Why-Embedding-API-Latency-Is-the-Hidden-Bottleneck-in-RAG" class="anchor-icon" translate="no">
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
    </button></h2><p>RAG 시스템, 이커머스 검색 또는 추천 엔진을 구축할 때, 임베딩 모델은 텍스트를 벡터로 변환하여 기계가 의미를 이해하고 효율적인 유사도 검색을 수행할 수 있도록 하는 핵심 구성 요소입니다. 일반적으로 문서 라이브러리의 임베딩은 사전 계산되지만, 사용자 쿼리는 검색 전에 질문을 벡터로 변환하기 위해 실시간 임베딩 API 호출이 필요하며, 이러한 실시간 지연 시간은 전체 애플리케이션 체인에서 성능 병목현상이 되는 경우가 많습니다.</p>
<p>MTEB와 같이 널리 사용되는 임베딩 벤치마크는 리콜 정확도나 모델 크기에 초점을 맞추기 때문에 중요한 성능 지표인 API 지연 시간을 간과하는 경우가 많습니다. Milvus의 <code translate="no">TextEmbedding</code> 함수를 사용하여 북미와 아시아의 주요 임베딩 서비스 제공업체를 대상으로 종합적인 실제 테스트를 실시했습니다.</p>
<p>임베딩 지연 시간은 두 가지 중요한 단계에서 나타납니다:</p>
<h3 id="Query-Time-Impact" class="common-anchor-header">쿼리 시간 영향</h3><p>일반적인 RAG 워크플로우에서는 사용자가 질문을 하면 시스템이 이를 처리해야 합니다:</p>
<ul>
<li><p>임베딩 API 호출을 통해 쿼리를 벡터로 변환합니다.</p></li>
<li><p>Milvus에서 유사한 벡터를 검색합니다.</p></li>
<li><p>결과와 원래 질문을 LLM에 피드합니다.</p></li>
<li><p>답변 생성 및 반환</p></li>
</ul>
<p>많은 개발자는 LLM의 답변 생성이 가장 느린 부분이라고 생각합니다. 그러나 많은 LLM의 스트리밍 출력 기능은 첫 번째 토큰을 빠르게 볼 수 있다는 속도에 대한 착각을 불러일으킵니다. 실제로 임베딩 API 호출에 수백 밀리초 또는 몇 초가 걸리는 경우, 이는 응답 체인에서 가장 먼저, 그리고 가장 눈에 띄는 병목 현상이 됩니다.</p>
<h3 id="Data-Ingestion-Impact" class="common-anchor-header">데이터 수집 영향</h3><p>인덱스를 처음부터 구축하든 일상적인 업데이트를 수행하든, 대량 수집을 하려면 수천 또는 수백만 개의 텍스트 청크를 벡터화해야 합니다. 각 임베딩 호출에서 지연 시간이 길어지면 전체 데이터 파이프라인의 속도가 급격히 느려져 제품 릴리즈와 지식창고 업데이트가 지연됩니다.</p>
<p>두 가지 상황 모두 임베딩 API 지연 시간을 프로덕션 RAG 시스템에서 협상할 수 없는 성능 지표로 만듭니다.</p>
<h2 id="Measuring-Real-World-Embedding-API-Latency-with-Milvus" class="common-anchor-header">Milvus로 실제 임베딩 API 지연 시간 측정하기<button data-href="#Measuring-Real-World-Embedding-API-Latency-with-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus는 새로운 <code translate="no">TextEmbedding</code> 함수 인터페이스를 제공하는 오픈 소스 고성능 벡터 데이터베이스입니다. 이 기능은 OpenAI, Cohere, AWS Bedrock, Google Vertex AI, Voyage AI 및 더 많은 제공업체의 인기 있는 임베딩 모델을 데이터 파이프라인에 직접 통합하여 한 번의 호출로 벡터 검색 파이프라인을 간소화합니다.</p>
<p>이 새로운 기능 인터페이스를 사용해, 실제 배포 시나리오에서의 엔드투엔드 지연 시간을 측정하면서 OpenAI, Cohere와 같이 잘 알려진 제공업체의 인기 임베딩 API는 물론, AliCloud, SiliconFlow와 같은 다른 제공업체의 API를 테스트하고 벤치마킹했습니다.</p>
<p>포괄적인 테스트 스위트는 다양한 모델 구성을 다루었습니다:</p>
<table>
<thead>
<tr><th><strong>제공자</strong></th><th><strong>모델</strong></th><th><strong>차원</strong></th></tr>
</thead>
<tbody>
<tr><td>OpenAI</td><td>텍스트 임베딩-ADA-002</td><td>1536</td></tr>
<tr><td>OpenAI</td><td>텍스트 임베딩-3-소형</td><td>1536</td></tr>
<tr><td>OpenAI</td><td>텍스트 임베딩-3-대형</td><td>3072</td></tr>
<tr><td>AWS Bedrock</td><td>amazon.titan-embed-text-v2:0</td><td>1024</td></tr>
<tr><td>구글 버텍스 AI</td><td>text-embedding-005</td><td>768</td></tr>
<tr><td>구글 버텍스 AI</td><td>텍스트-다국어-임베딩-002</td><td>768</td></tr>
<tr><td>VoyageAI</td><td>voyage-3-large</td><td>1024</td></tr>
<tr><td>VoyageAI</td><td>voyage-3</td><td>1024</td></tr>
<tr><td>VoyageAI</td><td>voyage-3-lite</td><td>512</td></tr>
<tr><td>VoyageAI</td><td>voyage-code-3</td><td>1024</td></tr>
<tr><td>Cohere</td><td>embed-english-v3.0</td><td>1024</td></tr>
<tr><td>Cohere</td><td>embed-multilingual-v3.0</td><td>1024</td></tr>
<tr><td>Cohere</td><td>embed-english-light-v3.0</td><td>384</td></tr>
<tr><td>Cohere</td><td>embed-multilingual-light-v3.0</td><td>384</td></tr>
<tr><td>알리윤 대시보드</td><td>텍스트 임베딩-v1</td><td>1536</td></tr>
<tr><td>알리윤 대시스코프</td><td>text-embedding-v2</td><td>1536</td></tr>
<tr><td>알리윤 대시스코프</td><td>text-embedding-v3</td><td>1024</td></tr>
<tr><td>Siliconflow</td><td>BAAI/bge-large-zh-v1.5</td><td>1024</td></tr>
<tr><td>Siliconflow</td><td>BAAI/bge-large-en-v1.5</td><td>1024</td></tr>
<tr><td>Siliconflow</td><td>NETEASE-YOUDAO/BCE-임베딩-베이스-V1</td><td>768</td></tr>
<tr><td>Siliconflow</td><td>BAAI/bge-m3</td><td>1024</td></tr>
<tr><td>Siliconflow</td><td>Pro/BAAI/bge-m3</td><td>1024</td></tr>
<tr><td>TEI</td><td>BAAI/bge-base-en-v1.5</td><td>768</td></tr>
</tbody>
</table>
<h2 id="7-Key-Findings-from-Our-Benchmarking-Results" class="common-anchor-header">벤치마킹 결과의 7가지 주요 결과<button data-href="#7-Key-Findings-from-Our-Benchmarking-Results" class="anchor-icon" translate="no">
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
    </button></h2><p>다양한 배치 크기, 토큰 길이, 네트워크 조건에서 주요 임베딩 모델을 테스트하여 모든 시나리오에서 평균 지연 시간을 측정했습니다. 그 결과 임베딩 API를 선택하고 최적화하는 방법을 바꿀 수 있는 주요 인사이트를 발견했습니다. 지금부터 살펴보겠습니다.</p>
<h3 id="1-Global-Network-Effects-Are-More-Significant-Than-You-Think" class="common-anchor-header">1. 글로벌 네트워크 효과는 생각보다 심각합니다.</h3><p>네트워크 환경은 임베딩 API 성능에 영향을 미치는 가장 중요한 요소일 것입니다. 동일한 임베딩 API 서비스 제공업체라도 네트워크 환경에 따라 성능이 크게 달라질 수 있습니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/latency_in_Asia_vs_in_US_cb4b5a425a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>아시아에 배포된 애플리케이션이 북미에 배포된 OpenAI, Cohere 또는 VoyageAI와 같은 서비스에 액세스하는 경우 네트워크 지연 시간이 크게 증가합니다. 실제 테스트 결과 API 호출 지연 시간은 일반적으로 <strong>3~4배까지</strong> 증가했습니다!</p>
<p>반대로 북미에 배포된 애플리케이션이 AliCloud Dashscope 또는 SiliconFlow와 같은 아시아 서비스에 액세스하는 경우 성능 저하가 훨씬 더 심각합니다. 특히 SiliconFlow는 지역 간 시나리오에서 지연 시간이 <strong>거의 100배 가까이</strong> 증가하는 것으로 나타났습니다!</p>
<p>즉, 항상 배포 위치와 사용자 지역을 기준으로 임베딩 제공업체를 선택해야 하며, 네트워크 컨텍스트가 없는 성능 주장은 무의미합니다.</p>
<h3 id="2-Model-Performance-Rankings-Reveal-Surprising-Results" class="common-anchor-header">2. 모델 성능 순위를 통해 밝혀진 놀라운 결과</h3><p>종합적인 지연 시간 테스트를 통해 명확한 성능 계층 구조가 드러났습니다:</p>
<ul>
<li><p><strong>북미 기반 모델(평균 지연 시간)</strong>: 코히어 &gt; 구글 버텍스 AI &gt; VoyageAI &gt; OpenAI &gt; AWS 베드락 순으로 나타났습니다.</p></li>
<li><p><strong>아시아 기반 모델(평균 지연 시간)</strong>: 실리콘플로우 &gt; 알리클라우드 대시스코프</p></li>
</ul>
<p>이 순위는 제공업체 선택에 대한 기존의 통념에 도전합니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/median_latency_with_batch_size_1_ef83bec9c8.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/median_latency_with_batch_size_10_0d4e52566f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/all_model_latency_vs_token_length_when_batch_size_is_10_537516cc1c.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/all_model_latency_vstoken_lengthwhen_batch_size_is_10_4dcf0d549a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>참고: 네트워크 환경과 서버 지리적 위치가 실시간 임베딩 API 지연 시간에 미치는 영향이 크기 때문에 북미와 아시아 기반 모델 지연 시간을 별도로 비교했습니다.</p>
<h3 id="3-Model-Size-Impact-Varies-Dramatically-by-Provider" class="common-anchor-header">3. 제공업체에 따라 크게 달라지는 모델 크기 영향</h3><p>일반적으로 대형 모델이 표준 모델보다 지연 시간이 길고, 표준 모델이 소형/라이트 모델보다 지연 시간이 긴 경향이 관찰되었습니다. 그러나 이 패턴은 보편적인 것이 아니며 백엔드 아키텍처에 대한 중요한 인사이트를 드러냈습니다. 예를 들어</p>
<ul>
<li><p><strong>Cohere와 OpenAI는</strong> 모델 크기 간에 최소한의 성능 격차를 보였습니다.</p></li>
<li><p><strong>VoyageAI는</strong> 모델 크기에 따라 뚜렷한 성능 차이를 보였습니다.</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Model_Size_Impact_Varies_Dramatically_by_Provider_1_f9eaf2be26.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Model_Size_Impact_Varies_Dramatically_by_Provider_2_cf4d72d1ad.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Model_Size_Impact_Varies_Dramatically_by_Provider_3_5e0c8d890b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>이는 API 응답 시간이 모델 아키텍처 외에도 백엔드 배치 전략, 요청 처리 최적화, 제공업체별 인프라 등 다양한 요인에 따라 달라진다는 것을 나타냅니다. 교훈은 분명합니다. <em>모델 크기나 릴리스 날짜를 신뢰할 수 있는 성능 지표로 믿지 말고 항상 자체 배포 환경에서 테스트해야</em> 한다는 것입니다 <em>.</em></p>
<h3 id="4-Token-Length-and-Batch-Size-Create-Complex-Trade-offs" class="common-anchor-header">4. 토큰 길이와 배치 크기로 인한 복잡한 트레이드 오프</h3><p>백엔드 구현, 특히 배치 전략에 따라 다릅니다. 토큰 길이는 배치 크기가 커질 때까지 지연 시간에 거의 영향을 미치지 않을 수 있습니다. 테스트 결과 몇 가지 명확한 패턴이 나타났습니다:</p>
<ul>
<li><p><strong>OpenAI의 지연 시간은</strong> 소규모 배치와 대규모 배치 간에 상당히 일관되게 유지되어 백엔드 배치 기능이 넉넉하다는 것을 시사했습니다.</p></li>
<li><p><strong>VoyageAI는</strong> 명확한 토큰 길이 효과를 보여 최소한의 백엔드 배치 최적화를 시사했습니다.</p></li>
</ul>
<p>배치 크기가 클수록 절대 지연 시간은 증가하지만 전반적인 처리량은 향상됩니다. 테스트 결과, 배치=1에서 배치=10으로 변경하면 지연 시간이 2배에서 5배까지 증가하는 동시에 총 처리량이 크게 증가했습니다. 이는 개별 요청 지연 시간을 대폭 개선하는 대신 전체 시스템 처리량을 크게 향상시킬 수 있는 대량 처리 워크플로우의 중요한 최적화 기회입니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Going_from_batch_1_to_10_latency_increased_2_5_9811536a3c.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>배치 = 1에서 10으로 이동하면 지연 시간이 2~5배 증가합니다.</p>
<h3 id="5-API-Reliability-Introduces-Production-Risk" class="common-anchor-header">5. API 안정성으로 인한 프로덕션 리스크</h3><p>특히 OpenAI와 VoyageAI의 경우 지연 시간에서 상당한 변동성이 관찰되어 프로덕션 시스템에 예측 불가능성을 초래하는 것으로 나타났습니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Latency_variance_when_batch_1_d9cd88fb73.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>배치=1일 때의 지연 시간 분산</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Latency_variance_when_batch_10_5efc33bf4e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>배치=10일 때의 지연 시간 편차</p>
<p>테스트는 주로 지연 시간에 초점을 맞추었지만, 외부 API에 의존하면 네트워크 변동, 제공업체 속도 제한, 서비스 중단 등 내재적인 장애 위험이 발생합니다. 공급업체의 명확한 SLA가 없는 경우 개발자는 재시도, 시간 초과, 회로 차단기 등 강력한 오류 처리 전략을 구현하여 프로덕션 환경에서 시스템 안정성을 유지해야 합니다.</p>
<h3 id="6-Local-Inference-Can-Be-Surprisingly-Competitive" class="common-anchor-header">6. 로컬 추론은 의외로 경쟁력이 있을 수 있습니다.</h3><p>또한 테스트 결과, 중간 규모의 임베딩 모델을 로컬에 배포하면 클라우드 API에 필적하는 성능을 제공할 수 있으며, 이는 예산에 민감하거나 지연 시간에 민감한 애플리케이션에 매우 중요한 발견입니다.</p>
<p>예를 들어, TEI(텍스트 임베딩 추론)를 통해 오픈 소스 <code translate="no">bge-base-en-v1.5</code> 를 적당한 4c8g CPU에 배포한 결과, SiliconFlow의 지연 시간 성능과 일치하여 합리적인 가격의 로컬 추론 대안을 제공했습니다. 이 결과는 엔터프라이즈급 GPU 리소스는 부족하지만 고성능 임베딩 기능이 필요한 개인 개발자 및 소규모 팀에게 특히 중요합니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/TEI_Latency_2f09be1ef0.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>TEI 지연 시간</p>
<h3 id="7-Milvus-Overhead-Is-Negligible" class="common-anchor-header">7. 무시할 수 있는 수준의 Milvus 오버헤드</h3><p>Milvus를 사용하여 임베딩 API 지연 시간을 테스트한 결과, Milvus의 텍스트 임베딩 기능으로 인해 발생하는 추가 오버헤드는 미미하며 사실상 무시할 수 있는 수준임을 확인했습니다. 측정 결과, 임베딩 API 호출은 수백 밀리초에서 수초가 걸리는 반면 Milvus 작업은 총 20~40밀리초밖에 추가되지 않아 전체 작업 시간에 5% 미만의 오버헤드를 추가하는 것으로 나타났습니다. 성능 병목 현상은 주로 네트워크 전송과 임베딩 API 서비스 제공업체의 처리 능력에 있으며, Milvus 서버 계층에 있는 것이 아닙니다.</p>
<h2 id="Tips-How-to-Optimize-Your-RAG-Embedding-Performance" class="common-anchor-header">팁: RAG 임베딩 성능을 최적화하는 방법<button data-href="#Tips-How-to-Optimize-Your-RAG-Embedding-Performance" class="anchor-icon" translate="no">
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
    </button></h2><p>벤치마크를 기반으로 RAG 시스템의 임베딩 성능을 최적화하기 위해 다음과 같은 전략을 권장합니다:</p>
<h3 id="1-Always-Localize-Your-Testing" class="common-anchor-header">1. 항상 테스트를 로컬라이즈하세요</h3><p>일반적인 벤치마크 보고서(이 보고서 포함!)를 신뢰하지 마세요. 공개된 벤치마크에만 의존하지 말고 항상 실제 배포 환경 내에서 모델을 테스트해야 합니다. 네트워크 조건, 지리적 근접성 및 인프라 차이는 실제 성능에 큰 영향을 미칠 수 있습니다.</p>
<h3 id="2-Geo-Match-Your-Providers-Strategically" class="common-anchor-header">2. 전략적으로 공급업체를 지역적으로 매칭하기</h3><ul>
<li><p><strong>북미 배포의 경우</strong>: Cohere, VoyageAI, OpenAI/Azure 또는 GCP Vertex AI를 고려하고 항상 자체 성능 검증을 수행하세요.</p></li>
<li><p><strong>아시아 배포의 경우</strong>: 더 나은 지역 성능을 제공하는 AliCloud Dashscope 또는 SiliconFlow와 같은 아시아 모델 제공업체를 진지하게 고려하세요.</p></li>
<li><p><strong>글로벌 사용자를 위한 경우</strong>: 다중 지역 라우팅을 구현하거나 전 세계적으로 분산된 인프라를 갖춘 공급자를 선택하여 지역 간 지연 시간 불이익을 최소화합니다.</p></li>
</ul>
<h3 id="3-Question-Default-Provider-Choices" class="common-anchor-header">3. 기본 제공업체 선택에 대한 질문</h3><p>OpenAI의 임베딩 모델은 매우 인기가 높아 많은 기업과 개발자가 기본 옵션으로 선택합니다. 그러나 테스트 결과, 시장의 인기에도 불구하고 OpenAI의 지연 시간과 안정성은 기껏해야 평균 수준인 것으로 나타났습니다. 자체적인 엄격한 벤치마크를 통해 '최고' 제공업체에 대한 가정에 도전하세요. 인기가 특정 사용 사례에 대한 최적의 성능과 항상 상관관계가 있는 것은 아닙니다.</p>
<h3 id="4-Optimize-Batch-and-Chunk-Configurations" class="common-anchor-header">4. 배치 및 청크 구성 최적화</h3><p>하나의 구성이 모든 모델이나 사용 사례에 적합하지는 않습니다. 최적의 배치 크기와 청크 길이는 백엔드 아키텍처와 배치 전략이 다르기 때문에 제공업체마다 크게 다릅니다. 특정 애플리케이션 요구 사항에 대한 처리량과 지연 시간의 절충점을 고려하여 다양한 구성을 체계적으로 실험하여 최적의 성능 지점을 찾으세요.</p>
<h3 id="5-Implement-Strategic-Caching" class="common-anchor-header">5. 전략적 캐싱 구현</h3><p>빈도가 높은 쿼리의 경우, 쿼리 텍스트와 생성된 임베딩을 모두 캐시합니다(Redis와 같은 솔루션 사용). 이후 동일한 쿼리가 캐시에 직접 도달하여 지연 시간을 밀리초 단위로 줄일 수 있습니다. 이는 가장 비용 효율적이고 영향력 있는 쿼리 지연 시간 최적화 기술 중 하나입니다.</p>
<h3 id="6-Consider-Local-Inference-Deployment" class="common-anchor-header">6. 로컬 추론 배포 고려</h3><p>데이터 수집 지연 시간, 쿼리 지연 시간, 데이터 프라이버시에 대한 요구 사항이 매우 높거나 API 호출 비용이 부담스러운 경우 추론을 위해 로컬에 임베딩 모델을 배포하는 것을 고려하세요. 표준 API 요금제에는 종종 QPS 제한, 불안정한 지연 시간, SLA 보장 부족 등 프로덕션 환경에서는 문제가 될 수 있는 제약 조건이 있습니다.</p>
<p>많은 개인 개발자나 소규모 팀의 경우 엔터프라이즈급 GPU가 부족하다는 점이 고성능 임베딩 모델을 로컬에 배포하는 데 걸림돌이 됩니다. 하지만 그렇다고 해서 로컬 추론을 완전히 포기할 필요는 없습니다. <a href="https://github.com/huggingface/text-embeddings-inference">Hugging Face의 텍스트 임베딩 추론과</a> 같은 고성능 추론 엔진을 사용하면 CPU에서 중소규모 임베딩 모델을 실행하더라도 특히 대규모 오프라인 임베딩 생성의 경우 지연 시간이 긴 API 호출을 능가하는 적절한 성능을 달성할 수 있습니다.</p>
<p>이 접근 방식은 비용, 성능, 유지 관리 복잡성 간의 절충점을 신중하게 고려해야 합니다.</p>
<h2 id="How-Milvus-Simplifies-Your-Embedding-Workflow" class="common-anchor-header">Milvus로 임베딩 워크플로우를 간소화하는 방법<button data-href="#How-Milvus-Simplifies-Your-Embedding-Workflow" class="anchor-icon" translate="no">
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
    </button></h2><p>앞서 언급했듯이 Milvus는 고성능 벡터 데이터베이스일 뿐만 아니라, 전 세계의 OpenAI, Cohere, AWS Bedrock, Google Vertex AI, Voyage AI 등 다양한 제공업체의 인기 임베딩 모델을 벡터 검색 파이프라인에 원활하게 통합하는 편리한 임베딩 기능 인터페이스도 제공합니다.</p>
<p>Milvus는 임베딩 통합을 간소화하는 기능으로 벡터 저장 및 검색을 뛰어넘습니다:</p>
<ul>
<li><p><strong>효율적인 벡터 관리</strong>: 대규모 벡터 컬렉션을 위해 구축된 고성능 데이터베이스인 Milvus는 안정적인 스토리지, 유연한 인덱싱 옵션(HNSW, IVF, RaBitQ, DiskANN 등), 빠르고 정확한 검색 기능을 제공합니다.</p></li>
<li><p><strong>간소화된 공급자 전환</strong>: Milvus는 <code translate="no">TextEmbedding</code> 함수 인터페이스를 제공하여 API 키로 기능을 구성하고, 공급자 또는 모델을 즉시 전환하고, 복잡한 SDK 통합 없이도 실제 성능을 측정할 수 있습니다.</p></li>
<li><p><strong>엔드투엔드 데이터 파이프라인</strong>: 원시 텍스트로 <code translate="no">insert()</code> 을 호출하면 Milvus가 한 번의 작업으로 벡터를 자동으로 임베드하고 저장하여 데이터 파이프라인 코드를 획기적으로 간소화합니다.</p></li>
<li><p><strong>한 번의 호출로 텍스트에서 결과까지</strong>: 텍스트 쿼리로 <code translate="no">search()</code> 을 호출하면 Milvus가 임베딩, 검색, 결과 반환을 모두 단 한 번의 API 호출로 처리합니다.</p></li>
<li><p><strong>제공자에 구애받지 않는 통합</strong>: Milvus는 공급자 구현 세부 사항을 추상화하므로 함수와 API 키를 한 번만 구성하면 바로 사용할 수 있습니다.</p></li>
<li><p><strong>오픈 소스 에코시스템 호환성</strong>: 내장된 <code translate="no">TextEmbedding</code> 함수를 통해 임베딩을 생성하든, 로컬 추론을 사용하든, 다른 방법을 사용하든, Milvus는 통합된 저장 및 검색 기능을 제공합니다.</p></li>
</ul>
<p>이를 통해 Milvus가 내부적으로 벡터 생성을 처리하는 간소화된 "데이터 인, 인사이트 아웃" 환경을 만들어 애플리케이션 코드를 보다 간단하고 유지 관리하기 쉽게 만듭니다.</p>
<h2 id="Conclusion-The-Performance-Truth-Your-RAG-System-Needs" class="common-anchor-header">결론: RAG 시스템에 필요한 성능의 진실<button data-href="#Conclusion-The-Performance-Truth-Your-RAG-System-Needs" class="anchor-icon" translate="no">
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
    </button></h2><p>RAG 성능의 조용한 살인자는 대부분의 개발자가 찾는 곳이 아닙니다. 개발팀은 신속한 엔지니어링과 LLM 최적화에 리소스를 투입하지만, 임베딩 API 지연 시간은 예상보다 100배나 더 나쁜 지연으로 사용자 경험을 조용히 방해합니다. 포괄적인 벤치마크는 인기 있다고 해서 성능이 좋은 것은 아니며, 많은 경우 알고리즘 선택보다 지역이 더 중요하고, 로컬 추론이 때때로 값비싼 클라우드 API보다 낫다는 냉혹한 현실을 드러냅니다.</p>
<p>이러한 결과는 RAG 최적화의 중요한 사각지대를 강조합니다. 지역 간 지연 시간 불이익, 예상치 못한 공급자 성능 순위, 로컬 추론의 놀라운 경쟁력은 엣지 케이스가 아니라 실제 애플리케이션에 영향을 미치는 프로덕션 현실입니다. 반응형 사용자 경험을 제공하기 위해서는 임베딩 API 성능을 이해하고 측정하는 것이 필수적입니다.</p>
<p>임베딩 제공업체 선택은 RAG 성능 퍼즐의 중요한 한 조각입니다. 실제 배포 환경에서 테스트하고, 지리적으로 적합한 제공업체를 선택하고, 로컬 추론과 같은 대안을 고려함으로써 사용자 대면 지연의 주요 원인을 제거하고 진정한 반응형 AI 애플리케이션을 구축할 수 있습니다.</p>
<p>벤치마킹 방법에 대한 자세한 내용은 <a href="https://github.com/zhuwenxing/text-embedding-bench">이 노트북에서</a> 확인하세요.</p>
