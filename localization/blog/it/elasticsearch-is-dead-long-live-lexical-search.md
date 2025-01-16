---
id: elasticsearch-is-dead-long-live-lexical-search.md
title: 'Elasticsearch è morto, lunga vita alla ricerca lessicale'
author: James Luan
date: 2024-12-17T00:00:00.000Z
cover: >-
  assets.zilliz.com/Elasticsearch_is_Dead_Long_Live_Lexical_Search_0fa15cd6d7.png
tag: Engineering
tags: Milvus
recommend: false
canonicalUrl: 'https://milvus.io/blog/elasticsearch-is-dead-long-live-lexical-search.md'
---
<p>Ormai tutti sanno che la ricerca ibrida ha migliorato la qualità della ricerca <a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">RAG</a> (Retrieval-Augmented Generation). Sebbene la ricerca <a href="https://zilliz.com/learn/sparse-and-dense-embeddings">con incorporazione densa</a> abbia mostrato capacità impressionanti nel catturare relazioni semantiche profonde tra query e documenti, ha ancora notevoli limiti. Tra questi, la mancanza di spiegabilità e le prestazioni non ottimali con query a coda lunga e termini rari.</p>
<p>Molte applicazioni RAG sono in difficoltà perché i modelli pre-addestrati spesso mancano di conoscenze specifiche del dominio. In alcuni scenari, la semplice corrispondenza delle parole chiave BM25 supera questi modelli sofisticati. È qui che la ricerca ibrida colma il divario, combinando la comprensione semantica del recupero vettoriale denso con la precisione della corrispondenza delle parole chiave.</p>
<h2 id="Why-Hybrid-Search-is-Complex-in-Production" class="common-anchor-header">Perché la ricerca ibrida è complessa in produzione<button data-href="#Why-Hybrid-Search-is-Complex-in-Production" class="anchor-icon" translate="no">
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
    </button></h2><p>Sebbene framework come <a href="https://zilliz.com/learn/LangChain">LangChain</a> o <a href="https://zilliz.com/learn/getting-started-with-llamaindex">LlamaIndex</a> rendano semplice la realizzazione di un proof-of-concept di retriever ibrido, la scalabilità alla produzione con enormi insiemi di dati è impegnativa. Le architetture tradizionali richiedono database vettoriali e motori di ricerca separati, il che comporta diverse sfide fondamentali:</p>
<ul>
<li><p>Elevati costi di manutenzione dell'infrastruttura e complessità operativa</p></li>
<li><p>Ridondanza dei dati su più sistemi</p></li>
<li><p>Difficile gestione della coerenza dei dati</p></li>
<li><p>Sicurezza e controllo degli accessi complessi tra i sistemi</p></li>
</ul>
<p>Il mercato ha bisogno di una soluzione unificata che supporti la ricerca lessicale e semantica, riducendo al contempo la complessità e i costi del sistema.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/elasticsearch_vs_milvus_5be6e2b69e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="The-Pain-Points-of-Elasticsearch" class="common-anchor-header">I punti dolenti di Elasticsearch<button data-href="#The-Pain-Points-of-Elasticsearch" class="anchor-icon" translate="no">
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
    </button></h2><p>Elasticsearch è stato uno dei progetti di ricerca open-source più influenti dell'ultimo decennio. Basato su Apache Lucene, ha guadagnato popolarità grazie alle sue elevate prestazioni, alla scalabilità e all'architettura distribuita. Sebbene abbia aggiunto la ricerca vettoriale RNA nella versione 8.0, le implementazioni di produzione devono affrontare diverse sfide critiche:</p>
<p><strong>Alti costi di aggiornamento e indicizzazione:</strong> L'architettura di Elasticsearch non disaccoppia completamente le operazioni di scrittura, creazione di indici e interrogazione. Ciò comporta un notevole sovraccarico di CPU e I/O durante le operazioni di scrittura, soprattutto negli aggiornamenti in blocco. La contesa di risorse tra indicizzazione e interrogazione influisce sulle prestazioni, creando un importante collo di bottiglia per gli scenari di aggiornamento ad alta frequenza.</p>
<p><strong>Scarse prestazioni in tempo reale:</strong> Essendo un motore di ricerca "quasi in tempo reale", Elasticsearch introduce una notevole latenza nella visibilità dei dati. Questa latenza diventa particolarmente problematica per le applicazioni di intelligenza artificiale, come i sistemi ad agenti, dove le interazioni ad alta frequenza e il processo decisionale dinamico richiedono un accesso immediato ai dati.</p>
<p><strong>Difficile gestione degli shard:</strong> Sebbene Elasticsearch utilizzi lo sharding per l'architettura distribuita, la gestione degli shard pone problemi significativi. La mancanza di un supporto dinamico per lo sharding crea un dilemma: un numero eccessivo di shard in dataset di piccole dimensioni porta a prestazioni scarse, mentre un numero insufficiente di shard in dataset di grandi dimensioni limita la scalabilità e causa una distribuzione non uniforme dei dati.</p>
<p><strong>Architettura non cloud-native:</strong> Sviluppato prima che le architetture cloud-native diventassero prevalenti, il design di Elasticsearch associa strettamente storage e calcolo, limitando la sua integrazione con infrastrutture moderne come cloud pubblici e Kubernetes. La scalabilità delle risorse richiede un aumento simultaneo dello storage e dell'elaborazione, riducendo la flessibilità. In scenari multireplica, ogni shard deve costruire il proprio indice in modo indipendente, aumentando i costi di calcolo e riducendo l'efficienza delle risorse.</p>
<p><strong>Scarse prestazioni della ricerca vettoriale:</strong> Sebbene Elasticsearch 8.0 abbia introdotto la ricerca vettoriale ANN, le sue prestazioni sono significativamente inferiori a quelle di motori vettoriali dedicati come Milvus. Basata sul kernel Lucene, la sua struttura di indici si rivela inefficiente per i dati ad alta dimensionalità, e fatica a soddisfare i requisiti di ricerca vettoriale su larga scala. Le prestazioni diventano particolarmente instabili in scenari complessi che coinvolgono il filtraggio scalare e la multi-tenancy, rendendo difficile il supporto di un carico elevato o di esigenze aziendali diverse.</p>
<p><strong>Consumo eccessivo di risorse:</strong> Elasticsearch richiede un consumo estremo di memoria e CPU, soprattutto quando si elaborano dati su larga scala. La sua dipendenza dalla JVM richiede frequenti aggiustamenti delle dimensioni dell'heap e la regolazione della garbage collection, con un grave impatto sull'efficienza della memoria. Le operazioni di ricerca vettoriale richiedono calcoli intensivi ottimizzati per SIMD, per i quali l'ambiente JVM è tutt'altro che ideale.</p>
<p>Questi limiti fondamentali diventano sempre più problematici man mano che le organizzazioni scalano la loro infrastruttura di IA, rendendo Elasticsearch particolarmente impegnativo per le moderne applicazioni di IA che richiedono prestazioni e affidabilità elevate.</p>
<h2 id="Introducing-Sparse-BM25-Reimagining-Lexical-Search" class="common-anchor-header">Introduzione di Sparse-BM25: ripensare la ricerca lessicale<button data-href="#Introducing-Sparse-BM25-Reimagining-Lexical-Search" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://milvus.io/blog/introduce-milvus-2-5-full-text-search-powerful-metadata-filtering-and-more.md">Milvus 2.5</a> introduce il supporto nativo per la ricerca lessicale attraverso Sparse-BM25, basandosi sulle capacità di ricerca ibrida introdotte nella versione 2.4. Questo approccio innovativo comprende i seguenti componenti chiave:</p>
<ul>
<li><p>tokenizzazione avanzata e pre-elaborazione tramite Tantivy</p></li>
<li><p>Gestione distribuita del vocabolario e della frequenza dei termini</p></li>
<li><p>Generazione di vettori sparsi utilizzando TF del corpus e TF-IDF della query</p></li>
<li><p>Supporto di indici invertiti con algoritmo WAND (Block-Max WAND e supporto di indici a grafo in fase di sviluppo).</p></li>
</ul>
<p>Rispetto a Elasticsearch, Milvus offre notevoli vantaggi in termini di flessibilità degli algoritmi. Il calcolo della somiglianza basato sulla distanza vettoriale consente di effettuare corrispondenze più sofisticate, compresa l'implementazione del TW-BERT (Term Weighting BERT) basato sulla ricerca "End-to-End Query Term Weighting". Questo approccio ha dimostrato prestazioni superiori sia nei test in-domain che out-domain.</p>
<p>Un altro vantaggio fondamentale è l'efficienza dei costi. Sfruttando sia l'indice invertito che la compressione densa dell'embedding, Milvus ottiene un miglioramento delle prestazioni di cinque volte con un degrado del richiamo inferiore all'1%. Grazie alla potatura dei termini di coda e alla quantizzazione dei vettori, l'utilizzo della memoria è stato ridotto di oltre il 50%.</p>
<p>L'ottimizzazione delle query lunghe è un punto di forza particolare. Laddove gli algoritmi WAND tradizionali faticano a gestire le interrogazioni più lunghe, Milvus eccelle combinando le incorporazioni rade con gli indici di grafo, ottenendo un miglioramento delle prestazioni di dieci volte negli scenari di ricerca vettoriale rada ad alta dimensionalità.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/document_in_and_out_b84771bec4.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Milvus-The-Ultimate-Vector-Database-for-RAG" class="common-anchor-header">Milvus: il database vettoriale definitivo per RAG<button data-href="#Milvus-The-Ultimate-Vector-Database-for-RAG" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus è la scelta principale per le applicazioni RAG grazie al suo set completo di funzionalità. I vantaggi principali includono:</p>
<ul>
<li><p>Ricco supporto di metadati con funzionalità di schema dinamico e potenti opzioni di filtraggio.</p></li>
<li><p>Multi-tenancy di livello aziendale con isolamento flessibile attraverso collezioni, partizioni e chiavi di partizione</p></li>
<li><p>Supporto degli indici vettoriali su disco, primo nel settore, con archiviazione multilivello dalla memoria a S3.</p></li>
<li><p>Scalabilità cloud-native che supporta la scalabilità senza soluzione di continuità da 10M a 1B+ di vettori</p></li>
<li><p>Funzionalità di ricerca complete, tra cui raggruppamento, intervallo e ricerca ibrida</p></li>
<li><p>Profonda integrazione dell'ecosistema con LangChain, LlamaIndex, Dify e altri strumenti di intelligenza artificiale.</p></li>
</ul>
<p>Le diverse capacità di ricerca del sistema comprendono metodologie di raggruppamento, intervallo e ricerca ibrida. La profonda integrazione con strumenti come LangChain, LlamaIndex e Dify, oltre al supporto per numerosi prodotti di AI, pone Milvus al centro del moderno ecosistema di infrastrutture di AI.</p>
<h2 id="Looking-Forward" class="common-anchor-header">Uno sguardo al futuro<button data-href="#Looking-Forward" class="anchor-icon" translate="no">
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
    </button></h2><p>Mentre l'IA passa dal POC alla produzione, Milvus continua a evolversi. Ci concentriamo sul rendere la ricerca vettoriale più accessibile e conveniente, migliorando al contempo la qualità della ricerca. Che si tratti di una startup o di un'impresa, Milvus riduce le barriere tecniche allo sviluppo di applicazioni di IA.</p>
<p>Questo impegno per l'accessibilità e l'innovazione ci ha portato a un altro importante passo avanti. Mentre la nostra soluzione open-source continua a servire da base per migliaia di applicazioni in tutto il mondo, riconosciamo che molte organizzazioni hanno bisogno di una soluzione completamente gestita che elimini i costi operativi.</p>
<h2 id="Zilliz-Cloud-The-Managed-Solution" class="common-anchor-header">Zilliz Cloud: La soluzione gestita<button data-href="#Zilliz-Cloud-The-Managed-Solution" class="anchor-icon" translate="no">
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
    </button></h2><p>Negli ultimi tre anni abbiamo costruito <a href="https://zilliz.com/cloud">Zilliz Cloud</a>, un servizio di database vettoriale completamente gestito basato su Milvus. Grazie a una reimplementazione cloud-native del protocollo Milvus, offre una maggiore usabilità, efficienza dei costi e sicurezza.</p>
<p>Grazie alla nostra esperienza nella gestione dei più grandi cluster di ricerca vettoriale al mondo e nel supporto a migliaia di sviluppatori di applicazioni di intelligenza artificiale, Zilliz Cloud riduce significativamente i costi e le spese operative rispetto alle soluzioni self-hosted.</p>
<p>Siete pronti a sperimentare il futuro della ricerca vettoriale? Iniziate oggi stesso la vostra prova gratuita con un credito fino a 200 dollari, senza bisogno di carta di credito.</p>
