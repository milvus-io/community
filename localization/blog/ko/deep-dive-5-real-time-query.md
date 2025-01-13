---
id: deep-dive-5-real-time-query.md
title: 실시간 쿼리를 위한 Milvus 벡터 데이터베이스 사용
author: Xi Ge
date: 2022-04-11T00:00:00.000Z
desc: Milvus의 실시간 쿼리의 기본 메커니즘에 대해 알아보세요.
cover: assets.zilliz.com/deep_dive_5_5e9175c7f7.png
tag: Engineering
tags: 'Data science, Database, Technology, Artificial Intelligence, Vector Management'
canonicalUrl: 'https://milvus.io/blog/deep-dive-5-real-time-query.md'
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/deep_dive_5_5e9175c7f7.png" alt="Cover image" class="doc-image" id="cover-image" />
   </span> <span class="img-wrapper"> <span>표지 이미지</span> </span></p>
<blockquote>
<p>이 글은 <a href="https://github.com/xige-16">Xi Ge가</a> 작성하고 <a href="https://www.linkedin.com/in/yiyun-n-2aa713163/">Angela Ni가</a> 번역했습니다.</p>
</blockquote>
<p>이전 게시물에서는 Milvus의 <a href="https://milvus.io/blog/deep-dive-4-data-insertion-and-data-persistence.md">데이터 삽입과 데이터 지속성에</a> 대해 이야기했습니다. 이번 글에서는 Milvus의 <a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md">여러 구성 요소가</a> 서로 상호 작용하여 실시간 데이터 쿼리를 완료하는 방법에 대해 계속 설명하겠습니다.</p>
<p><em>시작하기 전에 유용한 몇 가지 리소스는 다음과 같습니다. 이 글의 주제를 더 잘 이해하기 위해 먼저 읽어보시는 것을 권장합니다.</em></p>
<ul>
<li><a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md">Milvus 아키텍처에 대해 자세히 알아보기</a></li>
<li><a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md#Data-Model">Milvus 데이터 모델</a></li>
<li><a href="https://milvus.io/docs/v2.0.x/four_layers.md">각 Milvus 구성 요소의 역할과 기능</a></li>
<li><a href="https://milvus.io/blog/deep-dive-3-data-processing.md">Milvus의 데이터 처리</a></li>
<li><a href="https://milvus.io/blog/deep-dive-4-data-insertion-and-data-persistence.md">Milvus의 데이터 삽입 및 데이터 지속성</a></li>
</ul>
<h2 id="Load-data-to-query-node" class="common-anchor-header">쿼리 노드에 데이터 로드<button data-href="#Load-data-to-query-node" class="anchor-icon" translate="no">
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
    </button></h2><p>쿼리를 실행하기 전에 먼저 쿼리 노드에 데이터를 로드해야 합니다.</p>
<p>쿼리 노드에 로드되는 데이터에는 <a href="https://milvus.io/docs/v2.0.x/four_layers.md#Log-broker">로그 브로커의</a> 스트리밍 데이터와 <a href="https://milvus.io/docs/v2.0.x/four_layers.md#Object-storage">객체 스토리지의</a> 기록 데이터(아래에서는 영구 저장소라고도 함)의 두 가지 유형이 있습니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/flowchart_b1c51dfdaa.png" alt="Flowchart" class="doc-image" id="flowchart" />
   </span> <span class="img-wrapper"> <span>흐름도</span> </span></p>
<p>데이터 코드는 Milvus에 지속적으로 삽입되는 스트리밍 데이터를 처리하는 역할을 담당합니다. Milvus 사용자가 컬렉션을 로드하기 위해 <code translate="no">collection.load()</code> 을 호출하면, 쿼리 코드는 데이터 코드로 문의하여 스토리지에 지속된 세그먼트와 그에 해당하는 체크포인트를 알아냅니다. 체크포인트는 체크포인트 이전의 지속된 세그먼트는 소비되고 체크포인트 이후의 세그먼트는 소비되지 않음을 나타내는 표시입니다.</p>
<p>그런 다음 쿼리 코드는 데이터 코드의 정보를 기반으로 세그먼트별 또는 채널별 할당 전략을 출력합니다. 세그먼트 할당자는 영구 저장소의 세그먼트(배치 데이터)를 다른 쿼리 노드에 할당하는 역할을 담당합니다. 예를 들어, 위 이미지에서 세그먼트 할당자는 세그먼트 1과 3(S1, S3)을 쿼리 노드 1에 할당하고 세그먼트 2와 4(S2, S4)를 쿼리 노드 2에 할당합니다. 채널 할당자는 로그 브로커에서 여러 데이터 조작 <a href="https://milvus.io/docs/v2.0.x/data_processing.md#Data-insertion">채널</a> (DMC채널)을 볼 수 있도록 서로 다른 쿼리 노드를 할당합니다. 예를 들어, 위 이미지에서 채널 할당자는 쿼리 노드 1에 채널 1(Ch1)을 감시하도록 할당하고 쿼리 노드 2에 채널 2(Ch2)를 감시하도록 할당합니다.</p>
<p>할당 전략에 따라 각 쿼리 노드는 세그먼트 데이터를 로드하고 그에 따라 채널을 시청합니다. 이미지의 쿼리 노드 1에서는 퍼시스턴트 스토리지에서 할당된 S1 및 S3를 통해 과거 데이터(배치 데이터)가 로드됩니다. 한편, 쿼리 노드 1은 로그 브로커에서 채널 1을 구독하여 증분 데이터(스트리밍 데이터)를 로드합니다.</p>
<h2 id="Data-management-in-query-node" class="common-anchor-header">쿼리 노드에서의 데이터 관리<button data-href="#Data-management-in-query-node" class="anchor-icon" translate="no">
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
    </button></h2><p>쿼리 노드는 기록 데이터와 증분 데이터를 모두 관리해야 합니다. 히스토리 데이터는 봉인된 <a href="https://milvus.io/blog/deep-dive-4-data-insertion-and-data-persistence.md#Sealed-segment">세그먼트에</a> 저장되고 증분 데이터는 <a href="https://milvus.io/blog/deep-dive-4-data-insertion-and-data-persistence.md#Growing-segment">증가하는 세그먼트에</a> 저장됩니다.</p>
<h3 id="Historical-data-management" class="common-anchor-header">기록 데이터 관리</h3><p>기록 데이터 관리에는 크게 부하 분산과 쿼리 노드 장애 조치라는 두 가지 고려 사항이 있습니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/load_balance_c77e22bb5c.png" alt="Load balance" class="doc-image" id="load-balance" />
   </span> <span class="img-wrapper"> <span>부하 분산</span> </span></p>
<p>예를 들어, 그림에서 보듯이 쿼리 노드 4에는 다른 쿼리 노드보다 더 많은 봉인된 세그먼트가 할당되어 있습니다. 이로 인해 쿼리 노드 4가 전체 쿼리 프로세스를 느리게 하는 병목 현상이 발생할 가능성이 높습니다. 이 문제를 해결하려면 시스템은 쿼리 노드 4의 여러 세그먼트를 다른 쿼리 노드에 할당해야 합니다. 이를 부하 분산이라고 합니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Query_node_failover_3278c0e307.png" alt="Query node failover" class="doc-image" id="query-node-failover" />
   </span> <span class="img-wrapper"> <span>쿼리 노드 장애 조치</span> </span></p>
<p>또 다른 가능한 상황이 위 이미지에 설명되어 있습니다. 노드 중 하나인 쿼리 노드 4가 갑자기 다운되었습니다. 이 경우 쿼리 결과의 정확성을 보장하기 위해 부하(쿼리 노드 4에 할당된 세그먼트)를 다른 작업 중인 쿼리 노드로 이전해야 합니다.</p>
<h3 id="Incremental-data-management" class="common-anchor-header">증분 데이터 관리</h3><p>쿼리 노드는 증분 데이터를 수신하기 위해 DMC채널을 감시합니다. 이 과정에서 플로우그래프가 도입됩니다. 먼저 모든 데이터 삽입 메시지를 필터링합니다. 이는 지정된 파티션에 있는 데이터만 로드되도록 하기 위함입니다. Milvus의 각 컬렉션에는 해당 컬렉션의 모든 파티션이 공유하는 해당 채널이 있습니다. 따라서 Milvus 사용자가 특정 파티션의 데이터만 로드해야 하는 경우 삽입된 데이터를 필터링하기 위해 플로우그래프가 필요합니다. 그렇지 않으면 컬렉션의 모든 파티션에 있는 데이터가 쿼리 노드에 로드됩니다.</p>
<p>필터링된 후, 증분 데이터는 증가하는 세그먼트에 삽입되고 서버 시간 노드로 추가로 전달됩니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/flow_graph_dc58651367.png" alt="Flowgraph" class="doc-image" id="flowgraph" />
   </span> <span class="img-wrapper"> <span>흐름 그래프</span> </span></p>
<p>데이터가 삽입되는 동안 각 삽입 메시지에는 타임스탬프가 할당됩니다. 위 이미지에 표시된 DMC채널에서는 데이터가 왼쪽에서 오른쪽으로 순서대로 삽입됩니다. 첫 번째 삽입 메시지의 타임스탬프는 1, 두 번째는 2, 세 번째는 6입니다. 빨간색으로 표시된 네 번째 메시지는 삽입 메시지가 아니라 타임틱 메시지입니다. 이는 타임스탬프가 이 타임틱보다 작은 삽입 데이터가 이미 로그 브로커에 있음을 나타내기 위한 것입니다. 즉, 이 타임틱 메시지 이후에 삽입된 데이터는 모두 이 타임틱보다 큰 값을 갖는 타임스탬프를 가져야 합니다. 예를 들어 위 이미지에서 쿼리 노드가 현재 타임틱이 5라고 인식하면, 타임스탬프 값이 5보다 작은 모든 삽입 메시지가 쿼리 노드에 로드된다는 뜻입니다.</p>
<p>서버 시간 노드는 삽입 노드로부터 타임틱을 받을 때마다 업데이트된 <code translate="no">tsafe</code> 값을 제공합니다. <code translate="no">tsafe</code> 은 안전 시간을 의미하며, 이 시점 이전에 삽입된 모든 데이터를 조회할 수 있습니다. 예를 들어 <code translate="no">tsafe</code> = 9인 경우 타임스탬프가 9보다 작은 삽입 데이터는 모두 쿼리할 수 있습니다.</p>
<h2 id="Real-time-query-in-Milvus" class="common-anchor-header">Milvus에서 실시간 쿼리<button data-href="#Real-time-query-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus의 실시간 쿼리는 쿼리 메시지를 통해 활성화됩니다. 쿼리 메시지는 프록시를 통해 로그 브로커에 삽입됩니다. 그러면 쿼리 노드는 로그 브로커에서 쿼리 채널을 감시하여 쿼리 메시지를 얻습니다.</p>
<h3 id="Query-message" class="common-anchor-header">쿼리 메시지</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/query_message_4d57814f47.png" alt="Query message" class="doc-image" id="query-message" />
   </span> <span class="img-wrapper"> <span>쿼리 메시지</span> </span></p>
<p>쿼리 메시지에는 쿼리에 대한 다음과 같은 중요한 정보가 포함됩니다:</p>
<ul>
<li><code translate="no">msgID</code>: 메시지 ID: 시스템에서 할당된 쿼리 메시지의 ID입니다.</li>
<li><code translate="no">collectionID</code>: 쿼리할 컬렉션의 ID(사용자가 지정한 경우).</li>
<li><code translate="no">execPlan</code>: 실행 계획은 주로 쿼리에서 속성 필터링에 사용됩니다.</li>
<li><code translate="no">service_ts</code>: 서비스 타임스탬프는 위에서 언급한 <code translate="no">tsafe</code> 와 함께 업데이트됩니다. 서비스 타임스탬프는 서비스가 어느 시점에 있는지를 나타냅니다. <code translate="no">service_ts</code> 이전에 삽입된 모든 데이터는 쿼리에 사용할 수 있습니다.</li>
<li><code translate="no">travel_ts</code>: 여행 타임스탬프는 과거의 시간 범위를 지정합니다. 그리고 <code translate="no">travel_ts</code> 에 지정된 기간에 존재하는 데이터에 대해 쿼리가 수행됩니다.</li>
<li><code translate="no">guarantee_ts</code>: 보증 타임스탬프는 쿼리를 수행해야 하는 기간을 지정합니다. <code translate="no">service_ts</code> &gt; <code translate="no">guarantee_ts</code> 인 경우에만 쿼리가 수행됩니다.</li>
</ul>
<h3 id="Real-time-query" class="common-anchor-header">실시간 쿼리</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/query_process_7f676972d8.png" alt="Query process" class="doc-image" id="query-process" />
   </span> <span class="img-wrapper"> <span>쿼리 프로세스</span> </span></p>
<p>밀버스는 쿼리 메시지가 수신되면 먼저 현재 서비스 시간인 <code translate="no">service_ts</code> 이 쿼리 메시지의 보증 타임스탬프인 <code translate="no">guarantee_ts</code> 보다 큰지 판단합니다. 그렇다면 쿼리가 실행됩니다. 쿼리는 과거 데이터와 증분 데이터 모두에 대해 병렬로 수행됩니다. 스트리밍 데이터와 배치 데이터 사이에 데이터가 중복될 수 있으므로 중복된 쿼리 결과를 걸러내기 위해 "로컬 축소"라는 작업이 필요합니다.</p>
<p>그러나 현재 서비스 시간이 새로 삽입된 쿼리 메시지의 보증 타임스탬프보다 작으면 해당 쿼리 메시지는 미해결 메시지가 되어 서비스 시간이 보증 타임스탬프보다 커질 때까지 처리를 대기하게 됩니다.</p>
<p>쿼리 결과는 최종적으로 결과 채널로 푸시됩니다. 프록시는 해당 채널에서 쿼리 결과를 가져옵니다. 마찬가지로 프록시는 여러 쿼리 노드로부터 결과를 수신하고 쿼리 결과가 반복될 수 있으므로 '전역 축소'도 수행합니다.</p>
<p>프록시가 SDK에 반환하기 전에 모든 쿼리 결과를 수신했는지 확인하기 위해 결과 메시지에는 검색된 봉인된 세그먼트, 검색된 DMC채널, 글로벌 봉인된 세그먼트(모든 쿼리 노드의 모든 세그먼트) 등의 정보 기록도 유지됩니다. 시스템은 다음 두 가지 조건이 모두 충족되는 경우에만 프록시가 모든 쿼리 결과를 수신했다고 결론을 내릴 수 있습니다:</p>
<ul>
<li>모든 결과 메시지에 기록된 검색된 모든 봉인된 세그먼트의 합이 글로벌 봉인된 세그먼트보다 클 것,</li>
<li>컬렉션의 모든 DMC채널이 쿼리됨.</li>
</ul>
<p>궁극적으로 프록시는 '글로벌 축소' 후 최종 결과를 Milvus SDK에 반환합니다.</p>
<h2 id="About-the-Deep-Dive-Series" class="common-anchor-header">딥 다이브 시리즈 소개<button data-href="#About-the-Deep-Dive-Series" class="anchor-icon" translate="no">
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
