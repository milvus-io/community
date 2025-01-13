---
id: 2022-01-20-story-of-smartnews.md
title: 스마트뉴스 이야기 - 밀버스 사용자에서 적극적인 기여자가 되기까지
author: Milvus
date: 2022-01-20T00:00:00.000Z
desc: Milvus 사용자이자 기고자인 스마트뉴스의 이야기를 알아보세요.
cover: assets.zilliz.com/Smartnews_user_to_contributor_f219e6e008.png
tag: Scenarios
---
<p>이 글은 <a href="https://www.linkedin.com/in/yiyun-n-2aa713163/">안젤라 니가</a> 번역했습니다.</p>
<p>정보는 우리 생활의 모든 곳에 존재합니다. 메타(이전의 페이스북), 인스타그램, 트위터 및 기타 소셜 미디어 플랫폼은 정보 스트림을 더욱 보편적으로 만듭니다. 따라서 이러한 정보 스트림을 처리하는 엔진은 대부분의 시스템 아키텍처에서 필수 요소가 되었습니다. 하지만 소셜 미디어 플랫폼과 관련 앱의 사용자라면 중복된 기사, 뉴스, 밈 등으로 인해 귀찮았던 경험이 있을 것입니다. 중복 콘텐츠에 노출되면 정보 검색 과정을 방해하고 사용자 경험에 좋지 않은 영향을 미칩니다.</p>
<p>정보 스트림을 다루는 제품의 경우, 개발자는 시스템 아키텍처에 원활하게 통합되어 동일한 뉴스나 광고를 중복 제거할 수 있는 유연한 데이터 프로세서를 찾는 것이 최우선 과제입니다.</p>
<p>기업 가치가 <a href="https://techcrunch.com/2021/09/15/news-aggregator-smartnews-raises-230-million-valuing-its-business-at-2-billion/">20억 달러에</a> 달하는<a href="https://www.smartnews.com/en/">SmartNews는</a> 미국에서 가장 기업 가치가 높은 뉴스 앱 회사입니다. 주목할 만한 점은 오픈소스 벡터 데이터베이스인 Milvus의 사용자였다가 이후 Milvus 프로젝트에 적극적으로 기여하는 기업으로 변모했다는 점입니다.</p>
<p>이 글에서는 SmartNews의 이야기를 공유하고 Milvus 프로젝트에 기여하기로 결정한 이유를 설명합니다.</p>
<h2 id="An-overview-of-SmartNews" class="common-anchor-header">SmartNews 개요<button data-href="#An-overview-of-SmartNews" class="anchor-icon" translate="no">
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
    </button></h2><p>2012년에 설립된 SmartNews는 일본 도쿄에 본사를 두고 있습니다. SmartNews가 개발한 뉴스 앱은 일본 시장에서 항상 <a href="https://www.businessinsider.com/guides/smartnews-free-news-app-2018-9">최고의 평가를</a> 받고 있습니다. 스마트뉴스는 <a href="https://about.smartnews.com/en/2019/06/12/smartnews-builds-global-momentum-with-over-500-us-growth-new-executives-and-three-new-offices/">가장 빠르게 성장하는</a> 뉴스 앱이며 미국 시장에서도 <a href="https://about.smartnews.com/en/2018/07/21/smartnews-reaches-more-than-10-million-monthly-active-users-in-the-united-states-and-japan/">높은 사용자 점유율을</a> 자랑합니다. <a href="https://www.appannie.com/en/">앱애니의</a> 통계에 따르면 스마트뉴스의 월평균 세션 지속 시간은 2021년 7월 말까지 전체 뉴스 앱 중 1위를 차지했으며, 이는 애플뉴스와 구글뉴스의 누적 세션 지속 시간보다 더 많은 수치입니다.</p>
<p>사용자 기반과 점도가 급격히 증가함에 따라 스마트뉴스는 추천 메커니즘과 AI 알고리즘 측면에서 더 많은 과제에 직면하게 되었습니다. 이러한 과제에는 대규모 머신러닝(ML)에서 대규모 불연속 피처 활용, 벡터 유사성 검색을 통한 비정형 데이터 쿼리 가속화 등이 포함됩니다.</p>
<p>2021년 초, 스마트뉴스의 다이내믹 광고 알고리즘 팀은 광고 리콜 및 쿼리 기능을 최적화해야 한다는 요청을 AI 인프라 팀에 보냈습니다. 두 달간의 연구 끝에 AI 인프라 엔지니어 슈는 여러 인덱스와 유사성 메트릭, 온라인 데이터 업데이트를 지원하는 오픈 소스 벡터 데이터베이스인 Milvus를 사용하기로 결정했습니다. Milvus는 전 세계 1,000개 이상의 조직에서 신뢰하고 있습니다.</p>
<h2 id="Advertisement-recommendation-powered-by-vector-similarity-search" class="common-anchor-header">벡터 유사도 검색을 통한 광고 추천<button data-href="#Advertisement-recommendation-powered-by-vector-similarity-search" class="anchor-icon" translate="no">
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
    </button></h2><p>오픈 소스 벡터 데이터베이스인 Milvus는 스마트뉴스 광고 시스템에 채택되어 천만 개 규모의 데이터 세트에서 사용자에게 동적 광고를 매칭하고 추천합니다. 이를 통해 스마트뉴스는 이전에는 매칭할 수 없었던 두 데이터 세트, 즉 사용자 데이터와 광고 데이터 간에 매핑 관계를 생성할 수 있습니다. 2021년 2분기에 Shu는 Kubernetes에 Milvus 1.0을 배포했습니다. <a href="https://milvus.io/docs">Milvus를 배포하는</a> 방법에 대해 자세히 알아보세요.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/image1_2a88ed162f.png" alt="img" class="doc-image" id="img" />
   </span> <span class="img-wrapper"> <span>img</span> </span></p>
<p>Milvus 1.0을 성공적으로 배포한 후, Milvus를 사용한 첫 번째 프로젝트는 스마트뉴스의 광고팀에서 시작한 광고 리콜 프로젝트였습니다. 초기 단계에서 광고 데이터 세트는 백만 개 규모였습니다. 한편, P99 지연 시간은 10밀리초 이내로 엄격하게 제어되었습니다.</p>
<p>2021년 6월, 슈와 알고리즘 팀의 동료들은 더 많은 비즈니스 시나리오에 Milvus를 적용하고 데이터 집계와 온라인 데이터/인덱스 업데이트를 실시간으로 시도했습니다.</p>
<p>현재 오픈소스 벡터 데이터베이스인 Milvus는 광고 추천을 비롯한 스마트뉴스의 다양한 비즈니스 시나리오에 사용되고 있습니다.</p>
<h2 id="From-a-user-to-an-active-contributor" class="common-anchor-header"><strong>사용자에서 적극적인 기여자로</strong><button data-href="#From-a-user-to-an-active-contributor" class="anchor-icon" translate="no">
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
    </button></h2><p>밀버스를 스마트뉴스 제품 아키텍처에 통합하는 과정에서 슈를 비롯한 개발자들은 핫 리로드, 아이템 TTL(타임투라이프), 아이템 업데이트/교체 등의 기능에 대한 요청을 하게 되었습니다. 이러한 기능들은 밀버스 커뮤니티의 많은 사용자들이 원하는 기능이기도 합니다. 그래서 스마트뉴스의 AI 인프라 팀장인 데니스 자오는 핫 리로드 기능을 개발하여 커뮤니티에 기여하기로 결정했습니다. Dennis는 "스마트뉴스 팀도 Milvus 커뮤니티의 혜택을 받고 있기 때문에 커뮤니티와 공유할 것이 있다면 기꺼이 기여할 의향이 있습니다."라고 말했습니다.</p>
<p>데이터 다시 로드는 코드를 실행하는 동안 코드 편집을 지원합니다. 데이터 다시 로드의 도움으로 개발자는 더 이상 중단점에서 멈추거나 애플리케이션을 다시 시작할 필요가 없습니다. 대신 코드를 직접 편집하고 실시간으로 결과를 확인할 수 있습니다.</p>
<p>7월 말, 스마트뉴스의 유섭 엔지니어는 핫 리로드를 위해 <a href="https://milvus.io/docs/v2.0.x/collection_alias.md#Collection-Alias">컬렉션 별칭을</a> 사용하는 아이디어를 제안했습니다.</p>
<p>컬렉션 별칭을 만든다는 것은 컬렉션의 별칭 이름을 지정하는 것을 말합니다. 컬렉션에는 여러 개의 별칭을 가질 수 있습니다. 그러나 별칭은 최대 하나의 컬렉션에 해당합니다. 컬렉션과 락커를 비유하면 간단합니다. 사물함에는 컬렉션과 마찬가지로 고유 번호와 위치가 있으며, 이는 항상 변경되지 않습니다. 하지만 사물함에서 언제든지 다른 물건을 넣고 꺼낼 수 있습니다. 마찬가지로 컬렉션의 이름은 고정되어 있지만 컬렉션의 데이터는 동적입니다. Milvus <a href="https://milvus.io/docs/v2.0.x/release_notes.md#v200-PreGA">pre-GA 버전에서는</a> 데이터 삭제가 지원되므로 언제든지 컬렉션에 벡터를 삽입하거나 삭제할 수 있습니다.</p>
<p>스마트뉴스 광고 비즈니스의 경우, 새로운 동적 광고 벡터가 생성될 때마다 약 1억 개의 벡터가 삽입되거나 업데이트됩니다. 이에 대한 해결책은 몇 가지가 있습니다:</p>
<ul>
<li>해결 방법 1: 오래된 데이터를 먼저 삭제하고 새로운 데이터를 삽입합니다.</li>
<li>해결 방법 2: 새 데이터를 위한 새 컬렉션을 생성합니다.</li>
<li>해결 방법 3: 컬렉션 별칭 사용.</li>
</ul>
<p>해결 방법 1의 경우, 가장 직접적인 단점 중 하나는 특히 업데이트할 데이터 집합이 엄청나게 많은 경우 시간이 많이 걸린다는 것입니다. 일반적으로 1억 개 규모의 데이터 집합을 업데이트하는 데 몇 시간이 걸립니다.</p>
<p>해결 방법 2의 경우, 새 컬렉션을 즉시 검색에 사용할 수 없다는 문제가 있습니다. 즉, 로드 중에는 컬렉션을 검색할 수 없습니다. 또한 Milvus는 두 컬렉션이 동일한 컬렉션 이름을 사용하는 것을 허용하지 않습니다. 새 컬렉션으로 전환하려면 항상 사용자가 클라이언트 측 코드를 수동으로 수정해야 합니다. 즉, 사용자는 컬렉션 간에 전환해야 할 때마다 <code translate="no">collection_name</code> 매개변수의 값을 수정해야 합니다.</p>
<p>솔루션 3이 가장 좋은 해결책입니다. 새 컬렉션에 새 데이터를 삽입하고 컬렉션 별칭을 사용하기만 하면 됩니다. 이렇게 하면 컬렉션을 전환하여 검색을 수행해야 할 때마다 컬렉션 별칭만 바꾸면 됩니다. 코드를 수정하는 데 별도의 노력이 필요하지 않습니다. 이 솔루션은 앞의 두 가지 솔루션에서 언급된 문제를 해결해 줍니다.</p>
<p>유섭은 이 요청에서 시작하여 스마트뉴스 팀 전체가 Milvus 아키텍처를 이해하는 데 도움을 주었습니다. 한 달 반 후, Milvus 프로젝트는 Yusup으로부터 핫 리로드에 대한 홍보를 받았습니다. 그리고 이 기능은 Milvus 2.0.0-RC7 출시와 함께 정식으로 제공되었습니다.</p>
<p>현재 AI 인프라 팀이 주축이 되어 Milvus 2.0을 배포하고 모든 데이터를 Milvus 1.0에서 2.0으로 점진적으로 마이그레이션하고 있습니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/image2_96c064a627.png" alt="img_collection alias" class="doc-image" id="img_collection-alias" />
   </span> <span class="img-wrapper"> <span>img_collection 별칭</span> </span></p>
<p>수집 별칭 지원은 특히 사용자 요청이 많은 대규모 인터넷 기업의 경우 사용자 경험을 크게 향상시킬 수 있습니다. Milvus와 Smartnews 간의 연결 고리를 구축하는 데 도움을 준 Milvus 커뮤니티의 데이터 엔지니어인 Chenglong Li는 "수집 별칭 기능은 Milvus 사용자인 SmartNews의 실제 비즈니스 요청에서 비롯된 것입니다. 그리고 스마트뉴스는 해당 코드를 밀버스 커뮤니티에 기여했습니다. 이러한 호혜적 행위는 커뮤니티에 의한, 커뮤니티를 위한 오픈소스 정신의 좋은 예입니다. 앞으로도 스마트뉴스와 같은 기여자들이 더 많이 참여하여 더욱 번영하는 Milvus 커뮤니티를 함께 구축해 나가기를 바랍니다."</p>
<p>"현재 일부 광고 업계에서 오프라인 벡터 데이터베이스로 밀버스를 채택하고 있습니다. 밀버스 2.0의 정식 출시가 다가오고 있으며, 밀버스를 통해 보다 안정적인 시스템을 구축하고 더 많은 비즈니스 시나리오에 실시간 서비스를 제공할 수 있기를 바랍니다." 라고 말했습니다.</p>
<blockquote>
<p>업데이트: Milvus 2.0이 정식 출시되었습니다! <a href="/blog/ko/2022-1-25-annoucing-general-availability-of-milvus-2-0.md">자세히 알아보기</a></p>
</blockquote>
