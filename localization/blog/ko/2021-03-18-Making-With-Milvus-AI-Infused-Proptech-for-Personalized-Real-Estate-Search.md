---
id: Making-With-Milvus-AI-Infused-Proptech-for-Personalized-Real-Estate-Search.md
title: 개인화된 부동산 검색을 위한 밀버스 AI 기반 프롭테크 제작
author: milvus
date: 2021-03-18T03:53:54.736Z
desc: 'AI가 부동산 업계를 변화시키고 있는 지금, 지능형 프롭테크가 어떻게 주택 검색 및 구매 프로세스를 가속화하는지 알아보세요.'
cover: assets.zilliz.com/blog_realistate_search_da4e8ee01d.jpg
tag: Scenarios
canonicalUrl: >-
  https://zilliz.com/blog/Making-With-Milvus-AI-Infused-Proptech-for-Personalized-Real-Estate-Search
---
<custom-h1>밀버스로 만들기: 개인 맞춤형 부동산 검색을 위한 AI 기반 프롭테크</custom-h1><p>인공지능(AI)은 부동산 검색 프로세스를 혁신하는 <a href="https://medium.com/unstructured-data-service/the-easiest-way-to-search-among-1-billion-image-vectors-d6faf72e361f#d62b">강력한 애플리케이션을</a> 보유하고 있습니다. 기술에 정통한 부동산 전문가들은 고객이 적합한 집을 더 빨리 찾고 부동산 구매 과정을 간소화할 수 있도록 돕는 AI의 능력을 인식하고 수년 동안 AI를 활용해 왔습니다. 코로나바이러스 팬데믹으로 인해 전 세계적으로 부동산 기술(또는 프롭테크)에 대한 관심, 도입, 투자가 <a href="https://www.pwc.com/ca/en/industries/real-estate/emerging-trends-in-real-estate-2021/shifting-landscape-proptech.html">가속화되면서</a> 앞으로 부동산 업계에서 AI의 역할이 점점 더 커질 것으로 예상됩니다.</p>
<p>이 도움말에서는 <a href="https://bj.ke.com/">Beike가</a> 벡터 유사도 검색을 사용하여 개인화된 결과를 제공하고 거의 실시간으로 숙소를 추천하는 주택 찾기 플랫폼을 구축한 방법을 살펴봅니다.</p>
<h3 id="What-is-vector-similarity-search" class="common-anchor-header">벡터 유사도 검색이란 무엇인가요?</h3><p>벡터 유사도<a href="https://medium.com/unstructured-data-service/vector-similarity-search-hides-in-plain-view-654f8152f8ab">검색은</a> 다양한 인공 지능, 딥 러닝 및 기존 벡터 계산 시나리오에 걸쳐 응용되고 있습니다. AI 기술의 확산은 부분적으로는 이미지, 비디오, 오디오, 행동 데이터, 문서 등을 포함하는 비정형 데이터를 이해하는 벡터 검색의 능력에 기인합니다.</p>
<p>비정형 데이터는 전체 데이터의 약 80~90%를 차지하며, 끊임없이 변화하는 세상에서 경쟁력을 유지하고자 하는 기업에게 인사이트를 추출하는 것은 이제 필수 요건이 되고 있습니다. 비정형 데이터 분석에 대한 수요 증가, 컴퓨팅 성능 향상, 컴퓨팅 비용 감소로 인해 AI 기반 벡터 검색은 그 어느 때보다 더 쉽게 접근할 수 있게 되었습니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/beike_blog_img1_2dc95cac08.jpg" alt="beike-blog-img1.jpg" class="doc-image" id="beike-blog-img1.jpg" />
   </span> <span class="img-wrapper"> <span>beike-blog-img1.jpg</span> </span></p>
<p>전통적으로 비정형 데이터는 미리 정의된 모델이나 조직 구조를 따르지 않기 때문에 대규모로 처리하고 분석하는 데 어려움이 있었습니다. 신경망(예: CNN, RNN, BERT)을 사용하면 비정형 데이터를 컴퓨터가 쉽게 해석할 수 있는 수치 데이터 형식인 특징 벡터로 변환할 수 있습니다. 그런 다음 알고리즘을 사용해 코사인 유사도나 유클리드 거리와 같은 메트릭을 사용해 벡터 간의 유사도를 계산합니다.</p>
<p>궁극적으로 벡터 유사도 검색은 방대한 데이터 세트에서 유사한 것을 식별하는 기술을 설명하는 광범위한 용어입니다. Beike는 이 기술을 사용하여 개별 사용자의 선호도, 검색 기록, 부동산 기준에 따라 자동으로 매물을 추천하는 지능형 주택 검색 엔진을 구동함으로써 부동산 검색 및 구매 프로세스를 가속화합니다. Milvus는 정보를 알고리즘과 연결하는 오픈 소스 벡터 데이터베이스로, Beike가 AI 부동산 플랫폼을 개발하고 관리할 수 있게 해줍니다.</p>
<p><br/></p>
<h3 id="How-does-Milvus-manage-vector-data" class="common-anchor-header">Milvus는 벡터 데이터를 어떻게 관리하나요?</h3><p>Milvus는 대규모 벡터 데이터 관리를 위해 특별히 구축되었으며, 이미지 및 동영상 검색, 화학적 유사성 분석, 개인화된 추천 시스템, 대화형 AI 등 다양한 애플리케이션을 보유하고 있습니다. Milvus에 저장된 벡터 데이터 세트는 효율적으로 쿼리할 수 있으며, 대부분의 구현은 이러한 일반적인 프로세스를 따릅니다:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/beike_blog_img2_d5abb58f95.jpg" alt="beike-blog-img2.jpg" class="doc-image" id="beike-blog-img2.jpg" />
   </span> <span class="img-wrapper"> <span>beike-blog-img2.jpg</span> </span></p>
<p><br/></p>
<h3 id="How-does-Beike-use-Milvus-to-make-house-hunting-smarter" class="common-anchor-header">Beike는 Milvus를 사용하여 어떻게 더 스마트하게 집을 구할 수 있을까요?</h3><p>흔히 중국의 Zillow라고 불리는 Beike는 부동산 중개인이 임대 또는 판매용 부동산을 등록할 수 있는 온라인 플랫폼입니다. 집을 찾는 사람들의 주택 검색 경험을 개선하고 에이전트가 더 빨리 거래를 성사시킬 수 있도록 돕기 위해 이 회사는 매물 데이터베이스를 위한 AI 기반 검색 엔진을 구축했습니다. Beike의 부동산 매물 데이터베이스는 특징 벡터로 변환된 후 인덱싱 및 저장을 위해 Milvus에 공급되었습니다. 그런 다음 Milvus는 입력 목록, 검색 기준, 사용자 프로필 또는 기타 기준에 따라 유사성 검색을 수행하는 데 사용됩니다.</p>
<p>예를 들어, 특정 매물과 유사한 더 많은 집을 검색할 때 평면도, 크기, 방향, 인테리어 마감재, 페인트 색상 등의 특징이 추출됩니다. 매물 목록 데이터의 원본 데이터베이스가 <a href="https://medium.com/unstructured-data-service/how-to-choose-an-index-in-milvus-4f3d15259212">색인화되어</a> 있기 때문에 단 몇 밀리초 만에 검색을 수행할 수 있습니다. Beike의 최종 결과물은 3백만 개 이상의 벡터가 포함된 데이터 세트에서 평균 113밀리초의 쿼리 시간을 기록했습니다. 하지만 밀버스는 조 단위의 데이터 세트에서도 효율적인 속도를 유지할 수 있어 비교적 작은 규모의 부동산 데이터베이스를 가볍게 처리할 수 있습니다. 일반적으로 시스템은 다음과 같은 프로세스를 따릅니다:</p>
<ol>
<li><p>딥 러닝 모델(예: CNN, RNN, BERT)이 비정형 데이터를 특징 벡터로 변환한 다음, 이를 Milvus로 가져옵니다.</p></li>
<li><p>Milvus는 특징 벡터를 저장하고 인덱싱합니다.</p></li>
<li><p>Milvus는 사용자 쿼리를 기반으로 유사도 검색 결과를 반환합니다.</p></li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/milvus_overview_diagram_d17cda0e47.png" alt="milvus-overview-diagram.png" class="doc-image" id="milvus-overview-diagram.png" />
   </span> <span class="img-wrapper"> <span>밀버스 개요 다이어그램.png</span> </span></p>
<p><br/></p>
<p>Beike의 지능형 부동산 검색 플랫폼은 코사인 거리를 사용하여 벡터 유사도를 계산하는 추천 알고리즘으로 구동됩니다. 이 시스템은 즐겨찾기 목록과 검색 기준에 따라 비슷한 집을 찾습니다. 크게 보면 다음과 같이 작동합니다:</p>
<ol>
<li><p>입력 목록을 기반으로 평면도, 크기, 방향 등의 특성을 사용해 4개의 특징 벡터 컬렉션을 추출합니다.</p></li>
<li><p>추출된 특징 컬렉션은 Milvus에서 유사도 검색을 수행하는 데 사용됩니다. 각 벡터 컬렉션에 대한 쿼리 결과는 입력 목록과 다른 유사한 목록 간의 유사성을 측정한 값입니다.</p></li>
<li><p>4개의 벡터 컬렉션 각각에서 나온 검색 결과를 비교한 후 유사한 주택을 추천하는 데 사용됩니다.</p></li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/beike_intelligent_house_platform_diagram_6e278da118.jpg" alt="beike-intelligent-house-platform-diagram.jpg" class="doc-image" id="beike-intelligent-house-platform-diagram.jpg" />
   </span> <span class="img-wrapper"> <span>beike-intelligent-house-platform-diagram.jpg</span> </span></p>
<p><br/></p>
<p>위 그림에서 볼 수 있듯이 시스템은 데이터 업데이트를 위해 A/B 테이블 전환 메커니즘을 구현합니다. Milvus는 처음 T일 동안의 데이터를 A 테이블에 저장하고, T+1일에는 B 테이블에 데이터를 저장하기 시작하며, 2T+1일에는 A 테이블을 다시 쓰기 시작하는 식으로 데이터를 업데이트합니다.</p>
<p><br/></p>
<h3 id="To-learn-more-about-making-things-with-Milvus-check-out-the-following-resources" class="common-anchor-header">Milvus로 무언가를 만드는 방법에 대해 자세히 알아보려면 다음 리소스를 확인하세요:</h3><ul>
<li><p><a href="https://zilliz.com/blog/Building-an-AI-Powered-Writing-Assistant-with-WPS-Office">WPS Office용 AI 기반 글쓰기 도우미 구축하기</a></p></li>
<li><p><a href="https://zilliz.com/blog/Making-with-Milvus-AI-Powered-News-Recommendation-Inside-Xiaomi-Mobile-Browser">Milvus로 만들기: Xiaomi의 모바일 브라우저에서 AI 기반 뉴스 추천하기</a></p></li>
</ul>
