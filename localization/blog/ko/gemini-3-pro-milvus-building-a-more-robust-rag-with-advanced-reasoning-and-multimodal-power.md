---
id: >-
  gemini-3-pro-milvus-building-a-more-robust-rag-with-advanced-reasoning-and-multimodal-power.md
title: 'Gemini 3 Pro + Milvus: 고급 추론 및 멀티모달 성능으로 더욱 강력한 RAG 구축'
author: Lumina Wang
date: 2025-11-20T00:00:00.000Z
cover: assets.zilliz.com/gemini3pro_cover_2f88fb0fe6.png
tag: Tutorial
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Gemini 3 Pro, vibe coding, Milvus, RAG'
meta_title: |
  Gemini 3 Pro + Milvus: Robust RAG With Advanced Reasoning and Multimodal Power
desc: >-
  Gemini 3 Pro의 핵심 업데이트에 대해 알아보고, 주요 벤치마크에서의 성능을 확인하고, Milvus로 고성능 RAG 파이프라인을
  구축하는 가이드를 따르세요.
origin: >-
  https://milvus.io/blog/gemini-3-pro-milvus-building-a-more-robust-rag-with-advanced-reasoning-and-multimodal-power.md
---
<p>Google의 Gemini 3 Pro는 단순한 과대 광고가 아니라 자연어 인터페이스의 기능을 실질적으로 확장하는 기능으로 개발자의 기대치를 진정으로 변화시키는 드문 릴리스입니다. 동적 도구 라우팅, 다단계 계획, API 오케스트레이션, 대화형 UX 생성이 모두 원활하게 결합되어 '원하는 앱 설명'을 실행 가능한 워크플로우로 전환합니다. 이는 바이브 코딩을 프로덕션 환경에서 실행 가능한 것으로 만드는 데 가장 근접한 모델입니다.</p>
<p>그리고 숫자가 이를 뒷받침합니다. Gemini 3 Pro는 거의 모든 주요 벤치마크에서 뛰어난 결과를 기록했습니다:</p>
<ul>
<li><p><strong>인류의 마지막 시험:</strong> 도구 없이 37.5%, 도구 사용 시 45.8% - 가장 가까운 경쟁 제품은 26.5%에 그쳤습니다.</p></li>
<li><p><strong>MathArena Apex:</strong> 23.4%, 대부분의 모델이 2%를 넘지 못했습니다.</p></li>
<li><p><strong>ScreenSpot-Pro:</strong> 72.7%의 정확도로 36.2%의 차선책보다 거의 두 배나 높습니다.</p></li>
<li><p><strong>벤딩 벤치 2:</strong> 평균 순 가치 <strong> 5,478.16달러로</strong> 2위보다 약 <strong>1.4배</strong> 높았습니다.</p></li>
</ul>
<p>자세한 벤치마크 결과는 아래 표에서 확인하세요.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/gemini_3_table_final_HLE_Tools_on_1s_X_Rb4o_f50f42dd67.gif" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>심층적인 추론, 강력한 도구 사용, 멀티모달의 유창함이 결합된 Gemini 3 Pro는 검색 증강 세대(RAG)에 매우 적합합니다. 수십억 개의 의미론적 검색을 위해 구축된 고성능 오픈 소스 벡터 데이터베이스인 <a href="https://milvus.io/"><strong>Milvus와</strong></a> 함께 사용하면 응답을 근거로 하고, 깔끔하게 확장되며, 워크로드가 많은 상황에서도 생산성을 유지하는 검색 레이어를 확보할 수 있습니다.</p>
<p>이 포스팅에서는 Gemini 3 Pro의 새로운 기능, RAG 워크플로우를 향상시키는 이유, Milvus를 검색 백본으로 사용해 깔끔하고 효율적인 RAG 파이프라인을 구축하는 방법에 대해 자세히 설명합니다.</p>
<h2 id="Major-Upgrades-in-Gemini-3-Pro" class="common-anchor-header">Gemini 3 Pro의 주요 업그레이드<button data-href="#Major-Upgrades-in-Gemini-3-Pro" class="anchor-icon" translate="no">
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
    </button></h2><p>Gemini 3 Pro는 모델이 추론하고, 작업을 생성하고, 실행하고, 사용자와 상호 작용하는 방식을 재구성하는 일련의 실질적인 업그레이드를 도입했습니다. 이러한 개선 사항은 크게 네 가지 주요 기능 영역으로 나뉩니다:</p>
<h3 id="Multimodal-Understanding-and-Reasoning" class="common-anchor-header">멀티모달 이해 및 추론</h3><p>Gemini 3 Pro는 시각적 추론을 위한 ARC-AGI-2, 교차 모드 이해를 위한 MMMU-Pro, 동영상 이해 및 지식 습득을 위한 Video-MMMU 등 중요한 멀티모달 벤치마크에서 새로운 기록을 세웠습니다. 또한 이 모델에는 구조화된 다단계 논리 처리를 가능하게 하는 확장 추론 모드인 딥 씽크가 도입되었습니다. 그 결과 기존의 연쇄 사고 모델이 실패하는 경향이 있는 복잡한 문제에 대해 훨씬 더 높은 정확도를 제공합니다.</p>
<h3 id="Code-Generation" class="common-anchor-header">코드 생성</h3><p>이 모델은 제너레이티브 코딩을 새로운 차원으로 끌어올립니다. Gemini 3 Pro는 하나의 자연어 프롬프트에서 대화형 SVG, 전체 웹 애플리케이션, 3D 장면, 심지어 Minecraft와 유사한 환경과 브라우저 기반 당구를 포함한 기능성 게임까지 모두 생성할 수 있습니다. 특히 프런트엔드 개발 시에는 기존 UI 디자인을 충실하게 재현하거나 스크린샷을 바로 제작 가능한 코드로 변환할 수 있어 반복적인 UI 작업을 훨씬 빠르게 진행할 수 있습니다.</p>
<h3 id="AI-Agents-and-Tool-Use" class="common-anchor-header">AI 에이전트 및 툴 사용</h3><p>사용자의 허가를 받으면 Gemini 3 Pro는 사용자의 Google 기기에서 데이터에 액세스하여 여행 계획이나 렌터카 예약과 같은 장시간에 걸친 다단계 작업을 수행할 수 있습니다. 이러한 에이전트 기능은 장시간의 도구 사용에 대한 스트레스 테스트를 위해 특별히 설계된 벤치마크인 <strong>Vending-Bench 2에서</strong> 강력한 성능을 보여줍니다. 또한 이 모델은 터미널 명령 실행, 잘 정의된 API를 통한 외부 도구와의 상호 작용 등 전문가 수준의 상담원 워크플로우를 지원합니다.</p>
<h3 id="Generative-UI" class="common-anchor-header">제너레이티브 UI</h3><p>Gemini 3 Pro는 기존의 1문 1답 모델을 넘어 전체 대화형 경험을 동적으로 구축할 수 있는 제너레이티브 <strong>UI를</strong> 도입했습니다. 정적인 텍스트를 반환하는 대신 사용자 지시에 따라 직접 풍부하고 조정 가능한 여행 플래너와 같은 완전히 맞춤화된 인터페이스를 생성할 수 있습니다. 이를 통해 LLM은 수동적인 응답자에서 능동적인 인터페이스 생성자로 전환됩니다.</p>
<h2 id="Putting-Gemini-3-Pro-to-the-Test" class="common-anchor-header">Gemini 3 Pro 테스트<button data-href="#Putting-Gemini-3-Pro-to-the-Test" class="anchor-icon" translate="no">
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
    </button></h2><p>벤치마크 결과 외에도 실제 워크플로우에서 Gemini 3 Pro가 어떻게 작동하는지 파악하기 위해 일련의 실습 테스트를 진행했습니다. 그 결과 멀티모달 추론, 생성 기능, 장기적인 계획이 개발자에게 실질적인 가치로 어떻게 전환되는지 확인할 수 있었습니다.</p>
<h3 id="Multimodal-understanding" class="common-anchor-header">멀티모달 이해</h3><p>Gemini 3 Pro는 텍스트, 이미지, 비디오 및 코드 전반에 걸쳐 인상적인 다용도성을 보여줍니다. 테스트에서는 YouTube에서 직접 Zilliz 동영상을 업로드했습니다. 이 모델은 내레이션, 전환, 화면 텍스트를 포함한 전체 클립을 약 <strong>40초</strong> 만에 처리했는데, 이는 긴 형식의 멀티모달 콘텐츠로서는 이례적으로 빠른 처리 속도입니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ytb1_39f31b728a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ytb2_bb4688e829.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Google의 내부 평가에서도 비슷한 결과가 나타났습니다: Gemini 3 Pro는 여러 언어로 된 필기 레시피를 처리하고, 각 레시피를 전사 및 번역한 후 공유 가능한 가족 레시피 북으로 편집했습니다.</p>
<iframe class="video-player" src="https://www.youtube.com/embed/nfX__7p8J8E" title="Gemini 3 Pro: recipe" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen width="100%" height="400"></iframe>
<h3 id="Zero-Shot-Tasks" class="common-anchor-header">제로 샷 작업</h3><p>Gemini 3 Pro는 사전 예제나 스캐폴딩 없이도 완전한 인터랙티브 웹 UI를 생성할 수 있습니다. 세련되고 복고풍의 미래형 <strong>3D 우주선 웹 게임을</strong> 만들라는 메시지가 표시되자 이 모델은 네온 보라색 그리드, 사이버펑크 스타일의 우주선, 빛나는 파티클 효과, 부드러운 카메라 컨트롤 등 완벽한 인터랙티브 장면을 단 한 번의 제로 샷으로 만들어냈습니다.</p>
<iframe class="video-player" src="https://www.youtube.com/embed/JxX_TAyy0Kg" title="" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen width="100%" height="400"></iframe>
<h3 id="Complex-Task-Planning" class="common-anchor-header">복잡한 작업 계획</h3><p>이 모델은 또한 다른 경쟁사보다 더 강력한 장기 작업 계획을 보여줍니다. 받은 편지함 정리 테스트에서 Gemini 3 Pro는 복잡한 이메일을 프로젝트 버킷으로 분류하고, 실행 가능한 제안(회신, 후속 조치, 보관)을 작성하고, 깔끔하고 구조화된 요약을 제시하는 등 마치 AI 관리 비서처럼 작동했습니다. 모델의 계획이 마련되면 한 번의 확인 클릭으로 전체 받은 편지함을 정리할 수 있습니다.</p>
<iframe class="video-player" src="https://www.youtube.com/embed/O5CUkblZm0Y" title="Gemini 3 Pro: inbox-organization" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen width="100%" height="400"></iframe>
<h2 id="How-to-Build-a-RAG-System-with-Gemini-3-Pro-and-Milvus" class="common-anchor-header">Gemini 3 Pro와 Milvus로 RAG 시스템을 구축하는 방법<button data-href="#How-to-Build-a-RAG-System-with-Gemini-3-Pro-and-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Gemini 3 Pro의 업그레이드된 추론, 멀티모달 이해, 강력한 도구 사용 기능은 고성능 RAG 시스템을 위한 훌륭한 기반이 됩니다.</p>
<p>대규모 시맨틱 검색을 위해 구축된 고성능 오픈 소스 벡터 데이터베이스인 <a href="https://milvus.io/"><strong>Milvus와</strong></a> 함께 사용하면 책임 분담을 명확하게 할 수 있습니다: Gemini 3 Pro는 <strong>해석, 추론, 생성을</strong> 처리하고 Milvus는 <strong>빠르고 확장 가능한 검색 계층을</strong> 제공하여 엔터프라이즈 데이터에 기반한 응답을 유지합니다. 이 조합은 내부 지식 기반, 문서 지원, 고객 지원 부조종사, 도메인별 전문가 시스템과 같은 프로덕션급 애플리케이션에 매우 적합합니다.</p>
<h3 id="Prerequisites" class="common-anchor-header">전제 조건</h3><p>RAG 파이프라인을 구축하기 전에 다음과 같은 핵심 Python 라이브러리가 설치되어 있거나 최신 버전으로 업그레이드되어 있는지 확인하세요:</p>
<ul>
<li><p><strong>pymilvus</strong> - 공식 Milvus Python SDK</p></li>
<li><p><strong>google-generativeai</strong> - Gemini 3 Pro 클라이언트 라이브러리</p></li>
<li><p><strong>요청</strong> - 필요한 경우 HTTP 호출 처리용</p></li>
<li><p><strong>tqdm</strong> - 데이터 세트 수집 중 진행률 표시줄용</p></li>
</ul>
<pre><code translate="no">! pip install --upgrade pymilvus google-generativeai requests tqdm
<button class="copy-code-btn"></button></code></pre>
<p>그런 다음 <a href="https://aistudio.google.com/api-keys"><strong>Google AI Studio에</strong></a> 로그인하여 API 키를 받습니다.</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> os
os.<span class="hljs-property">environ</span>[<span class="hljs-string">&quot;GEMINI_API_KEY&quot;</span>] = <span class="hljs-string">&quot;**********&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Preparing-the-Dataset" class="common-anchor-header">데이터 세트 준비하기</h3><p>이 튜토리얼에서는 Milvus 2.4.x 문서의 FAQ 섹션을 RAG 시스템의 비공개 지식 베이스로 사용하겠습니다.</p>
<p>문서 아카이브를 다운로드하여 <code translate="no">milvus_docs</code> 라는 폴더에 압축을 풉니다.</p>
<pre><code translate="no">! wget https://github.com/milvus-io/milvus-docs/releases/download/v2<span class="hljs-number">.4</span><span class="hljs-number">.6</span>-preview/milvus_docs_2<span class="hljs-number">.4</span>.x_en.<span class="hljs-built_in">zip</span>
! unzip -q milvus_docs_2<span class="hljs-number">.4</span>.x_en.<span class="hljs-built_in">zip</span> -d milvus_docs
<button class="copy-code-btn"></button></code></pre>
<p><code translate="no">milvus_docs/en/faq</code> 경로에서 모든 마크다운 파일을 로드합니다. 각 문서에 대해 <code translate="no">#</code> 제목을 기준으로 간단한 분할을 적용하여 각 마크다운 파일 내의 주요 섹션을 대략적으로 구분합니다.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> glob <span class="hljs-keyword">import</span> glob
text_lines = []
<span class="hljs-keyword">for</span> file_path <span class="hljs-keyword">in</span> glob(<span class="hljs-string">&quot;milvus_docs/en/faq/*.md&quot;</span>, recursive=<span class="hljs-literal">True</span>):
    <span class="hljs-keyword">with</span> <span class="hljs-built_in">open</span>(file_path, <span class="hljs-string">&quot;r&quot;</span>) <span class="hljs-keyword">as</span> file:
        file_text = file.read()
    text_lines += file_text.split(<span class="hljs-string">&quot;# &quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="LLM-and-Embedding-Model-Setup" class="common-anchor-header">LLM 및 임베딩 모델 설정</h3><p>이 튜토리얼에서는 <code translate="no">gemini-3-pro-preview</code> 을 LLM으로, <code translate="no">text-embedding-004</code> 을 임베딩 모델로 사용하겠습니다.</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> google.generativeai <span class="hljs-keyword">as</span> genai
genai.configure(api_key=os.environ[<span class="hljs-string">&quot;GEMINI_API_KEY&quot;</span>])
gemini_model = genai.GenerativeModel(<span class="hljs-string">&quot;gemini-3-pro-preview&quot;</span>)
response = gemini_model.generate_content(<span class="hljs-string">&quot;who are you&quot;</span>)
<span class="hljs-built_in">print</span>(response.text)
<button class="copy-code-btn"></button></code></pre>
<p>모델 응답: 저는 Google에서 만든 대규모 언어 모델인 Gemini입니다.</p>
<p>테스트 임베딩을 생성하고 처음 몇 개의 값과 함께 차원을 인쇄하여 빠른 검사를 실행할 수 있습니다:</p>
<pre><code translate="no">test_embeddings = genai.embed_content(
    model=<span class="hljs-string">&quot;models/text-embedding-004&quot;</span>, content=[<span class="hljs-string">&quot;This is a test1&quot;</span>, <span class="hljs-string">&quot;This is a test2&quot;</span>]
)[<span class="hljs-string">&quot;embedding&quot;</span>]
embedding_dim = <span class="hljs-built_in">len</span>(test_embeddings[<span class="hljs-number">0</span>])
<span class="hljs-built_in">print</span>(embedding_dim)
<span class="hljs-built_in">print</span>(test_embeddings[<span class="hljs-number">0</span>][:<span class="hljs-number">10</span>])
<button class="copy-code-btn"></button></code></pre>
<p>테스트 벡터 출력:</p>
<p>768</p>
<p>[0.013588584, -0.004361838, -0.08481652, -0.039724775, 0.04723794, -0.0051557426, 0.026071774, 0.045514572, -0.016867816, 0.039378334]</p>
<h3 id="Loading-Data-into-Milvus" class="common-anchor-header">밀버스에 데이터 로드하기</h3><p><strong>컬렉션 생성</strong></p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> <span class="hljs-title class_">MilvusClient</span>
milvus_client = <span class="hljs-title class_">MilvusClient</span>(uri=<span class="hljs-string">&quot;./milvus_demo.db&quot;</span>)
collection_name = <span class="hljs-string">&quot;my_rag_collection&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p><code translate="no">MilvusClient</code> 을 생성할 때 규모와 환경에 따라 세 가지 구성 옵션 중에서 선택할 수 있습니다:</p>
<ul>
<li><p><strong>로컬 모드(Milvus Lite):</strong> URI를 로컬 파일 경로(예: <code translate="no">./milvus.db</code>)로 설정합니다. 가장 쉽게 시작할 수 있는 방법으로, <a href="https://milvus.io/docs/milvus_lite.md">Milvus Lite가</a> 모든 데이터를 해당 파일에 자동으로 저장합니다.</p></li>
<li><p><strong>자체 호스팅 Milvus(도커 또는 쿠버네티스):</strong> 대규모 데이터 세트 또는 프로덕션 워크로드의 경우, Docker 또는 Kubernetes에서 Milvus를 실행하세요. URI를 <code translate="no">http://localhost:19530</code> 와 같이 Milvus 서버 엔드포인트로 설정합니다.</p></li>
<li><p><strong>Zilliz Cloud(완전 관리형 Milvus 서비스):</strong> 관리형 솔루션을 선호하는 경우 Zilliz Cloud를 사용하세요. URI를 퍼블릭 엔드포인트로 설정하고 API 키를 인증 토큰으로 제공하세요.</p></li>
</ul>
<p>새 컬렉션을 생성하기 전에 먼저 해당 컬렉션이 이미 있는지 확인하세요. 존재한다면 삭제하고 다시 생성하여 깔끔하게 설정하세요.</p>
<pre><code translate="no">if milvus_client.has_collection(collection_name):
    milvus_client.drop_collection(collection_name)
<button class="copy-code-btn"></button></code></pre>
<p>지정된 매개변수를 사용하여 새 컬렉션을 만듭니다.</p>
<p>스키마가 제공되지 않으면 Milvus는 기본 키로 기본 ID 필드와 임베딩을 저장하기 위한 벡터 필드를 자동으로 생성합니다. 또한 스키마에 정의되지 않은 추가 필드를 캡처하는 예약된 JSON 동적 필드도 제공합니다.</p>
<pre><code translate="no">milvus_client.create_collection(
    collection_name=collection_name,
    dimension=embedding_dim,
    metric_type=<span class="hljs-string">&quot;COSINE&quot;</span>,
    consistency_level=<span class="hljs-string">&quot;Strong&quot;</span>,  <span class="hljs-comment"># Strong consistency level</span>
)
<button class="copy-code-btn"></button></code></pre>
<p><strong>데이터 삽입</strong></p>
<p>각 텍스트 항목을 반복하여 임베딩 벡터를 생성한 다음 데이터를 Milvus에 삽입합니다. 이 예에서는 <code translate="no">text</code> 이라는 추가 필드를 포함합니다. 이 필드는 스키마에 미리 정의되어 있지 않으므로 Milvus는 내부에서 동적 JSON 필드를 사용하여 자동으로 저장하므로 추가 설정이 필요하지 않습니다.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> tqdm <span class="hljs-keyword">import</span> tqdm
data = []
doc_embeddings = genai.embed_content(
    model=<span class="hljs-string">&quot;models/text-embedding-004&quot;</span>, content=text_lines
)[<span class="hljs-string">&quot;embedding&quot;</span>]
<span class="hljs-keyword">for</span> i, line <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(tqdm(text_lines, desc=<span class="hljs-string">&quot;Creating embeddings&quot;</span>)):
    data.append({<span class="hljs-string">&quot;id&quot;</span>: i, <span class="hljs-string">&quot;vector&quot;</span>: doc_embeddings[i], <span class="hljs-string">&quot;text&quot;</span>: line})
milvus_client.insert(collection_name=collection_name, data=data)
<button class="copy-code-btn"></button></code></pre>
<p>샘플 출력:</p>
<pre><code translate="no">Creating embeddings: 100%|█████████████████████████| 72/72 [00:00&lt;00:00, 431414.13it/s]
{<span class="hljs-string">&#x27;insert_count&#x27;</span>: 72, <span class="hljs-string">&#x27;ids&#x27;</span>: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71], <span class="hljs-string">&#x27;cost&#x27;</span>: 0}
<button class="copy-code-btn"></button></code></pre>
<h3 id="Building-the-RAG-Workflow" class="common-anchor-header">RAG 워크플로 구축하기</h3><p><strong>관련 데이터 검색</strong></p>
<p>검색을 테스트하기 위해 Milvus에 대한 일반적인 질문을 합니다.</p>
<pre><code translate="no">question = <span class="hljs-string">&quot;How is data stored in milvus?&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>컬렉션에서 쿼리를 검색하여 가장 관련성이 높은 상위 3개의 결과를 반환합니다.</p>
<pre><code translate="no">question_embedding = genai.embed_content(
    model=<span class="hljs-string">&quot;models/text-embedding-004&quot;</span>, content=question
)[<span class="hljs-string">&quot;embedding&quot;</span>]
search_res = milvus_client.search(
    collection_name=collection_name,
    data=[question_embedding],
    limit=<span class="hljs-number">3</span>,  <span class="hljs-comment"># Return top 3 results</span>
    search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;COSINE&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {}},  <span class="hljs-comment"># Inner product distance</span>
    output_fields=[<span class="hljs-string">&quot;text&quot;</span>],  <span class="hljs-comment"># Return the text field</span>
)
<span class="hljs-keyword">import</span> json
retrieved_lines_with_distances = [
    (res[<span class="hljs-string">&quot;entity&quot;</span>][<span class="hljs-string">&quot;text&quot;</span>], res[<span class="hljs-string">&quot;distance&quot;</span>]) <span class="hljs-keyword">for</span> res <span class="hljs-keyword">in</span> search_res[<span class="hljs-number">0</span>]
]
<span class="hljs-built_in">print</span>(json.dumps(retrieved_lines_with_distances, indent=<span class="hljs-number">4</span>))
<button class="copy-code-btn"></button></code></pre>
<p>결과는 가장 유사한 것부터 가장 덜 유사한 것까지 유사도 순으로 반환됩니다.</p>
<pre><code translate="no">[
    [
        <span class="hljs-string">&quot; Where does Milvus store data?\n\nMilvus deals with two types of data, inserted data and metadata. \n\nInserted data, including vector data, scalar data, and collection-specific schema, are stored in persistent storage as incremental log. Milvus supports multiple object storage backends, including [MinIO](
https://min.io/
), [AWS S3](
https://aws.amazon.com/s3/?nc1=h_ls
), [Google Cloud Storage](
https://cloud.google.com/storage?hl=en#object-storage-for-companies-of-all-sizes
) (GCS), [Azure Blob Storage](
https://azure.microsoft.com/en-us/products/storage/blobs
), [Alibaba Cloud OSS](
https://www.alibabacloud.com/product/object-storage-service
), and [Tencent Cloud Object Storage](
https://www.tencentcloud.com/products/cos
) (COS).\n\nMetadata are generated within Milvus. Each Milvus module has its own metadata that are stored in etcd.\n\n###&quot;</span>,
        0.8048489093780518
    ],
    [
        <span class="hljs-string">&quot;Does the query perform in memory? What are incremental data and historical data?\n\nYes. When a query request comes, Milvus searches both incremental data and historical data by loading them into memory. Incremental data are in the growing segments, which are buffered in memory before they reach the threshold to be persisted in storage engine, while historical data are from the sealed segments that are stored in the object storage. Incremental data and historical data together constitute the whole dataset to search.\n\n###&quot;</span>,
        0.757495105266571
    ],
    [
        <span class="hljs-string">&quot;What is the maximum dataset size Milvus can handle?\n\n  \nTheoretically, the maximum dataset size Milvus can handle is determined by the hardware it is run on, specifically system memory and storage:\n\n- Milvus loads all specified collections and partitions into memory before running queries. Therefore, memory size determines the maximum amount of data Milvus can query.\n- When new entities and and collection-related schema (currently only MinIO is supported for data persistence) are added to Milvus, system storage determines the maximum allowable size of inserted data.\n\n###&quot;</span>,
        0.7453694343566895
    ]
]
<button class="copy-code-btn"></button></code></pre>
<p><strong>LLM으로 RAG 응답 생성하기</strong></p>
<p>문서를 검색한 후 문자열 형식으로 변환합니다.</p>
<pre><code translate="no">context = <span class="hljs-string">&quot;\n&quot;</span>.<span class="hljs-keyword">join</span>(
    [<span class="hljs-meta">line_with_distance[0</span>] <span class="hljs-keyword">for</span> line_with_distance <span class="hljs-keyword">in</span> retrieved_lines_with_distances]
)
<button class="copy-code-btn"></button></code></pre>
<p>Milvus에서 검색한 문서로 구성된 시스템 프롬프트와 사용자 프롬프트를 LLM에 제공합니다.</p>
<pre><code translate="no">SYSTEM_PROMPT = <span class="hljs-string">&quot;&quot;&quot;
Human: You are an AI assistant. You are able to find answers to the questions from the contextual passage snippets provided.
&quot;&quot;&quot;</span>
USER_PROMPT = <span class="hljs-string">f&quot;&quot;&quot;
Use the following pieces of information enclosed in &lt;context&gt; tags to provide an answer to the question enclosed in &lt;question&gt; tags.
&lt;context&gt;
<span class="hljs-subst">{context}</span>
&lt;/context&gt;
&lt;question&gt;
<span class="hljs-subst">{question}</span>
&lt;/question&gt;
&quot;&quot;&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>이러한 프롬프트와 함께 <code translate="no">gemini-3-pro-preview</code> 모델을 사용하여 최종 응답을 생성합니다.</p>
<pre><code translate="no">gemini_model = genai.GenerativeModel(
    <span class="hljs-string">&quot;gemini-3-pro-preview&quot;</span>, system_instruction=SYSTEM_PROMPT
)
response = gemini_model.generate_content(USER_PROMPT)
<span class="hljs-built_in">print</span>(response.text)
<button class="copy-code-btn"></button></code></pre>
<p>출력 결과에서 Gemini 3 Pro가 검색된 정보를 기반으로 명확하고 잘 구조화된 답변을 생성하는 것을 확인할 수 있습니다.</p>
<pre><code translate="no">Based <span class="hljs-keyword">on</span> the provided documents, Milvus stores data <span class="hljs-keyword">in</span> the following ways:
*   **Inserted Data:** Vector data, scalar data, <span class="hljs-keyword">and</span> collection-specific schema are stored <span class="hljs-keyword">in</span> persistent storage <span class="hljs-keyword">as</span> an incremental log. Milvus supports multiple <span class="hljs-built_in">object</span> storage backends <span class="hljs-keyword">for</span> <span class="hljs-keyword">this</span> purpose, including:
    *   MinIO
    *   AWS S3
    *   <span class="hljs-function">Google Cloud <span class="hljs-title">Storage</span> (<span class="hljs-params">GCS</span>)
    *   Azure Blob Storage
    *   Alibaba Cloud OSS
    *   Tencent Cloud Object <span class="hljs-title">Storage</span> (<span class="hljs-params">COS</span>)
*   **Metadata:** Metadata generated within Milvus modules <span class="hljs-keyword">is</span> stored <span class="hljs-keyword">in</span> **etcd**.
*   **Memory Buffering:** Incremental <span class="hljs-title">data</span> (<span class="hljs-params">growing segments</span>) are buffered <span class="hljs-keyword">in</span> memory before being persisted, <span class="hljs-keyword">while</span> historical <span class="hljs-title">data</span> (<span class="hljs-params"><span class="hljs-keyword">sealed</span> segments</span>) resides <span class="hljs-keyword">in</span> <span class="hljs-built_in">object</span> storage but <span class="hljs-keyword">is</span> loaded <span class="hljs-keyword">into</span> memory <span class="hljs-keyword">for</span> querying.
</span><button class="copy-code-btn"></button></code></pre>
<p><strong>참고</strong>: 현재 무료 티어 사용자는 Gemini 3 Pro를 사용할 수 없습니다. 자세한 내용을 보려면 <a href="https://ai.google.dev/gemini-api/docs/rate-limits#tier-1">여기를</a> 클릭하세요.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Gemini_3_Pro1_095925d461.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Gemini_3_Pro2_71ae286cf9.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>대신 <a href="https://openrouter.ai/google/gemini-3-pro-preview/api">OpenRouter를</a> 통해 액세스할 수 있습니다:</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> openai <span class="hljs-keyword">import</span> OpenAI
client = OpenAI(
  base_url=<span class="hljs-string">&quot;https://openrouter.ai/api/v1&quot;</span>,
  api_key=<span class="hljs-string">&quot;&lt;OPENROUTER_API_KEY&gt;&quot;</span>,
)
response2 = client.chat.completions.create(
  model=<span class="hljs-string">&quot;google/gemini-3-pro-preview&quot;</span>,
  messages=[
        {
            <span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;system&quot;</span>,
            <span class="hljs-string">&quot;content&quot;</span>: SYSTEM_PROMPT
        },
        {
            <span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>, 
            <span class="hljs-string">&quot;content&quot;</span>: USER_PROMPT
        }
    ],
  extra_body={<span class="hljs-string">&quot;reasoning&quot;</span>: {<span class="hljs-string">&quot;enabled&quot;</span>: <span class="hljs-literal">True</span>}}
)
response_message = response2.choices[<span class="hljs-number">0</span>].message
<span class="hljs-built_in">print</span>(response_message.content)
<button class="copy-code-btn"></button></code></pre>
<h2 id="One-More-Thing-Vibe-Coding-with-Google-Antigravity" class="common-anchor-header">한 가지 더: Google 안티그래비티를 사용한 바이브 코딩<button data-href="#One-More-Thing-Vibe-Coding-with-Google-Antigravity" class="anchor-icon" translate="no">
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
    </button></h2><p>Gemini 3 Pro와 함께 Google은 편집기, 단말기 및 브라우저와 자율적으로 상호 작용하는 동영상 코딩 플랫폼인 <a href="https://antigravity.google/"><strong>Google 안티그래비티를</strong></a> 도입했습니다. 일회성 지침을 처리하던 이전의 AI 지원 도구와 달리, Antigravity는 작업 지향적 수준에서 작동하므로 개발자는 <em>무엇을</em> 만들지 지정하면 시스템이 <em>방법을</em> 관리하여 전체 워크플로를 엔드투엔드로 조율할 수 있습니다.</p>
<p>기존의 AI 코딩 워크플로에서는 일반적으로 개발자가 수동으로 검토, 통합, 디버그 및 실행해야 하는 고립된 스니펫을 생성했습니다. 반중력은 이러한 방식을 바꿉니다. 예를 들어 <em>"간단한 애완동물 상호작용 게임 만들기</em> "와 같은 간단한 작업만 설명하면 시스템이 요청을 분해하고 코드를 생성하며 터미널 명령을 실행하고 브라우저를 열어 결과를 테스트한 후 작동할 때까지 반복합니다. 이는 AI를 수동적인 자동 완성 엔진에서 사용자의 선호도를 학습하고 시간이 지남에 따라 개인 개발 스타일에 적응하는 능동적인 엔지니어링 파트너로 격상시킵니다.</p>
<p>앞으로 에이전트가 데이터베이스와 직접 협력하는 것은 그리 어려운 일이 아닙니다. MCP를 통한 도구 호출을 통해 AI는 결국 Milvus 데이터베이스를 읽고, 지식 기반을 구성하고, 자체 검색 파이프라인을 자율적으로 유지 관리할 수 있게 될 것입니다. 여러 면에서 이러한 변화는 모델 업그레이드 자체보다 훨씬 더 중요합니다. AI가 제품 수준의 설명을 받아 일련의 실행 가능한 작업으로 변환할 수 있게 되면 인간의 노력은 자연스럽게 목표, 제약 조건, '정확성'의 정의, 즉 진정한 제품 개발을 주도하는 고차원적인 사고로 옮겨갈 수 있게 됩니다.</p>
<h2 id="Ready-to-Build" class="common-anchor-header">빌드할 준비가 되셨나요?<button data-href="#Ready-to-Build" class="anchor-icon" translate="no">
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
    </button></h2><p>사용해 볼 준비가 되셨다면 지금 바로 단계별 튜토리얼을 따라 <strong>Gemini 3 Pro + Milvus로</strong> RAG 시스템을 구축해 보세요.</p>
<p>궁금한 점이 있거나 기능에 대해 자세히 알아보고 싶으신가요?<a href="https://discord.com/invite/8uyFbECzPX"> Discord 채널에</a> 참여하거나<a href="https://github.com/milvus-io/milvus"> GitHub에</a> 이슈를 제출하세요.<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus 오피스 아워를</a> 통해 20분간 일대일 세션을 예약하여 인사이트, 안내 및 질문에 대한 답변을 얻을 수도 있습니다.</p>
