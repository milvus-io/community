---
id: will-gemini-embedding-2-kill-multi-vector-search-in-vector-databases.md
title: Gemini 임베딩 2가 벡터 데이터베이스에서 멀티 벡터 검색을 죽일까요?
author: Jack Li
date: 2026-3-13
cover: assets.zilliz.com/blog_Gemini_Embedding2_4_62bc980b71.png
tag: Engineering
recommend: false
publishToMedium: true
tags: >-
  multi-vector search, gemini embedding 2, multimodal embeddings,  milvus,
  vector database
meta_keywords: >-
  multi-vector search, gemini embedding 2, multimodal embeddings,  milvus,
  vector database
meta_title: |
  Will Gemini Embedding 2 kill Multi-Vector Search in Vector Databases?
desc: >-
  Google의 Gemini Embedding 2는 텍스트, 이미지, 동영상, 오디오를 하나의 벡터로 매핑합니다. 그러면 다중 벡터 검색이
  쓸모없게 되나요? 아니요, 그 이유는 다음과 같습니다.
origin: >-
  https://milvus.io/blog/will-gemini-embedding-2-kill-multi-vector-search-in-vector-databases.md
---
<p>Google은 텍스트, 이미지, 동영상, 오디오, 문서를 단일 벡터 공간에 매핑하는 최초의 멀티모달 임베딩 모델인 <a href="https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-embedding-2/">Gemini 임베딩 2를</a> 출시했습니다.</p>
<p>한 번의 API 호출로 동영상 클립, 제품 사진, 텍스트 단락을 임베드할 수 있으며 모두 동일한 시맨틱 영역에 배치됩니다.</p>
<p>이와 같은 모델을 사용하기 전에는 각 모달리티를 자체 전문 모델을 통해 실행한 다음 각 출력을 별도의 벡터 열에 저장해야 했습니다. <a href="https://milvus.io/docs/multi-vector-search.md">Milvus와</a> 같은 벡터 데이터베이스의 다중 벡터 열은 이러한 시나리오를 위해 정확하게 구축되었습니다.</p>
<p>여러 모달리티를 동시에 매핑하는 Gemini Embedding 2를 사용하면 Gemini Embedding 2가 멀티 벡터 열을 얼마나 대체할 수 있으며, 어디가 부족한지 의문이 생깁니다. 이 게시물에서는 각 접근 방식이 적합한 부분과 함께 작동하는 방식을 살펴봅니다.</p>
<h2 id="What’s-Different-About-Gemini-Embedding-2-When-Compared-to-CLIPCLAP" class="common-anchor-header">Gemini 임베딩 2는 CLIP/CLAP과 비교했을 때 어떤 점이 다른가요?<button data-href="#What’s-Different-About-Gemini-Embedding-2-When-Compared-to-CLIPCLAP" class="anchor-icon" translate="no">
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
    </button></h2><p>임베딩 모델은 비정형 데이터를 고밀도 벡터로 변환하여 의미적으로 유사한 항목이 벡터 공간에서 함께 클러스터링되도록 합니다. Gemini 임베딩 2는 별도의 모델이나 스티칭 파이프라인 없이 모든 모달리티에 걸쳐 이 작업을 기본적으로 수행한다는 점이 다릅니다.</p>
<p>지금까지 멀티 모달 임베딩은 대조 학습으로 훈련된 듀얼 인코더 모델을 의미했습니다: 이미지-텍스트용 <a href="https://openai.com/index/clip/">CLIP</a>, 오디오-텍스트용 <a href="https://arxiv.org/abs/2211.06687">CLAP으로</a> 각각 정확히 두 가지 모달리티를 처리했습니다. 세 가지가 모두 필요한 경우에는 여러 모델을 실행하고 임베딩 공간을 직접 조정해야 했습니다.</p>
<p>예를 들어 표지 아트가 있는 팟캐스트를 색인하려면 이미지에는 CLIP, 오디오에는 CLAP, 대본에는 텍스트 인코더 등 세 가지 모델, 세 가지 벡터 공간, 쿼리 시점에 점수를 비교할 수 있도록 하는 사용자 정의 융합 로직을 실행해야 했습니다.</p>
<p><a href="https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-embedding-2/">Google의 공식 발표에</a> 따르면 Gemini Embedding 2가 지원하는 기능은 다음과 같습니다:</p>
<ul>
<li>요청당 최대 8,192개의 토큰<strong>텍스트</strong> </li>
<li>요청당 최대 6개의<strong>이미지</strong> (PNG, JPEG)</li>
<li><strong>동영상</strong> 최대 120초(MP4, MOV)</li>
<li><strong>오디오</strong> 최대 80초, ASR 트랜스크립션 없이 기본적으로 임베드됨</li>
<li><strong>문서</strong> PDF 입력, 최대 6페이지</li>
</ul>
<p>단일 임베딩 호출에 이미지 + 텍스트<strong>혼합 입력</strong> </p>
<h3 id="Gemini-Embedding-2-vs-CLIPCLAP-One-Model-vs-Many-for-Multimodal-Embeddings" class="common-anchor-header">Gemini 임베딩 2 대 CLIP/CLAP 멀티모달 임베딩을 위한 하나의 모델 대 다수의 모델</h3><table>
<thead>
<tr><th></th><th><strong>듀얼 인코더(CLIP, CLAP)</strong></th><th><strong>제미니 임베딩 2</strong></th></tr>
</thead>
<tbody>
<tr><td><strong>모델당 모달리티 수</strong></td><td>2(예: 이미지 + 텍스트)</td><td>5(텍스트, 이미지, 비디오, 오디오, PDF)</td></tr>
<tr><td><strong>새 모달리티 추가하기</strong></td><td>다른 모델을 가져와 수동으로 공백을 정렬합니다.</td><td>이미 포함됨 - API 호출 한 번</td></tr>
<tr><td><strong>교차 모달 입력</strong></td><td>별도의 인코더, 별도의 호출</td><td>인터리브 입력(예: 하나의 요청에 이미지 + 텍스트)</td></tr>
<tr><td><strong>아키텍처</strong></td><td>대비 손실을 통해 정렬된 별도의 비전 및 텍스트 인코더</td><td>Gemini의 멀티모달 이해를 계승한 단일 모델</td></tr>
</tbody>
</table>
<h2 id="Gemini-Embedding-2’s-Advantage-Pipeline-Simplification" class="common-anchor-header">Gemini 임베딩 2의 장점: 파이프라인 간소화<button data-href="#Gemini-Embedding-2’s-Advantage-Pipeline-Simplification" class="anchor-icon" translate="no">
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
    </button></h2><p>짧은 비디오 라이브러리에 시맨틱 검색 엔진을 구축하는 일반적인 시나리오를 예로 들어보겠습니다. 각 클립에는 시각적 프레임, 음성 오디오, 자막 텍스트가 있으며 모두 동일한 콘텐츠를 설명합니다.</p>
<p><strong>Gemini 임베딩 2 이전에는</strong> 3개의 개별 임베딩 모델(이미지, 오디오, 텍스트), 3개의 벡터 열, 그리고 다방향 리콜, 결과 융합, 중복 제거를 수행하는 검색 파이프라인이 필요했습니다. 이는 구축 및 유지 관리해야 할 움직이는 부분이 많다는 뜻입니다.</p>
<p><strong>이제</strong> 동영상의 프레임, 오디오, 자막을 단일 API 호출로 제공하고 전체 시맨틱 그림을 캡처하는 하나의 통합된 벡터를 얻을 수 있습니다.</p>
<p>당연히 다중 벡터 열은 죽었다고 결론 내리고 싶을 것입니다. 그러나 이러한 결론은 "다중 모드 통합 표현"과 "다차원 벡터 검색"을 혼동하는 것입니다. 이 둘은 서로 다른 문제를 해결하며, 올바른 접근 방식을 선택하려면 그 차이를 이해하는 것이 중요합니다.</p>
<h2 id="What-is-Multi-Vector-Search-in-Milvus" class="common-anchor-header">Milvus에서 다중 벡터 검색이란 무엇인가요?<button data-href="#What-is-Multi-Vector-Search-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="http://milvus.io">Milvus에서</a> 다중 벡터 검색이란 동일한 항목을 여러 개의 벡터 필드를 통해 한 번에 검색한 다음 그 결과를 결합하여 순위를 재조정하는 것을 의미합니다.</p>
<p>핵심 아이디어는 하나의 개체가 두 가지 이상의 의미를 지니는 경우가 많다는 것입니다. 제품에는 <em>제목과</em> 설명이 있습니다. 소셜 미디어 게시물에는 <em>캡션과</em> 이미지가 있습니다. 각 각도는 서로 다른 정보를 전달하므로 각각 고유한 벡터 필드를 갖게 됩니다.</p>
<p>Milvus는 모든 벡터 필드를 독립적으로 검색한 다음 재랭커를 사용하여 후보 집합을 병합합니다. API에서 각 요청은 서로 다른 필드와 검색 구성에 매핑되며, hybrid_search()는 결합된 결과를 반환합니다.</p>
<p>여기에는 두 가지 일반적인 패턴이 있습니다:</p>
<ul>
<li><strong>스파스+고밀도 벡터 검색.</strong> 사용자가 "빨간색 나이키 에어 맥스 사이즈 10"과 같은 쿼리를 입력하는 제품 카탈로그가 있다고 가정해 보겠습니다. 고밀도 벡터는 의미론적 의도("운동화, 빨간색, 나이키")는 파악하지만 정확한 사이즈는 놓칩니다. <a href="https://milvus.io/docs/full-text-search.md">BM25를</a> 통한 스파스 벡터나 <a href="https://milvus.io/docs/full_text_search_with_milvus.md">BGE-M3와</a> 같은 모델은 키워드 매칭을 정확히 찾아냅니다. 두 가지 모두 병렬로 실행한 다음 다시 순위를 매겨야 합니다. 자연어와 SKU, 파일 이름 또는 오류 코드와 같은 특정 식별자가 혼합된 쿼리에 대해서는 어느 하나만으로는 좋은 결과를 얻을 수 없기 때문입니다.</li>
<li><strong>멀티모달 벡터 검색.</strong> 사용자가 드레스 사진을 업로드하고 "이와 비슷하지만 파란색"이라고 입력합니다. 시각적 유사성을 위해 이미지 임베딩 열과 색상 제약 조건을 위해 텍스트 임베딩 열을 동시에 검색합니다. 각 열에는 고유한 인덱스와 모델(이미지의 경우 <a href="https://openai.com/index/clip/">CLIP</a>, 설명의 경우 텍스트 인코더)이 있으며 결과가 병합됩니다.</li>
</ul>
<p><a href="https://milvus.io/">Milvus는</a> 두 패턴을 모두 병렬 <a href="https://milvus.io/docs/multi-vector-search.md">ANN 검색으로</a> 실행하고 RRFRanker를 통해 기본 재랭킹을 수행합니다. 스키마 정의, 다중 인덱스 구성, 기본 제공 BM25가 모두 하나의 시스템에서 처리됩니다.</p>
<p>예를 들어, 각 항목에 텍스트 설명과 이미지가 포함된 제품 카탈로그를 생각해 보세요. 이 데이터에 대해 세 가지 검색을 동시에 실행할 수 있습니다:</p>
<ul>
<li><strong>시맨틱 텍스트 검색.</strong> <a href="https://zilliz.com/learn/explore-colbert-token-level-embedding-and-ranking-model-for-similarity-search?_gl=1*d243m9*_gcl_au*MjcyNTAwMzUyLjE3NDMxMzE1MjY.*_ga*MTQ3OTI4MDc5My4xNzQzMTMxNTI2*_ga_KKMVYG8YF2*MTc0NTkwODU0Mi45NC4xLjE3NDU5MDg4MzcuMC4wLjA.#A-Quick-Recap-of-BERT">BERT</a>, <a href="https://zilliz.com/learn/NLP-essentials-understanding-transformers-in-AI?_gl=1*d243m9*_gcl_au*MjcyNTAwMzUyLjE3NDMxMzE1MjY.*_ga*MTQ3OTI4MDc5My4xNzQzMTMxNTI2*_ga_KKMVYG8YF2*MTc0NTkwODU0Mi45NC4xLjE3NDU5MDg4MzcuMC4wLjA.">Transformers</a> 또는 <a href="https://zilliz.com/learn/guide-to-using-openai-text-embedding-models">OpenAI</a> 임베딩 API와 같은 모델에서 생성된 고밀도 벡터로 텍스트 설명을 쿼리합니다.</li>
<li><strong>전체 텍스트 검색.</strong> <a href="https://zilliz.com/learn/mastering-bm25-a-deep-dive-into-the-algorithm-and-application-in-milvus">BM25를</a> 사용하는 스파스 벡터 또는 <a href="https://zilliz.com/learn/bge-m3-and-splade-two-machine-learning-models-for-generating-sparse-embeddings?_gl=1*1cde1oq*_gcl_au*MjcyNTAwMzUyLjE3NDMxMzE1MjY.*_ga*MTQ3OTI4MDc5My4xNzQzMTMxNTI2*_ga_KKMVYG8YF2*MTc0NTkwODU0Mi45NC4xLjE3NDU5MDg4MzcuMC4wLjA.#BGE-M3">BGE-M3</a> 또는 <a href="https://zilliz.com/learn/bge-m3-and-splade-two-machine-learning-models-for-generating-sparse-embeddings?_gl=1*ov2die*_gcl_au*MjcyNTAwMzUyLjE3NDMxMzE1MjY.*_ga*MTQ3OTI4MDc5My4xNzQzMTMxNTI2*_ga_KKMVYG8YF2*MTc0NTkwODU0Mi45NC4xLjE3NDU5MDg4MzcuMC4wLjA.#SPLADE">SPLADE와</a> 같은 스파스 임베딩 모델을 사용하여 텍스트 설명을 쿼리합니다.</li>
<li><strong>크로스 모달 이미지 검색.</strong> <a href="https://zilliz.com/learn/exploring-openai-clip-the-future-of-multimodal-ai-learning">CLIP과</a> 같은 모델의 고밀도 벡터를 사용하여 텍스트 쿼리를 통해 제품 이미지를 쿼리할 수 있습니다.</li>
</ul>
<h2 id="With-Gemini-Embedding-2-Will-Multi-Vector-Search-Still-Matter" class="common-anchor-header">Gemini Embedding 2에서도 멀티 벡터 검색이 여전히 중요할까요?<button data-href="#With-Gemini-Embedding-2-Will-Multi-Vector-Search-Still-Matter" class="anchor-icon" translate="no">
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
    </button></h2><p>Gemini Embedding 2는 한 번의 호출로 더 많은 모달리티를 처리하므로 파이프라인이 상당히 간소화됩니다. 하지만 통합된 멀티모달 임베딩은 멀티벡터 검색과 같은 의미는 아닙니다. 즉, 멀티 벡터 검색은 여전히 중요합니다.</p>
<p>Gemini Embedding 2는 텍스트, 이미지, 동영상, 오디오, 문서를 하나의 공유 벡터 공간에 매핑합니다. Google은 모든 모달리티가 동일한 콘텐츠를 설명하고 모달리티 간 중첩이 많아 단일 벡터가 적합한 시나리오인 멀티모달 시맨틱 검색, 문서 검색 및 추천에 이 <a href="https://developers.googleblog.com/en/gemini-embedding-model-now-available/">기술을 배치합니다</a>.</p>
<p><a href="https://milvus.io/docs/multi-vector-search.md">Milvus</a> 다중 벡터 검색은 다른 문제를 해결합니다. 예를 들어 제목과 설명, 텍스트와 이미지 <strong>등 여러 벡터 필드를</strong>통해 동일한 개체를 검색한 다음 검색 중에 이러한 신호를 결합하는 방식입니다. 즉, 모든 것을 하나의 표현으로 압축하는 것이 아니라 동일한 항목에 대한 <strong>여러 시맨틱 뷰를</strong> 보존하고 쿼리하는 것입니다.</p>
<p>하지만 실제 데이터는 하나의 임베딩에 들어맞는 경우가 거의 없습니다. 생체인식 시스템, 에이전트 도구 검색, 혼합 의도 이커머스 등은 모두 완전히 다른 시맨틱 공간에 존재하는 벡터에 의존합니다. 바로 이 지점에서 통합 임베딩의 효과가 중단됩니다.</p>
<h3 id="Why-One-Embedding-Isnt-Enough-Multi-Vector-Retrieval-in-Practice" class="common-anchor-header">임베딩 하나만으로는 충분하지 않은 이유: 실제에서의 멀티 벡터 검색</h3><p>Gemini 임베딩 2는 모든 모달리티가 동일한 것을 설명하는 경우를 처리합니다. 다중 벡터 검색은 그 외의 모든 것을 처리하며, '그 외의 모든 것'은 대부분의 프로덕션 검색 시스템을 포괄합니다.</p>
<p><strong>생체 인식.</strong> 한 명의 사용자가 얼굴, 음성, 지문, 홍채 벡터를 가지고 있습니다. 이들은 의미상 겹치는 부분이 전혀 없는 완전히 독립적인 생물학적 특징을 설명합니다. 각각 고유한 열, 인덱스, 유사성 메트릭이 필요하기 때문에 하나의 벡터로 축소할 수 없습니다.</p>
<p><strong>에이전트 도구.</strong> OpenClaw와 같은 코딩 어시스턴트는 대화 기록("지난 주에 발생한 배포 문제")에 대한 고밀도 시맨틱 벡터와 파일 이름, CLI 명령, 구성 매개변수에 대한 정확한 매칭을 위한 희박한 BM25 벡터를 함께 저장합니다. 다양한 검색 목표, 다양한 벡터 유형, 독립적인 검색 경로를 통해 순위를 재조정합니다.</p>
<p><strong>다양한 의도를 가진 이커머스.</strong> 제품의 프로모션 비디오와 상세 이미지는 통합된 Gemini 임베딩으로 잘 작동합니다. 하지만 사용자가 "이렇게 생긴 드레스" <em>와</em> "같은 원단, M 사이즈"를 원하는 경우에는 시각적 유사성 열과 별도의 인덱스와 하이브리드 검색 레이어가 있는 구조화된 속성 열이 필요합니다.</p>
<h2 id="When-to-Use-Gemini-Embedding-2-vs-Multi-vector-Columns" class="common-anchor-header">Gemini 임베딩 2와 다중 벡터 열을 사용해야 하는 경우<button data-href="#When-to-Use-Gemini-Embedding-2-vs-Multi-vector-Columns" class="anchor-icon" translate="no">
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
    </button></h2><table>
<thead>
<tr><th><strong>시나리오</strong></th><th><strong>사용 대상</strong></th><th><strong>사용 이유</strong></th></tr>
</thead>
<tbody>
<tr><td>모든 모달리티가 동일한 콘텐츠(비디오 프레임 + 오디오 + 자막)를 설명하는 경우</td><td>Gemini 임베딩 2 통합 벡터</td><td>시맨틱 오버랩이 높다는 것은 하나의 벡터가 전체 그림을 캡처한다는 것을 의미하며, 융합이 필요하지 않습니다.</td></tr>
<tr><td>시맨틱 리콜(BM25 + 밀도)과 함께 키워드 정밀도가 필요합니다.</td><td>hybrid_search()를 사용한 다중 벡터 열</td><td>스파스 및 고밀도 벡터는 하나의 임베딩으로 축소할 수 없는 서로 다른 검색 목표를 지원합니다.</td></tr>
<tr><td>교차 모드 검색은 주요 사용 사례(텍스트 쿼리 → 이미지 결과)입니다.</td><td>Gemini 임베딩 2 통합 벡터</td><td>단일 공유 공간으로 크로스 모달 유사성 기본 제공</td></tr>
<tr><td>벡터는 근본적으로 다른 의미 공간(생체 인식, 구조화된 속성)에 존재합니다.</td><td>필드별 인덱스가 있는 다중 벡터 열</td><td>벡터 필드당 독립적인 유사성 메트릭과 인덱스 유형</td></tr>
<tr><td>파이프라인의 <em>단순성과</em> 세분화된 검색을 원하는 경우</td><td>둘 다 - 통합된 Gemini 벡터 + 동일한 컬렉션의 추가 스파스 또는 속성 열</td><td>Gemini는 멀티모달 컬럼을 처리하고, Milvus는 그 주변의 하이브리드 검색 레이어를 처리합니다.</td></tr>
</tbody>
</table>
<p>이 두 가지 접근 방식은 상호 배타적이지 않습니다. 통합된 멀티모달 열에 Gemini Embedding 2를 사용하면서 추가 스파스 또는 속성별 벡터를 동일한 <a href="https://milvus.io/">Milvus</a> 컬렉션 내의 별도 열에 저장할 수 있습니다.</p>
<h2 id="Quick-Start-Set-Up-Gemini-Embedding-2-+-Milvus" class="common-anchor-header">빠른 시작: Gemini Embedding 2 + Milvus 설정하기<button data-href="#Quick-Start-Set-Up-Gemini-Embedding-2-+-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>다음은 작동 데모입니다. 실행 중인 <a href="https://milvus.io/docs/install-overview.md">Milvus 또는 Zilliz Cloud 인스턴스와</a> GOOGLE_API_KEY가 필요합니다.</p>
<h3 id="Setup" class="common-anchor-header">설정</h3><pre><code translate="no">pip install google-genai pymilvus
<span class="hljs-keyword">export</span> <span class="hljs-variable constant_">GOOGLE_API_KEY</span>=<span class="hljs-string">&quot;your-api-key&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Full-Example" class="common-anchor-header">전체 예제</h3><pre><code translate="no"><span class="hljs-string">&quot;&quot;&quot;
Prerequisites:
    pip install google-genai pymilvus

Set environment variable:
    export GOOGLE_API_KEY=&quot;your-api-key&quot;
&quot;&quot;&quot;</span>

<span class="hljs-keyword">import</span> os
<span class="hljs-keyword">import</span> struct
<span class="hljs-keyword">import</span> numpy <span class="hljs-keyword">as</span> np
<span class="hljs-keyword">from</span> google <span class="hljs-keyword">import</span> genai
<span class="hljs-keyword">from</span> google.genai <span class="hljs-keyword">import</span> types
<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient, DataType

<span class="hljs-comment"># ── Config ───────────────────────────────────────────────────────────────</span>
COLLECTION_NAME = <span class="hljs-string">&quot;gemini_multimodal_demo&quot;</span>
MILVUS_URI = <span class="hljs-string">&quot;http://localhost:19530&quot;</span>  <span class="hljs-comment"># Change to your Milvus address</span>
DIM = <span class="hljs-number">3072</span>  <span class="hljs-comment"># gemini-embedding-2-preview output dimension</span>
GEMINI_MODEL = <span class="hljs-string">&quot;gemini-embedding-2-preview&quot;</span>

<span class="hljs-comment"># ── Initialize clients ──────────────────────────────────────────────────</span>
gemini_client = genai.Client()  <span class="hljs-comment"># Uses GOOGLE_API_KEY env var</span>
milvus_client = MilvusClient(MILVUS_URI)

<span class="hljs-comment"># ── Helper: generate embedding ──────────────────────────────────────────</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">embed_texts</span>(<span class="hljs-params">texts: <span class="hljs-built_in">list</span>[<span class="hljs-built_in">str</span>], task_type: <span class="hljs-built_in">str</span> = <span class="hljs-string">&quot;SEMANTIC_SIMILARITY&quot;</span></span>) -&gt; <span class="hljs-built_in">list</span>[<span class="hljs-built_in">list</span>[<span class="hljs-built_in">float</span>]]:
    <span class="hljs-string">&quot;&quot;&quot;Embed a list of text strings.&quot;&quot;&quot;</span>
    result = gemini_client.models.embed_content(
        model=GEMINI_MODEL,
        contents=texts,
        config=types.EmbedContentConfig(task_type=task_type),
    )
    <span class="hljs-keyword">return</span> [e.values <span class="hljs-keyword">for</span> e <span class="hljs-keyword">in</span> result.embeddings]

<span class="hljs-keyword">def</span> <span class="hljs-title function_">embed_image</span>(<span class="hljs-params">image_path: <span class="hljs-built_in">str</span></span>) -&gt; <span class="hljs-built_in">list</span>[<span class="hljs-built_in">float</span>]:
    <span class="hljs-string">&quot;&quot;&quot;Embed an image file.&quot;&quot;&quot;</span>
    <span class="hljs-keyword">with</span> <span class="hljs-built_in">open</span>(image_path, <span class="hljs-string">&quot;rb&quot;</span>) <span class="hljs-keyword">as</span> f:
        image_bytes = f.read()
    mime = <span class="hljs-string">&quot;image/png&quot;</span> <span class="hljs-keyword">if</span> image_path.endswith(<span class="hljs-string">&quot;.png&quot;</span>) <span class="hljs-keyword">else</span> <span class="hljs-string">&quot;image/jpeg&quot;</span>
    result = gemini_client.models.embed_content(
        model=GEMINI_MODEL,
        contents=types.Part.from_bytes(data=image_bytes, mime_type=mime),
    )
    <span class="hljs-keyword">return</span> result.embeddings[<span class="hljs-number">0</span>].values

<span class="hljs-keyword">def</span> <span class="hljs-title function_">embed_audio</span>(<span class="hljs-params">audio_path: <span class="hljs-built_in">str</span></span>) -&gt; <span class="hljs-built_in">list</span>[<span class="hljs-built_in">float</span>]:
    <span class="hljs-string">&quot;&quot;&quot;Embed an audio file.&quot;&quot;&quot;</span>
    <span class="hljs-keyword">with</span> <span class="hljs-built_in">open</span>(audio_path, <span class="hljs-string">&quot;rb&quot;</span>) <span class="hljs-keyword">as</span> f:
        audio_bytes = f.read()
    mime_map = {<span class="hljs-string">&quot;.mp3&quot;</span>: <span class="hljs-string">&quot;audio/mpeg&quot;</span>, <span class="hljs-string">&quot;.wav&quot;</span>: <span class="hljs-string">&quot;audio/wav&quot;</span>, <span class="hljs-string">&quot;.flac&quot;</span>: <span class="hljs-string">&quot;audio/flac&quot;</span>}
    ext = os.path.splitext(audio_path)[<span class="hljs-number">1</span>].lower()
    mime = mime_map.get(ext, <span class="hljs-string">&quot;audio/mpeg&quot;</span>)
    result = gemini_client.models.embed_content(
        model=GEMINI_MODEL,
        contents=types.Part.from_bytes(data=audio_bytes, mime_type=mime),
    )
    <span class="hljs-keyword">return</span> result.embeddings[<span class="hljs-number">0</span>].values

<span class="hljs-comment"># ── 1. Create Milvus collection ─────────────────────────────────────────</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;=== Creating collection ===&quot;</span>)
<span class="hljs-keyword">if</span> milvus_client.has_collection(COLLECTION_NAME):
    milvus_client.drop_collection(COLLECTION_NAME)

schema = milvus_client.create_schema()
schema.add_field(<span class="hljs-string">&quot;id&quot;</span>, DataType.INT64, is_primary=<span class="hljs-literal">True</span>, auto_id=<span class="hljs-literal">True</span>)
schema.add_field(<span class="hljs-string">&quot;content&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">2000</span>)   <span class="hljs-comment"># description of the content</span>
schema.add_field(<span class="hljs-string">&quot;modality&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">20</span>)    <span class="hljs-comment"># &quot;text&quot;, &quot;image&quot;, &quot;audio&quot;</span>
schema.add_field(<span class="hljs-string">&quot;vector&quot;</span>, DataType.FLOAT_VECTOR, dim=DIM)

index_params = milvus_client.prepare_index_params()
index_params.add_index(
    field_name=<span class="hljs-string">&quot;vector&quot;</span>,
    index_type=<span class="hljs-string">&quot;AUTOINDEX&quot;</span>,
    metric_type=<span class="hljs-string">&quot;COSINE&quot;</span>,
)

milvus_client.create_collection(
    COLLECTION_NAME,
    schema=schema,
    index_params=index_params,
    consistency_level=<span class="hljs-string">&quot;Strong&quot;</span>,
)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Collection &#x27;<span class="hljs-subst">{COLLECTION_NAME}</span>&#x27; created (dim=<span class="hljs-subst">{DIM}</span>, metric=COSINE)&quot;</span>)

<span class="hljs-comment"># ── 2. Insert text embeddings ───────────────────────────────────────────</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n=== Inserting text embeddings ===&quot;</span>)
documents = [
    <span class="hljs-string">&quot;Artificial intelligence was founded as an academic discipline in 1956.&quot;</span>,
    <span class="hljs-string">&quot;The Mona Lisa is a half-length portrait painting by Leonardo da Vinci.&quot;</span>,
    <span class="hljs-string">&quot;Beethoven&#x27;s Symphony No. 9 premiered in Vienna on May 7, 1824.&quot;</span>,
    <span class="hljs-string">&quot;The Great Wall of China stretches over 13,000 miles across northern China.&quot;</span>,
    <span class="hljs-string">&quot;Jazz music originated in the African-American communities of New Orleans.&quot;</span>,
    <span class="hljs-string">&quot;The Hubble Space Telescope was launched into orbit on April 24, 1990.&quot;</span>,
    <span class="hljs-string">&quot;Vincent van Gogh painted The Starry Night while in an asylum in Saint-Rémy.&quot;</span>,
    <span class="hljs-string">&quot;Machine learning is a subset of AI focused on learning from data.&quot;</span>,
]

text_vectors = embed_texts(documents)
text_rows = [
    {<span class="hljs-string">&quot;content&quot;</span>: doc, <span class="hljs-string">&quot;modality&quot;</span>: <span class="hljs-string">&quot;text&quot;</span>, <span class="hljs-string">&quot;vector&quot;</span>: vec}
    <span class="hljs-keyword">for</span> doc, vec <span class="hljs-keyword">in</span> <span class="hljs-built_in">zip</span>(documents, text_vectors)
]
milvus_client.insert(COLLECTION_NAME, text_rows)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Inserted <span class="hljs-subst">{<span class="hljs-built_in">len</span>(text_rows)}</span> text documents&quot;</span>)

<span class="hljs-comment"># ── 3. (Optional) Insert image embeddings ───────────────────────────────</span>
<span class="hljs-comment"># Uncomment and provide real image paths to test multimodal search</span>
<span class="hljs-comment">#</span>
<span class="hljs-comment"># image_files = [</span>
<span class="hljs-comment">#     (&quot;photo of the Mona Lisa painting&quot;, &quot;mona_lisa.jpg&quot;),</span>
<span class="hljs-comment">#     (&quot;satellite photo of the Great Wall of China&quot;, &quot;great_wall.png&quot;),</span>
<span class="hljs-comment"># ]</span>
<span class="hljs-comment"># for desc, path in image_files:</span>
<span class="hljs-comment">#     if os.path.exists(path):</span>
<span class="hljs-comment">#         vec = embed_image(path)</span>
<span class="hljs-comment">#         milvus_client.insert(COLLECTION_NAME, [</span>
<span class="hljs-comment">#             {&quot;content&quot;: desc, &quot;modality&quot;: &quot;image&quot;, &quot;vector&quot;: vec}</span>
<span class="hljs-comment">#         ])</span>
<span class="hljs-comment">#         print(f&quot;Inserted image: {desc}&quot;)</span>

<span class="hljs-comment"># ── 4. (Optional) Insert audio embeddings ───────────────────────────────</span>
<span class="hljs-comment"># Uncomment and provide real audio paths to test multimodal search</span>
<span class="hljs-comment">#</span>
<span class="hljs-comment"># audio_files = [</span>
<span class="hljs-comment">#     (&quot;Beethoven Symphony No.9 excerpt&quot;, &quot;beethoven_9.mp3&quot;),</span>
<span class="hljs-comment">#     (&quot;jazz piano improvisation&quot;, &quot;jazz_piano.mp3&quot;),</span>
<span class="hljs-comment"># ]</span>
<span class="hljs-comment"># for desc, path in audio_files:</span>
<span class="hljs-comment">#     if os.path.exists(path):</span>
<span class="hljs-comment">#         vec = embed_audio(path)</span>
<span class="hljs-comment">#         milvus_client.insert(COLLECTION_NAME, [</span>
<span class="hljs-comment">#             {&quot;content&quot;: desc, &quot;modality&quot;: &quot;audio&quot;, &quot;vector&quot;: vec}</span>
<span class="hljs-comment">#         ])</span>
<span class="hljs-comment">#         print(f&quot;Inserted audio: {desc}&quot;)</span>

<span class="hljs-comment"># ── 5. Search ────────────────────────────────────────────────────────────</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n=== Searching ===&quot;</span>)

queries = [
    <span class="hljs-string">&quot;history of artificial intelligence&quot;</span>,
    <span class="hljs-string">&quot;famous Renaissance paintings&quot;</span>,
    <span class="hljs-string">&quot;classical music concerts&quot;</span>,
]

query_vectors = embed_texts(queries, task_type=<span class="hljs-string">&quot;SEMANTIC_SIMILARITY&quot;</span>)

<span class="hljs-keyword">for</span> query_text, query_vec <span class="hljs-keyword">in</span> <span class="hljs-built_in">zip</span>(queries, query_vectors):
    results = milvus_client.search(
        COLLECTION_NAME,
        data=[query_vec],
        limit=<span class="hljs-number">3</span>,
        output_fields=[<span class="hljs-string">&quot;content&quot;</span>, <span class="hljs-string">&quot;modality&quot;</span>],
        search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;COSINE&quot;</span>},
    )
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;\nQuery: &#x27;<span class="hljs-subst">{query_text}</span>&#x27;&quot;</span>)
    <span class="hljs-keyword">for</span> hits <span class="hljs-keyword">in</span> results:
        <span class="hljs-keyword">for</span> rank, hit <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(hits, <span class="hljs-number">1</span>):
            <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;  [<span class="hljs-subst">{rank}</span>] (score=<span class="hljs-subst">{hit[<span class="hljs-string">&#x27;distance&#x27;</span>]:<span class="hljs-number">.4</span>f}</span>, modality=<span class="hljs-subst">{hit[<span class="hljs-string">&#x27;entity&#x27;</span>][<span class="hljs-string">&#x27;modality&#x27;</span>]}</span>) &quot;</span>
                  <span class="hljs-string">f&quot;<span class="hljs-subst">{hit[<span class="hljs-string">&#x27;entity&#x27;</span>][<span class="hljs-string">&#x27;content&#x27;</span>][:<span class="hljs-number">80</span>]}</span>&quot;</span>)

<span class="hljs-comment"># ── 6. Cross-modal search example (image query -&gt; text results) ─────────</span>
<span class="hljs-comment"># Uncomment to search text collection using an image as query</span>
<span class="hljs-comment">#</span>
<span class="hljs-comment"># print(&quot;\n=== Cross-modal search: image -&gt; text ===&quot;)</span>
<span class="hljs-comment"># query_image_vec = embed_image(&quot;query_image.jpg&quot;)</span>
<span class="hljs-comment"># results = milvus_client.search(</span>
<span class="hljs-comment">#     COLLECTION_NAME,</span>
<span class="hljs-comment">#     data=[query_image_vec],</span>
<span class="hljs-comment">#     limit=3,</span>
<span class="hljs-comment">#     output_fields=[&quot;content&quot;, &quot;modality&quot;],</span>
<span class="hljs-comment">#     search_params={&quot;metric_type&quot;: &quot;COSINE&quot;},</span>
<span class="hljs-comment"># )</span>
<span class="hljs-comment"># for hits in results:</span>
<span class="hljs-comment">#     for rank, hit in enumerate(hits, 1):</span>
<span class="hljs-comment">#         print(f&quot;  [{rank}] (score={hit[&#x27;distance&#x27;]:.4f}) {hit[&#x27;entity&#x27;][&#x27;content&#x27;][:80]}&quot;)</span>

<span class="hljs-comment"># ── Cleanup ──────────────────────────────────────────────────────────────</span>
<span class="hljs-comment"># milvus_client.drop_collection(COLLECTION_NAME)</span>
<span class="hljs-comment"># print(f&quot;\nCollection &#x27;{COLLECTION_NAME}&#x27; dropped&quot;)</span>

<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\nDone!&quot;</span>)

<button class="copy-code-btn"></button></code></pre>
<p>이미지 임베딩과 오디오 임베딩의 경우, 동일한 방식으로 embed_image() 및 embed_audio()를 사용하면 벡터가 동일한 컬렉션과 동일한 벡터 공간에 배치되므로 진정한 크로스 모달 검색이 가능합니다.</p>
<h2 id="Gemini-Embedding-2-Will-be-Available-in-MilvusZilliz-Cloud-Soon" class="common-anchor-header">Gemini 임베딩 2는 Milvus/Zilliz Cloud에서 곧 제공될 예정입니다.<button data-href="#Gemini-Embedding-2-Will-be-Available-in-MilvusZilliz-Cloud-Soon" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://milvus.io/">Milvus는</a> 임베딩 <a href="https://milvus.io/docs/embeddings.md">기능</a> 기능을 통해 Gemini Embedding 2와 긴밀하게 통합하여 출시할 예정입니다. 이 기능이 출시되면 임베딩 API를 수동으로 호출할 필요가 없습니다. Milvus는 모델(OpenAI, AWS Bedrock, Google Vertex AI 등 지원)을 자동으로 호출하여 검색 시 삽입 및 쿼리에 대한 원시 데이터를 벡터화합니다.</p>
<p>즉, 적합한 곳에서는 Gemini의 통합 멀티모달 임베딩을, 세밀한 제어가 필요한 곳에서는 Milvus의 전체 멀티벡터 툴킷(스파스 밀도 하이브리드 검색, 멀티 인덱스 스키마, 재랭크)을 사용할 수 있습니다.</p>
<p>사용해 보고 싶으신가요? <a href="https://milvus.io/docs/quickstart.md">Milvus 퀵스타트로</a> 시작하여 위의 데모를 실행하거나 <a href="https://milvus.io/docs/hybrid_search_with_milvus.md">하이브리드 검색 가이드에서</a> BGE-M3를 사용한 전체 멀티벡터 설정에 대해 알아보세요. 궁금한 점이 있으면 <a href="https://milvus.io/discord">Discord</a> 또는 <a href="https://meetings.hubspot.com/chloe-williams1/milvus-office-hour">Milvus</a> 지원팀에 문의하세요.</p>
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
<li><a href="https://milvus.io/blog/data-in-and-data-out-in-milvus-2-6.md">임베딩 기능을 소개합니다: Milvus 2.6이 벡터화 및 시맨틱 검색을 간소화하는 방법 - Milvus 블로그</a></li>
<li><a href="https://milvus.io/docs/multi-vector-search.md">멀티-벡터 하이브리드 검색</a></li>
<li><a href="https://milvus.io/docs/embeddings.md">Milvus 임베딩 함수 문서</a></li>
</ul>
