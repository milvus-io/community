---
id: introducing-pymilvus-integrations-with-embedding-models.md
title: 介紹 PyMilvus 與嵌入式模型的整合
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
<p><a href="https://milvus.io/intro">Milvus</a>是專為 AI 應用程式設計的開放原始碼向量資料庫。無論您是在進行機器學習、深度學習或任何其他 AI 相關專案，Milvus 都能提供強大且有效率的方式來處理大規模向量資料。</p>
<p>現在，透過 Milvus 的 Python SDK PyMilvus 中的<a href="https://milvus.io/docs/embeddings.md">模型模組整合</a>，新增 Embedding 和 Reranking 模型變得更加容易。此整合可簡化將您的資料轉換為可搜尋向量或重新排序結果，以獲得更精確的結果，例如在<a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">Retrieval Augmented Generation (RAG)</a> 中。</p>
<p>在這篇部落格中，我們將回顧密集嵌入模型、稀疏嵌入模型和重新排序器，並示範如何使用<a href="https://milvus.io/blog/introducing-milvus-lite.md">Milvus Lite</a>（Milvus 的輕量級版本，可在您的 Python 應用程式中本機執行）來實際使用它們。</p>
<h2 id="Dense-vs-Sparse-Embeddings" class="common-anchor-header">密集嵌入與稀疏嵌入<button data-href="#Dense-vs-Sparse-Embeddings" class="anchor-icon" translate="no">
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
    </button></h2><p>在介紹如何使用我們的整合之前，我們先來看看向量嵌入的兩大類別。</p>
<p><a href="https://zilliz.com/glossary/vector-embeddings">向量嵌入</a>通常分為兩大類：<a href="https://zilliz.com/learn/sparse-and-dense-embeddings"><strong>密集嵌入</strong></a>（<a href="https://zilliz.com/learn/sparse-and-dense-embeddings"><strong>Dense Embeddings</strong></a>）<a href="https://zilliz.com/learn/sparse-and-dense-embeddings">和<strong>稀疏嵌入（Sparse Embeddings</strong></a>）。</p>
<ul>
<li><p>Dense Embeddings 是高維向量，其中大多數或所有元素都非零，因此非常適合編碼文字語意或模糊意義。</p></li>
<li><p>稀疏嵌入（Sparse Embeddings）是具有許多零元素的高維向量，更適合編碼精確或相鄰的概念。</p></li>
</ul>
<p>Milvus 支援這兩種類型的嵌入，並提供混合搜尋功能。<a href="https://zilliz.com/blog/hybrid-search-with-milvus">混合搜尋</a>允許您在同一個資料集中的不同向量領域進行搜尋。這些向量可以代表資料的不同層面、使用不同的嵌入模型、或採用不同的資料處理方法，並使用重新排序器來結合結果。</p>
<h2 id="How-to-Use-Our-Embedding-and-Reranking-Integrations" class="common-anchor-header">如何使用我們的嵌入與重新排名整合功能<button data-href="#How-to-Use-Our-Embedding-and-Reranking-Integrations" class="anchor-icon" translate="no">
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
    </button></h2><p>在以下各節中，我們將示範使用我們的整合來產生嵌入和進行向量搜尋的三個實例。</p>
<h3 id="Example-1-Use-the-Default-Embedding-Function-to-Generate-Dense-Vectors" class="common-anchor-header">範例 1：使用預設的嵌入功能產生密集向量</h3><p>您必須安裝<code translate="no">model</code> 套件的<code translate="no">pymilvus</code> 客戶端，才能使用 Milvus 的 embedding 和 reranking 功能。</p>
<pre><code translate="no">pip install <span class="hljs-string">&quot;pymilvus[model]&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>這個步驟將安裝<a href="https://milvus.io/docs/quickstart.md">Milvus Lite</a>，讓您可以在 Python 應用程式中本機執行 Milvus。它也包含模型子套件，其中包括 Embedding 和 reranking 的所有公用程式。</p>
<p>模型子套件支援各種嵌入模型，包括 OpenAI、<a href="https://zilliz.com/learn/Sentence-Transformers-for-Long-Form-Text">Sentence Transformers</a>、<a href="https://zilliz.com/learn/bge-m3-and-splade-two-machine-learning-models-for-generating-sparse-embeddings">BGE-M3</a>、BM25、<a href="https://zilliz.com/learn/bge-m3-and-splade-two-machine-learning-models-for-generating-sparse-embeddings">SPLADE</a> 和 Jina AI 預先訓練的模型。</p>
<p>本範例使用<code translate="no">DefaultEmbeddingFunction</code> ，基於<code translate="no">all-MiniLM-L6-v2</code> Sentence Transformer 模型，以簡化操作。模型約 70MB，會在第一次使用時下載：</p>
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
<p>預期的輸出應該如下所示：</p>
<pre><code translate="no">Embeddings: [array([<span class="hljs-number">-3.09392996e-02</span>, <span class="hljs-number">-1.80662833e-02</span>,  <span class="hljs-number">1.34775648e-02</span>,  <span class="hljs-number">2.77156215e-02</span>,
      <span class="hljs-number">-4.86349640e-03</span>, <span class="hljs-number">-3.12581174e-02</span>, <span class="hljs-number">-3.55921760e-02</span>,  <span class="hljs-number">5.76934684e-03</span>,
       <span class="hljs-number">2.80773244e-03</span>,  <span class="hljs-number">1.35783911e-01</span>,  <span class="hljs-number">3.59678417e-02</span>,  <span class="hljs-number">6.17732145e-02</span>,
...
      <span class="hljs-number">-4.61330153e-02</span>, <span class="hljs-number">-4.85207550e-02</span>,  <span class="hljs-number">3.13997865e-02</span>,  <span class="hljs-number">7.82178566e-02</span>,
      <span class="hljs-number">-4.75336798e-02</span>,  <span class="hljs-number">5.21207601e-02</span>,  <span class="hljs-number">9.04406682e-02</span>, <span class="hljs-number">-5.36676683e-02</span>],
     dtype=<span class="hljs-type">float32</span>)]
Dim: <span class="hljs-number">384</span> (<span class="hljs-number">384</span>,)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Example-2-Generate-Sparse-Vectors-Using-The-BM25-Model" class="common-anchor-header">範例 2：使用 BM25 模型產生稀疏向量</h3><p>BM25 是一種著名的方法，它使用單字出現頻率來判斷查詢與文件之間的相關性。在這個範例中，我們將展示如何使用<code translate="no">BM25EmbeddingFunction</code> 來產生查詢和文件的稀疏嵌入。</p>
<p>在 BM25 中，計算文件中的統計資料以獲得 IDF（反向文件頻率）是非常重要的，它可以代表文件中的模式。IDF 衡量一個單字提供了多少資訊，它在所有文件中是常見還是罕見。</p>
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
<h3 id="Example-3-Using-a-ReRanker" class="common-anchor-header">範例 3：使用 ReRanker</h3><p>搜尋系統的目的是快速有效地找到最相關的結果。傳統上，像 BM25 或 TF-IDF 之類的方法都是用來根據關鍵字的匹配程度來為搜尋結果排序。最近的方法，例如以嵌入為基礎的余弦相似度，雖然簡單直接，但有時會忽略語言的微妙之處，最重要的是，忽略文件與查詢意圖之間的互動關係。</p>
<p>這就是使用<a href="https://zilliz.com/learn/optimize-rag-with-rerankers-the-role-and-tradeoffs">重新排序器</a>的幫助所在。重新排序器是一種先進的人工智慧模型，它可以從搜尋中取得初始結果集 (通常由嵌入式/代號式搜尋提供)，並重新評估這些結果，以確保它們更符合使用者的意圖。它不僅會考慮表面層級的詞彙匹配，還會考慮搜尋查詢與文件內容之間更深層次的互動。</p>
<p>在這個範例中，我們會使用<a href="https://milvus.io/docs/integrate_with_jina.md">Jina AI Reranker</a>。</p>
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
<p>預期的輸出結果類似如下：</p>
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
<h2 id="Star-Us-On-GitHub-and-Join-Our-Discord" class="common-anchor-header">Star Us On GitHub 並加入我們的 Discord！<button data-href="#Star-Us-On-GitHub-and-Join-Our-Discord" class="anchor-icon" translate="no">
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
    </button></h2><p>如果您喜歡這篇博文，請考慮在<a href="https://github.com/milvus-io/milvus">GitHub</a> 星級 Milvus，並隨時加入我們的<a href="https://discord.gg/FG6hMJStWu">Discord</a>！💙</p>
