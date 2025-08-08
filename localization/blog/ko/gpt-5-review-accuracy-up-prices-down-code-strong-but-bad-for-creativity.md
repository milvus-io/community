---
id: gpt-5-review-accuracy-up-prices-down-code-strong-but-bad-for-creativity.md
title: 'GPT-5 검토: 정확도는 높이고, 가격은 낮추고, 코드는 강력하지만 창의성에는 좋지 않음'
author: Lumina Wang
date: 2025-08-08T00:00:00.000Z
cover: assets.zilliz.com/gpt_5_review_7df71f395a.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, OpenAI, gpt-5'
meta_keywords: 'Milvus, gpt-5, openai, chatgpt'
meta_title: |
  GPT-5 Review: Accuracy Up, Prices Down, Code Strong, Bad Creativity
desc: 특히 에이전트와 RAG 파이프라인을 구축하는 개발자에게는 이번 릴리스가 조용히 가장 유용한 업그레이드가 될 수 있습니다.
origin: >-
  https://milvus.io/blog/gpt-5-review-accuracy-up-prices-down-code-strong-but-bad-for-creativity.md
---
<p><strong>몇 달간의 추측 끝에 마침내 OpenAI가</strong> <a href="https://openai.com/gpt-5/"><strong>GPT-5를</strong></a><strong>출시했습니다</strong><strong>.</strong> 이 모델은 GPT-4처럼 창의적인 번개는 아니지만, 개발자, 특히 에이전트와 RAG 파이프라인을 구축하는 개발자에게는 이번 릴리스가 조용히 가장 유용한 업그레이드가 될 수 있습니다.</p>
<p><strong>빌더를 위한 요약 정보:</strong> GPT-5는 아키텍처를 통합하고, 멀티모달 I/O를 강화하며, 실제 오류율을 줄이고, 컨텍스트를 40만 토큰으로 확장하고, 대규모 사용을 경제적으로 가능하게 합니다. 하지만 창의성과 문학적 감각은 눈에 띄게 후퇴했습니다.</p>
<h2 id="What’s-New-Under-the-Hood" class="common-anchor-header">새로운 기능은 무엇인가요?<button data-href="#What’s-New-Under-the-Hood" class="anchor-icon" translate="no">
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
<li><p><strong>통합 코어</strong> - GPT 디지털 시리즈와 o 시리즈 추론 모델을 병합하여 단일 아키텍처에서 롱체인 추론과 멀티모달을 제공합니다.</p></li>
<li><p><strong>풀 스펙트럼 멀티모달</strong> - 동일한 모델 내에서 텍스트, 이미지, 오디오, 비디오의 입/출력을 모두 지원합니다.</p></li>
<li><p><strong>엄청난 정확도 향상</strong>:</p>
<ul>
<li><p><code translate="no">gpt-5-main</code>: GPT-4o 대비 사실 오류 44% 감소.</p></li>
<li><p><code translate="no">gpt-5-thinking</code>o3 대비 사실 오류 78% 감소.</p></li>
</ul></li>
<li><p><strong>도메인 기술 향상</strong> - 코드 생성, 수학적 추론, 건강 상담, 구조화된 글쓰기에서 더 강해졌으며 환각이 크게 감소했습니다.</p></li>
</ul>
<p>OpenAI는 GPT-5와 함께 각기 다른 요구사항에 최적화된 <strong>세 가지 변형을 추가로</strong> 출시했습니다:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/gpt_5_family_99a9bee18a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<table>
<thead>
<tr><th><strong>모델</strong></th><th><strong>설명</strong></th><th><strong>입력 / 1백만 토큰당 $</strong></th><th><strong>출력 / 1백만 토큰당 $</strong></th><th><strong>지식 업데이트</strong></th></tr>
</thead>
<tbody>
<tr><td>gpt-5</td><td>메인 모델, 롱체인 추론 + 풀 멀티모달</td><td>$1.25</td><td>$10.00</td><td>2024-10-01</td></tr>
<tr><td>gpt-5-chat</td><td>gpt-5와 동급, ChatGPT 대화에 사용됨</td><td>-</td><td>-</td><td>2024-10-01</td></tr>
<tr><td>gpt-5-mini</td><td>60% 저렴, 프로그래밍 성능의 ~90% 유지</td><td>$0.25</td><td>$2.00</td><td>2024-05-31</td></tr>
<tr><td>GPT-5-NANO</td><td>에지/오프라인, 32K 컨텍스트, 지연 시간 &lt;40ms</td><td>$0.05</td><td>$0.40</td><td>2024-05-31</td></tr>
</tbody>
</table>
<p>GPT-5는 코드 복구부터 멀티모달 추론, 의료 작업에 이르기까지 25개의 벤치마크 카테고리에서 지속적인 정확도 향상으로 기록을 경신했습니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/benchmark_1_8ebf1bed4b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/benchmark_2_c43781126f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Why-Developers-Should-Care--Especially-for-RAG--Agents" class="common-anchor-header">개발자가 관심을 가져야 하는 이유 - 특히 RAG 및 에이전트<button data-href="#Why-Developers-Should-Care--Especially-for-RAG--Agents" class="anchor-icon" translate="no">
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
    </button></h2><p>실제 테스트 결과, 이번 릴리즈는 검색 증강 세대와 에이전트 중심 워크플로우에 조용한 혁명을 일으킬 것으로 예상됩니다.</p>
<ol>
<li><p><strong>가격 인하로</strong> 실험이 가능해졌습니다 - API 입력 비용: <strong><span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><annotation encoding="application/x-tex">백만 토큰당</annotation><mrow><mn>1.</mn><mo>25달러∗</mo><mo separator="true">;</mo><mi>출력</mi><mi>비용</mi><mo>:</mo></mrow><annotation encoding="application/x-tex">백만 토큰당</annotation></semantics></math></span></span></strong> <strong><span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mo>1</mo></mrow></semantics></math></span></span></strong>. <strong><span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><annotation encoding="application/x-tex">25달러**; 출력 비용: **</annotation></semantics></math></span></span></strong><span class="strut" style="height:0.8889em;vertical-align:-0.1944em;"></span> 1. <strong><span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord mathnormal">25퍼밀리언토큰</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">∗</span></span></span></span></strong><span class="mspace" style="margin-right:0.2222em;"></span> <strong><span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.8095em;vertical-align:-0.1944em;"></span> ∗</span></span></span></strong> <strong><span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mpunct">;</span><span class="mspace" style="margin-right:0.1667em;"></span><span class="mord mathnormal">outputcost</span><span class="mspace" style="margin-right:0.2778em;"></span></span></span></span></strong>: <strong><span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:0.4653em;"></span><span class="mord">∗∗10</span></span></span></span></strong>.</p></li>
<li><p><strong>400k 컨텍스트 창</strong> (o3/4o의 128k 대비)을 사용하면 복잡한 다단계 에이전트 워크플로에서 컨텍스트를 잘라내지 않고도 상태를 유지할 수 있습니다.</p></li>
<li><p><strong>환각 감소 및 도구 사용 개선</strong> - 다단계 연쇄 도구 호출을 지원하고 복잡한 비표준 작업을 처리하며 실행 안정성을 개선합니다.</p></li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/gpt_tool_call_e6a86fc59c.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Not-Without-Flaws" class="common-anchor-header">결함이 없는 것은 아닙니다<button data-href="#Not-Without-Flaws" class="anchor-icon" translate="no">
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
    </button></h2><p>기술적 발전에도 불구하고 GPT-5는 여전히 분명한 한계를 보여줍니다.</p>
<p>출시 당시 OpenAI의 기조연설에서는 <em>52.8 &gt; 69.1 = 30.8이라는</em> 기괴한 계산이 담긴 슬라이드가 등장했고, 자체 테스트에서 이 모델은 비행기 양력에 대한 교과서적이지만 잘못된 '베르누이 효과' 설명을 자신 있게 반복하여 <strong>진정한 도메인 전문가가 아닌 패턴 학습자라는</strong> 사실을 상기시켜주었습니다.</p>
<p><strong>STEM 성능은 향상되었지만 창의적 깊이는 떨어졌습니다.</strong> 많은 오랜 사용자들은 시가 더 평이하게 느껴지고, 철학적 대화는 미묘한 차이가 줄어들고, 긴 형식의 내러티브는 더 기계적으로 느껴지는 등 문학적 감각이 떨어졌다고 지적합니다. 사실적 정확성이 높아지고 기술적 영역에서 추론력이 강화되었지만, 한때 GPT를 거의 인간적으로 느끼게 했던 교묘하고 탐구적인 어조는 사라졌습니다.</p>
<p>이를 염두에 두고 실제 테스트에서 GPT-5가 실제로 어떤 성능을 보이는지 살펴봅시다.</p>
<h2 id="Coding-Tests" class="common-anchor-header">코딩 테스트<button data-href="#Coding-Tests" class="anchor-icon" translate="no">
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
    </button></h2><p>사용자가 이미지를 업로드하고 마우스로 이동할 수 있는 HTML 스크립트를 작성하는 간단한 작업부터 시작했습니다. GPT-5는 약 9초 동안 일시 정지한 후 상호 작용을 잘 처리하는 작동 코드를 생성했습니다. 좋은 시작이라고 느꼈습니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/gpt52_7b04c9b41b.gif" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>두 번째 과제는 회전하는 육각형 안에서 회전 속도, 탄성, 공 수를 조절할 수 있는 다각형-공 충돌 감지를 구현하는 더 어려운 과제였습니다. GPT-5는 약 13초 만에 첫 번째 버전을 생성했습니다. 코드에는 예상되는 모든 기능이 포함되어 있었지만 버그가 있어 실행되지 않았습니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/image_6_3e6a34572a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>그런 다음 에디터의 <strong>버그 수정</strong> 옵션을 사용했고 GPT-5는 오류를 수정하여 육각형이 렌더링되도록 했습니다. 하지만 공은 나타나지 않았고, 스폰 로직이 누락되거나 잘못되어 설정이 완료되었음에도 불구하고 프로그램의 핵심 기능이 작동하지 않았습니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/gpt51_6489df9914.gif" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>요약하자면</strong>, GPT-5는 깔끔하고 구조화된 대화형 코드를 생성하고 간단한 런타임 오류를 복구할 수 있습니다. 하지만 복잡한 시나리오에서는 여전히 필수 로직이 누락될 위험이 있으므로 배포 전에 사람의 검토와 반복이 필요합니다.</p>
<h2 id="Reasoning-Test" class="common-anchor-header">추론 테스트<button data-href="#Reasoning-Test" class="anchor-icon" translate="no">
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
    </button></h2><p>아이템 색상, 가격, 위치 단서가 포함된 다단계 논리 퍼즐을 제시했는데, 대부분의 사람이 푸는 데 몇 분 정도 걸릴 수 있는 문제였습니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/reasoning_test_7ea15ed25b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>질문:</strong> <em>파란색 아이템은 무엇이며 가격은 얼마인가요?</em></p>
<p>GPT-5는 명확하고 논리적인 설명과 함께 단 9초 만에 정답을 맞혔습니다. 이 테스트를 통해 구조화된 추론과 빠른 추론에 대한 모델의 강점을 확인할 수 있었습니다.</p>
<h2 id="Writing-Test" class="common-anchor-header">작문 테스트<button data-href="#Writing-Test" class="anchor-icon" translate="no">
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
    </button></h2><p>저는 블로그, 소셜 미디어 게시물 및 기타 서면 콘텐츠에 대한 도움을 받기 위해 ChatGPT를 자주 이용하기 때문에 텍스트 생성은 제가 가장 중요하게 생각하는 기능 중 하나입니다. 이 테스트에서는 GPT-5에게 Milvus 2.6의 다국어 분석기에 대한 블로그를 기반으로 LinkedIn 게시물을 작성하도록 요청했습니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Writing_Test_4fe5fef775.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>결과물은 잘 정리되어 있었고 원래 블로그의 모든 핵심 사항을 다루고 있었지만 소셜 피드에서 관심을 불러일으키기보다는 기업 보도 자료처럼 너무 형식적이고 예측 가능한 느낌이 들었습니다. 게시물을 인간적이고 매력적으로 느끼게 하는 따뜻함, 리듬, 개성이 부족했습니다.</p>
<p>반면에 함께 첨부된 일러스트레이션은 명확하고 브랜드에 부합하며 Zilliz의 기술 스타일과 완벽하게 일치하는 등 훌륭했습니다. 시각적으로도 훌륭했지만 글에 조금 더 창의적인 에너지가 필요했을 뿐입니다.</p>
<h2 id="Longer-Context-Window--Death-of-RAG-and-VectorDB" class="common-anchor-header">더 긴 컨텍스트 창 = RAG와 VectorDB의 죽음?<button data-href="#Longer-Context-Window--Death-of-RAG-and-VectorDB" class="anchor-icon" translate="no">
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
    </button></h2><p>이 주제는 작년에 <a href="https://zilliz.com/blog/will-retrieval-augmented-generation-RAG-be-killed-by-long-context-LLMs">Google이</a> 초장거리 1000만 토큰 컨텍스트 창을 갖춘 <a href="https://zilliz.com/blog/will-retrieval-augmented-generation-RAG-be-killed-by-long-context-LLMs"> <strong>Gemini 1.5 Pro를</strong> 출시했을</a> 때 다뤄본 적이 있습니다. 당시 일부 사람들은 RAG의 종말, 심지어 데이터베이스의 종말을 빠르게 예측하기도 했습니다. 하지만 오늘날까지 RAG는 여전히 살아 있을 뿐만 아니라 번창하고 있습니다. 실제로는 <a href="https://milvus.io/"><strong>Milvus</strong></a> 및 <a href="https://zilliz.com/cloud"><strong>Zilliz Cloud와</strong></a> 같은 벡터 데이터베이스와 함께 <em>더욱 뛰어난</em> 성능과 생산성을 갖추게 되었습니다.</p>
<p>이제 GPT-5의 확장된 컨텍스트 길이와 고급 도구 호출 기능으로 인해 이 질문이 다시 등장했습니다: <em>컨텍스트 수집을 위해 벡터 데이터베이스나 전용 에이전트/RAG 파이프라인이 여전히 필요할까요?</em></p>
<p><strong>짧은 대답은 '그렇다'입니다. 여전히 필요합니다.</strong></p>
<p>더 긴 컨텍스트는 유용하지만 구조화된 검색을 대체할 수는 없습니다. 멀티 에이전트 시스템은 여전히 장기적인 아키텍처 트렌드로 자리 잡고 있으며, 이러한 시스템에는 사실상 무제한의 컨텍스트가 필요한 경우가 많습니다. 또한 비공개 비정형 데이터를 안전하게 관리하는 데 있어서는 벡터 데이터베이스가 항상 최종 게이트키퍼가 될 것입니다.</p>
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
    </button></h2><p>OpenAI의 출시 행사를 지켜보고 직접 테스트를 실행해 본 결과, GPT-5는 극적인 도약이라기보다는 과거의 강점을 몇 가지 잘 배치된 업그레이드와 세련되게 조합한 것처럼 느껴졌습니다. 이는 대형 모델이 직면하기 시작한 아키텍처 및 데이터 품질 한계를 보여주는 신호입니다.</p>
<p>' <em>기대가 크</em>면 <em>실망도 크다'</em>는 속담이 있듯이, <em>기대가 크면 비판도</em> 커집니다. GPT-5에 대한 실망은 대부분 OpenAI가 스스로 설정한 매우 높은 기준에서 비롯됩니다. 그리고 정말 더 나은 정확도, 저렴한 가격, 통합된 멀티모달 지원은 여전히 가치 있는 승리입니다. 에이전트와 RAG 파이프라인을 구축하는 개발자에게는 지금까지 가장 유용한 업그레이드가 될 수도 있습니다.</p>
<p>일부 친구들은 GPT-4o를 위한 '온라인 추모관'을 만들자고 농담을 하며 예전 채팅 동반자의 개성이 영원히 사라졌다고 주장하기도 합니다. 저는 이 변화가 마음에 듭니다. GPT-5는 따뜻하고 수다스러운 느낌은 덜하지만, 직설적이고 말도 안 되는 스타일이 신선하고 직설적으로 느껴집니다.</p>
<p><strong>여러분은 어떠신가요?</strong> 여러분의 생각을 공유해 주세요. <a href="https://discord.com/invite/8uyFbECzPX">Discord에</a> 참여하거나 <a href="https://www.linkedin.com/company/the-milvus-project/">LinkedIn과</a> <a href="https://x.com/milvusio">X에서</a> 대화에 참여하세요.</p>
