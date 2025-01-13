---
id: Accelerating-Similarity-Search-on-Really-Big-Data-with-Vector-Indexing.md
title: 벡터 인덱싱을 통한 대용량 데이터의 유사도 검색 가속화
author: milvus
date: 2019-12-05T08:33:04.230Z
desc: >-
  벡터 인덱싱이 없다면 많은 최신 AI 애플리케이션의 속도가 엄청나게 느려질 것입니다. 다음 머신 러닝 애플리케이션에 적합한 인덱스를 선택하는
  방법을 알아보세요.
cover: assets.zilliz.com/4_1143e443aa.jpg
tag: Engineering
canonicalUrl: >-
  https://zilliz.com/blog/Accelerating-Similarity-Search-on-Really-Big-Data-with-Vector-Indexing
---
<custom-h1>벡터 인덱싱으로 대용량 데이터의 유사도 검색을 가속화하기</custom-h1><p>컴퓨터 비전에서 신약 발견에 이르기까지, 벡터 유사도 검색 엔진은 많은 인기 있는 인공 지능(AI) 애플리케이션을 구동합니다. 유사도 검색 엔진이 사용하는 백만, 억, 조 단위의 벡터 데이터 세트를 효율적으로 쿼리할 수 있게 해주는 가장 큰 요소는 빅데이터 검색을 획기적으로 가속화하는 데이터 정리 프로세스인 인덱싱입니다. 이 문서에서는 벡터 유사도 검색을 효율적으로 만드는 데 있어 인덱싱이 하는 역할, 다양한 벡터 반전 파일(IVF) 인덱스 유형, 다양한 시나리오에서 사용할 인덱스에 대한 조언을 다룹니다.</p>
<p><strong>이동하기:</strong></p>
<ul>
<li><a href="#accelerating-similarity-search-on-really-big-data-with-vector-indexing">벡터 인덱싱으로 실제 빅데이터에서 유사도 검색 가속화하기</a><ul>
<li><a href="#how-does-vector-indexing-accelerate-similarity-search-and-machine-learning">벡터 인덱싱은 유사도 검색과 머신 러닝을 어떻게 가속화하나요?</a></li>
<li><a href="#what-are-different-types-of-ivf-indexes-and-which-scenarios-are-they-best-suited-for">IVF 인덱스에는 어떤 유형이 있으며 어떤 시나리오에 가장 적합할까요?</a></li>
<li><a href="#flat-good-for-searching-relatively-small-million-scale-datasets-when-100-recall-is-required">FLAT: 100% 리콜이 필요할 때 비교적 작은(백만 개 규모) 데이터 세트를 검색하는 데 적합합니다.</a><ul>
<li><a href="#flat-performance-test-results">FLAT 성능 테스트 결과:</a><ul>
<li><a href="#query-time-test-results-for-the-flat-index-in-milvus"><em>Milvus의 FLAT 인덱스에 대한 쿼리 시간 테스트 결과입니다.</em></a></li>
</ul></li>
<li><a href="#key-takeaways">주요 요점:</a></li>
</ul></li>
<li><a href="#ivf_flat-improves-speed-at-the-expense-of-accuracy-and-vice-versa">IVF_FLAT: 정확도를 희생하는 대신 속도를 향상시킵니다(그 반대의 경우도 마찬가지).</a><ul>
<li><a href="#ivf_flat-performance-test-results">IVF_FLAT 성능 테스트 결과:</a><ul>
<li><a href="#query-time-test-results-for-ivf_flat-index-in-milvus"><em>Milvus의 IVF_FLAT 인덱스에 대한 쿼리 시간 테스트 결과입니다.</em></a></li>
</ul></li>
<li><a href="#key-takeaways-1">주요 요점:</a><ul>
<li><a href="#recall-rate-test-results-for-the-ivf_flat-index-in-milvus"><em>Milvus의 IVF_FLAT 인덱스에 대한 리콜률 테스트 결과.</em></a></li>
</ul></li>
<li><a href="#key-takeaways-2">주요 내용</a></li>
</ul></li>
<li><a href="#ivf_sq8-faster-and-less-resource-hungry-than-ivf_flat-but-also-less-accurate">IVF_SQ8: IVF_FLAT보다 더 빠르고 리소스를 덜 소모하지만 정확도는 떨어집니다.</a><ul>
<li><a href="#ivf_sq8-performance-test-results">IVF_SQ8 성능 테스트 결과:</a><ul>
<li><a href="#query-time-test-results-for-ivf_sq8-index-in-milvus"><em>Milvus의 IVF_SQ8 인덱스에 대한 쿼리 시간 테스트 결과.</em></a></li>
</ul></li>
<li><a href="#key-takeaways-3">주요 요점:</a><ul>
<li><a href="#recall-rate-test-results-for-ivf_sq8-index-in-milvus"><em>Milvus에서 IVF_SQ8 인덱스에 대한 리콜률 테스트 결과.</em></a></li>
</ul></li>
<li><a href="#key-takeaways-4">주요 내용</a></li>
</ul></li>
<li><a href="#ivf_sq8h-new-hybrid-gpucpu-approach-that-is-even-faster-than-ivf_sq8">IVF_SQ8H: IVF_SQ8보다 훨씬 빠른 새로운 하이브리드 GPU/CPU 접근 방식.</a><ul>
<li><a href="#ivf_sq8h-performance-test-results">IVF_SQ8H 성능 테스트 결과:</a><ul>
<li><a href="#query-time-test-results-for-ivf_sq8h-index-in-milvus"><em>Milvus의 IVF_SQ8H 인덱스에 대한 쿼리 시간 테스트 결과.</em></a></li>
</ul></li>
<li><a href="#key-takeaways-5">주요 요점:</a></li>
</ul></li>
<li><a href="#learn-more-about-milvus-a-massive-scale-vector-data-management-platform">대규모 벡터 데이터 관리 플랫폼인 Milvus에 대해 자세히 알아보세요.</a></li>
<li><a href="#methodology">방법론</a><ul>
<li><a href="#performance-testing-environment">성능 테스트 환경</a></li>
<li><a href="#relevant-technical-concepts">관련 기술 개념</a></li>
<li><a href="#resources">리소스</a></li>
</ul></li>
</ul></li>
</ul>
<h3 id="How-does-vector-indexing-accelerate-similarity-search-and-machine-learning" class="common-anchor-header">벡터 인덱싱은 유사도 검색과 머신 러닝을 어떻게 가속화하나요?</h3><p>유사도 검색 엔진은 입력을 데이터베이스와 비교하여 입력과 가장 유사한 객체를 찾는 방식으로 작동합니다. 인덱싱은 데이터를 효율적으로 정리하는 과정으로, 대규모 데이터 세트에서 시간이 오래 걸리는 쿼리를 획기적으로 가속화하여 유사도 검색을 유용하게 만드는 데 중요한 역할을 합니다. 대규모 벡터 데이터 세트가 색인된 후에는 쿼리가 입력 쿼리와 유사한 벡터를 포함할 가능성이 가장 높은 클러스터 또는 데이터의 하위 집합으로 라우팅될 수 있습니다. 실제로 이것은 매우 큰 벡터 데이터에 대한 쿼리 속도를 높이기 위해 어느 정도의 정확도를 희생해야 한다는 것을 의미합니다.</p>
<p>단어가 알파벳순으로 정렬되어 있는 사전을 비유할 수 있습니다. 단어를 검색할 때 이니셜이 같은 단어만 포함된 섹션으로 빠르게 이동할 수 있어 입력 단어의 정의 검색 속도를 크게 높일 수 있습니다.</p>
<h3 id="What-are-different-types-of-IVF-indexes-and-which-scenarios-are-they-best-suited-for" class="common-anchor-header">IVF 색인에는 어떤 유형이 있으며 어떤 시나리오에 가장 적합한가요?</h3><p>고차원 벡터 유사도 검색을 위해 설계된 수많은 인덱스가 있으며, 각 인덱스에는 성능, 정확도 및 저장 공간 요구 사항의 장단점이 있습니다. 이 문서에서는 몇 가지 일반적인 IVF 인덱스 유형과 그 장단점, 그리고 각 인덱스 유형에 대한 성능 테스트 결과를 다룹니다. 성능 테스트는 오픈 소스 벡터 데이터 관리 플랫폼인 <a href="https://milvus.io/">Milvus에서</a> 각 인덱스 유형에 대한 쿼리 시간 및 리콜률을 정량화합니다. 테스트 환경에 대한 자세한 내용은 이 문서 하단의 방법론 섹션을 참조하세요.</p>
<h3 id="FLAT-Good-for-searching-relatively-small-million-scale-datasets-when-100-recall-is-required" class="common-anchor-header">FLAT: 100% 리콜이 필요할 때 비교적 작은(백만 개 규모) 데이터 세트를 검색하는 데 적합합니다.</h3><p>완벽한 정확도가 필요하고 비교적 작은(백만 개 규모) 데이터 세트에 의존하는 벡터 유사도 검색 애플리케이션의 경우, FLAT 인덱스가 좋은 선택입니다. FLAT은 벡터를 압축하지 않으며, 정확한 검색 결과를 보장할 수 있는 유일한 인덱스입니다. 또한 FLAT의 결과는 다른 인덱스에서 생성된 결과의 비교 기준으로도 사용할 수 있습니다.</p>
<p>FLAT은 각 쿼리마다 데이터 세트의 모든 벡터와 대상 입력을 비교하는 철저한 검색 방식을 취하기 때문에 정확도가 높습니다. 따라서 FLAT은 목록에서 가장 느린 인덱스이며, 대규모 벡터 데이터를 쿼리하는 데는 적합하지 않습니다. Milvus에는 FLAT 인덱스에 대한 매개변수가 없으며, 이를 사용하는 데 데이터 학습이나 추가 저장 공간이 필요하지 않습니다.</p>
<h4 id="FLAT-performance-test-results" class="common-anchor-header">FLAT 성능 테스트 결과:</h4><p>Milvus에서 2백만 개의 128차원 벡터로 구성된 데이터 세트를 사용해 FLAT 쿼리 시간 성능 테스트를 수행했습니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_Accelerating_Similarity_Search_on_Really_Big_Data_with_Vector_Indexing_2_f34fb95d65.png" alt="Blog_Accelerating Similarity Search on Really Big Data with Vector Indexing_2.png" class="doc-image" id="blog_accelerating-similarity-search-on-really-big-data-with-vector-indexing_2.png" />
   </span> <span class="img-wrapper"> <span>블로그_벡터 인덱싱으로 대용량 데이터의 유사도 검색 가속화하기_2.png</span> </span></p>
<h4 id="Key-takeaways" class="common-anchor-header">핵심 사항</h4><ul>
<li>nq(쿼리의 대상 벡터 수)가 증가하면 쿼리 시간이 증가합니다.</li>
<li>Milvus의 FLAT 인덱스를 사용하면 nq가 200을 초과하면 쿼리 시간이 급격히 증가하는 것을 볼 수 있습니다.</li>
<li>일반적으로 Milvus를 CPU보다 GPU에서 실행할 때 FLAT 인덱스가 더 빠르고 일관적입니다. 그러나 nq가 20 미만일 때 CPU에서의 FLAT 쿼리가 더 빠릅니다.</li>
</ul>
<h3 id="IVFFLAT-Improves-speed-at-the-expense-of-accuracy-and-vice-versa" class="common-anchor-header">IVF_FLAT: 정확도를 희생하는 대신 속도를 향상시킵니다(그 반대의 경우도 마찬가지).</h3><p>정확도를 희생하면서 유사도 검색 프로세스를 가속화하는 일반적인 방법은 근사 근사 이웃(ANN) 검색을 수행하는 것입니다. ANN 알고리즘은 유사한 벡터를 함께 클러스터링하여 스토리지 요구 사항과 계산 부하를 줄여 벡터 검색 속도를 높입니다. IVF_FLAT은 가장 기본적인 역방향 파일 인덱스 유형으로, ANN 검색의 한 형태에 의존합니다.</p>
<p>IVF_FLAT은 벡터 데이터를 여러 개의 클러스터 단위(nlist)로 나눈 다음, 대상 입력 벡터와 각 클러스터의 중심 사이의 거리를 비교합니다. 시스템이 쿼리하도록 설정된 클러스터 수(nprobe)에 따라 목표 입력과 가장 유사한 클러스터의 벡터만을 비교하여 유사도 검색 결과를 반환하므로 쿼리 시간을 대폭 단축할 수 있습니다.</p>
<p>nprobe를 조정하면 주어진 시나리오에서 정확도와 속도 사이의 이상적인 균형을 찾을 수 있습니다. IVF_FLAT 성능 테스트의 결과는 대상 입력 벡터의 수(nq)와 검색할 클러스터의 수(nprobe)가 모두 증가함에 따라 쿼리 시간이 급격히 증가한다는 것을 보여줍니다. IVF_FLAT은 벡터 데이터를 압축하지 않지만, 인덱스 파일에는 메타데이터가 포함되어 있어 인덱싱되지 않은 원시 벡터 데이터 세트에 비해 저장 공간 요구 사항이 약간 증가합니다.</p>
<h4 id="IVFFLAT-performance-test-results" class="common-anchor-header">IVF_FLAT 성능 테스트 결과:</h4><p>10억 개의 128차원 벡터가 포함된 공개 1B SIFT 데이터 세트를 사용해 Milvus에서 IVF_FLAT 쿼리 시간 성능 테스트를 수행했습니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_Accelerating_Similarity_Search_on_Really_Big_Data_with_Vector_Indexing_3_92055190d7.png" alt="Blog_Accelerating Similarity Search on Really Big Data with Vector Indexing_3.png" class="doc-image" id="blog_accelerating-similarity-search-on-really-big-data-with-vector-indexing_3.png" />
   </span> <span class="img-wrapper"> <span>블로그_벡터 인덱싱으로 대용량 데이터에서 유사도 검색 가속화하기_3.png</span> </span></p>
<h4 id="Key-takeaways" class="common-anchor-header">핵심 사항</h4><ul>
<li>CPU에서 실행할 때, Milvus의 IVF_FLAT 인덱스에 대한 쿼리 시간은 nprobe와 nq 모두에 따라 증가합니다. 즉, 쿼리에 포함된 입력 벡터가 많거나 쿼리가 검색하는 클러스터가 많을수록 쿼리 시간이 길어집니다.</li>
<li>GPU에서 인덱스는 nq와 nprobe의 변화에 대한 시간 편차가 더 적습니다. 이는 인덱스 데이터가 크고 CPU 메모리에서 GPU 메모리로 데이터를 복사하는 것이 전체 쿼리 시간의 대부분을 차지하기 때문입니다.</li>
<li>nq = 1,000, nprobe = 32인 경우를 제외한 모든 시나리오에서, IVF_FLAT 인덱스는 CPU에서 실행할 때 더 효율적입니다.</li>
</ul>
<p>인덱스 구축을 위해 100만 개의 128차원 벡터가 포함된 공개 1M SIFT 데이터 세트와 100만 개 이상의 200차원 벡터가 포함된 glove-200-각 데이터 세트(nlist = 16,384)를 모두 사용해 Milvus에서 IVF_FLAT 리콜 성능 테스트를 수행했습니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_Accelerating_Similarity_Search_on_Really_Big_Data_with_Vector_Indexing_4_8c8a6b628e.png" alt="Blog_Accelerating Similarity Search on Really Big Data with Vector Indexing_4.png" class="doc-image" id="blog_accelerating-similarity-search-on-really-big-data-with-vector-indexing_4.png" />
   </span> <span class="img-wrapper"> <span>블로그_벡터 인덱싱으로 대용량 데이터에서 유사도 검색 가속화하기_4.png</span> </span></p>
<h4 id="Key-takeaways" class="common-anchor-header">핵심 요점:</h4><ul>
<li>IVF_FLAT 인덱스는 정확도를 최적화할 수 있으며, nprobe = 256일 때 1M SIFT 데이터 세트에서 0.99 이상의 리콜률을 달성할 수 있습니다.</li>
</ul>
<h3 id="IVFSQ8-Faster-and-less-resource-hungry-than-IVFFLAT-but-also-less-accurate" class="common-anchor-header">IVF_SQ8: IVF_FLAT보다 더 빠르고 리소스를 덜 소모하지만 정확도도 떨어집니다.</h3><p>IVF_FLAT은 압축을 수행하지 않기 때문에 생성되는 인덱스 파일은 인덱싱되지 않은 원본 원시 벡터 데이터와 거의 같은 크기입니다. 예를 들어, 원본 1B SIFT 데이터 세트가 476GB인 경우, IVF_FLAT 인덱스 파일은 약간 더 커집니다(~470GB). 모든 인덱스 파일을 메모리에 로드하면 470GB의 스토리지가 소모됩니다.</p>
<p>디스크, CPU 또는 GPU 메모리 리소스가 제한되어 있는 경우 IVF_SQ8이 IVF_FLAT보다 더 나은 옵션입니다. 이 인덱스 유형은 스칼라 양자화를 수행하여 각 FLOAT(4바이트)를 UINT8(1바이트)로 변환할 수 있습니다. 이렇게 하면 디스크, CPU, GPU 메모리 사용량이 70~75%까지 줄어듭니다. 1B SIFT 데이터 세트의 경우, IVF_SQ8 인덱스 파일은 140GB의 스토리지만 필요합니다.</p>
<h4 id="IVFSQ8-performance-test-results" class="common-anchor-header">IVF_SQ8 성능 테스트 결과:</h4><p>인덱스 구축을 위해 10억 개의 128차원 벡터가 포함된 공개 1B SIFT 데이터 세트를 사용해 Milvus에서 IVF_SQ8 쿼리 시간 테스트를 수행했습니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_Accelerating_Similarity_Search_on_Really_Big_Data_with_Vector_Indexing_5_467fafbec4.png" alt="Blog_Accelerating Similarity Search on Really Big Data with Vector Indexing_5.png" class="doc-image" id="blog_accelerating-similarity-search-on-really-big-data-with-vector-indexing_5.png" />
   </span> <span class="img-wrapper"> <span>블로그_벡터 인덱싱으로 실제 빅데이터에서 유사도 검색 가속화하기_5.png</span> </span></p>
<h4 id="Key-takeaways" class="common-anchor-header">핵심 사항</h4><ul>
<li>인덱스 파일 크기를 줄임으로써 IVF_SQ8은 IVF_FLAT에 비해 현저한 성능 향상을 제공합니다. IVF_SQ8은 IVF_FLAT과 유사한 성능 곡선을 따르며, 쿼리 시간은 nq 및 nprobe에 따라 증가합니다.</li>
<li>IVF_SQ8은 IVF_FLAT과 마찬가지로 CPU에서 실행할 때와 nq 및 nprobe가 더 작을 때 더 빠른 성능을 보입니다.</li>
</ul>
<p>IVF_SQ8 리콜 성능 테스트는 Milvus에서 인덱스 구축을 위해 100만 개의 128차원 벡터가 포함된 공개 1M SIFT 데이터 세트와 100만 개 이상의 200차원 벡터가 포함된 glove-200-각 데이터 세트(nlist = 16,384)를 사용해 수행되었습니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_Accelerating_Similarity_Search_on_Really_Big_Data_with_Vector_Indexing_6_b1e0e5b6a5.png" alt="Blog_Accelerating Similarity Search on Really Big Data with Vector Indexing_6.png" class="doc-image" id="blog_accelerating-similarity-search-on-really-big-data-with-vector-indexing_6.png" />
   </span> <span class="img-wrapper"> <span>블로그_벡터 인덱싱으로 대용량 데이터에서 유사도 검색 가속화하기_6.png</span> </span></p>
<h4 id="Key-takeaways" class="common-anchor-header">핵심 요점:</h4><ul>
<li>원본 데이터를 압축했음에도 불구하고 IVF_SQ8은 쿼리 정확도가 크게 감소하지 않습니다. 다양한 nprobe 설정에서 IVF_SQ8은 IVF_FLAT보다 최대 1% 낮은 리콜률을 보였습니다.</li>
</ul>
<h3 id="IVFSQ8H-New-hybrid-GPUCPU-approach-that-is-even-faster-than-IVFSQ8" class="common-anchor-header">IVF_SQ8H: IVF_SQ8보다 훨씬 빠른 새로운 하이브리드 GPU/CPU 접근 방식.</h3><p>IVF_SQ8H는 IVF_SQ8에 비해 쿼리 성능을 향상시키는 새로운 인덱스 유형입니다. CPU에서 실행되는 IVF_SQ8 인덱스를 쿼리할 때, 전체 쿼리 시간의 대부분은 목표 입력 벡터에 가장 가까운 n프로브 클러스터를 찾는 데 소요됩니다. 쿼리 시간을 줄이기 위해 IVF_SQ8은 인덱스 파일보다 작은 굵은 양자화 연산을 위한 데이터를 GPU 메모리에 복사하여 굵은 양자화 연산을 크게 가속화합니다. 그런 다음 gpu_search_threshold가 쿼리를 실행할 장치를 결정합니다. nq &gt;= gpu_search_threshold이면 GPU가 쿼리를 실행하고, 그렇지 않으면 CPU가 쿼리를 실행합니다.</p>
<p>IVF_SQ8H는 CPU와 GPU가 함께 작동해야 하는 하이브리드 인덱스 유형입니다. GPU가 활성화된 Milvus에서만 사용할 수 있습니다.</p>
<h4 id="IVFSQ8H-performance-test-results" class="common-anchor-header">IVF_SQ8H 성능 테스트 결과:</h4><p>인덱스 구축을 위해 10억 개의 128차원 벡터가 포함된 공개 1B SIFT 데이터셋을 사용해 Milvus에서 IVF_SQ8H 쿼리 시간 성능 테스트를 수행했습니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_Accelerating_Similarity_Search_on_Really_Big_Data_with_Vector_Indexing_7_b70bfe8bce.png" alt="Blog_Accelerating Similarity Search on Really Big Data with Vector Indexing_7.png" class="doc-image" id="blog_accelerating-similarity-search-on-really-big-data-with-vector-indexing_7.png" />
   </span> <span class="img-wrapper"> <span>블로그_벡터 인덱싱으로 실제 빅데이터에서 유사도 검색 가속화하기_7.png</span> </span></p>
<h4 id="Key-takeaways" class="common-anchor-header">핵심 사항</h4><ul>
<li>nq가 1,000 이하인 경우, IVF_SQ8H는 쿼리 시간이 IVFSQ8보다 거의 두 배나 빠릅니다.</li>
<li>nq = 2000인 경우, IVFSQ8H와 IVF_SQ8의 쿼리 시간은 동일합니다. 그러나 gpu_search_threshold 매개변수가 2000보다 낮으면 IVF_SQ8H가 IVF_SQ8보다 성능이 뛰어납니다.</li>
<li>IVF_SQ8H의 쿼리 리콜률은 IVF_SQ8과 동일하므로 검색 정확도의 손실 없이 쿼리 시간을 단축할 수 있습니다.</li>
</ul>
<h3 id="Learn-more-about-Milvus-a-massive-scale-vector-data-management-platform" class="common-anchor-header">대규모 벡터 데이터 관리 플랫폼인 Milvus에 대해 자세히 알아보세요.</h3><p>Milvus는 인공 지능, 딥 러닝, 기존 벡터 계산 등 다양한 분야의 유사도 검색 애플리케이션을 강화할 수 있는 벡터 데이터 관리 플랫폼입니다. Milvus에 대한 자세한 내용은 다음 리소스를 참조하세요:</p>
<ul>
<li>Milvus는 <a href="https://github.com/milvus-io/milvus">GitHub에서</a> 오픈 소스 라이선스로 사용할 수 있습니다.</li>
<li>Milvus에서는 그래프 및 트리 기반 인덱스를 포함한 추가 인덱스 유형이 지원됩니다. 지원되는 인덱스 유형의 전체 목록은 Milvus의 <a href="https://milvus.io/docs/v0.11.0/index.md">벡터 인덱스 문서를</a> 참조하세요.</li>
<li>Milvus를 출시한 회사에 대해 자세히 알아보려면 <a href="https://zilliz.com/">Zilliz.com을</a> 방문하세요.</li>
<li>Milvus 커뮤니티와 채팅하거나 <a href="https://join.slack.com/t/milvusio/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ">Slack에서</a> 문제에 대한 도움을 받으세요.</li>
</ul>
<h3 id="Methodology" class="common-anchor-header">방법론</h3><h4 id="Performance-testing-environment" class="common-anchor-header">성능 테스트 환경</h4><p>이 문서에서 언급된 성능 테스트에 사용된 서버 구성은 다음과 같습니다:</p>
<ul>
<li>인텔 ® 제온 ® 플래티넘 8163 @ 2.50GHz, 24코어</li>
<li>GeForce GTX 2080Ti x 4</li>
<li>768GB 메모리</li>
</ul>
<h4 id="Relevant-technical-concepts" class="common-anchor-header">관련 기술 개념</h4><p>이 문서를 이해하는 데 필수적인 것은 아니지만, 다음은 인덱스 성능 테스트 결과를 해석하는 데 도움이 되는 몇 가지 기술 개념입니다:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_Accelerating_Similarity_Search_on_Really_Big_Data_with_Vector_Indexing_8_a6c1de937f.png" alt="Blog_Accelerating Similarity Search on Really Big Data with Vector Indexing_8.png" class="doc-image" id="blog_accelerating-similarity-search-on-really-big-data-with-vector-indexing_8.png" />
   </span> <span class="img-wrapper"> <span>블로그_벡터 인덱싱으로 실제 빅데이터에서 유사도 검색 가속화하기_8.png</span> </span></p>
<h4 id="Resources" class="common-anchor-header">리소스</h4><p>이 문서에는 다음 자료가 사용되었습니다:</p>
<ul>
<li>"<a href="https://books.google.com/books/about/Encyclopedia_of_Database_Systems.html?id=YdT3wQEACAAJ">데이터베이스 시스템 백과사전</a>", Ling Liu 및 M. Tamer Özsu.</li>
</ul>
