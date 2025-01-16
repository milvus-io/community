---
id: ai-in-.md
title: 오픈 소스 벡터 데이터베이스인 Milvus를 통한 금융 분야의 AI 가속화
author: milvus
date: 2021-05-19T03:41:20.776Z
desc: 'Milvus는 챗봇, 추천 시스템 등 금융 업계를 위한 AI 애플리케이션을 구축하는 데 사용할 수 있습니다.'
cover: assets.zilliz.com/03_1_1e5aaf7dd1.jpg
tag: Scenarios
canonicalUrl: 'https://zilliz.com/blog/ai-in-finance'
---
<custom-h1>오픈 소스 벡터 데이터베이스인 Milvus를 통한 금융 분야의 AI 가속화</custom-h1><p>은행과 기타 금융 기관은 오랫동안 빅데이터 처리 및 분석을 위해 오픈 소스 소프트웨어를 얼리 어답터로 사용해 왔습니다. 2010년에 Morgan Stanley는 소규모 실험의 일환으로 오픈 소스 Apache Hadoop 프레임워크를 <a href="https://www.forbes.com/sites/tomgroenfeldt/2012/05/30/morgan-stanley-takes-on-big-data-with-hadoop/?sh=19f4f8cd16db">사용하기 시작했습니다</a>. 이 회사는 과학자들이 활용하고자 하는 방대한 양의 데이터에 맞춰 기존 데이터베이스를 성공적으로 확장하는 데 어려움을 겪고 있었기 때문에 대체 솔루션을 모색하기로 결정했습니다. 이제 Hadoop은 CRM 데이터 관리부터 포트폴리오 분석에 이르기까지 모든 것을 지원하는 Morgan Stanley의 필수 요소입니다. MySQL, MongoDB, PostgreSQL과 같은 다른 오픈 소스 관계형 데이터베이스 소프트웨어는 금융 업계에서 빅 데이터를 이해하는 데 없어서는 안 될 도구였습니다.</p>
<p>금융 서비스 업계에 경쟁력을 부여하는 것은 기술이며, 인공 지능(AI)은 은행, 자산 관리 및 보험 부문에서 빅데이터에서 가치 있는 인사이트를 추출하고 실시간으로 활동을 분석하는 표준 접근 방식으로 빠르게 자리 잡고 있습니다. AI 알고리즘을 사용해 이미지, 오디오, 비디오와 같은 비정형 데이터를 기계가 읽을 수 있는 숫자 데이터 형식인 벡터로 변환하면 수백만, 수십억, 조 단위의 방대한 벡터 데이터 세트에서 유사성 검색을 실행할 수 있습니다. 벡터 데이터는 고차원 공간에 저장되며, 유사도 검색을 통해 유사한 벡터를 찾는데, 이를 위해서는 벡터 데이터베이스라는 전용 인프라가 필요합니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/01_1_cb99f15886.jpg" alt="01 (1).jpg" class="doc-image" id="01-(1).jpg" />
   </span> <span class="img-wrapper"> <span>01 (1).jpg</span> </span></p>
<p><a href="https://github.com/milvus-io/milvus">Milvus는</a> 벡터 데이터 관리를 위해 특별히 구축된 오픈 소스 벡터 데이터베이스로, 엔지니어와 데이터 과학자는 기본 데이터 인프라 대신 AI 애플리케이션을 구축하거나 분석을 수행하는 데 집중할 수 있습니다. 이 플랫폼은 AI 애플리케이션 개발 워크플로우를 중심으로 구축되었으며 머신 러닝 작업(MLOps)을 간소화하도록 최적화되어 있습니다. Milvus와 그 기반 기술에 대한 자세한 내용은 <a href="https://zilliz.com/blog/Vector-Similarity-Search-Hides-in-Plain-View">블로그를</a> 참조하세요.</p>
<p>금융 서비스 업계에서 AI는 알고리즘 트레이딩, 포트폴리오 구성 및 최적화, 모델 검증, 백테스팅, 로보 어드바이징, 가상 고객 비서, 시장 영향 분석, 규제 준수, 스트레스 테스트 등 다양한 분야에 활용되고 있습니다. 이 글에서는 은행 및 금융 회사에서 벡터 데이터가 가장 가치 있는 자산 중 하나로 활용되는 세 가지 구체적인 분야를 다룹니다:</p>
<ol>
<li>뱅킹 챗봇을 통한 고객 경험 향상</li>
<li>추천 시스템을 통한 금융 서비스 판매 증대 등</li>
<li>시맨틱 텍스트 마이닝을 통한 수익 보고서 및 기타 비정형 금융 데이터 분석</li>
</ol>
<p><br/></p>
<h3 id="Enhancing-customer-experience-with-banking-chatbots" class="common-anchor-header">뱅킹 챗봇을 통한 고객 경험 향상</h3><p>뱅킹 챗봇은 소비자가 투자, 은행 상품, 보험을 선택할 수 있도록 도와 고객 경험을 개선할 수 있습니다. 디지털 서비스는 코로나 바이러스 팬데믹으로 인해 가속화되는 추세로 인해 인기가 급격히 상승하고 있습니다. 챗봇은 자연어 처리(NLP)를 사용하여 사용자가 제출한 질문을 시맨틱 벡터로 변환하여 일치하는 답변을 검색하는 방식으로 작동합니다. 최신 뱅킹 챗봇은 사용자에게 개인화된 자연스러운 경험을 제공하며 대화하는 듯한 어조로 대화합니다. Milvus는 실시간 벡터 유사도 검색을 사용하여 챗봇을 만드는 데 적합한 데이터 패브릭을 제공합니다.</p>
<p><a href="https://zilliz.com/blog/building-intelligent-chatbot-with-nlp-and-milvus">Milvus로 챗봇을</a> 구축하는 방법을 다룬 데모에서 자세히 알아보세요.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/02_1_8c298c45e5.jpg" alt="02 (1).jpg" class="doc-image" id="02-(1).jpg" />
   </span> <span class="img-wrapper"> <span>02 (1).jpg</span> </span></p>
<p><br/></p>
<h4 id="Boosting-financial-services-sales-and-more-with-recommender-systems" class="common-anchor-header">추천 시스템으로 금융 서비스 판매 증대 등:</h4><p>프라이빗 뱅킹 부문에서는 고객 프로필에 기반한 개인화된 추천을 통해 금융 상품 판매를 늘리기 위해 추천 시스템을 사용합니다. 추천 시스템은 금융 리서치, 비즈니스 뉴스, 주식 선택, 거래 지원 시스템에도 활용될 수 있습니다. 딥러닝 모델 덕분에 모든 사용자와 항목은 임베딩 벡터로 설명됩니다. 벡터 데이터베이스는 사용자와 항목 간의 유사성을 계산할 수 있는 임베딩 공간을 제공합니다.</p>
<p>Milvus를 사용한 그래프 기반 추천 시스템을 다루는 <a href="https://zilliz.com/blog/graph-based-recommendation-system-with-milvus">데모에서</a> 자세히 알아보세요.</p>
<p><br/></p>
<h4 id="Analyzing-earnings-reports-and-other-unstructured-financial-data-with-semantic-text-mining" class="common-anchor-header">시맨틱 텍스트 마이닝으로 수익 보고서 및 기타 비정형 재무 데이터 분석하기:</h4><p>텍스트 마이닝 기술은 금융 산업에 상당한 영향을 미쳤습니다. 금융 데이터가 기하급수적으로 증가함에 따라 텍스트 마이닝은 금융 분야에서 중요한 연구 분야로 부상했습니다.</p>
<p>현재 딥러닝 모델은 다양한 의미적 측면을 포착할 수 있는 단어 벡터를 통해 재무 보고서를 표현하는 데 적용됩니다. Milvus와 같은 벡터 데이터베이스는 수백만 개의 보고서에서 방대한 시맨틱 단어 벡터를 저장한 다음, 밀리초 내에 유사성 검색을 수행할 수 있습니다.</p>
<p><a href="https://medium.com/deepset-ai/semantic-search-with-milvus-knowledge-graph-qa-web-crawlers-and-more-837451eae9fa">Milvus와 함께 딥셋의 헤이스택을 사용하는</a> 방법에 대해 자세히 알아보세요.</p>
<p><br/></p>
<h3 id="Don’t-be-a-stranger" class="common-anchor-header">낯선 사람이 되지 마세요</h3><ul>
<li><a href="https://github.com/milvus-io/milvus/">GitHub에서</a> Milvus를 찾거나 기여하세요.</li>
<li><a href="https://join.slack.com/t/milvusio/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ">Slack을</a> 통해 커뮤니티와 소통하세요.</li>
<li><a href="https://twitter.com/milvusio">트위터에서</a> 소통하세요.</li>
</ul>
