---
id: Extracting-Events-Highlights-Using-iYUNDONG-Sports-App.md
title: 아이윤동 스포츠 앱으로 이벤트 하이라이트 추출하기
author: milvus
date: 2021-03-16T03:41:30.983Z
desc: 밀버스로 제작하기 스포츠 앱용 지능형 이미지 검색 시스템 아이윤동
cover: assets.zilliz.com/blog_iyundong_6db0f70ef4.jpg
tag: Scenarios
canonicalUrl: 'https://zilliz.com/blog/Extracting-Events-Highlights-Using-iYUNDONG-Sports-App'
---
<custom-h1>아이윤동 스포츠 앱으로 이벤트 하이라이트 추출하기</custom-h1><p>아이윤동은 더 많은 스포츠 애호가와 마라톤 대회와 같은 이벤트 참가자의 참여를 목표로 하는 인터넷 회사입니다. 스포츠 경기 중 촬영된 미디어를 분석하여 자동으로 하이라이트를 생성하는 <a href="https://en.wikipedia.org/wiki/Artificial_intelligence">인공지능(AI)</a> 도구를 개발합니다. 예를 들어, 스포츠 이벤트에 참여한 아이윤동 스포츠 앱 사용자는 셀카를 업로드하면 방대한 미디어 데이터 세트에서 자신의 사진이나 동영상 클립을 즉시 검색할 수 있습니다.</p>
<p>아이윤동 앱의 핵심 기능 중 하나는 '움직이는 나를 찾아줘'입니다.  보통 사진작가들은 마라톤 대회와 같은 스포츠 이벤트에서 대량의 사진이나 동영상을 촬영하고, 이를 실시간으로 iYUNDONG 미디어 데이터베이스에 업로드합니다. 자신의 하이라이트 순간을 보고 싶은 마라톤 선수는 셀카 한 장만 업로드하면 자신을 포함한 사진을 검색할 수 있습니다. 아이윤동 앱의 이미지 검색 시스템이 모든 이미지 매칭을 수행하기 때문에 시간을 크게 절약할 수 있습니다. 이 시스템을 구동하기 위해 아이윤동은 검색 프로세스를 크게 가속화하고 정확도 높은 결과를 제공하는 <a href="https://milvus.io/">Milvus를</a> 채택했습니다.</p>
<p><br/></p>
<p><strong>바로가기:</strong></p>
<ul>
<li><a href="#extracting-event-highlights-using-iyundong-sports-app">아이윤동 스포츠 앱으로 경기 하이라이트 추출하기</a><ul>
<li><a href="#difficulties-and-solutions">어려움과 해결책</a></li>
<li><a href="#what-is-milvus">밀버스란 무엇인가</a>- <a href="#an-overview-of-milvus"><em>밀버스에 대한 개요.</em></a></li>
<li><a href="#why-milvus">왜 밀버스인가</a></li>
<li><a href="#system-and-workflow">시스템 및 워크플로우</a></li>
<li><a href="#iyundong-app-interface">아이윤동 앱 인터페이스</a>- <a href="#iyundong-app-interface-1"><em>아이윤동 앱 인터페이스.</em></a></li>
<li><a href="#conclusion">결론</a></li>
</ul></li>
</ul>
<p><br/></p>
<h3 id="Difficulties-and-solutions" class="common-anchor-header">어려움과 해결책</h3><p>아이윤동은 이미지 검색 시스템을 구축하면서 다음과 같은 문제에 직면했고, 이에 대한 해결책을 성공적으로 찾았습니다.</p>
<ul>
<li>이벤트 사진을 즉시 검색할 수 있어야 합니다.</li>
</ul>
<p>아이윤동은 이벤트 사진을 업로드한 후 바로 검색할 수 있도록 '즉시 업로드'라는 기능을 개발했습니다.</p>
<ul>
<li>대용량 데이터 저장</li>
</ul>
<p>사진, 동영상과 같은 대용량 데이터는 밀리초 단위로 아이윤동 백엔드에 업로드됩니다. 따라서 아이윤동은 방대한 양의 비정형 데이터를 안전하고 빠르고 안정적으로 처리하기 위해 <a href="https://aws.amazon.com/">AWS</a>, <a href="https://aws.amazon.com/s3/?nc1=h_ls">S3</a>, <a href="https://www.alibabacloud.com/product/oss">알리바바 클라우드 오브젝트 스토리지 서비스(OSS)</a> 를 비롯한 클라우드 스토리지 시스템으로 마이그레이션하기로 결정했습니다.</p>
<ul>
<li>즉시 읽기</li>
</ul>
<p>아이윤동은 즉시 읽기를 위해 자체 샤딩 미들웨어를 개발하여 수평적 확장성을 쉽게 달성하고 디스크 읽기로 인한 시스템 영향을 완화했습니다. 또한, 동시 접속자가 많은 상황에서도 일관된 성능을 보장하기 위해 <a href="https://redis.io/">Redis를</a> 캐싱 레이어로 활용하고 있습니다.</p>
<ul>
<li>얼굴 특징의 즉각적인 추출</li>
</ul>
<p>아이윤동은 사용자가 업로드한 사진에서 정확하고 효율적으로 얼굴 특징을 추출하기 위해 이미지를 128차원 특징 벡터로 변환하는 독자적인 이미지 변환 알고리즘을 개발했습니다. 또 다른 문제는 많은 사용자와 사진작가가 동시에 이미지나 동영상을 업로드하는 경우가 많다는 것이었습니다. 따라서 시스템 엔지니어는 시스템을 배포할 때 동적 확장성을 고려해야 했습니다. 특히 아이윤동은 동적 확장을 위해 클라우드의 탄력적 컴퓨팅 서비스(ECS)를 적극 활용했습니다.</p>
<ul>
<li>빠르고 대규모의 벡터 검색</li>
</ul>
<p>아이윤동은 AI 모델에서 추출한 수많은 특징 벡터를 저장하기 위한 벡터 데이터베이스가 필요했습니다. 아이윤동은 고유한 비즈니스 애플리케이션 시나리오에 따라 벡터 데이터베이스가 다음과 같은 기능을 수행할 수 있기를 기대했습니다:</p>
<ol>
<li>초대형 데이터 세트에서 매우 빠른 벡터 검색을 수행합니다.</li>
<li>저렴한 비용으로 대용량 스토리지 확보.</li>
</ol>
<p>초기에는 연평균 100만 개의 이미지를 처리했기 때문에 아이윤동은 검색을 위한 모든 데이터를 RAM에 저장했습니다. 하지만 지난 2년 동안 사업이 급성장하면서 비정형 데이터가 기하급수적으로 증가해 2019년에는 아이윤동의 데이터베이스에 저장된 이미지 수가 6천만 개를 넘어 10억 개 이상의 특징 벡터를 저장해야 하는 상황이 되었습니다. 엄청난 양의 데이터는 필연적으로 아이윤동 시스템의 구축과 리소스 소비를 크게 만들었습니다. 따라서 고성능을 보장하기 위해 하드웨어 설비에 지속적으로 투자해야 했습니다. 특히 아이윤동은 효율성과 수평적 확장성을 높이기 위해 더 많은 검색 서버와 더 큰 RAM, 더 좋은 성능의 CPU를 도입했습니다. 하지만 이 솔루션의 단점 중 하나는 운영 비용이 엄청나게 높아진다는 것이었습니다. 따라서 아이윤동은 이 문제에 대한 더 나은 해결책을 모색하기 시작했고, 비용을 절감하고 비즈니스를 보다 효율적으로 운영하기 위해 Faiss와 같은 벡터 인덱스 라이브러리를 활용하는 방안을 고민했습니다. 결국 아이윤동은 오픈소스 벡터 데이터베이스 Milvus를 선택했습니다.</p>
<p><br/></p>
<h3 id="What-is-Milvus" class="common-anchor-header">Milvus란?</h3><p>Milvus는 사용하기 쉽고 유연성과 안정성이 뛰어나며 속도가 매우 빠른 오픈 소스 벡터 데이터베이스입니다. 사진 및 음성 인식, 영상 처리, 자연어 처리 등 다양한 딥러닝 모델과 결합하여 다양한 AI 알고리즘을 사용하여 벡터로 변환된 비정형 데이터를 처리 및 분석할 수 있습니다. 밀버스가 모든 비정형 데이터를 처리하는 워크플로는 다음과 같습니다:</p>
<p>비정형 데이터를 딥러닝 모델이나 기타 AI 알고리즘을 통해 임베딩 벡터로 변환합니다.</p>
<p>그런 다음 임베딩 벡터를 Milvus에 삽입하여 저장합니다. 밀버스는 해당 벡터에 대한 인덱스도 구축합니다.</p>
<p>밀버스는 다양한 비즈니스 니즈에 따라 유사도 검색을 수행하여 정확한 검색 결과를 반환합니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/i_YUNDONG_Blog_1_d8abe065ae.png" alt="iYUNDONG Blog 1.png" class="doc-image" id="iyundong-blog-1.png" />
   </span> <span class="img-wrapper"> <span>아이윤동 블로그 1.png</span> </span></p>
<p><br/></p>
<h3 id="Why-Milvus" class="common-anchor-header">왜 밀버스인가</h3><p>아이윤동은 2019년 말부터 이미지 검색 시스템에 Milvus를 적용하기 위한 테스트를 진행했습니다. 테스트 결과, Milvus는 다중 인덱스를 지원하고 RAM 사용량을 효율적으로 줄여 벡터 유사도 검색 타임라인을 크게 압축할 수 있어 다른 주류 벡터 데이터베이스보다 성능이 뛰어난 것으로 나타났습니다.</p>
<p>또한 Milvus의 새 버전은 정기적으로 출시됩니다. 테스트 기간 동안 Milvus는 v0.6.0부터 v0.10.1까지 여러 차례 버전 업데이트를 거쳤습니다.</p>
<p>또한 활발한 오픈소스 커뮤니티와 강력한 기본 제공 기능을 갖춘 Milvus를 통해 아이윤동은 빠듯한 개발 예산으로 운영할 수 있었습니다.</p>
<p><br/></p>
<h3 id="System-and-Workflow" class="common-anchor-header">시스템 및 워크플로</h3><p>아이윤동의 시스템은 사진작가가 업로드한 이벤트 사진에서 얼굴을 먼저 감지하여 얼굴 특징을 추출합니다. 그런 다음 얼굴 특징을 128차원 벡터로 변환하여 Milvus 라이브러리에 저장합니다. Milvus는 이러한 벡터에 대한 인덱스를 생성하고 매우 정확한 결과를 즉시 반환할 수 있습니다.</p>
<p>사진 ID 및 사진 속 얼굴의 위치를 나타내는 좌표와 같은 기타 추가 정보는 타사 데이터베이스에 저장됩니다.</p>
<p>각 특징 벡터는 Milvus 라이브러리에 고유 ID를 가지고 있습니다. 아이윤동은 <a href="https://about.meituan.com/en">메이투안</a> 베이직 R&amp;D 플랫폼에서 개발한 분산 ID 생성 서비스인 <a href="https://github.com/Meituan-Dianping/Leaf">리프 알고리즘을</a> 채택하여 Milvus의 벡터 ID를 다른 데이터베이스에 저장된 해당 추가 정보와 연결합니다. 특징 벡터와 추가 정보를 결합하여 아이윤동 시스템은 사용자 검색 시 유사한 결과를 반환할 수 있습니다.</p>
<p><br/></p>
<h3 id="iYUNDONG-App-Interface" class="common-anchor-header">아이윤동 앱 인터페이스</h3><p>홈페이지에는 일련의 최신 스포츠 이벤트가 나열되어 있습니다. 사용자는 이벤트 중 하나를 탭하면 전체 세부 정보를 확인할 수 있습니다.</p>
<p>사진 갤러리 페이지 상단의 버튼을 탭하면 사용자가 직접 사진을 업로드하여 하이라이트 이미지를 검색할 수 있습니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/iyundong_interface_3da684d206.jpg" alt="iyundong-interface.jpg" class="doc-image" id="iyundong-interface.jpg" />
   </span> <span class="img-wrapper"> <span>iyundong-interface.jpg</span> </span></p>
<p><br/></p>
<h3 id="Conclusion" class="common-anchor-header">결론</h3><p>이번 글에서는 해상도, 크기, 선명도, 각도 등 다양한 방식으로 사용자가 업로드한 사진을 기반으로 정확한 검색 결과를 얻을 수 있는 지능형 이미지 검색 시스템을 아이윤동 앱에 구축하여 유사도 검색을 복잡하게 만드는 방법에 대해 소개했습니다. 밀버스의 도움으로 아이윤동 앱은 6천만 장 이상의 이미지 데이터베이스에 대해 밀리초 단위의 쿼리를 성공적으로 실행할 수 있습니다. 그리고 사진 검색의 정확도는 92% 이상을 지속적으로 유지하고 있습니다. 밀버스 덕분에 아이윤동은 제한된 리소스로 단시간에 강력한 엔터프라이즈급 이미지 검색 시스템을 손쉽게 구축할 수 있었습니다.</p>
<p>다른 <a href="https://zilliz.com/user-stories">사용자 사례를</a> 읽고 Milvus로 무엇을 만드는지 자세히 알아보세요.</p>
