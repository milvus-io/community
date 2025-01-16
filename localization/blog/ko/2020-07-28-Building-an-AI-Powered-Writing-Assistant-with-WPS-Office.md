---
id: Building-an-AI-Powered-Writing-Assistant-with-WPS-Office.md
title: WPS Office용 AI 기반 글쓰기 도우미 구축하기
author: milvus
date: 2020-07-28T03:35:40.105Z
desc: >-
  Kingsoft가 오픈 소스 유사성 검색 엔진인 Milvus를 활용하여 WPS Office의 AI 기반 글쓰기 도우미를 위한 추천 엔진을
  구축한 방법을 알아보세요.
cover: assets.zilliz.com/wps_thumbnail_6cb7876963.jpg
tag: Scenarios
canonicalUrl: >-
  https://zilliz.com/blog/Building-an-AI-Powered-Writing-Assistant-with-WPS-Office
---
<custom-h1>WPS Office용 AI 기반 글쓰기 도우미 구축하기</custom-h1><p>WPS Office는 전 세계 1억 5천만 명 이상의 사용자를 보유한 Kingsoft에서 개발한 생산성 도구입니다. 이 회사의 인공 지능(AI) 부서는 의도 인식 및 텍스트 클러스터링과 같은 시맨틱 매칭 알고리즘을 사용하여 처음부터 스마트 글쓰기 도우미를 구축했습니다. 이 도구는 사용자가 제목을 입력하고 최대 5개의 키워드를 선택하기만 하면 개요, 개별 단락, 전체 문서를 빠르게 작성할 수 있는 웹 애플리케이션과 <a href="https://walkthechat.com/wechat-mini-programs-simple-introduction/">WeChat 미니 프로그램</a> 두 가지 형태로 존재합니다.</p>
<p>글쓰기 도우미의 추천 엔진은 오픈 소스 유사도 검색 엔진인 Milvus를 사용하여 핵심 벡터 처리 모듈을 구동합니다. 아래에서는 비정형 데이터에서 기능을 추출하는 방법과 데이터를 저장하고 도구의 추천 엔진을 구동하는 데 있어 Milvus가 수행하는 역할을 포함하여 WPS 오피스의 스마트 글쓰기 도우미를 구축하는 프로세스에 대해 살펴봅니다.</p>
<p>이동하기:</p>
<ul>
<li><a href="#building-an-ai-powered-writing-assistant-for-wps-office">WPS Office용 AI 기반 글쓰기 도우미 구축하기</a><ul>
<li><a href="#making-sense-of-unstructured-textual-data">비정형 텍스트 데이터 이해하기</a></li>
<li><a href="#using-the-tfidf-model-to-maximize-feature-extraction">TFIDF 모델을 사용하여 특징 추출 극대화하기</a></li>
<li><a href="#extracting-features-with-the-bi-directional-lstm-cnns-crf-deep-learning-model">양방향 LSTM-CNN-CRF 딥 러닝 모델로 특징 추출하기</a></li>
<li><a href="#creating-sentence-embeddings-using-infersent">Infersent를 사용하여 문장 임베딩 생성하기</a></li>
<li><a href="#storing-and-querying-vectors-with-milvus">Milvus로 벡터 저장 및 쿼리하기</a></li>
<li><a href="#ai-isnt-replacing-writers-its-helping-them-write">AI는 작가를 대체하는 것이 아니라 작문을 돕는 것입니다.</a></li>
</ul></li>
</ul>
<h3 id="Making-sense-of-unstructured-textual-data" class="common-anchor-header">비정형 텍스트 데이터 이해하기</h3><p>해결해야 할 현대의 모든 문제와 마찬가지로, WPS 글쓰기 도우미 구축은 지저분한 데이터에서 시작됩니다. 좀 더 정확하게 말하면 수천만 개의 밀도 높은 텍스트 문서에서 의미 있는 특징을 추출해야 합니다. 이 문제의 복잡성을 이해하려면 서로 다른 뉴스 매체의 두 기자가 같은 주제에 대해 어떻게 보도할 수 있는지 생각해 보세요.</p>
<p>두 기자는 문장 구조를 규정하는 규칙, 원칙, 프로세스를 준수하겠지만, 서로 다른 단어를 선택하고, 다양한 길이의 문장을 만들고, 각자의 기사 구조를 사용해 비슷한(또는 서로 다른) 이야기를 전할 것입니다. 고정된 수의 차원을 가진 구조화된 데이터 세트와 달리, 텍스트 본문은 이를 지배하는 구문이 매우 가변적이기 때문에 본질적으로 구조가 부족합니다. 의미를 찾으려면 비정형 문서 코퍼스에서 기계가 읽을 수 있는 특징을 추출해야 합니다. 하지만 먼저 데이터를 정리해야 합니다.</p>
<p>텍스트 데이터를 정리하는 방법에는 여러 가지가 있지만 이 글에서 자세히 다루지는 않습니다. 하지만 이 단계는 데이터를 처리하기 전에 선행되는 중요한 단계이며 태그 제거, 악센트 문자 제거, 축약어 확장, 특수 문자 제거, 중지어 제거 등이 포함될 수 있습니다. 텍스트 데이터를 사전 처리하고 정리하는 방법에 대한 자세한 설명은 <a href="https://towardsdatascience.com/understanding-feature-engineering-part-3-traditional-methods-for-text-data-f6f7d70acd41">여기에서</a> 확인할 수 있습니다.</p>
<h3 id="Using-the-TFIDF-model-to-maximize-feature-extraction" class="common-anchor-header">TFIDF 모델을 사용해 특징 추출 극대화하기</h3><p>구조화되지 않은 텍스트 데이터를 이해하기 위해 WPS 글쓰기 도우미가 가져오는 말뭉치에 용어 빈도 역 문서 빈도(TFIDF) 모델을 적용했습니다. 이 모델은 용어 빈도와 역 문서 빈도라는 두 가지 메트릭의 조합을 사용하여 문서 내의 각 단어에 TFIDF 값을 부여합니다. 용어 빈도(TF)는 문서에 있는 용어의 원시 개수를 문서의 총 용어 수로 나눈 값이고, 역 문서 빈도(IDF)는 말뭉치에 있는 문서 수를 해당 용어가 나타나는 문서 수로 나눈 값입니다.</p>
<p>TF와 IDF의 곱은 문서에서 용어가 나타나는 빈도에 해당 단어가 말뭉치에서 얼마나 고유한지를 곱한 값을 제공합니다. 궁극적으로 TFIDF 값은 문서 모음 내에서 단어가 문서와 얼마나 관련성이 있는지를 측정하는 척도입니다. 용어는 TFIDF 값에 따라 정렬되며, 딥 러닝을 사용하여 말뭉치에서 특징을 추출할 때 값이 낮은 단어(즉, 일반적인 단어)는 가중치가 낮게 부여될 수 있습니다.</p>
<h3 id="Extracting-features-with-the-bi-directional-LSTM-CNNs-CRF-deep-learning-model" class="common-anchor-header">양방향 LSTM-CNN-CRF 딥러닝 모델로 특징 추출하기</h3><p>양방향 장단기 메모리(BLSTM), 컨볼루션 신경망(CNN), 조건부 랜덤 필드(CRF)의 조합을 사용하면 말뭉치에서 단어 및 문자 수준의 표현을 모두 추출할 수 있습니다. WPS Office 쓰기 도우미를 구축하는 데 사용되는 <a href="https://arxiv.org/pdf/1603.01354.pdf">BLSTM-CNNs-CRF 모델은</a> 다음과 같이 작동합니다:</p>
<ol>
<li><strong>CNN:</strong> 문자 임베딩을 CNN에 대한 입력으로 사용한 다음 의미적으로 관련된 단어 구조(즉, 접두사 또는 접미사)를 추출하여 문자 수준 표현 벡터로 인코딩합니다.</li>
<li><strong>BLSTM:</strong> 문자 수준 벡터를 단어 임베딩 벡터와 연결한 다음 BLSTM 네트워크에 공급합니다. 각 시퀀스는 과거와 미래 정보를 캡처하기 위해 두 개의 개별 숨겨진 상태로 앞뒤로 제시됩니다.</li>
<li><strong>CRF:</strong> BLSTM의 출력 벡터가 CRF 계층에 공급되어 최적의 라벨 시퀀스를 공동으로 디코딩합니다.</li>
</ol>
<p>이제 신경망은 비정형 텍스트에서 명명된 엔티티를 추출하고 분류할 수 있습니다. 이 프로세스를 명명된 <a href="https://en.wikipedia.org/wiki/Named-entity_recognition">개체 인식(NER)</a> 이라고 하며, 사람 이름, 기관, 지리적 위치 등과 같은 범주를 찾아 분류하는 작업이 포함됩니다. 이러한 엔티티는 데이터를 정렬하고 불러오는 데 중요한 역할을 합니다. 여기에서 말뭉치에서 핵심 문장, 단락, 요약을 추출할 수 있습니다.</p>
<h3 id="Creating-sentence-embeddings-using-Infersent" class="common-anchor-header">Infersent를 사용하여 문장 임베딩 생성하기</h3><p>전체 문장을 벡터 공간에 임베딩하는 Facebook에서 설계한 지도 문장 임베딩 방법인<a href="https://github.com/facebookresearch/InferSent">Infersent는</a> Milvus 데이터베이스에 공급될 벡터를 생성하는 데 사용됩니다. Infersent는 사람이 작성하고 라벨을 붙인 57만 쌍의 문장이 포함된 스탠포드 자연어 추론(SNLI) 코퍼스를 사용하여 학습되었습니다. Infersent의 작동 방식에 대한 추가 정보는 <a href="https://medium.com/analytics-vidhya/sentence-embeddings-facebooks-infersent-6ac4a9fc2001">여기에서</a> 확인할 수 있습니다.</p>
<h3 id="Storing-and-querying-vectors-with-Milvus" class="common-anchor-header">Milvus로 벡터 저장 및 쿼리하기</h3><p><a href="https://www.milvus.io/">Milvus는</a> 1조 바이트 규모의 임베딩을 추가, 삭제, 업데이트 및 실시간에 가까운 검색을 지원하는 오픈 소스 유사성 검색 엔진입니다. 쿼리 성능을 향상시키기 위해 Milvus에서는 각 벡터 필드에 대해 인덱스 유형을 지정할 수 있습니다. WPS Office 스마트 어시스턴트는 벡터가 압축이나 정량화 없이 저장되는 가장 기본적인 IVF(역파일) 인덱스 유형인 IVF_FLAT 인덱스를 사용하며, 여기서 "플랫"은 벡터가 압축이나 정량화 없이 저장됨을 의미합니다. 클러스터링은 L2 거리에 대한 정확한 검색을 사용하는 IndexFlat2를 기반으로 합니다.</p>
<p>IVF_FLAT은 쿼리 회수율이 100%이지만, 압축이 없기 때문에 쿼리 속도가 상대적으로 느립니다. Milvus의 <a href="https://milvus.io/docs/manage-partitions.md">파티셔닝 기능은</a> 미리 정의된 규칙에 따라 데이터를 물리적 스토리지의 여러 부분으로 분할하여 쿼리를 더 빠르고 정확하게 처리하는 데 사용됩니다. Milvus에 벡터를 추가할 때 태그는 데이터가 어느 파티션에 추가될지 지정합니다. 벡터 데이터에 대한 쿼리는 태그를 사용해 쿼리가 실행될 파티션을 지정합니다. 각 파티션 내에서 데이터를 세그먼트로 더 세분화하여 속도를 더욱 향상시킬 수 있습니다.</p>
<p>또한 지능형 작성 도우미는 Kubernetes 클러스터를 사용하여 애플리케이션 컨테이너를 여러 머신과 환경에서 실행할 수 있으며 메타데이터 관리를 위해 MySQL을 사용할 수 있습니다.</p>
<h3 id="AI-isn’t-replacing-writers-it’s-helping-them-write" class="common-anchor-header">AI는 작가를 대체하는 것이 아니라 작문을 돕는 것입니다.</h3><p>Kingsoft의 WPS Office용 글쓰기 도우미는 Milvus를 사용하여 2백만 개가 넘는 문서 데이터베이스를 관리하고 쿼리합니다. 이 시스템은 매우 유연하여 1조 규모의 데이터 세트에 대해 거의 실시간에 가까운 검색을 실행할 수 있습니다. 쿼리는 평균 0.2초 만에 완료되므로 제목이나 몇 개의 키워드만으로 전체 문서를 거의 즉각적으로 생성할 수 있습니다. AI가 전문 작가를 대체하지는 못하지만, 현재 존재하는 기술은 새롭고 흥미로운 방식으로 글쓰기 과정을 보강할 수 있습니다. 미래는 알 수 없지만, 적어도 작가들은 더 생산적이고 덜 어렵게 "펜을 종이에 대는" 방법을 기대할 수 있습니다.</p>
<p>이 글에는 다음 자료가 사용되었습니다:</p>
<ul>
<li>"<a href="https://arxiv.org/pdf/1603.01354.pdf">양방향 LSTM-CNN-CRF를 통한 엔드투엔드 시퀀스 라벨링</a>", Xuezhe Ma와 Eduard Hovy.</li>
<li>"<a href="https://towardsdatascience.com/understanding-feature-engineering-part-3-traditional-methods-for-text-data-f6f7d70acd41">텍스트 데이터에 대한 전통적인 방법</a>," 디판잔(DJ) 사르카르.</li>
<li>"<a href="https://ieeexplore.ieee.org/document/8780663">TF-IDF 연관 시맨틱에 기반한 텍스트 특징 추출</a>", 칭 리우, 징 왕, 데하이 장, 윤 양, 나이야오 왕. "문장<a href="https://ieeexplore.ieee.org/document/8780663">임베딩의</a> 이해".</li>
<li>"<a href="https://medium.com/analytics-vidhya/sentence-embeddings-facebooks-infersent-6ac4a9fc2001">Facebook의 Infersent를 이용한 문장 임베딩 이해</a>", Rehan Ahmad</li>
<li>"<a href="https://arxiv.org/pdf/1705.02364.pdf">자연어 추론 데이터에서 범용 문장 표현의 지도 학습</a>," Alexis Conneau, Douwe Kiela, Holger Schwenk, LoÏc Barrault, Antoine Bordes.V1</li>
</ul>
<p>다른 <a href="https://zilliz.com/user-stories">사용자 사례를</a> 읽고 Milvus로 무언가를 만드는 방법에 대해 자세히 알아보세요.</p>
