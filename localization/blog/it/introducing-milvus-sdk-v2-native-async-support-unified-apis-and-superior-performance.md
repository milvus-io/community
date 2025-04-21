---
id: >-
  introducing-milvus-sdk-v2-native-async-support-unified-apis-and-superior-performance.md
title: >-
  Presentazione dell'SDK Milvus v2: Supporto nativo Async, API unificate e
  prestazioni superiori
author: Ken Zhang
date: 2025-04-16T00:00:00.000Z
desc: >-
  Provate Milvus SDK v2, ripensato per gli sviluppatori! Godetevi un'API
  unificata, il supporto nativo async e prestazioni migliorate per i vostri
  progetti di ricerca vettoriale.
cover: assets.zilliz.com/Introducing_Milvus_SDK_v2_05c9e5e8b2.png
tag: Engineering
tags: 'Milvus SDK v2, Async Support, Milvus vector database'
canonicalUrl: >-
  https://milvus.io/blog/introducing-milvus-sdk-v2-native-async-support-unified-apis-and-superior-performance.md
---
<h2 id="TLDR" class="common-anchor-header">DETTO IN PAROLE POVERE<button data-href="#TLDR" class="anchor-icon" translate="no">
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
    </button></h2><p>Avete parlato e noi vi abbiamo ascoltato! Milvus SDK v2 è una rivisitazione completa della nostra esperienza di sviluppatori, costruita direttamente sulla base dei vostri feedback. Con un'API unificata per Python, Java, Go e Node.js, il supporto nativo async che ci avete chiesto, una Schema Cache che aumenta le prestazioni e un'interfaccia MilvusClient semplificata, Milvus SDK v2 rende lo sviluppo della <a href="https://zilliz.com/learn/vector-similarity-search">ricerca vettoriale</a> più veloce e intuitivo che mai. Se state costruendo applicazioni <a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">RAG</a>, sistemi di raccomandazione o soluzioni <a href="https://zilliz.com/learn/what-is-computer-vision">di computer vision</a>, questo aggiornamento guidato dalla comunità trasformerà il vostro modo di lavorare con Milvus.</p>
<h2 id="Why-We-Built-It-Addressing-Community-Pain-Points" class="common-anchor-header">Perché l'abbiamo realizzato: Rispondere ai punti dolenti della comunità<button data-href="#Why-We-Built-It-Addressing-Community-Pain-Points" class="anchor-icon" translate="no">
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
    </button></h2><p>Nel corso degli anni, Milvus è diventato il <a href="https://milvus.io/blog/what-is-a-vector-database.md">database vettoriale</a> preferito da migliaia di applicazioni di intelligenza artificiale. Tuttavia, man mano che la nostra comunità cresceva, abbiamo sempre sentito parlare di diverse limitazioni del nostro SDK v1:</p>
<p><strong>"La gestione di un'elevata concorrenza è troppo complessa".</strong> La mancanza di un supporto asincrono nativo in alcuni SDK costringeva gli sviluppatori ad affidarsi a thread o callback, rendendo il codice più difficile da gestire e da debuggare, soprattutto in scenari come il caricamento dei dati in batch e le query parallele.</p>
<p><strong>"Le prestazioni degradano con la scala".</strong> Senza una Schema Cache, v1 convalidava ripetutamente gli schemi durante le operazioni, creando colli di bottiglia per i carichi di lavoro ad alto volume. Nei casi d'uso che richiedono un'elaborazione vettoriale massiccia, questo problema ha comportato un aumento della latenza e una riduzione del throughput.</p>
<p><strong>"Interfacce incoerenti tra i linguaggi creano una curva di apprendimento ripida".</strong> Gli SDK di lingue diverse implementavano le interfacce a modo loro, complicando lo sviluppo tra lingue diverse.</p>
<p><strong>"L'API RESTful manca di funzioni essenziali".</strong> Funzionalità critiche come la gestione delle partizioni e la costruzione di indici non erano disponibili, costringendo gli sviluppatori a passare da un SDK all'altro.</p>
<p>Non si trattava solo di richieste di funzionalità, ma di veri e propri ostacoli al flusso di lavoro dello sviluppo. L'SDK v2 è la nostra promessa di rimuovere queste barriere e permettervi di concentrarvi su ciò che conta: creare applicazioni di intelligenza artificiale straordinarie.</p>
<h2 id="The-Solution-Milvus-SDK-v2" class="common-anchor-header">La soluzione: Milvus SDK v2<button data-href="#The-Solution-Milvus-SDK-v2" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus SDK v2 è il risultato di una riprogettazione completa incentrata sull'esperienza degli sviluppatori, disponibile in più lingue:</p>
<ul>
<li><p><a href="https://milvus.io/api-reference/pymilvus/v2.5.x/About.md">Python SDK v2 (pymilvus.MilvusClient)</a></p></li>
<li><p><a href="https://github.com/milvus-io/milvus-sdk-java">Java v2</a></p></li>
<li><p><a href="https://github.com/milvus-io/milvus/tree/client/v2.5.1/client">Go v2</a></p></li>
<li><p><a href="https://github.com/milvus-io/milvus-sdk-node">NodeJS</a></p></li>
<li><p><a href="https://milvus.io/api-reference/restful/v2.5.x/About.md">RESTful v2</a></p></li>
</ul>
<h3 id="1-Native-Asynchronous-Support-From-Complex-to-Concurrent" class="common-anchor-header">1. Supporto asincrono nativo: Da complesso a concorrente</h3><p>Il vecchio modo di gestire la concorrenza prevedeva ingombranti oggetti Future e schemi di callback. L'SDK v2 introduce una vera funzionalità asincrona/di attesa, in particolare in Python con <code translate="no">AsyncMilvusClient</code> (dalla v2.5.3). Con gli stessi parametri del MilvusClient sincrono, è possibile eseguire facilmente operazioni come inserimento, interrogazione e ricerca in parallelo.</p>
<p>Questo approccio semplificato sostituisce i vecchi schemi ingombranti di Future e callback, portando a un codice più pulito ed efficiente. La logica concorrente complessa, come gli inserimenti di vettori in batch o le multiquery in parallelo, può ora essere implementata senza problemi utilizzando strumenti come <code translate="no">asyncio.gather</code>.</p>
<h3 id="2-Schema-Cache-Boosting-Performance-Where-It-Counts" class="common-anchor-header">2. Schema Cache: Aumentare le prestazioni dove conta</h3><p>L'SDK v2 introduce una Schema Cache che memorizza localmente gli schemi delle collezioni dopo il fetch iniziale, eliminando le ripetute richieste di rete e il sovraccarico della CPU durante le operazioni.</p>
<p>Per gli scenari di inserimento e interrogazione ad alta frequenza, questo aggiornamento si traduce in:</p>
<ul>
<li><p>Riduzione del traffico di rete tra client e server</p></li>
<li><p>Minore latenza per le operazioni</p></li>
<li><p>Riduzione dell'utilizzo della CPU lato server</p></li>
<li><p>Migliore scalabilità in caso di elevata concurrency</p></li>
</ul>
<p>Questo è particolarmente importante per applicazioni come i sistemi di raccomandazione in tempo reale o le funzioni di ricerca live, dove i millisecondi contano.</p>
<h3 id="3-A-Unified-and-Streamlined-API-Experience" class="common-anchor-header">3. Un'esperienza API unificata e semplificata</h3><p>Milvus SDK v2 introduce un'esperienza API unificata e più completa in tutti i linguaggi di programmazione supportati. In particolare, l'API RESTful è stata migliorata in modo significativo per offrire quasi la stessa funzionalità dell'interfaccia gRPC.</p>
<p>Nelle versioni precedenti, l'API RESTful era in ritardo rispetto a gRPC, limitando le possibilità degli sviluppatori senza dover cambiare interfaccia. Ora non è più così. Ora gli sviluppatori possono utilizzare l'API RESTful per eseguire praticamente tutte le operazioni principali, come la creazione di raccolte, la gestione di partizioni, la creazione di indici e l'esecuzione di query, senza dover ricorrere a gRPC o ad altri metodi.</p>
<p>Questo approccio unificato garantisce agli sviluppatori un'esperienza coerente in ambienti e casi d'uso diversi. Riduce la curva di apprendimento, semplifica l'integrazione e migliora l'usabilità complessiva.</p>
<p>Nota: per la maggior parte degli utenti, l'API RESTful offre un modo più rapido e semplice per iniziare a utilizzare Milvus. Tuttavia, se l'applicazione richiede prestazioni elevate o funzioni avanzate come gli iteratori, il client gRPC rimane l'opzione migliore per ottenere la massima flessibilità e controllo.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/RES_Tful_8520a80a8e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="4-Aligned-SDK-Design-Across-All-Languages" class="common-anchor-header">4. Design allineato dell'SDK in tutte le lingue</h3><p>Con Milvus SDK v2, abbiamo standardizzato il design dei nostri SDK in tutti i linguaggi di programmazione supportati per offrire un'esperienza di sviluppo più coerente.</p>
<p>Che si tratti di Python, Java, Go o Node.js, ogni SDK segue ora una struttura unificata incentrata sulla classe MilvusClient. Questa riprogettazione rende coerenti i nomi dei metodi, la formattazione dei parametri e gli schemi d'uso generali di tutti i linguaggi supportati. (Vedi: <a href="https://github.com/milvus-io/milvus/discussions/33979">Aggiornamento dell'esempio di codice dell'SDK MilvusClient - Discussione GitHub #33979</a>)</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Milvus_Client_9a4a6da9e3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Ora, una volta acquisita familiarità con Milvus in una lingua, si può facilmente passare a un'altra senza dover reimparare il funzionamento dell'SDK. Questo allineamento non solo semplifica la fase di avvio, ma rende anche lo sviluppo multilingue molto più fluido e intuitivo.</p>
<h3 id="5-A-Simpler-Smarter-PyMilvus-Python-SDK-with-MilvusClient" class="common-anchor-header">5. Un PyMilvus (SDK Python) più semplice e più intelligente con <code translate="no">MilvusClient</code></h3><p>Nella versione precedente, PyMilvus si basava su un design in stile ORM che introduceva un mix di approcci orientati agli oggetti e procedurali. Gli sviluppatori dovevano definire gli oggetti <code translate="no">FieldSchema</code>, costruire una classe <code translate="no">CollectionSchema</code> e poi istanziare una classe <code translate="no">Collection</code>, il tutto solo per creare una collezione. Questo processo, oltre a essere prolisso, introduceva una curva di apprendimento più ripida per i nuovi utenti.</p>
<p>Con la nuova interfaccia di <code translate="no">MilvusClient</code>, le cose sono molto più semplici. È ora possibile creare una collezione in un solo passaggio, utilizzando il metodo <code translate="no">create_collection()</code>. È possibile definire rapidamente lo schema passando parametri come <code translate="no">dimension</code> e <code translate="no">metric_type</code>, oppure utilizzare un oggetto schema personalizzato, se necessario.</p>
<p>Ancora meglio, <code translate="no">create_collection()</code> supporta la creazione di indici come parte della stessa chiamata. Se vengono forniti i parametri dell'indice, Milvus costruisce automaticamente l'indice e carica i dati in memoria, senza bisogno di chiamate separate a <code translate="no">create_index()</code> o <code translate="no">load()</code>. Un solo metodo fa tutto: <em>creare la collezione → costruire l'indice → caricare la collezione.</em></p>
<p>Questo approccio semplificato riduce la complessità della configurazione e rende molto più facile iniziare a lavorare con Milvus, soprattutto per gli sviluppatori che desiderano un percorso rapido ed efficiente verso la prototipazione o la produzione.</p>
<p>Il nuovo modulo <code translate="no">MilvusClient</code> offre chiari vantaggi in termini di usabilità, coerenza e prestazioni. L'interfaccia ORM legacy rimane disponibile per il momento, ma abbiamo in programma di eliminarla gradualmente in futuro (vedi <a href="https://docs.zilliz.com/reference/python/ORM#:~:text=About%20to%20Deprecate">riferimento</a>). Si consiglia vivamente di passare al nuovo SDK per trarre il massimo vantaggio dai miglioramenti apportati.</p>
<h3 id="6-Clearer-and-More-Comprehensive-Documentation" class="common-anchor-header">6. Documentazione più chiara e completa</h3><p>Abbiamo ristrutturato la documentazione del prodotto per fornire un <a href="https://milvus.io/docs">riferimento API</a> più completo e chiaro. Le nostre guide per l'utente includono ora un codice di esempio multilingue, che consente di iniziare rapidamente e di comprendere le funzionalità di Milvus con facilità. Inoltre, l'assistente Ask AI disponibile sul nostro sito di documentazione può introdurre nuove funzionalità, spiegare i meccanismi interni e persino aiutare a generare o modificare il codice di esempio, rendendo il viaggio attraverso la documentazione più agevole e piacevole.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Ask_AI_Assistant_b044d4621a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="7-Milvus-MCP-Server-Designed-for-the-Future-of-AI-Integration" class="common-anchor-header">7. Milvus MCP Server: Progettato per il futuro dell'integrazione dell'intelligenza artificiale</h3><p>Il <a href="https://github.com/zilliztech/mcp-server-milvus">server MCP</a>, costruito sopra l'SDK Milvus, è la nostra risposta a un'esigenza crescente nell'ecosistema dell'IA: l'integrazione perfetta tra grandi modelli linguistici<a href="https://zilliz.com/glossary/large-language-models-(llms)">(LLM</a>), <a href="https://milvus.io/blog/what-is-a-vector-database.md">database vettoriali</a> e strumenti o fonti di dati esterni. Implementa il Model Context Protocol (MCP), fornendo un'interfaccia unificata e intelligente per orchestrare le operazioni di Milvus e non solo.</p>
<p>Con l'aumento delle capacità degli <a href="https://zilliz.com/blog/top-10-ai-agents-to-watch-in-2025">agenti di intelligenza artificiale</a>, che non si limitano a generare codice ma gestiscono autonomamente i servizi di backend, cresce la domanda di infrastrutture più intelligenti e basate su API. Il server MCP è stato progettato pensando a questo futuro. Consente interazioni intelligenti e automatizzate con i cluster Milvus, semplificando attività come la distribuzione, la manutenzione e la gestione dei dati.</p>
<p>Ma soprattutto, pone le basi per un nuovo tipo di collaborazione macchina-macchina. Con il server MCP, gli agenti AI possono chiamare le API per creare dinamicamente collezioni, eseguire query, costruire indici e altro ancora, il tutto senza l'intervento umano.</p>
<p>In breve, il server MCP trasforma Milvus non solo in un database, ma in un backend completamente programmabile e pronto per l'AI, aprendo la strada ad applicazioni intelligenti, autonome e scalabili.</p>
<h2 id="Getting-Started-with-Milvus-SDK-v2-Sample-Code" class="common-anchor-header">Come iniziare con Milvus SDK v2: Esempi di codice<button data-href="#Getting-Started-with-Milvus-SDK-v2-Sample-Code" class="anchor-icon" translate="no">
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
    </button></h2><p>Gli esempi che seguono mostrano come utilizzare la nuova interfaccia PyMilvus (Python SDK v2) per creare una collezione ed eseguire operazioni asincrone. Rispetto all'approccio in stile ORM della versione precedente, questo codice è più pulito, più coerente e più facile da usare.</p>
<h3 id="1-Creating-a-Collection-Defining-Schemas-Building-Indexes-and-Loading-Data-with-MilvusClient" class="common-anchor-header">1. Creazione di una collezione, definizione di schemi, creazione di indici e caricamento dei dati con <code translate="no">MilvusClient</code></h3><p>Lo snippet di codice Python che segue mostra come creare una collezione, definirne lo schema, costruire gli indici e caricare i dati, il tutto in un'unica chiamata:</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient, DataType

<span class="hljs-comment"># 1. Connect to Milvus (initialize the client)</span>
client = MilvusClient(uri=<span class="hljs-string">&quot;http://localhost:19530&quot;</span>)

<span class="hljs-comment"># 2. Define the collection schema</span>
schema = MilvusClient.create_schema(auto_id=<span class="hljs-literal">False</span>, description=<span class="hljs-string">&quot;schema for example collection&quot;</span>)
schema.add_field(<span class="hljs-string">&quot;id&quot;</span>, DataType.INT64, is_primary=<span class="hljs-literal">True</span>)  <span class="hljs-comment"># Primary key field</span>
schema.add_field(<span class="hljs-string">&quot;embedding&quot;</span>, DataType.FLOAT_VECTOR, dim=<span class="hljs-number">128</span>)  <span class="hljs-comment"># Vector field</span>

<span class="hljs-comment"># 3. Prepare index parameters (optional if indexing at creation time)</span>
index_params = client.prepare_index_params()
index_params.add_index(
    field_name=<span class="hljs-string">&quot;embedding&quot;</span>,
    index_type=<span class="hljs-string">&quot;AUTOINDEX&quot;</span>,
    metric_type=<span class="hljs-string">&quot;L2&quot;</span>
)

<span class="hljs-comment"># 4. Create the collection with indexes and load it into memory automatically</span>
client.create_collection(
    collection_name=<span class="hljs-string">&quot;example_collection&quot;</span>,
    schema=schema,
    index_params=index_params
)

<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Collection created and loaded with index!&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Il parametro <code translate="no">index_params</code> del metodo <code translate="no">create_collection</code> elimina la necessità di chiamate separate per <code translate="no">create_index</code> e <code translate="no">load_collection</code>: tutto avviene automaticamente.</p>
<p>Inoltre, <code translate="no">MilvusClient</code> supporta una modalità di creazione rapida delle tabelle. Ad esempio, è possibile creare una collezione in una sola riga di codice, specificando solo i parametri necessari:</p>
<pre><code translate="no">client.<span class="hljs-title function_">create_collection</span>(
    collection_name=<span class="hljs-string">&quot;test_collection&quot;</span>,
    dimension=<span class="hljs-number">128</span>
)
<button class="copy-code-btn"></button></code></pre>
<p><em>(Nota di confronto: nel vecchio approccio ORM, si doveva creare un <code translate="no">Collection(schema)</code> e poi chiamare separatamente <code translate="no">collection.create_index()</code> e <code translate="no">collection.load()</code>; ora, MilvusClient semplifica l'intero processo).</em></p>
<h3 id="2-Performing-High-Concurrency-Asynchronous-Inserts-with-AsyncMilvusClient" class="common-anchor-header">2. Eseguire inserimenti asincroni ad alta concorrenza con <code translate="no">AsyncMilvusClient</code></h3><p>L'esempio seguente mostra come utilizzare <code translate="no">AsyncMilvusClient</code> per eseguire operazioni di inserimento concomitanti utilizzando <code translate="no">async/await</code>:</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> asyncio
<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> AsyncMilvusClient

<span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">insert_vectors_concurrently</span>():
    client = AsyncMilvusClient(uri=<span class="hljs-string">&quot;http://localhost:19530&quot;</span>)
    
    vectors_to_insert = [[...], [...], ...]  <span class="hljs-comment"># Assume 100,000 vectors</span>
    batch_size = <span class="hljs-number">1000</span>  <span class="hljs-comment"># Recommended batch size</span>
    tasks = []

    <span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-number">0</span>, <span class="hljs-built_in">len</span>(vectors_to_insert), batch_size):
        batch_vectors = vectors_to_insert[i:i+batch_size]

        <span class="hljs-comment"># Construct batch data</span>
        data = [
            <span class="hljs-built_in">list</span>(<span class="hljs-built_in">range</span>(i, i + <span class="hljs-built_in">len</span>(batch_vectors))),  <span class="hljs-comment"># Batch IDs</span>
            batch_vectors  <span class="hljs-comment"># Batch vectors</span>
        ]

        <span class="hljs-comment"># Add an asynchronous task for inserting each batch</span>
        tasks.append(client.insert(<span class="hljs-string">&quot;example_collection&quot;</span>, data=data))

    <span class="hljs-comment"># Concurrently execute batch inserts</span>
    insert_results = <span class="hljs-keyword">await</span> asyncio.gather(*tasks)
    <span class="hljs-keyword">await</span> client.close()

<span class="hljs-comment"># Execute asynchronous tasks</span>
asyncio.run(insert_vectors_concurrently())
<button class="copy-code-btn"></button></code></pre>
<p>In questo esempio, <code translate="no">AsyncMilvusClient</code> viene utilizzato per inserire dati in modo concorrente pianificando più task di inserimento con <code translate="no">asyncio.gather</code>. Questo approccio sfrutta appieno le capacità di elaborazione concorrente del backend di Milvus. A differenza degli inserimenti sincroni riga per riga della v1, questo supporto asincrono nativo aumenta notevolmente il throughput.</p>
<p>Allo stesso modo, è possibile modificare il codice per eseguire query o ricerche simultanee, ad esempio sostituendo la chiamata insert con <code translate="no">client.search(&quot;example_collection&quot;, data=[query_vec], limit=5)</code>. L'interfaccia asincrona di Milvus SDK v2 garantisce che ogni richiesta venga eseguita in modo non bloccante, sfruttando appieno le risorse del client e del server.</p>
<h2 id="Migration-Made-Easy" class="common-anchor-header">Migrazione semplificata<button data-href="#Migration-Made-Easy" class="anchor-icon" translate="no">
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
    </button></h2><p>Sappiamo che avete investito tempo nell'SDK v1, quindi abbiamo progettato l'SDK v2 tenendo conto delle vostre applicazioni esistenti. L'SDK v2 include la retrocompatibilità, quindi le interfacce esistenti in stile v1/ORM continueranno a funzionare per un po'. Tuttavia, consigliamo vivamente di passare all'SDK v2 il prima possibile: il supporto per il v1 terminerà con il rilascio di Milvus 3.0 (fine del 2025).</p>
<p>Passando all'SDK v2 si ottiene un'esperienza di sviluppo più coerente e moderna, con una sintassi semplificata, un migliore supporto asincrono e prestazioni migliorate. È anche il luogo in cui si concentreranno tutte le nuove funzionalità e il supporto della comunità in futuro. L'aggiornamento ora vi assicura di essere pronti per il futuro e vi dà accesso al meglio che Milvus ha da offrire.</p>
<h2 id="Conclusion" class="common-anchor-header">Conclusione<button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus SDK v2 apporta miglioramenti significativi rispetto alla versione 1: prestazioni migliorate, un'interfaccia unificata e coerente tra più linguaggi di programmazione e un supporto asincrono nativo che semplifica le operazioni ad alta liquidità. Con una documentazione più chiara ed esempi di codice più intuitivi, Milvus SDK v2 è stato progettato per semplificare il processo di sviluppo, rendendo più facile e più veloce la creazione e la distribuzione di applicazioni AI.</p>
<p>Per informazioni più dettagliate, si prega di consultare le nostre ultime <a href="https://milvus.io/docs/install-pymilvus.md#Install-Milvus-Python-SDK">API</a> ufficiali <a href="https://milvus.io/docs/install-pymilvus.md#Install-Milvus-Python-SDK">di riferimento e le guide per l'utente</a>. Se avete domande o suggerimenti sul nuovo SDK, non esitate a fornire il vostro feedback su <a href="https://github.com/milvus-io/milvus/discussions">GitHub</a> e <a href="https://discord.com/invite/8uyFbECzPX">Discord</a>. Saremo lieti di ricevere il vostro contributo per continuare a migliorare Milvus.</p>
