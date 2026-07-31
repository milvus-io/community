---
id: >-
  announcing-milvus-3-lake-native-vector-search-and-a-more-powerful-retrieval-engine.md
title: >-
  Annuncio di Milvus 3.0: ricerca vettoriale lake-native e un motore di recupero
  più potente
author: Fendy Feng and Li Liu
date: 2026-7-27
cover: assets.zilliz.com/cover_of_milvus_3_0_6fab4ba929.jpg
tag: Announcements
recommend: true
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  Milvus 3.0, lake-native vector search, vector database, External Collections,
  AI retrieval engine
meta_title: |
  Milvus 3.0: Lake-Native Vector Search & Retrieval Engine
desc: >-
  Scopri la ricerca vettoriale lake-native di Milvus 3.0, le raccolte esterne
  zero-copy, il recupero sparso più veloce, gli snapshot, l’integrazione con
  Spark e le funzionalità di ranking avanzate.
origin: >-
  https://milvus.io/blog/announcing-milvus-3-lake-native-vector-search-and-a-more-powerful-retrieval-engine.md
---
<p>Oggi rilasciamo Milvus 3.0, un’importante pietra miliare architetturale per il progetto. Cambia sia dove Milvus può creare e servire gli indici, sia quanta parte del lavoro di retrieval può essere eseguita direttamente all’interno del motore.</p>
<ul>
<li>Milvus 3.0 introduce <strong>un percorso lake-native</strong> per indicizzare dati vettoriali che risiedono in object storage e formati di tabella aperti, tra cui Parquet, Lance, Iceberg e Vortex. I team possono rendere ricercabili i dati residenti nel lake senza mantenere un’altra copia in un database vettoriale.</li>
<li><strong>Questa release estende inoltre Milvus oltre il recupero iniziale dei candidati.</strong> Ordinamento lato server, aggregazione, ricerca a faccette, StructArray per strutture doc/chunk annidate e vettori ColBERT, e un indice sparso riprogettato spostano più attività di ranking, raggruppamento ed elaborazione dei risultati fuori dal codice applicativo e dentro il motore di retrieval.</li>
</ul>
<p>Insieme, questi progressi rendono Milvus la base open-source per il retrieval AI in produzione e per architetture <a href="https://zilliz.com/blog/from-vector-database-to-vector-lakebase">Vector Lakebase</a> che combinano storage lake-native con retrieval vettoriale ad alte prestazioni.</p>
<iframe width="560" height="315" src="https://www.youtube.com/embed/SAm4YfrO1ok?si=xzgw5RjRTwaHWYxO" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
<h2 id="A-quick-glance-at-the-Milvus-30-feature-set" class="common-anchor-header">Una rapida panoramica delle funzionalità di Milvus 3.0<button data-href="#A-quick-glance-at-the-Milvus-30-feature-set" class="anchor-icon" translate="no">
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
    </button></h2><table>
<thead>
<tr><th><strong>Area</strong></th><th><strong>Funzionalità</strong></th><th><strong>Perché è importante</strong></th></tr>
</thead>
<tbody>
<tr><td>Retrieval lake-native</td><td>External Collections su Parquet, Lance, Iceberg e Vortex</td><td>Cerca dati residenti nel lake senza mantenere una seconda copia di serving</td></tr>
<tr><td>Storage basato su S3</td><td>Loon (Storage v3)</td><td>Riduce l’amplificazione delle letture puntuali per accessi in stile serving e supporta l’evoluzione dello schema</td></tr>
<tr><td>Workflow offline/batch e ripristino</td><td>Snapshot, Spark DataSource V2 ed evoluzione dello schema online</td><td>Porta viste stabili delle collection nei pipeline di valutazione, deduplicazione, clustering e feature</td></tr>
<tr><td>Motore di retrieval</td><td>ORDER BY, aggregazione, faccette, StructArray e retrieval sparso migliorato</td><td>Sposta più elaborazione dei risultati e scoring multi-vettore in Milvus</td></tr>
<tr><td>Modello dati e operazioni</td><td>Vettori nullable, TEXT LOB, TTL, MinHash, Woodpecker e ForceMerge</td><td>Supporta modelli dati più ricchi e pattern operativi di produzione</td></tr>
</tbody>
</table>
<h2 id="The-lake-native-infrastructure-index-and-serve-data-where-it-already-lives" class="common-anchor-header">L’infrastruttura lake-native: indicizzare e servire i dati dove già risiedono<button data-href="#The-lake-native-infrastructure-index-and-serve-data-where-it-already-lives" class="anchor-icon" translate="no">
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
    </button></h2><p>Il più grande cambiamento architetturale in Milvus 3.0 riguarda dove il sistema può creare e servire gli indici. I dati vettoriali possono rimanere in formati aperti su object storage mentre Milvus fornisce indicizzazione, retrieval e API di livello produzione.</p>
<h3 id="1-External-Collections-indexing-directly-on-lake-resident-data" class="common-anchor-header">1. External Collections: indicizzazione direttamente su dati residenti nel lake</h3><p>Molti team archiviano già gli embedding in un data lake — tabelle Lance, tabelle Iceberg, file Parquet o altri dataset in formato aperto su S3, GCS o Azure Blob Storage. Prima di Milvus 3.0, di solito esistevano due opzioni per cercare in quei dati.</p>
<ul>
<li>Copiare gli embedding in un database vettoriale. Questo offre ricerca a bassa latenza, ma crea una seconda copia e una pipeline ETL che deve rimanere sincronizzata.</li>
<li>Interrogare direttamente il lake. Questo evita la duplicazione, ma senza indici ANN, la ricerca vettoriale diventa una scansione brute-force che non può soddisfare la latenza di produzione.</li>
</ul>
<p><strong>External Collections introduce una terza via.</strong> Definisci una collection Milvus su dati che rimangono in object storage, mappi i campi esterni in uno schema Milvus e usi le stesse API di ricerca e query di una collection nativa. I file sorgente non vengono spostati; Milvus crea e serve indici vettoriali, invertiti BM25, JSON e scalari sui dati esterni.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/announcing_milvus_30_lake_native_vector_search_and_a_more_powerful_retrieval_engine_md_1_c1fb7ab16e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Le External Collections sono read-only e zero-copy</strong>, il che le rende utili quando governance, confini di proprietà o costi operativi richiedono che il dataset sorgente rimanga nel lake.</p>
<p>Quando il dataset esterno cambia, Milvus legge il suo manifest di storage e indicizza i frammenti appena aggiunti invece di ricostruire l’intera collection.</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">import</span> json
<span class="hljs-keyword">import</span> os
<span class="hljs-keyword">import</span> time

<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> DataType, MilvusClient

client = MilvusClient(uri=<span class="hljs-string">&quot;&quot;</span>)

<span class="hljs-comment"># Register an Iceberg table as a zero-copy collection.</span>
schema = client.create_schema(
    external_source=<span class="hljs-string">&quot;s3://lake/docs/metadata/v1.metadata.json&quot;</span>,
    external_spec=json.dumps(
        {
            <span class="hljs-string">&quot;format&quot;</span>: <span class="hljs-string">&quot;iceberg-table&quot;</span>,
            <span class="hljs-string">&quot;snapshot_id&quot;</span>: <span class="hljs-number">123456789</span>,
            <span class="hljs-string">&quot;extfs&quot;</span>: {
                <span class="hljs-string">&quot;cloud_provider&quot;</span>: <span class="hljs-string">&quot;aws&quot;</span>,
                <span class="hljs-string">&quot;region&quot;</span>: <span class="hljs-string">&quot;us-east-1&quot;</span>,
                <span class="hljs-string">&quot;access_key_id&quot;</span>: os.environ[<span class="hljs-string">&quot;AWS_ACCESS_KEY_ID&quot;</span>],
                <span class="hljs-string">&quot;access_key_value&quot;</span>: os.environ[<span class="hljs-string">&quot;AWS_SECRET_ACCESS_KEY&quot;</span>],
            },
        }
    ),
)

schema.add_field(field_name=<span class="hljs-string">&quot;id&quot;</span>, datatype=DataType.INT64, external_field=<span class="hljs-string">&quot;doc_id&quot;</span>)
schema.add_field(field_name=<span class="hljs-string">&quot;emb&quot;</span>, datatype=DataType.FLOAT_VECTOR, dim=<span class="hljs-number">1024</span>, external_field=<span class="hljs-string">&quot;embedding&quot;</span>)
schema.add_field(field_name=<span class="hljs-string">&quot;title&quot;</span>, datatype=DataType.VARCHAR, max_length=<span class="hljs-number">1024</span>, external_field=<span class="hljs-string">&quot;title&quot;</span>)

client.create_collection(collection_name=<span class="hljs-string">&quot;docs&quot;</span>, schema=schema)

<span class="hljs-comment"># Import the external table snapshot.</span>
job_id = client.refresh_external_collection(collection_name=<span class="hljs-string">&quot;docs&quot;</span>)
<span class="hljs-keyword">while</span> <span class="hljs-literal">True</span>:
    progress = client.get_refresh_external_collection_progress(job_id=job_id)
    <span class="hljs-keyword">if</span> progress.state == <span class="hljs-string">&quot;RefreshCompleted&quot;</span>:
        <span class="hljs-keyword">break</span>
    <span class="hljs-keyword">if</span> progress.state == <span class="hljs-string">&quot;RefreshFailed&quot;</span>:
        <span class="hljs-keyword">raise</span> RuntimeError(progress.reason)
    time.sleep(<span class="hljs-number">1</span>)

index_params = client.prepare_index_params()
index_params.add_index(field_name=<span class="hljs-string">&quot;emb&quot;</span>, index_type=<span class="hljs-string">&quot;HNSW&quot;</span>, metric_type=<span class="hljs-string">&quot;COSINE&quot;</span>)
client.create_index(collection_name=<span class="hljs-string">&quot;docs&quot;</span>, index_params=index_params)

client.load_collection(collection_name=<span class="hljs-string">&quot;docs&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Negli ambienti governati, il retrieval può essere eseguito dove i dati sono autorizzati a risiedere. Per grandi sistemi AI, un dataset residente nel lake può supportare più deployment di retrieval senza un job di migrazione tra di essi.</p>
<p>Le collection esterne sono una funzionalità additiva. Le collection native Milvus rimangono il percorso principale per il serving write-heavy e a bassa latenza, mentre le External Collections sono progettate per dataset il cui sistema di record rimane al di fuori di Milvus.</p>
<p>Per maggiori dettagli, consulta <a href="https://milvus.io/docs/create-an-external-collection.md">Creare una External Collection</a>.</p>
<h3 id="2-Loon-Storage-v3-Efficient-Point-Reads-for-Lake-Native-Retrieval" class="common-anchor-header">2. Loon (Storage v3): letture puntuali efficienti per il retrieval lake-native</h3><p>Le External Collections sollevano una domanda ovvia: l’object storage è progettato per scalabilità e durabilità, ma può supportare le letture puntuali ristrette che seguono una ricerca ANN?</p>
<p><strong>La sfida è l’amplificazione delle letture.</strong> La ricerca vettoriale viene comunemente eseguita in due fasi: un indice ANN restituisce ID candidati e il sistema recupera i campi selezionati per quei candidati. I formati ottimizzati per scansioni analitiche possono trasformare un lookup logico ristretto in una lettura fisica molto più grande.</p>
<p><strong>Milvus 3.0 affronta questo problema con Loon, noto anche come Storage v3, un motore di storage colonnare basato su manifest per object storage compatibile con S3.</strong> Loon organizza i campi in <code translate="no">ColumnGroups</code> con ID riga allineati, consentendo ai campi scalari di privilegiare filtri e scansioni mentre vettori e campi con molte letture puntuali utilizzano layout progettati per lookup più ristretti.</p>
<p>Loon mantiene gli indici vettoriali e invertiti separati dal formato file invece di incorporarli al suo interno. Ogni versione del dataset è descritta da un manifest immutabile che registra i suoi <code translate="no">ColumnGroups</code>, consentendo allo stesso motore di indicizzazione di funzionare su Lance, Parquet, Iceberg e Vortex.</p>
<p>Il design basato su manifest rende inoltre l’evoluzione dello schema meno dirompente. Aggiungere o rimuovere un campo può aggiornare i metadati senza riscrivere le colonne esistenti. Il popolamento di un nuovo campo scrive un nuovo <code translate="no">ColumnGroup</code> lasciando invariati i <code translate="no">ColumnGroups</code> esistenti.</p>
<p><a href="https://github.com/vortex-data/vortex"><strong>Vortex</strong></a> è il formato predefinito per questo percorso. È un formato colonnare aperto e compatibile con Arrow, con layout flessibili e codifiche annidate che si adattano meglio ai dati AI con molte query puntuali. In un benchmark interno con 3 milioni di righe, vettori a 128 dimensioni, S3 e 256 lettori concorrenti, l’I/O misurato per lettura puntuale è sceso da circa 9,4 MB per il baseline Parquet a 0,07 MB per Vortex con Loon, circa 135 volte in meno.</p>
<p>Milvus 3.0 non fa sì che l’object storage si comporti come memoria locale. Riduce l’amplificazione delle letture che altrimenti rende l’object storage impraticabile per lookup puntuali in stile serving. Il predicate pushdown nel formato e una variante locale di Vortex sono i prossimi elementi della roadmap.</p>
<p><em>Per maggiori dettagli, consulta il nostro blog:</em> <a href="https://milvus.io/blog/why-we-built-loon-a-storage-engine-for-ai-data-that-never-stops-changing.md"><em>Perché abbiamo creato Loon</em></a> <em>e il</em> <a href="https://github.com/vortex-data/vortex"><em>progetto Vortex</em></a><em>.</em></p>
<h3 id="3-Snapshots-point-in-time-view-without-data-copy" class="common-anchor-header">3. Snapshot: vista point-in-time senza copia dei dati</h3><p>I job offline hanno bisogno di una vista coerente dei dati anche mentre le collection di produzione continuano a ricevere scritture. Uno snapshot Milvus è una vista point-in-time, read-only, che registra riferimenti a file di dati, indici e metadati esistenti invece di copiare l’intero dataset.</p>
<p>Questo rende gli snapshot abbastanza economici da creare prima di operazioni rischiose come la sostituzione di un modello, un job di re-embedding o una migrazione dello schema. Il ripristino di uno snapshot può riutilizzare file di dati e indici esistenti tramite copia lato server nell’object storage, invece di reimportare ogni riga e ricostruire ogni indice. Questa funzionalità è particolarmente utile per workload in rapido movimento come gli agenti AI, dove i dati cambiano costantemente e si desiderano punti di ripristino frequenti ed economici invece di backup pesanti occasionali.</p>
<p>La stessa vista congelata può supportare valutazione, deduplicazione, validazione di backfill e test isolati mentre la collection live continua ad accettare scritture. Lo snapshot stabilizza l’input logico, sebbene i workload possano comunque condividere infrastrutture come object storage e larghezza di banda di rete.</p>
<p>Gli snapshot non sostituiscono i backup. Uno snapshot fa riferimento a file di proprietà della collection live ed è più adatto a ripristino logico, clonazione e viste stabili di breve durata. Un backup crea una copia indipendente per conservazione a lungo termine e disaster recovery.</p>
<p>Per maggiori informazioni, consulta <a href="https://milvus.io/docs/snapshots.md">Snapshot</a>, <a href="https://milvus.io/docs/manage-snapshots.md">Gestire gli snapshot</a> e <a href="https://milvus.io/docs/snapshot-use-cases.md">Casi d’uso degli snapshot</a>.</p>
<h3 id="4-Spark-connector-connect-Milvus-to-batch-workflows" class="common-anchor-header">4. Connettore Spark: collegare Milvus ai workflow batch</h3><p>Uno snapshot stabile è utile solo se i motori batch possono leggerlo. Milvus 3.0 espone Milvus come Spark DataSource V2, consentendo a job Spark, Databricks ed EMR di leggere da e scrivere su Milvus come parte di pipeline batch standard.</p>
<p>Questa funzionalità è importante perché i workflow di dati AI sono iterativi: la deduplicazione alimenta il re-embedding, il clustering alimenta la valutazione e la valutazione produce set curati per training o serving. Uno snapshot stabile fornisce a questi job un input coerente, mentre la collection live continua a servire. Con il connettore Spark, il sink di un job diventa la sorgente del successivo, senza esportare ogni volta un’intera collection fuori da Milvus.</p>
<p>Milvus 3.0 introduce inoltre operatori batch vector-native per attività come deduplicazione, rilevamento di anomalie e clustering, mantenendo il lavoro compute-heavy fuori dal percorso di query online pur operando direttamente sui dati vettoriali.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/announcing_milvus_30_lake_native_vector_search_and_a_more_powerful_retrieval_engine_md_3_cd37cad0c3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="5-Online-schema-changes-and-backfill" class="common-anchor-header">5. Modifiche dello schema online e backfill</h3><p>Uno schema raramente rimane statico in produzione — i team aggiungono nel tempo nuovi modelli di embedding, vettori sparsi, etichette, campi di metadati e policy di retention. Milvus 3.0 consente di aggiungere, popolare e rimuovere colonne mentre il serving continua, invece delle ricostruzioni dirompenti che ciò richiedeva in passato.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/announcing_milvus_30_lake_native_vector_search_and_a_more_powerful_retrieval_engine_md_4_51c9b4e2c1.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Aggiungere o rimuovere una colonna non richiede la riscrittura dei dati esistenti. <code translate="no">client.add_collection_field(...)</code> inserisce una nuova colonna nullable senza portare offline la collection, e <code translate="no">client.drop_collection_field(...)</code> rimuove a runtime un campo deprecato o sperimentale. Nessuna delle due operazioni riscrive i dati esistenti — ciascuna è una modifica al manifest della collection invece che ai file di dati, motivo per cui non è necessaria alcuna ricostruzione.</p>
<p>Milvus 3.0 supporta due percorsi di backfill:</p>
<ul>
<li><strong>Inner backfill</strong> (in 3.0) è destinato a valori derivati da campi esistenti. Milvus può generare un vettore sparso BM25 da una colonna di testo all’interno del kernel, eliminando la necessità di un encoder lato client quando si costruisce retrieval ibrido dense-plus-sparse.</li>
<li><strong>External backfill</strong>(nella roadmap) sarà destinato a valori calcolati fuori da Milvus: acquisire uno snapshot, eseguire Spark sulla vista coerente, calcolare una nuova colonna, scrivere i valori indietro e lasciare che Milvus aggiorni l’indice in modo incrementale. Questo è il percorso previsto per grandi job di re-embedding — ad esempio, aggiungere una nuova colonna di embedding su centinaia di milioni di righe mentre le scritture continuano.</li>
</ul>
<p>Insieme, modifiche dello schema online e backfill rendono più semplice evolvere le pipeline di retrieval senza ricostruire un’intera collection ogni volta che cambia il modello dati.</p>
<h2 id="A-More-Powerful-Engine-for-End-to-End-Retrieval" class="common-anchor-header">Un motore più potente per il retrieval end-to-end<button data-href="#A-More-Powerful-Engine-for-End-to-End-Retrieval" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus supporta da tempo più della ricerca ANN densa, incluso il retrieval sparso basato su BM25 e la ricerca ibrida. Milvus 3.0 estende il motore lungo un asse diverso: porta più elementi della pipeline di retrieval multi-stadio dentro Milvus stesso, riducendo over-fetching, logica applicativa duplicata e dipendenza da servizi separati di post-processing.</p>
<h3 id="1-Server-side-ORDER-BY-sort-inside-the-engine-per-segment" class="common-anchor-header">1. ORDER BY lato server: ordinamento dentro il motore, per segmento</h3><p>In precedenza, l’ordinamento richiedeva alle applicazioni di recuperare candidati in eccesso, spostarli sul client e ordinarli lì. Questo consumava larghezza di banda e rendeva il risultato finale dipendente dal punto in cui avveniva il troncamento lato client.</p>
<p><strong>Milvus 3.0 aggiunge ORDER BY lato server</strong>, che consente ai workload di query di ordinare le righe filtrate per campi scalari come rating, prezzo, freschezza, inventario o timestamp.</p>
<ul>
<li>Sul percorso di query, ogni segmento ordina il proprio set di risultati filtrati, i query node uniscono questi stream e il proxy restituisce la porzione richiesta.</li>
<li>Sul percorso di ricerca, ORDER BY ordina il set di candidati ANN all’interno di Milvus, riducendo over-fetching lato client e post-processing duplicato. Non modifica il limite di recall stabilito dai candidati ANN.</li>
</ul>
<pre><code translate="no" class="language-sql">client.query(
    collection_name=<span class="hljs-string">&quot;products&quot;</span>,
    <span class="hljs-built_in">filter</span>=<span class="hljs-string">&quot;category == &#x27;shoes&#x27;&quot;</span>,
    output_fields=[<span class="hljs-string">&quot;price&quot;</span>, <span class="hljs-string">&quot;rating&quot;</span>],
    limit=<span class="hljs-number">10</span>,
    order_by=[<span class="hljs-string">&quot;rating:desc&quot;</span>, <span class="hljs-string">&quot;price:asc&quot;</span>],
)
<button class="copy-code-btn"></button></code></pre>
<p>Questo è particolarmente utile per ricerche che combinano rilevanza con vincoli aziendali o rivolti all’utente come rating, prezzo, freschezza, inventario o timestamp.</p>
<p>Per maggiori informazioni, consulta <a href="https://milvus.io/docs/single-vector-search.md#Sort-Search-Results-by-Scalar-Fields--Milvus-30x">Ordinare i risultati di ricerca per campi scalari</a> e <a href="https://milvus.io/docs/get-and-scalar-query.md#Sort-Query-Results--Milvus-30x">Ordinare i risultati di query</a>.</p>
<h3 id="2-Aggregation-and-faceted-search" class="common-anchor-header">2. Aggregazione e ricerca a faccette</h3><p>Milvus 3.0 aggiunge l’aggregazione lato query con operazioni come conteggio, somma, media, minimo e massimo, raggruppate per uno o più campi scalari. Questo elimina un pattern comune in cui i team estraggono righe filtrate nel codice client solo per contare, raggruppare o calcolare semplici statistiche.</p>
<pre><code translate="no" class="language-sql">client.query(
    collection_name=<span class="hljs-string">&quot;orders&quot;</span>,
    <span class="hljs-built_in">filter</span>=<span class="hljs-string">&quot;in_stock == true&quot;</span>,
    group_by_fields=[<span class="hljs-string">&quot;category&quot;</span>],
    output_fields=[<span class="hljs-string">&quot;category&quot;</span>, <span class="hljs-string">&quot;count(*)&quot;</span>, <span class="hljs-string">&quot;avg(price)&quot;</span>, <span class="hljs-string">&quot;max(rating)&quot;</span>],
)
<button class="copy-code-btn"></button></code></pre>
<p>Milvus 3.0 aggiunge inoltre <strong>aggregazione di ricerca</strong> per la ricerca a faccette. Dopo una ricerca ANN, Milvus raggruppa gli hit recuperati per un campo e restituisce conteggi dei bucket, statistiche aggregate e top-N hit campione per bucket — il pattern alla base del raggruppamento per brand, fascia di prezzo, colore, tenant o tipo di documento. Un’avvertenza: l’aggregazione di ricerca opera sul set di risultati recuperati dall’ANN, non sull’intera collection, quindi i conteggi delle faccette sono approssimativi. Quando servono conteggi esatti, usa l’aggregazione lato query.</p>
<p>Per maggiori informazioni, consulta <a href="https://milvus.io/docs/get-and-scalar-query.md#Aggregate-Query-Results--Milvus-30x">Aggregare i risultati di query</a>.</p>
<h3 id="3-StructArray-for-Nested-Vectors-and-Late-Interaction-Model" class="common-anchor-header">3. StructArray per vettori annidati e modello late-interaction</h3><p>Molte entità sono naturalmente rappresentate da più vettori. Un documento lungo è una serie di chunk; un video è una sequenza di frame che preferiresti mantenere insieme in una riga invece di disperdere su molte; un prodotto ha diverse immagini o angolazioni. I modelli late-interaction spingono questo concetto ancora oltre — ColBERT emette un vettore per token, ColPali uno per patch visiva. In ogni caso, l’unità che vuoi effettivamente archiviare e cercare è l’intera entità, non ciascun frammento da solo.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/announcing_milvus_30_lake_native_vector_search_and_a_more_powerful_retrieval_engine_md_5_e15816e38b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>StructArray</strong> consente a una riga Milvus di contenere un array di lunghezza variabile di elementi strutturati, inclusi più vettori, preservando al contempo un singolo ID entità e un unico set di metadati. Questo evita di suddividere un documento in più righe e duplicare etichette, permessi o altri campi tra i frammenti.</p>
<p>Milvus supporta due granularità di ricerca.</p>
<ul>
<li><strong>Ricerca a livello di elemento</strong> confronta un vettore di query con ciascun elemento nella lista e restituisce l’elemento specifico corrispondente con il suo offset. È utile quando vuoi sapere quale chunk, token, patch o immagine ha prodotto la corrispondenza. Una riga può apparire più di una volta se corrispondono più elementi.</li>
<li><strong>Ricerca a livello di entità</strong> confronta l’intera lista di vettori di una query con la lista di vettori della riga usando <code translate="no">MAX_SIM</code>, con la metrica <code translate="no">MAX_SIM_COSINE</code>. Ogni token della query prende la sua migliore corrispondenza nel documento e quei punteggi migliori vengono sommati. Questo offre a Milvus supporto nativo per pattern di retrieval late-interaction come ColBERT e ColPali, mantenendo una riga per documento.</li>
</ul>
<p>Indicizzare ogni vettore token può essere costoso; perciò Milvus 3.0 aggiunge più percorsi di accelerazione, tra cui TokenANN, Muvera e Lemur, che bilanciano dimensione dell’indice, costo di training e recall.</p>
<table>
<thead>
<tr><th>Strategia</th><th>Rappresentazione di primo stadio</th><th>Profilo di costo</th><th>Ideale per</th></tr>
</thead>
<tbody>
<tr><td>TokenANN</td><td>Ogni vettore token è indicizzato.</td><td>Massimo, esatto</td><td>Modelli ad alta discriminazione e documenti brevi</td></tr>
<tr><td>Muvera</td><td>Un vettore per documento usando FDE a proiezione casuale.</td><td>Medio, senza training</td><td>Documenti lunghi</td></tr>
<tr><td>Lemur</td><td>Un vettore per documento usando compressione MLP appresa</td><td>Minimo, richiede training</td><td>Modelli a bassa discriminazione e vettori visivi o di patch</td></tr>
</tbody>
</table>
<p>Nei nostri benchmark, Lemur eguaglia o supera la recall di TokenANN sulla maggior parte dei dataset, comprimendo al contempo ogni documento in un singolo vettore; l’eccezione sono i corpora con elevata varianza di lunghezza, dove TokenANN o un’altra strategia è più sicura.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/announcing_milvus_30_lake_native_vector_search_and_a_more_powerful_retrieval_engine_md_7_8ff1ab957e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Per corpora più grandi della memoria, Milvus supporta anche un indice <code translate="no">DISKANN</code> che mantiene le liste di embedding su disco per ridurre la pressione sulla RAM.</p>
<p>La ricerca a livello di elemento è già arrivata in Milvus 2.6. Il filtraggio per Muvera, Lemur e StructList è nuovo in 3.0.</p>
<h3 id="4-BM25-Index-Compression-and-SINDI" class="common-anchor-header">4. Compressione dell’indice BM25 e SINDI</h3><p>Milvus ha supportato la ricerca vettoriale sparsa nelle release precedenti. Milvus 3.0 riduce l’impronta dell’indice sparso tramite posting compressi a blocchi (algoritmi correlati a VByte più decodifica SIMD) e quantizzazione (fp16 per prodotti interni, u16 per BM25).</p>
<p>Su una serie di benchmark interni BM25, la nuova implementazione era circa 3 volte più piccola dell’indice sparso di Milvus 2.6 a recall comparabile. Un indice più piccolo riduce la pressione su memoria e larghezza di banda e può migliorare la velocità nei workload limitati dallo spostamento dei dati.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/announcing_milvus_30_lake_native_vector_search_and_a_more_powerful_retrieval_engine_md_8_2e62fc9573.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Milvus 3.0 introduce inoltre <a href="https://arxiv.org/abs/2509.08395">SINDI</a>, un nuovo algoritmo di retrieval sparso ottimizzato per embedding sparsi appresi come SPLADE. Poiché questi embedding producono posting list più dense rispetto a BM25, gli algoritmi di ricerca con forte pruning possono spendere molto tempo CPU a decidere cosa saltare. SINDI invece organizza i posting in finestre compatte e usa accumulo dei punteggi SIMD-friendly per elaborarli in modo efficiente, preservando al contempo l’accuratezza del retrieval tramite pruning lossless.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/announcing_milvus_30_lake_native_vector_search_and_a_more_powerful_retrieval_engine_md_9_c7de29a223.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Abbiamo inoltre esteso SINDI oltre il suo design originale per includere il supporto BM25 nativo, consentendo a Milvus di usare lo stesso percorso di retrieval sparso ottimizzato sia per embedding sparsi appresi sia per la ricerca full-text tradizionale.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/announcing_milvus_30_lake_native_vector_search_and_a_more_powerful_retrieval_engine_md_10_e94a903bcd.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Nei nostri benchmark su 4 dataset di vettori sparsi SPLADE, SINDI raggiunge fino a circa 10x i QPS di MaxScore su vettori learned-sparse, con un caso peggiore di circa 5x.</p>
<p>SINDI è il valore predefinito per la ricerca sparsa con prodotto interno in Milvus 3.0.</p>
<h2 id="Other-Enhancements" class="common-anchor-header">Altri miglioramenti<button data-href="#Other-Enhancements" class="anchor-icon" translate="no">
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
<li><strong>TEXT LOB:</strong> Archivia testo sorgente lungo accanto ai vettori. Il testo sotto i 64 KB rimane inline; i valori più grandi usano un riferimento Vortex LOB.</li>
<li><strong>Supporto ampliato agli indici densi:</strong> Aggiunge più scelte di indice all’interno della famiglia Faiss, tra cui SVS, Panorama, PQ, IVFPQ e ScaNN, per diversi requisiti di scala, memoria e recall.</li>
<li><strong>MinHash e ricerca di quasi-duplicati:</strong> Genera firme MinHash lato server e recupera candidati quasi duplicati usando MINHASH_LSH.</li>
<li><strong>Vettori nullable e nuovi tipi:</strong> Consente ai campi vettoriali di essere NULL e aggiunge TIMESTAMPTZ per filtri time-aware e policy di retention.</li>
<li><strong>Dizionari full-text personalizzati:</strong> Registra dizionari, sinonimi e risorse di stop-word sul cluster per tokenizzazione multilingue e specifica di dominio.</li>
<li><strong>Woodpecker standalone:</strong> Esegue il write-ahead log di Milvus come servizio scalabile e osservabile in modo indipendente.</li>
<li><strong>Entity</strong> <strong>TTL****:</strong> Fa scadere singoli record tramite un campo TIMESTAMPTZ, con filtraggio MVCC seguito da garbage collection durante la compaction.</li>
<li><strong>ForceMerge:</strong> Compatta piccoli segmenti fino a una dimensione target e ricostruisce gli indici per ridurre l’amplificazione delle letture prima di un servizio sostenuto read-heavy.</li>
<li>E altro ancora</li>
</ul>
<h2 id="Get-started-with-Milvus-30" class="common-anchor-header">Inizia con Milvus 3.0<button data-href="#Get-started-with-Milvus-30" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 3.0 è disponibile da oggi con licenza Apache 2.0 e rimane un progetto LF AI &amp; Data. Per iniziare:</p>
<ul>
<li>Leggi le <a href="https://milvus.io/docs/release_notes.md">note di rilascio</a> e il <a href="https://milvus.io/docs/quickstart.md">quickstart</a>, e ottieni il sorgente su <a href="https://github.com/milvus-io/milvus">github.com/milvus-io/milvus</a>.</li>
<li>Unisciti alla <a href="https://discord.com/invite/8uyFbECzPX">community Milvus su Discord</a> o prenota una sessione <a href="https://milvus.io/office-hours">Milvus Office Hours</a> per discutere il tuo caso d’uso con i maintainer.</li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/announcing_milvus_30_lake_native_vector_search_and_a_more_powerful_retrieval_engine_md_11_78476298b9.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Milvus-30-and-Zilliz-Vector-Lakebase" class="common-anchor-header">Milvus 3.0 e Zilliz Vector Lakebase<button data-href="#Milvus-30-and-Zilliz-Vector-Lakebase" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 3.0 getta le basi open-source per il retrieval AI in produzione e per l’architettura emergente <a href="https://zilliz.com/blog/from-vector-database-to-vector-lakebase">Vector Lakebase</a>, che combina storage lake-native con retrieval vettoriale ad alte prestazioni su un’unica source of truth, ciascuno al costo giusto.</p>
<p><a href="https://zilliz.com/">Zilliz Cloud</a> è un Vector Lakebase completamente gestito creato dal team dietro Milvus. Condivide la stessa architettura distribuita e lake-native di Milvus ed è pienamente compatibile con l’API Milvus. Alimentato dal suo motore di indicizzazione proprietario Cardinal, Zilliz Cloud offre fino a 10× migliori prestazioni/prezzo rispetto agli approcci di indicizzazione open-source standard, eliminando al contempo la complessità operativa della gestione dell’infrastruttura. Le capacità enterprise includono compute scale-to-zero, disaster recovery cross-region, deployment BYOC, sicurezza e conformità di livello enterprise (SOC 2, HIPAA, ISO 27001 e GDPR) e fino al 99,99% di SLA.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/announcing_milvus_30_lake_native_vector_search_and_a_more_powerful_retrieval_engine_md_12_08d1c21d25.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Gli sviluppatori possono distribuire Milvus come database vettoriale open-source o usare <a href="https://zilliz.com/">Zilliz Cloud</a> per una piattaforma gestita su più workload lungo l’intero ciclo di vita dei dati AI.</p>
<h2 id="What-comes-next" class="common-anchor-header">Cosa viene dopo<button data-href="#What-comes-next" class="anchor-icon" translate="no">
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
    </button></h2><p>La roadmap di Milvus si basa sull’architettura 3.0 con predicate pushdown per External Collections, external backfill, operatori Spark aggiuntivi e supporto per altri formati di tabella, tra cui Delta Lake e Apache Paimon.</p>
<p>La direzione più ampia è chiara: i sistemi di dati AI hanno bisogno di un ciclo più stretto tra retrieval online e miglioramento dei dati offline. I dati vettoriali non dovrebbero dover essere copiati in sistemi separati ogni volta che i team vogliono cercarli, analizzarli, migliorarli o servirli.</p>
