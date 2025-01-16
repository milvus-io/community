---
id: >-
  milvus-2-3-4-faster-searches-expanded-data-support-improved-monitoring-and-more.md
title: >-
  Milvus 2.3.4: Ricerche più veloci, supporto dati ampliato, monitoraggio
  migliorato e altro ancora
author: 'Ken Zhang, Fendy Feng'
date: 2024-01-12T00:00:00.000Z
cover: assets.zilliz.com/What_is_new_in_Milvus_2_3_4_1847b0fa8a.png
tag: News
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Vector Management, Vector Search
desc: introduzione di Milvus 2.3.4 nuove funzionalità e miglioramenti
recommend: true
canonicalUrl: >-
  https://milvus.io/blog/milvus-2-3-4-faster-searches-expanded-data-support-improved-monitoring-and-more.md
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/What_is_new_in_Milvus_2_3_4_1847b0fa8a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Siamo lieti di presentare l'ultima versione di Milvus 2.3.4. Questo aggiornamento introduce una serie di funzionalità e miglioramenti meticolosamente realizzati per ottimizzare le prestazioni, aumentare l'efficienza e offrire un'esperienza utente senza soluzione di continuità. In questo post del blog, approfondiremo i punti salienti di Milvus 2.3.4.</p>
<h2 id="Access-logs-for-improved-monitoring" class="common-anchor-header">Registri di accesso per un monitoraggio migliore<button data-href="#Access-logs-for-improved-monitoring" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus supporta ora i log di accesso, che offrono preziose informazioni sulle interazioni con le interfacce esterne. Questi registri registrano i nomi dei metodi, le richieste degli utenti, i tempi di risposta, i codici di errore e altre informazioni sull'interazione, consentendo agli sviluppatori e agli amministratori di sistema di effettuare analisi delle prestazioni, verifiche di sicurezza e una risoluzione efficiente dei problemi.</p>
<p><strong><em>Nota:</em></strong> <em>attualmente i log di accesso supportano solo le interazioni gRPC. Tuttavia, il nostro impegno per il miglioramento continua e le versioni future estenderanno questa funzionalità per includere i log delle richieste RESTful.</em></p>
<p>Per informazioni più dettagliate, consultare <a href="https://milvus.io/docs/configure_access_logs.md">Configurazione dei registri di accesso</a>.</p>
<h2 id="Parquet-file-imports-for-enhanced-data-processing-efficiency" class="common-anchor-header">Importazione di file Parquet per una maggiore efficienza nell'elaborazione dei dati<button data-href="#Parquet-file-imports-for-enhanced-data-processing-efficiency" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.3.4 supporta ora l'importazione di file Parquet, un formato di archiviazione colonnare ampiamente diffuso, progettato per migliorare l'efficienza dell'archiviazione e dell'elaborazione di insiemi di dati su larga scala. Questa novità offre agli utenti una maggiore flessibilità ed efficienza nell'elaborazione dei dati. Eliminando la necessità di laboriose conversioni di formato dei dati, gli utenti che gestiscono insiemi di dati consistenti nel formato Parquet sperimenteranno un processo di importazione dei dati semplificato, riducendo significativamente il tempo dalla preparazione iniziale dei dati al successivo recupero dei vettori.</p>
<p>Inoltre, il nostro strumento di conversione dei formati di dati, BulkWriter, ha ora adottato Parquet come formato di output predefinito, garantendo un'esperienza più intuitiva per gli sviluppatori.</p>
<h2 id="Binlog-index-on-growing-segments-for-faster-searches" class="common-anchor-header">Indice Binlog su segmenti in crescita per ricerche più rapide<button data-href="#Binlog-index-on-growing-segments-for-faster-searches" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus sfrutta ora un indice binlog sui segmenti in crescita, che consente di effettuare ricerche fino a dieci volte più veloci nei segmenti in crescita. Questo miglioramento aumenta significativamente l'efficienza della ricerca e supporta indici avanzati come IVF o Fast Scan, migliorando l'esperienza complessiva dell'utente.</p>
<h2 id="Support-for-up-to-10000-collectionspartitions" class="common-anchor-header">Supporto per un massimo di 10.000 raccolte/partizioni<button data-href="#Support-for-up-to-10000-collectionspartitions" class="anchor-icon" translate="no">
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
    </button></h2><p>Come le tabelle e le partizioni nei database relazionali, le collezioni e le partizioni sono le unità principali per l'archiviazione e la gestione dei dati vettoriali in Milvus. In risposta all'evoluzione delle esigenze degli utenti in materia di organizzazione dei dati, Milvus 2.3.4 supporta ora fino a 10.000 collezioni/partizioni in un cluster, un salto significativo rispetto al limite precedente di 4.096. Questo miglioramento va a vantaggio di diversi casi d'uso, come la gestione delle basi di conoscenza e gli ambienti multi-tenant. Il supporto ampliato per le collezioni/partizioni deriva da miglioramenti al meccanismo di time tick, alla gestione delle goroutine e all'utilizzo della memoria.</p>
<p><strong><em>Nota:</em></strong> <em>Il limite consigliato per il numero di raccolte/partizioni è di 10.000, poiché il superamento di questo limite può avere un impatto sul recupero dei guasti e sull'utilizzo delle risorse.</em></p>
<h2 id="Other-enhancements" class="common-anchor-header">Altri miglioramenti<button data-href="#Other-enhancements" class="anchor-icon" translate="no">
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
    </button></h2><p>Oltre alle caratteristiche sopra descritte, Milvus 2.3.4 include vari miglioramenti e correzioni di bug. Tra questi, la riduzione dell'uso della memoria durante il recupero dei dati e la gestione dei dati di lunghezza variabile, il perfezionamento della messaggistica di errore, l'accelerazione della velocità di caricamento e il miglioramento del bilanciamento degli shard delle query. Questi miglioramenti collettivi contribuiscono a rendere più fluida ed efficiente l'esperienza complessiva dell'utente.</p>
<p>Per una panoramica completa di tutti i cambiamenti introdotti in Milvus 2.3.4, consultare le nostre <a href="https://milvus.io/docs/release_notes.md#v234">Note di rilascio</a>.</p>
<h2 id="Stay-connected" class="common-anchor-header">Restate in contatto!<button data-href="#Stay-connected" class="anchor-icon" translate="no">
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
    </button></h2><p>Se avete domande o feedback su Milvus, iscrivetevi al nostro <a href="https://discord.com/invite/8uyFbECzPX">canale Discord</a> per confrontarvi direttamente con i nostri ingegneri e la comunità, oppure partecipate al nostro <a href="https://discord.com/invite/RjNbk8RR4f">Milvus Community Lunch and Learn</a> ogni martedì dalle 12 alle 12.30 PST. Potete anche seguirci su <a href="https://twitter.com/milvusio">Twitter</a> o <a href="https://www.linkedin.com/company/the-milvus-project">LinkedIn</a> per le ultime notizie e gli aggiornamenti su Milvus.</p>
