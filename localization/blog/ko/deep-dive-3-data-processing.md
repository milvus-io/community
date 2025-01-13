---
id: deep-dive-3-data-processing.md
title: 벡터 데이터베이스에서 데이터는 어떻게 처리되나요?
author: Zhenshan Cao
date: 2022-03-28T00:00:00.000Z
desc: >-
  Milvus는 프로덕션 AI 애플리케이션에 필수적인 데이터 관리 인프라를 제공합니다. 이 문서에서는 내부의 복잡한 데이터 처리 과정을
  공개합니다.
cover: assets.zilliz.com/How_Is_Data_Processed_in_a_Vector_Database_9fb236bc01.png
tag: Engineering
tags: 'Data science, Database, Technology, Artificial Intelligence, Vector Management'
canonicalUrl: 'https://milvus.io/blog/deep-dive-3-data-processing.md'
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/How_Is_Data_Processed_in_a_Vector_Database_9fb236bc01.png" alt="Cover image" class="doc-image" id="cover-image" />
   </span> <span class="img-wrapper"> <span>표지 이미지</span> </span></p>
<blockquote>
<p>이 글은 <a href="https://github.com/czs007">Zhenshan Cao가</a> 작성하고 <a href="https://www.linkedin.com/in/yiyun-n-2aa713163/">Angela Ni가</a> 번역했습니다.</p>
</blockquote>
<p>이 블로그 시리즈의 이전 두 글에서는 이미 세계에서 가장 진보된 벡터 데이터베이스인 Milvus의 <a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md">시스템 아키텍처와</a> <a href="https://milvus.io/blog/deep-dive-2-milvus-sdk-and-api.md">Python SDK 및 API에</a> 대해 다뤘습니다.</p>
<p>이 게시물은 주로 Milvus 시스템을 자세히 살펴보고 데이터 처리 구성 요소 간의 상호 작용을 살펴봄으로써 Milvus에서 데이터가 처리되는 방식을 이해하는 데 도움을 주는 것을 목표로 합니다.</p>
<p><em>시작하기 전에 유용한 몇 가지 리소스가 아래에 나열되어 있습니다. 이 글의 주제를 더 잘 이해하기 위해 먼저 읽어보시기 바랍니다.</em></p>
<ul>
<li><a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md">Milvus 아키텍처에 대해 자세히 알아보기</a></li>
<li><a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md#Data-Model">Milvus 데이터 모델</a></li>
<li><a href="https://milvus.io/docs/v2.0.x/four_layers.md">각 Milvus 구성 요소의 역할과 기능</a></li>
<li><a href="https://milvus.io/docs/v2.0.x/data_processing.md">Milvus의 데이터 처리</a></li>
</ul>
<h2 id="MsgStream-interface" class="common-anchor-header">MsgStream 인터페이스<button data-href="#MsgStream-interface" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://github.com/milvus-io/milvus/blob/ca129d4308cc7221bb900b3722dea9b256e514f9/docs/developer_guides/chap04_message_stream.md">MsgStream 인터페이스는</a> Milvus의 데이터 처리에 매우 중요합니다. <code translate="no">Start()</code> 가 호출되면 백그라운드의 코루틴이 <a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md#Log-as-data">로그 브로커에</a> 데이터를 쓰거나 거기에서 데이터를 읽습니다. <code translate="no">Close()</code> 이 호출되면 코루틴이 중지됩니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Msg_Stream_interface_66b70309a7.png" alt="MsgStream interface" class="doc-image" id="msgstream-interface" />
   </span> <span class="img-wrapper"> <span>MsgStream 인터페이스</span> </span></p>
<p>MsgStream은 생산자 및 소비자 역할을 할 수 있습니다. <code translate="no">AsProducer(channels []string)</code> 인터페이스는 MsgStream을 생산자로 정의하고 <code translate="no">AsConsumer(channels []string, subNamestring)</code>인터페이스는 소비자로 정의합니다. <code translate="no">channels</code> 매개변수는 두 인터페이스에서 공유되며 데이터를 쓰거나 데이터를 읽을 (물리적) 채널을 정의하는 데 사용됩니다.</p>
<blockquote>
<p>컬렉션을 만들 때 컬렉션의 샤드 수를 지정할 수 있습니다. 각 샤드는 <a href="https://milvus.io/docs/v2.0.x/glossary.md#VChannel">가상 채널(v채널)</a>에 해당합니다. 따라서 컬렉션에는 여러 개의 v채널이 있을 수 있습니다. Milvus는 로그 브로커의 각 v채널에 <a href="https://milvus.io/docs/v2.0.x/glossary.md#PChannel">물리적 채널(p채널)</a>을 할당합니다.</p>
</blockquote>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Each_virtual_channel_shard_corresponds_to_a_physical_channel_7cd60e4ed1.png" alt="Each virtual channel/shard corresponds to a physical channel." class="doc-image" id="each-virtual-channel/shard-corresponds-to-a-physical-channel." />
   </span> <span class="img-wrapper"> <span>각 가상 채널/샤드는 물리적 채널에 해당합니다</span>. </span></p>
<p><code translate="no">Produce()</code> 로그 브로커의 p채널에 데이터 쓰기를 담당하는 MsgStream 인터페이스에 있습니다. 데이터는 두 가지 방식으로 기록할 수 있습니다:</p>
<ul>
<li>단일 쓰기: 기본 키의 해시 값에 의해 엔티티가 다른 샤드(v채널)에 기록됩니다. 그런 다음 이러한 엔티티는 로그 브로커의 해당 p채널로 이동합니다.</li>
<li>브로드캐스트 쓰기: 엔티티가 매개변수 <code translate="no">channels</code> 에 의해 지정된 모든 p채널에 기록됩니다.</li>
</ul>
<p><code translate="no">Consume()</code> 는 일종의 차단 API입니다. 지정된 p채널에 사용 가능한 데이터가 없는 경우, MsgStream 인터페이스에서 <code translate="no">Consume()</code> 을 호출하면 코루틴이 차단됩니다. 반면 <code translate="no">Chan()</code> 은 비차단형 API로, 지정된 p채널에 기존 데이터가 있는 경우에만 코루틴이 데이터를 읽고 처리합니다. 그렇지 않으면 코루틴은 다른 작업을 처리할 수 있으며 사용 가능한 데이터가 없을 때 차단되지 않습니다.</p>
<p><code translate="no">Seek()</code> 는 장애 복구 메서드입니다. 새 노드가 시작되면 데이터 소비 기록을 가져와 <code translate="no">Seek()</code> 을 호출하여 중단된 지점부터 데이터 소비를 재개할 수 있습니다.</p>
<h2 id="Write-data" class="common-anchor-header">데이터 쓰기<button data-href="#Write-data" class="anchor-icon" translate="no">
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
    </button></h2><p>다른 v채널(샤드)에 기록되는 데이터는 삽입 메시지 또는 삭제 메시지일 수 있습니다. 이러한 v채널을 Dm채널(데이터 조작 채널)이라고도 합니다.</p>
<p>서로 다른 컬렉션이 로그 브로커에서 동일한 p채널을 공유할 수 있습니다. 하나의 컬렉션에는 여러 개의 샤드가 있을 수 있으며, 따라서 여러 개의 해당 v채널이 있을 수 있습니다. 결과적으로 동일한 컬렉션의 엔티티는 로그 브로커에서 여러 개의 대응하는 p채널로 흐릅니다. 결과적으로, p채널 공유의 이점은 로그 브로커의 높은 동시성으로 인해 처리량이 증가한다는 것입니다.</p>
<p>컬렉션을 생성할 때 샤드 개수뿐만 아니라 로그 브로커에서 v채널과 p채널 간의 매핑도 결정됩니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Write_path_in_Milvus_00d93fb377.png" alt="Write path in Milvus" class="doc-image" id="write-path-in-milvus" />
   </span> <span class="img-wrapper"> <span>Milvus에서 경로 쓰기</span> </span></p>
<p>위 그림과 같이 쓰기 경로에서 프록시는 MsgStream의 <code translate="no">AsProducer()</code> 인터페이스를 통해 로그 브로커에 데이터를 씁니다. 그런 다음 데이터 노드가 데이터를 소비하고, 소비된 데이터를 변환하여 오브젝트 스토리지에 저장합니다. 저장 경로는 데이터 코디네이터가 etcd에 기록하는 일종의 메타 정보입니다.</p>
<h3 id="Flowgraph" class="common-anchor-header">플로우 그래프</h3><p>로그 브로커에서 서로 다른 컬렉션이 동일한 p채널을 공유할 수 있기 때문에, 데이터를 소비할 때 데이터 노드나 쿼리 노드는 p채널의 데이터가 어느 컬렉션에 속하는지를 판단해야 합니다. 이 문제를 해결하기 위해 밀버스에는 플로우그래프가 도입되었습니다. 주로 공유된 p채널의 데이터를 컬렉션 ID별로 필터링하는 역할을 담당합니다. 따라서 각 플로우그래프는 컬렉션의 해당 샤드(v채널)에서 데이터 스트림을 처리한다고 말할 수 있습니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Flowgraph_in_write_path_1b201e1b71.png" alt="Flowgraph in write path" class="doc-image" id="flowgraph-in-write-path" />
   </span> <span class="img-wrapper"> <span>쓰기 경로의 플로우그래프</span> </span></p>
<h3 id="MsgStream-creation" class="common-anchor-header">MsgStream 생성</h3><p>데이터를 쓸 때 MsgStream 객체는 다음 두 가지 시나리오에서 생성됩니다:</p>
<ul>
<li>프록시가 데이터 삽입 요청을 받으면 먼저 루트 코디네이터(루트 코디)를 통해 v채널과 p채널 간의 매핑을 얻으려고 시도합니다. 그런 다음 프록시는 MsgStream 객체를 생성합니다.</li>
</ul>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Creating_Msg_Stream_object_in_write_path_Scenario_1_bdd0f94d8b.png" alt="Scenario 1" class="doc-image" id="scenario-1" />
   </span> <span class="img-wrapper"> <span>시나리오 1</span> </span></p>
<ul>
<li>데이터 노드가 시작되고 etcd에서 채널의 메타 정보를 읽으면 MsgStream 객체가 생성됩니다.</li>
</ul>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Creating_Msg_Stream_object_in_write_path_Scenario_2_5b3f99a6d1.png" alt="Scenario 2" class="doc-image" id="scenario-2" />
   </span> <span class="img-wrapper"> <span>시나리오 2</span> </span></p>
<h2 id="Read-data" class="common-anchor-header">데이터 읽기<button data-href="#Read-data" class="anchor-icon" translate="no">
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
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Read_path_in_Milvus_c2f0ae5109.png" alt="Read path in Milvus" class="doc-image" id="read-path-in-milvus" />
   </span> <span class="img-wrapper"> <span>Milvus의 읽기 경로</span> </span></p>
<p>데이터 읽기의 일반적인 워크플로는 위 이미지에 나와 있습니다. 쿼리 요청은 DqRequestChannel을 통해 쿼리 노드로 브로드캐스트됩니다. 쿼리 노드는 쿼리 작업을 병렬로 실행합니다. 쿼리 노드의 쿼리 결과는 gRPC를 거쳐 프록시가 결과를 집계한 후 클라이언트에 반환합니다.</p>
<p>데이터 읽기 프로세스를 자세히 살펴보면, 프록시가 쿼리 요청을 DqRequestChannel에 기록하는 것을 볼 수 있습니다. 그런 다음 쿼리 노드는 DqRequestChannel을 구독하여 메시지를 소비합니다. 구독한 모든 쿼리 노드가 메시지를 수신할 수 있도록 DqRequestChannel의 각 메시지는 브로드캐스트됩니다.</p>
<p>쿼리 노드가 쿼리 요청을 받으면, 밀폐된 세그먼트에 저장된 배치 데이터와 밀버스에 동적으로 삽입되어 증가하는 세그먼트에 저장되는 스트리밍 데이터 모두에 대해 로컬 쿼리를 수행합니다. 그 후 쿼리 노드는 봉인된 <a href="https://milvus.io/docs/v2.0.x/glossary.md#Segment">세그먼트와 증가하는 세그먼트</a> 모두에서 쿼리 결과를 집계해야 합니다. 이렇게 집계된 결과는 gRPC를 통해 프록시로 전달됩니다.</p>
<p>프록시는 여러 쿼리 노드에서 모든 결과를 수집한 다음 이를 집계하여 최종 결과를 얻습니다. 그런 다음 프록시는 최종 쿼리 결과를 클라이언트에 반환합니다. 각 쿼리 요청과 그에 대응하는 쿼리 결과는 동일한 고유 요청 ID로 레이블이 지정되므로 프록시는 어떤 쿼리 결과가 어떤 쿼리 요청에 해당하는지 파악할 수 있습니다.</p>
<h3 id="Flowgraph" class="common-anchor-header">흐름 그래프</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Flowgraph_in_read_path_8a5faf2d58.png" alt="Flowgraph in read path" class="doc-image" id="flowgraph-in-read-path" />
   </span> <span class="img-wrapper"> <span>읽기 경로의 플로우 그래프</span> </span></p>
<p>쓰기 경로와 마찬가지로 읽기 경로에도 플로우그래프가 도입되었습니다. Milvus는 증분 데이터와 기록 데이터의 처리를 통합하는 통합 람다 아키텍처를 구현합니다. 따라서 쿼리 노드는 실시간 스트리밍 데이터도 가져와야 합니다. 마찬가지로, 읽기 경로의 플로우그래프는 여러 컬렉션의 데이터를 필터링하고 구분합니다.</p>
<h3 id="MsgStream-creation" class="common-anchor-header">MsgStream 생성</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Creating_Msg_Stream_object_in_read_path_7f059bde2f.png" alt="Creating MsgStream object in read path" class="doc-image" id="creating-msgstream-object-in-read-path" />
   </span> <span class="img-wrapper"> <span>읽기 경로에서 MsgStream 객체 만들기</span> </span></p>
<p>데이터를 읽을 때 다음과 같은 시나리오에서 MsgStream 개체가 생성됩니다:</p>
<ul>
<li>Milvus에서는 데이터가 로드되지 않으면 데이터를 읽을 수 없습니다. 프록시는 데이터 로드 요청을 받으면 요청을 쿼리 코디네이터로 전송하여 다른 쿼리 노드에 샤드를 할당하는 방법을 결정합니다. 할당 정보(즉, v채널의 이름과 v채널과 해당 p채널 간의 매핑)는 메서드 호출 또는 RPC(원격 프로시저 호출)를 통해 쿼리 노드에 전송됩니다. 그 후 쿼리 노드는 데이터를 소비하기 위해 해당 MsgStream 객체를 생성합니다.</li>
</ul>
<h2 id="DDL-operations" class="common-anchor-header">DDL 작업<button data-href="#DDL-operations" class="anchor-icon" translate="no">
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
    </button></h2><p>DDL은 데이터 정의 언어의 약자입니다. 메타데이터에 대한 DDL 작업은 쓰기 요청과 읽기 요청으로 분류할 수 있습니다. 그러나 이 두 가지 유형의 요청은 메타데이터 처리 중에 동일하게 취급됩니다.</p>
<p>메타데이터에 대한 읽기 요청은 다음과 같습니다:</p>
<ul>
<li>쿼리 수집 스키마</li>
<li>쿼리 인덱싱 정보 등</li>
</ul>
<p>쓰기 요청에는 다음이 포함됩니다:</p>
<ul>
<li>컬렉션 만들기</li>
<li>컬렉션 삭제</li>
<li>색인 만들기</li>
<li>인덱스 삭제 및 기타</li>
</ul>
<p>DDL 요청은 클라이언트에서 프록시로 전송되고, 프록시는 수신된 순서대로 이러한 요청을 루트 코드로 전달하여 각 DDL 요청에 타임스탬프를 할당하고 요청에 대한 동적 확인을 수행합니다. 프록시는 각 요청을 직렬 방식으로 처리합니다. 즉, 한 번에 하나의 DDL 요청을 처리합니다. 프록시는 이전 요청 처리를 완료하고 루트 코드로부터 결과를 받을 때까지 다음 요청을 처리하지 않습니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/DDL_operations_02679a393c.png" alt="DDL operations." class="doc-image" id="ddl-operations." />
   </span> <span class="img-wrapper"> <span>DDL 작업</span>. </span></p>
<p>위 그림에서 보듯이 루트 코디 작업 대기열에 <code translate="no">K</code> DDL 요청이 있습니다. 작업 대기열의 DDL 요청은 루트 코드로부터 받은 순서대로 정렬됩니다. 따라서 <code translate="no">ddl1</code> 이 루트 코드로 가장 먼저 전송되고 <code translate="no">ddlK</code> 이 이 배치의 마지막 요청입니다. 루트 코드는 시간 순서대로 요청을 하나씩 처리합니다.</p>
<p>분산 시스템에서 프록시와 루트 코드 간의 통신은 gRPC에 의해 활성화됩니다. 루트 코드는 실행된 작업의 최대 타임스탬프 값을 기록하여 모든 DDL 요청이 시간 순서대로 처리되도록 합니다.</p>
<p>프록시 1과 프록시 2라는 두 개의 독립적인 프록시가 있다고 가정해 보겠습니다. 두 프록시 모두 동일한 루트 코드로 DDL 요청을 보냅니다. 하지만 한 가지 문제는 앞선 요청이 반드시 나중에 다른 프록시가 받은 요청보다 먼저 루트 좌표로 전송되는 것은 아니라는 점입니다. 예를 들어 위 이미지에서 프록시 1에서 루트 코드로 <code translate="no">DDL_K-1</code> 을 보낼 때 프록시 2에서 보낸 <code translate="no">DDL_K</code> 은 이미 루트 코드로부터 수락되어 실행되고 있습니다. 루트 코드로 기록된 대로 이 시점에서 실행된 작업의 최대 타임스탬프 값은 <code translate="no">K</code> 입니다. 따라서 시간 순서를 방해하지 않기 위해 <code translate="no">DDL_K-1</code> 요청은 루트 코드의 작업 대기열에 의해 거부됩니다. 그러나 프록시 2가 이 시점에서 루트 코드로 <code translate="no">DDL_K+5</code> 요청을 보내면 요청이 작업 대기열에 수락되고 타임스탬프 값에 따라 나중에 실행됩니다.</p>
<h2 id="Indexing" class="common-anchor-header">인덱싱<button data-href="#Indexing" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Building-an-index" class="common-anchor-header">인덱스 구축</h3><p>클라이언트로부터 인덱스 구축 요청을 받으면 프록시는 먼저 요청에 대한 정적 검사를 수행한 후 루트 코드로 보냅니다. 그런 다음 루트 코드는 이러한 인덱스 구축 요청을 메타 저장소(etcd)에 지속하고 인덱스 코디네이터(인덱스 코디)에게 요청을 보냅니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Building_an_index_e130a4e715.png" alt="Building an index." class="doc-image" id="building-an-index." />
   </span> <span class="img-wrapper"> <span>인덱스 구축</span>. </span></p>
<p>위 그림과 같이 인덱스 코디네이터는 루트 코디네이터로부터 인덱스 구축 요청을 받으면 먼저 메타 저장소인 etcd에 작업을 지속합니다. 인덱스 구축 작업의 초기 상태는 <code translate="no">Unissued</code> 입니다. 인덱스 코드는 각 인덱스 노드의 작업 부하 기록을 유지하며, 부하가 적은 인덱스 노드로 인바운드 작업을 보냅니다. 작업이 완료되면 인덱스 노드는 작업 상태를 <code translate="no">Finished</code> 또는 <code translate="no">Failed</code> 이라는 메타 저장소에 기록하는데, 이 저장소는 Milvus의 etcd입니다. 그러면 인덱스 코드는 etcd에서 조회하여 인덱스 구축 작업의 성공 또는 실패 여부를 파악합니다. 제한된 시스템 리소스나 인덱스 노드의 드롭아웃으로 인해 작업이 실패하면, 인덱스 코드는 전체 프로세스를 다시 트리거하고 동일한 작업을 다른 인덱스 노드에 할당합니다.</p>
<h3 id="Dropping-an-index" class="common-anchor-header">인덱스 삭제</h3><p>또한 인덱스 코드는 인덱스 삭제 요청도 담당합니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Dropping_an_index_afdab6a339.png" alt="Dropping an index." class="doc-image" id="dropping-an-index." />
   </span> <span class="img-wrapper"> <span>인덱스 삭제하기</span>. </span></p>
<p>루트 코드는 클라이언트로부터 인덱스 삭제 요청을 받으면 먼저 인덱스를 &quot;삭제됨&quot;으로 표시하고 그 결과를 인덱스 코드로 알리면서 클라이언트에 반환합니다. 그런 다음 인덱스 코드는 <code translate="no">IndexID</code> 으로 모든 인덱싱 작업을 필터링하고 조건에 일치하는 작업은 삭제합니다.</p>
<p>인덱스 코드의 백그라운드 코루틴은 "삭제됨"으로 표시된 모든 인덱싱 작업을 개체 스토리지(MinIO 및 S3)에서 점차적으로 삭제합니다. 이 프로세스에는 recycleIndexFiles 인터페이스가 포함됩니다. 해당 인덱스 파일이 모두 삭제되면 삭제된 인덱싱 작업의 메타 정보가 메타 저장소(etcd)에서 제거됩니다.</p>
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
    </button></h2><p>Milvus 2.0의 <a href="https://milvus.io/blog/2022-1-25-annoucing-general-availability-of-milvus-2-0.md">공식 출시 발표와</a> 함께, Milvus 아키텍처와 소스 코드에 대한 심층적인 해석을 제공하기 위해 Milvus 딥 다이브 블로그 시리즈를 기획했습니다. 이 블로그 시리즈에서 다루는 주제는 다음과 같습니다:</p>
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
