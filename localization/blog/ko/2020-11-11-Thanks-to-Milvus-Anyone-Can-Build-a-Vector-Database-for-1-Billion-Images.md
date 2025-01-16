---
id: Thanks-to-Milvus-Anyone-Can-Build-a-Vector-Database-for-1-Billion-Images.md
title: Milvus 덕분에 누구나 10억 개 이상의 이미지를 위한 벡터 데이터베이스를 구축할 수 있습니다.
author: milvus
date: 2020-11-11T07:13:02.135Z
desc: >-
  AI와 오픈소스 소프트웨어를 사용하면 단 한 대의 서버와 10줄의 코드만으로 역방향 이미지 검색 엔진을 구축할 수 있습니다. 오픈 소스 벡터
  데이터 관리 플랫폼인 Milvus로 10억 개 이상의 이미지를 실시간으로 검색하세요.
cover: assets.zilliz.com/build_search_9299109ca7.jpg
tag: Scenarios
canonicalUrl: >-
  https://zilliz.com/blog/Thanks-to-Milvus-Anyone-Can-Build-a-Vector-Database-for-1-Billion-Images
---
<custom-h1>Milvus 덕분에 누구나 10억 개 이상의 이미지를 위한 벡터 데이터베이스를 구축할 수 있습니다.</custom-h1><p>컴퓨팅 성능이 향상되고 컴퓨팅 비용이 감소하면서 머신 스케일 분석과 인공 지능(AI)에 대한 접근성이 그 어느 때보다 높아졌습니다. 실제로는 단 하나의 서버와 10줄의 코드만으로 10억 개 이상의 이미지를 실시간으로 쿼리할 수 있는 역방향 이미지 검색 엔진을 구축할 수 있습니다. 이 문서에서는 오픈 소스 벡터 데이터 관리 플랫폼인 <a href="https://milvus.io/">Milvus를</a> 사용하여 비정형 데이터 처리 및 분석을 위한 강력한 시스템을 구축하는 방법과 이 모든 것을 가능하게 하는 기반 기술에 대해 설명합니다.</p>
<p><strong>이동하기:</strong></p>
<ul>
<li><a href="#thanks-to-milvus-anyone-can-build-a-vector-database-for-1-billion-images">Milvus 덕분에 누구나 10억 개 이상의 이미지를 위한 벡터 데이터베이스를 구축할 수 있습니다.</a><ul>
<li><a href="#how-does-ai-enable-unstructured-data-analytics">AI는 어떻게 비정형 데이터 분석을 가능하게 하나요?</a></li>
<li><a href="#neural-networks-convert-unstructured-data-into-computer-friendly-feature-vectors">신경망은 비정형 데이터를 컴퓨터 친화적인 특징 벡터로 변환</a> - <a href="#ai-algorithms-convert-unstructured-data-to-vectors"><em>AI 알고리즘은 비정형 데이터를 벡터로 변환합니다</em></a>.</li>
<li><a href="#what-are-vector-data-management-platforms">벡터 데이터 관리 플랫폼이란 무엇인가요?</a></li>
<li><a href="#what-are-limitations-of-existing-approaches-to-vector-data-management">벡터 데이터 관리에 대한 기존 접근 방식의 한계는 무엇인가요?</a> - <a href="#an-overview-of-milvus-architecture"><em>Milvus의 아키텍처 개요</em></a></li>
<li><a href="#what-are-applications-for-vector-data-management-platforms-and-vector-similarity-search">벡터 데이터 관리 플랫폼과 벡터 유사도 검색을 위한 애플리케이션은 무엇인가요?</a></li>
<li><a href="#reverse-image-search">이미지 역방향 검색</a> - <a href="#googles-search-by-image-feature"><em>Google의 '이미지로 검색' 기능</em></a><ul>
<li><a href="#video-recommendation-systems">동영상 추천 시스템</a></li>
<li><a href="#natural-language-processing-nlp">자연어 처리(NLP)</a></li>
</ul></li>
<li><a href="#learn-more-about-milvus">Milvus에 대해 자세히 알아보기</a></li>
</ul></li>
</ul>
<h3 id="How-does-AI-enable-unstructured-data-analytics" class="common-anchor-header">AI는 어떻게 비정형 데이터 분석을 가능하게 하나요?</h3><p>자주 인용되는 통계에 따르면 전 세계 데이터의 80%가 비정형 데이터이지만 분석되는 데이터는 1%에 불과합니다. 이미지, 비디오, 오디오, 자연어 등 비정형 데이터는 미리 정의된 모델이나 조직 방식을 따르지 않습니다. 따라서 대용량 비정형 데이터 세트의 처리와 분석이 어렵습니다. 스마트폰과 기타 연결된 디바이스의 확산으로 인해 비정형 데이터 생산이 새로운 차원으로 발전함에 따라, 기업들은 이러한 모호한 정보에서 도출된 인사이트가 얼마나 중요한지 점점 더 많이 인식하고 있습니다.</p>
<p>수십 년 동안 컴퓨터 과학자들은 특정 데이터 유형을 정리, 검색, 분석하기 위해 맞춤화된 인덱싱 알고리즘을 개발해 왔습니다. 정형 데이터의 경우 비트맵, 해시 테이블, B-tree가 있으며, 이는 Oracle이나 IBM과 같은 거대 기술 회사에서 개발한 관계형 데이터베이스에서 일반적으로 사용됩니다. 반정형 데이터의 경우, 반전 인덱싱 알고리즘이 표준이며 <a href="http://www.solrtutorial.com/basic-solr-concepts.html">Solr</a> 및 <a href="https://www.elastic.co/blog/found-elasticsearch-from-the-bottom-up#inverted-indexes-and-index-terms">ElasticSearch와</a> 같은 인기 있는 검색 엔진에서 찾을 수 있습니다. 그러나 비정형 데이터 색인 알고리즘은 지난 10년 동안에야 널리 보급되기 시작한 컴퓨팅 집약적인 인공 지능에 의존합니다.</p>
<h3 id="Neural-networks-convert-unstructured-data-into-computer-friendly-feature-vectors" class="common-anchor-header">신경망은 비정형 데이터를 컴퓨터 친화적인 특징 벡터로 변환합니다.</h3><p>신경망(예: <a href="https://en.wikipedia.org/wiki/Convolutional_neural_network">CNN</a>, <a href="https://en.wikipedia.org/wiki/Recurrent_neural_network">RNN</a>, <a href="https://towardsdatascience.com/bert-explained-state-of-the-art-language-model-for-nlp-f8b21a9b6270">BERT</a>)을 사용하면 비정형 데이터를 정수 또는 부동 소수점의 문자열인 특징 벡터(일명 임베딩)로 변환할 수 있습니다. 이 숫자 데이터 형식은 기계가 훨씬 더 쉽게 처리하고 분석할 수 있습니다. 비정형 데이터를 특징 벡터에 임베딩한 다음 유클리드 거리 또는 코사인 유사도와 같은 측정값을 사용해 벡터 간의 유사도를 계산함으로써 역 이미지 검색, 비디오 검색, 자연어 처리(NLP) 등을 아우르는 애플리케이션을 구축할 수 있습니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_Thanks_to_AI_Anyone_Can_Build_a_Search_Engine_for_1_Billion_Images_2_db8c16aea4.jpeg" alt="Blog_Thanks to AI, Anyone Can Build a Search Engine for 1+ Billion Images_2.jpeg" class="doc-image" id="blog_thanks-to-ai,-anyone-can-build-a-search-engine-for-1+-billion-images_2.jpeg" />
   </span> <span class="img-wrapper"> <span>블로그_AI 덕분에 누구나 10억 개 이상의 이미지에 대한 검색 엔진을 구축할 수 있습니다_2.jpeg</span> </span></p>
<p>벡터 유사도 계산은 확립된 알고리즘에 의존하는 비교적 간단한 프로세스입니다. 그러나 비정형 데이터 세트는 특징 벡터로 변환된 후에도 일반적으로 기존의 정형 및 반정형 데이터 세트보다 몇 배나 더 큽니다. 벡터 유사도 검색은 대규모 비정형 데이터를 효율적이고 정확하게 쿼리하는 데 필요한 엄청난 저장 공간과 컴퓨팅 파워로 인해 복잡합니다. 그러나 어느 정도의 정확도를 희생할 수 있다면, 차원이 높은 대규모 데이터 세트의 쿼리 효율성을 크게 향상시킬 수 있는 다양한 근사 근사 이웃(ANN) 검색 알고리즘이 있습니다. 이러한 ANN 알고리즘은 유사한 벡터를 함께 클러스터링하여 스토리지 요구 사항과 계산 부하를 줄임으로써 벡터 검색 속도를 높입니다. 일반적으로 사용되는 알고리즘에는 트리 기반, 그래프 기반, 결합된 ANN이 있습니다.</p>
<h3 id="What-are-vector-data-management-platforms" class="common-anchor-header">벡터 데이터 관리 플랫폼이란 무엇인가요?</h3><p>벡터 데이터 관리 플랫폼은 대규모 벡터 데이터 세트를 저장, 처리, 분석하기 위해 특별히 제작된 애플리케이션입니다. 이러한 도구는 대량의 데이터와 쉽게 인터페이스할 수 있도록 설계되었으며, 벡터 데이터 관리를 간소화하는 기능을 포함하고 있습니다. 안타깝게도 현대의 빅데이터 문제를 해결할 수 있을 만큼 유연하고 강력한 시스템은 거의 존재하지 않습니다. <a href="https://zilliz.com/">Zilliz에서</a> 시작하여 2019년에 오픈 소스 라이선스로 출시된 벡터 데이터 관리 플랫폼인 Milvus는 이러한 공백을 메우려고 시도합니다.</p>
<h3 id="What-are-limitations-of-existing-approaches-to-vector-data-management" class="common-anchor-header">벡터 데이터 관리에 대한 기존 접근 방식의 한계는 무엇인가요?</h3><p>비정형 데이터 분석 시스템을 구축하는 일반적인 방법은 ANN과 같은 알고리즘을 Facebook AI 유사도 검색(Faiss)과 같은 오픈 소스 구현 라이브러리와 결합하는 것입니다. 몇 가지 한계로 인해 이러한 알고리즘-라이브러리 조합은 Milvus와 같은 본격적인 벡터 데이터 관리 시스템과 동등하지 않습니다. 벡터 데이터를 관리하는 데 사용되는 기존 기술은 다음과 같은 문제에 직면해 있습니다:</p>
<ol>
<li><strong>유연성:</strong> 기존 시스템은 기본적으로 모든 데이터를 메인 메모리에 저장하기 때문에 여러 컴퓨터에서 실행할 수 없고 대규모 데이터 세트를 처리하는 데 적합하지 않습니다.</li>
<li><strong>동적 데이터 처리:</strong> 데이터는 기존 시스템에 입력되면 정적인 것으로 간주되어 동적 데이터의 처리가 복잡해지고 실시간에 가까운 검색이 불가능해지는 경우가 많습니다.</li>
<li><strong>고급 쿼리 처리:</strong> 대부분의 도구는 유용한 유사도 검색 엔진을 구축하는 데 필수적인 고급 쿼리 처리(예: 속성 필터링 및 다중 벡터 쿼리)를 지원하지 않습니다.</li>
<li><strong>이기종 컴퓨팅 최적화:</strong> CPU와 GPU 모두에서 이기종 시스템 아키텍처에 대한 최적화를 제공하는 플랫폼은 거의 없기 때문에(Faiss 제외) 효율성 손실로 이어질 수 있습니다.</li>
</ol>
<p>Milvus는 이러한 모든 한계를 극복하고자 합니다. 이 시스템은 다양한 애플리케이션 인터페이스(Python, Java, Go, C++ 및 RESTful API의 SDK 포함), 여러 벡터 인덱스 유형(예: 양자화 기반 인덱스 및 그래프 기반 인덱스), 고급 쿼리 처리 등을 지원하여 유연성을 향상시킵니다. Milvus는 로그 구조 병합 트리(LSM 트리)를 사용해 동적 벡터 데이터를 처리하므로 데이터 삽입과 삭제가 효율적이고 검색이 실시간으로 원활하게 이루어집니다. 또한 Milvus는 최신 CPU 및 GPU의 이기종 컴퓨팅 아키텍처에 대한 최적화 기능을 제공하여 개발자가 특정 시나리오, 데이터 세트 및 애플리케이션 환경에 맞게 시스템을 조정할 수 있습니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_Thanks_to_AI_Anyone_Can_Build_a_Search_Engine_for_1_Billion_Images_3_380e31d32c.png" alt="Blog_Thanks to AI, Anyone Can Build a Search Engine for 1+ Billion Images_3.png" class="doc-image" id="blog_thanks-to-ai,-anyone-can-build-a-search-engine-for-1+-billion-images_3.png" />
   </span> <span class="img-wrapper"> <span>블로그_AI 덕분에 누구나 10억 개 이상의 이미지에 대한 검색 엔진을 구축할 수 있습니다_3.png</span> </span></p>
<p>Milvus는 다양한 ANN 인덱싱 기술을 사용하여 99%의 상위 5위 리콜률을 달성할 수 있습니다. 또한 이 시스템은 분당 100만 개 이상의 데이터 항목을 로드할 수 있습니다. 그 결과 10억 개의 이미지에 대한 역방향 이미지 검색을 실행할 때 쿼리 시간이 1초도 걸리지 않습니다. 여러 노드에 배포된 분산 시스템으로 작동할 수 있는 클라우드 네이티브 애플리케이션인 Milvus는 100억 개 또는 1000억 개의 이미지가 포함된 데이터 세트에서도 비슷한 성능을 쉽고 안정적으로 달성할 수 있습니다. 또한 이 시스템은 이미지 데이터에만 국한되지 않고 컴퓨터 비전, 대화형 AI, 추천 시스템, 신약 개발 등 다양한 분야에 적용될 수 있습니다.</p>
<h3 id="What-are-applications-for-vector-data-management-platforms-and-vector-similarity-search" class="common-anchor-header">벡터 데이터 관리 플랫폼과 벡터 유사도 검색을 위한 애플리케이션은 무엇인가요?</h3><p>위에서 설명한 바와 같이, Milvus와 같은 유능한 벡터 데이터 관리 플랫폼과 근사 최인접 알고리즘을 결합하면 방대한 양의 비정형 데이터에서 유사도 검색을 수행할 수 있습니다. 이 기술은 다양한 분야에 걸친 애플리케이션을 개발하는 데 사용할 수 있습니다. 아래에서는 벡터 데이터 관리 도구와 벡터 유사도 검색에 대한 몇 가지 일반적인 사용 사례를 간략하게 설명합니다.</p>
<h3 id="Reverse-image-search" class="common-anchor-header">역 이미지 검색</h3><p>Google과 같은 주요 검색 엔진은 이미 사용자에게 이미지로 검색할 수 있는 옵션을 제공합니다. 또한, 이커머스 플랫폼은 이 기능이 온라인 쇼핑객에게 제공하는 이점을 깨닫고 이미지 검색 기능을 스마트폰 애플리케이션에 통합했습니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_Thanks_to_AI_Anyone_Can_Build_a_Search_Engine_for_1_Billion_Images_4_7884aabcd8.png" alt="Blog_Thanks to AI, Anyone Can Build a Search Engine for 1+ Billion Images_4.png" class="doc-image" id="blog_thanks-to-ai,-anyone-can-build-a-search-engine-for-1+-billion-images_4.png" />
   </span> <span class="img-wrapper"> <span>블로그_AI 덕분에 누구나 10억 개 이상의 이미지에 대한 검색 엔진을 구축할 수 있습니다_4.png</span> </span></p>
<p>Milvus와 같은 오픈 소스 소프트웨어를 사용하면 모든 기업이 자체적인 역방향 이미지 검색 시스템을 만들 수 있어 점점 더 수요가 증가하고 있는 이 기능의 진입 장벽을 낮출 수 있습니다. 개발자는 사전 학습된 AI 모델을 사용하여 자체 이미지 데이터 세트를 벡터로 변환한 다음 Milvus를 활용하여 이미지별로 유사한 제품을 검색할 수 있습니다.</p>
<h4 id="Video-recommendation-systems" class="common-anchor-header">동영상 추천 시스템</h4><p><a href="https://www.tubefilter.com/2019/05/07/number-hours-video-uploaded-to-youtube-per-minute/">매분 500시간 분량의 사용자 제작 콘텐츠가</a> 수신되는 YouTube와 같은 주요 온라인 동영상 플랫폼은 콘텐츠 추천에 있어 특별한 요구 사항을 제시합니다. 새로운 업로드를 고려한 관련성 높은 실시간 추천을 제공하기 위해 동영상 추천 시스템은 빠른 쿼리 시간과 효율적인 동적 데이터 처리 기능을 제공해야 합니다. 키 프레임을 벡터로 변환한 다음 그 결과를 Milvus에 제공하면 수십억 개의 동영상을 거의 실시간으로 검색하고 추천할 수 있습니다.</p>
<h4 id="Natural-language-processing-NLP" class="common-anchor-header">자연어 처리(NLP)</h4><p>자연어 처리는 인간의 언어를 해석할 수 있는 시스템을 구축하는 것을 목표로 하는 인공 지능의 한 분야입니다. 텍스트 데이터를 벡터로 변환한 후 Milvus를 사용하여 중복된 텍스트를 빠르게 식별 및 제거하고, 시맨틱 검색을 강화하거나 <a href="https://medium.com/unstructured-data-service/how-artificial-intelligence-empowered-professional-writing-f433c7e5b561%22%20/">지능형 글쓰기 도우미를 구축할</a> 수 있습니다. 효과적인 벡터 데이터 관리 플랫폼은 모든 NLP 시스템의 활용도를 극대화하는 데 도움이 됩니다.</p>
<h3 id="Learn-more-about-Milvus" class="common-anchor-header">Milvus에 대해 자세히 알아보기</h3><p>Milvus에 대해 자세히 알아보려면 <a href="https://milvus.io/">웹사이트를</a> 방문하세요. 또한, <a href="https://github.com/milvus-io/bootcamp">부트캠프에서는</a> Milvus 설정, 벤치마크 테스트, 다양한 애플리케이션 구축에 대한 지침이 포함된 여러 튜토리얼을 제공합니다. 벡터 데이터 관리, 인공 지능, 빅데이터 과제에 관심이 있으시다면 <a href="https://github.com/milvus-io">GitHub의</a> 오픈 소스 커뮤니티에 가입하고 <a href="https://join.slack.com/t/milvusio/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ">Slack에서</a> 채팅해 주세요.</p>
<p>이미지 검색 시스템 구축에 대해 더 자세히 알고 싶으신가요? 이 사례 연구를 확인하세요:</p>
<ul>
<li><a href="https://medium.com/vector-database/the-journey-to-optimize-billion-scale-image-search-part-1-a270c519246d">수십억 건 규모의 이미지 검색 최적화를 위한 여정(1/2)</a></li>
<li><a href="https://medium.com/unstructured-data-service/the-journey-to-optimizing-billion-scale-image-search-2-2-572a36d5d0d">수십억 개의 이미지 검색을 최적화하기 위한 여정 (2/2)</a></li>
</ul>
