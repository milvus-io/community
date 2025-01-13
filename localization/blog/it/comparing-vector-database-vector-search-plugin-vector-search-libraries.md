---
id: comparing-vector-database-vector-search-plugin-vector-search-libraries.md
title: >-
  Confronto tra database vettoriali, librerie di ricerca vettoriale e plugin di
  ricerca vettoriale
author: Frank Liu
date: 2023-11-9
desc: >-
  In questo post continueremo a esplorare l'intricato regno della ricerca
  vettoriale, confrontando database vettoriali, plugin di ricerca vettoriale e
  librerie di ricerca vettoriale.
cover: >-
  assets.zilliz.com/Vector_Databases_vs_Vector_Search_Plugins_vs_Vector_Search_Libraries_74def521ad.png
tag: Engineering
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  vector search
recommend: true
canonicalUrl: >-
  https://zilliz.com/learn/comparing-vector-database-vector-search-library-and-vector-search-plugin
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Vector_Databases_vs_Vector_Search_Plugins_vs_Vector_Search_Libraries_74def521ad.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Bentornati a Vector Database 101!</p>
<p>L'aumento di <a href="https://zilliz.com/learn/ChatGPT-Vector-Database-Prompt-as-code">ChatGPT</a> e di altri modelli linguistici di grandi dimensioni (LLM) ha favorito la crescita delle tecnologie di ricerca vettoriale, con database vettoriali specializzati come <a href="https://zilliz.com/what-is-milvus">Milvus</a> e <a href="https://zilliz.com/cloud">Zilliz Cloud</a>, oltre a librerie come <a href="https://zilliz.com/blog/set-up-with-facebook-ai-similarity-search-faiss">FAISS</a> e plugin di ricerca vettoriale integrati nei database tradizionali.</p>
<p>Nel nostro <a href="https://zilliz.com/learn/what-is-vector-database">precedente post della serie</a>, abbiamo approfondito i fondamenti dei database vettoriali. In questo post continueremo a esplorare l'intricato regno della ricerca vettoriale, confrontando database vettoriali, plugin di ricerca vettoriale e librerie di ricerca vettoriale.</p>
<h2 id="What-is-vector-search" class="common-anchor-header">Che cos'è la ricerca vettoriale?<button data-href="#What-is-vector-search" class="anchor-icon" translate="no">
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
    </button></h2><p>La<a href="https://zilliz.com/learn/vector-similarity-search">ricerca vettoriale</a>, nota anche come ricerca per similarità vettoriale, è una tecnica per recuperare i risultati top-k più simili o semanticamente correlati a un determinato vettore di interrogazione tra una vasta raccolta di dati vettoriali densi. Prima di effettuare le ricerche di similarità, utilizziamo le reti neurali per trasformare i <a href="https://zilliz.com/learn/introduction-to-unstructured-data">dati non strutturati</a>, come testo, immagini, video e audio, in vettori numerici ad alta dimensione, chiamati vettori di incorporamento. Dopo aver generato i vettori di incorporamento, i motori di ricerca vettoriale confrontano la distanza spaziale tra il vettore di query in ingresso e i vettori presenti negli archivi vettoriali. Più sono vicini nello spazio, più sono simili.</p>
<p>Sul mercato sono disponibili diverse tecnologie di ricerca vettoriale, tra cui librerie di machine learning come NumPy di Python, librerie di ricerca vettoriale come FAISS, plugin di ricerca vettoriale costruiti su database tradizionali e database vettoriali specializzati come Milvus e Zilliz Cloud.</p>
<h2 id="Vector-databases-vs-vector-search-libraries" class="common-anchor-header">Database vettoriali vs. librerie di ricerca vettoriale<button data-href="#Vector-databases-vs-vector-search-libraries" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://zilliz.com/blog/what-is-a-real-vector-database">I database vettoriali specializzati</a> non sono l'unico stack per le ricerche di similarità. Prima dell'avvento dei database vettoriali, molte librerie di ricerca vettoriale, come FAISS, ScaNN e HNSW, sono state utilizzate per il recupero di vettori.</p>
<p>Le librerie di ricerca vettoriale possono aiutare a costruire rapidamente un prototipo di sistema di ricerca vettoriale ad alte prestazioni. FAISS, ad esempio, è una libreria open-source sviluppata da Meta per la ricerca di similarità e il clustering vettoriale denso. FAISS è in grado di gestire collezioni di vettori di qualsiasi dimensione, anche quelle che non possono essere caricate completamente in memoria. Inoltre, FAISS offre strumenti per la valutazione e la regolazione dei parametri. Anche se scritto in C++, FAISS offre un'interfaccia Python/NumPy.</p>
<p>Tuttavia, le librerie di ricerca vettoriale sono solo librerie ANN leggere piuttosto che soluzioni gestite e hanno funzionalità limitate. Se il set di dati è piccolo e limitato, queste librerie possono essere sufficienti per l'elaborazione di dati non strutturati, anche per i sistemi in produzione. Tuttavia, con l'aumento delle dimensioni dei set di dati e l'ingresso di un maggior numero di utenti, il problema della scala diventa sempre più difficile da risolvere. Inoltre, non consentono di modificare i dati dell'indice e non possono essere interrogati durante l'importazione dei dati.</p>
<p>I database vettoriali, invece, sono una soluzione ottimale per l'archiviazione e il recupero di dati non strutturati. Possono memorizzare e interrogare milioni o addirittura miliardi di vettori, fornendo contemporaneamente risposte in tempo reale; sono altamente scalabili per soddisfare le crescenti esigenze aziendali degli utenti.</p>
<p>Inoltre, i database vettoriali come Milvus hanno caratteristiche molto più facili da usare per i dati strutturati/semistrutturati: cloud-nativity, multi-tenancy, scalabilità, ecc. Queste caratteristiche diventeranno chiare man mano che ci addentreremo in questo tutorial.</p>
<p>Inoltre, operano su un livello di astrazione completamente diverso da quello delle librerie di ricerca vettoriale: i database vettoriali sono servizi a tutti gli effetti, mentre le librerie ANN sono destinate a essere integrate nell'applicazione che si sta sviluppando. In questo senso, le librerie ANN sono uno dei tanti componenti su cui sono costruiti i database vettoriali, in modo simile a come Elasticsearch è costruito su Apache Lucene.</p>
<p>Per dare un esempio del perché questa astrazione è così importante, vediamo come inserire un nuovo elemento di dati non strutturati in un database vettoriale. In Milvus è facilissimo:</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> <span class="hljs-title class_">Collectioncollection</span> = <span class="hljs-title class_">Collection</span>(<span class="hljs-string">&#x27;book&#x27;</span>)mr = collection.<span class="hljs-title function_">insert</span>(data)
<button class="copy-code-btn"></button></code></pre>
<p>È davvero così semplice: 3 righe di codice. Con una libreria come FAISS o ScaNN, purtroppo, non c'è un modo semplice per farlo senza ricreare manualmente l'intero indice in determinati punti di controllo. Anche se fosse possibile, le librerie di ricerca vettoriale mancano di scalabilità e multi-tenancy, due delle caratteristiche più importanti dei database vettoriali.</p>
<h2 id="Vector-databases-vs-vector-search-plugins-for-traditional-databases" class="common-anchor-header">Database vettoriali vs. plugin di ricerca vettoriale per database tradizionali<button data-href="#Vector-databases-vs-vector-search-plugins-for-traditional-databases" class="anchor-icon" translate="no">
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
    </button></h2><p>Bene, ora che abbiamo stabilito la differenza tra le librerie di ricerca vettoriale e i database vettoriali, diamo un'occhiata a come i database vettoriali differiscono dai <strong>plugin di ricerca vettoriale</strong>.</p>
<p>Un numero crescente di database relazionali tradizionali e di sistemi di ricerca come Clickhouse ed <a href="https://zilliz.com/blog/elasticsearch-cloud-vs-zilliz">Elasticsearch</a> includono plugin di ricerca vettoriale integrati. Elasticsearch 8.0, ad esempio, include funzionalità di inserimento vettoriale e di ricerca RNA che possono essere richiamate tramite endpoint API restful. Il problema dei plugin di ricerca vettoriale dovrebbe essere chiaro come la notte e il giorno: <strong>queste soluzioni non adottano un approccio full-stack alla gestione dell'incorporazione e alla ricerca vettoriale</strong>. Al contrario, questi plugin sono pensati come miglioramenti delle architetture esistenti, il che li rende limitati e non ottimizzati. Sviluppare un'applicazione di dati non strutturati su un database tradizionale sarebbe come cercare di inserire batterie al litio e motori elettrici nel telaio di un'auto a gas: non è una grande idea!</p>
<p>Per illustrare il perché di questa situazione, torniamo all'elenco delle caratteristiche che un database vettoriale dovrebbe implementare (dalla prima sezione). Ai plugin di ricerca vettoriale mancano due di queste caratteristiche: la sintonizzazione e API/SDK di facile utilizzo. Continuerò a usare il motore ANN di Elasticsearch come esempio; altri plugin per la ricerca vettoriale funzionano in modo molto simile, quindi non mi dilungherò troppo nei dettagli. Elasticsearch supporta l'archiviazione vettoriale tramite il tipo di campo <code translate="no">dense_vector</code> e consente di eseguire interrogazioni tramite <code translate="no">knnsearch endpoint</code>:</p>
<pre><code translate="no" class="language-json">PUT index
{
<span class="hljs-string">&quot;mappings&quot;</span>: {
  <span class="hljs-string">&quot;properties&quot;</span>: {
    <span class="hljs-string">&quot;image-vector&quot;</span>: {
      <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;dense_vector&quot;</span>,
      <span class="hljs-string">&quot;dims&quot;</span>: 128,
      <span class="hljs-string">&quot;index&quot;</span>: <span class="hljs-literal">true</span>,
      <span class="hljs-string">&quot;similarity&quot;</span>: <span class="hljs-string">&quot;l2_norm&quot;</span>
    }
  }
}
}


PUT index/_doc
{
<span class="hljs-string">&quot;image-vector&quot;</span>: [0.12, 1.34, ...]
}
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no" class="language-json">GET index/_knn_search
{
<span class="hljs-string">&quot;knn&quot;</span>: {
  <span class="hljs-string">&quot;field&quot;</span>: <span class="hljs-string">&quot;image-vector&quot;</span>,
  <span class="hljs-string">&quot;query_vector&quot;</span>: [-0.5, 9.4, ...],
  <span class="hljs-string">&quot;k&quot;</span>: 10,
  <span class="hljs-string">&quot;num_candidates&quot;</span>: 100
}
}
<button class="copy-code-btn"></button></code></pre>
<p>Il plugin ANN di Elasticsearch supporta solo un algoritmo di indicizzazione: Hierarchical Navigable Small Worlds, noto anche come HNSW (mi piace pensare che il creatore abbia anticipato la Marvel quando si è trattato di rendere popolare il multiverso). Inoltre, come metrica di distanza è supportata solo la distanza L2/Euclidea. È un buon inizio, ma confrontiamolo con Milvus, un vero e proprio database vettoriale. Utilizzo di <code translate="no">pymilvus</code>:</p>
<pre><code translate="no" class="language-python"><span class="hljs-meta">&gt;&gt;&gt; </span>field1 = FieldSchema(name=<span class="hljs-string">&#x27;id&#x27;</span>, dtype=DataType.INT64, description=<span class="hljs-string">&#x27;int64&#x27;</span>, is_primary=<span class="hljs-literal">True</span>)
<span class="hljs-meta">&gt;&gt;&gt; </span>field2 = FieldSchema(name=<span class="hljs-string">&#x27;embedding&#x27;</span>, dtype=DataType.FLOAT_VECTOR, description=<span class="hljs-string">&#x27;embedding&#x27;</span>, dim=<span class="hljs-number">128</span>, is_primary=<span class="hljs-literal">False</span>)
<span class="hljs-meta">&gt;&gt;&gt; </span>schema = CollectionSchema(fields=[field1, field2], description=<span class="hljs-string">&#x27;hello world collection&#x27;</span>)
<span class="hljs-meta">&gt;&gt;&gt; </span>collection = Collection(name=<span class="hljs-string">&#x27;my_collection&#x27;</span>, data=<span class="hljs-literal">None</span>, schema=schema)
<span class="hljs-meta">&gt;&gt;&gt; </span>index_params = {
       <span class="hljs-string">&#x27;index_type&#x27;</span>: <span class="hljs-string">&#x27;IVF_FLAT&#x27;</span>,
       <span class="hljs-string">&#x27;params&#x27;</span>: {<span class="hljs-string">&#x27;nlist&#x27;</span>: <span class="hljs-number">1024</span>},
       <span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&#x27;L2&#x27;</span>}
<span class="hljs-meta">&gt;&gt;&gt; </span>collection.create_index(<span class="hljs-string">&#x27;embedding&#x27;</span>, index_params)
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no" class="language-python"><span class="hljs-meta">&gt;&gt;&gt; </span>search_param = {
       <span class="hljs-string">&#x27;data&#x27;</span>: vector,
       <span class="hljs-string">&#x27;anns_field&#x27;</span>: <span class="hljs-string">&#x27;embedding&#x27;</span>,
       <span class="hljs-string">&#x27;param&#x27;</span>: {<span class="hljs-string">&#x27;metric_type&#x27;</span>: <span class="hljs-string">&#x27;L2&#x27;</span>, <span class="hljs-string">&#x27;params&#x27;</span>: {<span class="hljs-string">&#x27;nprobe&#x27;</span>: <span class="hljs-number">16</span>}},
       <span class="hljs-string">&#x27;limit&#x27;</span>: <span class="hljs-number">10</span>,
       <span class="hljs-string">&#x27;expr&#x27;</span>: <span class="hljs-string">&#x27;id_field &gt; 0&#x27;</span>
   }
<span class="hljs-meta">&gt;&gt;&gt; </span>results = collection.search(**search_param)
<button class="copy-code-btn"></button></code></pre>
<p>Sebbene sia <a href="https://zilliz.com/comparison/elastic-vs-milvus">Elasticsearch che Milvus</a> dispongano di metodi per creare indici, inserire vettori di incorporamento ed eseguire ricerche di prossimità, è chiaro da questi esempi che Milvus ha un'API di ricerca vettoriale più intuitiva (API migliore per l'utente) e un supporto più ampio per gli indici vettoriali e le metriche di distanza (migliore sintonia). Milvus prevede inoltre di supportare un maggior numero di indici vettoriali e di consentire l'interrogazione tramite istruzioni simili a SQL in futuro, migliorando ulteriormente sia la sintonizzazione che l'usabilità.</p>
<p>Abbiamo appena esaurito un bel po' di contenuti. Questa sezione è stata abbastanza lunga, quindi per coloro che l'hanno sfogliata, ecco un breve riassunto: Milvus è migliore dei plugin di ricerca vettoriale perché Milvus è stato costruito da zero come database vettoriale, consentendo un insieme più ricco di funzionalità e un'architettura più adatta ai dati non strutturati.</p>
<h2 id="How-to-choose-from-different-vector-search-technologies" class="common-anchor-header">Come scegliere tra le diverse tecnologie di ricerca vettoriale?<button data-href="#How-to-choose-from-different-vector-search-technologies" class="anchor-icon" translate="no">
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
    </button></h2><p>Non tutti i database vettoriali sono creati allo stesso modo; ognuno possiede caratteristiche uniche che si adattano ad applicazioni specifiche. Le librerie e i plugin di ricerca vettoriale sono facili da usare e ideali per gestire ambienti di produzione su piccola scala con milioni di vettori. Se le dimensioni dei dati sono ridotte e si richiede solo una funzionalità di ricerca vettoriale di base, queste tecnologie sono sufficienti per la vostra attività.</p>
<p>Tuttavia, un database vettoriale specializzato dovrebbe essere la scelta migliore per le aziende ad alta intensità di dati che gestiscono centinaia di milioni di vettori e richiedono risposte in tempo reale. Milvus, ad esempio, gestisce senza problemi miliardi di vettori, offrendo una velocità di interrogazione fulminea e una ricca funzionalità. Inoltre, le soluzioni completamente gestite come Zilliz si rivelano ancora più vantaggiose, liberandovi dalle sfide operative e permettendovi di concentrarvi esclusivamente sulle vostre attività principali.</p>
<h2 id="Take-another-look-at-the-Vector-Database-101-courses" class="common-anchor-header">Date un'occhiata ai corsi Vector Database 101<button data-href="#Take-another-look-at-the-Vector-Database-101-courses" class="anchor-icon" translate="no">
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
    </button></h2><ol>
<li><a href="https://zilliz.com/blog/introduction-to-unstructured-data">Introduzione ai dati non strutturati</a></li>
<li><a href="https://zilliz.com/learn/what-is-vector-database">Che cos'è un database vettoriale?</a></li>
<li><a href="https://zilliz.com/learn/comparing-vector-database-vector-search-library-and-vector-search-plugin">Confronto tra database vettoriali, librerie di ricerca vettoriale e plugin di ricerca vettoriale</a></li>
<li><a href="https://zilliz.com/blog/introduction-to-milvus-vector-database">Introduzione a Milvus</a></li>
<li><a href="https://zilliz.com/blog/milvus-vector-database-quickstart">Avvio rapido di Milvus</a></li>
<li><a href="https://zilliz.com/blog/vector-similarity-search">Introduzione alla ricerca per similarità vettoriale</a></li>
<li><a href="https://zilliz.com/blog/vector-index">Nozioni di base sull'indice vettoriale e sull'indice di file invertito</a></li>
<li><a href="https://zilliz.com/blog/scalar-quantization-and-product-quantization">Quantizzazione scalare e quantizzazione del prodotto</a></li>
<li><a href="https://zilliz.com/blog/hierarchical-navigable-small-worlds-HNSW">Piccoli mondi navigabili gerarchici (HNSW)</a></li>
<li><a href="https://zilliz.com/learn/approximate-nearest-neighbor-oh-yeah-ANNOY">Vicini approssimati Oh Yeah (ANNOY)</a></li>
<li><a href="https://zilliz.com/learn/choosing-right-vector-index-for-your-project">Scegliere il giusto indice vettoriale per il proprio progetto</a></li>
<li><a href="https://zilliz.com/learn/DiskANN-and-the-Vamana-Algorithm">DiskANN e l'algoritmo di Vamana</a></li>
</ol>
