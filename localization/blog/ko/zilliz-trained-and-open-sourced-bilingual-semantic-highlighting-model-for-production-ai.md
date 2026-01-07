---
id: >-
  zilliz-trained-and-open-sourced-bilingual-semantic-highlighting-model-for-production-ai.md
title: 프로덕션 RAG 및 AI 검색을 위한 이중 언어 시맨틱 하이라이트 모델을 학습하고 오픈 소스화했습니다.
author: Cheney Zhang
date: 2026-01-06T00:00:00.000Z
cover: assets.zilliz.com/semantic_highlight_cover_f35a98fc58.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Semantic Highlighting, RAG, semantic search, Milvus, bilingual model'
meta_title: |
  Open-sourcing a Bilingual Semantic Highlighting Model for Production AI
desc: >-
  시맨틱 하이라이트에 대해 자세히 알아보고, Zilliz의 이중 언어 모델이 어떻게 구축되었는지, 그리고 RAG 시스템의 영어 및 중국어
  벤치마크에서 어떤 성능을 보이는지 알아보세요.
origin: >-
  https://milvus.io/blog/zilliz-trained-and-open-sourced-bilingual-semantic-highlighting-model-for-production-ai.md
---
<p>제품 검색을 구축하든, RAG 파이프라인을 구축하든, AI 에이전트를 구축하든, 궁극적으로 사용자에게 필요한 것은 같은 것입니다: 결과의 연관성을 빠르게 확인할 수 있는 방법입니다. <strong>강조</strong> 표시는 검색어를 뒷받침하는 정확한 텍스트를 표시하여 사용자가 전체 문서를 스캔할 필요가 없도록 도와줍니다.</p>
<p>대부분의 시스템은 여전히 키워드 기반 강조 표시를 사용합니다. 사용자가 "iPhone 성능"을 검색하면 시스템은 정확한 토큰인 "iPhone"과 "성능"을 강조 표시합니다. 하지만 텍스트가 다른 문구를 사용하여 동일한 아이디어를 표현하는 순간 이 방식은 무너지고 맙니다. "A15 바이오닉 칩, 벤치마크에서 100만 점 이상, 랙 없이 부드러운"과 같은 설명은 분명히 성능을 다루고 있지만 키워드가 나타나지 않기 때문에 아무것도 강조 표시되지 않습니다.</p>
<p><strong>시맨틱 강조 표시가</strong> 이 문제를 해결합니다. 정확한 문자열을 일치시키는 대신 쿼리와 의미적으로 일치하는 텍스트 범위를 식별합니다. 관련성이 표면적인 형태가 아닌 의미에 따라 달라지는 RAG 시스템, AI 검색 및 에이전트의 경우, 문서가 검색된 이유에 대해 보다 정확하고 신뢰할 수 있는 설명을 얻을 수 있습니다.</p>
<p>하지만 기존의 시맨틱 강조 표시 방법은 프로덕션 AI 워크로드에 적합하게 설계되지 않았습니다. 사용 가능한 모든 솔루션을 평가한 결과, RAG 파이프라인, 에이전트 시스템 또는 대규모 웹 검색에 필요한 정밀도, 지연 시간, 다국어 지원 범위 또는 견고성을 제공하는 솔루션이 없다는 것을 알게 되었습니다. <strong>그래서 자체적으로 이중 언어 시맨틱 하이라이트 모델을 학습시키고 이를 오픈소스로 공개했습니다.</strong></p>
<ul>
<li><p>시맨틱 하이라이트 모델: <a href="https://huggingface.co/zilliz/semantic-highlight-bilingual-v1">zilliz/semantic-highlight-bilingual-v1</a></p></li>
<li><p>여러분의 의견을 들려주세요 - <a href="https://discord.com/invite/8uyFbECzPX">Discord에</a> 참여하거나, <a href="https://www.linkedin.com/company/the-milvus-project/">LinkedIn에서</a> 팔로우하거나, <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">20분 동안 진행되는 Milvus 오피스 아워</a> 세션을 예약해 주세요.</p></li>
</ul>
<h2 id="How-Keyword-Based-Highlighting-Works--and-Why-It-Fails-in-Modern-AI-Systems" class="common-anchor-header">키워드 기반 강조 표시의 작동 방식과 최신 AI 시스템에서 실패하는 이유<button data-href="#How-Keyword-Based-Highlighting-Works--and-Why-It-Fails-in-Modern-AI-Systems" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>기존 검색 시스템은 단순한 키워드 매칭을 통해 하이라이팅을 구현합니다</strong>. 결과가 반환되면 엔진은 쿼리와 일치하는 정확한 토큰 위치를 찾아 마크업(보통 <code translate="no">&lt;em&gt;</code> 태그)으로 래핑하여 프론트엔드에서 하이라이트를 렌더링하도록 합니다. 이 모델은 쿼리 용어가 텍스트에 그대로 나타날 때 잘 작동합니다.</p>
<p>문제는 이 모델이 관련성이 정확한 키워드 중첩과 관련이 있다고 가정한다는 것입니다. 이 가정이 깨지면 신뢰도가 급격히 떨어집니다. 올바른 아이디어를 다른 문구로 표현한 결과는 검색 단계가 정확하더라도 하이라이트가 전혀 없는 결과로 끝나게 됩니다.</p>
<p>이러한 약점은 최신 AI 애플리케이션에서 분명하게 드러납니다. RAG 파이프라인과 AI 에이전트 워크플로에서는 쿼리가 더 추상적이고 문서가 더 길어지며 관련 정보가 동일한 단어를 재사용하지 않을 수 있습니다. 키워드 기반 하이라이트는 더 이상 개발자나 최종 사용자에게 정답이<em>실제로</em> 어디에 있는지 보여줄 수 없기 때문에 검색이 의도대로 작동하더라도 전체 시스템의 정확도가 떨어집니다.</p>
<p>사용자가 다음과 같이 질문한다고 가정해 보겠습니다: <em>"어떻게 하면 Python 코드의 실행 효율을 높일 수 있나요?"라고 질문한다고 가정해 보겠습니다.</em> 시스템이 벡터 데이터베이스에서 기술 문서를 검색한다고 가정해 보겠습니다. 기존의 강조 표시 기능은 <em>"Python",</em> <em>"코드",</em> <em>"실행"</em>, <em>"효율성"</em>과 같은 리터럴 일치 항목만 표시할 수 있습니다.</p>
<p>하지만 문서에서 가장 유용한 부분은 그렇지 않을 수 있습니다:</p>
<ul>
<li><p>명시적 루프 대신 NumPy 벡터화된 연산 사용</p></li>
<li><p>루프 안에 객체를 반복적으로 생성하지 않기</p></li>
</ul>
<p>이 문장은 질문에 대한 직접적인 답변이지만 쿼리 용어가 전혀 포함되어 있지 않습니다. 따라서 기존의 강조 표시 방식은 완전히 실패합니다. 문서가 관련성이 있을 수 있지만 사용자가 실제 답변을 찾으려면 여전히 한 줄 한 줄 스캔해야 합니다.</p>
<p>AI 에이전트에서는 이 문제가 더욱 두드러집니다. 에이전트의 검색 쿼리는 사용자의 원래 질문이 아니라 추론과 작업 분해를 통해 생성된 파생된 명령어인 경우가 많습니다. 예를 들어 사용자가 <em>"최근 시장 동향을 분석해 줄 수 있나요?"라고</em> 질문하면 에이전트는 "2024년 4분기 가전제품 판매 데이터, 전년 대비 성장률, 주요 경쟁사의 시장 점유율 변화, 공급망 비용 변동 검색"과 같은 쿼리를 생성할 수 있습니다.</p>
<p>이 쿼리는 여러 차원에 걸쳐 있고 복잡한 의도를 인코딩합니다. 그러나 기존의 키워드 기반 하이라이트는 <em>'2024',</em> <em>'판매 데이터'</em>, <em>'성장률</em>'과 같은 문자 그대로 일치하는 항목만 기계적으로 표시할 수 있습니다.</p>
<p>반면에 가장 가치 있는 인사이트는 다음과 같은 모습일 수 있습니다:</p>
<ul>
<li><p>아이폰 15 시리즈는 광범위한 시장 회복을 주도했습니다.</p></li>
<li><p>칩 공급 제약으로 인해 비용이 15% 상승했습니다.</p></li>
</ul>
<p>이러한 결론은 상담원이 추출하려는 것과 정확히 일치하더라도 쿼리와 단일 키워드를 공유하지 않을 수 있습니다. 에이전트는 검색된 대량의 콘텐츠에서 진정으로 유용한 정보를 신속하게 식별해야 하는데 키워드 기반 하이라이트는 실질적인 도움이 되지 않습니다.</p>
<h2 id="What-Is-Semantic-Highlighting-and-Pain-Points-in-Today’s-Solutions" class="common-anchor-header">시맨틱 하이라이팅이란 무엇이며 현재 솔루션의 문제점<button data-href="#What-Is-Semantic-Highlighting-and-Pain-Points-in-Today’s-Solutions" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>시맨틱 하이라이트는 정확한 단어가 아닌 의미에 기반한 매칭이라는 시맨틱 검색의 기본 개념에</strong> 기반합니다. 시맨틱 검색에서 임베딩 모델은 텍스트를 벡터로 매핑하여, 일반적으로 <a href="https://milvus.io/">Milvus와</a>같은 벡터 데이터베이스로 지원되는 검색 시스템이 문구가 다르더라도 쿼리와 동일한 아이디어를 전달하는 구절을 검색할 <a href="https://milvus.io/">수</a>있도록 합니다. 시맨틱 강조 표시는 이 원리를 더 세밀하게 적용합니다. 문자 그대로의 키워드 히트를 표시하는 대신, 사용자의 의도와 의미적으로 관련된 문서 내의 특정 범위를 강조 표시합니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/vs_20ec73c4a7.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>이 접근 방식은 쿼리 용어가 그대로 표시될 때만 작동하는 기존 강조 표시의 핵심 문제를 해결합니다. 사용자가 'iPhone 성능'을 검색할 경우, 키워드 기반 강조 표시 기능은 'A15 바이오닉 칩', '벤치마크에서 100만 점 이상' 또는 '랙 없이 부드러운' 같은 문구가 질문에 대한 명확한 답변임에도 불구하고 이를 무시합니다. 시맨틱 하이라이트는 이러한 의미 중심의 연결을 포착하여 사용자가 실제로 관심을 갖는 부분을 텍스트에 표시합니다.</p>
<p>이론적으로 이것은 간단한 의미론적 매칭 문제입니다. 최신 임베딩 모델은 이미 유사성을 잘 인코딩하므로 개념적 요소는 이미 갖춰져 있습니다. 문제는 실제 제약 조건에서 비롯됩니다. 모든 쿼리에서, 종종 검색된 많은 문서에서 강조 표시가 발생하므로 지연 시간, 처리량 및 도메인 간 견고성은 협상할 수 없는 요구 사항이 됩니다. 대규모 언어 모델은 이러한 빈도가 높은 경로에서 실행하기에는 너무 느리고 비용이 너무 많이 듭니다.</p>
<p>그렇기 때문에 실용적인 의미론적 강조 표시를 위해서는 검색 인프라와 함께 배치할 수 있을 만큼 작고 몇 밀리초 내에 결과를 반환할 수 있을 만큼 빠른 가볍고 특화된 모델이 필요합니다. 대부분의 기존 솔루션은 바로 이 부분에서 문제가 발생합니다. 무거운 모델은 정확도를 제공하지만 대규모로 실행할 수 없고, 가벼운 모델은 빠르지만 정확도가 떨어지거나 다국어 또는 도메인별 데이터에서는 실패합니다.</p>
<h3 id="opensearch-semantic-highlighter" class="common-anchor-header">오픈서치-시맨틱-하이라이터</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/opensearch_en_aea06a2114.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>작년에 OpenSearch는 시맨틱 하이라이터 전용 모델인 <a href="https://huggingface.co/opensearch-project/opensearch-semantic-highlighter-v1"><strong>opensearch-semantic-highlighter-v1을</strong></a> 출시했습니다. 이 문제에 대한 의미 있는 시도이긴 하지만 두 가지 중요한 한계가 있습니다.</p>
<ul>
<li><p><strong>작은 컨텍스트 창:</strong> 이 모델은 BERT 아키텍처를 기반으로 하며 최대 512개의 토큰(약 300-400개의 한자 또는 400-500개의 영어 단어)을 지원합니다. 실제 시나리오에서 제품 설명과 기술 문서는 수천 단어에 이르는 경우가 많습니다. 첫 번째 창을 넘어서는 콘텐츠는 단순히 잘려나가기 때문에 모델은 문서의 극히 일부만을 기반으로 하이라이트를 식별해야 합니다.</p></li>
<li><p><strong>도메인 외부 일반화 성능 저하:</strong> 모델은 학습 세트와 유사한 데이터 분포에서만 잘 작동합니다. 뉴스 기사로 학습된 모델을 사용하여 전자상거래 콘텐츠나 기술 문서를 강조 표시하는 것과 같이 도메인 외부 데이터에 적용하면 성능이 급격히 저하됩니다. 실험 결과, 이 모델은 도메인 내 데이터에서는 약 0.72의 F1 점수를 얻었지만 도메인 외부 데이터 세트에서는 약 0.46으로 떨어졌습니다. 이러한 수준의 불안정성은 프로덕션 환경에서 문제가 될 수 있습니다. 또한 이 모델은 중국어를 지원하지 않습니다.</p></li>
</ul>
<h3 id="Provence--XProvence" class="common-anchor-header">프로방스/X프로방스</h3><p><a href="https://huggingface.co/naver/provence-reranker-debertav3-v1"><strong>프로방스는</strong></a> <a href="https://zilliz.com/customers/naver">네이버에서</a> 개발한 모델로, 처음에는 시맨틱 강조와 밀접한 관련이 있는 <strong>문맥</strong>가지치기를 위해 학습되었습니다.</p>
<p>두 작업 모두 시맨틱 매칭을 사용하여 관련 콘텐츠를 식별하고 관련 없는 부분을 걸러낸다는 동일한 기본 아이디어를 기반으로 합니다. 따라서 프로방스는 비교적 적은 조정만으로 시맨틱 강조 표시용으로 용도를 변경할 수 있습니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/provence_053cd3bccc.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>프로방스는 영어 전용 모델이며 해당 설정에서 상당히 잘 작동합니다. <a href="https://huggingface.co/naver/xprovence-reranker-bgem3-v1"><strong>XProvence는</strong></a> 다국어 버전으로 중국어, 일본어, 한국어를 포함한 12개 이상의 언어를 지원합니다. 언뜻 보기에는 이중 언어 또는 다국어 시맨틱 강조 표시 시나리오에 적합한 후보로 보입니다.</p>
<p>하지만 실제로는 프로방스와 XProvence 모두 몇 가지 주목할 만한 한계가 있습니다:</p>
<ul>
<li><p><strong>다국어 모델에서 영어 성능이 약합니다:</strong> XProvence는 영어 벤치마크에서 Provence의 성능과 일치하지 않습니다. 이는 다국어 모델에서 흔히 발생하는 상충 관계로, 용량이 언어 간에 공유되므로 영어와 같이 리소스가 많이 사용되는 언어의 성능이 약해지는 경우가 많습니다. 이러한 제한은 영어가 주요 또는 지배적인 워크로드로 남아 있는 실제 시스템에서 중요합니다.</p></li>
<li><p><strong>제한된 중국어 성능:</strong> XProvence는 다양한 언어를 지원합니다. 다국어 학습 중에는 데이터와 모델 용량이 여러 언어에 분산되므로 모델이 어느 한 언어에 특화할 수 있는 능력이 제한됩니다. 결과적으로 중국어 성능은 약간만 허용되는 수준이며 고정밀 하이라이트 사용 사례에는 종종 불충분합니다.</p></li>
<li><p><strong>가지치기와 강조 표시 목표 간의 불일치:</strong> 프로방스는 중요한 정보를 놓치지 않기 위해 잠재적으로 유용한 콘텐츠를 최대한 많이 리콜하는 것을 우선순위로 하는 문맥 가지치기에 최적화되어 있습니다. 반면 시맨틱 강조 표시는 문서의 많은 부분이 아닌 가장 관련성이 높은 문장만 강조 표시하는 정확성을 강조합니다. 프로방스 스타일의 모델을 하이라이트에 적용하면 이러한 불일치로 인해 하이라이트가 지나치게 광범위하거나 노이즈가 발생하는 경우가 많습니다.</p></li>
<li><p><strong>제한적인 라이선스:</strong> 프로방스 및 엑스프로방스는 모두 상업적 사용이 허용되지 않는 CC BY-NC 4.0 라이선스에 따라 릴리스됩니다. 이 제한 사항만으로도 많은 프로덕션 배포에 적합하지 않습니다.</p></li>
</ul>
<h3 id="Open-Provence" class="common-anchor-header">오픈 프로방스</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/openprovence_en_c4f0aa8b65.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><a href="https://github.com/hotchpotch/open_provence"><strong>오픈 프로방스는</strong></a> 프로방스 교육 파이프라인을 개방적이고 투명한 방식으로 재구현하는 커뮤니티 중심 프로젝트입니다. 교육 스크립트뿐만 아니라 데이터 처리 워크플로우, 평가 도구, 사전 학습된 모델을 다양한 규모로 제공합니다.</p>
<p>Open Provence의 가장 큰 장점은 <strong>허용되는 MIT 라이선스입니다</strong>. 프로방스 및 엑스프로방스와 달리 법적 제한 없이 상용 환경에서 안전하게 사용할 수 있어 프로덕션 중심의 팀에게 매력적입니다.</p>
<p>하지만 Open Provence는 현재 <strong>영어와 일본어만</strong> 지원하므로 이중 언어 사용 사례에는 적합하지 않습니다.</p>
<h2 id="We-Trained-and-Open-Sourced-a-Bilingual-Semantic-Highlighting-Model" class="common-anchor-header">이중 언어 시맨틱 강조 표시 모델을 훈련하고 오픈 소스화했습니다.<button data-href="#We-Trained-and-Open-Sourced-a-Bilingual-Semantic-Highlighting-Model" class="anchor-icon" translate="no">
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
    </button></h2><p>실제 워크로드를 위해 설계된 시맨틱 강조 표시 모델은 몇 가지 필수 기능을 제공해야 합니다:</p>
<ul>
<li><p>강력한 다국어 성능</p></li>
<li><p>긴 문서를 지원할 수 있을 만큼 충분히 큰 컨텍스트 창</p></li>
<li><p>강력한 도메인 외부 일반화</p></li>
<li><p>시맨틱 강조 표시 작업의 높은 정밀도</p></li>
<li><p>허용적이고 프로덕션 친화적인 라이선스(MIT 또는 Apache 2.0)</p></li>
</ul>
<p>기존 솔루션을 평가한 결과, 사용 가능한 모델 중 프로덕션 사용에 필요한 요구 사항을 충족하는 모델이 없다는 사실을 알게 되었습니다. 그래서 자체 시맨틱 하이라이트 모델인 <a href="https://huggingface.co/zilliz/semantic-highlight-bilingual-v1">zilliz/semantic-highlight-bilingual-v1을</a> 훈련하기로 결정했습니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/hugging_face_56eca8f423.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>이를 위해 대규모 언어 모델을 사용하여 고품질의 레이블이 지정된 데이터를 생성한 다음, 오픈 소스 도구를 사용하여 그 위에 경량 시맨틱 하이라이트 모델을 훈련하는 간단한 접근 방식을 채택했습니다. 이를 통해 LLM의 추론 능력과 프로덕션 시스템에 필요한 효율성 및 짧은 지연 시간을 결합할 수 있었습니다.</p>
<p><strong>이 프로세스에서 가장 어려운 부분은 데이터 구축입니다</strong>. 주석을 다는 동안 우리는 LLM(Qwen3 8B)에 하이라이트 스팬뿐만 아니라 그 뒤에 있는 전체 추론을 출력하도록 요청합니다. 이 추가 추론 신호는 보다 정확하고 일관된 감독을 생성하고 결과 모델의 품질을 크게 향상시킵니다.</p>
<p>높은 수준에서 어노테이션 파이프라인은 다음과 같이 작동합니다: <strong>LLM 추론 → 하이라이트 레이블 → 필터링 → 최종 학습 샘플.</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/pipeline_en_2e917fe1ce.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>이 설계는 실제로 세 가지 구체적인 이점을 제공합니다:</p>
<ul>
<li><p><strong>라벨링 품질 향상</strong>: 모델에 <em>먼저 생각한 다음 대답하라는</em> 메시지가 표시됩니다. 이 중간 추론 단계는 자체 점검 기능이 내장되어 있어 라벨이 얕거나 일관되지 않을 가능성을 줄여줍니다.</p></li>
<li><p><strong>관찰 가능성 및 디버깅 가능성 향상</strong>: 각 레이블에는 추론 추적이 수반되므로 오류가 가시화됩니다. 따라서 장애 사례를 더 쉽게 진단하고 파이프라인에서 프롬프트, 규칙 또는 데이터 필터를 신속하게 조정할 수 있습니다.</p></li>
<li><p><strong>재사용 가능한 데이터</strong>: 추론 추적은 향후 레이블을 다시 지정할 때 유용한 컨텍스트를 제공합니다. 요구 사항이 변경되면 처음부터 다시 시작하지 않고도 동일한 데이터를 재검토하고 개선할 수 있습니다.</p></li>
</ul>
<p>이 파이프라인을 사용하여 영어와 중국어를 거의 균등하게 배분한 100만 개 이상의 이중 언어 학습 샘플을 생성했습니다.</p>
<p>모델 훈련을 위해 BGE-M3 Reranker v2(0.6B 파라미터, 8,192 토큰 컨텍스트 창)에서 시작하여 Open Provence 훈련 프레임워크를 채택하고 8× A100 GPU에서 3회에 걸쳐 훈련하여 약 5시간 만에 훈련을 완료했습니다.</p>
<p>추론 트레이스에 의존하는 이유, 기본 모델 선택 방법, 데이터 세트 구성 방법 등 이러한 기술적 선택에 대해 더 자세히 알아보려면 후속 포스팅을 참조하시기 바랍니다.</p>
<h2 id="Benchmarking-Zilliz’s-Bilingual-Semantic-Highlighting-Model" class="common-anchor-header">Zilliz의 이중 언어 의미 강조 모델 벤치마킹하기<button data-href="#Benchmarking-Zilliz’s-Bilingual-Semantic-Highlighting-Model" class="anchor-icon" translate="no">
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
    </button></h2><p>실제 성능을 평가하기 위해 다양한 데이터 세트에서 여러 시맨틱 하이라이트 모델을 평가했습니다. 이 벤치마크는 프로덕션 시스템에서 발생하는 다양한 콘텐츠를 반영하기 위해 영어와 중국어로 된 도메인 내 및 도메인 외 시나리오를 모두 다룹니다.</p>
<h3 id="Datasets" class="common-anchor-header">데이터 세트</h3><p>평가에 사용된 데이터 세트는 다음과 같습니다:</p>
<ul>
<li><p><strong>MultiSpanQA(영어)</strong> - 도메인 내 멀티스팬 질문 답변 데이터 세트</p></li>
<li><p><strong>WikiText-2 (영어)</strong> - 도메인 외부 Wikipedia 말뭉치</p></li>
<li><p><strong>MultiSpanQA-ZH (중국어)</strong> - 중국어 다중 스팬 질문 답변 데이터 세트</p></li>
<li><p><strong>WikiText-2-ZH (중국어)</strong> - 도메인 외 중국어 위키백과 말뭉치</p></li>
</ul>
<h3 id="Models-Compared" class="common-anchor-header">비교 모델</h3><p>비교에 포함된 모델은 다음과 같습니다:</p>
<ul>
<li><p><strong>오픈 프로방스 모델</strong></p></li>
<li><p><strong>프로방스 / 엑스프로방스</strong> (네이버에서 출시)</p></li>
<li><p><strong>오픈서치 시맨틱 하이라이터</strong></p></li>
<li><p><strong>질리즈의 이중 언어 시맨틱 하이라이터 모델</strong></p></li>
</ul>
<h3 id="Results-and-Analysis" class="common-anchor-header">결과 및 분석</h3><p><strong>영어 데이터셋</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/en_dataset_fce4cbc747.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>중국어 데이터셋</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/zh_dataset_ac7760e0b5.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>이중 언어 벤치마크 전반에서, 저희 모델은 <strong>최첨단 평균 F1 점수를</strong> 달성하여 이전에 평가된 모든 모델과 접근 방식보다 우수한 성능을 보였습니다. 특히 중국어 <strong>데이터 세트에서</strong> 그 성과가 두드러지게 나타났는데, 우리 모델은 중국어를 지원하는 유일한 다른 평가 모델인 XProvence보다 훨씬 뛰어난 성능을 보였습니다.</p>
<p>더 중요한 것은 기존 솔루션이 달성하기 어려운 영어와 중국어 모두에서 균형 잡힌 성능을 제공한다는 점입니다:</p>
<ul>
<li><p>영어만 지원하는<strong>오픈 프로방스</strong> </p></li>
<li><p><strong>XProvence는</strong> 프로방스에 비해 영어 성능을 희생합니다.</p></li>
<li><p><strong>오픈서치 시맨틱 하이라이터는</strong> 중국어 지원이 부족하고 일반화가 약합니다.</p></li>
</ul>
<p>결과적으로, 당사의 모델은 언어 지원 범위와 성능 간의 일반적인 상충 관계를 피하여 실제 이중 언어 배포에 더 적합합니다.</p>
<h3 id="A-Concrete-Example-in-Practice" class="common-anchor-header">실제 사례</h3><p>벤치마크 점수 외에도 구체적인 사례를 살펴보면 더 많은 것을 알 수 있습니다. 다음 사례는 실제 시맨틱 강조 표시 시나리오에서 모델이 어떻게 작동하는지, 그리고 정확도가 중요한 이유를 보여줍니다.</p>
<p><strong>쿼리:</strong> 영화 <em>'신성한 사슴의 죽음</em>'은 누가 만들었나요?</p>
<p><strong>문맥(5문장):</strong></p>
<ol>
<li><p>'신성한<em>사슴의 죽음</em> '은 2017년 요르고스 란티모스 감독의 심리 스릴러 영화로, 란티모스와 에프티미스 필리푸가 각본을 썼습니다.</p></li>
<li><p>콜린 파렐, 니콜 키드먼, 배리 케오한, 래피 캐시디, 서니 설직, 알리시아 실버스톤, 빌 캠프 등이 출연합니다.</p></li>
<li><p>이야기는 에우리피데스의 고대 그리스 희곡 <em>'이피게니아 인 아울리스</em> '를 원작으로 합니다.</p></li>
<li><p>영화는 자신의 과거와 연결된 10대 소년과 비밀스러운 우정을 쌓는 심장 외과 의사를 따라갑니다.</p></li>
<li><p>그는 소년을 가족에게 소개하고 그 후 미스터리한 질병이 발생하기 시작합니다.</p></li>
</ol>
<p><strong>정답 하이라이트:</strong> 각본은 요르고스 란티모스와 에프티미스 필리포가 썼다고 명시되어 있으므로<strong>문장 1이</strong> 정답입니다.</p>
<p>이 예에는 미묘한 함정이 있습니다. <strong>3번 문</strong> 장은 이 이야기의 원작이 된 그리스 희곡의 작가인 에우리피데스를 언급하고 있습니다. 그러나 이 문제는 고대 원작이 아니라 <em>영화를</em> 쓴 사람을 묻는 문제입니다. 따라서 정답은 수천 년 전의 극작가가 아니라 영화의 시나리오 작가입니다.</p>
<p><strong>결과:</strong></p>
<p>아래 표에는 이 예제에서 다양한 모델이 어떻게 수행되었는지 요약되어 있습니다.</p>
<table>
<thead>
<tr><th style="text-align:center"><strong>모델</strong></th><th style="text-align:center"><strong>식별된 정답</strong></th><th style="text-align:center"><strong>결과</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center"><strong>우리(이중 언어 M3)</strong></td><td style="text-align:center">✓</td><td style="text-align:center">선택된 문장 1(정답) 및 문장 3</td></tr>
<tr><td style="text-align:center"><strong>XProvence v1</strong></td><td style="text-align:center">✗</td><td style="text-align:center">3번 문장만 선택, 정답을 놓침</td></tr>
<tr><td style="text-align:center"><strong>XProvence v2</strong></td><td style="text-align:center">✗</td><td style="text-align:center">3번 문장만 선택, 정답을 놓쳤습니다.</td></tr>
</tbody>
</table>
<p><strong>문장 수준 점수 비교</strong></p>
<table>
<thead>
<tr><th style="text-align:center"><strong>문장</strong></th><th><strong>우리(이중 언어 M3)</strong></th><th style="text-align:center"><strong>XProvence v1</strong></th><th style="text-align:center"><strong>XProvence v2</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center">문장 1(영화 시나리오, <strong>정답</strong>)</td><td><strong>0.915</strong></td><td style="text-align:center">0.133</td><td style="text-align:center">0.081</td></tr>
<tr><td style="text-align:center">문장 3(원작, 산만함)</td><td>0.719</td><td style="text-align:center"><strong>0.947</strong></td><td style="text-align:center"><strong>0.802</strong></td></tr>
</tbody>
</table>
<p><strong>XProvence의 부족한 점</strong></p>
<ul>
<li><p>XProvence는 <em>"에우리피데스"</em> 와 <em>"쓴"이라는</em> 키워드에 강한 매력을 느껴 문장 3에 거의 완벽한 점수(0.947점 및 0.802점)를 부여했습니다.</p></li>
<li><p>동시에 문장 1의 정답은 거의 무시하고 매우 낮은 점수(0.133점 및 0.081점)를 부여합니다.</p></li>
<li><p>결정 임계값을 0.5에서 0.2로 낮춘 후에도 이 모델은 여전히 정답을 찾아내지 못합니다.</p></li>
</ul>
<p>즉, 이 모델은 주로 질문의 실제 의도가 아닌 표면적인 키워드 연관성에 의해 구동됩니다.</p>
<p><strong>모델이 다르게 작동하는 방식</strong></p>
<ul>
<li><p>이 모델은 1번 문장의 정답에 높은 점수(0.915점)를 부여하여 <em>영화의 시나리오 작가를</em> 정확하게 식별합니다.</p></li>
<li><p>또한 3번 문장에는 시나리오 관련 개념이 언급되어 있으므로 중간 점수(0.719)를 부여합니다.</p></li>
<li><p>결정적으로, 이 구분은 명확하고 의미 있는 구분입니다: <strong>0.915점 대 0.719점으로</strong> 거의 0.2점 차이가 납니다.</p></li>
</ul>
<p>이 예는 키워드 중심의 연관성을 넘어 사용자 의도를 올바르게 해석하는 우리 접근 방식의 핵심 강점을 잘 보여줍니다. 여러 '작성자' 개념이 등장하더라도 이 모델은 질문이 실제로 언급하는 개념을 일관되게 강조합니다.</p>
<p>보다 자세한 평가 보고서와 추가 사례 연구는 후속 포스팅에서 공유해 드리겠습니다.</p>
<h2 id="Try-It-Out-and-Tell-Us-What-You-Think" class="common-anchor-header">사용해 보고 의견을 알려주세요<button data-href="#Try-It-Out-and-Tell-Us-What-You-Think" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://huggingface.co/zilliz/semantic-highlight-bilingual-v1">Hugging Face의</a> 이중 언어 의미 강조 표시 모델은 모든 모델 가중치를 공개하여 바로 실험을 시작할 수 있도록 오픈 소스화했습니다. 사용해 보시고 피드백, 문제점 또는 개선 아이디어를 공유해 주시면 감사하겠습니다.</p>
<p>이와 동시에, 저희는 프로덕션에 바로 사용할 수 있는 추론 서비스를 개발 중이며, 이 모델을 기본 시맨틱 하이라이팅 API로 <a href="https://milvus.io/">Milvus에</a> 직접 통합하는 작업을 진행하고 있습니다. 이 통합은 이미 진행 중이며 곧 제공될 예정입니다.</p>
<p>시맨틱 하이라이팅은 보다 직관적인 RAG 및 에이전트 AI 경험의 문을 열어줍니다. Milvus는 여러 개의 긴 문서를 검색할 때 가장 관련성이 높은 문장을 즉시 표시하여 정답이 어디에 있는지 명확하게 알려줍니다. 이는 최종 사용자 경험을 개선할 뿐만 아니라 시스템이 컨텍스트의 어느 부분에 의존하는지 정확히 보여줌으로써 개발자가 검색 파이프라인을 디버깅하는 데도 도움이 됩니다.</p>
<p>저희는 시맨틱 강조 표시가 차세대 검색 및 RAG 시스템에서 표준 기능이 될 것이라고 믿습니다. 이중 언어 시맨틱 하이라이트에 대한 아이디어, 제안 또는 사용 사례가 있다면 <a href="https://discord.com/invite/8uyFbECzPX">Discord 채널에</a> 참여하여 의견을 공유해 주세요. 또한 <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">Milvus 오피스 아워를</a> 통해 20분간의 일대일 세션을 예약하여 인사이트, 안내, 질문에 대한 답변을 얻을 수도 있습니다.</p>
