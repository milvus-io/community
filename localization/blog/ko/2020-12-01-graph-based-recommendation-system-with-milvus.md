---
id: graph-based-recommendation-system-with-milvus.md
title: 추천 시스템은 어떻게 작동하나요?
author: Shiyu Chen
date: 2020-12-01T21:41:08.582Z
desc: >-
  추천 시스템은 수익을 창출하고 비용을 절감하며 경쟁 우위를 제공할 수 있습니다. 오픈 소스 도구를 사용하여 추천 시스템을 무료로 구축하는
  방법을 알아보세요.
cover: >-
  assets.zilliz.com/thisisengineering_raeng_z3c_Mj_I6k_P_I_unsplash_2228b9411c.jpg
tag: Scenarios
canonicalUrl: 'https://zilliz.com/blog/graph-based-recommendation-system-with-milvus'
---
<custom-h1>Milvus, PinSage, DGL, MovieLens 데이터 세트로 그래프 기반 추천 시스템 구축하기</custom-h1><p>추천 시스템은 인간이 원치 않는 이메일을 선별하는 데 도움을 주는 <a href="https://www.npr.org/2021/06/03/1002772749/the-rise-of-recommendation-systems-how-machines-figure-out-the-things-we-want">소박한</a> 알고리즘으로 <a href="https://www.npr.org/2021/06/03/1002772749/the-rise-of-recommendation-systems-how-machines-figure-out-the-things-we-want">시작되었습니다</a>. 1990년, 발명가 더그 테리는 협업 필터링 알고리즘을 사용하여 정크 메일에서 바람직한 이메일을 선별했습니다. 사용자는 단순히 이메일에 '좋아요'를 누르거나 '싫어요'를 누르면 비슷한 메일 콘텐츠에 대해 같은 행동을 하는 다른 사람들과 협력하여 컴퓨터가 사용자의 받은 편지함으로 보낼 것과 정크 메일 폴더로 격리할 것을 신속하게 결정하도록 훈련시킬 수 있었습니다.</p>
<p>일반적인 의미에서 추천 시스템은 사용자에게 관련성 있는 제안을 하는 알고리즘입니다. 추천은 시나리오나 산업에 따라 볼 영화, 읽을 책, 구매할 제품 또는 그 밖의 모든 것이 될 수 있습니다. 이러한 알고리즘은 우리 주변에 존재하며 우리가 소비하는 콘텐츠와 유튜브, 아마존, 넷플릭스 등 주요 기술 기업에서 구매하는 제품에 영향을 미칩니다.</p>
<p>잘 설계된 추천 시스템은 필수적인 수익 창출원, 비용 절감, 경쟁 차별화 요소가 될 수 있습니다. 오픈 소스 기술과 컴퓨팅 비용의 하락 덕분에 맞춤형 추천 시스템에 대한 접근성이 그 어느 때보다 높아졌습니다. 이 문서에서는 오픈 소스 벡터 데이터베이스인 Milvus, 그래프 컨볼루션 신경망(GCN)인 PinSage, 그래프 딥러닝을 위한 확장 가능한 파이썬 패키지인 딥 그래프 라이브러리(DGL), MovieLens 데이터셋을 사용하여 그래프 기반 추천 시스템을 구축하는 방법에 대해 설명합니다.</p>
<p><strong>이동하기:</strong></p>
<ul>
<li><a href="#how-do-recommendation-systems-work">추천 시스템은 어떻게 작동하나요?</a></li>
<li><a href="#tools-for-building-a-recommender-system">추천 시스템 구축을 위한 도구</a></li>
<li><a href="#building-a-graph-based-recommender-system-with-milvus">Milvus로 그래프 기반 추천 시스템 구축하기</a></li>
</ul>
<h2 id="How-do-recommendation-systems-work" class="common-anchor-header">추천 시스템은 어떻게 작동하나요?<button data-href="#How-do-recommendation-systems-work" class="anchor-icon" translate="no">
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
    </button></h2><p>추천 시스템을 구축하는 데는 협업 필터링과 콘텐츠 기반 필터링이라는 두 가지 일반적인 접근 방식이 있습니다. 대부분의 개발자는 두 가지 방법 중 하나 또는 두 가지 방법을 모두 사용하며, 추천 시스템의 복잡성과 구성은 다양할 수 있지만 일반적으로 세 가지 핵심 요소를 포함합니다:</p>
<ol>
<li><strong>사용자 모델:</strong> 추천 시스템에는 사용자 특성, 선호도 및 요구 사항을 모델링해야 합니다. 많은 추천 시스템은 사용자의 암시적 또는 명시적 항목 수준 입력을 기반으로 제안합니다.</li>
<li><strong>개체 모델:</strong> 추천 시스템은 또한 사용자 초상화를 기반으로 항목을 추천하기 위해 항목을 모델링합니다.</li>
<li><strong>추천 알고리즘:</strong> 모든 추천 시스템의 핵심 구성 요소는 추천을 지원하는 알고리즘입니다. 일반적으로 사용되는 알고리즘에는 협업 필터링, 암시적 의미 모델링, 그래프 기반 모델링, 결합 추천 등이 있습니다.</li>
</ol>
<p>크게 보면, 협업 필터링에 의존하는 추천 시스템은 과거 사용자 행동(유사한 사용자의 행동 입력 포함)을 바탕으로 모델을 구축하여 사용자가 관심을 가질 만한 내용을 예측합니다. 콘텐츠 기반 필터링에 의존하는 시스템은 항목 특성에 따라 미리 정의된 개별 태그를 사용하여 유사한 항목을 추천합니다.</p>
<p>협업 필터링의 예로는 사용자의 청취 기록, 관심사, 음악 라이브러리 등을 기반으로 하는 Spotify의 개인 맞춤형 라디오 방송국을 들 수 있습니다. 이 방송국은 사용자가 저장하지 않았거나 관심을 표명하지 않았지만 비슷한 취향을 가진 다른 사용자가 자주 듣는 음악을 재생합니다. 콘텐츠 기반 필터링의 예로는 특정 노래나 아티스트에 기반한 라디오 방송국이 입력된 속성을 사용하여 유사한 음악을 추천하는 것을 들 수 있습니다.</p>
<h2 id="Tools-for-building-a-recommender-system" class="common-anchor-header">추천 시스템 구축을 위한 도구<button data-href="#Tools-for-building-a-recommender-system" class="anchor-icon" translate="no">
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
    </button></h2><p>이 예제에서 그래프 기반 추천 시스템을 처음부터 구축하려면 다음 도구가 필요합니다:</p>
<h3 id="Pinsage-A-graph-convolutional-network" class="common-anchor-header">핀사지: 그래프 컨볼루션 네트워크</h3><p><a href="https://medium.com/pinterest-engineering/pinsage-a-new-graph-convolutional-neural-network-for-web-scale-recommender-systems-88795a107f48">핀세이지는</a> 수십억 개의 개체가 포함된 웹 규모의 그래프에서 노드에 대한 임베딩을 학습할 수 있는 랜덤워크 그래프 컨볼루션 네트워크입니다. 이 네트워크는 온라인 핀보드 회사인 <a href="https://www.pinterest.com/">Pinterest에서</a> 사용자에게 주제별 시각적 추천을 제공하기 위해 개발되었습니다.</p>
<p>Pinterest 사용자는 관심 있는 콘텐츠를 '보드'에 '고정'할 수 있으며, 이는 고정된 콘텐츠의 모음입니다. 월간 활성 사용자 수(MAU)가 <a href="https://business.pinterest.com/audience/">4억 7,800만</a> 명에 달하고 저장된 개체가 <a href="https://newsroom.pinterest.com/en/company">2,400억</a> 개가 넘는 이 회사는 방대한 양의 사용자 데이터를 보유하고 있으며, 이를 따라잡기 위해 새로운 기술을 구축해야만 했습니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_742d28f7a9.png" alt="1.png" class="doc-image" id="1.png" />
   </span> <span class="img-wrapper"> <span>1.png</span> </span></p>
<p>핀세이지에서는 핀보드 이분 그래프를 사용하여 핀에서 고품질의 임베딩을 생성하고, 이를 통해 사용자에게 시각적으로 유사한 콘텐츠를 추천합니다. 특징 행렬과 전체 그래프에서 컨볼루션을 수행하는 기존의 GCN 알고리즘과 달리, PinSage는 가까운 노드/핀을 샘플링하고 계산 그래프의 동적 구성을 통해 보다 효율적인 로컬 컨볼루션을 수행합니다.</p>
<p>노드의 전체 이웃에 대해 컨볼루션을 수행하면 방대한 계산 그래프가 생성됩니다. 리소스 요구 사항을 줄이기 위해 기존의 GCN 알고리즘은 노드의 k-홉 이웃의 정보를 집계하여 노드의 표현을 업데이트합니다. PinSage는 랜덤 워크를 시뮬레이션하여 자주 방문하는 콘텐츠를 핵심 이웃으로 설정한 다음 이를 기반으로 컨볼루션을 구성합니다.</p>
<p>k-hop 이웃에는 종종 겹치는 부분이 있기 때문에 노드에서 로컬 컨볼루션을 수행하면 계산이 반복됩니다. 이를 방지하기 위해 각 집계 단계에서 PinSage는 반복 계산 없이 모든 노드를 매핑한 다음 해당 상위 수준 노드에 연결하고 마지막으로 상위 수준 노드의 임베딩을 검색합니다.</p>
<h3 id="Deep-Graph-Library-A-scalable-python-package-for-deep-learning-on-graphs" class="common-anchor-header">딥 그래프 라이브러리: 그래프에 대한 딥 러닝을 위한 확장 가능한 Python 패키지</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/dgl_framework_building_graph_based_recommender_milvus_af62de6dd4.png" alt="dgl-framework-building-graph-based-recommender-milvus.png" class="doc-image" id="dgl-framework-building-graph-based-recommender-milvus.png" />
   </span> <span class="img-wrapper"> <span>dgl-프레임워크-구축-그래프 기반 추천자-milvus.png</span> </span></p>
<p><a href="https://www.dgl.ai/">딥 그래프 라이브러리(DGL)</a> 는 기존 딥 러닝 프레임워크(예: PyTorch, MXNet, Gluon 등) 위에 그래프 기반 신경망 모델을 구축하기 위해 설계된 Python 패키지입니다. DGL에는 사용자 친화적인 백엔드 인터페이스가 포함되어 있어 텐서 기반 프레임워크에 쉽게 이식할 수 있으며 자동 생성을 지원합니다. 위에서 언급한 PinSage 알고리즘은 DGL 및 PyTorch와 함께 사용하도록 최적화되어 있습니다.</p>
<h3 id="Milvus-An-open-source-vector-database-built-for-AI-and-similarity-search" class="common-anchor-header">Milvus: AI 및 유사도 검색을 위해 구축된 오픈 소스 벡터 데이터베이스</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/how_does_milvus_work_6926180543.png" alt="how-does-milvus-work.png" class="doc-image" id="how-does-milvus-work.png" />
   </span> <span class="img-wrapper"> <span>how-does-milvus-work.png</span> </span></p>
<p>Milvus는 벡터 유사도 검색과 인공 지능(AI) 애플리케이션을 구동하기 위해 구축된 오픈 소스 벡터 데이터베이스입니다. 크게 보면 유사도 검색에 Milvus를 사용하는 원리는 다음과 같습니다:</p>
<ol>
<li>딥 러닝 모델을 사용해 비정형 데이터를 특징 벡터로 변환하고, 이를 Milvus로 가져옵니다.</li>
<li>Milvus는 특징 벡터를 저장하고 색인을 생성합니다.</li>
<li>요청이 들어오면 Milvus는 입력 벡터와 가장 유사한 벡터를 검색하여 반환합니다.</li>
</ol>
<h2 id="Building-a-graph-based-recommendation-system-with-Milvus" class="common-anchor-header">Milvus로 그래프 기반 추천 시스템 구축하기<button data-href="#Building-a-graph-based-recommendation-system-with-Milvus" class="anchor-icon" translate="no">
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
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/beike_intelligent_house_platform_diagram_6e278da118.jpg" alt="beike-intelligent-house-platform-diagram.jpg" class="doc-image" id="beike-intelligent-house-platform-diagram.jpg" />
   </span> <span class="img-wrapper"> <span>비케-인텔리전트-하우스-플랫폼-다이어그램.jpg</span> </span></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_building_graph_based_recommender_system_bf89770634.png" alt="3-building-graph-based-recommender-system.png" class="doc-image" id="3-building-graph-based-recommender-system.png" />
   </span> <span class="img-wrapper"> <span>3-그래프 기반 추천 시스템 구축.png</span> </span></p>
<p>Milvus로 그래프 기반 추천 시스템을 구축하는 단계는 다음과 같습니다:</p>
<h3 id="Step-1-Preprocess-data" class="common-anchor-header">1단계: 데이터 전처리</h3><p>데이터 전처리에는 원시 데이터를 보다 이해하기 쉬운 형식으로 변환하는 작업이 포함됩니다. 이 예에서는 6,000명의 사용자가 제공한 4,000개의 영화에 대한 1,000,000개의 평점이 포함된 개방형 데이터 세트 MovieLens[5](m1-1m)를 사용합니다. 이 데이터는 GroupLens에서 수집한 것으로 영화 설명, 영화 평점 및 사용자 특성을 포함합니다.</p>
<p>이 예제에 사용된 MovieLens 데이터 세트는 최소한의 데이터 정리 또는 구성이 필요합니다. 그러나 다른 데이터 세트를 사용하는 경우 마일리지가 달라질 수 있습니다.</p>
<p>추천 시스템 구축을 시작하려면 MovieLens 데이터 세트의 과거 사용자-영화 데이터를 사용하여 분류를 위한 사용자-영화 이분 그래프를 구축합니다.</p>
<pre><code translate="no">graph_builder = PandasGraphBuilder()
graph_builder.add_entities(users, 'user_id', 'user')
graph_builder.add_entities(movies_categorical, 'movie_id', 'movie')
graph_builder.add_binary_relations(ratings, 'user_id', 'movie_id', 'watched')
graph_builder.add_binary_relations(ratings, 'movie_id', 'user_id', 'watched-by')
g = graph_builder.build()
</code></pre>
<h3 id="Step-2-Train-model-with-PinSage" class="common-anchor-header">2단계: PinSage로 모델 훈련</h3><p>PinSage 모델을 사용하여 생성된 핀의 임베딩 벡터는 획득한 영화 정보의 특징 벡터입니다. 이분 그래프 g와 사용자 정의된 동영상 특징 벡터 차원(기본값은 256-d)을 기반으로 PinSage 모델을 생성합니다. 그런 다음 PyTorch로 모델을 훈련하여 4,000개의 영화에 대한 h_item 임베딩을 얻습니다.</p>
<pre><code translate="no"># Define the model
model = PinSAGEModel(g, item_ntype, textset, args.hidden_dims, args.num_layers).to(device)
opt = torch.optim.Adam(model.parameters(), lr=args.lr)
# Get the item embeddings
for blocks in dataloader_test:
   for i in range(len(blocks)):
   blocks[i] = blocks[i].to(device)
   h_item_batches.append(model.get_repr(blocks))
h_item = torch.cat(h_item_batches, 0)
</code></pre>
<h3 id="Step-3-Load-data" class="common-anchor-header">3단계: 데이터 로드</h3><p>PinSage 모델에서 생성한 동영상 임베딩 h_item을 Milvus에 로드하면 해당 ID가 반환됩니다. ID와 해당 영화 정보를 MySQL로 가져옵니다.</p>
<pre><code translate="no"># Load data to Milvus and MySQL
status, ids = milvus.insert(milvus_table, h_item)
load_movies_to_mysql(milvus_table, ids_info)
</code></pre>
<h3 id="Step-4-Conduct-vector-similarity-search" class="common-anchor-header">4단계: 벡터 유사도 검색 수행</h3><p>영화 ID를 기반으로 Milvus에서 해당 임베딩을 가져온 다음, Milvus를 사용하여 이 임베딩으로 유사도 검색을 수행합니다. 그런 다음, MySQL 데이터베이스에서 해당 영화 정보를 식별합니다.</p>
<pre><code translate="no"># Get embeddings that users like
_, user_like_vectors = milvus.get_entity_by_id(milvus_table, ids)
# Get the information with similar movies
_, ids = milvus.search(param = {milvus_table, user_like_vectors, top_k})
sql = &quot;select * from &quot; + movies_table + &quot; where milvus_id=&quot; + ids + &quot;;&quot;
results = cursor.execute(sql).fetchall()
</code></pre>
<h3 id="Step-5-Get-recommendations" class="common-anchor-header">5단계: 추천 받기</h3><p>이제 시스템이 사용자 검색어와 가장 유사한 영화를 추천합니다. 이것이 추천 시스템을 구축하기 위한 일반적인 워크플로입니다. 추천 시스템 및 기타 AI 애플리케이션을 빠르게 테스트하고 배포하려면 Milvus <a href="https://github.com/milvus-io/bootcamp">부트캠프를</a> 사용해 보세요.</p>
<h2 id="Milvus-can-power-more-than-recommender-systems" class="common-anchor-header">추천 시스템 그 이상의 기능을 제공하는 Milvus<button data-href="#Milvus-can-power-more-than-recommender-systems" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus는 방대한 인공 지능 및 벡터 유사도 검색 애플리케이션을 지원할 수 있는 강력한 도구입니다. 프로젝트에 대해 자세히 알아보려면 다음 리소스를 확인하세요:</p>
<ul>
<li><a href="https://zilliz.com/blog">블로그</a> 읽기.</li>
<li><a href="https://join.slack.com/t/milvusio/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ">Slack의</a> 오픈 소스 커뮤니티와 교류하세요.</li>
<li><a href="https://github.com/milvus-io/milvus/">GitHub에서</a> 세계에서 가장 인기 있는 벡터 데이터베이스를 사용하거나 기여하세요.</li>
</ul>
