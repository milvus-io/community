---
id: >-
  bring-vector-compression-to-the-extreme-how-milvus-serves-3×-more-queries-with-rabitq.md
title: '벡터 압축을 극한으로 끌어올리기: Milvus가 RaBitQ로 3배 더 많은 쿼리를 처리하는 방법'
author: 'Alexandr Guzhva, Li Liu, Jiang Chen'
date: 2025-05-13T00:00:00.000Z
desc: >-
  Milvus가 RaBitQ를 활용하여 벡터 검색 효율성을 높이고 메모리 비용을 줄이면서 정확도를 유지하는 방법을 알아보세요. 지금 바로 AI
  솔루션을 최적화하는 방법을 알아보세요!
cover: >-
  assets.zilliz.com/Bring_Vector_Compression_to_the_Extreme_How_Milvus_Serves_3_More_Queries_with_Ra_Bit_Q_12f5b4d932.jpg
tag: Engineering
recommend: true
publishToMedium: true
tags: 'Milvus, vector database, vector search, AI Agents, LLM'
meta_keywords: >-
  Vector Quantization, binary quantization, RaBitQ, vector compression, Milvus
  vector database
meta_title: >
  Bring Vector Compression to the Extreme: How Milvus Serves 3× More Queries
  with RaBitQ
origin: >-
  https://milvus.io/blog/bring-vector-compression-to-the-extreme-how-milvus-serves-3×-more-queries-with-rabitq.md
---
<p><a href="https://milvus.io/docs/overview.md">Milvus는</a> 확장성이 뛰어난 오픈 소스 벡터 데이터베이스로, 10억 개의 벡터 규모로 시맨틱 검색을 지원합니다. 사용자가 이 정도의 규모로 RAG 챗봇, AI 고객 서비스, 시각적 검색을 배포할 때, <strong>인프라 비용이라는</strong> 공통적인 문제가 발생합니다. 기하급수적인 비즈니스 성장은 고무적이지만, 치솟는 클라우드 비용은 그렇지 않습니다. 빠른 벡터 검색을 위해서는 일반적으로 벡터를 메모리에 저장해야 하는데, 이는 비용이 많이 듭니다. 당연히 <em>검색 품질 저하 없이 벡터를 압축하여 공간을 절약할 수 없을까요?</em></p>
<p>이 블로그에서는 <a href="https://dl.acm.org/doi/pdf/10.1145/3654970"><strong>RaBitQ라는</strong></a> 새로운 기술을 구현하여 Milvus가 어떻게 비슷한 정확도를 유지하면서 더 낮은 메모리 비용으로 3배 더 많은 트래픽을 처리할 수 있는지 보여드리겠습니다. 또한 RaBitQ를 오픈 소스 Milvus에 통합하여 얻은 실질적인 교훈과 <a href="https://zilliz.com/cloud">질리즈 클라우드의</a> 완전 관리형 Milvus 서비스도 공유할 것입니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Bring_Vector_Compression_to_the_Extreme_How_Milvus_Serves_3_More_Queries_with_Ra_Bit_Q_12f5b4d932.jpg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Understanding-Vector-Search-and-Compression" class="common-anchor-header">벡터 검색 및 압축에 대한 이해<button data-href="#Understanding-Vector-Search-and-Compression" class="anchor-icon" translate="no">
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
    </button></h2><p>RaBitQ에 대해 자세히 알아보기 전에 먼저 과제를 이해해 보겠습니다.</p>
<p><a href="https://zilliz.com/glossary/anns"><strong>ANN(근사 최인접 이웃)</strong></a> 검색 알고리즘은 벡터 데이터베이스의 핵심으로, 주어진 쿼리에 가장 가까운 상위 k개의 벡터를 찾습니다. 벡터는 고차원 공간의 좌표로, 종종 수백 개의 부동 소수점 숫자로 구성됩니다. 벡터 데이터가 확장됨에 따라 스토리지 및 컴퓨팅 수요도 증가합니다. 예를 들어, 10억 개의 768차원 벡터로 <a href="https://zilliz.com/learn/hierarchical-navigable-small-worlds-HNSW">HNSW</a> (ANN 검색 알고리즘)를 FP32에서 실행하려면 3TB 이상의 메모리가 필요합니다!</p>
<p>MP3가 사람의 귀에 들리지 않는 주파수를 버려 오디오를 압축하는 것처럼, 벡터 데이터도 검색 정확도에 미치는 영향을 최소화하면서 압축할 수 있습니다. 연구 결과에 따르면 ANN에는 고정밀 FP32가 불필요한 경우가 많습니다. 널리 사용되는 압축 기법인<a href="https://zilliz.com/learn/scalar-quantization-and-product-quantization"> 스칼라 양자화</a> (SQ)는 부동 소수점 값을 이산 구간차원으로 매핑하고 저비트 정수를 사용해 구간차원 인덱스만 저장합니다. 양자화 방법은 동일한 정보를 더 적은 비트로 표현함으로써 메모리 사용량을 크게 줄여줍니다. 이 분야의 연구는 정확도 손실을 최소화하면서 최대한의 절약을 달성하기 위해 노력하고 있습니다.</p>
<p>가장 극단적인 압축 기법인 1비트 스칼라 양자화( <a href="https://zilliz.com/learn/scalar-quantization-and-product-quantization">이진 양자</a>화라고도 함)는 각 부동소수를 단일 비트로 <a href="https://zilliz.com/learn/scalar-quantization-and-product-quantization">표현합니다</a>. FP32(32비트 인코딩)와 비교하면 메모리 사용량이 32배나 줄어듭니다. 메모리는 종종 벡터 검색의 주요 병목 현상이므로 이러한 압축은 성능을 크게 향상시킬 수 있습니다. <strong>하지만 검색 정확도를 유지해야 한다는 과제가 있습니다.</strong> 일반적으로 1비트 SQ는 리콜률을 70% 이하로 낮추기 때문에 사실상 사용할 수 없게 됩니다.</p>
<p>바로 이 점에서 1비트 양자화를 달성하면서도 높은 정확도를 유지하는 탁월한 압축 기술인 <strong>RaBitQ가</strong> 돋보입니다. Milvus는 이제 버전 2.6부터 RaBitQ를 지원하여 벡터 데이터베이스가 비슷한 수준의 정확도를 유지하면서 3배의 QPS를 제공할 수 있게 되었습니다.</p>
<h2 id="A-Brief-Intro-to-RaBitQ" class="common-anchor-header">RaBitQ에 대한 간략한 소개<button data-href="#A-Brief-Intro-to-RaBitQ" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://dl.acm.org/doi/pdf/10.1145/3654970">RaBitQ는</a> 고차원 공간의 기하학적 특성을 활용하여 효율적이고 정확한 벡터 압축을 달성하기 위해 스마트하게 설계된 이진 양자화 방법입니다.</p>
<p>언뜻 보기에 벡터의 각 차원을 단일 비트로 줄이는 것은 너무 공격적으로 보일 수 있지만, 고차원 공간에서는 우리의 직관이 실패하는 경우가 많습니다. RaBitQ의 저자 지안양 가오가<a href="https://dev.to/gaoj0017/quantization-in-the-counterintuitive-high-dimensional-space-4feg"> 설명한</a> 것처럼, 고차원 벡터는<a href="https://en.wikipedia.org/wiki/Concentration_of_measure"> 측정의 집중에서</a> 설명한 반직관적인 현상의 결과로 개별 좌표가 0을 중심으로 밀집하는 경향이 있는 특성을 보입니다. 따라서 정확한 최접근 이웃 검색에 필요한 상대적 구조를 유지하면서 원래의 정밀도를 상당 부분 버릴 수 있습니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_The_counterintuitive_value_distribution_in_high_dimensional_geometry_fad6143bfd.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>그림: 고차원 기하 도형에서의 반직관적인 값 분포. <em>단위 구에서 균일하게 샘플링된 임의의 단위 벡터의 첫 번째 차원 값을 고려하면 값이 3D 공간에 균일하게 퍼져 있습니다. 그러나 고차원 공간(예: 1000D)의 경우 값이 0 주위에 집중되는데, 이는 고차원 기하학의 직관적이지 않은 특성입니다. (이미지 출처: <a href="https://dev.to/gaoj0017/quantization-in-the-counterintuitive-high-dimensional-space-4feg">반직관적인 고차원 공간에서의 양자화</a>)</em></p>
<p>이러한 고차원 공간의 속성에서 영감을 얻은 <strong>RaBitQ는 정확한 공간 좌표가 아닌 각도 정보를 인코딩하는 데 중점을</strong> 둡니다. 이를 위해 각 데이터 벡터를 데이터 세트의 중심과 같은 기준점을 기준으로 정규화합니다. 그런 다음 각 벡터를 하이퍼큐브에서 가장 가까운 정점에 매핑하여 차원당 단 1비트로 표현할 수 있습니다. 이 접근 방식은 자연스럽게 <code translate="no">IVF_RABITQ</code> 로 확장되어 가장 가까운 클러스터 중심을 기준으로 정규화가 수행되므로 로컬 인코딩 정확도가 향상됩니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_Compressing_a_vector_by_finding_its_closest_approximation_on_the_hypercube_so_that_each_dimension_can_be_represented_with_just_1_bit_cd0d50bb30.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>그림: 하이퍼큐브에서 가장 가까운 근사값을 찾아 벡터를 압축하여 각 차원을 단 1비트로 표현할 수 있습니다. (이미지 출처:</em> <a href="https://dev.to/gaoj0017/quantization-in-the-counterintuitive-high-dimensional-space-4feg"><em>반직관적인 고차원 공간에서의 양자화</em></a><em>)</em></p>
<p>이렇게 압축된 표현을 사용하더라도 검색의 신뢰성을 유지하기 위해 RaBitQ는 쿼리 벡터와 이진 양자화된 문서 벡터 사이의 거리에 대해 <strong>이론적으로 근거가 있는 편향되지 않은 추정기를</strong> 도입합니다. 이를 통해 재구성 오류를 최소화하고 높은 회상률을 유지할 수 있습니다.</p>
<p>RaBitQ는 또한<a href="https://www.vldb.org/pvldb/vol9/p288-andre.pdf"> FastScan</a> 및<a href="https://github.com/facebookresearch/faiss/wiki/Pre--and-post-processing"> 무작위 회전 전처리와</a> 같은 다른 최적화 기법과도 호환성이 높습니다. 또한 RaBitQ는 <strong>훈련이 가볍고 실행 속도가 빠릅니다</strong>. 훈련은 각 벡터 구성 요소의 부호를 간단히 결정하기만 하면 되며, 검색은 최신 CPU에서 지원하는 빠른 비트 단위 연산을 통해 가속화됩니다. 이러한 최적화를 통해 RaBitQ는 정확도 손실을 최소화하면서 고속 검색을 제공할 수 있습니다.</p>
<h2 id="Engineering-RaBitQ-in-Milvus-From-Academic-Research-to-Production" class="common-anchor-header">Milvus에서 RaBitQ 엔지니어링: 학술 연구부터 생산까지<button data-href="#Engineering-RaBitQ-in-Milvus-From-Academic-Research-to-Production" class="anchor-icon" translate="no">
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
    </button></h2><p>개념적으로는 간단하고<a href="https://github.com/gaoj0017/RaBitQ"> 레퍼런스 구현이</a> 함께 제공되지만, Milvus와 같은 분산형 프로덕션급 벡터 데이터베이스에 적용하는 데는 몇 가지 엔지니어링 과제가 있었습니다. 저희는 Milvus의 핵심 벡터 검색 엔진인 Knowhere에 RaBitQ를 구현했으며, 오픈 소스 ANN 검색 라이브러리<a href="https://github.com/facebookresearch/faiss"> FAISS에</a> 최적화된 버전도 제공했습니다.</p>
<p>이 알고리즘을 Milvus에서 어떻게 구현했는지 살펴보겠습니다.</p>
<h3 id="Implementation-Tradeoffs" class="common-anchor-header">구현 트레이드오프</h3><p>중요한 설계 결정 중 하나는 벡터별 보조 데이터를 처리하는 것이었습니다. RaBitQ는 인덱싱 시간 동안 미리 계산된 벡터당 두 개의 부동 소수점 값과 즉석에서 계산하거나 미리 계산할 수 있는 세 번째 값이 필요합니다. Knowhere에서는 이 값을 인덱싱 시점에 미리 계산하여 저장함으로써 검색 시 효율성을 향상시켰습니다. 반면, FAISS 구현은 쿼리 시점에 계산하여 메모리를 절약함으로써 메모리 사용량과 쿼리 속도 간에 다른 절충안을 취합니다.</p>
<h3 id="Hardware-Acceleration" class="common-anchor-header">하드웨어 가속</h3><p>최신 CPU는 이진 연산을 크게 가속화할 수 있는 특수 명령어를 제공합니다. 저희는 최신 CPU 명령어를 활용하기 위해 거리 계산 커널을 맞춤화했습니다. RaBitQ는 팝카운트 연산에 의존하기 때문에, 사용 가능한 경우 AVX512용 <code translate="no">VPOPCNTDQ</code> 명령어를 사용하는 특수 경로를 Knowhere에 만들었습니다. 지원되는 하드웨어(예: Intel IceLake 또는 AMD Zen 4)에서는 기본 구현에 비해 이진 거리 계산을 몇 배 더 가속화할 수 있습니다.</p>
<h3 id="Query-Optimization" class="common-anchor-header">쿼리 최적화</h3><p>Knowhere(Milvus의 검색 엔진)와 최적화된 FAISS 버전 모두 쿼리 벡터에서 스칼라 양자화(SQ1-SQ8)를 지원합니다. 이는 추가적인 유연성을 제공합니다. 4비트 쿼리 양자화를 사용하더라도 리콜은 높게 유지되는 반면 계산 요구는 크게 감소하므로 쿼리를 높은 처리량으로 처리해야 할 때 특히 유용합니다.</p>
<p>저희는 한 걸음 더 나아가 Zilliz Cloud의 완전 관리형 Milvus를 구동하는 독점적인 Cardinal 엔진을 최적화합니다. 오픈 소스 Milvus의 기능 외에도 그래프 기반 벡터 인덱스와의 통합, 추가 최적화 계층, Arm SVE 명령어 지원 등 고급 개선 사항을 도입했습니다.</p>
<h2 id="The-Performance-Gain-3×-More-QPS-with-Comparable-Accuracy" class="common-anchor-header">성능 향상: 비슷한 정확도로 3배 향상된 QPS<button data-href="#The-Performance-Gain-3×-More-QPS-with-Comparable-Accuracy" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus는 버전 2.6부터 새로운 <code translate="no">IVF_RABITQ</code> 인덱스 유형을 도입합니다. 이 새로운 인덱스는 성능, 메모리 효율성 및 정확도 간의 최적의 균형을 제공하기 위해 RaBitQ와 IVF 클러스터링, 랜덤 회전 변환 및 선택적 세분화 기능을 결합합니다.</p>
<h3 id="Using-IVFRABITQ-in-Your-Application" class="common-anchor-header">애플리케이션에서 IVF_RABITQ 사용</h3><p>Milvus 애플리케이션에서 <code translate="no">IVF_RABITQ</code> 을 구현하는 방법은 다음과 같습니다:</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient

index_params = MilvusClient.prepare_index_params()

index_params.add_index(
    field_name=<span class="hljs-string">&quot;your_vector_field_name&quot;</span>, <span class="hljs-comment"># Name of the vector field to be indexed</span>
    index_type=<span class="hljs-string">&quot;IVF_RABITQ&quot;</span>, <span class="hljs-comment"># Will be introduced in Milvus 2.6</span>
    index_name=<span class="hljs-string">&quot;vector_index&quot;</span>, <span class="hljs-comment"># Name of the index to create</span>
    metric_type=<span class="hljs-string">&quot;IP&quot;</span>, <span class="hljs-comment"># IVF_RABITQ supports IP and COSINE</span>
    params={
        <span class="hljs-string">&quot;nlist&quot;</span>: <span class="hljs-number">1024</span>, <span class="hljs-comment"># IVF param, specifies the number of clusters</span>
    } <span class="hljs-comment"># Index building params</span>
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Benchmarking-Numbers-Tell-the-Story" class="common-anchor-header">벤치마킹: 숫자가 말해 주는 이야기</h3><p>벡터 데이터베이스를 평가하는 오픈 소스 벤치마킹 도구인<a href="https://github.com/zilliztech/vectordbbench"> vdb-bench를</a> 사용하여 다양한 구성을 벤치마킹했습니다. 테스트 환경과 제어 환경 모두 AWS EC2 <code translate="no">m6id.2xlarge</code> 인스턴스에 배포된 Milvus Standalone을 사용했습니다. 이 머신은 8개의 vCPU, 32GB RAM, 그리고 VPOPCNTDQ AVX-512 명령어 세트를 지원하는 Ice Lake 아키텍처 기반의 인텔 제온 8375C CPU를 갖추고 있습니다.</p>
<p>각각 768개의 차원을 가진 100만 개의 벡터로 구성된 데이터 세트로 vdb-bench의 검색 성능 테스트를 사용했습니다. Milvus의 기본 세그먼트 크기는 1GB이고 원시 데이터 세트(768개 차원 × 100만 개의 벡터 × 플로트당 4바이트)는 총 3GB이므로 벤치마킹에는 데이터베이스당 여러 개의 세그먼트가 포함되었습니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_Example_test_configuration_in_vdb_bench_000142f634.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>그림: vdb-bench의 테스트 구성 예시.</p>
<p>다음은 IVF, RaBitQ 및 정제 프로세스에 대한 구성 노브에 대한 몇 가지 세부 정보입니다:</p>
<ul>
<li><p><code translate="no">nlist</code> 와 <code translate="no">nprobe</code> 는 모든 <code translate="no">IVF</code> 기반 메서드의 표준 매개변수입니다.</p></li>
<li><p><code translate="no">nlist</code> 는 데이터 세트의 총 IVF 버킷 수를 지정하는 음수가 아닌 정수입니다.</p></li>
<li><p><code translate="no">nprobe</code> 는 검색 프로세스 중에 단일 데이터 벡터에 대해 방문하는 IVF 버킷의 수를 지정하는 음수가 아닌 정수입니다. 검색 관련 매개변수입니다.</p></li>
<li><p><code translate="no">rbq_bits_query</code> 쿼리 벡터의 양자화 수준을 지정합니다. <code translate="no">SQ1</code> ...<code translate="no">SQ8</code> 양자화 수준에는 1...8 값을 사용합니다. 양자화를 사용하지 않으려면 0 값을 사용합니다. 검색 관련 파라미터입니다.</p></li>
<li><p><code translate="no">refine</code> <code translate="no">refine_type</code> 및 매개변수는 정제 프로세스를 위한 표준 매개변수입니다. <code translate="no">refine_k</code> </p></li>
<li><p><code translate="no">refine</code> 는 정제 전략을 활성화하는 부울입니다.</p></li>
<li><p><code translate="no">refine_k</code> 는 음수가 아닌 fp-값입니다. 정제 프로세스는 더 높은 품질의 정량화 방법을 사용하여 <code translate="no">IVFRaBitQ</code> 을 사용하여 선택한 <code translate="no">refine_k</code> 배 더 큰 후보 풀에서 필요한 수의 가장 가까운 이웃을 선택합니다. 검색 관련 매개변수입니다.</p></li>
<li><p><code translate="no">refine_type</code> 는 정제 인덱스의 양자화 유형을 지정하는 문자열입니다. 사용 가능한 옵션은 <code translate="no">SQ6</code>, <code translate="no">SQ8</code>, <code translate="no">FP16</code>, <code translate="no">BF16</code> 및 <code translate="no">FP32</code> / <code translate="no">FLAT</code> 입니다.</p></li>
</ul>
<p>결과는 중요한 인사이트를 보여줍니다:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_Cost_and_performance_comparison_of_baseline_IVF_FLAT_IVF_SQ_8_and_IVF_RABITQ_with_different_refinement_strategies_9f69fa449f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>그림: 다양한 정제 전략을 사용한 기준선(IVF_FLAT), IVF_SQ8 및 IVF_RABITQ의 비용 및 성능 비교</p>
<p>95.2%의 회수율로 236 QPS를 달성하는 기준선 <code translate="no">IVF_FLAT</code> 인덱스에 비해, <code translate="no">IVF_RABITQ</code> 은 FP32 쿼리를 사용하면 648 QPS, SQ8 정량화된 쿼리와 함께 사용하면 898 QPS로 훨씬 더 높은 처리량을 달성합니다. 이러한 수치는 특히 세분화가 적용되었을 때 RaBitQ의 성능 이점을 보여줍니다.</p>
<p>그러나 이러한 성능에는 리콜에서 눈에 띄는 트레이드오프가 있습니다. <code translate="no">IVF_RABITQ</code> 을 정제하지 않고 사용할 경우, 회수율은 약 76% 수준으로 떨어지며, 이는 높은 정확도가 필요한 애플리케이션에는 부족할 수 있습니다. 하지만 1비트 벡터 압축을 사용하여 이 정도의 회수율을 달성하는 것은 여전히 인상적입니다.</p>
<p>정확도를 회복하려면 세분화가 필수적입니다. SQ8 쿼리 및 SQ8 세분화로 구성된 경우 <code translate="no">IVF_RABITQ</code> 는 뛰어난 성능과 정확도를 모두 제공합니다. 94.7%의 높은 리콜을 유지하여 IVF_FLAT과 거의 일치하며, IVF_FLAT보다 3배 이상 높은 864 QPS를 달성합니다. 또 다른 널리 사용되는 양자화 인덱스인 <code translate="no">IVF_SQ8</code>, <code translate="no">IVF_RABITQ</code> 와 비교해도 SQ8 개선이 적용된 경우 비슷한 리콜에서 절반 이상의 처리량을 달성하면서도 비용은 약간 더 높습니다. 따라서 속도와 정확도가 모두 요구되는 시나리오에 탁월한 옵션입니다.</p>
<p>요컨대, <code translate="no">IVF_RABITQ</code> 만으로도 허용 가능한 리콜로 처리량을 극대화할 수 있으며, <code translate="no">IVF_FLAT</code> 에 비해 메모리 공간의 일부만 사용하면서 품질 격차를 줄이기 위해 개선과 결합하면 더욱 강력해집니다.</p>
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
    </button></h2><p>RaBitQ는 벡터 양자화 기술의 획기적인 발전을 의미합니다. 이진 양자화와 스마트 인코딩 전략을 결합하여 정확도 손실을 최소화하면서 극한의 압축이라는 불가능해 보였던 것을 달성했습니다.</p>
<p>Milvus는 버전 2.6부터 이 강력한 압축 기술을 IVF 클러스터링 및 개선 전략과 통합하여 바이너리 양자화를 프로덕션에 적용하는 IVF_RABITQ를 도입할 예정입니다. 이 조합은 정확도, 속도, 메모리 효율성 사이에서 실질적인 균형을 이루며 벡터 검색 워크로드를 혁신할 수 있습니다.</p>
<p>저희는 이와 같은 혁신을 오픈 소스 Milvus와 Zilliz Cloud의 완전 관리형 서비스 모두에 도입하여 누구나 벡터 검색을 보다 효율적이고 쉽게 이용할 수 있도록 하기 위해 최선을 다하고 있습니다.</p>
<h2 id="Getting-Started-with-Milvus-26" class="common-anchor-header">Milvus 2.6 시작하기<button data-href="#Getting-Started-with-Milvus-26" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.6은 현재 사용 가능합니다. RabitQ 외에도 계층형 스토리지, Meanhash LSH, 향상된 전체 텍스트 검색 및 멀티테넌시 등 수십 가지의 새로운 기능과 성능 최적화를 도입하여 오늘날 벡터 검색에서 가장 시급한 과제인 효율적인 확장과 비용 관리를 직접 해결합니다.</p>
<p>Milvus 2.6이 제공하는 모든 것을 살펴볼 준비가 되셨나요?<a href="https://milvus.io/docs/release_notes.md"> 릴리즈 노트를</a> 자세히 살펴보고,<a href="https://milvus.io/docs"> 전체 설명서를</a> 찾아보거나,<a href="https://milvus.io/blog"> 기능 블로그를</a> 확인해 보세요.</p>
<p>궁금한 점이 있거나 유사한 사용 사례가 있는 경우, <a href="https://discord.com/invite/8uyFbECzPX">Discord 커뮤니티를</a> 통해 문의하거나<a href="https://github.com/milvus-io/milvus"> GitHub에</a> 이슈를 제출해 주세요. Milvus 2.6을 최대한 활용할 수 있도록 도와드리겠습니다.</p>
