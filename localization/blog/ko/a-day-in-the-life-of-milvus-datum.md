---
id: a-day-in-the-life-of-milvus-datum.md
title: 밀버스 데이텀의 하루 일과
author: 'Stefan Webb, Anthony Tu'
date: 2025-03-17T00:00:00.000Z
desc: 이제 밀버스 데이텀인 데이브의 하루 일과를 살펴봅시다.
cover: assets.zilliz.com/a_day_in_the_life_of_a_milvus_datum_ca279f7f59.png
tag: Engineering
tags: 'Deep Research, open source AI, Milvus, LangChain, DeepSeek R1'
recommend: true
canonicalUrl: 'https://milvus.io/blog/a-day-in-the-life-of-milvus-datum.md'
---
<p>수십억 개의 벡터로 확장되고 웹 규모의 트래픽을 처리하는 Milvus와 같은 고성능 <a href="https://zilliz.com/learn/what-is-vector-database">벡터 데이터베이스를</a> 구축하는 것은 결코 간단한 일이 아닙니다. 분산 시스템을 신중하고 지능적으로 설계해야 합니다. 이와 같은 시스템 내부에는 당연히 성능과 단순성 사이의 절충점이 존재할 수밖에 없습니다.</p>
<p>저희는 이 균형을 잘 맞추려고 노력했지만 내부의 일부 측면은 여전히 불투명한 상태로 남아 있습니다. 이 글에서는 Milvus가 데이터 삽입, 인덱싱, 노드 간 서비스를 어떻게 분류하는지에 대한 미스터리를 해소하고자 합니다. 쿼리 성능, 시스템 안정성, 디버깅 관련 문제를 효과적으로 최적화하려면 이러한 프로세스를 높은 수준에서 이해하는 것이 필수적입니다.</p>
<p>이제 Milvus 데이텀인 Dave의 하루를 살펴봅시다. <a href="https://milvus.io/docs/install-overview.md#Milvus-Distributed">Milvus 분산 배포의</a> 컬렉션에 Dave를 삽입한다고 가정해 보겠습니다(아래 다이어그램 참조). 겉으로 보기에는 데이브가 컬렉션에 바로 들어갑니다. 그러나 무대 뒤에서는 독립적인 하위 시스템에서 많은 단계가 발생합니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/a_day_in_the_life_of_a_milvus_datum_ca279f7f59.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Proxy-Nodes-and-the-Message-Queue" class="common-anchor-header">프록시 노드와 메시지 큐<button data-href="#Proxy-Nodes-and-the-Message-Queue" class="anchor-icon" translate="no">
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
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Proxy_Nodes_and_the_Message_Queue_03a0fde0c5.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>처음에는 예를 들어 PyMilvus 라이브러리를 통해 MilvusClient 객체를 호출하고 <code translate="no">_insert()</code>_ 요청을 <em>프록시 노드에</em> 보냅니다. 프록시 노드는 사용자와 데이터베이스 시스템 사이의 게이트웨이로, 들어오는 트래픽에 대한 로드 밸런싱과 사용자에게 반환되기 전에 여러 출력을 대조하는 등의 작업을 수행합니다.</p>
<p>항목의 기본 키에 해시 함수를 적용하여 어떤 <em>채널로</em> 전송할지 결정합니다. 펄서 또는 카프카 토픽으로 구현된 채널은 스트리밍 데이터를 보관하는 곳으로, 채널의 구독자에게 전송할 수 있습니다.</p>
<h2 id="Data-Nodes-Segments-and-Chunks" class="common-anchor-header">데이터 노드, 세그먼트 및 청크<button data-href="#Data-Nodes-Segments-and-Chunks" class="anchor-icon" translate="no">
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
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Data_Nodes_Segments_and_Chunks_ae122dd1ac.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>데이터가 적절한 채널로 전송되면 채널은 <em>데이터 노드에</em> 있는 해당 세그먼트로 데이터를 전송합니다. 데이터 노드는 <em>증가하는 세그먼트라고</em> 하는 데이터 버퍼를 저장하고 관리하는 역할을 담당합니다. 샤드당 하나의 성장 세그먼트가 있습니다.</p>
<p>세그먼트에 데이터가 삽입되면 세그먼트는 최대 크기까지 커지며, 기본값은 122MB입니다. 이 기간 동안 세그먼트의 작은 부분(기본적으로 16MB이며 <em>청크라고</em> 함)이 영구 스토리지(예: AWS의 S3 또는 MinIO와 같은 기타 호환 가능한 스토리지)로 푸시됩니다. 각 청크는 오브젝트 스토리지의 물리적 파일이며 필드마다 별도의 파일이 있습니다. 위의 그림은 개체 스토리지의 파일 계층 구조를 보여줍니다.</p>
<p>요약하자면, 컬렉션의 데이터는 데이터 노드에 걸쳐 분할되고, 그 안에서 버퍼링을 위해 세그먼트로 분할되며, 다시 영구 저장을 위해 필드별 청크로 분할됩니다. 위의 두 다이어그램을 보면 이를 더 명확하게 알 수 있습니다. 이러한 방식으로 들어오는 데이터를 분할함으로써 클러스터의 네트워크 대역폭, 컴퓨팅, 스토리지의 병렬성을 완전히 활용합니다.</p>
<h2 id="Sealing-Merging-and-Compacting-Segments" class="common-anchor-header">세그먼트 봉인, 병합, 압축하기<button data-href="#Sealing-Merging-and-Compacting-Segments" class="anchor-icon" translate="no">
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
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Sealing_Merging_and_Compacting_Segments_d5a6a37261.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>지금까지 친근한 데이브가 <code translate="no">_insert()</code>_ 쿼리에서 퍼시스턴트 스토리지로 어떻게 이동하는지에 대해 이야기했습니다. 물론 그의 이야기는 여기서 끝나지 않습니다. 검색 및 색인 프로세스를 보다 효율적으로 만들기 위한 추가 단계가 있습니다. 세그먼트의 크기와 수를 관리함으로써 시스템은 클러스터의 병렬성을 완전히 활용합니다.</p>
<p>데이터 노드에서 세그먼트가 최대 크기인 122MB에 도달하면 기본적으로 세그먼트가 <em>봉인된다고</em> 합니다. 이는 데이터 노드의 버퍼가 새 세그먼트를 위한 공간을 확보하기 위해 지워지고 영구 저장소의 해당 청크가 닫힌 세그먼트에 속한 것으로 표시된다는 의미입니다.</p>
<p>데이터 노드는 주기적으로 더 작은 봉인된 세그먼트를 찾아 세그먼트당 최대 크기인 1GB(기본값)에 도달할 때까지 더 큰 세그먼트로 병합합니다. Milvus에서 항목이 삭제되면 단순히 삭제 플래그가 표시된다는 점을 기억하세요. 데이브에게는 데스 로우라고 생각하시면 됩니다. 세그먼트에서 삭제된 항목의 수가 지정된 임계값(기본적으로 20%)을 초과하면 세그먼트의 크기가 축소되는데, 이를 <em>압축이라고</em> 합니다.</p>
<p>세그먼트 색인 및 검색</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Indexing_and_Searching_through_Segments_478c0067be.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Indexing_and_Searching_through_Segments_1_0c31b5a340.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>봉인된 세그먼트의 인덱스 작성을 담당하는 <em>인덱스 노</em>드라는 추가 노드 유형이 있습니다. 세그먼트가 봉인되면 데이터 노드는 인덱스 노드에 인덱스를 생성하도록 요청을 보냅니다. 그러면 인덱스 노드는 완성된 인덱스를 오브젝트 스토리지로 전송합니다. 봉인된 각 세그먼트에는 별도의 파일에 저장된 자체 인덱스가 있습니다. 버킷에 액세스하여 이 파일을 수동으로 검사할 수 있습니다. 파일 계층 구조는 위 그림을 참조하세요.</p>
<p>데이터 노드뿐만 아니라 쿼리 노드도 해당 샤드에 대한 메시지 큐 토픽을 구독합니다. 증가하는 세그먼트는 쿼리 노드에 복제되고, 노드는 필요에 따라 컬렉션에 속하는 메모리 봉인 세그먼트로 로드합니다. 데이터가 들어올 때마다 증가하는 각 세그먼트에 대한 인덱스를 구축하고, 데이터 저장소에서 봉인된 세그먼트에 대한 최종 인덱스를 로드합니다.</p>
<p>이제 Dave를 포함하는 <em>검색()</em> 요청으로 MilvusClient 객체를 호출한다고 상상해 보겠습니다. 프록시 노드를 통해 모든 쿼리 노드로 라우팅된 후, 각 쿼리 노드는 벡터 유사도 검색(또는 쿼리, 범위 검색, 그룹화 검색과 같은 다른 검색 방법 중 하나)을 수행하여 세그먼트에 대해 하나씩 반복합니다. 결과는 맵리듀스와 유사한 방식으로 노드 간에 대조되어 사용자에게 다시 전송되며, Dave는 마침내 사용자와 재회한 자신을 발견하고 기뻐합니다.</p>
<h2 id="Discussion" class="common-anchor-header">토론<button data-href="#Discussion" class="anchor-icon" translate="no">
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
    </button></h2><p>지금까지 데이브 데이텀의 하루를 <code translate="no">_insert()</code>_와 <code translate="no">_search()</code>_ 연산에 대해 살펴보았습니다. <code translate="no">_delete()</code> _ 및 <code translate="no">_upsert()</code>_와 같은 다른 작업도 비슷하게 작동합니다. 부득이하게 논의를 단순화하고 세부적인 내용은 생략해야 했습니다. 하지만 전반적으로 분산 시스템의 노드 간 병렬 처리를 위해 Milvus가 어떻게 설계되어 강력하고 효율적인지, 그리고 이를 최적화 및 디버깅에 어떻게 사용할 수 있는지 충분히 이해하셨을 것입니다.</p>
<p><em>이 글에서 중요한 점은 다음과 같습니다: Milvus는 노드 유형별로 문제를 분리하여 설계되었습니다. 각 노드 유형에는 상호 배타적인 특정 기능이 있으며, 스토리지와 컴퓨팅이 분리되어 있습니다.</em> 그 결과 사용 사례와 트래픽 패턴에 따라 매개변수를 조정하여 각 구성 요소를 독립적으로 확장할 수 있습니다. 예를 들어, 데이터 및 인덱스 노드를 확장하지 않고도 쿼리 노드 수를 확장하여 트래픽 증가에 대응할 수 있습니다. 이러한 유연성 덕분에 수십억 개의 벡터를 처리하고 100ms 미만의 쿼리 지연 시간으로 웹 규모 트래픽을 처리하는 Milvus 사용자들이 있습니다.</p>
<p>또한 Milvus의 완전 관리형 서비스인 <a href="https://zilliz.com/cloud">Zilliz Cloud를</a> 통해 분산 클러스터를 배포하지 않고도 Milvus의 분산 설계의 이점을 누릴 수 있습니다. <a href="https://cloud.zilliz.com/signup">지금 바로 질리즈 클라우드의 무료 티어에 가입하고 데이브를 실행에 옮겨보세요!</a></p>
