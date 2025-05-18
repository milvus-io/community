---
id: >-
  milvus-26-preview-72-memory-reduction-without-compromising-recall-and-4x-faster-than-elasticsearch.md
title: 'Milvus 2.6 프리뷰: 리콜 성능 저하 없이 72% 메모리 감소, Elasticsearch보다 4배 빨라진 속도'
author: Ken Zhang
date: 2025-05-17T00:00:00.000Z
cover: >-
  assets.zilliz.com/Milvus_2_6_Preview_72_Memory_Reduction_Without_Compromising_Recall_and_4x_Faster_Than_Elasticsearch_c607b644f1.png
tag: Engineering
recommend: true
publishToMedium: true
tags: 'Milvus, vector database, vector search, AI Agents, LLM'
meta_keywords: 'Milvus 2.6, vector database, vector search, full text search, AI search'
meta_title: >
  Milvus 2.6 Preview: 72% Memory Reduction Without Compromising Recall and 4x
  Faster Than Elasticsearch
desc: 벡터 데이터베이스의 성능과 효율성을 재정의할 Milvus 2.6의 혁신 기술을 독점적으로 먼저 살펴보세요.
origin: >-
  https://milvus.io/blog/milvus-26-preview-72-memory-reduction-without-compromising-recall-and-4x-faster-than-elasticsearch.md
---
<p>이번 주 내내 Milvus에서는 벡터 데이터베이스 기술의 한계를 뛰어넘는 다양하고 흥미로운 혁신에 대해 공유해 드렸습니다:</p>
<ul>
<li><p><a href="https://milvus.io/blog/how-to-filter-efficiently-without-killing-recall.md">실제 환경에서의 벡터 검색: 리콜을 죽이지 않고 효율적으로 필터링하는 방법 </a></p></li>
<li><p><a href="https://milvus.io/blog/bring-vector-compression-to-the-extreme-how-milvus-serves-3%C3%97-more-queries-with-rabitq.md">벡터 압축을 극한으로 끌어올리기: Milvus가 RaBitQ로 3배 더 많은 쿼리를 처리하는 방법</a></p></li>
<li><p><a href="https://milvus.io/blog/benchmarks-lie-vector-dbs-deserve-a-real-test.md">벤치마크는 거짓말 - 벡터 DB는 실제 테스트가 필요합니다. </a></p></li>
<li><p><a href="https://milvus.io/blog/we-replaced-kafka-pulsar-with-a-woodpecker-for-milvus.md">Milvus를 위해 Kafka/Pulsar를 딱따구리로 대체했습니다. </a></p></li>
<li><p><a href="https://milvus.io/blog/minhash-lsh-in-milvus-the-secret-weapon-for-fighting-duplicates-in-llm-training-data.md">Milvus의 MinHash LSH: LLM 훈련 데이터의 중복을 방지하는 비밀 무기 </a></p></li>
</ul>
<p>밀버스 위크 시리즈를 마무리하면서, 현재 개발 중인 2025년 제품 로드맵의 중요한 이정표인 Milvus 2.6의 새로운 기능과 이러한 개선 사항이 AI 기반 검색을 어떻게 변화시킬지 살짝 엿볼 수 있게 되어 기쁘게 생각합니다. 곧 출시될 이 릴리스에는 <strong>비용 효율성 최적화</strong>, <strong>고급 검색 기능</strong>, 100억 개의 벡터 규모를 넘어서는 벡터 검색을 지원하는 <strong>새로운 아키텍처</strong> 등 세 가지 중요한 측면에서 이러한 모든 혁신과 그 이상의 기능이 통합되어 있습니다.</p>
<p>올 6월에 출시될 Milvus 2.6의 주요 개선 사항 중 가장 즉각적으로 영향을 미칠 수 있는 메모리 사용량과 비용의 획기적인 감소, 초고속 성능부터 자세히 살펴보겠습니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Milvus_2_6_Preview_72_Memory_Reduction_Without_Compromising_Recall_and_4x_Faster_Than_Elasticsearch_c607b644f1.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Cost-Reduction-Slash-Memory-Usage-While-Boosting-Performance" class="common-anchor-header">비용 절감: 메모리 사용량은 줄이면서 성능은 향상<button data-href="#Cost-Reduction-Slash-Memory-Usage-While-Boosting-Performance" class="anchor-icon" translate="no">
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
    </button></h2><p>값비싼 메모리에 의존하는 것은 벡터 검색을 수십억 개의 레코드로 확장하는 데 있어 가장 큰 장애물 중 하나입니다. Milvus 2.6은 성능을 향상시키면서 인프라 비용을 획기적으로 낮추는 몇 가지 주요 최적화 기능을 도입합니다.</p>
<h3 id="RaBitQ-1-bit-Quantization-72-Memory-Reduction-with-4×-QPS-and-No-Recall-Loss" class="common-anchor-header">RaBitQ 1비트 양자화: 4배의 QPS로 72% 메모리 절감 및 리콜 손실 없음</h3><p>메모리 소비는 오랫동안 대규모 벡터 데이터베이스의 아킬레스건이었습니다. 벡터 양자화가 새로운 것은 아니지만, 대부분의 기존 접근 방식은 메모리 절약을 위해 검색 품질을 너무 많이 희생합니다. Milvus 2.6은 프로덕션 환경에<a href="https://milvus.io/blog/bring-vector-compression-to-the-extreme-how-milvus-serves-3%C3%97-more-queries-with-rabitq.md"> RaBitQ 1비트 양자화를</a> 도입함으로써 이 문제를 정면으로 해결합니다.</p>
<p>이 구현을 특별하게 만드는 것은 조정 가능한 정제 최적화 기능입니다. 기본 인덱스에 RaBitQ 양자화와 SQ4/SQ6/SQ8 리파인 옵션을 더해 구현함으로써 메모리 사용량과 검색 품질(~95% 리콜) 간에 최적의 균형을 이룰 수 있게 되었습니다.</p>
<p>예비 벤치마크를 통해 유망한 결과를 확인할 수 있습니다:</p>
<table>
<thead>
<tr><th><strong>성능</strong> <strong>메트릭</strong></th><th><strong>기존 IVF_FLAT</strong></th><th><strong>RaBitQ(1비트) 전용</strong></th><th><strong>RaBitQ(1비트) + SQ8 정제</strong></th></tr>
</thead>
<tbody>
<tr><td>메모리 풋프린트</td><td>100%(기준)</td><td>3%(97% 감소)</td><td>28%(72% 감소)</td></tr>
<tr><td>리콜 품질</td><td>95.2%</td><td>76.3%</td><td>94.9%</td></tr>
<tr><td>쿼리 처리량(QPS)</td><td>236</td><td>648(2.7배 빨라짐)</td><td>946(4배 빨라짐)</td></tr>
</tbody>
</table>
<p><em>표: 768차원의 1M 벡터를 사용한 VectorDBBench 평가(AWS m6id.2xlarge에서 테스트)</em></p>
<p>여기서 진정한 혁신은 단순한 메모리 감소가 아니라 정확도 저하 없이 처리량을 4배 개선하는 동시에 이를 달성한 것입니다. 즉, 기존 인프라에서 75% 더 적은 수의 서버로 동일한 워크로드를 처리하거나 4배 더 많은 트래픽을 처리할 수 있습니다.</p>
<p><a href="https://zilliz.com/cloud"> Zilliz Cloud에서</a> 완전 관리형 Milvus를 사용하는 기업 사용자를 위해 특정 워크로드 특성 및 정밀도 요구 사항에 따라 RaBitQ 매개변수를 동적으로 조정하는 자동화된 구성 프로필을 개발 중입니다.</p>
<h3 id="400-Faster-Full-text-Search-Than-Elasticsearch" class="common-anchor-header">Elasticsearch보다 400% 더 빠른 전체 텍스트 검색</h3><p>벡터 데이터베이스의<a href="https://milvus.io/blog/full-text-search-in-milvus-what-is-under-the-hood.md">전체 텍스트 검색</a> 기능은 하이브리드 검색 시스템을 구축하는 데 필수적인 요소가 되었습니다. <a href="https://milvus.io/blog/introduce-milvus-2-5-full-text-search-powerful-metadata-filtering-and-more.md">Milvus 2.5에</a> BM25를 도입한 이후, 우리는 열렬한 피드백과 함께 더 나은 대규모 성능에 대한 요청을 받았습니다.</p>
<p>Milvus 2.6은 BM25에서 상당한 성능 향상을 제공할 것입니다. BEIR 데이터 세트에 대한 테스트 결과, 동일한 리콜률로 Elasticsearch보다 3~4배 더 높은 처리량을 보였습니다. 일부 워크로드의 경우, 최대 7배 더 높은 QPS까지 개선되었습니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_Milvus_vs_Elasticsearch_on_throughput_140b7c1b06.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>그림: 처리량에 대한 Milvus와 Elasticsearch 비교</p>
<h3 id="JSON-Path-Index-99-Lower-Latency-for-Complex-Filtering" class="common-anchor-header">JSON 경로 인덱스: 복잡한 필터링의 지연 시간 99% 감소</h3><p>최신 AI 애플리케이션은 벡터 유사성에만 의존하는 경우는 거의 없으며, 거의 항상 벡터 검색과 메타데이터 필터링을 결합합니다. 이러한 필터링 조건이 더 복잡해지면(특히 중첩된 JSON 객체의 경우) 쿼리 성능이 급격히 저하될 수 있습니다.</p>
<p>Milvus 2.6에서는 중첩된 JSON 경로에 대한 표적 인덱싱 메커니즘이 도입되어 JSON 필드 내의 특정 경로(예: <code translate="no">$meta user_info.location</code>)에 인덱스를 생성할 수 있습니다. 전체 개체를 스캔하는 대신 Milvus는 미리 구축된 인덱스에서 직접 값을 조회합니다.</p>
<p>100M 이상의 레코드로 평가한 결과, JSON 경로 인덱스는 필터 지연 시간을 <strong>140ms</strong> (P99: 480ms)에서 단 <strong>1.5ms</strong> (P99: 10ms)로 99% 단축하여 이전에는 비현실적인 쿼리를 즉각적인 응답으로 전환할 수 있게 해줍니다.</p>
<p>이 기능은 특히 다음과 같은 경우에 유용합니다:</p>
<ul>
<li><p>복잡한 사용자 속성 필터링이 있는 추천 시스템</p></li>
<li><p>다양한 레이블로 문서를 필터링하는 RAG 애플리케이션</p></li>
</ul>
<h2 id="Next-Generation-Search-From-Basic-Vector-Similarity-to-Production-Grade-Retrieval" class="common-anchor-header">차세대 검색: 기본 벡터 유사성에서 프로덕션급 검색까지<button data-href="#Next-Generation-Search-From-Basic-Vector-Similarity-to-Production-Grade-Retrieval" class="anchor-icon" translate="no">
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
    </button></h2><p>최신 AI 애플리케이션에는 벡터 검색만으로는 충분하지 않습니다. 사용자들은 벡터 임베딩의 의미론적 이해와 함께 전통적인 정보 검색의 정밀도를 요구합니다. Milvus 2.6은 이러한 격차를 해소하는 몇 가지 고급 검색 기능을 도입할 예정입니다.</p>
<h3 id="Better-Full-text-Search-with-Multi-language-Analyzer" class="common-anchor-header">다국어 분석기를 통한 더 나은 전체 텍스트 검색</h3><p>전체 텍스트 검색은 언어에 따라 크게 달라집니다... Milvus 2.6에서는 다국어 지원으로 완전히 개선된 텍스트 분석 파이프라인이 도입될 예정입니다:</p>
<ul>
<li><p><code translate="no">RUN_ANALYZER</code> 분석기/토큰화 구성 관찰성을 위한 구문 지원</p></li>
<li><p>일본어, 한국어와 같은 아시아 언어를 위한 린데라 토큰화기</p></li>
<li><p>포괄적인 다국어 지원을 위한 ICU 토큰화 도구</p></li>
<li><p>언어별 토큰화 규칙을 정의하기 위한 세분화된 언어 구성</p></li>
<li><p>사용자 지정 사전 통합을 지원하는 향상된 Jieba</p></li>
<li><p>더욱 정밀한 텍스트 처리를 위한 확장된 필터 옵션</p></li>
</ul>
<p>글로벌 애플리케이션의 경우, 이는 언어별 전문 인덱싱이나 복잡한 해결 방법 없이도 더 나은 다국어 검색이 가능하다는 것을 의미합니다.</p>
<h3 id="Phrase-Match-Capturing-Semantic-Nuance-in-Word-Order" class="common-anchor-header">구문 일치: 어순에서 의미적 뉘앙스 포착하기</h3><p>어순은 키워드 검색이 종종 놓치는 중요한 의미 구분을 전달합니다. '머신 러닝 기술'과 '학습 기계 기술'을 비교해 보세요. 같은 단어지만 완전히 다른 의미입니다.</p>
<p>Milvus 2.6에는 <strong>구문</strong> 검색이 추가되어 사용자가 전체 텍스트 검색이나 정확한 문자열 검색보다 어순과 근접성을 더 세밀하게 제어할 수 있게 됩니다:</p>
<pre><code translate="no">PHRASE_MATCH(field_name, phrase, slop)
<button class="copy-code-btn"></button></code></pre>
<p><code translate="no">slop</code> 매개변수를 통해 단어 근접성을 유연하게 제어할 수 있습니다. 0으로 설정하면 정확히 연속적으로 일치해야 하고, 값이 높으면 구문에 약간의 변형이 허용됩니다.</p>
<p>이 기능은 특히 다음과 같은 경우에 유용합니다:</p>
<ul>
<li><p>정확한 문구가 법적 의미를 갖는 법률 문서 검색</p></li>
<li><p>용어 순서가 서로 다른 개념을 구분하는 기술 콘텐츠 검색</p></li>
<li><p>특정 기술 문구를 정확하게 일치시켜야 하는 특허 데이터베이스</p></li>
</ul>
<h3 id="Time-Aware-Decay-Functions-Automatically-Prioritize-Fresh-Content" class="common-anchor-header">시간 인식 부패 기능: 새로운 콘텐츠의 자동 우선순위 지정</h3><p>정보의 가치는 시간이 지남에 따라 감소하는 경우가 많습니다. 뉴스 기사, 제품 릴리스, 소셜 게시물 모두 시간이 지날수록 관련성이 떨어지지만, 기존의 검색 알고리즘은 타임스탬프에 관계없이 모든 콘텐츠를 동일하게 취급합니다.</p>
<p>Milvus 2.6에서는 문서 연한에 따라 관련성 점수를 자동으로 조정하는 시간 인식 랭킹을 위한 감쇠 <strong>함수를</strong> 도입할 예정입니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/decay_function_210e65f9a0.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>설정할 수 있습니다:</p>
<ul>
<li><p><strong>함수 유형</strong>: 지수(급격한 감쇠), 가우스(점진적 감쇠) 또는 선형(일정한 감쇠)</p></li>
<li><p><strong>감쇠율</strong>: 시간이 지남에 따라 관련성이 얼마나 빨리 감소하는가</p></li>
<li><p><strong>원점</strong>: 시차를 측정하기 위한 기준 타임스탬프입니다.</p></li>
</ul>
<p>이렇게 시간에 따라 순위를 재조정하면 가장 최신의 맥락 관련성이 높은 결과가 먼저 표시되므로 뉴스 추천 시스템, 전자상거래 플랫폼 및 소셜 미디어 피드에 매우 중요합니다.</p>
<h3 id="Data-in-Data-Out-From-Raw-Text-to-Vector-Search-in-One-Step" class="common-anchor-header">데이터 입력, 데이터 출력: 원시 텍스트에서 벡터 검색으로 한 번에 전환하기</h3><p>벡터 데이터베이스의 가장 큰 개발자의 고충 중 하나는 원시 데이터와 벡터 임베딩 사이의 단절이었습니다. Milvus 2.6은 타사 임베딩 모델을 데이터 파이프라인에 직접 통합하는 새로운 <strong>함수</strong> 인터페이스를 통해 이 워크플로우를 획기적으로 간소화합니다. 이를 통해 한 번의 호출로 벡터 검색 파이프라인을 간소화할 수 있습니다.</p>
<p>임베딩을 미리 계산하는 대신 다음과 같은 작업을 수행할 수 있습니다:</p>
<ol>
<li><p><strong>원시 데이터를 직접 삽입합니다</strong>: 텍스트, 이미지 또는 기타 콘텐츠를 Milvus에 제출합니다.</p></li>
<li><p><strong>벡터화를 위해 임베딩 공급자를 구성합니다</strong>: Milvus는 OpenAI, AWS Bedrock, Google Vertex AI, Hugging Face와 같은 임베딩 모델 서비스에 연결할 수 있습니다.</p></li>
<li><p><strong>자연어를 사용한 쿼리</strong>: 벡터 임베딩이 아닌 텍스트 쿼리를 사용한 검색</p></li>
</ol>
<p>이렇게 하면 Milvus가 내부적으로 벡터 생성을 처리하는 간소화된 "데이터 인, 데이터 아웃" 환경을 만들어 애플리케이션 코드를 더욱 간단하게 만들 수 있습니다.</p>
<h2 id="Architectural-Evolution-Scaling-to-Hundreds-of-Billions-of-Vectors" class="common-anchor-header">아키텍처의 진화: 수 천억 개의 벡터로 확장하기<button data-href="#Architectural-Evolution-Scaling-to-Hundreds-of-Billions-of-Vectors" class="anchor-icon" translate="no">
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
    </button></h2><p>좋은 데이터베이스는 단순히 뛰어난 기능만 갖춘 것이 아니라, 프로덕션 환경에서 테스트를 거쳐 대규모로 이러한 기능을 제공할 수 있어야 합니다.</p>
<p>Milvus 2.6은 수천억 개의 벡터로 비용 효율적으로 확장할 수 있는 근본적인 아키텍처 변경을 도입합니다. 가장 큰 특징은 액세스 패턴을 기반으로 데이터 배치를 지능적으로 관리하는 새로운 핫-콜드 계층형 스토리지 아키텍처로, 핫 데이터를 고성능 메모리/SSD로 자동 이동하고 콜드 데이터는 보다 경제적인 오브젝트 스토리지에 배치합니다. 이 접근 방식은 가장 중요한 쿼리 성능을 유지하면서 비용을 획기적으로 절감할 수 있습니다.</p>
<p>또한, 새로운 <a href="https://milvus.io/blog/we-replaced-kafka-pulsar-with-a-woodpecker-for-milvus.md#StreamingService-Built-for-Real-Time-Data-Flow">스트리밍 노드는</a> Kafka, Pulsar와 같은 스트리밍 플랫폼과 새로 만들어진 <a href="https://milvus.io/blog/we-replaced-kafka-pulsar-with-a-woodpecker-for-milvus.md">Woodpecker에</a> 직접 통합되어 실시간 벡터 처리를 가능하게 함으로써 배치 지연 없이 새로운 데이터를 즉시 검색할 수 있게 해줍니다.</p>
<h2 id="Stay-tuned-for-Milvus-26" class="common-anchor-header">Milvus 2.6을 기대해주세요.<button data-href="#Stay-tuned-for-Milvus-26" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.6은 현재 활발히 개발 중이며, 올 6월에 출시될 예정입니다. 획기적인 성능 최적화, 고급 검색 기능, 새로운 아키텍처를 통해 보다 저렴한 비용으로 확장 가능한 AI 애플리케이션을 구축할 수 있게 되어 기대가 큽니다.</p>
<p>그동안 곧 출시될 기능에 대한 여러분의 피드백을 환영합니다. 가장 기대되는 기능은 무엇인가요? 어떤 기능이 여러분의 애플리케이션에 가장 큰 영향을 미칠까요?<a href="https://discord.com/invite/8uyFbECzPX"> Discord 채널에서</a> 대화에 참여하거나<a href="https://github.com/milvus-io/milvus"> GitHub에서</a> 진행 상황을 팔로우하세요.</p>
<p>Milvus 2.6이 언제 출시되는지 가장 먼저 알고 싶으신가요?<a href="https://www.linkedin.com/company/zilliz/"> LinkedIn</a> 또는<a href="https://twitter.com/milvusio"> X에서</a> 팔로우하여 최신 업데이트를 받아보세요.</p>
