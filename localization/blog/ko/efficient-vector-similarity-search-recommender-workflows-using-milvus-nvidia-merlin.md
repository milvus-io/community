---
id: >-
  efficient-vector-similarity-search-recommender-workflows-using-milvus-nvidia-merlin.md
title: 추천 워크플로우의 효율적인 벡터 유사도 검색을 위해 Milvus와 NVIDIA Merlin을 사용한 추천 워크플로
author: Burcin Bozkaya
date: 2023-12-15T00:00:00.000Z
desc: 추천 시스템을 구축하고 다양한 시나리오에서 성능을 벤치마킹하는 데 있어 NVIDIA Merlin과 Milvus의 통합을 소개합니다.
cover: assets.zilliz.com/nvidia_4921837ca6.png
tag: Engineering
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Vector Management, NVIDIA, Merlin
recommend: true
canonicalUrl: >-
  https://zilliz.com/blog/efficient-vector-similarity-search-recommender-workflows-using-milvus-nvidia-merlin
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/nvidia_4921837ca6.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>이 게시물은 <a href="https://medium.com/nvidia-merlin/efficient-vector-similarity-search-in-recommender-workflows-using-milvus-with-nvidia-merlin-84d568290ee4">NVIDIA Merlin의 Medium 채널에</a> 처음 게시되었으며, 허가를 받아 여기에 편집 및 재게시되었습니다. 이 글은 NVIDIA의 <a href="https://medium.com/u/743df9db1666?source=post_page-----84d568290ee4--------------------------------">Burcin Bozkaya와</a> <a href="https://medium.com/u/279d4c25a145?source=post_page-----84d568290ee4--------------------------------">William Hicks</a>, Zilliz의 <a href="https://medium.com/u/3e8a3c67a8a5?source=post_page-----84d568290ee4--------------------------------">Filip Haltmayer와</a> <a href="https://github.com/liliu-z">Li Liu가</a> 공동으로 작성했습니다.</em></p>
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
    </button></h2><p>최신 추천 시스템(Recsys)은 여러 단계의 데이터 수집, 데이터 전처리, 모델 학습 및 관련 항목 검색, 필터링, 순위 지정 및 점수 매기기를 위한 하이퍼파라미터 조정이 포함된 학습/추론 파이프라인으로 구성됩니다. 추천 시스템 파이프라인의 필수 구성 요소는 특히 대규모 항목 카탈로그가 있는 경우 사용자와 가장 관련성이 높은 항목을 검색하거나 발견하는 것입니다. 이 단계에는 일반적으로 사용자와 제품/서비스 간의 상호 작용을 학습하는 딥러닝 모델에서 생성된 제품 및 사용자 속성의 저차원 벡터 표현(즉, 임베딩)의 색인화된 데이터베이스에 대한 <a href="https://zilliz.com/glossary/anns">근사 근사 이웃(ANN)</a> 검색이 포함됩니다.</p>
<p>엔드투엔드 모델을 훈련하여 모든 규모의 추천을 생성하기 위해 개발된 오픈 소스 프레임워크인<a href="https://github.com/NVIDIA-Merlin">NVIDIA Merlin은</a> 효율적인 <a href="https://zilliz.com/learn/what-is-vector-database">벡터 데이터베이스</a> 인덱스 및 검색 프레임워크와 통합됩니다. 최근 많은 관심을 받고 있는 프레임워크 중 하나는 <a href="https://zilliz.com/">Zilliz에서</a> 만든 오픈 소스 벡터 데이터베이스인 <a href="https://zilliz.com/what-is-milvus">Milvus입니다</a>. 이 프레임워크는 빠른 인덱스 및 쿼리 기능을 제공합니다. Milvus는 최근 AI 워크플로우를 유지하기 위해 NVIDIA GPU를 사용하는 <a href="https://zilliz.com/blog/getting-started-with-gpu-powered-milvus-unlocking-10x-higher-performance">GPU 가속 지원을</a> 추가했습니다. GPU 가속 지원은 가속화된 벡터 검색 라이브러리가 빠른 동시 쿼리를 가능하게 하여 개발자가 많은 동시 요청을 기대하는 오늘날의 추천 시스템에서 지연 시간 요구 사항에 긍정적인 영향을 미치기 때문에 매우 반가운 소식입니다. Milvus는 5백만 건 이상의 도커 풀, 2만 3천 개 이상의 별(2023년 9월 기준), 5,000개 이상의 엔터프라이즈 고객, 그리고 많은 애플리케이션의 핵심 구성 요소로 사용되고 있습니다(사용 <a href="https://medium.com/vector-database/tagged/use-cases-of-milvus">사례</a> 참조).</p>
<p>이 블로그에서는 교육 및 추론 시 Milvus가 Merlin Recsys 프레임워크와 어떻게 작동하는지 보여드립니다. Milvus가 항목 검색 단계에서 매우 효율적인 탑-k 벡터 임베딩 검색으로 Merlin을 보완하는 방법과 추론 단계에서 NVIDIA Triton 추론 서버(TIS)와 함께 사용하는 방법을 보여줍니다(그림 1 참조). <strong>벤치마크 결과에 따르면 Merlin 모델에서 생성된 벡터 임베딩과 함께 NVIDIA RAFT를 사용하는 GPU 가속 Milvus를 사용하면 37배에서 91배의 놀라운 속도 향상을 얻을 수 있습니다.</strong> Merlin-Milvus 통합을 보여주는 데 사용한 코드와 자세한 벤치마크 결과는 벤치마크 연구를 용이하게 한 <a href="https://github.com/zilliztech/VectorDBBench">라이브러리와</a> 함께 여기에서 확인할 수 있습니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Multistage_recommender_system_with_Milvus_ee891c4ad5.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>그림 1. 검색 단계에 기여하는 Milvus 프레임워크가 포함된 다단계 추천 시스템. 원본 다단계 그림의 출처: 이 <a href="https://medium.com/nvidia-merlin/recommender-systems-not-just-recommender-models-485c161c755e">블로그 게시물</a>.</em></p>
<h2 id="The-challenges-facing-recommenders" class="common-anchor-header">추천자가 직면한 과제<button data-href="#The-challenges-facing-recommenders" class="anchor-icon" translate="no">
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
    </button></h2><p>추천 시스템의 다단계 특성과 다양한 구성 요소 및 라이브러리의 가용성을 고려할 때, 엔드투엔드 파이프라인에서 모든 구성 요소를 원활하게 통합하는 것이 중요한 과제입니다. 저희는 예제 노트북을 통해 적은 노력으로 통합을 수행할 수 있다는 것을 보여드리고자 합니다.</p>
<p>추천 워크플로우의 또 다른 과제는 특정 파이프라인 부분을 가속화하는 것입니다. GPU는 대규모 신경망을 훈련하는 데 큰 역할을 하는 것으로 알려져 있지만, 벡터 데이터베이스와 인공신경망 검색에 추가된 것은 최근에 불과합니다. 이커머스 제품 인벤토리 또는 스트리밍 미디어 데이터베이스의 규모와 이러한 서비스를 사용하는 사용자 수가 증가함에 따라, CPU는 고성능 Recsys 워크플로우에서 수백만 명의 사용자에게 서비스를 제공하기 위해 필요한 성능을 제공해야 합니다. 이 문제를 해결하기 위해 다른 파이프라인 부분의 GPU 가속화가 필요해졌습니다. 이 블로그의 솔루션은 GPU를 사용할 때 ANN 검색이 효율적이라는 것을 보여줌으로써 이 문제를 해결합니다.</p>
<h2 id="Tech-stacks-for-the-solution" class="common-anchor-header">솔루션을 위한 기술 스택<button data-href="#Tech-stacks-for-the-solution" class="anchor-icon" translate="no">
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
    </button></h2><p>먼저 작업을 수행하는 데 필요한 몇 가지 기본 사항을 검토하는 것부터 시작하겠습니다.</p>
<ul>
<li><p>NVIDIA <a href="https://github.com/NVIDIA-Merlin/Merlin">Merlin</a>: NVIDIA GPU에서 추천을 가속화하는 하이레벨 API가 포함된 오픈 소스 라이브러리입니다.</p></li>
<li><p><a href="https://github.com/NVIDIA-Merlin/NVTabular">NVTabular</a>: 입력된 표 형식 데이터의 전처리 및 기능 엔지니어링에 사용됩니다.</p></li>
<li><p><a href="https://github.com/NVIDIA-Merlin/models">Merlin Models</a>: 딥러닝 모델을 학습하고, 이 경우 사용자 인터랙션 데이터에서 사용자 및 항목 임베딩 벡터를 학습하는 데 사용됩니다.</p></li>
<li><p><a href="https://github.com/NVIDIA-Merlin/systems">Merlin Systems</a>: TensorFlow 기반 추천 모델을 다른 요소(예: 기능 저장소, Milvus를 사용한 ANN 검색)와 결합하여 TIS와 함께 제공하기 위한 용도입니다.</p></li>
<li><p><a href="https://github.com/triton-inference-server/server">트리톤 추론 서버</a>: 사용자 특징 벡터가 전달되고 제품 추천이 생성되는 추론 단계에 사용됩니다.</p></li>
<li><p>컨테이너화: 위의 모든 기능은 NVIDIA가 <a href="https://catalog.ngc.nvidia.com/">NGC 카탈로그에서</a> 제공하는 컨테이너를 통해 사용할 수 있습니다. 저희는 <a href="https://catalog.ngc.nvidia.com/orgs/nvidia/teams/merlin/containers/merlin-tensorflow">여기에서</a> 제공되는 Merlin TensorFlow 23.06 컨테이너를 사용했습니다.</p></li>
<li><p><a href="https://github.com/milvus-io/milvus/releases/tag/v2.3.0">Milvus 2.3</a>: GPU 가속 벡터 인덱싱 및 쿼리를 수행하기 위해 사용되었습니다.</p></li>
<li><p><a href="https://github.com/milvus-io/milvus/releases">Milvus 2.2.11</a>: 위와 동일하지만 CPU에서 수행하기 위한 것입니다.</p></li>
<li><p><a href="https://zilliz.com/product/integrations/python">Pymilvus SDK</a>: Milvus 서버에 연결하고, 벡터 데이터베이스 인덱스를 생성하고, Python 인터페이스를 통해 쿼리를 실행하는 데 사용됩니다.</p></li>
<li><p><a href="https://github.com/feast-dev/feast">Feast</a>: 엔드투엔드 RecSys 파이프라인의 일부인 (오픈 소스) 기능 스토어에 사용자 및 항목 속성을 저장하고 검색하는 데 사용됩니다.</p></li>
</ul>
<p>내부적으로도 여러 가지 기본 라이브러리와 프레임워크가 사용됩니다. 예를 들어 Merlin은 cuDF 및 Dask와 같은 다른 NVIDIA 라이브러리를 사용하며, 이 라이브러리는 모두 <a href="https://github.com/rapidsai/cudf">RAPIDS cuDF에서</a> 사용할 수 있습니다. 마찬가지로 Milvus는 GPU 가속의 프리미티브에는 <a href="https://github.com/rapidsai/raft">NVIDIA RAFT를</a>, 검색에는 <a href="https://zilliz.com/learn/hierarchical-navigable-small-worlds-HNSW">HNSW</a> 및 <a href="https://zilliz.com/blog/set-up-with-facebook-ai-similarity-search-faiss">FAISS와</a> 같은 수정된 라이브러리를 사용합니다.</p>
<h2 id="Understanding-vector-databases-and-Milvus" class="common-anchor-header">벡터 데이터베이스와 Milvus 이해하기<button data-href="#Understanding-vector-databases-and-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://zilliz.com/glossary/anns">ANN(근사 최인접 이웃)</a> 은 관계형 데이터베이스에서는 처리할 수 없는 기능입니다. 관계형 데이터베이스는 미리 정의된 구조와 직접 비교 가능한 값을 가진 표 형식의 데이터를 처리하도록 설계되었습니다. 관계형 데이터베이스 인덱스는 이를 이용해 데이터를 비교하고 각 값이 다른 값보다 작거나 큰지 파악하는 구조를 만듭니다. 임베딩 벡터는 벡터의 각 값이 무엇을 나타내는지 알아야 하기 때문에 이러한 방식으로 서로 직접 비교할 수 없습니다. 한 벡터가 다른 벡터보다 반드시 작다고 말할 수도 없습니다. 우리가 할 수 있는 유일한 방법은 두 벡터 사이의 거리를 계산하는 것입니다. 두 벡터 사이의 거리가 작으면 두 벡터가 나타내는 특징이 비슷하다고 가정할 수 있고, 크면 두 벡터가 나타내는 데이터가 더 다르다고 가정할 수 있습니다. 그러나 이러한 효율적인 인덱스에는 대가가 따릅니다. 두 벡터 사이의 거리를 계산하는 데는 계산 비용이 많이 들고, 벡터 인덱스는 쉽게 조정할 수 없으며 때로는 수정할 수 없습니다. 이 두 가지 한계로 인해 관계형 데이터베이스에서는 이러한 인덱스를 통합하는 작업이 더 복잡해지기 때문에 <a href="https://zilliz.com/blog/what-is-a-real-vector-database">특수 목적</a> 의 <a href="https://zilliz.com/blog/what-is-a-real-vector-database">벡터 데이터베이스가</a> 필요합니다.</p>
<p><a href="https://zilliz.com/what-is-milvus">Milvus는</a> 관계형 데이터베이스의 벡터 문제를 해결하기 위해 만들어졌으며, 처음부터 이러한 임베딩 벡터와 그 인덱스를 대규모로 처리할 수 있도록 설계되었습니다. 클라우드 네이티브 배지를 충족하기 위해 Milvus는 컴퓨팅과 스토리지, 그리고 쿼리, 데이터 랭글링, 인덱싱과 같은 다양한 컴퓨팅 작업을 분리합니다. 사용자는 데이터 삽입이 많든 검색이 많든 다른 사용 사례를 처리하기 위해 각 데이터베이스 부분을 확장할 수 있습니다. 삽입 요청이 대량으로 유입되는 경우, 사용자는 일시적으로 인덱스 노드를 수평 및 수직으로 확장하여 수집을 처리할 수 있습니다. 마찬가지로, 수집되는 데이터는 없지만 검색이 많은 경우, 사용자는 인덱스 노드를 줄이고 대신 쿼리 노드를 확장하여 처리량을 늘릴 수 있습니다. 이 시스템 설계(그림 2 참조)는 병렬 컴퓨팅 사고방식으로 생각해야 했고, 그 결과 추가 최적화를 위한 많은 문이 열려 있는 컴퓨팅 최적화 시스템이 탄생했습니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Milvus_system_design_bb3a44c9cc.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>그림 2. Milvus 시스템 설계</em></p>
<p>Milvus는 또한 많은 최신 인덱싱 라이브러리를 사용하여 사용자에게 최대한 많은 시스템 맞춤화를 제공합니다. CRUD 작업, 스트리밍 데이터 및 필터링 처리 기능을 추가하여 시스템을 개선합니다. 나중에 이러한 인덱스가 어떻게 다른지, 각각의 장단점은 무엇인지에 대해 설명하겠습니다.</p>
<h2 id="Example-solution-integration-of-Milvus-and-Merlin" class="common-anchor-header">솔루션 예시: Milvus와 Merlin의 통합<button data-href="#Example-solution-integration-of-Milvus-and-Merlin" class="anchor-icon" translate="no">
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
    </button></h2><p>여기서 소개하는 예제 솔루션은 항목 검색 단계(ANN 검색을 통해 가장 관련성이 높은 k개의 항목을 검색할 때)에서 Milvus와 Merlin을 통합하는 방법을 보여줍니다. 아래에 설명된 <a href="https://www.kaggle.com/datasets/chadgostopp/recsys-challenge-2015">RecSys 챌린지의</a> 실제 데이터 세트를 사용합니다. 사용자와 아이템에 대한 벡터 임베딩을 학습하는 투 타워 딥러닝 모델을 훈련합니다. 이 섹션에서는 수집하는 메트릭과 사용하는 매개변수의 범위를 포함한 벤치마킹 작업의 청사진도 제공합니다.</p>
<p>유니티의 접근 방식은 다음과 같습니다:</p>
<ul>
<li><p>데이터 수집 및 전처리</p></li>
<li><p>투타워 딥러닝 모델 훈련</p></li>
<li><p>Milvus 인덱스 구축</p></li>
<li><p>Milvus 유사성 검색</p></li>
</ul>
<p>각 단계에 대해 간략하게 설명하고 자세한 내용은 <a href="https://github.com/bbozkaya/merlin-milvus/tree/main/notebooks">노트북을</a> 참조하세요.</p>
<h3 id="Dataset" class="common-anchor-header">데이터 세트</h3><p>이 통합 및 벤치마크 연구에서 사용한 데이터 세트는 <a href="https://www.kaggle.com/datasets/chadgostopp/recsys-challenge-2015">RecSys 2015 챌린지에</a> 대한 데이터 세트이며, Kaggle에서 사용할 수 있습니다. 여기에는 세션 ID, 타임스탬프, 클릭/구매와 관련된 항목 ID, 항목 카테고리와 같은 속성이 있는 유럽 온라인 소매업체의 사용자 클릭/구매 이벤트가 포함되어 있으며, yoochoose-clicks.dat 파일에서 확인할 수 있습니다. 세션은 독립적이며 재방문 사용자에 대한 힌트가 없으므로 각 세션을 별개의 사용자에 속한 것으로 취급합니다. 데이터 세트에는 9,249,729개의 고유 세션(사용자)과 52,739개의 고유 항목이 있습니다.</p>
<h3 id="Data-ingestion-and-preprocessing" class="common-anchor-header">데이터 수집 및 전처리</h3><p>데이터 전처리에 사용하는 도구는 Merlin의 확장성이 뛰어난 GPU 가속 기능 엔지니어링 및 전처리 컴포넌트인 <a href="https://github.com/NVIDIA-Merlin/NVTabular">NVTabular입니다</a>. NVTabular를 사용하여 데이터를 GPU 메모리로 읽고, 필요에 따라 피처를 재배열하고, 마루 파일로 내보내고, 훈련을 위한 훈련 검증 분할을 생성합니다. 그 결과 7,305,761명의 고유 사용자와 49,008개의 고유 항목으로 훈련할 수 있게 되었습니다. 또한 각 열과 그 값을 정수 값으로 분류합니다. 이제 데이터 세트가 투타워 모델로 훈련할 준비가 되었습니다.</p>
<h3 id="Model-training" class="common-anchor-header">모델 훈련</h3><p><a href="https://github.com/NVIDIA-Merlin/models/blob/main/examples/05-Retrieval-Model.ipynb">Two-Tower</a> 딥러닝 모델을 사용하여 사용자 및 항목 임베딩을 훈련하고 생성하며, 나중에 벡터 인덱싱 및 쿼리에 사용합니다. 모델을 학습한 후에는 학습된 사용자 및 항목 임베딩을 추출할 수 있습니다.</p>
<p>다음 두 단계는 추천을 위해 검색된 항목의 순위를 매기도록 학습된 <a href="https://arxiv.org/abs/1906.00091">DLRM</a> 모델과 사용자 및 항목의 특징을 저장하고 검색하는 데 사용되는 피처 스토어(이 경우 <a href="https://github.com/feast-dev/feast">Feast</a>)를 선택 사항으로 선택할 수 있습니다. 다단계 워크플로우의 완성도를 위해 이 두 가지를 포함합니다.</p>
<p>마지막으로 사용자 및 항목 임베딩을 쪽모이 세공 파일로 내보내고, 나중에 다시 로드하여 Milvus 벡터 인덱스를 생성할 수 있습니다.</p>
<h3 id="Building-and-querying-the-Milvus-index" class="common-anchor-header">Milvus 인덱스 구축 및 쿼리하기</h3><p>Milvus는 추론 머신에서 실행되는 "서버"를 통해 벡터 인덱싱과 유사성 검색을 용이하게 합니다. 노트북 2에서는 Milvus 서버와 Pymilvus를 핍 설치한 다음 기본 수신 포트로 서버를 시작하여 이를 설정했습니다. 다음으로, 각각 <code translate="no">setup_milvus</code> 및 <code translate="no">query_milvus</code> 함수를 사용하여 간단한 인덱스(IVF_FLAT)를 구축하고 이에 대해 쿼리하는 것을 시연합니다.</p>
<h2 id="Benchmarking" class="common-anchor-header">벤치마킹<button data-href="#Benchmarking" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus와 같은 빠르고 효율적인 벡터 인덱싱/검색 라이브러리를 사용하는 경우를 보여드리기 위해 두 가지 벤치마크를 설계했습니다.</p>
<ol>
<li><p>Milvus를 사용해 우리가 생성한 두 가지 임베딩 세트로 벡터 인덱스를 구축했습니다: 1) 85% 훈련 세트(인덱싱용)와 15% 테스트 세트(쿼리용)로 분할된 730만 고유 사용자에 대한 사용자 임베딩과 2) 49만 개의 제품에 대한 항목 임베딩(훈련과 테스트가 50대 50으로 분할됨)이 그것입니다. 이 벤치마크는 각 벡터 데이터 세트에 대해 독립적으로 수행되며 결과는 별도로 보고됩니다.</p></li>
<li><p>Milvus를 사용하여 49,000개의 상품 임베딩 데이터 세트에 대한 벡터 인덱스를 구축하고 이 인덱스에 대해 730만 명의 고유 사용자를 쿼리하여 유사성 검색을 수행합니다.</p></li>
</ol>
<p>이 벤치마크에서는 다양한 매개변수 조합과 함께 GPU와 CPU에서 실행되는 IVFPQ 및 HNSW 인덱싱 알고리즘을 사용했습니다. 자세한 내용은 <a href="https://github.com/bbozkaya/merlin-milvus/tree/main/results">여기에서</a> 확인할 수 있습니다.</p>
<p>검색 품질과 처리량의 절충은 특히 프로덕션 환경에서 중요한 성능 고려 사항입니다. Milvus를 사용하면 인덱싱 매개변수를 완벽하게 제어하여 주어진 사용 사례에 대해 이 절충점을 탐색하여 실측 데이터로 더 나은 검색 결과를 얻을 수 있습니다. 이는 처리 속도 또는 초당 쿼리 수(QPS) 감소의 형태로 계산 비용 증가를 의미할 수 있습니다. 저희는 리콜 메트릭으로 ANN 검색의 품질을 측정하고 그 절충점을 보여주는 QPS-리콜 곡선을 제공합니다. 그런 다음 비즈니스 사례의 컴퓨팅 리소스 또는 지연 시간/처리량 요구 사항을 고려하여 허용 가능한 검색 품질 수준을 결정할 수 있습니다.</p>
<p>또한 벤치마크에 사용된 쿼리 배치 크기(nq)에 주목하세요. 이는 여러 개의 동시 요청이 추론을 위해 전송되는 워크플로우(예: 이메일 수신자 목록에 요청되어 전송되는 오프라인 추천 또는 동시에 도착하는 요청을 모아 한꺼번에 처리하여 생성되는 온라인 추천)에서 유용합니다. 사용 사례에 따라 TIS는 이러한 요청을 일괄 처리하는 데 도움을 줄 수도 있습니다.</p>
<h3 id="Results" class="common-anchor-header">결과</h3><p>이제 Milvus에서 구현한 HNSW(CPU 전용) 및 IVF_PQ(CPU 및 GPU) 인덱스 유형을 사용하여 CPU와 GPU 모두에서 세 가지 벤치마크 세트에 대한 결과를 보고합니다.</p>
<h4 id="Items-vs-Items-vector-similarity-search" class="common-anchor-header">항목 대 항목 벡터 유사성 검색</h4><p>이 가장 작은 데이터 세트에서는 주어진 매개변수 조합에 대해 실행할 때마다 항목 벡터의 50%를 쿼리 벡터로 사용하고 나머지에서 상위 100개의 유사한 벡터를 쿼리합니다. 테스트한 매개변수 설정에서 HNSW와 IVF_PQ는 각각 0.958-1.0 및 0.665-0.997 범위의 높은 리콜을 생성합니다. 이 결과는 HNSW가 평균적으로 더 나은 리콜 성능을 보이지만, n리스트 설정이 작은 IVF_PQ가 비슷한 수준의 리콜을 생성한다는 것을 시사합니다. 또한 색인 및 쿼리 매개변수에 따라 리콜 값이 크게 달라질 수 있다는 점에 유의해야 합니다. 저희가 보고한 값은 일반적인 매개변수 범위로 예비 실험을 하고 일부 하위 집합으로 더 확대한 후 얻은 것입니다.</p>
<p>주어진 매개변수 조합에 대해 HNSW를 사용하는 CPU에서 모든 쿼리를 실행하는 총 시간은 5.22초에서 5.33초 사이(m이 커질수록 빨라짐, ef는 상대적으로 변화 없음), IVF_PQ를 사용하는 경우 13.67초에서 14.67초 사이(nlist와 nprobe가 커질수록 느려짐)였습니다. 그림 3에서 볼 수 있듯이 GPU 가속화는 눈에 띄는 효과가 있습니다.</p>
<p>그림 3은 IVF_PQ를 사용하여 이 작은 데이터 세트에서 CPU와 GPU에서 완료된 모든 실행에 대한 리콜-처리량 트레이드오프를 보여줍니다. 테스트한 모든 매개변수 조합에서 GPU가 4배에서 15배의 속도 향상을 제공하는 것으로 나타났습니다(n프로브가 커질수록 더 큰 속도 향상). 이는 각 매개변수 조합에 대해 CPU 실행의 QPS 대비 GPU의 QPS 비율을 취하여 계산됩니다. 전반적으로 이 세트는 CPU 또는 GPU에 약간의 과제를 제시하며, 아래에서 설명하는 것처럼 데이터 세트가 클수록 속도가 더 빨라질 수 있는 가능성을 보여줍니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/GPU_speedup_with_Milvus_IVF_PQ_item_item_d32de8443d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>그림 3. NVIDIA A100 GPU에서 실행되는 Milvus IVF_PQ 알고리즘의 GPU 속도 향상(항목-항목 유사도 검색)</em></p>
<h4 id="Users-vs-Users-vector-similarity-search" class="common-anchor-header">사용자 대 사용자 벡터 유사도 검색</h4><p>훨씬 더 큰 두 번째 데이터 세트(730만 명의 사용자)에서는 벡터의 85%(약 620만 개)를 '훈련'(색인할 벡터 집합)으로, 나머지 15%(약 110만 개)를 '테스트' 또는 쿼리 벡터 집합으로 따로 설정했습니다. 이 경우 HNSW와 IVF_PQ는 각각 0.884-1.0과 0.922-0.999의 리콜 값으로 매우 뛰어난 성능을 발휘합니다. 그러나 이들은 계산적으로 훨씬 더 까다로우며, 특히 CPU에서 IVF_PQ를 사용할 경우 더욱 그렇습니다. CPU에서 모든 쿼리를 실행하는 데 걸리는 총 시간은 HNSW의 경우 279.89초에서 295.56초, IVF_PQ의 경우 3082.67초에서 10932.33초입니다. 이러한 쿼리 시간은 쿼리된 110만 개의 벡터에 대해 누적된 것이므로 인덱스에 대한 단일 쿼리가 여전히 매우 빠르다고 말할 수 있습니다.</p>
<p>그러나 추론 서버가 수백만 개의 항목 인벤토리에 대한 쿼리를 실행하기 위해 수천 개의 동시 요청을 예상하는 경우 CPU 기반 쿼리는 실행 불가능할 수 있습니다.</p>
<p>그림 4에서 볼 수 있듯이, A100 GPU는 처리량(QPS) 측면에서 IVF_PQ의 모든 매개변수 조합에서 37배에서 91배(평균 76.1배)의 놀라운 속도 향상을 제공합니다. 이는 작은 데이터 세트에서 관찰한 결과와 일치하며, 이는 수백만 개의 임베딩 벡터가 있는 Milvus를 사용하면 GPU 성능이 합리적으로 잘 확장된다는 것을 시사합니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/GPU_speedup_with_Milvus_IVF_PQ_algorithm_user_user_c91f4e4164.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>그림 4. NVIDIA A100 GPU에서 실행되는 Milvus IVF_PQ 알고리즘을 사용한 GPU 속도 향상(사용자 간 유사성 검색)</em></p>
<p>다음 세부 그림 5는 IVF_PQ를 사용하여 CPU와 GPU에서 테스트한 모든 파라미터 조합에 대한 리콜-QPS 트레이드오프를 보여줍니다. 이 차트의 각 포인트 세트(위쪽은 GPU, 아래쪽은 CPU)는 처리량을 낮추는 대신 더 높은 리콜을 달성하기 위해 벡터 인덱싱/쿼리 파라미터를 변경할 때 직면하게 되는 트레이드오프를 나타냅니다. GPU의 경우 더 높은 리콜 수준을 달성하려고 할 때 QPS가 상당히 손실되는 것을 확인할 수 있습니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Recall_Throughput_tradeoff_519b2289e5.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>그림 5. IVF_PQ를 사용해 CPU와 GPU에서 테스트한 모든 매개변수 조합에 대한 리콜-처리량 트레이드오프(사용자 대 사용자)</em></p>
<h4 id="Users-vs-Items-vector-similarity-search" class="common-anchor-header">사용자 대 항목 벡터 유사도 검색</h4><p>마지막으로, 사용자 벡터를 항목 벡터에 대해 쿼리하는 또 다른 현실적인 사용 사례를 고려해 보겠습니다(위의 노트북 01에서 설명한 것처럼). 이 경우 49,000개의 항목 벡터가 인덱싱되고 730만 개의 사용자 벡터가 각각 가장 유사한 상위 100개의 항목에 대해 쿼리됩니다.</p>
<p>여기서 흥미로운 점이 있는데, 49K 항목의 인덱스에 대해 7.3M을 1000개씩 일괄적으로 쿼리하는 것은 HNSW와 IVF_PQ 모두 CPU에서 시간이 많이 걸리는 것으로 보이기 때문입니다. GPU가 이 경우를 더 잘 처리하는 것으로 보입니다(그림 6 참조). nlist = 100일 때 CPU에서 IVF_PQ의 최고 정확도 수준은 평균 약 86분 만에 계산되지만 nprobe 값이 증가할수록 크게 달라집니다(nprobe = 5일 때 51분 대 nprobe = 20일 때 128분). NVIDIA A100 GPU는 성능을 4배에서 17배까지 크게 향상시킵니다(nprobe가 커질수록 속도가 더 빨라짐). 또한 IVF_PQ 알고리즘은 양자화 기술을 통해 메모리 공간을 줄이고 GPU 가속과 결합하여 계산적으로 실행 가능한 ANN 검색 솔루션을 제공한다는 점을 기억하세요.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/GPU_speedup_with_Milvus_IVF_PQ_algorithm_user_item_504462fcc0.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>그림 6. NVIDIA A100 GPU에서 실행되는 Milvus IVF_PQ 알고리즘을 통한 GPU 속도 향상(사용자 항목 유사도 검색)</em></p>
<p>그림 5와 마찬가지로, 그림 7에는 IVF_PQ로 테스트한 모든 파라미터 조합에 대한 리콜-처리량 트레이드오프가 표시되어 있습니다. 여기서도 처리량 증가를 위해 ANN 검색의 정확도를 약간 포기해야 할 수 있음을 알 수 있지만, 특히 GPU 실행의 경우 그 차이가 훨씬 덜 두드러집니다. 이는 GPU를 사용하면 비교적 일관되게 높은 수준의 계산 성능을 기대할 수 있으면서도 여전히 높은 리콜을 달성할 수 있음을 시사합니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Recall_Throughput_tradeoff_user_items_0abce91c5e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>그림 7. IVF_PQ를 사용하여 CPU와 GPU에서 테스트한 모든 매개변수 조합에 대한 리콜-처리량 트레이드오프(사용자 대 항목)</em></p>
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
    </button></h2><p>여기까지 읽어주신 분들을 위해 몇 가지 결론을 말씀드리겠습니다. 최신 Recsys의 복잡성과 다단계 특성으로 인해 모든 단계에서 성능과 효율성이 필요하다는 점을 상기시켜드리고 싶습니다. 이 블로그를 통해 RecSys 파이프라인에 두 가지 중요한 기능의 사용을 고려해야 하는 강력한 이유를 알게 되셨기를 바랍니다:</p>
<ul>
<li><p>바로 효율적인 GPU 가속 벡터 검색 엔진인 <a href="https://github.com/milvus-io/milvus/tree/2.3.0">Milvus를</a> 손쉽게 플러그인할 수 있는 NVIDIA Merlin 시스템 라이브러리입니다.</p></li>
<li><p>GPU를 사용하여 벡터 데이터베이스 인덱싱을 위한 계산을 가속화하고, <a href="https://github.com/rapidsai/raft">RAPIDS RAFT와</a> 같은 기술로 ANN 검색을 가속화할 수 있습니다.</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/summary_benchmark_results_ae33fbe514.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>이러한 연구 결과에 따르면 Merlin-Milvus 통합은 다른 훈련 및 추론 옵션보다 성능이 뛰어나고 훨씬 덜 복잡합니다. 또한, 두 프레임워크 모두 활발하게 개발되고 있으며, 매 릴리스마다 많은 새로운 기능(예: Milvus의 새로운 GPU 가속 벡터 데이터베이스 인덱스)이 추가되고 있습니다. 벡터 유사도 검색이 컴퓨터 비전, 대규모 언어 모델링, 추천 시스템과 같은 다양한 워크플로우에서 중요한 구성 요소라는 사실은 이러한 노력을 더욱 가치 있게 만듭니다.</p>
<p>끝으로, 이 작업과 블로그 게시물을 제작하는 데 기여해 주신 Zilliz/Milvus와 Merlin, 그리고 RAFT 팀의 모든 분들께 감사의 말씀을 전합니다. 여러분의 리시스나 다른 워크플로우에 Merlin과 Milvus를 구현할 기회가 있다면 여러분의 의견을 기다리겠습니다.</p>
