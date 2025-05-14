---
id: benchmarks-lie-vector-dbs-deserve-a-real-test.md
title: Benchmarks lügen - Vektor-DBs verdienen einen echten Test
author: Min Tian
date: 2025-05-14T00:00:00.000Z
desc: >-
  Entdecken Sie die Leistungslücke in Vektordatenbanken mit VDBBench. Unser Tool
  testet unter realen Produktionsszenarien und stellt sicher, dass Ihre
  KI-Anwendungen reibungslos und ohne unerwartete Ausfallzeiten laufen.
cover: >-
  assets.zilliz.com/Benchmarks_Lie_Vector_D_Bs_Deserve_a_Real_Test_9280c66efc.png
tag: Engineering
recommend: true
publishToMedium: true
tags: 'Milvus, vector database, vector search, AI Agents, LLM'
meta_keywords: >-
  Vector database, vectordbbench, vector database benchmark, vector search
  performance
meta_title: |
  Benchmarks Lie — Vector DBs Deserve a Real Test
origin: 'https://milvus.io/blog/benchmarks-lie-vector-dbs-deserve-a-real-test.md'
---
<h2 id="The-Vector-Database-You-Chose-Based-on-Benchmarks-Might-Fail-in-Production" class="common-anchor-header">Die Vektordatenbank, die Sie anhand von Benchmarks ausgewählt haben, könnte in der Produktion versagen<button data-href="#The-Vector-Database-You-Chose-Based-on-Benchmarks-Might-Fail-in-Production" class="anchor-icon" translate="no">
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
    </button></h2><p>Bei der Auswahl einer <a href="https://milvus.io/blog/what-is-a-vector-database.md">Vektordatenbank</a> für Ihre KI-Anwendung sind herkömmliche Benchmarks so, als würden Sie einen Sportwagen auf einer leeren Strecke testen, nur um dann festzustellen, dass er im Berufsverkehr stecken bleibt. Die unbequeme Wahrheit? Die meisten Benchmarks bewerten die Leistung nur unter künstlichen Bedingungen, die es in Produktionsumgebungen nie gibt.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Benchmarks_Lie_Vector_D_Bs_Deserve_a_Real_Test_9280c66efc.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Die meisten Benchmarks testen Vektordatenbanken <strong>, nachdem</strong> alle Daten eingespeist wurden und der Index vollständig aufgebaut ist. Aber in der Produktion hören die Daten nie auf zu fließen. Sie können Ihr System nicht stundenlang unterbrechen, nur um einen Index neu zu erstellen.</p>
<p>Wir haben die Unterbrechung aus erster Hand erfahren. Elasticsearch zum Beispiel mag mit Abfragegeschwindigkeiten im Millisekundenbereich prahlen, aber hinter den Kulissen haben wir beobachtet, dass es <strong>über 20 Stunden</strong> braucht, um den Index zu optimieren. Das ist eine Ausfallzeit, die sich kein Produktionssystem leisten kann, insbesondere bei KI-Workloads, die kontinuierliche Aktualisierungen und sofortige Antworten erfordern.</p>
<p>Bei Milvus haben wir nach unzähligen Proof of Concept (PoC)-Evaluierungen mit Unternehmenskunden ein beunruhigendes Muster aufgedeckt: <strong>Vektordatenbanken, die in kontrollierten Laborumgebungen hervorragend funktionieren, haben häufig Probleme unter tatsächlichen Produktionslasten.</strong> Diese kritische Lücke frustriert nicht nur Infrastrukturingenieure - sie kann ganze KI-Initiativen zum Scheitern bringen, die auf diesen irreführenden Leistungsversprechen aufbauen.</p>
<p>Aus diesem Grund haben wir <a href="https://github.com/zilliztech/VectorDBBench">VDBBench</a> entwickelt: einen Open-Source-Benchmark, der von Grund auf so konzipiert wurde, dass er die Produktionsrealität simuliert. Im Gegensatz zu synthetischen Tests, bei denen einzelne Szenarien ausgewählt werden, durchläuft VDBBench Datenbanken durch kontinuierliche Ingestion, strenge Filterbedingungen und verschiedene Szenarien, genau wie Ihre tatsächlichen Produktionsworkloads. Unsere Mission ist einfach: Ingenieuren ein Tool an die Hand zu geben, das zeigt, wie Vektordatenbanken unter realen Bedingungen tatsächlich funktionieren, damit Sie Infrastrukturentscheidungen auf der Grundlage verlässlicher Zahlen treffen können.</p>
<h2 id="The-Gap-between-Benchmarks-and-Reality" class="common-anchor-header">Die Lücke zwischen Benchmarks und der Realität<button data-href="#The-Gap-between-Benchmarks-and-Reality" class="anchor-icon" translate="no">
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
    </button></h2><p>Herkömmliche Benchmarking-Ansätze leiden unter drei kritischen Mängeln, die ihre Ergebnisse für die Entscheidungsfindung in der Produktion praktisch bedeutungslos machen:</p>
<h3 id="1-Outdated-Data" class="common-anchor-header">1. Veraltete Daten</h3><p>Viele Benchmarks stützen sich immer noch auf veraltete Datensätze wie SIFT oder<a href="https://zilliz.com/glossary/glove"> GloVe</a>, die wenig Ähnlichkeit mit den heutigen komplexen, hochdimensionalen Vektoreinbettungen haben, die von KI-Modellen erzeugt werden. Bedenken Sie dies: SIFT enthält 128-dimensionale Vektoren, während die beliebten Einbettungen der Einbettungsmodelle von OpenAI zwischen 768 und 3072 Dimensionen liegen.</p>
<h3 id="2-Vanity-Metrics" class="common-anchor-header">2. Eitle Metriken</h3><p>Viele Benchmarks konzentrieren sich ausschließlich auf die durchschnittliche Latenzzeit oder die Spitzen-QPS, was ein verzerrtes Bild ergibt. Diese idealisierten Metriken erfassen nicht die Ausreißer und Inkonsistenzen, die tatsächliche Benutzer in Produktionsumgebungen erleben. Was nützt beispielsweise eine beeindruckende QPS-Zahl, wenn sie unbegrenzte Rechenressourcen erfordert, die Ihr Unternehmen in den Ruin treiben würden?</p>
<h3 id="3-Oversimplified-Scenarios" class="common-anchor-header">3. Zu stark vereinfachte Szenarien</h3><p>Die meisten Benchmarks testen nur grundlegende, statische Arbeitslasten - im Wesentlichen die "Hello World" der Vektorsuche. So werden beispielsweise Suchanfragen erst dann gestellt, wenn der gesamte Datensatz aufgenommen und indiziert ist, und die dynamische Realität ignoriert, in der Benutzer suchen, während neue Daten einströmen. Dieses vereinfachte Design übersieht die komplexen Muster, die reale Produktionssysteme definieren, wie z. B. gleichzeitige Abfragen, gefilterte Suchen und kontinuierliche Dateneingabe.</p>
<p>Als wir diese Mängel erkannten, wurde uns klar, dass die Branche einen <strong>radikalen Wechsel in der Benchmarking-Philosophie</strong>brauchte <strong>- einen Wechsel,</strong>der sich darauf stützt, wie sich KI-Systeme in der Praxis tatsächlich verhalten. Aus diesem Grund haben wir <a href="https://github.com/zilliztech/VectorDBBench">VDBBench</a> entwickelt.</p>
<h2 id="From-Lab-to-Production-How-VDBBench-Bridges-the-Gap" class="common-anchor-header">Vom Labor zur Produktion: Wie VDBBench die Lücke überbrückt<button data-href="#From-Lab-to-Production-How-VDBBench-Bridges-the-Gap" class="anchor-icon" translate="no">
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
    </button></h2><p>VDBBench wiederholt nicht nur veraltete Benchmarking-Philosophien, sondern baut das Konzept von Grund auf neu auf - mit einem Leitgedanken: <strong>Ein Benchmark ist nur dann wertvoll, wenn er das tatsächliche Produktionsverhalten vorhersagt</strong>.</p>
<p>Wir haben VDBBench so entwickelt, dass es die realen Bedingungen in drei kritischen Dimensionen originalgetreu nachbildet: Datenauthentizität, Arbeitslastmuster und Leistungsmessung.</p>
<h3 id="Modernizing-the-Dataset" class="common-anchor-header">Modernisierung des Datensatzes</h3><p>Wir haben die für das vectorDB-Benchmarking verwendeten Datensätze komplett überarbeitet. Anstelle von veralteten Testsätzen wie SIFT und GloVe verwendet VDBBench Vektoren, die aus modernen Einbettungsmodellen generiert wurden, die die heutigen KI-Anwendungen antreiben.</p>
<p>Um Relevanz zu gewährleisten, insbesondere für Anwendungsfälle wie Retrieval-Augmented Generation (RAG), haben wir Korpora ausgewählt, die reale Unternehmens- und Domänenszenarien widerspiegeln. Diese reichen von allgemeinen Wissensdatenbanken bis hin zu vertikalen Anwendungen wie der Beantwortung biomedizinischer Fragen und der Websuche in großem Maßstab.</p>
<table>
<thead>
<tr><th></th><th></th><th></th><th></th></tr>
</thead>
<tbody>
<tr><td><strong>Korpus</strong></td><td><strong>Einbettungsmodell</strong></td><td><strong>Abmessungen</strong></td><td><strong>Größe</strong></td></tr>
<tr><td>Wikipedia</td><td>Cohere V2</td><td>768</td><td>1M / 10M</td></tr>
<tr><td>BioASQ</td><td>Cohere V3</td><td>1024</td><td>1M / 10M</td></tr>
<tr><td>C4</td><td>OpenAI</td><td>1536</td><td>500K / 5M</td></tr>
<tr><td>MSMarco V2</td><td>udever-bloom-1b1</td><td>1536</td><td>1M / 10M / 138M</td></tr>
</tbody>
</table>
<p>Tabelle: In VDBBench verwendete Datensätze</p>
<p>VDBBench unterstützt auch benutzerdefinierte Datensätze, so dass Sie Benchmarks mit Ihren eigenen Daten durchführen können, die aus Ihren spezifischen Einbettungsmodellen für Ihre spezifischen Workloads generiert wurden. Schließlich erzählt kein Datensatz eine bessere Geschichte als Ihre eigenen Produktionsdaten.</p>
<h3 id="Production-Focused-Metric-Design" class="common-anchor-header">Produktionsorientiertes Metrikdesign</h3><p><strong>VDBBench legt den Schwerpunkt auf Metriken, die die Leistung in der Praxis widerspiegeln, nicht nur auf Laborergebnisse.</strong> Wir haben das Benchmarking auf das ausgerichtet, was in Produktionsumgebungen tatsächlich wichtig ist: Zuverlässigkeit unter Last, Tail-Latenz, anhaltender Durchsatz und Genauigkeit.</p>
<ul>
<li><p><strong>P95/P99-Latenz zur Messung der tatsächlichen Benutzererfahrung</strong>: Die durchschnittliche/mittlere Latenz verdeckt die Ausreißer, die echte Benutzer frustrieren. Deshalb konzentriert sich VDBBench auf die Tail-Latenz wie P95/P99 und zeigt auf, welche Leistung 95 % oder 99 % Ihrer Abfragen tatsächlich erreichen werden.</p></li>
<li><p><strong>Nachhaltiger Durchsatz unter Last:</strong> Ein System, das 5 Sekunden lang eine gute Leistung erbringt, reicht in der Produktion nicht aus. VDBBench erhöht allmählich die Gleichzeitigkeit, um den maximalen nachhaltigen Abfragedurchsatz Ihrer Datenbank (<code translate="no">max_qps</code>) zu ermitteln - nicht die Spitzenzahl unter kurzen, idealen Bedingungen. Dies zeigt, wie gut Ihr System im Laufe der Zeit funktioniert.</p></li>
<li><p><strong>Rückruf im Gleichgewicht mit Leistung:</strong> Geschwindigkeit ohne Genauigkeit ist bedeutungslos. Jeder Leistungswert in VDBBench ist mit dem Recall-Wert gepaart, so dass Sie genau wissen, wie viel Relevanz Sie für den Durchsatz opfern. Dies ermöglicht faire Vergleiche zwischen Systemen mit sehr unterschiedlichen internen Kompromissen.</p></li>
</ul>
<h3 id="Test-Methodology-That-Reflects-Reality" class="common-anchor-header">Realitätsnahe Testmethodik</h3><p>Eine wichtige Neuerung im Design von VDBBench ist die <strong>Trennung von seriellen und gleichzeitigen Tests</strong>, die dabei helfen, das Verhalten von Systemen unter verschiedenen Arten von Last zu erfassen. Die Latenzmetriken sind zum Beispiel wie folgt unterteilt:</p>
<ul>
<li><p><code translate="no">serial_latency_p99</code> misst die Systemleistung bei minimaler Last, bei der jeweils nur eine Anfrage verarbeitet wird. Dies stellt das <em>Best-Case-Szenario</em> für die Latenzzeit dar.</p></li>
<li><p><code translate="no">conc_latency_p99</code> Erfassung des Systemverhaltens unter <em>realistischen Bedingungen mit hoher Gleichzeitigkeit</em>, bei denen mehrere Anfragen gleichzeitig eingehen.</p></li>
</ul>
<h3 id="Two-Benchmark-Phases" class="common-anchor-header">Zwei Benchmark-Phasen</h3><p>VDBBench unterteilt die Tests in zwei entscheidende Phasen:</p>
<ol>
<li><strong>Serieller Test</strong></li>
</ol>
<p>Hierbei handelt es sich um einen Einzelprozesslauf mit 1.000 Abfragen. In dieser Phase wird eine Grundlinie für die ideale Leistung und Genauigkeit festgelegt, wobei sowohl <code translate="no">serial_latency_p99</code> als auch Recall erfasst werden.</p>
<ol start="2">
<li><strong>Gleichzeitigkeitstest</strong></li>
</ol>
<p>In dieser Phase wird eine Produktionsumgebung unter anhaltender Last simuliert.</p>
<ul>
<li><p><strong>Realistische Client-Simulation</strong>: Jeder Testprozess arbeitet unabhängig mit seiner eigenen Verbindung und seinem eigenen Abfragesatz. Dadurch werden Störungen durch gemeinsam genutzte Zustände (z. B. Cache) vermieden, die die Ergebnisse verfälschen könnten.</p></li>
<li><p><strong>Synchronisierter Start</strong>: Alle Prozesse beginnen gleichzeitig, wodurch sichergestellt wird, dass die gemessene QPS den geforderten Gleichzeitigkeitsgrad genau widerspiegelt.</p></li>
</ul>
<p>Diese sorgfältig strukturierten Methoden stellen sicher, dass die von VDBBench gemeldeten Werte <code translate="no">max_qps</code> und <code translate="no">conc_latency_p99</code> sowohl <strong>genau als auch produktionsrelevant</strong> sind und somit aussagekräftige Erkenntnisse für die Planung der Produktionskapazität und das Systemdesign liefern.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_QPS_and_Latency_of_Milvus_16c64g_standalone_at_Varying_Concurrency_Levels_Cohere_1_M_Test_7f2294e87a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Abbildung: QPS und Latenz von Milvus-16c64g-standalone bei verschiedenen Gleichzeitigkeitsgraden (Cohere 1M Test). In diesem Test ist Milvus anfangs unterausgelastet - bis zur</em> <strong><em>Gleichzeitigkeitsstufe 20</em></strong><em>. Eine Erhöhung der Gleichzeitigkeit verbessert die Systemauslastung und führt zu einer höheren QPS. Jenseits der</em> <strong><em>Gleichzeitigkeitsstufe 20</em></strong><em> erreicht das System die Volllast: Weitere Erhöhungen der Gleichzeitigkeit verbessern den Durchsatz nicht mehr, und die Latenz steigt aufgrund von Warteschlangenverzögerungen an.</em></p>
<h2 id="Beyond-Searching-Static-Data-The-Real-Production-Scenarios" class="common-anchor-header">Jenseits der Suche nach statischen Daten: Die echten Produktionsszenarien<button data-href="#Beyond-Searching-Static-Data-The-Real-Production-Scenarios" class="anchor-icon" translate="no">
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
    </button></h2><p>Soweit wir wissen, ist VDBBench das einzige Benchmark-Tool, das Vektordatenbanken über das gesamte Spektrum der produktionskritischen Szenarien hinweg testet, einschließlich statischer Sammlung, Filterung und Streaming.</p>
<h3 id="Static-Collection" class="common-anchor-header">Statische Sammlung</h3><p>Im Gegensatz zu anderen Benchmarks, die überstürzt mit dem Testen beginnen, stellt VDBBench zunächst sicher, dass jede Datenbank ihre Indizes vollständig optimiert hat - eine kritische Produktionsvoraussetzung, die viele Benchmarks oft vernachlässigen. So erhalten Sie ein vollständiges Bild:</p>
<ul>
<li><p>Dateneingabezeit</p></li>
<li><p>Indizierungszeit (die Zeit, die für den Aufbau eines optimierten Index benötigt wird, was die Suchleistung erheblich beeinflusst)</p></li>
<li><p>Suchleistung bei vollständig optimierten Indizes sowohl unter seriellen als auch unter gleichzeitigen Bedingungen</p></li>
</ul>
<h3 id="Filtering" class="common-anchor-header">Filtern</h3><p>Die Vektorsuche in der Produktion erfolgt selten isoliert. In realen Anwendungen wird die Vektorähnlichkeit mit der Filterung von Metadaten kombiniert ("Suche nach Schuhen, die wie dieses Foto aussehen, aber weniger als 100 Dollar kosten"). Diese gefilterte Vektorsuche schafft einzigartige Herausforderungen:</p>
<ul>
<li><p><strong>Filterkomplexität</strong>: Mehr skalare Spalten und logische Bedingungen erhöhen die Anforderungen an die Rechenleistung</p></li>
<li><p><strong>Selektivität der Filter</strong>: <a href="https://milvus.io/blog/how-to-filter-efficiently-without-killing-recall.md">Unsere Produktionserfahrung</a> zeigt, dass dies der versteckte Leistungskiller ist - die Abfragegeschwindigkeit kann um Größenordnungen schwanken, je nachdem wie selektiv die Filter sind.</p></li>
</ul>
<p>VDBBench bewertet systematisch die Filterleistung in verschiedenen Selektivitätsstufen (von 50 % bis 99,9 %) und liefert so ein umfassendes Profil, wie Datenbanken mit diesem kritischen Produktionsmuster umgehen.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_QPS_and_Recall_of_Milvus_and_Open_Search_Across_Different_Filter_Selectivity_Levels_Cohere_1_M_Test_4b5df2244d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Abbildung: QPS und Recall von Milvus und OpenSearch über verschiedene Filterselektivitätsstufen hinweg (Cohere 1M Test). Die X-Achse stellt den Prozentsatz der gefilterten Daten dar. Wie gezeigt, behält Milvus über alle Filterselektivitätsstufen hinweg eine gleichbleibend hohe Rückrufquote bei, während OpenSearch eine instabile Leistung aufweist, bei der die Rückrufquote unter verschiedenen Filterbedingungen erheblich schwankt.</em></p>
<h3 id="Streaming" class="common-anchor-header">Streaming</h3><p>Produktionssysteme genießen selten den Luxus statischer Daten. Während der Ausführung von Suchvorgängen fließen ständig neue Informationen ein - ein Szenario, bei dem viele ansonsten beeindruckende Datenbanken zusammenbrechen.</p>
<p>Der einzigartige Streaming-Testfall von VDBBench untersucht die Leistung bei der Suche während des Einfügens und misst:</p>
<ol>
<li><p><strong>Auswirkungen des wachsenden Datenvolumens</strong>: Wie die Suchleistung mit zunehmender Datengröße skaliert.</p></li>
<li><p><strong>Auswirkung der Schreiblast</strong>: Wie sich gleichzeitige Schreibvorgänge auf die Suchlatenz und den Durchsatz auswirken, da Schreibvorgänge auch CPU- oder Speicherressourcen im System beanspruchen.</p></li>
</ol>
<p>Streaming-Szenarien stellen einen umfassenden Stresstest für jede Vektordatenbank dar. Aber es ist nicht trivial, dafür einen <em>fairen</em> Benchmark zu erstellen. Es reicht nicht aus, zu beschreiben, wie sich ein System verhält - wir brauchen ein konsistentes Bewertungsmodell, das einen <strong>direkten Vergleich</strong> zwischen verschiedenen Datenbanken ermöglicht.</p>
<p>Auf der Grundlage unserer Erfahrung mit der Unterstützung von Unternehmen bei realen Implementierungen haben wir einen strukturierten, wiederholbaren Ansatz entwickelt. Mit VDBBench:</p>
<ul>
<li><p>Sie <strong>definieren eine feste Einfügerate</strong>, die Ihre Ziel-Produktionsauslastung widerspiegelt.</p></li>
<li><p>VDBBench wendet dann <strong>einen identischen Lastdruck</strong> auf alle Systeme an, so dass die Leistungsergebnisse direkt vergleichbar sind.</p></li>
</ul>
<p>Beispiel: Ein Cohere-Datensatz mit 10 Millionen Zeilen und einem Einfügeziel von 500 Zeilen/Sekunde:</p>
<ul>
<li><p>VDBBench startet 5 parallele Erzeugerprozesse, die jeweils 100 Zeilen pro Sekunde einfügen.</p></li>
<li><p>Nachdem jeweils 10 % der Daten eingespeist wurden, löst VDBBench eine Runde von Suchtests unter seriellen und gleichzeitigen Bedingungen aus.</p></li>
<li><p>Metriken wie Latenz, QPS und Recall werden nach jeder Phase aufgezeichnet.</p></li>
</ul>
<p>Diese kontrollierte Methodik zeigt, wie sich die Leistung jedes Systems im Laufe der Zeit und unter echter Betriebsbelastung entwickelt, und gibt Ihnen den Einblick, den Sie für skalierbare Infrastrukturentscheidungen benötigen.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/igure_QPS_and_Recall_of_Pinecone_vs_Elasticsearch_in_the_Cohere_10_M_Streaming_Test_500_rows_s_Ingestion_Rate_548fc02f24.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Abbildung: QPS und Recall von Pinecone vs. Elasticsearch im Cohere 10M Streaming Test (500 rows/s Ingestion Rate). Pinecone behielt höhere QPS und Recall bei und zeigte eine signifikante QPS-Verbesserung nach dem Einfügen von 100% der Daten.</em></p>
<p>Aber das ist noch nicht das Ende der Geschichte. VDBBench geht sogar noch weiter, indem es einen optionalen Optimierungsschritt unterstützt, der es den Benutzern ermöglicht, die Streaming-Suchleistung vor und nach der Indexoptimierung zu vergleichen. Außerdem wird die tatsächlich für jede Stufe aufgewendete Zeit aufgezeichnet und berichtet, was tiefere Einblicke in die Systemeffizienz und das Verhalten unter produktionsähnlichen Bedingungen ermöglicht.</p>
<p><span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_QPS_and_Recall_of_Pinecone_vs_Elasticsearch_in_the_Cohere_10_M_Streaming_Test_After_Optimization_500_rows_s_Ingestion_Rate_d249d290bb.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Abbildung: QPS und Recall von Pinecone vs. Elasticsearch im Cohere 10M Streaming Test nach Optimierung (500 rows/s Ingestion Rate)</em></p>
<p>Wie aus dem Diagramm hervorgeht, übertraf ElasticSearch Pinecone bei der QPS nach der Indexoptimierung. Ein Wunder? Nicht ganz. Das rechte Diagramm erzählt die ganze Geschichte: Sobald die x-Achse die tatsächlich verstrichene Zeit widerspiegelt, ist klar, dass ElasticSearch deutlich länger brauchte, um diese Leistung zu erreichen. Und in der Produktion ist diese Verzögerung von Bedeutung. Dieser Vergleich zeigt einen wichtigen Kompromiss: Spitzendurchsatz vs. Time-to-Serve.</p>
<h2 id="Choose-Your-Vector-Database-with-Confidence" class="common-anchor-header">Wählen Sie Ihre Vektordatenbank mit Zuversicht<button data-href="#Choose-Your-Vector-Database-with-Confidence" class="anchor-icon" translate="no">
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
    </button></h2><p>Die Diskrepanz zwischen Benchmark-Ergebnissen und realer Leistung sollte kein Ratespiel sein. VDBBench bietet eine Möglichkeit zur Bewertung von Vektordatenbanken unter realistischen, produktionsähnlichen Bedingungen, einschließlich kontinuierlicher Dateneingabe, Metadatenfilterung und Streaming-Workloads.</p>
<p>Wenn Sie planen, eine Vektordatenbank in der Produktion einzusetzen, sollten Sie wissen, wie sie sich jenseits idealisierter Labortests verhält. VDBBench ist quelloffen und transparent und wurde entwickelt, um aussagekräftige Vergleiche zu ermöglichen, bei denen alle Beteiligten gleich sind.</p>
<p>Testen Sie VDBBench noch heute mit Ihren eigenen Workloads und sehen Sie, wie sich verschiedene Systeme in der Praxis schlagen: <a href="https://github.com/zilliztech/VectorDBBench">https://github.com/zilliztech/VectorDBBench.</a></p>
<p>Haben Sie Fragen oder möchten Sie Ihre Ergebnisse mitteilen? Beteiligen Sie sich an der Diskussion auf<a href="https://github.com/zilliztech/VectorDBBench"> GitHub</a> oder verbinden Sie sich mit unserer Community auf <a href="https://discord.com/invite/FG6hMJStWu">Discord</a>. Wir würden gerne Ihre Meinung hören.</p>
