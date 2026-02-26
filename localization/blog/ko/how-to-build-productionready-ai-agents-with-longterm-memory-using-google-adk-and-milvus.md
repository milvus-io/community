---
id: >-
  how-to-build-productionready-ai-agents-with-longterm-memory-using-google-adk-and-milvus.md
title: Google ADK와 Milvus를 사용하여 장기 기억을 갖춘 프로덕션 지원 AI 에이전트를 구축하는 방법
author: Min Yin
date: 2026-02-26T00:00:00.000Z
cover: 'https://assets.zilliz.com/cover_c543dbeab4.png'
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, RAG'
meta_keywords: >-
  AI agent memory, long-term memory, ADK framework, Milvus vector database,
  semantic retrieval
meta_title: |
  Production AI Agents with Persistent Memory Using Google ADK and Milvus
desc: >-
  메모리 설계, 시맨틱 검색, 사용자 격리 및 프로덕션 지원 아키텍처를 포괄하는 ADK와 Milvus를 사용하여 실제 장기 메모리를 갖춘 AI
  에이전트를 구축하세요.
origin: >-
  https://milvus.io/blog/how-to-build-productionready-ai-agents-with-longterm-memory-using-google-adk-and-milvus.md
---
<p>지능형 에이전트를 구축할 때 가장 어려운 문제 중 하나는 에이전트가 기억해야 할 것과 잊어버려야 할 것을 결정하는 메모리 관리입니다.</p>
<p>모든 메모리가 지속되는 것은 아닙니다. 일부 데이터는 현재 대화에만 필요하며 대화가 끝나면 지워져야 합니다. 사용자 기본 설정과 같은 다른 데이터는 대화 전반에 걸쳐 유지되어야 합니다. 이러한 데이터가 혼합되면 임시 데이터가 쌓이고 중요한 정보가 손실됩니다.</p>
<p>진짜 문제는 아키텍처입니다. 대부분의 프레임워크는 단기 메모리와 장기 메모리를 명확하게 구분하지 않기 때문에 개발자가 수동으로 처리해야 합니다.</p>
<p>2025년에 출시된 Google의 오픈 소스 <a href="https://google.github.io/adk-docs/">ADK(에이전트 개발 키트)</a>는 메모리 관리를 최우선 과제로 삼아 프레임워크 수준에서 이 문제를 해결합니다. 이 키트는 단기 세션 메모리와 장기 메모리를 기본적으로 분리하도록 강제합니다.</p>
<p>이 글에서는 이러한 분리가 실제로 어떻게 작동하는지 살펴보겠습니다. Milvus를 벡터 데이터베이스로 사용하여 실제 장기 메모리를 갖춘 프로덕션 지원 에이전트를 처음부터 처음부터 구축해 보겠습니다.</p>
<h2 id="ADK’s-Core-Design-Principles" class="common-anchor-header">ADK의 핵심 설계 원칙<button data-href="#ADK’s-Core-Design-Principles" class="anchor-icon" translate="no">
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
    </button></h2><p>ADK는 개발자의 메모리 관리 부담을 덜어주기 위해 설계되었습니다. 프레임워크는 단기 세션 데이터와 장기 메모리를 자동으로 분리하고 각각을 적절하게 처리합니다. 이는 네 가지 핵심 설계를 통해 이루어집니다.</p>
<h3 id="Built-in-Interfaces-for-Short--and-Long-Term-Memory" class="common-anchor-header">단기 및 장기 메모리를 위한 내장 인터페이스</h3><p>모든 ADK 에이전트에는 메모리 관리를 위한 두 가지 기본 제공 인터페이스가 있습니다:</p>
<p><strong>세션 서비스(임시 데이터)</strong></p>
<ul>
<li><strong>저장 내용</strong>: 현재 대화 콘텐츠 및 도구 호출의 중간 결과</li>
<li><strong>지워지는 시기</strong>: 세션이 종료되면 자동으로 지워짐</li>
<li><strong>저장 위치</strong>: 메모리(가장 빠른), 데이터베이스 또는 클라우드 서비스</li>
</ul>
<p><strong>MemoryService(장기 메모리)</strong></p>
<ul>
<li><strong>저장 내용</strong>: 사용자 기본 설정이나 과거 기록 등 기억해야 하는 정보</li>
<li>삭제<strong>시기</strong>: 자동으로 삭제되지 않으며 수동으로 삭제해야 합니다.</li>
<li><strong>저장 위치</strong>: ADK는 인터페이스만 정의하며, 스토리지 백엔드는 사용자에게 달려 있습니다(예: Milvus).</li>
</ul>
<h3 id="A-Three-Layer-Architecture" class="common-anchor-header">3계층 아키텍처</h3><p>ADK는 시스템을 세 개의 레이어로 분할하여 각각 하나의 책임을 맡깁니다:</p>
<ul>
<li><strong>에이전트 계층</strong>: "사용자에게 응답하기 전에 관련 메모리 검색"과 같은 비즈니스 로직이 있는 곳입니다.</li>
<li><strong>런타임 계층</strong>: 프레임워크에서 관리하며 세션 생성 및 삭제, 각 실행 단계 추적을 담당합니다.</li>
<li><strong>서비스 계층</strong>: Milvus와 같은 벡터 데이터베이스나 대규모 모델 API와 같은 외부 시스템과 통합됩니다.</li>
</ul>
<p>이 구조는 비즈니스 로직은 에이전트에, 스토리지는 다른 곳에 보관하는 방식으로 문제를 분리합니다. 한 쪽을 업데이트해도 다른 쪽을 손상시키지 않고 업데이트할 수 있습니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/how_to_build_productionready_ai_agents_with_longterm_memory_using_google_adk_and_milvus_2_6af7f3a395.jpg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Everything-Is-Recorded-as-Events" class="common-anchor-header">모든 것이 이벤트로 기록됨</h3><p>에이전트가 수행하는 모든 작업(메모리 리콜 도구 호출, 모델 호출, 응답 생성 등)은 <strong>이벤트로</strong> 기록됩니다.</p>
<p>여기에는 두 가지 실질적인 이점이 있습니다. 첫째, 문제가 발생하면 개발자는 전체 상호작용을 단계별로 재생하여 정확한 실패 지점을 찾을 수 있습니다. 둘째, 감사 및 규정 준수를 위해 시스템은 각 사용자 상호 작용의 완전한 실행 추적을 제공합니다.</p>
<h3 id="Prefix-Based-Data-Scoping" class="common-anchor-header">접두사 기반 데이터 범위 지정</h3><p>ADK는 간단한 키 접두사를 사용하여 데이터 가시성을 제어합니다:</p>
<ul>
<li><strong>temp:xxx</strong> - 현재 세션 내에서만 표시되며 세션이 종료되면 자동으로 제거됩니다.</li>
<li><strong>user:xxx</strong> - 동일한 사용자의 모든 세션에서 공유되어 영구적인 사용자 환경 설정이 가능합니다.</li>
<li><strong>app:xxx</strong> - 모든 사용자에게 전역적으로 공유되며, 제품 문서와 같은 애플리케이션 전반의 지식에 적합합니다.</li>
</ul>
<p>접두사를 사용하면 개발자는 별도의 액세스 로직을 작성하지 않고도 데이터 범위를 제어할 수 있습니다. 프레임워크는 가시성과 수명을 자동으로 처리합니다.</p>
<h2 id="Milvus-as-the-Memory-Backend-for-ADK" class="common-anchor-header">ADK의 메모리 백엔드로서의 Milvus<button data-href="#Milvus-as-the-Memory-Backend-for-ADK" class="anchor-icon" translate="no">
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
    </button></h2><p>ADK에서 MemoryService는 인터페이스에 불과합니다. 장기 메모리가 사용되는 방식은 정의하지만 저장되는 방식은 정의하지 않습니다. 데이터베이스를 선택하는 것은 개발자의 몫입니다. 그렇다면 어떤 종류의 데이터베이스가 에이전트의 메모리 백엔드로 잘 작동할까요?</p>
<h3 id="What-an-Agent-Memory-System-Needs--and-How-Milvus-Delivers" class="common-anchor-header">에이전트 메모리 시스템에 필요한 것 - 그리고 Milvus가 제공하는 방법</h3><ul>
<li><strong>시맨틱 검색</strong></li>
</ul>
<p><strong>필요성</strong>:</p>
<p>사용자는 같은 질문을 같은 방식으로 하는 경우가 거의 없습니다. "연결이 안 돼요"와 "연결 시간 초과"는 같은 의미입니다. 메모리 시스템은 단순히 키워드를 일치시키는 것이 아니라 의미를 이해해야 합니다.</p>
<p><strong>Milvus가 이를 충족하는 방법</strong>:</p>
<p>Milvus는 개발자가 워크로드에 맞는 것을 선택할 수 있도록 HNSW 및 DiskANN과 같은 다양한 벡터 인덱스 유형을 지원합니다. 수천만 개의 벡터를 사용하더라도 쿼리 대기 시간은 에이전트가 사용하기에 충분히 빠른 10ms 미만을 유지할 수 있습니다.</p>
<ul>
<li><strong>하이브리드 쿼리</strong></li>
</ul>
<p><strong>필요성</strong>:</p>
<p>메모리 리콜에는 시맨틱 검색 이상의 기능이 필요합니다. 또한 시스템은 현재 사용자의 데이터만 반환되도록 user_id와 같은 구조화된 필드를 기준으로 필터링해야 합니다.</p>
<p><strong>Milvus가 이를 충족하는 방법</strong>:</p>
<p>Milvus는 기본적으로 벡터 검색과 스칼라 필터링을 결합한 하이브리드 쿼리를 지원합니다. 예를 들어, 동일한 쿼리에서 user_id = 'xxx'와 같은 필터를 적용하면서 의미적으로 유사한 레코드를 검색할 수 있으며, 성능이나 리콜 품질에 영향을 미치지 않습니다.</p>
<ul>
<li><strong>확장성</strong></li>
</ul>
<p><strong>필요성</strong>:</p>
<p>사용자 수와 저장된 메모리가 증가함에 따라 시스템은 원활하게 확장되어야 합니다. 데이터가 증가해도 갑작스러운 속도 저하나 장애 없이 성능이 안정적으로 유지되어야 합니다.</p>
<p><strong>Milvus가 이를 충족하는 방법</strong>:</p>
<p>Milvus는 컴퓨팅-스토리지 분리 아키텍처를 사용합니다. 필요에 따라 쿼리 노드를 추가하여 쿼리 용량을 수평적으로 확장할 수 있습니다. 단일 머신에서 실행되는 독립형 버전도 수천만 개의 벡터를 처리할 수 있으므로 초기 배포에 적합합니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/how_to_build_productionready_ai_agents_with_longterm_memory_using_google_adk_and_milvus_4_e1d89e6986.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>참고: 로컬 개발 및 테스트의 경우, 이 문서의 예제에서는 <a href="https://milvus.io/docs/milvus_lite.md">Milvus Lite</a> 또는 <a href="https://milvus.io/docs/install_standalone-docker.md">Milvus Standalone을</a> 사용합니다.</p>
<h2 id="Building-an-Agent-with-Long-TermMemory-Powered-by-Milvus" class="common-anchor-header">Milvus 기반 롱텀메모리로 에이전트 구축하기<button data-href="#Building-an-Agent-with-Long-TermMemory-Powered-by-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>이 섹션에서는 간단한 기술 지원 에이전트를 구축합니다. 사용자가 질문을 하면 상담원이 동일한 작업을 반복하지 않고 유사한 과거의 지원 티켓을 찾아서 답변합니다.</p>
<p>이 예는 실제 상담원 메모리 시스템이 처리해야 하는 세 가지 일반적인 문제를 보여주기 때문에 유용합니다.</p>
<ul>
<li><strong>세션 전반의 장기 기억</strong></li>
</ul>
<p>오늘 받은 질문이 몇 주 전에 만든 티켓과 관련되어 있을 수 있습니다. 상담원은 현재 세션 내에서뿐만 아니라 대화 전반에 걸친 정보를 기억해야 합니다. 그렇기 때문에 MemoryService를 통해 관리되는 장기 메모리가 필요합니다.</p>
<ul>
<li><strong>사용자 격리</strong></li>
</ul>
<p>각 사용자의 지원 기록은 비공개로 유지되어야 합니다. 한 사용자의 데이터가 다른 사용자의 결과에 나타나지 않아야 합니다. 이를 위해서는 user_id와 같은 필드에 대한 필터링이 필요하며, Milvus는 하이브리드 쿼리를 통해 이를 지원합니다.</p>
<ul>
<li><strong>시맨틱 매칭</strong></li>
</ul>
<p>사용자는 "연결할 수 없음" 또는 "시간 초과"와 같이 동일한 문제를 서로 다른 방식으로 설명합니다. 키워드 매칭만으로는 충분하지 않습니다. 에이전트는 벡터 검색을 통해 제공되는 시맨틱 검색이 필요합니다.</p>
<h3 id="Environment-setup" class="common-anchor-header">환경 설정</h3><ul>
<li>Python 3.11 이상</li>
<li>도커 및 도커 컴포즈</li>
<li>Gemini API 키</li>
</ul>
<p>이 섹션에서는 프로그램이 올바르게 실행될 수 있도록 하기 위한 기본 설정에 대해 설명합니다.</p>
<pre><code translate="no">pip install google-adk pymilvus google-generativeai  
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no"><span class="hljs-string">&quot;&quot;&quot;  
ADK + Milvus + Gemini Long-term Memory Agent  
Demonstrates how to implement a cross-session memory recall system  
&quot;&quot;&quot;</span>  
<span class="hljs-keyword">import</span> os  
<span class="hljs-keyword">import</span> asyncio  
<span class="hljs-keyword">import</span> time  
<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> connections, Collection, FieldSchema, CollectionSchema, DataType, utility  
<span class="hljs-keyword">import</span> google.generativeai <span class="hljs-keyword">as</span> genai  
<span class="hljs-keyword">from</span> google.adk.agents <span class="hljs-keyword">import</span> Agent  
<span class="hljs-keyword">from</span> google.adk.tools <span class="hljs-keyword">import</span> FunctionTool  
<span class="hljs-keyword">from</span> google.adk.runners <span class="hljs-keyword">import</span> Runner  
<span class="hljs-keyword">from</span> google.adk.sessions <span class="hljs-keyword">import</span> InMemorySessionService  
<span class="hljs-keyword">from</span> google.genai <span class="hljs-keyword">import</span> types  
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-1-Deploy-Milvus-Standalone-Docker" class="common-anchor-header">1단계: Milvus 독립형 배포(Docker)</h3><p><strong>(1) 배포 파일 다운로드</strong></p>
<pre><code translate="no">wget &lt;https://github.com/Milvus-io/Milvus/releases/download/v2.5.12/Milvus-standalone-docker-compose.yml&gt; -O docker-compose.yml  
<button class="copy-code-btn"></button></code></pre>
<p><strong>(2) Milvus 서비스 시작</strong></p>
<pre><code translate="no">docker-compose up -d  
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">docker-compose ps -a  
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/how_to_build_productionready_ai_agents_with_longterm_memory_using_google_adk_and_milvus_1_0ab7f330eb.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-2-Model-and-Connection-Configuration" class="common-anchor-header">2단계 모델 및 연결 구성</h3><p>Gemini API 및 Milvus 연결 설정을 구성합니다.</p>
<pre><code translate="no"><span class="hljs-comment"># ==================== Configuration ====================  </span>
<span class="hljs-comment"># 1. Gemini API configuration  </span>
GOOGLE_API_KEY = os.getenv(<span class="hljs-string">&quot;GOOGLE_API_KEY&quot;</span>)  
<span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> GOOGLE_API_KEY:  
   <span class="hljs-keyword">raise</span> ValueError(<span class="hljs-string">&quot;Please set the GOOGLE_API_KEY environment variable&quot;</span>)  
genai.configure(api_key=GOOGLE_API_KEY)  
<span class="hljs-comment"># 2. Milvus connection configuration  </span>
MILVUS_HOST = os.getenv(<span class="hljs-string">&quot;MILVUS_HOST&quot;</span>, <span class="hljs-string">&quot;localhost&quot;</span>)  
MILVUS_PORT = os.getenv(<span class="hljs-string">&quot;MILVUS_PORT&quot;</span>, <span class="hljs-string">&quot;19530&quot;</span>)  
<span class="hljs-comment"># 3. Model selection (best combination within the free tier limits)  </span>
LLM_MODEL = <span class="hljs-string">&quot;gemini-2.5-flash-lite&quot;</span>  <span class="hljs-comment"># LLM model: 1000 RPD  </span>
EMBEDDING_MODEL = <span class="hljs-string">&quot;models/text-embedding-004&quot;</span>  <span class="hljs-comment"># Embedding model: 1000 RPD  </span>
EMBEDDING_DIM = <span class="hljs-number">768</span>  <span class="hljs-comment"># Vector dimension  </span>
<span class="hljs-comment"># 4. Application configuration  </span>
APP_NAME = <span class="hljs-string">&quot;tech_support&quot;</span>  
USER_ID = <span class="hljs-string">&quot;user_123&quot;</span>  
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;✓ Using model configuration:&quot;</span>)  
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;  LLM: <span class="hljs-subst">{LLM_MODEL}</span>&quot;</span>)  
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;  Embedding: <span class="hljs-subst">{EMBEDDING_MODEL}</span> (dimension: <span class="hljs-subst">{EMBEDDING_DIM}</span>)&quot;</span>)  
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-3-Milvus-Database-Initialization" class="common-anchor-header">3단계 Milvus 데이터베이스 초기화</h3><p>벡터 데이터베이스 컬렉션을 생성합니다(관계형 데이터베이스의 테이블과 유사).</p>
<pre><code translate="no"><span class="hljs-comment"># ==================== Initialize Milvus ====================  </span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">init_milvus</span>():  
   <span class="hljs-string">&quot;&quot;&quot;Initialize Milvus connection and collection&quot;&quot;&quot;</span>  
   <span class="hljs-comment"># Step 1: Establish connection  </span>
   Try:  
       connections.connect(  
           alias=<span class="hljs-string">&quot;default&quot;</span>,  
           host=MILVUS_HOST,  
           port=MILVUS_PORT  
       )  
       <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;✓ Connected to Milvus: <span class="hljs-subst">{MILVUS_HOST}</span>:<span class="hljs-subst">{MILVUS_PORT}</span>&quot;</span>)  
   <span class="hljs-keyword">except</span> Exception <span class="hljs-keyword">as</span> e:  
       <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;✗ Failed to connect to Milvus: <span class="hljs-subst">{e}</span>&quot;</span>)  
       <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Hint: make sure Milvus is running&quot;</span>)  
       Raise  
   <span class="hljs-comment"># Step 2: Define data schema  </span>
   fields = [  
       FieldSchema(name=<span class="hljs-string">&quot;id&quot;</span>, dtype=DataType.INT64, is_primary=<span class="hljs-literal">True</span>, auto_id=<span class="hljs-literal">True</span>),  
       FieldSchema(name=<span class="hljs-string">&quot;user_id&quot;</span>, dtype=DataType.VARCHAR, max_length=<span class="hljs-number">100</span>),  
       FieldSchema(name=<span class="hljs-string">&quot;session_id&quot;</span>, dtype=DataType.VARCHAR, max_length=<span class="hljs-number">100</span>),  
       FieldSchema(name=<span class="hljs-string">&quot;question&quot;</span>, dtype=DataType.VARCHAR, max_length=<span class="hljs-number">2000</span>),  
       FieldSchema(name=<span class="hljs-string">&quot;solution&quot;</span>, dtype=DataType.VARCHAR, max_length=<span class="hljs-number">5000</span>),  
       FieldSchema(name=<span class="hljs-string">&quot;embedding&quot;</span>, dtype=DataType.FLOAT_VECTOR, dim=EMBEDDING_DIM),  
       FieldSchema(name=<span class="hljs-string">&quot;timestamp&quot;</span>, dtype=DataType.INT64)  
   ]  
   schema = CollectionSchema(fields, description=<span class="hljs-string">&quot;Tech support memory&quot;</span>)  
   collection_name = <span class="hljs-string">&quot;support_memory&quot;</span>  
   <span class="hljs-comment"># Step 3: Create or load the collection  </span>
   <span class="hljs-keyword">if</span> utility.has_collection(collection_name):  
       memory_collection = Collection(name=collection_name)  
       <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;✓ Collection &#x27;<span class="hljs-subst">{collection_name}</span>&#x27; already exists&quot;</span>)  
   Else:  
       memory_collection = Collection(name=collection_name, schema=schema)  
   <span class="hljs-comment"># Step 4: Create vector index  </span>
   index_params = {  
       <span class="hljs-string">&quot;index_type&quot;</span>: <span class="hljs-string">&quot;IVF_FLAT&quot;</span>,  
       <span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;COSINE&quot;</span>,  
       <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;nlist&quot;</span>: <span class="hljs-number">128</span>}  
   }  
   memory_collection.create_index(field_name=<span class="hljs-string">&quot;embedding&quot;</span>, index_params=index_params)  
   <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;✓ Created collection &#x27;<span class="hljs-subst">{collection_name}</span>&#x27; and index&quot;</span>)  
   <span class="hljs-keyword">return</span> memory_collection  
<span class="hljs-comment"># Run initialization  </span>
memory_collection = init_milvus()  
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-4-Memory-Operation-Functions" class="common-anchor-header">4단계 메모리 연산 기능</h3><p>에이전트를 위한 도구로 저장 및 검색 로직을 캡슐화합니다.</p>
<p>(1) 메모리 저장 함수</p>
<pre><code translate="no"><span class="hljs-comment"># ==================== Memory Operation Functions ====================  </span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">store_memory</span>(<span class="hljs-params">question: <span class="hljs-built_in">str</span>, solution: <span class="hljs-built_in">str</span></span>) -&gt; <span class="hljs-built_in">str</span>:  
   <span class="hljs-string">&quot;&quot;&quot;  
   Store a solution record into the memory store  
   Args:  
       question: the user&#x27;s question  
       solution: the solution  
   Returns:  
       str: result message  
   &quot;&quot;&quot;</span>  
   Try:  
       <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;\\n[Tool Call] store_memory&quot;</span>)  
       <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot; - question: <span class="hljs-subst">{question[:<span class="hljs-number">50</span>]}</span>...&quot;</span>)  
       <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot; - solution: <span class="hljs-subst">{solution[:<span class="hljs-number">50</span>]}</span>...&quot;</span>)  
       <span class="hljs-comment"># Use global USER_ID (in production, this should come from ToolContext)  </span>
       user_id = USER_ID  
       session_id = <span class="hljs-string">f&quot;session_<span class="hljs-subst">{<span class="hljs-built_in">int</span>(time.time())}</span>&quot;</span>  
       <span class="hljs-comment"># Key step 1: convert the question into a 768-dimensional vector  </span>
       embedding_result = genai.embed_content(  
           model=EMBEDDING_MODEL,  
           content=question,  
           task_type=<span class="hljs-string">&quot;retrieval_document&quot;</span>,  <span class="hljs-comment"># specify document indexing task  </span>
           output_dimensionality=EMBEDDING_DIM  
       )  
       embedding = embedding_result[<span class="hljs-string">&quot;embedding&quot;</span>]  
       <span class="hljs-comment"># Key step 2: insert into Milvus  </span>
       memory_collection.insert([{  
           <span class="hljs-string">&quot;user_id&quot;</span>: user_id,  
           <span class="hljs-string">&quot;session_id&quot;</span>: session_id,  
           <span class="hljs-string">&quot;question&quot;</span>: question,  
           <span class="hljs-string">&quot;solution&quot;</span>: solution,  
           <span class="hljs-string">&quot;embedding&quot;</span>: embedding,  
           <span class="hljs-string">&quot;timestamp&quot;</span>: <span class="hljs-built_in">int</span>(time.time())  
       }])  
       <span class="hljs-comment"># Key step 3: flush to disk (ensure data persistence)  </span>
       memory_collection.flush()  
       result = <span class="hljs-string">&quot;✓ Successfully stored in memory&quot;</span>  
       <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Tool Result] <span class="hljs-subst">{result}</span>&quot;</span>)  
       <span class="hljs-keyword">return</span> result  
   <span class="hljs-keyword">except</span> Exception <span class="hljs-keyword">as</span> e:  
       error_msg = <span class="hljs-string">f&quot;✗ Storage failed: <span class="hljs-subst">{<span class="hljs-built_in">str</span>(e)}</span>&quot;</span>  
       <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Tool Error] <span class="hljs-subst">{error_msg}</span>&quot;</span>)  
       <span class="hljs-keyword">return</span> error_msg  
<button class="copy-code-btn"></button></code></pre>
<p>(2) 검색 메모리 함수</p>
<pre><code translate="no"><span class="hljs-keyword">def</span> <span class="hljs-title function_">recall_memory</span>(<span class="hljs-params">query: <span class="hljs-built_in">str</span>, top_k: <span class="hljs-built_in">int</span> = <span class="hljs-number">3</span></span>) -&gt; <span class="hljs-built_in">str</span>:  
   <span class="hljs-string">&quot;&quot;&quot;  
   Retrieve relevant historical cases from the memory store  
   Args:  
       query: query question  
       top_k: number of most similar results to return  
   Returns:  
       str: retrieval result  
   &quot;&quot;&quot;</span>  
   Try:  
       <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;\\n[Tool Call] recall_memory&quot;</span>)  
       <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot; - query: <span class="hljs-subst">{query}</span>&quot;</span>)  
       <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot; - top_k: <span class="hljs-subst">{top_k}</span>&quot;</span>)  
       user_id = USER_ID  
       <span class="hljs-comment"># Key step 1: convert the query into a vector  </span>
       embedding_result = genai.embed_content(  
           model=EMBEDDING_MODEL,  
           content=query,  
           task_type=<span class="hljs-string">&quot;retrieval_query&quot;</span>,  <span class="hljs-comment"># specify query task (different from indexing)  </span>
           output_dimensionality=EMBEDDING_DIM  
       )  
       query_embedding = embedding_result[<span class="hljs-string">&quot;embedding&quot;</span>]  
       <span class="hljs-comment"># Key step 2: load the collection into memory (required for the first query)  </span>
       memory_collection.load()  
       <span class="hljs-comment"># Key step 3: hybrid search (vector similarity + scalar filtering)  </span>
       results = memory_collection.search(  
           data=[query_embedding],  
           anns_field=<span class="hljs-string">&quot;embedding&quot;</span>,  
           param={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;COSINE&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;nprobe&quot;</span>: <span class="hljs-number">10</span>}},  
           limit=top_k,  
           expr=<span class="hljs-string">f&#x27;user_id == &quot;<span class="hljs-subst">{user_id}</span>&quot;&#x27;</span>,  <span class="hljs-comment"># 🔑 key to user isolation  </span>
           output_fields=[<span class="hljs-string">&quot;question&quot;</span>, <span class="hljs-string">&quot;solution&quot;</span>, <span class="hljs-string">&quot;timestamp&quot;</span>]  
       )  
       <span class="hljs-comment"># Key step 4: format results  </span>
       <span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> results[<span class="hljs-number">0</span>]:  
           result = <span class="hljs-string">&quot;No relevant historical cases found&quot;</span>  
           <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Tool Result] <span class="hljs-subst">{result}</span>&quot;</span>)  
           <span class="hljs-keyword">return</span> result  
       result_text = <span class="hljs-string">f&quot;Found <span class="hljs-subst">{<span class="hljs-built_in">len</span>(results[<span class="hljs-number">0</span>])}</span> relevant cases:\\n\\n&quot;</span>  
       <span class="hljs-keyword">for</span> i, hit <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(results[<span class="hljs-number">0</span>]):  
           result_text += <span class="hljs-string">f&quot;Case <span class="hljs-subst">{i+<span class="hljs-number">1</span>}</span> (similarity: <span class="hljs-subst">{hit.score:<span class="hljs-number">.2</span>f}</span>):\\n&quot;</span>  
           result_text += <span class="hljs-string">f&quot;Question: <span class="hljs-subst">{hit.entity.get(<span class="hljs-string">&#x27;question&#x27;</span>)}</span>\\n&quot;</span>  
           result_text += <span class="hljs-string">f&quot;Solution: <span class="hljs-subst">{hit.entity.get(<span class="hljs-string">&#x27;solution&#x27;</span>)}</span>\\n\\n&quot;</span>  
       <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Tool Result] Found <span class="hljs-subst">{<span class="hljs-built_in">len</span>(results[<span class="hljs-number">0</span>])}</span> cases&quot;</span>)  
       <span class="hljs-keyword">return</span> result_text  
   <span class="hljs-keyword">except</span> Exception <span class="hljs-keyword">as</span> e:  
       error_msg = <span class="hljs-string">f&quot;Retrieval failed: <span class="hljs-subst">{<span class="hljs-built_in">str</span>(e)}</span>&quot;</span>  
       <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Tool Error] <span class="hljs-subst">{error_msg}</span>&quot;</span>)  
       <span class="hljs-keyword">return</span> error_msg  
<button class="copy-code-btn"></button></code></pre>
<p>(3) ADK 도구로 등록</p>
<pre><code translate="no"><span class="hljs-comment"># Usage  </span>
<span class="hljs-comment"># Wrap functions with FunctionTool  </span>
store_memory_tool = FunctionTool(func=store_memory)  
recall_memory_tool = FunctionTool(func=recall_memory)  
memory_tools = [store_memory_tool, recall_memory_tool]  
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-5-Agent-Definition" class="common-anchor-header">5단계 에이전트 정의</h3><p>핵심 아이디어: 에이전트의 동작 로직을 정의합니다.</p>
<pre><code translate="no"><span class="hljs-comment"># ==================== Create Agent ====================  </span>
support_agent = Agent(  
   model=LLM_MODEL,  
   name=<span class="hljs-string">&quot;support_agent&quot;</span>,  
   description=<span class="hljs-string">&quot;Technical support expert agent that can remember and recall historical cases&quot;</span>,  
   <span class="hljs-comment"># Key: the instruction defines the agent’s behavior  </span>
   instruction=<span class="hljs-string">&quot;&quot;&quot;  
You are a technical support expert. Strictly follow the process below:  
&lt;b&gt;When the user asks a technical question:&lt;/b&gt;  
1. Immediately call the recall_memory tool to search for historical cases  
  - Parameter query: use the user’s question text directly  
  - Do not ask for any additional information; call the tool directly  
2. Answer based on the retrieval result:  
  - If relevant cases are found: explain that similar historical cases were found and answer by referencing their solutions  
  - If no cases are found: explain that this is a new issue and answer based on your own knowledge  
3. After answering, ask: “Did this solution resolve your issue?”  
&lt;b&gt;When the user confirms the issue is resolved:&lt;/b&gt;  
- Immediately call the store_memory tool to save this Q&amp;A  
- Parameter question: the user’s original question  
- Parameter solution: the complete solution you provided  
&lt;b&gt;Important rules:&lt;/b&gt;  
- You must call a tool before answering  
- Do not ask for user_id or any other parameters  
- Only store memory when you see confirmation phrases such as “resolved”, “it works”, or “thanks”  
&quot;&quot;&quot;</span>,  
   tools=memory_tools  
)  
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-6-Main-Program-and-Execution-Flow" class="common-anchor-header">6단계 주요 프로그램 및 실행 흐름</h3><p>세션 간 메모리 검색의 전체 프로세스를 시연합니다.</p>
<pre><code translate="no"><span class="hljs-comment"># ==================== Main Program ====================  </span>
<span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">main</span>():  
   <span class="hljs-string">&quot;&quot;&quot;Demonstrate cross-session memory recall&quot;&quot;&quot;</span>  
   <span class="hljs-comment"># Create Session service and Runner  </span>
   session_service = InMemorySessionService()  
   runner = Runner(  
       agent=support_agent,  
       app_name=APP_NAME,  
       session_service=session_service  
   )  
   <span class="hljs-comment"># ========== First round: build memory ==========  </span>
   <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\\n&quot;</span> + <span class="hljs-string">&quot;=&quot;</span> \* <span class="hljs-number">60</span>)  
   <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;First conversation: user asks a question and the solution is stored&quot;</span>)  
   <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;=&quot;</span> \* <span class="hljs-number">60</span>)  
   session1 = <span class="hljs-keyword">await</span> session_service.create_session(  
       app_name=APP_NAME,  
       user_id=USER_ID,  
       session_id=<span class="hljs-string">&quot;session_001&quot;</span>  
   )  
   <span class="hljs-comment"># User asks the first question  </span>
   <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\\n[User]: What should I do if Milvus connection times out?&quot;</span>)  
   content1 = types.Content(  
       role=<span class="hljs-string">&#x27;user&#x27;</span>,  
       parts=[types.Part(text=<span class="hljs-string">&quot;What should I do if Milvus connection times out?&quot;</span>)]  
   )  
   <span class="hljs-keyword">async</span> <span class="hljs-keyword">for</span> event <span class="hljs-keyword">in</span> runner.run_async(  
       user_id=USER_ID,  
       session_id=[session1.<span class="hljs-built_in">id</span>](http://session1.<span class="hljs-built_in">id</span>),  
       new_message=content1  
   ):  
       <span class="hljs-keyword">if</span> event.content <span class="hljs-keyword">and</span> event.content.parts:  
           <span class="hljs-keyword">for</span> part <span class="hljs-keyword">in</span> event.content.parts:  
               <span class="hljs-keyword">if</span> <span class="hljs-built_in">hasattr</span>(part, <span class="hljs-string">&#x27;text&#x27;</span>) <span class="hljs-keyword">and</span> part.text:  
                   <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Agent]: <span class="hljs-subst">{part.text}</span>&quot;</span>)  
   <span class="hljs-comment"># User confirms the issue is resolved  </span>
   <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\\n[User]: The issue is resolved, thanks!&quot;</span>)  
   content2 = types.Content(  
       role=<span class="hljs-string">&#x27;user&#x27;</span>,  
       parts=[types.Part(text=<span class="hljs-string">&quot;The issue is resolved, thanks!&quot;</span>)]  
   )  
   <span class="hljs-keyword">async</span> <span class="hljs-keyword">for</span> event <span class="hljs-keyword">in</span> runner.run_async(  
       user_id=USER_ID,  
       session_id=[session1.<span class="hljs-built_in">id</span>](http://session1.<span class="hljs-built_in">id</span>),  
       new_message=content2  
   ):  
       <span class="hljs-keyword">if</span> event.content <span class="hljs-keyword">and</span> event.content.parts:  
           <span class="hljs-keyword">for</span> part <span class="hljs-keyword">in</span> event.content.parts:  
               <span class="hljs-keyword">if</span> <span class="hljs-built_in">hasattr</span>(part, <span class="hljs-string">&#x27;text&#x27;</span>) <span class="hljs-keyword">and</span> part.text:  
                   <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Agent]: <span class="hljs-subst">{part.text}</span>&quot;</span>)  
   <span class="hljs-comment"># ========== Second round: recall memory ==========  </span>
   <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\\n&quot;</span> + <span class="hljs-string">&quot;=&quot;</span> \* <span class="hljs-number">60</span>)  
   <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Second conversation: new session with memory recall&quot;</span>)  
   <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;=&quot;</span> \* <span class="hljs-number">60</span>)  
   session2 = <span class="hljs-keyword">await</span> session_service.create_session(  
       app_name=APP_NAME,  
       user_id=USER_ID,  
       session_id=<span class="hljs-string">&quot;session_002&quot;</span>  
   )  
   <span class="hljs-comment"># User asks a similar question in a new session  </span>
   <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\\n[User]: Milvus can&#x27;t connect&quot;</span>)  
   content3 = types.Content(  
       role=<span class="hljs-string">&#x27;user&#x27;</span>,  
       parts=[types.Part(text=<span class="hljs-string">&quot;Milvus can&#x27;t connect&quot;</span>)]  
   )  
   <span class="hljs-keyword">async</span> <span class="hljs-keyword">for</span> event <span class="hljs-keyword">in</span> runner.run_async(  
       user_id=USER_ID,  
       session_id=[session2.<span class="hljs-built_in">id</span>](http://session2.<span class="hljs-built_in">id</span>),  
       new_message=content3  
   ):  
       <span class="hljs-keyword">if</span> event.content <span class="hljs-keyword">and</span> event.content.parts:  
           <span class="hljs-keyword">for</span> part <span class="hljs-keyword">in</span> event.content.parts:  
               <span class="hljs-keyword">if</span> <span class="hljs-built_in">hasattr</span>(part, <span class="hljs-string">&#x27;text&#x27;</span>) <span class="hljs-keyword">and</span> part.text:  
                   <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Agent]: <span class="hljs-subst">{part.text}</span>&quot;</span>)

  
<span class="hljs-comment"># Program entry point  </span>
<span class="hljs-keyword">if</span> __name__ == <span class="hljs-string">&quot;__main__&quot;</span>:  
   Try:  
       asyncio.run(main())  
   <span class="hljs-keyword">except</span> KeyboardInterrupt:  
       <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\\n\\nProgram exited&quot;</span>)  
   <span class="hljs-keyword">except</span> Exception <span class="hljs-keyword">as</span> e:  
       <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;\\n\\nProgram error: <span class="hljs-subst">{e}</span>&quot;</span>)  
       <span class="hljs-keyword">import</span> traceback  
       traceback.print_exc()  
   Finally:  
       Try:  
           connections.disconnect(alias=<span class="hljs-string">&quot;default&quot;</span>)  
           <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\\n✓ Disconnected from Milvus&quot;</span>)  
       Except:  
           <span class="hljs-keyword">pass</span>  
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-7-Run-and-Test" class="common-anchor-header">7단계 실행 및 테스트</h3><p><strong>(1) 환경 변수 설정</strong></p>
<pre><code translate="no"><span class="hljs-keyword">export</span> <span class="hljs-variable constant_">GOOGLE_API_KEY</span>=<span class="hljs-string">&quot;your-gemini-api-key&quot;</span>  
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">python milvus_agent.py  
<button class="copy-code-btn"></button></code></pre>
<h3 id="Expected-Output" class="common-anchor-header">예상 출력</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/how_to_build_productionready_ai_agents_with_longterm_memory_using_google_adk_and_milvus_5_0c5a37fe32.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/how_to_build_productionready_ai_agents_with_longterm_memory_using_google_adk_and_milvus_3_cf3a60bd51.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>출력은 메모리 시스템이 실제 사용 시 어떻게 작동하는지 보여줍니다.</p>
<p>첫 번째 대화에서 사용자는 Milvus 연결 시간 초과를 처리하는 방법을 묻습니다. 상담원이 해결책을 제시합니다. 사용자가 문제가 해결되었음을 확인한 후 상담원은 이 질문과 답변을 메모리에 저장합니다.</p>
<p>두 번째 대화에서는 새 세션이 시작됩니다. 사용자가 다른 단어를 사용하여 동일한 질문을 합니다: "밀버스가 연결할 수 없어요." 상담원이 메모리에서 유사한 사례를 자동으로 검색하여 동일한 솔루션을 제공합니다.</p>
<p>수동 단계가 필요하지 않습니다. 상담원은 세션 간 메모리, 시맨틱 매칭, 사용자 격리라는 세 가지 주요 기능을 통해 과거 사례를 검색할 때와 새 사례를 저장할 때를 결정합니다.</p>
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
    </button></h2><p>ADK는 프레임워크 수준에서 세션서비스와 메모리서비스를 사용하여 단기 컨텍스트와 장기 메모리를 분리합니다. <a href="https://milvus.io/">Milvus는</a> 벡터 기반 검색을 통해 시맨틱 검색과 사용자 수준 필터링을 처리합니다.</p>
<p>프레임워크를 선택할 때는 목표가 중요합니다. 강력한 상태 격리, 감사 가능성 및 프로덕션 안정성이 필요하다면 ADK가 더 적합합니다. 프로토타이핑이나 실험을 하는 경우, LLM 기반 애플리케이션과 에이전트를 빠르게 구축하는 데 널리 사용되는 Python 프레임워크인 LangChain이 더 많은 유연성을 제공합니다.</p>
<p>에이전트 메모리의 경우 핵심은 데이터베이스입니다. 시맨틱 메모리는 어떤 프레임워크를 사용하든 벡터 데이터베이스에 의존합니다. Milvus는 오픈 소스이고 로컬에서 실행되며 단일 머신에서 수십억 개의 벡터 처리를 지원하고 하이브리드 벡터, 스칼라 및 전체 텍스트 검색을 지원하기 때문에 잘 작동합니다. 이러한 기능은 초기 테스트와 프로덕션 사용 모두에 적용됩니다.</p>
<p>이 글이 에이전트 메모리 설계를 더 잘 이해하고 프로젝트에 적합한 도구를 선택하는 데 도움이 되기를 바랍니다.</p>
<p>더 큰 컨텍스트 창이 아닌 실제 메모리가 필요한 AI 에이전트를 구축하고 계신다면 어떻게 접근하고 계신지 듣고 싶습니다.</p>
<p>ADK, 에이전트 메모리 설계 또는 Milvus를 메모리 백엔드로 사용하는 것에 대해 질문이 있으신가요? <a href="https://milvusio.slack.com/join/shared_invite/zt-3nntzngkz-gYwhrdSE4~76k0VMyBfD1Q#/shared-invite/email">Slack 채널에</a> 참여하거나 20분 동안 진행되는 <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">Milvus 오피스 아워</a> 세션을 예약하여 사용 사례에 대해 이야기해 보세요.</p>
