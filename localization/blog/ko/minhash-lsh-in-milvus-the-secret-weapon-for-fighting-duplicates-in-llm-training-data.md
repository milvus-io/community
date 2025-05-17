---
id: >-
  minhash-lsh-in-milvus-the-secret-weapon-for-fighting-duplicates-in-llm-training-data.md
title: 'Milvus의 MinHash LSH: LLM 훈련 데이터의 중복을 방지하는 비밀 무기'
author: 'Li Liu, Yaya Cheng'
date: 2025-05-16T00:00:00.000Z
desc: >-
  Milvus 2.6의 MinHash LSH는 기존 방식에 비해 2배 빠른 처리 속도와 3~5배의 비용 절감 효과로 대규모 LLM 훈련 데이터
  세트의 중복 제거를 위한 효율적인 솔루션을 제공합니다.
cover: assets.zilliz.com/Chat_GPT_Image_May_16_2025_09_46_39_PM_1f3290ce5e.png
tag: Engineering
recommend: true
publishToMedium: true
tags: 'Milvus, vector database, vector search, AI Agents, LLM'
meta_keywords: 'MinHash LSH, Locality Sensitive Hashing, Milvus, LLM training data'
meta_title: >
  MinHash LSH in Milvus: The Secret Weapon for Fighting Duplicates in LLM
  Training Data
origin: >-
  https://milvus.io/blog/minhash-lsh-in-milvus-the-secret-weapon-for-fighting-duplicates-in-llm-training-data.md
---
<p>대규모 언어 모델(LLM)은 코드를 작성하고, 콘텐츠를 만들고, 복잡한 문제를 해결하는 능력으로 AI 환경을 변화시켰습니다. 그러나 이러한 강력한 모델은 학습을 위해 엄청난 양의 고품질 데이터가 필요합니다.</p>
<p>문제는 원시 학습 데이터에 상당한 중복성이 포함되어 있는 경우가 많다는 것입니다. 이는 마치 다른 중요한 주제는 건너뛰고 같은 수업을 반복해서 아이에게 가르치는 것과 같습니다. 한 대형 AI 회사가 바로 이 문제를 가지고 저희를 찾아왔습니다. 야심찬 새 언어 모델을 구축하고 있었지만 수백억 개의 문서를 중복 제거하는 데 어려움을 겪고 있었습니다. 기존의 매칭 방식은 이 정도 규모로는 확장할 수 없었고, 전문화된 중복 제거 도구는 막대한 계산 리소스를 필요로 했기 때문에 경제적으로 실행할 수 없었습니다.</p>
<p>이 문제를 해결하기 위해 저희는 Milvus 2.6에서 사용할 수 있는 MinHash LSH(지역 민감 해싱) 인덱싱을 해결책으로 제시했습니다. 이 글에서는 MinHash LSH가 LLM 학습을 위한 데이터 중복 제거 문제를 효율적으로 해결하는 방법을 살펴보겠습니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Chat_GPT_Image_May_16_2025_09_46_39_PM_1f3290ce5e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Data-Deduplication-Why-It-Matters-for-LLM-Training" class="common-anchor-header">데이터 중복 제거: LLM 훈련에 데이터 중복 제거가 중요한 이유<button data-href="#Data-Deduplication-Why-It-Matters-for-LLM-Training" class="anchor-icon" translate="no">
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
    </button></h2><p>강력한 LLM을 훈련하려면 고품질의 다양한 데이터가 필수적입니다. 훈련 데이터에 중복 콘텐츠가 나타나면 몇 가지 중요한 문제가 발생합니다:</p>
<ul>
<li><p><strong>리소스 낭비:</strong> 중복 데이터는 훈련 시간, 비용, 에너지 소비를 증가시킵니다.</p></li>
<li><p><strong>성능 저하:</strong> 모델이 반복되는 콘텐츠에 과도하게 적응하여 새로운 정보에 대한 일반화 능력이 제한될 수 있습니다.</p></li>
<li><p><strong>암기 효과:</strong> 중복된 콘텐츠는 모델이 특정 텍스트를 그대로 암기하고 재현할 가능성을 높입니다. 또한 잠재적으로 개인정보 유출이나 저작권 문제로 이어질 수 있습니다.</p></li>
<li><p><strong>오해의 소지가 있는 평가:</strong> 학습 세트와 테스트 세트 간에 중복이 발생하면 실수로 성능 지표가 부풀려질 수 있습니다.</p></li>
</ul>
<p>중복을 찾아 제거하는 데는 세 가지 주요 접근 방식이 있습니다:</p>
<ul>
<li><p><strong>정확히 일치:</strong> 해싱을 통해 동일한 중복을 식별합니다.</p></li>
<li><p><strong>근사 매칭:</strong> MinHash LSH 및 Jaccard 유사도와 같은 알고리즘을 사용하여 중복에 가까운 콘텐츠를 찾습니다.</p></li>
<li><p>시맨틱<strong>매칭:</strong> 벡터 임베딩을 사용하여 유사한 의미를 가진 콘텐츠를 식별합니다.</p></li>
</ul>
<p>사전 학습 코퍼스가 테라바이트 또는 페타바이트에 달하기 때문에 쌍별 비교와 같은 기존의 정확한 매칭 방식은 계산적으로 불가능합니다. 시맨틱 중복 제거는 임베딩 모델을 사용해 벡터를 생성함으로써 상당한 오버헤드를 추가합니다. 따라서 대규모 중복 제거를 실용적으로 수행하기 위해서는 비용을 관리 가능한 수준으로 유지하면서 리콜과 정확도의 균형을 맞출 <strong>수 있는 MinHash LSH와</strong>같은 보다 혁신적인 근사 방법이 필요합니다.</p>
<h2 id="MinHash-LSH-Efficiently-Detecting-Near-Duplicates-in-Massive-Datasets" class="common-anchor-header">MinHash LSH: 대규모 데이터 세트에서 중복에 가까운 항목을 효율적으로 탐지하기<button data-href="#MinHash-LSH-Efficiently-Detecting-Near-Duplicates-in-Massive-Datasets" class="anchor-icon" translate="no">
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
    </button></h2><p>훈련 데이터의 바다에서 중복에 가까운 데이터를 찾으려면 효율적이고 정확한 근사치 매칭 알고리즘이 필요합니다. MinHash LSH(지역 민감 해싱)는 이러한 목표를 위한 훌륭한 도구입니다. 복잡해 보이는 이 용어를 단계별로 분석해 보겠습니다.</p>
<h3 id="Step-1-Representing-Documents-with-MinHash" class="common-anchor-header">1단계: MinHash로 문서 표현하기</h3><p>먼저 문서 유사성을 측정하는 방법이 필요합니다. 표준 접근 방식은 Jaccard 유사성을 사용합니다:</p>
<p><span class="katex-display"><span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><semantics><mrow><mi>J</mi><mo stretchy="false">(</mo><mi>A</mi><mo separator="true">,</mo><mi>B</mi><mo stretchy="false">)</mo><mo>=</mo></mrow><annotation encoding="application/x-tex">∣A∩B∣∣A∪B∣J(A,B) = \frac{|A\cap B|}{|A \cup B|}</annotation></semantics></math></span></span></span><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="katex-display"><span class="katex">J<span class="katex-html" aria-hidden="true"><span class="base"><span class="mopen">(</span><span class="mord mathnormal">A</span><span class="mpunct">,</span><span class="mspace" style="margin-right:0.1667em;"></span></span></span> B<span class="katex-html" aria-hidden="true"><span class="base"><span class="mclose">)</span><span class="mspace" style="margin-right:0.2778em;"></span></span></span> =</span></span><span class="mspace" style="margin-right:0.2778em;"></span><span class="katex-display"><span class="katex"></span></span><span class="strut" style="height:2.363em;vertical-align:-0.936em;"></span> <span class="katex-display"><span class="katex"></span></span><span class="mopen nulldelimiter"></span> <span class="katex-display"><span class="katex"></span></span><span class="pstrut" style="height:3em;"></span> <span class="katex-display"><span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord"><span class="mfrac"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:1.427em;"><span style="top:-2.314em;"><span class="mord"><span class="mord mathnormal">∣A</span></span></span></span></span></span></span></span></span></span></span></span><span class="mspace" style="margin-right:0.2222em;"></span><span class="katex-display"><span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord"><span class="mfrac"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:1.427em;"><span style="top:-2.314em;"><span class="mord"><span class="mbin">∪</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mord">B∣</span></span></span></span></span></span></span></span></span></span></span></span><span style="top:-3.23em;"><span class="pstrut" style="height:3em;"></span><span class="frac-line" style="border-bottom-width:0.04em;"></span></span><span class="katex-display"><span class="katex"></span></span><span class="pstrut" style="height:3em;"></span> <span class="katex-display"><span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord"><span class="mfrac"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:1.427em;"><span style="top:-3.677em;"><span class="mord"><span class="mord mathnormal">∣A</span></span></span></span></span></span></span></span></span></span></span></span><span class="mspace" style="margin-right:0.2222em;"></span><span class="katex-display"><span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord"><span class="mfrac"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:1.427em;"><span style="top:-3.677em;"><span class="mord"><span class="mbin">∩</span><span class="mspace" style="margin-right:0.2222em;"></span></span></span></span><span class="vlist-s">B∣</span></span></span></span></span></span></span></span></span><span class="vlist-r"><span class="vlist" style="height:0.936em;"><span></span></span></span><span class="mclose nulldelimiter"></span></p>
<p>이 공식은 문서 A와 문서 B 사이의 겹침, 즉 전체 고유 요소에 대한 공유 요소의 비율을 측정합니다. 값이 클수록 문서가 더 유사하다는 뜻입니다.</p>
<p>하지만 수십억 개의 문서 쌍에 대해 이 수식을 직접 계산하는 것은 리소스 집약적이며 몇 년이 걸립니다. MinHash는 유사성 관계를 보존하면서 훨씬 빠르게 비교할 수 있는 간결한 "지문"(서명)을 생성합니다.</p>
<ol>
<li><strong>분할:</strong> 각 문서를 겹치는 단어 또는 문자 시퀀스(K-싱글)로 나눕니다. 예를 들어, k=3(단어별)인 "나는 벡터 검색을 좋아한다"라는 문장은 다음과 같이 산출됩니다: {"나는 벡터를 좋아한다", "벡터 검색을 좋아한다"}</li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/shingling_858ad58efa.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<ol start="2">
<li><strong>최소해시:</strong> 각 대상포진 집합에 여러 해시 함수를 적용하고 각 함수의 최소 해시값을 기록합니다. 이렇게 하면 각 문서에 대한 서명 벡터가 생성됩니다.</li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/minhash_041003210a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>유사성을 계산할 때, 두 문서의 MinHash 서명에서 해시 값이 같은 위치에 정렬될 확률(이러한 서명의 Jaccard 거리에 해당)은 원래 싱글 세트의 Jaccard 유사성에 대한 근사치를 제공합니다. 이를 통해 더 큰 원본 텍스트를 직접 비교하지 않고도 문서 유사성을 효과적으로 추정할 수 있으며, 대신 압축된 MinHash 서명을 분석할 수 있습니다.</p>
<p>MinHash 원칙은 해시 값이 가장 작은 단어를 사용해 전체 문서를 표현하는 것으로, 추가 해시 함수를 통합하여 정확도를 높입니다. 사소한 단어 변경은 일반적으로 최소 해시 값에 영향을 미치지 않기 때문에 간과될 가능성이 높습니다. 반면에 더 큰 변경은 해시값을 변경하는 경향이 있으며 더 쉽게 감지할 수 있습니다. 이 방법은 다양한 단어에 걸쳐 해시값을 최소 풀링하는 것으로 볼 수 있습니다. MinHash 외에도 문서 서명을 생성하는 데 SimHash와 같은 대안을 사용할 수 있지만 여기서는 설명하지 않습니다.</p>
<h3 id="Step-2-Identifying-Similar-Documents-via-LSH" class="common-anchor-header">2단계: LSH를 통해 유사한 문서 식별하기</h3><p>간결한 MinHash 서명을 사용하더라도 수백만 또는 수십억 개의 문서에서 모든 쌍을 비교하는 것은 여전히 계산 비용이 많이 듭니다. 그래서 <strong>지역 민감 해싱(LSH)이</strong> 등장했습니다.</p>
<p>LSH의 핵심 아이디어는 <strong>의도적으로 충돌을 일으키는</strong>해시 함수를 사용해 <strong>유사한</strong>항목은 같은 버킷에 해시할 가능성이 높지만, 그렇지 않은 항목은 그렇지 않은 해시 함수를 사용하는 것입니다. 이는 충돌을 피하는 것을 목표로 하는 기존 해싱과는 정반대입니다.</p>
<p>MinHash의 경우, 인기있는 LSH 전략은 <strong>밴딩 기법입니다</strong>:</p>
<ol>
<li><p><strong>밴딩</strong>: 각 MinHash 서명(길이 <em>N의</em> 벡터)을 <em>b개의</em> 밴드로 나누고, 각 밴드는 <em>r의</em> 디밍<em>(N = b × r</em>)을 가집니다.</p></li>
<li><p><strong>밴드 해시하기:</strong> 표준 해시 함수를 사용하여 각 밴드( <em>r</em> 값의 하위 벡터)를 버킷에 해시합니다.</p></li>
<li><p><strong>후보 쌍:</strong> 두 문서가 <strong>어떤 밴드</strong> 에서든 버킷을 공유하면 잠재적 일치 문서로 플래그가 지정됩니다.</p></li>
</ol>
<p>밴드 수(b)와 밴드당 차원 수(®)를 조정하여 정확도, 정확도, 검색 효율성 간의 균형을 조절할 수 있습니다.</p>
<p>핵심 아이디어는 매우 유사한 문서는 MinHash 서명에 일치하는 해시값이 많다는 것입니다. 이러한 서명이 밴드로 분할되면 모든 값이 일치하는 밴드가 하나만 있어도 두 개의 문서를 같은 버킷에 넣을 수 있습니다. 문서가 더 유사할수록 적어도 하나의 밴드에서 이러한 일이 발생할 확률이 높아지므로 LSH는 모든 서명을 철저하게 비교하지 않고도 후보 쌍을 효율적으로 표시할 수 있습니다.</p>
<p>요컨대, <strong>MinHash + LSH는</strong> 확장 가능한 대략적인 중복 제거를 가능하게 합니다: MinHash는 문서를 압축 서명으로 압축하고, LSH는 일치할 가능성이 높은 서명을 그룹화하여 검색 공간을 효율적으로 좁힙니다. 군중 속에서 쌍둥이를 발견하는 것과 같습니다. 먼저 모든 사람의 빠른 기능 스냅샷을 찍고(MinHash), 유사 항목을 그룹화한 다음(LSH), 더 작은 그룹에서 실제 중복 여부를 면밀히 검사합니다.</p>
<h2 id="Integrating-MinHash-LSH-in-Milvus-26" class="common-anchor-header">Milvus 2.6에 MinHash LSH 통합<button data-href="#Integrating-MinHash-LSH-in-Milvus-26" class="anchor-icon" translate="no">
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
    </button></h2><p>실제적인 요구로 인해 MinHash LSH를 Milvus 2.6에 통합하게 되었습니다. 앞서 언급했듯이, 선도적인 LLM 회사 중 하나인 Milvus 사용자가 LLM 사전 학습을 위해 방대한 양의 텍스트 데이터를 효율적으로 중복 제거해야 한다는 과제를 가지고 저희에게 연락해왔습니다.</p>
<p>기존의 중복 제거 파이프라인은 일반적으로 저장 및 검색 시스템과 분리된 외부 도구에 의존하기 때문에 구성 요소 간에 많은 비용이 드는 데이터 전송이 필요합니다. 이렇게 파편화된 워크플로는 운영 오버헤드를 증가시키고 분산된 컴퓨팅 리소스를 최대한 활용하지 못하게 합니다.</p>
<p>처리량이 많은 벡터 데이터를 처리하는 Milvus의 강점을 인식하면서 자연스럽게 아이디어가 떠올랐습니다: <strong><em>MinHash LSH가 Milvus에 기본적으로 내장되어 근사치 중복 제거를 일류 데이터베이스 기능으로 만들면 어떨까요?</em></strong></p>
<p>이 접근 방식은 Milvus 내에서 중복 제거부터 시맨틱 검색까지 완벽한 워크플로우를 가능하게 하며, 확장성과 통합 API를 활용하면서 MLOps를 간소화합니다. 파트너와 함께 Milvus의 클라우드 네이티브 아키텍처에 맞게 MinHash LSH를 최적화하여 대규모 중복 제거를 위한 빠르고 확장 가능한 솔루션이 탄생했습니다.</p>
<h3 id="Core-capabilities-in-Milvus-26-include" class="common-anchor-header">Milvus 2.6의 핵심 기능은 다음과 같습니다:</h3><ul>
<li><p><strong>네이티브 MinHash LSH 인덱싱:</strong> LSH에 대한 표준 밴딩 기법을 구현하고 리콜을 개선하기 위해 선택적 Jaccard 리랭킹을 지원합니다. 다양한 워크로드에 유연하게 적용할 수 있도록 인메모리 및 mmap 기반 구현을 모두 제공합니다.</p></li>
<li><p><strong>원활한 API 통합:</strong> 사용자는 Milvus의 표준 SDK와 선언적 API를 사용하여 MinHash 벡터 필드를 정의하고, <code translate="no">MINHASH_LSH</code> 인덱스를 구축하고, 서명 데이터를 삽입하고, 대략적인 유사성 검색을 수행할 수 있습니다.</p></li>
<li><p><strong>분산 및 확장성:</strong> Milvus의 클라우드 네이티브 아키텍처를 기반으로 구축된 이 기능은 대규모 데이터 세트와 높은 처리량을 위한 수평적 확장을 지원합니다.</p></li>
</ul>
<p>이 통합은 인상적인 결과를 가져왔습니다. 완전 관리형 Milvus<a href="https://zilliz.com/cloud">(Zilliz Cloud)</a>에서 MinHash LSH를 실행하여 이 사용자가 <strong>100억 개의 문서를</strong> 효율적으로 중복 제거할 수 있도록 지원했습니다. 이 새로운 솔루션은 이전의 MapReduce 기반 접근 방식에 비해 <strong>처리 속도가 2배 이상</strong> 빨라졌고, Milvus의 최적화된 인덱싱과 쿼리 실행 덕분에 <strong>3~5배의 비용 절감을</strong> 달성했습니다.</p>
<h2 id="Hands-On-Deduplicating-LLM-Datasets-Using-Milvus" class="common-anchor-header">실습: Milvus를 사용해 LLM 데이터 세트 중복 제거하기<button data-href="#Hands-On-Deduplicating-LLM-Datasets-Using-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.6의 MinHash LSH를 사용해 대규모로 대략적인 중복 제거를 수행해 보겠습니다.</p>
<h3 id="Prerequisite-Generating-MinHash-Signatures" class="common-anchor-header">전제 조건: MinHash 서명 생성</h3><p>Milvus는 <strong>미리 생성된</strong> MinHash 서명의 인덱싱과 검색을 처리합니다. Python의 <code translate="no">datasketch</code> 같은 도구 또는 사용자 정의 구현을 사용하여 전처리 중에 이러한 서명을 생성해야 합니다. 일반적인 단계는 다음과 같습니다:</p>
<ol>
<li><p>원시 문서 읽기</p></li>
<li><p>각 문서를 슁글(토큰화 또는 청크화)합니다.</p></li>
<li><p>여러 해시 함수를 적용하여 MinHash 서명(예: 128 크기의 uint64 배열)을 생성합니다.</p></li>
</ol>
<pre><code translate="no"><span class="hljs-keyword">from</span> datasketch <span class="hljs-keyword">import</span> MinHash

text = <span class="hljs-string">&quot;example text for minhash signature&quot;</span>
tokens = text.lower().split()  <span class="hljs-comment"># Step 1 &amp; 2: preprocess + tokenize/shingle</span>
mh = MinHash(num_perm=<span class="hljs-number">128</span>)     <span class="hljs-comment"># Step 3: initialize MinHash</span>
<span class="hljs-keyword">for</span> token <span class="hljs-keyword">in</span> tokens:
    mh.update(token.encode(<span class="hljs-string">&#x27;utf-8&#x27;</span>))  <span class="hljs-comment"># Add shingles to MinHash</span>
signature = mh.hashvalues  <span class="hljs-comment"># This is your MinHash signature (128-dimensional)</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-1-Create-a-Schema-in-Milvus" class="common-anchor-header">1단계: Milvus에서 스키마 만들기</h3><p>MinHash 서명과 해당 문서 ID를 저장하기 위해 Milvus 컬렉션을 만들어야 합니다.</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> numpy <span class="hljs-keyword">as</span> np
<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient
<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> DataType
MILVUS_URI = <span class="hljs-string">&quot;localhost:19530&quot;</span>
COLLECTION_NAME = <span class="hljs-string">&quot;llm_data_dedup_minhash&quot;</span>
MINHASH_DIM = <span class="hljs-number">128</span>
MINHASH_BIT_WIDTH = <span class="hljs-number">64</span> <span class="hljs-comment"># Assuming 64-bit hash values</span>

<span class="hljs-comment"># Load data from NPY file</span>
base = np.load(<span class="hljs-string">&#x27;minhash_vectors.npy&#x27;</span>)
ids = [<span class="hljs-built_in">str</span>(i) <span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(base.shape[<span class="hljs-number">0</span>])]  <span class="hljs-comment"># Generate string IDs</span>

client = MilvusClient(uri=MILVUS_URI)
<span class="hljs-comment"># Check and drop existing collection if needed</span>
<span class="hljs-keyword">if</span> collection_name <span class="hljs-keyword">in</span> client.list_collections():
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Collection <span class="hljs-subst">{collection_name}</span> exists, dropping it...&quot;</span>)
    client.drop_collection(collection_name)
<span class="hljs-comment"># Create collection schema</span>
schema = MilvusClient.create_schema(
    auto_id=<span class="hljs-literal">False</span>,
    enable_dynamic_field=<span class="hljs-literal">False</span>,
)

schema.add_field(field_name=<span class="hljs-string">&quot;input_id&quot;</span>, datatype=DataType.INT64, is_primary=<span class="hljs-literal">True</span>)
schema.add_field(field_name=<span class="hljs-string">&quot;minhash&quot;</span>, datatype=DataType.BINARY_VECTOR, dim=MINHASH_DIM * MINHASH_BIT_WIDTH)
schema.add_field(field_name=<span class="hljs-string">&quot;id&quot;</span>, datatype=DataType.VARCHAR, max_length=<span class="hljs-number">200</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-2-Create-the-MINHASHLSH-Index-and-Collection" class="common-anchor-header"><strong>2단계: MINHASH_LSH 인덱스 및 컬렉션 만들기</strong></h3><p>이것이 핵심 단계입니다. 메트릭 유형으로 JACCARD를 지정하고 LSH 관련 파라미터를 구성해야 합니다.</p>
<pre><code translate="no">INDEX_FIELD_NAME = <span class="hljs-string">&quot;minhash_signature&quot;</span>
<span class="hljs-comment"># Metric type, should be JACCARD for MinHash LSH</span>
METRIC_TYPE = <span class="hljs-string">&quot;MHJACCARD&quot;</span>
INDEX_TYPE = <span class="hljs-string">&quot;MINHASH_LSH&quot;</span>
MINHASH_DIM = <span class="hljs-number">128</span>
MINHASH_BIT_WIDTH = <span class="hljs-number">64</span> <span class="hljs-comment"># Assuming 64-bit hash values</span>

index_params = MilvusClient.prepare_index_params()

index_params.add_index(
    field_name=INDEX_FIELD_NAME,
    index_type=INDEX_TYPE,
    metric_type=METRIC_TYPE,
    params={
        <span class="hljs-comment"># LSH-specific parameters might be configured here, e.g.:</span>
        <span class="hljs-comment"># &quot;band&quot;: 32, # Hypothetical parameter: number of bands</span>
        <span class="hljs-comment"># &quot;element_bit_width&quot;: 64 # Bit width of minhash values</span>
    }
)
<span class="hljs-comment"># Create collection</span>
client.create_collection(
    collection_name=collection_name,
    schema=schema,
    index_params=index_params
)
<button class="copy-code-btn"></button></code></pre>
<p>매개변수 조정에 대한 참고 사항: MinHash LSH의 효율성은 매개변수 선택에 따라 크게 달라집니다. 예를 들어, MinHash 서명 생성 중에 사용되는 해시 함수의 수(예: <code translate="no">MINHASH_DIM</code>)는 서명의 정밀도와 크기에 영향을 줍니다. LSH 단계에서는 밴드 수(<code translate="no">num_bands</code>)와 밴드당 행 수에 따라 유사성 임계값의 감도 범위와 리콜과 정밀도 간의 균형이 결정됩니다. 사용자는 데이터 세트의 특성과 중복 제거 요구 사항에 따라 실험하고 미세 조정해야 합니다. 이 과정은 종종 반복적인 과정입니다.</p>
<h3 id="Step-3-Insert-MinHash-Signatures" class="common-anchor-header"><strong>3단계: 최소 해시 서명 삽입하기</strong></h3><p>문서 일괄 처리와 그에 해당하는 MinHash 서명이 있다고 가정해 보겠습니다.</p>
<pre><code translate="no"><span class="hljs-comment"># Insert data in batches</span>
batch_size = <span class="hljs-number">2000</span>
total_records = base.shape[<span class="hljs-number">0</span>]
num_batches = (total_records + batch_size - <span class="hljs-number">1</span>) // batch_size

<span class="hljs-keyword">for</span> batch_idx <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(num_batches):
    start = batch_idx * batch_size
    end = <span class="hljs-built_in">min</span>((batch_idx + <span class="hljs-number">1</span>) * batch_size, total_records)
    
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Inserting batch <span class="hljs-subst">{batch_idx + <span class="hljs-number">1</span>}</span>/<span class="hljs-subst">{num_batches}</span> (records <span class="hljs-subst">{start}</span>-<span class="hljs-subst">{end}</span>)&quot;</span>)
    
    <span class="hljs-comment"># Prepare batch data</span>
    batch_data = [{
        <span class="hljs-string">&quot;input_id&quot;</span>: i,
        <span class="hljs-string">&quot;minhash&quot;</span>: base[i].tobytes(),
        <span class="hljs-string">&quot;id&quot;</span>: ids[i]
    } <span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(start, end)]
    
    <span class="hljs-comment"># Insert batch</span>
    client.insert(collection_name, batch_data)

<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Data insertion complete&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-5-Search-for-Near-Duplicates" class="common-anchor-header">5단계: 거의 중복된 문서 검색하기</h3><p>문서의 MinHash 서명을 사용하여 컬렉션에서 유사한 문서를 검색합니다.</p>
<pre><code translate="no"><span class="hljs-comment"># Perform search</span>
search_vectors = [vec.tobytes() <span class="hljs-keyword">for</span> vec <span class="hljs-keyword">in</span> base[:<span class="hljs-number">10</span>]]
results = client.search(
    collection_name, 
    data=search_vectors, 
    param={<span class="hljs-string">&quot;metric_type&quot;</span>: METRIC_TYPE, <span class="hljs-string">&quot;params&quot;</span>: search_params_lsh},
    limit=<span class="hljs-number">1</span>, 
    output_fields=[<span class="hljs-string">&quot;id&quot;</span>])

<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\nSearch results:&quot;</span>)
<span class="hljs-keyword">for</span> i, result <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(results):
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Query <span class="hljs-subst">{i}</span>:&quot;</span>)
    <span class="hljs-keyword">for</span> hit <span class="hljs-keyword">in</span> result:
        <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;  - ID: <span class="hljs-subst">{hit[<span class="hljs-string">&#x27;entity&#x27;</span>][<span class="hljs-string">&#x27;id&#x27;</span>]}</span>, Distance: <span class="hljs-subst">{hit[<span class="hljs-string">&#x27;distance&#x27;</span>]}</span>&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-6-Post-Processing-and-Clustering" class="common-anchor-header">6단계: 후처리 및 클러스터링</h3><p>반환된 결과는 중복에 <strong>가까운 후보</strong> 문서입니다. 완전한 중복 제거 그룹을 형성하려면 후보 쌍에 <strong>Union-Find와</strong> 같은 클러스터링 기법을 적용할 수 있습니다. 각 결과 그룹은 중복된 문서 집합을 나타내므로 대표 문서 하나를 보관하고 나머지는 보관하거나 제거합니다.</p>
<h2 id="Conclusion" class="common-anchor-header"><strong>결론</strong><button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.6의 MinHash LSH는 AI 데이터 처리의 비약적인 발전입니다. LLM 데이터 중복 제거를 위한 솔루션으로 시작한 것이 이제는 웹 콘텐츠 정리, 카탈로그 관리, 표절 탐지 등 더 광범위한 사용 사례로 확장되었습니다.</p>
<p>비슷한 사용 사례가 있다면 <a href="https://discord.com/invite/8uyFbECzPX">Milvus Discord에</a> 문의하여 <a href="https://meetings.hubspot.com/chloe-williams1/milvus-office-hour">오피스 아워 미팅에</a> 등록해 주세요.</p>
