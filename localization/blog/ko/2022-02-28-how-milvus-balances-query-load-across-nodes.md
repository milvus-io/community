---
id: 2022-02-28-how-milvus-balances-query-load-across-nodes.md
title: Milvus는 노드 간 쿼리 부하를 어떻게 분산하나요?
author: Xi Ge
date: 2022-02-28T00:00:00.000Z
desc: Milvus 2.0은 쿼리 노드 전반에서 자동 부하 분산 기능을 지원합니다.
cover: assets.zilliz.com/Load_balance_b2f35a5577.png
tag: Engineering
tags: 'Data science, Database, Technology, Artificial Intelligence, Vector Management'
canonicalUrl: >-
  https://milvus.io/blog/2022-02-28-how-milvus-balances-query-load-across-nodes.md
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Load_balance_b2f35a5577.png" alt="Binlog Cover Image" class="doc-image" id="binlog-cover-image" />
   </span> <span class="img-wrapper"> <span>빈로그 표지 이미지</span> </span></p>
<p>By <a href="https://github.com/xige-16">Xi Ge</a>.</p>
<p>이전 블로그 글에서 Milvus 2.0의 삭제, 비트셋, 압축 기능을 연속적으로 소개해 드렸습니다. 이 시리즈의 마지막을 장식하기 위해 Milvus의 분산 클러스터에서 핵심적인 기능인 로드 밸런스의 설계를 공유하고자 합니다.</p>
<h2 id="Implementation" class="common-anchor-header">구현<button data-href="#Implementation" class="anchor-icon" translate="no">
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
    </button></h2><p>쿼리 노드에서 버퍼링되는 세그먼트의 수와 크기가 다르면 쿼리 노드 전체의 검색 성능도 달라질 수 있습니다. 최악의 경우 몇 개의 쿼리 노드가 대량의 데이터를 검색하다가 모두 소진되었지만 새로 생성된 쿼리 노드는 세그먼트가 분배되지 않아 유휴 상태로 남아있어 CPU 리소스가 대량으로 낭비되고 검색 성능이 크게 저하되는 경우가 발생할 수 있습니다.</p>
<p>이러한 상황을 방지하기 위해 쿼리 코디네이터(쿼리 코디)는 노드의 RAM 사용량에 따라 각 쿼리 노드에 세그먼트를 균등하게 분배하도록 프로그래밍되어 있습니다. 따라서 CPU 리소스가 노드 전체에서 균등하게 사용되므로 검색 성능이 크게 향상됩니다.</p>
<h3 id="Trigger-automatic-load-balance" class="common-anchor-header">자동 부하 분산 트리거</h3><p>구성의 기본값 <code translate="no">queryCoord.balanceIntervalSeconds</code> 에 따르면 쿼리 코드는 60초마다 모든 쿼리 노드의 RAM 사용량(백분율)을 확인합니다. 다음 조건 중 하나가 충족되면 쿼리 코드는 쿼리 노드 전체에 걸쳐 쿼리 부하를 분산하기 시작합니다:</p>
<ol>
<li>클러스터에 있는 쿼리 노드의 RAM 사용량이 <code translate="no">queryCoord.overloadedMemoryThresholdPercentage</code> (기본값: 90)보다 큰 경우;</li>
<li>또는 두 쿼리 노드의 RAM 사용량 차이의 절대값이 <code translate="no">queryCoord.memoryUsageMaxDifferencePercentage</code> (기본값: 30)보다 큰 경우.</li>
</ol>
<p>세그먼트가 소스 쿼리 노드에서 대상 쿼리 노드로 전송된 후에는 다음 조건도 모두 충족해야 합니다:</p>
<ol>
<li>대상 쿼리 노드의 RAM 사용량이 <code translate="no">queryCoord.overloadedMemoryThresholdPercentage</code> (기본값: 90)보다 크지 않아야 합니다;</li>
<li>로드 밸런싱 후 원본 및 대상 쿼리 노드의 RAM 사용량 차이의 절대값이 로드 밸런싱 전보다 작을 것.</li>
</ol>
<p>위의 조건이 충족되면 쿼리 코드는 노드 간 쿼리 부하를 분산하기 위해 작업을 진행합니다.</p>
<h2 id="Load-balance" class="common-anchor-header">로드 밸런스<button data-href="#Load-balance" class="anchor-icon" translate="no">
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
    </button></h2><p>부하 분산이 트리거되면 쿼리 코드는 먼저 대상 세그먼트를 대상 쿼리 노드에 로드합니다. 이 시점에서 두 쿼리 노드는 결과의 완전성을 보장하기 위해 검색 요청이 있을 때마다 대상 세그먼트의 검색 결과를 반환합니다.</p>
<p>대상 쿼리 노드가 대상 세그먼트를 성공적으로 로드한 후 쿼리 코드는 <code translate="no">sealedSegmentChangeInfo</code> 을 쿼리 채널에 게시합니다. 아래 그림과 같이 <code translate="no">onlineNodeID</code> 와 <code translate="no">onlineSegmentIDs</code> 는 각각 세그먼트를 로드하는 쿼리 노드와 로드된 세그먼트를, <code translate="no">offlineNodeID</code> 와 <code translate="no">offlineSegmentIDs</code> 는 세그먼트를 해제해야 하는 쿼리 노드와 해제할 세그먼트를 각각 나타냅니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/20220228_145413_f253cec15b.png" alt="sealedSegmentChangeInfo" class="doc-image" id="sealedsegmentchangeinfo" />
   </span> <span class="img-wrapper"> <span>sealedSegmentChangeInfo</span> </span></p>
<p><code translate="no">sealedSegmentChangeInfo</code> 을 수신한 소스 쿼리 노드는 대상 세그먼트를 릴리스합니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/20220228_145436_2604bc57a5.png" alt="Load Balance Workflow" class="doc-image" id="load-balance-workflow" />
   </span> <span class="img-wrapper"> <span>부하 분산 워크플로우</span> </span></p>
<p>소스 쿼리 노드가 대상 세그먼트를 릴리스하면 전체 프로세스가 성공합니다. 이 작업이 완료되면 쿼리 노드 간에 쿼리 부하가 분산되어 모든 쿼리 노드의 RAM 사용량이 <code translate="no">queryCoord.overloadedMemoryThresholdPercentage</code> 보다 크지 않으며, 부하 분산 후 원본 및 대상 쿼리 노드의 RAM 사용량 차이의 절대값이 부하 분산 전보다 작아집니다.</p>
<h2 id="Whats-next" class="common-anchor-header">다음 단계는 무엇인가요?<button data-href="#Whats-next" class="anchor-icon" translate="no">
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
    </button></h2><p>2.0의 새로운 기능 시리즈 블로그에서는 새로운 기능의 설계에 대해 설명하고자 합니다. 이 블로그 시리즈에서 자세히 읽어보세요!</p>
<ul>
<li><a href="https://milvus.io/blog/2022-02-07-how-milvus-deletes-streaming-data-in-distributed-cluster.md">Milvus가 분산 클러스터에서 스트리밍 데이터를 삭제하는 방법</a></li>
<li><a href="https://milvus.io/blog/2022-2-21-compact.md">Milvus에서 데이터를 압축하는 방법은 무엇인가요?</a></li>
<li><a href="https://milvus.io/blog/2022-02-28-how-milvus-balances-query-load-across-nodes.md">Milvus는 노드 간 쿼리 부하를 어떻게 분산하나요?</a></li>
<li><a href="https://milvus.io/blog/2022-2-14-bitset.md">비트셋으로 벡터 유사도 검색의 다양성을 구현하는 방법</a></li>
</ul>
<p>밀버스 2.0의 새로운 기능 블로그 시리즈의 피날레입니다. 이 시리즈에 이어 Milvus 2.0의 기본 아키텍처를 소개하는 새로운 Milvus <a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md">심층 분석</a> 시리즈를 계획하고 있습니다. 기대해 주세요.</p>
