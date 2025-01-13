---
id: select-index-parameters-ivf-index.md
title: 1. index_file_size
author: milvus
date: 2020-02-26T22:57:02.071Z
desc: IVF 인덱스 모범 사례
cover: assets.zilliz.com/header_4d3fc44879.jpg
tag: Engineering
canonicalUrl: 'https://zilliz.com/blog/select-index-parameters-ivf-index'
---
<custom-h1>IVF 인덱스의 인덱스 매개변수를 선택하는 방법</custom-h1><p><a href="https://medium.com/@milvusio/best-practices-for-milvus-configuration-f38f1e922418">Milvus 구성 모범 사례에서</a> Milvus 0.6.0 구성에 대한 몇 가지 모범 사례를 소개했습니다. 이 글에서는 테이블 생성, 인덱스 생성, 검색 등의 작업을 위해 Milvus 클라이언트에서 주요 매개변수를 설정하는 몇 가지 모범 사례도 소개합니다. 이러한 매개변수는 검색 성능에 영향을 미칠 수 있습니다.</p>
<h2 id="1-codeindexfilesizecode" class="common-anchor-header">1. <code translate="no">index_file_size</code><button data-href="#1-codeindexfilesizecode" class="anchor-icon" translate="no">
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
    </button></h2><p>테이블을 생성할 때 index_file_size 매개변수는 데이터 저장용 단일 파일의 크기(MB)를 지정하는 데 사용됩니다. 기본값은 1024입니다. 벡터 데이터를 가져올 때 Milvus는 데이터를 파일로 점진적으로 결합합니다. 파일 크기가 index_file_size에 도달하면 이 파일은 더 이상 새 데이터를 받아들이지 않고 Milvus는 새 데이터를 다른 파일에 저장합니다. 이 파일들은 모두 원시 데이터 파일입니다. 인덱스가 생성되면 Milvus는 각 원시 데이터 파일에 대해 인덱스 파일을 생성합니다. IVFLAT 인덱스 타입의 경우, 인덱스 파일 크기는 해당 원시 데이터 파일의 크기와 거의 같습니다. SQ8 인덱스의 경우, 인덱스 파일의 크기는 해당 원시 데이터 파일의 약 30%입니다.</p>
<p>검색하는 동안 Milvus는 각 인덱스 파일을 하나씩 검색합니다. 경험에 따르면, index_file_size가 1024에서 2048로 변경되면 검색 성능이 30퍼센트에서 50퍼센트까지 향상됩니다. 그러나 값이 너무 크면 대용량 파일을 GPU 메모리(또는 CPU 메모리)에 로드하지 못할 수 있습니다. 예를 들어 GPU 메모리가 2GB이고 index_file_size가 3GB인 경우 인덱스 파일을 GPU 메모리에 로드할 수 없습니다. 일반적으로 index_file_size를 1024MB 또는 2048MB로 설정합니다.</p>
<p>다음 표는 index_file_size에 대해 sift50m을 사용한 테스트입니다. 인덱스 유형은 SQ8입니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_sift50m_test_results_milvus_74f60de4aa.png" alt="1-sift50m-test-results-milvus.png" class="doc-image" id="1-sift50m-test-results-milvus.png" />
   </span> <span class="img-wrapper"> <span>1-sift50m-test-results-milvus.png</span> </span></p>
<p>CPU 모드와 GPU 모드에서 index_file_size가 1024MB가 아닌 2048MB일 때 검색 성능이 크게 향상되는 것을 볼 수 있습니다.</p>
<h2 id="2-codenlistcode-and-codenprobecode" class="common-anchor-header"><code translate="no">nlist</code> <strong>및</strong> <code translate="no">nprobe</code><button data-href="#2-codenlistcode-and-codenprobecode" class="anchor-icon" translate="no">
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
    </button></h2><p><code translate="no">nlist</code> 파라미터는 인덱스 생성에 사용되며 <code translate="no">nprobe</code> 파라미터는 검색에 사용됩니다. IVFLAT과 SQ8은 모두 클러스터링 알고리즘을 사용하여 많은 수의 벡터를 클러스터 또는 버킷으로 분할합니다. <code translate="no">nlist</code> 은 클러스터링 중 버킷의 수입니다.</p>
<p>인덱스를 사용하여 검색할 때 첫 번째 단계는 목표 벡터에 가장 가까운 일정 수의 버킷을 찾는 것이고, 두 번째 단계는 벡터 거리별로 버킷에서 가장 유사한 k개의 벡터를 찾는 것입니다. <code translate="no">nprobe</code> 은 첫 번째 단계의 버킷 수입니다.</p>
<p>일반적으로 <code translate="no">nlist</code> 을 증가시키면 클러스터링 중에 버킷의 수는 늘어나고 버킷에 포함된 벡터의 수는 줄어듭니다. 결과적으로 계산 부하가 감소하고 검색 성능이 향상됩니다. 하지만 유사도 비교를 위한 벡터 수가 줄어들면 정확한 결과를 놓칠 수 있습니다.</p>
<p><code translate="no">nprobe</code> 을 늘리면 검색할 버킷이 더 많아집니다. 결과적으로 계산 부하가 증가하고 검색 성능이 저하되지만 검색 정밀도는 향상됩니다. 분포가 다른 데이터 세트마다 상황이 다를 수 있습니다. <code translate="no">nlist</code> 과 <code translate="no">nprobe</code> 을 설정할 때 데이터 세트의 크기도 고려해야 합니다. 일반적으로 <code translate="no">nlist</code> 은 <code translate="no">4 * sqrt(n)</code> 으로 설정하는 것이 좋습니다. 여기서 n 은 벡터의 총 개수입니다. <code translate="no">nprobe</code> 의 경우 정밀도와 효율성 사이에서 절충점을 찾아야 하며 시행착오를 통해 값을 결정하는 것이 가장 좋은 방법입니다.</p>
<p>다음 표는 <code translate="no">nlist</code> 와 <code translate="no">nprobe</code> 에 대해 sift50m을 사용한 테스트를 보여줍니다. 인덱스 유형은 SQ8입니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/sq8_index_test_sift50m_b5daa9f7b5.png" alt="sq8-index-test-sift50m.png" class="doc-image" id="sq8-index-test-sift50m.png" />
   </span> <span class="img-wrapper"> <span>sq8-index-test-sift50m.png</span> </span></p>
<p>표는 <code translate="no">nlist</code>/<code translate="no">nprobe</code> 의 서로 다른 값을 사용하여 검색 성능과 정밀도를 비교한 것입니다. CPU와 GPU 테스트의 결과가 비슷하기 때문에 GPU 결과만 표시되어 있습니다. 이 테스트에서 <code translate="no">nlist</code>/<code translate="no">nprobe</code> 의 값이 같은 비율로 증가하면 검색 정밀도도 증가합니다. <code translate="no">nlist</code> = 4096, <code translate="no">nprobe</code> = 128인 경우 Milvus의 검색 성능이 가장 우수합니다. 결론적으로 <code translate="no">nlist</code> 및 <code translate="no">nprobe</code> 의 값을 결정할 때는 다양한 데이터 세트와 요구 사항을 고려하여 성능과 정밀도 간의 절충점을 찾아야 합니다.</p>
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
    </button></h2><p><code translate="no">index_file_size</code>: 데이터 크기가 <code translate="no">index_file_size</code> 보다 큰 경우 <code translate="no">index_file_size</code> 값이 클수록 검색 성능이 향상됩니다.<code translate="no">nlist</code> 및 <code translate="no">nprobe</code>：성능과 정밀도 사이에서 절충점을 찾아야 합니다.</p>
