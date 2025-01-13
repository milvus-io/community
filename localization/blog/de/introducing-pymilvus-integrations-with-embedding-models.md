---
id: introducing-pymilvus-integrations-with-embedding-models.md
title: Einführung in die PyMilvus-Integration mit Einbettungsmodellen
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
<p><a href="https://milvus.io/intro">Milvus</a> ist eine Open-Source-Vektordatenbank, die speziell für KI-Anwendungen entwickelt wurde. Egal, ob Sie an maschinellem Lernen, Deep Learning oder einem anderen KI-bezogenen Projekt arbeiten, Milvus bietet eine robuste und effiziente Möglichkeit, große Vektordaten zu verarbeiten.</p>
<p>Mit der <a href="https://milvus.io/docs/embeddings.md">Modellmodul-Integration</a> in PyMilvus, dem Python-SDK für Milvus, ist es jetzt noch einfacher, Embedding- und Reranking-Modelle hinzuzufügen. Diese Integration vereinfacht die Umwandlung Ihrer Daten in durchsuchbare Vektoren oder das Reranking von Ergebnissen für genauere Ergebnisse, wie z. B. bei <a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">Retrieval Augmented Generation (RAG)</a>.</p>
<p>In diesem Blog geben wir einen Überblick über Dense Embedding-Modelle, Sparse Embedding-Modelle und Re-Ranker und zeigen, wie sie in der Praxis mit <a href="https://milvus.io/blog/introducing-milvus-lite.md">Milvus Lite</a>, einer leichtgewichtigen Version von Milvus, die lokal in Ihren Python-Anwendungen ausgeführt werden kann, verwendet werden können.</p>
<h2 id="Dense-vs-Sparse-Embeddings" class="common-anchor-header">Dense vs. Sparse Einbettungen<button data-href="#Dense-vs-Sparse-Embeddings" class="anchor-icon" translate="no">
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
    </button></h2><p>Bevor wir Ihnen zeigen, wie Sie unsere Integrationen nutzen können, wollen wir uns zwei Hauptkategorien von Vektoreinbettungen ansehen.</p>
<p><a href="https://zilliz.com/glossary/vector-embeddings">Vektoreinbettungen</a> fallen im Allgemeinen in zwei Hauptkategorien: <a href="https://zilliz.com/learn/sparse-and-dense-embeddings"><strong>Dichte Einbettungen (Dense Embeddings</strong> ) und <strong>dünne Einbettungen (Sparse Embeddings)</strong></a>.</p>
<ul>
<li><p>Dense Embeddings sind hochdimensionale Vektoren, bei denen die meisten oder alle Elemente ungleich Null sind, was sie ideal für die Codierung von Textsemantik oder unscharfer Bedeutung macht.</p></li>
<li><p>Sparse Embeddings sind hochdimensionale Vektoren mit vielen Nullelementen, die sich besser für die Kodierung exakter oder benachbarter Konzepte eignen.</p></li>
</ul>
<p>Milvus unterstützt beide Arten von Einbettungen und bietet eine hybride Suche. Die <a href="https://zilliz.com/blog/hybrid-search-with-milvus">hybride Suche</a> ermöglicht die Suche in verschiedenen Vektorfeldern innerhalb derselben Sammlung. Diese Vektoren können unterschiedliche Facetten von Daten repräsentieren, verschiedene Einbettungsmodelle verwenden oder unterschiedliche Datenverarbeitungsmethoden einsetzen und die Ergebnisse mit Hilfe von Re-Rankern kombinieren.</p>
<h2 id="How-to-Use-Our-Embedding-and-Reranking-Integrations" class="common-anchor-header">So verwenden Sie unsere Einbettungs- und Reranking-Integrationen<button data-href="#How-to-Use-Our-Embedding-and-Reranking-Integrations" class="anchor-icon" translate="no">
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
    </button></h2><p>In den folgenden Abschnitten werden wir drei praktische Beispiele für die Verwendung unserer Integrationen zur Erzeugung von Einbettungen und zur Durchführung von Vektorsuchen demonstrieren.</p>
<h3 id="Example-1-Use-the-Default-Embedding-Function-to-Generate-Dense-Vectors" class="common-anchor-header">Beispiel 1: Verwenden Sie die Standard-Einbettungsfunktion, um dichte Vektoren zu erzeugen</h3><p>Sie müssen den <code translate="no">pymilvus</code> Client mit dem <code translate="no">model</code> Paket installieren, um die Einbettungs- und Reranking-Funktionen mit Milvus zu verwenden.</p>
<pre><code translate="no">pip install <span class="hljs-string">&quot;pymilvus[model]&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>In diesem Schritt wird <a href="https://milvus.io/docs/quickstart.md">Milvus Lite</a> installiert, so dass Sie Milvus lokal innerhalb Ihrer Python-Anwendung ausführen können. Es enthält auch das Unterpaket model, das alle Dienstprogramme für Embedding und reranking enthält.</p>
<p>Das Modell-Subpaket unterstützt verschiedene Einbettungsmodelle, einschließlich der Modelle von OpenAI, <a href="https://zilliz.com/learn/Sentence-Transformers-for-Long-Form-Text">Sentence Transformers</a>, <a href="https://zilliz.com/learn/bge-m3-and-splade-two-machine-learning-models-for-generating-sparse-embeddings">BGE-M3</a>, BM25, <a href="https://zilliz.com/learn/bge-m3-and-splade-two-machine-learning-models-for-generating-sparse-embeddings">SPLADE</a> und Jina AI pre-trained models.</p>
<p>In diesem Beispiel wird das Modell <code translate="no">DefaultEmbeddingFunction</code> verwendet, das der Einfachheit halber auf dem Modell <code translate="no">all-MiniLM-L6-v2</code> Sentence Transformer basiert. Das Modell ist etwa 70 MB groß und wird bei der ersten Verwendung heruntergeladen:</p>
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
<p>Die erwartete Ausgabe sollte in etwa wie folgt aussehen:</p>
<pre><code translate="no">Embeddings: [array([<span class="hljs-number">-3.09392996e-02</span>, <span class="hljs-number">-1.80662833e-02</span>,  <span class="hljs-number">1.34775648e-02</span>,  <span class="hljs-number">2.77156215e-02</span>,
      <span class="hljs-number">-4.86349640e-03</span>, <span class="hljs-number">-3.12581174e-02</span>, <span class="hljs-number">-3.55921760e-02</span>,  <span class="hljs-number">5.76934684e-03</span>,
       <span class="hljs-number">2.80773244e-03</span>,  <span class="hljs-number">1.35783911e-01</span>,  <span class="hljs-number">3.59678417e-02</span>,  <span class="hljs-number">6.17732145e-02</span>,
...
      <span class="hljs-number">-4.61330153e-02</span>, <span class="hljs-number">-4.85207550e-02</span>,  <span class="hljs-number">3.13997865e-02</span>,  <span class="hljs-number">7.82178566e-02</span>,
      <span class="hljs-number">-4.75336798e-02</span>,  <span class="hljs-number">5.21207601e-02</span>,  <span class="hljs-number">9.04406682e-02</span>, <span class="hljs-number">-5.36676683e-02</span>],
     dtype=<span class="hljs-type">float32</span>)]
Dim: <span class="hljs-number">384</span> (<span class="hljs-number">384</span>,)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Example-2-Generate-Sparse-Vectors-Using-The-BM25-Model" class="common-anchor-header">Beispiel 2: Erzeugen von spärlichen Vektoren mit dem BM25-Modell</h3><p>BM25 ist eine bekannte Methode, die die Häufigkeit des Auftretens von Wörtern verwendet, um die Relevanz zwischen Suchanfragen und Dokumenten zu bestimmen. In diesem Beispiel wird gezeigt, wie <code translate="no">BM25EmbeddingFunction</code> verwendet wird, um Sparse Embeddings für Abfragen und Dokumente zu erzeugen.</p>
<p>In BM25 ist es wichtig, die Statistiken in Ihren Dokumenten zu berechnen, um die IDF (Inverse Document Frequency) zu erhalten, die die Muster in Ihren Dokumenten darstellen kann. Die IDF misst, wie viele Informationen ein Wort liefert, ob es in allen Dokumenten häufig oder selten vorkommt.</p>
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
<h3 id="Example-3-Using-a-ReRanker" class="common-anchor-header">Beispiel 3: Verwendung eines ReRankers</h3><p>Ein Suchsystem zielt darauf ab, die relevantesten Ergebnisse schnell und effizient zu finden. Traditionell wurden Methoden wie BM25 oder TF-IDF verwendet, um Suchergebnisse auf der Grundlage der Übereinstimmung von Schlüsselwörtern zu bewerten. Neuere Methoden wie die auf Einbettung basierende Kosinusähnlichkeit sind zwar einfach, lassen aber manchmal die Feinheiten der Sprache und vor allem die Interaktion zwischen den Dokumenten und der Absicht einer Anfrage außer Acht.</p>
<p>An dieser Stelle hilft der Einsatz eines <a href="https://zilliz.com/learn/optimize-rag-with-rerankers-the-role-and-tradeoffs">Re-Rankers</a>. Ein Re-Ranker ist ein fortschrittliches KI-Modell, das die ursprüngliche Ergebnismenge einer Suche - die häufig von einer auf Einbettungen/Token basierenden Suche bereitgestellt wird - neu bewertet, um sicherzustellen, dass sie besser mit der Absicht des Benutzers übereinstimmt. Dabei wird nicht nur die oberflächliche Übereinstimmung von Begriffen berücksichtigt, sondern auch die tiefere Interaktion zwischen der Suchanfrage und dem Inhalt der Dokumente.</p>
<p>Für dieses Beispiel verwenden wir den <a href="https://milvus.io/docs/integrate_with_jina.md">Jina AI Reranker</a>.</p>
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
<p>Die zu erwartende Ausgabe ist ähnlich der folgenden:</p>
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
<h2 id="Star-Us-On-GitHub-and-Join-Our-Discord" class="common-anchor-header">Bewerten Sie uns auf GitHub und treten Sie unserem Discord bei!<button data-href="#Star-Us-On-GitHub-and-Join-Our-Discord" class="anchor-icon" translate="no">
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
    </button></h2><p>Wenn Ihnen dieser Blogbeitrag gefallen hat, sollten Sie Milvus auf <a href="https://github.com/milvus-io/milvus">GitHub</a> mit einem Sternchen versehen und unserem <a href="https://discord.gg/FG6hMJStWu">Discord</a> beitreten! 💙</p>
