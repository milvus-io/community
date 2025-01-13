---
id: intelligent-wardrobe-customization-system.md
title: 밀버스 벡터 데이터베이스로 구동되는 지능형 옷장 맞춤화 시스템 구축
author: Yiyun Ni
date: 2022-07-08T00:00:00.000Z
desc: 유사도 검색 기술을 사용하여 옷장과 그 구성 요소와 같은 비정형 데이터의 잠재력을 활용하세요!
cover: assets.zilliz.com/Frame_1282_edc1fb7d99.png
tag: Engineering
tags: >-
  Data science, Database, Use Cases of Milvus, Artificial Intelligence, Vector
  Management
canonicalUrl: 'https://milvus.io/blog/intelligent-wardrobe-customization-system.md'
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Frame_1282_edc1fb7d99.png" alt="cover image" class="doc-image" id="cover-image" />
   </span> <span class="img-wrapper"> <span>표지 이미지</span> </span></p>
<p>침실이나 탈의실에 딱 맞는 옷장을 찾고 있다면 대부분의 사람들이 맞춤 제작을 떠올릴 것입니다. 하지만 모든 사람의 예산이 그렇게까지 확장될 수 있는 것은 아닙니다. 그렇다면 기성품은 어떨까요? 이러한 유형의 옷장의 문제점은 고유한 수납 요구 사항을 충족할 만큼 유연하지 않기 때문에 기대에 미치지 못할 가능성이 매우 높다는 것입니다. 또한 온라인에서 검색할 때 원하는 특정 유형의 옷장을 키워드로 요약하기가 다소 어렵습니다. 검색창에 입력한 키워드(예: 주얼리 트레이가 있는 옷장)와 검색 엔진에 정의된 키워드(예: <a href="https://www.ikea.com/us/en/p/komplement-pull-out-tray-with-insert-black-brown-s79249366/">인서트가 있는 풀아웃 트레이가</a> 있는 옷장)가 매우 다를 수 있습니다.</p>
<p>하지만 새로운 기술 덕분에 해결책이 있습니다! 가구 소매 대기업인 IKEA는 사용자가 다양한 기성품 옷장 중에서 선택하고 옷장의 색상, 크기, 인테리어 디자인을 맞춤 설정할 수 있는 인기 있는 디자인 도구인 <a href="https://www.ikea.com/us/en/rooms/bedroom/how-to/how-to-design-your-perfect-pax-wardrobe-pub8b76dda0">PAX 옷장을</a> 제공합니다. 행잉 공간, 여러 개의 선반 또는 내부 서랍이 필요한지 여부에 관계없이 이 지능형 옷장 맞춤화 시스템은 언제나 사용자의 요구를 충족시킬 수 있습니다.</p>
<p>이 스마트 옷장 디자인 시스템을 사용하여 이상적인 옷장을 찾거나 만들려면 다음과 같이 하세요:</p>
<ol>
<li>옷장의 모양(일반, L자형 또는 U자형), 길이, 깊이 등 기본 요구사항을 지정합니다.</li>
<li>필요한 수납 공간과 옷장 내부 구성을 지정합니다(예: 걸이 공간, 풀아웃 바지 걸이 등 필요).</li>
<li>서랍이나 선반과 같은 옷장의 일부를 추가하거나 제거합니다.</li>
</ol>
<p>그러면 디자인이 완성됩니다. 간단하고 쉽습니다!</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Pax_system_ff4c3fa182.png" alt="pax system" class="doc-image" id="pax-system" />
   </span> <span class="img-wrapper"> <span>팍스 시스템</span> </span></p>
<p>이러한 옷장 디자인 시스템을 가능하게 하는 매우 중요한 구성 요소는 <a href="https://zilliz.com/learn/what-is-vector-database">벡터 데이터베이스입니다</a>. 따라서 이 글에서는 벡터 유사도 검색을 기반으로 하는 지능형 옷장 맞춤화 시스템을 구축하는 데 사용되는 워크플로와 유사도 검색 솔루션을 소개하고자 합니다.</p>
<p>이동하기:</p>
<ul>
<li><a href="#System-overview">시스템 개요</a></li>
<li><a href="#Data-flow">데이터 흐름</a></li>
<li><a href="#System-demo">시스템 데모</a></li>
</ul>
<h2 id="System-Overview" class="common-anchor-header">시스템 개요<button data-href="#System-Overview" class="anchor-icon" translate="no">
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
    </button></h2><p>이러한 스마트 옷장 맞춤화 도구를 제공하려면 먼저 비즈니스 로직을 정의하고 품목 속성과 사용자 여정을 이해해야 합니다. 옷장은 서랍, 트레이, 선반과 같은 구성 요소와 함께 모두 비정형 데이터입니다. 따라서 두 번째 단계는 AI 알고리즘과 규칙, 사전 지식, 품목 설명 등을 활용하여 이러한 비정형 데이터를 컴퓨터가 이해할 수 있는 데이터 유형인 벡터로 변환하는 것입니다!</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Customization_tool_overview_86d62e1730.png" alt="Customization tool overview" class="doc-image" id="customization-tool-overview" />
   </span> <span class="img-wrapper"> <span>사용자 지정 도구 개요</span> </span></p>
<p>생성된 벡터를 처리하기 위해서는 강력한 벡터 데이터베이스와 검색 엔진이 필요합니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/tool_architecutre_33fb646954.png" alt="tool architecture" class="doc-image" id="tool-architecture" />
   </span> <span class="img-wrapper"> <span>도구 아키텍처</span> </span></p>
<p>사용자 정의 도구는 가장 인기 있는 검색 엔진과 데이터베이스를 활용합니다: Elasticsearch, <a href="https://milvus.io/">Milvus</a>, PostgreSQL입니다.</p>
<h3 id="Why-Milvus" class="common-anchor-header">왜 Milvus인가?</h3><p>옷장 구성 요소에는 색상, 모양, 내부 구성 등과 같은 매우 복잡한 정보가 포함되어 있습니다. 그러나 옷장 데이터를 관계형 데이터베이스에 보관하는 기존의 방식으로는 충분하지 않습니다. 널리 사용되는 방법은 임베딩 기술을 사용하여 옷장을 벡터로 변환하는 것입니다. 따라서 벡터 저장과 유사도 검색을 위해 특별히 설계된 새로운 유형의 데이터베이스를 찾아야 합니다. 여러 인기 있는 솔루션을 조사한 결과, 뛰어난 성능과 안정성, 호환성, 사용 편의성을 갖춘 <a href="https://github.com/milvus-io/milvus">Milvus</a> 벡터 데이터베이스가 선택되었습니다. 아래 차트는 여러 인기 있는 벡터 검색 솔루션을 비교한 것입니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Solution_comparison_d96b8f1dd5.png" alt="solution comparison" class="doc-image" id="solution-comparison" />
   </span> <span class="img-wrapper"> <span>솔루션 비교</span> </span></p>
<h3 id="System-workflow" class="common-anchor-header">시스템 워크플로</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/System_workflow_250c275ec1.png" alt="System workflow" class="doc-image" id="system-workflow" />
   </span> <span class="img-wrapper"> <span>시스템 워크플로우</span> </span></p>
<p>옷장 크기, 색상 등을 기준으로 대략적인 필터링을 위해 Elasticsearch를 사용합니다. 그런 다음 필터링된 결과는 유사성 검색을 위해 벡터 데이터베이스인 Milvus를 통과하고 쿼리 벡터와의 거리/유사성에 따라 결과가 순위가 매겨집니다. 마지막으로 비즈니스 인사이트를 기반으로 결과를 통합하고 더욱 세분화합니다.</p>
<h2 id="Data-flow" class="common-anchor-header">데이터 흐름<button data-href="#Data-flow" class="anchor-icon" translate="no">
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
    </button></h2><p>옷장 사용자 지정 시스템은 기존 검색 엔진 및 추천 시스템과 매우 유사합니다. 세 부분으로 구성되어 있습니다:</p>
<ul>
<li>데이터 정의 및 생성을 포함한 오프라인 데이터 준비.</li>
<li>리콜 및 랭킹을 포함한 온라인 서비스.</li>
<li>비즈니스 로직에 기반한 데이터 후처리.</li>
</ul>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/data_flow_d0d9fa0fca.png" alt="Data flow" class="doc-image" id="data-flow" />
   </span> <span class="img-wrapper"> <span>데이터 흐름</span> </span></p>
<h3 id="Offline-data-flow" class="common-anchor-header">오프라인 데이터 흐름</h3><ol>
<li>비즈니스 인사이트를 사용하여 데이터를 정의합니다.</li>
<li>사전 지식을 사용하여 다양한 구성 요소를 결합하여 옷장으로 구성하는 방법을 정의합니다.</li>
<li>옷장의 기능 레이블을 인식하고 해당 기능을 <code translate="no">.json</code> 파일에 있는 Elasticsearch 데이터로 인코딩합니다.</li>
<li>비정형 데이터를 벡터로 인코딩하여 리콜 데이터를 준비합니다.</li>
<li>밀버스 벡터 데이터베이스를 사용해 이전 단계에서 얻은 리콜 결과의 순위를 매깁니다.</li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/offline_data_flow_f91ac9cf4c.png" alt="offline data flow" class="doc-image" id="offline-data-flow" />
   </span> <span class="img-wrapper"> <span>오프라인 데이터 흐름</span> </span></p>
<h3 id="Online-data-flow" class="common-anchor-header">온라인 데이터 흐름</h3><ol>
<li>사용자로부터 쿼리 요청을 받고 사용자 프로필을 수집합니다.</li>
<li>옷장에 대한 요구 사항을 파악하여 사용자 쿼리를 이해합니다.</li>
<li>Elasticsearch를 사용해 대략적인 검색을 수행합니다.</li>
<li>밀버스에서 벡터 유사도 계산을 기반으로 거친 검색에서 얻은 결과에 점수를 매기고 순위를 매깁니다.</li>
<li>백엔드 플랫폼에서 결과를 후처리하고 정리하여 최종 결과를 생성합니다.</li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/online_data_flow_1f2af25cc3.png" alt="online data flow" class="doc-image" id="online-data-flow" />
   </span> <span class="img-wrapper"> <span>온라인 데이터 흐름</span> </span></p>
<h3 id="Data-post-processing" class="common-anchor-header">데이터 후처리</h3><p>비즈니스 로직은 회사마다 다릅니다. 귀사의 비즈니스 로직을 적용하여 결과에 최종적인 손질을 더할 수 있습니다.</p>
<h2 id="System-demo" class="common-anchor-header">시스템 데모<button data-href="#System-demo" class="anchor-icon" translate="no">
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
    </button></h2><p>이제 우리가 구축한 시스템이 실제로 어떻게 작동하는지 살펴봅시다.</p>
<p>사용자 인터페이스(UI)는 옷장 구성 요소의 다양한 조합 가능성을 표시합니다.</p>
<p>각 구성 요소는 기능(크기, 색상 등)에 따라 레이블이 지정되고 Elasticsearch(ES)에 저장됩니다. ES에 라벨을 저장할 때는 네 가지 주요 데이터 필드를 입력해야 합니다: ID, 태그, 저장 경로 및 기타 지원 필드입니다. ES와 레이블이 지정된 데이터는 세분화된 리콜 및 속성 필터링에 사용됩니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/es_d5b0639610.png" alt="es" class="doc-image" id="es" />
   </span> <span class="img-wrapper"> <span>es</span> </span></p>
<p>그런 다음 다양한 AI 알고리즘을 사용하여 옷장을 벡터 집합으로 인코딩합니다. 벡터 세트는 유사성 검색 및 순위를 매기기 위해 Milvus에 저장됩니다. 이 단계는 보다 정교하고 정확한 결과를 반환합니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Milvus_38dd93a439.jpeg" alt="Milvus" class="doc-image" id="milvus" />
   </span> <span class="img-wrapper"> <span>Milvus</span> </span></p>
<p>Elasticsearch, Milvus 및 기타 시스템 구성 요소는 전체적으로 사용자 정의 디자인 플랫폼을 형성합니다. 리콜 중에 Elasticsearch와 Milvus의 도메인별 언어(DSL)는 다음과 같습니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/dsl_df60097d23.png" alt="dsl" class="doc-image" id="dsl" />
   </span> <span class="img-wrapper"> <span>dsl</span> </span></p>
<h2 id="Looking-for-more-resources" class="common-anchor-header">더 많은 리소스를 찾고 계신가요?<button data-href="#Looking-for-more-resources" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 벡터 데이터베이스가 어떻게 더 많은 AI 애플리케이션을 강화할 수 있는지 알아보세요:</p>
<ul>
<li><a href="https://milvus.io/blog/2022-06-23-How-Short-video-Platform-Likee-Removes-Duplicate-Videos-with-Milvus.md">짧은 동영상 플랫폼 Likee가 Milvus로 중복 동영상을 제거하는 방법</a></li>
<li><a href="https://milvus.io/blog/2022-06-20-Zhentu-the-Photo-Fraud-Detector-Based-on-Milvus.md">Zhentu - Milvus 기반의 사진 사기 탐지기</a></li>
</ul>
