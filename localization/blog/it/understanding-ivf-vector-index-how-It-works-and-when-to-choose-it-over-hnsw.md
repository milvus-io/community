---
id: understanding-ivf-vector-index-how-It-works-and-when-to-choose-it-over-hnsw.md
title: >-
  Capire l'indice vettoriale della FIV: Come funziona e quando sceglierlo
  rispetto a HNSW
author: Jack Li
date: 2025-10-27T00:00:00.000Z
cover: assets.zilliz.com/ivf_cover_157df122bc.png
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'IVF, ANN, HNSW, vector index, vector database'
meta_title: How to Choose Between IVF and HNSW for ANN Vector Search
desc: >-
  Scoprite come funziona l'indice vettoriale IVF, come accelera la ricerca ANN e
  quando supera l'HNSW in termini di velocità, memoria ed efficienza di
  filtraggio.
origin: >-
  https://milvus.io/blog/understanding-ivf-vector-index-how-It-works-and-when-to-choose-it-over-hnsw.md
---
<p>In un database vettoriale, spesso abbiamo bisogno di trovare rapidamente i risultati più simili tra vaste collezioni di vettori ad alta dimensione, come le caratteristiche delle immagini, le incorporazioni di testo o le rappresentazioni audio. Senza un indice, l'unica possibilità è quella di confrontare il vettore interrogato con ogni singolo vettore del set di dati. Questa <strong>ricerca bruta</strong> può funzionare quando si hanno poche migliaia di vettori, ma quando si ha a che fare con decine o centinaia di milioni, diventa insopportabilmente lenta e costosa dal punto di vista computazionale.</p>
<p>È qui che entra in gioco la ricerca <strong>per approssimazione dei vicini (ANN)</strong>. Pensate alla ricerca di un libro specifico in un'enorme biblioteca. Invece di controllare tutti i libri uno per uno, si inizia a sfogliare le sezioni che più probabilmente lo contengono. Forse non otterrete gli <em>stessi</em> risultati di una ricerca completa, ma ci andrete molto vicino e in una frazione di tempo. In breve, ANN scambia una leggera perdita di accuratezza con un significativo aumento di velocità e scalabilità.</p>
<p>Tra i molti modi di implementare la ricerca ANN, <strong>IVF (Inverted File)</strong> e <strong>HNSW (Hierarchical Navigable Small World)</strong> sono due dei più utilizzati. Ma IVF si distingue per la sua efficienza e adattabilità nella ricerca vettoriale su larga scala. In questo articolo vi spiegheremo come funziona l'IVF e come si confronta con l'HNSW, in modo che possiate capire i loro compromessi e scegliere quello più adatto al vostro carico di lavoro.</p>
<h2 id="What-is-an-IVF-Vector-Index" class="common-anchor-header">Che cos'è un indice vettoriale IVF?<button data-href="#What-is-an-IVF-Vector-Index" class="anchor-icon" translate="no">
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
    </button></h2><p>L<strong>'IVF (Inverted File)</strong> è uno degli algoritmi più utilizzati per la RNA. Prende in prestito la sua idea di base dall'"indice invertito" utilizzato nei sistemi di recupero dei testi, solo che questa volta, invece di parole e documenti, abbiamo a che fare con vettori in uno spazio ad alta dimensione.</p>
<p>Pensate all'organizzazione di un'enorme biblioteca. Se si scaricasse ogni libro (vettore) in un'unica pila gigante, trovare ciò che serve richiederebbe un'eternità. La FIV risolve questo problema <strong>raggruppando</strong> tutti i vettori in gruppi, o <em>bucket</em>. Ogni bucket rappresenta una "categoria" di vettori simili, definita da un <strong>centroide, una</strong>sorta di riassunto o "etichetta" per tutto ciò che si trova all'interno del cluster.</p>
<p>Quando arriva una richiesta, la ricerca avviene in due fasi:</p>
<p><strong>1. Trovare i cluster più vicini.</strong> Il sistema cerca i pochi cluster i cui centroidi sono più vicini al vettore della query, proprio come se ci si dirigesse direttamente verso le due o tre sezioni della biblioteca in cui è più probabile che si trovi il libro.</p>
<p><strong>2. Cercare all'interno di questi cluster.</strong> Una volta individuate le sezioni giuste, è sufficiente cercare in un piccolo gruppo di libri invece che nell'intera biblioteca.</p>
<p>Questo approccio riduce la quantità di calcoli di ordini di grandezza. Si ottengono comunque risultati molto accurati, ma molto più velocemente.</p>
<h2 id="How-to-Build-an-IVF-Vector-Index" class="common-anchor-header">Come costruire un indice vettoriale FIV<button data-href="#How-to-Build-an-IVF-Vector-Index" class="anchor-icon" translate="no">
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
    </button></h2><p>Il processo di costruzione di un indice vettoriale FIV prevede tre fasi principali: Clustering K-means, assegnazione dei vettori e codifica di compressione (opzionale). Il processo completo è il seguente:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ivf_building_process_90c2966975.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-1-K-means-Clustering" class="common-anchor-header">Fase 1: raggruppamento K-means</h3><p>Per prima cosa, si esegue il clustering k-means sul set di dati X per dividere lo spazio vettoriale ad alta dimensione in nlistelle di cluster. Ogni cluster è rappresentato da un centroide, che viene memorizzato nella tabella dei centroidi C. Il numero di centroidi, nlist, è un iperparametro chiave che determina la granularità del clustering.</p>
<p>Ecco come funziona k-means sotto il cofano:</p>
<ul>
<li><p><strong>Inizializzazione:</strong> Seleziona a caso i vettori <em>nlist</em> come centroidi iniziali.</p></li>
<li><p><strong>Assegnazione:</strong> Per ogni vettore, si calcola la sua distanza da tutti i centroidi e lo si assegna a quello più vicino.</p></li>
<li><p><strong>Aggiornamento:</strong> Per ogni cluster, calcolare la media dei suoi vettori e impostarla come nuovo centroide.</p></li>
<li><p><strong>Iterazione e convergenza:</strong> Ripetere l'assegnazione e l'aggiornamento finché i centroidi non smettono di cambiare in modo significativo o si raggiunge un numero massimo di iterazioni.</p></li>
</ul>
<p>Una volta che k-means converge, i centroidi dell'elenco risultante formano la "directory degli indici" di FIV. Essi definiscono il modo in cui il set di dati è grossolanamente partizionato, consentendo alle query di restringere rapidamente lo spazio di ricerca in un secondo momento.</p>
<p>Ripensiamo all'analogia con la biblioteca: formare i centroidi è come decidere come raggruppare i libri per argomento:</p>
<ul>
<li><p>Un elenco n più grande significa più sezioni, ognuna con un numero inferiore di libri più specifici.</p></li>
<li><p>Un elenco n più piccolo significa un numero inferiore di sezioni, ognuna delle quali copre una gamma più ampia e variegata di argomenti.</p></li>
</ul>
<h3 id="Step-2-Vector-Assignment" class="common-anchor-header">Fase 2: Assegnazione dei vettori</h3><p>Successivamente, ogni vettore viene assegnato al cluster al cui centroide è più vicino, formando liste invertite (List_i). Ogni lista invertita memorizza gli ID e le informazioni di memorizzazione di tutti i vettori che appartengono a quel cluster.</p>
<p>Si può pensare a questa fase come a una sistemazione dei libri nelle rispettive sezioni. Quando si cerca un titolo in un secondo momento, è sufficiente controllare le poche sezioni in cui è più probabile che sia presente, invece di girare per l'intera biblioteca.</p>
<h3 id="Step-3-Compression-Encoding-Optional" class="common-anchor-header">Fase 3: Codifica di compressione (opzionale)</h3><p>Per risparmiare memoria e velocizzare il calcolo, i vettori di ciascun cluster possono essere sottoposti a una codifica di compressione. Esistono due approcci comuni:</p>
<ul>
<li><p><strong>SQ8 (Quantizzazione scalare):</strong> Questo metodo quantizza ogni dimensione di un vettore in 8 bit. Per un vettore standard <code translate="no">float32</code>, ogni dimensione occupa in genere 4 byte. Con SQ8, viene ridotta a un solo byte, ottenendo un rapporto di compressione di 4:1 e mantenendo la geometria del vettore sostanzialmente intatta.</p></li>
<li><p><strong>PQ (Product Quantization):</strong> Suddivide un vettore ad alta dimensione in diversi sottospazi. Ad esempio, un vettore di 128 dimensioni può essere suddiviso in 8 sottovettori di 16 dimensioni ciascuno. In ogni sottospazio viene preaddestrato un piccolo codebook (in genere con 256 voci) e ogni sottovettore è rappresentato da un indice a 8 bit che punta alla voce del codebook più vicina. Ciò significa che il vettore originale 128-D <code translate="no">float32</code> (che richiede 512 byte) può essere rappresentato utilizzando solo 8 byte (8 sottospazi × 1 byte ciascuno), ottenendo un rapporto di compressione 64:1.</p></li>
</ul>
<h2 id="How-to-Use-the-IVF-Vector-Index-for-Search" class="common-anchor-header">Come utilizzare l'indice del vettore FIV per la ricerca<button data-href="#How-to-Use-the-IVF-Vector-Index-for-Search" class="anchor-icon" translate="no">
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
    </button></h2><p>Una volta costruiti la tabella dei centroidi, gli elenchi invertiti, il codificatore di compressione e i codebook (opzionali), l'indice FIV può essere utilizzato per accelerare la ricerca di similarità. Il processo si articola in tre fasi principali, come illustrato di seguito:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ivf_search_process_025d3f444f.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-1-Calculate-distances-from-the-query-vector-to-all-centroids" class="common-anchor-header">Fase 1: Calcolo delle distanze tra il vettore di interrogazione e tutti i centroidi</h3><p>Quando arriva un vettore di query q, il sistema determina innanzitutto a quali cluster è più probabile che appartenga. Quindi, calcola la distanza tra q e ogni centroide nella tabella dei centroidi C, solitamente utilizzando la distanza euclidea o il prodotto interno come metrica di somiglianza. I centroidi vengono quindi ordinati in base alla loro distanza dal vettore dell'interrogazione, producendo un elenco ordinato dal più vicino al più lontano.</p>
<p>Ad esempio, come mostrato nell'illustrazione, l'ordine è: C4 &lt; C2 &lt; C1 &lt; C3 &lt; C5.</p>
<h3 id="Step-2-Select-the-nearest-nprobe-clusters" class="common-anchor-header">Passo 2: Selezionare i cluster nprobe più vicini</h3><p>Per evitare la scansione dell'intero set di dati, IVF cerca solo i cluster <em>nprobe</em> più vicini al vettore di interrogazione.</p>
<p>Il parametro nprobe definisce l'ambito di ricerca e influisce direttamente sull'equilibrio tra velocità e richiamo:</p>
<ul>
<li><p>Un nprobe più piccolo porta a query più veloci ma può ridurre il richiamo.</p></li>
<li><p>Un nprobe più grande migliora il richiamo ma aumenta la latenza.</p></li>
</ul>
<p>Nei sistemi reali, nprobe può essere regolato dinamicamente in base al budget di latenza o ai requisiti di accuratezza. Nell'esempio precedente, se nprobe = 2, il sistema cercherà solo all'interno del cluster 2 e del cluster 4, i due cluster più vicini.</p>
<h3 id="Step-3-Search-the-nearest-neighbor-in-the-selected-clusters" class="common-anchor-header">Fase 3: Ricerca del vicino più prossimo nei cluster selezionati</h3><p>Una volta selezionati i cluster candidati, il sistema confronta il vettore query q con i vettori memorizzati al loro interno. Esistono due modalità principali di confronto:</p>
<ul>
<li><p><strong>Confronto esatto (IVF_FLAT)</strong>: Il sistema recupera i vettori originali dai cluster selezionati e calcola direttamente le loro distanze da q, restituendo i risultati più accurati.</p></li>
<li><p><strong>Confronto approssimativo (IVF_PQ / IVF_SQ8)</strong>: Quando si utilizza la compressione PQ o SQ8, il sistema impiega un <strong>metodo di tabella di ricerca</strong> per accelerare il calcolo della distanza. Prima di iniziare la ricerca, calcola le distanze tra il vettore di interrogazione e ogni voce del codebook. Poi, per ogni vettore, può semplicemente "cercare e sommare" queste distanze precompilate per stimare la somiglianza.</p></li>
</ul>
<p>Infine, i risultati candidati di tutti i cluster ricercati vengono uniti e riordinati, producendo i vettori Top-k più simili come output finale.</p>
<h2 id="IVF-In-Practice" class="common-anchor-header">La FIV in pratica<button data-href="#IVF-In-Practice" class="anchor-icon" translate="no">
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
    </button></h2><p>Una volta compreso come vengono <strong>costruiti</strong> e <strong>ricercati</strong> gli indici vettoriali FIV, il passo successivo è quello di applicarli ai carichi di lavoro reali. In pratica, è spesso necessario bilanciare <strong>prestazioni</strong>, <strong>accuratezza</strong> e <strong>utilizzo della memoria</strong>. Di seguito sono riportate alcune linee guida pratiche tratte dall'esperienza ingegneristica.</p>
<h3 id="How-to-Choose-the-Right-nlist" class="common-anchor-header">Come scegliere il giusto nlist</h3><p>Come già detto, il parametro nlist determina il numero di cluster in cui viene suddiviso l'insieme di dati quando si costruisce un indice FIV.</p>
<ul>
<li><p><strong>Un nlist più grande</strong>: Crea cluster a grana più fine, ovvero ogni cluster contiene meno vettori. In questo modo si riduce il numero di vettori scansionati durante la ricerca e in genere si ottengono query più veloci. Tuttavia, la costruzione dell'indice richiede più tempo e la tabella dei centroidi consuma più memoria.</p></li>
<li><p><strong>Un elenco più piccolo</strong>: Accelera la costruzione dell'indice e riduce il consumo di memoria, ma ogni cluster diventa più "affollato". Ogni query deve scansionare più vettori all'interno di un cluster, il che può portare a colli di bottiglia nelle prestazioni.</p></li>
</ul>
<p>Sulla base di questi compromessi, ecco una regola pratica:</p>
<p>Per i set di dati <strong>su scala milionaria</strong>, un buon punto di partenza è <strong>nlist ≈ √n</strong> (n è il numero di vettori nello shard di dati da indicizzare).</p>
<p>Ad esempio, se si dispone di 1 milione di vettori, provare nlist = 1.000. Per insiemi di dati più grandi - decine o centinaia di milioni - la maggior parte dei database vettoriali suddivide i dati in modo che ogni shard contenga circa un milione di vettori, mantenendo questa regola pratica.</p>
<p>Poiché nlist è fissato al momento della creazione dell'indice, modificarlo in seguito significa ricostruire l'intero indice. Quindi è meglio sperimentare subito. Provate diversi valori, possibilmente in potenze di due (ad esempio, 1024, 2048), per trovare il punto di equilibrio tra velocità, precisione e memoria per il vostro carico di lavoro.</p>
<h3 id="How-to-Tune-nprobe" class="common-anchor-header">Come regolare nprobe</h3><p>Il parametro nprobe controlla il numero di cluster ricercati durante l'interrogazione. Influisce direttamente sul compromesso tra richiamo e latenza.</p>
<ul>
<li><p><strong>Un nprobe più grande</strong>: Copre un maggior numero di cluster, il che comporta un richiamo più elevato, ma anche una maggiore latenza. Il ritardo aumenta generalmente in modo lineare con il numero di cluster cercati.</p></li>
<li><p><strong>Nprobe più piccolo</strong>: Esamina un numero inferiore di cluster, con conseguente riduzione della latenza e velocità delle query. Tuttavia, potrebbe mancare qualche vero vicino, riducendo leggermente il richiamo e l'accuratezza dei risultati.</p></li>
</ul>
<p>Se l'applicazione non è estremamente sensibile alla latenza, è una buona idea sperimentare nprobe in modo dinamico, ad esempio provando valori da 1 a 16 per osservare come cambiano il richiamo e la latenza. L'obiettivo è trovare il punto in cui il richiamo è accettabile e la latenza rimane all'interno dell'intervallo desiderato.</p>
<p>Poiché nprobe è un parametro di ricerca runtime, può essere regolato al volo senza richiedere la ricostruzione dell'indice. Ciò consente una messa a punto rapida, a basso costo e altamente flessibile su diversi carichi di lavoro o scenari di query.</p>
<h3 id="Common-Variants-of-the-IVF-Index" class="common-anchor-header">Varianti comuni dell'indice FIV</h3><p>Quando si costruisce un indice IVF, è necessario decidere se utilizzare la codifica di compressione per i vettori in ogni cluster e, in caso affermativo, quale metodo utilizzare.</p>
<p>Ne derivano tre varianti comuni dell'indice FIV:</p>
<table>
<thead>
<tr><th><strong>Variante FIV</strong></th><th><strong>Caratteristiche principali</strong></th><th><strong>Casi d'uso</strong></th></tr>
</thead>
<tbody>
<tr><td><strong>FIV_FLAT</strong></td><td>Memorizza i vettori grezzi all'interno di ciascun cluster senza compressione. Offre la massima precisione, ma consuma anche la maggior quantità di memoria.</td><td>Ideale per insiemi di dati di medie dimensioni (fino a centinaia di milioni di vettori) in cui è richiesto un richiamo elevato (95%+).</td></tr>
<tr><td><strong>FIV_PQ</strong></td><td>Applica la quantizzazione del prodotto (PQ) per comprimere i vettori all'interno dei cluster. Regolando il rapporto di compressione, è possibile ridurre significativamente l'utilizzo della memoria.</td><td>È adatto per ricerche vettoriali su larga scala (centinaia di milioni o più) in cui è accettabile una certa perdita di precisione. Con un rapporto di compressione di 64:1, il richiamo è tipicamente intorno al 70%, ma può raggiungere il 90% o più abbassando il rapporto di compressione.</td></tr>
<tr><td><strong>IVF_SQ8</strong></td><td>Utilizza la quantizzazione scalare (SQ8) per quantizzare i vettori. L'utilizzo della memoria si colloca tra IVF_FLAT e IVF_PQ.</td><td>Ideale per ricerche vettoriali su larga scala in cui è necessario mantenere un richiamo relativamente alto (90%+) migliorando al contempo l'efficienza.</td></tr>
</tbody>
</table>
<h2 id="IVF-vs-HNSW-Pick-What-Fits" class="common-anchor-header">IVF vs HNSW: scegliete quello che fa per voi<button data-href="#IVF-vs-HNSW-Pick-What-Fits" class="anchor-icon" translate="no">
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
    </button></h2><p>Oltre a IVF, <strong>HNSW (Hierarchical Navigable Small World)</strong> è un altro indice vettoriale in-memory molto utilizzato. La tabella seguente evidenzia le principali differenze tra i due.</p>
<table>
<thead>
<tr><th></th><th><strong>FIV</strong></th><th><strong>HNSW</strong></th></tr>
</thead>
<tbody>
<tr><td><strong>Algoritmo Concetto</strong></td><td>Clustering e bucketing</td><td>Navigazione a grafo multistrato</td></tr>
<tr><td><strong>Utilizzo della memoria</strong></td><td>Relativamente basso</td><td>Relativamente alto</td></tr>
<tr><td><strong>Velocità di creazione dell'indice</strong></td><td>Veloce (richiede solo il clustering)</td><td>Lenta (richiede la costruzione di un grafo multistrato)</td></tr>
<tr><td><strong>Velocità di interrogazione (senza filtro)</strong></td><td>Veloce, dipende da <em>nprobe</em></td><td>Estremamente veloce, ma con complessità logaritmica</td></tr>
<tr><td><strong>Velocità di interrogazione (con filtraggio)</strong></td><td>Stabile - esegue un filtraggio grossolano a livello del centroide per restringere i candidati</td><td>Instabile - soprattutto quando il rapporto di filtraggio è elevato (90%+), il grafo diventa frammentato e può degradare fino a una traversata quasi completa del grafo, persino più lenta della ricerca bruta.</td></tr>
<tr><td><strong>Tasso di richiamo</strong></td><td>Dipende dall'uso della compressione; senza quantizzazione, il richiamo può raggiungere il <strong>95%+.</strong></td><td>Di solito è più alto, intorno al <strong>98%+</strong></td></tr>
<tr><td><strong>Parametri chiave</strong></td><td><em>nlist</em>, <em>nprobe</em></td><td><em>m</em>, <em>ef_construction</em>, <em>ef_search</em></td></tr>
<tr><td><strong>Casi d'uso</strong></td><td>Quando la memoria è limitata, ma sono richieste elevate prestazioni di interrogazione e richiamo; adatto per ricerche con condizioni di filtraggio.</td><td>Quando la memoria è sufficiente e l'obiettivo è un richiamo e prestazioni di interrogazione estremamente elevati, ma il filtraggio non è necessario o il rapporto di filtraggio è basso.</td></tr>
</tbody>
</table>
<p>Nelle applicazioni reali, è molto comune includere condizioni di filtraggio, ad esempio "cercare solo vettori di un utente specifico" o "limitare i risultati a un certo intervallo di tempo". A causa delle differenze negli algoritmi sottostanti, la FIV generalmente gestisce le ricerche filtrate in modo più efficiente di HNSW.</p>
<p>La forza di IVF risiede nel suo processo di filtraggio a due livelli. Può prima eseguire un filtro a grana grossa a livello di centroide (cluster) per restringere rapidamente l'insieme dei candidati, e poi eseguire calcoli di distanza a grana fine all'interno dei cluster selezionati. In questo modo si mantengono prestazioni stabili e prevedibili, anche quando viene filtrata un'ampia porzione di dati.</p>
<p>Al contrario, HNSW si basa sull'attraversamento di un grafo. A causa della sua struttura, non può sfruttare direttamente le condizioni di filtraggio durante l'attraversamento. Quando il rapporto di filtraggio è basso, questo non causa grossi problemi. Tuttavia, quando il rapporto di filtraggio è elevato (ad esempio, più del 90% dei dati viene filtrato), il grafo rimanente diventa spesso frammentato, formando molti "nodi isolati". In questi casi, la ricerca può degradare in una traversata quasi completa del grafo, a volte persino peggiore di una ricerca a forza bruta.</p>
<p>In pratica, gli indici IVF stanno già alimentando molti casi d'uso di grande impatto in diversi domini:</p>
<ul>
<li><p><strong>Ricerca nel commercio elettronico:</strong> Un utente può caricare l'immagine di un prodotto e trovare istantaneamente articoli visivamente simili tra milioni di inserzioni.</p></li>
<li><p><strong>Ricerca di brevetti:</strong> Data una breve descrizione, il sistema è in grado di individuare i brevetti più semanticamente correlati da un'enorme banca dati, in modo molto più efficiente rispetto alla tradizionale ricerca per parole chiave.</p></li>
<li><p><strong>Basi di conoscenza RAG:</strong> L'IVF aiuta a recuperare il contesto più pertinente da milioni di documenti di inquilini, assicurando che i modelli AI generino risposte più accurate e fondate.</p></li>
</ul>
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
    </button></h2><p>Per scegliere l'indice giusto, tutto dipende dal vostro caso d'uso specifico. Se si lavora con set di dati di grandi dimensioni o se è necessario supportare ricerche filtrate, l'IVF può essere la soluzione migliore. Rispetto agli indici basati su grafi come HNSW, IVF offre una costruzione più rapida dell'indice, un minore utilizzo della memoria e un forte equilibrio tra velocità e precisione.</p>
<p><a href="https://milvus.io/">Milvus</a>, il database vettoriale open source più diffuso, fornisce il supporto completo per l'intera famiglia IVF, compresi IVF_FLAT, IVF_PQ e IVF_SQ8. È possibile sperimentare facilmente questi tipi di indici e trovare la configurazione più adatta alle proprie esigenze di prestazioni e di memoria. Per un elenco completo degli indici supportati da Milvus, consultare la <a href="https://milvus.io/docs/index-explained.md">pagina del documento Milvus Index</a>.</p>
<p>Se state costruendo ricerche di immagini, sistemi di raccomandazione o basi di conoscenza RAG, provate l'indicizzazione IVF in Milvus e scoprite come funziona una ricerca vettoriale efficiente e su larga scala.</p>
