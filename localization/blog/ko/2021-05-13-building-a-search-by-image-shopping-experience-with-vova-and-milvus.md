---
id: building-a-search-by-image-shopping-experience-with-vova-and-milvus.md
title: VOVA 및 Milvus로 이미지 검색 쇼핑 환경 구축하기
author: milvus
date: 2021-05-13T08:44:05.528Z
desc: 이커머스 플랫폼 VOVA에서 오픈소스 벡터 데이터베이스인 Milvus를 사용하여 이미지 기반 쇼핑을 강화한 방법을 알아보세요.
cover: assets.zilliz.com/vova_thumbnail_db2d6c0c9c.jpg
tag: Scenarios
canonicalUrl: >-
  https://zilliz.com/blog/building-a-search-by-image-shopping-experience-with-vova-and-milvus
---
<custom-h1>VOVA 및 Milvus로 이미지 검색 쇼핑 환경 구축하기</custom-h1><p>건너뛰기:</p>
<ul>
<li><a href="#building-a-search-by-image-shopping-experience-with-vova-and-milvus">VOVA 및 Milvus로 이미지로 검색하는 쇼핑 환경 구축하기</a><ul>
<li><a href="#how-does-image-search-work">이미지 검색은 어떻게 작동하나요?</a>- <a href="#system-process-of-vovas-search-by-image-functionality"><em>VOVA의 이미지별 검색 기능의 시스템 프로세스.</em></a></li>
<li><a href="#target-detection-using-the-yolo-model">YOLO 모델을 사용한 타겟 탐지</a>- <a href="#yolo-network-architecture"><em>YOLO 네트워크 아키텍처.</em></a></li>
<li><a href="#image-feature-vector-extraction-with-resnet">ResNet을 이용한 이미지 특징 벡터 추출</a>- <a href="#resnet-structure"><em>ResNet 구조.</em></a></li>
<li><a href="#vector-similarity-search-powered-by-milvus">Milvus를 이용한 벡터 유사도 검색</a>- <a href="#mishards-architecture-in-milvus"><em>Milvus의 미샤드 아키텍처.</em></a></li>
<li><a href="#vovas-shop-by-image-tool">VOVA의 이미지별</a> <a href="#screenshots-of-vovas-search-by-image-shopping-tool"><em>쇼핑</em></a><a href="#vovas-shop-by-image-tool">도구</a>- <a href="#screenshots-of-vovas-search-by-image-shopping-tool"><em>VOVA의 이미지별 쇼핑 도구 스크린샷.</em></a></li>
<li><a href="#reference">참고</a></li>
</ul></li>
</ul>
<p>2020년 온라인 쇼핑은 코로나 바이러스 팬데믹으로 인해 <a href="https://www.digitalcommerce360.com/2021/02/15/ecommerce-during-coronavirus-pandemic-in-charts/">44% 증가하며</a> 급증했습니다. 사람들이 사회적 거리를 두고 낯선 사람과의 접촉을 피하려고 노력하면서 비대면 배송은 많은 소비자에게 매우 바람직한 옵션이 되었습니다. 이러한 인기로 인해 사람들은 기존의 키워드 검색으로는 설명하기 어려운 틈새 상품을 포함하여 더욱 다양한 상품을 온라인으로 구매하게 되었습니다.</p>
<p>키워드 기반 검색의 한계를 극복하기 위해 기업은 사용자가 검색 시 단어 대신 이미지를 사용할 수 있는 이미지 검색 엔진을 구축할 수 있습니다. 이를 통해 사용자는 설명하기 어려운 상품을 찾을 수 있을 뿐만 아니라 실생활에서 마주치는 물건을 쇼핑하는 데에도 도움이 됩니다. 이 기능은 독특한 사용자 경험을 구축하는 데 도움이 되며 고객이 선호하는 일반적인 편의성을 제공합니다.</p>
<p>VOVA는 합리적인 가격과 사용자에게 긍정적인 쇼핑 경험을 제공하는 데 중점을 둔 신흥 이커머스 플랫폼으로, 수백만 개의 제품을 리스팅하고 20개 언어와 35개 주요 통화를 지원합니다. 이 회사는 사용자의 쇼핑 경험을 향상시키기 위해 Milvus를 사용하여 이커머스 플랫폼에 이미지 검색 기능을 구축했습니다. 이 문서에서는 VOVA가 Milvus를 통해 이미지 검색 엔진을 성공적으로 구축한 방법을 살펴봅니다.</p>
<p><br/></p>
<h3 id="How-does-image-search-work" class="common-anchor-header">이미지 검색은 어떻게 작동하나요?</h3><p>VOVA의 이미지별 쇼핑 시스템은 회사 인벤토리에서 사용자가 업로드한 것과 유사한 제품 이미지를 검색합니다. 다음 차트는 시스템 프로세스의 두 단계, 즉 데이터 가져오기 단계(파란색)와 쿼리 단계(주황색)를 보여줍니다:</p>
<ol>
<li>YOLO 모델을 사용하여 업로드된 사진에서 대상을 감지합니다;</li>
<li>ResNet을 사용해 감지된 대상에서 특징 벡터를 추출합니다;</li>
<li>벡터 유사성 검색을 위해 Milvus를 사용합니다.</li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Vova_1_47ee6f2da9.png" alt="Vova-1.png" class="doc-image" id="vova-1.png" />
   </span> <span class="img-wrapper"> <span>Vova-1.png</span> </span></p>
<p><br/></p>
<h3 id="Target-detection-using-the-YOLO-model" class="common-anchor-header">YOLO 모델을 사용한 대상 감지</h3><p>현재 Android와 iOS의 VOVA 모바일 앱은 이미지 검색을 지원합니다. 이 회사는 사용자가 업로드한 이미지에서 객체를 감지하기 위해 YOLO(You only look once)라는 최첨단 실시간 객체 감지 시스템을 사용합니다. YOLO 모델은 현재 다섯 번째 반복을 거치고 있습니다.</p>
<p>YOLO는 단 하나의 컨볼루션 신경망(CNN)만을 사용하여 다양한 대상의 카테고리와 위치를 예측하는 1단계 모델입니다. 작고 컴팩트하며 모바일 사용에 적합합니다.</p>
<p>YOLO는 컨볼루션 레이어를 사용하여 특징을 추출하고 완전히 연결된 레이어를 사용하여 예측 값을 얻습니다. GooLeNet 모델에서 영감을 얻은 YOLO의 CNN은 24개의 컨볼루션 레이어와 2개의 완전 연결 레이어를 포함합니다.</p>
<p>다음 그림에서 볼 수 있듯이 448 × 448 입력 이미지는 여러 컨볼루션 레이어와 풀링 레이어를 통해 7 × 7 × 1024 차원 텐서(아래 세 번째에서 마지막 큐브에 표시)로 변환된 다음, 완전히 연결된 두 개의 레이어를 통해 7 × 7 × 30 차원 텐서 출력으로 변환됩니다.</p>
<p>YOLO P의 예상 출력은 2차원 텐서이며, 그 모양은 [batch,7 ×7 ×30]입니다. 슬라이싱을 사용하면 P[:,0:7×7×20]은 범주 확률, P[:,7×7×20:7×7×(20+2)]은 신뢰도, P[:,7×7×(20+2)]:]은 바운딩 박스의 예측 결과입니다.</p>
<p>![vova-2.png](https://assets.zilliz.com/vova_2_1ccf38f721.png &quot;YOLO 네트워크 아키텍처&quot;)</p>
<p><br/></p>
<h3 id="Image-feature-vector-extraction-with-ResNet" class="common-anchor-header">ResNet을 사용한 이미지 특징 벡터 추출</h3><p>VOVA는 광범위한 제품 이미지 라이브러리와 사용자가 업로드한 사진에서 특징 벡터를 추출하기 위해 잔류 신경망(ResNet) 모델을 채택했습니다. ResNet은 학습 네트워크의 깊이가 증가할수록 네트워크의 정확도가 감소하기 때문에 한계가 있습니다. 아래 이미지는 단락 메커니즘을 통해 잔여 유닛을 포함하도록 수정된 VGG19 모델(VGG 모델의 변형)을 실행하는 ResNet의 모습을 보여줍니다. VGG는 2014년에 제안되었으며 14개의 레이어만 포함하지만, ResNet은 1년 후에 출시되어 최대 152개의 레이어를 포함할 수 있습니다.</p>
<p>ResNet 구조는 수정 및 확장이 용이합니다. 블록의 채널 수와 쌓인 블록의 수를 변경함으로써 네트워크의 폭과 깊이를 쉽게 조정하여 다양한 표현 능력을 가진 네트워크를 얻을 수 있습니다. 이를 통해 학습 깊이가 깊어질수록 정확도가 떨어지는 네트워크 퇴화 효과를 효과적으로 해결할 수 있습니다. 충분한 학습 데이터를 확보하면 네트워크를 점진적으로 심화시키면서 표현 성능이 향상된 모델을 얻을 수 있습니다. 모델 학습을 통해 각 사진마다 특징을 추출하고 256차원 부동소수점 벡터로 변환합니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/vova_3_df4b810281.png" alt="vova-3.png" class="doc-image" id="vova-3.png" />
   </span> <span class="img-wrapper"> <span>vova-3.png</span> </span></p>
<p><br/></p>
<h3 id="Vector-similarity-search-powered-by-Milvus" class="common-anchor-header">Milvus가 제공하는 벡터 유사도 검색</h3><p>VOVA의 제품 이미지 데이터베이스에는 3,000만 장의 사진이 포함되어 있으며 빠르게 증가하고 있습니다. 이 방대한 데이터 세트에서 가장 유사한 제품 이미지를 빠르게 검색하기 위해 Milvus를 사용하여 벡터 유사도 검색을 수행합니다. 다양한 최적화를 통해 Milvus는 벡터 데이터를 관리하고 머신 러닝 애플리케이션을 구축하는 빠르고 간소화된 접근 방식을 제공합니다. Milvus는 인기 있는 인덱스 라이브러리(예: Faiss, Annoy)와의 통합을 제공하고, 여러 인덱스 유형 및 거리 메트릭을 지원하며, 여러 언어로 된 SDK를 보유하고 있고, 벡터 데이터 관리를 위한 다양한 API를 제공합니다.</p>
<p>Milvus는 1조 개에 달하는 벡터 데이터 세트에 대해 밀리초 단위로 유사도 검색을 수행할 수 있으며, nq=1일 때 쿼리 시간은 1.5초 미만, 평균 일괄 쿼리 시간은 0.08초 미만입니다. 이미지 검색 엔진을 구축하기 위해 VOVA는 고가용성 서버 클러스터를 구현하기 위해 Milvus의 샤딩 미들웨어 솔루션인 Mishards의 설계를 참조했습니다(시스템 설계는 아래 차트 참조). Milvus 클러스터의 수평적 확장성을 활용함으로써 대규모 데이터 세트에 대한 높은 쿼리 성능에 대한 프로젝트 요구 사항을 충족할 수 있었습니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/vova_4_e305f1955c.png" alt="vova-4.png" class="doc-image" id="vova-4.png" />
   </span> <span class="img-wrapper"> <span>vova-4.png</span> </span></p>
<h3 id="VOVAs-shop-by-image-tool" class="common-anchor-header">이미지 도구로 살펴보는 VOVA의 상점</h3><p>아래 스크린샷은 회사의 Android 앱에서 이미지 쇼핑 도구로 VOVA를 검색하는 모습을 보여줍니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/vova_5_c4c25a3bae.png" alt="vova-5.png" class="doc-image" id="vova-5.png" />
   </span> <span class="img-wrapper"> <span>vova-5.png</span> </span></p>
<p>더 많은 사용자가 제품을 검색하고 사진을 업로드함에 따라 VOVA는 시스템을 구동하는 모델을 계속 최적화할 것입니다. 또한 사용자의 온라인 쇼핑 경험을 더욱 향상시킬 수 있는 새로운 Milvus 기능을 통합할 예정입니다.</p>
<h3 id="Reference" class="common-anchor-header">참고</h3><p><strong>YOLO:</strong></p>
<p>https://arxiv.org/pdf/1506.02640.pdf</p>
<p>https://arxiv.org/pdf/1612.08242.pdf</p>
<p><strong>ResNet:</strong></p>
<p>https://arxiv.org/abs/1512.03385</p>
<p><strong>Milvus:</strong></p>
<p>https://milvus.io/docs</p>
