---
id: milvus-2025-roadmap-tell-us-what-you-think.md
title: La tabella di marcia di Milvus 2025 - Diteci cosa ne pensate
author: 'Fendy Feng, Field Zhang'
date: 2025-03-27T00:00:00.000Z
desc: >-
  Nel 2025, stiamo lanciando due versioni principali, Milvus 2.6 e Milvus 3.0, e
  molte altre caratteristiche tecniche. Vi invitiamo a condividere con noi i
  vostri pensieri.
cover: assets.zilliz.com/2025_roadmap_04e6c5d1c3.png
tag: Announcements
recommend: true
canonicalUrl: 'https://milvus.io/blog/milvus-2025-roadmap-tell-us-what-you-think.md'
---
<p>Ciao, utenti e collaboratori di Milvus!</p>
<p>Siamo entusiasti di condividere con voi la nostra <a href="https://milvus.io/docs/roadmap.md"><strong>roadmap Milvus 2025</strong></a>. Questo piano tecnico evidenzia le caratteristiche chiave e i miglioramenti che stiamo realizzando per rendere Milvus ancora più potente per le vostre esigenze di ricerca vettoriale.</p>
<p>Ma questo è solo l'inizio: vogliamo le vostre opinioni! Il vostro feedback contribuisce a plasmare Milvus, assicurando che si evolva per rispondere alle sfide del mondo reale. Fateci sapere cosa ne pensate e aiutateci a perfezionare la tabella di marcia.</p>
<h2 id="The-Current-Landscape" class="common-anchor-header">Il panorama attuale<button data-href="#The-Current-Landscape" class="anchor-icon" translate="no">
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
    </button></h2><p>Nel corso dell'ultimo anno, abbiamo visto molti di voi creare applicazioni RAG e agenti di grande impatto con Milvus, sfruttando molte delle nostre caratteristiche più popolari, come l'integrazione dei modelli, la ricerca full-text e la ricerca ibrida. Le vostre implementazioni hanno fornito preziose indicazioni sui requisiti della ricerca vettoriale nel mondo reale.</p>
<p>Con l'evoluzione delle tecnologie AI, i vostri casi d'uso stanno diventando sempre più sofisticati: dalla ricerca vettoriale di base alle complesse applicazioni multimodali che comprendono agenti intelligenti, sistemi autonomi e AI incarnata. Queste sfide tecniche informano la nostra tabella di marcia, mentre continuiamo a sviluppare Milvus per soddisfare le vostre esigenze.</p>
<h2 id="Two-Major-Releases-in-2025-Milvus-26-and-Milvus-30" class="common-anchor-header">Due importanti release nel 2025: Milvus 2.6 e Milvus 3.0<button data-href="#Two-Major-Releases-in-2025-Milvus-26-and-Milvus-30" class="anchor-icon" translate="no">
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
    </button></h2><p>Nel 2025 verranno rilasciate due versioni principali: Milvus 2.6 (metà CY25) e Milvus 3.0 (fine 2025).</p>
<p><strong>Milvus 2.6</strong> si concentra sui miglioramenti dell'architettura di base che ci avete richiesto:</p>
<ul>
<li><p>Distribuzione più semplice con meno dipendenze (addio mal di testa da distribuzione!)</p></li>
<li><p>pipeline di ingestione dei dati più veloci</p></li>
<li><p>Riduzione dei costi di storage (abbiamo ascoltato le vostre preoccupazioni sui costi di produzione)</p></li>
<li><p>Migliore gestione delle operazioni sui dati su larga scala (cancellazione/modifica)</p></li>
<li><p>Ricerca scalare e full-text più efficiente</p></li>
<li><p>Supporto per i più recenti modelli di embedding con cui si sta lavorando</p></li>
</ul>
<p><strong>Milvus 3.0</strong> è la nostra più grande evoluzione architettonica, che introduce un sistema di data lake vettoriale per:</p>
<ul>
<li><p>Integrazione perfetta dei servizi AI</p></li>
<li><p>Capacità di ricerca di livello superiore</p></li>
<li><p>Gestione dei dati più robusta</p></li>
<li><p>Una migliore gestione degli enormi set di dati offline con cui si lavora.</p></li>
</ul>
<h2 id="Technical-Features-Were-Planning---We-Need-Your-Feedback" class="common-anchor-header">Caratteristiche tecniche che stiamo pianificando - Abbiamo bisogno del vostro feedback<button data-href="#Technical-Features-Were-Planning---We-Need-Your-Feedback" class="anchor-icon" translate="no">
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
    </button></h2><p>Di seguito sono riportate le principali caratteristiche tecniche che stiamo pianificando di aggiungere a Milvus.</p>
<table>
<thead>
<tr><th><strong>Area delle caratteristiche chiave</strong></th><th><strong>Caratteristiche tecniche</strong></th></tr>
</thead>
<tbody>
<tr><td><strong>Elaborazione di dati non strutturati guidata dall'intelligenza artificiale</strong></td><td>- Entrata/uscita dei dati: Integrazione nativa con i principali servizi di modelli per l'ingestione di testo grezzo<br>- Gestione dei dati originali: Supporto di riferimento testo/URL per l'elaborazione di dati grezzi<br>- Supporto per i tensori: Implementazione dell'elenco vettoriale (per scenari ColBERT/CoPali/Video)<br>- Tipi di dati estesi: DateTime, Map, supporto GIS in base ai requisiti<br>- Ricerca iterativa: Affinamento del vettore di query attraverso il feedback dell'utente</td></tr>
<tr><td><strong>Miglioramenti alla qualità e alle prestazioni della ricerca</strong></td><td>- Matching avanzato: funzionalità phrase_match e multi_match<br>- Aggiornamento dell'analizzatore: miglioramento dell'analizzatore con supporto esteso al tokenizer e migliore osservabilità<br>- Ottimizzazione JSON: Filtraggio più veloce grazie a un'indicizzazione migliorata<br>- Ordinamento dell'esecuzione: Ordinamento dei risultati basato su campi scalari<br>- Reranker avanzato: Reranking basato su modelli e funzioni di punteggio personalizzate<br>- Ricerca iterativa: Affinamento del vettore di query attraverso il feedback dell'utente</td></tr>
<tr><td><strong>Flessibilità nella gestione dei dati</strong></td><td>- Modifica dello schema: Aggiunta/eliminazione di campi, modifica della lunghezza delle varchar<br>- Aggregazioni scalari: operazioni di conteggio/distinzione/min/max<br>- Supporto UDF: Supporto di funzioni definite dall'utente<br>- Versioning dei dati: Sistema di rollback basato su snapshot<br>- Clustering dei dati: Co-locazione tramite configurazione<br>- Campionamento dei dati: Ottenere rapidamente risultati basati su dati di campionamento</td></tr>
<tr><td><strong>Miglioramenti architettonici</strong></td><td>- Nodo di flusso: Ingestione incrementale dei dati semplificata<br>- MixCoord: Architettura del coordinatore unificata<br>- Indipendenza del Logstore: Riduzione delle dipendenze esterne come pulsar<br>- Deduplicazione PK: Deduplicazione globale delle chiavi primarie</td></tr>
<tr><td><strong>Efficienza dei costi e miglioramenti dell'architettura</strong></td><td>- Archiviazione a livelli: Separazione dei dati caldi e freddi per ridurre i costi di archiviazione<br>- Criteri di eliminazione dei dati: Gli utenti possono definire i propri criteri di eliminazione dei dati<br>- Aggiornamenti massicci: Supporto di modifiche dei valori specifici del campo, ETL, ecc.<br>- TopK di grandi dimensioni: restituisce insiemi di dati enormi<br>- VTS GA: Connettersi a diverse fonti di dati<br>- Quantizzazione avanzata: Ottimizza il consumo di memoria e le prestazioni in base alle tecniche di quantizzazione.<br>- Elasticità delle risorse: Scalare dinamicamente le risorse per adattarle a carichi di scrittura, lettura e attività in background variabili.</td></tr>
</tbody>
</table>
<p>Durante l'implementazione di questa roadmap, apprezzeremmo i vostri pensieri e feedback su quanto segue:</p>
<ol>
<li><p><strong>Priorità delle funzionalità:</strong> Quali funzionalità della nostra roadmap avrebbero il maggiore impatto sul vostro lavoro?</p></li>
<li><p><strong>Idee di implementazione:</strong> Qualche approccio specifico che ritenete possa funzionare bene per queste funzionalità?</p></li>
<li><p><strong>Allineamento dei casi d'uso:</strong> In che modo le funzionalità previste si allineano ai vostri casi d'uso attuali e futuri?</p></li>
<li><p><strong>Considerazioni sulle prestazioni:</strong> Ci sono aspetti delle prestazioni su cui dovremmo concentrarci per le vostre esigenze specifiche?</p></li>
</ol>
<p><strong>Le vostre indicazioni ci aiutano a migliorare Milvus per tutti. Sentitevi liberi di condividere i vostri pensieri sul nostro<a href="https://github.com/milvus-io/milvus/discussions/40263"> forum di discussione Milvus</a> o sul nostro <a href="https://discord.com/invite/8uyFbECzPX">canale Discord</a>.</strong></p>
<h2 id="Welcome-to-Contribute-to-Milvus" class="common-anchor-header">Benvenuti a contribuire a Milvus<button data-href="#Welcome-to-Contribute-to-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>In quanto progetto open-source, Milvus accoglie sempre con favore i vostri contributi:</p>
<ul>
<li><p><strong>Condividete il vostro feedback:</strong> Segnalate problemi o suggerite funzionalità attraverso la nostra <a href="https://github.com/milvus-io/milvus/issues">pagina dei problemi su GitHub</a>.</p></li>
<li><p><strong>Contributi al codice:</strong> Invia richieste di pull (vedi la nostra <a href="https://github.com/milvus-io/milvus/blob/82915a9630ab0ff40d7891b97c367ede5726ff7c/CONTRIBUTING.md">Guida ai contributi</a>).</p></li>
<li><p><strong>Diffondete la parola:</strong> condividete le vostre esperienze con Milvus e <a href="https://github.com/milvus-io/milvus">date il via al nostro repository GitHub.</a></p></li>
</ul>
<p>Siamo entusiasti di costruire il prossimo capitolo di Milvus con voi. Il vostro codice, le vostre idee e il vostro feedback fanno progredire il progetto!</p>
<p>- Il team di Milvus</p>
