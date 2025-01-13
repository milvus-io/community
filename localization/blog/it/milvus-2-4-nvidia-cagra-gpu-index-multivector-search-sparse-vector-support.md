---
id: milvus-2-4-nvidia-cagra-gpu-index-multivector-search-sparse-vector-support.md
title: >-
  Presentazione di Milvus 2.4: ricerca multivettoriale, vettore sparso, indice
  CAGRA e altro ancora!
author: Fendy Feng
date: 2024-3-20
desc: >-
  Siamo lieti di annunciare il lancio di Milvus 2.4, un importante passo avanti
  nel miglioramento delle capacità di ricerca per i dataset di grandi
  dimensioni.
metaTitle: 'Milvus 2.4 Supports Multi-vector Search, Sparse Vector, CAGRA, and More!'
cover: assets.zilliz.com/What_is_new_in_Milvus_2_4_1_c580220be3.png
tag: Engineering
tags: >-
  Data science, Database, Tech, Artificial Intelligence, Vector Management,
  Milvus
recommend: true
canonicalUrl: >-
  https://milvus.io/blog/milvus-2-4-nvidia-cagra-gpu-index-multivector-search-sparse-vector-support.md
---
<p>Siamo lieti di annunciare il lancio di Milvus 2.4, un importante passo avanti nel miglioramento delle capacità di ricerca per i dataset di grandi dimensioni. Quest'ultima versione aggiunge nuove funzionalità, come il supporto per l'indice CAGRA basato su GPU, il supporto beta per le <a href="https://zilliz.com/learn/sparse-and-dense-embeddings">incorporazioni sparse</a>, la ricerca per gruppi e vari altri miglioramenti nelle capacità di ricerca. Questi sviluppi rafforzano il nostro impegno nei confronti della comunità, offrendo a sviluppatori come voi uno strumento potente ed efficiente per la gestione e l'interrogazione di dati vettoriali. Vediamo insieme i principali vantaggi di Milvus 2.4.</p>
<h2 id="Enabled-Multi-vector-Search-for-Simplified-Multimodal-Searches" class="common-anchor-header">Ricerca multivettoriale abilitata per ricerche multimodali semplificate<button data-href="#Enabled-Multi-vector-Search-for-Simplified-Multimodal-Searches" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.4 offre la possibilità di ricerca multivettoriale, consentendo la ricerca e la riclassificazione simultanea di diversi tipi di vettori all'interno dello stesso sistema Milvus. Questa funzione semplifica le ricerche multimodali, migliorando significativamente i tassi di richiamo e consentendo agli sviluppatori di gestire senza problemi applicazioni di intelligenza artificiale complesse con diversi tipi di dati. Inoltre, questa funzionalità semplifica l'integrazione e la messa a punto di modelli di reranking personalizzati, favorendo la creazione di funzioni di ricerca avanzate come i <a href="https://zilliz.com/vector-database-use-cases/recommender-system">sistemi di raccomandazione</a> precisi che utilizzano le intuizioni dei dati multidimensionali.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/How_the_multi_vector_search_feature_works_6c85961349.png" alt="How the Milti-Vector Search Feature Works" class="doc-image" id="how-the-milti-vector-search-feature-works" />
   </span> <span class="img-wrapper"> <span>Come funziona la funzione di ricerca multivettoriale</span> </span></p>
<p>Il supporto multivettoriale in Milvus ha due componenti:</p>
<ol>
<li><p>La possibilità di memorizzare/interrogare più vettori per una singola entità all'interno di una collezione, che è un modo più naturale di organizzare i dati.</p></li>
<li><p>La possibilità di costruire/ottimizzare un algoritmo di reranking sfruttando gli algoritmi di reranking precostituiti in Milvus.</p></li>
</ol>
<p>Oltre a essere una <a href="https://github.com/milvus-io/milvus/issues/25639">funzionalità</a> molto <a href="https://github.com/milvus-io/milvus/issues/25639">richiesta</a>, abbiamo creato questa capacità perché il settore si sta muovendo verso modelli multimodali con il rilascio di GPT-4 e Claude 3. Il reranking è una tecnica comunemente usata per migliorare ulteriormente le prestazioni delle query nella ricerca. Il nostro obiettivo è stato quello di facilitare agli sviluppatori la creazione e l'ottimizzazione dei loro reranker all'interno dell'ecosistema Milvus.</p>
<h2 id="Grouping-Search-Support-for-Enhanced-Compute-Efficiency" class="common-anchor-header">Supporto della ricerca per gruppi per una maggiore efficienza di calcolo<button data-href="#Grouping-Search-Support-for-Enhanced-Compute-Efficiency" class="anchor-icon" translate="no">
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
    </button></h2><p>La ricerca per gruppi è un'altra <a href="https://github.com/milvus-io/milvus/issues/25343">caratteristica</a> spesso <a href="https://github.com/milvus-io/milvus/issues/25343">richiesta</a> che abbiamo aggiunto a Milvus 2.4. Essa integra un'<a href="https://github.com/milvus-io/milvus/issues/25343">operazione</a> di raggruppamento progettata per migliorare l'efficienza di calcolo. Integra un'operazione di raggruppamento progettata per campi di tipo BOOL, INT o VARCHAR, colmando una lacuna cruciale in termini di efficienza nell'esecuzione di query di raggruppamento su larga scala.</p>
<p>Tradizionalmente, gli sviluppatori si affidavano a estese ricerche Top-K seguite da una post-elaborazione manuale per distillare i risultati specifici del gruppo, un metodo che richiedeva molto calcolo e codice. Grouping Search perfeziona questo processo collegando in modo efficiente i risultati delle query agli identificatori aggregati dei gruppi, come i nomi dei documenti o dei video, semplificando la gestione delle entità segmentate all'interno di grandi insiemi di dati.</p>
<p>Milvus si distingue per l'implementazione di Grouping Search basata su iteratori, che offre un netto miglioramento dell'efficienza computazionale rispetto a tecnologie simili. Questa scelta garantisce una scalabilità superiore delle prestazioni, in particolare negli ambienti di produzione dove l'ottimizzazione delle risorse di calcolo è fondamentale. Riducendo l'attraversamento dei dati e l'overhead di calcolo, Milvus supporta un'elaborazione più efficiente delle query, riducendo significativamente i tempi di risposta e i costi operativi rispetto ad altri database vettoriali.</p>
<p>Grouping Search rafforza la capacità di Milvus di gestire query complesse e ad alto volume e si allinea alle pratiche di calcolo ad alte prestazioni per soluzioni robuste di gestione dei dati.</p>
<h2 id="Beta-Support-for-Sparse-Vector-Embeddings" class="common-anchor-header">Supporto beta per le incorporazioni vettoriali sparse<button data-href="#Beta-Support-for-Sparse-Vector-Embeddings" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://zilliz.com/learn/sparse-and-dense-embeddings">Le incorporazioni sparse</a> rappresentano un cambiamento di paradigma rispetto ai tradizionali approcci vettoriali densi, in quanto si occupano delle sfumature della somiglianza semantica piuttosto che della mera frequenza delle parole chiave. Questa distinzione consente di ottenere una capacità di ricerca più sfumata, in linea con il contenuto semantico della query e dei documenti. I modelli vettoriali sparsi, particolarmente utili nell'information retrieval e nell'elaborazione del linguaggio naturale, offrono potenti capacità di ricerca fuori dal dominio e interpretabilità rispetto alle loro controparti dense.</p>
<p>In Milvus 2.4, abbiamo ampliato la ricerca ibrida per includere le incorporazioni sparse generate da modelli neurali avanzati come SPLADEv2 o da modelli statistici come BM25. In Milvus, i vettori sparsi sono trattati alla stessa stregua dei vettori densi, consentendo la creazione di collezioni con campi vettoriali sparsi, l'inserimento di dati, la costruzione di indici e l'esecuzione di ricerche di similarità. In particolare, le incorporazioni rade in Milvus supportano la metrica di distanza <a href="https://zilliz.com/blog/similarity-metrics-for-vector-search#Inner-Product">Inner Product</a> (IP), che è vantaggiosa data la loro natura altamente dimensionale, che rende altre metriche meno efficaci. Questa funzionalità supporta anche i tipi di dati con una dimensione come un intero a 32 bit senza segno e un float a 32 bit per il valore, facilitando così un ampio spettro di applicazioni, dalle ricerche testuali sfumate ai sistemi elaborati <a href="https://zilliz.com/learn/information-retrieval-metrics">di recupero delle informazioni</a>.</p>
<p>Con questa nuova funzione, Milvus consente di utilizzare metodologie di ricerca ibride che fondono le tecniche basate sulle parole chiave e quelle basate sull'incorporazione, offrendo una transizione senza soluzione di continuità per gli utenti che si spostano da framework di ricerca incentrati sulle parole chiave alla ricerca di una soluzione completa e a bassa manutenzione.</p>
<p>Stiamo etichettando questa funzione come "Beta" per continuare a testarne le prestazioni e raccogliere il feedback della comunità. La disponibilità generale (GA) del supporto vettoriale sparse è prevista con il rilascio di Milvus 3.0.</p>
<h2 id="CAGRA-Index-Support-for-Advanced-GPU-Accelerated-Graph-Indexing" class="common-anchor-header">Supporto dell'indice CAGRA per l'indicizzazione avanzata dei grafici accelerata dalle GPU<button data-href="#CAGRA-Index-Support-for-Advanced-GPU-Accelerated-Graph-Indexing" class="anchor-icon" translate="no">
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
    </button></h2><p>Sviluppata da NVIDIA, <a href="https://arxiv.org/abs/2308.15136">CAGRA</a> (Cuda Anns GRAph-based) è una tecnologia di indicizzazione dei grafi basata su GPU che supera in modo significativo i metodi tradizionali basati su CPU, come l'indice HNSW, in termini di efficienza e prestazioni, soprattutto negli ambienti ad alto rendimento.</p>
<p>Con l'introduzione dell'indice CAGRA, Milvus 2.4 offre una maggiore capacità di indicizzazione dei grafi accelerata dalle GPU. Questo miglioramento è ideale per la creazione di applicazioni di ricerca per similarità che richiedono una latenza minima. Inoltre, Milvus 2.4 integra una ricerca brutale con l'indice CAGRA per ottenere i massimi tassi di richiamo nelle applicazioni. Per maggiori dettagli, visitate il <a href="https://zilliz.com/blog/Milvus-introduces-GPU-index-CAGRA">blog introduttivo su CAGRA</a>.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Milvus_raft_cagra_vs_milvus_hnsw_ffe0415ff5.png" alt="Milvus Raft CAGRA vs. Milvus HNSW" class="doc-image" id="milvus-raft-cagra-vs.-milvus-hnsw" />
   </span> <span class="img-wrapper"> <span>Milvus Raft CAGRA vs Milvus HNSW</span> </span></p>
<h2 id="Additional-Enhancements-and-Features" class="common-anchor-header">Ulteriori miglioramenti e caratteristiche<button data-href="#Additional-Enhancements-and-Features" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.4 include anche altri miglioramenti chiave, come il supporto delle espressioni regolari per una migliore corrispondenza delle sottostringhe nel <a href="https://zilliz.com/blog/metadata-filtering-with-zilliz-cloud-pipelines">filtraggio dei metadati</a>, un nuovo indice scalare invertito per un efficiente filtraggio dei tipi di dati scalari e uno strumento di Change Data Capture per monitorare e replicare le modifiche nelle collezioni Milvus. Questi aggiornamenti migliorano complessivamente le prestazioni e la versatilità di Milvus, rendendolo una soluzione completa per operazioni complesse sui dati.</p>
<p>Per maggiori dettagli, consultare la <a href="https://milvus.io/docs/release_notes.md">documentazione di Milvus 2.4</a>.</p>
<h2 id="Stay-Connected" class="common-anchor-header">Restate connessi!<button data-href="#Stay-Connected" class="anchor-icon" translate="no">
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
    </button></h2><p>Siete curiosi di saperne di più su Milvus 2.4? <a href="https://zilliz.com/event/unlocking-advanced-search-capabilities-milvus">Partecipate al nostro prossimo webinar</a> con James Luan, VP of Engineering di Zilliz, per una discussione approfondita sulle funzionalità di questa ultima versione. Se avete domande o commenti, iscrivetevi al nostro <a href="https://discord.com/invite/8uyFbECzPX">canale Discord</a> per confrontarvi con i nostri ingegneri e membri della comunità. Non dimenticate di seguirci su <a href="https://twitter.com/milvusio">Twitter</a> o <a href="https://www.linkedin.com/company/the-milvus-project">LinkedIn</a> per le ultime notizie e aggiornamenti su Milvus.</p>
