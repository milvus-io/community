---
id: why-and-when-you-need-a-purpose-built-vector-database.md
title: Perché e quando è necessario un database vettoriale ad hoc?
author: James Luan
date: 2023-08-29T00:00:00.000Z
cover: >-
  assets.zilliz.com/Why_you_need_a_real_vector_database2_20230830_075505_1_4b32582c87.png
tag: Engineering
tags: >-
  Vector Database, AI, Artificial Intelligence, Machine Learning, Milvus, LLM,
  Large Language Models, Embeddings, Vector search, Vector similarity search
desc: >-
  Questo post fornisce una panoramica della ricerca vettoriale e del suo
  funzionamento, confronta le diverse tecnologie di ricerca vettoriale e spiega
  perché è fondamentale scegliere un database vettoriale appositamente creato.
recommend: true
canonicalUrl: >-
  https://www.aiacceleratorinstitute.com/why-and-when-do-you-need-a-purpose-built-vector-database/
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Why_you_need_a_real_vector_database2_20230830_075505_1_4b32582c87.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Questo articolo è stato pubblicato originariamente su <a href="https://www.aiacceleratorinstitute.com/why-and-when-do-you-need-a-purpose-built-vector-database/">AIAI</a> e viene ripubblicato qui con l'autorizzazione.</em></p>
<p>La crescente popolarità di <a href="https://zilliz.com/learn/ChatGPT-Vector-Database-Prompt-as-code">ChatGPT</a> e di altri modelli linguistici di grandi dimensioni (LLM) ha alimentato l'ascesa delle tecnologie di ricerca vettoriale, tra cui database vettoriali appositamente costruiti come <a href="https://milvus.io/docs/overview.md">Milvus</a> e <a href="https://zilliz.com/cloud">Zilliz Cloud</a>, librerie di ricerca vettoriale come <a href="https://zilliz.com/blog/set-up-with-facebook-ai-similarity-search-faiss">FAISS</a> e plugin di ricerca vettoriale integrati nei database tradizionali. Tuttavia, la scelta della soluzione migliore per le proprie esigenze può essere impegnativa. Come la scelta tra un ristorante di alto livello e una catena di fast-food, la selezione della giusta tecnologia di ricerca vettoriale dipende dalle vostre esigenze e aspettative.</p>
<p>In questo post fornirò una panoramica della ricerca vettoriale e del suo funzionamento, confronterò le diverse tecnologie di ricerca vettoriale e spiegherò perché è fondamentale optare per un database vettoriale appositamente creato.</p>
<h2 id="What-is-vector-search-and-how-does-it-work" class="common-anchor-header">Cos'è la ricerca vettoriale e come funziona?<button data-href="#What-is-vector-search-and-how-does-it-work" class="anchor-icon" translate="no">
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
    </button></h2><p>La<a href="https://zilliz.com/blog/vector-similarity-search">ricerca vettoriale</a>, nota anche come ricerca per similarità vettoriale, è una tecnica per recuperare i risultati top-k più simili o semanticamente correlati a un determinato vettore di interrogazione tra un'ampia raccolta di dati vettoriali densi.</p>
<p>Prima di effettuare le ricerche di somiglianza, utilizziamo le reti neurali per trasformare i <a href="https://zilliz.com/blog/introduction-to-unstructured-data">dati non strutturati</a>, come testo, immagini, video e audio, in vettori numerici ad alta dimensione chiamati vettori di incorporamento. Ad esempio, possiamo utilizzare la rete neurale convoluzionale ResNet-50 pre-addestrata per trasformare l'immagine di un uccello in un insieme di embeddings di 2.048 dimensioni. Qui elenchiamo i primi tre e gli ultimi tre elementi del vettore: <code translate="no">[0.1392, 0.3572, 0.1988, ..., 0.2888, 0.6611, 0.2909]</code>.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/bird_image_4a1be18f99.png" alt="A bird image by Patrice Bouchard" class="doc-image" id="a-bird-image-by-patrice-bouchard" />
   </span> <span class="img-wrapper"> <span>Immagine di un uccello di Patrice Bouchard</span> </span></p>
<p>Dopo aver generato i vettori embedding, i motori di ricerca vettoriale confrontano la distanza spaziale tra il vettore della query in ingresso e i vettori presenti negli archivi vettoriali. Più sono vicini nello spazio, più sono simili.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Frame_3732_20230510_073643_25f985523e.png" alt="Embedding arithmetic" class="doc-image" id="embedding-arithmetic" />
   </span> <span class="img-wrapper"> <span>Aritmetica di incorporazione</span> </span></p>
<h2 id="Popular-vector-search-technologies" class="common-anchor-header">Tecnologie di ricerca vettoriale più diffuse<button data-href="#Popular-vector-search-technologies" class="anchor-icon" translate="no">
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
    </button></h2><p>Sul mercato sono disponibili diverse tecnologie di ricerca vettoriale, tra cui librerie di machine learning come NumPy di Python, librerie di ricerca vettoriale come FAISS, plugin di ricerca vettoriale costruiti su database tradizionali e database vettoriali specializzati come Milvus e Zilliz Cloud.</p>
<h3 id="Machine-learning-libraries" class="common-anchor-header">Librerie di apprendimento automatico</h3><p>L'uso di librerie di machine learning è il modo più semplice per implementare le ricerche vettoriali. Per esempio, possiamo usare NumPy di Python per implementare un algoritmo di nearest neighbor in meno di 20 righe di codice.</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> numpy <span class="hljs-keyword">as</span> np

<span class="hljs-comment"># Function to calculate euclidean distance</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">euclidean_distance</span>(<span class="hljs-params">a, b</span>):
<span class="hljs-keyword">return</span> np.linalg.norm(a - b)

<span class="hljs-comment"># Function to perform knn</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">knn</span>(<span class="hljs-params">data, target, k</span>):
<span class="hljs-comment"># Calculate distances between target and all points in the data</span>
distances = [euclidean_distance(d, target) <span class="hljs-keyword">for</span> d <span class="hljs-keyword">in</span> data]
<span class="hljs-comment"># Combine distances with data indices</span>
distances = np.array(<span class="hljs-built_in">list</span>(<span class="hljs-built_in">zip</span>(distances, np.arange(<span class="hljs-built_in">len</span>(data)))))

<span class="hljs-comment"># Sort by distance</span>
sorted_distances = distances[distances[:, <span class="hljs-number">0</span>].argsort()]

<span class="hljs-comment"># Get the top k closest indices</span>
closest_k_indices = sorted_distances[:k, <span class="hljs-number">1</span>].astype(<span class="hljs-built_in">int</span>)

<span class="hljs-comment"># Return the top k closest vectors</span>
<span class="hljs-keyword">return</span> data[closest_k_indices]
<button class="copy-code-btn"></button></code></pre>
<p>Possiamo generare 100 vettori bidimensionali e trovare il vicino più prossimo al vettore [0,5, 0,5].</p>
<pre><code translate="no"><span class="hljs-comment"># Define some 2D vectors</span>
data = np.random.rand(<span class="hljs-number">100</span>, <span class="hljs-number">2</span>)

<span class="hljs-comment"># Define a target vector</span>
target = np.array([<span class="hljs-number">0.5</span>, <span class="hljs-number">0.5</span>])

<span class="hljs-comment"># Define k</span>
k = <span class="hljs-number">3</span>

<span class="hljs-comment"># Perform knn</span>
closest_vectors = knn(data, target, k)

<span class="hljs-comment"># Print the result</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;The closest vectors are:&quot;</span>)
<span class="hljs-built_in">print</span>(closest_vectors)
<button class="copy-code-btn"></button></code></pre>
<p>Le librerie di apprendimento automatico, come NumPy di Python, offrono una grande flessibilità a basso costo. Tuttavia, hanno alcune limitazioni. Ad esempio, possono gestire solo una piccola quantità di dati e non garantiscono la persistenza dei dati.</p>
<p>Consiglio di utilizzare NumPy o altre librerie di apprendimento automatico per la ricerca vettoriale solo quando:</p>
<ul>
<li>Avete bisogno di una prototipazione rapida.</li>
<li>Non vi interessa la persistenza dei dati.</li>
<li>La dimensione dei dati è inferiore a un milione e non è necessario un filtro scalare.</li>
<li>Non avete bisogno di prestazioni elevate.</li>
</ul>
<h3 id="Vector-search-libraries" class="common-anchor-header">Librerie di ricerca vettoriale</h3><p>Le librerie di ricerca vettoriale possono aiutare a costruire rapidamente un prototipo di sistema di ricerca vettoriale ad alte prestazioni. FAISS è un esempio tipico. È open-source e sviluppata da Meta per la ricerca efficiente di similarità e il clustering vettoriale denso. FAISS è in grado di gestire collezioni di vettori di qualsiasi dimensione, anche quelle che non possono essere caricate completamente in memoria. Inoltre, FAISS offre strumenti per la valutazione e la regolazione dei parametri. Anche se scritto in C++, FAISS offre un'interfaccia Python/NumPy.</p>
<p>Di seguito è riportato il codice di un esempio di ricerca vettoriale basato su FAISS:</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> numpy <span class="hljs-keyword">as</span> np
<span class="hljs-keyword">import</span> faiss

<span class="hljs-comment"># Generate some example data</span>
dimension = <span class="hljs-number">64</span> <span class="hljs-comment"># dimension of the vector space</span>
database_size = <span class="hljs-number">10000</span> <span class="hljs-comment"># size of the database</span>
query_size = <span class="hljs-number">100</span> <span class="hljs-comment"># number of queries to perform</span>
np.random.seed(<span class="hljs-number">123</span>) <span class="hljs-comment"># make the random numbers predictable</span>

<span class="hljs-comment"># Generating vectors to index in the database (db_vectors)</span>
db_vectors = np.random.random((database_size, dimension)).astype(<span class="hljs-string">&#x27;float32&#x27;</span>)

<span class="hljs-comment"># Generating vectors for query (query_vectors)</span>
query_vectors = np.random.random((query_size, dimension)).astype(<span class="hljs-string">&#x27;float32&#x27;</span>)

<span class="hljs-comment"># Building the index</span>
index = faiss.IndexFlatL2(dimension) <span class="hljs-comment"># using the L2 distance metric</span>
<span class="hljs-built_in">print</span>(index.is_trained) <span class="hljs-comment"># should return True</span>

<span class="hljs-comment"># Adding vectors to the index</span>
index.add(db_vectors)
<span class="hljs-built_in">print</span>(index.ntotal) <span class="hljs-comment"># should return database_size (10000)</span>

<span class="hljs-comment"># Perform a search</span>
k = <span class="hljs-number">4</span> <span class="hljs-comment"># we want to see 4 nearest neighbors</span>
distances, indices = index.search(query_vectors, k)

<span class="hljs-comment"># Print the results</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Indices of nearest neighbors: \n&quot;</span>, indices)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\nL2 distances to the nearest neighbors: \n&quot;</span>, distances)
<button class="copy-code-btn"></button></code></pre>
<p>Le librerie di ricerca vettoriale come FAISS sono facili da usare e sufficientemente veloci per gestire ambienti di produzione su piccola scala con milioni di vettori. È possibile migliorare le prestazioni delle query utilizzando la quantizzazione e le GPU e riducendo le dimensioni dei dati.</p>
<p>Tuttavia, queste librerie presentano alcune limitazioni quando vengono utilizzate in produzione. Ad esempio, FAISS non supporta l'aggiunta e la cancellazione di dati in tempo reale, le chiamate remote, le lingue multiple, il filtraggio scalare, la scalabilità o il disaster recovery.</p>
<h3 id="Different-types-of-vector-databases" class="common-anchor-header">Diversi tipi di database vettoriali</h3><p>I database vettoriali sono nati per risolvere le limitazioni delle librerie di cui sopra, fornendo una soluzione più completa e pratica per le applicazioni di produzione.</p>
<p>Sul campo di battaglia sono disponibili quattro tipi di database vettoriali:</p>
<ul>
<li>Database relazionali o colonnari esistenti che incorporano un plugin di ricerca vettoriale. PG Vector ne è un esempio.</li>
<li>Motori di ricerca tradizionali a indice invertito con supporto per l'indicizzazione vettoriale densa. <a href="https://zilliz.com/comparison/elastic-vs-milvus">ElasticSearch</a> ne è un esempio.</li>
<li>Database vettoriali leggeri costruiti su librerie di ricerca vettoriale. Chroma ne è un esempio.</li>
<li><strong>Database vettoriali costruiti ad hoc</strong>. Questo tipo di database è specificamente progettato e ottimizzato per la ricerca vettoriale dal basso verso l'alto. I database vettoriali appositamente creati offrono in genere funzionalità più avanzate, tra cui l'elaborazione distribuita, il disaster recovery e la persistenza dei dati. <a href="https://zilliz.com/what-is-milvus">Milvus</a> ne è un esempio primario.</li>
</ul>
<p>Non tutti i database vettoriali sono uguali. Ogni stack presenta vantaggi e limiti unici, che li rendono più o meno adatti a diverse applicazioni.</p>
<p>Preferisco i database vettoriali specializzati ad altre soluzioni perché sono l'opzione più efficiente e conveniente e offrono numerosi vantaggi unici. Nelle sezioni seguenti, utilizzerò Milvus come esempio per spiegare le ragioni della mia preferenza.</p>
<h2 id="Key-benefits-of-purpose-built-vector-databases" class="common-anchor-header">I principali vantaggi dei database vettoriali creati ad hoc<button data-href="#Key-benefits-of-purpose-built-vector-databases" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://milvus.io/">Milvus</a> è un database vettoriale open-source, distribuito e costruito appositamente, in grado di memorizzare, indicizzare, gestire e recuperare miliardi di vettori di incorporazione. È anche uno dei database vettoriali più popolari per la <a href="https://zilliz.com/use-cases/llm-retrieval-augmented-generation">generazione aumentata di LLM retrieval</a>. Come esempio di database vettoriali appositamente costruiti, Milvus condivide molti vantaggi unici con le sue controparti.</p>
<h3 id="Data-Persistence-and-Cost-Effective-Storage" class="common-anchor-header">Persistenza dei dati e conservazione a costi contenuti</h3><p>Sebbene la prevenzione della perdita di dati sia il requisito minimo per un database, molti database vettoriali leggeri e a macchina singola non danno priorità all'affidabilità dei dati. Al contrario, i database vettoriali distribuiti appositamente costruiti, come <a href="https://zilliz.com/what-is-milvus">Milvus</a>, danno priorità alla resilienza del sistema, alla scalabilità e alla persistenza dei dati, separando l'archiviazione dal calcolo.</p>
<p>Inoltre, la maggior parte dei database vettoriali che utilizzano indici approssimati di prossimità (ANN) necessitano di molta memoria per eseguire la ricerca vettoriale, poiché caricano gli indici ANN esclusivamente in memoria. Tuttavia, Milvus supporta gli indici su disco, rendendo la memorizzazione dieci volte più conveniente rispetto agli indici in memoria.</p>
<h3 id="Optimal-Query-Performance" class="common-anchor-header">Prestazioni ottimali delle query</h3><p>Un database vettoriale specializzato offre prestazioni ottimali rispetto ad altre opzioni di ricerca vettoriale. Ad esempio, Milvus è dieci volte più veloce nel gestire le query rispetto ai plugin di ricerca vettoriale. Milvus utilizza l'<a href="https://zilliz.com/glossary/anns">algoritmo ANN</a> invece dell'algoritmo di ricerca brutale KNN per una ricerca vettoriale più veloce. Inoltre, suddivide i suoi indici, riducendo il tempo necessario per costruire un indice all'aumentare del volume dei dati. Questo approccio consente a Milvus di gestire facilmente miliardi di vettori con aggiunte e cancellazioni di dati in tempo reale. Al contrario, altri componenti aggiuntivi per la ricerca vettoriale sono adatti solo a scenari con meno di decine di milioni di dati e aggiunte e cancellazioni poco frequenti.</p>
<p>Milvus supporta anche l'accelerazione via GPU. I test interni dimostrano che l'indicizzazione vettoriale accelerata dalle GPU può raggiungere oltre 10.000 QPS quando si ricercano decine di milioni di dati, una velocità almeno dieci volte superiore a quella dell'indicizzazione tradizionale su CPU per le prestazioni di una singola macchina.</p>
<h3 id="System-Reliability" class="common-anchor-header">Affidabilità del sistema</h3><p>Molte applicazioni utilizzano database vettoriali per interrogazioni online che richiedono una bassa latenza di interrogazione e un'elevata produttività. Queste applicazioni richiedono il failover su una sola macchina a livello di minuti, e alcune richiedono persino il ripristino di emergenza tra regioni per gli scenari critici. Le strategie di replica tradizionali basate su Raft/Paxos soffrono di un grave spreco di risorse e necessitano di un aiuto per il pre-sharding dei dati, con conseguente scarsa affidabilità. Al contrario, Milvus ha un'architettura distribuita che sfrutta le code di messaggi di K8s per un'elevata disponibilità, riducendo i tempi di ripristino e risparmiando risorse.</p>
<h3 id="Operability-and-Observability" class="common-anchor-header">Operabilità e osservabilità</h3><p>Per servire meglio gli utenti aziendali, i database vettoriali devono offrire una serie di funzionalità di livello enterprise per una migliore operatività e osservabilità. Milvus supporta diversi metodi di distribuzione, tra cui K8s Operator e Helm chart, docker-compose e pip install, rendendolo accessibile a utenti con esigenze diverse. Milvus offre anche un sistema di monitoraggio e di allarme basato su Grafana, Prometheus e Loki, migliorando la sua osservabilità. Con un'architettura cloud-native distribuita, Milvus è il primo database vettoriale del settore a supportare l'isolamento multi-tenant, RBAC, la limitazione delle quote e gli aggiornamenti rolling. Tutti questi approcci rendono la gestione e il monitoraggio di Milvus molto più semplice.</p>
<h2 id="Getting-started-with-Milvus-in-3-simple-steps-within-10-minutes" class="common-anchor-header">Iniziare con Milvus in 3 semplici passi in 10 minuti<button data-href="#Getting-started-with-Milvus-in-3-simple-steps-within-10-minutes" class="anchor-icon" translate="no">
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
    </button></h2><p>Costruire un database vettoriale è un compito complesso, ma usarne uno è semplice come usare Numpy e FAISS. Anche gli studenti che non hanno familiarità con l'IA possono implementare una ricerca vettoriale basata su Milvus in soli dieci minuti. Per sperimentare servizi di ricerca vettoriale altamente scalabili e performanti, seguite questi tre passaggi:</p>
<ul>
<li>Installare Milvus sul proprio server con l'aiuto del <a href="https://milvus.io/docs/install_standalone-docker.md">documento di implementazione di Milvus</a>.</li>
<li>Implementare la ricerca vettoriale con sole 50 righe di codice facendo riferimento al <a href="https://milvus.io/docs/example_code.md">documento Hello Milvus</a>.</li>
<li>Esplorare i <a href="https://github.com/towhee-io/examples/">documenti di esempio di Towhee</a> per comprendere i <a href="https://zilliz.com/use-cases">casi d'uso</a> più comuni <a href="https://zilliz.com/use-cases">dei database vettoriali</a>.</li>
</ul>
