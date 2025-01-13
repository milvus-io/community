---
id: Milvus-Is-an-Open-Source-Scalable-Vector-Database.md
title: Milvus는 확장 가능한 오픈 소스 벡터 데이터베이스입니다.
author: milvus
date: 2021-01-13T07:46:40.506Z
desc: Milvus로 강력한 머신 러닝 애플리케이션을 구축하고 대규모 벡터 데이터를 관리하세요.
cover: assets.zilliz.com/milvus_5b2cdec665.jpg
tag: Scenarios
canonicalUrl: 'https://zilliz.com/blog/Milvus-Is-an-Open-Source-Scalable-Vector-Database'
---
<custom-h1>확장 가능한 오픈소스 벡터 데이터베이스 Milvus</custom-h1><p>배우, 감독, 장르, 개봉일 등으로 영화 데이터베이스를 쿼리하는 등 쉽게 정의된 기준을 사용해 데이터를 검색하는 것은 간단합니다. 관계형 데이터베이스는 SQL과 같은 쿼리 언어를 사용해 이러한 유형의 기본 검색에 적합합니다. 하지만 자연어 또는 비디오 클립을 사용해 비디오 스트리밍 라이브러리를 검색하는 것과 같이 복잡한 객체와 보다 추상적인 쿼리가 포함된 검색의 경우, 제목이나 설명의 단어 일치와 같은 단순한 유사성 메트릭만으로는 더 이상 충분하지 않습니다.</p>
<p><a href="https://medium.com/unstructured-data-service/the-easiest-way-to-search-among-1-billion-image-vectors-d6faf72e361f#d62b">인공 지능(AI)</a> 은 컴퓨터가 언어의 의미를 이해하는 능력을 크게 향상시켰을 뿐만 아니라 사람들이 분석하기 어려운 방대한 비정형 데이터 세트(예: 오디오, 비디오, 문서, 소셜 미디어 데이터)를 이해하는 데 도움을 줍니다. AI는 넷플릭스가 정교한 콘텐츠 추천 엔진을 만들고, 구글 사용자가 이미지로 웹을 검색하고, 제약 회사가 신약을 발견할 수 있게 해줍니다.</p>
<h3 id="The-challenge-of-searching-large-unstructured-datasets" class="common-anchor-header">대규모 비정형 데이터 세트 검색의 과제</h3><p>이러한 기술의 위업은 AI 알고리즘을 사용하여 밀도가 높은 비정형 데이터를 기계가 쉽게 읽을 수 있는 수치 데이터 형식인 벡터로 변환함으로써 달성됩니다. 그런 다음, 추가 알고리즘을 사용해 주어진 검색에 대한 벡터 간의 유사성을 계산합니다. 비정형 데이터 세트의 크기가 크기 때문에 대부분의 머신 러닝 애플리케이션에서 전체 데이터를 검색하는 데는 너무 많은 시간이 소요됩니다. 이를 극복하기 위해 근사 근사 이웃(ANN) 알고리즘을 사용해 유사한 벡터를 함께 클러스터링한 다음, 데이터 세트에서 대상 검색 벡터와 유사한 벡터를 포함할 가능성이 가장 높은 부분만 검색합니다.</p>
<p>이렇게 하면 정확도는 약간 떨어지지만 훨씬 더 <a href="https://medium.com/unstructured-data-service/how-to-choose-an-index-in-milvus-4f3d15259212#7a9a">빠른</a> 유사도 검색이 가능하며, 유용한 AI 도구를 구축하는 데 핵심적인 역할을 합니다. 방대한 공개 리소스 덕분에 머신 러닝 애플리케이션을 구축하는 것이 그 어느 때보다 쉽고 저렴해졌습니다. 그러나 AI 기반 벡터 유사도 검색은 특정 프로젝트 요구 사항에 따라 수와 복잡성이 다른 여러 도구를 인터레이스해야 하는 경우가 많습니다. Milvus는 통합 플랫폼에서 강력한 기능을 제공하여 머신 러닝 애플리케이션 구축 프로세스를 간소화하는 것을 목표로 하는 오픈 소스 AI 검색 엔진입니다.</p>
<h3 id="What-is-Milvus" class="common-anchor-header">Milvus란 무엇인가요?</h3><p><a href="https://milvus.io/">Milvus는</a> 대규모 벡터 데이터와 머신러닝 작업(MLOps) 간소화를 위해 특별히 구축된 오픈소스 데이터 관리 플랫폼입니다. Facebook AI 유사도 검색(Faiss), 비계량 공간 라이브러리(NMSLIB), Annoy를 기반으로 하는 Milvus는 독립형 기능을 확장하면서 다양하고 강력한 도구를 한곳에 모아줍니다. 이 시스템은 대규모 벡터 데이터 세트의 저장, 처리 및 분석을 위해 특별히 설계되었으며, 컴퓨터 비전, 추천 엔진 등을 아우르는 AI 애플리케이션을 구축하는 데 사용할 수 있습니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_Milvus_Is_an_Open_Source_Scalable_AI_Search_Engine_1_997255eb27.jpg" alt="Blog_Milvus Is an Open-Source Scalable AI Search Engine_1.jpg" class="doc-image" id="blog_milvus-is-an-open-source-scalable-ai-search-engine_1.jpg" />
   </span> <span class="img-wrapper"> <span>블로그_확장 가능한 오픈 소스 AI 검색 엔진 Milvus_1.jpg</span> </span></p>
<h3 id="Milvus-was-made-to-power-vector-similarity-search" class="common-anchor-header">Milvus는 벡터 유사도 검색을 강화하기 위해 만들어졌습니다.</h3><p>Milvus는 유연성을 위해 설계되어 개발자가 특정 사용 사례에 맞게 플랫폼을 최적화할 수 있습니다. CPU/GPU 전용 및 이기종 컴퓨팅을 지원하므로 데이터 처리를 가속화하고 모든 시나리오에서 리소스 요구 사항을 최적화할 수 있습니다. 데이터는 분산 아키텍처의 Milvus에 저장되므로 데이터 볼륨을 쉽게 확장할 수 있습니다. 다양한 AI 모델, 프로그래밍 언어(예: C++, Java, Python), 프로세서 유형(예: x86, ARM, GPU, TPU, FPGA)을 지원하는 Milvus는 다양한 하드웨어 및 소프트웨어와의 높은 호환성을 제공합니다.</p>
<p>Milvus에 대한 자세한 내용은 다음 리소스를 확인하세요:</p>
<ul>
<li>Milvus의 <a href="https://milvus.io/">기술 문서를</a> 살펴보고 플랫폼의 내부 작동 방식에 대해 자세히 알아보세요.</li>
<li>Milvus <a href="https://tutorials.milvus.io/">튜토리얼을</a> 통해 Milvus를 시작하고 애플리케이션을 빌드하는 방법 등을 알아보세요.</li>
<li>프로젝트에 기여하고 Milvus의 오픈 소스 커뮤니티에 참여하여 <a href="https://github.com/milvus-io">GitHub에</a> 참여하세요.</li>
</ul>
