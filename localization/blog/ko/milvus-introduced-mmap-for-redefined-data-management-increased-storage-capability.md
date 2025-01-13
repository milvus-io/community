---
id: >-
  milvus-introduced-mmap-for-redefined-data-management-increased-storage-capability.md
title: 'Milvus, 재정의된 데이터 관리 및 향상된 스토리지 기능을 위한 MMap 도입'
author: Yang Cen
date: 2023-11-15T00:00:00.000Z
desc: >-
  Milvus MMap 기능은 사용자가 제한된 메모리 내에서 더 많은 데이터를 처리할 수 있도록 지원하여 성능, 비용, 시스템 한계 사이의
  미묘한 균형을 유지합니다.
cover: assets.zilliz.com/Exploring_M_Map_5086d652bd.png
tag: Engineering
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Vector Management, MMap, Data Management, Vector Embeddings
recommend: true
canonicalUrl: >-
  https://zilliz.com/blog/milvus-introduced-mmap-for-redefined-data-management-increased-storage-capability
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Exploring_M_Map_5086d652bd.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><a href="https://zilliz.com/what-is-milvus">Milvus는</a> 오픈 소스 <a href="https://zilliz.com/blog/what-is-a-real-vector-database">벡터 데이터베이스</a> 중 가장 빠른 솔루션으로, 성능에 대한 요구 사항이 집중적인 사용자에게 적합합니다. 하지만 사용자 요구사항의 다양성은 작업하는 데이터의 다양성을 반영합니다. 일부는 빠른 속도보다 예산 친화적인 솔루션과 대용량 스토리지를 우선시합니다. 이러한 요구의 스펙트럼을 이해한 Milvus는 기능의 저하 없이 비용 효율성을 약속하면서 대용량 데이터 처리 방식을 재정의하는 MMap 기능을 도입했습니다.</p>
<h2 id="What-is-MMap" class="common-anchor-header">MMap이란 무엇인가요?<button data-href="#What-is-MMap" class="anchor-icon" translate="no">
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
    </button></h2><p>메모리 매핑 파일의 줄임말인 MMap은 운영 체제 내에서 파일과 메모리 사이의 간극을 메워줍니다. 이 기술은 대용량 파일을 시스템의 메모리 공간에 직접 매핑하여 파일을 연속적인 메모리 블록으로 변환하는 Milvus의 기술입니다. 이러한 통합으로 명시적인 읽기 또는 쓰기 작업이 필요 없어져 Milvus의 데이터 관리 방식이 근본적으로 달라집니다. 대용량 파일이나 사용자가 임의로 파일에 액세스해야 하는 상황에서 원활한 액세스와 효율적인 스토리지를 보장합니다.</p>
<h2 id="Who-benefits-from-MMap" class="common-anchor-header">MMap의 혜택은 누구에게 제공되나요?<button data-href="#Who-benefits-from-MMap" class="anchor-icon" translate="no">
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
    </button></h2><p>벡터 데이터베이스는 벡터 데이터의 저장 요구 사항으로 인해 상당한 메모리 용량을 필요로 합니다. MMap 기능을 사용하면 제한된 메모리 내에서 더 많은 데이터를 처리하는 것이 현실화됩니다. 하지만 이렇게 늘어난 용량에는 성능 저하라는 대가가 따릅니다. 시스템은 지능적으로 메모리를 관리하여 부하와 사용량에 따라 일부 데이터를 제거합니다. 이러한 퇴거를 통해 Milvus는 동일한 메모리 용량 내에서 더 많은 데이터를 처리할 수 있습니다.</p>
<p>테스트 결과, 메모리가 충분할 경우 워밍업 기간이 지나면 모든 데이터가 메모리에 남아 시스템 성능이 유지되는 것으로 나타났습니다. 그러나 데이터 양이 증가하면 성능이 점차 저하됩니다. <strong>따라서 성능 변동에 덜 민감한 사용자에게는 MMap 기능을 사용하는 것이 좋습니다.</strong></p>
<h2 id="Enabling-MMap-in-Milvus-a-simple-configuration" class="common-anchor-header">Milvus에서 MMap 활성화: 간단한 구성<button data-href="#Enabling-MMap-in-Milvus-a-simple-configuration" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus에서 MMap을 활성화하는 방법은 매우 간단합니다. <code translate="no">milvus.yaml</code> 파일을 수정하고 <code translate="no">queryNode</code> 구성 아래에 <code translate="no">mmapDirPath</code> 항목을 추가한 다음 유효한 경로를 값으로 설정하기만 하면 됩니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/enabling_mmap_a2df88276b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Striking-the-balance-performance-storage-and-system-limits" class="common-anchor-header">균형 잡기: 성능, 스토리지 및 시스템 제한<button data-href="#Striking-the-balance-performance-storage-and-system-limits" class="anchor-icon" translate="no">
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
    </button></h2><p>데이터 액세스 패턴은 성능에 큰 영향을 미칩니다. Milvus의 MMap 기능은 로캘리티에 따라 데이터 액세스를 최적화합니다. MMap은 순차적으로 액세스되는 데이터 세그먼트에 대해 디스크에 직접 스칼라 데이터를 쓸 수 있게 해줍니다. 문자열과 같은 가변 길이 데이터는 플랫화 과정을 거쳐 메모리의 오프셋 배열을 사용해 인덱싱됩니다. 이 접근 방식은 데이터 액세스 로컬리티를 보장하고 각 가변 길이 데이터를 개별적으로 저장하는 데 따른 오버헤드를 제거합니다. 벡터 인덱스에 대한 최적화는 세심하게 이루어집니다. MMap은 인접성 목록을 메모리에 유지하면서 벡터 데이터에 선택적으로 사용되므로 성능 저하 없이 상당한 메모리를 절약할 수 있습니다.</p>
<p>또한 MMap은 메모리 사용량을 최소화하여 데이터 처리를 극대화합니다. QueryNode가 전체 데이터 세트를 복사했던 이전 Milvus 버전과 달리, MMap은 개발 과정에서 간소화된 복사 없는 스트리밍 프로세스를 채택합니다. 이러한 최적화를 통해 메모리 오버헤드가 대폭 감소합니다.</p>
<p><strong>내부 테스트 결과에 따르면 MMap을 활성화할 경우 Milvus는 두 배의 데이터 볼륨을 효율적으로 처리할 수 있는 것으로 나타났습니다.</strong></p>
<h2 id="The-road-ahead-continuous-innovation-and-user-centric-enhancements" class="common-anchor-header">앞으로 나아갈 길: 지속적인 혁신과 사용자 중심의 기능 개선<button data-href="#The-road-ahead-continuous-innovation-and-user-centric-enhancements" class="anchor-icon" translate="no">
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
    </button></h2><p>MMap 기능은 아직 베타 단계에 있지만, Milvus 팀은 지속적인 개선을 위해 최선을 다하고 있습니다. 향후 업데이트를 통해 시스템의 메모리 사용량을 개선하여 단일 노드에서 훨씬 더 많은 양의 데이터를 지원할 수 있게 될 것입니다. 사용자는 MMap 기능을 더욱 세밀하게 제어하여 컬렉션과 고급 필드 로딩 모드를 동적으로 변경할 수 있게 될 것으로 기대할 수 있습니다. 이러한 향상된 기능은 전례 없는 유연성을 제공하여 사용자가 특정 요구사항에 맞게 데이터 처리 전략을 조정할 수 있게 해줍니다.</p>
<h2 id="Conclusion-redefining-data-processing-excellence-with-Milvus-MMap" class="common-anchor-header">결론: Milvus MMap을 통한 데이터 처리의 우수성 재정의<button data-href="#Conclusion-redefining-data-processing-excellence-with-Milvus-MMap" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.3의 MMap 기능은 데이터 처리 기술의 획기적인 도약을 의미합니다. 성능, 비용, 시스템 한계 사이의 섬세한 균형을 유지함으로써 Milvus는 사용자가 방대한 양의 데이터를 효율적이고 경제적으로 처리할 수 있도록 지원합니다. Milvus는 계속해서 진화하면서 혁신적인 솔루션의 선두에 서서 데이터 관리의 한계를 재정의하고 있습니다.</p>
<p>탁월한 데이터 처리 능력을 향한 Milvus의 여정을 계속 지켜봐 주시기 바랍니다.</p>
