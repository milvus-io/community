---
id: introducing-pymilvus-integrations-with-embedding-models.md
title: Introduzione all'integrazione di PyMilvus con i modelli incorporati
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
<p><a href="https://milvus.io/intro">Milvus</a> è un database vettoriale open-source progettato specificamente per le applicazioni di IA. Se state lavorando all'apprendimento automatico, all'apprendimento profondo o a qualsiasi altro progetto legato all'IA, Milvus offre un modo robusto ed efficiente per gestire dati vettoriali su larga scala.</p>
<p>Ora, con l'<a href="https://milvus.io/docs/embeddings.md">integrazione del modulo modello</a> in PyMilvus, l'SDK Python per Milvus, è ancora più facile aggiungere modelli di Embedding e Reranking. Questa integrazione semplifica la trasformazione dei dati in vettori ricercabili o il reranking dei risultati per ottenere risultati più accurati, come nel caso della <a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">Retrieval Augmented Generation (RAG)</a>.</p>
<p>In questo blog esamineremo i modelli di embedding denso, i modelli di embedding sparse e i re-ranker e dimostreremo come utilizzarli nella pratica usando <a href="https://milvus.io/blog/introducing-milvus-lite.md">Milvus Lite</a>, una versione leggera di Milvus che può essere eseguita localmente nelle vostre applicazioni Python.</p>
<h2 id="Dense-vs-Sparse-Embeddings" class="common-anchor-header">Incorporazioni dense e sparse<button data-href="#Dense-vs-Sparse-Embeddings" class="anchor-icon" translate="no">
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
    </button></h2><p>Prima di illustrarvi come utilizzare le nostre integrazioni, analizziamo le due principali categorie di embedding vettoriali.</p>
<p>Le<a href="https://zilliz.com/glossary/vector-embeddings">incorporazioni vettoriali</a> rientrano generalmente in due categorie principali: <a href="https://zilliz.com/learn/sparse-and-dense-embeddings"><strong>Embeddings densi</strong> e <strong>Embeddings sparsi</strong></a>.</p>
<ul>
<li><p>Gli embeddings densi sono vettori ad alta densità in cui la maggior parte o tutti gli elementi sono non nulli, il che li rende ideali per codificare la semantica del testo o il significato sfumato.</p></li>
<li><p>Gli embeddings sparsi sono vettori ad alta densità con molti elementi nulli, più adatti a codificare concetti esatti o adiacenti.</p></li>
</ul>
<p>Milvus supporta entrambi i tipi di incorporazioni e offre una ricerca ibrida. <a href="https://zilliz.com/blog/hybrid-search-with-milvus">La ricerca ibrida</a> consente di effettuare ricerche su diversi campi vettoriali all'interno della stessa collezione. Questi vettori possono rappresentare diverse sfaccettature dei dati, utilizzare diversi modelli di embedding o impiegare diversi metodi di elaborazione dei dati, combinando i risultati con i ri-ranker.</p>
<h2 id="How-to-Use-Our-Embedding-and-Reranking-Integrations" class="common-anchor-header">Come utilizzare le nostre integrazioni di embedding e reranking<button data-href="#How-to-Use-Our-Embedding-and-Reranking-Integrations" class="anchor-icon" translate="no">
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
    </button></h2><p>Nelle sezioni seguenti verranno illustrati tre esempi pratici di utilizzo delle nostre integrazioni per generare embedding e condurre ricerche vettoriali.</p>
<h3 id="Example-1-Use-the-Default-Embedding-Function-to-Generate-Dense-Vectors" class="common-anchor-header">Esempio 1: Usare la funzione di embedding predefinita per generare vettori densi</h3><p>Per utilizzare le funzioni di embedding e reranking con Milvus, è necessario installare il client <code translate="no">pymilvus</code> con il pacchetto <code translate="no">model</code>.</p>
<pre><code translate="no">pip install <span class="hljs-string">&quot;pymilvus[model]&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>Questo passo installerà <a href="https://milvus.io/docs/quickstart.md">Milvus Lite</a>, che consente di eseguire Milvus localmente all'interno della propria applicazione Python. Include anche il sottopacchetto model, che comprende tutte le utilità per l'embedding e il reranking.</p>
<p>Il sottopacchetto del modello supporta diversi modelli di embedding, tra cui quelli di OpenAI, <a href="https://zilliz.com/learn/Sentence-Transformers-for-Long-Form-Text">Sentence Transformers</a>, <a href="https://zilliz.com/learn/bge-m3-and-splade-two-machine-learning-models-for-generating-sparse-embeddings">BGE-M3</a>, BM25, <a href="https://zilliz.com/learn/bge-m3-and-splade-two-machine-learning-models-for-generating-sparse-embeddings">SPLADE</a> e i modelli pre-addestrati di Jina AI.</p>
<p>Questo esempio utilizza il modello <code translate="no">DefaultEmbeddingFunction</code>, basato per semplicità sul modello <code translate="no">all-MiniLM-L6-v2</code> Sentence Transformer. Il modello ha una dimensione di circa 70 MB e verrà scaricato al primo utilizzo:</p>
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
<p>Il risultato atteso dovrebbe essere simile al seguente:</p>
<pre><code translate="no">Embeddings: [array([<span class="hljs-number">-3.09392996e-02</span>, <span class="hljs-number">-1.80662833e-02</span>,  <span class="hljs-number">1.34775648e-02</span>,  <span class="hljs-number">2.77156215e-02</span>,
      <span class="hljs-number">-4.86349640e-03</span>, <span class="hljs-number">-3.12581174e-02</span>, <span class="hljs-number">-3.55921760e-02</span>,  <span class="hljs-number">5.76934684e-03</span>,
       <span class="hljs-number">2.80773244e-03</span>,  <span class="hljs-number">1.35783911e-01</span>,  <span class="hljs-number">3.59678417e-02</span>,  <span class="hljs-number">6.17732145e-02</span>,
...
      <span class="hljs-number">-4.61330153e-02</span>, <span class="hljs-number">-4.85207550e-02</span>,  <span class="hljs-number">3.13997865e-02</span>,  <span class="hljs-number">7.82178566e-02</span>,
      <span class="hljs-number">-4.75336798e-02</span>,  <span class="hljs-number">5.21207601e-02</span>,  <span class="hljs-number">9.04406682e-02</span>, <span class="hljs-number">-5.36676683e-02</span>],
     dtype=<span class="hljs-type">float32</span>)]
Dim: <span class="hljs-number">384</span> (<span class="hljs-number">384</span>,)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Example-2-Generate-Sparse-Vectors-Using-The-BM25-Model" class="common-anchor-header">Esempio 2: Generare vettori sparsi usando il modello BM25</h3><p>BM25 è un metodo ben noto che utilizza le frequenze di occorrenza delle parole per determinare la rilevanza tra query e documenti. In questo esempio, mostreremo come utilizzare <code translate="no">BM25EmbeddingFunction</code> per generare embeddings sparsi per query e documenti.</p>
<p>In BM25 è importante calcolare le statistiche dei documenti per ottenere l'IDF (Inverse Document Frequency), che può rappresentare i modelli dei documenti. L'IDF misura la quantità di informazioni fornite da una parola, se è comune o rara in tutti i documenti.</p>
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
<h3 id="Example-3-Using-a-ReRanker" class="common-anchor-header">Esempio 3: Utilizzo di un ReRanker</h3><p>Un sistema di ricerca mira a trovare i risultati più rilevanti in modo rapido ed efficiente. Tradizionalmente, metodi come BM25 o TF-IDF sono stati utilizzati per classificare i risultati della ricerca in base alla corrispondenza delle parole chiave. I metodi più recenti, come la similarità del coseno basata sull'embedding, sono semplici, ma a volte non tengono conto delle sottigliezze del linguaggio e, soprattutto, dell'interazione tra i documenti e l'intento della query.</p>
<p>È qui che l'uso di un <a href="https://zilliz.com/learn/optimize-rag-with-rerankers-the-role-and-tradeoffs">riarrangiatore</a> è utile. Un re-ranker è un modello avanzato di intelligenza artificiale che prende l'insieme iniziale di risultati di una ricerca - spesso forniti da una ricerca basata su embeddings e token - e li rivaluta per garantire che si allineino meglio all'intento dell'utente. Il sistema guarda oltre la corrispondenza superficiale dei termini per considerare l'interazione più profonda tra la query di ricerca e il contenuto dei documenti.</p>
<p>Per questo esempio, utilizzeremo <a href="https://milvus.io/docs/integrate_with_jina.md">Jina AI Reranker</a>.</p>
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
<p>Il risultato atteso è simile al seguente:</p>
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
<h2 id="Star-Us-On-GitHub-and-Join-Our-Discord" class="common-anchor-header">Diventa un protagonista su GitHub e unisciti al nostro Discord!<button data-href="#Star-Us-On-GitHub-and-Join-Our-Discord" class="anchor-icon" translate="no">
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
    </button></h2><p>Se vi è piaciuto questo post, considerate l'idea di stellinare Milvus su <a href="https://github.com/milvus-io/milvus">GitHub</a> e sentitevi liberi di unirvi al nostro <a href="https://discord.gg/FG6hMJStWu">Discord</a>! 💙</p>
