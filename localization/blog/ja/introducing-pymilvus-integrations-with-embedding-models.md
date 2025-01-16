---
id: introducing-pymilvus-integrations-with-embedding-models.md
title: 埋め込みモデルとPyMilvusの統合の紹介
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
<p><a href="https://milvus.io/intro">Milvusは</a>、AIアプリケーションのために特別に設計されたオープンソースのベクトルデータベースです。機械学習、ディープラーニング、その他のAI関連プロジェクトのいずれであっても、Milvusは大規模なベクトルデータを扱うための堅牢で効率的な方法を提供します。</p>
<p>現在、MilvusのPython SDKであるPyMilvusの<a href="https://milvus.io/docs/embeddings.md">モデルモジュール統合により</a>、EmbeddingモデルとRerankingモデルの追加がさらに簡単になりました。この統合により、データを検索可能なベクトルに変換したり、<a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">RAG(Retrieval Augmented Generation)</a>のようなより正確な結果を得るために結果を再ランキングしたりすることが簡単になります。</p>
<p>このブログでは、密な埋め込みモデル、疎な埋め込みモデル、そして再ランカーについてレビューし、Pythonアプリケーションでローカルに実行できるMilvusの軽量版である<a href="https://milvus.io/blog/introducing-milvus-lite.md">Milvus Liteを</a>使用して、実際の使い方をデモンストレーションします。</p>
<h2 id="Dense-vs-Sparse-Embeddings" class="common-anchor-header">密な埋め込みと疎な埋め込み<button data-href="#Dense-vs-Sparse-Embeddings" class="anchor-icon" translate="no">
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
    </button></h2><p>統合機能の使い方を説明する前に、ベクトル埋込みの2つの主要なカテゴリを見てみましょう。</p>
<p><a href="https://zilliz.com/glossary/vector-embeddings">ベクトル埋め込みは</a>一般的に2つの主要なカテゴリに分類されます：<a href="https://zilliz.com/learn/sparse-and-dense-embeddings"><strong>密な埋め込み（Dense Embeddings</strong>）と<strong>疎な埋め込み（Sparse Embeddings）</strong></a>です。</p>
<ul>
<li><p>密な埋め込みは高次元のベクトルで、要素のほとんどまたはすべてがゼロでないため、テキストのセマンティクスやファジーな意味をエンコードするのに理想的です。</p></li>
<li><p>スパース埋め込みは、多くのゼロ要素を持つ高次元ベクトルであり、厳密な概念や隣接する概念の符号化に適しています。</p></li>
</ul>
<p>Milvusは両方のタイプの埋め込みをサポートし、ハイブリッド検索を提供します。<a href="https://zilliz.com/blog/hybrid-search-with-milvus">ハイブリッド検索では</a>、同じコレクション内の様々なベクトルフィールドを横断して検索を行うことができます。これらのベクトルは、データの異なる面を表したり、多様な埋め込みモデルを使用したり、異なるデータ処理方法を採用したりすることができ、再ランカーを使用して結果を組み合わせることができます。</p>
<h2 id="How-to-Use-Our-Embedding-and-Reranking-Integrations" class="common-anchor-header">埋め込みと再ランキング統合の使い方<button data-href="#How-to-Use-Our-Embedding-and-Reranking-Integrations" class="anchor-icon" translate="no">
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
    </button></h2><p>以下のセクションでは、埋め込みデータを生成し、ベクトル検索を行うために統合機能を使用する3つの実用的な例を示します。</p>
<h3 id="Example-1-Use-the-Default-Embedding-Function-to-Generate-Dense-Vectors" class="common-anchor-header">例1: デフォルトの埋め込み関数を使って高密度ベクトルを生成する</h3><p>Milvusで埋め込み関数とリランキング関数を使用するには、<code translate="no">model</code> パッケージと一緒に<code translate="no">pymilvus</code> クライアントをインストールする必要があります。</p>
<pre><code translate="no">pip install <span class="hljs-string">&quot;pymilvus[model]&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>このステップでは<a href="https://milvus.io/docs/quickstart.md">Milvus Liteを</a>インストールし、Pythonアプリケーション内でローカルにMilvusを実行できるようにします。また、Milvus Liteにはモデルサブパッケージが含まれており、エンベッディングとリランキングに関するすべてのユーティリティが含まれています。</p>
<p>モデルサブパッケージは、OpenAI、<a href="https://zilliz.com/learn/Sentence-Transformers-for-Long-Form-Text">Sentence Transformers</a>、<a href="https://zilliz.com/learn/bge-m3-and-splade-two-machine-learning-models-for-generating-sparse-embeddings">BGE-M3</a>、BM25、<a href="https://zilliz.com/learn/bge-m3-and-splade-two-machine-learning-models-for-generating-sparse-embeddings">SPLADE</a>、Jina AIプレトレーニングモデルを含む様々なエンベッディングモデルをサポートしています。</p>
<p>この例では、<code translate="no">DefaultEmbeddingFunction</code> 、<code translate="no">all-MiniLM-L6-v2</code> Sentence Transformer モデルに基づいて、簡単にするために使用しています。モデルは約70MBで、最初の使用時にダウンロードされる：</p>
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
<p>期待される出力は以下のようなものである：</p>
<pre><code translate="no">Embeddings: [array([<span class="hljs-number">-3.09392996e-02</span>, <span class="hljs-number">-1.80662833e-02</span>,  <span class="hljs-number">1.34775648e-02</span>,  <span class="hljs-number">2.77156215e-02</span>,
      <span class="hljs-number">-4.86349640e-03</span>, <span class="hljs-number">-3.12581174e-02</span>, <span class="hljs-number">-3.55921760e-02</span>,  <span class="hljs-number">5.76934684e-03</span>,
       <span class="hljs-number">2.80773244e-03</span>,  <span class="hljs-number">1.35783911e-01</span>,  <span class="hljs-number">3.59678417e-02</span>,  <span class="hljs-number">6.17732145e-02</span>,
...
      <span class="hljs-number">-4.61330153e-02</span>, <span class="hljs-number">-4.85207550e-02</span>,  <span class="hljs-number">3.13997865e-02</span>,  <span class="hljs-number">7.82178566e-02</span>,
      <span class="hljs-number">-4.75336798e-02</span>,  <span class="hljs-number">5.21207601e-02</span>,  <span class="hljs-number">9.04406682e-02</span>, <span class="hljs-number">-5.36676683e-02</span>],
     dtype=<span class="hljs-type">float32</span>)]
Dim: <span class="hljs-number">384</span> (<span class="hljs-number">384</span>,)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Example-2-Generate-Sparse-Vectors-Using-The-BM25-Model" class="common-anchor-header">例2：BM25モデルを使った疎ベクトルの生成</h3><p>BM25は、単語の出現頻度を用いてクエリと文書の関連性を決定するよく知られた手法です。この例では、<code translate="no">BM25EmbeddingFunction</code> を使って、クエリとドキュメントのスパース埋め込みを生成する方法を示します。</p>
<p>BM25では、文書のパターンを表すことができるIDF（逆文書出現頻度）を得るために、文書の統計量を計算することが重要です。IDFは、その単語が全文書で一般的か稀少か、どれだけの情報を提供するかを測定します。</p>
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
<h3 id="Example-3-Using-a-ReRanker" class="common-anchor-header">例3：ReRankerを使う</h3><p>検索システムは、最も関連性の高い結果を迅速かつ効率的に見つけることを目的としている。伝統的に、BM25やTF-IDFのような方法は、キーワードのマッチングに基づいて検索結果をランク付けするために使用されてきました。埋め込みベースのコサイン類似度のような最近の方法は簡単ですが、言語の微妙なニュアンスや、最も重要なことですが、文書とクエリの意図の相互作用を見逃すことがあります。</p>
<p>そこで役立つのが、<a href="https://zilliz.com/learn/optimize-rag-with-rerankers-the-role-and-tradeoffs">リランカー</a>である。リランカーは高度なAIモデルで、検索結果の初期セット（多くの場合、エンベッディング／トークン・ベースの検索で提供される）を受け取り、ユーザーの意図により近いものになるよう再評価する。表面的な用語のマッチングにとどまらず、検索クエリとドキュメントのコンテンツとのより深い相互作用を考慮する。</p>
<p>この例では、<a href="https://milvus.io/docs/integrate_with_jina.md">Jina AI Rerankerを</a>使用する。</p>
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
<p>期待される出力は以下のようなものだ：</p>
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
<h2 id="Star-Us-On-GitHub-and-Join-Our-Discord" class="common-anchor-header">GitHubにスターをつけ、Discordに参加しよう！<button data-href="#Star-Us-On-GitHub-and-Join-Our-Discord" class="anchor-icon" translate="no">
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
    </button></h2><p>このブログ記事が気に入ったら、Milvusを<a href="https://github.com/milvus-io/milvus">GitHubで</a>スター登録してください！💙</p>
