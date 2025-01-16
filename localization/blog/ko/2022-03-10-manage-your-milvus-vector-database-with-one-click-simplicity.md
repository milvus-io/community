---
id: 2022-03-10-manage-your-milvus-vector-database-with-one-click-simplicity.md
title: 원클릭으로 간편하게 Milvus 벡터 데이터베이스 관리하기
author: Zhen Chen
date: 2022-03-10T00:00:00.000Z
desc: Attu - Milvus 2.0용 GUI 도구.
cover: assets.zilliz.com/Attu_3ff9a76156.png
tag: Engineering
tags: 'Data science, Database, Technology, Artificial Intelligence, Vector Management'
canonicalUrl: >-
  https://zilliz.com/blog/manage-your-milvus-vector-database-with-one-click-simplicity
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Attu_3ff9a76156.png" alt="Binlog Cover Image" class="doc-image" id="binlog-cover-image" />
   </span> <span class="img-wrapper"> <span>빈로그 표지 이미지</span> </span></p>
<p><a href="https://github.com/czhen-zilliz">Zhen Chen이</a> 초안을 작성하고 <a href="https://github.com/LocoRichard">Lichen Wang이</a> 수정했습니다.</p>
<p style="font-size: 12px;color: #4c5a67">원본 게시물을 확인하려면 <a href="https://zilliz.com/blog/manage-your-milvus-vector-database-with-one-click-simplicity">여기를</a> 클릭하세요.</p> 
<p>비정형 데이터 처리에 대한 수요가 급증하는 가운데 Milvus 2.0이 눈에 띕니다. 대규모 생산 시나리오를 위해 설계된 AI 지향 벡터 데이터베이스 시스템입니다. 이러한 Milvus SDK와 Milvus의 명령줄 인터페이스인 Milvus CLI 외에도 사용자가 Milvus를 보다 직관적으로 조작할 수 있는 도구가 있을까요? 정답은 '예'입니다. 질리즈는 Milvus 전용 그래픽 사용자 인터페이스인 Attu를 발표했습니다. 이 글에서는 Attu로 벡터 유사도 검색을 수행하는 방법을 단계별로 보여드리고자 합니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/map_aa1cda30d4.png" alt="Attu island" class="doc-image" id="attu-island" />
   </span> <span class="img-wrapper"> <span>Attu 섬</span> </span></p>
<p>사용법이 가장 단순한 Milvus CLI와 비교했을 때, Attu는 더 많은 기능을 제공합니다:</p>
<ul>
<li>Windows OS, macOS, Linux OS용 설치 프로그램;</li>
<li>밀버스를 더욱 쉽게 사용할 수 있는 직관적인 GUI;</li>
<li>Milvus의 주요 기능 지원;</li>
<li>맞춤형 기능 확장을 위한 플러그인</li>
<li>Milvus 인스턴스를 보다 쉽게 이해하고 관리할 수 있는 완전한 시스템 토폴로지 정보.</li>
</ul>
<h2 id="Installation" class="common-anchor-header">설치<button data-href="#Installation" class="anchor-icon" translate="no">
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
    </button></h2><p>Attu의 최신 릴리스는 <a href="https://github.com/zilliztech/attu/releases">GitHub에서</a> 찾을 수 있습니다. Attu는 다양한 운영 체제를 위한 실행 가능한 설치 프로그램을 제공합니다. 오픈 소스 프로젝트이며 모든 사람의 기여를 환영합니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/installation_bbe62873af.png" alt="Installation" class="doc-image" id="installation" />
   </span> <span class="img-wrapper"> <span>설치</span> </span></p>
<p>Docker를 통해 Attu를 설치할 수도 있습니다.</p>
<pre><code translate="no" class="language-shell">docker run -p <span class="hljs-number">8000</span>:<span class="hljs-number">3000</span> -e <span class="hljs-variable constant_">HOST_URL</span>=<span class="hljs-attr">http</span>:<span class="hljs-comment">//{ attu IP }:8000 -e MILVUS_URL={milvus server IP}:19530 zilliz/attu:latest</span>
<button class="copy-code-btn"></button></code></pre>
<p><code translate="no">attu IP</code> 는 Attu가 실행되는 환경의 IP 주소이고 <code translate="no">milvus server IP</code> 는 Milvus가 실행되는 환경의 IP 주소입니다.</p>
<p>Attu를 성공적으로 설치했다면 인터페이스에 Milvus IP와 포트를 입력하여 Attu를 시작할 수 있습니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/connect_1fde46d9d5.png" alt="Connect Milvus with Attu" class="doc-image" id="connect-milvus-with-attu" />
   </span> <span class="img-wrapper"> <span>Milvus와 Attu 연결하기</span> </span></p>
<h2 id="Feature-overview" class="common-anchor-header">기능 개요<button data-href="#Feature-overview" class="anchor-icon" translate="no">
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
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/overview_591e230514.png" alt="Overview page" class="doc-image" id="overview-page" />
   </span> <span class="img-wrapper"> <span>개요 페이지</span> </span></p>
<p>Attu 인터페이스는 왼쪽 탐색 창의 네 아이콘에 각각 해당하는 <strong>개요</strong> 페이지, <strong>수집</strong> 페이지, <strong>벡터 검색</strong> 페이지, <strong>시스템 보기</strong> 페이지로 구성됩니다.</p>
<p><strong>개요</strong> 페이지에는 로드된 컬렉션이 표시됩니다. <strong>컬렉션</strong> 페이지에는 모든 컬렉션이 나열되고 로드 또는 해제되었는지 여부가 표시됩니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/collection_42656fe308.png" alt="Collection page" class="doc-image" id="collection-page" />
   </span> <span class="img-wrapper"> <span>컬렉션 페이지</span> </span></p>
<p><strong>벡터 검색</strong> 및 <strong>시스템 보기</strong> 페이지는 Attu의 플러그인입니다. 플러그인의 개념과 사용법은 블로그의 마지막 부분에서 소개할 예정입니다.</p>
<p><strong>벡터 검색</strong> 페이지에서 벡터 유사도 검색을 수행할 수 있습니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/vector_search_be7365687c.png" alt="Vector Search page" class="doc-image" id="vector-search-page" />
   </span> <span class="img-wrapper"> <span>벡터 검색 페이지</span> </span></p>
<p><strong>시스템 뷰</strong> 페이지에서는 밀버스의 토폴로지 구조를 확인할 수 있습니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/system_view_e1df15023d.png" alt="System View page" class="doc-image" id="system-view-page" />
   </span> <span class="img-wrapper"> <span>시스템 뷰 페이지</span> </span></p>
<p>노드를 클릭하면 각 노드의 상세 정보를 확인할 수도 있습니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/node_view_5bbc25f9b2.png" alt="Node view" class="doc-image" id="node-view" />
   </span> <span class="img-wrapper"> <span>노드 뷰</span> </span></p>
<h2 id="Demonstration" class="common-anchor-header">데모<button data-href="#Demonstration" class="anchor-icon" translate="no">
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
    </button></h2><p>테스트 데이터 세트를 통해 Attu를 살펴봅시다.</p>
<p>다음 테스트에 사용된 데이터 세트는 <a href="https://github.com/zilliztech/attu/tree/main/examples">GitHub</a> 리포지토리에서 확인하세요.</p>
<p>먼저 다음 네 개의 필드가 있는 test라는 이름의 컬렉션을 만듭니다:</p>
<ul>
<li>필드 이름: id, 기본 키 필드</li>
<li>필드 이름: 벡터, 벡터 필드, 부동 소수점 벡터, 차원: 128</li>
<li>필드 이름: brand, 스칼라 필드, Int64</li>
<li>필드 이름: color, 스칼라 필드, Int64</li>
</ul>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/create_collection_95dfa15354.png" alt="Create a collection" class="doc-image" id="create-a-collection" />
   </span> <span class="img-wrapper"> <span>컬렉션 만들기</span> </span></p>
<p>컬렉션이 성공적으로 생성된 후 검색을 위해 컬렉션을 로드합니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/load_collection_fec39171df.png" alt="Load the collection" class="doc-image" id="load-the-collection" />
   </span> <span class="img-wrapper"> <span>컬렉션 로드</span> </span></p>
<p>이제 <strong>개요</strong> 페이지에서 새로 생성된 컬렉션을 확인할 수 있습니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/check_collection_163b05477e.png" alt="Check the collection" class="doc-image" id="check-the-collection" />
   </span> <span class="img-wrapper"> <span>컬렉션 확인</span> </span></p>
<p>테스트 데이터 세트를 Milvus로 가져옵니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/import_data_1_f73d71be85.png" alt="Import data" class="doc-image" id="import-data" />
   </span> <span class="img-wrapper"> <span>데이터 가져오기</span> </span></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/import_data_2_4b3c3c3c25.png" alt="Import data" class="doc-image" id="import-data" />
   </span> <span class="img-wrapper"> <span>데이터 가져오기</span> </span></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/import_data_3_0def4e8550.png" alt="Import data" class="doc-image" id="import-data" />
   </span> <span class="img-wrapper"> <span>데이터 가져오기</span> </span></p>
<p>개요 또는 컬렉션 페이지에서 컬렉션 이름을 클릭하여 가져온 데이터를 확인할 수 있는 쿼리 인터페이스로 들어갑니다.</p>
<p>필터를 추가하고 <code translate="no">id != 0</code> 식을 지정한 후 <strong>필터 적용을</strong> 클릭하고 <strong>쿼리를</strong> 클릭합니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/query_data_24d9f71ccc.png" alt="Query data" class="doc-image" id="query-data" />
   </span> <span class="img-wrapper"> <span>데이터 쿼리</span> </span></p>
<p>50개 항목의 엔티티가 모두 성공적으로 가져온 것을 확인할 수 있습니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/query_result_bcbbd17084.png" alt="Query result" class="doc-image" id="query-result" />
   </span> <span class="img-wrapper"> <span>쿼리 결과</span> </span></p>
<p>벡터 유사도 검색을 해보겠습니다.</p>
<p><code translate="no">search_vectors.csv</code> 에서 벡터 하나를 복사하여 <strong>벡터 값</strong> 필드에 붙여넣습니다. 컬렉션과 필드를 선택합니다. <strong>검색을</strong> 클릭합니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/search_data_5af3a1db53.png" alt="Search data" class="doc-image" id="search-data" />
   </span> <span class="img-wrapper"> <span>데이터 검색</span> </span></p>
<p>그러면 검색 결과를 확인할 수 있습니다. 별도의 스크립트를 컴파일하지 않고도 Milvus로 쉽게 검색할 수 있습니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/search_result_961886efab.png" alt="Search result" class="doc-image" id="search-result" />
   </span> <span class="img-wrapper"> <span>검색 결과</span> </span></p>
<p>마지막으로 <strong>시스템 뷰</strong> 페이지를 확인해 보겠습니다.</p>
<p>Milvus Node.js SDK에 포함된 Metrics API를 통해 시스템 현황, 노드 관계, 노드 상태 등을 확인할 수 있습니다.</p>
<p>Attu의 독점 기능인 시스템 개요 페이지에는 전체 시스템 토폴로지 그래프가 포함되어 있습니다. 각 노드를 클릭하면 해당 노드의 상태를 확인할 수 있습니다(10초마다 새로고침).</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/topological_graph_d0c5c17586.png" alt="Milvus node topological graph" class="doc-image" id="milvus-node-topological-graph" />
   </span> <span class="img-wrapper"> <span>밀버스 노드 토폴로지 그래프</span> </span></p>
<p>각 노드를 클릭하면 <strong>노드 목록 보기로</strong> 들어갑니다. 좌표 노드의 모든 하위 노드를 확인할 수 있습니다. 정렬을 통해 CPU 또는 메모리 사용량이 높은 노드를 빠르게 식별하고 시스템의 문제점을 찾을 수 있습니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/node_list_64fc610a8d.png" alt="Milvus node list" class="doc-image" id="milvus-node-list" />
   </span> <span class="img-wrapper"> <span>밀버스 노드 목록</span> </span></p>
<h2 id="Whats-more" class="common-anchor-header">기타<button data-href="#Whats-more" class="anchor-icon" translate="no">
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
    </button></h2><p>앞서 언급했듯이, <strong>벡터 검색과</strong> <strong>시스템 보기</strong> 페이지는 Attu의 플러그인입니다. 사용자가 자신의 애플리케이션 시나리오에 맞게 Attu에서 직접 플러그인을 개발하는 것을 권장합니다. 소스 코드에는 플러그인 코드를 위해 특별히 제작된 폴더가 있습니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/plugins_a2d98e4e5b.png" alt="Plugins" class="doc-image" id="plugins" />
   </span> <span class="img-wrapper"> <span>플러그인</span> </span></p>
<p>플러그인을 참조하여 플러그인 빌드 방법을 배울 수 있습니다. 다음 설정 파일을 설정하면 Attu에 플러그인을 추가할 수 있습니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/add_plugins_e3ef53cc0d.png" alt="Add plugins to Attu" class="doc-image" id="add-plugins-to-attu" />
   </span> <span class="img-wrapper"> <span>Attu에 플러그인 추가하기</span> </span></p>
<p>자세한 지침은 <a href="https://github.com/zilliztech/attu/tree/main/doc">Attu GitHub 리</a> 포지토리 및 <a href="https://milvus.io/docs/v2.0.x/attu.md">Milvus 기술 문서를</a> 참조하세요.</p>
<p>Attu는 오픈 소스 프로젝트입니다. 모든 기여를 환영합니다. Attu에 문제가 있는 경우 <a href="https://github.com/zilliztech/attu/issues">이슈를 제출할</a> 수도 있습니다.</p>
<p>Attu가 Milvus를 통해 더 나은 사용자 경험을 제공할 수 있기를 진심으로 바랍니다. Attu가 마음에 드시거나 사용법에 대한 피드백이 있으시다면 Attu <a href="https://wenjuan.feishu.cn/m/cfm?t=suw4QnODU1ui-ok7r">사용자 설문조사를</a> 완료하여 더 나은 사용자 경험을 위해 Attu를 최적화하는 데 도움을 주세요.</p>
