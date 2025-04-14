---
id: >-
  introducing-the-milvus-sizing-tool-calculating-and-optimizing-your-milvus-deployment-resources.md
title: >-
  Einführung in das Milvus Sizing Tool: Berechnen und Optimieren Ihrer
  Milvus-Bereitstellungsressourcen
author: 'Ken Zhang, Fendy Feng'
date: 2025-04-11T00:00:00.000Z
desc: >-
  Maximieren Sie Ihre Milvus-Leistung mit unserem benutzerfreundlichen
  Sizing-Tool! Erfahren Sie, wie Sie Ihre Bereitstellung für eine optimale
  Ressourcennutzung und Kosteneinsparungen konfigurieren können.
cover: assets.zilliz.com/Introducing_Milvus_Sizing_Tool_c0c98343a2.png
tag: Tutorials
recommend: false
canonicalUrl: 'https://zilliz.com/blog/demystify-milvus-sizing-tool'
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
    </button></h2><p>Die Auswahl der optimalen Konfiguration für Ihren Milvus-Einsatz ist entscheidend für die Leistungsoptimierung, die effiziente Ressourcennutzung und das Kostenmanagement. Unabhängig davon, ob Sie einen Prototyp erstellen oder einen Produktionseinsatz planen, kann die richtige Dimensionierung Ihrer Milvus-Instanz den Unterschied zwischen einer reibungslos laufenden Vektordatenbank und einer, die mit der Leistung kämpft oder unnötige Kosten verursacht, bedeuten.</p>
<p>Um diesen Prozess zu vereinfachen, haben wir unser <a href="https://milvus.io/tools/sizing">Milvus Sizing Tool</a> überarbeitet, einen benutzerfreundlichen Rechner, der empfohlene Ressourcenschätzungen auf der Grundlage Ihrer spezifischen Anforderungen erstellt. In diesem Leitfaden führen wir Sie durch die Verwendung des Tools und geben Ihnen einen tieferen Einblick in die Faktoren, die die Leistung des Milvus beeinflussen.</p>
<h2 id="How-to-Use-the-Milvus-Sizing-Tool" class="common-anchor-header">So verwenden Sie das Milvus Sizing Tool<button data-href="#How-to-Use-the-Milvus-Sizing-Tool" class="anchor-icon" translate="no">
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
    </button></h2><p>Die Verwendung dieses Größenbestimmungstools ist kinderleicht. Führen Sie einfach die folgenden Schritte aus.</p>
<ol>
<li><p>Besuchen Sie die Seite<a href="https://milvus.io/tools/sizing/"> Milvus Sizing Tool</a>.</p></li>
<li><p>Geben Sie Ihre Schlüsselparameter ein:</p>
<ul>
<li><p>Anzahl der Vektoren und Dimensionen pro Vektor</p></li>
<li><p>Index-Typ</p></li>
<li><p>Größe der skalaren Felddaten</p></li>
<li><p>Segmentgröße</p></li>
<li><p>Ihr bevorzugter Bereitstellungsmodus</p></li>
</ul></li>
<li><p>Überprüfen Sie die generierten Ressourcenempfehlungen</p></li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/milvus_sizing_tool_3ca881b3d5.jpeg" alt="milvus sizing tool" class="doc-image" id="milvus-sizing-tool" />
   </span> <span class="img-wrapper"> <span>milvus-sizing-werkzeug</span> </span></p>
<p>Lassen Sie uns untersuchen, wie sich jeder dieser Parameter auf Ihre Milvus-Bereitstellung auswirkt.</p>
<h2 id="Index-Selection-Balancing-Storage-Cost-Accuracy-and-Speed" class="common-anchor-header">Index-Auswahl: Gleichgewicht zwischen Speicherplatz, Kosten, Genauigkeit und Geschwindigkeit<button data-href="#Index-Selection-Balancing-Storage-Cost-Accuracy-and-Speed" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus bietet verschiedene Indexalgorithmen an, darunter <a href="https://zilliz.com/learn/hierarchical-navigable-small-worlds-HNSW">HNSW</a>, FLAT, IVF_FLAT, IVF_SQ8, <a href="https://zilliz.com/learn/what-is-scann-scalable-nearest-neighbors-google">ScaNN</a>, <a href="https://zilliz.com/learn/DiskANN-and-the-Vamana-Algorithm">DiskANN</a> und andere, die jeweils unterschiedliche Kompromisse bei der Speichernutzung, den Festplattenplatzanforderungen, der Abfragegeschwindigkeit und der Suchgenauigkeit aufweisen.</p>
<p>Im Folgenden erfahren Sie, was Sie über die gängigsten Optionen wissen müssen:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/index_dde661d579.jpeg" alt="index" class="doc-image" id="index" />
   </span> <span class="img-wrapper"> <span>Index</span> </span></p>
<p>HNSW (Hierarchische navigierbare kleine Welt)</p>
<ul>
<li><p><strong>Architektur</strong>: Kombiniert Sprunglisten mit NSW-Graphen (Navigable Small Worlds) in einer hierarchischen Struktur</p></li>
<li><p><strong>Leistung</strong>: Sehr schnelle Abfrage mit ausgezeichneten Wiederfindungsraten</p></li>
<li><p><strong>Ressourcenverbrauch</strong>: Benötigt den meisten Speicher pro Vektor (höchste Kosten)</p></li>
<li><p><strong>Am besten geeignet für</strong>: Anwendungen, bei denen Geschwindigkeit und Genauigkeit entscheidend sind und Speicherbeschränkungen keine Rolle spielen</p></li>
<li><p><strong>Technischer Hinweis</strong>: Die Suche beginnt auf der obersten Ebene mit den wenigsten Knoten und durchläuft nach unten hin immer dichtere Ebenen.</p></li>
</ul>
<p>FLAT</p>
<ul>
<li><p><strong>Architektur</strong>: Einfache erschöpfende Suche ohne Approximation</p></li>
<li><p><strong>Leistung</strong>: 100%ige Trefferquote, aber extrem langsame Abfragezeiten (<code translate="no">O(n)</code> für Datengröße <code translate="no">n</code>)</p></li>
<li><p><strong>Ressourcenverbrauch</strong>: Indexgröße entspricht der Größe der Rohvektordaten</p></li>
<li><p><strong>Am besten geeignet für</strong>: Kleine Datensätze oder Anwendungen, die eine perfekte Wiederauffindbarkeit erfordern</p></li>
<li><p><strong>Technische Anmerkung</strong>: Führt vollständige Abstandsberechnungen zwischen dem Abfragevektor und jedem Vektor in der Datenbank durch.</p></li>
</ul>
<p>IVF_FLAT</p>
<ul>
<li><p><strong>Architektur</strong>: Teilt den Vektorraum in Cluster auf, um die Suche effizienter zu gestalten</p></li>
<li><p><strong>Leistung</strong>: Mittelhoher Recall bei mäßiger Abfragegeschwindigkeit (langsamer als HNSW, aber schneller als FLAT)</p></li>
<li><p><strong>Ressourcenverbrauch</strong>: Benötigt weniger Speicher als FLAT, aber mehr als HNSW</p></li>
<li><p><strong>Am besten geeignet für</strong>: Ausgewogene Anwendungen, bei denen ein gewisses Maß an Auffindbarkeit gegen eine bessere Leistung eingetauscht werden kann</p></li>
<li><p><strong>Technischer Hinweis</strong>: Während der Suche werden nur <code translate="no">nlist</code> Cluster untersucht, was den Rechenaufwand erheblich reduziert.</p></li>
</ul>
<p>IVF_SQ8</p>
<ul>
<li><p><strong>Architektur</strong>: Wendet skalare Quantisierung auf IVF_FLAT an und komprimiert Vektordaten</p></li>
<li><p><strong>Leistung</strong>: Mittlerer Recall bei mittelhoher Abfragegeschwindigkeit</p></li>
<li><p><strong>Ressourcenverbrauch</strong>: Reduziert den Festplatten-, Rechen- und Speicherverbrauch um 70-75 % im Vergleich zu IVF_FLAT</p></li>
<li><p><strong>Am besten geeignet für</strong>: Umgebungen mit eingeschränkten Ressourcen, in denen die Genauigkeit leicht beeinträchtigt werden kann</p></li>
<li><p><strong>Technischer Hinweis</strong>: Komprimiert 32-Bit-Gleitkommawerte zu 8-Bit-Ganzzahlwerten</p></li>
</ul>
<h3 id="Advanced-Index-Options-ScaNN-DiskANN-CAGRA-and-more" class="common-anchor-header">Erweiterte Index-Optionen: ScaNN, DiskANN, CAGRA und mehr</h3><p>Für Entwickler mit speziellen Anforderungen bietet Milvus auch:</p>
<ul>
<li><p><a href="https://zilliz.com/learn/what-is-scann-scalable-nearest-neighbors-google"><strong>ScaNN</strong></a>: 20% schneller auf der CPU als HNSW mit ähnlichen Abrufraten</p></li>
<li><p><a href="https://milvus.io/docs/disk_index.md"><strong>DiskANN</strong></a>: Ein hybrider Festplatten-/Speicherindex, der ideal ist, wenn Sie eine große Anzahl von Vektoren mit hohen Abrufraten unterstützen müssen und eine etwas längere Latenzzeit (~100 ms) akzeptieren können. Es schafft ein Gleichgewicht zwischen Speichernutzung und Leistung, indem nur ein Teil des Index im Speicher gehalten wird, während der Rest auf der Festplatte bleibt.</p></li>
<li><p><strong>GPU-basierte Indizes</strong>:</p>
<ul>
<li><p><a href="https://zilliz.com/blog/Milvus-introduces-GPU-index-CAGRA">GPU_CAGRA</a>: Dies ist der schnellste der GPU-Indizes, aber er erfordert eine Inferenzkarte mit GDDR-Speicher und nicht eine mit HBM-Speicher</p></li>
<li><p>GPU_BRUTE_FORCE: Exhaustive Suche auf GPU implementiert</p></li>
<li><p>GPU_IVF_FLAT: GPU-beschleunigte Version von IVF_FLAT</p></li>
<li><p>GPU_IVF_PQ: GPU-beschleunigte Version von IVF mit <a href="https://zilliz.com/learn/harnessing-product-quantization-for-memory-efficiency-in-vector-databases">Produktquantisierung</a></p></li>
</ul></li>
<li><p><strong>HNSW-PQ/SQ/PRQ</strong>:</p>
<ul>
<li><p><strong>HNSW_SQ</strong>: Sehr schnelle Abfrage, begrenzte Speicherressourcen; nimmt geringfügige Kompromisse bei der Abrufrate in Kauf.</p></li>
<li><p><strong>HNSW_PQ</strong>: Abfrage mit mittlerer Geschwindigkeit; sehr begrenzte Speicherressourcen; akzeptiert geringfügige Kompromisse bei der Abrufrate</p></li>
<li><p><strong>HNSW_PRQ</strong>: Abfrage mit mittlerer Geschwindigkeit; sehr begrenzte Speicherressourcen; akzeptiert geringfügige Kompromisse bei der Abrufrate</p></li>
<li><p><strong>AUTOINDEX</strong>: Standardmäßig HNSW in Open-Source-Milvus (oder verwendet leistungsstärkere proprietäre Indizes in <a href="https://zilliz.com/cloud">Zilliz Cloud</a>, dem verwalteten Milvus).</p></li>
</ul></li>
<li><p><strong>Binär-, Sparse- und andere spezialisierte Indizes</strong>: Für bestimmte Datentypen und Anwendungsfälle. Weitere Details finden Sie auf <a href="https://milvus.io/docs/index.md">dieser Index-Dokumentationsseite</a>.</p></li>
</ul>
<h2 id="Segment-Size-and-Deployment-Configuration" class="common-anchor-header">Segmentgröße und Bereitstellungskonfiguration<button data-href="#Segment-Size-and-Deployment-Configuration" class="anchor-icon" translate="no">
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
    </button></h2><p>Segmente sind die grundlegenden Bausteine der internen Datenorganisation von Milvus. Sie fungieren als Datenchunks, die eine verteilte Suche und einen Lastausgleich in Ihrer Bereitstellung ermöglichen. Dieses Milvus-Größenbestimmungstool bietet drei Segmentgrößenoptionen (512 MB, 1024 MB, 2048 MB), wobei 1024 MB die Standardeinstellung ist.</p>
<p>Das Verständnis von Segmenten ist entscheidend für die Leistungsoptimierung. Als allgemeine Richtlinie gilt:</p>
<ul>
<li><p>512 MB Segmente: Am besten für Abfrageknoten mit 4-8 GB Speicher</p></li>
<li><p>1 GB-Segmente: Optimal für Abfrageknoten mit 8-16 GB Speicher</p></li>
<li><p>2 GB-Segmente: Empfohlen für Abfrageknoten mit &gt;16 GB Speicher</p></li>
</ul>
<p>Einblicke für Entwickler: Weniger, größere Segmente liefern in der Regel eine schnellere Suchleistung. Bei großen Bereitstellungen bieten 2-GB-Segmente oft das beste Gleichgewicht zwischen Speichereffizienz und Abfragegeschwindigkeit.</p>
<h2 id="Message-Queue-System-Selection" class="common-anchor-header">Auswahl des Nachrichtenwarteschlangensystems<button data-href="#Message-Queue-System-Selection" class="anchor-icon" translate="no">
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
    </button></h2><p>Bei der Wahl zwischen Pulsar und Kafka als Messaging-System:</p>
<ul>
<li><p><strong>Pulsar</strong>: Empfohlen für neue Projekte aufgrund des geringeren Overheads pro Topic und der besseren Skalierbarkeit</p></li>
<li><p><strong>Kafka</strong>: Kann vorzuziehen sein, wenn Sie bereits über Kafka-Expertise oder -Infrastruktur in Ihrem Unternehmen verfügen</p></li>
</ul>
<h2 id="Enterprise-Optimizations-in-Zilliz-Cloud" class="common-anchor-header">Unternehmensoptimierungen in der Zilliz Cloud<button data-href="#Enterprise-Optimizations-in-Zilliz-Cloud" class="anchor-icon" translate="no">
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
    </button></h2><p>Für Produktionseinsätze mit strengen Leistungsanforderungen bietet Zilliz Cloud (die vollständig verwaltete und unternehmensweite Version von Milvus in der Cloud) zusätzliche Optimierungen bei der Indizierung und Quantisierung:</p>
<ul>
<li><p><strong>Out of Memory (OOM) Prävention:</strong> Ausgefeiltes Speichermanagement zur Vermeidung von Out-of-Memory-Abstürzen</p></li>
<li><p><strong>Optimierung der Verdichtung</strong>: Verbessert die Suchleistung und Ressourcennutzung</p></li>
<li><p><strong>Tiered Storage</strong>: Effiziente Verwaltung heißer und kalter Daten mit geeigneten Recheneinheiten</p>
<ul>
<li><p>Standard-Compute-Units (CUs) für häufig abgerufene Daten</p></li>
<li><p>Tiered Storage CUs für die kosteneffiziente Speicherung von Daten mit seltenem Zugriff</p></li>
</ul></li>
</ul>
<p>Detaillierte Informationen zu den Größenoptionen für Unternehmen finden Sie in der<a href="https://docs.zilliz.com/docs/select-zilliz-cloud-service-plans"> Dokumentation der Zilliz-Cloud-Servicepläne</a>.</p>
<h2 id="Advanced-Configuration-Tips-for-Developers" class="common-anchor-header">Erweiterte Konfigurationstipps für Entwickler<button data-href="#Advanced-Configuration-Tips-for-Developers" class="anchor-icon" translate="no">
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
<li><p><strong>Mehrere Index-Typen</strong>: Das Sizing-Tool konzentriert sich auf einen einzigen Index. Für komplexe Anwendungen, die unterschiedliche Indexalgorithmen für verschiedene Sammlungen erfordern, erstellen Sie separate Sammlungen mit benutzerdefinierten Konfigurationen.</p></li>
<li><p><strong>Speicherzuweisung</strong>: Berücksichtigen Sie bei der Planung Ihres Einsatzes sowohl den Bedarf an Vektordaten als auch an Indexspeicher. HNSW benötigt in der Regel das 2-3fache des Speichers der rohen Vektordaten.</p></li>
<li><p><strong>Leistungstests</strong>: Bevor Sie Ihre Konfiguration abschließen, sollten Sie Ihre spezifischen Abfragemuster mit einem repräsentativen Datensatz testen.</p></li>
<li><p><strong>Überlegungen zur Skalierung</strong>: Berücksichtigen Sie zukünftiges Wachstum. Es ist einfacher, mit etwas mehr Ressourcen zu beginnen, als später neu zu konfigurieren.</p></li>
</ol>
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
    </button></h2><p>Das<a href="https://milvus.io/tools/sizing/"> Milvus Sizing Tool</a> bietet einen ausgezeichneten Ausgangspunkt für die Ressourcenplanung, aber denken Sie daran, dass jede Anwendung einzigartige Anforderungen hat. Um eine optimale Leistung zu erzielen, sollten Sie Ihre Konfiguration auf der Grundlage Ihrer spezifischen Arbeitslastcharakteristika, Abfragemuster und Skalierungsanforderungen feinabstimmen.</p>
<p>Wir verbessern unsere Tools und Dokumentationen kontinuierlich auf der Grundlage von Benutzerfeedback. Wenn Sie Fragen haben oder weitere Unterstützung bei der Dimensionierung Ihrer Milvus-Bereitstellung benötigen, wenden Sie sich an unsere Community auf<a href="https://github.com/milvus-io/milvus/discussions"> GitHub</a> oder<a href="https://discord.com/invite/8uyFbECzPX"> Discord</a>.</p>
<h2 id="References" class="common-anchor-header">Referenzen<button data-href="#References" class="anchor-icon" translate="no">
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
<li><p><a href="https://thesequence.substack.com/p/guest-post-choosing-the-right-vector">📝 Auswahl des richtigen Vektorindex für Ihr Projekt</a></p></li>
<li><p><a href="https://milvus.io/docs/index.md?tab=floating">In-Memory-Index | Milvus-Dokumentation</a></p></li>
<li><p><a href="https://zilliz.com/blog/Milvus-introduces-GPU-index-CAGRA">Enthüllung von Milvus CAGRA: Verbesserung der Vektorsuche mit GPU-Indizierung</a></p></li>
<li><p><a href="https://zilliz.com/pricing#estimate_your_cost">Zilliz Cloud Preiskalkulator</a></p></li>
<li><p><a href="https://milvus.io/blog/how-to-get-started-with-milvus.md">Wie man mit Milvus anfängt </a></p></li>
<li><p><a href="https://docs.zilliz.com/docs/resource-planning">Zilliz Cloud Ressourcenplanung | Cloud | Zilliz Cloud Developer Hub</a></p></li>
</ul>
