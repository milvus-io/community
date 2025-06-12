---
id: introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md
title: >-
  Presentazione di Milvus 2.6: ricerca vettoriale accessibile su scala
  miliardaria
author: Fendy Feng
date: 2025-06-12T00:00:00.000Z
desc: >-
  Siamo lieti di annunciare che Milvus 2.6 è ora disponibile. Questa versione
  introduce decine di funzionalità che affrontano direttamente le sfide più
  urgenti della ricerca vettoriale di oggi: scalare in modo efficiente
  mantenendo i costi sotto controllo.
cover: assets.zilliz.com/Introducing_Milvus_2_6_2593452384.png
tag: Announcements
recommend: true
publishToMedium: true
tags: 'Milvus, vector database, vector search, AI Agents, LLM'
meta_keywords: 'Milvus, vector database, vector search, AI search, Milvus 2.6'
meta_title: |
  Introducing Milvus 2.6: Affordable Vector Search at Billion Scale
origin: >-
  https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md
---
<p>Con l'evoluzione della ricerca AI da progetto sperimentale a infrastruttura mission-critical, le richieste di <a href="https://milvus.io/blog/what-is-a-vector-database.md">database vettoriali</a> si sono intensificate. Le organizzazioni devono gestire miliardi di vettori, gestendo al contempo i costi dell'infrastruttura, supportando l'ingestione dei dati in tempo reale e fornendo un reperimento sofisticato che vada oltre la semplice <a href="https://zilliz.com/learn/vector-similarity-search">ricerca per similarità</a>. Per affrontare queste sfide in evoluzione, abbiamo lavorato duramente allo sviluppo e al perfezionamento di Milvus. La risposta della comunità è stata incredibilmente incoraggiante e il feedback prezioso ci ha aiutato a definire la nostra direzione.</p>
<p>Dopo mesi di intenso sviluppo, siamo lieti di annunciare che <strong>Milvus 2.6 è ora disponibile</strong>. Questa versione affronta direttamente le sfide più urgenti della ricerca vettoriale di oggi: <strong><em>scalare in modo efficiente mantenendo i costi sotto controllo.</em></strong></p>
<p>Milvus 2.6 offre innovazioni rivoluzionarie in tre aree critiche: <strong>riduzione dei costi, funzionalità di ricerca avanzate e miglioramenti architetturali per una scala massiva</strong>. I risultati parlano da soli:</p>
<ul>
<li><p><strong>72% di riduzione della memoria</strong> grazie alla quantizzazione a 1 bit RaBitQ, con query 4 volte più veloci.</p></li>
<li><p><strong>50% di risparmio sui costi</strong> grazie allo storage intelligente a livelli</p></li>
<li><p><strong>Ricerca full-text 4 volte più veloce</strong> di Elasticsearch con la nostra implementazione BM25 migliorata</p></li>
<li><p>Filtraggio JSON<strong>100 volte più veloce</strong> con l'indice Path di recente introduzione</p></li>
<li><p><strong>La freschezza della ricerca è ottenuta in modo economico</strong> con la nuova architettura zero-disk</p></li>
<li><p><strong>Flusso di lavoro semplificato</strong> con la nuova esperienza "data in and data out".</p></li>
<li><p><strong>Fino a 100K collezioni in un singolo cluster</strong> per una multi-tenancy a prova di futuro</p></li>
</ul>
<h2 id="Innovations-for-Cost-Reduction-Making-Vector-Search-Affordable" class="common-anchor-header">Innovazioni per la riduzione dei costi: Rendere la ricerca vettoriale accessibile<button data-href="#Innovations-for-Cost-Reduction-Making-Vector-Search-Affordable" class="anchor-icon" translate="no">
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
    </button></h2><p>Il consumo di memoria rappresenta una delle maggiori sfide quando si scala la ricerca vettoriale a miliardi di record. Milvus 2.6 introduce diverse ottimizzazioni chiave che riducono significativamente i costi dell'infrastruttura, migliorando al contempo le prestazioni.</p>
<h3 id="RaBitQ-1-bit-Quantization-72-Memory-Reduction-with-4×-Performance" class="common-anchor-header">Quantizzazione a 1 bit RaBitQ: 72% di riduzione della memoria con prestazioni 4 volte superiori</h3><p>I metodi di quantizzazione tradizionali costringono a barattare la qualità della ricerca con il risparmio di memoria. Milvus 2.6 cambia questa situazione con la <a href="https://milvus.io/blog/bring-vector-compression-to-the-extreme-how-milvus-serves-3%C3%97-more-queries-with-rabitq.md">quantizzazione a 1 bit RaBitQ</a> combinata con un meccanismo di raffinamento intelligente.</p>
<p>Il nuovo indice IVF_RABITQ comprime l'indice principale a 1/32 della sua dimensione originale grazie alla quantizzazione a 1 bit. Utilizzato insieme a un raffinamento opzionale SQ8, questo approccio mantiene un'elevata qualità di ricerca (95% di richiamo) utilizzando solo 1/4 dell'ingombro di memoria originale.</p>
<p>I nostri benchmark preliminari rivelano risultati promettenti:</p>
<table>
<thead>
<tr><th><strong>Metriche di prestazione</strong></th><th><strong>Tradizionale IVF_FLAT</strong></th><th><strong>Solo RaBitQ (1 bit)</strong></th><th><strong>RaBitQ (1 bit) + SQ8 Raffinare</strong></th></tr>
</thead>
<tbody>
<tr><td>Impronta di memoria</td><td>100% (linea di base)</td><td>3% (riduzione del 97%)</td><td>28% (riduzione del 72%)</td></tr>
<tr><td>Richiamo</td><td>95.2%</td><td>76.3%</td><td>94.9%</td></tr>
<tr><td>Velocità di ricerca (QPS)</td><td>236</td><td>648 (2,7 volte più veloce)</td><td>946 (4 volte più veloce)</td></tr>
</tbody>
</table>
<p><em>Tabella: Valutazione di VectorDBBench con 1M di vettori di 768 dimensioni, testati su AWS m6id.2xlarge</em></p>
<p>Il vero punto di forza non è solo la riduzione del 72% della memoria, ma il fatto di ottenere un miglioramento del throughput di 4 volte. Ciò significa che è possibile servire lo stesso carico di lavoro con il 75% di server in meno o gestire un traffico 4 volte superiore sull'infrastruttura esistente, il tutto senza sacrificare il richiamo.</p>
<p>Per gli utenti aziendali che utilizzano Milvus completamente gestito su<a href="https://zilliz.com/cloud"> Zilliz Cloud</a>, stiamo sviluppando una strategia automatizzata che regola dinamicamente i parametri RaBitQ in base alle caratteristiche specifiche del carico di lavoro e ai requisiti di precisione. Potrete semplicemente godere di una maggiore efficienza in termini di costi su tutti i tipi di CU di Zilliz Cloud.</p>
<h3 id="Hot-Cold-Tiered-Storage-50-Cost-Reduction-Through-Intelligent-Data-Placement" class="common-anchor-header">Storage a livelli caldo-freddo: 50% di riduzione dei costi grazie al posizionamento intelligente dei dati</h3><p>I carichi di lavoro di ricerca vettoriale del mondo reale contengono dati con schemi di accesso molto diversi. I dati ad accesso frequente necessitano di una disponibilità immediata, mentre i dati di archivio possono tollerare una latenza leggermente superiore in cambio di costi di archiviazione nettamente inferiori.</p>
<p>Milvus 2.6 introduce un'architettura di archiviazione a livelli che classifica automaticamente i dati in base ai modelli di accesso e li colloca nei livelli di archiviazione appropriati:</p>
<ul>
<li><p><strong>Classificazione intelligente dei dati</strong>: Milvus identifica automaticamente i segmenti di dati caldi (a cui si accede frequentemente) e freddi (a cui si accede raramente) in base ai modelli di accesso.</p></li>
<li><p><strong>Posizionamento ottimizzato dello storage</strong>: I dati caldi rimangono nella memoria/SSD ad alte prestazioni, mentre i dati freddi vengono spostati in uno storage a oggetti più economico.</p></li>
<li><p><strong>Spostamento dinamico dei dati</strong>: Quando i modelli di utilizzo cambiano, i dati migrano automaticamente da un livello all'altro.</p></li>
<li><p><strong>Recupero trasparente</strong>: Quando le query toccano i dati freddi, questi vengono automaticamente caricati su richiesta.</p></li>
</ul>
<p>Il risultato è una riduzione fino al 50% dei costi di storage, mantenendo le prestazioni delle query per i dati attivi.</p>
<h3 id="Additional-Cost-Optimizations" class="common-anchor-header">Ulteriori ottimizzazioni dei costi</h3><p>Milvus 2.6 introduce anche il supporto del vettore Int8 per gli indici HNSW, il formato Storage v2 per una struttura ottimizzata che riduce gli IOPS e i requisiti di memoria e una più facile installazione direttamente tramite i gestori di pacchetti APT/YUM.</p>
<h2 id="Advanced-Search-Capabilities-Beyond-Basic-Vector-Similarity" class="common-anchor-header">Capacità di ricerca avanzate: Oltre la somiglianza vettoriale di base<button data-href="#Advanced-Search-Capabilities-Beyond-Basic-Vector-Similarity" class="anchor-icon" translate="no">
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
    </button></h2><p>La ricerca vettoriale da sola non è sufficiente per le moderne applicazioni di intelligenza artificiale. Gli utenti richiedono la precisione del recupero tradizionale delle informazioni combinata con la comprensione semantica delle incorporazioni vettoriali. Milvus 2.6 introduce una serie di funzioni di ricerca avanzate che colmano questo divario.</p>
<h3 id="Turbocharged-BM25-400-Faster-Full-Text-Search-Than-Elasticsearch" class="common-anchor-header">BM25 turbo: ricerca full-text più veloce del 400% rispetto a Elasticsearch</h3><p>La<a href="https://milvus.io/blog/full-text-search-in-milvus-what-is-under-the-hood.md">ricerca full-text</a> è diventata essenziale per la costruzione di sistemi di recupero ibridi in database vettoriali. In Milvus 2.6 sono stati apportati significativi miglioramenti alle prestazioni della ricerca full-text, basandosi sull'implementazione BM25 introdotta dalla versione 2.5. Ad esempio, questa versione introduce nuovi parametri come <code translate="no">drop_ratio_search</code> e <code translate="no">dim_max_score_ratio</code>, migliorando la precisione e la velocità di regolazione e offrendo controlli di ricerca più precisi.</p>
<p>I nostri benchmark con il dataset BEIR, standard del settore, mostrano che Milvus 2.6 raggiunge un throughput 3-4 volte superiore a Elasticsearch con tassi di richiamo equivalenti. Per carichi di lavoro specifici, il miglioramento raggiunge un QPS 7 volte superiore.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/milvus_vs_ES_when_QPS_with_top_K1000_cadd1ac921.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="JSON-Path-Index-100x-Faster-Filtering" class="common-anchor-header">Indice dei percorsi JSON: Filtraggio 100 volte più veloce</h3><p>Milvus supporta da tempo il tipo di dati JSON, ma il filtraggio sui campi JSON era lento a causa della mancanza del supporto dell'indice. Milvus 2.6 aggiunge il supporto per l'indice di percorso JSON per aumentare notevolmente le prestazioni.</p>
<p>Consideriamo un database di profili utente in cui ogni record contiene metadati annidati come:</p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;user&quot;</span>: {
    <span class="hljs-string">&quot;location&quot;</span>: {
      <span class="hljs-string">&quot;city&quot;</span>: <span class="hljs-string">&quot;San Francisco&quot;</span>,
      <span class="hljs-string">&quot;country&quot;</span>: <span class="hljs-string">&quot;USA&quot;</span>
    },
    <span class="hljs-string">&quot;interests&quot;</span>: [<span class="hljs-string">&quot;AI&quot;</span>, <span class="hljs-string">&quot;Databases&quot;</span>, <span class="hljs-string">&quot;Cloud Computing&quot;</span>]
  },
  <span class="hljs-string">&quot;subscription&quot;</span>: {
    <span class="hljs-string">&quot;plan&quot;</span>: <span class="hljs-string">&quot;enterprise&quot;</span>,
    <span class="hljs-string">&quot;status&quot;</span>: <span class="hljs-string">&quot;active&quot;</span>
  }
}
<button class="copy-code-btn"></button></code></pre>
<p>Per una ricerca semantica "utenti interessati all'intelligenza artificiale" con ambito solo San Francisco, Milvus doveva analizzare e valutare l'intero oggetto JSON per ogni record, rendendo la query molto costosa e lenta.</p>
<p>Ora Milvus consente di creare indici su percorsi specifici all'interno dei campi JSON per accelerare la ricerca:</p>
<pre><code translate="no">index_params.add_index(
    field_name=<span class="hljs-string">&quot;metadata&quot;</span>,
    index_type=<span class="hljs-string">&quot;INVERTED&quot;</span>,
    index_name=<span class="hljs-string">&quot;json_index&quot;</span>,
    <span class="hljs-keyword">params</span>={
        <span class="hljs-string">&quot;json_path&quot;</span>: <span class="hljs-string">&quot;metadata[\&quot;user\&quot;][\&quot;location\&quot;][\&quot;city\&quot;]&quot;</span>,  
        <span class="hljs-string">&quot;json_cast_type&quot;</span>: <span class="hljs-string">&quot;varchar&quot;</span>
    }
<button class="copy-code-btn"></button></code></pre>
<p>Nei nostri test sulle prestazioni con oltre 100 milioni di record, l'indice dei percorsi JSON ha ridotto la latenza del filtro da <strong>140 ms</strong> (P99: 480 ms) a soli <strong>1,5 ms</strong> (P99: 10 ms), con una riduzione della latenza del 99% che rende queste ricerche pratiche in produzione.</p>
<p>Questa caratteristica è particolarmente preziosa per:</p>
<ul>
<li><p>sistemi di raccomandazione con un complesso filtraggio degli attributi dell'utente</p></li>
<li><p>applicazioni RAG che filtrano i documenti in base ai metadati</p></li>
<li><p>Sistemi multi-tenant in cui la segmentazione dei dati è fondamentale.</p></li>
</ul>
<h3 id="Enhanced-Text-Processing-and-Time-Aware-Search" class="common-anchor-header">Elaborazione del testo migliorata e ricerca consapevole del tempo</h3><p>Milvus 2.6 introduce una pipeline di analisi del testo completamente rinnovata con una gestione linguistica sofisticata, che include il tokenizer Lindera per il giapponese e il coreano, il tokenizer ICU per un supporto multilingue completo e Jieba migliorato con l'integrazione di dizionari personalizzati.</p>
<p><strong>Phrase Match Intelligence</strong> cattura le sfumature semantiche nell'ordine delle parole, distinguendo tra &quot;tecniche di apprendimento automatico&quot; e &quot;tecniche di apprendimento automatico&quot;:</p>
<pre><code translate="no"><span class="hljs-title function_">PHRASE_MATCH</span>(document_text, <span class="hljs-string">&quot;artificial intelligence research&quot;</span>, slop=<span class="hljs-number">1</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Le<strong>funzioni di decadimento Time-Aware</strong> danno automaticamente priorità ai contenuti freschi regolando i punteggi di rilevanza in base all'età dei documenti, con tassi di decadimento e tipi di funzione configurabili (esponenziale, gaussiana o lineare).</p>
<h3 id="Streamlined-Search-Data-in-Data-Out-Experience" class="common-anchor-header">Ricerca semplificata: Esperienza di ingresso e uscita dei dati</h3><p>La disconnessione tra i dati grezzi e le incorporazioni vettoriali è un altro punto dolente per gli sviluppatori che utilizzano database vettoriali. Prima che i dati arrivino a Milvus per l'indicizzazione e la ricerca vettoriale, spesso vengono sottoposti a una pre-elaborazione tramite modelli esterni che convertono testo, immagini o audio grezzi in rappresentazioni vettoriali. Dopo il recupero, è necessaria un'ulteriore elaborazione a valle, come la mappatura degli ID dei risultati al contenuto originale.</p>
<p>Milvus 2.6 semplifica questi flussi di lavoro di embedding con la nuova interfaccia <strong>Function</strong> che integra i modelli di embedding di terze parti direttamente nella pipeline di ricerca. Invece di pre-compilare le incorporazioni, ora è possibile:</p>
<ol>
<li><p><strong>Inserire direttamente i dati grezzi</strong>: Inviare testo, immagini o altri contenuti a Milvus.</p></li>
<li><p><strong>Configurare i fornitori di incorporazioni</strong>: Collegarsi ai servizi API di embedding di OpenAI, AWS Bedrock, Google Vertex AI, Hugging Face e altri ancora.</p></li>
<li><p><strong>Interrogazione in linguaggio naturale</strong>: Ricerca direttamente con query di testo grezzo</p></li>
</ol>
<p>Questo crea un'esperienza "Data-In, Data-Out" in cui Milvus ottimizza tutte le trasformazioni vettoriali dietro le quinte.</p>
<h2 id="Architectural-Evolution-Scaling-to-Tens-of-Billions-of-Vectors" class="common-anchor-header">Evoluzione architettonica: Scalare a decine di miliardi di vettori<button data-href="#Architectural-Evolution-Scaling-to-Tens-of-Billions-of-Vectors" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.6 introduce innovazioni architettoniche fondamentali che consentono di scalare in modo conveniente fino a decine di miliardi di vettori.</p>
<h3 id="Replacing-Kafka-and-Pulsar-with-a-New-Woodpecker-WAL" class="common-anchor-header">Sostituzione di Kafka e Pulsar con un nuovo WAL Woodpecker</h3><p>Le precedenti implementazioni di Milvus si affidavano a code di messaggi esterne, come Kafka o Pulsar, come sistema WAL (Write-Ahead Log). Sebbene questi sistemi abbiano inizialmente funzionato bene, hanno introdotto una notevole complessità operativa e un sovraccarico di risorse.</p>
<p>Milvus 2.6 introduce <a href="https://milvus.io/blog/we-replaced-kafka-pulsar-with-a-woodpecker-for-milvus.md"><strong>Woodpecker</strong></a>, un sistema WAL cloud-native appositamente costruito che elimina queste dipendenze esterne grazie a un design rivoluzionario a zero dischi:</p>
<ul>
<li><p><strong>Tutto sullo storage a oggetti</strong>: Tutti i dati di log sono memorizzati in uno storage a oggetti come S3, Google Cloud Storage o MinIO.</p></li>
<li><p><strong>Metadati distribuiti</strong>: I metadati sono ancora gestiti dal key-value store etcd.</p></li>
<li><p><strong>Nessuna dipendenza dal disco locale</strong>: Una scelta per eliminare l'architettura complessa e l'overhead operativo che comporta lo stato permanente locale distribuito.</p></li>
</ul>
<p>Abbiamo eseguito benchmark completi per confrontare le prestazioni di Woodpecker:</p>
<table>
<thead>
<tr><th><strong>Sistema</strong></th><th><strong>Kafka</strong></th><th><strong>Pulsar</strong></th><th><strong>WP MinIO</strong></th><th><strong>WP Locale</strong></th><th><strong>WP S3</strong></th></tr>
</thead>
<tbody>
<tr><td>Velocità di trasmissione</td><td>129,96 MB/s</td><td>107 MB/s</td><td>71 MB/s</td><td>450 MB/s</td><td>750 MB/s</td></tr>
<tr><td>Latenza</td><td>58 ms</td><td>35 ms</td><td>184 ms</td><td>1,8 ms</td><td>166 ms</td></tr>
</tbody>
</table>
<p>Woodpecker raggiunge costantemente il 60-80% del throughput massimo teorico per ogni backend di storage, con la modalità file system locale che raggiunge 450 MB/s - 3,5 volte più veloce di Kafka - e la modalità S3 che raggiunge 750 MB/s, 5,8 volte superiore a Kafka.</p>
<p>Per maggiori dettagli su Woodpecker, consultate questo blog: <a href="https://milvus.io/blog/we-replaced-kafka-pulsar-with-a-woodpecker-for-milvus.md">Abbiamo sostituito Kafka/Pulsar con Woodpecker per Milvus</a>.</p>
<h3 id="Search-Freshness-Achieved-Economically" class="common-anchor-header">Freschezza della ricerca ottenuta in modo economico</h3><p>La ricerca mission-critical di solito richiede che i dati appena ingeriti siano immediatamente ricercabili. Milvus 2.6 sostituisce la dipendenza dalle code di messaggi per migliorare radicalmente la gestione degli aggiornamenti freschi e garantire la freschezza della ricerca con un minore sovraccarico di risorse. La nuova architettura aggiunge il nuovo <strong>Streaming Node</strong>, un componente dedicato che lavora in stretto coordinamento con altri componenti di Milvus come il Query Node e il Data Node. Lo Streaming Node è costruito sulla base di Woodpecker, il nostro sistema leggero e cloud-native Write-Ahead Log (WAL).</p>
<p>Questo nuovo componente consente:</p>
<ul>
<li><p><strong>Grande compatibilità</strong>: Funziona con il nuovo WAL Woodpecker ed è retrocompatibile con Kafka, Pulsar e altre piattaforme di streaming.</p></li>
<li><p><strong>Indicizzazione incrementale</strong>: I nuovi dati diventano immediatamente ricercabili, senza ritardi di batch</p></li>
<li><p><strong>Servizio continuo di query</strong>: Ingestione simultanea ad alta velocità e interrogazione a bassa latenza.</p></li>
</ul>
<p>Isolando lo streaming dall'elaborazione batch, lo Streaming Node aiuta Milvus a mantenere prestazioni stabili e freschezza di ricerca anche durante l'ingestione di grandi volumi di dati. È stato progettato tenendo conto della scalabilità orizzontale, scalando dinamicamente la capacità del nodo in base al throughput dei dati.</p>
<h3 id="Enhanced-Multi-tenancy-Capability-Scaling-to-100k-Collections-Per-Cluster" class="common-anchor-header">Capacità multitenancy migliorata: Scalabilità fino a 100k collezioni per cluster</h3><p>Le implementazioni aziendali spesso richiedono l'isolamento a livello di tenancy. Milvus 2.6 aumenta notevolmente il supporto multi-tenancy, consentendo fino a <strong>100.000 collezioni</strong> per cluster. Si tratta di un miglioramento fondamentale per le organizzazioni che gestiscono un cluster monolitico di grandi dimensioni che serve molti tenant.</p>
<p>Questo miglioramento è reso possibile da numerose ottimizzazioni ingegneristiche sulla gestione dei metadati, sull'allocazione delle risorse e sulla pianificazione delle query. Gli utenti di Milvus possono ora godere di prestazioni stabili anche con decine di migliaia di collezioni.</p>
<h3 id="Other-Improvements" class="common-anchor-header">Altri miglioramenti</h3><p>Milvus 2.6 offre ulteriori miglioramenti architettonici, come CDC + BulkInsert per una replica semplificata dei dati tra regioni geografiche e Coord Merge per un migliore coordinamento dei cluster nelle distribuzioni su larga scala.</p>
<h2 id="Getting-Started-with-Milvus-26" class="common-anchor-header">Come iniziare con Milvus 2.6<button data-href="#Getting-Started-with-Milvus-26" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.6 rappresenta un enorme sforzo ingegneristico con decine di nuove funzionalità e ottimizzazioni delle prestazioni, sviluppate in collaborazione dagli ingegneri di Zilliz e dai nostri straordinari collaboratori della comunità. Anche se qui abbiamo trattato le caratteristiche principali, c'è molto altro da scoprire. Consigliamo vivamente di immergersi nelle nostre <a href="https://milvus.io/docs/release_notes.md">note di rilascio</a> complete per esplorare tutto ciò che questa release ha da offrire!</p>
<p>La documentazione completa, le guide alla migrazione e le esercitazioni sono disponibili sul<a href="https://milvus.io/"> sito web</a> di<a href="https://milvus.io/"> Milvus</a>. Per le domande e il supporto della comunità, iscrivetevi al nostro<a href="https://discord.com/invite/8uyFbECzPX"> canale Discord</a> o inviate problemi su<a href="https://github.com/milvus-io/milvus"> GitHub</a>.</p>
