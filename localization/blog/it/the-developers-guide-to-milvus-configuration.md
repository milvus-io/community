---
id: the-developers-guide-to-milvus-configuration.md
title: Guida dello sviluppatore alla configurazione di Milvus
author: Jack Li
date: 2025-04-23T00:00:00.000Z
desc: >-
  Semplificate la configurazione di Milvus con la nostra guida mirata. Scoprite
  i parametri chiave da regolare per migliorare le prestazioni delle vostre
  applicazioni di database vettoriali.
cover: assets.zilliz.com/The_Developer_s_Guide_to_Milvus_Configuration_1519241756.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search'
meta_keywords: 'Milvus, configurations, performance, scalability, stability'
meta_title: The Developer’s Guide to Milvus Configuration
origin: 'https://milvus.io/blog/the-developers-guide-to-milvus-configuration.md'
---
<h2 id="Introduction" class="common-anchor-header">Introduzione<button data-href="#Introduction" class="anchor-icon" translate="no">
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
    </button></h2><p>Come sviluppatori che lavorano con Milvus, probabilmente avete incontrato lo scoraggiante file di configurazione <code translate="no">milvus.yaml</code> con i suoi oltre 500 parametri. Gestire questa complessità può essere impegnativo quando si vuole solo ottimizzare le prestazioni del database vettoriale.</p>
<p>Una buona notizia: non è necessario comprendere ogni parametro. Questa guida elimina il rumore e si concentra sulle impostazioni critiche che hanno effettivamente un impatto sulle prestazioni, evidenziando esattamente quali valori modificare per il vostro caso d'uso specifico.</p>
<p>Sia che stiate costruendo un sistema di raccomandazione che necessita di query fulminee o ottimizzando un'applicazione di ricerca vettoriale con vincoli di costo, vi mostrerò esattamente quali parametri modificare con valori pratici e testati. Alla fine di questa guida, saprete come mettere a punto le configurazioni di Milvus per ottenere le massime prestazioni sulla base di scenari di implementazione reali.</p>
<h2 id="Configuration-Categories" class="common-anchor-header">Categorie di configurazione<button data-href="#Configuration-Categories" class="anchor-icon" translate="no">
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
    </button></h2><p>Prima di immergerci nei parametri specifici, vediamo la struttura del file di configurazione. Quando si lavora con <code translate="no">milvus.yaml</code>, si ha a che fare con tre categorie di parametri:</p>
<ul>
<li><p><strong>Configurazioni dei componenti di dipendenza</strong>: Servizi esterni a cui Milvus si connette (<code translate="no">etcd</code>, <code translate="no">minio</code>, <code translate="no">mq</code>) - critici per la configurazione del cluster e la persistenza dei dati.</p></li>
<li><p><strong>Configurazioni dei componenti interni</strong>: Architettura interna di Milvus (<code translate="no">proxy</code>, <code translate="no">queryNode</code>, ecc.) - fondamentale per la messa a punto delle prestazioni</p></li>
<li><p><strong>Configurazioni funzionali</strong>: Sicurezza, registrazione e limiti delle risorse - importanti per le implementazioni di produzione</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Milvus_Configurations_f9a7e45dce.PNG" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Milvus-Dependency-Component-Configurations" class="common-anchor-header">Configurazioni dei componenti di dipendenza di Milvus<button data-href="#Milvus-Dependency-Component-Configurations" class="anchor-icon" translate="no">
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
    </button></h2><p>Cominciamo con i servizi esterni da cui Milvus dipende. Queste configurazioni sono particolarmente importanti quando si passa dallo sviluppo alla produzione.</p>
<h3 id="etcd-Metadata-Store" class="common-anchor-header"><code translate="no">etcd</code>: Archivio dei metadati</h3><p>Milvus si affida a <code translate="no">etcd</code> per la persistenza dei metadati e il coordinamento dei servizi. I seguenti parametri sono fondamentali:</p>
<ul>
<li><p><code translate="no">Etcd.endpoints</code>: Specifica l'indirizzo del cluster etcd. Per impostazione predefinita, Milvus lancia un'istanza in bundle, ma negli ambienti aziendali è preferibile connettersi a un servizio <code translate="no">etcd</code> gestito per una migliore disponibilità e controllo operativo.</p></li>
<li><p><code translate="no">etcd.rootPath</code>: Definisce il prefisso della chiave per memorizzare i dati relativi a Milvus in etcd. Se si gestiscono più cluster Milvus sullo stesso backend etcd, l'uso di percorsi radice diversi consente un isolamento pulito dei metadati.</p></li>
<li><p><code translate="no">etcd.auth</code>: Controlla le credenziali di autenticazione. Milvus non abilita l'autenticazione di etcd per impostazione predefinita, ma se la vostra istanza etcd gestita richiede delle credenziali, dovete specificarle qui.</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/etcd_in_milvusyaml_dc600c6974.PNG" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="minio-Object-Storage" class="common-anchor-header"><code translate="no">minio</code>: Memorizzazione degli oggetti</h3><p>Nonostante il nome, questa sezione regola tutti i client di servizi di archiviazione di oggetti compatibili con S3. Supporta fornitori come AWS S3, GCS e Aliyun OSS tramite l'impostazione <code translate="no">cloudProvider</code>.</p>
<p>Prestare attenzione a queste quattro configurazioni chiave:</p>
<ul>
<li><p><code translate="no">minio.address / minio.port</code>: Utilizzare queste configurazioni per specificare l'endpoint del servizio di archiviazione degli oggetti.</p></li>
<li><p><code translate="no">minio.bucketName</code>: Assegnare bucket separati (o prefissi logici) per evitare collisioni di dati quando si eseguono più cluster Milvus.</p></li>
<li><p><code translate="no">minio.rootPath</code>: Abilita il namespacing intra-bucket per l'isolamento dei dati.</p></li>
<li><p><code translate="no">minio.cloudProvider</code>: Identifica il backend OSS. Per un elenco completo di compatibilità, consultare la <a href="https://milvus.io/docs/product_faq.md#Where-does-Milvus-store-data">documentazione</a> di <a href="https://milvus.io/docs/product_faq.md#Where-does-Milvus-store-data">Milvus</a>.</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/minio_in_milvusyaml_faa11c9fcd.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="mq-Message-Queue" class="common-anchor-header"><code translate="no">mq</code>: Coda di messaggi</h3><p>Milvus utilizza una coda di messaggi per la propagazione interna degli eventi: Pulsar (default) o Kafka. Prestare attenzione ai tre parametri seguenti.</p>
<ol>
<li><p><code translate="no">pulsar.address/pulsar.port</code>: Impostare questi valori per utilizzare un cluster Pulsar esterno.</p></li>
<li><p><code translate="no">pulsar.tenant</code>: Definisce il nome del tenant. Quando più cluster Milvus condividono un'istanza Pulsar, questo garantisce una separazione netta dei canali.</p></li>
<li><p><code translate="no">msgChannel.chanNamePrefix.cluster</code>: Se si preferisce bypassare il modello di tenant di Pulsar, regolare il prefisso del canale per evitare collisioni.</p></li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/mq_in_milvusyaml1_2214739c84.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/mq_in_milvusyaml2_a44ff64936.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Milvus supporta anche Kafka come coda di messaggi. Per usare Kafka al suo posto, commentare le impostazioni specifiche di Pulsar e decommentare il blocco di configurazione di Kafka.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/mq_in_milvusyaml3_d41f44f77a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Milvus-Internal-Component-Configurations" class="common-anchor-header">Configurazioni dei componenti interni di Milvus<button data-href="#Milvus-Internal-Component-Configurations" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="rootCoord-Metadata-+-Timestamps" class="common-anchor-header"><code translate="no">rootCoord</code>: Metadati + Timestamp</h3><p>Il nodo <code translate="no">rootCoord</code> gestisce le modifiche ai metadati (DDL/DCL) e la gestione dei timestamp.</p>
<ol>
<li><p><code translate="no">rootCoord.maxPartitionNum</code>Imposta il limite superiore del numero di partizioni per raccolta. Sebbene il limite massimo sia 1024, questo parametro serve principalmente come salvaguardia. Per i sistemi multi-tenant, evitare l'uso di partizioni come confini di isolamento; al contrario, implementare una strategia di chiave tenant che sia scalabile fino a milioni di tenant logici.</p></li>
<li><p><code translate="no">rootCoord.enableActiveStandby</code>Abilita l'alta disponibilità attivando un nodo di riserva. Questo è fondamentale perché i nodi coordinatori Milvus non scalano orizzontalmente per impostazione predefinita.</p></li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/root_Coord_in_milvusyaml_9c2417dbaf.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="proxy-API-Gateway-+-Request-Router" class="common-anchor-header"><code translate="no">proxy</code>: Gateway API + Router di richieste</h3><p><code translate="no">proxy</code> gestisce le richieste rivolte al cliente, la convalida delle richieste e l'aggregazione dei risultati.</p>
<ul>
<li><p><code translate="no">proxy.maxFieldNum</code>: Limita il numero di campi (scalari + vettoriali) per collezione. Mantenere questo numero al di sotto di 64 per minimizzare la complessità dello schema e ridurre il sovraccarico di I/O.</p></li>
<li><p><code translate="no">proxy.maxVectorFieldNum</code>: Controlla il numero di campi vettoriali in una collezione. Milvus supporta la ricerca multimodale, ma in pratica 10 campi vettoriali sono un limite massimo sicuro.</p></li>
<li><p><code translate="no">proxy.maxShardNum</code>:Definisce il numero di shard di ingestione. Come regola generale:</p>
<ul>
<li><p>&lt; 200M record → 1 shard</p></li>
<li><p>200-400M record → 2 frammenti</p></li>
<li><p>Scala lineare oltre questo limite</p></li>
</ul></li>
<li><p><code translate="no">proxy.accesslog</code>: Se abilitato, registra informazioni dettagliate sulle richieste (utente, IP, endpoint, SDK). Utile per la verifica e il debug.</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/proxy_in_milvusyaml_897b33c759.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="queryNode-Query-Execution" class="common-anchor-header"><code translate="no">queryNode</code>: Esecuzione della query</h3><p>Gestisce l'esecuzione della ricerca vettoriale e il caricamento dei segmenti. Prestare attenzione ai seguenti parametri.</p>
<ul>
<li><code translate="no">queryNode.mmap</code>: Attiva l'I/O con mappatura in memoria per il caricamento dei campi scalari e dei segmenti. L'abilitazione di <code translate="no">mmap</code> aiuta a ridurre l'ingombro della memoria, ma può peggiorare la latenza se l'I/O su disco diventa un collo di bottiglia.</li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/query_Node_in_milvusyaml_36e1bf378a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="dataCoord-Segment-+-Index-Management" class="common-anchor-header"><code translate="no">dataCoord</code>: Gestione dei segmenti e degli indici</h3><p>Questo parametro controlla la segmentazione dei dati, l'indicizzazione, la compattazione e la garbage collection (GC). I principali parametri di configurazione includono:</p>
<ol>
<li><p><code translate="no">dataCoord.segment.maxSize</code>: Specifica la dimensione massima di un segmento di dati in memoria. Segmenti più grandi significano generalmente meno segmenti totali nel sistema, il che può migliorare le prestazioni delle query riducendo l'indicizzazione e l'overhead di ricerca. Ad esempio, alcuni utenti che eseguono istanze <code translate="no">queryNode</code> con 128 GB di RAM hanno riferito che l'aumento di questa impostazione da 1 GB a 8 GB ha portato a prestazioni di query circa 4 volte superiori.</p></li>
<li><p><code translate="no">dataCoord.segment.diskSegmentMaxSize</code>: Simile al precedente, questo parametro controlla la dimensione massima degli <a href="https://milvus.io/docs/disk_index.md#On-disk-Index">indici su disco</a> (diskann index).</p></li>
<li><p><code translate="no">dataCoord.segment.sealProportion</code>: Determina quando un segmento in crescita viene sigillato (cioè finalizzato e indicizzato). Il segmento è sigillato quando raggiunge <code translate="no">maxSize * sealProportion</code>. Per impostazione predefinita, con <code translate="no">maxSize = 1024MB</code> e <code translate="no">sealProportion = 0.12</code>, un segmento viene sigillato a circa 123 MB.</p></li>
</ol>
<ul>
<li><p>Valori più bassi (ad esempio, 0,12) fanno scattare la sigillatura prima, il che può contribuire a una creazione più rapida degli indici, utile nei carichi di lavoro con aggiornamenti frequenti.</p></li>
<li><p>Valori più alti (ad esempio, da 0,3 a 0,5) ritardano la sigillatura, riducendo l'overhead dell'indicizzazione: più adatti a scenari di ingestione offline o in batch.</p></li>
</ul>
<ol start="4">
<li><p><code translate="no">dataCoord.segment.expansionRate</code>:  Imposta il fattore di espansione consentito durante la compattazione. Milvus calcola la dimensione massima consentita del segmento durante la compattazione come <code translate="no">maxSize * expansionRate</code>.</p></li>
<li><p><code translate="no">dataCoord.gc.dropTolerance</code>: Dopo la compattazione di un segmento o l'eliminazione di una raccolta, Milvus non elimina immediatamente i dati sottostanti. Al contrario, contrassegna i segmenti per l'eliminazione e attende il completamento del ciclo di garbage collection (GC). Questo parametro controlla la durata del ritardo.</p></li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/data_Coord_in_milvusyaml1_100d98a081.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/data_Coord_in_milvusyaml2_7fa8c5f2c0.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Other-Functional-Configurations" class="common-anchor-header">Altre configurazioni funzionali<button data-href="#Other-Functional-Configurations" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="log-Observability-and-Diagnostics" class="common-anchor-header"><code translate="no">log</code>: Osservabilità e diagnostica</h3><p>Un robusto logging è una pietra miliare di qualsiasi sistema distribuito, e Milvus non fa eccezione. Una configurazione di log ben configurata non solo aiuta a debuggare i problemi che si presentano, ma garantisce anche una migliore visibilità della salute e del comportamento del sistema nel tempo.</p>
<p>Per le implementazioni di produzione, si consiglia di integrare i log di Milvus con strumenti di log e monitoraggio centralizzati, come <a href="https://milvus.io/docs/configure_grafana_loki.md#Deploy-Loki">Loki</a>, per semplificare l'analisi e gli avvisi. Le impostazioni chiave includono:</p>
<ol>
<li><p><code translate="no">log.level</code>: Controlla la verbosità dell'output dei log. Per gli ambienti di produzione, attenersi al livello <code translate="no">info</code> per catturare i dettagli essenziali del runtime senza sovraccaricare il sistema. Durante lo sviluppo o la risoluzione dei problemi, è possibile passare a <code translate="no">debug</code> per ottenere informazioni più dettagliate sulle operazioni interne. ⚠️ Fare attenzione al livello <code translate="no">debug</code> in produzione: genera un volume elevato di log, che può consumare rapidamente spazio su disco e degradare le prestazioni di I/O se non viene controllato.</p></li>
<li><p><code translate="no">log.file</code>: Per impostazione predefinita, Milvus scrive i log su standard output (stdout), il che è adatto agli ambienti containerizzati in cui i log vengono raccolti tramite sidecar o agenti di nodo. Per abilitare invece la scrittura dei log su file, è possibile configurare:</p></li>
</ol>
<ul>
<li><p>Dimensione massima del file prima della rotazione</p></li>
<li><p>Periodo di conservazione dei file</p></li>
<li><p>Numero di file di log di backup da conservare</p></li>
</ul>
<p>Questo è utile in ambienti bare-metal o on-prem dove la spedizione dei log stdout non è disponibile.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/log_in_milvusyaml_248ead1264.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="security-Authentication-and-Access-Control" class="common-anchor-header"><code translate="no">security</code>: Autenticazione e controllo degli accessi</h3><p>Milvus supporta l'<a href="https://milvus.io/docs/authenticate.md?tab=docker">autenticazione degli utenti</a> e il <a href="https://milvus.io/docs/rbac.md">controllo degli accessi basato sui ruoli (RBAC)</a>, entrambi configurabili nel modulo <code translate="no">common</code>. Queste impostazioni sono essenziali per proteggere gli ambienti multi-tenant o qualsiasi distribuzione esposta a client esterni.</p>
<p>I parametri chiave includono:</p>
<ol>
<li><p><code translate="no">common.security.authorizationEnabled</code>: Questa levetta abilita o disabilita l'autenticazione e RBAC. È disattivato per impostazione predefinita, il che significa che tutte le operazioni sono consentite senza controlli di identità. Per applicare un controllo di accesso sicuro, impostare questo parametro su <code translate="no">true</code>.</p></li>
<li><p><code translate="no">common.security.defaultRootPassword</code>: Quando l'autenticazione è abilitata, questa impostazione definisce la password iniziale per l'utente integrato di <code translate="no">root</code>.</p></li>
</ol>
<p>Assicurarsi di cambiare la password predefinita subito dopo aver abilitato l'autenticazione per evitare vulnerabilità di sicurezza negli ambienti di produzione.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/security_in_milvusyaml_a8d0187b5a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="quotaAndLimits-Rate-Limiting-and-Write-Control" class="common-anchor-header"><code translate="no">quotaAndLimits</code>: Limitazione della velocità e controllo della scrittura</h3><p>La sezione <code translate="no">quotaAndLimits</code> di <code translate="no">milvus.yaml</code> svolge un ruolo fondamentale nel controllo del flusso dei dati nel sistema. Regola i limiti di velocità per le operazioni come gli inserimenti, le cancellazioni, i flush e le query, garantendo la stabilità del cluster in presenza di carichi di lavoro elevati e prevenendo il degrado delle prestazioni dovuto all'amplificazione della scrittura o a una compattazione eccessiva.</p>
<p>I parametri chiave includono:</p>
<p><code translate="no">quotaAndLimits.flushRate.collection</code>: Controlla la frequenza con cui Milvus elimina i dati da una raccolta.</p>
<ul>
<li><p><strong>Valore predefinito</strong>: <code translate="no">0.1</code>, il che significa che il sistema consente un flush ogni 10 secondi.</p></li>
<li><p>L'operazione di flush sigilla un segmento in crescita e lo trasferisce dalla coda dei messaggi alla memoria degli oggetti.</p></li>
<li><p>Un flush troppo frequente può generare molti piccoli segmenti sigillati, aumentando l'overhead di compattazione e riducendo le prestazioni delle query.</p></li>
</ul>
<p>💡 Buona pratica: Nella maggior parte dei casi, lasciare che Milvus gestisca questa operazione automaticamente. Un segmento in crescita viene sigillato quando raggiunge <code translate="no">maxSize * sealProportion</code> e i segmenti sigillati vengono eliminati ogni 10 minuti. Il lavaggio manuale è consigliato solo dopo gli inserimenti di massa, quando si sa che non arriveranno altri dati.</p>
<p>Si tenga presente che la <strong>visibilità dei dati</strong> è determinata dal <em>livello di consistenza</em> della query, non dalla tempistica del flush, quindi il flush non rende i nuovi dati immediatamente interrogabili.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/quota_And_Limits1_be185e571f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><code translate="no">quotaAndLimits.upsertRate</code>/<code translate="no">quotaAndLimits.deleteRate</code>: Questi parametri definiscono la velocità massima consentita per le operazioni di upsert e di cancellazione.</p>
<ul>
<li><p>Milvus si basa su un'architettura di archiviazione LSM-Tree, il che significa che aggiornamenti e cancellazioni frequenti attivano la compattazione. Questa operazione può richiedere molte risorse e ridurre il throughput complessivo se non viene gestita con attenzione.</p></li>
<li><p>Si consiglia di limitare sia <code translate="no">upsertRate</code> che <code translate="no">deleteRate</code> a <strong>0,5 MB/s</strong> per evitare di sovraccaricare la pipeline di compattazione.</p></li>
</ul>
<p>🚀 Avete bisogno di aggiornare rapidamente un set di dati di grandi dimensioni? Utilizzate una strategia di alias di raccolta:</p>
<ul>
<li><p>Inserire i nuovi dati in una nuova raccolta.</p></li>
<li><p>Una volta terminato l'aggiornamento, reindirizzare l'alias alla nuova raccolta. In questo modo si evita la penalizzazione della compattazione degli aggiornamenti in-place e si consente una commutazione immediata.</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/quota_And_Limits2_32c8640190.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Real-World-Configuration-Examples" class="common-anchor-header">Esempi di configurazione nel mondo reale<button data-href="#Real-World-Configuration-Examples" class="anchor-icon" translate="no">
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
    </button></h2><p>Vediamo due scenari di distribuzione comuni per illustrare come le impostazioni di configurazione di Milvus possono essere regolate per soddisfare diversi obiettivi operativi.</p>
<h3 id="⚡-Example-1-High-Performance-Configuration" class="common-anchor-header">Esempio 1: configurazione ad alte prestazioni</h3><p>Quando la latenza delle query è mission-critical - si pensi ai motori di raccomandazione, alle piattaforme di ricerca semantica o al risk scoring in tempo reale - ogni millisecondo conta. In questi casi d'uso, di solito ci si affida a indici a grafo come <strong>HNSW</strong> o <strong>DISKANN</strong> e si ottimizza l'uso della memoria e il comportamento del ciclo di vita dei segmenti.</p>
<p>Strategie di ottimizzazione chiave:</p>
<ul>
<li><p>Aumentare <code translate="no">dataCoord.segment.maxSize</code> e <code translate="no">dataCoord.segment.diskSegmentMaxSize</code>: aumentare questi valori a 4 GB o addirittura a 8 GB, a seconda della RAM disponibile. Segmenti più grandi riducono il numero di compilazioni degli indici e migliorano il throughput delle query riducendo al minimo il fanout dei segmenti. Tuttavia, i segmenti più grandi consumano più memoria al momento dell'interrogazione, quindi assicuratevi che le istanze <code translate="no">indexNode</code> e <code translate="no">queryNode</code> abbiano spazio sufficiente.</p></li>
<li><p>Abbassare <code translate="no">dataCoord.segment.sealProportion</code> e <code translate="no">dataCoord.segment.expansionRate</code>: puntare a una dimensione del segmento crescente intorno ai 200 MB prima della sigillatura. In questo modo l'uso della memoria del segmento è prevedibile e si riduce l'onere per il delegatore (il leader del queryNode che coordina la ricerca distribuita).</p></li>
</ul>
<p>Regola empirica: Privilegiare un numero minore di segmenti più grandi quando la memoria è abbondante e la latenza è una priorità. Siate prudenti con le soglie di tenuta se la freschezza dell'indice è importante.</p>
<h3 id="💰-Example-2-Cost-Optimized-Configuration" class="common-anchor-header">Esempio 2: Configurazione ottimizzata per i costi</h3><p>Se si privilegia l'efficienza dei costi rispetto alle prestazioni grezze, come nel caso delle pipeline di addestramento dei modelli, degli strumenti interni a basso QPS o della ricerca di immagini a coda lunga, è possibile scambiare il richiamo o la latenza per ridurre in modo significativo i requisiti dell'infrastruttura.</p>
<p>Strategie consigliate:</p>
<ul>
<li><p><strong>Utilizzare la quantizzazione degli indici:</strong> Tipi di indice come <code translate="no">SCANN</code>, <code translate="no">IVF_SQ8</code> o <code translate="no">HNSW_PQ/PRQ/SQ</code> (introdotti in Milvus 2.5) riducono drasticamente le dimensioni dell'indice e l'ingombro in memoria. Sono ideali per i carichi di lavoro in cui la precisione è meno importante della scala o del budget.</p></li>
<li><p><strong>Adottare una strategia di indicizzazione su disco:</strong> Impostate il tipo di indice su <code translate="no">DISKANN</code> per abilitare la ricerca puramente su disco. <strong>Abilitare</strong> <code translate="no">mmap</code> per un offloading selettivo della memoria.</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/query_Node_in_milvusyaml_36e1bf378a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Per un risparmio estremo di memoria, abilitare <code translate="no">mmap</code> per le seguenti opzioni: <code translate="no">vectorField</code>, <code translate="no">vectorIndex</code>, <code translate="no">scalarField</code>, e <code translate="no">scalarIndex</code>. In questo modo si scaricano grandi quantità di dati nella memoria virtuale, riducendo in modo significativo l'uso della RAM residente.</p>
<p>⚠️ Avvertenza: Se il filtraggio scalare è una parte importante del carico di lavoro delle query, si consiglia di disabilitare <code translate="no">mmap</code> per <code translate="no">vectorIndex</code> e <code translate="no">scalarIndex</code>. La mappatura della memoria può degradare le prestazioni delle query scalari in ambienti con limitazioni di I/O.</p>
<h4 id="Disk-usage-tip" class="common-anchor-header">Suggerimento sull'uso del disco</h4><ul>
<li><p>Gli indici HNSW costruiti con <code translate="no">mmap</code> possono espandere la dimensione totale dei dati fino a <strong>1,8×</strong>.</p></li>
<li><p>Un disco fisico da 100 GB potrebbe realisticamente ospitare solo ~50 GB di dati effettivi, se si tiene conto dell'overhead dell'indice e della cache.</p></li>
<li><p>È consigliabile prevedere sempre uno spazio di archiviazione aggiuntivo quando si lavora con <code translate="no">mmap</code>, soprattutto se si memorizzano in cache i vettori originali a livello locale.</p></li>
</ul>
<h2 id="Conclusion" class="common-anchor-header">Conclusione<button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p>La messa a punto di Milvus non consiste nell'inseguire numeri perfetti, ma nel modellare il sistema in base al comportamento reale del carico di lavoro. Le ottimizzazioni di maggior impatto spesso derivano dalla comprensione di come Milvus gestisce l'I/O, il ciclo di vita dei segmenti e l'indicizzazione sotto pressione. Questi sono i percorsi in cui una configurazione errata è più dannosa e in cui una messa a punto accurata produce i maggiori risultati.</p>
<p>Se siete alle prime armi con Milvus, i parametri di configurazione che abbiamo trattato copriranno l'80-90% delle vostre esigenze di prestazioni e stabilità. Iniziate da qui. Una volta acquisita un po' di intuizione, scavate più a fondo nelle specifiche complete di <code translate="no">milvus.yaml</code> e nella documentazione ufficiale: scoprirete controlli a grana fine che possono portare la vostra distribuzione da funzionale a eccezionale.</p>
<p>Con le giuste configurazioni, sarete pronti a costruire sistemi di ricerca vettoriale scalabili e ad alte prestazioni, in linea con le vostre priorità operative, sia che si tratti di servizi a bassa latenza, di storage efficiente dal punto di vista dei costi o di carichi di lavoro analitici ad alta intensità.</p>
