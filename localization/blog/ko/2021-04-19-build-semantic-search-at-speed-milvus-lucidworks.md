---
id: build-semantic-search-at-speed-milvus-lucidworks.md
title: 빠른 시맨틱 검색 구축
author: Elizabeth Edmiston
date: 2021-04-19T07:32:50.416Z
desc: 시맨틱 머신 러닝 방법론을 사용하여 조직 전체에서 보다 관련성 높은 검색 결과를 제공하는 방법에 대해 자세히 알아보세요.
cover: assets.zilliz.com/lucidworks_4753c98727.png
tag: Scenarios
canonicalUrl: 'https://zilliz.com/blog/build-semantic-search-at-speed-milvus-lucidworks'
---
<custom-h1>빠른 시맨틱 검색 구축</custom-h1><p><a href="https://lucidworks.com/post/what-is-semantic-search/">시맨틱 검색은</a> 고객이나 직원이 올바른 제품이나 정보를 찾을 수 있도록 도와주는 훌륭한 도구입니다. 심지어 색인화하기 어려운 정보를 드러내어 더 나은 결과를 얻을 수도 있습니다. 하지만 시맨틱 방법론이 빠르게 적용되지 않는다면 아무런 소용이 없습니다. 고객이나 직원은 시스템이 자신의 쿼리에 응답하는 데 시간이 걸리는 동안 수천 개의 다른 쿼리가 동시에 수집되고 있을 때 가만히 앉아 있지는 않을 것입니다.</p>
<p>어떻게 하면 시맨틱 검색을 빠르게 할 수 있을까요? 느린 시맨틱 검색은 효과가 없습니다.</p>
<p>다행히도 이러한 문제는 Lucidworks가 해결하고자 하는 문제입니다. 최근에 적당한 크기의 클러스터를 테스트한 결과(자세한 내용은 계속 읽어보세요), 100만 개가 넘는 문서 모음에 대해 1500 RPS(초당 요청 수)를 기록했으며, 평균 응답 시간은 약 40밀리초였습니다. 엄청난 속도입니다.</p>
<p><br/></p>
<h3 id="Implementing-Semantic-Search" class="common-anchor-header">시맨틱 검색 구현</h3><p>초고속 머신 러닝의 마법을 실현하기 위해 Lucidworks는 시맨틱 벡터 검색 방식을 사용해 시맨틱 검색을 구현했습니다. 두 가지 중요한 부분이 있습니다.</p>
<p><br/></p>
<h4 id="Part-One-The-Machine-Learning-Model" class="common-anchor-header">1부: 머신 러닝 모델</h4><p>먼저, 텍스트를 숫자 벡터로 인코딩하는 방법이 필요합니다. 텍스트는 제품 설명, 사용자 검색 쿼리, 질문 또는 질문에 대한 답변일 수 있습니다. 시맨틱 검색 모델은 다른 텍스트와 의미적으로 유사한 텍스트가 서로 수치적으로 "가까운" 벡터로 인코딩되도록 텍스트를 인코딩하도록 훈련됩니다. 이 인코딩 단계는 매초 수천 개 이상의 가능한 고객 검색 또는 사용자 쿼리를 지원하기 위해 빠르게 이루어져야 합니다.</p>
<p><br/></p>
<h4 id="Part-Two-The-Vector-Search-Engine" class="common-anchor-header">2부: 벡터 검색 엔진</h4><p>둘째, 고객 검색 또는 사용자 쿼리에 가장 적합한 것을 빠르게 찾을 수 있는 방법이 필요합니다. 모델은 해당 텍스트를 숫자 벡터로 인코딩했을 것입니다. 그런 다음 이를 카탈로그의 모든 숫자 벡터 또는 질문 및 답변 목록과 비교하여 가장 잘 일치하는 벡터, 즉 쿼리 벡터에 '가장 가까운' 벡터를 찾아야 합니다. 이를 위해서는 이러한 모든 정보를 빠른 속도로 효과적으로 처리할 수 있는 벡터 엔진이 필요합니다. 엔진에는 수백만 개의 벡터가 포함될 수 있으며, 쿼리와 가장 잘 일치하는 스무 개 정도의 벡터만 있으면 됩니다. 물론 매초마다 수천 개 정도의 쿼리를 처리해야 합니다.</p>
<p>이러한 문제를 해결하기 위해 저희는 <a href="https://lucidworks.com/post/enhance-personalization-efforts-with-new-features-in-fusion/">Fusion 5.3 릴리스에</a> 벡터 검색 엔진 <a href="https://doc.lucidworks.com/fusion/5.3/8821/milvus">Milvus를</a> 추가했습니다. Milvus는 오픈 소스 소프트웨어로 속도가 빠릅니다. Milvus는 Facebook이 자체 머신러닝 이니셔티브에 사용하는 것과 동일한 기술인 FAISS<a href="https://ai.facebook.com/tools/faiss/">(Facebook AI 유사성 검색</a>)를 사용합니다. 필요한 경우 <a href="https://en.wikipedia.org/wiki/Graphics_processing_unit">GPU에서</a> 더욱 빠르게 실행할 수 있습니다. 머신 러닝 구성 요소와 함께 Fusion 5.3 이상을 설치하면 Milvus가 해당 구성 요소의 일부로 자동으로 설치되므로 이러한 모든 기능을 쉽게 켤 수 있습니다.</p>
<p>컬렉션을 만들 때 지정된 컬렉션의 벡터 크기는 해당 벡터를 생성하는 모델에 따라 달라집니다. 예를 들어, 특정 컬렉션은 제품 카탈로그의 모든 제품 설명을 인코딩(모델을 통해)하여 생성된 벡터를 저장할 수 있습니다. Milvus와 같은 벡터 검색 엔진이 없었다면 전체 벡터 공간에서 유사도 검색을 수행할 수 없었을 것입니다. 따라서 유사도 검색은 벡터 공간에서 미리 선택된 후보(예: 500개)로 제한되어야 하며 성능도 느려지고 결과 품질도 떨어질 것입니다. Milvus는 여러 벡터 컬렉션에 걸쳐 수천억 개의 벡터를 저장할 수 있으므로 검색 속도가 빠르고 관련성 있는 결과를 얻을 수 있습니다.</p>
<p><br/></p>
<h3 id="Using-Semantic-Search" class="common-anchor-header">시맨틱 검색 사용</h3><p>이제 Milvus가 왜 중요한지 조금 알아보았으니 시맨틱 검색 워크플로로 돌아가 보겠습니다. 시맨틱 검색은 세 단계로 이루어집니다. 첫 번째 단계에서는 머신 러닝 모델이 로드 및/또는 학습됩니다. 그 후 데이터가 Milvus와 Solr로 색인됩니다. 마지막 단계는 실제 검색이 이루어지는 쿼리 단계입니다. 아래에서는 이 마지막 두 단계를 집중적으로 살펴보겠습니다.</p>
<p><br/></p>
<h3 id="Indexing-into-Milvus" class="common-anchor-header">Milvus로 인덱싱하기</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Lucidworks_1_47a9221723.png" alt="Lucidworks-1.png" class="doc-image" id="lucidworks-1.png" />
   </span> <span class="img-wrapper"> <span>Lucidworks-1.png</span> </span></p>
<p>위의 다이어그램에서 볼 수 있듯이 쿼리 단계는 문서 대신 쿼리가 들어온다는 점만 다를 뿐 색인 단계와 유사하게 시작됩니다. 각 쿼리에 대해:</p>
<ol>
<li>쿼리가 <a href="https://lucidworks.com/products/smart-answers/">스마트 답변</a> 인덱스 파이프라인으로 전송됩니다.</li>
<li>그런 다음 쿼리가 ML 모델로 전송됩니다.</li>
<li>ML 모델은 쿼리에서 암호화된 숫자 벡터를 반환합니다. 다시 말하지만 모델 유형에 따라 벡터의 크기가 결정됩니다.</li>
<li>이 벡터는 Milvus로 전송되어 지정된 Milvus 컬렉션에서 제공된 벡터와 가장 일치하는 벡터를 결정합니다.</li>
<li>Milvus는 4단계에서 결정된 벡터에 해당하는 고유 ID와 거리 목록을 반환합니다.</li>
<li>해당 ID와 거리가 포함된 쿼리가 Solr로 전송됩니다.</li>
<li>그러면 Solr은 해당 ID와 연관된 문서의 정렬된 목록을 반환합니다.</li>
</ol>
<p><br/></p>
<h3 id="Scale-Testing" class="common-anchor-header">규모 테스트</h3><p>시맨틱 검색 흐름이 고객에게 필요한 효율성으로 실행되고 있음을 증명하기 위해, Google Cloud Platform에서 8개의 ML 모델 복제본, 8개의 쿼리 서비스 복제본 및 단일 Milvus 인스턴스가 있는 Fusion 클러스터를 사용하여 Gatling 스크립트를 사용하여 규모 테스트를 실행했습니다. 테스트는 Milvus FLAT 및 HNSW 인덱스를 사용하여 실행되었습니다. FLAT 인덱스는 100%의 정확도를 갖지만 데이터 세트가 작은 경우를 제외하고는 효율성이 떨어집니다. HNSW(계층적 작은 세계 그래프) 인덱스는 여전히 높은 품질의 결과를 제공하며 더 큰 데이터 세트에서 성능이 향상되었습니다.</p>
<p>최근에 실행한 예제에서 몇 가지 수치를 살펴봅시다:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Lucidworks_2_3162113560.png" alt="Lucidworks-2.png" class="doc-image" id="lucidworks-2.png" />
   </span> <span class="img-wrapper"> <span>Lucidworks-2.png</span> </span></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Lucidworks_3_3dc17f0ed8.png" alt="Lucidworks-3.png" class="doc-image" id="lucidworks-3.png" />
   </span> <span class="img-wrapper"> <span>Lucidworks-3.png</span> </span></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Lucidworks_4_8a6edd2f59.png" alt="Lucidworks-4.png" class="doc-image" id="lucidworks-4.png" />
   </span> <span class="img-wrapper"> <span>Lucidworks-4.png</span> </span></p>
<p><br/></p>
<h3 id="Getting-Started" class="common-anchor-header">시작하기</h3><p><a href="https://lucidworks.com/products/smart-answers/">스마트 답변</a> 파이프라인은 사용하기 쉽도록 설계되었습니다. 루시드웍스에는 <a href="https://doc.lucidworks.com/how-to/734/set-up-a-pre-trained-cold-start-model-for-smart-answers">배포하기 쉽고</a> 일반적으로 좋은 결과를 제공하는 <a href="https://doc.lucidworks.com/how-to/734/set-up-a-pre-trained-cold-start-model-for-smart-answers">사전 훈련된 모델이</a> 있지만, 사전 훈련된 모델과 함께 자체 모델을 훈련하는 것이 가장 좋은 결과를 얻을 수 있습니다. 지금 바로 문의하여 이러한 이니셔티브를 검색 도구에 구현하여 보다 효과적이고 만족스러운 결과를 얻을 수 있는 방법을 알아보세요.</p>
<blockquote>
<p>이 블로그는 다음에서 다시 게시되었습니다: https://lucidworks.com/post/how-to-build-fast-semantic-search/?utm_campaign=Oktopost-Blog+Posts&amp;utm_medium=organic_social&amp;utm_source=linkedin</p>
</blockquote>
