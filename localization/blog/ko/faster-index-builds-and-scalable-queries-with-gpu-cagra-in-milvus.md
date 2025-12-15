---
id: faster-index-builds-and-scalable-queries-with-gpu-cagra-in-milvus.md
title: 'Milvus에서 NVIDIA CAGRA 최적화: 더 빠른 인덱싱과 더 저렴한 쿼리를 위한 하이브리드 GPU-CPU 접근 방식'
author: Marcelo Chen
date: 2025-12-10T00:00:00.000Z
cover: assets.zilliz.com/CAGRA_cover_7b9675965f.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus2.6, CAGRA, GPU, CPU, graph-based index'
meta_title: |
  Optimizing CAGRA in Milvus: A Hybrid GPU–CPU Approach
desc: >-
  Milvus 2.6의 GPU_CAGRA가 빠른 그래프 구성을 위해 GPU를 사용하고 확장 가능한 쿼리 제공을 위해 CPU를 사용하는 방법을
  알아보세요.
origin: >-
  https://milvus.io/blog/faster-index-builds-and-scalable-queries-with-gpu-cagra-in-milvus.md
---
<p>AI 시스템이 실험 단계에서 프로덕션 인프라로 이동함에 따라 벡터 데이터베이스는 더 이상 수백만 개의 임베딩을 처리하지 않습니다. <strong>이제 수십억 개는 일상적이며, 수백억 개는 점점 더 일반화되고 있습니다.</strong> 이러한 규모에서는 알고리즘 선택이 성능과 리콜에 영향을 미칠 뿐만 아니라 인프라 비용으로 직결됩니다.</p>
<p>따라서 대규모 배포의 핵심 질문은 <strong>컴퓨팅 리소스 사용량을 통제 불능 상태로 만들지 않으면서 적절한 리콜과 지연 시간을 제공하는 올바른 인덱스를 어떻게 선택하느냐는</strong> 것입니다 <strong>.</strong></p>
<p><strong>NSW, HNSW, CAGRA, Vamana와</strong> 같은 그래프 기반 인덱스가 가장 널리 채택되고 있습니다. 이러한 인덱스는 미리 구축된 이웃 그래프를 탐색함으로써 10억 개 규모로 가장 가까운 이웃을 빠르게 검색할 수 있게 해주며, 모든 벡터를 쿼리와 비교하는 무차별 검색을 피할 수 있습니다.</p>
<p>하지만 이 접근 방식의 비용 프로필은 고르지 않습니다. <strong>그래프를 쿼리하는 것은 상대적으로 저렴하지만 그래프를 구축하는 것은 그렇지 않습니다.</strong> 고품질 그래프를 구축하려면 전체 데이터 세트에 걸쳐 대규모 거리 계산과 반복적인 세분화가 필요하며, 이는 데이터가 증가함에 따라 기존 CPU 리소스로는 효율적으로 처리하기 어려운 워크로드입니다.</p>
<p>NVIDIA의 CAGRA는 GPU를 사용하여 대규모 병렬 처리를 통해 그래프 구축을 가속화함으로써 이러한 병목 현상을 해결합니다. 이렇게 하면 빌드 시간이 크게 단축되지만, 인덱스 구성과 쿼리 제공 모두에 GPU를 사용하면 프로덕션 환경에서는 비용과 확장성 제약이 높아집니다.</p>
<p>이러한 장단점의 균형을 맞추기 위해 <a href="https://milvus.io/docs/release_notes.md#v261">Milvus 2.6.1은</a> <a href="https://milvus.io/docs/gpu-cagra.md">GPU_CAGRA</a> <strong>인덱스에</strong> <strong>하이브리드 설계를 채택했습니다</strong>: <strong>GPU는 그래프 구성에만 사용되며 쿼리 실행은 CPU에서 실행됩니다.</strong> 이는 GPU로 구축된 그래프의 품질 이점을 유지하면서 쿼리 서비스의 확장성과 비용 효율성을 유지하므로, 데이터 업데이트가 빈번하지 않고 쿼리 양이 많으며 비용에 매우 민감한 워크로드에 특히 적합합니다.</p>
<h2 id="What-Is-CAGRA-and-How-Does-It-Work" class="common-anchor-header">CAGRA란 무엇이며 어떻게 작동하나요?<button data-href="#What-Is-CAGRA-and-How-Does-It-Work" class="anchor-icon" translate="no">
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
    </button></h2><p>그래프 기반 벡터 인덱스는 일반적으로 크게 두 가지 범주로 나뉩니다:</p>
<ul>
<li><p><strong>반복적 그래프 구성</strong>: <strong>CAGRA로</strong> 대표되는<strong>반복적 그래프 구성</strong>(Milvus에서 이미 지원됨).</p></li>
<li><p><strong>삽입 기반 그래프 구성은</strong> <strong>Vamana로</strong> 대표되며 현재 Milvus에서 개발 중입니다.</p></li>
</ul>
<p>이 두 가지 접근 방식은 설계 목표와 기술적 기반이 크게 다르기 때문에 각각 다른 데이터 규모와 워크로드 패턴에 적합합니다.</p>
<p><strong>NVIDIA CAGRA(CUDA ANN 그래프 기반)</strong> 는 대규모 근접 그래프를 효율적으로 구축하고 쿼리하기 위해 설계된 근사 근사 이웃(ANN) 검색을 위한 GPU 네이티브 알고리즘입니다. GPU 병렬 처리를 활용함으로써 CAGRA는 그래프 구축을 크게 가속화하고 HNSW와 같은 CPU 기반 접근 방식에 비해 높은 처리량의 쿼리 성능을 제공합니다.</p>
<p>CAGRA는 반복적인 세분화를 통해 k-최근접 이웃(kNN) 그래프를 구축하는 <strong>NN-Descent(Nearest Neighbor Descent)</strong> 알고리즘을 기반으로 구축되었습니다. 각 반복에서 후보 이웃이 평가되고 업데이트되어 데이터 세트 전체에서 점차 더 높은 품질의 이웃 관계를 향해 수렴합니다.</p>
<p>각 개선 라운드가 끝나면 CAGRA는 <strong>2홉</strong>우회 가지치기와 같은 추가 그래프 가지치기 기술을 적용하여 검색 품질을 유지하면서 중복 에지를 제거합니다. 이러한 반복적인 정제 및 가지치기의 조합은 쿼리 시점에 효율적으로 트래버스할 수 있는 <strong>간결하면서도 잘 연결된 그래프를</strong> 만들어냅니다.</p>
<p>반복적인 정제 및 가지치기를 통해 CAGRA는 <strong>대규모에서 높은 회상률과 짧은 지연 시간의 최인접 이웃 검색을</strong> 지원하는 그래프 구조를 생성하므로 정적이거나 자주 업데이트되지 않는 데이터 세트에 특히 적합합니다.</p>
<h3 id="Step-1-Building-the-Initial-Graph-with-NN-Descent" class="common-anchor-header">1단계: NN-Descent로 초기 그래프 구축하기</h3><p>노드 <em>u가</em> <em>v의</em> 이웃이고 노드 <em>w가</em> <em>u의</em> 이웃인 경우, <em>w</em> 역시 <em>v의</em> 이웃일 가능성이 매우 높다는 간단하지만 강력한 관찰에 기반한 것이 NN-Descent입니다. 이 전이적 속성을 통해 알고리즘은 모든 벡터 쌍을 일일이 비교하지 않고도 효율적으로 실제 가장 가까운 이웃을 발견할 수 있습니다.</p>
<p>CAGRA는 핵심 그래프 구성 알고리즘으로 NN-Descent를 사용합니다. 프로세스는 다음과 같이 작동합니다:</p>
<p><strong>1. 무작위 초기화:</strong> 각 노드는 무작위로 선택된 작은 이웃 집합으로 시작하여 대략적인 초기 그래프를 형성합니다.</p>
<p><strong>2. 이웃 확장:</strong> 각 반복에서 노드는 현재 이웃과 그 이웃의 이웃을 모아 후보 목록을 형성합니다. 알고리즘은 노드와 모든 후보 간의 유사성을 계산합니다. 각 노드의 후보 목록은 독립적이므로 이러한 계산을 별도의 GPU 스레드 블록에 할당하고 대규모로 병렬로 실행할 수 있습니다.</p>
<p><strong>3. 후보 목록 업데이트:</strong> 알고리즘이 노드의 현재 이웃보다 더 가까운 후보를 찾으면 더 먼 이웃을 교체하고 노드의 kNN 목록을 업데이트합니다. 이 과정을 여러 번 반복하면 훨씬 더 높은 품질의 대략적인 kNN 그래프가 생성됩니다.</p>
<p><strong>4. 수렴 확인:</strong> 반복이 진행됨에 따라 더 적은 수의 이웃 업데이트가 발생합니다. 업데이트되는 연결 수가 설정된 임계값 아래로 떨어지면 알고리즘이 중지되며, 이는 그래프가 효과적으로 안정화되었음을 나타냅니다.</p>
<p>서로 다른 노드에 대한 이웃 확장 및 유사도 계산은 완전히 독립적이기 때문에 CAGRA는 각 노드의 NN-Descent 워크로드를 전용 GPU 스레드 블록에 매핑합니다. 이러한 설계는 대규모 병렬 처리를 가능하게 하고 기존 CPU 기반 방식보다 훨씬 빠른 그래프 구성을 가능하게 합니다.</p>
<h3 id="Step-2-Pruning-the-Graph-with-2-Hop-Detours" class="common-anchor-header">2단계: 2홉 우회로 그래프 가지치기</h3><p>NN-Descent가 완료되면 결과 그래프는 정확하지만 지나치게 밀도가 높습니다. NN-Descent는 의도적으로 여분의 후보 이웃을 유지하며, 무작위 초기화 단계에서는 약하거나 관련 없는 에지가 많이 발생합니다. 그 결과, 각 노드는 목표 차수보다 두 배 또는 몇 배 더 높은 차수로 끝나는 경우가 많습니다.</p>
<p>간결하고 효율적인 그래프를 생성하기 위해 CAGRA는 2홉 우회 가지치기를 적용합니다.</p>
<p>노드 <em>A가</em> 공유 이웃인 <em>C를</em> 통해 간접적으로 노드 <em>B에</em> 도달할 수 있고(A → C → B 경로를 형성) 이 간접 경로의 거리가 <em>A와</em> <em>B</em> 사이의 직접 거리와 비슷하다면, 직접 에지 A → B는 중복된 것으로 간주되어 제거할 수 있습니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2_hop_detours_d15eae8702.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>이 가지치기 전략의 주요 장점은 각 에지의 중복성 검사가 로컬 정보, 즉 두 엔드포인트와 공유 이웃 간의 거리에만 의존한다는 것입니다. 모든 에지를 독립적으로 평가할 수 있기 때문에 가지치기 단계는 고도로 병렬화할 수 있으며 GPU 일괄 실행에 자연스럽게 맞습니다.</p>
<p>그 결과, CAGRA는 GPU에서 그래프를 효율적으로 가지치기하여 스토리지 오버헤드를 <strong>40~50%까지</strong> 줄이면서도 검색 정확도를 유지하고 쿼리 실행 중 탐색 속도를 향상시킬 수 있습니다.</p>
<h2 id="GPUCAGRA-in-Milvus-What’s-Different" class="common-anchor-header">Milvus의 GPU_CAGRA: 무엇이 다른가요?<button data-href="#GPUCAGRA-in-Milvus-What’s-Different" class="anchor-icon" translate="no">
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
    </button></h2><p>GPU는 그래프 구성에 큰 성능 이점을 제공하지만, 프로덕션 환경에서는 현실적인 문제에 직면하게 됩니다: GPU 리소스는 CPU보다 훨씬 더 비싸고 제한적입니다. 인덱스 구축과 쿼리 실행이 모두 GPU에만 의존하는 경우, 몇 가지 운영상의 문제가 빠르게 드러납니다:</p>
<ul>
<li><p><strong>낮은 리소스 사용률:</strong> 쿼리 트래픽은 종종 불규칙하고 폭주하는 경우가 많기 때문에 GPU가 장시간 유휴 상태로 남아 값비싼 컴퓨팅 용량을 낭비하게 됩니다.</p></li>
<li><p><strong>높은 배포 비용:</strong> 대부분의 쿼리가 GPU 성능을 완전히 활용하지 않음에도 불구하고 모든 쿼리 서비스 인스턴스에 GPU를 할당하면 하드웨어 비용이 증가합니다.</p></li>
<li><p><strong>제한된 확장성:</strong> 사용 가능한 GPU 수에 따라 실행할 수 있는 서비스 복제본 수가 직접적으로 제한되므로 수요에 따라 확장할 수 있는 능력이 제한됩니다.</p></li>
<li><p><strong>유연성 감소:</strong> 인덱스 구축과 쿼리가 모두 GPU에 의존하는 경우, 시스템은 GPU 가용성에 묶이게 되고 워크로드를 CPU로 쉽게 전환할 수 없게 됩니다.</p></li>
</ul>
<p>이러한 제약을 해결하기 위해 Milvus 2.6.1에서는 <code translate="no">adapt_for_cpu</code> 매개변수를 통해 GPU_CAGRA 인덱스에 대한 유연한 배포 모드를 도입했습니다. 이 모드는 하이브리드 워크플로우를 가능하게 합니다: CAGRA는 GPU를 사용해 고품질 그래프 인덱스를 구축하는 반면, 쿼리 실행은 CPU에서 실행되며, 일반적으로 검색 알고리즘으로 HNSW를 사용합니다.</p>
<p>이 설정에서 GPU는 가장 가치 있는 부분, 즉 빠르고 정확한 인덱스 구축에 사용되는 반면, CPU는 훨씬 더 비용 효율적이고 확장 가능한 방식으로 대규모 쿼리 워크로드를 처리합니다.</p>
<p>따라서 이 하이브리드 접근 방식은 특히 다음과 같은 워크로드에 적합합니다:</p>
<ul>
<li><p><strong>데이터 업데이트가 빈번하지</strong> 않아 인덱스 재구축이 드문 경우</p></li>
<li><p><strong>쿼리 볼륨이 높아서</strong> 저렴한 복제본이 많이 필요한 경우</p></li>
<li><p><strong>비용 민감도가 높고</strong> GPU 사용량을 엄격하게 제어해야 하는 경우</p></li>
</ul>
<h3 id="Understanding-adaptforcpu" class="common-anchor-header">이해 <code translate="no">adapt_for_cpu</code></h3><p>Milvus에서 <code translate="no">adapt_for_cpu</code> 매개변수는 인덱스 구축 중에 CAGRA 인덱스가 디스크에 직렬화되는 방식과 로드 시 메모리로 역직렬화되는 방식을 제어합니다. 빌드 시점과 로드 시점에 이 설정을 변경함으로써 Milvus는 GPU 기반 인덱스 구성과 CPU 기반 쿼리 실행 간에 유연하게 전환할 수 있습니다.</p>
<p>빌드 시와 로드 시 <code translate="no">adapt_for_cpu</code> 의 다양한 조합은 각각 특정 운영 시나리오에 맞게 설계된 네 가지 실행 모드를 생성합니다.</p>
<table>
<thead>
<tr><th style="text-align:center"><strong>빌드 시간 (<code translate="no">adapt_for_cpu</code>)</strong></th><th style="text-align:center"><strong>로드 시간 (<code translate="no">adapt_for_cpu</code>)</strong></th><th style="text-align:center"><strong>실행 로직</strong></th><th style="text-align:center"><strong>권장 시나리오</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center"><strong>true</strong></td><td style="text-align:center"><strong>true</strong></td><td style="text-align:center">GPU_CAGRA로 빌드 → HNSW로 직렬화 → HNSW로 역직렬화 → <strong>CPU 쿼리</strong>.</td><td style="text-align:center">비용에 민감한 워크로드, 대규모 쿼리 제공</td></tr>
<tr><td style="text-align:center"><strong>true</strong></td><td style="text-align:center"><strong>false</strong></td><td style="text-align:center">GPU_CAGRA로 빌드 → HNSW로 직렬화 → HNSW로 역직렬화 → <strong>CPU 쿼리</strong>.</td><td style="text-align:center">매개변수 불일치 발생 시 실행 중인 쿼리가 CPU로 되돌아감</td></tr>
<tr><td style="text-align:center"><strong>false</strong></td><td style="text-align:center"><strong>true</strong></td><td style="text-align:center">GPU_CAGRA로 빌드 → CAGRA로 직렬화 → HNSW로 역직렬화 → <strong>CPU 쿼리</strong>.</td><td style="text-align:center">임시 CPU 검색을 활성화하면서 저장용 원본 CAGRA 인덱스 유지</td></tr>
<tr><td style="text-align:center"><strong>false</strong></td><td style="text-align:center"><strong>false</strong></td><td style="text-align:center">GPU_CAGRA로 빌드 → CAGRA로 직렬화 → CAGRA로 역직렬화 → <strong>GPU 쿼리 수행</strong></td><td style="text-align:center">비용은 부차적인 문제인 성능 크리티컬 워크로드</td></tr>
</tbody>
</table>
<p><strong>참고:</strong> <code translate="no">adapt_for_cpu</code> 메커니즘은 단방향 변환만 지원합니다. CAGRA 그래프 구조는 HNSW가 필요로 하는 모든 이웃 관계를 보존하기 때문에 CAGRA 인덱스를 HNSW로 변환할 수 있습니다. 그러나 HNSW 인덱스는 GPU 기반 쿼리에 필요한 추가 구조 정보가 부족하기 때문에 다시 CAGRA로 변환할 수 없습니다. 따라서 장기적인 배포 및 쿼리 요구 사항을 고려하여 빌드 시간 설정을 신중하게 선택해야 합니다.</p>
<h2 id="Putting-GPUCAGRA-to-the-Test" class="common-anchor-header">GPU_CAGRA 테스트하기<button data-href="#Putting-GPUCAGRA-to-the-Test" class="anchor-icon" translate="no">
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
    </button></h2><p>인덱스 구축에는 GPU를 사용하고 쿼리 실행에는 CPU를 사용하는 하이브리드 실행 모델의 효율성을 평가하기 위해, 표준화된 환경에서 일련의 통제된 실험을 수행했습니다. 이 평가는 <strong>인덱스 구축 성능</strong>, <strong>쿼리 성능</strong>, <strong>리콜 정확도의</strong> 세 가지 차원에 초점을 맞췄습니다.</p>
<p><strong>실험 설정</strong></p>
<p>실험은 결과가 신뢰할 수 있고 광범위하게 적용될 수 있도록 널리 채택된 업계 표준 하드웨어에서 수행되었습니다.</p>
<ul>
<li><p>CPU: MD EPYC 7R13 프로세서(16코어)</p></li>
<li><p>GPU: NVIDIA L4</p></li>
</ul>
<h3 id="1-Index-Build-Performance" class="common-anchor-header">1. 인덱스 빌드 성능</h3><p>동일한 목표 그래프 수준인 64에서 GPU에 구축된 CAGRA와 CPU에 구축된 HNSW를 비교합니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/cp1_a177200ab2.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>주요 결과</strong></p>
<ul>
<li><p><strong>GPU CAGRA는 CPU HNSW보다 12~15배 빠르게 인덱스를 빌드합니다.</strong> Cohere1M과 Gist1M 모두에서 GPU 기반 CAGRA는 CPU 기반 HNSW를 크게 능가하며 그래프 구축 시 GPU 병렬 처리의 효율성을 강조합니다.</p></li>
<li><p><strong>빌드 시간은 NN-Descent 반복에 따라 선형적으로 증가합니다.</strong> 반복 횟수가 증가함에 따라 빌드 시간은 거의 선형적인 방식으로 증가하며, 이는 NN-Descent의 반복적인 개선 특성을 반영하고 빌드 비용과 그래프 품질 간의 예측 가능한 균형을 제공합니다.</p></li>
</ul>
<h3 id="2-Query-performance" class="common-anchor-header">2. 쿼리 성능</h3><p>이 실험에서는 CAGRA 그래프를 GPU에서 한 번 빌드한 다음 두 가지 다른 실행 경로를 사용하여 쿼리합니다:</p>
<ul>
<li><p><strong>CPU 쿼리</strong>: 인덱스가 HNSW 형식으로 역직렬화되어 CPU에서 검색됩니다.</p></li>
<li><p><strong>GPU 쿼리</strong>: GPU 기반 트래버스를 사용하여 CAGRA 그래프에서 직접 검색 실행</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/cp2_bd00e60553.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>주요 결과</strong></p>
<ul>
<li><p><strong>GPU 검색 처리량은 CPU 검색보다 5~6배 더 높습니다.</strong> Cohere1M과 Gist1M 모두에서 GPU 기반 탐색은 훨씬 더 높은 QPS를 제공하며, GPU에서 병렬 그래프 탐색의 효율성을 강조합니다.</p></li>
<li><p><strong>리콜은 NN-Descent 반복에 따라 증가하다가 정체됩니다.</strong> 빌드 반복 횟수가 증가함에 따라 CPU와 GPU 쿼리 모두에서 리콜이 향상됩니다. 그러나 특정 지점을 넘어가면 반복을 추가할수록 이득이 감소하여 그래프 품질이 대체로 수렴한다는 것을 나타냅니다.</p></li>
</ul>
<h3 id="3-Recall-accuracy" class="common-anchor-header">3. 리콜 정확도</h3><p>이 실험에서는 동일한 쿼리 조건에서 리콜을 비교하기 위해 CPU에서 CAGRA와 HNSW를 모두 쿼리했습니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/cp3_1a46a7bdda.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>주요 결과</strong></p>
<p><strong>두 데이터 세트 모두에서 CAGRA가 HNSW보다 높은 정확도를 달성하여</strong>, CAGRA 인덱스가 GPU에 구축되어 CPU 검색을 위해 역직렬화된 경우에도 그래프 품질이 잘 보존된다는 것을 보여줍니다.</p>
<h2 id="What’s-Next-Scaling-Index-Construction-with-Vamana" class="common-anchor-header">다음 단계: Vamana를 사용한 인덱스 구축 확장<button data-href="#What’s-Next-Scaling-Index-Construction-with-Vamana" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus의 하이브리드 GPU-CPU 접근 방식은 오늘날의 대규모 벡터 검색 워크로드를 위한 실용적이고 비용 효율적인 솔루션을 제공합니다. GPU에서 고품질 CAGRA 그래프를 구축하고 CPU에서 쿼리를 처리함으로써 빠른 인덱스 구축과 확장 가능하고 경제적인 쿼리 실행을 결합하여, 특히<strong>업데이트가 빈번하지 않고 쿼리량이 많으며 비용 제약이 엄격한 워크로드에 적합합니다.</strong></p>
<p><strong>수백억 또는 수천억 개의 벡터와</strong>같은 훨씬 더 큰 규모에서는<strong>인덱스</strong>구성 자체가 병목 현상이 됩니다. 전체 데이터 세트가 더 이상 GPU 메모리에 맞지 않을 때, 업계에서는 일반적으로 <strong>Vamana와</strong> 같은 <strong>삽입 기반 그래프 구축</strong> 방법을 사용합니다. Vamana는 그래프를 한 번에 구축하는 대신 데이터를 일괄적으로 처리하여 글로벌 연결성을 유지하면서 새로운 벡터를 점진적으로 삽입합니다.</p>
<p>구축 파이프라인은 세 가지 주요 단계를 따릅니다:</p>
<p><strong>1. 기하학적 배치 증가</strong> - 작은 배치로 시작하여 골격 그래프를 형성한 다음, 배치 크기를 늘려 병렬성을 극대화하고 마지막으로 대규모 배치를 사용하여 세부 사항을 다듬습니다.</p>
<p><strong>2.</strong> 탐욕스러운<strong>삽입</strong> - 각각의 새 노드는 중앙 진입점에서 탐색하여 이웃 집합을 반복적으로 다듬어 삽입합니다.</p>
<p><strong>3.</strong> 역방향<strong>에지 업데이트</strong> - 대칭을 유지하고 효율적인 그래프 탐색을 보장하기 위해 역방향 연결을 추가합니다.</p>
<p>가지 치기는 α-RNG 기준을 사용하여 구성 프로세스에 직접 통합됩니다. 후보 이웃 <em>v가</em> 이미 기존 이웃 <em>p′에</em> 의해 커버되는 경우(즉, <em>d(p′, v) &lt; α × d(p, v)</em>), <em>v가</em> 가지 치기됩니다. 파라미터 α를 통해 희소성과 정확도를 정밀하게 제어할 수 있습니다. GPU 가속은 배치 내 병렬 처리와 기하학적 배치 스케일링을 통해 이루어지며, 인덱스 품질과 처리량 간의 균형을 유지합니다.</p>
<p>이러한 기술을 함께 사용하면 팀은 GPU 메모리 제한에 부딪히지 않고도 빠른 데이터 증가와 대규모 인덱스 업데이트를 처리할 수 있습니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/One_more_thing_b458360e25.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Milvus 팀은 2026년 상반기를 목표로 Vamana 지원을 적극적으로 구축하고 있습니다. 계속 지켜봐 주세요.</p>
<p>최신 Milvus의 기능에 대해 궁금한 점이 있거나 자세히 알아보고 싶으신가요?<a href="https://discord.com/invite/8uyFbECzPX"> Discord 채널에</a> 참여하거나<a href="https://github.com/milvus-io/milvus"> GitHub에</a> 이슈를 제출하세요. 또한<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus 오피스 아워를</a> 통해 20분간의 일대일 세션을 예약하여 인사이트, 안내 및 질문에 대한 답변을 얻을 수 있습니다.</p>
<h2 id="Learn-More-about-Milvus-26-Features" class="common-anchor-header">Milvus 2.6 기능에 대해 자세히 알아보기<button data-href="#Learn-More-about-Milvus-26-Features" class="anchor-icon" translate="no">
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
<li><p><a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md">Milvus 2.6 소개: 10억 개 규모의 경제적인 벡터 검색</a></p></li>
<li><p><a href="https://milvus.io/blog/data-in-and-data-out-in-milvus-2-6.md">임베딩 기능을 소개합니다: Milvus 2.6이 벡터화 및 시맨틱 검색을 간소화하는 방법</a></p></li>
<li><p><a href="https://milvus.io/blog/json-shredding-in-milvus-faster-json-filtering-with-flexibility.md">Milvus의 JSON 파쇄: 유연성을 갖춘 88.9배 더 빠른 JSON 필터링</a></p></li>
<li><p><a href="https://milvus.io/blog/unlocking-true-entity-level-retrieval-new-array-of-structs-and-max-sim-capabilities-in-milvus.md">진정한 엔티티 수준 검색을 실현합니다: Milvus의 새로운 구조 배열 및 MAX_SIM 기능</a></p></li>
<li><p><a href="https://milvus.io/blog/minhash-lsh-in-milvus-the-secret-weapon-for-fighting-duplicates-in-llm-training-data.md">Milvus의 MinHash LSH: LLM 훈련 데이터의 중복을 방지하는 비밀 무기 </a></p></li>
<li><p><a href="https://milvus.io/blog/bring-vector-compression-to-the-extreme-how-milvus-serves-3%C3%97-more-queries-with-rabitq.md">벡터 압축을 극한으로 끌어올리기: Milvus가 RaBitQ로 3배 더 많은 쿼리를 처리하는 방법</a></p></li>
<li><p><a href="https://milvus.io/blog/benchmarks-lie-vector-dbs-deserve-a-real-test.md">벤치마크는 거짓말 - 벡터 DB는 실제 테스트가 필요합니다. </a></p></li>
<li><p><a href="https://milvus.io/blog/we-replaced-kafka-pulsar-with-a-woodpecker-for-milvus.md">Milvus를 위해 카프카/펄서를 딱따구리로 대체했습니다.</a></p></li>
</ul>
