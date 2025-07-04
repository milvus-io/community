---
id: vdbbench-1-0-benchmarking-with-your-real-world-production-workloads.md
title: >-
  Annuncio di VDBBench 1.0: Benchmarking open source dei database vettoriali con
  i carichi di lavoro di produzione del mondo reale
author: Tian Min
date: 2025-07-04T00:00:00.000Z
desc: >-
  Scoprite VDBBench 1.0, uno strumento open source per il benchmarking dei
  database vettoriali con dati reali, ingestione di streaming e carichi di
  lavoro simultanei.
cover: assets.zilliz.com/milvus_vdb_e0e8146c90.jpeg
tag: Announcements
recommend: false
publishToMedium: true
tags: 'vector database, Milvus, vectordb benchmarking, vector search'
meta_keywords: 'VDBBench, vector database, Milvus, Zilliz Cloud, benchmarking'
meta_title: |
  VDBBench 1.0: Real-World Benchmarking for Vector Databases
origin: >-
  https://zilliz.com/blog/vdbbench-1-0-benchmarking-with-your-real-world-production-workloads
---
<p>La maggior parte dei benchmark dei database vettoriali viene testata con dati statici e indici precostituiti. Ma i sistemi di produzione non funzionano in questo modo: i dati fluiscono continuamente mentre gli utenti eseguono le query, i filtri frammentano gli indici e le caratteristiche delle prestazioni cambiano drasticamente sotto carichi di lettura/scrittura simultanei.</p>
<p>Oggi rilasciamo <a href="https://github.com/zilliztech/VectorDBBench/releases/tag/v1.0.0"><strong>VDBBench 1.0</strong></a>, un benchmark open-source progettato da zero per testare i database vettoriali in condizioni di produzione realistiche: ingestione di dati in streaming, filtraggio dei metadati con selettività variabile e carichi di lavoro simultanei che rivelano gli effettivi colli di bottiglia del sistema.</p>
<p><a href="https://github.com/zilliztech/VectorDBBench/releases/tag/v1.0.0"><strong>Scarica VDBBench 1.0 →</strong></a> |<a href="https://zilliz.com/vdbbench-leaderboard?dataset=vectorSearch"> <strong>Visualizza la classifica →</strong></a></p>
<h2 id="Why-Current-Benchmarks-Are-Misleading" class="common-anchor-header">Perché i benchmark attuali sono fuorvianti<button data-href="#Why-Current-Benchmarks-Are-Misleading" class="anchor-icon" translate="no">
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
    </button></h2><p>Siamo onesti: c'è uno strano fenomeno nel nostro settore. Tutti parlano di "non giocare con i benchmark", eppure molti si comportano esattamente così. Da quando il mercato dei database vettoriali è esploso nel 2023, abbiamo assistito a numerosi esempi di sistemi che "fanno ottimi benchmark" ma che "falliscono miseramente" in produzione, facendo perdere tempo alla progettazione e danneggiando la credibilità del progetto.</p>
<p>Abbiamo assistito a questo scollamento in prima persona. Ad esempio, Elasticsearch vanta una velocità di interrogazione di millisecondi, ma dietro le quinte può impiegare oltre 20 ore solo per ottimizzare il suo indice. Quale sistema di produzione può tollerare un tale tempo di inattività?</p>
<p>Il problema deriva da tre difetti fondamentali:</p>
<ul>
<li><p><strong>Set di dati obsoleti:</strong> Molti benchmark si basano ancora su set di dati obsoleti, come SIFT (128 dimensioni), mentre i moderni embedding hanno dimensioni comprese tra 768 e 3.072. Le caratteristiche delle prestazioni dei sistemi che operano su vettori a 128D rispetto a quelli a 1024D+ sono fondamentalmente diverse: i modelli di accesso alla memoria, l'efficienza degli indici e la complessità computazionale cambiano radicalmente.</p></li>
<li><p><strong>Metriche di vanità:</strong> I benchmark si concentrano sulla latenza media o sul picco QPS, creando un quadro distorto. Un sistema con una latenza media di 10 ms ma una latenza P99 di 2 secondi crea una pessima esperienza utente. Il throughput di picco misurato su 30 secondi non dice nulla sulle prestazioni sostenute.</p></li>
<li><p><strong>Scenari eccessivamente semplificati:</strong> La maggior parte dei benchmark testa i flussi di lavoro di base "scrivi i dati, costruisci l'indice, fai la query", in sostanza test di livello "Hello World". La produzione reale comporta un'ingestione continua di dati mentre vengono servite le query, un complesso filtraggio dei metadati che frammenta gli indici e operazioni di lettura/scrittura simultanee che competono per le risorse.</p></li>
</ul>
<h2 id="What’s-New-in-VDBBench-10" class="common-anchor-header">Cosa c'è di nuovo in VDBBench 1.0?<button data-href="#What’s-New-in-VDBBench-10" class="anchor-icon" translate="no">
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
    </button></h2><p>VDBBench non si limita a riproporre filosofie di benchmarking ormai superate, ma ricostruisce il concetto di benchmarking da zero, con un'unica convinzione: un benchmark è valido solo se predice il comportamento effettivo in produzione.</p>
<p>Abbiamo progettato VDBBench per replicare fedelmente le condizioni del mondo reale in tre dimensioni critiche: <strong>autenticità dei dati, modelli di carico di lavoro e metodologie di misurazione delle prestazioni.</strong></p>
<p>Diamo un'occhiata più da vicino alle nuove funzionalità introdotte.</p>
<h3 id="🚀-Redesigned-Dashboard-with-Production-Relevant-Visualizations" class="common-anchor-header"><strong>Dashboard ridisegnato con visualizzazioni rilevanti per la produzione</strong></h3><p>La maggior parte dei benchmark si concentra solo sulla produzione di dati grezzi, ma ciò che conta è il modo in cui gli ingegneri interpretano e agiscono su questi risultati. Abbiamo ridisegnato l'interfaccia utente per dare priorità alla chiarezza e all'interattività, consentendo di individuare i divari di prestazioni tra i sistemi e di prendere decisioni rapide sull'infrastruttura.</p>
<p>Il nuovo dashboard visualizza non solo i numeri delle prestazioni, ma anche le relazioni tra di essi: come il QPS degrada con diversi livelli di selettività dei filtri, come il richiamo fluttua durante l'ingestione dello streaming e come le distribuzioni della latenza rivelano le caratteristiche di stabilità del sistema.  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/vdb_1_df593dea0b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Abbiamo ritestato le principali piattaforme di database vettoriali, tra cui <strong>Milvus, Zilliz Cloud, Elastic Cloud, Qdrant Cloud, Pinecone e OpenSearch</strong>, con le loro ultime configurazioni e impostazioni consigliate, per garantire che tutti i dati di benchmark riflettano le capacità attuali. Tutti i risultati dei test sono disponibili nella<a href="https://zilliz.com/vdbbench-leaderboard?dataset=vectorSearch"> VDBBench Leaderboard</a>.</p>
<h3 id="🏷️-Tag-Filtering-The-Hidden-Performance-Killer" class="common-anchor-header">🏷️ Tag Filtering: Il killer nascosto delle prestazioni</h3><p>Le query del mondo reale raramente avvengono in modo isolato. Le applicazioni combinano la similarità vettoriale con il filtraggio dei metadati ("trova le scarpe che assomigliano a questa foto ma costano meno di 100 dollari"). Questa ricerca vettoriale filtrata crea sfide uniche che la maggior parte dei benchmark ignora completamente.</p>
<p>Le ricerche filtrate introducono complessità in due aree critiche:</p>
<ul>
<li><p><strong>Complessità del filtro</strong>: Un maggior numero di campi scalari e condizioni logiche complesse aumentano la richiesta di calcolo e possono causare un richiamo insufficiente e la frammentazione dell'indice del grafo.</p></li>
<li><p><strong>Selettività dei filtri</strong>: È il "killer nascosto delle prestazioni" che abbiamo ripetutamente verificato in produzione. Quando le condizioni di filtraggio diventano altamente selettive (filtrando oltre il 99% dei dati), la velocità delle query può fluttuare di ordini di grandezza e il richiamo può diventare instabile in quanto le strutture degli indici si trovano a dover affrontare insiemi di risultati scarsi.</p></li>
</ul>
<p>VDBBench testa sistematicamente vari livelli di selettività dei filtri (dal 50% al 99,9%), fornendo un profilo completo delle prestazioni in questo modello di produzione critico. I risultati spesso rivelano drastici scogli di prestazioni che non sarebbero mai emersi nei benchmark tradizionali.</p>
<p><strong>Esempio</strong>: Nei test di Cohere 1M, Milvus ha mantenuto un richiamo costantemente elevato a tutti i livelli di selettività dei filtri, mentre OpenSearch ha mostrato prestazioni instabili, con un richiamo che fluttuava significativamente in diverse condizioni di filtraggio, scendendo in molti casi al di sotto di 0,8, un valore inaccettabile per la maggior parte degli ambienti di produzione.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/vdb_2_0ef89463e5.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figura: QPS e richiamo di Milvus e OpenSearch attraverso diversi livelli di selettività dei filtri (test Cohere 1M).</em></p>
<h3 id="🌊-Streaming-ReadWrite-Beyond-Static-Index-Testing" class="common-anchor-header">🌊 Lettura/scrittura in streaming: Oltre i test statici degli indici</h3><p>I sistemi di produzione raramente godono del lusso di avere dati statici. Le nuove informazioni affluiscono continuamente durante l'esecuzione delle ricerche - uno scenario in cui molti database altrimenti impressionanti crollano sotto la duplice pressione di mantenere le prestazioni di ricerca e di gestire le scritture continue.</p>
<p>Gli scenari di streaming di VDBBench simulano operazioni parallele reali, aiutando gli sviluppatori a comprendere la stabilità del sistema in ambienti ad alta liquidità, in particolare l'impatto della scrittura dei dati sulle prestazioni delle query e l'evoluzione delle prestazioni all'aumentare del volume dei dati.</p>
<p>Per garantire confronti equi tra sistemi diversi, VDBBench utilizza un approccio strutturato:</p>
<ul>
<li><p>Configurare velocità di scrittura controllate che rispecchino i carichi di lavoro di produzione (ad esempio, 500 righe/sec distribuite su 5 processi paralleli).</p></li>
<li><p>Attivare le operazioni di ricerca dopo ogni 10% di ingestione dei dati, alternando tra modalità seriale e concorrente.</p></li>
<li><p>Registrare metriche complete: distribuzioni di latenza (compresa la P99), QPS sostenuti e precisione di richiamo.</p></li>
<li><p>Seguire l'evoluzione delle prestazioni nel tempo con l'aumento del volume dei dati e dello stress del sistema.</p></li>
</ul>
<p>Questi test di carico controllati e incrementali rivelano la capacità dei sistemi di mantenere la stabilità e l'accuratezza durante l'ingestione continua, cosa che i benchmark tradizionali raramente riescono a cogliere.</p>
<p><strong>Esempio</strong>: Nei test di streaming Cohere 10M, Pinecone ha mantenuto QPS e recall più elevati per tutto il ciclo di scrittura rispetto a Elasticsearch. In particolare, le prestazioni di Pinecone sono migliorate significativamente dopo il completamento dell'ingestione, dimostrando una forte stabilità sotto carico sostenuto, mentre Elasticsearch ha mostrato un comportamento più irregolare durante le fasi di ingestione attiva.  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/vdb3_9d2a5298b0.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Figura: QPS e Recall di Pinecone rispetto a Elasticsearch nel test di streaming Cohere 10M (velocità di ingestione di 500 righe/s).</p>
<p>VDBBench si spinge oltre, supportando una fase di ottimizzazione opzionale che consente agli utenti di confrontare le prestazioni della ricerca in streaming prima e dopo l'ottimizzazione dell'indice. Inoltre, tiene traccia e riporta il tempo effettivo trascorso in ogni fase, offrendo una visione più approfondita dell'efficienza e del comportamento del sistema in condizioni simili a quelle di produzione.  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/vdb4_0caee3b201.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figura: QPS e Recall di Pinecone rispetto a Elasticsearch nel test di streaming Cohere 10M dopo l'ottimizzazione (tasso di ingestione di 500 righe/s)</em></p>
<p>Come mostrato nei nostri test, Elasticsearch ha superato Pinecone in QPS dopo l'ottimizzazione dell'indice. Ma quando l'asse delle ascisse riflette il tempo effettivo trascorso, è chiaro che Elasticsearch ha impiegato molto più tempo per raggiungere tali prestazioni. In produzione, questo ritardo è importante. Questo confronto rivela un compromesso fondamentale: il throughput di picco rispetto al time-to-serve.</p>
<h3 id="🔬-Modern-Datasets-That-Reflect-Current-AI-Workloads" class="common-anchor-header">🔬 Dataset moderni che riflettono gli attuali carichi di lavoro dell'intelligenza artificiale</h3><p>Abbiamo completamente rivisto i set di dati utilizzati per il benchmarking dei database vettoriali. Invece di set di test tradizionali come SIFT e GloVe, VDBBench utilizza vettori generati da modelli di incorporazione all'avanguardia come OpenAI e Cohere, che alimentano le applicazioni di IA di oggi.</p>
<p>Per garantire la pertinenza, soprattutto per casi d'uso come la Retrieval-Augmented Generation (RAG), abbiamo selezionato corpora che riflettono scenari aziendali reali e specifici del dominio:</p>
<table>
<thead>
<tr><th></th><th></th><th></th><th></th><th></th></tr>
</thead>
<tbody>
<tr><td><strong>Corpus</strong></td><td><strong>Modello di incorporazione</strong></td><td><strong>Dimensioni</strong></td><td><strong>Dimensioni</strong></td><td><strong>Caso d'uso</strong></td></tr>
<tr><td>Wikipedia</td><td>Cohere V2</td><td>768</td><td>1M / 10M</td><td>Base di conoscenza generale</td></tr>
<tr><td>BioASQ</td><td>Cohere V3</td><td>1024</td><td>1M / 10M</td><td>Dominio specifico (biomedico)</td></tr>
<tr><td>C4</td><td>OpenAI</td><td>1536</td><td>500K / 5M</td><td>Elaborazione del testo su scala web</td></tr>
<tr><td>MSMarco V2</td><td>udever-bloom-1b1</td><td>1536</td><td>1M / 10M / 138M</td><td>Ricerca su larga scala</td></tr>
</tbody>
</table>
<p>Questi set di dati simulano meglio gli attuali dati vettoriali ad alto volume e ad alta dimensionalità, consentendo di testare in modo realistico l'efficienza dello storage, le prestazioni delle query e l'accuratezza del recupero in condizioni che corrispondono ai moderni carichi di lavoro dell'intelligenza artificiale.</p>
<h3 id="⚙️-Custom-Dataset-Support-for-Industry-Specific-Testing" class="common-anchor-header">⚙️ Supporto di set di dati personalizzati per test specifici del settore</h3><p>Ogni azienda è unica. Il settore finanziario potrebbe aver bisogno di test incentrati sugli embeddings delle transazioni, mentre le piattaforme sociali si preoccupano maggiormente dei vettori di comportamento degli utenti. VDBBench vi consente di eseguire il benchmark con i vostri dati generati da modelli di embedding specifici per i vostri carichi di lavoro specifici.</p>
<p>È possibile personalizzare:</p>
<ul>
<li><p>Dimensioni e tipi di dati del vettore</p></li>
<li><p>Schema dei metadati e modelli di filtraggio</p></li>
<li><p>Volume dei dati e modelli di ingestione</p></li>
<li><p>Distribuzioni di query che corrispondono al traffico di produzione</p></li>
</ul>
<p>Dopo tutto, nessun set di dati racconta una storia migliore dei vostri dati di produzione.</p>
<h2 id="How-VDBBench-Measures-What-Actually-Matters-in-Production" class="common-anchor-header">Come VDBBench misura ciò che conta davvero in produzione<button data-href="#How-VDBBench-Measures-What-Actually-Matters-in-Production" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Production-Focused-Metric-Design" class="common-anchor-header">Progettazione delle metriche orientata alla produzione</h3><p>VDBBench dà priorità alle metriche che riflettono le prestazioni del mondo reale, non solo i risultati di laboratorio. Abbiamo ridisegnato il benchmarking in base a ciò che conta davvero negli ambienti di produzione: <strong>affidabilità sotto carico, caratteristiche di latenza di coda, throughput sostenuto e conservazione dell'accuratezza.</strong></p>
<ul>
<li><p><strong>Latenza P95/P99 per un'esperienza utente reale</strong>: La latenza media/mediana maschera i valori anomali che frustrano gli utenti reali e possono indicare l'instabilità del sistema sottostante. VDBBench si concentra sulla latenza di coda, come P95/P99, rivelando le prestazioni che il 95% o il 99% delle query raggiungerà effettivamente. Questo aspetto è fondamentale per la pianificazione degli SLA e per comprendere l'esperienza dell'utente nel caso peggiore.</p></li>
<li><p><strong>Throughput sostenibile sotto carico</strong>: Un sistema che funziona bene per 5 secondi non è sufficiente per la produzione. VDBBench aumenta gradualmente la concorrenza per trovare le query massime sostenibili al secondo del vostro database (<code translate="no">max_qps</code>), non il numero massimo in condizioni ideali e brevi. Questa metodologia rivela la tenuta del sistema nel tempo e aiuta a pianificare in modo realistico la capacità.</p></li>
<li><p><strong>Richiamo bilanciato con le prestazioni</strong>: La velocità senza l'accuratezza non ha senso. Ogni numero di prestazioni in VDBBench è abbinato a misure di richiamo, in modo da sapere esattamente quanta rilevanza si sta scambiando con il throughput. Ciò consente di effettuare confronti equi e paragonabili tra sistemi con compromessi interni molto diversi.</p></li>
</ul>
<h3 id="Test-Methodology-That-Reflects-Reality" class="common-anchor-header">Metodologia di test che riflette la realtà</h3><p>Un'innovazione chiave nel design di VDBBench è la separazione dei test seriali e concomitanti, che aiuta a catturare il comportamento dei sistemi sotto diversi tipi di carico e rivela le caratteristiche delle prestazioni importanti per i diversi casi d'uso.</p>
<p><strong>Separazione della misurazione della latenza:</strong></p>
<ul>
<li><p><code translate="no">serial_latency_p99</code> misura le prestazioni del sistema in condizioni di carico minimo, in cui viene elaborata una sola richiesta alla volta. Questo rappresenta lo scenario migliore per la latenza e aiuta a identificare le capacità di base del sistema.</p></li>
<li><p><code translate="no">conc_latency_p99</code> cattura il comportamento del sistema in condizioni realistiche di alta frequenza, in cui più richieste arrivano simultaneamente e competono per le risorse del sistema.</p></li>
</ul>
<p><strong>Struttura del benchmark a due fasi</strong>:</p>
<ol>
<li><p><strong>Test seriale</strong>: Esecuzione di un singolo processo di 1.000 query che stabilisce le prestazioni e l'accuratezza di base, riportando sia <code translate="no">serial_latency_p99</code> che recall. Questa fase aiuta a identificare il limite teorico delle prestazioni.</p></li>
<li><p><strong>Test di concorrenza</strong>: Simula l'ambiente di produzione in condizioni di carico prolungato con diverse innovazioni chiave:</p>
<ul>
<li><p><strong>Simulazione realistica del client</strong>: Ogni processo di test opera in modo indipendente con la propria connessione e il proprio set di query, evitando interferenze di stato condivise che potrebbero falsare i risultati.</p></li>
<li><p><strong>Avvio sincronizzato</strong>: Tutti i processi iniziano simultaneamente, garantendo che il QPS misurato rifletta accuratamente i livelli di concorrenza dichiarati.</p></li>
<li><p><strong>Set di query indipendenti</strong>: Previene tassi di risposta alla cache non realistici che non riflettono la diversità delle query di produzione.</p></li>
</ul></li>
</ol>
<p>Questi metodi attentamente strutturati garantiscono che i valori di <code translate="no">max_qps</code> e <code translate="no">conc_latency_p99</code> riportati da VDBBench siano accurati e rilevanti per la produzione, fornendo indicazioni significative per la pianificazione della capacità produttiva e la progettazione del sistema.</p>
<h2 id="Getting-Started-with-VDBBench-10" class="common-anchor-header">Per iniziare con VDBBench 1.0<button data-href="#Getting-Started-with-VDBBench-10" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>VDBBench 1.0</strong> rappresenta un cambiamento fondamentale verso il benchmarking rilevante per la produzione. Coprendo la scrittura continua dei dati, il filtraggio dei metadati con selettività variabile e i carichi di streaming con modelli di accesso concorrenti, fornisce l'approssimazione più vicina agli ambienti di produzione reali oggi disponibile.</p>
<p>Il divario tra i risultati dei benchmark e le prestazioni reali non dovrebbe essere un gioco di ipotesi. Se avete intenzione di distribuire un database vettoriale in produzione, vale la pena di capire come si comporta al di là dei test di laboratorio idealizzati. VDBBench è open-source, trasparente e progettato per supportare confronti significativi.</p>
<p>Non lasciatevi influenzare da numeri impressionanti che non si traducono in valore di produzione. <strong>Utilizzate VDBBench 1.0 per testare gli scenari importanti per la vostra azienda, con i vostri dati, in condizioni che riflettono il vostro carico di lavoro effettivo.</strong> L'era dei benchmark fuorvianti nella valutazione dei database vettoriali sta finendo: è ora di prendere decisioni basate su dati rilevanti per la produzione.</p>
<p><strong>Provate VDBBench con i vostri carichi di lavoro:</strong><a href="https://github.com/zilliztech/VectorDBBench"> https://github.com/zilliztech/VectorDBBench</a></p>
<p><strong>Visualizzate i risultati dei test dei principali database vettoriali:</strong><a href="https://zilliz.com/vdbbench-leaderboard?dataset=vectorSearch"> Classifica VDBBench</a></p>
<p>Avete domande o volete condividere i vostri risultati? Unitevi alla conversazione su<a href="https://github.com/zilliztech/VectorDBBench"> GitHub</a> o connettetevi con la nostra comunità su<a href="https://discord.com/invite/FG6hMJStWu"> Discord</a>.</p>
