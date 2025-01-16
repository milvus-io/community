---
id: Milvus-Data-Migration-Tool.md
title: Einführung des Milvus-Datenmigrations-Tools
author: Zilliz
date: 2021-03-15T10:19:51.125Z
desc: >-
  Erfahren Sie, wie Sie mit dem Datenmigrationstool von Milvus die Effizienz der
  Datenverwaltung erheblich verbessern und die DevOps-Kosten senken können.
cover: assets.zilliz.com/Generic_Tool_Announcement_97eb04a898.jpg
tag: Engineering
canonicalUrl: 'https://zilliz.com/blog/Milvus-Data-Migration-Tool'
---
<custom-h1>Einführung in das Milvus Datenmigrations-Tool</custom-h1><p><em><strong>Wichtiger Hinweis</strong>: Das Mivus Data Migration Tool ist veraltet. Für die Datenmigration von anderen Datenbanken zu Milvus empfehlen wir Ihnen, das fortschrittlichere Milvus-Migrations-Tool zu verwenden.</em></p>
<p>Das Milvus-Migrations-Tool unterstützt derzeit:</p>
<ul>
<li>Elasticsearch zu Milvus 2.x</li>
<li>Faiss nach Milvus 2.x</li>
<li>Milvus 1.x nach Milvus 2.x</li>
<li>Milvus 2.3.x nach Milvus 2.3.x oder höher</li>
</ul>
<p>Wir werden die Migration von weiteren Vektordatenquellen wie Pinecone, Chroma und Qdrant unterstützen. Bleiben Sie dran.</p>
<p><strong>Weitere Informationen finden Sie in der <a href="https://milvus.io/docs/migrate_overview.md">Milvus-Migrationsdokumentation</a> oder im <a href="https://github.com/zilliztech/milvus-migration">GitHub-Repository</a>.</strong></p>
<p>--------------------------------- <strong>Mivus Data Migration Tool ist veraltet</strong> ----------------------</p>
<h3 id="Overview" class="common-anchor-header">Überblick</h3><p><a href="https://github.com/milvus-io/milvus-tools">MilvusDM</a> (Milvus Data Migration) ist ein Open-Source-Tool, das speziell für das Importieren und Exportieren von Datendateien mit Milvus entwickelt wurde. MilvusDM kann die Effizienz der Datenverwaltung erheblich verbessern und die DevOps-Kosten auf folgende Weise reduzieren:</p>
<ul>
<li><p><a href="#faiss-to-milvus">Faiss zu Milvus</a>: Importieren Sie ungezippte Daten von Faiss zu Milvus.</p></li>
<li><p><a href="#hdf5-to-milvus">HDF5 nach Milvus</a>: Importieren Sie HDF5-Dateien in Milvus.</p></li>
<li><p><a href="#milvus-to-milvus">Milvus zu Milvus</a>: Migrieren Sie Daten von einem Quell-Milvus zu einem anderen Ziel-Milvus.</p></li>
<li><p><a href="#milvus-to-hdf5">Milvus zu HDF5</a>: Speichern von Daten in Milvus als HDF5-Dateien.</p></li>
</ul>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/milvusdm_blog_1_199cbdebe7.png" alt="milvusdm blog 1.png" class="doc-image" id="milvusdm-blog-1.png" />
   </span> <span class="img-wrapper"> <span>milvusdm blog 1.png</span> </span></p>
<p>MilvusDM wird auf <a href="https://github.com/milvus-io/milvus-tools">Github</a> gehostet und kann einfach durch Ausführen der Befehlszeile <code translate="no">pip3 install pymilvusdm</code> installiert werden. MilvusDM ermöglicht es Ihnen, Daten in einer bestimmten Sammlung oder Partition zu migrieren. In den folgenden Abschnitten wird erklärt, wie man die einzelnen Datenmigrationsarten verwendet.</p>
<p><br/></p>
<h3 id="Faiss-to-Milvus" class="common-anchor-header">Faiss nach Milvus</h3><h4 id="Steps" class="common-anchor-header">Schritte</h4><p>1.laden Sie <strong>F2M.yaml</strong> herunter:</p>
<pre><code translate="no">$ wget <span class="hljs-attr">https</span>:<span class="hljs-comment">//raw.githubusercontent.com/milvus-io/milvus-tools/main/yamls/F2</span>
<button class="copy-code-btn"></button></code></pre>
<p>2. Setzen Sie die folgenden Parameter:</p>
<ul>
<li><p><code translate="no">data_path</code>: Datenpfad (Vektoren und ihre entsprechenden IDs) in Faiss.</p></li>
<li><p><code translate="no">dest_host</code>: Adresse des Milvus-Servers.</p></li>
<li><p><code translate="no">dest_port</code>: Port des Milvus-Servers.</p></li>
<li><p><code translate="no">mode</code>: Daten können mit den folgenden Modi in Milvus importiert werden:</p>
<ul>
<li><p>Überspringen: Daten ignorieren, wenn die Sammlung oder Partition bereits existiert.</p></li>
<li><p>Anhängen: Daten anhängen, wenn die Sammlung oder Partition bereits vorhanden ist.</p></li>
<li><p>Überschreiben: Daten vor dem Einfügen löschen, wenn die Sammlung oder Partition bereits vorhanden ist.</p></li>
</ul></li>
<li><p><code translate="no">dest_collection_name</code>: Name der empfangenden Sammlung für den Datenimport.</p></li>
<li><p><code translate="no">dest_partition_name</code>: Name der empfangenden Partition für den Datenimport.</p></li>
<li><p><code translate="no">collection_parameter</code>: Sammlungsspezifische Informationen wie Vektordimension, Größe der Indexdatei und Abstandsmetrik.</p></li>
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
<p>3. führen Sie <strong>F2M.yaml</strong> aus:</p>
<pre><code translate="no">$ milvusdm --yaml F2M.yaml
<button class="copy-code-btn"></button></code></pre>
<h4 id="Sample-Code" class="common-anchor-header">Beispielcode</h4><p>1.liest Faiss-Dateien, um Vektoren und ihre entsprechenden IDs abzurufen.</p>
<pre><code translate="no">ids, vectors = faiss_data.read_faiss_data()
<button class="copy-code-btn"></button></code></pre>
<p>2. die abgerufenen Daten in Milvus einfügen:</p>
<pre><code translate="no">insert_milvus.insert_data(vectors, <span class="hljs-variable language_">self</span>.dest_collection_name, <span class="hljs-variable language_">self</span>.collection_parameter, <span class="hljs-variable language_">self</span>.mode, ids, <span class="hljs-variable language_">self</span>.dest_partition_name)
<button class="copy-code-btn"></button></code></pre>
<p><br/></p>
<h3 id="HDF5-to-Milvus" class="common-anchor-header">HDF5 nach Milvus</h3><h4 id="Steps" class="common-anchor-header">Schritte</h4><p>1.laden Sie <strong>H2M.yaml</strong> herunter.</p>
<pre><code translate="no">$ wget <span class="hljs-attr">https</span>:<span class="hljs-comment">//raw.githubusercontent.com/milvus-io/milvus-tools/main/yamls/H2M.yaml</span>
<button class="copy-code-btn"></button></code></pre>
<p>2.setzen Sie die folgenden Parameter:</p>
<ul>
<li><p><code translate="no">data_path</code>: Pfad zu den HDF5-Dateien.</p></li>
<li><p><code translate="no">data_dir</code>: Verzeichnis mit den HDF5-Dateien.</p></li>
<li><p><code translate="no">dest_host</code>: Adresse des Milvus-Servers.</p></li>
<li><p><code translate="no">dest_port</code>: Anschluss des Milvus-Servers.</p></li>
<li><p><code translate="no">mode</code>: Daten können mit den folgenden Modi in Milvus importiert werden:</p>
<ul>
<li><p>Überspringen: Daten ignorieren, wenn die Sammlung oder Partition bereits existiert.</p></li>
<li><p>Anhängen: Daten anhängen, wenn die Sammlung oder Partition bereits vorhanden ist.</p></li>
<li><p>Überschreiben: Daten vor dem Einfügen löschen, wenn die Sammlung oder Partition bereits vorhanden ist.</p></li>
</ul></li>
<li><p><code translate="no">dest_collection_name</code>: Name der empfangenden Sammlung für den Datenimport.</p></li>
<li><p><code translate="no">dest_partition_name</code>: Name der empfangenden Partition für den Datenimport.</p></li>
<li><p><code translate="no">collection_parameter</code>: Sammlungsspezifische Informationen wie Vektordimension, Indexdateigröße und Abstandsmetrik.</p></li>
</ul>
<blockquote>
<p>Geben Sie entweder <code translate="no">data_path</code> oder <code translate="no">data_dir</code> an. Setzen Sie <strong>nicht</strong> beides. Verwenden Sie <code translate="no">data_path</code>, um mehrere Dateipfade anzugeben, oder <code translate="no">data_dir</code>, um das Verzeichnis mit Ihrer Datendatei anzugeben.</p>
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
<p>3. führen Sie <strong>H2M.yaml aus:</strong></p>
<pre><code translate="no">$ milvusdm --yaml H2M.yaml
<button class="copy-code-btn"></button></code></pre>
<h4 id="Sample-Code" class="common-anchor-header">Beispielcode</h4><p>1) Lesen Sie die HDF5-Dateien, um die Vektoren und ihre entsprechenden IDs abzurufen:</p>
<pre><code translate="no">vectors, ids = <span class="hljs-variable language_">self</span>.file.read_hdf5_data()
<button class="copy-code-btn"></button></code></pre>
<p>2. fügen Sie die abgerufenen Daten in Milvus ein:</p>
<pre><code translate="no">ids = insert_milvus.insert_data(vectors, <span class="hljs-variable language_">self</span>.c_name, <span class="hljs-variable language_">self</span>.c_param, <span class="hljs-variable language_">self</span>.mode, ids,<span class="hljs-variable language_">self</span>.p_name)
<button class="copy-code-btn"></button></code></pre>
<p><br/></p>
<h3 id="Milvus-to-Milvus" class="common-anchor-header">Milvus zu Milvus</h3><h4 id="Steps" class="common-anchor-header">Schritte</h4><p>1.laden Sie <strong>M2M.yaml</strong> herunter.</p>
<pre><code translate="no">$ wget <span class="hljs-attr">https</span>:<span class="hljs-comment">//raw.githubusercontent.com/milvus-io/milvus-tools/main/yamls/M2M.yaml</span>
<button class="copy-code-btn"></button></code></pre>
<p>2.setzen Sie die folgenden Parameter:</p>
<ul>
<li><p><code translate="no">source_milvus_path</code>: Quell-Milvus-Arbeitspfad.</p></li>
<li><p><code translate="no">mysql_parameter</code>: Quell-Milvus-MySQL-Einstellungen. Wenn MySQL nicht verwendet wird, setzen Sie mysql_parameter auf ''.</p></li>
<li><p><code translate="no">source_collection</code>: Namen der Sammlung und ihrer Partitionen in der Milvus-Quelle.</p></li>
<li><p><code translate="no">dest_host</code>: Milvus-Server-Adresse.</p></li>
<li><p><code translate="no">dest_port</code>: Port des Milvus-Servers.</p></li>
<li><p><code translate="no">mode</code>: Daten können mit den folgenden Modi in Milvus importiert werden:</p>
<ul>
<li><p>Überspringen: Daten ignorieren, wenn die Sammlung oder Partition bereits existiert.</p></li>
<li><p>Anhängen: Daten anhängen, wenn die Sammlung oder Partition bereits vorhanden ist.</p></li>
<li><p>Überschreiben: Löschen Sie die Daten vor dem Einfügen, wenn die Sammlung oder Partition bereits existiert.</p></li>
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
<p>3. führen Sie <strong>M2M.yaml aus.</strong></p>
<pre><code translate="no">$ milvusdm --yaml M2M.yaml
<button class="copy-code-btn"></button></code></pre>
<h4 id="Sample-Code" class="common-anchor-header">Beispielcode</h4><p>1. entsprechend den Metadaten einer bestimmten Sammlung oder Partition die Dateien unter <strong>milvus/db</strong> auf Ihrem lokalen Laufwerk lesen, um Vektoren und ihre entsprechenden IDs aus der Milvus-Quelle abzurufen.</p>
<pre><code translate="no">collection_parameter, _ = milvus_meta.get_collection_info(collection_name)
r_vectors, r_ids, r_rows = milvusdb.read_milvus_file(<span class="hljs-variable language_">self</span>.milvus_meta, collection_name, partition_tag)
<button class="copy-code-btn"></button></code></pre>
<p>2. fügen Sie die abgerufenen Daten in das Ziel-Milvus ein.</p>
<pre><code translate="no">milvus_insert.insert_data(r_vectors, collection_name, collection_parameter, <span class="hljs-variable language_">self</span>.mode, r_ids, partition_tag)
<button class="copy-code-btn"></button></code></pre>
<p><br/></p>
<h3 id="Milvus-to-HDF5" class="common-anchor-header">Milvus zu HDF5</h3><h4 id="Steps" class="common-anchor-header">Schritte</h4><p>1.laden Sie <strong>M2H.yaml</strong> herunter:</p>
<pre><code translate="no">$ wget <span class="hljs-attr">https</span>:<span class="hljs-comment">//raw.githubusercontent.com/milvus-io/milvus-tools/main/yamls/M2H.yaml</span>
<button class="copy-code-btn"></button></code></pre>
<p>2. Setzen Sie die folgenden Parameter:</p>
<ul>
<li><p><code translate="no">source_milvus_path</code>: Quell-Milvus-Arbeitspfad.</p></li>
<li><p><code translate="no">mysql_parameter</code>: Quell-Milvus-MySQL-Einstellungen. Wenn MySQL nicht verwendet wird, setzen Sie mysql_parameter auf ''.</p></li>
<li><p><code translate="no">source_collection</code>: Namen der Sammlung und ihrer Partitionen in der Milvus-Quelle.</p></li>
<li><p><code translate="no">data_dir</code>: Verzeichnis, in dem die HDF5-Dateien gespeichert werden.</p></li>
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
<p>3. <strong>M2H.yaml</strong> ausführen:</p>
<pre><code translate="no">$ milvusdm --yaml M2H.yaml
<button class="copy-code-btn"></button></code></pre>
<h4 id="Sample-Code" class="common-anchor-header">Beispielcode</h4><p>1. entsprechend den Metadaten einer bestimmten Sammlung oder Partition die Dateien unter <strong>milvus/db</strong> auf Ihrem lokalen Laufwerk lesen, um die Vektoren und ihre entsprechenden IDs abzurufen.</p>
<pre><code translate="no">collection_parameter, version = milvus_meta.get_collection_info(collection_name)
r_vectors, r_ids, r_rows = milvusdb.read_milvus_file(<span class="hljs-variable language_">self</span>.milvus_meta, collection_name, partition_tag)
<button class="copy-code-btn"></button></code></pre>
<p>2. speichern Sie die abgerufenen Daten als HDF5-Dateien.</p>
<pre><code translate="no">data_save.save_yaml(collection_name, partition_tag, collection_parameter, version, save_hdf5_name)
<button class="copy-code-btn"></button></code></pre>
<h3 id="MilvusDM-File-Structure" class="common-anchor-header">MilvusDM Dateistruktur</h3><p>Das folgende Flussdiagramm zeigt, wie MilvusDM verschiedene Aufgaben entsprechend der empfangenen YAML-Datei durchführt:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/milvusdm_blog_2_7824b16e5e.png" alt="milvusdm blog 2.png" class="doc-image" id="milvusdm-blog-2.png" />
   </span> <span class="img-wrapper"> <span>milvusdm blog 2.png</span> </span></p>
<p>MilvusDM Dateistruktur:</p>
<ul>
<li><p>pymilvusdm</p>
<ul>
<li><p>Kern</p>
<ul>
<li><p><strong>milvus_client.py</strong>: Führt Client-Operationen in Milvus durch.</p></li>
<li><p><strong>read_data.py</strong>: Liest die HDF5-Datendateien auf Ihrem lokalen Laufwerk. (Fügen Sie hier Ihren Code hinzu, um das Lesen von Datendateien in anderen Formaten zu unterstützen).</p></li>
<li><p><strong>read_faiss_data.py</strong>: Liest die Datendateien in Faiss.</p></li>
<li><p><strong>read_milvus_data.py</strong>: Liest die Datendateien in Milvus.</p></li>
<li><p><strong>read_milvus_meta.py</strong>: Liest die Metadaten in Milvus.</p></li>
<li><p><strong>data_to_milvus.py</strong>: Erzeugt Kollektionen oder Partitionen auf Basis von Parametern in YAML-Dateien und importiert die Vektoren und die entsprechenden Vektor-IDs in Milvus.</p></li>
<li><p><strong>save_data.py</strong>: Speichert die Daten als HDF5-Dateien.</p></li>
<li><p><strong>write_logs.py</strong>: Schreibt Protokolle während der Laufzeit.</p></li>
</ul></li>
<li><p><strong>faiss_to_milvus.py</strong>: Importiert Daten aus Faiss in Milvus.</p></li>
<li><p><strong>hdf5_to_milvus.py</strong>: Importiert Daten in HDF5-Dateien in Milvus.</p></li>
<li><p><strong>milvus_to_milvus.py</strong>: Migriert Daten von einem Quell-Milvus zum Ziel-Milvus.</p></li>
<li><p><strong>milvus_to_hdf5.py</strong>: Exportiert Daten in Milvus und speichert sie als HDF5-Dateien.</p></li>
<li><p><strong>main.py</strong>: Führt entsprechende Aufgaben gemäß der empfangenen YAML-Datei aus.</p></li>
<li><p><strong>setting.py</strong>: Konfigurationen, die sich auf die Ausführung des MilvusDM-Codes beziehen.</p></li>
</ul></li>
<li><p><strong>setup.py</strong>: Erzeugt <strong>pymilvusdm-Dateipakete</strong> und lädt sie in PyPI (Python Package Index) hoch.</p></li>
</ul>
<p><br/></p>
<h3 id="Recap" class="common-anchor-header">Rekapitulation</h3><p>MilvusDM kümmert sich hauptsächlich um die Migration von Daten in und aus Milvus, einschließlich Faiss nach Milvus, HDF5 nach Milvus, Milvus nach Milvus und Milvus nach HDF5.</p>
<p>Die folgenden Funktionen sind für kommende Versionen geplant:</p>
<ul>
<li><p>Importieren von Binärdaten von Faiss nach Milvus.</p></li>
<li><p>Blockliste und Erlaubnisliste für die Datenmigration zwischen Milvus-Quelle und Milvus-Ziel.</p></li>
<li><p>Zusammenführen und Importieren von Daten aus mehreren Sammlungen oder Partitionen im Quell-Milvus in eine neue Sammlung im Ziel-Milvus.</p></li>
<li><p>Sicherung und Wiederherstellung der Milvus-Daten.</p></li>
</ul>
<p>Das MilvusDM-Projekt ist ein Open-Source-Projekt auf <a href="https://github.com/milvus-io/milvus-tools">Github</a>. Alle Beiträge zum Projekt sind willkommen. Geben Sie ihm einen Stern 🌟, und fühlen Sie sich frei, einen <a href="https://github.com/milvus-io/milvus-tools/issues">Fehler</a> zu melden oder Ihren eigenen Code einzureichen!</p>
