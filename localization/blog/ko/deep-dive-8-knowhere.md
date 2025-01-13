---
id: deep-dive-8-knowhere.md
title: 밀버스 벡터 데이터베이스의 유사도 검색 기능은 무엇인가요?
author: Yudong Cai
date: 2022-05-10T00:00:00.000Z
desc: '그리고 아니요, Faiss가 아닙니다.'
cover: assets.zilliz.com/Deep_Dive_8_6919720d59.png
tag: Engineering
tags: 'Data science, Database, Tech, Artificial Intelligence, Vector Management'
canonicalUrl: 'https://milvus.io/blog/deep-dive-8-knowhere.md'
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Deep_Dive_8_6919720d59.png" alt="cover image" class="doc-image" id="cover-image" />
   </span> <span class="img-wrapper"> <span>표지 이미지</span> </span></p>
<blockquote>
<p>이 글은 <a href="https://github.com/cydrain">유동카이가</a> 작성하고 <a href="https://www.linkedin.com/in/yiyun-n-2aa713163/">안젤라 니가</a> 번역했습니다.</p>
</blockquote>
<p>핵심 벡터 실행 엔진인 Knowhere는 스포츠카의 엔진과 같은 역할을 합니다. 이 글에서는 Knowhere가 무엇인지, Faiss와 어떻게 다른지, 그리고 Knowhere의 코드가 어떻게 구성되어 있는지 소개합니다.</p>
<p><strong>바로가기:</strong></p>
<ul>
<li><a href="#The-concept-of-Knowhere">Knowhere의 개념</a></li>
<li><a href="#Knowhere-in-the-Milvus-architecture">Milvus 아키텍처의 Knowhere</a></li>
<li><a href="#Knowhere-Vs-Faiss">Knowhere 대 Faiss</a></li>
<li><a href="#Understanding-the-Knowhere-code">Knowhere 코드 이해하기</a></li>
<li><a href="#Adding-indexes-to-Knowhere">Knowhere에 인덱스 추가하기</a></li>
</ul>
<h2 id="The-concept-of-Knowhere" class="common-anchor-header">Knowhere의 개념<button data-href="#The-concept-of-Knowhere" class="anchor-icon" translate="no">
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
    </button></h2><p>좁게 말하면, Knowhere는 시스템의 상위 계층에 있는 서비스와 하위 계층에 있는 <a href="https://github.com/facebookresearch/faiss">Faiss</a>, <a href="https://github.com/nmslib/hnswlib">Hnswlib</a>, <a href="https://github.com/spotify/annoy">Annoy와</a> 같은 벡터 유사성 검색 라이브러리에 액세스하기 위한 작업 인터페이스입니다. 또한 Knowhere는 이기종 컴퓨팅도 담당합니다. 좀 더 구체적으로, Knowhere는 인덱스 구축과 검색 요청을 실행할 하드웨어(예: CPU 또는 GPU)를 제어합니다. 이것이 바로 작업을 실행할 위치를 파악한다는 의미에서 Knowhere라는 이름이 붙여진 이유입니다. 향후 릴리즈에서는 DPU와 TPU를 포함한 더 많은 유형의 하드웨어가 지원될 예정입니다.</p>
<p>더 넓은 의미에서, Knowhere는 Faiss와 같은 다른 타사 인덱스 라이브러리도 통합합니다. 따라서 전반적으로 Knowhere는 Milvus 벡터 데이터베이스의 핵심 벡터 계산 엔진으로 인식되고 있습니다.</p>
<p>Knowhere의 개념에서 보면 데이터 컴퓨팅 작업만 처리하고 샤딩, 로드 밸런스, 재해 복구와 같은 작업은 Knowhere의 작업 범위를 벗어난다는 것을 알 수 있습니다.</p>
<p>Milvus 2.0.1부터 (넓은 의미에서) <a href="https://github.com/milvus-io/knowhere">Knowhere는</a> Milvus 프로젝트에서 독립됩니다.</p>
<h2 id="Knowhere-in-the-Milvus-architecture" class="common-anchor-header">Milvus 아키텍처의 Knowhere<button data-href="#Knowhere-in-the-Milvus-architecture" class="anchor-icon" translate="no">
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
    </button></h2><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/ec63d1e9_86e1_48e3_9d75_8fed305bbcb5_26b842e9f6.png" alt="knowhere architecture" class="doc-image" id="knowhere-architecture" />
   </span> <span class="img-wrapper"> <span>Knowhere 아키텍처</span> </span></p>
<p>Milvus의 연산은 주로 벡터와 스칼라 연산을 포함합니다. Knowhere는 Milvus에서 벡터에 대한 연산만 처리합니다. 위 그림은 Milvus의 Knowhere 아키텍처를 보여줍니다.</p>
<p>가장 아래쪽 계층은 시스템 하드웨어입니다. 타사 인덱스 라이브러리는 하드웨어 위에 있습니다. 그런 다음 Knowhere는 CGO를 통해 상단의 인덱스 노드 및 쿼리 노드와 상호 작용합니다.</p>
<p>이 문서에서는 아키텍처 그림의 파란색 프레임 안에 표시된 대로 보다 넓은 의미의 Knowhere에 대해 설명합니다.</p>
<h2 id="Knowhere-Vs-Faiss" class="common-anchor-header">Knowhere 대 Faiss<button data-href="#Knowhere-Vs-Faiss" class="anchor-icon" translate="no">
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
    </button></h2><p>Knowhere는 Faiss의 기능을 더욱 확장할 뿐만 아니라 성능도 최적화합니다. 보다 구체적으로 Knowhere는 다음과 같은 장점이 있습니다.</p>
<h3 id="1-Support-for-BitsetView" class="common-anchor-header">1. 비트셋뷰 지원</h3><p>처음에 비트셋은 '소프트 삭제'를 목적으로 Milvus에 도입되었습니다. 소프트 삭제된 벡터는 데이터베이스에 여전히 존재하지만 벡터 유사도 검색이나 쿼리 중에 계산되지 않습니다. 비트 세트의 각 비트는 인덱싱된 벡터에 해당합니다. 벡터가 비트셋에서 "1"로 표시되어 있으면 이 벡터는 소프트 삭제된 벡터이며 벡터 검색 중에 포함되지 않는다는 뜻입니다.</p>
<p>비트셋 매개변수는 CPU 및 GPU 인덱스를 포함해 Knowhere에 노출된 모든 Faiss 인덱스 쿼리 API에 추가됩니다.</p>
<p><a href="https://milvus.io/blog/2022-2-14-bitset.md">비트셋이 어떻게 벡터 검색의 다양성을 가능하게 하는지에</a> 대해 자세히 알아보세요.</p>
<h3 id="2-Support-for-more-similarity-metrics-for-indexing-binary-vectors" class="common-anchor-header">2. 바이너리 벡터 인덱싱을 위한 더 많은 유사성 메트릭 지원</h3><p><a href="https://milvus.io/docs/v2.0.x/metric.md#Hamming-distance">해밍</a> 외에도, Knowhere는 <a href="https://milvus.io/docs/v2.0.x/metric.md#Jaccard-distance">Jaccard</a>, <a href="https://milvus.io/docs/v2.0.x/metric.md#Tanimoto-distance">Tanimoto</a>, <a href="https://milvus.io/docs/v2.0.x/metric.md#Superstructure">상위 구조</a>, <a href="https://milvus.io/docs/v2.0.x/metric.md#Substructure">하위 구조도</a> 지원합니다. Jaccard와 Tanimoto는 두 샘플 세트 간의 유사성을 측정하는 데 사용할 수 있으며, 상부구조와 하부구조는 화학 구조의 유사성을 측정하는 데 사용할 수 있습니다.</p>
<h3 id="3-Support-for-AVX512-instruction-set" class="common-anchor-header">3. AVX512 명령어 세트 지원</h3><p>Faiss 자체는 <a href="https://en.wikipedia.org/wiki/AArch64">AArch64</a>, <a href="https://en.wikipedia.org/wiki/SSE4#SSE4.2">SSE4.2</a>, <a href="https://en.wikipedia.org/wiki/Advanced_Vector_Extensions">AVX2를</a> 포함한 여러 명령어 세트를 지원합니다. Knowhere는 <a href="https://en.wikipedia.org/wiki/AVX-512">AVX512를</a> 추가하여 지원 명령어 세트를 더욱 확장했으며, 이를 통해 <a href="https://milvus.io/blog/milvus-performance-AVX-512-vs-AVX2.md">인덱스 구축 및 쿼리 성능을</a> AVX2에 비해 <a href="https://milvus.io/blog/milvus-performance-AVX-512-vs-AVX2.md">20~30% 향상시킬</a> 수 있습니다.</p>
<h3 id="4-Automatic-SIMD-instruction-selection" class="common-anchor-header">4. 자동 SIMD 명령어 선택</h3><p>Knowhere는 다양한 SIMD 명령어(예: SIMD SSE, AVX, AVX2, AVX512)를 가진 광범위한 CPU 프로세서(온프레미스 및 클라우드 플랫폼 모두)에서 잘 작동하도록 설계되었습니다. 따라서 하나의 소프트웨어 바이너리(예: Milvus)가 주어졌을 때, 어떻게 하면 모든 CPU 프로세서에서 적합한 SIMD 명령어를 자동으로 호출하도록 만들 수 있을까요? Faiss는 자동 SIMD 명령어 선택을 지원하지 않으며, 사용자는 컴파일 중에 SIMD 플래그(예: "-msse4")를 수동으로 지정해야 합니다. 그러나 Knowhere는 Faiss의 코드베이스를 리팩토링하여 구축되었습니다. SIMD 가속에 의존하는 일반적인 함수(예: 유사성 컴퓨팅)는 제외됩니다. 그런 다음 각 기능에 대해 네 가지 버전(즉, SSE, AVX, AVX2, AVX512)을 구현하고 각각 별도의 소스 파일에 넣습니다. 그런 다음 소스 파일은 해당 SIMD 플래그를 사용하여 개별적으로 추가로 컴파일됩니다. 따라서 런타임에 Knowhere는 현재 CPU 플래그를 기반으로 가장 적합한 SIMD 명령어를 자동으로 선택한 다음 후킹을 사용하여 올바른 함수 포인터를 연결할 수 있습니다.</p>
<h3 id="5-Other-performance-optimization" class="common-anchor-header">5. 기타 성능 최적화</h3><p>Knowhere의 성능 최적화에 대한 자세한 내용은 <a href="https://www.cs.purdue.edu/homes/csjgwang/pubs/SIGMOD21_Milvus.pdf">밀버스: 특수 목적의 벡터 데이터 관리 시스템을</a> 읽어보세요.</p>
<h2 id="Understanding-the-Knowhere-code" class="common-anchor-header">Knowhere 코드 이해하기<button data-href="#Understanding-the-Knowhere-code" class="anchor-icon" translate="no">
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
    </button></h2><p>첫 번째 섹션에서 언급했듯이 Knowhere는 벡터 검색 연산만 처리합니다. 따라서 Knowhere는 엔티티의 벡터 필드만 처리합니다(현재는 컬렉션의 엔티티에 대해 하나의 벡터 필드만 지원됨). 인덱스 구축 및 벡터 유사성 검색도 세그먼트의 벡터 필드를 대상으로 합니다. 데이터 모델을 더 잘 이해하려면 <a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md#Data-Model">여기에서</a> 블로그를 읽어보세요.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Entity_fields_6aa517cc4c.png" alt="entity fields" class="doc-image" id="entity-fields" />
   </span> <span class="img-wrapper"> <span>엔티티 필드</span> </span></p>
<h3 id="Index" class="common-anchor-header">인덱스</h3><p>인덱스는 원본 벡터 데이터와는 독립적인 데이터 구조의 일종입니다. 인덱싱에는 인덱스 생성, 데이터 학습, 데이터 삽입, 인덱스 구축의 네 단계가 필요합니다.</p>
<p>일부 AI 애플리케이션의 경우, 데이터 세트 학습은 벡터 검색의 개별 프로세스입니다. 이러한 유형의 애플리케이션에서는 데이터 세트의 데이터를 먼저 학습시킨 다음 유사성 검색을 위해 Milvus와 같은 벡터 데이터베이스에 삽입합니다. sift1M 및 sift1B와 같은 오픈 데이터 세트는 학습 및 테스트를 위한 데이터를 제공합니다. 그러나 Knowhere에서는 학습과 검색을 위한 데이터가 혼합되어 있습니다. 즉, Knowhere는 세그먼트의 모든 데이터를 학습시킨 다음 학습된 모든 데이터를 삽입하고 인덱스를 구축합니다.</p>
<h3 id="Knowhere-code-structure" class="common-anchor-header">Knowhere 코드 구조</h3><p>DataObj는 Knowhere의 모든 데이터 구조의 기본 클래스입니다. <code translate="no">Size()</code> 는 DataObj의 유일한 가상 메서드입니다. Index 클래스는 &quot;size_&quot;라는 필드가 있는 DataObj를 상속합니다. Index 클래스에는 <code translate="no">Serialize()</code> 와 <code translate="no">Load()</code> 라는 두 개의 가상 메서드도 있습니다. Index에서 파생된 VecIndex 클래스는 모든 벡터 인덱스의 가상 베이스 클래스입니다. VecIndex는 <code translate="no">Train()</code>, <code translate="no">Query()</code>, <code translate="no">GetStatistics()</code>, <code translate="no">ClearStatistics()</code> 등의 메서드를 제공합니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Knowhere_base_classes_9d610618d9.png" alt="base clase" class="doc-image" id="base-clase" />
   </span> <span class="img-wrapper"> <span>베이스 클래스</span> </span></p>
<p>다른 인덱스 유형은 위 그림의 오른쪽에 나열되어 있습니다.</p>
<ul>
<li>Faiss 인덱스에는 두 개의 서브 클래스가 있습니다: 부동 소수점 벡터의 모든 인덱스에 대한 FaissBaseIndex와 이진 벡터의 모든 인덱스에 대한 FaissBaseBinaryIndex입니다.</li>
<li>GPUIndex는 모든 Faiss GPU 인덱스의 베이스 클래스입니다.</li>
<li>OffsetBaseIndex는 모든 자체 개발 인덱스의 베이스 클래스입니다. 인덱스 파일에는 벡터 ID만 저장됩니다. 그 결과 128차원 벡터의 인덱스 파일 크기를 두 배로 줄일 수 있습니다. 벡터 유사도 검색에 이러한 유형의 인덱스를 사용할 때는 원본 벡터도 함께 고려하는 것이 좋습니다.</li>
</ul>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/IDMAP_8773a4511c.png" alt="IDMAP" class="doc-image" id="idmap" />
   </span> <span class="img-wrapper"> <span>IDMAP</span> </span></p>
<p>엄밀히 말하면 <a href="https://github.com/facebookresearch/faiss/wiki/Guidelines-to-choose-an-index#then-flat">IDMAP은</a> 인덱스가 아니라 무차별 대입 검색에 사용됩니다. 벡터가 벡터 데이터베이스에 삽입되면 데이터 트레이닝과 인덱스 구축이 필요하지 않습니다. 검색은 삽입된 벡터 데이터에서 바로 수행됩니다.</p>
<p>그러나 코드 일관성을 위해 IDMAP은 모든 가상 인터페이스가 포함된 VecIndex 클래스에서도 상속됩니다. IDMAP의 사용법은 다른 인덱스와 동일합니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/IVF_42b0f123d1.png" alt="IVF" class="doc-image" id="ivf" />
   </span> <span class="img-wrapper"> <span>IVF</span> </span></p>
<p>IVF(반전 파일) 인덱스는 가장 자주 사용됩니다. IVF 클래스는 VecIndex와 FaissBaseIndex에서 파생되며, 더 나아가 IVFSQ와 IVFPQ로 확장됩니다. GPUIVF는 GPUIndex와 IVF에서 파생됩니다. 그런 다음 GPUIVF는 GPUIVFSQ 및 GPUIVFPQ로 더 확장됩니다.</p>
<p>IVFSQHybrid는 자체 개발한 하이브리드 인덱스를 위한 클래스로 GPU에서 거친 양자화를 통해 실행됩니다. 그리고 버킷에서의 검색은 CPU에서 실행됩니다. 이러한 유형의 인덱스는 GPU의 연산 능력을 활용하여 CPU와 GPU 간의 메모리 복사 발생을 줄일 수 있습니다. IVFSQHybrid는 GPUIVFSQ와 동일한 리콜률을 가지지만 더 나은 성능을 제공합니다.</p>
<p>바이너리 인덱스의 베이스 클래스 구조는 상대적으로 더 간단합니다. BinaryIDMAP과 BinaryIVF는 FaissBaseBinaryIndex와 VecIndex에서 파생됩니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/third_party_index_34ad029848.png" alt="third-party index" class="doc-image" id="third-party-index" />
   </span> <span class="img-wrapper"> <span>서드파티 인덱스</span> </span></p>
<p>현재 Faiss를 제외하고 지원되는 타사 인덱스는 트리 기반 인덱스인 Annoy와 그래프 기반 인덱스인 HNSW의 두 가지 유형뿐입니다. 이 두 가지 일반적이고 자주 사용되는 서드파티 인덱스는 모두 VecIndex에서 파생된 것입니다.</p>
<h2 id="Adding-indexes-to-Knowhere" class="common-anchor-header">Knowhere에 인덱스 추가하기<button data-href="#Adding-indexes-to-Knowhere" class="anchor-icon" translate="no">
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
    </button></h2><p>Knowhere에 새 인덱스를 추가하려면 먼저 기존 인덱스를 참조하면 됩니다:</p>
<ul>
<li>양자화 기반 인덱스를 추가하려면 IVF_FLAT을 참조하세요.</li>
<li>그래프 기반 인덱스를 추가하려면 HNSW를 참조하세요.</li>
<li>트리 기반 인덱스를 추가하려면 Annoy를 참조하세요.</li>
</ul>
<p>기존 인덱스를 참조한 후, 아래 단계에 따라 Knowhere에 새 인덱스를 추가할 수 있습니다.</p>
<ol>
<li>새 인덱스의 이름을 <code translate="no">IndexEnum</code> 에 추가합니다. 데이터 유형은 문자열입니다.</li>
<li><code translate="no">ConfAdapter.cpp</code> 파일에서 새 인덱스에 데이터 유효성 검사를 추가합니다. 유효성 검사는 주로 데이터 학습 및 쿼리를 위한 매개변수의 유효성을 검사하기 위한 것입니다.</li>
<li>새 인덱스에 대한 새 파일을 만듭니다. 새 인덱스의 베이스 클래스에는 <code translate="no">VecIndex</code> 과 필요한 가상 인터페이스 <code translate="no">VecIndex</code> 가 포함되어야 합니다.</li>
<li><code translate="no">VecIndexFactory::CreateVecIndex()</code> 에 새 인덱스에 대한 인덱스 구축 로직을 추가합니다.</li>
<li><code translate="no">unittest</code> 디렉토리에 단위 테스트를 추가합니다.</li>
</ol>
<h2 id="About-the-Deep-Dive-Series" class="common-anchor-header">심층 분석 시리즈 소개<button data-href="#About-the-Deep-Dive-Series" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.0의 <a href="https://milvus.io/blog/2022-1-25-annoucing-general-availability-of-milvus-2-0.md">공식 출시 발표와</a> 함께, Milvus 아키텍처와 소스 코드에 대한 심도 있는 해석을 제공하기 위해 Milvus 심층 분석 블로그 시리즈를 기획했습니다. 이 블로그 시리즈에서 다루는 주제는 다음과 같습니다:</p>
<ul>
<li><a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md">Milvus 아키텍처 개요</a></li>
<li><a href="https://milvus.io/blog/deep-dive-2-milvus-sdk-and-api.md">API 및 Python SDK</a></li>
<li><a href="https://milvus.io/blog/deep-dive-3-data-processing.md">데이터 처리</a></li>
<li><a href="https://milvus.io/blog/deep-dive-4-data-insertion-and-data-persistence.md">데이터 관리</a></li>
<li><a href="https://milvus.io/blog/deep-dive-5-real-time-query.md">실시간 쿼리</a></li>
<li><a href="https://milvus.io/blog/deep-dive-7-query-expression.md">스칼라 실행 엔진</a></li>
<li><a href="https://milvus.io/blog/deep-dive-6-oss-qa.md">QA 시스템</a></li>
<li><a href="https://milvus.io/blog/deep-dive-8-knowhere.md">벡터 실행 엔진</a></li>
</ul>
