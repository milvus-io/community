---
id: optimizing-billion-scale-image-search-milvus-part-1.md
title: 개요
author: Rife Wang
date: 2020-08-04T20:39:09.882Z
desc: >-
  업윤의 사례 연구. Milvus가 기존 데이터베이스 솔루션과 차별화되어 이미지 유사도 검색 시스템을 구축하는 데 어떻게 도움이 되는지
  알아보세요.
cover: assets.zilliz.com/header_23bbd76c8b.jpg
tag: Scenarios
canonicalUrl: 'https://zilliz.com/blog/optimizing-billion-scale-image-search-milvus-part-1'
---
<custom-h1>수십억 장 규모의 이미지 검색 최적화를 위한 여정 (1/2)</custom-h1><p>수천만 명의 사용자에게 서비스를 제공하고 수백억 장의 사진을 관리하는 Yupoo Picture Manager. 사용자 갤러리가 점점 더 커짐에 따라 Yupoo는 이미지를 빠르게 찾을 수 있는 솔루션이 절실히 필요했습니다. 즉, 사용자가 이미지를 입력하면 시스템이 갤러리에서 원본 이미지와 유사한 이미지를 찾아내야 했습니다. 이미지로 검색 서비스의 개발은 이 문제에 대한 효과적인 접근 방식을 제공합니다.</p>
<p>이미지로 검색 서비스는 두 번의 진화를 거쳤습니다:</p>
<ol>
<li>2019년 초에 첫 번째 기술 조사를 시작하여 2019년 3월과 4월에 1세대 시스템을 출시했습니다;</li>
<li>2020년 초에 업그레이드 계획 조사를 시작하여 2020년 4월에 2세대 시스템으로의 전반적인 업그레이드를 시작했습니다.</li>
</ol>
<p>이 글에서는 이 프로젝트에 직접 참여한 경험을 바탕으로 2세대 이미지 검색 시스템의 기술 선정과 기본 원칙에 대해 설명합니다.</p>
<h2 id="Overview" class="common-anchor-header">개요<button data-href="#Overview" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="What-is-an-image" class="common-anchor-header">이미지란 무엇인가요?</h3><p>이미지를 다루기 전에 이미지가 무엇인지 알아야 합니다.</p>
<p>정답은 이미지가 픽셀의 집합이라는 것입니다.</p>
<p>예를 들어, 이 이미지의 빨간색 상자 안의 부분은 사실상 픽셀의 연속입니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_what_is_an_image_021e0280cc.png" alt="1-what-is-an-image.png" class="doc-image" id="1-what-is-an-image.png" />
   </span> <span class="img-wrapper"> <span>1-이미지란 무엇인가.png</span> </span></p>
<p>빨간색 상자 안의 부분이 이미지라고 가정하면 이미지의 각 독립적인 작은 사각형이 기본 정보 단위인 픽셀입니다. 그러면 이미지의 크기는 11 x 11 픽셀입니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_what_is_an_image_602a91b4a0.png" alt="2-what-is-an-image.png" class="doc-image" id="2-what-is-an-image.png" />
   </span> <span class="img-wrapper"> <span>2-이미지란 무엇인가.png</span> </span></p>
<h3 id="Mathematical-representation-of-images" class="common-anchor-header">이미지의 수학적 표현</h3><p>각 이미지는 매트릭스로 표현할 수 있습니다. 이미지의 각 픽셀은 행렬의 요소에 해당합니다.</p>
<h3 id="Binary-images" class="common-anchor-header">이진 이미지</h3><p>이진 이미지의 픽셀은 검은색 또는 흰색이므로 각 픽셀은 0 또는 1로 표현할 수 있습니다. 예를 들어 4 * 4 이진 이미지의 행렬 표현은 다음과 같습니다:</p>
<pre><code translate="no">0 1 0 1
1 0 0 0
1 1 1 0
0 0 1 0
</code></pre>
<h3 id="RGB-images" class="common-anchor-header">RGB 이미지</h3><p>세 가지 기본 색상(빨강, 초록, 파랑)을 혼합하여 모든 색상을 만들 수 있습니다. RGB 이미지의 경우 각 픽셀에는 3개의 RGB 채널의 기본 정보가 있습니다. 마찬가지로 각 채널이 8비트 숫자(256레벨)를 사용하여 회색조를 표현하면 픽셀의 수학적 표현은 다음과 같습니다:</p>
<pre><code translate="no">([0 .. 255], [0 .. 255], [0 .. 255])
</code></pre>
<p>4 * 4 RGB 이미지를 예로 들어 보겠습니다:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_4_x_4_rgb_image_136cec77ce.png" alt="3-4-x-4-rgb-image.png" class="doc-image" id="3-4-x-4-rgb-image.png" />
   </span> <span class="img-wrapper"> <span>3-4-x-4-rgb-image.png</span> </span></p>
<p>이미지 처리의 핵심은 이러한 픽셀 행렬을 처리하는 것입니다.</p>
<h2 id="The-technical-problem-of-search-by-image" class="common-anchor-header">이미지로 검색할 때의 기술적 문제<button data-href="#The-technical-problem-of-search-by-image" class="anchor-icon" translate="no">
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
    </button></h2><p>원본 이미지, 즉 정확히 동일한 픽셀을 가진 이미지를 찾고 있다면 MD5 값을 직접 비교할 수 있습니다. 그러나 인터넷에 업로드된 이미지는 압축되거나 워터마크가 있는 경우가 많습니다. 이미지에 작은 변화가 있어도 MD5 결과가 달라질 수 있습니다. 픽셀에 불일치가 있는 한 원본 이미지를 찾는 것은 불가능합니다.</p>
<p>이미지별 검색 시스템의 경우 콘텐츠가 비슷한 이미지를 검색하고자 합니다. 그러기 위해서는 두 가지 기본적인 문제를 해결해야 합니다:</p>
<ul>
<li>이미지를 컴퓨터가 처리할 수 있는 데이터 형식으로 표현하거나 추상화합니다.</li>
<li>데이터는 계산을 위해 비교할 수 있어야 합니다.</li>
</ul>
<p>보다 구체적으로 다음과 같은 기능이 필요합니다:</p>
<ul>
<li>이미지 특징 추출.</li>
<li>특징 계산(유사도 계산).</li>
</ul>
<h2 id="The-first-generation-search-by-image-system" class="common-anchor-header">1세대 이미지별 검색 시스템<button data-href="#The-first-generation-search-by-image-system" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Feature-extraction--image-abstraction" class="common-anchor-header">특징 추출 - 이미지 추상화</h3><p>1세대 이미지 기반 검색 시스템은 특징 추출을 위해 지각 해시 또는 pHash 알고리즘을 사용합니다. 이 알고리즘의 기본은 무엇인가요?</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/4_first_generation_image_search_ffd7088158.png" alt="4-first-generation-image-search.png" class="doc-image" id="4-first-generation-image-search.png" />
   </span> <span class="img-wrapper"> <span>4-1세대 이미지 검색.png</span> </span></p>
<p>위 그림에서 볼 수 있듯이 pHash 알고리즘은 해시값을 얻기 위해 이미지에 대해 일련의 변환을 수행합니다. 변환 과정에서 알고리즘은 이미지를 지속적으로 추상화하여 유사한 이미지의 결과를 서로 더 가깝게 만듭니다.</p>
<h3 id="Feature-calculation--similarity-calculation" class="common-anchor-header">특징 계산 - 유사도 계산</h3><p>두 이미지의 해시 값 간의 유사도를 계산하는 방법은 무엇인가요? 해밍 거리를 사용하는 것이 정답입니다. 해밍 거리가 작을수록 이미지의 콘텐츠가 더 유사하다는 뜻입니다.</p>
<p>해밍 거리란 무엇인가요? 서로 다른 비트의 수입니다.</p>
<p>예를 들어</p>
<pre><code translate="no">Value 1： 0 1 0 1 0
Value 2： 0 0 0 1 1
</code></pre>
<p>위의 두 값에는 서로 다른 비트가 두 개 있으므로 두 값 사이의 해밍 거리는 2입니다.</p>
<p>이제 유사도 계산의 원리를 알았습니다. 다음 질문은 1억 장의 사진에서 1억 장의 데이터의 해밍 거리를 어떻게 계산할 수 있을까요? 즉, 어떻게 비슷한 이미지를 검색할 수 있을까요?</p>
<p>프로젝트 초기에는 해밍 거리를 빠르게 계산할 수 있는 만족스러운 도구(또는 컴퓨팅 엔진)를 찾지 못했습니다. 그래서 계획을 변경했습니다.</p>
<p>제 생각은 두 pHash 값의 해밍 거리가 작으면 pHash 값을 줄일 수 있고 그에 해당하는 작은 부분은 같을 가능성이 높다는 것입니다.</p>
<p>예를 들어</p>
<pre><code translate="no">Value 1： 8 a 0 3 0 3 f 6
Value 2： 8 a 0 3 0 3 d 8
</code></pre>
<p>위의 두 값을 8개의 세그먼트로 나누면 6개 세그먼트의 값이 정확히 동일합니다. 해밍 거리가 가깝기 때문에 두 이미지가 비슷하다는 것을 유추할 수 있습니다.</p>
<p>변환 후 해밍 거리를 계산하는 문제가 동등성을 맞추는 문제로 바뀌었음을 알 수 있습니다. 각 pHash 값을 8개의 세그먼트로 나누면 정확히 같은 값을 가진 세그먼트가 5개 이상이면 두 pHash 값은 유사합니다.</p>
<p>따라서 동등성 일치를 해결하는 것은 매우 간단합니다. 기존 데이터베이스 시스템의 고전적인 필터링을 사용할 수 있습니다.</p>
<p>물론 저는 다중 용어 일치를 사용하고 ElasticSearch에서 minimum_should_match를 사용하여 일치 정도를 지정합니다(이 글에서는 ES의 원리를 소개하지 않으므로 직접 학습할 수 있습니다).</p>
<p>왜 ElasticSearch를 선택해야 할까요? 첫째, 위에서 언급한 검색 기능을 제공합니다. 둘째, 이미지 매니저 프로젝트 자체에서 ES를 사용하여 전체 텍스트 검색 기능을 제공하고 있어 기존 리소스를 사용하는 것이 매우 경제적입니다.</p>
<h2 id="Summary-of-the-first-generation-system" class="common-anchor-header">1세대 시스템 요약<button data-href="#Summary-of-the-first-generation-system" class="anchor-icon" translate="no">
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
    </button></h2><p>1세대 이미지 기반 검색 시스템은 다음과 같은 특징을 가진 pHash + ElasticSearch 솔루션을 선택했습니다:</p>
<ul>
<li>pHash 알고리즘은 사용이 간단하고 어느 정도의 압축, 워터마크, 노이즈에 저항할 수 있습니다.</li>
<li>ElasticSearch는 검색에 추가 비용을 추가하지 않고 프로젝트의 기존 리소스를 사용합니다.</li>
<li>하지만 이 시스템의 한계는 분명합니다. pHash 알고리즘은 전체 이미지를 추상적으로 표현한 것입니다. 원본 이미지에 검은색 테두리를 추가하는 등 이미지의 무결성을 파괴하면 원본과 다른 이미지 간의 유사성을 판단하는 것이 거의 불가능합니다.</li>
</ul>
<p>이러한 한계를 극복하기 위해 기반 기술이 완전히 다른 2세대 이미지 검색 시스템이 등장했습니다.</p>
<p>이 글은 밀버스 사용자이자 UPYUN의 소프트웨어 엔지니어인 rifewang이 작성했습니다. 이 기사가 마음에 드신다면 댓글을 남겨주세요! https://github.com/rifewang</p>
