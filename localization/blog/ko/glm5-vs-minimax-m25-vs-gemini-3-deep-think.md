---
id: glm5-vs-minimax-m25-vs-gemini-3-deep-think.md
title: 'GLM-5 대 MiniMax M2.5 대 Gemini 3 깊이 생각하기: 어떤 모델이 귀사의 AI 에이전트 스택에 적합할까요?'
author: 'Lumina Wang, Julie Xia'
date: 2026-02-14T00:00:00.000Z
cover: assets.zilliz.com/gemini_vs_minimax_vs_glm5_cover_1bc6d20c39.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Gemini, GLM, Minimax, ChatGPT'
meta_keywords: 'Gemini 3, GLM5, Minimax m2.5, ChatGPT'
meta_title: |
  GLM-5 vs MiniMax M2.5 vs Gemini 3 Deep Think Compared
desc: >-
  코딩, 추론 및 AI 에이전트를 위한 GLM-5, MiniMax M2.5 및 Gemini 3 Deep Think의 실습 비교. Milvus를
  사용한 RAG 튜토리얼이 포함되어 있습니다.
origin: 'https://milvus.io/blog/glm5-vs-minimax-m25-vs-gemini-3-deep-think.md'
---
<p>불과 이틀 만에 세 가지 주요 모델이 연달아 출시되었습니다: GLM-5, MiniMax M2.5, Gemini 3 Deep Think입니다. 세 제품 모두 <strong>코딩, 심층 추론, 에이전트 워크플로우라는</strong> 동일한 기능을 표방합니다 <strong>.</strong> 세 제품 모두 최첨단 성능을 자랑합니다. 사양표를 자세히 들여다보면 세 제품 모두에서 동일한 핵심 사항을 찾아내는 매칭 게임을 할 수 있을 정도입니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/comparsion_minimax_vs_glm5_vs_gemini3_d05715d4c2.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>더 무서운 생각은? 상사가 이미 발표 내용을 보고 이번 주가 끝나기도 전에 세 가지 모델을 사용하여 9개의 사내 앱을 구축해 달라고 요청하고 있을지도 모릅니다.</p>
<p>그렇다면 실제로 이 모델들의 차이점은 무엇일까요? 이 중에서 어떻게 선택해야 할까요? 그리고 (항상 그렇듯이) 내부 지식창고를 제공하기 위해 <a href="https://milvus.io/">Milvus와</a> 어떻게 연결할 수 있을까요? 이 페이지를 북마크에 추가하세요. 필요한 모든 것이 있습니다.</p>
<h2 id="GLM-5-MiniMax-M25-and-Gemini-3-Deep-Think-at-a-Glance" class="common-anchor-header">GLM-5, MiniMax M2.5 및 Gemini 3 심층적 사고 한눈에 보기<button data-href="#GLM-5-MiniMax-M25-and-Gemini-3-Deep-Think-at-a-Glance" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="GLM-5-leads-in-complex-system-engineering-and-long-horizon-agent-tasks" class="common-anchor-header">복잡한 시스템 엔지니어링 및 장시간 에이전트 작업을 선도하는 GLM-5</h3><p>지푸는 2월 12일 복잡한 시스템 엔지니어링과 장기적인 상담원 워크플로우에 탁월한 GLM-5를 공식 출시했습니다.</p>
<p>이 모델은 28.5T 토큰으로 학습된 355B-744B 매개변수(40B 활성)를 보유하고 있습니다. 이 모델은 희소 주의 메커니즘과 비동기 강화 학습 프레임워크인 Slime을 통합하여 배포 비용을 낮추면서 품질 손실 없이 매우 긴 컨텍스트를 처리할 수 있습니다.</p>
<p>GLM-5는 주요 벤치마크에서 오픈 소스 팩을 주도하며 SWE 벤치 검증에서 1위(77.8점), 터미널 벤치 2.0에서 1위(56.2점)를 차지하여 MiniMax 2.5와 Gemini 3 Deep Think를 앞질렀습니다. 하지만 여전히 Claude Opus 4.5 및 GPT-5.2와 같은 최고의 비공개 소스 모델에 뒤처지는 점수를 기록했습니다. 비즈니스 시뮬레이션 평가인 벤딩 벤치 2에서 GLM-5는 시뮬레이션 연간 수익으로 4,432달러를 창출하여 오픈 소스 시스템과 거의 동일한 범위를 기록했습니다.</p>
<p>또한 GLM-5는 시스템 엔지니어링 및 장거리 에이전트 기능을 대폭 업그레이드했습니다. 이제 텍스트나 원시 자료를 .docx, .pdf, .xlsx 파일로 직접 변환하고 제품 요구 사항 문서, 강의 계획, 시험, 스프레드시트, 재무 보고서, 순서도 및 메뉴와 같은 특정 결과물을 생성할 수 있습니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/benchmark_1_aa8211e962.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/benchmark_2_151ec06a6f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Gemini-3-Deep-Think-sets-a-new-bar-for-scientific-reasoning" class="common-anchor-header">과학적 추론의 새로운 기준을 제시하는 Gemini 3 Deep Think</h3><p>2026년 2월 13일 새벽, Google은 (잠정적으로) 지구상에서 가장 강력한 연구 및 추론 모델이라고 할 수 있는 주요 업그레이드 버전인 Gemini 3 Deep Think를 공식적으로 출시했습니다. 결국 Gemini는 세차 테스트를 통과한 유일한 모델이었죠: "<em>세차를 하려고 하는데 세차장이 불과 50m 거리에 있습니다. 시동을 걸어서</em> 갈까<em>, 아니면 그냥 걸어갈까</em>?"라는 질문을 던졌습니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/car_wash_test_gemini_859ee40db8.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/car_wash_test_gpt_0ec0dffd4b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>이 모델의 핵심 강점은 최고 수준의 추론 및 경쟁 성능으로, 코드포스에서 세계 8위 수준의 경쟁 프로그래머와 맞먹는 3455엘로를 기록했습니다. 2025년 국제 물리, 화학, 수학 올림피아드에서 필기 부문 금메달을 획득하기도 했습니다. 비용 효율성은 또 다른 혁신입니다. ARC-AGI-1은 작업당 7.17달러로 실행되며, 이는 14개월 전 OpenAI의 o3-프리뷰에 비해 280배에서 420배까지 절감된 비용입니다. 응용 측면에서 딥씽크의 가장 큰 이점은 과학 연구 분야입니다. 전문가들은 이미 전문 수학 논문의 동료 검토와 복잡한 결정 성장 준비 워크플로우를 최적화하는 데 사용하고 있습니다.</p>
<h3 id="MiniMax-M25-competes-on-cost-and-speed-for-production-workloads" class="common-anchor-header">생산 워크로드에서 비용과 속도 면에서 경쟁력이 있는 MiniMax M2.5</h3><p>같은 날 MiniMax는 M2.5를 출시하여 생산 사용 사례를 위한 비용 및 효율성 챔피언으로 자리매김했습니다.</p>
<p>업계에서 가장 빠르게 반복되는 모델 제품군 중 하나인 M2.5는 코딩, 도구 호출, 검색 및 사무실 생산성 전반에 걸쳐 새로운 SOTA 결과를 설정합니다. 고속 버전은 약 100 TPS로 실행되며, 입력 가격은 <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><annotation encoding="application/x-tex">백만 토큰당 0.30달러, 출력은</annotation></semantics></math></span></span>백만 토큰당 0.30달러 <span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord">(</span><span class="strut" style="height:0.8889em;vertical-align:-0.1944em;"></span><span class="mord"></span></span></span></span>0. <span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord">30달러</span></span></span>,<span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><annotation encoding="application/x-tex">출력은</annotation></semantics></math></span></span>백만 토큰당 <span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord mathnormal">2</span></span></span></span>.40달러)로 책정되어 있습니다. 50 TPS 버전은 출력 비용을 절반으로 줄였습니다. 속도는 이전 M2.1에 비해 37% 향상되었으며, 평균 22.8분 만에 SWE 벤치 검증 작업을 완료하여 Claude Opus 4.6과 거의 일치합니다. 기능 측면에서 M2.5는 Go, Rust, Kotlin 등 10개 이상의 언어로 풀스택 개발을 지원하여 제로 투 원 시스템 설계부터 전체 코드 검토까지 모든 것을 포괄합니다. 오피스 워크플로우의 경우 Office 스킬 기능은 Word, PPT, Excel과 긴밀하게 통합됩니다. 재무 및 법률 분야의 도메인 지식과 결합하면 바로 사용할 수 있는 연구 보고서와 재무 모델을 생성할 수 있습니다.</p>
<p>이것이 개략적인 개요입니다. 이제 실제 테스트에서 실제로 어떻게 작동하는지 살펴보겠습니다.</p>
<h2 id="Hands-On-Comparisons" class="common-anchor-header">실습 비교<button data-href="#Hands-On-Comparisons" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="3D-scene-rendering-Gemini-3-Deep-Think-produces-the-most-realistic-results" class="common-anchor-header">3D 장면 렌더링: 가장 사실적인 결과물을 만들어내는 Gemini 3 Deep Think</h3><p>사용자가 이미 Gemini 3 Deep Think에서 테스트한 프롬프트를 가져와 GLM-5와 MiniMax M2.5에서 실행하여 직접 비교했습니다. 프롬프트는 박물관의 고전 유화와 구별할 수 없는 완전한 3D 실내 공간을 렌더링하는 단일 HTML 파일로 완전한 Three.js 장면을 빌드하는 것입니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/emily_instgram_0af85c65fb.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Gemini 3 딥 씽크</p>
<iframe width="352" height="625" src="https://www.youtube.com/embed/Lhg-XsIM_CQ" title="gemini3 deep think test: 3D redering" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
<p>GLM-5</p>
<iframe width="707" height="561" src="https://www.youtube.com/embed/tTuW7qQBO1Y" title="GLM 5 test: 3D scene rendering" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
<p>MiniMax M2.5</p>
<iframe width="594" height="561" src="https://www.youtube.com/embed/KJMhnXqa4Uc" title="minimax m2.5 test: 3D scene rendering" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
<p><strong>Gemini 3 Deep Think는</strong> 가장 강력한 결과를 제공했습니다. 프롬프트를 정확하게 해석하고 고품질의 3D 장면을 생성했습니다. 그림자의 방향과 감쇠가 자연스러워 창문을 통해 들어오는 자연광의 공간적 관계를 명확하게 전달하는 등 조명이 돋보였습니다. 양초의 반쯤 녹은 질감과 붉은색 왁스 씰의 재질감 등 세세한 디테일도 인상적이었습니다. 전반적인 시각적 충실도가 높았습니다.</p>
<p><strong>GLM-5는</strong> 디테일한 오브젝트 모델링과 텍스처 작업을 구현했지만, 라이팅 시스템에는 눈에 띄는 문제가 있었습니다. 테이블 그림자가 부드러운 전환 없이 딱딱하고 순수한 검정색 블록으로 렌더링되었습니다. 왁스 씰이 테이블 표면 위에 떠 있는 것처럼 보이며 오브젝트와 테이블 상판 사이의 접촉 관계를 올바르게 처리하지 못했습니다. 이러한 아티팩트는 전역 조명과 공간 추론에서 개선의 여지가 있음을 시사합니다.</p>
<p><strong>MiniMax M2.5는</strong> 복잡한 씬 디스크립션을 효과적으로 파싱하지 못했습니다. 무질서한 파티클 모션만 출력되어 정확한 시각적 요구 사항이 있는 다계층 시맨틱 지침을 처리할 때 이해와 생성 모두에 상당한 한계가 있음을 보여주었습니다.</p>
<h3 id="SVG-generation-all-three-models-handle-it-differently" class="common-anchor-header">SVG 생성: 세 모델 모두 서로 다른 방식으로 처리</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/simon_twitter_screenshot_fef1c01cbf.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>프롬프트:</strong> 자전거를 타고 있는 캘리포니아 갈색 펠리컨의 SVG를 생성합니다. 자전거에는 스포크와 올바른 모양의 자전거 프레임이 있어야 합니다. 펠리컨은 특징적인 큰 주머니를 가지고 있어야 하며 깃털이 명확하게 표시되어 있어야 합니다. 펠리컨이 자전거 페달을 명확하게 밟고 있어야 합니다. 이미지에는 캘리포니아 갈색 펠리컨의 번식 깃털이 완전히 보여야 합니다.</p>
<p><strong>쌍둥이자리 3 깊은 생각</strong></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/gemini_3_generated_image_182aaefe26.png" alt="Gemini 3 Deep Think" class="doc-image" id="gemini-3-deep-think" />
   </span> <span class="img-wrapper"> <span>제미니 3 깊은 생각</span> </span></p>
<p><strong>GLM-5</strong></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/GLM_5_generated_image_e84302d987.png" alt="GLM-5" class="doc-image" id="glm-5" />
   </span> <span class="img-wrapper"> <span>GLM-5</span> </span></p>
<p><strong>MiniMax M2.5</strong></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/minimax_m2_5_generated_image_06d50f8fa7.png" alt="MiniMax M2.5" class="doc-image" id="minimax-m2.5" />
   </span> <span class="img-wrapper"> <span>MiniMax M2.5</span> </span></p>
<p><strong>제미니 3 딥 씽크는</strong> 전체적으로 가장 완벽한 SVG를 만들었습니다. 펠리칸의 라이딩 자세는 정확합니다. 무게 중심은 자연스럽게 시트에 앉고 발은 페달 위에 놓여 역동적인 사이클링 자세를 취하고 있습니다. 깃털 질감이 섬세하고 겹겹이 쌓여 있습니다. 한 가지 약점은 펠리칸의 시그니처인 목 주머니가 너무 크게 그려져 전체적인 비율이 약간 흐트러진다는 점입니다.</p>
<p><strong>GLM-5에는</strong> 눈에 띄는 자세 문제가 있었습니다. 발은 페달 위에 올바르게 놓여 있지만 전체적인 착석 자세가 자연스러운 라이딩 자세에서 멀어지고 몸과 시트의 관계가 어색해 보입니다. 그렇긴 하지만 목 파우치의 비율이 잘 맞고 깃털 질감의 품질이 만족스러울 정도로 디테일 작업이 견고합니다.</p>
<p><strong>미니맥스 M2.5는</strong> 미니멀한 스타일로 배경 요소를 완전히 생략했습니다. 자전거에서 펠리칸의 위치는 대략적으로 정확하지만 디테일 작업이 부족합니다. 핸들바의 모양이 잘못되어 있고 깃털 질감이 거의 없고 목이 너무 두껍고 이미지에 없어야 할 흰색 타원형 인공물이 있습니다.</p>
<h2 id="How-to-Choose-Between-GLM-5-MiniMax-M25-and-Gemin-3-Deep-Think" class="common-anchor-header">GLM-5, MiniMax M2.5, Gemin 3 딥 씽크 중 선택하는 방법<button data-href="#How-to-Choose-Between-GLM-5-MiniMax-M25-and-Gemin-3-Deep-Think" class="anchor-icon" translate="no">
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
    </button></h2><p>모든 테스트에서 MiniMax M2.5가 출력 생성 속도가 가장 느려서 사고와 추론에 가장 오랜 시간이 필요했습니다. GLM-5는 일관된 성능을 보였으며 속도 면에서 제미니 3 딥 싱크와 거의 비슷한 수준이었습니다.</p>
<p>다음은 저희가 정리한 간단한 선택 가이드입니다:</p>
<table>
<thead>
<tr><th>핵심 사용 사례</th><th>추천 모델</th><th>주요 강점</th></tr>
</thead>
<tbody>
<tr><td>과학 연구, 고급 추론(물리학, 화학, 수학, 복잡한 알고리즘 설계)</td><td>Gemini 3 심층적 사고</td><td>학술 경연 대회에서 금메달을 수상한 경력이 있습니다. 최고 수준의 과학적 데이터 검증. Codeforces에서 세계 최고 수준의 경쟁 프로그래밍. 전문 논문의 논리적 결함을 식별하는 등 입증된 연구 애플리케이션. (현재 Google AI Ultra 구독자와 일부 엔터프라이즈 사용자로 제한되며, 작업당 비용이 상대적으로 높습니다.)</td></tr>
<tr><td>오픈 소스 배포, 엔터프라이즈 인트라넷 사용자 지정, 풀스택 개발, 오피스 기술 통합</td><td>Zhipu GLM-5</td><td>최상위 오픈 소스 모델. 강력한 시스템 수준 엔지니어링 기능. 관리 가능한 비용으로 로컬 배포를 지원합니다.</td></tr>
<tr><td>비용에 민감한 워크로드, 다국어 프로그래밍, 크로스 플랫폼 개발(웹/안드로이드/iOS/윈도우), 오피스 호환성.</td><td>MiniMax M2.5</td><td>100 TPS 기준: <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><annotation encoding="application/x-tex">입력 토큰 100만 개당</annotation><mrow><mn>0</mn></mrow></semantics></math></span></span>. <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><annotation encoding="application/x-tex">30,</annotation></semantics></math></span></span>출력 토큰 100만 개당 0. <span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord">30</span><span class="mpunct">,</span><span class="strut" style="height:0.8889em;vertical-align:-0.1944em;"></span></span></span></span>0. <span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord mathnormal">30</span><span class="mord">입력</span></span></span></span>토큰 100만 개당 2.40. 오피스, 코딩, 도구 호출 벤치마크 전반에서 SOTA. 멀티-SWE 벤치에서 1위를 차지했습니다. 강력한 일반화. Droid/OpenCode의 합격률은 Claude Opus 4.6을 초과합니다.</td></tr>
</tbody>
</table>
<h2 id="RAG-Tutorial-Wire-Up-GLM-5-with-Milvus-for-a-Knowledge-Base" class="common-anchor-header">RAG 튜토리얼: GLM-5와 Milvus를 연결하여 지식 기반 구축하기<button data-href="#RAG-Tutorial-Wire-Up-GLM-5-with-Milvus-for-a-Knowledge-Base" class="anchor-icon" translate="no">
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
    </button></h2><p>GLM-5와 MiniMax M2.5는 모두 <a href="https://openrouter.ai/">OpenRouter를</a> 통해 사용할 수 있습니다. 가입하고 <code translate="no">OPENROUTER_API_KEY</code> 에서 시작하세요.</p>
<p>이 튜토리얼에서는 Zhipu의 GLM-5를 예제 LLM으로 사용합니다. 대신 MiniMax를 사용하려면 모델 이름을 <code translate="no">minimax/minimax-m2.5</code> 로 바꾸면 됩니다.</p>
<h3 id="Dependencies-and-environment-setup" class="common-anchor-header">종속성 및 환경 설정</h3><p>pymilvus, openai, requests 및 tqdm을 최신 버전으로 설치하거나 업그레이드합니다:</p>
<pre><code translate="no">pip install --upgrade pymilvus openai requests tqdm 
<button class="copy-code-btn"></button></code></pre>
<p>이 튜토리얼에서는 LLM으로 GLM-5를 사용하고 임베딩 모델로 OpenAI의 텍스트 임베딩-3-small을 사용합니다.</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> os
os.<span class="hljs-property">environ</span>[<span class="hljs-string">&quot;OPENROUTER_API_KEY&quot;</span>] = <span class="hljs-string">&quot;**********&quot;</span> 
<button class="copy-code-btn"></button></code></pre>
<h3 id="Data-preparation" class="common-anchor-header">데이터 준비</h3><p>Milvus 2.4.x 문서의 FAQ 페이지를 비공개 지식 베이스로 사용합니다.</p>
<p>zip 파일을 다운로드하고 <code translate="no">milvus_docs</code> 폴더에 문서를 압축 해제합니다:</p>
<pre><code translate="no">wget https://github.com/milvus-io/milvus-docs/releases/download/v2<span class="hljs-number">.4</span><span class="hljs-number">.6</span>-preview/milvus_docs_2<span class="hljs-number">.4</span>.x_en.<span class="hljs-built_in">zip</span>
unzip -q milvus_docs_2<span class="hljs-number">.4</span>.x_en.<span class="hljs-built_in">zip</span> -d milvus_docs
<button class="copy-code-btn"></button></code></pre>
<p><code translate="no">milvus_docs/en/faq</code> 에서 모든 마크다운 파일을 로드합니다. <code translate="no">&quot;# &quot;</code> 에서 각 파일을 분할하여 주요 섹션별로 콘텐츠를 대략적으로 구분합니다:</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> glob <span class="hljs-keyword">import</span> glob
text_lines = []
<span class="hljs-keyword">for</span> file_path <span class="hljs-keyword">in</span> glob(<span class="hljs-string">&quot;milvus_docs/en/faq/*.md&quot;</span>, recursive=<span class="hljs-literal">True</span>):
    <span class="hljs-keyword">with</span> <span class="hljs-built_in">open</span>(file_path, <span class="hljs-string">&quot;r&quot;</span>) <span class="hljs-keyword">as</span> file:
        file_text = file.read()
    text_lines += file_text.split(<span class="hljs-string">&quot;# &quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="LLM-and-embedding-model-setup" class="common-anchor-header">LLM 및 임베딩 모델 설정</h3><p>LLM으로 GLM-5를 사용하고 임베딩 모델로 텍스트 임베딩-3-small을 사용하겠습니다:</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> openai <span class="hljs-keyword">import</span> <span class="hljs-title class_">OpenAI</span>
glm_client = <span class="hljs-title class_">OpenAI</span>(
    api_key=os.<span class="hljs-property">environ</span>[<span class="hljs-string">&quot;OPENROUTER_API_KEY&quot;</span>],
    base_url=<span class="hljs-string">&quot;https://openrouter.ai/api/v1&quot;</span>,
)
<button class="copy-code-btn"></button></code></pre>
<p>테스트 임베딩을 생성하고 치수와 처음 몇 개의 요소를 인쇄합니다:</p>
<pre><code translate="no">EMBEDDING_MODEL = <span class="hljs-string">&quot;openai/text-embedding-3-small&quot;</span>  <span class="hljs-comment"># OpenRouter embedding model</span>
resp = glm_client.embeddings.create(
    model=EMBEDDING_MODEL,
    <span class="hljs-built_in">input</span>=[<span class="hljs-string">&quot;This is a test1&quot;</span>, <span class="hljs-string">&quot;This is a test2&quot;</span>],
)
test_embeddings = [d.embedding <span class="hljs-keyword">for</span> d <span class="hljs-keyword">in</span> resp.data]
embedding_dim = <span class="hljs-built_in">len</span>(test_embeddings[<span class="hljs-number">0</span>])
<span class="hljs-built_in">print</span>(embedding_dim)
<span class="hljs-built_in">print</span>(test_embeddings[<span class="hljs-number">0</span>][:<span class="hljs-number">10</span>])
<button class="copy-code-btn"></button></code></pre>
<p>출력합니다:</p>
<pre><code translate="no"><span class="hljs-number">1536</span>
[<span class="hljs-meta">0.010637564584612846, -0.017222722992300987, 0.05409347265958786, -0.04377825930714607, -0.017545074224472046, -0.04196695610880852, -0.0011963422875851393, 0.03837504982948303, 0.0008855042979121208, 0.015181170776486397</span>]
<button class="copy-code-btn"></button></code></pre>
<h3 id="Load-data-into-Milvus" class="common-anchor-header">Milvus에 데이터 로드</h3><p><strong>컬렉션을 생성합니다:</strong></p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> <span class="hljs-title class_">MilvusClient</span>
milvus_client = <span class="hljs-title class_">MilvusClient</span>(uri=<span class="hljs-string">&quot;./milvus_demo.db&quot;</span>)
collection_name = <span class="hljs-string">&quot;my_rag_collection&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>MilvusClient 구성에 대한 참고 사항:</p>
<ul>
<li><p>URI를 로컬 파일(예: <code translate="no">./milvus.db</code>)로 설정하는 것이 가장 간단한 옵션입니다. 자동으로 Milvus Lite를 사용하여 해당 파일에 모든 데이터를 저장합니다.</p></li>
<li><p>대규모 데이터의 경우, 더 성능이 뛰어난 Milvus 서버를 Docker 또는 Kubernetes에 배포할 수 있습니다. 이 경우 서버 URI(예: <code translate="no">http://localhost:19530</code>)를 사용합니다.</p></li>
<li><p>질리즈 클라우드(Milvus의 완전 관리형 클라우드 버전)를 사용하려면, 질리즈 클라우드 콘솔에서 퍼블릭 엔드포인트와 API 키에 URI와 토큰을 설정합니다.</p></li>
</ul>
<p>컬렉션이 이미 존재하는지 확인하고 존재한다면 삭제합니다:</p>
<pre><code translate="no">if milvus_client.has_collection(collection_name):
    milvus_client.drop_collection(collection_name)
<button class="copy-code-btn"></button></code></pre>
<p>지정된 파라미터로 새 컬렉션을 생성합니다. 필드 정의를 제공하지 않으면 Milvus는 기본 <code translate="no">id</code> 필드를 기본 키로, 벡터 데이터의 경우 <code translate="no">vector</code> 필드를 자동으로 생성합니다. 예약 JSON 필드는 스키마에 정의되지 않은 모든 필드와 값을 저장합니다:</p>
<pre><code translate="no">milvus_client.<span class="hljs-title function_">create_collection</span>(
    collection_name=collection_name,
    dimension=embedding_dim,
    metric_type=<span class="hljs-string">&quot;COSINE&quot;</span>,
    consistency_level=<span class="hljs-string">&quot;Strong&quot;</span>,
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Insert-data" class="common-anchor-header">데이터 삽입</h3><p>텍스트 줄을 반복하고 임베딩을 생성한 다음 데이터를 Milvus에 삽입합니다. 여기서 <code translate="no">text</code> 필드는 스키마에 정의되어 있지 않습니다. Milvus의 예약된 JSON 필드에 의해 뒷받침되는 동적 필드로 자동 추가됩니다:</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> tqdm <span class="hljs-keyword">import</span> tqdm
data = []
resp = glm_client.embeddings.create(model=EMBEDDING_MODEL, <span class="hljs-built_in">input</span>=text_lines)
doc_embeddings = [d.embedding <span class="hljs-keyword">for</span> d <span class="hljs-keyword">in</span> resp.data]
<span class="hljs-keyword">for</span> i, line <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(tqdm(text_lines, desc=<span class="hljs-string">&quot;Creating embeddings&quot;</span>)):
    data.append({<span class="hljs-string">&quot;id&quot;</span>: i, <span class="hljs-string">&quot;vector&quot;</span>: doc_embeddings[i], <span class="hljs-string">&quot;text&quot;</span>: line})
milvus_client.insert(collection_name=collection_name, data=data)
<button class="copy-code-btn"></button></code></pre>
<p>Output:</p>
<pre><code translate="no">Creating embeddings: 100%|██████████████████████████| 72/72 [00:00&lt;00:00, 125203.10it/s]
{<span class="hljs-string">&#x27;insert_count&#x27;</span>: 72, <span class="hljs-string">&#x27;ids&#x27;</span>: [0, 1, 2, ..., 71], <span class="hljs-string">&#x27;cost&#x27;</span>: 0}
<button class="copy-code-btn"></button></code></pre>
<h3 id="Build-the-RAG-pipeline" class="common-anchor-header">RAG 파이프라인 구축</h3><p><strong>관련 문서를 검색합니다:</strong></p>
<p>Milvus에 대한 일반적인 질문을 해 봅시다:</p>
<pre><code translate="no">question = <span class="hljs-string">&quot;How is data stored in milvus?&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>컬렉션에서 가장 관련성이 높은 상위 3개의 결과를 검색합니다:</p>
<pre><code translate="no">resp = glm_client.embeddings.create(model=EMBEDDING_MODEL, <span class="hljs-built_in">input</span>=[question])
question_embedding = resp.data[<span class="hljs-number">0</span>].embedding
search_res = milvus_client.search(
    collection_name=collection_name,
    data=[question_embedding],
    limit=<span class="hljs-number">3</span>,
    search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;COSINE&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {}},
    output_fields=[<span class="hljs-string">&quot;text&quot;</span>],
)
<button class="copy-code-btn"></button></code></pre>
<p>결과는 거리별로 정렬되며 가장 가까운 것부터 정렬됩니다:</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> json

retrieved_lines_with_distances = [
    (res[<span class="hljs-string">&quot;entity&quot;</span>][<span class="hljs-string">&quot;text&quot;</span>], res[<span class="hljs-string">&quot;distance&quot;</span>]) <span class="hljs-keyword">for</span> res <span class="hljs-keyword">in</span> search_res[<span class="hljs-number">0</span>]
]
<span class="hljs-built_in">print</span>(json.dumps(retrieved_lines_with_distances, indent=<span class="hljs-number">4</span>))

[
    [
        <span class="hljs-string">&quot; Where does Milvus store data?\n\nMilvus deals with two types of data, inserted data and metadata. \n\nInserted data, including vector data, scalar data, and collection-specific schema, are stored in persistent storage as incremental log. Milvus supports multiple object storage backends, including MinIO, AWS S3, Google Cloud Storage (GCS), Azure Blob Storage, Alibaba Cloud OSS, and Tencent Cloud Object Storage (COS).\n\nMetadata are generated within Milvus. Each Milvus module has its own metadata that are stored in etcd.\n\n###&quot;</span>,
        <span class="hljs-number">0.7826977372169495</span>
    ],
    [
        <span class="hljs-string">&quot;How does Milvus handle vector data types and precision?\n\nMilvus supports Binary, Float32, Float16, and BFloat16 vector types.\n\n- Binary vectors: Store binary data as sequences of 0s and 1s, used in image processing and information retrieval.\n- Float32 vectors: Default storage with a precision of about 7 decimal digits. Even Float64 values are stored with Float32 precision, leading to potential precision loss upon retrieval.\n- Float16 and BFloat16 vectors: Offer reduced precision and memory usage. Float16 is suitable for applications with limited bandwidth and storage, while BFloat16 balances range and efficiency, commonly used in deep learning to reduce computational requirements without significantly impacting accuracy.\n\n###&quot;</span>,
        <span class="hljs-number">0.6772387027740479</span>
    ],
    [
        <span class="hljs-string">&quot;How much does Milvus cost?\n\nMilvus is a 100% free open-source project.\n\nPlease adhere to Apache License 2.0 when using Milvus for production or distribution purposes.\n\nZilliz, the company behind Milvus, also offers a fully managed cloud version of the platform for those that don&#x27;t want to build and maintain their own distributed instance. Zilliz Cloud automatically maintains data reliability and allows users to pay only for what they use.\n\n###&quot;</span>,
        <span class="hljs-number">0.6467022895812988</span>
    ]
]
<button class="copy-code-btn"></button></code></pre>
<p><strong>LLM으로 응답을 생성합니다:</strong></p>
<p>검색된 문서를 컨텍스트 문자열로 결합합니다:</p>
<pre><code translate="no">context = <span class="hljs-string">&quot;\n&quot;</span>.<span class="hljs-keyword">join</span>(
    [<span class="hljs-meta">line_with_distance[0</span>] <span class="hljs-keyword">for</span> line_with_distance <span class="hljs-keyword">in</span> retrieved_lines_with_distances]
)
<button class="copy-code-btn"></button></code></pre>
<p>시스템 및 사용자 프롬프트 설정 사용자 프롬프트는 Milvus에서 검색된 문서를 기반으로 구축됩니다:</p>
<pre><code translate="no">SYSTEM_PROMPT = <span class="hljs-string">&quot;&quot;&quot;
Human: You are an AI assistant. You can find answers to the questions in the contextual passage snippets provided.
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
<p>최종 답변을 생성하려면 GLM-5를 호출합니다:</p>
<pre><code translate="no">response = glm_client.chat.completions.create(
    model=<span class="hljs-string">&quot;z-ai/glm-5&quot;</span>,
    messages=[
        {<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;system&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: SYSTEM_PROMPT},
        {<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: USER_PROMPT},
    ],
)
<span class="hljs-built_in">print</span>(response.choices[<span class="hljs-number">0</span>].message.content)
<button class="copy-code-btn"></button></code></pre>
<p>GLM-5는 잘 구조화된 답변을 반환합니다:</p>
<pre><code translate="no">Based <span class="hljs-keyword">on</span> the provided context, Milvus stores data <span class="hljs-keyword">in</span> two main ways, depending <span class="hljs-keyword">on</span> the data type:

<span class="hljs-number">1.</span> Inserted Data
   - What it includes: vector data, scalar data, <span class="hljs-keyword">and</span> collection-specific schema.
   - How it <span class="hljs-keyword">is</span> stored: <span class="hljs-keyword">in</span> persistent storage <span class="hljs-keyword">as</span> an incremental log.
   - Storage Backends: Milvus supports multiple <span class="hljs-built_in">object</span> storage backends, including MinIO, AWS S3, <span class="hljs-function">Google Cloud <span class="hljs-title">Storage</span> (<span class="hljs-params">GCS</span>), Azure Blob Storage, Alibaba Cloud OSS, <span class="hljs-keyword">and</span> Tencent Cloud Object <span class="hljs-title">Storage</span> (<span class="hljs-params">COS</span>).
   - Vector Specifics: vector data can be stored <span class="hljs-keyword">as</span> Binary <span class="hljs-title">vectors</span> (<span class="hljs-params">sequences of <span class="hljs-number">0</span>s <span class="hljs-keyword">and</span> <span class="hljs-number">1</span>s</span>), Float32 <span class="hljs-title">vectors</span> (<span class="hljs-params"><span class="hljs-literal">default</span> storage</span>), <span class="hljs-keyword">or</span> Float16 <span class="hljs-keyword">and</span> BFloat16 <span class="hljs-title">vectors</span> (<span class="hljs-params">offering reduced precision <span class="hljs-keyword">and</span> memory usage</span>).

2. Metadata
   - What it includes: data generated within Milvus modules.
   - How it <span class="hljs-keyword">is</span> stored: <span class="hljs-keyword">in</span> etcd.
</span><button class="copy-code-btn"></button></code></pre>
<h2 id="Conclusion-Pick-the-Model-Then-Build-the-Pipeline" class="common-anchor-header">결론: 모델을 선택한 다음 파이프라인 구축하기<button data-href="#Conclusion-Pick-the-Model-Then-Build-the-Pipeline" class="anchor-icon" translate="no">
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
    </button></h2><p>세 가지 모델 모두 강점이 있지만 서로 다른 부분에 강점이 있습니다. 비용보다 추론의 깊이가 더 중요할 때는 Gemini 3 Deep Think를 선택하는 것이 좋습니다. GLM-5는 로컬 배포 및 시스템 수준 엔지니어링이 필요한 팀에 가장 적합한 오픈 소스 옵션입니다. 미니맥스 M2.5는 프로덕션 워크로드 전반의 처리량과 예산을 최적화할 때 적합합니다.</p>
<p>어떤 모델을 선택하느냐는 방정식의 절반에 불과합니다. 이 모든 것을 유용한 애플리케이션으로 전환하려면 데이터에 따라 확장할 수 있는 검색 계층이 필요합니다. 바로 여기에 Milvus가 적합합니다. 위의 RAG 튜토리얼은 모든 OpenAI 호환 모델에서 작동하므로 GLM-5, MiniMax M2.5 또는 향후 릴리스 간에 한 줄만 변경하면 교체할 수 있습니다.</p>
<p>로컬 또는 온프레미스 AI 에이전트를 설계 중이고 스토리지 아키텍처, 세션 설계 또는 안전한 롤백에 대해 더 자세히 논의하고 싶다면 언제든지 <a href="https://milvusio.slack.com/join/shared_invite/zt-3nntzngkz-gYwhrdSE4~76k0VMyBfD1Q#/shared-invite/email">Slack 채널에</a> 참여하세요. 또한 <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">Milvus 오피스 아워를</a> 통해 20분간 일대일 상담을 예약하여 개인화된 안내를 받을 수도 있습니다.</p>
<p>AI 에이전트 구축에 대해 더 자세히 알아보고 싶다면 시작에 도움이 되는 더 많은 리소스를 참조하세요.</p>
<ul>
<li><p><a href="https://milvus.io/blog/how-to-build-productionready-multiagent-systems-with-agno-and-milvus.md">아그노와 Milvus로 프로덕션 준비 완료된 멀티 에이전트 시스템을 구축하는 방법</a></p></li>
<li><p><a href="https://zilliz.com/learn">RAG 파이프라인에 적합한 임베딩 모델 선택하기</a></p></li>
<li><p><a href="https://zilliz.com/learn">Milvus로 AI 에이전트를 빌드하는 방법</a></p></li>
<li><p><a href="https://milvus.io/blog/openclaw-formerly-clawdbot-moltbot-explained-a-complete-guide-to-the-autonomous-ai-agent.md">오픈클로란 무엇인가요? 오픈 소스 AI 에이전트에 대한 전체 가이드</a></p></li>
<li><p><a href="https://milvus.io/blog/stepbystep-guide-to-setting-up-openclaw-previously-clawdbotmoltbot-with-slack.md">OpenClaw 튜토리얼: 로컬 AI 어시스턴트를 위해 Slack에 연결하기</a></p></li>
<li><p><a href="https://milvus.io/blog/clawdbot-long-running-ai-agents-langgraph-milvus.md">LangGraph 및 Milvus로 클로봇 스타일의 AI 에이전트 구축하기</a></p></li>
</ul>
