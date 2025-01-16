---
id: dynamic-data-update-and-query-milvus.md
title: Preparazione
author: milvus
date: 2020-04-13T21:02:08.632Z
desc: La ricerca dei vettori è ora più intuitiva e comoda
cover: assets.zilliz.com/header_62d7b8c823.png
tag: Engineering
canonicalUrl: 'https://zilliz.com/blog/dynamic-data-update-and-query-milvus'
---
<custom-h1>Come Milvus implementa l'aggiornamento e l'interrogazione dinamica dei dati</custom-h1><p>In questo articolo descriveremo principalmente come i dati vettoriali vengono registrati nella memoria di Milvus e come vengono mantenuti.</p>
<p>Di seguito sono riportati i nostri principali obiettivi di progettazione:</p>
<ol>
<li>L'efficienza dell'importazione dei dati deve essere elevata.</li>
<li>I dati possono essere visualizzati il prima possibile dopo l'importazione.</li>
<li>Evitare la frammentazione dei file di dati.</li>
</ol>
<p>Per questo motivo, abbiamo creato un buffer di memoria (insert buffer) per inserire i dati, in modo da ridurre il numero di context switch di IO casuali sul disco e sul sistema operativo e migliorare le prestazioni dell'inserimento dei dati. L'architettura di memoria basata su MemTable e MemTableFile ci permette di gestire e serializzare i dati in modo più pratico. Lo stato del buffer è suddiviso in Mutabile e Immutabile, il che consente di persistere i dati su disco mantenendo i servizi esterni disponibili.</p>
<h2 id="Preparation" class="common-anchor-header">Preparazione<button data-href="#Preparation" class="anchor-icon" translate="no">
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
    </button></h2><p>Quando l'utente è pronto a inserire un vettore in Milvus, deve prima creare una Collection (* Milvus rinomina Table in Collection nella versione 0.7.0). La collezione è l'unità di base per la registrazione e la ricerca di vettori in Milvus.</p>
<p>Ogni collezione ha un nome unico e alcune proprietà che possono essere impostate; i vettori vengono inseriti o ricercati in base al nome della collezione. Quando si crea una nuova collezione, Milvus ne registra le informazioni nei metadati.</p>
<h2 id="Data-Insertion" class="common-anchor-header">Inserimento dei dati<button data-href="#Data-Insertion" class="anchor-icon" translate="no">
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
    </button></h2><p>Quando l'utente invia una richiesta di inserimento di dati, questi vengono serializzati e deserializzati per raggiungere il server Milvus. I dati vengono ora scritti in memoria. La scrittura in memoria è suddivisa grossomodo nelle seguenti fasi:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_data_insertion_milvus_99448bae50.png" alt="2-data-insertion-milvus.png" class="doc-image" id="2-data-insertion-milvus.png" />
   </span> <span class="img-wrapper"> <span>2-inserimento-dati-milvus.png</span> </span></p>
<ol>
<li>In MemManager, trovare o creare una nuova MemTable corrispondente al nome della collezione. Ogni MemTable corrisponde a un buffer della Collezione in memoria.</li>
<li>Una MemTable conterrà uno o più MemTableFile. Ogni volta che creiamo un nuovo MemTableFile, registriamo contemporaneamente questa informazione nella Meta. Dividiamo i MemTableFile in due stati: Mutabile e Immutabile. Quando la dimensione di MemTableFile raggiunge la soglia, diventa Immutabile. Ogni MemTable può avere un solo MemTableFile mutabile da scrivere in qualsiasi momento.</li>
<li>I dati di ciascun MemTableFile saranno infine registrati in memoria nel formato del tipo di indice impostato. Il MemTableFile è l'unità di base per la gestione dei dati in memoria.</li>
<li>In qualsiasi momento, l'utilizzo della memoria per i dati inseriti non supererà il valore preimpostato (insert_buffer_size). Questo perché a ogni richiesta di inserimento di dati, MemManager può facilmente calcolare la memoria occupata dai MemTableFile contenuti in ogni MemTable, e quindi coordinare la richiesta di inserimento in base alla memoria corrente.</li>
</ol>
<p>Grazie all'architettura multilivello di MemManager, MemTable e MemTableFile, l'inserimento dei dati può essere gestito e mantenuto meglio. Naturalmente, possono fare molto di più.</p>
<h2 id="Near-Real-time-Query" class="common-anchor-header">Interrogazione quasi in tempo reale<button data-href="#Near-Real-time-Query" class="anchor-icon" translate="no">
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
    </button></h2><p>In Milvus è sufficiente attendere un secondo al massimo perché i dati inseriti si spostino dalla memoria al disco. L'intero processo può essere approssimativamente riassunto dalla seguente immagine:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_near_real_time_query_milvus_f3cfdd00fb.png" alt="2-near-real-time-query-milvus.png" class="doc-image" id="2-near-real-time-query-milvus.png" />
   </span> <span class="img-wrapper"> <span>2-query in tempo quasi reale-milvus.png</span> </span></p>
<p>Innanzitutto, i dati inseriti entrano in un buffer di inserimento in memoria. Il buffer passa periodicamente dallo stato iniziale Mutable allo stato Immutable, in preparazione alla serializzazione. Quindi, questi buffer immutabili saranno serializzati su disco periodicamente dal thread di serializzazione in background. Dopo che i dati sono stati inseriti, le informazioni sull'ordine saranno registrate nei metadati. A questo punto, i dati possono essere ricercati!</p>
<p>Ora descriveremo in dettaglio i passaggi della figura.</p>
<p>Conosciamo già il processo di inserimento dei dati nel buffer mutabile. Il passo successivo consiste nel passare dal buffer mutabile al buffer immutabile:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_mutable_buffer_immutable_buffer_milvus_282b66c5fe.png" alt="3-mutable-buffer-immutable-buffer-milvus.png" class="doc-image" id="3-mutable-buffer-immutable-buffer-milvus.png" />
   </span> <span class="img-wrapper"> <span>3-mutable-buffer-immutable-buffer-milvus.png</span> </span></p>
<p>La coda immutabile fornirà al thread di serializzazione in background lo stato immutabile e il MemTableFile pronto per essere serializzato. Ogni MemTable gestisce la propria coda immutabile e quando la dimensione dell'unico MemTableFile mutabile della MemTable raggiunge la soglia, entra nella coda immutabile. Un thread in background responsabile di ToImmutable estrae periodicamente tutti i MemTableFile nella coda immutabile gestita da MemTable e li invia alla coda immutabile totale. Va notato che le due operazioni di scrittura dei dati in memoria e di modifica dei dati in memoria in uno stato che non può essere scritto non possono avvenire contemporaneamente, ed è necessario un blocco comune. Tuttavia, l'operazione di ToImmutable è molto semplice e non causa quasi alcun ritardo, quindi l'impatto sulle prestazioni dei dati inseriti è minimo.</p>
<p>Il passo successivo consiste nel serializzare su disco il file MemTableFile nella coda di serializzazione. Questa operazione è suddivisa principalmente in tre fasi:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/4_serialize_memtablefile_milvus_95766abdfb.png" alt="4-serialize-memtablefile-milvus.png" class="doc-image" id="4-serialize-memtablefile-milvus.png" />
   </span> <span class="img-wrapper"> <span>4-serializzare-memtablefile-milvus.png</span> </span></p>
<p>Innanzitutto, il thread di serializzazione in background estrae periodicamente i MemTableFile dalla coda immutabile. Quindi, vengono serializzati in file grezzi di dimensioni fisse (Raw TableFiles). Infine, registriamo queste informazioni nei metadati. Quando effettuiamo una ricerca vettoriale, interroghiamo il TableFile corrispondente nei metadati. Da qui, questi dati possono essere ricercati!</p>
<p>Inoltre, in base all'index_file_size impostato, dopo che il thread di serializzazione ha completato un ciclo di serializzazione, unirà alcuni TableFile a dimensione fissa in un TableFile e registrerà anche queste informazioni nei metadati. A questo punto, il TableFile può essere indicizzato. Anche la costruzione dell'indice è asincrona. Un altro thread in background responsabile della costruzione dell'indice leggerà periodicamente il TableFile nello stato ToIndex dei metadati per eseguire la costruzione dell'indice corrispondente.</p>
<h2 id="Vector-search" class="common-anchor-header">Ricerca vettoriale<button data-href="#Vector-search" class="anchor-icon" translate="no">
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
    </button></h2><p>In realtà, con l'aiuto di TableFile e metadati, la ricerca vettoriale diventa più intuitiva e conveniente. In generale, è necessario ottenere dai metadati i TableFile corrispondenti alla Collection interrogata, cercare in ogni TableFile e infine unire. In questo articolo non ci addentriamo nell'implementazione specifica della ricerca.</p>
<p>Se volete saperne di più, leggete il nostro codice sorgente o gli altri articoli tecnici su Milvus!</p>
