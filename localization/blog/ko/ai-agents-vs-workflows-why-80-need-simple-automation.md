---
id: ai-agents-vs-workflows-why-80-need-simple-automation.md
title: AI 에이전트 또는 워크플로우? 자동화 작업의 80%에서 에이전트를 건너뛰어야 하는 이유
author: Min Yin
date: 2025-08-11T00:00:00.000Z
desc: >-
  Refly와 Milvus의 통합은 자동화에 대한 실용적인 접근 방식, 즉 불필요한 복잡성보다 신뢰성과 사용 편의성을 중시하는 실용적인 접근
  방식을 제공합니다.
cover: >-
  assets.zilliz.com/AI_Agents_or_Workflows_Why_You_Should_Skip_Agents_for_80_of_Automation_Tasks_9f54386e8a.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search'
meta_keywords: 'Milvus, AI Agent, workflow, Refly, vector database'
meta_title: |
  AI Agents or Workflows? Why Skip Agents for 80% of Automation
origin: 'https://milvus.io/blog/ai-agents-vs-workflows-why-80-need-simple-automation.md'
---
<p>코딩 코파일럿부터 고객 서비스 봇에 이르기까지 AI 에이전트는 현재 어디에나 존재하며, 복잡한 추론에 놀라울 정도로 능숙할 수 있습니다. 많은 분들처럼 저도 인공지능 에이전트를 좋아합니다. 하지만 상담원과 자동화 워크플로를 모두 구축한 후 저는 상담원이 <strong>모든 문제에 대한 최선의 해결책은</strong> 아니라는 단순한 진리를 깨달았습니다.</p>
<p>예를 들어, 머신러닝 디코딩을 위해 CrewAI로 멀티 에이전트 시스템을 구축했을 때 일이 순식간에 엉망이 되었습니다. 리서치 에이전트는 70%의 경우 웹 크롤러를 무시했습니다. 요약 에이전트는 인용을 누락했습니다. 작업이 명확하지 않을 때마다 조율이 무너졌습니다.</p>
<p>비단 실험에서만 일어나는 일이 아닙니다. 이미 많은 사람들이 브레인스토밍을 위해 ChatGPT, 코딩을 위해 Claude, 데이터 처리를 위해 6개의 API 사이를 오가며 <em>이 모든 작업을 함께 처리할 수 있는 더 나은 방법이 없을까</em> 조용히 고민하고 있습니다.</p>
<p>때때로 그 해답은 에이전트입니다. 대부분의 경우, 기존 도구를 예측할 수 없는 복잡성 없이 강력한 도구로 연결해주는 <strong>잘 설계된 AI 워크플로우가</strong> 그 해답이 될 수 있습니다.</p>
<h2 id="Building-Smarter-AI-Workflows-with-Refly-and-Milvus" class="common-anchor-header">Refly와 Milvus로 더 스마트한 AI 워크플로우 구축하기<button data-href="#Building-Smarter-AI-Workflows-with-Refly-and-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>이미 고개를 절레절레 흔들고 계신 분들도 계실 겁니다: "워크플로우? 그건 너무 딱딱해요. 실제 AI 자동화를 위해 충분히 스마트하지 않아요." 라고 말하시는 분들도 계실 겁니다. 정당한 지적입니다. 대부분의 워크플로는 한 치의 오차도 허용되지 않는 구식 조립 라인을 모델로 삼았기 때문에 경직되어 있습니다.</p>
<p>하지만 진짜 문제는 워크플로우에 대한 <em>아이디어가</em> 아니라 <em>실행입니다</em>. 단조롭고 선형적인 파이프라인에 안주할 필요가 없습니다. 상황에 맞게 조정하고 창의적으로 유연하게 대처하면서도 예측 가능한 결과를 제공하는 더 스마트한 워크플로를 설계할 수 있습니다.</p>
<p>이 가이드에서는 특히 속도, 안정성, 유지보수가 중요한 경우 AI 워크플로가 복잡한 멀티에이전트 아키텍처보다 뛰어난 성능을 발휘하는 이유를 보여주기 위해 Refly와 Milvus를 사용하여 완벽한 콘텐츠 제작 시스템을 구축하는 방법을 소개합니다.</p>
<h3 id="The-Tools-We’re-Using" class="common-anchor-header">사용 중인 도구</h3><p><a href="https://refly.ai/"><strong>Refly</strong></a>: '무료 캔버스' 개념을 기반으로 구축된 오픈 소스 AI 네이티브 콘텐츠 제작 플랫폼입니다.</p>
<ul>
<li><p><strong>핵심 기능:</strong> 지능형 캔버스, 지식 관리, 멀티 스레드 대화, 전문 제작 도구.</p></li>
<li><p><strong>유용한 이유:</strong> 드래그 앤 드롭 방식의 워크플로 구축을 통해 경직된 단일 경로 실행에 갇히지 않고 도구를 일관된 자동화 시퀀스로 연결할 수 있습니다.</p></li>
</ul>
<p><a href="https://milvus.io/"><strong>Milvus</strong></a>: 데이터 레이어를 처리하는 오픈 소스 벡터 데이터베이스입니다.</p>
<ul>
<li><p><strong>중요한 이유</strong> 콘텐츠 제작은 대부분 기존 정보를 찾아 재조합하는 작업입니다. 기존 데이터베이스는 정형화된 데이터를 잘 처리하지만 대부분의 창작 작업에는 문서, 이미지, 동영상과 같은 비정형 형식이 포함됩니다.</p></li>
<li><p><strong>추가 기능:</strong> Milvus는 통합 임베딩 모델을 활용하여 비정형 데이터를 벡터로 인코딩하고 시맨틱 검색을 지원하므로 워크플로우에서 밀리초의 지연 시간으로 관련 컨텍스트를 검색할 수 있습니다. MCP와 같은 프로토콜을 통해 AI 프레임워크와 원활하게 통합되므로 데이터베이스 구문과 씨름하지 않고도 자연어로 데이터를 쿼리할 수 있습니다.</p></li>
</ul>
<h3 id="Setting-Up-Your-Environment" class="common-anchor-header">환경 설정하기</h3><p>로컬에서 이 워크플로를 설정하는 방법을 안내해 드리겠습니다.</p>
<p><strong>빠른 설정 체크리스트:</strong></p>
<ul>
<li><p>Ubuntu 20.04+(또는 이와 유사한 Linux)</p></li>
<li><p>도커 + 도커 컴포즈</p></li>
<li><p>함수 호출을 지원하는 모든 LLM의 API 키. 이 가이드에서는 <a href="https://platform.moonshot.ai/docs/introduction#text-generation-model">Moonshot의</a>LLM을 사용하겠습니다.</p></li>
</ul>
<p><strong>시스템 요구 사항</strong></p>
<ul>
<li><p>CPU: 최소 8코어(16코어 권장)</p></li>
<li><p>메모리: 최소 16GB(32GB 권장)</p></li>
<li><p>스토리지: 최소 100GB SSD(500GB 권장)</p></li>
<li><p>네트워크: 안정적인 인터넷 연결 필요</p></li>
</ul>
<p><strong>소프트웨어 종속성</strong></p>
<ul>
<li><p>운영 체제: Linux(우분투 20.04 이상 권장)</p></li>
<li><p>컨테이너화: 도커 + 도커 컴포즈</p></li>
<li><p>Python: 버전 3.11 이상</p></li>
<li><p>언어 모델: 함수 호출을 지원하는 모든 모델(온라인 서비스 또는 Ollama 오프라인 배포 모두 작동)</p></li>
</ul>
<h3 id="Step-1-Deploy-the-Milvus-Vector-Database" class="common-anchor-header">1단계: Milvus 벡터 데이터베이스 배포하기</h3><p><strong>1.1 Milvus 다운로드</strong></p>
<pre><code translate="no">wget https://github.com/milvus-io/milvus/releases/download/v2.5.12/milvus-standalone-docker-compose.yml -O docker-compose.yml
<button class="copy-code-btn"></button></code></pre>
<p><strong>1.2 Milvus 서비스 시작</strong></p>
<pre><code translate="no">docker-compose up -d
docker-compose ps -a
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/1_b93ce78614.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-2-Deploy-the-Refly-Platform" class="common-anchor-header">2단계: Refly 플랫폼 배포</h3><p><strong>2.1 리포지토리 복제하기</strong></p>
<p>특별한 요구 사항이 없는 한 모든 환경 변수는 기본값을 사용할 수 있습니다:</p>
<pre><code translate="no">git <span class="hljs-built_in">clone</span> https://github.com/refly-ai/refly.git
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no"><span class="hljs-built_in">cd</span> deploy/docker
<span class="hljs-built_in">cp</span> ../../apps/api/.env.example .<span class="hljs-built_in">env</span> <span class="hljs-comment"># copy the example api env file</span>
docker compose up -d
<button class="copy-code-btn"></button></code></pre>
<p><strong>2.2 서비스 상태 확인</strong></p>
<pre><code translate="no">docker ps -a
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2_cfcde2c570.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-3-Set-Up-MCP-Services" class="common-anchor-header">3단계: MCP 서비스 설정</h3><p><strong>3.1 Milvus MCP 서버 다운로드</strong></p>
<pre><code translate="no">git <span class="hljs-built_in">clone</span> https://github.com/zilliztech/mcp-server-milvus.git
<span class="hljs-built_in">cd</span> mcp-server-milvus
<button class="copy-code-btn"></button></code></pre>
<p><strong>3.2 MCP 서비스 시작</strong></p>
<p>이 예제에서는 SSE 모드를 사용합니다. URI를 사용 가능한 Milvus 서비스 엔드포인트로 교체하세요:</p>
<pre><code translate="no">uv run src/mcp_server_milvus/server.py --sse --milvus-uri http://localhost:19530 --port 8000
<button class="copy-code-btn"></button></code></pre>
<p><strong>3.3 MCP 서비스가 실행 중인지 확인하기</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/3_b755922c41.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-4-Configuration-and-Setup" class="common-anchor-header">4단계: 구성 및 설정</h3><p>이제 인프라가 실행 중이므로 모든 것이 원활하게 작동하도록 구성해 보겠습니다.</p>
<p><strong>4.1 Refly 플랫폼에 액세스</strong></p>
<p>로컬 Refly 인스턴스로 이동합니다:</p>
<pre><code translate="no"><span class="hljs-attr">http</span>:<span class="hljs-comment">//192.168.7.148:5700</span>
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/4_c1e421fece.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>4.2 계정 만들기</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/42_4b8af22fe3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/422_e8cd8439f0.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>4.3 언어 모델 구성하기</strong></p>
<p>이 가이드에서는 <a href="https://platform.moonshot.ai/docs/introduction#text-generation-model">Moonshot을</a> 사용하겠습니다. 먼저 등록하고 API 키를 받습니다.</p>
<p><strong>4.4 모델 제공업체 추가하기</strong></p>
<p>이전 단계에서 얻은 API 키를 입력합니다:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/44_b085f9a263.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>4.5 LLM 모델 구성</strong></p>
<p>함수 호출 기능은 앞으로 구축할 워크플로 통합에 필수적이므로 함수 호출 기능을 지원하는 모델을 선택해야 합니다:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/45_a05213d0fa.pngQ" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>4.6 Milvus-MCP 서비스 통합하기</strong></p>
<p>웹 버전은 stdio 유형 연결을 지원하지 않으므로 앞서 설정한 HTTP 엔드포인트를 사용하겠습니다:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/46_027e21e479.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/462_959ee44a78.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>훌륭합니다! 모든 구성이 완료되었으니 이제 몇 가지 실제 예제를 통해 이 시스템이 실제로 작동하는지 살펴봅시다.</p>
<p><strong>4.7 예제: MCP-Milvus-Server를 사용한 효율적인 벡터 검색</strong></p>
<p>이 예는 <strong>MCP-Milvus-Server가</strong> AI 모델과 Milvus 벡터 데이터베이스 인스턴스 사이에서 미들웨어로 어떻게 작동하는지 보여줍니다. 이 서버는 AI 모델의 자연어 요청을 받아 올바른 데이터베이스 쿼리로 변환하고 결과를 반환하는 번역기처럼 작동하므로, 데이터베이스 구문을 몰라도 모델이 벡터 데이터로 작업할 수 있습니다.</p>
<p><strong>4.7.1 새 캔버스 만들기</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/471_a684e275ed.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>4.7.2 대화 시작하기</strong></p>
<p>대화 인터페이스를 열고, 모델을 선택하고, 질문을 입력한 다음 전송합니다.</p>
<p><strong>4.7.3 결과 검토하기</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/473_7c24a28999.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>방금 <a href="https://milvus.io/blog/talk-to-vector-db-manage-milvus-via-natural-language.md">MCP-Milvus-Server를</a> 통합 계층으로 사용하여 Milvus 벡터 데이터베이스를 자연어로 제어하는 모습을 보여드렸는데, 매우 놀랍습니다. 복잡한 쿼리 구문 없이 시스템에 필요한 사항을 일반 영어로 말하기만 하면 데이터베이스 작업이 자동으로 처리됩니다.</p>
<p><strong>4.8 예제 2: 워크플로우를 사용하여 Refly 배포 가이드 구축하기</strong></p>
<p>이 두 번째 예는 워크플로우 오케스트레이션의 진정한 힘을 보여줍니다. 여러 AI 도구와 데이터 소스를 하나의 일관된 프로세스로 결합하여 완벽한 배포 가이드를 만들어 보겠습니다.</p>
<p><strong>4.8.1 소스 자료 수집하기</strong></p>
<p>Refly의 강점은 다양한 입력 형식을 유연하게 처리할 수 있다는 점입니다. 문서, 이미지, 구조화된 데이터 등 다양한 형식의 리소스를 가져올 수 있습니다.</p>
<p><strong>4.8.2 작업 생성 및 리소스 카드 연결하기</strong></p>
<p>이제 작업을 정의하고 소스 자료에 연결하여 워크플로를 만들어 보겠습니다.</p>
<p><strong>4.8.3 세 가지 처리 작업 설정하기</strong></p>
<p>여기서 워크플로 접근 방식이 정말 빛을 발합니다. 하나의 복잡한 프로세스에서 모든 것을 처리하려고 하는 대신 업로드된 자료를 통합하고 체계적으로 다듬는 세 가지 집중 작업으로 작업을 나눕니다.</p>
<ul>
<li><p><strong>콘텐츠 통합 작업</strong>: 소스 자료를 결합하고 구조화합니다.</p></li>
<li><p><strong>콘텐츠 다듬기 작업</strong>: 명확성 및 흐름 개선</p></li>
<li><p><strong>최종 초안 편집</strong>: 출판 준비가 완료된 결과물 생성</p></li>
</ul>
<p>결과는 그 자체로 증명됩니다. 여러 도구에서 수동으로 조정하는 데 몇 시간이 걸리던 작업이 이제 각 단계가 이전 단계에 논리적으로 구축되어 자동으로 처리됩니다.</p>
<p><strong>멀티 모달 워크플로 기능:</strong></p>
<ul>
<li><p><strong>이미지 생성 및 처리</strong>: 플럭스-슈넬, 플럭스-프로, SDXL 등 고품질 모델과의 통합</p></li>
<li><p><strong>비디오 생성 및 이해</strong>: 시댄스, 클링, 베오 등 다양한 스타일화된 비디오 모델 지원</p></li>
<li><p><strong>오디오 생성 도구</strong>: Lyria-2와 같은 모델을 통한 음악 생성 및 Chatterbox와 같은 모델을 통한 음성 합성을 지원합니다.</p></li>
<li><p><strong>통합 처리</strong>: 모든 멀티모달 출력을 시스템 내에서 참조, 분석, 재처리할 수 있습니다.</p></li>
</ul>
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
    </button></h2><p><strong>Refly와</strong> <strong>Milvus의</strong> 통합은 자동화에 대한 실용적인 접근 방식, 즉 불필요한 복잡성보다 안정성과 사용 편의성을 중시하는 실용적인 접근 방식을 제공합니다. 워크플로 오케스트레이션과 멀티모달 프로세싱을 결합함으로써 팀은 모든 단계에서 완전한 제어권을 유지하면서 컨셉에서 퍼블리싱까지 더 빠르게 이동할 수 있습니다.</p>
<p>이는 AI 에이전트를 없애자는 것이 아닙니다. AI 에이전트는 진정으로 복잡하고 예측할 수 없는 문제를 해결하는 데 유용합니다. 하지만 콘텐츠 제작 및 데이터 처리와 같은 많은 자동화 요구 사항의 경우, 워크플로를 잘 설계하면 오버헤드를 줄이면서 더 나은 결과를 얻을 수 있습니다.</p>
<p>AI 기술이 발전함에 따라 가장 효과적인 시스템은 두 가지 전략을 혼합한 것이 될 것입니다:</p>
<ul>
<li><p>예측 가능성, 유지보수성, 재현성이 핵심인<strong>워크플로우</strong>.</p></li>
<li><p>실제 추론, 적응력, 개방형 문제 해결이 필요한<strong>에이전트</strong>.</p></li>
</ul>
<p>목표는 가장 화려한 AI를 구축하는 것이 아니라 가장 <em>유용한</em> AI를 구축하는 것입니다. 그리고 종종 가장 유용한 솔루션은 가장 간단한 솔루션이기도 합니다.</p>
