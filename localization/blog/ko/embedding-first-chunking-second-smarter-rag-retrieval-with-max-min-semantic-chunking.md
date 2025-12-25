---
id: >-
  embedding-first-chunking-second-smarter-rag-retrieval-with-max-min-semantic-chunking.md
title: '임베딩이 먼저, 청킹이 나중에: 최대-최소 시맨틱 청킹을 통한 더 스마트한 RAG 검색'
author: Rachel Liu
date: 2025-12-24T00:00:00.000Z
cover: assets.zilliz.com/maxmin_cover_8be0b87409.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Max–Min Semantic Chunking, Milvus, RAG, chunking strategies'
meta_title: |
  Max–Min Semantic Chunking: Top Chunking Strategy to Improve RAG Performance
desc: >-
  더 스마트한 청크를 생성하고, 컨텍스트 품질을 개선하며, 더 나은 검색 성능을 제공하는 임베딩 우선 접근 방식을 사용하여 최대 최소 시맨틱
  청킹이 RAG 정확도를 높이는 방법을 알아보세요.
origin: >-
  https://milvus.io/blog/embedding-first-chunking-second-smarter-rag-retrieval-with-max-min-semantic-chunking.md
---
<p><a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">검색 증강 생성(RAG)</a> 은 AI 애플리케이션에 컨텍스트와 메모리를 제공하기 위한 기본 접근 방식으로 자리 잡았으며, AI 에이전트, 고객 지원 도우미, 지식 기반 및 검색 시스템 모두 이를 사용합니다.</p>
<p>거의 모든 RAG 파이프라인에서 표준 프로세스는 동일합니다. 문서를 가져와 청크로 분할한 다음, 유사성 검색을 위해 해당 청크를 <a href="https://milvus.io/">Milvus와</a> 같은 벡터 데이터베이스에 임베드하는 것입니다. <strong>청킹은</strong> 미리 이루어지기 때문에 이러한 청크의 품질은 시스템이 정보를 얼마나 잘 검색하고 최종 답변이 얼마나 정확한지에 직접적인 영향을 미칩니다.</p>
<p>문제는 기존의 청킹 전략은 일반적으로 의미론적 이해 없이 텍스트를 분할한다는 것입니다. 고정 길이 청킹은 토큰 수를 기준으로 잘라내고, 재귀 청킹은 표면 수준 구조를 사용하지만 둘 다 여전히 텍스트의 실제 의미를 무시합니다. 그 결과, 관련 아이디어가 분리되고, 관련 없는 줄이 함께 그룹화되며, 중요한 문맥이 파편화되는 경우가 많습니다.</p>
<p><a href="https://link.springer.com/article/10.1007/s10791-025-09638-7"><strong>최대-최소 시맨틱 청킹은</strong></a> 이 문제에 다르게 접근합니다. 먼저 청킹하는 대신 텍스트를 미리 임베드하고 의미적 유사성을 사용해 경계를 형성해야 할 위치를 결정합니다. 잘라내기 전에 임베딩함으로써 파이프라인은 임의의 길이 제한에 의존하지 않고 의미의 자연스러운 변화를 추적할 수 있습니다.</p>
<p>이전 블로그에서는 '임베드 우선' 아이디어를 대중화하고 실제로 작동할 수 있음을 보여준 Jina AI의 <a href="https://milvus.io/blog/smarter-retrieval-for-rag-late-chunking-with-jina-embeddings-v2-and-milvus.md"><strong>후기 청킹과</strong></a> 같은 방법에 대해 설명했습니다. <strong>최대-최소 시맨틱 청킹은</strong> 동일한 개념을 기반으로 새로운 청크가 필요할 만큼 의미가 변경되는 시점을 식별하는 간단한 규칙을 사용합니다. 이 글에서는 Max-Min이 어떻게 작동하는지 살펴보고 실제 RAG 워크로드에 대한 강점과 한계를 살펴보겠습니다.</p>
<h2 id="How-a-Typical-RAG-Pipeline-Works" class="common-anchor-header">일반적인 RAG 파이프라인의 작동 방식<button data-href="#How-a-Typical-RAG-Pipeline-Works" class="anchor-icon" translate="no">
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
    </button></h2><p>프레임워크에 관계없이 대부분의 RAG 파이프라인은 동일한 4단계 어셈블리 라인을 따릅니다. 아마 여러분도 직접 작성해 보셨을 것입니다:</p>
<h3 id="1-Data-Cleaning-and-Chunking" class="common-anchor-header">1. 데이터 정리 및 청킹</h3><p>파이프라인은 헤더, 바닥글, 탐색 텍스트 및 실제 콘텐츠가 아닌 모든 것을 제거하는 등 원시 문서를 정리하는 것으로 시작합니다. 노이즈가 제거되면 텍스트는 더 작은 조각으로 분할됩니다. 대부분의 팀은 임베딩 모델을 관리하기 쉽도록 고정 크기 청크(일반적으로 300~800토큰)를 사용합니다. 단점은 분할이 의미가 아닌 길이를 기준으로 이루어지기 때문에 경계가 임의적일 수 있다는 것입니다.</p>
<h3 id="2-Embedding-and-Storage" class="common-anchor-header">2. 임베딩 및 저장</h3><p>그런 다음 각 청크는 OpenAI의 임베딩 모델이나 <a href="https://zilliz.com/ai-models/text-embedding-3-small"><code translate="no">text-embedding-3-small</code></a> 또는 BAAI의 인코더를 사용합니다. 결과 벡터는 <a href="https://milvus.io/">Milvus</a> 또는 <a href="https://zilliz.com/cloud">Zilliz Cloud와</a> 같은 벡터 데이터베이스에 저장됩니다. 데이터베이스는 색인 및 유사성 검색을 처리하므로 저장된 모든 청크와 새 쿼리를 빠르게 비교할 수 있습니다.</p>
<h3 id="3-Querying" class="common-anchor-header">3. 쿼리</h3><p>사용자가 <em>"RAG는 어떻게 환각을 줄여주나요?"</em> 와 같은 질문을 하면 <em>.</em> - 라는 질문을 하면 시스템이 쿼리를 임베드하여 데이터베이스로 보냅니다. 데이터베이스는 쿼리에 가장 가까운 벡터를 가진 상위 K 청크를 반환합니다. 이것이 모델이 질문에 답하는 데 사용할 텍스트 조각입니다.</p>
<h3 id="4-Answer-Generation" class="common-anchor-header">4. 답변 생성</h3><p>검색된 청크는 사용자 쿼리와 함께 번들로 묶여 LLM에 공급됩니다. 모델은 제공된 컨텍스트를 근거로 하여 답변을 생성합니다.</p>
<p><strong>청킹은 이 전체 파이프라인의 시작 부분에 위치하지만, 그 영향력은 매우</strong> 큽니다. 청크가 텍스트의 자연스러운 의미와 일치하면 검색이 정확하고 일관되게 느껴집니다. 청크가 어색한 위치에서 잘린 경우, 강력한 임베딩과 빠른 벡터 데이터베이스가 있더라도 시스템에서 올바른 정보를 찾는 데 어려움을 겪게 됩니다.</p>
<h3 id="The-Challenges-of-Getting-Chunking-Right" class="common-anchor-header">올바른 청킹의 과제</h3><p>오늘날 대부분의 RAG 시스템은 두 가지 기본 청킹 방법 중 하나를 사용하며, 두 가지 방법 모두 한계가 있습니다.</p>
<p><strong>1. 고정 크기 청킹</strong></p>
<p>가장 간단한 접근 방식으로, 고정된 토큰 또는 문자 수로 텍스트를 분할합니다. 빠르고 예측 가능하지만 문법, 주제 또는 전환을 전혀 인식하지 못합니다. 문장이 반으로 잘릴 수 있습니다. 때로는 단어까지 잘릴 수 있습니다. 이러한 청크에서 얻은 임베딩은 경계가 텍스트의 실제 구조를 반영하지 않기 때문에 노이즈가 발생하는 경향이 있습니다.</p>
<p><strong>2. 재귀적 문자 분할</strong></p>
<p>이 방법은 좀 더 스마트한 방법입니다. 단락, 줄 바꿈 또는 문장과 같은 단서를 기반으로 텍스트를 계층적으로 분할합니다. 섹션이 너무 길면 재귀적으로 더 길게 나눕니다. 출력은 일반적으로 더 일관성이 있지만 여전히 일관성이 없습니다. 일부 문서는 구조가 명확하지 않거나 섹션 길이가 고르지 않아 검색 정확도가 떨어집니다. 그리고 어떤 경우에는 이 접근 방식이 여전히 모델의 컨텍스트 창을 초과하는 청크를 생성하기도 합니다.</p>
<p>두 방법 모두 정확도 대 컨텍스트라는 동일한 상충 관계에 직면해 있습니다. 청크가 작을수록 검색 정확도는 향상되지만 주변 컨텍스트가 손실되고, 청크가 클수록 의미는 보존되지만 관련 없는 노이즈가 추가될 위험이 있습니다. 적절한 균형을 맞추는 것이 RAG 시스템 설계에서 청킹의 기본이 되기도 하고 좌절감을 주기도 합니다.</p>
<h2 id="Max–Min-Semantic-Chunking-Embed-First-Chunk-Second" class="common-anchor-header">최대-최소 시맨틱 청킹: 선 임베드, 후 청크<button data-href="#Max–Min-Semantic-Chunking-Embed-First-Chunk-Second" class="anchor-icon" translate="no">
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
    </button></h2><p>2025년, S.R. Bhat 등은 <a href="https://arxiv.org/abs/2505.21700"><em>긴 문서 검색을 위한 청크 크기 재고: 다중 데이터 세트 분석</em></a>. 이들의 주요 연구 결과 중 하나는 RAG에 <strong>가장 적합한</strong> 청크 크기가 하나도 없다는 것이었습니다. 작은 청크(64~128개의 토큰)는 사실이나 조회 스타일의 질문에 더 효과적인 반면, 큰 청크(512~1024개의 토큰)는 서술이나 고차원적인 추론 작업에 도움이 되는 경향이 있습니다. 즉, 고정된 크기의 청크는 항상 타협점입니다.</p>
<p>그렇다면 길이를 하나만 고르고 최상의 결과를 기대하는 대신 크기가 아닌 의미별로 청크할 수 없을까요? <a href="https://link.springer.com/article/10.1007/s10791-025-09638-7"><strong>최대-최소 시맨틱 청킹은</strong></a> 제가 찾은 접근 방식 중 하나로, 정확히 그렇게 하려는 시도입니다.</p>
<p>아이디어는 간단합니다. <strong>먼저 임베드하고 나중에 청크하는</strong> 것입니다. 이 알고리즘은 텍스트를 쪼개서 나온 조각을 임베드하는 대신 <em>모든 문장을</em> 먼저 임베드합니다. 그런 다음 이러한 문장 임베딩 간의 의미 관계를 사용하여 경계가 어디로 가야 할지 결정합니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/embed_first_chunk_second_94f69c664c.png" alt="Diagram showing embed-first chunk-second workflow in Max-Min Semantic Chunking" class="doc-image" id="diagram-showing-embed-first-chunk-second-workflow-in-max-min-semantic-chunking" />
   </span> <span class="img-wrapper"> <span>최대-최소 시맨틱 청킹의 임베드-퍼스트 청크-세컨드 워크플로우를 보여주는 다이어그램</span> </span></p>
<p>개념적으로 이 방법은 청킹을 임베딩 공간에서 제한된 클러스터링 문제로 취급합니다. 한 번에 한 문장씩 순서대로 문서를 살펴봅니다. 각 문장에 대해 알고리즘은 임베딩과 현재 청크의 임베딩을 비교합니다. 새 문장이 의미적으로 충분히 가까우면 청크에 포함됩니다. 너무 멀면 알고리즘은 새 청크를 시작합니다. 핵심 제약 조건은 청크가 원래 문장 순서를 따라야 하며, 순서를 바꾸거나 전역 클러스터링을 하지 않아야 한다는 것입니다.</p>
<p>그 결과 문자 카운터가 0에 도달하는 위치가 아니라 문서의 의미가 실제로 변경되는 위치를 반영하는 가변 길이 청크 집합이 생성됩니다.</p>
<h2 id="How-the-Max–Min-Semantic-Chunking-Strategy-Works" class="common-anchor-header">최대-최소 시맨틱 청킹 전략의 작동 방식<button data-href="#How-the-Max–Min-Semantic-Chunking-Strategy-Works" class="anchor-icon" translate="no">
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
    </button></h2><p>최대-최소 시맨틱 청킹은 고차원 벡터 공간에서 문장이 서로 어떻게 연관되어 있는지 비교하여 청크 경계를 결정합니다. 고정된 길이에 의존하는 대신 문서 전체에서 의미가 어떻게 이동하는지를 살펴봅니다. 이 과정은 6단계로 나눌 수 있습니다:</p>
<h3 id="1-Embed-all-sentences-and-start-a-chunk" class="common-anchor-header">1. 모든 문장을 임베드하고 청크 시작</h3><p>임베딩 모델은 문서의 각 문장을 벡터 임베딩으로 변환합니다. 이 모델은 문장을 순서대로 처리합니다. 첫 번째 <em>n-k</em> 문장이 현재 청크 C를 구성하는 경우, 다음 문장(sₙ₋ₖ₊₁)을 평가해야 합니다: C에 합류해야 할까요, 아니면 새 청크를 시작해야 할까요?</p>
<h3 id="2-Measure-how-consistent-the-current-chunk-is" class="common-anchor-header">2. 현재 청크의 일관성 측정</h3><p>청크 C 내에서 모든 문장 임베딩 간의 최소 쌍별 코사인 유사도를 계산합니다. 이 값은 청크 내의 문장들이 얼마나 밀접하게 연관되어 있는지를 반영합니다. 최소 유사도가 낮을수록 문장의 연관성이 낮으므로 청크를 분할해야 할 수 있음을 나타냅니다.</p>
<h3 id="3-Compare-the-new-sentence-to-the-chunk" class="common-anchor-header">3. 새 문장을 청크와 비교합니다.</h3><p>다음으로, 새 문장과 이미 C에 있는 문장 사이의 최대 코사인 유사도를 계산합니다. 이는 새 문장이 기존 청크와 의미적으로 얼마나 잘 일치하는지를 반영합니다.</p>
<h3 id="4-Decide-whether-to-extend-the-chunk-or-start-a-new-one" class="common-anchor-header">4. 청크를 확장할지 아니면 새 청크를 시작할지 결정합니다.</h3><p>이것이 핵심 규칙입니다:</p>
<ul>
<li><p><strong>새 문장의</strong> 청크 <strong>C와의</strong> <strong>최대 유사성이</strong> 청크 <strong>내부의 최소 유사성보다</strong> <strong>크거나 같으면</strong> → 새 문장이 청크에 맞고 청크에 유지됩니다.</p></li>
<li><p>그렇지 않으면 → 새 청크를 시작합니다.</p></li>
</ul>
<p>이렇게 하면 각 청크가 내부 의미론적 일관성을 유지할 수 있습니다.</p>
<h3 id="5-Adjust-thresholds-as-the-document-changes" class="common-anchor-header">5. 문서 변경에 따라 임계값 조정하기</h3><p>청크 품질을 최적화하기 위해 청크 크기 및 유사성 임계값과 같은 매개변수를 동적으로 조정할 수 있습니다. 이를 통해 알고리즘이 다양한 문서 구조와 의미 밀도에 적응할 수 있습니다.</p>
<h3 id="6-Handle-the-first-few-sentences" class="common-anchor-header">6. 처음 몇 개의 문장 처리</h3><p>청크에 문장이 하나만 포함된 경우 알고리즘은 고정 유사도 임계값을 사용해 첫 번째 비교를 처리합니다. 문장 1과 문장 2의 유사도가 해당 임계값을 초과하면 청크를 형성합니다. 그렇지 않으면 즉시 분리됩니다.</p>
<h2 id="Strengths-and-Limitations-of-Max–Min-Semantic-Chunking" class="common-anchor-header">최대-최소 시맨틱 청킹의 장점과 한계<button data-href="#Strengths-and-Limitations-of-Max–Min-Semantic-Chunking" class="anchor-icon" translate="no">
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
    </button></h2><p>최대-최소 시맨틱 청킹은 길이 대신 의미를 사용하여 RAG 시스템이 텍스트를 분할하는 방식을 개선하지만, 만병통치약은 아닙니다. 다음은 이 기능이 잘하는 점과 아직 부족한 점을 실제로 살펴보는 것입니다.</p>
<h3 id="What-It-Does-Well" class="common-anchor-header">잘하는 기능</h3><p>최대-최소 시맨틱 청킹은 세 가지 중요한 면에서 기존 청킹을 개선합니다:</p>
<h4 id="1-Dynamic-meaning-driven-chunk-boundaries" class="common-anchor-header"><strong>1. 동적, 의미 중심의 청크 경계</strong></h4><p>고정 크기 또는 구조 기반 접근 방식과 달리, 이 방법은 의미적 유사성에 의존해 청킹을 유도합니다. 현재 청크 내의 최소 유사성(얼마나 응집력이 있는지)과 새 문장과 해당 청크 간의 최대 유사성(얼마나 잘 맞는지)을 비교합니다. 후자가 더 높으면 문장이 청크에 합류하고, 그렇지 않으면 새 청크가 시작됩니다.</p>
<h4 id="2-Simple-practical-parameter-tuning" class="common-anchor-header"><strong>2. 간단하고 실용적인 매개변수 튜닝</strong></h4><p>알고리즘은 단 세 가지 핵심 하이퍼파라미터에 의존합니다:</p>
<ul>
<li><p><strong>최대 청크 크기</strong></p></li>
<li><p>처음 두 문장 사이의 <strong>최소 유사도</strong>, 그리고</p></li>
<li><p>새 문장을 추가하기 위한 <strong>유사성 임계값</strong>.</p></li>
</ul>
<p>이러한 매개변수는 문맥에 따라 자동으로 조정되며, 청크가 클수록 일관성을 유지하기 위해 더 엄격한 유사성 임계값이 필요합니다.</p>
<h4 id="3-Low-processing-overhead" class="common-anchor-header"><strong>3. 낮은 처리 오버헤드</strong></h4><p>RAG 파이프라인은 이미 문장 임베딩을 계산하기 때문에 최대-최소 시맨틱 청킹은 과중한 계산을 추가하지 않습니다. 문장을 스캔하는 동안 일련의 코사인 유사성 검사만 수행하면 됩니다. 따라서 추가 모델이나 다단계 클러스터링이 필요한 많은 시맨틱 청킹 기법보다 저렴합니다.</p>
<h3 id="What-It-Still-Can’t-Solve" class="common-anchor-header">아직 해결하지 못한 문제</h3><p>최대-최소 시맨틱 청킹은 청크 경계를 개선하지만 문서 분할의 모든 문제를 제거하지는 못합니다. 알고리즘은 문장을 순서대로 처리하고 로컬에서만 클러스터링하기 때문에, 여전히 길거나 복잡한 문서에서 장거리 관계를 놓칠 수 있습니다.</p>
<p>한 가지 일반적인 문제는 <strong>문맥 파편화입니다</strong>. 중요한 정보가 문서의 여러 부분에 분산되어 있는 경우, 알고리즘은 해당 부분을 별도의 청크로 배치할 수 있습니다. 그러면 각 청크는 의미의 일부만 전달합니다.</p>
<p>예를 들어, 아래 그림과 같이 Milvus 2.4.13 릴리즈 노트에서 한 청크에는 버전 식별자가 포함되어 있고 다른 청크에는 기능 목록이 포함되어 있을 수 있습니다. <em>"Milvus 2.4.13에 어떤 새로운 기능이 도입되었나요?"</em> 와 같은 쿼리는 두 가지 모두에 의존합니다. 이러한 세부 정보가 서로 다른 청크로 나뉘어 있으면 임베딩 모델이 이를 연결하지 못하여 검색 성능이 저하될 수 있습니다.</p>
<ul>
<li>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/v2413_a98e1b1f99.png" alt="Example showing context fragmentation in Milvus 2.4.13 Release Notes with version identifier and feature list in separate chunks" class="doc-image" id="example-showing-context-fragmentation-in-milvus-2.4.13-release-notes-with-version-identifier-and-feature-list-in-separate-chunks" />
   </span> <span class="img-wrapper"> <span>버전 식별자와 기능 목록이 별도의 청크에 있는 Milvus 2.4.13 릴리스 노트의 컨텍스트 조각화를 보여주는 예시</span> </span></li>
</ul>
<p>이러한 단편화는 LLM 생성 단계에도 영향을 미칩니다. 버전 참조가 한 청크에 있고 기능 설명이 다른 청크에 있는 경우 모델은 불완전한 컨텍스트를 수신하고 둘 사이의 관계를 명확하게 추론할 수 없습니다.</p>
<p>이러한 경우를 완화하기 위해 시스템에서는 슬라이딩 창, 청크 경계 겹치기 또는 멀티패스 스캔과 같은 기술을 사용하는 경우가 많습니다. 이러한 접근 방식은 누락된 컨텍스트 일부를 다시 도입하고 단편화를 줄이며 검색 단계에서 관련 정보를 유지하는 데 도움이 됩니다.</p>
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
    </button></h2><p>최대-최소 시맨틱 청킹이 모든 RAG 문제에 대한 마법의 해결책은 아니지만, 청크 경계를 보다 합리적으로 생각할 수 있는 방법을 제공합니다. 토큰 제한에 따라 아이디어가 잘리는 위치를 결정하는 대신 임베딩을 사용하여 의미가 실제로 이동하는 위치를 감지합니다. API, 사양, 로그, 릴리즈 노트, 문제 해결 안내서 등 많은 실제 문서의 경우 이 방법만으로도 검색 품질을 눈에 띄게 높일 수 있습니다.</p>
<p>이 접근 방식이 마음에 드는 이유는 기존 RAG 파이프라인에 자연스럽게 들어맞는다는 점입니다. 이미 문장이나 단락을 임베드한 경우, 추가 비용은 기본적으로 코사인 유사성 검사 몇 번이면 충분합니다. 추가 모델, 복잡한 클러스터링 또는 무거운 사전 처리가 필요하지 않습니다. 그리고 이 방법이 제대로 작동할 때 생성되는 청크는 우리가 읽을 때 정보를 정신적으로 그룹화하는 방식에 더 가깝게 '인간적'으로 느껴집니다.</p>
<p>하지만 이 방법에는 여전히 사각지대가 있습니다. 로컬에서만 의미를 파악하고 의도적으로 흩어져 있는 정보를 다시 연결할 수 없습니다. 특히 참조와 설명이 서로 멀리 떨어져 있는 문서의 경우, 겹치는 창, 다중 패스 스캔 및 기타 컨텍스트 보존 기법이 여전히 필요합니다.</p>
<p>하지만 최대 최소 시맨틱 청킹은 임의적인 텍스트 조각화에서 벗어나 실제로 의미를 존중하는 검색 파이프라인으로 나아가는 올바른 방향으로 우리를 이끌고 있습니다. RAG를 더 안정적으로 만드는 방법을 모색하고 있다면 실험해 볼 가치가 있습니다.</p>
<p>질문이 있거나 RAG 성능 개선에 대해 더 자세히 알아보고 싶으신가요? <a href="https://discord.com/invite/8uyFbECzPX">Discord에</a> 참여하여 실제 검색 시스템을 구축하고 튜닝하는 엔지니어들과 매일 소통하세요.</p>
