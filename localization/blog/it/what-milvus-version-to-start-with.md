---
id: what-milvus-version-to-start-with.md
title: Quale versione di Milvus per iniziare?
author: Chris Churilo
date: 2024-02-19T00:00:00.000Z
desc: >-
  Una guida completa alle caratteristiche e alle capacità di ogni versione di
  Milvus per prendere una decisione informata per i vostri progetti di ricerca
  vettoriale.
cover: assets.zilliz.com/which_milvus_to_start_4a4250e314.jpeg
tag: Engineering
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Vector Management
recommend: true
canonicalUrl: 'https://milvus.io/blog/what-milvus-version-to-start-with.md'
---
<custom-h1>Introduzione alle versioni di Milvus</custom-h1><p>La scelta della versione Milvus appropriata è fondamentale per il successo di qualsiasi progetto che sfrutti la tecnologia di ricerca vettoriale. Con le diverse versioni di Milvus adattate a vari requisiti, capire l'importanza della scelta della versione corretta è fondamentale per ottenere i risultati desiderati.</p>
<p>La giusta versione di Milvus può aiutare uno sviluppatore ad apprendere e a prototipare rapidamente o a ottimizzare l'utilizzo delle risorse, a snellire gli sforzi di sviluppo e a garantire la compatibilità con l'infrastruttura e gli strumenti esistenti. In definitiva, si tratta di mantenere la produttività degli sviluppatori e di migliorare l'efficienza, l'affidabilità e la soddisfazione degli utenti.</p>
<h2 id="Available-Milvus-versions" class="common-anchor-header">Versioni disponibili di Milvus<button data-href="#Available-Milvus-versions" class="anchor-icon" translate="no">
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
    </button></h2><p>Per gli sviluppatori sono disponibili tre versioni di Milvus, tutte open source. Le tre versioni sono Milvus Lite, Milvus Standalone e Milvus Cluster, che si differenziano per le caratteristiche e per il modo in cui gli utenti intendono utilizzare Milvus a breve e lungo termine. Analizziamole singolarmente.</p>
<h2 id="Milvus-Lite" class="common-anchor-header">Milvus Lite<button data-href="#Milvus-Lite" class="anchor-icon" translate="no">
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
    </button></h2><p>Come suggerisce il nome, Milvus Lite è una versione leggera che si integra perfettamente con Google Colab e Jupyter Notebook. È confezionato come un singolo binario senza dipendenze aggiuntive, il che lo rende facile da installare ed eseguire sulla propria macchina o da incorporare in applicazioni Python. Inoltre, Milvus Lite include un server Milvus standalone basato su CLI, che offre la flessibilità di eseguirlo direttamente sul computer. La scelta di incorporarlo nel codice Python o di utilizzarlo come server autonomo dipende esclusivamente dalle vostre preferenze e dai requisiti specifici dell'applicazione.</p>
<h3 id="Features-and-Capabilities" class="common-anchor-header">Caratteristiche e capacità</h3><p>Milvus Lite include tutte le funzioni principali di ricerca vettoriale di Milvus.</p>
<ul>
<li><p><strong>Capacità di ricerca</strong>: Supporta ricerche top-k, range e ibride, compreso il filtraggio dei metadati, per soddisfare le diverse esigenze di ricerca.</p></li>
<li><p><strong>Tipi di indice e metriche di somiglianza</strong>: Offre il supporto per 11 tipi di indice e cinque metriche di somiglianza, garantendo flessibilità e opzioni di personalizzazione per i vostri casi d'uso specifici.</p></li>
<li><p><strong>Elaborazione dei dati</strong>: Consente l'elaborazione batch (Apache Parquet, Array, JSON) e in streaming, con una perfetta integrazione attraverso i connettori per Airbyte, Apache Kafka e Apache Spark.</p></li>
<li><p><strong>Operazioni CRUD</strong>: Offre un supporto CRUD completo (creazione, lettura, aggiornamento/upert, cancellazione), consentendo agli utenti di disporre di funzionalità complete di gestione dei dati.</p></li>
</ul>
<h3 id="Applications-and-limitations" class="common-anchor-header">Applicazioni e limitazioni</h3><p>Milvus Lite è ideale per la prototipazione rapida e lo sviluppo locale, in quanto offre un supporto per la configurazione rapida e la sperimentazione di insiemi di dati su piccola scala sulla propria macchina. Tuttavia, i suoi limiti diventano evidenti quando si passa ad ambienti di produzione con set di dati più grandi e requisiti infrastrutturali più impegnativi. Per questo motivo, anche se Milvus Lite è uno strumento eccellente per l'esplorazione e il test iniziali, potrebbe non essere adatto per la distribuzione di applicazioni in ambienti ad alto volume o pronti per la produzione.</p>
<h3 id="Available-Resources" class="common-anchor-header">Risorse disponibili</h3><ul>
<li><p><a href="https://milvus.io/docs/milvus_lite.md">Documentazione</a></p></li>
<li><p><a href="https://github.com/milvus-io/milvus-lite/">Repository Github</a></p></li>
<li><p><a href="https://github.com/milvus-io/milvus-lite/tree/main/examples">Esempio di Google Colab</a></p></li>
<li><p><a href="https://www.youtube.com/watch?v=IgJdrGiB5ZY">Video introduttivo</a></p></li>
</ul>
<h2 id="Milvus-Standalone" class="common-anchor-header">Milvus standalone<button data-href="#Milvus-Standalone" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus offre due modalità operative: Standalone e Cluster. Entrambe le modalità sono identiche per quanto riguarda le funzioni principali del database vettoriale e differiscono per quanto riguarda il supporto delle dimensioni dei dati e i requisiti di scalabilità. Questa distinzione consente di scegliere la modalità che meglio si adatta alle dimensioni del set di dati, al volume di traffico e ad altri requisiti dell'infrastruttura per la produzione.</p>
<p>Milvus Standalone è una modalità di funzionamento del sistema di database vettoriale Milvus che opera in modo indipendente come singola istanza senza alcun clustering o configurazione distribuita. In questa modalità Milvus viene eseguito su un singolo server o macchina, fornendo funzionalità come l'indicizzazione e la ricerca di vettori. È adatto a situazioni in cui la scala dei dati e del volume di traffico è relativamente piccola e non richiede le capacità distribuite fornite da una configurazione in cluster.</p>
<h3 id="Features-and-Capabilities" class="common-anchor-header">Caratteristiche e capacità</h3><ul>
<li><p><strong>Prestazioni elevate</strong>: Eseguire ricerche vettoriali su enormi insiemi di dati (miliardi o più) con velocità ed efficienza eccezionali.</p></li>
<li><p><strong>Capacità di ricerca</strong>: Supporta ricerche top-k, range e ibride, compreso il filtraggio dei metadati, per soddisfare le diverse esigenze di ricerca.</p></li>
<li><p><strong>Tipi di indice e metriche di somiglianza</strong>: Offre il supporto per 11 tipi di indice e 5 metriche di somiglianza, garantendo flessibilità e opzioni di personalizzazione per i vostri casi d'uso specifici.</p></li>
<li><p><strong>Elaborazione dei dati</strong>: Consente l'elaborazione sia in batch (Apache Parquet, Array, Json) che in streaming, con una perfetta integrazione attraverso i connettori per Airbyte, Apache Kafka e Apache Spark.</p></li>
<li><p><strong>Scalabilità</strong>: Raggiungere la scalabilità dinamica con lo scaling a livello di componente, che consente di aumentare o diminuire la scala in base alla domanda. Milvus può autoscalare a livello di componenti, ottimizzando l'allocazione delle risorse per una maggiore efficienza.</p></li>
<li><p><strong>Multi-tenancy</strong>: Supporta la multi-tenancy con la capacità di gestire fino a 10.000 collezioni/partizioni in un cluster, fornendo un utilizzo efficiente delle risorse e l'isolamento per diversi utenti o applicazioni.</p></li>
<li><p><strong>Operazioni CRUD</strong>: Offre un supporto CRUD completo (creazione, lettura, aggiornamento/upert, cancellazione), consentendo agli utenti di disporre di funzionalità complete di gestione dei dati.</p></li>
</ul>
<h3 id="Essential-components" class="common-anchor-header">Componenti essenziali:</h3><ul>
<li><p>Milvus: il componente funzionale principale.</p></li>
<li><p>etcd: Il motore di metadati responsabile dell'accesso e dell'archiviazione dei metadati dai componenti interni di Milvus, compresi i proxy, i nodi indice e altro.</p></li>
<li><p>MinIO: il motore di archiviazione responsabile della persistenza dei dati all'interno di Milvus.</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Screenshot_2024_02_19_at_4_16_41_PM_5e635586a7.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Figura 1: Architettura autonoma di Milvus</p>
<h3 id="Available-Resources" class="common-anchor-header">Risorse disponibili</h3><ul>
<li><p>Documentazione</p>
<ul>
<li><p><a href="https://milvus.io/docs/prerequisite-docker.md">Lista di controllo dell'ambiente per Milvus con Docker Compose</a></p></li>
<li><p><a href="https://milvus.io/docs/install_standalone-docker.md">Installazione di Milvus Standalone con Docker</a></p></li>
</ul></li>
<li><p><a href="https://github.com/milvus-io/milvus">Repository Github</a></p></li>
</ul>
<h2 id="Milvus-Cluster" class="common-anchor-header">Cluster Milvus<button data-href="#Milvus-Cluster" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus Cluster è una modalità di funzionamento del sistema di database vettoriale Milvus che opera ed è distribuito su più nodi o server. In questa modalità, le istanze di Milvus sono raggruppate insieme per formare un sistema unificato in grado di gestire volumi di dati maggiori e carichi di traffico più elevati rispetto a una configurazione standalone. Milvus Cluster offre caratteristiche di scalabilità, tolleranza ai guasti e bilanciamento del carico, che lo rendono adatto a scenari in cui è necessario gestire grandi dati e servire in modo efficiente molte query simultanee.</p>
<h3 id="Features-and-Capabilities" class="common-anchor-header">Caratteristiche e capacità</h3><ul>
<li><p>Eredita tutte le funzionalità disponibili in Milvus Standalone, tra cui la ricerca vettoriale ad alte prestazioni, il supporto di più tipi di indici e metriche di similarità e la perfetta integrazione con framework di elaborazione batch e stream.</p></li>
<li><p>Offre disponibilità, prestazioni e ottimizzazione dei costi senza precedenti, sfruttando l'elaborazione distribuita e il bilanciamento del carico su più nodi.</p></li>
<li><p>Consente di distribuire e scalare carichi di lavoro sicuri e di livello aziendale con costi totali inferiori, utilizzando in modo efficiente le risorse del cluster e ottimizzando l'allocazione delle risorse in base alle richieste del carico di lavoro.</p></li>
</ul>
<h3 id="Essential-components" class="common-anchor-header">Componenti essenziali:</h3><p>Milvus Cluster comprende otto componenti di microservizi e tre dipendenze di terze parti. Tutti i microservizi possono essere distribuiti su Kubernetes indipendentemente l'uno dall'altro.</p>
<h4 id="Microservice-components" class="common-anchor-header">Componenti del microservizio</h4><ul>
<li><p>Coordinamento radice</p></li>
<li><p>Proxy</p></li>
<li><p>Nodo di interrogazione</p></li>
<li><p>Nodo di interrogazione</p></li>
<li><p>Coordinamenti dell'indice</p></li>
<li><p>Nodo indice</p></li>
<li><p>Coordinamento dati</p></li>
<li><p>Nodo dati</p></li>
</ul>
<h4 id="Third-party-dependencies" class="common-anchor-header">Dipendenze di terze parti</h4><ul>
<li><p>etcd: Memorizza i metadati per i vari componenti del cluster.</p></li>
<li><p>MinIO: Responsabile della persistenza dei dati dei file di grandi dimensioni nel cluster, come i file di indice e di log binari.</p></li>
<li><p>Pulsar: Gestisce i log delle operazioni di mutazione recenti, produce log in streaming e fornisce servizi di publish-subscribe dei log.</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Screenshot_2024_02_19_at_4_18_01_PM_88971280ed.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Figura 2: Architettura del cluster Milvus</p>
<h4 id="Available-Resources" class="common-anchor-header">Risorse disponibili</h4><ul>
<li><p><a href="https://milvus.io/docs/install_cluster-milvusoperator.md">Documentazione</a> | Come iniziare</p>
<ul>
<li><p><a href="https://milvus.io/docs/install_cluster-milvusoperator.md">Installare Milvus Cluster con Milvus Operator</a></p></li>
<li><p><a href="https://milvus.io/docs/install_cluster-helm.md">Installare Milvus Cluster con Helm</a></p></li>
<li><p><a href="https://milvus.io/docs/scaleout.md">Come scalare un cluster Milvus</a></p></li>
</ul></li>
<li><p><a href="https://github.com/milvus-io/milvus">Repository Github</a></p></li>
</ul>
<h2 id="Making-the-Decision-on-which-Milvus-version-to-use" class="common-anchor-header">Decidere la versione di Milvus da utilizzare<button data-href="#Making-the-Decision-on-which-Milvus-version-to-use" class="anchor-icon" translate="no">
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
    </button></h2><p>Per decidere quale versione di Milvus utilizzare per il vostro progetto, dovete considerare fattori quali le dimensioni del vostro set di dati, il volume di traffico, i requisiti di scalabilità e i vincoli dell'ambiente di produzione. Milvus Lite è perfetto per la prototipazione sul vostro portatile. Milvus Standalone offre prestazioni elevate e flessibilità per condurre ricerche vettoriali sui vostri set di dati, rendendolo adatto a implementazioni su scala ridotta, CI/CD e implementazioni offline quando non avete il supporto di Kubernetes... Infine, Milvus Cluster offre disponibilità, scalabilità e ottimizzazione dei costi senza precedenti per carichi di lavoro di livello aziendale, rendendolo la scelta preferita per ambienti di produzione su larga scala e ad alta disponibilità.</p>
<p>Esiste anche un'altra versione che non crea problemi, una versione gestita di Milvus chiamata <a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a>.</p>
<p>In definitiva, la scelta della versione di Milvus dipende dal vostro caso d'uso specifico, dai requisiti dell'infrastruttura e dagli obiettivi a lungo termine. Valutando attentamente questi fattori e comprendendo le caratteristiche e le capacità di ciascuna versione, potrete prendere una decisione informata e in linea con le esigenze e gli obiettivi del vostro progetto. Sia che scegliate Milvus Standalone o Milvus Cluster, potete sfruttare la potenza dei database vettoriali per migliorare le prestazioni e l'efficienza delle vostre applicazioni AI.</p>
