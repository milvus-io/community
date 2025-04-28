---
id: the-developers-guide-to-milvus-configuration.md
title: Der Leitfaden für Entwickler zur Milvus-Konfiguration
author: Jack Li
date: 2025-04-23T00:00:00.000Z
desc: >-
  Vereinfachen Sie Ihre Milvus-Konfiguration mit unserem gezielten Leitfaden.
  Entdecken Sie die wichtigsten Parameter, die Sie für eine verbesserte Leistung
  Ihrer Vektordatenbankanwendungen anpassen müssen.
cover: assets.zilliz.com/The_Developer_s_Guide_to_Milvus_Configuration_1519241756.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search'
meta_keywords: 'Milvus, configurations, performance, scalability, stability'
meta_title: The Developer’s Guide to Milvus Configuration
origin: 'https://milvus.io/blog/the-developers-guide-to-milvus-configuration.md'
---
<h2 id="Introduction" class="common-anchor-header">Einführung<button data-href="#Introduction" class="anchor-icon" translate="no">
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
    </button></h2><p>Als Entwickler, der mit Milvus arbeitet, sind Sie wahrscheinlich schon einmal auf die entmutigende Konfigurationsdatei <code translate="no">milvus.yaml</code> mit ihren über 500 Parametern gestoßen. Der Umgang mit dieser Komplexität kann eine Herausforderung sein, wenn Sie eigentlich nur die Leistung Ihrer Vektordatenbank optimieren wollen.</p>
<p>Die gute Nachricht: Sie müssen nicht jeden Parameter verstehen. Dieser Leitfaden durchbricht das Rauschen und konzentriert sich auf die kritischen Einstellungen, die sich tatsächlich auf die Leistung auswirken, und zeigt genau auf, welche Werte für Ihren speziellen Anwendungsfall optimiert werden müssen.</p>
<p>Ganz gleich, ob Sie ein Empfehlungssystem entwickeln, das blitzschnelle Abfragen benötigt, oder eine Vektorsuchanwendung mit Kostenbeschränkungen optimieren wollen, ich zeige Ihnen genau, welche Parameter Sie mit praktischen, getesteten Werten ändern müssen. Am Ende dieses Leitfadens werden Sie wissen, wie Sie Milvus-Konfigurationen auf der Grundlage realer Einsatzszenarien auf Spitzenleistung trimmen können.</p>
<h2 id="Configuration-Categories" class="common-anchor-header">Konfigurations-Kategorien<button data-href="#Configuration-Categories" class="anchor-icon" translate="no">
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
    </button></h2><p>Bevor wir uns mit den einzelnen Parametern beschäftigen, sollten wir die Struktur der Konfigurationsdatei aufschlüsseln. Wenn Sie mit <code translate="no">milvus.yaml</code> arbeiten, werden Sie mit drei Parameterkategorien zu tun haben:</p>
<ul>
<li><p><strong>Abhängigkeits-Komponenten-Konfigurationen</strong>: Externe Dienste, zu denen Milvus eine Verbindung herstellt (<code translate="no">etcd</code>, <code translate="no">minio</code>, <code translate="no">mq</code>) - wichtig für die Einrichtung des Clusters und die Datenpersistenz</p></li>
<li><p><strong>Interne Komponentenkonfigurationen</strong>: Die interne Architektur von Milvus (<code translate="no">proxy</code>, <code translate="no">queryNode</code>, etc.) - wichtig für die Leistungsoptimierung</p></li>
<li><p><strong>Funktionale Konfigurationen</strong>: Sicherheit, Protokollierung und Ressourcenbeschränkungen - wichtig für Produktionseinsätze</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Milvus_Configurations_f9a7e45dce.PNG" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Milvus-Dependency-Component-Configurations" class="common-anchor-header">Milvus-Abhängigkeitskomponenten-Konfigurationen<button data-href="#Milvus-Dependency-Component-Configurations" class="anchor-icon" translate="no">
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
    </button></h2><p>Beginnen wir mit den externen Diensten, von denen Milvus abhängig ist. Diese Konfigurationen sind besonders wichtig, wenn man von der Entwicklung zur Produktion übergeht.</p>
<h3 id="etcd-Metadata-Store" class="common-anchor-header"><code translate="no">etcd</code>: Metadaten-Speicher</h3><p>Milvus verlässt sich auf <code translate="no">etcd</code> für die Persistenz von Metadaten und die Koordination von Diensten. Die folgenden Parameter sind entscheidend:</p>
<ul>
<li><p><code translate="no">Etcd.endpoints</code>: Gibt die Adresse des etcd-Clusters an. Standardmäßig startet Milvus eine gebündelte Instanz, aber in Unternehmensumgebungen ist es am besten, eine Verbindung zu einem verwalteten <code translate="no">etcd</code> -Dienst herzustellen, um eine bessere Verfügbarkeit und Betriebskontrolle zu gewährleisten.</p></li>
<li><p><code translate="no">etcd.rootPath</code>: Legt das Schlüsselpräfix für die Speicherung von Milvus-bezogenen Daten in etcd fest. Wenn Sie mehrere Milvus-Cluster auf demselben etcd-Backend betreiben, ermöglicht die Verwendung unterschiedlicher Root-Pfade eine saubere Isolierung der Metadaten.</p></li>
<li><p><code translate="no">etcd.auth</code>: Steuert die Authentifizierungs-Zugangsdaten. Milvus aktiviert etcd auth nicht standardmäßig, aber wenn Ihre verwaltete etcd-Instanz Anmeldeinformationen benötigt, müssen Sie diese hier angeben.</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/etcd_in_milvusyaml_dc600c6974.PNG" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="minio-Object-Storage" class="common-anchor-header"><code translate="no">minio</code>: Objektspeicher</h3><p>Trotz des Namens regelt dieser Abschnitt alle S3-kompatiblen Objektspeicherdienst-Clients. Er unterstützt Anbieter wie AWS S3, GCS und Aliyun OSS über die Einstellung <code translate="no">cloudProvider</code>.</p>
<p>Achten Sie auf diese vier wichtigen Konfigurationen:</p>
<ul>
<li><p><code translate="no">minio.address / minio.port</code>: Verwenden Sie diese, um den Endpunkt Ihres Objektspeicherdienstes anzugeben.</p></li>
<li><p><code translate="no">minio.bucketName</code>: Weisen Sie separate Buckets (oder logische Präfixe) zu, um Datenkollisionen zu vermeiden, wenn Sie mehrere Milvus-Cluster betreiben.</p></li>
<li><p><code translate="no">minio.rootPath</code>: Ermöglicht Intra-Bucket-Namespacing zur Datenisolierung.</p></li>
<li><p><code translate="no">minio.cloudProvider</code>: Identifiziert das OSS-Backend. Eine vollständige Kompatibilitätsliste finden Sie in der <a href="https://milvus.io/docs/product_faq.md#Where-does-Milvus-store-data">Milvus-Dokumentation</a>.</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/minio_in_milvusyaml_faa11c9fcd.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="mq-Message-Queue" class="common-anchor-header"><code translate="no">mq</code>: Nachrichten-Warteschlange</h3><p>Milvus verwendet eine Nachrichtenwarteschlange für die interne Ereignisweiterleitung - entweder Pulsar (Standard) oder Kafka. Achten Sie auf die folgenden drei Parameter.</p>
<ol>
<li><p><code translate="no">pulsar.address/pulsar.port</code>: Setzen Sie diese Werte, um einen externen Pulsar-Cluster zu verwenden.</p></li>
<li><p><code translate="no">pulsar.tenant</code>: Legt den Mandantennamen fest. Wenn sich mehrere Milvus-Cluster eine Pulsar-Instanz teilen, gewährleistet dies eine saubere Kanaltrennung.</p></li>
<li><p><code translate="no">msgChannel.chanNamePrefix.cluster</code>: Wenn Sie das Tenant-Modell von Pulsar umgehen möchten, passen Sie das Kanalpräfix an, um Kollisionen zu vermeiden.</p></li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/mq_in_milvusyaml1_2214739c84.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/mq_in_milvusyaml2_a44ff64936.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Milvus unterstützt auch Kafka als Nachrichtenwarteschlange. Um stattdessen Kafka zu verwenden, kommentieren Sie die Pulsar-spezifischen Einstellungen aus und entfernen Sie die Kommentare im Kafka-Konfigurationsblock.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/mq_in_milvusyaml3_d41f44f77a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Milvus-Internal-Component-Configurations" class="common-anchor-header">Milvus-interne Komponentenkonfigurationen<button data-href="#Milvus-Internal-Component-Configurations" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="rootCoord-Metadata-+-Timestamps" class="common-anchor-header"><code translate="no">rootCoord</code>: Metadaten + Zeitstempel</h3><p>Der Knoten <code translate="no">rootCoord</code> verwaltet Metadatenänderungen (DDL/DCL) und Zeitstempel.</p>
<ol>
<li><p><code translate="no">rootCoord.maxPartitionNum</code>： Legt die Obergrenze für die Anzahl der Partitionen pro Sammlung fest. Während die harte Grenze bei 1024 liegt, dient dieser Parameter in erster Linie als Schutz. Vermeiden Sie bei mandantenfähigen Systemen die Verwendung von Partitionen als Isolationsgrenzen und implementieren Sie stattdessen eine Mandantenschlüsselstrategie, die für Millionen von logischen Mandanten geeignet ist.</p></li>
<li><p><code translate="no">rootCoord.enableActiveStandby</code>：Ermöglicht hohe Verfügbarkeit durch Aktivierung eines Standby-Knotens. Dies ist von entscheidender Bedeutung, da die Milvus-Koordinatorknoten standardmäßig nicht horizontal skalierbar sind.</p></li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/root_Coord_in_milvusyaml_9c2417dbaf.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="proxy-API-Gateway-+-Request-Router" class="common-anchor-header"><code translate="no">proxy</code>: API-Gateway + Anfrage-Router</h3><p><code translate="no">proxy</code> bearbeitet die Anfragen der Kunden, die Validierung der Anfragen und die Aggregation der Ergebnisse.</p>
<ul>
<li><p><code translate="no">proxy.maxFieldNum</code>: Begrenzt die Anzahl der Felder (skalar + vektoriell) pro Sammlung. Halten Sie diese unter 64, um die Schemakomplexität zu minimieren und den I/O-Overhead zu reduzieren.</p></li>
<li><p><code translate="no">proxy.maxVectorFieldNum</code>: Steuert die Anzahl der Vektorfelder in einer Sammlung. Milvus unterstützt die multimodale Suche, aber in der Praxis sind 10 Vektorfelder eine sichere Obergrenze.</p></li>
<li><p><code translate="no">proxy.maxShardNum</code>:Definiert die Anzahl der Ingestion Shards. Als Faustregel gilt hier:</p>
<ul>
<li><p>&lt; 200M Datensätze → 1 Shard</p></li>
<li><p>200-400M Datensätze → 2 Shards</p></li>
<li><p>Lineare Skalierung darüber hinaus</p></li>
</ul></li>
<li><p><code translate="no">proxy.accesslog</code>: Wenn diese Funktion aktiviert ist, werden detaillierte Informationen über die Anfrage (Benutzer, IP, Endpunkt, SDK) protokolliert. Nützlich für Auditing und Debugging.</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/proxy_in_milvusyaml_897b33c759.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="queryNode-Query-Execution" class="common-anchor-header"><code translate="no">queryNode</code>: Abfrage-Ausführung</h3><p>Verwaltet die Ausführung der Vektorsuche und das Laden von Segmenten. Achten Sie auf den folgenden Parameter.</p>
<ul>
<li><code translate="no">queryNode.mmap</code>: Schaltet Memory-Mapped I/O für das Laden von skalaren Feldern und Segmenten ein. Die Aktivierung von <code translate="no">mmap</code> trägt zur Verringerung des Speicherbedarfs bei, kann aber die Latenz verringern, wenn die Festplatten-E/A zu einem Engpass wird.</li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/query_Node_in_milvusyaml_36e1bf378a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="dataCoord-Segment-+-Index-Management" class="common-anchor-header"><code translate="no">dataCoord</code>: Segment- und Indexverwaltung</h3><p>Dieser Parameter steuert Datensegmentierung, Indexierung, Verdichtung und Garbage Collection (GC). Die wichtigsten Konfigurationsparameter sind:</p>
<ol>
<li><p><code translate="no">dataCoord.segment.maxSize</code>: Gibt die maximale Größe eines speicherinternen Datensegments an. Größere Segmente bedeuten in der Regel weniger Gesamtsegmente im System, was die Abfrageleistung durch Verringerung des Indizierungs- und Such-Overheads verbessern kann. Einige Benutzer, die <code translate="no">queryNode</code> Instanzen mit 128 GB RAM betreiben, berichteten zum Beispiel, dass die Erhöhung dieser Einstellung von 1 GB auf 8 GB zu einer etwa viermal schnelleren Abfrageleistung führte.</p></li>
<li><p><code translate="no">dataCoord.segment.diskSegmentMaxSize</code>: Ähnlich wie oben, steuert dieser Parameter speziell die maximale Größe für <a href="https://milvus.io/docs/disk_index.md#On-disk-Index">Festplattenindizes</a> (diskann index).</p></li>
<li><p><code translate="no">dataCoord.segment.sealProportion</code>: Bestimmt, wann ein wachsendes Segment versiegelt (d.h. abgeschlossen und indiziert) wird. Das Segment wird versiegelt, wenn es <code translate="no">maxSize * sealProportion</code> erreicht. Standardmäßig wird ein Segment mit <code translate="no">maxSize = 1024MB</code> und <code translate="no">sealProportion = 0.12</code> bei etwa 123 MB versiegelt.</p></li>
</ol>
<ul>
<li><p>Niedrigere Werte (z. B. 0,12) lösen die Versiegelung früher aus, was zu einer schnelleren Indexerstellung beitragen kann, was bei Arbeitslasten mit häufigen Aktualisierungen nützlich ist.</p></li>
<li><p>Höhere Werte (z. B. 0,3 bis 0,5) verzögern die Versiegelung und reduzieren den Indizierungs-Overhead - besser geeignet für Offline- oder Batch-Ingestion-Szenarien.</p></li>
</ul>
<ol start="4">
<li><p><code translate="no">dataCoord.segment.expansionRate</code>:  Legt den zulässigen Expansionsfaktor während der Komprimierung fest. Milvus berechnet die maximal zulässige Segmentgröße während der Verdichtung als <code translate="no">maxSize * expansionRate</code>.</p></li>
<li><p><code translate="no">dataCoord.gc.dropTolerance</code>: Nachdem ein Segment komprimiert oder eine Sammlung gelöscht wurde, löscht Milvus die zugrunde liegenden Daten nicht sofort. Stattdessen markiert es die Segmente zum Löschen und wartet auf den Abschluss des Garbage Collection (GC)-Zyklus. Dieser Parameter steuert die Dauer dieser Verzögerung.</p></li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/data_Coord_in_milvusyaml1_100d98a081.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/data_Coord_in_milvusyaml2_7fa8c5f2c0.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Other-Functional-Configurations" class="common-anchor-header">Andere Funktionskonfigurationen<button data-href="#Other-Functional-Configurations" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="log-Observability-and-Diagnostics" class="common-anchor-header"><code translate="no">log</code>: Beobachtbarkeit und Diagnostik</h3><p>Eine robuste Protokollierung ist ein Eckpfeiler jedes verteilten Systems, und Milvus ist da keine Ausnahme. Eine gut konfigurierte Protokollierung hilft nicht nur bei der Fehlersuche, wenn Probleme auftreten, sondern gewährleistet auch einen besseren Einblick in den Zustand und das Verhalten des Systems im Laufe der Zeit.</p>
<p>Für den produktiven Einsatz empfehlen wir die Integration der Milvus-Protokolle in zentralisierte Protokollierungs- und Überwachungstools wie <a href="https://milvus.io/docs/configure_grafana_loki.md#Deploy-Loki">Loki</a>, um die Analyse und Alarmierung zu optimieren. Die wichtigsten Einstellungen sind:</p>
<ol>
<li><p><code translate="no">log.level</code>: Steuert die Ausführlichkeit der Protokollausgabe. Bleiben Sie in Produktionsumgebungen bei der Stufe <code translate="no">info</code>, um wichtige Laufzeitdetails zu erfassen, ohne das System zu überlasten. Während der Entwicklung oder Fehlerbehebung können Sie zu <code translate="no">debug</code> wechseln, um detailliertere Einblicke in interne Vorgänge zu erhalten. ⚠️ Seien Sie vorsichtig mit der Stufe <code translate="no">debug</code> in der Produktion - sie erzeugt eine große Menge an Protokollen, die schnell Speicherplatz verbrauchen und die E/A-Leistung beeinträchtigen können, wenn sie nicht kontrolliert werden.</p></li>
<li><p><code translate="no">log.file</code>: Standardmäßig schreibt Milvus Protokolle in die Standardausgabe (stdout), was für containerisierte Umgebungen geeignet ist, in denen Protokolle über Sidecars oder Knotenagenten gesammelt werden. Um stattdessen die dateibasierte Protokollierung zu aktivieren, können Sie dies konfigurieren:</p></li>
</ol>
<ul>
<li><p>Maximale Dateigröße vor der Rotation</p></li>
<li><p>Aufbewahrungsdauer der Dateien</p></li>
<li><p>Anzahl der aufzubewahrenden Sicherungsprotokolldateien</p></li>
</ul>
<p>Dies ist nützlich in Bare-Metal- oder On-Prem-Umgebungen, in denen der Versand von stdout-Protokollen nicht möglich ist.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/log_in_milvusyaml_248ead1264.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="security-Authentication-and-Access-Control" class="common-anchor-header"><code translate="no">security</code>: Authentifizierung und Zugriffskontrolle</h3><p>Milvus unterstützt <a href="https://milvus.io/docs/authenticate.md?tab=docker">Benutzerauthentifizierung</a> und <a href="https://milvus.io/docs/rbac.md">rollenbasierte Zugriffskontrolle (RBAC)</a>, die beide unter dem Modul <code translate="no">common</code> konfiguriert werden. Diese Einstellungen sind für die Absicherung von mandantenfähigen Umgebungen oder jeder Bereitstellung, die externen Clients ausgesetzt ist, unerlässlich.</p>
<p>Die wichtigsten Parameter sind:</p>
<ol>
<li><p><code translate="no">common.security.authorizationEnabled</code>: Dieser Schalter aktiviert oder deaktiviert die Authentifizierung und RBAC. Standardmäßig ist sie ausgeschaltet, was bedeutet, dass alle Operationen ohne Identitätsprüfung zulässig sind. Um eine sichere Zugriffskontrolle zu erzwingen, setzen Sie diesen Parameter auf <code translate="no">true</code>.</p></li>
<li><p><code translate="no">common.security.defaultRootPassword</code>: Wenn die Authentifizierung aktiviert ist, definiert diese Einstellung das anfängliche Passwort für den eingebauten <code translate="no">root</code> Benutzer.</p></li>
</ol>
<p>Achten Sie darauf, das Standardpasswort sofort nach der Aktivierung der Authentifizierung zu ändern, um Sicherheitslücken in Produktionsumgebungen zu vermeiden.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/security_in_milvusyaml_a8d0187b5a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="quotaAndLimits-Rate-Limiting-and-Write-Control" class="common-anchor-header"><code translate="no">quotaAndLimits</code>: Ratenbegrenzung und Schreibkontrolle</h3><p>Der Abschnitt <code translate="no">quotaAndLimits</code> in <code translate="no">milvus.yaml</code> spielt eine entscheidende Rolle bei der Kontrolle des Datenflusses durch das System. Er regelt die Ratenbegrenzung für Vorgänge wie Inserts, Deletes, Flushes und Abfragen, um die Stabilität des Clusters bei hoher Arbeitslast zu gewährleisten und Leistungseinbußen aufgrund von Schreibverstärkung oder übermäßiger Verdichtung zu verhindern.</p>
<p>Die wichtigsten Parameter sind:</p>
<p><code translate="no">quotaAndLimits.flushRate.collection</code>: Steuert, wie häufig Milvus Daten aus einer Sammlung flusht.</p>
<ul>
<li><p><strong>Standardwert</strong>: <code translate="no">0.1</code> Das bedeutet, dass das System einen Flush alle 10 Sekunden zulässt.</p></li>
<li><p>Der Flush-Vorgang versiegelt ein wachsendes Segment und verschiebt es von der Nachrichtenwarteschlange in den Objektspeicher.</p></li>
<li><p>Zu häufiges Flushen kann viele kleine versiegelte Segmente erzeugen, was den Verdichtungsaufwand erhöht und die Abfrageleistung beeinträchtigt.</p></li>
</ul>
<p>💡 Bewährte Praxis: Lassen Sie Milvus dies in den meisten Fällen automatisch erledigen. Ein wachsendes Segment wird versiegelt, sobald es <code translate="no">maxSize * sealProportion</code> erreicht, und versiegelte Segmente werden alle 10 Minuten geleert. Manuelle Flushes werden nur nach Bulk-Inserts empfohlen, wenn Sie wissen, dass keine weiteren Daten kommen.</p>
<p>Denken Sie auch daran, dass die <strong>Sichtbarkeit der Daten</strong> durch die <em>Konsistenzstufe</em> der Abfrage bestimmt wird, nicht durch den Zeitpunkt des Flushs - durch das Flushen werden neue Daten also nicht sofort abfragbar.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/quota_And_Limits1_be185e571f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><code translate="no">quotaAndLimits.upsertRate</code>/<code translate="no">quotaAndLimits.deleteRate</code>: Diese Parameter definieren die maximal zulässige Rate für Upsert- und Delete-Operationen.</p>
<ul>
<li><p>Milvus basiert auf einer LSM-Tree-Speicherarchitektur, was bedeutet, dass häufige Aktualisierungen und Löschungen eine Verdichtung auslösen. Dies kann ressourcenintensiv sein und den Gesamtdurchsatz verringern, wenn es nicht sorgfältig verwaltet wird.</p></li>
<li><p>Es wird empfohlen, sowohl <code translate="no">upsertRate</code> als auch <code translate="no">deleteRate</code> auf <strong>0,5 MB/s</strong> zu begrenzen, um die Verdichtungspipeline nicht zu überlasten.</p></li>
</ul>
<p>🚀 Sie müssen einen großen Datensatz schnell aktualisieren? Verwenden Sie eine Sammlungs-Alias-Strategie:</p>
<ul>
<li><p>Fügen Sie neue Daten in eine neue Sammlung ein.</p></li>
<li><p>Sobald die Aktualisierung abgeschlossen ist, verweisen Sie den Alias auf die neue Sammlung. Auf diese Weise wird der Verdichtungsnachteil von In-Place-Aktualisierungen vermieden und eine sofortige Umschaltung ermöglicht.</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/quota_And_Limits2_32c8640190.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Real-World-Configuration-Examples" class="common-anchor-header">Konfigurationsbeispiele aus der Praxis<button data-href="#Real-World-Configuration-Examples" class="anchor-icon" translate="no">
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
    </button></h2><p>Gehen wir zwei gängige Einsatzszenarien durch, um zu veranschaulichen, wie die Milvus-Konfigurationseinstellungen an unterschiedliche Betriebsziele angepasst werden können.</p>
<h3 id="⚡-Example-1-High-Performance-Configuration" class="common-anchor-header">⚡ Beispiel 1: Leistungsstarke Konfiguration</h3><p>Wenn die Abfragelatenz geschäftskritisch ist - denken Sie an Empfehlungsmaschinen, semantische Suchplattformen oder Echtzeit-Risikobewertungen - zählt jede Millisekunde. In diesen Anwendungsfällen stützen Sie sich in der Regel auf graphenbasierte Indizes wie <strong>HNSW</strong> oder <strong>DISKANN</strong> und optimieren sowohl die Speichernutzung als auch das Lebenszyklusverhalten von Segmenten.</p>
<p>Wichtige Optimierungsstrategien:</p>
<ul>
<li><p>Erhöhen Sie <code translate="no">dataCoord.segment.maxSize</code> und <code translate="no">dataCoord.segment.diskSegmentMaxSize</code>: Erhöhen Sie diese Werte auf 4 GB oder sogar 8 GB, je nach verfügbarem RAM. Größere Segmente reduzieren die Anzahl der Indexerstellungen und verbessern den Abfragedurchsatz durch Minimierung des Segment-Fanout. Größere Segmente verbrauchen jedoch zur Abfragezeit mehr Arbeitsspeicher. Stellen Sie also sicher, dass Ihre <code translate="no">indexNode</code> und <code translate="no">queryNode</code> Instanzen über genügend Spielraum verfügen.</p></li>
<li><p>Verringern Sie <code translate="no">dataCoord.segment.sealProportion</code> und <code translate="no">dataCoord.segment.expansionRate</code>: Streben Sie eine wachsende Segmentgröße von etwa 200 MB vor der Versiegelung an. Dadurch bleibt die Segment-Speichernutzung vorhersehbar und die Belastung des Delegators (der queryNode-Leader, der die verteilte Suche koordiniert) wird reduziert.</p></li>
</ul>
<p>Faustformel: Bevorzugen Sie weniger, größere Segmente, wenn viel Speicherplatz zur Verfügung steht und die Latenz eine Priorität ist. Seien Sie konservativ mit Siegelschwellen, wenn die Indexfrische wichtig ist.</p>
<h3 id="💰-Example-2-Cost-Optimized-Configuration" class="common-anchor-header">💰 Beispiel 2: Kostenoptimierte Konfiguration</h3><p>Wenn Sie der Kosteneffizienz Vorrang vor der reinen Leistung einräumen - häufig bei Modell-Trainings-Pipelines, internen Tools mit niedriger QPS oder bei der Long-Tail-Bildsuche - können Sie die Abrufrate oder die Latenz verringern, um die Anforderungen an die Infrastruktur deutlich zu reduzieren.</p>
<p>Empfohlene Strategien:</p>
<ul>
<li><p><strong>Verwenden Sie Indexquantisierung:</strong> Index-Typen wie <code translate="no">SCANN</code>, <code translate="no">IVF_SQ8</code> oder <code translate="no">HNSW_PQ/PRQ/SQ</code> (eingeführt in Milvus 2.5) reduzieren die Indexgröße und den Speicherbedarf drastisch. Sie sind ideal für Workloads, bei denen die Präzision weniger wichtig ist als die Größe oder das Budget.</p></li>
<li><p><strong>Wählen Sie eine plattengestützte Indizierungsstrategie:</strong> Setzen Sie den Indextyp auf <code translate="no">DISKANN</code>, um eine rein festplattenbasierte Suche zu ermöglichen. <strong>Aktivieren Sie</strong> <code translate="no">mmap</code> für selektives Speicher-Offloading.</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/query_Node_in_milvusyaml_36e1bf378a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Für extreme Speichereinsparungen aktivieren Sie <code translate="no">mmap</code> für Folgendes: <code translate="no">vectorField</code>, <code translate="no">vectorIndex</code>, <code translate="no">scalarField</code>, und <code translate="no">scalarIndex</code>. Dadurch werden große Datenpakete in den virtuellen Speicher ausgelagert, was die Nutzung des residenten RAM erheblich reduziert.</p>
<p>⚠️ Achtung: Wenn die skalare Filterung einen großen Teil Ihrer Abfrageauslastung ausmacht, sollten Sie <code translate="no">mmap</code> für <code translate="no">vectorIndex</code> und <code translate="no">scalarIndex</code> deaktivieren. Die Speicherzuordnung kann die Leistung skalarer Abfragen in Umgebungen mit eingeschränkter E/A beeinträchtigen.</p>
<h4 id="Disk-usage-tip" class="common-anchor-header">Tipp zur Festplattennutzung</h4><ul>
<li><p>Mit <code translate="no">mmap</code> erstellte HNSW-Indizes können die Gesamtdatengröße um das bis zu <strong>1,8-fache</strong> erhöhen.</p></li>
<li><p>Auf einer physischen Festplatte mit 100 GB können realistischerweise nur ~50 GB an effektiven Daten untergebracht werden, wenn Sie den Index-Overhead und das Caching berücksichtigen.</p></li>
<li><p>Sorgen Sie immer für zusätzlichen Speicherplatz, wenn Sie mit <code translate="no">mmap</code> arbeiten, insbesondere wenn Sie die ursprünglichen Vektoren auch lokal zwischenspeichern.</p></li>
</ul>
<h2 id="Conclusion" class="common-anchor-header">Schlussfolgerung<button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p>Beim Tuning von Milvus geht es nicht darum, perfekte Zahlen zu erreichen, sondern darum, das System an das reale Verhalten Ihrer Arbeitslast anzupassen. Die wirkungsvollsten Optimierungen ergeben sich oft aus dem Verständnis dafür, wie Milvus E/A, Segmentlebenszyklus und Indizierung unter Druck handhabt. Dies sind die Pfade, auf denen Fehlkonfigurationen am meisten schaden - und auf denen ein durchdachtes Tuning den größten Nutzen bringt.</p>
<p>Wenn Sie Milvus zum ersten Mal verwenden, werden die von uns behandelten Konfigurationsparameter 80-90% Ihrer Leistungs- und Stabilitätsanforderungen abdecken. Beginnen Sie dort. Sobald Sie eine gewisse Intuition entwickelt haben, sollten Sie sich eingehender mit der vollständigen Spezifikation von <code translate="no">milvus.yaml</code> und der offiziellen Dokumentation befassen - Sie werden feinkörnige Steuerungen entdecken, die Ihre Bereitstellung von funktional zu außergewöhnlich machen können.</p>
<p>Mit den richtigen Konfigurationen sind Sie in der Lage, skalierbare, hochleistungsfähige Vektorsuchsysteme zu erstellen, die Ihren betrieblichen Prioritäten entsprechen - ganz gleich, ob es sich dabei um Serving mit niedriger Latenz, kosteneffiziente Speicherung oder analytische Workloads mit hohem Durchsatz handelt.</p>
