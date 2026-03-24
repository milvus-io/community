---
id: fix-rag-retrieval-errors-crag-langgraph-milvus.md
title: 'CRAG, LangGraph, Milvus로 RAG 검색 오류 수정하기'
author: Min Yin
date: 2026-3-23
cover: assets.zilliz.com/cover_CRAG_a05dddbaa2_aafaad6bc0.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'CRAG, RAG retrieval, LangGraph, Milvus, hybrid retrieval'
meta_title: |
  Fix RAG Retrieval Errors with CRAG, LangGraph, and Milvus
desc: >-
  유사도는 높은데 정답이 틀렸나요? CRAG가 RAG 파이프라인에 평가 및 수정 기능을 추가하는 방법을 알아보세요. LangGraph +
  Milvus로 프로덕션에 바로 사용할 수 있는 시스템을 구축하세요.
origin: 'https://milvus.io/blog/fix-rag-retrieval-errors-crag-langgraph-milvus.md'
---
<p>LLM 애플리케이션이 프로덕션 단계에 접어들면서 개인 데이터 또는 실시간 정보를 기반으로 한 질문에 답하기 위한 모델의 필요성이 점점 더 커지고 있습니다. 쿼리 시점에 외부 지식 기반에서 모델을 가져오는 <a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">검색 증강 생성</a> (RAG)이 표준 접근 방식입니다. 이 방식은 오답을 줄이고 답변을 최신 상태로 유지합니다.</p>
<p>하지만 실제로는 <strong>유사성에서 높은 점수를 받은 문서가 질문에 대해 완전히 틀린 답변을 제공할 수</strong> 있다는 문제가 있습니다. 기존의 RAG 파이프라인은 유사성과 관련성을 동일시합니다. 프로덕션 환경에서는 이러한 가정이 깨집니다. 최상위 순위의 결과가 오래되었거나, 접선적으로만 관련성이 있거나, 사용자가 필요로 하는 정확한 세부 정보가 누락되어 있을 수 있습니다.</p>
<p>CRAG(수정 검색 증강 생성)는 검색과 생성 사이에 평가와 수정을 추가하여 이 문제를 해결합니다. 시스템은 유사도 점수를 맹목적으로 신뢰하는 대신 검색된 콘텐츠가 실제로 질문에 대한 답변인지 확인하고, 그렇지 않은 경우 상황을 수정합니다.</p>
<p>이 문서에서는 LangChain, LangGraph, <a href="https://milvus.io/intro">Milvus를</a> 사용해 프로덕션에 바로 사용할 수 있는 CRAG 시스템을 구축하는 과정을 안내합니다.</p>
<h2 id="Three-Retrieval-Problems-Traditional-RAG-Doesnt-Solve" class="common-anchor-header">기존 RAG가 해결하지 못하는 세 가지 검색 문제<button data-href="#Three-Retrieval-Problems-Traditional-RAG-Doesnt-Solve" class="anchor-icon" translate="no">
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
    </button></h2><p>프로덕션 환경에서 대부분의 RAG 실패는 다음 세 가지 문제 중 하나로 거슬러 올라갑니다:</p>
<p><strong>검색 불일치.</strong> 이 문서는 주제는 비슷하지만 실제로는 질문에 대한 답을 제공하지 않습니다. Nginx에서 HTTPS 인증서를 구성하는 방법을 문의하면 시스템에서 Apache 설정 가이드, 2019 연습 또는 TLS 작동 방식에 대한 일반적인 설명이 반환될 수 있습니다. 의미적으로는 비슷하지만 실질적으로는 쓸모가 없습니다.</p>
<p><strong>오래된 콘텐츠.</strong> <a href="https://zilliz.com/learn/vector-similarity-search">벡터 검색에는</a> 최신성 개념이 없습니다. "Python 비동기 모범 사례"를 쿼리하면 2018년 패턴과 2024년 패턴이 혼합되어 순전히 임베딩 거리로만 순위가 매겨집니다. 시스템은 사용자에게 실제로 어떤 것이 필요한지 구분할 수 없습니다.</p>
<p><strong>메모리 오염.</strong> 이 문제는 시간이 지남에 따라 복합적으로 발생하며 수정하기 가장 어려운 문제입니다. 시스템이 오래된 API 참조를 검색하여 잘못된 코드를 생성한다고 가정해 보겠습니다. 이 잘못된 출력은 다시 메모리에 저장됩니다. 다음 유사한 쿼리에서 시스템이 다시 검색하여 실수를 반복합니다. 오래된 정보와 새로운 정보가 점차 뒤섞여 시스템 안정성이 매번 떨어지게 됩니다.</p>
<p>이러한 문제는 특별한 경우가 아닙니다. RAG 시스템이 실제 트래픽을 처리하면 정기적으로 나타납니다. 그렇기 때문에 검색 품질 검사는 있으면 좋은 것이 아니라 필수입니다.</p>
<h2 id="What-Is-CRAG-Evaluate-First-Then-Generate" class="common-anchor-header">CRAG란 무엇인가요? 먼저 평가한 다음 생성<button data-href="#What-Is-CRAG-Evaluate-First-Then-Generate" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>수정 검색-증강 생성(CRAG)</strong> 은 RAG 파이프라인에서 검색과 생성 사이에 평가 및 수정 단계를 추가하는 방법입니다. <a href="https://openreview.net/forum?id=JnWJbrnaUE"><em>수정 검색 증강 생성이라는</em></a> 논문(Yan et al., 2024)에서 소개되었습니다. 문서를 사용하거나 폐기하는 이분법적인 결정을 내리는 기존 RAG와 달리, CRAG는 검색된 각 결과에 대해 관련성 점수를 매기고 언어 모델에 도달하기 전에 세 가지 수정 경로 중 하나를 통해 라우팅합니다.</p>
<p>검색 결과가 부분적으로 관련성이 있거나, 다소 오래되었거나, 핵심 부분이 누락되는 등 회색 지대에 놓일 때 기존의 RAG는 어려움을 겪습니다. 단순한 예/아니오 게이트는 유용한 부분 정보를 버리거나 노이즈가 많은 콘텐츠를 통과시킵니다. CRAG는 <strong>검색 → 생성에서</strong> <strong>검색 → 평가 → 수정 → 생성으로</strong> 파이프라인을 재구성하여 시스템이 생성을 시작하기 전에 검색 품질을 수정할 수 있는 기회를 제공합니다.</p>
<p>
 <span class="img-wrapper">
   <img translate="no" src="https://assets.zilliz.com/fix_rag_retrieval_errors_crag_langgraph_milvus_1_11a820f454.png" alt="CRAG four-step workflow: Retrieval → Evaluation → Correction → Generation, showing how documents are scored and routed" class="doc-image" id="crag-four-step-workflow:-retrieval-→-evaluation-→-correction-→-generation,-showing-how-documents-are-scored-and-routed" />
   <span>CRAG 4단계 워크플로: 검색 → 평가 → 수정 → 생성, 문서가 어떻게 채점되고 라우팅되는지 보여줍니다</span> </span>.</p>
<p>검색된 결과는 세 가지 범주 중 하나로 분류됩니다:</p>
<ul>
<li>정답<strong>:</strong> 쿼리에 대한 직접적인 답변, 가벼운 수정 후 사용 가능</li>
<li><strong>모호함:</strong> 부분적으로 관련성이 있음, 추가 정보 필요</li>
<li><strong>부정확:</strong> 관련성이 없음, 폐기하고 다른 소스로 되돌림</li>
</ul>
<table>
<thead>
<tr><th>결정</th><th>확신</th><th>조치</th></tr>
</thead>
<tbody>
<tr><td>정답</td><td>&gt; 0.9</td><td>문서 내용 수정</td></tr>
<tr><td>모호함</td><td>0.5-0.9</td><td>문서 구체화 + 웹 검색으로 보완</td></tr>
<tr><td>부정확</td><td>&lt; 0.5</td><td>검색 결과를 폐기하고 전적으로 웹 검색으로 돌아감</td></tr>
</tbody>
</table>
<h3 id="Content-Refinement" class="common-anchor-header">콘텐츠 구체화</h3><p>대부분의 시스템이 검색된 전체 문서를 모델에 제공한다는 점에서 CRAG는 표준 RAG의 미묘한 문제도 해결합니다. 이는 토큰을 낭비하고 신호를 희석시키며, 모델은 실제로 중요한 한 문장을 찾기 위해 관련 없는 단락을 헤쳐나가야 합니다. CRAG는 검색된 콘텐츠를 먼저 정제하여 관련성 있는 부분을 추출하고 나머지는 제거합니다.</p>
<p>원본 논문에서는 이를 위해 지식 스트립과 휴리스틱 규칙을 사용합니다. 실제로 키워드 매칭은 많은 사용 사례에서 작동하며, 프로덕션 시스템에서는 더 높은 품질을 위해 LLM 기반 요약 또는 구조화된 추출을 계층화할 수 있습니다.</p>
<p>정제 프로세스는 세 부분으로 구성됩니다:</p>
<ul>
<li><strong>문서 분해:</strong> 긴 문서에서 핵심 구절 추출</li>
<li><strong>쿼리 재작성:</strong> 모호하거나 모호한 쿼리를 보다 타겟팅된 쿼리로 전환합니다.</li>
<li><strong>지식 선택:</strong> 가장 유용한 콘텐츠만 중복 제거, 순위 지정 및 보존</li>
</ul>
<p>
 <span class="img-wrapper">
   <img translate="no" src="https://assets.zilliz.com/fix_rag_retrieval_errors_crag_langgraph_milvus_2_9ec4b6aa81.png" alt="The three-step document refinement process: Document Decomposition (2000 → 500 tokens), Query Rewriting (improved search precision), and Knowledge Selection (filter, rank, and trim)" class="doc-image" id="the-three-step-document-refinement-process:-document-decomposition-(2000-→-500-tokens),-query-rewriting-(improved-search-precision),-and-knowledge-selection-(filter,-rank,-and-trim)" />
   <span>3단계 문서 정제 프로세스: 문서 분해(2000개 → 500개 토큰), 쿼리 재작성(검색 정밀도 향상), 지식 선택(필터링, 순위 지정, 트리밍)</span> </span></p>
<h3 id="The-Evaluator" class="common-anchor-header">평가자</h3><p>평가자는 CRAG의 핵심입니다. 심층적인 추론을 위한 것이 아니라 빠른 분류 게이트입니다. 쿼리와 검색된 문서 세트가 주어지면 콘텐츠가 사용하기에 충분한지 여부를 결정합니다.</p>
<p>원본 논문은 범용 LLM이 아닌 미세 조정된 T5-Large 모델을 선택했습니다. 이 특정 작업에는 유연성보다 속도와 정확성이 더 중요하기 때문입니다.</p>
<table>
<thead>
<tr><th>속성</th><th>미세 조정된 T5-Large</th><th>GPT-4</th></tr>
</thead>
<tbody>
<tr><td>지연 시간</td><td>10~20ms</td><td>200ms 이상</td></tr>
<tr><td>정확도</td><td>92%(논문 실험)</td><td>미정</td></tr>
<tr><td>작업 적합성</td><td>높음 - 단일 작업 미세 조정, 높은 정밀도</td><td>중간 - 범용, 더 유연하지만 덜 전문화됨</td></tr>
</tbody>
</table>
<h3 id="Web-Search-Fallback" class="common-anchor-header">웹 검색 폴백</h3><p>내부 검색이 부정확하거나 모호한 것으로 플래그가 지정된 경우, CRAG는 웹 검색을 트리거하여 더 새롭거나 보충적인 정보를 가져올 수 있습니다. 이는 시간에 민감한 쿼리와 내부 지식창고에 공백이 있는 주제에 대한 안전망 역할을 합니다.</p>
<h2 id="Why-Milvus-Is-a-Good-Fit-for-CRAG-in-Production" class="common-anchor-header">Milvus가 프로덕션에서 CRAG에 적합한 이유<button data-href="#Why-Milvus-Is-a-Good-Fit-for-CRAG-in-Production" class="anchor-icon" translate="no">
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
    </button></h2><p>CRAG의 효율성은 그 밑에 무엇이 있는지에 따라 달라집니다. <a href="https://zilliz.com/learn/what-is-vector-database">벡터 데이터베이스는</a> 기본적인 유사도 검색 이상의 기능을 수행해야 하며, 프로덕션 CRAG 시스템에 요구되는 멀티테넌트 격리, 하이브리드 검색 및 스키마 유연성을 지원해야 합니다.</p>
<p>여러 옵션을 평가한 결과, 다음 세 가지 이유로 <a href="https://zilliz.com/what-is-milvus">Milvus를</a> 선택했습니다.</p>
<h3 id="Multi-Tenant-Isolation" class="common-anchor-header">멀티 테넌트 격리</h3><p>에이전트 기반 시스템에서는 각 사용자 또는 세션마다 고유한 메모리 공간이 필요합니다. 테넌트당 하나의 컬렉션을 사용하는 순진한 접근 방식은 특히 규모가 커지면 운영상 골칫거리가 됩니다.</p>
<p>Milvus는 <a href="https://milvus.io/docs/use-partition-key.md">파티션 키로</a> 이를 처리합니다. <code translate="no">agent_id</code> 필드에 <code translate="no">is_partition_key=True</code> 을 설정하면 Milvus가 자동으로 올바른 파티션으로 쿼리를 라우팅합니다. 수집이 늘어나거나 수동 라우팅 코드가 필요하지 않습니다.</p>
<p>100개의 테넌트에 걸쳐 1,000만 개의 벡터를 사용한 벤치마크에서 클러스터링 압축 기능을 갖춘 Milvus는 최적화되지 않은 기준선에 비해 <strong>3~5배 더 높은 QPS를</strong> 제공했습니다.</p>
<h3 id="Hybrid-Retrieval" class="common-anchor-header">하이브리드 검색</h3><p>순수 벡터 검색은 <code translate="no">SKU-2024-X5</code>, 버전 문자열 또는 특정 용어와 같은 정확히 일치하는 콘텐츠-제품 SKU에는 부족합니다.</p>
<p>Milvus 2.5는 의미적 유사성을 위한 고밀도 벡터, BM25 스타일 키워드 매칭을 위한 스파스 벡터, 스칼라 메타데이터 필터링을 하나의 쿼리에서 모두 지원하는 <a href="https://milvus.io/docs/multi-vector-search.md">하이브리드 검색을</a> 기본으로 지원합니다. 결과는 상호 순위 융합(RRF)을 사용해 융합되므로 별도의 검색 파이프라인을 구축하고 병합할 필요가 없습니다.</p>
<p>100만 개의 벡터 데이터 세트에서 Milvus Sparse-BM25의 검색 지연 시간은 <strong>6ms로</strong>, 엔드투엔드 CRAG 성능에 미치는 영향은 미미했습니다.</p>
<h3 id="Flexible-Schema-for-Evolving-Memory" class="common-anchor-header">진화하는 메모리를 위한 유연한 스키마</h3><p>CRAG 파이프라인이 성숙해짐에 따라 데이터 모델도 함께 진화합니다. 평가 로직을 반복하면서 <code translate="no">confidence</code>, <code translate="no">verified</code>, <code translate="no">source</code> 와 같은 필드를 추가해야 했습니다. 대부분의 데이터베이스에서 이는 마이그레이션 스크립트와 다운타임을 의미합니다.</p>
<p>Milvus는 동적 JSON 필드를 지원하므로 서비스 중단 없이 메타데이터를 즉시 확장할 수 있습니다.</p>
<p>다음은 일반적인 스키마입니다:</p>
<pre><code translate="no" class="language-python">fields = [
    FieldSchema(name=<span class="hljs-string">&quot;agent_id&quot;</span>, dtype=DataType.VARCHAR, is_partition_key=<span class="hljs-literal">True</span>),  <span class="hljs-comment"># multi-tenancy</span>
    FieldSchema(name=<span class="hljs-string">&quot;dense_embedding&quot;</span>, dtype=DataType.FLOAT_VECTOR, dim=<span class="hljs-number">1536</span>),   <span class="hljs-comment"># semantic retrieval</span>
    FieldSchema(name=<span class="hljs-string">&quot;sparse_embedding&quot;</span>, dtype=DataType.SPARSE_FLOAT_VECTOR),<span class="hljs-comment"># BM25</span>
    FieldSchema(name=<span class="hljs-string">&quot;metadata&quot;</span>, dtype=DataType.JSON),<span class="hljs-comment"># dynamic schema</span>
]

<span class="hljs-comment"># hybrid retrieval + metadata filtering</span>
results = collection.hybrid_search(
    reqs=[
        AnnSearchRequest(data=[dense_vec], anns_field=<span class="hljs-string">&quot;dense_embedding&quot;</span>, limit=<span class="hljs-number">20</span>),
        AnnSearchRequest(data=[sparse_vec], anns_field=<span class="hljs-string">&quot;sparse_embedding&quot;</span>, limit=<span class="hljs-number">20</span>)
    ],
    rerank=RRFRanker(),
    output_fields=[<span class="hljs-string">&quot;metadata&quot;</span>],
    expr=<span class="hljs-string">&#x27;metadata[&quot;confidence&quot;] &gt; 0.9&#x27;</span>,<span class="hljs-comment"># CRAG confidence filtering</span>
    limit=<span class="hljs-number">5</span>
)
<button class="copy-code-btn"></button></code></pre>
<p>Milvus는 또한 배포 확장을 간소화합니다. 코드 호환이 가능한 <a href="https://milvus.io/docs/install-overview.md">Lite, 독립형, 분산 모드를</a> 제공하며, 로컬 개발에서 프로덕션 클러스터로 전환할 때는 연결 문자열만 변경하면 됩니다.</p>
<h2 id="Hands-On-Build-a-CRAG-System-with-LangGraph-Middleware-and-Milvus" class="common-anchor-header">실습: LangGraph 미들웨어 및 Milvus로 CRAG 시스템 구축하기<button data-href="#Hands-On-Build-a-CRAG-System-with-LangGraph-Middleware-and-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Why-the-Middleware-Approach" class="common-anchor-header">왜 미들웨어 접근 방식인가?</h3><p>LangGraph로 CRAG를 구축하는 일반적인 방법은 각 단계를 제어하는 노드와 에지로 상태 그래프를 연결하는 것입니다. 이 방법은 효과가 있지만 복잡성이 증가함에 따라 그래프가 엉키게 되고 디버깅이 골칫거리가 됩니다.</p>
<p>저희는 LangGraph 1.0에서 <strong>미들웨어 패턴을</strong> 사용하기로 결정했습니다. 모델 호출 전에 요청을 가로채기 때문에 검색, 평가, 수정이 하나의 일관된 장소에서 처리됩니다. 상태 그래프 접근 방식과 비교:</p>
<ul>
<li><strong>코드 감소:</strong> 로직이 그래프 노드에 흩어져 있지 않고 중앙 집중화되어 있습니다.</li>
<li><strong>따라가기 쉬움:</strong> 제어 흐름이 선형적으로 읽힘</li>
<li><strong>더 쉬운 디버깅:</strong> 실패가 그래프 이동이 아닌 단일 위치를 가리킴</li>
</ul>
<h3 id="Core-Workflow" class="common-anchor-header">핵심 워크플로</h3><p>파이프라인은 4단계로 실행됩니다:</p>
<ol>
<li><strong>검색:</strong> 현재 테넌트로 범위가 지정된 Milvus에서 상위 3개의 관련 문서를 가져옵니다.</li>
<li><strong>평가:</strong> 경량 모델로 문서 품질 평가</li>
<li><strong>수정:</strong> 평가 결과에 따라 수정, 웹 검색으로 보완 또는 전면 백업을 수행합니다.</li>
<li><strong>주입:</strong> 동적 시스템 프롬프트를 통해 최종 컨텍스트를 모델에 전달합니다.</li>
</ol>
<h3 id="Environment-Setup-and-Data-Preparation" class="common-anchor-header">환경 설정 및 데이터 준비</h3><p><strong>환경 변수</strong></p>
<pre><code translate="no" class="language-bash"><span class="hljs-keyword">export</span> <span class="hljs-variable constant_">OPENAI_API_KEY</span>=<span class="hljs-string">&quot;your-api-key&quot;</span>
<span class="hljs-keyword">export</span> <span class="hljs-variable constant_">TAVILY_API_KEY</span>=<span class="hljs-string">&quot;your-tavily-key&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>Milvus 컬렉션 만들기</strong></p>
<p>코드를 실행하기 전에 검색 로직과 일치하는 스키마로 Milvus에서 컬렉션을 생성하세요.</p>
<pre><code translate="no" class="language-python"><span class="hljs-comment"># filename: crag_agent.py</span>

<span class="hljs-comment"># ============ Import dependencies ============</span>
<span class="hljs-keyword">from</span> typing <span class="hljs-keyword">import</span> <span class="hljs-type">Literal</span>, <span class="hljs-type">List</span>
<span class="hljs-keyword">from</span> langchain.agents <span class="hljs-keyword">import</span> create_agent
<span class="hljs-keyword">from</span> langchain.agents.middleware <span class="hljs-keyword">import</span> AgentMiddleware, before_model, dynamic_prompt
<span class="hljs-keyword">from</span> langchain.chat_models <span class="hljs-keyword">import</span> init_chat_model
<span class="hljs-keyword">from</span> langchain_milvus <span class="hljs-keyword">import</span> Milvus
<span class="hljs-keyword">from</span> langchain_openai <span class="hljs-keyword">import</span> OpenAIEmbeddings
<span class="hljs-keyword">from</span> langchain_core.documents <span class="hljs-keyword">import</span> Document
<span class="hljs-keyword">from</span> langchain_core.messages <span class="hljs-keyword">import</span> SystemMessage, HumanMessage
<span class="hljs-keyword">from</span> langchain_community.tools.tavily_search <span class="hljs-keyword">import</span> TavilySearchResults


<span class="hljs-comment"># ============ CRAG Middleware (minimal-change version) ============</span>
<span class="hljs-keyword">class</span> <span class="hljs-title class_">CRAGMiddleware</span>(<span class="hljs-title class_ inherited__">AgentMiddleware</span>):
    <span class="hljs-string">&quot;&quot;&quot;CRAG evaluation and correction middleware (uses official decorator-based hooks to avoid permanently polluting the message stack)&quot;&quot;&quot;</span>

    <span class="hljs-keyword">def</span> <span class="hljs-title function_">__init__</span>(<span class="hljs-params">self, vector_store: Milvus, agent_id: <span class="hljs-built_in">str</span></span>):
        <span class="hljs-built_in">super</span>().__init__()
        <span class="hljs-variable language_">self</span>.vector_store = vector_store
        <span class="hljs-variable language_">self</span>.agent_id = agent_id  <span class="hljs-comment"># multi-tenant isolation</span>
        <span class="hljs-comment"># Lightweight evaluator: used for relevance judgment (can be replaced with the structured version introduced later)</span>
        <span class="hljs-variable language_">self</span>.evaluator = init_chat_model(<span class="hljs-string">&quot;openai:gpt-4o-mini&quot;</span>, temperature=<span class="hljs-number">0</span>)
        <span class="hljs-comment"># Web search fallback</span>
        <span class="hljs-variable language_">self</span>.web_search = TavilySearchResults(max_results=<span class="hljs-number">3</span>)

<span class="hljs-meta">    @before_model</span>
    <span class="hljs-keyword">def</span> <span class="hljs-title function_">run_crag</span>(<span class="hljs-params">self, state</span>):
        <span class="hljs-string">&quot;&quot;&quot;Run retrieval -&gt; evaluation -&gt; correction before model invocation and prepare the final context&quot;&quot;&quot;</span>
        <span class="hljs-comment"># Get the last user message</span>
        last_msg = state[<span class="hljs-string">&quot;messages&quot;</span>][-<span class="hljs-number">1</span>]
        query = <span class="hljs-built_in">getattr</span>(last_msg, <span class="hljs-string">&quot;content&quot;</span>, <span class="hljs-string">&quot;&quot;</span>) <span class="hljs-keyword">if</span> <span class="hljs-built_in">hasattr</span>(last_msg, <span class="hljs-string">&quot;content&quot;</span>) <span class="hljs-keyword">else</span> last_msg.get(<span class="hljs-string">&quot;content&quot;</span>, <span class="hljs-string">&quot;&quot;</span>)

        <span class="hljs-comment"># 1. Retrieval: get documents from Milvus (PartitionKey + confidence filtering)</span>
        docs = <span class="hljs-variable language_">self</span>._retrieve_from_milvus(query)

        <span class="hljs-comment"># 2. Evaluation: three-way decision</span>
        verdict = <span class="hljs-variable language_">self</span>._evaluate_relevance(query, docs)

        <span class="hljs-comment"># 3. Correction: choose the handling strategy based on the verdict</span>
        <span class="hljs-keyword">if</span> verdict == <span class="hljs-string">&quot;incorrect&quot;</span>:
            <span class="hljs-comment"># Retrieval failed, rely entirely on Web search</span>
            web_results = <span class="hljs-variable language_">self</span>._web_search_fallback(query)
            final_context = <span class="hljs-variable language_">self</span>._format_web_results(web_results)
        <span class="hljs-keyword">elif</span> verdict == <span class="hljs-string">&quot;ambiguous&quot;</span>:
            <span class="hljs-comment"># Retrieval is ambiguous, refine documents + supplement with Web search</span>
            refined_docs = <span class="hljs-variable language_">self</span>._refine_documents(docs, query)
            web_results = <span class="hljs-variable language_">self</span>._web_search_fallback(query)
            final_context = <span class="hljs-variable language_">self</span>._merge_context(refined_docs, web_results)
        <span class="hljs-keyword">else</span>:
            <span class="hljs-comment"># Retrieval quality is good, only refine the documents</span>
            refined_docs = <span class="hljs-variable language_">self</span>._refine_documents(docs, query)
            final_context = <span class="hljs-variable language_">self</span>._format_internal_docs(refined_docs)

        <span class="hljs-comment"># 4. Put the context into a temporary key, used only for dynamic prompt assembly in the current model call</span>
        state[<span class="hljs-string">&quot;_crag_context&quot;</span>] = final_context
        <span class="hljs-keyword">return</span> state

<span class="hljs-meta">    @dynamic_prompt</span>
    <span class="hljs-keyword">def</span> <span class="hljs-title function_">attach_context</span>(<span class="hljs-params">self, state, prompt_messages: <span class="hljs-type">List</span></span>):
        <span class="hljs-string">&quot;&quot;&quot;Inject the CRAG-generated context as a SystemMessage before the prompt for the current model call&quot;&quot;&quot;</span>
        final_context = state.get(<span class="hljs-string">&quot;_crag_context&quot;</span>)
        <span class="hljs-keyword">if</span> final_context:
            sys_msg = SystemMessage(
                content=<span class="hljs-string">f&quot;Here is some relevant background information. Please answer the user&#x27;s question based on this information:\n\n<span class="hljs-subst">{final_context}</span>&quot;</span>
            )
            <span class="hljs-comment"># Applies only to the current call and is not permanently written into state[&quot;messages&quot;]</span>
            prompt_messages = [sys_msg] + prompt_messages
        <span class="hljs-keyword">return</span> prompt_messages

    <span class="hljs-comment"># ======== Internal methods: retrieval / evaluation / refinement / formatting ========</span>

    <span class="hljs-keyword">def</span> <span class="hljs-title function_">_retrieve_from_milvus</span>(<span class="hljs-params">self, query: <span class="hljs-built_in">str</span></span>) -&gt; <span class="hljs-built_in">list</span>:
        <span class="hljs-string">&quot;&quot;&quot;Retrieve documents from Milvus (Partition Key + confidence filtering)&quot;&quot;&quot;</span>
        <span class="hljs-keyword">try</span>:
            <span class="hljs-comment"># Note: different adapter versions may place filter parameters differently; here expr is passed through search_kwargs</span>
            docs = <span class="hljs-variable language_">self</span>.vector_store.similarity_search(
                query,
                k=<span class="hljs-number">3</span>,
                search_kwargs={<span class="hljs-string">&quot;expr&quot;</span>: <span class="hljs-string">f&#x27;agent_id == &quot;<span class="hljs-subst">{self.agent_id}</span>&quot;&#x27;</span>}
            )
            <span class="hljs-comment"># Confidence filtering (to avoid low-quality memory contamination)</span>
            filtered_docs = [
                doc <span class="hljs-keyword">for</span> doc <span class="hljs-keyword">in</span> docs
                <span class="hljs-keyword">if</span> (doc.metadata <span class="hljs-keyword">or</span> {}).get(<span class="hljs-string">&quot;confidence&quot;</span>, <span class="hljs-number">0.0</span>) &gt; <span class="hljs-number">0.7</span>
            ]
            <span class="hljs-keyword">return</span> filtered_docs <span class="hljs-keyword">or</span> docs  <span class="hljs-comment"># If there are no high-confidence results, fall back to the original results for evaluator judgment</span>
        <span class="hljs-keyword">except</span> Exception <span class="hljs-keyword">as</span> e:
            <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[CRAG] Retrieval failed: <span class="hljs-subst">{e}</span>&quot;</span>)
            <span class="hljs-keyword">return</span> []

    <span class="hljs-keyword">def</span> <span class="hljs-title function_">_evaluate_relevance</span>(<span class="hljs-params">self, query: <span class="hljs-built_in">str</span>, docs: <span class="hljs-built_in">list</span></span>) -&gt; <span class="hljs-type">Literal</span>[<span class="hljs-string">&quot;relevant&quot;</span>, <span class="hljs-string">&quot;ambiguous&quot;</span>, <span class="hljs-string">&quot;incorrect&quot;</span>]:
        <span class="hljs-string">&quot;&quot;&quot;Evaluate document relevance (three-way decision), simplified version: the LLM returns the verdict directly&quot;&quot;&quot;</span>
        <span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> docs:
            <span class="hljs-keyword">return</span> <span class="hljs-string">&quot;incorrect&quot;</span>

        <span class="hljs-comment"># Evaluate only the Top-3 documents, taking the first 500 characters of each</span>
        doc_content = <span class="hljs-string">&quot;\n\n&quot;</span>.join([
            <span class="hljs-string">f&quot;[Document <span class="hljs-subst">{i+<span class="hljs-number">1</span>}</span>] <span class="hljs-subst">{(doc.page_content <span class="hljs-keyword">or</span> <span class="hljs-string">&#x27;&#x27;</span>)[:<span class="hljs-number">500</span>]}</span>...&quot;</span>
            <span class="hljs-keyword">for</span> i, doc <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(docs[:<span class="hljs-number">3</span>])
        ])

        prompt = <span class="hljs-string">f&quot;&quot;&quot;You are an expert in document relevance evaluation. Assess whether the following documents can answer the query.

Query: <span class="hljs-subst">{query}</span>

Document content:
<span class="hljs-subst">{doc_content}</span>

Evaluation criteria:
- relevant: the document directly contains the answer and is highly relevant
- ambiguous: the document is partially relevant and needs external knowledge
- incorrect: the document is irrelevant and cannot answer the query

Return only one word: relevant or ambiguous or incorrect
&quot;&quot;&quot;</span>
        <span class="hljs-keyword">try</span>:
            result = <span class="hljs-variable language_">self</span>.evaluator.invoke(prompt)
            verdict = (<span class="hljs-built_in">getattr</span>(result, <span class="hljs-string">&quot;content&quot;</span>, <span class="hljs-string">&quot;&quot;</span>) <span class="hljs-keyword">or</span> <span class="hljs-string">&quot;&quot;</span>).strip().lower()
            <span class="hljs-keyword">if</span> verdict <span class="hljs-keyword">not</span> <span class="hljs-keyword">in</span> {<span class="hljs-string">&quot;relevant&quot;</span>, <span class="hljs-string">&quot;ambiguous&quot;</span>, <span class="hljs-string">&quot;incorrect&quot;</span>}:
                verdict = <span class="hljs-string">&quot;ambiguous&quot;</span>
            <span class="hljs-keyword">return</span> verdict
        <span class="hljs-keyword">except</span> Exception <span class="hljs-keyword">as</span> e:
            <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[CRAG] Evaluation failed: <span class="hljs-subst">{e}</span>&quot;</span>)
            <span class="hljs-keyword">return</span> <span class="hljs-string">&quot;ambiguous&quot;</span>

    <span class="hljs-keyword">def</span> <span class="hljs-title function_">_refine_documents</span>(<span class="hljs-params">self, docs: <span class="hljs-built_in">list</span>, query: <span class="hljs-built_in">str</span></span>) -&gt; <span class="hljs-built_in">list</span>:
        <span class="hljs-string">&quot;&quot;&quot;Refine documents (simplified strips: sentence filtering based on keywords)&quot;&quot;&quot;</span>
        refined = []
        <span class="hljs-comment"># Simple Chinese-period replacement + rough English sentence splitting</span>
        keywords = [kw.strip() <span class="hljs-keyword">for</span> kw <span class="hljs-keyword">in</span> query.split() <span class="hljs-keyword">if</span> kw.strip()]

        <span class="hljs-keyword">for</span> doc <span class="hljs-keyword">in</span> docs:
            text = doc.page_content <span class="hljs-keyword">or</span> <span class="hljs-string">&quot;&quot;</span>
            sentences = (
                text.replace(<span class="hljs-string">&quot;。&quot;</span>, <span class="hljs-string">&quot;。\n&quot;</span>)
                    .replace(<span class="hljs-string">&quot;. &quot;</span>, <span class="hljs-string">&quot;.\n&quot;</span>)
                    .replace(<span class="hljs-string">&quot;! &quot;</span>, <span class="hljs-string">&quot;!\n&quot;</span>)
                    .replace(<span class="hljs-string">&quot;? &quot;</span>, <span class="hljs-string">&quot;?\n&quot;</span>)
                    .split(<span class="hljs-string">&quot;\n&quot;</span>)
            )
            sentences = [s.strip() <span class="hljs-keyword">for</span> s <span class="hljs-keyword">in</span> sentences <span class="hljs-keyword">if</span> s.strip()]

            <span class="hljs-comment"># Match any keyword</span>
            relevant_sentences = [
                s <span class="hljs-keyword">for</span> s <span class="hljs-keyword">in</span> sentences
                <span class="hljs-keyword">if</span> <span class="hljs-built_in">any</span>(keyword <span class="hljs-keyword">in</span> s <span class="hljs-keyword">for</span> keyword <span class="hljs-keyword">in</span> keywords)
            ]

            <span class="hljs-keyword">if</span> relevant_sentences:
                refined_text = <span class="hljs-string">&quot;。&quot;</span>.join(relevant_sentences[:<span class="hljs-number">3</span>])
                refined.append(Document(page_content=refined_text, metadata=doc.metadata <span class="hljs-keyword">or</span> {}))

        <span class="hljs-keyword">return</span> refined <span class="hljs-keyword">if</span> refined <span class="hljs-keyword">else</span> docs  <span class="hljs-comment"># If nothing is extracted, fall back to the original documents</span>

    <span class="hljs-keyword">def</span> <span class="hljs-title function_">_web_search_fallback</span>(<span class="hljs-params">self, query: <span class="hljs-built_in">str</span></span>) -&gt; <span class="hljs-built_in">list</span>:
        <span class="hljs-string">&quot;&quot;&quot;Web search fallback&quot;&quot;&quot;</span>
        <span class="hljs-keyword">try</span>:
            <span class="hljs-keyword">return</span> <span class="hljs-variable language_">self</span>.web_search.invoke(query) <span class="hljs-keyword">or</span> []
        <span class="hljs-keyword">except</span> Exception <span class="hljs-keyword">as</span> e:
            <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[CRAG] Web search failed: <span class="hljs-subst">{e}</span>&quot;</span>)
            <span class="hljs-keyword">return</span> []

    <span class="hljs-keyword">def</span> <span class="hljs-title function_">_merge_context</span>(<span class="hljs-params">self, internal_docs: <span class="hljs-built_in">list</span>, web_results: <span class="hljs-built_in">list</span></span>) -&gt; <span class="hljs-built_in">str</span>:
        <span class="hljs-string">&quot;&quot;&quot;Merge internal memory and external knowledge into the final context&quot;&quot;&quot;</span>
        parts = []
        <span class="hljs-keyword">if</span> internal_docs:
            parts.append(<span class="hljs-string">&quot;[Internal Memory]&quot;</span>)
            <span class="hljs-keyword">for</span> i, doc <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(internal_docs, <span class="hljs-number">1</span>):
                parts.append(<span class="hljs-string">f&quot;<span class="hljs-subst">{i}</span>. <span class="hljs-subst">{doc.page_content}</span>&quot;</span>)
        <span class="hljs-keyword">if</span> web_results:
            parts.append(<span class="hljs-string">&quot;[External Knowledge]&quot;</span>)
            <span class="hljs-keyword">for</span> i, result <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(web_results, <span class="hljs-number">1</span>):
                content = (result <span class="hljs-keyword">or</span> {}).get(<span class="hljs-string">&quot;content&quot;</span>, <span class="hljs-string">&quot;&quot;</span>)
                url = (result <span class="hljs-keyword">or</span> {}).get(<span class="hljs-string">&quot;url&quot;</span>, <span class="hljs-string">&quot;&quot;</span>)
                parts.append(<span class="hljs-string">f&quot;<span class="hljs-subst">{i}</span>. <span class="hljs-subst">{content}</span>\n   Source: <span class="hljs-subst">{url}</span>&quot;</span>)
        <span class="hljs-keyword">return</span> <span class="hljs-string">&quot;\n\n&quot;</span>.join(parts) <span class="hljs-keyword">if</span> parts <span class="hljs-keyword">else</span> <span class="hljs-string">&quot;No relevant information found&quot;</span>

    <span class="hljs-keyword">def</span> <span class="hljs-title function_">_format_internal_docs</span>(<span class="hljs-params">self, docs: <span class="hljs-built_in">list</span></span>) -&gt; <span class="hljs-built_in">str</span>:
        <span class="hljs-string">&quot;&quot;&quot;Format internal documents&quot;&quot;&quot;</span>
        <span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> docs:
            <span class="hljs-keyword">return</span> <span class="hljs-string">&quot;No relevant information found&quot;</span>
        parts = [<span class="hljs-string">&quot;[Internal Memory]&quot;</span>]
        <span class="hljs-keyword">for</span> i, doc <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(docs, <span class="hljs-number">1</span>):
            parts.append(<span class="hljs-string">f&quot;<span class="hljs-subst">{i}</span>. <span class="hljs-subst">{doc.page_content}</span>&quot;</span>)
        <span class="hljs-keyword">return</span> <span class="hljs-string">&quot;\n\n&quot;</span>.join(parts)

    <span class="hljs-keyword">def</span> <span class="hljs-title function_">_format_web_results</span>(<span class="hljs-params">self, results: <span class="hljs-built_in">list</span></span>) -&gt; <span class="hljs-built_in">str</span>:
        <span class="hljs-string">&quot;&quot;&quot;Format Web search results&quot;&quot;&quot;</span>
        <span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> results:
            <span class="hljs-keyword">return</span> <span class="hljs-string">&quot;No relevant information found&quot;</span>
        parts = [<span class="hljs-string">&quot;[External Knowledge]&quot;</span>]
        <span class="hljs-keyword">for</span> i, result <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(results, <span class="hljs-number">1</span>):
            content = (result <span class="hljs-keyword">or</span> {}).get(<span class="hljs-string">&quot;content&quot;</span>, <span class="hljs-string">&quot;&quot;</span>)
            url = (result <span class="hljs-keyword">or</span> {}).get(<span class="hljs-string">&quot;url&quot;</span>, <span class="hljs-string">&quot;&quot;</span>)
            parts.append(<span class="hljs-string">f&quot;<span class="hljs-subst">{i}</span>. <span class="hljs-subst">{content}</span>\n   Source: <span class="hljs-subst">{url}</span>&quot;</span>)
        <span class="hljs-keyword">return</span> <span class="hljs-string">&quot;\n\n&quot;</span>.join(parts)


<span class="hljs-comment"># ============ Initialize the Milvus vector database ============</span>
vector_store = Milvus(
    embedding_function=OpenAIEmbeddings(),
    connection_args={<span class="hljs-string">&quot;host&quot;</span>: <span class="hljs-string">&quot;localhost&quot;</span>, <span class="hljs-string">&quot;port&quot;</span>: <span class="hljs-string">&quot;19530&quot;</span>},
    collection_name=<span class="hljs-string">&quot;agent_memory&quot;</span>
)

<span class="hljs-comment"># ============ Create Agent ============</span>
agent = create_agent(
    model=<span class="hljs-string">&quot;openai:gpt-4o&quot;</span>,
    tools=[TavilySearchResults(max_results=<span class="hljs-number">3</span>)],  <span class="hljs-comment"># Web search tool</span>
    middleware=[
        CRAGMiddleware(
            vector_store=vector_store,
            agent_id=<span class="hljs-string">&quot;user_123_session_456&quot;</span>  <span class="hljs-comment"># multi-tenant isolation: each Agent instance uses its own ID</span>
        )
    ]
)

<span class="hljs-comment"># ============ Example run ============</span>
<span class="hljs-keyword">if</span> __name__ == <span class="hljs-string">&quot;__main__&quot;</span>:
    <span class="hljs-comment"># Example query: use HumanMessage to ensure compatibility</span>
    response = agent.invoke({
        <span class="hljs-string">&quot;messages&quot;</span>: [
            HumanMessage(content=<span class="hljs-string">&quot;What were the operating expenses in Nike&#x27;s latest quarterly earnings report?&quot;</span>)
        ]
    })
    <span class="hljs-built_in">print</span>(response[<span class="hljs-string">&quot;messages&quot;</span>][-<span class="hljs-number">1</span>].content)
<button class="copy-code-btn"></button></code></pre>
<blockquote>
<p><strong>버전 참고:</strong> 이 코드는 LangGraph와 LangChain의 최신 미들웨어 기능을 사용합니다. 이러한 API는 프레임워크가 발전함에 따라 변경될 수 있으며, 최신 사용법은 <a href="https://langchain-ai.github.io/langgraph/">LangGraph 설명서를</a> 참조하세요.</p>
</blockquote>
<h3 id="Key-Modules" class="common-anchor-header">주요 모듈</h3><p><strong>1. 프로덕션 등급 평가기 설계</strong></p>
<p>위 코드의 <code translate="no">_evaluate_relevance()</code> 메서드는 빠른 테스트를 위해 의도적으로 단순화되었습니다. 프로덕션에서는 신뢰도 점수와 설명 가능성을 갖춘 구조화된 결과물을 원할 것입니다:</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> pydantic <span class="hljs-keyword">import</span> BaseModel
<span class="hljs-keyword">from</span> langchain.prompts <span class="hljs-keyword">import</span> PromptTemplate

<span class="hljs-keyword">class</span> <span class="hljs-title class_">RelevanceVerdict</span>(<span class="hljs-title class_ inherited__">BaseModel</span>):
    <span class="hljs-string">&quot;&quot;&quot;Structured output for the evaluation result&quot;&quot;&quot;</span>
    verdict: <span class="hljs-type">Literal</span>[<span class="hljs-string">&quot;relevant&quot;</span>, <span class="hljs-string">&quot;ambiguous&quot;</span>, <span class="hljs-string">&quot;incorrect&quot;</span>]
    confidence: <span class="hljs-built_in">float</span>  <span class="hljs-comment"># confidence score (used for memory quality monitoring)</span>
    reasoning: <span class="hljs-built_in">str</span>     <span class="hljs-comment"># reason for the judgment (used for debugging and review)</span>

<span class="hljs-comment"># Note: the CRAG paper uses a fine-tuned T5-Large evaluator (10-20 ms latency)</span>
<span class="hljs-comment"># Here, gpt-4o-mini is used as the engineering implementation option (easier to deploy, but with slightly higher latency)</span>
grader_llm = ChatOpenAI(model=<span class="hljs-string">&quot;gpt-4o-mini&quot;</span>, temperature=<span class="hljs-number">0</span>)

grader_prompt = PromptTemplate(
    template=<span class="hljs-string">&quot;&quot;&quot;You are an expert in document relevance evaluation. Assess whether the following documents can answer the query.

Query: {query}

Document content:
{document}

Evaluation criteria:
- relevant: the document directly contains the answer, confidence &gt; 0.9
- ambiguous: the document is partially relevant, confidence 0.5-0.9
- incorrect: the document is irrelevant, confidence &lt; 0.5

Return in JSON format: {{&quot;verdict&quot;: &quot;...&quot;, &quot;confidence&quot;: 0.xx, &quot;reasoning&quot;: &quot;...&quot;}}
&quot;&quot;&quot;</span>,
    input_variables=[<span class="hljs-string">&quot;query&quot;</span>, <span class="hljs-string">&quot;document&quot;</span>]
)

grader_chain = grader_prompt | grader_llm.with_structured_output(RelevanceVerdict)

<span class="hljs-comment"># Replace the _evaluate_relevance() method in CRAGMiddleware</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">_evaluate_relevance</span>(<span class="hljs-params">self, query: <span class="hljs-built_in">str</span>, docs: <span class="hljs-built_in">list</span></span>) -&gt; <span class="hljs-type">Literal</span>[<span class="hljs-string">&quot;relevant&quot;</span>, <span class="hljs-string">&quot;ambiguous&quot;</span>, <span class="hljs-string">&quot;incorrect&quot;</span>]:
    <span class="hljs-string">&quot;&quot;&quot;Evaluate document relevance (returns structured result)&quot;&quot;&quot;</span>
    <span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> docs:
        <span class="hljs-keyword">return</span> <span class="hljs-string">&quot;incorrect&quot;</span>

    <span class="hljs-comment"># Evaluate only the Top-3 documents, taking the first 500 characters of each</span>
    doc_content = <span class="hljs-string">&quot;\n\n&quot;</span>.join([
        <span class="hljs-string">f&quot;[Document <span class="hljs-subst">{i+<span class="hljs-number">1</span>}</span>] <span class="hljs-subst">{doc.page_content[:<span class="hljs-number">500</span>]}</span>...&quot;</span>
        <span class="hljs-keyword">for</span> i, doc <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(docs[:<span class="hljs-number">3</span>])
    ])

    result = grader_chain.invoke({
        <span class="hljs-string">&quot;query&quot;</span>: query,
        <span class="hljs-string">&quot;document&quot;</span>: doc_content
    })

    <span class="hljs-comment"># Store the confidence score in logs or a monitoring system</span>
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[CRAG Evaluation] verdict=<span class="hljs-subst">{result.verdict}</span>, confidence=<span class="hljs-subst">{result.confidence:<span class="hljs-number">.2</span>f}</span>&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[CRAG Reasoning] <span class="hljs-subst">{result.reasoning}</span>&quot;</span>)

    <span class="hljs-comment"># Optional: store the evaluation result in Milvus for memory quality analysis</span>
    <span class="hljs-variable language_">self</span>._store_evaluation_metrics(query, result)

    <span class="hljs-keyword">return</span> result.verdict

<span class="hljs-keyword">def</span> <span class="hljs-title function_">_store_evaluation_metrics</span>(<span class="hljs-params">self, query: <span class="hljs-built_in">str</span>, verdict_result: RelevanceVerdict</span>):
    <span class="hljs-string">&quot;&quot;&quot;Store evaluation metrics in Milvus (for memory quality monitoring)&quot;&quot;&quot;</span>
    <span class="hljs-comment"># Example: store the evaluation result in a separate Collection for analysis</span>
    <span class="hljs-comment"># In actual use, you need to create the evaluation_metrics Collection</span>
    <span class="hljs-keyword">pass</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>2. 지식 개선 및 폴백</strong></p>
<p>모델 컨텍스트를 고품질로 유지하기 위해 세 가지 메커니즘이 함께 작동합니다:</p>
<ul>
<li><strong>지식 개선은</strong> 쿼리와 가장 관련성이 높은 문장을 추출하고 노이즈를 제거합니다.</li>
<li><strong>폴백 검색은</strong> 로컬 검색이 불충분할 때 트리거되며, Tavily를 통해 외부 지식을 가져옵니다.</li>
<li><strong>컨텍스트 병합은</strong> 내부 메모리와 외부 결과를 모델에 도달하기 전에 중복이 제거된 단일 컨텍스트 블록으로 결합합니다.</li>
</ul>
<h2 id="Tips-for-Running-CRAG-in-Production" class="common-anchor-header">프로덕션 환경에서 CRAG를 실행하기 위한 팁<button data-href="#Tips-for-Running-CRAG-in-Production" class="anchor-icon" translate="no">
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
    </button></h2><p>프로토타이핑을 넘어 프로덕션 단계로 넘어가면 다음 세 가지 영역이 가장 중요합니다.</p>
<h3 id="1-Cost-Pick-the-Right-Evaluator" class="common-anchor-header">1. 비용: 올바른 평가기 선택</h3><p>평가기는 모든 쿼리에서 실행되므로 지연 시간과 비용 모두에 가장 큰 영향을 미칩니다.</p>
<ul>
<li><strong>동시성이 높은 워크로드:</strong> T5-Large와 같이 미세 조정된 경량 모델은 지연 시간을 10~20ms로 유지하며 비용을 예측할 수 있습니다.</li>
<li><strong>트래픽이 적거나 프로토타입 제작:</strong> <code translate="no">gpt-4o-mini</code> 같은 호스팅 모델은 설정이 빠르고 운영 작업이 덜 필요하지만 지연 시간과 통화당 비용이 더 높습니다.</li>
</ul>
<h3 id="2-Observability-Instrument-from-Day-One" class="common-anchor-header">2. 관찰 가능성: 첫날부터 관찰 가능</h3><p>가장 어려운 프로덕션 문제는 이미 응답 품질이 저하되기 전까지는 알 수 없는 문제입니다.</p>
<ul>
<li><strong>인프라 모니터링:</strong> Milvus는 <a href="https://milvus.io/docs/monitor_overview.md">Prometheus와</a> 통합됩니다. 세 가지 메트릭으로 시작하세요: <code translate="no">milvus_query_latency_seconds</code>, <code translate="no">milvus_search_qps</code>, <code translate="no">milvus_insert_throughput</code> 을 참조하세요.</li>
<li><strong>애플리케이션 모니터링:</strong> CRAG 판정 분포, 웹 검색 트리거율, 신뢰도 점수 분포를 추적합니다. 이러한 신호가 없으면 품질 저하가 검색 불량으로 인한 것인지 평가자의 잘못된 판단으로 인한 것인지 알 수 없습니다.</li>
</ul>
<h3 id="3-Long-Term-Maintenance-Prevent-Memory-Contamination" class="common-anchor-header">3. 장기적인 유지 관리: 메모리 오염 방지</h3><p>에이전트가 오래 실행될수록 메모리에 오래되고 품질이 낮은 데이터가 더 많이 축적됩니다. 가드레일을 조기에 설정하세요:</p>
<ul>
<li><strong>사전 필터링:</strong> <code translate="no">confidence &gt; 0.7</code> 으로 표면 메모리만 필터링하여 품질이 낮은 콘텐츠가 평가자에게 도달하기 전에 차단합니다.</li>
<li><strong>시간 감쇠:</strong> 오래된 메모리의 비중을 점진적으로 줄입니다. 30일이 합리적인 시작 기본값이며, 사용 사례에 따라 조정할 수 있습니다.</li>
<li><strong>예약된 정리:</strong> 매주 작업을 실행하여 오래되고 신뢰도가 낮으며 검증되지 않은 메모리를 제거합니다. 이렇게 하면 오래된 데이터가 검색, 사용, 재저장되는 피드백 루프를 방지할 수 있습니다.</li>
</ul>
<h2 id="Wrapping-Up--and-a-Few-Common-Questions" class="common-anchor-header">마무리 - 그리고 몇 가지 일반적인 질문<button data-href="#Wrapping-Up--and-a-Few-Common-Questions" class="anchor-icon" translate="no">
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
    </button></h2><p>CRAG는 프로덕션 RAG에서 가장 고질적인 문제 중 하나인 관련성이 있어 보이지만 그렇지 않은 검색 결과를 해결합니다. 검색과 생성 사이에 평가 및 수정 단계를 삽입하여 잘못된 결과를 걸러내고, 외부 검색으로 부족한 부분을 채우고, 모델에 보다 깔끔한 컨텍스트를 제공하여 작업할 수 있도록 합니다.</p>
<p>하지만 CRAG가 프로덕션 환경에서 안정적으로 작동하려면 좋은 검색 로직만으로는 부족합니다. 멀티테넌트 격리, 하이브리드 검색, 진화하는 스키마를 처리할 수 있는 벡터 데이터베이스가 필요하며, 바로 이 점에서 <a href="https://milvus.io/intro">Milvus가</a> 적합합니다. 애플리케이션 측면에서는 올바른 평가기를 선택하고, 통합 가시성을 조기에 계측하며, 메모리 품질을 적극적으로 관리하는 것이 데모와 신뢰할 수 있는 시스템을 구분하는 요소입니다.</p>
<p>RAG 또는 에이전트 시스템을 구축하면서 검색 품질 문제가 발생하는 경우, 저희가 도와드리겠습니다:</p>
<ul>
<li><a href="https://slack.milvus.io/">Milvus Slack 커뮤니티에</a> 참여하여 질문하고, 아키텍처를 공유하고, 비슷한 문제를 해결하고 있는 다른 개발자들로부터 배워보세요.</li>
<li><a href="https://milvus.io/office-hours">20분 동안 진행되는 무료 Milvus 오피스 아워 세션을 예약하여</a> CRAG 설계, 하이브리드 검색, 멀티테넌트 확장 등 사용 사례를 팀과 함께 살펴보세요.</li>
<li>인프라 설정을 건너뛰고 바로 구축으로 넘어가고 싶다면, <a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a> (관리형 Milvus)에서 무료 티어를 통해 시작할 수 있습니다.</li>
</ul>
<hr>
<p>팀이 CRAG를 구현하기 시작할 때 자주 발생하는 몇 가지 질문입니다:</p>
<p><strong>CRAG는 단순히 RAG에 리랭커를 추가하는 것과 어떻게 다른가요?</strong></p>
<p>재랭커는 관련성에 따라 결과를 재정렬하지만 여전히 검색된 문서가 사용 가능하다고 가정합니다. CRAG는 여기서 더 나아가 검색된 콘텐츠가 실제로 쿼리에 대한 답변인지 평가하고, 그렇지 않은 경우 부분적으로 일치하는 부분을 수정하거나 웹 검색으로 보완하거나 결과를 완전히 폐기하는 등의 수정 조치를 취합니다. 이는 단순히 더 나은 정렬이 아니라 품질 관리 루프입니다.</p>
<p><strong>유사도 점수가 높으면 가끔 잘못된 문서가 반환되는 이유는 무엇인가요?</strong></p>
<p>임베딩 유사도는 벡터 공간에서 의미적 근접성을 측정하지만, 이는 질문에 대한 답변과는 다릅니다. Apache에서 HTTPS를 구성하는 방법에 대한 문서는 의미론적으로 Nginx에서 HTTPS에 대한 질문과 비슷하지만 도움이 되지 않습니다. CRAG는 벡터 거리뿐만 아니라 실제 쿼리와의 관련성을 평가하여 이를 파악합니다.</p>
<p><strong>CRAG를 위해 벡터 데이터베이스에서 무엇을 찾아야 하나요?</strong></p>
<p>하이브리드 검색(시맨틱 검색과 정확한 용어에 대한 키워드 매칭을 결합할 수 있도록), 멀티테넌트 격리(각 사용자 또는 상담원 세션이 자체 메모리 공간을 갖도록), 유연한 스키마(파이프라인이 발전함에 따라 다운타임 없이 <code translate="no">confidence</code> 또는 <code translate="no">verified</code> 같은 필드를 추가할 수 있도록) 등 세 가지가 가장 중요한 요소입니다.</p>
<p><strong>검색된 문서 중 관련성이 없는 것이 있으면 어떻게 되나요?</strong></p>
<p>CRAG는 그냥 포기하지 않습니다. 신뢰도가 0.5 이하로 떨어지면 웹 검색으로 돌아갑니다. 결과가 모호한 경우(0.5-0.9), 정제된 내부 문서와 외부 검색 결과를 병합합니다. 이 모델은 지식창고에 공백이 있는 경우에도 항상 작업할 수 있는 컨텍스트를 확보합니다.</p>
