---
id: milvus-at-its-best-exploring-2-2-to-2-2-6.md
title: 'Milvus al suo meglio: esplorazione dalla v2.2 alla v2.2.6'
author: Fendy Feng
date: 2023-04-22T00:00:00.000Z
cover: assets.zilliz.com/explore_milvus_latest_versions_48a4138d02.png
tag: News
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Vector Management
desc: Cosa c'è di nuovo in Milvus da 2.2 a 2.2.6
recommend: true
canonicalUrl: 'https://milvus.io/blog/milvus-at-its-best-exploring-2-2-to-2-2-6.md'
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/exploring_milvus_latest_versions_4fa890533e.png" alt="Milvus at Its Best" class="doc-image" id="milvus-at-its-best" />
   </span> <span class="img-wrapper"> <span>Milvus al suo meglio</span> </span></p>
<p>Bentornati, seguaci di Milvus! Sappiamo che è passato un po' di tempo dall'ultima volta che abbiamo condiviso i nostri aggiornamenti su questo database vettoriale open-source all'avanguardia. Ma non temete, perché siamo qui per aggiornarvi su tutti gli entusiasmanti sviluppi avvenuti dallo scorso agosto.</p>
<p>In questo post vi illustreremo le ultime release di Milvus, dalla versione 2.2 alla versione 2.2.6. Abbiamo molto da raccontare, tra cui nuove funzionalità, miglioramenti, correzioni di bug e ottimizzazioni. Quindi, allacciate le cinture di sicurezza e tuffatevi!</p>
<h2 id="Milvus-v22-a-major-release-with-enhanced-stability-faster-search-speed-and-flexible-scalability" class="common-anchor-header">Milvus v2.2: una major release con maggiore stabilità, maggiore velocità di ricerca e scalabilità flessibile<button data-href="#Milvus-v22-a-major-release-with-enhanced-stability-faster-search-speed-and-flexible-scalability" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus v2.2 è una release importante che introduce sette nuovissime funzionalità e numerosi miglioramenti rispetto alle versioni precedenti. Vediamo nel dettaglio alcuni dei punti salienti:</p>
<ul>
<li><strong>Inserimento massivo di entità da file</strong>: Con questa funzione, è possibile caricare un gruppo di entità in uno o più file direttamente in Milvus con poche righe di codice, risparmiando tempo e fatica.</li>
<li><strong>Paginazione dei risultati delle query</strong>: Per evitare la restituzione massiccia dei risultati di ricerche e interrogazioni in un'unica chiamata di procedura remota (RPC), Milvus v2.2 consente di configurare l'impaginazione e il filtraggio dei risultati con parole chiave nelle ricerche e nelle interrogazioni.</li>
<li><strong>Controllo degli accessi basato sui ruoli (RBAC)</strong>: Milvus v2.2 supporta ora RBAC, che consente di controllare l'accesso alla vostra istanza Milvus gestendo utenti, ruoli e autorizzazioni.</li>
<li><strong>Quote e limiti</strong>: Quote e limiti è un nuovo meccanismo di Milvus v2.2 che protegge il sistema di database da errori di memoria esaurita (OOM) e da crash durante improvvisi picchi di traffico. Con questa funzione è possibile controllare l'ingestione, la ricerca e l'utilizzo della memoria.</li>
<li><strong>Tempo di vita (TTL) a livello di raccolta</strong>: Nelle versioni precedenti, Milvus permetteva di configurare il TTL solo per i cluster. Tuttavia, Milvus v2.2 supporta ora la configurazione del TTL a livello di raccolta. Configurando il TTL per una collezione specifica, le entità di quella collezione scadranno automaticamente al termine del TTL. Questa configurazione offre un controllo più preciso sulla conservazione dei dati.</li>
<li><strong>Indici ANNS (Approximate Neighbor Search) basati su disco (Beta)</strong>: Milvus v2.2 introduce il supporto per DiskANN, un algoritmo ANNS basato su grafo Vamana e residente su SSD. Questo supporto consente di effettuare ricerche dirette su insiemi di dati di grandi dimensioni, riducendo in modo significativo l'utilizzo della memoria, fino a 10 volte.</li>
<li><strong>Backup dei dati (Beta)</strong>: Milvus v2.2 offre <a href="https://github.com/zilliztech/milvus-backup">un nuovissimo strumento</a> per eseguire il backup e il ripristino dei dati Milvus in modo corretto, sia attraverso la riga di comando che attraverso un server API.</li>
</ul>
<p>Oltre alle nuove funzioni menzionate sopra, Milvus v2.2 include la correzione di cinque bug e numerosi miglioramenti per migliorare la stabilità, l'osservabilità e le prestazioni di Milvus. Per maggiori dettagli, consultare le <a href="https://milvus.io/docs/release_notes.md#v220">note di rilascio di Milvus v2.2</a>.</p>
<h2 id="Milvus-v221--v222-minor-releases-with-issues-fixed" class="common-anchor-header">Milvus v2.2.1 e v2.2.2: release minori con problemi risolti<button data-href="#Milvus-v221--v222-minor-releases-with-issues-fixed" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus v2.2.1 e v2.2.2 sono release minori che si concentrano sulla correzione di problemi critici nelle versioni precedenti e sull'introduzione di nuove funzionalità. Ecco alcuni punti salienti:</p>
<h3 id="Milvus-v221" class="common-anchor-header">Milvus v2.2.1</h3><ul>
<li>Supporta il tenant e l'autenticazione Pulsa</li>
<li>Supporta la sicurezza del livello di trasporto (TLS) nella sorgente di configurazione etcd</li>
<li>Migliora le prestazioni di ricerca di oltre il 30%.</li>
<li>Ottimizza lo scheduler e aumenta la probabilità di unire le attività</li>
<li>Corregge diversi bug, tra cui il mancato filtraggio dei termini sui campi scalari indicizzati e il panico di IndexNode in caso di mancata creazione di un indice.</li>
</ul>
<h3 id="Milvus-v222" class="common-anchor-header">Milvus v2.2.2</h3><ul>
<li>Corregge il problema per cui il proxy non aggiorna la cache dei leader dello shard</li>
<li>Corregge il problema per cui le informazioni caricate non vengono pulite per le raccolte/partizioni rilasciate.</li>
<li>Corregge il problema per cui il conteggio del carico non viene cancellato in tempo.</li>
</ul>
<p>Per maggiori dettagli, consultare le <a href="https://milvus.io/docs/release_notes.md#v221">Note di rilascio di Milvus v2.2.1</a> e le <a href="https://milvus.io/docs/release_notes.md#v222">Note di rilascio di Milvus v2.2.2</a>.</p>
<h2 id="Milvus-v223-more-secure-stable-and-available" class="common-anchor-header">Milvus v2.2.3: più sicuro, stabile e disponibile<button data-href="#Milvus-v223-more-secure-stable-and-available" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus v2.2.3 è una release che si concentra sul miglioramento della sicurezza, della stabilità e della disponibilità del sistema. Inoltre, introduce due importanti funzionalità:</p>
<ul>
<li><p><strong>Aggiornamento continuo</strong>: questa funzione consente a Milvus di rispondere alle richieste in arrivo durante il processo di aggiornamento, cosa impossibile nelle versioni precedenti. Gli aggiornamenti continui garantiscono che il sistema rimanga disponibile e risponda alle richieste degli utenti anche durante gli aggiornamenti.</p></li>
<li><p><strong>Alta disponibilità del coordinatore (HA)</strong>: Questa funzione consente ai coordinatori di Milvus di lavorare in modalità attiva-standby, riducendo il rischio di guasti in un unico punto. Anche in caso di disastri imprevisti, il tempo di ripristino è ridotto a un massimo di 30 secondi.</p></li>
</ul>
<p>Oltre a queste novità, Milvus v2.2.3 include numerosi miglioramenti e correzioni di bug, tra cui il miglioramento delle prestazioni degli inserimenti massivi, la riduzione dell'uso della memoria, l'ottimizzazione delle metriche di monitoraggio e il miglioramento delle prestazioni del meta-storage. Per maggiori dettagli, consultare le <a href="https://milvus.io/docs/release_notes.md#v223">note di rilascio di Milvus v2.2.3</a>.</p>
<h2 id="Milvus-v224-faster-more-reliable-and-resource-saving" class="common-anchor-header">Milvus v2.2.4: più veloce, più affidabile e con risparmio di risorse<button data-href="#Milvus-v224-faster-more-reliable-and-resource-saving" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus v2.2.4 è un aggiornamento minore a Milvus v2.2. Introduce quattro nuove funzioni e diversi miglioramenti, che si traducono in prestazioni più rapide, maggiore affidabilità e riduzione del consumo di risorse. I punti salienti di questa versione sono:</p>
<ul>
<li><strong>Raggruppamento delle risorse</strong>: Milvus supporta ora il raggruppamento dei QueryNode in altri gruppi di risorse, consentendo il completo isolamento dell'accesso alle risorse fisiche nei diversi gruppi.</li>
<li><strong>Rinominazione delle collezioni</strong>: L'API per la ridenominazione delle collezioni consente agli utenti di cambiare il nome di una collezione, offrendo una maggiore flessibilità nella gestione delle collezioni e migliorando l'usabilità.</li>
<li><strong>Supporto per Google Cloud Storage</strong></li>
<li><strong>Nuova opzione nelle API di ricerca e interrogazione</strong>: Questa nuova funzione consente agli utenti di saltare la ricerca su tutti i segmenti in crescita, offrendo migliori prestazioni di ricerca in scenari in cui la ricerca viene eseguita contemporaneamente all'inserimento dei dati.</li>
</ul>
<p>Per ulteriori informazioni, consultare le <a href="https://milvus.io/docs/release_notes.md#v224">note di rilascio di Milvus v2.2.4</a>.</p>
<h2 id="Milvus-v225-NOT-RECOMMENDED" class="common-anchor-header">Milvus v2.2.5: NON RACCOMANDATO<button data-href="#Milvus-v225-NOT-RECOMMENDED" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus v2.2.5 presenta diversi problemi critici e pertanto si sconsiglia di utilizzare questa versione.  Ci scusiamo sinceramente per i disagi causati da questi problemi. Tuttavia, questi problemi sono stati risolti in Milvus v2.2.6.</p>
<h2 id="Milvus-v226-resolves-critical-issues-from-v225" class="common-anchor-header">Milvus v2.2.6: risolve i problemi critici della v2.2.5<button data-href="#Milvus-v226-resolves-critical-issues-from-v225" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus v2.2.6 ha risolto con successo i problemi critici riscontrati nella v2.2.5, tra cui il problema del riciclo dei dati binlog sporchi e il fallimento del GC di DataCoord. Se attualmente utilizzate la versione 2.2.5, aggiornatela per garantire prestazioni e stabilità ottimali.</p>
<p>I problemi critici risolti includono:</p>
<ul>
<li>Errore di DataCoord GC</li>
<li>Sovrascrittura dei parametri degli indici passati</li>
<li>Ritardo del sistema causato dall'arretratezza dei messaggi RootCoord</li>
<li>Inesattezza della metrica RootCoordInsertChannelTimeTick</li>
<li>Possibile arresto del timestamp</li>
<li>Autodistruzione occasionale del ruolo di coordinatore durante il processo di riavvio</li>
<li>I checkpoint rimangono indietro a causa di un'uscita anomala della garbage collection.</li>
</ul>
<p>Per maggiori dettagli, consultare le <a href="https://milvus.io/docs/release_notes.md#v226">Note di rilascio di Milvus v2.2.6</a>.</p>
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
    </button></h2><p>In conclusione, le ultime release di Milvus, dalla v2.2 alla v2.2.6, hanno apportato molti aggiornamenti e miglioramenti interessanti. Dalle nuove funzionalità alle correzioni di bug e alle ottimizzazioni, Milvus continua a rispettare l'impegno di fornire soluzioni all'avanguardia e potenziare le applicazioni in vari settori. Rimanete sintonizzati per ulteriori aggiornamenti e innovazioni dalla comunità Milvus.</p>
