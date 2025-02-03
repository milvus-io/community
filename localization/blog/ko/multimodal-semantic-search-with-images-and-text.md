---
id: multimodal-semantic-search-with-images-and-text.md
title: 이미지와 텍스트를 사용한 멀티모달 시맨틱 검색
author: Stefan Webb
date: 2025-02-3
desc: 기본적인 키워드 매칭을 넘어 텍스트와 이미지의 관계를 이해하는 멀티모달 AI를 사용하여 시맨틱 검색 앱을 구축하는 방법을 알아보세요.
cover: >-
  assets.zilliz.com/Multimodal_Semantic_Search_with_Images_and_Text_180d89d5aa.png
tag: Engineering
tags: 'Milvus, Vector Database, Open Source, Semantic Search, Multimodal AI'
recommend: true
canonicalUrl: 'https://milvus.io/blog/multimodal-semantic-search-with-images-and-text.md'
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Multimodal_Semantic_Search_with_Images_and_Text_180d89d5aa.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>인간은 감각을 통해 세상을 해석합니다. 우리는 소리를 듣고, 이미지, 비디오, 텍스트를 보고, 종종 서로 겹쳐서 봅니다. 우리는 이러한 다양한 양식과 이들 간의 관계를 통해 세상을 이해합니다. 인공지능이 인간의 능력에 진정으로 부합하거나 이를 뛰어넘으려면 여러 렌즈를 통해 동시에 세상을 이해하는 능력을 개발해야 합니다.</p>
<p>이 게시물과 함께 제공되는 동영상(곧 제공 예정) 및 노트북에서는 텍스트와 이미지를 함께 처리할 수 있는 최근의 획기적인 모델에 대해 소개합니다. 단순한 키워드 매칭을 넘어 사용자가 요구하는 내용과 검색하는 시각적 콘텐츠 사이의 관계를 이해하는 시맨틱 검색 애플리케이션을 구축하여 이를 시연해 보겠습니다.</p>
<p>이 프로젝트가 특히 흥미로운 이유는 Milvus 벡터 데이터베이스, HuggingFace의 머신 러닝 라이브러리, Amazon 고객 리뷰 데이터 세트와 같은 오픈 소스 도구로만 구축되었다는 점입니다. 불과 10년 전만 해도 이와 같은 기능을 구축하려면 상당한 독점 리소스가 필요했을 것이라고 생각하면 놀랍습니다. 오늘날에는 이러한 강력한 구성 요소를 무료로 사용할 수 있으며 실험에 대한 호기심이 있는 사람이라면 누구나 혁신적인 방식으로 결합할 수 있습니다.</p>
<custom-h1>개요</custom-h1><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/overview_97a124bc9a.jpg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>멀티모달 검색 애플리케이션은 <em>검색 및 재랭크</em> 유형입니다. <em>검색 증강 생성</em> (RAG)에 익숙하다면 매우 유사하지만 최종 출력은 대규모 언어 시각 모델(LLVM)에 의해 순위가 재조정된 이미지 목록이라는 점만 다릅니다. 사용자의 검색 쿼리에는 텍스트와 이미지가 모두 포함되며, 대상은 벡터 데이터베이스에 색인된 이미지 집합입니다. 이 아키텍처는 <em>인덱싱</em>, <em>검색</em>, <em>재랭크</em> ('생성'과 유사)의 세 단계로 구성되며, 이를 차례로 요약해 보겠습니다.</p>
<h2 id="Indexing" class="common-anchor-header">인덱싱<button data-href="#Indexing" class="anchor-icon" translate="no">
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
    </button></h2><p>검색 애플리케이션에는 검색할 대상이 있어야 합니다. 저희의 경우, 모든 유형의 상품에 대한 Amazon 고객 리뷰의 텍스트와 이미지가 모두 포함된 "Amazon Reviews 2023" 데이터 세트의 작은 하위 집합을 사용합니다. 우리가 구축 중인 이와 같은 시맨틱 검색은 이커머스 웹사이트에 유용한 추가 기능이라고 상상할 수 있습니다. 저희는 900개의 이미지를 사용하고 텍스트는 버렸지만, 적절한 데이터베이스와 추론 배포를 통해 이 노트북을 프로덕션 크기로 확장할 수 있다는 것을 관찰했습니다.</p>
<p>저희 파이프라인의 첫 번째 '마법'은 임베딩 모델의 선택입니다. 저희는 최근에 개발된 <a href="https://huggingface.co/BAAI/bge-visualized">시각화된 BGE라는</a> 멀티모달 모델을 사용하는데, 이 모델은 텍스트와 이미지를 같은 공간에 공동으로 또는 개별적으로 임베드할 수 있으며, 가까운 지점이 의미적으로 유사한 단일 모델로 임베드할 수 있습니다. <a href="https://github.com/google-deepmind/magiclens">MagicLens와</a> 같은 다른 모델도 최근에 개발되었습니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/indexing_1937241be5.jpg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>위의 그림은 [사자 옆모습 이미지]와 "이것의 정면 모습"이라는 텍스트가 포함된 임베딩이 텍스트 없이 [사자 정면 이미지]만 포함된 임베딩과 비슷하다는 것을 보여줍니다. 텍스트와 이미지가 포함된 입력과 이미지만 포함된 입력(텍스트만 포함된 입력)에 모두 동일한 모델이 사용됩니다. <em>이러한 방식으로 모델은 쿼리 텍스트와 쿼리 이미지의 관계에 대한 사용자의 의도를 파악할 수 있습니다.</em></p>
<p>900개의 제품 이미지를 해당 텍스트 없이 임베딩하고, 임베딩된 이미지를 <a href="https://milvus.io/docs">Milvus를</a> 사용하여 벡터 데이터베이스에 저장합니다.</p>
<h2 id="Retrieval" class="common-anchor-header">검색<button data-href="#Retrieval" class="anchor-icon" translate="no">
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
    </button></h2><p>이제 데이터베이스가 구축되었으므로 사용자 쿼리를 제공할 수 있습니다. 사용자가 다음과 같은 쿼리를 입력한다고 가정해 보겠습니다: "이것으로 된 휴대폰 케이스"와 [레오파드 이미지]를 더한 쿼리입니다. 즉, 레오파드 가죽 프린트가 있는 휴대폰 케이스를 검색하고 있는 것입니다.</p>
<p>사용자의 쿼리 텍스트에 "표범 가죽"이 아닌 "이것"이라고 되어 있다는 점에 유의하세요. 임베딩 모델은 '이것'이 무엇을 가리키는지 연결할 수 있어야 하는데, 이전 모델에서는 이러한 개방형 명령을 처리할 수 없었다는 점을 고려할 때 이는 매우 인상적인 성과입니다. <a href="https://arxiv.org/abs/2403.19651">MagicLens 백</a> 서에서 더 많은 예시를 확인할 수 있습니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Retrieval_ad64f48e49.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>쿼리 텍스트와 이미지를 함께 임베드하고 벡터 데이터베이스의 유사도 검색을 수행하여 상위 9개의 히트를 반환합니다. 결과는 표범의 쿼리 이미지와 함께 위 그림에 표시되어 있습니다. 최상위 히트가 쿼리와 가장 관련성이 높은 것은 아닌 것으로 보입니다. 가장 관련성이 높은 것으로 보이는 일곱 번째 결과는 표범 가죽 무늬가 있는 휴대폰 커버입니다.</p>
<h2 id="Generation" class="common-anchor-header">세대<button data-href="#Generation" class="anchor-icon" translate="no">
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
    </button></h2><p>최상위 결과가 가장 관련성이 높지 않다는 점에서 검색에 실패한 것으로 보입니다. 하지만 순위 재지정 단계를 통해 이 문제를 해결할 수 있습니다. 검색된 항목의 순위를 다시 매기는 것은 많은 RAG 파이프라인에서 중요한 단계로 익숙하실 것입니다. 저희는 <a href="https://huggingface.co/microsoft/Phi-3-vision-128k-instruct">Phi-3 Vision을</a> 리랭크 모델로 사용합니다.</p>
<p>먼저 LLVM에 쿼리 이미지의 캡션을 생성하도록 요청합니다. LLVM이 출력합니다:</p>
<p><em>"이 이미지는 표범의 얼굴을 클로즈업하여 얼룩무늬 털과 녹색 눈에 초점을 맞춘 것입니다."</em></p>
<p>그런 다음 이 캡션과 9개의 결과 및 쿼리 이미지가 포함된 단일 이미지를 입력하고 모델에 결과의 순위를 다시 매기도록 요청하는 텍스트 프롬프트를 구성하여 답변을 목록으로 제공하고 가장 일치하는 이미지를 선택한 이유를 제공합니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Generation_b016a6c26a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>결과는 위 그림과 같이 시각화되어 있으며, 가장 관련성이 높은 항목이 최상위 일치 항목으로 표시되고 그 이유는 다음과 같습니다:</p>
<p><em>"가장 적합한 항목은 레오파드 테마의 항목으로, 비슷한 테마의 휴대폰 케이스에 대한 사용자의 쿼리 명령과 일치합니다."</em></p>
<p>LLVM 리랭커는 이미지와 텍스트 전반에 걸쳐 이해를 수행하여 검색 결과의 관련성을 개선할 수 있었습니다. <em>한 가지 흥미로운 점은 리랭커가 8개의 결과만 제공하고 1개의 결과를 삭제했다는 점인데, 이는 가드레일과 구조화된 출력의 필요성을 강조합니다.</em></p>
<h2 id="Summary" class="common-anchor-header">요약<button data-href="#Summary" class="anchor-icon" translate="no">
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
    </button></h2><p>이 게시물과 함께 제공되는 동영상(곧 제공 예정)과 <a href="https://github.com/milvus-io/bootcamp/blob/master/bootcamp/tutorials/quickstart/multimodal_retrieval_amazon_reviews.ipynb">노트북에서는</a> 텍스트와 이미지를 아우르는 멀티모달 시맨틱 검색을 위한 애플리케이션을 구축했습니다. 임베딩 모델은 텍스트와 이미지를 같은 공간에 공동으로 또는 개별적으로 임베드할 수 있었고, 기반 모델은 텍스트와 이미지를 입력하면서 그에 대한 응답으로 텍스트를 생성할 수 있었습니다. <em>중요한 점은 임베딩 모델이 사용자의 개방형 명령어 의도를 쿼리 이미지와 연관시켜 사용자가 원하는 결과를 입력 이미지와 어떻게 연관시킬지 지정할 수 있었다는 점입니다.</em></p>
<p>이것은 앞으로 다가올 미래의 모습 중 일부에 불과합니다. 이미지, 비디오, 오디오, 분자, 소셜 네트워크, 표 형식의 데이터, 시계열 등 다양한 양식에 걸쳐 멀티모달 검색, 멀티모달 이해 및 추론 등의 많은 애플리케이션을 보게 될 것이며 그 잠재력은 무궁무진합니다.</p>
<p>그리고 이러한 시스템의 핵심에는 시스템의 외부 '메모리'를 보관하는 벡터 데이터베이스가 있습니다. Milvus는 이러한 목적을 위한 탁월한 선택입니다. 오픈 소스이며 모든 기능을 갖추고 있고( <a href="https://milvus.io/blog/get-started-with-hybrid-semantic-full-text-search-with-milvus-2-5.md">Milvus 2.5의 전체 텍스트 검색에 대한 이 문서</a> 참조) 웹 규모의 트래픽과 100ms 미만의 지연 시간으로 수십억 개의 벡터로 효율적으로 확장할 수 있습니다. <a href="https://milvus.io/docs">Milvus 문서에서</a> 자세히 알아보고, <a href="https://milvus.io/discord">Discord</a> 커뮤니티에 가입하고, 다음 <a href="https://lu.ma/unstructured-data-meetup">비정형 데이터 밋업에서</a> 만나 뵙기를 기대합니다. 그때까지!</p>
<h2 id="Resources" class="common-anchor-header">리소스<button data-href="#Resources" class="anchor-icon" translate="no">
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
<li><p>노트북: <a href="https://github.com/milvus-io/bootcamp/blob/master/bootcamp/tutorials/quickstart/multimodal_retrieval_amazon_reviews.ipynb">"Amazon 리뷰와 LLVM 리랭킹을 이용한 멀티모달 검색</a>"</p></li>
<li><p>유튜브 AWS 개발자 동영상(곧 제공 예정)</p></li>
<li><p><a href="https://milvus.io/docs">Milvus 문서</a></p></li>
<li><p><a href="https://lu.ma/unstructured-data-meetup">비정형 데이터 밋업</a></p></li>
<li><p>모델 임베딩: <a href="https://huggingface.co/BAAI/bge-visualized">시각화된 BGE 모델 카드</a></p></li>
<li><p>대체 임베딩 모델: <a href="https://github.com/google-deepmind/magiclens">MagicLens 모델 저장소</a></p></li>
<li><p>LLVM: <a href="https://huggingface.co/microsoft/Phi-3-vision-128k-instruct">Phi-3 Vision 모델 카드</a></p></li>
<li><p>Paper: "<a href="https://arxiv.org/abs/2403.19651">MagicLens: 개방형 지침을 사용한 자체 감독 이미지 검색</a>"</p></li>
<li><p>데이터 세트: <a href="https://amazon-reviews-2023.github.io/">아마존 리뷰 2023</a></p></li>
</ul>
