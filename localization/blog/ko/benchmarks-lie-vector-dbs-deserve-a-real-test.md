---
id: benchmarks-lie-vector-dbs-deserve-a-real-test.md
title: 벤치마크는 거짓말 - 실제 테스트가 필요한 벡터 DB
author: Min Tian
date: 2025-05-14T00:00:00.000Z
desc: >-
  VDBBench로 벡터 데이터베이스의 성능 격차를 발견하세요. 이 도구는 실제 프로덕션 시나리오에서 테스트하여 예기치 않은 다운타임 없이
  AI 애플리케이션이 원활하게 실행되도록 보장합니다.
cover: >-
  assets.zilliz.com/Benchmarks_Lie_Vector_D_Bs_Deserve_a_Real_Test_9280c66efc.png
tag: Engineering
recommend: true
publishToMedium: true
tags: 'Milvus, vector database, vector search, AI Agents, LLM'
meta_keywords: >-
  Vector database, vectordbbench, vector database benchmark, vector search
  performance
meta_title: |
  Benchmarks Lie — Vector DBs Deserve a Real Test
origin: 'https://milvus.io/blog/benchmarks-lie-vector-dbs-deserve-a-real-test.md'
---
<h2 id="The-Vector-Database-You-Chose-Based-on-Benchmarks-Might-Fail-in-Production" class="common-anchor-header">벤치마크를 기준으로 선택한 벡터 데이터베이스가 프로덕션 환경에서 실패할 수 있습니다.<button data-href="#The-Vector-Database-You-Chose-Based-on-Benchmarks-Might-Fail-in-Production" class="anchor-icon" translate="no">
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
    </button></h2><p>AI 애플리케이션을 위한 <a href="https://milvus.io/blog/what-is-a-vector-database.md">벡터 데이터베이스를</a> 선택할 때, 기존의 벤치마크는 빈 트랙에서 스포츠카를 시험 운전하다가 러시아워 교통 체증에 걸려 멈추는 것과 같습니다. 불편한 진실? 대부분의 벤치마크는 프로덕션 환경에는 존재하지 않는 인위적인 조건에서만 성능을 평가합니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Benchmarks_Lie_Vector_D_Bs_Deserve_a_Real_Test_9280c66efc.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>대부분의 벤치마크는 모든 데이터가 수집되고 인덱스가 완전히 구축된 <strong>후에</strong> 벡터 데이터베이스를 테스트합니다. 하지만 프로덕션 환경에서는 데이터의 흐름이 멈추지 않습니다. 인덱스를 재구축하기 위해 몇 시간 동안 시스템을 일시 중지할 수는 없습니다.</p>
<p>우리는 그 단절을 직접 목격했습니다. 예를 들어, Elasticsearch는 밀리초 수준의 쿼리 속도를 자랑하지만, 그 이면에서는 인덱스를 최적화하는 데만 <strong>20시간 이상이</strong> 걸리는 것을 보았습니다. 이는 특히 지속적인 업데이트와 즉각적인 응답이 요구되는 AI 워크로드에서 운영 시스템으로는 감당할 수 없는 다운타임입니다.</p>
<p>Milvus는 엔터프라이즈 고객과 함께 수많은 개념 증명(PoC) 평가를 수행한 결과, <strong>통제된 실험실 환경에서는 탁월한 성능을 발휘하는 벡터 데이터베이스가 실제 프로덕션 부하에서는 종종 어려움을</strong> 겪는다는 문제 패턴을 발견했습니다. 이 중요한 격차는 인프라 엔지니어를 좌절시킬 뿐만 아니라 이러한 잘못된 성능 약속에 기반한 전체 AI 이니셔티브를 무너뜨릴 수 있습니다.</p>
<p>이것이 바로 프로덕션 현실을 시뮬레이션하기 위해 처음부터 설계된 오픈 소스 벤치마크인 <a href="https://github.com/zilliztech/VectorDBBench">VDBBench를</a> 구축한 이유입니다. 시나리오를 골라내는 합성 테스트와 달리, VDBBench는 실제 프로덕션 워크로드와 마찬가지로 지속적인 수집, 엄격한 필터링 조건, 다양한 시나리오를 통해 데이터베이스를 푸시합니다. 엔지니어에게 실제 조건에서 벡터 데이터베이스가 실제로 어떻게 작동하는지 보여주는 도구를 제공하여 신뢰할 수 있는 수치를 기반으로 인프라 관련 의사 결정을 내릴 수 있도록 하는 것이 우리의 사명입니다.</p>
<h2 id="The-Gap-between-Benchmarks-and-Reality" class="common-anchor-header">벤치마크와 현실 사이의 격차<button data-href="#The-Gap-between-Benchmarks-and-Reality" class="anchor-icon" translate="no">
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
    </button></h2><p>기존의 벤치마킹 접근 방식은 세 가지 치명적인 결함으로 인해 그 결과가 생산 의사 결정에 실질적으로 무의미하게 됩니다:</p>
<h3 id="1-Outdated-Data" class="common-anchor-header">1. 오래된 데이터</h3><p>많은 벤치마크가 여전히 SIFT나<a href="https://zilliz.com/glossary/glove"> GloVe와</a> 같은 오래된 데이터 세트에 의존하고 있는데, 이는 오늘날의 AI 모델에서 생성되는 복잡한 고차원 벡터 임베딩과 거의 유사하지 않습니다. 이것을 생각해 보세요: SIFT는 128차원 벡터를 포함하지만, OpenAI의 임베딩 모델에서 널리 사용되는 임베딩은 768차원에서 3072차원까지 다양합니다.</p>
<h3 id="2-Vanity-Metrics" class="common-anchor-header">2. 허영 메트릭</h3><p>많은 벤치마크는 평균 지연 시간이나 최고 QPS에만 초점을 맞추기 때문에 왜곡된 그림을 만들어냅니다. 이러한 이상화된 지표는 실제 사용자가 프로덕션 환경에서 경험하는 이상값과 불일치를 포착하지 못합니다. 예를 들어, 조직을 파산시킬 정도로 무한한 컴퓨팅 리소스가 필요하다면 인상적인 QPS 수치가 무슨 소용이 있을까요?</p>
<h3 id="3-Oversimplified-Scenarios" class="common-anchor-header">3. 지나치게 단순화된 시나리오</h3><p>대부분의 벤치마크는 기본적이고 정적인 워크로드, 즉 벡터 검색의 '헬로 월드'만을 테스트합니다. 예를 들어, 전체 데이터 세트가 수집되고 색인된 후에만 검색 요청을 발행하여, 새로운 데이터가 유입되는 동안 사용자가 검색하는 동적인 현실을 무시합니다. 이러한 단순한 설계는 동시 쿼리, 필터링된 검색, 지속적인 데이터 수집과 같은 실제 프로덕션 시스템을 정의하는 복잡한 패턴을 간과합니다.</p>
<p>이러한 결함을 인식한 저희는 업계에 <strong>벤치마킹 철학의 근본적인 전환, 즉</strong>AI 시스템이 실제로 야생에서 작동하는 방식에 기반한 <strong>철학이</strong>필요하다는 것을 깨달았습니다. 이것이 바로 <a href="https://github.com/zilliztech/VectorDBBench">VDBBench를</a> 구축한 이유입니다.</p>
<h2 id="From-Lab-to-Production-How-VDBBench-Bridges-the-Gap" class="common-anchor-header">연구실에서 프로덕션까지: VDBBench가 격차를 해소하는 방법<button data-href="#From-Lab-to-Production-How-VDBBench-Bridges-the-Gap" class="anchor-icon" translate="no">
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
    </button></h2><p>벤치마크는 <strong>실제 프로덕션 동작을 예측할 수 있을 때만 가치가 있다는</strong> 신념을 바탕으로 한 가지 원칙을 바탕으로 개념을 재구축한 것이 바로 VDBBench입니다.</p>
<p>데이터 신뢰성, 워크로드 패턴, 성능 측정이라는 세 가지 중요한 차원에서 실제 조건을 충실히 재현하도록 VDBBench를 설계했습니다.</p>
<h3 id="Modernizing-the-Dataset" class="common-anchor-header">데이터 세트 현대화</h3><p>벡터DB 벤치마킹에 사용되는 데이터 세트를 완전히 개편했습니다. SIFT 및 GloVe와 같은 레거시 테스트 세트 대신 VDBBench는 오늘날의 AI 애플리케이션을 구동하는 최첨단 임베딩 모델에서 생성된 벡터를 사용합니다.</p>
<p>특히 검색 증강 생성(RAG)과 같은 사용 사례에 대한 관련성을 보장하기 위해 실제 기업 및 도메인별 시나리오를 반영하는 코퍼스를 선택했습니다. 여기에는 범용 지식베이스부터 생물의학 질문 답변 및 대규모 웹 검색과 같은 수직적 애플리케이션에 이르기까지 다양합니다.</p>
<table>
<thead>
<tr><th></th><th></th><th></th><th></th></tr>
</thead>
<tbody>
<tr><td><strong>코퍼스</strong></td><td><strong>임베딩 모델</strong></td><td><strong>차원</strong></td><td><strong>크기</strong></td></tr>
<tr><td>Wikipedia</td><td>Cohere V2</td><td>768</td><td>1M / 10M</td></tr>
<tr><td>BioASQ</td><td>Cohere V3</td><td>1024</td><td>1M / 10M</td></tr>
<tr><td>C4</td><td>OpenAI</td><td>1536</td><td>500K / 5M</td></tr>
<tr><td>MSMarco V2</td><td>udever-bloom-1b1</td><td>1536</td><td>1m / 10m / 138m</td></tr>
</tbody>
</table>
<p>표: 표: VDBBench에 사용된 데이터 세트</p>
<p>VDBBench는 사용자 지정 데이터 세트도 지원하므로 특정 워크로드에 대한 특정 임베딩 모델에서 생성된 자체 데이터로 벤치마킹할 수 있습니다. 결국, 자체 프로덕션 데이터보다 더 나은 데이터 세트는 없습니다.</p>
<h3 id="Production-Focused-Metric-Design" class="common-anchor-header">프로덕션 중심의 메트릭 설계</h3><p><strong>VDBBench는 실험실 결과뿐만 아니라 실제 성능을 반영하는 메트릭을 우선시합니다.</strong> 프로덕션 환경에서 실제로 중요한 사항인 부하 시 안정성, 지연 시간, 지속적인 처리량, 정확도 등을 중심으로 벤치마킹을 재설계했습니다.</p>
<ul>
<li><p><strong>실제 사용자 경험을 측정하기 위한 P95/P99 지연 시간</strong>: 평균/중앙값 지연 시간은 실제 사용자에게 불만을 주는 이상값을 가려줍니다. 그렇기 때문에 VDBBench는 P95/P99와 같은 테일 레이턴시에 집중하여 쿼리의 95% 또는 99%가 실제로 어떤 성능을 달성하는지를 보여줍니다.</p></li>
<li><p><strong>부하가 걸렸을 때 지속 가능한 처리량:</strong> 5초 동안 성능이 좋은 시스템이 프로덕션 환경에서는 그 성능을 발휘하지 못합니다. VDBBench는 점진적으로 동시성을 증가시켜 데이터베이스의 초당 최대 지속 가능한 쿼리 수(<code translate="no">max_qps</code>)를 찾습니다. 즉, 짧고 이상적인 조건에서 최고 수치가 아니라 최대 수치를 찾습니다. 이는 시간이 지남에 따라 시스템이 얼마나 잘 견디는지를 보여줍니다.</p></li>
<li><p><strong>성능과 균형 잡힌 리콜:</strong> 정확성 없는 속도는 의미가 없습니다. VDBBench의 모든 성능 수치는 리콜과 짝을 이루므로 처리량을 위해 얼마나 많은 관련성을 희생하고 있는지 정확히 알 수 있습니다. 이를 통해 내부 트레이드오프가 크게 다른 시스템 간에 공정한 비교를 할 수 있습니다.</p></li>
</ul>
<h3 id="Test-Methodology-That-Reflects-Reality" class="common-anchor-header">현실을 반영하는 테스트 방법론</h3><p>VDBBench 설계의 핵심 혁신은 <strong>직렬 테스트와 동시 테스트를 분리하여</strong> 다양한 유형의 부하에서 시스템이 어떻게 작동하는지 파악하는 데 도움이 된다는 점입니다. 예를 들어 지연 시간 메트릭은 다음과 같이 나뉩니다:</p>
<ul>
<li><p><code translate="no">serial_latency_p99</code> 한 번에 하나의 요청만 처리되는 최소 부하 상태에서 시스템 성능을 측정합니다. 이는 지연 시간에 대한 <em>최상의 시나리오를</em> 나타냅니다.</p></li>
<li><p><code translate="no">conc_latency_p99</code> 는 여러 요청이 동시에 도착하는 <em>현실적이고 동시성이 높은 조건에서</em> 시스템 동작을 포착합니다.</p></li>
</ul>
<h3 id="Two-Benchmark-Phases" class="common-anchor-header">두 가지 벤치마크 단계</h3><p>VDBBench는 테스트를 두 가지 중요한 단계로 구분합니다:</p>
<ol>
<li><strong>연속 테스트</strong></li>
</ol>
<p>이것은 1,000개의 쿼리를 단일 프로세스로 실행하는 것입니다. 이 단계에서는 이상적인 성능과 정확도에 대한 기준선을 설정하여 <code translate="no">serial_latency_p99</code> 및 리콜을 모두 보고합니다.</p>
<ol start="2">
<li><strong>동시성 테스트</strong></li>
</ol>
<p>이 단계에서는 지속적인 부하가 걸리는 프로덕션 환경을 시뮬레이션합니다.</p>
<ul>
<li><p><strong>현실적인 클라이언트 시뮬레이션</strong>: 각 테스트 프로세스는 자체 연결 및 쿼리 집합을 사용하여 독립적으로 작동합니다. 이렇게 하면 결과를 왜곡할 수 있는 공유 상태(예: 캐시) 간섭을 방지할 수 있습니다.</p></li>
<li><p><strong>동기화된 시작</strong>: 모든 프로세스가 동시에 시작되므로 측정된 QPS가 청구된 동시성 수준을 정확하게 반영합니다.</p></li>
</ul>
<p>이러한 세심하게 구조화된 방법은 VDBBench가 보고하는 <code translate="no">max_qps</code> 및 <code translate="no">conc_latency_p99</code> 값이 <strong>정확하고 생산과 관련이</strong> 있음을 보장하여 생산 용량 계획 및 시스템 설계에 의미 있는 인사이트를 제공합니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_QPS_and_Latency_of_Milvus_16c64g_standalone_at_Varying_Concurrency_Levels_Cohere_1_M_Test_7f2294e87a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>그림: 다양한 동시성 수준에서 Milvus-16c64g-독립형의 QPS 및 지연 시간(Cohere 1M 테스트). 이 테스트에서 Milvus는 처음에</em> <strong><em>동시성 수준 20까지</em></strong><em>활용도가 낮았으며</em><em>, 동시성을 높이면 시스템 활용도가 향상되고 QPS가 높아집니다.</em><em> 동시성</em> <strong><em>20을</em></strong><em> 넘어</em><em> 시스템이 최대 부하에 도달하면 동시성을 더 이상 증가시켜도 처리량이 개선되지 않고 대기열 지연으로 인해 지연 시간이 증가합니다.</em></p>
<h2 id="Beyond-Searching-Static-Data-The-Real-Production-Scenarios" class="common-anchor-header">정적 데이터 검색 그 이상: 실제 프로덕션 시나리오<button data-href="#Beyond-Searching-Static-Data-The-Real-Production-Scenarios" class="anchor-icon" translate="no">
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
    </button></h2><p>저희가 아는 한, 정적 수집, 필터링, 스트리밍 사례 등 프로덕션 크리티컬 시나리오의 전체 스펙트럼에서 벡터 데이터베이스를 테스트하는 벤치마크 도구는 VDBBench가 유일합니다.</p>
<h3 id="Static-Collection" class="common-anchor-header">정적 수집</h3><p>테스트에 돌입하는 다른 벤치마크와 달리, VDBBench는 먼저 각 데이터베이스가 인덱스를 완전히 최적화했는지 확인하는데, 이는 많은 벤치마크가 종종 간과하는 중요한 프로덕션 전제 조건입니다. 이를 통해 전체 상황을 파악할 수 있습니다:</p>
<ul>
<li><p>데이터 수집 시간</p></li>
<li><p>인덱싱 시간(검색 성능에 큰 영향을 미치는 최적화된 인덱스를 구축하는 데 사용되는 시간)</p></li>
<li><p>직렬 및 동시 조건 모두에서 완전히 최적화된 인덱스의 검색 성능</p></li>
</ul>
<h3 id="Filtering" class="common-anchor-header">필터링</h3><p>프로덕션 환경에서 벡터 검색은 거의 단독으로 수행되지 않습니다. 실제 애플리케이션에서는 벡터 유사성과 메타데이터 필터링을 결합합니다("이 사진과 비슷하지만 가격이 100달러 미만인 신발 찾기"). 이러한 필터링된 벡터 검색은 고유한 문제를 야기합니다:</p>
<ul>
<li><p><strong>필터 복잡성</strong>: 더 많은 스칼라 열과 논리 조건으로 인해 계산 요구가 증가합니다.</p></li>
<li><p><strong>필터 선택성</strong>: 숨겨진 성능 킬러인 쿼리 속도는 필터의 선택성에 따라 큰 폭으로 변동될 수 있다는 것이 <a href="https://milvus.io/blog/how-to-filter-efficiently-without-killing-recall.md">우리의 프로덕션 경험을</a> 통해 밝혀졌습니다.</p></li>
</ul>
<p>VDBBench는 다양한 선택성 수준(50%~99.9%)에서 필터 성능을 체계적으로 평가하여 데이터베이스가 이 중요한 생산 패턴을 처리하는 방식에 대한 포괄적인 프로필을 제공합니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_QPS_and_Recall_of_Milvus_and_Open_Search_Across_Different_Filter_Selectivity_Levels_Cohere_1_M_Test_4b5df2244d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>그림: 다양한 필터 선택도 수준에 따른 Milvus 및 OpenSearch의 QPS 및 리콜(Cohere 1M 테스트). X축은 필터링된 데이터의 비율을 나타냅니다. 그림에서 볼 수 있듯이 Milvus는 모든 필터 선택도 수준에서 일관되게 높은 회수율을 유지하는 반면, OpenSearch는 다양한 필터링 조건에서 회수율이 크게 변동하는 불안정한 성능을 보였습니다.</em></p>
<h3 id="Streaming" class="common-anchor-header">스트리밍</h3><p>프로덕션 시스템에서는 정적 데이터의 사치를 누릴 수 있는 경우가 거의 없습니다. 검색이 실행되는 동안 새로운 정보가 지속적으로 유입되기 때문에, 아무리 뛰어난 데이터베이스도 무너지는 경우가 많습니다.</p>
<p>VDBBench의 고유한 스트리밍 테스트 사례는 삽입 중 검색 성능을 검사하여 측정합니다:</p>
<ol>
<li><p><strong>데이터 볼륨 증가의 영향</strong>: 데이터 크기가 증가함에 따라 검색 성능이 어떻게 확장되는지.</p></li>
<li><p>쓰기<strong>부하의 영향</strong>: 동시 쓰기가 시스템의 CPU 또는 메모리 리소스를 소모하므로 동시 쓰기가 검색 지연 시간 및 처리량에 미치는 영향.</p></li>
</ol>
<p>스트리밍 시나리오는 모든 벡터 데이터베이스에 대한 포괄적인 스트레스 테스트를 나타냅니다. 하지만 이를 위한 <em>공정한</em> 벤치마크를 구축하는 것은 쉬운 일이 아닙니다. 하나의 시스템이 어떻게 작동하는지 설명하는 것만으로는 충분하지 않으며, 여러 데이터베이스에 걸쳐 <strong>사과 대 사과를 비교할</strong> 수 있는 일관된 평가 모델이 필요합니다.</p>
<p>실제 배포를 통해 기업을 지원한 경험을 바탕으로 구조화되고 반복 가능한 접근 방식을 구축했습니다. VDBBench로:</p>
<ul>
<li><p>목표 프로덕션 워크로드를 반영하는 <strong>고정 삽입 속도를 정의합니다</strong>.</p></li>
<li><p>그런 다음 VDBBench는 모든 시스템에 <strong>동일한 부하 압력을</strong> 적용하여 성능 결과를 직접 비교할 수 있도록 합니다.</p></li>
</ul>
<p>예를 들어, Cohere 10M 데이터 세트와 초당 500행 수집 목표가 있다고 가정해 보겠습니다:</p>
<ul>
<li><p>VDBBench는 5개의 병렬 생산자 프로세스를 가동하여 각각 초당 100개의 행을 삽입합니다.</p></li>
<li><p>데이터의 10%가 수집될 때마다 VDBBench는 직렬 및 동시 조건 모두에서 검색 테스트 라운드를 트리거합니다.</p></li>
<li><p>지연 시간, QPS, 리콜과 같은 메트릭은 각 단계가 끝난 후 기록됩니다.</p></li>
</ul>
<p>이 통제된 방법론은 시간이 지남에 따라 실제 운영 스트레스 상황에서 각 시스템의 성능이 어떻게 변화하는지를 보여줌으로써 확장 가능한 인프라 결정을 내리는 데 필요한 인사이트를 제공합니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/igure_QPS_and_Recall_of_Pinecone_vs_Elasticsearch_in_the_Cohere_10_M_Streaming_Test_500_rows_s_Ingestion_Rate_548fc02f24.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>그림: Cohere 10M 스트리밍 테스트(500행/초 수집 속도)에서 Pinecone과 Elasticsearch의 QPS 및 리콜 비교. Pinecone은 데이터를 100% 삽입한 후에도 더 높은 QPS와 리콜을 유지하며 상당한 QPS 개선을 보였습니다.</em></p>
<p>하지만 이것이 이야기의 끝이 아닙니다. VDBBench는 옵션으로 최적화 단계를 지원하여 사용자가 인덱스 최적화 전후의 스트리밍 검색 성능을 비교할 수 있도록 함으로써 한 걸음 더 나아갑니다. 또한 각 단계에서 소요된 실제 시간을 추적하고 보고하여 실제 운영 환경과 유사한 조건에서 시스템 효율성과 동작에 대한 보다 심층적인 인사이트를 제공합니다.</p>
<p><span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_QPS_and_Recall_of_Pinecone_vs_Elasticsearch_in_the_Cohere_10_M_Streaming_Test_After_Optimization_500_rows_s_Ingestion_Rate_d249d290bb.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>그림: 최적화 후 Cohere 10M 스트리밍 테스트(500행/s 수집 속도)에서 Pinecone과 Elasticsearch의 QPS 및 리콜 비교(500행/s 수집 속도)</em></p>
<p>다이어그램에서 볼 수 있듯이, 인덱스 최적화 후의 QPS에서 ElasticSearch가 Pinecone을 능가했습니다. 기적인가요? 그렇지 않습니다. 오른쪽 차트를 보면 전체 이야기를 알 수 있습니다. x축이 실제 경과 시간을 반영하고 있는 것을 보면 ElasticSearch가 해당 성능에 도달하는 데 훨씬 더 오래 걸렸다는 것을 알 수 있습니다. 그리고 프로덕션 환경에서는 이러한 지연이 중요합니다. 이 비교는 최대 처리량과 서비스 시간이라는 중요한 절충점을 보여줍니다.</p>
<h2 id="Choose-Your-Vector-Database-with-Confidence" class="common-anchor-header">확신을 가지고 벡터 데이터베이스 선택<button data-href="#Choose-Your-Vector-Database-with-Confidence" class="anchor-icon" translate="no">
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
    </button></h2><p>벤치마크 결과와 실제 성능 사이의 차이를 추측으로만 판단해서는 안 됩니다. VDBBench는 지속적인 데이터 수집, 메타데이터 필터링, 스트리밍 워크로드 등 실제 운영 환경과 유사한 조건에서 벡터 데이터베이스를 평가할 수 있는 방법을 제공합니다.</p>
<p>프로덕션 환경에 벡터 데이터베이스를 배포할 계획이라면 이상적인 실험실 테스트 이상의 성능을 이해하는 것이 좋습니다. VDBBench는 오픈 소스이며 투명하고 의미 있는 비교를 지원하도록 설계되었습니다.</p>
<p>지금 바로 자체 워크로드로 VDBBench를 사용해 보고 다양한 시스템이 실제로 어떻게 작동하는지 확인해 보세요 <a href="https://github.com/zilliztech/VectorDBBench">(https://github.com/zilliztech/VectorDBBench).</a></p>
<p>질문이 있거나 결과를 공유하고 싶으신가요?<a href="https://github.com/zilliztech/VectorDBBench"> GitHub에서</a> 대화에 참여하거나 <a href="https://discord.com/invite/FG6hMJStWu">Discord에서</a> 커뮤니티와 소통하세요. 여러분의 의견을 듣고 싶습니다.</p>
