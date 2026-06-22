---
id: >-
  introducing-aisaq-in-milvus-billion-scale-vector-search-got-3200-cheaper-on-memory.md
title: >
  Presentazione di AISAQ in Milvus: la ricerca vettoriale su miliardi di
  elementi è ora 3.200 volte più economica in termini di memoria
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
  Scopri come Milvus riduce i costi di memoria di 3200 volte grazie ad AISAQ,
  consentendo ricerche scalabili su miliardi di vettori senza overhead della
  DRAM.
origin: >-
  https://milvus.io/blog/introducing-aisaq-in-milvus-billion-scale-vector-search-got-3200-cheaper-on-memory.md
---
<p>I database vettoriali sono diventati un’infrastruttura fondamentale per i sistemi di intelligenza artificiale mission-critical, e i loro volumi di dati stanno crescendo in modo esponenziale, raggiungendo spesso miliardi di vettori. A tali livelli, tutto diventa più difficile: mantenere una bassa latenza, preservare l’accuratezza, garantire l’affidabilità e operare su repliche e regioni diverse. Ma una sfida tende a emergere fin dall’inizio e a dominare le decisioni architetturali:<strong>il COSTO.</strong></p>
<p>Per garantire ricerche veloci, la maggior parte dei database vettoriali conserva le strutture di indicizzazione chiave nella DRAM (Dynamic Random Access Memory), il livello di memoria più veloce e più costoso. Questo approccio è efficace in termini di prestazioni, ma presenta una scarsa scalabilità. L’utilizzo della DRAM varia in base alla dimensione dei dati piuttosto che al traffico delle query e, anche con la compressione o l’offloading parziale su SSD, gran parte dell’indice deve rimanere in memoria. Man mano che i set di dati crescono, i costi della memoria diventano rapidamente un fattore limitante.</p>
<p>Milvus supporta già <strong>DISKANN</strong>, un approccio ANN basato su disco che riduce la pressione sulla memoria spostando gran parte dell’indice su SSD. Tuttavia, DISKANN si affida ancora alla DRAM per le rappresentazioni compresse utilizzate durante la ricerca. <a href="https://milvus.io/docs/release_notes.md#v264">Milvus 2.6</a> fa un ulteriore passo avanti con <a href="https://milvus.io/docs/aisaq.md">AISAQ</a>, un indice vettoriale basato su disco ispirato a <a href="https://milvus.io/docs/diskann.md">DISKANN</a>. Sviluppata da KIOXIA, l’architettura di AiSAQ è stata progettata con una “Zero-DRAM-Footprint Architecture”, che memorizza tutti i dati critici per la ricerca su disco e ottimizza il posizionamento dei dati per ridurre al minimo le operazioni di I/O. In un carico di lavoro con un miliardo di vettori, ciò riduce l’utilizzo di memoria da <strong>32 GB a circa 10 MB</strong>— una <strong>riduzione di 3.200 volte</strong>— mantenendo al contempo prestazioni pratiche.</p>
<p>Nelle sezioni che seguono, spiegheremo come funziona la ricerca vettoriale basata su grafi, da dove derivano i costi di memoria e in che modo AiSAQ ridefinisce la curva dei costi per la ricerca vettoriale su scala di miliardi.</p>
<h2 id="How-Conventional-Graph-Based-Vector-Search-Works" class="common-anchor-header">Come funziona la ricerca vettoriale convenzionale basata su grafi<button data-href="#How-Conventional-Graph-Based-Vector-Search-Works" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>La ricerca vettoriale</strong> è il processo di individuazione dei punti dati le cui rappresentazioni numeriche sono più vicine a una query in uno spazio ad alta dimensionalità. Per «più vicini» si intende semplicemente la distanza minima secondo una funzione di distanza, come la distanza coseno o la distanza L2. Su piccola scala, il procedimento è semplice: si calcola la distanza tra la query e ogni vettore, quindi si restituiscono quelli più vicini. Su larga scala, ad esempio su miliardi di vettori, tuttavia, questo approccio diventa rapidamente troppo lento per essere pratico.</p>
<p>Per evitare confronti esaustivi, i moderni sistemi di ricerca approssimativa del vicino più prossimo (ANNS) si basano su <strong>indici grafici</strong>. Anziché confrontare una query con ogni singolo vettore, l’indice organizza i vettori in un <strong>grafo</strong>. Ogni nodo rappresenta un vettore, mentre gli archi collegano i vettori numericamente vicini. Questa struttura consente al sistema di restringere drasticamente lo spazio di ricerca.</p>
<p>Il grafo viene costruito in anticipo, basandosi esclusivamente sulle relazioni tra i vettori. Non dipende dalle query. Quando arriva una query, il compito del sistema è quello di <strong>navigare nel grafo in modo efficiente</strong> e identificare i vettori con la distanza minore dalla query, senza dover scansionare l’intero set di dati.</p>
<p>La ricerca inizia da un <strong>punto di ingresso</strong> predefinito nel grafo. Questo punto di partenza può essere lontano dalla query, ma l’algoritmo ne migliora la posizione passo dopo passo, spostandosi verso i vettori che appaiono più vicini alla query. Durante questo processo, la ricerca mantiene due strutture dati interne che operano in sinergia: un <strong>elenco di candidati</strong> e un <strong>elenco di risultati</strong>.</p>
<p>I due passaggi più importanti di questo processo sono l’espansione dell’elenco dei candidati e l’aggiornamento dell’elenco dei risultati.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/whiteboard_exported_image_84f8324275.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Expanding-the-Candidate-List" class="common-anchor-header">Espansione dell’elenco dei candidati</h3><p><strong>L’elenco dei candidati</strong> rappresenta la direzione in cui la ricerca può proseguire. Si tratta di un insieme, ordinato per priorità, di nodi del grafo che appaiono promettenti in base alla loro distanza dalla query.</p>
<p>Ad ogni iterazione, l’algoritmo:</p>
<ul>
<li><p><strong>Seleziona il candidato più vicino individuato fino a quel momento.</strong> Dall’elenco dei candidati, sceglie il vettore con la distanza minore dalla query.</p></li>
<li><p><strong>Recupera i vicini di quel vettore dal grafo.</strong> Questi vicini sono vettori che, durante la costruzione dell’indice, sono stati identificati come vicini al vettore corrente.</p></li>
<li><p><strong>Valuta i vicini non ancora visitati e li aggiunge all’elenco dei candidati.</strong> Per ogni vicino che non è stato ancora esplorato, l’algoritmo calcola la sua distanza dalla query. I vicini visitati in precedenza vengono saltati, mentre i nuovi vicini vengono inseriti nell’elenco dei candidati se appaiono promettenti.</p></li>
</ul>
<p>Espandendo ripetutamente l’elenco dei candidati, la ricerca esplora regioni del grafo sempre più rilevanti. Ciò consente all’algoritmo di avanzare costantemente verso risposte migliori, esaminando solo una piccola frazione di tutti i vettori.</p>
<h3 id="Updating-the-Result-List" class="common-anchor-header">Aggiornamento dell’elenco dei risultati</h3><p>Contemporaneamente, l’algoritmo mantiene un <strong>elenco dei risultati</strong>, che registra i migliori candidati trovati finora per l’output finale. Man mano che la ricerca procede, esso:</p>
<ul>
<li><p><strong>Tiene traccia dei vettori più vicini incontrati durante la traversata.</strong> Questi includono sia i vettori selezionati per l’espansione sia altri valutati lungo il percorso.</p></li>
<li><p><strong>Memorizza le loro distanze rispetto alla query.</strong> Ciò rende possibile classificare i candidati e mantenere i primi K vicini più prossimi.</p></li>
</ul>
<p>Nel corso del tempo, man mano che vengono valutati più candidati e si riscontrano minori miglioramenti, l’elenco dei risultati si stabilizza. Una volta che è improbabile che un’ulteriore esplorazione del grafo produca vettori più vicini, la ricerca termina e restituisce l’elenco dei risultati come risposta finale.</p>
<p>In termini semplici, <strong>l’elenco dei candidati controlla l’esplorazione</strong>, mentre <strong>l’elenco dei risultati raccoglie le migliori risposte scoperte fino a quel momento</strong>.</p>
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
    </button></h2><p>È proprio questo approccio basato sul grafo a rendere praticabile, in primo luogo, la ricerca vettoriale su larga scala. Navigando nel grafo anziché scansionare ogni vettore, il sistema è in grado di trovare risultati di alta qualità toccando solo una piccola frazione del set di dati.</p>
<p>Tuttavia, questa efficienza ha un costo. La ricerca basata su grafi presenta un compromesso fondamentale tra <strong>accuratezza e costo.</strong></p>
<ul>
<li><p>Esplorare un maggior numero di vicini migliora l’accuratezza, coprendo una porzione più ampia del grafo e riducendo la probabilità di tralasciare i veri vicini più prossimi.</p></li>
<li><p>Allo stesso tempo, ogni ulteriore espansione comporta un carico di lavoro aggiuntivo: più calcoli di distanza, più accessi alla struttura del grafo e più letture dei dati vettoriali. Man mano che la ricerca si approfondisce o si estende, questi costi si accumulano. A seconda di come è progettato l’indice, si traducono in un maggiore utilizzo della CPU, un aumento della pressione sulla memoria o un I/O su disco aggiuntivo.</p></li>
</ul>
<p>Il bilanciamento di queste forze opposte — un elevato recall contro un uso efficiente delle risorse — è fondamentale nella progettazione della ricerca basata su grafi.</p>
<p>Sia <a href="https://milvus.io/blog/diskann-explained.md"><strong>DISKANN</strong></a> che <strong>AISAQ</strong> sono costruiti attorno a questa stessa tensione, ma adottano scelte architetturali diverse su come e dove sostenere tali costi.</p>
<h2 id="How-DISKANN-Optimizes-Disk-Based-Vector-Search" class="common-anchor-header">Come DISKANN ottimizza la ricerca vettoriale basata su disco<button data-href="#How-DISKANN-Optimizes-Disk-Based-Vector-Search" class="anchor-icon" translate="no">
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
<p>DISKANN è la soluzione ANN basata su disco più influente fino ad oggi e funge da riferimento ufficiale per la competizione NeurIPS Big ANN, un benchmark globale per la ricerca vettoriale su scala di miliardi. La sua importanza non risiede solo nelle prestazioni, ma in ciò che ha dimostrato: <strong>la ricerca ANN basata su grafi non deve necessariamente risiedere interamente in memoria per essere veloce</strong>.</p>
<p>Combinando lo storage basato su SSD con strutture in memoria accuratamente selezionate, DISKANN ha dimostrato che la ricerca vettoriale su larga scala può raggiungere un’elevata precisione e una bassa latenza su hardware standard, senza richiedere ingenti quantità di DRAM. Ciò è possibile ripensando <em>quali parti della ricerca debbano essere veloci</em> e <em>quali possano tollerare un accesso più lento</em>.</p>
<p><strong>A livello generale, DISKANN mantiene in memoria i dati a cui si accede più frequentemente, mentre sposta su disco le strutture più grandi e a cui si accede meno frequentemente.</strong> Questo equilibrio si ottiene attraverso diverse scelte progettuali chiave.</p>
<h3 id="1-Using-PQ-Distances-to-Expand-the-Candidate-List" class="common-anchor-header">1. Utilizzo delle distanze PQ per espandere l’elenco dei candidati</h3><p>L’espansione dell’elenco dei candidati è l’operazione più frequente nella ricerca basata su grafi. Ogni espansione richiede la stima della distanza tra il vettore di query e i vicini di un nodo candidato. Eseguire questi calcoli utilizzando vettori completi e ad alta dimensionalità richiederebbe frequenti letture casuali dal disco — un’operazione costosa sia dal punto di vista computazionale che in termini di I/O.</p>
<p>DISKANN evita questo costo comprimendo i vettori in <strong>codici di quantizzazione del prodotto (PQ)</strong> e conservandoli in memoria. I codici PQ sono molto più piccoli dei vettori completi, ma conservano comunque informazioni sufficienti per stimare approssimativamente la distanza.</p>
<p>Durante l’espansione dei candidati, DISKANN calcola le distanze utilizzando questi codici PQ in memoria invece di leggere i vettori completi dall’SSD. Ciò riduce drasticamente l’I/O del disco durante l’attraversamento del grafo, consentendo alla ricerca di espandere i candidati in modo rapido ed efficiente, mantenendo la maggior parte del traffico SSD fuori dal percorso critico.</p>
<h3 id="2-Co-Locating-Full-Vectors-and-Neighbor-Lists-on-Disk" class="common-anchor-header">2. Collocazione congiunta di vettori completi ed elenchi di vicini sul disco</h3><p>Non tutti i dati possono essere compressi o consultati in modo approssimativo. Una volta identificati i candidati promettenti, la ricerca necessita comunque di accedere a due tipi di dati per ottenere risultati accurati:</p>
<ul>
<li><p><strong>Elenchi dei vicini</strong>, per continuare la traversata del grafo</p></li>
<li><p><strong>Vettori completi (non compressi)</strong>, per il riordino finale</p></li>
</ul>
<p>L’accesso a queste strutture è meno frequente rispetto ai codici PQ, pertanto DISKANN le memorizza su SSD. Per ridurre al minimo il sovraccarico del disco, DISKANN colloca l’elenco dei vicini di ciascun nodo e il relativo vettore completo nella stessa regione fisica del disco. Ciò garantisce che una singola lettura dall’SSD possa recuperare entrambi.</p>
<p>Collocando i dati correlati nella stessa posizione, DISKANN riduce il numero di accessi casuali al disco necessari durante la ricerca. Questa ottimizzazione migliora l’efficienza sia dell’espansione che del riordino, specialmente su larga scala.</p>
<h3 id="3-Parallel-Node-Expansion-for-Better-SSD-Utilization" class="common-anchor-header">3. Espansione parallela dei nodi per un migliore utilizzo dell’SSD</h3><p>La ricerca ANN basata su grafi è un processo iterativo. Se ogni iterazione espande un solo nodo candidato, il sistema emette una sola lettura dal disco alla volta, lasciando inutilizzata la maggior parte della larghezza di banda parallela dell’SSD. Per evitare questa inefficienza, DISKANN espande più candidati in ogni iterazione e invia richieste di lettura parallele all’SSD. Questo approccio sfrutta molto meglio la larghezza di banda disponibile e riduce il numero totale di iterazioni necessarie.</p>
<p>Il parametro <strong>`beam_width_ratio`</strong> controlla il numero di candidati espansi in parallelo: <strong>larghezza del fascio = numero di core della CPU × `beam_width_ratio`.</strong> Un rapporto più elevato amplia la ricerca — migliorando potenzialmente la precisione — ma aumenta anche il carico di calcolo e l’I/O del disco.</p>
<p>Per compensare questo effetto, DISKANN introduce una cache di dati ( <code translate="no">search_cache_budget_gb_ratio</code> ) che riserva memoria per memorizzare i dati a cui si accede frequentemente, riducendo le letture ripetute dall’SSD. Insieme, questi meccanismi aiutano DISKANN a bilanciare precisione, latenza ed efficienza di I/O.</p>
<h3 id="Why-This-Matters--and-Where-the-Limits-Appear" class="common-anchor-header">Perché è importante — e dove si manifestano i limiti</h3><p>Il design di DISKANN rappresenta un importante passo avanti per la ricerca vettoriale basata su disco. Mantenendo i codici PQ in memoria e trasferendo le strutture più grandi sull’SSD, riduce significativamente l’impronta di memoria rispetto agli indici grafici interamente in memoria.</p>
<p>Allo stesso tempo, questa architettura dipende ancora dalla <strong>DRAM sempre attiva</strong> per i dati critici per la ricerca. I codici PQ, le cache e le strutture di controllo devono rimanere residenti in memoria per mantenere efficiente la traversata. Man mano che i set di dati crescono fino a miliardi di vettori e le implementazioni aggiungono repliche o regioni, tale requisito di memoria può comunque diventare un fattore limitante.</p>
<p>È proprio questa lacuna che <strong>AISAQ</strong> è stato progettato per colmare.</p>
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
    </button></h2><p>AISAQ si basa direttamente sulle idee fondamentali alla base di DISKANN, ma introduce un cambiamento fondamentale: elimina <strong>la necessità di mantenere i dati PQ nella DRAM</strong>. Anziché trattare i vettori compressi come strutture critiche per la ricerca e sempre presenti in memoria, AISAQ li sposta su SSD e riprogetta la disposizione dei dati del grafo sul disco per preservare l’efficienza della traversata.</p>
<p>Per far funzionare tutto ciò, AISAQ riorganizza l’archiviazione dei nodi in modo che i dati necessari durante la ricerca nel grafo — vettori completi, elenchi di vicini e informazioni PQ — siano disposti sul disco secondo schemi ottimizzati per la località di accesso. L’obiettivo non è solo quello di trasferire più dati sul disco, più economico, ma di farlo <strong>senza compromettere il processo di ricerca descritto in precedenza</strong>.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/AISAQ_244e661794.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Per soddisfare i diversi requisiti delle applicazioni, AISAQ offre due modalità di archiviazione su disco: Performance e Scale. Da un punto di vista tecnico, queste modalità differiscono principalmente nel modo in cui i dati compressi tramite PQ vengono archiviati e consultati durante la ricerca. Dal punto di vista applicativo, queste modalità rispondono a due tipi distinti di requisiti: requisiti di bassa latenza, tipici della ricerca semantica online e dei sistemi di raccomandazione, e requisiti di scala ultra-elevata, tipici del RAG.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/aisaq_vs_diskann_35ebee3c64.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="AISAQ-performance-Optimized-for-Speed" class="common-anchor-header">AISAQ-performance: ottimizzata per la velocità</h3><p>AISAQ-performance conserva tutti i dati su disco mantenendo al contempo un basso overhead di I/O grazie alla collocazione dei dati.</p>
<p>In questa modalità:</p>
<ul>
<li><p>il vettore completo di ciascun nodo, l’elenco dei bordi e i codici PQ dei suoi vicini sono memorizzati insieme su disco.</p></li>
<li><p>L’accesso a un nodo richiede comunque una <strong>sola lettura dall’SSD</strong>, poiché tutti i dati necessari per l’espansione e la valutazione dei candidati sono collocati insieme.</p></li>
</ul>
<p>Dal punto di vista dell’algoritmo di ricerca, ciò rispecchia da vicino il modello di accesso di DISKANN. L’espansione dei candidati rimane efficiente e le prestazioni in termini di tempo di esecuzione sono comparabili, anche se tutti i dati critici per la ricerca risiedono ora su disco.</p>
<p>Il compromesso è rappresentato dal sovraccarico di archiviazione. Poiché i dati PQ di un nodo vicino possono comparire nelle pagine su disco di più nodi, questa struttura introduce ridondanza e aumenta significativamente le dimensioni complessive dell’indice.</p>
<p>Pertanto, la modalità AISAQ-Performance privilegia una bassa latenza di I/O rispetto all’efficienza del disco. Dal punto di vista applicativo, la modalità AISAQ-Performance è in grado di garantire una latenza nell’ordine dei 10 mSec, come richiesto dalla ricerca semantica online.</p>
<h3 id="AISAQ-scale-Optimized-for-Storage-Efficiency" class="common-anchor-header">AISAQ-Scale: ottimizzata per l’efficienza di archiviazione</h3><p>AISAQ-Scale adotta l’approccio opposto. È progettata per <strong>ridurre al minimo l’utilizzo del disco</strong>, pur mantenendo tutti i dati su SSD.</p>
<p>In questa modalità:</p>
<ul>
<li><p>I dati PQ vengono memorizzati sul disco separatamente, senza ridondanza.</p></li>
<li><p>Ciò elimina la ridondanza e riduce drasticamente le dimensioni dell’indice.</p></li>
</ul>
<p>Il compromesso è che l'accesso ai codici PQ di un nodo e dei suoi vicini potrebbe richiedere <strong>più letture dall'SSD</strong>, aumentando le operazioni di I/O durante l'espansione dei candidati. Se non ottimizzata, questa situazione rallenterebbe significativamente la ricerca.</p>
<p>Per controllare questo sovraccarico, la modalità AISAQ-Scale introduce due ottimizzazioni aggiuntive:</p>
<ul>
<li><p><strong>Riorganizzazione dei dati PQ</strong>, che ordina i vettori PQ in base alla priorità di accesso per migliorare la località e ridurre le letture casuali.</p></li>
<li><p>Una <strong>cache PQ nella DRAM</strong> (<code translate="no">pq_read_page_cache_size</code>), che memorizza i dati PQ a cui si accede frequentemente ed evita ripetute letture dal disco per le voci più utilizzate.</p></li>
</ul>
<p>Grazie a queste ottimizzazioni, la modalità AISAQ-Scale raggiunge un’efficienza di archiviazione di gran lunga superiore rispetto ad AISAQ-Performance, pur mantenendo prestazioni di ricerca pratiche. Tali prestazioni rimangono inferiori a quelle di DISKANN, ma non vi è alcun sovraccarico di archiviazione (la dimensione dell’indice è simile a quella di DISKANN) e l’impronta di memoria è notevolmente più ridotta. Dal punto di vista applicativo, AiSAQ fornisce gli strumenti per soddisfare i requisiti RAG su scala ultra-elevata.</p>
<h3 id="Key-Advantages-of-AISAQ" class="common-anchor-header">Vantaggi chiave di AISAQ</h3><p>Spostando tutti i dati critici per la ricerca sul disco e riprogettando le modalità di accesso a tali dati, AISAQ modifica radicalmente il profilo di costo e scalabilità della ricerca vettoriale basata su grafi. Il suo design offre tre vantaggi significativi.</p>
<p><strong>1. Utilizzo della DRAM fino a 3.200 volte inferiore</strong></p>
<p>La quantizzazione dei prodotti (Product Quantization) riduce significativamente le dimensioni dei vettori ad alta dimensionalità, ma su scala di miliardi l’impronta di memoria rimane comunque notevole. Anche dopo la compressione, nei progetti convenzionali i codici PQ devono essere mantenuti in memoria durante la ricerca.</p>
<p>Ad esempio, su <strong>SIFT1B</strong>, un benchmark con un miliardo di vettori a 128 dimensioni, i soli codici PQ richiedono circa <strong>30–120 GB di DRAM</strong>, a seconda della configurazione. Memorizzare i vettori completi e non compressi richiederebbe <strong> circa 480 GB</strong> in più. Sebbene la PQ riduca l’utilizzo della memoria di 4–16 volte, l’impronta rimanente è ancora abbastanza grande da incidere in modo determinante sui costi dell’infrastruttura.</p>
<p>AISAQ elimina completamente questo requisito. Memorizzando i codici PQ su SSD anziché su DRAM, la memoria non viene più occupata dai dati di indice persistenti. La DRAM viene utilizzata solo per strutture leggere e transitorie, quali elenchi di candidati e metadati di controllo. In pratica, ciò riduce l’utilizzo di memoria da decine di gigabyte a <strong>circa 10 MB</strong>. In una configurazione rappresentativa su scala di miliardi, la DRAM scende da <strong>32 GB a 10 MB</strong>, con <strong>una riduzione di 3.200 volte</strong>.</p>
<p>Dato che lo storage su SSD costa circa <strong>1/30 del prezzo per unità di capacità</strong> rispetto alla DRAM, questo cambiamento ha un impatto diretto e significativo sul costo totale del sistema.</p>
<p><strong>2. Nessun sovraccarico I/O aggiuntivo</strong></p>
<p>Spostare i codici PQ dalla memoria al disco aumenterebbe normalmente il numero di operazioni di I/O durante la ricerca. AISAQ evita questo problema controllando attentamente <strong>la disposizione dei dati e i modelli di accesso</strong>. Anziché disperdere i dati correlati sul disco, AISAQ raggruppa i codici PQ, i vettori completi e gli elenchi dei vicini in modo che possano essere recuperati insieme. Ciò garantisce che l’espansione dei candidati non introduca ulteriori letture casuali.</p>
<p>Per consentire agli utenti di gestire il compromesso tra dimensione dell’indice ed efficienza di I/O, AISAQ introduce il parametro ` <code translate="no">inline_pq</code> `, che determina la quantità di dati PQ memorizzati in linea con ciascun nodo:</p>
<ul>
<li><p><strong>Valore più basso di `inline_pq`:</strong> dimensione dell’indice più piccola, ma potrebbe richiedere I/O aggiuntivo</p></li>
<li><p><strong>Valore più alto di `inline_pq`:</strong> indice di dimensioni maggiori, ma si mantiene l’accesso con una singola lettura</p></li>
</ul>
<p>Se configurato con <strong>`inline_pq = max_degree</strong>`, AISAQ legge il vettore completo di un nodo, l’elenco dei vicini e tutti i codici PQ in un’unica operazione su disco, replicando il modello di I/O di DISKANN pur mantenendo tutti i dati su SSD.</p>
<p><strong>3. L’accesso sequenziale al PQ migliora l’efficienza computazionale</strong></p>
<p>In DISKANN, l’espansione di un nodo candidato richiede R accessi casuali alla memoria per recuperare i codici PQ dei suoi R vicini. AISAQ elimina questa casualità recuperando tutti i codici PQ in un unico I/O e memorizzandoli in modo sequenziale su disco.</p>
<p>Il layout sequenziale offre due importanti vantaggi:</p>
<ul>
<li><p><strong>Le letture sequenziali dall’SSD sono molto più veloci</strong> delle letture casuali sparse.</p></li>
<li><p><strong>I dati contigui sono più compatibili con la cache</strong>, consentendo alle CPU di calcolare le distanze PQ in modo più efficiente.</p></li>
</ul>
<p>Ciò migliora sia la velocità che la prevedibilità dei calcoli delle distanze PQ e contribuisce a compensare il costo in termini di prestazioni derivante dalla memorizzazione dei codici PQ su SSD anziché su DRAM.</p>
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
    </button></h2><p>Dopo aver compreso in che modo AISAQ differisce architettonicamente da DISKANN, la domanda successiva è semplice: <strong>in che modo queste scelte progettuali influenzano le prestazioni e l’utilizzo delle risorse nella pratica?</strong> Questa valutazione mette a confronto AISAQ e DISKANN in tre dimensioni fondamentali su scala di un miliardo: <strong>prestazioni di ricerca, consumo di memoria e utilizzo del disco</strong>.</p>
<p>In particolare, esaminiamo come si comporta AISAQ al variare della quantità di dati PQ in linea (<code translate="no">INLINE_PQ</code>). Questo parametro controlla direttamente il compromesso tra dimensione dell’indice, I/O su disco ed efficienza di esecuzione. Valutiamo inoltre entrambi gli approcci su <strong>carichi di lavoro vettoriali a bassa e alta dimensionalità, poiché la dimensionalità influenza fortemente il costo del calcolo della distanza e</strong> i requisiti di archiviazione.</p>
<h3 id="Setup" class="common-anchor-header">Configurazione</h3><p>Tutti gli esperimenti sono stati condotti su un sistema a nodo singolo per isolare il comportamento dell’indice ed evitare interferenze dovute a effetti di rete o di sistemi distribuiti.</p>
<p><strong>Configurazione hardware:</strong></p>
<ul>
<li><p>CPU: AMD EPYC 9454P a 2,70 GHz</p></li>
<li><p>Memoria: Velocità: 3200 MT/s, Tipo: DDR4, Capacità: 384 GB</p></li>
<li><p>Disco: SSD<sup>NVMe™</sup> KIOXIA CM7 da 7,68 TB</p></li>
</ul>
<p><h6><em>AMD EPYC è un marchio commerciale di Advanced Micro Devices, Inc.</em></h6>
<h6><em>NVMe è un marchio registrato o non registrato di NVM Express, Inc. negli Stati Uniti e in altri paesi.</em></h6></p>
<p><strong>Parametri di creazione dell’indice</strong></p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;max_degree&quot;</span>: <span class="hljs-number">48</span>,
  <span class="hljs-string">&quot;search_list_size&quot;</span>: <span class="hljs-number">100</span>,
  <span class="hljs-string">&quot;inline_pq&quot;</span>: <span class="hljs-number">0</span>/<span class="hljs-number">20</span>/<span class="hljs-number">38</span>/<span class="hljs-number">48</span>,  <span class="hljs-comment">// KIOXIA AiSAQ only</span>
  <span class="hljs-string">&quot;pq_code_budget_gb_ratio&quot;</span>: <span class="hljs-number">0.125</span>/<span class="hljs-number">0.04167</span>, <span class="hljs-comment">//SIFT 128: 0.125 /Cohere 768: 0.04167</span>
  <span class="hljs-string">&quot;search_cache_budget_gb_ratio&quot;</span>: <span class="hljs-number">0.0</span>,
  <span class="hljs-string">&quot;build_dram_budget_gb&quot;</span>: <span class="hljs-number">32.0</span>
}
<button class="copy-code-btn"></button></code></pre>
<p><strong>Parametri di query</strong></p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;k&quot;</span>: <span class="hljs-number">10</span>,
  <span class="hljs-string">&quot;search_list_size&quot;</span>: <span class="hljs-number">13</span>/<span class="hljs-number">15</span>/<span class="hljs-number">16</span>/<span class="hljs-number">18</span>, // SIFT/Cohere:<span class="hljs-number">13</span>/<span class="hljs-number">16</span> <span class="hljs-keyword">for</span> DiskANN <span class="hljs-keyword">and</span> KIOXIA AiSAQ <span class="hljs-keyword">with</span> inline_pq=<span class="hljs-number">48</span>; <span class="hljs-number">15</span>/<span class="hljs-number">18</span> <span class="hljs-keyword">for</span> AiSAQ <span class="hljs-keyword">with</span> inline_pq&lt;<span class="hljs-number">48</span>
  <span class="hljs-string">&quot;beamwidth&quot;</span>: <span class="hljs-number">4</span>
  <span class="hljs-string">&quot;vectors_beamwidth&quot;</span>: <span class="hljs-number">2</span> // only <span class="hljs-keyword">for</span> AiSAQ <span class="hljs-keyword">with</span> inline_pq&lt;<span class="hljs-number">48</span>
  <span class="hljs-string">&quot;num_search_threads&quot;</span>: <span class="hljs-number">12</span>
}
<button class="copy-code-btn"></button></code></pre>
<h3 id="Benchmark-Method" class="common-anchor-header">Metodo di benchmark</h3><p>Sia DISKANN che AISAQ sono stati testati utilizzando <a href="https://milvus.io/docs/knowhere.md">Knowhere</a>, il motore di ricerca vettoriale open source utilizzato in Milvus. In questa valutazione sono stati utilizzati due set di dati:</p>
<ul>
<li><p><strong>SIFT128D (1 milione di vettori):</strong> un noto benchmark a 128 dimensioni comunemente utilizzato per la ricerca di descrittori di immagini. <em>(Dimensione del set di dati grezzo ≈ 488 MB)</em></p></li>
<li><p><strong>Cohere768D (1 milione di vettori):</strong> un insieme di embedding a 768 dimensioni tipico della ricerca semantica basata su modelli Transformer. <em>(Dimensione del set di dati grezzo ≈ 2930 MB)</em></p></li>
</ul>
<p>Questi set di dati riflettono due distinti scenari del mondo reale: caratteristiche visive compatte e grandi embedding semantici.</p>
<h3 id="Results" class="common-anchor-header">Risultati</h3><p><strong>Sift128D1M (vettore completo ~488 MB)</strong></p>
<p><span class="img-wrapper">
  
   <img translate="no" src="/blogs/assets/sift.png" alt="SIFT recall vs latency chart" class="doc-image" id="sift-recall-vs-latency-chart" /> 
   <span>Grafico del recall di SIFT rispetto alla latenza</span>
  
 </span></p>
<p><strong>Cohere768D1M (vettore completo ~2930 MB)</strong></p>
<p><span class="img-wrapper">
  
   <img translate="no" src="/blogs/assets/cohere.png" alt="Choere recall vs latency chart" class="doc-image" id="choere-recall-vs-latency-chart" /> 
   <span>Grafico del recall di Cohere rispetto alla latenza</span>
  
 </span></p>
<h3 id="Analysis" class="common-anchor-header">Analisi</h3><p><strong>Set di dati SIFT128D</strong></p>
<p>Sul dataset SIFT128D, AISAQ è in grado di eguagliare le prestazioni di DISKANN quando tutti i dati PQ sono in linea, in modo che i dati richiesti da ciascun nodo rientrino interamente in una singola pagina SSD da 4 KB (INLINE_PQ = 48). Con questa configurazione, tutte le informazioni necessarie durante la ricerca sono collocate nello stesso posto:</p>
<ul>
<li><p>Vettore completo: 512 B</p></li>
<li><p>Elenco dei vicini: 48 × 4 + 4 = 196B</p></li>
<li><p>Codici PQ dei vicini: 48 × (512 B × 0,125) ≈ 3072 B</p></li>
<li><p>Totale: 3780B</p></li>
</ul>
<p>Poiché l’intero nodo rientra in una sola pagina, è necessario un solo I/O per ogni accesso e AISAQ evita letture casuali di dati PQ esterni.</p>
<p>Tuttavia, quando solo una parte dei dati PQ è in linea, i codici PQ rimanenti devono essere recuperati da un'altra posizione sul disco (il parametro inline_pq è stato impostato per ottimizzare l’utilizzo delle pagine SSD; ad esempio, inline_pq = 20 consente di far rientrare due nodi in una singola pagina da 4 KB). Ciò introduce ulteriori operazioni di I/O casuali, che aumentano notevolmente la richiesta di IOPS e comportano un calo delle prestazioni.</p>
<p><strong>Set di dati Cohere768D</strong></p>
<p>Sul dataset Cohere768D, AISAQ registra prestazioni inferiori di circa l’8% rispetto a DISKANN. Il motivo è che un vettore a 768 dimensioni semplicemente non rientra in una singola pagina SSD da 4 KB:</p>
<ul>
<li><p>Vettore completo: 3072B</p></li>
<li><p>Elenco dei vicini: 48 × 4 + 4 = 196 B</p></li>
<li><p>Codici PQ dei vicini: 48 × (3072B × 0,04167) ≈ 6.144B</p></li>
<li><p>Totale: 9.412 B (≈ 3 pagine)</p></li>
</ul>
<p>In questo caso, anche se tutti i codici PQ sono integrati, ogni nodo si estende su più pagine. Sebbene il numero di operazioni di I/O rimanga costante, ogni operazione di I/O deve trasferire una quantità di dati molto maggiore, consumando la larghezza di banda dell’SSD molto più rapidamente. Una volta che la larghezza di banda diventa il fattore limitante, AISAQ non riesce a tenere il passo con DISKANN, specialmente su carichi di lavoro ad alta dimensionalità in cui l’impronta dei dati per nodo cresce rapidamente.</p>
<p><strong>Nota:</strong></p>
<p>il layout di archiviazione di AISAQ in genere aumenta le dimensioni dell’indice su disco da <strong>3 a 5 volte</strong>. Si tratta di un compromesso deliberato: vettori completi, elenchi di vicini e codici PQ sono collocati insieme sul disco per consentire un accesso efficiente a singola pagina durante la ricerca. Sebbene ciò aumenti l’utilizzo dell’SSD, la capacità del disco è significativamente più economica rispetto alla DRAM e si adatta più facilmente a grandi volumi di dati.</p>
<p>In pratica, gli utenti possono ottimizzare questo compromesso regolando i rapporti di compressione dell’ <code translate="no">INLINE_PQ</code> e e del PQ. Questi parametri consentono di bilanciare le prestazioni di ricerca, l’ingombro su disco e il costo complessivo del sistema in base ai requisiti del carico di lavoro, anziché essere vincolati da limiti di memoria fissi.</p>
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
    </button></h2><p>L’economia dell’hardware moderno sta cambiando. I prezzi della DRAM rimangono elevati, mentre le prestazioni degli SSD hanno registrato rapidi progressi: le unità PCIe 5.0 offrono ora una larghezza di banda superiore a <strong>14 GB/s</strong>. Di conseguenza, le architetture che trasferiscono i dati critici per la ricerca dalla costosa DRAM a un’archiviazione su SSD molto più conveniente stanno diventando sempre più interessanti. Con un costo <strong>per gigabyte</strong> della capacità SSD <strong>inferiore a 30 volte quello della</strong> DRAM, queste differenze non sono più marginali, ma influenzano in modo significativo la progettazione del sistema.</p>
<p>AISAQ riflette questo cambiamento. Eliminando la necessità di grandi allocazioni di memoria sempre attive, consente ai sistemi di ricerca vettoriale di scalare in base alle dimensioni dei dati e ai requisiti del carico di lavoro, piuttosto che ai limiti della DRAM. Questo approccio è in linea con una tendenza più ampia verso architetture “all-in-storage”, in cui gli SSD veloci svolgono un ruolo centrale non solo nella persistenza, ma anche nel calcolo attivo e nella ricerca. Offrendo due modalità operative – Performance e Scale – AiSAQ soddisfa i requisiti sia della ricerca semantica (che richiede la latenza più bassa) sia del RAG (che richiede una scalabilità molto elevata, ma una latenza moderata).</p>
<p>È improbabile che questo cambiamento si limiti ai database vettoriali. Modelli di progettazione simili stanno già emergendo nell’elaborazione dei grafi, nell’analisi delle serie temporali e persino in alcune parti dei sistemi relazionali tradizionali, man mano che gli sviluppatori ripensano i presupposti di lunga data su dove i dati debbano risiedere per ottenere prestazioni accettabili. Man mano che l’economia dell’hardware continua ad evolversi, le architetture di sistema seguiranno lo stesso percorso.</p>
<p>Per ulteriori dettagli sui progetti qui discussi, consultare la documentazione:</p>
<ul>
<li><p><a href="https://milvus.io/docs/aisaq.md">AISAQ | Documentazione Milvus</a></p></li>
<li><p><a href="https://milvus.io/docs/diskann.md">DISKANN | Documentazione Milvus</a></p></li>
</ul>
<p>Avete domande o desiderate approfondire una qualsiasi funzionalità dell’ultima versione di Milvus? Unitevi<a href="https://discord.com/invite/8uyFbECzPX"> al</a> nostro<a href="https://discord.com/invite/8uyFbECzPX"> canale Discord</a> o segnalate i problemi su<a href="https://github.com/milvus-io/milvus"> GitHub</a>. Potete anche prenotare una sessione individuale di 20 minuti per ottenere approfondimenti, indicazioni e risposte alle vostre domande tramite<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus Office Hours</a>.</p>
<h2 id="Learn-More-about-Milvus-26-Features" class="common-anchor-header">Scopri di più sulle funzionalità di Milvus 2.6<button data-href="#Learn-More-about-Milvus-26-Features" class="anchor-icon" translate="no">
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
<li><p><a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md">Presentazione di Milvus 2.6: ricerca vettoriale conveniente su scala di miliardi</a></p></li>
<li><p><a href="https://milvus.io/blog/data-in-and-data-out-in-milvus-2-6.md">Presentazione della funzione di embedding: come Milvus 2.6 semplifica la vettorizzazione e la ricerca semantica</a></p></li>
<li><p><a href="https://milvus.io/blog/json-shredding-in-milvus-faster-json-filtering-with-flexibility.md">JSON Shredding in Milvus: filtraggio JSON 88,9 volte più veloce con maggiore flessibilità</a></p></li>
<li><p><a href="https://milvus.io/blog/unlocking-true-entity-level-retrieval-new-array-of-structs-and-max-sim-capabilities-in-milvus.md">Sbloccare il vero recupero a livello di entità: nuove funzionalità Array-of-Structs e MAX_SIM in Milvus</a></p></li>
<li><p><a href="https://milvus.io/blog/minhash-lsh-in-milvus-the-secret-weapon-for-fighting-duplicates-in-llm-training-data.md">MinHash LSH in Milvus: l’arma segreta per combattere i duplicati nei dati di addestramento LLM </a></p></li>
<li><p><a href="https://milvus.io/blog/bring-vector-compression-to-the-extreme-how-milvus-serves-3%C3%97-more-queries-with-rabitq.md">Portare la compressione vettoriale all’estremo: come Milvus gestisce 3 volte più query con RaBitQ</a></p></li>
<li><p><a href="https://milvus.io/blog/benchmarks-lie-vector-dbs-deserve-a-real-test.md">I benchmark mentono — I database vettoriali meritano un test reale </a></p></li>
<li><p><a href="https://milvus.io/blog/we-replaced-kafka-pulsar-with-a-woodpecker-for-milvus.md">Abbiamo sostituito Kafka/Pulsar con Woodpecker per Milvus </a></p></li>
<li><p><a href="https://milvus.io/blog/how-to-filter-efficiently-without-killing-recall.md">La ricerca vettoriale nel mondo reale: come filtrare in modo efficiente senza compromettere il recall</a></p></li>
</ul>
