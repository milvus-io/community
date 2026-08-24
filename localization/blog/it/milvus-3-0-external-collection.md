---
id: milvus-3-0-external-collection.md
title: >-
  Collezione Esterna di Milvus: Indicizzare e Recuperare Dati Residenti nel Data
  Lake Senza Spostarli
author: Leo Liu
date: 2026-8-24
cover: assets.zilliz.com/blog_cover_external_collection_3e4d7334de.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  External Collection, Milvus 3.0, vector search on data lake, Iceberg vector
  search, Vector Lakebase
meta_title: >
  Milvus External Collection: Index and Retrieve Lake-Resident Data Without
  Moving It
desc: >-
  Milvus 3.0 ha introdotto External Collection, consentendo a Milvus di
  costruire indici e servire il recupero su dati che rimangono nel lago.
origin: 'https://milvus.io/blog/milvus-3-0-external-collection.md'
---
<p>In molte pipeline di IA, embedding e metadati vengono già prodotti e archiviati in un data lake. Una pipeline di prodotto potrebbe scrivere attributi di prodotto ed embedding multimodali in file Parquet su S3. Un corpus di retrieval o di training potrebbe risiedere in una tabella Iceberg o Lance. Il lake è già il luogo in cui questi dataset vengono generati, aggiornati, versionati e utilizzati dal resto dello stack dati.</p>
<p>I database vettoriali, tuttavia, sono stati tradizionalmente costruiti attorno a una copia di servizio di proprietà del database. Se i team volevano una ricerca vettoriale a bassa latenza su dati già presenti in un lake, avevano generalmente due opzioni:</p>
<ul>
<li><strong>Copiare i dati in un database vettoriale.</strong> Questa opzione fornisce indici ANN e un percorso di servizio di produzione, ma crea una seconda copia del dataset e una pipeline ETL che deve rimanere sincronizzata con la sorgente.</li>
<li><strong>Interrogare direttamente il lake.</strong> Questa opzione evita la duplicazione, ma senza un livello di indicizzazione e servizio ANN, la ricerca vettoriale si riduce a scansioni non progettate per la latenza di produzione.</li>
</ul>
<p><strong>Milvus 3.0</strong> <a href="https://milvus.io/docs/create-an-external-collection.md"><strong>External Collection</strong></a> <strong>introduce una terza via.</strong> I dati sorgente rimangono in Parquet, Iceberg, Lance, Vortex o in un altro formato esterno supportato, mentre Milvus costruisce e serve indici su di essi. Si mappano i campi esterni in uno schema Milvus, si definiscono gli indici necessari, si aggiorna la collezione e si utilizzano le normali API di ricerca e query di Milvus, senza dover prima copiare le righe sorgente in una collezione gestita da Milvus.</p>
<p>Il cambiamento architetturale è semplice: i dati possono rimanere nel lake, mentre Milvus aggiunge il livello di indicizzazione e retrieval.</p>
<p>Ciò rende External Collection anche un passo importante verso <a href="https://zilliz.com/blog/what-is-a-vector-lakebase"><strong>Vector Lakebase</strong></a><strong>,</strong> un'architettura dati unificata e lake-native per l'IA che combina la capacità di servizio di livello database vettoriale con lo storage open lake, indici a livello di lake riutilizzabili e un livello semantico condiviso. Il retrieval online non deve più partire da una copia di servizio separata mentre Spark, le pipeline di training, i job di valutazione e gli strumenti di governance operano su un'altra versione dei dati. Possono lavorare dalla stessa base dati residente nel lake.</p>
<h2 id="What-an-External-Collection-is-and-what-it-changes" class="common-anchor-header">Cos'è una External Collection e cosa cambia<button data-href="#What-an-External-Collection-is-and-what-it-changes" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Una External Collection</strong> è un tipo di collezione Milvus i cui dati sorgente risiedono al di fuori dello storage gestito da Milvus.</p>
<p>Senza una External Collection, mettere quel catalogo dietro una ricerca vettoriale di produzione significa normalmente creare un'altra copia in Milvus:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/milvus_30_external_collection_vector_search_on_lake_resident_data_without_a_second_copy_md_2_333b278a04.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Ogni volta che il catalogo cambia, che il modello di embedding cambia o che un campo viene riempito retroattivamente, un'altra pipeline deve spostare i dati aggiornati attraverso quel confine.</p>
<p>Con External Collection, l'architettura diventa:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/milvus_30_external_collection_vector_search_on_lake_resident_data_without_a_second_copy_md_3_71172afb44.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Milvus <strong>non</strong> trasforma i file esterni in una propria copia dei dati sorgente. La External Collection contiene invece le informazioni di cui Milvus ha bisogno per interpretarli e cercarli:</p>
<ol>
<li>Un <code translate="no">external_source</code> che identifica i file o la tabella esterni.</li>
<li>Una <code translate="no">external_spec</code> che descrive il formato sorgente e l'accesso allo storage.</li>
<li>I mapping <code translate="no">external_field</code> che collegano i campi dello schema Milvus alle colonne del dataset esterno.</li>
<li>Gli indici, i manifest e lo stato di servizio che Milvus crea per il retrieval.</li>
</ol>
<p><strong>Dati sorgente zero-copy non significa zero stato all'interno di Milvus.</strong> Milvus costruisce comunque gli indici. Utilizza comunque risorse di calcolo. Mantiene comunque dati in cache. Il cambiamento è che le righe authoritative non devono più essere copiate in Milvus semplicemente perché serve che Milvus le cerchi.</p>
<h3 id="Normal-Milvus-Collection-vs-External-Collection" class="common-anchor-header">Collezione Milvus normale vs. External Collection</h3><table>
<thead>
<tr><th><strong>Ambito</strong></th><th><strong>Collezione gestita da Milvus</strong></th><th><strong>External Collection</strong></th></tr>
</thead>
<tbody>
<tr><td>Record sorgente</td><td>Archiviati e gestiti da Milvus</td><td>Rimangono nei file o nella tabella esterni</td></tr>
<tr><td>Come i dati entrano in Milvus</td><td>Insert, upsert, import o scrittura in streaming</td><td>Mapping della sorgente esterna + Refresh</td></tr>
<tr><td>Mutazioni online</td><td>Supportate</td><td>Sola lettura da Milvus</td></tr>
<tr><td>Aggiornamento dei dati</td><td>Segue il percorso di scrittura e il modello di consistenza di Milvus</td><td>Segue l'ultimo Refresh pubblicato con successo</td></tr>
<tr><td>Stato gestito da Milvus</td><td>Dati sorgente, metadati, indici, cache</td><td>Mapping, manifest, indici, cache</td></tr>
<tr><td>Percorso di query</td><td>API di ricerca e query di Milvus</td><td>API di ricerca e query di Milvus</td></tr>
<tr><td>Utilizzo ottimale</td><td>Dati online in continua evoluzione</td><td>Dati lake di grandi dimensioni, prodotti in batch e con letture intensive</td></tr>
</tbody>
</table>
<p>External Collection quindi completa le normali collezioni Milvus invece di sostituirle.</p>
<p>Un sistema può mantenere lo stato online in rapida evoluzione nelle normali collezioni Milvus, utilizzando le External Collection per grandi corpus, cataloghi, dataset storici, feature di modelli o altri dati già prodotti e governati nel lake.</p>
<h2 id="Why-removing-the-second-copy-matters" class="common-anchor-header">Perché eliminare la seconda copia è importante<button data-href="#Why-removing-the-second-copy-matters" class="anchor-icon" translate="no">
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
    </button></h2><p>È forte la tentazione di descrivere le External Collection come un'ottimizzazione dello storage: non copiare diversi terabyte di dati in un altro database e si risparmia spazio. Questo è utile, ma non è il problema architetturale principale.</p>
<p><strong>Il costo più alto deriva dal mantenere allineati due sistemi dati.</strong></p>
<p>Si consideri di nuovo il catalogo prodotti. La piattaforma dati produce il dataset Parquet authoritative. La ricerca lo importa in un database vettoriale. Un team di raccomandazione potrebbe leggere gli stessi dati del lake tramite Spark per analisi offline. Un nuovo modello di embedding genera quindi una colonna vettoriale sostitutiva. Inventario e metadati continuano a cambiare contemporaneamente.</p>
<p>Una volta che la copia di servizio online diventa indipendente dal lake, ogni modifica deve attraversare quel confine:</p>
<ul>
<li>i dati devono essere copiati;</li>
<li>il trasferimento deve essere pianificato e monitorato;</li>
<li>i job falliti necessitano di nuovi tentativi;</li>
<li>schemi e permessi potrebbero dover essere rappresentati in più sistemi;</li>
<li>l'aggiornamento dei dati dipende dalla velocità con cui la pipeline di sincronizzazione recupera il ritardo;</li>
<li>i team devono sapere quale copia rappresenta la versione che vogliono realmente.</li>
</ul>
<p>Lo storage è solo una voce di costo.</p>
<table>
<thead>
<tr><th><strong>Costo</strong></th><th><strong>Lake + copia di servizio separate</strong></th><th><strong>External Collection</strong></th></tr>
</thead>
<tbody>
<tr><td><strong>Copie dei dati sorgente</strong></td><td>Copia nel lake più una copia di servizio separata</td><td>Le righe sorgente rimangono nel lake</td></tr>
<tr><td><strong>Movimentazione dei dati</strong></td><td>Pipeline ETL/import persistente</td><td>Refresh sulla sorgente esterna</td></tr>
<tr><td><strong>Aggiornamento dei dati</strong></td><td>Dipende dalla cadenza di export/import</td><td>Controllato dalla pubblicazione di un nuovo Refresh</td></tr>
<tr><td><strong>Governance</strong></td><td>Le copie sorgente e di servizio devono rimanere allineate</td><td>Proprietà della sorgente, lineage e versionamento rimangono alla piattaforma lake</td></tr>
<tr><td><strong>Riutilizzo offline</strong></td><td>Altri consumer potrebbero preparare le proprie copie</td><td>Gli strumenti lake esistenti possono continuare a leggere la stessa sorgente</td></tr>
<tr><td><strong>Risorse di servizio</strong></td><td>Dimensionate in base alla copia nel database e al carico di query</td><td>Indicizzazione, calcolo delle query e cache possono essere gestiti separatamente dalla proprietà delle righe sorgente</td></tr>
</tbody>
</table>
<p>La differenza diventa particolarmente importante man mano che i dati IA cambiano più spesso.</p>
<p>I team deduplicano i corpus. Raggruppano i dati per analisi. Generano nuovi embedding quando un modello cambia. Aggiungono etichette, riassunti, entità estratte, punteggi di qualità o segnali di feedback. Eseguono job di valutazione e pipeline di pulizia dei dati sullo stesso corpus da cui le applicazioni di produzione effettuano il retrieval.</p>
<p>Se ogni sistema possiede la propria copia, ogni miglioramento diventa un altro job di sincronizzazione.</p>
<p>External Collection cambia questo confine: <strong>i sistemi offline possono continuare a lavorare sul dataset del lake, mentre Milvus serve il retrieval sulla stessa base.</strong></p>
<h2 id="What-data-sources-External-Collection-supports" class="common-anchor-header">Quali sorgenti dati supporta External Collection<button data-href="#What-data-sources-External-Collection-supports" class="anchor-icon" translate="no">
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
    </button></h2><p>External Collection è progettata attorno a dati aperti e gestiti esternamente, piuttosto che a una struttura sorgente specifica di Milvus. Supporta più formati di sorgente esterna tramite <a href="https://milvus.io/blog/why-we-built-loon-a-storage-engine-for-ai-data-that-never-stops-changing.md">Storage V3</a>:</p>
<table>
<thead>
<tr><th><strong>Formato esterno</strong></th><th><strong>Valore del formato</strong></th><th><strong>Cosa legge Milvus</strong></th></tr>
</thead>
<tbody>
<tr><td>Apache Parquet</td><td>parquet</td><td>Una directory o un prefisso di object storage contenente file Parquet e row group</td></tr>
<tr><td>Vortex</td><td>vortex</td><td>File Vortex e relativi metadati di layout</td></tr>
<tr><td>Lance</td><td>lance-table</td><td>Un dataset Lance e i relativi metadati dei frammenti</td></tr>
<tr><td>Apache Iceberg</td><td>iceberg-table</td><td>Metadati Iceberg più uno snapshot selezionato</td></tr>
<tr><td>Snapshot Milvus</td><td>milvus-table</td><td>Uno snapshot Milvus supportato esposto come sorgente esterna</td></tr>
</tbody>
</table>
<p>Il mapping tra sorgente e Milvus è esplicito.</p>
<p>Una colonna sorgente chiamata <code translate="no">product_id</code> può diventare il campo Milvus <code translate="no">id</code>; <code translate="no">image_vec</code> può diventare <code translate="no">embedding</code>; e una tabella sorgente ampia non deve esporre necessariamente ogni colonna alla collezione. Ciò significa che la piattaforma dati non deve rinominare o riscrivere la propria sorgente solo per soddisfare il database di servizio.</p>
<p>I formati versionati aggiungono un'altra proprietà utile. Con una sorgente come Iceberg, la collezione può puntare a uno snapshot specifico anziché a qualunque cosa sia corrente al momento dell'esecuzione della query. Una versione sorgente fissa è utile per valutazioni ripetibili, test di regressione, analisi storiche e workload di audit.</p>
<p>I file sottostanti rimangono inoltre utilizzabili dal resto dello stack dati. Spark, framework di training, sistemi di governance e altri strumenti compatibili con il lake possono continuare a leggere gli stessi dati aperti.</p>
<p>External Collection aggiunge un altro consumer di quei dati; non trasforma Milvus nel suo unico proprietario.</p>
<h3 id="Accessing-external-storage-securely" class="common-anchor-header">Accesso sicuro allo storage esterno</h3><p>Milvus deve inoltre disporre dell'autorizzazione per leggere lo storage esterno.</p>
<p>A seconda del provider di storage, le implementazioni possono utilizzare meccanismi come workload o instance identity, assunzione di ruolo AWS STS, impersonificazione di service account, accesso basato su SAS o sistemi di ruolo specifici del provider, invece di incorporare credenziali di lunga durata nella configurazione dell'applicazione.</p>
<p>Questa identità di storage controlla il modo in cui Milvus raggiunge la sorgente. L'autorizzazione all'interno di Milvus rimane un confine di sicurezza separato.</p>
<h2 id="How-to-create-index-refresh-and-query-an-external-collection" class="common-anchor-header">Come creare, indicizzare, aggiornare e interrogare una External Collection<button data-href="#How-to-create-index-refresh-and-query-an-external-collection" class="anchor-icon" translate="no">
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
    </button></h2><p>Il ciclo di vita di una External Collection prevede quattro passaggi principali:</p>
<ol>
<li>Definire la sorgente esterna e mappare le sue colonne in uno schema Milvus.</li>
<li>Definire gli indici di cui il workload ha bisogno.</li>
<li>Eseguire il Refresh affinché Milvus scopra i dati sorgente e prepari una versione interrogabile.</li>
<li>Caricare la collezione e utilizzare le normali API di ricerca e query di Milvus.</li>
</ol>
<p>Ecco lo stesso catalogo prodotti rappresentato come External Collection:</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">import</span> json
<span class="hljs-keyword">import</span> time

<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> <span class="hljs-title class_">DataType</span>, <span class="hljs-title class_">MilvusClient</span>

client = <span class="hljs-title class_">MilvusClient</span>(
    uri=<span class="hljs-string">&quot;http://localhost:19530&quot;</span>,
    token=<span class="hljs-string">&quot;root:Milvus&quot;</span>,
)

schema = client.<span class="hljs-title function_">create_schema</span>(
    external_source=<span class="hljs-string">&quot;s3://my-lake/datasets/products/&quot;</span>,
    external_spec=json.<span class="hljs-title function_">dumps</span>(
        {
            <span class="hljs-string">&quot;format&quot;</span>: <span class="hljs-string">&quot;parquet&quot;</span>,
            <span class="hljs-string">&quot;extfs&quot;</span>: {
                <span class="hljs-string">&quot;cloud_provider&quot;</span>: <span class="hljs-string">&quot;aws&quot;</span>,
                <span class="hljs-string">&quot;region&quot;</span>: <span class="hljs-string">&quot;us-east-1&quot;</span>,
                <span class="hljs-string">&quot;use_iam&quot;</span>: <span class="hljs-string">&quot;true&quot;</span>,
                <span class="hljs-string">&quot;iam_endpoint&quot;</span>: <span class="hljs-string">&quot;https://sts.us-east-1.amazonaws.com&quot;</span>,
            },
        }
    ),
)

schema.<span class="hljs-title function_">add_field</span>(
    field_name=<span class="hljs-string">&quot;id&quot;</span>,
    datatype=<span class="hljs-title class_">DataType</span>.<span class="hljs-property">INT64</span>,
    external_field=<span class="hljs-string">&quot;product_id&quot;</span>,
)
schema.<span class="hljs-title function_">add_field</span>(
    field_name=<span class="hljs-string">&quot;embedding&quot;</span>,
    datatype=<span class="hljs-title class_">DataType</span>.<span class="hljs-property">FLOAT_VECTOR</span>,
    dim=<span class="hljs-number">768</span>,
    external_field=<span class="hljs-string">&quot;image_vec&quot;</span>,
)
schema.<span class="hljs-title function_">add_field</span>(
    field_name=<span class="hljs-string">&quot;title&quot;</span>,
    datatype=<span class="hljs-title class_">DataType</span>.<span class="hljs-property">VARCHAR</span>,
    max_length=<span class="hljs-number">256</span>,
    external_field=<span class="hljs-string">&quot;product_name&quot;</span>,
)
schema.<span class="hljs-title function_">add_field</span>(
    field_name=<span class="hljs-string">&quot;stock&quot;</span>,
    datatype=<span class="hljs-title class_">DataType</span>.<span class="hljs-property">INT64</span>,
    external_field=<span class="hljs-string">&quot;stock&quot;</span>,
)
schema.<span class="hljs-title function_">add_field</span>(
    field_name=<span class="hljs-string">&quot;rating&quot;</span>,
    datatype=<span class="hljs-title class_">DataType</span>.<span class="hljs-property">FLOAT</span>,
    external_field=<span class="hljs-string">&quot;rating&quot;</span>,
)

client.<span class="hljs-title function_">create_collection</span>(
    collection_name=<span class="hljs-string">&quot;products_ext&quot;</span>,
    schema=schema,
)
<button class="copy-code-btn"></button></code></pre>
<p>Gli indici utilizzano la normale interfaccia di Milvus:</p>
<pre><code translate="no" class="language-python">index_params = client.<span class="hljs-title function_">prepare_index_params</span>()
index_params.<span class="hljs-title function_">add_index</span>(
    field_name=<span class="hljs-string">&quot;embedding&quot;</span>,
    index_type=<span class="hljs-string">&quot;HNSW&quot;</span>,
    metric_type=<span class="hljs-string">&quot;COSINE&quot;</span>,
)
index_params.<span class="hljs-title function_">add_index</span>(field_name=<span class="hljs-string">&quot;stock&quot;</span>, index_type=<span class="hljs-string">&quot;AUTOINDEX&quot;</span>)
index_params.<span class="hljs-title function_">add_index</span>(field_name=<span class="hljs-string">&quot;rating&quot;</span>, index_type=<span class="hljs-string">&quot;AUTOINDEX&quot;</span>)

client.<span class="hljs-title function_">create_index</span>(
    collection_name=<span class="hljs-string">&quot;products_ext&quot;</span>,
    index_params=index_params,
)
<button class="copy-code-btn"></button></code></pre>
<p>Quindi si aggiorna la sorgente esterna:</p>
<pre><code translate="no" class="language-python">job_id = client.refresh_external_collection(
    collection_name=<span class="hljs-string">&quot;products_ext&quot;</span>,
)

<span class="hljs-keyword">while</span> <span class="hljs-literal">True</span>:
    progress = client.get_refresh_external_collection_progress(job_id=job_id)
    <span class="hljs-keyword">if</span> progress.state == <span class="hljs-string">&quot;RefreshCompleted&quot;</span>:
        <span class="hljs-keyword">break</span>
    <span class="hljs-keyword">if</span> progress.state == <span class="hljs-string">&quot;RefreshFailed&quot;</span>:
        <span class="hljs-keyword">raise</span> RuntimeError(progress.reason)
    time.sleep(<span class="hljs-number">2</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Una volta pronta la versione aggiornata, la si carica e la si interroga come una normale collezione Milvus:</p>
<pre><code translate="no" class="language-python">client.load_collection(<span class="hljs-string">&quot;products_ext&quot;</span>)

results = client.search(
    collection_name=<span class="hljs-string">&quot;products_ext&quot;</span>,
    data=[query_vec],
    anns_field=<span class="hljs-string">&quot;embedding&quot;</span>,
    <span class="hljs-built_in">filter</span>=<span class="hljs-string">&quot;stock &gt; 0 and rating &gt;= 4.0&quot;</span>,
    limit=<span class="hljs-number">10</span>,
    output_fields=[<span class="hljs-string">&quot;id&quot;</span>, <span class="hljs-string">&quot;title&quot;</span>, <span class="hljs-string">&quot;stock&quot;</span>, <span class="hljs-string">&quot;rating&quot;</span>],
)
<button class="copy-code-btn"></button></code></pre>
<p>La differenza importante non è la chiamata di ricerca. È il punto in cui inizia il ciclo di vita. Una collezione gestita da Milvus inizia con dati scritti o importati in Milvus. Una External Collection inizia con un riferimento a dati che esistono già altrove.</p>
<h2 id="How-Refresh-picks-up-changes-in-external-data" class="common-anchor-header">Come il Refresh rileva le modifiche nei dati esterni<button data-href="#How-Refresh-picks-up-changes-in-external-data" class="anchor-icon" translate="no">
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
    </button></h2><p>La External Collection è in sola lettura dal lato Milvus, ma il dataset sottostante del lake non deve rimanere congelato per sempre.</p>
<p>Si supponga che la pipeline dei prodotti aggiunga un altro batch, aggiorni i metadati o scriva embedding da un nuovo modello. Milvus non segue in modo continuo ogni oggetto che appare nel percorso sorgente. Queste modifiche diventano visibili tramite il <strong>Refresh</strong>.</p>
<p>Il Refresh legge i metadati esterni, risolve i frammenti della sorgente, aggiorna i manifest che li collegano alla collezione Milvus e prepara lo stato dell'indice corrispondente.</p>
<p>Il punto chiave è che questo lavoro può essere incrementale.</p>
<p>Milvus identifica i frammenti della sorgente che non sono cambiati e può riutilizzare il lavoro di segmento e indice esistente. I frammenti nuovi o modificati sono le parti che richiedono nuova elaborazione.</p>
<p>Una piccola modifica a un dataset di molti terabyte, quindi, non deve innescare un'altra importazione completa e una ricostruzione completa dell'indice.</p>
<p>Il Refresh offre inoltre al sistema di servizio un chiaro confine di versione. Mentre viene preparata una nuova versione, le query continuano a utilizzare lo stato pubblicato in precedenza. Una volta completato il Refresh, il nuovo stato diventa disponibile come versione completa, anziché esporre una miscela di dati vecchi e parzialmente preparati.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/milvus_30_external_collection_vector_search_on_lake_resident_data_without_a_second_copy_md_4_46aaa22589.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Questo modello si adatta naturalmente a build di cataloghi orarie, aggiornamenti notturni della knowledge base, refresh periodici degli embedding, pipeline di feature generate da modelli e workload batch simili.</p>
<p>Non sostituisce <strong>invece</strong> un percorso di scrittura in streaming. Se ogni insert o delete deve diventare ricercabile tramite Milvus immediatamente, una collezione gestita rimane il modello migliore.</p>
<h2 id="How-Lazy-Loading-reduces-memory-use-for-wide-datasets" class="common-anchor-header">Come il Lazy Loading riduce l'uso della memoria per dataset ampi<button data-href="#How-Lazy-Loading-reduces-memory-use-for-wide-datasets" class="anchor-icon" translate="no">
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
    </button></h2><p>Mantenere le righe sorgente nell'object storage è utile solo se il livello di servizio non deve caricare localmente ogni byte prima di poter rispondere alle query. Con Milvus Tiered Storage abilitato, non è così.</p>
<p>Al momento del caricamento della collezione, i QueryNode possono inizialmente mantenere solo metadati leggeri come informazioni sullo schema, definizioni degli indici, mappe dei chunk e riferimenti agli oggetti remoti. I dati dei campi vengono recuperati a livello di chunk quando una query ne ha bisogno; gli indici possono rimanere remoti fino al primo utilizzo, per poi essere memorizzati in cache localmente. I dati utilizzati di frequente rimangono caldi, mentre i dati acceduti meno di frequente possono essere espulsi.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/milvus_30_external_collection_vector_search_on_lake_resident_data_without_a_second_copy_md_5_145b2aa0c7.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Questo è particolarmente utile per dataset IA ampi.</p>
<p>Una riga di prodotto potrebbe contenere diversi embedding, una lunga descrizione, JSON grezzo, metadati delle immagini, riassunti generati, inventario, prezzi, valutazioni e molti altri attributi. Una ricerca di similarità tipica potrebbe toccare solo un vettore più inventario, prezzo e valutazione. Non c'è motivo per cui ogni altro campo debba occupare permanentemente la memoria di servizio solo perché appartiene allo stesso record.</p>
<p>External Collection può ridurre l'impronta di servizio su due livelli:</p>
<ul>
<li><strong>Primo, proiezione a livello di schema.</strong> Tramite <code translate="no">external_field</code>, la External Collection può esporre solo le colonne sorgente di cui l'applicazione ha bisogno. Le altre colonne rimangono nel dataset del lake e non sono incluse in questo schema di servizio.</li>
<li><strong>Secondo, proiezione a runtime.</strong> Con il modello di servizio a livelli, i QueryNode recuperano e mettono in cache i campi e gli indici realmente necessari al workload, invece di caricare l'intero dataset mappato in anticipo.</li>
</ul>
<p>In altre parole, <strong>il dataset può rimanere ampio nel lake senza che l'impronta di servizio debba essere altrettanto ampia.</strong></p>
<p>Esiste un ovvio compromesso. Una query che incontra un campo o un indice freddo può pagare un costo di lettura remota al primo accesso. Le policy di warm-up possono precaricare campi o indici critici per la latenza, mentre le policy di cache ed espulsione impediscono che lo stato acceduto meno di frequente occupi risorse locali indefinitamente.</p>
<p>Il punto non è che l'object storage si comporti come la RAM. È che memoria e disco locale possono seguire il working set del workload di retrieval, piuttosto che la dimensione e l'ampiezza totali del dataset sorgente.</p>
<p>Anche il formato sorgente è importante qui. I formati progettati per scansioni analitiche ampie e i formati ottimizzati per letture più mirate o casuali possono produrre comportamenti I/O diversi in caso di accesso on-demand. External Collection non elimina questi compromessi a livello di storage; consente a Milvus di costruire un livello di retrieval sopra di essi.</p>
<h2 id="What-search-and-indexing-capabilities-External-Collection-supports" class="common-anchor-header">Quali capacità di ricerca e indicizzazione supporta External Collection<button data-href="#What-search-and-indexing-capabilities-External-Collection-supports" class="anchor-icon" translate="no">
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
    </button></h2><p>External Collection non si limita a puntare Milvus a una directory di embedding e a scansionare i file. Milvus costruisce strutture di retrieval sui dati esterni ed esegue le query attraverso il suo motore di retrieval standard.</p>
<h3 id="Milvus-indexes-built-over-external-data" class="common-anchor-header">Indici Milvus costruiti sui dati esterni</h3><p>A seconda dei campi e del workload, Milvus può costruire:</p>
<ul>
<li>indici vettoriali per la ricerca ANN;</li>
<li>indici scalari per il filtraggio dei metadati;</li>
<li>indici JSON per attributi semi-strutturati;</li>
<li>indici BM25 e full-text per il retrieval lessicale.</li>
<li>Campi generati da funzioni supportati dal modello dati di Milvus.</li>
</ul>
<p>La ricerca ANN utilizza questi indici per restringere il set di candidati invece di leggere ogni vettore sorgente.</p>
<p>Questa distinzione è importante perché archiviare un embedding in un lake non equivale a gestire un database vettoriale sopra di esso. La persistenza fornisce byte. Il retrieval di produzione richiede anche indici, pianificazione delle query, filtraggio, ranking, caching e un percorso di servizio a bassa latenza.</p>
<h3 id="Beyond-vector-top-K" class="common-anchor-header">Oltre il top-K vettoriale</h3><p>Un altro errore comune è interpretare "External Collection" come "ricerca vettoriale su Parquet". Questo sottovaluta ciò di cui il retrieval di produzione ha realmente bisogno.</p>
<p>Un risultato di ricerca di produzione raramente dipende solo dalla similarità vettoriale. Può dipendere anche da termini esatti, policy di accesso, inventario, timestamp, categoria, prezzo, qualità della sorgente o segnali di ranking di business.</p>
<p>Si consideri una query come:</p>
<table>
<thead>
<tr><th>vestito floreale rosso per l'estate, disponibile, valutazione più alta prima</th></tr>
</thead>
<tbody>
</tbody>
</table>
<p>Un percorso di retrieval di produzione può richiedere diversi segnali:</p>
<ul>
<li><strong>Similarità vettoriale</strong> per il significato semantico di "vestito floreale estivo".</li>
<li><strong>Ricerca lessicale o full-text</strong> per un termine esatto come "rosso".</li>
<li><strong>Filtri scalari</strong> per escludere i prodotti esauriti o al di sotto di una soglia di valutazione.</li>
<li><strong>Retrieval ibrido e ranking</strong> per combinare più segnali di retrieval.</li>
</ul>
<p>Milvus 3.0 amplia inoltre il motore di query oltre il recupero iniziale dei vicini più prossimi con capacità come <strong>ordinamento lato server, aggregazione e faceting.</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/milvus_30_external_collection_vector_search_on_lake_resident_data_without_a_second_copy_md_6_d805a24b72.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Il punto più ampio è che External Collection offre ai dati residenti nel lake un percorso di retrieval da database, non solo un modo per leggere vettori da file.</p>
<h2 id="How-the-same-lake-data-supports-online-serving-and-offline-processing" class="common-anchor-header">Come gli stessi dati del lake supportano il servizio online e l'elaborazione offline<button data-href="#How-the-same-lake-data-supports-online-serving-and-offline-processing" class="anchor-icon" translate="no">
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
    </button></h2><p>La ragione architetturale più forte per mantenere la sorgente in un formato lake aperto non è semplicemente che una seconda copia costa denaro. È che lo stesso dataset può rimanere disponibile ai sistemi che lo migliorano continuamente.</p>
<p>Si torni al catalogo prodotti.</p>
<p>Durante il giorno, Milvus può servire una External Collection per la ricerca prodotti, le raccomandazioni o il retrieval per agenti.</p>
<p>Allo stesso tempo, altri sistemi possono lavorare direttamente sul dataset del lake:</p>
<ul>
<li>Spark può identificare i prodotti duplicati.</li>
<li>Una pipeline di training può generare embedding da un nuovo modello.</li>
<li>Un job di qualità dei dati può rilevare record malformati o anomali.</li>
<li>Una pipeline di valutazione può confrontare la qualità del retrieval tra versioni del modello.</li>
<li>Un processo batch può generare riassunti, etichette o metadati aggiuntivi.</li>
</ul>
<p>External Collection <strong>non</strong> esegue questi job da sola. Spark rimane Spark; il training rimane training. Il suo ruolo è rimuovere il confine extra dei dati di servizio tra di loro.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/milvus_30_external_collection_vector_search_on_lake_resident_data_without_a_second_copy_md_7_df2791e199.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Il lavoro offline può scrivere dati migliorati o nuovi campi nel lake. Un Refresh successivo rende la sorgente aggiornata disponibile al percorso di retrieval di Milvus.</p>
<p>Non esiste un ciclo separato di export-and-import il cui unico scopo sia ricostruire un'altra copia authoritative per il servizio.</p>
<p>Anche la governance rimane nettamente separata. Le versioni della sorgente, il lineage e la proprietà della sorgente restano alla piattaforma lake. Milvus mantiene la propria autorizzazione a livello di collezione e le credenziali necessarie per leggere la sorgente. Condividere un'unica base dati non significa fondere ogni dominio di sicurezza in un unico sistema.</p>
<p>Questo è il collegamento con <a href="https://zilliz.com/blog/what-is-a-vector-lakebase"><strong>Vector Lakebase</strong></a>: il lake rimane la base dati condivisa, mentre Milvus fornisce un livello di retrieval a bassa latenza sopra di esso. External Collection è una parte di quell'architettura, insieme a Storage V3, Snapshots, integrazione Spark, evoluzione dello schema e backfill.</p>
<h2 id="Where-External-Collection-fitsand-where-it-does-not" class="common-anchor-header">Dove si colloca External Collection, e dove no<button data-href="#Where-External-Collection-fitsand-where-it-does-not" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>External Collection è la scelta giusta quando:</strong></p>
<ul>
<li>I tuoi dati authoritative risiedono già in Parquet, Vortex, Lance, Iceberg o in un'altra sorgente esterna supportata.</li>
<li>Il dataset è prodotto principalmente in batch anziché tramite scritture transazionali ad alta frequenza.</li>
<li>Mantenere una seconda copia di servizio crea un overhead significativo di ETL, aggiornamento o governance.</li>
<li>Più sistemi devono lavorare con lo stesso dataset aperto.</li>
<li>Un confine di Refresh esplicito è accettabile per l'aggiornamento del servizio.</li>
<li>Vuoi il retrieval di produzione di Milvus senza rendere Milvus il proprietario delle righe sorgente.</li>
</ul>
<p><strong>Una normale collezione Milvus è ancora la scelta migliore quando:</strong></p>
<ul>
<li>l'applicazione inserisce o aggiorna record in modo continuo;</li>
<li>le eliminazioni devono diventare visibili attraverso il percorso di scrittura online;</li>
<li>il workload dipende da funzionalità della collezione non disponibili per gli schemi esterni;</li>
<li>Il design di servizio intende mantenere intenzionalmente tutti i dati necessari in memoria, evitando cache miss remoti.</li>
</ul>
<p><strong>Vale la pena tenere a mente diversi confini.</strong></p>
<ul>
<li><strong>Le External Collection sono in sola lettura.</strong> Le modifiche alla sorgente avvengono al di fuori di Milvus.</li>
<li><strong>Lo zero-copy si applica alle righe sorgente.</strong> Indici, manifest, cache e risorse di calcolo hanno comunque un costo.</li>
<li><strong>Il Refresh è esplicito.</strong> Non è un meccanismo di sincronizzazione in streaming.</li>
<li><strong>La sorgente deve rimanere raggiungibile.</strong> Il comportamento di ricerca, indicizzazione e refresh dipende comunque dall'accesso allo storage e dalle credenziali.</li>
<li><strong>Storage V3 è obbligatorio.</strong> In Milvus 3.0 open-source, deve essere abilitato prima di utilizzare External Collection.</li>
<li><strong>External Collection non sostituisce l'elaborazione a monte.</strong> La generazione di embedding, il clustering, la deduplicazione e la pulizia dei dati avvengono comunque nei sistemi a monte appropriati.</li>
</ul>
<p>La scelta è quindi complementare, non binaria. Un sistema può utilizzare le normali collezioni Milvus per lo stato online in rapida evoluzione e le External Collection per dataset ampi prodotti in batch la cui sede naturale è il lake.</p>
<h2 id="Try-External-Collection-in-Milvus-30" class="common-anchor-header">Prova External Collection in Milvus 3.0<button data-href="#Try-External-Collection-in-Milvus-30" class="anchor-icon" translate="no">
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
    </button></h2><p>External Collection è disponibile in Milvus 3.0. Inizia con un dataset lake rappresentativo e valuta gli aspetti che contano per il tuo workload: refresh iniziale e incrementale, costo di costruzione degli indici, comportamento delle query a caldo e a freddo e l'intervallo di aggiornamento richiesto dalla tua applicazione.</p>
<p>Per i dettagli di implementazione, consulta:</p>
<ul>
<li><a href="https://milvus.io/docs/create-an-external-collection.md">Create an External Collection</a></li>
<li><a href="https://milvus.io/docs/release_notes.md">Milvus 3.0 release notes</a></li>
<li><a href="https://milvus.io/blog/announcing-milvus-3-lake-native-vector-search-and-a-more-powerful-retrieval-engine.md">Milvus 3.0 launch blog</a></li>
</ul>
<p>Se preferisci un percorso gestito, External Collection è disponibile anche come parte di <strong>Zilliz Vector Lakebase</strong> in Zilliz Cloud. Consulta:</p>
<ul>
<li><a href="https://docs.zilliz.com/docs/external-collection">External Collection in Zilliz Cloud</a></li>
<li><a href="https://zilliz.com/blog/from-vector-database-to-vector-lakebase">From Vector Database to Vector Lakebase</a></li>
<li><a href="https://zilliz.com/blog/why-we-built-vector-lakebase">Why We Built Vector Lakebase: Rethinking Unstructured Data Architecture for AI</a></li>
</ul>
<p>Puoi anche portare domande di implementazione o feedback al <a href="https://github.com/milvus-io/milvus">repository GitHub di Milvus</a> o alla <a href="https://discord.com/invite/8uyFbECzPX">community Discord di Milvus</a>.</p>
