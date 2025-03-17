---
id: what-milvus-version-to-start-with.md
title: Mit welcher Milvus-Version soll ich beginnen?
author: Chris Churilo
date: 2024-02-19T00:00:00.000Z
desc: >-
  Ein umfassender Leitfaden zu den Funktionen und Möglichkeiten der einzelnen
  Milvus-Versionen, um eine fundierte Entscheidung für Ihre Vektorsuchprojekte
  zu treffen.
cover: assets.zilliz.com/which_milvus_to_start_4a4250e314.jpeg
tag: Engineering
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Vector Management
recommend: true
canonicalUrl: 'https://milvus.io/blog/what-milvus-version-to-start-with.md'
---
<custom-h1>Einführung in die Milvus-Versionen</custom-h1><p>Die Auswahl der richtigen Milvus-Version ist für den Erfolg eines jeden Projekts, das die Vektorsuchtechnologie nutzt, von größter Bedeutung. Da es verschiedene Milvus-Versionen gibt, die auf unterschiedliche Anforderungen zugeschnitten sind, ist das Verständnis für die Bedeutung der Auswahl der richtigen Version entscheidend für das Erreichen der gewünschten Ergebnisse.</p>
<p>Die richtige Milvus-Version kann einem Entwickler dabei helfen, schnell zu lernen und Prototypen zu erstellen, die Ressourcennutzung zu optimieren, die Entwicklungsarbeit zu rationalisieren und die Kompatibilität mit der bestehenden Infrastruktur und den Tools sicherzustellen. Letztendlich geht es darum, die Produktivität der Entwickler zu erhalten und die Effizienz, Zuverlässigkeit und Benutzerzufriedenheit zu verbessern.</p>
<h2 id="Available-Milvus-versions" class="common-anchor-header">Verfügbare Milvus-Versionen<button data-href="#Available-Milvus-versions" class="anchor-icon" translate="no">
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
    </button></h2><p>Für Entwickler stehen drei Versionen von Milvus zur Verfügung, die alle Open Source sind. Die drei Versionen sind Milvus Lite, Milvus Standalone und Milvus Cluster, die sich in ihren Funktionen und in der Art und Weise unterscheiden, wie die Benutzer Milvus kurz- und langfristig einsetzen wollen. Schauen wir uns diese also einzeln an.</p>
<h2 id="Milvus-Lite" class="common-anchor-header">Milvus Lite<button data-href="#Milvus-Lite" class="anchor-icon" translate="no">
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
    </button></h2><p>Wie der Name schon sagt, ist Milvus Lite eine leichtgewichtige Version, die sich nahtlos in Google Colab und Jupyter Notebook integrieren lässt. Es ist als einzelne Binärdatei ohne zusätzliche Abhängigkeiten verpackt, so dass es einfach zu installieren und auf Ihrem Rechner auszuführen oder in Python-Anwendungen einzubetten ist. Darüber hinaus enthält Milvus Lite einen CLI-basierten Milvus Standalone-Server, der die Flexibilität bietet, Milvus direkt auf Ihrem Rechner auszuführen. Ob Sie Milvus Lite in Ihren Python-Code einbetten oder als Standalone-Server verwenden, hängt ganz von Ihren Vorlieben und spezifischen Anwendungsanforderungen ab.</p>
<h3 id="Features-and-Capabilities" class="common-anchor-header">Funktionen und Möglichkeiten</h3><p>Milvus Lite enthält alle Kernfunktionen der Milvus-Vektorsuche.</p>
<ul>
<li><p><strong>Suchfähigkeiten</strong>: Unterstützt Top-K-, Bereichs- und hybride Suchen, einschließlich Metadatenfilterung, um verschiedenen Suchanforderungen gerecht zu werden.</p></li>
<li><p><strong>Indexarten und Ähnlichkeitsmetriken</strong>: Bietet Unterstützung für 11 Indextypen und fünf Ähnlichkeitsmetriken und bietet damit Flexibilität und Anpassungsmöglichkeiten für Ihren spezifischen Anwendungsfall.</p></li>
<li><p><strong>Datenverarbeitung</strong>: Ermöglicht Batch- (Apache Parquet, Arrays, JSON) und Stream-Verarbeitung, mit nahtloser Integration durch Konnektoren für Airbyte, Apache Kafka und Apache Spark.</p></li>
<li><p><strong>CRUD-Operationen</strong>: Bietet vollständige CRUD-Unterstützung (Erstellen, Lesen, Aktualisieren/Uploaden, Löschen) und ermöglicht den Benutzern umfassende Datenverwaltungsfunktionen.</p></li>
</ul>
<h3 id="Applications-and-limitations" class="common-anchor-header">Anwendungen und Einschränkungen</h3><p>Milvus Lite ist ideal für Rapid Prototyping und lokale Entwicklung und bietet Unterstützung für die schnelle Einrichtung und das Experimentieren mit kleinen Datensätzen auf Ihrem Rechner. Die Grenzen von Milvus Lite werden jedoch beim Übergang zu Produktionsumgebungen mit größeren Datensätzen und anspruchsvolleren Infrastrukturanforderungen deutlich. Daher ist Milvus Lite zwar ein hervorragendes Tool für die erste Erkundung und das Testen, eignet sich aber möglicherweise nicht für den Einsatz von Anwendungen in großen Mengen oder in produktionsreifen Umgebungen.</p>
<h3 id="Available-Resources" class="common-anchor-header">Verfügbare Ressourcen</h3><ul>
<li><p><a href="https://milvus.io/docs/milvus_lite.md">Dokumentation</a></p></li>
<li><p><a href="https://github.com/milvus-io/milvus-lite/">Github-Repository</a></p></li>
<li><p><a href="https://github.com/milvus-io/milvus-lite/tree/main/examples">Google Colab Beispiel</a></p></li>
<li><p><a href="https://www.youtube.com/watch?v=IgJdrGiB5ZY">Video über erste Schritte</a></p></li>
</ul>
<h2 id="Milvus-Standalone" class="common-anchor-header">Milvus Eigenständig<button data-href="#Milvus-Standalone" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus bietet zwei Betriebsmodi: Einzelplatz und Cluster. Beide Modi sind in den Kernfunktionen der Vektordatenbank identisch und unterscheiden sich in der Unterstützung der Datengröße und den Anforderungen an die Skalierbarkeit. Diese Unterscheidung ermöglicht es Ihnen, den Modus zu wählen, der am besten mit der Größe Ihres Datensatzes, dem Verkehrsvolumen und anderen Infrastrukturanforderungen für die Produktion übereinstimmt.</p>
<p>Milvus Standalone ist ein Betriebsmodus für das Milvus-Vektordatenbanksystem, in dem es unabhängig als einzelne Instanz ohne Clustering oder verteiltes Setup arbeitet. Milvus läuft in diesem Modus auf einem einzigen Server oder Rechner und bietet Funktionen wie die Indizierung und Suche nach Vektoren. Es eignet sich für Situationen, in denen das Daten- und Verkehrsaufkommen relativ gering ist und nicht die verteilten Möglichkeiten eines Clusters benötigt werden.</p>
<h3 id="Features-and-Capabilities" class="common-anchor-header">Merkmale und Fähigkeiten</h3><ul>
<li><p><strong>Hohe Leistung</strong>: Führen Sie Vektorsuchen in riesigen Datensätzen (Milliarden oder mehr) mit außergewöhnlicher Geschwindigkeit und Effizienz durch.</p></li>
<li><p><strong>Suchfähigkeiten</strong>: Unterstützt Top-K-, Bereichs- und hybride Suchen, einschließlich Metadatenfilterung, um verschiedenen Suchanforderungen gerecht zu werden.</p></li>
<li><p><strong>Indexarten und Ähnlichkeitsmetriken</strong>: Bietet Unterstützung für 11 Indextypen und 5 Ähnlichkeitsmetriken und bietet damit Flexibilität und Anpassungsmöglichkeiten für Ihren spezifischen Anwendungsfall.</p></li>
<li><p><strong>Datenverarbeitung</strong>: Ermöglicht sowohl Batch- (Apache Parquet, Arrays, Json) als auch Stream-Verarbeitung, mit nahtloser Integration durch Konnektoren für Airbyte, Apache Kafka und Apache Spark.</p></li>
<li><p><strong>Skalierbarkeit</strong>: Erreichen Sie eine dynamische Skalierbarkeit mit Skalierung auf Komponentenebene, die eine nahtlose Skalierung nach oben und unten je nach Bedarf ermöglicht. Milvus kann auf Komponentenebene automatisch skalieren und so die Ressourcenzuweisung für eine verbesserte Effizienz optimieren.</p></li>
<li><p><strong>Multi-Mandantenfähigkeit</strong>: Unterstützt Multi-Tenancy mit der Möglichkeit, bis zu 10.000 Sammlungen/Partitionen in einem Cluster zu verwalten, was eine effiziente Ressourcennutzung und Isolierung für verschiedene Benutzer oder Anwendungen ermöglicht.</p></li>
<li><p><strong>CRUD-Vorgänge</strong>: Bietet vollständige CRUD-Unterstützung (Erstellen, Lesen, Aktualisieren/Uploaden, Löschen) und ermöglicht den Benutzern umfassende Datenverwaltungsfunktionen.</p></li>
</ul>
<h3 id="Essential-components" class="common-anchor-header">Wesentliche Komponenten:</h3><ul>
<li><p>Milvus: Die funktionale Kernkomponente.</p></li>
<li><p>etcd: Die Metadaten-Engine, die für den Zugriff auf und die Speicherung von Metadaten aus den internen Komponenten von Milvus verantwortlich ist, einschließlich Proxys, Indexknoten und mehr.</p></li>
<li><p>MinIO: Die Speicher-Engine, die für die Datenpersistenz innerhalb von Milvus verantwortlich ist.</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Screenshot_2024_02_19_at_4_16_41_PM_5e635586a7.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Abbildung 1: Eigenständige Milvus-Architektur</p>
<h3 id="Available-Resources" class="common-anchor-header">Verfügbare Ressourcen</h3><ul>
<li><p>Dokumentation</p>
<ul>
<li><p><a href="https://milvus.io/docs/prerequisite-docker.md">Umgebungs-Checkliste für Milvus mit Docker Compose</a></p></li>
<li><p><a href="https://milvus.io/docs/install_standalone-docker.md">Installieren Sie Milvus Standalone mit Docker</a></p></li>
</ul></li>
<li><p><a href="https://github.com/milvus-io/milvus">Github-Repository</a></p></li>
</ul>
<h2 id="Milvus-Cluster" class="common-anchor-header">Milvus-Cluster<button data-href="#Milvus-Cluster" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus Cluster ist ein Betriebsmodus für das Vektordatenbanksystem Milvus, in dem es über mehrere Knoten oder Server verteilt betrieben wird. In diesem Modus werden Milvus-Instanzen zu einem einheitlichen System geclustert, das im Vergleich zu einem Standalone-Setup größere Datenmengen und höhere Verkehrslasten bewältigen kann. Milvus Cluster bietet Skalierbarkeit, Fehlertoleranz und Lastausgleichsfunktionen, so dass es sich für Szenarien eignet, in denen große Datenmengen verarbeitet und viele gleichzeitige Abfragen effizient bedient werden müssen.</p>
<h3 id="Features-and-Capabilities" class="common-anchor-header">Funktionen und Möglichkeiten</h3><ul>
<li><p>Übernimmt alle in Milvus Standalone verfügbaren Funktionen, einschließlich hochleistungsfähiger Vektorsuche, Unterstützung für mehrere Indexarten und Ähnlichkeitsmetriken sowie nahtlose Integration mit Batch- und Stream-Processing-Frameworks.</p></li>
<li><p>Bietet unvergleichliche Verfügbarkeit, Leistung und Kostenoptimierung durch die Nutzung von verteiltem Rechnen und Lastausgleich über mehrere Knoten.</p></li>
<li><p>Ermöglicht die Bereitstellung und Skalierung sicherer, unternehmensgerechter Workloads bei geringeren Gesamtkosten durch die effiziente Nutzung von Ressourcen im gesamten Cluster und die Optimierung der Ressourcenzuweisung auf der Grundlage der Workload-Anforderungen.</p></li>
</ul>
<h3 id="Essential-components" class="common-anchor-header">Wesentliche Komponenten:</h3><p>Milvus Cluster umfasst acht Microservice-Komponenten und drei Abhängigkeiten von Drittanbietern. Alle Microservices können unabhängig voneinander auf Kubernetes bereitgestellt werden.</p>
<h4 id="Microservice-components" class="common-anchor-header">Microservice-Komponenten</h4><ul>
<li><p>Root-Koordinator</p></li>
<li><p>Proxy</p></li>
<li><p>Abfrage-Koordinate</p></li>
<li><p>Abfrage-Knoten</p></li>
<li><p>Index-Koordinate</p></li>
<li><p>Index-Knoten</p></li>
<li><p>Daten-Koordinate</p></li>
<li><p>Daten-Knoten</p></li>
</ul>
<h4 id="Third-party-dependencies" class="common-anchor-header">Abhängigkeiten von Drittanbietern</h4><ul>
<li><p>etcd: Speichert Metadaten für verschiedene Komponenten des Clusters.</p></li>
<li><p>MinIO: Verantwortlich für die Datenpersistenz großer Dateien im Cluster, z. B. Index- und binäre Protokolldateien.</p></li>
<li><p>Pulsar: Verwaltet Protokolle der letzten Mutationsoperationen, gibt Streaming-Protokolle aus und bietet Protokollveröffentlichungs- und -abonnementdienste.</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Screenshot_2024_02_19_at_4_18_01_PM_88971280ed.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Abbildung 2: Milvus-Cluster-Architektur</p>
<h4 id="Available-Resources" class="common-anchor-header">Verfügbare Ressourcen</h4><ul>
<li><p><a href="https://milvus.io/docs/install_cluster-milvusoperator.md">Dokumentation</a> | Anleitungen zum Einstieg</p>
<ul>
<li><p><a href="https://milvus.io/docs/install_cluster-milvusoperator.md">Installieren Sie Milvus Cluster mit Milvus Operator</a></p></li>
<li><p><a href="https://milvus.io/docs/install_cluster-helm.md">Installieren von Milvus Cluster mit Helm</a></p></li>
<li><p><a href="https://milvus.io/docs/scaleout.md">Skalierung eines Milvus-Clusters</a></p></li>
</ul></li>
<li><p><a href="https://github.com/milvus-io/milvus">Github-Repository</a></p></li>
</ul>
<h2 id="Making-the-Decision-on-which-Milvus-version-to-use" class="common-anchor-header">Die Entscheidung, welche Milvus-Version verwendet werden soll<button data-href="#Making-the-Decision-on-which-Milvus-version-to-use" class="anchor-icon" translate="no">
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
    </button></h2><p>Bei der Entscheidung, welche Milvus-Version für Ihr Projekt verwendet werden soll, müssen Sie Faktoren wie die Größe Ihres Datensatzes, das Verkehrsaufkommen, die Anforderungen an die Skalierbarkeit und die Beschränkungen der Produktionsumgebung berücksichtigen. Milvus Lite eignet sich perfekt für das Prototyping auf Ihrem Laptop. Milvus Standalone bietet eine hohe Leistung und Flexibilität bei der Durchführung von Vektorsuchen in Ihren Datensätzen und eignet sich daher für kleinere Bereitstellungen, CI/CD und Offline-Bereitstellungen, wenn Sie keine Kubernetes-Unterstützung haben... Und schließlich bietet Milvus Cluster eine beispiellose Verfügbarkeit, Skalierbarkeit und Kostenoptimierung für Workloads der Enterprise-Klasse und ist daher die bevorzugte Wahl für große, hochverfügbare Produktionsumgebungen.</p>
<p>Es gibt noch eine weitere Version, die eine problemlose Version ist, und das ist eine verwaltete Version von Milvus namens <a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a>.</p>
<p>Letztendlich hängt die Wahl der Milvus-Version von Ihrem spezifischen Anwendungsfall, Ihren Infrastrukturanforderungen und Ihren langfristigen Zielen ab. Wenn Sie diese Faktoren sorgfältig bewerten und die Funktionen und Möglichkeiten der einzelnen Versionen verstehen, können Sie eine fundierte Entscheidung treffen, die den Anforderungen und Zielen Ihres Projekts entspricht. Unabhängig davon, ob Sie sich für Milvus Standalone oder Milvus Cluster entscheiden, können Sie die Leistungsfähigkeit von Vektordatenbanken nutzen, um die Leistung und Effizienz Ihrer KI-Anwendungen zu verbessern.</p>
