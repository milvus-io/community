---
id: milvus-performance-AVX-512-vs-AVX2.md
title: 고급 벡터 확장이란 무엇인가요?
author: milvus
date: 2020-11-10T22:15:39.156Z
desc: 다양한 벡터 인덱스를 사용하여 Milvus가 AVX-512와 AVX2에서 어떤 성능을 보이는지 알아보세요.
cover: assets.zilliz.com/header_milvus_performance_avx_512_vs_avx2_2c9f14ef96.png
tag: Engineering
canonicalUrl: 'https://zilliz.com/blog/milvus-performance-AVX-512-vs-AVX2'
---
<custom-h1>AVX-512와 AVX2의 Milvus 성능 비교</custom-h1><p>세상을 장악하려는 의식이 있는 지능형 기계는 공상 과학 소설에서 꾸준히 등장하지만 실제로 현대 컴퓨터는 매우 순종적입니다. 지시를 받지 않으면 스스로 무엇을 해야 할지 거의 알지 못합니다. 컴퓨터는 프로그램에서 프로세서로 전송되는 명령, 즉 지시에 따라 작업을 수행합니다. 가장 낮은 수준에서 각 명령어는 컴퓨터가 실행할 작업을 설명하는 1과 0의 시퀀스입니다. 일반적으로 컴퓨터 조립 언어에서 각 기계어 명령문은 프로세서 명령어에 해당합니다. 중앙 처리 장치(CPU)는 명령어에 의존하여 계산을 수행하고 시스템을 제어합니다. 또한 CPU 성능은 명령어 실행 능력(예: 실행 시간)으로 측정되는 경우가 많습니다.</p>
<h2 id="What-are-Advanced-Vector-Extensions" class="common-anchor-header">고급 벡터 확장이란 무엇인가요?<button data-href="#What-are-Advanced-Vector-Extensions" class="anchor-icon" translate="no">
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
    </button></h2><p>고급 벡터 확장(AVX)은 x86 명령어 집합 아키텍처 제품군을 사용하는 마이크로프로세서를 위한 명령어 집합입니다. 2008년 3월 인텔에서 처음 제안한 AVX는 3년 후 2세대 인텔 코어 프로세서(예: 코어 i7, i5, i3)에 사용되는 마이크로 아키텍처인 샌디 브릿지(Sandy Bridge)와 2011년 출시된 AMD의 경쟁 마이크로 아키텍처인 불도저가 출시되면서 폭넓은 지지를 받았습니다.</p>
<p>AVX는 새로운 코딩 체계, 새로운 기능, 새로운 명령어를 도입했습니다. AVX2는 대부분의 정수 연산을 256비트로 확장하고 융합 곱셈-누적(FMA) 연산을 도입했습니다. AVX-512는 새로운 EVEX(향상된 벡터 확장) 접두사 인코딩을 사용하여 AVX를 512비트 연산으로 확장합니다.</p>
<p><a href="https://milvus.io/docs">Milvus는</a> 유사도 검색 및 인공 지능(AI) 애플리케이션을 위해 설계된 오픈 소스 벡터 데이터베이스입니다. 이 플랫폼은 AVX-512 명령어 세트를 지원하므로 AVX-512 명령어를 포함하는 모든 CPU에서 사용할 수 있습니다. Milvus는 추천 시스템, 컴퓨터 비전, 자연어 처리(NLP) 등을 아우르는 광범위한 애플리케이션을 보유하고 있습니다. 이 문서에서는 AVX-512 및 AVX2에서 Milvus 벡터 데이터베이스의 성능 결과와 분석을 제시합니다.</p>
<h2 id="Milvus-performance-on-AVX-512-vs-AVX2" class="common-anchor-header">AVX-512와 AVX2에서의 Milvus 성능 비교<button data-href="#Milvus-performance-on-AVX-512-vs-AVX2" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="System-configuration" class="common-anchor-header">시스템 구성</h3><ul>
<li>CPU: 인텔® 플래티넘 8163 CPU @ 2.50GHz24코어 48스레드</li>
<li>CPU 개수 2</li>
<li>그래픽 카드, GeForce RTX 2080Ti 11GB 4 카드</li>
<li>메모리: 768GB</li>
<li>디스크: 2TB SSD</li>
</ul>
<h3 id="Milvus-parameters" class="common-anchor-header">밀버스 매개변수</h3><ul>
<li>cahce.cahe_size: 25, 빠른 쿼리를 위해 데이터를 캐싱하는 데 사용되는 CPU 메모리 크기입니다.</li>
<li>nlist: 4096</li>
<li>nprobe: 128</li>
</ul>
<p>참고: <code translate="no">nlist</code> 은 클라이언트에서 생성할 인덱싱 매개변수이고 <code translate="no">nprobe</code> 은 검색 매개변수입니다. IVF_FLAT과 IVF_SQ8은 모두 클러스터링 알고리즘을 사용하여 많은 수의 벡터를 버킷으로 분할하며, <code translate="no">nlist</code> 은 클러스터링 중에 분할할 총 버킷 수입니다. 쿼리의 첫 번째 단계는 대상 벡터에 가장 가까운 버킷의 수를 찾는 것이고, 두 번째 단계는 벡터의 거리를 비교하여 이러한 버킷에서 상위 k개의 벡터를 찾는 것입니다. <code translate="no">nprobe</code> 는 첫 번째 단계의 버킷 수를 나타냅니다.</p>
<h3 id="Dataset-SIFT10M-dataset" class="common-anchor-header">데이터 세트: SIFT10M 데이터 세트</h3><p>이 테스트에서는 100만 개의 128차원 벡터가 포함된 <a href="https://archive.ics.uci.edu/ml/datasets/SIFT10M">SIFT10M 데이터 세트를</a> 사용하며, 해당 최인접 이웃 검색 방법의 성능을 분석하는 데 자주 사용됩니다. nq = [1, 10, 100, 500, 1000]에 대한 상위 1순위 검색 시간을 두 명령어 세트 간에 비교합니다.</p>
<h3 id="Results-by-vector-index-type" class="common-anchor-header">벡터 인덱스 유형별 결과</h3><p><a href="https://zilliz.com/blog/Accelerating-Similarity-Search-on-Really-Big-Data-with-Vector-Indexing">벡터 인덱스는</a> 다양한 수학적 모델을 사용해 컬렉션의 벡터 필드에 구축된 시간 및 공간 효율적인 데이터 구조입니다. 벡터 인덱싱을 사용하면 입력 벡터와 유사한 벡터를 식별하려고 할 때 대규모 데이터 세트를 효율적으로 검색할 수 있습니다. 정확한 검색에는 시간이 많이 걸리기 때문에 <a href="https://milvus.io/docs/v2.0.x/index.md#CPU">Milvus에서 지원하는</a> 대부분의 인덱스 유형은 근사 근사 이웃(ANN) 검색을 사용합니다.</p>
<p>이 테스트에서는 AVX-512 및 AVX2와 함께 IVF_FLAT, IVF_SQ8, HNSW의 세 가지 인덱스가 사용되었습니다.</p>
<h3 id="IVFFLAT" class="common-anchor-header">IVF_FLAT</h3><p>반전 파일(IVF_FLAT)은 양자화를 기반으로 하는 인덱스 유형입니다. 가장 기본적인 IVF 인덱스이며, 각 유닛에 저장된 인코딩된 데이터는 원본 데이터와 일치합니다. 인덱스는 벡터 데이터를 여러 개의 클러스터 단위(nlist)로 나눈 다음, 목표 입력 벡터와 각 클러스터의 중심 사이의 거리를 비교합니다. 시스템이 쿼리하도록 설정된 클러스터 수(nprobe)에 따라 목표 입력과 가장 유사한 클러스터의 벡터만을 비교하여 유사도 검색 결과를 반환하므로 쿼리 시간이 대폭 단축됩니다. nprobe를 조정하면 주어진 시나리오에서 정확도와 속도 사이의 이상적인 균형을 찾을 수 있습니다.</p>
<p><strong>성능 결과</strong> <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/IVF_FLAT_3688377fc8.png" alt="IVF_FLAT.png" class="doc-image" id="ivf_flat.png" /><span>IVF_FLAT.png</span> </span></p>
<h3 id="IVFSQ8" class="common-anchor-header">IVF_SQ8</h3><p>IVF_FLAT은 압축을 수행하지 않으므로 생성되는 인덱스 파일은 인덱싱되지 않은 원본 원시 벡터 데이터와 거의 같은 크기입니다. 디스크, CPU 또는 GPU 메모리 리소스가 제한되어 있는 경우 IVF_SQ8이 IVF_FLAT보다 더 나은 옵션입니다. 이 인덱스 유형은 스칼라 양자화를 수행하여 원본 벡터의 각 차원을 4바이트 부동 소수점 숫자에서 1바이트 부호 없는 정수로 변환할 수 있습니다. 이렇게 하면 디스크, CPU 및 GPU 메모리 소비가 70~75% 감소합니다.</p>
<p><strong>성능 결과</strong> <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/IVF_SQ_8_bed28307f7.png" alt="IVF_SQ8.png" class="doc-image" id="ivf_sq8.png" /><span>IVF_SQ8.png</span> </span></p>
<h3 id="HNSW" class="common-anchor-header">HNSW</h3><p>계층적 작은 세계 그래프(HNSW)는 그래프 기반 인덱싱 알고리즘입니다. 쿼리는 최상위 계층에서 대상에 가장 가까운 노드를 찾는 것으로 시작하여 다음 계층으로 내려가 또 다른 검색을 수행합니다. 여러 번 반복하면 목표 위치에 빠르게 접근할 수 있습니다.</p>
<p><strong>성능 결과</strong> <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/HNSW_52aba39214.png" alt="HNSW.png" class="doc-image" id="hnsw.png" /><span>HNSW.png</span> </span></p>
<h2 id="Comparing-vector-indexes" class="common-anchor-header">벡터 인덱스 비교<button data-href="#Comparing-vector-indexes" class="anchor-icon" translate="no">
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
    </button></h2><p>벡터 검색은 AVX-512 명령어 세트에서 AVX2보다 일관되게 더 빠릅니다. 이는 AVX512가 512비트 연산을 지원하는 반면 AVX2는 256비트 연산만 지원하기 때문입니다. 이론적으로 AVX-512는 AVX2보다 두 배 더 빨라야 하지만 Milvus는 벡터 유사도 계산 외에도 시간이 많이 걸리는 다른 작업을 수행합니다. 실제 시나리오에서 AVX-512의 전체 검색 시간은 AVX2보다 두 배 더 짧을 가능성은 거의 없습니다. <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/comparison_a64b92f1dd.png" alt="comparison.png" class="doc-image" id="comparison.png" /><span>comparison.png</span> </span></p>
<p>검색은 다른 두 인덱스보다 HNSW 인덱스에서 훨씬 빠른 반면, IVF_SQ8 검색은 두 명령어 세트 모두에서 IVF_FLAT보다 약간 빠릅니다. 이는 IVF_SQ8이 IVF_FLAT에 필요한 메모리의 25%만 필요하기 때문일 수 있습니다. IVF_SQ8은 각 벡터 차원당 1바이트를 로드하는 반면, IVF_FLAT은 벡터 차원당 4바이트를 로드합니다. 계산에 필요한 시간은 메모리 대역폭의 제약을 받을 가능성이 높습니다. 결과적으로 IVF_SQ8은 공간을 덜 차지할 뿐만 아니라 벡터를 검색하는 데 필요한 시간도 더 짧습니다.</p>
<h2 id="Milvus-is-a-versatile-high-performance-vector-database" class="common-anchor-header">Milvus는 다목적 고성능 벡터 데이터베이스입니다.<button data-href="#Milvus-is-a-versatile-high-performance-vector-database" class="anchor-icon" translate="no">
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
    </button></h2><p>이 문서에 제시된 테스트는 Milvus가 서로 다른 인덱스를 사용하는 AVX-512 및 AVX2 명령어 세트 모두에서 뛰어난 성능을 제공한다는 것을 보여줍니다. 인덱스 유형에 관계없이 Milvus는 AVX-512에서 더 나은 성능을 발휘합니다.</p>
<p>Milvus는 다양한 딥 러닝 플랫폼과 호환되며 다양한 AI 애플리케이션에 사용됩니다. 세계에서 가장 인기 있는 벡터 데이터베이스를 새롭게 재해석한 <a href="https://zilliz.com/news/lfaidata-launches-milvus-2.0-an-advanced-cloud-native-vector-database-built-for-ai">Milvus 2.0은</a> 2021년 7월에 오픈 소스 라이선스로 출시되었습니다. 프로젝트에 대한 자세한 내용은 다음 리소스를 참조하세요:</p>
<ul>
<li><a href="https://github.com/milvus-io/milvus/">GitHub에서</a> Milvus를 찾거나 기여하세요.</li>
<li><a href="https://join.slack.com/t/milvusio/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ">Slack을</a> 통해 커뮤니티와 소통하세요.</li>
<li><a href="https://twitter.com/milvusio">트위터에서</a> 소통하세요.</li>
</ul>
