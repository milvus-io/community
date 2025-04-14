---
id: >-
  introducing-the-milvus-sizing-tool-calculating-and-optimizing-your-milvus-deployment-resources.md
title: 'Milvus 사이징 도구를 소개합니다: Milvus 배포 리소스 계산 및 최적화하기'
author: 'Ken Zhang, Fendy Feng'
date: 2025-04-11T00:00:00.000Z
desc: 사용자 친화적인 사이징 도구로 Milvus 성능을 극대화하세요! 최적의 리소스 사용과 비용 절감을 위해 배포를 구성하는 방법을 알아보세요.
cover: assets.zilliz.com/Introducing_Milvus_Sizing_Tool_c0c98343a2.png
tag: Tutorials
recommend: false
canonicalUrl: 'https://zilliz.com/blog/demystify-milvus-sizing-tool'
---
<h2 id="Introduction" class="common-anchor-header">소개<button data-href="#Introduction" class="anchor-icon" translate="no">
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
    </button></h2><p>성능 최적화, 효율적인 리소스 활용, 비용 관리를 위해서는 Milvus 배포를 위한 최적의 구성을 선택하는 것이 중요합니다. 프로토타입을 구축하든 프로덕션 배포를 계획하든, Milvus 인스턴스의 크기를 적절히 설정하는 것은 원활하게 실행되는 벡터 데이터베이스와 성능에 문제가 있거나 불필요한 비용이 발생하는 데이터베이스의 차이를 의미할 수 있습니다.</p>
<p>이 프로세스를 간소화하기 위해 특정 요구 사항에 따라 권장 리소스 추정치를 생성하는 사용자 친화적인 계산기인 <a href="https://milvus.io/tools/sizing">Milvus 사이징 도구를</a> 개선했습니다. 이 가이드에서는 도구 사용 방법을 안내하고 Milvus 성능에 영향을 미치는 요인에 대한 심층적인 인사이트를 제공합니다.</p>
<h2 id="How-to-Use-the-Milvus-Sizing-Tool" class="common-anchor-header">Milvus 사이징 도구 사용 방법<button data-href="#How-to-Use-the-Milvus-Sizing-Tool" class="anchor-icon" translate="no">
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
    </button></h2><p>이 사이징 도구는 매우 쉽게 사용할 수 있습니다. 다음 단계를 따르기만 하면 됩니다.</p>
<ol>
<li><p><a href="https://milvus.io/tools/sizing/"> Milvus 사이징 도구</a> 페이지를 방문합니다.</p></li>
<li><p>주요 매개변수를 입력합니다:</p>
<ul>
<li><p>벡터 수 및 벡터당 치수</p></li>
<li><p>인덱스 유형</p></li>
<li><p>스칼라 필드 데이터 크기</p></li>
<li><p>세그먼트 크기</p></li>
<li><p>선호하는 배포 모드</p></li>
</ul></li>
<li><p>생성된 리소스 권장 사항 검토</p></li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/milvus_sizing_tool_3ca881b3d5.jpeg" alt="milvus sizing tool" class="doc-image" id="milvus-sizing-tool" />
   </span> <span class="img-wrapper"> <span>Milvus 크기 조정 도구</span> </span></p>
<p>이러한 각 매개변수가 Milvus 배포에 어떤 영향을 미치는지 살펴보겠습니다.</p>
<h2 id="Index-Selection-Balancing-Storage-Cost-Accuracy-and-Speed" class="common-anchor-header">인덱스 선택: 스토리지, 비용, 정확도, 속도 간의 균형 맞추기<button data-href="#Index-Selection-Balancing-Storage-Cost-Accuracy-and-Speed" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus는 메모리 사용량, 디스크 공간 요구 사항, 쿼리 속도 및 검색 정확도 면에서 각각 뚜렷한 장단점을 지닌 <a href="https://zilliz.com/learn/hierarchical-navigable-small-worlds-HNSW">HNSW</a>, FLAT, IVF_FLAT, IVF_SQ8, <a href="https://zilliz.com/learn/what-is-scann-scalable-nearest-neighbors-google">ScaNN</a>, <a href="https://zilliz.com/learn/DiskANN-and-the-Vamana-Algorithm">DiskANN</a> 등 다양한 인덱스 알고리즘을 제공합니다.</p>
<p>가장 일반적인 옵션에 대해 알아야 할 사항은 다음과 같습니다:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/index_dde661d579.jpeg" alt="index" class="doc-image" id="index" />
   </span> <span class="img-wrapper"> <span>index</span> </span></p>
<p>HNSW(계층적 탐색 가능한 작은 세계)</p>
<ul>
<li><p><strong>아키텍처</strong>: 건너뛰기 목록과 탐색 가능한 작은 세계(NSW) 그래프를 계층적 구조로 결합합니다.</p></li>
<li><p><strong>성능</strong>: 매우 빠른 쿼리 속도와 뛰어난 리콜률</p></li>
<li><p><strong>리소스 사용량</strong>: 벡터당 가장 많은 메모리 필요(가장 높은 비용)</p></li>
<li><p><strong>최상의 용도</strong>: 속도와 정확도가 중요하고 메모리 제약이 덜 중요한 애플리케이션</p></li>
<li><p><strong>기술 참고</strong>: 검색은 노드가 가장 적은 최상위 레이어에서 시작하여 점점 더 밀도가 높은 레이어를 통해 아래쪽으로 이동합니다.</p></li>
</ul>
<p>FLAT</p>
<ul>
<li><p><strong>아키텍처</strong>: 근사치가 없는 간단한 완전 검색</p></li>
<li><p><strong>성능</strong>: 100% 리콜은 가능하지만 쿼리 시간은 매우 느립니다(데이터 크기의 경우<code translate="no">O(n)</code>, <code translate="no">n</code>).</p></li>
<li><p><strong>리소스 사용량</strong>: 인덱스 크기는 원시 벡터 데이터 크기와 같음</p></li>
<li><p><strong>최상의 대상</strong>: 최적 대상: 소규모 데이터 세트 또는 완벽한 리콜이 필요한 애플리케이션</p></li>
<li><p><strong>기술 노트</strong>: 쿼리 벡터와 데이터베이스의 모든 벡터 간에 완전한 거리 계산을 수행합니다.</p></li>
</ul>
<p>IVF_FLAT</p>
<ul>
<li><p><strong>아키텍처</strong>: 보다 효율적인 검색을 위해 벡터 공간을 클러스터로 분할합니다.</p></li>
<li><p><strong>성능</strong>: 중간 정도의 높은 리콜률과 적당한 쿼리 속도(HNSW보다는 느리지만 FLAT보다는 빠름)</p></li>
<li><p><strong>리소스 사용량</strong>: FLAT보다는 적은 메모리가 필요하지만 HNSW보다는 많은 메모리 필요</p></li>
<li><p><strong>최상의 용도</strong>: 더 나은 성능을 위해 일부 리콜을 희생할 수 있는 균형 잡힌 애플리케이션</p></li>
<li><p><strong>기술 참고</strong>: 검색 중에는 <code translate="no">nlist</code> 클러스터만 검사하여 계산을 크게 줄입니다.</p></li>
</ul>
<p>IVF_SQ8</p>
<ul>
<li><p><strong>아키텍처</strong>: IVF_FLAT에 스칼라 양자화를 적용하여 벡터 데이터를 압축합니다.</p></li>
<li><p><strong>성능</strong>: 중간 정도의 쿼리 속도와 중간 정도의 리콜 속도</p></li>
<li><p><strong>리소스 사용량</strong>: 디스크, 컴퓨팅, 메모리 사용량 IVF_FLAT 대비 70~75% 감소</p></li>
<li><p><strong>최상의 대상</strong>: 정확도가 약간 저하될 수 있는 리소스 제약이 있는 환경</p></li>
<li><p><strong>기술 참고</strong>: 32비트 부동 소수점 값을 8비트 정수 값으로 압축합니다.</p></li>
</ul>
<h3 id="Advanced-Index-Options-ScaNN-DiskANN-CAGRA-and-more" class="common-anchor-header">고급 인덱스 옵션: ScaNN, DiskANN, CAGRA 등</h3><p>특별한 요구 사항이 있는 개발자를 위해 Milvus는 다음과 같은 옵션도 제공합니다:</p>
<ul>
<li><p><a href="https://zilliz.com/learn/what-is-scann-scalable-nearest-neighbors-google"><strong>ScaNN</strong></a>: 비슷한 리콜률로 HNSW보다 CPU에서 20% 더 빠릅니다.</p></li>
<li><p><a href="https://milvus.io/docs/disk_index.md"><strong>DiskANN</strong></a>: 높은 리콜률로 많은 수의 벡터를 지원해야 하고 약간 긴 지연 시간(~100ms)을 허용할 수 있는 경우에 이상적인 하이브리드 디스크/메모리 인덱스입니다. 인덱스의 일부만 메모리에 보관하고 나머지는 디스크에 유지함으로써 메모리 사용량과 성능의 균형을 맞춥니다.</p></li>
<li><p><strong>GPU 기반 인덱스</strong>:</p>
<ul>
<li><p><a href="https://zilliz.com/blog/Milvus-introduces-GPU-index-CAGRA">GPU_CAGRA</a>: GPU 인덱스 중 가장 빠르지만, HBM 메모리가 있는 추론 카드가 아닌 GDDR 메모리가 있는 추론 카드가 필요합니다.</p></li>
<li><p>gpu_brute_force: GPU에서 구현된 철저한 검색</p></li>
<li><p>GPU_IVF_FLAT: IVF_FLAT의 GPU 가속 버전</p></li>
<li><p>GPU_IVF_PQ: <a href="https://zilliz.com/learn/harnessing-product-quantization-for-memory-efficiency-in-vector-databases">제품 정량화가</a> 포함된 IVF의 GPU 가속 버전</p></li>
</ul></li>
<li><p><strong>HNSW-PQ/SQ/PRQ</strong>:</p>
<ul>
<li><p><strong>HNSW_SQ</strong>: 매우 빠른 쿼리, 제한된 메모리 리소스, 리콜 속도에서 약간의 타협을 허용합니다.</p></li>
<li><p><strong>HNSW_PQ</strong>: 중간 속도의 쿼리, 매우 제한된 메모리 리소스, 리콜 속도에서 약간의 성능 저하 허용</p></li>
<li><p><strong>HNSW_PRQ</strong>: 중간 속도 쿼리, 매우 제한된 메모리 리소스, 리콜 속도에서 약간의 성능 저하 허용</p></li>
<li><p><strong>자동 인덱스</strong>: 오픈 소스 Milvus의 기본값은 HNSW입니다(또는 관리형 Milvus인 <a href="https://zilliz.com/cloud">Zilliz Cloud에서</a> 더 높은 성능의 독점 인덱스를 사용).</p></li>
</ul></li>
<li><p><strong>바이너리, 스파스 및 기타 특수 인덱스</strong>: 특정 데이터 유형 및 사용 사례에 적합합니다. 자세한 내용은 <a href="https://milvus.io/docs/index.md">이 인덱스 문서 페이지를</a> 참조하세요.</p></li>
</ul>
<h2 id="Segment-Size-and-Deployment-Configuration" class="common-anchor-header">세그먼트 크기 및 배포 구성<button data-href="#Segment-Size-and-Deployment-Configuration" class="anchor-icon" translate="no">
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
    </button></h2><p>세그먼트는 Milvus 내부 데이터 조직의 기본 구성 요소입니다. 세그먼트는 배포 전반에 걸쳐 분산 검색 및 로드 밸런싱을 가능하게 하는 데이터 청크 역할을 합니다. 이 Milvus 크기 조정 도구는 세 가지 세그먼트 크기 옵션(512MB, 1024MB, 2048MB)을 제공하며, 기본값은 1024MB입니다.</p>
<p>성능 최적화를 위해서는 세그먼트를 이해하는 것이 중요합니다. 일반적인 가이드라인은 다음과 같습니다:</p>
<ul>
<li><p>512MB 세그먼트: 4~8GB 메모리를 사용하는 쿼리 노드에 가장 적합합니다.</p></li>
<li><p>1GB 세그먼트: 8~16GB 메모리를 사용하는 쿼리 노드에 최적</p></li>
<li><p>2GB 세그먼트: 메모리가 16GB를 초과하는 쿼리 노드에 권장됨</p></li>
</ul>
<p>개발자 인사이트: 일반적으로 더 적은 수의 더 큰 세그먼트가 더 빠른 검색 성능을 제공합니다. 대규모 배포의 경우 2GB 세그먼트가 메모리 효율성과 쿼리 속도 간에 최상의 균형을 제공하는 경우가 많습니다.</p>
<h2 id="Message-Queue-System-Selection" class="common-anchor-header">메시지 큐 시스템 선택<button data-href="#Message-Queue-System-Selection" class="anchor-icon" translate="no">
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
    </button></h2><p>메시징 시스템으로 Pulsar와 Kafka 중 하나를 선택할 때 고려해야 할 사항입니다:</p>
<ul>
<li><p><strong>Pulsar</strong>: 주제당 오버헤드가 낮고 확장성이 뛰어나므로 새 프로젝트에 권장됩니다.</p></li>
<li><p><strong>Kafka</strong>: 조직에 이미 카프카에 대한 전문 지식이나 인프라가 있는 경우 선호할 수 있습니다.</p></li>
</ul>
<h2 id="Enterprise-Optimizations-in-Zilliz-Cloud" class="common-anchor-header">질리즈 클라우드의 엔터프라이즈 최적화<button data-href="#Enterprise-Optimizations-in-Zilliz-Cloud" class="anchor-icon" translate="no">
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
    </button></h2><p>엄격한 성능 요구 사항이 있는 프로덕션 배포의 경우, Zilliz Cloud(클라우드 상의 Milvus의 완전 관리형 엔터프라이즈 버전)는 인덱싱 및 정량화에서 추가적인 최적화 기능을 제공합니다:</p>
<ul>
<li><p><strong>메모리 부족(OOM) 방지:</strong> 정교한 메모리 관리로 메모리 부족 충돌을 방지합니다.</p></li>
<li><p><strong>압축 최적화</strong>: 검색 성능 및 리소스 활용도 향상</p></li>
<li><p><strong>계층형 스토리지</strong>: 적절한 컴퓨팅 유닛으로 핫 데이터와 콜드 데이터의 효율적인 관리</p>
<ul>
<li><p>자주 액세스하는 데이터를 위한 표준 컴퓨트 유닛(CU)</p></li>
<li><p>거의 액세스하지 않는 데이터를 비용 효율적으로 저장하기 위한 계층형 스토리지 CU</p></li>
</ul></li>
</ul>
<p>자세한 기업용 사이징 옵션은<a href="https://docs.zilliz.com/docs/select-zilliz-cloud-service-plans"> 질리즈 클라우드 서비스 요금제 설명서를</a> 참조하세요.</p>
<h2 id="Advanced-Configuration-Tips-for-Developers" class="common-anchor-header">개발자를 위한 고급 설정 팁<button data-href="#Advanced-Configuration-Tips-for-Developers" class="anchor-icon" translate="no">
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
    </button></h2><ol>
<li><p><strong>다양한 인덱스 유형</strong>: 사이징 도구는 단일 인덱스에 초점을 맞춥니다. 다양한 컬렉션에 대해 서로 다른 인덱스 알고리즘이 필요한 복잡한 애플리케이션의 경우, 사용자 지정 구성을 통해 별도의 컬렉션을 생성하세요.</p></li>
<li><p><strong>메모리 할당</strong>: 배포를 계획할 때 벡터 데이터와 인덱스 메모리 요구 사항을 모두 고려하세요. HNSW는 일반적으로 원시 벡터 데이터의 2~3배의 메모리를 필요로 합니다.</p></li>
<li><p><strong>성능 테스트</strong>: 구성을 마무리하기 전에 대표적인 데이터 세트에서 특정 쿼리 패턴을 벤치마킹하세요.</p></li>
<li><p><strong>확장 고려 사항</strong>: 향후 성장을 고려하세요. 나중에 다시 구성하는 것보다 약간 더 많은 리소스로 시작하는 것이 더 쉽습니다.</p></li>
</ol>
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
    </button></h2><p><a href="https://milvus.io/tools/sizing/"> Milvus 사이징 도구는</a> 리소스 계획을 위한 훌륭한 출발점을 제공하지만, 모든 애플리케이션에는 고유한 요구 사항이 있다는 점을 기억하세요. 최적의 성능을 위해서는 특정 워크로드 특성, 쿼리 패턴, 확장 요구사항에 따라 구성을 미세 조정해야 합니다.</p>
<p>저희는 사용자 피드백을 바탕으로 도구와 설명서를 지속적으로 개선하고 있습니다. Milvus 배포 규모를 조정하는 데 궁금한 점이 있거나 추가 지원이 필요한 경우,<a href="https://github.com/milvus-io/milvus/discussions"> GitHub</a> 또는<a href="https://discord.com/invite/8uyFbECzPX"> Discord의</a> 커뮤니티에 문의하세요.</p>
<h2 id="References" class="common-anchor-header">참고 자료<button data-href="#References" class="anchor-icon" translate="no">
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
    </button></h2><ul>
<li><p><a href="https://thesequence.substack.com/p/guest-post-choosing-the-right-vector">📝 프로젝트에 적합한 벡터 인덱스 선택하기</a></p></li>
<li><p><a href="https://milvus.io/docs/index.md?tab=floating">인메모리 인덱스 | Milvus 문서</a></p></li>
<li><p><a href="https://zilliz.com/blog/Milvus-introduces-GPU-index-CAGRA">Milvus CAGRA 공개: GPU 인덱싱을 통한 벡터 검색의 향상</a></p></li>
<li><p><a href="https://zilliz.com/pricing#estimate_your_cost">질리즈 클라우드 가격 계산기</a></p></li>
<li><p><a href="https://milvus.io/blog/how-to-get-started-with-milvus.md">Milvus 시작하기 </a></p></li>
<li><p><a href="https://docs.zilliz.com/docs/resource-planning">질리즈 클라우드 리소스 플래닝 | 클라우드 | 질리즈 클라우드 개발자 허브</a></p></li>
</ul>
