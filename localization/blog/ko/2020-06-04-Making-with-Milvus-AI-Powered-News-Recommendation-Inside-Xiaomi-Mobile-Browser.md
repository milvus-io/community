---
id: >-
  Making-with-Milvus-AI-Powered-News-Recommendation-Inside-Xiaomi-Mobile-Browser.md
title: 밀버스의 AI 기반 뉴스 추천 기능으로 제작하는 샤오미의 모바일 브라우저
author: milvus
date: 2020-06-04T02:30:34.750Z
desc: >-
  Xiaomi가 AI와 Milvus를 활용하여 모바일 웹 브라우저 사용자에게 가장 관련성 높은 콘텐츠를 찾을 수 있는 지능형 뉴스 추천
  시스템을 구축한 방법을 알아보세요.
cover: assets.zilliz.com/blog_Sohu_News_dec53d0814.jpg
tag: Scenarios
canonicalUrl: >-
  https://zilliz.com/blog/Making-with-Milvus-AI-Powered-News-Recommendation-Inside-Xiaomi-Mobile-Browser
---
<custom-h1>Milvus로 만들기: Xiaomi 모바일 브라우저의 AI 기반 뉴스 추천 기능</custom-h1><p>소셜 미디어 피드부터 Spotify의 재생 목록 추천에 이르기까지, <a href="https://zilliz.com/blog/Vector-Similarity-Search-Hides-in-Plain-View">인공지능은</a> 이미 우리가 매일 보고 상호작용하는 콘텐츠에서 중요한 역할을 하고 있습니다. 다국적 전자제품 제조업체인 샤오미는 모바일 웹 브라우저를 차별화하기 위해 AI 기반 뉴스 추천 엔진을 구축했습니다. 유사성 검색과 인공지능을 위해 특별히 구축된 오픈소스 벡터 데이터베이스인 <a href="https://milvus.io/">Milvus가</a> 애플리케이션의 핵심 데이터 관리 플랫폼으로 사용되었습니다. 이 문서에서는 Xiaomi가 AI 기반 뉴스 추천 엔진을 구축한 방법과 Milvus 및 기타 AI 알고리즘을 사용한 방법에 대해 설명합니다.</p>
<p><br/></p>
<h3 id="Using-AI-to-suggest-personalized-content-and-cut-through-news-noise" class="common-anchor-header">AI를 사용하여 개인화된 콘텐츠를 제안하고 뉴스 노이즈 차단하기</h3><p>뉴욕 타임즈만 해도 매일 <a href="https://www.theatlantic.com/technology/archive/2016/05/how-many-stories-do-newspapers-publish-per-day/483845/">230개</a> 이상의 콘텐츠를 게시하기 때문에 생산되는 기사의 양이 방대하여 개인이 모든 뉴스를 종합적으로 파악하는 것은 불가능합니다. 방대한 양의 콘텐츠를 선별하고 가장 관련성이 높거나 흥미로운 기사를 추천하기 위해 점점 더 많은 사람들이 AI에 의존하고 있습니다. 추천 기능은 아직 완벽하지는 않지만, 점점 더 복잡하고 상호 연결된 세상에서 끊임없이 쏟아져 나오는 새로운 정보를 선별하기 위해 머신 러닝의 필요성은 점점 더 커지고 있습니다.</p>
<p>Xiaomi는 스마트폰, 모바일 앱, 노트북, 가전제품 등 다양한 제품을 만들고 투자하고 있습니다. 매 분기 4천만 대 이상의 스마트폰에 사전 설치되어 판매되는 모바일 브라우저를 차별화하기 위해 샤오미는 뉴스 추천 시스템을 구축했습니다. 사용자가 샤오미의 모바일 브라우저를 실행하면 인공 지능이 사용자의 검색 기록, 관심사 등을 기반으로 유사한 콘텐츠를 추천하는 데 사용됩니다. 밀버스는 관련 기사 검색을 가속화하는 데 사용되는 오픈 소스 벡터 유사도 검색 데이터베이스입니다.</p>
<p><br/></p>
<h3 id="How-does-AI-powered-content-recommendation-work" class="common-anchor-header">AI 기반 콘텐츠 추천은 어떻게 작동하나요?</h3><p>뉴스 추천(또는 다른 유형의 콘텐츠 추천 시스템)의 핵심은 입력 데이터를 방대한 데이터베이스와 비교하여 유사한 정보를 찾는 것입니다. 성공적인 콘텐츠 추천을 위해서는 관련성과 시의성 간의 균형을 맞추고, 대량의 새로운 데이터를 효율적으로 통합해야 하며, 종종 실시간으로 통합해야 합니다.</p>
<p>대규모 데이터 세트를 수용하기 위해 추천 시스템은 일반적으로 두 단계로 나뉩니다:</p>
<ol>
<li><strong>검색</strong>: 검색 단계에서는 사용자의 관심사와 행동에 따라 광범위한 라이브러리에서 콘텐츠의 범위를 좁힙니다. Xiaomi의 모바일 브라우저에서는 수백만 개의 뉴스 기사가 포함된 방대한 데이터 세트에서 수천 개의 콘텐츠가 선택됩니다.</li>
<li><strong>정렬</strong>: 다음으로, 검색 중에 선택된 콘텐츠는 특정 지표에 따라 정렬된 후 사용자에게 푸시됩니다. 사용자가 추천 콘텐츠에 참여하면 시스템은 실시간으로 적응하여 보다 관련성 높은 추천을 제공합니다.</li>
</ol>
<p>뉴스 콘텐츠 추천은 사용자 행동과 최근에 게시된 콘텐츠를 기반으로 실시간으로 이루어져야 합니다. 또한 추천 콘텐츠는 사용자의 관심사 및 검색 의도와 최대한 일치해야 합니다.</p>
<p><br/></p>
<h3 id="Milvus-+-BERT--intelligent-content-suggestions" class="common-anchor-header">Milvus + BERT = 지능형 콘텐츠 추천</h3><p>Milvus는 오픈 소스 벡터 유사도 검색 데이터베이스로, 딥 러닝 모델과 통합하여 자연어 처리, 신원 확인 등 다양한 애플리케이션을 구동할 수 있습니다. Milvus는 대규모 벡터 데이터세트를 색인화하여 검색 효율을 높이고, 머신러닝 애플리케이션 개발 프로세스를 간소화하기 위해 널리 사용되는 다양한 AI 프레임워크를 지원합니다. 이러한 특성 덕분에 이 플랫폼은 많은 머신 러닝 애플리케이션의 핵심 구성 요소인 벡터 데이터를 저장하고 쿼리하는 데 이상적입니다.</p>
<p>Xiaomi는 빠르고 안정적이며 최소한의 구성과 유지보수가 필요하기 때문에 지능형 뉴스 추천 시스템의 벡터 데이터를 관리하기 위해 Milvus를 선택했습니다. 하지만 배포 가능한 애플리케이션을 구축하려면 Milvus를 AI 알고리즘과 함께 사용해야 합니다. Xiaomi는 추천 엔진의 언어 표현 모델로 양방향 인코더 표현 트랜스포머의 줄임말인 BERT를 선택했습니다. BERT는 다양한 NLP(자연어 처리) 작업을 구동할 수 있는 일반 NLU(자연어 이해) 모델로 사용할 수 있습니다. 주요 기능은 다음과 같습니다:</p>
<ul>
<li>BERT의 트랜스포머는 알고리즘의 기본 프레임워크로 사용되며 문장 내 및 문장 간의 명시적, 암시적 관계를 포착할 수 있습니다.</li>
<li>다중 작업 학습 목표, 마스크된 언어 모델링(MLM), 다음 문장 예측(NSP).</li>
<li>BERT는 데이터 양이 많을수록 성능이 향상되며, 변환 매트릭스 역할을 함으로써 Word2Vec과 같은 다른 자연어 처리 기술을 향상시킬 수 있습니다.</li>
</ul>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_Xiaomi_1_6301344312.jpeg" alt="Blog_Xiaomi_1.jpeg" class="doc-image" id="blog_xiaomi_1.jpeg" />
   </span> <span class="img-wrapper"> <span>Blog_Xiaomi_1.jpeg</span> </span></p>
<p><br/></p>
<p>BERT의 네트워크 아키텍처는 기존의 RNN과 CNN 신경망을 버린 다층 트랜스포머 구조를 사용합니다. 주의 메커니즘을 통해 어떤 위치에 있는 두 단어 사이의 거리를 하나로 변환하는 방식으로 작동하며, 한동안 NLP에서 지속되어 온 의존성 문제를 해결합니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_Xiaomi_2_fe5cf2e401.jpeg" alt="Blog-Xiaomi-2.jpeg" class="doc-image" id="blog-xiaomi-2.jpeg" />
   </span> <span class="img-wrapper"> <span>블로그-샤오미-2.jpeg</span> </span></p>
<p><br/></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_Xiaomi_3_5d10b51440.jpeg" alt="Blog-Xiaomi-3.jpeg" class="doc-image" id="blog-xiaomi-3.jpeg" />
   </span> <span class="img-wrapper"> <span>블로그-샤오미-3.jpeg</span> </span></p>
<p><br/></p>
<p>BERT는 간단한 모델과 복잡한 모델을 제공합니다. 해당 하이퍼파라미터는 다음과 같습니다: BERT BASE: L = 12, H = 768, A = 12, 총 파라미터 110M; BERT LARGE: L = 24, H = 1024, A = 16, 총 파라미터 수는 340M입니다.</p>
<p>위의 하이퍼파라미터에서 L은 네트워크의 레이어 수(즉, 트랜스포머 블록 수)를 나타내고, A는 멀티 헤드 어텐션의 자체 어텐션 수를 나타내며, 필터 크기는 4H입니다.</p>
<p><br/></p>
<h3 id="Xiaomi’s-content-recommendation-system" class="common-anchor-header">샤오미의 콘텐츠 추천 시스템</h3><p>샤오미의 브라우저 기반 뉴스 추천 시스템은 벡터화, ID 매핑, 근사 근접 이웃(ANN) 서비스의 세 가지 주요 구성 요소에 의존합니다.</p>
<p>벡터화는 기사 제목을 일반 문장 벡터로 변환하는 프로세스입니다. Xiaomi의 추천 시스템에는 BERT를 기반으로 하는 SimBert 모델이 사용됩니다. SimBert는 숨겨진 크기가 768인 12층 모델입니다. Simbert는 지속적인 학습(학습 작업은 "메트릭 학습 +UniLM")을 위해 학습 모델 중국어 L-12_H-768_A-12를 사용하며, Adam 옵티마이저로 시그널 TITAN RTX에서 117만 걸음을 학습했습니다(학습 속도 2e-6, 배치 크기 128). 간단히 말해, 이것은 최적화된 BERT 모델입니다.</p>
<p>ANN 알고리즘은 벡터화된 기사 제목을 Milvus에 저장된 전체 뉴스 라이브러리와 비교한 다음 사용자에게 유사한 콘텐츠를 반환합니다. ID 매핑은 해당 기사의 페이지 조회수 및 클릭 수와 같은 관련 정보를 얻는 데 사용됩니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_Xiaomi_N1_f4749b3131.jpeg" alt="Blog-Xiaomi-N1.jpeg" class="doc-image" id="blog-xiaomi-n1.jpeg" />
   </span> <span class="img-wrapper"> <span>블로그-샤오미-N1.jpeg</span> </span></p>
<p><br/></p>
<p>Xiaomi의 뉴스 추천 엔진을 구동하는 Milvus에 저장된 데이터는 추가 기사 및 활동 정보를 포함하여 지속적으로 업데이트되고 있습니다. 시스템에 새로운 데이터가 통합되면 오래된 데이터는 반드시 제거되어야 합니다. 이 시스템에서는 첫 T-1일 동안 전체 데이터 업데이트가 이루어지고 이후 T-1일 동안 증분 업데이트가 이루어집니다.</p>
<p>정의된 간격에 따라 오래된 데이터는 삭제되고 T-1일 동안 처리된 데이터가 컬렉션에 삽입됩니다. 여기서 새로 생성된 데이터는 실시간으로 통합됩니다. 새 데이터가 삽입되면 밀버스에서 유사성 검색이 수행됩니다. 검색된 기사는 다시 클릭률 및 기타 요소에 따라 정렬되고 상위 콘텐츠가 사용자에게 표시됩니다. 이처럼 데이터가 자주 업데이트되고 실시간으로 결과를 제공해야 하는 시나리오에서는 새로운 데이터를 빠르게 통합하고 검색할 수 있는 Milvus의 기능을 통해 Xiaomi의 모바일 브라우저에서 뉴스 콘텐츠 추천 속도를 크게 높일 수 있습니다.</p>
<p><br/></p>
<h3 id="Milvus-makes-vector-similarity-search-better" class="common-anchor-header">Milvus는 벡터 유사도 검색을 개선합니다.</h3><p>데이터를 벡터화한 다음 벡터 간의 유사도를 계산하는 것은 가장 일반적으로 사용되는 검색 기술입니다. ANN 기반 벡터 유사도 검색 엔진의 등장으로 벡터 유사도 계산의 효율성이 크게 향상되었습니다. 유사 솔루션에 비해 Milvus는 최적화된 데이터 스토리지, 풍부한 SDK, 검색 레이어 구축의 작업 부하를 크게 줄여주는 분산 버전을 제공합니다. 또한 Milvus의 활발한 오픈 소스 커뮤니티는 질문에 답하고 문제 발생 시 문제를 해결하는 데 도움을 줄 수 있는 강력한 리소스입니다.</p>
<p>벡터 유사도 검색과 Milvus에 대해 자세히 알아보려면 다음 리소스를 확인하세요:</p>
<ul>
<li>Github에서 <a href="https://github.com/milvus-io/milvus">Milvus를</a> 확인하세요.</li>
<li><a href="https://zilliz.com/blog/Vector-Similarity-Search-Hides-in-Plain-View">일반 보기에 숨어 있는 벡터 유사도 검색</a></li>
<li><a href="https://zilliz.com/blog/Accelerating-Similarity-Search-on-Really-Big-Data-with-Vector-Indexing">벡터 인덱싱으로 실제 빅데이터에서 유사도 검색 가속화하기</a></li>
</ul>
<p>다른 <a href="https://zilliz.com/user-stories">사용자 사례를</a> 읽고 Milvus로 무엇을 만드는지 자세히 알아보세요.</p>
