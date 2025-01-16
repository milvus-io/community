---
id: building-an-intelligent-news-recommendation-system-inside-sohu-news-app.md
title: 시맨틱 벡터 검색을 사용한 콘텐츠 추천
author: milvus
date: 2021-06-08T01:42:53.489Z
desc: Milvus를 사용하여 앱 내에서 지능형 뉴스 추천 시스템을 구축한 방법을 알아보세요.
cover: assets.zilliz.com/blog_Sohu_News_dec53d0814.jpg
tag: Scenarios
canonicalUrl: >-
  https://zilliz.com/blog/building-an-intelligent-news-recommendation-system-inside-sohu-news-app
---
<custom-h1>소후 뉴스 앱에 지능형 뉴스 추천 시스템 구축하기</custom-h1><p><a href="https://www.socialmediatoday.com/news/new-research-shows-that-71-of-americans-now-get-news-content-via-social-pl/593255/">미국인의 71%가</a> 소셜 플랫폼에서 뉴스를 추천받는 만큼, 개인화된 콘텐츠는 새로운 미디어를 발견하는 방식으로 빠르게 자리 잡았습니다. 특정 주제를 검색하든 추천 콘텐츠와 상호 작용하든, 사용자가 보는 모든 콘텐츠는 알고리즘에 의해 최적화되어 클릭률(CTR), 참여도, 관련성을 향상시킵니다. 소후는 나스닥에 상장된 중국의 온라인 미디어, 비디오, 검색 및 게임 그룹입니다. 이 회사는 <a href="https://zilliz.com/">Zilliz가</a> 구축한 오픈 소스 벡터 데이터베이스인 <a href="https://milvus.io/">Milvus를</a> 활용하여 뉴스 앱 내에 시맨틱 벡터 검색 엔진을 구축했습니다. 이 문서에서는 이 회사가 사용자 프로필을 사용하여 시간이 지남에 따라 개인화된 콘텐츠 추천을 미세 조정하여 사용자 경험과 참여도를 개선한 방법을 설명합니다.</p>
<h2 id="Recommending-content-using-semantic-vector-search" class="common-anchor-header">시맨틱 벡터 검색을 사용한 콘텐츠 추천<button data-href="#Recommending-content-using-semantic-vector-search" class="anchor-icon" translate="no">
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
    </button></h2><p>Sohu 뉴스 사용자 프로필은 검색 기록을 기반으로 구축되며 사용자가 뉴스 콘텐츠를 검색하고 상호 작용함에 따라 조정됩니다. Sohu의 추천 시스템은 시맨틱 벡터 검색을 사용하여 관련성 높은 뉴스 기사를 찾아냅니다. 이 시스템은 검색 기록을 기반으로 각 사용자가 관심을 가질 것으로 예상되는 태그 세트를 식별하는 방식으로 작동합니다. 그런 다음 관련 기사를 빠르게 검색하고 인기도(평균 CTR로 측정)에 따라 결과를 정렬한 후 사용자에게 제공합니다.</p>
<p>뉴욕 타임즈만 해도 하루에 <a href="https://www.theatlantic.com/technology/archive/2016/05/how-many-stories-do-newspapers-publish-per-day/483845/">230개의 콘텐츠를</a> 게시하는데, 이는 효과적인 추천 시스템이 처리할 수 있어야 하는 새로운 콘텐츠의 양을 짐작할 수 있게 해줍니다. 대량의 뉴스를 수집하려면 밀리초 단위의 유사성 검색과 새로운 콘텐츠에 대한 시간별 태그 매칭이 필요합니다. 소후는 대규모 데이터 세트를 효율적이고 정확하게 처리하고, 검색 중 메모리 사용량을 줄이며, 고성능 배포를 지원하는 Milvus를 선택했습니다.</p>
<h2 id="Understanding-a-news-recommendation-system-workflow" class="common-anchor-header">뉴스 추천 시스템 워크플로 이해하기<button data-href="#Understanding-a-news-recommendation-system-workflow" class="anchor-icon" translate="no">
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
    </button></h2><p>Sohu의 시맨틱 벡터 검색 기반 콘텐츠 추천은 두 개의 신경망을 사용하여 사용자 검색어와 뉴스 기사를 벡터로 표현하는 심층 구조적 시맨틱 모델(DSSM)에 의존합니다. 이 모델은 두 시맨틱 벡터의 코사인 유사도를 계산한 다음 가장 유사한 뉴스 배치를 추천 후보 풀로 보냅니다. 그런 다음 예상 클릭률(CTR)을 기준으로 뉴스 기사의 순위가 매겨지고, 예상 클릭률이 가장 높은 뉴스 기사가 사용자에게 표시됩니다.</p>
<h3 id="Encoding-news-articles-into-semantic-vectors-with-BERT-as-service" class="common-anchor-header">BERT-as-a-service로 뉴스 기사를 시맨틱 벡터로 인코딩하기</h3><p>뉴스 기사를 시맨틱 벡터로 인코딩하기 위해 시스템은 <a href="https://github.com/hanxiao/bert-as-service.git">BERT-as-a-service</a> 도구를 사용합니다. 이 모델을 사용하는 동안 콘텐츠의 단어 수가 512개를 초과하면 임베딩 과정에서 정보 손실이 발생합니다. 이를 극복하기 위해 시스템은 먼저 요약을 추출하고 이를 768차원 시맨틱 벡터로 인코딩합니다. 그런 다음 각 뉴스 기사에서 가장 관련성이 높은 두 개의 토픽을 추출하고, 토픽 ID를 기반으로 사전 학습된 해당 토픽 벡터(200차원)를 식별합니다. 다음으로 토픽 벡터를 기사 요약에서 추출한 768차원 시맨틱 벡터에 연결하여 968차원의 시맨틱 벡터를 형성합니다.</p>
<p>새로운 콘텐츠는 Kafta를 통해 지속적으로 유입되며, 밀버스 데이터베이스에 삽입되기 전에 시맨틱 벡터로 변환됩니다.</p>
<h3 id="Extracting-semantically-similar-tags-from-user-profiles-with-BERT-as-service" class="common-anchor-header">서비스형 BERT로 사용자 프로필에서 의미적으로 유사한 태그 추출하기</h3><p>모델의 또 다른 신경망은 사용자 시맨틱 벡터입니다. 관심사, 검색어, 검색 기록을 기반으로 사용자 프로필에서 의미적으로 유사한 태그(예: 코로나 바이러스, 코로나, COVID-19, 팬데믹, 신종 코로나, 폐렴)를 추출합니다. 획득한 태그 목록은 가중치에 따라 정렬되며, 상위 200개는 서로 다른 의미론적 그룹으로 나뉩니다. 각 의미 그룹 내의 태그 순열은 새로운 태그 구문을 생성하는 데 사용되며, 이 태그 구문은 BERT-as-a-service를 통해 의미 벡터로 인코딩됩니다.</p>
<p>각 사용자 프로필에 대해 태그 구문 세트에는 사용자의 관심 수준을 나타내는 가중치로 표시된 <a href="https://github.com/baidu/Familia">해당 주제 세트가</a> 있습니다. 모든 관련 토픽 중 상위 2개의 토픽이 머신 러닝(ML) 모델에 의해 선택되고 인코딩되어 해당 태그 시맨틱 벡터에 접합되어 968차원의 사용자 시맨틱 벡터를 형성합니다. 시스템이 여러 사용자에 대해 동일한 태그를 생성하더라도 태그와 해당 토픽에 대한 가중치가 다르고 각 사용자의 토픽 벡터 간에 명시적인 차이가 있어 고유한 추천을 보장합니다.</p>
<p>시스템은 사용자 프로필과 뉴스 기사에서 추출한 시맨틱 벡터의 코사인 유사도를 계산하여 개인화된 뉴스 추천을 할 수 있습니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Sohu01_1e466fe0c3.jpg" alt="Sohu01.jpg" class="doc-image" id="sohu01.jpg" />
   </span> <span class="img-wrapper"> <span>Sohu01.jpg</span> </span></p>
<h3 id="Computing-new-semantic-user-profile-vectors-and-inserting-them-to-Milvus" class="common-anchor-header">새로운 시맨틱 사용자 프로필 벡터를 계산하여 Milvus에 삽입하기</h3><p>시맨틱 사용자 프로필 벡터는 매일 계산되며, 이전 24시간 동안의 데이터는 다음 날 저녁에 처리됩니다. 벡터는 Milvus에 개별적으로 삽입되고 쿼리 프로세스를 통해 사용자에게 관련성 있는 뉴스 결과를 제공하기 위해 실행됩니다. 뉴스 콘텐츠는 본질적으로 화제성이 높기 때문에 매시간 계산을 실행하여 예상 클릭률이 높고 사용자에게 관련성이 있는 콘텐츠를 포함하는 최신 뉴스 피드를 생성해야 합니다. 또한 뉴스 콘텐츠는 날짜별로 파티션으로 분류되며, 오래된 뉴스는 매일 제거됩니다.</p>
<h3 id="Decreasing-semantic-vector-extraction-time-from-days-to-hours" class="common-anchor-header">시맨틱 벡터 추출 시간을 며칠에서 몇 시간으로 단축</h3><p>시맨틱 벡터를 사용하여 콘텐츠를 검색하려면 매일 수천만 개의 태그 구문을 시맨틱 벡터로 변환해야 합니다. 이는 이러한 유형의 연산을 가속화하는 그래픽 처리 장치(GPU)에서 실행하더라도 완료하는 데 며칠이 걸릴 정도로 시간이 많이 걸리는 프로세스입니다. 이러한 기술적 문제를 극복하기 위해서는 유사한 태그 구문이 나타나면 해당 의미 벡터가 바로 검색되도록 이전 임베딩의 의미 벡터를 최적화해야 합니다.</p>
<p>기존 태그 구문 집합의 의미 벡터는 저장되며, 매일 생성되는 새로운 태그 구문 집합은 MinHash 벡터로 인코딩됩니다. <a href="https://milvus.io/docs/v1.1.1/metric.md">Jaccard 거리는</a> 새 태그 구문의 MinHash 벡터와 저장된 태그 구문 벡터 간의 유사성을 계산하는 데 사용됩니다. Jaccard 거리가 미리 정의된 임계값을 초과하면 두 세트가 유사한 것으로 간주됩니다. 유사성 임계값이 충족되면 새 문구는 이전 임베딩의 의미론적 정보를 활용할 수 있습니다. 테스트 결과, 0.8 이상의 거리는 대부분의 상황에서 충분한 정확도를 보장하는 것으로 나타났습니다.</p>
<p>이 프로세스를 통해 위에서 언급한 수천만 개의 벡터를 매일 변환하는 데 걸리는 시간이 며칠에서 약 2시간으로 단축됩니다. 특정 프로젝트 요구 사항에 따라 시맨틱 벡터를 저장하는 다른 방법이 더 적합할 수도 있지만, Milvus 데이터베이스에서 Jaccard 거리를 사용하여 두 태그 구문 간의 유사성을 계산하는 것은 다양한 시나리오에서 효율적이고 정확한 방법으로 남아 있습니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Sohu02_d50fccc538.jpg" alt="Sohu02.jpg" class="doc-image" id="sohu02.jpg" />
   </span> <span class="img-wrapper"> <span>Sohu02.jpg</span> </span></p>
<h2 id="Overcoming-bad-cases-of-short-text-classification" class="common-anchor-header">짧은 텍스트 분류의 '나쁜 경우' 극복하기<button data-href="#Overcoming-bad-cases-of-short-text-classification" class="anchor-icon" translate="no">
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
    </button></h2><p>뉴스 텍스트를 분류할 때, 짧은 뉴스 기사는 긴 기사에 비해 추출할 수 있는 특징이 적습니다. 이 때문에 다양한 길이의 콘텐츠가 동일한 분류기를 통해 실행될 때 분류 알고리즘이 실패합니다. Milvus는 유사한 의미와 신뢰할 수 있는 점수를 가진 여러 개의 긴 텍스트 분류 정보를 검색한 다음 투표 메커니즘을 사용해 짧은 텍스트 분류를 수정함으로써 이 문제를 해결하도록 도와줍니다.</p>
<h3 id="Identifying-and-resolving-misclassified-short-text" class="common-anchor-header">잘못 분류된 짧은 텍스트 식별 및 해결</h3><p>유용한 콘텐츠 추천을 제공하기 위해서는 각 뉴스 기사를 정확하게 분류하는 것이 중요합니다. 짧은 뉴스 기사는 특징이 적기 때문에 길이가 다른 뉴스에 동일한 분류기를 적용하면 짧은 텍스트 분류의 오류율이 높아집니다. 사람이 직접 라벨을 붙이는 것은 이 작업에 너무 느리고 부정확하기 때문에 BERT-as-a-service와 Milvus는 잘못 분류된 짧은 텍스트를 일괄적으로 빠르게 식별하고 올바르게 재분류한 다음 이 문제에 대한 훈련을 위한 코퍼스로 데이터 일괄을 사용하는 데 사용됩니다.</p>
<p>분류기 점수가 0.9 이상인 총 500만 개의 긴 뉴스 기사를 의미 벡터로 인코딩하는 데 BERT-as-a-service가 사용됩니다. 긴 텍스트 기사를 밀버스에 삽입한 후, 짧은 텍스트 뉴스를 시맨틱 벡터로 인코딩합니다. 각 짧은 뉴스 시맨틱 벡터는 Milvus 데이터베이스를 쿼리하여 대상 짧은 뉴스와 코사인 유사도가 가장 높은 상위 20개의 긴 뉴스 기사를 얻는 데 사용됩니다. 의미적으로 유사한 상위 20개의 긴 뉴스 중 18개가 동일한 분류에 속하고 쿼리한 짧은 뉴스의 분류와 다른 경우, 짧은 뉴스 분류는 잘못된 것으로 간주되며 18개의 긴 뉴스 기사와 일치하도록 조정해야 합니다.</p>
<p>이 프로세스를 통해 부정확한 짧은 텍스트 분류를 신속하게 식별하고 수정합니다. 무작위 샘플링 통계에 따르면 짧은 텍스트 분류가 수정된 후 텍스트 분류의 전체 정확도는 95%를 초과하는 것으로 나타났습니다. 신뢰도가 높은 긴 텍스트의 분류를 활용하여 짧은 텍스트의 분류를 수정함으로써 대부분의 잘못된 분류 사례를 단시간에 수정할 수 있습니다. 이는 또한 짧은 텍스트 분류기를 훈련하는 데 좋은 말뭉치를 제공합니다.</p>
<p>![Sohu03.jpg](https://assets.zilliz.com/Sohu03_a43074cf5f.jpg "짧은 텍스트 분류의 '불량 사례' 발견 흐름도.")</p>
<h2 id="Milvus-can-power-real-time-news-content-recommendation-and-more" class="common-anchor-header">실시간 뉴스 콘텐츠 추천 등을 지원하는 Milvus<button data-href="#Milvus-can-power-real-time-news-content-recommendation-and-more" class="anchor-icon" translate="no">
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
    </button></h2><p>밀버스는 소후의 뉴스 추천 시스템의 실시간 성능을 크게 향상시켰으며, 잘못 분류된 짧은 텍스트를 식별하는 효율성도 강화했습니다. Milvus와 다양한 애플리케이션에 대해 자세히 알아보고 싶으신가요?</p>
<ul>
<li><a href="https://zilliz.com/blog">블로그를</a> 읽어보세요.</li>
<li><a href="https://join.slack.com/t/milvusio/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ">Slack의</a> 오픈 소스 커뮤니티와 소통하세요.</li>
<li><a href="https://github.com/milvus-io/milvus/">GitHub에서</a> 세계에서 가장 인기 있는 벡터 데이터베이스를 사용하거나 기여하세요.</li>
<li>새로운 <a href="https://github.com/milvus-io/bootcamp">부트캠프를</a> 통해 AI 애플리케이션을 빠르게 테스트하고 배포하세요.</li>
</ul>
