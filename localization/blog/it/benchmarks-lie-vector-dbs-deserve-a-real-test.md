---
id: benchmarks-lie-vector-dbs-deserve-a-real-test.md
title: I benchmark mentono - I DB vettoriali meritano un test reale
author: Min Tian
date: 2025-05-14T00:00:00.000Z
desc: >-
  Scoprite il divario di prestazioni dei database vettoriali con VDBBench. Il
  nostro strumento esegue test in scenari di produzione reali, assicurando che
  le applicazioni AI funzionino senza problemi e senza tempi di inattività
  imprevisti.
cover: >-
  assets.zilliz.com/Benchmarks_Lie_Vector_D_Bs_Deserve_a_Real_Test_9280c66efc.png
tag: Engineering
recommend: true
publishToMedium: true
tags: 'Milvus, vector database, vector search, AI Agents, LLM'
meta_keywords: >-
  Vector database, vectordbbench, vector database benchmark, vector search
  performance
meta_title: |
  Benchmarks Lie — Vector DBs Deserve a Real Test
origin: 'https://milvus.io/blog/benchmarks-lie-vector-dbs-deserve-a-real-test.md'
---
<h2 id="The-Vector-Database-You-Chose-Based-on-Benchmarks-Might-Fail-in-Production" class="common-anchor-header">Il database vettoriale scelto sulla base dei benchmark potrebbe fallire in produzione<button data-href="#The-Vector-Database-You-Chose-Based-on-Benchmarks-Might-Fail-in-Production" class="anchor-icon" translate="no">
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
    </button></h2><p>Quando si sceglie un <a href="https://milvus.io/blog/what-is-a-vector-database.md">database vettoriale</a> per la propria applicazione di intelligenza artificiale, i benchmark convenzionali sono come provare un'auto sportiva su una pista vuota, per poi scoprire che si blocca nel traffico dell'ora di punta. La scomoda verità? La maggior parte dei benchmark valuta le prestazioni solo in condizioni artificiali che non esistono mai negli ambienti di produzione.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Benchmarks_Lie_Vector_D_Bs_Deserve_a_Real_Test_9280c66efc.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>La maggior parte dei benchmark testa i database vettoriali <strong>dopo che</strong> tutti i dati sono stati ingeriti e l'indice è stato completamente costruito. Ma in produzione i dati non smettono mai di fluire. Non è possibile mettere in pausa il sistema per ore per ricostruire un indice.</p>
<p>Abbiamo visto la disconnessione in prima persona. Ad esempio, Elasticsearch può vantare una velocità di interrogazione di millisecondi, ma dietro le quinte abbiamo visto che impiega <strong>oltre 20 ore</strong> solo per ottimizzare il suo indice. È un tempo di inattività che nessun sistema di produzione può permettersi, soprattutto per i carichi di lavoro di intelligenza artificiale che richiedono aggiornamenti continui e risposte immediate.</p>
<p>Con Milvus, dopo aver eseguito innumerevoli valutazioni Proof of Concept (PoC) con clienti aziendali, abbiamo scoperto uno schema preoccupante: i <strong>database vettoriali che eccellono in ambienti di laboratorio controllati spesso faticano sotto i carichi di produzione reali.</strong> Questa lacuna critica non frustra solo gli ingegneri dell'infrastruttura, ma può far deragliare intere iniziative di AI costruite su queste promesse ingannevoli di prestazioni.</p>
<p>Ecco perché abbiamo creato <a href="https://github.com/zilliztech/VectorDBBench">VDBBench</a>: un benchmark open source progettato da zero per simulare la realtà produttiva. A differenza dei test sintetici che selezionano gli scenari, VDBBench sottopone i database a un'ingestione continua, a condizioni di filtraggio rigorose e a scenari diversi, proprio come i carichi di lavoro di produzione reali. La nostra missione è semplice: offrire agli ingegneri uno strumento che mostri le prestazioni effettive dei database vettoriali in condizioni reali, in modo da poter prendere decisioni sull'infrastruttura basate su numeri affidabili.</p>
<h2 id="The-Gap-between-Benchmarks-and-Reality" class="common-anchor-header">Il divario tra benchmark e realtà<button data-href="#The-Gap-between-Benchmarks-and-Reality" class="anchor-icon" translate="no">
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
    </button></h2><p>Gli approcci tradizionali ai benchmark soffrono di tre difetti critici che rendono i loro risultati praticamente privi di significato per il processo decisionale in produzione:</p>
<h3 id="1-Outdated-Data" class="common-anchor-header">1. Dati obsoleti</h3><p>Molti benchmark si basano ancora su set di dati obsoleti come SIFT o<a href="https://zilliz.com/glossary/glove"> GloVe</a>, che hanno poca somiglianza con le odierne complesse incorporazioni vettoriali ad alta dimensionalità generate dai modelli di intelligenza artificiale. Si consideri questo: SIFT contiene vettori a 128 dimensioni, mentre gli embedding più diffusi dei modelli di embedding di OpenAI vanno da 768 a 3072 dimensioni.</p>
<h3 id="2-Vanity-Metrics" class="common-anchor-header">2. Metriche banali</h3><p>Molti benchmark si concentrano esclusivamente sulla latenza media o sul picco di QPS, creando un quadro distorto. Queste metriche idealizzate non riescono a catturare i valori anomali e le incongruenze che gli utenti reali sperimentano negli ambienti di produzione. Ad esempio, a cosa serve un numero impressionante di QPS se richiede risorse computazionali illimitate che manderebbero in bancarotta la vostra organizzazione?</p>
<h3 id="3-Oversimplified-Scenarios" class="common-anchor-header">3. Scenari eccessivamente semplificati</h3><p>La maggior parte dei benchmark testa solo carichi di lavoro statici e di base, in pratica il "Hello World" della ricerca vettoriale. Ad esempio, emettono richieste di ricerca solo dopo che l'intero set di dati è stato ingerito e indicizzato, ignorando la realtà dinamica in cui gli utenti effettuano ricerche mentre arrivano nuovi dati. Questo design semplicistico non tiene conto dei modelli complessi che definiscono i sistemi di produzione reali, come le query simultanee, le ricerche filtrate e l'ingestione continua di dati.</p>
<p>Riconoscendo questi difetti, ci siamo resi conto che il settore aveva bisogno di un <strong>cambiamento radicale nella filosofia dei benchmark,</strong>basata sul comportamento reale dei sistemi di intelligenza artificiale. Ecco perché abbiamo creato <a href="https://github.com/zilliztech/VectorDBBench">VDBBench</a>.</p>
<h2 id="From-Lab-to-Production-How-VDBBench-Bridges-the-Gap" class="common-anchor-header">Dal laboratorio alla produzione: Come VDBBench colma il divario<button data-href="#From-Lab-to-Production-How-VDBBench-Bridges-the-Gap" class="anchor-icon" translate="no">
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
    </button></h2><p>VDBBench non si limita a riproporre filosofie di benchmarking ormai superate, ma ricostruisce il concetto di benchmarking da zero con un'unica convinzione: <strong>un benchmark ha valore solo se predice il comportamento effettivo in produzione</strong>.</p>
<p>Abbiamo progettato VDBBench per replicare fedelmente le condizioni del mondo reale in tre dimensioni critiche: autenticità dei dati, modelli di carico di lavoro e misurazione delle prestazioni.</p>
<h3 id="Modernizing-the-Dataset" class="common-anchor-header">Modernizzazione del dataset</h3><p>Abbiamo completamente rinnovato i set di dati utilizzati per il benchmarking di vectorDB. Invece di set di test tradizionali come SIFT e GloVe, VDBBench utilizza vettori generati da modelli di incorporamento all'avanguardia che alimentano le applicazioni AI di oggi.</p>
<p>Per garantire la pertinenza, soprattutto per casi d'uso come la Retrieval-Augmented Generation (RAG), abbiamo selezionato corpora che riflettono scenari aziendali reali e specifici del dominio. Si va da basi di conoscenza generiche ad applicazioni verticali come la risposta a domande biomediche e la ricerca web su larga scala.</p>
<table>
<thead>
<tr><th></th><th></th><th></th><th></th></tr>
</thead>
<tbody>
<tr><td><strong>Corpus</strong></td><td><strong>Modello di incorporazione</strong></td><td><strong>Dimensioni</strong></td><td><strong>Dimensioni</strong></td></tr>
<tr><td>Wikipedia</td><td>Cohere V2</td><td>768</td><td>1M / 10M</td></tr>
<tr><td>BioASQ</td><td>Cohere V3</td><td>1024</td><td>1M / 10M</td></tr>
<tr><td>C4</td><td>OpenAI</td><td>1536</td><td>500K / 5M</td></tr>
<tr><td>MSMarco V2</td><td>udever-bloom-1b1</td><td>1536</td><td>1M / 10M / 138M</td></tr>
</tbody>
</table>
<p>Tabella: Set di dati utilizzati in VDBBench</p>
<p>VDBBench supporta anche set di dati personalizzati, consentendovi di eseguire il benchmark con i vostri dati generati da modelli di incorporazione specifici per i vostri carichi di lavoro specifici. Dopo tutto, nessun set di dati racconta una storia migliore dei vostri dati di produzione.</p>
<h3 id="Production-Focused-Metric-Design" class="common-anchor-header">Design delle metriche orientato alla produzione</h3><p><strong>VDBBench privilegia le metriche che riflettono le prestazioni del mondo reale, non solo i risultati di laboratorio.</strong> Abbiamo riprogettato i benchmark in base a ciò che conta davvero negli ambienti di produzione: affidabilità sotto carico, latenza di coda, throughput sostenuto e precisione.</p>
<ul>
<li><p><strong>Latenza P95/P99 per misurare l'esperienza reale degli utenti</strong>: La latenza media/mediana maschera i valori anomali che frustrano gli utenti reali. Ecco perché VDBBench si concentra sulla latenza di coda, come P95/P99, rivelando le prestazioni che il 95% o il 99% delle query raggiungerà effettivamente.</p></li>
<li><p><strong>Produttività sostenibile sotto carico:</strong> Un sistema che funziona bene per 5 secondi non è sufficiente per la produzione. VDBBench aumenta gradualmente la concorrenza per trovare le query massime sostenibili al secondo del vostro database (<code translate="no">max_qps</code>), non il numero massimo in condizioni ideali e brevi. Questo mostra la capacità del sistema di resistere nel tempo.</p></li>
<li><p><strong>Richiamo bilanciato con le prestazioni:</strong> La velocità senza l'accuratezza non ha senso. Ogni numero di prestazioni in VDBBench è abbinato al richiamo, in modo da sapere esattamente quanta rilevanza si sta scambiando con il throughput. Ciò consente di effettuare confronti equi e paragonabili tra sistemi con compromessi interni molto diversi.</p></li>
</ul>
<h3 id="Test-Methodology-That-Reflects-Reality" class="common-anchor-header">Metodologia di test che riflette la realtà</h3><p>Un'innovazione chiave nel design di VDBBench è la <strong>separazione tra test seriali e concomitanti</strong>, che aiuta a cogliere il comportamento dei sistemi sotto diversi tipi di carico. Ad esempio, le metriche di latenza sono suddivise come segue:</p>
<ul>
<li><p><code translate="no">serial_latency_p99</code> misura le prestazioni del sistema in condizioni di carico minimo, in cui viene elaborata una sola richiesta alla volta. Questo rappresenta lo <em>scenario migliore per</em> la latenza.</p></li>
<li><p><code translate="no">conc_latency_p99</code> cattura il comportamento del sistema in <em>condizioni realistiche di alta frequenza</em>, in cui più richieste arrivano simultaneamente.</p></li>
</ul>
<h3 id="Two-Benchmark-Phases" class="common-anchor-header">Due fasi di benchmark</h3><p>VDBBench separa i test in due fasi cruciali:</p>
<ol>
<li><strong>Test seriale</strong></li>
</ol>
<p>Si tratta di un'esecuzione a processo singolo di 1.000 query. Questa fase stabilisce una linea di base per le prestazioni e l'accuratezza ideali, riportando sia <code translate="no">serial_latency_p99</code> che recall.</p>
<ol start="2">
<li><strong>Test di concorrenza</strong></li>
</ol>
<p>Questa fase simula un ambiente di produzione con un carico sostenuto.</p>
<ul>
<li><p><strong>Simulazione realistica del client</strong>: Ogni processo di test opera in modo indipendente con la propria connessione e il proprio set di query. In questo modo si evita l'interferenza dello stato condiviso (ad esempio, della cache) che potrebbe distorcere i risultati.</p></li>
<li><p><strong>Avvio sincronizzato</strong>: Tutti i processi iniziano simultaneamente, assicurando che il QPS misurato rifletta accuratamente il livello di concurrency dichiarato.</p></li>
</ul>
<p>Questi metodi attentamente strutturati garantiscono che i valori di <code translate="no">max_qps</code> e <code translate="no">conc_latency_p99</code> riportati da VDBBench siano <strong>accurati e rilevanti per la produzione</strong>, fornendo indicazioni significative per la pianificazione della capacità produttiva e la progettazione del sistema.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_QPS_and_Latency_of_Milvus_16c64g_standalone_at_Varying_Concurrency_Levels_Cohere_1_M_Test_7f2294e87a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figura: QPS e latenza di Milvus-16c64g-standalone a diversi livelli di concorrenza (test Cohere 1M). In questo test, Milvus è inizialmente sottoutilizzato fino al</em> <strong><em>livello di concorrenza 20</em></strong><em>. Aumentando la concorrenza si migliora l'utilizzo del sistema e si ottiene un QPS più elevato. Oltre il livello</em> <strong><em>di concurrency 20</em></strong><em>, il sistema raggiunge il pieno carico: ulteriori aumenti di concurrency non migliorano più il throughput e la latenza aumenta a causa dei ritardi di accodamento.</em></p>
<h2 id="Beyond-Searching-Static-Data-The-Real-Production-Scenarios" class="common-anchor-header">Oltre la ricerca di dati statici: Gli scenari reali di produzione<button data-href="#Beyond-Searching-Static-Data-The-Real-Production-Scenarios" class="anchor-icon" translate="no">
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
    </button></h2><p>Per quanto ne sappiamo, VDBBench è l'unico strumento di benchmark che testa i database vettoriali attraverso l'intero spettro di scenari critici per la produzione, compresi i casi di raccolta statica, filtraggio e streaming.</p>
<h3 id="Static-Collection" class="common-anchor-header">Raccolta statica</h3><p>A differenza di altri benchmark che si affrettano a eseguire i test, VDBBench si assicura innanzitutto che ogni database abbia ottimizzato completamente gli indici, un prerequisito critico per la produzione che molti benchmark spesso trascurano. In questo modo si ottiene un quadro completo:</p>
<ul>
<li><p>Tempo di ingestione dei dati</p></li>
<li><p>Tempo di indicizzazione (il tempo impiegato per costruire un indice ottimizzato, che influisce notevolmente sulle prestazioni di ricerca)</p></li>
<li><p>Prestazioni di ricerca su indici completamente ottimizzati, sia in condizioni seriali che simultanee.</p></li>
</ul>
<h3 id="Filtering" class="common-anchor-header">Filtraggio</h3><p>La ricerca vettoriale in produzione raramente avviene in modo isolato. Le applicazioni reali combinano la similarità vettoriale con il filtraggio dei metadati ("trova le scarpe che assomigliano a questa foto ma costano meno di 100 dollari"). Questa ricerca vettoriale filtrata crea sfide uniche:</p>
<ul>
<li><p><strong>Complessità del filtro</strong>: Un maggior numero di colonne scalari e di condizioni logiche aumenta la richiesta di calcolo.</p></li>
<li><p><strong>Selettività del filtro</strong>: <a href="https://milvus.io/blog/how-to-filter-efficiently-without-killing-recall.md">La nostra esperienza di produzione</a> rivela che questo è il killer nascosto delle prestazioni: la velocità delle query può fluttuare di ordini di grandezza a seconda della selettività dei filtri.</p></li>
</ul>
<p>VDBBench valuta sistematicamente le prestazioni dei filtri a vari livelli di selettività (dal 50% al 99,9%), fornendo un profilo completo di come i database gestiscono questo modello di produzione critico.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_QPS_and_Recall_of_Milvus_and_Open_Search_Across_Different_Filter_Selectivity_Levels_Cohere_1_M_Test_4b5df2244d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figura: QPS e Recall di Milvus e OpenSearch attraverso diversi livelli di selettività dei filtri (test Cohere 1M). L'asse X rappresenta la percentuale di dati filtrati. Come si vede, Milvus mantiene un richiamo costantemente elevato su tutti i livelli di selettività dei filtri, mentre OpenSearch mostra prestazioni instabili, con un richiamo che fluttua significativamente in diverse condizioni di filtraggio.</em></p>
<h3 id="Streaming" class="common-anchor-header">Streaming</h3><p>I sistemi di produzione raramente possono permettersi il lusso di avere dati statici. Durante l'esecuzione delle ricerche, le nuove informazioni affluiscono continuamente: uno scenario che fa crollare molti database altrimenti impressionanti.</p>
<p>L'esclusivo caso di test di streaming di VDBBench esamina le prestazioni della ricerca durante l'inserimento, misurando:</p>
<ol>
<li><p><strong>Impatto dell'aumento del volume dei dati</strong>: Come le prestazioni di ricerca si adattano all'aumento delle dimensioni dei dati.</p></li>
<li><p><strong>Impatto del carico di scrittura</strong>: come le scritture simultanee influenzano la latenza e il throughput della ricerca, dato che le scritture consumano anche risorse di CPU o di memoria nel sistema.</p></li>
</ol>
<p>Gli scenari di streaming rappresentano uno stress test completo per qualsiasi database vettoriale. Ma costruire un benchmark <em>corretto</em> per questo non è banale. Non è sufficiente descrivere il comportamento di un sistema, ma occorre un modello di valutazione coerente che consenta di effettuare <strong>confronti tra</strong> database diversi.</p>
<p>Grazie alla nostra esperienza nell'aiutare le aziende con implementazioni reali, abbiamo costruito un approccio strutturato e ripetibile. Con VDBBench:</p>
<ul>
<li><p>Si <strong>definisce un tasso di inserimento fisso</strong> che rispecchia il carico di lavoro di produzione.</p></li>
<li><p>VDBBench applica quindi una <strong>pressione di carico identica</strong> su tutti i sistemi, assicurando che i risultati delle prestazioni siano direttamente comparabili.</p></li>
</ul>
<p>Ad esempio, con un dataset Cohere da 10 milioni e un obiettivo di ingestione di 500 righe al secondo:</p>
<ul>
<li><p>VDBBench avvia 5 processi produttori paralleli, ciascuno dei quali inserisce 100 righe al secondo.</p></li>
<li><p>Dopo ogni 10% di dati ingeriti, VDBBench avvia un ciclo di test di ricerca in condizioni sia seriali che simultanee.</p></li>
<li><p>Metriche quali latenza, QPS e richiamo vengono registrate dopo ogni fase.</p></li>
</ul>
<p>Questa metodologia controllata rivela l'evoluzione delle prestazioni di ciascun sistema nel tempo e in condizioni di reale stress operativo, fornendo le informazioni necessarie per prendere decisioni sull'infrastruttura in grado di scalare.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/igure_QPS_and_Recall_of_Pinecone_vs_Elasticsearch_in_the_Cohere_10_M_Streaming_Test_500_rows_s_Ingestion_Rate_548fc02f24.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figura: QPS e Recall di Pinecone rispetto a Elasticsearch nel test di streaming Cohere 10M (velocità di ingestione di 500 righe/s). Pinecone ha mantenuto QPS e recall più elevati, mostrando un miglioramento significativo del QPS dopo l'inserimento del 100% dei dati.</em></p>
<p>Ma questa non è la fine della storia. VDBBench si spinge oltre, supportando una fase di ottimizzazione opzionale che consente agli utenti di confrontare le prestazioni della ricerca in streaming prima e dopo l'ottimizzazione dell'indice. Inoltre, traccia e riporta il tempo effettivo trascorso in ogni fase, offrendo una visione più approfondita dell'efficienza e del comportamento del sistema in condizioni di produzione.</p>
<p><span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_QPS_and_Recall_of_Pinecone_vs_Elasticsearch_in_the_Cohere_10_M_Streaming_Test_After_Optimization_500_rows_s_Ingestion_Rate_d249d290bb.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figura: QPS e Recall di Pinecone rispetto a Elasticsearch nel test di streaming Cohere 10M dopo l'ottimizzazione (velocità di ingestione di 500 righe/s)</em></p>
<p>Come mostra il grafico, ElasticSearch ha superato Pinecone in QPS dopo l'ottimizzazione dell'indice. Un miracolo? Non proprio. Il grafico di destra racconta la storia completa: una volta che l'asse delle ascisse riflette il tempo effettivo trascorso, è chiaro che ElasticSearch ha impiegato molto più tempo per raggiungere quelle prestazioni. E in produzione, questo ritardo è importante. Questo confronto rivela un compromesso fondamentale: il throughput di picco rispetto al time-to-serve.</p>
<h2 id="Choose-Your-Vector-Database-with-Confidence" class="common-anchor-header">Scegliete con fiducia il vostro database vettoriale<button data-href="#Choose-Your-Vector-Database-with-Confidence" class="anchor-icon" translate="no">
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
    </button></h2><p>Il divario tra i risultati dei benchmark e le prestazioni reali non dovrebbe essere un gioco di ipotesi. VDBBench offre un modo per valutare i database vettoriali in condizioni realistiche, simili a quelle di produzione, tra cui l'ingestione continua di dati, il filtraggio dei metadati e i carichi di lavoro in streaming.</p>
<p>Se avete intenzione di distribuire un database vettoriale in produzione, vale la pena di capire come si comporta al di là dei test di laboratorio idealizzati. VDBBench è open-source, trasparente e progettato per supportare confronti significativi.</p>
<p>Provate oggi stesso VDBBench con i vostri carichi di lavoro e scoprite come si comportano i diversi sistemi nella pratica: <a href="https://github.com/zilliztech/VectorDBBench">https://github.com/zilliztech/VectorDBBench.</a></p>
<p>Avete domande o volete condividere i vostri risultati? Unitevi alla conversazione su<a href="https://github.com/zilliztech/VectorDBBench"> GitHub</a> o connettetevi con la nostra comunità su <a href="https://discord.com/invite/FG6hMJStWu">Discord</a>. Saremo lieti di ascoltare le vostre opinioni.</p>
