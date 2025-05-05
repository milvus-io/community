---
id: >-
  hands-on-tutorial-build-rag-power-document-assistant-in-10-minutes-with-dify-and-milvus.md
title: '실습 튜토리얼: Dify 및 Milvus를 사용하여 10분 만에 RAG 기반 문서 도우미 구축하기'
author: Ruben Winastwan
date: 2025-04-28T00:00:00.000Z
desc: >-
  이 빠른 실습형 개발자 튜토리얼에서 Dify 및 Milvus와 함께 검색 증강 생성(RAG)을 사용하여 AI 기반 문서 도우미를 만드는
  방법을 알아보세요.
cover: assets.zilliz.com/build_rag_with_dify_and_milvus_2ab76c6afd.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search, AI Agents, LLM'
meta_keywords: 'RAG, retrieval augmented generation, Dify, Milvus, no-code AI'
meta_title: |
  Build a RAG Document Assistant in 10 Minutes | Dify & Milvus Tutorial
origin: >-
  https://milvus.io/blog/hands-on-tutorial-build-rag-power-document-assistant-in-10-minutes-with-dify-and-milvus.md
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/build_rag_with_dify_and_milvus_2ab76c6afd.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>수천 페이지에 달하는 기술 사양, 내부 위키, 코드 문서 등 전체 문서 라이브러리를 특정 질문에 즉시 답변하는 지능형 AI 어시스턴트로 전환할 수 있다면 어떨까요?</p>
<p>더 나아가, 병합 충돌을 해결하는 데 걸리는 시간보다 더 짧은 시간 안에 구축할 수 있다면 어떨까요?</p>
<p>이것이 바로 <a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">검색 증강 생성</a> (RAG)을 올바른 방식으로 구현할 때 가능한 일입니다.</p>
<p>ChatGPT와 다른 LLM은 인상적이지만 회사의 특정 문서, 코드베이스 또는 지식창고에 대해 질문할 때 금방 한계에 부딪힙니다. RAG는 귀사의 독점 데이터를 대화에 통합하여 업무와 직접적으로 연관된 AI 기능을 제공함으로써 이러한 격차를 해소합니다.</p>
<p>문제는 무엇일까요? 기존의 RAG 구현은 다음과 같습니다:</p>
<ul>
<li><p>사용자 지정 임베딩 생성 파이프라인 작성</p></li>
<li><p>벡터 데이터베이스 구성 및 배포</p></li>
<li><p>복잡한 프롬프트 템플릿 엔지니어링</p></li>
<li><p>검색 로직 및 유사성 임계값 구축</p></li>
<li><p>사용 가능한 인터페이스 만들기</p></li>
</ul>
<p>하지만 바로 결과로 건너뛸 수 있다면 어떨까요?</p>
<p>이 튜토리얼에서는 두 가지 개발자 중심 도구를 사용해 간단한 RAG 애플리케이션을 구축해 보겠습니다:</p>
<ul>
<li><p><a href="https://github.com/langgenius/dify">Dify</a>: 최소한의 구성으로 RAG 오케스트레이션을 처리하는 오픈 소스 플랫폼</p></li>
<li><p><a href="https://milvus.io/docs/overview.md">Milvus</a>: 유사도 검색과 AI 검색을 위해 특별히 제작된 초고속 오픈 소스 벡터 데이터베이스입니다.</p></li>
</ul>
<p>이 10분짜리 가이드가 끝나면 머신 러닝 학위가 없어도 어떤 문서 컬렉션에 대한 자세한 질문에 답할 수 있는 AI 비서가 작동하게 됩니다.</p>
<h2 id="What-Youll-Build" class="common-anchor-header">구축 내용<button data-href="#What-Youll-Build" class="anchor-icon" translate="no">
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
    </button></h2><p>단 몇 분만 적극적으로 작업하면 다음을 만들 수 있습니다:</p>
<ul>
<li><p>모든 PDF를 쿼리 가능한 지식으로 변환하는 문서 처리 파이프라인</p></li>
<li><p>정확한 정보를 찾아내는 벡터 검색 시스템</p></li>
<li><p>기술적인 질문에 정확한 답변을 제공하는 챗봇 인터페이스</p></li>
<li><p>기존 도구와 통합할 수 있는 배포 가능한 솔루션</p></li>
</ul>
<p>가장 좋은 점은? 대부분의 기능이 사용자 지정 코드 대신 간단한 사용자 인터페이스(UI)를 통해 구성된다는 점입니다.</p>
<h2 id="What-Youll-Need" class="common-anchor-header">필요한 것<button data-href="#What-Youll-Need" class="anchor-icon" translate="no">
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
<li><p>기본 Docker 지식( <code translate="no">docker-compose up -d</code> 수준)</p></li>
<li><p>OpenAI API 키</p></li>
<li><p>실험할 PDF 문서(연구 논문을 사용하겠습니다)</p></li>
</ul>
<p>실제로 유용한 무언가를 빠른 시간 내에 구축할 준비가 되셨나요? 그럼 시작해 보겠습니다!</p>
<h2 id="Building-Your-RAG-Application-with-Milvus-and-Dify" class="common-anchor-header">Milvus와 Dify로 RAG 애플리케이션 구축하기<button data-href="#Building-Your-RAG-Application-with-Milvus-and-Dify" class="anchor-icon" translate="no">
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
    </button></h2><p>이 섹션에서는 연구 논문에 포함된 정보에 대해 질문할 수 있는 간단한 RAG 앱을 Dify로 만들어 보겠습니다. 연구 논문은 원하는 어떤 논문이든 사용할 수 있지만, 여기서는 트랜스포머 아키텍처를 소개한 유명한 논문인 &quot;<a href="https://arxiv.org/abs/1706.03762">주의력만 있으면</a> 됩니다.&quot;를 사용하겠습니다.</p>
<p>필요한 모든 컨텍스트를 저장하는 벡터 스토리지로 Milvus를 사용하겠습니다. 임베딩 모델과 LLM에는 OpenAI의 모델을 사용할 것입니다. 따라서 먼저 OpenAI API 키를 설정해야 합니다. 설정에 대한 자세한 내용은<a href="https://platform.openai.com/docs/quickstart"> 여기에서</a> 확인할 수 있습니다.</p>
<h3 id="Step-1-Starting-Dify-and-Milvus-Containers" class="common-anchor-header">1단계: Dify 및 Milvus 컨테이너 시작하기</h3><p>이 예제에서는 Docker Compose로 Dify를 자체 호스팅하겠습니다. 따라서 시작하기 전에 로컬 컴퓨터에 Docker가 설치되어 있는지 확인하세요. 아직 설치하지 않은 경우<a href="https://docs.docker.com/desktop/"> 설치 페이지를</a> 참조하여 Docker를 설치하세요.</p>
<p>Docker를 설치했으면 다음 명령어를 사용하여 Dify 소스 코드를 로컬 컴퓨터에 복제해야 합니다:</p>
<pre><code translate="no">git <span class="hljs-built_in">clone</span> &lt;&lt;<span class="hljs-string">https://github.com/langgenius/dify.git&gt;&gt;
</span><button class="copy-code-btn"></button></code></pre>
<p>그런 다음 방금 복제한 소스 코드의 <code translate="no">docker</code> 디렉토리로 이동합니다. 거기에서 다음 명령을 사용하여 <code translate="no">.env</code> 파일을 복사해야 합니다:</p>
<pre><code translate="no"><span class="hljs-built_in">cd</span> dify/docker
<span class="hljs-built_in">cp</span> .env.example .<span class="hljs-built_in">env</span>
<button class="copy-code-btn"></button></code></pre>
<p><code translate="no">.env</code> 파일에는 벡터 데이터베이스 선택, 벡터 데이터베이스에 액세스하는 데 필요한 자격 증명, Dify 앱의 주소 등 Dify 앱을 설정하고 실행하는 데 필요한 구성이 포함되어 있습니다.</p>
<p>밀버스를 벡터 데이터베이스로 사용할 예정이므로 <code translate="no">.env</code> 파일 내의 <code translate="no">VECTOR_STORE</code> 변수 값을 <code translate="no">milvus</code> 로 변경해야 합니다. 또한 <code translate="no">MILVUS_URI</code> 변수를 <code translate="no">http://host.docker.internal:19530</code> 으로 변경하여 나중에 배포 후 Docker 컨테이너 간의 통신 문제가 발생하지 않도록 해야 합니다.</p>
<pre><code translate="no"><span class="hljs-variable constant_">VECTOR_STORE</span>=milvus
<span class="hljs-variable constant_">MILVUS_URI</span>=<span class="hljs-attr">http</span>:<span class="hljs-comment">//host.docker.internal:19530</span>
<button class="copy-code-btn"></button></code></pre>
<p>이제 Docker 컨테이너를 시작할 준비가 되었습니다. 시작하려면 <code translate="no">docker compose up -d</code> 명령을 실행하기만 하면 됩니다. 명령이 완료되면 터미널에 아래와 같이 비슷한 출력이 표시됩니다:</p>
<pre><code translate="no">docker compose up -d
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/docker_compose_179216f113.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><code translate="no">docker compose ps</code> 명령으로 모든 컨테이너의 상태를 확인하고 정상적으로 실행 중인지 확인할 수 있습니다. 모두 정상이라면 아래와 같은 출력이 표시됩니다:</p>
<pre><code translate="no">docker compose ps
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/docker_compose_2_1a084ba137.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>마지막으로<a href="http://localhost/install"> </a>http://localhost/install 으로 이동하면 Dify 랜딩 페이지가 표시되며, 여기서 바로 가입하고 RAG 애플리케이션 구축을 시작할 수 있습니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/dify_login_d2bf4d4468.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>가입한 후에는 자격 증명을 사용하여 Dify에 로그인하기만 하면 됩니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/difi_login_2_5a8ea9c2d6.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-2-Setting-Up-OpenAI-API-Key" class="common-anchor-header">2단계: OpenAI API 키 설정하기</h3><p>Dify에 가입한 후 가장 먼저 해야 할 일은 임베딩 모델과 LLM을 호출하는 데 사용할 API 키를 설정하는 것입니다. OpenAI의 모델을 사용할 예정이므로 프로필에 OpenAI API 키를 삽입해야 합니다. 이렇게 하려면 아래 스크린샷에서 볼 수 있듯이 UI 오른쪽 상단의 프로필 위에 커서를 올려 '설정'으로 이동합니다:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/dify_settings_8ff08fab97.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>다음으로 "모델 제공자"로 이동하여 커서를 OpenAI 위에 놓은 다음 "설정"을 클릭합니다. 그러면 OpenAI API 키를 입력하라는 팝업 화면이 표시됩니다. 완료되면 OpenAI의 모델을 임베딩 모델과 LLM으로 사용할 준비가 된 것입니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/dify_model_providers_491b313b12.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-3-Inserting-Documents-into-Knowledge-Base" class="common-anchor-header">3단계: 지식창고에 문서 삽입하기</h3><p>이제 RAG 앱에 대한 지식창고를 저장해 보겠습니다. 지식 기반은 LLM이 보다 정확한 응답을 생성하는 데 도움이 되는 관련 컨텍스트로 사용할 수 있는 내부 문서 또는 텍스트 모음으로 구성됩니다.</p>
<p>저희의 사용 사례에서 지식창고는 본질적으로 "주의만 기울이면 됩니다" 문서입니다. 하지만 여러 가지 이유로 인해 이 문서를 그대로 저장할 수 없습니다. 첫째, 문서가 너무 길고, LLM에 지나치게 긴 컨텍스트를 제공하면 컨텍스트가 너무 광범위하여 도움이 되지 않습니다. 둘째, 입력이 원시 텍스트인 경우 유사성 검색을 수행하여 가장 관련성이 높은 컨텍스트를 가져올 수 없습니다.</p>
<p>따라서 문서를 지식창고에 저장하기 전에 최소 두 가지 단계를 거쳐야 합니다. 먼저 문서를 텍스트 청크로 나눈 다음 임베딩 모델을 통해 각 청크를 임베딩으로 변환해야 합니다. 마지막으로 이러한 임베딩을 Milvus에 벡터 데이터베이스로 저장하면 됩니다.</p>
<p>Dify를 사용하면 종이의 텍스트를 청크로 분할하여 임베딩으로 쉽게 변환할 수 있습니다. 논문의 PDF 파일을 업로드하고 청크 길이를 설정한 다음 슬라이더를 통해 임베딩 모델을 선택하기만 하면 됩니다. 이 모든 단계를 수행하려면 '지식'으로 이동한 다음 '지식 만들기'를 클릭합니다. 그런 다음 로컬 컴퓨터에서 PDF 파일을 업로드하라는 메시지가 표시됩니다. 따라서 ArXiv에서 논문을 다운로드하여 컴퓨터에 먼저 저장하는 것이 좋습니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/dify_knowledge_cc21a5c430.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>파일을 업로드한 후에는 청크 길이, 색인 방법, 사용할 임베딩 모델 및 검색 설정을 설정할 수 있습니다.</p>
<p>'청크 설정' 영역에서 최대 청크 길이를 원하는 숫자로 선택할 수 있습니다(이 사용 사례에서는 100으로 설정하겠습니다). 다음으로, '색인 방법'에서는 유사성 검색을 수행하여 관련 컨텍스트를 찾을 수 있도록 '고품질' 옵션을 선택해야 합니다. '임베딩 모델'의 경우 OpenAI에서 원하는 임베딩 모델을 선택할 수 있지만 이 예에서는 텍스트 임베딩 3-소형 모델을 사용하겠습니다. 마지막으로 '검색 설정'에서는 유사도 검색을 수행하여 가장 관련성이 높은 컨텍스트를 찾기 위해 '벡터 검색'을 선택해야 합니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Dify_save_837dbc0cf6.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>이제 '저장 및 처리'를 클릭하고 모든 것이 정상적으로 진행되면 다음 스크린샷과 같이 녹색 체크 표시가 나타납니다:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/dify_knowledge_created_d46b96385f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-4-Creating-the-RAG-App" class="common-anchor-header">4단계: RAG 앱 만들기</h3><p>여기까지 지식창고를 성공적으로 만들어 Milvus 데이터베이스에 저장했습니다. 이제 RAG 앱을 만들 준비가 되었습니다.</p>
<p>Dify로 RAG 앱을 만드는 것은 매우 간단합니다. 이전처럼 "지식" 대신 "스튜디오"로 이동한 다음 "빈칸에서 만들기"를 클릭합니다. 그런 다음 앱 유형으로 "챗봇"을 선택하고 제공된 필드에 앱 이름을 지정합니다. 완료했으면 "만들기"를 클릭합니다. 이제 다음 페이지가 표시됩니다:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/dify_create_f5691f193d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>"명령어" 필드에 "사용자의 질문에 간결하게 답변하세요"와 같은 시스템 프롬프트를 작성할 수 있습니다. 다음으로 "컨텍스트"에서 "추가" 기호를 클릭한 다음 방금 만든 지식창고를 추가해야 합니다. 이렇게 하면 RAG 앱이 이 지식창고에서 가능한 컨텍스트를 가져와 사용자의 쿼리에 답변할 수 있습니다.</p>
<p>이제 RAG 앱에 지식창고를 추가했으므로 마지막으로 해야 할 일은 OpenAI에서 LLM을 선택하는 것입니다. 아래 스크린샷에서 볼 수 있듯이 오른쪽 상단 모서리에 있는 모델 목록을 클릭하면 됩니다:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/dify_llm_c3b79ded37.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>이제 RAG 애플리케이션을 게시할 준비가 되었습니다! 오른쪽 상단 모서리에서 '게시'를 클릭하면 브라우저에서 실행하거나 웹사이트에 임베드하거나 API를 통해 앱에 액세스하는 등 다양한 방법으로 RAG 앱을 게시할 수 있습니다. 이 예제에서는 브라우저에서 앱을 실행하기 위해 &quot;앱 실행&quot;을 클릭합니다.</p>
<p>그게 다입니다! 이제 "주의만 기울이면 됩니다" 문서 또는 지식창고에 포함된 문서와 관련된 모든 것을 LLM에 문의할 수 있습니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/rag_attention_is_all_you_need_8582d3a69a.png" alt="" class="doc-image" id="" />
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
    </button></h2><p>이제 최소한의 코드와 구성으로 Dify와 Milvus를 사용하여 작동하는 RAG 애플리케이션을 구축했습니다. 이 접근 방식을 사용하면 개발자가 벡터 데이터베이스나 LLM 통합에 대한 깊은 전문 지식 없이도 복잡한 RAG 아키텍처에 액세스할 수 있습니다. 주요 요점:</p>
<ol>
<li><strong>낮은 설정 오버헤드</strong>: Docker Compose를 사용하면 배포가 간소화됩니다.</li>
<li><strong>노코드/로우코드 오케스트레이션</strong>: Dify는 대부분의 RAG 파이프라인을 처리합니다.</li>
<li><strong>프로덕션에 바로 사용할 수 있는 벡터 데이터베이스</strong>: Milvus는 효율적인 임베딩 저장 및 검색을 제공합니다.</li>
<li><strong>확장 가능한 아키텍처</strong>: 간편한 문서 추가 또는 매개변수 조정 프로덕션 배포를 고려하세요:</li>
</ol>
<ul>
<li>애플리케이션에 대한 인증 설정</li>
<li>Milvus의 적절한 확장 구성(특히 대규모 문서 컬렉션의 경우)</li>
<li>Dify 및 Milvus 인스턴스에 대한 모니터링 구현하기</li>
<li>최적의 성능을 위한 검색 매개변수 미세 조정 Dify와 Milvus의 조합을 통해 최신 대규모 언어 모델(LLM)로 조직의 내부 지식을 효과적으로 활용할 수 있는 RAG 애플리케이션을 신속하게 개발할 수 있습니다. 행복한 구축이 되시길 바랍니다!</li>
</ul>
<h2 id="Additional-Resources" class="common-anchor-header">추가 리소스<button data-href="#Additional-Resources" class="anchor-icon" translate="no">
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
<li><a href="https://docs.dify.ai/">Dify 문서</a></li>
<li><a href="https://milvus.io/docs">Milvus 문서</a></li>
<li><a href="https://zilliz.com/learn/vector-database">벡터 데이터베이스 기초</a></li>
<li><a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">RAG 구현 패턴</a></li>
</ul>
