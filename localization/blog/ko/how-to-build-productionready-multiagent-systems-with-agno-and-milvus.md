---
id: how-to-build-productionready-multiagent-systems-with-agno-and-milvus.md
title: 아그노와 밀버스로 프로덕션 준비된 멀티 에이전트 시스템을 구축하는 방법
author: Min Yin
date: 2026-02-10T00:00:00.000Z
cover: assets.zilliz.com/cover_b5fc8a3c48.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  production-ready multi-agent systems, Agno framework, Milvus vector database,
  AgentOS deployment, LLM agent architecture
meta_title: |
  How to Build Production-Ready Multi-Agent Systems with Agno and Milvus
desc: >-
  실제 워크로드를 위해 Agno, AgentOS 및 Milvus를 사용하여 프로덕션 지원 멀티 에이전트 시스템을 구축, 배포 및 확장하는
  방법을 알아보세요.
origin: >-
  https://milvus.io/blog/how-to-build-productionready-multiagent-systems-with-agno-and-milvus.md
---
<p>AI 에이전트를 구축해 본 적이 있다면 데모는 훌륭하게 작동하지만 프로덕션에 적용하는 것은 완전히 다른 이야기라는 벽에 부딪힌 적이 있을 것입니다.</p>
<p>이전 게시물에서 에이전트 메모리 관리와 순위 재지정에 대해 다루었습니다. 이제 실제로 프로덕션 환경에서 에이전트를 구축하는 더 큰 문제를 해결해 보겠습니다.</p>
<p>현실은 이렇습니다. 프로덕션 환경은 지저분합니다. 단일 에이전트로는 거의 해결되지 않기 때문에 멀티 에이전트 시스템이 어디에나 존재합니다. 하지만 현재 사용 가능한 프레임워크는 데모는 잘 되지만 실제 부하가 걸리면 중단되는 가벼운 프레임워크와 학습과 구축에 오랜 시간이 걸리는 강력한 프레임워크의 두 가지 진영으로 나뉘는 경향이 있습니다.</p>
<p>저는 최근 <a href="https://github.com/agno-agi/agno">아그노를</a> 실험해 봤는데, 과도한 복잡성 없이 프로덕션 준비에 초점을 맞춘 합리적인 중간 지점에 있는 것 같습니다. 이 프로젝트는 몇 달 만에 37,000개 이상의 GitHub 별을 얻었으며, 다른 개발자들도 유용하다고 생각하는 것으로 보입니다.</p>
<p>이 글에서는 <a href="https://milvus.io/">Milvus를</a> 메모리 레이어로 사용하는 Agno를 사용하여 멀티 에이전트 시스템을 구축하면서 배운 점을 공유하고자 합니다. LangGraph와 같은 대안과 Agno를 어떻게 비교하는지 살펴보고 직접 사용해 볼 수 있는 완전한 구현 과정을 안내해 드리겠습니다.</p>
<h2 id="What-Is-Agno" class="common-anchor-header">아그노란 무엇인가요?<button data-href="#What-Is-Agno" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://github.com/agno-agi/agno">아그노는</a> 프로덕션용으로 특별히 제작된 멀티에이전트 프레임워크입니다. 이 프레임워크는 두 가지 레이어로 구성되어 있습니다:</p>
<ul>
<li><p><strong>아그노 프레임워크 레이어</strong>: 에이전트 로직을 정의하는 곳</p></li>
<li><p><strong>AgentOS 런타임 레이어</strong>: 해당 로직을 실제로 배포할 수 있는 HTTP 서비스로 전환합니다.</p></li>
</ul>
<p>프레임워크 계층은 에이전트가 수행해야 할 <em>작업을</em> 정의하고, AgentOS는 해당 작업이 실행 및 제공되는 <em>방식을</em> 처리합니다.</p>
<h3 id="The-Framework-Layer" class="common-anchor-header">프레임워크 계층</h3><p>이것은 상담원이 직접 작업하는 것입니다. 여기에는 세 가지 핵심 개념이 도입됩니다:</p>
<ul>
<li><p><strong>에이전트</strong>: 특정 유형의 작업을 처리합니다.</p></li>
<li><p><strong>팀</strong>: 여러 에이전트를 조정하여 복잡한 문제를 해결합니다.</p></li>
<li><p><strong>워크플로</strong>: 실행 순서 및 구조 정의</p></li>
</ul>
<p>한 가지 마음에 드는 점은 새로운 DSL을 배우거나 플로우차트를 그릴 필요가 없다는 점입니다. 에이전트 동작은 표준 Python 함수 호출을 사용하여 정의됩니다. 이 프레임워크는 LLM 호출, 도구 실행 및 메모리 관리를 처리합니다.</p>
<h3 id="The-AgentOS-Runtime-Layer" class="common-anchor-header">AgentOS 런타임 레이어</h3><p>AgentOS는 비동기 실행을 통해 많은 양의 요청을 처리할 수 있도록 설계되었으며, 상태 비저장 아키텍처를 통해 간편하게 확장할 수 있습니다.</p>
<p>주요 기능은 다음과 같습니다:</p>
<ul>
<li><p>에이전트를 HTTP 엔드포인트로 노출하기 위한 기본 제공 FastAPI 통합</p></li>
<li><p>세션 관리 및 스트리밍 응답</p></li>
<li><p>엔드포인트 모니터링</p></li>
<li><p>수평적 확장 지원</p></li>
</ul>
<p>실제로는 대부분의 인프라 작업을 AgentOS가 처리하므로 사용자는 에이전트 로직 자체에 집중할 수 있습니다.</p>
<p>Agno의 아키텍처에 대한 개략적인 개요는 다음과 같습니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/1_dfbf444ee6.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Agno-vs-LangGraph" class="common-anchor-header">아그노와 랭그래프 비교<button data-href="#Agno-vs-LangGraph" class="anchor-icon" translate="no">
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
    </button></h2><p>Agno가 어디에 적합한지 이해하기 위해 가장 널리 사용되는 멀티에이전트 프레임워크 중 하나인 LangGraph와 비교해 보겠습니다.</p>
<p><a href="https://www.langchain.com/langgraph"><strong>LangGraph는</strong></a> 그래프 기반 상태 머신을 사용합니다. 전체 에이전트 워크플로를 그래프로 모델링하여 단계는 노드, 실행 경로는 에지로 표현합니다. 이는 프로세스가 고정되어 있고 엄격하게 정돈되어 있을 때 잘 작동합니다. 하지만 개방형 또는 대화형 시나리오에서는 제한적으로 느껴질 수 있습니다. 상호 작용이 더욱 동적으로 변할수록 깔끔한 그래프를 유지하기가 더 어려워집니다.</p>
<p><strong>아그노는</strong> 다른 접근 방식을 취합니다. 단순한 오케스트레이션 계층이 아니라 엔드투엔드 시스템입니다. 에이전트 동작을 정의하면 에이전트OS가 모니터링, 확장성, 멀티턴 대화 지원 기능이 내장된 프로덕션 준비된 HTTP 서비스로 자동 노출합니다. 별도의 API 게이트웨이, 사용자 지정 세션 관리, 추가 운영 도구가 필요하지 않습니다.</p>
<p>다음은 간단한 비교입니다:</p>
<table>
<thead>
<tr><th>차원</th><th>LangGraph</th><th>Agno</th></tr>
</thead>
<tbody>
<tr><td>오케스트레이션 모델</td><td>노드와 에지를 사용한 명시적 그래프 정의</td><td>Python으로 정의된 선언적 워크플로우</td></tr>
<tr><td>상태 관리</td><td>개발자가 정의하고 관리하는 사용자 정의 상태 클래스</td><td>내장 메모리 시스템</td></tr>
<tr><td>디버깅 및 통합 가시성</td><td>LangSmith(유료)</td><td>AgentOS UI(오픈 소스)</td></tr>
<tr><td>런타임 모델</td><td>기존 런타임에 통합</td><td>독립형 FastAPI 기반 서비스</td></tr>
<tr><td>배포 복잡성</td><td>LangServe를 통한 추가 설정 필요</td><td>즉시 사용 가능</td></tr>
</tbody>
</table>
<p>LangGraph는 더욱 유연하고 세분화된 제어 기능을 제공합니다. Agno는 제작 기간을 단축할 수 있도록 최적화합니다. 프로젝트 단계, 기존 인프라 및 필요한 사용자 지정 수준에 따라 올바른 선택이 달라집니다. 확실하지 않은 경우 두 가지를 모두 사용하여 소규모 개념 증명을 실행하는 것이 가장 신뢰할 수 있는 결정 방법입니다.</p>
<h2 id="Choosing-Milvus-for-the-Agent-Memory-Layer" class="common-anchor-header">에이전트 메모리 레이어로 Milvus 선택하기<button data-href="#Choosing-Milvus-for-the-Agent-Memory-Layer" class="anchor-icon" translate="no">
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
    </button></h2><p>프레임워크를 선택했다면 다음 결정은 메모리와 지식을 저장하는 방법입니다. 이를 위해 Milvus를 사용합니다. <a href="https://milvus.io/">Milvus는</a> <a href="https://github.com/milvus-io/milvus">42,000개 이상의 GitHub</a> 스타를 보유한 AI 워크로드용으로 구축된 가장 인기 있는 오픈 소스 벡터 데이터베이스입니다.</p>
<p><strong>Agno는 기본적으로 Milvus를 지원합니다.</strong> <code translate="no">agno.vectordb.milvus</code> 모듈은 연결 관리, 자동 재시도, 일괄 쓰기, 임베딩 생성과 같은 프로덕션 기능을 래핑합니다. 연결 풀을 구축하거나 네트워크 장애를 직접 처리할 필요 없이 몇 줄의 Python으로 작동하는 벡터 메모리 계층을 만들 수 있습니다.</p>
<p><strong>Milvus는 필요에 따라 확장할 수 있습니다.</strong> 세 가지 <a href="https://milvus.io/docs/install-overview.md">배포 모드를</a> 지원합니다 <a href="https://milvus.io/docs/install-overview.md">:</a></p>
<ul>
<li><p><strong>Milvus Lite</strong>: 경량, 파일 기반 - 로컬 개발 및 테스트에 적합합니다.</p></li>
<li><p><strong>독립형</strong>: 프로덕션 워크로드를 위한 단일 서버 배포</p></li>
<li><p><strong>분산</strong>: 대규모 시나리오를 위한 전체 클러스터</p></li>
</ul>
<p>Milvus Lite로 시작하여 로컬에서 에이전트 메모리를 검증한 다음 트래픽이 증가함에 따라 애플리케이션 코드를 변경하지 않고도 독립형 또는 분산형으로 전환할 수 있습니다. 이러한 유연성은 초기 단계에서는 빠르게 반복하지만 나중에 확장할 명확한 경로가 필요할 때 특히 유용합니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/1_1_1en_e0294d0ffa.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Step-by-Step-Building-a-Production-Ready-Agno-Agent-with-Milvus" class="common-anchor-header">단계별: Milvus로 프로덕션 준비 완료된 Agno 에이전트 구축하기<button data-href="#Step-by-Step-Building-a-Production-Ready-Agno-Agent-with-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>프로덕션에 바로 사용할 수 있는 에이전트를 처음부터 구축해 보겠습니다.</p>
<p>전체 워크플로우를 보여주기 위해 간단한 단일 에이전트 예제로 시작하겠습니다. 그런 다음 다중 에이전트 시스템으로 확장해 보겠습니다. AgentOS는 모든 것을 호출 가능한 HTTP 서비스로 자동 패키징합니다.</p>
<h3 id="1-Deploying-Milvus-Standalone-with-Docker" class="common-anchor-header">1. Docker로 Milvus 독립형 배포하기</h3><p><strong>(1) 배포 파일을 다운로드합니다.</strong></p>
<pre><code translate="no">**wget** **
&lt;https://github.com/Milvus-io/Milvus/releases/download/v2.****5****.****12****/Milvus-standalone-docker-compose.yml&gt; -O docker-compose.yml**
<button class="copy-code-btn"></button></code></pre>
<p><strong>(2) Milvus 서비스 시작</strong></p>
<pre><code translate="no">docker-compose up -d
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">docker-compose ps -a
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/_80575354d3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="2-Core-Implementation" class="common-anchor-header">2. 핵심 구현</h3><pre><code translate="no"><span class="hljs-keyword">import</span> os
<span class="hljs-keyword">from</span> pathlib <span class="hljs-keyword">import</span> Path
<span class="hljs-keyword">from</span> agno.os <span class="hljs-keyword">import</span> AgentOS
<span class="hljs-keyword">from</span> agno.agent <span class="hljs-keyword">import</span> Agent
<span class="hljs-keyword">from</span> agno.models.openai <span class="hljs-keyword">import</span> OpenAIChat
<span class="hljs-keyword">from</span> agno.knowledge.knowledge <span class="hljs-keyword">import</span> Knowledge
<span class="hljs-keyword">from</span> agno.vectordb.milvus <span class="hljs-keyword">import</span> Milvus
<span class="hljs-keyword">from</span> agno.knowledge.embedder.openai <span class="hljs-keyword">import</span> OpenAIEmbedder
<span class="hljs-keyword">from</span> agno.db.sqlite <span class="hljs-keyword">import</span> SqliteDb
os.environ\[<span class="hljs-string">&quot;OPENAI_API_KEY&quot;</span>\] = <span class="hljs-string">&quot;you-key-here&quot;</span>
data_dir = Path(<span class="hljs-string">&quot;./data&quot;</span>)
data_dir.mkdir(exist_ok=<span class="hljs-literal">True</span>)
knowledge_base = Knowledge(
    contents_db=SqliteDb(
        db_file=<span class="hljs-built_in">str</span>(data_dir / <span class="hljs-string">&quot;knowledge_contents.db&quot;</span>),
        knowledge_table=<span class="hljs-string">&quot;knowledge_contents&quot;</span>,
    ),
    vector_db=Milvus(
        collection=<span class="hljs-string">&quot;agno_knowledge&quot;</span>,
        uri=<span class="hljs-string">&quot;http://192.168.x.x:19530&quot;</span>,
        embedder=OpenAIEmbedder(<span class="hljs-built_in">id</span>=<span class="hljs-string">&quot;text-embedding-3-small&quot;</span>),
    ),
)
*<span class="hljs-comment"># Create Agent*</span>
agent = Agent(
    name=<span class="hljs-string">&quot;Knowledge Assistant&quot;</span>,
    model=OpenAIChat(<span class="hljs-built_in">id</span>=<span class="hljs-string">&quot;gpt-4o&quot;</span>),
    instructions=\[
        <span class="hljs-string">&quot;You are a knowledge base assistant that helps users query and manage knowledge base content.&quot;</span>,
        <span class="hljs-string">&quot;Answer questions in English.&quot;</span>,
        <span class="hljs-string">&quot;Always search the knowledge base before answering questions.&quot;</span>,
        <span class="hljs-string">&quot;If the knowledge base is empty, kindly prompt the user to upload documents.&quot;</span>
    \],
    knowledge=knowledge_base,
    search_knowledge=<span class="hljs-literal">True</span>,
    db=SqliteDb(
        db_file=<span class="hljs-built_in">str</span>(data_dir / <span class="hljs-string">&quot;agent.db&quot;</span>),
        session_table=<span class="hljs-string">&quot;agent_sessions&quot;</span>,
    ),
    add_history_to_context=<span class="hljs-literal">True</span>,
    markdown=<span class="hljs-literal">True</span>,
)
agent_os = AgentOS(agents=\[agent\])
app = agent_os.get_app()
<span class="hljs-keyword">if</span> __name__ == <span class="hljs-string">&quot;__main__&quot;</span>:
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n🚀 Starting service...&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;📍 http://localhost:7777&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;💡 Please upload documents to the knowledge base in the UI\n&quot;</span>)
    agent_os.serve(app=<span class="hljs-string">&quot;knowledge_agent:app&quot;</span>, port=<span class="hljs-number">7777</span>, reload=<span class="hljs-literal">False</span>)
<button class="copy-code-btn"></button></code></pre>
<p><strong>(1) 에이전트 실행하기</strong></p>
<pre><code translate="no">**python** **knowledge_agent.py**
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/1_df885706cf.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="3-Connecting-to-the-AgentOS-Console" class="common-anchor-header">3. AgentOS 콘솔에 연결하기</h3><p>https://os.agno.com/</p>
<p><strong>(1) 계정 생성 및 로그인</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2_db0af51e58.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>(2) 에이전트를 AgentOS에 연결</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/3_0a8c6f9436.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>(3) 노출 포트 및 에이전트 이름 구성하기</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/4_3844011799.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>(4) 밀버스에서 문서 추가 및 인덱싱하기</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/5_776ea7ca11.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/6_90b97c4660.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/7_a98262d8c5.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/8_58b7d77eea.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>(5) 에이전트 엔드 투 엔드 테스트</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/_6e61038ba5.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>이 설정에서 Milvus는 고성능 시맨틱 검색을 처리합니다. 지식창고 어시스턴트가 기술 관련 질문을 받으면 <code translate="no">search_knowledge</code> 툴을 호출하여 쿼리를 임베드하고 Milvus에서 가장 관련성이 높은 문서 청크를 검색한 다음 그 결과를 응답의 기초로 사용합니다.</p>
<p>Milvus는 세 가지 배포 옵션을 제공하므로 모든 배포 모드에서 애플리케이션 수준 API를 일관되게 유지하면서 운영 요구사항에 맞는 아키텍처를 선택할 수 있습니다.</p>
<p>위의 데모는 핵심 검색 및 생성 흐름을 보여줍니다. 그러나 이 설계를 프로덕션 환경으로 옮기려면 몇 가지 아키텍처 측면에 대해 더 자세히 논의해야 합니다.</p>
<h2 id="How-Retrieval-Results-Are-Shared-Across-Agents" class="common-anchor-header">검색 결과가 에이전트 간에 공유되는 방식<button data-href="#How-Retrieval-Results-Are-Shared-Across-Agents" class="anchor-icon" translate="no">
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
    </button></h2><p>Agno의 팀 모드에는 이후 에이전트가 이전 에이전트의 전체 상호작용 기록을 상속할 수 있는 <code translate="no">share_member_interactions=True</code> 옵션이 있습니다. 즉, 첫 번째 상담원이 Milvus에서 정보를 검색하면 후속 상담원이 동일한 검색을 다시 실행하는 대신 해당 결과를 재사용할 수 있습니다.</p>
<ul>
<li><p><strong>장점도 있습니다:</strong> 검색 비용이 팀 전체에 걸쳐 분할 상각됩니다. 하나의 벡터 검색이 여러 상담원을 지원하므로 중복 쿼리가 줄어듭니다.</p></li>
<li><p><strong>단점:</strong> 검색 품질이 증폭됩니다. 초기 검색이 불완전하거나 부정확한 결과를 반환하면 그 오류는 검색에 의존하는 모든 상담원에게 전파됩니다.</p></li>
</ul>
<p>그렇기 때문에 다중 에이전트 시스템에서는 검색 정확도가 더욱 중요합니다. 검색이 잘못되면 상담원 한 명의 응답만 저하되는 것이 아니라 팀 전체에 영향을 미칩니다.</p>
<p>다음은 팀 설정의 예입니다:</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> agno.team <span class="hljs-keyword">import</span> Team
analyst = Agent(
    name=<span class="hljs-string">&quot;Data Analyst&quot;</span>,
    model=OpenAIChat(<span class="hljs-built_in">id</span>=<span class="hljs-string">&quot;gpt-4o&quot;</span>),
    knowledge=knowledge_base,
    search_knowledge=<span class="hljs-literal">True</span>,
    instructions=\[<span class="hljs-string">&quot;Analyze data and extract key metrics&quot;</span>\]
)
writer = Agent(
    name=<span class="hljs-string">&quot;Report Writer&quot;</span>,
    model=OpenAIChat(<span class="hljs-built_in">id</span>=<span class="hljs-string">&quot;gpt-4o&quot;</span>),
    knowledge=knowledge_base,
    search_knowledge=<span class="hljs-literal">True</span>,
    instructions=\[<span class="hljs-string">&quot;Write reports based on the analysis results&quot;</span>\]
)
team = Team(
    agents=\[analyst, writer\],
    share_member_interactions=<span class="hljs-literal">True</span>,  *<span class="hljs-comment"># Share knowledge retrieval results*</span>
)
<button class="copy-code-btn"></button></code></pre>
<h2 id="Why-Agno-and-Milvus-Are-Layered-Separately" class="common-anchor-header">아그노와 밀버스가 별도로 계층화된 이유<button data-href="#Why-Agno-and-Milvus-Are-Layered-Separately" class="anchor-icon" translate="no">
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
    </button></h2><p>이 아키텍처에서 <strong>Agno는</strong> 대화 및 오케스트레이션 계층에 위치합니다. 대화 흐름 관리, 상담원 조정, 대화 상태 유지를 담당하며 세션 기록은 관계형 데이터베이스에 보관됩니다. 제품 문서 및 기술 보고서와 같은 시스템의 실제 도메인 지식은 별도로 처리되어 <strong>Milvus에</strong> 벡터 임베딩으로 저장됩니다. 이렇게 명확한 구분을 통해 대화 로직과 지식 저장을 완전히 분리할 수 있습니다.</p>
<p>이것이 운영적으로 중요한 이유</p>
<ul>
<li><p><strong>독립적인 확장</strong>: 아그노 수요가 증가하면 더 많은 아그노 인스턴스를 추가하세요. 쿼리 볼륨이 증가하면 쿼리 노드를 추가하여 Milvus를 확장하세요. 각 계층은 독립적으로 확장됩니다.</p></li>
<li><p><strong>다양한 하드웨어 요구 사항</strong>: Agno는 CPU와 메모리를 사용합니다(LLM 추론, 워크플로우 실행). Milvus는 처리량이 많은 벡터 검색(디스크 I/O, 때로는 GPU 가속)에 최적화되어 있습니다. 이를 분리하면 리소스 경합을 방지할 수 있습니다.</p></li>
<li><p><strong>비용 최적화</strong>: 각 레이어에 대해 독립적으로 리소스를 조정하고 할당할 수 있습니다.</p></li>
</ul>
<p>이러한 계층적 접근 방식은 보다 효율적이고 탄력적이며 프로덕션에 바로 사용할 수 있는 아키텍처를 제공합니다.</p>
<h2 id="What-to-Monitor-When-Using-Agno-with-Milvus" class="common-anchor-header">Milvus와 함께 Agno를 사용할 때 모니터링해야 할 사항<button data-href="#What-to-Monitor-When-Using-Agno-with-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Agno에는 평가 기능이 기본으로 제공되지만 Milvus를 추가하면 모니터링해야 할 항목이 확장됩니다. 그간의 경험을 바탕으로 다음 세 가지 영역에 집중하세요:</p>
<ul>
<li><p><strong>검색 품질</strong>: Milvus가 반환하는 문서가 실제로 쿼리와 관련이 있는가, 아니면 벡터 수준에서 표면적으로만 유사한가?</p></li>
<li><p><strong>답변의 충실성</strong>: 최종 응답이 검색된 콘텐츠에 근거하고 있는가, 아니면 LLM이 지원되지 않는 클레임을 생성하고 있는가?</p></li>
<li><p><strong>엔드투엔드 지연 시간 분석</strong>: 총 응답 시간만 추적하지 마세요. 임베딩 생성, 벡터 검색, 컨텍스트 어셈블리, LLM 추론 등 단계별로 세분화하여 속도 저하가 발생하는 위치를 파악할 수 있습니다.</p></li>
</ul>
<p><strong>실제 예시를 들어보겠습니다:</strong> Milvus 컬렉션이 백만 개에서 천만 개로 늘어나면 검색 지연 시간이 증가하는 것을 볼 수 있습니다. 이는 일반적으로 인덱스 매개변수( <code translate="no">nlist</code> 및 <code translate="no">nprobe</code>)를 조정하거나 독립형에서 분산 배포로 전환하는 것을 고려하라는 신호입니다.</p>
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
    </button></h2><p>프로덕션에 사용할 수 있는 에이전트 시스템을 구축하려면 LLM 호출과 검색 데모를 함께 연결하는 것 이상의 것이 필요합니다. 명확한 아키텍처 경계, 독립적으로 확장되는 인프라, 문제를 조기에 파악할 수 있는 통합 가시성이 필요합니다.</p>
<p>이 포스팅에서는 Agno와 Milvus가 어떻게 함께 작동하는지 살펴보았습니다: 멀티에이전트 오케스트레이션을 위한 Agno, 확장 가능한 메모리와 의미 검색을 위한 Milvus. 이러한 레이어를 분리하면 핵심 로직을 다시 작성하지 않고도 프로토타입에서 프로덕션으로 이동할 수 있으며 필요에 따라 각 구성 요소를 확장할 수 있습니다.</p>
<p>비슷한 설정을 실험하고 계신다면 어떤 점이 효과적이었는지 궁금합니다.</p>
<p><strong>Milvus에 대한 질문이 있으신가요?</strong> <a href="https://milvusio.slack.com/join/shared_invite/zt-3nntzngkz-gYwhrdSE4~76k0VMyBfD1Q#/shared-invite/email">Slack 채널에</a> 참여하거나 20분 동안 진행되는 <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">Milvus 오피스 아워</a> 세션을 예약하세요.</p>
