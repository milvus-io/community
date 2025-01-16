---
id: deep-dive-5-real-time-query.md
title: Utilizzo del database vettoriale Milvus per le interrogazioni in tempo reale
author: Xi Ge
date: 2022-04-11T00:00:00.000Z
desc: Scoprite il meccanismo di base delle query in tempo reale in Milvus.
cover: assets.zilliz.com/deep_dive_5_5e9175c7f7.png
tag: Engineering
tags: 'Data science, Database, Technology, Artificial Intelligence, Vector Management'
canonicalUrl: 'https://milvus.io/blog/deep-dive-5-real-time-query.md'
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/deep_dive_5_5e9175c7f7.png" alt="Cover image" class="doc-image" id="cover-image" />
   </span> <span class="img-wrapper"> <span>Immagine di copertina</span> </span></p>
<blockquote>
<p>Questo articolo è stato scritto da <a href="https://github.com/xige-16">Xi Ge</a> e trascritto da <a href="https://www.linkedin.com/in/yiyun-n-2aa713163/">Angela Ni</a>.</p>
</blockquote>
<p>Nel post precedente abbiamo parlato dell'<a href="https://milvus.io/blog/deep-dive-4-data-insertion-and-data-persistence.md">inserimento e della persistenza dei dati</a> in Milvus. In questo articolo continueremo a spiegare come <a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md">i diversi componenti</a> di Milvus interagiscono tra loro per completare l'interrogazione dei dati in tempo reale.</p>
<p><em>Di seguito sono elencate alcune risorse utili prima di iniziare. Si consiglia di leggerle prima per comprendere meglio l'argomento di questo post.</em></p>
<ul>
<li><a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md">Approfondimento sull'architettura di Milvus</a></li>
<li><a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md#Data-Model">Modello di dati Milvus</a></li>
<li><a href="https://milvus.io/docs/v2.0.x/four_layers.md">Il ruolo e la funzione di ciascun componente di Milvus</a></li>
<li><a href="https://milvus.io/blog/deep-dive-3-data-processing.md">Elaborazione dei dati in Milvus</a></li>
<li><a href="https://milvus.io/blog/deep-dive-4-data-insertion-and-data-persistence.md">Inserimento e persistenza dei dati in Milvus</a></li>
</ul>
<h2 id="Load-data-to-query-node" class="common-anchor-header">Caricare i dati sul nodo di interrogazione<button data-href="#Load-data-to-query-node" class="anchor-icon" translate="no">
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
    </button></h2><p>Prima di eseguire una query, i dati devono essere caricati nei nodi di query.</p>
<p>Ci sono due tipi di dati che vengono caricati sul nodo di query: i dati in streaming dal <a href="https://milvus.io/docs/v2.0.x/four_layers.md#Log-broker">log broker</a> e i dati storici dall'<a href="https://milvus.io/docs/v2.0.x/four_layers.md#Object-storage">object storage</a> (chiamato anche storage persistente).</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/flowchart_b1c51dfdaa.png" alt="Flowchart" class="doc-image" id="flowchart" />
   </span> <span class="img-wrapper"> <span>Diagramma di flusso</span> </span></p>
<p>Il Data Coord è responsabile della gestione dei dati in streaming che vengono continuamente inseriti in Milvus. Quando un utente di Milvus chiama <code translate="no">collection.load()</code> per caricare una collezione, il query coord interroga il data coord per sapere quali segmenti sono stati conservati nello storage e i loro checkpoint corrispondenti. Un checkpoint è un segno che indica che i segmenti persistiti prima del checkpoint sono consumati, mentre quelli dopo il checkpoint non lo sono.</p>
<p>Quindi, la query coord produce una strategia di allocazione basata sulle informazioni della data coord: per segmento o per canale. L'allocatore di segmenti è responsabile dell'allocazione dei segmenti nello storage persistente (dati batch) ai diversi nodi di interrogazione. Ad esempio, nell'immagine precedente, l'allocatore di segmenti assegna i segmenti 1 e 3 (S1, S3) al nodo di interrogazione 1, e i segmenti 2 e 4 (S2, S4) al nodo di interrogazione 2. L'allocatore di canali assegna diversi nodi di interrogazione per guardare più <a href="https://milvus.io/docs/v2.0.x/data_processing.md#Data-insertion">canali di</a> manipolazione dei dati (DMChannels) nel log broker. Ad esempio, nell'immagine precedente, l'allocatore di canali assegna al nodo di query 1 il canale 1 (Ch1) e al nodo di query 2 il canale 2 (Ch2).</p>
<p>Con la strategia di allocazione, ogni nodo di query carica i dati del segmento e guarda i canali di conseguenza. Nel nodo di interrogazione 1 dell'immagine, i dati storici (dati batch) vengono caricati tramite gli allocati S1 e S3 dalla memoria persistente. Nel frattempo, il nodo di query 1 carica i dati incrementali (dati in streaming) abbonandosi al canale 1 del log broker.</p>
<h2 id="Data-management-in-query-node" class="common-anchor-header">Gestione dei dati nel nodo di interrogazione<button data-href="#Data-management-in-query-node" class="anchor-icon" translate="no">
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
    </button></h2><p>Un nodo di interrogazione deve gestire sia i dati storici che quelli incrementali. I dati storici sono memorizzati in <a href="https://milvus.io/blog/deep-dive-4-data-insertion-and-data-persistence.md#Sealed-segment">segmenti sigillati</a>, mentre i dati incrementali sono memorizzati in <a href="https://milvus.io/blog/deep-dive-4-data-insertion-and-data-persistence.md#Growing-segment">segmenti crescenti</a>.</p>
<h3 id="Historical-data-management" class="common-anchor-header">Gestione dei dati storici</h3><p>Le considerazioni da fare per la gestione dei dati storici sono principalmente due: bilanciamento del carico e failover del nodo di query.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/load_balance_c77e22bb5c.png" alt="Load balance" class="doc-image" id="load-balance" />
   </span> <span class="img-wrapper"> <span>Bilanciamento del carico</span> </span></p>
<p>Ad esempio, come mostrato nell'illustrazione, al nodo di query 4 sono stati assegnati più segmenti sigillati rispetto agli altri nodi di query. È molto probabile che il nodo di query 4 diventi il collo di bottiglia che rallenta l'intero processo di interrogazione. Per risolvere questo problema, il sistema deve assegnare diversi segmenti del nodo di query 4 ad altri nodi di query. Questa operazione è chiamata bilanciamento del carico.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Query_node_failover_3278c0e307.png" alt="Query node failover" class="doc-image" id="query-node-failover" />
   </span> <span class="img-wrapper"> <span>Failover del nodo di query</span> </span></p>
<p>Un'altra situazione possibile è illustrata nell'immagine precedente. Uno dei nodi, il nodo di query 4, è improvvisamente inattivo. In questo caso, il carico (segmenti allocati al nodo di query 4) deve essere trasferito ad altri nodi di query funzionanti per garantire l'accuratezza dei risultati della query.</p>
<h3 id="Incremental-data-management" class="common-anchor-header">Gestione incrementale dei dati</h3><p>Il nodo di interrogazione guarda i canali DMC per ricevere dati incrementali. In questo processo viene introdotto il diagramma di flusso. Per prima cosa filtra tutti i messaggi di inserimento dei dati. Questo per garantire che vengano caricati solo i dati di una determinata partizione. Ogni collezione in Milvus ha un canale corrispondente, che è condiviso da tutte le partizioni di quella collezione. Pertanto, è necessario un diagramma di flusso per filtrare i dati inseriti se un utente di Milvus ha bisogno di caricare solo i dati di una determinata partizione. Altrimenti, i dati di tutte le partizioni della collezione saranno caricati sul nodo di interrogazione.</p>
<p>Dopo essere stati filtrati, i dati incrementali vengono inseriti in segmenti crescenti e poi passati ai nodi temporali del server.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/flow_graph_dc58651367.png" alt="Flowgraph" class="doc-image" id="flowgraph" />
   </span> <span class="img-wrapper"> <span>Diagramma di flusso</span> </span></p>
<p>Durante l'inserimento dei dati, a ogni messaggio di inserimento viene assegnato un timestamp. Nel canale DMC mostrato nell'immagine precedente, i dati vengono inseriti in ordine, da sinistra a destra. Il timestamp per il primo messaggio di inserimento è 1; il secondo, 2; e il terzo, 6. Il quarto messaggio segnato in rosso non è un messaggio di inserimento, ma piuttosto un messaggio di timetick. Ciò significa che i dati inseriti i cui timestamp sono inferiori a questo timetick sono già presenti nel log broker. In altre parole, i dati inseriti dopo questo messaggio timetick dovrebbero avere tutti timestamp il cui valore è maggiore di questo timetick. Ad esempio, nell'immagine precedente, quando il nodo di interrogazione percepisce che il timetick corrente è 5, significa che tutti i messaggi di inserimento il cui valore di timestamp è inferiore a 5 sono tutti caricati sul nodo di interrogazione.</p>
<p>Il nodo temporale del server fornisce un valore <code translate="no">tsafe</code> aggiornato ogni volta che riceve un timetick dal nodo di inserimento. <code translate="no">tsafe</code> significa tempo di sicurezza e tutti i dati inseriti prima di questo momento possono essere interrogati. Ad esempio, se <code translate="no">tsafe</code> = 9, tutti i dati inseriti con timestamp inferiori a 9 possono essere interrogati.</p>
<h2 id="Real-time-query-in-Milvus" class="common-anchor-header">Interrogazione in tempo reale in Milvus<button data-href="#Real-time-query-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>L'interrogazione in tempo reale in Milvus è abilitata dai messaggi di interrogazione. I messaggi di query vengono inseriti nel log broker tramite proxy. I nodi di interrogazione ottengono i messaggi di interrogazione osservando il canale di interrogazione nel log broker.</p>
<h3 id="Query-message" class="common-anchor-header">Messaggio di interrogazione</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/query_message_4d57814f47.png" alt="Query message" class="doc-image" id="query-message" />
   </span> <span class="img-wrapper"> <span>Messaggio di query</span> </span></p>
<p>Un messaggio di query include le seguenti informazioni cruciali su una query:</p>
<ul>
<li><code translate="no">msgID</code>: ID messaggio, l'ID del messaggio di query assegnato dal sistema.</li>
<li><code translate="no">collectionID</code>: L'ID della collezione da interrogare (se specificato dall'utente).</li>
<li><code translate="no">execPlan</code>: Il piano di esecuzione è utilizzato principalmente per il filtraggio degli attributi in una query.</li>
<li><code translate="no">service_ts</code>: Il timestamp del servizio sarà aggiornato insieme a <code translate="no">tsafe</code> di cui sopra. Il timestamp del servizio indica il momento in cui il servizio è attivo. Tutti i dati inseriti prima di <code translate="no">service_ts</code> sono disponibili per la query.</li>
<li><code translate="no">travel_ts</code>: Il timestamp del viaggio specifica un intervallo di tempo nel passato. L'interrogazione sarà condotta sui dati esistenti nel periodo di tempo specificato da <code translate="no">travel_ts</code>.</li>
<li><code translate="no">guarantee_ts</code>: Il timestamp di garanzia specifica un periodo di tempo dopo il quale la query deve essere condotta. La query verrà eseguita solo quando <code translate="no">service_ts</code> &gt; <code translate="no">guarantee_ts</code>.</li>
</ul>
<h3 id="Real-time-query" class="common-anchor-header">Interrogazione in tempo reale</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/query_process_7f676972d8.png" alt="Query process" class="doc-image" id="query-process" />
   </span> <span class="img-wrapper"> <span>Processo di interrogazione</span> </span></p>
<p>Quando riceve un messaggio di interrogazione, Milvus valuta innanzitutto se il tempo di servizio corrente, <code translate="no">service_ts</code>, è maggiore del timestamp di garanzia, <code translate="no">guarantee_ts</code>, contenuto nel messaggio di interrogazione. In caso affermativo, la query viene eseguita. La query sarà condotta in parallelo sia sui dati storici che su quelli incrementali. Poiché può esserci una sovrapposizione di dati tra i dati in streaming e i dati batch, è necessaria un'azione chiamata "riduzione locale" per filtrare i risultati ridondanti della query.</p>
<p>Tuttavia, se il tempo di servizio corrente è inferiore al timestamp di garanzia in un messaggio di query appena inserito, il messaggio di query diventerà un messaggio irrisolto e attenderà di essere elaborato finché il tempo di servizio non diventerà maggiore del timestamp di garanzia.</p>
<p>I risultati delle query vengono infine inviati al canale dei risultati. Il proxy ottiene i risultati della query da quel canale. Allo stesso modo, il proxy effettuerà una "riduzione globale" perché riceve i risultati da più nodi di interrogazione e i risultati delle interrogazioni potrebbero essere ripetitivi.</p>
<p>Per garantire che il proxy abbia ricevuto tutti i risultati della query prima di restituirli all'SDK, il messaggio di risultato terrà anche un registro delle informazioni, compresi i segmenti sigillati ricercati, i canali DMC ricercati e i segmenti sigillati globali (tutti i segmenti su tutti i nodi di query). Il sistema può concludere che il proxy ha ricevuto tutti i risultati della query solo se sono soddisfatte entrambe le condizioni seguenti:</p>
<ul>
<li>L'unione di tutti i segmenti sigillati ricercati registrati in tutti i messaggi di risultato è maggiore dei segmenti sigillati globali,</li>
<li>Tutti i canali DMC della collezione sono stati interrogati.</li>
</ul>
<p>Infine, il proxy restituisce i risultati finali dopo la "riduzione globale" all'SDK Milvus.</p>
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
