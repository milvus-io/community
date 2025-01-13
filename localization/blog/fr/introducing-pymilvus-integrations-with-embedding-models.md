---
id: introducing-pymilvus-integrations-with-embedding-models.md
title: Présentation de l'intégration de PyMilvus avec les modèles d'intégration
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
<p><a href="https://milvus.io/intro">Milvus</a> est une base de données vectorielles open-source conçue spécifiquement pour les applications d'IA. Que vous travailliez sur l'apprentissage automatique, l'apprentissage profond ou tout autre projet lié à l'IA, Milvus offre un moyen robuste et efficace de traiter des données vectorielles à grande échelle.</p>
<p>Désormais, grâce à l'<a href="https://milvus.io/docs/embeddings.md">intégration du module de modèle</a> dans PyMilvus, le SDK Python pour Milvus, il est encore plus facile d'ajouter des modèles d'Embedding et de Reranking. Cette intégration simplifie la transformation de vos données en vecteurs consultables ou le reclassement des résultats pour des résultats plus précis, comme dans <a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">Retrieval Augmented Generation (RAG)</a>.</p>
<p>Dans ce blog, nous passerons en revue les modèles d'intégration dense, les modèles d'intégration clairsemée et les modèles de reclassement et nous montrerons comment les utiliser en pratique à l'aide de <a href="https://milvus.io/blog/introducing-milvus-lite.md">Milvus Lite</a>, une version légère de Milvus qui peut être exécutée localement dans vos applications Python.</p>
<h2 id="Dense-vs-Sparse-Embeddings" class="common-anchor-header">Encastrements denses et épars<button data-href="#Dense-vs-Sparse-Embeddings" class="anchor-icon" translate="no">
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
    </button></h2><p>Avant de vous expliquer comment utiliser nos intégrations, examinons les deux principales catégories d'encastrements vectoriels.</p>
<p>Les<a href="https://zilliz.com/glossary/vector-embeddings">encastrements vectoriels</a> se répartissent généralement en deux catégories principales : Les <a href="https://zilliz.com/learn/sparse-and-dense-embeddings"><strong>encastrements denses</strong> et les <strong>encastrements épars</strong></a>.</p>
<ul>
<li><p>Les embeddings denses sont des vecteurs à haute dimension dans lesquels la plupart ou tous les éléments sont non nuls, ce qui les rend idéaux pour encoder la sémantique d'un texte ou une signification floue.</p></li>
<li><p>Les embeddings épars sont des vecteurs à haute dimension dont de nombreux éléments sont nuls, ce qui les rend plus adaptés à l'encodage de concepts exacts ou adjacents.</p></li>
</ul>
<p>Milvus prend en charge les deux types d'intégration et propose une recherche hybride. La <a href="https://zilliz.com/blog/hybrid-search-with-milvus">recherche hybride</a> vous permet d'effectuer des recherches dans différents champs vectoriels au sein d'une même collection. Ces vecteurs peuvent représenter différentes facettes des données, utiliser divers modèles d'intégration ou employer des méthodes de traitement des données distinctes, en combinant les résultats à l'aide de reclasseurs.</p>
<h2 id="How-to-Use-Our-Embedding-and-Reranking-Integrations" class="common-anchor-header">Comment utiliser nos intégrations d'intégration et de reclassement ?<button data-href="#How-to-Use-Our-Embedding-and-Reranking-Integrations" class="anchor-icon" translate="no">
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
    </button></h2><p>Dans les sections suivantes, nous présentons trois exemples pratiques d'utilisation de nos intégrations pour générer des embeddings et effectuer des recherches vectorielles.</p>
<h3 id="Example-1-Use-the-Default-Embedding-Function-to-Generate-Dense-Vectors" class="common-anchor-header">Exemple 1 : Utilisation de la fonction d'intégration par défaut pour générer des vecteurs denses</h3><p>Vous devez installer le client <code translate="no">pymilvus</code> avec le package <code translate="no">model</code> pour utiliser les fonctions d'intégration et de reranking avec Milvus.</p>
<pre><code translate="no">pip install <span class="hljs-string">&quot;pymilvus[model]&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>Cette étape installe <a href="https://milvus.io/docs/quickstart.md">Milvus Lite</a>, qui vous permet d'exécuter Milvus localement dans votre application Python. Elle inclut également le sous-paquet modèle, qui comprend tous les utilitaires pour l'incorporation et le reranking.</p>
<p>Le sous-paquetage de modèle prend en charge divers modèles d'intégration, y compris ceux d'OpenAI, <a href="https://zilliz.com/learn/Sentence-Transformers-for-Long-Form-Text">Sentence Transformers</a>, <a href="https://zilliz.com/learn/bge-m3-and-splade-two-machine-learning-models-for-generating-sparse-embeddings">BGE-M3</a>, BM25, <a href="https://zilliz.com/learn/bge-m3-and-splade-two-machine-learning-models-for-generating-sparse-embeddings">SPLADE</a> et les modèles pré-entraînés de Jina AI.</p>
<p>Cet exemple utilise le modèle <code translate="no">DefaultEmbeddingFunction</code>, basé sur le modèle <code translate="no">all-MiniLM-L6-v2</code> Sentence Transformer pour plus de simplicité. Le modèle pèse environ 70 Mo et sera téléchargé lors de la première utilisation :</p>
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
<p>Le résultat attendu devrait ressembler à ce qui suit :</p>
<pre><code translate="no">Embeddings: [array([<span class="hljs-number">-3.09392996e-02</span>, <span class="hljs-number">-1.80662833e-02</span>,  <span class="hljs-number">1.34775648e-02</span>,  <span class="hljs-number">2.77156215e-02</span>,
      <span class="hljs-number">-4.86349640e-03</span>, <span class="hljs-number">-3.12581174e-02</span>, <span class="hljs-number">-3.55921760e-02</span>,  <span class="hljs-number">5.76934684e-03</span>,
       <span class="hljs-number">2.80773244e-03</span>,  <span class="hljs-number">1.35783911e-01</span>,  <span class="hljs-number">3.59678417e-02</span>,  <span class="hljs-number">6.17732145e-02</span>,
...
      <span class="hljs-number">-4.61330153e-02</span>, <span class="hljs-number">-4.85207550e-02</span>,  <span class="hljs-number">3.13997865e-02</span>,  <span class="hljs-number">7.82178566e-02</span>,
      <span class="hljs-number">-4.75336798e-02</span>,  <span class="hljs-number">5.21207601e-02</span>,  <span class="hljs-number">9.04406682e-02</span>, <span class="hljs-number">-5.36676683e-02</span>],
     dtype=<span class="hljs-type">float32</span>)]
Dim: <span class="hljs-number">384</span> (<span class="hljs-number">384</span>,)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Example-2-Generate-Sparse-Vectors-Using-The-BM25-Model" class="common-anchor-header">Exemple 2 : Générer des vecteurs épars à l'aide du modèle BM25</h3><p>BM25 est une méthode bien connue qui utilise les fréquences d'occurrence des mots pour déterminer la pertinence entre les requêtes et les documents. Dans cet exemple, nous allons montrer comment utiliser <code translate="no">BM25EmbeddingFunction</code> pour générer des embeddings épars pour les requêtes et les documents.</p>
<p>Dans BM25, il est important de calculer les statistiques de vos documents pour obtenir l'IDF (Inverse Document Frequency), qui peut représenter les modèles dans vos documents. L'IDF mesure la quantité d'informations fournies par un mot, qu'il soit courant ou rare dans tous les documents.</p>
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
<h3 id="Example-3-Using-a-ReRanker" class="common-anchor-header">Exemple 3 : Utilisation d'un ReRanker</h3><p>Un système de recherche vise à trouver les résultats les plus pertinents rapidement et efficacement. Traditionnellement, des méthodes telles que BM25 ou TF-IDF ont été utilisées pour classer les résultats de recherche sur la base de la correspondance des mots-clés. Les méthodes récentes, telles que la similarité cosinus basée sur l'intégration, sont simples mais peuvent parfois manquer les subtilités de la langue et, surtout, l'interaction entre les documents et l'intention d'une requête.</p>
<p>C'est là que l'utilisation d'un <a href="https://zilliz.com/learn/optimize-rag-with-rerankers-the-role-and-tradeoffs">reclasseur</a> peut s'avérer utile. Un reclasseur est un modèle d'IA avancé qui prend l'ensemble initial de résultats d'une recherche - souvent fourni par une recherche basée sur les embeddings/tokens - et les réévalue pour s'assurer qu'ils correspondent mieux à l'intention de l'utilisateur. Il va au-delà de la correspondance superficielle des termes pour prendre en compte l'interaction plus profonde entre la requête de recherche et le contenu des documents.</p>
<p>Pour cet exemple, nous utiliserons le <a href="https://milvus.io/docs/integrate_with_jina.md">Jina AI Reranker</a>.</p>
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
<p>Le résultat attendu est similaire à ce qui suit :</p>
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
<h2 id="Star-Us-On-GitHub-and-Join-Our-Discord" class="common-anchor-header">Suivez-nous sur GitHub et rejoignez notre Discord !<button data-href="#Star-Us-On-GitHub-and-Join-Our-Discord" class="anchor-icon" translate="no">
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
    </button></h2><p>Si vous avez aimé cet article de blog, pensez à étoiler Milvus sur <a href="https://github.com/milvus-io/milvus">GitHub</a>, et n'hésitez pas à rejoindre notre <a href="https://discord.gg/FG6hMJStWu">Discord</a>! 💙</p>
