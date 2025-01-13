---
id: how-to-migrate-data-to-milvus-seamlessly.md
title: 'Come migrare i dati a Milvus senza problemi: Una guida completa'
author: Wenhui Zhang
date: 2023-12-01T00:00:00.000Z
desc: >-
  Una guida completa sulla migrazione dei dati da Elasticsearch, FAISS e dalle
  versioni precedenti di Milvus 1.x a Milvus 2.x.
cover: assets.zilliz.com/How_to_Migrate_Your_Data_to_Milvus_with_Ease_485dcb8b22.png
tag: Engineering
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Vector Management, Data Migration, Milvus Migration
recommend: true
canonicalUrl: >-
  https://zilliz.com/blog/how-to-migrate-data-to-milvus-seamlessly-comprehensive-guide
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/How_to_Migrate_Your_Data_to_Milvus_with_Ease_485dcb8b22.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><a href="https://milvus.io/">Milvus</a> è un robusto database vettoriale open-source per la <a href="https://zilliz.com/learn/vector-similarity-search">ricerca di similarità</a>, in grado di memorizzare, elaborare e recuperare miliardi e persino trilioni di dati vettoriali con una latenza minima. È inoltre altamente scalabile, affidabile, cloud-native e ricco di funzionalità. <a href="https://milvus.io/blog/unveiling-milvus-2-3-milestone-release-offering-support-for-gpu-arm64-cdc-and-other-features.md">L'ultima versione di Milvus</a> introduce caratteristiche e miglioramenti ancora più interessanti, tra cui il <a href="https://zilliz.com/blog/getting-started-with-gpu-powered-milvus-unlocking-10x-higher-performance">supporto delle GPU</a> per prestazioni più veloci di 10 volte e MMap per una maggiore capacità di archiviazione su una singola macchina.</p>
<p>A settembre 2023, Milvus ha guadagnato quasi 23.000 stelle su GitHub e conta decine di migliaia di utenti provenienti da diversi settori con esigenze diverse. Sta diventando ancora più popolare con la diffusione di tecnologie di IA generativa come <a href="https://zilliz.com/learn/ChatGPT-Vector-Database-Prompt-as-code">ChatGPT</a>. È un componente essenziale di vari stack di IA, in particolare del framework di <a href="https://zilliz.com/use-cases/llm-retrieval-augmented-generation">generazione aumentata del retrieval</a>, che risolve il problema dell'allucinazione dei modelli linguistici di grandi dimensioni.</p>
<p>Per soddisfare la crescente domanda di nuovi utenti che desiderano migrare a Milvus e di utenti esistenti che desiderano aggiornarsi alle ultime versioni di Milvus, abbiamo sviluppato <a href="https://github.com/zilliztech/milvus-migration">Milvus Migration</a>. In questo blog esploreremo le caratteristiche di Milvus Migration e vi guideremo nel passaggio rapido dei vostri dati a Milvus da Milvus 1.x, <a href="https://zilliz.com/blog/set-up-with-facebook-ai-similarity-search-faiss">FAISS</a> ed <a href="https://zilliz.com/comparison/elastic-vs-milvus">Elasticsearch 7.0</a> e oltre.</p>
<h2 id="Milvus-Migration-a-powerful-data-migration-tool" class="common-anchor-header">Milvus Migration, un potente strumento di migrazione dei dati<button data-href="#Milvus-Migration-a-powerful-data-migration-tool" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://github.com/zilliztech/milvus-migration">Milvus Migration</a> è uno strumento di migrazione dei dati scritto in Go. Consente agli utenti di spostare i propri dati senza problemi dalle versioni precedenti di Milvus (1.x), FAISS ed Elasticsearch 7.0 e oltre, alle versioni Milvus 2.x.</p>
<p>Il diagramma seguente mostra come abbiamo costruito Milvus Migration e come funziona.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/milvus_migration_architecture_144e22f499.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="How-Milvus-Migration-migrates-data" class="common-anchor-header">Come Milvus Migration migra i dati</h3><h4 id="From-Milvus-1x-and-FAISS-to-Milvus-2x" class="common-anchor-header">Da Milvus 1.x e FAISS a Milvus 2.x</h4><p>La migrazione dei dati da Milvus 1.x e FAISS comporta il parsing del contenuto dei file di dati originali, la loro trasformazione nel formato di archiviazione dei dati di Milvus 2.x e la scrittura dei dati utilizzando l'SDK di Milvus <code translate="no">bulkInsert</code>. L'intero processo è basato sul flusso, teoricamente limitato solo dallo spazio su disco, e memorizza i file di dati sul disco locale, S3, OSS, GCP o Minio.</p>
<h4 id="From-Elasticsearch-to-Milvus-2x" class="common-anchor-header">Da Elasticsearch a Milvus 2.x</h4><p>Nella migrazione dei dati Elasticsearch, il recupero dei dati è diverso. I dati non sono ottenuti da file, ma vengono recuperati in modo sequenziale utilizzando l'API di scorrimento di Elasticsearch. I dati vengono poi analizzati e trasformati nel formato di archiviazione di Milvus 2.x, quindi vengono scritti usando <code translate="no">bulkInsert</code>. Oltre alla migrazione di vettori di tipo <code translate="no">dense_vector</code> memorizzati in Elasticsearch, Milvus Migration supporta anche la migrazione di altri tipi di campi, tra cui long, integer, short, boolean, keyword, text e double.</p>
<h3 id="Milvus-Migration-feature-set" class="common-anchor-header">Caratteristiche di Milvus Migration</h3><p>Milvus Migration semplifica il processo di migrazione grazie al suo robusto set di funzioni:</p>
<ul>
<li><p><strong>Sorgenti di dati supportate:</strong></p>
<ul>
<li><p>Da Milvus 1.x a Milvus 2.x</p></li>
<li><p>Elasticsearch 7.0 e successivi a Milvus 2.x</p></li>
<li><p>FAISS a Milvus 2.x</p></li>
</ul></li>
</ul>
<ul>
<li><p><strong>Modalità di interazione multiple:</strong></p>
<ul>
<li><p>Interfaccia a riga di comando (CLI) con il framework Cobra</p></li>
<li><p>API Restful con interfaccia utente Swagger integrata</p></li>
<li><p>Integrazione come modulo Go in altri strumenti</p></li>
</ul></li>
</ul>
<ul>
<li><p><strong>Supporto di formati di file versatili:</strong></p>
<ul>
<li><p>File locali</p></li>
<li><p>Amazon S3</p></li>
<li><p>Servizio di archiviazione a oggetti (OSS)</p></li>
<li><p>Piattaforma cloud di Google (GCP)</p></li>
</ul></li>
</ul>
<ul>
<li><p><strong>Integrazione flessibile con Elasticsearch:</strong></p>
<ul>
<li><p>Migrazione di vettori di tipo <code translate="no">dense_vector</code> da Elasticsearch</p></li>
<li><p>Supporto per la migrazione di altri tipi di campo, come long, integer, short, boolean, keyword, text e double.</p></li>
</ul></li>
</ul>
<h3 id="Interface-definitions" class="common-anchor-header">Definizioni dell'interfaccia</h3><p>Milvus Migration fornisce le seguenti interfacce chiave:</p>
<ul>
<li><p><code translate="no">/start</code>: Avvio di un lavoro di migrazione (equivalente a una combinazione di dump e load, attualmente supporta solo la migrazione ES).</p></li>
<li><p><code translate="no">/dump</code>: Avvia un lavoro di dump (scrive i dati di origine nel supporto di memorizzazione di destinazione).</p></li>
<li><p><code translate="no">/load</code>: Avvia un lavoro di caricamento (scrive i dati dal supporto di memorizzazione di destinazione in Milvus 2.x).</p></li>
<li><p><code translate="no">/get_job</code>: Consente agli utenti di visualizzare i risultati dell'esecuzione del lavoro. (Per maggiori dettagli, consultare il <a href="https://github.com/zilliztech/milvus-migration/blob/main/server/server.go">server.go del progetto</a>).</p></li>
</ul>
<p>Utilizziamo quindi alcuni dati di esempio per esplorare l'uso di Milvus Migration in questa sezione. Potete trovare questi esempi <a href="https://github.com/zilliztech/milvus-migration#migration-examples-migrationyaml-details">qui</a> su GitHub.</p>
<h2 id="Migration-from-Elasticsearch-to-Milvus-2x" class="common-anchor-header">Migrazione da Elasticsearch a Milvus 2.x<button data-href="#Migration-from-Elasticsearch-to-Milvus-2x" class="anchor-icon" translate="no">
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
<li>Preparare i dati Elasticsearch</li>
</ol>
<p>Per <a href="https://zilliz.com/blog/elasticsearch-cloud-vs-zilliz">migrare i</a> dati <a href="https://zilliz.com/blog/elasticsearch-cloud-vs-zilliz">Elasticsearch</a>, è necessario aver già configurato il proprio server Elasticsearch. È necessario memorizzare i dati vettoriali nel campo <code translate="no">dense_vector</code> e indicizzarli con altri campi. Le mappature degli indici sono illustrate di seguito.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/migrate_elasticsearch_data_milvus_index_mappings_59370f9596.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<ol start="2">
<li>Compilazione e compilazione</li>
</ol>
<p>Innanzitutto, scaricare il <a href="https://github.com/zilliztech/milvus-migration">codice sorgente</a> di Milvus Migration <a href="https://github.com/zilliztech/milvus-migration">da GitHub</a>. Quindi, eseguire i seguenti comandi per compilarlo.</p>
<pre><code translate="no"><span class="hljs-keyword">go</span> get
<span class="hljs-keyword">go</span> build
<button class="copy-code-btn"></button></code></pre>
<p>Questo passaggio genererà un file eseguibile chiamato <code translate="no">milvus-migration</code>.</p>
<ol start="3">
<li>Configurazione <code translate="no">migration.yaml</code></li>
</ol>
<p>Prima di avviare la migrazione, è necessario preparare un file di configurazione chiamato <code translate="no">migration.yaml</code> che includa informazioni sull'origine dei dati, sulla destinazione e altre impostazioni rilevanti. Ecco un esempio di configurazione:</p>
<pre><code translate="no"><span class="hljs-comment"># Configuration for Elasticsearch to Milvus 2.x migration</span>


dumper:
  worker:
    workMode: Elasticsearch
    reader:
      bufferSize: 2500
meta:
  mode: config
  index: test_index
  fields:
    - name: <span class="hljs-built_in">id</span>
      pk: <span class="hljs-literal">true</span>
      <span class="hljs-built_in">type</span>: long
    - name: other_field
      maxLen: 60
      <span class="hljs-built_in">type</span>: keyword
    - name: data
      <span class="hljs-built_in">type</span>: dense_vector
      dims: 512
  milvus:
      collection: <span class="hljs-string">&quot;rename_index_test&quot;</span>
      closeDynamicField: <span class="hljs-literal">false</span>
      consistencyLevel: Eventually
      shardNum: 1


<span class="hljs-built_in">source</span>:
  es:
    urls:
      - http://localhost:9200
    username: xxx
    password: xxx


target:
  mode: remote
  remote:
    outputDir: outputPath/migration/test1
    cloud: aws
    region: us-west-2
    bucket: xxx
    useIAM: <span class="hljs-literal">true</span>
    checkBucket: <span class="hljs-literal">false</span>
  milvus2x:
    endpoint: {yourMilvusAddress}:{port}
    username: ******
    password: ******
<button class="copy-code-btn"></button></code></pre>
<p>Per una spiegazione più dettagliata del file di configurazione, consultare <a href="https://github.com/zilliztech/milvus-migration/blob/main/README_ES.md#elasticsearch-to-milvus-2x-migrationyaml-example">questa pagina</a> su GitHub.</p>
<ol start="4">
<li>Eseguire il lavoro di migrazione</li>
</ol>
<p>Dopo aver configurato il file <code translate="no">migration.yaml</code>, è possibile avviare l'attività di migrazione eseguendo il comando seguente:</p>
<pre><code translate="no">./milvus-migration start --config=/{YourConfigFilePath}/migration.yaml
<button class="copy-code-btn"></button></code></pre>
<p>Osservare l'output del log. Se si visualizzano log simili ai seguenti, significa che la migrazione è avvenuta con successo.</p>
<pre><code translate="no">[task/load_base_task.go:94] [<span class="hljs-string">&quot;[LoadTasker] Dec Task Processing--------------&gt;&quot;</span>] [Count=0] [fileName=testfiles/output/zwh/migration/test_mul_field4/data_1_1.json] [taskId=442665677354739304][task/load_base_task.go:76] [<span class="hljs-string">&quot;[LoadTasker] Progress Task ---------------&gt;&quot;</span>] [fileName=testfiles/output/zwh/migration/test_mul_field4/data_1_1.json] [taskId=442665677354739304][dbclient/cus_field_milvus2x.go:86] [<span class="hljs-string">&quot;[Milvus2x] begin to ShowCollectionRows&quot;</span>][loader/cus_milvus2x_loader.go:66] [<span class="hljs-string">&quot;[Loader] Static: &quot;</span>] [collection=test_mul_field4_rename1] [beforeCount=50000] [afterCount=100000] [increase=50000][loader/cus_milvus2x_loader.go:66] [<span class="hljs-string">&quot;[Loader] Static Total&quot;</span>] [<span class="hljs-string">&quot;Total Collections&quot;</span>=1] [beforeTotalCount=50000] [afterTotalCount=100000] [totalIncrease=50000][migration/es_starter.go:25] [<span class="hljs-string">&quot;[Starter] migration ES to Milvus finish!!!&quot;</span>] [Cost=80.009174459][starter/starter.go:106] [<span class="hljs-string">&quot;[Starter] Migration Success!&quot;</span>] [Cost=80.00928425][cleaner/remote_cleaner.go:27] [<span class="hljs-string">&quot;[Remote Cleaner] Begin to clean files&quot;</span>] [bucket=a-bucket] [rootPath=testfiles/output/zwh/migration][cmd/start.go:32] [<span class="hljs-string">&quot;[Cleaner] clean file success!&quot;</span>]
<button class="copy-code-btn"></button></code></pre>
<p>Oltre all'approccio da riga di comando, Milvus Migration supporta anche la migrazione tramite API Restful.</p>
<p>Per utilizzare Restful API, avviare il server API con il seguente comando:</p>
<pre><code translate="no">./milvus-migration server run -p 8080
<button class="copy-code-btn"></button></code></pre>
<p>Una volta eseguito il servizio, è possibile avviare la migrazione chiamando l'API.</p>
<pre><code translate="no">curl -XPOST http://localhost:8080/api/v1/start
<button class="copy-code-btn"></button></code></pre>
<p>Una volta completata la migrazione, è possibile utilizzare <a href="https://zilliz.com/attu">Attu</a>, uno strumento di amministrazione del database vettoriale tutto in uno, per visualizzare il numero totale di righe migrate con successo ed eseguire altre operazioni relative alla raccolta.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/attu_interface_vector_database_admin_4893a31f6d.png" alt="The Attu interface" class="doc-image" id="the-attu-interface" />
   </span> <span class="img-wrapper"> <span>L'interfaccia di Attu</span> </span></p>
<h2 id="Migration-from-Milvus-1x-to-Milvus-2x" class="common-anchor-header">Migrazione da Milvus 1.x a Milvus 2.x<button data-href="#Migration-from-Milvus-1x-to-Milvus-2x" class="anchor-icon" translate="no">
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
<li>Preparare i dati di Milvus 1.x</li>
</ol>
<p>Per aiutarvi a sperimentare rapidamente il processo di migrazione, abbiamo inserito 10.000 record <a href="https://github.com/zilliztech/milvus-migration/blob/main/README_1X.md">di dati</a> Milvus 1.x <a href="https://github.com/zilliztech/milvus-migration/blob/main/README_1X.md">di prova</a> nel codice sorgente di Milvus Migration. Tuttavia, nei casi reali, è necessario esportare il proprio file <code translate="no">meta.json</code> dalla propria istanza Milvus 1.x prima di avviare il processo di migrazione.</p>
<ul>
<li>È possibile esportare i dati con il seguente comando.</li>
</ul>
<pre><code translate="no">./milvus-migration <span class="hljs-built_in">export</span> -m <span class="hljs-string">&quot;user:password@tcp(adderss)/milvus?charset=utf8mb4&amp;parseTime=True&amp;loc=Local&quot;</span> -o outputDir
<button class="copy-code-btn"></button></code></pre>
<p>Assicurarsi di:</p>
<ul>
<li><p>Sostituire i segnaposto con le credenziali MySQL reali.</p></li>
<li><p>Fermare il server Milvus 1.x o interrompere la scrittura dei dati prima di eseguire questa esportazione.</p></li>
<li><p>Copiare la cartella Milvus <code translate="no">tables</code> e il file <code translate="no">meta.json</code> nella stessa directory.</p></li>
</ul>
<p><strong>Nota:</strong> se utilizzate Milvus 2.x su <a href="https://zilliz.com/cloud">Zilliz Cloud</a> (il servizio completamente gestito di Milvus), potete avviare la migrazione utilizzando Cloud Console.</p>
<ol start="2">
<li>Compilazione e creazione</li>
</ol>
<p>Per prima cosa, scaricare il <a href="https://github.com/zilliztech/milvus-migration">codice sorgente</a> di Milvus Migration <a href="https://github.com/zilliztech/milvus-migration">da GitHub</a>. Quindi, eseguire i seguenti comandi per compilarlo.</p>
<pre><code translate="no"><span class="hljs-keyword">go</span> get
<span class="hljs-keyword">go</span> build
<button class="copy-code-btn"></button></code></pre>
<p>Questo passaggio genererà un file eseguibile chiamato <code translate="no">milvus-migration</code>.</p>
<ol start="3">
<li>Configurare <code translate="no">migration.yaml</code></li>
</ol>
<p>Preparare un file di configurazione <code translate="no">migration.yaml</code>, specificando i dettagli sulla sorgente, la destinazione e altre impostazioni rilevanti. Ecco un esempio di configurazione:</p>
<pre><code translate="no"><span class="hljs-comment"># Configuration for Milvus 1.x to Milvus 2.x migration</span>


dumper:
  worker:
    <span class="hljs-built_in">limit</span>: 2
    workMode: milvus1x
    reader:
      bufferSize: 1024
    writer:
      bufferSize: 1024
loader:
  worker:
    <span class="hljs-built_in">limit</span>: 16
meta:
  mode: <span class="hljs-built_in">local</span>
  localFile: /outputDir/test/meta.json


<span class="hljs-built_in">source</span>:
  mode: <span class="hljs-built_in">local</span>
  <span class="hljs-built_in">local</span>:
    tablesDir: /db/tables/


target:
  mode: remote
  remote:
    outputDir: <span class="hljs-string">&quot;migration/test/xx&quot;</span>
    ak: xxxx
    sk: xxxx
    cloud: aws
    endpoint: 0.0.0.0:9000
    region: ap-southeast-1
    bucket: a-bucket
    useIAM: <span class="hljs-literal">false</span>
    useSSL: <span class="hljs-literal">false</span>
    checkBucket: <span class="hljs-literal">true</span>
  milvus2x:
    endpoint: localhost:19530
    username: xxxxx
    password: xxxxx
<button class="copy-code-btn"></button></code></pre>
<p>Per una spiegazione più dettagliata del file di configurazione, consultare <a href="https://github.com/zilliztech/milvus-migration/blob/main/README_1X.md">questa pagina</a> su GitHub.</p>
<ol start="4">
<li>Eseguire il lavoro di migrazione</li>
</ol>
<p>Per completare la migrazione, è necessario eseguire separatamente i comandi <code translate="no">dump</code> e <code translate="no">load</code>. Questi comandi convertono i dati e li importano in Milvus 2.x.</p>
<p><strong>Nota:</strong> a breve semplificheremo questo passaggio e consentiremo agli utenti di completare la migrazione con un solo comando. Restate sintonizzati.</p>
<p><strong>Comando di scarico:</strong></p>
<pre><code translate="no">./milvus-migration dump --config=/{YourConfigFilePath}/migration.yaml
<button class="copy-code-btn"></button></code></pre>
<p><strong>Comando di caricamento:</strong></p>
<pre><code translate="no">./milvus-migration load --config=/{YourConfigFilePath}/migration.yaml
<button class="copy-code-btn"></button></code></pre>
<p>Dopo la migrazione, la collezione generata in Milvus 2.x conterrà due campi: <code translate="no">id</code> e <code translate="no">data</code>. È possibile visualizzare maggiori dettagli utilizzando <a href="https://zilliz.com/attu">Attu</a>, uno strumento di amministrazione di database vettoriali all-in-one.</p>
<h2 id="Migration-from-FAISS-to-Milvus-2x" class="common-anchor-header">Migrazione da FAISS a Milvus 2.x<button data-href="#Migration-from-FAISS-to-Milvus-2x" class="anchor-icon" translate="no">
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
<li>Preparare i dati FAISS</li>
</ol>
<p>Per migrare i dati Elasticsearch, è necessario preparare i propri dati FAISS. Per aiutarvi a sperimentare rapidamente il processo di migrazione, abbiamo inserito alcuni <a href="https://github.com/zilliztech/milvus-migration/blob/main/README_FAISS.md">dati di prova FAISS</a> nel codice sorgente di Milvus Migration.</p>
<ol start="2">
<li>Compilazione e compilazione</li>
</ol>
<p>Innanzitutto, scaricare il <a href="https://github.com/zilliztech/milvus-migration">codice sorgente</a> di Milvus Migration <a href="https://github.com/zilliztech/milvus-migration">da GitHub</a>. Quindi, eseguire i seguenti comandi per compilarlo.</p>
<pre><code translate="no"><span class="hljs-keyword">go</span> get
<span class="hljs-keyword">go</span> build
<button class="copy-code-btn"></button></code></pre>
<p>Questo passo genererà un file eseguibile chiamato <code translate="no">milvus-migration</code>.</p>
<ol start="3">
<li>Configurare <code translate="no">migration.yaml</code></li>
</ol>
<p>Preparare un file di configurazione <code translate="no">migration.yaml</code> per la migrazione FAISS, specificando i dettagli relativi alla sorgente, alla destinazione e ad altre impostazioni rilevanti. Ecco un esempio di configurazione:</p>
<pre><code translate="no"><span class="hljs-comment"># Configuration for FAISS to Milvus 2.x migration</span>


dumper:
  worker:
    <span class="hljs-built_in">limit</span>: 2
    workMode: FAISS
    reader:
      bufferSize: 1024
    writer:
      bufferSize: 1024
loader:
  worker:
    <span class="hljs-built_in">limit</span>: 2
<span class="hljs-built_in">source</span>:
  mode: <span class="hljs-built_in">local</span>
  <span class="hljs-built_in">local</span>:
    FAISSFile: ./testfiles/FAISS/FAISS_ivf_flat.index


target:
  create:
    collection:
      name: test1w
      shardsNums: 2
      dim: 256
      metricType: L2
  mode: remote
  remote:
    outputDir: testfiles/output/
    cloud: aws
    endpoint: 0.0.0.0:9000
    region: ap-southeast-1
    bucket: a-bucket
    ak: minioadmin
    sk: minioadmin
    useIAM: <span class="hljs-literal">false</span>
    useSSL: <span class="hljs-literal">false</span>
    checkBucket: <span class="hljs-literal">true</span>
  milvus2x:
    endpoint: localhost:19530
    username: xxxxx
    password: xxxxx
<button class="copy-code-btn"></button></code></pre>
<p>Per una spiegazione più dettagliata del file di configurazione, consultare <a href="https://github.com/zilliztech/milvus-migration/blob/main/README_FAISS.md">questa pagina</a> su GitHub.</p>
<ol start="4">
<li>Eseguire il lavoro di migrazione</li>
</ol>
<p>Come la migrazione da Milvus 1.x a Milvus 2.x, la migrazione FAISS richiede l'esecuzione dei comandi <code translate="no">dump</code> e <code translate="no">load</code>. Questi comandi convertono i dati e li importano in Milvus 2.x.</p>
<p><strong>Nota:</strong> a breve semplificheremo questo passaggio e consentiremo agli utenti di completare la migrazione con un solo comando. Restate sintonizzati.</p>
<p><strong>Comando Dump:</strong></p>
<pre><code translate="no">./milvus-migration dump --config=/{YourConfigFilePath}/migration.yaml
<button class="copy-code-btn"></button></code></pre>
<p><strong>Comando di caricamento:</strong></p>
<pre><code translate="no">./milvus-migration load --config=/{YourConfigFilePath}/migration.yaml
<button class="copy-code-btn"></button></code></pre>
<p>È possibile visualizzare ulteriori dettagli utilizzando <a href="https://zilliz.com/attu">Attu</a>, uno strumento di amministrazione di database vettoriali all-in-one.</p>
<h2 id="Stay-tuned-for-future-migration-plans" class="common-anchor-header">Rimanete sintonizzati per i futuri piani di migrazione<button data-href="#Stay-tuned-for-future-migration-plans" class="anchor-icon" translate="no">
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
    </button></h2><p>In futuro, supporteremo la migrazione da altre fonti di dati e aggiungeremo altre funzioni di migrazione, tra cui:</p>
<ul>
<li><p>Supporto della migrazione da Redis a Milvus.</p></li>
<li><p>Supporto della migrazione da MongoDB a Milvus.</p></li>
<li><p>Supporto della migrazione con ripresa.</p></li>
<li><p>Semplificare i comandi di migrazione unendo i processi di dump e load in uno solo.</p></li>
<li><p>Supporto della migrazione da altre fonti di dati mainstream a Milvus.</p></li>
</ul>
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
    </button></h2><p>Milvus 2.3, l'ultima versione di Milvus, offre nuove interessanti funzionalità e miglioramenti delle prestazioni che rispondono alle crescenti esigenze di gestione dei dati. La migrazione dei dati a Milvus 2.x può sbloccare questi vantaggi e il progetto Milvus Migration rende il processo di migrazione semplice e snello. Provate e non rimarrete delusi.</p>
<p><em><strong>Nota:</strong> le informazioni contenute in questo blog si basano sullo stato dei progetti Milvus e <a href="https://github.com/zilliztech/milvus-migration">Milvus Migration</a> a settembre 2023. Per informazioni e istruzioni più aggiornate, consultare la <a href="https://milvus.io/docs">documentazione</a> ufficiale di <a href="https://milvus.io/docs">Milvus</a>.</em></p>
