---
id: debugging-rag-in-3d-with-projectgolem-and-milvus.md
title: RAG가 실패하는 이유를 알 수 있다면 어떨까요? 프로젝트_골렘과 밀버스로 3D에서 RAG 디버깅하기
author: Min Yin
date: 2026-02-18T00:00:00.000Z
cover: assets.zilliz.com/Debugging_RAG_in_3_D_f1b45f9a99_5f98979c06.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, RAG'
meta_keywords: 'Project_Golem, milvus, RAG'
meta_title: |
  Debugging RAG in 3D with Project_Golem and Milvus
desc: >-
  Project_Golem과 Milvus가 벡터 공간을 시각화하고, 검색 오류를 디버깅하고, 실시간 벡터 검색을 확장하여 RAG 시스템을 관찰
  가능하게 만드는 방법을 알아보세요.
origin: 'https://milvus.io/blog/debugging-rag-in-3d-with-projectgolem-and-milvus.md'
---
<p>RAG 검색이 잘못되면 일반적으로 관련 문서가 표시되지 않거나 관련 없는 문서가 표시되는 등 문제가 있다는 것을 알 수 있습니다. 하지만 그 이유를 알아내는 것은 다른 이야기입니다. 유사성 점수와 획일적인 결과 목록만 가지고 작업해야 합니다. 벡터 공간에서 문서가 실제로 어떻게 배치되어 있는지, 청크가 서로 어떻게 연관되어 있는지, 쿼리가 일치해야 할 콘텐츠와 비교하여 어디에 위치했는지 확인할 방법이 없습니다. 실제로는 청크 전략을 조정하고, 임베딩 모델을 바꾸고, 톱-k를 조정하고, 결과가 개선되기를 바라는 등 시행착오를 거듭하며 RAG 디버깅을 수행해야 합니다.</p>
<p><a href="https://github.com/CyberMagician/Project_Golem">Project_Golem은</a> 벡터 공간을 가시화하는 오픈 소스 도구입니다. 이 도구는 UMAP을 사용하여 고차원 임베딩을 3D로 투영하고 브라우저에서 대화형으로 렌더링하기 위해 Three.js를 사용합니다. 검색이 실패한 이유를 추측하는 대신 청크가 의미론적으로 어떻게 클러스터링되는지, 쿼리가 어디에 있는지, 어떤 문서가 검색되었는지 모두 단일 시각적 인터페이스에서 확인할 수 있습니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/debugging_rag_in_3d_with_projectgolem_and_milvus_1_01de566e04.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>정말 놀랍습니다. 하지만 원래 Project_Golem은 실제 시스템이 아닌 소규모 데모용으로 설계되었습니다. 플랫 파일, 무차별 대입 검색, 전체 데이터 세트 재구축에 의존하기 때문에 데이터가 수천 개 이상으로 늘어나면 빠르게 고장납니다.</p>
<p>이러한 격차를 해소하기 위해, 저희는 Project_Golem을 <a href="https://milvus.io/docs/release_notes.md#v268">Milvus</a> (특히 버전 2.6.8)와 벡터 백본으로 통합했습니다. Milvus는 실시간 수집, 확장 가능한 인덱싱, 밀리초 단위의 검색을 처리하는 오픈 소스 고성능 벡터 데이터베이스이며, Project_Golem은 벡터 검색 동작을 가시화하는 데 집중하고 있습니다. 이 두 가지를 함께 사용하면 장난감 데모용 3D 시각화를 프로덕션 RAG 시스템을 위한 실용적인 디버깅 도구로 전환할 수 있습니다.</p>
<p>이 포스팅에서는 Project_Golem을 살펴보고 이를 Milvus와 통합하여 벡터 검색 동작을 관찰 가능하고 확장 가능하며 프로덕션에 바로 사용할 수 있게 만든 방법을 보여드리겠습니다.</p>
<h2 id="What-Is-ProjectGolem" class="common-anchor-header">Project_Golem이란?<button data-href="#What-Is-ProjectGolem" class="anchor-icon" translate="no">
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
    </button></h2><p>RAG 디버깅이 어려운 이유는 벡터 공간이 고차원이고 사람이 볼 수 없다는 간단한 이유 때문입니다.</p>
<p><a href="https://github.com/CyberMagician/Project_Golem">Project_Golem은</a> RAG 시스템이 작동하는 벡터 공간을 볼 수 있는 브라우저 기반 도구입니다. 검색을 구동하는 고차원 임베딩(일반적으로 768 또는 1536 차원)을 가져와 직접 탐색할 수 있는 대화형 3D 장면으로 투영합니다.</p>
<p>작동 원리는 다음과 같습니다:</p>
<ul>
<li>UMAP으로 차원 축소 Project_Golem은 UMAP을 사용하여 고차원 벡터를 3차원으로 압축하는 동시에 상대적인 거리를 유지합니다. 원래 공간에서 의미적으로 유사한 청크는 3D 투영에서 서로 가깝게 유지되고, 관련 없는 청크는 멀리 떨어져 있습니다.</li>
<li>Three.js를 사용한 3D 렌더링. 각 문서 청크는 브라우저에서 렌더링된 3D 장면에서 노드로 나타납니다. 공간을 회전, 확대/축소 및 탐색하여 문서가 어떻게 클러스터링되는지, 어떤 주제가 긴밀하게 그룹화되어 있는지, 어떤 주제가 겹치는지, 경계가 어디에 있는지 확인할 수 있습니다.</li>
<li>쿼리 시간 강조 표시. 쿼리를 실행하면 코사인 유사도를 사용해 원래의 고차원 공간에서 검색이 여전히 이루어집니다. 하지만 결과가 나오면 검색된 청크가 3D 보기에서 불이 켜집니다. 결과와 비교하여 쿼리가 어느 위치에 있는지, 그리고 검색되지 않은 문서와 비교하여 어느 위치에 있는지 즉시 확인할 수 있습니다.</li>
</ul>
<p>이것이 바로 Project_Golem이 디버깅에 유용한 이유입니다. 순위가 매겨진 결과 목록을 보고 관련 문서가 누락된 이유를 추측하는 대신, 해당 문서가 먼 클러스터에 있는지(임베딩 문제), 관련 없는 콘텐츠와 겹치는지(청킹 문제), 검색 임계값을 겨우 벗어났는지(구성 문제)를 확인할 수 있습니다. 3D 보기는 추상적인 유사성 점수를 추론할 수 있는 공간적 관계로 바꿔줍니다.</p>
<h2 id="Why-ProjectGolem-Isnt-Production-Ready" class="common-anchor-header">Project_Golem이 프로덕션 준비가 되지 않은 이유<button data-href="#Why-ProjectGolem-Isnt-Production-Ready" class="anchor-icon" translate="no">
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
    </button></h2><p>Project_Golem은 시각화 프로토타입으로 설계되었으며, 그 용도로는 잘 작동합니다. 그러나 그 아키텍처는 실제 RAG 디버깅에 사용하려는 경우 중요한 방식으로 규모에 따라 빠르게 무너지는 가정을 하고 있습니다.</p>
<h3 id="Every-Update-Requires-a-Full-Rebuild" class="common-anchor-header">업데이트할 때마다 전체 재구축이 필요함</h3><p>이것이 가장 근본적인 한계입니다. 원래 설계에서는 새 문서를 추가하면 임베딩이 다시 생성되어 .npy 파일에 기록되고, 전체 데이터 세트에서 UMAP이 다시 실행되고, 3D 좌표가 JSON으로 다시 내보내는 등 전체 파이프라인 재구축이 트리거됩니다.</p>
<p>문서가 10만 개일 경우에도 단일 코어 UMAP 실행에는 5~10분이 소요됩니다. 문서 규모가 백만 개가 되면 완전히 비실용적이 됩니다. 뉴스 피드, 문서, 사용자 대화 등 지속적으로 변경되는 데이터 세트에는 이 방법을 사용할 수 없습니다. 업데이트할 때마다 전체 재처리 주기를 기다려야 하기 때문입니다.</p>
<h3 id="Brute-Force-Search-Doesnt-Scale" class="common-anchor-header">무차별 대입 검색은 확장되지 않음</h3><p>검색 측면에는 자체적인 한계가 있습니다. 원래 구현은 무차별 코사인 유사도 검색을 위해 NumPy를 사용합니다(선형 시간 복잡성, 인덱싱 없음). 백만 개의 문서 데이터 세트에서 단일 쿼리는 1초 이상 걸릴 수 있습니다. 이는 대화형 또는 온라인 시스템에서는 사용할 수 없는 속도입니다.</p>
<p>메모리 압박은 문제를 더욱 악화시킵니다. 각 768차원 플로트32 벡터는 약 3KB를 차지하므로 백만 개의 벡터 데이터 세트에는 3GB 이상의 메모리가 필요하며, 검색을 효율적으로 하기 위해 인덱스 구조가 없는 평면 NumPy 배열에 모두 로드됩니다.</p>
<h3 id="No-Metadata-Filtering-No-Multi-Tenancy" class="common-anchor-header">메타데이터 필터링 없음, 멀티테넌시 없음</h3><p>실제 RAG 시스템에서는 벡터 유사성이 유일한 검색 기준이 되는 경우는 거의 없습니다. 거의 항상 문서 유형, 타임스탬프, 사용자 권한 또는 애플리케이션 수준 경계와 같은 메타데이터를 기준으로 필터링해야 합니다. 예를 들어, 고객 지원 RAG 시스템은 모든 사람의 데이터를 검색하는 것이 아니라 특정 테넌트의 문서로 검색 범위를 한정해야 합니다.</p>
<p>Project_Golem은 이 중 어느 것도 지원하지 않습니다. ANN 인덱스(예: HNSW 또는 IVF), 스칼라 필터링, 테넌트 격리, 하이브리드 검색도 없습니다. 그 밑에 프로덕션 검색 엔진이 없는 시각화 레이어입니다.</p>
<h2 id="How-Milvus-Powers-ProjectGolem’s-Retrieval-Layer" class="common-anchor-header">Milvus가 Project_Golem의 검색 레이어를 지원하는 방법<button data-href="#How-Milvus-Powers-ProjectGolem’s-Retrieval-Layer" class="anchor-icon" translate="no">
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
    </button></h2><p>이전 섹션에서는 업데이트할 때마다 전체 재구축, 무차별 검색, 메타데이터 인식 검색 없음이라는 세 가지 차이점을 확인했습니다. 이 세 가지 모두 동일한 근본 원인에서 비롯된 것으로, Project_Golem에는 데이터베이스 계층이 없습니다. 검색, 저장, 시각화가 하나의 파이프라인으로 얽혀 있기 때문에 어느 한 부분을 변경하면 모든 것을 다시 빌드해야 합니다.</p>
<p>해결책은 이 파이프라인을 최적화하는 것이 아닙니다. 해결책은 파이프라인을 분리하는 것입니다.</p>
<p>Milvus 2.6.8을 벡터 백본으로 통합하면 검색은 시각화와 독립적으로 작동하는 전용 프로덕션 등급 레이어가 됩니다. Milvus는 벡터 저장, 인덱싱 및 검색을 처리합니다. Project_Golem은 순전히 렌더링에만 집중하여 Milvus에서 문서 ID를 가져와 3D 보기에서 강조 표시합니다.</p>
<p>이렇게 분리하면 두 개의 깔끔하고 독립적인 흐름이 생성됩니다:</p>
<p>검색 흐름(온라인, 밀리초 수준)</p>
<ul>
<li>쿼리는 OpenAI 임베딩을 사용하여 벡터로 변환됩니다.</li>
<li>쿼리 벡터는 Milvus 컬렉션으로 전송됩니다.</li>
<li>밀버스 자동 인덱스가 적절한 인덱스를 선택하고 최적화합니다.</li>
<li>실시간 코사인 유사도 검색을 통해 관련 문서 ID를 반환합니다.</li>
</ul>
<p>시각화 흐름(오프라인, 데모 규모)</p>
<ul>
<li>UMAP은 데이터 수집 중에 3D 좌표를 생성합니다(n_neighbors=30, min_dist=0.1).</li>
<li>좌표는 golem_cortex.json에 저장됩니다.</li>
<li>프런트엔드는 Milvus가 반환한 문서 ID를 사용해 해당 3D 노드를 강조 표시합니다.</li>
</ul>
<p>중요한 점은 검색이 더 이상 시각화를 기다리지 않는다는 점입니다. 새 문서를 수집하고 즉시 검색할 수 있으며, 3D 보기가 자체 일정에 따라 따라잡습니다.</p>
<h3 id="What-Streaming-Nodes-Change" class="common-anchor-header">스트리밍 노드의 변화</h3><p>이 실시간 수집은 Milvus 2.6.8의 새로운 기능인 <a href="https://milvus.io/docs/configure_streamingnode.md#streamingNode-related-Configurations">스트리밍 노드를</a> 통해 이루어집니다. 이전 버전에서는 실시간 수집을 위해 Kafka나 Pulsar와 같은 외부 메시지 큐가 필요했습니다. 스트리밍 노드는 이러한 조정을 Milvus 자체로 옮겨 새로운 벡터가 지속적으로 수집되고 인덱스가 점진적으로 업데이트되며 새로 추가된 문서를 전체 재구축이나 외부 종속성 없이 즉시 검색할 수 있게 해줍니다.</p>
<p>Project_Golem의 경우, 이것이 바로 이 아키텍처를 실용적으로 만드는 요소입니다. 새 문서, 업데이트된 문서, 사용자 생성 콘텐츠 등 RAG 시스템에 문서를 계속 추가할 수 있으며, 비용이 많이 드는 UMAP → JSON → 다시 로드 주기를 트리거하지 않고도 검색을 최신 상태로 유지할 수 있습니다.</p>
<h3 id="Extending-Visualization-to-Million-Scale-Future-Path" class="common-anchor-header">시각화를 수백만 규모로 확장(향후 경로)</h3><p>이러한 Milvus 지원 설정으로 Project_Golem은 현재 약 10,000개의 문서에서 대화형 데모를 지원합니다. 검색은 그보다 훨씬 더 확장되어 수백만 개를 처리하지만 시각화 파이프라인은 여전히 일괄 UMAP 실행에 의존하고 있습니다. 이러한 격차를 줄이기 위해 점진적 시각화 파이프라인으로 아키텍처를 확장할 수 있습니다:</p>
<ul>
<li><p>업데이트 트리거: 시스템은 Milvus 컬렉션에서 삽입 이벤트를 수신 대기합니다. 새로 추가된 문서가 정의된 임계값(예: 1,000개 항목)에 도달하면 증분 업데이트가 트리거됩니다.</p></li>
<li><p>증분 투영: 전체 데이터 세트에 대해 UMAP을 다시 실행하는 대신 UMAP의 transform() 메서드를 사용하여 새 벡터를 기존 3D 공간에 투영합니다. 이렇게 하면 글로벌 구조를 유지하면서 계산 비용을 크게 줄일 수 있습니다.</p></li>
<li><p>프론트엔드 동기화: 업데이트된 좌표 조각은 웹소켓을 통해 프론트엔드로 스트리밍되므로 전체 씬을 다시 로드하지 않고도 새 노드를 동적으로 표시할 수 있습니다.</p></li>
</ul>
<p>확장성 외에도 Milvus 2.6.8은 벡터 유사도와 전체 텍스트 검색 및 스칼라 필터링을 결합하여 하이브리드 검색을 지원합니다. 이를 통해 키워드 강조 표시, 카테고리 필터링, 시간 기반 슬라이싱 등 더욱 풍부한 3D 상호작용이 가능해져 개발자는 RAG 동작을 탐색, 디버그, 추론할 수 있는 보다 강력한 방법을 사용할 수 있습니다.</p>
<h2 id="How-to-Deploy-and-Explore-ProjectGolem-with-Milvus" class="common-anchor-header">Milvus로 Project_Golem을 배포하고 탐색하는 방법<button data-href="#How-to-Deploy-and-Explore-ProjectGolem-with-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>업그레이드된 Project_Golem은 이제 <a href="https://github.com/yinmin2020/Project_Golem_Milvus">GitHub에서</a> 오픈 소스로 제공됩니다. Milvus 공식 문서를 데이터세트로 사용하여 RAG 검색을 3D로 시각화하는 전체 과정을 안내합니다. 설정은 Docker와 Python을 사용하며, 처음부터 시작하더라도 쉽게 따라할 수 있습니다.</p>
<h3 id="Prerequisites" class="common-anchor-header">전제 조건</h3><ul>
<li>Docker ≥ 20.10</li>
<li>Docker Compose ≥ 2.0</li>
<li>Python ≥ 3.11</li>
<li>OpenAI API 키</li>
<li>데이터 세트(마크다운 형식의 Milvus 문서)</li>
</ul>
<h3 id="1-Deploy-Milvus" class="common-anchor-header">1. Milvus 배포</h3><pre><code translate="no">Download docker-compose.yml
wget https://github.com/milvus-io/milvus/releases/download/v2.6.8/milvus-standalone-docker-compose.yml -O docker-compose.yml
Start Milvus（verify port mapping：19530:19530）
docker-compose up -d
Verify that the services are running
docker ps | grep milvus
You should see three containers：milvus-standalone, milvus-etcd, milvus-minio
<button class="copy-code-btn"></button></code></pre>
<h3 id="2-Core-Implementation" class="common-anchor-header">2. 핵심 구현</h3><p>Milvus 통합(ingest.py)</p>
<p>참고: 이 구현은 최대 8개의 문서 카테고리를 지원합니다. 카테고리 수가 이 제한을 초과하면 색상이 라운드 로빈 방식으로 재사용됩니다.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient
<span class="hljs-keyword">from</span> pymilvus.milvus_client.index <span class="hljs-keyword">import</span> IndexParams
<span class="hljs-keyword">from</span> openai <span class="hljs-keyword">import</span> OpenAI
<span class="hljs-keyword">from</span> langchain_text_splitters <span class="hljs-keyword">import</span> RecursiveCharacterTextSplitter
<span class="hljs-keyword">import</span> umap
<span class="hljs-keyword">from</span> sklearn.neighbors <span class="hljs-keyword">import</span> NearestNeighbors
<span class="hljs-keyword">import</span> json
<span class="hljs-keyword">import</span> numpy <span class="hljs-keyword">as</span> np
<span class="hljs-keyword">import</span> os
<span class="hljs-keyword">import</span> glob
--- CONFIG ---
MILVUS_URI = <span class="hljs-string">&quot;http://localhost:19530&quot;</span>
COLLECTION_NAME = <span class="hljs-string">&quot;golem_memories&quot;</span>
JSON_OUTPUT_PATH = <span class="hljs-string">&quot;./golem_cortex.json&quot;</span>
Data directory (users place .md files <span class="hljs-keyword">in</span> this folder)
DATA_DIR = <span class="hljs-string">&quot;./data&quot;</span>
OpenAI Embedding Config
OPENAI_API_KEY = os.getenv(<span class="hljs-string">&quot;OPENAI_API_KEY&quot;</span>)
OPENAI_BASE_URL = <span class="hljs-string">&quot;https://api.openai.com/v1&quot;</span>  <span class="hljs-comment">#</span>
OPENAI_EMBEDDING_MODEL = <span class="hljs-string">&quot;text-embedding-3-small&quot;</span>
<span class="hljs-number">1536</span> dimensions
EMBEDDING_DIM = <span class="hljs-number">1536</span>
Color mapping: colors are assigned automatically <span class="hljs-keyword">and</span> reused <span class="hljs-keyword">in</span> a <span class="hljs-built_in">round</span>-robin manner
COLORS = [
[<span class="hljs-number">0.29</span>, <span class="hljs-number">0.87</span>, <span class="hljs-number">0.50</span>],
Green
[<span class="hljs-number">0.22</span>, <span class="hljs-number">0.74</span>, <span class="hljs-number">0.97</span>],
Blue
[<span class="hljs-number">0.60</span>, <span class="hljs-number">0.20</span>, <span class="hljs-number">0.80</span>],
Purple
[<span class="hljs-number">0.94</span>, <span class="hljs-number">0.94</span>, <span class="hljs-number">0.20</span>],
Gold
[<span class="hljs-number">0.98</span>, <span class="hljs-number">0.55</span>, <span class="hljs-number">0.00</span>],
Orange
[<span class="hljs-number">0.90</span>, <span class="hljs-number">0.30</span>, <span class="hljs-number">0.40</span>],
Red
[<span class="hljs-number">0.40</span>, <span class="hljs-number">0.90</span>, <span class="hljs-number">0.90</span>],
Cyan
[<span class="hljs-number">0.95</span>, <span class="hljs-number">0.50</span>, <span class="hljs-number">0.90</span>],
Magenta
]
<span class="hljs-keyword">def</span> <span class="hljs-title function_">get_embeddings</span>(<span class="hljs-params">texts</span>):
<span class="hljs-string">&quot;&quot;&quot;Batch embedding using OpenAI API&quot;&quot;&quot;</span>
client = OpenAI(api_key=OPENAI_API_KEY, base_url=OPENAI_BASE_URL)
embeddings = []
batch_size = <span class="hljs-number">100</span>
OpenAI allows multiple texts per request
<span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-number">0</span>, <span class="hljs-built_in">len</span>(texts), batch_size):
batch = texts[i:i + batch_size]
response = client.embeddings.create(
model=OPENAI_EMBEDDING_MODEL,
<span class="hljs-built_in">input</span>=batch
)
embeddings.extend([item.embedding <span class="hljs-keyword">for</span> item <span class="hljs-keyword">in</span> response.data])
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   ↳ Embedded <span class="hljs-subst">{<span class="hljs-built_in">min</span>(i + batch_size, <span class="hljs-built_in">len</span>(texts))}</span>/<span class="hljs-subst">{<span class="hljs-built_in">len</span>(texts)}</span>...&quot;</span>)
<span class="hljs-keyword">return</span> np.array(embeddings)
<span class="hljs-keyword">def</span> <span class="hljs-title function_">load_markdown_files</span>(<span class="hljs-params">data_dir</span>):
<span class="hljs-string">&quot;&quot;&quot;Load all markdown files from the data directory&quot;&quot;&quot;</span>
md_files = glob.glob(os.path.join(data_dir, <span class="hljs-string">&quot;**/*.md&quot;</span>), recursive=<span class="hljs-literal">True</span>)
<span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> md_files:
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   ❌ ERROR: No .md files found in &#x27;<span class="hljs-subst">{data_dir}</span>&#x27;&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   👉 Create a &#x27;<span class="hljs-subst">{data_dir}</span>&#x27; folder and put your markdown files there.&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   👉 Example: <span class="hljs-subst">{data_dir}</span>/doc1.md, <span class="hljs-subst">{data_dir}</span>/docs/doc2.md&quot;</span>)
<span class="hljs-keyword">return</span> <span class="hljs-literal">None</span>
docs = []
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;\n📚 FOUND <span class="hljs-subst">{<span class="hljs-built_in">len</span>(md_files)}</span> MARKDOWN FILES:&quot;</span>)
<span class="hljs-keyword">for</span> i, file_path <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(md_files):
filename = os.path.basename(file_path)
Categories are derived <span class="hljs-keyword">from</span> the file’s path relative to data_dir
rel_path = os.path.relpath(file_path, data_dir)
category = os.path.dirname(rel_path) <span class="hljs-keyword">if</span> os.path.dirname(rel_path) <span class="hljs-keyword">else</span> <span class="hljs-string">&quot;default&quot;</span>
<span class="hljs-keyword">with</span> <span class="hljs-built_in">open</span>(file_path, <span class="hljs-string">&#x27;r&#x27;</span>, encoding=<span class="hljs-string">&#x27;utf-8&#x27;</span>) <span class="hljs-keyword">as</span> f:
content = f.read()
docs.append({
<span class="hljs-string">&quot;title&quot;</span>: filename,
<span class="hljs-string">&quot;text&quot;</span>: content,
<span class="hljs-string">&quot;cat&quot;</span>: category,
<span class="hljs-string">&quot;path&quot;</span>: file_path
})
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   <span class="hljs-subst">{i+<span class="hljs-number">1</span>}</span>. [<span class="hljs-subst">{category}</span>] <span class="hljs-subst">{filename}</span>&quot;</span>)
<span class="hljs-keyword">return</span> docs
<span class="hljs-keyword">def</span> <span class="hljs-title function_">ingest_dense</span>():
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;🧠 PROJECT GOLEM - NEURAL MEMORY BUILDER&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;=&quot;</span> * <span class="hljs-number">50</span>)
<span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> OPENAI_API_KEY:
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;   ❌ ERROR: OPENAI_API_KEY environment variable not set!&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;   👉 Run: export OPENAI_API_KEY=&#x27;your-key-here&#x27;&quot;</span>)
<span class="hljs-keyword">return</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   ↳ Using OpenAI Embedding: <span class="hljs-subst">{OPENAI_EMBEDDING_MODEL}</span>&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   ↳ Embedding Dimension: <span class="hljs-subst">{EMBEDDING_DIM}</span>&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   ↳ Data Directory: <span class="hljs-subst">{DATA_DIR}</span>&quot;</span>)
<span class="hljs-number">1.</span> Load local markdown files
docs = load_markdown_files(DATA_DIR)
<span class="hljs-keyword">if</span> docs <span class="hljs-keyword">is</span> <span class="hljs-literal">None</span>:
<span class="hljs-keyword">return</span>
<span class="hljs-number">2.</span> Split documents into chunks
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;\n📦 PROCESSING DOCUMENTS...&quot;</span>)
splitter = RecursiveCharacterTextSplitter(chunk_size=<span class="hljs-number">800</span>, chunk_overlap=<span class="hljs-number">50</span>)
chunks = []
raw_texts = []
colors = []
chunk_titles = []
categories = []
<span class="hljs-keyword">for</span> doc <span class="hljs-keyword">in</span> docs:
doc_chunks = splitter.create_documents([doc[<span class="hljs-string">&#x27;text&#x27;</span>]])
cat_index = <span class="hljs-built_in">hash</span>(doc[<span class="hljs-string">&#x27;cat&#x27;</span>]) % <span class="hljs-built_in">len</span>(COLORS)
<span class="hljs-keyword">for</span> i, chunk <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(doc_chunks):
chunks.append({
<span class="hljs-string">&quot;text&quot;</span>: chunk.page_content,
<span class="hljs-string">&quot;title&quot;</span>: doc[<span class="hljs-string">&#x27;title&#x27;</span>],
<span class="hljs-string">&quot;cat&quot;</span>: doc[<span class="hljs-string">&#x27;cat&#x27;</span>]
})
raw_texts.append(chunk.page_content)
colors.append(COLORS[cat_index])
chunk_titles.append(<span class="hljs-string">f&quot;<span class="hljs-subst">{doc[<span class="hljs-string">&#x27;title&#x27;</span>]}</span> (chunk <span class="hljs-subst">{i+<span class="hljs-number">1</span>}</span>)&quot;</span>)
categories.append(doc[<span class="hljs-string">&#x27;cat&#x27;</span>])
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   ↳ Created <span class="hljs-subst">{<span class="hljs-built_in">len</span>(chunks)}</span> text chunks from <span class="hljs-subst">{<span class="hljs-built_in">len</span>(docs)}</span> documents&quot;</span>)
<span class="hljs-number">3.</span> Generate embeddings
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;\n🔮 GENERATING EMBEDDINGS...&quot;</span>)
vectors = get_embeddings(raw_texts)
<span class="hljs-number">4.</span> 3D Projection (UMAP)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n🎨 CALCULATING 3D MANIFOLD...&quot;</span>)
reducer = umap.UMAP(n_components=<span class="hljs-number">3</span>, n_neighbors=<span class="hljs-number">30</span>, min_dist=<span class="hljs-number">0.1</span>, metric=<span class="hljs-string">&#x27;cosine&#x27;</span>)
embeddings_3d = reducer.fit_transform(vectors)
<span class="hljs-number">5.</span> Wiring (KNN)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;   ↳ Wiring Synapses (finding connections)...&quot;</span>)
nbrs = NearestNeighbors(n_neighbors=<span class="hljs-number">8</span>, metric=<span class="hljs-string">&#x27;cosine&#x27;</span>).fit(vectors)
distances, indices = nbrs.kneighbors(vectors)
<span class="hljs-number">6.</span> Prepare output data
cortex_data = []
milvus_data = []
<span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-built_in">len</span>(chunks)):
cortex_data.append({
<span class="hljs-string">&quot;id&quot;</span>: i,
<span class="hljs-string">&quot;title&quot;</span>: chunk_titles[i],
<span class="hljs-string">&quot;cat&quot;</span>: categories[i],
<span class="hljs-string">&quot;pos&quot;</span>: embeddings_3d[i].tolist(),
<span class="hljs-string">&quot;col&quot;</span>: colors[i],
<span class="hljs-string">&quot;nbs&quot;</span>: indices[i][<span class="hljs-number">1</span>:].tolist()
})
milvus_data.append({
<span class="hljs-string">&quot;id&quot;</span>: i,
<span class="hljs-string">&quot;text&quot;</span>: chunks[i][<span class="hljs-string">&#x27;text&#x27;</span>],
<span class="hljs-string">&quot;title&quot;</span>: chunk_titles[i],
<span class="hljs-string">&quot;category&quot;</span>: categories[i],
<span class="hljs-string">&quot;vector&quot;</span>: vectors[i].tolist()
})
<span class="hljs-keyword">with</span> <span class="hljs-built_in">open</span>(JSON_OUTPUT_PATH, <span class="hljs-string">&#x27;w&#x27;</span>) <span class="hljs-keyword">as</span> f:
json.dump(cortex_data, f)
<span class="hljs-number">7.</span> Store vectors <span class="hljs-keyword">in</span> Milvus
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n💾 STORING IN MILVUS...&quot;</span>)
client = MilvusClient(uri=MILVUS_URI)
Drop existing collection <span class="hljs-keyword">if</span> it exists
<span class="hljs-keyword">if</span> client.has_collection(COLLECTION_NAME):
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   ↳ Dropping existing collection &#x27;<span class="hljs-subst">{COLLECTION_NAME}</span>&#x27;...&quot;</span>)
client.drop_collection(COLLECTION_NAME)
Create new collection
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   ↳ Creating collection &#x27;<span class="hljs-subst">{COLLECTION_NAME}</span>&#x27; (dim=<span class="hljs-subst">{EMBEDDING_DIM}</span>)...&quot;</span>)
client.create_collection(
collection_name=COLLECTION_NAME,
dimension=EMBEDDING_DIM
)
Insert data
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   ↳ Inserting <span class="hljs-subst">{<span class="hljs-built_in">len</span>(milvus_data)}</span> vectors...&quot;</span>)
client.insert(
collection_name=COLLECTION_NAME,
data=milvus_data
)
Create index <span class="hljs-keyword">for</span> faster search
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;   ↳ Creating index...&quot;</span>)
index_params = IndexParams()
index_params.add_index(
field_name=<span class="hljs-string">&quot;vector&quot;</span>,
index_type=<span class="hljs-string">&quot;AUTOINDEX&quot;</span>,
metric_type=<span class="hljs-string">&quot;COSINE&quot;</span>
)
client.create_index(
collection_name=COLLECTION_NAME,
index_params=index_params
)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;\n✅ CORTEX GENERATED SUCCESSFULLY!&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   📊 <span class="hljs-subst">{<span class="hljs-built_in">len</span>(chunks)}</span> memory nodes stored in Milvus&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   📁 Cortex data saved to: <span class="hljs-subst">{JSON_OUTPUT_PATH}</span>&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   🚀 Run &#x27;python GolemServer.py&#x27; to start the server&quot;</span>)
<span class="hljs-keyword">if</span> __name__ == <span class="hljs-string">&quot;__main__&quot;</span>:
ingest_dense()
<button class="copy-code-btn"></button></code></pre>
<p>프런트엔드 시각화(GolemServer.py)</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> flask <span class="hljs-keyword">import</span> Flask, request, jsonify, send_from_directory
<span class="hljs-keyword">from</span> openai <span class="hljs-keyword">import</span> OpenAI
<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient
<span class="hljs-keyword">import</span> json
<span class="hljs-keyword">import</span> os
<span class="hljs-keyword">import</span> sys
--- CONFIG ---
Explicitly <span class="hljs-built_in">set</span> the folder to where this script <span class="hljs-keyword">is</span> located
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
OpenAI Embedding Config
OPENAI_API_KEY = os.getenv(<span class="hljs-string">&quot;OPENAI_API_KEY&quot;</span>)
OPENAI_BASE_URL = <span class="hljs-string">&quot;https://api.openai.com/v1&quot;</span>
OPENAI_EMBEDDING_MODEL = <span class="hljs-string">&quot;text-embedding-3-small&quot;</span>
Milvus Config
MILVUS_URI = <span class="hljs-string">&quot;http://localhost:19530&quot;</span>
COLLECTION_NAME = <span class="hljs-string">&quot;golem_memories&quot;</span>
These <span class="hljs-keyword">match</span> the files generated by ingest.py
JSON_FILE = <span class="hljs-string">&quot;golem_cortex.json&quot;</span>
UPDATED: Matches your new repo filename
HTML_FILE = <span class="hljs-string">&quot;index.html&quot;</span>
app = Flask(__name__, static_folder=BASE_DIR)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;\n🧠 PROJECT GOLEM SERVER&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   📂 Serving from: <span class="hljs-subst">{BASE_DIR}</span>&quot;</span>)
--- DIAGNOSTICS ---
Check <span class="hljs-keyword">if</span> files exist before starting
missing_files = []
<span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> os.path.exists(os.path.join(BASE_DIR, JSON_FILE)):
missing_files.append(JSON_FILE)
<span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> os.path.exists(os.path.join(BASE_DIR, HTML_FILE)):
missing_files.append(HTML_FILE)
<span class="hljs-keyword">if</span> missing_files:
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   ❌ CRITICAL ERROR: Missing files in this folder:&quot;</span>)
<span class="hljs-keyword">for</span> f <span class="hljs-keyword">in</span> missing_files:
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;      - <span class="hljs-subst">{f}</span>&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;   👉 Did you run &#x27;python ingest.py&#x27; successfully?&quot;</span>)
sys.exit(<span class="hljs-number">1</span>)
<span class="hljs-keyword">else</span>:
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   ✅ Files Verified: Cortex Map found.&quot;</span>)
Check API Key
<span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> OPENAI_API_KEY:
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   ❌ CRITICAL ERROR: OPENAI_API_KEY environment variable not set!&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;   👉 Run: export OPENAI_API_KEY=&#x27;your-key-here&#x27;&quot;</span>)
sys.exit(<span class="hljs-number">1</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   ↳ Using OpenAI Embedding: <span class="hljs-subst">{OPENAI_EMBEDDING_MODEL}</span>&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;   ↳ Connecting to Milvus...&quot;</span>)
milvus_client = MilvusClient(uri=MILVUS_URI)
Verify collection exists
<span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> milvus_client.has_collection(COLLECTION_NAME):
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   ❌ CRITICAL ERROR: Collection &#x27;<span class="hljs-subst">{COLLECTION_NAME}</span>&#x27; not found in Milvus.&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;   👉 Did you run &#x27;python ingest.py&#x27; successfully?&quot;</span>)
sys.exit(<span class="hljs-number">1</span>)
Initialize OpenAI client
openai_client = OpenAI(api_key=OPENAI_API_KEY, base_url=OPENAI_BASE_URL)
--- ROUTES ---
<span class="hljs-meta">@app.route(<span class="hljs-params"><span class="hljs-string">&#x27;/&#x27;</span></span>)</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">root</span>():
Force serve the specific HTML file
<span class="hljs-keyword">return</span> send_from_directory(BASE_DIR, HTML_FILE)
<span class="hljs-meta">@app.route(<span class="hljs-params"><span class="hljs-string">&#x27;/&#x27;</span></span>)</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">serve_static</span>(<span class="hljs-params">filename</span>):
<span class="hljs-keyword">return</span> send_from_directory(BASE_DIR, filename)
<span class="hljs-meta">@app.route(<span class="hljs-params"><span class="hljs-string">&#x27;/query&#x27;</span>, methods=[<span class="hljs-string">&#x27;POST&#x27;</span>]</span>)</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">query_brain</span>():
data = request.json
text = data.get(<span class="hljs-string">&#x27;query&#x27;</span>, <span class="hljs-string">&#x27;&#x27;</span>)
<span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> text: <span class="hljs-keyword">return</span> jsonify({<span class="hljs-string">&quot;indices&quot;</span>: []})
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;🔎 Query: <span class="hljs-subst">{text}</span>&quot;</span>)
Get query embedding <span class="hljs-keyword">from</span> OpenAI
response = openai_client.embeddings.create(
model=OPENAI_EMBEDDING_MODEL,
<span class="hljs-built_in">input</span>=text
)
query_vec = response.data[<span class="hljs-number">0</span>].embedding
Search <span class="hljs-keyword">in</span> Milvus
results = milvus_client.search(
collection_name=COLLECTION_NAME,
data=[query_vec],
limit=<span class="hljs-number">50</span>,
output_fields=[<span class="hljs-string">&quot;id&quot;</span>]
)
Extract indices <span class="hljs-keyword">and</span> scores
indices = [r[<span class="hljs-string">&#x27;id&#x27;</span>] <span class="hljs-keyword">for</span> r <span class="hljs-keyword">in</span> results[<span class="hljs-number">0</span>]]
scores = [r[<span class="hljs-string">&#x27;distance&#x27;</span>] <span class="hljs-keyword">for</span> r <span class="hljs-keyword">in</span> results[<span class="hljs-number">0</span>]]
<span class="hljs-keyword">return</span> jsonify({
<span class="hljs-string">&quot;indices&quot;</span>: indices,
<span class="hljs-string">&quot;scores&quot;</span>: scores
})
<span class="hljs-keyword">if</span> __name__ == <span class="hljs-string">&#x27;__main__&#x27;</span>:
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;   ✅ SYSTEM ONLINE: http://localhost:8000&quot;</span>)
app.run(port=<span class="hljs-number">8000</span>)
<button class="copy-code-btn"></button></code></pre>
<p>데이터 집합을 다운로드하여 지정된 디렉터리에 배치합니다.</p>
<pre><code translate="no">https://github.com/milvus-io/milvus-docs/tree/v2.6.x/site/en
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/debugging_rag_in_3d_with_projectgolem_and_milvus_4_3d17b01fec.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="3-Start-the-project" class="common-anchor-header">3. 프로젝트 시작</h3><p>텍스트 임베딩을 3D 공간으로 변환하기</p>
<pre><code translate="no">python ingest.py
<button class="copy-code-btn"></button></code></pre>
<p>[이미지]</p>
<p>프론트엔드 서비스 시작</p>
<pre><code translate="no">python GolemServer.py
<button class="copy-code-btn"></button></code></pre>
<h3 id="4-Visualization-and-Interaction" class="common-anchor-header">4. 시각화 및 상호 작용</h3><p>프론트엔드에서 검색 결과를 수신한 후 코사인 유사도 점수를 기반으로 노드 밝기가 조정되며, 명확한 카테고리 클러스터를 유지하기 위해 원래 노드 색상은 유지됩니다. 쿼리 지점에서 일치하는 각 노드까지 반투명 선이 그려지고, 카메라가 부드럽게 이동 및 확대/축소하여 활성화된 클러스터에 초점을 맞춥니다.</p>
<h4 id="Example-1-In-Domain-Match" class="common-anchor-header">예제 1: 도메인 내 일치</h4><p>쿼리: "Milvus는 어떤 인덱스 유형을 지원하나요?"</p>
<p>시각화 동작:</p>
<ul>
<li><p>3D 공간에서 인덱스라고 표시된 빨간색 클러스터 내의 약 15개 노드가 눈에 띄게 밝기가 증가(약 2~3배)한 것을 볼 수 있습니다.</p></li>
<li><p>일치하는 노드에는 index_types.md, hnsw_index.md, ivf_index.md와 같은 문서의 청크가 포함됩니다.</p></li>
<li><p>쿼리 벡터에서 일치하는 각 노드까지 반투명 선이 렌더링되며, 카메라는 빨간색 클러스터에 부드럽게 초점을 맞춥니다.</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/debugging_rag_in_3d_with_projectgolem_and_milvus_2_c2522b6a67.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h4 id="Example-2-Out-of-Domain-Query-Rejection" class="common-anchor-header">예제 2: 도메인 외부 쿼리 거부</h4><p>쿼리: "KFC 밸류 메뉴는 얼마인가요?"</p>
<p>시각화 동작:</p>
<ul>
<li><p>모든 노드는 원래 색상을 유지하며 약간의 크기 변화(1.1배 미만)만 있습니다.</p></li>
<li><p>일치하는 노드가 여러 클러스터에 서로 다른 색상으로 흩어져 있어 명확한 의미 집중도가 나타나지 않습니다.</p></li>
<li><p>유사성 임계값(0.5)이 충족되지 않으므로 카메라가 초점 동작을 트리거하지 않습니다.</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/debugging_rag_in_3d_with_projectgolem_and_milvus_3_39b9383771.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
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
    </button></h2><p>Milvus와 결합된 Project_Golem은 기존 RAG 평가 파이프라인을 대체하지는 않지만, 대부분의 파이프라인에 없는 기능인 벡터 공간 내부에서 일어나는 일을 볼 수 있는 기능을 추가합니다.</p>
<p>이 설정을 사용하면 잘못된 임베딩으로 인한 검색 실패, 잘못된 청킹으로 인한 검색 실패, 임계값이 약간 너무 빡빡해서 발생하는 검색 실패를 구분할 수 있습니다. 예전에는 이런 종류의 진단을 하려면 추측과 반복이 필요했습니다. 이제 눈으로 확인할 수 있습니다.</p>
<p>현재 통합은 데모 규모(최대 10,000개 문서)의 대화형 디버깅을 지원하며, Milvus 벡터 데이터베이스가 백그라운드에서 프로덕션급 검색을 처리합니다. 백만 개 규모의 시각화로 가는 길은 매핑되어 있지만 아직 구축되지 않았으므로 지금이 바로 참여하기에 좋은 시기입니다.</p>
<p>GitHub에서 <a href="https://github.com/CyberMagician/Project_Golem">Project_Golem을</a> 확인하고, 자신의 데이터 집합으로 사용해 보고, 벡터 공간이 실제로 어떻게 보이는지 확인해 보세요.</p>
<p>궁금한 점이 있거나 찾은 내용을 공유하고 싶다면 <a href="https://milvusio.slack.com/join/shared_invite/zt-3nntzngkz-gYwhrdSE4~76k0VMyBfD1Q#/shared-invite/email">Slack 채널에</a> 참여하거나 <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">Milvus 오피스 아워</a> 세션에 예약하여 설정에 대한 실습 가이드를 받아보세요.</p>
