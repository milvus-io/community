---
id: Milvus-Data-Migration-Tool.md
title: Presentazione dello strumento di migrazione dei dati Milvus
author: Zilliz
date: 2021-03-15T10:19:51.125Z
desc: >-
  Scoprite come utilizzare lo strumento di migrazione dei dati Milvus per
  migliorare notevolmente l'efficienza della gestione dei dati e ridurre i costi
  DevOps.
cover: assets.zilliz.com/Generic_Tool_Announcement_97eb04a898.jpg
tag: Engineering
canonicalUrl: 'https://zilliz.com/blog/Milvus-Data-Migration-Tool'
---
<custom-h1>Introduzione allo strumento di migrazione dei dati Milvus</custom-h1><p><em><strong>Nota importante</strong>: lo strumento di migrazione dei dati Mivus è stato deprecato. Per la migrazione dei dati da altri database a Milvus, si consiglia di utilizzare il più avanzato Milvus-migration Tool.</em></p>
<p>Lo strumento Milvus-migration supporta attualmente:</p>
<ul>
<li>Elasticsearch a Milvus 2.x</li>
<li>Faiss a Milvus 2.x</li>
<li>Milvus 1.x a Milvus 2.x</li>
<li>Milvus 2.3.x a Milvus 2.3.x o superiore</li>
</ul>
<p>Supporteremo la migrazione da altre fonti di dati vettoriali come Pinecone, Chroma e Qdrant. Restate sintonizzati.</p>
<p><strong>Per ulteriori informazioni, consultare la <a href="https://milvus.io/docs/migrate_overview.md">documentazione di Milvus-migration</a> o il suo <a href="https://github.com/zilliztech/milvus-migration">repository GitHub</a>.</strong></p>
<p>--------------------------------- <strong>Lo strumento di migrazione dei dati Mivus è stato deprecato</strong> ----------------------</p>
<h3 id="Overview" class="common-anchor-header">Panoramica</h3><p><a href="https://github.com/milvus-io/milvus-tools">MilvusDM</a> (Milvus Data Migration) è uno strumento open-source progettato specificamente per importare ed esportare file di dati con Milvus. MilvusDM può migliorare notevolmente l'efficienza della gestione dei dati e ridurre i costi DevOps nei seguenti modi:</p>
<ul>
<li><p><a href="#faiss-to-milvus">Da Faiss a Milvus</a>: importazione di dati decompressi da Faiss a Milvus.</p></li>
<li><p><a href="#hdf5-to-milvus">Da HDF5 a Milvus</a>: importazione di file HDF5 in Milvus.</p></li>
<li><p><a href="#milvus-to-milvus">Da Milvus a Milvus</a>: migrare i dati da un Milvus di origine a un altro Milvus di destinazione.</p></li>
<li><p><a href="#milvus-to-hdf5">Milvus to HDF5</a>: salvare i dati in Milvus come file HDF5.</p></li>
</ul>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/milvusdm_blog_1_199cbdebe7.png" alt="milvusdm blog 1.png" class="doc-image" id="milvusdm-blog-1.png" />
   </span> <span class="img-wrapper"> <span>blog milvusdm 1.png</span> </span></p>
<p>MilvusDM è ospitato su <a href="https://github.com/milvus-io/milvus-tools">Github</a> e può essere facilmente installato eseguendo la riga di comando <code translate="no">pip3 install pymilvusdm</code>. MilvusDM consente di migrare i dati in una raccolta o partizione specifica. Nelle sezioni seguenti verrà spiegato come utilizzare ciascun tipo di migrazione dei dati.</p>
<p><br/></p>
<h3 id="Faiss-to-Milvus" class="common-anchor-header">Da Faiss a Milvus</h3><h4 id="Steps" class="common-anchor-header">Passi</h4><p>1.Scaricare <strong>F2M.yaml</strong>:</p>
<pre><code translate="no">$ wget <span class="hljs-attr">https</span>:<span class="hljs-comment">//raw.githubusercontent.com/milvus-io/milvus-tools/main/yamls/F2</span>
<button class="copy-code-btn"></button></code></pre>
<p>2. Impostare i seguenti parametri:</p>
<ul>
<li><p><code translate="no">data_path</code>: Percorso dei dati (vettori e ID corrispondenti) in Faiss.</p></li>
<li><p><code translate="no">dest_host</code>: Indirizzo del server Milvus.</p></li>
<li><p><code translate="no">dest_port</code>: Porta del server Milvus.</p></li>
<li><p><code translate="no">mode</code>: I dati possono essere importati in Milvus utilizzando le seguenti modalità:</p>
<ul>
<li><p>Salta: ignora i dati se la raccolta o la partizione esiste già.</p></li>
<li><p>Aggiungi: Aggiunge i dati se la raccolta o la partizione esiste già.</p></li>
<li><p>Sovrascrivi: Cancella i dati prima dell'inserimento se la raccolta o la partizione esiste già.</p></li>
</ul></li>
<li><p><code translate="no">dest_collection_name</code>: Nome della raccolta ricevente per l'importazione dei dati.</p></li>
<li><p><code translate="no">dest_partition_name</code>: Nome della partizione ricevente per l'importazione dei dati.</p></li>
<li><p><code translate="no">collection_parameter</code>: Informazioni specifiche della raccolta, come la dimensione del vettore, la dimensione del file indice e la metrica della distanza.</p></li>
</ul>
<pre><code translate="no">F2M:
  milvus_version: <span class="hljs-number">1.0</span><span class="hljs-number">.0</span>
  data_path: <span class="hljs-string">&#x27;/home/data/faiss.index&#x27;</span>
  dest_host: <span class="hljs-string">&#x27;127.0.0.1&#x27;</span>
  dest_port: <span class="hljs-number">19530</span>
  mode: <span class="hljs-string">&#x27;append&#x27;</span>        <span class="hljs-comment"># &#x27;skip/append/overwrite&#x27;</span>
  dest_collection_name: <span class="hljs-string">&#x27;test&#x27;</span>
  dest_partition_name: <span class="hljs-string">&#x27;&#x27;</span>
  collection_parameter:
    dimension: <span class="hljs-number">256</span>
    index_file_size: <span class="hljs-number">1024</span>
    metric_type: <span class="hljs-string">&#x27;L2&#x27;</span>
<button class="copy-code-btn"></button></code></pre>
<p>3. Eseguire <strong>F2M.yaml:</strong></p>
<pre><code translate="no">$ milvusdm --yaml F2M.yaml
<button class="copy-code-btn"></button></code></pre>
<h4 id="Sample-Code" class="common-anchor-header">Codice di esempio</h4><p>1.Leggere i file Faiss per recuperare i vettori e gli ID corrispondenti.</p>
<pre><code translate="no">ids, vectors = faiss_data.read_faiss_data()
<button class="copy-code-btn"></button></code></pre>
<p>2. Inserire i dati recuperati in Milvus:</p>
<pre><code translate="no">insert_milvus.insert_data(vectors, <span class="hljs-variable language_">self</span>.dest_collection_name, <span class="hljs-variable language_">self</span>.collection_parameter, <span class="hljs-variable language_">self</span>.mode, ids, <span class="hljs-variable language_">self</span>.dest_partition_name)
<button class="copy-code-btn"></button></code></pre>
<p><br/></p>
<h3 id="HDF5-to-Milvus" class="common-anchor-header">Da HDF5 a Milvus</h3><h4 id="Steps" class="common-anchor-header">Passi</h4><p>1.Scaricare <strong>H2M.yaml</strong>.</p>
<pre><code translate="no">$ wget <span class="hljs-attr">https</span>:<span class="hljs-comment">//raw.githubusercontent.com/milvus-io/milvus-tools/main/yamls/H2M.yaml</span>
<button class="copy-code-btn"></button></code></pre>
<p>2.Impostare i seguenti parametri:</p>
<ul>
<li><p><code translate="no">data_path</code>: Percorso dei file HDF5.</p></li>
<li><p><code translate="no">data_dir</code>: Directory contenente i file HDF5.</p></li>
<li><p><code translate="no">dest_host</code>: Indirizzo del server Milvus.</p></li>
<li><p><code translate="no">dest_port</code>: Porta del server Milvus.</p></li>
<li><p><code translate="no">mode</code>: I dati possono essere importati in Milvus utilizzando le seguenti modalità:</p>
<ul>
<li><p>Salta: ignora i dati se la raccolta o la partizione esiste già.</p></li>
<li><p>Aggiungi: Aggiunge i dati se la raccolta o la partizione esiste già.</p></li>
<li><p>Sovrascrivi: Cancella i dati prima dell'inserimento se la raccolta o la partizione esiste già.</p></li>
</ul></li>
<li><p><code translate="no">dest_collection_name</code>: Nome della raccolta ricevente per l'importazione dei dati.</p></li>
<li><p><code translate="no">dest_partition_name</code>: Nome della partizione ricevente per l'importazione dei dati.</p></li>
<li><p><code translate="no">collection_parameter</code>: Informazioni specifiche della raccolta, come la dimensione del vettore, la dimensione del file indice e la metrica della distanza.</p></li>
</ul>
<blockquote>
<p>Impostare <code translate="no">data_path</code> o <code translate="no">data_dir</code>. <strong>Non</strong> impostarli entrambi. Usare <code translate="no">data_path</code> per specificare più percorsi di file o <code translate="no">data_dir</code> per specificare la directory che contiene il file di dati.</p>
</blockquote>
<pre><code translate="no">H2M:
  milvus-version: 1.0.0
  data_path:
    - /Users/zilliz/float_1.h5
    - /Users/zilliz/float_2.h5
  data_dir:
  dest_host: <span class="hljs-string">&#x27;127.0.0.1&#x27;</span>
  dest_port: 19530
  mode: <span class="hljs-string">&#x27;overwrite&#x27;</span>        <span class="hljs-comment"># &#x27;skip/append/overwrite&#x27;</span>
  dest_collection_name: <span class="hljs-string">&#x27;test_float&#x27;</span>
  dest_partition_name: <span class="hljs-string">&#x27;partition_1&#x27;</span>
  collection_parameter:
    dimension: 128
    index_file_size: 1024
    metric_type: <span class="hljs-string">&#x27;L2&#x27;</span>
<button class="copy-code-btn"></button></code></pre>
<p>3. Eseguire <strong>H2M.yaml:</strong></p>
<pre><code translate="no">$ milvusdm --yaml H2M.yaml
<button class="copy-code-btn"></button></code></pre>
<h4 id="Sample-Code" class="common-anchor-header">Codice di esempio</h4><p>1.Leggere i file HDF5 per recuperare i vettori e gli ID corrispondenti:</p>
<pre><code translate="no">vectors, ids = <span class="hljs-variable language_">self</span>.file.read_hdf5_data()
<button class="copy-code-btn"></button></code></pre>
<p>2. Inserire i dati recuperati in Milvus:</p>
<pre><code translate="no">ids = insert_milvus.insert_data(vectors, <span class="hljs-variable language_">self</span>.c_name, <span class="hljs-variable language_">self</span>.c_param, <span class="hljs-variable language_">self</span>.mode, ids,<span class="hljs-variable language_">self</span>.p_name)
<button class="copy-code-btn"></button></code></pre>
<p><br/></p>
<h3 id="Milvus-to-Milvus" class="common-anchor-header">Da Milvus a Milvus</h3><h4 id="Steps" class="common-anchor-header">Passi</h4><p>1.Scaricare <strong>M2M.yaml</strong>.</p>
<pre><code translate="no">$ wget <span class="hljs-attr">https</span>:<span class="hljs-comment">//raw.githubusercontent.com/milvus-io/milvus-tools/main/yamls/M2M.yaml</span>
<button class="copy-code-btn"></button></code></pre>
<p>2.Impostare i seguenti parametri:</p>
<ul>
<li><p><code translate="no">source_milvus_path</code>: Percorso di lavoro Milvus di origine.</p></li>
<li><p><code translate="no">mysql_parameter</code>: Impostazioni MySQL di Milvus. Se non si usa MySQL, impostare mysql_parameter come ''.</p></li>
<li><p><code translate="no">source_collection</code>: Nomi della collezione e delle sue partizioni nell'origine Milvus.</p></li>
<li><p><code translate="no">dest_host</code>: Indirizzo del server Milvus.</p></li>
<li><p><code translate="no">dest_port</code>: Porta del server Milvus.</p></li>
<li><p><code translate="no">mode</code>: I dati possono essere importati in Milvus utilizzando le seguenti modalità:</p>
<ul>
<li><p>Salta: ignora i dati se la raccolta o la partizione esiste già.</p></li>
<li><p>Aggiungi: Aggiunge i dati se la raccolta o la partizione esiste già.</p></li>
<li><p>Sovrascrivi: Se la raccolta o la partizione esiste già, cancellare i dati prima di inserirli.Cancellare i dati prima dell'inserimento se la raccolta o la partizione esiste già.</p></li>
</ul></li>
</ul>
<pre><code translate="no">M2M:
  milvus_version: 1.0.0
  source_milvus_path: <span class="hljs-string">&#x27;/home/user/milvus&#x27;</span>
  mysql_parameter:
    host: <span class="hljs-string">&#x27;127.0.0.1&#x27;</span>
    user: <span class="hljs-string">&#x27;root&#x27;</span>
    port: 3306
    password: <span class="hljs-string">&#x27;123456&#x27;</span>
    database: <span class="hljs-string">&#x27;milvus&#x27;</span>
  source_collection:
    <span class="hljs-built_in">test</span>:
      - <span class="hljs-string">&#x27;partition_1&#x27;</span>
      - <span class="hljs-string">&#x27;partition_2&#x27;</span>
  dest_host: <span class="hljs-string">&#x27;127.0.0.1&#x27;</span>
  dest_port: 19530
  mode: <span class="hljs-string">&#x27;skip&#x27;</span> <span class="hljs-comment"># &#x27;skip/append/overwrite&#x27;</span>
<button class="copy-code-btn"></button></code></pre>
<p>3. Eseguire <strong>M2M.yaml.</strong></p>
<pre><code translate="no">$ milvusdm --yaml M2M.yaml
<button class="copy-code-btn"></button></code></pre>
<h4 id="Sample-Code" class="common-anchor-header">Codice di esempio</h4><p>1. In base ai metadati di una raccolta o di una partizione specificata, leggere i file sotto <strong>milvus/db</strong> sull'unità locale per recuperare i vettori e gli ID corrispondenti dall'origine Milvus.</p>
<pre><code translate="no">collection_parameter, _ = milvus_meta.get_collection_info(collection_name)
r_vectors, r_ids, r_rows = milvusdb.read_milvus_file(<span class="hljs-variable language_">self</span>.milvus_meta, collection_name, partition_tag)
<button class="copy-code-btn"></button></code></pre>
<p>2. Inserire i dati recuperati nel Milvus di destinazione.</p>
<pre><code translate="no">milvus_insert.insert_data(r_vectors, collection_name, collection_parameter, <span class="hljs-variable language_">self</span>.mode, r_ids, partition_tag)
<button class="copy-code-btn"></button></code></pre>
<p><br/></p>
<h3 id="Milvus-to-HDF5" class="common-anchor-header">Da Milvus a HDF5</h3><h4 id="Steps" class="common-anchor-header">Passi</h4><p>1.Scaricare <strong>M2H.yaml</strong>:</p>
<pre><code translate="no">$ wget <span class="hljs-attr">https</span>:<span class="hljs-comment">//raw.githubusercontent.com/milvus-io/milvus-tools/main/yamls/M2H.yaml</span>
<button class="copy-code-btn"></button></code></pre>
<p>2.Impostare i seguenti parametri:</p>
<ul>
<li><p><code translate="no">source_milvus_path</code>: Percorso di lavoro Milvus di origine.</p></li>
<li><p><code translate="no">mysql_parameter</code>: Impostazioni MySQL di Milvus. Se non si usa MySQL, impostare mysql_parameter come ''.</p></li>
<li><p><code translate="no">source_collection</code>: Nomi della collezione e delle sue partizioni nell'origine Milvus.</p></li>
<li><p><code translate="no">data_dir</code>: Directory per contenere i file HDF5 salvati.</p></li>
</ul>
<pre><code translate="no">M2H:
  milvus_version: <span class="hljs-number">1.0</span><span class="hljs-number">.0</span>
  source_milvus_path: <span class="hljs-string">&#x27;/home/user/milvus&#x27;</span>
  mysql_parameter:
    host: <span class="hljs-string">&#x27;127.0.0.1&#x27;</span>
    user: <span class="hljs-string">&#x27;root&#x27;</span>
    port: <span class="hljs-number">3306</span>
    password: <span class="hljs-string">&#x27;123456&#x27;</span>
    database: <span class="hljs-string">&#x27;milvus&#x27;</span>
  source_collection: # specify the <span class="hljs-string">&#x27;partition_1&#x27;</span> and <span class="hljs-string">&#x27;partition_2&#x27;</span> partitions of the <span class="hljs-string">&#x27;test&#x27;</span> collection.
    test:
      - <span class="hljs-string">&#x27;partition_1&#x27;</span>
      - <span class="hljs-string">&#x27;partition_2&#x27;</span>
  data_dir: <span class="hljs-string">&#x27;/home/user/data&#x27;</span>
<button class="copy-code-btn"></button></code></pre>
<p>3.Eseguire <strong>M2H.yaml</strong>:</p>
<pre><code translate="no">$ milvusdm --yaml M2H.yaml
<button class="copy-code-btn"></button></code></pre>
<h4 id="Sample-Code" class="common-anchor-header">Codice di esempio</h4><p>1.In base ai metadati di una collezione o di una partizione specificata, legge i file sotto <strong>milvus/db</strong> sull'unità locale per recuperare i vettori e gli ID corrispondenti.</p>
<pre><code translate="no">collection_parameter, version = milvus_meta.get_collection_info(collection_name)
r_vectors, r_ids, r_rows = milvusdb.read_milvus_file(<span class="hljs-variable language_">self</span>.milvus_meta, collection_name, partition_tag)
<button class="copy-code-btn"></button></code></pre>
<p>2. Salvare i dati recuperati come file HDF5.</p>
<pre><code translate="no">data_save.save_yaml(collection_name, partition_tag, collection_parameter, version, save_hdf5_name)
<button class="copy-code-btn"></button></code></pre>
<h3 id="MilvusDM-File-Structure" class="common-anchor-header">Struttura dei file di MilvusDM</h3><p>Il diagramma di flusso sottostante mostra come MilvusDM esegue diversi compiti in base al file YAML ricevuto:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/milvusdm_blog_2_7824b16e5e.png" alt="milvusdm blog 2.png" class="doc-image" id="milvusdm-blog-2.png" />
   </span> <span class="img-wrapper"> <span>milvusdm blog 2.png</span> </span></p>
<p>Struttura del file MilvusDM:</p>
<ul>
<li><p>pymilvusdm</p>
<ul>
<li><p>nucleo</p>
<ul>
<li><p><strong>milvus_client.py</strong>: Esegue operazioni client in Milvus.</p></li>
<li><p><strong>read_data.py</strong>: Legge i file di dati HDF5 sull'unità locale. (Aggiungete qui il vostro codice per supportare la lettura di file di dati in altri formati).</p></li>
<li><p><strong>read_faiss_data.py</strong>: Legge i file di dati in Faiss.</p></li>
<li><p><strong>read_milvus_data.py</strong>: Legge i file di dati in Milvus.</p></li>
<li><p><strong>read_milvus_meta.py</strong>: Legge i metadati in Milvus.</p></li>
<li><p><strong>data_to_milvus.py</strong>: Crea collezioni o partizioni in base ai parametri dei file YAML e importa i vettori e gli ID dei vettori corrispondenti in Milvus.</p></li>
<li><p><strong>save_data.py</strong>: Salva i dati come file HDF5.</p></li>
<li><p><strong>write_logs.py</strong>: Scrive i log durante l'esecuzione.</p></li>
</ul></li>
<li><p><strong>faiss_to_milvus.py</strong>: Importa i dati da Faiss a Milvus.</p></li>
<li><p><strong>hdf5_to_milvus.py</strong>: Importa i dati in file HDF5 in Milvus.</p></li>
<li><p><strong>milvus_to_milvus.py</strong>: Migra i dati da un Milvus di origine al Milvus di destinazione.</p></li>
<li><p><strong>milvus_to_hdf5.py</strong>: Esporta i dati in Milvus e li salva come file HDF5.</p></li>
<li><p><strong>main.py</strong>: Esegue i compiti corrispondenti in base al file YAML ricevuto.</p></li>
<li><p><strong>setting.py</strong>: Configurazioni relative all'esecuzione del codice MilvusDM.</p></li>
</ul></li>
<li><p><strong>setup.py</strong>: Crea i pacchetti di file <strong>pymilvusdm</strong> e li carica su PyPI (Python Package Index).</p></li>
</ul>
<p><br/></p>
<h3 id="Recap" class="common-anchor-header">Riconoscimento</h3><p>MilvusDM gestisce principalmente la migrazione dei dati da e verso Milvus, che comprende Faiss a Milvus, HDF5 a Milvus, Milvus a Milvus e Milvus a HDF5.</p>
<p>Le seguenti funzioni sono previste per le prossime versioni:</p>
<ul>
<li><p>Importazione di dati binari da Faiss a Milvus.</p></li>
<li><p>Blocklist e allowlist per la migrazione dei dati tra Milvus di origine e Milvus di destinazione.</p></li>
<li><p>Unire e importare dati da più collezioni o partizioni in Milvus di origine in una nuova collezione in Milvus di destinazione.</p></li>
<li><p>Backup e ripristino dei dati Milvus.</p></li>
</ul>
<p>Il progetto MilvusDM è open source su <a href="https://github.com/milvus-io/milvus-tools">Github</a>. Tutti i contributi al progetto sono benvenuti. Dategli una stella 🌟 e sentitevi liberi di segnalare un <a href="https://github.com/milvus-io/milvus-tools/issues">problema</a> o di inviare il vostro codice!</p>
