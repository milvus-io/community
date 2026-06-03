---
id: 25-million-vectors-1gb-memory-milvus-flat.md
title: 'Milvus에서 1GB 미만의 메모리로 2,500만 개의 이미지 벡터를 실행하는 방법'
author: Jack Li
date: 2026-6-3
cover: >-
  assets.zilliz.com/25_million_vectors_1gb_memory_milvus_flat_md_1_19b2539810.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  Milvus FLAT index, vector database memory, mmap vector index, FP16 vector
  quantization, image search
meta_title: |
  How to Run 25 Million Image Vectors on Under 1GB of Memory in Milvus
desc: >-
  커뮤니티 사용자가 크기 조정 도구의 139GB 예상치 대신 FLAT, FP16 및 mmap을 사용하여 Milvus에서 1GB 미만의
  메모리에서 25M 벡터 이미지 검색을 실행한 방법.
origin: 'https://milvus.io/blog/25-million-vectors-1gb-memory-milvus-flat.md'
---
<p>최근 한 Milvus 사용자가 매우 실용적인 이미지 검색 문제를 가지고 저희를 찾아왔습니다.</p>
<p>"1280차원 벡터로 인코딩된 2,500만 개의 이미지에 대해 이미지 대 이미지 검색을 수행해야 합니다. 한 대의 컴퓨터로 이 워크로드를 처리할 수 있습니다. 이 컴퓨터에는 64GB의 RAM이 있고 벡터 데이터베이스에는 최대 32GB만 사용할 수 있습니다. 하지만 <a href="https://milvus.io/tools/sizing"><strong>Milvus 사이징 도구에</strong></a> 따르면 139GB가 필요하다고 합니다. 다 된 건가요?"</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/25_million_vectors_1gb_memory_milvus_flat_md_2_06e0f8be39.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>사이징 도구 예상 결과: 25M × 1280 차원 벡터, 원시 데이터 크기 119.2GB, 로딩 메모리 139.4GB</p>
<p>그렇지 않습니다.</p>
<p>처음에는 더 고급 인덱스가 정답인 것 같았습니다. 데이터 세트가 크고 메모리가 부족하다면 당연히 더 똑똑한 ANN 인덱스가 도움이 될 것입니다. 이 경우에는 그렇지 않았습니다. 마침내 효과가 있었던 인덱스는 Milvus의 가장 간단한 옵션이었습니다: <a href="https://milvus.io/docs/flat.md"><strong>FLAT</strong></a>.</p>
<p>결과는 예상보다 좋았습니다. 정상 상태 메모리는 1GB 미만으로 유지되었고, 컨테이너의 상주 메모리는 약 600MB, 웜 쿼리 지연 시간은 100ms 미만으로 유지되었습니다. 시작은 약 12.5GB로 잠시 정점을 찍었고 시스템이 워밍업되는 동안 첫 쿼리는 약 30초가 걸렸습니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/25_million_vectors_1gb_memory_milvus_flat_md_3_272794fc9b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>중요한 부분은 FLAT이 마법처럼 2,500만 건의 무차별 비교를 저렴하게 처리했다는 것이 아닙니다. 그렇지 않았습니다. 중요한 부분은 이 워크로드가 2,500만 개의 벡터를 모두 검색한 적이 거의 없었다는 것입니다. 스칼라 필터가 먼저 각 쿼리의 범위를 좁혔고, FLAT은 그보다 훨씬 작은 후보 집합 내의 벡터만 비교했습니다.</p>
<p>이 포스팅에서는 무엇이 실패했는지, 왜 FLAT이 효과가 있었는지, 그리고 동일한 패턴이 여러분의 워크로드에서 시도해 볼 만한 가치가 있는지에 대해 설명합니다.</p>
<h2 id="Why-AISAQ-and-IVFFLAT-Did-Not-Work-Here" class="common-anchor-header">AISAQ와 IVF_FLAT이 여기서 작동하지 않은 이유<button data-href="#Why-AISAQ-and-IVFFLAT-Did-Not-Work-Here" class="anchor-icon" translate="no">
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
    </button></h2><p>FLAT 이전에 사용자는 제약이 있는 머신에 더 자연스러워 보이는 두 가지 인덱스를 시도했습니다.</p>
<p><strong>첫 번째 시도:</strong> <a href="https://milvus.io/docs/aisaq.md"><strong>AISAQ</strong></a><strong>.</strong> AISAQ는 메모리 사용량을 낮게 유지하도록 설계된 디스크 지향 인덱스입니다. 이 워크로드에서 문제가 된 것은 빌드 및 로드 경로였습니다. 5,500만 개의 벡터를 사용한 이전 테스트에서, 하나의 컬렉션 로드는 249GB의 임시 데이터를 디스크에 썼고 실용적으로 사용하기에는 너무 오래 걸렸습니다.</p>
<p><strong>두 번째 시도: IVF_FLAT.</strong> IVF_FLAT도 표준 ANN 인덱스이기 때문에 합리적으로 보였습니다. 인덱스는 성공적으로 구축되었지만 수집 부하가 14%에서 멈췄고 복구되지 않았습니다.</p>
<p>이 두 번의 막다른 골목 이후, 사용자는 지루한 옵션을 시도했습니다: FLAT. 깔끔하게 로드되었습니다. 또한 이 특정 쿼리 패턴에 대해 최상의 런타임 동작을 제공했습니다.</p>
<table>
<thead>
<tr><th><strong>인덱스</strong></th><th><strong>유망해 보였던 이유</strong></th><th><strong>이 워크로드에서 일어난 일</strong></th></tr>
</thead>
<tbody>
<tr><td>AISAQ</td><td>이론상 메모리 사용량이 적은 디스크 지향 인덱스입니다.</td><td>빌드/로드 경로가 대용량 임시 파일을 생성했습니다. 55M 벡터 테스트에서 하나의 수집 로드는 249GB의 임시 데이터를 썼고 속도가 느렸습니다.</td></tr>
<tr><td>IVF_FLAT</td><td>전체 스캔보다 검색 비용이 낮은 표준 ANN 인덱스</td><td>인덱스가 구축되었지만 수집 로드가 14%에서 멈췄고 복구되지 않았습니다.</td></tr>
<tr><td>FLAT</td><td>추가 ANN 구조가 없고 인덱스 구축 복잡성이 없음</td><td>정상 상태 메모리가 1GB 미만으로 유지됨. 컨테이너 상주 메모리는 약 600MB였습니다. 시작은 12.5GB 근처에서 정점을 찍었습니다. 첫 쿼리는 약 30초가 걸렸고, 웜 쿼리는 100ms 미만으로 유지되었습니다.</td></tr>
</tbody>
</table>
<p>교훈은 간단합니다. 이론적으로는 효율적인 인덱스가 특정 머신, 데이터 형태, 쿼리 패턴에 적합하지 않을 수 있다는 것입니다.</p>
<h2 id="Why-FLAT-Worked" class="common-anchor-header">FLAT이 효과적인 이유<button data-href="#Why-FLAT-Worked" class="anchor-icon" translate="no">
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
    </button></h2><p>FLAT은 Milvus가 지원하는 인덱스 중 가장 단순한 인덱스입니다. 그래프가 없습니다. 트리도 없습니다. 클러스터링도 없습니다. 쿼리 벡터를 후보 벡터와 직접 비교합니다.</p>
<p>2,500만 개의 벡터를 위한 잘못된 도구처럼 들립니다. 모든 쿼리가 전체 컬렉션을 검색한다면 잘못된 도구가 될 것입니다.</p>
<p>하지만 이 워크로드에는 벡터 검색 앞에 강력한 필터가 있었습니다. 모든 쿼리는 먼저 <code translate="no">dataid</code> 및 <code translate="no">classid</code> 과 같은 스칼라 필드로 검색 공간을 좁혔습니다. 그리고 나서야 Milvus는 벡터 유사도 검색을 실행했습니다. 이로써 문제가 "2,500만 개의 벡터 검색"에서 "필터링 후 수백에서 수만 개의 벡터 검색"으로 바뀌었습니다.</p>
<p>세 가지가 이 설정을 가능하게 했습니다: FP16 벡터 스토리지, 원시 벡터 데이터를 위한 mmap, 그리고 FLAT 패스 전의 스칼라 필터링이 그것입니다.</p>
<h2 id="Optimization-1-FP16-Cuts-Vector-Data-in-Half" class="common-anchor-header">최적화 1: FP16으로 벡터 데이터를 절반으로 줄임<button data-href="#Optimization-1-FP16-Cuts-Vector-Data-in-Half" class="anchor-icon" translate="no">
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
    </button></h2><p>벡터는 1280개의 차원을 가졌습니다. FP32로 저장하면 각 벡터는 5120바이트가 필요합니다:</p>
<p><code translate="no">1280 dimensions x 4 bytes = 5120 bytes</code></p>
<p>2,500만 개의 벡터를 모두 합치면 약 119.2GB의 원시 벡터 데이터가 필요합니다. FP16은 각 차원을 4바이트에서 2바이트로 줄입니다:</p>
<p><code translate="no">1280 dimensions x 2 bytes = 2560 bytes</code></p>
<p>따라서 원시 벡터 데이터는 약 59.6GB로 줄어듭니다.</p>
<p>이는 여전히 사용 가능한 RAM에 깔끔하게 들어맞지는 않지만, Milvus와 운영 체제가 처리해야 하는 벡터 데이터의 양을 절반으로 줄여줍니다. 많은 이미지 검색 워크로드에서 FP16은 리콜에 미치는 영향이 적지만, 그렇다고 해서 자유로운 규칙은 아닙니다. 기본값으로 설정하기 전에 자체 임베딩, 메트릭 및 품질 막대로 리콜을 테스트하세요.</p>
<h2 id="Optimization-2-mmap-Keeps-Raw-Vectors-Off-the-Process-Heap" class="common-anchor-header">최적화 2: 원시 벡터를 프로세스 힙에서 제외하는 mmap<button data-href="#Optimization-2-mmap-Keeps-Raw-Vectors-Off-the-Process-Heap" class="anchor-icon" translate="no">
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
    </button></h2><p>FP16 이후에도 약 60GB의 벡터는 여전히 메모리 예산에 비해 너무 많은 양입니다. 바로 이 부분에서 <a href="https://milvus.io/docs/mmap.md"><strong>mmap이</strong></a> 유용해집니다.</p>
<p>mmap을 사용하면 Milvus는 전체 원시 벡터 필드를 프로세스 메모리에 로드하는 대신 메모리 매핑된 파일을 통해 벡터 데이터에 액세스할 수 있습니다. 운영 체제는 쿼리가 닿는 대로 데이터를 페이지화하여 페이지 캐시에 핫 페이지를 보관할 수 있습니다.</p>
<p>이 사용자의 Milvus 2.6.14 환경에서는 클러스터 수준의 mmap 구성이 이미 원시 벡터 데이터를 다루고 있었기 때문에 사용자가 수동으로 mmap을 설정할 필요가 없었습니다.</p>
<p>디버깅 중에 한 가지 세부 사항으로 인해 혼란이 발생했습니다: Attu는 클러스터 수준의 기본값이 아닌 스키마 수준의 mmap 설정을 표시합니다. 따라서 클러스터 수준 구성이 데이터 경로에 대해 효과적으로 mmap을 사용하도록 설정되어 있어도 <a href="https://zilliz.com/attu"><strong>Attu에</strong></a> mmap이 비활성화된 것으로 표시될 수 있습니다.</p>
<p>mmap은 RAM을 절약하지만 디스크와 OS 페이지 캐시를 더 많이 사용합니다. 벡터 파일에는 여전히 SSD 용량이 필요하며, 디스크에서 관련 페이지를 읽는 동안 첫 번째 쿼리 속도가 느려질 수 있습니다.</p>
<h2 id="Optimization-3-Scalar-Filtering-Is-the-Real-Performance-Multiplier" class="common-anchor-header">최적화 3: 스칼라 필터링이 실제 성능 향상 효과<button data-href="#Optimization-3-Scalar-Filtering-Is-the-Real-Performance-Multiplier" class="anchor-icon" translate="no">
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
    </button></h2><p>FP16과 mmap은 메모리 수를 설명합니다. 스칼라 필터링은 지연 시간을 설명합니다.</p>
<p>이 워크로드의 모든 쿼리에는 다음과 같은 필터 표현식이 포함되어 있습니다:</p>
<pre><code translate="no" class="language-sql">dataid in [123] AND classid in [0, 2, 3]
<button class="copy-code-btn"></button></code></pre>
<p>이 필터는 벡터 비교 단계 전에 실행되었습니다. FLAT은 2,500만 개의 벡터와 비교하는 대신 수백에서 수만 개의 벡터로 구성된 필터링된 후보 세트와 비교했습니다.</p>
<p>그렇기 때문에 웜 쿼리가 100ms 미만으로 유지되었습니다. 최신 CPU에서는 수만 개의 벡터 비교가 실용적입니다. 쿼리당 2,500만 개의 비교는 매우 다른 이야기가 될 것입니다.</p>
<p>이것은 또한 IVF_FLAT과 HNSW가 여기서 유용하지 않은 이유를 설명해 줍니다. 스칼라 필터링으로 후보 집합을 충분히 줄이면, 추가 ANN 구조는 불필요한 부하가 될 수 있습니다. 메모리, 빌드 시간, 로드 복잡성이 추가되지만 지연 시간은 크게 개선되지 않을 수 있습니다.</p>
<p>한 가지 주의할 점이 있습니다. 이 워크로드의 필터는 단순했습니다. 필터가 대규모 <code translate="no">IN</code> 목록, <code translate="no">LIKE</code> 패턴, 범위 술어 또는 중첩된 JSON 조건을 사용하는 경우 관련 필드에 스칼라 인덱스를 추가하고 필터 단계를 직접 측정하세요.</p>
<table>
<thead>
<tr><th>최적화</th><th>기능</th><th>여기서 중요한 이유</th><th>트레이드 오프</th></tr>
</thead>
<tbody>
<tr><td>FP16 벡터 저장</td><td>각 벡터 차원을 4바이트가 아닌 2바이트로 저장합니다.</td><td>원시 벡터 데이터가 약 119.2GB에서 약 59.6GB로 감소했습니다.</td><td>리콜 영향은 임베딩과 메트릭에 따라 달라집니다. 테스트해 보세요.</td></tr>
<tr><td>원시 벡터의 MMAP</td><td>전체 원시 벡터 필드를 프로세스 메모리에 로드하는 대신 디스크에서 벡터 파일을 매핑합니다.</td><td>프로세스 메모리를 낮게 유지하면서 OS가 필요에 따라 데이터를 페이지로 가져올 수 있도록 함</td><td>SSD 용량이 필요하며 콜드 쿼리가 느려질 수 있습니다.</td></tr>
<tr><td>스칼라 필터링 우선</td><td>벡터 비교 전에 스칼라 필드를 기준으로 필터링</td><td>각 쿼리를 2500만 개의 후보에서 수백 또는 수만 개로 줄임</td><td>복잡한 필터에는 스칼라 인덱스가 필요할 수 있습니다.</td></tr>
</tbody>
</table>
<h2 id="Where-This-Pattern-Applies" class="common-anchor-header">이 패턴이 적용되는 경우<button data-href="#Where-This-Pattern-Applies" class="anchor-icon" translate="no">
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
    </button></h2><p>이미지 검색 사례는 실제 검색 공간이 전체 컬렉션보다 훨씬 작았기 때문에 효과가 있었습니다. 많은 프로덕션 워크로드에서 동일한 형태가 나타납니다.</p>
<ol>
<li><strong>멀티테넌트 RAG:</strong> <code translate="no">tenant_id</code>, <code translate="no">workspace_id</code>, 또는 <code translate="no">project_id</code> 로 먼저 필터링합니다. 각 테넌트에는 수천 또는 수만 개의 청크만 있을 수 있습니다.</li>
<li><strong>전자상거래 제품 검색:</strong> 벡터 검색 전에 카테고리, 브랜드, 판매자, 지역 또는 가용성별로 필터링하세요.</li>
<li><strong>로그 및 문서 검색:</strong> 시맨틱 검색 전에 시간 범위, 소스, 서비스 또는 문서 유형별로 필터링하세요.</li>
<li><strong>레이블을 사용한 이미지 또는 미디어 검색:</strong> 임베딩을 비교하기 전에 데이터 세트, 클래스, 고객 또는 자산 그룹별로 필터링합니다.</li>
</ol>
<p>각 쿼리가 여전히 작은 하위 집합에 영향을 미치지만 전체 컬렉션은 클 수 있으므로 FLAT + FP16 + mmap에 적합한 후보입니다.</p>
<p>모든 쿼리가 전체 컬렉션을 검색하는 경우에는 이 패턴이 적용되지 않습니다. 각 쿼리가 실제로 2,500만 개의 벡터를 모두 스캔해야 하는 경우, FLAT은 동일한 지연 시간을 제공하지 않습니다. 이 경우 HNSW, IVF 또는 디스크 지향 인덱스와 같은 ANN 인덱스를 사용하고 메모리, 디스크 및 빌드 시간 절충을 계획하세요.</p>
<h2 id="How-to-Read-the-Sizing-Tool-Estimate" class="common-anchor-header">사이징 도구 예상치를 읽는 방법<button data-href="#How-to-Read-the-Sizing-Tool-Estimate" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 사이징 도구는 하드웨어에 대한 최종 판단이 아니라 시작점입니다.</p>
<p>이 경우 139.4GB의 로딩 메모리 추정치는 2,500만 개의 1280차원 FP32 벡터에 대한 보수적인 기준이 되었습니다. 실제 워크로드는 몇 가지 가정을 변경했습니다:</p>
<ol>
<li>FP16은 원시 벡터 크기를 대략 절반으로 줄였습니다.</li>
<li>mmap은 전체 원시 벡터 필드를 프로세스 메모리에 로드하는 것을 피했습니다.</li>
<li>FLAT은 추가 ANN 인덱스 구조를 피했습니다.</li>
<li>스칼라 필터는 각 쿼리 검색의 후보 집합을 훨씬 더 작게 만들었습니다.</li>
</ol>
<p>이것이 바로 실제 워크로드 테스트가 중요한 이유입니다. 크기 추정치만을 기반으로 하드웨어 설정을 거부하기 전에 실제 벡터 정밀도, 인덱스 유형, mmap 구성, 스칼라 필터, 콜드 쿼리 동작 및 웜 쿼리 동작으로 테스트하세요.</p>
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
    </button></h2><p>동일한 방법을 시도하려면 인덱스 이름이 아닌 쿼리 패턴부터 시작하세요.</p>
<ol>
<li>모든 쿼리에 선택적 스칼라 필터가 있는지 확인합니다.</li>
<li>필터링 후 얼마나 많은 벡터가 남을지 추정합니다.</li>
<li>리콜 테스트가 양호한 경우 벡터를 FP16으로 저장합니다.</li>
<li>필터링된 후보 집합이 무차별 비교에 적합할 만큼 작으면 FLAT을 사용합니다.</li>
<li>원시 벡터 데이터에 대한 MMAP 동작을 확인합니다. 스키마 수준 설정과 클러스터 수준 구성을 모두 확인합니다.</li>
<li>시작 메모리, 첫 번째 쿼리 지연 시간, 웜 쿼리 지연 시간, 디스크 I/O를 측정합니다.</li>
<li>필터 평가가 병목 현상이 발생하면 스칼라 인덱스를 추가합니다.</li>
</ol>
<p>로컬 테스트의 경우, <a href="https://milvus.io/docs/quickstart.md"><strong>Milvus 빠른 시작</strong></a> 또는 Milvus <a href="https://github.com/milvus-io/milvus"><strong>GitHub</strong></a> 리포지토리로 시작하세요. 컬렉션을 검사하려면 Attu를 사용하되, Attu가 클러스터 수준의 mmap 기본값을 표시하지 않을 수 있다는 점을 기억하세요.</p>
<p>인프라를 직접 실행하고 싶지 않다면, 관리형 Milvus 서비스인 <a href="https://zilliz.com/cloud"><strong>Zilliz Cloud를</strong></a> 이용하세요. 관리형 운영, 확장 및 테스트를 위한 무료 티어와 함께 동일한 Milvus 코어를 사용할 수 있습니다. 업무용 이메일로 $100 무료 크레딧을 <a href="https://cloud.zilliz.com/signup"><strong>신청하거나</strong></a> 이미 계정이 있는 경우 <a href="https://cloud.zilliz.com/login"><strong>로그인하세요</strong></a>.</p>
