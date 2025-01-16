---
id: >-
  2022-06-23-How-Short-video-Platform-Likee-Removes-Duplicate-Videos-with-Milvus.md
title: 쇼트 비디오 플랫폼 Likee가 Milvus로 중복 비디오를 제거하는 방법
author: 'Xinyang Guo, Baoyu Han'
date: 2022-06-23T00:00:00.000Z
desc: Likee가 Milvus를 사용하여 중복 동영상을 밀리초 단위로 식별하는 방법을 알아보세요.
cover: >-
  assets.zilliz.com/How_Short_video_Platform_Likee_Removes_Duplicate_Videos_with_Milvus_07bd75ec82.png
tag: Scenarios
tags: Use Cases of Milvus
canonicalUrl: >-
  https://milvus.io/blog/2022-06-23-How-Short-video-Platform-Likee-Removes-Duplicate-Videos-with-Milvus.md
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/How_Short_video_Platform_Likee_Removes_Duplicate_Videos_with_Milvus_07bd75ec82.png" alt="Cover image" class="doc-image" id="cover-image" />
   </span> <span class="img-wrapper"> <span>표지 이미지</span> </span></p>
<blockquote>
<p>이 글은 BIGO의 엔지니어인 신양 구오와 바오유 한이 작성하고 <a href="https://www.linkedin.cn/incareer/in/rosie-zhang-694528149">로지 장이</a> 번역했습니다.</p>
</blockquote>
<p>BIGO<a href="https://www.bigo.sg/">Technology</a> (BIGO)는 싱가포르에서 가장 빠르게 성장하는 기술 기업 중 하나입니다. 인공지능 기술을 기반으로 하는 BIGO의 동영상 기반 제품과 서비스는 150여 개국에서 4억 명 이상의 사용자를 확보하며 전 세계적으로 큰 인기를 얻고 있습니다. 여기에는 <a href="https://www.bigo.tv/bigo_intro/en.html?hk=true">Bigo Live</a> (라이브 스트리밍)와 <a href="https://likee.video/">Likee</a> (숏폼 동영상)가 포함됩니다.</p>
<p>Likee는 사용자가 자신의 순간을 공유하고, 자신을 표현하고, 전 세계와 소통할 수 있는 글로벌 쇼트 비디오 제작 플랫폼입니다. 사용자 경험을 향상시키고 사용자에게 더 높은 품질의 콘텐츠를 추천하기 위해 Likee는 매일 사용자가 생성하는 엄청난 양의 동영상에서 중복 동영상을 걸러내야 하는데, 이는 결코 쉬운 일이 아닙니다.</p>
<p>이 블로그에서는 BIGO가 오픈 소스 벡터 데이터베이스인 <a href="https://milvus.io">Milvus를</a> 사용하여 중복 동영상을 효과적으로 제거하는 방법을 소개합니다.</p>
<p><strong>바로가기:</strong></p>
<ul>
<li><a href="#Overview">개요</a></li>
<li><a href="#Video-deduplication-workflow">동영상 중복 제거 워크플로</a></li>
<li><a href="#System-architecture">시스템 아키텍처</a></li>
<li><a href="#Using-Milvus-vector-database-to-power-similarity-search">Milvus를 사용하여 유사도 검색 강화하기</a></li>
</ul>
<custom-h1>개요</custom-h1><p>Milvus는 초고속 벡터 검색 기능을 갖춘 오픈 소스 벡터 데이터베이스입니다. Milvus를 기반으로 하는 Likee는 높은 리콜률을 보장하면서 200ms 이내에 검색을 완료할 수 있습니다. 한편, Likee는 <a href="https://milvus.io/docs/v2.0.x/scaleout.md#Scale-a-Milvus-Cluster">Milvus를 수평적으로 확장함으로써</a> 벡터 쿼리의 처리량을 성공적으로 증가시켜 효율성을 더욱 향상시켰습니다.</p>
<custom-h1>비디오 중복 제거 워크플로</custom-h1><p>Likee는 중복 동영상을 어떻게 식별하나요? 쿼리 동영상이 Likee의 시스템에 입력될 때마다 15~20개의 프레임으로 잘리고 각 프레임이 특징 벡터로 변환됩니다. 그런 다음 Likee는 7억 개의 벡터 데이터베이스를 검색하여 가장 유사한 상위 K개의 벡터를 찾습니다. 상위 K개의 벡터는 각각 데이터베이스의 동영상에 해당합니다. Likee는 추가로 정밀한 검색을 수행하여 최종 결과를 얻고 삭제할 동영상을 결정합니다.</p>
<custom-h1>시스템 아키텍처</custom-h1><p>Milvus를 사용하여 Likee의 동영상 중복 제거 시스템이 어떻게 작동하는지 자세히 살펴봅시다. 아래 다이어그램에서 볼 수 있듯이, Likee에 업로드된 새로운 동영상은 데이터 스토리지 시스템인 Kafka에 실시간으로 기록되어 Kafka 소비자들이 소비하게 됩니다. 이러한 동영상의 특징 벡터는 비정형 데이터(동영상)를 특징 벡터로 변환하는 딥러닝 모델을 통해 추출됩니다. 이러한 특징 벡터는 시스템에서 패키징되어 유사성 감사자에게 전송됩니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Likee_1_6f7ebcd8fc.png" alt="Architechure of Likee's video de-duplication system" class="doc-image" id="architechure-of-likee's-video-de-duplication-system" />
   </span> <span class="img-wrapper"> <span>Likee의 동영상 중복제거 시스템 구조도</span> </span></p>
<p>추출된 특징 벡터는 Milvus에 의해 인덱싱되어 Ceph에 저장된 후, 추가 검색을 위해 <a href="https://milvus.io/blog/deep-dive-5-real-time-query.md">Milvus 쿼리 노드에 의해 로드됩니다</a>. 이러한 특징 벡터의 해당 비디오 ID는 실제 필요에 따라 TiDB 또는 Pika에 동시에 저장됩니다.</p>
<h3 id="Using-Milvus-vector-database-to-power-similarity-search" class="common-anchor-header">Milvus 벡터 데이터베이스를 사용해 유사도 검색 강화하기</h3><p>유사한 벡터를 검색할 때, 수십억 개의 기존 데이터와 매일 생성되는 대량의 새로운 데이터는 벡터 검색 엔진의 기능에 큰 도전이 됩니다. Likee는 철저한 분석 끝에 결국 고성능과 높은 회상률을 자랑하는 분산형 벡터 검색 엔진인 Milvus를 벡터 유사도 검색을 위한 엔진으로 선택했습니다.</p>
<p>아래 그림과 같이 유사도 검색의 절차는 다음과 같습니다:</p>
<ol>
<li><p>먼저 Milvus는 일괄 검색을 수행하여 새 동영상에서 추출된 여러 특징 벡터 각각에 대해 상위 100개의 유사한 벡터를 불러옵니다. 각 유사 벡터는 해당 동영상 ID에 바인딩됩니다.</p></li>
<li><p>둘째, Milvus는 비디오 ID를 비교하여 중복 비디오를 제거하고 나머지 비디오의 특징 벡터를 TiDB 또는 Pika에서 검색합니다.</p></li>
<li><p>마지막으로 Milvus는 검색된 각 특징 벡터 세트와 쿼리 동영상의 특징 벡터 간의 유사도를 계산하고 점수를 매깁니다. 가장 높은 점수를 받은 동영상 ID가 결과로 반환됩니다. 이로써 동영상 유사도 검색이 완료됩니다.</p></li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/02_a24d251c8f.png" alt="Procedure of a similarity search" class="doc-image" id="procedure-of-a-similarity-search" />
   </span> <span class="img-wrapper"> <span>유사도 검색 절차</span> </span></p>
<p>밀버스는 고성능 벡터 검색 엔진으로서 Likee의 동영상 중복 제거 시스템에서 탁월한 성능을 발휘하여 BIGO의 짧은 동영상 비즈니스 성장에 큰 원동력이 되었습니다. 동영상 비즈니스 측면에서는 불법 콘텐츠 차단이나 개인 맞춤형 동영상 추천 등 Milvus를 적용할 수 있는 다양한 시나리오가 있습니다. 비고와 밀버스는 앞으로 더 많은 영역에서 협력할 수 있기를 기대하고 있습니다.</p>
