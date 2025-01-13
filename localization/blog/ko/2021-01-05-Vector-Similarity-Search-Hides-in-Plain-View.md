---
id: Vector-Similarity-Search-Hides-in-Plain-View.md
title: '벡터 유사도 검색에 대해 자세히 알아보려면 다음 리소스를 확인하세요:'
author: milvus
date: 2021-01-05T03:40:20.821Z
desc: '벡터 유사도 검색이 무엇인지, 다양한 응용 분야와 인공지능에 대한 접근성을 높여주는 공개 리소스에 대해 알아보세요.'
cover: assets.zilliz.com/plainview_703d8497ca.jpg
tag: Engineering
canonicalUrl: 'https://zilliz.com/blog/Vector-Similarity-Search-Hides-in-Plain-View'
---
<custom-h1>보이지 않는 곳에 숨어 있는 벡터 유사도 검색</custom-h1><p><a href="https://medium.com/unstructured-data-service/the-easiest-way-to-search-among-1-billion-image-vectors-d6faf72e361f#a291">인공지능(AI)은</a> 가장 잘 알려지지 않은 일의 수행 방식까지 바꿀 수 있는 잠재력을 가지고 있습니다. 예를 들어, 홍콩 마라톤에는 매년 (코로나19 이전에는) 73,000명 이상의 사람들이 참가하기 위해 모입니다. 모든 참가자의 완주 시간을 정확하게 측정하고 기록하기 위해 주최측은 73,000개의 RFID 칩 타이머를 배포하여 각 선수에게 부착합니다. 칩 타이밍은 분명한 단점이 있는 복잡한 작업입니다. 재료(칩 및 전자 판독 장치)는 타이밍 회사에서 구매하거나 대여해야 하며, 레이스 당일에 참가자가 칩을 수령할 수 있도록 등록 구역에 직원을 배치해야 합니다. 또한 센서를 출발선과 결승선에만 설치하면 비양심적인 러너가 코스를 단축할 수 있습니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/blog_1_e55c133e05.jpeg" alt="blog-1.jpeg" class="doc-image" id="blog-1.jpeg" />
   </span> <span class="img-wrapper"> <span>blog-1.jpeg</span> </span></p>
<p>이제 사진 한 장으로 결승선에서 촬영한 영상에서 개별 러너를 자동으로 식별할 수 있는 <a href="https://cloud.google.com/video-intelligence">비디오 AI</a> 애플리케이션을 상상해 보세요. 각 참가자에게 타이밍 칩을 부착하는 대신, 러너는 결승선을 통과한 후 앱을 통해 자신의 사진을 업로드하기만 하면 됩니다. 즉시 개인화된 하이라이트 릴, 레이스 통계 및 기타 관련 정보가 제공됩니다. 레이스의 여러 지점에 설치된 카메라는 참가자의 추가 영상을 캡처하여 각 러너가 전체 코스를 완주했는지 확인할 수 있습니다. 어떤 솔루션이 구현하기 더 쉽고 비용 효율적일까요?</p>
<p>홍콩 마라톤에서 머신러닝을 활용하여 타이밍 칩을 대체하지는 않았지만(아직), 이 사례는 인공지능이 우리 주변의 모든 것을 획기적으로 변화시킬 수 있는 잠재력을 보여줍니다. 레이스 타이밍의 경우 수만 개의 칩을 머신러닝 알고리즘과 결합한 카메라 몇 대로 줄일 수 있습니다. 하지만 비디오 AI는 인공지능을 사용해 조 단위의 방대한 비정형 데이터 세트를 분석하는 프로세스인 벡터 유사도 검색을 위한 많은 애플리케이션 중 하나일 뿐입니다. 이 문서에서는 벡터 검색 기술의 정의와 사용 방법, 그리고 그 어느 때보다 쉽게 접근할 수 있는 오픈 소스 소프트웨어와 리소스를 포함한 벡터 검색 기술에 대한 개요를 제공합니다.</p>
<p><strong>이동하기:</strong></p>
<ul>
<li><p><a href="#what-is-vector-similarity-search">벡터 유사도 검색이란 무엇인가요?</a></p></li>
<li><p><a href="#what-are-some-applications-of-vector-similarity-search">벡터 유사도 검색의 응용 분야에는 어떤 것이 있나요?</a></p></li>
<li><p><a href="#open-source-vector-similarity-search-software-and-resources">오픈 소스 벡터 유사도 검색 소프트웨어 및 리소스.</a></p></li>
</ul>
<h3 id="What-is-vector-similarity-search" class="common-anchor-header">벡터 유사도 검색이란 무엇인가요?</h3><p>비디오 데이터는 매우 상세하고 점점 더 보편화되고 있으므로 논리적으로는 비디오 AI를 구축하기 위한 훌륭한 비지도 학습 신호가 될 것처럼 보입니다. 하지만 현실은 그렇지 않습니다. 특히 대용량의 비디오 데이터를 처리하고 분석하는 것은 <a href="https://arxiv.org/pdf/1905.11954.pdf">인공지능에게</a> 여전히 <a href="https://arxiv.org/pdf/1905.11954.pdf">어려운 과제입니다</a>. 비정형 데이터 분석 분야에서 이루어진 많은 진전과 마찬가지로 이 분야의 최근 진전은 상당 부분 벡터 유사성 검색에 기인합니다.</p>
<p>모든 비정형 데이터와 마찬가지로 비디오의 문제는 미리 정의된 모델이나 조직 구조를 따르지 않기 때문에 대규모로 처리하고 분석하기가 어렵다는 것입니다. 비정형 데이터에는 이미지, 오디오, 소셜 미디어 행동, 문서 등이 포함되며 전체 데이터의 80~90% 이상을 차지하는 것으로 추정됩니다. 기업들은 방대하고 난해한 비정형 데이터 세트에 숨겨진 비즈니스 크리티컬 인사이트에 대해 점점 더 많이 인식하고 있으며, 이러한 실현되지 않은 잠재력을 활용할 수 있는 AI 애플리케이션에 대한 수요가 증가하고 있습니다.</p>
<p>CNN, RNN, BERT와 같은 <a href="https://en.wikipedia.org/wiki/Neural_network">신경망을</a> 사용하면 비정형 데이터를 기계가 읽을 수 있는 수치 데이터 형식인 특징 벡터(일명 임베딩)로 변환할 수 있습니다. 그런 다음 알고리즘을 사용하여 코사인 유사도 또는 유클리드 거리와 같은 측정값을 사용해 벡터 간의 유사도를 계산합니다. 벡터 임베딩과 유사도 검색을 통해 이전에는 식별할 수 없었던 데이터 세트를 사용해 머신 러닝 애플리케이션을 분석하고 구축할 수 있습니다.</p>
<p>벡터 유사도는 확립된 알고리즘을 사용해 계산되지만, 비정형 데이터 세트는 일반적으로 방대합니다. 따라서 효율적이고 정확한 검색을 위해서는 방대한 저장 공간과 컴퓨팅 성능이 필요합니다. <a href="https://medium.com/unstructured-data-service/how-to-choose-an-index-in-milvus-4f3d15259212#7a9a">유사도 검색을 가속화하고</a> 리소스 요구 사항을 줄이기 위해 근사 근사 이웃(ANN) 검색 알고리즘이 사용됩니다. ANN 알고리즘은 유사한 벡터를 함께 클러스터링함으로써 전체 데이터 세트를 검색하는 대신 유사한 벡터를 포함할 가능성이 가장 높은 벡터 클러스터로 쿼리를 보낼 수 있게 해줍니다. 이 접근 방식은 더 빠르지만 어느 정도의 정확도를 희생합니다. ANN 알고리즘을 활용하면 수십억 개의 딥 러닝 모델 인사이트를 밀리초 단위로 검색할 수 있는 벡터 검색이 가능합니다.</p>
<h3 id="What-are-some-applications-of-vector-similarity-search" class="common-anchor-header">벡터 유사도 검색의 응용 분야에는 어떤 것이 있나요?</h3><p>벡터 유사도 검색은 다양한 인공 지능, 딥 러닝 및 기존 벡터 계산 시나리오에 걸쳐 응용되고 있습니다. 다음은 다양한 벡터 유사도 검색 애플리케이션에 대한 개괄적인 개요입니다:</p>
<p><strong>전자상거래:</strong> 벡터 유사도 검색은 쇼핑객이 스마트폰에서 캡처하거나 온라인에서 찾은 이미지를 사용하여 제품을 검색할 수 있는 리버스 이미지 검색 엔진을 포함하여 전자상거래에 폭넓게 적용될 수 있습니다. 또한, 벡터 검색을 사용하는 전문 추천 시스템을 통해 사용자 행동, 관심사, 구매 내역 등을 기반으로 개인화된 추천을 제공할 수 있습니다.</p>
<p><strong>물리적 및 사이버 보안:</strong> 비디오 AI는 보안 분야에서 벡터 유사도 검색을 위한 많은 애플리케이션 중 하나일 뿐입니다. 다른 시나리오로는 얼굴 인식, 행동 추적, 신원 인증, 지능형 액세스 제어 등이 있습니다. 또한, 벡터 유사도 검색은 점점 더 일반화되고 정교해지는 사이버 공격을 막는 데 중요한 역할을 합니다. 예를 들어, <a href="https://medium.com/gsi-technology/application-of-ai-to-cybersecurity-part-3-19659bdb3422">코드 유사성 검색은</a> 소프트웨어와 알려진 취약점 또는 멀웨어 데이터베이스를 비교하여 보안 위험을 식별하는 데 사용할 수 있습니다.</p>
<p><strong>추천 엔진:</strong> 추천 엔진은 머신 러닝과 데이터 분석을 사용하여 사용자에게 제품, 서비스, 콘텐츠 및 정보를 제안하는 시스템입니다. 사용자 행동, 유사한 사용자의 행동 및 기타 데이터는 딥 러닝 방법을 사용하여 처리되어 추천을 생성합니다. 충분한 데이터가 있으면 알고리즘을 훈련시켜 개체 간의 관계를 이해하고 이를 자율적으로 표현하는 방법을 개발할 수 있습니다. 추천 시스템은 광범위한 적용 범위를 가지고 있으며 Netflix의 콘텐츠 추천, Amazon의 쇼핑 추천, Facebook의 뉴스 피드 등 사람들이 이미 매일 접하고 있는 기능입니다.</p>
<p><strong>챗봇:</strong> 전통적으로 챗봇은 대규모 학습 데이터 세트가 필요한 일반 지식 그래프를 사용하여 구축되었습니다. 하지만 딥러닝 모델을 사용하여 구축된 챗봇은 데이터를 사전 처리할 필요 없이 자주 묻는 질문과 답변 사이의 맵을 생성합니다. 사전 학습된 자연어 처리(NLP) 모델을 사용하여 질문에서 특징 벡터를 추출한 다음 <a href="https://medium.com/unstructured-data-service/the-easiest-way-to-search-among-1-billion-image-vectors-d6faf72e361f#92e0">벡터 데이터 관리 플랫폼을</a> 사용하여 저장하고 쿼리할 수 있습니다.</p>
<p><strong>이미지 또는 동영상 검색:</strong> 딥 러닝 네트워크는 1970년대 후반부터 시각적 패턴을 인식하는 데 사용되어 왔으며, 최신 기술 트렌드로 인해 이미지 및 동영상 검색은 그 어느 때보다 강력하고 접근하기 쉬워졌습니다.</p>
<p><strong>화학적 유사성 검색:</strong> 화학적 유사성은 화합물의 특성을 예측하고 특정 속성을 가진 화학 물질을 찾는 데 핵심적인 역할을 하며 신약 개발에 없어서는 안 될 필수 요소입니다. 각 분자에 대해 특징 벡터로 표현된 지문을 생성한 다음 벡터 간의 거리를 이용해 유사성을 측정합니다. TikTok의 중국 모기업인 바이트댄스가 <a href="https://techcrunch.com/2020/12/23/bytedance-ai-drug/">이 분야의 인재를 채용하기</a> 시작하는 등 기술 업계에서 신약 발견을 위한 AI 활용이 탄력을 받고 있습니다.</p>
<h3 id="Open-source-vector-similarity-search-software-and-resources" class="common-anchor-header">오픈 소스 벡터 유사도 검색 소프트웨어 및 리소스.</h3><p>무어의 법칙, 클라우드 컴퓨팅, 리소스 비용의 감소는 그 어느 때보다 인공지능에 대한 접근성을 높인 거시적 트렌드입니다. 오픈 소스 소프트웨어와 기타 공개적으로 이용 가능한 리소스 덕분에 AI/ML 애플리케이션 구축은 이제 대기업만 할 수 있는 일이 아닙니다. 아래에서는 오픈소스 벡터 데이터 관리 플랫폼인 Milvus에 대한 간략한 개요와 함께 누구나 AI를 활용할 수 있도록 도와주는 공개적으로 사용 가능한 데이터 세트를 소개합니다.</p>
<h4 id="Milvus-an-open-source-vector-data-management-platform" class="common-anchor-header">오픈 소스 벡터 데이터 관리 플랫폼, Milvus</h4><p><a href="https://milvus.io/">Milvus는</a> 대규모 벡터 데이터를 위해 특별히 제작된 오픈소스 벡터 데이터 관리 플랫폼입니다. Facebook AI 유사도 검색(Faiss), 비계량 공간 라이브러리(NMSLIB), Annoy를 기반으로 하는 Milvus는 독립형 기능을 확장하면서 다양하고 강력한 도구를 단일 플랫폼으로 통합합니다. 이 시스템은 대규모 벡터 데이터세트를 저장, 처리 및 분석하기 위해 특별히 구축되었으며, 위에서 언급한 모든 AI 애플리케이션(및 그 이상)을 구축하는 데 사용할 수 있습니다.</p>
<p>Milvus에 대한 자세한 정보는 <a href="https://milvus.io/">웹사이트에서</a> 확인할 수 있습니다. 튜토리얼, Milvus 설정 지침, 벤치마크 테스트, 다양한 애플리케이션 구축에 대한 정보는 <a href="https://github.com/milvus-io/bootcamp">Milvus 부트캠프에서</a> 확인할 수 있습니다. 프로젝트에 기여하고 싶은 개발자는 <a href="https://github.com/milvus-io">GitHub에서</a> Milvus의 오픈 소스 커뮤니티에 참여할 수 있습니다.</p>
<h4 id="Public-datasets-for-artificial-intelligence-and-machine-learning" class="common-anchor-header">인공 지능 및 머신 러닝을 위한 공개 데이터 세트</h4><p>일부 전문가들은 일정 규모 이상의 기업이 소규모 경쟁업체와 익명화된 데이터를 공유하도록 강제하는 '<a href="https://www.technologyreview.com/2019/06/06/135067/making-big-tech-companies-share-data-could-do-more-good-than-breaking-them-up/">점진적 데이터 공유 의무화</a>'를 주장하는 등, Google이나 Facebook과 같은 거대 기술 기업이 소규모 기업에 비해 데이터 우위를 점하고 있다는 사실은 이미 잘 알려진 사실입니다. 다행히도 AL/ML 프로젝트에 사용할 수 있는 공개적으로 이용 가능한 데이터 세트가 수천 개나 있습니다:</p>
<ul>
<li><p><strong>바로 사람들의 말 데이터셋입니다:</strong> <a href="https://mlcommons.org/en/peoples-speech/">ML Commons의</a> 이 <a href="https://mlcommons.org/en/peoples-speech/">데이터 세트는</a> 59개 언어로 87,000시간 이상 전사된 세계 최대 규모의 음성 데이터 세트를 제공합니다.</p></li>
<li><p><strong>UC 어바인 머신 러닝 리포지토리:</strong> 캘리포니아 대학교 어바인에서는 머신 러닝 커뮤니티를 돕기 위해 <a href="https://archive.ics.uci.edu/ml/index.php">수백 개의 공개 데이터 세트를</a> 관리하고 있습니다.</p></li>
<li><p><strong>Data.gov:</strong> 미국 정부는 교육, 기후, 코로나19 등을 아우르는 <a href="https://www.data.gov/">수십만 개의 오픈 데이터 집합을</a> 제공합니다.</p></li>
<li><p><strong>Eurostat:</strong> 유럽연합의 통계청은 경제 및 금융에서 인구 및 사회 상황에 이르기까지 다양한 산업에 걸친 <a href="https://ec.europa.eu/eurostat/data/database">오픈 데이터 집합을</a> 제공합니다.</p></li>
<li><p><strong>하버드 데이터버스:</strong> <a href="https://dataverse.harvard.edu/">하버드 데이터버스 리포지토리는</a> 다양한 분야의 연구자에게 개방된 무료 데이터 리포지토리입니다. 많은 데이터 집합이 공개되어 있지만, 일부 데이터 집합에는 보다 제한된 사용 약관이 적용됩니다.</p></li>
</ul>
<p>이 목록이 완전한 것은 아니지만, 놀랍도록 다양한 오픈 데이터 집합을 발견하기 위한 좋은 출발점이 될 것입니다. 공개 데이터 세트에 대한 자세한 정보와 다음 ML 또는 데이터 과학 프로젝트에 적합한 데이터를 선택하는 방법은 이 <a href="https://altexsoft.medium.com/best-public-datasets-for-machine-learning-and-data-science-sources-and-advice-on-the-choice-636a0e754052">Medium 게시물을</a> 참조하세요.</p>
<h2 id="To-learn-more-about-vector-similarity-search-check-out-the-following-resources" class="common-anchor-header">벡터 유사도 검색에 대해 자세히 알아보려면 다음 리소스를 확인하세요:<button data-href="#To-learn-more-about-vector-similarity-search-check-out-the-following-resources" class="anchor-icon" translate="no">
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
    </button></h2><ul>
<li><a href="https://milvus.io/blog/Thanks-to-Milvus-Anyone-Can-Build-a-Vector-Database-for-1-Billion-Images.md">Milvus 덕분에 누구나 10억 개 이상의 이미지를 위한 검색 엔진을 구축할 수 있습니다.</a></li>
<li><a href="https://milvus.io/blog/Milvus-Was-Built-for-Massive-Scale-Think-Trillion-Vector-Similarity-Search.md">대규모(조 단위) 벡터 유사도 검색을 위해 구축된 Milvus</a></li>
<li><a href="https://zilliz.com/blog/Accelerating-Similarity-Search-on-Really-Big-Data-with-Vector-Indexing">벡터 인덱싱으로 대용량 데이터에서 유사도 검색을 가속화하기</a></li>
<li><a href="https://zilliz.com/learn/index-overview-part-2">벡터 인덱싱으로 대용량 데이터에서 유사도 검색 가속화하기(2부)</a></li>
</ul>
