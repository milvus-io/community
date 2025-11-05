---
id: drag-drop-and-deploy-how-to-build-rag-workflows-with-langflow-and-milvus.md
title: '드래그, 드롭, 배포: Langflow 및 Milvus로 RAG 워크플로우를 구축하는 방법'
author: Min Yin
date: 2025-10-30T00:00:00.000Z
cover: assets.zilliz.com/langflow_milvus_cover_9f75a11f90.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Langflow, Milvus, RAG, AI workflow'
meta_title: 'Drag, Drop, and Deploy RAG Workflows with Langflow & Milvus'
desc: >-
  Langflow와 Milvus를 사용하여 시각적인 RAG 워크플로를 구축하는 방법을 알아보세요. 코딩할 필요 없이 몇 분 만에 컨텍스트 인식
  AI 앱을 드래그 앤 드롭하여 배포하세요.
origin: >-
  https://milvus.io/blog/drag-drop-and-deploy-how-to-build-rag-workflows-with-langflow-and-milvus.md
---
<p>AI 워크플로우 구축은 생각보다 어렵게 느껴질 때가 많습니다. 글루 코드 작성, API 호출 디버깅, 데이터 파이프라인 관리 등으로 인해 결과를 보기도 전에 프로세스에 많은 시간이 소요될 수 있습니다. <a href="https://www.langflow.org/"><strong>Langflow와</strong></a> <a href="https://milvus.io/"><strong>Milvus는</strong></a> 이 과정을 획기적으로 간소화하여 며칠이 아닌 몇 분 만에 검색 증강 생성(RAG) 워크플로를 설계, 테스트 및 배포할 수 있는 코드 경량 방식을 제공합니다.</p>
<p><strong>Langflow는</strong> 코딩보다는 화이트보드에 아이디어를 스케치하는 것과 같은 깔끔한 드래그 앤 드롭 방식의 인터페이스를 제공합니다. 언어 모델, 데이터 소스 및 외부 도구를 시각적으로 연결하여 상용구 코드를 한 줄도 건드리지 않고도 워크플로 로직을 정의할 수 있습니다.</p>
<p>LLM에 장기 메모리와 컨텍스트 이해를 제공하는 오픈 소스 벡터 데이터베이스인 <strong>Milvus와</strong> 함께 사용하면 프로덕션급 RAG를 위한 완벽한 환경을 구축할 수 있습니다. Milvus는 기업 또는 도메인별 데이터에서 임베딩을 효율적으로 저장하고 검색하여 LLM이 근거가 있고 정확하며 컨텍스트를 인식하는 답변을 생성할 수 있도록 지원합니다.</p>
<p>이 가이드에서는 몇 번의 드래그, 드롭, 클릭만으로 Langflow와 Milvus를 결합하여 고급 RAG 워크플로우를 구축하는 방법을 안내합니다.</p>
<h2 id="What-is-Langflow" class="common-anchor-header">Langflow란 무엇인가요?<button data-href="#What-is-Langflow" class="anchor-icon" translate="no">
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
    </button></h2><p>RAG 데모를 살펴보기 전에 Langflow가 무엇이고 무엇을 할 수 있는지 알아봅시다.</p>
<p>Langflow는 AI 애플리케이션을 더 쉽게 구축하고 실험할 수 있는 오픈 소스 Python 기반 프레임워크입니다. 에이전트 및 모델 컨텍스트 프로토콜(MCP)과 같은 주요 AI 기능을 지원하여 개발자와 비개발자 모두에게 지능형 시스템을 만들 수 있는 유연한 기반을 제공합니다.</p>
<p>Langflow의 핵심은 시각적 편집기입니다. 다양한 리소스를 끌어다 놓고 연결하여 모델, 도구, 데이터 소스를 결합한 완전한 애플리케이션을 디자인할 수 있습니다. 워크플로를 내보내면 Langflow는 로컬 컴퓨터에 <code translate="no">FLOW_NAME.json</code> 이라는 파일을 자동으로 생성합니다. 이 파일에는 흐름을 설명하는 모든 노드, 에지 및 메타데이터가 기록되어 팀 간에 프로젝트를 쉽게 버전 관리, 공유 및 재생산할 수 있습니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Langflow_s_visual_editor_cd553ad4ad.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>백그라운드에서는 Python 기반 런타임 엔진이 플로우를 실행합니다. 이 엔진은 LLM, 도구, 검색 모듈, 라우팅 로직을 오케스트레이션하여 데이터 흐름, 상태, 오류 처리를 관리함으로써 처음부터 끝까지 원활한 실행을 보장합니다.</p>
<p>또한 Langflow에는 <a href="https://milvus.io/">Milvus를</a> 비롯한 인기 있는 LLM과 벡터 데이터베이스를 위한 사전 빌드된 어댑터가 포함된 풍부한 구성 요소 라이브러리가 포함되어 있습니다. 특수한 사용 사례를 위한 사용자 지정 Python 컴포넌트를 생성하여 이를 더욱 확장할 수 있습니다. 테스트 및 최적화를 위해 Langflow는 단계별 실행, 신속한 테스트를 위한 플레이그라운드, 워크플로우를 엔드투엔드 모니터링, 디버깅 및 재생하기 위한 LangSmith 및 Langfuse와의 통합을 제공합니다.</p>
<h2 id="Hands-on-Demo-How-to-Build-a-RAG-Workflow-with-Langflow-and-Milvus" class="common-anchor-header">실습 데모: Langflow와 Milvus로 RAG 워크플로우를 구축하는 방법<button data-href="#Hands-on-Demo-How-to-Build-a-RAG-Workflow-with-Langflow-and-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Langflow의 아키텍처를 기반으로 구축된 Milvus는 임베딩을 관리하고 비공개 엔터프라이즈 데이터 또는 도메인별 지식을 검색하는 벡터 데이터베이스 역할을 할 수 있습니다.</p>
<p>이 데모에서는 Langflow의 벡터 스토어 RAG 템플릿을 사용하여 Milvus를 통합하고 로컬 데이터에서 벡터 인덱스를 구축하여 컨텍스트에 따라 효율적으로 향상된 질문에 답변할 수 있는 방법을 시연합니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/data_processing_flow_289a9376c9.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Prerequisites" class="common-anchor-header">사전 요구 사항</h3><p>1.Python 3.11(또는 Conda)</p>
<p>2.uv</p>
<p>3.도커 및 도커 컴포즈</p>
<p>4.OpenAI 키</p>
<h3 id="Step-1-Deploy-Milvus-Vector-Database" class="common-anchor-header">1단계 Milvus 벡터 데이터베이스 배포</h3><p>배포 파일을 다운로드합니다.</p>
<pre><code translate="no">wget &lt;https://github.com/Milvus-io/Milvus/releases/download/v2.5.12/Milvus-standalone-docker-compose.yml&gt; -O docker-compose.yml
<button class="copy-code-btn"></button></code></pre>
<p>Milvus 서비스를 시작합니다.</p>
<pre><code translate="no">docker-compose up -d
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">docker-compose ps -a
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/start_milvus_service_860353ed55.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-2-Create-a-Python-Virtual-Environment" class="common-anchor-header">2단계. Python 가상 환경 생성</h3><pre><code translate="no">conda create -n langflow
<span class="hljs-comment"># activate langflow and launch it</span>
conda activate langflow
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-3-Install-the-Latest-Packages" class="common-anchor-header">3단계. 최신 패키지 설치</h3><pre><code translate="no">pip install langflow -U
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-4-Launch-Langflow" class="common-anchor-header">4단계. Langflow 시작하기</h3><pre><code translate="no">uv run langflow run
<button class="copy-code-btn"></button></code></pre>
<p>Langflow를 시작합니다.</p>
<pre><code translate="no">&lt;<span class="hljs-attr">http</span>:<span class="hljs-comment">//127.0.0.1:7860&gt;</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-5-Configure-the-RAG-Template" class="common-anchor-header">5단계. RAG 템플릿 구성</h3><p>Langflow에서 벡터 스토어 RAG 템플릿을 선택합니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/rag1_fcb0d1c3c5.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/rag2_f750e10a41.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>기본 벡터 데이터베이스로 Milvus를 선택합니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/vdb_milvus_925c6ce846.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>왼쪽 패널에서 "Milvus"를 검색하여 플로우에 추가합니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/add_milvus1_862d14d0d0.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/add_milvus2_4e3d6aacda.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Milvus 연결 세부 정보를 구성합니다. 지금은 다른 옵션을 기본값으로 놔둡니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/connect1_a27d3e4f43.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/connect2_d8421c1525.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>관련 노드에 OpenAI API 키를 추가합니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/openai_key_7a6596868c.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/openai_key2_4753bfb4d0.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-6-Prepare-Test-Data" class="common-anchor-header">6단계. 테스트 데이터 준비</h3><p>참고: Milvus 2.6의 공식 FAQ를 테스트 데이터로 사용합니다.</p>
<pre><code translate="no">https://github.com/milvus-io/milvus-docs/blob/v2.6.x/site/en/faq/product_faq.md
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-7-Phase-One-Testing" class="common-anchor-header">7단계. 1단계 테스트</h3><p>데이터 세트를 업로드하고 Milvus에 수집합니다. 참고: 그러면 Langflow가 텍스트를 벡터 표현으로 변환합니다. 최소 두 개의 데이터 세트를 업로드해야 하며, 그렇지 않으면 임베딩 프로세스가 실패합니다. 이는 Langflow의 현재 노드 구현에서 알려진 버그입니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ingest_7b804d870a.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ingest2_fc7f1e4d9a.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>노드 상태를 확인하세요.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/test_48e02d48ca.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-8-Phase-Two-Testing" class="common-anchor-header">8단계. 2단계 테스트</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ingest_7b804d870a.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-9-Run-the-Full-RAG-Workflow" class="common-anchor-header">9단계. 전체 RAG 워크플로 실행</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/full_flow1_5b4f4962f5.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/full_flow2_535c722a3d.webp" alt="" class="doc-image" id="" />
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
    </button></h2><p>AI 워크플로우 구축이 복잡할 필요는 없습니다. Langflow + Milvus를 사용하면 빠르고 시각적이며 코드가 가벼워져 엔지니어링에 많은 노력을 들이지 않고도 RAG를 간단하게 개선할 수 있습니다.</p>
<p>Langflow의 드래그 앤 드롭 인터페이스는 AI 시스템의 작동 방식을 명확하고 대화형 방식으로 시연해야 하는 교육, 워크샵 또는 라이브 데모에 적합한 선택입니다. 직관적인 워크플로 디자인과 엔터프라이즈급 벡터 검색을 통합하려는 팀의 경우, Langflow의 단순함과 Milvus의 고성능 검색을 결합하면 유연성과 강력한 성능을 모두 얻을 수 있습니다.</p>
<p>지금 바로 <a href="https://milvus.io/">Milvus로</a> 더 스마트한 RAG 워크플로를 구축하세요.</p>
<p>궁금한 점이 있거나 기능에 대해 자세히 알아보고 싶으신가요?<a href="https://discord.com/invite/8uyFbECzPX"> Discord 채널에</a> 참여하거나<a href="https://github.com/milvus-io/milvus"> GitHub에</a> 이슈를 제출하세요. 또한<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus 오피스 아워를</a> 통해 20분간의 일대일 세션을 예약하여 인사이트, 안내 및 질문에 대한 답변을 얻을 수도 있습니다.</p>
