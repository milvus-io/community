---
id: a-day-in-the-life-of-milvus-datum.md
title: Un giorno nella vita di un dato Milvus
author: 'Stefan Webb, Anthony Tu'
date: 2025-03-17T00:00:00.000Z
desc: 'Facciamo quindi un giro nella vita di Dave, il dato di Milvus.'
cover: assets.zilliz.com/a_day_in_the_life_of_a_milvus_datum_ca279f7f59.png
tag: Engineering
tags: 'Deep Research, open source AI, Milvus, LangChain, DeepSeek R1'
recommend: true
canonicalUrl: 'https://milvus.io/blog/a-day-in-the-life-of-milvus-datum.md'
---
<p>Costruire un <a href="https://zilliz.com/learn/what-is-vector-database">database vettoriale</a> performante come Milvus, in grado di scalare fino a miliardi di vettori e di gestire il traffico su scala web, non è un'impresa semplice. Richiede una progettazione attenta e intelligente di un sistema distribuito. È necessario un compromesso tra prestazioni e semplicità all'interno di un sistema come questo.</p>
<p>Pur avendo cercato di bilanciare bene questo compromesso, alcuni aspetti dell'interno sono rimasti oscuri. Questo articolo mira a dissipare ogni mistero su come Milvus suddivide l'inserimento dei dati, l'indicizzazione e il servizio tra i nodi. La comprensione di questi processi ad alto livello è essenziale per ottimizzare efficacemente le prestazioni delle query, la stabilità del sistema e i problemi legati al debug.</p>
<p>Facciamo un giro nella vita di Dave, il dato Milvus. Immaginate di inserire Dave nella vostra collezione in un'<a href="https://milvus.io/docs/install-overview.md#Milvus-Distributed">installazione distribuita di Milvus</a> (si veda il diagramma seguente). Per quanto vi riguarda, Dave viene inserito direttamente nella collezione. Dietro le quinte, tuttavia, avvengono molti passaggi in sottosistemi indipendenti.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/a_day_in_the_life_of_a_milvus_datum_ca279f7f59.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Proxy-Nodes-and-the-Message-Queue" class="common-anchor-header">Nodi proxy e coda di messaggi<button data-href="#Proxy-Nodes-and-the-Message-Queue" class="anchor-icon" translate="no">
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
    </button></h2><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Proxy_Nodes_and_the_Message_Queue_03a0fde0c5.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Inizialmente si chiama l'oggetto MilvusClient, ad esempio tramite la libreria PyMilvus, e si invia una richiesta <code translate="no">_insert()</code>_ a un <em>nodo proxy</em>. I nodi proxy sono la porta d'accesso tra l'utente e il sistema di database, eseguendo operazioni come il bilanciamento del carico sul traffico in entrata e la collazione di più output prima che vengano restituiti all'utente.</p>
<p>Una funzione di hash viene applicata alla chiave primaria dell'elemento per determinare a quale <em>canale</em> inviarlo. I canali, implementati con argomenti Pulsar o Kafka, rappresentano un punto di raccolta per i dati in streaming, che possono poi essere inviati agli abbonati del canale.</p>
<h2 id="Data-Nodes-Segments-and-Chunks" class="common-anchor-header">Nodi, segmenti e pacchetti di dati<button data-href="#Data-Nodes-Segments-and-Chunks" class="anchor-icon" translate="no">
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
    </button></h2><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Data_Nodes_Segments_and_Chunks_ae122dd1ac.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Dopo che i dati sono stati inviati al canale appropriato, il canale li invia al segmento corrispondente nel <em>nodo dati</em>. I nodi di dati sono responsabili della memorizzazione e della gestione dei buffer di dati chiamati <em>segmenti in crescita</em>. C'è un segmento di crescita per ogni shard.</p>
<p>Man mano che i dati vengono inseriti in un segmento, questo cresce fino a raggiungere una dimensione massima, predefinita a 122 MB. Durante questo periodo, parti più piccole del segmento, per impostazione predefinita 16MB e note come <em>chunk</em>, vengono spinte su uno storage persistente, ad esempio utilizzando S3 di AWS o altri storage compatibili come MinIO. Ogni chunk è un file fisico sull'object storage e c'è un file separato per ogni campo. La figura precedente illustra la gerarchia dei file sullo storage a oggetti.</p>
<p>Per riassumere, i dati di una raccolta sono suddivisi tra i nodi di dati, all'interno dei quali vengono suddivisi in segmenti per il buffering, che vengono ulteriormente suddivisi in chunk per campo per la memorizzazione persistente. I due diagrammi precedenti chiariscono meglio questo aspetto. Suddividendo i dati in arrivo in questo modo, sfruttiamo appieno il parallelismo del cluster in termini di larghezza di banda di rete, calcolo e archiviazione.</p>
<h2 id="Sealing-Merging-and-Compacting-Segments" class="common-anchor-header">Sigillare, unire e compattare i segmenti<button data-href="#Sealing-Merging-and-Compacting-Segments" class="anchor-icon" translate="no">
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
    </button></h2><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Sealing_Merging_and_Compacting_Segments_d5a6a37261.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Finora abbiamo raccontato la storia di come il nostro simpatico dato Dave si fa strada da una query di <code translate="no">_insert()</code>_ in uno storage persistente. Naturalmente, la sua storia non finisce qui. Ci sono altri passi per rendere più efficiente il processo di ricerca e indicizzazione. Gestendo la dimensione e il numero dei segmenti, il sistema sfrutta appieno il parallelismo del cluster.</p>
<p>Una volta che un segmento raggiunge la dimensione massima su un nodo dati, per impostazione predefinita 122 MB, si dice che è <em>sigillato</em>. Ciò significa che il buffer sul nodo dati viene svuotato per far posto a un nuovo segmento e i chunk corrispondenti nell'archiviazione persistente vengono contrassegnati come appartenenti a un segmento chiuso.</p>
<p>I nodi dati cercano periodicamente segmenti chiusi più piccoli e li uniscono in segmenti più grandi, fino a raggiungere la dimensione massima di 1 GB (per impostazione predefinita) per segmento. Ricordiamo che quando un elemento viene cancellato in Milvus, viene semplicemente contrassegnato con un flag di cancellazione - pensatelo come il Braccio della Morte per Dave. Quando il numero di elementi cancellati in un segmento supera una determinata soglia, per impostazione predefinita il 20%, il segmento viene ridotto di dimensioni, un'operazione che chiamiamo <em>compattazione</em>.</p>
<p>Indicizzazione e ricerca nei segmenti</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Indexing_and_Searching_through_Segments_478c0067be.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Indexing_and_Searching_through_Segments_1_0c31b5a340.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Esiste un altro tipo di nodo, il <em>nodo indice</em>, responsabile della creazione di indici per i segmenti sigillati. Quando il segmento è sigillato, il nodo dati invia una richiesta per un nodo indice per costruire un indice. Il nodo indice invia quindi l'indice completato alla memoria degli oggetti. Ogni segmento sigillato ha il proprio indice memorizzato in un file separato. È possibile esaminare questo file manualmente, accedendo al bucket; si veda la figura precedente per la gerarchia dei file.</p>
<p>I nodi di interrogazione, e non solo i nodi di dati, si iscrivono agli argomenti della coda di messaggi per gli shard corrispondenti. I segmenti in crescita sono replicati sui nodi di interrogazione e il nodo carica in memoria i segmenti sigillati appartenenti alla raccolta, come richiesto. Costruisce un indice per ogni segmento in crescita man mano che arrivano i dati e carica gli indici finalizzati per i segmenti sigillati dall'archivio dati.</p>
<p>Immaginiamo ora di chiamare l'oggetto MilvusClient con una richiesta di <em>ricerca()</em> che comprende Dave. Dopo essere stata inoltrata a tutti i nodi di interrogazione tramite il nodo proxy, ogni nodo di interrogazione esegue una ricerca di similarità vettoriale (o un altro dei metodi di ricerca come la query, la ricerca per intervallo o la ricerca per raggruppamento), iterando i segmenti uno per uno. I risultati vengono raccolti tra i vari nodi in modo simile a MapReduce e rinviati all'utente, con Dave felice di ritrovarsi finalmente insieme a voi.</p>
<h2 id="Discussion" class="common-anchor-header">Discussione<button data-href="#Discussion" class="anchor-icon" translate="no">
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
    </button></h2><p>Abbiamo descritto un giorno nella vita di Dave il dato, sia per le operazioni <code translate="no">_insert()</code>_ che per quelle <code translate="no">_search()</code>_. Altre operazioni come <code translate="no">_delete()</code>_ e <code translate="no">_upsert()</code>_ funzionano in modo simile. Inevitabilmente, abbiamo dovuto semplificare la discussione e omettere i dettagli più fini. Nel complesso, però, si dovrebbe avere un quadro sufficiente di come Milvus sia stato progettato per il parallelismo tra i nodi di un sistema distribuito, per essere robusto ed efficiente, e di come si possa utilizzare per l'ottimizzazione e il debug.</p>
<p><em>Un aspetto importante di questo articolo: Milvus è stato progettato con una separazione dei problemi tra i vari tipi di nodo. Ogni tipo di nodo ha una funzione specifica, mutuamente esclusiva, e c'è una separazione tra archiviazione e calcolo.</em> Il risultato è che ogni componente può essere scalato in modo indipendente con parametri modificabili in base al caso d'uso e ai modelli di traffico. Ad esempio, è possibile scalare il numero di nodi di interrogazione per servire un traffico maggiore senza scalare i nodi di dati e indici. Grazie a questa flessibilità, gli utenti di Milvus gestiscono miliardi di vettori e servono traffico su scala web, con una latenza delle query inferiore a 100 ms.</p>
<p>È inoltre possibile sfruttare i vantaggi del design distribuito di Milvus senza nemmeno implementare un cluster distribuito grazie a <a href="https://zilliz.com/cloud">Zilliz Cloud</a>, un servizio completamente gestito di Milvus. <a href="https://cloud.zilliz.com/signup">Iscrivetevi oggi stesso al livello gratuito di Zilliz Cloud e mettete Dave in azione!</a></p>
