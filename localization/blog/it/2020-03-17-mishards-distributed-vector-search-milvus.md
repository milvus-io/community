---
id: mishards-distributed-vector-search-milvus.md
title: Panoramica dell'architettura distribuita
author: milvus
date: 2020-03-17T21:36:16.974Z
desc: Come scalare
cover: assets.zilliz.com/tim_j_ots0_EO_Yu_Gt_U_unsplash_14f939b344.jpg
tag: Engineering
canonicalUrl: 'https://zilliz.com/blog/mishards-distributed-vector-search-milvus'
---
<custom-h1>Mishards - Ricerca vettoriale distribuita in Milvus</custom-h1><p>Milvus mira a realizzare una ricerca di similarità e un'analisi efficienti per vettori di dimensioni enormi. Un'istanza indipendente di Milvus può facilmente gestire la ricerca vettoriale per vettori di dimensioni miliardarie. Tuttavia, per set di dati da 10 miliardi, 100 miliardi o addirittura più grandi, è necessario un cluster Milvus. Il cluster può essere utilizzato come istanza indipendente per le applicazioni di livello superiore e può soddisfare le esigenze aziendali di bassa latenza e alta concorrenza per i dati su larga scala. Un cluster Milvus può reinviare le richieste, separare la lettura dalla scrittura, scalare orizzontalmente ed espandersi dinamicamente, fornendo così un'istanza Milvus che può espandersi senza limiti. Mishards è una soluzione distribuita per Milvus.</p>
<p>Questo articolo presenterà brevemente i componenti dell'architettura di Mishards. Informazioni più dettagliate saranno introdotte nei prossimi articoli.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_milvus_cluster_mishards_daf78a0a91.png" alt="1-milvus-cluster-mishards.png" class="doc-image" id="1-milvus-cluster-mishards.png" />
   </span> <span class="img-wrapper"> <span>1-milvus-cluster-mishards.png</span> </span></p>
<h2 id="Distributed-architecture-overview" class="common-anchor-header">Panoramica dell'architettura distribuita<button data-href="#Distributed-architecture-overview" class="anchor-icon" translate="no">
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
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_distributed_architecture_overview_f059fe8c90.png" alt="2-distributed-architecture-overview.png" class="doc-image" id="2-distributed-architecture-overview.png" />
   </span> <span class="img-wrapper"> <span>2-architettura distribuita-overview.png</span> </span></p>
<h2 id="Service-tracing" class="common-anchor-header">Tracciamento dei servizi<button data-href="#Service-tracing" class="anchor-icon" translate="no">
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
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_service_tracing_milvus_38559f7fd7.png" alt="3-service-tracing-milvus.png" class="doc-image" id="3-service-tracing-milvus.png" />
   </span> <span class="img-wrapper"> <span>3-service-tracing-milvus.png</span> </span></p>
<h2 id="Primary-service-components" class="common-anchor-header">Componenti primari del servizio<button data-href="#Primary-service-components" class="anchor-icon" translate="no">
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
    </button></h2><ul>
<li>Framework di rilevamento dei servizi, come ZooKeeper, etcd e Consul.</li>
<li>Bilanciatore di carico, come Nginx, HAProxy, Ingress Controller.</li>
<li>Nodo Mishards: stateless, scalabile.</li>
<li>Nodo Milvus di sola scrittura: nodo singolo e non scalabile. È necessario utilizzare soluzioni ad alta disponibilità per questo nodo per evitare il single-point-of-failure.</li>
<li>Nodo Milvus di sola lettura: Nodo statico e scalabile.</li>
<li>Servizio di storage condiviso: Tutti i nodi Milvus utilizzano un servizio di archiviazione condiviso per condividere i dati, come NAS o NFS.</li>
<li>Servizio di metadati: Tutti i nodi Milvus utilizzano questo servizio per condividere i metadati. Attualmente è supportato solo MySQL. Questo servizio richiede una soluzione ad alta disponibilità per MySQL.</li>
</ul>
<h2 id="Scalable-components" class="common-anchor-header">Componenti scalabili<button data-href="#Scalable-components" class="anchor-icon" translate="no">
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
    </button></h2><ul>
<li>Mishard</li>
<li>Nodi Milvus di sola lettura</li>
</ul>
<h2 id="Components-introduction" class="common-anchor-header">Introduzione ai componenti<button data-href="#Components-introduction" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Nodi Mishards</strong></p>
<p>Mishards è responsabile della suddivisione delle richieste a monte e dell'instradamento delle sotto-richieste ai sottoservizi. I risultati vengono riassunti per tornare all'upstream.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/4_mishards_nodes_3fbe7d255d.jpg" alt="4-mishards-nodes.jpg" class="doc-image" id="4-mishards-nodes.jpg" />
   </span> <span class="img-wrapper"> <span>4-nodi-mishards.jpg</span> </span></p>
<p>Come indicato nel grafico qui sopra, dopo aver accettato una richiesta di ricerca TopK, Mishards prima scompone la richiesta in sotto-richieste e invia le sotto-richieste al servizio a valle. Quando tutte le sotto-richieste sono state raccolte, le sotto-richieste vengono unite e restituite a monte.</p>
<p>Poiché Mishards è un servizio stateless, non salva dati né partecipa a calcoli complessi. Pertanto, i nodi non hanno requisiti di configurazione elevati e la potenza di calcolo viene utilizzata principalmente per unire i risultati secondari. Pertanto, è possibile aumentare il numero di nodi Mishards per ottenere un'elevata concurrency.</p>
<h2 id="Milvus-nodes" class="common-anchor-header">Nodi Milvus<button data-href="#Milvus-nodes" class="anchor-icon" translate="no">
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
    </button></h2><p>I nodi Milvus sono responsabili delle operazioni di base relative al CRUD, quindi hanno requisiti di configurazione relativamente elevati. In primo luogo, la dimensione della memoria deve essere sufficientemente grande per evitare un numero eccessivo di operazioni di IO su disco. In secondo luogo, anche la configurazione della CPU può influire sulle prestazioni. All'aumentare delle dimensioni del cluster, sono necessari più nodi Milvus per aumentare il throughput del sistema.</p>
<h3 id="Read-only-nodes-and-writable-nodes" class="common-anchor-header">Nodi di sola lettura e nodi scrivibili</h3><ul>
<li>Le operazioni principali di Milvus sono l'inserimento e la ricerca di vettori. La ricerca ha requisiti estremamente elevati per le configurazioni di CPU e GPU, mentre l'inserimento o altre operazioni hanno requisiti relativamente bassi. La separazione del nodo che esegue la ricerca da quello che esegue le altre operazioni consente un'implementazione più economica.</li>
<li>In termini di qualità del servizio, quando un nodo esegue operazioni di ricerca, l'hardware correlato funziona a pieno carico e non può garantire la qualità del servizio delle altre operazioni. Pertanto, vengono utilizzati due tipi di nodi. Le richieste di ricerca sono elaborate da nodi di sola lettura e le altre richieste sono elaborate da nodi scrivibili.</li>
</ul>
<h3 id="Only-one-writable-node-is-allowed" class="common-anchor-header">È consentito un solo nodo scrivibile</h3><ul>
<li><p>Attualmente, Milvus non supporta la condivisione dei dati per più istanze scrivibili.</p></li>
<li><p>Durante l'implementazione, è necessario considerare un singolo punto di guasto dei nodi scrivibili. È necessario preparare soluzioni ad alta disponibilità per i nodi scrivibili.</p></li>
</ul>
<h3 id="Read-only-node-scalability" class="common-anchor-header">Scalabilità dei nodi di sola lettura</h3><p>Quando le dimensioni dei dati sono estremamente grandi o i requisiti di latenza sono estremamente elevati, è possibile scalare orizzontalmente i nodi di sola lettura come nodi stateful. Si supponga che ci siano 4 host e che ognuno abbia la seguente configurazione: Core CPU: 16, GPU: 1, memoria: 64 GB. Il grafico seguente mostra il cluster quando si scalano orizzontalmente i nodi stateful. Sia la potenza di calcolo che la memoria scalano linearmente. I dati sono suddivisi in 8 shard e ogni nodo elabora le richieste da 2 shard.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/5_read_only_node_scalability_milvus_be3ee6e0a7.png" alt="5-read-only-node-scalability-milvus.png" class="doc-image" id="5-read-only-node-scalability-milvus.png" />
   </span> <span class="img-wrapper"> <span>5-read-only-node-scalability-milvus.png</span> </span></p>
<p>Quando il numero di richieste è elevato per alcuni shard, è possibile distribuire nodi di sola lettura stateless per questi shard per aumentare il throughput. Prendiamo come esempio gli host di cui sopra. Quando gli host vengono combinati in un cluster serverless, la potenza di calcolo aumenta linearmente. Poiché i dati da elaborare non aumentano, anche la potenza di elaborazione per lo stesso shard di dati aumenta linearmente.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/6_read_only_node_scalability_milvus_2_2cb98b9aa8.png" alt="6-read-only-node-scalability-milvus-2.png" class="doc-image" id="6-read-only-node-scalability-milvus-2.png" />
   </span> <span class="img-wrapper"> <span>6-read-only-node-scalability-milvus-2.png</span> </span></p>
<h3 id="Metadata-service" class="common-anchor-header">Servizio di metadati</h3><p>Parole chiave: MySQL</p>
<p>Per ulteriori informazioni sui metadati di Milvus, consultare la sezione Come visualizzare i metadati. In un sistema distribuito, i nodi scrivibili Milvus sono gli unici produttori di metadati. I nodi Mishard, i nodi scrivibili Milvus e i nodi di sola lettura Milvus sono tutti consumatori di metadati. Attualmente, Milvus supporta solo MySQL e SQLite come backend di archiviazione dei metadati. In un sistema distribuito, il servizio può essere distribuito solo come MySQL ad alta disponibilità.</p>
<h3 id="Service-discovery" class="common-anchor-header">Scoperta del servizio</h3><p>Parole chiave: Apache Zookeeper, etcd, Consul, Kubernetes</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/7_service_discovery_054a977c6e.png" alt="7-service-discovery.png" class="doc-image" id="7-service-discovery.png" />
   </span> <span class="img-wrapper"> <span>7-scoperta dei servizi.png</span> </span></p>
<p>La scoperta dei servizi fornisce informazioni su tutti i nodi Milvus. I nodi Milvus registrano le loro informazioni quando vanno online e si disconnettono quando vanno offline. I nodi Milvus possono anche rilevare nodi anomali controllando periodicamente lo stato di salute dei servizi.</p>
<p>La scoperta dei servizi contiene molti framework, tra cui etcd, Consul, ZooKeeper, ecc. Mishards definisce le interfacce per il rilevamento dei servizi e offre la possibilità di scalare i servizi tramite plugin. Attualmente, Mishards fornisce due tipi di plugin, che corrispondono al cluster Kubernetes e alle configurazioni statiche. È possibile personalizzare il proprio service discovery seguendo l'implementazione di questi plugin. Le interfacce sono temporanee e necessitano di una riprogettazione. Maggiori informazioni sulla scrittura di un proprio plugin saranno elaborate nei prossimi articoli.</p>
<h3 id="Load-balancing-and-service-sharding" class="common-anchor-header">Bilanciamento del carico e sharding dei servizi</h3><p>Parole chiave: Nginx, HAProxy, Kubernetes</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/7_load_balancing_and_service_sharding_f91891c6c1.png" alt="7-load-balancing-and-service-sharding.png" class="doc-image" id="7-load-balancing-and-service-sharding.png" />
   </span> <span class="img-wrapper"> <span>7-load-balancing-e-service-sharding.png</span> </span></p>
<p>Il rilevamento dei servizi e il bilanciamento del carico vengono utilizzati insieme. Il bilanciamento del carico può essere configurato come polling, hashing o hashing coerente.</p>
<p>Il bilanciatore di carico è responsabile del reinvio delle richieste degli utenti al nodo Mishards.</p>
<p>Ogni nodo Mishards acquisisce le informazioni di tutti i nodi Milvus a valle tramite il centro di scoperta dei servizi. Tutti i metadati relativi possono essere acquisiti dal servizio metadati. Mishards implementa lo sharding consumando queste risorse. Mishards definisce le interfacce relative alle strategie di routing e fornisce estensioni tramite plugin. Attualmente, Mishards fornisce una strategia di hashing coerente basata sul livello di segmento più basso. Come mostrato nel grafico, ci sono 10 segmenti, da s1 a s10. In base alla strategia di hashing coerente basata sui segmenti, Mishards instrada le richieste relative a s1, 24, s6 e s9 al nodo Milvus 1, a s2, s3, s5 al nodo Milvus 2 e a s7, s8, s10 al nodo Milvus 3.</p>
<p>In base alle esigenze aziendali, è possibile personalizzare l'instradamento seguendo il plugin predefinito di instradamento con hashing coerente.</p>
<h3 id="Tracing" class="common-anchor-header">Tracciamento</h3><p>Parole chiave: OpenTracing, Jaeger, Zipkin</p>
<p>Data la complessità di un sistema distribuito, le richieste vengono inviate a più invocazioni di servizi interni. Per individuare i problemi, è necessario tracciare la catena di invocazione dei servizi interni. Con l'aumentare della complessità, i vantaggi di un sistema di tracciamento disponibile sono evidenti. Abbiamo scelto lo standard OpenTracing di CNCF. OpenTracing fornisce API indipendenti dalla piattaforma e dal fornitore per consentire agli sviluppatori di implementare comodamente un sistema di tracciamento.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/8_tracing_demo_milvus_fd385f0aba.png" alt="8-tracing-demo-milvus.png" class="doc-image" id="8-tracing-demo-milvus.png" />
   </span> <span class="img-wrapper"> <span>8-tracing-demo-milvus.png</span> </span></p>
<p>Il grafico precedente è un esempio di tracciamento durante l'invocazione della ricerca. La ricerca invoca consecutivamente <code translate="no">get_routing</code>, <code translate="no">do_search</code> e <code translate="no">do_merge</code>. <code translate="no">do_search</code> invoca anche <code translate="no">search_127.0.0.1</code>.</p>
<p>L'intero record di tracciamento forma il seguente albero:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/8_search_traceid_milvus_35040d75bc.png" alt="8-search-traceid-milvus.png" class="doc-image" id="8-search-traceid-milvus.png" />
   </span> <span class="img-wrapper"> <span>8-search-traceid-milvus.png</span> </span></p>
<p>Il grafico seguente mostra esempi di informazioni su richiesta/risposta e tag di ogni nodo:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/request_response_info_tags_node_milvus_e169a31cb1.png" alt="request-response-info-tags-node-milvus.png" class="doc-image" id="request-response-info-tags-node-milvus.png" />
   </span> <span class="img-wrapper"> <span>request-response-info-tags-node-milvus.png</span> </span></p>
<p>OpenTracing è stato integrato in Milvus. Ulteriori informazioni saranno trattate nei prossimi articoli.</p>
<h3 id="Monitoring-and-alerting" class="common-anchor-header">Monitoraggio e avvisi</h3><p>Parole chiave: Prometheus, Grafana</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/10_monitor_alert_milvus_3ae8910af6.jpg" alt="10-monitor-alert-milvus.jpg" class="doc-image" id="10-monitor-alert-milvus.jpg" />
   </span> <span class="img-wrapper"> <span>10-monitoraggio-allarme-milvus.jpg</span> </span></p>
<h2 id="Summary" class="common-anchor-header">Sintesi<button data-href="#Summary" class="anchor-icon" translate="no">
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
    </button></h2><p>Come middleware di servizio, Mishards integra la scoperta dei servizi, l'instradamento delle richieste, l'unione dei risultati e il tracciamento. È prevista anche un'espansione basata su plugin. Attualmente, le soluzioni distribuite basate su Mishards presentano ancora i seguenti inconvenienti:</p>
<ul>
<li>Mishards utilizza il proxy come livello intermedio e ha costi di latenza.</li>
<li>I nodi scrivibili di Milvus sono servizi a punto singolo.</li>
<li>Dipende dal servizio MySQL altamente disponibile. -La distribuzione è complicata quando ci sono più shard e un singolo shard ha più copie.</li>
<li>Manca un livello di cache, come l'accesso ai metadati.</li>
</ul>
<p>Risolveremo questi problemi nelle prossime versioni, in modo che Mishard possa essere applicato all'ambiente di produzione in modo più pratico.</p>
