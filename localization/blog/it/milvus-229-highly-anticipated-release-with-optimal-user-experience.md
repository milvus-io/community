---
id: milvus-229-highly-anticipated-release-with-optimal-user-experience.md
title: 'Milvus 2.2.9: Una release molto attesa con un''esperienza utente ottimale'
author: 'Owen Jiao, Fendy Feng'
date: 2023-06-06T00:00:00.000Z
cover: assets.zilliz.com/What_s_New_in_2_2_9_858e54a2d3.png
tag: News
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Vector Management
recommend: true
canonicalUrl: >-
  https://milvus.io/blog/milvus-229-highly-anticipated-release-with-optimal-user-experience.md
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/What_s_New_in_2_2_9_858e54a2d3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Siamo entusiasti di annunciare l'arrivo di Milvus 2.2.9, una release molto attesa che segna una tappa significativa per il team e la comunità. Questa release offre molte caratteristiche interessanti, tra cui il tanto atteso supporto per i tipi di dati JSON, lo schema dinamico e le chiavi di partizione, garantendo un'esperienza utente ottimizzata e un flusso di lavoro di sviluppo semplificato. Inoltre, questa versione incorpora numerosi miglioramenti e correzioni di bug. Unitevi a noi nell'esplorazione di Milvus 2.2.9 e scoprite perché questa release è così entusiasmante.</p>
<h2 id="Optimized-user-experience-with-JSON-support" class="common-anchor-header">Esperienza utente ottimizzata con il supporto JSON<button data-href="#Optimized-user-experience-with-JSON-support" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus ha introdotto l'atteso supporto per il tipo di dati JSON, che consente di memorizzare senza problemi i dati JSON insieme ai metadati dei vettori nelle collezioni degli utenti. Grazie a questo miglioramento, gli utenti possono inserire in modo efficiente i dati JSON in blocco ed eseguire query e filtri avanzati in base al contenuto dei campi JSON. Inoltre, gli utenti possono sfruttare le espressioni ed eseguire operazioni su misura per i campi JSON del loro set di dati, costruire query e applicare filtri in base al contenuto e alla struttura dei campi JSON, consentendo loro di estrarre informazioni rilevanti e manipolare meglio i dati.</p>
<p>In futuro, il team di Milvus aggiungerà indici per i campi del tipo JSON, ottimizzando ulteriormente le prestazioni delle query miste scalari e vettoriali. Rimanete quindi sintonizzati per gli entusiasmanti sviluppi futuri!</p>
<h2 id="Added-flexibility-with-support-for-dynamic-schema" class="common-anchor-header">Maggiore flessibilità con il supporto di schemi dinamici<button data-href="#Added-flexibility-with-support-for-dynamic-schema" class="anchor-icon" translate="no">
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
    </button></h2><p>Con il supporto per i dati JSON, Milvus 2.2.9 offre ora la funzionalità di schema dinamico attraverso un kit di sviluppo software (SDK) semplificato.</p>
<p>A partire da Milvus 2.2.9, l'SDK Milvus include un'API di alto livello che riempie automaticamente i campi dinamici nel campo JSON nascosto della raccolta, consentendo agli utenti di concentrarsi esclusivamente sui campi aziendali.</p>
<h2 id="Better-data-separation-and-enhanced-search-efficiency-with-Partition-Key" class="common-anchor-header">Migliore separazione dei dati e maggiore efficienza di ricerca con Partition Key<button data-href="#Better-data-separation-and-enhanced-search-efficiency-with-Partition-Key" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.2.9 migliora le sue capacità di suddivisione introducendo la funzione Partition Key. Essa consente di utilizzare colonne specifiche dell'utente come chiavi primarie per il partizionamento, eliminando la necessità di API aggiuntive come <code translate="no">loadPartition</code> e <code translate="no">releasePartition</code>. Questa nuova funzione elimina anche il limite del numero di partizioni, consentendo un utilizzo più efficiente delle risorse.</p>
<h2 id="Support-for-Alibaba-Cloud-OSS" class="common-anchor-header">Supporto per Alibaba Cloud OSS<button data-href="#Support-for-Alibaba-Cloud-OSS" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.2.9 supporta ora Alibaba Cloud Object Storage Service (OSS). Gli utenti di Alibaba Cloud possono configurare facilmente <code translate="no">cloudProvider</code> su Alibaba Cloud e sfruttare l'integrazione perfetta per l'archiviazione e il recupero efficiente dei dati vettoriali nel cloud.</p>
<p>Oltre alle caratteristiche già citate, Milvus 2.2.9 offre il supporto per il database in Role-Based Access Control (RBAC), introduce la gestione delle connessioni e include numerosi miglioramenti e correzioni di bug. Per ulteriori informazioni, consultare le <a href="https://milvus.io/docs/release_notes.md">note di rilascio di Milvus 2.2.9</a>.</p>
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
    </button></h2><p>Se avete domande o feedback su Milvus, non esitate a contattarci tramite <a href="https://twitter.com/milvusio">Twitter</a> o <a href="https://www.linkedin.com/company/the-milvus-project">LinkedIn</a>. Siete anche invitati a unirvi al nostro <a href="https://milvus.io/slack/">canale Slack</a> per chiacchierare direttamente con i nostri ingegneri e con la comunità, oppure a visitare il nostro <a href="https://us02web.zoom.us/meeting/register/tZ0pcO6vrzsuEtVAuGTpNdb6lGnsPBzGfQ1T#/registration">orario d'ufficio del martedì</a>!</p>
