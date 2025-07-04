---
id: vdbbench-1-0-benchmarking-with-your-real-world-production-workloads.md
title: >-
  Ankündigung von VDBBench 1.0: Open-Source-Vektordatenbank-Benchmarking mit
  Ihren realen Produktions-Workloads
author: Tian Min
date: 2025-07-04T00:00:00.000Z
desc: >-
  Entdecken Sie VDBBench 1.0, ein Open-Source-Tool für das Benchmarking von
  Vektordatenbanken mit realen Daten, Streaming-Ingestion und gleichzeitigen
  Arbeitslasten.
cover: assets.zilliz.com/milvus_vdb_e0e8146c90.jpeg
tag: Announcements
recommend: false
publishToMedium: true
tags: 'vector database, Milvus, vectordb benchmarking, vector search'
meta_keywords: 'VDBBench, vector database, Milvus, Zilliz Cloud, benchmarking'
meta_title: |
  VDBBench 1.0: Real-World Benchmarking for Vector Databases
origin: >-
  https://zilliz.com/blog/vdbbench-1-0-benchmarking-with-your-real-world-production-workloads
---
<p>Die meisten Vektordatenbank-Benchmarks testen mit statischen Daten und vordefinierten Indizes. Produktionssysteme funktionieren jedoch nicht so - die Daten fließen kontinuierlich, während Benutzer Abfragen ausführen, Filter fragmentieren Indizes, und die Leistungsmerkmale ändern sich unter gleichzeitiger Lese-/Schreiblast dramatisch.</p>
<p>Heute veröffentlichen wir <a href="https://github.com/zilliztech/VectorDBBench/releases/tag/v1.0.0"><strong>VDBBench 1.0</strong></a>, einen Open-Source-Benchmark, der von Grund auf entwickelt wurde, um Vektordatenbanken unter realistischen Produktionsbedingungen zu testen: Streaming Data Ingestion, Metadatenfilterung mit unterschiedlicher Selektivität und gleichzeitige Arbeitslasten, die tatsächliche Systemengpässe aufdecken.</p>
<p><a href="https://github.com/zilliztech/VectorDBBench/releases/tag/v1.0.0"><strong>VDBBench 1.0 herunterladen →</strong></a> →<a href="https://zilliz.com/vdbbench-leaderboard?dataset=vectorSearch"> <strong>Leaderboard anzeigen →</strong></a></p>
<h2 id="Why-Current-Benchmarks-Are-Misleading" class="common-anchor-header">Warum aktuelle Benchmarks irreführend sind<button data-href="#Why-Current-Benchmarks-Are-Misleading" class="anchor-icon" translate="no">
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
    </button></h2><p>Seien wir ehrlich - es gibt ein seltsames Phänomen in unserer Branche. Alle reden davon, dass man "keine Benchmarks spielen soll", und doch machen viele genau das. Seitdem der Markt für Vektordatenbanken im Jahr 2023 explodiert ist, haben wir zahlreiche Beispiele von Systemen gesehen, die in den Benchmarks hervorragend abschneiden", in der Produktion jedoch kläglich versagen", wodurch Entwicklungszeit vergeudet und die Glaubwürdigkeit des Projekts beschädigt wird.</p>
<p>Wir haben diese Diskrepanz aus erster Hand miterlebt. Elasticsearch rühmt sich zum Beispiel mit Abfragegeschwindigkeiten im Millisekundenbereich, aber hinter den Kulissen kann es über 20 Stunden dauern, nur um den Index zu optimieren. Welches Produktionssystem kann solche Ausfallzeiten verkraften?</p>
<p>Das Problem rührt von drei grundlegenden Mängeln her:</p>
<ul>
<li><p><strong>Veraltete Datensätze:</strong> Viele Benchmarks stützen sich immer noch auf veraltete Datensätze wie SIFT (128 Dimensionen), während moderne Embeddings zwischen 768 und 3.072 Dimensionen umfassen. Die Leistungscharakteristiken von Systemen, die mit 128D- und 1024D+-Vektoren arbeiten, unterscheiden sich grundlegend - Speicherzugriffsmuster, Indexeffizienz und Rechenkomplexität ändern sich drastisch.</p></li>
<li><p><strong>Eitelkeitsmetriken:</strong> Benchmarks konzentrieren sich auf die durchschnittliche Latenzzeit oder die Spitzen-QPS, wodurch ein verzerrtes Bild entsteht. Ein System mit einer durchschnittlichen Latenz von 10 ms, aber einer P99-Latenz von 2 Sekunden ist für den Benutzer unangenehm. Ein über 30 Sekunden gemessener Spitzendurchsatz sagt nichts über die dauerhafte Leistung aus.</p></li>
<li><p><strong>Zu stark vereinfachte Szenarien:</strong> Die meisten Benchmarks testen grundlegende Arbeitsabläufe wie "Daten schreiben, Index erstellen, Abfrage" - im Wesentlichen Tests auf "Hello World"-Niveau. Die reale Produktion umfasst eine kontinuierliche Dateneingabe während der Bereitstellung von Abfragen, komplexe Metadatenfilterung, die Indizes fragmentiert, und gleichzeitige Lese-/Schreibvorgänge, die um Ressourcen konkurrieren.</p></li>
</ul>
<h2 id="What’s-New-in-VDBBench-10" class="common-anchor-header">Was ist neu in VDBBench 1.0?<button data-href="#What’s-New-in-VDBBench-10" class="anchor-icon" translate="no">
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
    </button></h2><p>VDBBench wiederholt nicht nur veraltete Benchmarking-Philosophien, sondern baut das Konzept von Grund auf neu auf, mit einem Leitgedanken: Ein Benchmark ist nur dann wertvoll, wenn er das tatsächliche Produktionsverhalten vorhersagt.</p>
<p>Wir haben VDBBench so entwickelt, dass es die Bedingungen der realen Welt in drei kritischen Dimensionen genau nachbildet: <strong>Datenauthentizität, Arbeitslastmuster und Leistungsmessungsmethoden.</strong></p>
<p>Werfen wir einen genaueren Blick auf die neuen Funktionen, die jetzt verfügbar sind.</p>
<h3 id="🚀-Redesigned-Dashboard-with-Production-Relevant-Visualizations" class="common-anchor-header"><strong>🚀 Überarbeitetes Dashboard mit produktionsrelevanten Visualisierungen</strong></h3><p>Die meisten Benchmarks konzentrieren sich nur auf die Rohdatenausgabe, aber es kommt darauf an, wie Ingenieure diese Ergebnisse interpretieren und darauf reagieren. Wir haben die Benutzeroberfläche neu gestaltet, um Klarheit und Interaktivität in den Vordergrund zu stellen - damit Sie Leistungslücken zwischen Systemen erkennen und schnelle Infrastrukturentscheidungen treffen können.</p>
<p>Das neue Dashboard visualisiert nicht nur die Leistungszahlen, sondern auch die Beziehungen zwischen ihnen: wie sich die QPS bei verschiedenen Filterselektivitätsstufen verschlechtert, wie der Recall während der Streaming-Ingestion schwankt und wie die Latenzverteilungen die Systemstabilitätsmerkmale aufzeigen.  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/vdb_1_df593dea0b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Wir haben die wichtigsten Vektordatenbankplattformen wie <strong>Milvus, Zilliz Cloud, Elastic Cloud, Qdrant Cloud, Pinecone und OpenSearch</strong> mit ihren neuesten Konfigurationen und empfohlenen Einstellungen erneut getestet, um sicherzustellen, dass alle Benchmark-Daten die aktuellen Möglichkeiten widerspiegeln. Alle Testergebnisse sind auf dem<a href="https://zilliz.com/vdbbench-leaderboard?dataset=vectorSearch"> VDBBench Leaderboard</a> verfügbar.</p>
<h3 id="🏷️-Tag-Filtering-The-Hidden-Performance-Killer" class="common-anchor-header">🏷️ Tag-Filterung: Der versteckte Performance-Killer</h3><p>Abfragen in der realen Welt finden selten isoliert statt. Anwendungen kombinieren Vektorähnlichkeit mit der Filterung von Metadaten ("Finde Schuhe, die wie dieses Foto aussehen, aber weniger als 100 Dollar kosten"). Diese gefilterte Vektorsuche schafft einzigartige Herausforderungen, die von den meisten Benchmarks völlig ignoriert werden.</p>
<p>Gefilterte Suchen führen zu Komplexität in zwei kritischen Bereichen:</p>
<ul>
<li><p><strong>Filterkomplexität</strong>: Mehr skalare Felder und komplexe logische Bedingungen erhöhen den Rechenaufwand und können zu einer unzureichenden Wiederauffindung und einer Fragmentierung des Graphenindex führen.</p></li>
<li><p><strong>Filter-Selektivität</strong>: Dies ist der "versteckte Leistungskiller", den wir wiederholt in der Produktion nachgewiesen haben. Wenn die Filterbedingungen sehr selektiv werden (mehr als 99 % der Daten werden herausgefiltert), können die Abfragegeschwindigkeiten um Größenordnungen schwanken, und der Abruf kann instabil werden, da die Indexstrukturen mit spärlichen Ergebnismengen zu kämpfen haben.</p></li>
</ul>
<p>VDBBench testet systematisch verschiedene Filterselektivitätsstufen (von 50 % bis 99,9 %) und liefert so ein umfassendes Leistungsprofil unter diesem kritischen Produktionsmuster. Die Ergebnisse offenbaren oft dramatische Leistungseinbrüche, die in herkömmlichen Benchmarks nie auftauchen würden.</p>
<p><strong>Beispiel</strong>: In den Cohere 1M-Tests konnte Milvus über alle Filterselektivitätsstufen hinweg eine konstant hohe Rückrufquote beibehalten, während OpenSearch eine instabile Leistung zeigte, bei der die Rückrufquote unter verschiedenen Filterbedingungen erheblich schwankte und in vielen Fällen unter 0,8 fiel, was für die meisten Produktionsumgebungen inakzeptabel ist.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/vdb_2_0ef89463e5.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Abbildung: QPS und Recall von Milvus und OpenSearch über verschiedene Filterselektivitätsstufen hinweg (Cohere 1M Test).</em></p>
<h3 id="🌊-Streaming-ReadWrite-Beyond-Static-Index-Testing" class="common-anchor-header">🌊 Streaming Lesen/Schreiben: Jenseits statischer Index-Tests</h3><p>Produktionssysteme genießen selten den Luxus statischer Daten. Neue Informationen fließen kontinuierlich ein, während Suchvorgänge ausgeführt werden - ein Szenario, bei dem viele ansonsten beeindruckende Datenbanken unter dem doppelten Druck zusammenbrechen, die Suchleistung aufrechtzuerhalten und gleichzeitig kontinuierliche Schreibvorgänge zu verarbeiten.</p>
<p>Die Streaming-Szenarien von VDBBench simulieren reale parallele Operationen und helfen den Entwicklern, die Systemstabilität in Umgebungen mit hoher Parallelität zu verstehen, insbesondere wie sich das Schreiben von Daten auf die Abfrageleistung auswirkt und wie sich die Leistung bei steigendem Datenvolumen entwickelt.</p>
<p>Um faire Vergleiche zwischen verschiedenen Systemen zu gewährleisten, verwendet VDBBench einen strukturierten Ansatz:</p>
<ul>
<li><p>Konfigurieren Sie kontrollierte Schreibraten, die die angestrebten Produktions-Workloads widerspiegeln (z. B. 500 Zeilen/Sek. verteilt auf 5 parallele Prozesse)</p></li>
<li><p>Auslösen von Suchvorgängen nach jeweils 10 % der Dateneingabe, abwechselnd im seriellen und gleichzeitigen Modus</p></li>
<li><p>Aufzeichnung umfassender Metriken: Latenzverteilungen (einschließlich P99), anhaltende QPS und Abrufgenauigkeit</p></li>
<li><p>Verfolgen Sie die Leistungsentwicklung im Laufe der Zeit, wenn das Datenvolumen und die Systembelastung zunehmen.</p></li>
</ul>
<p>Diese kontrollierten, inkrementellen Belastungstests zeigen, wie gut die Systeme die Stabilität und Genauigkeit bei fortlaufender Dateneingabe aufrechterhalten - etwas, das herkömmliche Benchmarks nur selten erfassen.</p>
<p><strong>Beispiel</strong>: In Cohere 10M Streaming-Tests konnte Pinecone im Vergleich zu Elasticsearch während des gesamten Schreibzyklus höhere QPS und Recall-Werte beibehalten. Bemerkenswert ist, dass sich die Leistung von Pinecone nach Abschluss des Ingestionsvorgangs deutlich verbessert hat, was eine hohe Stabilität bei anhaltender Last zeigt, während Elasticsearch während aktiver Ingestionsphasen ein unregelmäßigeres Verhalten zeigt.  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/vdb3_9d2a5298b0.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Abbildung: QPS und Recall von Pinecone vs. Elasticsearch im Cohere 10M Streaming Test (500 rows/s Ingestion Rate).</p>
<p>VDBBench geht sogar noch weiter, indem es einen optionalen Optimierungsschritt unterstützt, der es den Benutzern ermöglicht, die Leistung der Streaming-Suche vor und nach der Indexoptimierung zu vergleichen. Außerdem wird die für jede Stufe tatsächlich aufgewendete Zeit aufgezeichnet und berichtet, was tiefere Einblicke in die Systemeffizienz und das Verhalten unter produktionsähnlichen Bedingungen ermöglicht.  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/vdb4_0caee3b201.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Abbildung: QPS und Recall von Pinecone vs. Elasticsearch im Cohere 10M Streaming Test nach Optimierung (500 rows/s Ingestion Rate)</em></p>
<p>Wie in unseren Tests gezeigt, übertraf Elasticsearch Pinecone in der QPS nach der Indexoptimierung. Aber wenn die x-Achse die tatsächlich verstrichene Zeit widerspiegelt, wird deutlich, dass Elasticsearch deutlich länger brauchte, um diese Leistung zu erreichen. In der Produktion ist diese Verzögerung von Bedeutung. Dieser Vergleich zeigt einen wichtigen Kompromiss: Spitzendurchsatz vs. Time-to-Serve.</p>
<h3 id="🔬-Modern-Datasets-That-Reflect-Current-AI-Workloads" class="common-anchor-header">🔬 Moderne Datensätze, die aktuelle KI-Arbeitslasten widerspiegeln</h3><p>Wir haben die für das Benchmarking von Vektordatenbanken verwendeten Datensätze komplett überarbeitet. Anstelle von veralteten Testsätzen wie SIFT und GloVe verwendet VDBBench Vektoren, die von hochmodernen Einbettungsmodellen wie OpenAI und Cohere generiert wurden, die die heutigen KI-Anwendungen antreiben.</p>
<p>Um die Relevanz insbesondere für Anwendungsfälle wie Retrieval-Augmented Generation (RAG) zu gewährleisten, haben wir Korpora ausgewählt, die reale Unternehmens- und domänenspezifische Szenarien widerspiegeln:</p>
<table>
<thead>
<tr><th></th><th></th><th></th><th></th><th></th></tr>
</thead>
<tbody>
<tr><td><strong>Korpus</strong></td><td><strong>Einbettungsmodell</strong></td><td><strong>Abmessungen</strong></td><td><strong>Größe</strong></td><td><strong>Anwendungsfall</strong></td></tr>
<tr><td>Wikipedia</td><td>Cohere V2</td><td>768</td><td>1M / 10M</td><td>Allgemeine Wissensbasis</td></tr>
<tr><td>BioASQ</td><td>Cohere V3</td><td>1024</td><td>1M / 10M</td><td>Domänenspezifisch (biomedizinisch)</td></tr>
<tr><td>C4</td><td>OpenAI</td><td>1536</td><td>500K / 5M</td><td>Webbasierte Textverarbeitung</td></tr>
<tr><td>MSMarco V2</td><td>udever-bloom-1b1</td><td>1536</td><td>1M / 10M / 138M</td><td>Groß angelegte Suche</td></tr>
</tbody>
</table>
<p>Diese Datensätze simulieren die heutigen hochvolumigen, hochdimensionalen Vektordaten besser und ermöglichen realistische Tests der Speichereffizienz, Abfrageleistung und Abrufgenauigkeit unter Bedingungen, die modernen KI-Arbeitslasten entsprechen.</p>
<h3 id="⚙️-Custom-Dataset-Support-for-Industry-Specific-Testing" class="common-anchor-header">⚙️ Unterstützung benutzerdefinierter Datensätze für branchenspezifische Tests</h3><p>Jedes Unternehmen ist einzigartig. Die Finanzbranche benötigt vielleicht Tests, die sich auf Transaktionseinbettungen konzentrieren, während soziale Plattformen mehr Wert auf Vektoren des Nutzerverhaltens legen. Mit VDBBench können Sie Benchmarks mit Ihren eigenen Daten durchführen, die aus Ihren spezifischen Einbettungsmodellen für Ihre spezifischen Workloads generiert wurden.</p>
<p>Sie können sie anpassen:</p>
<ul>
<li><p>Vektordimensionen und Datentypen</p></li>
<li><p>Metadatenschema und Filterungsmuster</p></li>
<li><p>Datenvolumen und Ingestionsmuster</p></li>
<li><p>Abfrageverteilungen, die Ihrem Produktionsverkehr entsprechen</p></li>
</ul>
<p>Schließlich erzählt kein Datensatz eine bessere Geschichte als Ihre eigenen Produktionsdaten.</p>
<h2 id="How-VDBBench-Measures-What-Actually-Matters-in-Production" class="common-anchor-header">Wie VDBBench das misst, was in der Produktion wirklich wichtig ist<button data-href="#How-VDBBench-Measures-What-Actually-Matters-in-Production" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Production-Focused-Metric-Design" class="common-anchor-header">Produktionsorientiertes Metrikdesign</h3><p>VDBBench legt den Schwerpunkt auf Metriken, die die reale Leistung widerspiegeln, nicht nur auf Laborergebnisse. Wir haben das Benchmarking auf das ausgerichtet, was in Produktionsumgebungen wirklich wichtig ist: <strong>Zuverlässigkeit unter Last, Latenzzeiten am Ende der Strecke, anhaltender Durchsatz und Erhaltung der Genauigkeit.</strong></p>
<ul>
<li><p><strong>P95/P99 Latenz für echte Benutzererfahrung</strong>: Die durchschnittliche/mittlere Latenz verdeckt die Ausreißer, die echte Benutzer frustrieren und auf eine zugrunde liegende Systeminstabilität hinweisen können. VDBBench konzentriert sich auf die Endlatenz wie P95/P99 und zeigt auf, welche Leistung 95 % oder 99 % Ihrer Abfragen tatsächlich erreichen. Dies ist von entscheidender Bedeutung für die SLA-Planung und das Verständnis der Worst-Case-Benutzererfahrung.</p></li>
<li><p><strong>Nachhaltiger Durchsatz unter Last</strong>: Ein System, das 5 Sekunden lang eine gute Leistung erbringt, reicht in der Produktion nicht aus. VDBBench erhöht schrittweise die Gleichzeitigkeit, um den maximalen nachhaltigen Abfragedurchsatz Ihrer Datenbank (<code translate="no">max_qps</code>) zu ermitteln - nicht die Spitzenzahl unter kurzen, idealen Bedingungen. Diese Methode zeigt, wie gut Ihr System im Laufe der Zeit funktioniert, und hilft bei der realistischen Kapazitätsplanung.</p></li>
<li><p><strong>Abruf im Gleichgewicht mit der Leistung</strong>: Geschwindigkeit ohne Genauigkeit ist bedeutungslos. Jede Leistungszahl in VDBBench ist mit Rückrufmessungen gepaart, so dass Sie genau wissen, wie viel Relevanz Sie für den Durchsatz opfern. Dies ermöglicht faire Vergleiche zwischen Systemen mit sehr unterschiedlichen internen Kompromissen.</p></li>
</ul>
<h3 id="Test-Methodology-That-Reflects-Reality" class="common-anchor-header">Realitätsnahe Testmethodik</h3><p>Eine wichtige Neuerung im Design von VDBBench ist die Trennung von seriellen und gleichzeitigen Tests, die dazu beiträgt, das Verhalten von Systemen unter verschiedenen Arten von Last zu erfassen und Leistungsmerkmale aufzuzeigen, die für verschiedene Anwendungsfälle wichtig sind.</p>
<p><strong>Trennung der Latenzmessung:</strong></p>
<ul>
<li><p><code translate="no">serial_latency_p99</code> misst die Systemleistung bei minimaler Last, bei der jeweils nur eine Anfrage verarbeitet wird. Dies stellt das Best-Case-Szenario für die Latenz dar und hilft bei der Ermittlung der grundlegenden Systemfähigkeiten.</p></li>
<li><p><code translate="no">conc_latency_p99</code> Erfassung des Systemverhaltens unter realistischen Bedingungen mit hoher Gleichzeitigkeit, bei denen mehrere Anfragen gleichzeitig eintreffen und um die Systemressourcen konkurrieren.</p></li>
</ul>
<p><strong>Zwei-Phasen-Benchmark-Struktur</strong>:</p>
<ol>
<li><p><strong>Serieller Test</strong>: Einzelprozess-Lauf von 1.000 Abfragen, der die Basisleistung und -genauigkeit ermittelt und sowohl <code translate="no">serial_latency_p99</code> als auch Recall ausweist. Diese Phase hilft, die theoretische Leistungsgrenze zu ermitteln.</p></li>
<li><p><strong>Gleichzeitigkeitstest</strong>: Simuliert die Produktionsumgebung unter anhaltender Last mit mehreren wichtigen Innovationen:</p>
<ul>
<li><p><strong>Realistische Client-Simulation</strong>: Jeder Testprozess arbeitet unabhängig mit einer eigenen Verbindung und einem eigenen Abfragesatz, so dass Störungen durch gemeinsame Zustände, die die Ergebnisse verfälschen könnten, vermieden werden.</p></li>
<li><p><strong>Synchronisierter Start</strong>: Alle Prozesse beginnen gleichzeitig, wodurch sichergestellt wird, dass die gemessene QPS genau die angegebenen Gleichzeitigkeitsgrade widerspiegelt</p></li>
<li><p><strong>Unabhängige Abfragesätze</strong>: Verhindert unrealistische Cache-Trefferraten, die die Vielfalt der Abfragen in der Produktion nicht widerspiegeln</p></li>
</ul></li>
</ol>
<p>Diese sorgfältig strukturierten Methoden stellen sicher, dass die von VDBBench gemeldeten Werte <code translate="no">max_qps</code> und <code translate="no">conc_latency_p99</code> sowohl genau als auch produktionsrelevant sind und aussagekräftige Erkenntnisse für die Planung der Produktionskapazität und das Systemdesign liefern.</p>
<h2 id="Getting-Started-with-VDBBench-10" class="common-anchor-header">Erste Schritte mit VDBBench 1.0<button data-href="#Getting-Started-with-VDBBench-10" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>VDBBench 1.0</strong> stellt einen grundlegenden Wandel in Richtung produktionsrelevantes Benchmarking dar. Durch das kontinuierliche Schreiben von Daten, die Filterung von Metadaten mit unterschiedlicher Selektivität und Streaming-Lasten bei gleichzeitigen Zugriffsmustern bietet sie die größte Annäherung an reale Produktionsumgebungen, die heute verfügbar sind.</p>
<p>Die Diskrepanz zwischen den Benchmark-Ergebnissen und der realen Leistung sollte kein Ratespiel sein. Wenn Sie planen, eine Vektordatenbank in der Produktion einzusetzen, sollten Sie wissen, wie sie über idealisierte Labortests hinaus funktioniert. VDBBench ist quelloffen und transparent und wurde entwickelt, um aussagekräftige Vergleiche zu ermöglichen, bei denen alle Beteiligten gleich gut abschneiden.</p>
<p>Lassen Sie sich nicht von beeindruckenden Zahlen beeindrucken, die sich nicht auf den Produktionswert übertragen lassen. <strong>Verwenden Sie VDBBench 1.0, um Szenarien zu testen, die für Ihr Unternehmen wichtig sind, mit Ihren Daten und unter Bedingungen, die Ihre tatsächliche Arbeitslast widerspiegeln.</strong> Die Zeit der irreführenden Benchmarks bei der Evaluierung von Vektordatenbanken ist vorbei - es ist an der Zeit, Entscheidungen auf der Grundlage produktionsrelevanter Daten zu treffen.</p>
<p><strong>Testen Sie VDBBench mit Ihren eigenen Workloads:</strong><a href="https://github.com/zilliztech/VectorDBBench"> https://github.com/zilliztech/VectorDBBench</a></p>
<p><strong>Sehen Sie sich die Testergebnisse der wichtigsten Vektordatenbanken an:</strong><a href="https://zilliz.com/vdbbench-leaderboard?dataset=vectorSearch"> VDBBench-Rangliste</a></p>
<p>Haben Sie Fragen oder möchten Sie Ihre Ergebnisse mitteilen? Beteiligen Sie sich an der Diskussion auf<a href="https://github.com/zilliztech/VectorDBBench"> GitHub</a> oder verbinden Sie sich mit unserer Community auf<a href="https://discord.com/invite/FG6hMJStWu"> Discord</a>.</p>
