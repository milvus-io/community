---
id: deep-dive-2-milvus-sdk-and-api.md
title: Milvus Python SDK 및 API 소개
author: Xuan Yang
date: 2022-03-21T00:00:00.000Z
desc: SDK가 Milvus와 상호 작용하는 방식과 ORM 스타일 API가 Milvus를 더 잘 관리하는 데 도움이 되는 이유를 알아보세요.
cover: assets.zilliz.com/20220322_175856_e8e7bea7dc.png
tag: Engineering
tags: 'Data science, Database, Technology, Artificial Intelligence, Vector Management'
canonicalUrl: 'https://milvus.io/blog/deep-dive-2-milvus-sdk-and-api.md'
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/20220322_175856_e8e7bea7dc.png" alt="Cover image" class="doc-image" id="cover-image" />
   </span> <span class="img-wrapper"> <span>표지 이미지</span> </span></p>
<p>By <a href="https://github.com/XuanYang-cn">Xuan Yang</a></p>
<h2 id="Background" class="common-anchor-header">배경<button data-href="#Background" class="anchor-icon" translate="no">
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
    </button></h2><p>다음 그림은 gRPC를 통한 SDK와 Milvus 간의 상호 작용을 보여줍니다. Milvus를 블랙박스라고 상상해 보세요. 프로토콜 버퍼는 서버의 인터페이스와 서버가 전달하는 정보의 구조를 정의하는 데 사용됩니다. 따라서 블랙박스 Milvus의 모든 작업은 프로토콜 API에 의해 정의됩니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/SDK_10c9673111.png" alt="Interaction" class="doc-image" id="interaction" />
   </span> <span class="img-wrapper"> <span>상호 작용</span> </span></p>
<h2 id="Milvus-Protocol-API" class="common-anchor-header">Milvus 프로토콜 API<button data-href="#Milvus-Protocol-API" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 프로토콜 API는 <code translate="no">milvus.proto</code>, <code translate="no">common.proto</code>, <code translate="no">schema.proto</code> 로 구성되며, <code translate="no">.proto</code> 이 접미사로 붙은 프로토콜 버퍼 파일입니다. 제대로 작동하려면 SDK는 이러한 프로토콜 버퍼 파일을 사용하여 Milvus와 상호 작용해야 합니다.</p>
<h3 id="milvusproto" class="common-anchor-header">milvus.proto</h3><p><code translate="no">milvus.proto</code> 는 Milvus의 모든 RPC 인터페이스를 추가로 정의하는 <code translate="no">MilvusService</code> 를 정의하기 때문에 Milvus 프로토콜 API의 핵심 구성 요소입니다.</p>
<p>다음 코드 샘플은 <code translate="no">CreatePartitionRequest</code> 인터페이스를 보여줍니다. 여기에는 파티션 생성 요청을 시작할 수 있는 두 개의 주요 문자열 유형 매개변수 <code translate="no">collection_name</code> 와 <code translate="no">partition_name</code> 가 있습니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/code_d5f034d58d.png" alt="CreatePartitionRequest" class="doc-image" id="createpartitionrequest" />
   </span> <span class="img-wrapper"> <span>CreatePartitionRequest</span> </span></p>
<p><a href="https://github.com/milvus-io/milvus-proto/blob/44f59db22b27cc55e4168c8e53b6e781c010a713/proto/milvus.proto">파이밀버스 GitHub 리포지토리</a> 19번 줄의 프로토콜 예제를 확인하세요.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/create_partition_938691f07f.png" alt="Example" class="doc-image" id="example" />
   </span> <span class="img-wrapper"> <span>예제</span> </span></p>
<p><code translate="no">CreatePartitionRequest</code> 의 정의는 여기에서 확인할 수 있습니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/20220321_112254_4ec4f35bd3.png" alt="Definition" class="doc-image" id="definition" />
   </span> <span class="img-wrapper"> <span>정의</span> </span></p>
<p>Milvus의 기능이나 다른 프로그래밍 언어로 SDK를 개발하고자 하는 기여자는 RPC를 통해 Milvus가 제공하는 모든 인터페이스를 찾을 수 있습니다.</p>
<h3 id="commonproto" class="common-anchor-header">common.proto</h3><p><code translate="no">common.proto</code> 는 <code translate="no">ErrorCode</code>, <code translate="no">Status</code> 을 포함한 일반적인 정보 유형을 정의합니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/20220321_112303_eaafc432a8.png" alt="common.proto" class="doc-image" id="common.proto" />
   </span> <span class="img-wrapper"> <span>common.proto</span> </span></p>
<h3 id="schemaproto" class="common-anchor-header">schema.proto</h3><p><code translate="no">schema.proto</code> 는 매개변수에서 스키마를 정의합니다. 다음 코드 샘플은 <code translate="no">CollectionSchema</code> 의 예시입니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/20220321_112313_df4ebe36e7.png" alt="schema.proto" class="doc-image" id="schema.proto" />
   </span> <span class="img-wrapper"> <span>schema.proto</span> </span></p>
<p><code translate="no">milvus.proto</code>, <code translate="no">common.proto</code>, <code translate="no">schema.proto</code> 이 함께 Milvus의 API를 구성하며, RPC를 통해 호출할 수 있는 모든 작업을 나타냅니다.</p>
<p>소스 코드를 자세히 살펴보면 <code translate="no">create_index</code> 와 같은 인터페이스가 호출될 때 실제로는 <code translate="no">describe_collection</code> 및 <code translate="no">describe_index</code> 와 같은 여러 개의 RPC 인터페이스를 호출한다는 것을 알 수 있습니다. Milvus의 많은 외형 인터페이스는 여러 RPC 인터페이스의 조합입니다.</p>
<p>RPC의 동작을 이해했다면 조합을 통해 Milvus의 새로운 기능을 개발할 수 있습니다. 여러분의 상상력과 창의력을 발휘하여 Milvus 커뮤니티에 기여하는 것을 환영합니다.</p>
<h2 id="PyMilvus-20" class="common-anchor-header">PyMilvus 2.0<button data-href="#PyMilvus-20" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Object-relational-mapping-ORM" class="common-anchor-header">객체 관계형 매핑(ORM)</h3><p>간단히 말해서, 객체 관계형 매핑(ORM)은 로컬 객체에서 작업을 수행할 때 해당 작업이 서버의 해당 객체에 영향을 미치는 것을 말합니다. PyMilvus ORM 스타일 API는 다음과 같은 특징이 있습니다:</p>
<ol>
<li>객체에서 직접 작동합니다.</li>
<li>서비스 로직과 데이터 액세스 세부 정보를 분리합니다.</li>
<li>구현의 복잡성을 숨기고, 배포 접근 방식이나 구현에 관계없이 여러 Milvus 인스턴스에서 동일한 스크립트를 실행할 수 있습니다.</li>
</ol>
<h3 id="ORM-style-API" class="common-anchor-header">ORM 스타일 API</h3><p>ORM 스타일 API의 핵심 중 하나는 Milvus 연결 제어에 있습니다. 예를 들어, 여러 Milvus 서버에 별칭을 지정하고 해당 별칭으로만 서버에 연결하거나 연결을 끊을 수 있습니다. 심지어 로컬 서버 주소를 삭제하고 특정 연결을 통해 특정 개체를 정밀하게 제어할 수도 있습니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/20220321_112320_d5ff08a582.png" alt="Control Connection" class="doc-image" id="control-connection" />
   </span> <span class="img-wrapper"> <span>연결 제어</span> </span></p>
<p>ORM 스타일 API의 또 다른 특징은 추상화 후 컬렉션, 파티션, 인덱스를 포함한 모든 작업을 객체에서 직접 수행할 수 있다는 점입니다.</p>
<p>기존 컬렉션 객체를 가져오거나 새 컬렉션 객체를 생성하여 컬렉션 객체를 추상화할 수 있습니다. 또한 연결 별칭을 사용하여 특정 개체에 Milvus 연결을 할당하여 이러한 개체에 대해 로컬로 작업할 수 있습니다.</p>
<p>파티션 개체를 만들려면 부모 컬렉션 개체를 사용하여 만들거나 컬렉션 개체를 만들 때와 마찬가지로 만들 수 있습니다. 이러한 방법은 인덱스 객체에도 사용할 수 있습니다.</p>
<p>이러한 파티션 또는 인덱스 개체가 존재하는 경우 상위 컬렉션 개체를 통해 가져올 수 있습니다.</p>
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
    </button></h2><p>Milvus 2.0의 <a href="https://milvus.io/blog/2022-1-25-annoucing-general-availability-of-milvus-2-0.md">공식 출시 발표와</a> 함께 Milvus 아키텍처와 소스 코드에 대한 심층적인 해석을 제공하기 위해 Milvus 딥 다이브 블로그 시리즈를 기획했습니다. 이 블로그 시리즈에서 다루는 주제는 다음과 같습니다:</p>
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
