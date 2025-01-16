---
id: Milvus-2-2-8-better-query-performance-20-higher-throughputs.md
title: 'Milvus 2.2.8: migliori prestazioni delle query, 20% in più di throughput'
author: Fendy Feng
date: 2023-05-12T00:00:00.000Z
cover: assets.zilliz.com/What_s_New_in_2_2_8_f4dd6de0f2.png
tag: News
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Vector Management
recommend: true
canonicalUrl: >-
  https://milvus.io/blog/Milvus-2-2-8-better-query-performance-20-higher-throughputs.md
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/What_s_New_in_2_2_8_f4dd6de0f2.png" alt="Milvus 2.2.8" class="doc-image" id="milvus-2.2.8" />
   </span> <span class="img-wrapper"> <span>Milvus 2.2.8</span> </span></p>
<p>Siamo lieti di annunciare l'ultima versione di Milvus 2.2.8. Questa release include numerosi miglioramenti e correzioni di bug rispetto alle versioni precedenti, che si traducono in migliori prestazioni di interrogazione, risparmio di risorse e maggiore produttività. Vediamo insieme le novità di questa versione.</p>
<h2 id="Reduced-peak-memory-consumption-during-collection-loading" class="common-anchor-header">Riduzione del consumo di memoria di picco durante il caricamento delle collezioni<button data-href="#Reduced-peak-memory-consumption-during-collection-loading" class="anchor-icon" translate="no">
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
    </button></h2><p>Per eseguire le query, Milvus deve caricare i dati e gli indici in memoria. Tuttavia, durante il processo di caricamento, le copie multiple della memoria possono far aumentare il picco di utilizzo della memoria fino a tre o quattro volte rispetto al tempo di esecuzione effettivo. L'ultima versione di Milvus 2.2.8 risolve efficacemente questo problema e ottimizza l'uso della memoria.</p>
<h2 id="Expanded-querying-scenarios-with-QueryNode-supporting-plugins" class="common-anchor-header">Scenari di interrogazione ampliati con il supporto dei plugin di QueryNode<button data-href="#Expanded-querying-scenarios-with-QueryNode-supporting-plugins" class="anchor-icon" translate="no">
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
    </button></h2><p>QueryNode supporta ora i plugin nell'ultima versione di Milvus 2.2.8. È possibile specificare facilmente il percorso del file del plugin con la configurazione <code translate="no">queryNode.soPath</code>. Quindi, Milvus può caricare il plugin in fase di esecuzione ed espandere gli scenari di interrogazione disponibili. Se avete bisogno di una guida per lo sviluppo di <a href="https://pkg.go.dev/plugin">plugin, consultate la documentazione</a> sui <a href="https://pkg.go.dev/plugin">plugin Go</a>.</p>
<h2 id="Optimized-querying-performance-with-enhanced-compaction-algorithm" class="common-anchor-header">Prestazioni di interrogazione ottimizzate con un algoritmo di compattazione migliorato<button data-href="#Optimized-querying-performance-with-enhanced-compaction-algorithm" class="anchor-icon" translate="no">
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
    </button></h2><p>L'algoritmo di compattazione determina la velocità di convergenza dei segmenti, influenzando direttamente le prestazioni delle query. Grazie ai recenti miglioramenti apportati all'algoritmo di compattazione, l'efficienza di convergenza è migliorata notevolmente, con conseguenti query più veloci.</p>
<h2 id="Better-resource-saving-and-querying-performance-with-reduced-collection-shards" class="common-anchor-header">Migliori prestazioni di risparmio delle risorse e di interrogazione con shard di raccolta ridotti<button data-href="#Better-resource-saving-and-querying-performance-with-reduced-collection-shards" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus è un sistema di elaborazione massicciamente parallelo (MPP), il che significa che il numero di frammenti della collezione influisce sull'efficienza di Milvus nella scrittura e nell'interrogazione. Nelle versioni precedenti, una collezione aveva due shard per impostazione predefinita, il che comportava eccellenti prestazioni di scrittura ma comprometteva le prestazioni di interrogazione e il costo delle risorse. Con il nuovo aggiornamento di Milvus 2.2.8, gli shard predefiniti delle collezioni sono stati ridotti a uno, consentendo agli utenti di risparmiare più risorse e di eseguire query migliori. La maggior parte degli utenti della comunità ha meno di 10 milioni di volumi di dati e uno shard è sufficiente per ottenere buone prestazioni di scrittura.</p>
<p><strong>Nota</strong>: questo aggiornamento non riguarda le raccolte create prima di questa release.</p>
<h2 id="20-throughput-increase-with-an-improved-query-grouping-algorithm" class="common-anchor-header">Aumento del 20% del throughput con un algoritmo di raggruppamento delle query migliorato<button data-href="#20-throughput-increase-with-an-improved-query-grouping-algorithm" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus dispone di un efficiente algoritmo di raggruppamento delle query che combina più richieste di query nella coda in una sola per un'esecuzione più rapida, migliorando significativamente il throughput. Nell'ultima versione, abbiamo apportato ulteriori miglioramenti a questo algoritmo, aumentando il throughput di Milvus di almeno il 20%.</p>
<p>Oltre ai miglioramenti citati, Milvus 2.2.8 risolve anche diversi bug. Per maggiori dettagli, consultare le <a href="https://milvus.io/docs/release_notes.md">note di rilascio di Milvus</a>.</p>
<h2 id="Let’s-keep-in-touch" class="common-anchor-header">Restiamo in contatto!<button data-href="#Let’s-keep-in-touch" class="anchor-icon" translate="no">
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
    </button></h2><p>Se avete domande o feedback su Milvus, non esitate a contattarci tramite <a href="https://twitter.com/milvusio">Twitter</a> o <a href="https://www.linkedin.com/company/the-milvus-project">LinkedIn</a>. Siete anche invitati a unirvi al nostro <a href="https://milvus.io/slack/">canale Slack</a> per chiacchierare direttamente con i nostri ingegneri e con l'intera comunità o a visitare i nostri <a href="https://us02web.zoom.us/meeting/register/tZ0pcO6vrzsuEtVAuGTpNdb6lGnsPBzGfQ1T#/registration">orari di ufficio del martedì</a>!</p>
