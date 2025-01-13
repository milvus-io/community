---
id: building-personalized-recommender-systems-milvus-paddlepaddle.md
title: 배경 소개
author: Shiyu Chen
date: 2021-02-24T23:12:34.209Z
desc: 딥러닝 기반 추천 시스템을 구축하는 방법
cover: assets.zilliz.com/header_e6c4a8aee6.jpg
tag: Scenarios
canonicalUrl: >-
  https://zilliz.com/blog/building-personalized-recommender-systems-milvus-paddlepaddle
---
<custom-h1>밀버스와 패들패들로 개인화된 추천 시스템 구축하기</custom-h1><h2 id="Background-Introduction" class="common-anchor-header">배경 소개<button data-href="#Background-Introduction" class="anchor-icon" translate="no">
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
    </button></h2><p>네트워크 기술의 지속적인 발전과 이커머스의 규모 확대로 상품의 수와 종류가 급격히 증가하면서 사용자는 구매하고자 하는 상품을 찾기 위해 많은 시간을 투자해야 합니다. 이것이 바로 정보 과부하입니다. 이 문제를 해결하기 위해 추천 시스템이 등장했습니다.</p>
<p>추천 시스템은 정보 필터링 시스템의 하위 집합으로 영화, 음악, 이커머스, 피드 스트림 추천 등 다양한 영역에서 사용할 수 있습니다. 추천 시스템은 사용자 행동을 분석하고 마이닝하여 사용자의 개인화된 요구와 관심사를 발견하고 사용자가 관심을 가질 만한 정보나 제품을 추천합니다. 추천 시스템은 검색 엔진과 달리 사용자가 자신의 니즈를 정확하게 설명하지 않아도 사용자의 과거 행동을 모델링하여 사용자의 관심사와 니즈에 맞는 정보를 능동적으로 제공합니다.</p>
<p>이 글에서는 바이두의 딥러닝 플랫폼인 패들패들을 사용하여 모델을 구축하고 벡터 유사도 검색 엔진인 밀버스를 결합하여 사용자에게 흥미로운 정보를 빠르고 정확하게 제공할 수 있는 개인화 추천 시스템을 구축합니다.</p>
<h2 id="Data-Preparation" class="common-anchor-header">데이터 준비<button data-href="#Data-Preparation" class="anchor-icon" translate="no">
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
    </button></h2><p>무비렌즈 밀리언 데이터셋(ml-1m)[1]을 예로 들어보겠습니다. ml-1m 데이터 세트에는 6,000명의 사용자가 4,000개의 영화에 대해 작성한 1,000,000개의 리뷰가 포함되어 있으며, GroupLens 연구소에서 수집한 것입니다. 원본 데이터에는 영화의 특징 데이터, 사용자 특징, 사용자 평점이 포함되어 있으며, ml-1m-README [2]를 참조할 수 있습니다.</p>
<p>ml-1m 데이터 세트에는 3개의 .dat 파일이 포함되어 있습니다: movies.dat, users.dat 및 ratings.dat.movies.dat에는 영화의 특징이 포함되어 있습니다(아래 예시 참조):</p>
<pre><code translate="no">MovieID::Title::Genres
1::ToyStory(1995)::Animation|Children's|Comedy
</code></pre>
<p>즉, 영화 ID는 1이고 제목은 《토이 스토리》이며 세 가지 카테고리로 나뉩니다. 이 세 가지 카테고리는 애니메이션, 어린이, 코미디입니다.</p>
<p>users.dat에는 사용자의 기능이 포함되어 있습니다(아래 예시 참조):</p>
<pre><code translate="no">UserID::Gender::Age::Occupation::Zip-code
1::F::1::10::48067
</code></pre>
<p>즉, 사용자 ID는 1, 여성, 18세 미만입니다. 직업 ID는 10입니다.</p>
<p>ratings.dat에는 영화 등급 기능이 포함되어 있습니다(아래 예 참조):</p>
<p>UserID::MovieID::Rating::Timestamp 1::1193::5::978300760</p>
<p>즉, 사용자 1은 영화 1193을 5점으로 평가합니다.</p>
<h2 id="Fusion-Recommendation-Model" class="common-anchor-header">퓨전 추천 모델<button data-href="#Fusion-Recommendation-Model" class="anchor-icon" translate="no">
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
    </button></h2><p>영화 개인화 추천 시스템에서는 패들패들이 구현한 퓨전 추천 모델[3]을 사용했습니다. 이 모델은 업계 실무를 바탕으로 만들어졌습니다.</p>
<p>먼저 사용자 특징과 영화 특징을 신경망에 입력으로 사용합니다:</p>
<ul>
<li>사용자 특징에는 사용자 ID, 성별, 직업, 나이의 네 가지 속성 정보가 포함됩니다.</li>
<li>영화 피처에는 영화 ID, 영화 유형 ID, 영화 이름의 세 가지 속성 정보가 포함됩니다.</li>
</ul>
<p>사용자 피처의 경우 사용자 ID를 차원 크기가 256인 벡터 표현에 매핑하고 완전히 연결된 계층을 입력한 다음 다른 세 가지 속성에 대해 유사한 처리를 수행합니다. 그런 다음 네 가지 속성의 특징 표현이 완전히 연결되고 개별적으로 추가됩니다.</p>
<p>동영상 특징의 경우, 동영상 ID는 사용자 ID와 유사한 방식으로 처리됩니다. 영화 유형 ID는 벡터 형태로 완전 연결된 계층에 직접 입력되며, 영화 이름은 텍스트 합성곱 신경망을 사용하여 고정 길이 벡터로 표현됩니다. 그런 다음 세 가지 속성의 특징 표현을 완전히 연결하고 개별적으로 추가합니다.</p>
<p>사용자와 영화의 벡터 표현을 구한 후, 이들의 코사인 유사도를 개인화 추천 시스템의 점수로 계산합니다. 마지막으로 유사도 점수와 사용자의 실제 점수 사이의 차이의 제곱을 회귀 모델의 손실 함수로 사용합니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_user_film_personalized_recommender_Milvus_9ec39f501d.jpg" alt="1-user-film-personalized-recommender-Milvus.jpg" class="doc-image" id="1-user-film-personalized-recommender-milvus.jpg" />
   </span> <span class="img-wrapper"> <span>1-유저-영화-개인화-추천-밀버스.jpg</span> </span></p>
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
    </button></h2><p>패들패들의 융합 추천 모델과 결합하여 모델에서 생성된 영화 특징 벡터를 밀버스 벡터 유사도 검색 엔진에 저장하고, 사용자 특징을 검색 대상 벡터로 사용합니다. 밀버스에서 유사도 검색을 수행하여 사용자에게 추천할 영화로 쿼리 결과를 얻습니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_system_overview_5652afdca7.jpg" alt="2-system-overview.jpg" class="doc-image" id="2-system-overview.jpg" />
   </span> <span class="img-wrapper"> <span>2-system-overview.jpg</span> </span></p>
<blockquote>
<p>밀버스에서는 벡터 거리 계산을 위해 내적 곱(IP) 방식을 제공합니다. 데이터를 정규화한 후 내적 곱 유사도는 융합 추천 모델에서 코사인 유사도 결과와 일치하도록 합니다.</p>
</blockquote>
<h2 id="Application-of-Personal-Recommender-System" class="common-anchor-header">개인 추천 시스템 적용<button data-href="#Application-of-Personal-Recommender-System" class="anchor-icon" translate="no">
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
    </button></h2><p>밀버스로 개인화 추천 시스템을 구축하는 과정은 총 3단계로 진행되며, 자세한 운영 방법은 밀버스 부트캠프 [4]를 참고하시기 바랍니다.</p>
<h3 id="Step-1Model-Training" class="common-anchor-header">1단계: 모델 학습</h3><pre><code translate="no"># run train.py
    $ python train.py
</code></pre>
<p>이 명령을 실행하면 영화 데이터와 사용자 데이터를 특징 벡터로 변환하고 Milvus가 저장 및 검색할 수 있는 애플리케이션 데이터를 생성할 수 있는 모델인 추천자_system.inference.model이 디렉토리에 생성됩니다.</p>
<h3 id="Step-2Data-Preprocessing" class="common-anchor-header">2단계: 데이터 전처리</h3><pre><code translate="no"># Data preprocessing, -f followed by the parameter raw movie data file name
    $ python get_movies_data.py -f movies_origin.txt
</code></pre>
<p>이 명령을 실행하면 동영상 데이터의 전처리를 위해 디렉토리에 테스트 데이터 movies_data.txt가 생성됩니다.</p>
<h3 id="Step-3Implementing-Personal-Recommender-System-with-Milvus" class="common-anchor-header">3단계：밀버스로 개인 추천 시스템 구현하기</h3><pre><code translate="no"># Implementing personal recommender system based on user conditions
    $ python infer_milvus.py -a &lt;age&gt;-g &lt;gender&gt;-j &lt;job&gt;[-i]
</code></pre>
<p>이 명령을 실행하면 지정된 사용자에 대한 개인화 추천을 구현합니다.</p>
<p>주요 과정은 다음과 같습니다:</p>
<ul>
<li>load_inference_model을 통해 영화 데이터를 모델에 의해 처리하여 영화 특징 벡터를 생성합니다.</li>
<li>밀버스 삽입을 통해 동영상 특징 벡터를 밀버스에 로드합니다.</li>
<li>파라미터로 지정된 사용자의 나이/성별/직업에 따라 사용자 특징 벡터로 변환하고, 유사도 검색에 milvus.search_vectors를 사용하여 사용자와 영화 간의 유사도가 가장 높은 결과를 반환합니다.</li>
</ul>
<p>사용자가 관심 있는 상위 5개 영화를 예측합니다:</p>
<pre><code translate="no">TopIdsTitleScore
03030Yojimbo2.9444923996925354
13871Shane2.8583481907844543
23467Hud2.849525213241577
31809Hana-bi2.826111316680908
43184Montana2.8119677305221558 
</code></pre>
<h2 id="Summary" class="common-anchor-header">요약<button data-href="#Summary" class="anchor-icon" translate="no">
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
    </button></h2><p>융합 추천 모델에 사용자 정보와 영화 정보를 입력하면 일치하는 점수를 구한 다음, 사용자를 기준으로 모든 영화의 점수를 정렬하여 사용자가 관심을 가질 만한 영화를 추천할 수 있습니다. <strong>이 글에서는 Milvus와 PaddlePaddle을 결합하여 개인화 추천 시스템을 구축하는 방법을 소개합니다. 벡터 검색 엔진인 Milvus를 사용하여 모든 영화 특징 데이터를 저장한 다음, Milvus에서 사용자 특징에 대한 유사도 검색을 수행합니다.</strong> 검색 결과는 시스템이 사용자에게 추천하는 영화 순위입니다.</p>
<p>밀버스[5] 벡터 유사도 검색 엔진은 다양한 딥러닝 플랫폼과 호환되며, 수십억 개의 벡터를 단 밀리초의 응답으로 검색할 수 있습니다. Milvus를 통해 더 많은 AI 애플리케이션의 가능성을 쉽게 탐색할 수 있습니다!</p>
<h2 id="Reference" class="common-anchor-header">참고 자료<button data-href="#Reference" class="anchor-icon" translate="no">
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
    </button></h2><ol>
<li>무비렌즈 밀리언 데이터세트(ml-1m): http://files.grouplens.org/datasets/movielens/ml-1m.zip</li>
<li>ml-1m-README: http://files.grouplens.org/datasets/movielens/ml-1m-README.txt</li>
<li>패들패들의 퓨전 추천 모델: https://www.paddlepaddle.org.cn/documentation/docs/zh/beginners_guide/basics/recommender_system/index.html#id7</li>
<li>부트캠프: https://github.com/milvus-io/bootcamp/tree/master/solutions/recommendation_system</li>
<li>Milvus: https://milvus.io/</li>
</ol>
