---
id: 2022-02-28-how-milvus-balances-query-load-across-nodes.md
title: Come Milvus bilancia il carico delle query tra i nodi?
author: Xi Ge
date: 2022-02-28T00:00:00.000Z
desc: >-
  Milvus 2.0 supporta il bilanciamento automatico del carico tra i nodi di
  interrogazione.
cover: assets.zilliz.com/Load_balance_b2f35a5577.png
tag: Engineering
tags: 'Data science, Database, Technology, Artificial Intelligence, Vector Management'
canonicalUrl: >-
  https://milvus.io/blog/2022-02-28-how-milvus-balances-query-load-across-nodes.md
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Load_balance_b2f35a5577.png" alt="Binlog Cover Image" class="doc-image" id="binlog-cover-image" />
   </span> <span class="img-wrapper"> <span>Immagine di copertina di Binlog</span> </span></p>
<p>Di <a href="https://github.com/xige-16">Xi Ge</a>.</p>
<p>Nei precedenti articoli del blog abbiamo introdotto le funzioni di cancellazione, bitet e compattazione di Milvus 2.0. Per concludere questa serie, vorremmo condividere il progetto del bilanciamento del carico, una funzione vitale nel cluster distribuito di Milvus.</p>
<h2 id="Implementation" class="common-anchor-header">L'implementazione<button data-href="#Implementation" class="anchor-icon" translate="no">
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
    </button></h2><p>Mentre il numero e la dimensione dei segmenti bufferizzati nei nodi di interrogazione differiscono, anche le prestazioni di ricerca tra i nodi di interrogazione possono variare. Il caso peggiore è quello in cui alcuni nodi di interrogazione esauriscono la ricerca su una grande quantità di dati, ma i nodi di interrogazione appena creati rimangono inattivi perché non viene distribuito loro alcun segmento, causando un enorme spreco di risorse della CPU e un'enorme diminuzione delle prestazioni di ricerca.</p>
<p>Per evitare tali circostanze, il coordinatore delle query (query coord) è programmato per distribuire i segmenti in modo uniforme a ogni nodo di query, in base all'utilizzo della RAM dei nodi. In questo modo, le risorse della CPU vengono consumate equamente da tutti i nodi, migliorando in modo significativo le prestazioni di ricerca.</p>
<h3 id="Trigger-automatic-load-balance" class="common-anchor-header">Attivare il bilanciamento automatico del carico</h3><p>In base al valore predefinito della configurazione <code translate="no">queryCoord.balanceIntervalSeconds</code>, il query coord controlla l'utilizzo della RAM (in percentuale) di tutti i nodi di query ogni 60 secondi. Se una delle seguenti condizioni è soddisfatta, il query coord inizia a bilanciare il carico delle query sui nodi di query:</p>
<ol>
<li>L'utilizzo della RAM di qualsiasi nodo di query nel cluster è superiore a <code translate="no">queryCoord.overloadedMemoryThresholdPercentage</code> (valore predefinito: 90);</li>
<li>Oppure il valore assoluto della differenza di utilizzo della RAM di due nodi di query è maggiore di <code translate="no">queryCoord.memoryUsageMaxDifferencePercentage</code> (valore predefinito: 30).</li>
</ol>
<p>Dopo che i segmenti sono stati trasferiti dal nodo di query di origine al nodo di query di destinazione, devono soddisfare entrambe le condizioni seguenti:</p>
<ol>
<li>L'utilizzo della RAM del nodo di query di destinazione non è superiore a <code translate="no">queryCoord.overloadedMemoryThresholdPercentage</code> (valore predefinito: 90);</li>
<li>il valore assoluto della differenza di utilizzo della RAM dei nodi di query di origine e di destinazione dopo il bilanciamento del carico è inferiore a quello precedente al bilanciamento del carico.</li>
</ol>
<p>Se le condizioni di cui sopra sono soddisfatte, il query coord procede a bilanciare il carico della query tra i nodi.</p>
<h2 id="Load-balance" class="common-anchor-header">Bilanciamento del carico<button data-href="#Load-balance" class="anchor-icon" translate="no">
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
    </button></h2><p>Quando viene attivato il bilanciamento del carico, il coordinamentodella query carica prima i segmenti di destinazione sul nodo di query di destinazione. A questo punto, entrambi i nodi di interrogazione restituiscono i risultati di ricerca del/i segmento/i di destinazione a qualsiasi richiesta di ricerca, per garantire la completezza del risultato.</p>
<p>Dopo che il nodo di interrogazione di destinazione ha caricato con successo il segmento di destinazione, il nodo di interrogazione pubblica un <code translate="no">sealedSegmentChangeInfo</code> sul Query Channel. Come mostrato di seguito, <code translate="no">onlineNodeID</code> e <code translate="no">onlineSegmentIDs</code> indicano rispettivamente il nodo di query che carica il segmento e il segmento caricato, mentre <code translate="no">offlineNodeID</code> e <code translate="no">offlineSegmentIDs</code> indicano rispettivamente il nodo di query che deve rilasciare il segmento e il segmento da rilasciare.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/20220228_145413_f253cec15b.png" alt="sealedSegmentChangeInfo" class="doc-image" id="sealedsegmentchangeinfo" />
   </span> <span class="img-wrapper"> <span>sealedSegmentChangeInfo</span> </span></p>
<p>Dopo aver ricevuto il messaggio <code translate="no">sealedSegmentChangeInfo</code>, il nodo di query di origine rilascia il segmento di destinazione.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/20220228_145436_2604bc57a5.png" alt="Load Balance Workflow" class="doc-image" id="load-balance-workflow" />
   </span> <span class="img-wrapper"> <span>Flusso di lavoro del bilanciamento del carico</span> </span></p>
<p>L'intero processo ha successo quando il nodo di query di origine rilascia il segmento di destinazione. Al termine di questo processo, il carico della query è bilanciato tra i nodi di query, il che significa che l'utilizzo della RAM di tutti i nodi di query non è superiore a <code translate="no">queryCoord.overloadedMemoryThresholdPercentage</code> e che il valore assoluto della differenza di utilizzo della RAM dei nodi di query di origine e di destinazione dopo il bilanciamento del carico è inferiore a quello precedente al bilanciamento del carico.</p>
<h2 id="Whats-next" class="common-anchor-header">Cosa succederà in seguito?<button data-href="#Whats-next" class="anchor-icon" translate="no">
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
    </button></h2><p>Nella serie di blog sulle nuove funzionalità 2.0, ci proponiamo di spiegare il design delle nuove funzionalità. Leggete di più in questa serie di blog!</p>
<ul>
<li><a href="https://milvus.io/blog/2022-02-07-how-milvus-deletes-streaming-data-in-distributed-cluster.md">Come Milvus elimina i dati in streaming in un cluster distribuito</a></li>
<li><a href="https://milvus.io/blog/2022-2-21-compact.md">Come compattare i dati in Milvus?</a></li>
<li><a href="https://milvus.io/blog/2022-02-28-how-milvus-balances-query-load-across-nodes.md">Come Milvus bilancia il carico delle query tra i nodi?</a></li>
<li><a href="https://milvus.io/blog/2022-2-14-bitset.md">Come Bitset consente la versatilità della ricerca per similarità vettoriale</a></li>
</ul>
<p>Questa è la conclusione della serie di blog sulle nuove funzionalità di Milvus 2.0. Dopo questa serie, abbiamo in programma una nuova serie di Milvus <a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md">Deep Dive</a>, che introdurrà l'architettura di base di Milvus 2.0. Restate sintonizzati.</p>
