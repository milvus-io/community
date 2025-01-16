---
id: deep-dive-1-milvus-architecture-overview.md
title: Costruire un database vettoriale per una ricerca di similarità scalabile
author: Xiaofan Luan
date: 2022-03-14T00:00:00.000Z
desc: >-
  Il primo di una serie di blog che analizzano da vicino il processo di pensiero
  e i principi di progettazione alla base della costruzione del più popolare
  database vettoriale open-source.
cover: assets.zilliz.com/20220705_102717_dd4124dee3.png
tag: Engineering
tags: 'Data science, Database, Technology, Artificial Intelligence, Vector Management'
canonicalUrl: 'https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md'
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/20220705_102717_dd4124dee3.png" alt="Cover image" class="doc-image" id="cover-image" />
   </span> <span class="img-wrapper"> <span>Immagine di copertina</span> </span></p>
<blockquote>
<p>Questo articolo è stato scritto da Xiaofan Luan e trascritto da Angela Ni e Claire Yu.</p>
</blockquote>
<p>Secondo le <a href="https://mitsloan.mit.edu/ideas-made-to-matter/tapping-power-unstructured-data">statistiche</a>, circa l'80%-90% dei dati mondiali è non strutturato. Alimentata dalla rapida crescita di Internet, nei prossimi anni si prevede un'esplosione di dati non strutturati. Di conseguenza, le aziende hanno urgentemente bisogno di un database potente che le aiuti a gestire e comprendere meglio questo tipo di dati. Tuttavia, sviluppare un database è sempre più facile a dirsi che a farsi. Questo articolo si propone di condividere il processo di pensiero e i principi di progettazione della costruzione di Milvus, un database vettoriale open-source e cloud-native per la ricerca scalabile di similarità. Questo articolo spiega anche l'architettura di Milvus in dettaglio.</p>
<p>Vai a:</p>
<ul>
<li><a href="#Unstructured-data-requires-a-complete-basic-software-stack">I dati non strutturati richiedono uno stack software di base completo</a><ul>
<li><a href="#Vectors-and-scalars">Vettori e scalari</a></li>
<li><a href="#From-vector-search-engine-to-vector-database">Da motore di ricerca vettoriale a database vettoriale</a></li>
<li><a href="#A-cloud-native-first-approach">Un approccio cloud-nativo</a></li>
</ul></li>
<li><a href="#The-design-principles-of-Milvus-20">I principi di progettazione di Milvus 2.0</a><ul>
<li><a href="#Log-as-data">Il log come dato</a></li>
<li><a href="#Duality-of-table-and-log">Dualità tra tabella e log</a></li>
<li><a href="#Log-persistency">Persistenza dei log</a></li>
</ul></li>
<li><a href="#Building-a-vector-database-for-scalable-similarity-search">Costruire un database vettoriale per la ricerca scalabile di similarità</a><ul>
<li><a href="#Standalone-and-cluster">Standalone e cluster</a></li>
<li><a href="#A-bare-bones-skeleton-of-the-Milvus-architecture">Uno scheletro essenziale dell'architettura Milvus</a></li>
<li><a href="#Data-Model">Modello di dati</a></li>
</ul></li>
</ul>
<h2 id="Unstructured-data-requires-a-complete-basic-software-stack" class="common-anchor-header">I dati non strutturati richiedono uno stack di software di base completo<button data-href="#Unstructured-data-requires-a-complete-basic-software-stack" class="anchor-icon" translate="no">
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
    </button></h2><p>Con la crescita e l'evoluzione di Internet, i dati non strutturati sono diventati sempre più comuni: e-mail, documenti, dati dei sensori IoT, foto di Facebook, strutture proteiche e molto altro. Affinché i computer possano comprendere ed elaborare i dati non strutturati, questi vengono convertiti in vettori utilizzando <a href="https://zilliz.com/learn/embedding-generation">tecniche di incorporazione</a>.</p>
<p>Milvus memorizza e indicizza questi vettori e analizza la correlazione tra due vettori calcolandone la distanza di similarità. Se i due vettori di incorporazione sono molto simili, significa che anche le fonti di dati originali sono simili.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Frame_1_6_5e0ab80f2c.png" alt="The workflow of processing unstructured data." class="doc-image" id="the-workflow-of-processing-unstructured-data." />
   </span> <span class="img-wrapper"> <span>Il flusso di lavoro dell'elaborazione dei dati non strutturati</span>. </span></p>
<h3 id="Vectors-and-scalars" class="common-anchor-header">Vettori e scalari</h3><p>Uno scalare è una quantità che è descritta solo da una misura - la grandezza. Uno scalare può essere rappresentato come un numero. Per esempio, un'automobile viaggia alla velocità di 80 km/h. La velocità (80 km/h) è uno scalare. Un vettore, invece, è una grandezza descritta da almeno due misure: la grandezza e la direzione. Se un'auto viaggia verso ovest alla velocità di 80 km/h, la velocità (80 km/h ovest) è un vettore. L'immagine seguente è un esempio di scalari e vettori comuni.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Frame_1_7_90a142ab5b.png" alt="Scalars vs. Vectors" class="doc-image" id="scalars-vs.-vectors" />
   </span> <span class="img-wrapper"> <span>Scalari e vettori</span> </span></p>
<p>Poiché la maggior parte dei dati importanti ha più di un attributo, possiamo comprenderli meglio se li convertiamo in vettori. Un modo comune per manipolare i dati vettoriali è quello di calcolare la distanza tra i vettori utilizzando <a href="https://milvus.io/docs/v2.0.x/metric.md">metriche</a> come la distanza euclidea, il prodotto interno, la distanza di Tanimoto, la distanza di Hamming, ecc. Più la distanza è vicina, più i vettori sono simili. Per interrogare in modo efficiente un enorme set di dati vettoriali, possiamo organizzare i dati vettoriali costruendo indici su di essi. Una volta indicizzato il set di dati, le query possono essere indirizzate verso i cluster, o sottoinsiemi di dati, che hanno maggiori probabilità di contenere vettori simili alla query di input.</p>
<p>Per saperne di più sugli indici, consultare <a href="https://milvus.io/docs/v2.0.x/index.md">Vector Index</a>.</p>
<h3 id="From-vector-search-engine-to-vector-database" class="common-anchor-header">Da motore di ricerca vettoriale a database vettoriale</h3><p>Fin dall'inizio, Milvus 2.0 è stato progettato per servire non solo come motore di ricerca, ma soprattutto come potente database vettoriale.</p>
<p>Un modo per farvi capire la differenza è quello di fare un'analogia tra <a href="https://dev.mysql.com/doc/refman/5.7/en/innodb-introduction.html">InnoDB</a> e <a href="https://www.mysql.com/">MySQL</a>, o <a href="https://lucene.apache.org/">Lucene</a> ed <a href="https://www.elastic.co/">Elasticsearch</a>.</p>
<p>Proprio come MySQL ed Elasticsearch, anche Milvus è costruito sulla base di librerie open-source come <a href="https://github.com/facebookresearch/faiss">Faiss</a>, <a href="https://github.com/nmslib/hnswlib">HNSW</a>, <a href="https://github.com/spotify/annoy">Annoy</a>, che si concentrano sulla fornitura di funzionalità di ricerca e sulla garanzia di prestazioni di ricerca. Tuttavia, sarebbe ingiusto degradare Milvus a mero strato superiore a Faiss, poiché memorizza, recupera e analizza vettori e, proprio come qualsiasi altro database, fornisce anche un'interfaccia standard per le operazioni CRUD. Inoltre, Milvus vanta anche caratteristiche quali:</p>
<ul>
<li>Sharding e partizionamento</li>
<li>Replica</li>
<li>Recupero di emergenza</li>
<li>Bilanciamento del carico</li>
<li>Parser o ottimizzatore di query</li>
</ul>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/database_d912320ea7.png" alt="Vector database" class="doc-image" id="vector-database" />
   </span> <span class="img-wrapper"> <span>Database vettoriale</span> </span></p>
<p>Per una comprensione più completa di cosa sia un database vettoriale, leggete il blog <a href="https://zilliz.com/learn/what-is-vector-database">qui</a>.</p>
<h3 id="A-cloud-native-first-approach" class="common-anchor-header">Un approccio cloud-nativo</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/image_2_be82d762db.png" alt="Could-native approach" class="doc-image" id="could-native-approach" />
   </span> <span class="img-wrapper"> <span>Approccio cloud-nativo</span> </span></p>
<h4 id="From-shared-nothing-to-shared-storage-then-to-shared-something" class="common-anchor-header">Dal nulla condiviso, allo storage condiviso, quindi al qualcosa condiviso</h4><p>I database tradizionali adottavano un'architettura "shared nothing" in cui i nodi dei sistemi distribuiti sono indipendenti ma collegati in rete. La memoria o lo storage non sono condivisi tra i nodi. Tuttavia, <a href="https://docs.snowflake.com/en/user-guide/intro-key-concepts.html">Snowflake</a> ha rivoluzionato il settore introducendo un'architettura "shared storage" in cui l'elaborazione (query processing) è separata dalla memorizzazione (database storage). Con un'architettura di storage condiviso, i database possono ottenere una maggiore disponibilità, scalabilità e riduzione della duplicazione dei dati. Ispirandosi a Snowflake, molte aziende hanno iniziato a sfruttare l'infrastruttura basata sul cloud per la persistenza dei dati, utilizzando lo storage locale per il caching. Questo tipo di architettura di database è chiamata "shared something" (qualcosa di condiviso) ed è diventata oggi l'architettura mainstream nella maggior parte delle applicazioni.</p>
<p>Oltre all'architettura "shared something", Milvus supporta la scalabilità flessibile di ogni componente utilizzando Kubernetes per gestire il motore di esecuzione e separando i servizi di lettura, scrittura e altri servizi con microservizi.</p>
<h4 id="Database-as-a-service-DBaaS" class="common-anchor-header">Database come servizio (DBaaS)</h4><p>Il database as a service è una tendenza molto diffusa, poiché molti utenti non si preoccupano solo delle normali funzionalità del database, ma desiderano anche servizi più vari. Ciò significa che, oltre alle tradizionali operazioni CRUD, il nostro database deve arricchire il tipo di servizi che può fornire, come la gestione del database, il trasporto dei dati, il caricamento, la visualizzazione, ecc.</p>
<h4 id="Synergy-with-the-broader-open-source-ecosystem" class="common-anchor-header">Sinergia con il più ampio ecosistema open-source</h4><p>Un'altra tendenza nello sviluppo dei database è quella di sfruttare la sinergia tra il database e altre infrastrutture cloud-native. Nel caso di Milvus, esso si basa su alcuni sistemi open-source. Ad esempio, Milvus utilizza <a href="https://etcd.io/">etcd</a> per la memorizzazione dei metadati. Adotta anche la coda di messaggi, un tipo di comunicazione asincrona da servizio a servizio utilizzata nell'architettura a microservizi, che può aiutare a esportare dati incrementali.</p>
<p>In futuro, speriamo di costruire Milvus in cima a infrastrutture di AI come <a href="https://spark.apache.org/">Spark</a> o <a href="https://www.tensorflow.org/">Tensorflow</a> e di integrare Milvus con motori di streaming, in modo da poter supportare meglio l'elaborazione unificata di stream e batch per soddisfare le varie esigenze degli utenti di Milvus.</p>
<h2 id="The-design-principles-of-Milvus-20" class="common-anchor-header">I principi di progettazione di Milvus 2.0<button data-href="#The-design-principles-of-Milvus-20" class="anchor-icon" translate="no">
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
    </button></h2><p>Come database vettoriale cloud-nativo di nuova generazione, Milvus 2.0 si basa sui tre principi seguenti.</p>
<h3 id="Log-as-data" class="common-anchor-header">Registro come dati</h3><p>Un log in un database registra in serie tutte le modifiche apportate ai dati. Come mostrato nella figura seguente, da sinistra a destra ci sono i &quot;vecchi dati&quot; e i &quot;nuovi dati&quot;. I registri sono in ordine temporale. Milvus ha un meccanismo di timer globale che assegna un timestamp unico a livello globale e autoincrementale.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Frame_1_8_6e40211f44.png" alt="Logs" class="doc-image" id="logs" />
   </span> <span class="img-wrapper"> <span>I registri</span> </span></p>
<p>In Milvus 2.0, il log broker funge da spina dorsale del sistema: tutte le operazioni di inserimento e aggiornamento dei dati devono passare attraverso il log broker, e i nodi worker eseguono le operazioni CRUD sottoscrivendo e consumando i log.</p>
<h3 id="Duality-of-table-and-log" class="common-anchor-header">Dualità di tabella e log</h3><p>Sia la tabella che il log sono dati e sono solo due forme diverse. Le tabelle sono dati vincolati, mentre i log non sono vincolati. I log possono essere convertiti in tabelle. Nel caso di Milvus, esso aggrega i registri utilizzando una finestra di elaborazione di TimeTick. In base alla sequenza dei registri, più registri vengono aggregati in un piccolo file chiamato snapshot di registro. Poi queste istantanee di log vengono combinate per formare un segmento, che può essere usato individualmente per il bilanciamento del carico.</p>
<h3 id="Log-persistency" class="common-anchor-header">Persistenza dei log</h3><p>La persistenza dei registri è uno dei problemi più spinosi per molti database. L'archiviazione dei log in un sistema distribuito dipende solitamente da algoritmi di replica.</p>
<p>A differenza di database come <a href="https://aws.amazon.com/rds/aurora/">Aurora</a>, <a href="https://hbase.apache.org/">HBase</a>, <a href="https://www.cockroachlabs.com/">Cockroach DB</a> e <a href="https://en.pingcap.com/">TiDB</a>, Milvus adotta un approccio innovativo e introduce un sistema publish-subscribe (pub/sub) per l'archiviazione e la persistenza dei log. Un sistema pub/sub è analogo alla coda di messaggi di <a href="https://kafka.apache.org/">Kafka</a> o <a href="https://pulsar.apache.org/">Pulsar</a>. Tutti i nodi del sistema possono consumare i log. In Milvus, questo tipo di sistema è chiamato log broker. Grazie al log broker, i log sono disaccoppiati dal server, assicurando che Milvus sia esso stesso stateless e meglio posizionato per recuperare rapidamente da un guasto del sistema.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/log_broker_cafe889835.png" alt="Log broker" class="doc-image" id="log-broker" />
   </span> <span class="img-wrapper"> <span>Broker di log</span> </span></p>
<h2 id="Building-a-vector-database-for-scalable-similarity-search" class="common-anchor-header">Creazione di un database vettoriale per la ricerca di similarità scalabile<button data-href="#Building-a-vector-database-for-scalable-similarity-search" class="anchor-icon" translate="no">
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
    </button></h2><p>Costruito sulla base delle più diffuse librerie di ricerca vettoriale, tra cui Faiss, ANNOY, HNSW e altre, Milvus è stato progettato per la ricerca di similarità su insiemi di dati vettoriali densi, contenenti milioni, miliardi o addirittura trilioni di vettori.</p>
<h3 id="Standalone-and-cluster" class="common-anchor-header">Standalone e cluster</h3><p>Milvus offre due modalità di implementazione: standalone o cluster. In Milvus standalone, poiché tutti i nodi sono distribuiti insieme, possiamo vedere Milvus come un unico processo. Attualmente, Milvus standalone si affida a MinIO ed etcd per la persistenza dei dati e la memorizzazione dei metadati. Nelle versioni future, speriamo di eliminare queste due dipendenze di terze parti per garantire la semplicità del sistema Milvus. Il cluster Milvus comprende otto componenti di microservizi e tre dipendenze di terze parti: MinIO, etcd e Pulsar. Pulsar funge da log broker e fornisce servizi di log pub/sub.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/standalone_and_cluster_7558f56e8c.png" alt="Standalone and cluster" class="doc-image" id="standalone-and-cluster" />
   </span> <span class="img-wrapper"> <span>Standalone e cluster</span> </span></p>
<h3 id="A-bare-bones-skeleton-of-the-Milvus-architecture" class="common-anchor-header">Uno scheletro essenziale dell'architettura Milvus</h3><p>Milvus separa il flusso di dati dal flusso di controllo ed è suddiviso in quattro livelli indipendenti in termini di scalabilità e disaster recovery.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Milvus_architecture_b7743a4a7f.png" alt="Milvus architecture" class="doc-image" id="milvus-architecture" />
   </span> <span class="img-wrapper"> <span>Architettura Milvus</span> </span></p>
<h4 id="Access-layer" class="common-anchor-header">Livello di accesso</h4><p>Il livello di accesso funge da facciata del sistema, esponendo il punto finale della connessione del cliente al mondo esterno. È responsabile dell'elaborazione delle connessioni client, dell'esecuzione di verifiche statiche, di controlli dinamici di base per le richieste degli utenti, dell'inoltro delle richieste e della raccolta e restituzione dei risultati al client. Il proxy stesso è stateless e fornisce indirizzi di accesso e servizi unificati al mondo esterno attraverso componenti di bilanciamento del carico (Nginx, Kubernetess Ingress, NodePort e LVS). Milvus utilizza un'architettura di elaborazione massicciamente parallela (MPP), in cui i proxy restituiscono i risultati raccolti dai nodi worker dopo l'aggregazione globale e la post-elaborazione.</p>
<h4 id="Coordinator-service" class="common-anchor-header">Servizio coordinatore</h4><p>Il servizio coordinatore è il cervello del sistema, responsabile della gestione dei nodi della topologia del cluster, del bilanciamento del carico, della generazione dei timestamp, della dichiarazione dei dati e della gestione dei dati. Per una spiegazione dettagliata della funzione di ciascun servizio di coordinamento, leggere la <a href="https://milvus.io/docs/v2.0.x/four_layers.md#Coordinator-service">documentazione tecnica</a> di <a href="https://milvus.io/docs/v2.0.x/four_layers.md#Coordinator-service">Milvus</a>.</p>
<h4 id="Worker-nodes" class="common-anchor-header">Nodi worker</h4><p>Il nodo worker, o di esecuzione, agisce come arti del sistema, eseguendo le istruzioni emesse dal servizio coordinatore e i comandi del linguaggio di manipolazione dei dati (DML) avviati dal proxy. Un nodo worker in Milvus è simile a un nodo dati in <a href="https://hadoop.apache.org/">Hadoop</a> o a un region server in HBase. Ogni tipo di nodo worker corrisponde a un servizio coord. Per una spiegazione dettagliata della funzione di ciascun nodo worker, leggere la <a href="https://milvus.io/docs/v2.0.x/four_layers.md#Worker-nodes">documentazione tecnica</a> di <a href="https://milvus.io/docs/v2.0.x/four_layers.md#Worker-nodes">Milvus</a>.</p>
<h4 id="Storage" class="common-anchor-header">Archiviazione</h4><p>Lo storage è la pietra angolare di Milvus, responsabile della persistenza dei dati. Il livello di archiviazione è diviso in tre parti:</p>
<ul>
<li><strong>Meta store:</strong> Responsabile della memorizzazione di istantanee di meta-dati come lo schema di raccolta, lo stato dei nodi, i checkpoint di consumo dei messaggi, ecc. Milvus si affida a etcd per queste funzioni ed Etcd si assume anche la responsabilità della registrazione dei servizi e dei controlli di salute.</li>
<li><strong>Broker di log:</strong> Un sistema pub/sub che supporta la riproduzione ed è responsabile della persistenza dei dati in streaming, dell'esecuzione affidabile di query asincrone, delle notifiche di eventi e della restituzione dei risultati delle query. Quando i nodi eseguono il recupero dei tempi di inattività, il log broker assicura l'integrità dei dati incrementali attraverso la riproduzione del log broker. Il cluster Milvus utilizza Pulsar come log broker, mentre la modalità standalone utilizza RocksDB. Anche i servizi di archiviazione in streaming, come Kafka e Pravega, possono essere utilizzati come log broker.</li>
<li><strong>Storage a oggetti:</strong> Memorizza i file snapshot dei log, i file degli indici scalari/vettoriali e i risultati intermedi dell'elaborazione delle query. Milvus supporta <a href="https://aws.amazon.com/s3/">AWS S3</a> e <a href="https://azure.microsoft.com/en-us/services/storage/blobs/">Azure Blob</a>, oltre a <a href="https://min.io/">MinIO</a>, un servizio di archiviazione a oggetti leggero e open-source. A causa dell'elevata latenza di accesso e della fatturazione per query dei servizi di storage a oggetti, Milvus supporterà presto pool di cache basati su memoria/SSD e la separazione dei dati caldi/freddi per migliorare le prestazioni e ridurre i costi.</li>
</ul>
<h3 id="Data-Model" class="common-anchor-header">Modello dei dati</h3><p>Il modello dei dati organizza i dati in un database. In Milvus, tutti i dati sono organizzati per collezione, shard, partizione, segmento ed entità.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Data_model_1_5d6bb43673.png" alt="Data model 1" class="doc-image" id="data-model-1" />
   </span> <span class="img-wrapper"> <span>Modello di dati 1</span> </span></p>
<h4 id="Collection" class="common-anchor-header">Raccolta</h4><p>Una collezione in Milvus può essere paragonata a una tabella in un sistema di archiviazione relazionale. La collezione è l'unità di dati più grande in Milvus.</p>
<h4 id="Shard" class="common-anchor-header">Shard</h4><p>Per sfruttare appieno la potenza di calcolo parallelo dei cluster durante la scrittura dei dati, le collezioni in Milvus devono distribuire le operazioni di scrittura dei dati su diversi nodi. Per impostazione predefinita, una singola raccolta contiene due shard. A seconda del volume del dataset, è possibile avere più shard in una raccolta. Milvus utilizza un metodo di hashing a chiave master per lo sharding.</p>
<h4 id="Partition" class="common-anchor-header">Partizione</h4><p>In uno shard ci sono anche più partizioni. Una partizione in Milvus si riferisce a un insieme di dati contrassegnati dalla stessa etichetta in una raccolta. I metodi di partizionamento più comuni includono il partizionamento per data, sesso, età dell'utente e altro ancora. La creazione di partizioni può favorire il processo di interrogazione, in quanto i dati possono essere filtrati in base all'etichetta della partizione.</p>
<p>In confronto, lo sharding si occupa più che altro di scalare le capacità in fase di scrittura dei dati, mentre il partizionamento si occupa più che altro di migliorare le prestazioni del sistema in fase di lettura dei dati.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Data_model_2_044a443751.png" alt="Data model 2" class="doc-image" id="data-model-2" />
   </span> <span class="img-wrapper"> <span>Modello di dati 2</span> </span></p>
<h4 id="Segments" class="common-anchor-header">Segmenti</h4><p>All'interno di ogni partizione, ci sono più segmenti di piccole dimensioni. Un segmento è l'unità più piccola per la pianificazione del sistema in Milvus. Esistono due tipi di segmenti: quelli in crescita e quelli sigillati. I segmenti in crescita sono sottoscritti dai nodi di interrogazione. L'utente di Milvus continua a scrivere dati in segmenti crescenti. Quando la dimensione di un segmento in crescita raggiunge un limite superiore (512 MB per impostazione predefinita), il sistema non consente di scrivere altri dati in questo segmento in crescita, sigillandolo. Gli indici sono costruiti su segmenti sigillati.</p>
<p>Per accedere ai dati in tempo reale, il sistema legge i dati sia nei segmenti in crescita che nei segmenti sigillati.</p>
<h4 id="Entity" class="common-anchor-header">Entità</h4><p>Ogni segmento contiene una quantità enorme di entità. Un'entità in Milvus è equivalente a una riga in un database tradizionale. Ogni entità ha un campo chiave primario unico, che può anche essere generato automaticamente. Le entità devono anche contenere un timestamp (ts) e un campo vettoriale - il cuore di Milvus.</p>
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
