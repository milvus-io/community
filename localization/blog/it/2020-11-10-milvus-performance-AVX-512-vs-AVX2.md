---
id: milvus-performance-AVX-512-vs-AVX2.md
title: Cosa sono le estensioni vettoriali avanzate?
author: milvus
date: 2020-11-10T22:15:39.156Z
desc: >-
  Scoprite come Milvus si comporta su AVX-512 rispetto ad AVX2 utilizzando una
  serie di indici vettoriali diversi.
cover: assets.zilliz.com/header_milvus_performance_avx_512_vs_avx2_2c9f14ef96.png
tag: Engineering
canonicalUrl: 'https://zilliz.com/blog/milvus-performance-AVX-512-vs-AVX2'
---
<custom-h1>Prestazioni di Milvus su AVX-512 vs. AVX2</custom-h1><p>Le macchine intelligenti e coscienti che vogliono conquistare il mondo sono una costante della fantascienza, ma in realtà i computer moderni sono molto obbedienti. Senza istruzioni, raramente sanno cosa fare da soli. I computer eseguono compiti basati su istruzioni, o ordini, inviati da un programma a un processore. Al livello più basso, ogni istruzione è una sequenza di uno e zero che descrive un'operazione che il computer deve eseguire. In genere, nei linguaggi di assemblaggio dei computer ogni istruzione del linguaggio macchina corrisponde a un'istruzione del processore. L'unità di elaborazione centrale (CPU) si basa sulle istruzioni per eseguire calcoli e controllare i sistemi. Inoltre, le prestazioni della CPU sono spesso misurate in termini di capacità di esecuzione delle istruzioni (ad esempio, il tempo di esecuzione).</p>
<h2 id="What-are-Advanced-Vector-Extensions" class="common-anchor-header">Cosa sono le estensioni vettoriali avanzate?<button data-href="#What-are-Advanced-Vector-Extensions" class="anchor-icon" translate="no">
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
    </button></h2><p>Le Advanced Vector Extensions (AVX) sono un set di istruzioni per microprocessori che si basano sulla famiglia di architetture x86. Proposte per la prima volta da Intel nel marzo 2008, le AVX hanno ottenuto un ampio sostegno tre anni dopo con il lancio di Sandy Bridge - una microarchitettura utilizzata nella seconda generazione di processori Intel Core (ad esempio, Core i7, i5, i3) - e della microarchitettura concorrente di AMD, rilasciata anch'essa nel 2011, Bulldozer.</p>
<p>AVX ha introdotto un nuovo schema di codifica, nuove funzionalità e nuove istruzioni. AVX2 espande la maggior parte delle operazioni sugli interi a 256 bit e introduce le operazioni di moltiplicazione-accumulazione fuse (FMA). AVX-512 espande le operazioni AVX a 512 bit utilizzando una nuova codifica del prefisso EVEX (enhanced vector extension).</p>
<p><a href="https://milvus.io/docs">Milvus</a> è un database vettoriale open-source progettato per la ricerca di similarità e le applicazioni di intelligenza artificiale (AI). La piattaforma supporta il set di istruzioni AVX-512, il che significa che può essere utilizzata con tutte le CPU che includono le istruzioni AVX-512. Milvus ha ampie applicazioni che spaziano dai sistemi di raccomandazione, alla computer vision, all'elaborazione del linguaggio naturale (NLP) e altro ancora. Questo articolo presenta i risultati e l'analisi delle prestazioni di un database vettoriale Milvus su AVX-512 e AVX2.</p>
<h2 id="Milvus-performance-on-AVX-512-vs-AVX2" class="common-anchor-header">Prestazioni di Milvus su AVX-512 e AVX2<button data-href="#Milvus-performance-on-AVX-512-vs-AVX2" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="System-configuration" class="common-anchor-header">Configurazione del sistema</h3><ul>
<li>CPU: CPU Intel® Platinum 8163 @ 2,50GHz24 core 48 threads</li>
<li>Numero di CPU: 2</li>
<li>Scheda grafica, GeForce RTX 2080Ti 11GB 4 schede</li>
<li>Memoria: 768 GB</li>
<li>Disco: 2TB SSD</li>
</ul>
<h3 id="Milvus-parameters" class="common-anchor-header">Parametri di Milvus</h3><ul>
<li>cahce.cahe_size: 25, La dimensione della memoria della CPU utilizzata per la cache dei dati per una query più veloce.</li>
<li>nlist: 4096</li>
<li>nprobe: 128</li>
</ul>
<p>Nota: <code translate="no">nlist</code> è il parametro di indicizzazione da creare dal client; <code translate="no">nprobe</code> il parametro di ricerca. Sia IVF_FLAT che IVF_SQ8 utilizzano un algoritmo di clustering per suddividere un gran numero di vettori in bucket; <code translate="no">nlist</code> è il numero totale di bucket da suddividere durante il clustering. Il primo passo di una query consiste nel trovare il numero di bucket che sono più vicini al vettore target e il secondo passo consiste nel trovare i vettori top-k in questi bucket confrontando la distanza dei vettori. <code translate="no">nprobe</code> si riferisce al numero di bucket nel primo passo.</p>
<h3 id="Dataset-SIFT10M-dataset" class="common-anchor-header">Set di dati: Set di dati SIFT10M</h3><p>Questi test utilizzano il <a href="https://archive.ics.uci.edu/ml/datasets/SIFT10M">dataset SIFT10M</a>, che contiene un milione di vettori a 128 dimensioni ed è spesso utilizzato per analizzare le prestazioni dei corrispondenti metodi di ricerca nearest-neighbor. Il tempo di ricerca top-1 per nq = [1, 10, 100, 500, 1000] sarà confrontato tra i due set di istruzioni.</p>
<h3 id="Results-by-vector-index-type" class="common-anchor-header">Risultati per tipo di indice vettoriale</h3><p>Gli<a href="https://zilliz.com/blog/Accelerating-Similarity-Search-on-Really-Big-Data-with-Vector-Indexing">indici vettoriali</a> sono strutture di dati efficienti dal punto di vista del tempo e dello spazio costruite sul campo vettoriale di una collezione utilizzando vari modelli matematici. L'indicizzazione vettoriale consente di effettuare ricerche efficienti su grandi insiemi di dati quando si cerca di identificare vettori simili a un vettore di input. A causa della natura dispendiosa in termini di tempo del recupero accurato, la maggior parte dei tipi di indice <a href="https://milvus.io/docs/v2.0.x/index.md#CPU">supportati da Milvus</a> utilizza la ricerca approssimativa del vicino (ANN).</p>
<p>Per questi test sono stati utilizzati tre indici con AVX-512 e AVX2: IVF_FLAT, IVF_SQ8 e HNSW.</p>
<h3 id="IVFFLAT" class="common-anchor-header">IVF_FLAT</h3><p>Il file invertito (IVF_FLAT) è un tipo di indice basato sulla quantizzazione. È l'indice FIV più elementare e i dati codificati memorizzati in ogni unità sono coerenti con i dati originali. L'indice divide i dati vettoriali in un certo numero di unità di cluster (nlist), quindi confronta le distanze tra il vettore di input di destinazione e il centro di ciascun cluster. A seconda del numero di cluster che il sistema è impostato per interrogare (nprobe), i risultati della ricerca di similarità vengono restituiti in base al confronto tra l'input di destinazione e i vettori nei cluster più simili, riducendo drasticamente il tempo di interrogazione. Regolando nprobe, è possibile trovare un equilibrio ideale tra precisione e velocità per un determinato scenario.</p>
<p><strong>Risultati delle prestazioni</strong> <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/IVF_FLAT_3688377fc8.png" alt="IVF_FLAT.png" class="doc-image" id="ivf_flat.png" /><span>IVF_FLAT.png</span> </span></p>
<h3 id="IVFSQ8" class="common-anchor-header">IVF_SQ8</h3><p>IVF_FLAT non esegue alcuna compressione, pertanto i file di indice che produce hanno all'incirca le stesse dimensioni dei dati vettoriali originali non indicizzati. Quando le risorse di memoria del disco, della CPU o della GPU sono limitate, IVF_SQ8 è un'opzione migliore di IVF_FLAT. Questo tipo di indice è in grado di convertire ogni dimensione del vettore originale da un numero in virgola mobile a quattro byte a un intero senza segno a un byte, eseguendo una quantizzazione scalare. Questo riduce il consumo di memoria su disco, CPU e GPU del 70-75%.</p>
<p><strong>Risultati delle prestazioni</strong> <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/IVF_SQ_8_bed28307f7.png" alt="IVF_SQ8.png" class="doc-image" id="ivf_sq8.png" /><span>IVF_SQ8.png</span> </span></p>
<h3 id="HNSW" class="common-anchor-header">HNSW</h3><p>Hierarchical Small World Graph (HNSW) è un algoritmo di indicizzazione basato su grafi. Le interrogazioni iniziano nel livello più alto trovando il nodo più vicino all'obiettivo, quindi scendono al livello successivo per un altro ciclo di ricerca. Dopo diverse iterazioni, può avvicinarsi rapidamente alla posizione del target.</p>
<p><strong>Risultati delle prestazioni</strong> <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/HNSW_52aba39214.png" alt="HNSW.png" class="doc-image" id="hnsw.png" /><span>HNSW.png</span> </span></p>
<h2 id="Comparing-vector-indexes" class="common-anchor-header">Confronto tra gli indici vettoriali<button data-href="#Comparing-vector-indexes" class="anchor-icon" translate="no">
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
    </button></h2><p>Il recupero dei vettori è sempre più veloce con il set di istruzioni AVX-512 che con AVX2. Questo perché AVX-512 supporta il calcolo a 512 bit, rispetto ai soli 256 bit di AVX2. Teoricamente, l'AVX-512 dovrebbe essere due volte più veloce dell'AVX2, ma Milvus esegue altri compiti che richiedono molto tempo oltre al calcolo della similarità vettoriale. È improbabile che il tempo complessivo di recupero dell'AVX-512 sia doppio rispetto all'AVX2 in scenari reali. <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/comparison_a64b92f1dd.png" alt="comparison.png" class="doc-image" id="comparison.png" /><span>comparison.png</span> </span></p>
<p>Il recupero è significativamente più veloce sull'indice HNSW rispetto agli altri due indici, mentre il recupero IVF_SQ8 è leggermente più veloce di IVF_FLAT su entrambi i set di istruzioni. Questo è probabilmente dovuto al fatto che IVF_SQ8 richiede solo il 25% della memoria necessaria a IVF_FLAT. IVF_SQ8 carica 1 byte per ogni dimensione del vettore, mentre IVF_FLAT carica 4 byte per ogni dimensione del vettore. Il tempo necessario per il calcolo è probabilmente limitato dalla larghezza di banda della memoria. Di conseguenza, IVF_SQ8 non solo occupa meno spazio, ma richiede anche meno tempo per recuperare i vettori.</p>
<h2 id="Milvus-is-a-versatile-high-performance-vector-database" class="common-anchor-header">Milvus è un database vettoriale versatile e ad alte prestazioni.<button data-href="#Milvus-is-a-versatile-high-performance-vector-database" class="anchor-icon" translate="no">
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
    </button></h2><p>I test presentati in questo articolo dimostrano che Milvus offre prestazioni eccellenti su entrambi i set di istruzioni AVX-512 e AVX2 utilizzando diversi indici. Indipendentemente dal tipo di indice, Milvus ha prestazioni migliori su AVX-512.</p>
<p>Milvus è compatibile con diverse piattaforme di deep learning e viene utilizzato in varie applicazioni di IA. <a href="https://zilliz.com/news/lfaidata-launches-milvus-2.0-an-advanced-cloud-native-vector-database-built-for-ai">Milvus 2.0</a>, una versione rinnovata del database vettoriale più famoso al mondo, è stato rilasciato con licenza open-source nel luglio 2021. Per ulteriori informazioni sul progetto, consultare le seguenti risorse:</p>
<ul>
<li>Trovare o contribuire a Milvus su <a href="https://github.com/milvus-io/milvus/">GitHub</a>.</li>
<li>Interagire con la comunità via <a href="https://join.slack.com/t/milvusio/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ">Slack</a>.</li>
<li>Connettersi con noi su <a href="https://twitter.com/milvusio">Twitter</a>.</li>
</ul>
