---
id: optimize-vector-databases-enhance-rag-driven-generative-ai.md
title: >-
  Ottimizzare i database vettoriali, migliorare l'intelligenza artificiale
  generativa guidata da RAG
author: 'Cathy Zhang, Dr. Malini Bhandaru'
date: 2024-05-13T00:00:00.000Z
desc: >-
  In questo articolo scoprirete di più sui database vettoriali e sui relativi
  framework di benchmarking, sui set di dati per affrontare i diversi aspetti e
  sugli strumenti utilizzati per l'analisi delle prestazioni: tutto ciò di cui
  avete bisogno per iniziare a ottimizzare i database vettoriali.
cover: >-
  assets.zilliz.com/Optimize_Vector_Databases_Enhance_RAG_Driven_Generative_AI_6e3b370f25.png
tag: Engineering
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Vector Management, RAG, Generative AI
recommend: true
canonicalUrl: >-
  https://medium.com/intel-tech/optimize-vector-databases-enhance-rag-driven-generative-ai-90c10416cb9c
---
<p><em>Questo post è stato pubblicato originariamente sul <a href="https://medium.com/intel-tech/optimize-vector-databases-enhance-rag-driven-generative-ai-90c10416cb9c">canale Medium di Intel</a> e viene ripubblicato qui con l'autorizzazione.</em></p>
<p><br></p>
<p>Due metodi per ottimizzare il database vettoriale quando si usa RAG</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://miro.medium.com/v2/resize:fit:1400/1*FRWBVwOHPYFDIVTp_ylZNQ.jpeg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Foto di <a href="https://unsplash.com/@ilyapavlov?utm_content=creditCopyText&amp;utm_medium=referral&amp;utm_source=unsplash">Ilya Pavlov</a> su <a href="https://unsplash.com/photos/monitor-showing-java-programming-OqtafYT5kTw?utm_content=creditCopyText&amp;utm_medium=referral&amp;utm_source=unsplash">Unsplash</a></p>
<p>Di Cathy Zhang e Dr. Malini Bhandaru Collaboratori: Lin Yang e Changyan Liu</p>
<p>I modelli di IA generativa (Genai), che vengono adottati in modo esponenziale nella nostra vita quotidiana, vengono migliorati dalla <a href="https://www.techtarget.com/searchenterpriseai/definition/retrieval-augmented-generation">retrieval-augmented generation (RAG)</a>, una tecnica utilizzata per migliorare l'accuratezza e l'affidabilità delle risposte recuperando fatti da fonti esterne. La RAG aiuta un normale <a href="https://www.techtarget.com/whatis/definition/large-language-model-LLM">modello linguistico di grandi dimensioni (LLM)</a> a comprendere il contesto e a ridurre le <a href="https://en.wikipedia.org/wiki/Hallucination_(artificial_intelligence)">allucinazioni</a>, sfruttando un enorme database di dati non strutturati memorizzati come vettori - una presentazione matematica che aiuta a catturare il contesto e le relazioni tra i dati.</p>
<p>I RAG aiutano a recuperare più informazioni contestuali e quindi a generare risposte migliori, ma i database vettoriali su cui si basano stanno diventando sempre più grandi per fornire contenuti ricchi a cui attingere. Così come gli LLM a trilioni di parametri sono all'orizzonte, i database vettoriali di miliardi di vettori non sono lontani. In qualità di ingegneri ottimizzatori, eravamo curiosi di vedere se potevamo rendere i database vettoriali più performanti, caricare i dati più velocemente e creare indici più rapidi per garantire la velocità di recupero anche quando vengono aggiunti nuovi dati. Questo non solo ridurrebbe i tempi di attesa degli utenti, ma renderebbe anche le soluzioni AI basate su RAG un po' più sostenibili.</p>
<p>In questo articolo scoprirete di più sui database vettoriali e sui relativi framework di benchmarking, sui set di dati per affrontare i diversi aspetti e sugli strumenti utilizzati per l'analisi delle prestazioni: tutto ciò di cui avete bisogno per iniziare a ottimizzare i database vettoriali. Condivideremo anche i nostri risultati di ottimizzazione su due popolari soluzioni di database vettoriali per ispirarvi nel vostro viaggio di ottimizzazione delle prestazioni e dell'impatto sulla sostenibilità.</p>
<h2 id="Understanding-Vector-Databases" class="common-anchor-header">Capire i database vettoriali<button data-href="#Understanding-Vector-Databases" class="anchor-icon" translate="no">
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
    </button></h2><p>A differenza dei tradizionali database relazionali o non relazionali, in cui i dati sono memorizzati in modo strutturato, un database vettoriale contiene una rappresentazione matematica di singoli elementi di dati, chiamata vettore, costruita utilizzando una funzione di incorporazione o trasformazione. Il vettore rappresenta comunemente caratteristiche o significati semantici e può essere breve o lungo. I database vettoriali effettuano il reperimento dei vettori mediante la ricerca di similarità utilizzando una metrica di distanza (dove più vicina significa che i risultati sono più simili), come la <a href="https://www.pinecone.io/learn/vector-similarity/">similarità euclidea, il prodotto del punto o il coseno</a>.</p>
<p>Per accelerare il processo di recupero, i dati vettoriali vengono organizzati utilizzando un meccanismo di indicizzazione. Esempi di questi metodi di organizzazione sono, tra gli altri, le strutture piatte, i <a href="https://arxiv.org/abs/2002.09094">file invertiti (IVF), i</a> <a href="https://arxiv.org/abs/1603.09320">mondi piccoli navigabili gerarchici (HNSW)</a> e l'<a href="https://en.wikipedia.org/wiki/Locality-sensitive_hashing">hashing sensibile alla località (LSH)</a>. Ognuno di questi metodi contribuisce all'efficienza e all'efficacia del recupero di vettori simili quando necessario.</p>
<p>Esaminiamo come si utilizza un database di vettori in un sistema GenAI. La Figura 1 illustra sia il caricamento dei dati in un database vettoriale sia il suo utilizzo nel contesto di un'applicazione GenAI. Quando si inserisce il prompt, questo subisce un processo di trasformazione identico a quello utilizzato per generare i vettori nel database. Questo prompt vettoriale trasformato viene poi utilizzato per recuperare vettori simili dal database vettoriale. Questi elementi recuperati fungono essenzialmente da memoria conversazionale, fornendo una cronologia contestuale per i prompt, in modo simile a come operano gli LLM. Questa caratteristica si rivela particolarmente vantaggiosa nell'elaborazione del linguaggio naturale, nella computer vision, nei sistemi di raccomandazione e in altri ambiti che richiedono la comprensione semantica e la corrispondenza dei dati. La richiesta iniziale viene successivamente "fusa" con gli elementi recuperati, fornendo un contesto e aiutando l'LLM a formulare risposte basate sul contesto fornito, anziché basarsi esclusivamente sui dati di addestramento originali.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://miro.medium.com/v2/resize:fit:1400/1*zQj_YJdWc2xKB6Vv89lzDQ.jpeg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Figura 1. Architettura dell'applicazione RAG.</p>
<p>I vettori sono memorizzati e indicizzati per un rapido recupero. I database vettoriali sono di due tipi: i database tradizionali che sono stati estesi per memorizzare i vettori e i database vettoriali costruiti appositamente. Alcuni esempi di database tradizionali che supportano i vettori sono <a href="https://redis.io/">Redis</a>, <a href="https://github.com/pgvector/pgvector">pgvector</a>, <a href="https://www.elastic.co/elasticsearch">Elasticsearch</a> e <a href="https://opensearch.org/">OpenSearch</a>. Esempi di database vettoriali costruiti ad hoc sono le soluzioni proprietarie <a href="https://zilliz.com/">Zilliz</a> e <a href="https://www.pinecone.io/">Pinecone</a> e i progetti open source <a href="https://milvus.io/">Milvus</a>, <a href="https://weaviate.io/">Weaviate</a>, <a href="https://qdrant.tech/">Qdrant</a>, <a href="https://github.com/facebookresearch/faiss">Faiss</a> e <a href="https://www.trychroma.com/">Chroma</a>. È possibile saperne di più sui database vettoriali su GitHub tramite <a href="https://github.com/langchain-ai/langchain/tree/master/libs/langchain/langchain/vectorstores">LangChain </a>e <a href="https://github.com/openai/openai-cookbook/tree/main/examples/vector_databases">OpenAI Cookbook</a>.</p>
<p>Ne analizzeremo uno per categoria, Milvus e Redis.</p>
<h2 id="Improving-Performance" class="common-anchor-header">Migliorare le prestazioni<button data-href="#Improving-Performance" class="anchor-icon" translate="no">
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
    </button></h2><p>Prima di immergerci nelle ottimizzazioni, esaminiamo come vengono valutati i database vettoriali, alcuni framework di valutazione e gli strumenti di analisi delle prestazioni disponibili.</p>
<h3 id="Performance-Metrics" class="common-anchor-header">Metriche delle prestazioni</h3><p>Vediamo le principali metriche che possono aiutare a misurare le prestazioni dei database vettoriali.</p>
<ul>
<li>La<strong>latenza di caricamento</strong> misura il tempo necessario per caricare i dati nella memoria del database vettoriale e costruire un indice. Un indice è una struttura di dati utilizzata per organizzare e recuperare in modo efficiente i dati vettoriali in base alla loro somiglianza o distanza. I tipi di <a href="https://milvus.io/docs/index.md#In-memory-Index">indici in memoria</a> includono l'<a href="https://thedataquarry.com/posts/vector-db-3/#flat-indexes">indice piatto</a>, <a href="https://supabase.com/docs/guides/ai/vector-indexes/ivf-indexes">IVF_FLAT</a>, <a href="https://towardsdatascience.com/ivfpq-hnsw-for-billion-scale-similarity-search-89ff2f89d90e">IVF_PQ, HNSW</a>, <a href="https://github.com/google-research/google-research/tree/master/scann">scalable nearest neighbors (ScaNN) e</a> <a href="https://milvus.io/docs/disk_index.md">DiskANN</a>.</li>
<li>Il<strong>richiamo</strong> è la percentuale di corrispondenze vere, o di elementi rilevanti, trovati nei <a href="https://redis.io/docs/data-types/probabilistic/top-k/">primi K</a> risultati recuperati dall'algoritmo di ricerca. Valori di richiamo più elevati indicano un migliore recupero degli elementi rilevanti.</li>
<li><strong>Query per secondo (QPS)</strong> è la velocità con cui il database vettoriale può elaborare le query in arrivo. Valori più elevati di QPS implicano una migliore capacità di elaborazione delle query e un migliore throughput del sistema.</li>
</ul>
<h3 id="Benchmarking-Frameworks" class="common-anchor-header">Quadri di benchmarking</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://miro.medium.com/v2/resize:fit:920/1*mssEjZAuXg6nf-pad67rHA.jpeg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Figura 2. Il quadro di riferimento per il benchmarking dei database vettoriali.</p>
<p>Il benchmarking di un database vettoriale richiede un server di database vettoriale e dei client. Per i nostri test sulle prestazioni abbiamo utilizzato due popolari strumenti open source.</p>
<ul>
<li><a href="https://github.com/zilliztech/VectorDBBench/tree/main"><strong>VectorDBBench</strong></a><strong>:</strong> Sviluppato e open source da Zilliz, VectorDBBench aiuta a testare diversi database vettoriali con diversi tipi di indici e fornisce una comoda interfaccia web.</li>
<li><a href="https://github.com/qdrant/vector-db-benchmark/tree/master"><strong>vector-db-benchmark</strong></a><strong>:</strong> Sviluppato e reso disponibile da Qdrant, vector-db-benchmark aiuta a testare diversi database vettoriali tipici per il tipo di indice <a href="https://www.datastax.com/guides/hierarchical-navigable-small-worlds">HNSW</a>. Esegue i test tramite la riga di comando e fornisce un file <a href="https://docs.docker.com/compose/">Docker Compose</a> per semplificare l'avvio dei componenti del server.</li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://miro.medium.com/v2/resize:fit:1400/1*NpHHEFV0TxRMse83hK6H1A.jpeg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Figura 3. Un esempio di comando vector-db-benchmark usato per eseguire il test di benchmark.</p>
<p>Ma il framework di benchmark è solo una parte dell'equazione. Abbiamo bisogno di dati che mettano alla prova diversi aspetti della soluzione di database vettoriale stessa, come la capacità di gestire grandi volumi di dati, diverse dimensioni di vettori e la velocità di recupero.</p>
<h3 id="Open-Datasets-to-Exercise-Vector-Databases" class="common-anchor-header">Insiemi di dati aperti per testare i database vettoriali</h3><p>I dataset di grandi dimensioni sono ottimi candidati per testare la latenza del carico e l'allocazione delle risorse. Alcuni dataset hanno dati ad alta dimensionalità e sono ottimi per testare la velocità di calcolo della similarità.</p>
<p>I dataset vanno da una dimensione di 25 a una dimensione di 2048. Il dataset <a href="https://laion.ai/">LAION</a>, una raccolta di immagini aperta, è stato utilizzato per l'addestramento di modelli deep-neural visivi e linguistici molto grandi, come i modelli generativi a diffusione stabile. Il dataset OpenAI di 5 milioni di vettori, ciascuno con una dimensione di 1536, è stato creato da VectorDBBench eseguendo OpenAI su <a href="https://huggingface.co/datasets/allenai/c4">dati grezzi</a>. Dato che ogni elemento del vettore è di tipo FLOAT, per salvare i soli vettori sono necessari circa 29 GB (5M * 1536 * 4) di memoria, più una quantità simile per contenere gli indici e altri metadati, per un totale di 58 GB di memoria per i test. Quando si utilizza lo strumento vector-db-benchmark, è necessario garantire un'adeguata archiviazione su disco per salvare i risultati.</p>
<p>Per testare la latenza di carico, avevamo bisogno di una grande collezione di vettori, che <a href="https://docs.hippo.transwarp.io/docs/performance-dataset">deep-image-96-angular</a> offre. Per testare le prestazioni della generazione di indici e del calcolo della somiglianza, i vettori ad alta dimensionalità forniscono maggiore stress. A tal fine abbiamo scelto il dataset 500K di vettori a 1536 dimensioni.</p>
<h3 id="Performance-Tools" class="common-anchor-header">Strumenti per le prestazioni</h3><p>Abbiamo parlato di come stressare il sistema per identificare le metriche di interesse, ma esaminiamo ciò che accade a un livello inferiore: quanto è occupata l'unità di calcolo, il consumo di memoria, le attese sui lock e altro ancora? Questi dati forniscono indizi sul comportamento del database, particolarmente utili per identificare le aree problematiche.</p>
<p>L'utilità <a href="https://www.redhat.com/sysadmin/interpret-top-output">top</a> di Linux fornisce informazioni sulle prestazioni del sistema. Tuttavia, lo strumento <a href="https://perf.wiki.kernel.org/index.php/Main_Page">perf</a> di Linux fornisce una serie di informazioni più approfondite. Per saperne di più, si consiglia di leggere anche gli <a href="https://www.brendangregg.com/perf.html">esempi di perf di Linux</a> e il <a href="https://www.intel.com/content/www/us/en/docs/vtune-profiler/cookbook/2023-0/top-down-microarchitecture-analysis-method.html">metodo di analisi della microarchitettura top-down di Intel</a>. Un altro strumento è <a href="https://www.intel.com/content/www/us/en/developer/tools/oneapi/vtune-profiler.html">Intel® vTune™ Profiler</a>, utile per ottimizzare non solo le applicazioni ma anche le prestazioni e la configurazione del sistema per una serie di carichi di lavoro che spaziano dall'HPC al cloud, dall'IoT ai media, allo storage e altro ancora.</p>
<h2 id="Milvus-Vector-Database-Optimizations" class="common-anchor-header">Ottimizzazioni del database vettoriale Milvus<button data-href="#Milvus-Vector-Database-Optimizations" class="anchor-icon" translate="no">
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
    </button></h2><p>Vediamo alcuni esempi di come abbiamo cercato di migliorare le prestazioni del database vettoriale Milvus.</p>
<h3 id="Reducing-Memory-Movement-Overhead-in-Datanode-Buffer-Write" class="common-anchor-header">Riduzione dell'overhead del movimento di memoria nella scrittura del buffer del datanode</h3><p>I proxy del percorso di scrittura di Milvus scrivono i dati in un broker di log tramite <em>MsgStream</em>. I nodi dati consumano quindi i dati, convertendoli e memorizzandoli in segmenti. I segmenti uniscono i dati appena inseriti. La logica di unione alloca un nuovo buffer per contenere/spostare sia i vecchi dati che i nuovi dati da inserire e quindi restituisce il nuovo buffer come vecchi dati per la successiva unione dei dati. In questo modo i vecchi dati diventano sempre più grandi, rendendo più lento il movimento dei dati. I profili di performance hanno mostrato un elevato overhead per questa logica.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://miro.medium.com/v2/resize:fit:1400/1*Az4dMVBcGmdeyKNrwpR19g.jpeg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Figura 4. La fusione e lo spostamento dei dati nel database vettoriale generano un overhead di prestazioni elevato.</p>
<p>Abbiamo modificato la logica del <em>buffer di fusione</em> per aggiungere direttamente i nuovi dati ai vecchi, evitando di allocare un nuovo buffer e di spostare i vecchi dati di grandi dimensioni. I profili di performance confermano che questa logica non comporta alcun overhead. Le metriche del microcodice <em>metric_CPU operating frequency</em> e <em>metric_CPU utilization</em> indicano un miglioramento coerente con il fatto che il sistema non deve più attendere il lungo movimento della memoria. La latenza di carico è migliorata di oltre il 60%. Il miglioramento è riportato su <a href="https://github.com/milvus-io/milvus/pull/26839">GitHub</a>.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://miro.medium.com/v2/resize:fit:1400/1*MmaUtBTdqmMvC5MlQ8V0wQ.jpeg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Figura 5. Con una minore quantità di copie si nota un miglioramento delle prestazioni di oltre il 50% nella latenza di carico.</p>
<h3 id="Inverted-Index-Building-with-Reduced-Memory-Allocation-Overhead" class="common-anchor-header">Creazione di indici invertiti con riduzione dell'overhead di allocazione della memoria</h3><p>Il motore di ricerca Milvus, <a href="https://milvus.io/docs/knowhere.md">Knowhere</a>, impiega l'<a href="https://www.vlfeat.org/api/kmeans-fundamentals.html#kmeans-elkan">algoritmo k-means di Elkan</a> per addestrare i cluster di dati per la creazione di <a href="https://milvus.io/docs/v1.1.1/index.md">indici di file invertiti (IVF)</a>. Ogni ciclo di formazione dei dati definisce un numero di iterazioni. Più grande è il conteggio, migliori sono i risultati dell'addestramento. Tuttavia, ciò implica anche che l'algoritmo Elkan sarà chiamato più frequentemente.</p>
<p>L'algoritmo Elkan gestisce l'allocazione e la deallocazione della memoria a ogni esecuzione. In particolare, alloca la memoria per memorizzare la metà della dimensione dei dati della matrice simmetrica, esclusi gli elementi diagonali. In Knowhere, la dimensione della matrice simmetrica utilizzata dall'algoritmo Elkan è impostata a 1024, con una dimensione di memoria di circa 2 MB. Ciò significa che per ogni ciclo di addestramento Elkan alloca e dealloca ripetutamente 2 MB di memoria.</p>
<p>I dati di profilazione indicano una frequente attività di allocazione di memoria di grandi dimensioni. In effetti, hanno innescato l'allocazione di <a href="https://www.oreilly.com/library/view/linux-device-drivers/9781785280009/4759692f-43fb-4066-86b2-76a90f0707a2.xhtml">aree di memoria virtuale (VMA)</a>, l'allocazione di pagine fisiche, l'impostazione di mappe di pagine e l'aggiornamento delle statistiche dei cgroup di memoria nel kernel. Questo modello di attività di allocazione/deallocazione di memoria di grandi dimensioni può, in alcune situazioni, aggravare la frammentazione della memoria. Si tratta di una tassa significativa.</p>
<p>La struttura <em>IndexFlatElkan</em> è progettata e costruita specificamente per supportare l'algoritmo Elkan. In ogni processo di formazione dei dati viene inizializzata un'istanza di <em>IndexFlatElkan</em>. Per mitigare l'impatto sulle prestazioni derivante dalla frequente allocazione e deallocazione di memoria nell'algoritmo Elkan, abbiamo rifattorizzato la logica del codice, spostando la gestione della memoria al di fuori della funzione dell'algoritmo Elkan nel processo di costruzione di <em>IndexFlatElkan</em>. In questo modo, l'allocazione della memoria avviene una sola volta durante la fase di inizializzazione, mentre tutte le successive chiamate alla funzione dell'algoritmo Elkan vengono eseguite dal processo di formazione dei dati in corso, contribuendo a migliorare la latenza di carico di circa il 3%. Trovate la <a href="https://github.com/zilliztech/knowhere/pull/280">patch di Knowhere qui</a>.</p>
<h2 id="Redis-Vector-Search-Acceleration-through-Software-Prefetch" class="common-anchor-header">Accelerazione della ricerca vettoriale di Redis tramite prefetch software<button data-href="#Redis-Vector-Search-Acceleration-through-Software-Prefetch" class="anchor-icon" translate="no">
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
    </button></h2><p>Redis, un popolare archivio tradizionale di dati in-memory a valore-chiave, ha recentemente iniziato a supportare la ricerca vettoriale. Per andare oltre il tipico archivio di valori-chiave, offre moduli di estensibilità; il modulo <a href="https://github.com/RediSearch/RediSearch">RediSearch</a> facilita la memorizzazione e la ricerca di vettori direttamente all'interno di Redis.</p>
<p>Per la ricerca di similarità vettoriale, Redis supporta due algoritmi: forza bruta e HNSW. L'algoritmo HNSW è stato creato appositamente per individuare in modo efficiente i vicini approssimativi in spazi ad alta dimensione. Utilizza una coda prioritaria chiamata <em>candidate_set</em> per gestire tutti i candidati vettoriali per il calcolo della distanza.</p>
<p>Ogni candidato vettoriale comprende metadati sostanziali oltre ai dati vettoriali. Di conseguenza, il caricamento di un candidato dalla memoria può causare la perdita di dati dalla cache, con conseguenti ritardi nell'elaborazione. La nostra ottimizzazione introduce il prefetching software per caricare in modo proattivo il candidato successivo durante l'elaborazione di quello attuale. Questo miglioramento ha portato a un miglioramento del throughput del 2-3% per le ricerche di similarità vettoriale in una configurazione Redis a istanza singola. La patch è in fase di upstreaming.</p>
<h2 id="GCC-Default-Behavior-Change-to-Prevent-Mixed-Assembly-Code-Penalties" class="common-anchor-header">Modifica del comportamento predefinito di GCC per evitare penalizzazioni del codice assembly misto<button data-href="#GCC-Default-Behavior-Change-to-Prevent-Mixed-Assembly-Code-Penalties" class="anchor-icon" translate="no">
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
    </button></h2><p>Per ottenere le massime prestazioni, le sezioni di codice utilizzate di frequente sono spesso scritte a mano in assembly. Tuttavia, quando segmenti diversi di codice vengono scritti da persone diverse o in momenti diversi, le istruzioni utilizzate possono provenire da set di istruzioni assembly incompatibili, come <a href="https://www.intel.com/content/www/us/en/architecture-and-technology/avx-512-overview.html">Intel® Advanced Vector Extensions 512 (Intel® AVX-512)</a> e <a href="https://en.wikipedia.org/wiki/Streaming_SIMD_Extensions">Streaming SIMD Extensions (SSE)</a>. Se non viene compilato in modo appropriato, il codice misto comporta una riduzione delle prestazioni. <a href="https://www.intel.com/content/dam/develop/external/us/en/documents/11mc12-avoiding-2bavx-sse-2btransition-2bpenalties-2brh-2bfinal-809104.pdf">Per saperne di più sul mix di istruzioni Intel AVX e SSE, cliccate qui</a>.</p>
<p>È possibile determinare facilmente se si sta utilizzando codice assembly in modalità mista e se non si è compilato il codice con <em>VZEROUPPER</em>, incorrendo così nella penalizzazione delle prestazioni. Si può osservare con un comando perf come <em>sudo perf stat -e 'assists.sse_avx_mix/event/event=0xc1,umask=0x10/' &lt;workload&gt;.</em> Se il vostro sistema operativo non supporta l'evento, usate <em>cpu/event=0xc1,umask=0x10,name=assists_sse_avx_mix/</em>.</p>
<p>Il compilatore Clang inserisce di default <em>VZEROUPPER</em>, evitando così qualsiasi penalizzazione in modalità mista. Ma il compilatore GCC inserisce <em>VZEROUPPER</em> solo quando vengono specificati i flag di compilazione -O2 o -O3. Abbiamo contattato il team di GCC e spiegato il problema; ora, per impostazione predefinita, gestisce correttamente il codice assembly in modalità mista.</p>
<h2 id="Start-Optimizing-Your-Vector-Databases" class="common-anchor-header">Iniziare a ottimizzare i database vettoriali<button data-href="#Start-Optimizing-Your-Vector-Databases" class="anchor-icon" translate="no">
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
    </button></h2><p>I database vettoriali giocano un ruolo fondamentale in GenAI e stanno diventando sempre più grandi per generare risposte di qualità superiore. Per quanto riguarda l'ottimizzazione, le applicazioni di IA non sono diverse da altre applicazioni software, in quanto rivelano i loro segreti quando si utilizzano strumenti standard di analisi delle prestazioni insieme a framework di benchmark e input di stress.</p>
<p>Utilizzando questi strumenti, abbiamo scoperto le trappole delle prestazioni relative all'allocazione di memoria non necessaria, al mancato prefetch delle istruzioni e all'uso di opzioni di compilazione non corrette. Sulla base delle nostre scoperte, abbiamo apportato miglioramenti in upstream a Milvus, Knowhere, Redis e al compilatore GCC per contribuire a rendere l'IA un po' più performante e sostenibile. I database vettoriali sono un'importante classe di applicazioni che meritano di essere ottimizzate. Speriamo che questo articolo vi aiuti a iniziare.</p>
