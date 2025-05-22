---
id: diskann-explained.md
title: Il DiskANN spiegato
author: Stefan Webb
date: 2025-05-20T00:00:00.000Z
desc: >-
  Scoprite come DiskANN offre ricerche vettoriali su scala miliardaria
  utilizzando le unità SSD, bilanciando un basso utilizzo della memoria,
  un'elevata precisione e prestazioni scalabili.
cover: assets.zilliz.com/Disk_ANN_Explained_35db4b3ef1.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search'
meta_keywords: >-
  Milvus, DiskANN, vector similarity search, indexing, Vamana algorithm, disk
  vector search
meta_title: DiskANN Explained
origin: 'https://milvus.io/blog/diskann-explained.md'
---
<h2 id="What-is-DiskANN" class="common-anchor-header">Che cos'è DiskANN?<button data-href="#What-is-DiskANN" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://github.com/microsoft/DiskANN">DiskANN</a> rappresenta un approccio innovativo alla <a href="https://zilliz.com/learn/vector-similarity-search">ricerca di similarità vettoriale</a>. Prima di questo approccio, la maggior parte degli indici vettoriali, come HNSW, si affidava pesantemente alla RAM per ottenere una bassa latenza e un elevato richiamo. Sebbene sia efficace per set di dati di dimensioni moderate, questo approccio diventa proibitivo e meno scalabile con l'aumentare dei volumi di dati. DiskANN offre un'alternativa economica sfruttando le unità SSD per memorizzare l'indice, riducendo in modo significativo i requisiti di memoria.</p>
<p>DiskANN impiega una struttura a grafo piatto ottimizzata per l'accesso al disco, che gli consente di gestire dataset di dimensioni miliardarie con una frazione dell'ingombro di memoria richiesto dai metodi in-memory. Ad esempio, DiskANN può indicizzare fino a un miliardo di vettori ottenendo un'accuratezza di ricerca del 95% con latenze di 5 ms, mentre gli algoritmi basati su RAM raggiungono picchi di 100-200 milioni di punti per ottenere prestazioni simili.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Vector_indexing_and_search_workflow_with_Disk_ANN_41cdf33652.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figura 1: Flusso di lavoro per l'indicizzazione e la ricerca dei vettori con DiskANN</em></p>
<p>Sebbene DiskANN possa introdurre una latenza leggermente superiore rispetto agli approcci basati su RAM, il compromesso è spesso accettabile, dato il sostanziale risparmio sui costi e i vantaggi in termini di scalabilità. DiskANN è particolarmente adatto alle applicazioni che richiedono una ricerca vettoriale su larga scala su hardware commodity.</p>
<p>Questo articolo spiegherà i metodi intelligenti di DiskANN per sfruttare l'SSD in aggiunta alla RAM e ridurre le costose letture su SSD.</p>
<h2 id="How-Does-DiskANN-Work" class="common-anchor-header">Come funziona DiskANN?<button data-href="#How-Does-DiskANN-Work" class="anchor-icon" translate="no">
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
    </button></h2><p>DiskANN è un metodo di ricerca vettoriale basato su grafo che appartiene alla stessa famiglia di metodi HNSW. Per prima cosa costruiamo un grafo di ricerca in cui i nodi corrispondono a vettori (o gruppi di vettori) e gli spigoli indicano che una coppia di vettori è "relativamente vicina" in un certo senso. Una ricerca tipica sceglie casualmente un "nodo di ingresso" e naviga verso il suo vicino più vicino all'interrogazione, ripetendo in modo avido fino al raggiungimento di un minimo locale.</p>
<p>Le strutture di indicizzazione basate su grafi si differenziano principalmente per il modo in cui costruiscono il grafo di ricerca ed eseguono la ricerca. In questa sezione, faremo un'immersione tecnica nelle innovazioni di DiskANN per queste fasi e su come consentono prestazioni a bassa latenza e bassa memoria. (Per un riepilogo, vedere la figura precedente).</p>
<h3 id="An-Overview" class="common-anchor-header">Una panoramica</h3><p>Supponiamo che l'utente abbia generato un insieme di embeddings vettoriali di documenti. Il primo passo consiste nel raggruppare le incorporazioni. Un grafo di ricerca per ogni cluster viene costruito separatamente utilizzando l'algoritmo Vamana (spiegato nella prossima sezione) e i risultati vengono uniti in un unico grafo. <em>La strategia divide et impera per la creazione del grafo di ricerca finale riduce in modo significativo l'utilizzo della memoria senza influenzare troppo la latenza della ricerca o il richiamo.</em></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/How_Disk_ANN_stores_vector_index_across_RAM_and_SSD_d6564b087f.jpg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figura 2: Come DiskANN memorizza l'indice vettoriale tra RAM e SSD</em></p>
<p>Dopo aver prodotto il grafo di ricerca globale, questo viene memorizzato sull'SSD insieme alle incorporazioni vettoriali a piena precisione. Una sfida importante è quella di terminare la ricerca entro un numero limitato di letture dell'SSD, poiché l'accesso all'SSD è costoso rispetto all'accesso alla RAM. Per questo motivo, vengono utilizzati alcuni trucchi intelligenti per limitare il numero di letture:</p>
<p>In primo luogo, l'algoritmo Vamana incentiva percorsi più brevi tra nodi vicini, limitando il numero massimo di vicini di un nodo. In secondo luogo, viene utilizzata una struttura dati di dimensioni fisse per memorizzare l'incorporazione di ciascun nodo e i suoi vicini (si veda la figura precedente). Ciò significa che possiamo indirizzare i metadati di un nodo semplicemente moltiplicando la dimensione della struttura dati per l'indice del nodo e usando questo come offset, recuperando contemporaneamente l'embedding del nodo. In terzo luogo, grazie al funzionamento dell'SSD, possiamo recuperare più nodi per ogni richiesta di lettura, nel nostro caso i nodi vicini, riducendo ulteriormente il numero di richieste di lettura.</p>
<p>Separatamente, comprimiamo le incorporazioni utilizzando la quantizzazione del prodotto e le memorizziamo nella RAM. In questo modo, possiamo inserire set di dati vettoriali su scala miliardaria in una memoria fattibile su una singola macchina per calcolare rapidamente <em>le somiglianze vettoriali approssimative</em> senza leggere il disco. Ciò fornisce indicazioni per ridurre il numero di nodi vicini a cui accedere successivamente sull'SSD. Tuttavia, è importante notare che le decisioni di ricerca vengono prese utilizzando le <em>somiglianze vettoriali esatte</em>, con gli embeddings completi recuperati dall'SSD, il che garantisce un richiamo più elevato. Per sottolineare, c'è una fase iniziale di ricerca che utilizza gli embeddings quantizzati in memoria, e una successiva ricerca su un sottoinsieme più piccolo letto dall'SSD.</p>
<p>In questa descrizione, abbiamo tralasciato due fasi importanti, anche se complesse: la costruzione del grafo e la ricerca del grafo - le due fasi indicate dai riquadri rossi in alto. Esaminiamo ciascuno di questi passaggi a turno.</p>
<h3 id="Vamana-Graph-Construction" class="common-anchor-header">"Costruzione del grafo "Vamana</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Vamana_Graph_Construction_ecb4dab839.jpg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figura: "Costruzione del grafo "Vamana</em></p>
<p>Gli autori di DiskANN hanno sviluppato un metodo innovativo per la costruzione del grafo di ricerca, che chiamano algoritmo Vamana. L'algoritmo inizializza il grafo di ricerca aggiungendo casualmente O(N) bordi. In questo modo si ottiene un grafo "ben connesso", anche se senza alcuna garanzia di convergenza della ricerca greedy. Poi pota e ricollega gli spigoli in modo intelligente per garantire che ci siano sufficienti connessioni a lungo raggio (vedi figura precedente). Vediamo di approfondire:</p>
<h4 id="Initialization" class="common-anchor-header">Inizializzazione</h4><p>Il grafo di ricerca viene inizializzato con un grafo diretto casuale in cui ogni nodo ha R vicini esterni. Si calcola anche la medoide del grafo, cioè il punto che ha la distanza media minima da tutti gli altri punti. Si può pensare che sia analogo a un centroide che è un membro dell'insieme dei nodi.</p>
<h4 id="Search-for-Candidates" class="common-anchor-header">Ricerca dei candidati</h4><p>Dopo l'inizializzazione, iteriamo sui nodi, aggiungendo e rimuovendo bordi a ogni passo. Per prima cosa, eseguiamo un algoritmo di ricerca sul nodo selezionato, p, per generare un elenco di candidati. L'algoritmo di ricerca parte dal medoide e naviga avidamente sempre più vicino al nodo selezionato, aggiungendo a ogni passo gli out-neighbors del nodo più vicino trovato finora. Viene restituito l'elenco di L nodi trovati più vicini a p. (Se non si ha familiarità con questo concetto, il medoide di un grafo è il punto che ha la distanza media minima da tutti gli altri punti e agisce come un analogo del centroide per i grafi).</p>
<h4 id="Pruning-and-Adding-Edges" class="common-anchor-header">Potatura e aggiunta di bordi</h4><p>I candidati vicini del nodo vengono ordinati in base alla distanza e, per ogni candidato, l'algoritmo controlla se è "troppo vicino" in direzione a un vicino già scelto. In caso affermativo, il nodo viene tagliato. In questo modo si promuove la diversità angolare tra i vicini, che empiricamente porta a migliori proprietà di navigazione. In pratica, ciò significa che una ricerca che parte da un nodo casuale può raggiungere più rapidamente qualsiasi nodo di destinazione esplorando un insieme rado di collegamenti locali e a lungo raggio.</p>
<p>Dopo la potatura degli spigoli, vengono aggiunti gli spigoli lungo il percorso di ricerca greedy verso p. Vengono eseguiti due passaggi di potatura, variando la soglia di distanza per la potatura in modo da aggiungere bordi a lungo termine nel secondo passaggio.</p>
<h2 id="What’s-Next" class="common-anchor-header">Che cosa è successo dopo?<button data-href="#What’s-Next" class="anchor-icon" translate="no">
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
    </button></h2><p>Il lavoro successivo si è basato su DiskANN per apportare ulteriori miglioramenti. Un esempio degno di nota, noto come <a href="https://arxiv.org/abs/2105.09613">FreshDiskANN</a>, modifica il metodo per consentire un facile aggiornamento dell'indice dopo la sua costruzione. Questo indice di ricerca, che offre un eccellente compromesso tra i criteri di prestazione, è disponibile nel database vettoriale <a href="https://milvus.io/docs/overview.md">Milvus</a> come tipo di indice <code translate="no">DISKANN</code>.</p>
<pre><code translate="no" class="language-python"><span class="hljs-comment"># Prepare index parameters</span>
index_params = client.prepare_index_params()

<span class="hljs-comment"># Add DiskANN index</span>
index_params.add_index(
    field_name=<span class="hljs-string">&quot;vector&quot;</span>,
    index_type=<span class="hljs-string">&quot;DISKANN&quot;</span>,
    metric_type=<span class="hljs-string">&quot;COSINE&quot;</span>
)

<span class="hljs-comment"># Create collection with index</span>
client.create_collection(
    collection_name=<span class="hljs-string">&quot;diskann_collection&quot;</span>,
    schema=schema,
    index_params=index_params
)
<button class="copy-code-btn"></button></code></pre>
<p>È anche possibile sintonizzare i parametri di DiskANN, come <code translate="no">MaxDegree</code> e <code translate="no">BeamWidthRatio</code>: per maggiori dettagli, consultare <a href="https://milvus.io/docs/disk_index.md#On-disk-Index">la pagina di documentazione</a>.</p>
<h2 id="Resources" class="common-anchor-header">Risorse<button data-href="#Resources" class="anchor-icon" translate="no">
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
    </button></h2><ul>
<li><p><a href="https://milvus.io/docs/disk_index.md#On-disk-Index">Documentazione Milvus sull'uso di DiskANN</a></p></li>
<li><p><a href="https://suhasjs.github.io/files/diskann_neurips19.pdf">"DiskANN: ricerca accurata e veloce dei vicini di un miliardo di punti su un singolo nodo".</a></p></li>
<li><p><a href="https://arxiv.org/abs/2105.09613">"FreshDiskANN: un indice ANN basato su grafo veloce e accurato per la ricerca di similarità in streaming".</a></p></li>
</ul>
