---
id: >-
  how-to-cut-vector-database-costs-by-up-to-80-a-practical-milvus-optimization-guide.md
title: '벡터 데이터베이스 비용을 최대 80%까지 절감하는 방법: 실용적인 Milvus 최적화 가이드'
author: Jack Li
date: 2026-3-20
cover: assets.zilliz.com/cover_reduce_vdb_cost_by_80_56ed2fe3ae.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  Milvus cost optimization, vector database cost reduction, RAG cost
  optimization, HNSW vs IVF_SQ8, vector search cost
meta_title: |
  Milvus Cost Optimization Guide: Cut Vector Database Costs by Up to 80%
desc: >-
  Milvus는 무료이지만 인프라는 무료가 아닙니다. 더 나은 인덱스, MMap, 계층형 스토리지로 벡터 데이터베이스 메모리 비용을
  60~80%까지 절감하는 방법을 알아보세요.
origin: >-
  https://milvus.io/blog/how-to-cut-vector-database-costs-by-up-to-80-a-practical-milvus-optimization-guide.md
---
<p>RAG 프로토타입은 훌륭하게 작동했습니다. 그 후 프로덕션 버전으로 전환하고 트래픽이 증가하면서 벡터 데이터베이스 요금이 한 달에 500달러에서 5,000달러로 증가했습니다. 익숙한 이야기인가요?</p>
<p>이는 현재 AI 애플리케이션에서 가장 흔하게 발생하는 확장 문제 중 하나입니다. 실질적인 가치를 창출하는 무언가를 구축했지만 인프라 비용이 사용자 기반이 늘어나는 속도보다 더 빠르게 증가하고 있는 것입니다. 그리고 청구서를 보면 벡터 데이터베이스가 가장 놀라운 경우가 많습니다. 지금까지 살펴본 배포 사례에서 벡터 데이터베이스는 전체 애플리케이션 비용의 약 40~50%를 차지하며 LLM API 호출에 이어 두 번째로 큰 비중을 차지할 수 있습니다.</p>
<p>이 가이드에서는 실제로 비용이 어디로 가는지, 그리고 대부분의 경우 60~80%까지 비용을 낮추기 위해 할 수 있는 구체적인 방법을 안내해 드리겠습니다. 가장 널리 사용되는 오픈 소스 벡터 데이터베이스인 <a href="https://milvus.io/">Milvus를</a> 주요 예로 사용하지만, 제가 가장 잘 알고 있는 것이기 때문에 대부분의 벡터 데이터베이스에 원칙이 적용됩니다.</p>
<p><em>분명히 말씀드리자면,</em> <em><a href="https://milvus.io/">Milvus</a></em> <em>자체는 무료 오픈 소스이며 소프트웨어에 대한 비용을 지불하지 않습니다. 비용은 전적으로 클라우드 인스턴스, 메모리, 스토리지, 네트워크 등 소프트웨어를 실행하는 인프라에서 발생합니다. 좋은 소식은 이러한 인프라 비용의 대부분을 절감할 수 있다는 것입니다.</em></p>
<h2 id="Where-Does-the-Money-Actually-Go-When-Using-a-VectorDB" class="common-anchor-header">VectorDB를 사용할 때 실제로 비용은 어디에 사용되나요?<button data-href="#Where-Does-the-Money-Actually-Go-When-Using-a-VectorDB" class="anchor-icon" translate="no">
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
    </button></h2><p>구체적인 예부터 살펴보겠습니다. 1억 개의 벡터, 768개의 차원이 float32로 저장되어 있다고 가정해 보겠습니다. AWS에서 월별 대략적인 비용은 다음과 같습니다:</p>
<table>
<thead>
<tr><th><strong>비용 구성 요소</strong></th><th><strong>공유</strong></th><th><strong>~월별 비용</strong></th><th><strong>참고</strong></th></tr>
</thead>
<tbody>
<tr><td>컴퓨팅(CPU + 메모리)</td><td>85-90%</td><td>$2,800</td><td>대부분 메모리에 의해 구동되는 큰 비용</td></tr>
<tr><td>네트워크</td><td>5-10%</td><td>$250</td><td>AZ 간 트래픽, 대규모 결과 페이로드</td></tr>
<tr><td>스토리지</td><td>2-5%</td><td>$100</td><td>저렴한 - 오브젝트 스토리지(S3/MinIO)는 ~$0.03/GB입니다.</td></tr>
</tbody>
</table>
<p>결론은 간단합니다. 비용의 85~90%가 메모리에 사용된다는 것입니다. 네트워크와 스토리지는 마진에서 중요하지만 비용을 의미 있게 절감하려면 메모리가 지렛대입니다. 이 가이드의 모든 내용은 메모리에 초점을 맞추고 있습니다.</p>
<p><strong>네트워크 및 스토리지에 대한 간단한 참고 사항:</strong> 필요한 필드(ID, 점수, 주요 메타데이터)만 반환하고 지역 간 쿼리를 피하면 네트워크 비용을 절감할 수 있습니다. 스토리지의 경우, Milvus는 이미 스토리지와 컴퓨팅을 분리하고 있습니다. 벡터는 S3와 같은 저렴한 객체 스토리지에 저장되므로 1억 개의 벡터를 사용하더라도 일반적으로 월 50달러 미만의 스토리지가 필요합니다. 이 두 가지 방법 중 어느 것도 메모리 최적화처럼 큰 영향을 미치지는 않습니다.</p>
<h2 id="Why-Memory-Is-So-Expensive-for-Vector-Search" class="common-anchor-header">벡터 검색에 메모리가 비싼 이유<button data-href="#Why-Memory-Is-So-Expensive-for-Vector-Search" class="anchor-icon" translate="no">
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
    </button></h2><p>기존 데이터베이스를 사용하는 경우, 벡터 검색에 필요한 메모리 요구 사항이 놀라울 수 있습니다. 관계형 데이터베이스는 디스크 기반 B-트리 인덱스와 OS 페이지 캐시를 활용할 수 있습니다. 벡터 검색은 이와는 달리 대규모 부동소수점 계산을 포함하며, 밀리초 수준의 지연 시간을 제공하기 위해 HNSW 또는 IVF와 같은 인덱스는 메모리에 계속 로드된 상태로 유지되어야 합니다.</p>
<p>다음은 메모리 필요량을 추정하는 간단한 공식입니다:</p>
<p><strong>필요한 메모리 = (벡터 × 차원 × 4바이트) × 인덱스 승수</strong></p>
<p>HNSW를 사용하는 100M × 768 × float32 예시(승수 ~1.8배)의 경우:</p>
<ul>
<li>원시 데이터: 100M × 768 × 4바이트 ≈ 307GB</li>
<li>HNSW 인덱스 사용: 307GB × 1.8 ≈ 553GB</li>
<li>OS 오버헤드, 캐시 및 헤드룸 포함: 총 ~768GB</li>
<li>AWS에서: 3× r6i.8xlarge(각 256GB) ≈ $2,800/월</li>
</ul>
<p><strong>이것이 기준선입니다. 이제 이를 낮추는 방법을 살펴보겠습니다.</strong></p>
<h2 id="1-Pick-the-Right-Index-to-Get-4x-Less-Memory-Usage" class="common-anchor-header">1. 올바른 인덱스를 선택하여 메모리 사용량 4배 줄이기<button data-href="#1-Pick-the-Right-Index-to-Get-4x-Less-Memory-Usage" class="anchor-icon" translate="no">
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
    </button></h2><p>이것은 가장 큰 영향을 미칠 수 있는 단일 변경 사항입니다. 동일한 100M 벡터 데이터 세트의 경우, 인덱스 선택에 따라 메모리 사용량이 4~6배까지 달라질 수 있습니다.</p>
<ul>
<li><strong>FLAT / IVF_FLAT</strong>: 압축이 거의 없으므로 메모리 사용량이 원시 데이터 크기인 약 <strong>300GB에</strong> 가깝게 유지됩니다.</li>
<li><strong>HNSW</strong>: 추가 그래프 구조를 저장하므로 메모리 사용량은 일반적으로 원시 데이터 크기의 <strong>1.5배~2.0배</strong>, 즉 약 <strong>450~600GB입니다</strong>.</li>
<li><strong>IVF_SQ8</strong>: float32 값을 uint8로 압축하여 약 <strong>4배 압축하므로</strong> 메모리 사용량이 약 <strong>75~100GB로</strong> 떨어질 수 있습니다.</li>
<li><strong>IVF_PQ / DiskANN</strong>: 더 강력한 압축 또는 디스크 기반 인덱스를 사용하므로 메모리가 약 <strong>30~60GB로</strong> 더 감소할 수 있습니다.</li>
</ul>
<p>많은 팀들이 쿼리 속도가 가장 빠르다는 이유로 HNSW로 시작하지만, 결국 필요 이상의 3~5배의 비용을 지불하게 됩니다.</p>
<p>다음은 주요 인덱스 유형을 비교하는 방법입니다:</p>
<table>
<thead>
<tr><th><strong>인덱스</strong></th><th><strong>메모리 승수</strong></th><th><strong>쿼리 속도</strong></th><th><strong>리콜</strong></th><th><strong>최적 대상</strong></th></tr>
</thead>
<tbody>
<tr><td>FLAT</td><td>~1.0x</td><td>느림</td><td>100%</td><td>소규모 데이터 세트(1M 미만), 테스트 중</td></tr>
<tr><td>IVF_FLAT</td><td>~1.05x</td><td>중간</td><td>95-99%</td><td>일반 사용</td></tr>
<tr><td>IVF_SQ8</td><td>~0.30x</td><td>중간</td><td>93-97%</td><td>비용에 민감한 생산(권장)</td></tr>
<tr><td>IVF_PQ</td><td>~0.12x</td><td>빠른</td><td>70-80%</td><td>매우 큰 데이터 세트, 거친 검색</td></tr>
<tr><td>HNSW</td><td>~1.8x</td><td>매우 빠름</td><td>98-99%</td><td>지연 시간이 비용보다 더 중요한 경우에만</td></tr>
<tr><td>DiskANN</td><td>~0.08x</td><td>중간</td><td>95-98%</td><td>NVMe SSD를 사용하는 매우 큰 규모</td></tr>
</tbody>
</table>
<p><strong>결론:</strong> HNSW 또는 IVF_FLAT에서 IVF_SQ8로 전환하면 일반적으로 리콜률이 2~3%(예: 97%에서 94~95%) 정도만 떨어지고 메모리 비용은 약 70% 절감됩니다. 대부분의 RAG 워크로드에서 이러한 절충안은 그만한 가치가 있습니다. 거친 검색을 수행하거나 정확도 기준이 더 낮은 경우, IVF_PQ 또는 IVF_RABITQ를 사용하면 비용 절감 효과를 더욱 높일 수 있습니다.</p>
<p><strong>제 추천입니다:</strong> 프로덕션 환경에서 HNSW를 실행 중이고 비용이 걱정된다면, 먼저 테스트 컬렉션에서 IVF_SQ8을 사용해 보세요. 실제 쿼리에서 리콜을 측정하세요. 대부분의 팀은 정확도 저하가 얼마나 작은지 보고 놀랄 것입니다.</p>
<h2 id="2-Stop-Loading-Everything-into-Memory-for-60-80-Cost-Reduction" class="common-anchor-header">2. 60%~80%의 비용 절감을 위해 모든 것을 메모리에 로드하지 않기<button data-href="#2-Stop-Loading-Everything-into-Memory-for-60-80-Cost-Reduction" class="anchor-icon" translate="no">
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
    </button></h2><p>더 효율적인 인덱스를 선택한 후에도 여전히 메모리에 필요 이상으로 많은 데이터가 있을 수 있습니다. Milvus는 이 문제를 해결하는 두 가지 방법을 제공합니다: <strong>MMap(2.3부터 사용 가능)과 계층형 스토리지(2.6부터 사용 가능)입니다. 두 가지 방법 모두 메모리 사용량을 60~80%까지 줄일 수 있습니다.</strong></p>
<p>두 가지 방법의 핵심 아이디어는 동일합니다. 모든 데이터가 항상 메모리에 저장될 필요는 없다는 것입니다. 차이점은 메모리에 없는 데이터를 처리하는 방식입니다.</p>
<h3 id="MMap-Memory-Mapped-Files" class="common-anchor-header">MMap(메모리 매핑 파일)</h3><p>MMap은 데이터 파일을 로컬 디스크에서 프로세스 주소 공간으로 매핑합니다. 전체 데이터 세트는 노드의 로컬 디스크에 남아 있으며, OS는 액세스할 때만 온디맨드 방식으로 페이지를 메모리에 로드합니다. MMap을 사용하기 전에는 모든 데이터가 객체 저장소(S3/MinIO)에서 쿼리 노드의 로컬 디스크로 다운로드됩니다.</p>
<ul>
<li>메모리 사용량이 최대 부하 모드의 ~10~30% 수준으로 감소합니다.</li>
<li>지연 시간이 안정적이고 예측 가능한 상태로 유지됨(데이터가 로컬 디스크에 있고 네트워크 가져오기가 없음)</li>
<li>단점: 로컬 디스크는 전체 데이터 세트를 저장할 수 있을 만큼 충분히 커야 함</li>
</ul>
<h3 id="Tiered-Storage" class="common-anchor-header">계층형 스토리지</h3><p>계층형 스토리지는 한 단계 더 나아갑니다. 모든 것을 로컬 디스크에 다운로드하는 대신 로컬 디스크를 핫 데이터의 캐시로 사용하고 오브젝트 스토리지를 기본 계층으로 유지합니다. 데이터는 필요할 때만 오브젝트 스토리지에서 가져옵니다.</p>
<ul>
<li>메모리 사용량이 최대 부하 모드의 10% 미만으로 감소합니다.</li>
<li>로컬 디스크 사용량도 감소 - 핫 데이터만 캐시됨(일반적으로 전체의 10~30%)</li>
<li>단점: 캐시 누락으로 인해 지연 시간이 50~200밀리초 추가됨(오브젝트 스토리지에서 가져오기)</li>
</ul>
<h3 id="Data-flow-and-resource-usage" class="common-anchor-header">데이터 흐름 및 리소스 사용량</h3><table>
<thead>
<tr><th><strong>모드</strong></th><th><strong>데이터 흐름</strong></th><th><strong>메모리 사용량</strong></th><th><strong>로컬 디스크 사용량</strong></th><th><strong>지연 시간</strong></th></tr>
</thead>
<tbody>
<tr><td>기존 최대 부하</td><td>오브젝트 스토리지 → 메모리(100%)</td><td>매우 높음(100%)</td><td>낮음(일시적으로만)</td><td>매우 낮음 및 안정적</td></tr>
<tr><td>MMap</td><td>오브젝트 스토리지 → 로컬 디스크(100%) → 메모리(온디맨드)</td><td>낮음(10~30%)</td><td>높음(100%)</td><td>낮고 안정적</td></tr>
<tr><td>계층형 스토리지</td><td>오브젝트 스토리지 ↔ 로컬 캐시(핫 데이터) → 메모리(온디맨드)</td><td>매우 낮음(&lt;10%)</td><td>낮음(핫 데이터만)</td><td>캐시 히트 시 낮음, 캐시 미스 시 높음</td></tr>
</tbody>
</table>
<p><strong>하드웨어 권장 사항:</strong> 두 방법 모두 로컬 디스크 I/O에 크게 의존하므로 <strong>IOPS가 10,000 이상인</strong> <strong>NVMe SSD를</strong> 강력히 권장합니다.</p>
<h3 id="MMap-vs-Tiered-Storage-Which-One-Should-You-Use" class="common-anchor-header">MMap 대 계층형 스토리지: 어떤 것을 사용해야 할까요?</h3><table>
<thead>
<tr><th><strong>사용자의 상황</strong></th><th><strong>이 사용</strong></th><th><strong>사용 이유</strong></th></tr>
</thead>
<tbody>
<tr><td>지연 시간에 민감함(P99 &lt;20ms)</td><td>MMap</td><td>데이터가 이미 로컬 디스크에 있음 - 네트워크 가져오기 없음, 지연 시간 안정적</td></tr>
<tr><td>균일한 액세스(명확한 핫/콜드 분할 없음)</td><td>MMap</td><td>계층형 스토리지가 효과적이려면 핫/콜드 스큐가 필요하며, 이 기능이 없으면 캐시 적중률이 낮습니다.</td></tr>
<tr><td>비용이 우선순위(가끔 지연 시간이 급증해도 괜찮음)</td><td>계층형 스토리지</td><td>메모리와 로컬 디스크 모두 절약(디스크 70~90% 절감)</td></tr>
<tr><td>명확한 핫/콜드 패턴(80/20 규칙)</td><td>계층형 스토리지</td><td>핫 데이터는 캐시, 콜드 데이터는 오브젝트 스토리지에서 저렴하게 유지</td></tr>
<tr><td>매우 큰 규모(5억 개 이상의 벡터)</td><td>계층형 스토리지</td><td>하나의 노드의 로컬 디스크는 이 정도 규모의 전체 데이터 세트를 저장할 수 없는 경우가 많습니다.</td></tr>
</tbody>
</table>
<p><strong>참고:</strong> MMap에는 Milvus 2.3 이상이 필요합니다. 계층형 스토리지에는 Milvus 2.6 이상이 필요합니다. 두 가지 모두 NVMe SSD에서 가장 잘 작동합니다(10,000+ IOPS 권장).</p>
<h3 id="How-to-Configure-MMap" class="common-anchor-header">MMap을 구성하는 방법</h3><p><strong>옵션 1: YAML 구성(신규 배포에 권장)</strong></p>
<p>Milvus 구성 파일 milvus.yaml을 편집하고 쿼리 노드 섹션 아래에 다음 설정을 추가합니다:</p>
<pre><code translate="no">queryNode:
  mmap:
    vectorField: <span class="hljs-literal">true</span>      <span class="hljs-comment"># vector data</span>
    vectorIndex: <span class="hljs-literal">true</span>      <span class="hljs-comment"># vector index (largest source of savings!)</span>
    scalarField: <span class="hljs-literal">true</span>      <span class="hljs-comment"># scalar data (recommended for RAG workloads)</span>
    scalarIndex: <span class="hljs-literal">true</span>      <span class="hljs-comment"># scalar index</span>
    growingMmapEnabled: <span class="hljs-literal">false</span>  <span class="hljs-comment"># incremental data stays in memory</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>옵션 2: Python SDK 구성(기존 컬렉션의 경우)</strong></p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient

client = MilvusClient(uri=<span class="hljs-string">&quot;http://localhost:19530&quot;</span>)

<span class="hljs-comment"># You must release the collection before changing the mmap setting</span>
client.release_collection(<span class="hljs-string">&quot;my_collection&quot;</span>)

<span class="hljs-comment"># Enable MMap</span>
client.alter_collection_properties(
    collection_name=<span class="hljs-string">&quot;my_collection&quot;</span>,
    properties={<span class="hljs-string">&quot;mmap.enabled&quot;</span>: <span class="hljs-literal">True</span>}
)

<span class="hljs-comment"># Load the collection again to apply the MMap setting</span>
client.load_collection(<span class="hljs-string">&quot;my_collection&quot;</span>)

<span class="hljs-comment"># Verify that the setting has taken effect</span>
<span class="hljs-built_in">print</span>(client.describe_collection(<span class="hljs-string">&quot;my_collection&quot;</span>)[<span class="hljs-string">&quot;properties&quot;</span>])
<span class="hljs-comment"># Output: {&#x27;mmap.enabled&#x27;: &#x27;True&#x27;}</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="How-to-Configure-Tiered-Storage-Milvus-26+" class="common-anchor-header">계층형 스토리지 구성 방법(Milvus 2.6 이상)</h3><p>Milvus 구성 파일 milvus.yaml을 편집하고 queryNode 섹션 아래에 다음 설정을 추가합니다:</p>
<pre><code translate="no">queryNode:
  segcore:
    tieredStorage:
      warmup:                                                                                                                                                      
          <span class="hljs-comment"># Options: sync, async, disable                      </span>
          <span class="hljs-comment"># Specifies when tiered storage cache warm-up happens.                                                                                                                             </span>
          <span class="hljs-comment"># - &quot;sync&quot;: data is loaded into the cache before the segment is considered fully loaded.                                                                                    </span>
          <span class="hljs-comment"># - &quot;disable&quot;: data is not proactively loaded into the cache, and is loaded only when needed by Search/Query tasks.                                                                            </span>
          <span class="hljs-comment"># The default is &quot;sync&quot;, but vector fields default to &quot;disable&quot;.                                                                                                            </span>
          scalarField: sync                                                                                                                                          
          scalarIndex: sync                                                                                                                                          
          vectorField: disable <span class="hljs-comment"># Cache warm-up for raw vector field data is disabled by default.</span>
          vectorIndex: sync
      memoryHighWatermarkRatio: <span class="hljs-number">0.85</span>   <span class="hljs-comment"># Start eviction when memory usage exceeds 85%</span>
      memoryLowWatermarkRatio: <span class="hljs-number">0.70</span>    <span class="hljs-comment"># Stop eviction when memory usage drops to 70%</span>
      diskHighWatermarkRatio: <span class="hljs-number">0.80</span>     <span class="hljs-comment"># High watermark for disk eviction</span>
      diskLowWatermarkRatio: <span class="hljs-number">0.75</span>      <span class="hljs-comment"># Low watermark for disk eviction</span>
      evictionEnabled: true            <span class="hljs-comment"># Must be enabled!</span>
      backgroundEvictionEnabled: true  <span class="hljs-comment"># Background eviction thread</span>
      cacheTtl: <span class="hljs-number">3600</span>                   <span class="hljs-comment"># Automatically evict if not accessed for 1 hour</span>
<button class="copy-code-btn"></button></code></pre>
<h2 id="Use-Lower-Dimensional-Embeddings" class="common-anchor-header">저차원 임베딩 사용<button data-href="#Use-Lower-Dimensional-Embeddings" class="anchor-icon" translate="no">
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
    </button></h2><p>이 설정은 간과하기 쉽지만 차원에 따라 비용이 직접적으로 확장됩니다. 메모리, 스토리지, 컴퓨팅은 모두 차원 수에 따라 선형적으로 증가합니다. 1536 차원 모델은 동일한 데이터에 대해 384 차원 모델보다 인프라 비용이 약 4배 더 듭니다.</p>
<p>쿼리 비용도 같은 방식으로 확장됩니다. 코사인 유사성은 O(D)이므로 768차원 벡터는 쿼리당 384차원 벡터의 약 2배의 연산이 소요됩니다. 높은 QPS 워크로드에서는 이러한 차이가 필요한 노드 수 감소로 직결됩니다.</p>
<p>다음은 일반적인 임베딩 모델을 비교한 것입니다(384-dim을 1.0x 기준선으로 사용):</p>
<table>
<thead>
<tr><th><strong>모델</strong></th><th><strong>차원</strong></th><th><strong>상대적 비용</strong></th><th><strong>리콜</strong></th><th><strong>최적 대상</strong></th></tr>
</thead>
<tbody>
<tr><td>텍스트 임베딩-3-대형</td><td>3072</td><td>8.0x</td><td>98%+</td><td>정확도가 타협할 수 없는 경우(연구, 의료)</td></tr>
<tr><td>텍스트 임베딩-3-소형</td><td>1536</td><td>4.0x</td><td>95-97%</td><td>일반 RAG 워크로드</td></tr>
<tr><td>DistilBERT</td><td>768</td><td>2.0x</td><td>92-95%</td><td>우수한 비용 대비 성능 균형</td></tr>
<tr><td>모든-MiniLM-L6-v2</td><td>384</td><td>1.0x</td><td>88-92%</td><td>비용에 민감한 워크로드</td></tr>
</tbody>
</table>
<p><strong>실용적인 조언:</strong> 가장 큰 모델이 필요하다고 가정하지 마세요. 실제 쿼리의 대표적인 샘플(일반적으로 1백만 개의 벡터면 충분)로 테스트하여 정확도 기준을 충족하는 가장 낮은 차원 모델을 찾으세요. 많은 팀에서 768차원도 1536차원과 마찬가지로 사용 사례에 적합하다는 사실을 발견합니다.</p>
<p><strong>이미 고차원 모델을 사용 중이신가요?</strong> 사후에 차원을 줄일 수 있습니다. PCA(주성분 분석)를 사용하면 중복된 기능을 제거할 수 있으며, <a href="https://milvus.io/blog/matryoshka-embeddings-detail-at-multiple-scales.md">Matryoshka 임베딩을</a> 사용하면 대부분의 품질을 유지하면서 처음 N개의 차원으로 줄일 수 있습니다. 전체 데이터 집합을 다시 임베드하기 전에 두 가지 방법을 모두 시도해 볼 가치가 있습니다.</p>
<h2 id="Manage-Data-Lifecycle-with-Compaction-and-TTL" class="common-anchor-header">압축 및 TTL로 데이터 수명 주기 관리하기<button data-href="#Manage-Data-Lifecycle-with-Compaction-and-TTL" class="anchor-icon" translate="no">
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
    </button></h2><p>이 방법은 덜 화려하지만, 특히 장기간 운영되는 프로덕션 시스템에서는 여전히 중요합니다. Milvus는 추가 전용 스토리지 모델을 사용하므로 데이터를 삭제하면 삭제된 것으로 표시되지만 즉시 제거되지는 않습니다. 시간이 지남에 따라 이러한 죽은 데이터는 누적되어 저장 공간을 낭비하고 쿼리가 필요 이상으로 많은 행을 스캔하게 됩니다.</p>
<h3 id="Compaction-Reclaim-Storage-from-Deleted-Data" class="common-anchor-header">압축: 삭제된 데이터에서 저장 공간 회수</h3><p>압축은 밀버스의 백그라운드 정리 프로세스입니다. 작은 세그먼트를 병합하고, 삭제된 데이터를 물리적으로 제거하며, 압축된 파일을 다시 작성합니다. 다음과 같은 경우에 유용합니다:</p>
<ul>
<li>쓰기 및 삭제가 잦은 경우(제품 카탈로그, 콘텐츠 업데이트, 실시간 로그)</li>
<li>세그먼트 수가 계속 증가하는 경우(쿼리당 오버헤드 증가)</li>
<li>실제 유효한 데이터보다 스토리지 사용량이 훨씬 빠르게 증가하는 경우</li>
</ul>
<p><strong>주의하세요:</strong> 압축은 I/O 집약적입니다. 트래픽이 적은 시간대(예: 야간)에 예약하거나 트리거를 신중하게 조정하여 프로덕션 쿼리와 경쟁하지 않도록 하세요.</p>
<h3 id="TTLTime-to-Live-Automatically-Expire-Old-Vector-Data" class="common-anchor-header">TTL(타임 투 리브): 오래된 벡터 데이터 자동 만료</h3><p>자연적으로 만료되는 데이터의 경우, TTL이 수동 삭제보다 더 깔끔합니다. 데이터에 수명을 설정하면 만료 시 Milvus가 자동으로 삭제하도록 표시합니다. 압축은 실제 정리를 처리합니다.</p>
<p>다음과 같은 경우에 유용합니다:</p>
<ul>
<li>로그 및 세션 데이터 - 최근 7일 또는 30일만 유지</li>
<li>시간에 민감한 RAG - 최신 지식을 선호하고 오래된 문서는 만료되도록 놔둡니다.</li>
<li>실시간 추천 - 최근 사용자 행동에서만 검색</li>
</ul>
<p>압축과 TTL을 함께 사용하면 시스템이 소리 없이 폐기물을 쌓아두는 것을 방지할 수 있습니다. 가장 큰 비용 절감 효과는 아니지만, 팀원들을 당황하게 만드는 느린 스토리지 증가를 방지할 수 있습니다.</p>
<h2 id="One-More-Option-Zilliz-Cloud-Fully-Managed-Milvus" class="common-anchor-header">옵션 하나 더: Zilliz Cloud(완전 관리형 Milvus)<button data-href="#One-More-Option-Zilliz-Cloud-Fully-Managed-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>전체 공개: <a href="https://zilliz.com/">Zilliz Cloud는</a> Milvus와 동일한 팀이 구축한 서비스이므로 신중하게 고려해야 합니다.</p>
<p>하지만 직관적이지 않은 부분도 있습니다. Milvus는 무료 오픈 소스이지만 관리형 서비스가 실제로 셀프 호스팅보다 비용이 저렴할 수 있습니다. 소프트웨어는 무료이지만 이를 실행하기 위한 클라우드 인프라는 무료가 아니며, 이를 운영하고 유지 관리할 엔지니어가 필요하기 때문입니다. 매니지드 서비스가 더 적은 수의 머신과 더 적은 엔지니어 시간으로 동일한 작업을 수행할 수 있다면 서비스 자체에 대한 비용을 지불한 후에도 총 요금이 낮아집니다.</p>
<p><a href="https://zilliz.com/">질리즈 클라우드는</a> 밀버스를 기반으로 구축된 완전 매니지드 서비스이며 API와 호환됩니다. 두 가지가 비용과 관련이 있습니다:</p>
<ul>
<li><strong>노드당 성능 향상.</strong> 질리즈 클라우드는 최적화된 검색 엔진인 카디널에서 실행됩니다. <a href="https://zilliz.com/vdbbench-leaderboard?dataset=vectorSearch">VectorDBBench 결과에</a> 따르면, 오픈 소스 Milvus보다 3~5배 더 높은 처리량을 제공하며 10배 더 빠릅니다. 실제로는 동일한 워크로드에 대략 1/3에서 1/5의 컴퓨팅 노드가 필요하다는 뜻입니다.</li>
<li><strong>기본 제공 최적화.</strong> 이 가이드에서 다루는 기능인 MMap, 계층형 스토리지, 인덱스 정량화는 기본으로 제공되며 자동으로 조정됩니다. 자동 확장 기능은 실제 부하에 따라 용량을 조정하므로 필요하지 않은 헤드룸에 대해 비용을 지불하지 않아도 됩니다.</li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Blog_Howto_Cut_Vector_Database_Costsby_Upto80_A_Pract_1_5230ab94bf.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>API와 데이터 형식이 호환되므로<a href="https://zilliz.com/zilliz-migration-service">마이그레이션이</a> 간단합니다. Zilliz는 마이그레이션 도구도 제공합니다. 자세한 비교는 다음을 참조하세요: <a href="https://zilliz.com/zilliz-vs-milvus">질리즈 클라우드와 밀버스 비교</a></p>
<h2 id="Summary-A-Step-by-Step-Plan-to-Cut-Vector-Database-Costs" class="common-anchor-header">요약: 벡터 데이터베이스 비용 절감을 위한 단계별 계획<button data-href="#Summary-A-Step-by-Step-Plan-to-Cut-Vector-Database-Costs" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>한 가지 작업만 수행한다면, 인덱스 유형을 확인하세요.</strong></p>
<p>비용에 민감한 워크로드에서 HNSW를 실행하는 경우, IVF_SQ8로 전환하세요. 이것만으로도 리콜 손실을 최소화하면서 메모리 비용을 최대 70%까지 절감할 수 있습니다.</p>
<p>더 나아가고 싶다면 우선순위는 다음과 같습니다:</p>
<ul>
<li>대부분의 워크로드에서<strong>인덱스 전환</strong> - HNSW → IVF_SQ8. 아키텍처 변경 없이 빅뱅을 실현합니다.</li>
<li><strong>MMap 또는 계층형 스토리지 활성화</strong> - 모든 것을 메모리에 보관하지 마세요. 이는 재설계가 아닌 구성 변경입니다.</li>
<li><strong>임베딩 크기 평가</strong> - 더 작은 모델이 정확도 요구 사항을 충족하는지 테스트합니다. 이를 위해서는 임베딩을 다시 해야 하지만 비용 절감 효과가 있습니다.</li>
<li><strong>압축 및 TTL 설정</strong> - 특히 쓰기/삭제가 잦은 경우, 자동 데이터 부풀림을 방지하세요.</li>
</ul>
<p>이러한 전략을 함께 사용하면 벡터 데이터베이스 비용을 60~80%까지 줄일 수 있습니다. 모든 팀에 이 네 가지가 모두 필요한 것은 아닙니다. 인덱스 변경부터 시작하여 그 영향을 측정한 후 목록을 내려가면서 작업하세요.</p>
<p>운영 작업을 줄이고 비용 효율성을 개선하고자 하는 팀에게는 <a href="https://zilliz.com/">Zilliz Cloud</a> (관리형 Milvus)가 또 다른 옵션이 될 수 있습니다.</p>
<p>이러한 최적화 작업을 진행 중이고 다른 팀과 비교하고 싶다면 <a href="https://milvusio.slack.com/join/shared_invite/zt-3nntzngkz-gYwhrdSE4~76k0VMyBfD1Q#/shared-invite/email">Milvus 커뮤니티 Slack에</a> 질문할 수 있는 좋은 장소가 있습니다. 또한 <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">Milvus 오피스 아워에</a> 참여하여 특정 설정에 대해 엔지니어링 팀과 빠르게 채팅할 수도 있습니다.</p>
