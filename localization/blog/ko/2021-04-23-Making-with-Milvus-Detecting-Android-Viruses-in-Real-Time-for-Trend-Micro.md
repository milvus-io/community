---
id: Making-with-Milvus-Detecting-Android-Viruses-in-Real-Time-for-Trend-Micro.md
title: 트렌드 마이크로를 위해 실시간으로 안드로이드 바이러스를 탐지하는 Milvus로 만들기
author: milvus
date: 2021-04-23T06:46:13.732Z
desc: 실시간 바이러스 탐지를 통해 중요 데이터에 대한 위협을 완화하고 사이버 보안을 강화하기 위해 Milvus를 사용하는 방법을 알아보세요.
cover: assets.zilliz.com/blog_Trend_Micro_5c8ba3e2ce.jpg
tag: Scenarios
canonicalUrl: >-
  https://zilliz.com/blog/Making-with-Milvus-Detecting-Android-Viruses-in-Real-Time-for-Trend-Micro
---
<custom-h1>Milvus로 만들기: 트렌드마이크로의 실시간 안드로이드 바이러스 탐지</custom-h1><p>사이버 보안은 개인과 기업 모두에게 지속적인 위협으로 남아 있으며, 2020년에는 <a href="https://www.getapp.com/resources/annual-data-security-report/">기업의 86%가</a> 데이터 개인 정보 보호에 대한 우려가 증가하고 <a href="https://merchants.fiserv.com/content/dam/firstdata/us/en/documents/pdf/digital-commerce-cybersecurity-ebook.pdf">소비자의 23%만이</a> 자신의 개인 데이터가 매우 안전하다고 생각하는 등 사이버 보안은 개인과 기업 모두에 대한 지속적인 위협으로 남아 있습니다. 멀웨어가 점점 더 널리 퍼지고 정교해짐에 따라 위협 탐지에 대한 사전 예방적 접근 방식이 필수적이 되었습니다. <a href="https://www.trendmicro.com/en_us/business.html">트렌드마이크로는</a> 하이브리드 클라우드 보안, 네트워크 방어, 중소기업 보안 및 엔드포인트 보안 분야의 글로벌 리더입니다. 이 회사는 바이러스로부터 Android 디바이스를 보호하기 위해 Google Play 스토어에서 APK(Android 애플리케이션 패키지)를 알려진 멀웨어 데이터베이스와 비교하는 모바일 앱인 Trend Micro Mobile Security를 구축했습니다. 바이러스 탐지 시스템은 다음과 같이 작동합니다:</p>
<ul>
<li>Google Play 스토어에서 외부 APK(Android 애플리케이션 패키지)를 크롤링합니다.</li>
<li>알려진 멀웨어는 벡터로 변환되어 <a href="https://www.milvus.io/docs/v1.0.0/overview.md">Milvus에</a> 저장됩니다.</li>
<li>새로운 APK도 벡터로 변환한 다음 유사성 검색을 사용하여 멀웨어 데이터베이스와 비교합니다.</li>
<li>APK 벡터가 멀웨어 벡터와 유사한 경우 앱은 사용자에게 바이러스 및 위협 수준에 대한 자세한 정보를 제공합니다.</li>
</ul>
<p>이 시스템이 작동하려면 방대한 벡터 데이터 세트에 대해 실시간으로 매우 효율적인 유사성 검색을 수행해야 합니다. 처음에 트렌드 마이크로는 <a href="https://www.mysql.com/">MySQL을</a> 사용했습니다. 그러나 비즈니스가 확장됨에 따라 데이터베이스에 저장된 악성 코드가 포함된 APK의 수도 증가했습니다. 이 회사의 알고리즘 팀은 MySQL이 빠르게 성장하자 대체 벡터 유사성 검색 솔루션을 찾기 시작했습니다.</p>
<p><br/></p>
<h3 id="Comparing-vector-similarity-search-solutions" class="common-anchor-header">벡터 유사도 검색 솔루션 비교</h3><p>사용 가능한 벡터 유사도 검색 솔루션은 여러 가지가 있으며, 그 중 상당수는 오픈 소스입니다. 프로젝트마다 상황은 다르지만, 대부분의 사용자는 광범위한 구성이 필요한 단순한 라이브러리보다는 비정형 데이터 처리 및 분석을 위해 구축된 벡터 데이터베이스를 활용하는 것이 더 유리합니다. 아래에서는 인기 있는 벡터 유사도 검색 솔루션 몇 가지를 비교하고 Trend Micro가 Milvus를 선택한 이유를 설명합니다.</p>
<h4 id="Faiss" class="common-anchor-header">Faiss</h4><p><a href="https://ai.facebook.com/tools/faiss/">Faiss는</a> Facebook AI Research에서 개발한 라이브러리로, 고밀도 벡터의 효율적인 유사도 검색과 클러스터링을 가능하게 합니다. 이 라이브러리의 알고리즘은 모든 크기의 검색 벡터를 집합으로 포함합니다. Faiss는 파이썬/넘피용 래퍼와 함께 C++로 작성되었으며, IndexFlatL2, IndexFlatIP, HNSW, IVF를 비롯한 여러 인덱스를 지원합니다.</p>
<p>Faiss는 매우 유용한 도구이지만 한계가 있습니다. 벡터 데이터 세트를 관리하기 위한 데이터베이스가 아닌 기본 알고리즘 라이브러리로만 작동합니다. 또한 대부분의 클라우드 기반 서비스의 핵심 기능인 분산 버전, 모니터링 서비스, SDK 또는 고가용성을 제공하지 않습니다.</p>
<h4 id="Plug-ins-based-on-Faiss--other-ANN-search-libraries" class="common-anchor-header">Faiss 및 기타 ANN 검색 라이브러리 기반 플러그인</h4><p>Faiss, NMSLIB 및 기타 ANN 검색 라이브러리 위에 구축된 몇 가지 플러그인이 있으며, 이 플러그인은 이를 구동하는 기본 도구의 기본 기능을 향상시키도록 설계되었습니다. Elasticsearch(ES)는 이러한 여러 플러그인이 포함된 Lucene 라이브러리를 기반으로 하는 검색 엔진입니다. 아래는 ES 플러그인의 아키텍처 다이어그램입니다:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_3ce4e516c3.png" alt="1.png" class="doc-image" id="1.png" />
   </span> <span class="img-wrapper"> <span>1.png</span> </span></p>
<p>분산 시스템에 대한 기본 지원은 ES 솔루션의 주요 장점입니다. 코드를 작성할 필요가 없기 때문에 개발자의 시간과 회사의 비용을 절약할 수 있습니다. ES 플러그인은 기술적으로 진보되어 널리 사용되고 있습니다. Elasticsearch는 JSON을 기반으로 쿼리를 정의하고 이해하기 쉬운 도메인별 언어인 QueryDSL을 제공합니다. 전체 ES 서비스 세트를 통해 벡터/텍스트 검색과 스칼라 데이터 필터링을 동시에 수행할 수 있습니다.</p>
<p>현재 벡터 유사도 검색을 위해 Elasticsearch 플러그인을 사용하는 대형 기술 회사로는 Amazon, Alibaba, Netease가 있습니다. 이 솔루션의 주요 단점은 높은 메모리 사용량과 성능 튜닝을 지원하지 않는다는 점입니다. 이와는 대조적으로 <a href="http://jd.com/">JD.com은</a> Faiss에 기반한 자체 분산 솔루션인 <a href="https://github.com/vearch/vearch">Vearch를</a> 개발했습니다. 그러나 Vearch는 아직 인큐베이션 단계의 프로젝트이며 오픈 소스 커뮤니티가 상대적으로 활발하지 않습니다.</p>
<h4 id="Milvus" class="common-anchor-header">Milvus</h4><p><a href="https://www.milvus.io/">Milvus는</a> <a href="https://zilliz.com">Zilliz에서</a> 만든 오픈 소스 벡터 데이터베이스입니다. 매우 유연하고 안정적이며 속도가 매우 빠릅니다. Faiss, NMSLIB, Annoy 등 널리 채택된 여러 인덱스 라이브러리를 캡슐화함으로써 Milvus는 포괄적인 직관적인 API 세트를 제공하여 개발자가 자신의 시나리오에 이상적인 인덱스 유형을 선택할 수 있도록 합니다. 또한 분산 솔루션과 모니터링 서비스도 제공합니다. Milvus는 매우 활발한 오픈 소스 커뮤니티와 5.5만 개 이상의 <a href="https://github.com/milvus-io/milvus">별을</a> 보유하고 있습니다.</p>
<h4 id="Milvus-bests-the-competition" class="common-anchor-header">경쟁사를 능가하는 Milvus</h4><p>위에서 언급한 다양한 벡터 유사도 검색 솔루션의 여러 가지 테스트 결과를 종합했습니다. 다음 비교 표에서 볼 수 있듯이, 10억 개의 128차원 벡터로 구성된 데이터 세트에서 테스트했음에도 불구하고 Milvus는 경쟁사보다 훨씬 빨랐습니다.</p>
<table>
<thead>
<tr><th style="text-align:left"><strong>엔진</strong></th><th style="text-align:left"><strong>성능(ms)</strong></th><th style="text-align:left"><strong>데이터 세트 크기(백만)</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:left">ES</td><td style="text-align:left">600</td><td style="text-align:left">1</td></tr>
<tr><td style="text-align:left">ES + 알리바바 클라우드</td><td style="text-align:left">900</td><td style="text-align:left">20</td></tr>
<tr><td style="text-align:left">Milvus</td><td style="text-align:left">27</td><td style="text-align:left">1000+</td></tr>
<tr><td style="text-align:left">SPTAG</td><td style="text-align:left">좋지 않음</td><td style="text-align:left"></td></tr>
<tr><td style="text-align:left">ES + nmslib, faiss</td><td style="text-align:left">90</td><td style="text-align:left">150</td></tr>
</tbody>
</table>
<h6 id="A-comparison-of-vector-similarity-search-solutions" class="common-anchor-header"><em>벡터 유사도 검색 솔루션 비교.</em></h6><p>각 솔루션의 장단점을 비교 검토한 결과, Trend Micro는 벡터 검색 모델로 Milvus를 선택했습니다. 수십억 개에 달하는 대규모 데이터 세트에 대한 탁월한 성능을 갖춘 Milvus를 실시간 벡터 유사성 검색이 필요한 모바일 보안 서비스로 선택한 이유는 당연합니다.</p>
<p><br/></p>
<h3 id="Designing-a-system-for-real-time-virus-detection" class="common-anchor-header">실시간 바이러스 탐지를 위한 시스템 설계</h3><p>트렌드마이크로는 MySQL 데이터베이스에 1,000만 개 이상의 악성 APK를 저장하고 있으며 매일 10만 개의 새로운 APK가 추가되고 있습니다. 이 시스템은 APK 파일의 다양한 구성 요소의 Thash 값을 추출하고 계산한 다음, Sha256 알고리즘을 사용하여 바이너리 파일로 변환하고 다른 APK와 구별되는 256비트 Sha256 값을 생성하는 방식으로 작동합니다. Sha256 값은 APK 파일에 따라 다르므로 하나의 APK에는 하나의 결합된 Thash 값과 하나의 고유한 Sha256 값이 있을 수 있습니다.</p>
<p>Sha256 값은 APK를 구별하는 데만 사용되며, Thash 값은 벡터 유사성 검색에 사용됩니다. 유사한 APK는 Thash 값은 같지만 Sha256 값이 다를 수 있습니다.</p>
<p>악성 코드가 포함된 APK를 탐지하기 위해 트렌드마이크로는 유사한 Thash 값과 해당 Sha256 값을 검색하는 자체 시스템을 개발했습니다. 트렌드 마이크로는 Thash 값에서 변환된 방대한 벡터 데이터 세트에서 즉각적인 벡터 유사성 검색을 수행하기 위해 Milvus를 선택했습니다. 유사성 검색이 실행된 후, 해당 Sha256 값은 MySQL에서 쿼리됩니다. 또한 아키텍처에 Redis 캐싱 계층이 추가되어 Thash 값을 Sha256 값에 매핑하여 쿼리 시간을 크게 단축합니다.</p>
<p>아래는 트렌드마이크로의 모바일 보안 시스템의 아키텍처 다이어그램입니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/image_20210118_022039_ae824b663c.png" alt="image-20210118-022039.png" class="doc-image" id="image-20210118-022039.png" />
   </span> <span class="img-wrapper"> <span>image-20210118-022039.png</span> </span></p>
<p><br/></p>
<p>적절한 거리 메트릭을 선택하면 벡터 분류 및 클러스터링 성능을 개선하는 데 도움이 됩니다. 다음 표는 이진 벡터와 함께 작동하는 <a href="https://www.milvus.io/docs/v1.0.0/metric.md#binary">거리 메트릭과</a> 해당 인덱스를 보여줍니다.</p>
<table>
<thead>
<tr><th><strong>거리 메트릭</strong></th><th><strong>인덱스 유형</strong></th></tr>
</thead>
<tbody>
<tr><td>- 제이카드 <br/> - 타니모토 <br/> - 해밍</td><td>- 플랫 <br/> - IVF_FLAT</td></tr>
<tr><td>- 상부 구조 <br/> - 하부 구조</td><td>FLAT</td></tr>
</tbody>
</table>
<h6 id="Distance-metrics-and-indexes-for-binary-vectors" class="common-anchor-header"><em>이진 벡터에 대한 거리 메트릭 및 인덱스.</em></h6><p><br/></p>
<p>트렌드마이크로는 Thash 값을 바이너리 벡터로 변환하여 Milvus에 저장합니다. 이 시나리오에서 트렌드 마이크로는 해밍 거리를 사용하여 벡터를 비교합니다.</p>
<p>Milvus는 곧 문자열 벡터 ID를 지원할 예정이며, 정수 ID를 문자열 형식의 해당 이름에 매핑할 필요가 없습니다. 따라서 Redis 캐싱 계층이 불필요해지고 시스템 아키텍처의 부피가 줄어듭니다.</p>
<p>트렌드 마이크로는 클라우드 기반 솔루션을 채택하고 많은 작업을 <a href="https://kubernetes.io/">Kubernetes에</a> 배포합니다. 고가용성을 달성하기 위해, Trend Micro는 Python으로 개발된 Milvus 클러스터 샤딩 미들웨어인 <a href="https://www.milvus.io/docs/v1.0.0/mishards.md">Mishards를</a> 사용합니다.</p>
<p>![image-20210118-022104.png](https://assets.zilliz.com/image_20210118_022104_3001950ee8.png &quot;Mishards architecture in Milvus.)</p>
<p><br/></p>
<p>트렌드마이크로는 모든 벡터를 <a href="https://aws.amazon.com/">AWS에서</a> 제공하는 <a href="https://aws.amazon.com/efs/">EFS</a> (Elastic File System)에 저장하여 저장과 거리 계산을 분리합니다. 이 방식은 업계에서 널리 사용되는 추세입니다. 여러 개의 읽기 노드를 시작하기 위해 Kubernetes를 사용하고, 이러한 읽기 노드에서 LoadBalancer 서비스를 개발하여 고가용성을 보장합니다.</p>
<p>데이터 일관성을 유지하기 위해 미샤드는 하나의 쓰기 노드만 지원합니다. 그러나 여러 개의 쓰기 노드를 지원하는 분산 버전의 Milvus는 앞으로 몇 달 내에 제공될 예정입니다.</p>
<p><br/></p>
<h3 id="Monitoring-and-Alert-Functions" class="common-anchor-header">모니터링 및 알림 기능</h3><p>Milvus는 <a href="https://prometheus.io/">Prometheus에</a> 구축된 모니터링 시스템과 호환되며, 시계열 분석을 위한 오픈 소스 플랫폼인 <a href="https://grafana.com/">Grafana를</a> 사용하여 다양한 성능 메트릭을 시각화합니다.</p>
<p>Prometheus는 다음과 같은 메트릭을 모니터링하고 저장합니다:</p>
<ul>
<li>삽입 속도, 쿼리 속도, Milvus 가동 시간을 포함한 Milvus 성능 메트릭.</li>
<li>CPU/GPU 사용량, 네트워크 트래픽, 디스크 액세스 속도를 포함한 시스템 성능 메트릭.</li>
<li>데이터 크기 및 총 파일 수를 포함한 하드웨어 스토리지 메트릭.</li>
</ul>
<p>모니터링 및 알림 시스템은 다음과 같이 작동합니다:</p>
<ul>
<li>Milvus 클라이언트가 맞춤형 메트릭 데이터를 푸시게이트웨이로 푸시합니다.</li>
<li>푸시게이트웨이는 수명이 짧고 일시적인 메트릭 데이터를 Prometheus로 안전하게 전송합니다.</li>
<li>Prometheus는 Pushgateway에서 데이터를 계속 가져옵니다.</li>
<li>알림 관리자는 다양한 메트릭에 대한 알림 임계값을 설정하고 이메일 또는 메시지를 통해 알림을 발생시킵니다.</li>
</ul>
<p><br/></p>
<h3 id="System-Performance" class="common-anchor-header">시스템 성능</h3><p>Milvus에 구축된 ThashSearch 서비스가 처음 출시된 후 몇 달이 지났습니다. 아래 그래프는 엔드투엔드 쿼리 지연 시간이 95밀리초 미만임을 보여줍니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/image_20210118_022116_a0c735ce20.png" alt="image-20210118-022116.png" class="doc-image" id="image-20210118-022116.png" />
   </span> <span class="img-wrapper"> <span>image-20210118-022116.png</span> </span></p>
<p><br/></p>
<p>삽입 속도도 빠릅니다. 3백만 개의 192차원 벡터를 삽입하는 데 약 10초가 걸립니다. Milvus의 도움으로 시스템 성능은 트렌드마이크로가 설정한 성능 기준을 충족할 수 있었습니다.</p>
<p><br/></p>
<h3 id="Don’t-be-a-stranger" class="common-anchor-header">낯선 사람이 되지 마세요</h3><ul>
<li><a href="https://github.com/milvus-io/milvus/">GitHub에서</a> Milvus를 찾거나 기여하세요.</li>
<li><a href="https://join.slack.com/t/milvusio/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ">Slack을</a> 통해 커뮤니티와 소통하세요.</li>
<li><a href="https://twitter.com/milvusio">트위터에서</a> 소통하세요.</li>
</ul>
