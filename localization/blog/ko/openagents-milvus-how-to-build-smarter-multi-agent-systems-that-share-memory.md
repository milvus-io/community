---
id: >-
  openagents-milvus-how-to-build-smarter-multi-agent-systems-that-share-memory.md
title: 'OpenAgents x Milvus: 메모리를 공유하는 더 스마트한 멀티 에이전트 시스템을 구축하는 방법'
author: Min Yin
date: 2025-11-24T00:00:00.000Z
cover: assets.zilliz.com/openagents_cover_b60b987944.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'multi-agent, Milvus, vector database, distributed AI architecture, OpenAgents'
meta_title: Build Smarter Multi-Agent Systems with OpenAgents and Milvus
desc: >-
  OpenAgents로 분산형 멀티 에이전트 협업을 지원하는 방법, 확장 가능한 메모리를 추가하는 데 Milvus가 필수적인 이유, 전체
  시스템을 구축하는 방법을 살펴보세요.
origin: >-
  https://milvus.io/blog/openagents-milvus-how-to-build-smarter-multi-agent-systems-that-share-memory.md
---
<p>대부분의 개발자는 단일 에이전트로 에이전트 시스템을 시작하고 나중에야 기본적으로 매우 비싼 챗봇을 구축했다는 사실을 깨닫게 됩니다. 간단한 작업의 경우 ReAct 스타일의 에이전트는 잘 작동하지만 단계를 병렬로 실행할 수 없고, 긴 추론 체인을 추적하지 못하며, 너무 많은 도구를 추가하면 무너지기 쉬운 등 금방 한계에 부딪힙니다. 멀티 에이전트 설정은 이러한 문제를 해결할 수 있다고 약속하지만, 조정 오버헤드, 취약한 핸드오프, 모델 품질을 조용히 약화시키는 공유 컨텍스트의 팽창 등 자체적인 문제점을 안고 있습니다.</p>
<p><a href="https://github.com/OpenAgentsInc">OpenAgents는</a> AI 에이전트가 함께 작업하고 리소스를 공유하며 지속적인 커뮤니티 내에서 장기 프로젝트를 처리하는 멀티 에이전트 시스템을 구축하기 위한 오픈 소스 프레임워크입니다. 단일 중앙 오케스트레이터 대신 OpenAgents를 사용하면 에이전트가 보다 분산된 방식으로 협업하여 서로를 발견하고, 소통하고, 공유 목표를 중심으로 조율할 수 있습니다.</p>
<p>이 파이프라인은 <a href="https://milvus.io/">Milvus</a> 벡터 데이터베이스와 결합하여 확장 가능한 고성능 장기 메모리 계층을 확보합니다. Milvus는 빠른 시맨틱 검색, HNSW 및 IVF와 같은 유연한 인덱싱 선택, 파티셔닝을 통한 깔끔한 격리를 통해 에이전트 메모리를 강화하므로 에이전트는 컨텍스트에 얽매이거나 서로의 데이터를 밟지 않고 지식을 저장, 검색 및 재사용할 수 있습니다.</p>
<p>이 게시물에서는 OpenAgents가 어떻게 분산된 다중 에이전트 협업을 지원하는지, Milvus가 확장 가능한 에이전트 메모리의 중요한 기반이 되는 이유와 이러한 시스템을 단계별로 조립하는 방법을 살펴봅니다.</p>
<h2 id="Challenges-in-Building-Real-World-Agent-Systems" class="common-anchor-header">실제 에이전트 시스템 구축의 과제<button data-href="#Challenges-in-Building-Real-World-Agent-Systems" class="anchor-icon" translate="no">
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
    </button></h2><p>오늘날 많은 주류 에이전트 프레임워크(LangChain, AutoGen, CrewAI 등)는 <strong>작업 중심</strong> 모델을 기반으로 구축됩니다. 에이전트 세트를 구성하고, 작업을 부여하고, 워크플로우를 정의한 다음 에이전트를 실행하면 됩니다. 이 방식은 범위가 좁거나 수명이 짧은 사용 사례에는 효과적이지만 실제 프로덕션 환경에서는 세 가지 구조적 한계에 노출됩니다:</p>
<ul>
<li><p><strong>지식이 사일로화됩니다.</strong> 에이전트의 경험은 자체 배포에만 국한됩니다. 엔지니어링 부서의 코드 리뷰 에이전트는 학습한 내용을 타당성을 평가하는 제품 팀 에이전트와 공유하지 않습니다. 모든 팀은 결국 처음부터 지식을 다시 구축하게 되는데, 이는 비효율적이고 취약합니다.</p></li>
<li><p><strong>협업이 경직됩니다.</strong> 다중 에이전트 프레임워크에서도 협업은 일반적으로 사전에 정의된 워크플로우에 따라 달라집니다. 협업이 변화해야 할 때 이러한 정적인 규칙은 적응할 수 없으므로 전체 시스템의 유연성이 떨어집니다.</p></li>
<li><p><strong>지속적 상태의 부족.</strong> 대부분의 에이전트는 <em>시작 → 실행 →</em> 종료라는 단순한 수명 주기를 따릅니다 <em>.</em> 실행 사이의 컨텍스트, 관계, 의사 결정, 상호작용 기록 등 모든 것을 잊어버립니다. 영구 상태가 없으면 에이전트는 장기적인 기억을 구축하거나 행동을 발전시킬 수 없습니다.</p></li>
</ul>
<p>이러한 구조적 문제는 에이전트를 더 넓은 협업 네트워크의 참여자가 아닌 고립된 작업 실행자로 취급하는 데서 비롯됩니다.</p>
<p>OpenAgents 팀은 미래의 에이전트 시스템에는 더 강력한 추론 기능뿐만 아니라 에이전트가 서로를 발견하고, 관계를 구축하고, 지식을 공유하고, 동적으로 협력할 수 있는 메커니즘이 필요하다고 믿습니다. 그리고 중요한 것은 이러한 메커니즘이 하나의 중앙 컨트롤러에 의존해서는 안 된다는 것입니다. 인터넷은 분산되어 있기 때문에 하나의 노드가 모든 것을 결정하지 않으며, 시스템이 성장함에 따라 더욱 견고해지고 확장성이 높아집니다. 멀티 에이전트 시스템도 동일한 설계 원리의 이점을 누릴 수 있습니다. 그렇기 때문에 OpenAgents는 모든 권한을 가진 오케스트레이터라는 개념을 없애고 대신 분산된 네트워크 중심의 협업을 가능하게 합니다.</p>
<h2 id="What’s-OpenAgents" class="common-anchor-header">오픈에이전트란 무엇인가요?<button data-href="#What’s-OpenAgents" class="anchor-icon" translate="no">
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
    </button></h2><p>OpenAgents는 AI 에이전트 네트워크를 구축하기 위한 오픈 소스 프레임워크로, AI 에이전트가 함께 작업하고 리소스를 공유하며 장기 프로젝트를 처리하는 개방형 협업을 가능하게 합니다. 이는 에이전트가 지속적으로 성장하는 커뮤니티에서 수백만 명의 다른 에이전트와 공개적으로 협업하는 에이전트 인터넷의 인프라를 제공합니다. 기술 수준에서 이 시스템은 세 가지 핵심 구성 요소를 중심으로 구성되어 있습니다: <strong>에이전트 네트워크, 네트워크 모드 및 전송.</strong></p>
<h3 id="1-Agent-Network-A-Shared-Environment-for-Collaboration" class="common-anchor-header">1. 에이전트 네트워크: 협업을 위한 공유 환경</h3><p>상담원 네트워크는 여러 상담원이 서로 연결하고 소통하며 복잡한 작업을 해결하기 위해 함께 작업할 수 있는 공유 환경입니다. 주요 특징은 다음과 같습니다:</p>
<ul>
<li><p><strong>지속적인 운영:</strong> 일단 만들어지면 네트워크는 단일 작업이나 워크플로우와 관계없이 온라인 상태를 유지합니다.</p></li>
<li><p><strong>동적 에이전트:</strong> 에이전트는 네트워크 ID를 사용하여 언제든지 참여할 수 있으며, 사전 등록이 필요하지 않습니다.</p></li>
<li><p><strong>다중 프로토콜 지원:</strong> 통합 추상화 계층이 WebSocket, gRPC, HTTP 및 libp2p를 통한 통신을 지원합니다.</p></li>
<li><p><strong>자율 구성:</strong> 각 네트워크는 자체 권한, 거버넌스 및 리소스를 유지합니다.</p></li>
</ul>
<p>단 한 줄의 코드만으로 네트워크를 가동할 수 있으며, 모든 에이전트가 표준 인터페이스를 통해 즉시 참여할 수 있습니다.</p>
<h3 id="2-Network-Mods-Pluggable-Extensions-for-Collaboration" class="common-anchor-header">2. 네트워크 모드: 협업을 위한 플러그형 확장 기능</h3><p>모드는 핵심 시스템과 분리된 모듈식 협업 기능 계층을 제공합니다. 특정 요구사항에 따라 모드를 믹스 앤 매치하여 각 사용 사례에 맞는 협업 패턴을 구현할 수 있습니다.</p>
<table>
<thead>
<tr><th><strong>모드</strong></th><th><strong>목적</strong></th><th><strong>사용 사례</strong></th></tr>
</thead>
<tbody>
<tr><td><strong>워크스페이스 메시징</strong></td><td>실시간 메시지 커뮤니케이션</td><td>스트리밍 응답, 즉각적인 피드백</td></tr>
<tr><td><strong>포럼</strong></td><td>비동기식 토론</td><td>제안서 검토, 다자간 심의</td></tr>
<tr><td><strong>Wiki</strong></td><td>공유 지식 베이스</td><td>지식 통합, 문서 협업</td></tr>
<tr><td><strong>소셜</strong></td><td>관계 그래프</td><td>전문가 라우팅, 신뢰 네트워크</td></tr>
</tbody>
</table>
<p>모든 모드는 통합 이벤트 시스템에서 작동하므로 필요할 때마다 프레임워크를 확장하거나 사용자 지정 동작을 쉽게 도입할 수 있습니다.</p>
<h3 id="3-Transports-A-Protocol-Agnostic-Channel-for-Communication" class="common-anchor-header">3. 전송: 프로토콜에 구애받지 않는 커뮤니케이션 채널</h3><p>트랜스포트는 이기종 에이전트가 OpenAgents 네트워크 내에서 연결하고 메시지를 교환할 수 있도록 하는 통신 프로토콜입니다. OpenAgents는 다음을 포함하여 동일한 네트워크 내에서 동시에 실행할 수 있는 여러 전송 프로토콜을 지원합니다:</p>
<ul>
<li><p>광범위한 언어 간 통합을 위한<strong>HTTP/REST</strong> </p></li>
<li><p>지연 시간이 짧은 양방향 통신을 위한<strong>WebSocket</strong> </p></li>
<li><p>대규모 클러스터에 적합한 고성능 RPC를 위한<strong>gRPC</strong> </p></li>
<li><p>분산형 피어투피어 네트워킹을 위한<strong>libp2p</strong> </p></li>
<li><p>에이전트 간 통신을 위해 특별히 설계된 새로운 프로토콜인<strong>A2A</strong></p></li>
</ul>
<p>모든 전송은 통합 이벤트 기반 메시지 형식을 통해 작동하므로 프로토콜 간에 원활하게 변환할 수 있습니다. 프레임워크가 자동으로 처리하므로 피어 에이전트가 어떤 프로토콜을 사용하는지 걱정할 필요가 없습니다. 어떤 언어나 프레임워크로 구축된 에이전트도 기존 코드를 다시 작성하지 않고도 OpenAgents 네트워크에 참여할 수 있습니다.</p>
<h2 id="Integrating-OpenAgents-with-Milvus-for-Long-Term-Agentic-Memory" class="common-anchor-header">장기적인 에이전트 메모리를 위한 OpenAgents와 Milvus의 통합<button data-href="#Integrating-OpenAgents-with-Milvus-for-Long-Term-Agentic-Memory" class="anchor-icon" translate="no">
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
    </button></h2><p>OpenAgents는 에이전트가 <strong>서로 소통하고, 서로를 발견하고, 협업하는</strong>방식에 대한 문제를 <strong>해결하지만</strong>협업만으로는 충분하지 않습니다. 에이전트는 인사이트, 의사 결정, 대화 기록, 툴 결과 및 도메인별 지식을 생성합니다. 영구적인 메모리 계층이 없으면 에이전트가 종료되는 순간 이 모든 것이 사라집니다.</p>
<p>바로 이 지점에서 <strong>Milvus가</strong> 필수적입니다. Milvus는 에이전트 상호 작용을 내구성 있고 재사용 가능한 메모리로 전환하는 데 필요한 고성능 벡터 스토리지 및 시맨틱 검색 기능을 제공합니다. OpenAgents 네트워크에 통합되면 다음과 같은 세 가지 주요 이점을 제공합니다:</p>
<h4 id="1-Semantic-Search" class="common-anchor-header"><strong>1. 시맨틱 검색</strong></h4><p>Milvus는 HNSW 및 IVF_FLAT과 같은 인덱싱 알고리즘을 사용하여 빠른 시맨틱 검색을 제공합니다. 에이전트는 키워드가 아닌 의미를 기반으로 가장 관련성이 높은 과거 기록을 검색할 수 있으므로 다음을 수행할 수 있습니다:</p>
<ul>
<li><p>이전 의사 결정이나 계획을 기억하고</p></li>
<li><p>반복되는 작업을 피할 수 있습니다,</p></li>
<li><p>세션 전반에 걸쳐 장기적인 컨텍스트를 유지할 수 있습니다.</p></li>
</ul>
<p>이것이 바로 <em>에이전트 메모리의</em> 근간인 빠르고 관련성 높은 컨텍스트 검색입니다.</p>
<h4 id="2-Billion-Scale-Horizontal-Scalability" class="common-anchor-header"><strong>2. 수십억 규모의 수평적 확장성</strong></h4><p>실제 에이전트 네트워크는 방대한 양의 데이터를 생성합니다. Milvus는 이러한 규모에서도 원활하게 작동하도록 구축되어 수십억 개 이상의 데이터를</p>
<ul>
<li><p>수십억 개의 벡터를 저장하고 검색할 수 있습니다,</p></li>
<li><p>&lt; 처리량이 많은 Top-K 검색에서도 30ms 미만의 지연 시간,</p></li>
<li><p>수요 증가에 따라 선형적으로 확장되는 완전 분산형 아키텍처.</p></li>
</ul>
<p>수십 명의 에이전트가 동시에 작업하든 수천 명이 동시에 작업하든 Milvus는 검색을 빠르고 일관되게 유지합니다.</p>
<h4 id="3-Multi-Tenant-Isolation" class="common-anchor-header"><strong>3. 멀티 테넌트 격리</strong></h4><p>Milvus는 단일 컬렉션 내에서 메모리를 분할하는 경량 파티셔닝 메커니즘인 <strong>파티션 키를</strong> 통해 세분화된 멀티테넌트 격리를 제공합니다. 이를 통해</p>
<ul>
<li><p>서로 다른 팀, 프로젝트 또는 에이전트 커뮤니티가 독립적인 메모리 공간을 유지할 수 있습니다,</p></li>
<li><p>여러 컬렉션을 유지하는 것에 비해 오버헤드를 크게 줄일 수 있습니다,</p></li>
<li><p>공유 지식이 필요할 때 선택적으로 교차 파티션 검색이 가능합니다.</p></li>
</ul>
<p>이러한 분리는 검색 속도에 영향을 주지 않으면서 데이터 경계를 존중해야 하는 대규모 멀티에이전트 배포에 매우 중요합니다.</p>
<p>OpenAgents는 Milvus API를 직접 호출하는 <strong>사용자 지정 모드를</strong> 통해 Milvus에 연결합니다. 에이전트 메시지, 툴 출력 및 상호작용 로그는 자동으로 벡터에 임베드되어 Milvus에 저장됩니다. 개발자는 커스터마이징할 수 있습니다:</p>
<ul>
<li><p>임베딩 모델</p></li>
<li><p>저장 스키마 및 메타데이터</p></li>
<li><p>및 검색 전략(예: 하이브리드 검색, 분할 검색)을 사용자 정의할 수 있습니다.</p></li>
</ul>
<p>이를 통해 각 에이전트 커뮤니티는 확장 가능하고 지속적이며 의미론적 추론에 최적화된 메모리 계층을 갖게 됩니다.</p>
<h2 id="How-to-Build-a-Multi-Agent-Chatbot-with-OpenAgent-and-Milvus" class="common-anchor-header">OpenAgent와 Milvus로 멀티 에이전트 챗봇 구축하는 방법<button data-href="#How-to-Build-a-Multi-Agent-Chatbot-with-OpenAgent-and-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>구체적으로 설명하기 위해 데모를 통해 Python 전문가, 데이터베이스 전문가, DevOps 엔지니어 등 여러 전문 에이전트가 협업하여 기술적 질문에 답변하는 <strong>개발자 지원 커뮤니티를</strong> 구축해 보겠습니다. 업무가 과중한 한 명의 제너럴리스트 상담원에게 의존하는 대신 각 전문가가 도메인별 추론에 기여하면 시스템이 가장 적합한 상담원에게 자동으로 쿼리를 라우팅합니다.</p>
<p>이 예는 기술 Q&amp;A를 위한 장기 메모리를 제공하기 위해 <strong>Milvus를</strong> OpenAgents 배포에 통합하는 방법을 보여줍니다. 상담원 대화, 과거 솔루션, 문제 해결 로그 및 사용자 쿼리는 모두 벡터 임베딩으로 변환되어 Milvus에 저장되므로 네트워크에 다음과 같은 기능을 제공할 수 있습니다:</p>
<ul>
<li><p>이전 답변 기억</p></li>
<li><p>이전 기술 설명을 재사용하고</p></li>
<li><p>세션 전반에서 일관성 유지</p></li>
<li><p>더 많은 상호작용이 축적됨에 따라 시간이 지남에 따라 개선됩니다.</p></li>
</ul>
<h3 id="Prerequisite" class="common-anchor-header">전제 조건</h3><ul>
<li><p>python3.11+</p></li>
<li><p>conda</p></li>
<li><p>Openai-key</p></li>
</ul>
<h3 id="1-Define-Dependencies" class="common-anchor-header">1. 종속성 정의</h3><p>프로젝트에 필요한 Python 패키지를 정의합니다:</p>
<pre><code translate="no"><span class="hljs-comment"># Core framework</span>
openagents&gt;=<span class="hljs-number">0.6</span><span class="hljs-number">.11</span>
<span class="hljs-comment"># Vector database</span>
pymilvus&gt;=<span class="hljs-number">2.5</span><span class="hljs-number">.1</span>
<span class="hljs-comment"># Embedding model</span>
sentence-transformers&gt;=<span class="hljs-number">2.2</span><span class="hljs-number">.0</span>
<span class="hljs-comment"># LLM integration</span>
openai&gt;=<span class="hljs-number">1.0</span><span class="hljs-number">.0</span>
<span class="hljs-comment"># Environment config</span>
python-dotenv&gt;=<span class="hljs-number">1.0</span><span class="hljs-number">.0</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="2-Environment-Variables" class="common-anchor-header">2. 환경 변수</h3><p>환경 구성을 위한 템플릿입니다:</p>
<pre><code translate="no"><span class="hljs-comment"># LLM configuration (required)</span>
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_BASE_URL=https://api.openai.com/v1
OPENAI_MODEL=gpt-4o
<span class="hljs-comment"># Milvus configuration</span>
MILVUS_URI=./multi_agent_memory.db
<span class="hljs-comment"># Embedding model configuration</span>
EMBEDDING_MODEL=text-embedding-3-large
EMBEDDING_DIMENSION=3072
<span class="hljs-comment"># Network configuration</span>
NETWORK_HOST=localhost
NETWORK_PORT=8700
STUDIO_PORT=8050
<button class="copy-code-btn"></button></code></pre>
<h3 id="3-Configure-Your-OpenAgents-Network" class="common-anchor-header">3. OpenAgents 네트워크 구성</h3><p>상담원 네트워크의 구조와 통신 설정을 정의하세요:</p>
<pre><code translate="no"><span class="hljs-comment"># Network transport protocol (HTTP on port 8700)</span>
<span class="hljs-comment"># Multi-channel messaging system (general, coordination, expert channels)</span>
<span class="hljs-comment"># Agent role definitions (coordinator, python_expert, etc.)</span>
<span class="hljs-comment"># Milvus integration settings</span>
network:
  name: <span class="hljs-string">&quot;Multi-Agent Collaboration Demo&quot;</span>
  transports:
    - <span class="hljs-built_in">type</span>: <span class="hljs-string">&quot;http&quot;</span>
      config:
        port: <span class="hljs-number">8700</span>
        host: <span class="hljs-string">&quot;localhost&quot;</span>
  mods:
    - name: <span class="hljs-string">&quot;openagents.mods.workspace.messaging&quot;</span>
      config:
        channels:
          - name: <span class="hljs-string">&quot;general&quot;</span>          <span class="hljs-comment"># User question channel</span>
          - name: <span class="hljs-string">&quot;coordination&quot;</span>     <span class="hljs-comment"># Coordinator channel</span>
          - name: <span class="hljs-string">&quot;python_channel&quot;</span>   <span class="hljs-comment"># Python expert channel</span>
          - name: <span class="hljs-string">&quot;milvus_channel&quot;</span>   <span class="hljs-comment"># Milvus expert channel</span>
          - name: <span class="hljs-string">&quot;devops_channel&quot;</span>   <span class="hljs-comment"># DevOps expert channel</span>
  agents:
    coordinator:
      <span class="hljs-built_in">type</span>: <span class="hljs-string">&quot;coordinator&quot;</span>
      description: <span class="hljs-string">&quot;Coordinator Agent, responsible for analyzing queries and dispatching tasks to expert agents&quot;</span>
      channels: [<span class="hljs-string">&quot;general&quot;</span>, <span class="hljs-string">&quot;coordination&quot;</span>]
    python_expert:
      <span class="hljs-built_in">type</span>: <span class="hljs-string">&quot;expert&quot;</span>
      domain: <span class="hljs-string">&quot;python&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="4-Implement-Multi-Agent-Collaboration" class="common-anchor-header">4. 멀티 에이전트 협업 구현하기</h3><p>다음은 전체 구현이 아닌 핵심 코드 스니펫을 보여줍니다.</p>
<pre><code translate="no"><span class="hljs-comment"># SharedMemory: Milvus’s SharedMemory system</span>
<span class="hljs-comment"># CoordinatorAgent: Coordinator Agent, responsible for analyzing queries and dispatching tasks to expert agents</span>
<span class="hljs-comment"># PythonExpertAgent: Python Expert</span>
<span class="hljs-comment"># MilvusExpertAgent: Milvus Expert</span>
<span class="hljs-comment"># DevOpsExpertAgent: DevOps Expert</span>
<span class="hljs-keyword">import</span> os
<span class="hljs-keyword">import</span> asyncio
<span class="hljs-keyword">import</span> json
<span class="hljs-keyword">from</span> typing <span class="hljs-keyword">import</span> <span class="hljs-type">List</span>, <span class="hljs-type">Dict</span>
<span class="hljs-keyword">from</span> dotenv <span class="hljs-keyword">import</span> load_dotenv
<span class="hljs-keyword">from</span> openagents.agents.worker_agent <span class="hljs-keyword">import</span> WorkerAgent
<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> connections, Collection, FieldSchema, CollectionSchema, DataType
<span class="hljs-keyword">import</span> openai
load_dotenv()
<span class="hljs-keyword">class</span> <span class="hljs-title class_">SharedMemory</span>:
    <span class="hljs-string">&quot;&quot;&quot;SharedMemory in Milvus for all Agents&quot;&quot;&quot;</span>
    <span class="hljs-keyword">def</span> <span class="hljs-title function_">__init__</span>(<span class="hljs-params">self</span>):
        connections.connect(uri=<span class="hljs-string">&quot;./multi_agent_memory.db&quot;</span>)
        <span class="hljs-variable language_">self</span>.setup_collections()
        <span class="hljs-variable language_">self</span>.openai_client = openai.OpenAI(
            api_key=os.getenv(<span class="hljs-string">&quot;OPENAI_API_KEY&quot;</span>),
            base_url=os.getenv(<span class="hljs-string">&quot;OPENAI_BASE_URL&quot;</span>)
        )
    <span class="hljs-keyword">def</span> <span class="hljs-title function_">setup_collections</span>(<span class="hljs-params">self</span>):
        <span class="hljs-string">&quot;&quot;&quot;Create memory collections: expert knowledge, collaboration history, problem solutions&quot;&quot;&quot;</span>
        collections = {
            <span class="hljs-string">&quot;expert_knowledge&quot;</span>: <span class="hljs-string">&quot;expert knowledge&quot;</span>,
            <span class="hljs-string">&quot;collaboration_history&quot;</span>: <span class="hljs-string">&quot;collaboration history&quot;</span>, 
            <span class="hljs-string">&quot;problem_solutions&quot;</span>: <span class="hljs-string">&quot;problem solutions&quot;</span>
        }
        <span class="hljs-comment"># Code to create vector collections...</span>
    <span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">search_knowledge</span>(<span class="hljs-params">self, query: <span class="hljs-built_in">str</span>, collection_name: <span class="hljs-built_in">str</span></span>):
        <span class="hljs-string">&quot;&quot;&quot;Search for relevant knowledge&quot;&quot;&quot;</span>
        <span class="hljs-comment"># Vector search implementation...</span>
    <span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">store_knowledge</span>(<span class="hljs-params">self, agent_id: <span class="hljs-built_in">str</span>, content: <span class="hljs-built_in">str</span>, metadata: <span class="hljs-built_in">dict</span>, collection_name: <span class="hljs-built_in">str</span></span>):
        <span class="hljs-string">&quot;&quot;&quot;Store knowledge&quot;&quot;&quot;</span>
        <span class="hljs-comment"># Store into the vector database...</span>
<span class="hljs-keyword">class</span> <span class="hljs-title class_">CoordinatorAgent</span>(<span class="hljs-title class_ inherited__">WorkerAgent</span>):
    <span class="hljs-string">&quot;&quot;&quot;Coordinator Agent - analyzes questions and coordinates other Agent&quot;&quot;&quot;</span>
    <span class="hljs-keyword">def</span> <span class="hljs-title function_">__init__</span>(<span class="hljs-params">self</span>):
        <span class="hljs-built_in">super</span>().__init__(agent_id=<span class="hljs-string">&quot;coordinator&quot;</span>)
        <span class="hljs-variable language_">self</span>.expert_agents = {
            <span class="hljs-string">&quot;python&quot;</span>: <span class="hljs-string">&quot;python_expert&quot;</span>,
            <span class="hljs-string">&quot;milvus&quot;</span>: <span class="hljs-string">&quot;milvus_expert&quot;</span>, 
            <span class="hljs-string">&quot;devops&quot;</span>: <span class="hljs-string">&quot;devops_expert&quot;</span>
        }
    <span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">analyze_question</span>(<span class="hljs-params">self, question: <span class="hljs-built_in">str</span></span>) -&gt; <span class="hljs-type">List</span>[<span class="hljs-built_in">str</span>]:
        <span class="hljs-string">&quot;&quot;&quot;Determine which experts are needed for the question&quot;&quot;&quot;</span>
        keywords = {
            <span class="hljs-string">&quot;python&quot;</span>: [<span class="hljs-string">&quot;python&quot;</span>, <span class="hljs-string">&quot;django&quot;</span>, <span class="hljs-string">&quot;flask&quot;</span>, <span class="hljs-string">&quot;async&quot;</span>],
            <span class="hljs-string">&quot;milvus&quot;</span>: [<span class="hljs-string">&quot;milvus&quot;</span>, <span class="hljs-string">&quot;vector&quot;</span>, <span class="hljs-string">&quot;index&quot;</span>, <span class="hljs-string">&quot;performance&quot;</span>],
            <span class="hljs-string">&quot;devops&quot;</span>: [<span class="hljs-string">&quot;deployment&quot;</span>, <span class="hljs-string">&quot;docker&quot;</span>, <span class="hljs-string">&quot;kubernetes&quot;</span>, <span class="hljs-string">&quot;operations&quot;</span>]
        }
        <span class="hljs-comment"># Keyword matching logic...</span>
        <span class="hljs-keyword">return</span> needed_experts
    <span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">coordinate_experts</span>(<span class="hljs-params">self, question: <span class="hljs-built_in">str</span>, needed_experts: <span class="hljs-type">List</span>[<span class="hljs-built_in">str</span>]</span>):
        <span class="hljs-string">&quot;&quot;&quot;Coordinate collaboration among expert Agent&quot;&quot;&quot;</span>
        <span class="hljs-comment"># 1. Notify experts to begin collaborating</span>
        <span class="hljs-comment"># 2. Dispatch tasks to each expert</span>
        <span class="hljs-comment"># 3. Collect expert responses</span>
        <span class="hljs-comment"># 4. Return expert opinions</span>
    <span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">on_channel_post</span>(<span class="hljs-params">self, context</span>):
        <span class="hljs-string">&quot;&quot;&quot;Main logic for handling user questions&quot;&quot;&quot;</span>
        content = context.incoming_event.payload.get(<span class="hljs-string">&#x27;content&#x27;</span>, {}).get(<span class="hljs-string">&#x27;text&#x27;</span>, <span class="hljs-string">&#x27;&#x27;</span>)
        <span class="hljs-keyword">if</span> content <span class="hljs-keyword">and</span> <span class="hljs-keyword">not</span> content.startswith(<span class="hljs-string">&#x27;🎯&#x27;</span>):
            <span class="hljs-comment"># 1. Analyze question → 2. Coordinate experts → 3. Merge answers → 4. Reply to user</span>
<span class="hljs-keyword">class</span> <span class="hljs-title class_">PythonExpertAgent</span>(<span class="hljs-title class_ inherited__">WorkerAgent</span>):
    <span class="hljs-string">&quot;&quot;&quot;Python Expert Agent&quot;&quot;&quot;</span>
    <span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">analyze_python_question</span>(<span class="hljs-params">self, question: <span class="hljs-built_in">str</span></span>) -&gt; <span class="hljs-built_in">str</span>:
        <span class="hljs-string">&quot;&quot;&quot;Analyze Python-related questions and provide expert advice&quot;&quot;&quot;</span>
        <span class="hljs-comment"># 1. Search for relevant experience</span>
        <span class="hljs-comment"># 2. Use LLM to generate expert response</span>
        <span class="hljs-comment"># 3. Store result in collaboration history</span>
        <span class="hljs-keyword">return</span> answer
<span class="hljs-comment"># Start all Agens</span>
<span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">run_multi_agent_demo</span>():
    coordinator = CoordinatorAgent()
    python_expert = PythonExpertAgent()
    milvus_expert = MilvusExpertAgent()
    devops_expert = DevOpsExpertAgent()
    <span class="hljs-comment"># Connect to the OpenAgents network</span>
    <span class="hljs-keyword">await</span> coordinator.async_start(network_host=<span class="hljs-string">&quot;localhost&quot;</span>, network_port=<span class="hljs-number">8700</span>)
    <span class="hljs-comment"># ... Start other Agent</span>
    <span class="hljs-keyword">while</span> <span class="hljs-literal">True</span>:
        <span class="hljs-keyword">await</span> asyncio.sleep(<span class="hljs-number">1</span>)
<span class="hljs-keyword">if</span> __name__ == <span class="hljs-string">&quot;__main__&quot;</span>:
    asyncio.run(run_multi_agent_demo())
<button class="copy-code-btn"></button></code></pre>
<h3 id="5-Create-and-Activate-a-Virtual-Environment" class="common-anchor-header">5. 가상 환경 만들기 및 활성화하기</h3><pre><code translate="no">conda create -n openagents
conda activate openagents
<button class="copy-code-btn"></button></code></pre>
<p><strong>종속성 설치</strong></p>
<pre><code translate="no">pip install -r requirements.txt
<button class="copy-code-btn"></button></code></pre>
<p><strong>API 키 구성</strong></p>
<pre><code translate="no"><span class="hljs-built_in">cp</span> .env.example .<span class="hljs-built_in">env</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>OpenAgents 네트워크 시작</strong></p>
<pre><code translate="no">openagents network start .
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/network_169812ab94.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>멀티에이전트 서비스 시작</strong></p>
<pre><code translate="no">python multi_agent_demo.py
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/multiagent_service_1661d4b91b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>OpenAgents 스튜디오 시작</strong></p>
<pre><code translate="no">openagents studio -s
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/start_studio_4cd126fea2.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>스튜디오 액세스</strong></p>
<pre><code translate="no"><span class="hljs-attr">http</span>:<span class="hljs-comment">//localhost:8050</span>
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/access_studio1_a33709914b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/access_studio3_293604c79e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/access_studio_3_8d98a4cfe8.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>상담원 및 네트워크 상태를 확인합니다:</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/check_state_bba1a4fe16.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
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
    </button></h2><p>OpenAgents는 상담원이 서로를 발견하고, 소통하고, 협업할 수 있는 조정 계층을 제공하며, Milvus는 지식을 저장, 공유 및 재사용하는 방법이라는 똑같이 중요한 문제를 해결합니다. Milvus는 고성능 벡터 메모리 계층을 제공함으로써 상담원이 지속적인 컨텍스트를 구축하고, 과거의 상호 작용을 기억하며, 시간이 지남에 따라 전문 지식을 축적할 수 있도록 지원합니다. 이를 통해 AI 시스템은 고립된 모델의 한계를 뛰어넘어 진정한 멀티 에이전트 네트워크의 심층적인 협업 잠재력을 실현할 수 있습니다.</p>
<p>물론 멀티 에이전트 아키텍처에 장단점이 없는 것은 아닙니다. 에이전트를 병렬로 실행하면 토큰 소비가 증가하고, 에이전트 간에 오류가 연쇄적으로 발생할 수 있으며, 동시 의사 결정으로 인해 때때로 충돌이 발생할 수 있습니다. 이러한 문제는 현재 활발히 연구 중이며 지속적으로 개선되고 있지만, 조정, 기억, 진화할 수 있는 시스템 구축의 가치를 떨어뜨리지는 않습니다.</p>
<p>상담원에게 장기 기억력을 제공할 준비가 되셨나요?</p>
<p><a href="https://milvus.io/">Milvus를</a> 살펴보고 자체 워크플로와 통합해 보세요.</p>
<p>궁금한 점이 있거나 기능에 대해 자세히 알아보고 싶으신가요?<a href="https://discord.com/invite/8uyFbECzPX"> Discord 채널에</a> 참여하거나<a href="https://github.com/milvus-io/milvus"> GitHub에</a> 이슈를 제출하세요. 또한<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus 오피스 아워를</a> 통해 20분간의 일대일 세션을 예약하여 인사이트, 안내 및 질문에 대한 답변을 얻을 수도 있습니다.</p>
