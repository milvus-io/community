---
id: milvus-2210-and-2211-enhanced-stability-and-better-user-experience.md
title: >-
  Milvus 2.2.10 e 2.2.11: aggiornamenti minori per migliorare la stabilità del
  sistema e l'esperienza dell'utente
author: 'Fendy Feng, Owen Jiao'
date: 2023-07-06T00:00:00.000Z
cover: assets.zilliz.com/What_s_New_in_Milvus_2_2_10_and_2_2_11_5018946465.png
tag: News
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Vector Management
desc: introduzione di nuove funzionalità e miglioramenti di Milvus 2.2.10 e 2.2.11
recommend: true
metaTitle: Milvus 2.2.10 & 2.2.11 Enhanced System Stability and User Experience
canonicalUrl: >-
  https://milvus.io/blog/milvus-2210-and-2211-enhanced-stability-and-better-user-experience.md
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/What_s_New_in_Milvus_2_2_10_and_2_2_11_5018946465.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Salve, fan di Milvus! Siamo lieti di annunciare che abbiamo appena rilasciato Milvus 2.2.10 e 2.2.11, due aggiornamenti minori incentrati principalmente sulla correzione di bug e sul miglioramento delle prestazioni generali. Con questi due aggiornamenti potete aspettarvi un sistema più stabile e una migliore esperienza d'uso. Diamo una rapida occhiata alle novità di queste due versioni.</p>
<h2 id="Milvus-2210" class="common-anchor-header">Milvus 2.2.10<button data-href="#Milvus-2210" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.2.10 ha risolto alcuni crash di sistema, accelerato il caricamento e l'indicizzazione, ridotto l'utilizzo della memoria nei nodi dati e apportato molti altri miglioramenti. Di seguito sono riportate alcune modifiche degne di nota:</p>
<ul>
<li>Sostituito il vecchio scrittore di payload CGO con uno nuovo scritto in puro Go, riducendo l'utilizzo di memoria nei nodi dati.</li>
<li>Aggiunto <code translate="no">go-api/v2</code> al file <code translate="no">milvus-proto</code> per evitare confusione con le diverse versioni di <code translate="no">milvus-proto</code>.</li>
<li>Aggiornato Gin dalla versione 1.9.0 alla 1.9.1 per risolvere un bug nella funzione <code translate="no">Context.FileAttachment</code>.</li>
<li>Aggiunto il controllo degli accessi basato sui ruoli (RBAC) per le API FlushAll e Database.</li>
<li>Corretto un arresto casuale causato dall'SDK AWS S3.</li>
<li>Migliorata la velocità di caricamento e indicizzazione.</li>
</ul>
<p>Per maggiori dettagli, consultare le <a href="https://milvus.io/docs/release_notes.md#2210">note di rilascio di Milvus 2.2.10</a>.</p>
<h2 id="Milvus-2211" class="common-anchor-header">Milvus 2.2.11<button data-href="#Milvus-2211" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.2.11 ha risolto diversi problemi per migliorare la stabilità del sistema. Ha inoltre migliorato le prestazioni in termini di monitoraggio, registrazione, limitazione della velocità e intercettazione delle richieste cross-cluster. Di seguito sono riportati i punti salienti di questo aggiornamento.</p>
<ul>
<li>Aggiunto un intercettore al server Milvus GRPC per prevenire eventuali problemi di routing cross-cluster.</li>
<li>Aggiunti codici di errore al gestore dei chunk di Milvus per facilitare la diagnosi e la correzione degli errori.</li>
<li>Utilizzato un pool di coroutine singleton per evitare lo spreco di coroutine e massimizzare l'uso delle risorse.</li>
<li>Ridotto l'uso del disco per RocksMq a un decimo del suo livello originale abilitando la compressione zstd.</li>
<li>Corretto il panico occasionale di QueryNode durante il caricamento.</li>
<li>È stato corretto il problema del throttling delle richieste di lettura, causato da un calcolo errato della lunghezza della coda per due volte.</li>
<li>Corretti i problemi con GetObject che restituisce valori nulli su MacOS.</li>
<li>Corretto un arresto anomalo causato dall'uso non corretto del modificatore noexcept.</li>
</ul>
<p>Per maggiori dettagli, consultare le <a href="https://milvus.io/docs/release_notes.md#2211">note di rilascio di Milvus 2.2.11</a>.</p>
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
