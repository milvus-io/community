---
id: getting-started-with-hnswlib.md
title: Come iniziare con HNSWlib
author: Haziqa Sajid
date: 2024-11-25T00:00:00.000Z
desc: >-
  HNSWlib, una libreria che implementa HNSW, è altamente efficiente e scalabile,
  con buone prestazioni anche con milioni di punti. Scoprite come implementarla
  in pochi minuti.
metaTitle: Getting Started with HNSWlib
cover: assets.zilliz.com/Getting_Started_with_HNS_Wlib_30922def3e.png
tag: Engineering
tags: >-
  HNSWlib, HNSW Hierarchical Navigable Small Worlds, Vector Search, Approximate
  Nearest Neighbor (ANN) search, ANNS
recommend: true
canonicalUrl: 'https://milvus.io/blog/getting-started-with-hnswlib.md'
---
<p>La<a href="https://zilliz.com/glossary/semantic-search">ricerca semantica</a> consente alle macchine di comprendere il linguaggio e di ottenere risultati di ricerca migliori, il che è essenziale per l'intelligenza artificiale e l'analisi dei dati. Una volta rappresentato il linguaggio sotto forma di <a href="https://zilliz.com/learn/everything-you-should-know-about-vector-embeddings">embeddings</a>, la ricerca può essere eseguita con metodi esatti o approssimativi. La ricerca approssimativa dei vicini<a href="https://zilliz.com/glossary/anns">(ANN</a>) è un metodo utilizzato per trovare rapidamente i punti di un set di dati che sono più vicini a un determinato punto di interrogazione, a differenza della <a href="https://zilliz.com/blog/k-nearest-neighbor-algorithm-for-machine-learning">ricerca esatta dei vicini</a>, che può essere computazionalmente costosa per i dati ad alta dimensionalità. La RNA consente un reperimento più rapido, fornendo risultati approssimativamente vicini ai vicini più prossimi.</p>
<p>Uno degli algoritmi per la ricerca approssimativa dei vicini (ANN) è <a href="https://zilliz.com/learn/hierarchical-navigable-small-worlds-HNSW">HNSW</a> (Hierarchical Navigable Small Worlds), implementato in <a href="https://zilliz.com/learn/learn-hnswlib-graph-based-library-for-fast-anns">HNSWlib</a>, che sarà al centro della discussione di oggi. In questo blog, ci occuperemo di:</p>
<ul>
<li><p>Comprendere l'algoritmo HNSW.</p></li>
<li><p>Esplorare HNSWlib e le sue caratteristiche principali.</p></li>
<li><p>Configurazione di HNSWlib, con la costruzione dell'indice e l'implementazione della ricerca.</p></li>
<li><p>Confronto con Milvus.</p></li>
</ul>
<h2 id="Understanding-HNSW" class="common-anchor-header">Capire HNSW<button data-href="#Understanding-HNSW" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Hierarchical Navigable Small Worlds (</strong><a href="https://zilliz.com/learn/hierarchical-navigable-small-worlds-HNSW"><strong>HNSW</strong></a><strong>)</strong> è una struttura di dati a grafo che consente di effettuare ricerche di similarità efficienti, in particolare in spazi ad alta dimensionalità, costruendo un grafo multistrato di reti "small world". Introdotta nel <a href="https://arxiv.org/abs/1603.09320">2016</a>, HNSW risolve i problemi di scalabilità associati ai metodi di ricerca tradizionali, come le ricerche brute-force e ad albero. È ideale per applicazioni che coinvolgono grandi insiemi di dati, come i sistemi di raccomandazione, il riconoscimento delle immagini e la <a href="https://zilliz.com/vector-database-use-cases/llm-retrieval-augmented-generation">retrieval-augmented generation (RAG)</a>.</p>
<h3 id="Why-HNSW-Matters" class="common-anchor-header">Perché HNSW è importante</h3><p>HNSW migliora significativamente le prestazioni della ricerca nearest-neighbor in spazi ad alta densità. La combinazione della struttura gerarchica con la navigabilità small-world evita l'inefficienza computazionale dei metodi precedenti, consentendo di ottenere buone prestazioni anche con insiemi di dati massicci e complessi. Per capirlo meglio, vediamo come funziona ora.</p>
<h3 id="How-HNSW-Works" class="common-anchor-header">Come funziona HNSW</h3><ol>
<li><p><strong>Strati gerarchici:</strong> HNSW organizza i dati in una gerarchia di livelli, dove ogni livello contiene nodi collegati da bordi. I livelli superiori sono più scarsi e consentono di fare ampi "salti" attraverso il grafico, come se si volesse zoomare su una mappa per vedere solo le principali autostrade tra le città. I livelli inferiori aumentano di densità, fornendo dettagli più fini e maggiori connessioni tra i vicini più prossimi.</p></li>
<li><p><strong>Concetto di piccoli mondi navigabili:</strong> Ogni livello di HNSW si basa sul concetto di rete "small world", in cui i nodi (punti dati) sono a pochi "hop" di distanza l'uno dall'altro. L'algoritmo di ricerca inizia dal livello più alto e scarno e lavora verso il basso, passando a livelli progressivamente più densi per affinare la ricerca. Questo approccio è come passare da una visione globale ai dettagli del livello di vicinato, restringendo gradualmente l'area di ricerca.</p></li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Fig_1_An_Example_of_a_Navigable_Small_World_Graph_afa737ee9f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><a href="https://daniel-at-world.blogspot.com/2019/04/navigable-small-world-graphs-for.html">Fig. 1</a>: Un esempio di grafico a piccolo mondo navigabile</p>
<ol start="3">
<li><strong>Struttura simile a un elenco di salti:</strong> L'aspetto gerarchico di HNSW assomiglia a una skip list, una struttura di dati probabilistica in cui i livelli più alti hanno meno nodi, consentendo ricerche iniziali più rapide.</li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Fig_2_An_Example_of_Skip_List_Structure_f41b07234d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><a href="https://www.cs.cmu.edu/~ckingsf/bioinfo-lectures/skiplists.pdf">Fig. 2</a>: Un esempio di struttura a lista di salto</p>
<p>Per cercare 96 nella lista di salto data, iniziamo dal livello superiore, all'estrema sinistra, con il nodo di intestazione. Spostandoci a destra, incontriamo 31, meno di 96, quindi proseguiamo al nodo successivo. Ora dobbiamo scendere di un livello, dove vediamo di nuovo 31; poiché è ancora inferiore a 96, scendiamo di un altro livello. Trovando ancora una volta 31, ci spostiamo a destra e raggiungiamo 96, il nostro valore target. In questo modo, troviamo 96 senza dover scendere ai livelli più bassi dell'elenco di salto.</p>
<ol start="4">
<li><p><strong>Efficienza della ricerca:</strong> L'algoritmo HNSW parte da un nodo di ingresso al livello più alto, procedendo verso i vicini più vicini a ogni passo. Scende attraverso i livelli, utilizzando ciascuno di essi per l'esplorazione da grossolana a fine, fino a raggiungere il livello più basso, dove è probabile che si trovino i nodi più simili. Questa navigazione a strati riduce il numero di nodi e bordi da esplorare, rendendo la ricerca veloce e accurata.</p></li>
<li><p><strong>Inserimento e manutenzione</strong>: Quando si aggiunge un nuovo nodo, l'algoritmo determina il suo livello di ingresso in base alla probabilità e lo connette ai nodi vicini utilizzando un'euristica di selezione dei vicini. L'euristica mira a ottimizzare la connettività, creando collegamenti che migliorano la navigabilità, bilanciando la densità del grafo. Questo approccio mantiene la struttura robusta e adattabile a nuovi dati.</p></li>
</ol>
<p>Pur avendo una conoscenza di base dell'algoritmo HNSW, la sua implementazione da zero può risultare complessa. Fortunatamente, la comunità ha sviluppato librerie come <a href="https://github.com/nmslib/hnswlib">HNSWlib</a> per semplificarne l'uso, rendendolo accessibile senza doversi grattare la testa. Diamo quindi un'occhiata più da vicino a HNSWlib.</p>
<h2 id="Overview-of-HNSWlib" class="common-anchor-header">Panoramica di HNSWlib<button data-href="#Overview-of-HNSWlib" class="anchor-icon" translate="no">
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
    </button></h2><p>HNSWlib, una popolare libreria che implementa HNSW, è altamente efficiente e scalabile, con buone prestazioni anche con milioni di punti. Raggiunge una complessità temporale sublineare consentendo salti rapidi tra i livelli del grafo e ottimizzando la ricerca di dati densi e ad alta dimensionalità. Ecco le caratteristiche principali di HNSWlib:</p>
<ul>
<li><p><strong>Struttura a grafo:</strong> Un grafo a più livelli rappresenta i punti di dati, consentendo ricerche rapide e vicine.</p></li>
<li><p><strong>Efficienza ad alta dimensione:</strong> Ottimizzato per i dati ad alta dimensionalità, fornisce ricerche approssimative rapide e accurate.</p></li>
<li><p><strong>Tempo di ricerca sublineare:</strong> raggiunge una complessità sublineare saltando gli strati, migliorando notevolmente la velocità.</p></li>
<li><p><strong>Aggiornamenti dinamici:</strong> Supporta l'inserimento e l'eliminazione di nodi in tempo reale senza richiedere la ricostruzione completa del grafo.</p></li>
<li><p><strong>Efficienza della memoria:</strong> Utilizzo efficiente della memoria, adatto a grandi insiemi di dati.</p></li>
<li><p><strong>Scalabilità:</strong> Si adatta bene a milioni di punti di dati, il che lo rende ideale per applicazioni su media scala come i sistemi di raccomandazione.</p></li>
</ul>
<p><strong>Nota:</strong> HNSWlib è eccellente per creare semplici prototipi di applicazioni di ricerca vettoriale. Tuttavia, a causa dei limiti di scalabilità, potrebbero esserci scelte migliori, come <a href="https://zilliz.com/blog/what-is-a-real-vector-database">database vettoriali appositamente creati per</a> scenari più complessi che coinvolgono centinaia di milioni o addirittura miliardi di punti di dati. Vediamolo in azione.</p>
<h2 id="Getting-Started-with-HNSWlib-A-Step-by-Step-Guide" class="common-anchor-header">Iniziare con HNSWlib: Guida passo-passo<button data-href="#Getting-Started-with-HNSWlib-A-Step-by-Step-Guide" class="anchor-icon" translate="no">
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
    </button></h2><p>Questa sezione illustra l'uso di HNSWlib come <a href="https://zilliz.com/learn/comparing-vector-database-vector-search-library-and-vector-search-plugin">libreria di ricerca vettoriale</a>, creando un indice HNSW, inserendo dati ed eseguendo ricerche. Iniziamo con l'installazione:</p>
<h3 id="Setup-and-Imports" class="common-anchor-header">Installazione e importazioni</h3><p>Per iniziare a usare HNSWlib in Python, occorre innanzitutto installarla con pip:</p>
<pre><code translate="no">pip install hnswlib
<button class="copy-code-btn"></button></code></pre>
<p>Quindi, importare le librerie necessarie:</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> hnswlib 
<span class="hljs-keyword">import</span> numpy <span class="hljs-keyword">as</span> np
<button class="copy-code-btn"></button></code></pre>
<h3 id="Preparing-Data" class="common-anchor-header">Preparazione dei dati</h3><p>In questo esempio, utilizzeremo <code translate="no">NumPy</code>per generare un set di dati casuali con 10.000 elementi, ciascuno con dimensione 256.</p>
<pre><code translate="no">dim = <span class="hljs-number">256</span>  <span class="hljs-comment"># Dimensionality of your vectors</span>
num_elements = <span class="hljs-number">10000</span>  <span class="hljs-comment"># Number of elements to insert</span>
<button class="copy-code-btn"></button></code></pre>
<p>Creiamo i dati:</p>
<pre><code translate="no">data = np.random.rand(num_elements, dim).astype(np.float32)  <span class="hljs-comment"># Example data</span>
<button class="copy-code-btn"></button></code></pre>
<p>Ora che i dati sono pronti, costruiamo un indice.</p>
<h3 id="Building-an-Index" class="common-anchor-header">Costruire un indice</h3><p>Per costruire un indice, dobbiamo definire la dimensione dei vettori e il tipo di spazio. Creiamo un indice:</p>
<pre><code translate="no">p = hnswlib.<span class="hljs-title class_">Index</span>(space=<span class="hljs-string">&#x27;l2&#x27;</span>, dim=dim)
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><code translate="no">space='l2'</code>: Questo parametro definisce la metrica di distanza utilizzata per la similarità. Impostarlo su <code translate="no">'l2'</code> significa utilizzare la distanza euclidea (norma L2). Se invece si imposta <code translate="no">'ip'</code>, si utilizzerà il prodotto interno, utile per operazioni come la somiglianza del coseno.</li>
</ul>
<ul>
<li><code translate="no">dim=dim</code>: Questo parametro specifica la dimensionalità dei punti dati con cui si lavorerà. Deve corrispondere alla dimensione dei dati che si intende aggiungere all'indice.</li>
</ul>
<p>Ecco come inizializzare un indice:</p>
<pre><code translate="no">p.init_index(max_elements=num_elements, ef_construction=200, M=16)
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><code translate="no">max_elements=num_elements</code>: Imposta il numero massimo di elementi che possono essere aggiunti all'indice. <code translate="no">Num_elements</code> è la capacità massima, quindi lo impostiamo a 10.000 poiché stiamo lavorando con 10.000 punti dati.</li>
</ul>
<ul>
<li><code translate="no">ef_construction=200</code>: Questo parametro controlla il compromesso tra precisione e velocità di costruzione durante la creazione dell'indice. Un valore più alto migliora il richiamo (precisione) ma aumenta l'utilizzo della memoria e il tempo di costruzione. I valori comuni vanno da 100 a 200.</li>
</ul>
<ul>
<li><code translate="no">M=16</code>: Questo parametro determina il numero di collegamenti bidirezionali creati per ogni punto dati, influenzando la precisione e la velocità di ricerca. I valori tipici sono compresi tra 12 e 48; 16 è spesso un buon equilibrio tra precisione e velocità.</li>
</ul>
<pre><code translate="no">p.set_ef(<span class="hljs-number">50</span>)  <span class="hljs-comment"># This parameter controls the speed/accuracy trade-off</span>
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><code translate="no">ef</code>: Il parametro <code translate="no">ef</code>, abbreviazione di "fattore di esplorazione", determina il numero di vicini esaminati durante la ricerca. Un valore più alto di <code translate="no">ef</code> comporta l'esplorazione di un maggior numero di vicini, il che generalmente aumenta l'accuratezza (recall) della ricerca, ma la rende anche più lenta. Al contrario, un valore di <code translate="no">ef</code> più basso può rendere la ricerca più veloce, ma potrebbe ridurre l'accuratezza.</li>
</ul>
<p>In questo caso, l'impostazione di <code translate="no">ef</code> a 50 significa che l'algoritmo di ricerca valuterà fino a 50 vicini per trovare i punti dati più simili.</p>
<p>Nota: <code translate="no">ef_construction</code> imposta lo sforzo di ricerca dei vicini durante la creazione dell'indice, migliorando l'accuratezza ma rallentando la costruzione. <code translate="no">ef</code> controlla lo sforzo di ricerca durante l'interrogazione, bilanciando velocità e richiamo in modo dinamico per ogni interrogazione.</p>
<h3 id="Performing-Searches" class="common-anchor-header">Esecuzione delle ricerche</h3><p>Per eseguire una ricerca di nearest neighbor con HNSWlib, si crea innanzitutto un vettore di query casuale. In questo esempio, la dimensionalità del vettore corrisponde ai dati indicizzati.</p>
<pre><code translate="no">query_vector = np.random.rand(dim).astype(np.float32)  <span class="hljs-comment"># Example query</span>

labels, distances = p.knn_query(query_vector, k=<span class="hljs-number">5</span>)  <span class="hljs-comment"># k is the number of nearest neighbors</span>
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><code translate="no">query_vector</code>: Questa riga genera un vettore casuale con la stessa dimensionalità dei dati indicizzati, garantendo la compatibilità con la ricerca nearest neighbor.</li>
<li><code translate="no">knn_query</code>: Il metodo cerca i <code translate="no">k</code> vicini più prossimi di <code translate="no">query_vector</code> all'interno dell'indice <code translate="no">p</code>. Restituisce due array: <code translate="no">labels</code>, che contengono gli indici dei vicini più prossimi, e <code translate="no">distances</code>, che indicano le distanze del vettore di interrogazione da ciascuno di questi vicini. In questo caso, <code translate="no">k=5</code> specifica che vogliamo trovare i cinque vicini più prossimi.</li>
</ul>
<p>Ecco i risultati dopo la stampa delle etichette e delle distanze:</p>
<pre><code translate="no"><span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Nearest neighbors&#x27; labels:&quot;</span>, labels)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Distances:&quot;</span>, distances)
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">&gt; Nearest neighbors&#x27; labels: [[4498 1751 5647 4483 2471]]
&gt; Distances: [[33.718    35.484592 35.627766 35.828312 35.91495 ]]
<button class="copy-code-btn"></button></code></pre>
<p>Ecco una semplice guida per iniziare a lavorare con HNSWlib.</p>
<p>Come già detto, HNSWlib è un ottimo motore di ricerca vettoriale per la prototipazione o la sperimentazione con insiemi di dati di medie dimensioni. Se avete requisiti di scalabilità più elevati o necessitate di altre funzionalità di livello aziendale, potreste dover scegliere un database vettoriale appositamente creato, come <a href="https://zilliz.com/what-is-milvus">Milvus</a> open-source o il suo servizio completamente gestito su <a href="https://zilliz.com/cloud">Zilliz Cloud</a>. Nella sezione seguente, quindi, confronteremo HNSWlib con Milvus.</p>
<h2 id="HNSWlib-vs-Purpose-Built-Vector-Databases-Like-Milvus" class="common-anchor-header">HNSWlib e i database vettoriali come Milvus<button data-href="#HNSWlib-vs-Purpose-Built-Vector-Databases-Like-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Un <a href="https://zilliz.com/learn/what-is-vector-database">database vettoriale</a> memorizza i dati come rappresentazioni matematiche, consentendo ai <a href="https://zilliz.com/ai-models">modelli di apprendimento automatico</a> di alimentare la ricerca, le raccomandazioni e la generazione di testi, identificando i dati attraverso <a href="https://zilliz.com/blog/similarity-metrics-for-vector-search">metriche di somiglianza</a> per la comprensione del contesto.</p>
<p>Le librerie di indici vettoriali come HNSWlib migliorano la<a href="https://zilliz.com/learn/vector-similarity-search">ricerca</a> e il recupero dei vettori, ma non hanno le caratteristiche di gestione di un database completo. D'altra parte, i database vettoriali, come <a href="https://milvus.io/">Milvus</a>, sono progettati per gestire le incorporazioni vettoriali su scala, offrendo vantaggi nella gestione dei dati, nell'indicizzazione e nelle capacità di interrogazione che le librerie autonome di solito non hanno. Ecco alcuni altri vantaggi dell'uso di Milvus:</p>
<ul>
<li><p><strong>Ricerca di similarità vettoriale ad alta velocità</strong>: Milvus offre prestazioni di ricerca a livello di millisecondi su insiemi di dati vettoriali su scala miliardaria, ideali per applicazioni come il recupero di immagini, i sistemi di raccomandazione, l'elaborazione del linguaggio naturale<a href="https://zilliz.com/learn/A-Beginner-Guide-to-Natural-Language-Processing">(NLP</a>) e la generazione aumentata del recupero (<a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">RAG</a>).</p></li>
<li><p><strong>Scalabilità e alta disponibilità:</strong> Costruito per gestire volumi di dati enormi, Milvus è scalabile orizzontalmente e include meccanismi di replica e failover per garantire l'affidabilità.</p></li>
<li><p><strong>Architettura distribuita:</strong> Milvus utilizza un'architettura distribuita e scalabile che separa l'archiviazione e l'elaborazione su più nodi per garantire flessibilità e robustezza.</p></li>
<li><p><a href="https://zilliz.com/blog/a-review-of-hybrid-search-in-milvus"><strong>Ricerca ibrida</strong></a><strong>:</strong> Milvus supporta la ricerca multimodale, la <a href="https://zilliz.com/learn/sparse-and-dense-embeddings">ricerca</a> ibrida <a href="https://zilliz.com/learn/sparse-and-dense-embeddings">rada e densa</a> e la <a href="https://thenewstack.io/elasticsearch-was-great-but-vector-databases-are-the-future/">ricerca</a> ibrida densa e <a href="https://thenewstack.io/elasticsearch-was-great-but-vector-databases-are-the-future/">full-text</a>, offrendo funzionalità di ricerca versatili e flessibili.</p></li>
<li><p><strong>Supporto flessibile dei dati</strong>: Milvus supporta diversi tipi di dati, vettori, scalari e strutturati, consentendo una gestione e un'analisi senza soluzione di continuità in un unico sistema.</p></li>
<li><p><a href="https://discord.com/invite/8uyFbECzPX"><strong>Comunità</strong></a> <strong>e supporto</strong><a href="https://discord.com/invite/8uyFbECzPX"><strong>attivi</strong></a>: Una fiorente comunità fornisce aggiornamenti, tutorial e supporto regolari, assicurando che Milvus rimanga allineato alle esigenze degli utenti e ai progressi del settore.</p></li>
<li><p><a href="https://milvus.io/docs/integrations_overview.md">Integrazione dell'intelligenza artificiale</a>: Milvus si è integrato con diversi framework e tecnologie di IA popolari, rendendo più facile per gli sviluppatori costruire applicazioni con i loro stack tecnologici familiari.</p></li>
</ul>
<p>Milvus offre anche un servizio completamente gestito su <a href="https://zilliz.com/cloud">Ziliz Cloud</a>, che è privo di problemi e 10 volte più veloce di Milvus.</p>
<h3 id="Comparison-Milvus-vs-HNSWlib" class="common-anchor-header">Confronto: Milvus vs. HNSWlib</h3><table>
<thead>
<tr><th style="text-align:center"><strong>Caratteristiche</strong></th><th style="text-align:center"><strong>Milvus</strong></th><th style="text-align:center"><strong>HNSWlib</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center">Scalabilità</td><td style="text-align:center">Gestisce miliardi di vettori con facilità</td><td style="text-align:center">Adatto a set di dati più piccoli grazie all'utilizzo della RAM</td></tr>
<tr><td style="text-align:center">Ideale per</td><td style="text-align:center">Prototipi, esperimenti e applicazioni di livello aziendale</td><td style="text-align:center">Si concentra sui prototipi e sulle attività ANN leggere</td></tr>
<tr><td style="text-align:center">Indicizzazione</td><td style="text-align:center">Supporta oltre 10 algoritmi di indicizzazione, tra cui HNSW, DiskANN, Quantization e Binary.</td><td style="text-align:center">Utilizza solo HNSW basato su grafo</td></tr>
<tr><td style="text-align:center">Integrazione</td><td style="text-align:center">Offre API e servizi cloud-nativi</td><td style="text-align:center">Funge da libreria leggera e indipendente</td></tr>
<tr><td style="text-align:center">Prestazioni</td><td style="text-align:center">Ottimizza le query distribuite e su grandi dati</td><td style="text-align:center">Offre alta velocità ma scalabilità limitata</td></tr>
</tbody>
</table>
<p>Nel complesso, Milvus è generalmente preferibile per le applicazioni di produzione su larga scala con esigenze di indicizzazione complesse, mentre HNSWlib è ideale per la prototipazione e i casi d'uso più semplici.</p>
<h2 id="Conclusion" class="common-anchor-header">Conclusione<button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p>La ricerca semantica può richiedere molte risorse, quindi la strutturazione interna dei dati, come quella eseguita da HNSW, è essenziale per un recupero più rapido dei dati. Librerie come HNSWlib si preoccupano dell'implementazione, in modo che gli sviluppatori abbiano le ricette pronte per prototipare le funzionalità del vettore. Con poche righe di codice, possiamo costruire il nostro indice ed eseguire ricerche.</p>
<p>HNSWlib è un ottimo modo per iniziare. Tuttavia, se si desidera creare applicazioni di intelligenza artificiale complesse e pronte per la produzione, i database vettoriali appositamente creati sono l'opzione migliore. Per esempio, <a href="https://milvus.io/">Milvus</a> è un database vettoriale open-source con molte caratteristiche enterprise-ready, come la ricerca vettoriale ad alta velocità, la scalabilità, la disponibilità e la flessibilità in termini di tipi di dati e linguaggio di programmazione.</p>
<h2 id="Further-Reading" class="common-anchor-header">Ulteriori letture<button data-href="#Further-Reading" class="anchor-icon" translate="no">
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
<li><p><a href="https://zilliz.com/learn/faiss">Che cos'è Faiss (Facebook AI Similarity Search)? </a></p></li>
<li><p><a href="https://zilliz.com/learn/learn-hnswlib-graph-based-library-for-fast-anns">Che cos'è HNSWlib? Una libreria basata su grafi per la ricerca veloce di RNA </a></p></li>
<li><p><a href="https://zilliz.com/learn/what-is-scann-scalable-nearest-neighbors-google">Che cos'è ScaNN (Scalable Nearest Neighbors)? </a></p></li>
<li><p><a href="https://zilliz.com/vector-database-benchmark-tool?database=ZillizCloud%2CMilvus%2CElasticCloud%2CPgVector%2CPinecone%2CQdrantCloud%2CWeaviateCloud&amp;dataset=medium&amp;filter=none%2Clow%2Chigh&amp;tab=1">VectorDBBench: Uno strumento di benchmark open source per VectorDB</a></p></li>
<li><p><a href="https://zilliz.com/learn/generative-ai">Hub di risorse per l'intelligenza artificiale generativa (Zilliz)</a></p></li>
<li><p><a href="https://zilliz.com/learn/what-is-vector-database">Cosa sono i database vettoriali e come funzionano? </a></p></li>
<li><p><a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">Cos'è il RAG? </a></p></li>
<li><p><a href="https://zilliz.com/ai-models">I modelli AI più performanti per le vostre applicazioni GenAI | Zilliz</a></p></li>
</ul>
