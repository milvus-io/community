---
id: >-
  milvus-2-2-12-easier-access-faster-vector-search-speeds-better-user-experience.md
title: >-
  Milvus 2.2.12: accesso più semplice, velocità di ricerca dei vettori e
  migliore esperienza dell'utente
author: 'Owen Jiao, Fendy Feng'
date: 2023-07-28T00:00:00.000Z
cover: assets.zilliz.com/What_s_New_in_2_2_12_20230720_143424_7d19280738.png
tag: News
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Vector Management, Vector Search
recommend: true
canonicalUrl: >-
  https://milvus.io/blog/milvus-2-2-12-easier-access-faster-vector-search-speeds-better-user-experience.md
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/What_s_New_in_2_2_12_20230720_143424_7d19280738.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Siamo entusiasti di annunciare l'ultimo rilascio di Milvus 2.2.12. Questo aggiornamento include numerose nuove funzionalità, come il supporto per l'API RESTful, la funzione <code translate="no">json_contains</code> e il recupero di vettori durante le ricerche di RNA, in risposta al feedback degli utenti. Abbiamo anche semplificato l'esperienza dell'utente, migliorato la velocità di ricerca dei vettori e risolto molti problemi. Scopriamo cosa possiamo aspettarci da Milvus 2.2.12.</p>
<h2 id="Support-for-RESTful-API" class="common-anchor-header">Supporto per API RESTful<button data-href="#Support-for-RESTful-API" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.2.12 supporta ora l'API RESTful, che consente agli utenti di accedere a Milvus senza installare un client, rendendo le operazioni client-server semplici. Inoltre, la distribuzione di Milvus è diventata più comoda perché l'SDK Milvus e l'API RESTful condividono lo stesso numero di porta.</p>
<p><strong>Nota</strong>: si consiglia ancora di utilizzare l'SDK per distribuire Milvus per operazioni avanzate o se l'azienda è sensibile alla latenza.</p>
<h2 id="Vector-retrieval-during-ANN-searches" class="common-anchor-header">Recupero dei vettori durante le ricerche ANN<button data-href="#Vector-retrieval-during-ANN-searches" class="anchor-icon" translate="no">
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
    </button></h2><p>Nelle versioni precedenti, Milvus non consentiva il recupero dei vettori durante le ricerche ANN (approximate nearest neighbor) per dare priorità alle prestazioni e all'utilizzo della memoria. Di conseguenza, il recupero dei vettori grezzi doveva essere suddiviso in due fasi: l'esecuzione della ricerca ANN e la successiva interrogazione dei vettori grezzi in base ai loro ID. Questo approccio aumentava i costi di sviluppo e rendeva più difficile la distribuzione e l'adozione di Milvus da parte degli utenti.</p>
<p>Con Milvus 2.2.12, gli utenti possono recuperare i vettori grezzi durante le ricerche ANN impostando il campo vettoriale come campo di output e interrogando le collezioni indicizzate HNSW, DiskANN o IVF-FLAT. Inoltre, gli utenti possono aspettarsi una velocità di recupero dei vettori molto più elevata.</p>
<h2 id="Support-for-operations-on-JSON-arrays" class="common-anchor-header">Supporto per operazioni su array JSON<button data-href="#Support-for-operations-on-JSON-arrays" class="anchor-icon" translate="no">
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
    </button></h2><p>In Milvus 2.2.8 abbiamo recentemente aggiunto il supporto per JSON. Da allora, gli utenti hanno inviato numerose richieste per supportare ulteriori operazioni su array JSON, come inclusione, esclusione, intersezione, unione, differenza e altro ancora. In Milvus 2.2.12, abbiamo dato priorità al supporto della funzione <code translate="no">json_contains</code> per abilitare l'operazione di inclusione. Continueremo ad aggiungere il supporto per altri operatori nelle versioni future.</p>
<h2 id="Enhancements-and-bug-fixes" class="common-anchor-header">Miglioramenti e correzioni di bug<button data-href="#Enhancements-and-bug-fixes" class="anchor-icon" translate="no">
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
    </button></h2><p>Oltre all'introduzione di nuove funzioni, Milvus 2.2.12 ha migliorato le prestazioni della ricerca vettoriale con un overhead ridotto, rendendo più facile la gestione di ricerche topk estese. Inoltre, migliora le prestazioni di scrittura in situazioni di partizione abilitata e multipartizione e ottimizza l'uso della CPU per le macchine di grandi dimensioni. Questo aggiornamento risolve diversi problemi: uso eccessivo del disco, compattazione bloccata, cancellazioni infrequenti di dati e fallimenti di inserimento in blocco. Per ulteriori informazioni, consultare le <a href="https://milvus.io/docs/release_notes.md#2212">Note di rilascio</a> di <a href="https://milvus.io/docs/release_notes.md#2212">Milvus 2.2.12</a>.</p>
<h2 id="Lets-keep-in-touch" class="common-anchor-header">Teniamoci in contatto!<button data-href="#Lets-keep-in-touch" class="anchor-icon" translate="no">
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
