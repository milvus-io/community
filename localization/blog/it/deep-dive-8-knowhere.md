---
id: deep-dive-8-knowhere.md
title: Che cosa potenzia la ricerca di similarità nel database vettoriale Milvus?
author: Yudong Cai
date: 2022-05-10T00:00:00.000Z
desc: 'E no, non è Faiss.'
cover: assets.zilliz.com/Deep_Dive_8_6919720d59.png
tag: Engineering
tags: 'Data science, Database, Tech, Artificial Intelligence, Vector Management'
canonicalUrl: 'https://milvus.io/blog/deep-dive-8-knowhere.md'
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Deep_Dive_8_6919720d59.png" alt="cover image" class="doc-image" id="cover-image" />
   </span> <span class="img-wrapper"> <span>immagine di copertina</span> </span></p>
<blockquote>
<p>Questo articolo è stato scritto da <a href="https://github.com/cydrain">Yudong Cai</a> e tradotto da <a href="https://www.linkedin.com/in/yiyun-n-2aa713163/">Angela Ni</a>.</p>
</blockquote>
<p>Knowhere, il motore di esecuzione vettoriale principale, è per Milvus quello che un motore è per un'auto sportiva. Questo articolo presenta cos'è Knowhere, come si differenzia da Faiss e come è strutturato il codice di Knowhere.</p>
<p><strong>Vai a:</strong></p>
<ul>
<li><a href="#The-concept-of-Knowhere">Il concetto di Knowhere</a></li>
<li><a href="#Knowhere-in-the-Milvus-architecture">Knowhere nell'architettura Milvus</a></li>
<li><a href="#Knowhere-Vs-Faiss">Knowhere contro Faiss</a></li>
<li><a href="#Understanding-the-Knowhere-code">Capire il codice di Knowhere</a></li>
<li><a href="#Adding-indexes-to-Knowhere">Aggiungere indici a Knowhere</a></li>
</ul>
<h2 id="The-concept-of-Knowhere" class="common-anchor-header">Il concetto di Knowhere<button data-href="#The-concept-of-Knowhere" class="anchor-icon" translate="no">
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
    </button></h2><p>In senso stretto, Knowhere è un'interfaccia operativa per l'accesso ai servizi negli strati superiori del sistema e alle librerie di ricerca di similarità vettoriale come <a href="https://github.com/facebookresearch/faiss">Faiss</a>, <a href="https://github.com/nmslib/hnswlib">Hnswlib</a>, <a href="https://github.com/spotify/annoy">Annoy</a> negli strati inferiori del sistema. Inoltre, Knowhere è anche responsabile dell'elaborazione eterogenea. Più precisamente, Knowhere controlla su quale hardware (ad esempio, CPU o GPU) eseguire le richieste di creazione di indici e di ricerca. È così che Knowhere prende il suo nome: sa dove eseguire le operazioni. Nelle versioni future saranno supportati altri tipi di hardware, tra cui DPU e TPU.</p>
<p>In senso più ampio, Knowhere incorpora anche altre librerie di indici di terze parti, come Faiss. Pertanto, nel suo complesso, Knowhere è riconosciuto come il motore di calcolo vettoriale principale del database vettoriale Milvus.</p>
<p>Dal concetto di Knowhere, si evince che esso elabora solo compiti di calcolo dei dati, mentre compiti come lo sharding, il bilanciamento del carico e il disaster recovery esulano dall'ambito di lavoro di Knowhere.</p>
<p>A partire da Milvus 2.0.1, <a href="https://github.com/milvus-io/knowhere">Knowhere</a> (in senso lato) diventa indipendente dal progetto Milvus.</p>
<h2 id="Knowhere-in-the-Milvus-architecture" class="common-anchor-header">Knowhere nell'architettura di Milvus<button data-href="#Knowhere-in-the-Milvus-architecture" class="anchor-icon" translate="no">
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
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/ec63d1e9_86e1_48e3_9d75_8fed305bbcb5_26b842e9f6.png" alt="knowhere architecture" class="doc-image" id="knowhere-architecture" />
   </span> <span class="img-wrapper"> <span>architettura di knowhere</span> </span></p>
<p>Il calcolo in Milvus coinvolge principalmente operazioni vettoriali e scalari. Knowhere gestisce solo le operazioni sui vettori in Milvus. La figura sopra illustra l'architettura di Knowhere in Milvus.</p>
<p>Il livello più basso è l'hardware di sistema. Le librerie di indici di terze parti si trovano sopra l'hardware. Quindi Knowhere interagisce con il nodo indice e il nodo di interrogazione in alto tramite CGO.</p>
<p>Questo articolo parla di Knowhere nel suo senso più ampio, come indicato nella cornice blu dell'illustrazione dell'architettura.</p>
<h2 id="Knowhere-Vs-Faiss" class="common-anchor-header">Knowhere vs Faiss<button data-href="#Knowhere-Vs-Faiss" class="anchor-icon" translate="no">
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
    </button></h2><p>Knowhere non solo estende ulteriormente le funzioni di Faiss, ma ne ottimizza anche le prestazioni. In particolare, Knowhere presenta i seguenti vantaggi.</p>
<h3 id="1-Support-for-BitsetView" class="common-anchor-header">1. Supporto per BitsetView</h3><p>Inizialmente, il bitset è stato introdotto in Milvus per la &quot;cancellazione morbida&quot;. Un vettore eliminato in modo soft esiste ancora nel database, ma non viene calcolato durante una ricerca o un'interrogazione di similarità vettoriale. Ogni bit del bitset corrisponde a un vettore indicizzato. Se un vettore è contrassegnato come "1" nel bitset, significa che questo vettore è stato eliminato in modo soft e non sarà coinvolto in una ricerca vettoriale.</p>
<p>I parametri bitset vengono aggiunti a tutte le API di interrogazione dell'indice Faiss esposte in Knowhere, compresi gli indici della CPU e della GPU.</p>
<p>Per saperne di più su <a href="https://milvus.io/blog/2022-2-14-bitset.md">come bitset consente la versatilità della ricerca vettoriale</a>.</p>
<h3 id="2-Support-for-more-similarity-metrics-for-indexing-binary-vectors" class="common-anchor-header">2. Supporto per altre metriche di similarità per l'indicizzazione di vettori binari</h3><p>Oltre a <a href="https://milvus.io/docs/v2.0.x/metric.md#Hamming-distance">Hamming</a>, Knowhere supporta anche <a href="https://milvus.io/docs/v2.0.x/metric.md#Jaccard-distance">Jaccard</a>, <a href="https://milvus.io/docs/v2.0.x/metric.md#Tanimoto-distance">Tanimoto</a>, <a href="https://milvus.io/docs/v2.0.x/metric.md#Superstructure">Superstructure</a> e <a href="https://milvus.io/docs/v2.0.x/metric.md#Substructure">Substructure</a>. Jaccard e Tanimoto possono essere utilizzati per misurare la somiglianza tra due insiemi di campioni, mentre Superstructure e Substructure possono essere utilizzati per misurare la somiglianza tra strutture chimiche.</p>
<h3 id="3-Support-for-AVX512-instruction-set" class="common-anchor-header">3. Supporto per il set di istruzioni AVX512</h3><p>Faiss supporta diversi set di istruzioni, tra cui <a href="https://en.wikipedia.org/wiki/AArch64">AArch64</a>, <a href="https://en.wikipedia.org/wiki/SSE4#SSE4.2">SSE4.2</a> e <a href="https://en.wikipedia.org/wiki/Advanced_Vector_Extensions">AVX2</a>. Knowhere estende ulteriormente i set di istruzioni supportati aggiungendo <a href="https://en.wikipedia.org/wiki/AVX-512">AVX512</a>, che può <a href="https://milvus.io/blog/milvus-performance-AVX-512-vs-AVX2.md">migliorare le prestazioni della creazione di indici e delle interrogazioni del 20-30%</a> rispetto ad AVX2.</p>
<h3 id="4-Automatic-SIMD-instruction-selection" class="common-anchor-header">4. Selezione automatica delle istruzioni SIMD</h3><p>Knowhere è stato progettato per funzionare bene su un ampio spettro di processori CPU (sia su piattaforme on-premises che cloud) con diverse istruzioni SIMD (ad esempio, SIMD SSE, AVX, AVX2 e AVX512). Quindi la sfida è: dato un singolo software binario (ad esempio, Milvus), come fare in modo che invochi automaticamente le istruzioni SIMD adatte su qualsiasi processore della CPU? Faiss non supporta la selezione automatica delle istruzioni SIMD e gli utenti devono specificare manualmente il flag SIMD (ad esempio, "-msse4") durante la compilazione. Tuttavia, Knowhere è stato costruito con il refactoring della base di codice di Faiss. Le funzioni comuni (ad esempio, il calcolo della somiglianza) che si basano sull'accelerazione SIMD vengono eliminate. Quindi, per ogni funzione, vengono implementate quattro versioni (SSE, AVX, AVX2, AVX512), ognuna delle quali viene inserita in un file sorgente separato. I file sorgenti vengono poi compilati singolarmente con il corrispondente flag SIMD. Pertanto, in fase di esecuzione, Knowhere è in grado di scegliere automaticamente le istruzioni SIMD più adatte in base ai flag correnti della CPU e di collegare i puntatori alle funzioni giuste utilizzando l'hooking.</p>
<h3 id="5-Other-performance-optimization" class="common-anchor-header">5. Altre ottimizzazioni delle prestazioni</h3><p>Per ulteriori informazioni sull'ottimizzazione delle prestazioni di Knowhere, leggete <a href="https://www.cs.purdue.edu/homes/csjgwang/pubs/SIGMOD21_Milvus.pdf">Milvus: A Purpose-Built Vector Data Management System</a>.</p>
<h2 id="Understanding-the-Knowhere-code" class="common-anchor-header">Comprendere il codice di Knowhere<button data-href="#Understanding-the-Knowhere-code" class="anchor-icon" translate="no">
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
    </button></h2><p>Come detto nella prima sezione, Knowhere gestisce solo operazioni di ricerca vettoriale. Pertanto, Knowhere elabora solo il campo vettoriale di un'entità (attualmente è supportato solo un campo vettoriale per le entità di una collezione). Anche la costruzione di indici e la ricerca di similarità vettoriale sono mirate al campo vettoriale di un segmento. Per comprendere meglio il modello dei dati, leggete il blog <a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md#Data-Model">qui</a>.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Entity_fields_6aa517cc4c.png" alt="entity fields" class="doc-image" id="entity-fields" />
   </span> <span class="img-wrapper"> <span>campi entità</span> </span></p>
<h3 id="Index" class="common-anchor-header">Indice</h3><p>L'indice è un tipo di struttura dati indipendente dai dati vettoriali originali. L'indicizzazione richiede quattro fasi: creare un indice, formare i dati, inserire i dati e costruire un indice.</p>
<p>Per alcune applicazioni di intelligenza artificiale, l'addestramento del set di dati è un processo indipendente dalla ricerca vettoriale. In questo tipo di applicazioni, i dati dei dataset vengono prima addestrati e poi inseriti in un database vettoriale come Milvus per la ricerca di similarità. I dataset aperti come sift1M e sift1B forniscono dati per l'addestramento e il test. Tuttavia, in Knowhere, i dati per l'addestramento e la ricerca sono mescolati insieme. In altre parole, Knowhere addestra tutti i dati in un segmento e poi inserisce tutti i dati addestrati e costruisce un indice per essi.</p>
<h3 id="Knowhere-code-structure" class="common-anchor-header">Struttura del codice di Knowhere</h3><p>DataObj è la classe base di tutte le strutture dati di Knowhere. <code translate="no">Size()</code> è l'unico metodo virtuale di DataObj. La classe Index eredita da DataObj con un campo chiamato &quot;size_&quot;. La classe Index ha anche due metodi virtuali: <code translate="no">Serialize()</code> e <code translate="no">Load()</code>. La classe VecIndex, derivata da Index, è la classe base virtuale per tutti gli indici vettoriali. VecIndex fornisce metodi come <code translate="no">Train()</code>, <code translate="no">Query()</code>, <code translate="no">GetStatistics()</code> e <code translate="no">ClearStatistics()</code>.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Knowhere_base_classes_9d610618d9.png" alt="base clase" class="doc-image" id="base-clase" />
   </span> <span class="img-wrapper"> <span>classe base</span> </span></p>
<p>Altri tipi di indice sono elencati a destra nella figura precedente.</p>
<ul>
<li>L'indice Faiss ha due sottoclassi: FaissBaseIndex per tutti gli indici su vettori in virgola mobile e FaissBaseBinaryIndex per tutti gli indici su vettori binari.</li>
<li>GPUIndex è la classe base per tutti gli indici Faiss GPU.</li>
<li>OffsetBaseIndex è la classe base per tutti gli indici sviluppati in proprio. Nel file di indice viene memorizzato solo l'ID del vettore. Di conseguenza, la dimensione di un file di indice per vettori a 128 dimensioni può essere ridotta di 2 ordini di grandezza. Si consiglia di prendere in considerazione anche i vettori originali quando si utilizza questo tipo di indice per la ricerca di similarità vettoriale.</li>
</ul>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/IDMAP_8773a4511c.png" alt="IDMAP" class="doc-image" id="idmap" />
   </span> <span class="img-wrapper"> <span>IDMAP</span> </span></p>
<p>Tecnicamente parlando, <a href="https://github.com/facebookresearch/faiss/wiki/Guidelines-to-choose-an-index#then-flat">IDMAP</a> non è un indice, ma è piuttosto utilizzato per la ricerca a forza bruta. Quando i vettori vengono inseriti nel database vettoriale, non è necessario addestrare i dati e costruire l'indice. Le ricerche saranno condotte direttamente sui dati vettoriali inseriti.</p>
<p>Tuttavia, per motivi di coerenza del codice, IDMAP eredita anche dalla classe VecIndex con tutte le sue interfacce virtuali. L'uso di IDMAP è lo stesso degli altri indici.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/IVF_42b0f123d1.png" alt="IVF" class="doc-image" id="ivf" />
   </span> <span class="img-wrapper"> <span>FIV</span> </span></p>
<p>Gli indici IVF (inverted file) sono i più utilizzati. La classe IVF deriva da VecIndex e FaissBaseIndex e si estende ulteriormente a IVFSQ e IVFPQ. GPUIVF deriva da GPUIndex e IVF. GPUIVF si estende ulteriormente a GPUIVFSQ e GPUIVFPQ.</p>
<p>IVFSQHybrid è una classe per l'indice ibrido auto-sviluppato che viene eseguito mediante quantizzazione grossolana su GPU. La ricerca nel bucket viene eseguita dalla CPU. Questo tipo di indice può ridurre il numero di copie di memoria tra CPU e GPU, sfruttando la potenza di calcolo della GPU. IVFSQHybrid ha lo stesso tasso di richiamo di GPUIVFSQ, ma offre prestazioni migliori.</p>
<p>La struttura delle classi di base per gli indici binari è relativamente più semplice. BinaryIDMAP e BinaryIVF sono derivati da FaissBaseBinaryIndex e VecIndex.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/third_party_index_34ad029848.png" alt="third-party index" class="doc-image" id="third-party-index" />
   </span> <span class="img-wrapper"> <span>indice di terze parti</span> </span></p>
<p>Attualmente sono supportati solo due tipi di indici di terze parti, oltre a Faiss: l'indice ad albero Annoy e l'indice a grafo HNSW. Questi due indici di terze parti, comuni e frequentemente utilizzati, sono entrambi derivati da VecIndex.</p>
<h2 id="Adding-indexes-to-Knowhere" class="common-anchor-header">Aggiunta di indici a Knowhere<button data-href="#Adding-indexes-to-Knowhere" class="anchor-icon" translate="no">
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
    </button></h2><p>Se si desidera aggiungere nuovi indici a Knowhere, è possibile fare riferimento prima agli indici esistenti:</p>
<ul>
<li>Per aggiungere un indice basato sulla quantizzazione, fare riferimento a IVF_FLAT.</li>
<li>Per aggiungere un indice basato sui grafi, fare riferimento a HNSW.</li>
<li>Per aggiungere un indice ad albero, fare riferimento a Annoy.</li>
</ul>
<p>Dopo aver fatto riferimento agli indici esistenti, è possibile seguire i passaggi seguenti per aggiungere un nuovo indice a Knowhere.</p>
<ol>
<li>Aggiungere il nome del nuovo indice in <code translate="no">IndexEnum</code>. Il tipo di dati è stringa.</li>
<li>Aggiungere il controllo di convalida dei dati sul nuovo indice nel file <code translate="no">ConfAdapter.cpp</code>. Il controllo di convalida serve principalmente a convalidare i parametri per la formazione dei dati e la query.</li>
<li>Creare un nuovo file per il nuovo indice. La classe base del nuovo indice deve includere <code translate="no">VecIndex</code> e l'interfaccia virtuale necessaria di <code translate="no">VecIndex</code>.</li>
<li>Aggiungere la logica di costruzione del nuovo indice in <code translate="no">VecIndexFactory::CreateVecIndex()</code>.</li>
<li>Aggiungere il test unitario nella cartella <code translate="no">unittest</code>.</li>
</ol>
<h2 id="About-the-Deep-Dive-Series" class="common-anchor-header">Informazioni sulla serie Deep Dive<button data-href="#About-the-Deep-Dive-Series" class="anchor-icon" translate="no">
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
    </button></h2><p>Con l'<a href="https://milvus.io/blog/2022-1-25-annoucing-general-availability-of-milvus-2-0.md">annuncio ufficiale della disponibilità generale</a> di Milvus 2.0, abbiamo organizzato questa serie di blog Milvus Deep Dive per fornire un'interpretazione approfondita dell'architettura e del codice sorgente di Milvus. Gli argomenti trattati in questa serie di blog includono:</p>
<ul>
<li><a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md">Panoramica dell'architettura Milvus</a></li>
<li><a href="https://milvus.io/blog/deep-dive-2-milvus-sdk-and-api.md">API e SDK Python</a></li>
<li><a href="https://milvus.io/blog/deep-dive-3-data-processing.md">Elaborazione dei dati</a></li>
<li><a href="https://milvus.io/blog/deep-dive-4-data-insertion-and-data-persistence.md">Gestione dei dati</a></li>
<li><a href="https://milvus.io/blog/deep-dive-5-real-time-query.md">Interrogazione in tempo reale</a></li>
<li><a href="https://milvus.io/blog/deep-dive-7-query-expression.md">Motore di esecuzione scalare</a></li>
<li><a href="https://milvus.io/blog/deep-dive-6-oss-qa.md">Sistema QA</a></li>
<li><a href="https://milvus.io/blog/deep-dive-8-knowhere.md">Motore di esecuzione vettoriale</a></li>
</ul>
