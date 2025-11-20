---
id: understanding-ivf-vector-index-how-It-works-and-when-to-choose-it-over-hnsw.md
title: '시험관 아기 벡터 인덱스 이해: 작동 방식 및 HNSW보다 선택해야 하는 경우'
author: Jack Li
date: 2025-10-27T00:00:00.000Z
cover: assets.zilliz.com/ivf_1bbe0e9f85.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'IVF, ANN, HNSW, vector index, vector database'
meta_title: How to Choose Between IVF and HNSW for ANN Vector Search
desc: >-
  IVF 벡터 인덱스가 어떻게 작동하는지, 어떻게 ANN 검색을 가속하는지, 속도, 메모리, 필터링 효율성에서 HNSW보다 뛰어난 성능을
  발휘하는 경우를 알아보세요.
origin: >-
  https://milvus.io/blog/understanding-ivf-vector-index-how-It-works-and-when-to-choose-it-over-hnsw.md
---
<p>벡터 데이터베이스에서는 이미지 특징, 텍스트 임베딩 또는 오디오 표현과 같은 방대한 고차원 벡터 컬렉션 중에서 가장 유사한 결과를 빠르게 찾아야 하는 경우가 많습니다. 인덱스가 없으면 유일한 옵션은 쿼리 벡터를 데이터 세트의 모든 단일 벡터와 비교하는 것입니다. 이러한 무차별 <strong>검색은</strong> 벡터가 수천 개일 때는 효과가 있을 수 있지만, 수만 개 또는 수억 개를 다루게 되면 견딜 수 없을 정도로 느리고 계산 비용이 많이 듭니다.</p>
<p>바로 이때 <strong>근사</strong> 최인접 <strong>이웃(ANN)</strong> 검색이 등장합니다. 거대한 도서관에서 특정 책을 찾는다고 생각해보세요. 모든 책을 일일이 확인하는 대신 그 책이 들어 있을 가능성이 가장 높은 섹션부터 검색하는 것입니다. 전체 검색과 <em>정확히</em> 동일한 결과를 얻을 수는 없지만 매우 근접한 결과를 짧은 시간 내에 얻을 수 있습니다. 요컨대, ANN은 약간의 정확도 저하를 감수하고 속도와 확장성을 크게 향상시킵니다.</p>
<p>ANN 검색을 구현하는 여러 가지 방법 중 가장 널리 사용되는 것은 <strong>IVF(반전 파일)</strong> 와 <strong>HNSW(계층적 탐색 가능한 작은 세계)</strong> 입니다. 하지만 IVF는 대규모 벡터 검색에서 효율성과 적응성이 뛰어납니다. 이 문서에서는 IVF의 작동 방식과 HNSW와의 비교를 통해 두 방법의 장단점을 이해하고 워크로드에 가장 적합한 방법을 선택할 수 있도록 안내해 드립니다.</p>
<h2 id="What-is-an-IVF-Vector-Index" class="common-anchor-header">IVF 벡터 인덱스란 무엇인가요?<button data-href="#What-is-an-IVF-Vector-Index" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>IVF(반전 파일)</strong> 는 ANN에 가장 널리 사용되는 알고리즘 중 하나입니다. 텍스트 검색 시스템에서 사용되는 '반전 인덱스'에서 핵심 아이디어를 차용한 것인데, 이번에는 단어와 문서 대신 고차원 공간의 벡터를 다루고 있습니다.</p>
<p>거대한 도서관을 정리하는 것과 같다고 생각하세요. 모든 책(벡터)을 하나의 거대한 책 더미에 버리면 필요한 것을 찾는 데 시간이 오래 걸릴 것입니다. IVF는 먼저 모든 벡터를 그룹, 즉 <em>버킷으로</em> <strong>클러스터링하여</strong> 이 문제를 해결합니다. 각 버킷은 유사한 벡터의 '카테고리'를 나타내며, 해당 클러스터 내의 모든 것에 대한 일종의 요약 또는 '레이블' <strong>인 중심점으로</strong>정의됩니다.</p>
<p>쿼리가 들어오면 검색은 두 단계로 진행됩니다:</p>
<p><strong>1. 가장 가까운 클러스터를 찾습니다.</strong> 시스템이 쿼리 벡터에 가장 가까운 중심을 가진 몇 개의 버킷을 찾습니다. 마치 책이 있을 가능성이 가장 높은 도서관 섹션 두세 개를 바로 찾는 것처럼 말이죠.</p>
<p><strong>2. 해당 클러스터 내에서 검색합니다.</strong> 올바른 섹션에 들어가면 전체 라이브러리가 아닌 작은 책 세트만 살펴보기만 하면 됩니다.</p>
<p>이 접근 방식은 계산량을 크게 줄여줍니다. 여전히 매우 정확한 결과를 얻을 수 있지만 훨씬 더 빠릅니다.</p>
<h2 id="How-to-Build-an-IVF-Vector-Index" class="common-anchor-header">IVF 벡터 인덱스를 구축하는 방법<button data-href="#How-to-Build-an-IVF-Vector-Index" class="anchor-icon" translate="no">
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
    </button></h2><p>IVF 벡터 인덱스를 구축하는 과정에는 세 가지 주요 단계가 포함됩니다: K-평균 클러스터링, 벡터 할당, 압축 인코딩(선택 사항)입니다. 전체 프로세스는 다음과 같습니다:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ivf_building_process_90c2966975.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-1-K-means-Clustering" class="common-anchor-header">1단계: K-평균 클러스터링</h3><p>먼저, 데이터 세트 X에서 k-평균 클러스터링을 실행하여 고차원 벡터 공간을 n리스트 클러스터로 나눕니다. 각 클러스터는 구심점 테이블 C에 저장된 구심점으로 표현되며, 구심점의 수인 nlist는 클러스터링의 세분화 정도를 결정하는 핵심적인 하이퍼파라미터입니다.</p>
<p>k-means의 내부 작동 방식은 다음과 같습니다:</p>
<ul>
<li><p><strong>초기화:</strong> <em>nlist</em> 벡터를 초기 중심점으로 무작위로 선택합니다.</p></li>
<li><p><strong>할당:</strong> 각 벡터에 대해 모든 구심점과의 거리를 계산하여 가장 가까운 구심점에 할당합니다.</p></li>
<li><p><strong>업데이트:</strong> 각 클러스터에 대해 벡터의 평균을 계산하고 이를 새 중심점으로 설정합니다.</p></li>
<li><p><strong>반복 및 수렴:</strong> 중심이 크게 변하지 않거나 최대 반복 횟수에 도달할 때까지 할당과 업데이트를 반복합니다.</p></li>
</ul>
<p>k-평균이 수렴되면, 그 결과 n리스트 중심이 IVF의 "인덱스 디렉토리"를 형성합니다. 이는 데이터 세트가 어떻게 거칠게 분할되는지를 정의하여 나중에 쿼리가 검색 공간을 빠르게 좁힐 수 있게 해줍니다.</p>
<p>도서관의 비유를 다시 생각해 보면, 훈련된 중심체는 주제별로 책을 그룹화할 방법을 결정하는 것과 같습니다:</p>
<ul>
<li><p>n목록이 크면 더 많은 섹션이 있고, 각 섹션에는 더 적은 수의 구체적인 책이 있습니다.</p></li>
<li><p>목록이 작을수록 더 적은 수의 섹션이 더 광범위하고 다양한 주제를 다루게 됩니다.</p></li>
</ul>
<h3 id="Step-2-Vector-Assignment" class="common-anchor-header">2단계: 벡터 할당</h3><p>다음으로, 각 벡터는 가장 가까운 중심을 가진 클러스터에 할당되어 반전된 목록(List_i)을 형성합니다. 각 반전된 리스트에는 해당 클러스터에 속한 모든 벡터의 ID와 저장소 정보가 저장됩니다.</p>
<p>이 단계는 책을 각각의 섹션으로 분류하는 것과 같다고 생각하면 됩니다. 나중에 제목을 찾을 때 라이브러리 전체를 돌아다니지 않고 해당 제목이 있을 가능성이 가장 높은 몇 개의 섹션만 확인하면 됩니다.</p>
<h3 id="Step-3-Compression-Encoding-Optional" class="common-anchor-header">3단계: 압축 인코딩(선택 사항)</h3><p>메모리를 절약하고 계산 속도를 높이기 위해 각 클러스터 내의 벡터는 압축 인코딩을 거칠 수 있습니다. 두 가지 일반적인 접근 방식이 있습니다:</p>
<ul>
<li><p><strong>SQ8(스칼라 양자화):</strong> 이 방법은 벡터의 각 차원을 8비트로 양자화합니다. 표준 <code translate="no">float32</code> 벡터의 경우 각 차원은 일반적으로 4바이트를 차지합니다. SQ8을 사용하면 1바이트로 줄어들어 벡터의 형상을 거의 그대로 유지하면서 4:1의 압축률을 달성할 수 있습니다.</p></li>
<li><p><strong>PQ(제품 정량화):</strong> 고차원 벡터를 여러 개의 하위 공간으로 분할합니다. 예를 들어 128차원 벡터를 각각 16차원의 8개 하위 벡터로 나눌 수 있습니다. 각 하위 공간에는 작은 코드북(일반적으로 256개의 항목으로 구성)이 미리 학습되어 있으며, 각 하위 벡터는 가장 가까운 코드북 항목을 가리키는 8비트 인덱스로 표현됩니다. 즉, 원래 128-D <code translate="no">float32</code> 벡터(512바이트 필요)를 8바이트(8개 하위 공간 × 각 1바이트)만 사용하여 64:1의 압축률을 달성하여 표현할 수 있습니다.</p></li>
</ul>
<h2 id="How-to-Use-the-IVF-Vector-Index-for-Search" class="common-anchor-header">검색에 IVF 벡터 인덱스를 사용하는 방법<button data-href="#How-to-Use-the-IVF-Vector-Index-for-Search" class="anchor-icon" translate="no">
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
    </button></h2><p>중심 테이블, 반전 목록, 압축 인코더 및 코드북(선택 사항)이 구축되면 IVF 인덱스를 사용하여 유사도 검색을 가속화할 수 있습니다. 이 프로세스는 일반적으로 아래와 같이 세 가지 주요 단계로 이루어집니다:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ivf_search_process_025d3f444f.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-1-Calculate-distances-from-the-query-vector-to-all-centroids" class="common-anchor-header">1단계: 쿼리 벡터에서 모든 중심까지의 거리 계산하기</h3><p>쿼리 벡터 q가 도착하면 시스템은 먼저 이 벡터가 어느 클러스터에 속할 가능성이 가장 높은지 결정합니다. 그런 다음 일반적으로 유사성 지표로 유클리드 거리 또는 내적 곱을 사용하여 q와 구심점 테이블 C의 모든 구심점 사이의 거리를 계산합니다. 그런 다음 구심점은 쿼리 벡터와의 거리에 따라 정렬되어 가장 가까운 것부터 가장 먼 것까지 정렬된 목록을 생성합니다.</p>
<p>예를 들어, 그림에 표시된 것처럼 순서는 다음과 같습니다: C4 &lt; C2 &lt; C1 &lt; C3 &lt; C5.</p>
<h3 id="Step-2-Select-the-nearest-nprobe-clusters" class="common-anchor-header">2단계: 가장 가까운 n프로브 클러스터 선택하기</h3><p>전체 데이터 세트를 스캔하지 않기 위해 IVF는 쿼리 벡터에 가장 가까운 상위 <em>nprobe</em> 클러스터 내에서만 검색합니다.</p>
<p>매개변수 nprobe는 검색 범위를 정의하며 속도와 리콜 사이의 균형에 직접적인 영향을 미칩니다:</p>
<ul>
<li><p>n프로브가 작을수록 쿼리 속도가 빨라지지만 회상률이 떨어질 수 있습니다.</p></li>
<li><p>n프로브가 클수록 리콜률은 향상되지만 지연 시간이 증가합니다.</p></li>
</ul>
<p>실제 시스템에서는 지연 시간 예산 또는 정확도 요구 사항에 따라 nprobe를 동적으로 조정할 수 있습니다. 위의 예에서 nprobe = 2이면 시스템은 클러스터 2와 클러스터 4, 즉 가장 가까운 두 클러스터 내에서만 검색합니다.</p>
<h3 id="Step-3-Search-the-nearest-neighbor-in-the-selected-clusters" class="common-anchor-header">3단계: 선택한 클러스터에서 가장 가까운 이웃 검색하기</h3><p>후보 클러스터가 선택되면 시스템은 쿼리 벡터 q를 그 안에 저장된 벡터와 비교합니다. 비교 모드에는 크게 두 가지가 있습니다:</p>
<ul>
<li><p><strong>정확한 비교(IVF_FLAT)</strong>: 시스템이 선택한 클러스터에서 원본 벡터를 검색하여 q와의 거리를 직접 계산하여 가장 정확한 결과를 반환합니다.</p></li>
<li><p><strong>근사 비교(IVF_PQ / IVF_SQ8)</strong>: PQ 또는 SQ8 압축을 사용하는 경우 시스템은 <strong>룩업 테이블 방식을</strong> 사용하여 거리 계산을 가속화합니다. 검색을 시작하기 전에 쿼리 벡터와 각 코드북 항목 사이의 거리를 미리 계산합니다. 그런 다음 각 벡터에 대해 이러한 사전 계산된 거리를 간단히 '조회하고 합산'하여 유사성을 추정할 수 있습니다.</p></li>
</ul>
<p>마지막으로, 검색된 모든 클러스터의 후보 결과를 병합하고 순위를 다시 매겨 가장 유사한 상위 k개의 벡터를 최종 출력으로 생성합니다.</p>
<h2 id="IVF-In-Practice" class="common-anchor-header">IVF 실무<button data-href="#IVF-In-Practice" class="anchor-icon" translate="no">
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
    </button></h2><p>IVF 벡터 인덱스가 어떻게 <strong>구축되고</strong> <strong>검색되는지</strong> 이해했다면, 다음 단계는 실제 워크로드에 적용하는 것입니다. 실제로는 <strong>성능</strong>, <strong>정확도</strong>, <strong>메모리 사용량</strong> 사이에서 균형을 맞춰야 하는 경우가 많습니다. 다음은 엔지니어링 경험에서 도출된 몇 가지 실용적인 가이드라인입니다.</p>
<h3 id="How-to-Choose-the-Right-nlist" class="common-anchor-header">올바른 nlist를 선택하는 방법</h3><p>앞서 언급했듯이, 매개변수 nlist는 IVF 인덱스를 구축할 때 데이터 세트가 분할되는 클러스터의 수를 결정합니다.</p>
<ul>
<li><p><strong>nlist가 클수록</strong>: 더 세분화된 클러스터를 생성하므로 각 클러스터에 더 적은 수의 벡터가 포함됩니다. 이렇게 하면 검색 중에 스캔되는 벡터의 수가 줄어들고 일반적으로 쿼리 속도가 빨라집니다. 하지만 인덱스를 구축하는 데 시간이 더 오래 걸리고 중심 테이블이 더 많은 메모리를 소비합니다.</p></li>
<li><p><strong>더 작은 n리스트</strong>: 인덱스 구축 속도가 빨라지고 메모리 사용량이 줄어들지만 각 클러스터가 더 "혼잡해집니다." 각 쿼리는 클러스터 내에서 더 많은 벡터를 스캔해야 하므로 성능 병목 현상이 발생할 수 있습니다.</p></li>
</ul>
<p>이러한 장단점을 바탕으로 다음은 실용적인 경험 법칙입니다:</p>
<p><strong>백만 개 규모의</strong> 데이터 세트의 경우, 좋은 시작점은 <strong>nlist ≈ √n입니다</strong> (n은 색인되는 데이터 샤드의 벡터 수입니다).</p>
<p>예를 들어, 백만 개의 벡터가 있는 경우, nlist = 1,000을 사용해 보세요. 수천만 또는 수억 개의 대규모 데이터 세트의 경우, 대부분의 벡터 데이터베이스는 각 샤드에 약 백만 개의 벡터가 포함되도록 데이터를 샤드화하여 이 규칙을 실용적으로 유지합니다.</p>
<p>nlist는 인덱스 생성 시 고정되기 때문에 나중에 변경하면 전체 인덱스를 다시 구축해야 합니다. 따라서 초기에 실험하는 것이 가장 좋습니다. 여러 값(예: 1024, 2048)을 2의 거듭제곱으로 테스트하여 워크로드의 속도, 정확도, 메모리의 균형을 맞추는 최적의 지점을 찾으세요.</p>
<h3 id="How-to-Tune-nprobe" class="common-anchor-header">nprobe를 조정하는 방법</h3><p>매개변수 nprobe는 쿼리 시간 동안 검색되는 클러스터의 수를 제어합니다. 이는 리콜과 지연 시간 간의 균형에 직접적인 영향을 미칩니다.</p>
<ul>
<li><p><strong>더 큰 nprobe</strong>: 더 많은 클러스터를 포함하므로 리콜률이 높아지지만 지연 시간도 길어집니다. 지연은 일반적으로 검색된 클러스터의 수에 따라 선형적으로 증가합니다.</p></li>
<li><p><strong>더 작은 n프로브</strong>: 더 적은 수의 클러스터를 검색하므로 지연 시간이 짧고 쿼리 속도가 빨라집니다. 그러나 실제 가장 가까운 이웃을 일부 놓칠 수 있어 리콜과 결과 정확도가 약간 낮아질 수 있습니다.</p></li>
</ul>
<p>애플리케이션이 지연 시간에 매우 민감하지 않다면, 예를 들어 1에서 16 사이의 값을 테스트하여 리콜과 지연 시간이 어떻게 변하는지 관찰하는 등 동적으로 nprobe를 실험해 보는 것이 좋습니다. 목표는 리콜이 허용 가능한 수준이고 지연 시간이 목표 범위 내에서 유지되는 최적의 지점을 찾는 것입니다.</p>
<p>nprobe는 런타임 검색 매개변수이므로 인덱스를 다시 빌드할 필요 없이 즉시 조정할 수 있습니다. 따라서 다양한 워크로드 또는 쿼리 시나리오에 걸쳐 빠르고 저렴하며 매우 유연하게 조정할 수 있습니다.</p>
<h3 id="Common-Variants-of-the-IVF-Index" class="common-anchor-header">IVF 인덱스의 일반적인 변형</h3><p>IVF 인덱스를 구축할 때는 각 클러스터의 벡터에 압축 인코딩을 사용할지 여부와 사용한다면 어떤 방법을 사용할지 결정해야 합니다.</p>
<p>그 결과 세 가지 일반적인 IVF 인덱스 변형이 생깁니다:</p>
<table>
<thead>
<tr><th><strong>IVF 변형</strong></th><th><strong>주요 기능</strong></th><th><strong>사용 사례</strong></th></tr>
</thead>
<tbody>
<tr><td><strong>IVF_FLAT</strong></td><td>각 클러스터 내에 원시 벡터를 압축하지 않고 저장합니다. 가장 높은 정확도를 제공하지만, 가장 많은 메모리를 소비합니다.</td><td>높은 정확도(95% 이상)가 요구되는 중간 규모의 데이터 세트(최대 수억 개의 벡터)에 이상적입니다.</td></tr>
<tr><td><strong>IVF_PQ</strong></td><td>클러스터 내에서 벡터를 압축하기 위해 제품 정량화(PQ)를 적용합니다. 압축 비율을 조정하면 메모리 사용량을 크게 줄일 수 있습니다.</td><td>어느 정도의 정확도 손실이 허용되는 대규모 벡터 검색(수억 개 이상)에 적합합니다. 64:1 압축 비율을 사용하면 일반적으로 약 70%의 리콜을 얻을 수 있지만 압축 비율을 낮추면 90% 이상에 도달할 수 있습니다.</td></tr>
<tr><td><strong>IVF_SQ8</strong></td><td>스칼라 양자화(SQ8)를 사용해 벡터를 양자화합니다. 메모리 사용량은 IVF_FLAT과 IVF_PQ 사이에 위치합니다.</td><td>효율성을 향상시키면서 상대적으로 높은 리콜(90% 이상)을 유지해야 하는 대규모 벡터 검색에 이상적입니다.</td></tr>
</tbody>
</table>
<h2 id="IVF-vs-HNSW-Pick-What-Fits" class="common-anchor-header">IVF와 HNSW: 적합한 것 선택하기<button data-href="#IVF-vs-HNSW-Pick-What-Fits" class="anchor-icon" translate="no">
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
    </button></h2><p>IVF 외에도 <strong>HNSW(계층적 탐색 가능한 작은 세계)</strong> 는 널리 사용되는 또 다른 인메모리 벡터 인덱스입니다. 아래 표는 이 둘의 주요 차이점을 강조하고 있습니다.</p>
<table>
<thead>
<tr><th></th><th><strong>IVF</strong></th><th><strong>HNSW</strong></th></tr>
</thead>
<tbody>
<tr><td><strong>알고리즘 개념</strong></td><td>클러스터링 및 버킷화</td><td>다층 그래프 탐색</td></tr>
<tr><td><strong>메모리 사용량</strong></td><td>비교적 낮음</td><td>비교적 높음</td></tr>
<tr><td><strong>인덱스 구축 속도</strong></td><td>빠름(클러스터링만 필요)</td><td>느림(다층 그래프 구성 필요)</td></tr>
<tr><td><strong>쿼리 속도(필터링 없음)</strong></td><td>빠름, <em>nprobe에</em> 따라 다름</td><td>매우 빠름, 그러나 대수적 복잡성이 있음</td></tr>
<tr><td><strong>쿼리 속도(필터링 포함)</strong></td><td>안정적 - 중심 수준에서 거친 필터링을 수행하여 후보를 좁힙니다.</td><td>불안정 - 특히 필터링 비율이 높은 경우(90% 이상), 그래프가 조각화되고 무차별 검색보다 훨씬 느린 전체 그래프 탐색으로 저하될 수 있습니다.</td></tr>
<tr><td><strong>리콜률</strong></td><td>압축 사용 여부에 따라 다르며, 정량화하지 않으면 리콜률이 <strong>95% 이상에</strong> 달할 수 있습니다.</td><td>일반적으로 약 <strong>98%</strong> 이상으로 더 높습니다.</td></tr>
<tr><td><strong>주요 파라미터</strong></td><td><em>nlist</em>, <em>nprobe</em></td><td><em>m</em>, <em>ef_construction</em>, <em>ef_search</em></td></tr>
<tr><td><strong>사용 사례</strong></td><td>메모리는 제한되어 있지만 높은 쿼리 성능과 리콜이 필요한 경우, 필터링 조건이 있는 검색에 적합합니다.</td><td>메모리가 충분하고 매우 높은 리콜 및 쿼리 성능이 목표이지만 필터링이 필요하지 않거나 필터링 비율이 낮은 경우</td></tr>
</tbody>
</table>
<p>실제 애플리케이션에서는 "특정 사용자의 벡터만 검색" 또는 "특정 시간 범위로 결과 제한"과 같은 필터링 조건을 포함하는 것이 매우 일반적입니다. 기본 알고리즘의 차이로 인해 IVF는 일반적으로 HNSW보다 필터링된 검색을 더 효율적으로 처리합니다.</p>
<p>IVF의 강점은 2단계 필터링 프로세스에 있습니다. 먼저 중심(클러스터) 수준에서 거친 필터를 수행하여 후보 집합을 빠르게 좁힌 다음, 선택한 클러스터 내에서 세분화된 거리 계산을 수행할 수 있습니다. 이렇게 하면 데이터의 많은 부분이 필터링된 경우에도 안정적이고 예측 가능한 성능을 유지할 수 있습니다.</p>
<p>이와 대조적으로 HNSW는 그래프 탐색을 기반으로 합니다. 그 구조 때문에 탐색 중에 필터링 조건을 직접 활용할 수 없습니다. 필터링 비율이 낮을 때는 큰 문제가 발생하지 않습니다. 그러나 필터링 비율이 높으면(예: 데이터의 90% 이상이 필터링되는 경우) 나머지 그래프가 파편화되어 많은 "고립된 노드"가 형성되는 경우가 많습니다. 이러한 경우, 검색은 거의 전체 그래프 탐색으로 저하될 수 있으며, 때로는 무차별 대입 검색보다 더 나쁠 수도 있습니다.</p>
<p>실제로 IVF 인덱스는 이미 다양한 도메인에서 영향력이 큰 많은 사용 사례를 지원하고 있습니다:</p>
<ul>
<li><p><strong>전자 상거래 검색:</strong> 사용자가 제품 이미지를 업로드하면 수백만 개의 목록에서 시각적으로 유사한 항목을 즉시 찾을 수 있습니다.</p></li>
<li><p><strong>특허 검색:</strong> 짧은 설명이 주어지면 시스템은 방대한 데이터베이스에서 의미적으로 가장 연관성이 높은 특허를 찾아낼 수 있으며, 이는 기존의 키워드 검색보다 훨씬 더 효율적입니다.</p></li>
<li><p><strong>RAG 지식 기반:</strong> IVF는 수백만 개의 테넌트 문서에서 가장 관련성이 높은 문맥을 검색하여 AI 모델이 보다 정확하고 근거 있는 답변을 생성할 수 있도록 지원합니다.</p></li>
</ul>
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
    </button></h2><p>올바른 색인을 선택하려면 구체적인 사용 사례에 따라 달라집니다. 대규모 데이터 세트로 작업하거나 필터링된 검색을 지원해야 하는 경우, IVF가 더 적합할 수 있습니다. HNSW와 같은 그래프 기반 인덱스에 비해 IVF는 더 빠른 인덱스 빌드, 더 낮은 메모리 사용량, 속도와 정확성 사이의 강력한 균형을 제공합니다.</p>
<p>가장 널리 사용되는 오픈 소스 벡터 데이터베이스인<a href="https://milvus.io/">Milvus는</a> IVF_FLAT, IVF_PQ, IVF_SQ8을 포함한 전체 IVF 제품군을 완벽하게 지원합니다. 이러한 인덱스 유형을 쉽게 실험해보고 성능과 메모리 요구 사항에 가장 적합한 설정을 찾을 수 있습니다. Milvus가 지원하는 인덱스의 전체 목록은 <a href="https://milvus.io/docs/index-explained.md">Milvus 인덱스 문서 페이지에서</a> 확인하세요.</p>
<p>이미지 검색, 추천 시스템 또는 RAG 지식 베이스를 구축 중이라면 Milvus의 IVF 인덱싱을 사용해 보고 효율적인 대규모 벡터 검색이 실제로 어떻게 느껴지는지 확인해 보세요.</p>
