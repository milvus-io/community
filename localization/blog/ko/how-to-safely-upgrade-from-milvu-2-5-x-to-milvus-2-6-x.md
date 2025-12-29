---
id: how-to-safely-upgrade-from-milvu-2-5-x-to-milvus-2-6-x.md
title: Milvus 2.5.x에서 Milvus 2.6.x로 안전하게 업그레이드하는 방법
author: Yiqing Lu
date: 2025-12-25T00:00:00.000Z
cover: assets.zilliz.com/milvus_upgrade_25x_to_26x_700x438_856ac6b75c.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus, vector databases, Milvus 2.6 features, Nvidia Cagra, full text search'
meta_title: |
  How to Safely Upgrade from Milvus 2.5.x to Milvus 2.6.x
desc: >-
  아키텍처 변경 사항 및 주요 기능을 포함한 Milvus 2.6의 새로운 기능을 살펴보고 Milvus 2.5에서 롤링 업그레이드를 수행하는
  방법을 알아보세요.
origin: >-
  https://milvus.io/blog/how-to-safely-upgrade-from-milvu-2-5-x-to-milvus-2-6-x.md
---
<p><a href="https://milvus.io/docs/release_notes.md"><strong>Milvus 2.6이</strong></a> 출시된 지 한참이 지났으며, 프로젝트의 탄탄한 진전을 입증하고 있습니다. 이번 릴리스에서는 개선된 아키텍처, 더욱 강력한 실시간 성능, 더 낮은 리소스 소비, 프로덕션 환경에서 더욱 스마트한 확장 동작을 제공합니다. 이러한 개선 사항의 대부분은 사용자 피드백을 통해 직접 형성되었으며, 2.6.x의 얼리 어답터들은 이미 워크로드가 많거나 동적인 상황에서 눈에 띄게 빨라진 검색과 더욱 예측 가능한 시스템 성능을 보고했습니다.</p>
<p>Milvus 2.5.x를 실행 중이며 2.6.x로의 전환을 평가 중인 팀이라면 이 가이드가 출발점이 될 것입니다. 이 가이드는 아키텍처의 차이점을 분석하고 Milvus 2.6에 도입된 주요 기능을 강조하며 운영 중단을 최소화하도록 설계된 실용적인 단계별 업그레이드 경로를 제공합니다.</p>
<p>워크로드에 실시간 파이프라인, 멀티모달 또는 하이브리드 검색, 대규모 벡터 연산이 포함된 경우, 이 블로그는 2.6이 요구 사항에 부합하는지 평가하고, 업그레이드를 진행하기로 결정했다면 데이터 무결성과 서비스 가용성을 유지하면서 안심하고 업그레이드하는 데 도움이 될 것입니다.</p>
<h2 id="Architecture-Changes-from-Milvus-25-to-Milvus-26" class="common-anchor-header">Milvus 2.5에서 Milvus 2.6으로의 아키텍처 변경 사항<button data-href="#Architecture-Changes-from-Milvus-25-to-Milvus-26" class="anchor-icon" translate="no">
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
    </button></h2><p>업그레이드 워크플로 자체에 대해 자세히 알아보기 전에 먼저 Milvus 2.6에서 Milvus 아키텍처가 어떻게 변경되었는지 이해해 보겠습니다.</p>
<h3 id="Milvus-25-Architecture" class="common-anchor-header">Milvus 2.5 아키텍처</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Milvus_Architecture_2_5_4e228af3c4.PNG" alt="Milvus 2.5 Architecture" class="doc-image" id="milvus-2.5-architecture" />
   </span> <span class="img-wrapper"> <span>Milvus 2.5 아키텍처</span> </span></p>
<p>Milvus 2.5에서는 스트리밍과 배치 워크플로우가 여러 워커 노드에 걸쳐 서로 얽혀 있었습니다:</p>
<ul>
<li><p><strong>QueryNode는</strong> 기록 <em>쿼리와</em> 증분(스트리밍) 쿼리를 모두 처리했습니다.</p></li>
<li><p><strong>DataNode는</strong> 수집 시 <em>플러싱과</em> 기록 데이터에 대한 백그라운드 압축을 모두 처리했습니다.</p></li>
</ul>
<p>이렇게 배치 로직과 실시간 로직이 혼합되어 있어 배치 워크로드를 독립적으로 확장하기가 어려웠습니다. 또한 스트리밍 상태가 여러 구성 요소에 분산되어 동기화 지연이 발생하고 장애 복구가 복잡해지며 운영 복잡성이 증가했습니다.</p>
<h3 id="Milvus-26-Architecture" class="common-anchor-header">Milvus 2.6 아키텍처</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Milvus_Architecture_2_6_ee6f1f0635.PNG" alt="Milvus 2.6 Architecture" class="doc-image" id="milvus-2.6-architecture" />
   </span> <span class="img-wrapper"> <span>Milvus 2.6 아키텍처</span> </span></p>
<p>Milvus 2.6은 메시지 큐 사용, 증분 세그먼트 쓰기, 증분 쿼리 서비스, WAL 기반 복구 관리 등 모든 실시간 데이터 책임을 처리하는 전용 <strong>StreamingNode를</strong> 도입했습니다. 스트리밍이 분리되면 나머지 구성 요소는 보다 깔끔하고 집중적인 역할을 수행합니다:</p>
<ul>
<li><p><strong>QueryNode는</strong> 이제 기록 세그먼트에 대한 일괄 <em>쿼리만</em> 처리합니다.</p></li>
<li><p>이제<strong>데이터 노드는</strong> 압축 및 인덱스 구축과 같은 기록 데이터 <em>작업만</em> 처리합니다.</p></li>
</ul>
<p>스트리밍 노드는 Milvus 2.5에서 데이터 노드, 쿼리 노드, 심지어 프록시까지 분산되어 있던 스트리밍 관련 작업을 모두 흡수하여 명확성을 높이고 역할 간 상태 공유를 줄입니다.</p>
<h3 id="Milvus-25x-vs-Milvus-26x-Component-by-Component-Comparison" class="common-anchor-header">Milvus 2.5.x와 Milvus 2.6.x 비교: 구성 요소별 비교</h3><table>
<thead>
<tr><th></th><th style="text-align:center"><strong>Milvus 2.5.x</strong></th><th style="text-align:center"><strong>Milvus 2.6.x</strong></th><th style="text-align:center"><strong>변경된 사항</strong></th></tr>
</thead>
<tbody>
<tr><td>코디네이터 서비스</td><td style="text-align:center">루트코드 / 쿼리코드 / 데이터코드(또는 믹스코드)</td><td style="text-align:center">MixCoord</td><td style="text-align:center">메타데이터 관리 및 작업 스케줄링이 단일 MixCoord로 통합되어 조정 로직이 단순화되고 분산된 복잡성이 감소합니다.</td></tr>
<tr><td>액세스 레이어</td><td style="text-align:center">프록시</td><td style="text-align:center">프록시</td><td style="text-align:center">쓰기 요청은 데이터 수집을 위해 스트리밍 노드를 통해서만 라우팅됩니다.</td></tr>
<tr><td>워커 노드</td><td style="text-align:center">-</td><td style="text-align:center">스트리밍 노드</td><td style="text-align:center">증분 데이터 수집-증분 데이터 쿼리-객체 스토리지에 증분 데이터 지속-스트림 기반 쓰기-WAL 기반 장애 복구 등 모든 증분(세그먼트 증가) 로직을 담당하는 전용 스트리밍 처리 노드입니다.</td></tr>
<tr><td></td><td style="text-align:center">쿼리 노드</td><td style="text-align:center">쿼리 노드</td><td style="text-align:center">기록 데이터에 대한 쿼리만 처리하는 일괄 처리 노드입니다.</td></tr>
<tr><td></td><td style="text-align:center">데이터 노드</td><td style="text-align:center">데이터 노드</td><td style="text-align:center">압축 및 인덱스 생성을 포함하여 기록 데이터만을 담당하는 일괄 처리 노드입니다.</td></tr>
<tr><td></td><td style="text-align:center">인덱스 노드</td><td style="text-align:center">-</td><td style="text-align:center">인덱스 노드가 데이터 노드로 병합되어 역할 정의와 배포 토폴로지가 간소화됩니다.</td></tr>
</tbody>
</table>
<p>요컨대, Milvus 2.6은 스트리밍과 배치 워크로드 사이에 명확한 선을 그어 2.5에서 볼 수 있었던 구성 요소 간 얽힘을 없애고 보다 확장 가능하고 유지 관리가 쉬운 아키텍처를 만듭니다.</p>
<h2 id="Milvus-26-Feature-Highlights" class="common-anchor-header">Milvus 2.6의 주요 기능<button data-href="#Milvus-26-Feature-Highlights" class="anchor-icon" translate="no">
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
    </button></h2><p>업그레이드 워크플로에 들어가기 전에 Milvus 2.6의 주요 기능을 간략히 살펴보겠습니다. <strong>이번 릴리즈는 인프라 비용을 낮추고, 검색 성능을 개선하며, 대규모의 동적 AI 워크로드를 보다 쉽게 확장할 수 있도록 하는 데 중점을 두고 있습니다.</strong></p>
<h3 id="Cost--Efficiency-Improvements" class="common-anchor-header">비용 및 효율성 개선</h3><ul>
<li><p><strong>기본 인덱스를 위한</strong><a href="https://milvus.io/docs/ivf-rabitq.md#RaBitQ"><strong>RaBitQ</strong></a> <strong>양자화</strong> - 벡터 인덱스를 원래 크기의 <strong>1/32로</strong> 압축하는 새로운 1비트 양자화 방식입니다. SQ8 리랭크와 결합하여 메모리 사용량을 최대 28%까지 줄이고, QPS를 4배 향상시키며, 최대 95%의 리콜을 유지하여 하드웨어 비용을 크게 낮춥니다.</p></li>
<li><p><a href="https://milvus.io/docs/full-text-search.md#BM25-implementation"><strong>BM25-최적화된</strong></a><strong> 전체 텍스트 검색</strong> - 희소 용어 가중치 벡터로 구동되는 네이티브 BM25 스코어링. 키워드 검색은 원본 텍스트 데이터의 약 3분의 1로 인덱스 크기를 유지하면서 Elasticsearch에 비해 <strong>3~4배</strong> (일부 데이터 세트에서는 최대 <strong>7배</strong> ) <strong>더 빠르게</strong> 실행됩니다.</p></li>
<li><p><strong>JSON 파쇄를 통한 JSON 경로 색인</strong> - 이제 중첩된 JSON에 대한 구조화된 필터링이 훨씬 더 빨라지고 훨씬 더 예측 가능해졌습니다. 사전 색인된 JSON 경로는 필터 지연 시간을 <strong>140밀리초 → 1.5밀리초</strong> (P99: <strong>480밀리초 → 10밀리초</strong>)로 줄여 하이브리드 벡터 검색 + 메타데이터 필터링의 응답성을 크게 향상시켰습니다.</p></li>
<li><p><strong>확장된 데이터 유형 지원</strong> - Int8 벡터 유형, <a href="https://milvus.io/docs/geometry-field.md#Geometry-Field">지오메트리</a> 필드(포인트/선형/폴리곤), 구조 배열이 추가되었습니다. 이러한 확장 기능은 지리공간 워크로드, 더 풍부한 메타데이터 모델링, 더 깔끔한 스키마를 지원합니다.</p></li>
<li><p><strong>부분 업데이트를 위한 업서트</strong> - 이제 단일 기본 키 호출을 사용하여 엔티티를 삽입하거나 업데이트할 수 있습니다. 부분 업데이트는 제공된 필드만 수정하므로 쓰기 증폭이 줄어들고 메타데이터나 임베딩을 자주 새로 고치는 파이프라인이 간소화됩니다.</p></li>
</ul>
<h3 id="Search-and-Retrieval-Enhancements" class="common-anchor-header">검색 및 검색 기능 개선</h3><ul>
<li><p><strong>향상된 텍스트 처리 및 다국어 지원:</strong> 새로운 Lindera 및 ICU 토큰화기가 일본어, 한국어, <a href="https://milvus.io/docs/multi-language-analyzers.md#Multi-language-Analyzers">다국어</a> 텍스트 처리를 개선했습니다. <code translate="no">run_analyzer</code> 은 토큰화 동작을 디버깅하는 데 도움을 주며, 다국어 분석기는 일관된 다국어 검색을 보장합니다.</p></li>
<li><p><strong>고정밀 텍스트 매칭:</strong> <a href="https://milvus.io/docs/phrase-match.md#Phrase-Match">구문</a> 일치는 구성 가능한 슬로프를 통해 정렬된 구문 쿼리를 적용합니다. 새로운 <a href="https://milvus.io/docs/ngram.md#NGRAM">NGRAM</a> 인덱스는 부분 문자열과 <code translate="no">LIKE</code> 쿼리를 VARCHAR 필드와 JSON 경로 모두에서 가속화하여 부분 텍스트와 퍼지 매칭을 빠르게 처리합니다.</p></li>
<li><p><strong>시간 인식 및 메타데이터 인식 재랭킹:</strong> <a href="https://milvus.io/docs/decay-ranker-overview.md">디케이 랭커</a> (지수, 선형, 가우스)는 타임스탬프를 사용해 점수를 조정하고, <a href="https://milvus.io/docs/boost-ranker.md#Boost-Ranker">부스트 랭커는</a> 메타데이터 기반 규칙을 적용하여 결과를 승격 또는 강등합니다. 두 가지 모두 기초 데이터를 변경하지 않고 검색 동작을 미세 조정하는 데 도움이 됩니다.</p></li>
<li><p><strong>간소화된 모델 통합 및 자동 벡터화:</strong> OpenAI, Hugging Face 및 기타 임베딩 제공업체와의 기본 통합을 통해 Milvus는 삽입 및 쿼리 작업 중에 텍스트를 자동으로 벡터화할 수 있습니다. 일반적인 사용 사례에 대해 더 이상 수동 임베딩 파이프라인을 사용할 필요가 없습니다.</p></li>
<li><p><strong>스칼라 필드에 대한 온라인 스키마 업데이트:</strong> 다운타임이나 재로드 없이 기존 컬렉션에 새로운 스칼라 필드를 추가하여 메타데이터 요구 사항이 증가함에 따라 스키마 진화를 간소화할 수 있습니다.</p></li>
<li><p><strong>MinHash를 통한 거의 중복 탐지:</strong> <a href="https://milvus.io/docs/minhash-lsh.md#MINHASHLSH">MinHash</a> + LSH를 사용하면 비용이 많이 드는 정확한 비교 없이도 대규모 데이터 세트에서 효율적으로 거의 중복을 탐지할 수 있습니다.</p></li>
</ul>
<h3 id="Architecture-and-Scalability-Upgrades" class="common-anchor-header">아키텍처 및 확장성 업그레이드</h3><ul>
<li><p><strong>핫-콜드 데이터 관리를 위한</strong><a href="https://milvus.io/docs/tiered-storage-overview.md#Tiered-Storage-Overview"><strong>계층형 스토리지</strong></a> <strong>:</strong> SSD와 오브젝트 스토리지에서 핫 데이터와 콜드 데이터를 분리하고, 지연 및 부분 로딩을 지원하며, 컬렉션을 로컬에서 완전히 로드할 필요가 없고, 리소스 사용량을 최대 50%까지 줄이고 대규모 데이터 세트의 로드 시간을 단축할 수 있습니다.</p></li>
<li><p><strong>실시간 스트리밍 서비스:</strong> 지속적인 수집을 위해 Kafka/Pulsar와 통합된 전용 스트리밍 노드를 추가하고, 즉각적인 색인 및 쿼리 가용성을 지원하며, 쓰기 처리량을 개선하고 빠르게 변화하는 실시간 워크로드에 대한 장애 복구 속도를 높입니다.</p></li>
<li><p><strong>향상된 확장성 및 안정성:</strong> Milvus는 이제 대규모 멀티테넌트 환경을 위해 100,000개 이상의 컬렉션을 지원합니다. 인프라 업그레이드인 <a href="https://milvus.io/docs/woodpecker_architecture.md#Woodpecker">Woodpecker</a> (제로 디스크 WAL), <a href="https://milvus.io/docs/roadmap.md#%F0%9F%94%B9-HotCold-Tiering--Storage-Architecture-StorageV2">Storage v2</a> (IOPS/메모리 감소), <a href="https://milvus.io/docs/release_notes.md#Coordinator-Merge-into-MixCoord">Coordinator Merge는</a> 클러스터 안정성을 개선하고 워크로드 폭증 시에도 예측 가능한 확장을 가능하게 합니다.</p></li>
</ul>
<p>Milvus 2.6의 전체 기능 목록은 <a href="https://milvus.io/docs/release_notes.md">Milvus 릴리즈 노트에서</a> 확인하세요.</p>
<h2 id="How-to-Upgrade-from-Milvus-25x-to-Milvus-26x" class="common-anchor-header">Milvus 2.5.x에서 Milvus 2.6.x로 업그레이드하는 방법<button data-href="#How-to-Upgrade-from-Milvus-25x-to-Milvus-26x" class="anchor-icon" translate="no">
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
    </button></h2><p>업그레이드하는 동안 시스템을 최대한 가용 상태로 유지하려면 다음 순서대로 Milvus 2.5 클러스터를 Milvus 2.6으로 업그레이드해야 합니다.</p>
<p><strong>1. 스트리밍 노드 먼저 시작</strong></p>
<p>스트리밍 노드를 미리 시작하세요. 새로운 <strong>Delegator</strong> (스트리밍 데이터 처리를 담당하는 쿼리 노드의 컴포넌트)를 Milvus 2.6 스트리밍 노드로 이동해야 합니다.</p>
<p><strong>2. MixCoord 업그레이드</strong></p>
<p>코디네이터 컴포넌트를 <strong>MixCoord로</strong> 업그레이드합니다. 이 단계에서는 분산 시스템 내에서 버전 간 호환성을 처리하기 위해 MixCoord가 워커 노드의 버전을 감지해야 합니다.</p>
<p><strong>3. 쿼리 노드 업그레이드</strong></p>
<p>쿼리 노드 업그레이드는 일반적으로 시간이 오래 걸립니다. 이 단계에서 Milvus 2.5 데이터 노드와 인덱스 노드는 플러시 및 인덱스 구축과 같은 작업을 계속 처리할 수 있으므로 쿼리 노드가 업그레이드되는 동안 쿼리 측의 부담을 줄일 수 있습니다.</p>
<p><strong>4. 데이터 노드 업그레이드</strong></p>
<p>Milvus 2.5 데이터 노드가 오프라인 상태가 되면 플러시 작업을 사용할 수 없게 되며, 모든 노드가 Milvus 2.6으로 완전히 업그레이드될 때까지 성장 세그먼트의 데이터는 계속 누적될 수 있습니다.</p>
<p><strong>5. 프록시 업그레이드</strong></p>
<p>프록시를 Milvus 2.6으로 업그레이드한 후에는 모든 클러스터 구성 요소가 2.6으로 업그레이드될 때까지 해당 프록시에 대한 쓰기 작업을 사용할 수 없게 됩니다.</p>
<p><strong>6. 인덱스 노드 제거</strong></p>
<p>다른 모든 구성 요소가 업그레이드되면 독립형 인덱스 노드를 안전하게 제거할 수 있습니다.</p>
<p><strong>참고:</strong></p>
<ul>
<li><p>데이터 노드 업그레이드가 완료된 후부터 프록시 업그레이드가 완료될 때까지 플러시 작업을 사용할 수 없습니다.</p></li>
<li><p>첫 번째 프록시가 업그레이드된 시점부터 모든 프록시 노드가 업그레이드될 때까지 일부 쓰기 작업을 사용할 수 없습니다.</p></li>
<li><p><strong>Milvus 2.5.x에서 2.6.6으로 직접 업그레이드하는 경우, 업그레이드 프로세스 중에는 DDL 프레임워크의 변경으로 인해 DDL(데이터 정의 언어) 작업을 사용할 수 없습니다.</strong></p></li>
</ul>
<h2 id="How-to-Upgrade-to-Milvus-26-with-Milvus-Operator" class="common-anchor-header">Milvus 오퍼레이터를 사용하여 Milvus 2.6으로 업그레이드하는 방법<button data-href="#How-to-Upgrade-to-Milvus-26-with-Milvus-Operator" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://github.com/zilliztech/milvus-operator">Milvus Operator는</a> 대상 Kubernetes 클러스터에서 전체 Milvus 서비스 스택을 배포, 관리 및 업그레이드할 수 있는 확장 가능하고 가용성이 높은 방법을 제공하는 오픈 소스 Kubernetes 운영자입니다. 운영자가 관리하는 Milvus 서비스 스택에는 다음이 포함됩니다:</p>
<ul>
<li><p>핵심 Milvus 구성 요소</p></li>
<li><p>etcd, Pulsar, MinIO와 같은 필수 종속성</p></li>
</ul>
<p>밀버스 오퍼레이터는 표준 쿠버네티스 오퍼레이터 패턴을 따릅니다. 버전, 토폴로지 및 구성과 같은 Milvus 클러스터의 원하는 상태를 설명하는 Milvus 사용자 정의 리소스(CR)를 도입합니다.</p>
<p>컨트롤러는 클러스터를 지속적으로 모니터링하고 실제 상태를 CR에 정의된 원하는 상태와 조정합니다. Milvus 버전 업그레이드와 같이 변경 사항이 발생하면 운영자는 제어되고 반복 가능한 방식으로 변경 사항을 자동으로 적용하여 자동 업그레이드와 지속적인 수명 주기 관리를 가능하게 합니다.</p>
<h3 id="Milvus-Custom-Resource-CR-Example" class="common-anchor-header">Milvus 사용자 지정 리소스(CR) 예시</h3><pre><code translate="no">apiVersion: milvus.io/v1beta1
kind: Milvus
metadata:
  name: my-milvus-mansion    
  namespace: dev       
spec:
  mode: cluster                  <span class="hljs-comment"># cluster or standalone</span>
  <span class="hljs-comment"># Milvus Components</span>
  components:
    image: milvusdb/milvus:v2.6.5
    imageUpdateMode: rollingUpgrade 
    proxy:                   
      replicas: 1          
    mixCoord:              
      replicas: 1           
    dataNode:               
      replicas: 1          
    queryNode:              
      replicas: 2           
      resources:
        requests:
          cpu: <span class="hljs-string">&quot;2&quot;</span>
          memory: <span class="hljs-string">&quot;8Gi&quot;</span>  
  <span class="hljs-comment"># Dependencies, including etcd, storage and message stream</span>
  dependencies:
    etcd:                   
      inCluster:
        values:
          replicaCount: 3    
    storage:                 
      <span class="hljs-built_in">type</span>: MinIO
      inCluster:
        values:
          mode: distributed     
    msgStreamType: pulsar    
    pulsar:
      inCluster:
        values:
          bookkeeper:
            replicas: 3   
  <span class="hljs-comment"># Milvus configs</span>
  config:
    dataCoord:
      enableActiveStandby: <span class="hljs-literal">true</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Rolling-Upgrades-from-Milvus-25-to-26-with-Milvus-Operator" class="common-anchor-header">Milvus Operator를 통한 Milvus 2.5에서 2.6으로의 롤링 업그레이드</h3><p>Milvus Operator는 클러스터 모드에서 <strong>Milvus 2.5에서 2.6으로의 롤링 업그레이드를</strong> 기본적으로 지원하며, 2.6에 도입된 아키텍처 변경 사항을 고려하도록 동작을 조정합니다.</p>
<p><strong>1. 업그레이드 시나리오 감지</strong></p>
<p>업그레이드하는 동안 Milvus 운영자는 클러스터 사양에서 대상 Milvus 버전을 결정합니다. 이는 다음 중 하나를 통해 수행됩니다:</p>
<ul>
<li><p><code translate="no">spec.components.image</code> 에 정의된 이미지 태그 검사 또는</p></li>
<li><p>에 명시된 명시적 버전을 읽습니다. <code translate="no">spec.components.version</code></p></li>
</ul>
<p>그런 다음 운영자는 이 원하는 버전을 <code translate="no">status.currentImage</code> 또는 <code translate="no">status.currentVersion</code> 에 기록된 현재 실행 중인 버전과 비교합니다. 현재 버전이 2.5이고 원하는 버전이 2.6인 경우, 운영자는 업그레이드를 2.5 → 2.6 업그레이드 시나리오로 식별합니다.</p>
<p><strong>2. 롤링 업그레이드 실행 순서</strong></p>
<p>2.5 → 2.6 업그레이드가 감지되고 업그레이드 모드가 롤링 업그레이드(<code translate="no">spec.components.imageUpdateMode: rollingUpgrade</code>, 기본값)로 설정되면 Milvus 운영자는 Milvus 2.6 아키텍처에 맞춰 미리 정의된 순서대로 업그레이드를 자동으로 수행합니다:</p>
<p>스트리밍 노드 시작 → 믹스코드 업그레이드 → 쿼리 노드 업그레이드 → 데이터 노드 업그레이드 → 프록시 업그레이드 → 인덱스 노드 제거 순서로 진행됩니다.</p>
<p><strong>3. 자동 코디네이터 통합</strong></p>
<p>Milvus 2.6은 여러 코디네이터 컴포넌트를 하나의 MixCoord로 대체합니다. Milvus 오퍼레이터는 이 아키텍처 전환을 자동으로 처리합니다.</p>
<p><code translate="no">spec.components.mixCoord</code> 가 구성되면 운영자는 MixCoord를 불러와 준비가 될 때까지 기다립니다. MixCoord가 완전히 작동하면 운영자는 레거시 코디네이터 구성 요소인 루트코드, 쿼리코드, 데이터코드를 자동으로 종료하여 수동 개입 없이 마이그레이션을 완료합니다.</p>
<h3 id="Upgrade-Steps-from-Milvus-25-to-26" class="common-anchor-header">Milvus 2.5에서 2.6으로의 업그레이드 단계</h3><p>1.Milvus Operator를 최신 버전으로 업그레이드합니다(이 가이드에서는 작성 시점의 최신 릴리스인 <strong>1.3.3 버전을</strong> 사용합니다).</p>
<pre><code translate="no"><span class="hljs-comment"># Option 1: Using Helm</span>
helm upgrade --install milvus-operator \
  -n milvus-operator --create-namespace \
  https://github.com/zilliztech/milvus-operator/releases/download/v1.3.3/milvus-operator-1.3.3.tgz
 <span class="hljs-comment"># Option 2: Using kubectl &amp; raw manifests</span>
 kubectl apply -f https://raw.githubusercontent.com/zilliztech/milvus-operator/v1.3.3/deploy/manifests/deployment.yaml
<button class="copy-code-btn"></button></code></pre>
<p>2.코디네이터 구성 요소 병합</p>
<pre><code translate="no">kubectl patch milvus my-release -n demo-operator --<span class="hljs-built_in">type</span>=merge -p <span class="hljs-string">&#x27;
{
  &quot;spec&quot;: {
    &quot;components&quot;: {
      &quot;mixCoord&quot;: {
        &quot;replicas&quot;: 1
      }
    }
  }
}&#x27;</span>
<button class="copy-code-btn"></button></code></pre>
<p>3. 클러스터가 Milvus 2.5.16 이상을 실행 중인지 확인합니다.</p>
<pre><code translate="no">kubectl patch milvus my-release -n demo-operator --<span class="hljs-built_in">type</span>=merge -p <span class="hljs-string">&#x27;
{
  &quot;spec&quot;: {
    &quot;components&quot;: {
      &quot;image&quot;: &quot;milvusdb/milvus:v2.5.22&quot;
    }
  }
}&#x27;</span>
<span class="hljs-comment"># wait till updated</span>
kubectl <span class="hljs-built_in">wait</span> milvus my-release -n demo-operator --<span class="hljs-keyword">for</span>=condition=milvusupdated --<span class="hljs-built_in">timeout</span>=1h
<button class="copy-code-btn"></button></code></pre>
<p>4. Milvus를 버전 2.6으로 업그레이드하기</p>
<pre><code translate="no">kubectl patch milvus my-release -n demo-operator --<span class="hljs-built_in">type</span>=merge -p <span class="hljs-string">&#x27;
{
  &quot;spec&quot;: {
    &quot;components&quot;: {
      &quot;image&quot;: &quot;milvusdb/milvus:v2.6.5&quot;
    }
  }
}&#x27;</span>
<span class="hljs-comment"># wait till updated</span>
kubectl <span class="hljs-built_in">wait</span> milvus my-release -n demo-operator --<span class="hljs-keyword">for</span>=condition=milvusupdated --<span class="hljs-built_in">timeout</span>=1h
<button class="copy-code-btn"></button></code></pre>
<h2 id="How-to-Upgrade-to-Milvus-26-with-Helm" class="common-anchor-header">헬름으로 밀버스 2.6으로 업그레이드하는 방법<button data-href="#How-to-Upgrade-to-Milvus-26-with-Helm" class="anchor-icon" translate="no">
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
    </button></h2><p>헬름을 사용하여 밀버스를 배포할 때, 모든 쿠버네티스 <code translate="no">Deployment</code> 리소스는 보장된 실행 순서 없이 병렬로 업데이트된다. 결과적으로 헬름은 컴포넌트 간 롤링 업그레이드 시퀀스에 대한 엄격한 제어를 제공하지 않는다. 따라서 프로덕션 환경에서는 밀버스 오퍼레이터를 사용할 것을 강력히 권장한다.</p>
<p>아래 단계에 따라 헬름을 사용하여 밀버스를 2.5에서 2.6으로 업그레이드할 수 있다.</p>
<p>시스템 요구 사항</p>
<ul>
<li><p><strong>헬름 버전:</strong> ≥ 3.14.0</p></li>
<li><p><strong>쿠버네티스 버전:</strong> ≥ 1.20.0</p></li>
</ul>
<p>1. 밀버스 헬름 차트를 최신 버전으로 업그레이드한다. 이 가이드에서는 작성 시점의 최신 버전인 <strong>차트 버전 5.0.7을</strong> 사용합니다.</p>
<pre><code translate="no">helm repo <span class="hljs-keyword">add</span> zilliztech https:<span class="hljs-comment">//zilliztech.github.io/milvus-helm</span>
helm repo update
<button class="copy-code-btn"></button></code></pre>
<p>2. 클러스터에 여러 코디네이터 구성 요소가 배포된 경우 먼저 Milvus를 2.5.16 버전 이상으로 업그레이드하고 MixCoord를 활성화합니다.</p>
<pre><code translate="no">mixCoordinator
。
helm upgrade -i my-release zilliztech/milvus \
  --namespace=helm-demo \
  --<span class="hljs-built_in">set</span> image.all.tag=<span class="hljs-string">&quot;v2.5.22&quot;</span> \
  --<span class="hljs-built_in">set</span> mixCoordinator.enabled=<span class="hljs-literal">true</span> \
  --<span class="hljs-built_in">set</span> rootCoordinator.enabled=<span class="hljs-literal">false</span> \
  --<span class="hljs-built_in">set</span> indexCoordinator.enabled=<span class="hljs-literal">false</span> \
  --<span class="hljs-built_in">set</span> queryCoordinator.enabled=<span class="hljs-literal">false</span> \
  --<span class="hljs-built_in">set</span> dataCoordinator.enabled=<span class="hljs-literal">false</span> \
  --<span class="hljs-built_in">set</span> streaming.enabled=<span class="hljs-literal">false</span> \
  --<span class="hljs-built_in">set</span> indexNode.enabled=<span class="hljs-literal">true</span> \
  --reset-then-reuse-values \
  --version=5.0.7 \
  --<span class="hljs-built_in">wait</span> --<span class="hljs-built_in">timeout</span> 1h
<button class="copy-code-btn"></button></code></pre>
<p>3. Milvus를 버전 2.6으로 업그레이드합니다.</p>
<pre><code translate="no">helm upgrade my-release zilliztech/milvus \
  --namespace=helm-demo \
  --<span class="hljs-built_in">set</span> image.all.tag=<span class="hljs-string">&quot;v2.6.5&quot;</span> \
  --<span class="hljs-built_in">set</span> streaming.enabled=<span class="hljs-literal">true</span> \
  --<span class="hljs-built_in">set</span> indexNode.enabled=<span class="hljs-literal">false</span> \
  --reset-then-reuse-values \
  --version=5.0.7 \
  --<span class="hljs-built_in">wait</span> --<span class="hljs-built_in">timeout</span> 1h
<button class="copy-code-btn"></button></code></pre>
<h2 id="FAQ-on-Milvus-26-Upgrade-and-Operations" class="common-anchor-header">Milvus 2.6 업그레이드 및 운영에 대한 FAQ<button data-href="#FAQ-on-Milvus-26-Upgrade-and-Operations" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Q1-Milvus-Helm-vs-Milvus-Operator--which-one-should-I-use" class="common-anchor-header">Q1: Milvus 헬름과 Milvus 오퍼레이터 중 어떤 것을 사용해야 하나요?</h3><p>프로덕션 환경의 경우 Milvus Operator를 강력히 권장합니다.</p>
<p>자세한 내용은 공식 가이드를 참조하세요: <a href="https://github.com/zilliztech/milvus-operator?tab=readme-ov-file#milvus-operator-vs-helm">https://github.com/zilliztech/milvus-operator?tab=readme-ov-file#milvus-operator-vs-helm</a></p>
<h3 id="Q2-How-should-I-choose-a-Message-Queue-MQ" class="common-anchor-header">질문2: 메시지 큐(MQ)는 어떻게 선택해야 하나요?</h3><p>배포 모드와 운영 요구 사항에 따라 권장되는 MQ가 달라집니다:</p>
<p><strong>1. 독립형 모드:</strong> 비용에 민감한 배포의 경우 RocksMQ를 권장합니다.</p>
<p><strong>2. 클러스터 모드</strong></p>
<ul>
<li><p><strong>Pulsar는</strong> 멀티테넌시를 지원하고 대규모 클러스터가 인프라를 공유할 수 있으며 강력한 수평적 확장성을 제공합니다.</p></li>
<li><p><strong>Kafka는</strong> 대부분의 주요 클라우드 플랫폼에서 관리형 SaaS 제품을 사용할 수 있는 보다 성숙한 에코시스템을 갖추고 있습니다.</p></li>
</ul>
<p><strong>3. Woodpecker(Milvus 2.6에서 도입):</strong> 우드페커는 외부 메시지 큐의 필요성을 제거하여 비용과 운영 복잡성을 줄여줍니다.</p>
<ul>
<li><p>현재는 가볍고 작동하기 쉬운 임베디드 우드페커 모드만 지원됩니다.</p></li>
<li><p>Milvus 2.6 독립형 배포의 경우, Woodpecker를 권장합니다.</p></li>
<li><p>프로덕션 클러스터 배포의 경우, 곧 출시될 Woodpecker 클러스터 모드가 제공되면 사용하는 것이 좋습니다.</p></li>
</ul>
<h3 id="Q3-Can-the-Message-Queue-be-switched-during-an-upgrade" class="common-anchor-header">Q3: 업그레이드 중에 메시지 큐를 전환할 수 있나요?</h3><p>아니요. 업그레이드 중 메시지 큐 전환은 현재 지원되지 않습니다. 향후 릴리스에서는 Pulsar, Kafka, Woodpecker 및 RocksMQ 간의 전환을 지원하는 관리 API가 도입될 예정입니다.</p>
<h3 id="Q4-Do-rate-limiting-configurations-need-to-be-updated-for-Milvus-26" class="common-anchor-header">Q4: Milvus 2.6에서는 속도 제한 구성을 업데이트해야 하나요?</h3><p>아니요. 기존 전송률 제한 구성은 계속 유효하며 새로운 스트리밍 노드에도 적용됩니다. 변경할 필요가 없습니다.</p>
<h3 id="Q5-After-the-coordinator-merge-do-monitoring-roles-or-configurations-change" class="common-anchor-header">Q5: 코디네이터 병합 후 모니터링 역할이나 구성이 변경되나요?</h3><ul>
<li><p>모니터링 역할은 변경되지 않습니다(<code translate="no">RootCoord</code>, <code translate="no">QueryCoord</code>, <code translate="no">DataCoord</code>).</p></li>
<li><p>기존 구성 옵션은 이전과 같이 계속 작동합니다.</p></li>
<li><p>새로운 구성 옵션인 <code translate="no">mixCoord.enableActiveStandby</code> 이 도입되며 명시적으로 설정하지 않으면 <code translate="no">rootcoord.enableActiveStandby</code> 으로 돌아갑니다.</p></li>
</ul>
<h3 id="Q6-What-are-the-recommended-resource-settings-for-StreamingNode" class="common-anchor-header">Q6: 스트리밍 노드에 권장되는 리소스 설정은 무엇인가요?</h3><ul>
<li><p>실시간 수집량이 적거나 가끔씩 쓰기 및 쿼리 워크로드를 수행하는 경우에는 CPU 코어 2개, 메모리 8GB와 같은 작은 구성으로도 충분합니다.</p></li>
<li><p>실시간 수집이 많거나 지속적인 쓰기 및 쿼리 워크로드의 경우, 쿼리 노드와 비슷한 리소스를 할당하는 것이 좋습니다.</p></li>
</ul>
<h3 id="Q7-How-do-I-upgrade-a-standalone-deployment-using-Docker-Compose" class="common-anchor-header">Q7: Docker Compose를 사용하여 독립형 배포를 업그레이드하려면 어떻게 해야 하나요?</h3><p>Docker Compose 기반 독립 실행형 배포의 경우, <code translate="no">docker-compose.yaml</code> 에서 Milvus 이미지 태그를 업데이트하기만 하면 됩니다.</p>
<p>자세한 내용은 공식 가이드를 참조하세요: <a href="https://milvus.io/docs/upgrade_milvus_standalone-docker.md">https://milvus.io/docs/upgrade_milvus_standalone-docker.md</a></p>
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
    </button></h2><p>Milvus 2.6은 아키텍처와 운영 모두에서 크게 개선되었습니다. StreamingNode의 도입으로 스트리밍과 배치 처리를 분리하고, 코디네이터를 MixCoord로 통합하며, 작업자 역할을 단순화함으로써 Milvus 2.6은 대규모 벡터 워크로드를 위한 보다 안정적이고 확장 가능하며 운영하기 쉬운 기반을 제공합니다.</p>
<p>이러한 아키텍처 변경으로 인해 특히 Milvus 2.5에서의 업그레이드는 순서에 더욱 민감해졌습니다. 성공적인 업그레이드는 구성 요소 종속성과 일시적인 가용성 제약 조건을 준수하는 데 달려 있습니다. 프로덕션 환경의 경우 업그레이드 순서를 자동화하고 운영 위험을 줄여주는 Milvus Operator가 권장되는 반면, 비프로덕션 사용 사례에는 Helm 기반 업그레이드가 더 적합합니다.</p>
<p>향상된 검색 기능, 더 풍부한 데이터 유형, 계층화된 스토리지, 개선된 메시지 큐 옵션을 갖춘 Milvus 2.6은 실시간 수집, 높은 쿼리 성능, 대규모의 효율적인 운영이 필요한 최신 AI 애플리케이션을 지원하는 데 유리한 위치에 있습니다.</p>
<p>최신 Milvus의 기능에 대해 궁금한 점이 있거나 자세히 알아보고 싶으신가요?<a href="https://discord.com/invite/8uyFbECzPX"> Discord 채널에</a> 참여하거나<a href="https://github.com/milvus-io/milvus"> GitHub에</a> 이슈를 제출하세요. 또한<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus 오피스 아워를</a> 통해 20분간의 일대일 세션을 예약하여 인사이트, 안내, 질문에 대한 답변을 얻을 수도 있습니다.</p>
<h2 id="More-Resources-about-Milvus-26" class="common-anchor-header">Milvus 2.6에 대한 추가 리소스<button data-href="#More-Resources-about-Milvus-26" class="anchor-icon" translate="no">
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
<li><p><a href="https://milvus.io/docs/release_notes.md">Milvus 2.6 릴리스 노트</a></p></li>
<li><p><a href="https://www.youtube.com/watch?v=Guct-UMK8lw&amp;t=157s">Milvus 2.6 웨비나 녹화: 더 빠른 검색, 더 낮은 비용, 더 스마트한 확장</a></p></li>
<li><p>Milvus 2.6 기능 블로그</p>
<ul>
<li><p><a href="https://milvus.io/blog/data-in-and-data-out-in-milvus-2-6.md">임베딩 기능을 소개합니다: Milvus 2.6이 벡터화 및 시맨틱 검색을 간소화하는 방법</a></p></li>
<li><p><a href="https://milvus.io/blog/json-shredding-in-milvus-faster-json-filtering-with-flexibility.md">Milvus의 JSON 파쇄: 유연성을 갖춘 88.9배 빠른 JSON 필터링</a></p></li>
<li><p><a href="https://milvus.io/blog/unlocking-true-entity-level-retrieval-new-array-of-structs-and-max-sim-capabilities-in-milvus.md">진정한 엔티티 수준 검색을 실현합니다: Milvus의 새로운 배열 구조 및 MAX_SIM 기능</a></p></li>
<li><p><a href="https://milvus.io/blog/milvus-tiered-storage-80-less-vector-search-cost-with-on-demand-hot%E2%80%93cold-data-loading.md">콜드 데이터에 대한 비용 지불 중단: Milvus 계층형 스토리지의 온디맨드 핫-콜드 데이터 로딩으로 80% 비용 절감</a></p></li>
<li><p><a href="https://milvus.io/blog/introducing-aisaq-in-milvus-billion-scale-vector-search-got-3200-cheaper-on-memory.md">Milvus에 AISAQ 도입: 10억 개 규모의 벡터 검색으로 메모리 비용 3,200배 절감</a></p></li>
<li><p><a href="https://milvus.io/blog/faster-index-builds-and-scalable-queries-with-gpu-cagra-in-milvus.md">Milvus에서 NVIDIA CAGRA 최적화: 더 빠른 인덱싱과 더 저렴한 쿼리를 위한 하이브리드 GPU-CPU 접근 방식</a></p></li>
<li><p><a href="https://milvus.io/blog/milvus-ngram-index-faster-keyword-matching-and-like-queries-for-agent-workloads.md">Milvus Ngram 인덱스를 소개합니다: 에이전트 워크로드를 위한 보다 빠른 키워드 매칭 및 좋아요 쿼리</a></p></li>
<li><p><a href="https://milvus.io/blog/unlock-geo-vector-search-with-geometry-fields-and-rtree-index-in-milvus.md">Milvus 2.6에서 지오메트리 필드 및 RTREE와 함께 지리공간 필터링 및 벡터 검색 제공</a></p></li>
<li><p><a href="https://milvus.io/blog/how-to-filter-efficiently-without-killing-recall.md">실제 환경에서의 벡터 검색: 리콜을 죽이지 않고 효율적으로 필터링하는 방법</a></p></li>
<li><p><a href="https://milvus.io/blog/bring-vector-compression-to-the-extreme-how-milvus-serves-3%C3%97-more-queries-with-rabitq.md">벡터 압축을 극한으로 끌어올리기: Milvus가 RaBitQ로 3배 더 많은 쿼리를 처리하는 방법</a></p></li>
<li><p><a href="https://milvus.io/blog/benchmarks-lie-vector-dbs-deserve-a-real-test.md">벤치마크는 거짓말 - 벡터 DB는 실제 테스트가 필요합니다.</a></p></li>
<li><p><a href="https://milvus.io/blog/we-replaced-kafka-pulsar-with-a-woodpecker-for-milvus.md">Milvus에서 Kafka/Pulsar를 딱따구리로 대체한 결과 - 이렇게 되었습니다.</a></p></li>
<li><p><a href="https://milvus.io/blog/minhash-lsh-in-milvus-the-secret-weapon-for-fighting-duplicates-in-llm-training-data.md">Milvus의 MinHash LSH: LLM 훈련 데이터의 중복을 방지하는 비밀 무기</a></p></li>
</ul></li>
</ul>
