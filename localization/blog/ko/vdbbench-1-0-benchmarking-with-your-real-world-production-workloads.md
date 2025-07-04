---
id: vdbbench-1-0-benchmarking-with-your-real-world-production-workloads.md
title: 'VDBBench 1.0을 소개합니다: 실제 프로덕션 워크로드에 대한 오픈 소스 벡터 데이터베이스 벤치마킹'
author: Tian Min
date: 2025-07-04T00:00:00.000Z
desc: >-
  실제 데이터, 스트리밍 수집, 동시 워크로드로 벡터 데이터베이스를 벤치마킹할 수 있는 오픈 소스 도구인 VDBBench 1.0에 대해
  알아보세요.
cover: assets.zilliz.com/milvus_vdb_e0e8146c90.jpeg
tag: Announcements
recommend: false
publishToMedium: true
tags: 'vector database, Milvus, vectordb benchmarking, vector search'
meta_keywords: 'VDBBench, vector database, Milvus, Zilliz Cloud, benchmarking'
meta_title: |
  VDBBench 1.0: Real-World Benchmarking for Vector Databases
origin: >-
  https://zilliz.com/blog/vdbbench-1-0-benchmarking-with-your-real-world-production-workloads
---
<p>대부분의 벡터 데이터베이스 벤치마크는 정적 데이터와 사전 구축된 인덱스로 테스트합니다. 그러나 프로덕션 시스템은 사용자가 쿼리를 실행하는 동안 데이터가 지속적으로 흐르고, 인덱스 조각을 필터링하며, 동시 읽기/쓰기 로드에 따라 성능 특성이 급격하게 변하는 등 이러한 방식으로 작동하지 않습니다.</p>
<p>오늘 저희는 스트리밍 데이터 수집, 다양한 선택도를 가진 메타데이터 필터링, 실제 시스템 병목 현상을 드러내는 동시 워크로드 등 현실적인 운영 조건에서 벡터 데이터베이스를 테스트하기 위해 처음부터 설계된 오픈 소스 벤치마크인 <a href="https://github.com/zilliztech/VectorDBBench/releases/tag/v1.0.0"><strong>VDBBench 1.0을</strong></a> 출시합니다.</p>
<p><a href="https://github.com/zilliztech/VectorDBBench/releases/tag/v1.0.0"><strong>VDBBench 1.0 다운로드 →</strong></a> |<a href="https://zilliz.com/vdbbench-leaderboard?dataset=vectorSearch"> <strong>리더보드 보기 →</strong></a></p>
<h2 id="Why-Current-Benchmarks-Are-Misleading" class="common-anchor-header">현재 벤치마크가 오해의 소지가 있는 이유<button data-href="#Why-Current-Benchmarks-Are-Misleading" class="anchor-icon" translate="no">
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
    </button></h2><p>솔직히 말해서 우리 업계에는 이상한 현상이 있습니다. 모두가 "벤치마크는 게임용이 아니다"라고 말하지만, 많은 사람들이 정확히 그런 행동에 참여하고 있습니다. 2023년 벡터 데이터베이스 시장이 폭발적으로 성장한 이후, 우리는 '벤치마크는 훌륭하지만' 실제 운영에서는 '비참하게 실패'하여 엔지니어링 시간을 낭비하고 프로젝트 신뢰도를 떨어뜨리는 시스템의 수많은 사례를 보아왔습니다.</p>
<p>우리는 이러한 단절을 직접 목격했습니다. 예를 들어, Elasticsearch는 밀리초 수준의 쿼리 속도를 자랑하지만, 그 이면에서는 인덱스를 최적화하는 데만 20시간 이상이 걸릴 수 있습니다. 어떤 프로덕션 시스템이 이러한 다운타임을 견딜 수 있을까요?</p>
<p>이 문제는 세 가지 근본적인 결함에서 비롯됩니다:</p>
<ul>
<li><p><strong>오래된 데이터 세트:</strong> 최신 임베딩은 768~3,072개 차원에 이르는 반면, 많은 벤치마크는 여전히 SIFT(128개 차원)와 같은 레거시 데이터 세트에 의존하고 있습니다. 메모리 액세스 패턴, 인덱스 효율성, 계산 복잡성이 모두 크게 달라지는 등 128D와 1024D+ 벡터에서 작동하는 시스템의 성능 특성은 근본적으로 다릅니다.</p></li>
<li><p><strong>허울뿐인 지표:</strong> 벤치마크는 평균 레이턴시 또는 최대 QPS에 초점을 맞추기 때문에 왜곡된 그림을 만들어냅니다. 평균 지연 시간이 10밀리초인데 P99 지연 시간이 2초인 시스템은 끔찍한 사용자 경험을 제공합니다. 30초 이상 측정된 최대 처리량은 지속적인 성능에 대해 아무것도 알려주지 않습니다.</p></li>
<li><p><strong>지나치게 단순화된 시나리오:</strong> 대부분의 벤치마크는 기본적인 "데이터 쓰기, 인덱스 구축, 쿼리" 워크플로우, 즉 '헬로 월드' 수준의 테스트를 테스트합니다. 실제 프로덕션에서는 쿼리를 처리하는 동안 지속적인 데이터 수집, 인덱스를 조각화하는 복잡한 메타데이터 필터링, 리소스를 두고 경쟁하는 동시 읽기/쓰기 작업이 포함됩니다.</p></li>
</ul>
<h2 id="What’s-New-in-VDBBench-10" class="common-anchor-header">VDBBench 1.0의 새로운 기능은 무엇인가요?<button data-href="#What’s-New-in-VDBBench-10" class="anchor-icon" translate="no">
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
    </button></h2><p>벤치마크는 실제 프로덕션 동작을 예측하는 경우에만 가치가 있다는 하나의 기본 원칙에 따라, VDBBench는 오래된 벤치마킹 철학을 반복하는 것이 아니라 개념을 재구축합니다.</p>
<p><strong>데이터 신뢰성, 워크로드 패턴, 성능 측정 방법론이라는</strong> 세 가지 중요한 측면에서 실제 조건을 충실히 재현하도록 VDBBench를 설계했습니다.</p>
<p>어떤 새로운 기능이 추가되었는지 자세히 살펴보겠습니다.</p>
<h3 id="🚀-Redesigned-Dashboard-with-Production-Relevant-Visualizations" class="common-anchor-header"><strong>🚀 프로덕션 관련 시각화로 새롭게 디자인된 대시보드</strong></h3><p>대부분의 벤치마크는 원시 데이터 출력에만 초점을 맞추지만, 중요한 것은 엔지니어가 그 결과를 어떻게 해석하고 조치를 취하는가입니다. 명확성과 상호 작용을 우선시하도록 UI를 재설계하여 시스템 간의 성능 격차를 파악하고 인프라에 대한 신속한 의사 결정을 내릴 수 있도록 지원합니다.</p>
<p>새로운 대시보드는 성능 수치뿐만 아니라 다양한 필터 선택 수준에서 QPS가 어떻게 저하되는지, 스트리밍 수집 중에 리콜이 어떻게 변동하는지, 지연 시간 분포가 시스템 안정성 특성을 어떻게 나타내는지 등 수치 간의 관계도 시각화합니다.  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/vdb_1_df593dea0b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>밀버스, 질리즈 클라우드, 엘라스틱 클라우드, 큐드런트 클라우드, 파인콘, 오픈서치</strong> 등 주요 벡터 데이터베이스 플랫폼을 최신 구성과 권장 설정으로 다시 테스트하여 모든 벤치마크 데이터가 현재 기능을 반영하는지 확인했습니다. 모든 테스트 결과는<a href="https://zilliz.com/vdbbench-leaderboard?dataset=vectorSearch"> VDBBench 리더보드에서</a> 확인할 수 있습니다.</p>
<h3 id="🏷️-Tag-Filtering-The-Hidden-Performance-Killer" class="common-anchor-header">🏷️ 태그 필터링: 숨겨진 성능 저하 요인</h3><p>실제 쿼리는 고립된 상태로 발생하는 경우가 거의 없습니다. 애플리케이션은 벡터 유사성과 메타데이터 필터링을 결합합니다("이 사진과 비슷하지만 가격이 100달러 미만인 신발 찾기"). 이러한 필터링된 벡터 검색은 대부분의 벤치마크가 완전히 무시하는 고유한 문제를 야기합니다.</p>
<p>필터링된 검색은 두 가지 중요한 영역에서 복잡성을 유발합니다:</p>
<ul>
<li><p><strong>필터 복잡성</strong>: 더 많은 스칼라 필드와 복잡한 논리 조건은 계산 수요를 증가시키고 불충분한 리콜과 그래프 인덱스 조각화를 유발할 수 있습니다.</p></li>
<li><p><strong>필터 선택성</strong>: 이것은 프로덕션 환경에서 반복적으로 확인된 '숨겨진 성능 저하 요인'입니다. 필터링 조건이 매우 선택적이 되면(데이터의 99% 이상을 필터링) 쿼리 속도가 큰 폭으로 변동될 수 있으며, 희박한 결과 집합으로 인해 인덱스 구조가 어려움을 겪으면서 리콜이 불안정해질 수 있습니다.</p></li>
</ul>
<p>VDBBench는 다양한 필터링 선택도 수준(50%~99.9%)을 체계적으로 테스트하여 이러한 중요한 생산 패턴에서 포괄적인 성능 프로필을 제공합니다. 그 결과, 기존 벤치마크에서는 결코 나타나지 않는 극적인 성능 절벽이 종종 드러납니다.</p>
<p><strong>예시</strong>: Cohere 1M 테스트에서 Milvus는 모든 필터 선택도 수준에서 일관되게 높은 재검색률을 유지한 반면, OpenSearch는 다양한 필터링 조건에서 재검색률이 크게 변동하는 불안정한 성능을 보였으며 대부분의 프로덕션 환경에서는 허용할 수 없는 0.8 재검색률 이하로 떨어지는 경우가 많았습니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/vdb_2_0ef89463e5.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>그림: 다양한 필터 선택성 수준에 따른 Milvus 및 OpenSearch의 QPS 및 리콜(Cohere 1M 테스트).</em></p>
<h3 id="🌊-Streaming-ReadWrite-Beyond-Static-Index-Testing" class="common-anchor-header">🌊 스트리밍 읽기/쓰기: 정적 인덱스 테스트 그 이상</h3><p>프로덕션 시스템에서는 정적 데이터의 사치를 누릴 수 있는 경우가 거의 없습니다. 검색이 실행되는 동안 새로운 정보가 지속적으로 유입되기 때문에, 아무리 뛰어난 데이터베이스도 지속적인 쓰기를 처리하면서 검색 성능을 유지해야 하는 이중의 압박으로 인해 무너지는 경우가 많습니다.</p>
<p>VDBBench의 스트리밍 시나리오는 실제 병렬 작업을 시뮬레이션하여 개발자가 동시성이 높은 환경에서 시스템 안정성, 특히 데이터 쓰기가 쿼리 성능에 미치는 영향과 데이터 볼륨이 증가함에 따라 성능이 어떻게 변하는지를 이해하는 데 도움을 줍니다.</p>
<p>서로 다른 시스템 간에 공정한 비교를 보장하기 위해 VDBBench는 구조화된 접근 방식을 사용합니다:</p>
<ul>
<li><p>목표 프로덕션 워크로드를 반영하는 제어된 쓰기 속도를 구성합니다(예: 초당 500행이 5개의 병렬 프로세스에 분산되어 있음).</p></li>
<li><p>직렬 모드와 동시 모드를 번갈아 가며 데이터 수집의 10%마다 검색 작업을 트리거합니다.</p></li>
<li><p>포괄적인 메트릭 기록: 지연 시간 분포(P99 포함), 지속적 QPS 및 리콜 정확도</p></li>
<li><p>데이터 양과 시스템 스트레스 증가에 따른 시간 경과에 따른 성능 변화 추적</p></li>
</ul>
<p>이 제어된 점진적 부하 테스트는 기존 벤치마크가 거의 포착하지 못하는 지속적인 수집에서 시스템이 얼마나 안정성과 정확성을 잘 유지하는지를 보여줍니다.</p>
<p><strong>예시</strong>: Cohere 10M 스트리밍 테스트에서 Pinecone은 Elasticsearch에 비해 쓰기 주기 전반에 걸쳐 더 높은 QPS와 리콜을 유지했습니다. 특히, Pinecone의 성능은 수집 완료 후 크게 향상되어 지속적인 부하에서도 강력한 안정성을 보여준 반면, Elasticsearch는 활성 수집 단계에서 더 불규칙한 동작을 보였습니다.  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/vdb3_9d2a5298b0.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>그림: Cohere 10M 스트리밍 테스트(500행/s 수집 속도)에서 Pinecone과 Elasticsearch의 QPS 및 리콜 비교.</p>
<p>VDBBench는 선택적 최적화 단계를 지원함으로써 사용자가 인덱스 최적화 전후의 스트리밍 검색 성능을 비교할 수 있게 해줍니다. 또한 각 단계에서 소요된 실제 시간을 추적하고 보고하여 실제 운영 환경과 유사한 조건에서 시스템 효율성과 동작에 대한 보다 심층적인 인사이트를 제공합니다.  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/vdb4_0caee3b201.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>그림: 최적화 후 Cohere 10M 스트리밍 테스트(500행/초 수집 속도)에서 Pinecone과 Elasticsearch의 QPS 및 회수율 비교</em></p>
<p>테스트에서 볼 수 있듯이, 인덱스 최적화 후의 QPS에서는 Elasticsearch가 Pinecone을 능가했습니다. 그러나 x축이 실제 경과 시간을 반영하는 경우, Elasticsearch가 해당 성능에 도달하는 데 훨씬 더 오래 걸렸다는 것을 알 수 있습니다. 프로덕션 환경에서는 이러한 지연이 중요합니다. 이 비교는 최대 처리량과 서비스 시간이라는 핵심적인 장단점을 보여줍니다.</p>
<h3 id="🔬-Modern-Datasets-That-Reflect-Current-AI-Workloads" class="common-anchor-header">최신 AI 워크로드를 반영하는 최신 데이터 세트</h3><p>저희는 벡터 데이터베이스 벤치마킹에 사용되는 데이터 세트를 완전히 개편했습니다. VDBBench는 SIFT 및 GloVe와 같은 레거시 테스트 세트 대신 오늘날의 AI 애플리케이션을 구동하는 OpenAI 및 Cohere와 같은 최신 임베딩 모델에서 생성된 벡터를 사용합니다.</p>
<p>특히 검색 증강 생성(RAG)과 같은 사용 사례에 대한 관련성을 보장하기 위해 실제 기업 및 도메인별 시나리오를 반영하는 코퍼스를 선택했습니다:</p>
<table>
<thead>
<tr><th></th><th></th><th></th><th></th><th></th></tr>
</thead>
<tbody>
<tr><td><strong>코퍼스</strong></td><td><strong>임베딩 모델</strong></td><td><strong>차원</strong></td><td><strong>크기</strong></td><td><strong>사용 사례</strong></td></tr>
<tr><td>Wikipedia</td><td>Cohere V2</td><td>768</td><td>1M / 10M</td><td>일반 지식 기반</td></tr>
<tr><td>BioASQ</td><td>Cohere V3</td><td>1024</td><td>1M / 10M</td><td>도메인별(바이오메디컬)</td></tr>
<tr><td>C4</td><td>OpenAI</td><td>1536</td><td>500K / 5M</td><td>웹 규모 텍스트 처리</td></tr>
<tr><td>MSMarco V2</td><td>udever-bloom-1b1</td><td>1536</td><td>1m / 10m / 138m</td><td>대규모 검색</td></tr>
</tbody>
</table>
<p>이러한 데이터 세트는 오늘날의 대용량, 고차원 벡터 데이터를 더 잘 시뮬레이션하여 최신 AI 워크로드와 일치하는 조건에서 스토리지 효율성, 쿼리 성능 및 검색 정확도를 현실적으로 테스트할 수 있습니다.</p>
<h3 id="⚙️-Custom-Dataset-Support-for-Industry-Specific-Testing" class="common-anchor-header">⚙️ 산업별 테스트를 위한 맞춤형 데이터 세트 지원</h3><p>모든 비즈니스는 고유합니다. 금융 업계에서는 트랜잭션 임베딩에 초점을 맞춘 테스트가 필요할 수 있는 반면, 소셜 플랫폼에서는 사용자 행동 벡터에 더 많은 관심을 기울여야 합니다. VDBBench를 사용하면 특정 워크로드에 대한 특정 임베딩 모델에서 생성된 자체 데이터로 벤치마킹할 수 있습니다.</p>
<p>사용자 지정할 수 있습니다:</p>
<ul>
<li><p>벡터 차원 및 데이터 유형</p></li>
<li><p>메타데이터 스키마 및 필터링 패턴</p></li>
<li><p>데이터 볼륨 및 수집 패턴</p></li>
<li><p>프로덕션 트래픽과 일치하는 쿼리 분포</p></li>
</ul>
<p>결국, 자체 프로덕션 데이터보다 더 나은 스토리를 제공하는 데이터 세트는 없습니다.</p>
<h2 id="How-VDBBench-Measures-What-Actually-Matters-in-Production" class="common-anchor-header">프로덕션에서 실제로 중요한 것을 측정하는 VDBBench의 방법<button data-href="#How-VDBBench-Measures-What-Actually-Matters-in-Production" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Production-Focused-Metric-Design" class="common-anchor-header">프로덕션에 초점을 맞춘 메트릭 설계</h3><p>VDBBench는 실험실 결과뿐만 아니라 실제 성능을 반영하는 메트릭을 우선시합니다. <strong>부하 시 안정성, 테일 레이턴시 특성, 지속적인 처리량, 정확도 보존</strong> 등 프로덕션 환경에서 실제로 중요한 사항을 중심으로 벤치마킹을 재설계했습니다.</p>
<ul>
<li><p><strong>실제 사용자 경험을 위한 P95/P99 지연 시간</strong>: 평균/중앙값 지연 시간은 실제 사용자를 불편하게 하고 근본적인 시스템 불안정성을 나타낼 수 있는 이상값을 가려줍니다. VDBBench는 P95/P99와 같은 테일 레이턴시에 초점을 맞춰 쿼리의 95% 또는 99%가 실제로 어떤 성능을 달성할 수 있는지 보여줍니다. 이는 SLA를 계획하고 최악의 사용자 경험을 이해하는 데 매우 중요합니다.</p></li>
<li><p><strong>부하 시 지속 가능한 처리량</strong>: 5초 동안 잘 작동하는 시스템이 프로덕션 환경에서는 제대로 작동하지 않습니다. VDBBench는 점진적으로 동시성을 증가시켜 데이터베이스의 초당 최대 지속 가능한 쿼리 수(<code translate="no">max_qps</code>)를 찾아냅니다(단기간의 이상적인 조건에서 최고 수치가 아닌). 이 방법론은 시간이 지남에 따라 시스템이 얼마나 잘 견디는지를 보여주며 현실적인 용량 계획을 세우는 데 도움이 됩니다.</p></li>
<li><p><strong>성능과 균형 잡힌 리콜</strong>: 정확성 없는 속도는 무의미합니다. VDBBench의 모든 성능 수치는 리콜 측정값과 짝을 이루므로 처리량과 얼마나 관련성이 있는지 정확히 알 수 있습니다. 이를 통해 내부 트레이드오프가 크게 다른 시스템 간에 공정한 비교를 할 수 있습니다.</p></li>
</ul>
<h3 id="Test-Methodology-That-Reflects-Reality" class="common-anchor-header">현실을 반영하는 테스트 방법론</h3><p>VDBBench 설계의 핵심 혁신은 직렬 테스트와 동시 테스트를 분리하여 다양한 유형의 부하에서 시스템이 어떻게 작동하는지 파악하고 다양한 사용 사례에 중요한 성능 특성을 드러내는 데 도움이 됩니다.</p>
<p><strong>지연 시간 측정 분리:</strong></p>
<ul>
<li><p><code translate="no">serial_latency_p99</code> 한 번에 하나의 요청만 처리하는 최소 부하 상태에서 시스템 성능을 측정합니다. 이는 지연 시간에 대한 최상의 시나리오를 나타내며 기준 시스템 성능을 파악하는 데 도움이 됩니다.</p></li>
<li><p><code translate="no">conc_latency_p99</code> 여러 요청이 동시에 도착하여 시스템 리소스를 놓고 경쟁하는 현실적인 고동시성 조건에서 시스템 동작을 캡처합니다.</p></li>
</ul>
<p><strong>2단계 벤치마크 구조</strong>:</p>
<ol>
<li><p><strong>연속 테스트</strong>: 1,000개의 쿼리를 단일 프로세스로 실행하여 기준 성능과 정확도를 설정하고 <code translate="no">serial_latency_p99</code> 및 리콜을 모두 보고합니다. 이 단계는 이론적 성능 한계를 파악하는 데 도움이 됩니다.</p></li>
<li><p><strong>동시성 테스트</strong>: 몇 가지 주요 혁신을 통해 지속적인 부하가 걸리는 프로덕션 환경을 시뮬레이션합니다:</p>
<ul>
<li><p><strong>현실적인 클라이언트 시뮬레이션</strong>: 각 테스트 프로세스는 자체 연결 및 쿼리 집합을 사용하여 독립적으로 작동하므로 결과를 왜곡할 수 있는 공유 상태 간섭을 피할 수 있습니다.</p></li>
<li><p><strong>동기화된 시작</strong>: 모든 프로세스가 동시에 시작되므로 측정된 QPS가 청구된 동시성 수준을 정확하게 반영합니다.</p></li>
<li><p><strong>독립 쿼리 세트</strong>: 프로덕션 쿼리 다양성을 반영하지 않는 비현실적인 캐시 적중률 방지</p></li>
</ul></li>
</ol>
<p>이러한 세심하게 구조화된 방법은 VDBBench가 보고하는 <code translate="no">max_qps</code> 및 <code translate="no">conc_latency_p99</code> 값이 정확하고 프로덕션과 관련이 있음을 보장하여 프로덕션 용량 계획 및 시스템 설계에 의미 있는 인사이트를 제공합니다.</p>
<h2 id="Getting-Started-with-VDBBench-10" class="common-anchor-header">VDBBench 1.0 시작하기<button data-href="#Getting-Started-with-VDBBench-10" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>VDBBench 1.0은</strong> 생산 관련 벤치마킹을 향한 근본적인 변화를 나타냅니다. 지속적인 데이터 쓰기, 다양한 선택성을 가진 메타데이터 필터링, 동시 액세스 패턴에 따른 스트리밍 부하를 다룸으로써 현재 사용 가능한 실제 프로덕션 환경에 가장 근접한 근사치를 제공합니다.</p>
<p>벤치마크 결과와 실제 성능 사이의 차이를 추측해서는 안 됩니다. 프로덕션 환경에 벡터 데이터베이스를 배포할 계획이라면 이상적인 실험실 테스트 이상의 성능을 이해하는 것이 좋습니다. VDBBench는 오픈 소스이며 투명하고 의미 있는 비교를 지원하도록 설계되었습니다.</p>
<p>생산 가치로 이어지지 않는 인상적인 수치에 흔들리지 마세요. <strong>VDBBench 1.0을 사용하여 실제 워크로드를 반영하는 조건에서 데이터로 비즈니스에 중요한 시나리오를 테스트하세요.</strong> 벡터 데이터베이스 평가에서 잘못된 벤치마크의 시대는 끝났습니다. 이제 프로덕션 관련 데이터를 기반으로 의사 결정을 내려야 할 때입니다.</p>
<p><strong>자체 워크로드로 VDBBench를 사용해</strong><a href="https://github.com/zilliztech/VectorDBBench"> 보세요: https://github.com/zilliztech/VectorDBBench</a></p>
<p><strong>주요 벡터 데이터베이스의 테스트 결과를 확인하세요:</strong><a href="https://zilliz.com/vdbbench-leaderboard?dataset=vectorSearch"> VDBBench 리더보드</a></p>
<p>질문이 있거나 결과를 공유하고 싶으신가요?<a href="https://github.com/zilliztech/VectorDBBench"> GitHub에서</a> 대화에 참여하거나<a href="https://discord.com/invite/FG6hMJStWu"> Discord에서</a> 커뮤니티와 소통하세요.</p>
