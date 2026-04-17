---
id: introducing-pymilvus-integrations-with-embedding-models.md
title: 임베딩 모델과 PyMilvus 통합 소개
author: Stephen Batifol
date: 2024-06-05T00:00:00.000Z
cover: assets.zilliz.com/Getting_started_with_Milvus_cluster_and_K8s_1_34b2c81802.png
tag: Engineering
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  GenAI developers, Retrieval Augmented Generation, RAG
recommend: true
canonicalUrl: >-
  https://milvus.io/blog/introducing-pymilvus-integrations-with-embedding-models.md
---
<p><a href="https://milvus.io/intro">Milvus는</a> AI 애플리케이션을 위해 특별히 설계된 오픈 소스 벡터 데이터베이스입니다. 머신 러닝, 딥 러닝, 그 외 어떤 AI 관련 프로젝트를 진행하든 Milvus는 대규모 벡터 데이터를 처리할 수 있는 강력하고 효율적인 방법을 제공합니다.</p>
<p>이제 Milvus용 Python SDK인 PyMilvus의 <a href="https://milvus.io/docs/embeddings.md">모델 모듈 통합을</a> 통해 임베딩 및 재랭크 모델을 더욱 쉽게 추가할 수 있습니다. 이 통합을 통해 데이터를 검색 가능한 벡터로 변환하거나 <a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">검색 증강 생성(RAG)</a>과 같이 보다 정확한 결과를 위해 결과를 재랭크하는 작업을 간소화할 수 있습니다.</p>
<p>이 블로그에서는 밀도 임베딩 모델, 스파스 임베딩 모델, 리랭커를 검토하고 Python 애플리케이션에서 로컬로 실행할 수 있는 Milvus의 경량 버전인 Milvus <a href="https://milvus.io/blog/introducing-milvus-lite.md">Lite를</a> 사용해 실제로 이를 사용하는 방법을 보여드립니다.</p>
<h2 id="Dense-vs-Sparse-Embeddings" class="common-anchor-header">고밀도 임베딩과 스파스 임베딩<button data-href="#Dense-vs-Sparse-Embeddings" class="anchor-icon" translate="no">
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
    </button></h2><p>통합 기능을 사용하는 방법을 안내하기 전에 벡터 임베딩의 두 가지 주요 범주를 살펴보겠습니다.</p>
<p><a href="https://zilliz.com/glossary/vector-embeddings">벡터 임베딩은</a> 일반적으로 두 가지 주요 카테고리로 나뉩니다: <a href="https://zilliz.com/learn/sparse-and-dense-embeddings"><strong>고밀도 임</strong> 베딩과 <strong>스파스 임베딩입니다</strong></a>.</p>
<ul>
<li><p>고밀도 임베딩은 대부분의 요소 또는 모든 요소가 0이 아닌 고차원 벡터로, 텍스트 의미나 퍼지 의미를 인코딩하는 데 이상적입니다.</p></li>
<li><p>스파스 임베딩은 0 요소가 많은 고차원 벡터로, 정확하거나 인접한 개념을 인코딩하는 데 더 적합합니다.</p></li>
</ul>
<p>Milvus는 두 가지 유형의 임베딩을 모두 지원하며 하이브리드 검색을 제공합니다. <a href="https://zilliz.com/blog/hybrid-search-with-milvus">하이브리드 검색을</a> 사용하면 동일한 컬렉션 내에서 다양한 벡터 필드에 걸쳐 검색을 수행할 수 있습니다. 이러한 벡터는 데이터의 여러 측면을 나타내거나, 다양한 임베딩 모델을 사용하거나, 리랭커를 사용해 결과를 결합하는 등 서로 다른 데이터 처리 방법을 사용할 수 있습니다.</p>
<h2 id="How-to-Use-Our-Embedding-and-Reranking-Integrations" class="common-anchor-header">임베딩 및 재랭크 통합을 사용하는 방법<button data-href="#How-to-Use-Our-Embedding-and-Reranking-Integrations" class="anchor-icon" translate="no">
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
    </button></h2><p>다음 섹션에서는 통합 기능을 사용해 임베딩을 생성하고 벡터 검색을 수행하는 세 가지 실제 예시를 보여드리겠습니다.</p>
<h3 id="Example-1-Use-the-Default-Embedding-Function-to-Generate-Dense-Vectors" class="common-anchor-header">예 1: 기본 임베딩 함수를 사용하여 고밀도 벡터 생성하기</h3><p>Milvus에서 임베딩 및 리랭크 기능을 사용하려면 <code translate="no">model</code> 패키지와 함께 <code translate="no">pymilvus</code> 클라이언트를 설치해야 합니다.</p>
<pre><code translate="no">pip install <span class="hljs-string">&quot;pymilvus[model]&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>이 단계에서는 Milvus <a href="https://milvus.io/docs/quickstart.md">Lite를</a> 설치하여 Python 애플리케이션 내에서 Milvus를 로컬로 실행할 수 있습니다. 또한 임베딩 및 리랭킹을 위한 모든 유틸리티가 포함된 모델 서브 패키지도 포함되어 있습니다.</p>
<p>모델 서브 패키지는 OpenAI, <a href="https://zilliz.com/learn/Sentence-Transformers-for-Long-Form-Text">Sentence Transformers</a>, <a href="https://zilliz.com/learn/bge-m3-and-splade-two-machine-learning-models-for-generating-sparse-embeddings">BGE-M3</a>, BM25, <a href="https://zilliz.com/learn/bge-m3-and-splade-two-machine-learning-models-for-generating-sparse-embeddings">SPLADE</a>, Jina AI 사전 학습 모델 등 다양한 임베딩 모델을 지원합니다.</p>
<p>이 예에서는 간결성을 위해 <code translate="no">all-MiniLM-L6-v2</code> Sentence Transformer 모델을 기반으로 한 <code translate="no">DefaultEmbeddingFunction</code> 을 사용합니다. 이 모델의 용량은 약 70MB이며 처음 사용할 때 다운로드됩니다:</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> model

<span class="hljs-comment"># This will download &quot;all-MiniLM-L6-v2&quot;, a lightweight model.</span>
ef = model.DefaultEmbeddingFunction()

<span class="hljs-comment"># Data from which embeddings are to be generated</span>
docs = [
   <span class="hljs-string">&quot;Artificial intelligence was founded as an academic discipline in 1956.&quot;</span>,
   <span class="hljs-string">&quot;Alan Turing was the first person to conduct substantial research in AI.&quot;</span>,
   <span class="hljs-string">&quot;Born in Maida Vale, London, Turing was raised in southern England.&quot;</span>,
]

embeddings = ef.encode_documents(docs)

<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Embeddings:&quot;</span>, embeddings)
<span class="hljs-comment"># Print dimension and shape of embeddings</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Dim:&quot;</span>, ef.dim, embeddings[<span class="hljs-number">0</span>].shape)
<button class="copy-code-btn"></button></code></pre>
<p>예상 출력은 다음과 같아야 합니다:</p>
<pre><code translate="no">Embeddings: [array([<span class="hljs-number">-3.09392996e-02</span>, <span class="hljs-number">-1.80662833e-02</span>,  <span class="hljs-number">1.34775648e-02</span>,  <span class="hljs-number">2.77156215e-02</span>,
      <span class="hljs-number">-4.86349640e-03</span>, <span class="hljs-number">-3.12581174e-02</span>, <span class="hljs-number">-3.55921760e-02</span>,  <span class="hljs-number">5.76934684e-03</span>,
       <span class="hljs-number">2.80773244e-03</span>,  <span class="hljs-number">1.35783911e-01</span>,  <span class="hljs-number">3.59678417e-02</span>,  <span class="hljs-number">6.17732145e-02</span>,
...
      <span class="hljs-number">-4.61330153e-02</span>, <span class="hljs-number">-4.85207550e-02</span>,  <span class="hljs-number">3.13997865e-02</span>,  <span class="hljs-number">7.82178566e-02</span>,
      <span class="hljs-number">-4.75336798e-02</span>,  <span class="hljs-number">5.21207601e-02</span>,  <span class="hljs-number">9.04406682e-02</span>, <span class="hljs-number">-5.36676683e-02</span>],
     dtype=<span class="hljs-type">float32</span>)]
Dim: <span class="hljs-number">384</span> (<span class="hljs-number">384</span>,)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Example-2-Generate-Sparse-Vectors-Using-The-BM25-Model" class="common-anchor-header">예제 2: BM25 모델을 사용하여 스파스 벡터 생성하기</h3><p>BM25는 단어 발생 빈도를 사용하여 쿼리와 문서 간의 관련성을 결정하는 잘 알려진 방법입니다. 이 예에서는 <code translate="no">BM25EmbeddingFunction</code> 을 사용하여 쿼리와 문서에 대한 스파스 임베딩을 생성하는 방법을 보여드리겠습니다.</p>
<p>BM25에서는 문서의 통계를 계산하여 문서의 패턴을 나타낼 수 있는 IDF(역문서 빈도)를 얻는 것이 중요합니다. IDF는 모든 문서에서 단어가 얼마나 많은 정보를 제공하는지, 즉 일반적이거나 희귀한지를 측정합니다.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus.model.sparse <span class="hljs-keyword">import</span> BM25EmbeddingFunction

<span class="hljs-comment"># 1. Prepare a small corpus to search</span>
docs = [
   <span class="hljs-string">&quot;Artificial intelligence was founded as an academic discipline in 1956.&quot;</span>,
   <span class="hljs-string">&quot;Alan Turing was the first person to conduct substantial research in AI.&quot;</span>,
   <span class="hljs-string">&quot;Born in Maida Vale, London, Turing was raised in southern England.&quot;</span>,
]
query = <span class="hljs-string">&quot;Where was Turing born?&quot;</span>
bm25_ef = BM25EmbeddingFunction()

<span class="hljs-comment"># 2. Fit the corpus to get BM25 model parameters on your documents.</span>
bm25_ef.fit(docs)

<span class="hljs-comment"># 3. Store the fitted parameters to expedite future processing.</span>
bm25_ef.save(<span class="hljs-string">&quot;bm25_params.json&quot;</span>)

<span class="hljs-comment"># 4. Load the saved params</span>
new_bm25_ef = BM25EmbeddingFunction()
new_bm25_ef.load(<span class="hljs-string">&quot;bm25_params.json&quot;</span>)

docs_embeddings = new_bm25_ef.encode_documents(docs)
query_embeddings = new_bm25_ef.encode_queries([query])
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Dim:&quot;</span>, new_bm25_ef.dim, <span class="hljs-built_in">list</span>(docs_embeddings)[<span class="hljs-number">0</span>].shape)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Example-3-Using-a-ReRanker" class="common-anchor-header">예 3: 리랭커 사용</h3><p>검색 시스템은 가장 관련성이 높은 결과를 빠르고 효율적으로 찾는 것을 목표로 합니다. 전통적으로 BM25 또는 TF-IDF와 같은 방법은 키워드 매칭을 기반으로 검색 결과의 순위를 매기는 데 사용되어 왔습니다. 임베딩 기반 코사인 유사도와 같은 최근의 방법은 간단하지만 언어의 미묘한 차이, 그리고 가장 중요한 문서와 쿼리의 의도 간의 상호 작용을 놓칠 수 있습니다.</p>
<p>이때 <a href="https://zilliz.com/learn/optimize-rag-with-rerankers-the-role-and-tradeoffs">리랭커를</a> 사용하면 도움이 됩니다. 리랭커는 임베딩/토큰 기반 검색에서 제공되는 검색의 초기 결과 집합을 가져와서 사용자의 의도에 더 가깝게 일치하도록 재평가하는 고급 AI 모델입니다. 표면적인 수준의 용어 매칭을 넘어 검색 쿼리와 문서 콘텐츠 간의 심층적인 상호 작용을 고려합니다.</p>
<p>이 예에서는 <a href="https://milvus.io/docs/integrate_with_jina.md">Jina AI 리랭커를</a> 사용하겠습니다.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus.model.reranker <span class="hljs-keyword">import</span> JinaRerankFunction

jina_api_key = <span class="hljs-string">&quot;&lt;YOUR_JINA_API_KEY&gt;&quot;</span>

rf = JinaRerankFunction(<span class="hljs-string">&quot;jina-reranker-v1-base-en&quot;</span>, jina_api_key)

query = <span class="hljs-string">&quot;What event in 1956 marked the official birth of artificial intelligence as a discipline?&quot;</span>

documents = [
   <span class="hljs-string">&quot;In 1950, Alan Turing published his seminal paper, &#x27;Computing Machinery and Intelligence,&#x27; proposing the Turing Test as a criterion of intelligence, a foundational concept in the philosophy and development of artificial intelligence.&quot;</span>,
   <span class="hljs-string">&quot;The Dartmouth Conference in 1956 is considered the birthplace of artificial intelligence as a field; here, John McCarthy and others coined the term &#x27;artificial intelligence&#x27; and laid out its basic goals.&quot;</span>,
   <span class="hljs-string">&quot;In 1951, British mathematician and computer scientist Alan Turing also developed the first program designed to play chess, demonstrating an early example of AI in game strategy.&quot;</span>,
   <span class="hljs-string">&quot;The invention of the Logic Theorist by Allen Newell, Herbert A. Simon, and Cliff Shaw in 1955 marked the creation of the first true AI program, which was capable of solving logic problems, akin to proving mathematical theorems.&quot;</span>
]

results = rf(query, documents)

<span class="hljs-keyword">for</span> result <span class="hljs-keyword">in</span> results:
   <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Index: <span class="hljs-subst">{result.index}</span>&quot;</span>)
   <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Score: <span class="hljs-subst">{result.score:<span class="hljs-number">.6</span>f}</span>&quot;</span>)
   <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Text: <span class="hljs-subst">{result.text}</span>\n&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>예상되는 결과는 다음과 비슷합니다:</p>
<pre><code translate="no">Index: <span class="hljs-number">1</span>
Score: <span class="hljs-number">0.937096</span>
Text: The Dartmouth Conference <span class="hljs-keyword">in</span> <span class="hljs-number">1956</span> <span class="hljs-keyword">is</span> considered the birthplace of artificial intelligence <span class="hljs-keyword">as</span> a field; here, John McCarthy <span class="hljs-keyword">and</span> others coined the term <span class="hljs-string">&#x27;artificial intelligence&#x27;</span> <span class="hljs-keyword">and</span> laid <span class="hljs-keyword">out</span> its basic goals.

Index: <span class="hljs-number">3</span>
Score: <span class="hljs-number">0.354210</span>
Text: The invention of the Logic Theorist <span class="hljs-keyword">by</span> Allen Newell, Herbert A. Simon, <span class="hljs-keyword">and</span> Cliff Shaw <span class="hljs-keyword">in</span> <span class="hljs-number">1955</span> marked the creation of the first <span class="hljs-literal">true</span> AI program, which was capable of solving logic problems, akin to proving mathematical theorems.

Index: <span class="hljs-number">0</span>
Score: <span class="hljs-number">0.349866</span>
Text: In <span class="hljs-number">1950</span>, Alan Turing published his seminal paper, <span class="hljs-string">&#x27;Computing Machinery and Intelligence,&#x27;</span> proposing the Turing Test <span class="hljs-keyword">as</span> a criterion of intelligence, a foundational concept <span class="hljs-keyword">in</span> the philosophy <span class="hljs-keyword">and</span> development of artificial intelligence.

Index: <span class="hljs-number">2</span>
Score: <span class="hljs-number">0.272896</span>
Text: In <span class="hljs-number">1951</span>, British mathematician <span class="hljs-keyword">and</span> computer scientist Alan Turing also developed the first program designed to play chess, demonstrating an early example of AI <span class="hljs-keyword">in</span> game strategy.
<button class="copy-code-btn"></button></code></pre>
<h2 id="Star-Us-On-GitHub-and-Join-Our-Discord" class="common-anchor-header">GitHub에서 별표를 누르고 Discord에 참여하세요!<button data-href="#Star-Us-On-GitHub-and-Join-Our-Discord" class="anchor-icon" translate="no">
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
    </button></h2><p>이 블로그 게시물이 마음에 드셨다면 <a href="https://github.com/milvus-io/milvus">GitHub에서</a> Milvus를 별표로 추천해 주시고, <a href="https://discord.gg/FG6hMJStWu">Discord에</a> 가입해 주세요! 💙</p>
