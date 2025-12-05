---
id: >-
  unlocking-true-entity-level-retrieval-new-array-of-structs-and-max-sim-capabilities-in-milvus.md
title: '진정한 엔티티 레벨 검색을 실현합니다: Milvus의 새로운 구조체 배열 및 MAX_SIM 기능'
author: 'Jeremy Zhu, Min Tian'
date: 2025-12-05T00:00:00.000Z
cover: assets.zilliz.com/array_of_struct_cover_457c5a104b.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus, Array of Structs, MAX_SIM, vector database, multi-vector retrieval'
meta_title: |
  Array of Structs in Milvus: Entity-Level Multi-Vector Retrieval
desc: >-
  다중 벡터 데이터에 대한 진정한 엔티티 수준 검색을 가능하게 하여 중복 제거를 없애고 검색 정확도를 향상시키는 Milvus의 구조 배열 및
  MAX_SIM에 대해 알아보세요.
origin: >-
  https://milvus.io/blog/unlocking-true-entity-level-retrieval-new-array-of-structs-and-max-sim-capabilities-in-milvus.md
---
<p>벡터 데이터베이스를 기반으로 AI 애플리케이션을 구축했다면, 데이터베이스는 개별 청크의 임베딩을 검색하지만 애플리케이션은 <strong><em>엔티티에</em></strong> 관심을 갖는다는 동일한 문제점에 직면했을 것입니다. 이러한 불일치로 인해 전체 검색 워크플로가 복잡해집니다.</p>
<p>이런 일이 몇 번이고 반복되는 것을 보셨을 것입니다:</p>
<ul>
<li><p><strong>RAG 지식창고:</strong> 문서가 단락 임베딩으로 덩어리로 묶여 있어 검색 엔진이 전체 문서 대신 흩어져 있는 조각을 반환합니다.</p></li>
<li><p><strong>이커머스 추천:</strong> 한 제품에 여러 개의 이미지 임베딩이 있는 경우, 시스템에서 고유한 제품 5개가 아닌 동일한 품목의 5개 각도를 반환합니다.</p></li>
<li><p><strong>비디오 플랫폼:</strong> 동영상이 클립 임베딩으로 분할되어 있지만 검색 결과에 하나의 통합된 항목이 아닌 동일한 동영상의 조각이 표시됩니다.</p></li>
<li><p><strong>콜버트/콜팔리 스타일 검색:</strong> 문서가 수백 개의 토큰 또는 패치 수준의 임베딩으로 확장되어 병합이 필요한 작은 조각으로 결과가 표시됩니다.</p></li>
</ul>
<p>대부분의 벡터 데이터베이스는 각 임베딩을 고립된 행으로 취급하는 반면, 실제 애플리케이션은 문서, 제품, 동영상, 항목, 장면 등 상위 수준의 엔터티에서 작동한다는 점에서 이러한 모든 문제는 <em>동일한 아키텍처적 격차에서</em> 비롯됩니다. 따라서 엔지니어링 팀은 중복 제거, 그룹화, 버킷화, 순위 재지정 로직을 사용해 엔티티를 수동으로 재구성해야 합니다. 이 방법은 작동하지만 취약하고 느리며 애초에 존재해서는 안 되는 로직으로 애플리케이션 계층을 부풀립니다.</p>
<p><a href="https://milvus.io/docs/release_notes.md#v264">Milvus 2.6.4는</a> 새로운 기능으로 이러한 격차를 해소합니다: <strong>MAX_SIM</strong> 메트릭 유형의 <a href="https://milvus.io/docs/array-of-structs.md"><strong>구조체 배열입니다</strong></a>. 이 기능을 사용하면 단일 엔티티에 대한 모든 임베딩을 단일 레코드에 저장할 수 있으며, Milvus가 엔티티를 전체적으로 점수화하여 반환할 수 있습니다. 더 이상 중복으로 가득 찬 결과 세트가 없습니다. 순위 재조정 및 병합과 같은 복잡한 사후 처리가 필요 없습니다.</p>
<p>이 문서에서는 구조 배열과 MAX_SIM의 작동 원리를 살펴보고 두 가지 실제 예제를 통해 이를 시연해 보겠습니다: Wikipedia 문서 검색과 ColPali 이미지 기반 문서 검색입니다.</p>
<h2 id="What-is-an-Array-of-Structs" class="common-anchor-header">구조체 배열이란 무엇인가요?<button data-href="#What-is-an-Array-of-Structs" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus에서 구조체 <strong>배열</strong> 필드는 단일 레코드에 각각 동일한 사전 정의된 스키마를 따르는 <em>정렬된</em> 구조체 요소의 <em>목록을</em> 포함할 수 있게 해줍니다. 구조체는 스칼라 필드, 문자열 또는 기타 지원되는 모든 유형뿐만 아니라 여러 벡터를 포함할 수 있습니다. 즉, 단락 임베딩, 이미지 보기, 토큰 벡터, 메타데이터 등 하나의 엔티티에 속하는 모든 조각을 한 행 안에 직접 묶을 수 있습니다.</p>
<p>다음은 구조체 배열 필드를 포함하는 컬렉션의 엔티티 예시입니다.</p>
<pre><code translate="no">{
    <span class="hljs-string">&#x27;id&#x27;</span>: <span class="hljs-number">0</span>,
    <span class="hljs-string">&#x27;title&#x27;</span>: <span class="hljs-string">&#x27;Walden&#x27;</span>,
    <span class="hljs-string">&#x27;title_vector&#x27;</span>: [<span class="hljs-number">0.1</span>, <span class="hljs-number">0.2</span>, <span class="hljs-number">0.3</span>, <span class="hljs-number">0.4</span>, <span class="hljs-number">0.5</span>],
    <span class="hljs-string">&#x27;author&#x27;</span>: <span class="hljs-string">&#x27;Henry David Thoreau&#x27;</span>,
    <span class="hljs-string">&#x27;year_of_publication&#x27;</span>: <span class="hljs-number">1845</span>,
    <span class="hljs-comment">// highlight-start</span>
    <span class="hljs-string">&#x27;chunks&#x27;</span>: [
        {
            <span class="hljs-string">&#x27;text&#x27;</span>: <span class="hljs-string">&#x27;When I wrote the following pages, or rather the bulk of them...&#x27;</span>,
            <span class="hljs-string">&#x27;text_vector&#x27;</span>: [<span class="hljs-number">0.3</span>, <span class="hljs-number">0.2</span>, <span class="hljs-number">0.3</span>, <span class="hljs-number">0.2</span>, <span class="hljs-number">0.5</span>],
            <span class="hljs-string">&#x27;chapter&#x27;</span>: <span class="hljs-string">&#x27;Economy&#x27;</span>,
        },
        {
            <span class="hljs-string">&#x27;text&#x27;</span>: <span class="hljs-string">&#x27;I would fain say something, not so much concerning the Chinese and...&#x27;</span>,
            <span class="hljs-string">&#x27;text_vector&#x27;</span>: [<span class="hljs-number">0.7</span>, <span class="hljs-number">0.4</span>, <span class="hljs-number">0.2</span>, <span class="hljs-number">0.7</span>, <span class="hljs-number">0.8</span>],
            <span class="hljs-string">&#x27;chapter&#x27;</span>: <span class="hljs-string">&#x27;Economy&#x27;</span>
        }
    ]
    <span class="hljs-comment">// hightlight-end</span>
}
<button class="copy-code-btn"></button></code></pre>
<p>위의 예에서 <code translate="no">chunks</code> 필드는 구조체 배열 필드이며 각 구조체 요소에는 <code translate="no">text</code>, <code translate="no">text_vector</code>, <code translate="no">chapter</code> 과 같은 고유한 필드가 포함되어 있습니다.</p>
<p>이 접근 방식은 벡터 데이터베이스의 오랜 모델링 문제를 해결합니다. 기존에는 모든 임베딩 또는 속성이 자체 행이 되어야 했기 때문에 <strong>다중 벡터 엔티티(문서, 제품, 동영상)를</strong> 수십, 수백, 심지어 수천 개의 레코드로 분할해야 했습니다. 구조 배열을 사용하면 전체 멀티 벡터 엔티티를 단일 필드에 저장할 수 있으므로 단락 목록, 토큰 임베딩, 클립 시퀀스, 멀티뷰 이미지 또는 하나의 논리적 항목이 여러 벡터로 구성된 모든 시나리오에 자연스럽게 적합합니다.</p>
<h2 id="How-Does-an-Array-of-Structs-Work-with-MAXSIM" class="common-anchor-header">구조체 배열은 MAX_SIM에서 어떻게 작동하나요?<button data-href="#How-Does-an-Array-of-Structs-Work-with-MAXSIM" class="anchor-icon" translate="no">
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
    </button></h2><p>이 새로운 구조 배열 구조 위에 시맨틱 검색 엔티티를 인식하는 새로운 채점 전략인 <strong>MAX_SIM이</strong> 계층화되어 있습니다. 쿼리가 들어오면 Milvus는 각 구조체 배열 내의 <em>모든</em> 벡터와 비교하여 <strong>최대 유사도를</strong> 엔티티의 최종 점수로 삼습니다. 그런 다음 해당 단일 점수를 기준으로 엔티티의 순위를 매기고 반환합니다. 이렇게 하면 흩어진 조각을 검색하고 그룹화, 중복 제거, 순위 재지정의 부담을 애플리케이션 계층으로 떠넘기는 기존의 벡터 데이터베이스 문제를 피할 수 있습니다. MAX_SIM을 사용하면 엔티티 수준 검색이 내장되어 일관성 있고 효율적으로 이루어집니다.</p>
<p>MAX_SIM이 실제로 어떻게 작동하는지 이해하기 위해 구체적인 예제를 살펴보겠습니다.</p>
<p><strong>참고:</strong> 이 예제의 모든 벡터는 동일한 임베딩 모델에 의해 생성되며, 유사도는 [0,1] 범위의 코사인 유사도로 측정됩니다.</p>
<p>사용자가 <strong>"머신 러닝 초급 과정"</strong>을 검색한다고 가정해 보겠습니다.</p>
<p>이 쿼리는 3개의 <strong>토큰으로</strong> 토큰화됩니다:</p>
<ul>
<li><p><em>머신 러닝</em></p></li>
<li><p><em>beginner</em></p></li>
<li><p><em>course</em></p></li>
</ul>
<p>그런 다음 이러한 각 토큰은 문서에 사용된 것과 동일한 임베딩 모델에 의해 임베딩 <strong>벡터로 변환됩니다</strong>.</p>
<p>이제 벡터 데이터베이스에 두 개의 문서가 포함되어 있다고 가정해 보겠습니다:</p>
<ul>
<li><p><strong>doc_1:</strong> <em>파이썬을 사용한 심층 신경망 입문 가이드</em></p></li>
<li><p><strong>doc_2:</strong> <em>LLM 논문 읽기에 대한 고급 가이드</em></p></li>
</ul>
<p>두 문서 모두 벡터로 임베드되어 구조체 배열 안에 저장되어 있습니다.</p>
<h3 id="Step-1-Compute-MAXSIM-for-doc1" class="common-anchor-header"><strong>1단계: doc_1에 대한 MAX_SIM 계산하기</strong></h3><p>각 쿼리 벡터에 대해 Milvus는 doc_1의 모든 벡터에 대해 코사인 유사성을 계산합니다:</p>
<table>
<thead>
<tr><th></th><th>소개</th><th>가이드</th><th>심층 신경망</th><th>python</th></tr>
</thead>
<tbody>
<tr><td>머신 러닝</td><td>0.0</td><td>0.0</td><td><strong>0.9</strong></td><td>0.3</td></tr>
<tr><td>beginner</td><td><strong>0.8</strong></td><td>0.1</td><td>0.0</td><td>0.3</td></tr>
<tr><td>코스</td><td>0.3</td><td><strong>0.7</strong></td><td>0.1</td><td>0.1</td></tr>
</tbody>
</table>
<p>각 쿼리 벡터에 대해 MAX_SIM은 해당 행에서 <strong>가장 높은</strong> 유사도를 선택합니다:</p>
<ul>
<li><p>머신 러닝 → 심층 신경망(0.9)</p></li>
<li><p>초보자 → 입문(0.8)</p></li>
<li><p>코스 → 가이드(0.7)</p></li>
</ul>
<p>가장 잘 일치하는 항목을 합산하면 doc_1의 <strong>MAX_SIM 점수는 2.4가</strong> 됩니다.</p>
<h3 id="Step-2-Compute-MAXSIM-for-doc2" class="common-anchor-header">2단계: doc_2에 대한 MAX_SIM 계산하기</h3><p>이제 doc_2에 대해 이 과정을 반복합니다:</p>
<table>
<thead>
<tr><th></th><th>고급</th><th>가이드</th><th>LLM</th><th>paper</th><th>읽기</th></tr>
</thead>
<tbody>
<tr><td>머신 러닝</td><td>0.1</td><td>0.2</td><td><strong>0.9</strong></td><td>0.3</td><td>0.1</td></tr>
<tr><td>beginner</td><td>0.4</td><td><strong>0.6</strong></td><td>0.0</td><td>0.2</td><td>0.5</td></tr>
<tr><td>코스</td><td>0.5</td><td><strong>0.8</strong></td><td>0.1</td><td>0.4</td><td>0.7</td></tr>
</tbody>
</table>
<p>doc_2에 가장 잘 어울리는 단어는 다음과 같습니다:</p>
<ul>
<li><p>"머신 러닝" → "LLM"(0.9)</p></li>
<li><p>"초보자" → "가이드"(0.6)</p></li>
<li><p>"코스" → "가이드"(0.8)</p></li>
</ul>
<p>이를 합산하면 doc_2의 <strong>MAX_SIM 점수는 2.3이</strong> 됩니다.</p>
<h3 id="Step-3-Compare-the-Scores" class="common-anchor-header">3단계: 점수 비교</h3><p><strong>2.4 &gt; 2.3이므로</strong> doc_1이 <strong>doc_2보다 더 높은 순위를</strong> 차지하며, 이는 직관적으로도 doc_1이 입문용 머신 러닝 가이드에 더 가깝기 때문입니다.</p>
<p>이 예제에서 MAX_SIM의 세 가지 핵심 특징을 강조할 수 있습니다:</p>
<ul>
<li><p><strong>키워드 기반이 아닌 시맨틱 우선:</strong> MAX_SIM은 텍스트 리터럴이 아닌 임베딩을 비교합니다. <em>'머신 러닝</em> '과 <em>'심층 신경망</em> '은 겹치는 단어가 0개임에도 불구하고 의미적 유사도는 0.9입니다. 따라서 MAX_SIM은 동의어, 의역어, 개념적 중복 및 최신 임베딩이 많은 워크로드에 강력합니다.</p></li>
<li><p><strong>길이와 순서에 민감하지 않습니다:</strong> MAX_SIM은 쿼리와 문서에 동일한 수의 벡터가 필요하지 않습니다(예: doc_1에는 4개의 벡터가 있고 doc_2에는 5개가 있어도 둘 다 정상적으로 작동). 또한 쿼리의 앞부분에 나타나는 '초보자'와 문서의 뒷부분에 나타나는 '소개'는 점수에 아무런 영향을 미치지 않는 등 벡터 순서도 무시합니다.</p></li>
<li><p><strong>모든 쿼리 벡터가 중요합니다:</strong> MAX_SIM은 각 쿼리 벡터에 대해 가장 잘 일치하는 것을 취하고 그 중 가장 좋은 점수를 합산합니다. 이렇게 하면 일치하지 않는 벡터로 인해 결과가 왜곡되는 것을 방지하고 모든 중요한 쿼리 토큰이 최종 점수에 기여하도록 보장할 수 있습니다. 예를 들어, doc_2에서 '초보자'에 대한 품질이 낮은 일치 항목은 전체 점수를 직접적으로 낮춥니다.</p></li>
</ul>
<h2 id="Why-MAXSIM-+-Array-of-Structs-Matter-in-Vector-Database" class="common-anchor-header">벡터 데이터베이스에서 MAX_SIM + 구조체 배열이 중요한 이유<button data-href="#Why-MAXSIM-+-Array-of-Structs-Matter-in-Vector-Database" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://milvus.io/">Milvus는</a> 오픈 소스 고성능 벡터 데이터베이스로, 이제 MAX_SIM과 구조체 배열을 완벽하게 지원하여 벡터 네이티브, 엔티티 수준의 다중 벡터 검색을 가능하게 합니다:</p>
<ul>
<li><p><strong>멀티 벡터 엔티티를 기본적으로 저장하세요:</strong> 구조체 배열을 사용하면 관련 벡터 그룹을 별도의 행이나 보조 테이블로 나누지 않고 단일 필드에 저장할 수 있습니다.</p></li>
<li><p><strong>효율적인 베스트매치 계산:</strong> MAX_SIM은 IVF 및 HNSW와 같은 벡터 인덱스와 결합하여 모든 벡터를 스캔하지 않고도 최적의 일치 항목을 계산할 수 있어 대용량 문서에서도 높은 성능을 유지합니다.</p></li>
<li><p><strong>시맨틱이 많은 워크로드를 위해 특별히 설계되었습니다:</strong> 이 접근 방식은 긴 텍스트 검색, 다면 시맨틱 매칭, 문서 요약 정렬, 다중 키워드 쿼리 및 유연하고 세밀한 의미론적 추론이 필요한 기타 AI 시나리오에서 탁월한 성능을 발휘합니다.</p></li>
</ul>
<h2 id="When-to-Use-an-Array-of-Structs" class="common-anchor-header">구조 배열을 사용하는 경우<button data-href="#When-to-Use-an-Array-of-Structs" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>구조체 배열</strong> 의 가치는 이 기능이 무엇을 지원하는지 살펴보면 명확해집니다. 이 기능은 기본적으로 세 가지 기본 기능을 제공합니다:</p>
<ul>
<li><p><strong>벡터</strong>, 스칼라, 문자열, 메타데이터<strong>등 이질적인 데이터를</strong>하나의 구조화된 개체로<strong>묶어줍니다</strong>.</p></li>
<li><p><strong>스토리지를 실제 엔터티에 맞춰 정렬하므로</strong> 각 데이터베이스 행이 기사, 제품 또는 동영상과 같은 실제 항목에 깔끔하게 매핑됩니다.</p></li>
<li><p><strong>MAX_SIM과 같은 집계 함수와 결합하면</strong> 데이터베이스에서 직접 진정한 엔티티 수준의 멀티벡터 검색이 가능하므로 애플리케이션 계층에서 중복 제거, 그룹화 또는 순위 재지정이 필요하지 않습니다.</p></li>
</ul>
<p>이러한 특성으로 인해 구조 배열은 <em>단일 논리적 엔티티가 여러 개의 벡터로 표현될</em> 때마다 자연스럽게 적합합니다. 일반적인 예로는 문단으로 분할된 기사, 토큰 임베딩으로 분해된 문서, 여러 이미지로 표현된 제품 등이 있습니다. 검색 결과에서 중복 히트, 흩어진 조각 또는 동일한 엔티티가 상위 결과에 여러 번 나타나는 경우, 배열 구조는 애플리케이션 코드의 사후 패치가 아닌 저장 및 검색 레이어에서 이러한 문제를 해결합니다.</p>
<p>이 패턴은 <strong>다중 벡터 검색에</strong> 의존하는 최신 AI 시스템에서 특히 강력합니다. 예를 들어, <strong>콜버트는</strong> 하나의 문서를 나타냅니다:</p>
<ul>
<li><p><a href="https://zilliz.com/learn/explore-colbert-token-level-embedding-and-ranking-model-for-similarity-search"><strong>ColBERT는</strong></a> 법률 텍스트나 학술 연구와 같은 영역에서 세분화된 의미론적 매칭을 위해 단일 문서를 100-500개의 토큰 임베딩으로 표현합니다.</p></li>
<li><p><a href="https://zilliz.com/blog/colpali-enhanced-doc-retrieval-with-vision-language-models-and-colbert-strategy"><strong>ColPali는</strong> </a>재무제표, 계약서, 송장, 기타 스캔 문서에서 교차 모드 검색을 위해 각 PDF 페이지를 256~1024개의 이미지 패치로<a href="https://zilliz.com/blog/colpali-enhanced-doc-retrieval-with-vision-language-models-and-colbert-strategy">변환합니다 </a>.</p></li>
</ul>
<p>Milvus는 구조 배열을 통해 이러한 모든 벡터를 단일 엔티티 아래에 저장하고 총 유사도(예: MAX_SIM)를 효율적이고 기본적으로 계산할 수 있습니다. 이를 보다 명확하게 설명하기 위해 두 가지 구체적인 예를 들어보겠습니다.</p>
<h3 id="Example-1-E-commerce-Product-Search" class="common-anchor-header">예 1: 이커머스 제품 검색</h3><p>이전에는 여러 개의 이미지가 있는 제품이 행당 하나의 이미지가 있는 평면 스키마에 저장되었습니다. 정면, 측면, 각도가 있는 제품의 경우 세 개의 행이 생성되었습니다. 검색 결과에 동일한 제품의 이미지가 여러 개 표시되는 경우가 많았기 때문에 수동으로 중복 제거 및 순위 재지정이 필요했습니다.</p>
<p>구조 배열을 사용하면 각 제품이 <strong>하나의 행이</strong> 됩니다. 모든 이미지 임베딩과 메타데이터(각도, is_primary 등)는 <code translate="no">images</code> 필드 안에 구조 배열로 존재합니다. Milvus는 이러한 이미지가 동일한 제품에 속한다는 것을 이해하고 개별 이미지가 아닌 제품 전체를 반환합니다.</p>
<h3 id="Example-2-Knowledge-Base-or-Wikipedia-Search" class="common-anchor-header">예 2: 지식창고 또는 Wikipedia 검색</h3><p>이전에는 하나의 Wikipedia 문서가 <em>N개의</em> 단락 행으로 나뉘어 있었습니다. 검색 결과는 흩어져 있는 단락을 반환했기 때문에 시스템에서 이를 그룹화하고 어느 문서에 속하는지 추측해야 했습니다.</p>
<p>구조 배열을 사용하면 전체 문서가 <strong>하나의 행이</strong> 됩니다. 모든 단락과 그 임베딩은 단락 필드 아래에 그룹화되며 데이터베이스는 단편적인 조각이 아닌 전체 문서를 반환합니다.</p>
<h2 id="Hands-on-Tutorials-Document-Level-Retrieval-with-the-Array-of-Structs" class="common-anchor-header">실습 튜토리얼: 구조 배열로 문서 수준 검색하기<button data-href="#Hands-on-Tutorials-Document-Level-Retrieval-with-the-Array-of-Structs" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="1-Wikipedia-Document-Retrieval" class="common-anchor-header">1. 위키백과 문서 검색</h3><p>이 튜토리얼에서는 <strong>구조체 배열을</strong> 사용하여 단락 수준 데이터를 전체 문서 레코드로 변환하는 방법을 살펴봄으로써 Milvus가 고립된 조각을 반환하는 대신 <strong>진정한 문서 수준 검색을</strong> 수행할 수 있도록 하는 방법을 안내합니다.</p>
<p>많은 지식창고 파이프라인은 Wikipedia 문서를 문단 덩어리로 저장합니다. 이는 임베딩과 인덱싱에는 효과적이지만 검색을 방해합니다. 사용자 쿼리는 일반적으로 흩어져 있는 단락을 반환하므로 문서를 수동으로 그룹화하고 재구성해야 합니다. 구조체 배열과 MAX_SIM을 사용하면 <strong>각 문서가 하나의 행이</strong> 되도록 저장 스키마를 재설계할 수 있으며, Milvus는 기본적으로 전체 문서의 순위를 매기고 반환할 수 있습니다.</p>
<p>다음 단계에서는 그 방법을 보여드리겠습니다:</p>
<ol>
<li><p>Wikipedia 문단 데이터 로드 및 사전 처리하기</p></li>
<li><p>동일한 문서에 속하는 모든 단락을 구조 배열로 묶습니다.</p></li>
<li><p>이 구조화된 문서를 Milvus에 삽입합니다.</p></li>
<li><p>MAX_SIM 쿼리를 실행하여 중복 제거나 순위 재조정 없이 전체 문서를 깔끔하게 검색하기</p></li>
</ol>
<p>이 튜토리얼이 끝나면 Milvus가 사용자가 기대하는 방식으로 엔티티 수준 검색을 직접 처리하는 작업 파이프라인을 갖추게 됩니다.</p>
<p><strong>데이터 모델:</strong></p>
<pre><code translate="no">{
    <span class="hljs-string">&quot;wiki_id&quot;</span>: <span class="hljs-built_in">int</span>,                  <span class="hljs-comment"># WIKI ID(primary key） </span>
    <span class="hljs-string">&quot;paragraphs&quot;</span>: ARRAY&lt;STRUCT&lt;      <span class="hljs-comment"># Array of paragraph structs</span>
        text:VARCHAR                 <span class="hljs-comment"># Paragraph text</span>
        emb: FLOAT_VECTOR(<span class="hljs-number">768</span>)       <span class="hljs-comment"># Embedding for each paragraph</span>
    &gt;&gt;
}
<button class="copy-code-btn"></button></code></pre>
<p><strong>1단계: 데이터 그룹화 및 변환</strong></p>
<p>이 데모에서는 <a href="https://huggingface.co/datasets/Cohere/wikipedia-22-12-simple-embeddings">간단한 Wikipedia 임베딩</a> 데이터 세트를 사용합니다.</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> pandas <span class="hljs-keyword">as</span> pd
<span class="hljs-keyword">import</span> pyarrow <span class="hljs-keyword">as</span> pa

<span class="hljs-comment"># Load the dataset and group by wiki_id</span>
df = pd.read_parquet(<span class="hljs-string">&quot;train-*.parquet&quot;</span>)
grouped = df.groupby(<span class="hljs-string">&#x27;wiki_id&#x27;</span>)

<span class="hljs-comment"># Build the paragraph array for each article</span>
wiki_data = []
<span class="hljs-keyword">for</span> wiki_id, group <span class="hljs-keyword">in</span> grouped:
    wiki_data.append({
        <span class="hljs-string">&#x27;wiki_id&#x27;</span>: wiki_id,
        <span class="hljs-string">&#x27;paragraphs&#x27;</span>: [{<span class="hljs-string">&#x27;text&#x27;</span>: row[<span class="hljs-string">&#x27;text&#x27;</span>], <span class="hljs-string">&#x27;emb&#x27;</span>: row[<span class="hljs-string">&#x27;emb&#x27;</span>]}
                       <span class="hljs-keyword">for</span> _, row <span class="hljs-keyword">in</span> group.iterrows()]
    })
<button class="copy-code-btn"></button></code></pre>
<p><strong>2단계: Milvus 컬렉션 만들기</strong></p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient, DataType

client = MilvusClient(uri=<span class="hljs-string">&quot;http://localhost:19530&quot;</span>)
schema = client.create_schema()
schema.add_field(<span class="hljs-string">&quot;wiki_id&quot;</span>, DataType.INT64, is_primary=<span class="hljs-literal">True</span>)

<span class="hljs-comment"># Define the Struct schema</span>
struct_schema = client.create_struct_field_schema()
struct_schema.add_field(<span class="hljs-string">&quot;text&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">65535</span>)
struct_schema.add_field(<span class="hljs-string">&quot;emb&quot;</span>, DataType.FLOAT_VECTOR, dim=<span class="hljs-number">768</span>)

schema.add_field(<span class="hljs-string">&quot;paragraphs&quot;</span>, DataType.ARRAY,
                 element_type=DataType.STRUCT,
                 struct_schema=struct_schema, max_capacity=<span class="hljs-number">200</span>)

client.create_collection(<span class="hljs-string">&quot;wiki_docs&quot;</span>, schema=schema)
<button class="copy-code-btn"></button></code></pre>
<p><strong>3단계: 데이터 삽입 및 색인 구축</strong></p>
<pre><code translate="no"><span class="hljs-meta"># Batch insert documents</span>
client.insert(<span class="hljs-string">&quot;wiki_docs&quot;</span>, wiki_data)

<span class="hljs-meta"># Create an HNSW index</span>
index_params = client.prepare_index_params()
index_params.add_index(
    field_name=<span class="hljs-string">&quot;paragraphs[emb]&quot;</span>,
    index_type=<span class="hljs-string">&quot;HNSW&quot;</span>,
    metric_type=<span class="hljs-string">&quot;MAX_SIM_COSINE&quot;</span>,
    <span class="hljs-keyword">params</span>={<span class="hljs-string">&quot;M&quot;</span>: <span class="hljs-number">16</span>, <span class="hljs-string">&quot;efConstruction&quot;</span>: <span class="hljs-number">200</span>}
)
client.create_index(<span class="hljs-string">&quot;wiki_docs&quot;</span>, index_params)
client.load_collection(<span class="hljs-string">&quot;wiki_docs&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p><strong>4단계: 문서 검색</strong></p>
<pre><code translate="no"><span class="hljs-comment"># Search query</span>
<span class="hljs-keyword">import</span> cohere
<span class="hljs-keyword">from</span> pymilvus.client.embedding_list <span class="hljs-keyword">import</span> EmbeddingList

<span class="hljs-comment"># The dataset uses Cohere&#x27;s multilingual-22-12 embedding model, so we must embed the query using the same model.</span>
co = cohere.Client(<span class="hljs-string">f&quot;&lt;&lt;COHERE_API_KEY&gt;&gt;&quot;</span>)
query = <span class="hljs-string">&#x27;Who founded Youtube&#x27;</span>
response = co.embed(texts=[query], model=<span class="hljs-string">&#x27;multilingual-22-12&#x27;</span>)
query_embedding = response.embeddings
query_emb_list = EmbeddingList()

<span class="hljs-keyword">for</span> vec <span class="hljs-keyword">in</span> query_embedding[<span class="hljs-number">0</span>]:
    query_emb_list.add(vec)

results = client.search(
    collection_name=<span class="hljs-string">&quot;wiki_docs&quot;</span>,
    data=[query_emb_list],
    anns_field=<span class="hljs-string">&quot;paragraphs[emb]&quot;</span>,
    search_params={
        <span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;MAX_SIM_COSINE&quot;</span>,
        <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;ef&quot;</span>: <span class="hljs-number">200</span>, <span class="hljs-string">&quot;retrieval_ann_ratio&quot;</span>: <span class="hljs-number">3</span>}
    },
    limit=<span class="hljs-number">10</span>,
    output_fields=[<span class="hljs-string">&quot;wiki_id&quot;</span>]
)

<span class="hljs-comment"># Results: directly return 10 full articles!</span>
<span class="hljs-keyword">for</span> hit <span class="hljs-keyword">in</span> results[<span class="hljs-number">0</span>]:
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Article <span class="hljs-subst">{hit[<span class="hljs-string">&#x27;entity&#x27;</span>][<span class="hljs-string">&#x27;wiki_id&#x27;</span>]}</span>: Score <span class="hljs-subst">{hit[<span class="hljs-string">&#x27;distance&#x27;</span>]:<span class="hljs-number">.4</span>f}</span>&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p><strong>출력 비교: 기존 검색과 구조 배열 비교</strong></p>
<p>구조 배열의 영향은 데이터베이스가 실제로 무엇을 반환하는지 살펴보면 명확해집니다:</p>
<table>
<thead>
<tr><th style="text-align:center"><strong>차원</strong></th><th style="text-align:center"><strong>기존 접근 방식</strong></th><th style="text-align:center"><strong>구조체 배열</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center"><strong>데이터베이스 출력</strong></td><td style="text-align:center"><strong>상위 100개 단락</strong> 반환(중복성이 높음)</td><td style="text-align:center"><em>상위 10개의 전체 문서</em> 반환 - 깔끔하고 정확함</td></tr>
<tr><td style="text-align:center"><strong>애플리케이션 로직</strong></td><td style="text-align:center"><strong>그룹화, 중복 제거, 재순위</strong> 지정 필요(복잡함)</td><td style="text-align:center">후처리 필요 없음 - Milvus에서 직접 엔티티 수준 결과 제공</td></tr>
</tbody>
</table>
<p>Wikipedia 예시에서는 단락 벡터를 통합된 문서 표현으로 결합하는 가장 간단한 사례만 보여드렸습니다. 하지만 구조 배열의 진정한 강점은 기존의 검색 파이프라인과 최신 AI 아키텍처를 포함한 <strong>모든</strong> 다중 벡터 데이터 모델에 일반화할 수 있다는 점입니다.</p>
<p><strong>기존의 다중 벡터 검색 시나리오</strong></p>
<p>잘 정립된 많은 검색 및 추천 시스템은 자연스럽게 여러 개의 연관 벡터를 가진 엔티티에서 작동합니다. 구조 배열은 이러한 사용 사례에 깔끔하게 매핑됩니다:</p>
<table>
<thead>
<tr><th style="text-align:center"><strong>시나리오</strong></th><th style="text-align:center"><strong>데이터 모델</strong></th><th style="text-align:center"><strong>엔티티별 벡터</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center">🛍️ <strong>이커머스 제품</strong></td><td style="text-align:center">하나의 제품 → 여러 이미지</td><td style="text-align:center">5-20</td></tr>
<tr><td style="text-align:center">🎬 <strong>동영상 검색</strong></td><td style="text-align:center">하나의 동영상 → 여러 클립</td><td style="text-align:center">20-100</td></tr>
<tr><td style="text-align:center">📖 <strong>문서 검색</strong></td><td style="text-align:center">하나의 논문 → 여러 섹션</td><td style="text-align:center">5-15</td></tr>
</tbody>
</table>
<p><strong>AI 모델 워크로드(주요 멀티 벡터 사용 사례)</strong></p>
<p>구조 배열은 세분화된 의미 추론을 위해 엔티티당 대규모 벡터 세트를 의도적으로 생성하는 최신 AI 모델에서 더욱 중요해집니다.</p>
<table>
<thead>
<tr><th style="text-align:center"><strong>모델</strong></th><th style="text-align:center"><strong>데이터 모델</strong></th><th style="text-align:center"><strong>엔티티당 벡터</strong></th><th style="text-align:center"><strong>애플리케이션</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center"><strong>콜버트</strong></td><td style="text-align:center">하나의 문서 → 다수의 토큰 임베딩</td><td style="text-align:center">100-500</td><td style="text-align:center">법률 텍스트, 학술 논문, 세분화된 문서 검색</td></tr>
<tr><td style="text-align:center"><strong>ColPali</strong></td><td style="text-align:center">하나의 PDF 페이지 → 많은 패치 임베딩</td><td style="text-align:center">256-1024</td><td style="text-align:center">재무 보고서, 계약서, 송장, 멀티모달 문서 검색</td></tr>
</tbody>
</table>
<p>이러한 모델에는 다중 벡터 저장 패턴이 <em>필요합니다</em>. 구조 배열 이전에는 개발자가 벡터를 여러 행으로 분할하고 결과를 다시 수작업으로 연결해야 했습니다. 이제 Milvus를 사용하면 이러한 엔티티를 기본적으로 저장하고 검색할 수 있으며 MAX_SIM이 문서 수준 스코어링을 자동으로 처리합니다.</p>
<h3 id="2-ColPali-Image-Based-Document-Search" class="common-anchor-header">2. ColPali 이미지 기반 문서 검색</h3><p><a href="https://zilliz.com/blog/colpali-enhanced-doc-retrieval-with-vision-language-models-and-colbert-strategy"><strong>ColPali는</strong></a> 크로스 모달 PDF 검색을 위한 강력한 모델입니다. 텍스트에 의존하는 대신 각 PDF 페이지를 이미지로 처리하고 최대 1024개의 시각적 패치로 분할하여 패치당 하나의 임베딩을 생성합니다. 기존 데이터베이스 스키마에서는 단일 페이지를 수백 또는 수천 개의 개별 행으로 저장해야 하므로 데이터베이스에서 이러한 행이 동일한 페이지에 속한다는 것을 이해할 수 없습니다. 그 결과, 엔티티 수준 검색은 파편화되고 비실용적이 됩니다.</p>
<p>구조 배열은 모든 패치 임베딩을 <em>단일 필드 안에</em> 저장하여 Milvus가 페이지를 하나의 응집력 있는 다중 벡터 엔티티로 취급할 수 있도록 함으로써 이 문제를 깔끔하게 해결합니다.</p>
<p>기존의 PDF 검색은 페이지 이미지를 텍스트로 변환하는 <strong>OCR에</strong> 의존하는 경우가 많습니다. 이는 일반 텍스트에는 효과적이지만 차트, 표, 레이아웃 및 기타 시각적 단서가 손실됩니다. ColPali는 페이지 이미지에서 직접 작업하여 모든 시각적 및 텍스트 정보를 보존함으로써 이러한 제한을 피합니다. 각 페이지에는 이제 수백 개의 벡터가 포함되므로 많은 임베딩을 하나의 엔티티로 집계할 수 있는 데이터베이스가 필요하며, 바로 Array of Structures + MAX_SIM이 제공하는 기능입니다.</p>
<p>가장 일반적인 사용 사례는 각 PDF 페이지가 다중 벡터 엔티티가 되는 <strong>Vision RAG입니다</strong>. 일반적인 시나리오는 다음과 같습니다:</p>
<ul>
<li><p><strong>재무 보고서:</strong> 수천 개의 PDF에서 특정 차트나 표가 포함된 페이지를 검색합니다.</p></li>
<li><p><strong>계약서:</strong> 스캔하거나 촬영한 법률 문서에서 조항을 검색합니다.</p></li>
<li><p>송장<strong>:</strong> 공급업체, 금액 또는 레이아웃별로 송장을 찾습니다.</p></li>
<li><p><strong>프레젠테이션:</strong> 특정 그림이나 도표가 포함된 슬라이드를 찾습니다.</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Col_Pali_1daaab3c1c.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>데이터 모델:</strong></p>
<pre><code translate="no">{
    <span class="hljs-string">&quot;page_id&quot;</span>: <span class="hljs-built_in">int</span>,                     <span class="hljs-comment"># Page ID (primary key) </span>
    <span class="hljs-string">&quot;page_number&quot;</span>: <span class="hljs-built_in">int</span>,                 <span class="hljs-comment"># Page number within the document </span>
    <span class="hljs-string">&quot;doc_name&quot;</span>: VARCHAR,                <span class="hljs-comment"># Document name</span>
    <span class="hljs-string">&quot;patches&quot;</span>: ARRAY&lt;STRUCT&lt;            <span class="hljs-comment"># Array of patch objects</span>
        patch_embedding: FLOAT_VECTOR(<span class="hljs-number">128</span>)  <span class="hljs-comment"># Embedding for each patch</span>
    &gt;&gt;
}
<button class="copy-code-btn"></button></code></pre>
<p><strong>1단계: 데이터 준비</strong>ColPali가 이미지나 텍스트를 다중 벡터 표현으로 변환하는 방법에 대한 자세한 내용은 문서를 참조하세요.</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> torch
<span class="hljs-keyword">from</span> PIL <span class="hljs-keyword">import</span> Image

<span class="hljs-keyword">from</span> colpali_engine.models <span class="hljs-keyword">import</span> ColPali, ColPaliProcessor

model_name = <span class="hljs-string">&quot;vidore/colpali-v1.3&quot;</span>

model = ColPali.from_pretrained(
    model_name,
    torch_dtype=torch.bfloat16,
    device_map=<span class="hljs-string">&quot;cuda:0&quot;</span>,  <span class="hljs-comment"># or &quot;mps&quot; if on Apple Silicon</span>
).<span class="hljs-built_in">eval</span>()

processor = ColPaliProcessor.from_pretrained(model_name)
<span class="hljs-comment"># Example: 2 documents, 5 pages each, total 10 images</span>
images = [
    Image.<span class="hljs-built_in">open</span>(<span class="hljs-string">&quot;path/to/your/image1.png&quot;</span>), 
    Image.<span class="hljs-built_in">open</span>(<span class="hljs-string">&quot;path/to/your/image2.png&quot;</span>), 
    ....
    Image.<span class="hljs-built_in">open</span>(<span class="hljs-string">&quot;path/to/your/image10.png&quot;</span>)
]
<span class="hljs-comment"># Convert each image into multiple patch embeddings</span>
batch_images = processor.process_images(images).to(model.device)
<span class="hljs-keyword">with</span> torch.no_grad():
    image_embeddings = model(**batch_images)
<button class="copy-code-btn"></button></code></pre>
<p><strong>2단계: 밀버스 컬렉션 만들기</strong></p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient, DataType

client = MilvusClient(uri=<span class="hljs-string">&quot;http://localhost:19530&quot;</span>)
schema = client.create_schema()
schema.add_field(<span class="hljs-string">&quot;page_id&quot;</span>, DataType.INT64, is_primary=<span class="hljs-literal">True</span>)
schema.add_field(<span class="hljs-string">&quot;page_number&quot;</span>, DataType.INT64)
schema.add_field(<span class="hljs-string">&quot;doc_name&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">500</span>)

<span class="hljs-comment"># Struct Array for patches</span>
struct_schema = client.create_struct_field_schema()
struct_schema.add_field(<span class="hljs-string">&quot;patch_embedding&quot;</span>, DataType.FLOAT_VECTOR, dim=<span class="hljs-number">128</span>)

schema.add_field(<span class="hljs-string">&quot;patches&quot;</span>, DataType.ARRAY,
                 element_type=DataType.STRUCT,
                 struct_schema=struct_schema, max_capacity=<span class="hljs-number">2048</span>)

client.create_collection(<span class="hljs-string">&quot;doc_pages&quot;</span>, schema=schema)
<button class="copy-code-btn"></button></code></pre>
<p><strong>3단계: 데이터 삽입 및 색인 구축</strong></p>
<pre><code translate="no"><span class="hljs-comment"># Prepare data for insertion</span>
page_data=[
    {
        <span class="hljs-string">&quot;page_id&quot;</span>: <span class="hljs-number">0</span>,
        <span class="hljs-string">&quot;page_number&quot;</span>: <span class="hljs-number">0</span>,
        <span class="hljs-string">&quot;doc_name&quot;</span>: <span class="hljs-string">&quot;Q1_Financial_Report.pdf&quot;</span>,
        <span class="hljs-string">&quot;patches&quot;</span>: [
            {<span class="hljs-string">&quot;patch_embedding&quot;</span>: emb} <span class="hljs-keyword">for</span> emb <span class="hljs-keyword">in</span> image_embeddings[<span class="hljs-number">0</span>]
        ],
    },
    ...,
    {
        <span class="hljs-string">&quot;page_id&quot;</span>: <span class="hljs-number">9</span>,
        <span class="hljs-string">&quot;page_number&quot;</span>: <span class="hljs-number">4</span>,
        <span class="hljs-string">&quot;doc_name&quot;</span>: <span class="hljs-string">&quot;Product_Manual.pdf&quot;</span>,
        <span class="hljs-string">&quot;patches&quot;</span>: [
            {<span class="hljs-string">&quot;patch_embedding&quot;</span>: emb} <span class="hljs-keyword">for</span> emb <span class="hljs-keyword">in</span> image_embeddings[<span class="hljs-number">9</span>]
        ],
    },
]

client.insert(<span class="hljs-string">&quot;doc_pages&quot;</span>, page_data)

<span class="hljs-comment"># Create index</span>
index_params = client.prepare_index_params()
index_params.add_index(
    field_name=<span class="hljs-string">&quot;patches[patch_embedding]&quot;</span>,
    index_type=<span class="hljs-string">&quot;HNSW&quot;</span>,
    metric_type=<span class="hljs-string">&quot;MAX_SIM_IP&quot;</span>,
    params={<span class="hljs-string">&quot;M&quot;</span>: <span class="hljs-number">32</span>, <span class="hljs-string">&quot;efConstruction&quot;</span>: <span class="hljs-number">200</span>}
)
client.create_index(<span class="hljs-string">&quot;doc_pages&quot;</span>, index_params)
client.load_collection(<span class="hljs-string">&quot;doc_pages&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p><strong>4단계: 교차 모달 검색: 텍스트 쿼리 → 이미지 결과</strong></p>
<pre><code translate="no"><span class="hljs-comment"># Run the search</span>
<span class="hljs-keyword">from</span> pymilvus.client.embedding_list <span class="hljs-keyword">import</span> EmbeddingList

queries = [
    <span class="hljs-string">&quot;quarterly revenue growth chart&quot;</span>    
]
<span class="hljs-comment"># Convert the text query into a multi-vector representation</span>
batch_queries = processor.process_queries(queries).to(model.device)
<span class="hljs-keyword">with</span> torch.no_grad():
    query_embeddings = model(**batch_queries)

query_emb_list = EmbeddingList()
<span class="hljs-keyword">for</span> vec <span class="hljs-keyword">in</span> query_embeddings[<span class="hljs-number">0</span>]:
    query_emb_list.add(vec)
results = client.search(
    collection_name=<span class="hljs-string">&quot;doc_pages&quot;</span>,
    data=[query_emb_list],
    anns_field=<span class="hljs-string">&quot;patches[patch_embedding]&quot;</span>,
    search_params={
        <span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;MAX_SIM_IP&quot;</span>,
        <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;ef&quot;</span>: <span class="hljs-number">100</span>, <span class="hljs-string">&quot;retrieval_ann_ratio&quot;</span>: <span class="hljs-number">3</span>}
    },
    limit=<span class="hljs-number">3</span>,
    output_fields=[<span class="hljs-string">&quot;page_id&quot;</span>, <span class="hljs-string">&quot;doc_name&quot;</span>, <span class="hljs-string">&quot;page_number&quot;</span>]
)


<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Query: &#x27;<span class="hljs-subst">{queries[<span class="hljs-number">0</span>]}</span>&#x27;&quot;</span>)
<span class="hljs-keyword">for</span> i, hit <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(results, <span class="hljs-number">1</span>):
    entity = hit[<span class="hljs-string">&#x27;entity&#x27;</span>]
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;<span class="hljs-subst">{i}</span>. <span class="hljs-subst">{entity[<span class="hljs-string">&#x27;doc_name&#x27;</span>]}</span> - Page <span class="hljs-subst">{entity[<span class="hljs-string">&#x27;page_number&#x27;</span>]}</span>&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   Score: <span class="hljs-subst">{hit[<span class="hljs-string">&#x27;distance&#x27;</span>]:<span class="hljs-number">.4</span>f}</span>\n&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p><strong>샘플 출력:</strong></p>
<pre><code translate="no"><span class="hljs-title class_">Query</span>: <span class="hljs-string">&#x27;quarterly revenue growth chart&#x27;</span>
<span class="hljs-number">1.</span> Q1_Financial_Report.<span class="hljs-property">pdf</span> - <span class="hljs-title class_">Page</span> <span class="hljs-number">2</span>
   <span class="hljs-title class_">Score</span>: <span class="hljs-number">0.9123</span>

<span class="hljs-number">2.</span> Q1_Financial_Report.<span class="hljs-property">pdf</span> - <span class="hljs-title class_">Page</span> <span class="hljs-number">1</span>
   <span class="hljs-title class_">Score</span>: <span class="hljs-number">0.7654</span>

<span class="hljs-number">3.</span> <span class="hljs-title class_">Product</span>_Manual.<span class="hljs-property">pdf</span> - <span class="hljs-title class_">Page</span> <span class="hljs-number">1</span>
   <span class="hljs-title class_">Score</span>: <span class="hljs-number">0.5231</span>
<button class="copy-code-btn"></button></code></pre>
<p>여기서 결과는 전체 PDF 페이지를 직접 반환합니다. 기본 1024 패치 임베딩에 대해 걱정할 필요가 없습니다. Milvus가 모든 집계를 자동으로 처리하기 때문입니다.</p>
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
    </button></h2><p>대부분의 벡터 데이터베이스는 각 조각을 독립적인 레코드로 저장하므로 애플리케이션은 전체 문서, 제품 또는 페이지가 필요할 때 해당 조각을 재조립해야 합니다. 구조체 배열은 이를 바꿔줍니다. 스칼라, 벡터, 텍스트 및 기타 필드를 하나의 구조화된 개체로 결합함으로써 하나의 데이터베이스 행이 하나의 완전한 엔티티를 엔드투엔드로 나타낼 수 있습니다.</p>
<p>그 결과, 애플리케이션 계층에서 복잡한 그룹화, 중복 제거, 순위 재지정이 필요했던 작업이 기본 데이터베이스 기능이 되어 간단하지만 강력해집니다. 더 풍부한 구조, 더 스마트한 검색, 더 간단한 파이프라인 등 벡터 데이터베이스의 미래는 바로 이러한 방향으로 나아가고 있습니다.</p>
<p>구조체 배열과 MAX_SIM에 대한 자세한 내용은 아래 설명서를 참조하세요:</p>
<ul>
<li><a href="https://milvus.io/docs/array-of-structs.md">구조체 배열 | Milvus 문서</a></li>
</ul>
<p>최신 Milvus의 기능에 대해 궁금한 점이 있거나 자세히 알아보고 싶으신가요?<a href="https://discord.com/invite/8uyFbECzPX"> Discord 채널에</a> 참여하거나<a href="https://github.com/milvus-io/milvus"> GitHub에</a> 이슈를 제출하세요. 또한<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus 오피스 아워를</a> 통해 20분간의 일대일 세션을 예약하여 인사이트, 안내 및 질문에 대한 답변을 얻을 수도 있습니다.</p>
