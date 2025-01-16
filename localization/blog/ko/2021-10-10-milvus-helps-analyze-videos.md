---
id: 2021-10-10-milvus-helps-analyze-videos.md
title: 객체 감지
author: Shiyu Chen
date: 2021-10-11T00:00:00.000Z
desc: Milvus가 동영상 콘텐츠의 AI 분석을 어떻게 지원하는지 알아보세요.
cover: assets.zilliz.com/Who_is_it_e9d4510ace.png
tag: Scenarios
canonicalUrl: 'https://zilliz.com/blog/milvus-helps-analyze-videos-intelligently'
---
<custom-h1>Milvus 벡터 데이터베이스로 비디오 분석 시스템 구축하기</custom-h1><p><em>질리츠의 데이터 엔지니어인 시유 첸은 시디안 대학교에서 컴퓨터 공학을 전공했습니다. 그녀는 질리즈에 입사한 이후 오디오 및 비디오 분석, 분자식 검색 등 다양한 분야에서 Milvus의 솔루션을 탐색해 왔으며, 이를 통해 커뮤니티의 응용 시나리오를 크게 풍부하게 만들었습니다. 그녀는 현재 더 흥미로운 솔루션을 모색하고 있습니다. 여가 시간에는 스포츠와 독서를 좋아합니다.</em></p>
<p>지난 주말에 <em>영화 '프리 가이</em> '를 보다가 경비원 버디 역을 맡은 배우를 어디선가 본 것 같았지만, 그의 작품이 전혀 생각나지 않았습니다. "이 사람이 누구지?"라는 생각이 머릿속을 가득 채웠습니다. 그 얼굴을 본 적이 있다는 확신이 들었고 이름을 기억하려고 애를 썼습니다. 비슷한 경우로 평소 좋아하던 음료수를 마시는 영상 속 주연 배우를 본 적이 있는데 결국 브랜드 이름을 기억하지 못한 적도 있습니다.</p>
<p>답은 혀끝에 있었지만 뇌가 완전히 막힌 느낌이 들었습니다.</p>
<p>혀끝(TOT) 현상은 영화를 볼 때 저를 미치게 만듭니다. 동영상을 찾고 동영상 콘텐츠를 분석할 수 있는 동영상 리버스 이미지 검색 엔진이 있다면 얼마나 좋을까요? 예전에 <a href="https://github.com/milvus-io/bootcamp/tree/master/solutions/reverse_image_search/quick_deploy">Milvus를 이용해 역이미지 검색 엔진을</a> 구축한 적이 있습니다. 동영상 콘텐츠 분석이 왠지 이미지 분석과 닮았다는 생각에 밀버스를 기반으로 동영상 콘텐츠 분석 엔진을 구축하기로 했습니다.</p>
<h2 id="Object-detection" class="common-anchor-header">객체 감지<button data-href="#Object-detection" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Overview" class="common-anchor-header">개요</h3><p>영상 분석에 앞서 영상 속 객체를 먼저 검출해야 합니다. 영상 속 객체를 효과적이고 정확하게 검출하는 것이 이 작업의 주요 과제입니다. 또한 오토파일럿, 웨어러블 디바이스, IoT와 같은 애플리케이션에서 중요한 작업이기도 합니다.</p>
<p>기존의 이미지 처리 알고리즘에서 심층 신경망(DNN)으로 발전한 오늘날 객체 감지를 위한 주류 모델에는 R-CNN, FRCNN, SSD, YOLO 등이 있습니다. 이 주제에서 소개하는 Milvus 기반 딥러닝 비디오 분석 시스템은 객체를 지능적이고 빠르게 감지할 수 있습니다.</p>
<h3 id="Implementation" class="common-anchor-header">구현</h3><p>영상에서 객체를 검출하고 인식하기 위해서는 먼저 영상에서 프레임을 추출하고 객체 검출을 이용해 프레임 이미지에서 객체를 검출한 후, 검출된 객체에서 특징 벡터를 추출하고 마지막으로 특징 벡터를 기반으로 객체를 분석하는 과정을 거쳐야 합니다.</p>
<ul>
<li>프레임 추출</li>
</ul>
<p>비디오 분석은 프레임 추출을 통해 이미지 분석으로 변환됩니다. 현재 프레임 추출 기술은 매우 성숙해 있습니다. FFmpeg, OpenCV와 같은 프로그램은 지정된 간격으로 프레임을 추출하는 기능을 지원합니다. 이 문서에서는 OpenCV를 사용하여 비디오에서 매초마다 프레임을 추출하는 방법을 소개합니다.</p>
<ul>
<li>객체 감지</li>
</ul>
<p>객체 감지는 추출된 프레임에서 객체를 찾아 그 위치에 따라 객체의 스크린샷을 추출하는 것입니다. 다음 그림과 같이 자전거, 강아지, 자동차가 감지되었습니다. 이 항목에서는 객체 검출에 일반적으로 사용되는 YOLOv3를 사용하여 객체를 검출하는 방법을 소개합니다.</p>
<ul>
<li>특징 추출</li>
</ul>
<p>특징 추출은 기계가 인식하기 어려운 비정형 데이터를 특징 벡터로 변환하는 것을 말합니다. 예를 들어 딥러닝 모델을 사용하여 이미지를 다차원 특징 벡터로 변환할 수 있습니다. 현재 가장 많이 사용되는 이미지 인식 AI 모델로는 VGG, GNN, ResNet 등이 있습니다. 이 항목에서는 ResNet-50을 사용하여 감지된 객체에서 특징을 추출하는 방법을 소개합니다.</p>
<ul>
<li>벡터 분석</li>
</ul>
<p>추출된 특징 벡터를 라이브러리 벡터와 비교하여 가장 유사한 벡터에 해당하는 정보를 반환합니다. 대규모 특징 벡터 데이터 세트의 경우 계산이 매우 어렵습니다. 이 항목에서는 Milvus를 사용해 특징 벡터를 분석하는 방법을 소개합니다.</p>
<h2 id="Key-technologies" class="common-anchor-header">주요 기술<button data-href="#Key-technologies" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="OpenCV" class="common-anchor-header">OpenCV</h3><p>오픈 소스 컴퓨터 비전 라이브러리(OpenCV)는 이미지 처리 및 컴퓨터 비전을 위한 많은 범용 알고리즘을 제공하는 크로스 플랫폼 컴퓨터 비전 라이브러리입니다. OpenCV는 컴퓨터 비전 분야에서 일반적으로 사용됩니다.</p>
<p>다음 예제는 Python에서 OpenCV를 사용하여 지정된 간격으로 비디오 프레임을 캡처하고 이미지로 저장하는 방법을 보여줍니다.</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">import</span> cv2 
<span class="hljs-built_in">cap</span> = cv2.VideoCapture(file_path)   
framerate = <span class="hljs-built_in">cap</span>.get(cv2.CAP_PROP_FPS)   
allframes = <span class="hljs-type">int</span>(cv2.VideoCapture.get(<span class="hljs-built_in">cap</span>, <span class="hljs-type">int</span>(cv2.CAP_PROP_FRAME_COUNT)))  
success, image = <span class="hljs-built_in">cap</span>.read() 
cv2.imwrite(file_name, image)
<button class="copy-code-btn"></button></code></pre>
<h3 id="YOLOv3" class="common-anchor-header">YOLOv3</h3><p>You Only Look Once, Version 3(YOLOv3 [5])은 최근 제안된 1단계 객체 감지 알고리즘입니다. 동일한 정확도를 가진 기존의 객체 감지 알고리즘과 비교했을 때, YOLOv3는 두 배 더 빠릅니다. 이 주제에서 언급된 YOLOv3는 패들패들[6]의 개선된 버전입니다. 추론 속도가 더 빠른 여러 최적화 방법을 사용합니다.</p>
<h3 id="ResNet-50" class="common-anchor-header">ResNet-50</h3><p>ResNet [7]은 단순성과 실용성으로 인해 이미지 분류 부문에서 ILSVRC 2015의 우승자입니다. 많은 이미지 분석 방법의 기초가 되는 ResNet은 이미지 감지, 분할 및 인식에 특화된 인기 모델입니다.</p>
<h3 id="Milvus" class="common-anchor-header">Milvus</h3><p><a href="https://milvus.io/">Milvus는</a> 머신 러닝 모델과 신경망에서 생성된 임베딩 벡터를 관리하기 위해 구축된 클라우드 네이티브 오픈 소스 벡터 데이터베이스입니다. 컴퓨터 비전, 자연어 처리, 계산 화학, 개인화된 추천 시스템 등과 같은 시나리오에서 널리 사용됩니다.</p>
<p>다음 절차는 Milvus의 작동 방식을 설명합니다.</p>
<ol>
<li>비정형 데이터는 딥 러닝 모델을 사용해 특징 벡터로 변환되어 Milvus로 가져옵니다.</li>
<li>Milvus는 특징 벡터를 저장하고 인덱싱합니다.</li>
<li>Milvus는 사용자가 쿼리한 벡터와 가장 유사한 벡터를 반환합니다.</li>
</ol>
<h2 id="Deployment" class="common-anchor-header">배포<button data-href="#Deployment" class="anchor-icon" translate="no">
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
    </button></h2><p>이제 Milvus 기반 영상 분석 시스템에 대해 어느 정도 이해하셨을 것입니다. 시스템은 다음 그림과 같이 크게 두 부분으로 구성됩니다.</p>
<ul>
<li><p>빨간색 화살표는 데이터 가져오기 프로세스를 나타냅니다. ResNet-50을 사용하여 이미지 데이터 세트에서 특징 벡터를 추출하고 특징 벡터를 Milvus로 가져옵니다.</p></li>
<li><p>검은색 화살표는 비디오 분석 프로세스를 나타냅니다. 먼저, 비디오에서 프레임을 추출하고 프레임을 이미지로 저장합니다. 둘째, YOLOv3를 사용해 이미지에서 객체를 감지하고 추출합니다. 그런 다음 ResNet-50을 사용해 이미지에서 특징 벡터를 추출합니다. 마지막으로 Milvus는 해당 특징 벡터가 있는 객체의 정보를 검색하여 반환합니다.</p></li>
</ul>
<p>자세한 내용은 <a href="https://github.com/milvus-io/bootcamp/tree/master/solutions/video_similarity_search/object_detection">Milvus 부트캠프를</a> 참조하세요 <a href="https://github.com/milvus-io/bootcamp/tree/master/solutions/video_similarity_search/object_detection">:</a> <a href="https://github.com/milvus-io/bootcamp/tree/master/solutions/video_similarity_search/object_detection">비디오 객체 감지 시스템을</a> 참조하세요.</p>
<p><strong>데이터 가져오기</strong></p>
<p>데이터 가져오기 과정은 간단합니다. 데이터를 2,048차원 벡터로 변환하고 해당 벡터를 Milvus로 가져오기만 하면 됩니다.</p>
<pre><code translate="no" class="language-python">vector = image_encoder.execute(filename)
entities = [vector]
collection.insert(data=entities)
<button class="copy-code-btn"></button></code></pre>
<p><strong>영상 분석</strong></p>
<p>위에서 소개한 것처럼 비디오 분석 프로세스에는 비디오 프레임 캡처, 각 프레임에서 객체 감지, 객체에서 벡터 추출, 유클리드 거리(L2) 메트릭으로 벡터 유사도 계산, Milvus를 사용한 결과 검색이 포함됩니다.</p>
<pre><code translate="no" class="language-python">images = extract_frame(filename, 1, prefix)   
detector = Detector()   
run(detector, DATA_PATH)       
vectors = get_object_vector(image_encoder, DATA_PATH)
search_params = {<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;L2&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;nprobe&quot;</span>: 10}}
results = collection.search(vectors, param=search_params, <span class="hljs-built_in">limit</span>=10)
<button class="copy-code-btn"></button></code></pre>
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
    </button></h2><p>현재 데이터의 80% 이상이 비정형 데이터입니다. AI의 급속한 발전과 함께 비정형 데이터를 분석하기 위한 딥러닝 모델도 점점 더 많이 개발되고 있습니다. 물체 감지 및 이미지 처리와 같은 기술은 학계와 산업계 모두에서 큰 발전을 이루었습니다. 이러한 기술에 힘입어 점점 더 많은 AI 플랫폼이 실용적인 요구 사항을 충족하고 있습니다.</p>
<p>이 주제에서 설명하는 동영상 분석 시스템은 동영상 콘텐츠를 빠르게 분석할 수 있는 Milvus를 기반으로 구축되었습니다.</p>
<p>오픈소스 벡터 데이터베이스인 Milvus는 다양한 딥러닝 모델을 사용해 추출한 특징 벡터를 지원합니다. Faiss, NMSLIB, Annoy와 같은 라이브러리와 통합된 Milvus는 직관적인 API 세트를 제공하여 시나리오에 따라 인덱스 유형 전환을 지원합니다. 또한, Milvus는 스칼라 필터링을 지원하여 리콜률과 검색 유연성을 높여줍니다. Milvus는 이미지 처리, 컴퓨터 비전, 자연어 처리, 음성 인식, 추천 시스템, 신약 개발 등 다양한 분야에 적용되고 있습니다.</p>
<h2 id="References" class="common-anchor-header">참고 문헌<button data-href="#References" class="anchor-icon" translate="no">
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
    </button></h2><p>[1] A. D. Bagdanov, L. Ballan, M. Bertini, A. Del Bimbo. "스포츠 비디오 데이터베이스에서 상표 매칭 및 검색." 멀티미디어 정보 검색에 관한 국제 워크숍, ACM, 2007. https://www.researchgate.net/publication/210113141_Trademark_matching_and_retrieval_in_sports_video_databases.</p>
<p>[2] J. Kleban, X. Xie, W.-Y. Ma. "자연 장면에서 로고 감지를 위한 공간 피라미드 마이닝." IEEE 국제 컨퍼런스, 2008. https://ieeexplore.ieee.org/document/4607625</p>
<p>[3] R. Boia, C. Florea, L. Florea, R. Dogaru. "호모그래픽 클래스 그래프를 이용한 자연 이미지에서의 로고 로컬라이제이션 및 인식." 머신 비전 및 애플리케이션 27 (2), 2016. https://link.springer.com/article/10.1007/s00138-015-0741-7</p>
<p>[4] R. Boia, C. Florea, L. Florea. "로고 감지를 위한 클래스 프로토타입의 타원형 어시프트 응집." BMVC, 2015. http://citeseerx.ist.psu.edu/viewdoc/download;jsessionid=5C87F52DE38AB0C90F8340DFEBB841F7?doi=10.1.1.707.9371&amp;rep=rep1&amp;type=pdf</p>
<p>[5] https://arxiv.org/abs/1804.02767</p>
<p>[6] https://paddlepaddle.org.cn/modelbasedetail/yolov3</p>
<p>[7] https://arxiv.org/abs/1512.03385</p>
