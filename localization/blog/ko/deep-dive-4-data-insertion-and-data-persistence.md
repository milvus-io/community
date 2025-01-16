---
id: deep-dive-4-data-insertion-and-data-persistence.md
title: 벡터 데이터베이스의 데이터 삽입 및 데이터 지속성
author: Bingyi Sun
date: 2022-04-06T00:00:00.000Z
desc: Milvus 벡터 데이터베이스의 데이터 삽입 및 데이터 지속성의 메커니즘에 대해 알아보세요.
cover: assets.zilliz.com/Deep_Dive_4_812021d715.png
tag: Engineering
tags: 'Data science, Database, Technology, Artificial Intelligence, Vector Management'
canonicalUrl: 'https://milvus.io/blog/deep-dive-4-data-insertion-and-data-persistence.md'
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Deep_Dive_4_812021d715.png" alt="Cover image" class="doc-image" id="cover-image" />
   </span> <span class="img-wrapper"> <span>표지 이미지</span> </span></p>
<blockquote>
<p>이 글은 <a href="https://github.com/sunby">Bingyi Sun이</a> 작성하고 <a href="https://www.linkedin.com/in/yiyun-n-2aa713163/">Angela Ni가</a> 번역했습니다.</p>
</blockquote>
<p>심층 분석 시리즈의 이전 포스팅에서는 세계에서 가장 진보된 벡터 데이터베이스인 <a href="https://milvus.io/blog/deep-dive-3-data-processing.md">Milvus에서 데이터가 처리되는 방식을</a> 소개했습니다. 이번 글에서는 계속해서 데이터 삽입과 관련된 구성 요소를 살펴보고, 데이터 모델을 자세히 설명하며, Milvus에서 데이터 지속성이 어떻게 달성되는지 설명하겠습니다.</p>
<p>이동하기:</p>
<ul>
<li><a href="#Milvus-architecture-recap">Milvus 아키텍처 요약</a></li>
<li><a href="#The-portal-of-data-insertion-requests">데이터 삽입 요청의 포털</a></li>
<li><a href="#Data-coord-and-data-node">데이터 코디 및 데이터 노드</a></li>
<li><a href="#Root-coord-and-Time-Tick">루트 코디와 타임 틱</a></li>
<li><a href="#Data-organization-collection-partition-shard-channel-segment">데이터 구성: 수집, 파티션, 샤드(채널), 세그먼트</a></li>
<li><a href="#Data-allocation-when-and-how">데이터 할당: 언제, 어떻게</a></li>
<li><a href="#Binlog-file-structure-and-data-persistence">Binlog 파일 구조 및 데이터 지속성</a></li>
</ul>
<h2 id="Milvus-architecture-recap" class="common-anchor-header">Milvus 아키텍처 요약<button data-href="#Milvus-architecture-recap" class="anchor-icon" translate="no">
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
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Milvus_architecture_c7910cb89d.png" alt="Milvus architecture." class="doc-image" id="milvus-architecture." />
   </span> <span class="img-wrapper"> <span>Milvus 아키텍처</span>. </span></p>
<p>SDK는 로드 밸런서를 통해 프록시인 포털로 데이터 요청을 보냅니다. 그런 다음 프록시는 코디네이터 서비스와 상호 작용하여 DDL(데이터 정의 언어) 및 DML(데이터 조작 언어) 요청을 메시지 스토리지에 기록합니다.</p>
<p>쿼리 노드, 데이터 노드, 인덱스 노드를 포함한 작업자 노드는 메시지 저장소의 요청을 소비합니다. 구체적으로 쿼리 노드는 데이터 쿼리를 담당하고, 데이터 노드는 데이터 삽입과 데이터 지속성을 담당하며, 인덱스 노드는 주로 인덱스 구축과 쿼리 가속을 처리합니다.</p>
<p>최하위 계층은 개체 스토리지로, 로그, 델타 빈로그, 인덱스 파일을 저장하기 위해 주로 MinIO, S3, AzureBlob을 활용합니다.</p>
<h2 id="The-portal-of-data-insertion-requests" class="common-anchor-header">데이터 삽입 요청의 포털<button data-href="#The-portal-of-data-insertion-requests" class="anchor-icon" translate="no">
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
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Proxy_in_Milvus_aa6b724e0b.jpeg" alt="Proxy in Milvus." class="doc-image" id="proxy-in-milvus." />
   </span> <span class="img-wrapper"> <span>Milvus의 프록시</span>. </span></p>
<p>프록시는 데이터 삽입 요청의 포털 역할을 합니다.</p>
<ol>
<li>처음에 프록시는 SDK로부터 데이터 삽입 요청을 수락하고 해시 알고리즘을 사용하여 해당 요청을 여러 버킷에 할당합니다.</li>
<li>그런 다음 프록시는 데이터 코디를 요청하여 Milvus에서 데이터 저장을 위한 최소 단위인 세그먼트를 할당합니다.</li>
<li>그 후 프록시는 요청된 세그먼트의 정보를 메시지 저장소에 삽입하여 해당 정보가 손실되지 않도록 합니다.</li>
</ol>
<h2 id="Data-coord-and-data-node" class="common-anchor-header">데이터 코디와 데이터 노드<button data-href="#Data-coord-and-data-node" class="anchor-icon" translate="no">
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
    </button></h2><p>데이터 코드의 주요 기능은 채널과 세그먼트 할당을 관리하는 것이고, 데이터 노드의 주요 기능은 삽입된 데이터를 소비하고 보존하는 것입니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Data_coord_and_data_node_in_Milvus_8bcf010f9e.jpeg" alt="Data coord and data node in Milvus." class="doc-image" id="data-coord-and-data-node-in-milvus." />
   </span> <span class="img-wrapper"> <span>Milvus의 데이터 코디와 데이터 노드</span>. </span></p>
<h3 id="Function" class="common-anchor-header">기능</h3><p>데이터 코드는 다음과 같은 역할을 합니다:</p>
<ul>
<li><p><strong>세그먼트 공간 할당</strong>데이터 코드는 증가하는 세그먼트의 공간을 프록시에 할당하여 프록시가 세그먼트의 여유 공간을 사용하여 데이터를 삽입할 수 있도록 합니다.</p></li>
<li><p>세그먼트<strong>할당 및 세그먼트 내 할당된 공간의 만료 시간 기록</strong>데이터 코드로 할당된 각 세그먼트 내의 공간은 영구적이지 않으므로 데이터 코드는 각 세그먼트 할당의 만료 시간도 기록해야 합니다.</p></li>
<li><p>세그먼트<strong>데이터 자동 플러시</strong>세그먼트가 가득 차면 데이터 코드는 자동으로 데이터 플러시를 트리거합니다.</p></li>
<li><p><strong>데이터 노드에 채널 할당</strong>컬렉션에는 여러 개의 <a href="https://milvus.io/docs/v2.0.x/glossary.md#VChannel">v채널이</a> 있을 수 있습니다. 데이터 코드는 어떤 데이터 노드에서 어떤 v채널을 사용할지 결정합니다.</p></li>
</ul>
<p>데이터 노드는 다음과 같은 역할을 합니다:</p>
<ul>
<li><p><strong>데이터 소비</strong>데이터 노드는 데이터 코드로 할당된 채널에서 데이터를 소비하고 데이터에 대한 시퀀스를 만듭니다.</p></li>
<li><p><strong>데이터 지속성</strong>삽입된 데이터를 메모리에 캐시하고 데이터 볼륨이 특정 임계값에 도달하면 삽입된 데이터를 디스크로 자동 플러시합니다.</p></li>
</ul>
<h3 id="Workflow" class="common-anchor-header">워크플로</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/One_vchannel_can_only_be_assigned_to_one_data_node_14aa3bd718.png" alt="One vchannel can only be assigned to one data node." class="doc-image" id="one-vchannel-can-only-be-assigned-to-one-data-node." />
   </span> <span class="img-wrapper"> <span>하나의 데이터 노드에는 하나의 v채널만 할당할 수 있습니다</span>. </span></p>
<p>위 이미지와 같이 컬렉션에는 4개의 v채널(V1, V2, V3, V4)이 있고 데이터 노드가 두 개 있습니다. 데이터 코드는 하나의 데이터 노드에 V1 및 V2의 데이터를 소비하도록 할당하고 다른 데이터 노드에는 V3 및 V4의 데이터를 소비하도록 할당할 가능성이 매우 높습니다. 하나의 V채널을 여러 데이터 노드에 할당할 수 없으며, 이는 동일한 세그먼트에 동일한 데이터 배치가 반복적으로 삽입되는 데이터 소비의 반복을 방지하기 위한 것입니다.</p>
<h2 id="Root-coord-and-Time-Tick" class="common-anchor-header">루트 좌표 및 타임 틱<button data-href="#Root-coord-and-Time-Tick" class="anchor-icon" translate="no">
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
    </button></h2><p>루트 코드는 TSO(타임스탬프 오라클)를 관리하고 타임 틱 메시지를 전 세계에 게시합니다. 각 데이터 삽입 요청에는 루트 코드로부터 할당된 타임스탬프가 있습니다. 타임 틱은 Milvus에서 시계와 같은 역할을 하는 Milvus의 초석으로, Milvus 시스템이 어느 시점에 있는지를 나타냅니다.</p>
<p>Milvus에 데이터가 기록될 때, 각 데이터 삽입 요청에는 타임스탬프가 전달됩니다. 데이터를 소비하는 동안 데이터 노드가 데이터를 소비할 때마다 타임스탬프가 특정 범위 내에 있는 데이터를 소비합니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/An_example_of_data_insertion_and_data_consumption_based_on_timestamp_e820f682f9.jpeg" alt="An example of data insertion and data consumption based on timestamp." class="doc-image" id="an-example-of-data-insertion-and-data-consumption-based-on-timestamp." />
   </span> <span class="img-wrapper"> <span>타임스탬프에 따른 데이터 삽입 및 데이터 소비의 예시입니다</span>. </span></p>
<p>위 이미지는 데이터 삽입 과정입니다. 타임스탬프의 값은 숫자 1,2,6,5,7,8로 표시됩니다. 데이터는 두 개의 프록시, 즉 p1과 p2에 의해 시스템에 기록됩니다. 데이터 소비 중에 타임 틱의 현재 시간이 5인 경우 데이터 노드는 데이터 1과 2만 읽을 수 있습니다. 그런 다음 두 번째 읽기 중에 Time Tick의 현재 시간이 9가 되면 데이터 노드는 데이터 6,7,8을 읽을 수 있습니다.</p>
<h2 id="Data-organization-collection-partition-shard-channel-segment" class="common-anchor-header">데이터 구성: 컬렉션, 파티션, 샤드(채널), 세그먼트<button data-href="#Data-organization-collection-partition-shard-channel-segment" class="anchor-icon" translate="no">
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
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Data_organization_in_Milvus_75ad710752.jpeg" alt="Data organization in Milvus." class="doc-image" id="data-organization-in-milvus." />
   </span> <span class="img-wrapper"> <span>Milvus의 데이터 구성</span>. </span></p>
<p>이 <a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md#Data-Model">글을</a> 먼저 읽고 Milvus의 데이터 모델과 컬렉션, 샤드, 파티션, 세그먼트의 개념을 이해하세요.</p>
<p>요약하자면, Milvus에서 가장 큰 데이터 단위는 관계형 데이터베이스의 테이블에 비유할 수 있는 컬렉션입니다. 컬렉션에는 여러 개의 샤드(각각 채널에 해당)와 각 샤드 내에 여러 개의 파티션이 있을 수 있습니다. 위 그림에서 채널(샤드)은 세로 막대이고 파티션은 가로 막대입니다. 각 교차점에는 데이터 할당을 위한 최소 단위인 세그먼트의 개념이 있습니다. Milvus에서 인덱스는 세그먼트를 기반으로 구축됩니다. 쿼리 중에 Milvus 시스템은 여러 쿼리 노드에서 쿼리 부하를 분산시키며, 이 과정은 세그먼트 단위를 기반으로 수행됩니다. 세그먼트는 여러 개의 <a href="https://milvus.io/docs/v2.0.x/glossary.md#Binlog">빈로그를</a> 포함하며, 세그먼트 데이터가 소비되면 빈로그 파일이 생성됩니다.</p>
<h3 id="Segment" class="common-anchor-header">세그먼트</h3><p>Milvus에는 성장 중인 세그먼트, 봉인된 세그먼트, 플러시된 세그먼트 등 세 가지 유형의 세그먼트가 있습니다.</p>
<h4 id="Growing-segment" class="common-anchor-header">성장 중인 세그먼트</h4><p>성장 중인 세그먼트는 데이터 삽입을 위해 프록시에 할당할 수 있는 새로 생성된 세그먼트입니다. 세그먼트의 내부 공간은 사용, 할당 또는 비워 둘 수 있습니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Three_status_in_a_growing_segment_bdae45e26f.png" alt="Three status in a growing segment" class="doc-image" id="three-status-in-a-growing-segment" />
   </span> <span class="img-wrapper"> <span>성장 중인 세그먼트의 세 가지 상태</span> </span></p>
<ul>
<li>사용 중: 증가하는 세그먼트의 공간 중 이 부분이 데이터 노드에 의해 소비되었습니다.</li>
<li>할당됨: 성장 중인 세그먼트의 이 공간은 프록시가 요청하여 데이터 코디에 의해 할당되었습니다. 할당된 공간은 일정 기간이 지나면 만료됩니다.</li>
<li>사용 가능: 증가하는 세그먼트의 공간 중 이 부분이 사용되지 않았습니다. 여유 공간의 값은 세그먼트의 전체 공간에서 사용 및 할당된 공간의 값을 뺀 값과 같습니다. 따라서 세그먼트의 여유 공간은 할당된 공간이 만료됨에 따라 증가합니다.</li>
</ul>
<h4 id="Sealed-segment" class="common-anchor-header">봉인된 세그먼트</h4><p>봉인된 세그먼트는 데이터 삽입을 위해 더 이상 프록시에 할당할 수 없는 닫힌 세그먼트입니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Sealed_segment_in_Milvus_8def5567e1.jpeg" alt="Sealed segment in Milvus" class="doc-image" id="sealed-segment-in-milvus" />
   </span> <span class="img-wrapper"> <span>밀버스에서 봉인된 세그먼트</span> </span></p>
<p>증가하는 세그먼트는 다음과 같은 상황에서 봉인됩니다:</p>
<ul>
<li>성장하는 세그먼트에서 사용된 공간이 전체 공간의 75%에 도달하면 세그먼트가 봉인됩니다.</li>
<li>밀버스 사용자는 컬렉션의 모든 데이터를 유지하기 위해 Flush()를 수동으로 호출합니다.</li>
<li>성장하는 세그먼트가 너무 많으면 데이터 노드가 메모리를 과도하게 사용하게 되므로 오랜 시간이 지나도 봉인되지 않은 성장 세그먼트는 봉인됩니다.</li>
</ul>
<h4 id="Flushed-segment" class="common-anchor-header">플러시 세그먼트</h4><p>플러시된 세그먼트는 이미 디스크에 기록된 세그먼트입니다. 플러시는 데이터 지속성을 위해 세그먼트 데이터를 오브젝트 스토리지에 저장하는 것을 말합니다. 세그먼트는 봉인된 세그먼트의 할당된 공간이 만료될 때만 플러시할 수 있습니다. 플러시되면 봉인된 세그먼트는 플러시된 세그먼트로 바뀝니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Flushed_segment_in_Milvus_0c1f54d432.png" alt="Flushed segment in Milvus" class="doc-image" id="flushed-segment-in-milvus" />
   </span> <span class="img-wrapper"> <span>밀버스에서 플러시된 세그먼트</span> </span></p>
<h3 id="Channel" class="common-anchor-header">채널</h3><p>채널이 할당되었습니다:</p>
<ul>
<li>데이터 노드가 시작되거나 종료될 때, 또는</li>
<li>프록시에 의해 세그먼트 공간 할당이 요청된 경우.</li>
</ul>
<p>그리고 채널 할당에는 여러 가지 전략이 있습니다. Milvus는 이 중 두 가지 전략을 지원합니다:</p>
<ol>
<li>일관성 해싱</li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Consistency_hashing_in_Milvus_fb5e5d84ce.jpeg" alt="Consistency hashing in Milvus" class="doc-image" id="consistency-hashing-in-milvus" />
   </span> <span class="img-wrapper"> <span>Milvus의 일관성 해싱</span> </span></p>
<p>Milvus의 기본 전략입니다. 이 전략은 해싱 기술을 활용하여 각 채널에 링의 위치를 할당하고, 시계 방향으로 검색하여 채널에 가장 가까운 데이터 노드를 찾습니다. 따라서 위 그림에서 채널 1은 데이터 노드 2에 할당되고 채널 2는 데이터 노드 3에 할당됩니다.</p>
<p>그러나 이 전략의 한 가지 문제점은 데이터 노드 수의 증가 또는 감소(예: 새 데이터 노드가 시작되거나 데이터 노드가 갑자기 종료되는 경우)가 채널 할당 프로세스에 영향을 줄 수 있다는 것입니다. 이 문제를 해결하기 위해 데이터 코드는 etcd를 통해 데이터 노드의 상태를 모니터링하여 데이터 노드의 상태에 변화가 있을 경우 데이터 코드로 즉시 알립니다. 그런 다음 데이터 코드는 채널을 올바르게 할당할 데이터 노드를 추가로 결정합니다.</p>
<ol start="2">
<li>로드 밸런싱</li>
</ol>
<p>두 번째 전략은 동일한 컬렉션의 채널을 서로 다른 데이터 노드에 할당하여 채널이 균등하게 할당되도록 하는 것입니다. 이 전략의 목적은 로드 밸런스를 달성하는 것입니다.</p>
<h2 id="Data-allocation-when-and-how" class="common-anchor-header">데이터 할당: 시기 및 방법<button data-href="#Data-allocation-when-and-how" class="anchor-icon" translate="no">
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
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/The_process_of_data_allocation_in_Milvus_0ba86b3ad1.jpeg" alt="The process of data allocation in Milvus" class="doc-image" id="the-process-of-data-allocation-in-milvus" />
   </span> <span class="img-wrapper"> <span>Milvus의 데이터 할당 프로세스</span> </span></p>
<p>데이터 할당 프로세스는 클라이언트에서 시작됩니다. 먼저 프록시에 타임스탬프 <code translate="no">t1</code> 로 데이터 삽입 요청을 보냅니다. 그런 다음 프록시는 세그먼트 할당을 위해 데이터 코디에 요청을 보냅니다.</p>
<p>세그먼트 할당 요청을 받으면 데이터 코드는 세그먼트 상태를 확인하고 세그먼트를 할당합니다. 생성된 세그먼트의 현재 공간이 새로 삽입된 데이터 행에 충분한 경우, 데이터 코드는 생성된 세그먼트를 할당합니다. 그러나 현재 세그먼트에서 사용 가능한 공간이 충분하지 않으면 데이터 좌표는 새 세그먼트를 할당합니다. 데이터 코드는 요청이 있을 때마다 하나 이상의 세그먼트를 반환할 수 있습니다. 그 동안 데이터 코드는 데이터 지속성을 위해 할당된 세그먼트를 메타 서버에 저장하기도 합니다.</p>
<p>그 후 데이터 코드는 할당된 세그먼트의 정보(세그먼트 ID, 행 수, 만료 시간 <code translate="no">t2</code> 등)를 프록시에 반환합니다. 프록시는 이러한 정보가 제대로 기록되도록 할당된 세그먼트의 정보를 메시지 저장소로 보냅니다. <code translate="no">t1</code> 의 값은 <code translate="no">t2</code> 보다 작아야 합니다. <code translate="no">t2</code> 의 기본값은 2,000밀리초이며 <code translate="no">data_coord.yaml</code> 파일에서 <code translate="no">segment.assignmentExpiration</code> 파라미터를 설정하여 변경할 수 있습니다.</p>
<h2 id="Binlog-file-structure-and-data-persistence" class="common-anchor-header">Binlog 파일 구조 및 데이터 지속성<button data-href="#Binlog-file-structure-and-data-persistence" class="anchor-icon" translate="no">
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
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Data_node_flush_86832f46d0.png" alt="Data node flush" class="doc-image" id="data-node-flush" />
   </span> <span class="img-wrapper"> <span>데이터 노드 플러시</span> </span></p>
<p>데이터 노드는 데이터 삽입 요청이 메시지 저장소에 보관되어 데이터 노드가 삽입 메시지를 사용할 수 있기 때문에 메시지 저장소에 가입합니다. 데이터 노드는 먼저 삽입 요청을 삽입 버퍼에 저장하고 요청이 누적되면 임계값에 도달한 후 개체 스토리지로 플러시됩니다.</p>
<h3 id="Binlog-file-structure" class="common-anchor-header">Binlog 파일 구조</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Binlog_file_structure_ca2897a095.png" alt="Binlog file structure." class="doc-image" id="binlog-file-structure." />
   </span> <span class="img-wrapper"> <span>빈로그 파일 구조</span>. </span></p>
<p>Milvus의 빈로그 파일 구조는 MySQL의 빈로그 파일 구조와 유사합니다. 빈로그는 데이터 복구와 인덱스 구축이라는 두 가지 기능을 제공하는 데 사용됩니다.</p>
<p>빈로그에는 많은 <a href="https://github.com/milvus-io/milvus/blob/master/docs/developer_guides/chap08_binlog.md#event-format">이벤트가</a> 포함됩니다. 각 이벤트에는 이벤트 헤더와 이벤트 데이터가 있습니다.</p>
<p>이벤트 헤더에는 빈로그 생성 시간, 쓰기 노드 ID, 이벤트 길이, NextPosition(다음 이벤트의 오프셋) 등의 메타데이터가 기록됩니다.</p>
<p>이벤트 데이터는 고정과 가변의 두 부분으로 나눌 수 있습니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/File_structure_of_an_insert_event_829b1f628d.png" alt="File structure of an insert event." class="doc-image" id="file-structure-of-an-insert-event." />
   </span> <span class="img-wrapper"> <span>삽입 이벤트의 파일 구조</span>. </span></p>
<p><code translate="no">INSERT_EVENT</code> 의 이벤트 데이터에서 고정 부분은 <code translate="no">StartTimestamp</code>, <code translate="no">EndTimestamp</code>, <code translate="no">reserved</code> 을 포함합니다.</p>
<p>가변 부분은 실제로 삽입된 데이터를 저장합니다. 삽입 데이터는 쪽모이 세공 형식으로 정렬되어 이 파일에 저장됩니다.</p>
<h3 id="Data-persistence" class="common-anchor-header">데이터 지속성</h3><p>스키마에 여러 개의 열이 있는 경우, Milvus는 빈로그를 열에 저장합니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Binlog_data_persistence_0c028bf26a.png" alt="Binlog data persistence." class="doc-image" id="binlog-data-persistence." />
   </span> <span class="img-wrapper"> <span>빈로그 데이터 지속성</span>. </span></p>
<p>위 이미지에서 볼 수 있듯이 첫 번째 열은 기본 키 binlog입니다. 두 번째 열은 타임스탬프 열입니다. 나머지는 스키마에 정의된 열입니다. MinIO에서 binlog의 파일 경로도 위 이미지에 표시되어 있습니다.</p>
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
    </button></h2><p>Milvus 2.0의 <a href="https://milvus.io/blog/2022-1-25-annoucing-general-availability-of-milvus-2-0.md">공식</a> 출시와 함께 Milvus 아키텍처와 소스 코드에 대한 심층적인 해석을 제공하기 위해 Milvus 딥 다이브 블로그 시리즈를 기획했습니다. 이 블로그 시리즈에서 다루는 주제는 다음과 같습니다:</p>
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
