---
id: music-recommender-system-item-based-collaborative-filtering-milvus.md
title: "\U0001F50E 임베딩 유사도 검색 엔진 선택하기"
author: milvus
date: 2020-09-08T00:01:59.064Z
desc: 완인 앱 사례 연구
cover: assets.zilliz.com/header_f8cea596d2.png
tag: Scenarios
canonicalUrl: >-
  https://zilliz.com/blog/music-recommender-system-item-based-collaborative-filtering-milvus
---
<custom-h1>음악 추천 시스템을 위한 항목 기반 협업 필터링</custom-h1><p>완인 앱은 음악 공유를 장려하고 음악 애호가들이 더 쉽게 음악을 작곡할 수 있도록 하기 위해 만들어진 AI 기반 음악 공유 커뮤니티입니다.</p>
<p>Wanyin의 라이브러리에는 사용자가 업로드한 방대한 양의 음악이 포함되어 있습니다. 주요 작업은 사용자의 이전 행동을 기반으로 관심 있는 음악을 분류하는 것입니다. 우리는 추천 시스템 모델로 사용자 기반 협업 필터링(사용자 기반 CF)과 항목 기반 협업 필터링(항목 기반 CF)이라는 두 가지 고전적인 모델을 잠재적 추천 시스템 모델로 평가했습니다.</p>
<ul>
<li>사용자 기반 CF는 유사성 통계를 사용하여 선호도나 관심사가 비슷한 이웃 사용자를 구합니다. 검색된 가장 가까운 이웃 사용자 집합을 통해 시스템은 대상 사용자의 관심사를 예측하고 추천을 생성할 수 있습니다.</li>
<li>Amazon에서 도입한 항목 기반 CF 또는 항목 간(I2I) CF는 추천 시스템을 위한 잘 알려진 협업 필터링 모델입니다. 이 모델은 사용자가 아닌 항목 간의 유사성을 계산하며, 관심 있는 항목은 높은 점수를 받은 항목과 유사해야 한다는 가정을 기반으로 합니다.</li>
</ul>
<p>사용자 기반 CF는 사용자 수가 일정 지점을 넘어가면 계산 시간이 엄청나게 길어질 수 있습니다. 저희 제품의 특성을 고려하여 음악 추천 시스템을 구현하기 위해 I2I CF를 사용하기로 결정했습니다. 곡에 대한 메타데이터를 많이 보유하고 있지 않기 때문에 곡 자체에서 특징 벡터(임베딩)를 추출해야 합니다. 저희의 접근 방식은 이러한 노래를 멜 주파수 세프스트럼(MFC)으로 변환하고, 컨볼루션 신경망(CNN)을 설계하여 노래의 특징 임베딩을 추출한 다음 임베딩 유사성 검색을 통해 음악을 추천하는 것입니다.</p>
<h2 id="🔎-Select-an-embedding-similarity-search-engine" class="common-anchor-header">🔎 임베딩 유사도 검색 엔진 선택하기<button data-href="#🔎-Select-an-embedding-similarity-search-engine" class="anchor-icon" translate="no">
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
    </button></h2><p>이제 특징 벡터가 생겼으니 남은 문제는 대량의 벡터 중에서 타겟 벡터와 유사한 벡터를 검색하는 방법입니다. 임베딩 검색 엔진에 관해서는 Faiss와 Milvus 사이에서 고민하고 있었습니다. 2019년 11월에 깃허브의 인기 리포지토리를 살펴보던 중 Milvus를 발견했습니다. 프로젝트를 살펴보니 추상적인 API가 마음에 들었습니다. (당시에는 v0.5.x 버전이었고 지금은 v0.10.2 버전입니다.)</p>
<p>저희는 Faiss보다 Milvus를 선호합니다. 한편으로는 이전에 Faiss를 사용해 본 적이 있어서 새로운 것을 시도해보고 싶었기 때문입니다. 다른 한편으로, Milvus에 비해 Faiss는 기본 라이브러리에 가깝기 때문에 사용하기가 쉽지 않습니다. 밀버스에 대해 자세히 알아본 결과, 두 가지 주요 기능 때문에 결국 밀버스를 채택하기로 결정했습니다:</p>
<ul>
<li>Milvus는 사용하기 매우 쉽습니다. Docker 이미지를 가져와서 자체 시나리오에 따라 파라미터를 업데이트하기만 하면 됩니다.</li>
<li>더 많은 인덱스를 지원하며 자세한 지원 문서가 있습니다.</li>
</ul>
<p>간단히 말해, Milvus는 사용자에게 매우 친숙하며 문서도 매우 상세합니다. 문제가 발생하면 대개 문서에서 해결책을 찾을 수 있으며, 그렇지 않은 경우 언제든지 Milvus 커뮤니티에서 지원을 받을 수 있습니다.</p>
<h2 id="Milvus-cluster-service-☸️-⏩" class="common-anchor-header">Milvus 클러스터 서비스 ☸️ ⏩<button data-href="#Milvus-cluster-service-☸️-⏩" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus를 피처 벡터 검색 엔진으로 사용하기로 결정한 후, 개발(DEV) 환경에서 독립형 노드를 구성했습니다. 며칠 동안 잘 실행되고 있었기 때문에 공장 승인 테스트(FAT) 환경에서 테스트를 실행할 계획이었습니다. 프로덕션 환경에서 독립형 노드가 충돌하면 전체 서비스를 사용할 수 없게 됩니다. 따라서 고가용성 검색 서비스를 배포해야 했습니다.</p>
<p>Milvus는 클러스터 샤딩 미들웨어인 Mishards와 구성을 위한 Milvus-Helm을 모두 제공합니다. Milvus 클러스터 서비스를 배포하는 과정은 간단합니다. 몇 가지 파라미터를 업데이트하고 Kubernetes에 배포하기 위해 패키징하기만 하면 됩니다. Milvus의 문서에 있는 아래 다이어그램은 Mishards의 작동 방식을 보여줍니다:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_how_mishards_works_in_milvus_documentation_43a73076bf.png" alt="1-how-mishards-works-in-milvus-documentation.png" class="doc-image" id="1-how-mishards-works-in-milvus-documentation.png" />
   </span> <span class="img-wrapper"> <span>1-how-mishards-works-in-milvus-documentation.png</span> </span></p>
<p>Mishards는 업스트림에서 하위 모듈로 요청을 캐스케이드하여 업스트림 요청을 분할한 다음 하위 서비스의 결과를 수집하여 업스트림으로 반환합니다. 미샤드 기반 클러스터 솔루션의 전체 아키텍처는 아래와 같습니다:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_mishards_based_cluster_solution_architecture_3ad89cf269.jpg" alt="2-mishards-based-cluster-solution-architecture.jpg" class="doc-image" id="2-mishards-based-cluster-solution-architecture.jpg" />
   </span> <span class="img-wrapper"> <span>2-mishards-based-cluster-solution-architecture.jpg</span> </span></p>
<p>공식 문서에서 Mishards에 대한 명확한 소개를 확인할 수 있습니다. 관심이 있으시다면 <a href="https://milvus.io/cn/docs/v0.10.2/mishards.md">Mishards를</a> 참고하시기 바랍니다.</p>
<p>저희 음악 추천 시스템에서는 Milvus-Helm을 사용하여 쓰기 가능한 노드 1개, 읽기 전용 노드 2개, Mishards 미들웨어 인스턴스 1개를 Kubernetes에 배포했습니다. 한동안 FAT 환경에서 서비스를 안정적으로 실행한 후 프로덕션 환경에 배포했습니다. 지금까지는 안정적으로 운영되고 있습니다.</p>
<h2 id="🎧-I2I-music-recommendation-🎶" class="common-anchor-header">🎧 I2I 음악 추천 🎶<button data-href="#🎧-I2I-music-recommendation-🎶" class="anchor-icon" translate="no">
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
    </button></h2><p>앞서 말씀드린 것처럼 기존 곡에서 추출한 임베딩을 활용해 완인의 I2I 음악 추천 시스템을 구축했습니다. 먼저 사용자가 업로드한 신곡의 보컬과 BGM을 분리(트랙 분리)하고, 해당 곡의 특징 표현으로 BGM 임베딩을 추출했습니다. 이는 원곡의 커버 버전을 분류하는 데도 도움이 됩니다. 그런 다음 이러한 임베딩을 Milvus에 저장하고 사용자가 들은 노래를 기반으로 유사한 노래를 검색한 다음 검색된 노래를 정렬 및 재배열하여 음악 추천을 생성했습니다. 구현 과정은 아래와 같습니다:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_music_recommender_system_implementation_c52a333eb8.png" alt="3-music-recommender-system-implementation.png" class="doc-image" id="3-music-recommender-system-implementation.png" />
   </span> <span class="img-wrapper"> <span>3-music-recommender-system-implementation.png</span> </span></p>
<h2 id="🚫-Duplicate-song-filter" class="common-anchor-header">🚫 중복 노래 필터<button data-href="#🚫-Duplicate-song-filter" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus를 사용하는 또 다른 시나리오는 중복 노래 필터링입니다. 일부 사용자는 동일한 노래나 클립을 여러 번 업로드하며, 이러한 중복된 노래가 추천 목록에 표시될 수 있습니다. 이는 사전 처리 없이 추천을 생성할 경우 사용자 경험에 영향을 미칠 수 있음을 의미합니다. 따라서 사전 처리를 통해 중복된 곡을 찾아내어 동일한 목록에 나타나지 않도록 해야 합니다.</p>
<p>Milvus를 사용하는 또 다른 시나리오는 중복 노래 필터링입니다. 일부 사용자는 동일한 노래나 클립을 여러 번 업로드하며, 이러한 중복된 노래가 추천 목록에 표시될 수 있습니다. 이는 사전 처리 없이 추천을 생성할 경우 사용자 경험에 영향을 미칠 수 있음을 의미합니다. 따라서 사전 처리를 통해 중복된 곡을 찾아내어 동일한 목록에 나타나지 않도록 해야 합니다.</p>
<p>이전 시나리오와 마찬가지로 유사한 특징 벡터를 검색하는 방식으로 중복 곡 필터링을 구현했습니다. 먼저 보컬과 BGM을 분리하고 Milvus를 사용하여 유사한 곡을 다수 검색했습니다. 정확한 중복곡 필터링을 위해 대상 곡과 유사 곡의 오디오 지문을 추출하고(에코프린트, 크로마프린트 등의 기술로), 대상 곡의 오디오 지문과 각 유사 곡의 지문 간의 유사도를 계산했습니다. 유사도가 임계값을 초과하면 해당 곡을 대상 곡의 중복 곡으로 정의합니다. 오디오 지문 매칭 프로세스를 통해 중복 곡을 보다 정확하게 필터링할 수 있지만, 시간이 많이 걸립니다. 따라서 방대한 음악 라이브러리에서 노래를 필터링할 때는 Milvus를 사용하여 예비 단계로 후보 중복 노래를 필터링합니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/4_using_milvus_filter_songs_music_recommender_duplicates_0ff68d3e67.png" alt="4-using-milvus-filter-songs-music-recommender-duplicates.png" class="doc-image" id="4-using-milvus-filter-songs-music-recommender-duplicates.png" />
   </span> <span class="img-wrapper"> <span>4-사용-밀버스-필터-곡-음악-추천-듀플리케이트.png</span> </span></p>
<p>완인의 방대한 음악 라이브러리를 위한 I2I 추천 시스템을 구현하기 위해 곡의 임베딩을 특징으로 추출하고, 대상 곡의 임베딩과 유사한 임베딩을 불러온 다음 결과를 정렬하고 재배열하여 사용자에게 추천 목록을 생성하는 방식으로 접근합니다. 실시간 추천을 위해 기능 벡터 유사도 검색 엔진으로 Faiss 대신 Milvus를 선택한 이유는 Milvus가 더 사용자 친화적이고 정교한 것으로 입증되었기 때문입니다. 또한 중복곡 필터에도 Milvus를 적용하여 사용자 경험과 효율성을 개선했습니다.</p>
<p><a href="https://enjoymusic.ai/wanyin">완인 앱</a> 🎶을 다운로드하여 사용해 보세요. (참고: 일부 앱 스토어에서는 제공되지 않을 수 있습니다.)</p>
<h3 id="📝-Authors" class="common-anchor-header">📝 저자:</h3><p>Jason, Stepbeats의 알고리즘 엔지니어 Shiyu Chen, Zilliz의 데이터 엔지니어</p>
<h3 id="📚-References" class="common-anchor-header">📚 참고자료:</h3><p>미샤즈 문서: https://milvus.io/docs/v0.10.2/mishards.md 미샤즈: https://github.com/milvus-io/milvus/tree/master/shards 밀버스-헬름: https://github.com/milvus-io/milvus-helm/tree/master/charts/milvus</p>
<p><strong>🤗 낯선 사람이 되지 마시고 <a href="https://twitter.com/milvusio/">트위터에서</a> 팔로우하거나 <a href="https://milvusio.slack.com/join/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ#/">Slack에</a> 가입하세요!👇🏻</strong></p>
