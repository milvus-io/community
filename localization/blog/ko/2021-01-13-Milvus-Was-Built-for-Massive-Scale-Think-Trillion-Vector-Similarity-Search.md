---
id: Milvus-Was-Built-for-Massive-Scale-Think-Trillion-Vector-Similarity-Search.md
title: 밀버스는 대규모(조 단위) 벡터 유사도 검색을 위해 구축되었습니다.
author: milvus
date: 2021-01-13T08:56:00.480Z
desc: >-
  다음 AI 또는 머신 러닝 프로젝트에서 오픈 소스의 강력한 기능을 살펴보세요. Milvus로 대규모 벡터 데이터를 관리하고 유사도 검색을
  강화하세요.
cover: assets.zilliz.com/1_9a6be0b54f.jpg
tag: Engineering
canonicalUrl: >-
  https://zilliz.com/blog/Milvus-Was-Built-for-Massive-Scale-Think-Trillion-Vector-Similarity-Search
---
<custom-h1>대규모(조 단위) 벡터 유사도 검색을 위해 구축된 Milvus</custom-h1><p>매일 헤아릴 수 없을 만큼 많은 비즈니스 크리티컬 인사이트가 기업들이 자체 데이터를 이해하지 못해 낭비되고 있습니다. 텍스트, 이미지, 비디오, 오디오와 같은 비정형 데이터는 전체 데이터의 80%를 차지하는 것으로 추정되지만, 이 중 1%만이 분석되고 있습니다. 다행히도 <a href="https://medium.com/unstructured-data-service/the-easiest-way-to-search-among-1-billion-image-vectors-d6faf72e361f">인공지능(AI)</a>, 오픈 소스 소프트웨어, 무어의 법칙으로 인해 그 어느 때보다 머신 스케일 분석에 대한 접근성이 높아지고 있습니다. 벡터 유사도 검색을 사용하면 방대한 비정형 데이터 세트에서 가치를 추출할 수 있습니다. 이 기술은 비정형 데이터를 실시간으로 처리하고 분석할 수 있는 기계 친화적인 수치 데이터 형식인 특징 벡터로 변환하는 것을 포함합니다.</p>
<p>벡터 유사도 검색은 이커머스, 보안, 신약 개발 등 다양한 분야에서 활용되고 있습니다. 이러한 솔루션은 수백만, 수십억 또는 수조 개의 벡터가 포함된 동적 데이터 세트에 의존하며, 그 유용성은 거의 즉각적인 결과를 반환하는 데 달려 있는 경우가 많습니다. <a href="https://milvus.io/">Milvus는</a> 대규모 벡터 데이터 세트를 효율적으로 관리하고 검색하기 위해 처음부터 구축된 오픈 소스 벡터 데이터 관리 솔루션입니다. 이 문서에서는 벡터 데이터 관리에 대한 Milvus의 접근 방식과 이 플랫폼이 벡터 유사성 검색에 어떻게 최적화되었는지를 다룹니다.</p>
<p><strong>바로가기:</strong></p>
<ul>
<li><a href="#milvus-was-built-for-massive-scale-think-trillion-vector-similarity-search">대규모(조 단위) 벡터 유사도 검색을 위해 구축된 Milvus</a><ul>
<li><a href="#lsm-trees-keep-dynamic-data-management-efficient-at-massive-scales">LSM 트리는 대규모의 동적 데이터 관리를 효율적으로 유지합니다</a>- <a href="#a-segment-of-10-dimensional-vectors-in-milvus"><em>Milvus의 10차원 벡터의 한 부분.</em></a></li>
<li><a href="#data-management-is-optimized-for-rapid-access-and-limited-fragmentation">빠른 액세스와 제한된 조각화를 위해 최적화된 데이터 관리</a>- <a href="#an-illustration-of-inserting-vectors-in-milvus"><em>Milvus에서 벡터를 삽입하는 그림</em></a>- <a href="#queried-data-files-before-the-merge"><em>병합 전 쿼리된 데이터 파일</em></a>- <a href="#queried-data-files-after-the-merge"><em>병합 후 쿼리된 데이터 파일.</em></a></li>
<li><a href="#similarity-searched-is-accelerated-by-indexing-vector-data">벡터 데이터 인덱싱을 통해 유사도 검색이 가속화됩니다.</a></li>
<li><a href="#learn-more-about-milvus">Milvus에 대해 자세히 알아보기</a></li>
</ul></li>
</ul>
<h3 id="LSM-trees-keep-dynamic-data-management-efficient-at-massive-scales" class="common-anchor-header">대규모의 동적 데이터를 효율적으로 관리하는 LSM 트리</h3><p>효율적인 동적 데이터 관리를 제공하기 위해 Milvus는 로그 구조 병합 트리(LSM 트리) 데이터 구조를 사용합니다. LSM 트리는 삽입 및 삭제 횟수가 많은 데이터에 액세스하는 데 매우 적합합니다. 고성능 동적 데이터 관리에 도움이 되는 LSM 트리의 특정 속성에 대한 자세한 내용은 해당 트리의 발명자가 발표한 <a href="http://paperhub.s3.amazonaws.com/18e91eb4db2114a06ea614f0384f2784.pdf">원본 연구를</a> 참조하세요. LSM 트리는 <a href="https://cloud.google.com/bigtable">BigTable</a>, <a href="https://cassandra.apache.org/">Cassandra</a>, <a href="https://rocksdb.org/">RocksDB를</a> 비롯한 많은 유명 데이터베이스에서 사용하는 기본 데이터 구조입니다.</p>
<p>Milvus에서 벡터는 엔티티로 존재하며 세그먼트에 저장됩니다. 각 세그먼트에는 하나에서 최대 8백만 개의 엔티티가 포함됩니다. 각 엔티티에는 고유 ID와 벡터 입력을 위한 필드가 있으며, 후자는 1에서 32768개의 차원을 나타냅니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_Milvus_Was_Built_for_Massive_Scale_Think_Trillion_Vector_Similarity_Search_2_492d31c7a0.png" alt="Blog_Milvus Was Built for Massive-Scale (Think Trillion) Vector Similarity Search_2.png" class="doc-image" id="blog_milvus-was-built-for-massive-scale-(think-trillion)-vector-similarity-search_2.png" />
   </span> <span class="img-wrapper"> <span>블로그_밀버스는 대규모(조 단위) 벡터 유사도 검색을 위해 구축되었습니다_2.png</span> </span></p>
<h3 id="Data-management-is-optimized-for-rapid-access-and-limited-fragmentation" class="common-anchor-header">빠른 액세스와 제한된 조각화를 위해 최적화된 데이터 관리</h3><p>삽입 요청을 받으면 Milvus는 <a href="https://milvus.io/docs/v0.11.0/write_ahead_log.md">미리 쓰기 로그(WAL)</a>에 새 데이터를 씁니다. 요청이 로그 파일에 성공적으로 기록되면 데이터는 변경 가능한 버퍼에 기록됩니다. 마지막으로 세 가지 트리거 중 하나가 발생하면 버퍼가 변경 불가능 상태가 되어 디스크로 플러시됩니다:</p>
<ol>
<li><strong>시간 간격:</strong> 데이터가 정의된 간격(기본값은 1초)에 따라 정기적으로 디스크에 플러시됩니다.</li>
<li><strong>버퍼 크기:</strong> 누적된 데이터가 변경 가능한 버퍼의 상한(128MB)에 도달합니다.</li>
<li><strong>수동 트리거:</strong> 클라이언트가 플러시 기능을 호출하면 데이터가 수동으로 디스크에 플러시됩니다.</li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_Milvus_Was_Built_for_Massive_Scale_Think_Trillion_Vector_Similarity_Search_3_852dc2c9bb.png" alt="Blog_Milvus Was Built for Massive-Scale (Think Trillion) Vector Similarity Search_3.png" class="doc-image" id="blog_milvus-was-built-for-massive-scale-(think-trillion)-vector-similarity-search_3.png" />
   </span> <span class="img-wrapper"> <span>대규모(수 조 단위) 벡터 유사도 검색을 위해 구축된 Blog_Milvus_3.png</span> </span></p>
<p>사용자는 한 번에 수천 또는 수백만 개의 벡터를 추가할 수 있으며, 새로운 벡터가 삽입될 때마다 다양한 크기의 데이터 파일을 생성합니다. 이로 인해 데이터 관리가 복잡해지고 벡터 유사도 검색 속도가 느려질 수 있는 파편화가 발생합니다. 과도한 데이터 조각화를 방지하기 위해 Milvus는 결합된 파일 크기가 사용자가 구성할 수 있는 한도(예: 1GB)에 도달할 때까지 데이터 세그먼트를 지속적으로 병합합니다. 예를 들어, 상한이 1GB인 경우 1억 개의 512차원 벡터를 삽입하면 데이터 파일은 약 200개에 불과합니다.</p>
<p>벡터를 삽입하고 동시에 검색하는 증분 계산 시나리오에서 Milvus는 새로 삽입된 벡터 데이터를 다른 데이터와 병합하기 전에 즉시 검색에 사용할 수 있도록 합니다. 데이터 병합 후에는 원본 데이터 파일이 제거되고 대신 새로 생성된 병합된 파일이 검색에 사용됩니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_Milvus_Was_Built_for_Massive_Scale_Think_Trillion_Vector_Similarity_Search_4_6bef3d914c.png" alt="Blog_Milvus Was Built for Massive-Scale (Think Trillion) Vector Similarity Search_4.png" class="doc-image" id="blog_milvus-was-built-for-massive-scale-(think-trillion)-vector-similarity-search_4.png" />
   </span> <span class="img-wrapper"> <span>대규모(수조 개) 벡터 유사도 검색을 위해 구축된 Blog_Milvus_4.png</span> </span></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_Milvus_Was_Built_for_Massive_Scale_Think_Trillion_Vector_Similarity_Search_5_3851c2d789.png" alt="Blog_Milvus Was Built for Massive-Scale (Think Trillion) Vector Similarity Search_5.png" class="doc-image" id="blog_milvus-was-built-for-massive-scale-(think-trillion)-vector-similarity-search_5.png" />
   </span> <span class="img-wrapper"> <span>블로그_밀버스는 대규모(조 단위) 벡터 유사도 검색을 위해 구축되었습니다_5.png</span> </span></p>
<h3 id="Similarity-searched-is-accelerated-by-indexing-vector-data" class="common-anchor-header">벡터 데이터 인덱싱을 통해 유사도 검색을 가속화합니다.</h3><p>기본적으로 Milvus는 벡터 데이터를 쿼리할 때 무차별 검색을 사용합니다. 전수 검색이라고도 하는 이 방식은 쿼리를 실행할 때마다 모든 벡터 데이터를 검사합니다. 수백만 또는 수십억 개의 다차원 벡터가 포함된 데이터 세트의 경우, 이 프로세스는 너무 느려 대부분의 유사도 검색 시나리오에서 유용하지 않습니다. 쿼리 시간을 단축하기 위해 알고리즘을 사용하여 벡터 인덱스를 구축합니다. 인덱싱된 데이터는 유사한 벡터가 서로 가깝도록 클러스터링되어 유사도 검색 엔진이 전체 데이터의 일부만 쿼리할 수 있으므로 정확도는 유지하면서 쿼리 시간을 대폭 단축할 수 있습니다.</p>
<p>Milvus에서 지원하는 대부분의 벡터 인덱스 유형은 근사 최인접 이웃(ANN) 검색 알고리즘을 사용합니다. 수많은 ANN 인덱스가 있으며, 각 인덱스에는 성능, 정확도, 저장 공간 요구 사항 간의 절충점이 있습니다. Milvus는 양자화, 그래프, 트리 기반 인덱스를 지원하며, 모두 서로 다른 애플리케이션 시나리오에 적합합니다. 인덱스 구축과 지원하는 특정 유형의 벡터 인덱스에 대한 자세한 내용은 Milvus의 <a href="https://milvus.io/docs/v0.11.0/index.md#CPU">기술 문서를</a> 참조하세요.</p>
<p>인덱스 구축은 많은 양의 메타데이터를 생성합니다. 예를 들어, 200개의 데이터 파일에 저장된 1억 개의 512차원 벡터를 인덱싱하면 200개의 인덱스 파일이 추가로 생성됩니다. 파일 상태를 효율적으로 확인하고 새로운 파일을 삭제하거나 삽입하기 위해서는 효율적인 메타데이터 관리 시스템이 필요합니다. Milvus는 데이터베이스에서 소량의 데이터를 업데이트하거나 삭제하는 데 적합한 데이터 처리 기술인 온라인 트랜잭션 처리(OLTP)를 사용합니다. Milvus는 SQLite 또는 MySQL을 사용하여 메타데이터를 관리합니다.</p>
<h3 id="Learn-more-about-Milvus" class="common-anchor-header">Milvus에 대해 자세히 알아보기</h3><p>Milvus는 리눅스 재단의 산하 조직인 <a href="https://lfaidata.foundation/">LF AI &amp; Data에서</a> 현재 인큐베이션 중인 오픈 소스 벡터 데이터 관리 플랫폼입니다. Milvus는 이 프로젝트를 시작한 데이터 과학 소프트웨어 회사인 <a href="https://zilliz.com">Zilliz가</a> 2019년에 오픈 소스로 공개했습니다. Milvus에 대한 자세한 내용은 <a href="https://milvus.io/">웹사이트에서</a> 확인할 수 있습니다. 벡터 유사도 검색에 관심이 있거나 AI를 사용하여 비정형 데이터의 잠재력을 활용하는 데 관심이 있다면 GitHub의 <a href="https://github.com/milvus-io">오픈 소스 커뮤니티에</a> 가입하세요.</p>
