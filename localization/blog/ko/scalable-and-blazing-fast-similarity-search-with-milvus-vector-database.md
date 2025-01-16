---
id: scalable-and-blazing-fast-similarity-search-with-milvus-vector-database.md
title: Milvus 벡터 데이터베이스를 통한 확장 가능하고 빠른 유사도 검색
author: Dipanjan Sarkar
date: 2022-06-21T00:00:00.000Z
desc: '수조 개의 문서 벡터를 밀리초 만에 저장, 색인, 관리, 검색하세요!'
cover: assets.zilliz.com/69eba74e_4a9a_4c38_a2d9_2cde283e8a1d_e265515238.png
tag: Engineering
tags: 'Data science, Database, Tech, Artificial Intelligence, Vector Management'
canonicalUrl: >-
  https://milvus.io/blog/scalable_and_blazing_fast_similarity_search_with_milvus_vector_database.md
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/69eba74e_4a9a_4c38_a2d9_2cde283e8a1d_e265515238.png" alt="cover image" class="doc-image" id="cover-image" />
   </span> <span class="img-wrapper"> <span>표지 이미지</span> </span></p>
<h2 id="Introduction" class="common-anchor-header">소개<button data-href="#Introduction" class="anchor-icon" translate="no">
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
    </button></h2><p>이 글에서는 벡터 데이터베이스와 대규모 유사도 검색과 관련된 몇 가지 흥미로운 측면을 다룹니다. 빠르게 진화하는 오늘날의 세상에서는 새로운 기술, 새로운 비즈니스, 새로운 데이터 소스가 등장하고 있으며, 따라서 이러한 데이터를 저장, 관리, 활용하여 인사이트를 얻기 위해 새로운 방법을 계속 사용해야 합니다. 구조화된 표 형식의 데이터는 수십 년 동안 관계형 데이터베이스에 저장되어 왔으며, 비즈니스 인텔리전스는 이러한 데이터에서 인사이트를 분석하고 추출하는 데 성공했습니다. 그러나 현재의 데이터 환경을 고려하면 "데이터의 80~90% 이상이 텍스트, 동영상, 오디오, 웹 서버 로그, 소셜 미디어 등과 같은 비정형 정보"입니다. 기존의 쿼리 기반 방식으로는 이러한 데이터에서 인사이트를 추출하는 것이 충분하지 않거나 불가능할 수 있기 때문에 기업들은 머신러닝과 딥러닝의 힘을 활용하고 있습니다. 이러한 데이터에서 가치 있는 인사이트를 추출할 수 있는 아직 개발되지 않은 엄청난 잠재력이 있으며, 이제 시작에 불과합니다!</p>
<blockquote>
<p>"전 세계 데이터의 대부분은 비정형 데이터이기 때문에 이를 분석하고 조치를 취할 수 있는 능력은 큰 기회를 제공합니다." - 마이크 슐만, Kensho, ML 책임자</p>
</blockquote>
<p>비정형 데이터는 이름에서 알 수 있듯이 행과 열로 이루어진 표와 같은 암묵적인 구조가 없습니다(따라서 표 형식 또는 정형 데이터라고도 함). 정형 데이터와 달리 비정형 데이터의 내용을 관계형 데이터베이스 내에 저장하는 쉬운 방법은 없습니다. 인사이트를 얻기 위해 비정형 데이터를 활용하는 데는 세 가지 주요 과제가 있습니다:</p>
<ul>
<li><strong>저장:</strong> 일반 관계형 데이터베이스는 정형 데이터를 보관하는 데 적합합니다. NoSQL 데이터베이스를 사용하여 이러한 데이터를 저장할 수 있지만, 이러한 데이터를 처리하여 규모에 맞는 적절한 표현을 추출하는 데 추가적인 오버헤드가 발생합니다.</li>
<li><strong>표현:</strong> 컴퓨터는 사람처럼 텍스트나 이미지를 이해하지 못합니다. 컴퓨터는 숫자만 이해하므로 구조화되지 않은 데이터를 유용한 숫자 표현(일반적으로 벡터나 임베딩)으로 변환해야 합니다.</li>
<li><strong>쿼리:</strong> 구조화된 데이터에 대한 SQL과 같은 명확한 조건문을 기반으로 비정형 데이터를 직접 쿼리할 수 없습니다. 좋아하는 신발 한 켤레의 사진이 주어졌을 때 비슷한 신발을 검색하려고 하는 간단한 예를 상상해 보세요! 검색에 원시 픽셀 값을 사용할 수 없으며 신발 모양, 크기, 스타일, 색상 등과 같은 구조화된 특징도 표현할 수 없습니다. 이제 수백만 개의 신발에 대해 이 작업을 수행해야 한다고 상상해 보세요!</li>
</ul>
<p>따라서 컴퓨터가 비정형 데이터를 이해하고 처리하며 표현하기 위해 일반적으로 임베딩이라고 하는 고밀도 벡터로 변환합니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Representing_Images_as_Dense_Embedding_Vectors_0b6a5f516c.png" alt="figure 1" class="doc-image" id="figure-1" />
   </span> <span class="img-wrapper"> <span>그림 1</span> </span></p>
<p>특히 딥러닝을 활용한 다양한 방법론이 존재하는데, 이미지와 같은 시각적 데이터에는 컨볼루션 신경망(CNN)을, 텍스트 데이터에는 트랜스포머를 사용하여 이러한 비정형 데이터를 임베딩으로 변환하는 데 사용할 수 있습니다. <a href="https://zilliz.com/learn/embedding-generation">다양한 임베딩 기법을 다루는</a> <a href="https://zilliz.com/">Zilliz의</a> <a href="https://zilliz.com/learn/embedding-generation">훌륭한 문서가</a> 있습니다!</p>
<p>이제 이러한 임베딩 벡터를 저장하는 것만으로는 충분하지 않습니다. 유사한 벡터를 쿼리하고 찾아낼 수 있어야 합니다. 왜 그럴까요? 실제 애플리케이션의 대부분은 AI 기반 솔루션에 대한 벡터 유사도 검색을 통해 구동됩니다. 여기에는 Google의 시각적(이미지) 검색, Netflix나 Amazon의 추천 시스템, Google의 텍스트 검색 엔진, 다중 모드 검색, 데이터 중복 제거 등이 포함됩니다!</p>
<p>대규모로 벡터를 저장, 관리 및 쿼리하는 것은 간단한 작업이 아닙니다. 이를 위해서는 전문적인 도구가 필요하며, 벡터 데이터베이스는 이러한 작업에 가장 효과적인 도구입니다! 이 글에서는 다음과 같은 측면을 다뤄보겠습니다:</p>
<ul>
<li><a href="#Vectors-and-Vector-Similarity-Search">벡터와 벡터 유사도 검색</a></li>
<li><a href="#What-is-a-Vector-Database">벡터 데이터베이스란 무엇인가요?</a></li>
<li><a href="#Milvus—The-World-s-Most-Advanced-Vector-Database">Milvus - 세계에서 가장 진보된 벡터 데이터베이스</a></li>
<li><a href="#Performing-visual-image-search-with-Milvus—A-use-case-blueprint">Milvus로 시각적 이미지 검색 수행하기 - 사용 사례 청사진</a></li>
</ul>
<p>시작해 봅시다!</p>
<h2 id="Vectors-and-Vector-Similarity-Search" class="common-anchor-header">벡터와 벡터 유사도 검색<button data-href="#Vectors-and-Vector-Similarity-Search" class="anchor-icon" translate="no">
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
    </button></h2><p>앞서 컴퓨터는 숫자만 이해할 수 있기 때문에 이미지나 텍스트와 같은 비정형 데이터를 벡터로 표현해야 할 필요성을 확인했습니다. 우리는 일반적으로 AI 모델, 좀 더 구체적으로 딥러닝 모델을 활용해 비정형 데이터를 기계가 읽을 수 있는 숫자 벡터로 변환합니다. 일반적으로 이러한 벡터는 기본적으로 기본 항목(이미지, 텍스트 등)을 집합적으로 나타내는 부동 소수점 숫자의 목록입니다.</p>
<h3 id="Understanding-Vectors" class="common-anchor-header">벡터 이해하기</h3><p>자연어 처리(NLP) 분야를 고려할 때 단어를 숫자 벡터로 표현하는 데 도움이 되는 <a href="https://towardsdatascience.com/understanding-feature-engineering-part-4-deep-learning-methods-for-text-data-96c44370bbfa">Word2Vec, GloVe, FastText와</a> 같은 많은 단어 임베딩 모델이 있습니다. 시간이 지남에 따라, 문맥 임베딩 벡터를 학습하고 전체 문장과 단락을 더 잘 표현하는 데 활용할 수 있는 <a href="https://jalammar.github.io/illustrated-bert/">BERT와</a> 같은 <a href="https://arxiv.org/abs/1706.03762">트랜스포머</a> 모델이 등장했습니다.</p>
<p>컴퓨터 비전 분야에서도 마찬가지로 이미지나 동영상과 같은 시각적 데이터로부터 표현을 학습하는 데 도움이 되는 <a href="https://proceedings.neurips.cc/paper/2012/file/c399862d3b9d6b76c8436e924a68c45b-Paper.pdf">합성곱 신경망(CNN)과</a> 같은 모델이 있습니다. 트랜스포머의 등장으로 일반 CNN보다 더 나은 성능을 발휘할 수 있는 <a href="https://arxiv.org/abs/2010.11929">비전 트랜스포머도</a> 있습니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Sample_workflow_for_extracting_insights_from_unstructured_data_c74f08f75a.png" alt="figure 2" class="doc-image" id="figure-2" />
   </span> <span class="img-wrapper"> <span>그림 2</span> </span></p>
<p>이러한 벡터의 장점은 일반적으로 사진을 업로드하면 시각적으로 유사한 이미지를 포함한 검색 결과를 얻을 수 있는 시각적 검색과 같은 실제 문제를 해결하는 데 활용할 수 있다는 것입니다. 다음 예시와 같이 Google은 이 기능을 검색 엔진에서 매우 인기 있는 기능으로 사용하고 있습니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/An_example_of_Google_s_Visual_Image_Search_fa49b81e88.png" alt="figure 3" class="doc-image" id="figure-3" />
   </span> <span class="img-wrapper"> <span>그림 3</span> </span></p>
<p>이러한 애플리케이션은 데이터 벡터와 벡터 유사도 검색으로 구동됩니다. X-Y 직교 좌표 공간에서 두 점을 고려한다고 가정해 보겠습니다. 두 점 사이의 거리는 다음 방정식으로 표현되는 간단한 유클리드 거리로 계산할 수 있습니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_D_Euclidean_Distance_6a52b7bc2f.png" alt="figure 4" class="doc-image" id="figure-4" />
   </span> <span class="img-wrapper"> <span>그림 4</span> </span></p>
<p>이제 각 데이터 포인트가 D 차원을 갖는 벡터라고 가정해도 유클리드 거리 또는 해밍 거리나 코사인 거리와 같은 다른 거리 메트릭을 사용하여 두 데이터 포인트가 서로 얼마나 가까운지 알아낼 수 있습니다. 이렇게 하면 벡터를 사용하여 참조 항목이 주어졌을 때 유사한 항목을 찾기 위한 정량화 가능한 지표로 사용할 수 있는 근접성 또는 유사성 개념을 구축하는 데 도움이 될 수 있습니다.</p>
<h3 id="Understanding-Vector-Similarity-Search" class="common-anchor-header">벡터 유사도 검색 이해하기</h3><p>벡터 유사도 검색은 흔히 가장 가까운 이웃(NN) 검색이라고도 하며, 기본적으로 유사한 항목을 찾고자 하는 참조 항목과 기존 항목 모음(일반적으로 데이터베이스에 있는) 사이의 쌍별 유사도(또는 거리)를 계산하여 가장 유사한 상위 'k'개의 가장 가까운 이웃 항목을 반환하는 프로세스입니다. 이 유사도를 계산하는 핵심 요소는 유클리드 거리, 내적 곱, 코사인 거리, 해밍 거리 등의 유사도 메트릭입니다. 거리가 작을수록 벡터가 더 유사하다고 볼 수 있습니다.</p>
<p>정확한 최인접 이웃(NN) 검색의 문제점은 확장성입니다. 비슷한 항목을 얻으려면 매번 N개의 거리를 계산해야 합니다(기존 항목이 N개 있다고 가정). 특히 벡터 데이터베이스와 같이 데이터를 어딘가에 저장하고 색인을 생성하지 않는 경우 매우 느려질 수 있습니다. 계산 속도를 높이기 위해 일반적으로 벡터를 인덱스에 저장하는 ANN 검색이라고 하는 근사 근접 이웃 검색을 활용합니다. 인덱스는 이러한 벡터를 지능적인 방식으로 저장하여 참조 쿼리 항목에 대해 '대략적으로' 유사한 이웃을 빠르게 검색할 수 있도록 도와줍니다. 일반적인 ANN 인덱싱 방법론은 다음과 같습니다:</p>
<ul>
<li><strong>벡터 변환:</strong> 여기에는 차원 축소(예: PCA \ t-SNE), 회전 등과 같은 벡터에 추가 변환을 추가하는 것이 포함됩니다.</li>
<li><strong>벡터 인코딩:</strong> 여기에는 유사한 항목을 더 빠르게 검색하는 데 도움이 되는 지역성 민감 해싱(LSH), 양자화, 트리 등과 같은 데이터 구조 기반 기술을 적용하는 것이 포함됩니다.</li>
<li><strong>비완전 검색 방법:</strong> 주로 완전 검색을 방지하기 위해 사용되며 이웃 그래프, 반전 인덱스 등의 방법을 포함합니다.</li>
</ul>
<p>따라서 벡터 유사도 검색 애플리케이션을 구축하려면 대규모의 효율적인 저장, 색인화, 쿼리(검색)를 지원하는 데이터베이스가 필요하다는 것을 알 수 있습니다. 벡터 데이터베이스를 시작하세요!</p>
<h2 id="What-is-a-Vector-Database" class="common-anchor-header">벡터 데이터베이스란 무엇인가요?<button data-href="#What-is-a-Vector-Database" class="anchor-icon" translate="no">
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
    </button></h2><p>이제 벡터를 사용해 비정형 데이터를 표현하는 방법과 벡터 검색의 작동 원리를 이해했으니, 이 두 가지 개념을 결합하여 벡터 데이터베이스를 구축할 수 있습니다.</p>
<p>벡터 데이터베이스는 딥러닝 모델을 사용해 비정형 데이터(이미지, 텍스트 등)에서 생성된 임베딩 벡터를 저장, 색인 및 쿼리할 수 있는 확장 가능한 데이터 플랫폼입니다.</p>
<p>유사성 검색을 위해 방대한 수의 벡터를 처리하는 것은 (인덱스를 포함하더라도) 매우 비용이 많이 들 수 있습니다. 그럼에도 불구하고 최고의 고급 벡터 데이터베이스는 원하는 인덱싱 알고리즘과 유사성 지표를 지정하는 것 외에도 수백만 또는 수십억 개의 대상 벡터를 삽입, 색인 및 검색할 수 있어야 합니다.</p>
<p>벡터 데이터베이스는 주로 기업에서 사용할 강력한 데이터베이스 관리 시스템을 고려하여 다음과 같은 주요 요구 사항을 충족해야 합니다:</p>
<ol>
<li><strong>확장성:</strong> 벡터 데이터베이스는 수십억 개의 임베딩 벡터에 대한 대략적인 근사 이웃 검색을 색인하고 실행할 수 있어야 합니다.</li>
<li><strong>신뢰성:</strong> 신뢰성: 벡터 데이터베이스는 데이터 손실 없이 운영 영향을 최소화하면서 내부 결함을 처리할 수 있어야 합니다(즉, 내결함성).</li>
<li><strong>빠름:</strong> 쿼리 및 쓰기 속도는 벡터 데이터베이스에 중요합니다. 초당 수백, 수천 개의 새로운 이미지가 업로드되는 Snapchat이나 Instagram과 같은 플랫폼의 경우 속도가 매우 중요한 요소가 됩니다.</li>
</ol>
<p>벡터 데이터베이스는 단순히 데이터 벡터만 저장하는 것이 아닙니다. 벡터 데이터베이스는 효율적인 데이터 구조를 사용하여 이러한 벡터를 색인화하여 빠르게 검색하고 CRUD(생성, 읽기, 업데이트, 삭제) 작업을 지원하는 역할도 담당합니다. 또한 벡터 데이터베이스는 일반적으로 스칼라 필드인 메타데이터 필드를 기반으로 필터링하는 속성 필터링도 이상적으로 지원해야 합니다. 간단한 예로 특정 브랜드의 이미지 벡터를 기반으로 유사한 신발을 검색하는 것을 들 수 있습니다. 여기서 브랜드는 필터링이 수행되는 기준이 되는 속성이 됩니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Bitmask_f72259b751.png" alt="figure 5" class="doc-image" id="figure-5" />
   </span> <span class="img-wrapper"> <span>그림 5</span> </span></p>
<p>위 그림은 곧 소개할 벡터 데이터베이스인 <a href="https://milvus.io/">Milvus가</a> 속성 필터링을 사용하는 방법을 보여줍니다. <a href="https://milvus.io/">Milvus는</a> 필터링 메커니즘에 비트마스크 개념을 도입하여 특정 속성 필터를 충족하는 것을 기준으로 비트마스크가 1인 유사한 벡터를 유지합니다. 이에 대한 자세한 내용은 <a href="https://zilliz.com/learn/attribute-filtering">여기에서</a> 확인하세요.</p>
<h2 id="Milvus--The-World’s-Most-Advanced-Vector-Database" class="common-anchor-header">Milvus - 세계에서 가장 진보된 벡터 데이터베이스<button data-href="#Milvus--The-World’s-Most-Advanced-Vector-Database" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://milvus.io/">Milvus는</a> 대규모 벡터 데이터와 머신 러닝 작업 간소화를 위해 특별히 구축된 오픈 소스 벡터 데이터베이스 관리 플랫폼입니다(MLOps).</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/milvus_Logo_ee3ae48b61.png" alt="figure 6" class="doc-image" id="figure-6" />
   </span> <span class="img-wrapper"> <span>그림 6</span> </span></p>
<p><a href="https://zilliz.com/">질리즈는</a> 차세대 데이터 패브릭 개발을 가속화하기 위해 세계에서 가장 진보된 벡터 데이터베이스인 <a href="https://milvus.io/">Milvus를</a> 구축한 조직입니다. Milvus는 현재 <a href="https://lfaidata.foundation/">LF AI &amp; Data Foundation의</a> 졸업 프로젝트이며, 저장 및 검색을 위한 대규모 비정형 데이터 세트 관리에 중점을 두고 있습니다. 이 플랫폼의 효율성과 안정성은 AI 모델과 MLOps를 대규모로 배포하는 프로세스를 간소화합니다. Milvus는 신약 개발, 컴퓨터 비전, 추천 시스템, 챗봇 등을 아우르는 광범위한 애플리케이션을 보유하고 있습니다.</p>
<h3 id="Key-Features-of-Milvus" class="common-anchor-header">Milvus의 주요 기능</h3><p>Milvus는 다음과 같은 유용한 기능으로 가득 차 있습니다:</p>
<ul>
<li><strong>1조 개에 달하는 벡터 데이터 세트에 대한 빠른 검색 속도:</strong> 1조 개의 벡터 데이터 세트에서 벡터 검색 및 검색의 평균 지연 시간이 밀리초 단위로 측정되었습니다.</li>
<li><strong>간소화된 비정형 데이터 관리:</strong> Milvus는 데이터 과학 워크플로우를 위해 설계된 풍부한 API를 제공합니다.</li>
<li><strong>항상 벡터 데이터베이스를 기반으로 하는 신뢰성:</strong> Milvus의 기본 제공 복제 및 페일오버/페일백 기능은 데이터와 애플리케이션이 항상 비즈니스 연속성을 유지할 수 있도록 보장합니다.</li>
<li><strong>뛰어난 확장성과 탄력성:</strong> 컴포넌트 수준의 확장성을 통해 필요에 따라 확장 및 축소가 가능합니다.</li>
<li><strong>하이브리드 검색:</strong> Milvus는 벡터 외에도 부울, 문자열, 정수, 부동 소수점 숫자 등과 같은 데이터 유형을 지원합니다. Milvus는 스칼라 필터링과 강력한 벡터 유사성 검색을 결합합니다(앞서 신발 유사성 예제에서 볼 수 있듯이).</li>
<li><strong>통합된 람다 구조:</strong> Milvus는 데이터 저장을 위해 스트림 처리와 배치 처리를 결합하여 적시성과 효율성의 균형을 맞춥니다.</li>
<li><strong><a href="https://milvus.io/docs/v2.0.x/timetravel_ref.md">시간 여행</a>:</strong> Milvus는 모든 데이터 삽입 및 삭제 작업에 대한 타임라인을 유지합니다. 사용자는 검색에서 타임스탬프를 지정하여 지정된 시점의 데이터 보기를 검색할 수 있습니다.</li>
<li><strong>커뮤니티 지원 및 업계 인정:</strong> 1,000명 이상의 기업 사용자, 10.5만 개 이상의 <a href="https://github.com/milvus-io/milvus">GitHub</a> 별점, 활발한 오픈 소스 커뮤니티를 통해 Milvus를 사용하는 여러분은 혼자가 아닙니다. Milvus는 <a href="https://lfaidata.foundation/">LF AI &amp; Data Foundation의</a> 대학원 프로젝트로서 제도적인 지원을 받고 있습니다.</li>
</ul>
<h3 id="Existing-Approaches-to-Vector-Data-Management-and-Search" class="common-anchor-header">벡터 데이터 관리 및 검색에 대한 기존 접근 방식</h3><p>벡터 유사도 검색으로 구동되는 AI 시스템을 구축하는 일반적인 방법은 ANNS(근사 최인접 이웃 검색)와 같은 알고리즘을 다음과 같은 오픈 소스 라이브러리와 결합하는 것입니다:</p>
<ul>
<li><strong><a href="https://ai.facebook.com/tools/faiss/">Facebook AI 유사도 검색(FAISS)</a>:</strong> 이 프레임워크는 고밀도 벡터의 효율적인 유사도 검색과 클러스터링을 가능하게 합니다. 여기에는 모든 크기의 벡터 세트에서 검색하는 알고리즘이 포함되어 있으며, RAM에 맞지 않을 수 있는 벡터까지 검색할 수 있습니다. 역 다중 인덱스 및 제품 정량화와 같은 인덱싱 기능을 지원합니다.</li>
<li><strong><a href="https://github.com/spotify/annoy">Spotify의 Annoy(가장 가까운 이웃 오 예)</a>:</strong> 이 프레임워크는 <a href="http://en.wikipedia.org/wiki/Locality-sensitive_hashing#Random_projection">무작위 투영을</a> 사용하고 트리를 구축하여 고밀도 벡터에 대해 대규모로 ANNS를 활성화합니다.</li>
<li><strong><a href="https://github.com/google-research/google-research/tree/master/scann">Google의 ScaNN(확장 가능한 가장 가까운 이웃)</a>:</strong> 이 프레임워크는 대규모로 효율적인 벡터 유사도 검색을 수행합니다. 최대 내부 제품 검색(MIPS)을 위한 검색 공간 가지치기 및 정량화를 포함하는 구현으로 구성됩니다.</li>
</ul>
<p>이러한 각 라이브러리는 나름대로 유용하지만, 몇 가지 한계로 인해 이러한 알고리즘-라이브러리 조합은 Milvus와 같은 본격적인 벡터 데이터 관리 시스템과 동등하지 않습니다. 지금부터 이러한 몇 가지 한계에 대해 살펴보겠습니다.</p>
<h3 id="Limitations-of-Existing-Approaches" class="common-anchor-header">기존 접근 방식의 한계</h3><p>이전 섹션에서 설명한 대로 벡터 데이터를 관리하는 데 사용되는 기존 접근 방식에는 다음과 같은 한계가 있습니다:</p>
<ol>
<li><strong>유연성:</strong> 기존 시스템은 일반적으로 모든 데이터를 메인 메모리에 저장하므로 여러 시스템에서 분산 모드로 쉽게 실행할 수 없으며 대규모 데이터 세트를 처리하는 데 적합하지 않습니다.</li>
<li><strong>동적 데이터 처리:</strong> 기존 시스템은 데이터를 정적인 것으로 간주하여 동적 데이터 처리를 복잡하게 하고 실시간에 가까운 검색을 불가능하게 하는 경우가 많습니다.</li>
<li><strong>고급 쿼리 처리:</strong> 대부분의 도구는 고급 필터링을 지원하는 실제 유사도 검색 엔진을 구축하는 데 필수적인 고급 쿼리 처리(예: 속성 필터링, 하이브리드 검색 및 다중 벡터 쿼리)를 지원하지 않습니다.</li>
<li><strong>이기종 컴퓨팅 최적화:</strong> CPU와 GPU 모두에서 이기종 시스템 아키텍처에 대한 최적화를 제공하는 플랫폼은 거의 없기 때문에(FAISS 제외) 효율성 손실로 이어집니다.</li>
</ol>
<p><a href="https://milvus.io/">Milvus는</a> 이러한 모든 한계를 극복하기 위해 노력하고 있으며, 다음 섹션에서 이에 대해 자세히 설명하겠습니다.</p>
<h3 id="The-Milvus-Advantage-Understanding-Knowhere" class="common-anchor-header">밀버스의 장점 - 노웨어에 대한 이해</h3><p><a href="https://milvus.io/">Milvus는</a> 비효율적인 벡터 데이터 관리와 유사도 검색 알고리즘을 기반으로 구축된 기존 시스템의 한계를 다음과 같은 방식으로 극복하고 성공적으로 해결하고자 합니다:</p>
<ul>
<li>다양한 애플리케이션 인터페이스(파이썬, 자바, Go, C++ 및 RESTful API의 SDK 포함)를 지원하여 유연성을 향상시킵니다.</li>
<li>여러 벡터 인덱스 유형(예: 양자화 기반 인덱스 및 그래프 기반 인덱스)과 고급 쿼리 처리를 지원합니다.</li>
<li>Milvus는 로그 구조 병합 트리(LSM 트리)를 사용하여 동적 벡터 데이터를 처리하여 데이터 삽입 및 삭제를 효율적으로 유지하고 실시간으로 검색을 수행합니다.</li>
<li>또한 Milvus는 최신 CPU 및 GPU의 이기종 컴퓨팅 아키텍처에 대한 최적화를 제공하여 개발자가 특정 시나리오, 데이터 세트 및 애플리케이션 환경에 맞게 시스템을 조정할 수 있습니다.</li>
</ul>
<p>Milvus의 벡터 실행 엔진인 Knowhere는 시스템의 상위 계층에 있는 서비스와 하위 계층에 있는 Faiss, Hnswlib, Annoy와 같은 벡터 유사성 검색 라이브러리에 액세스하기 위한 운영 인터페이스입니다. 또한 Knowhere는 이기종 컴퓨팅도 담당합니다. Knowhere는 인덱스 구축과 검색 요청을 실행할 하드웨어(예: CPU 또는 GPU)를 제어합니다. 이것이 바로 작업을 실행할 위치를 파악한다는 의미에서 Knowhere라는 이름이 붙여진 이유입니다. 향후 릴리즈에서는 DPU와 TPU를 포함한 더 많은 유형의 하드웨어가 지원될 예정입니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/knowhere_architecture_f1be3dbb1a.png" alt="figure 7" class="doc-image" id="figure-7" />
   </span> <span class="img-wrapper"> <span>그림 7</span> </span></p>
<p>Milvus의 연산은 주로 벡터와 스칼라 연산을 포함합니다. Knowhere는 Milvus에서 벡터에 대한 연산만 처리합니다. 위 그림은 Milvus의 Knowhere 아키텍처를 보여줍니다. 가장 아래쪽 계층은 시스템 하드웨어입니다. 타사 인덱스 라이브러리는 하드웨어 위에 있습니다. 그런 다음 Knowhere는 CGO를 통해 상단의 인덱스 노드 및 쿼리 노드와 상호 작용합니다. Knowhere는 Faiss의 기능을 더욱 확장할 뿐만 아니라 성능을 최적화하고 BitsetView 지원, 더 많은 유사성 메트릭 지원, AVX512 명령어 세트 지원, 자동 SIMD 명령어 선택 및 기타 성능 최적화를 비롯한 여러 가지 장점을 가지고 있습니다. 자세한 내용은 <a href="https://milvus.io/blog/deep-dive-8-knowhere.md">여기에서</a> 확인할 수 있습니다.</p>
<h3 id="Milvus-Architecture" class="common-anchor-header">Milvus 아키텍처</h3><p>다음 그림은 Milvus 플랫폼의 전체 아키텍처를 보여줍니다. Milvus는 데이터 흐름과 제어 흐름을 분리하고 확장성 및 재해 복구 측면에서 독립적인 4개의 계층으로 나뉩니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/milvus_architecture_ca80be5f96.png" alt="figure 8" class="doc-image" id="figure-8" />
   </span> <span class="img-wrapper"> <span>그림 8</span> </span></p>
<ul>
<li><strong>액세스 레이어:</strong> 액세스 계층은 상태 비저장 프록시 그룹으로 구성되며 시스템의 프론트 레이어이자 사용자에 대한 엔드포인트 역할을 합니다.</li>
<li><strong>코디네이터 서비스:</strong> 코디네이터 서비스는 클러스터 토폴로지 노드 관리, 로드 밸런싱, 타임스탬프 생성, 데이터 선언 및 데이터 관리를 담당합니다.</li>
<li><strong>워커 노드:</strong> 작업자 또는 실행 노드는 코디네이터 서비스에서 발행한 명령과 프록시에서 시작한 데이터 조작 언어(DML) 명령을 실행합니다. Milvus의 워커 노드는 <a href="https://hadoop.apache.org/">Hadoop의</a> 데이터 노드 또는 HBase의 리전 서버와 유사합니다.</li>
<li><strong>저장소:</strong> 데이터 지속성을 담당하는 Milvus의 초석입니다. 스토리지 계층은 <strong>메타 저장소</strong>, <strong>로그 브로커</strong>, <strong>객체 저장소로</strong> 구성됩니다.</li>
</ul>
<p>아키텍처에 대한 자세한 내용은 <a href="https://milvus.io/docs/v2.0.x/four_layers.md">여기에서</a> 확인하세요!</p>
<h2 id="Performing-visual-image-search-with-Milvus--A-use-case-blueprint" class="common-anchor-header">Milvus로 시각적 이미지 검색 수행 - 사용 사례 청사진<button data-href="#Performing-visual-image-search-with-Milvus--A-use-case-blueprint" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus와 같은 오픈 소스 벡터 데이터베이스를 사용하면 모든 비즈니스에서 최소한의 단계로 자체 시각적 이미지 검색 시스템을 만들 수 있습니다. 개발자는 사전 학습된 AI 모델을 사용하여 자체 이미지 데이터세트를 벡터로 변환한 다음 Milvus를 활용하여 이미지별로 유사한 제품을 검색할 수 있습니다. 이러한 시스템을 설계하고 구축하는 방법에 대한 다음 청사진을 살펴봅시다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Workflow_for_Visual_Image_Search_c490906a58.jpeg" alt="figure 9" class="doc-image" id="figure-9" />
   </span> <span class="img-wrapper"> <span>그림 9</span> </span></p>
<p>이 워크플로에서는 <a href="https://github.com/towhee-io/towhee">towhee와</a> 같은 오픈 소스 프레임워크를 사용하여 ResNet-50과 같은 사전 학습된 모델을 활용하고, 이미지에서 벡터를 추출하고, 이러한 벡터를 Milvus에 쉽게 저장 및 색인하고, 이미지 ID와 실제 사진의 매핑을 MySQL 데이터베이스에 저장할 수 있습니다. 데이터가 색인되면 새 이미지를 쉽게 업로드하고 Milvus를 사용하여 대규모로 이미지 검색을 수행할 수 있습니다. 다음 그림은 시각적 이미지 검색의 샘플을 보여줍니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Sample_Visual_Search_Example_52c6410dfd.png" alt="figure 10" class="doc-image" id="figure-10" />
   </span> <span class="img-wrapper"> <span>그림 10</span> </span></p>
<p>Milvus 덕분에 GitHub에서 오픈 소스화된 자세한 <a href="https://github.com/milvus-io/bootcamp/tree/master/solutions/reverse_image_search/quick_deploy">튜토리얼을</a> 확인해 보세요.</p>
<h2 id="Conclusion" class="common-anchor-header">결론<button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p>이 글에서는 꽤 많은 내용을 다루었습니다. 구조화되지 않은 데이터를 표현하고, 오픈 소스 벡터 데이터베이스인 Milvus를 사용하여 대규모로 벡터와 벡터 유사성 검색을 활용하는 문제부터 시작했습니다. Milvus의 구조와 이를 구동하는 핵심 구성 요소에 대한 자세한 설명과 실제 문제인 시각적 이미지 검색을 Milvus로 해결하는 방법에 대한 청사진에 대해 논의했습니다. 지금 바로 <a href="https://milvus.io/">Milvus를</a> 사용해 실제 문제를 해결해 보세요!</p>
<p>이 글이 마음에 드셨나요? 더 자세히 알아보거나 피드백을 주려면 <a href="https://www.linkedin.com/in/dipanzan/">저에게</a> 연락해 주세요!</p>
<h2 id="About-the-author" class="common-anchor-header">저자 소개<button data-href="#About-the-author" class="anchor-icon" translate="no">
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
    </button></h2><p>디판잔(DJ) 사르카는 데이터 과학 리드, Google 개발자 전문가 - 머신러닝, 저자, 컨설턴트, AI 어드바이저입니다. 연결: http://bit.ly/djs_linkedin</p>
