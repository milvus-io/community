---
id: we-replaced-kafka-pulsar-with-a-woodpecker-for-milvus.md
title: >-
  Abbiamo sostituito Kafka/Pulsar con un picchio per Milvus: ecco cosa è
  successo
author: James Luan
date: 2025-05-15T00:00:00.000Z
desc: >-
  Abbiamo costruito Woodpecker, un sistema WAL cloud-native, per sostituire
  Kafka e Pulsar in Milvus e ridurre la complessità operativa e i costi.
cover: >-
  assets.zilliz.com/We_Replaced_Kafka_Pulsar_with_a_Woodpecker_for_Milvus_Here_s_What_Happened_77e8de27a9.png
tag: Engineering
recommend: true
publishToMedium: true
tags: 'Milvus, vector database, vector search, AI Agents, LLM'
meta_keywords: >-
  Replace Kafka, replace Pulsar, messaging queues, Write-Ahead Logging (WAL),
  Milvus vector database
meta_title: |
  We Replaced Kafka/Pulsar with a Woodpecker for Milvus
origin: >-
  https://milvus.io/blog/we-replaced-kafka-pulsar-with-a-woodpecker-for-milvus.md
---
<p><strong>TL;DR:</strong> Abbiamo costruito Woodpecker, un sistema cloud-native di Write-Ahead Logging (WAL), per sostituire Kafka e Pulsar in Milvus 2.6. Il risultato? Operazioni semplificate, prestazioni migliori e costi inferiori per il nostro database vettoriale Milvus.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/We_Replaced_Kafka_Pulsar_with_a_Woodpecker_for_Milvus_Here_s_What_Happened_77e8de27a9.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="The-Starting-Point-When-Message-Queues-No-Longer-Fit" class="common-anchor-header">Il punto di partenza: Quando le code di messaggi non sono più adatte<button data-href="#The-Starting-Point-When-Message-Queues-No-Longer-Fit" class="anchor-icon" translate="no">
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
    </button></h2><p>Abbiamo amato e usato Kafka e Pulsar. Hanno funzionato finché non hanno smesso di funzionare. Con l'evoluzione di Milvus, il principale database vettoriale open-source, abbiamo scoperto che queste potenti code di messaggi non soddisfacevano più i nostri requisiti di scalabilità. Così abbiamo fatto una mossa coraggiosa: abbiamo riscritto la struttura portante dello streaming in Milvus 2.6 e abbiamo implementato il nostro WAL, <strong>Woodpecker</strong>.</p>
<p>Vi illustro il nostro percorso e vi spiego perché abbiamo fatto questo cambiamento, che a prima vista potrebbe sembrare controintuitivo.</p>
<h2 id="Cloud-Native-From-Day-One" class="common-anchor-header">Cloud-nativo fin dal primo giorno<button data-href="#Cloud-Native-From-Day-One" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus è stato un database vettoriale cloud-native fin dalla sua nascita. Sfruttiamo Kubernetes per la scalabilità elastica e il recupero rapido dei guasti, insieme a soluzioni di archiviazione a oggetti come Amazon S3 e MinIO per la persistenza dei dati.</p>
<p>Questo approccio cloud-first offre enormi vantaggi, ma presenta anche alcune sfide:</p>
<ul>
<li><p>I servizi di storage a oggetti nel cloud, come S3, offrono una capacità virtualmente illimitata di gestire throughput e disponibilità, ma con latenze che spesso superano i 100ms.</p></li>
<li><p>I modelli di tariffazione di questi servizi (basati su modelli e frequenza di accesso) possono aggiungere costi imprevisti alle operazioni di database in tempo reale.</p></li>
<li><p>Il bilanciamento delle caratteristiche cloud-native con le esigenze della ricerca vettoriale in tempo reale introduce sfide architettoniche significative.</p></li>
</ul>
<h2 id="The-Shared-Log-Architecture-Our-Foundation" class="common-anchor-header">L'architettura Shared Log: La nostra base<button data-href="#The-Shared-Log-Architecture-Our-Foundation" class="anchor-icon" translate="no">
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
    </button></h2><p>Molti sistemi di ricerca vettoriale si limitano all'elaborazione batch perché la costruzione di un sistema di streaming in un ambiente cloud-nativo presenta sfide ancora maggiori. Milvus, invece, dà priorità alla freschezza dei dati in tempo reale e implementa un'architettura di log condivisa, come un disco rigido per un filesystem.</p>
<p>Questa architettura di log condivisa fornisce una base critica che separa i protocolli di consenso dalle funzionalità di base del database. Adottando questo approccio, Milvus elimina la necessità di gestire direttamente complessi protocolli di consenso, permettendoci di concentrarci sulla fornitura di eccezionali funzionalità di ricerca vettoriale.</p>
<p>Non siamo i soli ad adottare questo modello architetturale: database come AWS Aurora, Azure Socrates e Neon sfruttano tutti un design simile. <strong>Tuttavia, rimane una lacuna significativa nell'ecosistema open-source: nonostante gli evidenti vantaggi di questo approccio, la comunità manca di un'implementazione distribuita del log write-ahead (WAL) a bassa latenza, scalabile ed economica.</strong></p>
<p>Le soluzioni esistenti, come Bookie, si sono rivelate inadeguate per le nostre esigenze, a causa del design pesante del client e dell'assenza di SDK pronti per la produzione per Golang e C++. Questo gap tecnologico ci ha portato al nostro approccio iniziale con le code di messaggi.</p>
<h2 id="Our-Initial-Solution-Message-Queues-as-WAL-and-Its-Limitations" class="common-anchor-header">La nostra soluzione iniziale: Code di messaggi come WAL e i suoi limiti<button data-href="#Our-Initial-Solution-Message-Queues-as-WAL-and-Its-Limitations" class="anchor-icon" translate="no">
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
    </button></h2><p>Per colmare questa lacuna, il nostro approccio iniziale utilizzava le code di messaggi (Kafka/Pulsar) come log di scrittura (WAL). L'architettura funzionava così:</p>
<ul>
<li><p>Tutti gli aggiornamenti in tempo reale in arrivo passano attraverso la coda di messaggi.</p></li>
<li><p>I writer ricevono una conferma immediata una volta accettata dalla coda di messaggi.</p></li>
<li><p>QueryNode e DataNode elaborano i dati in modo asincrono, garantendo un'elevata velocità di scrittura e mantenendo la freschezza dei dati.</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_Milvus_2_0_Architecture_Overview_465f5ba27a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Figura: Panoramica dell'architettura di Milvus 2.0</p>
<p>Questo sistema ha fornito una conferma immediata della scrittura, consentendo al contempo l'elaborazione asincrona dei dati, che era fondamentale per mantenere l'equilibrio tra velocità e freschezza dei dati che gli utenti di Milvus si aspettano.</p>
<h2 id="Why-We-Needed-Something-Different-for-WAL" class="common-anchor-header">Perché avevamo bisogno di qualcosa di diverso per il WAL<button data-href="#Why-We-Needed-Something-Different-for-WAL" class="anchor-icon" translate="no">
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
    </button></h2><p>Con Milvus 2.6, abbiamo deciso di eliminare gradualmente le code di messaggi esterne a favore di Woodpecker, la nostra implementazione WAL cloud-native costruita appositamente. Non è stata una decisione presa alla leggera. Dopo tutto, abbiamo usato con successo Kafka e Pulsar per anni.</p>
<p>Il problema non riguardava queste tecnologie in sé: entrambe sono sistemi eccellenti con potenti funzionalità. La sfida è stata invece rappresentata dalla crescente complessità e dal sovraccarico che questi sistemi esterni hanno introdotto con l'evoluzione di Milvus. Man mano che le nostre esigenze diventavano più specializzate, il divario tra le code di messaggi di uso generale e le esigenze del nostro database vettoriale continuava ad aumentare.</p>
<p>Tre fattori specifici hanno portato alla decisione di costruire un sistema sostitutivo:</p>
<h3 id="Operational-Complexity" class="common-anchor-header">Complessità operativa</h3><p>Dipendenze esterne come Kafka o Pulsar richiedono macchine dedicate con più nodi e un'attenta gestione delle risorse. Questo crea diverse sfide:</p>
<ul>
<li>Aumento della complessità operativa</li>
</ul>
<ul>
<li>Curve di apprendimento più ripide per gli amministratori di sistema</li>
</ul>
<ul>
<li>Rischi più elevati di errori di configurazione e vulnerabilità della sicurezza</li>
</ul>
<h3 id="Architectural-Constraints" class="common-anchor-header">Vincoli architetturali</h3><p>Le code di messaggi come Kafka hanno limitazioni intrinseche sul numero di argomenti supportati. Abbiamo sviluppato VShard come soluzione per la condivisione degli argomenti tra i componenti, ma questa soluzione, pur rispondendo efficacemente alle esigenze di scalabilità, ha introdotto una notevole complessità architettonica.</p>
<p>Queste dipendenze esterne hanno reso più difficile l'implementazione di funzionalità critiche, come la garbage collection dei log, e hanno aumentato gli attriti di integrazione con altri moduli del sistema. Nel corso del tempo, la discrepanza architettonica tra le code di messaggi generiche e le esigenze specifiche e ad alte prestazioni di un database vettoriale è diventata sempre più evidente, spingendoci a rivedere le nostre scelte progettuali.</p>
<h3 id="Resource-Inefficiency" class="common-anchor-header">Inefficienza delle risorse</h3><p>Garantire un'elevata disponibilità con sistemi come Kafka e Pulsar richiede tipicamente:</p>
<ul>
<li><p>Distribuzione distribuita su più nodi</p></li>
<li><p>Allocazione sostanziale delle risorse anche per carichi di lavoro minori</p></li>
<li><p>Memorizzazione di segnali effimeri (come Timetick di Milvus), che non richiedono una conservazione a lungo termine.</p></li>
</ul>
<p>Tuttavia, questi sistemi non hanno la flessibilità di bypassare la persistenza per questi segnali transitori, il che porta a operazioni di I/O non necessarie e all'utilizzo dello storage. Ciò comporta un sovraccarico di risorse sproporzionato e un aumento dei costi, soprattutto in ambienti di piccole dimensioni o con risorse limitate.</p>
<h2 id="Introducing-Woodpecker---A-Cloud-Native-High-Performance-WAL-Engine" class="common-anchor-header">Introduzione di Woodpecker - un motore WAL nativo per il cloud e ad alte prestazioni<button data-href="#Introducing-Woodpecker---A-Cloud-Native-High-Performance-WAL-Engine" class="anchor-icon" translate="no">
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
    </button></h2><p>In Milvus 2.6, abbiamo sostituito Kafka/Pulsar con <strong>Woodpecker</strong>, un sistema WAL cloud-native appositamente costruito. Progettato per l'archiviazione di oggetti, Woodpecker semplifica le operazioni e aumenta le prestazioni e la scalabilità.</p>
<p>Woodpecker è stato costruito da zero per massimizzare il potenziale dello storage cloud-nativo, con un obiettivo preciso: diventare la soluzione WAL a più alto rendimento ottimizzata per gli ambienti cloud, fornendo al contempo le funzionalità fondamentali necessarie per un log write-ahead di sola append.</p>
<h3 id="The-Zero-Disk-Architecture-for-Woodpecker" class="common-anchor-header">L'architettura a zero dischi di Woodpecker</h3><p>L'innovazione principale di Woodpecker è l'<strong>architettura Zero-Disk</strong>:</p>
<ul>
<li><p>Tutti i dati di log sono archiviati in un cloud object storage (come Amazon S3, Google Cloud Storage o Alibaba OS).</p></li>
<li><p>I metadati sono gestiti attraverso archivi distribuiti di valori-chiave come etcd.</p></li>
<li><p>Nessuna dipendenza dal disco locale per le operazioni principali</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_Woodpecker_Architecture_cc31e15ed9.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Figura:  Panoramica dell'architettura Woodpecker</p>
<p>Questo approccio riduce drasticamente i costi operativi, massimizzando la durata e l'efficienza del cloud. Eliminando le dipendenze dal disco locale, Woodpecker si allinea perfettamente ai principi cloud-native e riduce significativamente il carico operativo degli amministratori di sistema.</p>
<h3 id="Performance-Benchmarks-Exceeding-Expectations" class="common-anchor-header">Benchmark delle prestazioni: Superare le aspettative</h3><p>Abbiamo eseguito benchmark completi per valutare le prestazioni di Woodpecker in una configurazione a singolo nodo, singolo client e singolo log-stream. I risultati sono stati impressionanti se confrontati con Kafka e Pulsar:</p>
<table>
<thead>
<tr><th><strong>Sistema</strong></th><th><strong>Kafka</strong></th><th><strong>Pulsar</strong></th><th><strong>WP MinIO</strong></th><th><strong>WP Locale</strong></th><th><strong>WP S3</strong></th></tr>
</thead>
<tbody>
<tr><td>Velocità di trasmissione</td><td>129,96 MB/s</td><td>107 MB/s</td><td>71 MB/s</td><td>450 MB/s</td><td>750 MB/s</td></tr>
<tr><td>Latenza</td><td>58 ms</td><td>35 ms</td><td>184 ms</td><td>1,8 ms</td><td>166 ms</td></tr>
</tbody>
</table>
<p>Per contestualizzare, abbiamo misurato i limiti teorici di throughput di diversi backend di archiviazione sulla nostra macchina di prova:</p>
<ul>
<li><p><strong>MinIO</strong>: ~110 MB/s</p></li>
<li><p><strong>File system locale</strong>: 600-750 MB/s</p></li>
<li><p><strong>Amazon S3 (singola istanza EC2)</strong>: fino a 1,1 GB/s</p></li>
</ul>
<p>Notevolmente, Woodpecker ha raggiunto costantemente il 60-80% del throughput massimo possibile per ogni backend, un livello di efficienza eccezionale per un middleware.</p>
<h4 id="Key-Performance-Insights" class="common-anchor-header">Principali informazioni sulle prestazioni</h4><ol>
<li><p><strong>Modalità file system locale</strong>: Woodpecker ha raggiunto 450 MB/s - 3,5 volte più veloce di Kafka e 4,2 volte più veloce di Pulsar - con una latenza bassissima di soli 1,8 ms, che lo rende ideale per le implementazioni a nodo singolo ad alte prestazioni.</p></li>
<li><p><strong>Modalità di archiviazione cloud (S3)</strong>: Scrivendo direttamente su S3, Woodpecker ha raggiunto 750 MB/s (circa il 68% del limite teorico di S3), 5,8 volte superiore a Kafka e 7 volte superiore a Pulsar. Sebbene la latenza sia più elevata (166 ms), questa configurazione offre un throughput eccezionale per i carichi di lavoro orientati ai batch.</p></li>
<li><p><strong>Modalità di archiviazione degli oggetti (MinIO)</strong>: Anche con MinIO, Woodpecker ha raggiunto 71 MB/s, circa il 65% della capacità di MinIO. Queste prestazioni sono paragonabili a quelle di Kafka e Pulsar, ma con requisiti di risorse significativamente inferiori.</p></li>
</ol>
<p>Woodpecker è particolarmente ottimizzato per le scritture concomitanti ad alto volume, dove il mantenimento dell'ordine è fondamentale. Questi risultati riflettono solo le prime fasi di sviluppo: le ottimizzazioni in corso per l'unione dell'I/O, il buffering intelligente e il prefetching dovrebbero portare le prestazioni ancora più vicino ai limiti teorici.</p>
<h3 id="Design-Goals" class="common-anchor-header">Obiettivi di progettazione</h3><p>Woodpecker risponde alle esigenze in evoluzione dei carichi di lavoro di ricerca vettoriale in tempo reale attraverso questi requisiti tecnici chiave:</p>
<ul>
<li><p>Ingestione dei dati ad alta velocità con persistenza duratura in tutte le zone di disponibilità.</p></li>
<li><p>Letture di coda a bassa latenza per le sottoscrizioni in tempo reale e letture di recupero ad alta velocità per il ripristino dei guasti.</p></li>
<li><p>backend di storage collegabili, tra cui storage a oggetti nel cloud e file system con supporto del protocollo NFS</p></li>
<li><p>Opzioni di implementazione flessibili, che supportano sia configurazioni standalone leggere che cluster su larga scala per implementazioni Milvus multi-tenant.</p></li>
</ul>
<h3 id="Architecture-Components" class="common-anchor-header">Componenti dell'architettura</h3><p>Una distribuzione standard di Woodpecker comprende i seguenti componenti.</p>
<ul>
<li><p><strong>Client</strong> - Livello di interfaccia per l'emissione di richieste di lettura e scrittura.</p></li>
<li><p><strong>LogStore</strong> - Gestisce il buffering di scrittura ad alta velocità, i caricamenti asincroni sullo storage e la compattazione dei registri</p></li>
<li><p><strong>Storage Backend</strong> - Supporta servizi di storage scalabili e a basso costo come S3, GCS e file system come EFS.</p></li>
<li><p><strong>ETCD</strong> - Memorizza i metadati e coordina lo stato dei log tra i nodi distribuiti.</p></li>
</ul>
<h3 id="Flexible-Deployments-to-Match-Your-Specific-Needs" class="common-anchor-header">Implementazioni flessibili per soddisfare le vostre esigenze specifiche</h3><p>Woodpecker offre due modalità di distribuzione per soddisfare le vostre esigenze specifiche:</p>
<p><strong>Modalità MemoryBuffer - Leggera e senza manutenzione</strong></p>
<p>La modalità MemoryBuffer offre un'opzione di distribuzione semplice e leggera in cui Woodpecker bufferizza temporaneamente le scritture in arrivo in memoria e le invia periodicamente a un servizio di archiviazione di oggetti nel cloud. I metadati sono gestiti tramite etcd per garantire coerenza e coordinamento. Questa modalità è più adatta per carichi di lavoro batch-heavy in distribuzioni su scala ridotta o in ambienti di produzione che privilegiano la semplicità rispetto alle prestazioni, soprattutto quando la bassa latenza di scrittura non è fondamentale.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_The_memory_Buffer_Mode_3429d693a1.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figura: La modalità memoryBuffer</em></p>
<p><strong>Modalità QuorumBuffer - Ottimizzata per implementazioni a bassa latenza e alta durata</strong></p>
<p>La modalità QuorumBuffer è progettata per carichi di lavoro di lettura/scrittura sensibili alla latenza e ad alta frequenza, che richiedono una reattività in tempo reale e una forte tolleranza agli errori. In questa modalità, Woodpecker funziona come un buffer di scrittura ad alta velocità con scritture quorum a tre repliche, garantendo una forte coerenza e un'elevata disponibilità.</p>
<p>Una scrittura è considerata riuscita una volta replicata su almeno due dei tre nodi, e in genere viene completata entro una cifra di millisecondi, dopodiché i dati vengono scaricati in modo asincrono sull'archivio oggetti del cloud per una durata a lungo termine. Questa architettura riduce al minimo lo stato sui nodi, elimina la necessità di grandi volumi di dischi locali ed evita le complesse riparazioni anti-entropia spesso necessarie nei sistemi tradizionali basati sul quorum.</p>
<p>Il risultato è un livello WAL snello e robusto, ideale per gli ambienti di produzione mission-critical in cui coerenza, disponibilità e ripristino rapido sono essenziali.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_The_Quorum_Buffer_Mode_72573dc666.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figura: La modalità QuorumBuffer</em></p>
<h2 id="StreamingService-Built-for-Real-Time-Data-Flow" class="common-anchor-header">StreamingService: Costruito per il flusso di dati in tempo reale<button data-href="#StreamingService-Built-for-Real-Time-Data-Flow" class="anchor-icon" translate="no">
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
    </button></h2><p>Oltre a Woodpecker, Milvus 2.6 introduce lo <strong>StreamingService, un</strong>componente specializzato progettato per la gestione dei log, l'ingestione dei log e la sottoscrizione di dati in streaming.</p>
<p>Per capire come funziona la nostra nuova architettura, è importante chiarire la relazione tra questi due componenti:</p>
<ul>
<li><p><strong>Woodpecker</strong> è il livello di storage che gestisce l'effettiva persistenza dei registri write-ahead, fornendo durabilità e affidabilità.</p></li>
<li><p><strong>StreamingService</strong> è il livello di servizio che gestisce le operazioni di log e fornisce funzionalità di streaming dei dati in tempo reale.</p></li>
</ul>
<p>Insieme, costituiscono una sostituzione completa delle code di messaggi esterne. Woodpecker fornisce la base di archiviazione durevole, mentre StreamingService fornisce la funzionalità di alto livello con cui le applicazioni interagiscono direttamente. Questa separazione delle preoccupazioni consente di ottimizzare ogni componente per il suo ruolo specifico e di lavorare insieme senza problemi come sistema integrato.</p>
<h3 id="Adding-Streaming-Service-to-Milvus-26" class="common-anchor-header">Aggiunta del servizio di streaming a Milvus 2.6</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_Milvus_2_6_Architecture_Overview_238428c58f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Figura: Aggiunta del servizio di streaming nell'architettura di Milvus 2.6</p>
<p>Il servizio di streaming è composto da tre componenti principali:</p>
<p><strong>Coordinatore di streaming</strong></p>
<ul>
<li><p>Scopre i nodi di streaming disponibili monitorando le sessioni ETCD di Milvus.</p></li>
<li><p>Gestisce lo stato dei WAL e raccoglie le metriche di bilanciamento del carico attraverso il ManagerService.</p></li>
</ul>
<p><strong>Cliente di streaming</strong></p>
<ul>
<li><p>Interroga il servizio AssignmentService per determinare la distribuzione dei segmenti WAL tra i nodi di streaming.</p></li>
<li><p>Esegue operazioni di lettura/scrittura tramite il servizio HandlerService sul nodo di streaming appropriato.</p></li>
</ul>
<p><strong>Nodo di flusso</strong></p>
<ul>
<li><p>Gestisce le operazioni WAL effettive e fornisce funzionalità publish-subscribe per lo streaming dei dati in tempo reale.</p></li>
<li><p>Include il <strong>servizio ManagerService</strong> per l'amministrazione del WAL e il reporting delle prestazioni.</p></li>
<li><p>Include il <strong>servizio HandlerService</strong> che implementa meccanismi efficienti di publish-subscribe per le voci del WAL.</p></li>
</ul>
<p>Questa architettura a strati permette a Milvus di mantenere una netta separazione tra le funzionalità di streaming (sottoscrizione, elaborazione in tempo reale) e i meccanismi di archiviazione veri e propri. Woodpecker gestisce il "come" dell'archiviazione dei log, mentre StreamingService gestisce il "cosa" e il "quando" delle operazioni di log.</p>
<p>Di conseguenza, lo Streaming Service migliora significativamente le capacità in tempo reale di Milvus introducendo il supporto nativo per le sottoscrizioni, eliminando la necessità di code di messaggi esterne. Riduce il consumo di memoria consolidando le cache precedentemente duplicate nei percorsi delle query e dei dati, riduce la latenza per le letture fortemente coerenti eliminando i ritardi di sincronizzazione asincrona e migliora la scalabilità e la velocità di recupero in tutto il sistema.</p>
<h2 id="Conclusion---Streaming-on-a-Zero-Disk-Architecture" class="common-anchor-header">Conclusione - Streaming su un'architettura a zero dischi<button data-href="#Conclusion---Streaming-on-a-Zero-Disk-Architecture" class="anchor-icon" translate="no">
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
    </button></h2><p>La gestione dello stato è difficile. I sistemi con stato spesso sacrificano l'elasticità e la scalabilità. La risposta sempre più accettata nella progettazione cloud-native è quella di disaccoppiare lo stato dal calcolo, consentendo a ciascuno di essi di scalare in modo indipendente.</p>
<p>Piuttosto che reinventare la ruota, deleghiamo la complessità dello storage durevole e scalabile ai team di ingegneri di livello mondiale che stanno dietro a servizi come AWS S3, Google Cloud Storage e MinIO. Tra questi, S3 si distingue per la sua capacità virtualmente illimitata, gli undici nove (99,999999999%) di durata, la disponibilità del 99,99% e le prestazioni di lettura/scrittura ad alta velocità.</p>
<p>Ma anche le architetture "zero-disk" hanno dei compromessi. I negozi di oggetti devono ancora fare i conti con un'elevata latenza di scrittura e con le inefficienze dei file di piccole dimensioni, limitazioni che rimangono irrisolte in molti carichi di lavoro in tempo reale.</p>
<p>Per i database vettoriali, in particolare quelli che supportano i carichi di lavoro mission-critical di RAG, agenti AI e ricerca a bassa latenza, l'accesso in tempo reale e la velocità di scrittura non sono negoziabili. Ecco perché abbiamo riarchitettato Milvus attorno a Woodpecker e al servizio di streaming. Questo cambiamento semplifica l'intero sistema (nessuno vuole mantenere uno stack Pulsar completo all'interno di un database vettoriale), garantisce dati più freschi, migliora l'efficienza dei costi e accelera il ripristino dei guasti.</p>
<p>Riteniamo che Woodpecker sia più di un semplice componente di Milvus: può servire come elemento fondante per altri sistemi cloud-nativi. Con l'evoluzione dell'infrastruttura cloud, innovazioni come S3 Express potrebbero avvicinarci ancora di più all'ideale: durabilità cross-AZ con latenza di scrittura a una cifra al millisecondo.</p>
<h2 id="Whats-Next" class="common-anchor-header">Il prossimo passo<button data-href="#Whats-Next" class="anchor-icon" translate="no">
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
    </button></h2><p>Rimanete sintonizzati per l'imminente Milvus 2.6 con Woodpecker e tante altre potenti funzioni. Siete pronti a sperimentare il miglioramento delle prestazioni e la semplificazione delle operazioni? Date un'occhiata alla nostra<a href="https://milvus.io/docs"> documentazione</a> per iniziare! Siete inoltre invitati a unirvi alla comunità Milvus su<a href="https://discord.gg/milvus"> Discord</a> o <a href="https://github.com/milvus-io/milvus/discussions">GitHub</a> per porre domande o condividere le vostre esperienze.</p>
<p>Se avete problemi con carichi di lavoro di ricerca vettoriale mission-critical su larga scala, saremo lieti di aiutarvi.<a href="https://milvus.io/office-hours"> Prenotate una sessione di Milvus Office Hours</a> per discutere le vostre esigenze specifiche con il nostro team di ingegneri.</p>
