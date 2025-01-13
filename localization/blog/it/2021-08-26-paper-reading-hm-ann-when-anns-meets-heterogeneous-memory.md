---
id: paper-reading-hm-ann-when-anns-meets-heterogeneous-memory.md
title: Paper Reading｜HM-ANN Quando l'ANNS incontra la memoria eterogenea
author: Jigao Luo
date: 2021-08-26T07:18:47.925Z
desc: >-
  HM-ANN Ricerca efficiente dei vicini di un miliardo di punti su memorie
  eterogenee
cover: assets.zilliz.com/blog_cover_4a9807b9e0.png
tag: Engineering
canonicalUrl: >-
  https://zilliz.com/blog/paper-reading-hm-ann-when-anns-meets-heterogeneous-memory
---
<custom-h1>Lettura del documento ｜ HM-ANN: quando l'ANNS incontra la memoria eterogenea</custom-h1><p><a href="https://proceedings.neurips.cc/paper/2020/file/788d986905533aba051261497ecffcbb-Paper.pdf">HM-ANN: Efficient Billion-Point Nearest Neighbor Search on Heterogenous Memory</a> è un lavoro di ricerca accettato alla 2020 Conference on Neural Information Processing Systems<a href="https://nips.cc/Conferences/2020">(NeurIPS 2020</a>). In questo lavoro viene proposto un nuovo algoritmo per la ricerca di similarità basata su grafi, chiamato HM-ANN. Questo algoritmo considera sia l'eterogeneità della memoria sia l'eterogeneità dei dati in un ambiente hardware moderno. HM-ANN consente di effettuare ricerche di similarità su scala miliardaria su una singola macchina senza tecnologie di compressione. La memoria eterogenea (HM) rappresenta la combinazione di una memoria dinamica ad accesso casuale (DRAM) veloce ma piccola e di una memoria persistente (PMem) lenta ma grande. HM-ANN raggiunge una bassa latenza di ricerca e un'elevata precisione di ricerca, soprattutto quando il set di dati non può essere contenuto nella DRAM. L'algoritmo presenta un netto vantaggio rispetto allo stato dell'arte delle soluzioni di ricerca approssimata per vicini (ANN).</p>
<custom-h1>Motivazione</custom-h1><p>Fin dalla loro nascita, gli algoritmi di ricerca ANN hanno posto un compromesso fondamentale tra l'accuratezza della query e la sua latenza, a causa della limitata capacità della DRAM. Per memorizzare gli indici nella DRAM e ottenere un accesso rapido alle query, è necessario limitare il numero di punti dati o memorizzare vettori compressi, entrambi fattori che compromettono l'accuratezza della ricerca. Gli indici basati su grafi (ad esempio Hierarchical Navigable Small World, HNSW) hanno prestazioni superiori in termini di runtime e accuratezza delle query. Tuttavia, questi indici possono anche consumare DRAM a livello di 1-TiB quando operano su dataset di dimensioni miliardarie.</p>
<p>Esistono altre soluzioni per evitare che la DRAM memorizzi i dataset di dimensioni miliardarie in formato raw. Quando un set di dati è troppo grande per essere memorizzato su una singola macchina, si ricorre ad approcci compressi come la quantizzazione del prodotto dei punti del set di dati. Ma il richiamo di questi indici con il dataset compresso è normalmente basso a causa della perdita di precisione durante la quantizzazione. Subramanya et al. [1] hanno esplorato la possibilità di sfruttare le unità a stato solido (SSD) per ottenere una ricerca di RNA su scala miliardaria utilizzando una singola macchina con un approccio chiamato Disk-ANN, in cui il dataset grezzo è memorizzato su SSD e la rappresentazione compressa su DRAM.</p>
<custom-h1>Introduzione alla memoria eterogenea</custom-h1><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/image_32_d26cfa9480.png" alt="1.png" class="doc-image" id="1.png" />
   </span> <span class="img-wrapper"> <span>1.png</span> </span></p>
<p>La memoria eterogenea (HM) rappresenta la combinazione di DRAM veloci ma piccole e PMem lente ma grandi. La DRAM è un normale hardware presente in ogni server moderno e il suo accesso è relativamente veloce. Le nuove tecnologie PMem, come i moduli di memoria persistente Intel® Optane™ DC, colmano il divario tra le memorie flash basate su NAND (SSD) e le DRAM, eliminando il collo di bottiglia dell'I/O. La PMem è durevole come un'unità SSD e direttamente indirizzabile dalla CPU, come la memoria. Renen et al. [2] hanno scoperto che la larghezza di banda in lettura del PMem è inferiore di 2,6 volte e quella in scrittura di 7,5 volte rispetto alla DRAM nell'ambiente sperimentale configurato.</p>
<custom-h1>Progettazione di HM-ANN</custom-h1><p>HM-ANN è un algoritmo di ricerca ANN su scala miliardaria, accurato e veloce, che funziona su una singola macchina senza compressione. Il design di HM-ANN generalizza l'idea di HNSW, la cui struttura gerarchica si adatta naturalmente a HM. HNSW è costituito da più livelli: solo il livello 0 contiene l'intero set di dati, mentre ogni livello rimanente contiene un sottoinsieme di elementi del livello immediatamente inferiore.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_25a1836e8b.png" alt="2.png" class="doc-image" id="2.png" />
   </span> <span class="img-wrapper"> <span>2.png</span> </span></p>
<ul>
<li>Gli elementi dei livelli superiori, che includono solo sottoinsiemi del set di dati, consumano una piccola porzione dell'intero storage. Questa osservazione li rende adatti a essere collocati nella DRAM. In questo modo, si prevede che la maggior parte delle ricerche su HM-ANN avvenga negli strati superiori, massimizzando l'utilizzo della caratteristica di accesso rapido della DRAM. Tuttavia, nel caso di HNSW, la maggior parte delle ricerche avviene nello strato inferiore.</li>
<li>Poiché l'accesso al livello 0 è più lento, è preferibile che ogni query acceda solo a una piccola porzione e che la frequenza di accesso sia ridotta.</li>
</ul>
<h2 id="Graph-Construction-Algorithm" class="common-anchor-header">Algoritmo di costruzione del grafico<button data-href="#Graph-Construction-Algorithm" class="anchor-icon" translate="no">
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
    </button></h2><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_dd9627c753.png" alt="3.png" class="doc-image" id="3.png" />
   </span> <span class="img-wrapper"> <span>3.png</span> </span></p>
<p>L'idea chiave della costruzione di HM-ANN è quella di creare strati superiori di alta qualità, in modo da fornire una migliore navigazione per la ricerca nello strato 0. In questo modo la maggior parte degli accessi alla memoria avviene nella DRAM e l'accesso nella PMem è ridotto. Per rendere possibile questo, l'algoritmo di costruzione di HM-ANN prevede una fase di inserimento top-down e una fase di promozione bottom-up.</p>
<p>La fase di inserimento top-down costruisce un grafo small-world navigabile quando lo strato più basso viene posizionato sul PMem.</p>
<p>La fase di promozione dal basso verso l'alto promuove i punti di rotazione dallo strato inferiore per formare gli strati superiori che vengono collocati sulla DRAM senza perdere molta precisione. Se nel livello 1 viene creata una proiezione di alta qualità degli elementi del livello 0, la ricerca nel livello 0 trova i vicini precisi della query con pochi salti.</p>
<ul>
<li>Invece di utilizzare la selezione casuale di HNSW per la promozione, HM-ANN utilizza una strategia di promozione ad alto grado per promuovere gli elementi con il grado più alto nel livello 0 nel livello 1. Per i livelli superiori, HM-ANN utilizza una strategia di promozione ad alto grado. Per gli strati superiori, HM-ANN promuove i nodi di grado elevato allo strato superiore in base a un tasso di promozione.</li>
<li>HM-ANN promuove un maggior numero di nodi dal livello 0 al livello 1 e stabilisce un numero massimo di vicini per ogni elemento nel livello 1. Il numero di nodi nel livello superiore è di circa 1,5 milioni. Il numero di nodi nei livelli superiori è determinato dallo spazio DRAM disponibile. Poiché il livello 0 non è memorizzato nella DRAM, la densità di ogni livello memorizzato nella DRAM aumenta la qualità della ricerca.</li>
</ul>
<h2 id="Graph-Seach-Algorithm" class="common-anchor-header">Algoritmo di ricerca del grafico<button data-href="#Graph-Seach-Algorithm" class="anchor-icon" translate="no">
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
    </button></h2><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/4_a5a7f29c93.png" alt="4.png" class="doc-image" id="4.png" />
   </span> <span class="img-wrapper"> <span>4.png</span> </span></p>
<p>L'algoritmo di ricerca consiste in due fasi: la ricerca veloce in memoria e la ricerca parallela sul layer-0 con prefetching.</p>
<h3 id="Fast-memory-search" class="common-anchor-header">Ricerca veloce in memoria</h3><p>Come nel caso di HNSW, la ricerca in DRAM inizia dal punto di ingresso nel livello più alto ed esegue una ricerca 1-greedy dall'alto verso il livello 2. Per restringere lo spazio di ricerca nel livello 2, l'algoritmo di ricerca è stato sviluppato in modo tale da poter essere utilizzato per la ricerca di grafici. Per restringere lo spazio di ricerca nel livello 0, HM-ANN esegue la ricerca nel livello 1 con un budget di ricerca di <code translate="no">efSearchL1</code>, che limita la dimensione dell'elenco di candidati nel livello 1. I candidati dell'elenco vengono utilizzati come candidati per la ricerca. I candidati dell'elenco vengono utilizzati come punti di ingresso multipli per la ricerca nel livello 0, per migliorare la qualità della ricerca nel livello 0. Mentre HNSW utilizza un solo punto di ingresso, il divario tra il livello 0 e il livello 1 viene gestito in modo più specifico in HM-ANN rispetto ai divari tra gli altri due livelli.</p>
<h3 id="Parallel-layer-0-search-with-prefetching" class="common-anchor-header">Ricerca parallela nel livello 0 con prefetching</h3><p>Nel livello inferiore, HM-ANN suddivide in modo uniforme i candidati sopra menzionati dalla ricerca nel livello 1 e li considera come punti di ingresso per eseguire una ricerca parallela multi-start 1-greedy con thread. I candidati migliori di ogni ricerca vengono raccolti per trovare i candidati migliori. Come è noto, scendere dal livello 1 al livello 0 equivale a passare alla PMem. La ricerca parallela nasconde la latenza della PMem e sfrutta al meglio la larghezza di banda della memoria, per migliorare la qualità della ricerca senza aumentarne il tempo.</p>
<p>HM-ANN implementa un buffer gestito via software nella DRAM per prefetchare i dati da PMem prima che avvenga l'accesso alla memoria. Durante la ricerca nel livello 1, HM-ANN copia in modo asincrono gli elementi vicini dei candidati in <code translate="no">efSearchL1</code> e le connessioni degli elementi vicini nel livello 1 da PMem al buffer. Quando avviene la ricerca nel livello 0, una parte dei dati da accedere è già preconfigurata nella DRAM, il che nasconde la latenza di accesso alla PMem e porta a tempi di interrogazione più brevi. Ciò corrisponde all'obiettivo del progetto HM-ANN, in cui la maggior parte degli accessi alla memoria avviene nella DRAM e gli accessi alla PMem sono ridotti.</p>
<custom-h1>Valutazione</custom-h1><p>In questo documento viene condotta una valutazione approfondita. Tutti gli esperimenti sono stati eseguiti su una macchina con Intel Xeon Gold 6252 CPU@2.3GHz. Utilizza DDR4 (96 GB) come memoria veloce e Optane DC PMM (1,5 TB) come memoria lenta. Vengono valutati cinque set di dati: BIGANN, DEEP1B, SIFT1M, DEEP1M e GIST1M. Per i test su scala miliardaria, sono stati inclusi i seguenti schemi: metodi basati sulla quantizzazione su scala miliardaria (IMI+OPQ e L&amp;C), metodi non basati sulla compressione (HNSW e NSG).</p>
<h2 id="Billion-scale-algorithm-comparison" class="common-anchor-header">Confronto tra algoritmi su scala miliardaria<button data-href="#Billion-scale-algorithm-comparison" class="anchor-icon" translate="no">
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
    </button></h2><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/5_4297db66a9.png" alt="5.png" class="doc-image" id="5.png" />
   </span> <span class="img-wrapper"> <span>5.png</span> </span></p>
<p>Nella tabella 1 vengono confrontati i tempi di creazione e di memorizzazione dei diversi indici basati sui grafi. HNSW richiede il tempo di creazione più breve e HM-ANN necessita dell'8% di tempo in più rispetto a HNSW. In termini di utilizzo dell'intero spazio di archiviazione, gli indici HM-ANN sono più grandi del 5-13% rispetto a HSNW, perché promuovono più nodi dal livello 0 al livello 1.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/6_f363e64d3f.png" alt="6.png" class="doc-image" id="6.png" />
   </span> <span class="img-wrapper"> <span>6.png</span> </span></p>
<p>Nella Figura 1 vengono analizzate le prestazioni delle query dei diversi indici. Le figure 1 (a) e (b) mostrano che HM-ANN raggiunge il top-1 recall di &gt; 95% entro 1ms. Le figure 1 © e (d) mostrano che HM-ANN ottiene un richiamo top-100 &gt; 90% entro 4 ms. HM-ANN fornisce le migliori prestazioni in termini di latenza e richiamo rispetto a tutti gli altri approcci.</p>
<h2 id="Million-scale-algorithm-comparison" class="common-anchor-header">Confronto tra gli algoritmi su scala millimetrica<button data-href="#Million-scale-algorithm-comparison" class="anchor-icon" translate="no">
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
    </button></h2><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/7_a5c23de240.png" alt="7.png" class="doc-image" id="7.png" />
   </span> <span class="img-wrapper"> <span>7.png</span> </span></p>
<p>Nella Figura 2 vengono analizzate le prestazioni delle query di diversi indici in un ambiente DRAM puro. HNSW, NSG e HM-ANN sono stati valutati con i tre dataset su scala milionaria montati in DRAM. HM-ANN ottiene ancora prestazioni migliori rispetto a HNSW. Il motivo è che il numero totale di calcoli di distanza di HM-ANN è inferiore (in media 850/query) rispetto a quello di HNSW (in media 900/query) per raggiungere l'obiettivo del 99% di richiamo.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/image_33_f99d31f322.png" alt="8.png" class="doc-image" id="8.png" />
   </span> <span class="img-wrapper"> <span>8.png</span> </span></p>
<h2 id="Effectiveness-of-high-degree-promotion" class="common-anchor-header">Efficacia della promozione ad alto grado<button data-href="#Effectiveness-of-high-degree-promotion" class="anchor-icon" translate="no">
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
    </button></h2><p>Nella Figura 3 vengono confrontate le strategie di promozione casuale e di promozione di alto grado nella stessa configurazione. La promozione di alto grado supera la strategia di base. La promozione di alto grado è più veloce di 1,8 volte, 4,3 volte e 3,9 volte rispetto alla promozione casuale per raggiungere rispettivamente gli obiettivi di richiamo del 95%, 99% e 99,5%.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/image_34_3af47e0842.png" alt="10.png" class="doc-image" id="10.png" />
   </span> <span class="img-wrapper"> <span>10.png</span> </span></p>
<h2 id="Performance-benefit-of-memory-management-techniques" class="common-anchor-header">Vantaggi prestazionali delle tecniche di gestione della memoria<button data-href="#Performance-benefit-of-memory-management-techniques" class="anchor-icon" translate="no">
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
    </button></h2><p>La Figura 5 contiene una serie di passaggi tra HNSW e HM-ANN per mostrare come ogni ottimizzazione di HM-ANN contribuisca ai suoi miglioramenti. BP sta per Promozione dal basso verso l'alto durante la costruzione dell'indice. PL0 rappresenta la ricerca parallela a livello 0, mentre DP rappresenta il prefetching dei dati dal PMem alla DRAM. Passo dopo passo, le prestazioni di ricerca di HM-ANN vengono ulteriormente migliorate.</p>
<custom-h1>Conclusione</custom-h1><p>Un nuovo algoritmo di indicizzazione e ricerca basato su grafi, chiamato HM-ANN, mappa il design gerarchico delle RNA a grafi con l'eterogeneità della memoria in HM. Le valutazioni dimostrano che HM-ANN appartiene al nuovo stato dell'arte degli indici in dataset da un miliardo di punti.</p>
<p>Notiamo una tendenza sia nel mondo accademico che in quello industriale, in cui ci si concentra sulla costruzione di indici su dispositivi di memoria persistenti. Per scaricare la pressione della DRAM, Disk-ANN [1] è un indice costruito su SSD, il cui throughput è significativamente inferiore a quello di PMem. Tuttavia, la costruzione di HM-ANN richiede ancora pochi giorni, e non si riscontrano grandi differenze rispetto a Disk-ANN. Riteniamo che sia possibile ottimizzare il tempo di costruzione di HM-ANN, se utilizziamo le caratteristiche di PMem con maggiore attenzione, ad esempio tenendo conto della granularità di PMem (256 Byte) e utilizzando le istruzioni di streaming per bypassare le cacheline. Riteniamo inoltre che in futuro verranno proposti altri approcci con dispositivi di memorizzazione durevoli.</p>
<custom-h1>Riferimento</custom-h1><p>[1]: Suhas Jayaram Subramanya e Devvrit e Rohan Kadekodi e Ravishankar Krishaswamy e Ravishankar Krishaswamy: DiskANN: Fast Accurate Billion-point Nearest Neighbor Search on a Single Node, NIPS, 2019</p>
<p><a href="https://www.microsoft.com/en-us/research/publication/diskann-fast-accurate-billion-point-nearest-neighbor-search-on-a-single-node/">DiskANN: ricerca accurata e veloce dei vicini di casa in miliardi di punti su un singolo nodo - Microsoft Research</a></p>
<p><a href="https://papers.nips.cc/paper/2019/hash/09853c7fb1d3f8ee67a61b6bf4a7f8e6-Abstract.html">DiskANN: ricerca accurata e veloce dei vicini in miliardi di punti su un singolo nodo</a></p>
<p>[2]: Alexander van Renen e Lukas Vogel e Viktor Leis e Thomas Neumann e Alfons Kemper: Persistent Memory I/O Primitives, CoRR &amp; DaMoN, 2019</p>
<p><a href="https://dl.acm.org/doi/abs/10.1145/3329785.3329930">https://dl.acm.org/doi/abs/10.1145/3329785.3329930</a></p>
<p><a href="https://arxiv.org/abs/1904.01614">Primitive di I/O della memoria persistente</a></p>
