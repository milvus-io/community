---
id: building-a-wardrobe-and-outfit-planning-app-with-milvus.md
title: 시스템 개요
author: Yu Fang
date: 2021-07-09T06:30:06.439Z
desc: >-
  Mozat에서 오픈소스 벡터 데이터베이스인 Milvus를 사용하여 개인화된 스타일 추천과 이미지 검색 시스템을 제공하는 패션 앱에 어떻게
  활용하고 있는지 알아보세요.
cover: assets.zilliz.com/mozat_blog_0ea9218c71.jpg
tag: Scenarios
canonicalUrl: >-
  https://zilliz.com/blog/building-a-wardrobe-and-outfit-planning-app-with-milvus
---
<custom-h1>Milvus로 옷장 및 의상 계획 앱 만들기</custom-h1><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/stylepedia_1_5f239a8d48.png" alt="stylepedia-1.png" class="doc-image" id="stylepedia-1.png" />
   </span> <span class="img-wrapper"> <span>stylepedia-1.png</span> </span></p>
<p>2003년에 설립된 <a href="http://www.mozat.com/home">Mozat는</a> 싱가포르에 본사를 두고 중국과 사우디아라비아에 지사를 둔 스타트업입니다. 이 회사는 소셜 미디어, 커뮤니케이션 및 라이프스타일 애플리케이션 구축을 전문으로 합니다. <a href="https://stylepedia.com/">스타일피디아는</a> 사용자가 새로운 스타일을 발견하고 패션에 열정적인 다른 사람들과 소통할 수 있도록 도와주는 모잣의 옷장 앱입니다. 주요 기능으로는 디지털 옷장 큐레이션 기능, 개인화된 스타일 추천, 소셜 미디어 기능, 온라인이나 실생활에서 본 것과 비슷한 아이템을 찾을 수 있는 이미지 검색 도구 등이 있습니다.</p>
<p><a href="https://milvus.io">Milvus는</a> Stylepedia의 이미지 검색 시스템을 구동하는 데 사용됩니다. 이 앱은 사용자 이미지, 제품 이미지, 패션 사진의 세 가지 이미지 유형을 다룹니다. 각 이미지에는 하나 이상의 항목이 포함될 수 있으므로 각 쿼리가 더욱 복잡해집니다. 이미지 검색 시스템이 유용하려면 정확하고 빠르며 안정적이어야 하며, 의상 제안 및 패션 콘텐츠 추천과 같은 새로운 기능을 앱에 추가할 수 있는 탄탄한 기술적 토대를 마련해야 합니다.</p>
<h2 id="System-overview" class="common-anchor-header">시스템 개요<button data-href="#System-overview" class="anchor-icon" translate="no">
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
    </button></h2><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/stylepedia_system_process_8e7e2ab3e4.png" alt="stylepedia-system-process.png" class="doc-image" id="stylepedia-system-process.png" />
   </span> <span class="img-wrapper"> <span>스타일피디아 시스템 프로세스.png</span> </span></p>
<p>이미지 검색 시스템은 오프라인과 온라인 구성 요소로 나뉩니다.</p>
<p>오프라인에서는 이미지가 벡터화되어 벡터 데이터베이스(Milvus)에 삽입됩니다. 데이터 워크플로에서 관련 제품 이미지와 패션 사진은 객체 감지 및 특징 추출 모델을 사용하여 512차원 특징 벡터로 변환됩니다. 그런 다음 벡터 데이터는 색인화되어 벡터 데이터베이스에 추가됩니다.</p>
<p>온라인에서는 이미지 데이터베이스가 쿼리되고 유사한 이미지가 사용자에게 반환됩니다. 오프라인 구성 요소와 마찬가지로 쿼리 이미지도 객체 감지 및 특징 추출 모델에 의해 처리되어 특징 벡터를 얻습니다. 이 특징 벡터를 사용해 Milvus는 TopK 유사 벡터를 검색하고 해당 이미지 ID를 얻습니다. 마지막으로 후처리(필터링, 정렬 등)를 거쳐 쿼리 이미지와 유사한 이미지 모음을 반환합니다.</p>
<h2 id="Implementation" class="common-anchor-header">구현<button data-href="#Implementation" class="anchor-icon" translate="no">
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
    </button></h2><p>구현은 네 가지 모듈로 나뉩니다:</p>
<ol>
<li>의류 감지</li>
<li>특징 추출</li>
<li>벡터 유사성 검색</li>
<li>후처리</li>
</ol>
<h3 id="Garment-detection" class="common-anchor-header">의류 감지</h3><p>의류 감지 모듈에서는 작은 크기와 실시간 추론이 가능한 1단계 앵커 기반 대상 감지 프레임워크인 <a href="https://pytorch.org/hub/ultralytics_yolov5/">YOLOv5를</a> 객체 감지 모델로 사용합니다. 이 모듈은 네 가지 모델 크기(YOLOv5s/m/l/x)를 제공하며, 각 모델 크기에는 장단점이 있습니다. 모델이 클수록 성능이 더 우수하지만(정밀도가 더 높음) 컴퓨팅 성능이 훨씬 더 많이 필요하고 실행 속도가 느려집니다. 이 경우 물체는 비교적 큰 품목이고 감지하기 쉽기 때문에 가장 작은 모델인 YOLOv5s로 충분합니다.</p>
<p>각 이미지에서 의류 품목을 인식하고 잘라내어 후속 처리에서 사용되는 특징 추출 모델 입력으로 사용합니다. 동시에 객체 감지 모델은 미리 정의된 클래스(상의, 아우터, 바지, 스커트, 원피스, 바지)에 따라 의복 분류도 예측합니다.</p>
<h3 id="Feature-extraction" class="common-anchor-header">특징 추출</h3><p>유사도 검색의 핵심은 특징 추출 모델입니다. 잘린 옷 이미지는 기계 판독이 가능한 숫자 데이터 형식으로 속성을 나타내는 512차원 부동 소수점 벡터로 임베드됩니다. <a href="https://github.com/Joon-Park92/Survey_of_Deep_Metric_Learning">딥 메트릭 학습(DML)</a> 방법론은 <a href="https://arxiv.org/abs/1905.11946">EfficientNet을</a> 백본 모델로 채택했습니다.</p>
<p>메트릭 학습은 CNN 기반의 비선형 특징 추출 모듈(또는 인코더)을 훈련시켜 같은 종류의 샘플에 해당하는 특징 벡터 간의 거리를 줄이고, 다른 종류의 샘플에 해당하는 특징 벡터 간의 거리를 늘리는 것을 목표로 합니다. 이 시나리오에서 같은 종류의 샘플은 같은 옷을 의미합니다.</p>
<p>EfficientNet은 네트워크 폭, 깊이, 해상도를 균일하게 확장할 때 속도와 정밀도를 모두 고려합니다. 특징 추출 네트워크로는 EfficientNet-B4가 사용되며, 최종적으로 완전히 연결된 계층의 출력은 벡터 유사도 검색을 수행하는 데 필요한 이미지 특징입니다.</p>
<h3 id="Vector-similarity-search" class="common-anchor-header">벡터 유사도 검색</h3><p>Milvus는 오픈 소스 벡터 데이터베이스로, 1조 바이트 규모의 데이터 세트에 대한 실시간에 가까운 검색뿐만 아니라 생성, 읽기, 업데이트, 삭제(CRUD) 작업을 지원합니다. 탄력적이고 안정적이며 신뢰할 수 있고 속도가 매우 빠르기 때문에 대규모 벡터 유사도 검색에 사용됩니다. Milvus는 널리 사용되는 벡터 인덱스 라이브러리(Faiss, NMSLIB, Annoy 등)의 기능을 확장하고, 사용자가 주어진 시나리오에 이상적인 인덱스 유형을 선택할 수 있는 간단하고 직관적인 API 세트를 제공합니다.</p>
<p>시나리오 요구 사항과 데이터 규모를 고려할 때, 스타일피디아의 개발자들은 HNSW 인덱스와 짝을 이루는 Milvus의 CPU 전용 배포를 사용했습니다. 제품용 컬렉션과 패션 사진용 컬렉션으로 구성된 두 개의 인덱싱된 컬렉션은 서로 다른 애플리케이션 기능을 지원하도록 구축되었습니다. 각 컬렉션은 검색 범위를 좁히기 위해 감지 및 분류 결과에 따라 6개의 파티션으로 더 나뉩니다. Milvus는 수천만 개의 벡터를 밀리초 단위로 검색하여 최적의 성능을 제공하면서도 개발 비용을 낮추고 리소스 소비를 최소화합니다.</p>
<h3 id="Post-processing" class="common-anchor-header">후처리</h3><p>이미지 검색 결과와 쿼리 이미지 간의 유사도를 높이기 위해 컬러 필터링과 키 레이블(소매 길이, 옷 길이, 칼라 스타일 등) 필터링을 사용하여 부적합한 이미지를 걸러냅니다. 또한 이미지 품질 평가 알고리즘을 사용하여 더 높은 품질의 이미지가 사용자에게 먼저 표시되도록 합니다.</p>
<h2 id="Application" class="common-anchor-header">애플리케이션<button data-href="#Application" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="User-uploads-and-image-search" class="common-anchor-header">사용자 업로드 및 이미지 검색</h3><p>사용자는 자신의 옷 사진을 찍어 Stylepedia 디지털 옷장에 업로드한 다음 업로드한 옷과 가장 유사한 제품 이미지를 검색할 수 있습니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/stylepedia_search_results_0568e20dc0.png" alt="stylepedia-search-results.png" class="doc-image" id="stylepedia-search-results.png" />
   </span> <span class="img-wrapper"> <span>스타일피디아 검색 결과.png</span> </span></p>
<h3 id="Outfit-suggestions" class="common-anchor-header">의상 제안</h3><p>스타일피디아 데이터베이스에서 유사성 검색을 수행하면 특정 패션 아이템이 포함된 패션 사진을 찾을 수 있습니다. 이는 누군가가 구매를 고려 중인 새 옷일 수도 있고, 자신의 컬렉션에서 다르게 입거나 매치할 수 있는 옷일 수도 있습니다. 그런 다음 자주 짝을 이루는 아이템을 클러스터링하여 의상 제안을 생성합니다. 예를 들어 검은색 바이커 재킷은 검은색 스키니 진과 같은 다양한 아이템과 어울릴 수 있습니다. 그런 다음 사용자는 선택한 공식에서 이 매치가 발생하는 관련 패션 사진을 찾아볼 수 있습니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/stylepedia_jacket_outfit_e84914da9e.png" alt="stylepedia-jacket-outfit.png" class="doc-image" id="stylepedia-jacket-outfit.png" />
   </span> <span class="img-wrapper"> <span>스타일피디아-자켓-아웃핏.png</span> </span></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/stylepedia_jacket_snapshot_25f53cc09b.png" alt="stylepedia-jacket-snapshot.png" class="doc-image" id="stylepedia-jacket-snapshot.png" />
   </span> <span class="img-wrapper"> <span>스타일피디아-자켓-스냅샷.png</span> </span></p>
<h3 id="Fashion-photograph-recommendations" class="common-anchor-header">패션 사진 추천</h3><p>사용자의 검색 기록, 좋아요, 디지털 옷장의 콘텐츠를 기반으로 유사성을 계산하여 사용자가 관심을 가질 만한 맞춤형 패션 사진 추천을 제공합니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/stylepedia_user_wardrobe_6770c856b9.png" alt="stylepedia-user-wardrobe.png" class="doc-image" id="stylepedia-user-wardrobe.png" />
   </span> <span class="img-wrapper"> <span>stylepedia-user-wardrobe.png</span> </span></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/stylepedia_streetsnap_rec_901601a34d.png" alt="stylepedia-streetsnap-rec.png" class="doc-image" id="stylepedia-streetsnap-rec.png" />
   </span> <span class="img-wrapper"> <span>stylepedia-streetsnap-rec.png</span> </span></p>
<p>Mozat는 딥 러닝과 컴퓨터 비전 방법론을 결합하여 빠르고 안정적이며 정확한 이미지 유사도 검색 시스템을 구축할 수 있었으며, Milvus를 사용하여 스타일피디아 앱의 다양한 기능을 구동할 수 있었습니다.</p>
<h2 id="Dont-be-a-stranger" class="common-anchor-header">낯선 사람이 되지 마세요<button data-href="#Dont-be-a-stranger" class="anchor-icon" translate="no">
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
<li><a href="https://github.com/milvus-io/milvus/">GitHub에서</a> Milvus를 찾거나 기여하세요.</li>
<li><a href="https://join.slack.com/t/milvusio/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ">Slack을</a> 통해 커뮤니티와 소통하세요.</li>
<li><a href="https://twitter.com/milvusio">트위터에서</a> 소통하세요.</li>
</ul>
