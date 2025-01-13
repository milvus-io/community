---
id: revealing-milvus-2-3-2-and-milvus-2-3-3.md
title: >-
  Rivelazione di Milvus 2.3.2 e 2.3.3: Supporto per i tipi di dati Array,
  cancellazione complessa, integrazione TiKV e altro ancora
author: 'Fendy Feng, Owen Jiao'
date: 2023-11-20T00:00:00.000Z
desc: >-
  Oggi siamo entusiasti di annunciare il rilascio di Milvus 2.3.2 e 2.3.3!
  Questi aggiornamenti apportano molte caratteristiche interessanti,
  ottimizzazioni e miglioramenti, migliorando le prestazioni del sistema, la
  flessibilità e l'esperienza complessiva dell'utente.
cover: assets.zilliz.com/What_s_New_in_Milvus_2_3_2_and_2_3_3_d3d0db03c3.png
tag: News
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Vector Management, Vector Search
recommend: true
canonicalUrl: null
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/What_s_New_in_Milvus_2_3_2_and_2_3_3_d3d0db03c3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Nel panorama in continua evoluzione delle tecnologie di ricerca vettoriale, Milvus rimane all'avanguardia, spingendo i confini e stabilendo nuovi standard. Oggi siamo entusiasti di annunciare il rilascio di Milvus 2.3.2 e 2.3.3! Questi aggiornamenti apportano molte interessanti funzionalità, ottimizzazioni e miglioramenti, migliorando le prestazioni del sistema, la flessibilità e l'esperienza complessiva dell'utente.</p>
<h2 id="Support-for-Array-data-types---making-search-results-more-accurate-and-relevant" class="common-anchor-header">Supporto per i tipi di dati Array - per rendere i risultati delle ricerche più accurati e pertinenti<button data-href="#Support-for-Array-data-types---making-search-results-more-accurate-and-relevant" class="anchor-icon" translate="no">
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
    </button></h2><p>L'aggiunta del supporto per i tipi di dati Array è un miglioramento fondamentale per Milvus, in particolare negli scenari di filtraggio delle query, come intersezione e unione. Questa aggiunta garantisce risultati di ricerca non solo più accurati, ma anche più pertinenti. In termini pratici, ad esempio, nel settore dell'e-commerce, i tag dei prodotti memorizzati come array di stringhe consentono ai consumatori di eseguire ricerche avanzate, filtrando i risultati irrilevanti.</p>
<p>Per una guida approfondita sull'utilizzo dei tipi di array in Milvus, consultate la nostra <a href="https://milvus.io/docs/array_data_type.md">documentazione</a> completa.</p>
<h2 id="Support-for-complex-delete-expressions---improving-your-data-management" class="common-anchor-header">Supporto per espressioni di cancellazione complesse - per migliorare la gestione dei dati<button data-href="#Support-for-complex-delete-expressions---improving-your-data-management" class="anchor-icon" translate="no">
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
    </button></h2><p>Nelle versioni precedenti, Milvus supportava le espressioni di cancellazione delle chiavi primarie, fornendo un'architettura stabile e semplificata. Con Milvus 2.3.2 o 2.3.3, gli utenti possono utilizzare espressioni di cancellazione complesse, che facilitano attività sofisticate di gestione dei dati, come la pulizia dei vecchi dati o la cancellazione dei dati in base alla conformità GDPR basata sugli ID utente.</p>
<p>Nota: assicurarsi di aver caricato le raccolte prima di utilizzare espressioni complesse. Inoltre, è importante notare che il processo di eliminazione non garantisce l'atomicità.</p>
<h2 id="TiKV-integration---scalable-metadata-storage-with-stability" class="common-anchor-header">Integrazione con TiKV - archiviazione scalabile dei metadati con stabilità<button data-href="#TiKV-integration---scalable-metadata-storage-with-stability" class="anchor-icon" translate="no">
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
    </button></h2><p>In precedenza, affidandosi a Etcd per l'archiviazione dei metadati, Milvus si è trovato di fronte a problemi di capacità limitata e di scalabilità dell'archiviazione dei metadati. Per risolvere questi problemi, Milvus ha aggiunto TiKV, un archivio di valori-chiave open-source, come ulteriore opzione per l'archiviazione dei metadati. TiKV offre una maggiore scalabilità, stabilità ed efficienza, che lo rendono una soluzione ideale per i requisiti in evoluzione di Milvus. A partire da Milvus 2.3.2, gli utenti possono passare senza problemi a TiKV per l'archiviazione dei metadati modificando la configurazione.</p>
<h2 id="Support-for-FP16-vector-type---embracing-machine-learning-efficiency" class="common-anchor-header">Supporto per il tipo di vettore FP16 - per l'efficienza dell'apprendimento automatico<button data-href="#Support-for-FP16-vector-type---embracing-machine-learning-efficiency" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.3.2 e le versioni successive supportano ora il tipo di vettore FP16 a livello di interfaccia. FP16, o virgola mobile a 16 bit, è un formato di dati ampiamente utilizzato nel deep learning e nell'apprendimento automatico, che fornisce una rappresentazione e un calcolo efficienti dei valori numerici. Il supporto completo per FP16 è in corso, ma diversi indici nel livello di indicizzazione richiedono la conversione di FP16 in FP32 durante la costruzione.</p>
<p>Nelle versioni successive di Milvus supporteremo pienamente i tipi di dati FP16, BF16 e int8. Restate sintonizzati.</p>
<h2 id="Significant-improvement-in-the-rolling-upgrade-experience---seamless-transition-for-users" class="common-anchor-header">Miglioramento significativo dell'esperienza di aggiornamento continuo - transizione senza soluzione di continuità per gli utenti<button data-href="#Significant-improvement-in-the-rolling-upgrade-experience---seamless-transition-for-users" class="anchor-icon" translate="no">
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
    </button></h2><p>L'aggiornamento continuo è una funzione fondamentale per i sistemi distribuiti, che consente di aggiornare il sistema senza interrompere i servizi aziendali o subire interruzioni. Nelle ultime versioni di Milvus, abbiamo rafforzato la funzione di aggiornamento continuo di Milvus, garantendo una transizione più snella ed efficiente per gli utenti che passano dalla versione 2.2.15 alla 2.3.3 e a tutte le versioni successive. La comunità ha anche investito in test e ottimizzazioni approfondite, riducendo l'impatto delle query durante l'aggiornamento a meno di 5 minuti, offrendo agli utenti un'esperienza senza problemi.</p>
<h2 id="Performance-optimization" class="common-anchor-header">Ottimizzazione delle prestazioni<button data-href="#Performance-optimization" class="anchor-icon" translate="no">
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
    </button></h2><p>Oltre a introdurre nuove funzionalità, nelle ultime due versioni abbiamo ottimizzato in modo significativo le prestazioni di Milvus.</p>
<ul>
<li><p>Operazioni di copia dei dati ridotte al minimo per ottimizzare il caricamento dei dati.</p></li>
<li><p>Semplificazione degli inserimenti di grande capacità con la lettura batch di varchar.</p></li>
<li><p>Eliminati i controlli di offset non necessari durante l'imbottitura dei dati per migliorare le prestazioni della fase di richiamo.</p></li>
<li><p>Risolti i problemi di consumo elevato della CPU in scenari con inserimenti di dati consistenti.</p></li>
</ul>
<p>Queste ottimizzazioni contribuiscono a rendere Milvus più veloce ed efficiente. Date un'occhiata al nostro cruscotto di monitoraggio per vedere come Milvus ha migliorato le sue prestazioni.</p>
<h2 id="Incompatible-changes" class="common-anchor-header">Modifiche incompatibili<button data-href="#Incompatible-changes" class="anchor-icon" translate="no">
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
<li><p>Eliminato definitivamente il codice relativo a TimeTravel.</p></li>
<li><p>Deprecato il supporto a MySQL come archivio di metadati.</p></li>
</ul>
<p>Per informazioni più dettagliate su tutte le nuove funzionalità e i miglioramenti, consultare le <a href="https://milvus.io/docs/release_notes.md">note di rilascio</a> di <a href="https://milvus.io/docs/release_notes.md">Milvus</a>.</p>
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
    </button></h2><p>Con le ultime versioni di Milvus 2.3.2 e 2.3.3, ci impegniamo a fornire una soluzione di database robusta, ricca di funzionalità e ad alte prestazioni. Esplorate queste nuove funzionalità, approfittate delle ottimizzazioni e unitevi a noi in questo viaggio entusiasmante, mentre evolviamo Milvus per soddisfare le esigenze della moderna gestione dei dati. Scaricate subito l'ultima versione e scoprite il futuro dell'archiviazione dei dati con Milvus!</p>
<h2 id="Let’s-keep-in-touch" class="common-anchor-header">Teniamoci in contatto!<button data-href="#Let’s-keep-in-touch" class="anchor-icon" translate="no">
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
    </button></h2><p>Se avete domande o feedback su Milvus, iscrivetevi al nostro <a href="https://discord.com/invite/8uyFbECzPX">canale Discord</a> per confrontarvi direttamente con i nostri ingegneri e la comunità, oppure partecipate al nostro <a href="https://discord.com/invite/RjNbk8RR4f">Milvus Community Lunch and Learn</a> ogni martedì dalle 12 alle 12:30 PST. Potete anche seguirci su <a href="https://twitter.com/milvusio">Twitter</a> o <a href="https://www.linkedin.com/company/the-milvus-project">LinkedIn</a> per le ultime notizie e gli aggiornamenti su Milvus.</p>
