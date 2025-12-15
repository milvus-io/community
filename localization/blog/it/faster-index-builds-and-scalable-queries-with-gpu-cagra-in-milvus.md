---
id: faster-index-builds-and-scalable-queries-with-gpu-cagra-in-milvus.md
title: >-
  Ottimizzazione di NVIDIA CAGRA in Milvus: un approccio ibrido GPU-CPU per
  un'indicizzazione più rapida e query meno costose
author: Marcelo Chen
date: 2025-12-10T00:00:00.000Z
cover: assets.zilliz.com/CAGRA_cover_7b9675965f.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus2.6, CAGRA, GPU, CPU, graph-based index'
meta_title: |
  Optimizing CAGRA in Milvus: A Hybrid GPU–CPU Approach
desc: >-
  Scoprite come GPU_CAGRA in Milvus 2.6 utilizza le GPU per la costruzione
  rapida dei grafi e le CPU per il servizio scalabile delle query.
origin: >-
  https://milvus.io/blog/faster-index-builds-and-scalable-queries-with-gpu-cagra-in-milvus.md
---
<p>Man mano che i sistemi di intelligenza artificiale passano dagli esperimenti alle infrastrutture di produzione, i database vettoriali non hanno più a che fare con milioni di incorporazioni. <strong>Miliardi sono ormai una routine e decine di miliardi sono sempre più comuni.</strong> Su questa scala, le scelte algoritmiche non solo influenzano le prestazioni e il richiamo, ma si traducono direttamente nel costo dell'infrastruttura.</p>
<p>Questo porta a una domanda fondamentale per le implementazioni su larga scala: <strong>come scegliere l'indice giusto per garantire un richiamo e una latenza accettabili senza che l'utilizzo delle risorse di calcolo vada fuori controllo?</strong></p>
<p>Gli indici basati su grafici come <strong>NSW, HNSW, CAGRA e Vamana</strong> sono diventati la risposta più diffusa. Navigando in grafi di vicinato precostituiti, questi indici consentono una rapida ricerca del vicinato più vicino su scala miliardaria, evitando la scansione bruta e il confronto di ogni vettore con la query.</p>
<p>Tuttavia, il profilo dei costi di questo approccio non è uniforme. <strong>Interrogare un grafo è relativamente economico, ma non lo è costruirlo.</strong> La costruzione di un grafo di alta qualità richiede calcoli di distanza su larga scala e un affinamento iterativo sull'intero set di dati, carichi che le risorse CPU tradizionali faticano a gestire in modo efficiente con la crescita dei dati.</p>
<p>NVIDIA CAGRA affronta questo collo di bottiglia utilizzando le GPU per accelerare la costruzione dei grafi grazie a un parallelismo massiccio. Se da un lato questo riduce in modo significativo i tempi di creazione, dall'altro l'affidamento alle GPU sia per la costruzione degli indici che per l'esecuzione delle query introduce costi più elevati e vincoli di scalabilità negli ambienti di produzione.</p>
<p>Per bilanciare questi compromessi, <a href="https://milvus.io/docs/release_notes.md#v261">Milvus 2.6.1</a> <strong>adotta un design ibrido per gli</strong> <strong>indici</strong> <a href="https://milvus.io/docs/gpu-cagra.md">GPU_CAGRA</a>: <strong>Le GPU vengono utilizzate solo per la costruzione dei grafi, mentre l'esecuzione delle query viene eseguita dalle CPU.</strong> Questa soluzione preserva i vantaggi qualitativi dei grafi costruiti dalle GPU, pur mantenendo il servizio di query scalabile ed efficiente dal punto di vista dei costi, il che la rende particolarmente adatta ai carichi di lavoro con aggiornamenti dei dati poco frequenti, grandi volumi di query e una forte sensibilità ai costi.</p>
<h2 id="What-Is-CAGRA-and-How-Does-It-Work" class="common-anchor-header">Cos'è CAGRA e come funziona?<button data-href="#What-Is-CAGRA-and-How-Does-It-Work" class="anchor-icon" translate="no">
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
    </button></h2><p>Gli indici vettoriali basati su grafi rientrano generalmente in due categorie principali:</p>
<ul>
<li><p><strong>Costruzione iterativa del grafo</strong>, rappresentata da <strong>CAGRA</strong> (già supportato in Milvus).</p></li>
<li><p><strong>Costruzione del grafo basata sull'inserimento</strong>, rappresentata da <strong>Vamana</strong> (attualmente in fase di sviluppo in Milvus).</p></li>
</ul>
<p>Questi due approcci differiscono in modo significativo nei loro obiettivi di progettazione e nelle loro basi tecniche, rendendo ciascuno di essi adatto a diverse scale di dati e modelli di carico di lavoro.</p>
<p><strong>NVIDIA CAGRA (CUDA ANN Graph-based)</strong> è un algoritmo nativo per GPU per la ricerca approssimata dei vicini (ANN), progettato per costruire e interrogare in modo efficiente grafi di prossimità su larga scala. Sfruttando il parallelismo delle GPU, CAGRA accelera significativamente la costruzione dei grafi e offre prestazioni di interrogazione ad alto rendimento rispetto agli approcci basati su CPU come HNSW.</p>
<p>CAGRA si basa sull'algoritmo <strong>NN-Descent (Nearest Neighbor Descent)</strong>, che costruisce un grafo k-nearest-neighbor (kNN) attraverso un affinamento iterativo. In ogni iterazione, i candidati vicini vengono valutati e aggiornati, convergendo gradualmente verso relazioni di vicinato di qualità superiore in tutto il set di dati.</p>
<p>Dopo ogni ciclo di affinamento, CAGRA applica ulteriori tecniche di potatura del grafo, come la <strong>potatura delle deviazioni a 2 hop, per</strong>rimuovere i bordi ridondanti e preservare la qualità della ricerca. Questa combinazione di affinamento e potatura iterativa produce un <strong>grafo compatto ma ben connesso</strong>, efficiente da attraversare al momento dell'interrogazione.</p>
<p>Grazie a ripetuti affinamenti e potature, CAGRA produce una struttura a grafo che supporta <strong>un elevato richiamo e una ricerca nearest-neighbor a bassa latenza su larga scala</strong>, rendendola particolarmente adatta a dataset statici o aggiornati di rado.</p>
<h3 id="Step-1-Building-the-Initial-Graph-with-NN-Descent" class="common-anchor-header">Fase 1: costruzione del grafo iniziale con NN-Descent</h3><p>NN-Descent si basa su una semplice ma potente osservazione: se il nodo <em>u</em> è un vicino di <em>v</em> e il nodo <em>w</em> è un vicino di <em>u</em>, allora è molto probabile che anche <em>w</em> sia un vicino di <em>v</em>. Questa proprietà transitiva permette all'algoritmo di costruire il grafico iniziale con NN-Descent. Questa proprietà transitiva permette all'algoritmo di scoprire in modo efficiente i veri vicini, senza confrontare in modo esaustivo ogni coppia di vettori.</p>
<p>CAGRA utilizza l'NN-Descent come algoritmo di base per la costruzione dei grafi. Il processo funziona come segue:</p>
<p><strong>1. Inizializzazione casuale:</strong> Ogni nodo inizia con un piccolo insieme di vicini selezionati a caso, formando un grafo iniziale approssimativo.</p>
<p><strong>2. Espansione dei vicini:</strong> In ogni iterazione, un nodo raccoglie i suoi vicini attuali e i loro vicini per formare un elenco di candidati. L'algoritmo calcola le somiglianze tra il nodo e tutti i candidati. Poiché l'elenco dei candidati di ciascun nodo è indipendente, questi calcoli possono essere assegnati a blocchi di thread GPU separati ed eseguiti in parallelo su scala massiva.</p>
<p><strong>3. Aggiornamento dell'elenco dei candidati:</strong> se l'algoritmo trova candidati più vicini degli attuali vicini del nodo, scambia i vicini più lontani e aggiorna l'elenco kNN del nodo. Nel corso di più iterazioni, questo processo produce un grafo kNN approssimativo di qualità molto più elevata.</p>
<p><strong>4. Controllo della convergenza:</strong> Con l'avanzare delle iterazioni, si verifica un minor numero di aggiornamenti dei vicini. Quando il numero di connessioni aggiornate scende al di sotto di una soglia stabilita, l'algoritmo si ferma, indicando che il grafo si è effettivamente stabilizzato.</p>
<p>Poiché l'espansione dei vicini e il calcolo della similarità per i diversi nodi sono completamente indipendenti, CAGRA mappa il carico di lavoro di NN-Descent di ciascun nodo su un blocco di thread GPU dedicato. Questo design consente un parallelismo massiccio e rende la costruzione del grafo più veloce di ordini di grandezza rispetto ai metodi tradizionali basati sulla CPU.</p>
<h3 id="Step-2-Pruning-the-Graph-with-2-Hop-Detours" class="common-anchor-header">Fase 2: potatura del grafo con deviazioni a 2 hop</h3><p>Al termine di NN-Descent, il grafo risultante è accurato ma eccessivamente denso. NN-Descent mantiene intenzionalmente altri candidati vicini e la fase di inizializzazione casuale introduce molti bordi deboli o irrilevanti. Di conseguenza, ogni nodo finisce spesso per avere un grado due volte, o anche più volte, superiore a quello desiderato.</p>
<p>Per produrre un grafo compatto ed efficiente, CAGRA applica la potatura delle deviazioni a 2 hop.</p>
<p>L'idea è semplice: se il nodo <em>A</em> può raggiungere il nodo <em>B</em> indirettamente attraverso un vicino condiviso <em>C</em> (formando un percorso A → C → B), e la distanza di questo percorso indiretto è paragonabile alla distanza diretta tra <em>A</em> e <em>B</em>, allora il bordo diretto A → B è considerato ridondante e può essere rimosso.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2_hop_detours_d15eae8702.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Un vantaggio fondamentale di questa strategia di potatura è che la verifica della ridondanza di ogni bordo dipende solo da informazioni locali: le distanze tra i due punti finali e i loro vicini condivisi. Poiché ogni bordo può essere valutato in modo indipendente, la fase di potatura è altamente parallelizzabile e si adatta naturalmente all'esecuzione batch su GPU.</p>
<p>Di conseguenza, CAGRA è in grado di sfoltire il grafo in modo efficiente sulle GPU, riducendo l'overhead di memorizzazione del <strong>40-50%</strong>, preservando l'accuratezza della ricerca e migliorando la velocità di attraversamento durante l'esecuzione delle query.</p>
<h2 id="GPUCAGRA-in-Milvus-What’s-Different" class="common-anchor-header">GPU_CAGRA in Milvus: cosa c'è di diverso?<button data-href="#GPUCAGRA-in-Milvus-What’s-Different" class="anchor-icon" translate="no">
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
    </button></h2><p>Sebbene le GPU offrano grandi vantaggi in termini di prestazioni per la costruzione di grafi, gli ambienti di produzione devono affrontare una sfida pratica: Le risorse delle GPU sono molto più costose e limitate rispetto alle CPU. Se la costruzione degli indici e l'esecuzione delle query dipendono esclusivamente dalle GPU, emergono rapidamente diversi problemi operativi:</p>
<ul>
<li><p><strong>Basso utilizzo delle risorse:</strong> Il traffico di query è spesso irregolare e discontinuo, lasciando le GPU inattive per lunghi periodi e sprecando la costosa capacità di calcolo.</p></li>
<li><p><strong>Elevati costi di implementazione:</strong> L'assegnazione di una GPU a ogni istanza di query fa lievitare i costi dell'hardware, anche se la maggior parte delle query non utilizza appieno le prestazioni della GPU.</p></li>
<li><p><strong>Scalabilità limitata:</strong> Il numero di GPU disponibili influisce direttamente sul numero di repliche del servizio che è possibile eseguire, limitando la capacità di scalare in base alla domanda.</p></li>
<li><p><strong>Flessibilità ridotta:</strong> Quando sia la creazione di indici che l'esecuzione di query dipendono dalle GPU, il sistema diventa vincolato alla disponibilità delle GPU e non può facilmente spostare i carichi di lavoro sulle CPU.</p></li>
</ul>
<p>Per risolvere questi vincoli, Milvus 2.6.1 introduce una modalità di implementazione flessibile per l'indice GPU_CAGRA attraverso il parametro <code translate="no">adapt_for_cpu</code>. Questa modalità consente un flusso di lavoro ibrido: CAGRA utilizza la GPU per costruire un indice di grafi di alta qualità, mentre l'esecuzione delle query viene eseguita dalla CPU, tipicamente utilizzando HNSW come algoritmo di ricerca.</p>
<p>In questa configurazione, le GPU vengono utilizzate dove offrono il massimo valore - costruzione di indici veloci e di alta precisione - mentre le CPU gestiscono carichi di lavoro di query su larga scala in modo molto più economico e scalabile.</p>
<p>Di conseguenza, questo approccio ibrido è particolarmente adatto per i carichi di lavoro in cui:</p>
<ul>
<li><p><strong>Gli aggiornamenti dei dati sono poco frequenti</strong>, quindi le ricostruzioni degli indici sono rare.</p></li>
<li><p><strong>Il volume delle query è elevato</strong> e richiede molte repliche poco costose.</p></li>
<li><p><strong>La sensibilità ai costi è elevata</strong> e l'uso delle GPU deve essere strettamente controllato.</p></li>
</ul>
<h3 id="Understanding-adaptforcpu" class="common-anchor-header">Comprensione <code translate="no">adapt_for_cpu</code></h3><p>In Milvus, il parametro <code translate="no">adapt_for_cpu</code> controlla il modo in cui un indice CAGRA viene serializzato su disco durante la creazione dell'indice e come viene deserializzato in memoria al momento del caricamento. Modificando questa impostazione al momento della creazione e del caricamento, Milvus può passare in modo flessibile dalla costruzione dell'indice basata sulla GPU all'esecuzione della query basata sulla CPU.</p>
<p>Diverse combinazioni di <code translate="no">adapt_for_cpu</code> in fase di compilazione e di caricamento danno luogo a quattro modalità di esecuzione, ciascuna progettata per uno specifico scenario operativo.</p>
<table>
<thead>
<tr><th style="text-align:center"><strong>Tempo di creazione (<code translate="no">adapt_for_cpu</code>)</strong></th><th style="text-align:center"><strong>Tempo di caricamento (<code translate="no">adapt_for_cpu</code>)</strong></th><th style="text-align:center"><strong>Logica di esecuzione</strong></th><th style="text-align:center"><strong>Scenario consigliato</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center"><strong>vero</strong></td><td style="text-align:center"><strong>vero</strong></td><td style="text-align:center">Costruire con GPU_CAGRA → serializzare come HNSW → deserializzare come HNSW → <strong>interrogare la CPU</strong></td><td style="text-align:center">Carichi di lavoro sensibili ai costi; servizio di query su larga scala</td></tr>
<tr><td style="text-align:center"><strong>vero</strong></td><td style="text-align:center"><strong>falso</strong></td><td style="text-align:center">Costruire con GPU_CAGRA → serializzare come HNSW → deserializzare come HNSW → <strong>interrogazione CPU</strong></td><td style="text-align:center">Le query successive passano alla CPU in caso di mancata corrispondenza dei parametri</td></tr>
<tr><td style="text-align:center"><strong>falso</strong></td><td style="text-align:center"><strong>vero</strong></td><td style="text-align:center">Creazione con GPU_CAGRA → serializzazione come CAGRA → deserializzazione come HNSW → <strong>interrogazione CPU</strong></td><td style="text-align:center">Mantenimento dell'indice CAGRA originale per la memorizzazione e abilitazione di una ricerca temporanea da parte della CPU</td></tr>
<tr><td style="text-align:center"><strong>falso</strong></td><td style="text-align:center"><strong>falso</strong></td><td style="text-align:center">Creare con GPU_CAGRA → serializzare come CAGRA → deserializzare come CAGRA → <strong>interrogazione GPU</strong></td><td style="text-align:center">Carichi di lavoro critici per le prestazioni in cui il costo è secondario</td></tr>
</tbody>
</table>
<p><strong>Nota:</strong> il meccanismo <code translate="no">adapt_for_cpu</code> supporta solo la conversione unidirezionale. Un indice CAGRA può essere convertito in HNSW perché la struttura del grafo CAGRA conserva tutte le relazioni di vicinato di cui HNSW ha bisogno. Tuttavia, un indice HNSW non può essere riconvertito in CAGRA, poiché manca delle informazioni strutturali aggiuntive necessarie per l'interrogazione basata su GPU. Di conseguenza, le impostazioni del tempo di compilazione devono essere scelte con attenzione, tenendo conto dei requisiti di distribuzione e interrogazione a lungo termine.</p>
<h2 id="Putting-GPUCAGRA-to-the-Test" class="common-anchor-header">Mettere GPU_CAGRA alla prova<button data-href="#Putting-GPUCAGRA-to-the-Test" class="anchor-icon" translate="no">
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
    </button></h2><p>Per valutare l'efficacia del modello di esecuzione ibrido - che utilizza le GPU per la costruzione degli indici e le CPU per l'esecuzione delle query - abbiamo condotto una serie di esperimenti controllati in un ambiente standardizzato. La valutazione si concentra su tre dimensioni: <strong>prestazioni di costruzione dell'indice</strong>, <strong>prestazioni delle query</strong> e <strong>precisione di richiamo</strong>.</p>
<p><strong>Setup sperimentale</strong></p>
<p>Gli esperimenti sono stati eseguiti su hardware ampiamente adottato e standard del settore per garantire che i risultati rimangano affidabili e ampiamente applicabili.</p>
<ul>
<li><p>CPU: Processore MD EPYC 7R13 (16 cpu)</p></li>
<li><p>GPU: NVIDIA L4</p></li>
</ul>
<h3 id="1-Index-Build-Performance" class="common-anchor-header">1. Prestazioni della costruzione dell'indice</h3><p>Confrontiamo CAGRA costruito sulla GPU con HNSW costruito sulla CPU, con lo stesso grado di grafo target di 64.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/cp1_a177200ab2.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Risultati principali</strong></p>
<ul>
<li><p><strong>CAGRA su GPU costruisce indici 12-15 volte più velocemente di HNSW su CPU.</strong> Sia su Cohere1M che su Gist1M, CAGRA basato su GPU supera significativamente HNSW basato su CPU, evidenziando l'efficienza del parallelismo GPU durante la costruzione del grafo.</p></li>
<li><p><strong>Il tempo di costruzione aumenta linearmente con le iterazioni di NN-Descent.</strong> All'aumentare del numero di iterazioni, il tempo di costruzione cresce in modo quasi lineare, riflettendo la natura di raffinamento iterativo di NN-Descent e fornendo un compromesso prevedibile tra costo di costruzione e qualità del grafo.</p></li>
</ul>
<h3 id="2-Query-performance" class="common-anchor-header">2. Prestazioni della query</h3><p>In questo esperimento, il grafo CAGRA viene costruito una volta sulla GPU e poi interrogato utilizzando due diversi percorsi di esecuzione:</p>
<ul>
<li><p><strong>Interrogazione su CPU</strong>: l'indice viene deserializzato in formato HNSW e ricercato sulla CPU.</p></li>
<li><p><strong>Interrogazione su GPU</strong>: la ricerca viene eseguita direttamente sul grafo CAGRA utilizzando una traversale basata su GPU.</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/cp2_bd00e60553.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Risultati principali</strong></p>
<ul>
<li><p><strong>Il throughput della ricerca su GPU è 5-6 volte superiore a quello della ricerca su CPU.</strong> Sia in Cohere1M che in Gist1M, l'attraversamento basato su GPU offre un QPS sostanzialmente superiore, evidenziando l'efficienza della navigazione parallela dei grafi su GPU.</p></li>
<li><p><strong>Il richiamo aumenta con le iterazioni di NN-Descent, per poi raggiungere un plateau.</strong> Con l'aumento del numero di iterazioni di costruzione, il richiamo migliora sia per le interrogazioni su CPU che su GPU. Tuttavia, oltre un certo punto, ulteriori iterazioni producono guadagni decrescenti, indicando che la qualità del grafo è ampiamente convergente.</p></li>
</ul>
<h3 id="3-Recall-accuracy" class="common-anchor-header">3. Accuratezza del richiamo</h3><p>In questo esperimento, sia CAGRA che HNSW sono stati interrogati sulla CPU per confrontare il richiamo in condizioni di interrogazione identiche.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/cp3_1a46a7bdda.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Risultati principali</strong></p>
<p><strong>CAGRA ottiene un richiamo superiore a quello di HNSW su entrambi i set di dati</strong>, dimostrando che anche quando un indice CAGRA viene costruito sulla GPU e deserializzato per la ricerca sulla CPU, la qualità del grafo è ben conservata.</p>
<h2 id="What’s-Next-Scaling-Index-Construction-with-Vamana" class="common-anchor-header">Il prossimo passo: Scalare la costruzione degli indici con Vamana<button data-href="#What’s-Next-Scaling-Index-Construction-with-Vamana" class="anchor-icon" translate="no">
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
    </button></h2><p>L'approccio ibrido GPU-CPU di Milvus offre una soluzione pratica e conveniente per gli attuali carichi di lavoro di ricerca vettoriale su larga scala. Costruendo grafi CAGRA di alta qualità sulle GPU e servendo le query sulle CPU, Milvus combina una rapida costruzione dell'indice con un'esecuzione delle query scalabile e conveniente, particolarmente<strong>adatta a carichi di lavoro con aggiornamenti poco frequenti, volumi di query elevati e vincoli di costo stringenti.</strong></p>
<p>Su scale ancora più grandi - decine<strong>o centinaia di miliardi di vettori - la</strong>costruzione<strong>dell'indice</strong>stesso diventa il collo di bottiglia. Quando l'intero set di dati non può più essere inserito nella memoria della GPU, il settore si rivolge tipicamente a metodi di <strong>costruzione del grafo basati su inserti</strong>, come <strong>Vamana</strong>. Invece di costruire il grafo tutto in una volta, Vamana elabora i dati in batch, inserendo in modo incrementale nuovi vettori e mantenendo la connettività globale.</p>
<p>La sua pipeline di costruzione segue tre fasi fondamentali:</p>
<p><strong>1. Crescita geometrica dei lotti</strong>: si inizia con piccoli lotti per formare un grafo scheletrico, poi si aumentano le dimensioni dei lotti per massimizzare il parallelismo e infine si usano grandi lotti per perfezionare i dettagli.</p>
<p><strong>2. Inserimento avido</strong> - ogni nuovo nodo viene inserito navigando da un punto di ingresso centrale, affinando iterativamente il suo insieme di vicini.</p>
<p><strong>3. Aggiornamenti dei bordi all'indietro</strong> - aggiunta di connessioni inverse per preservare la simmetria e garantire una navigazione efficiente del grafo.</p>
<p>La potatura è integrata direttamente nel processo di costruzione utilizzando il criterio α-RNG: se un candidato vicino <em>v</em> è già coperto da un vicino esistente <em>p′</em> (cioè, <em>d(p′, v) &lt; α × d(p, v)</em>), allora <em>v</em> viene potato. Il parametro α consente un controllo preciso della spazialità e dell'accuratezza. L'accelerazione su GPU è ottenuta attraverso il parallelismo in-batch e il batch scaling geometrico, trovando un equilibrio tra qualità dell'indice e throughput.</p>
<p>Insieme, queste tecniche consentono ai team di gestire la rapida crescita dei dati e gli aggiornamenti degli indici su larga scala senza incorrere in limiti di memoria della GPU.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/One_more_thing_b458360e25.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Il team di Milvus sta sviluppando attivamente il supporto per Vamana, con un rilascio previsto per la prima metà del 2026. Restate sintonizzati.</p>
<p>Avete domande o volete un approfondimento su una qualsiasi funzionalità dell'ultima versione di Milvus? Unitevi al nostro<a href="https://discord.com/invite/8uyFbECzPX"> canale Discord</a> o inviate problemi su<a href="https://github.com/milvus-io/milvus"> GitHub</a>. È anche possibile prenotare una sessione individuale di 20 minuti per ottenere approfondimenti, indicazioni e risposte alle vostre domande tramite<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus Office Hours</a>.</p>
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
<li><p><a href="https://milvus.io/blog/data-in-and-data-out-in-milvus-2-6.md">Introduzione alla funzione Embedding: Come Milvus 2.6 semplifica la vettorializzazione e la ricerca semantica</a></p></li>
<li><p><a href="https://milvus.io/blog/json-shredding-in-milvus-faster-json-filtering-with-flexibility.md">Triturazione JSON in Milvus: filtraggio JSON 88,9 volte più veloce e flessibile</a></p></li>
<li><p><a href="https://milvus.io/blog/unlocking-true-entity-level-retrieval-new-array-of-structs-and-max-sim-capabilities-in-milvus.md">Il vero recupero a livello di entità: Nuove funzionalità Array-of-Structs e MAX_SIM in Milvus</a></p></li>
<li><p><a href="https://milvus.io/blog/minhash-lsh-in-milvus-the-secret-weapon-for-fighting-duplicates-in-llm-training-data.md">MinHash LSH in Milvus: l'arma segreta per combattere i duplicati nei dati di addestramento LLM </a></p></li>
<li><p><a href="https://milvus.io/blog/bring-vector-compression-to-the-extreme-how-milvus-serves-3%C3%97-more-queries-with-rabitq.md">Portare la compressione vettoriale all'estremo: come Milvus serve 3 volte di più le query con RaBitQ</a></p></li>
<li><p><a href="https://milvus.io/blog/benchmarks-lie-vector-dbs-deserve-a-real-test.md">I benchmark mentono: i DB vettoriali meritano un test reale </a></p></li>
<li><p><a href="https://milvus.io/blog/we-replaced-kafka-pulsar-with-a-woodpecker-for-milvus.md">Abbiamo sostituito Kafka/Pulsar con un Picchio per Milvus</a></p></li>
</ul>
