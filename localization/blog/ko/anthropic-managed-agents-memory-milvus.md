---
id: anthropic-managed-agents-memory-milvus.md
title: Milvus로 Anthropic의 관리형 에이전트에 장기 메모리를 추가하는 방법
author: Min Yin
date: 2026-4-21
cover: assets.zilliz.com/anthropic_managed_agents_memory_milvus_md_1_d3e5055603.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  anthropic managed agents, long-term memory, agent memory, milvus, vector
  database
meta_title: |
  Add Long-Term Memory to Anthropic's Managed Agents with Milvus
desc: >-
  앤트로픽의 관리형 에이전트는 에이전트를 안정적으로 만들었지만 모든 세션이 공백으로 시작됩니다. 세션 내에서 시맨틱 리콜과 상담원 간의 공유
  메모리를 위해 Milvus를 페어링하는 방법은 다음과 같습니다.
origin: 'https://milvus.io/blog/anthropic-managed-agents-memory-milvus.md'
---
<p>앤트로픽의 <a href="https://www.anthropic.com/engineering/managed-agents">관리형 에이전트는</a> 에이전트 인프라를 탄력적으로 만듭니다. 이제 200단계 작업은 하네스 충돌, 샌드박스 시간 초과 또는 비행 중 인프라 변경에도 사람의 개입 없이 살아남을 수 있으며, Anthropic은 디커플링 후 첫 토큰까지의 시간이 약 60%, p95는 90% 이상 감소했다고 보고합니다.</p>
<p>안정성이 해결하지 못하는 것은 메모리입니다. 200단계 코드 마이그레이션이 201단계에서 새로운 종속성 충돌에 부딪히면 마지막 단계가 어떻게 처리되었는지 효율적으로 돌아볼 수 없습니다. 한 고객을 위해 취약성 검사를 실행하는 에이전트는 다른 에이전트가 이미 한 시간 전에 동일한 사례를 해결했다는 사실을 전혀 알지 못합니다. 모든 세션은 백지 상태에서 시작되며, 병렬 두뇌는 다른 두뇌가 이미 해결한 내용에 액세스할 수 없습니다.</p>
<p>이 문제를 해결하는 방법은 <a href="https://milvus.io/">Milvus 벡터 데이터베이스를</a> 세션 내 시맨틱 리콜과 세션 간 공유 <a href="https://milvus.io/docs/milvus_for_agents.md">벡터 메모리 레이어인</a> Anthropic의 관리형 에이전트와 페어링하는 것입니다. 세션 계약은 그대로 유지되고, 하네스는 새로운 레이어가 하나 추가되며, 장기적인 에이전트 작업은 질적으로 다른 기능을 얻게 됩니다.</p>
<h2 id="What-Managed-Agents-Solved-and-What-They-Didnt" class="common-anchor-header">관리형 에이전트가 해결한 점(그리고 해결하지 못한 점)<button data-href="#What-Managed-Agents-Solved-and-What-They-Didnt" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>관리형 에이전트는 에이전트를 세 개의 독립적인 모듈로 분리하여 안정성을 해결했습니다. 단일 세션 내에서 시맨틱 리콜 또는 병렬 세션 전반의 공유 경험으로 메모리 문제를 해결하지 못했습니다.</strong> 다음은 무엇이 분리되었는지, 그리고 분리된 설계 내에서 메모리 갭이 어디에 있는지 설명합니다.</p>
<table>
<thead>
<tr><th>모듈</th><th>기능</th></tr>
</thead>
<tbody>
<tr><td><strong>세션</strong></td><td>일어난 모든 일에 대한 추가 전용 이벤트 로그입니다. 하네스 외부에 저장됩니다.</td></tr>
<tr><td><strong>하네스</strong></td><td>클라우드를 호출하고 클라우드의 도구 호출을 관련 인프라로 라우팅하는 루프입니다.</td></tr>
<tr><td><strong>샌드박스</strong></td><td>Claude가 코드를 실행하고 파일을 편집하는 격리된 실행 환경입니다.</td></tr>
</tbody>
</table>
<p>이 디자인을 작동하게 하는 리프레임은 Anthropic의 게시물에 명시적으로 설명되어 있습니다:</p>
<p><em>"세션은 클로드의 컨텍스트 창이 아닙니다."</em></p>
<p>컨텍스트 창은 토큰으로 제한되고, 모델 호출에 따라 재구성되며, 호출이 반환되면 폐기되는 임시적인 창입니다. 세션은 내구성이 있으며 하네스 외부에 저장되며 전체 작업에 대한 기록 시스템을 나타냅니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/anthropic_managed_agents_memory_milvus_md_3_edae1b022d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>하네스가 충돌하면 플랫폼은 <code translate="no">wake(sessionId)</code> 로 새 하네스를 시작합니다. 새 하네스는 <code translate="no">getSession(id)</code> 을 통해 이벤트 로그를 읽으며, 작업은 사용자 지정 복구 로직을 작성하거나 세션 수준 베이비시팅을 수행하지 않고 마지막으로 기록된 단계부터 시작합니다.</p>
<p>관리되는 에이전트 게시물에서 다루지 않고 주장하지도 않는 것은 에이전트가 기억해야 할 때 수행하는 작업입니다. 아키텍처를 통해 실제 워크로드를 푸시하는 순간 두 가지 격차가 나타납니다. 하나는 단일 세션 내에 존재하고 다른 하나는 여러 세션에 걸쳐 존재합니다.</p>
<h2 id="Problem-1-Why-Linear-Session-Logs-Fail-Past-a-Few-Hundred-Steps" class="common-anchor-header">문제 1: 선형 세션 로그가 몇 백 단계를 지나면 실패하는 이유<button data-href="#Problem-1-Why-Linear-Session-Logs-Fail-Past-a-Few-Hundred-Steps" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>순차적 읽기와 시맨틱 검색은 근본적으로 다른 워크로드이며</strong> <code translate="no">**getEvents()**</code> <strong>API는 첫 번째 워크로드만 제공하기</strong><strong>때문에 선형 세션 로그는 수백 단계를 지나면 실패합니다</strong> <strong>.</strong> 위치별로 슬라이싱하거나 타임스탬프를 찾는 것만으로는 "이 세션이 어디에서 중단되었는지"에 대한 답을 얻을 수 있습니다. 상담원이 긴 작업에서 예상되는 질문, 즉 이전에 이런 종류의 문제를 본 적이 있으며 이에 대해 무엇을 했느냐는 질문에 답하는 것만으로는 충분하지 않습니다.</p>
<p>200단계에서 새로운 종속성 충돌에 부딪힌 코드 마이그레이션을 생각해 보세요. 자연스럽게 뒤를 돌아보게 됩니다. 상담원이 동일한 작업에서 이전에 비슷한 문제를 겪은 적이 있나요? 어떤 접근 방식을 시도했나요? 해결되었나요, 아니면 다른 다운스트림으로 회귀했나요?</p>
<p><code translate="no">getEvents()</code> 을 사용하면 두 가지 방법으로 답할 수 있으며 둘 다 좋지 않습니다:</p>
<table>
<thead>
<tr><th>옵션</th><th>문제</th></tr>
</thead>
<tbody>
<tr><td>모든 이벤트를 순차적으로 스캔</td><td>200단계에서 느림. 2,000단계에서 불가능.</td></tr>
<tr><td>컨텍스트 창에 스트림의 큰 조각을 덤프합니다.</td><td>토큰 비용이 많이 들고, 규모에 따라 불안정하며, 현재 단계에 대한 에이전트의 실제 작업 메모리를 많이 차지합니다.</td></tr>
</tbody>
</table>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/anthropic_managed_agents_memory_milvus_md_4_2ac29b32af.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>이 세션은 복구 및 감사에는 좋지만 "이전에 본 적이 있는지"를 지원하는 인덱스로 구축되지 않았습니다. 장기 작업에서는 이러한 질문이 더 이상 선택 사항이 아닙니다.</p>
<h2 id="Solution-1-How-to-Add-Semantic-Memory-to-a-Managed-Agents-Session" class="common-anchor-header">해결 방법 1: 관리되는 상담원의 세션에 시맨틱 메모리를 추가하는 방법<button data-href="#Solution-1-How-to-Add-Semantic-Memory-to-a-Managed-Agents-Session" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>세션 로그와 함께 Milvus 컬렉션을 추가하고</strong> <code translate="no">**emitEvent**</code><strong>에서 이중 쓰기</strong> 세션 계약은 그대로 유지되고 하네스는 자체 과거에 대한 시맨틱 쿼리를 얻습니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/anthropic_managed_agents_memory_milvus_md_5_404a1048aa.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Anthropic의 설계는 바로 이 점을 위한 여지를 남겨두고 있습니다. 그들의 게시물에 따르면 "가져온 이벤트는 Claude의 컨텍스트 창으로 전달되기 전에 하네스에서 변환될 수도 있습니다. 이러한 변환은 컨텍스트 구성 및 컨텍스트 엔지니어링을 포함하여 하네스가 인코딩하는 모든 것이 될 수 있습니다." 컨텍스트 엔지니어링은 하니스에 존재하며 세션은 내구성과 쿼리 가능성만 보장하면 됩니다.</p>
<p>패턴: <code translate="no">emitEvent</code> 이 실행될 때마다 하네스는 인덱싱할 가치가 있는 이벤트에 대한 <a href="https://zilliz.com/learn/everything-you-need-to-know-about-vector-embeddings">벡터 임베딩을</a> 계산하고 이를 Milvus 컬렉션에 삽입합니다.</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient

milvus_client = MilvusClient(uri=<span class="hljs-string">&quot;http://localhost:19530&quot;</span>)

<span class="hljs-comment"># Only index high-signal events. Tool retries and intermediate states are noise.</span>
INDEXABLE_EVENT_TYPES = {<span class="hljs-string">&quot;decision&quot;</span>, <span class="hljs-string">&quot;strategy&quot;</span>, <span class="hljs-string">&quot;resolution&quot;</span>, <span class="hljs-string">&quot;error_handling&quot;</span>}

<span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">emit_event</span>(<span class="hljs-params">session_id: <span class="hljs-built_in">str</span>, event: <span class="hljs-built_in">dict</span></span>):
    <span class="hljs-comment"># Original path: append to the session event stream.</span>
    <span class="hljs-keyword">await</span> session_store.append(session_id, event)

    <span class="hljs-comment"># Extended path: embed the event content and insert into Milvus.</span>
    <span class="hljs-keyword">if</span> event[<span class="hljs-string">&quot;type&quot;</span>] <span class="hljs-keyword">in</span> INDEXABLE_EVENT_TYPES:
        embedding = <span class="hljs-keyword">await</span> embed(event[<span class="hljs-string">&quot;content&quot;</span>])
        milvus_client.insert(
            collection_name=<span class="hljs-string">&quot;agent_memory&quot;</span>,
            data=[{
                <span class="hljs-string">&quot;vector&quot;</span>:     embedding,
                <span class="hljs-string">&quot;session_id&quot;</span>: session_id,
                <span class="hljs-string">&quot;step&quot;</span>:       event[<span class="hljs-string">&quot;step&quot;</span>],
                <span class="hljs-string">&quot;event_type&quot;</span>: event[<span class="hljs-string">&quot;type&quot;</span>],
                <span class="hljs-string">&quot;content&quot;</span>:    event[<span class="hljs-string">&quot;content&quot;</span>],
            }]
        )
<button class="copy-code-btn"></button></code></pre>
<p>에이전트가 200단계에 도달하여 이전 결정을 불러와야 할 때 쿼리는 해당 세션으로 범위가 지정된 <a href="https://zilliz.com/glossary/vector-similarity-search">벡터 검색입니다</a>:</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">recall_similar</span>(<span class="hljs-params">query: <span class="hljs-built_in">str</span>, session_id: <span class="hljs-built_in">str</span>, top_k: <span class="hljs-built_in">int</span> = <span class="hljs-number">5</span></span>):
    query_vector = <span class="hljs-keyword">await</span> embed(query)
    results = milvus_client.search(
        collection_name=<span class="hljs-string">&quot;agent_memory&quot;</span>,
        data=[query_vector],
        <span class="hljs-built_in">filter</span>=<span class="hljs-string">f&#x27;session_id == &quot;<span class="hljs-subst">{session_id}</span>&quot;&#x27;</span>,
        limit=top_k,
        output_fields=[<span class="hljs-string">&quot;step&quot;</span>, <span class="hljs-string">&quot;event_type&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>]
    )
    <span class="hljs-keyword">return</span> results[<span class="hljs-number">0</span>]  <span class="hljs-comment"># top_k most relevant past events</span>
<button class="copy-code-btn"></button></code></pre>
<p>이 제품이 배송되기 전에 세 가지 생산 세부 정보가 중요합니다:</p>
<ul>
<li><strong>색인할 대상을 선택합니다.</strong> 모든 이벤트에 임베딩이 필요한 것은 아닙니다. 도구 호출 중간 상태, 재시도 로그, 반복적인 상태 이벤트는 검색 품질을 개선하는 것보다 더 빨리 검색 품질을 오염시킵니다. <code translate="no">INDEXABLE_EVENT_TYPES</code> 정책은 전역이 아니라 작업에 따라 달라집니다.</li>
<li><strong>일관성 경계를 정의하세요.</strong> 세션 추가와 Milvus 삽입 사이에 하네스가 충돌하는 경우 한 레이어가 다른 레이어보다 잠시 앞서 있습니다. 창은 작지만 실제입니다. 기대하지 말고 조정 경로(재시작 시 재시도, 미리 쓰기 로그 또는 최종 조정)를 선택하세요.</li>
<li><strong>임베딩 지출을 제어하세요.</strong> 모든 단계에서 외부 임베딩 API를 동시에 호출하는 200단계 세션은 아무도 계획하지 않은 인보이스를 생성합니다. 임베딩을 대기열에 추가하고 일괄적으로 비동기식으로 전송하세요.</li>
</ul>
<p>이를 통해 리콜은 벡터 검색에 몇 밀리초, 임베딩 호출에 100밀리초 미만이 소요됩니다. 상담원이 마찰을 인지하기 전에 가장 관련성이 높은 상위 5개의 과거 이벤트가 컨텍스트에 도착합니다. 세션은 내구성 있는 로그로서 원래의 역할을 유지하며, 하네스는 순차적으로가 아니라 의미론적으로 과거를 쿼리할 수 있는 기능을 얻게 됩니다. 이는 API 표면에서의 사소한 변화이며 에이전트가 장기적인 작업에서 수행할 수 있는 작업의 구조적 변화입니다.</p>
<h2 id="Problem-2-Why-Parallel-Claude-Agents-Cant-Share-Experience" class="common-anchor-header">문제 2: 병렬 클로드 에이전트가 경험을 공유할 수 없는 이유<button data-href="#Problem-2-Why-Parallel-Claude-Agents-Cant-Share-Experience" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>관리 상담원 세션은 설계상 격리되어 있기 때문에 병렬 클로드 상담원은 경험을 공유할 수 없습니다. 수평적 확장을 깔끔하게 만드는 동일한 고립으로 인해 모든 두뇌가 다른 두뇌로부터 학습할 수 없습니다.</strong></p>
<p>디커플링된 하네스에서는 두뇌가 상태 없이 독립적으로 작동합니다. 이러한 격리로 인해 대기 시간이 길어지고, 모든 세션이 다른 세션에 대해 알 수 없게 됩니다.</p>
<p>에이전트 A는 한 고객을 위해 까다로운 SQL 인젝션 벡터를 진단하는 데 40분을 소비합니다. 한 시간 후 에이전트 B는 다른 고객에 대한 동일한 사례를 선택하고 동일한 막다른 골목에서 동일한 도구 호출을 실행하여 동일한 답변에 도달하는 데 40분을 소비합니다.</p>
<p>가끔씩 에이전트를 실행하는 한 명의 사용자에게는 컴퓨팅 낭비입니다. 매일 여러 고객을 위해 코드 검토, 취약성 검사, 문서 생성에 걸쳐 수십 개의 동시 실행 <a href="https://zilliz.com/glossary/ai-agents">AI 에이전트를</a> 실행하는 플랫폼의 경우, 비용은 구조적으로 증가합니다.</p>
<p>모든 세션이 생성하는 경험이 세션이 종료되는 순간 사라진다면 인텔리전스는 일회용이 됩니다. 이런 방식으로 구축된 플랫폼은 선형적으로 확장되지만 시간이 지나도 인간 엔지니어처럼 더 나은 기능을 제공하지 못합니다.</p>
<h2 id="Solution-2-How-to-Build-a-Shared-Agent-Memory-Pool-with-Milvus" class="common-anchor-header">솔루션 2: Milvus로 공유 에이전트 메모리 풀을 구축하는 방법<button data-href="#Solution-2-How-to-Build-a-Shared-Agent-Memory-Pool-with-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>모든 하네스가 시작 시 읽고 종료 시 쓰는 하나의 벡터 컬렉션을 테넌트별로 파티션하여 고객 간 누수 없이 세션 전반에서 경험 풀을 구축하세요.</strong></p>
<p>세션이 종료되면 주요 결정, 직면한 문제, 효과가 있었던 접근 방식이 공유 Milvus 컬렉션으로 푸시됩니다. 새로운 두뇌가 초기화되면 하네스는 설정의 일부로 시맨틱 쿼리를 실행하고 가장 일치하는 과거 경험을 컨텍스트 창에 삽입합니다. 새 에이전트의 첫 번째 단계는 모든 이전 에이전트의 학습을 상속합니다.</p>
<p>두 가지 엔지니어링 결정을 통해 프로토타입에서 프로덕션 단계로 넘어갑니다.</p>
<h3 id="Isolating-Tenants-with-the-Milvus-Partition-Key" class="common-anchor-header">Milvus 파티션 키를 사용하여 테넌트 격리하기</h3><p><code translate="no">**tenant_id**</code><strong></strong><strong>으로 파티션하면</strong><strong> 고객 A의 상담원 경험은 고객 B의 경험과 물리적으로 같은 파티션에 존재하지 않습니다. 이는 쿼리 규칙이 아닌 데이터 계층에서의 격리입니다.</strong></p>
<p>A사의 코드베이스에 대한 A사의 작업은 B사의 상담원이 절대로 검색할 수 없어야 합니다. Milvus의 <a href="https://milvus.io/docs/use-partition-key.md">파티션 키는</a> 테넌트당 두 번째 컬렉션과 애플리케이션 코드의 샤딩 로직 없이 단일 컬렉션에서 이를 처리합니다.</p>
<pre><code translate="no" class="language-python"><span class="hljs-comment"># Declare partition key at schema creation.</span>
schema.add_field(
    field_name=<span class="hljs-string">&quot;tenant_id&quot;</span>,
    datatype=DataType.VARCHAR,
    max_length=<span class="hljs-number">64</span>,
    is_partition_key=<span class="hljs-literal">True</span>   <span class="hljs-comment"># Automatic per-tenant partitioning.</span>
)

<span class="hljs-comment"># Every query filters by tenant. Isolation is automatic.</span>
results = milvus_client.search(
    collection_name=<span class="hljs-string">&quot;shared_agent_memory&quot;</span>,
    data=[query_vector],
    <span class="hljs-built_in">filter</span>=<span class="hljs-string">f&#x27;tenant_id == &quot;<span class="hljs-subst">{current_tenant}</span>&quot;&#x27;</span>,
    limit=<span class="hljs-number">5</span>,
    output_fields=[<span class="hljs-string">&quot;content&quot;</span>, <span class="hljs-string">&quot;step&quot;</span>, <span class="hljs-string">&quot;session_id&quot;</span>]
)
<button class="copy-code-btn"></button></code></pre>
<p>쿼리 필터가 올바르게 작성되어서가 아니라(작성되어야 하지만) 데이터가 물리적으로 고객 B의 것과 동일한 파티션에 존재하지 않기 때문에 고객 A의 상담원 경험이 고객 B의 쿼리에 나타나지 않습니다. 하나의 컬렉션을 운영하고, 쿼리 계층에서는 논리적 격리를 적용하고, 파티션 계층에서는 물리적 격리를 적용합니다.</p>
<p>파티션 키가 적합한 경우와 별도의 컬렉션 또는 데이터베이스가 적합한 경우에 대한 <a href="https://milvus.io/docs/multi_tenancy.md">멀티테넌시 전략 문서와</a> 프로덕션 배포 노트에 대한 <a href="https://milvus.io/blog/build-multi-tenancy-rag-with-milvus-best-practices-part-one.md">멀티테넌시 RAG 패턴 가이드를</a> 참조하세요.</p>
<h3 id="Why-Agent-Memory-Quality-Needs-Ongoing-Work" class="common-anchor-header">상담원 메모리 품질에 지속적인 작업이 필요한 이유</h3><p><strong>한 번 성공했던 결함이 있는 해결 방법이 다시 재생되고 강화되며, 더 이상 사용되지 않는 종속성에 연결된 오래된 항목이 이를 상속하는 에이전트를 계속 오도하는 등 메모리 품질은 시간이 지남에 따라 저하됩니다. 방어는 데이터베이스 기능이 아니라 운영 프로그램입니다.</strong></p>
<p>에이전트가 결함이 있는 해결 방법을 우연히 발견하여 한 번 성공하는 경우가 있습니다. 공유 풀에 기록됩니다. 다음 에이전트가 이를 검색하여 재생하고 두 번째 '성공' 사용 기록으로 잘못된 패턴을 강화합니다.</p>
<p>오래된 항목은 동일한 경로의 느린 버전을 따릅니다. 6개월 전에 사용 중단된 종속성 버전에 고정된 수정 사항이 계속 검색되어 이를 상속하는 에이전트를 계속 오도합니다. 풀이 오래되고 사용량이 많을수록 이러한 문제가 더 많이 누적됩니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/anthropic_managed_agents_memory_milvus_md_6_24f71b1c21.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>세 가지 운영 프로그램이 이를 방어합니다:</p>
<ul>
<li><strong>신뢰도 점수.</strong> 메모리가 다운스트림 세션에서 얼마나 자주 성공적으로 적용되었는지 추적합니다. 리플레이에서 실패한 항목은 소멸시킵니다. 반복적으로 성공한 항목은 승격시킵니다.</li>
<li><strong>시간 가중치.</strong> 최근 경험을 선호합니다. 주요 종속성 버전 범프와 관련이 있는 것으로 알려진 부실 임계값을 초과한 항목은 폐기합니다.</li>
<li><strong>사람이 직접 확인합니다.</strong> 검색 빈도가 높은 항목은 활용도가 높습니다. 한 번 틀린 항목은 여러 번 틀린 것이므로 사람의 검토가 가장 빨리 효과를 발휘합니다.</li>
</ul>
<p>Milvus만으로는 이 문제를 해결하지 못하며, Mem0, Zep 또는 다른 메모리 제품도 마찬가지입니다. 하나의 풀에 많은 테넌트를 적용하고 테넌트 간 누수가 없도록 하는 것은 한 번 설계하면 됩니다. 이 풀을 정확하고 최신 상태로 유지하며 유용하게 사용하는 것은 사전 구성된 데이터베이스가 제공되지 않는 지속적인 운영 작업입니다.</p>
<h2 id="Takeaways-What-Milvus-Adds-to-Anthropics-Managed-Agents" class="common-anchor-header">테이크어웨이: Milvus가 Anthropic의 관리형 에이전트에 추가한 기능<button data-href="#Takeaways-What-Milvus-Adds-to-Anthropics-Managed-Agents" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Milvus는 세션 내 시맨틱 리콜과 에이전트 간 공유 메모리를 추가하여 관리형 에이전트를 안정적이지만 잊어버리기 쉬운 플랫폼에서 시간이 지남에 따라 경험을 복합적으로 제공하는 플랫폼으로 탈바꿈시켰습니다.</strong></p>
<p>관리형 상담원은 두뇌와 손이 모두 가축이며, 어느 한쪽이 작업을 수행하지 않으면 죽는다는 신뢰성 문제에 명쾌하게 답했습니다. 이것이 바로 인프라 문제였고 Anthropic은 이를 잘 해결했습니다.</p>
<p>남은 것은 성장 문제였습니다. 인간 엔지니어는 시간이 지남에 따라 복잡해지고, 수년간의 작업이 패턴 인식으로 바뀌며, 모든 작업에 대해 첫 번째 원칙에 따라 추론하지 않습니다. 하지만 오늘날의 관리형 상담원은 모든 세션이 백지 상태에서 시작하기 때문에 그렇지 않습니다.</p>
<p>작업 내에서 시맨틱 리콜을 위해 세션을 Milvus에 연결하고 공유 벡터 컬렉션에서 여러 두뇌의 경험을 풀링하면 상담원이 실제로 사용할 수 있는 과거를 얻을 수 있습니다. Milvus를 연결하는 것은 인프라 부분이고, 잘못된 기억을 정리하고 오래된 기억을 폐기하며 테넌트 경계를 적용하는 것은 운영 부분입니다. 이 두 가지가 모두 제자리를 잡으면 기억의 형태는 더 이상 부담이 아닌 복리 자본이 됩니다.</p>
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
    </button></h2><ul>
<li><strong>로컬에서 사용해 보세요:</strong> <a href="https://milvus.io/docs/milvus_lite.md">Milvus Lite로</a> 임베디드 Milvus 인스턴스를 스핀업하세요. 도커나 클러스터 없이 <code translate="no">pip install pymilvus</code>. 프로덕션 워크로드는 필요할 때 <a href="https://milvus.io/docs/install_standalone-docker.md">Milvus 독립형 또는 분산형으로</a> 업그레이드할 수 있습니다.</li>
<li><strong>설계 근거를 읽어보세요:</strong> 앤트로픽의 <a href="https://www.anthropic.com/engineering/managed-agents">관리형 에이전트 엔지니어링 게시물에서</a> 세션, 하네스 및 샌드박스 분리에 대해 자세히 설명합니다.</li>
<li><strong>질문이 있으신가요?</strong> <a href="https://discord.com/invite/8uyFbECzPX">Milvus Discord</a> 커뮤니티에 참여하여 에이전트 메모리 설계에 대해 토론하거나 <a href="https://milvus.io/office-hours">Milvus 오피스 아워</a> 세션을 예약하여 워크로드를 살펴보세요.</li>
<li><strong>관리형 서비스를 선호하시나요?</strong> 파티션 키, 확장 및 멀티 테넌시가 기본으로 제공되는 호스팅 Milvus를 위해 <a href="https://cloud.zilliz.com/signup">Zilliz Cloud에 가입</a> (또는 <a href="https://cloud.zilliz.com/login">로그인</a>)하세요. 신규 계정에는 업무용 이메일에 무료 크레딧이 제공됩니다.</li>
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
    </button></h2><p><strong>질문: 앤트로픽의 관리형 에이전트에서 세션과 컨텍스트 창의 차이점은 무엇인가요?</strong></p>
<p>컨텍스트 창은 단일 클로드 호출에 표시되는 토큰의 임시 집합입니다. 바인딩되어 있으며 모델 호출에 따라 재설정됩니다. 세션은 하네스 외부에 저장된 전체 작업에서 발생한 모든 일의 내구성 있는 추가 전용 이벤트 로그입니다. 하네스가 충돌하면 <code translate="no">wake(sessionId)</code> 세션 로그를 읽고 재개하는 새 하네스를 스폰합니다. 세션은 기록 시스템이고 컨텍스트 창은 작업 메모리입니다. 세션은 컨텍스트 창이 아닙니다.</p>
<p><strong>질문: Claude 세션 전반에서 상담원 메모리를 유지하려면 어떻게 해야 하나요?</strong></p>
<p>세션 자체는 이미 영구적이며 <code translate="no">getSession(id)</code> 에서 검색하는 것입니다. 일반적으로 누락되는 것은 쿼리 가능한 장기 메모리입니다. 이 패턴은 신호가 강한 이벤트(의사 결정, 해결, 전략)를 Milvus와 같은 벡터 데이터베이스( <code translate="no">emitEvent</code>)에 임베드한 다음 검색 시 의미적 유사성을 기준으로 쿼리하는 것입니다. 이렇게 하면 Anthropic이 제공하는 내구성 있는 세션 로그와 수백 개의 단계를 되돌아볼 수 있는 시맨틱 리콜 레이어가 모두 제공됩니다.</p>
<p><strong>질문: 여러 명의 Claude 에이전트가 메모리를 공유할 수 있나요?</strong></p>
<p>기본적으로 불가능합니다. 각 관리형 상담원 세션은 설계상 분리되어 있으므로 수평적으로 확장할 수 있습니다. 에이전트 간에 메모리를 공유하려면 각 하네스가 시작할 때 읽고 종료할 때 쓰는 공유 벡터 컬렉션(예: Milvus)을 추가하세요. Milvus의 파티션 키 기능을 사용하여 테넌트를 격리하여 고객 A의 상담원 메모리가 고객 B의 세션으로 유출되지 않도록 하세요.</p>
<p><strong>질문: AI 상담원 메모리에 가장 적합한 벡터 데이터베이스는 무엇인가요?</strong></p>
<p>정직한 대답은 규모와 배포 형태에 따라 다릅니다. 프로토타입 및 소규모 워크로드의 경우 Milvus Lite와 같은 로컬 임베디드 옵션이 인프라 없이 프로세스 중에 실행됩니다. 여러 테넌트에 걸친 프로덕션 에이전트의 경우, 성숙한 멀티테넌시(파티션 키, 필터링된 검색), 하이브리드 검색(벡터+스칼라+키워드), 수백만 개의 벡터에서 밀리초의 지연 시간을 지원하는 데이터베이스가 필요합니다. Milvus는 이러한 규모의 벡터 워크로드를 위해 특별히 설계되었기 때문에 LangChain, Google ADK, Deep Agents 및 OpenAgents에 구축된 프로덕션 에이전트 메모리 시스템에 표시됩니다.</p>
