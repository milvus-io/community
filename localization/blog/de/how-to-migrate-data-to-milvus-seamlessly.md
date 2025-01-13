---
id: how-to-migrate-data-to-milvus-seamlessly.md
title: 'Wie Sie Ihre Daten nahtlos zu Milvus migrieren: Ein umfassender Leitfaden'
author: Wenhui Zhang
date: 2023-12-01T00:00:00.000Z
desc: >-
  Ein umfassender Leitfaden für die Migration Ihrer Daten von Elasticsearch,
  FAISS und älteren Milvus 1.x-Versionen zu Milvus 2.x.
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
<p><a href="https://milvus.io/">Milvus</a> ist eine robuste Open-Source-Vektordatenbank für die <a href="https://zilliz.com/learn/vector-similarity-search">Ähnlichkeitssuche</a>, die Milliarden und sogar Billionen von Vektordaten mit minimaler Latenzzeit speichern, verarbeiten und abrufen kann. Außerdem ist sie hoch skalierbar, zuverlässig, Cloud-nativ und funktionsreich. <a href="https://milvus.io/blog/unveiling-milvus-2-3-milestone-release-offering-support-for-gpu-arm64-cdc-and-other-features.md">Die neueste Version von Milvus</a> bietet noch mehr aufregende Funktionen und Verbesserungen, darunter <a href="https://zilliz.com/blog/getting-started-with-gpu-powered-milvus-unlocking-10x-higher-performance">GPU-Unterstützung</a> für eine über 10-fach schnellere Leistung und MMap für eine größere Speicherkapazität auf einem einzigen Rechner.</p>
<p>Bis September 2023 hat Milvus fast 23.000 Sterne auf GitHub erhalten und hat Zehntausende von Nutzern aus verschiedenen Branchen mit unterschiedlichen Anforderungen. Mit der zunehmenden Verbreitung von generativer KI-Technologie wie <a href="https://zilliz.com/learn/ChatGPT-Vector-Database-Prompt-as-code">ChatGPT</a> wird Milvus immer beliebter. Es ist ein wesentlicher Bestandteil verschiedener KI-Stacks, insbesondere des <a href="https://zilliz.com/use-cases/llm-retrieval-augmented-generation">Retrieval Augmented Generation</a> Frameworks, das das Problem der Halluzinationen bei großen Sprachmodellen angeht.</p>
<p>Um die wachsende Nachfrage von neuen Nutzern zu befriedigen, die zu Milvus migrieren wollen, und von bestehenden Nutzern, die auf die neuesten Milvus-Versionen aktualisieren wollen, haben wir <a href="https://github.com/zilliztech/milvus-migration">Milvus Migration</a> entwickelt. In diesem Blog stellen wir Ihnen die Funktionen von Milvus Migration vor und zeigen Ihnen, wie Sie Ihre Daten von Milvus 1.x, <a href="https://zilliz.com/blog/set-up-with-facebook-ai-similarity-search-faiss">FAISS</a> und <a href="https://zilliz.com/comparison/elastic-vs-milvus">Elasticsearch 7.0</a> und darüber hinaus schnell zu Milvus migrieren können.</p>
<h2 id="Milvus-Migration-a-powerful-data-migration-tool" class="common-anchor-header">Milvus Migration, ein leistungsstarkes Werkzeug zur Datenmigration<button data-href="#Milvus-Migration-a-powerful-data-migration-tool" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://github.com/zilliztech/milvus-migration">Milvus Migration</a> ist ein in Go geschriebenes Datenmigrationstool. Es ermöglicht Nutzern, ihre Daten nahtlos von älteren Versionen von Milvus (1.x), FAISS und Elasticsearch 7.0 und darüber hinaus auf Milvus 2.x Versionen zu übertragen.</p>
<p>Das folgende Diagramm zeigt, wie wir Milvus Migration entwickelt haben und wie es funktioniert.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/milvus_migration_architecture_144e22f499.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="How-Milvus-Migration-migrates-data" class="common-anchor-header">Wie Milvus Migration Daten migriert</h3><h4 id="From-Milvus-1x-and-FAISS-to-Milvus-2x" class="common-anchor-header">Von Milvus 1.x und FAISS zu Milvus 2.x</h4><p>Die Datenmigration von Milvus 1.x und FAISS beinhaltet das Parsen des Inhalts der ursprünglichen Datendateien, die Umwandlung in das Datenspeicherformat von Milvus 2.x und das Schreiben der Daten unter Verwendung des Milvus SDK's <code translate="no">bulkInsert</code>. Dieser gesamte Prozess ist stream-basiert, theoretisch nur durch den Speicherplatz begrenzt und speichert Datendateien auf Ihrer lokalen Festplatte, S3, OSS, GCP oder Minio.</p>
<h4 id="From-Elasticsearch-to-Milvus-2x" class="common-anchor-header">Von Elasticsearch zu Milvus 2.x</h4><p>Bei der Datenmigration von Elasticsearch ist die Datenbeschaffung anders. Die Daten werden nicht aus Dateien abgerufen, sondern sequentiell über die Scroll-API von Elasticsearch abgerufen. Die Daten werden dann geparst und in das Milvus 2.x-Speicherformat umgewandelt und anschließend mit <code translate="no">bulkInsert</code> geschrieben. Neben der Migration von Vektoren des Typs <code translate="no">dense_vector</code>, die in Elasticsearch gespeichert sind, unterstützt Milvus Migration auch die Migration anderer Feldtypen, einschließlich long, integer, short, boolean, keyword, text und double.</p>
<h3 id="Milvus-Migration-feature-set" class="common-anchor-header">Funktionsumfang von Milvus Migration</h3><p>Milvus Migration vereinfacht den Migrationsprozess durch seinen robusten Funktionsumfang:</p>
<ul>
<li><p><strong>Unterstützte Datenquellen:</strong></p>
<ul>
<li><p>Milvus 1.x bis Milvus 2.x</p></li>
<li><p>Elasticsearch 7.0 und höher nach Milvus 2.x</p></li>
<li><p>FAISS zu Milvus 2.x</p></li>
</ul></li>
</ul>
<ul>
<li><p><strong>Mehrere Interaktionsmodi:</strong></p>
<ul>
<li><p>Befehlszeilenschnittstelle (CLI) unter Verwendung des Cobra-Frameworks</p></li>
<li><p>Restful API mit einer eingebauten Swagger UI</p></li>
<li><p>Integration als Go-Modul in andere Tools</p></li>
</ul></li>
</ul>
<ul>
<li><p><strong>Vielseitige Unterstützung von Dateiformaten:</strong></p>
<ul>
<li><p>Lokale Dateien</p></li>
<li><p>Amazon S3</p></li>
<li><p>Objektspeicherdienst (OSS)</p></li>
<li><p>Google Wolkenplattform (GCP)</p></li>
</ul></li>
</ul>
<ul>
<li><p><strong>Flexible Elasticsearch-Integration:</strong></p>
<ul>
<li><p>Migration von Vektoren des Typs <code translate="no">dense_vector</code> aus Elasticsearch</p></li>
<li><p>Unterstützung für die Migration anderer Feldtypen wie long, integer, short, boolean, keyword, text und double</p></li>
</ul></li>
</ul>
<h3 id="Interface-definitions" class="common-anchor-header">Schnittstellen-Definitionen</h3><p>Milvus Migration bietet die folgenden Schlüsselschnittstellen:</p>
<ul>
<li><p><code translate="no">/start</code>: Initiieren eines Migrationsauftrags (entspricht einer Kombination aus Dump und Load, unterstützt derzeit nur ES-Migration).</p></li>
<li><p><code translate="no">/dump</code>: Initiiert einen Dump-Auftrag (schreibt Quelldaten auf das Zielspeichermedium).</p></li>
<li><p><code translate="no">/load</code>: Initiiert einen Ladeauftrag (schreibt Daten vom Zielspeichermedium in Milvus 2.x).</p></li>
<li><p><code translate="no">/get_job</code>: Ermöglicht es den Benutzern, die Ergebnisse der Auftragsausführung anzuzeigen. (Weitere Details finden Sie in <a href="https://github.com/zilliztech/milvus-migration/blob/main/server/server.go">der server.go des Projekts</a>)</p></li>
</ul>
<p>Als Nächstes wollen wir anhand einiger Beispieldaten untersuchen, wie Milvus Migration in diesem Abschnitt verwendet wird. Sie können diese Beispiele <a href="https://github.com/zilliztech/milvus-migration#migration-examples-migrationyaml-details">hier</a> auf GitHub finden.</p>
<h2 id="Migration-from-Elasticsearch-to-Milvus-2x" class="common-anchor-header">Migration von Elasticsearch zu Milvus 2.x<button data-href="#Migration-from-Elasticsearch-to-Milvus-2x" class="anchor-icon" translate="no">
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
<li>Elasticsearch-Daten vorbereiten</li>
</ol>
<p>Um <a href="https://zilliz.com/blog/elasticsearch-cloud-vs-zilliz">Elasticsearch-Daten zu migrieren</a>, sollten Sie bereits Ihren eigenen Elasticsearch-Server eingerichtet haben. Sie sollten Vektordaten im Feld <code translate="no">dense_vector</code> speichern und sie mit anderen Feldern indizieren. Die Index-Zuordnungen sind wie unten gezeigt.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/migrate_elasticsearch_data_milvus_index_mappings_59370f9596.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<ol start="2">
<li>Kompilieren und Erstellen</li>
</ol>
<p>Laden Sie zunächst den <a href="https://github.com/zilliztech/milvus-migration">Quellcode</a> der Milvus-Migration <a href="https://github.com/zilliztech/milvus-migration">von GitHub</a> herunter. Führen Sie dann die folgenden Befehle aus, um sie zu kompilieren.</p>
<pre><code translate="no"><span class="hljs-keyword">go</span> get
<span class="hljs-keyword">go</span> build
<button class="copy-code-btn"></button></code></pre>
<p>Bei diesem Schritt wird eine ausführbare Datei mit dem Namen <code translate="no">milvus-migration</code> erzeugt.</p>
<ol start="3">
<li>Konfigurieren Sie <code translate="no">migration.yaml</code></li>
</ol>
<p>Bevor Sie die Migration starten, müssen Sie eine Konfigurationsdatei mit dem Namen <code translate="no">migration.yaml</code> vorbereiten, die Informationen über die Datenquelle, das Ziel und andere relevante Einstellungen enthält. Hier sehen Sie eine Beispielkonfiguration:</p>
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
<p>Eine ausführlichere Erläuterung der Konfigurationsdatei finden Sie auf <a href="https://github.com/zilliztech/milvus-migration/blob/main/README_ES.md#elasticsearch-to-milvus-2x-migrationyaml-example">dieser Seite</a> auf GitHub.</p>
<ol start="4">
<li>Ausführen des Migrationsauftrags</li>
</ol>
<p>Nachdem Sie Ihre <code translate="no">migration.yaml</code> Datei konfiguriert haben, können Sie den Migrationsauftrag starten, indem Sie den folgenden Befehl ausführen:</p>
<pre><code translate="no">./milvus-migration start --config=/{YourConfigFilePath}/migration.yaml
<button class="copy-code-btn"></button></code></pre>
<p>Beobachten Sie die Protokollausgabe. Wenn Sie ähnliche Protokolle wie die folgenden sehen, bedeutet dies, dass die Migration erfolgreich war.</p>
<pre><code translate="no">[task/load_base_task.go:94] [<span class="hljs-string">&quot;[LoadTasker] Dec Task Processing--------------&gt;&quot;</span>] [Count=0] [fileName=testfiles/output/zwh/migration/test_mul_field4/data_1_1.json] [taskId=442665677354739304][task/load_base_task.go:76] [<span class="hljs-string">&quot;[LoadTasker] Progress Task ---------------&gt;&quot;</span>] [fileName=testfiles/output/zwh/migration/test_mul_field4/data_1_1.json] [taskId=442665677354739304][dbclient/cus_field_milvus2x.go:86] [<span class="hljs-string">&quot;[Milvus2x] begin to ShowCollectionRows&quot;</span>][loader/cus_milvus2x_loader.go:66] [<span class="hljs-string">&quot;[Loader] Static: &quot;</span>] [collection=test_mul_field4_rename1] [beforeCount=50000] [afterCount=100000] [increase=50000][loader/cus_milvus2x_loader.go:66] [<span class="hljs-string">&quot;[Loader] Static Total&quot;</span>] [<span class="hljs-string">&quot;Total Collections&quot;</span>=1] [beforeTotalCount=50000] [afterTotalCount=100000] [totalIncrease=50000][migration/es_starter.go:25] [<span class="hljs-string">&quot;[Starter] migration ES to Milvus finish!!!&quot;</span>] [Cost=80.009174459][starter/starter.go:106] [<span class="hljs-string">&quot;[Starter] Migration Success!&quot;</span>] [Cost=80.00928425][cleaner/remote_cleaner.go:27] [<span class="hljs-string">&quot;[Remote Cleaner] Begin to clean files&quot;</span>] [bucket=a-bucket] [rootPath=testfiles/output/zwh/migration][cmd/start.go:32] [<span class="hljs-string">&quot;[Cleaner] clean file success!&quot;</span>]
<button class="copy-code-btn"></button></code></pre>
<p>Neben dem Befehlszeilenansatz unterstützt Milvus Migration auch die Migration über die Restful API.</p>
<p>Um die Restful-API zu verwenden, starten Sie den API-Server mit dem folgenden Befehl:</p>
<pre><code translate="no">./milvus-migration server run -p 8080
<button class="copy-code-btn"></button></code></pre>
<p>Sobald der Dienst läuft, können Sie die Migration durch den Aufruf der API einleiten.</p>
<pre><code translate="no">curl -XPOST http://localhost:8080/api/v1/start
<button class="copy-code-btn"></button></code></pre>
<p>Wenn die Migration abgeschlossen ist, können Sie <a href="https://zilliz.com/attu">Attu</a>, ein All-in-One-Tool zur Verwaltung von Vektordatenbanken, verwenden, um die Gesamtzahl der erfolgreich migrierten Zeilen anzuzeigen und andere sammlungsbezogene Vorgänge durchzuführen.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/attu_interface_vector_database_admin_4893a31f6d.png" alt="The Attu interface" class="doc-image" id="the-attu-interface" />
   </span> <span class="img-wrapper"> <span>Die Attu-Schnittstelle</span> </span></p>
<h2 id="Migration-from-Milvus-1x-to-Milvus-2x" class="common-anchor-header">Migration von Milvus 1.x nach Milvus 2.x<button data-href="#Migration-from-Milvus-1x-to-Milvus-2x" class="anchor-icon" translate="no">
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
<li>Vorbereiten von Milvus 1.x-Daten</li>
</ol>
<p>Damit Sie den Migrationsprozess schnell erleben können, haben wir 10.000 Milvus 1.x <a href="https://github.com/zilliztech/milvus-migration/blob/main/README_1X.md">Testdatensätze</a> in den Quellcode von Milvus Migration eingefügt. In echten Fällen müssen Sie jedoch Ihre eigene <code translate="no">meta.json</code> Datei aus Ihrer Milvus 1.x Instanz exportieren, bevor Sie den Migrationsprozess starten.</p>
<ul>
<li>Sie können die Daten mit dem folgenden Befehl exportieren.</li>
</ul>
<pre><code translate="no">./milvus-migration <span class="hljs-built_in">export</span> -m <span class="hljs-string">&quot;user:password@tcp(adderss)/milvus?charset=utf8mb4&amp;parseTime=True&amp;loc=Local&quot;</span> -o outputDir
<button class="copy-code-btn"></button></code></pre>
<p>Achten Sie darauf:</p>
<ul>
<li><p>Ersetzen Sie die Platzhalter durch Ihre tatsächlichen MySQL-Anmeldedaten.</p></li>
<li><p>Halten Sie den Milvus 1.x-Server an oder stoppen Sie die Datenübertragung, bevor Sie diesen Export durchführen.</p></li>
<li><p>Kopieren Sie den Ordner Milvus <code translate="no">tables</code> und die Datei <code translate="no">meta.json</code> in das gleiche Verzeichnis.</p></li>
</ul>
<p><strong>Hinweis:</strong> Wenn Sie Milvus 2.x auf der <a href="https://zilliz.com/cloud">Zilliz Cloud</a> (dem vollständig verwalteten Dienst von Milvus) verwenden, können Sie die Migration über die Cloud Console starten.</p>
<ol start="2">
<li>Kompilieren und Erstellen</li>
</ol>
<p>Laden Sie zunächst den <a href="https://github.com/zilliztech/milvus-migration">Quellcode</a> der Milvus-Migration <a href="https://github.com/zilliztech/milvus-migration">von GitHub</a> herunter. Führen Sie dann die folgenden Befehle aus, um ihn zu kompilieren.</p>
<pre><code translate="no"><span class="hljs-keyword">go</span> get
<span class="hljs-keyword">go</span> build
<button class="copy-code-btn"></button></code></pre>
<p>Bei diesem Schritt wird eine ausführbare Datei mit dem Namen <code translate="no">milvus-migration</code> erzeugt.</p>
<ol start="3">
<li>Konfigurieren Sie <code translate="no">migration.yaml</code></li>
</ol>
<p>Bereiten Sie eine <code translate="no">migration.yaml</code> Konfigurationsdatei vor, die Details über die Quelle, das Ziel und andere relevante Einstellungen angibt. Hier ist eine Beispielkonfiguration:</p>
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
<p>Eine ausführlichere Erläuterung der Konfigurationsdatei finden Sie auf <a href="https://github.com/zilliztech/milvus-migration/blob/main/README_1X.md">dieser Seite</a> auf GitHub.</p>
<ol start="4">
<li>Ausführen des Migrationsauftrags</li>
</ol>
<p>Sie müssen die Befehle <code translate="no">dump</code> und <code translate="no">load</code> separat ausführen, um die Migration abzuschließen. Diese Befehle konvertieren die Daten und importieren sie in Milvus 2.x.</p>
<p><strong>Hinweis:</strong> In Kürze werden wir diesen Schritt vereinfachen und es den Benutzern ermöglichen, die Migration mit nur einem Befehl abzuschließen. Bleiben Sie dran.</p>
<p><strong>Befehl Dump:</strong></p>
<pre><code translate="no">./milvus-migration dump --config=/{YourConfigFilePath}/migration.yaml
<button class="copy-code-btn"></button></code></pre>
<p><strong>Befehl Laden:</strong></p>
<pre><code translate="no">./milvus-migration load --config=/{YourConfigFilePath}/migration.yaml
<button class="copy-code-btn"></button></code></pre>
<p>Nach der Migration enthält die generierte Sammlung in Milvus 2.x zwei Felder: <code translate="no">id</code> und <code translate="no">data</code>. Weitere Details können Sie mit <a href="https://zilliz.com/attu">Attu</a>, einem All-in-One-Tool zur Verwaltung von Vektordatenbanken, anzeigen.</p>
<h2 id="Migration-from-FAISS-to-Milvus-2x" class="common-anchor-header">Migration von FAISS zu Milvus 2.x<button data-href="#Migration-from-FAISS-to-Milvus-2x" class="anchor-icon" translate="no">
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
<li>FAISS-Daten vorbereiten</li>
</ol>
<p>Um Elasticsearch-Daten zu migrieren, sollten Sie Ihre eigenen FAISS-Daten bereithalten. Um Ihnen zu helfen, den Migrationsprozess schnell zu erleben, haben wir einige <a href="https://github.com/zilliztech/milvus-migration/blob/main/README_FAISS.md">FAISS-Testdaten</a> in den Quellcode von Milvus Migration eingefügt.</p>
<ol start="2">
<li>Kompilieren und Erstellen</li>
</ol>
<p>Laden Sie zunächst den <a href="https://github.com/zilliztech/milvus-migration">Quellcode</a> von Milvus Migration <a href="https://github.com/zilliztech/milvus-migration">von GitHub</a> herunter. Führen Sie dann die folgenden Befehle aus, um ihn zu kompilieren.</p>
<pre><code translate="no"><span class="hljs-keyword">go</span> get
<span class="hljs-keyword">go</span> build
<button class="copy-code-btn"></button></code></pre>
<p>In diesem Schritt wird eine ausführbare Datei mit dem Namen <code translate="no">milvus-migration</code> erzeugt.</p>
<ol start="3">
<li>Konfigurieren Sie <code translate="no">migration.yaml</code></li>
</ol>
<p>Bereiten Sie eine <code translate="no">migration.yaml</code> Konfigurationsdatei für die FAISS-Migration vor, in der Sie Details über die Quelle, das Ziel und andere relevante Einstellungen angeben. Hier ist eine Beispielkonfiguration:</p>
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
<p>Eine ausführlichere Erläuterung der Konfigurationsdatei finden Sie auf <a href="https://github.com/zilliztech/milvus-migration/blob/main/README_FAISS.md">dieser Seite</a> auf GitHub.</p>
<ol start="4">
<li>Ausführen des Migrationsauftrags</li>
</ol>
<p>Wie die Migration von Milvus 1.x nach Milvus 2.x erfordert auch die FAISS-Migration die Ausführung der Befehle <code translate="no">dump</code> und <code translate="no">load</code>. Diese Befehle konvertieren die Daten und importieren sie in Milvus 2.x.</p>
<p><strong>Hinweis:</strong> Wir werden diesen Schritt vereinfachen und den Benutzern ermöglichen, die Migration in Kürze mit nur einem Befehl abzuschließen. Bleiben Sie dran.</p>
<p><strong>Befehl Dump:</strong></p>
<pre><code translate="no">./milvus-migration dump --config=/{YourConfigFilePath}/migration.yaml
<button class="copy-code-btn"></button></code></pre>
<p><strong>Load-Befehl:</strong></p>
<pre><code translate="no">./milvus-migration load --config=/{YourConfigFilePath}/migration.yaml
<button class="copy-code-btn"></button></code></pre>
<p>Weitere Details können Sie mit <a href="https://zilliz.com/attu">Attu</a>, einem All-in-One-Tool zur Verwaltung von Vektordatenbanken, anzeigen.</p>
<h2 id="Stay-tuned-for-future-migration-plans" class="common-anchor-header">Bleiben Sie dran für zukünftige Migrationspläne<button data-href="#Stay-tuned-for-future-migration-plans" class="anchor-icon" translate="no">
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
    </button></h2><p>In Zukunft werden wir die Migration von mehr Datenquellen unterstützen und weitere Migrationsfunktionen hinzufügen, einschließlich:</p>
<ul>
<li><p>Unterstützung der Migration von Redis zu Milvus.</p></li>
<li><p>Unterstützung der Migration von MongoDB zu Milvus.</p></li>
<li><p>Unterstützung der wiederaufnehmbaren Migration.</p></li>
<li><p>Vereinfachung der Migrationsbefehle durch Zusammenlegung der Dump- und Ladeprozesse in einen einzigen.</p></li>
<li><p>Unterstützung der Migration von anderen Mainstream-Datenquellen zu Milvus.</p></li>
</ul>
<h2 id="Conclusion" class="common-anchor-header">Fazit<button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.3, die neueste Version von Milvus, bringt aufregende neue Funktionen und Leistungsverbesserungen, die den wachsenden Anforderungen des Datenmanagements gerecht werden. Die Migration Ihrer Daten zu Milvus 2.x kann diese Vorteile freisetzen, und das Milvus-Migrationsprojekt macht den Migrationsprozess rationell und einfach. Probieren Sie es aus, und Sie werden nicht enttäuscht sein.</p>
<p><em><strong>Hinweis:</strong> Die Informationen in diesem Blog basieren auf dem Stand des Milvus- und <a href="https://github.com/zilliztech/milvus-migration">Milvus Migration-Projekts</a> im September 2023. In der offiziellen <a href="https://milvus.io/docs">Milvus-Dokumentation</a> finden Sie die aktuellsten Informationen und Anleitungen.</em></p>
