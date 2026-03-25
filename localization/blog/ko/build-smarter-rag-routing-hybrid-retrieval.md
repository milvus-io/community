---
id: build-smarter-rag-routing-hybrid-retrieval.md
title: '순진한 RAG를 넘어서: 쿼리 라우팅 및 하이브리드 검색으로 더 스마트한 시스템 구축하기'
author: Min Yin
date: 2026-3-25
cover: assets.zilliz.com/cover_beyond_naive_rag_7db83a08f9.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  RAG architecture, hybrid retrieval, query routing, vector search BM25, RAG
  evaluation
meta_title: |
  Build Smarter RAG with Routing and Hybrid Retrieval
desc: '최신 RAG 시스템이 쿼리 라우팅, 하이브리드 검색 및 단계별 평가를 사용하여 더 낮은 비용으로 더 나은 답변을 제공하는 방법을 알아보세요.'
origin: 'https://milvus.io/blog/build-smarter-rag-routing-hybrid-retrieval.md'
---
<p><a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">RAG</a> 파이프라인은 검색이 필요한지 여부에 관계없이 모든 쿼리에 대해 문서를 검색합니다. 코드, 자연어, 재무 보고서에 대해 동일한 유사성 검색을 실행합니다. 결과가 나쁘면 어느 단계에서 문제가 발생했는지 알 방법이 없습니다.</p>
<p>이는 모든 쿼리를 동일한 방식으로 처리하는 고정된 파이프라인인 순진한 RAG의 증상입니다. 최신 RAG 시스템은 다르게 작동합니다. 쿼리를 올바른 처리기로 라우팅하고, 여러 검색 방법을 결합하며, 각 단계를 독립적으로 평가합니다.</p>
<p>이 문서에서는 더 스마트한 RAG 시스템을 구축하기 위한 4노드 아키텍처를 살펴보고, 별도의 인덱스를 유지하지 않고 <a href="https://zilliz.com/learn/hybrid-search-a-practical-guide">하이브리드 검색을</a> 구현하는 방법을 설명하고, 각 파이프라인 단계를 평가하여 문제를 더 빠르게 디버그할 수 있는 방법을 보여드립니다.</p>
<h2 id="Why-Long-Context-Doesnt-Replace-RAG" class="common-anchor-header">긴 컨텍스트가 RAG를 대체할 수 없는 이유<button data-href="#Why-Long-Context-Doesnt-Replace-RAG" class="anchor-icon" translate="no">
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
    </button></h2><p>"그냥 프롬프트에 모든 것을 넣으세요"라는 말은 이제 모델이 128K 이상의 토큰 창을 지원하면서 흔히 하는 제안입니다. 이 방법은 두 가지 이유로 프로덕션 환경에서 적합하지 않습니다.</p>
<p><strong>비용은 쿼리가 아니라 지식창고에 따라 확장됩니다.</strong> 모든 요청은 모델을 통해 전체 지식창고를 전송합니다. 100,000개의 토큰 코퍼스의 경우, 답변이 한 문단이든 열 문단이든 상관없이 요청당 100,000개의 입력 토큰이 필요합니다. 월별 추론 비용은 말뭉치 크기에 따라 선형적으로 증가합니다.</p>
<p><strong>컨텍스트 길이에 따라 주의력이 저하됩니다.</strong> 모델은 긴 문맥에 묻혀 있는 관련 정보에 집중하는 데 어려움을 겪습니다. "중간에서 손실" 효과에 대한 연구(Liu et al., 2023)에 따르면 모델은 긴 입력의 중간에 위치한 정보를 놓칠 가능성이 더 높습니다. 더 큰 컨텍스트 창은 이 문제를 해결하지 못했습니다. 주의력 품질이 창 크기를 따라가지 못했기 때문입니다.</p>
<p>RAG는 생성 전에 관련 구절만 검색하여 두 가지 문제를 모두 방지합니다. 문제는 RAG가 필요한지 여부가 아니라 실제로 작동하는 RAG를 구축하는 방법입니다.</p>
<h2 id="Whats-Wrong-with-Traditional-RAG" class="common-anchor-header">기존 RAG의 문제점은 무엇인가요?<button data-href="#Whats-Wrong-with-Traditional-RAG" class="anchor-icon" translate="no">
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
    </button></h2><p>기존의 RAG는 쿼리를 임베드하고, <a href="https://zilliz.com/learn/what-is-vector-search">벡터 유사도 검색을</a> 실행하고, 상위 K 결과를 취하고, 답을 생성하는 고정된 파이프라인을 따릅니다. 모든 쿼리는 동일한 경로를 따릅니다.</p>
<p>여기에는 두 가지 문제가 발생합니다:</p>
<ol>
<li><p><strong>사소한 쿼리에 대한 컴퓨팅 낭비.</strong> "2 + 2는 무엇인가요?"라는 쿼리는 검색이 필요하지 않지만 시스템에서는 이를 실행하여 아무런 이점 없이 지연 시간과 비용만 추가합니다.</p></li>
<li><p><strong>복잡한 쿼리에 대한 취약한 검색.</strong> 모호한 구문, 동의어 또는 혼합 언어 쿼리는 종종 순수한 벡터 유사성을 무력화합니다. 검색에서 관련 문서를 놓치면 대체할 수 있는 대안 없이 생성 품질이 떨어집니다.</p></li>
</ol>
<p>해결 방법: 검색 전에 의사 결정 기능을 추가하세요. 최신 RAG 시스템은 매번 동일한 파이프라인을 맹목적으로 실행하는 대신 검색 <em>여부</em>, 검색 <em>대상</em>, 검색 <em>방법을</em> 결정합니다.</p>
<h2 id="How-Modern-RAG-Systems-Work-A-Four-Node-Architecture" class="common-anchor-header">최신 RAG 시스템의 작동 방식 4노드 아키텍처<button data-href="#How-Modern-RAG-Systems-Work-A-Four-Node-Architecture" class="anchor-icon" translate="no">
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
    </button></h2><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/build_smarter_rag_routing_hybrid_retrieval_1_058ab7eb6b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>최신 RAG 시스템은 고정된 파이프라인 대신 4개의 의사 결정 노드를 통해 각 쿼리를 라우팅합니다. 각 노드는 현재 쿼리를 처리하는 방법에 대한 하나의 질문에 답합니다.</p>
<h3 id="Node-1-Query-Routing--Does-This-Query-Need-Retrieval" class="common-anchor-header">노드 1: 쿼리 라우팅 - 이 쿼리에 검색이 필요한가?</h3><p>쿼리 라우팅은 파이프라인의 첫 번째 결정입니다. 이 노드는 들어오는 쿼리를 분류하여 적절한 경로로 보냅니다:</p>
<table>
<thead>
<tr><th>쿼리 유형</th><th>예제</th><th>조치</th></tr>
</thead>
<tbody>
<tr><td>상식/일반 지식</td><td>"2 + 2는 무엇인가요?"</td><td>LLM 건너뛰기 검색으로 직접 답변하기</td></tr>
<tr><td>지식 기반 질문</td><td>"Model X의 사양이 어떻게 되나요?"</td><td>검색 파이프라인으로 연결</td></tr>
<tr><td>실시간 정보</td><td>"이번 주말 파리 날씨"</td><td>외부 API 호출</td></tr>
</tbody>
</table>
<p>미리 라우팅하면 필요하지 않은 쿼리에 대한 불필요한 검색을 피할 수 있습니다. 쿼리의 대부분이 단순하거나 일반적인 지식인 시스템에서는 이것만으로도 컴퓨팅 비용을 크게 절감할 수 있습니다.</p>
<h3 id="Node-2-Query-Rewriting--What-Should-the-System-Search-For" class="common-anchor-header">노드 2: 쿼리 재작성 - 시스템에서 무엇을 검색해야 할까요?</h3><p>사용자 쿼리는 종종 모호합니다. "LightOn의 3분기 보고서의 주요 수치"와 같은 질문은 검색 쿼리로 잘 해석되지 않습니다.</p>
<p>쿼리 재작성은 원래 질문을 구조화된 검색 조건으로 변환합니다:</p>
<ul>
<li><strong>시간 범위:</strong> 2025년 7월 1일 - 9월 30일(3분기)</li>
<li><strong>문서 유형:</strong> 재무 보고서</li>
<li><strong>Entity:</strong> LightOn, 재무 부서</li>
</ul>
<p>이 단계는 사용자가 질문하는 방식과 검색 시스템이 문서를 색인하는 방식 사이의 간극을 메웁니다. 더 나은 쿼리는 관련 없는 결과가 줄어든다는 것을 의미합니다.</p>
<h3 id="Node-3-Retrieval-Strategy-Selection--How-Should-the-System-Search" class="common-anchor-header">노드 3: 검색 전략 선택 - 시스템은 어떻게 검색해야 할까요?</h3><p>콘텐츠 유형마다 다른 검색 전략이 필요합니다. 하나의 방법으로 모든 것을 커버할 수는 없습니다:</p>
<table>
<thead>
<tr><th>콘텐츠 유형</th><th>최상의 검색 방법</th><th>이유</th></tr>
</thead>
<tbody>
<tr><td>코드(변수 이름, 함수 서명)</td><td>어휘 검색<a href="https://zilliz.com/learn/mastering-bm25-a-deep-dive-into-the-algorithm-and-application-in-milvus">(BM25</a>)</td><td>정확한 키워드 매칭은 구조화된 토큰에서 잘 작동합니다.</td></tr>
<tr><td>자연어(문서, 기사)</td><td>시맨틱 검색(고밀도 벡터)</td><td>동의어, 의역, 의도 처리</td></tr>
<tr><td>멀티모달(차트, 다이어그램, 도면)</td><td>멀티모달 검색</td><td>텍스트 추출이 놓치는 시각적 구조 포착</td></tr>
</tbody>
</table>
<p>문서에는 색인 시점에 메타데이터가 태그됩니다. 쿼리 시 이러한 태그는 검색할 문서와 사용할 검색 방법을 모두 안내합니다.</p>
<h3 id="Node-4-Minimal-Context-Generation--How-Much-Context-Does-the-Model-Need" class="common-anchor-header">노드 4: 최소 컨텍스트 생성 - 모델에 얼마나 많은 컨텍스트가 필요한가?</h3><p>검색 및 <a href="https://zilliz.com/learn/optimize-rag-with-rerankers-the-role-and-tradeoffs">순위 재조정</a> 후, 시스템은 전체 문서가 아닌 가장 관련성이 높은 구절만 모델에 전송합니다.</p>
<p>이는 생각보다 중요한 문제입니다. 전체 문서를 로드할 때와 비교하여 관련 구절만 전달하면 토큰 사용량을 90% 이상 줄일 수 있습니다. 토큰 수가 적다는 것은 캐싱이 작동하는 경우에도 응답 속도가 빨라지고 비용이 절감된다는 것을 의미합니다.</p>
<h2 id="Why-Hybrid-Retrieval-Matters-for-Enterprise-RAG" class="common-anchor-header">엔터프라이즈 RAG에 하이브리드 검색이 중요한 이유<button data-href="#Why-Hybrid-Retrieval-Matters-for-Enterprise-RAG" class="anchor-icon" translate="no">
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
    </button></h2><p>실제로 검색 전략 선택(노드 3)은 대부분의 팀이 어려움을 겪는 부분입니다. 단일 검색 방법으로 모든 엔터프라이즈 문서 유형을 커버할 수 있는 것은 없습니다.</p>
<p>키워드 검색만으로도 충분하다고 주장하는 사람들도 있습니다. Claude Code의 grep 기반 코드 검색이 잘 작동하기 때문이죠. 하지만 코드는 고도로 구조화되어 있고 일관된 명명 규칙이 있습니다. 기업 문서는 다른 이야기입니다.</p>
<h3 id="Enterprise-Documents-Are-Messy" class="common-anchor-header">지저분한 엔터프라이즈 문서</h3><p><strong>동의어와 다양한 문구.</strong> "메모리 사용량 최적화"와 "메모리 사용량 감소"는 같은 의미이지만 서로 다른 단어를 사용합니다. 키워드 검색은 하나는 일치하고 다른 하나는 놓칩니다. 단어 세분화가 있는 중국어, 혼합 스크립트가 있는 일본어, 복합어가 있는 독일어와 같은 다국어 환경에서는 문제가 배가됩니다.</p>
<p><strong>시각적 구조가 중요합니다.</strong> 엔지니어링 도면은 레이아웃에 따라 달라집니다. 재무 보고서는 표에 의존합니다. 의료 이미지는 공간 관계에 따라 달라집니다. OCR은 텍스트를 추출하지만 구조를 잃게 됩니다. 텍스트 전용 검색으로는 이러한 문서를 안정적으로 처리할 수 없습니다.</p>
<h3 id="How-to-Implement-Hybrid-Retrieval" class="common-anchor-header">하이브리드 검색을 구현하는 방법</h3><p>하이브리드 검색은 여러 검색 방법(일반적으로 <a href="https://zilliz.com/learn/sparse-and-dense-embeddings">키워드 매칭을 위한 BM25와 시맨틱 검색을 위한 고밀도 벡터</a>)을 결합하여 두 방법만으로는 처리할 수 없는 부분을 처리합니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/build_smarter_rag_routing_hybrid_retrieval_2_7f305f024e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>기존의 접근 방식은 BM25용 시스템과 벡터 검색용 시스템, 두 개의 별도 시스템을 실행합니다. 각 쿼리는 두 가지 모두에 해당하며 결과는 나중에 병합됩니다. 이 방식은 작동하지만 실제 오버헤드가 발생합니다:</p>
<table>
<thead>
<tr><th></th><th>기존(별도의 시스템)</th><th>통합(단일 컬렉션)</th></tr>
</thead>
<tbody>
<tr><td>스토리지</td><td>두 개의 개별 인덱스</td><td>하나의 컬렉션, 두 가지 벡터 유형</td></tr>
<tr><td>데이터 동기화</td><td>두 시스템을 동기화 상태로 유지해야 합니다.</td><td>단일 쓰기 경로</td></tr>
<tr><td>쿼리 경로</td><td>두 개의 쿼리 + 결과 병합</td><td>하나의 API 호출, 자동 병합</td></tr>
<tr><td>조정</td><td>시스템 전반에서 병합 가중치 조정</td><td>하나의 쿼리에서 밀집/희소 가중치 변경</td></tr>
<tr><td>운영 복잡성</td><td>높음</td><td>낮음</td></tr>
</tbody>
</table>
<p><a href="https://milvus.io/">Milvus</a> 2.6은 동일한 컬렉션에서 밀도 벡터(시맨틱 검색용)와 스파스 벡터(BM25 스타일 키워드 검색용)를 모두 지원합니다. 단일 API 호출로 융합된 결과를 반환하며, 벡터 유형 간의 가중치를 변경하여 검색 동작을 조정할 수 있습니다. 별도의 인덱스나 동기화 문제, 병합 지연이 없습니다.</p>
<h2 id="How-to-Evaluate-a-RAG-Pipeline-Stage-by-Stage" class="common-anchor-header">RAG 파이프라인을 단계별로 평가하는 방법<button data-href="#How-to-Evaluate-a-RAG-Pipeline-Stage-by-Stage" class="anchor-icon" translate="no">
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
    </button></h2><p>최종 정답만 확인하는 것만으로는 충분하지 않습니다. RAG는 다단계 파이프라인이며, 어느 단계에서든 오류가 발생하면 다운스트림으로 전파됩니다. 답변 품질만 측정하면 문제가 라우팅, 재작성, 검색, 순위 재지정 또는 생성 중 어디에 있는지 알 수 없습니다.</p>
<p>사용자가 "부정확한 결과"를 보고하는 경우, 근본 원인은 라우팅이 검색을 건너뛰지 않아야 할 때 검색을 건너뛰거나, 쿼리 재작성이 주요 엔터티를 누락하거나, 검색이 관련 문서를 놓치거나, 재랭크가 좋은 결과를 묻거나, 모델이 검색된 컨텍스트를 완전히 무시할 수 있는 등 어디든 있을 수 있습니다.</p>
<p>각 단계를 자체 메트릭으로 평가하세요:</p>
<table>
<thead>
<tr><th>단계</th><th>메트릭</th><th>검색 대상</th></tr>
</thead>
<tbody>
<tr><td>라우팅</td><td>F1 점수</td><td>높은 오탐률 = 검색이 필요한 쿼리 건너뛰기</td></tr>
<tr><td>쿼리 재작성</td><td>엔티티 추출 정확도, 동의어 범위</td><td>재작성된 쿼리는 중요한 용어를 삭제하거나 의도를 변경합니다.</td></tr>
<tr><td>검색</td><td>Recall@K, NDCG@10</td><td>관련 문서가 검색되지 않거나 순위가 너무 낮음</td></tr>
<tr><td>재순위</td><td>정확도@3</td><td>상위 결과가 실제로 관련성이 없음</td></tr>
<tr><td>생성</td><td>충실도, 답변 완전성</td><td>모델이 검색된 컨텍스트를 무시하거나 부분적인 답변 제공</td></tr>
</tbody>
</table>
<p><strong>계층화된 모니터링을 설정하세요.</strong> 오프라인 테스트 세트를 사용하여 각 단계의 기준 메트릭 범위를 정의하세요. 프로덕션 환경에서 어떤 단계가 기준선 아래로 떨어지면 알림을 트리거하세요. 이렇게 하면 추측하지 않고도 회귀를 조기에 포착하고 특정 단계로 추적할 수 있습니다.</p>
<h2 id="What-to-Build-First" class="common-anchor-header">우선적으로 구축해야 할 사항<button data-href="#What-to-Build-First" class="anchor-icon" translate="no">
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
    </button></h2><p>실제 RAG 배포에서 세 가지 우선 순위가 두드러집니다:</p>
<ol>
<li><p><strong>라우팅을 조기에 추가하세요.</strong> 많은 쿼리는 검색이 전혀 필요하지 않습니다. 미리 필터링하면 최소한의 엔지니어링 노력으로 부하를 줄이고 응답 시간을 개선할 수 있습니다.</p></li>
<li><p><strong>통합 하이브리드 검색을 사용하세요.</strong> BM25와 벡터 검색 시스템을 별도로 유지하면 스토리지 비용이 두 배로 증가하고 동기화가 복잡해지며 병합 대기 시간이 늘어납니다. 밀도가 높은 벡터와 희박한 벡터가 동일한 컬렉션에 있는 Milvus 2.6과 같은 통합 시스템은 이러한 문제를 제거합니다.</p></li>
<li><p><strong>각 단계를 독립적으로 평가하세요.</strong> 엔드투엔드 응답 품질만으로는 유용한 신호가 되지 않습니다. 단계별 메트릭(라우팅의 경우 F1, 검색의 경우 Recall@K 및 NDCG)을 사용하면 더 빠르게 디버그하고 다른 단계를 조정하는 동안 한 단계가 중단되는 것을 방지할 수 있습니다.</p></li>
</ol>
<p>최신 RAG 시스템의 진정한 가치는 단순한 검색이 아니라 검색 <em>시기와</em> 검색 <em>방법을</em> 파악하는 것입니다. 라우팅과 통합 하이브리드 검색부터 시작하면 확장 가능한 기반을 갖추게 됩니다.</p>
<hr>
<p>RAG 시스템을 구축하거나 업그레이드하면서 검색 품질 문제가 발생하는 경우, 저희가 도와드리겠습니다:</p>
<ul>
<li><a href="https://slack.milvus.io/">Milvus Slack 커뮤니티에</a> 참여하여 질문하고, 아키텍처를 공유하고, 비슷한 문제를 해결하고 있는 다른 개발자들로부터 배워보세요.</li>
<li>라우팅 설계, 하이브리드 검색 설정, 다단계 평가 등 사용 사례를 살펴볼 수 있는<a href="https://milvus.io/office-hours">20분짜리 무료 Milvus 오피스 아워 세션을 예약하세요</a>.</li>
<li>인프라 설정을 건너뛰고 싶다면 <a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a> (관리형 Milvus)에서 무료 티어를 통해 시작할 수 있습니다.</li>
</ul>
<hr>
<p>팀이 더 스마트한 RAG 시스템을 구축하기 시작할 때 자주 제기되는 몇 가지 질문입니다:</p>
<p><strong>Q: 모델이 128K 이상의 컨텍스트 창을 지원하는데도 RAG가 여전히 필요한가요?</strong></p>
<p>예. 긴 컨텍스트 창은 하나의 큰 문서를 처리해야 할 때 도움이 되지만 지식창고 쿼리에 대한 검색을 대체하지는 못합니다. 모든 요청에 대해 전체 말뭉치를 보내면 비용이 선형적으로 증가하고, 모델은 긴 컨텍스트에서 관련 정보에 집중하지 못하게 되는데, 이는 '중간에서 손실' 효과라고 잘 알려진 문제입니다(Liu et al., 2023). RAG는 관련성 있는 정보만 검색하여 비용과 지연 시간을 예측 가능하게 유지합니다.</p>
<p><strong>질문: 두 개의 별도 시스템을 실행하지 않고 BM25와 벡터 검색을 결합하려면 어떻게 해야 하나요?</strong></p>
<p>동일한 컬렉션에서 고밀도 및 희소 벡터를 모두 지원하는 벡터 데이터베이스를 사용합니다. Milvus 2.6은 문서당 두 가지 벡터 유형을 모두 저장하고 단일 쿼리에서 융합된 결과를 반환합니다. 별도의 인덱스나 결과 병합, 동기화 문제 없이 가중치 매개변수를 변경하여 키워드와 시맨틱 매칭 간의 균형을 조정할 수 있습니다.</p>
<p><strong>질문: 기존 RAG 파이프라인을 개선하기 위해 가장 먼저 추가해야 할 것은 무엇인가요?</strong></p>
<p>쿼리 라우팅. 가장 영향력이 크고 가장 적은 노력으로 개선할 수 있습니다. 대부분의 프로덕션 시스템에는 상식적인 질문, 간단한 계산, 일반적인 지식 등 검색이 전혀 필요하지 않은 쿼리가 상당수 존재합니다. 이러한 쿼리를 LLM으로 직접 라우팅하면 불필요한 검색 호출이 줄어들고 응답 시간이 즉시 개선됩니다.</p>
<p><strong>질문: RAG 파이프라인의 어느 단계에서 잘못된 결과가 발생하는지 파악하려면 어떻게 해야 하나요?</strong></p>
<p>각 단계를 독립적으로 평가하세요. 라우팅 정확도에는 F1 점수를, 검색 품질에는 Recall@K 및 NDCG@10을, 순위 재지정에는 Precision@3을, 생성에는 충실도 메트릭을 사용하세요. 오프라인 테스트 데이터에서 기준선을 설정하고 프로덕션의 각 단계를 모니터링하세요. 답변 품질이 떨어지면 추측 대신 퇴보한 특정 단계를 추적할 수 있습니다.</p>
