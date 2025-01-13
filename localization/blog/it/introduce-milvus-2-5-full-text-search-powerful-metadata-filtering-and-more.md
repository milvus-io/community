---
id: introduce-milvus-2-5-full-text-search-powerful-metadata-filtering-and-more.md
title: >-
  Presentazione di Milvus 2.5: ricerca a tutto testo, filtraggio dei metadati
  più potente e miglioramenti dell'usabilità!
author: 'Ken Zhang, Stefan Webb, Jiang Chen'
date: 2024-12-17T00:00:00.000Z
cover: assets.zilliz.com/Introducing_Milvus_2_5_e4968e1cdb.png
tag: Engineering
tags: >-
  Milvus, contribute to open-source projects, vector databases, Contribute to
  Milvus
recommend: true
canonicalUrl: >-
  https://milvus.io/blog/introduce-milvus-2-5-full-text-search-powerful-metadata-filtering-and-more.md
---
<h2 id="Overview" class="common-anchor-header">Panoramica<button data-href="#Overview" class="anchor-icon" translate="no">
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
    </button></h2><p>Siamo entusiasti di presentare l'ultima versione di Milvus, la 2.5, che introduce una nuova potente funzionalità: la <a href="https://milvus.io/docs/full-text-search.md#Full-Text-Search">ricerca full-text</a>, nota anche come ricerca lessicale o per parole chiave. Per chi non lo sapesse, la ricerca full-text consente di trovare i documenti cercando parole o frasi specifiche all'interno di essi, in modo simile a come si cerca su Google. Questo integra le nostre attuali funzionalità di ricerca semantica, che comprendono il significato della vostra ricerca piuttosto che limitarsi a trovare le parole esatte.</p>
<p>Utilizziamo la metrica BM25, standard del settore, per la somiglianza dei documenti e la nostra implementazione si basa su vettori sparsi, che consentono una memorizzazione e un recupero più efficienti. Per chi non ha familiarità con il termine, i vettori sparsi sono un modo di rappresentare il testo in cui la maggior parte dei valori è pari a zero, il che li rende molto efficienti da memorizzare ed elaborare: immaginate un enorme foglio di calcolo in cui solo poche celle contengono numeri e il resto è vuoto. Questo approccio si adatta bene alla filosofia del prodotto Milvus, in cui il vettore è l'entità di ricerca principale.</p>
<p>Un altro aspetto degno di nota della nostra implementazione è la possibilità di inserire e interrogare <em>direttamente</em> il testo, invece di doverlo convertire manualmente in vettori sparsi. In questo modo Milvus fa un passo avanti verso l'elaborazione completa dei dati non strutturati.</p>
<p>Ma questo è solo l'inizio. Con il rilascio della versione 2.5, abbiamo aggiornato la <a href="https://milvus.io/docs/roadmap.md">roadmap dei prodotti Milvus</a>. Nelle future iterazioni di Milvus, ci concentreremo sull'evoluzione delle capacità di Milvus in quattro direzioni chiave:</p>
<ul>
<li>Elaborazione semplificata dei dati non strutturati;</li>
<li>Migliore qualità ed efficienza della ricerca;</li>
<li>Semplificazione della gestione dei dati;</li>
<li>Riduzione dei costi grazie a progressi algoritmici e di progettazione.</li>
</ul>
<p>Il nostro obiettivo è costruire un'infrastruttura di dati in grado di memorizzare in modo efficiente e recuperare efficacemente le informazioni nell'era dell'intelligenza artificiale.</p>
<h2 id="Full-text-Search-via-Sparse-BM25" class="common-anchor-header">Ricerca full-text tramite Sparse-BM25<button data-href="#Full-text-Search-via-Sparse-BM25" class="anchor-icon" translate="no">
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
    </button></h2><p>Sebbene la ricerca semantica abbia in genere una migliore consapevolezza del contesto e una migliore comprensione dell'intento, quando un utente deve cercare specifici nomi propri, numeri di serie o una frase completamente corrispondente, la ricerca full-text con corrispondenza di parole chiave spesso produce risultati più accurati.</p>
<p>Per illustrare questo aspetto con un esempio:</p>
<ul>
<li>La ricerca semantica eccelle quando si chiede: "Trova documenti sulle soluzioni di energia rinnovabile".</li>
<li>La ricerca full-text è migliore quando si chiede: &quot;Trovare documenti che parlano di <em>Tesla Model 3 2024</em>&quot;.</li>
</ul>
<p>Nella nostra versione precedente (Milvus 2.4), gli utenti dovevano preelaborare il testo utilizzando uno strumento separato (il modulo BM25EmbeddingFunction di PyMilvus) sulla propria macchina prima di poterlo cercare. Questo approccio presentava diversi limiti: non era in grado di gestire bene insiemi di dati in crescita, richiedeva fasi di configurazione aggiuntive e rendeva l'intero processo più complicato del necessario. Per i tecnici, le limitazioni principali erano che poteva funzionare solo su una singola macchina; il vocabolario e le altre statistiche del corpus utilizzate per il punteggio BM25 non potevano essere aggiornate man mano che il corpus cambiava; e la conversione del testo in vettori sul lato client è meno intuitiva se si lavora direttamente con il testo.</p>
<p>Milvus 2.5 semplifica tutto. Ora è possibile lavorare direttamente con il testo:</p>
<ul>
<li>Memorizzare i documenti di testo originali così come sono</li>
<li>Effettuare ricerche con query in linguaggio naturale</li>
<li>Ottenere i risultati in forma leggibile</li>
</ul>
<p>Dietro le quinte, Milvus gestisce automaticamente tutte le complesse conversioni vettoriali, facilitando il lavoro con i dati di testo. Questo è ciò che chiamiamo il nostro approccio "Doc in, Doc out": voi lavorate con il testo leggibile e noi ci occupiamo del resto.</p>
<h3 id="Techical-Implementation" class="common-anchor-header">Implementazione tecnica</h3><p>Per coloro che sono interessati ai dettagli tecnici, Milvus 2.5 aggiunge la capacità di ricerca full-text attraverso l'implementazione Sparse-BM25 integrata, che comprende:</p>
<ul>
<li><strong>Un Tokenizer costruito su tantivy</strong>: Milvus si integra ora con il fiorente ecosistema di tantivy.</li>
<li><strong>Capacità di ingerire e recuperare documenti grezzi</strong>: Supporto per l'acquisizione diretta e l'interrogazione di dati testuali.</li>
<li><strong>Punteggio di rilevanza BM25</strong>: Internalizzazione del punteggio BM25, implementato sulla base di vettori sparsi.</li>
</ul>
<p>Abbiamo scelto di lavorare con l'ecosistema ben sviluppato di tantivy e di costruire il tokenizzatore di testo Milvus su tantivy. In futuro, Milvus supporterà altri tokenizzatori ed esporrà il processo di tokenizzazione per aiutare gli utenti a comprendere meglio la qualità del recupero. Esploreremo anche tokenizzatori basati sul deep learning e strategie di stemmer per ottimizzare ulteriormente le prestazioni della ricerca full-text. Di seguito è riportato un esempio di codice per l'utilizzo e la configurazione del tokenizer:</p>
<pre><code translate="no" class="language-Python"><span class="hljs-comment"># Tokenizer configuration</span>
schema.add_field(
    field_name=<span class="hljs-string">&#x27;text&#x27;</span>,
    datatype=DataType.VARCHAR,
    max_length=<span class="hljs-number">65535</span>,
    enable_analyzer=<span class="hljs-literal">True</span>, <span class="hljs-comment"># Enable tokenizer on this column</span>
    analyzer_params={<span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;english&quot;</span>},  <span class="hljs-comment"># Configure tokenizer parameters, here we choose the english template, fine-grained configuration is also supported</span>
    enable_match=<span class="hljs-literal">True</span>, <span class="hljs-comment"># Build an inverted index for Text_Match</span>
)
<button class="copy-code-btn"></button></code></pre>
<p>Dopo aver configurato il tokenizer nello schema della raccolta, gli utenti possono registrare il testo nella funzione bm25 tramite il metodo add_function. Questo verrà eseguito internamente al server Milvus. Tutti i flussi di dati successivi, come aggiunte, cancellazioni, modifiche e interrogazioni, possono essere completati operando sulla stringa di testo grezzo, invece che sulla rappresentazione vettoriale. Si veda il seguente esempio di codice per capire come ingerire il testo ed effettuare ricerche full-text con la nuova API:</p>
<pre><code translate="no" class="language-Python"><span class="hljs-comment"># Define the mapping relationship between raw text data and vectors on the schema</span>
bm25_function = Function(
    name=<span class="hljs-string">&quot;text_bm25_emb&quot;</span>,
    input_field_names=[<span class="hljs-string">&quot;text&quot;</span>], <span class="hljs-comment"># Input text field</span>
    output_field_names=[<span class="hljs-string">&quot;sparse&quot;</span>], <span class="hljs-comment"># Internal mapping sparse vector field</span>
    function_type=FunctionType.BM25, <span class="hljs-comment"># Model for processing mapping relationship</span>
)

schema.add_function(bm25_function)
...
<span class="hljs-comment"># Support for raw text in/out</span>
MilvusClient.insert(<span class="hljs-string">&#x27;demo&#x27;</span>, [
    {<span class="hljs-string">&#x27;text&#x27;</span>: <span class="hljs-string">&#x27;Artificial intelligence was founded as an academic discipline in 1956.&#x27;</span>},
    {<span class="hljs-string">&#x27;text&#x27;</span>: <span class="hljs-string">&#x27;Alan Turing was the first person to conduct substantial research in AI.&#x27;</span>},
    {<span class="hljs-string">&#x27;text&#x27;</span>: <span class="hljs-string">&#x27;Born in Maida Vale, London, Turing was raised in southern England.&#x27;</span>},
])

MilvusClient.search(
    collection_name=<span class="hljs-string">&#x27;demo&#x27;</span>,
    data=[<span class="hljs-string">&#x27;Who started AI research?&#x27;</span>],
    anns_field=<span class="hljs-string">&#x27;sparse&#x27;</span>,
    limit=<span class="hljs-number">3</span>
)
<button class="copy-code-btn"></button></code></pre>
<p>Abbiamo adottato un'implementazione del punteggio di rilevanza BM25 che rappresenta le query e i documenti come vettori sparsi, chiamati <strong>Sparse-BM25</strong>. Questo sblocca molte ottimizzazioni basate su vettori sparsi, come ad esempio:</p>
<p>Milvus ottiene capacità di ricerca ibrida grazie alla sua <strong>implementazione Sparse-BM25</strong> all'avanguardia, che integra la ricerca full-text nell'architettura del database vettoriale. Rappresentando le frequenze dei termini come vettori sparsi, invece dei tradizionali indici invertiti, Sparse-BM25 consente ottimizzazioni avanzate, come l'<strong>indicizzazione a grafo</strong>, la <strong>quantizzazione del prodotto (PQ)</strong> e la <strong>quantizzazione scalare (SQ)</strong>. Queste ottimizzazioni riducono al minimo l'utilizzo della memoria e accelerano le prestazioni di ricerca. Simile all'approccio a indice invertito, Milvus supporta l'acquisizione di testo grezzo come input e la generazione interna di vettori sparsi. Questo lo rende in grado di lavorare con qualsiasi tokenizer e di cogliere qualsiasi parola presente nel corpus in continua evoluzione.</p>
<p>Inoltre, il pruning euristico scarta i vettori sparsi di basso valore, migliorando ulteriormente l'efficienza senza compromettere l'accuratezza. A differenza dei precedenti approcci che utilizzano vettori sparsi, questo approccio è in grado di adattarsi a un corpus in crescita e non all'accuratezza del punteggio BM25.</p>
<ol>
<li>Creazione di indici a grafo sul vettore sparse, con prestazioni migliori rispetto all'indice invertito su query con testi lunghi, poiché l'indice invertito necessita di più passaggi per completare la corrispondenza dei token nella query;</li>
<li>Sfruttare le tecniche di approssimazione per accelerare la ricerca con un impatto minimo sulla qualità del recupero, come la quantizzazione del vettore e il pruning euristico;</li>
<li>unificare l'interfaccia e il modello dei dati per eseguire la ricerca semantica e la ricerca full-text, migliorando così l'esperienza dell'utente.</li>
</ol>
<pre><code translate="no" class="language-Python"><span class="hljs-comment"># Creating an index on the sparse column</span>
index_params.add_index(
    field_name=<span class="hljs-string">&quot;sparse&quot;</span>,
    index_type=<span class="hljs-string">&quot;AUTOINDEX&quot;</span>,  <span class="hljs-comment"># Default WAND index</span>
    metric_type=<span class="hljs-string">&quot;BM25&quot;</span> <span class="hljs-comment"># Configure relevance scoring through metric_type</span>
)

<span class="hljs-comment"># Configurable parameters at search time to speed up search</span>
search_params = {
    <span class="hljs-string">&#x27;params&#x27;</span>: {<span class="hljs-string">&#x27;drop_ratio_search&#x27;</span>: <span class="hljs-number">0.6</span>}, <span class="hljs-comment"># WAND search parameter configuration can speed up search</span>
}
<button class="copy-code-btn"></button></code></pre>
<p>In sintesi, Milvus 2.5 ha ampliato la sua capacità di ricerca al di là della ricerca semantica introducendo la ricerca full-text, rendendo più facile per gli utenti costruire applicazioni AI di alta qualità. Questi sono solo i primi passi nello spazio della ricerca Sparse-BM25 e prevediamo che in futuro ci saranno ulteriori misure di ottimizzazione da provare.</p>
<h2 id="Text-Matching-Search-Filters" class="common-anchor-header">Filtri di ricerca per la corrispondenza del testo<button data-href="#Text-Matching-Search-Filters" class="anchor-icon" translate="no">
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
    </button></h2><p>Una seconda funzione di ricerca testuale rilasciata con Milvus 2.5 è <strong>Text Match</strong>, che consente all'utente di filtrare la ricerca sulle voci contenenti una specifica stringa di testo. Anche questa funzione si basa sulla tokenizzazione ed è attivata con <code translate="no">enable_match=True</code>.</p>
<p>Vale la pena notare che con Text Match, l'elaborazione del testo della query si basa sulla logica dell'OR dopo la tokenizzazione. Ad esempio, nell'esempio seguente, il risultato restituirà tutti i documenti (utilizzando il campo "text") che contengono "vector" o "database".</p>
<pre><code translate="no" class="language-Python"><span class="hljs-built_in">filter</span> = <span class="hljs-string">&quot;TEXT_MATCH(text, &#x27;vector database&#x27;)&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>Se lo scenario richiede la corrispondenza tra 'vettore' e 'database', è necessario scrivere due corrispondenze di testo separate e sovrapporle con AND per raggiungere l'obiettivo.</p>
<pre><code translate="no" class="language-Python"><span class="hljs-built_in">filter</span> = <span class="hljs-string">&quot;TEXT_MATCH(text, &#x27;vector&#x27;) and TEXT_MATCH(text, &#x27;database&#x27;)&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<h2 id="Significant-Enhancement-in-Scalar-Filtering-Performance" class="common-anchor-header">Miglioramento significativo delle prestazioni del filtraggio scalare<button data-href="#Significant-Enhancement-in-Scalar-Filtering-Performance" class="anchor-icon" translate="no">
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
    </button></h2><p>La nostra enfasi sulle prestazioni del filtraggio scalare deriva dalla scoperta che la combinazione di recupero vettoriale e filtraggio dei metadati può migliorare notevolmente le prestazioni e l'accuratezza delle query in vari scenari. Questi scenari spaziano da applicazioni di ricerca di immagini, come l'identificazione di casi angolari nella guida autonoma, a scenari complessi di RAG nelle basi di conoscenza aziendali. Pertanto, è molto adatto agli utenti aziendali per essere implementato in scenari di applicazione di dati su larga scala.</p>
<p>In pratica, molti fattori come la quantità di dati da filtrare, l'organizzazione dei dati e le modalità di ricerca possono influire sulle prestazioni. Per risolvere questo problema, Milvus 2.5 introduce tre nuovi tipi di indici: l'indice BitMap, l'indice invertito Array e l'indice invertito dopo la tokenizzazione del campo di testo Varchar. Questi nuovi indici possono migliorare significativamente le prestazioni nei casi d'uso reali.</p>
<p>In particolare:</p>
<ol>
<li><strong>BitMap Index</strong> può essere utilizzato per accelerare il filtraggio dei tag (gli operatori più comuni includono in, array_contains, ecc.) ed è adatto a scenari con un numero ridotto di dati di categoria di campo (cardinalità dei dati). Il principio consiste nel determinare se una riga di dati ha un determinato valore su una colonna, con 1 per sì e 0 per no, e quindi mantenere un elenco BitMap. Il grafico seguente mostra il confronto dei test sulle prestazioni che abbiamo condotto sulla base dello scenario aziendale di un cliente. In questo scenario, il volume di dati è di 500 milioni, la categoria di dati è 20, i diversi valori hanno proporzioni di distribuzione diverse (1%, 5%, 10%, 50%) e le prestazioni variano anche in base alle diverse quantità di filtraggio. Con un filtraggio del 50%, possiamo ottenere un guadagno di prestazioni di 6,8 volte grazie a BitMap Index. Vale la pena notare che all'aumentare della cardinalità, rispetto all'indice BitMap, l'indice invertito mostrerà prestazioni più equilibrate.</li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/QPS_comparison_f3f580d697.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<ol start="2">
<li><strong>Text Match</strong> si basa sull'Inverted Index dopo la tokenizzazione del campo di testo. Le sue prestazioni superano di gran lunga la funzione Wildcard Match (cioè, like + %) che abbiamo fornito nella versione 2.4. Secondo i risultati dei nostri test interni, i vantaggi di Text Match sono molto evidenti, soprattutto in scenari di query concorrenti, dove può raggiungere un aumento del QPS di 400 volte.</li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/data_size_and_concurrency_e19dc44c59.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Per quanto riguarda l'elaborazione dei dati JSON, prevediamo di introdurre nelle versioni successive di 2.5.x la creazione di indici invertiti per le chiavi specificate dall'utente e la registrazione delle informazioni di localizzazione predefinite per tutte le chiavi, al fine di accelerare il parsing. Prevediamo che entrambe le aree miglioreranno in modo significativo le prestazioni delle query di JSON e Dynamic Field. Abbiamo in programma di presentare ulteriori informazioni nelle future note di rilascio e nei blog tecnici, quindi rimanete sintonizzati!</p>
<h2 id="New-Management-Interface" class="common-anchor-header">Nuova interfaccia di gestione<button data-href="#New-Management-Interface" class="anchor-icon" translate="no">
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
    </button></h2><p>La gestione di un database non dovrebbe richiedere una laurea in informatica, ma sappiamo che gli amministratori di database hanno bisogno di strumenti potenti. Ecco perché abbiamo introdotto la <strong>Cluster Management WebUI</strong>, una nuova interfaccia basata sul web accessibile all'indirizzo del cluster sulla porta 9091/webui. Questo strumento di osservabilità fornisce:</p>
<ul>
<li>Cruscotti di monitoraggio in tempo reale che mostrano le metriche dell'intero cluster</li>
<li>Analisi dettagliate della memoria e delle prestazioni per nodo</li>
<li>Informazioni sui segmenti e tracciamento delle query lente</li>
<li>Indicatori di salute del sistema e stato dei nodi</li>
<li>Strumenti di risoluzione dei problemi di facile utilizzo per problemi di sistema complessi.</li>
</ul>
<p>L'interfaccia è ancora in fase beta, ma la stiamo sviluppando attivamente sulla base del feedback degli amministratori di database. I futuri aggiornamenti includeranno una diagnostica assistita dall'intelligenza artificiale, funzioni di gestione più interattive e funzionalità di osservabilità del cluster migliorate.</p>
<h2 id="Documentation-and-Developer-Experience" class="common-anchor-header">Documentazione e esperienza degli sviluppatori<button data-href="#Documentation-and-Developer-Experience" class="anchor-icon" translate="no">
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
    </button></h2><p>Abbiamo completamente rinnovato la <strong>documentazione</strong> e l'esperienza <strong>SDK/API</strong> per rendere Milvus più accessibile, pur mantenendo la profondità per gli utenti esperti. I miglioramenti includono:</p>
<ul>
<li>Un sistema di documentazione ristrutturato con una progressione più chiara dai concetti di base a quelli avanzati.</li>
<li>Tutorial interattivi ed esempi reali che illustrano implementazioni pratiche</li>
<li>Riferimenti API completi con esempi pratici di codice</li>
<li>Un design dell'SDK più facile da usare che semplifica le operazioni più comuni</li>
<li>Guide illustrate che semplificano la comprensione di concetti complessi</li>
<li>Un assistente alla documentazione potenziato dall'intelligenza artificiale (ASK AI) per risposte rapide.</li>
</ul>
<p>L'SDK/API aggiornato si concentra sul miglioramento dell'esperienza degli sviluppatori attraverso interfacce più intuitive e una migliore integrazione con la documentazione. Crediamo che noterete questi miglioramenti quando lavorerete con la serie 2.5.x.</p>
<p>Tuttavia, sappiamo che lo sviluppo della documentazione e dell'SDK è un processo continuo. Continueremo a ottimizzare la struttura dei contenuti e il design dell'SDK in base al feedback della comunità. Unitevi al nostro canale Discord per condividere i vostri suggerimenti e aiutarci a migliorare ulteriormente.</p>
<h2 id="Summary" class="common-anchor-header"><strong>Riassunto</strong><button data-href="#Summary" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.5 contiene 13 nuove funzionalità e diverse ottimizzazioni a livello di sistema, con il contributo non solo di Zilliz ma della comunità open-source. In questo post abbiamo toccato solo alcune di esse e vi invitiamo a visitare la nostra <a href="https://milvus.io/docs/release_notes.md">nota di rilascio</a> e i <a href="https://milvus.io/docs">documenti ufficiali</a> per maggiori informazioni!</p>
