---
id: how-to-safely-upgrade-from-milvu-2-5-x-to-milvus-2-6-x.md
title: Wie man sicher von Milvus 2.5.x auf Milvus 2.6.x aktualisiert
author: Yiqing Lu
date: 2025-12-25T00:00:00.000Z
cover: assets.zilliz.com/Milvus_2_5_x_to_Milvus_2_6_x_cd2a5397fc.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus, vector databases, Milvus 2.6 features, Nvidia Cagra, full text search'
meta_title: |
  How to Safely Upgrade from Milvus 2.5.x to Milvus 2.6.x
desc: >-
  Informieren Sie sich über die Neuerungen in Milvus 2.6, einschließlich der
  Änderungen an der Architektur und der wichtigsten Funktionen, und erfahren
  Sie, wie Sie ein Rolling Upgrade von Milvus 2.5 durchführen.
origin: >-
  https://milvus.io/blog/how-to-safely-upgrade-from-milvu-2-5-x-to-milvus-2-6-x.md
---
<p><a href="https://milvus.io/docs/release_notes.md"><strong>Milvus 2.6</strong></a> ist seit einiger Zeit live und erweist sich als ein solider Schritt nach vorne für das Projekt. Die Version bringt eine verfeinerte Architektur, eine bessere Echtzeitleistung, einen geringeren Ressourcenverbrauch und ein intelligenteres Skalierungsverhalten in Produktionsumgebungen. Viele dieser Verbesserungen wurden direkt durch das Feedback der Benutzer beeinflusst, und frühe Anwender von 2.6.x haben bereits von einer spürbar schnelleren Suche und einer besser vorhersehbaren Systemleistung bei hoher oder dynamischer Arbeitslast berichtet.</p>
<p>Für Teams, die Milvus 2.5.x einsetzen und einen Umstieg auf 2.6.x in Erwägung ziehen, ist dieser Leitfaden ein guter Startpunkt. Er schlüsselt die architektonischen Unterschiede auf, hebt die in Milvus 2.6 eingeführten Schlüsselfunktionen hervor und bietet einen praktischen, schrittweisen Upgrade-Pfad, der darauf ausgelegt ist, die Betriebsunterbrechung zu minimieren.</p>
<p>Wenn Ihre Arbeitslasten Echtzeit-Pipelines, multimodale oder hybride Suchvorgänge oder groß angelegte Vektoroperationen umfassen, hilft Ihnen dieser Blog bei der Einschätzung, ob 2.6 Ihren Anforderungen entspricht, und wenn Sie sich für ein Upgrade entscheiden, können Sie dieses mit Zuversicht durchführen, während die Datenintegrität und Serviceverfügbarkeit erhalten bleibt.</p>
<h2 id="Architecture-Changes-from-Milvus-25-to-Milvus-26" class="common-anchor-header">Architekturänderungen von Milvus 2.5 zu Milvus 2.6<button data-href="#Architecture-Changes-from-Milvus-25-to-Milvus-26" class="anchor-icon" translate="no">
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
    </button></h2><p>Bevor wir uns mit dem eigentlichen Upgrade-Workflow befassen, sollten wir zunächst verstehen, wie sich die Milvus-Architektur in Milvus 2.6 ändert.</p>
<h3 id="Milvus-25-Architecture" class="common-anchor-header">Milvus 2.5 Architektur</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Milvus_Architecture_2_5_4e228af3c4.PNG" alt="Milvus 2.5 Architecture" class="doc-image" id="milvus-2.5-architecture" />
   </span> <span class="img-wrapper"> <span>Milvus 2.5 Architektur</span> </span></p>
<p>In Milvus 2.5 waren Streaming- und Batch-Workflows über mehrere Worker Nodes hinweg miteinander verflochten:</p>
<ul>
<li><p><strong>QueryNode</strong> bearbeitete sowohl historische Abfragen <em>als auch</em> inkrementelle (Streaming) Abfragen.</p></li>
<li><p><strong>DataNode</strong> wickelte sowohl das Ingest-Time-Flushing <em>als auch die</em> Hintergrundverdichtung von historischen Daten ab.</p></li>
</ul>
<p>Diese Vermischung von Batch- und Echtzeitlogik erschwerte die unabhängige Skalierung von Batch-Workloads. Außerdem war der Streaming-Status über mehrere Komponenten verstreut, was zu Synchronisationsverzögerungen führte, die Wiederherstellung nach einem Ausfall erschwerte und die Komplexität des Betriebs erhöhte.</p>
<h3 id="Milvus-26-Architecture" class="common-anchor-header">Milvus 2.6 Architektur</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Milvus_Architecture_2_6_ee6f1f0635.PNG" alt="Milvus 2.6 Architecture" class="doc-image" id="milvus-2.6-architecture" />
   </span> <span class="img-wrapper"> <span>Die Architektur von Milvus 2.6</span> </span></p>
<p>Milvus 2.6 führt einen dedizierten <strong>StreamingNode</strong> ein, der für alle Echtzeitdaten zuständig ist: Konsumieren der Nachrichtenwarteschlange, Schreiben inkrementeller Segmente, Bedienen inkrementeller Abfragen und Verwalten der WAL-basierten Wiederherstellung. Durch die Isolierung des Streaming übernehmen die übrigen Komponenten klarere, gezieltere Rollen:</p>
<ul>
<li><p><strong>QueryNode</strong> verarbeitet jetzt <em>nur</em> noch Batch-Abfragen auf historischen Segmenten.</p></li>
<li><p><strong>DataNode</strong> übernimmt <em>nur</em> noch Aufgaben für historische Daten wie Verdichtung und Indexaufbau.</p></li>
</ul>
<p>Der StreamingNode übernimmt alle Streaming-bezogenen Aufgaben, die in Milvus 2.5 zwischen DataNode, QueryNode und sogar dem Proxy aufgeteilt waren, und sorgt so für mehr Klarheit und eine Reduzierung der rollenübergreifenden Zustandsaufteilung.</p>
<h3 id="Milvus-25x-vs-Milvus-26x-Component-by-Component-Comparison" class="common-anchor-header">Milvus 2.5.x gegenüber Milvus 2.6.x: Vergleich der einzelnen Komponenten</h3><table>
<thead>
<tr><th></th><th style="text-align:center"><strong>Milvus 2.5.x</strong></th><th style="text-align:center"><strong>Milvus 2.6.x</strong></th><th style="text-align:center"><strong>Was hat sich geändert?</strong></th></tr>
</thead>
<tbody>
<tr><td>Koordinator-Dienste</td><td style="text-align:center">RootCoord / QueryCoord / DataCoord (oder MixCoord)</td><td style="text-align:center">MixCoord</td><td style="text-align:center">Metadatenmanagement und Aufgabenplanung sind in einem einzigen MixCoord zusammengefasst, was die Koordinationslogik vereinfacht und die verteilte Komplexität reduziert.</td></tr>
<tr><td>Zugriffsschicht</td><td style="text-align:center">Proxy</td><td style="text-align:center">Proxy</td><td style="text-align:center">Schreibanfragen werden nur über den Streaming Node zur Datenaufnahme geleitet.</td></tr>
<tr><td>Worker-Knoten</td><td style="text-align:center">-</td><td style="text-align:center">Streaming-Knoten</td><td style="text-align:center">Dedizierter Streaming-Verarbeitungsknoten, der für die gesamte inkrementelle (wachsende Segmente) Logik zuständig ist, einschließlich:- Inkrementelle Datenaufnahme- Inkrementelle Datenabfrage- Persistieren inkrementeller Daten im Objektspeicher- Stream-basierte Schreibvorgänge- Fehlerbehebung auf der Grundlage von WAL</td></tr>
<tr><td></td><td style="text-align:center">Abfrageknoten</td><td style="text-align:center">Abfrageknoten</td><td style="text-align:center">Stapelverarbeitungsknoten, der nur Abfragen über historische Daten verarbeitet.</td></tr>
<tr><td></td><td style="text-align:center">Datenknoten</td><td style="text-align:center">Datenknoten</td><td style="text-align:center">Stapelverarbeitungsknoten, der nur für historische Daten zuständig ist, einschließlich Verdichtung und Indexaufbau.</td></tr>
<tr><td></td><td style="text-align:center">Index-Knoten</td><td style="text-align:center">-</td><td style="text-align:center">Der Indexknoten wird mit dem Datenknoten verschmolzen, wodurch die Rollendefinitionen und die Bereitstellungstopologie vereinfacht werden.</td></tr>
</tbody>
</table>
<p>Kurz gesagt, Milvus 2.6 zieht eine klare Linie zwischen Streaming- und Batch-Workloads, beseitigt die komponentenübergreifende Verflechtung, die in 2.5 zu sehen war, und schafft eine skalierbarere, wartbare Architektur.</p>
<h2 id="Milvus-26-Feature-Highlights" class="common-anchor-header">Milvus 2.6 Funktions-Highlights<button data-href="#Milvus-26-Feature-Highlights" class="anchor-icon" translate="no">
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
    </button></h2><p>Bevor wir uns mit dem Upgrade-Workflow befassen, werfen wir einen kurzen Blick auf die Neuerungen von Milvus 2.6. <strong>Diese Version konzentriert sich auf die Senkung der Infrastrukturkosten, die Verbesserung der Suchleistung und die einfachere Skalierung großer, dynamischer KI-Workloads.</strong></p>
<h3 id="Cost--Efficiency-Improvements" class="common-anchor-header">Kosten- und Effizienzverbesserungen</h3><ul>
<li><p><strong>RaBitQ-Quantisierung für Primärindizes</strong> - Eine neue 1-Bit-Quantisierungsmethode, die Vektorindizes auf <strong>1/32</strong> ihrer ursprünglichen Größe komprimiert. In Kombination mit dem SQ8-Reranking wird die Speichernutzung auf ~28 % reduziert, die QPS um das Vierfache erhöht und eine Wiederauffindbarkeit von ~95 % beibehalten, wodurch die Hardwarekosten erheblich gesenkt werden.</p></li>
<li><p><a href="https://milvus.io/docs/full-text-search.md#BM25-implementation"><strong>BM25-optimierte</strong></a><strong> Volltextsuche</strong> - Native BM25-Bewertung mit spärlichen Term-Gewichts-Vektoren. Die Stichwortsuche läuft im Vergleich zu Elasticsearch <strong>3-4x schneller</strong> (bei einigen Datensätzen bis zu <strong>7x</strong> ), während die Indexgröße auf etwa ein Drittel der ursprünglichen Textdaten beschränkt bleibt.</p></li>
<li><p><strong>JSON Path Indexing mit JSON Shredding</strong> - Strukturiertes Filtern von verschachteltem JSON ist jetzt deutlich schneller und viel vorhersehbarer. Vorindizierte JSON-Pfade verkürzen die Filterlatenz von <strong>140 ms → 1,5 ms</strong> (P99: <strong>480 ms → 10 ms</strong>) und machen die hybride Vektorsuche + Metadatenfilterung deutlich reaktionsschneller.</p></li>
<li><p><strong>Erweiterte Datentypunterstützung</strong> - Hinzufügen von Int8-Vektortypen, <a href="https://milvus.io/docs/geometry-field.md#Geometry-Field">Geometriefeldern</a> (POINT / LINESTRING / POLYGON) und Array-of-Structs. Diese Erweiterungen unterstützen Geodaten-Workloads, umfassendere Metadatenmodellierung und sauberere Schemata.</p></li>
<li><p><strong>Upsert für partielle Aktualisierungen</strong> - Sie können jetzt Entitäten mit einem einzigen Primärschlüsselaufruf einfügen oder aktualisieren. Bei partiellen Aktualisierungen werden nur die bereitgestellten Felder geändert, wodurch der Schreibaufwand reduziert und Pipelines vereinfacht werden, die häufig Metadaten oder Einbettungen aktualisieren.</p></li>
</ul>
<h3 id="Search-and-Retrieval-Enhancements" class="common-anchor-header">Verbesserungen bei Suche und Retrieval</h3><ul>
<li><p><strong>Verbesserte Textverarbeitung und mehrsprachige Unterstützung:</strong> Neue Lindera- und ICU-Tokenizer verbessern die Verarbeitung von japanischem, koreanischem und <a href="https://milvus.io/docs/multi-language-analyzers.md#Multi-language-Analyzers">mehrsprachigem</a> Text. Jieba unterstützt jetzt benutzerdefinierte Wörterbücher. <code translate="no">run_analyzer</code> hilft beim Debuggen des Tokenisierungsverhaltens, und mehrsprachige Analysatoren gewährleisten eine konsistente sprachenübergreifende Suche.</p></li>
<li><p><strong>Hochpräzises Text Matching:</strong> <a href="https://milvus.io/docs/phrase-match.md#Phrase-Match">Phrase Match</a> erzwingt geordnete Phrasenabfragen mit konfigurierbarem Slop. Der neue <a href="https://milvus.io/docs/ngram.md#NGRAM">NGRAM-Index</a> beschleunigt Teilstring- und <code translate="no">LIKE</code> -Abfragen sowohl für VARCHAR-Felder als auch für JSON-Pfade und ermöglicht schnelle Teiltext- und Fuzzy-Abgleiche.</p></li>
<li><p><strong>Zeit- und Metadaten-bewusstes Reranking:</strong> <a href="https://milvus.io/docs/decay-ranker-overview.md">Decay Rankers</a> (exponentiell, linear, Gauß) passen die Punktzahlen anhand von Zeitstempeln an; <a href="https://milvus.io/docs/boost-ranker.md#Boost-Ranker">Boost Rankers</a> wenden metadatengesteuerte Regeln an, um Ergebnisse auf- oder abzuwerten. Beide helfen bei der Feinabstimmung des Abrufverhaltens, ohne die zugrunde liegenden Daten zu verändern.</p></li>
<li><p><strong>Vereinfachte Modellintegration und Auto-Vektorisierung:</strong> Integrierte Integrationen mit OpenAI, Hugging Face und anderen Einbettungsanbietern ermöglichen Milvus die automatische Vektorisierung von Text bei Einfüge- und Abfragevorgängen. Keine manuellen Einbettungspipelines mehr für gängige Anwendungsfälle.</p></li>
<li><p><strong>Online-Schema-Updates für skalare Felder:</strong> Fügen Sie neue skalare Felder zu bestehenden Sammlungen hinzu, ohne Ausfallzeiten oder Neuladen, und vereinfachen Sie so die Schemaentwicklung bei wachsenden Metadatenanforderungen.</p></li>
<li><p><strong>Fast-Duplikat-Erkennung mit MinHash:</strong> <a href="https://milvus.io/docs/minhash-lsh.md#MINHASHLSH">MinHash</a> + LSH ermöglicht eine effiziente Erkennung von Beinahe-Duplikaten in großen Datenbeständen ohne teure exakte Vergleiche.</p></li>
</ul>
<h3 id="Architecture-and-Scalability-Upgrades" class="common-anchor-header">Architektur- und Skalierbarkeits-Upgrades</h3><ul>
<li><p><a href="https://milvus.io/docs/tiered-storage-overview.md#Tiered-Storage-Overview"><strong>Tiered Storage</strong></a> <strong>für Hot-Cold Data Management:</strong> Trennt heiße und kalte Daten über SSD- und Objektspeicher hinweg; unterstützt träges und teilweises Laden; eliminiert die Notwendigkeit, Sammlungen vollständig lokal zu laden; reduziert die Ressourcennutzung um bis zu 50 % und beschleunigt die Ladezeiten für große Datensätze.</p></li>
<li><p><strong>Echtzeit-Streaming-Dienst:</strong> Fügt dedizierte Streaming-Knoten hinzu, die mit Kafka/Pulsar für kontinuierliche Ingestion integriert sind; ermöglicht sofortige Indizierung und Abfrageverfügbarkeit; verbessert den Schreibdurchsatz und beschleunigt die Fehlerbehebung für schnell wechselnde Echtzeit-Workloads.</p></li>
<li><p><strong>Verbesserte Skalierbarkeit und Stabilität:</strong> Milvus unterstützt jetzt mehr als 100.000 Sammlungen für große mandantenfähige Umgebungen. Infrastruktur-Upgrades - <a href="https://milvus.io/docs/woodpecker_architecture.md#Woodpecker">Woodpecker</a> (Zero-Disk WAL), <a href="https://milvus.io/docs/roadmap.md#%F0%9F%94%B9-HotCold-Tiering--Storage-Architecture-StorageV2">Storage v2</a> (reduzierte IOPS/Speicher) und der <a href="https://milvus.io/docs/release_notes.md#Coordinator-Merge-into-MixCoord">Coordinator Merge</a> - verbessern die Stabilität des Clusters und ermöglichen eine vorhersehbare Skalierung bei hohen Arbeitslasten.</p></li>
</ul>
<p>Eine vollständige Liste der Funktionen von Milvus 2.6 finden Sie in den <a href="https://milvus.io/docs/release_notes.md">Milvus-Versionshinweisen</a>.</p>
<h2 id="How-to-Upgrade-from-Milvus-25x-to-Milvus-26x" class="common-anchor-header">Wie man von Milvus 2.5.x auf Milvus 2.6.x umsteigt<button data-href="#How-to-Upgrade-from-Milvus-25x-to-Milvus-26x" class="anchor-icon" translate="no">
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
    </button></h2><p>Um das System während des Upgrades so verfügbar wie möglich zu halten, sollten Milvus 2.5-Cluster in der folgenden Reihenfolge auf Milvus 2.6 upgegradet werden.</p>
<p><strong>1. Starten Sie zuerst den Streaming Node</strong></p>
<p>Starten Sie den Streaming Node im Voraus. Der neue <strong>Delegator</strong> (die Komponente im Query Node, die für die Verarbeitung von Streaming-Daten zuständig ist) muss zum Milvus 2.6 Streaming Node verschoben werden.</p>
<p><strong>2. MixCoord aktualisieren</strong></p>
<p>Aktualisieren Sie die Koordinator-Komponenten auf <strong>MixCoord</strong>. Während dieses Schritts muss MixCoord die Versionen der Worker Nodes erkennen, um die Kompatibilität der verschiedenen Versionen innerhalb des verteilten Systems zu gewährleisten.</p>
<p><strong>3. Upgrade des Abfrageknotens</strong></p>
<p>Upgrades von Query Nodes dauern normalerweise länger. Während dieser Phase können Milvus 2.5 Data Nodes und Index Nodes weiterhin Operationen wie Flush und Indexaufbau durchführen und so den Druck auf der Abfrageseite reduzieren, während die Query Nodes aufgerüstet werden.</p>
<p><strong>4. Upgrade des Datenknotens</strong></p>
<p>Sobald Milvus 2.5 DataNodes offline genommen werden, sind Flush-Operationen nicht mehr verfügbar, und Daten in Growing Segments können sich weiterhin ansammeln, bis alle Nodes vollständig auf Milvus 2.6 aktualisiert sind.</p>
<p><strong>5. Upgrade des Proxys</strong></p>
<p>Nach dem Upgrade eines Proxys auf Milvus 2.6 sind Schreiboperationen auf diesem Proxy so lange nicht verfügbar, bis alle Clusterkomponenten auf 2.6 aktualisiert sind.</p>
<p><strong>6. Entfernen Sie den Index-Knoten</strong></p>
<p>Sobald alle anderen Komponenten aufgerüstet sind, kann der eigenständige Index-Knoten sicher entfernt werden.</p>
<p><strong>Hinweise:</strong></p>
<ul>
<li><p>Ab dem Abschluss des DataNode-Upgrades bis zum Abschluss des Proxy-Upgrades sind Flush-Vorgänge nicht mehr verfügbar.</p></li>
<li><p>Ab dem Zeitpunkt des Upgrades des ersten Proxys bis zum Abschluss des Upgrades aller Proxy-Knoten sind einige Schreiboperationen nicht verfügbar.</p></li>
<li><p><strong>Bei einem direkten Upgrade von Milvus 2.5.x auf 2.6.6 sind DDL-Operationen (Data Definition Language) während des Upgrade-Prozesses aufgrund von Änderungen im DDL-Framework nicht verfügbar.</strong></p></li>
</ul>
<h2 id="How-to-Upgrade-to-Milvus-26-with-Milvus-Operator" class="common-anchor-header">Upgrade auf Milvus 2.6 mit Milvus Operator<button data-href="#How-to-Upgrade-to-Milvus-26-with-Milvus-Operator" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://github.com/zilliztech/milvus-operator">Milvus Operator</a> ist ein Open-Source-Kubernetes-Operator, der eine skalierbare, hochverfügbare Möglichkeit zur Bereitstellung, Verwaltung und Aktualisierung des gesamten Milvus-Service-Stacks auf einem Kubernetes-Zielcluster bietet. Der vom Operator verwaltete Milvus-Service-Stack umfasst:</p>
<ul>
<li><p>Kernkomponenten von Milvus</p></li>
<li><p>Erforderliche Abhängigkeiten wie etcd, Pulsar und MinIO</p></li>
</ul>
<p>Milvus Operator folgt dem Standard-Kubernetes-Operator-Muster. Er führt eine benutzerdefinierte Milvus-Ressource (CR) ein, die den gewünschten Zustand eines Milvus-Clusters beschreibt, z. B. seine Version, Topologie und Konfiguration.</p>
<p>Ein Controller überwacht den Cluster kontinuierlich und gleicht den Ist-Zustand mit dem in der CR definierten Soll-Zustand ab. Wenn Änderungen vorgenommen werden, z. B. ein Upgrade der Milvus-Version, wendet der Operator diese automatisch auf kontrollierte und wiederholbare Weise an und ermöglicht so automatisierte Upgrades und ein fortlaufendes Lifecycle-Management.</p>
<h3 id="Milvus-Custom-Resource-CR-Example" class="common-anchor-header">Beispiel für eine benutzerdefinierte Milvus-Ressource (CR)</h3><pre><code translate="no">apiVersion: milvus.io/v1beta1
kind: Milvus
metadata:
  name: my-milvus-mansion    
  namespace: dev       
spec:
  mode: cluster                  <span class="hljs-comment"># cluster or standalone</span>
  <span class="hljs-comment"># Milvus Components</span>
  components:
    image: milvusdb/milvus:v2.6.5
    imageUpdateMode: rollingUpgrade 
    proxy:                   
      replicas: 1          
    mixCoord:              
      replicas: 1           
    dataNode:               
      replicas: 1          
    queryNode:              
      replicas: 2           
      resources:
        requests:
          cpu: <span class="hljs-string">&quot;2&quot;</span>
          memory: <span class="hljs-string">&quot;8Gi&quot;</span>  
  <span class="hljs-comment"># Dependencies, including etcd, storage and message stream</span>
  dependencies:
    etcd:                   
      inCluster:
        values:
          replicaCount: 3    
    storage:                 
      <span class="hljs-built_in">type</span>: MinIO
      inCluster:
        values:
          mode: distributed     
    msgStreamType: pulsar    
    pulsar:
      inCluster:
        values:
          bookkeeper:
            replicas: 3   
  <span class="hljs-comment"># Milvus configs</span>
  config:
    dataCoord:
      enableActiveStandby: <span class="hljs-literal">true</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Rolling-Upgrades-from-Milvus-25-to-26-with-Milvus-Operator" class="common-anchor-header">Rolling Upgrades von Milvus 2.5 auf 2.6 mit Milvus Operator</h3><p>Milvus Operator bietet integrierte Unterstützung für <strong>Rolling Upgrades von Milvus 2.5 auf 2.6</strong> im Clustermodus und passt sein Verhalten an die in 2.6 eingeführten architektonischen Änderungen an.</p>
<p><strong>1. Erkennung von Upgrade-Szenarien</strong></p>
<p>Während eines Upgrades bestimmt Milvus Operator die Zielversion von Milvus anhand der Clusterspezifikation. Dies geschieht entweder durch:</p>
<ul>
<li><p>Untersuchung des in <code translate="no">spec.components.image</code> definierten Image-Tags, oder</p></li>
<li><p>Lesen der expliziten Version, die in <code translate="no">spec.components.version</code></p></li>
</ul>
<p>Der Operator vergleicht dann diese gewünschte Version mit der aktuell laufenden Version, die in <code translate="no">status.currentImage</code> oder <code translate="no">status.currentVersion</code> aufgezeichnet ist. Wenn die aktuelle Version 2.5 und die gewünschte Version 2.6 ist, identifiziert der Operator das Upgrade als ein 2.5 → 2.6 Upgrade-Szenario.</p>
<p><strong>2. Rolling Upgrade-Ausführungsreihenfolge</strong></p>
<p>Wenn ein 2.5 → 2.6-Upgrade erkannt wird und der Upgrade-Modus auf "Rolling Upgrade" eingestellt ist (<code translate="no">spec.components.imageUpdateMode: rollingUpgrade</code>, was die Standardeinstellung ist), führt Milvus Operator das Upgrade automatisch in einer vordefinierten Reihenfolge durch, die auf die Milvus 2.6-Architektur abgestimmt ist:</p>
<p>Start des Streaming-Knotens → Upgrade von MixCoord → Upgrade des Abfrageknotens → Upgrade des Datenknotens → Upgrade des Proxys → Entfernen des Indexknotens</p>
<p><strong>3. Automatische Koordinatorenkonsolidierung</strong></p>
<p>Milvus 2.6 ersetzt mehrere Coordinator-Komponenten durch einen einzigen MixCoord. Milvus Operator verarbeitet diesen Architekturwechsel automatisch.</p>
<p>Wenn <code translate="no">spec.components.mixCoord</code> konfiguriert ist, ruft der Operator MixCoord auf und wartet, bis dieser bereit ist. Sobald MixCoord voll funktionsfähig ist, schaltet der Operator die alten Koordinator-Komponenten - RootCoord, QueryCoord und DataCoord - ab und schließt so die Migration ab, ohne dass ein manuelles Eingreifen erforderlich ist.</p>
<h3 id="Upgrade-Steps-from-Milvus-25-to-26" class="common-anchor-header">Upgrade-Schritte von Milvus 2.5 auf 2.6</h3><p>1. aktualisieren Sie Milvus Operator auf die neueste Version (in diesem Handbuch verwenden wir <strong>Version 1.3.3</strong>, die zum Zeitpunkt der Erstellung dieses Handbuchs die neueste Version war)</p>
<pre><code translate="no"><span class="hljs-comment"># Option 1: Using Helm</span>
helm upgrade --install milvus-operator \
  -n milvus-operator --create-namespace \
  https://github.com/zilliztech/milvus-operator/releases/download/v1.3.3/milvus-operator-1.3.3.tgz
 <span class="hljs-comment"># Option 2: Using kubectl &amp; raw manifests</span>
 kubectl apply -f https://raw.githubusercontent.com/zilliztech/milvus-operator/v1.3.3/deploy/manifests/deployment.yaml
<button class="copy-code-btn"></button></code></pre>
<p>2.führen Sie die Koordinator-Komponenten zusammen</p>
<pre><code translate="no">kubectl patch milvus my-release -n demo-operator --<span class="hljs-built_in">type</span>=merge -p <span class="hljs-string">&#x27;
{
  &quot;spec&quot;: {
    &quot;components&quot;: {
      &quot;mixCoord&quot;: {
        &quot;replicas&quot;: 1
      }
    }
  }
}&#x27;</span>
<button class="copy-code-btn"></button></code></pre>
<p>3. sicherstellen, dass auf dem Cluster Milvus 2.5.16 oder höher läuft</p>
<pre><code translate="no">kubectl patch milvus my-release -n demo-operator --<span class="hljs-built_in">type</span>=merge -p <span class="hljs-string">&#x27;
{
  &quot;spec&quot;: {
    &quot;components&quot;: {
      &quot;image&quot;: &quot;milvusdb/milvus:v2.5.22&quot;
    }
  }
}&#x27;</span>
<span class="hljs-comment"># wait till updated</span>
kubectl <span class="hljs-built_in">wait</span> milvus my-release -n demo-operator --<span class="hljs-keyword">for</span>=condition=milvusupdated --<span class="hljs-built_in">timeout</span>=1h
<button class="copy-code-btn"></button></code></pre>
<p>4. aktualisieren Sie Milvus auf Version 2.6</p>
<pre><code translate="no">kubectl patch milvus my-release -n demo-operator --<span class="hljs-built_in">type</span>=merge -p <span class="hljs-string">&#x27;
{
  &quot;spec&quot;: {
    &quot;components&quot;: {
      &quot;image&quot;: &quot;milvusdb/milvus:v2.6.5&quot;
    }
  }
}&#x27;</span>
<span class="hljs-comment"># wait till updated</span>
kubectl <span class="hljs-built_in">wait</span> milvus my-release -n demo-operator --<span class="hljs-keyword">for</span>=condition=milvusupdated --<span class="hljs-built_in">timeout</span>=1h
<button class="copy-code-btn"></button></code></pre>
<h2 id="How-to-Upgrade-to-Milvus-26-with-Helm" class="common-anchor-header">Upgrade auf Milvus 2.6 mit Helm<button data-href="#How-to-Upgrade-to-Milvus-26-with-Helm" class="anchor-icon" translate="no">
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
    </button></h2><p>Bei der Bereitstellung von Milvus mit Helm werden alle Kubernetes-Ressourcen <code translate="no">Deployment</code> parallel aktualisiert, ohne garantierte Ausführungsreihenfolge. Infolgedessen bietet Helm keine strenge Kontrolle über rollierende Upgrade-Sequenzen zwischen den Komponenten. Für Produktionsumgebungen wird daher die Verwendung von Milvus Operator dringend empfohlen.</p>
<p>Milvus kann dennoch mit Helm von 2.5 auf 2.6 aktualisiert werden, indem Sie die folgenden Schritte ausführen.</p>
<p>Systemanforderungen</p>
<ul>
<li><p><strong>Helm-Version:</strong> ≥ 3.14.0</p></li>
<li><p><strong>Kubernetes-Version:</strong> ≥ 1.20.0</p></li>
</ul>
<p>1. Aktualisieren Sie die Milvus Helm-Karte auf die neueste Version. In dieser Anleitung verwenden wir die <strong>Chart-Version 5.0.7</strong>, die zum Zeitpunkt der Erstellung dieses Handbuchs die neueste war.</p>
<pre><code translate="no">helm repo <span class="hljs-keyword">add</span> zilliztech https:<span class="hljs-comment">//zilliztech.github.io/milvus-helm</span>
helm repo update
<button class="copy-code-btn"></button></code></pre>
<p>Wenn der Cluster mit mehreren Coordinator-Komponenten eingesetzt wird, aktualisieren Sie zunächst Milvus auf Version 2.5.16 oder höher und aktivieren Sie MixCoord.</p>
<pre><code translate="no">mixCoordinator
。
helm upgrade -i my-release zilliztech/milvus \
  --namespace=helm-demo \
  --<span class="hljs-built_in">set</span> image.all.tag=<span class="hljs-string">&quot;v2.5.22&quot;</span> \
  --<span class="hljs-built_in">set</span> mixCoordinator.enabled=<span class="hljs-literal">true</span> \
  --<span class="hljs-built_in">set</span> rootCoordinator.enabled=<span class="hljs-literal">false</span> \
  --<span class="hljs-built_in">set</span> indexCoordinator.enabled=<span class="hljs-literal">false</span> \
  --<span class="hljs-built_in">set</span> queryCoordinator.enabled=<span class="hljs-literal">false</span> \
  --<span class="hljs-built_in">set</span> dataCoordinator.enabled=<span class="hljs-literal">false</span> \
  --<span class="hljs-built_in">set</span> streaming.enabled=<span class="hljs-literal">false</span> \
  --<span class="hljs-built_in">set</span> indexNode.enabled=<span class="hljs-literal">true</span> \
  --reset-then-reuse-values \
  --version=5.0.7 \
  --<span class="hljs-built_in">wait</span> --<span class="hljs-built_in">timeout</span> 1h
<button class="copy-code-btn"></button></code></pre>
<p>3. aktualisieren Sie Milvus auf Version 2.6</p>
<pre><code translate="no">helm upgrade my-release zilliztech/milvus \
  --namespace=helm-demo \
  --<span class="hljs-built_in">set</span> image.all.tag=<span class="hljs-string">&quot;v2.6.5&quot;</span> \
  --<span class="hljs-built_in">set</span> streaming.enabled=<span class="hljs-literal">true</span> \
  --<span class="hljs-built_in">set</span> indexNode.enabled=<span class="hljs-literal">false</span> \
  --reset-then-reuse-values \
  --version=5.0.7 \
  --<span class="hljs-built_in">wait</span> --<span class="hljs-built_in">timeout</span> 1h
<button class="copy-code-btn"></button></code></pre>
<h2 id="FAQ-on-Milvus-26-Upgrade-and-Operations" class="common-anchor-header">FAQ zu Milvus 2.6 Upgrade und Betrieb<button data-href="#FAQ-on-Milvus-26-Upgrade-and-Operations" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Q1-Milvus-Helm-vs-Milvus-Operator--which-one-should-I-use" class="common-anchor-header">Q1: Milvus Helm vs. Milvus Operator - welches sollte ich verwenden?</h3><p>Für Produktionsumgebungen wird Milvus Operator dringend empfohlen.</p>
<p>Einzelheiten finden Sie in der offiziellen Anleitung: <a href="https://github.com/zilliztech/milvus-operator?tab=readme-ov-file#milvus-operator-vs-helm">https://github.com/zilliztech/milvus-operator?tab=readme-ov-file#milvus-operator-vs-helm</a></p>
<h3 id="Q2-How-should-I-choose-a-Message-Queue-MQ" class="common-anchor-header">Q2: Wie sollte ich eine Message Queue (MQ) auswählen?</h3><p>Die empfohlene MQ hängt vom Einsatzmodus und den betrieblichen Anforderungen ab:</p>
<p><strong>1. Eigenständiger Modus:</strong> Für kostenbewusste Implementierungen wird RocksMQ empfohlen.</p>
<p><strong>2. Cluster-Modus</strong></p>
<ul>
<li><p><strong>Pulsar</strong> unterstützt Multi-Tenancy, ermöglicht großen Clustern die gemeinsame Nutzung der Infrastruktur und bietet eine hohe horizontale Skalierbarkeit.</p></li>
<li><p><strong>Kafka</strong> hat ein ausgereifteres Ökosystem mit verwalteten SaaS-Angeboten, die auf den meisten großen Cloud-Plattformen verfügbar sind.</p></li>
</ul>
<p><strong>3. Woodpecker (eingeführt in Milvus 2.6):</strong> Woodpecker macht eine externe Nachrichten-Warteschlange überflüssig und reduziert so Kosten und betriebliche Komplexität.</p>
<ul>
<li><p>Derzeit wird nur der eingebettete Woodpecker-Modus unterstützt, der leichtgewichtig und einfach zu bedienen ist.</p></li>
<li><p>Für Milvus 2.6 Standalone-Einsätze wird Woodpecker empfohlen.</p></li>
<li><p>Für produktive Cluster-Einsätze wird empfohlen, den kommenden Woodpecker-Cluster-Modus zu verwenden, sobald er verfügbar ist.</p></li>
</ul>
<h3 id="Q3-Can-the-Message-Queue-be-switched-during-an-upgrade" class="common-anchor-header">F3: Kann die Message Queue während eines Upgrades gewechselt werden?</h3><p>Nein. Das Umschalten der Nachrichtenwarteschlange während eines Upgrades wird derzeit nicht unterstützt. Künftige Versionen werden Verwaltungs-APIs einführen, die das Umschalten zwischen Pulsar, Kafka, Woodpecker und RocksMQ unterstützen.</p>
<h3 id="Q4-Do-rate-limiting-configurations-need-to-be-updated-for-Milvus-26" class="common-anchor-header">F4: Müssen Konfigurationen zur Ratenbegrenzung für Milvus 2.6 aktualisiert werden?</h3><p>Nein. Bestehende Konfigurationen zur Ratenbegrenzung bleiben wirksam und gelten auch für den neuen Streaming Node. Es sind keine Änderungen erforderlich.</p>
<h3 id="Q5-After-the-coordinator-merge-do-monitoring-roles-or-configurations-change" class="common-anchor-header">F5: Ändern sich nach der Zusammenführung der Koordinatoren Überwachungsrollen oder -konfigurationen?</h3><ul>
<li><p>Die Überwachungsrollen bleiben unverändert (<code translate="no">RootCoord</code>, <code translate="no">QueryCoord</code>, <code translate="no">DataCoord</code>).</p></li>
<li><p>Bestehende Konfigurationsoptionen funktionieren weiterhin wie bisher.</p></li>
<li><p>Es wird eine neue Konfigurationsoption, <code translate="no">mixCoord.enableActiveStandby</code>, eingeführt, die auf <code translate="no">rootcoord.enableActiveStandby</code> zurückfällt, wenn sie nicht explizit gesetzt wird.</p></li>
</ul>
<h3 id="Q6-What-are-the-recommended-resource-settings-for-StreamingNode" class="common-anchor-header">F6: Was sind die empfohlenen Ressourceneinstellungen für StreamingNode?</h3><ul>
<li><p>Für leichte Echtzeit-Ingestion oder gelegentliche Schreib- und Abfrage-Arbeitslasten ist eine kleinere Konfiguration, z. B. 2 CPU-Kerne und 8 GB Speicher, ausreichend.</p></li>
<li><p>Für schwere Echtzeit-Ingestion oder kontinuierliche Schreib- und Abfrage-Arbeitslasten wird empfohlen, Ressourcen zuzuweisen, die mit denen des Abfrageknotens vergleichbar sind.</p></li>
</ul>
<h3 id="Q7-How-do-I-upgrade-a-standalone-deployment-using-Docker-Compose" class="common-anchor-header">F7: Wie kann ich eine eigenständige Bereitstellung mit Docker Compose aktualisieren?</h3><p>Für Docker Compose-basierte Standalone-Bereitstellungen aktualisieren Sie einfach das Milvus-Image-Tag in <code translate="no">docker-compose.yaml</code>.</p>
<p>Weitere Informationen finden Sie in der offiziellen Anleitung: <a href="https://milvus.io/docs/upgrade_milvus_standalone-docker.md">https://milvus.io/docs/upgrade_milvus_standalone-docker.md</a></p>
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
    </button></h2><p>Milvus 2.6 stellt eine wesentliche Verbesserung sowohl in der Architektur als auch im Betrieb dar. Durch die Trennung von Streaming- und Batch-Verarbeitung mit der Einführung von StreamingNode, die Konsolidierung von Koordinatoren in MixCoord und die Vereinfachung von Worker-Rollen bietet Milvus 2.6 eine stabilere, skalierbarere und einfacher zu bedienende Grundlage für große Vektor-Workloads.</p>
<p>Durch diese architektonischen Änderungen sind Upgrades - insbesondere von Milvus 2.5 - stärker von der Reihenfolge abhängig. Ein erfolgreiches Upgrade hängt von der Einhaltung von Komponentenabhängigkeiten und temporären Verfügbarkeitsbeschränkungen ab. Für Produktionsumgebungen ist Milvus Operator der empfohlene Ansatz, da er die Upgrade-Reihenfolge automatisiert und das Betriebsrisiko reduziert, während Helm-basierte Upgrades besser für nicht-produktive Anwendungsfälle geeignet sind.</p>
<p>Mit erweiterten Suchfunktionen, reichhaltigeren Datentypen, abgestuftem Speicher und verbesserten Optionen für Nachrichtenwarteschlangen ist Milvus 2.6 gut positioniert, um moderne KI-Anwendungen zu unterstützen, die Echtzeit-Ingestion, hohe Abfrageleistung und effiziente Abläufe im großen Maßstab erfordern.</p>
<p>Haben Sie Fragen oder wünschen Sie einen tieferen Einblick in eine Funktion des neuesten Milvus? Treten Sie unserem<a href="https://discord.com/invite/8uyFbECzPX"> Discord-Kanal</a> bei oder stellen Sie Fragen auf<a href="https://github.com/milvus-io/milvus"> GitHub</a>. Sie können auch eine 20-minütige persönliche Sitzung buchen, um Einblicke, Anleitung und Antworten auf Ihre Fragen über die<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus Office Hours</a> zu erhalten.</p>
<h2 id="More-Resources-about-Milvus-26" class="common-anchor-header">Weitere Ressourcen über Milvus 2.6<button data-href="#More-Resources-about-Milvus-26" class="anchor-icon" translate="no">
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
<li><p><a href="https://milvus.io/docs/release_notes.md">Milvus 2.6 Versionshinweise</a></p></li>
<li><p><a href="https://www.youtube.com/watch?v=Guct-UMK8lw&amp;t=157s">Milvus 2.6 Webinar-Aufzeichnung: Schnellere Suche, niedrigere Kosten und intelligentere Skalierung</a></p></li>
<li><p>Milvus 2.6 Funktions-Blogs</p>
<ul>
<li><p><a href="https://milvus.io/blog/data-in-and-data-out-in-milvus-2-6.md">Einführung in die Einbettungsfunktion: Wie Milvus 2.6 die Vektorisierung und semantische Suche rationalisiert</a></p></li>
<li><p><a href="https://milvus.io/blog/json-shredding-in-milvus-faster-json-filtering-with-flexibility.md">JSON Shredding in Milvus: 88,9x schnellere JSON-Filterung mit Flexibilität</a></p></li>
<li><p><a href="https://milvus.io/blog/unlocking-true-entity-level-retrieval-new-array-of-structs-and-max-sim-capabilities-in-milvus.md">Echte Suche auf Entity-Ebene ermöglichen: Neue Array-of-Structs und MAX_SIM-Fähigkeiten in Milvus</a></p></li>
<li><p><a href="https://milvus.io/blog/milvus-tiered-storage-80-less-vector-search-cost-with-on-demand-hot%E2%80%93cold-data-loading.md">Hören Sie auf, für kalte Daten zu bezahlen: 80 % Kostenreduzierung mit On-Demand Hot-Cold Data Loading in Milvus Tiered Storage</a></p></li>
<li><p><a href="https://milvus.io/blog/introducing-aisaq-in-milvus-billion-scale-vector-search-got-3200-cheaper-on-memory.md">Einführung von AISAQ in Milvus: Milliardenfache Vektorsuche ist jetzt 3.200-mal billiger im Speicher</a></p></li>
<li><p><a href="https://milvus.io/blog/faster-index-builds-and-scalable-queries-with-gpu-cagra-in-milvus.md">Optimierung von NVIDIA CAGRA in Milvus: Ein hybrider GPU-CPU-Ansatz für schnellere Indizierung und kostengünstigere Abfragen</a></p></li>
<li><p><a href="https://milvus.io/blog/milvus-ngram-index-faster-keyword-matching-and-like-queries-for-agent-workloads.md">Einführung in den Milvus Ngram Index: Schnelleres Keyword Matching und LIKE-Abfragen für Agent Workloads</a></p></li>
<li><p><a href="https://milvus.io/blog/unlock-geo-vector-search-with-geometry-fields-and-rtree-index-in-milvus.md">Zusammenführung von räumlicher Filterung und Vektorsuche mit Geometriefeldern und RTREE in Milvus 2.6</a></p></li>
<li><p><a href="https://milvus.io/blog/how-to-filter-efficiently-without-killing-recall.md">Vektorsuche in der realen Welt: Wie man effizient filtert, ohne den Rückruf zu zerstören</a></p></li>
<li><p><a href="https://milvus.io/blog/bring-vector-compression-to-the-extreme-how-milvus-serves-3%C3%97-more-queries-with-rabitq.md">Vektorkomprimierung auf die Spitze getrieben: Wie Milvus mit RaBitQ 3× mehr Abfragen bedient</a></p></li>
<li><p><a href="https://milvus.io/blog/benchmarks-lie-vector-dbs-deserve-a-real-test.md">Benchmarks lügen - Vektor-DBs verdienen einen echten Test</a></p></li>
<li><p><a href="https://milvus.io/blog/we-replaced-kafka-pulsar-with-a-woodpecker-for-milvus.md">Wir haben Kafka/Pulsar durch einen Woodpecker für Milvus ersetzt - so sieht es aus</a></p></li>
<li><p><a href="https://milvus.io/blog/minhash-lsh-in-milvus-the-secret-weapon-for-fighting-duplicates-in-llm-training-data.md">MinHash LSH in Milvus: Die Geheimwaffe zur Bekämpfung von Duplikaten in LLM-Trainingsdaten</a></p></li>
</ul></li>
</ul>
