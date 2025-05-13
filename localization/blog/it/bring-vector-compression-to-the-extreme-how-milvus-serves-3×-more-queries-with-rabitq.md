---
id: >-
  bring-vector-compression-to-the-extreme-how-milvus-serves-3×-more-queries-with-rabitq.md
title: >-
  Portare la compressione vettoriale all'estremo: come Milvus serve 3 volte di
  più le query con RaBitQ
author: 'Alexandr Guzhva, Li Liu, Jiang Chen'
date: 2025-05-13T00:00:00.000Z
desc: >-
  Scoprite come Milvus sfrutta RaBitQ per migliorare l'efficienza della ricerca
  vettoriale, riducendo i costi di memoria e mantenendo la precisione. Imparate
  a ottimizzare le vostre soluzioni AI oggi stesso!
cover: >-
  assets.zilliz.com/Bring_Vector_Compression_to_the_Extreme_How_Milvus_Serves_3_More_Queries_with_Ra_Bit_Q_12f5b4d932.jpg
tag: Engineering
recommend: true
publishToMedium: true
tags: 'Milvus, vector database, vector search, AI Agents, LLM'
meta_keywords: >-
  Vector Quantization, binary quantization, RaBitQ, vector compression, Milvus
  vector database
meta_title: >
  Bring Vector Compression to the Extreme: How Milvus Serves 3× More Queries
  with RaBitQ
origin: >-
  https://milvus.io/blog/bring-vector-compression-to-the-extreme-how-milvus-serves-3×-more-queries-with-rabitq.md
---
<p><a href="https://milvus.io/docs/overview.md">Milvus</a> è un database vettoriale open-source e altamente scalabile che alimenta la ricerca semantica su scala di miliardi di vettori. Quando gli utenti implementano chatbot RAG, servizio clienti AI e ricerca visuale a queste dimensioni, emerge una sfida comune: i <strong>costi dell'infrastruttura.</strong> Al contrario, la crescita esponenziale delle aziende è entusiasmante, ma non lo è l'aumento vertiginoso dei costi del cloud. La ricerca vettoriale veloce richiede in genere l'archiviazione dei vettori in memoria, che è costosa. Naturalmente ci si può chiedere: <em>possiamo comprimere i vettori per risparmiare spazio senza sacrificare la qualità della ricerca?</em></p>
<p>La risposta è <strong>sì</strong> e in questo blog vi mostreremo come l'implementazione di una tecnica innovativa chiamata <a href="https://dl.acm.org/doi/pdf/10.1145/3654970"><strong>RaBitQ</strong></a> permetta a Milvus di servire un traffico 3 volte superiore con un costo di memoria inferiore, mantenendo un'accuratezza comparabile. Condivideremo anche le lezioni pratiche apprese dall'integrazione di RaBitQ in Milvus open-source e nel servizio Milvus completamente gestito su <a href="https://zilliz.com/cloud">Zilliz Cloud</a>.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Bring_Vector_Compression_to_the_Extreme_How_Milvus_Serves_3_More_Queries_with_Ra_Bit_Q_12f5b4d932.jpg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Understanding-Vector-Search-and-Compression" class="common-anchor-header">Capire la ricerca vettoriale e la compressione<button data-href="#Understanding-Vector-Search-and-Compression" class="anchor-icon" translate="no">
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
    </button></h2><p>Prima di immergerci in RaBitQ, cerchiamo di capire la sfida.</p>
<p>Gli algoritmi di ricerca<a href="https://zilliz.com/glossary/anns"><strong>approssimativa dei vicini (RNA)</strong></a> sono il cuore di un database vettoriale, in quanto trovano i primi-k vettori più vicini a una determinata query. Un vettore è una coordinata nello spazio ad alta dimensione, spesso composta da centinaia di numeri in virgola mobile. Con l'aumentare dei dati vettoriali, aumentano anche le richieste di archiviazione e di calcolo. Per esempio, l'esecuzione di <a href="https://zilliz.com/learn/hierarchical-navigable-small-worlds-HNSW">HNSW</a> (un algoritmo di ricerca ANN) con un miliardo di vettori a 768 dimensioni in FP32 richiede oltre 3 TB di memoria!</p>
<p>Come l'MP3 comprime l'audio scartando le frequenze impercettibili all'orecchio umano, i dati vettoriali possono essere compressi con un impatto minimo sulla precisione della ricerca. Le ricerche dimostrano che l'FP32 a piena precisione spesso non è necessario per la RNA. La<a href="https://zilliz.com/learn/scalar-quantization-and-product-quantization"> quantizzazione scalare</a> (SQ), una tecnica di compressione molto diffusa, mappa i valori in virgola mobile in bins discreti e memorizza solo gli indici dei bins usando numeri interi a basso numero di bit. I metodi di quantizzazione riducono significativamente l'uso della memoria, rappresentando le stesse informazioni con un minor numero di bit. La ricerca in questo campo cerca di ottenere il massimo risparmio con la minima perdita di accuratezza.</p>
<p>La tecnica di compressione più estrema, la Quantizzazione scalare a 1 bit, nota anche come <a href="https://zilliz.com/learn/scalar-quantization-and-product-quantization">Quantizzazione binaria, rappresenta</a>ogni galleggiante con un solo bit. Rispetto a FP32 (codifica a 32 bit), questa tecnica riduce l'utilizzo della memoria di 32×. Poiché la memoria è spesso il principale collo di bottiglia nella ricerca vettoriale, questa compressione può aumentare significativamente le prestazioni. <strong>La sfida, tuttavia, consiste nel preservare l'accuratezza della ricerca.</strong> In genere, SQ a 1 bit riduce il richiamo al di sotto del 70%, rendendolo praticamente inutilizzabile.</p>
<p>È qui che si distingue <strong>RaBitQ</strong>, un'eccellente tecnica di compressione che consente di ottenere una quantizzazione a 1 bit mantenendo un'elevata precisione di ricerca. Milvus supporta RaBitQ a partire dalla versione 2.6, consentendo al database vettoriale di servire 3 volte il QPS mantenendo un livello di accuratezza comparabile.</p>
<h2 id="A-Brief-Intro-to-RaBitQ" class="common-anchor-header">Breve introduzione a RaBitQ<button data-href="#A-Brief-Intro-to-RaBitQ" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://dl.acm.org/doi/pdf/10.1145/3654970">RaBitQ</a> è un metodo di quantizzazione binaria progettato in modo intelligente che sfrutta la proprietà geometrica dello spazio ad alta dimensione per ottenere una compressione vettoriale efficiente e accurata.</p>
<p>A prima vista, ridurre ogni dimensione di un vettore a un singolo bit può sembrare troppo aggressivo, ma nello spazio ad alta dimensione le nostre intuizioni spesso ci deludono. Come<a href="https://dev.to/gaoj0017/quantization-in-the-counterintuitive-high-dimensional-space-4feg"> ha illustrato</a> Jianyang Gao, autore di RaBitQ, i vettori ad alta dimensione presentano la proprietà che le singole coordinate tendono a concentrarsi strettamente intorno allo zero, come risultato di un fenomeno controintuitivo spiegato in<a href="https://en.wikipedia.org/wiki/Concentration_of_measure"> Concentrazione della misura</a>. Ciò consente di scartare gran parte della precisione originale, pur conservando la struttura relativa necessaria per una ricerca accurata dei vicini.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_The_counterintuitive_value_distribution_in_high_dimensional_geometry_fad6143bfd.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Figura: La distribuzione controintuitiva dei valori nella geometria ad alta dimensione. <em>Si consideri il valore della prima dimensione per un vettore unitario casuale uniformemente campionato dalla sfera unitaria; i valori sono uniformemente distribuiti nello spazio 3D. Tuttavia, per lo spazio ad alta dimensione (ad esempio, 1000D), i valori si concentrano intorno allo zero, una proprietà non intuitiva della geometria ad alta dimensione. (Fonte immagine: <a href="https://dev.to/gaoj0017/quantization-in-the-counterintuitive-high-dimensional-space-4feg">Quantization in The Counterintuitive High-Dimensional Space</a>)</em></p>
<p>Ispirandosi a questa proprietà dello spazio ad alta dimensione, <strong>RaBitQ si concentra sulla codifica delle informazioni angolari piuttosto che sulle coordinate spaziali esatte</strong>. Lo fa normalizzando ogni vettore di dati rispetto a un punto di riferimento, come il centroide del set di dati. Ogni vettore viene quindi mappato sul vertice più vicino dell'ipercubo, consentendo una rappresentazione con un solo bit per dimensione. Questo approccio si estende naturalmente a <code translate="no">IVF_RABITQ</code>, dove la normalizzazione viene effettuata rispetto al centroide del cluster più vicino, migliorando l'accuratezza della codifica locale.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_Compressing_a_vector_by_finding_its_closest_approximation_on_the_hypercube_so_that_each_dimension_can_be_represented_with_just_1_bit_cd0d50bb30.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figura: Comprimere un vettore trovando la sua approssimazione più vicina sull'ipercubo, in modo che ogni dimensione possa essere rappresentata con un solo bit. (Fonte immagine:</em> <a href="https://dev.to/gaoj0017/quantization-in-the-counterintuitive-high-dimensional-space-4feg"><em>Quantization in The Counterintuitive High-Dimensional Space</em></a><em>)</em></p>
<p>Per garantire che la ricerca rimanga affidabile anche con rappresentazioni così compresse, RaBitQ introduce uno <strong>stimatore teoricamente fondato e imparziale</strong> per la distanza tra un vettore di query e i vettori di documenti quantizzati in modo binario. Questo aiuta a minimizzare l'errore di ricostruzione e a sostenere un elevato richiamo.</p>
<p>RaBitQ è anche altamente compatibile con altre tecniche di ottimizzazione, come<a href="https://www.vldb.org/pvldb/vol9/p288-andre.pdf"> FastScan</a> e il<a href="https://github.com/facebookresearch/faiss/wiki/Pre--and-post-processing"> preprocesso di rotazione casuale</a>. Inoltre, RaBitQ è <strong>leggero da addestrare e veloce da eseguire</strong>. L'addestramento comporta la semplice determinazione del segno di ogni componente vettoriale, mentre la ricerca è accelerata dalle veloci operazioni bitwise supportate dalle moderne CPU. L'insieme di queste ottimizzazioni consente a RaBitQ di offrire una ricerca ad alta velocità con una perdita minima di precisione.</p>
<h2 id="Engineering-RaBitQ-in-Milvus-From-Academic-Research-to-Production" class="common-anchor-header">Ingegnerizzazione di RaBitQ in Milvus: dalla ricerca accademica alla produzione<button data-href="#Engineering-RaBitQ-in-Milvus-From-Academic-Research-to-Production" class="anchor-icon" translate="no">
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
    </button></h2><p>Sebbene RaBitQ sia concettualmente semplice e accompagnato da un'<a href="https://github.com/gaoj0017/RaBitQ"> implementazione di riferimento</a>, il suo adattamento in un database vettoriale distribuito e di livello produttivo come Milvus ha presentato diverse sfide ingegneristiche. Abbiamo implementato RaBitQ in Knowhere, il motore di ricerca vettoriale alla base di Milvus, e abbiamo anche contribuito con una versione ottimizzata alla libreria di ricerca ANN open-source<a href="https://github.com/facebookresearch/faiss"> FAISS</a>.</p>
<p>Vediamo come abbiamo dato vita a questo algoritmo in Milvus.</p>
<h3 id="Implementation-Tradeoffs" class="common-anchor-header">Scambi di implementazione</h3><p>Un'importante decisione di progettazione riguardava la gestione dei <strong>dati ausiliari per vettore</strong>. RaBitQ richiede due valori in virgola mobile per vettore precalcolati durante l'indicizzazione e un terzo valore che può essere calcolato al volo o precalcolato. In Knowhere, abbiamo scelto di precompilare questo valore al momento dell'indicizzazione e di memorizzarlo per migliorare l'efficienza della ricerca. L'implementazione di FAISS, invece, conserva la memoria calcolandola al momento dell'interrogazione, con un diverso compromesso tra utilizzo della memoria e velocità dell'interrogazione.</p>
<p>Un'importante decisione progettuale riguarda la gestione dei <strong>dati ausiliari per vettore</strong>. RaBitQ richiede due valori in virgola mobile per vettore precalcolati durante l'indicizzazione e un terzo valore che può essere calcolato al volo o precalcolato. In Knowhere, abbiamo precalcolato questo valore al momento dell'indicizzazione e lo abbiamo memorizzato per migliorare l'efficienza della ricerca. L'implementazione di FAISS, invece, conserva la memoria calcolandola al momento dell'interrogazione, con un diverso compromesso tra utilizzo della memoria e velocità dell'interrogazione.</p>
<h3 id="Hardware-Acceleration" class="common-anchor-header">Accelerazione hardware</h3><p>Le moderne CPU offrono istruzioni specializzate che possono accelerare in modo significativo le operazioni binarie. Abbiamo adattato il kernel di calcolo della distanza per sfruttare le moderne istruzioni della CPU. Poiché RaBitQ si basa su operazioni popcount, abbiamo creato un percorso specializzato in Knowhere che utilizza le istruzioni <code translate="no">VPOPCNTDQ</code> per AVX512, quando disponibili. Sull'hardware supportato (ad esempio, Intel IceLake o AMD Zen 4), questo può accelerare i calcoli della distanza binaria di diversi fattori rispetto alle implementazioni predefinite.</p>
<h3 id="Query-Optimization" class="common-anchor-header">Ottimizzazione delle query</h3><p>Sia Knowhere (il motore di ricerca di Milvus) che la nostra versione ottimizzata di FAISS supportano la quantizzazione scalare (SQ1-SQ8) sui vettori di query. Ciò offre una maggiore flessibilità: anche con la quantizzazione a 4 bit, il richiamo rimane elevato mentre i requisiti computazionali diminuiscono in modo significativo, il che è particolarmente utile quando le query devono essere elaborate con un elevato throughput.</p>
<p>Abbiamo fatto un ulteriore passo avanti nell'ottimizzazione del nostro motore proprietario Cardinal, che alimenta il Milvus completamente gestito su Zilliz Cloud. Oltre alle capacità del Milvus open-source, introduciamo miglioramenti avanzati, tra cui l'integrazione con un indice vettoriale a grafo, ulteriori livelli di ottimizzazione e il supporto per le istruzioni Arm SVE.</p>
<h2 id="The-Performance-Gain-3×-More-QPS-with-Comparable-Accuracy" class="common-anchor-header">Il guadagno in termini di prestazioni: 3 volte più QPS con una precisione paragonabile<button data-href="#The-Performance-Gain-3×-More-QPS-with-Comparable-Accuracy" class="anchor-icon" translate="no">
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
    </button></h2><p>A partire dalla versione 2.6, Milvus introduce il nuovo tipo di indice <code translate="no">IVF_RABITQ</code>. Questo nuovo indice combina RaBitQ con il clustering IVF, la trasformazione di rotazione casuale e il raffinamento opzionale per offrire un equilibrio ottimale di prestazioni, efficienza della memoria e precisione.</p>
<h3 id="Using-IVFRABITQ-in-Your-Application" class="common-anchor-header">Utilizzo di IVF_RABITQ nelle applicazioni</h3><p>Ecco come implementare <code translate="no">IVF_RABITQ</code> nella vostra applicazione Milvus:</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient

index_params = MilvusClient.prepare_index_params()

index_params.add_index(
    field_name=<span class="hljs-string">&quot;your_vector_field_name&quot;</span>, <span class="hljs-comment"># Name of the vector field to be indexed</span>
    index_type=<span class="hljs-string">&quot;IVF_RABITQ&quot;</span>, <span class="hljs-comment"># Will be introduced in Milvus 2.6</span>
    index_name=<span class="hljs-string">&quot;vector_index&quot;</span>, <span class="hljs-comment"># Name of the index to create</span>
    metric_type=<span class="hljs-string">&quot;IP&quot;</span>, <span class="hljs-comment"># IVF_RABITQ supports IP and COSINE</span>
    params={
        <span class="hljs-string">&quot;nlist&quot;</span>: <span class="hljs-number">1024</span>, <span class="hljs-comment"># IVF param, specifies the number of clusters</span>
    } <span class="hljs-comment"># Index building params</span>
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Benchmarking-Numbers-Tell-the-Story" class="common-anchor-header">Benchmarking: I numeri raccontano la storia</h3><p>Abbiamo effettuato il benchmarking di diverse configurazioni utilizzando<a href="https://github.com/zilliztech/vectordbbench"> vdb-bench</a>, uno strumento di benchmarking open-source per la valutazione dei database vettoriali. Sia l'ambiente di prova che quello di controllo utilizzano Milvus Standalone distribuito su istanze AWS EC2 <code translate="no">m6id.2xlarge</code>. Queste macchine dispongono di 8 vCPU, 32 GB di RAM e di una CPU Intel Xeon 8375C basata sull'architettura Ice Lake, che supporta il set di istruzioni VPOPCNTDQ AVX-512.</p>
<p>Abbiamo utilizzato il Search Performance Test di vdb-bench, con un set di dati di 1 milione di vettori, ciascuno con 768 dimensioni. Poiché la dimensione predefinita dei segmenti in Milvus è di 1 GB e il dataset grezzo (768 dimensioni × 1M di vettori × 4 byte per float) ammonta a circa 3 GB, il benchmarking ha coinvolto più segmenti per database.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_Example_test_configuration_in_vdb_bench_000142f634.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Figura: Esempio di configurazione del test in vdb-bench.</p>
<p>Ecco alcuni dettagli di basso livello sulle manopole di configurazione per IVF, RaBitQ e il processo di raffinamento:</p>
<ul>
<li><p><code translate="no">nlist</code> e <code translate="no">nprobe</code> sono parametri standard per tutti i metodi basati su <code translate="no">IVF</code></p></li>
<li><p><code translate="no">nlist</code> è un intero non negativo che specifica il numero totale di bucket FIV per l'insieme di dati.</p></li>
<li><p><code translate="no">nprobe</code> è un intero non negativo che specifica il numero di bucket FIV visitati per un singolo vettore di dati durante il processo di ricerca. È un parametro legato alla ricerca.</p></li>
<li><p><code translate="no">rbq_bits_query</code> specifica il livello di quantizzazione di un vettore di query. Usare i valori 1...8 per i livelli di quantizzazione <code translate="no">SQ1</code>...<code translate="no">SQ8</code>. Utilizzare il valore 0 per disabilitare la quantizzazione. È un parametro legato alla ricerca.</p></li>
<li><p><code translate="no">refine</code>I parametri <code translate="no">refine_type</code> e <code translate="no">refine_k</code> sono parametri standard per il processo di raffinazione.</p></li>
<li><p><code translate="no">refine</code> è un booleano che abilita la strategia di raffinamento.</p></li>
<li><p><code translate="no">refine_k</code> è un valore fp non negativo. Il processo di raffinazione utilizza un metodo di quantizzazione di qualità superiore per scegliere il numero necessario di vicini da un pool di candidati <code translate="no">refine_k</code> più ampio, scelto con <code translate="no">IVFRaBitQ</code>. È un parametro legato alla ricerca.</p></li>
<li><p><code translate="no">refine_type</code> è una stringa che specifica il tipo di quantizzazione per un indice di raffinazione. Le opzioni disponibili sono <code translate="no">SQ6</code>, <code translate="no">SQ8</code>, <code translate="no">FP16</code>, <code translate="no">BF16</code> e <code translate="no">FP32</code> / <code translate="no">FLAT</code>.</p></li>
</ul>
<p>I risultati rivelano importanti intuizioni:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_Cost_and_performance_comparison_of_baseline_IVF_FLAT_IVF_SQ_8_and_IVF_RABITQ_with_different_refinement_strategies_9f69fa449f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Figura: Confronto dei costi e delle prestazioni di base (IVF_FLAT), IVF_SQ8 e IVF_RABITQ con diverse strategie di raffinamento</p>
<p>Rispetto all'indice di base <code translate="no">IVF_FLAT</code>, che raggiunge 236 QPS con un richiamo del 95,2%, <code translate="no">IVF_RABITQ</code> raggiunge un throughput significativamente più elevato: 648 QPS con query FP32 e 898 QPS se abbinato a query SQ8-quantizzate. Questi numeri dimostrano il vantaggio prestazionale di RaBitQ, soprattutto quando viene applicato il refinement.</p>
<p>Tuttavia, queste prestazioni comportano un notevole compromesso in termini di richiamo. Quando <code translate="no">IVF_RABITQ</code> viene utilizzato senza raffinatezza, il richiamo si attesta intorno al 76%, un valore che può risultare insufficiente per le applicazioni che richiedono un'elevata accuratezza. Detto questo, il raggiungimento di questo livello di richiamo utilizzando una compressione vettoriale a 1 bit è comunque impressionante.</p>
<p>Il raffinamento è essenziale per recuperare l'accuratezza. Quando è configurato con la query SQ8 e il refinement SQ8, <code translate="no">IVF_RABITQ</code> offre prestazioni e richiamo eccellenti. Mantiene un elevato richiamo del 94,7%, quasi uguale a IVF_FLAT, mentre raggiunge 864 QPS, oltre 3 volte superiore a IVF_FLAT. Anche rispetto a un altro popolare indice di quantizzazione <code translate="no">IVF_SQ8</code>, <code translate="no">IVF_RABITQ</code> con il raffinamento SQ8 raggiunge più della metà del throughput con un richiamo simile, solo con un costo marginalmente maggiore. Questo lo rende un'opzione eccellente per gli scenari che richiedono sia velocità che precisione.</p>
<p>In breve, <code translate="no">IVF_RABITQ</code> da solo è ottimo per massimizzare il throughput con un richiamo accettabile, e diventa ancora più potente se abbinato al raffinamento per colmare il divario qualitativo, utilizzando solo una frazione dello spazio di memoria rispetto a <code translate="no">IVF_FLAT</code>.</p>
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
    </button></h2><p>RaBitQ segna un significativo progresso nella tecnologia di quantizzazione vettoriale. Combinando la quantizzazione binaria con strategie di codifica intelligenti, raggiunge ciò che sembrava impossibile: una compressione estrema con una perdita minima di precisione.</p>
<p>A partire dalla prossima versione 2.6, Milvus introdurrà IVF_RABITQ, integrando questa potente tecnica di compressione con le strategie di clustering e raffinamento IVF per portare la quantizzazione binaria in produzione. Questa combinazione crea un equilibrio pratico tra precisione, velocità ed efficienza della memoria che può trasformare i carichi di lavoro della ricerca vettoriale.</p>
<p>Ci impegniamo a portare altre innovazioni come questa sia in Milvus open-source che nel suo servizio completamente gestito su Zilliz Cloud, rendendo la ricerca vettoriale più efficiente e accessibile a tutti.</p>
<p>Rimanete sintonizzati per il rilascio di Milvus 2.6 con molte altre potenti funzionalità e unitevi alla nostra comunità su<a href="https://milvus.io/discord"> milvus.io/discord</a> per saperne di più, condividere le vostre esperienze o porre domande.</p>
