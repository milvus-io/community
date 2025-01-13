---
id: deep-dive-1-milvus-architecture-overview.md
title: Aufbau einer Vektordatenbank für skalierbare Ähnlichkeitssuche
author: Xiaofan Luan
date: 2022-03-14T00:00:00.000Z
desc: >-
  Dies ist der erste Teil einer Blogserie, in der wir einen genaueren Blick auf
  den Denkprozess und die Designprinzipien werfen, die hinter dem Aufbau der
  beliebtesten Open-Source-Vektordatenbank stehen.
cover: assets.zilliz.com/20220705_102717_dd4124dee3.png
tag: Engineering
tags: 'Data science, Database, Technology, Artificial Intelligence, Vector Management'
canonicalUrl: 'https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md'
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/20220705_102717_dd4124dee3.png" alt="Cover image" class="doc-image" id="cover-image" />
   </span> <span class="img-wrapper"> <span>Titelbild</span> </span></p>
<blockquote>
<p>Dieser Artikel wurde von Xiaofan Luan geschrieben und von Angela Ni und Claire Yu umgesetzt.</p>
</blockquote>
<p><a href="https://mitsloan.mit.edu/ideas-made-to-matter/tapping-power-unstructured-data">Statistiken</a> zufolge sind etwa 80 bis 90 % der weltweit anfallenden Daten unstrukturiert. Aufgrund des rasanten Wachstums des Internets ist in den kommenden Jahren mit einer explosionsartigen Zunahme unstrukturierter Daten zu rechnen. Folglich benötigen Unternehmen dringend eine leistungsfähige Datenbank, die ihnen hilft, diese Art von Daten besser zu handhaben und zu verstehen. Die Entwicklung einer Datenbank ist jedoch immer leichter gesagt als getan. In diesem Artikel werden der Denkprozess und die Entwurfsprinzipien bei der Entwicklung von Milvus, einer quelloffenen, cloud-nativen Vektordatenbank für die skalierbare Ähnlichkeitssuche, vorgestellt. In diesem Artikel wird auch die Architektur von Milvus im Detail erläutert.</p>
<p>Springen Sie zu:</p>
<ul>
<li><a href="#Unstructured-data-requires-a-complete-basic-software-stack">Unstrukturierte Daten erfordern einen kompletten Basis-Software-Stack</a><ul>
<li><a href="#Vectors-and-scalars">Vektoren und Skalare</a></li>
<li><a href="#From-vector-search-engine-to-vector-database">Von der Vektorsuchmaschine zur Vektordatenbank</a></li>
<li><a href="#A-cloud-native-first-approach">Ein erster Cloud-nativer Ansatz</a></li>
</ul></li>
<li><a href="#The-design-principles-of-Milvus-20">Die Gestaltungsprinzipien von Milvus 2.0</a><ul>
<li><a href="#Log-as-data">Log als Daten</a></li>
<li><a href="#Duality-of-table-and-log">Dualität von Tabelle und Protokoll</a></li>
<li><a href="#Log-persistency">Log-Persistenz</a></li>
</ul></li>
<li><a href="#Building-a-vector-database-for-scalable-similarity-search">Aufbau einer Vektordatenbank für skalierbare Ähnlichkeitssuche</a><ul>
<li><a href="#Standalone-and-cluster">Eigenständig und im Cluster</a></li>
<li><a href="#A-bare-bones-skeleton-of-the-Milvus-architecture">Ein Grundgerüst der Milvus-Architektur</a></li>
<li><a href="#Data-Model">Datenmodell</a></li>
</ul></li>
</ul>
<h2 id="Unstructured-data-requires-a-complete-basic-software-stack" class="common-anchor-header">Unstrukturierte Daten erfordern ein komplettes Basis-Softwarepaket<button data-href="#Unstructured-data-requires-a-complete-basic-software-stack" class="anchor-icon" translate="no">
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
    </button></h2><p>Mit dem Wachstum und der Entwicklung des Internets wurden unstrukturierte Daten immer häufiger, darunter E-Mails, Dokumente, IoT-Sensordaten, Facebook-Fotos, Proteinstrukturen und vieles mehr. Damit Computer unstrukturierte Daten verstehen und verarbeiten können, werden diese mithilfe von <a href="https://zilliz.com/learn/embedding-generation">Einbettungstechniken</a> in Vektoren umgewandelt.</p>
<p>Milvus speichert und indiziert diese Vektoren und analysiert die Korrelation zwischen zwei Vektoren, indem es ihren Ähnlichkeitsabstand berechnet. Wenn die beiden Einbettungsvektoren sehr ähnlich sind, bedeutet dies, dass auch die ursprünglichen Datenquellen ähnlich sind.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Frame_1_6_5e0ab80f2c.png" alt="The workflow of processing unstructured data." class="doc-image" id="the-workflow-of-processing-unstructured-data." />
   </span> <span class="img-wrapper"> <span>Der Arbeitsablauf bei der Verarbeitung unstrukturierter Daten</span>. </span></p>
<h3 id="Vectors-and-scalars" class="common-anchor-header">Vektoren und Skalare</h3><p>Ein Skalar ist eine Größe, die nur durch ein Maß - den Betrag - beschrieben wird. Ein Skalar kann als Zahl dargestellt werden. Zum Beispiel fährt ein Auto mit einer Geschwindigkeit von 80 km/h. In diesem Fall ist die Geschwindigkeit (80km/h) ein Skalar. Ein Vektor hingegen ist eine Größe, die durch mindestens zwei Größen - Betrag und Richtung - beschrieben wird. Wenn ein Auto mit einer Geschwindigkeit von 80 km/h in Richtung Westen fährt, ist die Geschwindigkeit (80 km/h West) ein Vektor. Das folgende Bild ist ein Beispiel für Skalare und Vektoren.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Frame_1_7_90a142ab5b.png" alt="Scalars vs. Vectors" class="doc-image" id="scalars-vs.-vectors" />
   </span> <span class="img-wrapper"> <span>Skalare vs. Vektoren</span> </span></p>
<p>Da die meisten wichtigen Daten mehr als ein Attribut haben, können wir diese Daten besser verstehen, wenn wir sie in Vektoren umwandeln. Eine gängige Methode zur Bearbeitung von Vektordaten ist die Berechnung des Abstands zwischen Vektoren mithilfe von <a href="https://milvus.io/docs/v2.0.x/metric.md">Metriken</a> wie Euklidischer Abstand, Inneres Produkt, Tanimoto-Abstand, Hamming-Abstand usw. Je geringer der Abstand ist, desto ähnlicher sind die Vektoren. Um einen umfangreichen Vektordatensatz effizient abzufragen, können wir Vektordaten organisieren, indem wir Indizes für sie erstellen. Nachdem der Datensatz indiziert ist, können Abfragen zu Clustern oder Teilmengen von Daten geleitet werden, die mit hoher Wahrscheinlichkeit Vektoren enthalten, die einer Eingabeabfrage ähnlich sind.</p>
<p>Weitere Informationen zu den Indizes finden Sie unter <a href="https://milvus.io/docs/v2.0.x/index.md">Vektorindex</a>.</p>
<h3 id="From-vector-search-engine-to-vector-database" class="common-anchor-header">Von der Vektorsuchmaschine zur Vektordatenbank</h3><p>Milvus 2.0 wurde von Anfang an so konzipiert, dass es nicht nur als Suchmaschine, sondern vor allem als leistungsstarke Vektordatenbank dient.</p>
<p>Eine Möglichkeit, den Unterschied zu verstehen, besteht darin, eine Analogie zwischen <a href="https://dev.mysql.com/doc/refman/5.7/en/innodb-introduction.html">InnoDB</a> und <a href="https://www.mysql.com/">MySQL</a> oder <a href="https://lucene.apache.org/">Lucene</a> und <a href="https://www.elastic.co/">Elasticsearch</a> zu ziehen.</p>
<p>Genau wie MySQL und Elasticsearch baut auch Milvus auf Open-Source-Bibliotheken wie <a href="https://github.com/facebookresearch/faiss">Faiss</a>, <a href="https://github.com/nmslib/hnswlib">HNSW</a> und <a href="https://github.com/spotify/annoy">Annoy</a> auf, die sich auf die Bereitstellung von Suchfunktionen und die Gewährleistung der Suchleistung konzentrieren. Es wäre jedoch unfair, Milvus lediglich zu einer Schicht über Faiss zu degradieren, da es Vektoren speichert, abruft, analysiert und wie jede andere Datenbank auch eine Standardschnittstelle für CRUD-Operationen bietet. Darüber hinaus verfügt Milvus über folgende Funktionen:</p>
<ul>
<li>Sharding und Partitionierung</li>
<li>Replikation</li>
<li>Wiederherstellung im Katastrophenfall</li>
<li>Lastausgleich</li>
<li>Abfrageparser oder -optimierer</li>
</ul>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/database_d912320ea7.png" alt="Vector database" class="doc-image" id="vector-database" />
   </span> <span class="img-wrapper"> <span>Vektordatenbank</span> </span></p>
<p>Für ein umfassenderes Verständnis dessen, was eine Vektordatenbank ist, lesen Sie den Blog <a href="https://zilliz.com/learn/what-is-vector-database">hier</a>.</p>
<h3 id="A-cloud-native-first-approach" class="common-anchor-header">Ein erster Cloud-nativer Ansatz</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/image_2_be82d762db.png" alt="Could-native approach" class="doc-image" id="could-native-approach" />
   </span> <span class="img-wrapper"> <span>Könnte-nativer Ansatz</span> </span></p>
<h4 id="From-shared-nothing-to-shared-storage-then-to-shared-something" class="common-anchor-header">Von gemeinsamem Nichts zu gemeinsamem Speicher und dann zu gemeinsamem Etwas</h4><p>Herkömmliche Datenbanken verwendeten eine "Shared Nothing"-Architektur, bei der die Knoten in den verteilten Systemen unabhängig, aber über ein Netzwerk verbunden sind. Die Knoten teilen sich weder Arbeitsspeicher noch Speicherplatz. <a href="https://docs.snowflake.com/en/user-guide/intro-key-concepts.html">Snowflake</a> jedoch revolutionierte die Branche durch die Einführung einer "Shared-Storage"-Architektur, bei der die Rechenleistung (Abfrageverarbeitung) vom Speicher (Datenbankspeicher) getrennt ist. Mit einer Shared-Storage-Architektur können Datenbanken eine höhere Verfügbarkeit, Skalierbarkeit und eine Reduzierung der Datenduplikation erreichen. Inspiriert von Snowflake haben viele Unternehmen damit begonnen, eine Cloud-basierte Infrastruktur für die Datenpersistenz zu nutzen, während lokaler Speicher für das Caching verwendet wird. Diese Art von Datenbankarchitektur wird als "Shared Something" bezeichnet und ist heute in den meisten Anwendungen zur Standardarchitektur geworden.</p>
<p>Abgesehen von der "Shared Something"-Architektur unterstützt Milvus die flexible Skalierung der einzelnen Komponenten durch die Verwendung von Kubernetes zur Verwaltung der Ausführungs-Engine und die Trennung von Lese-, Schreib- und anderen Diensten durch Microservices.</p>
<h4 id="Database-as-a-service-DBaaS" class="common-anchor-header">Datenbank als Dienst (DBaaS)</h4><p>Database as a Service ist ein heißer Trend, da sich viele Nutzer nicht nur um reguläre Datenbankfunktionalitäten kümmern, sondern sich auch nach vielfältigeren Diensten sehnen. Das bedeutet, dass unsere Datenbank neben den traditionellen CRUD-Operationen die Art der Dienste, die sie anbieten kann, erweitern muss, z. B. Datenbankmanagement, Datentransport, Abrechnung, Visualisierung usw.</p>
<h4 id="Synergy-with-the-broader-open-source-ecosystem" class="common-anchor-header">Synergie mit dem breiteren Open-Source-Ökosystem</h4><p>Ein weiterer Trend in der Datenbankentwicklung ist die Nutzung von Synergien zwischen der Datenbank und anderen Cloud-nativen Infrastrukturen. Im Fall von Milvus wird auf einige Open-Source-Systeme zurückgegriffen. So verwendet Milvus beispielsweise <a href="https://etcd.io/">etcd</a> für die Speicherung von Metadaten. Es verwendet auch Message Queue, eine Art asynchrone Service-to-Service-Kommunikation, die in der Microservices-Architektur verwendet wird und den Export inkrementeller Daten unterstützen kann.</p>
<p>Wir hoffen, Milvus in Zukunft auf KI-Infrastrukturen wie <a href="https://spark.apache.org/">Spark</a> oder <a href="https://www.tensorflow.org/">Tensorflow</a> aufbauen zu können und Milvus mit Streaming-Engines zu integrieren, damit wir die vereinheitlichte Stream- und Batch-Verarbeitung besser unterstützen können, um die verschiedenen Bedürfnisse der Milvus-Nutzer zu erfüllen.</p>
<h2 id="The-design-principles-of-Milvus-20" class="common-anchor-header">Die Designprinzipien von Milvus 2.0<button data-href="#The-design-principles-of-Milvus-20" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.0, unsere Cloud-native Vektordatenbank der nächsten Generation, basiert auf den folgenden drei Prinzipien.</p>
<h3 id="Log-as-data" class="common-anchor-header">Protokoll als Daten</h3><p>Ein Protokoll in einer Datenbank zeichnet seriell alle an den Daten vorgenommenen Änderungen auf. Wie in der Abbildung unten dargestellt, sind von links nach rechts &quot;alte Daten&quot; und &quot;neue Daten&quot; zu sehen. Und die Protokolle sind in zeitlicher Reihenfolge. Milvus verfügt über einen globalen Timer-Mechanismus, der einen global eindeutigen und automatisch inkrementellen Zeitstempel zuweist.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Frame_1_8_6e40211f44.png" alt="Logs" class="doc-image" id="logs" />
   </span> <span class="img-wrapper"> <span>Protokolle</span> </span></p>
<p>In Milvus 2.0 dient der Log-Broker als Rückgrat des Systems: Alle Einfüge- und Aktualisierungsvorgänge von Daten müssen über den Log-Broker laufen, und die Arbeitsknoten führen CRUD-Operationen aus, indem sie Logs abonnieren und konsumieren.</p>
<h3 id="Duality-of-table-and-log" class="common-anchor-header">Dualität von Tabelle und Protokoll</h3><p>Sowohl die Tabelle als auch das Protokoll sind Daten, und sie sind nur zwei verschiedene Formen. Tabellen sind begrenzte Daten, während Protokolle unbegrenzt sind. Protokolle können in Tabellen umgewandelt werden. Im Fall von Milvus werden die Protokolle mit Hilfe eines Verarbeitungsfensters von TimeTick aggregiert. Auf der Grundlage der Log-Sequenz werden mehrere Logs in einer kleinen Datei zusammengefasst, die als Log-Snapshot bezeichnet wird. Anschließend werden diese Log-Snapshots zu einem Segment zusammengefasst, das individuell für den Lastausgleich genutzt werden kann.</p>
<h3 id="Log-persistency" class="common-anchor-header">Log-Persistenz</h3><p>Die Beständigkeit von Protokollen ist eines der heiklen Probleme, mit denen viele Datenbanken konfrontiert sind. Die Speicherung von Protokollen in einem verteilten System hängt normalerweise von Replikationsalgorithmen ab.</p>
<p>Im Gegensatz zu Datenbanken wie <a href="https://aws.amazon.com/rds/aurora/">Aurora</a>, <a href="https://hbase.apache.org/">HBase</a>, <a href="https://www.cockroachlabs.com/">Cockroach DB</a> und <a href="https://en.pingcap.com/">TiDB</a> verfolgt Milvus einen bahnbrechenden Ansatz und führt ein Publish-Subscribe-System (pub/sub) für die Speicherung und Persistenz von Protokollen ein. Ein Pub/Sub-System ist vergleichbar mit der Nachrichtenwarteschlange in <a href="https://kafka.apache.org/">Kafka</a> oder <a href="https://pulsar.apache.org/">Pulsar</a>. Alle Knoten innerhalb des Systems können die Protokolle abrufen. In Milvus wird diese Art von System als Log-Broker bezeichnet. Dank des Log-Brokers sind die Protokolle vom Server entkoppelt, wodurch Milvus selbst zustandslos ist und besser in der Lage ist, sich schnell von Systemausfällen zu erholen.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/log_broker_cafe889835.png" alt="Log broker" class="doc-image" id="log-broker" />
   </span> <span class="img-wrapper"> <span>Log-Broker</span> </span></p>
<h2 id="Building-a-vector-database-for-scalable-similarity-search" class="common-anchor-header">Aufbau einer Vektordatenbank für skalierbare Ähnlichkeitssuche<button data-href="#Building-a-vector-database-for-scalable-similarity-search" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus basiert auf beliebten Vektorsuchbibliotheken wie Faiss, ANNOY, HNSW und anderen und wurde für die Ähnlichkeitssuche in dichten Vektordatensätzen mit Millionen, Milliarden oder sogar Billionen von Vektoren entwickelt.</p>
<h3 id="Standalone-and-cluster" class="common-anchor-header">Eigenständig und im Cluster</h3><p>Milvus bietet zwei Einsatzmöglichkeiten - Standalone oder Cluster. Da bei Milvus Standalone alle Knoten gemeinsam eingesetzt werden, können wir Milvus als einen einzigen Prozess betrachten. Zurzeit stützt sich Milvus standalone auf MinIO und etcd für die Datenpersistenz und die Speicherung von Metadaten. Wir hoffen, dass wir diese beiden Abhängigkeiten von Drittanbietern in zukünftigen Versionen eliminieren können, um die Einfachheit des Milvus-Systems zu gewährleisten. Milvus-Cluster umfasst acht Microservice-Komponenten und drei Abhängigkeiten von Drittanbietern: MinIO, etcd und Pulsar. Pulsar dient als Log-Broker und bietet Log-Pub/Sub-Dienste.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/standalone_and_cluster_7558f56e8c.png" alt="Standalone and cluster" class="doc-image" id="standalone-and-cluster" />
   </span> <span class="img-wrapper"> <span>Eigenständig und Cluster</span> </span></p>
<h3 id="A-bare-bones-skeleton-of-the-Milvus-architecture" class="common-anchor-header">Ein Grundgerüst der Milvus-Architektur</h3><p>Milvus trennt den Datenfluss vom Kontrollfluss und ist in vier Schichten unterteilt, die in Bezug auf Skalierbarkeit und Notfallwiederherstellung unabhängig sind.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Milvus_architecture_b7743a4a7f.png" alt="Milvus architecture" class="doc-image" id="milvus-architecture" />
   </span> <span class="img-wrapper"> <span>Milvus-Architektur</span> </span></p>
<h4 id="Access-layer" class="common-anchor-header">Zugriffsschicht</h4><p>Die Zugriffsschicht fungiert als Gesicht des Systems und stellt den Endpunkt der Client-Verbindung nach außen hin dar. Sie ist verantwortlich für die Verarbeitung von Client-Verbindungen, die Durchführung statischer Überprüfungen, grundlegender dynamischer Überprüfungen von Benutzeranfragen, die Weiterleitung von Anfragen sowie das Sammeln und Zurücksenden von Ergebnissen an den Client. Der Proxy selbst ist zustandslos und stellt über Lastausgleichskomponenten (Nginx, Kubernetes Ingress, NodePort und LVS) einheitliche Zugangsadressen und Dienste für die Außenwelt bereit. Milvus verwendet eine MPP-Architektur (Massively Parallel Processing), bei der die Proxys die von den Arbeitsknoten gesammelten Ergebnisse nach globaler Aggregation und Nachbearbeitung zurückgeben.</p>
<h4 id="Coordinator-service" class="common-anchor-header">Koordinator-Dienst</h4><p>Der Koordinationsdienst ist das Gehirn des Systems und verantwortlich für die Verwaltung der Clustertopologie, den Lastausgleich, die Zeitstempelgenerierung, die Datendeklaration und die Datenverwaltung. Eine ausführliche Erläuterung der Funktionen der einzelnen Koordinatorendienste finden Sie in der <a href="https://milvus.io/docs/v2.0.x/four_layers.md#Coordinator-service">technischen Dokumentation von Milvus</a>.</p>
<h4 id="Worker-nodes" class="common-anchor-header">Worker-Knoten</h4><p>Der Worker- oder Ausführungsknoten fungiert als Gliedmaßen des Systems und führt die vom Koordinatordienst ausgegebenen Anweisungen und die vom Proxy initiierten DML-Befehle (Data Manipulation Language) aus. Ein Worker Node in Milvus ist vergleichbar mit einem Data Node in <a href="https://hadoop.apache.org/">Hadoop</a> oder einem Region Server in HBase. Jeder Typ von Worker Node entspricht einem Koordinationsdienst. Eine ausführliche Erläuterung der Funktionen der einzelnen Worker Nodes finden Sie in der <a href="https://milvus.io/docs/v2.0.x/four_layers.md#Worker-nodes">technischen Dokumentation von Milvus</a>.</p>
<h4 id="Storage" class="common-anchor-header">Speicherung</h4><p>Die Speicherung ist der Eckpfeiler von Milvus, der für die Persistenz der Daten verantwortlich ist. Die Speicherschicht ist in drei Teile unterteilt:</p>
<ul>
<li><strong>Metaspeicher:</strong> Verantwortlich für die Speicherung von Schnappschüssen von Metadaten wie z.B. Sammelschema, Knotenstatus, Checkpoints für den Nachrichtenverbrauch, etc. Milvus verlässt sich für diese Funktionen auf Etcd, das auch die Verantwortung für die Registrierung von Diensten und die Gesundheitsprüfungen übernimmt.</li>
<li><strong>Log-Broker:</strong> Ein Pub/Sub-System, das die Wiedergabe unterstützt und für die Persistenz von Streaming-Daten, die zuverlässige asynchrone Ausführung von Abfragen, Ereignisbenachrichtigungen und die Rückgabe von Abfrageergebnissen zuständig ist. Bei der Wiederherstellung von Knoten während der Ausfallzeit stellt der Log-Broker die Integrität der inkrementellen Daten durch die Wiedergabe des Log-Brokers sicher. Der Milvus-Cluster verwendet Pulsar als Log-Broker, während im Standalone-Modus RocksDB zum Einsatz kommt. Streaming-Speicherdienste wie Kafka und Pravega können ebenfalls als Log-Broker verwendet werden.</li>
<li><strong>Objektspeicher:</strong> Speichert Snapshot-Dateien von Protokollen, Skalar-/Vektorindexdateien und Zwischenergebnisse der Abfrageverarbeitung. Milvus unterstützt <a href="https://aws.amazon.com/s3/">AWS S3</a> und <a href="https://azure.microsoft.com/en-us/services/storage/blobs/">Azure Blob</a> sowie <a href="https://min.io/">MinIO</a>, einen leichtgewichtigen Open-Source-Objektspeicherdienst. Aufgrund der hohen Zugriffslatenz und Abrechnung pro Abfrage von Objektspeicherdiensten wird Milvus in Kürze Speicher/SSD-basierte Cache-Pools und Hot/Cold-Datentrennung unterstützen, um die Leistung zu verbessern und die Kosten zu senken.</li>
</ul>
<h3 id="Data-Model" class="common-anchor-header">Datenmodell</h3><p>Das Datenmodell organisiert die Daten in einer Datenbank. In Milvus werden alle Daten nach Sammlung, Scherbe, Partition, Segment und Entität organisiert.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Data_model_1_5d6bb43673.png" alt="Data model 1" class="doc-image" id="data-model-1" />
   </span> <span class="img-wrapper"> <span>Datenmodell 1</span> </span></p>
<h4 id="Collection" class="common-anchor-header">Sammlung</h4><p>Eine Sammlung in Milvus kann mit einer Tabelle in einem relationalen Speichersystem verglichen werden. Die Sammlung ist die größte Dateneinheit in Milvus.</p>
<h4 id="Shard" class="common-anchor-header">Scherbe</h4><p>Um die parallele Rechenleistung von Clustern beim Schreiben von Daten voll auszunutzen, müssen Sammlungen in Milvus die Schreiboperationen auf verschiedene Knoten verteilen. Standardmäßig enthält eine einzelne Sammlung zwei Shards. Je nach Umfang Ihres Datensatzes können Sie mehr Shards in einer Sammlung haben. Milvus verwendet für das Sharding ein Master-Key-Hashing-Verfahren.</p>
<h4 id="Partition" class="common-anchor-header">Partition</h4><p>Es gibt auch mehrere Partitionen in einem Shard. Eine Partition in Milvus bezieht sich auf einen Satz von Daten, die mit dem gleichen Label in einer Sammlung markiert sind. Gängige Partitionierungsmethoden sind die Partitionierung nach Datum, Geschlecht, Alter des Benutzers und mehr. Die Erstellung von Partitionen kann für den Abfrageprozess von Vorteil sein, da riesige Daten nach Partitionskennzeichen gefiltert werden können.</p>
<p>Im Vergleich dazu geht es beim Sharding eher um Skalierungsmöglichkeiten beim Schreiben von Daten, während beim Partitionieren eher die Systemleistung beim Lesen von Daten gesteigert wird.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Data_model_2_044a443751.png" alt="Data model 2" class="doc-image" id="data-model-2" />
   </span> <span class="img-wrapper"> <span>Datenmodell 2</span> </span></p>
<h4 id="Segments" class="common-anchor-header">Segmente</h4><p>Innerhalb jeder Partition gibt es mehrere kleine Segmente. Ein Segment ist die kleinste Einheit für die Systemplanung in Milvus. Es gibt zwei Arten von Segmenten: wachsende und geschlossene Segmente. Wachsende Segmente werden von Abfrageknoten abonniert. Der Milvus-Benutzer schreibt ständig Daten in wachsende Segmente. Wenn die Größe eines wachsenden Segments eine Obergrenze erreicht (standardmäßig 512 MB), lässt das System das Schreiben weiterer Daten in dieses wachsende Segment nicht mehr zu und versiegelt dieses Segment. Indizes werden auf versiegelten Segmenten aufgebaut.</p>
<p>Um auf Daten in Echtzeit zuzugreifen, liest das System Daten sowohl in wachsenden Segmenten als auch in versiegelten Segmenten.</p>
<h4 id="Entity" class="common-anchor-header">Entität</h4><p>Jedes Segment enthält eine große Anzahl von Entitäten. Eine Entität in Milvus ist gleichbedeutend mit einer Zeile in einer herkömmlichen Datenbank. Jede Entität hat ein eindeutiges Primärschlüsselfeld, das auch automatisch generiert werden kann. Entitäten müssen auch einen Zeitstempel (ts) und ein Vektorfeld enthalten - das Herzstück von Milvus.</p>
<h2 id="About-the-Deep-Dive-Series" class="common-anchor-header">Über die Deep Dive-Reihe<button data-href="#About-the-Deep-Dive-Series" class="anchor-icon" translate="no">
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
    </button></h2><p>Mit der <a href="https://milvus.io/blog/2022-1-25-annoucing-general-availability-of-milvus-2-0.md">offiziellen Ankündigung der allgemeinen Verfügbarkeit</a> von Milvus 2.0 haben wir diese Milvus-Deep-Dive-Blogserie ins Leben gerufen, um eine eingehende Interpretation der Milvus-Architektur und des Quellcodes zu bieten. Die Themen dieser Blogserie umfassen:</p>
<ul>
<li><a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md">Überblick über die Milvus-Architektur</a></li>
<li><a href="https://milvus.io/blog/deep-dive-2-milvus-sdk-and-api.md">APIs und Python-SDKs</a></li>
<li><a href="https://milvus.io/blog/deep-dive-3-data-processing.md">Datenverarbeitung</a></li>
<li><a href="https://milvus.io/blog/deep-dive-4-data-insertion-and-data-persistence.md">Datenverwaltung</a></li>
<li><a href="https://milvus.io/blog/deep-dive-5-real-time-query.md">Abfrage in Echtzeit</a></li>
<li><a href="https://milvus.io/blog/deep-dive-7-query-expression.md">Skalare Ausführungsmaschine</a></li>
<li><a href="https://milvus.io/blog/deep-dive-6-oss-qa.md">QA-System</a></li>
<li><a href="https://milvus.io/blog/deep-dive-8-knowhere.md">Vektorielles Ausführungssystem</a></li>
</ul>
