---
id: raft-or-not.md
title: >-
  Zattera o no? La soluzione migliore per la consistenza dei dati nei database
  cloud-nativi
author: Xiaofan Luan
date: 2022-05-16T00:00:00.000Z
desc: >-
  Perché l'algoritmo di replica basato sul consenso non è la soluzione ideale
  per ottenere la coerenza dei dati nei database distribuiti?
cover: assets.zilliz.com/Tech_Modify_5_e18025ffbc.png
tag: Engineering
tags: 'Data science, Database, Tech, Artificial Intelligence, Vector Management'
canonicalUrl: 'https://milvus.io/blog/raft-or-not.md'
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Tech_Modify_5_e18025ffbc.png" alt="Cover image" class="doc-image" id="cover-image" />
   </span> <span class="img-wrapper"> <span>Immagine di copertina</span> </span></p>
<blockquote>
<p>Questo articolo è stato scritto da <a href="https://github.com/xiaofan-luan">Xiaofan Luan</a> e trascritto da <a href="https://www.linkedin.com/in/yiyun-n-2aa713163/">Angela Ni</a>.</p>
</blockquote>
<p>La replica basata sul consenso è una strategia ampiamente adottata in molti database distribuiti cloud-native. Tuttavia, presenta alcune carenze e non è sicuramente la soluzione migliore.</p>
<p>Questo post si propone di spiegare i concetti di replica, consistenza e consenso in un database cloud-nativo e distribuito, quindi di chiarire perché gli algoritmi basati sul consenso come Paxos e Raft non sono la soluzione ideale e infine di proporre una <a href="#a-log-replication-strategy-for-cloud-native-and-distributed-database">soluzione alla replica basata sul consenso</a>.</p>
<p><strong>Vai a:</strong></p>
<ul>
<li><a href="#Understanding-replication-consistency-and-consensus">Capire la replica, la consistenza e il consenso</a></li>
<li><a href="#Consensus-based-replication">Replica basata sul consenso</a></li>
<li><a href="#A-log-replication-strategy-for-cloud-native-and-distributed-database">Una strategia di replica dei log per database cloud-nativi e distribuiti</a></li>
<li><a href="#Summary">Sommario</a></li>
</ul>
<h2 id="Understanding-replication-consistency-and-consensus" class="common-anchor-header">Capire la replica, la consistenza e il consenso<button data-href="#Understanding-replication-consistency-and-consensus" class="anchor-icon" translate="no">
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
    </button></h2><p>Prima di approfondire i pro e i contro di Paxos e Raft e di proporre la strategia di replica dei log più adatta, dobbiamo innanzitutto demistificare i concetti di replica, consistenza e consenso.</p>
<p>Si noti che questo articolo si concentra principalmente sulla sincronizzazione di dati/log incrementali. Pertanto, quando si parla di replica di dati/log, si fa riferimento solo alla replica di dati incrementali e non di dati storici.</p>
<h3 id="Replication" class="common-anchor-header">La replica</h3><p>La replica è il processo di creazione di più copie di dati e di memorizzazione in dischi, processi, macchine, cluster, ecc. diversi, allo scopo di aumentare l'affidabilità dei dati e accelerare le interrogazioni. Poiché nella replica i dati vengono copiati e memorizzati in più posizioni, i dati sono più affidabili in caso di guasti ai dischi, guasti alle macchine fisiche o errori dei cluster. Inoltre, le repliche multiple dei dati possono aumentare le prestazioni di un database distribuito, accelerando notevolmente le interrogazioni.</p>
<p>Esistono diverse modalità di replica, come la replica sincrona/asincrona, la replica con consistenza forte/eventuale, la replica leader-follower/decentrata. La scelta della modalità di replica ha un effetto sulla disponibilità e sulla consistenza del sistema. Pertanto, come proposto nel famoso <a href="https://medium.com/analytics-vidhya/cap-theorem-in-distributed-system-and-its-tradeoffs-d8d981ecf37e">teorema CAP</a>, l'architetto di un sistema deve trovare un compromesso tra consistenza e disponibilità quando la partizione della rete è inevitabile.</p>
<h3 id="Consistency" class="common-anchor-header">Consistenza</h3><p>In breve, la consistenza in un database distribuito si riferisce alla proprietà che garantisce che ogni nodo o replica abbia la stessa visione dei dati quando scrive o legge i dati in un determinato momento. Per un elenco completo dei livelli di consistenza, leggere il documento <a href="https://docs.microsoft.com/en-us/azure/cosmos-db/consistency-levels">qui</a>.</p>
<p>Per chiarire, qui si parla di consistenza come nel teorema CAP, non di ACID (atomicità, consistenza, isolamento, durabilità). La consistenza nel teorema CAP si riferisce a ogni nodo del sistema che ha gli stessi dati, mentre la consistenza in ACID si riferisce a un singolo nodo che applica le stesse regole a ogni potenziale commit.</p>
<p>In generale, i database OLTP (online transaction processing) richiedono una forte coerenza o linearizzazione per garantire che:</p>
<ul>
<li>Ogni lettura possa accedere agli ultimi dati inseriti.</li>
<li>Se dopo una lettura viene restituito un nuovo valore, tutte le letture successive, indipendentemente dallo stesso client o da client diversi, devono restituire il nuovo valore.</li>
</ul>
<p>L'essenza della linearizzazione è garantire la ricorrenza di più repliche di dati: una volta che un nuovo valore viene scritto o letto, tutte le letture successive possono visualizzare il nuovo valore fino a quando il valore non viene sovrascritto in seguito. Un sistema distribuito che fornisce la linearizzazione può risparmiare agli utenti la fatica di tenere d'occhio più repliche e può garantire l'atomicità e l'ordine di ogni operazione.</p>
<h3 id="Consensus" class="common-anchor-header">Il consenso</h3><p>Il concetto di consenso viene introdotto nei sistemi distribuiti perché gli utenti desiderano che i sistemi distribuiti funzionino come i sistemi autonomi.</p>
<p>In parole povere, il consenso è un accordo generale su un valore. Ad esempio, Steve e Frank volevano mangiare qualcosa. Steve ha suggerito di mangiare dei panini. Frank ha accettato il suggerimento di Steve ed entrambi hanno mangiato dei panini. Hanno raggiunto un consenso. Più precisamente, un valore (i panini) proposto da uno dei due è accettato da entrambi ed entrambi compiono azioni basate sul valore. Allo stesso modo, il consenso in un sistema distribuito significa che quando un processo propone un valore, tutti gli altri processi del sistema concordano e agiscono in base a questo valore.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2bb46e57_9eb5_456e_be7e_e7762aa9eb7e_68dd2e8e65.png" alt="Consensus" class="doc-image" id="consensus" />
   </span> <span class="img-wrapper"> <span>Il consenso</span> </span></p>
<h2 id="Consensus-based-replication" class="common-anchor-header">Replica basata sul consenso<button data-href="#Consensus-based-replication" class="anchor-icon" translate="no">
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
    </button></h2><p>I primi algoritmi basati sul consenso sono stati proposti nel 1988 insieme alla <a href="https://pmg.csail.mit.edu/papers/vr.pdf">replicazione viewstamped</a>. Nel 1989, Leslie Lamport propose <a href="https://lamport.azurewebsites.net/pubs/paxos-simple.pdf">Paxos</a>, un algoritmo basato sul consenso.</p>
<p>Negli ultimi anni, abbiamo assistito alla diffusione di un altro algoritmo basato sul consenso: <a href="https://raft.github.io/">Raft</a>. È stato adottato da molti database NewSQL mainstream come CockroachDB, TiDB, OceanBase, ecc.</p>
<p>In particolare, un sistema distribuito non supporta necessariamente la linearizzazione anche se adotta una replica basata sul consenso. Tuttavia, la linearizzabilità è il prerequisito per la costruzione di database distribuiti ACID.</p>
<p>Quando si progetta un sistema di database, si deve prendere in considerazione l'ordine di commit dei registri e delle macchine a stati. È inoltre necessaria una maggiore cautela per mantenere il leader lease di Paxos o Raft e per evitare uno split-brain in caso di partizione della rete.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://user-images.githubusercontent.com/1500781/165926429-69b5144c-f3ba-4819-87c3-ab7e04a7e22e.png" alt="Raft replication state machine" class="doc-image" id="raft-replication-state-machine" />
   </span> <span class="img-wrapper"> <span>Macchina a stati della replica Raft</span> </span></p>
<h3 id="Pros-and-cons" class="common-anchor-header">Pro e contro</h3><p>In effetti, Raft, ZAB e il <a href="https://aws.amazon.com/blogs/database/amazon-aurora-under-the-hood-quorum-and-correlated-failure/">protocollo di log basato sul quorum</a> di Aurora sono tutte varianti di Paxos. La replica basata sul consenso presenta i seguenti vantaggi:</p>
<ol>
<li>Sebbene la replica basata sul consenso si concentri maggiormente sulla consistenza e sulla partizione della rete nel teorema CAP, fornisce una disponibilità relativamente migliore rispetto alla tradizionale replica leader-follower.</li>
<li>Raft è un'innovazione che ha semplificato notevolmente gli algoritmi basati sul consenso. Esistono molte librerie Raft open-source su GitHub (ad esempio, <a href="https://github.com/sofastack/sofa-jraft">sofa-jraft</a>).</li>
<li>Le prestazioni della replica basata sul consenso possono soddisfare la maggior parte delle applicazioni e delle aziende. Con la copertura di SSD ad alte prestazioni e NIC (scheda di interfaccia di rete) da gigabyte, l'onere di sincronizzare più repliche è alleggerito, rendendo gli algoritmi Paxos e Raft il mainstream del settore.</li>
</ol>
<p>Un'idea sbagliata è che la replica basata sul consenso sia la soluzione migliore per ottenere la coerenza dei dati in un database distribuito. Tuttavia, questa non è la verità. Le sfide in termini di disponibilità, complessità e prestazioni che l'algoritmo basato sul consenso deve affrontare gli impediscono di essere la soluzione perfetta.</p>
<ol>
<li><p>Disponibilità compromessa L'algoritmo Paxos o Raft ottimizzato dipende fortemente dalla replica leader, che ha una scarsa capacità di contrastare i guasti grigi. Nella replica basata sul consenso, una nuova elezione della replica leader non ha luogo finché il nodo leader non risponde per un lungo periodo. Pertanto, la replica basata sul consenso non è in grado di gestire situazioni in cui il nodo leader è lento o si verifica un thrashing.</p></li>
<li><p>Elevata complessità Sebbene esistano già molti algoritmi estesi basati su Paxos e Raft, l'emergere di <a href="http://www.vldb.org/pvldb/vol13/p3072-huang.pdf">Multi-Raft</a> e <a href="https://www.vldb.org/pvldb/vol11/p1849-cao.pdf">Parallel Raft</a> richiede ulteriori considerazioni e test sulla sincronizzazione tra log e macchine a stati.</p></li>
<li><p>Prestazioni compromesse In un'era cloud-native, lo storage locale viene sostituito da soluzioni di storage condivise come EBS e S3 per garantire l'affidabilità e la coerenza dei dati. Di conseguenza, la replica basata sul consenso non è più un obbligo per i sistemi distribuiti. Inoltre, la replica basata sul consenso comporta il problema della ridondanza dei dati, poiché sia la soluzione che EBS hanno più repliche.</p></li>
</ol>
<p>Per la replica multi-datacenter e multi-cloud, la ricerca della coerenza compromette non solo la disponibilità ma anche la <a href="https://en.wikipedia.org/wiki/PACELC_theorem">latenza</a>, con un conseguente calo delle prestazioni. Pertanto, la linearizzazione non è un requisito indispensabile per la tolleranza ai disastri di più data center nella maggior parte delle applicazioni.</p>
<h2 id="A-log-replication-strategy-for-cloud-native-and-distributed-database" class="common-anchor-header">Una strategia di replica dei log per database cloud-nativi e distribuiti<button data-href="#A-log-replication-strategy-for-cloud-native-and-distributed-database" class="anchor-icon" translate="no">
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
    </button></h2><p>È innegabile che gli algoritmi basati sul consenso, come Raft e Paxos, siano ancora gli algoritmi principali adottati da molti database OLTP. Tuttavia, osservando gli esempi del protocollo <a href="https://www.microsoft.com/en-us/research/publication/pacifica-replication-in-log-based-distributed-storage-systems/">PacificA</a>, di <a href="https://www.microsoft.com/en-us/research/uploads/prod/2019/05/socrates.pdf">Socrates</a> e di <a href="https://rockset.com/">Rockset</a>, possiamo notare che la tendenza si sta spostando.</p>
<p>Esistono due principi fondamentali per una soluzione che possa servire al meglio un database distribuito cloud-native.</p>
<h3 id="1-Replication-as-a-service" class="common-anchor-header">1. La replica come servizio</h3><p>È necessario un microservizio separato dedicato alla sincronizzazione dei dati. Il modulo di sincronizzazione e quello di archiviazione non devono più essere strettamente accoppiati all'interno dello stesso processo.</p>
<p>Ad esempio, Socrates disaccoppia storage, log e computing. Esiste un servizio di log dedicato (servizio XLog al centro della figura sottostante).</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_0d7822a781.png" alt="Socrates architecture" class="doc-image" id="socrates-architecture" />
   </span> <span class="img-wrapper"> <span>Architettura di Socrates</span> </span></p>
<p>Il servizio XLog è un servizio individuale. La persistenza dei dati è ottenuta con l'aiuto di uno storage a bassa latenza. La zona di atterraggio di Socrates è incaricata di mantenere tre repliche a velocità accelerata.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_6d1182b6f1.png" alt="Socrates XLog service" class="doc-image" id="socrates-xlog-service" />
   </span> <span class="img-wrapper"> <span>Servizio Socrates XLog</span> </span></p>
<p>Il nodo leader distribuisce i log al log broker in modo asincrono e scarica i dati su Xstore. La cache SSD locale può accelerare la lettura dei dati. Una volta che il flush dei dati ha avuto successo, i buffer nella landing zone possono essere puliti. Ovviamente, tutti i dati di log sono suddivisi in tre livelli: landing zone, SSD locale e XStore.</p>
<h3 id="2-Russian-doll-principle" class="common-anchor-header">2. Principio della bambola russa</h3><p>Un modo per progettare un sistema è seguire il principio della bambola russa: ogni livello è completo e perfettamente adatto a ciò che fa, in modo che gli altri livelli possano essere costruiti sopra o intorno ad esso.</p>
<p>Quando progettiamo un database cloud-native, dobbiamo sfruttare abilmente altri servizi di terze parti per ridurre la complessità dell'architettura del sistema.</p>
<p>Sembra che non si possa fare a meno di Paxos per evitare il single point failure. Tuttavia, possiamo semplificare notevolmente la replica dei log affidando l'elezione del leader a Raft o ai servizi Paxos basati su <a href="https://research.google.com/archive/chubby-osdi06.pdf">Chubby</a>, <a href="https://github.com/bloomreach/zk-replicator">Zk</a> e <a href="https://etcd.io/">etcd</a>.</p>
<p>Ad esempio, l'architettura di <a href="https://rockset.com/">Rockset</a> segue il principio della bambola russa e utilizza Kafka/Kineses per i log distribuiti, S3 per lo storage e la cache SSD locale per migliorare le prestazioni delle query.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://user-images.githubusercontent.com/1500781/165926697-c8b380dc-d71a-41a9-a76d-a261b77f0b5d.png" alt="Rockset architecture" class="doc-image" id="rockset-architecture" />
   </span> <span class="img-wrapper"> <span>Architettura di Rockset</span> </span></p>
<h3 id="The-Milvus-approach" class="common-anchor-header">L'approccio di Milvus</h3><p>La consistenza sintonizzabile in Milvus è di fatto simile alla lettura di follower nella replica basata sul consenso. La funzione di lettura follower si riferisce all'utilizzo di repliche follower per eseguire operazioni di lettura dei dati con la premessa di una forte coerenza. Lo scopo è quello di migliorare il throughput del cluster e ridurre il carico sul leader. Il meccanismo alla base della funzione di lettura follower consiste nell'interrogare l'indice di commit dell'ultimo log e nel fornire un servizio di query finché tutti i dati dell'indice di commit non vengono applicati alle macchine a stati.</p>
<p>Tuttavia, il progetto di Milvus non ha adottato la strategia follower. In altre parole, Milvus non interroga l'indice di commit ogni volta che riceve una richiesta di interrogazione. Invece, Milvus adotta un meccanismo simile alla filigrana di <a href="https://flink.apache.org/">Flink</a>, che notifica al nodo di interrogazione la posizione dell'indice di commit a intervalli regolari. Il motivo di questo meccanismo è che gli utenti di Milvus di solito non hanno grandi esigenze di coerenza dei dati e possono accettare un compromesso nella visibilità dei dati per migliorare le prestazioni del sistema.</p>
<p>Inoltre, Milvus adotta anche microservizi multipli e separa l'archiviazione dall'elaborazione. Nell'<a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md#A-bare-bones-skeleton-of-the-Milvus-architecture">architettura</a> di <a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md#A-bare-bones-skeleton-of-the-Milvus-architecture">Milvus</a>, per lo storage vengono utilizzati S3, MinIo e Azure Blob.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Milvus_architecture_b7743a4a7f.png" alt="Milvus architecture" class="doc-image" id="milvus-architecture" />
   </span> <span class="img-wrapper"> <span>Architettura Milvus</span> </span></p>
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
    </button></h2><p>Oggi un numero crescente di database cloud-native fa della replica dei log un servizio individuale. In questo modo, è possibile ridurre il costo dell'aggiunta di repliche di sola lettura e di repliche eterogenee. L'uso di più microservizi consente di utilizzare rapidamente un'infrastruttura matura basata sul cloud, cosa impossibile per i database tradizionali. Un singolo servizio di log può affidarsi alla replica basata sul consenso, ma può anche seguire la strategia della bambola russa per adottare vari protocolli di consistenza insieme a Paxos o Raft per ottenere la linearizzazione.</p>
<h2 id="References" class="common-anchor-header">Riferimenti<button data-href="#References" class="anchor-icon" translate="no">
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
<li>Lamport L. Paxos reso semplice[J]. ACM SIGACT News (Distributed Computing Column) 32, 4 (numero intero 121, dicembre 2001), 2001: 51-58.</li>
<li>Ongaro D, Ousterhout J. Alla ricerca di un algoritmo di consenso comprensibile[C]//2014 USENIX Annual Technical Conference (Usenix ATC 14). 2014: 305-319.</li>
<li>Oki B M, Liskov B H. Viewstamped replication: A new primary copy method to support highly-available distributed systems[C]//Proceedings of the seventh annual ACM Symposium on Principles of distributed computing. 1988: 8-17.</li>
<li>Lin W, Yang M, Zhang L, et al. PacificA: Replication in log-based distributed storage systems[J]. 2008.</li>
<li>Verbitski A, Gupta A, Saha D, et al. Amazon aurora: On avoiding distributed consensus for i/os, commits, and membership changes[C]//Proceedings of the 2018 International Conference on Management of Data. 2018: 789-796.</li>
<li>Antonopoulos P, Budovski A, Diaconu C, et al. Socrates: The new sql server in the cloud[C]//Proceedings of the 2019 International Conference on Management of Data. 2019: 1743-1756.</li>
</ul>
