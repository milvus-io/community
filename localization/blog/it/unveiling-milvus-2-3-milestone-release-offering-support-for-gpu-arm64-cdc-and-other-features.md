---
id: >-
  unveiling-milvus-2-3-milestone-release-offering-support-for-gpu-arm64-cdc-and-other-features.md
title: >-
  Presentazione di Milvus 2.3: una release fondamentale che offre il supporto
  per GPU, Arm64, CDC e molte altre caratteristiche molto attese.
author: 'Owen Jiao, Fendy Feng'
date: 2023-08-28T00:00:00.000Z
desc: >-
  Milvus 2.3 è una release miliare con numerose funzionalità molto attese, tra
  cui il supporto per GPU, Arm64, upsert, acquisizione dei dati di modifica,
  indice ScaNN e ricerca per intervallo. Introduce inoltre un miglioramento
  delle prestazioni delle query, un bilanciamento e una pianificazione del
  carico più robusti e una migliore osservabilità e operatività.
cover: assets.zilliz.com/Milvus_2_3_Milvus_io_2e3b0eb55c.jpeg
tag: News
tags: >-
  Vector Database, AI, Artificial Intelligence, Machine Learning, Milvus, LLM,
  Large Language Models, Embeddings, Vector search, Vector similarity search
recommend: true
canonicalUrl: >-
  https://milvus.io/blog/unveiling-milvus-2-3-milestone-release-offering-support-for-gpu-arm64-cdc-and-other-features.md
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Milvus_2_3_Milvus_io_2e3b0eb55c.jpeg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Notizie entusiasmanti! Dopo otto mesi di sforzi concertati, siamo entusiasti di annunciare il rilascio di Milvus 2.3, una versione miliare che introduce numerose funzionalità molto attese, tra cui il supporto per GPU, Arm64, upsert, acquisizione dei dati di modifica, indice ScaNN e tecnologia MMap. Milvus 2.3 introduce anche un miglioramento delle prestazioni delle query, un bilanciamento e una pianificazione del carico più robusti e una migliore osservabilità e operatività.</p>
<p>Scoprite insieme a me queste nuove funzionalità e miglioramenti e come potete trarre vantaggio da questa release.</p>
<h2 id="Support-for-GPU-index-that-leads-to-3-10-times-faster-in-QPS" class="common-anchor-header">Supporto per l'indice GPU che porta a una velocità da 3 a 10 volte superiore in QPS<button data-href="#Support-for-GPU-index-that-leads-to-3-10-times-faster-in-QPS" class="anchor-icon" translate="no">
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
    </button></h2><p>L'indice GPU è una funzionalità molto attesa dalla comunità Milvus. Grazie a una grande collaborazione con gli ingegneri di Nvidia, Milvus 2.3 ha supportato l'indicizzazione su GPU con il robusto algoritmo RAFT aggiunto a Knowhere, il motore di indicizzazione di Milvus. Grazie al supporto delle GPU, Milvus 2.3 è più di tre volte più veloce in QPS rispetto alle versioni precedenti che utilizzano l'indice HNSW della CPU e quasi dieci volte più veloce per i set di dati specifici che richiedono calcoli pesanti.</p>
<h2 id="Arm64-support-to-accommodate-growing-user-demand" class="common-anchor-header">Supporto Arm64 per soddisfare la crescente domanda degli utenti<button data-href="#Arm64-support-to-accommodate-growing-user-demand" class="anchor-icon" translate="no">
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
    </button></h2><p>Le CPU Arm stanno diventando sempre più popolari tra i cloud provider e gli sviluppatori. Per soddisfare questa crescente domanda, Milvus fornisce ora immagini Docker per l'architettura ARM64. Grazie a questo nuovo supporto per le CPU, gli utenti di MacOS possono creare le loro applicazioni con Milvus in modo più semplice.</p>
<h2 id="Upsert-support-for-better-user-experience" class="common-anchor-header">Supporto Upsert per una migliore esperienza utente<button data-href="#Upsert-support-for-better-user-experience" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.3 introduce un notevole miglioramento supportando l'operazione di upsert. Questa nuova funzionalità consente agli utenti di aggiornare o inserire dati senza problemi e di eseguire entrambe le operazioni in un'unica richiesta attraverso l'interfaccia Upsert. Questa funzione semplifica la gestione dei dati e porta efficienza al tavolo.</p>
<p><strong>Nota</strong>:</p>
<ul>
<li>La funzione di upsert non si applica agli ID ad incremento automatico.</li>
<li>Upsert è implementato come una combinazione di <code translate="no">delete</code> e <code translate="no">insert</code>, che può comportare una certa perdita di prestazioni. Si consiglia di utilizzare <code translate="no">insert</code> se si usa Milvus in scenari di scrittura intensiva.</li>
</ul>
<h2 id="Range-search-for-more-accurate-results" class="common-anchor-header">Ricerca a distanza per risultati più precisi<button data-href="#Range-search-for-more-accurate-results" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.3 consente agli utenti di specificare la distanza tra il vettore in ingresso e i vettori memorizzati in Milvus durante un'interrogazione. Milvus restituisce quindi tutti i risultati corrispondenti all'interno dell'intervallo impostato. Di seguito è riportato un esempio di specificazione della distanza di ricerca utilizzando la funzione di ricerca per intervallo.</p>
<pre><code translate="no"><span class="hljs-comment">// add radius and range_filter to params in search_params</span>
search_params = {<span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;nprobe&quot;</span>: <span class="hljs-number">10</span>, <span class="hljs-string">&quot;radius&quot;</span>: <span class="hljs-number">10</span>, <span class="hljs-string">&quot;range_filter&quot;</span> : <span class="hljs-number">20</span>}, <span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;L2&quot;</span>}
res = collection.<span class="hljs-title function_">search</span>(
vectors, <span class="hljs-string">&quot;float_vector&quot;</span>, search_params, topK,
<span class="hljs-string">&quot;int64 &gt; 100&quot;</span>, output_fields=[<span class="hljs-string">&quot;int64&quot;</span>, <span class="hljs-string">&quot;float&quot;</span>]
)
<button class="copy-code-btn"></button></code></pre>
<p>In questo esempio, l'utente richiede a Milvus di restituire vettori entro una distanza di 10-20 unità dal vettore di input.</p>
<p><strong>Nota</strong>: Le diverse metriche di distanza variano nel modo in cui calcolano le distanze, con conseguenti intervalli di valori e strategie di ordinamento diversi. Pertanto, è essenziale comprendere le loro caratteristiche prima di utilizzare la funzione di ricerca per intervallo.</p>
<h2 id="ScaNN-index-for-faster-query-speed" class="common-anchor-header">Indice ScaNN per una maggiore velocità di interrogazione<button data-href="#ScaNN-index-for-faster-query-speed" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.3 supporta ora l'indice ScaNN, un indice open-source <a href="https://zilliz.com/glossary/anns">di prossimità approssimativa (ANN)</a> sviluppato da Google. L'indice ScaNN ha dimostrato prestazioni superiori in vari benchmark, superando HNSW di circa il 20% e risultando circa sette volte più veloce di IVFFlat. Grazie al supporto dell'indice ScaNN, Milvus raggiunge una velocità di interrogazione molto più elevata rispetto alle versioni precedenti.</p>
<h2 id="Growing-index-for-stable-and-better-query-performance" class="common-anchor-header">Indice in crescita per prestazioni stabili e migliori nelle interrogazioni<button data-href="#Growing-index-for-stable-and-better-query-performance" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus comprende due categorie di dati: dati indicizzati e dati in streaming. Milvus può utilizzare gli indici per cercare rapidamente i dati indicizzati, ma può solo cercare brutalmente i dati in streaming riga per riga, il che può avere un impatto sulle prestazioni. Milvus 2.3 introduce il Growing Index, che crea automaticamente indici in tempo reale per i dati in streaming per migliorare le prestazioni delle query.</p>
<h2 id="Iterator-for-data-retrieval-in-batches" class="common-anchor-header">Iteratore per il recupero dei dati in batch<button data-href="#Iterator-for-data-retrieval-in-batches" class="anchor-icon" translate="no">
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
    </button></h2><p>In Milvus 2.3, Pymilvus ha introdotto un'interfaccia iteratore che consente agli utenti di recuperare più di 16.384 entità in una ricerca o in un intervallo di ricerca. Questa funzione è utile quando gli utenti devono esportare decine di migliaia o addirittura più vettori in lotti.</p>
<h2 id="Support-for-MMap-for-increased-capacity" class="common-anchor-header">Supporto per MMap per una maggiore capacità<button data-href="#Support-for-MMap-for-increased-capacity" class="anchor-icon" translate="no">
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
    </button></h2><p>MMap è una chiamata di sistema UNIX utilizzata per mappare file e altri oggetti in memoria. Milvus 2.3 supporta MMap, che consente agli utenti di caricare i dati sui dischi locali e mapparli in memoria, aumentando così la capacità di una singola macchina.</p>
<p>I risultati dei nostri test indicano che, utilizzando la tecnologia MMap, Milvus può raddoppiare la sua capacità di dati limitando il degrado delle prestazioni al 20%. Questo approccio riduce significativamente i costi complessivi, rendendolo particolarmente vantaggioso per gli utenti con un budget limitato che non vogliono compromettere le prestazioni.</p>
<h2 id="CDC-support-for-higher-system-availability" class="common-anchor-header">Supporto CDC per una maggiore disponibilità del sistema<button data-href="#CDC-support-for-higher-system-availability" class="anchor-icon" translate="no">
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
    </button></h2><p>Il Change Data Capture (CDC) è una funzione comunemente usata nei sistemi di database che cattura e replica le modifiche dei dati a una destinazione designata. Con la funzione CDC, Milvus 2.3 consente agli utenti di sincronizzare i dati tra i vari centri dati, di eseguire il backup dei dati incrementali e di migrare i dati senza soluzione di continuità, rendendo il sistema più disponibile.</p>
<p>Oltre alle funzioni sopra descritte, Milvus 2.3 introduce un'interfaccia di conteggio per calcolare con precisione il numero di righe di dati memorizzati in una raccolta in tempo reale, supporta la metrica Cosine per misurare la distanza vettoriale e ulteriori operazioni su array JSON. Per ulteriori caratteristiche e informazioni dettagliate, consultare le <a href="https://milvus.io/docs/release_notes.md">note di rilascio di Milvus 2.3</a>.</p>
<h2 id="Enhancements-and-bug-fixes" class="common-anchor-header">Miglioramenti e correzioni di bug<button data-href="#Enhancements-and-bug-fixes" class="anchor-icon" translate="no">
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
    </button></h2><p>Oltre alle nuove funzioni, Milvus 2.3 include molti miglioramenti e correzioni di bug per le versioni precedenti.</p>
<h3 id="Improved-performance-for-data-filtering" class="common-anchor-header">Migliori prestazioni per il filtraggio dei dati</h3><p>Milvus esegue il filtraggio scalare prima della ricerca vettoriale nelle query ibride di dati scalari e vettoriali per ottenere risultati più precisi. Tuttavia, le prestazioni dell'indicizzazione possono diminuire se l'utente ha filtrato troppi dati dopo il filtraggio scalare. In Milvus 2.3 abbiamo ottimizzato la strategia di filtraggio di HNSW per risolvere questo problema e migliorare le prestazioni delle query.</p>
<h3 id="Increased-multi-core-CPU-usage" class="common-anchor-header">Maggiore utilizzo della CPU multi-core</h3><p>La ricerca approssimata di prossimità (RNA) è un'attività ad alta intensità di calcolo che richiede ingenti risorse di CPU. Nelle versioni precedenti, Milvus poteva utilizzare solo il 70% circa delle risorse CPU multi-core disponibili. Tuttavia, con l'ultima versione, Milvus ha superato questa limitazione e può utilizzare pienamente tutte le risorse CPU multi-core disponibili, migliorando le prestazioni delle query e riducendo lo spreco di risorse.</p>
<h3 id="Refactored-QueryNode" class="common-anchor-header">QueryNode rifatto</h3><p>QueryNode è un componente cruciale di Milvus, responsabile della ricerca vettoriale. Tuttavia, nelle versioni precedenti, QueryNode presentava stati complessi, code di messaggi duplicate, una struttura di codice non organizzata e messaggi di errore non intuitivi.</p>
<p>In Milvus 2.3, abbiamo aggiornato QueryNode introducendo una struttura di codice stateless e rimuovendo la coda di messaggi per la cancellazione dei dati. Questi aggiornamenti si traducono in un minore spreco di risorse e in una ricerca vettoriale più veloce e stabile.</p>
<h3 id="Enhanced-message-queues-based-on-NATS" class="common-anchor-header">Code di messaggi migliorate basate su NATS</h3><p>Abbiamo costruito Milvus su un'architettura basata sui log e nelle versioni precedenti abbiamo utilizzato Pulsar e Kafka come broker di log principali. Tuttavia, questa combinazione ha affrontato tre sfide fondamentali:</p>
<ul>
<li>Era instabile in situazioni multi-topic.</li>
<li>Consuma risorse quando è inattiva e fatica a deduplicare i messaggi.</li>
<li>Pulsar e Kafka sono strettamente legati all'ecosistema Java, quindi la loro comunità raramente mantiene e aggiorna i loro SDK per Go.</li>
</ul>
<p>Per risolvere questi problemi, abbiamo unito NATS e Bookeeper come nuovo log broker per Milvus, che si adatta meglio alle esigenze degli utenti.</p>
<h3 id="Optimized-load-balancer" class="common-anchor-header">Bilanciatore di carico ottimizzato</h3><p>Milvus 2.3 ha adottato un algoritmo di bilanciamento del carico più flessibile, basato sui carichi reali del sistema. Questo algoritmo ottimizzato consente agli utenti di rilevare rapidamente i guasti dei nodi e i carichi sbilanciati e di regolare le pianificazioni di conseguenza. Secondo i risultati dei nostri test, Milvus 2.3 è in grado di rilevare guasti, carichi sbilanciati, stato anomalo dei nodi e altri eventi in pochi secondi e di effettuare prontamente le regolazioni.</p>
<p>Per ulteriori informazioni su Milvus 2.3, consultare le <a href="https://milvus.io/docs/release_notes.md">note di rilascio di Milvus 2.3</a>.</p>
<h2 id="Tool-upgrades" class="common-anchor-header">Aggiornamenti degli strumenti<button data-href="#Tool-upgrades" class="anchor-icon" translate="no">
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
    </button></h2><p>Con Milvus 2.3 abbiamo aggiornato anche Birdwatcher e Attu, due strumenti preziosi per il funzionamento e la manutenzione di Milvus.</p>
<h3 id="Birdwatcher-update" class="common-anchor-header">Aggiornamento di Birdwatcher</h3><p>Abbiamo aggiornato <a href="https://github.com/milvus-io/birdwatcher">Birdwatcher</a>, lo strumento di debug di Milvus, introducendo numerose funzionalità e miglioramenti, tra cui:</p>
<ul>
<li>API RESTful per una perfetta integrazione con altri sistemi di diagnostica.</li>
<li>Supporto del comando PProf per facilitare l'integrazione con lo strumento Go pprof.</li>
<li>Funzionalità di analisi dell'uso dello storage.</li>
<li>Funzionalità efficienti di analisi dei log.</li>
<li>Supporto per la visualizzazione e la modifica delle configurazioni in etcd.</li>
</ul>
<h3 id="Attu-update" class="common-anchor-header">Aggiornamento di Attu</h3><p>Abbiamo lanciato una nuova interfaccia per <a href="https://zilliz.com/attu">Attu</a>, uno strumento di amministrazione di database vettoriali tutto in uno. La nuova interfaccia ha un design più lineare ed è più facile da capire.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Attu_s_new_interface_e24dd0d670.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Per maggiori dettagli, consultare le <a href="https://milvus.io/docs/release_notes.md">note di rilascio di Milvus 2.3</a>.</p>
<h2 id="Let’s-keep-in-touch" class="common-anchor-header">Restiamo in contatto!<button data-href="#Let’s-keep-in-touch" class="anchor-icon" translate="no">
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
    </button></h2><p>Se avete domande o feedback su Milvus, non esitate a contattarci tramite <a href="https://twitter.com/milvusio">Twitter</a> o <a href="https://www.linkedin.com/company/the-milvus-project">LinkedIn</a>. Siete anche invitati a unirvi al nostro <a href="https://milvus.io/slack/">canale Slack</a> per chiacchierare direttamente con i nostri ingegneri e con la comunità, oppure a visitare il nostro <a href="https://us02web.zoom.us/meeting/register/tZ0pcO6vrzsuEtVAuGTpNdb6lGnsPBzGfQ1T#/registration">orario d'ufficio del martedì</a>!</p>
