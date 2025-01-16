---
id: >-
  milvus-introduced-mmap-for-redefined-data-management-increased-storage-capability.md
title: >-
  Milvus ha presentato MMap per una gestione dei dati ridefinita e una maggiore
  capacità di archiviazione
author: Yang Cen
date: 2023-11-15T00:00:00.000Z
desc: >-
  La funzione Milvus MMap consente agli utenti di gestire più dati in una
  memoria limitata, raggiungendo un delicato equilibrio tra prestazioni, costi e
  limiti del sistema.
cover: assets.zilliz.com/Exploring_M_Map_5086d652bd.png
tag: Engineering
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Vector Management, MMap, Data Management, Vector Embeddings
recommend: true
canonicalUrl: >-
  https://zilliz.com/blog/milvus-introduced-mmap-for-redefined-data-management-increased-storage-capability
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Exploring_M_Map_5086d652bd.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><a href="https://zilliz.com/what-is-milvus">Milvus</a> è la soluzione più veloce tra i <a href="https://zilliz.com/blog/what-is-a-real-vector-database">database vettoriali</a> open-source e si rivolge agli utenti con esigenze di prestazioni elevate. Tuttavia, la diversità delle esigenze degli utenti rispecchia i dati con cui lavorano. Alcuni danno la priorità a soluzioni economiche e a un ampio spazio di archiviazione rispetto alla pura velocità. Comprendendo questo spettro di richieste, Milvus ha introdotto la funzione MMap, che ridefinisce il modo in cui gestiamo grandi volumi di dati, promettendo efficienza in termini di costi senza sacrificare la funzionalità.</p>
<h2 id="What-is-MMap" class="common-anchor-header">Che cos'è MMap?<button data-href="#What-is-MMap" class="anchor-icon" translate="no">
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
    </button></h2><p>MMap, abbreviazione di memory-mapped file, colma il divario tra file e memoria nei sistemi operativi. Questa tecnologia consente a Milvus di mappare file di grandi dimensioni direttamente nello spazio di memoria del sistema, trasformando i file in blocchi di memoria contigui. Questa integrazione elimina la necessità di operazioni esplicite di lettura o scrittura, cambiando radicalmente il modo in cui Milvus gestisce i dati. Garantisce un accesso continuo e un'archiviazione efficiente per i file di grandi dimensioni o per le situazioni in cui gli utenti devono accedere ai file in modo casuale.</p>
<h2 id="Who-benefits-from-MMap" class="common-anchor-header">Chi beneficia di MMap?<button data-href="#Who-benefits-from-MMap" class="anchor-icon" translate="no">
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
    </button></h2><p>I database vettoriali richiedono una notevole capacità di memoria a causa dei requisiti di archiviazione dei dati vettoriali. Con la funzione MMap, l'elaborazione di più dati in una memoria limitata diventa una realtà. Tuttavia, questa maggiore capacità ha un costo in termini di prestazioni. Il sistema gestisce in modo intelligente la memoria, eliminando alcuni dati in base al carico e all'utilizzo. Questo svuotamento permette a Milvus di elaborare più dati con la stessa capacità di memoria.</p>
<p>Durante i nostri test, abbiamo osservato che con una memoria ampia, tutti i dati risiedono in memoria dopo un periodo di riscaldamento, preservando le prestazioni del sistema. Tuttavia, con l'aumento del volume dei dati, le prestazioni diminuiscono gradualmente. <strong>Pertanto, consigliamo la funzione MMap agli utenti meno sensibili alle fluttuazioni delle prestazioni.</strong></p>
<h2 id="Enabling-MMap-in-Milvus-a-simple-configuration" class="common-anchor-header">Abilitazione di MMap in Milvus: una semplice configurazione<button data-href="#Enabling-MMap-in-Milvus-a-simple-configuration" class="anchor-icon" translate="no">
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
    </button></h2><p>L'abilitazione di MMap in Milvus è molto semplice. È sufficiente modificare il file <code translate="no">milvus.yaml</code>: aggiungere la voce <code translate="no">mmapDirPath</code> alla configurazione <code translate="no">queryNode</code> e impostare come valore un percorso valido.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/enabling_mmap_a2df88276b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Striking-the-balance-performance-storage-and-system-limits" class="common-anchor-header">Trovare l'equilibrio: prestazioni, memoria e limiti del sistema<button data-href="#Striking-the-balance-performance-storage-and-system-limits" class="anchor-icon" translate="no">
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
    </button></h2><p>I modelli di accesso ai dati hanno un impatto significativo sulle prestazioni. La funzione MMap di Milvus ottimizza l'accesso ai dati in base alla localizzazione. MMap consente a Milvus di scrivere dati scalari direttamente sul disco per i segmenti di dati ad accesso sequenziale. I dati di lunghezza variabile, come le stringhe, vengono appiattiti e indicizzati utilizzando un array di offset in memoria. Questo approccio garantisce la localizzazione dell'accesso ai dati ed elimina l'overhead della memorizzazione separata di ogni dato a lunghezza variabile. Le ottimizzazioni per gli indici vettoriali sono meticolose. MMap viene impiegato in modo selettivo per i dati vettoriali, mantenendo in memoria gli elenchi di adiacenza e conservando una quantità significativa di memoria senza compromettere le prestazioni.</p>
<p>Inoltre, MMap massimizza l'elaborazione dei dati riducendo al minimo l'utilizzo della memoria. A differenza delle precedenti versioni di Milvus, in cui QueryNode copiava interi insiemi di dati, MMap adotta un processo di streaming semplificato e privo di copie durante lo sviluppo. Questa ottimizzazione riduce drasticamente l'overhead di memoria.</p>
<p><strong>I risultati dei nostri test interni dimostrano che Milvus è in grado di gestire in modo efficiente un volume di dati doppio quando si attiva MMap.</strong></p>
<h2 id="The-road-ahead-continuous-innovation-and-user-centric-enhancements" class="common-anchor-header">La strada da percorrere: innovazione continua e miglioramenti incentrati sull'utente<button data-href="#The-road-ahead-continuous-innovation-and-user-centric-enhancements" class="anchor-icon" translate="no">
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
    </button></h2><p>Mentre la funzione MMap è in fase beta, il team di Milvus è impegnato in un continuo miglioramento. I futuri aggiornamenti perfezioneranno l'utilizzo della memoria del sistema, consentendo a Milvus di supportare volumi di dati ancora più ampi su un singolo nodo. Gli utenti possono prevedere un controllo più granulare sulla funzione MMap, consentendo modifiche dinamiche alle collezioni e modalità avanzate di caricamento dei campi. Questi miglioramenti offrono una flessibilità senza precedenti, consentendo agli utenti di adattare le proprie strategie di elaborazione dei dati a requisiti specifici.</p>
<h2 id="Conclusion-redefining-data-processing-excellence-with-Milvus-MMap" class="common-anchor-header">Conclusione: ridefinire l'eccellenza nell'elaborazione dei dati con Milvus MMap<button data-href="#Conclusion-redefining-data-processing-excellence-with-Milvus-MMap" class="anchor-icon" translate="no">
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
    </button></h2><p>La funzione MMap di Milvus 2.3 segna un salto significativo nella tecnologia di elaborazione dei dati. Trovando un delicato equilibrio tra prestazioni, costi e limiti di sistema, Milvus consente agli utenti di gestire grandi quantità di dati in modo efficiente ed economico. Milvus continua a evolversi e rimane all'avanguardia delle soluzioni innovative, ridefinendo i confini di ciò che è possibile ottenere nella gestione dei dati.</p>
<p>Rimanete sintonizzati per ulteriori sviluppi rivoluzionari, mentre Milvus continua il suo viaggio verso l'eccellenza nell'elaborazione dei dati.</p>
