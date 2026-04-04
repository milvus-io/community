---
id: turboquant-rabitq-vector-database-cost.md
title: >-
  Oltre il dibattito TurboQuant-RaBitQ: perché la quantizzazione vettoriale è
  importante per i costi dell'infrastruttura di IA
author: Li Liu
date: 2026-4-2
cover: assets.zilliz.com/vectorquantization_0bea9e6bec.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  TurboQuant, RaBitQ, vector quantization, TurboQuant vs RaBitQ, vector database
  memory optimization
meta_title: |
  Vector Quantization: Beyond the TurboQuant-RaBitQ Debate
desc: >-
  Il dibattito TurboQuant-RaBitQ ha fatto notizia sulla quantizzazione
  vettoriale. Come funziona la compressione a 1 bit RaBitQ e come Milvus offre
  IVF_RABITQ per un risparmio di memoria del 97%.
origin: 'https://milvus.io/blog/turboquant-rabitq-vector-database-cost.md'
---
<p>Il documento TurboQuant di Google (ICLR 2026) ha riportato una compressione della cache KV pari a 6 volte con una perdita di accuratezza prossima allo zero: risultati così eclatanti da cancellare <a href="https://www.cnbc.com/2026/03/26/google-ai-turboquant-memory-chip-stocks-samsung-micron.html"> 90 miliardi di dollari dalle azioni dei chip di memoria</a> in un solo giorno. SK Hynix ha perso il 12%. Samsung ha perso il 7%.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Beyond_the_Turbo_Quant_Ra_Bit_Q_Debate_How_Vector_Quantization_Is_Reshaping_AI_Infrastructure_from_Paper_to_Production_1_825845eccb.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Il documento ha subito attirato l'attenzione. <a href="https://gaoj0017.github.io/">Jianyang Gao</a>, primo autore di <a href="https://dl.acm.org/doi/10.1145/3654970">RaBitQ</a> (SIGMOD 2024), ha <a href="https://medium.com/@gaojianyang0017/turboquant-and-rabitq-what-the-public-story-gets-wrong-23df83209c22">sollevato dubbi</a> sulla relazione tra la metodologia di TurboQuant e il suo precedente lavoro sulla quantizzazione vettoriale. (Pubblicheremo presto una conversazione con il Dr. Gao - seguiteci se siete interessati).</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Beyond_the_Turbo_Quant_Ra_Bit_Q_Debate_How_Vector_Quantization_Is_Reshaping_AI_Infrastructure_from_Paper_to_Production_2_0860406cae.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Questo articolo non intende prendere posizione in questa discussione. Quello che ci ha colpito è qualcosa di più grande: il fatto che un singolo articolo sulla <a href="https://milvus.io/docs/index-explained.md">quantizzazione vettoriale</a> possa muovere un valore di mercato di 90 miliardi di dollari dimostra quanto questa tecnologia sia diventata fondamentale per l'infrastruttura dell'intelligenza artificiale. Che si tratti di comprimere la cache KV nei motori di inferenza o di comprimere gli indici nei <a href="https://zilliz.com/learn/what-is-vector-database">database vettoriali</a>, la capacità di ridurre i dati ad alta dimensionalità preservando la qualità ha enormi implicazioni in termini di costi - ed è un problema su cui abbiamo lavorato, integrando RaBitQ nel database vettoriale <a href="https://milvus.io/">Milvus</a> e trasformandolo in infrastruttura di produzione.</p>
<p>Ecco cosa tratteremo: perché la quantizzazione vettoriale è così importante in questo momento, come si confrontano TurboQuant e RaBitQ, cos'è e come funziona RaBitQ, il lavoro di ingegneria che ha portato alla sua distribuzione all'interno di Milvus e come si presenta il panorama più ampio dell'ottimizzazione della memoria per le infrastrutture di intelligenza artificiale.</p>
<h2 id="Why-Does-Vector-Quantization-Matter-for-Infrastructure-Costs" class="common-anchor-header">Perché la quantizzazione vettoriale è importante per i costi dell'infrastruttura?<button data-href="#Why-Does-Vector-Quantization-Matter-for-Infrastructure-Costs" class="anchor-icon" translate="no">
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
    </button></h2><p>La quantizzazione vettoriale non è una novità. Ciò che è nuovo è l'urgenza con cui il settore ne ha bisogno. Negli ultimi due anni, i parametri LLM sono aumentati, le finestre di contesto sono passate da 4K a 128K+ token e i dati non strutturati - testo, immagini, audio, video - sono diventati un input di prima classe per i sistemi di IA. Ognuna di queste tendenze crea un numero maggiore di vettori ad alta dimensionalità che devono essere memorizzati, indicizzati e ricercati. Più vettori, più memoria, più costi.</p>
<p>Se gestite la ricerca vettoriale su scala - <a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">pipeline RAG</a>, motori di raccomandazione, recupero multimodale - il costo della memoria è probabilmente uno dei vostri maggiori problemi di infrastruttura.</p>
<p>Durante l'implementazione del modello, tutti i principali stack di inferenza LLM si affidano alla <a href="https://zilliz.com/glossary/kv-cache">cache KV</a>, che memorizza le coppie chiave-valore precedentemente calcolate, in modo che il meccanismo di attenzione non le ricompili per ogni nuovo token. È questo che rende possibile l'inferenza O(n) invece di O(n²). Ogni struttura, da <a href="https://github.com/vllm-project/vllm">vLLM</a> a <a href="https://github.com/NVIDIA/TensorRT-LLM">TensorRT-LLM</a>, ne dipende. Ma la cache KV può consumare più memoria della GPU rispetto ai pesi del modello stesso. Contesti più lunghi, un maggior numero di utenti simultanei, e la spirale si accelera.</p>
<p>La stessa pressione si ripercuote sui database vettoriali: miliardi di vettori ad alta dimensionalità in memoria, ognuno dei quali è un float a 32 bit per dimensione. La quantizzazione vettoriale comprime questi vettori da float a 32 bit a rappresentazioni a 4, 2 o addirittura 1 bit, riducendo la memoria del 90% o più. Che si tratti della cache KV nel motore di inferenza o degli indici nel database vettoriale, la matematica sottostante è la stessa e i risparmi sono reali. Ecco perché un singolo articolo che riporta una scoperta in questo settore ha spostato il valore in borsa di 90 miliardi di dollari.</p>
<h2 id="TurboQuant-vs-RaBitQ-Whats-the-Difference" class="common-anchor-header">TurboQuant vs RaBitQ: qual è la differenza?<button data-href="#TurboQuant-vs-RaBitQ-Whats-the-Difference" class="anchor-icon" translate="no">
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
    </button></h2><p>Sia TurboQuant che RaBitQ si basano sulla stessa tecnica di base: l'applicazione di una rotazione casuale<a href="https://arxiv.org/abs/2406.03482">(trasformazione di Johnson-Lindenstrauss</a>) ai vettori di ingresso prima della quantizzazione. Questa rotazione trasforma i dati distribuiti in modo irregolare in una distribuzione uniforme prevedibile, rendendo più facile la quantizzazione con un errore ridotto.</p>
<p>Al di là di questa base condivisa, i due sistemi sono destinati a problemi diversi e adottano approcci diversi:</p>
<table>
<thead>
<tr><th></th><th>TurboQuant</th><th>RaBitQ</th></tr>
</thead>
<tbody>
<tr><td><strong>Obiettivo</strong></td><td>KV cache nell'inferenza LLM (dati effimeri, per richiesta)</td><td>Indici vettoriali persistenti nei database (dati memorizzati)</td></tr>
<tr><td><strong>Approccio</strong></td><td>A due stadi: PolarQuant (quantizzatore scalare Lloyd-Max per coordinata) + <a href="https://arxiv.org/abs/2406.03482">QJL</a> (correzione del residuo a 1 bit)</td><td>Singolo stadio: proiezione dell'ipercubo + stimatore di distanza unbiased</td></tr>
<tr><td><strong>Larghezza dei bit</strong></td><td>Chiavi a 3 bit, valori a 2 bit (precisione mista)</td><td>1 bit per dimensione (con varianti a più bit disponibili)</td></tr>
<tr><td><strong>Affermazione teorica</strong></td><td>Tasso di distorsione MSE quasi ottimale</td><td>Errore di stima del prodotto interno asintoticamente ottimale (corrispondente ai limiti inferiori di Alon-Klartag)</td></tr>
<tr><td><strong>Stato di produzione</strong></td><td>Implementazioni comunitarie; nessun rilascio ufficiale da parte di Google</td><td>Fornito in <a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md">Milvus 2.6</a>, adottato da Faiss, VSAG, Elasticsearch</td></tr>
</tbody>
</table>
<p>La differenza fondamentale per i professionisti: TurboQuant ottimizza la cache KV transitoria all'interno di un motore di inferenza, mentre RaBitQ si rivolge agli indici persistenti che un database vettoriale costruisce, suddivide e interroga su miliardi di vettori. Nel resto dell'articolo ci concentreremo su RaBitQ, l'algoritmo che abbiamo integrato e messo in produzione all'interno di Milvus.</p>
<h2 id="What-Is-RaBitQ-and-What-Does-It-Deliver" class="common-anchor-header">Cos'è RaBitQ e cosa offre?<button data-href="#What-Is-RaBitQ-and-What-Does-It-Deliver" class="anchor-icon" translate="no">
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
    </button></h2><p>Ecco il risultato: su un set di dati di 10 milioni di vettori a 768 dimensioni, RaBitQ comprime ogni vettore a 1/32 della sua dimensione originale, mantenendo il richiamo al di sopra del 94%. In Milvus, ciò si traduce in un throughput di query 3,6 volte superiore rispetto a un indice a precisione completa. Non si tratta di una proiezione teorica, bensì di un risultato di benchmark ottenuto con Milvus 2.6.</p>
<p>Ora, come ci si arriva.</p>
<p>La quantizzazione binaria tradizionale comprime i vettori FP32 a 1 bit per dimensione - una compressione di 32 volte. Il compromesso: il richiamo crolla perché si è buttata via troppa informazione. <a href="https://arxiv.org/abs/2405.12497">RaBitQ</a> (Gao &amp; Long, SIGMOD 2024) mantiene la stessa compressione di 32x, ma conserva le informazioni che contano davvero per la ricerca. Una <a href="https://arxiv.org/abs/2409.09913">versione estesa</a> (Gao &amp; Long, SIGMOD 2025) dimostra che è asintoticamente ottimale, eguagliando i limiti inferiori teorici stabiliti da Alon &amp; Klartag (FOCS 2017).</p>
<h3 id="Why-Do-Angles-Matter-More-Than-Coordinates-in-High-Dimensions" class="common-anchor-header">Perché gli angoli contano più delle coordinate nelle alte dimensioni?</h3><p>L'intuizione chiave: <strong>in dimensioni elevate, gli angoli tra vettori sono più stabili e informativi dei valori delle singole coordinate.</strong> Si tratta di una conseguenza della concentrazione delle misure, lo stesso fenomeno che fa funzionare le proiezioni casuali di Johnson-Lindenstrauss.</p>
<p>In pratica, questo significa che è possibile scartare i valori esatti delle coordinate di un vettore ad alta dimensione e mantenere solo la sua direzione rispetto al set di dati. Le relazioni angolari, da cui dipende la <a href="https://zilliz.com/glossary/anns">ricerca del nearest-neighbor</a>, sopravvivono alla compressione.</p>
<h3 id="How-Does-RaBitQ-Work" class="common-anchor-header">Come funziona RaBitQ?</h3><p>RaBitQ trasforma questa intuizione geometrica in tre fasi:</p>
<p><strong>Fase 1: Normalizzazione.</strong> Centrare ogni vettore rispetto al centroide del set di dati e scalare a lunghezza unitaria. Questo converte il problema in una stima del prodotto interno tra vettori unitari, più facile da analizzare e da limitare.</p>
<p><strong>Fase 2: rotazione casuale + proiezione dell'ipercubo.</strong> Applicare una matrice ortogonale casuale (una rotazione di tipo Johnson-Lindenstrauss) per eliminare le distorsioni verso qualsiasi asse. Proiettare ogni vettore ruotato sul vertice più vicino di un ipercubo {±1/√D}^D. Ogni dimensione si riduce a un singolo bit. Il risultato è un codice binario a D bit per ogni vettore.</p>
<p><strong>Fase 3: stima imparziale della distanza.</strong> Costruire uno stimatore per il prodotto interno tra una query e il vettore originale (non quantizzato). Lo stimatore è dimostrabile come imparziale e l'errore è limitato da O(1/√D). Per vettori a 768 dimensioni, il richiamo è superiore al 94%.</p>
<p>Il calcolo della distanza tra vettori binari si riduce a AND bitwise + popcount, operazioni che le moderne CPU eseguono in un solo ciclo. È questo che rende RaBitQ veloce, non solo piccolo.</p>
<h3 id="Why-Is-RaBitQ-Practical-Not-Just-Theoretical" class="common-anchor-header">Perché RaBitQ è pratico, non solo teorico?</h3><ul>
<li><strong>Non è necessario alcun addestramento.</strong> Si applica la rotazione e si controllano i segni. Nessuna ottimizzazione iterativa, nessun apprendimento del codebook. Il tempo di indicizzazione è paragonabile alla <a href="https://milvus.io/docs/ivf-pq.md">quantizzazione del prodotto</a>.</li>
<li><strong>Facile da usare per l'hardware.</strong> Il calcolo della distanza è bitwise AND + popcount. Le moderne CPU (Intel IceLake+, AMD Zen 4+) hanno istruzioni AVX512VPOPCNTDQ dedicate. La stima di un singolo vettore è 3 volte più veloce delle tabelle di ricerca PQ.</li>
<li><strong>Flessibilità multi-bit.</strong> La <a href="https://vectordb-ntu.github.io/RaBitQ-Library/">libreria RaBitQ</a> supporta varianti oltre 1 bit: 4 bit raggiungono un richiamo del 90%, 5 bit del 95%, 7 bit del 99%, il tutto senza reranking.</li>
<li><strong>Compostabile.</strong> Si inserisce nelle strutture di indici esistenti, come gli <a href="https://milvus.io/docs/ivf-flat.md">indici IVF</a> e i <a href="https://milvus.io/docs/hnsw.md">grafi HNSW</a>, e funziona con FastScan per il calcolo delle distanze in batch.</li>
</ul>
<h2 id="From-Paper-to-Production-What-We-Built-to-Ship-RaBitQ-in-Milvus" class="common-anchor-header">Dalla carta alla produzione: Cosa abbiamo costruito per distribuire RaBitQ in Milvus<button data-href="#From-Paper-to-Production-What-We-Built-to-Ship-RaBitQ-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Il codice originale di RaBitQ è un prototipo di ricerca a macchina singola. Per farlo funzionare in un <a href="https://milvus.io/docs/architecture_overview.md">cluster distribuito</a> con sharding, failover e ingestione in tempo reale è stato necessario risolvere quattro problemi di ingegneria. In <a href="https://zilliz.com/">Zilliz</a> siamo andati oltre la semplice implementazione dell'algoritmo: il lavoro ha riguardato l'integrazione del motore, l'accelerazione hardware, l'ottimizzazione dell'indice e la messa a punto del runtime per trasformare RaBitQ in una funzionalità di livello industriale all'interno di Milvus. Maggiori dettagli sono disponibili anche in questo blog: <a href="https://milvus.io/blog/bring-vector-compression-to-the-extreme-how-milvus-serves-3%C3%97-more-queries-with-rabitq.md">Portare la compressione vettoriale all'estremo: come Milvus serve 3 volte più query con RaBitQ</a></p>
<h3 id="Making-RaBitQ-Distributed-Ready" class="common-anchor-header">Rendere RaBitQ pronto per la distribuzione</h3><p>Abbiamo integrato RaBitQ direttamente in <a href="https://github.com/milvus-io/knowhere">Knowhere</a>, il motore di ricerca principale di Milvus, non come plugin, ma come tipo di indice nativo con interfacce unificate. Funziona con l'intera architettura distribuita di Milvus: sharding, partizionamento, scalabilità dinamica e <a href="https://milvus.io/docs/manage-collections.md">gestione delle collezioni</a>.</p>
<p>La sfida principale: rendere il codebook di quantizzazione (matrice di rotazione, vettori centroidi, parametri di scalatura) consapevole dei segmenti, in modo che ogni shard costruisca e memorizzi il proprio stato di quantizzazione. La creazione di indici, la compattazione e il bilanciamento del carico comprendono tutti il nuovo tipo di indice in modo nativo.</p>
<h3 id="Squeezing-Every-Cycle-Out-of-Popcount" class="common-anchor-header">Spremere ogni ciclo da Popcount</h3><p>La velocità di RaBitQ deriva dal popcount, il conteggio dei bit impostati nei vettori binari. L'algoritmo è intrinsecamente veloce, ma la velocità dipende dall'uso dell'hardware. Abbiamo creato percorsi di codice SIMD dedicati per entrambe le architetture server dominanti:</p>
<ul>
<li><strong>x86 (Intel IceLake+ / AMD Zen 4+):</strong> L'istruzione VPOPCNTDQ di AVX-512 calcola il popcount su più registri a 512 bit in parallelo. I loop interni di Knowhere sono ristrutturati per raggruppare i calcoli della distanza binaria in parti di ampiezza SIMD, massimizzando il throughput.</li>
<li><strong>ARM (Graviton, Ampere):</strong> Istruzioni SVE (Scalable Vector Extension) per lo stesso modello di popcount parallelo, un aspetto critico dal momento che le istanze ARM sono sempre più comuni nelle implementazioni cloud ottimizzate per i costi.</li>
</ul>
<h3 id="Eliminating-Runtime-Overhead" class="common-anchor-header">Eliminazione dell'overhead di runtime</h3><p>RaBitQ ha bisogno di parametri ausiliari in virgola mobile al momento dell'interrogazione: il centroide del set di dati, le norme per vettore e il prodotto interno tra ogni vettore quantizzato e il suo originale (usato dallo stimatore di distanza). Il calcolo di questi parametri per ogni query aggiunge latenza. La memorizzazione dei vettori originali completi vanifica lo scopo della compressione.</p>
<p>La nostra soluzione: precompilare e persistere questi parametri durante la creazione dell'indice, mettendoli in cache insieme ai codici binari. L'overhead di memoria è ridotto (pochi float per vettore), ma elimina il calcolo per ogni domanda e mantiene stabile la latenza in caso di elevata concurrency.</p>
<h3 id="IVFRABITQ-The-Index-You-Actually-Deploy" class="common-anchor-header">IVF_RABITQ: l'indice da distribuire effettivamente</h3><p>A partire da <a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md">Milvus 2.6</a>, viene fornito <a href="https://milvus.io/docs/ivf-rabitq.md">IVF_RABITQ</a> - <a href="https://milvus.io/docs/ivf-flat.md">Inverted File Index</a> + quantizzazione RaBitQ. La ricerca funziona in due fasi:</p>
<ol>
<li><strong>Ricerca grossolana (IVF).</strong> K-means suddivide lo spazio vettoriale in cluster. Al momento dell'interrogazione, vengono analizzati solo i cluster più vicini all'n-probe.</li>
<li><strong>Punteggio fine (RaBitQ).</strong> All'interno di ogni cluster, le distanze vengono stimate utilizzando codici a 1 bit e lo stimatore imparziale. Popcount fa il lavoro pesante.</li>
</ol>
<p>I risultati su un set di dati a 768 dimensioni e 10 milioni di vettori:</p>
<table>
<thead>
<tr><th>Metrica</th><th>IVF_FLAT (base)</th><th>IVF_RABITQ</th><th>IVF_RABITQ + SQ8 refine</th></tr>
</thead>
<tbody>
<tr><td>Richiamo</td><td>95.2%</td><td>94.7%</td><td>~95%</td></tr>
<tr><td>QPS</td><td>236</td><td>864</td><td>-</td></tr>
<tr><td>Ingombro della memoria</td><td>32 bit/dim</td><td>1 bit/dim (~3% dell'originale)</td><td>~25% dell'originale</td></tr>
</tbody>
</table>
<p>Per i carichi di lavoro che non possono tollerare nemmeno uno scarto di richiamo dello 0,5%, il parametro refine_type aggiunge un secondo passaggio di punteggio: SQ6, SQ8, FP16, BF16 o FP32. SQ8 è la scelta più comune: ripristina il richiamo ai livelli di IVF_FLAT a circa 1/4 della memoria originale. È inoltre possibile applicare la <a href="https://milvus.io/docs/ivf-sq8.md">quantizzazione scalare</a> al lato query (SQ1-SQ8) in modo indipendente, ottenendo così due manopole per regolare il compromesso latenza-recall-costi per ogni carico di lavoro.</p>
<h2 id="How-Milvus-Optimizes-Memory-Beyond-Quantization" class="common-anchor-header">Come Milvus ottimizza la memoria oltre la quantizzazione<button data-href="#How-Milvus-Optimizes-Memory-Beyond-Quantization" class="anchor-icon" translate="no">
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
    </button></h2><p>RaBitQ è la leva di compressione più evidente, ma è solo uno dei livelli di una più ampia <a href="https://milvus.io/blog/milvus-26-preview-72-memory-reduction-without-compromising-recall-and-4x-faster-than-elasticsearch.md">ottimizzazione della memoria</a>:</p>
<table>
<thead>
<tr><th>Strategia</th><th>Cosa fa</th><th>Impatto</th></tr>
</thead>
<tbody>
<tr><td><strong>Quantizzazione full-stack</strong></td><td>SQ8, PQ, RaBitQ a diversi compromessi precisione-costo</td><td>Riduzione della memoria da 4x a 32x</td></tr>
<tr><td><strong>Ottimizzazione della struttura degli indici</strong></td><td>Compattazione del grafo HNSW, DiskANN SSD offloading, costruzione di indici OOM-safe</td><td>Meno DRAM per indice, dataset più grandi per nodo</td></tr>
<tr><td><strong>I/O mappato in memoria (mmap)</strong></td><td>Mappatura dei file vettoriali su disco, caricamento delle pagine su richiesta tramite la cache delle pagine del sistema operativo.</td><td>Set di dati su scala TB senza caricare tutto in RAM</td></tr>
<tr><td><strong>Archiviazione a livelli</strong></td><td>Separazione dei dati caldi/caldi/freddi con pianificazione automatica</td><td>Paga il prezzo della memoria solo per i dati a cui si accede di frequente</td></tr>
<tr><td><strong>Scalabilità cloud-native</strong><a href="https://zilliz.com/cloud">(Zilliz Cloud</a>, Milvus gestito)</td><td>Allocazione elastica della memoria, rilascio automatico delle risorse inattive</td><td>Pagare solo per ciò che si usa</td></tr>
</tbody>
</table>
<h3 id="Full-Stack-Quantization" class="common-anchor-header">Quantizzazione full-stack</h3><p>La compressione estrema a 1 bit di RaBitQ non è adatta a tutti i carichi di lavoro. Milvus offre una matrice di quantizzazione completa: <a href="https://milvus.io/docs/ivf-sq8.md">SQ8</a> e <a href="https://milvus.io/docs/ivf-pq.md">quantizzazione del prodotto (PQ)</a> per i carichi di lavoro che necessitano di un compromesso equilibrato tra precisione e costo, RaBitQ per la massima compressione su insiemi di dati ultra-grandi e configurazioni ibride che combinano più metodi per un controllo a grana fine.</p>
<h3 id="Index-Structure-Optimization" class="common-anchor-header">Ottimizzazione della struttura dell'indice</h3><p>Oltre alla quantizzazione, Milvus ottimizza continuamente l'overhead della memoria nelle sue strutture di indice principali. Per <a href="https://milvus.io/docs/hnsw.md">HNSW</a>, abbiamo ridotto la ridondanza degli elenchi di adiacenza per ridurre l'uso della memoria per grafo. <a href="https://milvus.io/docs/diskann.md">DiskANN</a> spinge sia i dati vettoriali che le strutture di indice su SSD, riducendo drasticamente la dipendenza dalla DRAM per i dataset di grandi dimensioni. Abbiamo anche ottimizzato l'allocazione della memoria intermedia durante la costruzione dell'indice per evitare guasti OOM quando si costruiscono indici su insiemi di dati che si avvicinano ai limiti di memoria del nodo.</p>
<h3 id="Smart-Memory-Loading" class="common-anchor-header">Caricamento intelligente della memoria</h3><p>Il supporto <a href="https://milvus.io/docs/mmap.md">mmap</a> (memory-mapped I/O) di Milvus mappa i dati vettoriali in file su disco, affidandosi alla cache di pagina del sistema operativo per il caricamento su richiesta, senza bisogno di caricare tutti i dati in memoria all'avvio. In combinazione con le strategie di caricamento pigro e segmentato che impediscono improvvisi picchi di memoria, questo permette di operare senza problemi con dataset vettoriali di dimensioni TB a una frazione del costo della memoria.</p>
<h3 id="Tiered-Storage" class="common-anchor-header">Archiviazione a livelli</h3><p>L'<a href="https://milvus.io/docs/tiered-storage-overview.md">architettura di archiviazione a tre livelli di</a> Milvus si estende alla memoria, all'SSD e all'archiviazione a oggetti: i dati caldi rimangono in memoria per una bassa latenza, i dati caldi vengono memorizzati nella cache sull'SSD per un equilibrio tra prestazioni e costi e i dati freddi passano all'archiviazione a oggetti per ridurre al minimo l'overhead. Il sistema gestisce automaticamente lo scheduling dei dati, senza richiedere modifiche al livello applicativo.</p>
<h3 id="Cloud-Native-Scaling" class="common-anchor-header">Scalabilità nativa del cloud</h3><p>L'<a href="https://milvus.io/docs/architecture_overview.md">architettura distribuita</a> di Milvus prevede lo sharding dei dati e il bilanciamento del carico per evitare il sovraccarico della memoria di un singolo nodo. Il pooling della memoria riduce la frammentazione e migliora l'utilizzo. <a href="https://zilliz.com/cloud">Zilliz Cloud</a> (completamente gestito da Milvus) si spinge oltre con la programmazione elastica per lo scaling della memoria su richiesta - in modalità Serverless, le risorse inattive vengono rilasciate automaticamente, riducendo ulteriormente il costo totale di proprietà.</p>
<h3 id="How-These-Layers-Compound" class="common-anchor-header">Come si compongono questi livelli</h3><p>Queste ottimizzazioni non sono alternative, ma si sovrappongono. RaBitQ riduce i vettori. DiskANN mantiene l'indice su SSD. Mmap evita di caricare i dati freddi in memoria. Lo <a href="https://milvus.io/blog/milvus-tiered-storage-80-less-vector-search-cost-with-on-demand-hot–cold-data-loading.md">storage a livelli</a> spinge i dati di archivio nello storage a oggetti. Il risultato: un'implementazione che serve miliardi di vettori non ha bisogno di miliardi di vettori di RAM.</p>
<h2 id="Get-Started" class="common-anchor-header">Iniziare<button data-href="#Get-Started" class="anchor-icon" translate="no">
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
    </button></h2><p>Con la continua crescita dei volumi di dati dell'intelligenza artificiale, l'efficienza e il costo dei database vettoriali determineranno direttamente la scalabilità delle applicazioni di intelligenza artificiale. Continueremo a investire in infrastrutture vettoriali ad alte prestazioni e a basso costo, in modo che un maggior numero di applicazioni AI possa passare dal prototipo alla produzione.</p>
<p><a href="https://github.com/milvus-io/milvus">Milvus</a> è open source. Per provare IVF_RABITQ:</p>
<ul>
<li>Consultate la <a href="https://milvus.io/docs/ivf-rabitq.md">documentazione di IVF_RABITQ</a> per la configurazione e la messa a punto.</li>
<li>Leggete il <a href="https://milvus.io/blog/bring-vector-compression-to-the-extreme-how-milvus-serves-3×-more-queries-with-rabitq.md">post</a> completo <a href="https://milvus.io/blog/bring-vector-compression-to-the-extreme-how-milvus-serves-3×-more-queries-with-rabitq.md">sul blog sull'integrazione di RaBitQ</a> per i benchmark più approfonditi e i dettagli dell'implementazione.</li>
<li>Unitevi alla <a href="https://slack.milvus.io/">comunità Slack di Milvus</a> per porre domande e imparare da altri sviluppatori.</li>
<li><a href="https://milvus.io/office-hours">Prenotate una sessione gratuita di Milvus Office Hours</a> per illustrare il vostro caso d'uso.</li>
</ul>
<p>Se preferite evitare la configurazione dell'infrastruttura, <a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a> (Milvus completamente gestito) offre un livello gratuito con supporto IVF_RABITQ.</p>
<p>Prossimamente pubblicheremo un'intervista con il professor <a href="https://personal.ntu.edu.sg/c.long/">Cheng Long</a> (NTU, VectorDB@NTU) e il <a href="https://gaoj0017.github.io/">dottor Jianyang Gao</a> (ETH di Zurigo), primo autore di RaBitQ, in cui approfondiremo la teoria della quantizzazione vettoriale e le prossime novità. Lasciate le vostre domande nei commenti.</p>
<h2 id="Frequently-Asked-Questions" class="common-anchor-header">Domande frequenti<button data-href="#Frequently-Asked-Questions" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="What-are-TurboQuant-and-RaBitQ" class="common-anchor-header">Cosa sono TurboQuant e RaBitQ?</h3><p>TurboQuant (Google, ICLR 2026) e RaBitQ (Gao &amp; Long, SIGMOD 2024) sono entrambi metodi di quantizzazione vettoriale che utilizzano la rotazione casuale per comprimere vettori ad alta dimensionalità. TurboQuant mira alla compressione della cache KV nell'inferenza LLM, mentre RaBitQ mira agli indici vettoriali persistenti nei database. Entrambi hanno contribuito all'attuale ondata di interesse per la quantizzazione vettoriale, sebbene risolvano problemi diversi per sistemi diversi.</p>
<h3 id="How-does-RaBitQ-achieve-1-bit-quantization-without-destroying-recall" class="common-anchor-header">Come fa RaBitQ a ottenere una quantizzazione a 1 bit senza distruggere il richiamo?</h3><p>RaBitQ sfrutta la concentrazione delle misure negli spazi ad alta dimensione: gli angoli tra i vettori sono più stabili dei valori delle singole coordinate all'aumentare della dimensionalità. Normalizza i vettori rispetto al centroide del dataset, quindi proietta ciascuno di essi sul vertice più vicino di un ipercubo (riducendo ogni dimensione a un solo bit). Uno stimatore di distanza imparziale con un limite di errore dimostrabile mantiene la ricerca accurata nonostante la compressione.</p>
<h3 id="What-is-IVFRABITQ-and-when-should-I-use-it" class="common-anchor-header">Che cos'è IVF_RABITQ e quando si deve usare?</h3><p>IVF_RABITQ è un tipo di indice vettoriale in Milvus (disponibile dalla versione 2.6) che combina il raggruppamento inverso dei file con la quantizzazione a 1 bit RaBitQ. Raggiunge il 94,7% di richiamo e un throughput 3,6 volte superiore a IVF_FLAT, con un utilizzo della memoria pari a circa 1/32 dei vettori originali. Si può utilizzare quando si deve effettuare una ricerca vettoriale su larga scala (da milioni a miliardi di vettori) e il costo della memoria è una preoccupazione primaria, comune nei carichi di lavoro di ricerca RAG, raccomandazione e multimodale.</p>
<h3 id="How-does-vector-quantization-relate-to-KV-cache-compression-in-LLMs" class="common-anchor-header">Che rapporto c'è tra la quantizzazione vettoriale e la compressione della cache KV negli LLM?</h3><p>Entrambi i problemi riguardano la compressione di vettori in virgola mobile ad alta dimensione. La cache KV memorizza le coppie chiave-valore del meccanismo di attenzione Transformer; con lunghezze di contesto elevate, può superare i pesi del modello in termini di utilizzo della memoria. Tecniche di quantizzazione vettoriale come RaBitQ riducono questi vettori a rappresentazioni a bit inferiori. Gli stessi principi matematici - concentrazione delle misure, rotazione casuale, stima imparziale della distanza - si applicano sia che si comprimano i vettori in un indice del database sia nella cache KV di un motore di inferenza.</p>
