---
id: dna-sequence-classification-based-on-milvus.md
title: 밀버스 기반 DNA 서열 분류
author: Jael Gu
date: 2021-09-06T06:02:27.431Z
desc: >-
  오픈 소스 벡터 데이터베이스인 Milvus를 사용해 DNA 염기서열의 유전자군을 인식하세요. 공간은 더 적게 차지하지만 정확도는 더
  높습니다.
cover: assets.zilliz.com/11111_5d089adf08.png
tag: Scenarios
canonicalUrl: 'https://zilliz.com/blog/dna-sequence-classification-based-on-milvus'
---
<custom-h1>밀버스에 기반한 DNA 서열 분류</custom-h1><blockquote>
<p>저자: 질리즈의 데이터 엔지니어인 구멍지아는 맥길 대학교에서 정보학 석사 학위를 받았습니다. 그녀의 관심 분야는 AI 애플리케이션과 벡터 데이터베이스를 이용한 유사도 검색입니다. 오픈소스 프로젝트 Milvus의 커뮤니티 멤버로서 추천 시스템, DNA 서열 분류 모델 등 다양한 솔루션을 제공하고 개선해 왔습니다. 그녀는 도전을 즐기고 절대 포기하지 않습니다!</p>
</blockquote>
<custom-h1>소개</custom-h1><p>DNA 염기서열은 유전자 추적, 종 식별, 질병 진단 등 학술 연구와 실제 응용 분야에서 널리 사용되는 개념입니다. 모든 산업에서 보다 지능적이고 효율적인 연구 방법을 갈망하는 가운데, 특히 생물학 및 의학 분야에서 인공지능은 많은 주목을 받고 있습니다. 점점 더 많은 과학자와 연구자들이 생물정보학에서 머신러닝과 딥러닝에 기여하고 있습니다. 실험 결과를 보다 설득력 있게 만들기 위해 샘플 크기를 늘리는 것이 일반적인 방법 중 하나입니다. 유전체학 분야에서도 빅데이터와의 협업은 현실에서 더 많은 활용 가능성을 제공합니다. 하지만 기존의 염기서열 정렬에는 한계가 있어 <a href="https://www.frontiersin.org/articles/10.3389/fbioe.2020.01032/full#h5">대용량 데이터에는 적합하지</a> 않습니다. 현실적으로 절충점을 찾기 위해 대규모 DNA 서열 데이터 세트에는 벡터화가 좋은 선택입니다.</p>
<p>오픈 소스 벡터 데이터베이스인 <a href="https://milvus.io/docs/v2.0.x/overview.md">Milvus는</a> 대용량 데이터에 적합합니다. 핵산 서열의 벡터를 저장하고 고효율 검색을 수행할 수 있습니다. 또한 생산 또는 연구 비용을 절감하는 데 도움이 될 수 있습니다. Milvus를 기반으로 한 DNA 서열 분류 시스템은 유전자 분류를 수행하는 데 밀리초 밖에 걸리지 않습니다. 또한 머신 러닝의 다른 일반적인 분류기보다 높은 정확도를 보여줍니다.</p>
<custom-h1>데이터 처리</custom-h1><p>유전 정보를 암호화하는 유전자는 4개의 뉴클레오티드 염기[A, C, G, T]로 구성된 DNA 염기서열의 작은 부분으로 구성됩니다. 인간 게놈에는 약 30,000개의 유전자, 약 30억 개의 DNA 염기쌍이 있으며 각 염기쌍에는 2개의 대응하는 염기가 있습니다. 다양한 용도를 지원하기 위해 DNA 서열은 여러 범주로 분류할 수 있습니다. 긴 DNA 염기서열의 데이터를 보다 쉽게 활용하고 비용을 절감하기 위해 데이터 전처리에 <a href="https://en.wikipedia.org/wiki/K-mer#:~:text=Usually%2C%20the%20term%20k%2Dmer,total%20possible%20k%2Dmers%2C%20where">k-mer를 </a>도입했습니다. 이를 통해 DNA 염기서열 데이터를 일반 텍스트와 더 유사하게 만들 수 있습니다. 또한 벡터화된 데이터는 데이터 분석이나 머신 러닝에서 계산 속도를 높일 수 있습니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_a7469e9eac.png" alt="1.png" class="doc-image" id="1.png" />
   </span> <span class="img-wrapper"> <span>1.png</span> </span></p>
<p><strong>k-mer</strong></p>
<p>k-mer 방법은 일반적으로 DNA 서열 전처리에 사용됩니다. 이 방법은 원래 서열의 각 염기부터 시작하여 길이 k의 작은 부분을 추출하여 길이 s의 긴 서열을 (s-k+1) 길이 k의 짧은 서열로 변환합니다. k 값을 조정하면 모델 성능이 향상됩니다. 짧은 시퀀스 목록은 데이터 읽기, 특징 추출 및 벡터화에 더 쉽습니다.</p>
<p><strong>벡터화</strong></p>
<p>DNA 서열은 텍스트 형태로 벡터화됩니다. k-mer로 변환된 서열은 짧은 서열 목록이 되며, 이는 문장의 개별 단어 목록처럼 보입니다. 따라서 대부분의 자연어 처리 모델은 DNA 서열 데이터에서도 작동해야 합니다. 모델 훈련, 특징 추출, 인코딩에도 유사한 방법론을 적용할 수 있습니다. 각 모델마다 고유한 장단점이 있기 때문에 데이터의 특징과 연구 목적에 따라 모델을 선택해야 합니다. 예를 들어, Bag-of-Words 모델인 CountVectorizer는 간단한 토큰화를 통해 특징 추출을 구현합니다. 이 모델은 데이터 길이에 제한을 두지 않지만, 유사도 비교 측면에서 반환되는 결과가 명확하지 않습니다.</p>
<custom-h1>Milvus 데모</custom-h1><p>Milvus는 비정형 데이터를 쉽게 관리하고 수조 개의 벡터 중에서 가장 유사한 결과를 평균 밀리초 이내에 불러올 수 있습니다. 유사도 검색은 근사 최인접 이웃(ANN) 검색 알고리즘을 기반으로 합니다. 이러한 특징 덕분에 Milvus는 DNA 서열의 벡터를 관리할 수 있는 훌륭한 옵션이 되어 생물정보학의 개발과 응용을 촉진합니다.</p>
<p>다음은 Milvus로 DNA 서열 분류 시스템을 구축하는 방법을 보여주는 데모입니다. <a href="https://www.kaggle.com/nageshsingh/dna-sequence-dataset">실험 데이터 세트에는 </a>3개의 생물체와 7개의 유전자 계열이 포함되어 있습니다. 모든 데이터는 k-mers에 의해 짧은 염기서열 목록으로 변환됩니다. 그런 다음 시스템은 사전 훈련된 CountVectorizer 모델을 사용해 시퀀스 데이터를 벡터로 인코딩합니다. 아래 순서도는 시스템 구조와 삽입 및 검색 프로세스를 보여줍니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_ebd89660f6.png" alt="1.png" class="doc-image" id="1.png" />
   </span> <span class="img-wrapper"> <span>1.png</span> </span></p>
<p><a href="https://github.com/milvus-io/bootcamp/tree/master/solutions/dna_sequence_classification">Milvus 부트캠프에서</a> 이 데모를 사용해 보세요.</p>
<p>Milvus에서는 시스템이 컬렉션을 생성하고 해당 DNA 시퀀스 벡터를 컬렉션(또는 파티션이 활성화된 경우 파티션)에 삽입합니다. 쿼리 요청을 받으면 Milvus는 입력 DNA 서열의 벡터와 데이터베이스에서 가장 유사한 결과 사이의 거리를 반환합니다. 입력 시퀀스의 클래스와 DNA 시퀀스 간의 유사성은 결과의 벡터 거리로 결정할 수 있습니다.</p>
<pre><code translate="no"><span class="hljs-comment"># Insert vectors to Milvus collection (partition &quot;human&quot;)</span>
DNA_human = collection.insert([human_ids, human_vectors], partition_name=<span class="hljs-string">&#x27;human&#x27;</span>)
<span class="hljs-comment"># Search topK results (in partition &quot;human&quot;) for test vectors</span>
res = collection.search(test_vectors, <span class="hljs-string">&quot;vector_field&quot;</span>, search_params, limit=topK, partition_names=[<span class="hljs-string">&#x27;human&#x27;</span>])
<span class="hljs-keyword">for</span> results <span class="hljs-keyword">in</span> res:
    res_ids = results.ids <span class="hljs-comment"># primary keys of topK results</span>
    res_distances = results.distances <span class="hljs-comment"># distances between topK results &amp; search input</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>DNA 서열 분류</strong>Milvus에서 가장 유사한 DNA 서열을 검색하면 알 수 없는 샘플의 유전자 계열을 암시하여 가능한 기능에 대해 알아볼 수 있습니다.<a href="https://www.nature.com/scitable/topicpage/gpcr-14047471/"> 염기서열이 GPCR로 분류되면 신체 기능에 영향을 미칠 가능성이 높습니다. </a>이 데모에서 Milvus는 시스템이 검색된 인간 DNA 서열의 유전자 계열을 식별하는 데 성공했습니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_1616da5bb0.png" alt="3.png" class="doc-image" id="3.png" />
   </span> <span class="img-wrapper"> <span>3.png</span> </span> <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/4_d719b22fc7.png" alt="4.png" class="doc-image" id="4.png" /><span>4.png</span> </span></p>
<p><strong>유전자 유사성</strong></p>
<p>유기체 간의 평균 DNA 서열 유사성은 게놈이 얼마나 가까운지를 보여줍니다. 이 데모는 인간 데이터에서 침팬지 및 개와 가장 유사한 DNA 서열을 각각 검색합니다. 그런 다음 평균 내적 곱 거리(침팬지 0.97, 개 0.70)를 계산하고 비교하여 침팬지가 개보다 인간과 더 유사한 유전자를 공유한다는 것을 증명합니다. 보다 복잡한 데이터와 시스템 설계를 통해 Milvus는 더 높은 수준의 유전자 연구를 지원할 수 있습니다.</p>
<pre><code translate="no">search_params = {<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;IP&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;nprobe&quot;</span>: <span class="hljs-number">20</span>}}
<button class="copy-code-btn"></button></code></pre>
<p><strong>성능</strong></p>
<p>이 데모는 80%의 인간 샘플 데이터(총 3629개)로 분류 모델을 훈련하고 나머지는 테스트 데이터로 사용합니다. Milvus를 사용한 DNA 서열 분류 모델과 Mysql 및 5개의 인기 있는 머신 러닝 분류기 기반 모델의 성능을 비교합니다. Milvus를 기반으로 한 모델이 정확도 면에서 다른 모델을 능가합니다.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> sklearn.<span class="hljs-property">model_selection</span> <span class="hljs-keyword">import</span> train_test_split
X, y = human_sequence_kmers, human_labels
X_train, X_test, y_train, y_test = <span class="hljs-title function_">train_test_split</span>(X, y, test_size=<span class="hljs-number">0.2</span>, random_state=<span class="hljs-number">42</span>)
<button class="copy-code-btn"></button></code></pre>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_6541a7dec6.png" alt="1.png" class="doc-image" id="1.png" />
   </span> <span class="img-wrapper"> <span>1.png</span> </span></p>
<custom-h1>추가 탐색</custom-h1><p>빅데이터 기술의 발달로 DNA 염기서열의 벡터화는 유전자 연구와 실무에서 더욱 중요한 역할을 하게 될 것입니다. 생물 정보학에 대한 전문 지식과 결합하여 관련 연구는 DNA 서열 벡터화의 개입을 통해 더 많은 이점을 얻을 수 있습니다. 따라서 Milvus는 실제로 더 나은 결과를 제공할 수 있습니다. 다양한 시나리오와 사용자 요구에 따라 Milvus 기반 유사도 검색 및 거리 계산은 큰 잠재력과 많은 가능성을 보여줍니다.</p>
<ul>
<li><strong>미지의 서열을 연구하세요</strong>: <a href="https://iopscience.iop.org/article/10.1088/1742-6596/1453/1/012071/pdf">일부 연구자들에 따르면, 벡터화는 DNA 서열 데이터를 압축할 수 있다고 합니다.</a> 동시에 알려지지 않은 DNA 서열의 구조, 기능 및 진화를 연구하는 데 더 적은 노력이 필요합니다. Milvus는 정확성을 잃지 않고 엄청난 수의 DNA 서열 벡터를 저장하고 검색할 수 있습니다.</li>
<li><strong>장치 적응</strong>: 기존 서열 정렬 알고리즘의 한계로 인해 유사도 검색은 디바이스<a href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7884812/">(</a><a href="https://mjeer.journals.ekb.eg/article_146090.html">CPU/GPU</a>) 개선의 이점을 거의 누릴 수 없습니다. 일반 CPU 연산과 GPU 가속을 모두 지원하는 Milvus는 근사 최인접 알고리즘으로 이 문제를 해결합니다.</li>
<li><strong>바이러스 탐지 및 출처 추적</strong>: <a href="https://www.nature.com/articles/s41586-020-2012-7?fbclid=IwAR2hxnXb9nLWgA8xexEoNrCNH8WHqvHhhbN38aSm48AaH6fTzGMB1BLljf4">과학자들은 게놈 서열을 비교한 결과 박쥐에서 유래한 것으로 추정되는 코로나19 바이러스가 SARS-COV에 속한다고 보고했습니다</a>. 이 결론을 바탕으로 연구자들은 더 많은 증거와 패턴을 찾기 위해 샘플 크기를 확장할 수 있습니다.</li>
<li><strong>질병 진단</strong>: 임상적으로 의사는 환자와 건강한 그룹 간의 DNA 서열을 비교하여 질병을 유발하는 변종 유전자를 식별할 수 있습니다. 적절한 알고리즘을 사용해 특징을 추출하고 이러한 데이터를 인코딩할 수 있습니다. 밀버스는 질병 데이터와 관련될 수 있는 벡터 간의 거리를 반환할 수 있습니다. 이 애플리케이션은 질병 진단을 지원할 뿐만 아니라 <a href="https://www.frontiersin.org/articles/10.3389/fgene.2021.680117/full">표적 치료</a> 연구에 영감을 줄 수 있습니다.</li>
</ul>
<custom-h1>Milvus에 대해 자세히 알아보기</custom-h1><p>Milvus는 방대한 인공 지능 및 벡터 유사성 검색 애플리케이션을 지원할 수 있는 강력한 도구입니다. 이 프로젝트에 대해 자세히 알아보려면 다음 리소스를 확인하세요:</p>
<ul>
<li><a href="https://milvus.io/blog">블로그</a> 읽기.</li>
<li><a href="https://milvusio.slack.com/join/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ#/shared-invite/email">Slack의</a> 오픈 소스 커뮤니티와 교류하세요.</li>
<li><a href="https://github.com/milvus-io/milvus/">GitHub에서</a> 세계에서 가장 인기 있는 벡터 데이터베이스를 사용하거나 기여하세요.</li>
<li>새로운 <a href="https://github.com/milvus-io/bootcamp">부트캠프를</a> 통해 AI 애플리케이션을 빠르게 테스트하고 배포하세요.</li>
</ul>
