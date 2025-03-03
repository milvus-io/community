---
id: how-to-get-started-with-milvus.md
title: Come iniziare con Milvus
author: Ruben Winastwan
date: 2025-01-17T00:00:00.000Z
cover: >-
  assets.zilliz.com/How_To_Get_Started_With_Milvus_20230517_084248_28560b1efc.png
tag: Engineering
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Vector Management
recommend: false
canonicalUrl: 'https://milvus.io/blog/how-to-get-started-with-milvus.md'
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/How_To_Get_Started_With_Milvus_20230517_084248_28560b1efc.png" alt="How to get started with Milvus" class="doc-image" id="how-to-get-started-with-milvus" />
   </span> <span class="img-wrapper"> <span>Come iniziare con Milvus</span> </span></p>
<p><strong><em>Ultimo aggiornamento gennaio 2025</em></strong></p>
<p>I progressi dei Large Language Models<a href="https://zilliz.com/glossary/large-language-models-(llms)">(LLM</a>) e il crescente volume di dati richiedono un'infrastruttura flessibile e scalabile per archiviare enormi quantità di informazioni, come un database. Tuttavia, i <a href="https://zilliz.com/blog/relational-databases-vs-vector-databases">database tradizionali</a> sono progettati per memorizzare dati tabellari e strutturati, mentre le informazioni comunemente utili per sfruttare la potenza dei sofisticati LLM e degli algoritmi di recupero delle informazioni sono <a href="https://zilliz.com/learn/introduction-to-unstructured-data">non strutturate</a>, come testo, immagini, video o audio.</p>
<p>I<a href="https://zilliz.com/learn/what-is-vector-database">database vettoriali</a> sono sistemi di database progettati specificamente per i dati non strutturati. Con i database vettoriali è possibile non solo memorizzare enormi quantità di dati non strutturati, ma anche eseguire <a href="https://zilliz.com/learn/vector-similarity-search">ricerche vettoriali</a>. I database vettoriali dispongono di metodi di indicizzazione avanzati come l'Inverted File Index (IVFFlat) o l'Hierarchical Navigable Small World<a href="https://zilliz.com/learn/hierarchical-navigable-small-worlds-HNSW">(HNSW</a>) per eseguire processi di ricerca vettoriale e di recupero delle informazioni rapidi ed efficienti.</p>
<p><strong>Milvus</strong> è un database vettoriale open-source che possiamo utilizzare per sfruttare tutte le caratteristiche vantaggiose che un database vettoriale può offrire. Ecco cosa tratteremo in questo post:</p>
<ul>
<li><p><a href="https://milvus.io/blog/how-to-get-started-with-milvus.md#What-is-Milvus">Panoramica di Milvus</a></p></li>
<li><p><a href="https://milvus.io/blog/how-to-get-started-with-milvus.md#Milvus-Deployment-Options">Opzioni di distribuzione di Milvus</a></p></li>
<li><p><a href="https://milvus.io/blog/how-to-get-started-with-milvus.md#Getting-Started-with-Milvus-Lite">Come iniziare con Milvus Lite</a></p></li>
<li><p><a href="https://milvus.io/blog/how-to-get-started-with-milvus.md#Getting-Started-with-Milvus-Standalone">Iniziare con Milvus Standalone</a></p></li>
<li><p><a href="https://milvus.io/blog/how-to-get-started-with-milvus.md#Fully-Managed-Milvus">Milvus completamente gestito </a></p></li>
</ul>
<h2 id="What-is-Milvus" class="common-anchor-header">Che cos'è Milvus?<button data-href="#What-is-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://milvus.io/docs/overview.md"><strong>Milvus</strong> è </a>un database vettoriale open-source che ci permette di memorizzare enormi quantità di dati non strutturati e di eseguire ricerche vettoriali rapide ed efficienti su di essi. Milvus è molto utile per molte applicazioni GenAI popolari, come i sistemi di raccomandazione, i chatbot personalizzati, il rilevamento di anomalie, la ricerca di immagini, l'elaborazione del linguaggio naturale e la retrieval augmented generation<a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">(RAG</a>).</p>
<p>I vantaggi che si possono ottenere utilizzando Milvus come database vettoriale sono molteplici:</p>
<ul>
<li><p>Milvus offre diverse opzioni di implementazione che si possono scegliere a seconda del caso d'uso e delle dimensioni delle applicazioni che si vogliono realizzare.</p></li>
<li><p>Milvus supporta una vasta gamma di metodi di indicizzazione per soddisfare le varie esigenze di dati e prestazioni, tra cui opzioni in-memory come FLAT, IVFFlat, HNSW e <a href="https://zilliz.com/learn/what-is-scann-scalable-nearest-neighbors-google">SCANN</a>, varianti quantizzate per l'efficienza della memoria, <a href="https://zilliz.com/learn/DiskANN-and-the-Vamana-Algorithm">DiskANN</a> su disco per grandi insiemi di dati e indici ottimizzati per le GPU come GPU_CAGRA, GPU_IVF_FLAT e GPU_IVF_PQ per ricerche accelerate ed efficienti in termini di memoria.</p></li>
<li><p>Milvus offre anche una ricerca ibrida, in cui è possibile utilizzare una combinazione di embedding densi, embedding sparsi e filtraggio dei metadati durante le operazioni di ricerca vettoriale, ottenendo risultati di recupero più accurati. Inoltre, <a href="https://milvus.io/blog/introduce-milvus-2-5-full-text-search-powerful-metadata-filtering-and-more.md">Milvus 2.5</a> supporta ora una <a href="https://milvus.io/blog/get-started-with-hybrid-semantic-full-text-search-with-milvus-2-5.md">ricerca</a> ibrida <a href="https://milvus.io/blog/get-started-with-hybrid-semantic-full-text-search-with-milvus-2-5.md">full-text</a> e una ricerca vettoriale, rendendo il reperimento ancora più accurato.</p></li>
<li><p>Milvus può essere utilizzato completamente nel cloud tramite <a href="https://zilliz.com/cloud">Zilliz Cloud</a>, dove è possibile ottimizzare i costi operativi e la velocità di ricerca vettoriale grazie a quattro funzionalità avanzate: cluster logici, disaggregazione dei dati storici e in streaming, storage a livelli, autoscaling e separazione hot-cold multi-tenancy.</p></li>
</ul>
<p>Quando si usa Milvus come database vettoriale, si possono scegliere tre diverse opzioni di implementazione, ognuna con i suoi punti di forza e vantaggi. Nella prossima sezione parleremo di ciascuna di esse.</p>
<h2 id="Milvus-Deployment-Options" class="common-anchor-header">Opzioni di distribuzione di Milvus<button data-href="#Milvus-Deployment-Options" class="anchor-icon" translate="no">
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
    </button></h2><p>Per iniziare a usare Milvus si può scegliere tra quattro opzioni di distribuzione: <strong>Milvus Lite, Milvus Standalone, Milvus Distributed e Zilliz Cloud (Milvus gestito).</strong> Ciascuna opzione di distribuzione è progettata per adattarsi ai vari scenari del nostro caso d'uso, come le dimensioni dei nostri dati, lo scopo della nostra applicazione e la scala della nostra applicazione.</p>
<h3 id="Milvus-Lite" class="common-anchor-header">Milvus Lite</h3><p><a href="https://milvus.io/docs/quickstart.md"><strong>Milvus Lite</strong></a> è una versione leggera di Milvus e rappresenta il modo più semplice per iniziare. Nella prossima sezione vedremo come eseguire Milvus Lite in azione e tutto ciò che dobbiamo fare per iniziare è installare la libreria Pymilvus con pip. Dopodiché, potremo eseguire la maggior parte delle funzionalità principali di Milvus come database vettoriale.</p>
<p>Milvus Lite è perfetto per la prototipazione rapida o per scopi di apprendimento e può essere eseguito in un notebook Jupyter senza alcuna configurazione complicata. In termini di archiviazione vettoriale, Milvus Lite è adatto a memorizzare fino a un milione di embeddings vettoriali. Grazie alla sua leggerezza e alla capacità di memorizzazione, Milvus Lite è un'opzione di distribuzione perfetta per lavorare con i dispositivi edge, come il motore di ricerca di documenti privati, il rilevamento di oggetti sul dispositivo, ecc.</p>
<h3 id="Milvus-Standalone" class="common-anchor-header">Milvus Standalone</h3><p>Milvus Standalone è una distribuzione di server a macchina singola contenuta in un'immagine Docker. Pertanto, per iniziare è sufficiente installare Milvus in Docker e avviare il contenitore Docker. Nella prossima sezione vedremo anche l'implementazione dettagliata di Milvus Standalone.</p>
<p>Milvus Standalone è ideale per la creazione e la produzione di applicazioni su piccola e media scala, in quanto è in grado di memorizzare fino a 10 milioni di embeddings vettoriali. Inoltre, Milvus Standalone offre un'elevata disponibilità attraverso una modalità di backup primario, che lo rende altamente affidabile per l'uso in applicazioni pronte per la produzione.</p>
<p>È possibile utilizzare Milvus Standalone, ad esempio, dopo aver eseguito una rapida prototipazione e aver appreso le funzionalità di Milvus con Milvus Lite, poiché sia Milvus Standalone che Milvus Lite condividono la stessa API lato client.</p>
<h3 id="Milvus-Distributed" class="common-anchor-header">Milvus distribuito</h3><p>Milvus Distributed è un'opzione di distribuzione che sfrutta un'architettura basata sul cloud, dove l'ingestione e il recupero dei dati sono gestiti separatamente, consentendo un'applicazione altamente scalabile ed efficiente.</p>
<p>Per eseguire Milvus Distributed, in genere è necessario utilizzare un cluster Kubernetes per consentire l'esecuzione del contenitore su più macchine e ambienti. L'applicazione di un cluster Kubernetes garantisce la scalabilità e la flessibilità di Milvus Distributed nel personalizzare le risorse allocate a seconda della domanda e del carico di lavoro. Ciò significa anche che se una parte si guasta, le altre possono subentrare, assicurando che l'intero sistema rimanga ininterrotto.</p>
<p>Milvus Distributed è in grado di gestire fino a decine di miliardi di embeddings vettoriali ed è stato progettato appositamente per i casi d'uso in cui i dati sono troppo grandi per essere archiviati in un'unica macchina server. Pertanto, questa opzione di distribuzione è perfetta per i clienti aziendali che servono un'ampia base di utenti.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_Vector_embedding_storage_capability_of_different_Milvus_deployment_options_e3959ccfcd.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figura: Capacità di memorizzazione dell'incorporazione vettoriale delle diverse opzioni di distribuzione di Milvus.</em></p>
<p>In questo articolo vi mostreremo come iniziare a lavorare sia con Milvus Lite che con Milvus Standalone, in quanto è possibile iniziare rapidamente con entrambi i metodi senza complicate configurazioni. Milvus Distributed, invece, è più complicato da configurare. Una volta configurato Milvus Distributed, il codice e il processo logico per creare collezioni, ingerire dati, eseguire ricerche vettoriali, ecc. sono simili a quelli di Milvus Lite e Milvus Standalone, poiché condividono la stessa API lato client.</p>
<p>Oltre alle tre opzioni di distribuzione sopra menzionate, è possibile provare Milvus gestito su <a href="https://zilliz.com/cloud">Zilliz Cloud</a> per un'esperienza senza problemi. Parleremo di Zilliz Cloud più avanti in questo articolo.</p>
<h2 id="Getting-Started-with-Milvus-Lite" class="common-anchor-header">Come iniziare con Milvus Lite<button data-href="#Getting-Started-with-Milvus-Lite" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus Lite può essere implementato subito con Python importando una libreria chiamata Pymilvus con pip. Prima di installare Pymilvus, assicuratevi che il vostro ambiente soddisfi i seguenti requisiti:</p>
<ul>
<li><p>Ubuntu &gt;= 20.04 (x86_64 e arm64)</p></li>
<li><p>MacOS &gt;= 11.0 (Apple Silicon M1/M2 e x86_64)</p></li>
<li><p>Python 3.7 o successivo</p></li>
</ul>
<p>Una volta soddisfatti questi requisiti, è possibile installare Milvus Lite e le dipendenze necessarie per la dimostrazione utilizzando il seguente comando:</p>
<pre><code translate="no">!pip install -U pymilvus
!pip install <span class="hljs-string">&quot;pymilvus[model]&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><p><code translate="no">!pip install -U pymilvus</code>: Questo comando installa o aggiorna la libreria <code translate="no">pymilvus</code>, l'SDK Python di Milvus. Milvus Lite viene fornito con PyMilvus, quindi questa singola riga di codice è tutto ciò che serve per installare Milvus Lite.</p></li>
<li><p><code translate="no">!pip install &quot;pymilvus[model]&quot;</code>: Questo comando aggiunge funzionalità avanzate e strumenti extra pre-integrati con Milvus, tra cui modelli di apprendimento automatico come Hugging Face Transformers, modelli di incorporazione Jina AI e modelli di reranking.</p></li>
</ul>
<p>Ecco i passi da seguire con Milvus Lite:</p>
<ol>
<li><p>Trasformare i dati di testo nella loro rappresentazione di embedding utilizzando un modello di embedding.</p></li>
<li><p>Creare uno schema nel nostro database Milvus per memorizzare i dati di testo e le loro rappresentazioni di embedding.</p></li>
<li><p>Memorizzare e indicizzare i dati nello schema.</p></li>
<li><p>Eseguire una semplice ricerca vettoriale sui dati memorizzati.</p></li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_Workflow_of_vector_search_operation_3e38ccc1f4.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figura: Flusso di lavoro dell'operazione di ricerca vettoriale.</em></p>
<p>Per trasformare i dati di testo in incorporazioni vettoriali, utilizzeremo un <a href="https://zilliz.com/ai-models">modello di incorporamento</a> di SentenceTransformers chiamato "all-MiniLM-L6-v2". Questo modello di embedding trasforma il nostro testo in un embedding vettoriale a 384 dimensioni. Carichiamo il modello, trasformiamo i dati del testo e mettiamo tutto insieme.</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> model

docs = [
    <span class="hljs-string">&quot;Artificial intelligence was founded as an academic discipline in 1956.&quot;</span>,
    <span class="hljs-string">&quot;Alan Turing was the first person to conduct substantial research in AI.&quot;</span>,
    <span class="hljs-string">&quot;Born in Maida Vale, London, Turing was raised in southern England.&quot;</span>,
]

sentence_transformer_ef = model.dense.SentenceTransformerEmbeddingFunction(
    model_name=<span class="hljs-string">&#x27;all-MiniLM-L6-v2&#x27;</span>, 
    device=<span class="hljs-string">&#x27;cpu&#x27;</span> 
)

vectors  = sentence_transformer_ef.encode_documents(docs)
data = [ {<span class="hljs-string">&quot;id&quot;</span>: i, <span class="hljs-string">&quot;vector&quot;</span>: vectors[i], <span class="hljs-string">&quot;text&quot;</span>: docs[i]} <span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-built_in">len</span>(vectors)) ]
<button class="copy-code-btn"></button></code></pre>
<p>Quindi, creiamo uno schema per memorizzare tutti i dati di cui sopra in Milvus. Come si può vedere qui sopra, i nostri dati sono costituiti da tre campi: ID, vettore e testo. Pertanto, creeremo uno schema con questi tre campi.</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient, DataType

schema = MilvusClient.create_schema(
    auto_id=<span class="hljs-literal">False</span>,
    enable_dynamic_field=<span class="hljs-literal">True</span>,
)

<span class="hljs-comment"># Add fields to schema</span>
schema.add_field(field_name=<span class="hljs-string">&quot;id&quot;</span>, datatype=DataType.INT64, is_primary=<span class="hljs-literal">True</span>)
schema.add_field(field_name=<span class="hljs-string">&quot;vector&quot;</span>, datatype=DataType.FLOAT_VECTOR, dim=<span class="hljs-number">384</span>)
schema.add_field(field_name=<span class="hljs-string">&quot;text&quot;</span>, datatype=DataType.VARCHAR, max_length=<span class="hljs-number">512</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Con Milvus Lite, possiamo creare facilmente una collezione su un determinato database in base allo schema definito sopra, nonché inserire e indicizzare i dati nella collezione in poche righe di codice.</p>
<pre><code translate="no" class="language-python">client = MilvusClient(<span class="hljs-string">&quot;./milvus_demo.db&quot;</span>)

index_params = client.prepare_index_params()

<span class="hljs-comment">#  Add indexes</span>
index_params.add_index(
    field_name=<span class="hljs-string">&quot;vector&quot;</span>, 
    index_type=<span class="hljs-string">&quot;AUTOINDEX&quot;</span>,
    metric_type=<span class="hljs-string">&quot;COSINE&quot;</span>
)

<span class="hljs-comment"># Create collection</span>
client.create_collection(
    collection_name=<span class="hljs-string">&quot;demo_collection&quot;</span>,
    schema=schema,
    index_params=index_params
)

<span class="hljs-comment"># Insert data into collection</span>
res = client.insert(
    collection_name=<span class="hljs-string">&quot;demo_collection&quot;</span>,
    data=data
)
<button class="copy-code-btn"></button></code></pre>
<p>Nel codice qui sopra, creiamo una raccolta chiamata &quot;demo_collection&quot; all'interno di un database Milvus chiamato &quot;milvus_demo&quot;. Quindi, indicizziamo tutti i nostri dati nella "demo_collection" appena creata.</p>
<p>Ora che abbiamo i nostri dati nel database, possiamo eseguire una ricerca vettoriale su di essi per qualsiasi query. Supponiamo di avere una domanda: &quot;<em>Chi è Alan Turing?</em>&quot;. Possiamo ottenere la risposta più appropriata alla domanda eseguendo i seguenti passaggi:</p>
<ol>
<li><p>Trasformare la nostra query in un embedding vettoriale utilizzando lo stesso modello di embedding che abbiamo usato per trasformare i nostri dati nel database in embeddings.</p></li>
<li><p>Calcolare la somiglianza tra l'embedding della nostra query e l'embedding di ogni voce del database utilizzando metriche come la somiglianza coseno o la distanza euclidea.</p></li>
<li><p>Recuperare la voce più simile come risposta appropriata alla nostra query.</p></li>
</ol>
<p>Di seguito è riportata l'implementazione dei passaggi sopra descritti con Milvus:</p>
<pre><code translate="no" class="language-python">query = [<span class="hljs-string">&quot;Who is Alan Turing&quot;</span>]
query_embedding = sentence_transformer_ef.encode_queries(query)

<span class="hljs-comment"># Load collection</span>
client.load_collection(
    collection_name=<span class="hljs-string">&quot;demo_collection&quot;</span>
)

<span class="hljs-comment"># Vector search</span>
res = client.search(
    collection_name=<span class="hljs-string">&quot;demo_collection&quot;</span>,
    data=query_embedding,
    limit=<span class="hljs-number">1</span>,
    output_fields=[<span class="hljs-string">&quot;text&quot;</span>],
)
<span class="hljs-built_in">print</span>(res)
<span class="hljs-string">&quot;&quot;&quot;
Output:
data: [&quot;[{&#x27;id&#x27;: 1, &#x27;distance&#x27;: 0.7199002504348755, &#x27;entity&#x27;: {&#x27;text&#x27;: &#x27;Alan Turing was the first person to conduct substantial research in AI.&#x27;}}]&quot;] 
&quot;&quot;&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>E questo è tutto! Per saperne di più su altre funzionalità offerte da Milvus, come la gestione dei database, l'inserimento e l'eliminazione di collezioni, la scelta del giusto metodo di indicizzazione e l'esecuzione di ricerche vettoriali più avanzate con il filtraggio dei metadati e la ricerca ibrida, consultare la <a href="https://milvus.io/docs/">documentazione di Milvus</a>.</p>
<h2 id="Getting-Started-with-Milvus-Standalone" class="common-anchor-header">Come iniziare con Milvus Standalone<button data-href="#Getting-Started-with-Milvus-Standalone" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus Standalone è un'opzione di distribuzione in cui tutto è racchiuso in un contenitore Docker. Pertanto, è necessario installare Milvus in Docker e poi avviare il contenitore Docker per iniziare con Milvus Standalone.</p>
<p>Prima di installare Milvus Standalone, assicuratevi che l'hardware e il software soddisfino i requisiti descritti in <a href="https://milvus.io/docs/prerequisite-docker.md">questa pagina</a>. Inoltre, assicuratevi di aver installato Docker. Per installare Docker, consultare <a href="https://docs.docker.com/get-started/get-docker/">questa pagina</a>.</p>
<p>Una volta che il nostro sistema soddisfa i requisiti e abbiamo installato Docker, possiamo procedere con l'installazione di Milvus in Docker usando il seguente comando:</p>
<pre><code translate="no" class="language-shell"><span class="hljs-comment"># Download the installation script</span>
$ curl -sfL &lt;https://raw.githubusercontent.com/milvus-io/milvus/master/scripts/standalone_embed.sh&gt; -o standalone_embed.sh

<span class="hljs-comment"># Start the Docker container</span>
$ bash standalone_embed.sh start
<button class="copy-code-btn"></button></code></pre>
<p>Nel codice sopra riportato, avviamo anche il contenitore Docker e, una volta avviato, otterremo un output simile a quello riportato di seguito:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_Message_after_successful_starting_of_the_Docker_container_5c60fa15dd.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figura: Messaggio dopo l'avvio del contenitore Docker.</em></p>
<p>Dopo aver eseguito lo script di installazione "standalone_embed.sh" di cui sopra, viene avviato un contenitore Docker chiamato "milvus" sulla porta 19530. Pertanto, possiamo creare un nuovo database e accedere a tutto ciò che riguarda il database Milvus puntando a questa porta quando si avvia il client.</p>
<p>Supponiamo di voler creare un database chiamato "milvus_demo", simile a quello che abbiamo fatto in Milvus Lite. Possiamo farlo come segue:</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> <span class="hljs-title class_">MilvusClient</span>

client = <span class="hljs-title class_">MilvusClient</span>(
    uri=<span class="hljs-string">&quot;http://localhost:19530&quot;</span>,
    token=<span class="hljs-string">&quot;root:Milvus&quot;</span>,
)
client.<span class="hljs-title function_">create_database</span>(<span class="hljs-string">&quot;milvus_demo&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Successivamente, è possibile verificare se il database appena creato chiamato "milvus_demo" esiste davvero nella vostra istanza Milvus accedendo all'<a href="https://milvus.io/docs/milvus-webui.md">interfaccia web</a> di <a href="https://milvus.io/docs/milvus-webui.md">Milvus</a>. Come suggerisce il nome, Milvus Web UI è un'interfaccia grafica fornita da Milvus per osservare le statistiche e le metriche dei componenti, controllare l'elenco e i dettagli di database, raccolte e configurazioni. È possibile accedere a Milvus Web UI una volta avviato il contenitore Docker di cui sopra all'indirizzo http://127.0.0.1:9091/webui/.</p>
<p>Accedendo al link di cui sopra, si vedrà una pagina di destinazione come questa:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Landing_page_UI_187a40e935.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Sotto la scheda "Collections", vedrete che il nostro database "milvus_demo" è stato creato con successo. Come si può vedere, con questa interfaccia web si possono controllare anche altre cose, come l'elenco delle collezioni, le configurazioni, le query eseguite e così via.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Web_Ui_2_666eae57b1.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Ora possiamo eseguire tutto esattamente come abbiamo visto nella sezione Milvus Lite. Creiamo una collezione chiamata "demo_collection" all'interno del database "milvus_demo" che consiste di tre campi, gli stessi che avevamo nella sezione Milvus Lite. Quindi, inseriremo i nostri dati nella collezione.</p>
<pre><code translate="no" class="language-python">index_params = client.prepare_index_params()

<span class="hljs-comment">#  Add indexes</span>
index_params.add_index(
    field_name=<span class="hljs-string">&quot;vector&quot;</span>, 
    index_type=<span class="hljs-string">&quot;AUTOINDEX&quot;</span>,
    metric_type=<span class="hljs-string">&quot;COSINE&quot;</span>
)

<span class="hljs-comment"># Create collection</span>
client.create_collection(
    collection_name=<span class="hljs-string">&quot;demo_collection&quot;</span>,
    schema=schema,
    index_params=index_params
)

<span class="hljs-comment"># Insert data into collection</span>
res = client.insert(
    collection_name=<span class="hljs-string">&quot;demo_collection&quot;</span>,
    data=data
)
<button class="copy-code-btn"></button></code></pre>
<p>Anche il codice per eseguire un'operazione di ricerca vettoriale è lo stesso di Milvus Lite, come si può vedere nel codice sottostante:</p>
<pre><code translate="no" class="language-python">query = [<span class="hljs-string">&quot;Who is Alan Turing&quot;</span>]
query_embedding = sentence_transformer_ef.encode_queries(query)

<span class="hljs-comment"># Load collection</span>
client.load_collection(
    collection_name=<span class="hljs-string">&quot;demo_collection&quot;</span>
)

<span class="hljs-comment"># Vector search</span>
res = client.search(
    collection_name=<span class="hljs-string">&quot;demo_collection&quot;</span>,
    data=query_embedding,
    limit=<span class="hljs-number">1</span>,
    output_fields=[<span class="hljs-string">&quot;text&quot;</span>],
)
<span class="hljs-built_in">print</span>(res)
<span class="hljs-string">&quot;&quot;&quot;
Output:
data: [&quot;[{&#x27;id&#x27;: 1, &#x27;distance&#x27;: 0.7199004292488098, &#x27;entity&#x27;: {&#x27;text&#x27;: &#x27;Alan Turing was the first person to conduct substantial research in AI.&#x27;}}]&quot;] 
&quot;&quot;&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>Oltre a Docker, è possibile utilizzare Milvus Standalone con <a href="https://milvus.io/docs/install_standalone-docker-compose.md">Docker Compose</a> (per Linux) e <a href="https://milvus.io/docs/install_standalone-windows.md">Docker Desktop</a> (per Windows).</p>
<p>Quando non utilizziamo più la nostra istanza Milvus, possiamo fermare Milvus Standalone con il seguente comando:</p>
<pre><code translate="no" class="language-shell">$ bash standalone_embed.sh stop
<button class="copy-code-btn"></button></code></pre>
<h2 id="Fully-Managed-Milvus" class="common-anchor-header">Milvus completamente gestito<button data-href="#Fully-Managed-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Un modo alternativo per iniziare a lavorare con Milvus è quello di utilizzare un'infrastruttura nativa basata su cloud in <a href="https://zilliz.com/cloud">Zilliz Cloud</a>, dove è possibile ottenere un'esperienza senza problemi e 10 volte più veloce.</p>
<p>Zilliz Cloud offre cluster dedicati con ambienti e risorse dedicate per supportare la vostra applicazione AI. Trattandosi di un database basato sul cloud costruito su Milvus, non è necessario impostare e gestire un'infrastruttura locale. Zilliz Cloud offre anche funzionalità più avanzate, come la separazione tra archiviazione vettoriale e calcolo, il backup dei dati su sistemi di archiviazione a oggetti popolari come S3 e il caching dei dati per accelerare le operazioni di ricerca e recupero dei vettori.</p>
<p>Tuttavia, un aspetto da considerare quando si prendono in considerazione i servizi basati sul cloud è il costo operativo. Nella maggior parte dei casi, è necessario pagare anche quando il cluster è inattivo, senza attività di ingestione dei dati o di ricerca vettoriale. Se volete ottimizzare ulteriormente i costi operativi e le prestazioni della vostra applicazione, Zilliz Cloud Serverless è un'opzione eccellente.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_Key_benefits_of_using_Zilliz_Cloud_Serverless_20f68e0fff.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figura: Vantaggi principali dell'utilizzo di Zilliz Cloud Serverless.</em></p>
<p>Zilliz Cloud Serverless è disponibile sui principali provider cloud come AWS, Azure e GCP. Offre caratteristiche come la tariffazione pay-as-you-go, ovvero si paga solo quando si utilizza il cluster.</p>
<p>Zilliz Cloud Serverless implementa anche tecnologie avanzate come i cluster logici, l'autoscaling, lo storage a livelli, la disaggregazione dei dati storici e in streaming e la separazione dei dati caldo-freddo. Queste caratteristiche consentono a Zilliz Cloud Serverless di ottenere un risparmio sui costi fino a 50 volte e operazioni di ricerca vettoriale circa 10 volte più veloci rispetto a Milvus in-memory.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_Illustration_of_tiered_storage_and_hot_cold_data_separation_c634dfd211.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figura: Illustrazione dello storage a livelli e della separazione dei dati caldo-freddo.</em></p>
<p>Se desiderate iniziare a utilizzare Zilliz Cloud Serverless, consultate <a href="https://zilliz.com/serverless">questa pagina</a> per maggiori informazioni.</p>
<h2 id="Conclusion" class="common-anchor-header">Conclusioni<button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus si distingue come database vettoriale versatile e potente, progettato per affrontare le sfide della gestione dei dati non strutturati e dell'esecuzione di operazioni di ricerca vettoriale rapide ed efficienti nelle moderne applicazioni di intelligenza artificiale. Con opzioni di distribuzione come Milvus Lite per la prototipazione rapida, Milvus Standalone per applicazioni di piccole e medie dimensioni e Milvus Distributed per la scalabilità a livello aziendale, offre la flessibilità necessaria per soddisfare le dimensioni e la complessità di qualsiasi progetto.</p>
<p>Inoltre, Zilliz Cloud Serverless estende le funzionalità di Milvus nel cloud e fornisce un modello economico e a pagamento che elimina la necessità di un'infrastruttura locale. Grazie a funzioni avanzate come lo storage a livelli e l'autoscaling, Zilliz Cloud Serverless garantisce operazioni di ricerca vettoriale più rapide, ottimizzando i costi.</p>
