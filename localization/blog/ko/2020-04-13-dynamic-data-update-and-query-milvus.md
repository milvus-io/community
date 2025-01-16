---
id: dynamic-data-update-and-query-milvus.md
title: 준비
author: milvus
date: 2020-04-13T21:02:08.632Z
desc: 벡터 검색이 더욱 직관적이고 편리해졌습니다.
cover: assets.zilliz.com/header_62d7b8c823.png
tag: Engineering
canonicalUrl: 'https://zilliz.com/blog/dynamic-data-update-and-query-milvus'
---
<custom-h1>Milvus가 동적 데이터 업데이트 및 쿼리를 구현하는 방법</custom-h1><p>이 글에서는 주로 Milvus의 메모리에 벡터 데이터가 기록되는 방식과 이러한 기록이 유지되는 방식에 대해 설명합니다.</p>
<p>다음은 주요 설계 목표입니다:</p>
<ol>
<li>데이터 가져오기의 효율성이 높아야 합니다.</li>
<li>데이터 가져오기 후 가능한 한 빨리 데이터를 확인할 수 있어야 합니다.</li>
<li>데이터 파일의 조각화를 방지합니다.</li>
</ol>
<p>따라서 데이터를 삽입하기 위한 메모리 버퍼(삽입 버퍼)를 구축하여 디스크와 운영체제에서 랜덤 IO의 컨텍스트 전환 횟수를 줄여 데이터 삽입 성능을 향상시켰습니다. 멤테이블과 멤테이블파일 기반의 메모리 스토리지 아키텍처를 통해 데이터를 보다 편리하게 관리하고 직렬화할 수 있습니다. 버퍼의 상태는 변경 가능과 변경 불가능으로 구분되어 외부 서비스를 계속 사용하면서 데이터를 디스크에 보존할 수 있습니다.</p>
<h2 id="Preparation" class="common-anchor-header">준비<button data-href="#Preparation" class="anchor-icon" translate="no">
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
    </button></h2><p>사용자가 Milvus에 벡터를 삽입할 준비가 되면, 먼저 컬렉션을 생성해야 합니다(* 0.7.0 버전에서는 테이블의 이름이 컬렉션으로 변경됨). 컬렉션은 Milvus에서 벡터를 기록하고 검색하기 위한 가장 기본적인 단위입니다.</p>
<p>각 컬렉션에는 고유한 이름과 설정할 수 있는 몇 가지 속성이 있으며, 컬렉션 이름을 기준으로 벡터를 삽입하거나 검색할 수 있습니다. 새 컬렉션을 생성하면 Milvus는 이 컬렉션의 정보를 메타데이터에 기록합니다.</p>
<h2 id="Data-Insertion" class="common-anchor-header">데이터 삽입<button data-href="#Data-Insertion" class="anchor-icon" translate="no">
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
    </button></h2><p>사용자가 데이터 삽입 요청을 보내면 데이터가 직렬화 및 역직렬화되어 Milvus 서버에 도달합니다. 이제 데이터가 메모리에 기록됩니다. 메모리 쓰기는 크게 다음 단계로 나뉩니다:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_data_insertion_milvus_99448bae50.png" alt="2-data-insertion-milvus.png" class="doc-image" id="2-data-insertion-milvus.png" />
   </span> <span class="img-wrapper"> <span>2-데이터-삽입-밀버스.png</span> </span></p>
<ol>
<li>MemManager에서 컬렉션의 이름에 해당하는 MemTable을 찾거나 새로 만듭니다. 각 MemTable은 메모리의 컬렉션 버퍼에 해당합니다.</li>
<li>멤테이블은 하나 이상의 멤테이블파일을 포함합니다. 새 MemTableFile을 생성할 때마다 이 정보를 메타에 동시에 기록합니다. 멤테이블 파일은 두 가지 상태로 나뉩니다: 변경 가능과 변경 불가능. 멤테이블파일의 크기가 임계값에 도달하면 변경 불가능 상태가 됩니다. 각 멤테이블은 한 번에 하나의 변경 가능한 멤테이블파일만 기록할 수 있습니다.</li>
<li>각 MemTableFile의 데이터는 최종적으로 설정된 인덱스 타입의 형식으로 메모리에 기록됩니다. MemTableFile은 메모리의 데이터를 관리하기 위한 가장 기본적인 단위입니다.</li>
<li>삽입된 데이터의 메모리 사용량은 언제든 미리 설정된 값(insert_buffer_size)을 초과하지 않습니다. 이는 데이터 삽입 요청이 들어올 때마다 MemManager가 각 MemTable에 포함된 MemTableFile이 차지하는 메모리를 쉽게 계산한 후 현재 메모리에 맞게 삽입 요청을 조정하기 때문입니다.</li>
</ol>
<p>MemManager, MemTable 및 MemTableFile의 다단계 아키텍처를 통해 데이터 삽입을 보다 효과적으로 관리하고 유지할 수 있습니다. 물론 이보다 훨씬 더 많은 작업을 수행할 수 있습니다.</p>
<h2 id="Near-Real-time-Query" class="common-anchor-header">실시간에 가까운 쿼리<button data-href="#Near-Real-time-Query" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus에서는 삽입된 데이터가 메모리에서 디스크로 이동하는 데 길어야 1초 정도만 기다리면 됩니다. 이 전체 프로세스는 다음 그림으로 대략적으로 요약할 수 있습니다:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_near_real_time_query_milvus_f3cfdd00fb.png" alt="2-near-real-time-query-milvus.png" class="doc-image" id="2-near-real-time-query-milvus.png" />
   </span> <span class="img-wrapper"> <span>2-near-real-time-query-milvus.png</span> </span></p>
<p>먼저 삽입된 데이터가 메모리의 삽입 버퍼에 들어갑니다. 이 버퍼는 직렬화를 준비하기 위해 주기적으로 초기 변경 가능 상태에서 변경 불가능 상태로 변경됩니다. 그런 다음 이 불변 버퍼는 백그라운드 직렬화 스레드에 의해 주기적으로 디스크에 직렬화됩니다. 데이터가 배치되면 주문 정보가 메타데이터에 기록됩니다. 이 시점에서 데이터를 검색할 수 있습니다!</p>
<p>이제 그림의 단계를 자세히 설명하겠습니다.</p>
<p>우리는 이미 가변 버퍼에 데이터를 삽입하는 과정을 알고 있습니다. 다음 단계는 변경 가능한 버퍼에서 변경 불가능한 버퍼로 전환하는 것입니다:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_mutable_buffer_immutable_buffer_milvus_282b66c5fe.png" alt="3-mutable-buffer-immutable-buffer-milvus.png" class="doc-image" id="3-mutable-buffer-immutable-buffer-milvus.png" />
   </span> <span class="img-wrapper"> <span>3-mutable-buffer-immutable-buffer-milvus.png</span> </span></p>
<p>변경 불가능한 대기열은 백그라운드 직렬화 스레드에 변경 불가능한 상태와 직렬화할 준비가 된 MemTableFile을 제공합니다. 각 MemTable은 자체 불변 대기열을 관리하며, MemTable의 유일한 변경 가능한 MemTableFile의 크기가 임계값에 도달하면 불변 대기열로 들어갑니다. ToImmutable을 담당하는 백그라운드 스레드는 주기적으로 MemTable이 관리하는 변경 불가능한 큐에 있는 모든 MemTableFiles를 가져와 전체 변경 불가능한 큐로 보냅니다. 메모리에 데이터를 쓰는 작업과 메모리에 있는 데이터를 쓰기 불가능한 상태로 변경하는 두 가지 작업이 동시에 일어날 수 없으며, 공통의 잠금이 필요하다는 점에 유의해야 합니다. 그러나 ToImmutable의 연산은 매우 간단하고 지연이 거의 발생하지 않으므로 삽입된 데이터에 대한 성능 영향은 미미합니다.</p>
<p>다음 단계는 직렬화 대기열에 있는 MemTableFile을 디스크에 직렬화하는 것입니다. 이 작업은 크게 세 단계로 나뉩니다:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/4_serialize_memtablefile_milvus_95766abdfb.png" alt="4-serialize-memtablefile-milvus.png" class="doc-image" id="4-serialize-memtablefile-milvus.png" />
   </span> <span class="img-wrapper"> <span>4-serialize-memtablefile-milvus.png</span> </span></p>
<p>먼저 백그라운드 직렬화 스레드가 주기적으로 변경 불가능한 대기열에서 MemTableFile을 가져옵니다. 그런 다음 고정된 크기의 원시 파일(원시 테이블 파일)로 직렬화합니다. 마지막으로 이 정보를 메타데이터에 기록합니다. 벡터 검색을 수행할 때, 메타데이터에서 해당 TableFile을 쿼리합니다. 여기에서 이러한 데이터를 검색할 수 있습니다!</p>
<p>또한, 설정된 index_file_size에 따라 직렬화 스레드가 직렬화 사이클을 완료한 후, 일부 고정 크기의 TableFile을 TableFile로 병합하고 이러한 정보도 메타데이터에 기록합니다. 이때 TableFile을 인덱싱할 수 있습니다. 인덱스 구축도 비동기식으로 이루어집니다. 인덱스 작성을 담당하는 또 다른 백그라운드 스레드가 주기적으로 메타데이터의 ToIndex 상태에 있는 TableFile을 읽어 해당 인덱스 작성을 수행합니다.</p>
<h2 id="Vector-search" class="common-anchor-header">벡터 검색<button data-href="#Vector-search" class="anchor-icon" translate="no">
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
    </button></h2><p>실제로 TableFile과 메타데이터의 도움으로 벡터 검색이 더 직관적이고 편리해진 것을 알 수 있습니다. 일반적으로 메타데이터에서 쿼리한 컬렉션에 해당하는 TableFile을 가져와서 각 TableFile에서 검색하고 마지막으로 병합해야 합니다. 이 글에서는 검색의 구체적인 구현에 대해서는 다루지 않습니다.</p>
<p>더 자세히 알고 싶으시다면 소스 코드를 읽어보시거나 Milvus에 대한 다른 기술 문서를 읽어보시기 바랍니다!</p>
