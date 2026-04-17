---
id: >-
  build-a-bestseller-to-image-pipeline-for-e-commerce-with-nano-banana-2-milvus-qwen-35.md
title: 나노 바나나 2 + 밀버스 + 퀀 3.5로 이커머스용 베스트셀러-이미지 파이프라인 구축하기
author: Lumina Wang
date: 2026-3-3
cover: assets.zilliz.com/blog-images/20260303-100432.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: >-
  Nano Banana 2, Milvus, e-commerce AI image generation, AI product photography,
  vector search
meta_keywords: >-
  Nano Banana 2, Milvus, e-commerce AI image generation, AI product photography,
  vector search
meta_title: |
  Nano Banana 2 + Milvus: E-Commerce AI Image Generation Tutorial
desc: >-
  단계별 튜토리얼: 나노 바나나 2, Milvus 하이브리드 검색, Qwen 3.5를 사용하여 1/3의 비용으로 플랫 레이아웃에서 전자상거래
  제품 사진을 생성할 수 있습니다.
origin: >-
  https://milvus.io/blog/build-a-bestseller-to-image-pipeline-for-e-commerce-with-nano-banana-2-milvus-qwen-35.md
---
<p>이커머스 판매자를 위한 AI 툴을 개발하는 사람이라면 이런 요청을 수천 번은 들어보셨을 것입니다: "새로운 제품이 있습니다. 베스트셀러 목록에 올릴 만한 홍보용 이미지를 만들어 주세요. 사진작가나 스튜디오 없이 저렴하게 만들어주세요."</p>
<p>이것이 바로 이 문장의 문제입니다. 판매자는 평면적인 사진과 이미 전환된 베스트셀러 카탈로그를 가지고 있습니다. 판매자는 이 두 가지를 AI를 통해 빠르고 대규모로 연결하고자 합니다.</p>
<p>Google은 2026년 2월 26일에 나노 바나나 2(Gemini 3.1 플래시 이미지)를 출시했을 때, 같은 날 테스트하여 기존 Milvus 기반 검색 파이프라인에 통합했습니다. 그 결과, 총 이미지 생성 비용은 이전의 약 3분의 1 수준으로 떨어졌고 처리량은 두 배로 증가했습니다. 이미지당 가격 인하(나노 바나나 프로보다 약 50% 저렴)가 그 중 일부를 차지하지만, 더 큰 절감 효과는 재작업 주기를 완전히 없앤 데서 비롯됩니다.</p>
<p>이 글에서는 이커머스에 적합한 나노 바나나 2의 장점과 아직 부족한 부분을 살펴보고, 전체 파이프라인에 대한 실습 튜토리얼을 안내합니다: 시각적으로 유사한 베스트셀러를 찾기 위한 <strong>Milvus</strong> 하이브리드 검색, 스타일 분석을 위한 <strong>Qwen</strong> 3.5, 최종 세대를 위한 <strong>Nano Banana 2에</strong> 대해 알아봅니다.</p>
<h2 id="What’s-New-with-Nano-Banana-2" class="common-anchor-header">나노 바나나 2의 새로운 기능은 무엇인가요?<button data-href="#What’s-New-with-Nano-Banana-2" class="anchor-icon" translate="no">
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
    </button></h2><p>나노 바나나 2(제미니 3.1 플래시 이미지)는 2026년 2월 26일에 출시되었습니다. 나노 바나나 프로의 대부분의 기능을 플래시 아키텍처에 적용하여 더 낮은 가격대로 더 빠르게 생성할 수 있습니다. 주요 업그레이드 사항은 다음과 같습니다:</p>
<ul>
<li><strong>플래시 속도의 프로급 품질.</strong> 나노 바나나 2는 이전에는 프로에서만 가능했던 세계 최고 수준의 지식, 추론, 시각적 충실도를 플래시의 지연 시간 및 처리량으로 제공합니다.</li>
<li><strong>512픽셀에서 4K 출력.</strong> 네 가지 해상도 티어(512px, 1K, 2K, 4K)가 기본적으로 지원됩니다. 512px 티어는 Nano Banana 2에 새롭게 추가된 기능입니다.</li>
<li><strong>14가지 화면비.</strong> 기존 세트(1:1, 2:3, 3:2, 3:4, 4:3, 4:5, 5:4, 9:16, 16:9, 21:9)에 4:1, 1:4, 8:1, 1:8이 추가되었습니다.</li>
<li><strong>최대 14개의 참조 이미지.</strong> 단일 워크플로우에서 최대 5개의 문자에 대해 문자 유사성을 유지하고 최대 14개의 개체에 대해 개체 충실도를 유지합니다.</li>
<li><strong>향상된 텍스트 렌더링.</strong> 단일 세대 내에서 번역 및 로컬라이제이션을 지원하여 여러 언어에 걸쳐 읽기 쉽고 정확한 이미지 내 텍스트를 생성합니다.</li>
<li><strong>이미지 검색 근거.</strong> Google 검색에서 실시간 웹 데이터와 이미지를 가져와 실제 피사체를 더욱 정확하게 묘사합니다.</li>
<li><strong>~이미지당 최대 50% 저렴.</strong> 1K 해상도 기준: <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mn>0.067</mn></mrow><annotation encoding="application/x-tex">대 Pro의</annotation><mrow><mi>0</mi><mn>.</mn></mrow><annotation encoding="application/x-tex">067</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.7519em;"></span></span></span></span>0 <span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord">.</span><span class="mord"><span class="mord mathnormal">067</span></span></span></span><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><annotation encoding="application/x-tex">대</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord">Pro</span></span></span></span><span class="pstrut" style="height:2.7em;"></span> <span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord mathnormal">′s0</span></span></span></span>.134.</li>
</ul>
<p><strong>나노 바나노 2의 재미있는 사용 사례: 간단한 Google 지도 스크린샷을 기반으로 위치 인식 파노라마 생성하기</strong></p>
<p>Google 지도 스크린샷과 스타일 프롬프트가 주어지면 모델은 지리적 컨텍스트를 인식하고 올바른 공간 관계를 유지하는 파노라마를 생성합니다. 스톡 사진을 사용하지 않고 지역 타겟 광고 크리에이티브(파리의 카페 배경, 도쿄 거리 풍경)를 제작하는 데 유용합니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog-images/image5.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>


  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog-images/image8.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>전체 기능에 대한 자세한 내용은 <a href="https://blog.google/innovation-and-ai/technology/ai/nano-banana-2/">Google의 발표 블로그와</a> <a href="https://ai.google.dev/gemini-api/docs/image-generation">개발자 문서를</a> 참조하세요.</p>
<h2 id="What-Does-This-Nano-Banana-Update-Mean-For-E-Commerce" class="common-anchor-header">이 나노 바나나 업데이트는 전자상거래에 어떤 의미가 있나요?<button data-href="#What-Does-This-Nano-Banana-Update-Mean-For-E-Commerce" class="anchor-icon" translate="no">
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
    </button></h2><p>전자상거래는 가장 이미지 집약적인 산업 중 하나입니다. 제품 목록, 마켓플레이스 광고, 소셜 크리에이티브, 배너 캠페인, 현지화된 상점 첫 화면 등 모든 채널에는 각각 고유한 사양을 갖춘 시각적 자산이 지속적으로 필요합니다.</p>
<p>이커머스에서 AI 이미지 생성을 위한 핵심 요구 사항은 다음과 같이 요약됩니다:</p>
<ul>
<li><strong>낮은 비용 유지</strong> - 이미지당 비용은 카탈로그 규모에서 작동해야 합니다.</li>
<li><strong>검증된 베스트셀러의 이미지와 일치</strong> - 새로운 이미지는 이미 전환된 목록의 시각적 스타일과 일치해야 합니다.</li>
<li>저작권<strong>침해 방지</strong> - 경쟁사의 크리에이티브를 복사하거나 보호 대상 자산을 재사용하지 않습니다.</li>
</ul>
<p>또한 해외 판매자에게는 다음이 필요합니다:</p>
<ul>
<li><strong>멀티플랫폼 형식 지원</strong> - 마켓플레이스, 광고, 상점의 다양한 화면 비율과 사양을 지원합니다.</li>
<li><strong>다국어 텍스트 렌더링</strong> - 여러 언어에 걸쳐 깔끔하고 정확한 이미지 내 텍스트를 제공합니다.</li>
</ul>
<p>나노 바나나 2는 모든 상자를 거의 모두 충족합니다. 아래 섹션에서는 각 업그레이드가 실제로 어떤 의미를 갖는지, 즉 이커머스의 문제점을 직접적으로 해결하는 부분과 부족한 부분, 실제 비용에 미치는 영향에 대해 자세히 설명합니다.</p>
<h3 id="Cut-Output-Generation-Costs-by-Up-to-60" class="common-anchor-header">출력 생성 비용 최대 60% 절감</h3><p>1K 해상도에서 나노 바나나 2의 <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><annotation encoding="application/x-tex">이미지당</annotation></semantics></math></span></span>비용은 <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mn>0.</mn><mi>067달러로</mi></mrow><annotation encoding="application/x-tex">프로의</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.9463em;vertical-align:-0.1944em;"></span></span></span></span>0 <span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord">.</span><span class="mord"><span class="mord mathnormal">067달러</span></span><span class="mord">, 프로</span></span></span></span><span class="pstrut" style="height:2.7em;"></span> 0. <span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord mathnormal">134달러에</span></span></span></span>비해 약 50% 절감됩니다. 하지만 이미지당 가격은 절반에 불과합니다. 사용자 예산을 죽이던 것은 재작업이었습니다. 모든 마켓플레이스는 자체적인 이미지 사양(아마존의 경우 1:1, Shopify 스토어 프론트의 경우 3:4, 배너 광고의 경우 울트라와이드)을 적용하고 있으며, 각 변형을 제작하려면 실패 모드가 있는 별도의 세대별 패스를 사용해야 했습니다.</p>
<p>나노 바나나 2는 이러한 추가 패스를 하나로 통합합니다.</p>
<ul>
<li><p><strong>네 가지 기본 해상도 계층.</strong></p></li>
<li><p>512픽셀 ($0.045)</p></li>
<li><p>1K ($0.067)</p></li>
<li><p>2K ($0.101)</p></li>
<li><p>4K ($0.151).</p></li>
</ul>
<p>512px 티어는 나노 바나나 2에 새롭게 추가된 기능입니다. 이제 사용자는 반복 작업을 위해 저비용 512px 초안을 생성하고 별도의 업스케일링 단계 없이 최종 에셋을 2K 또는 4K로 출력할 수 있습니다.</p>
<ul>
<li><p><strong>지원되는 화면비는</strong> 총<strong>14가지입니다</strong>. 다음은 몇 가지 예시입니다:</p></li>
<li><p>4:1</p></li>
<li><p>1:4</p></li>
<li><p>8:1</p></li>
<li><p>1:8</p></li>
</ul>
<p>이 새로운 울트라 와이드 및 울트라 톨 비율은 기존 세트에 추가됩니다. 한 세대의 세션으로 다음과 같은 다양한 형식을 제작할 수 있습니다: <strong>아마존 메인 이미지</strong> (1:1), <strong>스토어 첫 화면 히어로</strong> (3:4), <strong>배너 광고</strong> (울트라 와이드 또는 기타 비율).</p>
<p>이 4가지 비율에는 자르기, 패딩, 재 프롬프트가 필요하지 않습니다. 나머지 10가지 종횡비는 전체 세트에 포함되어 있어 다양한 플랫폼에서 더욱 유연하게 사용할 수 있습니다.</p>
<p>이미지당 최대 50%의 비용 절감 효과만으로도 비용은 절반으로 줄어듭니다. 해상도와 종횡비에 따른 재작업이 없어지면서 총 비용이 기존 대비 약 1/3 수준으로 낮아졌습니다.</p>
<h3 id="Support-Up-to-14-Reference-Images-with-Bestseller-Style" class="common-anchor-header">베스트셀러 스타일로 최대 14개의 참조 이미지 지원</h3><p>나노 바나나 2의 모든 업데이트 중 멀티 레퍼런스 블렌딩은 Milvus 파이프라인에 가장 큰 영향을 미쳤습니다. 나노 바나나 2는 한 번의 요청으로 최대 14개의 레퍼런스 이미지를 사용할 수 있습니다:</p>
<ul>
<li>최대 <strong>5개의 문자에</strong> 대한 문자 유사성</li>
<li>최대 <strong>14개의 오브</strong>젝트에 대한 오브젝트 충실도</li>
</ul>
<p>실제로 Milvus에서 여러 베스트셀러 이미지를 검색하여 레퍼런스로 전달하면 생성된 이미지가 해당 이미지의 장면 구성, 조명, 포즈, 소품 배치를 그대로 계승했습니다. 이러한 패턴을 수작업으로 재구성하는 데 즉각적인 엔지니어링이 필요하지 않았습니다.</p>
<p>이전 모델은 한두 개의 레퍼런스만 지원했기 때문에 사용자는 모방할 베스트셀러를 하나만 선택해야 했습니다. 14개의 레퍼런스 슬롯을 통해 여러 베스트셀러 목록의 특성을 혼합하여 모델이 복합적인 스타일을 합성할 수 있게 되었습니다. 이것이 바로 아래 튜토리얼의 검색 기반 파이프라인을 가능하게 하는 기능입니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog-images/image15.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Produce-Premium-Commercial-Ready-Visuals-Without-Traditional-Production-Cost-or-Logistics" class="common-anchor-header">기존 제작 비용이나 물류 비용 없이 상업적으로 적합한 프리미엄 비주얼 제작하기</h3><p>일관되고 안정적인 이미지 생성을 위해서는 모든 요구 사항을 하나의 프롬프트에 몰아넣지 마세요. 배경을 먼저 생성한 다음 모델을 개별적으로 생성하고 마지막으로 합성하는 등 단계적으로 작업하는 것이 더 신뢰할 수 있는 접근 방식입니다.</p>
<p>세 가지 나노 바나나 모델 모두에서 동일한 프롬프트를 사용하여 배경 생성을 테스트했습니다. 창문을 통해 보이는 4:1 비율의 비오는 날 상하이 스카이라인과 동양의 진주탑이 보입니다. 이 프롬프트는 한 번의 패스로 구도, 건축 디테일, 사실감을 테스트합니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog-images/image2.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h4 id="Original-Nano-Banana-vs-Nano-Banana-Pro-vs-Nano-Banana-2" class="common-anchor-header">오리지널 나노 바나나 대 나노 바나나 프로 대 나노 바나나 2</h4><ul>
<li><strong>오리지널 나노 바나나.</strong> 사실적인 빗방울 분포로 자연스러운 빗방울 텍스처를 구현했지만 건물 디테일은 지나치게 부드럽게 처리했습니다. 오리엔탈 펄 타워는 거의 알아볼 수 없었고 해상도가 제작 요구 사항에 미치지 못했습니다.</li>
<li><strong>나노 바나나 프로.</strong> 영화 같은 분위기: 차가운 비와 대비되는 따뜻한 실내 조명이 설득력 있게 표현되었습니다. 하지만 창틀이 완전히 생략되어 이미지의 깊이감이 밋밋해졌습니다. 주인공이 아닌 보조 이미지로 사용할 수 있습니다.</li>
<li><strong>나노 바나나 2.</strong> 전체 장면을 렌더링했습니다. 전경의 창틀이 깊이감을 만들어냈습니다. 동양의 진주탑이 선명하게 표현되었습니다. 황푸강에 배가 나타났습니다. 레이어드 라이팅으로 내부의 따뜻한 느낌과 흐린 외부를 구분했습니다. 비와 물 얼룩 텍스처는 사진에 가깝게 표현되었고, 4:1 울트라 와이드 비율은 왼쪽 창 가장자리에서 약간의 왜곡만 있을 뿐 정확한 원근감을 유지했습니다.</li>
</ul>
<p>제품 사진에서 대부분의 배경 생성 작업에서 Nano Banana 2의 출력물은 후처리 없이도 사용할 수 있었습니다.</p>
<h3 id="Render-In-Image-Text-Cleanly-Across-Languages" class="common-anchor-header">여러 언어에 걸쳐 이미지 내 텍스트를 깔끔하게 렌더링</h3><p>가격표, 홍보 배너, 다국어 카피는 이커머스 이미지에서 피할 수 없는 요소이며, 그동안 AI 생성의 한계점이었습니다. 나노 바나나 2는 한 세대 만에 번역 및 로컬라이제이션을 통해 여러 언어에 걸친 이미지 내 텍스트 렌더링을 지원하여 이러한 문제를 훨씬 더 잘 처리합니다.</p>
<p><strong>표준 텍스트 렌더링.</strong> 테스트 결과, 가격 라벨, 짧은 마케팅 태그 라인, 이중 언어 제품 설명 등 모든 이커머스 형식에서 오류 없이 텍스트가 출력되었습니다.</p>
<p><strong>손글씨 연속.</strong> 전자상거래에는 가격표나 개인화된 카드와 같은 필기 요소가 필요한 경우가 많기 때문에 모델이 기존 필기 스타일과 일치하고 이를 확장할 수 있는지 테스트했습니다(특히 필기 할 일 목록과 일치하고 동일한 스타일로 5개의 새 항목을 추가하는 등). 세 가지 모델에 대한 결과입니다:</p>
<ul>
<li><strong>오리지널 나노 바나나.</strong> 반복되는 시퀀스 번호, 잘못된 구조.</li>
<li><strong>나노 바나나 프로.</strong> 레이아웃은 올바르지만 글꼴 스타일이 제대로 재현되지 않음.</li>
<li><strong>나노 바나나 2.</strong> 오류 없음. 원본과 구별할 수 없을 정도로 획 굵기와 글자꼴 스타일이 일치함.</li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog-images/image12.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>하지만</strong> 구글의 자체 문서에 따르면 나노 바나나 2는 "정확한 철자와 이미지의 미세한 디테일에 대해서는 여전히 어려움을 겪을 수 있다"고 언급하고 있습니다. 테스트한 모든 형식에서 결과가 깨끗했지만 모든 프로덕션 워크플로에는 게시하기 전에 텍스트 확인 단계가 포함되어야 합니다.</p>
<h2 id="Step-by-Step-Tutorial-Build-a-Bestseller-to-Image-Pipeline-with-Milvus-Qwen-35-and-Nano-Banana-2" class="common-anchor-header">단계별 튜토리얼: Milvus, Qwen 3.5 및 Nano Banana 2를 사용하여 베스트셀러-이미지 파이프라인 구축하기<button data-href="#Step-by-Step-Tutorial-Build-a-Bestseller-to-Image-Pipeline-with-Milvus-Qwen-35-and-Nano-Banana-2" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Before-we-begin-Architecture-and-Model-Setup" class="common-anchor-header">시작하기 전에 아키텍처 및 모델 설정</h3><p>단일 프롬프트 생성의 무작위성을 피하기 위해 <strong>Milvus</strong> 하이브리드 검색으로 이미 작동하는 것을 검색하고, <strong>Qwen 3.5로</strong> 작동하는 이유를 분석한 다음, <strong>Nano Banana 2로</strong> 이러한 제약 조건을 구운 최종 이미지를 생성하는 제어 가능한 세 단계로 프로세스를 분할했습니다.</p>
<p>각 도구를 사용해 본 적이 없다면 각 도구에 대한 간단한 입문서를 참고하세요:</p>
<ul>
<li><strong><a href="https://milvus.io/">Milvus</a></strong><a href="https://milvus.io/">:</a> 가장 널리 채택된 오픈 소스 벡터 데이터베이스입니다. 제품 카탈로그를 벡터로 저장하고 하이브리드 검색(밀도 + 스파스 + 스칼라 필터)을 실행하여 신제품과 가장 유사한 베스트셀러 이미지를 찾습니다.</li>
<li><strong>Qwen 3.5</strong>: 널리 사용되는 멀티모달 LLM. 검색된 베스트셀러 이미지를 가져와 그 뒤에 있는 시각적 패턴(장면 레이아웃, 조명, 포즈, 분위기)을 구조화된 스타일 프롬프트로 추출합니다.</li>
<li><strong>나노 바나나 2</strong>: Google의 이미지 생성 모델(Gemini 3.1 플래시 이미지). 신제품 평면 레이아웃, 베스트셀러 참조, Qwen 3.5의 스타일 프롬프트 등 세 가지 입력을 받습니다. 최종 홍보용 사진을 출력합니다.</li>
</ul>
<p>이 아키텍처의 논리는 한 가지 관찰에서 시작됩니다. 모든 전자상거래 카탈로그에서 가장 가치 있는 시각적 자산은 이미 변환된 베스트셀러 이미지 라이브러리입니다. 이러한 사진의 포즈, 구도, 조명은 실제 광고 지출을 통해 개선되었습니다. 이러한 패턴을 직접 검색하는 것은 프롬프트 작성을 통해 리버스 엔지니어링하는 것보다 훨씬 빠르며, 이러한 검색 단계는 벡터 데이터베이스가 처리하는 것과 정확히 일치합니다.</p>
<p>전체 흐름은 다음과 같습니다. 우리는 OpenRouter API를 통해 모든 모델을 호출하므로 로컬 GPU가 필요하지 않고 다운로드할 모델 가중치도 없습니다.</p>
<pre><code translate="no">New product flat-lay
│
│── Embed → Llama Nemotron Embed VL 1B v2
│
│── Search → Milvus hybrid search
│   ├── Dense <span class="hljs-title function_">vectors</span> <span class="hljs-params">(visual similarity)</span>
│   ├── Sparse <span class="hljs-title function_">vectors</span> <span class="hljs-params">(keyword matching)</span>
│   └── Scalar <span class="hljs-title function_">filters</span> <span class="hljs-params">(category + sales volume)</span>
│
│── Analyze → Qwen <span class="hljs-number">3.5</span> extracts style from retrieved bestsellers
│   └── scene, lighting, pose, mood → style prompt
│
└── Generate → Nano Banana <span class="hljs-number">2</span>
    ├── Inputs: <span class="hljs-keyword">new</span> <span class="hljs-title class_">product</span> + bestseller reference + style prompt
    └── Output: promotional photo
<button class="copy-code-btn"></button></code></pre>
<p>검색 단계를 수행하기 위해 세 가지 Milvus 기능을 활용합니다:</p>
<ol>
<li><strong>밀도 + 스파스 하이브리드 검색.</strong> 이미지 임베딩과 텍스트 TF-IDF 벡터를 병렬 쿼리로 실행한 다음, 두 결과 집합을 RRF(상호 순위 융합) 재순위를 통해 병합합니다.</li>
<li><strong>스칼라 필드 필터링.</strong> 벡터 비교 전에 카테고리 및 sales_count와 같은 메타데이터 필드를 기준으로 필터링하므로 관련성이 높고 실적이 우수한 제품만 결과에 포함됩니다.</li>
<li><strong>다중 필드 스키마.</strong> 밀집 벡터, 스파스 벡터, 스칼라 메타데이터를 단일 Milvus 컬렉션에 저장하여 전체 검색 로직을 여러 시스템에 흩어져 있지 않고 하나의 쿼리에 유지합니다.</li>
</ol>
<h3 id="Data-Preparation" class="common-anchor-header">데이터 준비</h3><p><strong>과거 제품 카탈로그</strong></p>
<p>기존 제품 사진의 이미지/폴더와 해당 메타데이터가 포함된 products.csv 파일이라는 두 가지 자산으로 시작합니다.</p>
<pre><code translate="no">images/
├── SKU001.jpg
├── SKU002.jpg
├── ...
└── SKU040.jpg

products.csv fields:
product_id, image_path, category, color, style, season, sales_count, description, price
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog-images/image6.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog-images/image1.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>새 제품 데이터</strong></p>
<p>프로모션 이미지를 생성하려는 제품의 경우, new_products/ 폴더와 new_products.csv라는 병렬 구조를 준비합니다.</p>
<pre><code translate="no">new_products/
├── NEW001.jpg    <span class="hljs-comment"># Blue knit cardigan + grey tulle skirt set</span>
├── NEW002.jpg    <span class="hljs-comment"># Light green floral ruffle maxi dress</span>
├── NEW003.jpg    <span class="hljs-comment"># Camel turtleneck knit dress</span>
└── NEW004.jpg    <span class="hljs-comment"># Dark grey ethnic-style cowl neck top dress</span>

new_products.csv fields:
new_id, image_path, category, style, season, prompt_hint
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog-images/image11.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog-images/image16.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-1-Install-Dependencies" class="common-anchor-header">1단계: 종속성 설치</h3><pre><code translate="no">!pip install pymilvus openai requests pillow scikit-learn tqdm
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-2-Import-Modules-and-Configurations" class="common-anchor-header">2단계: 모듈 및 구성 가져오기</h3><pre><code translate="no"><span class="hljs-keyword">import</span> os, io, base64, csv, time
<span class="hljs-keyword">import</span> requests <span class="hljs-keyword">as</span> req
<span class="hljs-keyword">import</span> numpy <span class="hljs-keyword">as</span> np
<span class="hljs-keyword">from</span> <span class="hljs-variable constant_">PIL</span> <span class="hljs-keyword">import</span> <span class="hljs-title class_">Image</span>
<span class="hljs-keyword">from</span> tqdm.<span class="hljs-property">notebook</span> <span class="hljs-keyword">import</span> tqdm
<span class="hljs-keyword">from</span> sklearn.<span class="hljs-property">feature_extraction</span>.<span class="hljs-property">text</span> <span class="hljs-keyword">import</span> <span class="hljs-title class_">TfidfVectorizer</span>
<span class="hljs-keyword">from</span> <span class="hljs-title class_">IPython</span>.<span class="hljs-property">display</span> <span class="hljs-keyword">import</span> display

<span class="hljs-keyword">from</span> openai <span class="hljs-keyword">import</span> <span class="hljs-title class_">OpenAI</span>
<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> <span class="hljs-title class_">MilvusClient</span>, <span class="hljs-title class_">DataType</span>, <span class="hljs-title class_">AnnSearchRequest</span>, <span class="hljs-title class_">RRFRanker</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>모든 모델과 경로를 구성합니다:</strong></p>
<pre><code translate="no"><span class="hljs-comment"># -- Config --</span>
OPENROUTER_API_KEY = os.environ.get(
    <span class="hljs-string">&quot;OPENROUTER_API_KEY&quot;</span>,
    <span class="hljs-string">&quot;&lt;YOUR_OPENROUTER_API_KEY&gt;&quot;</span>,
)

<span class="hljs-comment"># Models (all via OpenRouter, no local download needed)</span>
EMBED_MODEL = <span class="hljs-string">&quot;nvidia/llama-nemotron-embed-vl-1b-v2&quot;</span>  <span class="hljs-comment"># free, image+text → 2048d</span>
EMBED_DIM = <span class="hljs-number">2048</span>
LLM_MODEL = <span class="hljs-string">&quot;qwen/qwen3.5-397b-a17b&quot;</span>                 <span class="hljs-comment"># style analysis</span>
IMAGE_GEN_MODEL = <span class="hljs-string">&quot;google/gemini-3.1-flash-image-preview&quot;</span>  <span class="hljs-comment"># Nano Banana 2</span>

<span class="hljs-comment"># Milvus</span>
MILVUS_URI = <span class="hljs-string">&quot;./milvus_fashion.db&quot;</span>
COLLECTION = <span class="hljs-string">&quot;fashion_products&quot;</span>
TOP_K = <span class="hljs-number">3</span>

<span class="hljs-comment"># Paths</span>
IMAGE_DIR = <span class="hljs-string">&quot;./images&quot;</span>
NEW_PRODUCT_DIR = <span class="hljs-string">&quot;./new_products&quot;</span>
PRODUCT_CSV = <span class="hljs-string">&quot;./products.csv&quot;</span>
NEW_PRODUCT_CSV = <span class="hljs-string">&quot;./new_products.csv&quot;</span>

<span class="hljs-comment"># OpenRouter client (shared for LLM + image gen)</span>
llm = OpenAI(api_key=OPENROUTER_API_KEY, base_url=<span class="hljs-string">&quot;https://openrouter.ai/api/v1&quot;</span>)

<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Config loaded. All models via OpenRouter API.&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p><strong>유틸리티 함수</strong></p>
<p>이러한 헬퍼 함수는 이미지 인코딩, API 호출 및 응답 구문 분석을 처리합니다:</p>
<ul>
<li>image_to_uri(): API 전송을 위해 PIL 이미지를 base64 데이터 URI로 변환합니다.</li>
<li>get_image_embeddings(): OpenRouter 임베딩 API를 통해 이미지를 2048차원 벡터로 일괄 인코딩합니다.</li>
<li>GET_TEXT_EMBEDDING(): 텍스트를 동일한 2048차원 벡터 공간으로 인코딩합니다.</li>
<li>sparse_to_dict(): 스키피 스파스 행렬 행을 밀버스가 스파스 벡터에 기대하는 {index: value} 형식으로 변환합니다.</li>
<li>extract_images(): 나노 바나나 2 API 응답에서 생성된 이미지를 추출합니다.</li>
</ul>
<pre><code translate="no"><span class="hljs-comment"># -- Utility functions --</span>

<span class="hljs-keyword">def</span> <span class="hljs-title function_">image_to_uri</span>(<span class="hljs-params">img, max_size=<span class="hljs-number">1024</span></span>):
    <span class="hljs-string">&quot;&quot;&quot;Convert PIL Image to base64 data URI.&quot;&quot;&quot;</span>
    img = img.copy()
    w, h = img.size
    <span class="hljs-keyword">if</span> <span class="hljs-built_in">max</span>(w, h) &gt; max_size:
        r = max_size / <span class="hljs-built_in">max</span>(w, h)
        img = img.resize((<span class="hljs-built_in">int</span>(w * r), <span class="hljs-built_in">int</span>(h * r)), Image.LANCZOS)
    buf = io.BytesIO()
    img.save(buf, <span class="hljs-built_in">format</span>=<span class="hljs-string">&quot;JPEG&quot;</span>, quality=<span class="hljs-number">85</span>)
    <span class="hljs-keyword">return</span> <span class="hljs-string">f&quot;data:image/jpeg;base64,<span class="hljs-subst">{base64.b64encode(buf.getvalue()).decode()}</span>&quot;</span>

<span class="hljs-keyword">def</span> <span class="hljs-title function_">get_image_embeddings</span>(<span class="hljs-params">images, batch_size=<span class="hljs-number">5</span></span>):
    <span class="hljs-string">&quot;&quot;&quot;Encode images via OpenRouter embedding API.&quot;&quot;&quot;</span>
    all_embs = []
    <span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> tqdm(<span class="hljs-built_in">range</span>(<span class="hljs-number">0</span>, <span class="hljs-built_in">len</span>(images), batch_size), desc=<span class="hljs-string">&quot;Encoding images&quot;</span>):
        batch = images[i : i + batch_size]
        inputs = [
            {<span class="hljs-string">&quot;content&quot;</span>: [{<span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;image_url&quot;</span>, <span class="hljs-string">&quot;image_url&quot;</span>: {<span class="hljs-string">&quot;url&quot;</span>: image_to_uri(img, max_size=<span class="hljs-number">512</span>)}}]}
            <span class="hljs-keyword">for</span> img <span class="hljs-keyword">in</span> batch
        ]
        resp = req.post(
            <span class="hljs-string">&quot;https://openrouter.ai/api/v1/embeddings&quot;</span>,
            headers={<span class="hljs-string">&quot;Authorization&quot;</span>: <span class="hljs-string">f&quot;Bearer <span class="hljs-subst">{OPENROUTER_API_KEY}</span>&quot;</span>},
            json={<span class="hljs-string">&quot;model&quot;</span>: EMBED_MODEL, <span class="hljs-string">&quot;input&quot;</span>: inputs},
            timeout=<span class="hljs-number">120</span>,
        )
        data = resp.json()
        <span class="hljs-keyword">if</span> <span class="hljs-string">&quot;data&quot;</span> <span class="hljs-keyword">not</span> <span class="hljs-keyword">in</span> data:
            <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;API error: <span class="hljs-subst">{data}</span>&quot;</span>)
            <span class="hljs-keyword">continue</span>
        <span class="hljs-keyword">for</span> item <span class="hljs-keyword">in</span> <span class="hljs-built_in">sorted</span>(data[<span class="hljs-string">&quot;data&quot;</span>], key=<span class="hljs-keyword">lambda</span> x: x[<span class="hljs-string">&quot;index&quot;</span>]):
            all_embs.append(item[<span class="hljs-string">&quot;embedding&quot;</span>])
        time.sleep(<span class="hljs-number">0.5</span>)  <span class="hljs-comment"># rate limit friendly</span>
    <span class="hljs-keyword">return</span> np.array(all_embs, dtype=np.float32)

<span class="hljs-keyword">def</span> <span class="hljs-title function_">get_text_embedding</span>(<span class="hljs-params">text</span>):
    <span class="hljs-string">&quot;&quot;&quot;Encode text via OpenRouter embedding API.&quot;&quot;&quot;</span>
    resp = req.post(
        <span class="hljs-string">&quot;https://openrouter.ai/api/v1/embeddings&quot;</span>,
        headers={<span class="hljs-string">&quot;Authorization&quot;</span>: <span class="hljs-string">f&quot;Bearer <span class="hljs-subst">{OPENROUTER_API_KEY}</span>&quot;</span>},
        json={<span class="hljs-string">&quot;model&quot;</span>: EMBED_MODEL, <span class="hljs-string">&quot;input&quot;</span>: text},
        timeout=<span class="hljs-number">60</span>,
    )
    <span class="hljs-keyword">return</span> np.array(resp.json()[<span class="hljs-string">&quot;data&quot;</span>][<span class="hljs-number">0</span>][<span class="hljs-string">&quot;embedding&quot;</span>], dtype=np.float32)

<span class="hljs-keyword">def</span> <span class="hljs-title function_">sparse_to_dict</span>(<span class="hljs-params">sparse_row</span>):
    <span class="hljs-string">&quot;&quot;&quot;Convert scipy sparse row to Milvus sparse vector format {index: value}.&quot;&quot;&quot;</span>
    coo = sparse_row.tocoo()
    <span class="hljs-keyword">return</span> {<span class="hljs-built_in">int</span>(i): <span class="hljs-built_in">float</span>(v) <span class="hljs-keyword">for</span> i, v <span class="hljs-keyword">in</span> <span class="hljs-built_in">zip</span>(coo.col, coo.data)}

<span class="hljs-keyword">def</span> <span class="hljs-title function_">extract_images</span>(<span class="hljs-params">response</span>):
    <span class="hljs-string">&quot;&quot;&quot;Extract generated images from OpenRouter response.&quot;&quot;&quot;</span>
    images = []
    raw = response.model_dump()
    msg = raw[<span class="hljs-string">&quot;choices&quot;</span>][<span class="hljs-number">0</span>][<span class="hljs-string">&quot;message&quot;</span>]
    <span class="hljs-comment"># Method 1: images field (OpenRouter extension)</span>
    <span class="hljs-keyword">if</span> <span class="hljs-string">&quot;images&quot;</span> <span class="hljs-keyword">in</span> msg <span class="hljs-keyword">and</span> msg[<span class="hljs-string">&quot;images&quot;</span>]:
        <span class="hljs-keyword">for</span> img_data <span class="hljs-keyword">in</span> msg[<span class="hljs-string">&quot;images&quot;</span>]:
            url = img_data[<span class="hljs-string">&quot;image_url&quot;</span>][<span class="hljs-string">&quot;url&quot;</span>]
            b64 = url.split(<span class="hljs-string">&quot;,&quot;</span>, <span class="hljs-number">1</span>)[<span class="hljs-number">1</span>]
            images.append(Image.<span class="hljs-built_in">open</span>(io.BytesIO(base64.b64decode(b64))))
    <span class="hljs-comment"># Method 2: inline base64 in content parts</span>
    <span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> images <span class="hljs-keyword">and</span> <span class="hljs-built_in">isinstance</span>(msg.get(<span class="hljs-string">&quot;content&quot;</span>), <span class="hljs-built_in">list</span>):
        <span class="hljs-keyword">for</span> part <span class="hljs-keyword">in</span> msg[<span class="hljs-string">&quot;content&quot;</span>]:
            <span class="hljs-keyword">if</span> <span class="hljs-built_in">isinstance</span>(part, <span class="hljs-built_in">dict</span>) <span class="hljs-keyword">and</span> part.get(<span class="hljs-string">&quot;type&quot;</span>) == <span class="hljs-string">&quot;image_url&quot;</span>:
                url = part[<span class="hljs-string">&quot;image_url&quot;</span>][<span class="hljs-string">&quot;url&quot;</span>]
                <span class="hljs-keyword">if</span> url.startswith(<span class="hljs-string">&quot;data:image&quot;</span>):
                    b64 = url.split(<span class="hljs-string">&quot;,&quot;</span>, <span class="hljs-number">1</span>)[<span class="hljs-number">1</span>]
                    images.append(Image.<span class="hljs-built_in">open</span>(io.BytesIO(base64.b64decode(b64))))
    <span class="hljs-keyword">return</span> images

<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Utility functions ready.&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-3-Load-the-Product-Catalog" class="common-anchor-header">3단계: 제품 카탈로그 로드</h3><p>products.csv를 읽고 해당 제품 이미지를 로드합니다:</p>
<pre><code translate="no"><span class="hljs-keyword">with</span> <span class="hljs-built_in">open</span>(PRODUCT_CSV, newline=<span class="hljs-string">&quot;&quot;</span>, encoding=<span class="hljs-string">&quot;utf-8&quot;</span>) <span class="hljs-keyword">as</span> f:
    products = <span class="hljs-built_in">list</span>(csv.DictReader(f))

product_images = []
<span class="hljs-keyword">for</span> p <span class="hljs-keyword">in</span> products:
    img = Image.<span class="hljs-built_in">open</span>(os.path.join(IMAGE_DIR, p[<span class="hljs-string">&quot;image_path&quot;</span>])).convert(<span class="hljs-string">&quot;RGB&quot;</span>)
    product_images.append(img)

<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Loaded <span class="hljs-subst">{<span class="hljs-built_in">len</span>(products)}</span> products.&quot;</span>)
<span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-number">3</span>):
    p = products[i]
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;<span class="hljs-subst">{p[<span class="hljs-string">&#x27;product_id&#x27;</span>]}</span> | <span class="hljs-subst">{p[<span class="hljs-string">&#x27;category&#x27;</span>]}</span> | <span class="hljs-subst">{p[<span class="hljs-string">&#x27;color&#x27;</span>]}</span> | <span class="hljs-subst">{p[<span class="hljs-string">&#x27;style&#x27;</span>]}</span> | sales: <span class="hljs-subst">{p[<span class="hljs-string">&#x27;sales_count&#x27;</span>]}</span>&quot;</span>)
    display(product_images[i].resize((<span class="hljs-number">180</span>, <span class="hljs-built_in">int</span>(<span class="hljs-number">180</span> * product_images[i].height / product_images[i].width))))
<button class="copy-code-btn"></button></code></pre>
<p>샘플 출력:<br>

  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog-images/image13.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-4-Generate-Embeddings" class="common-anchor-header">4단계: 임베딩 생성</h3><p>하이브리드 검색에는 각 제품에 대해 두 가지 유형의 벡터가 필요합니다.</p>
<p><strong>4.1 고밀도 벡터: 이미지 임베딩</strong></p>
<p>nvidia/llama-nemotron-embed-vl-1b-v2 모델은 각 제품 이미지를 2048차원의 고밀도 벡터로 인코딩합니다. 이 모델은 공유 벡터 공간에서 이미지와 텍스트 입력을 모두 지원하므로 이미지 대 이미지 및 텍스트 대 이미지 검색에 동일한 임베딩이 작동합니다.</p>
<pre><code translate="no"><span class="hljs-comment"># Dense embeddings: image → 2048-dim vector via OpenRouter API</span>
dense_vectors = get_image_embeddings(product_images, batch_size=<span class="hljs-number">5</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Dense vectors: <span class="hljs-subst">{dense_vectors.shape}</span>  (products x <span class="hljs-subst">{EMBED_DIM}</span>d)&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>출력:</p>
<pre><code translate="no">Dense vectors: (40, 2048)  (products x 2048d)
<button class="copy-code-btn"></button></code></pre>
<p><strong>4.2 스파스 벡터: TF-IDF 텍스트 임베딩</strong></p>
<p>제품 텍스트 설명은 scikit-learn의 TF-IDF 벡터라이저를 사용해 스파스 벡터로 인코딩됩니다. 이는 밀도가 높은 벡터가 놓칠 수 있는 키워드 수준의 매칭을 포착합니다.</p>
<pre><code translate="no"><span class="hljs-comment"># Sparse embeddings: TF-IDF on product descriptions</span>
descriptions = [p[<span class="hljs-string">&quot;description&quot;</span>] <span class="hljs-keyword">for</span> p <span class="hljs-keyword">in</span> products]
tfidf = TfidfVectorizer(stop_words=<span class="hljs-string">&quot;english&quot;</span>, max_features=<span class="hljs-number">500</span>)
tfidf_matrix = tfidf.fit_transform(descriptions)

sparse_vectors = [sparse_to_dict(tfidf_matrix[i]) <span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-built_in">len</span>(products))]
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Sparse vectors: <span class="hljs-subst">{<span class="hljs-built_in">len</span>(sparse_vectors)}</span> products, vocab size: <span class="hljs-subst">{<span class="hljs-built_in">len</span>(tfidf.vocabulary_)}</span>&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Sample sparse vector (SKU001): <span class="hljs-subst">{<span class="hljs-built_in">len</span>(sparse_vectors[<span class="hljs-number">0</span>])}</span> non-zero terms&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>출력:</p>
<pre><code translate="no">Sparse vectors: <span class="hljs-number">40</span> products, vocab size: <span class="hljs-number">179</span>
Sample sparse <span class="hljs-title function_">vector</span> <span class="hljs-params">(SKU001)</span>: <span class="hljs-number">11</span> non-zero terms
<button class="copy-code-btn"></button></code></pre>
<p><strong>왜 두 가지 벡터 유형일까요?</strong> 고밀도 벡터와 희소 벡터는 서로를 보완합니다. 고밀도 벡터는 색상 팔레트, 의상 실루엣, 전체적인 스타일 등 시각적 유사성을 포착합니다. 스파스 벡터는 '꽃무늬', '미디', '쉬폰'과 같이 제품 속성을 나타내는 키워드의 의미를 포착합니다. 두 가지 방법을 결합하면 어느 한 방법만 사용하는 것보다 훨씬 더 나은 검색 품질을 얻을 수 있습니다.</p>
<h3 id="Step-5-Create-a-Milvus-Collection-with-Hybrid-Schema" class="common-anchor-header">5단계: 하이브리드 스키마를 사용하여 Milvus 컬렉션 만들기</h3><p>이 단계에서는 밀도 벡터, 스파스 벡터, 스칼라 메타데이터 필드를 함께 저장하는 단일 Milvus 컬렉션을 만듭니다. 이 통합 스키마는 단일 쿼리에서 하이브리드 검색을 가능하게 합니다.</p>
<table>
<thead>
<tr><th><strong>필드</strong></th><th><strong>유형</strong></th><th><strong>목적</strong></th></tr>
</thead>
<tbody>
<tr><td>dense_vector</td><td>플로트_벡터(2048d)</td><td>이미지 임베딩, 코사인 유사도</td></tr>
<tr><td>스파스_벡터</td><td>SPARSE_FLOAT_VECTOR</td><td>TF-IDF 스파스 벡터, 내적 곱</td></tr>
<tr><td>카테고리</td><td>VARCHAR</td><td>필터링용 카테고리 레이블</td></tr>
<tr><td>sales_count</td><td>INT64</td><td>필터링할 과거 판매량</td></tr>
<tr><td>색상, 스타일, 시즌</td><td>VARCHAR</td><td>추가 메타데이터 레이블</td></tr>
<tr><td>가격</td><td>FLOAT</td><td>제품 가격</td></tr>
</tbody>
</table>
<pre><code translate="no">milvus_client = MilvusClient(uri=MILVUS_URI)

<span class="hljs-keyword">if</span> milvus_client.has_collection(COLLECTION):
    milvus_client.drop_collection(COLLECTION)

schema = milvus_client.create_schema(auto_id=<span class="hljs-literal">True</span>, enable_dynamic_field=<span class="hljs-literal">True</span>)
schema.add_field(<span class="hljs-string">&quot;id&quot;</span>, DataType.INT64, is_primary=<span class="hljs-literal">True</span>)
schema.add_field(<span class="hljs-string">&quot;product_id&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">20</span>)
schema.add_field(<span class="hljs-string">&quot;category&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">50</span>)
schema.add_field(<span class="hljs-string">&quot;color&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">50</span>)
schema.add_field(<span class="hljs-string">&quot;style&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">50</span>)
schema.add_field(<span class="hljs-string">&quot;season&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">50</span>)
schema.add_field(<span class="hljs-string">&quot;sales_count&quot;</span>, DataType.INT64)
schema.add_field(<span class="hljs-string">&quot;description&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">500</span>)
schema.add_field(<span class="hljs-string">&quot;price&quot;</span>, DataType.FLOAT)
schema.add_field(<span class="hljs-string">&quot;dense_vector&quot;</span>, DataType.FLOAT_VECTOR, dim=EMBED_DIM)
schema.add_field(<span class="hljs-string">&quot;sparse_vector&quot;</span>, DataType.SPARSE_FLOAT_VECTOR)

index_params = milvus_client.prepare_index_params()
index_params.add_index(field_name=<span class="hljs-string">&quot;dense_vector&quot;</span>, index_type=<span class="hljs-string">&quot;FLAT&quot;</span>, metric_type=<span class="hljs-string">&quot;COSINE&quot;</span>)
index_params.add_index(field_name=<span class="hljs-string">&quot;sparse_vector&quot;</span>, index_type=<span class="hljs-string">&quot;SPARSE_INVERTED_INDEX&quot;</span>, metric_type=<span class="hljs-string">&quot;IP&quot;</span>)

milvus_client.create_collection(COLLECTION, schema=schema, index_params=index_params)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Milvus collection &#x27;<span class="hljs-subst">{COLLECTION}</span>&#x27; created with hybrid schema.&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>제품 데이터를 입력합니다:</p>
<pre><code translate="no"><span class="hljs-comment"># Insert all products</span>
rows = []
<span class="hljs-keyword">for</span> i, p <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(products):
    rows.append({
        <span class="hljs-string">&quot;product_id&quot;</span>: p[<span class="hljs-string">&quot;product_id&quot;</span>],
        <span class="hljs-string">&quot;category&quot;</span>: p[<span class="hljs-string">&quot;category&quot;</span>],
        <span class="hljs-string">&quot;color&quot;</span>: p[<span class="hljs-string">&quot;color&quot;</span>],
        <span class="hljs-string">&quot;style&quot;</span>: p[<span class="hljs-string">&quot;style&quot;</span>],
        <span class="hljs-string">&quot;season&quot;</span>: p[<span class="hljs-string">&quot;season&quot;</span>],
        <span class="hljs-string">&quot;sales_count&quot;</span>: <span class="hljs-built_in">int</span>(p[<span class="hljs-string">&quot;sales_count&quot;</span>]),
        <span class="hljs-string">&quot;description&quot;</span>: p[<span class="hljs-string">&quot;description&quot;</span>],
        <span class="hljs-string">&quot;price&quot;</span>: <span class="hljs-built_in">float</span>(p[<span class="hljs-string">&quot;price&quot;</span>]),
        <span class="hljs-string">&quot;dense_vector&quot;</span>: dense_vectors[i].tolist(),
        <span class="hljs-string">&quot;sparse_vector&quot;</span>: sparse_vectors[i],
    })

milvus_client.insert(COLLECTION, rows)
stats = milvus_client.get_collection_stats(COLLECTION)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Inserted <span class="hljs-subst">{stats[<span class="hljs-string">&#x27;row_count&#x27;</span>]}</span> products into Milvus.&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>출력:</p>
<pre><code translate="no">Inserted <span class="hljs-number">40</span> products <span class="hljs-keyword">into</span> Milvus.
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-6-Hybrid-Search-to-Find-Similar-Bestsellers" class="common-anchor-header">6단계: 하이브리드 검색으로 유사 베스트셀러 찾기</h3><p>이 단계가 핵심 검색 단계입니다. 각 새 제품에 대해 파이프라인은 세 가지 작업을 동시에 실행합니다:</p>
<ol>
<li><strong>밀도 검색</strong>: 시각적으로 유사한 이미지가 포함된 제품을 찾습니다.</li>
<li><strong>희소 검색</strong>: TF-IDF를 통해 일치하는 텍스트 키워드를 가진 제품을 찾습니다.</li>
<li><strong>스칼라 필터링</strong>: 동일한 카테고리와 판매 수가 1500을 초과하는 제품으로 결과를 제한합니다.</li>
<li><strong>RRF 재랭크</strong>: 상호 순위 융합을 사용하여 밀집 및 희소 결과 목록을 병합합니다.</li>
</ol>
<p>새 제품을 로드합니다:</p>
<pre><code translate="no"><span class="hljs-comment"># Load new products</span>
<span class="hljs-keyword">with</span> <span class="hljs-built_in">open</span>(NEW_PRODUCT_CSV, newline=<span class="hljs-string">&quot;&quot;</span>, encoding=<span class="hljs-string">&quot;utf-8&quot;</span>) <span class="hljs-keyword">as</span> f:
    new_products = <span class="hljs-built_in">list</span>(csv.DictReader(f))

<span class="hljs-comment"># Pick the first new product for demo</span>
new_prod = new_products[<span class="hljs-number">0</span>]
new_img = Image.<span class="hljs-built_in">open</span>(os.path.join(NEW_PRODUCT_DIR, new_prod[<span class="hljs-string">&quot;image_path&quot;</span>])).convert(<span class="hljs-string">&quot;RGB&quot;</span>)

<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;New product: <span class="hljs-subst">{new_prod[<span class="hljs-string">&#x27;new_id&#x27;</span>]}</span>&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Category: <span class="hljs-subst">{new_prod[<span class="hljs-string">&#x27;category&#x27;</span>]}</span> | Style: <span class="hljs-subst">{new_prod[<span class="hljs-string">&#x27;style&#x27;</span>]}</span> | Season: <span class="hljs-subst">{new_prod[<span class="hljs-string">&#x27;season&#x27;</span>]}</span>&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Prompt hint: <span class="hljs-subst">{new_prod[<span class="hljs-string">&#x27;prompt_hint&#x27;</span>]}</span>&quot;</span>)
display(new_img.resize((<span class="hljs-number">300</span>, <span class="hljs-built_in">int</span>(<span class="hljs-number">300</span> * new_img.height / new_img.width))))
<button class="copy-code-btn"></button></code></pre>
<p>출력:  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog-images/image4.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>새 제품을 인코딩합니다:</p>
<pre><code translate="no"><span class="hljs-comment"># Encode new product</span>
<span class="hljs-comment"># Dense: image embedding via API</span>
query_dense = get_image_embeddings([new_img], batch_size=<span class="hljs-number">1</span>)[<span class="hljs-number">0</span>]

<span class="hljs-comment"># Sparse: TF-IDF from text query</span>
query_text = <span class="hljs-string">f&quot;<span class="hljs-subst">{new_prod[<span class="hljs-string">&#x27;category&#x27;</span>]}</span> <span class="hljs-subst">{new_prod[<span class="hljs-string">&#x27;style&#x27;</span>]}</span> <span class="hljs-subst">{new_prod[<span class="hljs-string">&#x27;season&#x27;</span>]}</span> <span class="hljs-subst">{new_prod[<span class="hljs-string">&#x27;prompt_hint&#x27;</span>]}</span>&quot;</span>
query_sparse = sparse_to_dict(tfidf.transform([query_text])[<span class="hljs-number">0</span>])

<span class="hljs-comment"># Scalar filter</span>
filter_expr = <span class="hljs-string">f&#x27;category == &quot;<span class="hljs-subst">{new_prod[<span class="hljs-string">&quot;category&quot;</span>]}</span>&quot; and sales_count &gt; 1500&#x27;</span>

<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Dense query: <span class="hljs-subst">{query_dense.shape}</span>&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Sparse query: <span class="hljs-subst">{<span class="hljs-built_in">len</span>(query_sparse)}</span> non-zero terms&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Filter: <span class="hljs-subst">{filter_expr}</span>&quot;</span>)

<button class="copy-code-btn"></button></code></pre>
<p>출력:</p>
<pre><code translate="no"><span class="hljs-title class_">Dense</span> <span class="hljs-attr">query</span>: (<span class="hljs-number">2048</span>,)
<span class="hljs-title class_">Sparse</span> <span class="hljs-attr">query</span>: <span class="hljs-number">6</span> non-zero terms
<span class="hljs-title class_">Filter</span>: category == <span class="hljs-string">&quot;midi_dress&quot;</span> and sales_count &gt; <span class="hljs-number">1500</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>하이브리드 검색 실행</strong></p>
<p>핵심 API 호출은 다음과 같습니다:</p>
<ul>
<li>AnnSearchRequest는 고밀도 및 희소 벡터 필드에 대한 별도의 검색 요청을 생성합니다.</li>
<li>expr=filter_expr은 각 검색 요청 내에서 스칼라 필터링을 적용합니다.</li>
<li>RRFRanker(k=60)는 상호 순위 융합 알고리즘을 사용하여 두 개의 순위가 매겨진 결과 목록을 융합합니다.</li>
<li>hybrid_search는 두 요청을 모두 실행하여 병합되고 순위가 재조정된 결과를 반환합니다.</li>
</ul>
<pre><code translate="no"><span class="hljs-comment"># Hybrid search: dense + sparse + scalar filter + RRF reranking</span>
dense_req = AnnSearchRequest(
    data=[query_dense.tolist()],
    anns_field=<span class="hljs-string">&quot;dense_vector&quot;</span>,
    param={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;COSINE&quot;</span>},
    limit=<span class="hljs-number">20</span>,
    expr=filter_expr,
)
sparse_req = AnnSearchRequest(
    data=[query_sparse],
    anns_field=<span class="hljs-string">&quot;sparse_vector&quot;</span>,
    param={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;IP&quot;</span>},
    limit=<span class="hljs-number">20</span>,
    expr=filter_expr,
)

results = milvus_client.hybrid_search(
    collection_name=COLLECTION,
    reqs=[dense_req, sparse_req],
    ranker=RRFRanker(k=<span class="hljs-number">60</span>),
    limit=TOP_K,
    output_fields=[<span class="hljs-string">&quot;product_id&quot;</span>, <span class="hljs-string">&quot;category&quot;</span>, <span class="hljs-string">&quot;color&quot;</span>, <span class="hljs-string">&quot;style&quot;</span>, <span class="hljs-string">&quot;season&quot;</span>,
                   <span class="hljs-string">&quot;sales_count&quot;</span>, <span class="hljs-string">&quot;description&quot;</span>, <span class="hljs-string">&quot;price&quot;</span>],
)

<span class="hljs-comment"># Display retrieved bestsellers</span>
retrieved_products = []
retrieved_images = []
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Top-<span class="hljs-subst">{TOP_K}</span> similar bestsellers:\n&quot;</span>)
<span class="hljs-keyword">for</span> hit <span class="hljs-keyword">in</span> results[<span class="hljs-number">0</span>]:
    entity = hit[<span class="hljs-string">&quot;entity&quot;</span>]
    pid = entity[<span class="hljs-string">&quot;product_id&quot;</span>]
    img = Image.<span class="hljs-built_in">open</span>(os.path.join(IMAGE_DIR, <span class="hljs-string">f&quot;<span class="hljs-subst">{pid}</span>.jpg&quot;</span>)).convert(<span class="hljs-string">&quot;RGB&quot;</span>)
    retrieved_products.append(entity)
    retrieved_images.append(img)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;<span class="hljs-subst">{pid}</span> | <span class="hljs-subst">{entity[<span class="hljs-string">&#x27;category&#x27;</span>]}</span> | <span class="hljs-subst">{entity[<span class="hljs-string">&#x27;color&#x27;</span>]}</span> | <span class="hljs-subst">{entity[<span class="hljs-string">&#x27;style&#x27;</span>]}</span> &quot;</span>
          <span class="hljs-string">f&quot;| sales: <span class="hljs-subst">{entity[<span class="hljs-string">&#x27;sales_count&#x27;</span>]}</span> | $<span class="hljs-subst">{entity[<span class="hljs-string">&#x27;price&#x27;</span>]:<span class="hljs-number">.1</span>f}</span> | score: <span class="hljs-subst">{hit[<span class="hljs-string">&#x27;distance&#x27;</span>]:<span class="hljs-number">.4</span>f}</span>&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;  <span class="hljs-subst">{entity[<span class="hljs-string">&#x27;description&#x27;</span>]}</span>&quot;</span>)
    display(img.resize((<span class="hljs-number">250</span>, <span class="hljs-built_in">int</span>(<span class="hljs-number">250</span> * img.height / img.width))))
    <span class="hljs-built_in">print</span>()
<button class="copy-code-btn"></button></code></pre>
<p>결과: 가장 유사한 베스트셀러 상위 3개가 융합된 점수에 따라 순위가 매겨집니다.  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog-images/image7.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-7-Analyze-Bestseller-Style-with-Qwen-35" class="common-anchor-header">7단계: Qwen 3.5로 베스트셀러 스타일 분석하기</h3><p>검색된 베스트셀러 이미지를 Qwen 3.5에 입력하고 장면 구성, 조명 설정, 모델 포즈, 전반적인 분위기 등 공유된 시각적 DNA를 추출하도록 요청합니다. 이 분석을 통해 Nano Banana 2에 전달할 준비가 된 단일 세대 프롬프트를 다시 얻습니다.</p>
<pre><code translate="no">content = [
    {<span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;image_url&quot;</span>, <span class="hljs-string">&quot;image_url&quot;</span>: {<span class="hljs-string">&quot;url&quot;</span>: image_to_uri(img)}}
    <span class="hljs-keyword">for</span> img in retrieved_images
]
content.<span class="hljs-built_in">append</span>({
    <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;text&quot;</span>,
    <span class="hljs-string">&quot;text&quot;</span>: (
        <span class="hljs-string">&quot;These are our top-selling fashion product photos.\n\n&quot;</span>
        <span class="hljs-string">&quot;Analyze their common visual style in these dimensions:\n&quot;</span>
        <span class="hljs-string">&quot;1. Scene / background setting\n&quot;</span>
        <span class="hljs-string">&quot;2. Lighting and color tone\n&quot;</span>
        <span class="hljs-string">&quot;3. Model pose and framing\n&quot;</span>
        <span class="hljs-string">&quot;4. Overall mood and aesthetic\n\n&quot;</span>
        <span class="hljs-string">&quot;Then, based on this analysis, write ONE concise image generation prompt &quot;</span>
        <span class="hljs-string">&quot;(under 100 words) that captures this style. The prompt should describe &quot;</span>
        <span class="hljs-string">&quot;a scene for a model wearing a new clothing item. &quot;</span>
        <span class="hljs-string">&quot;Output ONLY the prompt, nothing else.&quot;</span>
    ),
})

response = llm.chat.completions.create(
    model=LLM_MODEL,
    messages=[{<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: content}],
    max_tokens=<span class="hljs-number">512</span>,
    temperature=<span class="hljs-number">0.7</span>,
)
style_prompt = response.choices[<span class="hljs-number">0</span>].message.content.strip()
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Style prompt from Qwen3.5:\n&quot;</span>)
<span class="hljs-built_in">print</span>(style_prompt)
<button class="copy-code-btn"></button></code></pre>
<p>샘플 출력:</p>
<pre><code translate="no">Style prompt from Qwen3.5:

Professional full-body fashion photograph of a model wearing a stylish new dress.
Bright, soft high-key lighting that illuminates the subject evenly. Clean,
uncluttered background, either stark white or a softly blurred bright outdoor
setting. The model stands in a relaxed, natural pose to showcase the garment&#x27;s
silhouette and drape. Sharp focus, vibrant colors, fresh and elegant commercial aesthetic.
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-8-Generate-the-Promotional-Image-with-Nano-Banana-2" class="common-anchor-header">8단계: 나노 바나나 2로 프로모션 이미지 생성하기</h3><p>신제품의 평면 사진, 베스트셀러 상위권 이미지, 이전 단계에서 추출한 스타일 프롬프트의 세 가지 입력을 Nano Banana 2에 전달합니다. 모델은 이를 합성하여 새로운 의류와 검증된 시각적 스타일을 결합한 홍보용 사진을 만듭니다.</p>
<pre><code translate="no">gen_prompt = (
    <span class="hljs-string">f&quot;I have a new clothing product (Image 1: flat-lay photo) and a reference &quot;</span>
    <span class="hljs-string">f&quot;promotional photo from our bestselling catalog (Image 2).\n\n&quot;</span>
    <span class="hljs-string">f&quot;Generate a professional e-commerce promotional photograph of a female model &quot;</span>
    <span class="hljs-string">f&quot;wearing the clothing from Image 1.\n\n&quot;</span>
    <span class="hljs-string">f&quot;Style guidance: <span class="hljs-subst">{style_prompt}</span>\n\n&quot;</span>
    <span class="hljs-string">f&quot;Scene hint: <span class="hljs-subst">{new_prod[<span class="hljs-string">&#x27;prompt_hint&#x27;</span>]}</span>\n\n&quot;</span>
    <span class="hljs-string">f&quot;Requirements:\n&quot;</span>
    <span class="hljs-string">f&quot;- Full body shot, photorealistic, high quality\n&quot;</span>
    <span class="hljs-string">f&quot;- The clothing should match Image 1 exactly\n&quot;</span>
    <span class="hljs-string">f&quot;- The photo style and mood should match Image 2&quot;</span>
)

gen_content = [
    {<span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;image_url&quot;</span>, <span class="hljs-string">&quot;image_url&quot;</span>: {<span class="hljs-string">&quot;url&quot;</span>: image_to_uri(new_img)}},
    {<span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;image_url&quot;</span>, <span class="hljs-string">&quot;image_url&quot;</span>: {<span class="hljs-string">&quot;url&quot;</span>: image_to_uri(retrieved_images[<span class="hljs-number">0</span>])}},
    {<span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;text&quot;</span>, <span class="hljs-string">&quot;text&quot;</span>: gen_prompt},
]

<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Generating promotional photo with Nano Banana 2...&quot;</span>)
gen_response = llm.chat.completions.create(
    model=IMAGE_GEN_MODEL,
    messages=[{<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: gen_content}],
    extra_body={
        <span class="hljs-string">&quot;modalities&quot;</span>: [<span class="hljs-string">&quot;text&quot;</span>, <span class="hljs-string">&quot;image&quot;</span>],
        <span class="hljs-string">&quot;image_config&quot;</span>: {<span class="hljs-string">&quot;aspect_ratio&quot;</span>: <span class="hljs-string">&quot;3:4&quot;</span>, <span class="hljs-string">&quot;image_size&quot;</span>: <span class="hljs-string">&quot;2K&quot;</span>},
    },
)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Done!&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>나노 바나나 2 API 호출의 주요 매개변수입니다:</p>
<ul>
<li>모달리티 [&quot;text&quot;, &quot;image&quot;]: 응답에 이미지가 포함되어야 함을 선언합니다.</li>
<li>image_config.aspect_ratio: 출력 종횡비를 제어합니다(인물/패션 사진에는 3:4가 적합).</li>
<li>image_config.image_size: 해상도를 설정합니다. 나노 바나나 2는 512픽셀부터 4K까지 지원합니다.</li>
</ul>
<p>생성된 이미지를 추출합니다:</p>
<pre><code translate="no">generated_images = extract_images(gen_response)

text_content = gen_response.choices[<span class="hljs-number">0</span>].message.content
<span class="hljs-keyword">if</span> text_content:
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Model response: <span class="hljs-subst">{text_content[:<span class="hljs-number">300</span>]}</span>\n&quot;</span>)

<span class="hljs-keyword">if</span> generated_images:
    <span class="hljs-keyword">for</span> i, img <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(generated_images):
        <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;--- Generated promo photo <span class="hljs-subst">{i+<span class="hljs-number">1</span>}</span> ---&quot;</span>)
        display(img)
        img.save(<span class="hljs-string">f&quot;promo_<span class="hljs-subst">{new_prod[<span class="hljs-string">&#x27;new_id&#x27;</span>]}</span>_<span class="hljs-subst">{i+<span class="hljs-number">1</span>}</span>.png&quot;</span>)
        <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Saved: promo_<span class="hljs-subst">{new_prod[<span class="hljs-string">&#x27;new_id&#x27;</span>]}</span>_<span class="hljs-subst">{i+<span class="hljs-number">1</span>}</span>.png&quot;</span>)
<span class="hljs-keyword">else</span>:
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;No image generated. Raw response:&quot;</span>)
    <span class="hljs-built_in">print</span>(gen_response.model_dump())
<button class="copy-code-btn"></button></code></pre>
<p>출력:  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog-images/image9.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-9-Side-by-Side-Comparison" class="common-anchor-header">9단계: 나란히 비교</h3><p>조명이 부드럽고 균일하며 모델의 포즈가 자연스러워 보이고 분위기가 베스트셀러 레퍼런스와 일치하는 등 전반적으로 만족스러운 결과물을 얻을 수 있습니다.</p>
<p>부족한 부분은 의상 블렌딩입니다. 카디건은 모델이 입은 것이 아니라 붙인 것처럼 보이고, 흰색 네크라인 라벨이 번져 보입니다. 싱글 패스 세대는 이런 종류의 세밀한 의류와 신체 통합에 어려움을 겪기 때문에 요약에서 해결 방법을 다룹니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog-images/image10.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-10-Batch-Generation-for-All-New-Products" class="common-anchor-header">10단계: 모든 신제품에 대한 배치 생성</h3><p>전체 파이프라인을 단일 함수로 묶어 나머지 신제품에 대해 실행합니다. 여기서는 간결성을 위해 배치 코드를 생략하므로 전체 구현이 필요한 경우 문의하세요.</p>
<p>배치 결과에서 두 가지가 눈에 띕니다. 여름용 원피스와 겨울용 니트는 계절, 사용 사례, 액세서리에 따라 각기 다른 장면 설명을 받는 등 <strong>Qwen 3.5의</strong> 스타일 프롬프트가 제품별로 의미 있게 조정된다는 점입니다. <strong>나노 바나나 2에서</strong> 얻은 이미지는 조명, 질감, 구도 면에서 실제 스튜디오 사진에 뒤지지 않습니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog-images/image3.png" alt="" class="doc-image" id="" />
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
    </button></h2><p>이 글에서는 나노 바나나 2가 이커머스 이미지 생성에 제공하는 기능을 살펴보고, 실제 제작 작업에서 기존 나노 바나나 및 프로와 비교했으며, Milvus, Qwen 3.5 및 나노 바나나 2로 베스트셀러 이미지 파이프라인을 구축하는 방법을 살펴봤습니다.</p>
<p>이 파이프라인에는 네 가지 실질적인 이점이 있습니다:</p>
<ul>
<li><strong>통제된 비용, 예측 가능한 예산.</strong> 임베딩 모델(Llama Nemotron Embed VL 1B v2)은 OpenRouter에서 무료로 제공됩니다. 나노 바나나 2는 이미지당 비용이 프로의 약 절반 수준이며, 기본 멀티포맷 출력을 통해 유효 비용을 두 배 또는 세 배로 늘리던 재작업 주기를 없앴습니다. 시즌당 수천 개의 SKU를 관리하는 이커머스 팀의 경우, 이러한 예측 가능성은 예산 초과 없이 카탈로그에 맞춰 이미지 제작을 확장할 수 있다는 것을 의미합니다.</li>
<li><strong>엔드투엔드 자동화, 더 빠른 리스팅 시간.</strong> 평면적인 제품 사진에서 완성된 홍보 이미지로 이어지는 흐름은 수동 개입 없이 실행됩니다. 카탈로그 회전율이 가장 높은 성수기에 가장 중요한 신제품을 창고 사진에서 마켓플레이스에 등록할 수 있는 이미지로 만드는 데 며칠이 걸리지 않고 몇 분 만에 완료할 수 있습니다.</li>
<li><strong>로컬 GPU가 필요하지 않아 진입 장벽이 낮습니다.</strong> 모든 모델은 OpenRouter API를 통해 실행됩니다. ML 인프라나 전담 엔지니어링 인력이 없는 팀도 노트북으로 이 파이프라인을 실행할 수 있습니다. 프로비저닝할 것도, 유지 관리할 것도, 하드웨어에 대한 초기 투자도 없습니다.</li>
<li><strong>더 높은 검색 정확도, 더 강력한 브랜드 일관성.</strong> Milvus는 단일 쿼리에서 밀도, 스파스 및 스칼라 필터링을 결합하여 제품 매칭에 대한 단일 벡터 접근 방식보다 일관되게 뛰어난 성능을 발휘합니다. 이는 실제로 생성된 이미지가 기존 베스트셀러에서 이미 전환율이 입증된 조명, 구도, 스타일링 등 브랜드의 확립된 시각적 언어를 보다 안정적으로 계승한다는 것을 의미합니다. 결과물은 일반적인 AI 스톡 아트와 달리 스토어에 어울리는 것처럼 보입니다.</li>
</ul>
<p>미리 알아두어야 할 제한 사항도 있습니다:</p>
<ul>
<li><strong>의복과 바디 블렌딩.</strong> 단일 패스 생성은 의상을 착용한 것이 아니라 합성한 것처럼 보이게 만들 수 있습니다. 작은 액세서리와 같은 미세한 디테일이 흐릿하게 표현되기도 합니다. 해결 방법: 단계별로 생성(배경 먼저, 모델 포즈, 합성)합니다. 이 멀티패스 방식은 각 단계의 범위를 좁히고 블렌딩 품질을 크게 향상시킵니다.</li>
<li><strong>가장자리 케이스의 디테일 충실도.</strong> 액세서리, 패턴 및 텍스트가 많은 레이아웃은 선명도가 떨어질 수 있습니다. 해결 방법: 생성 프롬프트에 명시적인 제약 조건을 추가합니다("옷이 몸에 자연스럽게 맞음, 라벨이 노출되지 않음, 추가 요소 없음, 제품 디테일이 선명함"). 특정 제품의 품질이 여전히 부족하다면 최종적으로 나노 바나나 프로로 전환하세요.</li>
</ul>
<p><a href="https://milvus.io/">Milvus는</a> 하이브리드 검색 단계를 지원하는 오픈 소스 벡터 데이터베이스로, 직접 제품 사진을 찾아보거나 교체해보고 싶다면 <a href="https://milvus.io/docs"></a><a href="https://milvus.io/docs">퀵스타트에서</a> 10분 정도 소요됩니다. <a href="https://discord.gg/milvus"></a><a href="https://discord.gg/milvus"> Discord와</a> Slack에 꽤 활발한 커뮤니티가 있으며, 이를 통해 사람들이 무엇을 만들어내는지 보고 싶습니다. 그리고 다른 제품군이나 더 큰 카탈로그에 대해 나노 바나나 2를 실행하게 되면 그 결과를 공유해 주세요! 여러분의 의견을 듣고 싶습니다.</p>
<h2 id="Keep-Reading" class="common-anchor-header">계속 읽기<button data-href="#Keep-Reading" class="anchor-icon" translate="no">
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
<li><a href="https://milvus.io/blog/nano-banana-milvus-turning-hype-into-enterprise-ready-multimodal-rag.md">나노 바나나 + 밀버스: 과대광고를 엔터프라이즈급 멀티모달 RAG로 전환하기</a></li>
<li><a href="https://milvus.io/blog/openclaw-formerly-clawdbot-moltbot-explained-a-complete-guide-to-the-autonomous-ai-agent.md">OpenClaw란 무엇인가요? 오픈 소스 AI 에이전트에 대한 전체 가이드</a></li>
<li><a href="https://milvus.io/blog/stepbystep-guide-to-setting-up-openclaw-previously-clawdbotmoltbot-with-slack.md">OpenClaw 튜토리얼: 로컬 AI 어시스턴트를 위해 Slack에 연결하기</a></li>
<li><a href="https://milvus.io/blog/we-extracted-openclaws-memory-system-and-opensourced-it-memsearch.md">OpenClaw의 메모리 시스템을 추출하여 오픈 소스화(memsearch)</a></li>
<li><a href="https://milvus.io/blog/adding-persistent-memory-to-claude-code-with-the-lightweight-memsearch-plugin.md">클로드 코드를 위한 퍼시스턴트 메모리: memsearch ccplugin</a></li>
</ul>
