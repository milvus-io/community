---
id: >-
  introducing-aisaq-in-milvus-billion-scale-vector-search-got-3200-cheaper-on-memory.md
title: >-
  Introduzione di AISAQ in Milvus: la ricerca vettoriale su scala miliardaria è
  appena diventata più economica di 3.200 volte sulla memoria
author: Martin Li
date: 2025-12-10T00:00:00.000Z
cover: assets.zilliz.com/AISAQ_Cover_66b628b762.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus2.6, AISAQ, DISKANN, vector search'
meta_title: |
  AISAQ in Milvus Cuts Memory 3,200× for Billion-Scale Search
desc: >-
  Scoprite come Milvus riduce i costi di memoria di 3200× con AISAQ, consentendo
  la ricerca scalabile di miliardi di vettori senza l'overhead della DRAM.
origin: >-
  https://milvus.io/blog/introducing-aisaq-in-milvus-billion-scale-vector-search-got-3200-cheaper-on-memory.md
---
<p>I database vettoriali sono diventati l'infrastruttura principale dei sistemi di intelligenza artificiale mission-critical e i loro volumi di dati crescono in modo esponenziale, spesso raggiungendo miliardi di vettori. A questa scala, tutto diventa più difficile: mantenere una bassa latenza, preservare l'accuratezza, garantire l'affidabilità e operare attraverso repliche e regioni. Ma una sfida tende a emergere presto e a dominare le decisioni architettoniche: il costo<strong>.</strong></p>
<p>Per garantire una ricerca veloce, la maggior parte dei database vettoriali mantiene le strutture di indicizzazione chiave nella DRAM (Dynamic Random Access Memory), il livello di memoria più veloce e più costoso. Questo design è efficace per le prestazioni, ma è poco scalabile. L'utilizzo della DRAM varia in base alle dimensioni dei dati piuttosto che al traffico delle query e, anche con la compressione o l'offloading parziale su SSD, gran parte dell'indice deve rimanere in memoria. Quando i dataset crescono, i costi della memoria diventano rapidamente un fattore limitante.</p>
<p>Milvus supporta già <strong>DISKANN</strong>, un approccio ANN basato su disco che riduce la pressione sulla memoria spostando gran parte dell'indice su SSD. Tuttavia, DISKANN si affida ancora alla DRAM per le rappresentazioni compresse utilizzate durante la ricerca. <a href="https://milvus.io/docs/release_notes.md#v264">Milvus 2.6</a> si spinge oltre con <a href="https://milvus.io/docs/aisaq.md">AISAQ</a>, un indice vettoriale basato su disco ispirato a <a href="https://milvus.io/docs/diskann.md">DISKANN</a>. Sviluppata da KIOXIA, l'architettura di AiSAQ è stata progettata con una "Zero-DRAM-Footprint Architecture", che memorizza tutti i dati critici per la ricerca su disco e ottimizza la collocazione dei dati per ridurre al minimo le operazioni di I/O. In un carico di lavoro di un miliardo di vettori, questo riduce l'uso della memoria da <strong>32 GB a circa 10 MB, con una</strong> <strong>riduzione di 3.200 volte, pur</strong>mantenendo prestazioni pratiche.</p>
<p>Nelle sezioni che seguono spieghiamo come funziona la ricerca vettoriale basata su grafi, da dove derivano i costi di memoria e come AISAQ ridisegna la curva dei costi per la ricerca vettoriale su scala miliardaria.</p>
<h2 id="How-Conventional-Graph-Based-Vector-Search-Works" class="common-anchor-header">Come funziona la ricerca vettoriale convenzionale basata sui grafi<button data-href="#How-Conventional-Graph-Based-Vector-Search-Works" class="anchor-icon" translate="no">
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
    </button></h2><p>La<strong>ricerca vettoriale</strong> è il processo di ricerca dei punti di dati le cui rappresentazioni numeriche sono le più vicine a un'interrogazione in uno spazio ad alta dimensionalità. Per "più vicino" si intende semplicemente la distanza minore secondo una funzione di distanza, come la distanza coseno o la distanza L2. Su piccola scala, questo è semplice: si calcola la distanza tra l'interrogazione e ogni vettore, quindi si restituiscono quelli più vicini. Tuttavia, su larga scala, ad esempio su scala miliardaria, questo approccio diventa rapidamente troppo lento per essere pratico.</p>
<p>Per evitare confronti esaustivi, i moderni sistemi di ricerca approssimata del vicino (ANNS) si basano su <strong>indici basati su grafi</strong>. Invece di confrontare una query con ogni vettore, l'indice organizza i vettori in un <strong>grafo</strong>. Ogni nodo rappresenta un vettore e gli spigoli collegano vettori numericamente vicini. Questa struttura consente al sistema di restringere notevolmente lo spazio di ricerca.</p>
<p>Il grafo viene costruito in anticipo, basandosi esclusivamente sulle relazioni tra i vettori. Non dipende dalle interrogazioni. Quando arriva una richiesta, il compito del sistema è quello di <strong>navigare nel grafo in modo efficiente</strong> e identificare i vettori con la distanza minore dalla richiesta, senza scansionare l'intero set di dati.</p>
<p>La ricerca inizia da un <strong>punto di ingresso</strong> predefinito nel grafo. Questo punto di partenza può essere lontano dalla query, ma l'algoritmo migliora la sua posizione passo dopo passo, spostandosi verso vettori che appaiono più vicini alla query. Durante questo processo, la ricerca mantiene due strutture di dati interne che lavorano insieme: un <strong>elenco di candidati</strong> e un <strong>elenco di risultati</strong>.</p>
<p>Le due fasi più importanti di questo processo sono l'espansione dell'elenco dei candidati e l'aggiornamento dell'elenco dei risultati.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/whiteboard_exported_image_84f8324275.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Expanding-the-Candidate-List" class="common-anchor-header">Espansione dell'elenco dei candidati</h3><p>L'<strong>elenco dei candidati</strong> rappresenta la prossima tappa della ricerca. È un insieme prioritario di nodi del grafo che appaiono promettenti in base alla loro distanza dalla query.</p>
<p>A ogni iterazione, l'algoritmo:</p>
<ul>
<li><p><strong>Seleziona il candidato più vicino scoperto finora.</strong> Dall'elenco dei candidati, sceglie il vettore con la distanza minore dall'interrogazione.</p></li>
<li><p><strong>Recupera i vicini di questo vettore dal grafo.</strong> Questi vicini sono vettori che sono stati identificati durante la costruzione dell'indice come vicini al vettore corrente.</p></li>
<li><p><strong>Valuta i vicini non visitati e li aggiunge all'elenco dei candidati.</strong> Per ogni vicino che non è già stato esplorato, l'algoritmo calcola la sua distanza dalla query. I vicini visitati in precedenza vengono saltati, mentre quelli nuovi vengono inseriti nell'elenco dei candidati se sembrano promettenti.</p></li>
</ul>
<p>Espandendo ripetutamente l'elenco dei candidati, la ricerca esplora regioni sempre più rilevanti del grafo. Questo permette all'algoritmo di muoversi costantemente verso risposte migliori, esaminando solo una piccola frazione di tutti i vettori.</p>
<h3 id="Updating-the-Result-List" class="common-anchor-header">Aggiornamento dell'elenco dei risultati</h3><p>Allo stesso tempo, l'algoritmo mantiene un <strong>elenco di risultati</strong>, che registra i migliori candidati trovati finora per l'output finale. Man mano che la ricerca procede, l'algoritmo</p>
<ul>
<li><p><strong>Traccia i vettori più vicini incontrati durante l'attraversamento.</strong> Questi includono i vettori selezionati per l'espansione e altri valutati lungo il percorso.</p></li>
<li><p><strong>Memorizza le loro distanze dalla query.</strong> In questo modo è possibile classificare i candidati e mantenere l'attuale top-K dei più vicini.</p></li>
</ul>
<p>Nel corso del tempo, man mano che si valutano più candidati e si trovano meno miglioramenti, l'elenco dei risultati si stabilizza. Quando è improbabile che un'ulteriore esplorazione del grafo produca vettori più vicini, la ricerca termina e restituisce l'elenco dei risultati come risposta finale.</p>
<p>In parole povere, l'<strong>elenco</strong> dei <strong>candidati controlla l'esplorazione</strong>, mentre l'<strong>elenco dei risultati cattura le migliori risposte scoperte finora</strong>.</p>
<h2 id="The-Trade-Off-in-Graph-Based-Vector-Search" class="common-anchor-header">Il compromesso nella ricerca vettoriale basata su grafi<button data-href="#The-Trade-Off-in-Graph-Based-Vector-Search" class="anchor-icon" translate="no">
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
    </button></h2><p>L'approccio basato sul grafo è ciò che rende la ricerca vettoriale su larga scala pratica in primo luogo. Navigando nel grafo invece di scansionare ogni vettore, il sistema può trovare risultati di alta qualità toccando solo una piccola frazione del set di dati.</p>
<p>Tuttavia, questa efficienza non è gratuita. La ricerca basata su grafi espone un compromesso fondamentale tra <strong>accuratezza e costi.</strong></p>
<ul>
<li><p>L'esplorazione di un maggior numero di vicini migliora l'accuratezza coprendo una porzione più ampia del grafo e riducendo la possibilità di perdere i veri vicini.</p></li>
<li><p>Allo stesso tempo, ogni espansione aggiuntiva aggiunge lavoro: più calcoli di distanza, più accessi alla struttura del grafo e più letture di dati vettoriali. Man mano che la ricerca si approfondisce o si allarga, questi costi si accumulano. A seconda di come è stato progettato l'indice, questi costi si manifestano come un maggiore utilizzo della CPU, una maggiore pressione sulla memoria o un maggiore I/O su disco.</p></li>
</ul>
<p>Il bilanciamento di queste forze contrapposte, tra un elevato richiamo e un uso efficiente delle risorse, è fondamentale per la progettazione di ricerche basate su grafi.</p>
<p>Sia <a href="https://milvus.io/blog/diskann-explained.md"><strong>DISKANN</strong></a> che <strong>AISAQ</strong> sono costruiti intorno a questa stessa tensione, ma fanno scelte architettoniche diverse su come e dove vengono pagati questi costi.</p>
<h2 id="How-DISKANN-Optimizes-Disk-Based-Vector-Search" class="common-anchor-header">Come DISKANN ottimizza la ricerca vettoriale su disco<button data-href="#How-DISKANN-Optimizes-Disk-Based-Vector-Search" class="anchor-icon" translate="no">
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
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/DISKANN_9c9c6a734f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>DISKANN è la soluzione ANN basata su disco più influente finora e funge da base ufficiale per la competizione NeurIPS Big ANN, un benchmark globale per la ricerca vettoriale su scala miliardaria. La sua importanza non risiede solo nelle prestazioni, ma in ciò che ha dimostrato: la <strong>ricerca ANN basata su grafi non deve vivere interamente in memoria per essere veloce</strong>.</p>
<p>Combinando l'archiviazione basata su SSD con strutture in memoria accuratamente scelte, DISKANN ha dimostrato che la ricerca vettoriale su larga scala può raggiungere un'elevata accuratezza e una bassa latenza su hardware commodity, senza richiedere ingombri massicci di DRAM. Ciò avviene ripensando <em>quali parti della ricerca devono essere veloci</em> e <em>quali possono tollerare un accesso più lento</em>.</p>
<p><strong>Ad alto livello, DISKANN mantiene in memoria i dati a cui si accede più frequentemente, spostando su disco le strutture più grandi e a cui si accede meno frequentemente.</strong> Questo equilibrio si ottiene grazie a diverse scelte progettuali fondamentali.</p>
<h3 id="1-Using-PQ-Distances-to-Expand-the-Candidate-List" class="common-anchor-header">1. Uso delle distanze PQ per espandere l'elenco dei candidati</h3><p>L'espansione dell'elenco dei candidati è l'operazione più frequente nella ricerca a grafo. Ogni espansione richiede la stima della distanza tra il vettore della query e i vicini di un nodo candidato. L'esecuzione di questi calcoli utilizzando vettori completi ad alta dimensione richiederebbe frequenti letture casuali dal disco, un'operazione costosa sia dal punto di vista computazionale che dell'I/O. DISKANN evita questo costo.</p>
<p>DISKANN evita questo costo comprimendo i vettori in <strong>codici di quantizzazione del prodotto (PQ)</strong> e mantenendoli in memoria. I codici PQ sono molto più piccoli dei vettori completi, ma conservano comunque informazioni sufficienti per stimare approssimativamente la distanza.</p>
<p>Durante l'espansione dei candidati, DISKANN calcola le distanze usando questi codici PQ in memoria invece di leggere i vettori completi dall'SSD. Questo riduce drasticamente l'I/O su disco durante l'attraversamento del grafo, consentendo alla ricerca di espandere i candidati in modo rapido ed efficiente, mantenendo la maggior parte del traffico SSD fuori dal percorso critico.</p>
<h3 id="2-Co-Locating-Full-Vectors-and-Neighbor-Lists-on-Disk" class="common-anchor-header">2. Co-localizzazione dei vettori completi e degli elenchi di vicini su disco</h3><p>Non tutti i dati possono essere compressi o accessibili in modo approssimativo. Una volta identificati i candidati promettenti, la ricerca ha ancora bisogno di accedere a due tipi di dati per ottenere risultati accurati:</p>
<ul>
<li><p><strong>Elenchi di vicini</strong>, per continuare l'attraversamento del grafo.</p></li>
<li><p><strong>Vettori completi (non compressi)</strong>, per il reranking finale.</p></li>
</ul>
<p>Queste strutture sono accessibili meno frequentemente dei codici PQ, quindi DISKANN le memorizza su SSD. Per ridurre al minimo l'overhead del disco, DISKANN colloca l'elenco dei vicini di ogni nodo e il suo vettore completo nella stessa regione fisica del disco. Ciò garantisce che una singola lettura su SSD possa recuperare entrambi.</p>
<p>Grazie alla co-localizzazione dei dati correlati, DISKANN riduce il numero di accessi casuali al disco necessari durante la ricerca. Questa ottimizzazione migliora l'efficienza dell'espansione e del reranking, soprattutto su larga scala.</p>
<h3 id="3-Parallel-Node-Expansion-for-Better-SSD-Utilization" class="common-anchor-header">3. Espansione parallela dei nodi per un migliore utilizzo dell'SSD</h3><p>La ricerca di RNA basate su grafi è un processo iterativo. Se ogni iterazione espande un solo nodo candidato, il sistema esegue una sola lettura del disco alla volta, lasciando inutilizzata la maggior parte della larghezza di banda parallela dell'SSD. Per evitare questa inefficienza, DISKANN espande più candidati in ogni iterazione e invia richieste di lettura parallele all'SSD. Questo approccio sfrutta molto meglio la larghezza di banda disponibile e riduce il numero totale di iterazioni necessarie.</p>
<p>Il parametro <strong>beam_width_ratio</strong> controlla il numero di candidati espansi in parallelo: <strong>Larghezza del fascio = numero di core della CPU × beam_width_ratio.</strong> Un rapporto più alto allarga la ricerca, potenzialmente migliorando l'accuratezza, ma aumenta anche il calcolo e l'I/O su disco.</p>
<p>Per compensare questo problema, DISKANN introduce un <code translate="no">search_cache_budget_gb_ratio</code> che riserva la memoria per memorizzare nella cache i dati a cui si accede di frequente, riducendo le letture ripetute sull'SSD. Insieme, questi meccanismi aiutano DISKANN a trovare un equilibrio tra precisione, latenza ed efficienza I/O.</p>
<h3 id="Why-This-Matters--and-Where-the-Limits-Appear" class="common-anchor-header">Perché questo è importante e dove appaiono i limiti</h3><p>Il design di DISKANN rappresenta un importante passo avanti per la ricerca vettoriale su disco. Mantenendo i codici PQ in memoria e spingendo le strutture più grandi su SSD, riduce significativamente l'ingombro in memoria rispetto agli indici a grafo completamente in-memory.</p>
<p>Allo stesso tempo, questa architettura dipende ancora dalla <strong>DRAM sempre attiva</strong> per i dati critici per la ricerca. I codici PQ, le cache e le strutture di controllo devono rimanere in memoria per mantenere efficiente l'attraversamento. Quando i set di dati crescono fino a miliardi di vettori e le implementazioni aggiungono repliche o regioni, questo requisito di memoria può ancora diventare un fattore limitante.</p>
<p>Questa è la lacuna che <strong>AISAQ</strong> è stato progettato per colmare.</p>
<h2 id="How-AISAQ-Works-and-Why-It-Matters" class="common-anchor-header">Come funziona AISAQ e perché è importante<button data-href="#How-AISAQ-Works-and-Why-It-Matters" class="anchor-icon" translate="no">
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
    </button></h2><p>AISAQ si basa direttamente sulle idee alla base di DISKANN, ma introduce un cambiamento fondamentale: elimina la <strong>necessità di mantenere i dati PQ nella DRAM</strong>. Invece di trattare i vettori compressi come strutture critiche per la ricerca e sempre in memoria, AISAQ li sposta su SSD e riprogetta il modo in cui i dati del grafo sono disposti su disco per preservare un'attraversamento efficiente.</p>
<p>Per far sì che questo funzioni, AISAQ riorganizza lo storage dei nodi in modo che i dati necessari durante la ricerca sul grafo - vettori completi, elenchi di vicini e informazioni PQ - siano disposti su disco secondo schemi ottimizzati per la localizzazione degli accessi. L'obiettivo non è solo quello di spostare più dati sul disco più economico, ma di farlo <strong>senza interrompere il processo di ricerca descritto in precedenza</strong>.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/AISAQ_244e661794.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Per rispondere alle diverse esigenze applicative, AISAQ offre due modalità di archiviazione su disco: Performance e Scale. Da un punto di vista tecnico, queste modalità differiscono principalmente per il modo in cui i dati compressi in PQ vengono memorizzati e a cui si accede durante la ricerca. Dal punto di vista applicativo, queste modalità rispondono a due tipi distinti di requisiti: requisiti di bassa latenza, tipici della ricerca semantica online e dei sistemi di raccomandazione, e requisiti di altissima scala, tipici del RAG.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/aisaq_vs_diskann_35ebee3c64.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="AISAQ-performance-Optimized-for-Speed" class="common-anchor-header">Prestazioni di AISAQ: Ottimizzato per la velocità</h3><p>AISAQ-performance conserva tutti i dati su disco mantenendo un basso overhead di I/O grazie alla colocazione dei dati.</p>
<p>In questa modalità:</p>
<ul>
<li><p>Il vettore completo di ogni nodo, l'elenco dei bordi e i codici PQ dei suoi vicini sono memorizzati insieme su disco.</p></li>
<li><p>La visita di un nodo richiede comunque una sola <strong>lettura dell'SSD</strong>, perché tutti i dati necessari per l'espansione e la valutazione dei candidati sono colocalizzati.</p></li>
</ul>
<p>Dal punto di vista dell'algoritmo di ricerca, questo rispecchia fedelmente il modello di accesso di DISKANN. L'espansione dei candidati rimane efficiente e le prestazioni di runtime sono paragonabili, anche se tutti i dati critici per la ricerca si trovano ora su disco.</p>
<p>Il compromesso è l'overhead di memorizzazione. Poiché i dati PQ di un vicino possono apparire nelle pagine del disco di più nodi, questa disposizione introduce ridondanza e aumenta significativamente la dimensione complessiva dell'indice.</p>
<p>Pertanto, la modalità AISAQ-Performance privilegia una bassa latenza di I/O rispetto all'efficienza del disco. Dal punto di vista applicativo, la modalità AiSAQ-Performance può garantire una latenza dell'ordine di 10 mSec, come richiesto per la ricerca semantica online.</p>
<h3 id="AISAQ-scale-Optimized-for-Storage-Efficiency" class="common-anchor-header">Scala AISAQ: Ottimizzato per l'efficienza dello storage</h3><p>AISAQ-Scale adotta l'approccio opposto. È stato progettato per <strong>ridurre al minimo l'utilizzo del disco</strong>, pur mantenendo tutti i dati su SSD.</p>
<p>In questa modalità:</p>
<ul>
<li><p>I dati PQ vengono archiviati su disco separatamente, senza ridondanza.</p></li>
<li><p>Questo elimina la ridondanza e riduce drasticamente le dimensioni dell'indice.</p></li>
</ul>
<p>Il compromesso è che l'accesso ai codici PQ di un nodo e dei suoi vicini può richiedere <strong>più letture su SSD</strong>, aumentando le operazioni di I/O durante l'espansione dei candidati. Se non ottimizzato, questo rallenterebbe notevolmente la ricerca.</p>
<p>Per controllare questo overhead, la modalità AISAQ-Scale introduce due ottimizzazioni aggiuntive:</p>
<ul>
<li><p><strong>Riorganizzazione dei dati PQ</strong>, che ordina i vettori PQ in base alla priorità di accesso per migliorare la localizzazione e ridurre le letture casuali.</p></li>
<li><p>Una <strong>cache PQ nella DRAM</strong> (<code translate="no">pq_read_page_cache_size</code>), che memorizza i dati PQ a cui si accede di frequente ed evita letture ripetute del disco per le voci calde.</p></li>
</ul>
<p>Con queste ottimizzazioni, la modalità AISAQ-Scale raggiunge un'efficienza di memorizzazione molto migliore di AISAQ-Performance, pur mantenendo prestazioni di ricerca pratiche. Le prestazioni rimangono inferiori a quelle di DISKANN, ma non c'è sovraccarico di memoria (la dimensione dell'indice è simile a quella di DISKANN) e l'ingombro della memoria è nettamente inferiore. Dal punto di vista applicativo, AiSAQ fornisce i mezzi per soddisfare i requisiti RAG su scala ultraelevata.</p>
<h3 id="Key-Advantages-of-AISAQ" class="common-anchor-header">Vantaggi principali di AISAQ</h3><p>Spostando tutti i dati critici per la ricerca su disco e riprogettando le modalità di accesso a tali dati, AISAQ cambia radicalmente il profilo di costo e scalabilità della ricerca vettoriale a grafo. Il suo design offre tre vantaggi significativi.</p>
<p><strong>1. Utilizzo della DRAM fino a 3.200 volte inferiore</strong></p>
<p>La quantizzazione del prodotto riduce in modo significativo le dimensioni dei vettori ad alta dimensionalità, ma su scala miliardaria l'ingombro in memoria è ancora notevole. Anche dopo la compressione, i codici PQ devono essere mantenuti in memoria durante la ricerca nei progetti convenzionali.</p>
<p>Per esempio, su <strong>SIFT1B</strong>, un benchmark con un miliardo di vettori a 128 dimensioni, i soli codici PQ richiedono circa <strong>30-120 GB di DRAM</strong>, a seconda della configurazione. La memorizzazione dei vettori completi non compressi richiederebbe altri <strong> 480 GB</strong>. Sebbene PQ riduca l'uso della memoria di 4-16×, l'ingombro rimanente è ancora abbastanza grande da dominare il costo dell'infrastruttura.</p>
<p>AISAQ elimina completamente questo requisito. Memorizzando i codici PQ su SSD anziché su DRAM, la memoria non viene più consumata dai dati persistenti dell'indice. La DRAM viene utilizzata solo per strutture leggere e transitorie, come gli elenchi di candidati e i metadati di controllo. In pratica, questo riduce l'utilizzo della memoria da decine di gigabyte a <strong>circa 10 MB</strong>. In una configurazione rappresentativa su scala miliardaria, la DRAM passa da <strong>32 GB a 10 MB</strong>, con una <strong>riduzione di 3.200 volte</strong>.</p>
<p>Dato che lo storage SSD costa circa <strong>1/30 del prezzo per unità di capacità</strong> rispetto alla DRAM, questo cambiamento ha un impatto diretto e drammatico sul costo totale del sistema.</p>
<p><strong>2. Nessun sovraccarico di I/O aggiuntivo</strong></p>
<p>Lo spostamento dei codici PQ dalla memoria al disco normalmente aumenta il numero di operazioni di I/O durante la ricerca. AISAQ evita questo problema controllando attentamente <strong>la disposizione dei dati e i modelli di accesso</strong>. Invece di disperdere i dati correlati sul disco, AISAQ co-loca i codici PQ, i vettori completi e gli elenchi di vicini in modo che possano essere recuperati insieme. Ciò garantisce che l'espansione dei candidati non introduca letture casuali aggiuntive.</p>
<p>Per consentire agli utenti di controllare il compromesso tra dimensione dell'indice ed efficienza I/O, AISAQ introduce il parametro <code translate="no">inline_pq</code>, che determina la quantità di dati PQ memorizzati in linea con ciascun nodo:</p>
<ul>
<li><p><strong>Inline_pq più basso:</strong> dimensione dell'indice più piccola, ma può richiedere I/O aggiuntivo</p></li>
<li><p><strong>Inline_pq più alto:</strong> dimensione dell'indice maggiore, ma preserva l'accesso a lettura singola.</p></li>
</ul>
<p>Quando è configurato con <strong>inline_pq = max_degree</strong>, AISAQ legge il vettore completo di un nodo, l'elenco dei vicini e tutti i codici PQ in un'unica operazione su disco, rispettando il modello di I/O di DISKANN e mantenendo tutti i dati su SSD.</p>
<p><strong>3. L'accesso sequenziale ai PQ migliora l'efficienza di calcolo</strong></p>
<p>In DISKANN, l'espansione di un nodo candidato richiede R accessi casuali alla memoria per recuperare i codici PQ dei suoi R vicini. AISAQ elimina questa casualità recuperando tutti i codici PQ in un unico I/O e memorizzandoli in sequenza su disco.</p>
<p>Il layout sequenziale offre due importanti vantaggi:</p>
<ul>
<li><p><strong>Le letture sequenziali su SSD sono molto più veloci</strong> delle letture casuali sparse.</p></li>
<li><p><strong>I dati contigui sono più adatti alla cache</strong>, consentendo alle CPU di calcolare le distanze PQ in modo più efficiente.</p></li>
</ul>
<p>Questo migliora sia la velocità che la prevedibilità dei calcoli delle distanze PQ e aiuta a compensare il costo delle prestazioni della memorizzazione dei codici PQ su SSD piuttosto che su DRAM.</p>
<h2 id="AISAQ-vs-DISKANN-Performance-Evaluation" class="common-anchor-header">AISAQ vs. DISKANN: valutazione delle prestazioni<button data-href="#AISAQ-vs-DISKANN-Performance-Evaluation" class="anchor-icon" translate="no">
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
    </button></h2><p>Dopo aver compreso come AISAQ differisce architettonicamente da DISKANN, la domanda successiva è semplice: <strong>come influiscono queste scelte progettuali sulle prestazioni e sull'utilizzo delle risorse nella pratica?</strong> Questa valutazione confronta AISAQ e DISKANN su tre dimensioni che contano di più su scala miliardaria: <strong>prestazioni di ricerca, consumo di memoria e utilizzo del disco</strong>.</p>
<p>In particolare, esaminiamo il comportamento di AISAQ al variare della quantità di dati PQ inline (<code translate="no">INLINE_PQ</code>). Questo parametro controlla direttamente il compromesso tra dimensione dell'indice, I/O su disco ed efficienza di runtime. Valutiamo inoltre entrambi gli approcci su <strong>carichi di lavoro vettoriali a bassa e alta dimensione, poiché la dimensionalità influenza fortemente il costo del calcolo della distanza e i</strong> requisiti di memorizzazione.</p>
<h3 id="Setup" class="common-anchor-header">Configurazione</h3><p>Tutti gli esperimenti sono stati condotti su un sistema a singolo nodo per isolare il comportamento dell'indice ed evitare l'interferenza degli effetti della rete o del sistema distribuito.</p>
<p><strong>Configurazione hardware:</strong></p>
<ul>
<li><p>CPU: CPU Intel® Xeon® Platinum 8375C @ 2,90GHz</p></li>
<li><p>Memoria: Velocità: 3200 MT/s, Tipo: DDR4, Dimensione: 32 GB</p></li>
<li><p>Disco: 500 GB NVMe SSD</p></li>
</ul>
<p><strong>Parametri di creazione dell'indice</strong></p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;max_degree&quot;</span>: <span class="hljs-number">48</span>,
  <span class="hljs-string">&quot;search_list_size&quot;</span>: <span class="hljs-number">100</span>,
  <span class="hljs-string">&quot;inline_pq&quot;</span>: <span class="hljs-number">0</span>/<span class="hljs-number">12</span>/<span class="hljs-number">24</span>/<span class="hljs-number">48</span>,  <span class="hljs-comment">// AiSAQ only</span>
  <span class="hljs-string">&quot;pq_code_budget_gb_ratio&quot;</span>: <span class="hljs-number">0.125</span>,
  <span class="hljs-string">&quot;search_cache_budget_gb_ratio&quot;</span>: <span class="hljs-number">0.0</span>,
  <span class="hljs-string">&quot;build_dram_budget_gb&quot;</span>: <span class="hljs-number">32.0</span>
}
<button class="copy-code-btn"></button></code></pre>
<p><strong>Parametri di interrogazione</strong></p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;k&quot;</span>: <span class="hljs-number">100</span>,
  <span class="hljs-string">&quot;search_list_size&quot;</span>: <span class="hljs-number">100</span>,
  <span class="hljs-string">&quot;beamwidth&quot;</span>: <span class="hljs-number">8</span>
}
<button class="copy-code-btn"></button></code></pre>
<h3 id="Benchmark-Method" class="common-anchor-header">Metodo di benchmark</h3><p>Sia DISKANN che AISAQ sono stati testati utilizzando <a href="https://milvus.io/docs/knowhere.md">Knowhere</a>, il motore di ricerca vettoriale open-source utilizzato in Milvus. Per questa valutazione sono stati utilizzati due set di dati:</p>
<ul>
<li><p><strong>SIFT128D (1M di vettori):</strong> un noto benchmark a 128 dimensioni comunemente utilizzato per la ricerca di descrittori di immagini. <em>(Dimensione del dataset grezzo ≈ 488 MB)</em></p></li>
<li><p><strong>Cohere768D (1M vettori):</strong> un set di incorporazione a 768 dimensioni tipico della ricerca semantica basata su trasformatori. <em>(Dimensione del dataset grezzo ≈ 2930 MB)</em></p></li>
</ul>
<p>Questi set di dati riflettono due distinti scenari del mondo reale: caratteristiche visive compatte e grandi incorporazioni semantiche.</p>
<h3 id="Results" class="common-anchor-header">Risultati</h3><p><strong>Sift128D1M (vettore completo ~488MB)</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/aisaq_53da7b566a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Cohere768D1M (vettore completo ~2930MB)</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Cohere768_D1_M_8dfa3dffb7.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Analysis" class="common-anchor-header">Analisi</h3><p><strong>Set di dati SIFT128D</strong></p>
<p>Sul set di dati SIFT128D, AISAQ è in grado di eguagliare le prestazioni di DISKANN quando tutti i dati PQ sono inseriti in linea, in modo che i dati richiesti da ciascun nodo si inseriscano interamente in una singola pagina SSD da 4 KB (INLINE_PQ = 48). Con questa configurazione, tutte le informazioni necessarie per la ricerca sono collocate:</p>
<ul>
<li><p>Vettore completo: 512B</p></li>
<li><p>Elenco dei vicini: 48 × 4 + 4 = 196B</p></li>
<li><p>Codici PQ dei vicini: 48 × (512B × 0,125) ≈ 3072B</p></li>
<li><p>Totale: 3780B</p></li>
</ul>
<p>Poiché l'intero nodo rientra in una pagina, è necessario un solo I/O per ogni accesso e AISAQ evita la lettura casuale dei dati PQ esterni.</p>
<p>Tuttavia, quando solo una parte dei dati PQ è inline, i codici PQ rimanenti devono essere recuperati da un'altra parte del disco. Questo introduce ulteriori operazioni di I/O casuali, che aumentano drasticamente la richiesta di IOPS e portano a significativi cali di prestazioni.</p>
<p><strong>Set di dati Cohere768D</strong></p>
<p>Sul dataset Cohere768D, AISAQ si comporta peggio di DISKANN. Il motivo è che un vettore di 768 dimensioni semplicemente non si adatta a una pagina SSD da 4 KB:</p>
<ul>
<li><p>Vettore completo: 3072B</p></li>
<li><p>Elenco dei vicini: 48 × 4 + 4 = 196B</p></li>
<li><p>Codici PQ dei vicini: 48 × (3072B × 0,125) ≈ 18432B</p></li>
<li><p>Totale: 21.700 B (≈ 6 pagine)</p></li>
</ul>
<p>In questo caso, anche se tutti i codici PQ sono inline, ogni nodo si estende su più pagine. Mentre il numero di operazioni di I/O rimane costante, ogni I/O deve trasferire molti più dati, consumando molto più velocemente la larghezza di banda dell'SSD. Una volta che la larghezza di banda diventa il fattore limitante, AISAQ non riesce a tenere il passo con DISKANN, soprattutto su carichi di lavoro ad alta dimensionalità in cui i dati per nodo crescono rapidamente.</p>
<p><strong>Nota:</strong></p>
<p>Il layout di archiviazione di AISAQ di solito aumenta la dimensione dell'indice su disco di <strong>4× a 6×</strong>. Si tratta di un compromesso intenzionale: i vettori completi, gli elenchi di vicini e i codici PQ sono collocati su disco per consentire un accesso efficiente a pagina singola durante la ricerca. Sebbene questo aumenti l'utilizzo dell'SSD, la capacità del disco è significativamente più economica rispetto alla DRAM e può essere scalata più facilmente con grandi volumi di dati.</p>
<p>In pratica, gli utenti possono regolare questo compromesso regolando i rapporti di compressione di <code translate="no">INLINE_PQ</code> e PQ. Questi parametri consentono di bilanciare le prestazioni di ricerca, l'ingombro del disco e il costo complessivo del sistema in base ai requisiti del carico di lavoro, anziché essere vincolati da limiti di memoria fissi.</p>
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
    </button></h2><p>L'economia dell'hardware moderno sta cambiando. I prezzi delle memorie DRAM rimangono elevati, mentre le prestazioni delle unità SSD sono progredite rapidamente: le unità PCIe 5.0 offrono ora una larghezza di banda superiore a <strong>14 GB/s</strong>. Di conseguenza, le architetture che spostano i dati critici per la ricerca dalla costosa DRAM allo storage SSD, molto più conveniente, stanno diventando sempre più interessanti. Con la capacità delle unità SSD che costa <strong>meno di 30 volte per gigabyte rispetto alla</strong> DRAM, queste differenze non sono più marginali: influenzano in modo significativo la progettazione del sistema.</p>
<p>AISAQ riflette questo cambiamento. Eliminando la necessità di allocare grandi quantità di memoria, consente ai sistemi di ricerca vettoriale di scalare in base alle dimensioni dei dati e ai requisiti del carico di lavoro piuttosto che ai limiti della DRAM. Questo approccio è in linea con una tendenza più ampia verso le architetture "all-in-storage", in cui le veloci unità SSD svolgono un ruolo centrale non solo nella persistenza, ma anche nel calcolo e nella ricerca attivi. Offrendo due modalità operative - Performance e Scale - AiSAQ soddisfa i requisiti sia della ricerca semantica (che richiede la latenza più bassa) sia della RAG (che richiede una scala molto elevata, ma una latenza moderata).</p>
<p>È improbabile che questo cambiamento sia limitato ai database vettoriali. Modelli di progettazione simili stanno già emergendo nell'elaborazione dei grafi, nell'analisi delle serie temporali e persino in parti dei sistemi relazionali tradizionali, in quanto gli sviluppatori ripensano a ipotesi di vecchia data sulla posizione dei dati per ottenere prestazioni accettabili. Con l'evoluzione dell'economia dell'hardware, le architetture di sistema seguiranno la stessa strada.</p>
<p>Per maggiori dettagli sui progetti qui discussi, consultare la documentazione:</p>
<ul>
<li><p><a href="https://milvus.io/docs/aisaq.md">AISAQ | Documentazione Milvus</a></p></li>
<li><p><a href="https://milvus.io/docs/diskann.md">DISKANN | Documentazione Milvus</a></p></li>
</ul>
<p>Avete domande o volete un approfondimento su una qualsiasi caratteristica dell'ultimo Milvus? Unitevi al nostro<a href="https://discord.com/invite/8uyFbECzPX"> canale Discord</a> o inviate problemi su<a href="https://github.com/milvus-io/milvus"> GitHub</a>. È anche possibile prenotare una sessione individuale di 20 minuti per ottenere approfondimenti, indicazioni e risposte alle vostre domande tramite<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus Office Hours</a>.</p>
<h2 id="Learn-More-about-Milvus-26-Features" class="common-anchor-header">Per saperne di più sulle caratteristiche di Milvus 2.6<button data-href="#Learn-More-about-Milvus-26-Features" class="anchor-icon" translate="no">
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
<li><p><a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md">Presentazione di Milvus 2.6: ricerca vettoriale accessibile su scala miliardaria</a></p></li>
<li><p><a href="https://milvus.io/blog/data-in-and-data-out-in-milvus-2-6.md">Introduzione alla funzione Embedding: Come Milvus 2.6 semplifica la vettorizzazione e la ricerca semantica</a></p></li>
<li><p><a href="https://milvus.io/blog/json-shredding-in-milvus-faster-json-filtering-with-flexibility.md">Triturazione JSON in Milvus: filtraggio JSON 88,9 volte più veloce e flessibile</a></p></li>
<li><p><a href="https://milvus.io/blog/unlocking-true-entity-level-retrieval-new-array-of-structs-and-max-sim-capabilities-in-milvus.md">Il vero recupero a livello di entità: Nuove funzionalità Array-of-Structs e MAX_SIM in Milvus</a></p></li>
<li><p><a href="https://milvus.io/blog/minhash-lsh-in-milvus-the-secret-weapon-for-fighting-duplicates-in-llm-training-data.md">MinHash LSH in Milvus: l'arma segreta per combattere i duplicati nei dati di addestramento LLM </a></p></li>
<li><p><a href="https://milvus.io/blog/bring-vector-compression-to-the-extreme-how-milvus-serves-3%C3%97-more-queries-with-rabitq.md">Portare la compressione vettoriale all'estremo: come Milvus serve 3 volte di più le query con RaBitQ</a></p></li>
<li><p><a href="https://milvus.io/blog/benchmarks-lie-vector-dbs-deserve-a-real-test.md">I benchmark mentono: i DB vettoriali meritano un test reale </a></p></li>
<li><p><a href="https://milvus.io/blog/we-replaced-kafka-pulsar-with-a-woodpecker-for-milvus.md">Abbiamo sostituito Kafka/Pulsar con un picchio per Milvus </a></p></li>
<li><p><a href="https://milvus.io/blog/how-to-filter-efficiently-without-killing-recall.md">Ricerca vettoriale nel mondo reale: come filtrare in modo efficiente senza uccidere il richiamo</a></p></li>
</ul>
