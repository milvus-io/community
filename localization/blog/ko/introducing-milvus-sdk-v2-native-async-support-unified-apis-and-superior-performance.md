---
id: >-
  introducing-milvus-sdk-v2-native-async-support-unified-apis-and-superior-performance.md
title: 'Milvus SDK v2를 소개합니다: 네이티브 비동기 지원, 통합 API 및 뛰어난 성능'
author: Ken Zhang
date: 2025-04-16T00:00:00.000Z
desc: >-
  개발자를 위해 재탄생한 Milvus SDK v2를 경험해 보세요! 벡터 검색 프로젝트를 위한 통합 API, 기본 비동기 지원, 향상된 성능을
  즐겨보세요.
cover: assets.zilliz.com/Introducing_Milvus_SDK_v2_05c9e5e8b2.png
tag: Engineering
tags: 'Milvus SDK v2, Async Support, Milvus vector database'
canonicalUrl: >-
  https://milvus.io/blog/introducing-milvus-sdk-v2-native-async-support-unified-apis-and-superior-performance.md
---
<h2 id="TLDR" class="common-anchor-header">TL;DR<button data-href="#TLDR" class="anchor-icon" translate="no">
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
    </button></h2><p>여러분의 의견을 경청했습니다! Milvus SDK v2는 여러분의 피드백을 바탕으로 개발자 환경을 완전히 새롭게 재구성한 버전입니다. Python, Java, Go, Node.js를 아우르는 통합 API, 요청이 많았던 기본 비동기 지원, 성능 향상을 위한 스키마 캐시, 간소화된 MilvusClient 인터페이스를 갖춘 Milvus SDK v2는 <a href="https://zilliz.com/learn/vector-similarity-search">벡터 검색</a> 개발을 그 어느 때보다 빠르고 직관적으로 만들어줍니다. <a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">RAG</a> 애플리케이션, 추천 시스템 또는 <a href="https://zilliz.com/learn/what-is-computer-vision">컴퓨터 비전</a> 솔루션을 구축 중이시든, 커뮤니티가 주도하는 이 업데이트는 Milvus로 작업하는 방식을 혁신할 것입니다.</p>
<h2 id="Why-We-Built-It-Addressing-Community-Pain-Points" class="common-anchor-header">개발 이유 커뮤니티의 고충 해결<button data-href="#Why-We-Built-It-Addressing-Community-Pain-Points" class="anchor-icon" translate="no">
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
    </button></h2><p>수년에 걸쳐 Milvus는 수천 개의 AI 애플리케이션이 선택한 <a href="https://milvus.io/blog/what-is-a-vector-database.md">벡터 데이터베이스가</a> 되었습니다. 그러나 커뮤니티가 성장함에 따라 SDK v1의 몇 가지 한계에 대한 이야기를 지속적으로 들었습니다:</p>
<p><strong>"높은 동시성을 처리하는 것이 너무 복잡하다."</strong> 일부 언어 SDK에는 기본 비동기 지원이 없기 때문에 개발자는 스레드나 콜백에 의존해야 했고, 특히 배치 데이터 로딩이나 병렬 쿼리와 같은 시나리오에서 코드를 관리하고 디버깅하기가 더 어려웠습니다.</p>
<p><strong>"규모에 따라 성능이 저하됩니다."</strong> 스키마 캐시가 없으면 v1은 작업 중에 스키마의 유효성을 반복적으로 검사하여 대용량 워크로드에 병목 현상을 일으켰습니다. 대규모 벡터 처리가 필요한 사용 사례에서는 이 문제로 인해 지연 시간이 증가하고 처리량이 감소했습니다.</p>
<p><strong>"언어 간의 일관되지 않은 인터페이스는 가파른 학습 곡선을 만듭니다."</strong> 서로 다른 언어 SDK는 각기 다른 방식으로 인터페이스를 구현하여 언어 간 개발을 복잡하게 만들었습니다.</p>
<p><strong>"RESTful API에는 필수 기능이 누락되어 있습니다."</strong> 파티션 관리 및 인덱스 구성과 같은 중요한 기능을 사용할 수 없었기 때문에 개발자는 서로 다른 SDK 간에 전환해야 했습니다.</p>
<p>이는 단순한 기능 요청이 아니라 개발 워크플로우의 실질적인 장애물이었습니다. SDK v2는 이러한 장벽을 없애고 개발자가 중요한 것, 즉 놀라운 AI 애플리케이션을 구축하는 데 집중할 수 있도록 하겠다는 약속입니다.</p>
<h2 id="The-Solution-Milvus-SDK-v2" class="common-anchor-header">솔루션: Milvus SDK v2<button data-href="#The-Solution-Milvus-SDK-v2" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus SDK v2는 개발자 경험에 초점을 맞춰 완전히 재설계한 결과물로, 여러 언어로 제공됩니다:</p>
<ul>
<li><p><a href="https://milvus.io/api-reference/pymilvus/v2.5.x/About.md">Python SDK v2(pymilvus.MilvusClient)</a></p></li>
<li><p><a href="https://github.com/milvus-io/milvus-sdk-java">Java v2</a></p></li>
<li><p><a href="https://github.com/milvus-io/milvus/tree/client/v2.5.1/client">Go v2</a></p></li>
<li><p><a href="https://github.com/milvus-io/milvus-sdk-node">NodeJS</a></p></li>
<li><p><a href="https://milvus.io/api-reference/restful/v2.5.x/About.md">RESTful v2</a></p></li>
</ul>
<h3 id="1-Native-Asynchronous-Support-From-Complex-to-Concurrent" class="common-anchor-header">1. 네이티브 비동기 지원: 복잡성에서 동시성으로</h3><p>기존 동시성 처리 방식은 번거로운 Future 객체와 콜백 패턴을 사용했습니다. SDK v2는 특히 Python( <code translate="no">AsyncMilvusClient</code> )에서 진정한 비동기/대기 기능을 도입했습니다(v2.5.3부터). 동기식 MilvusClient와 동일한 매개변수를 사용하여 삽입, 쿼리, 검색과 같은 작업을 병렬로 쉽게 실행할 수 있습니다.</p>
<p>이 간소화된 접근 방식은 기존의 번거로운 Future 및 콜백 패턴을 대체하여 보다 깔끔하고 효율적인 코드를 생성합니다. 이제 배치 벡터 삽입이나 병렬 다중 쿼리와 같은 복잡한 동시 로직도 <code translate="no">asyncio.gather</code> 과 같은 도구를 사용하여 손쉽게 구현할 수 있습니다.</p>
<h3 id="2-Schema-Cache-Boosting-Performance-Where-It-Counts" class="common-anchor-header">2. 스키마 캐시: 중요한 곳에서 성능 향상</h3><p>SDK v2는 초기 가져오기 후 컬렉션 스키마를 로컬에 저장하는 스키마 캐시를 도입하여 작업 중 반복되는 네트워크 요청과 CPU 오버헤드를 제거합니다.</p>
<p>빈도가 높은 삽입 및 쿼리 시나리오의 경우, 이 업데이트는 다음과 같이 해석됩니다:</p>
<ul>
<li><p>클라이언트와 서버 간의 네트워크 트래픽 감소</p></li>
<li><p>작업 지연 시간 단축</p></li>
<li><p>서버 측 CPU 사용량 감소</p></li>
<li><p>높은 동시성에서 더 나은 확장성</p></li>
</ul>
<p>이는 밀리초가 중요한 실시간 추천 시스템이나 실시간 검색 기능과 같은 애플리케이션에 특히 유용합니다.</p>
<h3 id="3-A-Unified-and-Streamlined-API-Experience" class="common-anchor-header">3. 통합되고 간소화된 API 환경</h3><p>Milvus SDK v2는 지원되는 모든 프로그래밍 언어에 걸쳐 통합되고 더욱 완벽한 API 환경을 도입했습니다. 특히 RESTful API가 대폭 개선되어 gRPC 인터페이스와 거의 동등한 기능을 제공합니다.</p>
<p>이전 버전에서는 RESTful API가 gRPC보다 뒤처져 개발자가 인터페이스를 전환하지 않고도 할 수 있는 일이 제한적이었습니다. 이제 더 이상 그렇지 않습니다. 이제 개발자는 컬렉션 생성, 파티션 관리, 인덱스 구축, 쿼리 실행 등 거의 모든 핵심 작업을 gRPC나 다른 방법으로 되돌아갈 필요 없이 RESTful API를 사용하여 수행할 수 있습니다.</p>
<p>이 통합된 접근 방식은 다양한 환경과 사용 사례에서 일관된 개발자 경험을 보장합니다. 학습 곡선을 줄이고 통합을 간소화하며 전반적인 사용성을 개선합니다.</p>
<p>참고: 대부분의 사용자에게 RESTful API는 Milvus를 더 빠르고 쉽게 시작할 수 있는 방법을 제공합니다. 그러나 애플리케이션에 반복기와 같은 고성능 또는 고급 기능이 필요한 경우에는 유연성과 제어를 극대화하기 위해 gRPC 클라이언트를 계속 사용하는 것이 좋습니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/RES_Tful_8520a80a8e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="4-Aligned-SDK-Design-Across-All-Languages" class="common-anchor-header">4. 모든 언어에 걸쳐 정렬된 SDK 디자인</h3><p>Milvus SDK v2에서는 보다 일관된 개발자 경험을 제공하기 위해 지원되는 모든 프로그래밍 언어에 걸쳐 SDK 디자인을 표준화했습니다.</p>
<p>Python, Java, Go, Node.js 등 어떤 언어로 빌드하든 이제 각 SDK는 MilvusClient 클래스를 중심으로 한 통합된 구조를 따릅니다. 이러한 재설계는 지원하는 모든 언어에 일관된 메서드 명명, 매개변수 서식 및 전반적인 사용 패턴을 제공합니다. (참조: <a href="https://github.com/milvus-io/milvus/discussions/33979">MilvusClient SDK 코드 예제 업데이트 - GitHub 토론 #33979</a>)</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Milvus_Client_9a4a6da9e3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>이제 한 언어로 Milvus에 익숙해지면 SDK의 작동 방식을 다시 배울 필요 없이 다른 언어로 쉽게 전환할 수 있습니다. 이러한 정렬은 온보딩을 간소화할 뿐만 아니라 다국어 개발을 훨씬 더 원활하고 직관적으로 만들어 줍니다.</p>
<h3 id="5-A-Simpler-Smarter-PyMilvus-Python-SDK-with-MilvusClient" class="common-anchor-header">5. 더 간단하고 스마트해진 PyMilvus(파이썬 SDK) <code translate="no">MilvusClient</code></h3><p>이전 버전에서 PyMilvus는 객체 지향과 절차적 접근 방식을 혼합한 ORM 스타일 디자인에 의존했습니다. 개발자는 컬렉션을 생성하기 위해 <code translate="no">FieldSchema</code> 객체를 정의하고 <code translate="no">CollectionSchema</code> 을 빌드한 다음 <code translate="no">Collection</code> 클래스를 인스턴스화해야 했습니다. 이 프로세스는 장황할 뿐만 아니라 신규 사용자에게는 더 가파른 학습 곡선을 초래했습니다.</p>
<p>새로운 <code translate="no">MilvusClient</code> 인터페이스를 사용하면 훨씬 더 간단해집니다. 이제 <code translate="no">create_collection()</code> 방법을 사용하여 한 단계로 컬렉션을 만들 수 있습니다. <code translate="no">dimension</code> 및 <code translate="no">metric_type</code> 과 같은 매개변수를 전달하여 스키마를 빠르게 정의하거나 필요한 경우 사용자 정의 스키마 객체를 사용할 수 있습니다.</p>
<p>더 좋은 점은 <code translate="no">create_collection()</code> 에서 동일한 호출의 일부로 인덱스 생성을 지원한다는 점입니다. 인덱스 매개변수를 제공하면 Milvus가 자동으로 인덱스를 생성하고 데이터를 메모리에 로드하므로 별도의 <code translate="no">create_index()</code> 또는 <code translate="no">load()</code> 호출이 필요 없습니다. <em>컬렉션 생성 → 인덱스 생성 → 컬렉션 로드라는</em> 한 가지 방법으로 모든 작업을 수행할 수 있습니다 <em>.</em></p>
<p>이 간소화된 접근 방식은 설정의 복잡성을 줄여주고 특히 프로토타이핑이나 프로덕션으로 가는 빠르고 효율적인 경로를 원하는 개발자들이 Milvus를 훨씬 더 쉽게 시작할 수 있게 해줍니다.</p>
<p>새로운 <code translate="no">MilvusClient</code> 모듈은 사용성, 일관성, 성능 면에서 분명한 이점을 제공합니다. 현재로서는 레거시 ORM 인터페이스를 계속 사용할 수 있지만, 향후 단계적으로 중단할 계획입니다( <a href="https://docs.zilliz.com/reference/python/ORM#:~:text=About%20to%20Deprecate">참조 참조</a>). 개선된 기능을 최대한 활용하려면 새 SDK로 업그레이드하는 것이 좋습니다.</p>
<h3 id="6-Clearer-and-More-Comprehensive-Documentation" class="common-anchor-header">6. 더 명확하고 포괄적인 문서</h3><p>보다 완전하고 명확한 <a href="https://milvus.io/docs">API 참조를</a> 제공하기 위해 제품 설명서를 재구성했습니다. 이제 사용자 가이드에 다국어 샘플 코드가 포함되어 있어 빠르게 시작하고 Milvus의 기능을 쉽게 이해할 수 있습니다. 또한 문서 사이트에서 제공되는 'AI에게 물어보세요' 도우미는 새로운 기능을 소개하고 내부 메커니즘을 설명하며 샘플 코드를 생성하거나 수정하는 데 도움을 줄 수 있어 문서를 보다 원활하고 즐겁게 살펴볼 수 있습니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Ask_AI_Assistant_b044d4621a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="7-Milvus-MCP-Server-Designed-for-the-Future-of-AI-Integration" class="common-anchor-header">7. Milvus MCP 서버: AI 통합의 미래를 위한 설계</h3><p>Milvus SDK를 기반으로 구축된 <a href="https://github.com/zilliztech/mcp-server-milvus">MCP 서버는</a> 대규모 언어 모델<a href="https://zilliz.com/glossary/large-language-models-(llms)">(LLM)</a>, <a href="https://milvus.io/blog/what-is-a-vector-database.md">벡터 데이터베이스</a>, 외부 도구 또는 데이터 소스 간의 원활한 통합이라는 AI 에코시스템의 증가하는 요구에 대한 해답입니다. 이 솔루션은 모델 컨텍스트 프로토콜(MCP)을 구현하여 Milvus 운영 및 그 이상을 오케스트레이션하기 위한 통합된 지능형 인터페이스를 제공합니다.</p>
<p><a href="https://zilliz.com/blog/top-10-ai-agents-to-watch-in-2025">AI 에이전트가</a> 단순히 코드를 생성하는 데 그치지 않고 백엔드 서비스를 자율적으로 관리할 수 있게 되면서 더 스마트한 API 기반 인프라에 대한 요구가 증가하고 있습니다. MCP 서버는 이러한 미래를 염두에 두고 설계되었습니다. Milvus 클러스터와의 지능적이고 자동화된 상호 작용을 지원하여 배포, 유지 관리 및 데이터 관리와 같은 작업을 간소화합니다.</p>
<p>더 중요한 것은 새로운 종류의 기계 간 협업을 위한 토대를 마련한다는 점입니다. MCP 서버를 통해 AI 에이전트는 사람의 개입 없이도 API를 호출하여 컬렉션을 동적으로 생성하고, 쿼리를 실행하고, 인덱스를 구축하는 등의 작업을 수행할 수 있습니다.</p>
<p>간단히 말해, MCP 서버는 Milvus를 단순한 데이터베이스가 아니라 완전히 프로그래밍 가능한 AI 지원 백엔드로 전환하여 지능적이고 자율적이며 확장 가능한 애플리케이션을 위한 기반을 마련합니다.</p>
<h2 id="Getting-Started-with-Milvus-SDK-v2-Sample-Code" class="common-anchor-header">Milvus SDK v2 시작하기: 샘플 코드<button data-href="#Getting-Started-with-Milvus-SDK-v2-Sample-Code" class="anchor-icon" translate="no">
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
    </button></h2><p>아래 예제는 새로운 PyMilvus(Python SDK v2) 인터페이스를 사용하여 컬렉션을 생성하고 비동기 작업을 수행하는 방법을 보여줍니다. 이전 버전의 ORM 스타일 접근 방식에 비해 이 코드는 더 깔끔하고 일관적이며 작업하기 쉽습니다.</p>
<h3 id="1-Creating-a-Collection-Defining-Schemas-Building-Indexes-and-Loading-Data-with-MilvusClient" class="common-anchor-header">1. 컬렉션 만들기, 스키마 정의, 인덱스 구축 및 다음을 사용하여 데이터 로드하기 <code translate="no">MilvusClient</code></h3><p>아래의 Python 코드 스니펫은 컬렉션을 만들고, 스키마를 정의하고, 인덱스를 만들고, 데이터를 로드하는 방법을 한 번의 호출로 모두 보여줍니다:</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient, DataType

<span class="hljs-comment"># 1. Connect to Milvus (initialize the client)</span>
client = MilvusClient(uri=<span class="hljs-string">&quot;http://localhost:19530&quot;</span>)

<span class="hljs-comment"># 2. Define the collection schema</span>
schema = MilvusClient.create_schema(auto_id=<span class="hljs-literal">False</span>, description=<span class="hljs-string">&quot;schema for example collection&quot;</span>)
schema.add_field(<span class="hljs-string">&quot;id&quot;</span>, DataType.INT64, is_primary=<span class="hljs-literal">True</span>)  <span class="hljs-comment"># Primary key field</span>
schema.add_field(<span class="hljs-string">&quot;embedding&quot;</span>, DataType.FLOAT_VECTOR, dim=<span class="hljs-number">128</span>)  <span class="hljs-comment"># Vector field</span>

<span class="hljs-comment"># 3. Prepare index parameters (optional if indexing at creation time)</span>
index_params = client.prepare_index_params()
index_params.add_index(
    field_name=<span class="hljs-string">&quot;embedding&quot;</span>,
    index_type=<span class="hljs-string">&quot;AUTOINDEX&quot;</span>,
    metric_type=<span class="hljs-string">&quot;L2&quot;</span>
)

<span class="hljs-comment"># 4. Create the collection with indexes and load it into memory automatically</span>
client.create_collection(
    collection_name=<span class="hljs-string">&quot;example_collection&quot;</span>,
    schema=schema,
    index_params=index_params
)

<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Collection created and loaded with index!&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p><code translate="no">create_collection</code> 메서드의 <code translate="no">index_params</code> 매개변수를 사용하면 <code translate="no">create_index</code> 및 <code translate="no">load_collection</code>을 별도로 호출할 필요가 없으며 모든 작업이 자동으로 수행됩니다.</p>
<p>또한 <code translate="no">MilvusClient</code> 메서드는 빠른 테이블 생성 모드를 지원합니다. 예를 들어, 필요한 매개변수만 지정하여 한 줄의 코드로 컬렉션을 만들 수 있습니다:</p>
<pre><code translate="no">client.<span class="hljs-title function_">create_collection</span>(
    collection_name=<span class="hljs-string">&quot;test_collection&quot;</span>,
    dimension=<span class="hljs-number">128</span>
)
<button class="copy-code-btn"></button></code></pre>
<p><em>(비교 참고: 기존 ORM 방식에서는 <code translate="no">Collection(schema)</code> 를 생성한 다음 <code translate="no">collection.create_index()</code> 과 <code translate="no">collection.load()</code> 를 별도로 호출해야 했지만, 이제 MilvusClient를 사용하면 전체 프로세스가 간소화됩니다.)</em></p>
<h3 id="2-Performing-High-Concurrency-Asynchronous-Inserts-with-AsyncMilvusClient" class="common-anchor-header">2. 를 사용하여 고비용 비동기 삽입 수행하기 <code translate="no">AsyncMilvusClient</code></h3><p>다음 예는 <code translate="no">async/await</code> 을 사용하여 동시 삽입 작업을 수행하는 <code translate="no">AsyncMilvusClient</code> 을 사용하는 방법을 보여줍니다:</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> asyncio
<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> AsyncMilvusClient

<span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">insert_vectors_concurrently</span>():
    client = AsyncMilvusClient(uri=<span class="hljs-string">&quot;http://localhost:19530&quot;</span>)
    
    vectors_to_insert = [[...], [...], ...]  <span class="hljs-comment"># Assume 100,000 vectors</span>
    batch_size = <span class="hljs-number">1000</span>  <span class="hljs-comment"># Recommended batch size</span>
    tasks = []

    <span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-number">0</span>, <span class="hljs-built_in">len</span>(vectors_to_insert), batch_size):
        batch_vectors = vectors_to_insert[i:i+batch_size]

        <span class="hljs-comment"># Construct batch data</span>
        data = [
            <span class="hljs-built_in">list</span>(<span class="hljs-built_in">range</span>(i, i + <span class="hljs-built_in">len</span>(batch_vectors))),  <span class="hljs-comment"># Batch IDs</span>
            batch_vectors  <span class="hljs-comment"># Batch vectors</span>
        ]

        <span class="hljs-comment"># Add an asynchronous task for inserting each batch</span>
        tasks.append(client.insert(<span class="hljs-string">&quot;example_collection&quot;</span>, data=data))

    <span class="hljs-comment"># Concurrently execute batch inserts</span>
    insert_results = <span class="hljs-keyword">await</span> asyncio.gather(*tasks)
    <span class="hljs-keyword">await</span> client.close()

<span class="hljs-comment"># Execute asynchronous tasks</span>
asyncio.run(insert_vectors_concurrently())
<button class="copy-code-btn"></button></code></pre>
<p>이 예제에서 <code translate="no">AsyncMilvusClient</code> 는 <code translate="no">asyncio.gather</code> 으로 여러 삽입 작업을 예약하여 데이터를 동시에 삽입하는 데 사용됩니다. 이 접근 방식은 Milvus의 백엔드 동시 처리 기능을 최대한 활용합니다. v1의 동기식, 라인별 삽입과 달리 이 기본 비동기식 지원은 처리량을 크게 증가시킵니다.</p>
<p>마찬가지로 코드를 수정하여 동시 쿼리 또는 검색을 수행할 수 있습니다(예: 삽입 호출을 <code translate="no">client.search(&quot;example_collection&quot;, data=[query_vec], limit=5)</code> 으로 대체). Milvus SDK v2의 비동기 인터페이스는 각 요청이 비차단 방식으로 실행되도록 보장하여 클라이언트 및 서버 리소스를 모두 활용합니다.</p>
<h2 id="Migration-Made-Easy" class="common-anchor-header">간편한 마이그레이션<button data-href="#Migration-Made-Easy" class="anchor-icon" translate="no">
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
    </button></h2><p>SDK v1에 많은 시간을 투자하신 것을 잘 알고 있기 때문에 기존 애플리케이션을 염두에 두고 SDK v2를 설계했습니다. SDK v2에는 이전 버전과의 호환성이 포함되어 있으므로 기존 v1/ORM 스타일 인터페이스는 당분간 계속 사용할 수 있습니다. 하지만 Milvus 3.0 출시(2025년 말)와 함께 v1에 대한 지원이 종료되므로 가능한 한 빨리 SDK v2로 업그레이드할 것을 강력히 권장합니다.</p>
<p>SDK v2로 업그레이드하면 간소화된 구문, 더 나은 비동기 지원, 향상된 성능으로 더욱 일관되고 현대적인 개발자 환경을 이용할 수 있습니다. 또한 앞으로 모든 새로운 기능과 커뮤니티 지원이 집중되는 곳이기도 합니다. 지금 업그레이드하면 다음 단계에 대비할 수 있으며 Milvus가 제공하는 최고의 기능을 이용할 수 있습니다.</p>
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
    </button></h2><p>Milvus SDK v2는 향상된 성능, 여러 프로그래밍 언어에 걸쳐 통합되고 일관된 인터페이스, 동시성이 높은 작업을 간소화하는 기본 비동기 지원 등 v1에 비해 크게 개선된 기능을 제공합니다. 보다 명확한 문서와 직관적인 코드 예제를 통해 Milvus SDK v2는 개발 프로세스를 간소화하여 AI 애플리케이션을 더 쉽고 빠르게 빌드하고 배포할 수 있도록 설계되었습니다.</p>
<p>자세한 내용은 최신 공식 <a href="https://milvus.io/docs/install-pymilvus.md#Install-Milvus-Python-SDK">API 레퍼런스 및 사용자 가이드를</a> 참조하세요. 새로운 SDK에 대해 궁금한 점이나 제안 사항이 있으시면 언제든지 <a href="https://github.com/milvus-io/milvus/discussions">GitHub와</a> <a href="https://discord.com/invite/8uyFbECzPX">Discord에</a> 피드백을 보내주세요. Milvus를 지속적으로 개선해 나가는 과정에서 여러분의 의견을 기다리겠습니다.</p>
