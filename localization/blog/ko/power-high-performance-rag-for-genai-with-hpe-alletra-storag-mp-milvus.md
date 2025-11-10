---
id: power-high-performance-rag-for-genai-with-hpe-alletra-storag-mp-milvus.md
title: HPE Alletra 스토리지 MP + Milvus로 GenAI를 위한 고성능 RAG 지원
author: Denise Ochoa-Mendoza
date: 2025-11-10T00:00:00.000Z
cover: assets.zilliz.com/hpe_cover_45b4796ef3.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus, HPE, Alletra Storage MP X10000, vector database, RAG'
meta_title: Optimized RAG with HPE Alletra Storage MP X10000 + Milvus
desc: >-
  HPE Alletra 스토리지 MP X10000 및 Milvus로 GenAI를 강화하세요. 빠르고 안전한 RAG를 위해 확장 가능하고 지연
  시간이 짧은 벡터 검색과 엔터프라이즈급 스토리지를 확보하세요.
origin: >-
  https://community.hpe.com/t5/around-the-storage-block/power-high-performance-rag-for-genai-with-hpe-alletra-storage-mp/ba-p/7257369
---
<p><em>이 게시물은 원래 <a href="https://community.hpe.com/t5/around-the-storage-block/power-high-performance-rag-for-genai-with-hpe-alletra-storage-mp/ba-p/7257369">HPE 커뮤니티에</a> 게시되었으며 허가를 받아 여기에 다시 게시되었습니다.</em></p>
<p>HPE Alletra Storage MP X10000 및 Milvus는 확장 가능하고 지연 시간이 짧은 RAG를 지원하여 LLM이 GenAI 워크로드를 위한 고성능 벡터 검색을 통해 정확하고 컨텍스트가 풍부한 응답을 제공할 수 있도록 합니다.</p>
<h2 id="In-generative-AI-RAG-needs-more-than-just-an-LLM" class="common-anchor-header">제너레이티브 AI에서 RAG는 단순한 LLM 이상의 기능을 필요로 합니다.<button data-href="#In-generative-AI-RAG-needs-more-than-just-an-LLM" class="anchor-icon" translate="no">
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
    </button></h2><p>컨텍스트는 생성형 AI(GenAI)와 대규모 언어 모델(LLM)의 진정한 힘을 발휘합니다. LLM에 응답 방향에 대한 올바른 신호가 있으면 정확하고 관련성이 높으며 신뢰할 수 있는 답변을 제공할 수 있습니다.</p>
<p>GPS 기기는 있지만 위성 신호가 없는 울창한 정글에 떨어졌다고 생각해 보세요. 화면에 지도가 표시되지만 현재 위치가 없으면 내비게이션에 쓸모가 없습니다. 반대로 위성 신호가 강한 GPS는 단순히 지도만 표시하는 것이 아니라 턴바이턴 안내를 제공합니다.</p>
<p>이것이 바로 검색 증강 생성(RAG)이 LLM을 위해 하는 일입니다. 모델에는 이미 지도(사전 학습된 지식)는 있지만 방향(도메인별 데이터)은 없습니다. RAG가 없는 LLM은 지식은 가득하지만 실시간 방향이 없는 GPS 장치와 같습니다. RAG는 모델이 현재 어디에 있고 어디로 가야 하는지 알려주는 신호를 제공합니다.</p>
<p>RAG는 정책, 제품 문서, 티켓, PDF, 코드, 오디오 트랜스크립트, 이미지 등의 도메인별 콘텐츠에서 가져온 신뢰할 수 있는 최신 지식을 바탕으로 모델 응답의 근거를 마련합니다. RAG를 대규모로 작동시키는 것은 쉽지 않습니다. 검색 프로세스는 사용자 경험을 원활하게 유지할 수 있을 만큼 빠르고, 가장 관련성 높은 정보를 반환할 수 있을 만큼 정확해야 하며, 시스템이 과부하 상태일 때에도 예측 가능해야 합니다. 즉, 대량의 쿼리, 지속적인 데이터 수집, 인덱스 구축과 같은 백그라운드 작업을 성능 저하 없이 처리해야 합니다. 몇 개의 PDF로 RAG 파이프라인을 가동하는 것은 비교적 간단합니다. 하지만 수백 개의 PDF로 확장하면 훨씬 더 어려워집니다. 모든 것을 메모리에 보관할 수는 없으므로 임베딩, 인덱스, 검색 성능을 관리하기 위해서는 강력하고 효율적인 스토리지 전략이 필수적입니다. RAG에는 동시성 및 데이터 볼륨이 증가함에 따라 보조를 맞출 수 있는 벡터 데이터베이스와 스토리지 계층이 필요합니다.</p>
<h2 id="Vector-databases-power-RAG" class="common-anchor-header">RAG를 지원하는 벡터 데이터베이스<button data-href="#Vector-databases-power-RAG" class="anchor-icon" translate="no">
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
    </button></h2><p>RAG의 핵심은 정확한 키워드가 아닌 의미로 정보를 찾는 시맨틱 검색입니다. 바로 여기에 벡터 데이터베이스가 등장합니다. 벡터 데이터베이스는 텍스트, 이미지 및 기타 비정형 데이터의 고차원 임베딩을 저장하여 쿼리와 가장 관련성이 높은 컨텍스트를 검색하는 유사성 검색을 가능하게 합니다. 대표적인 예로 10억 개 규모의 유사도 검색을 위해 구축된 클라우드 네이티브 오픈 소스 벡터 데이터베이스인 Milvus가 있습니다. 이 데이터베이스는 벡터 유사도와 키워드 및 스칼라 필터를 결합하여 정밀도를 높이는 하이브리드 검색을 지원하며, 가속화를 위한 GPU 인식 최적화 옵션을 통해 컴퓨팅 및 스토리지의 독립적인 확장을 제공합니다. 또한 Milvus는 스마트 세그먼트 수명 주기를 통해 데이터를 관리하며, 압축과 HNSW 및 DiskANN과 같은 여러 근사 근사 이웃(ANN) 인덱싱 옵션을 통해 증가하는 세그먼트에서 봉인된 세그먼트로 이동하여 RAG와 같은 실시간 AI 워크로드를 위한 성능과 확장성을 보장합니다.</p>
<h2 id="The-hidden-challenge-Storage-throughput--latency" class="common-anchor-header">숨겨진 과제: 스토리지 처리량 및 레이턴시<button data-href="#The-hidden-challenge-Storage-throughput--latency" class="anchor-icon" translate="no">
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
    </button></h2><p>벡터 검색 워크로드는 시스템의 모든 부분에 부담을 줍니다. 대화형 쿼리를 위해 지연 시간이 짧은 검색을 유지하면서 동시에 높은 동시성 수집을 요구합니다. 동시에 인덱스 구축, 압축, 데이터 재로드와 같은 백그라운드 작업은 라이브 성능을 방해하지 않고 실행되어야 합니다. 기존 아키텍처의 많은 성능 병목 현상은 스토리지로 거슬러 올라갑니다. 입출력(I/O) 제한, 메타데이터 조회 지연, 동시성 제약 등이 바로 그것입니다. 예측 가능한 실시간 성능을 대규모로 제공하려면 스토리지 계층이 벡터 데이터베이스의 요구사항에 발맞춰야 합니다.</p>
<h2 id="The-storage-foundation-for-high-performance-vector-search" class="common-anchor-header">고성능 벡터 검색을 위한 스토리지 기반<button data-href="#The-storage-foundation-for-high-performance-vector-search" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://www.hpe.com/in/en/alletra-storage-mp-x10000.html">HPE Alletra Storage MP X10000은</a> 대규모 실시간 성능을 위해 설계된 플래시 최적화, 올-NVMe, S3 호환 오브젝트 스토리지 플랫폼입니다. 기존의 용량 중심 오브젝트 스토어와 달리, HPE Alletra Storage MP X10000은 벡터 검색과 같이 지연 시간이 짧고 처리량이 많은 워크로드에 적합하도록 설계되었습니다. 로그 구조의 키-값 엔진과 범위 기반 메타데이터를 통해 고도의 병렬 읽기 및 쓰기가 가능하며, GPUDirect RDMA는 제로 카피 데이터 경로를 제공하여 CPU 오버헤드를 줄이고 GPU로의 데이터 이동을 가속화합니다. 이 아키텍처는 분리형 확장을 지원하여 용량과 성능을 독립적으로 확장할 수 있으며 암호화, 역할 기반 액세스 제어(RBAC), 불변성, 데이터 내구성과 같은 엔터프라이즈급 기능을 포함하고 있습니다. 클라우드 네이티브 설계와 결합된 HPE Alletra Storage MP X10000은 Kubernetes 환경과 원활하게 통합되므로 Milvus 배포에 이상적인 스토리지 기반이 됩니다.</p>
<h2 id="HPE-Alletra-Storage-MP-X10000-and-Milvus-A-scalable-foundation-for-RAG" class="common-anchor-header">HPE Alletra Storage MP X10000과 Milvus: RAG를 위한 확장 가능한 기반<button data-href="#HPE-Alletra-Storage-MP-X10000-and-Milvus-A-scalable-foundation-for-RAG" class="anchor-icon" translate="no">
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
    </button></h2><p>HPE Alletra Storage MP X10000과 Milvus는 서로를 보완하여 빠르고 예측 가능하며 확장하기 쉬운 RAG를 제공합니다. 그림 1은 확장 가능한 AI 사용 사례와 RAG 파이프라인의 아키텍처를 보여 주며, 컨테이너화된 환경에 배포된 Milvus 구성 요소가 HPE Alletra Storage MP X10000의 고성능 오브젝트 스토리지와 상호 작용하는 방식을 보여줍니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_1_Architecture_of_scalable_AI_use_cases_and_RAG_pipeline_using_HPE_Alletra_Storage_MP_X10000_and_Milvus_ed3a87a5ee.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Milvus는 컴퓨팅과 스토리지를 깔끔하게 분리하는 반면, HPE Alletra Storage MP X10000은 벡터 워크로드에 맞춰 높은 처리량과 짧은 지연 시간을 제공하는 오브젝트 액세스를 제공합니다. 이 두 제품을 함께 사용하면 예측 가능한 스케일아웃 성능을 구현할 수 있습니다: Milvus는 쿼리를 여러 샤드에 분산하고, HPE Alletra Storage MP X10000의 부분적 다차원 확장은 데이터와 QPS가 증가함에 따라 지연 시간을 일관되게 유지합니다. 간단히 말해, 필요할 때 필요한 용량이나 성능을 정확하게 추가할 수 있습니다. 운영 간소화는 또 다른 장점입니다. HPE Alletra Storage MP X10000은 단일 버킷에서 최대 성능을 유지하므로 복잡한 계층화가 필요 없으며, 엔터프라이즈 기능(암호화, RBAC, 불변성, 견고한 내구성)은 강력한 데이터 주권과 일관된 서비스 수준 목표(SLO)로 온프레미스 또는 하이브리드 배포를 지원합니다.</p>
<p>벡터 검색이 확장되면 스토리지가 느린 수집, 압축 또는 검색의 원인으로 지목되는 경우가 많습니다. HPE Alletra Storage MP X10000의 Milvus를 사용하면 이야기가 달라집니다. 이 플랫폼의 올-NVMe, 로그 구조화 아키텍처와 GPUDirect RDMA 옵션은 동시 접속이 많은 상황이나 인덱스 구축 및 재로드와 같은 수명주기 작업 중에도 일관되고 지연 시간이 매우 짧은 오브젝트 액세스를 제공합니다. 실제로, RAG 파이프라인은 스토리지에 종속되지 않고 컴퓨팅에 종속된 상태로 유지됩니다. 컬렉션이 증가하고 쿼리 볼륨이 급증하더라도 Milvus는 응답성을 유지하면서 HPE Alletra Storage MP X10000은 I/O 헤드룸을 보존하여 스토리지 재설계 없이 예측 가능한 선형 확장성을 구현합니다. 이는 RAG 배포가 초기 개념 증명 단계를 넘어 전체 프로덕션 단계로 확장될 때 특히 중요합니다.</p>
<h2 id="Enterprise-ready-RAG-Scalable-predictable-and-built-for-GenAI" class="common-anchor-header">엔터프라이즈급 RAG: 확장성, 예측 가능성, GenAI를 위한 구축<button data-href="#Enterprise-ready-RAG-Scalable-predictable-and-built-for-GenAI" class="anchor-icon" translate="no">
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
    </button></h2><p>RAG 및 실시간 GenAI 워크로드의 경우, HPE Alletra Storage MP X10000과 Milvus의 조합은 자신 있게 확장할 수 있는 미래 대비 기반을 제공합니다. 이 통합 솔루션을 통해 조직은 성능이나 관리 효율성의 저하 없이 빠르고 탄력적이며 안전한 인텔리전트 시스템을 구축할 수 있습니다. Milvus는 모듈식 확장을 통해 분산형 GPU 가속 벡터 검색을 제공하며, HPE Alletra Storage MP X10000은 엔터프라이즈급 내구성 및 수명주기 관리로 초고속, 저지연 오브젝트 액세스를 보장합니다. 이 두 제품은 컴퓨팅과 스토리지를 분리하여 데이터 볼륨과 쿼리 복잡성이 증가하더라도 예측 가능한 성능을 제공합니다. 실시간 추천을 제공하든, 시맨틱 검색을 지원하든, 수십억 개의 벡터에 걸쳐 확장하든, 이 아키텍처는 RAG 파이프라인의 응답성과 비용 효율성을 유지하며 클라우드에 최적화되어 있습니다. Kubernetes 및 HPE GreenLake 클라우드와의 원활한 통합을 통해 통합 관리, 사용량 기반 가격 책정, 하이브리드 또는 프라이빗 클라우드 환경 전반에 배포할 수 있는 유연성을 확보할 수 있습니다. HPE Alletra Storage MP X10000 및 Milvus: 최신 GenAI의 요구 사항을 위해 구축된 확장 가능한 고성능 RAG 솔루션입니다.</p>
