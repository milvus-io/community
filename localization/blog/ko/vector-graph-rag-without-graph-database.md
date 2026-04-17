---
id: vector-graph-rag-without-graph-database.md
title: 그래프 데이터베이스 없이 그래프 RAG를 구축했습니다.
author: Cheney Zhang
date: 2026-4-17
cover: assets.zilliz.com/vector_graph_rag_without_graph_database_md_1_e9c1adda4a.jpeg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'graph RAG, multi-hop RAG, vector database, Milvus, knowledge graph RAG'
meta_title: |
  Graph RAG Without a Graph Database | Vector Graph RAG
desc: >-
  오픈 소스 벡터 그래프 RAG는 Milvus만을 사용해 RAG에 멀티홉 추론을 추가합니다. 87.8% Recall@5, 쿼리당 2번의 LLM
  호출, 그래프 데이터베이스 필요 없음.
origin: 'https://milvus.io/blog/vector-graph-rag-without-graph-database.md'
---
<blockquote>
<p><strong><em>요약:</em></strong> <em>그래프 RAG를 위해 그래프 데이터베이스가 실제로 필요한가요? 아니요. 엔티티, 관계, 통로를 Milvus에 넣으면 됩니다. 그래프 탐색 대신 서브그래프 확장을 사용하고, 다중 라운드 에이전트 루프 대신 하나의 LLM 리랭크만 사용하면 됩니다. 이것이</em> <em>바로</em> <a href="https://github.com/zilliztech/vector-graph-rag"><strong><em>벡터 그래프 RAG이며</em></strong></a> <em>, 저희가 구축한 것입니다. 이 접근 방식은 3개의 멀티홉 QA 벤치마크에서 평균 87.8%의 Recall@5를 기록했으며, 단일 Milvus 인스턴스에서 HippoRAG 2를 능가했습니다.</em></p>
</blockquote>
<p>멀티홉 질문은 대부분의 RAG 파이프라인이 결국 부딪히는 벽입니다. 답변은 말뭉치에 있지만 질문에서 이름을 지정하지 않은 엔티티로 연결된 여러 구절에 걸쳐 있습니다. 일반적인 해결책은 그래프 데이터베이스를 추가하는 것인데, 이는 하나의 시스템이 아닌 두 개의 시스템을 실행하는 것을 의미합니다.</p>
<p>저희는 이 벽에 계속 부딪혔고, 이를 처리하기 위해 두 개의 데이터베이스를 실행하고 싶지 않았습니다. 그래서 가장 널리 채택된 오픈 소스 벡터 데이터베이스인 <a href="https://milvus.io/docs">Milvus만을</a> 사용해 <a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">RAG에</a> 멀티홉 추론 기능을 제공하는 Python 라이브러리인 <a href="https://github.com/zilliztech/vector-graph-rag">Vector Graph RAG를</a> 구축하여 오픈 소스화했습니다. 이 라이브러리는 두 개의 데이터베이스가 아닌 하나의 데이터베이스로 동일한 멀티 홉 기능을 제공합니다.</p>
<iframe width="826" height="465" src="https://www.youtube.com/embed/yCooOl-koxc" title="Stop Using Graph Database to Build Your Graph RAG System — Vector Graph RAG Explained" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
<h2 id="Why-Multi-Hop-Questions-Break-Standard-RAG" class="common-anchor-header">멀티 홉 문제가 표준 RAG를 깨는 이유<button data-href="#Why-Multi-Hop-Questions-Break-Standard-RAG" class="anchor-icon" translate="no">
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
    </button></h2><p>멀티홉 질문은 벡터 검색이 볼 수 없는 엔티티 관계에 따라 답변이 달라지기 때문에 표준 RAG를 깨뜨립니다. 질문과 답변을 연결하는 브리지 엔티티는 질문 자체에 없는 경우가 많습니다.</p>
<p>간단한 질문은 잘 작동합니다. 문서를 청크로 묶고, 임베드하고, 가장 가까운 일치 항목을 검색하여 LLM에 공급하면 됩니다. "Milvus는 어떤 인덱스를 지원하나요?"라는 질문이 한 구절에 있으면 벡터 검색이 이를 찾아냅니다.</p>
<p>멀티홉 질문은 이러한 패턴에 맞지 않습니다. 의학 지식 베이스에서 <em>"1차 당뇨병 치료제를 사용할 때 주의해야 할 부작용은 무엇인가요?"</em> 와 같은 질문을 예로 들어 보겠습니다.</p>
<p>이 질문에 답하려면 두 가지 추론 단계를 거쳐야 합니다. 먼저 시스템은 메트포르민이 당뇨병의 1차 치료제라는 사실을 알아야 합니다. 그래야만 메트포르민의 부작용인 신장 기능 모니터링, 위장관 불편, 비타민 B12 결핍을 찾아볼 수 있습니다.</p>
<p>"메트포르민"은 브리지 엔티티입니다. 질문과 답변을 연결하지만 질문에는 언급되어 있지 않습니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/vector_graph_rag_without_graph_database_md_2_8e769cbe40.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>여기서 <a href="https://zilliz.com/learn/vector-similarity-search">벡터 유사도 검색이</a> 멈춥니다. 질문과 유사한 구절, 당뇨병 치료 가이드 및 약물 부작용 목록은 검색하지만 이러한 구절을 서로 연결하는 엔티티 관계를 추적할 수는 없습니다. "메트포르민은 당뇨병의 1차 약이다"와 같은 사실은 단일 구절의 텍스트가 아니라 이러한 관계에 존재합니다.</p>
<h2 id="Why-Graph-Databases-and-Agentic-RAG-Arent-the-Answer" class="common-anchor-header">그래프 데이터베이스와 에이전트 RAG가 정답이 아닌 이유<button data-href="#Why-Graph-Databases-and-Agentic-RAG-Arent-the-Answer" class="anchor-icon" translate="no">
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
    </button></h2><p>멀티홉 RAG를 해결하는 표준 방법은 그래프 데이터베이스와 반복 에이전트 루프입니다. 둘 다 효과가 있습니다. 두 가지 모두 대부분의 팀이 단일 기능에 지불하고자 하는 것보다 더 많은 비용이 듭니다.</p>
<p>먼저 그래프 데이터베이스 경로를 선택하세요. 문서에서 트리플을 추출하여 그래프 데이터베이스에 저장하고 에지를 탐색하여 멀티홉 연결을 찾습니다. 즉, <a href="https://zilliz.com/learn/what-is-vector-database">벡터 데이터베이스와</a> 함께 두 번째 시스템을 실행하고 Cypher 또는 Gremlin을 학습하며 그래프와 벡터 저장소를 동기화 상태로 유지해야 합니다.</p>
<p>반복 에이전트 루프는 다른 접근 방식입니다. LLM은 배치를 검색하고, 이를 추론하고, 충분한 컨텍스트가 있는지 판단하고, 그렇지 않은 경우 다시 검색합니다. <a href="https://arxiv.org/abs/2212.10509">IRCoT</a> (Trivedi 외, 2023)는 쿼리당 3~5회의 LLM 호출을 수행합니다. 에이전트가 중단 시점을 결정하기 때문에 에이전트 RAG는 10을 초과할 수 있습니다. 쿼리당 비용은 예측할 수 없게 되고 에이전트가 추가 라운드를 실행할 때마다 P99 지연 시간이 급증합니다.</p>
<p>스택을 재구축하지 않고 멀티홉 추론을 원하는 팀에는 둘 다 적합하지 않습니다. 그래서 우리는 다른 방법을 시도했습니다.</p>
<h2 id="What-is-Vector-Graph-RAG-a-Graph-Structure-Inside-a-Vector-Database" class="common-anchor-header">벡터 데이터베이스 내부의 그래프 구조, 벡터 그래프 RAG란?<button data-href="#What-is-Vector-Graph-RAG-a-Graph-Structure-Inside-a-Vector-Database" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://github.com/zilliztech/vector-graph-rag"><strong>Vector Graph RAG는</strong></a> <a href="https://milvus.io/docs">Milvus만을</a> 사용해 멀티홉 추론을 <a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">RAG에</a> 제공하는 오픈 소스 Python 라이브러리입니다. 이 라이브러리는 그래프 구조를 세 개의 Milvus 컬렉션에 ID 참조로 저장합니다. 탐색은 그래프 데이터베이스에 대한 Cypher 쿼리 대신 Milvus에서 기본 키 조회 체인으로 이루어집니다. 하나의 Milvus가 두 가지 작업을 모두 수행합니다.</p>
<p>지식 그래프의 관계는 단지 텍스트이기 때문에 작동합니다. 트리플 <em>(메트포르민, 제2형 당뇨병의 1차 치료제)은</em> 그래프 데이터베이스에서 방향이 지정된 에지입니다. 또한 하나의 문장이기도 합니다: "메트포르민은 제2형 당뇨병의 1차 치료제입니다." 이 문장을 벡터로 임베드하여 다른 텍스트와 동일하게 <a href="https://milvus.io/docs">Milvus에</a> 저장할 수 있습니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/vector_graph_rag_without_graph_database_md_3_da1305389a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>멀티홉 쿼리에 응답한다는 것은 쿼리에 언급된 내용(예: "당뇨병")에서 언급되지 않은 내용(예: "메트포르민")까지 연결을 따라가는 것을 의미합니다. 이는 스토리지가 이러한 연결, 즉 어떤 엔티티가 어떤 관계를 통해 어떤 엔티티에 연결되는지를 보존하는 경우에만 작동합니다. 일반 텍스트는 검색은 가능하지만 팔로우할 수는 없습니다.</p>
<p>Milvus에서는 연결을 추적 가능하게 유지하기 위해 각 엔티티와 각 관계에 고유 ID를 부여한 다음 ID로 서로를 참조하는 별도의 컬렉션에 저장합니다. 총 3개의 컬렉션: <strong>엔티티</strong> (노드), <strong>관계</strong> (에지), <strong>구절</strong> (LLM이 답변 생성에 필요한 소스 텍스트). 모든 행에는 벡터가 임베딩되어 있으므로 이 세 가지 중 어느 것이든 의미론적으로 검색할 수 있습니다.</p>
<p><strong>엔티티는</strong> 중복 제거된 엔티티를 저장합니다. 각 엔티티에는 고유 ID, <a href="https://zilliz.com/glossary/semantic-search">시맨틱 검색을</a> 위한 <a href="https://zilliz.com/glossary/vector-embeddings">벡터 임베딩</a>, 참여하는 관계 ID 목록이 있습니다.</p>
<table>
<thead>
<tr><th>id</th><th>name</th><th>임베딩</th><th>relation_ids</th></tr>
</thead>
<tbody>
<tr><td>e01</td><td>metformin</td><td>[0.12, ...]</td><td>[R01, R02, R03]</td></tr>
<tr><td>e02</td><td>제 2 형 당뇨병</td><td>[0.34, ...]</td><td>[R01, R04]</td></tr>
<tr><td>e03</td><td>신장 기능</td><td>[0.56, ...]</td><td>[r02]</td></tr>
</tbody>
</table>
<p><strong>관계</strong> 저장소 지식은 세 가지로 나뉩니다. 각각은 주제 및 개체 엔티티 ID, 출처가 된 구절 ID, 전체 관계 텍스트의 임베딩을 기록합니다.</p>
<table>
<thead>
<tr><th>id</th><th>subject_id</th><th>object_id</th><th>text</th><th>임베딩</th><th>passage_ids</th></tr>
</thead>
<tbody>
<tr><td>r01</td><td>e01</td><td>e02</td><td>메트포르민은 제 2형 당뇨병의 1차 치료제입니다.</td><td>[0.78, ...]</td><td>[p01]</td></tr>
<tr><td>r02</td><td>e01</td><td>e03</td><td>메트포르민을 복용하는 환자는 신장 기능을 모니터링해야 합니다.</td><td>[0.91, ...]</td><td>[p02]</td></tr>
</tbody>
</table>
<p><strong>구절은</strong> 원본 문서 청크와 거기에서 추출된 엔티티 및 관계에 대한 참조를 저장합니다.</p>
<p>이 세 컬렉션은 ID 필드를 통해 서로를 가리킵니다. 개체는 관계의 ID를, 관계는 주체와 객체 개체의 ID와 소스 구절을, 구절은 거기에서 추출된 모든 것의 ID를 담고 있습니다. 이러한 ID 참조의 네트워크가 바로 그래프입니다.</p>
<p>트래버스란 ID 조회의 체인에 불과합니다. 엔터티 e01을 가져와서 <code translate="no">relation_ids</code> 을 얻고, 해당 ID로 관계 r01과 r02를 가져오고, r01의 <code translate="no">object_id</code> 을 읽어 엔터티 e02를 발견하고, 계속 진행합니다. 각 홉은 표준 Milvus <a href="https://milvus.io/docs/get-and-scalar-query.md">기본 키 쿼리입니다</a>. 사이퍼가 필요하지 않습니다.</p>
<p>Milvus에 대한 추가 왕복이 합산되는지 궁금할 수 있습니다. 그렇지 않습니다. 하위 그래프 확장은 총 20~30ms에 달하는 2~3개의 ID 기반 쿼리가 필요합니다. LLM 호출은 1~3초가 걸리므로 그 옆에서 ID 조회가 보이지 않습니다.</p>
<h2 id="How-Vector-Graph-RAG-Answers-a-Multi-Hop-Query" class="common-anchor-header">벡터 그래프 RAG가 멀티홉 쿼리에 응답하는 방법<button data-href="#How-Vector-Graph-RAG-Answers-a-Multi-Hop-Query" class="anchor-icon" translate="no">
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
    </button></h2><p>검색 흐름은 <strong>시드 검색 → 하위 그래프 확장 → LLM 재순위 지정 → 답변 생성의</strong> 4단계로 멀티홉 쿼리를 근거가 있는 답변으로 가져옵니다 <strong>.</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/vector_graph_rag_without_graph_database_md_4_86ccf5b914.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>당뇨병 관련 질문을 살펴보겠습니다: <em>"1차 당뇨병 치료제로 어떤 부작용을 주의해야 하나요?"</em></p>
<h3 id="Step-1-Seed-Retrieval" class="common-anchor-header">1단계: 시드 검색</h3><p>LLM은 질문에서 핵심 엔터티를 추출합니다: "당뇨병", "부작용", "1차 약물". Milvus의 벡터 검색은 가장 관련성이 높은 엔터티와 관계를 직접 찾아냅니다.</p>
<p>하지만 메트포르민은 그 중 하나가 아닙니다. 질문에 언급되어 있지 않으므로 벡터 검색이 찾을 수 없습니다.</p>
<h3 id="Step-2-Subgraph-Expansion" class="common-anchor-header">2단계: 하위 그래프 확장</h3><p>이 단계는 벡터 그래프 RAG가 표준 RAG와 갈라지는 지점입니다.</p>
<p>이 시스템은 시드 엔티티에서 한 홉 떨어진 곳에서 ID 참조를 따릅니다. 시드 엔티티 ID를 가져오고, 해당 ID를 포함하는 모든 관계를 찾은 다음, 새 엔티티 ID를 하위 그래프로 가져옵니다. 기본값: 한 홉.</p>
<p><strong>브리지 엔터티인 Metformin이 하위 그래프에 들어옵니다.</strong></p>
<p>"당뇨병"에는 관계가 있습니다: <em>"메트포르민은 제2형 당뇨병의 1차 치료제입니다."</em> 이 가장자리를 따라가면 메트포르민이 들어옵니다. 메트포르민이 하위 그래프에 들어오면 자체 관계도 함께 들어옵니다: <em>"메트포르민을 복용하는 환자는 신장 기능을 모니터링해야 합니다.", "메트포르민은 위장 장애를 일으킬 수 있습니다.", "메트포르민을 장기간 사용하면 비타민 B12 결핍을 초래할 수 있습니다.".</em></p>
<p>별도의 구절에 있던 두 사실이 이제 한 홉의 그래프 확장을 통해 연결됩니다. 이제 질문에서 언급하지 않았던 브리지 엔티티를 발견할 수 있습니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/vector_graph_rag_without_graph_database_md_5_8ac4a11d1c.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-3-LLM-Rerank" class="common-anchor-header">3단계: LLM 재순위 지정</h3><p>확장을 하면 수십 개의 후보 관계가 남습니다. 대부분은 노이즈입니다.</p>
<pre><code translate="no">Expanded candidate pool (example):
r01: Metformin <span class="hljs-keyword">is</span> the first-line drug <span class="hljs-keyword">for</span> <span class="hljs-built_in">type</span> <span class="hljs-number">2</span> diabetes          ← Key
r02: Patients on metformin should have kidney function monitored   ← Key
r03: Metformin may cause gastrointestinal discomfort               ← Key
r04: <span class="hljs-type">Type</span> <span class="hljs-number">2</span> diabetes patients should have regular eye exams        ✗ Noise
r05: Insulin injection sites should be rotated                     ✗ Noise
r06: Diabetes <span class="hljs-keyword">is</span> linked to cardiovascular disease risk             ✗ Noise
r07: Metformin <span class="hljs-keyword">is</span> contraindicated <span class="hljs-keyword">in</span> severe liver dysfunction      ✗ Noise (contraindication, <span class="hljs-keyword">not</span> side effect)
r08: HbA1c <span class="hljs-keyword">is</span> a monitoring indicator <span class="hljs-keyword">for</span> diabetes                  ✗ Noise
r09: Sulfonylureas are second-line treatment <span class="hljs-keyword">for</span> <span class="hljs-built_in">type</span> <span class="hljs-number">2</span> diabetes   ✗ Noise (second-line, <span class="hljs-keyword">not</span> first-line)
r10: Long-term metformin use may lead to vitamin B12 deficiency    ← Key
...(more)
<button class="copy-code-btn"></button></code></pre>
<p>시스템은 이러한 후보 관계와 원래 질문인 "1차 당뇨병 약의 부작용과 관련된 것은?"이라는 질문을 LLM으로 보냅니다. 반복 없이 한 번만 호출하면 됩니다.</p>
<pre><code translate="no">After LLM filtering:
✓ r01: Metformin <span class="hljs-keyword">is</span> the first-line drug <span class="hljs-keyword">for</span> <span class="hljs-built_in">type</span> <span class="hljs-number">2</span> diabetes          → Establishes the bridge: first-line drug = metformin
✓ r02: Patients on metformin should have kidney function monitored   → Side effect: kidney impact
✓ r03: Metformin may cause gastrointestinal discomfort               → Side effect: GI issues
✓ r10: Long-term metformin use may lead to vitamin B12 deficiency    → Side effect: nutrient deficiency
<button class="copy-code-btn"></button></code></pre>
<p>선택된 관계는 당뇨병 → 메트포르민 → 신장 모니터링 / 위장관 불편함 / B12 결핍의 전체 사슬을 포괄합니다.</p>
<h3 id="Step-4-Answer-Generation" class="common-anchor-header">4단계: 답변 생성</h3><p>시스템이 선택한 관계에 대한 원본 구절을 검색하여 LLM으로 보냅니다.</p>
<p>LLM은 잘린 삼중문이 아닌 전체 구절 텍스트에서 생성합니다. 트리플은 압축된 요약입니다. 여기에는 LLM이 근거 있는 답을 생성하는 데 필요한 문맥, 주의 사항 및 세부 정보가 없습니다.</p>
<h3 id="See-Vector-Graph-RAG-in-action" class="common-anchor-header">벡터 그래프 RAG 실제로 보기</h3><p>또한 각 단계를 시각화하는 대화형 프론트엔드도 구축했습니다. 왼쪽의 단계 패널을 클릭하면 그래프가 실시간으로 업데이트됩니다. 시드 노드는 주황색, 확장된 노드는 파란색, 선택한 관계는 녹색으로 표시됩니다. 검색 흐름을 추상적이지 않고 구체적으로 보여줍니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/vector_graph_rag_without_graph_database_md_6_f6d8b1e841.gif" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Why-One-Rerank-Beats-Multiple-Iterations" class="common-anchor-header">한 번의 재랭크가 여러 번의 반복을 능가하는 이유<button data-href="#Why-One-Rerank-Beats-Multiple-Iterations" class="anchor-icon" translate="no">
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
    </button></h2><p>저희 파이프라인은 쿼리당 한 번은 재랭크, 한 번은 생성에 대해 두 번의 LLM 호출을 수행합니다. 검색, 추론, 다시 검색을 반복하기 때문에 IRCoT나 에이전틱 RAG와 같은 반복 시스템은 3~10회 이상의 호출을 실행합니다. 벡터 검색과 서브그래프 확장은 의미적 유사성과 구조적 연결을 모두 한 번에 처리하기 때문에 한 번의 재랭크에서 LLM에 충분한 후보를 제공하기 때문에 루프를 건너뜁니다.</p>
<table>
<thead>
<tr><th>접근 방식</th><th>쿼리당 LLM 호출 수</th><th>지연 시간 프로필</th><th>상대적 API 비용</th></tr>
</thead>
<tbody>
<tr><td>벡터 그래프 RAG</td><td>2(재랭크 + 생성)</td><td>고정, 예측 가능</td><td>1x</td></tr>
<tr><td>IRCoT</td><td>3-5</td><td>가변</td><td>~2-3x</td></tr>
<tr><td>에이전트 RAG</td><td>5-10+</td><td>예측 불가능</td><td>~3-5x</td></tr>
</tbody>
</table>
<p>프로덕션 환경에서는 약 60% 낮은 API 비용, 2~3배 빠른 응답, 예측 가능한 지연 시간을 제공합니다. 에이전트가 추가 라운드를 실행하기로 결정했을 때 예상치 못한 급증이 발생하지 않습니다.</p>
<h2 id="Benchmark-Results" class="common-anchor-header">벤치마크 결과<button data-href="#Benchmark-Results" class="anchor-icon" translate="no">
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
    </button></h2><p>벡터 그래프 RAG는 3개의 표준 멀티홉 QA 벤치마크에서 평균 87.8%의 Recall@5를 기록했으며, Milvus와 2개의 LLM 호출만으로 HippoRAG 2를 포함하여 테스트한 모든 방법과 일치하거나 그 이상의 결과를 보였습니다.</p>
<p>MuSiQue(가장 어려운 2-4홉), HotpotQA(가장 널리 사용되는 2홉), 2WikiMultiHopQA(2홉, 문서 간 추론)에서 평가했습니다. 측정 지표는 Recall@5로, 검색된 상위 5개 결과에서 올바른 근거 구절이 나타나는지 여부입니다.</p>
<p>공정한 비교를 위해 <a href="https://github.com/OSU-NLP-Group/HippoRAG">HippoRAG 리포지토리에서</a> 미리 추출된 동일한 트리플을 사용했습니다. 재추출이나 사용자 정의 전처리를 하지 않았습니다. 이 비교는 검색 알고리즘 자체를 분리하여 진행했습니다.</p>
<h3 id="Vector-Graph-RAGhttpsgithubcomzilliztechvector-graph-rag-vs-Standard-Naive-RAG" class="common-anchor-header"><a href="https://github.com/zilliztech/vector-graph-rag">벡터 그래프 RAG와</a> 표준(나이브) RAG 비교</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/vector_graph_rag_without_graph_database_md_7_61772e68c8.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>벡터 그래프 RAG는 평균 Recall@5를 73.4%에서 87.8%로 19.6% 포인트 향상시켰습니다.</p>
<ul>
<li>MuSiQue: 가장 큰 상승폭(+31.4%p). 3-4 홉 벤치마크, 가장 어려운 멀티홉 문제, 그리고 서브그래프 확장이 가장 큰 영향을 미치는 부분.</li>
<li>2WikiMultiHopQA: 급격한 개선(+27.7점). 하위 그래프 확장을 위한 또 다른 장점인 교차 문서 추론.</li>
<li>HotpotQA: 더 작은 상승(+6.1pp)이었지만 표준 RAG는 이 데이터 세트에서 이미 90.8%의 점수를 받았습니다. 한계가 낮습니다.</li>
</ul>
<h3 id="Vector-Graph-RAGhttpsgithubcomzilliztechvector-graph-rag-vs-State-of-the-Art-Methods-SOTA" class="common-anchor-header"><a href="https://github.com/zilliztech/vector-graph-rag">벡터 그래프 RAG와</a> 최신 방법(SOTA) 비교</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/vector_graph_rag_without_graph_database_md_8_2a0b90b574.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>평균 점수는 87.8%로 HippoRAG 2, IRCoT, NV-Embed-v2에 비해 Vector Graph RAG가 가장 높았습니다.</p>
<p>벤치마크별 비교:</p>
<ul>
<li>HotpotQA: HippoRAG 2와 동점(둘 다 96.3%)</li>
<li>2WikiMultiHopQA: 3.7점 차이로 앞서고 있음(94.1% 대 90.4%)</li>
<li>MuSiQue(가장 어려운): 1.7% 포인트 차이(73.0% 대 74.7%)</li>
</ul>
<p>Vector Graph RAG는 쿼리당 단 2개의 LLM 호출, 그래프 데이터베이스, ColBERTv2 없이도 이러한 수치를 달성합니다. 비교 대상 중 가장 단순한 인프라에서 실행되지만 여전히 가장 높은 평균을 기록합니다.</p>
<h2 id="How-Vector-Graph-RAGhttpsgithubcomzilliztechvector-graph-rag-Compares-to-Other-Graph-RAG-Approaches" class="common-anchor-header"><a href="https://github.com/zilliztech/vector-graph-rag">벡터 그래프 RAG가</a> 다른 그래프 RAG 접근 방식과 비교하는 방법<button data-href="#How-Vector-Graph-RAGhttpsgithubcomzilliztechvector-graph-rag-Compares-to-Other-Graph-RAG-Approaches" class="anchor-icon" translate="no">
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
    </button></h2><p>그래프 RAG 접근 방식은 각기 다른 문제에 최적화되어 있습니다. Vector Graph RAG는 예측 가능한 비용과 간단한 인프라로 프로덕션 멀티홉 QA를 위해 구축되었습니다.</p>
<table>
<thead>
<tr><th></th><th>Microsoft GraphRAG</th><th>HippoRAG 2</th><th>IRCoT/에이전트 RAG</th><th><strong>벡터 그래프 RAG</strong></th></tr>
</thead>
<tbody>
<tr><td><strong>인프라</strong></td><td>그래프 DB + 벡터 DB</td><td>ColBERTv2 + 인메모리 그래프</td><td>벡터 DB + 멀티 라운드 에이전트</td><td><strong>밀버스만</strong></td></tr>
<tr><td><strong>쿼리당 LLM 호출 수</strong></td><td>다양</td><td>보통</td><td>3-10+</td><td><strong>2</strong></td></tr>
<tr><td><strong>최상의 용도</strong></td><td>글로벌 코퍼스 요약</td><td>세분화된 학술 검색</td><td>복잡한 개방형 탐색</td><td><strong>프로덕션 멀티홉 QA</strong></td></tr>
<tr><td><strong>확장 문제</strong></td><td>고가의 LLM 색인</td><td>메모리 내 전체 그래프</td><td>예측할 수 없는 지연 시간 및 비용</td><td><strong>Milvus로 확장</strong></td></tr>
<tr><td><strong>설정 복잡성</strong></td><td>높음</td><td>중간 높음</td><td>중간</td><td><strong>낮음(핍 설치)</strong></td></tr>
</tbody>
</table>
<p><a href="https://github.com/microsoft/graphrag">Microsoft GraphRAG는</a> 계층적 커뮤니티 클러스터링을 사용하여 '이 코퍼스 전반의 주요 테마는 무엇인가'와 같은 글로벌 요약 질문에 답합니다. 이는 멀티홉 QA와는 다른 문제입니다.&quot;</p>
<p><a href="https://arxiv.org/abs/2502.14802">HippoRAG 2</a> (구티에레즈 외., 2025)는 콜버트v2 토큰 수준 매칭과 함께 인지적 영감을 받은 검색을 사용합니다. 전체 그래프를 메모리에 로드하면 확장성이 제한됩니다.</p>
<p><a href="https://arxiv.org/abs/2212.10509">IRCoT와</a> 같은 반복적 접근 방식은 인프라 간소화를 위해 LLM 비용과 예측할 수 없는 지연 시간을 감수해야 합니다.</p>
<p>그래프 데이터베이스를 추가하지 않고도 예측 가능한 비용과 지연 시간을 원하는 팀, 즉 프로덕션 멀티홉 QA를 대상으로 합니다.</p>
<h2 id="When-to-Use-Vector-Graph-RAG-and-Key-Use-Cases" class="common-anchor-header">Vector Graph RAG의 사용 시기 및 주요 사용 사례<button data-href="#When-to-Use-Vector-Graph-RAG-and-Key-Use-Cases" class="anchor-icon" translate="no">
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
    </button></h2><p>Vector Graph RAG는 네 가지 종류의 워크로드를 위해 구축되었습니다:</p>
<table>
<thead>
<tr><th>시나리오</th><th>적합한 이유</th></tr>
</thead>
<tbody>
<tr><td><strong>지식이 밀집된 문서</strong></td><td>상호 참조가 있는 법률 코드, 약물-유전자-질병 체인이 있는 생의학 문헌, 회사-사람-사건 링크가 있는 재무 서류, API 종속성 그래프가 있는 기술 문서</td></tr>
<tr><td><strong>2~4홉 질문</strong></td><td>원홉 질문은 표준 RAG에서 잘 작동합니다. 5개 이상의 홉은 반복적인 방법이 필요할 수 있습니다. 2~4홉 범위는 하위 그래프 확장의 최적 지점입니다.</td></tr>
<tr><td><strong>간단한 배포</strong></td><td>하나의 데이터베이스, 하나의 <code translate="no">pip install</code>, 학습할 그래프 인프라가 없습니다.</td></tr>
<tr><td><strong>비용 및 지연 시간 민감도</strong></td><td>쿼리당 두 번의 LLM 호출, 고정적이고 예측 가능. 매일 수천 건의 쿼리가 발생하면 그 차이는 더욱 커집니다.</td></tr>
</tbody>
</table>
<h2 id="Get-Started-with-Vector-Graph-RAG" class="common-anchor-header">벡터 그래프 RAG 시작하기<button data-href="#Get-Started-with-Vector-Graph-RAG" class="anchor-icon" translate="no">
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
    </button></h2><pre><code translate="no" class="language-bash">pip install vector-graph-rag

<span class="hljs-keyword">from</span> vector_graph_rag <span class="hljs-keyword">import</span> VectorGraphRAG

rag = VectorGraphRAG()  <span class="hljs-comment"># defaults to Milvus Lite, no server needed</span>

rag.add_texts([
    <span class="hljs-string">&quot;Metformin is the first-line drug for type 2 diabetes.&quot;</span>,
    <span class="hljs-string">&quot;Patients taking metformin should have their kidney function monitored regularly.&quot;</span>,
])

result = rag.query(<span class="hljs-string">&quot;What side effects should I watch for with first-line diabetes drugs?&quot;</span>)
<span class="hljs-built_in">print</span>(result.answer)
<button class="copy-code-btn"></button></code></pre>
<p><code translate="no">VectorGraphRAG()</code> 인수가 없는 경우 기본값은 <a href="https://milvus.io/docs/milvus_lite.md">Milvus Lite입니다</a>. SQLite와 같은 로컬 <code translate="no">.db</code> 파일을 생성합니다. 시작할 서버도 없고 구성할 것도 없습니다.</p>
<p><code translate="no">add_texts()</code> 는 LLM을 호출하여 텍스트에서 트리플을 추출하고 벡터화한 다음 모든 것을 Milvus에 저장합니다. <code translate="no">query()</code> 은 시드, 확장, 재랭크, 생성의 전체 4단계 검색 플로우를 실행합니다.</p>
<p>프로덕션에서는 URI 매개변수 하나를 교체합니다. 나머지 코드는 동일하게 유지됩니다:</p>
<pre><code translate="no" class="language-python"><span class="hljs-comment"># Local development</span>
rag = VectorGraphRAG()

<span class="hljs-comment"># Self-hosted Milvus</span>
rag = VectorGraphRAG(uri=<span class="hljs-string">&quot;http://your-milvus-server:19530&quot;</span>)

<span class="hljs-comment"># Zilliz Cloud (managed Milvus, free tier available)</span>
rag = VectorGraphRAG(uri=<span class="hljs-string">&quot;your-zilliz-endpoint&quot;</span>, token=<span class="hljs-string">&quot;your-api-key&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>PDF, 웹 페이지 또는 Word 파일을 가져오려면:</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> vector_graph_rag.loaders <span class="hljs-keyword">import</span> DocumentImporter

importer = DocumentImporter(chunk_size=<span class="hljs-number">1000</span>, chunk_overlap=<span class="hljs-number">200</span>)
result = importer.import_sources([
    <span class="hljs-string">&quot;https://en.wikipedia.org/wiki/Metformin&quot;</span>,
    <span class="hljs-string">&quot;/path/to/clinical-guidelines.pdf&quot;</span>,
])
rag.add_documents(result.documents, extract_triplets=<span class="hljs-literal">True</span>)
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
    </button></h2><p>그래프 RAG에는 그래프 데이터베이스가 필요하지 않습니다. Vector Graph RAG는 그래프 구조를 3개의 Milvus 컬렉션에 ID 참조로 저장하여 그래프 탐색을 기본 키 조회로 전환하고 모든 멀티홉 쿼리를 고정된 두 개의 LLM 호출로 유지합니다.</p>
<p>한눈에 보기:</p>
<ul>
<li>오픈 소스 Python 라이브러리. Milvus만으로도 멀티홉 추론이 가능합니다.</li>
<li>ID로 연결된 세 가지 컬렉션. 엔티티(노드), 관계(에지), 구절(소스 텍스트). 하위 그래프 확장은 ID를 따라 쿼리에 언급되지 않은 브리지 엔티티를 발견합니다.</li>
<li>쿼리당 두 번의 LLM 호출. 한 번의 재랭크, 한 번의 생성. 반복 없음.</li>
<li>MuSiQue, HotpotQA, 2WikiMultiHopQA에서 87.8%의 평균 Recall@5로, 3개 중 2개에서 HippoRAG 2와 일치하거나 이를 능가합니다.</li>
</ul>
<h3 id="Try-it" class="common-anchor-header">사용해 보세요:</h3><ul>
<li><a href="https://github.com/zilliztech/vector-graph-rag">깃허브: zilliztech/vector-graph-rag에서</a> 코드를 확인하세요.</li>
<li>전체 API 및 예제에 대한<a href="https://zilliztech.github.io/vector-graph-rag">문서</a> </li>
<li><a href="https://slack.milvus.io/">Discord의</a> <a href="https://slack.milvus.io/">Milvus</a> <a href="https://discord.com/invite/8uyFbECzPX">커뮤니티에</a> 가입하여 질문하고 피드백을 공유하세요.</li>
<li><a href="https://milvus.io/office-hours">Milvus 오피스 아워 세션을 예약하여</a> 사용 사례를 살펴보세요.</li>
<li>인프라 설정을 건너뛰고 싶으시다면<a href="https://cloud.zilliz.com/signup">질리즈 클라우드에서</a> 관리형 Milvus 무료 티어를 제공합니다.</li>
</ul>
<h2 id="FAQ" class="common-anchor-header">FAQ<button data-href="#FAQ" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Can-I-do-Graph-RAG-with-just-a-vector-database" class="common-anchor-header">벡터 데이터베이스만으로 그래프 RAG를 사용할 수 있나요?</h3><p>네. 벡터 그래프 RAG는 지식 그래프 구조(엔티티, 관계 및 이들의 연결)를 ID 상호 참조로 연결된 3개의 Milvus 컬렉션 안에 저장합니다. 그래프 데이터베이스의 에지를 트래버스하는 대신 Milvus에서 기본 키 조회를 체인화하여 시드 엔티티를 중심으로 하위 그래프를 확장합니다. 그래프 데이터베이스 인프라 없이도 3개의 표준 멀티홉 벤치마크에서 평균 87.8%의 Recall@5를 달성했습니다.</p>
<h3 id="How-does-Vector-Graph-RAG-compare-to-Microsoft-GraphRAG" class="common-anchor-header">벡터 그래프 RAG는 Microsoft GraphRAG와 어떻게 비교되나요?</h3><p>서로 다른 문제를 해결합니다. Microsoft GraphRAG는 글로벌 코퍼스 요약("이 문서들의 주요 주제는 무엇인가요?")을 위해 계층적 커뮤니티 클러스터링을 사용합니다. Vector Graph RAG는 여러 구절에 걸쳐 특정 사실을 연결하는 것이 목표인 다중 홉 질문 답변에 중점을 둡니다. Vector Graph RAG는 쿼리당 Milvus와 두 번의 LLM 호출만 필요합니다. Microsoft GraphRAG는 그래프 데이터베이스가 필요하며 인덱싱 비용이 더 높습니다.</p>
<h3 id="What-types-of-questions-benefit-from-multi-hop-RAG" class="common-anchor-header">멀티홉 RAG는 어떤 유형의 질문에 도움이 되나요?</h3><p>멀티홉 RAG는 여러 구절에 흩어져 있는 정보를 연결해야 답을 구할 수 있는 질문, 특히 핵심 개체가 질문에 전혀 나타나지 않는 경우에 유용합니다. 예를 들면 "1차 당뇨병 약에는 어떤 부작용이 있나요?"와 같은 질문이 있습니다. (브리지로 메트포르민을 찾아야 함), 법률 또는 규정 텍스트의 상호 참조 조회, 기술 문서의 종속성 체인 추적 등이 있습니다. 표준 RAG는 단일 팩트 조회를 잘 처리합니다. 멀티홉 RAG는 추론 경로가 2~4단계일 때 가치를 더합니다.</p>
<h3 id="Do-I-need-to-extract-knowledge-graph-triples-manually" class="common-anchor-header">지식 그래프 트리플을 수동으로 추출해야 하나요?</h3><p>아니요. <code translate="no">add_texts()</code> 및 <code translate="no">add_documents()</code> 에서는 자동으로 LLM을 호출하여 엔티티와 관계를 추출하고, 이를 벡터화하여 Milvus에 저장합니다. 기본 제공 <code translate="no">DocumentImporter</code> 을 사용하여 URL, PDF 및 DOCX 파일에서 문서를 가져올 수 있습니다. 벤치마킹 또는 마이그레이션을 위해 라이브러리는 HippoRAG와 같은 다른 프레임워크에서 미리 추출된 트리플을 가져올 수 있도록 지원합니다.</p>
