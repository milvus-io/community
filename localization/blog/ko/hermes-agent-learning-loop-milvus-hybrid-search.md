---
id: hermes-agent-learning-loop-milvus-hybrid-search.md
title: Milvus 2.6 하이브리드 검색으로 헤르메스 에이전트의 학습 루프를 수정하는 방법
author: Min Yin
date: 2026-4-24
cover: >-
  assets.zilliz.com/hermes_agent_learning_loop_milvus_hybrid_search_md_2_e0b44ee562.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Hermes Agent, Milvus 2.6, hybrid search, agent memory, skill learning loop'
meta_title: |
  How to Fix Hermes Agent's Learning Loop with Milvus 2.6 Hybrid Search
desc: >-
  헤르메스 에이전트의 학습 루프가 사용 스킬을 기록하지만 FTS5 리트리버가 재구문된 쿼리를 놓칩니다. Milvus 2.6 하이브리드 검색에서
  세션 간 리콜이 수정되었습니다.
origin: 'https://milvus.io/blog/hermes-agent-learning-loop-milvus-hybrid-search.md'
---
<p><a href="https://github.com/NousResearch/hermes-agent"><strong>헤르메스 에이전트는</strong></a> <strong>최근 모든 곳에 존재하고 있습니다.</strong> Nous Research에서 개발한 Hermes는 자체 하드웨어에서 실행되는 자체 호스팅 개인 AI 에이전트로서(5달러의 VPS로 작동), 텔레그램과 같은 기존 채팅 채널을 통해 사용자와 대화할 수 있습니다.</p>
<p><strong>가장 큰 특징은 학습 루프가 내장되어 있다는 것입니다:</strong> 이 루프는 경험을 통해 스킬을 생성하고, 사용 중에 스킬을 개선하며, 과거 대화를 검색하여 재사용 가능한 패턴을 찾습니다. 다른 에이전트 프레임워크는 배포 전에 스킬을 직접 코딩합니다. Hermes의 스킬은 사용하면서 성장하며 반복되는 워크플로를 코드 변경 없이 재사용할 수 있습니다.</p>
<p><strong>문제는 Hermes의 검색이 키워드 전용이라는 점입니다.</strong> 정확한 단어는 일치시키지만 사용자가 원하는 의미는 일치시키지 못합니다. 사용자가 여러 세션에서 다른 단어를 사용하면 루프가 이를 연결할 수 없고 새로운 스킬이 작성되지 않습니다. 문서가 수백 개에 불과할 때는 이 정도의 차이는 견딜 수 있습니다. <strong>그 이상이면 루프는 자신의 기록을 찾을 수 없기 때문에 학습을 중단합니다.</strong></p>
<p><strong>이 문제는 Milvus 2.6에서 해결되었습니다.</strong> 이 <a href="https://milvus.io/docs/multi-vector-search.md">하이브리드 검색은</a> 단일 쿼리에서 의미와 정확한 키워드를 모두 포함하므로 루프가 마침내 여러 세션에 걸쳐 재구문된 정보를 연결할 수 있습니다. 소규모 클라우드 서버(월 5달러의 VPS로 실행)에서도 충분히 사용할 수 있을 만큼 가볍습니다. 검색 레이어 뒤에 밀버스 슬롯이 있으므로 학습 루프는 그대로 유지되므로 이를 교체해도 Hermes를 변경할 필요가 없습니다. 실행할 스킬은 여전히 헤르메스가 선택하고 검색할 스킬은 밀버스가 처리합니다.</p>
<p>하지만 검색이 작동하면 학습 루프는 검색하는 콘텐츠뿐만 아니라 검색 전략 자체를 스킬로 저장할 수 있기 때문에 더 깊은 보상을 얻을 수 있습니다. 이것이 바로 에이전트의 지식 작업이 여러 세션에 걸쳐 복합적으로 작용하는 방식입니다.</p>
<h2 id="Hermes-Agent-Architecture-How-Four-Layer-Memory-Powers-the-Skill-Learning-Loop" class="common-anchor-header">헤르메스 에이전트 아키텍처: 4계층 메모리로 스킬 학습 루프를 강화하는 방법<button data-href="#Hermes-Agent-Architecture-How-Four-Layer-Memory-Powers-the-Skill-Learning-Loop" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://github.com/NousResearch/hermes-agent"><strong>Hermes는</strong></a> <strong>4개의 메모리 계층으로 구성되어 있으며, L4 스킬은 이를 차별화하는 요소입니다.</strong></p>
<ul>
<li><strong>L1</strong> - 세션 컨텍스트, 세션 종료 시 지워짐</li>
<li><strong>L2</strong> - 지속되는 사실: 프로젝트 스택, 팀 규칙, 해결된 의사 결정</li>
<li><strong>L3</strong> - 로컬 파일을 통한 SQLite FTS5 키워드 검색</li>
<li><strong>L4</strong> - 워크플로를 마크다운 파일로 저장. 개발자가 배포 전에 코드로 작성하는 LangChain 도구나 AutoGPT 플러그인과 달리, L4 스킬은 자체 작성 방식으로 개발자가 작성하지 않고도 에이전트가 실제로 실행하는 것에서 성장합니다.</li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/hermes_agent_learning_loop_milvus_hybrid_search_md_3_3653368e99.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Why-Hermess-FTS5-Keyword-Retrieval-Breaks-the-Learning-Loop" class="common-anchor-header">Hermes의 FTS5 키워드 검색이 학습 루프를 끊는 이유<button data-href="#Why-Hermess-FTS5-Keyword-Retrieval-Breaks-the-Learning-Loop" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Hermes는 애초에 교차 세션 워크플로를 트리거하기 위해 검색이 필요합니다.</strong> 하지만 내장된 L3 계층은 의미가 아닌 리터럴 토큰만 일치시키는 SQLite FTS5를 사용합니다.</p>
<p><strong>사용자가 동일한 의도를 여러 세션에 걸쳐 다르게 표현하면 FTS5는 일치하는 항목을 놓칩니다.</strong> 학습 루프가 실행되지 않습니다. 새로운 스킬이 기록되지 않으며, 다음에 다시 같은 의도가 나오면 사용자는 다시 수작업으로 라우팅을 수행해야 합니다.</p>
<p>예: 지식창고에 "비동기 이벤트 루프, 비동기 작업 스케줄링, 비차단 I/O"가 저장되어 있습니다. 사용자가 "Python 동시성"을 검색합니다. FTS5는 문자 그대로 단어가 겹치지 않고 동일한 질문이라는 것을 알 수 있는 방법이 없는 히트 수가 0개를 반환합니다.</p>
<p>문서가 수백 개 미만일 때는 그 차이가 견딜 만합니다. 그 이상에서는 문서가 한 어휘를 사용하고 사용자가 다른 어휘로 질문하는데, FTS5는 그 사이에 연결 고리가 없습니다. <strong>검색할 수 없는 콘텐츠는 지식창고에 없는 것이 낫고, 학습 루프는 배울 것이 없습니다.</strong></p>
<h2 id="How-Milvus-26-Fixes-the-Retrieval-Gap-with-Hybrid-Search-and-Tiered-Storage" class="common-anchor-header">Milvus 2.6이 하이브리드 검색과 계층형 스토리지로 검색 격차를 해소하는 방법<button data-href="#How-Milvus-26-Fixes-the-Retrieval-Gap-with-Hybrid-Search-and-Tiered-Storage" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Milvus 2.6은 Hermes의 문제점에 맞는 두 가지 업그레이드를 제공합니다.</strong> <strong>하이브리드 검색은</strong> 한 번의 호출로 시맨틱 검색과 키워드 검색을 모두 처리하여 학습 루프를 차단합니다. <strong>계층형 스토리지는</strong> 전체 검색 백엔드를 Hermes가 구축한 것과 동일한 월 5달러의 VPS에서 실행할 수 있을 만큼 충분히 작게 유지합니다.</p>
<h3 id="What-Hybrid-Search-Solves-Finding-Relevant-Information" class="common-anchor-header">하이브리드 검색이 해결하는 문제: 관련 정보 찾기</h3><p>Milvus 2.6은 단일 쿼리에서 벡터 검색(시맨틱)과 <a href="https://milvus.io/docs/full-text-search.md">BM25 전체 텍스트 검색</a> (키워드)을 모두 실행한 다음, 두 개의 순위 목록을 상호 순위 <a href="https://milvus.io/docs/multi-vector-search.md">융합(RRF)</a>으로 병합하는 것을 지원합니다.</p>
<p>예를 들어, &quot;비동기화의 원리는 무엇인가요&quot;라고 질문하면 벡터 검색은 의미론적으로 관련된 콘텐츠를 찾아냅니다. &quot; <code translate="no">find_similar_task</code> 함수는 어디에 정의되어 있나요?&quot;라고 질문하면 BM25가 코드의 함수 이름과 정확하게 일치합니다. 특정 유형의 작업 내에 함수가 포함된 질문의 경우, 하이브리드 검색은 수작업으로 작성된 라우팅 로직 없이도 한 번의 호출로 올바른 결과를 반환합니다.</p>
<p>Hermes의 경우, 이것이 바로 학습 루프의 차단을 해제하는 것입니다. 두 번째 세션에서 의도를 다시 말하면 벡터 검색이 FTS5가 놓친 의미론적 일치를 포착합니다. 루프가 실행되고 새로운 스킬이 작성됩니다.</p>
<h3 id="What-Tiered-Storage-Solves-Cost" class="common-anchor-header">계층형 스토리지가 해결하는 문제: 비용</h3><p>순진한 벡터 데이터베이스는 전체 임베딩 인덱스를 RAM에 저장하기를 원하기 때문에 개인 배포를 더 크고 비싼 인프라로 밀어붙이게 됩니다. Milvus 2.6은 액세스 빈도에 따라 계층 간에 항목을 이동하는 3계층 스토리지로 이러한 문제를 방지합니다:</p>
<ul>
<li><strong>핫</strong> - 메모리</li>
<li><strong>Warm</strong> - SSD</li>
<li><strong>콜드</strong> - 오브젝트 스토리지</li>
</ul>
<p>핫 데이터만 상주 상태로 유지됩니다. 500개의 문서로 구성된 지식창고는 2GB의 RAM에 들어갑니다. 전체 검색 스택은 인프라 업그레이드 없이도 월 $5의 동일한 VPS Hermes 타깃에서 실행됩니다.</p>
<h2 id="Hermes-+-Milvus-System-Architecture" class="common-anchor-header">Hermes + Milvus: 시스템 아키텍처<button data-href="#Hermes-+-Milvus-System-Architecture" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>헤르메스가 실행할 스킬을 선택합니다. Milvus는 무엇을 검색할지 처리합니다.</strong> 두 시스템은 분리된 상태로 유지되며, Hermes의 인터페이스는 변경되지 않습니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/hermes_agent_learning_loop_milvus_hybrid_search_md_4_1794304940.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>흐름:</strong></p>
<ol>
<li>헤르메스가 사용자의 의도를 파악하여 스킬로 라우팅합니다.</li>
<li>스킬은 터미널 도구를 통해 검색 스크립트를 호출합니다.</li>
<li>이 스크립트는 Milvus를 실행하여 하이브리드 검색을 실행하고 소스 메타데이터와 함께 순위가 매겨진 청크를 반환합니다.</li>
<li>헤르메스가 답을 작성합니다. 메모리가 워크플로우를 기록합니다.</li>
<li>동일한 패턴이 여러 세션에서 반복되면 학습 루프가 새 스킬을 작성합니다.</li>
</ol>
<h2 id="How-to-Install-Hermes-and-Milvus-26" class="common-anchor-header">헤르메스 및 밀버스 2.6 설치 방법<button data-href="#How-to-Install-Hermes-and-Milvus-26" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>헤르메스 및</strong> <a href="https://milvus.io/docs/install_standalone-docker.md"><strong>밀버스 2.6 스탠드얼론을</strong></a><strong>설치한</strong><strong> 다음 밀도 및 BM25 필드가 있는 컬렉션을 생성합니다.</strong> 이것이 학습 루프가 실행되기 전의 전체 설정입니다.</p>
<h3 id="Install-Hermes" class="common-anchor-header">헤르메스 설치</h3><pre><code translate="no" class="language-bash">curl -fsSL https://raw.githubusercontent.com/NousResearch/hermes-agent/main/scripts/install.sh | bash
<button class="copy-code-btn"></button></code></pre>
<p><code translate="no">hermes</code> 을 실행하여 대화형 초기화 마법사로 들어갑니다:</p>
<ul>
<li><strong>LLM 제공업체</strong> - OpenAI, Anthropic, OpenRouter(OpenRouter에는 무료 모델이 있음)</li>
<li><strong>채널</strong> - 이 연습에서는 FLark 봇을 사용합니다.</li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/hermes_agent_learning_loop_milvus_hybrid_search_md_5_dceeae1519.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Run-Milvus-26-Standalone" class="common-anchor-header">Milvus 2.6 스탠드얼론 실행하기</h3><p>개인 에이전트에는 단일 노드 독립형으로 충분합니다:</p>
<pre><code translate="no" class="language-bash">curl -sfL https://raw.githubusercontent.com/milvus-io/milvus/master/scripts/standalone_embed.sh \
-o standalone_embed.sh
bash standalone_embed.sh start
<span class="hljs-comment"># Verify service status</span>
docker ps | grep milvus
<button class="copy-code-btn"></button></code></pre>
<h3 id="Create-the-Collection" class="common-anchor-header">컬렉션 만들기</h3><p>스키마 설계는 검색이 할 수 있는 일을 제한합니다. 이 스키마는 고밀도 벡터와 BM25 스파스 벡터를 나란히 실행합니다:</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient, DataType, Function, FunctionType
client = MilvusClient(
    uri=<span class="hljs-string">&quot;http://192.168.x.x:19530&quot;</span>,
)
schema = client.create_schema(auto_id=<span class="hljs-literal">True</span>, enable_dynamic_field=<span class="hljs-literal">True</span>)
schema.add_field(<span class="hljs-string">&quot;id&quot;</span>, DataType.INT64, is_primary=<span class="hljs-literal">True</span>)
<span class="hljs-comment"># Raw text (for BM25 full-text search)</span>
schema.add_field(
    <span class="hljs-string">&quot;text&quot;</span>,
    DataType.VARCHAR,
    max_length=<span class="hljs-number">8192</span>,
    enable_analyzer=<span class="hljs-literal">True</span>,
    enable_match=<span class="hljs-literal">True</span>
)
<span class="hljs-comment"># Dense vector (semantic search)</span>
schema.add_field(<span class="hljs-string">&quot;dense_vector&quot;</span>, DataType.FLOAT_VECTOR, dim=<span class="hljs-number">1536</span>)
<span class="hljs-comment"># Sparse vector (BM25 auto-generated, Milvus 2.6 feature)</span>
schema.add_field(<span class="hljs-string">&quot;sparse_vector&quot;</span>, DataType.SPARSE_FLOAT_VECTOR)
schema.add_field(<span class="hljs-string">&quot;source&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">512</span>)
schema.add_field(<span class="hljs-string">&quot;chunk_index&quot;</span>, DataType.INT32)
<span class="hljs-comment"># Tell Milvus to auto-convert text to sparse_vector via BM25</span>
bm25_function = Function(
    name=<span class="hljs-string">&quot;text_bm25&quot;</span>,
    function_type=FunctionType.BM25,
    input_field_names=[<span class="hljs-string">&quot;text&quot;</span>],
    output_field_names=[<span class="hljs-string">&quot;sparse_vector&quot;</span>],
)
schema.add_function(bm25_function)
index_params = client.prepare_index_params()
<span class="hljs-comment"># HNSW graph index (dense vector)</span>
index_params.add_index(
    field_name=<span class="hljs-string">&quot;dense_vector&quot;</span>,
    index_type=<span class="hljs-string">&quot;HNSW&quot;</span>,
    metric_type=<span class="hljs-string">&quot;COSINE&quot;</span>,
    params={<span class="hljs-string">&quot;M&quot;</span>: <span class="hljs-number">16</span>, <span class="hljs-string">&quot;efConstruction&quot;</span>: <span class="hljs-number">256</span>}
)
<span class="hljs-comment"># BM25 inverted index (sparse vector)</span>
index_params.add_index(
    field_name=<span class="hljs-string">&quot;sparse_vector&quot;</span>,
    index_type=<span class="hljs-string">&quot;SPARSE_INVERTED_INDEX&quot;</span>,
    metric_type=<span class="hljs-string">&quot;BM25&quot;</span>
)
client.create_collection(
    collection_name=<span class="hljs-string">&quot;hermes_milvus&quot;</span>,
    schema=schema,
    index_params=index_params
)
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/hermes_agent_learning_loop_milvus_hybrid_search_md_6_0646f46d36.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Hybrid-Search-Script" class="common-anchor-header">하이브리드 검색 스크립트</h3><pre><code translate="no" class="language-python"><span class="hljs-keyword">import</span> sys, json
<span class="hljs-keyword">from</span> openai <span class="hljs-keyword">import</span> OpenAI
<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient, AnnSearchRequest, RRFRanker

client = MilvusClient(<span class="hljs-string">&quot;http://192.168.x.x:19530&quot;</span>)
oai    = OpenAI()
COLLECTION = <span class="hljs-string">&quot;hermes_milvus&quot;</span>

<span class="hljs-keyword">def</span> <span class="hljs-title function_">hybrid_search</span>(<span class="hljs-params">query: <span class="hljs-built_in">str</span>, top_k: <span class="hljs-built_in">int</span> = <span class="hljs-number">5</span></span>) -&gt; <span class="hljs-built_in">list</span>[<span class="hljs-built_in">dict</span>]:
    <span class="hljs-comment"># 1. Vectorize query</span>
    dense_vec = oai.embeddings.create(
        model=<span class="hljs-string">&quot;text-embedding-3-small&quot;</span>,
        <span class="hljs-built_in">input</span>=query
    ).data[<span class="hljs-number">0</span>].embedding

    <span class="hljs-comment"># 2. Dense vector retrieval (semantic relevance)</span>
    dense_req = AnnSearchRequest(
        data=[dense_vec],
        anns_field=<span class="hljs-string">&quot;dense_vector&quot;</span>,
        param={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;COSINE&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;ef&quot;</span>: <span class="hljs-number">128</span>}},
        limit=top_k * <span class="hljs-number">2</span>       <span class="hljs-comment"># Widen candidate set, let RRF do final ranking</span>
    )

    <span class="hljs-comment"># 3. BM25 sparse vector retrieval (exact term matching)</span>
    bm25_req = AnnSearchRequest(
        data=[query],
        anns_field=<span class="hljs-string">&quot;sparse_vector&quot;</span>,
        param={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;BM25&quot;</span>},
        limit=top_k * <span class="hljs-number">2</span>
    )

    <span class="hljs-comment"># 4. RRF fusion ranking</span>
    results = client.hybrid_search(
        collection_name=COLLECTION,
        reqs=[dense_req, bm25_req],
        ranker=RRFRanker(k=<span class="hljs-number">60</span>),
        limit=top_k,
        output_fields=[<span class="hljs-string">&quot;text&quot;</span>, <span class="hljs-string">&quot;source&quot;</span>, <span class="hljs-string">&quot;doc_type&quot;</span>]
    )

    <span class="hljs-keyword">return</span> [
        {
            <span class="hljs-string">&quot;text&quot;</span>:     r.entity.get(<span class="hljs-string">&quot;text&quot;</span>),
            <span class="hljs-string">&quot;source&quot;</span>:   r.entity.get(<span class="hljs-string">&quot;source&quot;</span>),
            <span class="hljs-string">&quot;doc_type&quot;</span>: r.entity.get(<span class="hljs-string">&quot;doc_type&quot;</span>),
            <span class="hljs-string">&quot;score&quot;</span>:    <span class="hljs-built_in">round</span>(r.distance, <span class="hljs-number">4</span>)
        }
        <span class="hljs-keyword">for</span> r <span class="hljs-keyword">in</span> results[<span class="hljs-number">0</span>]
    ]

<span class="hljs-keyword">if</span> __name__ == <span class="hljs-string">&quot;__main__&quot;</span>:
    query= sys.argv[<span class="hljs-number">1</span>] <span class="hljs-keyword">if</span> <span class="hljs-built_in">len</span>(sys.argv) &gt; <span class="hljs-number">1</span> <span class="hljs-keyword">else</span> <span class="hljs-string">&quot;&quot;</span>
    top_k  = <span class="hljs-built_in">int</span>(sys.argv[<span class="hljs-number">2</span>]) <span class="hljs-keyword">if</span> <span class="hljs-built_in">len</span>(sys.argv) &gt; <span class="hljs-number">2</span> <span class="hljs-keyword">else</span> <span class="hljs-number">5</span>
    output = hybrid_search(query, top_k)
    <span class="hljs-built_in">print</span>(json.dumps(output, ensure_ascii=<span class="hljs-literal">False</span>, indent=<span class="hljs-number">2</span>))
<button class="copy-code-btn"></button></code></pre>
<p><strong>고밀도 요청은 후보 풀을 2배로 확장하여 RRF가 순위를 매길 수 있는 충분한 후보 풀을</strong> 확보합니다. <code translate="no">text-embedding-3-small</code> 은 검색 품질을 유지하는 가장 저렴한 OpenAI 임베딩으로, 예산이 허락한다면 <code translate="no">text-embedding-3-large</code> 으로 교체하세요.</p>
<p>환경과 지식창고가 준비되었으므로 다음 섹션에서는 학습 루프를 테스트해 보겠습니다.</p>
<h2 id="Hermes-Skill-Auto-Generation-in-Practice" class="common-anchor-header">실제 헤르메스 스킬 자동 생성<button data-href="#Hermes-Skill-Auto-Generation-in-Practice" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>두 개의 세션에서 학습 루프가 실제로 작동하는 모습을 보여줍니다.</strong> 첫 번째 세션에서는 사용자가 직접 스크립트의 이름을 지정합니다. 두 번째 세션에서는 스크립트에 이름을 지정하지 않고 동일한 질문을 합니다. 헤르메스가 패턴을 익히고 세 가지 스킬을 작성합니다.</p>
<h3 id="Session-1-Call-the-Script-by-Hand" class="common-anchor-header">세션 1: 손으로 스크립트 호출하기</h3><p>Lark에서 헤르메스를 엽니다. 스크립트 경로와 검색 대상을 지정합니다. 헤르메스가 터미널 도구를 호출하고 스크립트를 실행한 다음 소스 어트리뷰션이 포함된 답변을 반환합니다. <strong>아직 스킬이 없습니다. 이것은 일반 도구 호출입니다.</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/hermes_agent_learning_loop_milvus_hybrid_search_md_7_1c2d9261f4.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Session-2-Ask-Without-Naming-the-Script" class="common-anchor-header">세션 2: 스크립트 이름 지정 없이 질문하기</h3><p>대화를 지웁니다. 새롭게 시작하세요. 스크립트나 경로를 언급하지 않고 같은 범주의 질문을 해보세요.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/hermes_agent_learning_loop_milvus_hybrid_search_md_8_27253eda82.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Memory-Writes-First-Skill-Follows" class="common-anchor-header">기억이 먼저 쓰이고 기술이 따라갑니다.</h3><p><strong>학습 루프는 워크플로(스크립트, 인수, 반환 형태)를 기록하고 답을 반환합니다.</strong> 아직 스킬이 존재하지 않으므로 메모리가 추적을 유지합니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/hermes_agent_learning_loop_milvus_hybrid_search_md_9_a0768f84bd.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>두 번째 세션의 일치 여부는 루프에 패턴을 유지할 가치가 있음을 알려줍니다.</strong> 루프가 실행되면 세 개의 스킬이 기록됩니다:</p>
<table>
<thead>
<tr><th>스킬</th><th>역할</th></tr>
</thead>
<tbody>
<tr><td><code translate="no">hybrid-search-doc-qa</code></td><td>메모리에서 하이브리드 시맨틱 + 키워드 검색을 실행하고 답을 작성합니다.</td></tr>
<tr><td><code translate="no">milvus-docs-ingest-verification</code></td><td>문서가 지식창고에 수집되었는지 확인합니다.</td></tr>
<tr><td><code translate="no">terminal</code></td><td>셸 명령 실행: 스크립트, 환경 설정, 검사</td></tr>
</tbody>
</table>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/hermes_agent_learning_loop_milvus_hybrid_search_md_10_b68e35bc46.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>이 시점부터 <strong>사용자는 스킬 이름을 지정하지 않습니다.</strong> Hermes가 의도를 추론하여 스킬로 라우팅하고 메모리에서 관련 청크를 가져와 답을 작성합니다. 프롬프트에는 스킬 선택기가 없습니다.</p>
<p>대부분의 RAG(검색 증강 생성) 시스템은 저장 및 가져오기 문제를 해결하지만 가져오기 로직 자체는 애플리케이션 코드에 하드 코딩되어 있습니다. 다른 방식이나 새로운 시나리오로 요청하면 검색이 중단됩니다. Hermes는 가져오기 전략을 스킬로 저장하므로 가져오기 <strong>경로가 읽고, 편집하고, 버전을 변경할 수 있는 문서가</strong> 됩니다 <strong>.</strong> <code translate="no">💾 Memory updated · Skill 'hybrid-search-doc-qa' created</code> 줄은 설정 완료 마커가 아닙니다. <strong>에이전트가 행동 패턴을 장기기억에 커밋하는</strong> 것입니다.</p>
<h2 id="Hermes-vs-OpenClaw-Accumulation-vs-Orchestration" class="common-anchor-header">헤르메스 대 오픈클로: 누적 대 오케스트레이션<button data-href="#Hermes-vs-OpenClaw-Accumulation-vs-Orchestration" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Hermes와 OpenClaw는 서로 다른 문제에 대한 해답을 제시합니다.</strong> Hermes는 여러 세션에 걸쳐 메모리와 기술을 축적하는 단일 에이전트를 위해 구축되었습니다. OpenClaw는 복잡한 작업을 여러 조각으로 나누고 각 조각을 전문 에이전트에게 전달하기 위해 만들어졌습니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/hermes_agent_learning_loop_milvus_hybrid_search_md_11_afcb575d50.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>OpenClaw의 강점은 오케스트레이션입니다. 얼마나 많은 작업이 자동으로 수행되는지에 따라 최적화됩니다. Hermes의 강점은 축적입니다. 하나의 에이전트가 여러 세션에 걸쳐 기억하고 사용하면서 성장하는 기술을 갖추고 있습니다. Hermes는 장기적인 컨텍스트와 도메인 경험에 최적화됩니다.</p>
<p><strong>두 프레임워크가 쌓입니다.</strong> Hermes는 <code translate="no">~/.openclaw</code> 메모리와 스킬을 Hermes의 메모리 계층으로 가져오는 원스텝 마이그레이션 경로를 제공합니다. 오케스트레이션 스택이 맨 위에 있고 그 아래에 어큐뮬레이션 에이전트가 있을 수 있습니다.</p>
<p>OpenClaw 측면의 분할에 대해서는 <a href="https://milvus.io/blog/openclaw-formerly-clawdbot-moltbot-explained-a-complete-guide-to-the-autonomous-ai-agent.md">OpenClaw란 무엇인가요?</a> Milvus 블로그에서 <a href="https://milvus.io/blog/openclaw-formerly-clawdbot-moltbot-explained-a-complete-guide-to-the-autonomous-ai-agent.md">오픈 소스 AI 에이전트에 대한 전체 가이드를</a> 참조하세요.</p>
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
    </button></h2><p>Hermes의 학습 루프는 반복되는 워크플로를 재사용 가능한 스킬로 전환하지만, 검색이 여러 세션에 걸쳐 연결될 수 있는 경우에만 가능합니다. FTS5 키워드 검색은 그렇지 않습니다. 밀도 높은 벡터가 의미를 처리하고, BM25가 정확한 키워드를 처리하며, RRF가 이 두 가지를 병합하고, <a href="https://milvus.io/docs/tiered-storage-overview.md">계층화된 스토리지가</a> 전체 스택을 월 5달러의 VPS로 유지해 주는 <a href="https://milvus.io/docs/multi-vector-search.md"><strong>Milvus 2.6 하이브리드 검색은</strong></a> 가능합니다.</p>
<p>더 중요한 점은 검색이 작동하면 에이전트가 더 나은 답변만 저장하는 것이 아니라 더 나은 검색 전략을 스킬로 저장한다는 점입니다. 가져오기 경로는 사용할수록 개선되는 버전 관리가 가능한 문서가 됩니다. 이것이 바로 도메인 전문 지식을 축적하는 상담원과 매 세션마다 새로 시작하는 상담원의 차이점입니다. 다른 에이전트들이 이 문제를 어떻게 처리하는지(또는 처리하지 못하는지) 비교하려면 <a href="https://milvus.io/blog/claude-code-memory-memsearch.md">Claude Code의 메모리 시스템 설명을</a> 참조하세요 <a href="https://milvus.io/blog/claude-code-memory-memsearch.md">.</a></p>
<h2 id="Get-Started" class="common-anchor-header">시작하기<button data-href="#Get-Started" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>이 문서에 나와 있는 도구를 사용해 보세요:</strong></p>
<ul>
<li><a href="https://github.com/NousResearch/hermes-agent">GitHub의 헤르메스 에이전트</a> - 위에서 사용한 설치 스크립트, 공급자 설정 및 채널 구성.</li>
<li><a href="https://milvus.io/docs/install_standalone-docker.md">Milvus 2.6 독립 실행형 빠른 시작</a> - 지식창고 백엔드를 위한 단일 노드 Docker 배포.</li>
<li><a href="https://milvus.io/docs/multi-vector-search.md">Milvus 하이브리드 검색 튜토리얼</a> - 이 게시물의 스크립트와 일치하는 전체 밀도 + BM25 + RRF 예제.</li>
</ul>
<p><strong>Hermes + Milvus 하이브리드 검색에 대해 질문이 있으신가요?</strong></p>
<ul>
<li>다른 개발자들도 비슷한 스택을 구축하고 있는 <a href="https://discord.gg/milvus">Milvus Discord에</a> 참여하여 하이브리드 검색, 계층형 스토리지 또는 스킬 라우팅 패턴에 대해 질문하세요.</li>
<li>Milvus<a href="https://milvus.io/community#office-hours">오피스 아워 세션을 예약하여</a> Milvus 팀과 함께 상담원 + 지식창고 설정에 대해 안내받으세요.</li>
</ul>
<p><strong>셀프 호스트를 건너뛰고 싶으신가요?</strong></p>
<ul>
<li>하이브리드 검색 및 계층형 스토리지가 기본으로 제공되는 관리형 Milvus인 Zilliz Cloud에<a href="https://cloud.zilliz.com/signup">가입하거나</a> <a href="https://cloud.zilliz.com/login">로그인하세요</a>. 신규 업무용 이메일 계정에는 <strong>$100의 무료 크레딧이</strong> 제공됩니다.</li>
</ul>
<h2 id="Further-Reading" class="common-anchor-header">더 읽어보기<button data-href="#Further-Reading" class="anchor-icon" translate="no">
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
<li><a href="https://milvus.io/docs/release_notes.md">Milvus 2.6 릴리즈 노트</a> - 계층형 스토리지, 하이브리드 검색, 스키마 변경 사항</li>
<li><a href="https://zilliz.com/blog">Zilliz Cloud &amp; Milvus CLI + 공식 스킬</a> - Milvus 네이티브 상담원을 위한 운영 툴링</li>
<li>에이전트를<a href="https://zilliz.com/blog">위한 RAG 스타일의 지식 관리가 실패하는 이유</a> - 에이전트별 메모리 설계의 사례</li>
<li><a href="https://zilliz.com/blog">클로드 코드의 메모리 시스템은 생각보다 더 원시적입니다</a> - 다른 에이전트의 메모리 스택에 대한 비교 글</li>
</ul>
<h2 id="Frequently-Asked-Questions" class="common-anchor-header">자주 묻는 질문<button data-href="#Frequently-Asked-Questions" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="How-does-Hermes-Agents-Skill-Learning-Loop-actually-work" class="common-anchor-header">헤르메스 에이전트의 스킬 학습 루프는 실제로 어떻게 작동하나요?</h3><p>Hermes는 실행되는 모든 워크플로우(호출된 스크립트, 전달된 인수, 반환 형태 등)를 메모리 트레이스로 기록합니다. 두 개 이상의 세션에서 동일한 패턴이 나타나면 학습 루프가 실행되어 재사용 가능한 스킬, 즉 워크플로우를 반복 가능한 절차로 캡처하는 마크다운 파일을 작성합니다. 그 시점부터는 사용자가 이름을 지정하지 않아도 Hermes가 의도만으로 스킬로 라우팅합니다. 중요한 종속성은 검색입니다. 이전 세션의 흔적을 찾을 수 있을 때만 루프가 실행되기 때문에 키워드 전용 검색은 규모에 따라 병목 현상이 발생합니다.</p>
<h3 id="Whats-the-difference-between-hybrid-search-and-vector-only-search-for-agent-memory" class="common-anchor-header">상담원 메모리에 대한 하이브리드 검색과 벡터 전용 검색의 차이점은 무엇인가요?</h3><p>벡터 전용 검색은 의미는 잘 처리하지만 정확한 일치 항목을 놓칩니다. 개발자가 ConnectionResetError와 같은 오류 문자열이나 find_similar_task와 같은 함수 이름을 붙여 넣으면 순수 벡터 검색은 의미적으로는 관련이 있지만 잘못된 결과를 반환할 수 있습니다. 하이브리드 검색은 고밀도 벡터(시맨틱)와 BM25(키워드)를 결합하고 상호 순위 융합을 통해 두 결과 세트를 병합합니다. 쿼리가 모호한 의도("Python 동시성")에서 정확한 기호에 이르기까지 다양한 에이전트 메모리의 경우, 하이브리드 검색은 애플리케이션 계층에서 라우팅 로직 없이 한 번의 호출로 양쪽 끝을 모두 처리합니다.</p>
<h3 id="Can-I-use-Milvus-hybrid-search-with-AI-agents-other-than-Hermes" class="common-anchor-header">Milvus 하이브리드 검색을 Hermes 이외의 AI 에이전트와 함께 사용할 수 있나요?</h3><p>예. 통합 패턴은 에이전트가 검색 스크립트를 호출하고, 스크립트가 Milvus를 쿼리하며, 결과가 소스 메타데이터와 함께 순위가 매겨진 청크로 반환되는 일반적인 방식입니다. 도구 호출이나 셸 실행을 지원하는 모든 에이전트 프레임워크는 동일한 접근 방식을 사용할 수 있습니다. Hermes는 학습 루프가 특히 교차 세션 검색에 의존하여 실행되기 때문에 매우 적합하지만 Milvus는 어떤 에이전트가 호출하는지 알거나 신경 쓰지 않는 에이전트 독립적입니다.</p>
<h3 id="How-much-does-a-self-hosted-Milvus-+-Hermes-setup-cost-per-month" class="common-anchor-header">자체 호스팅 Milvus + Hermes 설정의 월별 비용은 얼마인가요?</h3><p>계층형 스토리지가 있는 2코어/4GB VPS의 단일 노드 Milvus 2.6 독립형은 약 <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>$5/월</mi><mi mathvariant="normal">.</mi><mi>OpenAI 텍스트 임베딩-3-소규모 비용</mi><mi>$5/월입니다</mi></mrow><annotation encoding="application/x-tex">.</annotation><annotation encoding="application/x-tex">OpenAI 텍스트 임베딩-3-소액 비용</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mord mathnormal">5/월</span><span class="mord">.</span><span class="mord mathnormal">OpenAItext</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">-</span></span></span></span><span class="mspace" style="margin-right:0.2222em;"></span> <span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.8889em;vertical-align:-0.1944em;"></span><span class="mord mathnormal" style="margin-right:0.03588em;">임베딩</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">-</span></span></span></span><span class="mspace" style="margin-right:0.2222em;"></span> <span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.7278em;vertical-align:-0.0833em;"></span> 3</span></span></span> <span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">-</span></span></span></span><span class="mspace" style="margin-right:0.2222em;"></span> <span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.6944em;"></span><span class="mord mathnormal" style="margin-right:0.01968em;">작은 비용</span></span></span></span>1M 토큰당 <span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord mathnormal">0</span><span class="mord mathnormal" style="margin-right:0.01968em;">.</span></span></span></span>02달러 - 개인 지식 베이스의 경우 월 몇 센트입니다. LLM 추론이 총 비용을 지배하며 검색 스택이 아닌 사용량에 따라 확장됩니다.</p>
