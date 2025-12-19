---
id: >-
  milvus-tiered-storage-80-less-vector-search-cost-with-on-demand-hot–cold-data-loading.md
title: '콜드 데이터에 대한 비용 지불을 중단하세요: Milvus 계층형 스토리지의 온디맨드 핫-콜드 데이터 로딩으로 80% 비용 절감'
author: Buqian Zheng
date: 2025-12-15T00:00:00.000Z
cover: assets.zilliz.com/tiered_storage_cover_38237a3bda.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus, Tiered Storage, vector search, hot data, cold data'
meta_title: >
  Milvus Tiered Storage: 80% Less Vector Search Cost with On-Demand Hot–Cold
  Data Loading
desc: >-
  Milvus의 계층형 스토리지가 핫 데이터와 콜드 데이터의 온디맨드 로딩을 지원하여 최대 80%의 비용을 절감하고 대규모로 더 빠른 로드
  시간을 제공하는 방법을 알아보세요.
origin: >-
  https://milvus.io/blog/milvus-tiered-storage-80-less-vector-search-cost-with-on-demand-hot–cold-data-loading.md
---
<p><strong>시스템에서 거의 건드리지 않는 데이터에 대해 여전히 프리미엄 인프라 요금을 지불하고 계신 분이 얼마나 되나요? 솔직히 말해서 대부분의 팀이 그렇습니다.</strong></p>
<p>프로덕션 환경에서 벡터 검색을 실행해 본 적이 있다면 이런 상황을 직접 경험해 보셨을 것입니다. 실제로는 데이터 세트의 일부만 활성화되어 있지만 모든 것이 '쿼리 준비 상태'를 유지하도록 대량의 메모리와 SSD를 프로비저닝합니다. 그리고 여러분은 혼자가 아닙니다. 저희도 비슷한 사례를 많이 보았습니다:</p>
<ul>
<li><p><strong>멀티테넌트 SaaS 플랫폼:</strong> 수백 개의 테넌트가 온보딩되어 있지만 매일 10~15%만 활성화됩니다. 나머지는 잠자고 있지만 여전히 리소스를 차지하고 있습니다.</p></li>
<li><p><strong>이커머스 추천 시스템:</strong> 백만 개의 SKU가 있지만 상위 8%의 제품이 대부분의 추천 및 검색 트래픽을 생성합니다.</p></li>
<li><p><strong>AI 검색:</strong> 사용자 쿼리의 90%가 지난 주에 발생한 항목임에도 불구하고 방대한 임베딩 아카이브.</p></li>
</ul>
<p><strong>데이터의 10% 미만이 자주 쿼리되지만 스토리지와 메모리의 80%를 소비하는</strong> 경우가 많습니다. 이러한 불균형이 존재한다는 것은 누구나 알고 있지만, 최근까지 이를 해결할 수 있는 깔끔한 아키텍처적 방법이 없었습니다.</p>
<p><a href="https://milvus.io/docs/release_notes.md">Milvus 2.6에서는</a><strong>달라집니다</strong><strong>.</strong></p>
<p>이 릴리스 이전에는 대부분의 벡터 데이터베이스와 마찬가지로 Milvus는 <strong>풀로드 모델에</strong> 의존했습니다. 데이터를 검색할 수 있어야 하는 경우 로컬 노드에 데이터를 로드해야 했습니다. 데이터가 1분에 수천 번 조회되든, 분기에 한 번 조회되든 상관없이 <strong>모든 데이터는 항상 핫 상태를 유지해야 했습니다.</strong> 이러한 설계 선택은 예측 가능한 성능을 보장했지만, 클러스터의 크기가 커지고 콜드 데이터에는 필요하지 않은 리소스에 대한 비용을 지불해야 한다는 것을 의미하기도 했습니다.</p>
<p><a href="https://milvus.io/docs/tiered-storage-overview.md">계층형 스토리지가</a> <strong>해답입니다.</strong></p>
<p>Milvus 2.6은 <strong>진정한 온디맨드 로딩을</strong> 지원하는 새로운 계층형 스토리지 아키텍처를 도입하여 시스템이 핫 데이터와 콜드 데이터를 자동으로 구분할 수 있도록 합니다:</p>
<ul>
<li><p>핫 세그먼트는 컴퓨팅과 가까운 곳에 캐시된 상태로 유지됩니다.</p></li>
<li><p>콜드 세그먼트는 원격 오브젝트 스토리지에 저렴하게 저장됩니다.</p></li>
<li><p><strong>쿼리가 실제로 필요할 때만</strong> 로컬 노드로 데이터를 가져옵니다.</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://milvus.io/docs/v2.6.x/assets/full-load-mode-vs-tiered-storage-mode.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>따라서 비용 구조가 "얼마나 많은 데이터를 보유하고 있는가"에서 <strong>"얼마나 많은 데이터를 실제로 사용하는가</strong> "로 바뀌게 <strong>됩니다</strong>. 그리고 초기 프로덕션 배포에서는 이 간단한 전환으로 <strong>스토리지 및 메모리 비용을 최대 80%까지 절감할</strong> 수 있습니다.</p>
<p>이 글의 나머지 부분에서는 계층형 스토리지의 작동 방식을 살펴보고, 실제 성능 결과를 공유하며, 이러한 변화가 가장 큰 영향을 미치는 부분을 보여드리겠습니다.</p>
<h2 id="Why-Full-Loading-Breaks-Down-at-Scale" class="common-anchor-header">전체 로딩이 규모에 따라 고장 나는 이유<button data-href="#Why-Full-Loading-Breaks-Down-at-Scale" class="anchor-icon" translate="no">
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
    </button></h2><p>솔루션에 대해 자세히 알아보기 전에 Milvus 2.5 및 이전 릴리스에서 사용된 <strong>전체 로드 모드가</strong> 워크로드 확장에 따른 제한 요소가 된 이유를 자세히 살펴볼 필요가 있습니다.</p>
<p>Milvus 2.5 이전 버전에서는 사용자가 <code translate="no">Collection.load()</code> 요청을 실행하면 각 쿼리 노드가 메타데이터, 필드 데이터, 인덱스 등 전체 컬렉션을 로컬로 캐시했습니다. 이러한 구성 요소는 객체 스토리지에서 다운로드되어 메모리에 완전히 저장되거나 로컬 디스크에 메모리 매핑(mmap)되어 저장됩니다. 이 <em>모든</em> 데이터를 로컬에서 사용할 수 있어야만 컬렉션이 로드된 것으로 표시되고 쿼리를 처리할 준비가 됩니다.</p>
<p>즉, 노드에 전체 데이터 세트(hot 또는 cold)가 존재할 때까지는 컬렉션을 쿼리할 수 없습니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2_5_en_3adca38b7e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>참고:</strong> 원시 벡터 데이터를 포함하는 인덱스 유형의 경우, Milvus는 벡터 필드를 별도로 로드하지 않고 인덱스 파일만 로드합니다. 그럼에도 불구하고 실제로 액세스되는 데이터의 양에 관계없이 쿼리를 처리하려면 인덱스가 완전히 로드되어야 합니다.</p>
<p>이것이 왜 문제가 되는지 구체적인 예를 들어 보겠습니다:</p>
<p>1억 개의 벡터가 포함된 중간 크기의 벡터 데이터 세트가 있다고 가정해 보겠습니다:</p>
<ul>
<li><p><strong>1억 개의 벡터</strong></p></li>
<li><p><strong>768개의 차원</strong> (BERT 임베딩)</p></li>
<li><p><strong>float32</strong> 정밀도(차원당 4바이트)</p></li>
<li><p><strong>HNSW 인덱스</strong></p></li>
</ul>
<p>이 설정에서는 임베드된 원시 벡터를 포함해 HNSW 인덱스만 약 430GB의 메모리를 소비합니다. 사용자 ID, 타임스탬프 또는 카테고리 레이블과 같은 일반적인 스칼라 필드를 추가하면 총 로컬 리소스 사용량은 500GB를 쉽게 초과합니다.</p>
<p>즉, 데이터의 80%가 거의 쿼리되지 않거나 전혀 쿼리되지 않더라도 시스템은 컬렉션을 온라인 상태로 유지하기 위해 500GB 이상의 로컬 메모리 또는 디스크를 프로비저닝하고 보유해야 합니다.</p>
<p>일부 워크로드의 경우 이러한 동작이 허용될 수 있습니다:</p>
<ul>
<li><p>거의 모든 데이터에 자주 액세스하는 경우, 모든 데이터를 완전히 로드하면 쿼리 대기 시간이 가장 짧아지지만 비용은 가장 많이 듭니다.</p></li>
<li><p>데이터를 hot 데이터와 warm 하위 집합으로 나눌 수 있는 경우, warm 데이터를 디스크에 메모리 매핑하면 메모리 부담을 부분적으로 줄일 수 있습니다.</p></li>
</ul>
<p>그러나 데이터의 80% 이상이 롱테일에 있는 워크로드에서는 <strong>성능과</strong> <strong>비용</strong> 측면에서 전체 로딩의 단점이 빠르게 드러납니다.</p>
<h3 id="Performance-bottlenecks" class="common-anchor-header">성능 병목 현상</h3><p>실제로 전체 로딩은 쿼리 성능 이상의 영향을 미치며 일상적인 운영 워크플로우를 느리게 하는 경우가 많습니다:</p>
<ul>
<li><p><strong>롤링 업그레이드가 더 오래 걸립니다:</strong> 대규모 클러스터에서는 각 노드가 전체 데이터 세트를 다시 로드해야 다시 사용할 수 있기 때문에 롤링 업그레이드에 몇 시간 또는 하루 종일 걸릴 수 있습니다.</p></li>
<li><p><strong>장애 발생 후 복구 속도가 느려집니다:</strong> 쿼리 노드가 다시 시작되면 모든 데이터가 다시 로드될 때까지 트래픽을 처리할 수 없으므로 복구 시간이 상당히 길어지고 노드 장애의 영향이 증폭됩니다.</p></li>
<li><p><strong>반복 및 실험 속도가 느려집니다:</strong> 전체 로딩으로 인해 개발 워크플로우가 느려지고, AI 팀은 새로운 데이터 세트나 인덱스 구성을 테스트할 때 데이터가 로드될 때까지 몇 시간씩 기다려야 합니다.</p></li>
</ul>
<h3 id="Cost-inefficiencies" class="common-anchor-header">비용 비효율성</h3><p>전체 로딩은 인프라 비용도 증가시킵니다. 예를 들어, 메인스트림 클라우드 메모리에 최적화된 인스턴스에서 1TB의 데이터를 로컬에 저장하는 데 드는 비용은 약<span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mn>**70</mn><mn>,</mn><mo>000peryear∗∗</mo><mo stretchy="false">(</mo><mi>AWSr6i</mi><mo>:</mo></mrow></semantics></math></span></span><mtext> </mtext><span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><annotation encoding="application/x-tex">70,000/년**, 보수적 가격 기준(AWS r6i: ~</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.8389em;vertical-align:-0.1944em;"></span><span class="mord">70</span><span class="mpunct">,</span><span class="mspace" style="margin-right:0.1667em;"></span><span class="mord mathnormal" style="margin-right:0.02778em;">000peryear</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">∗</span></span></span></span><span class="mspace" style="margin-right:0.2222em;"></span><span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span> ∗</span></span></span><span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mpunct">,</span><span class="mspace" style="margin-right:0.1667em;"></span><span class="mord mathnormal" style="margin-right:0.03588em;">basedonconservativepricing</span><span class="mopen">(</span><span class="mord mathnormal">AWSr6i</span><span class="mspace" style="margin-right:0.2778em;"></span></span></span></span>:<span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mspace nobreak"> </span> 5.74/GB/월; GCP n4-highmem: ~5</span></span></span><span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mn>.</mn><mi>68/GB/월</mi></mrow><annotation encoding="application/x-tex">;</annotation><mrow><mi>AzureE-시리즈</mi><mo>:</mo></mrow></semantics></math></span></span><mtext> </mtext> 5<span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><annotation encoding="application/x-tex">.68/GB/월; Azure E-시리즈: ~</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span></span></span></span>5<span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord">.</span><span class="mord mathnormal">68/GB/월</span><span class="mpunct">;</span><span class="mspace" style="margin-right:0.1667em;"></span><span class="mord mathnormal" style="margin-right:0.05764em;">AzureE</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">-</span></span></span></span><span class="mspace" style="margin-right:0.2222em;"></span><span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.6595em;"></span><span class="mord mathnormal">시리즈</span><span class="mspace" style="margin-right:0.2778em;"></span></span></span></span>:<span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mspace nobreak"> </span> 5.67/GB/월).</span></span></span></p>
<p>이제 해당 데이터의 80%가 콜드 데이터이고 대신 오브젝트 스토리지에 저장할 수 있는 보다 현실적인 액세스 패턴을 고려해 보세요(약 $0.023/GB/월):</p>
<ul>
<li><p>200GB 핫 데이터 × $5.68</p></li>
<li><p>800GB 콜드 데이터 × $0.023</p></li>
</ul>
<p>연간 비용: (200×5.68+800×0.023)×12≈$14<strong>,000</strong></p>
<p>이는 실제로 중요한 부분의 성능 저하 없이 총 스토리지 비용을 <strong>80% 절감한</strong> 것입니다.</p>
<h2 id="What-Is-the-Tiered-Storage-and-How-Does-It-Work" class="common-anchor-header">계층형 스토리지란 무엇이며 어떻게 작동하나요?<button data-href="#What-Is-the-Tiered-Storage-and-How-Does-It-Work" class="anchor-icon" translate="no">
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
    </button></h2><p>이러한 상충 관계를 없애기 위해 Milvus 2.6에서는 로컬 스토리지를 전체 데이터 세트의 컨테이너가 아닌 캐시로 취급하여 성능과 비용의 균형을 맞추는 계층형 <strong>스토리지를</strong> 도입했습니다.</p>
<p>이 모델에서 쿼리 노드는 시작할 때 가벼운 메타데이터만 로드합니다. 필드 데이터와 인덱스는 쿼리에 필요할 때 원격 개체 스토리지에서 필요에 따라 가져오고, 자주 액세스하는 경우 로컬에 캐시됩니다. 비활성 데이터는 공간을 확보하기 위해 제거될 수 있습니다.</p>
<p>그 결과, 핫 데이터는 지연 시간이 짧은 쿼리를 위해 컴퓨팅 계층에 가깝게 유지되고 콜드 데이터는 필요할 때까지 오브젝트 스토리지에 남아 있습니다. 이렇게 하면 로드 시간이 단축되고 리소스 효율성이 향상되며 쿼리 노드가 로컬 메모리나 디스크 용량보다 훨씬 큰 데이터 세트를 쿼리할 수 있습니다.</p>
<p>실제로 계층형 스토리지는 다음과 같이 작동합니다:</p>
<ul>
<li><p><strong>핫 데이터를 로컬에 유지합니다:</strong> 자주 액세스하는 데이터의 약 20%는 로컬 노드에 상주하여 가장 중요한 쿼리의 80%에 대해 낮은 대기 시간을 보장합니다.</p></li>
<li><p><strong>필요에 따라 콜드 데이터 로드:</strong> 거의 액세스하지 않는 나머지 80%의 데이터는 필요할 때만 가져오기 때문에 대부분의 로컬 메모리와 디스크 리소스를 확보할 수 있습니다.</p></li>
<li><p><strong>LRU 기반 퇴출로 동적으로 적응하세요:</strong> Milvus는 LRU(최소 최근 사용량) 퇴거 전략을 사용해 어떤 데이터를 핫 데이터 또는 콜드 데이터로 간주할지 지속적으로 조정합니다. 비활성 데이터는 자동으로 퇴출되어 새로 액세스할 데이터를 위한 공간을 확보합니다.</p></li>
</ul>
<p>이러한 설계 덕분에 Milvus는 더 이상 로컬 메모리와 디스크의 고정된 용량에 제약을 받지 않습니다. 대신 로컬 리소스는 동적으로 관리되는 캐시로 작동하며, 비활성 데이터에서 지속적으로 공간을 회수하여 활성 워크로드에 재할당합니다.</p>
<p>내부적으로 이 동작은 세 가지 핵심 기술 메커니즘을 통해 구현됩니다:</p>
<h3 id="1-Lazy-Load" class="common-anchor-header">1. 지연 로드</h3><p>초기화 시 Milvus는 최소한의 세그먼트 수준 메타데이터만 로드하므로 시작 직후에 컬렉션을 쿼리할 수 있습니다. 필드 데이터와 인덱스 파일은 원격 저장소에 남아 있다가 쿼리 실행 중에 필요에 따라 가져오기 때문에 로컬 메모리와 디스크 사용량을 낮게 유지합니다.</p>
<p><strong>Milvus 2.5에서 컬렉션 로딩의 작동 방식</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2_5_en_aa89de3570.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Milvus 2.6 이상에서 지연 로딩이 작동하는 방식</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2_6_en_049fa45540.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>초기화 중에 로드되는 메타데이터는 크게 네 가지 범주로 나뉩니다:</p>
<ul>
<li><p><strong>세그먼트 통계</strong> (행 수, 세그먼트 크기 및 스키마 메타데이터와 같은 기본 정보)</p></li>
<li><p><strong>타임스탬프</strong> (시간 여행 쿼리를 지원하는 데 사용됨)</p></li>
<li><p><strong>레코드 삽입 및 삭제</strong> (쿼리 실행 중 데이터 일관성을 유지하는 데 필요)</p></li>
<li><p><strong>블룸 필터</strong> (관련 없는 세그먼트를 빠르게 제거하기 위한 빠른 사전 필터링에 사용)</p></li>
</ul>
<h3 id="2-Partial-Load" class="common-anchor-header">2. 부분 로드</h3><p>지연 로딩은 데이터가 로드되는 <em>시기를</em> 제어하는 반면, 부분 로딩은 로드되는 데이터의 <em>양을</em> 제어합니다. 쿼리 또는 검색이 시작되면, 쿼리 노드는 부분 로드를 수행하여 필요한 데이터 청크 또는 인덱스 파일만 객체 저장소에서 가져옵니다.</p>
<p><strong>벡터 인덱스: 테넌트 인식 로딩</strong></p>
<p>Milvus 2.6+에 도입된 가장 영향력 있는 기능 중 하나는 멀티테넌트 워크로드를 위해 특별히 설계된 테넌트 인식 벡터 인덱스 로딩입니다.</p>
<p>쿼리가 단일 테넌트의 데이터에 액세스하면 Milvus는 해당 테넌트에 속한 벡터 인덱스의 일부만 로드하고 다른 모든 테넌트에 대한 인덱스 데이터는 건너뜁니다. 이렇게 하면 로컬 리소스를 활성 테넌트에 집중할 수 있습니다.</p>
<p>이 설계는 몇 가지 이점을 제공합니다:</p>
<ul>
<li><p>비활성 테넌트에 대한 벡터 인덱스는 로컬 메모리나 디스크를 소모하지 않습니다.</p></li>
<li><p>활성 테넌트에 대한 인덱스 데이터는 지연 시간이 짧은 액세스를 위해 캐시된 상태로 유지됩니다.</p></li>
<li><p>테넌트 수준의 LRU 퇴출 정책은 테넌트 간에 공정한 캐시 사용을 보장합니다.</p></li>
</ul>
<p><strong>스칼라 필드: 컬럼 수준 부분 로딩</strong></p>
<p>부분 로딩은 <strong>스칼라 필드에도</strong> 적용되어 Milvus가 쿼리에서 명시적으로 참조하는 열만 로드할 수 있습니다.</p>
<p><code translate="no">id</code>, <code translate="no">vector</code>, <code translate="no">title</code>, <code translate="no">description</code>, <code translate="no">category</code>, <code translate="no">price</code>, <code translate="no">stock</code>, <code translate="no">tags</code> 과 같은 <strong>50개의 스키마 필드가</strong> 있는 컬렉션을 예로 들어보면<code translate="no">id</code>, <code translate="no">title</code>, <code translate="no">price</code> 과 같은 3개의 필드만 반환하면 됩니다.</p>
<ul>
<li><p><strong>Milvus 2.5에서는</strong> 쿼리 요구 사항에 관계없이 50개의 스칼라 필드가 모두 로드됩니다.</p></li>
<li><p><strong>Milvus 2.6 이상에서는</strong> 요청된 세 개의 필드만 로드됩니다. 나머지 47개 필드는 로드되지 않은 상태로 유지되며 나중에 액세스하는 경우에만 느리게 가져옵니다.</p></li>
</ul>
<p>리소스를 상당히 절약할 수 있습니다. 각 스칼라 필드가 20GB를 차지하는 경우:</p>
<ul>
<li><p>모든 필드를 로드하려면 <strong>1,000GB</strong> (50×20GB)가 필요합니다.</p></li>
<li><p>필수 필드 3개만 로드하면 <strong>60GB</strong> 사용</p></li>
</ul>
<p>이는 쿼리 정확도나 결과에 영향을 주지 않으면서도 스칼라 데이터 로딩이 <strong>94% 감소하는</strong> 것을 의미합니다.</p>
<p><strong>참고:</strong> 스칼라 필드 및 벡터 인덱스에 대한 테넌트 인식 부분 로딩은 다음 릴리스에서 공식적으로 도입될 예정입니다. 이 기능이 제공되면 대규모 멀티테넌트 배포에서 로드 지연 시간을 더욱 단축하고 콜드 쿼리 성능을 개선할 수 있습니다.</p>
<h3 id="3-LRU-Based-Cache-Eviction" class="common-anchor-header">3. LRU 기반 캐시 퇴거</h3><p>지연 로딩과 부분 로딩은 로컬 메모리와 디스크로 가져오는 데이터의 양을 크게 줄여줍니다. 그러나 장기 실행 시스템에서는 시간이 지남에 따라 새로운 데이터에 액세스함에 따라 캐시가 계속 증가합니다. 로컬 용량에 도달하면 LRU 기반 캐시 퇴거가 적용됩니다.</p>
<p>LRU(최소 최근 사용량) 퇴거는 간단한 규칙에 따라 최근에 액세스하지 않은 데이터가 먼저 퇴거됩니다. 이렇게 하면 자주 사용하는 데이터는 캐시에 그대로 유지하면서 새로 액세스한 데이터를 위한 로컬 공간을 확보할 수 있습니다.</p>
<h2 id="Performance-Evaluation-Tiered-Storage-vs-Full-Loading" class="common-anchor-header">성능 평가: 계층형 스토리지와 전체 로딩 비교<button data-href="#Performance-Evaluation-Tiered-Storage-vs-Full-Loading" class="anchor-icon" translate="no">
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
    </button></h2><p>계층형 <strong>스토리지의</strong> 실제 영향을 평가하기 위해 프로덕션 워크로드와 매우 유사한 테스트 환경을 설정했습니다. 로드 시간, 리소스 사용량, 쿼리 성능, 유효 용량, 비용 효율성 등 5가지 측면에서 Milvus를 계층형 스토리지와 사용하지 않은 경우를 비교했습니다.</p>
<h3 id="Experimental-setup" class="common-anchor-header">실험 설정</h3><p><strong>데이터 세트</strong></p>
<ul>
<li><p>768개의 차원이 포함된 1억 개의 벡터(BERT 임베딩)</p></li>
<li><p>벡터 인덱스 크기: 약 430GB</p></li>
<li><p>ID, 타임스탬프, 카테고리를 포함한 10개의 스칼라 필드</p></li>
</ul>
<p><strong>하드웨어 구성</strong></p>
<ul>
<li><p>4개의 vCPU, 32GB 메모리, 1TB NVMe SSD를 갖춘 1개의 쿼리 노드</p></li>
<li><p>10Gbps 네트워크</p></li>
<li><p>원격 스토리지 백엔드로서 MinIO 개체 스토리지 클러스터 사용</p></li>
</ul>
<p><strong>액세스 패턴</strong></p>
<p>쿼리는 현실적인 핫-콜드 액세스 분포를 따릅니다:</p>
<ul>
<li><p>쿼리의 80%가 최근 30일간의 데이터를 대상으로 함(전체 데이터의 ≈20%)</p></li>
<li><p>15%는 30~90일 사이의 데이터를 대상으로 합니다(전체 데이터의 ≈30%).</p></li>
<li><p>5%는 90일 이상 오래된 데이터를 대상으로 합니다(전체 데이터의 ≈50%).</p></li>
</ul>
<h3 id="Key-results" class="common-anchor-header">주요 결과</h3><p><strong>1. 로드 시간 33배 단축</strong></p>
<table>
<thead>
<tr><th style="text-align:center"><strong>단계</strong></th><th style="text-align:center"><strong>Milvus 2.5</strong></th><th style="text-align:center"><strong>Milvus 2.6+(계층형 스토리지)</strong></th><th style="text-align:center"><strong>속도 향상</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center">데이터 다운로드</td><td style="text-align:center">22분</td><td style="text-align:center">28초</td><td style="text-align:center">47×</td></tr>
<tr><td style="text-align:center">색인 로딩</td><td style="text-align:center">3분</td><td style="text-align:center">17초</td><td style="text-align:center">10.5×</td></tr>
<tr><td style="text-align:center"><strong>합계</strong></td><td style="text-align:center"><strong>25분</strong></td><td style="text-align:center"><strong>45초</strong></td><td style="text-align:center"><strong>33×</strong></td></tr>
</tbody>
</table>
<p>Milvus 2.5에서는 컬렉션을 로딩하는 데 <strong>25분이</strong> 걸렸습니다. Milvus 2.6+의 계층형 스토리지를 사용하면 동일한 워크로드를 <strong>45초</strong> 만에 완료할 수 있어 로드 효율성이 크게 향상됩니다.</p>
<p><strong>2. 로컬 리소스 사용량 80% 감소</strong></p>
<table>
<thead>
<tr><th style="text-align:center"><strong>단계</strong></th><th style="text-align:center"><strong>Milvus 2.5</strong></th><th style="text-align:center"><strong>Milvus 2.6+(계층형 스토리지)</strong></th><th style="text-align:center"><strong>감소</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center">로드 후</td><td style="text-align:center">430 GB</td><td style="text-align:center">12 GB</td><td style="text-align:center">-97%</td></tr>
<tr><td style="text-align:center">1시간 후</td><td style="text-align:center">430 GB</td><td style="text-align:center">68 GB</td><td style="text-align:center">-84%</td></tr>
<tr><td style="text-align:center">24시간 후</td><td style="text-align:center">430 GB</td><td style="text-align:center">85GB</td><td style="text-align:center">-80%</td></tr>
<tr><td style="text-align:center">정상 상태</td><td style="text-align:center">430 GB</td><td style="text-align:center">85-95 GB</td><td style="text-align:center">~80%</td></tr>
</tbody>
</table>
<p>Milvus 2.5에서는 워크로드나 런타임에 관계없이 로컬 리소스 사용량이 <strong>430GB로</strong> 일정하게 유지됩니다. 이와 대조적으로 Milvus 2.6+는 로딩 직후 <strong>12GB로</strong> 시작됩니다.</p>
<p>쿼리가 실행되면서 자주 액세스하는 데이터는 로컬에 캐시되고 리소스 사용량이 점차 증가합니다. 약 24시간이 지나면 시스템은 핫 데이터의 작업 세트를 반영하여 <strong>85~95GB에서</strong> 안정화됩니다. 장기적으로는 쿼리 가용성에 영향을 주지 않으면서 로컬 메모리와 디스크 사용량을 <strong> 최대 80%까지 줄일</strong> 수 있습니다.</p>
<p><strong>3. 핫 데이터 성능에 거의 영향을 미치지 않음</strong></p>
<table>
<thead>
<tr><th style="text-align:center"><strong>쿼리 유형</strong></th><th style="text-align:center"><strong>Milvus 2.5 P99 레이턴시</strong></th><th style="text-align:center"><strong>Milvus 2.6+ P99 레이턴시</strong></th><th style="text-align:center"><strong>변경</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center">핫 데이터 쿼리</td><td style="text-align:center">15ms</td><td style="text-align:center">16ms</td><td style="text-align:center">+6.7%</td></tr>
<tr><td style="text-align:center">웜 데이터 쿼리</td><td style="text-align:center">15ms</td><td style="text-align:center">28ms</td><td style="text-align:center">+86%</td></tr>
<tr><td style="text-align:center">콜드 데이터 쿼리(첫 번째 액세스)</td><td style="text-align:center">15ms</td><td style="text-align:center">120ms</td><td style="text-align:center">+700%</td></tr>
<tr><td style="text-align:center">콜드 데이터 쿼리(캐시된)</td><td style="text-align:center">15ms</td><td style="text-align:center">18ms</td><td style="text-align:center">+20%</td></tr>
</tbody>
</table>
<p>전체 쿼리의 약 80%를 차지하는 핫 데이터의 경우, P99 지연 시간은 6.7%만 증가하여 프로덕션에 거의 영향을 미치지 않습니다.</p>
<p>콜드 데이터 쿼리는 오브젝트 스토리지에서 온디맨드 로딩으로 인해 처음 액세스할 때 더 높은 지연 시간을 보입니다. 그러나 일단 캐시되면 지연 시간은 20%만 증가합니다. 콜드 데이터의 낮은 액세스 빈도를 고려할 때, 이러한 절충안은 대부분의 실제 워크로드에서 일반적으로 허용되는 수준입니다.</p>
<p><strong>4. 4.3배 더 큰 유효 용량</strong></p>
<p>동일한 하드웨어 예산(각각 64GB 메모리(총 512GB)를 갖춘 8대의 서버)에서 Milvus 2.5는 최대 512GB의 데이터를 로드할 수 있으며, 이는 약 1억 3,600만 개의 벡터에 해당합니다.</p>
<p>Milvus 2.6 이상에서 계층형 스토리지를 활성화하면 동일한 하드웨어로 2.2TB의 데이터, 즉 약 5억 9천만 개의 벡터를 지원할 수 있습니다. 이는 유효 용량이 4.3배 증가한 것으로, 로컬 메모리를 확장하지 않고도 훨씬 더 큰 데이터 세트를 제공할 수 있습니다.</p>
<p><strong>5. 80.1% 비용 절감</strong></p>
<p>AWS 환경에서 2TB 벡터 데이터세트를 예로 들어, 데이터의 20%(400GB)가 핫 데이터라고 가정했을 때, 비용 비교는 다음과 같습니다:</p>
<table>
<thead>
<tr><th style="text-align:center"><strong>항목</strong></th><th style="text-align:center"><strong>Milvus 2.5</strong></th><th style="text-align:center"><strong>Milvus 2.6+(계층형 스토리지)</strong></th><th style="text-align:center"><strong>절감액</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center">월 비용</td><td style="text-align:center">$11,802</td><td style="text-align:center">$2,343</td><td style="text-align:center">$9,459</td></tr>
<tr><td style="text-align:center">연간 비용</td><td style="text-align:center">$141,624</td><td style="text-align:center">$28,116</td><td style="text-align:center">$113,508</td></tr>
<tr><td style="text-align:center">절감률</td><td style="text-align:center">-</td><td style="text-align:center">-</td><td style="text-align:center"><strong>80.1%</strong></td></tr>
</tbody>
</table>
<h3 id="Benchmark-Summary" class="common-anchor-header">벤치마크 요약</h3><p>모든 테스트에서 계층형 스토리지는 일관되고 측정 가능한 개선 효과를 제공했습니다:</p>
<ul>
<li><p><strong>33배 빨라진 로드 시간:</strong> 수집 로드 시간이 <strong>25분에서 45초로</strong> 단축됩니다.</p></li>
<li><p><strong>로컬 리소스 사용량 80% 감소:</strong> 정상 작동 시 메모리 및 로컬 디스크 사용량이 약 <strong>80%</strong> 감소합니다.</p></li>
<li><p><strong>핫 데이터 성능에 거의 영향을 미치지 않습니다:</strong> 핫 데이터에 대한 P99 지연 시간이 <strong>10% 미만으로</strong> 증가하여 지연 시간이 짧은 쿼리 성능을 유지합니다.</p></li>
<li><p><strong>콜드 데이터에 대한 지연 시간 제어:</strong> 콜드 데이터는 첫 번째 액세스 시 지연 시간이 더 길어지지만, 액세스 빈도가 낮다는 점을 고려하면 이는 허용 가능한 수준입니다.</p></li>
<li><p><strong>4.3배 더 높은 유효 용량:</strong> 동일한 하드웨어로 추가 메모리 없이 <strong>4~5배 더 많은 데이터를</strong> 제공할 수 있습니다.</p></li>
<li><p><strong>80% 이상의 비용 절감:</strong> 연간 인프라 비용이 <strong>80% 이상</strong> 절감됩니다.</p></li>
</ul>
<h2 id="When-to-Use-Tiered-Storage-in-Milvus" class="common-anchor-header">Milvus에서 계층형 스토리지를 사용해야 하는 경우<button data-href="#When-to-Use-Tiered-Storage-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>벤치마크 결과와 실제 프로덕션 사례를 바탕으로 계층형 스토리지 사용 사례를 세 가지 범주로 분류하여 워크로드에 적합한지 여부를 결정하는 데 도움을 드립니다.</p>
<h3 id="Best-Fit-Use-Cases" class="common-anchor-header">가장 적합한 사용 사례</h3><p><strong>1. 멀티테넌트 벡터 검색 플랫폼</strong></p>
<ul>
<li><p><strong>특성:</strong> 활동량이 매우 고르지 않은 다수의 테넌트가 있으며, 벡터 검색이 핵심 워크로드입니다.</p></li>
<li><p><strong>액세스 패턴:</strong> 20% 미만의 테넌트가 80% 이상의 벡터 쿼리를 생성합니다.</p></li>
<li><p><strong>기대되는 이점:</strong> 70~80%의 비용 절감, 3~5배의 용량 확장.</p></li>
</ul>
<p><strong>2. 이커머스 추천 시스템(벡터 검색 워크로드)</strong></p>
<ul>
<li><p><strong>특성:</strong> 상위 상품과 롱테일 사이에 강한 인기 편중이 존재합니다.</p></li>
<li><p><strong>액세스 패턴:</strong> 상위 10%의 제품이 벡터 검색 트래픽의 약 80%를 차지합니다.</p></li>
<li><p><strong>기대되는 이점:</strong> 피크 이벤트 시 추가 용량 필요 없음; 60~70% 비용 절감</p></li>
</ul>
<p><strong>3. 핫-콜드 분리가 명확한 대규모 데이터 세트(벡터 중심)</strong></p>
<ul>
<li><p><strong>특징</strong> TB 규모 이상의 데이터 세트, 최근 데이터에 대한 액세스가 크게 편중되어 있습니다.</p></li>
<li><p><strong>액세스 패턴:</strong> 전형적인 80/20 분포: 20%의 데이터가 80%의 쿼리를 처리합니다.</p></li>
<li><p><strong>기대되는 이점</strong> 75~85%의 비용 절감</p></li>
</ul>
<h3 id="Good-Fit-Use-Cases" class="common-anchor-header">적합한 사용 사례</h3><p><strong>1. 비용에 민감한 워크로드</strong></p>
<ul>
<li><p><strong>특성:</strong> 예산이 빠듯하고 사소한 성능 저하를 어느 정도 용인할 수 있는 경우.</p></li>
<li><p><strong>액세스 패턴:</strong> 벡터 쿼리가 상대적으로 집중되어 있습니다.</p></li>
<li><p><strong>기대되는 이점:</strong> 50~70%의 비용 절감; 콜드 데이터는 첫 번째 액세스 시 최대 500ms의 지연 시간이 발생할 수 있으므로 SLA 요구 사항에 따라 평가해야 합니다.</p></li>
</ul>
<p><strong>2. 기록 데이터 보존 및 아카이브 검색</strong></p>
<ul>
<li><p><strong>특성:</strong> 쿼리 빈도가 매우 낮은 대량의 기록 벡터.</p></li>
<li><p><strong>액세스 패턴:</strong> 약 90%의 쿼리가 최근 데이터를 대상으로 합니다.</p></li>
<li><p><strong>기대되는 이점:</strong> 전체 기록 데이터 세트 유지, 인프라 비용 예측 및 제어 가능</p></li>
</ul>
<h3 id="Poor-Fit-Use-Cases" class="common-anchor-header">적합하지 않은 사용 사례</h3><p><strong>1. 균일하게 핫한 데이터 워크로드</strong></p>
<ul>
<li><p><strong>특성:</strong> 모든 데이터는 명확한 핫-콜드 구분 없이 비슷한 빈도로 액세스됩니다.</p></li>
<li><p><strong>부적합한 이유:</strong> 캐시 이점이 제한적임; 의미 있는 이득 없이 시스템 복잡성만 가중됨</p></li>
</ul>
<p><strong>2. 초저지연 워크로드</strong></p>
<ul>
<li><p><strong>특성:</strong> 금융 거래 또는 실시간 입찰과 같이 지연 시간에 매우 민감한 시스템</p></li>
<li><p><strong>부적합한 이유:</strong> 작은 지연 시간 변화도 용납할 수 없으며, 풀 로딩이 보다 예측 가능한 성능을 제공합니다.</p></li>
</ul>
<h2 id="Quick-Start-Try-Tiered-Storage-in-Milvus-26+" class="common-anchor-header">빠른 시작: Milvus 2.6+에서 계층형 스토리지 체험하기<button data-href="#Quick-Start-Try-Tiered-Storage-in-Milvus-26+" class="anchor-icon" translate="no">
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
    </button></h2><pre><code translate="no"><span class="hljs-comment"># Download Milvus 2.6.1+</span>
$ wget https://github.com/milvus-io/milvus/releases/latest
<span class="hljs-comment"># Configure Tiered Storage</span>
$ vi milvus.yaml
queryNode.segcore.tieredStorage:
  warmup:
    scalarField: <span class="hljs-built_in">disable</span>
    scalarIndex: <span class="hljs-built_in">disable</span>
    vectorField: <span class="hljs-built_in">disable</span>
    vectorIndex: <span class="hljs-built_in">disable</span>
  evictionEnabled: <span class="hljs-literal">true</span>
<span class="hljs-comment"># Launch Milvus</span>
$ docker-compose up -d
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
    </button></h2><p>Milvus 2.6의 계층형 스토리지는 벡터 데이터가 저장되는 방식과 실제로 액세스되는 방식 사이의 일반적인 불일치를 해결합니다. 대부분의 프로덕션 시스템에서는 데이터의 극히 일부만 자주 쿼리되지만, 기존의 로딩 모델은 모든 데이터를 동일하게 핫 데이터로 취급합니다. 온디맨드 로딩으로 전환하고 로컬 메모리와 디스크를 캐시로 관리함으로써 Milvus는 최악의 가정이 아닌 실제 쿼리 동작에 맞춰 리소스 소비를 조정합니다.</p>
<p>이 접근 방식을 통해 시스템은 핫 쿼리 성능을 거의 그대로 유지하면서 로컬 리소스를 비례적으로 늘리지 않고도 더 큰 데이터 세트로 확장할 수 있습니다. 콜드 데이터는 필요할 때 예측 가능하고 제한적인 지연 시간으로 계속 액세스할 수 있으므로 장단점을 명확히 파악하고 제어할 수 있습니다. 벡터 검색이 비용에 민감한 멀티테넌트, 장기 운영 프로덕션 환경으로 더 깊숙이 이동함에 따라 계층형 스토리지는 대규모로 효율적으로 운영할 수 있는 실용적인 기반을 제공합니다.</p>
<p>계층형 스토리지에 대한 자세한 내용은 아래 설명서를 참조하세요:</p>
<ul>
<li><a href="https://milvus.io/docs/tiered-storage-overview.md">계층형 스토리지 | Milvus 설명서</a></li>
</ul>
<p>최신 Milvus의 기능에 대해 궁금한 점이 있거나 자세히 알아보고 싶으신가요?<a href="https://discord.com/invite/8uyFbECzPX"> Discord 채널에</a> 참여하거나<a href="https://github.com/milvus-io/milvus"> GitHub에서</a> 이슈를 제출하세요. 또한<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus 오피스 아워를</a> 통해 20분간의 일대일 세션을 예약하여 인사이트, 안내, 질문에 대한 답변을 얻을 수 있습니다.</p>
<h2 id="Learn-More-about-Milvus-26-Features" class="common-anchor-header">Milvus 2.6 기능에 대해 자세히 알아보기<button data-href="#Learn-More-about-Milvus-26-Features" class="anchor-icon" translate="no">
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
<li><p><a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md">Milvus 2.6 소개: 10억 개 규모의 경제적인 벡터 검색</a></p></li>
<li><p><a href="https://milvus.io/blog/data-in-and-data-out-in-milvus-2-6.md">임베딩 기능을 소개합니다: Milvus 2.6이 벡터화 및 시맨틱 검색을 간소화하는 방법</a></p></li>
<li><p><a href="https://milvus.io/blog/json-shredding-in-milvus-faster-json-filtering-with-flexibility.md">Milvus의 JSON 파쇄: 유연성을 갖춘 88.9배 더 빠른 JSON 필터링</a></p></li>
<li><p><a href="https://milvus.io/blog/unlocking-true-entity-level-retrieval-new-array-of-structs-and-max-sim-capabilities-in-milvus.md">진정한 엔티티 수준 검색을 실현합니다: Milvus의 새로운 구조 배열 및 MAX_SIM 기능</a></p></li>
<li><p><a href="https://milvus.io/blog/unlock-geo-vector-search-with-geometry-fields-and-rtree-index-in-milvus.md">Milvus 2.6에서 지오메트리 필드 및 RTREE와 함께 지리공간 필터링 및 벡터 검색 제공</a></p></li>
<li><p><a href="https://milvus.io/blog/introducing-aisaq-in-milvus-billion-scale-vector-search-got-3200-cheaper-on-memory.md">Milvus에 AISAQ 도입: 메모리 사용량이 3,200배 더 저렴해진 10억 개 규모의 벡터 검색</a></p></li>
<li><p><a href="https://milvus.io/blog/faster-index-builds-and-scalable-queries-with-gpu-cagra-in-milvus.md">Milvus에서 NVIDIA CAGRA 최적화: 더 빠른 인덱싱과 더 저렴한 쿼리를 위한 하이브리드 GPU-CPU 접근 방식</a></p></li>
<li><p><a href="https://milvus.io/blog/minhash-lsh-in-milvus-the-secret-weapon-for-fighting-duplicates-in-llm-training-data.md">Milvus의 MinHash LSH: LLM 훈련 데이터의 중복을 방지하는 비밀 무기 </a></p></li>
<li><p><a href="https://milvus.io/blog/bring-vector-compression-to-the-extreme-how-milvus-serves-3%C3%97-more-queries-with-rabitq.md">벡터 압축을 극한으로 끌어올리기: Milvus가 RaBitQ로 3배 더 많은 쿼리를 처리하는 방법</a></p></li>
<li><p><a href="https://milvus.io/blog/benchmarks-lie-vector-dbs-deserve-a-real-test.md">벤치마크는 거짓말 - 벡터 DB는 실제 테스트가 필요합니다. </a></p></li>
<li><p><a href="https://milvus.io/blog/we-replaced-kafka-pulsar-with-a-woodpecker-for-milvus.md">Milvus를 위해 카프카/펄서를 딱따구리로 대체했습니다.</a></p></li>
</ul>
