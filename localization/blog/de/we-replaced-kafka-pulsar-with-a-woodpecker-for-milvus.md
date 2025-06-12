---
id: we-replaced-kafka-pulsar-with-a-woodpecker-for-milvus.md
title: Wir haben Kafka/Pulsar durch einen Specht für Milvus ersetzt - so sieht es aus
author: James Luan
date: 2025-05-15T00:00:00.000Z
desc: >-
  Wir haben Woodpecker, ein Cloud-natives WAL-System, entwickelt, um Kafka und
  Pulsar in Milvus zu ersetzen und so die Betriebskomplexität und -kosten zu
  senken.
cover: >-
  assets.zilliz.com/We_Replaced_Kafka_Pulsar_with_a_Woodpecker_for_Milvus_Here_s_What_Happened_77e8de27a9.png
tag: Engineering
recommend: true
publishToMedium: true
tags: 'Milvus, vector database, vector search, AI Agents, LLM'
meta_keywords: >-
  Replace Kafka, replace Pulsar, messaging queues, Write-Ahead Logging (WAL),
  Milvus vector database
meta_title: |
  We Replaced Kafka/Pulsar with a Woodpecker for Milvus
origin: >-
  https://milvus.io/blog/we-replaced-kafka-pulsar-with-a-woodpecker-for-milvus.md
---
<p><strong>TL;DR:</strong> Wir haben Woodpecker, ein Cloud-natives Write-Ahead Logging (WAL) System, entwickelt, um Kafka und Pulsar in Milvus 2.6 zu ersetzen. Das Ergebnis? Vereinfachte Abläufe, bessere Leistung und geringere Kosten für unsere Milvus-Vektor-Datenbank.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/We_Replaced_Kafka_Pulsar_with_a_Woodpecker_for_Milvus_Here_s_What_Happened_77e8de27a9.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="The-Starting-Point-When-Message-Queues-No-Longer-Fit" class="common-anchor-header">Der Startpunkt: Wenn Nachrichtenwarteschlangen nicht mehr passen<button data-href="#The-Starting-Point-When-Message-Queues-No-Longer-Fit" class="anchor-icon" translate="no">
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
    </button></h2><p>Wir haben Kafka und Pulsar geliebt und verwendet. Sie funktionierten, bis sie es nicht mehr taten. Als Milvus, die führende Open-Source-Vektordatenbank, weiterentwickelt wurde, stellten wir fest, dass diese leistungsstarken Nachrichtenwarteschlangen unsere Anforderungen an die Skalierbarkeit nicht mehr erfüllten. Also haben wir einen mutigen Schritt gewagt: Wir haben das Streaming-Backbone in Milvus 2.6 neu geschrieben und unser eigenes WAL implementiert - <strong>Woodpecker</strong>.</p>
<p>Ich möchte Sie auf unserem Weg begleiten und Ihnen erklären, warum wir diese Änderung vorgenommen haben, die auf den ersten Blick vielleicht kontraintuitiv erscheint.</p>
<h2 id="Cloud-Native-From-Day-One" class="common-anchor-header">Cloud-nativ vom ersten Tag an<button data-href="#Cloud-Native-From-Day-One" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus war von Anfang an eine Cloud-native Vektordatenbank. Wir nutzen Kubernetes für elastische Skalierung und schnelle Fehlerbehebung sowie Objektspeicherlösungen wie Amazon S3 und MinIO für die Datenpersistenz.</p>
<p>Dieser Cloud-first-Ansatz bietet enorme Vorteile, birgt aber auch einige Herausforderungen:</p>
<ul>
<li><p>Cloud-Objektspeicherdienste wie S3 bieten praktisch unbegrenzte Kapazitäten für Durchsatz und Verfügbarkeit, allerdings mit Latenzen von oft mehr als 100 ms.</p></li>
<li><p>Die Preismodelle dieser Dienste (basierend auf Zugriffsmustern und -häufigkeit) können bei Echtzeit-Datenbankoperationen unerwartete Kosten verursachen.</p></li>
<li><p>Der Ausgleich zwischen Cloud-nativen Merkmalen und den Anforderungen der Echtzeit-Vektorsuche bringt erhebliche architektonische Herausforderungen mit sich.</p></li>
</ul>
<h2 id="The-Shared-Log-Architecture-Our-Foundation" class="common-anchor-header">Die Shared Log Architektur: Unsere Grundlage<button data-href="#The-Shared-Log-Architecture-Our-Foundation" class="anchor-icon" translate="no">
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
    </button></h2><p>Viele Vektorsuchsysteme beschränken sich auf die Stapelverarbeitung, da der Aufbau eines Streaming-Systems in einer Cloud-nativen Umgebung eine noch größere Herausforderung darstellt. Im Gegensatz dazu legt Milvus den Schwerpunkt auf die Aktualität der Daten in Echtzeit und implementiert eine gemeinsam genutzte Protokollarchitektur - man kann sie sich wie eine Festplatte für ein Dateisystem vorstellen.</p>
<p>Diese gemeinsam genutzte Protokollarchitektur bietet eine wichtige Grundlage, die Konsensprotokolle von den Kernfunktionen der Datenbank trennt. Durch diesen Ansatz entfällt bei Milvus die Notwendigkeit, komplexe Konsensprotokolle direkt zu verwalten, so dass wir uns auf die Bereitstellung außergewöhnlicher Vektorsuchfunktionen konzentrieren können.</p>
<p>Mit diesem Architekturmuster sind wir nicht allein - Datenbanken wie AWS Aurora, Azure Socrates und Neon nutzen alle ein ähnliches Design. <strong>Im Open-Source-Ökosystem klafft jedoch noch eine erhebliche Lücke: Trotz der eindeutigen Vorteile dieses Ansatzes fehlt der Community eine skalierbare und kosteneffiziente verteilte WAL-Implementierung (Write-ahead Log) mit niedriger Latenz.</strong></p>
<p>Bestehende Lösungen wie Bookie erwiesen sich aufgrund ihres schwergewichtigen Client-Designs und des Fehlens produktionsreifer SDKs für Golang und C++ als unzureichend für unsere Anforderungen. Diese technologische Lücke führte uns zu unserem ersten Ansatz mit Message Queues.</p>
<h2 id="Our-Initial-Solution-Message-Queues-as-WAL" class="common-anchor-header">Unsere erste Lösung: Nachrichten-Warteschlangen als WAL<button data-href="#Our-Initial-Solution-Message-Queues-as-WAL" class="anchor-icon" translate="no">
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
    </button></h2><p>Um diese Lücke zu schließen, nutzten wir anfangs Nachrichtenwarteschlangen (Kafka/Pulsar) als unser Write-Ahead-Log (WAL). Die Architektur funktionierte folgendermaßen:</p>
<ul>
<li><p>Alle eingehenden Echtzeit-Aktualisierungen fließen durch die Nachrichtenwarteschlange.</p></li>
<li><p>Die Schreiber erhalten eine sofortige Bestätigung, sobald sie von der Nachrichtenwarteschlange akzeptiert wird.</p></li>
<li><p>QueryNode und DataNode verarbeiten diese Daten asynchron, um einen hohen Schreibdurchsatz zu gewährleisten und gleichzeitig die Frische der Daten zu erhalten.</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_Milvus_2_0_Architecture_Overview_465f5ba27a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Abbildung: Überblick über die Architektur von Milvus 2.0</p>
<p>Dieses System bot eine sofortige Schreibbestätigung und ermöglichte gleichzeitig eine asynchrone Datenverarbeitung, was für die Aufrechterhaltung des Gleichgewichts zwischen Durchsatz und Datenfrische, das Milvus-Benutzer erwarten, entscheidend war.</p>
<h2 id="Why-We-Needed-Something-Different-for-WAL" class="common-anchor-header">Warum wir für WAL etwas anderes brauchten<button data-href="#Why-We-Needed-Something-Different-for-WAL" class="anchor-icon" translate="no">
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
    </button></h2><p>Mit Milvus 2.6 haben wir beschlossen, externe Message Queues zugunsten von Woodpecker, unserer speziell entwickelten, Cloud-nativen WAL-Implementierung, abzuschaffen. Diese Entscheidung haben wir uns nicht leicht gemacht. Schließlich hatten wir jahrelang erfolgreich Kafka und Pulsar eingesetzt.</p>
<p>Das Problem lag nicht an diesen Technologien selbst - beides sind hervorragende Systeme mit leistungsstarken Funktionen. Die Herausforderung bestand vielmehr in der zunehmenden Komplexität und dem Overhead, den diese externen Systeme mit der Entwicklung von Milvus mit sich brachten. Je spezieller unsere Anforderungen wurden, desto größer wurde die Kluft zwischen dem, was allgemeine Nachrichtenwarteschlangen boten, und dem, was unsere Vektordatenbank benötigte.</p>
<p>Drei spezifische Faktoren waren letztendlich ausschlaggebend für unsere Entscheidung, einen Ersatz zu entwickeln:</p>
<h3 id="Operational-Complexity" class="common-anchor-header">Betriebliche Komplexität</h3><p>Externe Abhängigkeiten wie Kafka oder Pulsar erfordern dedizierte Maschinen mit mehreren Knoten und eine sorgfältige Ressourcenverwaltung. Dies bringt mehrere Herausforderungen mit sich:</p>
<ul>
<li>Erhöhte betriebliche Komplexität</li>
</ul>
<ul>
<li>Steilere Lernkurve für Systemadministratoren</li>
</ul>
<ul>
<li>Höhere Risiken von Konfigurationsfehlern und Sicherheitsschwachstellen</li>
</ul>
<h3 id="Architectural-Constraints" class="common-anchor-header">Architektonische Beschränkungen</h3><p>Nachrichten-Warteschlangen wie Kafka haben inhärente Beschränkungen hinsichtlich der Anzahl der unterstützten Themen. Wir haben VShard als Workaround für die gemeinsame Nutzung von Themen durch verschiedene Komponenten entwickelt, aber diese Lösung - obwohl sie die Skalierungsanforderungen effektiv erfüllt - führte zu einer erheblichen architektonischen Komplexität.</p>
<p>Diese externen Abhängigkeiten erschwerten die Implementierung kritischer Funktionen, wie z. B. die Garbage Collection von Protokollen, und erhöhten die Reibung bei der Integration mit anderen Systemmodulen. Im Laufe der Zeit wurde die architektonische Diskrepanz zwischen universellen Nachrichtenwarteschlangen und den spezifischen Hochleistungsanforderungen einer Vektordatenbank immer deutlicher, was uns dazu veranlasste, unsere Designentscheidungen zu überdenken.</p>
<h3 id="Resource-Inefficiency" class="common-anchor-header">Ineffiziente Ressourcen</h3><p>Die Gewährleistung einer hohen Verfügbarkeit mit Systemen wie Kafka und Pulsar erfordert in der Regel:</p>
<ul>
<li><p>Verteilter Einsatz über mehrere Knoten</p></li>
<li><p>Erhebliche Ressourcenzuweisung selbst für kleinere Arbeitslasten</p></li>
<li><p>Speicherung ephemerer Signale (wie Timetick von Milvus), die eigentlich keine langfristige Aufbewahrung erfordern</p></li>
</ul>
<p>Diesen Systemen fehlt jedoch die Flexibilität, die Persistenz für solche flüchtigen Signale zu umgehen, was zu unnötigen E/A-Vorgängen und Speicherverbrauch führt. Dies führt zu einem unverhältnismäßigen Ressourcen-Overhead und erhöhten Kosten - vor allem in kleineren oder ressourcenbeschränkten Umgebungen.</p>
<h2 id="Introducing-Woodpecker---A-Cloud-Native-High-Performance-WAL-Engine" class="common-anchor-header">Einführung von Woodpecker - einer Cloud-nativen, hochleistungsfähigen WAL-Engine<button data-href="#Introducing-Woodpecker---A-Cloud-Native-High-Performance-WAL-Engine" class="anchor-icon" translate="no">
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
    </button></h2><p>In Milvus 2.6 haben wir Kafka/Pulsar durch <strong>Woodpecker</strong> ersetzt, ein speziell entwickeltes, Cloud-natives WAL-System. Woodpecker wurde für die Objektspeicherung entwickelt und vereinfacht die Abläufe bei gleichzeitiger Steigerung der Leistung und Skalierbarkeit.</p>
<p>Woodpecker wurde von Grund auf entwickelt, um das Potenzial von Cloud-nativem Speicher zu maximieren. Das Ziel ist, die WAL-Lösung mit dem höchsten Durchsatz zu werden, die für Cloud-Umgebungen optimiert ist, und gleichzeitig die Kernfunktionen zu bieten, die für ein nur anhängendes Write-ahead-Log erforderlich sind.</p>
<h3 id="The-Zero-Disk-Architecture-for-Woodpecker" class="common-anchor-header">Die Zero-Disk-Architektur für Woodpecker</h3><p>Die Kerninnovation von Woodpecker ist seine <strong>Zero-Disk-Architektur</strong>:</p>
<ul>
<li><p>Alle Protokolldaten werden in einem Cloud-Objektspeicher (wie Amazon S3, Google Cloud Storage oder Alibaba OS) gespeichert.</p></li>
<li><p>Metadaten werden über verteilte Key-Value-Stores wie etcd verwaltet</p></li>
<li><p>Keine Abhängigkeiten von lokalen Festplatten für Kernoperationen</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_Woodpecker_Architecture_cc31e15ed9.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Abbildung:  Überblick über die Woodpecker-Architektur</p>
<p>Dieser Ansatz reduziert den betrieblichen Aufwand drastisch und maximiert gleichzeitig die Haltbarkeit und Effizienz der Cloud. Durch die Eliminierung lokaler Festplattenabhängigkeiten passt Woodpecker perfekt zu den Cloud-Native-Prinzipien und reduziert den betrieblichen Aufwand für Systemadministratoren erheblich.</p>
<h3 id="Performance-Benchmarks-Exceeding-Expectations" class="common-anchor-header">Leistungs-Benchmarks: Übertroffene Erwartungen</h3><p>Wir haben umfassende Benchmarks durchgeführt, um die Leistung von Woodpecker in einem Single-Node, Single-Client, Single-Log-Stream Setup zu bewerten. Die Ergebnisse waren im Vergleich zu Kafka und Pulsar beeindruckend:</p>
<table>
<thead>
<tr><th><strong>System</strong></th><th><strong>Kafka</strong></th><th><strong>Pulsar</strong></th><th><strong>WP MinIO</strong></th><th><strong>WP Lokal</strong></th><th><strong>WP S3</strong></th></tr>
</thead>
<tbody>
<tr><td>Durchsatz</td><td>129,96 MB/s</td><td>107 MB/s</td><td>71 MB/s</td><td>450 MB/s</td><td>750 MB/s</td></tr>
<tr><td>Latenzzeit</td><td>58 ms</td><td>35 ms</td><td>184 ms</td><td>1,8 ms</td><td>166 ms</td></tr>
</tbody>
</table>
<p>Zur Veranschaulichung haben wir die theoretischen Durchsatzgrenzen der verschiedenen Speicher-Backends auf unserem Testrechner gemessen:</p>
<ul>
<li><p><strong>MinIO</strong>: ~110 MB/s</p></li>
<li><p><strong>Lokales Dateisystem</strong>: 600-750 MB/s</p></li>
<li><p><strong>Amazon S3 (einzelne EC2-Instanz)</strong>: bis zu 1,1 GB/s</p></li>
</ul>
<p>Bemerkenswerterweise erreichte Woodpecker durchgängig 60-80% des maximal möglichen Durchsatzes für jedes Backend - ein außergewöhnliches Effizienzniveau für Middleware.</p>
<h4 id="Key-Performance-Insights" class="common-anchor-header">Wichtige Einblicke in die Leistung</h4><ol>
<li><p><strong>Lokaler Dateisystem-Modus</strong>: Woodpecker erreichte 450 MB/s - 3,5× schneller als Kafka und 4,2× schneller als Pulsar - bei einer extrem niedrigen Latenz von nur 1,8 ms, was ihn ideal für hochleistungsfähige Single-Node-Implementierungen macht.</p></li>
<li><p><strong>Cloud-Speicher-Modus (S3)</strong>: Beim direkten Schreiben auf S3 erreichte Woodpecker 750 MB/s (ca. 68 % der theoretischen Grenze von S3), 5,8× schneller als Kafka und 7× schneller als Pulsar. Obwohl die Latenzzeit höher ist (166 ms), bietet dieses Setup einen außergewöhnlichen Durchsatz für stapelorientierte Arbeitslasten.</p></li>
<li><p><strong>Objektspeicher-Modus (MinIO)</strong>: Selbst mit MinIO erreichte Woodpecker 71 MB/s - etwa 65 % der Kapazität von MinIO. Diese Leistung ist mit der von Kafka und Pulsar vergleichbar, allerdings bei deutlich geringerem Ressourcenbedarf.</p></li>
</ol>
<p>Woodpecker ist besonders für gleichzeitige Schreibvorgänge mit hohem Volumen optimiert, bei denen die Aufrechterhaltung der Reihenfolge entscheidend ist. Und diese Ergebnisse spiegeln nur die frühen Stadien der Entwicklung wider - es wird erwartet, dass laufende Optimierungen bei der E/A-Zusammenführung, der intelligenten Pufferung und dem Prefetching die Leistung noch näher an die theoretischen Grenzen bringen werden.</p>
<h3 id="Design-Goals" class="common-anchor-header">Design-Ziele</h3><p>Woodpecker adressiert die sich entwickelnden Anforderungen von Echtzeit-Vektorsuch-Workloads durch diese technischen Schlüsselanforderungen:</p>
<ul>
<li><p>Dateningestion mit hohem Durchsatz und dauerhafter Persistenz über Verfügbarkeitszonen hinweg</p></li>
<li><p>Tail-Reads mit geringer Latenz für Echtzeit-Abonnements und Catch-up-Reads mit hohem Durchsatz für die Wiederherstellung bei Ausfällen</p></li>
<li><p>Steckbare Speicher-Backends, einschließlich Cloud-Objektspeicher und Dateisysteme mit NFS-Protokollunterstützung</p></li>
<li><p>Flexible Bereitstellungsoptionen, die sowohl leichtgewichtige Standalone-Konfigurationen als auch groß angelegte Cluster für mandantenfähige Milvus-Bereitstellungen unterstützen</p></li>
</ul>
<h3 id="Architecture-Components" class="common-anchor-header">Komponenten der Architektur</h3><p>Ein Standard-Woodpecker-Einsatz umfasst die folgenden Komponenten.</p>
<ul>
<li><p><strong>Client</strong> - Schnittstellenschicht für die Ausgabe von Lese- und Schreibanfragen</p></li>
<li><p><strong>LogStore</strong> - Verwaltet Hochgeschwindigkeits-Schreibpufferung, asynchrone Uploads in den Speicher und Protokollverdichtung</p></li>
<li><p><strong>Storage Backend</strong> - Unterstützt skalierbare, kostengünstige Speicherdienste wie S3, GCS und Dateisysteme wie EFS</p></li>
<li><p><strong>ETCD</strong> - Speichert Metadaten und koordiniert den Protokollstatus über verteilte Knoten hinweg</p></li>
</ul>
<h3 id="Flexible-Deployments-to-Match-Your-Specific-Needs" class="common-anchor-header">Flexible Bereitstellungen für Ihre spezifischen Anforderungen</h3><p>Woodpecker bietet zwei Bereitstellungsmodi, die Ihren speziellen Anforderungen entsprechen:</p>
<p><strong>MemoryBuffer Mode - Leichtgewichtig und wartungsfrei</strong></p>
<p>Der MemoryBuffer-Modus bietet eine einfache und leichtgewichtige Bereitstellungsoption, bei der Woodpecker eingehende Schreibvorgänge vorübergehend im Speicher puffert und regelmäßig an einen Cloud-Objektspeicherdienst überträgt. Die Metadaten werden mit etcd verwaltet, um Konsistenz und Koordination zu gewährleisten. Dieser Modus eignet sich am besten für stapelintensive Arbeitslasten in kleineren Bereitstellungen oder Produktionsumgebungen, bei denen die Einfachheit Vorrang vor der Leistung hat, insbesondere wenn eine geringe Schreiblatenz nicht entscheidend ist.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_The_memory_Buffer_Mode_3429d693a1.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Abbildung: Der memoryBuffer-Modus</em></p>
<p><strong>QuorumBuffer-Modus - Optimiert für Bereitstellungen mit niedriger Latenz und hoher Ausfallsicherheit</strong></p>
<p>Der QuorumBuffer-Modus wurde für latenzempfindliche, hochfrequente Lese-/Schreib-Workloads entwickelt, die sowohl Echtzeit-Reaktionsfähigkeit als auch hohe Fehlertoleranz erfordern. In diesem Modus fungiert Woodpecker als Hochgeschwindigkeits-Schreibpuffer mit drei Quorum-Schreibvorgängen, die eine starke Konsistenz und hohe Verfügbarkeit gewährleisten.</p>
<p>Ein Schreibvorgang gilt als erfolgreich, wenn er auf mindestens zwei der drei Knoten repliziert wurde, was in der Regel innerhalb eines einstelligen Millisekundenbereichs geschieht. Anschließend werden die Daten asynchron in den Cloud-Objektspeicher übertragen, um eine langfristige Haltbarkeit zu gewährleisten. Diese Architektur minimiert den Knotenzustand, macht große lokale Festplattenvolumina überflüssig und vermeidet komplexe Anti-Entropie-Reparaturen, wie sie in herkömmlichen Quorum-basierten Systemen häufig erforderlich sind.</p>
<p>Das Ergebnis ist eine schlanke, robuste WAL-Schicht, die sich ideal für unternehmenskritische Produktionsumgebungen eignet, in denen Konsistenz, Verfügbarkeit und schnelle Wiederherstellung von entscheidender Bedeutung sind.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_The_Quorum_Buffer_Mode_72573dc666.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Abbildung: Der QuorumBuffer-Modus</em></p>
<h2 id="StreamingService-Built-for-Real-Time-Data-Flow" class="common-anchor-header">StreamingService: Entwickelt für den Datenfluss in Echtzeit<button data-href="#StreamingService-Built-for-Real-Time-Data-Flow" class="anchor-icon" translate="no">
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
    </button></h2><p>Neben Woodpecker führt Milvus 2.6 den <strong>StreamingService</strong>ein <strong>- eine</strong>spezialisierte Komponente, die für die Verwaltung von Protokollen, die Aufnahme von Protokollen und den Bezug von Streaming-Daten entwickelt wurde.</p>
<p>Um zu verstehen, wie unsere neue Architektur funktioniert, ist es wichtig, die Beziehung zwischen diesen beiden Komponenten zu klären:</p>
<ul>
<li><p><strong>Woodpecker</strong> ist die Speicherebene, die die eigentliche Persistenz von Write-Ahead-Protokollen übernimmt und für Haltbarkeit und Zuverlässigkeit sorgt.</p></li>
<li><p><strong>StreamingService</strong> ist die Serviceschicht, die die Protokolloperationen verwaltet und Echtzeitdaten-Streaming-Funktionen bereitstellt.</p></li>
</ul>
<p>Zusammen bilden sie einen vollständigen Ersatz für externe Nachrichtenwarteschlangen. Woodpecker liefert die dauerhafte Speichergrundlage, während StreamingService die High-Level-Funktionalität liefert, mit der Anwendungen direkt interagieren. Durch diese Trennung kann jede Komponente für ihre spezifische Aufgabe optimiert werden und gleichzeitig nahtlos als integriertes System zusammenarbeiten.</p>
<h3 id="Adding-Streaming-Service-to-Milvus-26" class="common-anchor-header">Hinzufügen des Streaming Service zu Milvus 2.6</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_Milvus_2_6_Architecture_Overview_238428c58f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Abbildung: Streaming Service in Milvus 2.6 Architektur hinzugefügt</p>
<p>Der Streaming Service besteht aus drei Kernkomponenten:</p>
<p><strong>Streaming-Koordinator</strong></p>
<ul>
<li><p>Entdeckt verfügbare Streaming Nodes durch Überwachung von Milvus ETCD Sitzungen</p></li>
<li><p>Verwaltet den Status der WALs und sammelt Metriken zur Lastverteilung durch den ManagerService</p></li>
</ul>
<p><strong>Streaming-Klient</strong></p>
<ul>
<li><p>Fragt den AssignmentService ab, um die Verteilung der WAL-Segmente auf die Streaming Nodes zu bestimmen</p></li>
<li><p>Führt Lese-/Schreiboperationen über den HandlerService auf dem entsprechenden Streaming Node durch</p></li>
</ul>
<p><strong>Streaming-Knoten</strong></p>
<ul>
<li><p>Verarbeitet tatsächliche WAL-Operationen und bietet Publish-Subscribe-Fähigkeiten für Echtzeit-Daten-Streaming</p></li>
<li><p>Beinhaltet den <strong>ManagerService</strong> für die WAL-Verwaltung und Leistungsberichte</p></li>
<li><p>Verfügt über den <strong>HandlerService</strong>, der effiziente Publish-Subscribe-Mechanismen für WAL-Einträge implementiert</p></li>
</ul>
<p>Diese Schichtenarchitektur ermöglicht Milvus eine klare Trennung zwischen der Streaming-Funktionalität (Abonnement, Echtzeitverarbeitung) und den eigentlichen Speichermechanismen. Woodpecker kümmert sich um das "Wie" der Protokollspeicherung, während der StreamingService das "Was" und "Wann" der Protokolloperationen verwaltet.</p>
<p>Der StreamingService verbessert die Echtzeitfähigkeiten von Milvus erheblich, indem er eine native Abonnementunterstützung einführt und externe Nachrichtenwarteschlangen überflüssig macht. Er reduziert den Speicherverbrauch durch die Konsolidierung zuvor duplizierter Caches in den Abfrage- und Datenpfaden, senkt die Latenzzeit für stark konsistente Lesevorgänge durch die Beseitigung asynchroner Synchronisationsverzögerungen und verbessert sowohl die Skalierbarkeit als auch die Wiederherstellungsgeschwindigkeit im gesamten System.</p>
<h2 id="Conclusion---Streaming-on-a-Zero-Disk-Architecture" class="common-anchor-header">Schlussfolgerung - Streaming auf einer Zero-Disk-Architektur<button data-href="#Conclusion---Streaming-on-a-Zero-Disk-Architecture" class="anchor-icon" translate="no">
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
    </button></h2><p>Die Verwaltung von Zuständen ist schwierig. Zustandsabhängige Systeme gehen oft zu Lasten von Elastizität und Skalierbarkeit. Die zunehmend akzeptierte Antwort im Cloud-nativen Design ist die Entkopplung von Zustand und Datenverarbeitung, so dass beide unabhängig voneinander skaliert werden können.</p>
<p>Anstatt das Rad neu zu erfinden, delegieren wir die Komplexität der dauerhaften, skalierbaren Speicherung an die erstklassigen Entwicklungsteams, die hinter Diensten wie AWS S3, Google Cloud Storage und MinIO stehen. S3 zeichnet sich durch eine praktisch unbegrenzte Kapazität, eine Haltbarkeit von elf Neunen (99,999999999 %), eine Verfügbarkeit von 99,99 % und eine durchsatzstarke Lese-/Schreibleistung aus.</p>
<p>Aber auch "Zero-Disk"-Architekturen haben ihre Tücken. Objektspeicher haben immer noch mit hohen Schreiblatenzen und Ineffizienzen bei kleinen Dateien zu kämpfen - Einschränkungen, die bei vielen Echtzeit-Workloads ungelöst bleiben.</p>
<p>Für Vektordatenbanken - insbesondere solche, die geschäftskritische RAG-, KI-Agenten- und Sucharbeitslasten mit geringer Latenz unterstützen - sind Echtzeitzugriff und schnelle Schreibvorgänge nicht verhandelbar. Aus diesem Grund haben wir Milvus um Woodpecker und den Streaming Service herum neu aufgebaut. Diese Umstellung vereinfacht das Gesamtsystem (seien wir ehrlich - niemand möchte einen kompletten Pulsar-Stack in einer Vektordatenbank verwalten), sorgt für frischere Daten, verbessert die Kosteneffizienz und beschleunigt die Fehlerbehebung.</p>
<p>Wir glauben, dass Woodpecker mehr als nur eine Milvus-Komponente ist - es kann als grundlegender Baustein für andere Cloud-native Systeme dienen. Im Zuge der Weiterentwicklung von Cloud-Infrastrukturen können uns Innovationen wie S3 Express dem Ideal noch näher bringen: AZ-übergreifende Haltbarkeit mit einer Schreiblatenz im einstelligen Millisekundenbereich.</p>
<h2 id="Getting-Started-with-Milvus-26" class="common-anchor-header">Erste Schritte mit Milvus 2.6<button data-href="#Getting-Started-with-Milvus-26" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.6 ist jetzt verfügbar. Zusätzlich zu Woodpecker werden Dutzende neuer Funktionen und Leistungsoptimierungen eingeführt, wie z. B. Tiered Storage, RabbitQ-Quantisierungsmethode und verbesserte Volltextsuche und Mandantenfähigkeit, die sich direkt mit den dringendsten Herausforderungen der heutigen Vektorsuche befassen: effiziente Skalierung bei kontrollierten Kosten.</p>
<p>Sind Sie bereit, alles zu entdecken, was Milvus bietet? Schauen Sie sich unsere<a href="https://milvus.io/docs/release_notes.md"> Versionshinweise</a> an, lesen Sie die<a href="https://milvus.io/docs"> vollständige Dokumentation</a> oder lesen Sie unsere<a href="https://milvus.io/blog"> Feature-Blogs</a>.</p>
<p>Haben Sie Fragen? Sie können auch gerne unserer <a href="https://discord.com/invite/8uyFbECzPX">Discord-Community</a> beitreten oder ein Problem auf<a href="https://github.com/milvus-io/milvus"> GitHub</a> melden - wir sind hier, um Ihnen zu helfen, das Beste aus Milvus 2.6 zu machen.</p>
