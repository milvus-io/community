---
id: deep-dive-3-data-processing.md
title: Come vengono elaborati i dati in un database vettoriale?
author: Zhenshan Cao
date: 2022-03-28T00:00:00.000Z
desc: >-
  Milvus fornisce un'infrastruttura di gestione dei dati essenziale per le
  applicazioni AI di produzione. Questo articolo svela le complessità
  dell'elaborazione dei dati al suo interno.
cover: assets.zilliz.com/How_Is_Data_Processed_in_a_Vector_Database_9fb236bc01.png
tag: Engineering
tags: 'Data science, Database, Technology, Artificial Intelligence, Vector Management'
canonicalUrl: 'https://milvus.io/blog/deep-dive-3-data-processing.md'
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/How_Is_Data_Processed_in_a_Vector_Database_9fb236bc01.png" alt="Cover image" class="doc-image" id="cover-image" />
   </span> <span class="img-wrapper"> <span>Immagine di copertina</span> </span></p>
<blockquote>
<p>Questo articolo è stato scritto da <a href="https://github.com/czs007">Zhenshan Cao</a> e trascritto da <a href="https://www.linkedin.com/in/yiyun-n-2aa713163/">Angela Ni</a>.</p>
</blockquote>
<p>Nei due post precedenti di questa serie di blog, abbiamo già trattato l'<a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md">architettura del sistema</a> di Milvus, il database vettoriale più avanzato al mondo, e il suo <a href="https://milvus.io/blog/deep-dive-2-milvus-sdk-and-api.md">SDK e API Python</a>.</p>
<p>Questo post si propone principalmente di aiutarvi a capire come vengono elaborati i dati in Milvus, approfondendo il sistema Milvus ed esaminando l'interazione tra i componenti di elaborazione dei dati.</p>
<p><em>Di seguito sono elencate alcune risorse utili prima di iniziare. Si consiglia di leggerle prima per comprendere meglio l'argomento di questo post.</em></p>
<ul>
<li><a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md">Approfondimento dell'architettura di Milvus</a></li>
<li><a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md#Data-Model">Modello di dati Milvus</a></li>
<li><a href="https://milvus.io/docs/v2.0.x/four_layers.md">Il ruolo e la funzione di ogni componente di Milvus</a></li>
<li><a href="https://milvus.io/docs/v2.0.x/data_processing.md">Elaborazione dei dati in Milvus</a></li>
</ul>
<h2 id="MsgStream-interface" class="common-anchor-header">Interfaccia MsgStream<button data-href="#MsgStream-interface" class="anchor-icon" translate="no">
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
    </button></h2><p>L<a href="https://github.com/milvus-io/milvus/blob/ca129d4308cc7221bb900b3722dea9b256e514f9/docs/developer_guides/chap04_message_stream.md">'interfaccia MsgStream</a> è fondamentale per l'elaborazione dei dati in Milvus. Quando si chiama <code translate="no">Start()</code>, la coroutine in background scrive i dati nel <a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md#Log-as-data">log broker</a> o li legge. Quando viene chiamato <code translate="no">Close()</code>, la coroutine si ferma.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Msg_Stream_interface_66b70309a7.png" alt="MsgStream interface" class="doc-image" id="msgstream-interface" />
   </span> <span class="img-wrapper"> <span>Interfaccia MsgStream</span> </span></p>
<p>MsgStream può fungere da produttore e da consumatore. L'interfaccia <code translate="no">AsProducer(channels []string)</code> definisce MsgStream come produttore, mentre <code translate="no">AsConsumer(channels []string, subNamestring)</code>lo definisce come consumatore. Il parametro <code translate="no">channels</code> è condiviso in entrambe le interfacce ed è usato per definire in quali canali (fisici) scrivere o leggere i dati.</p>
<blockquote>
<p>Il numero di frammenti di una collezione può essere specificato al momento della sua creazione. Ogni frammento corrisponde a un <a href="https://milvus.io/docs/v2.0.x/glossary.md#VChannel">canale virtuale (vchannel)</a>. Pertanto, una collezione può avere più canali virtuali. Milvus assegna a ogni vchannel del log broker un <a href="https://milvus.io/docs/v2.0.x/glossary.md#PChannel">canale fisico (pchannel)</a>.</p>
</blockquote>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Each_virtual_channel_shard_corresponds_to_a_physical_channel_7cd60e4ed1.png" alt="Each virtual channel/shard corresponds to a physical channel." class="doc-image" id="each-virtual-channel/shard-corresponds-to-a-physical-channel." />
   </span> <span class="img-wrapper"> <span>A ogni canale virtuale/shard corrisponde un canale fisico</span>. </span></p>
<p><code translate="no">Produce()</code> nell'interfaccia MsgStream, incaricata di scrivere i dati nei pchannel del log broker. I dati possono essere scritti in due modi:</p>
<ul>
<li>Scrittura singola: le entità vengono scritte in diversi shard (vchannel) in base ai valori hash delle chiavi primarie. Poi queste entità confluiscono nei corrispondenti pcanali del log broker.</li>
<li>Scrittura broadcast: le entità vengono scritte in tutti i pcanali specificati dal parametro <code translate="no">channels</code>.</li>
</ul>
<p><code translate="no">Consume()</code> è un tipo di API bloccante. Se non ci sono dati disponibili nel pcanale specificato, la coroutine viene bloccata quando <code translate="no">Consume()</code> viene chiamata nell'interfaccia MsgStream. D'altra parte, <code translate="no">Chan()</code> è un'API non bloccante, il che significa che la coroutine legge ed elabora i dati solo se ci sono dati esistenti nel pchannel specificato. In caso contrario, la coroutine può elaborare altri task e non viene bloccata quando non ci sono dati disponibili.</p>
<p><code translate="no">Seek()</code> è un metodo per il recupero dei guasti. Quando viene avviato un nuovo nodo, è possibile ottenere il record di consumo dei dati e riprendere il consumo dei dati dal punto in cui è stato interrotto chiamando <code translate="no">Seek()</code>.</p>
<h2 id="Write-data" class="common-anchor-header">Scrittura dei dati<button data-href="#Write-data" class="anchor-icon" translate="no">
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
    </button></h2><p>I dati scritti nei diversi vcanali (shard) possono essere messaggi di inserimento o di cancellazione. Questi vcanali possono anche essere chiamati DmChannels (canali di manipolazione dei dati).</p>
<p>Collezioni diverse possono condividere gli stessi pcanali nel log broker. Una collezione può avere più shard e quindi più vcanali corrispondenti. Le entità di una stessa raccolta confluiscono di conseguenza in più canali p corrispondenti nel log broker. Di conseguenza, il vantaggio della condivisione dei canali p è un aumento del volume di throughput consentito da un'elevata concurrency del log broker.</p>
<p>Quando si crea una collezione, non solo si specifica il numero di shard, ma si decide anche la mappatura tra vchannels e pchannels nel log broker.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Write_path_in_Milvus_00d93fb377.png" alt="Write path in Milvus" class="doc-image" id="write-path-in-milvus" />
   </span> <span class="img-wrapper"> <span>Percorso di scrittura in Milvus</span> </span></p>
<p>Come mostrato nell'illustrazione precedente, nel percorso di scrittura, i proxy scrivono i dati nel log broker tramite l'interfaccia <code translate="no">AsProducer()</code> di MsgStream. I nodi dati consumano i dati, quindi li convertono e li memorizzano nella memoria degli oggetti. Il percorso di memorizzazione è un tipo di meta-informazione che verrà registrata in etcd dai coordinatori dei dati.</p>
<h3 id="Flowgraph" class="common-anchor-header">Diagramma di flusso</h3><p>Poiché diverse collezioni possono condividere gli stessi pcanali nel log broker, quando si consumano i dati, i nodi dati o i nodi di interrogazione devono giudicare a quale collezione appartengono i dati in un pcanale. Per risolvere questo problema, abbiamo introdotto il flowgraph in Milvus. Il suo compito principale è quello di filtrare i dati in un canale p condiviso in base agli ID delle raccolte. Quindi, possiamo dire che ogni flowgraph gestisce il flusso di dati in un corrispondente shard (vchannel) di una collezione.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Flowgraph_in_write_path_1b201e1b71.png" alt="Flowgraph in write path" class="doc-image" id="flowgraph-in-write-path" />
   </span> <span class="img-wrapper"> <span>Flowgraph nel percorso di scrittura</span> </span></p>
<h3 id="MsgStream-creation" class="common-anchor-header">Creazione di MsgStream</h3><p>Durante la scrittura dei dati, l'oggetto MsgStream viene creato nei due scenari seguenti:</p>
<ul>
<li>Quando il proxy riceve una richiesta di inserimento dati, cerca innanzitutto di ottenere la mappatura tra vchannels e pchannels tramite il root coordinator (root coord). Quindi il proxy crea un oggetto MsgStream.</li>
</ul>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Creating_Msg_Stream_object_in_write_path_Scenario_1_bdd0f94d8b.png" alt="Scenario 1" class="doc-image" id="scenario-1" />
   </span> <span class="img-wrapper"> <span>Scenario 1</span> </span></p>
<ul>
<li>Quando il nodo dati si avvia e legge le meta-informazioni dei canali in etcd, viene creato l'oggetto MsgStream.</li>
</ul>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Creating_Msg_Stream_object_in_write_path_Scenario_2_5b3f99a6d1.png" alt="Scenario 2" class="doc-image" id="scenario-2" />
   </span> <span class="img-wrapper"> <span>Scenario 2</span> </span></p>
<h2 id="Read-data" class="common-anchor-header">Leggere i dati<button data-href="#Read-data" class="anchor-icon" translate="no">
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
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Read_path_in_Milvus_c2f0ae5109.png" alt="Read path in Milvus" class="doc-image" id="read-path-in-milvus" />
   </span> <span class="img-wrapper"> <span>Percorso di lettura in Milvus</span> </span></p>
<p>Il flusso di lavoro generale della lettura dei dati è illustrato nell'immagine qui sopra. Le richieste di interrogazione vengono trasmesse tramite DqRequestChannel ai nodi di interrogazione. I nodi di interrogazione eseguono le attività di interrogazione in parallelo. I risultati delle query passano attraverso gRPC e il proxy aggrega i risultati e li restituisce al client.</p>
<p>Per dare un'occhiata più da vicino al processo di lettura dei dati, possiamo vedere che il proxy scrive le richieste di query in DqRequestChannel. I nodi di interrogazione consumano quindi i messaggi sottoscrivendo il DqRequestChannel. Ogni messaggio nel DqRequestChannel viene trasmesso in broadcast, in modo che tutti i nodi di interrogazione sottoscritti possano riceverlo.</p>
<p>Quando i nodi di interrogazione ricevono le richieste di interrogazione, eseguono un'interrogazione locale sia sui dati batch memorizzati in segmenti sigillati, sia sui dati in streaming inseriti dinamicamente in Milvus e memorizzati in segmenti in crescita. In seguito, i nodi di interrogazione devono aggregare i risultati dell'interrogazione in entrambi i <a href="https://milvus.io/docs/v2.0.x/glossary.md#Segment">segmenti sigillati e in crescita</a>. Questi risultati aggregati vengono passati al proxy tramite gRPC.</p>
<p>Il proxy raccoglie tutti i risultati da più nodi di interrogazione e li aggrega per ottenere i risultati finali. Quindi il proxy restituisce i risultati finali della query al client. Poiché ogni richiesta di query e i relativi risultati sono contrassegnati dallo stesso requestID univoco, il proxy può capire quali risultati corrispondono a quale richiesta di query.</p>
<h3 id="Flowgraph" class="common-anchor-header">Diagramma di flusso</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Flowgraph_in_read_path_8a5faf2d58.png" alt="Flowgraph in read path" class="doc-image" id="flowgraph-in-read-path" />
   </span> <span class="img-wrapper"> <span>Diagramma di flusso nel percorso di lettura</span> </span></p>
<p>Analogamente al percorso di scrittura, i diagrammi di flusso sono introdotti anche nel percorso di lettura. Milvus implementa l'architettura Lambda unificata, che integra l'elaborazione dei dati incrementali e storici. Pertanto, i nodi di interrogazione devono ottenere anche dati in streaming in tempo reale. Allo stesso modo, i flowgraph nel percorso di lettura filtrano e differenziano i dati provenienti da raccolte diverse.</p>
<h3 id="MsgStream-creation" class="common-anchor-header">Creazione di MsgStream</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Creating_Msg_Stream_object_in_read_path_7f059bde2f.png" alt="Creating MsgStream object in read path" class="doc-image" id="creating-msgstream-object-in-read-path" />
   </span> <span class="img-wrapper"> <span>Creazione dell'oggetto MsgStream nel percorso di lettura</span> </span></p>
<p>Durante la lettura dei dati, l'oggetto MsgStream viene creato nel seguente scenario:</p>
<ul>
<li>In Milvus, i dati non possono essere letti se non vengono caricati. Quando il proxy riceve una richiesta di caricamento dei dati, la invia al coordinatore delle interrogazioni, che decide come assegnare gli shard ai diversi nodi di interrogazione. Le informazioni di assegnazione (cioè i nomi dei vcanali e la mappatura tra i vcanali e i corrispondenti pcanali) vengono inviate ai nodi di interrogazione tramite chiamata di metodo o RPC (remote procedure call). Successivamente, i nodi di interrogazione creano gli oggetti MsgStream corrispondenti per consumare i dati.</li>
</ul>
<h2 id="DDL-operations" class="common-anchor-header">Operazioni DDL<button data-href="#DDL-operations" class="anchor-icon" translate="no">
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
    </button></h2><p>DDL è l'acronimo di data definition language. Le operazioni DDL sui metadati possono essere classificate in richieste di scrittura e richieste di lettura. Tuttavia, questi due tipi di richieste sono trattati allo stesso modo durante l'elaborazione dei metadati.</p>
<p>Le richieste di lettura sui metadati includono:</p>
<ul>
<li>Schema di raccolta delle query</li>
<li>Informazioni sull'indicizzazione delle query e altro ancora</li>
</ul>
<p>Le richieste di scrittura includono</p>
<ul>
<li>Creare una raccolta</li>
<li>Eliminare una raccolta</li>
<li>Creare un indice</li>
<li>Eliminare un indice e altro ancora</li>
</ul>
<p>Le richieste DDL vengono inviate al proxy dal client e il proxy le trasmette nell'ordine ricevuto al root coord, che assegna un timestamp per ogni richiesta DDL e conduce controlli dinamici sulle richieste. Il proxy gestisce ogni richiesta in modo seriale, cioè una richiesta DDL alla volta. Il proxy non elaborerà la richiesta successiva finché non avrà completato l'elaborazione della richiesta precedente e non avrà ricevuto i risultati dal root coord.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/DDL_operations_02679a393c.png" alt="DDL operations." class="doc-image" id="ddl-operations." />
   </span> <span class="img-wrapper"> <span>Operazioni DDL</span>. </span></p>
<p>Come mostrato nell'illustrazione precedente, ci sono <code translate="no">K</code> richieste DDL nella coda dei task di Root coord. Le richieste DDL nella coda dei task sono disposte nell'ordine in cui sono state ricevute dal root coord. Quindi, <code translate="no">ddl1</code> è la prima inviata al root coord e <code translate="no">ddlK</code> è l'ultima di questo gruppo. Il root coord elabora le richieste una per una nell'ordine temporale.</p>
<p>In un sistema distribuito, la comunicazione tra i proxy e il root coord è abilitata da gRPC. Il root coord tiene un registro del valore massimo del timestamp dei task eseguiti per garantire che tutte le richieste DDL siano elaborate in ordine temporale.</p>
<p>Si supponga che esistano due proxy indipendenti, il proxy 1 e il proxy 2. Entrambi inviano richieste DDL al sistema di gestione dei dati. Entrambi inviano richieste DDL alla stessa root coord. Tuttavia, un problema è che le richieste precedenti non vengono necessariamente inviate alla root coord prima di quelle ricevute da un altro proxy più tardi. Ad esempio, nell'immagine precedente, quando <code translate="no">DDL_K-1</code> viene inviato al root coord dal proxy 1, <code translate="no">DDL_K</code> dal proxy 2 è già stato accettato ed eseguito dal root coord. Come registrato dal root coord, il valore massimo del timestamp dei task eseguiti a questo punto è <code translate="no">K</code>. Quindi, per non interrompere l'ordine temporale, la richiesta <code translate="no">DDL_K-1</code> sarà rifiutata dalla coda dei task del coord root. Tuttavia, se il proxy 2 invia la richiesta <code translate="no">DDL_K+5</code> al coord. radice a questo punto, la richiesta sarà accettata nella coda dei task e sarà eseguita successivamente in base al suo valore di timestamp.</p>
<h2 id="Indexing" class="common-anchor-header">Indicizzazione<button data-href="#Indexing" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Building-an-index" class="common-anchor-header">Creazione di un indice</h3><p>Quando riceve le richieste di costruzione di un indice dal client, il proxy esegue innanzitutto dei controlli statici sulle richieste e le invia al root coord. Quindi il coord root persiste queste richieste di costruzione dell'indice nel meta storage (etcd) e invia le richieste al coordinatore dell'indice (index coord).</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Building_an_index_e130a4e715.png" alt="Building an index." class="doc-image" id="building-an-index." />
   </span> <span class="img-wrapper"> <span>Costruzione di un indice</span>. </span></p>
<p>Come illustrato in precedenza, quando il coordinatore dell'indice riceve richieste di costruzione dell'indice dal coordinatore principale, per prima cosa persiste l'attività in etcd per il meta store. Lo stato iniziale dell'attività di costruzione dell'indice è <code translate="no">Unissued</code>. Il coord indice mantiene un registro del carico di attività di ogni nodo indice e invia le attività in entrata a un nodo indice meno carico. Al completamento dell'attività, il nodo indice scrive lo stato dell'attività, <code translate="no">Finished</code> o <code translate="no">Failed</code>, nella meta memoria, che è etcd in Milvus. In seguito, il nodo indice capirà se il compito di costruzione dell'indice è riuscito o fallito cercando in etcd. Se il compito fallisce a causa di risorse di sistema limitate o dell'abbandono del nodo indice, l'index coord riattiva l'intero processo e assegna lo stesso compito a un altro nodo indice.</p>
<h3 id="Dropping-an-index" class="common-anchor-header">Abbandono di un indice</h3><p>Inoltre, l'index coord è anche responsabile delle richieste di abbandono degli indici.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Dropping_an_index_afdab6a339.png" alt="Dropping an index." class="doc-image" id="dropping-an-index." />
   </span> <span class="img-wrapper"> <span>Abbandono di un indice</span>. </span></p>
<p>Quando il root coord riceve una richiesta di abbandono di un indice da parte del client, per prima cosa contrassegna l'indice come &quot;abbandonato&quot; e restituisce il risultato al client, notificandolo al coord indice. Quindi il coord indice filtra tutte le attività di indicizzazione con <code translate="no">IndexID</code> e quelle che soddisfano la condizione vengono abbandonate.</p>
<p>La coroutine in background dell'index coord eliminerà gradualmente tutti i task di indicizzazione contrassegnati come "dropped" dallo storage degli oggetti (MinIO e S3). Questo processo coinvolge l'interfaccia recycleIndexFiles. Quando tutti i file di indice corrispondenti vengono eliminati, le metainformazioni dei task di indicizzazione eliminati vengono rimosse dal meta storage (etcd).</p>
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
