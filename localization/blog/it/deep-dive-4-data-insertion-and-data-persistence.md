---
id: deep-dive-4-data-insertion-and-data-persistence.md
title: Inserimento e persistenza dei dati in un database vettoriale
author: Bingyi Sun
date: 2022-04-06T00:00:00.000Z
desc: >-
  Imparate a conoscere il meccanismo di inserimento e persistenza dei dati nel
  database vettoriale Milvus.
cover: assets.zilliz.com/Deep_Dive_4_812021d715.png
tag: Engineering
tags: 'Data science, Database, Technology, Artificial Intelligence, Vector Management'
canonicalUrl: 'https://milvus.io/blog/deep-dive-4-data-insertion-and-data-persistence.md'
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Deep_Dive_4_812021d715.png" alt="Cover image" class="doc-image" id="cover-image" />
   </span> <span class="img-wrapper"> <span>Immagine di copertina</span> </span></p>
<blockquote>
<p>Questo articolo è stato scritto da <a href="https://github.com/sunby">Bingyi Sun</a> e trascritto da <a href="https://www.linkedin.com/in/yiyun-n-2aa713163/">Angela Ni</a>.</p>
</blockquote>
<p>Nel precedente post della serie Deep Dive, abbiamo introdotto <a href="https://milvus.io/blog/deep-dive-3-data-processing.md">come vengono elaborati i dati in Milvus</a>, il database vettoriale più avanzato al mondo. In questo articolo continueremo a esaminare i componenti coinvolti nell'inserimento dei dati, illustreremo in dettaglio il modello dei dati e spiegheremo come si ottiene la persistenza dei dati in Milvus.</p>
<p>Vai a:</p>
<ul>
<li><a href="#Milvus-architecture-recap">Riassunto dell'architettura di Milvus</a></li>
<li><a href="#The-portal-of-data-insertion-requests">Il portale delle richieste di inserimento dati</a></li>
<li><a href="#Data-coord-and-data-node">Coordinamento dei dati e nodo dei dati</a></li>
<li><a href="#Root-coord-and-Time-Tick">Coordinamenti radice e Time Tick</a></li>
<li><a href="#Data-organization-collection-partition-shard-channel-segment">Organizzazione dei dati: raccolta, partizione, shard (canale), segmento</a></li>
<li><a href="#Data-allocation-when-and-how">Allocazione dei dati: quando e come</a></li>
<li><a href="#Binlog-file-structure-and-data-persistence">Struttura del file Binlog e persistenza dei dati</a></li>
</ul>
<h2 id="Milvus-architecture-recap" class="common-anchor-header">Riepilogo dell'architettura Milvus<button data-href="#Milvus-architecture-recap" class="anchor-icon" translate="no">
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
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Milvus_architecture_c7910cb89d.png" alt="Milvus architecture." class="doc-image" id="milvus-architecture." />
   </span> <span class="img-wrapper"> <span>Architettura Milvus</span>. </span></p>
<p>L'SDK invia le richieste di dati al proxy, il portale, tramite il load balancer. Quindi il proxy interagisce con il servizio di coordinamento per scrivere le richieste DDL (linguaggio di definizione dei dati) e DML (linguaggio di manipolazione dei dati) nell'archivio dei messaggi.</p>
<p>I nodi di lavoro, tra cui il nodo di interrogazione, il nodo dei dati e il nodo degli indici, consumano le richieste dall'archivio dei messaggi. In particolare, il nodo di interrogazione è responsabile dell'interrogazione dei dati; il nodo dei dati è responsabile dell'inserimento e della persistenza dei dati; il nodo dell'indice si occupa principalmente della creazione di indici e dell'accelerazione delle query.</p>
<p>Il livello inferiore è costituito dallo storage degli oggetti, che sfrutta principalmente MinIO, S3 e AzureBlob per l'archiviazione di log, binlog delta e file di indice.</p>
<h2 id="The-portal-of-data-insertion-requests" class="common-anchor-header">Il portale delle richieste di inserimento dati<button data-href="#The-portal-of-data-insertion-requests" class="anchor-icon" translate="no">
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
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Proxy_in_Milvus_aa6b724e0b.jpeg" alt="Proxy in Milvus." class="doc-image" id="proxy-in-milvus." />
   </span> <span class="img-wrapper"> <span>Proxy in Milvus</span>. </span></p>
<p>Proxy funge da portale per le richieste di inserimento dati.</p>
<ol>
<li>Inizialmente, il proxy accetta le richieste di inserimento dati dagli SDK e le alloca in diversi bucket utilizzando un algoritmo di hash.</li>
<li>Poi il proxy chiede al Data Coord di assegnare i segmenti, l'unità più piccola di Milvus per l'archiviazione dei dati.</li>
<li>In seguito, il proxy inserisce le informazioni dei segmenti richiesti nell'archivio dei messaggi, in modo che non vadano perse.</li>
</ol>
<h2 id="Data-coord-and-data-node" class="common-anchor-header">Coordinamento dati e nodo dati<button data-href="#Data-coord-and-data-node" class="anchor-icon" translate="no">
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
    </button></h2><p>La funzione principale del data coord è quella di gestire l'allocazione dei canali e dei segmenti, mentre la funzione principale del data node è quella di consumare e persistere i dati inseriti.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Data_coord_and_data_node_in_Milvus_8bcf010f9e.jpeg" alt="Data coord and data node in Milvus." class="doc-image" id="data-coord-and-data-node-in-milvus." />
   </span> <span class="img-wrapper"> <span>Data coord e data node in Milvus</span>. </span></p>
<h3 id="Function" class="common-anchor-header">Funzione</h3><p>Il Data Coord svolge le seguenti funzioni:</p>
<ul>
<li><p><strong>Allocazione dello spazio nei segmenti</strong>Il Data coord assegna al proxy lo spazio nei segmenti in crescita, in modo che il proxy possa utilizzare lo spazio libero nei segmenti per inserire i dati.</p></li>
<li><p><strong>Registrare l'allocazione del segmento e il tempo di scadenza dello spazio allocato nel segmento</strong>Lo spazio all'interno di ogni segmento allocato dal data coord non è permanente, pertanto il data coord deve anche tenere un registro del tempo di scadenza di ogni allocazione del segmento.</p></li>
<li><p>Se il segmento è pieno, il data coord attiva automaticamente il<strong>flush</strong>dei dati.</p></li>
<li><p><strong>Allocazione dei canali ai nodi di dati</strong>Una raccolta può avere più <a href="https://milvus.io/docs/v2.0.x/glossary.md#VChannel">canali di dati</a>. Il Data Coord determina quali vcanali sono consumati da quali nodi di dati.</p></li>
</ul>
<p>Il nodo dati serve per i seguenti aspetti:</p>
<ul>
<li><p><strong>Consumo di dati</strong>Il nodo dati consuma i dati dai canali allocati da data coord e crea una sequenza per i dati.</p></li>
<li><p><strong>Persistenza dei dati</strong>Memorizza nella cache i dati inseriti e li trasferisce automaticamente su disco quando il volume dei dati raggiunge una certa soglia.</p></li>
</ul>
<h3 id="Workflow" class="common-anchor-header">Flusso di lavoro</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/One_vchannel_can_only_be_assigned_to_one_data_node_14aa3bd718.png" alt="One vchannel can only be assigned to one data node." class="doc-image" id="one-vchannel-can-only-be-assigned-to-one-data-node." />
   </span> <span class="img-wrapper"> <span>Un canale v può essere assegnato a un solo nodo dati</span>. </span></p>
<p>Come mostrato nell'immagine precedente, la collezione ha quattro vchannel (V1, V2, V3 e V4) e ci sono due nodi dati. È molto probabile che il data coord assegni un nodo dati per consumare i dati da V1 e V2 e l'altro nodo dati da V3 e V4. Un singolo canale v non può essere assegnato a più nodi dati, per evitare la ripetizione del consumo di dati, che altrimenti causerebbe l'inserimento ripetitivo dello stesso batch di dati nello stesso segmento.</p>
<h2 id="Root-coord-and-Time-Tick" class="common-anchor-header">Root coord e Time Tick<button data-href="#Root-coord-and-Time-Tick" class="anchor-icon" translate="no">
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
    </button></h2><p>Root coord gestisce TSO (timestamp Oracle) e pubblica messaggi di time tick a livello globale. Ogni richiesta di inserimento dati ha un timestamp assegnato da root coord. Il Time Tick è la pietra miliare di Milvus, che agisce come un orologio in Milvus e indica in quale punto del tempo si trova il sistema Milvus.</p>
<p>Quando i dati vengono scritti in Milvus, ogni richiesta di inserimento dati porta con sé un timestamp. Durante il consumo dei dati, ogni nodo di dati temporali consuma i dati i cui timestamp sono compresi in un certo intervallo.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/An_example_of_data_insertion_and_data_consumption_based_on_timestamp_e820f682f9.jpeg" alt="An example of data insertion and data consumption based on timestamp." class="doc-image" id="an-example-of-data-insertion-and-data-consumption-based-on-timestamp." />
   </span> <span class="img-wrapper"> <span>Un esempio di inserimento e consumo di dati in base al timestamp</span>. </span></p>
<p>L'immagine qui sopra rappresenta il processo di inserimento dei dati. I valori dei timestamp sono rappresentati dai numeri 1,2,6,5,7,8. I dati vengono scritti nel sistema da due proxy: p1 e p2. Durante il consumo dei dati, se l'ora corrente del Time Tick è 5, i nodi di dati possono leggere solo i dati 1 e 2. Poi, durante la seconda lettura, se il tempo corrente del Time Tick diventa 9, i dati 6,7,8 possono essere letti dal nodo dati.</p>
<h2 id="Data-organization-collection-partition-shard-channel-segment" class="common-anchor-header">Organizzazione dei dati: raccolta, partizione, shard (canale), segmento<button data-href="#Data-organization-collection-partition-shard-channel-segment" class="anchor-icon" translate="no">
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
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Data_organization_in_Milvus_75ad710752.jpeg" alt="Data organization in Milvus." class="doc-image" id="data-organization-in-milvus." />
   </span> <span class="img-wrapper"> <span>Organizzazione dei dati in Milvus</span>. </span></p>
<p>Leggete prima questo <a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md#Data-Model">articolo</a> per capire il modello dei dati in Milvus e i concetti di collezione, shard, partizione e segmento.</p>
<p>In sintesi, l'unità di dati più grande in Milvus è una raccolta, che può essere paragonata a una tabella in un database relazionale. Una collezione può avere più frammenti (ciascuno corrispondente a un canale) e più partizioni all'interno di ciascun frammento. Come mostrato nell'illustrazione precedente, i canali (shard) sono le barre verticali, mentre le partizioni sono quelle orizzontali. In ogni intersezione si trova il concetto di segmento, l'unità più piccola per l'allocazione dei dati. In Milvus, gli indici sono costruiti sui segmenti. Durante un'interrogazione, il sistema Milvus bilancia anche i carichi delle interrogazioni nei diversi nodi di interrogazione e questo processo è condotto sulla base dell'unità dei segmenti. I segmenti contengono diversi <a href="https://milvus.io/docs/v2.0.x/glossary.md#Binlog">binlog</a> e quando i dati del segmento vengono consumati, viene generato un file binlog.</p>
<h3 id="Segment" class="common-anchor-header">Segmento</h3><p>In Milvus esistono tre tipi di segmenti con uno stato diverso: segmento in crescita, segmento sigillato e segmento scaricato.</p>
<h4 id="Growing-segment" class="common-anchor-header">Segmento in crescita</h4><p>Un segmento in crescita è un segmento appena creato che può essere assegnato al proxy per l'inserimento dei dati. Lo spazio interno di un segmento può essere utilizzato, allocato o libero.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Three_status_in_a_growing_segment_bdae45e26f.png" alt="Three status in a growing segment" class="doc-image" id="three-status-in-a-growing-segment" />
   </span> <span class="img-wrapper"> <span>Tre stati in un segmento in crescita</span> </span></p>
<ul>
<li>Usato: questa parte di spazio di un segmento in crescita è stata consumata dal nodo dati.</li>
<li>Allocato: questa parte di spazio di un segmento in crescita è stata richiesta dal proxy e allocata dal nodo dati. Lo spazio allocato scadrà dopo un certo periodo di tempo.</li>
<li>Libero: questa parte di spazio di un segmento in crescita non è stata utilizzata. Il valore dello spazio libero è uguale allo spazio complessivo del segmento sottratto dal valore dello spazio utilizzato e allocato. Pertanto, lo spazio libero di un segmento aumenta man mano che lo spazio allocato scade.</li>
</ul>
<h4 id="Sealed-segment" class="common-anchor-header">Segmento sigillato</h4><p>Un segmento sigillato è un segmento chiuso che non può più essere assegnato al proxy per l'inserimento dei dati.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Sealed_segment_in_Milvus_8def5567e1.jpeg" alt="Sealed segment in Milvus" class="doc-image" id="sealed-segment-in-milvus" />
   </span> <span class="img-wrapper"> <span>Segmento sigillato in Milvus</span> </span></p>
<p>Un segmento crescente viene sigillato nelle seguenti circostanze:</p>
<ul>
<li>Se lo spazio utilizzato in un segmento in crescita raggiunge il 75% dello spazio totale, il segmento viene sigillato.</li>
<li>Flush() viene chiamato manualmente da un utente di Milvus per persistere tutti i dati in una collezione.</li>
<li>I segmenti in crescita che non vengono sigillati dopo un lungo periodo di tempo vengono sigillati, poiché troppi segmenti in crescita causano un consumo eccessivo di memoria da parte dei nodi di dati.</li>
</ul>
<h4 id="Flushed-segment" class="common-anchor-header">Segmento lavato</h4><p>Un segmento flush è un segmento che è già stato scritto su disco. Il termine flush si riferisce alla memorizzazione dei dati del segmento nella memoria degli oggetti, ai fini della persistenza dei dati. Un segmento può essere flushato solo quando lo spazio allocato in un segmento sigillato scade. Quando si esegue il flush, il segmento sigillato si trasforma in un segmento flush.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Flushed_segment_in_Milvus_0c1f54d432.png" alt="Flushed segment in Milvus" class="doc-image" id="flushed-segment-in-milvus" />
   </span> <span class="img-wrapper"> <span>Segmento flushed in Milvus</span> </span></p>
<h3 id="Channel" class="common-anchor-header">Canale</h3><p>Un canale viene allocato:</p>
<ul>
<li>Quando il nodo dati si avvia o si spegne; oppure</li>
<li>Quando lo spazio del segmento allocato viene richiesto da un proxy.</li>
</ul>
<p>Esistono diverse strategie di allocazione dei canali. Milvus supporta 2 di queste strategie:</p>
<ol>
<li>Hashing coerente</li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Consistency_hashing_in_Milvus_fb5e5d84ce.jpeg" alt="Consistency hashing in Milvus" class="doc-image" id="consistency-hashing-in-milvus" />
   </span> <span class="img-wrapper"> <span>Hashing coerente in Milvus</span> </span></p>
<p>È la strategia predefinita di Milvus. Questa strategia sfrutta la tecnica dell'hashing per assegnare a ogni canale una posizione sull'anello, quindi cerca in senso orario il nodo dati più vicino a un canale. Pertanto, nell'illustrazione precedente, il canale 1 è assegnato al nodo dati 2, mentre il canale 2 è assegnato al nodo dati 3.</p>
<p>Tuttavia, un problema di questa strategia è che l'aumento o la diminuzione del numero di nodi dati (ad esempio, l'avvio di un nuovo nodo dati o la chiusura improvvisa di un nodo dati) può influenzare il processo di assegnazione dei canali. Per risolvere questo problema, Data Coord monitora lo stato dei nodi dati tramite etcd, in modo da ricevere una notifica immediata in caso di cambiamenti nello stato dei nodi dati. In seguito, Data Coord determina a quale nodo dati assegnare correttamente i canali.</p>
<ol start="2">
<li>Bilanciamento del carico</li>
</ol>
<p>La seconda strategia consiste nell'allocare i canali della stessa collezione a diversi nodi dati, assicurando che i canali siano allocati in modo uniforme. Lo scopo di questa strategia è quello di ottenere il bilanciamento del carico.</p>
<h2 id="Data-allocation-when-and-how" class="common-anchor-header">Allocazione dei dati: quando e come<button data-href="#Data-allocation-when-and-how" class="anchor-icon" translate="no">
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
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/The_process_of_data_allocation_in_Milvus_0ba86b3ad1.jpeg" alt="The process of data allocation in Milvus" class="doc-image" id="the-process-of-data-allocation-in-milvus" />
   </span> <span class="img-wrapper"> <span>Il processo di allocazione dei dati in Milvus</span> </span></p>
<p>Il processo di allocazione dei dati inizia dal client. Per prima cosa invia al proxy le richieste di inserimento dati con un timestamp <code translate="no">t1</code>. Poi il proxy invia una richiesta di allocazione di un segmento al Data Coord.</p>
<p>Una volta ricevuta la richiesta di allocazione del segmento, il data coord controlla lo stato del segmento e lo alloca. Se lo spazio attuale dei segmenti creati è sufficiente per le righe di dati appena inserite, il data coord alloca i segmenti creati. Se invece lo spazio disponibile nei segmenti attuali non è sufficiente, il data coord alloca un nuovo segmento. Il data coord può restituire uno o più segmenti a ogni richiesta. Nel frattempo, il data coord salva anche il segmento allocato nel meta server per la persistenza dei dati.</p>
<p>Successivamente, il data coord restituisce al proxy le informazioni sul segmento allocato (tra cui l'ID del segmento, il numero di righe, il tempo di scadenza <code translate="no">t2</code>, ecc. Il proxy invia tali informazioni sul segmento allocato all'archivio dei messaggi, in modo da registrarle correttamente. Si noti che il valore di <code translate="no">t1</code> deve essere inferiore a quello di <code translate="no">t2</code>. Il valore predefinito di <code translate="no">t2</code> è di 2.000 millisecondi e può essere modificato configurando il parametro <code translate="no">segment.assignmentExpiration</code> nel file <code translate="no">data_coord.yaml</code>.</p>
<h2 id="Binlog-file-structure-and-data-persistence" class="common-anchor-header">Struttura del file Binlog e persistenza dei dati<button data-href="#Binlog-file-structure-and-data-persistence" class="anchor-icon" translate="no">
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
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Data_node_flush_86832f46d0.png" alt="Data node flush" class="doc-image" id="data-node-flush" />
   </span> <span class="img-wrapper"> <span>Nodo dei dati</span> </span></p>
<p>Il nodo dati si iscrive all'archivio dei messaggi perché le richieste di inserimento dei dati sono conservate nell'archivio dei messaggi e i nodi dati possono quindi consumare i messaggi di inserimento. I nodi dati inseriscono prima le richieste di inserimento in un buffer di inserimento e, man mano che le richieste si accumulano, vengono scaricate nell'object storage dopo aver raggiunto una soglia.</p>
<h3 id="Binlog-file-structure" class="common-anchor-header">Struttura del file Binlog</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Binlog_file_structure_ca2897a095.png" alt="Binlog file structure." class="doc-image" id="binlog-file-structure." />
   </span> <span class="img-wrapper"> <span>Struttura del file binlog</span>. </span></p>
<p>La struttura del file binlog in Milvus è simile a quella di MySQL. Il binlog è utilizzato per due funzioni: il recupero dei dati e la creazione di indici.</p>
<p>Un binlog contiene molti <a href="https://github.com/milvus-io/milvus/blob/master/docs/developer_guides/chap08_binlog.md#event-format">eventi</a>. Ogni evento ha un'intestazione e dei dati.</p>
<p>I metadati, tra cui l'ora di creazione del binlog, l'ID del nodo di scrittura, la lunghezza dell'evento e NextPosition (l'offset dell'evento successivo), ecc. sono scritti nell'intestazione dell'evento.</p>
<p>I dati dell'evento possono essere suddivisi in due parti: fissa e variabile.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/File_structure_of_an_insert_event_829b1f628d.png" alt="File structure of an insert event." class="doc-image" id="file-structure-of-an-insert-event." />
   </span> <span class="img-wrapper"> <span>Struttura del file di un evento di inserimento</span>. </span></p>
<p>La parte fissa dei dati dell'evento <code translate="no">INSERT_EVENT</code> contiene <code translate="no">StartTimestamp</code>, <code translate="no">EndTimestamp</code> e <code translate="no">reserved</code>.</p>
<p>La parte variabile, invece, contiene i dati inseriti. I dati di inserimento sono sequenziati nel formato del parquet e memorizzati in questo file.</p>
<h3 id="Data-persistence" class="common-anchor-header">Persistenza dei dati</h3><p>Se ci sono più colonne nello schema, Milvus memorizza i binlog nelle colonne.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Binlog_data_persistence_0c028bf26a.png" alt="Binlog data persistence." class="doc-image" id="binlog-data-persistence." />
   </span> <span class="img-wrapper"> <span>Persistenza dei dati binlog</span>. </span></p>
<p>Come illustrato nell'immagine precedente, la prima colonna è la chiave primaria binlog. La seconda è la colonna timestamp. Le altre sono le colonne definite nello schema. Il percorso dei file binlog in MinIO è indicato anche nell'immagine precedente.</p>
<h2 id="About-the-Deep-Dive-Series" class="common-anchor-header">Informazioni sulla serie Deep Dive<button data-href="#About-the-Deep-Dive-Series" class="anchor-icon" translate="no">
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
    </button></h2><p>Con l'<a href="https://milvus.io/blog/2022-1-25-annoucing-general-availability-of-milvus-2-0.md">annuncio ufficiale della disponibilità generale</a> di Milvus 2.0, abbiamo organizzato questa serie di blog Milvus Deep Dive per fornire un'interpretazione approfondita dell'architettura e del codice sorgente di Milvus. Gli argomenti trattati in questa serie di blog includono:</p>
<ul>
<li><a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md">Panoramica dell'architettura Milvus</a></li>
<li><a href="https://milvus.io/blog/deep-dive-2-milvus-sdk-and-api.md">API e SDK Python</a></li>
<li><a href="https://milvus.io/blog/deep-dive-3-data-processing.md">Elaborazione dei dati</a></li>
<li><a href="https://milvus.io/blog/deep-dive-4-data-insertion-and-data-persistence.md">Gestione dei dati</a></li>
<li><a href="https://milvus.io/blog/deep-dive-5-real-time-query.md">Interrogazione in tempo reale</a></li>
<li><a href="https://milvus.io/blog/deep-dive-7-query-expression.md">Motore di esecuzione scalare</a></li>
<li><a href="https://milvus.io/blog/deep-dive-6-oss-qa.md">Sistema QA</a></li>
<li><a href="https://milvus.io/blog/deep-dive-8-knowhere.md">Motore di esecuzione vettoriale</a></li>
</ul>
