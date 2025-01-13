---
id: AI-applications-with-Milvus.md
title: Milvus로 인기 있는 AI 애플리케이션 4가지 만드는 방법
author: milvus
date: 2021-04-08T04:14:03.700Z
desc: >-
  Milvus는 머신 러닝 애플리케이션 개발과 머신 러닝 운영(MLOps)을 가속화합니다. Milvus를 사용하면 최소기능제품(MVP)을
  신속하게 개발하는 동시에 비용을 낮출 수 있습니다.
cover: assets.zilliz.com/blog_cover_4a9807b9e0.png
tag: Scenarios
canonicalUrl: 'https://zilliz.com/blog/AI-applications-with-Milvus'
---
<custom-h1>Milvus로 인기 있는 AI 애플리케이션 4가지 만드는 방법</custom-h1><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/blog_cover_4a9807b9e0.png" alt="blog cover.png" class="doc-image" id="blog-cover.png" />
   </span> <span class="img-wrapper"> <span>블로그 표지.png</span> </span></p>
<p><a href="https://milvus.io/">Milvus는</a> 오픈 소스 벡터 데이터베이스입니다. AI 모델을 사용해 비정형 데이터에서 특징 벡터를 추출하여 생성된 대규모 벡터 데이터 세트의 추가, 삭제, 업데이트 및 실시간에 가까운 검색을 지원합니다. 포괄적인 직관적인 API 세트와 널리 채택된 여러 인덱스 라이브러리(예: Faiss, NMSLIB, Annoy)를 지원하는 Milvus는 머신 러닝 애플리케이션 개발과 머신 러닝 운영(MLOps)을 가속화합니다. Milvus를 사용하면 비용을 낮추면서 최소기능제품(MVP)을 신속하게 개발할 수 있습니다.</p>
<p>&quot;Milvus로 AI 애플리케이션을 개발하는 데 어떤 리소스를 사용할 수 있나요?&quot;라는 질문은 Milvus 커뮤니티에서 자주 묻는 질문입니다. 밀버스의 <a href="https://zilliz.com/">개발사인</a> Zilliz는 밀버스를 활용하여 지능형 애플리케이션을 구동하는 초고속 유사성 검색을 수행하는 여러 데모를 개발했습니다. Milvus 솔루션의 소스 코드는 <a href="https://github.com/zilliz-bootcamp">zilliz-bootcamp에서</a> 확인할 수 있습니다. 다음 대화형 시나리오는 자연어 처리(NLP), 역 이미지 검색, 오디오 검색 및 컴퓨터 비전을 보여줍니다.</p>
<p>자유롭게 솔루션을 사용해보고 특정 시나리오를 직접 경험해 보세요! 나만의 애플리케이션 시나리오를 공유하세요:</p>
<ul>
<li><a href="https://join.slack.com/t/milvusio/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ">Slack</a></li>
<li><a href="https://github.com/milvus-io/milvus/discussions">GitHub</a></li>
</ul>
<p><br/></p>
<p><strong>이동하기</strong></p>
<ul>
<li><a href="#natural-language-processing-chatbots">자연어 처리(챗봇)</a></li>
<li><a href="#reverse-image-search-systems">이미지 역방향 검색</a></li>
<li><a href="#audio-search-systems">오디오 검색</a></li>
<li><a href="#video-object-detection-computer-vision">비디오 객체 감지(컴퓨터 비전)</a></li>
</ul>
<p><br/></p>
<h3 id="Natural-language-processing-chatbots" class="common-anchor-header">자연어 처리(챗봇)</h3><p>Milvus는 자연어 처리를 사용하여 실제 상담원을 시뮬레이션하고, 질문에 답변하고, 사용자를 관련 정보로 안내하고, 인건비를 절감하는 챗봇을 구축하는 데 사용할 수 있습니다. 이 애플리케이션 시나리오를 시연하기 위해 질리즈는 Milvus와 NLP 사전 학습을 위해 개발된 머신러닝(ML) 모델인 <a href="https://en.wikipedia.org/wiki/BERT_(language_model)">BERT를</a> 결합하여 시맨틱 언어를 이해하는 AI 기반 챗봇을 구축했습니다.</p>
<p>👉소스코드: <a href="https://github.com/zilliz-bootcamp/intelligent_question_answering_v2">zilliz-bootcamp/intelligent_question_answering_v2</a></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_c301a9e4bd.png" alt="1.png" class="doc-image" id="1.png" />
   </span> <span class="img-wrapper"> <span>1.png</span> </span></p>
<h4 id="How-to-use" class="common-anchor-header">사용 방법</h4><ol>
<li><p>질문-답변 쌍이 포함된 데이터 세트를 업로드합니다. 질문과 답변을 두 개의 별도 열로 포맷합니다. 또는 <a href="https://zilliz.com/solutions/qa">샘플 데이터 세트를</a> 다운로드할 수 있습니다.</p></li>
<li><p>질문을 입력하면 업로드된 데이터 세트에서 유사한 질문 목록이 검색됩니다.</p></li>
<li><p>자신의 질문과 가장 유사한 질문을 선택하여 답을 공개하세요.</p></li>
</ol>
<p>동영상:<a href="https://www.youtube.com/watch?v=ANgoyvgAxgU">[데모] Milvus로 구동되는 QA 시스템</a></p>
<h4 id="How-it-works" class="common-anchor-header">작동 방식</h4><p>Google의 BERT 모델을 사용하여 질문을 특징 벡터로 변환한 다음 Milvus를 사용하여 데이터 세트를 관리하고 쿼리합니다.</p>
<p><strong>데이터 처리:</strong></p>
<ol>
<li>BERT는 업로드된 질문-답변 쌍을 768차원 특징 벡터로 변환하는 데 사용됩니다. 그런 다음 벡터를 Milvus로 가져와 개별 ID를 할당합니다.</li>
<li>질문과 해당 답변, 벡터 ID는 PostgreSQL에 저장됩니다.</li>
</ol>
<p><strong>유사한 질문 검색하기:</strong></p>
<ol>
<li>BERT는 사용자가 입력한 질문에서 특징 벡터를 추출하는 데 사용됩니다.</li>
<li>Milvus는 입력된 질문과 가장 유사한 질문에 대한 벡터 ID를 검색합니다.</li>
<li>시스템은 PostgreSQL에서 해당 답변을 조회합니다.</li>
</ol>
<p><br/></p>
<h3 id="Reverse-image-search-systems" class="common-anchor-header">역 이미지 검색 시스템</h3><p>역 이미지 검색은 개인화된 제품 추천과 유사한 제품 조회 도구를 통해 이커머스를 혁신하고 있으며, 이를 통해 매출을 높일 수 있습니다. 이 적용 시나리오에서 질리즈는 이미지 특징을 추출할 수 있는 머신러닝 모델인 <a href="https://towardsdatascience.com/how-to-use-a-pre-trained-model-vgg-for-image-classification-8dd7c4a4a517">VGG와</a> Milvus를 결합하여 역이미지 검색 시스템을 구축했습니다.</p>
<p>👉소스 코드: <a href="https://github.com/zilliz-bootcamp/image_search">zilliz-bootcamp/image_search</a></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_09000e2e2e.jpeg" alt="2.jpeg" class="doc-image" id="2.jpeg" />
   </span> <span class="img-wrapper"> <span>2.jpeg</span> </span></p>
<h4 id="How-to-use" class="common-anchor-header">사용 방법</h4><ol>
<li>.jpg 이미지로만 구성된 압축 이미지 데이터셋을 업로드합니다(다른 이미지 파일 형식은 허용되지 않음). 또는 <a href="https://zilliz.com/solutions/image-search">샘플 데이터 세트를</a> 다운로드할 수 있습니다.</li>
<li>유사한 이미지를 찾기 위한 검색 입력으로 사용할 이미지를 업로드합니다.</li>
</ol>
<p>👉비디오: <a href="https://www.youtube.com/watch?v=mTO8YdQObKY">[데모] Milvus를 이용한 이미지 검색</a></p>
<h4 id="How-it-works" class="common-anchor-header">작동 방식</h4><p>이미지가 VGG 모델을 사용하여 512차원 특징 벡터로 변환된 다음, Milvus를 사용하여 데이터 세트를 관리하고 쿼리합니다.</p>
<p><strong>데이터 처리:</strong></p>
<ol>
<li>업로드된 이미지 데이터 세트를 특징 벡터로 변환하는 데 VGG 모델이 사용됩니다. 그런 다음 벡터를 Milvus로 가져와서 개별 ID를 할당합니다.</li>
<li>이미지 특징 벡터와 해당 이미지 파일 경로는 CacheDB에 저장됩니다.</li>
</ol>
<p><strong>유사한 이미지 검색:</strong></p>
<ol>
<li>사용자가 업로드한 이미지를 특징 벡터로 변환하는 데 VGG가 사용됩니다.</li>
<li>입력 이미지와 가장 유사한 이미지의 벡터 ID는 Milvus에서 검색됩니다.</li>
<li>시스템은 캐시DB에서 해당 이미지 파일 경로를 조회합니다.</li>
</ol>
<p><br/></p>
<h3 id="Audio-search-systems" class="common-anchor-header">오디오 검색 시스템</h3><p>음성, 음악, 음향 효과 및 기타 유형의 오디오 검색을 통해 방대한 양의 오디오 데이터를 빠르게 쿼리하고 유사한 소리를 찾아낼 수 있습니다. 유사한 음향 효과 식별, IP 침해 최소화 등 다양한 용도로 활용할 수 있습니다. 이 애플리케이션 시나리오를 시연하기 위해 질리즈는 오디오 패턴 인식을 위해 구축된 대규모 사전 훈련된 오디오 <a href="https://arxiv.org/abs/1912.10211">신경망인 PANN과</a>Milvus를 결합하여 매우 효율적인 오디오 유사도 검색 시스템을 구축했습니다.</p>
<p>👉소스 코드: <a href="https://github.com/zilliz-bootcamp/audio_search">zilliz-bootcamp/audio_search</a> <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_419bac3dd2.png" alt="3.png" class="doc-image" id="3.png" /><span>3.png</span> </span></p>
<h4 id="How-to-use" class="common-anchor-header">사용 방법</h4><ol>
<li>.wav 파일로만 구성된 압축된 오디오 데이터 세트를 업로드합니다(다른 오디오 파일 형식은 허용되지 않음). 또는 <a href="https://zilliz.com/solutions/audio-search">샘플 데이터 세트를</a> 다운로드할 수 있습니다.</li>
<li>유사한 오디오를 찾기 위한 검색 입력으로 사용할 .wav 파일을 업로드합니다.</li>
</ol>
<p>👉비디오: <a href="https://www.youtube.com/watch?v=0eQHeqriCXw">[데모] Milvus를 이용한 오디오 검색</a></p>
<h4 id="How-it-works" class="common-anchor-header">작동 방식</h4><p>오디오는 오디오 패턴 인식을 위해 구축된 사전 학습된 대규모 오디오 신경망인 PANN을 사용하여 특징 벡터로 변환됩니다. 그런 다음 Milvus를 사용하여 데이터 세트를 관리하고 쿼리합니다.</p>
<p><strong>데이터 처리:</strong></p>
<ol>
<li>PANN은 업로드된 데이터 세트의 오디오를 특징 벡터로 변환합니다. 그런 다음 이 벡터를 Milvus로 가져와서 개별 ID를 할당합니다.</li>
<li>오디오 피처 벡터 ID와 해당 .wav 파일 경로는 PostgreSQL에 저장됩니다.</li>
</ol>
<p><strong>유사한 오디오 검색:</strong></p>
<ol>
<li>PANN은 사용자가 업로드한 오디오 파일을 피처 벡터로 변환하는 데 사용됩니다.</li>
<li>업로드된 파일과 가장 유사한 오디오의 벡터 ID는 내부 곱(IP) 거리를 계산하여 Milvus에서 검색됩니다.</li>
<li>시스템은 MySQL에서 해당 오디오 파일 경로를 조회합니다.</li>
</ol>
<p><br/></p>
<h3 id="Video-object-detection-computer-vision" class="common-anchor-header">비디오 객체 감지(컴퓨터 비전)</h3><p>비디오 객체 감지는 컴퓨터 비전, 이미지 검색, 자율 주행 등에 응용할 수 있습니다. 질리즈는 이 애플리케이션 시나리오를 시연하기 위해 Milvus와 <a href="https://en.wikipedia.org/wiki/OpenCV">OpenCV</a>, <a href="https://towardsdatascience.com/yolo-v3-object-detection-53fb7d3bfe6b">YOLOv3</a>, <a href="https://www.mathworks.com/help/deeplearning/ref/resnet50.html">ResNet50</a> 등의 기술 및 알고리즘을 결합하여 비디오 객체 감지 시스템을 구축했습니다.</p>
<p>👉소스코드: <a href="https://github.com/zilliz-bootcamp/video_analysis">zilliz-bootcamp/video_analysis</a></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/4_54b4ceb2ad.png" alt="4.png" class="doc-image" id="4.png" />
   </span> <span class="img-wrapper"> <span>4.png</span> </span></p>
<h4 id="How-to-use" class="common-anchor-header">사용 방법</h4><ol>
<li>.jpg 파일로만 구성된 압축 이미지 데이터 세트를 업로드합니다(다른 이미지 파일 형식은 허용되지 않음). 각 이미지 파일의 이름은 이미지가 묘사하는 대상에 따라 지정해야 합니다. 또는 <a href="https://zilliz.com/solutions/video-obj-analysis">샘플 데이터 세트를</a> 다운로드할 수 있습니다.</li>
<li>분석에 사용할 동영상을 업로드합니다.</li>
<li>재생 버튼을 클릭하면 업로드된 동영상과 함께 실시간으로 표시되는 객체 감지 결과를 볼 수 있습니다.</li>
</ol>
<p>👉비디오: <a href="https://www.youtube.com/watch?v=m9rosLClByc">[데모] Milvus로 구동되는 비디오 객체 감지 시스템</a></p>
<h4 id="How-it-works" class="common-anchor-header">작동 원리</h4><p>객체 이미지는 ResNet50을 사용하여 2048차원 특징 벡터로 변환됩니다. 그런 다음 Milvus를 사용하여 데이터 세트를 관리하고 쿼리합니다.</p>
<p><strong>데이터 처리:</strong></p>
<ol>
<li>ResNet50은 물체 이미지를 2048차원 특징 벡터로 변환합니다. 그런 다음 이 벡터를 Milvus로 가져와 개별 ID를 할당합니다.</li>
<li>오디오 특징 벡터 ID와 해당 이미지 파일 경로는 MySQL에 저장됩니다.</li>
</ol>
<p><strong>비디오에서 객체 감지:</strong></p>
<ol>
<li>OpenCV는 비디오 트리밍에 사용됩니다.</li>
<li>비디오에서 객체를 감지하는 데는 YOLOv3가 사용됩니다.</li>
<li>ResNet50은 감지된 객체 이미지를 2048차원 특징 벡터로 변환합니다.</li>
</ol>
<p>밀버스는 업로드된 데이터 세트에서 가장 유사한 객체 이미지를 검색합니다. 해당 객체 이름과 이미지 파일 경로는 MySQL에서 검색됩니다.</p>
